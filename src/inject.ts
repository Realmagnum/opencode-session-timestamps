import type { Context } from "@opencode/plugin/gui"
import { createEffect, on, onCleanup } from "solid-js"
import { resolveTranslation } from "./i18n"
import { datesEnabled, type StoredSettings } from "./settings"
import { formatAbsolute, formatFull, formatStamp, formatTurn } from "./time"

type SessionEntry = { readonly created: number; readonly updated: number; readonly title?: string }

const sidebarEnabled = (settings: StoredSettings) => settings.sidebar !== false


const SIDEBAR_TOGGLE = 'button[aria-controls="vertical-tabs-sidebar"]'
const COLLAPSED_TOGGLE = '[data-slot="collapsed-sidebar-toggle"]'

const CLOCK_SVG = `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="10" cy="10" r="6.6"/><path d="M10 6.2V10l2.6 1.7"/></svg>`

type Turn = { readonly sent: number; answered?: number }

const HOME_ROW = '[data-component="home-session-row-container"]'
const HOME_BUTTON = '[data-component="home-session-row"]'
const SIDEBAR_ROW = "[data-titlebar-tab-action]"
const TAB_LINK = "[data-titlebar-tab-link]"
const TAB_POPOVER = '[data-component="session-tab-popover"]'
const TAB_POPOVER_TRIGGER = '[data-component="session-tab-popover-trigger"]:hover'
const TIMELINE_ROW = "[data-timeline] [data-timeline-row][data-message-id]"
const SESSION_IN_HREF = /\/session\/(ses_[A-Za-z0-9]+)/
const FALLBACK_TITLE = /^(New session|Child session) - \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/

/** The label the app prints for a session row, matching `displayLabel` in @opencode/util. */
const displayTitle = (title: string | undefined) =>
  title ? (title.match(FALLBACK_TITLE)?.[1] ?? title) : undefined

const REFRESH_LIMIT = 500
const REFRESH_DEBOUNCE = 1_500
const REFRESH_INTERVAL = 60_000

/**
 * Draws times the app itself does not render: a last-activity stamp on Home and
 * sidebar rows, a clock on session tabs, and a send/answer stamp on every
 * transcript turn. The app has no slot for any of them, so the nodes are
 * appended to its DOM and reconciled on mutation.
 */
export function setupDomTimestamps(input: {
  ctx: Context
  settings: () => StoredSettings
  locale: () => string
  translate: (key: string, params?: Record<string, string | number | boolean>) => string
  toggle: () => void
}) {
  if (typeof document === "undefined") return { schedule: () => {} }

  // A session's times by id, from every server. Loaded sessions win; the
  // fetched index covers rows that the store never loaded.
  const index = new Map<string, SessionEntry>()
  const refreshing = new Set<string>()
  const unsubscribes: Array<() => void> = []
  let lastTab: string | undefined
  let refreshTimer: ReturnType<typeof setTimeout> | undefined
  let passFrame: number | undefined
  let stopped = false

  const t = (key: string, params?: Record<string, string | number | boolean>) => {
    const value = input.translate(key, params)

    return value === key ? resolveTranslation(input.locale(), key, params) : value
  }

  const options = () => ({
    locale: input.locale(),
    format: input.settings().format,
    clock: input.settings().clock,
  })

  const timeFor = (sessionID: string): SessionEntry | undefined => {
    for (const serverID of input.ctx.servers.list()) {
      const info = input.ctx.servers.get(serverID)?.data.session.get(sessionID)

      if (info?.time) return { created: info.time.created, updated: info.time.updated ?? info.time.created, title: info.title }
    }

    return index.get(sessionID)
  }

  /** Sessions whose title is unique, so a sidebar row can be matched to one session. */
  const titles = () => {
    const sessions = new Map<string, SessionEntry>()

    for (const serverID of input.ctx.servers.list()) {
      for (const session of input.ctx.servers.get(serverID)?.data.session.list() ?? []) {
        sessions.set(session.id, {
          created: session.time.created,
          updated: session.time.updated ?? session.time.created,
          title: session.title,
        })
      }
    }

    for (const [id, entry] of index) if (!sessions.has(id)) sessions.set(id, entry)

    const counts = new Map<string, number>()

    for (const entry of sessions.values()) {
      const title = displayTitle(entry.title)

      if (!title) continue
      counts.set(title, (counts.get(title) ?? 0) + 1)
    }

    const unique = new Map<string, SessionEntry>()

    for (const entry of sessions.values()) {
      const title = displayTitle(entry.title)

      if (title && counts.get(title) === 1) unique.set(title, entry)
    }

    return unique
  }

  const schedule = () => {
    if (stopped || passFrame !== undefined) return

    passFrame = requestAnimationFrame(() => {
      passFrame = undefined
      render()
    })
  }

  const refreshServer = async (serverID: string) => {
    if (stopped || refreshing.has(serverID)) return

    const client = input.ctx.servers.get(serverID)?.client

    if (!client) return

    refreshing.add(serverID)

    try {
      const response = await client.session.list({ limit: REFRESH_LIMIT, order: "desc", parentID: null })

      if (stopped) return

      for (const session of response.data) {
        index.set(session.id, {
          created: session.time.created,
          updated: session.time.updated ?? session.time.created,
          title: session.title,
        })
      }

      schedule()
    } catch {
      // A remote server may be offline or unauthorized: keep the times the store already has.
    } finally {
      refreshing.delete(serverID)
    }
  }

  const refresh = (delay = 0) => {
    if (stopped) return

    clearTimeout(refreshTimer)
    refreshTimer = setTimeout(() => {
      for (const serverID of input.ctx.servers.list()) void refreshServer(serverID)
    }, delay)
  }

  function remove(kind: string, keepSession?: string) {
    document.querySelectorAll<HTMLElement>(`[data-ocst-kind="${kind}"]`).forEach((element) => {
      if (keepSession && element.dataset.ocstSession === keepSession) return
      element.remove()
    })
  }

  function write(element: HTMLTimeElement, entry: SessionEntry) {
    const text = formatStamp(entry.updated, options())

    if (element.textContent !== text) element.textContent = text

    const title = [
      t("title.created", { time: formatFull(entry.created, input.locale()) }),
      t("title.updated", { time: formatFull(entry.updated, input.locale()) }),
    ].join("\n")

    if (element.title !== title) element.title = title
    element.dateTime = new Date(entry.updated).toISOString()
  }

  function stampRow(parent: HTMLElement, kind: "home" | "sidebar", entry: SessionEntry | undefined) {
    let element = parent.querySelector<HTMLTimeElement>(`:scope > [data-ocst-kind="${kind}"]`)

    if (!entry) {
      element?.remove()

      return
    }

    if (!element) {
      element = document.createElement("time")
      element.dataset.ocstKind = kind
      element.className = kind === "home" ? "ocst-home" : "ocst-side"
      parent.append(element)
    }

    write(element, entry)
  }

  function renderHome() {
    if (!input.settings().home) {
      remove("home")

      return
    }

    document.querySelectorAll<HTMLElement>(HOME_ROW).forEach((container) => {
      const button = container.querySelector<HTMLElement>(HOME_BUTTON)
      const sessionID = container.dataset.sessionId

      if (button) stampRow(button, "home", sessionID ? timeFor(sessionID) : undefined)
    })
  }

  function renderSidebar() {
    const rows = document.querySelectorAll<HTMLElement>(SIDEBAR_ROW)

    if (!sidebarEnabled(input.settings()) || rows.length === 0) {
      if (!sidebarEnabled(input.settings())) remove("sidebar")

      return
    }

    const unique = titles()

    rows.forEach((row) => {
      const title = row.getAttribute("title")?.trim()

      stampRow(row, "sidebar", title ? unique.get(title) : undefined)
    })
  }

  function renderTabs() {
    if (!sidebarEnabled(input.settings())) {
      remove("tab")
      remove("popover")

      return
    }

    document.querySelectorAll<HTMLAnchorElement>(TAB_LINK).forEach((link) => {
      let element = link.querySelector<HTMLTimeElement>(':scope > [data-ocst-kind="tab"]')
      const sessionID = link.getAttribute("href")?.match(SESSION_IN_HREF)?.[1]
      const entry = sessionID ? timeFor(sessionID) : undefined

      if (!entry) {
        element?.remove()

        return
      }

      if (!element) {
        element = document.createElement("time")
        element.dataset.ocstKind = "tab"
        element.className = "ocst-tab"
        link.append(element)
      }

      write(element, entry)
    })

    renderPopover()
  }

  function popoverLine(label: string, value: string) {
    const row = document.createElement("div")
    row.dataset.slot = "row"

    const detail = document.createElement("span")
    detail.dataset.slot = "detail"
    detail.textContent = `${label} \u00b7 ${value}`
    row.append(detail)

    return row
  }

  // The tab preview is app-owned and portalled, so the dates are appended to its
  // content. It is open for the tab under the pointer, which names the session.
  function renderPopover() {
    const popover = document.querySelector<HTMLElement>(TAB_POPOVER)

    if (!popover) return

    const sessionID =
      document.querySelector(TAB_POPOVER_TRIGGER)?.querySelector<HTMLAnchorElement>(TAB_LINK)?.getAttribute("href")?.match(
        SESSION_IN_HREF,
      )?.[1] ?? lastTab
    const entry = sessionID ? timeFor(sessionID) : undefined
    let block = popover.querySelector<HTMLElement>(':scope > [data-ocst-kind="popover"]')

    if (!entry || !sidebarEnabled(input.settings())) {
      block?.remove()

      return
    }

    if (!block) {
      block = document.createElement("div")
      block.dataset.ocstKind = "popover"
      block.className = "ocst-popover"
      block.append(popoverLine("", ""), popoverLine("", ""))
      popover.append(block)
    }

    const lines = block.querySelectorAll<HTMLElement>('[data-slot="detail"]')
    const created = `${t("labels.created")} \u00b7 ${formatAbsolute(entry.created, input.locale())}`
    const updated = `${t("labels.updated")} \u00b7 ${formatAbsolute(entry.updated, input.locale())}`

    if (lines[0] && lines[0].textContent !== created) lines[0].textContent = created
    if (lines[1] && lines[1].textContent !== updated) lines[1].textContent = updated
  }

  function turnsFor(sessionID: string, serverID: string) {
    const turns = new Map<string, Turn>()
    const messages = input.ctx.servers.get(serverID)?.data.session.message.list(sessionID) ?? []
    let current: string | undefined

    for (const message of messages) {
      if (message.type === "user") {
        current = message.id
        turns.set(message.id, { sent: message.time.created })

        continue
      }

      if (message.type !== "assistant" || !current) continue

      const turn = turns.get(current)
      const finished = message.time.completed

      if (turn && finished !== undefined) turn.answered = Math.max(turn.answered ?? 0, finished)
    }

    return turns
  }

  function turnStamp(row: HTMLElement, turn: Turn) {
    const container =
      row.querySelector<HTMLElement>('[data-component="user-message"]')?.closest<HTMLElement>(
        '[data-slot="session-turn-message-container"]',
      ) ?? row.querySelector<HTMLElement>('[data-slot="session-turn-message-container"]')

    if (!container) return

    let wrapper = container.querySelector<HTMLElement>(':scope > [data-ocst-kind="turn"]')

    if (!wrapper) {
      wrapper = document.createElement("div")
      wrapper.dataset.ocstKind = "turn"
      wrapper.className = "ocst-turn"

      const element = document.createElement("time")
      element.className = "ocst-turn-time"
      wrapper.append(element)
      container.prepend(wrapper)
    }

    const element = wrapper.querySelector<HTMLTimeElement>("time")

    if (!element) return

    const text = formatTurn(turn.sent, turn.answered, options())

    if (element.textContent !== text) element.textContent = text

    const title = [
      t("title.sent", { time: formatFull(turn.sent, input.locale()) }),
      turn.answered === undefined
        ? t("title.running")
        : t("title.answered", { time: formatFull(turn.answered, input.locale()) }),
    ].join("\n")

    if (element.title !== title) element.title = title
    wrapper.dataset.ocstSession = row.dataset.messageId ?? ""
    element.dateTime = new Date(turn.answered ?? turn.sent).toISOString()
  }

  function renderMessages() {
    const session = input.ctx.sessions.current()

    if (!input.settings().messages || !session) {
      remove("turn")

      return
    }

    const turns = turnsFor(session.id, session.server.id)

    document.querySelectorAll<HTMLElement>(TIMELINE_ROW).forEach((row) => {
      if (row.dataset.timelineRow !== "UserMessage") return

      const messageID = row.dataset.messageId
      const turn = messageID ? turns.get(messageID) : undefined

      if (turn) turnStamp(row, turn)
      else row.querySelector<HTMLElement>('[data-ocst-kind="turn"]')?.remove()
    })
  }

  // The sidebar header already owns a panel toggle; the dates get their own
  // switch beside it so the whole set can be hidden without opening Settings.
  function renderToggle() {
    const anchor = Array.from(document.querySelectorAll<HTMLElement>(SIDEBAR_TOGGLE)).find(
      (element) => !element.closest(COLLAPSED_TOGGLE),
    )
    const wrapper = anchor?.parentElement
    let button = document.querySelector<HTMLButtonElement>('[data-ocst-kind="toggle"]')

    if (!wrapper || !wrapper.parentElement) {
      button?.remove()

      return
    }

    if (!button) {
      button = document.createElement("button")
      button.dataset.ocstKind = "toggle"
      button.type = "button"
      button.className = "ocst-toggle"
      button.innerHTML = CLOCK_SVG
      button.addEventListener("click", (event) => {
        event.preventDefault()
        event.stopPropagation()
        input.toggle()
      })
    }

    if (button.parentElement !== wrapper.parentElement || button.nextElementSibling !== wrapper) {
      wrapper.parentElement.insertBefore(button, wrapper)
    }

    const on = datesEnabled(input.settings())
    const label = t(on ? "toggle.hide" : "toggle.show")

    button.dataset.on = on ? "true" : "false"
    button.setAttribute("aria-pressed", on ? "true" : "false")
    button.setAttribute("aria-label", label)

    if (button.title !== label) button.title = label
  }

  function render() {
    if (stopped) return

    renderToggle()

    if (!datesEnabled(input.settings())) {
      remove("home")
      remove("sidebar")
      remove("tab")
      remove("popover")
      remove("turn")

      return
    }

    renderHome()
    renderSidebar()
    renderTabs()
    renderMessages()
  }

  const subscribe = () => {
    for (const unsubscribe of unsubscribes.splice(0)) unsubscribe()

    const update = () => refresh(REFRESH_DEBOUNCE)

    for (const serverID of input.ctx.servers.list()) {
      const data = input.ctx.servers.get(serverID)?.data

      if (!data) continue

      unsubscribes.push(
        data.on("session.execution.succeeded", update),
        data.on("session.execution.failed", update),
        data.on("session.execution.interrupted", update),
        data.on("session.renamed", update),
        data.on("session.archived", update),
        data.on("session.deleted", update),
      )
    }
  }

  // The server list is empty until the app interface mounts, and a new server
  // joins later; resubscribe whenever it changes.
  createEffect(
    on(
      () => input.ctx.servers.list().join("\u0000"),
      () => {
        subscribe()
        refresh()
      },
      { defer: true },
    ),
  )

  const observer = new MutationObserver(schedule)
  observer.observe(document.body, { childList: true, subtree: true, characterData: true })

  const trackTab = (event: PointerEvent) => {
    const target = event.target instanceof Element ? event.target : undefined
    const href = target?.closest("[data-titlebar-tab]")?.querySelector<HTMLAnchorElement>(TAB_LINK)?.getAttribute("href")
    const sessionID = href?.match(SESSION_IN_HREF)?.[1]

    if (sessionID) lastTab = sessionID
  }

  document.addEventListener("pointerover", trackTab, true)

  const interval = setInterval(() => {
    if (document.hidden) return
    if (input.settings().home || sidebarEnabled(input.settings())) refresh()
  }, REFRESH_INTERVAL)

  const onVisibility = () => {
    if (document.hidden) return
    schedule()
    refresh()
  }

  document.addEventListener("visibilitychange", onVisibility)
  subscribe()
  refresh()
  schedule()

  onCleanup(() => {
    stopped = true
    observer.disconnect()
    clearInterval(interval)
    clearTimeout(refreshTimer)
    if (passFrame !== undefined) cancelAnimationFrame(passFrame)
    document.removeEventListener("visibilitychange", onVisibility)
    document.removeEventListener("pointerover", trackTab, true)
    for (const unsubscribe of unsubscribes.splice(0)) unsubscribe()
    remove("home")
    remove("sidebar")
    remove("tab")
    remove("popover")
    remove("turn")
    remove("toggle")
  })

  return { schedule }
}

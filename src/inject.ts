import type { Context } from "@opencode/plugin/gui"
import type { SessionMessageInfo } from "@opencode/client/promise"
import { createEffect, on, onCleanup } from "solid-js"
import { resolveTranslation } from "./i18n"
import { contextEnabled, datesEnabled, type StoredSettings } from "./settings"
import { formatAbsolute, formatFull, formatStamp, formatTurn } from "./time"

type SessionEntry = {
  readonly id: string
  readonly created: number
  readonly updated: number
  readonly title?: string
  readonly directory?: string
  readonly serverID?: string
}

type Turn = { readonly sent: number; answered?: number }

type ContextUsage = { readonly percent: number; readonly used: number; readonly limit: number }

const HOME_ROW = '[data-component="home-session-row-container"]'
const HOME_BUTTON = '[data-component="home-session-row"]'
const SIDEBAR_ROW = "[data-titlebar-tab-action]"
const TAB_LINK = "[data-titlebar-tab-link]"
const TIMELINE_ROW = "[data-timeline] [data-timeline-row][data-message-id]"
const TAB_POPOVER = '[data-component="session-tab-popover"]'
const TAB_POPOVER_TRIGGER = '[data-component="session-tab-popover-trigger"]:hover'
const SESSION_IN_HREF = /\/session\/(ses_[A-Za-z0-9]+)/

const sidebarEnabled = (settings: StoredSettings) => settings.sidebar !== false
const FALLBACK_TITLE = /^(New session|Child session) - \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/

const SIDEBAR_TOGGLE = 'button[aria-controls="vertical-tabs-sidebar"]'
const COLLAPSED_TOGGLE = '[data-slot="collapsed-sidebar-toggle"]'

const CLOCK_SVG = `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="10" cy="10" r="6.6"/><path d="M10 6.2V10l2.6 1.7"/></svg>`
const RING_SVG = `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="10" cy="10" r="6.6" opacity="0.35"/><path d="M10 3.4a6.6 6.6 0 0 1 5.72 9.9"/></svg>`

const REFRESH_LIMIT = 500
const REFRESH_DEBOUNCE = 1_500
const REFRESH_INTERVAL = 60_000
const CONTEXT_CONCURRENCY = 2
const CONTEXT_MAX_AGE = 7 * 86_400_000
const VARIANT_SUFFIX = /-(high|medium|low|minimal|max|thinking|xhigh)$/
const RING_RADIUS = 6.25
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

/** The label the app prints for a session row, matching `displayLabel` in @opencode/util. */
const displayTitle = (title: string | undefined) =>
  title ? (title.match(FALLBACK_TITLE)?.[1] ?? title) : undefined

/**
 * Draws times and context rings the app itself does not render: last-activity
 * stamps and rings on Home, sidebar and tab rows, clock and ring switches in
 * the sidebar header, a send/answer clock on transcript turns, and created /
 * updated lines in the tab preview. The app has no slot for any of them, so
 * the nodes are appended to its DOM and reconciled on mutation.
 */
export function setupDomTimestamps(input: {
  ctx: Context
  settings: () => StoredSettings
  locale: () => string
  translate: (key: string, params?: Record<string, string | number | boolean>) => string
  toggle: () => void
  toggleContext: () => void
}) {
  if (typeof document === "undefined") return { schedule: () => {} }

  // A session's times by id, from every server. Loaded sessions win; the
  // fetched index covers rows that the store never loaded.
  const index = new Map<string, SessionEntry>()
  const refreshing = new Set<string>()
  const unsubscribes: Array<() => void> = []
  let refreshTimer: ReturnType<typeof setTimeout> | undefined
  let passFrame: number | undefined
  let stopped = false
  let lastTab: string | undefined

  // Context usage by session id, keyed by the session's `time.updated` so a
  // finished turn refetches while repaints do not.
  const context = new Map<string, { at: number; usage?: ContextUsage }>()
  const contextQueue: Array<{ id: string; serverID: string; at: number; directory?: string }> = []
  const contextQueued = new Set<string>()
  const contextRunning = new Set<string>()
  const contextFetched = new Map<string, number>()
  const CONTEXT_MIN_INTERVAL = 5_000

  const t = (key: string, params?: Record<string, string | number | boolean>) => {
    const value = input.translate(key, params)

    return value === key ? resolveTranslation(input.locale(), key, params) : value
  }

  const options = () => ({
    locale: input.locale(),
    format: input.settings().format,
    clock: input.settings().clock,
  })

  const compact = (value: number) =>
    new Intl.NumberFormat(input.locale(), { notation: "compact", maximumFractionDigits: 0 }).format(value)

  const lookup = (sessionID: string) => {
    for (const serverID of input.ctx.servers.list()) {
      const ref = input.ctx.servers.get(serverID)
      const info = ref?.data.session.get(sessionID)

      if (info?.time) return { ref, info, serverID }
    }

    return undefined
  }

  const timeFor = (sessionID: string): SessionEntry | undefined => {
    const found = lookup(sessionID)

    if (found?.info.time) {
      return {
        id: found.info.id,
        created: found.info.time.created,
        updated: found.info.time.updated ?? found.info.time.created,
        title: found.info.title,
        directory: found.info.location?.directory,
        serverID: found.serverID,
      }
    }

    return index.get(sessionID)
  }

  /** Sessions whose title is unique, so a sidebar row can be matched to one session. */
  const titles = () => {
    const sessions = new Map<string, SessionEntry>()

    for (const serverID of input.ctx.servers.list()) {
      for (const session of input.ctx.servers.get(serverID)?.data.session.list() ?? []) {
        sessions.set(session.id, {
          id: session.id,
          created: session.time.created,
          updated: session.time.updated ?? session.time.created,
          title: session.title,
          directory: session.location?.directory,
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
          id: session.id,
          created: session.time.created,
          updated: session.time.updated ?? session.time.created,
          title: session.title,
          directory: session.location?.directory,
          serverID,
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

  // ---- context usage -----------------------------------------------------

  // A session can remember a model that was later renamed: `gemini-3.8-flash-high`
  // while the catalog now lists `google/gemini-3.8-flash`. Match the bare model
  // name after dropping a provider path and a reasoning-variant suffix.
  const catalogSyncing = new Set<string>()
  const catalogSynced = new Map<string, number>()

  // The app syncs the catalog of the routed session's location only. Rows from
  // another server or directory therefore see no `model.list` until this runs.
  const syncCatalog = (serverID: string, directory?: string) => {
    const key = `${serverID}\u0000${directory ?? ""}`
    const ref = input.ctx.servers.get(serverID)

    if (!ref || catalogSyncing.has(key)) return
    if (Date.now() - (catalogSynced.get(key) ?? 0) < 60_000) return

    catalogSyncing.add(key)
    catalogSynced.set(key, Date.now())

    const target = directory ? { directory } : undefined

    void Promise.all([ref.data.location.provider.sync(target), ref.data.location.model.sync(target)])
      .catch(() => {})
      .finally(() => {
        catalogSyncing.delete(key)
        context.clear()
        schedule()
      })
  }

  const bareModel = (id: string) => (id.split("/").pop() ?? id).replace(VARIANT_SUFFIX, "")

  const modelLimit = (
    models: ReturnType<NonNullable<ReturnType<Context["servers"]["get"]>>["data"]["location"]["model"]["list"]> | undefined,
    ref: { providerID: string; id: string },
  ) => {
    if (!models) return undefined

    const exact = models.findLast(
      (item) => item.providerID === ref.providerID && (item.id === ref.id || item.modelID === ref.id),
    )

    if (exact?.limit.context) return exact.limit.context

    const base = bareModel(ref.id)
    const candidates = models.filter((item) => bareModel(item.id) === base || bareModel(item.modelID) === base)
    const sameProvider = candidates.findLast((item) => item.providerID === ref.providerID && item.limit.context)

    if (sameProvider?.limit.context) return sameProvider.limit.context

    return candidates.findLast((item) => item.limit.context)?.limit.context
  }

  const usageFrom = (
    messages: readonly SessionMessageInfo[],
    serverID: string,
    directory?: string,
    fallback?: { providerID: string; id: string },
  ) => {
    const last = [...messages].reverse().find((message) => message.type === "assistant" && message.tokens)

    if (!last || last.type !== "assistant" || !last.tokens) return undefined

    const tokens = last.tokens
    const used = tokens.input + tokens.output + tokens.reasoning + tokens.cache.read + tokens.cache.write
    const ref = input.ctx.servers.get(serverID)
    const models = ref?.data.location.model.list(directory ? { directory } : undefined)
    const limit = modelLimit(models, last.model ?? fallback ?? last.model)

    if (!models || !limit) syncCatalog(serverID, directory)

    if (!limit) return undefined

    return { percent: Math.round((used / limit) * 100), used, limit }
  }

  const pumpContext = () => {
    while (!stopped && contextRunning.size < CONTEXT_CONCURRENCY && contextQueue.length > 0) {
      const job = contextQueue.shift()

      if (!job) return
      if (context.get(job.id)?.at === job.at) {
        contextQueued.delete(job.id)

        continue
      }

      const ref = input.ctx.servers.get(job.serverID)

      if (!ref) {
        contextQueued.delete(job.id)

        continue
      }

      contextRunning.add(job.id)

      void ref.client.session
        .context({ sessionID: job.id })
        .then((messages) => {
          context.set(job.id, { at: job.at, usage: usageFrom(messages, job.serverID, job.directory) })
        })
        .catch(() => {
          context.set(job.id, { at: job.at })
        })
        .finally(() => {
          contextRunning.delete(job.id)
          contextQueued.delete(job.id)
          contextFetched.set(job.id, Date.now())
          pumpContext()
          schedule()
        })
    }
  }

  const enqueueContext = (sessionID: string, serverID: string, at: number, directory?: string) => {
    if (contextQueued.has(sessionID) || contextRunning.has(sessionID) || contextQueue.length >= 24) return
    if (Date.now() - (contextFetched.get(sessionID) ?? 0) < CONTEXT_MIN_INTERVAL) return

    contextQueued.add(sessionID)
    contextQueue.push({ id: sessionID, serverID, at, directory })
    pumpContext()
  }

  const usageFor = (sessionID: string, entry: SessionEntry): ContextUsage | undefined => {
    const found = lookup(sessionID)

    if (found?.ref) {
      const cached = context.get(sessionID)

      if (cached && cached.at >= entry.updated) return cached.usage

      const messages = found.ref.data.session.message.list(sessionID)

      if (messages.length > 0) {
        const usage = usageFrom(messages, found.serverID, found.info.location?.directory, found.info.model)

        if (usage) {
          context.set(sessionID, { at: entry.updated, usage })

          return usage
        }
      }

      enqueueContext(sessionID, found.serverID, entry.updated, found.info.location?.directory)

      return context.get(sessionID)?.usage
    }

    const cached = context.get(sessionID)

    if (cached && cached.at >= entry.updated) return cached.usage

    if (entry.serverID && Date.now() - entry.updated < CONTEXT_MAX_AGE) {
      enqueueContext(sessionID, entry.serverID, entry.updated, entry.directory)
    }

    return cached?.usage
  }

  // ---- stamps ------------------------------------------------------------

  function writeDate(element: HTMLTimeElement, entry: SessionEntry) {
    const text = formatStamp(entry.updated, options())

    if (element.textContent !== text) element.textContent = text

    const title = [
      t("title.created", { time: formatFull(entry.created, input.locale()) }),
      t("title.updated", { time: formatFull(entry.updated, input.locale()) }),
    ].join("\n")

    if (element.title !== title) element.title = title
    element.dateTime = new Date(entry.updated).toISOString()
  }

  function renderHome() {
    const settings = input.settings()

    document.querySelectorAll<HTMLElement>(HOME_ROW).forEach((container) => {
      const button = container.querySelector<HTMLElement>(HOME_BUTTON)
      const sessionID = container.dataset.sessionId
      const entry = sessionID ? timeFor(sessionID) : undefined

      if (!button) return

      if (!sessionID || !entry) {
        button.querySelector<HTMLElement>(':scope > [data-ocst-kind="trail-home"]')?.remove()

        return
      }

      ensureTrail(button, "home", sessionID, entry, datesEnabled(settings) && settings.home)
    })
  }

  function ensureDate(trail: HTMLElement, entry: SessionEntry, on: boolean) {
    let element = trail.querySelector<HTMLTimeElement>(':scope > [data-ocst-kind="date"]')

    if (!on) {
      element?.remove()

      return
    }

    if (!element) {
      element = document.createElement("time")
      element.dataset.ocstKind = "date"
      element.className = trail.dataset.ocstTrail === "tab" ? "ocst-tab-time" : "ocst-side-time"
      trail.prepend(element)
    }

    writeDate(element, entry)
  }

  function ensureRing(trail: HTMLElement, sessionID: string, entry: SessionEntry, on: boolean) {
    let ring = trail.querySelector<HTMLElement>(':scope > [data-ocst-kind="ring"]')

    if (!on) {
      ring?.remove()

      return
    }

    const usage = usageFor(sessionID, entry)

    if (!usage) {
      ring?.remove()

      return
    }

    if (!ring) {
      ring = document.createElement("span")
      ring.dataset.ocstKind = "ring"
      ring.className = "ocst-ring"
      ring.innerHTML = `<svg viewBox="0 0 14 14" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="${RING_RADIUS}" stroke="var(--ocst-ring-track, var(--v2-background-bg-layer-04))" stroke-width="1.5"/><circle data-ocst-arc cx="7" cy="7" r="${RING_RADIUS}" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" transform="rotate(-90 7 7)"/></svg>`
      trail.append(ring)
    }

    const arc = ring.querySelector<SVGCircleElement>("[data-ocst-arc]")
    const percent = Math.max(0, Math.min(100, usage.percent))
    const offset = RING_CIRCUMFERENCE * (1 - percent / 100)

    if (arc) {
      arc.setAttribute("stroke-dasharray", RING_CIRCUMFERENCE.toFixed(2))
      arc.setAttribute("stroke-dashoffset", offset.toFixed(2))
    }

    const level = usage.percent >= 95 ? "critical" : usage.percent >= 80 ? "high" : "normal"

    if (ring.dataset.level !== level) ring.dataset.level = level

    const title = t("ring.title", {
      percent: usage.percent,
      used: compact(usage.used),
      limit: compact(usage.limit),
    })

    if (ring.title !== title) ring.title = title
  }

  function ensureTrail(
    parent: HTMLElement,
    kind: "home" | "side" | "tab",
    sessionID: string,
    entry: SessionEntry,
    showDate: boolean,
  ) {
    const dates = showDate
    const rings = contextEnabled(input.settings())
    const selector = `:scope > [data-ocst-kind="trail-${kind}"]`
    let trail = parent.querySelector<HTMLElement>(selector)

    if (!dates && !rings) {
      trail?.remove()

      return
    }

    if (!trail) {
      trail = document.createElement("span")
      trail.dataset.ocstKind = `trail-${kind}`
      trail.dataset.ocstTrail = kind
      trail.className = `ocst-trail ocst-trail--${kind}`

      if (kind === "side") parent.insertBefore(trail, parent.lastElementChild)
      else parent.append(trail)
    }

    ensureDate(trail, entry, dates)
    ensureRing(trail, sessionID, entry, rings)
  }

  function renderSidebar() {
    const rows = document.querySelectorAll<HTMLElement>(SIDEBAR_ROW)

    if (rows.length === 0) return

    const unique = titles()

    rows.forEach((row) => {
      const title = row.getAttribute("title")?.trim()
      const entry = title ? unique.get(title) : undefined

      if (!entry) {
        row.querySelector<HTMLElement>(':scope > [data-ocst-kind="trail-side"]')?.remove()

        return
      }

      ensureTrail(
        row,
        "side",
        entry.id,
        entry,
        datesEnabled(input.settings()) && sidebarEnabled(input.settings()),
      )
    })
  }

  function renderTabs() {
    document.querySelectorAll<HTMLAnchorElement>(TAB_LINK).forEach((link) => {
      const sessionID = link.getAttribute("href")?.match(SESSION_IN_HREF)?.[1]
      const entry = sessionID ? timeFor(sessionID) : undefined

      if (!entry) {
        link.querySelector<HTMLElement>(':scope > [data-ocst-kind="trail-tab"]')?.remove()

        return
      }

      ensureTrail(
        link,
        "tab",
        sessionID ?? "",
        entry,
        datesEnabled(input.settings()) && sidebarEnabled(input.settings()),
      )
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

    if (!entry || !datesEnabled(input.settings()) || !sidebarEnabled(input.settings())) {
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

    if (!datesEnabled(input.settings()) || !input.settings().messages || !session) {
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

  // ---- header switches ---------------------------------------------------

  function toggleButton(kind: "toggle" | "context-toggle", icon: string, label: string, on: boolean, run: () => void) {
    let button = document.querySelector<HTMLButtonElement>(`[data-ocst-kind="${kind}"]`)

    if (!button) {
      button = document.createElement("button")
      button.dataset.ocstKind = kind
      button.type = "button"
      button.className = "ocst-toggle"
      button.innerHTML = icon
      button.addEventListener("click", (event) => {
        event.preventDefault()
        event.stopPropagation()
        run()
      })
    }

    button.dataset.on = on ? "true" : "false"
    button.setAttribute("aria-pressed", on ? "true" : "false")
    button.setAttribute("aria-label", label)

    if (button.title !== label) button.title = label

    return button
  }

  function renderToggle() {
    const anchor = Array.from(document.querySelectorAll<HTMLElement>(SIDEBAR_TOGGLE)).find(
      (element) => !element.closest(COLLAPSED_TOGGLE),
    )
    const wrapper = anchor?.parentElement
    const button = document.querySelector<HTMLButtonElement>('[data-ocst-kind="toggle"]')
    const contextButton = document.querySelector<HTMLButtonElement>('[data-ocst-kind="context-toggle"]')

    if (!wrapper || !wrapper.parentElement) {
      button?.remove()
      contextButton?.remove()

      return
    }

    const on = datesEnabled(input.settings())
    const clock = toggleButton("toggle", CLOCK_SVG, t(on ? "toggle.hide" : "toggle.show"), on, input.toggle)

    const beforeWrapper =
      clock.parentElement === wrapper.parentElement &&
      (clock.compareDocumentPosition(wrapper) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0

    if (!beforeWrapper) wrapper.parentElement.insertBefore(clock, wrapper)

    const rings = contextEnabled(input.settings())
    const ringButton = toggleButton(
      "context-toggle",
      RING_SVG,
      t(rings ? "toggle.context.hide" : "toggle.context.show"),
      rings,
      input.toggleContext,
    )

    if (ringButton.previousElementSibling !== clock) clock.after(ringButton)
  }

  function render() {
    if (stopped) return

    renderToggle()

    if (!contextEnabled(input.settings())) {
      contextQueue.length = 0
      contextQueued.clear()
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
    remove("trail-home")
    remove("sidebar")
    remove("tab")
    remove("popover")
    remove("turn")
    remove("toggle")
    remove("context-toggle")
    remove("trail-side")
    remove("trail-tab")
  })

  return { schedule }
}


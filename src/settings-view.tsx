import { For, Show, createMemo } from "solid-js"
import type { SlotMap } from "@opencode/plugin/gui"
import type { Context } from "@opencode/plugin/gui"
import { DEFAULT_SETTINGS, datesEnabled, type StoredSettings, type TimestampClock, type TimestampFormat } from "./settings"
import { formatFull, formatStamp } from "./time"
import { resolveTranslation, type TranslationParams } from "./i18n"

const PLUGIN = "session-timestamps"

const GEAR_SVG = `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.62516 4.46094L5.05225 3.86719L3.86475 5.05469L4.4585 7.6276L2.0835 9.21094V10.7943L4.4585 12.3776L3.86475 14.9505L5.05225 16.138L7.62516 15.5443L9.2085 17.9193H10.7918L12.3752 15.5443L14.9481 16.138L16.1356 14.9505L15.5418 12.3776L17.9168 10.7943V9.21094L15.5418 7.6276L16.1356 5.05469L14.9481 3.86719L12.3752 4.46094L10.7918 2.08594H9.2085L7.62516 4.46094Z" stroke="currentColor"/><path d="M12.5002 10.0026C12.5002 11.3833 11.3809 12.5026 10.0002 12.5026C8.61945 12.5026 7.50016 11.3833 7.50016 10.0026C7.50016 8.62189 8.61945 7.5026 10.0002 7.5026C11.3809 7.5026 12.5002 8.62189 12.5002 10.0026Z" stroke="currentColor"/></svg>`

export const GUI_CSS = `
.ocst-header {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  font-size: 11px;
  line-height: var(--line-height-compact, 1.3);
  color: var(--v2-text-text-faint, #8a8a8a);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
  user-select: none;
}
.ocst-header time { color: inherit; }
.ocst-header-sep { opacity: 0.6; }

.ocst-home {
  flex: none;
  margin-inline-end: 2px;
  padding-inline-start: 8px;
  font-size: 11px;
  line-height: var(--line-height-compact, 1.3);
  color: var(--v2-text-text-faint, #8a8a8a);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  opacity: 0.85;
  transition: opacity 120ms ease-in-out;
  pointer-events: none;
  user-select: none;
}
[data-component="home-session-row-container"]:hover .ocst-home { opacity: 0; }

.ocst-trail {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex: none;
  min-width: 0;
  pointer-events: none;
  user-select: none;
}
.ocst-trail--tab { margin-inline-end: 24px; }
.ocst-side-time,
.ocst-tab-time {
  font-size: 11px;
  line-height: var(--line-height-compact, 1.3);
  color: var(--v2-text-text-faint, #8a8a8a);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  opacity: 0.85;
}
.ocst-tab-time {
  font-size: 10px;
  line-height: 1;
  opacity: 0.8;
}
[data-titlebar-tab]:hover .ocst-trail--tab { opacity: 0; }
@container (max-width: 160px) {
  .ocst-trail--tab .ocst-tab-time { display: none; }
}
@container (max-width: 120px) {
  .ocst-trail--tab { display: none; }
}

.ocst-ring {
  display: inline-flex;
  flex: none;
  width: 14px;
  height: 14px;
  color: var(--v2-icon-icon-base, #eeeeee);
  opacity: 0.9;
}
.ocst-ring svg { width: 14px; height: 14px; }
.ocst-ring[data-level="high"] { color: var(--v2-state-fg-warning, #e0af68); }
.ocst-ring[data-level="critical"] { color: var(--v2-state-fg-danger, #f7768e); }

.ocst-popover {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ocst-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  flex: none;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--v2-icon-icon-muted, #8a8a8a);
  cursor: pointer;
  -webkit-app-region: no-drag;
  transition: color 120ms ease, background-color 120ms ease, opacity 120ms ease;
}
.ocst-toggle svg { width: 16px; height: 16px; }
.ocst-toggle:hover {
  background: var(--v2-overlay-simple-overlay-hover, rgba(255, 255, 255, 0.06));
  color: var(--v2-text-text-base, #eeeeee);
}
.ocst-toggle[data-on="true"] { color: var(--v2-text-text-base, #eeeeee); }
.ocst-toggle[data-on="false"] { color: var(--v2-text-text-faint, #8a8a8a); opacity: 0.65; }

.ocst-turn {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 2px;
  font-size: 11px;
  line-height: var(--line-height-compact, 1.3);
  color: var(--v2-text-text-faint, #8a8a8a);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  pointer-events: none;
  user-select: none;
}

.ocst-settings-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 14px 0;
  border-bottom: 1px solid var(--v2-border-border-base, rgba(255, 255, 255, 0.08));
}
.ocst-settings-row:last-child { border-bottom: none; }
.ocst-settings-copy { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.ocst-settings-label { font-size: 13px; font-weight: 530; color: var(--v2-text-text-base, #eeeeee); }
.ocst-settings-desc { font-size: 12px; color: var(--v2-text-text-faint, #8a8a8a); }
.ocst-settings-card {
  border: 1px solid var(--v2-border-border-base, rgba(255, 255, 255, 0.08));
  border-radius: 10px;
  padding: 4px 16px;
  margin-bottom: 20px;
}
.ocst-settings-card-title {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--v2-text-text-faint, #8a8a8a);
  margin: 14px 0 4px;
}
.ocst-switch {
  position: relative;
  flex: none;
  width: 34px;
  height: 20px;
  border-radius: 999px;
  border: 1px solid var(--v2-border-border-base, rgba(255, 255, 255, 0.16));
  background: var(--v2-background-bg-layer-02, rgba(255, 255, 255, 0.06));
  cursor: pointer;
  transition: background-color 120ms ease, border-color 120ms ease;
  padding: 0;
}
.ocst-switch[data-on="true"] {
  background: var(--v2-background-bg-accent, #9d7cd8);
  border-color: transparent;
}
.ocst-switch::after {
  content: "";
  position: absolute;
  top: 2px;
  inset-inline-start: 2px;
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: #ffffff;
  transition: transform 120ms ease;
}
.ocst-switch[data-on="true"]::after { transform: translateX(14px); }
[dir="rtl"] .ocst-switch[data-on="true"]::after { transform: translateX(-14px); }

.ocst-select {
  flex: none;
  min-width: 168px;
  height: 30px;
  padding: 0 8px;
  border-radius: 7px;
  border: 1px solid var(--v2-border-border-base, rgba(255, 255, 255, 0.16));
  background: var(--v2-background-bg-layer-02, rgba(255, 255, 255, 0.06));
  color: var(--v2-text-text-base, #eeeeee);
  font-size: 12px;
  outline: none;
}
.ocst-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 12px;
  color: var(--v2-text-text-muted, #b0b0b0);
  font-variant-numeric: tabular-nums;
}
.ocst-preview span {
  padding: 3px 8px;
  border-radius: 6px;
  background: var(--v2-background-bg-layer-02, rgba(255, 255, 255, 0.06));
}
.ocst-reset {
  height: 28px;
  padding: 0 12px;
  border-radius: 7px;
  border: 1px solid var(--v2-border-border-base, rgba(255, 255, 255, 0.16));
  background: transparent;
  color: var(--v2-text-text-muted, #b0b0b0);
  font-size: 12px;
  cursor: pointer;
}
.ocst-reset:hover { color: var(--v2-text-text-base, #ffffff); }

.plugin-settings-gear-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border-radius: 4px;
  background: transparent;
  border: none;
  color: var(--v2-text-text-muted, #8a8a8a);
  cursor: pointer;
  transition: color 0.15s ease, background-color 0.15s ease;
  flex-shrink: 0;
}
.plugin-settings-gear-btn:hover {
  color: #b392f0 !important;
  background-color: var(--v2-background-bg-layer-02, rgba(255, 255, 255, 0.08));
}
.plugin-settings-gear-btn svg { width: 16px; height: 16px; }

.settings-nav-groups [data-slot="tabs-v2-trigger-wrapper"][data-value="${PLUGIN}"] [data-slot="tabs-v2-trigger"] svg {
  color: #9d7cd8 !important;
}
`

export function setupSettingsGear() {
  if (typeof document === "undefined") return

  function navigateToSettings() {
    const trigger = document.querySelector<HTMLElement>(
      `.settings-nav-groups [data-slot="tabs-v2-trigger-wrapper"][data-value="${PLUGIN}"] button, .settings-nav-groups [data-slot="tabs-v2-trigger-wrapper"][data-value="${PLUGIN}"] [data-slot="tabs-v2-trigger"]`,
    )

    if (trigger) {
      trigger.click()

      return
    }

    const url = new URL(window.location.href)
    url.searchParams.set("tab", PLUGIN)
    window.history.pushState({}, "", url.toString())
    window.dispatchEvent(new PopStateEvent("popstate"))
  }

  function inject() {
    for (const row of Array.from(document.querySelectorAll(".settings-extension-row"))) {
      const name = row.querySelector(".settings-extension-name")?.textContent?.trim() ?? ""

      if (!name.includes(PLUGIN)) continue

      const actions = row.querySelector(".settings-servers-actions")

      if (!actions || actions.querySelector(`.${PLUGIN}-settings-btn`)) continue

      const button = document.createElement("button")
      button.type = "button"
      button.className = `plugin-settings-gear-btn ${PLUGIN}-settings-btn`
      button.title = "Open settings"
      button.setAttribute("aria-label", "Open settings")
      button.innerHTML = GEAR_SVG
      button.addEventListener("click", (event) => {
        event.preventDefault()
        event.stopPropagation()
        navigateToSettings()
      })
      actions.insertBefore(button, actions.firstElementChild)
    }
  }

  inject()

  const observer = new MutationObserver(inject)
  observer.observe(document.body, { childList: true, subtree: true })

  return () => observer.disconnect()
}

export function SessionHeaderStamp(props: {
  ctx: Context
  input: SlotMap["session.header"]
  settings: () => StoredSettings
  locale: () => string
  t: (key: string, params?: TranslationParams) => string
}) {
  const info = createMemo(() => {
    const id = props.input.session.id
    const serverID = props.input.session.server.id

    try {
      return props.ctx.servers.get(serverID)?.data.session.get(id)
    } catch {
      return undefined
    }
  })

  const options = () => ({
    locale: props.locale(),
    format: props.settings().format,
    clock: props.settings().clock,
  })

  const title = () => {
    const session = info()

    if (!session) return undefined

    return [
      props.t("title.created", { time: formatFull(session.time.created, props.locale()) }),
      props.t("title.updated", {
        time: formatFull(session.time.updated ?? session.time.created, props.locale()),
      }),
    ].join("\n")
  }

  return (
    <Show when={datesEnabled(props.settings()) && props.settings().header ? info() : undefined}>
      {(session) => {
        const updated = () => session().time.updated ?? session().time.created

        return (
          <span class="ocst-header" title={title()}>
            <Show
              when={!props.input.compact}
              fallback={<time dateTime={new Date(updated()).toISOString()}>{formatStamp(updated(), options())}</time>}
            >
              <span>
                {props.t("labels.created")}{" "}
                <time dateTime={new Date(session().time.created).toISOString()}>
                  {formatStamp(session().time.created, options())}
                </time>
              </span>
              <span class="ocst-header-sep" aria-hidden="true">
                ·
              </span>
              <span>
                {props.t("labels.updated")}{" "}
                <time dateTime={new Date(updated()).toISOString()}>{formatStamp(updated(), options())}</time>
              </span>
            </Show>
          </span>
        )
      }}
    </Show>
  )
}

export function SettingsView(props: {
  settings: () => StoredSettings
  update: (patch: Partial<StoredSettings>) => void
  reset: () => void
  t: (key: string, params?: TranslationParams) => string
  locale: () => string
}) {
  const t = (key: string, params?: TranslationParams) => {
    const value = props.t(key, params)

    return value === key ? resolveTranslation(props.locale(), key, params) : value
  }

  const current = () => ({ ...DEFAULT_SETTINGS, ...props.settings() })
  const options = () => ({ locale: props.locale(), format: current().format, clock: current().clock })
  const now = Date.now()

  const sample = [
    now,
    now - 26 * 60 * 60 * 1000,
    now - 12 * 24 * 60 * 60 * 1000,
    now - 300 * 24 * 60 * 60 * 1000,
  ]

  const Toggle = (row: {
    key: "enabled" | "header" | "home" | "sidebar" | "messages" | "contextRing"
    label: string
    desc: string
  }) => (
    <div class="ocst-settings-row">
      <div class="ocst-settings-copy">
        <span class="ocst-settings-label">{row.label}</span>
        <span class="ocst-settings-desc">{row.desc}</span>
      </div>
      <button
        type="button"
        role="switch"
        class="ocst-switch"
        aria-checked={current()[row.key]}
        aria-label={row.label}
        data-on={current()[row.key] ? "true" : "false"}
        onClick={() => props.update({ [row.key]: !current()[row.key] })}
      />
    </div>
  )

  const formatOptions: Array<{ value: TimestampFormat; label: string }> = [
    { value: "auto", label: t("settings.format.auto") },
    { value: "absolute", label: t("settings.format.absolute") },
  ]

  const clockOptions: Array<{ value: TimestampClock; label: string }> = [
    { value: "auto", label: t("settings.clock.auto") },
    { value: "24h", label: t("settings.clock.24h") },
    { value: "12h", label: t("settings.clock.12h") },
  ]

  return (
    <div
      style={{
        "max-width": "760px",
        margin: "0 auto",
        padding: "32px 24px",
        "font-family": "var(--font-family-sans, -apple-system, BlinkMacSystemFont, sans-serif)",
        color: "var(--v2-text-text-base, #eeeeee)",
      }}
    >
      <div style={{ "margin-bottom": "28px" }}>
        <div style={{ display: "flex", "align-items": "center", gap: "8px", "margin-bottom": "6px" }}>
          <h1 style={{ "font-size": "20px", "font-weight": "600", margin: "0", color: "var(--v2-text-text-base, #ffffff)" }}>
            {t("settings.header.title")}
          </h1>
          <span
            style={{
              "font-size": "11px",
              "font-weight": "500",
              color: "#b392f0",
              background: "rgba(157, 124, 216, 0.15)",
              border: "1px solid rgba(157, 124, 216, 0.35)",
              "border-radius": "10px",
              padding: "1px 7px",
              "line-height": "1.4",
            }}
          >
            Plugin
          </span>
        </div>
        <p style={{ "font-size": "13px", color: "var(--v2-text-text-muted, #b0b0b0)", margin: "0", "line-height": "1.5" }}>
          {t("settings.header.desc")}
        </p>
      </div>

      <div class="ocst-settings-card">
        <div class="ocst-settings-card-title">{t("settings.section.show")}</div>
        <Toggle key="enabled" label={t("settings.show.enabled")} desc={t("settings.show.enabled.desc")} />
        <Toggle key="header" label={t("settings.show.header")} desc={t("settings.show.header.desc")} />
        <Toggle key="home" label={t("settings.show.home")} desc={t("settings.show.home.desc")} />
        <Toggle key="sidebar" label={t("settings.show.sidebar")} desc={t("settings.show.sidebar.desc")} />
        <Toggle key="messages" label={t("settings.show.messages")} desc={t("settings.show.messages.desc")} />
      </div>

      <div class="ocst-settings-card">
        <div class="ocst-settings-card-title">{t("settings.section.context")}</div>
        <Toggle
          key="contextRing"
          label={t("settings.show.context")}
          desc={t("settings.show.context.desc")}
        />
      </div>

      <div class="ocst-settings-card">
        <div class="ocst-settings-card-title">{t("settings.section.format")}</div>

        <div class="ocst-settings-row">
          <div class="ocst-settings-copy">
            <span class="ocst-settings-label">{t("settings.format.label")}</span>
            <span class="ocst-settings-desc">{t("settings.format.desc")}</span>
          </div>
          <select
            class="ocst-select"
            value={current().format}
            onChange={(event) => props.update({ format: event.currentTarget.value as TimestampFormat })}
          >
            <For each={formatOptions}>{(option) => <option value={option.value}>{option.label}</option>}</For>
          </select>
        </div>

        <div class="ocst-settings-row">
          <div class="ocst-settings-copy">
            <span class="ocst-settings-label">{t("settings.clock.label")}</span>
          </div>
          <select
            class="ocst-select"
            value={current().clock}
            onChange={(event) => props.update({ clock: event.currentTarget.value as TimestampClock })}
          >
            <For each={clockOptions}>{(option) => <option value={option.value}>{option.label}</option>}</For>
          </select>
        </div>

        <div class="ocst-settings-row">
          <div class="ocst-settings-copy">
            <span class="ocst-settings-label">{t("settings.preview.label")}</span>
            <span class="ocst-settings-desc">{t("settings.preview.hint")}</span>
          </div>
          <div class="ocst-preview">
            <For each={sample}>{(value) => <span>{formatStamp(value, options())}</span>}</For>
          </div>
        </div>
      </div>

      <button type="button" class="ocst-reset" onClick={props.reset}>
        {t("settings.reset")}
      </button>
    </div>
  )
}

import { For, Show, createMemo } from "solid-js"
import type { SlotMap } from "@opencode/plugin/gui"
import type { Context } from "@opencode/plugin/gui"
import { DEFAULT_SETTINGS, datesEnabled, type StoredSettings, type TimestampClock, type TimestampFormat } from "./settings"
import { formatElapsed, formatFull, formatStamp } from "./time"
import { resolveTranslation, type TranslationParams } from "./i18n"

const PLUGIN = "session-timestamps"


export const GUI_CSS = `
.ocst-header {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  font-size: 11px;
  line-height: var(--line-height-compact, 1.3);
  color: var(--v2-text-text-faint, light-dark(#6b6b6b, #8a8a8a));
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
  user-select: none;
}
.ocst-header time { color: inherit; }
.ocst-header-sep { opacity: 0.6; }

[data-component="home-session-row-container"]:hover .ocst-trail--home { opacity: 0; }

.ocst-trail {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex: none;
  min-width: 0;
  pointer-events: none;
  user-select: none;
  transition: opacity 120ms ease-in-out;
}
.ocst-trail--tab { margin-inline-end: 24px; }
.ocst-side-time,
.ocst-tab-time {
  font-size: 11px;
  line-height: var(--line-height-compact, 1.3);
  color: var(--v2-text-text-faint, light-dark(#6b6b6b, #8a8a8a));
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
  --ocst-ring-track: var(--v2-background-bg-layer-04, light-dark(rgba(0, 0, 0, 0.12), rgba(255, 255, 255, 0.12)));
  display: inline-flex;
  flex: none;
  width: 14px;
  height: 14px;
  color: var(--v2-icon-icon-base, light-dark(#1f1f1f, #eeeeee));
  opacity: 0.9;
}
.ocst-ring svg { width: 14px; height: 14px; }
.ocst-ring[data-level="high"] { color: var(--v2-state-fg-warning, light-dark(#9a6700, #e0af68)); }
.ocst-ring[data-level="critical"] { color: var(--v2-state-fg-danger, light-dark(#cf222e, #f7768e)); }

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
  color: var(--v2-icon-icon-muted, light-dark(#5f5f5f, #8a8a8a));
  cursor: pointer;
  -webkit-app-region: no-drag;
  transition: color 120ms ease, background-color 120ms ease, opacity 120ms ease;
}
.ocst-toggle svg { width: 16px; height: 16px; }
.ocst-toggle:hover {
  background: var(--v2-overlay-simple-overlay-hover, light-dark(rgba(0, 0, 0, 0.05), rgba(255, 255, 255, 0.06)));
  color: var(--v2-text-text-base, light-dark(#1f1f1f, #eeeeee));
}
.ocst-toggle[data-on="true"] { color: var(--v2-text-text-base, light-dark(#1f1f1f, #eeeeee)); }
.ocst-toggle[data-on="false"] { color: var(--v2-text-text-faint, light-dark(#6b6b6b, #8a8a8a)); opacity: 0.65; }

.ocst-turn {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 2px;
  font-size: 11px;
  line-height: var(--line-height-compact, 1.3);
  color: var(--v2-text-text-faint, light-dark(#6b6b6b, #8a8a8a));
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
  border-bottom: 1px solid var(--v2-border-border-base, light-dark(rgba(0, 0, 0, 0.10), rgba(255, 255, 255, 0.08)));
}
.ocst-settings-row:last-child { border-bottom: none; }
.ocst-settings-copy { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.ocst-settings-label { font-size: 13px; font-weight: 530; color: var(--v2-text-text-base, light-dark(#1f1f1f, #eeeeee)); }
.ocst-settings-desc { font-size: 12px; color: var(--v2-text-text-faint, light-dark(#6b6b6b, #8a8a8a)); }
.ocst-settings-card {
  border: 1px solid var(--v2-border-border-base, light-dark(rgba(0, 0, 0, 0.10), rgba(255, 255, 255, 0.08)));
  border-radius: 10px;
  padding: 4px 16px;
  margin-bottom: 20px;
}
.ocst-settings-card-title {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--v2-text-text-faint, light-dark(#6b6b6b, #8a8a8a));
  margin: 14px 0 4px;
}
.ocst-switch {
  position: relative;
  flex: none;
  width: 34px;
  height: 20px;
  border-radius: 999px;
  border: 1px solid var(--v2-border-border-base, light-dark(rgba(0, 0, 0, 0.16), rgba(255, 255, 255, 0.16)));
  background: var(--v2-background-bg-layer-02, light-dark(rgba(0, 0, 0, 0.04), rgba(255, 255, 255, 0.06)));
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
  border: 1px solid var(--v2-border-border-base, light-dark(rgba(0, 0, 0, 0.16), rgba(255, 255, 255, 0.16)));
  background: var(--v2-background-bg-layer-02, light-dark(rgba(0, 0, 0, 0.04), rgba(255, 255, 255, 0.06)));
  color: var(--v2-text-text-base, light-dark(#1f1f1f, #eeeeee));
  font-size: 12px;
  outline: none;
}
.ocst-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 12px;
  color: var(--v2-text-text-muted, light-dark(#5f5f5f, #b0b0b0));
  font-variant-numeric: tabular-nums;
}
.ocst-preview span {
  padding: 3px 8px;
  border-radius: 6px;
  background: var(--v2-background-bg-layer-02, light-dark(rgba(0, 0, 0, 0.04), rgba(255, 255, 255, 0.06)));
}
.ocst-reset {
  height: 28px;
  padding: 0 12px;
  border-radius: 7px;
  border: 1px solid var(--v2-border-border-base, light-dark(rgba(0, 0, 0, 0.16), rgba(255, 255, 255, 0.16)));
  background: transparent;
  color: var(--v2-text-text-muted, light-dark(#5f5f5f, #b0b0b0));
  font-size: 12px;
  cursor: pointer;
}
.ocst-reset:hover { color: var(--v2-text-text-base, light-dark(#121212, #ffffff)); }

.settings-nav-groups [data-slot="tabs-v2-trigger-wrapper"][data-value="${PLUGIN}"] [data-slot="tabs-v2-trigger"] svg {
  color: light-dark(#6b4fae, #9d7cd8) !important;
}
`

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

  const elapsedSample = [
    now - 40 * 60 * 1000,
    now - 5 * 60 * 60 * 1000,
    now - 2 * 24 * 60 * 60 * 1000,
    now - 45 * 24 * 60 * 60 * 1000,
  ]

  const Toggle = (row: {
    key: "enabled" | "header" | "home" | "sidebar" | "sidebarRelative" | "messages" | "contextRing"
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
        color: "var(--v2-text-text-base, light-dark(#1f1f1f, #eeeeee))",
      }}
    >
      <div style={{ "margin-bottom": "28px" }}>
        <div style={{ display: "flex", "align-items": "center", gap: "8px", "margin-bottom": "6px" }}>
          <h1 style={{ "font-size": "20px", "font-weight": "600", margin: "0", color: "var(--v2-text-text-base, light-dark(#121212, #ffffff))" }}>
            {t("settings.header.title")}
          </h1>
          <span
            style={{
              "font-size": "11px",
              "font-weight": "500",
              color: "light-dark(#6b4fae, #b392f0)",
              background: "light-dark(rgba(107, 79, 174, 0.10), rgba(157, 124, 216, 0.15))",
              border: "1px solid light-dark(rgba(107, 79, 174, 0.30), rgba(157, 124, 216, 0.35))",
              "border-radius": "10px",
              padding: "1px 7px",
              "line-height": "1.4",
            }}
          >
            Plugin
          </span>
        </div>
        <p style={{ "font-size": "13px", color: "var(--v2-text-text-muted, light-dark(#5f5f5f, #b0b0b0))", margin: "0", "line-height": "1.5" }}>
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

        <Toggle
          key="sidebarRelative"
          label={t("settings.format.relative")}
          desc={t("settings.format.relative.desc")}
        />

        <div class="ocst-settings-row">
          <div class="ocst-settings-copy">
            <span class="ocst-settings-label">{t("settings.preview.label")}</span>
            <span class="ocst-settings-desc">{t("settings.preview.hint")}</span>
          </div>
          <div class="ocst-preview">
            <For each={sample}>{(value) => <span>{formatStamp(value, options())}</span>}</For>
          </div>
        </div>

        <div class="ocst-settings-row">
          <div class="ocst-settings-copy">
            <span class="ocst-settings-label">{t("settings.preview.relative")}</span>
            <span class="ocst-settings-desc">{t("settings.preview.relative.hint")}</span>
          </div>
          <div class="ocst-preview">
            <For each={elapsedSample}>
              {(value) => <span>{formatElapsed(value, { now, translate: t })}</span>}
            </For>
          </div>
        </div>
      </div>

      <button type="button" class="ocst-reset" onClick={props.reset}>
        {t("settings.reset")}
      </button>
    </div>
  )
}

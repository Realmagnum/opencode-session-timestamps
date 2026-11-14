import { createEffect } from "solid-js"
import { Plugin, SettingsPage, Slot, Store, Style } from "@opencode/plugin/gui"
import type { Persisted } from "@opencode/plugin/gui"
import { DEFAULT_SETTINGS, TimestampSettingsSchema, datesEnabled, type StoredSettings } from "./settings"
import { GUI_CSS, SessionHeaderStamp, SettingsView, setupSettingsGear } from "./settings-view"
import { I18N_CATALOG, resolveTranslation, type TranslationParams } from "./i18n"
import { setupDomTimestamps } from "./inject"

function SettingsTab(props: {
  store: Persisted<StoredSettings>
  t: (key: string, params?: TranslationParams) => string
  locale: () => string
}) {
  const settings = (): StoredSettings => ({ ...DEFAULT_SETTINGS, ...props.store.value })

  return (
    <SettingsView
      settings={settings}
      update={(patch) => props.store.set({ ...settings(), ...patch })}
      reset={() => props.store.set(DEFAULT_SETTINGS)}
      t={props.t}
      locale={props.locale}
    />
  )
}

export default Plugin.define({
  stores: {
    timestamps: Store.global(TimestampSettingsSchema, DEFAULT_SETTINGS),
  },
  i18n: I18N_CATALOG,
  setup(ctx) {
    console.info("[session-timestamps] gui ready")

    const settings = (): StoredSettings => ({ ...DEFAULT_SETTINGS, ...ctx.stores.timestamps.value })
    const locale = () => ctx.locale.locale() || "en"
    const t = (key: string, params?: TranslationParams) => {
      const value = ctx.t(key, params)

      return value === key ? resolveTranslation(locale(), key, params) : value
    }

    ctx.add(Style, GUI_CSS)

    ctx.add(Slot, {
      at: "session.header",
      order: 20,
      render: (input) => (
        <SessionHeaderStamp ctx={ctx} input={input} settings={settings} locale={locale} t={t} />
      ),
    })

    ctx.add(SettingsPage, () => ({
      id: "session-timestamps",
      icon: "comment" as const,
      title: t("settings.title"),
      render: () => <SettingsTab store={ctx.stores.timestamps} t={t} locale={locale} />,
    }))

    const dom = setupDomTimestamps({
      ctx,
      settings,
      locale,
      translate: (key, params) => ctx.t(key, params),
      toggle: () => ctx.stores.timestamps.set({ ...settings(), enabled: !datesEnabled(settings()) }),
    })

    // Times follow the language and the format settings without a reload.
    createEffect(() => {
      settings()
      locale()
      dom.schedule()
    })

    setupSettingsGear()
  },
})

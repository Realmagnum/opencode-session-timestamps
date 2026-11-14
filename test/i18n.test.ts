import test from "node:test"
import assert from "node:assert/strict"
import { I18N_CATALOG, I18N_EN, resolveTranslation } from "../src/i18n.ts"

test("every locale carries every English key", () => {
  const base = Object.keys(I18N_EN).sort()

  for (const [locale, dictionary] of Object.entries(I18N_CATALOG)) {
    assert.deepEqual(Object.keys(dictionary).sort(), base, `Locale '${locale}' is missing keys or has extra keys`)
  }
})

test("params interpolate and unknown locales fall back to English", () => {
  assert.equal(resolveTranslation("ru", "title.updated", { time: "13 нояб. 2026, 15:42:07" }), "Последняя активность: 13 нояб. 2026, 15:42:07")
  assert.equal(resolveTranslation("xx", "settings.title"), I18N_EN["settings.title"])
})

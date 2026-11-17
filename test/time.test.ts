import test from "node:test"
import assert from "node:assert/strict"
import { formatElapsed } from "../src/time.ts"
import { resolveTranslation } from "../src/i18n.ts"

const translate = (locale: string) => (key: string, params?: Record<string, string | number | boolean>) =>
  resolveTranslation(locale, key, params)

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const now = Date.UTC(2026, 10, 17, 12, 0, 0)

const elapsed = (value: number, locale = "en") => formatElapsed(value, { now, translate: translate(locale) })

test("elapsed time is compact at each boundary", () => {
  assert.equal(elapsed(now), "now")
  assert.equal(elapsed(now - 59_000), "now")
  assert.equal(elapsed(now - MINUTE), "1m")
  assert.equal(elapsed(now - 49 * MINUTE), "49m")
  assert.equal(elapsed(now - HOUR), "1h")
  assert.equal(elapsed(now - 23 * HOUR), "23h")
  assert.equal(elapsed(now - (DAY - 1_000)), "23h")
  assert.equal(elapsed(now - DAY), "1d")
  assert.equal(elapsed(now - 300 * DAY), "300d")
})

test("elapsed time follows the interface language", () => {
  assert.equal(elapsed(now - 2 * HOUR, "ru"), "2ч")
  assert.equal(elapsed(now - 3 * DAY, "ru"), "3д")
  assert.equal(elapsed(now, "ru"), "сейчас")
  assert.equal(elapsed(now - 2 * HOUR, "de"), "2h")
})

test("a clock that runs ahead never prints a negative age", () => {
  assert.equal(elapsed(now + 5 * MINUTE), "now")
})

test("an unusable timestamp prints nothing", () => {
  assert.equal(elapsed(Number.NaN), "")
})

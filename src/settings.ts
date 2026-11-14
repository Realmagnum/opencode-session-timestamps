import { Schema } from "effect"

export const FormatSchema = Schema.Union([Schema.Literal("auto"), Schema.Literal("absolute")])
export type TimestampFormat = typeof FormatSchema.Type

export const ClockSchema = Schema.Union([Schema.Literal("auto"), Schema.Literal("24h"), Schema.Literal("12h")])
export type TimestampClock = typeof ClockSchema.Type

export const TimestampSettingsSchema = Schema.Struct({
  /** Master switch: the sidebar toggle button in the window turns every date on and off. */
  enabled: Schema.optional(Schema.Boolean),
  /** Created and last-activity times in the session header. */
  header: Schema.Boolean,
  /** Last-activity time on every Home session row. */
  home: Schema.Boolean,
  /** Last-activity time on every sidebar session row. */
  sidebar: Schema.optional(Schema.Boolean),
  /** Send and answer times inside the transcript. */
  messages: Schema.Boolean,
  /** `auto` reads "Today, 15:42" / "12 Nov, 15:42"; `absolute` always carries the date. */
  format: FormatSchema,
  clock: ClockSchema,
})

export type StoredSettings = typeof TimestampSettingsSchema.Type

/** The master switch; optional so settings stored before it existed still show dates. */
export const datesEnabled = (settings: StoredSettings) => settings.enabled !== false

export const DEFAULT_SETTINGS: StoredSettings = {
  enabled: true,
  header: true,
  home: true,
  sidebar: true,
  messages: true,
  format: "auto",
  clock: "auto",
}

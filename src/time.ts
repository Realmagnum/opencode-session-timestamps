import type { TimestampClock, TimestampFormat } from "./settings"

export type TimeOptions = {
  readonly locale: string
  readonly format: TimestampFormat
  readonly clock: TimestampClock
}

const DAY = 86_400_000
/** Bounds the formatter cache; a few locales and clock variants never reach it. */
const FORMAT_CACHE_LIMIT = 64

/**
 * Building an `Intl` formatter is expensive next to `format`, and a pass over
 * every visible row asks for the same one repeatedly. Formatters are immutable,
 * so one per locale and option set is shared for the window's lifetime.
 */
const formats = new Map<string, Intl.DateTimeFormat>()
const relativeFormats = new Map<string, Intl.RelativeTimeFormat>()

function dateFormat(locale: string, options: Intl.DateTimeFormatOptions) {
  const key = `${locale}\u0000${JSON.stringify(options)}`
  let format = formats.get(key)

  if (!format) {
    if (formats.size >= FORMAT_CACHE_LIMIT) formats.clear()

    format = new Intl.DateTimeFormat(locale, options)
    formats.set(key, format)
  }

  return format
}

function relativeFormat(locale: string) {
  let format = relativeFormats.get(locale)

  if (!format) {
    format = new Intl.RelativeTimeFormat(locale, { numeric: "auto" })
    relativeFormats.set(locale, format)
  }

  return format
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

function clockOptions(clock: TimestampClock): Intl.DateTimeFormatOptions {
  if (clock === "24h") return { hour: "2-digit", minute: "2-digit", hour12: false }
  if (clock === "12h") return { hour: "2-digit", minute: "2-digit", hour12: true }

  return { hour: "2-digit", minute: "2-digit" }
}

/** A locale's own word for today or yesterday; capitalised for a label, not a sentence. */
function relativeDay(days: number, locale: string) {
  const label = relativeFormat(locale).format(-days, "day")

  return label ? `${label[0]?.toLocaleUpperCase(locale)}${label.slice(1)}` : label
}

/**
 * A compact stamp for a list or a transcript: the clock alone for today, the
 * day's name for yesterday, then a short date with the year only when it differs.
 */
export function formatStamp(value: number, options: TimeOptions) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ""

  const now = new Date()
  const time = dateFormat(options.locale, clockOptions(options.clock)).format(date)

  if (options.format === "absolute") {
    const day = dateFormat(options.locale, {
      day: "numeric",
      month: "short",
      year: date.getFullYear() === now.getFullYear() ? undefined : "numeric",
    }).format(date)

    return `${day}, ${time}`
  }

  const days = Math.round((startOfDay(now) - startOfDay(date)) / DAY)

  if (days === 0) return time
  if (days === 1) return `${relativeDay(1, options.locale)}, ${time}`

  const day = dateFormat(options.locale, {
    day: "numeric",
    month: "short",
    year: date.getFullYear() === now.getFullYear() ? undefined : "numeric",
  }).format(date)

  return `${day}, ${time}`
}

/** The clock alone, for a range that already carries its day. */
export function formatClock(value: number, options: TimeOptions) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ""

  return dateFormat(options.locale, clockOptions(options.clock)).format(date)
}

export type ElapsedOptions = {
  /** The instant the label is relative to; the row's own clock in tests. */
  readonly now?: number
  readonly translate: (key: string, params?: Record<string, string | number | boolean>) => string
}

/**
 * How long ago a session was last active, in the compact shape the Inbox list
 * uses: `now`, `49m`, `3h`, `2d`. Days keep counting, so a month-old session
 * reads `31d` rather than a date the reader has to place against today.
 */
export function formatElapsed(value: number, options: ElapsedOptions) {
  if (!Number.isFinite(value)) return ""

  const seconds = Math.max(0, Math.round(((options.now ?? Date.now()) - value) / 1000))

  if (seconds < 60) return options.translate("elapsed.now")
  if (seconds < 3_600) return options.translate("elapsed.minutes", { count: Math.floor(seconds / 60) })
  if (seconds < 86_400) return options.translate("elapsed.hours", { count: Math.floor(seconds / 3_600) })

  return options.translate("elapsed.days", { count: Math.floor(seconds / 86_400) })
}

/** The full date and time for a `title`, where room is not a concern. */
export function formatFull(value: number, locale: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ""

  return dateFormat(locale, { dateStyle: "full", timeStyle: "medium" }).format(date)
}

/** A date and time for a tooltip row: enough to place the session, without the weekday. */
export function formatAbsolute(value: number, locale: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ""

  return dateFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(date)
}

/** A turn's send time, and its answer time when the turn has finished. */
export function formatTurn(sent: number, answered: number | undefined, options: TimeOptions) {
  if (answered === undefined) return formatStamp(sent, options)

  const sameDay = startOfDay(new Date(sent)) === startOfDay(new Date(answered))

  if (sameDay) return `${formatClock(sent, options)} \u2192 ${formatClock(answered, options)}`

  return `${formatStamp(sent, options)} \u2192 ${formatStamp(answered, options)}`
}

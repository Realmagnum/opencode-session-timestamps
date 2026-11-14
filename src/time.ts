import type { TimestampClock, TimestampFormat } from "./settings"

export type TimeOptions = {
  readonly locale: string
  readonly format: TimestampFormat
  readonly clock: TimestampClock
}

const DAY = 86_400_000

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
  const label = new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(-days, "day")

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
  const time = new Intl.DateTimeFormat(options.locale, clockOptions(options.clock)).format(date)

  if (options.format === "absolute") {
    const day = new Intl.DateTimeFormat(options.locale, {
      day: "numeric",
      month: "short",
      year: date.getFullYear() === now.getFullYear() ? undefined : "numeric",
    }).format(date)

    return `${day}, ${time}`
  }

  const days = Math.round((startOfDay(now) - startOfDay(date)) / DAY)

  if (days === 0) return time
  if (days === 1) return `${relativeDay(1, options.locale)}, ${time}`

  const day = new Intl.DateTimeFormat(options.locale, {
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

  return new Intl.DateTimeFormat(options.locale, clockOptions(options.clock)).format(date)
}

/** The full date and time for a `title`, where room is not a concern. */
export function formatFull(value: number, locale: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ""

  return new Intl.DateTimeFormat(locale, { dateStyle: "full", timeStyle: "medium" }).format(date)
}

/** A date and time for a tooltip row: enough to place the session, without the weekday. */
export function formatAbsolute(value: number, locale: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ""

  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(date)
}

/** A turn's send time, and its answer time when the turn has finished. */
export function formatTurn(sent: number, answered: number | undefined, options: TimeOptions) {
  if (answered === undefined) return formatStamp(sent, options)

  const sameDay = startOfDay(new Date(sent)) === startOfDay(new Date(answered))

  if (sameDay) return `${formatClock(sent, options)} \u2192 ${formatClock(answered, options)}`

  return `${formatStamp(sent, options)} \u2192 ${formatStamp(answered, options)}`
}

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-11-15

### Added

- **Context usage rings** — every sidebar row and session tab shows how much of the model's context window the session's last answer used, with the same 14px ring the session header draws. Neutral below 80%, amber from 80%, red from 95%; the tooltip names the percentage, the used tokens and the model limit.
- **Ring switch in the sidebar header** — a second ghost button beside the clock hides or shows the rings, independent of the date switch.
- **Separate Settings section** — "Context usage" with its own switch, so rings and dates can be enabled independently.
- Data comes from the last assistant message's token usage and the model catalog's `limit.context`; rows whose messages are not loaded fetch `session.context` lazily (two at a time, cached by `time.updated`, recent sessions only).

### Changed

- The sidebar and tab date now sit in a trailing cluster immediately before the status dot, leaving room for the ring between them.

---

## [1.0.0] - 2026-11-14

### Added

- **Session header timestamps** — created and last-activity times in the official `session.header` slot, with the full timestamp in the tooltip; compact mode keeps only the last activity.
- **Home and sidebar session rows** — a right-aligned last-activity stamp. Sidebar rows are matched to sessions by unique title (their DOM carries no session id), duplicate titles are skipped.
- **Session tabs** — a compact clock that reserves the app's 24px status area, so unread/attention dots and the close button never overlap it; hidden on hover and in narrow tabs.
- **Tab hover preview** — separate **Created** and **Updated** lines with localized full dates, appended to the app's portal.
- **Transcript turns** — `sent → answered` clock above each user message, derived from `message.time.created/completed`; running turns show the send time only.
- **Quick switch** — a clock button beside the sidebar toggle turns every date on and off without opening Settings (dimmed when off).
- **Settings → Session Timestamps** — master switch, per-surface toggles, friendly (`15:42`, `Yesterday, 09:05`, `12 Nov, 15:42`) or always-absolute dates, 12/24-hour clock, and a localized live preview.
- **i18n** — English and Russian catalogs with an automatic English fallback and a key-parity test.
- **Bounded index** — times for Home/sidebar rows not loaded into the synced store come from a 500-session-per-server `session.list` index, refreshed on execution/rename/archive events.

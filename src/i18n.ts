export type TranslationParams = Record<string, string | number | boolean>

export const I18N_EN = {
  "settings.title": "Session Timestamps",
  "settings.header.title": "Session Timestamps",
  "settings.header.desc":
    "Dates for sessions and inline times for messages, so a list of weeks-old sessions reads like a chronology.",
  "settings.section.show": "Where to show times",
  "settings.show.enabled": "Show dates",
  "settings.show.enabled.desc": "Master switch; the same as the clock button beside the sidebar toggle.",
  "toggle.show": "Show dates",
  "toggle.hide": "Hide dates",
  "toggle.context.show": "Show context rings",
  "toggle.context.hide": "Hide context rings",
  "ring.title": "Context: {{percent}}% · {{used}} of {{limit}}",
  "settings.show.header": "Session header",
  "settings.show.header.desc": "Created and last-activity times above the transcript.",
  "settings.show.home": "Home session list",
  "settings.show.home.desc": "The last activity of every session row, right-aligned.",
  "settings.show.sidebar": "Sidebar session list",
  "settings.show.sidebar.desc": "The same stamp on the sessions listed in the left sidebar.",
  "settings.show.messages": "Transcript messages",
  "settings.show.messages.desc": "When a message was sent, and when its answer finished.",
  "settings.section.context": "Context usage",
  "settings.show.context": "Context rings",
  "settings.show.context.desc":
    "A ring in sidebar rows and tabs shows how much of the model's context window the session uses. The ring button in the sidebar header toggles it.",
  "settings.section.format": "Format",
  "settings.format.label": "Date style",
  "settings.format.desc": "Friendly drops today's date, absolute always keeps it.",
  "settings.format.auto": "Friendly",
  "settings.format.absolute": "Always date + time",
  "settings.clock.label": "Clock",
  "settings.clock.auto": "System",
  "settings.clock.24h": "24-hour",
  "settings.clock.12h": "12-hour",
  "settings.preview.label": "Preview",
  "settings.preview.hint": "Uses the app language and the current time.",
  "settings.reset": "Reset to defaults",
  "labels.created": "Created",
  "labels.updated": "Updated",
  "labels.sent": "Sent",
  "labels.answered": "Answered",
  "title.created": "Session created: {{time}}",
  "title.updated": "Last activity: {{time}}",
  "title.sent": "Message sent: {{time}}",
  "title.answered": "Answer finished: {{time}}",
  "title.running": "Waiting for the answer",
}

export type I18nKey = keyof typeof I18N_EN

export const I18N_RU: Record<I18nKey, string> = {
  "settings.title": "Время сессий",
  "settings.header.title": "Время сессий",
  "settings.header.desc":
    "Даты сессий и время сообщений прямо в интерфейсе, чтобы список недельной давности читался как хронология.",
  "settings.section.show": "Где показывать время",
  "settings.show.enabled": "Показывать даты",
  "settings.show.enabled.desc": "Общий выключатель; он же кнопка-часы рядом с тумблером сайдбара.",
  "toggle.show": "Показать даты",
  "toggle.hide": "Скрыть даты",
  "toggle.context.show": "Показать кольца контекста",
  "toggle.context.hide": "Скрыть кольца контекста",
  "ring.title": "Контекст: {{percent}}% · {{used}} из {{limit}}",
  "settings.show.header": "Шапка сессии",
  "settings.show.header.desc": "Время создания и последней активности над транскриптом.",
  "settings.show.home": "Список сессий на Home",
  "settings.show.home.desc": "Последняя активность каждой сессии, справа в строке.",
  "settings.show.sidebar": "Список сессий в сайдбаре",
  "settings.show.sidebar.desc": "Та же метка для сессий в левом сайдбаре.",
  "settings.show.messages": "Сообщения в транскрипте",
  "settings.show.messages.desc": "Когда сообщение отправлено и когда закончился ответ.",
  "settings.section.context": "Заполнение контекста",
  "settings.show.context": "Кольца контекста",
  "settings.show.context.desc":
    "Кольцо в строках сайдбара и на вкладках показывает, какая доля контекстного окна модели занята. Кнопка-кольцо в шапке сайдбара включает и выключает его.",
  "settings.section.format": "Формат",
  "settings.format.label": "Стиль даты",
  "settings.format.desc": "«Дружелюбный» скрывает сегодняшнюю дату, «полный» всегда её показывает.",
  "settings.format.auto": "Дружелюбный",
  "settings.format.absolute": "Всегда дата + время",
  "settings.clock.label": "Часы",
  "settings.clock.auto": "Как в системе",
  "settings.clock.24h": "24 часа",
  "settings.clock.12h": "12 часов",
  "settings.preview.label": "Пример",
  "settings.preview.hint": "Учитывает язык приложения и текущее время.",
  "settings.reset": "Сбросить настройки",
  "labels.created": "Создана",
  "labels.updated": "Обновлена",
  "labels.sent": "Отправлено",
  "labels.answered": "Ответ",
  "title.created": "Сессия создана: {{time}}",
  "title.updated": "Последняя активность: {{time}}",
  "title.sent": "Сообщение отправлено: {{time}}",
  "title.answered": "Ответ завершён: {{time}}",
  "title.running": "Ожидание ответа",
}

export const I18N_CATALOG: Record<string, Record<I18nKey, string>> & { en: Record<I18nKey, string> } = {
  en: I18N_EN,
  "en-us": I18N_EN,
  "en-gb": I18N_EN,
  ru: I18N_RU,
  "ru-ru": I18N_RU,
}

export function resolveTranslation(locale: string | undefined, key: string, params?: TranslationParams) {
  const normalized = (locale || "").toLowerCase().replace("_", "-")
  const language = normalized.split("-")[0] || "en"
  const dictionary = I18N_CATALOG[normalized] ?? I18N_CATALOG[language] ?? I18N_EN
  const template = dictionary[key as I18nKey] ?? I18N_EN[key as I18nKey] ?? key

  if (!params) return template

  return template.replace(/\{\{\s*([a-zA-Z0-9_-]+)\s*\}\}/g, (_, name: string) =>
    params[name] !== undefined ? String(params[name]) : `{{${name}}}`,
  )
}

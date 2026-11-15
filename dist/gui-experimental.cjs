Object.defineProperties(exports,{__esModule:{value:!0},[Symbol.toStringTag]:{value:`Module`}});let e=require("solid-js/web"),t=require("solid-js"),n=require("@opencode/plugin/gui"),r=require("effect");var i=r.Schema.Union([r.Schema.Literal(`auto`),r.Schema.Literal(`absolute`)]),a=r.Schema.Union([r.Schema.Literal(`auto`),r.Schema.Literal(`24h`),r.Schema.Literal(`12h`)]),o=r.Schema.Struct({enabled:r.Schema.optional(r.Schema.Boolean),header:r.Schema.Boolean,home:r.Schema.Boolean,sidebar:r.Schema.optional(r.Schema.Boolean),messages:r.Schema.Boolean,contextRing:r.Schema.optional(r.Schema.Boolean),format:i,clock:a}),s=e=>e.enabled!==!1,c=e=>e.contextRing!==!1,l={enabled:!0,header:!0,home:!0,sidebar:!0,messages:!0,contextRing:!0,format:`auto`,clock:`auto`},u=864e5;function d(e){return new Date(e.getFullYear(),e.getMonth(),e.getDate()).getTime()}function f(e){return e===`24h`?{hour:`2-digit`,minute:`2-digit`,hour12:!1}:e===`12h`?{hour:`2-digit`,minute:`2-digit`,hour12:!0}:{hour:`2-digit`,minute:`2-digit`}}function p(e,t){let n=new Intl.RelativeTimeFormat(t,{numeric:`auto`}).format(-e,`day`);return n&&`${n[0]?.toLocaleUpperCase(t)}${n.slice(1)}`}function m(e,t){let n=new Date(e);if(Number.isNaN(n.getTime()))return``;let r=new Date,i=new Intl.DateTimeFormat(t.locale,f(t.clock)).format(n);if(t.format===`absolute`)return`${new Intl.DateTimeFormat(t.locale,{day:`numeric`,month:`short`,year:n.getFullYear()===r.getFullYear()?void 0:`numeric`}).format(n)}, ${i}`;let a=Math.round((d(r)-d(n))/u);return a===0?i:a===1?`${p(1,t.locale)}, ${i}`:`${new Intl.DateTimeFormat(t.locale,{day:`numeric`,month:`short`,year:n.getFullYear()===r.getFullYear()?void 0:`numeric`}).format(n)}, ${i}`}function h(e,t){let n=new Date(e);return Number.isNaN(n.getTime())?``:new Intl.DateTimeFormat(t.locale,f(t.clock)).format(n)}function g(e,t){let n=new Date(e);return Number.isNaN(n.getTime())?``:new Intl.DateTimeFormat(t,{dateStyle:`full`,timeStyle:`medium`}).format(n)}function _(e,t){let n=new Date(e);return Number.isNaN(n.getTime())?``:new Intl.DateTimeFormat(t,{dateStyle:`medium`,timeStyle:`short`}).format(n)}function v(e,t,n){return t===void 0?m(e,n):d(new Date(e))===d(new Date(t))?`${h(e,n)} \u2192 ${h(t,n)}`:`${m(e,n)} \u2192 ${m(t,n)}`}var y={"settings.title":`Session Timestamps`,"settings.header.title":`Session Timestamps`,"settings.header.desc":`Dates for sessions and inline times for messages, so a list of weeks-old sessions reads like a chronology.`,"settings.section.show":`Where to show times`,"settings.show.enabled":`Show dates`,"settings.show.enabled.desc":`Master switch; the same as the clock button beside the sidebar toggle.`,"toggle.show":`Show dates`,"toggle.hide":`Hide dates`,"toggle.context.show":`Show context rings`,"toggle.context.hide":`Hide context rings`,"ring.title":`Context: {{percent}}% · {{used}} of {{limit}}`,"settings.show.header":`Session header`,"settings.show.header.desc":`Created and last-activity times above the transcript.`,"settings.show.home":`Home session list`,"settings.show.home.desc":`The last activity of every session row, right-aligned.`,"settings.show.sidebar":`Sidebar session list`,"settings.show.sidebar.desc":`The same stamp on the sessions listed in the left sidebar.`,"settings.show.messages":`Transcript messages`,"settings.show.messages.desc":`When a message was sent, and when its answer finished.`,"settings.section.context":`Context usage`,"settings.show.context":`Context rings`,"settings.show.context.desc":`A ring in sidebar rows and tabs shows how much of the model's context window the session uses. The ring button in the sidebar header toggles it.`,"settings.section.format":`Format`,"settings.format.label":`Date style`,"settings.format.desc":`Friendly drops today's date, absolute always keeps it.`,"settings.format.auto":`Friendly`,"settings.format.absolute":`Always date + time`,"settings.clock.label":`Clock`,"settings.clock.auto":`System`,"settings.clock.24h":`24-hour`,"settings.clock.12h":`12-hour`,"settings.preview.label":`Preview`,"settings.preview.hint":`Uses the app language and the current time.`,"settings.reset":`Reset to defaults`,"labels.created":`Created`,"labels.updated":`Updated`,"labels.sent":`Sent`,"labels.answered":`Answered`,"title.created":`Session created: {{time}}`,"title.updated":`Last activity: {{time}}`,"title.sent":`Message sent: {{time}}`,"title.answered":`Answer finished: {{time}}`,"title.running":`Waiting for the answer`},b={"settings.title":`Время сессий`,"settings.header.title":`Время сессий`,"settings.header.desc":`Даты сессий и время сообщений прямо в интерфейсе, чтобы список недельной давности читался как хронология.`,"settings.section.show":`Где показывать время`,"settings.show.enabled":`Показывать даты`,"settings.show.enabled.desc":`Общий выключатель; он же кнопка-часы рядом с тумблером сайдбара.`,"toggle.show":`Показать даты`,"toggle.hide":`Скрыть даты`,"toggle.context.show":`Показать кольца контекста`,"toggle.context.hide":`Скрыть кольца контекста`,"ring.title":`Контекст: {{percent}}% · {{used}} из {{limit}}`,"settings.show.header":`Шапка сессии`,"settings.show.header.desc":`Время создания и последней активности над транскриптом.`,"settings.show.home":`Список сессий на Home`,"settings.show.home.desc":`Последняя активность каждой сессии, справа в строке.`,"settings.show.sidebar":`Список сессий в сайдбаре`,"settings.show.sidebar.desc":`Та же метка для сессий в левом сайдбаре.`,"settings.show.messages":`Сообщения в транскрипте`,"settings.show.messages.desc":`Когда сообщение отправлено и когда закончился ответ.`,"settings.section.context":`Заполнение контекста`,"settings.show.context":`Кольца контекста`,"settings.show.context.desc":`Кольцо в строках сайдбара и на вкладках показывает, какая доля контекстного окна модели занята. Кнопка-кольцо в шапке сайдбара включает и выключает его.`,"settings.section.format":`Формат`,"settings.format.label":`Стиль даты`,"settings.format.desc":`«Дружелюбный» скрывает сегодняшнюю дату, «полный» всегда её показывает.`,"settings.format.auto":`Дружелюбный`,"settings.format.absolute":`Всегда дата + время`,"settings.clock.label":`Часы`,"settings.clock.auto":`Как в системе`,"settings.clock.24h":`24 часа`,"settings.clock.12h":`12 часов`,"settings.preview.label":`Пример`,"settings.preview.hint":`Учитывает язык приложения и текущее время.`,"settings.reset":`Сбросить настройки`,"labels.created":`Создана`,"labels.updated":`Обновлена`,"labels.sent":`Отправлено`,"labels.answered":`Ответ`,"title.created":`Сессия создана: {{time}}`,"title.updated":`Последняя активность: {{time}}`,"title.sent":`Сообщение отправлено: {{time}}`,"title.answered":`Ответ завершён: {{time}}`,"title.running":`Ожидание ответа`},x={en:y,"en-us":y,"en-gb":y,ru:b,"ru-ru":b};function S(e,t,n){let r=(e||``).toLowerCase().replace(`_`,`-`),i=r.split(`-`)[0]||`en`,a=(x[r]??x[i]??y)[t]??y[t]??t;return n?a.replace(/\{\{\s*([a-zA-Z0-9_-]+)\s*\}\}/g,(e,t)=>n[t]===void 0?`{{${t}}}`:String(n[t])):a}var C=(0,e.template)(`<span> <time>`),w=(0,e.template)(`<span class=ocst-header-sep aria-hidden=true>·`),T=(0,e.template)(`<span class=ocst-header>`),E=(0,e.template)(`<time>`),D=(0,e.template)(`<div class=ocst-settings-row><div class=ocst-settings-copy><span class=ocst-settings-label></span><span class=ocst-settings-desc></span></div><button type=button role=switch class=ocst-switch>`),ee=(0,e.template)(`<div style="max-width:760px;margin:0 auto;padding:32px 24px;font-family:var(--font-family-sans, -apple-system, BlinkMacSystemFont, sans-serif);color:var(--v2-text-text-base, light-dark(#1f1f1f, #eeeeee))"><div style=margin-bottom:28px><div style=display:flex;align-items:center;gap:8px;margin-bottom:6px><h1 style="font-size:20px;font-weight:600;margin:0;color:var(--v2-text-text-base, light-dark(#121212, #ffffff))"></h1><span style="font-size:11px;font-weight:500;color:light-dark(#6b4fae, #b392f0);background:light-dark(rgba(107, 79, 174, 0.10), rgba(157, 124, 216, 0.15));border:1px solid light-dark(rgba(107, 79, 174, 0.30), rgba(157, 124, 216, 0.35));border-radius:10px;padding:1px 7px;line-height:1.4">Plugin</span></div><p style="font-size:13px;color:var(--v2-text-text-muted, light-dark(#5f5f5f, #b0b0b0));margin:0;line-height:1.5"></p></div><div class=ocst-settings-card><div class=ocst-settings-card-title></div></div><div class=ocst-settings-card><div class=ocst-settings-card-title></div></div><div class=ocst-settings-card><div class=ocst-settings-card-title></div><div class=ocst-settings-row><div class=ocst-settings-copy><span class=ocst-settings-label></span><span class=ocst-settings-desc></span></div><select class=ocst-select></select></div><div class=ocst-settings-row><div class=ocst-settings-copy><span class=ocst-settings-label></span></div><select class=ocst-select></select></div><div class=ocst-settings-row><div class=ocst-settings-copy><span class=ocst-settings-label></span><span class=ocst-settings-desc></span></div><div class=ocst-preview></div></div></div><button type=button class=ocst-reset>`),O=(0,e.template)(`<option>`),k=(0,e.template)(`<span>`),A=`session-timestamps`,j=`<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.62516 4.46094L5.05225 3.86719L3.86475 5.05469L4.4585 7.6276L2.0835 9.21094V10.7943L4.4585 12.3776L3.86475 14.9505L5.05225 16.138L7.62516 15.5443L9.2085 17.9193H10.7918L12.3752 15.5443L14.9481 16.138L16.1356 14.9505L15.5418 12.3776L17.9168 10.7943V9.21094L15.5418 7.6276L16.1356 5.05469L14.9481 3.86719L12.3752 4.46094L10.7918 2.08594H9.2085L7.62516 4.46094Z" stroke="currentColor"/><path d="M12.5002 10.0026C12.5002 11.3833 11.3809 12.5026 10.0002 12.5026C8.61945 12.5026 7.50016 11.3833 7.50016 10.0026C7.50016 8.62189 8.61945 7.5026 10.0002 7.5026C11.3809 7.5026 12.5002 8.62189 12.5002 10.0026Z" stroke="currentColor"/></svg>`,M=`
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
  color: var(--v2-text-text-muted, light-dark(#6b6b6b, #8a8a8a));
  cursor: pointer;
  transition: color 0.15s ease, background-color 0.15s ease;
  flex-shrink: 0;
}
.plugin-settings-gear-btn:hover {
  color: light-dark(#6b4fae, #b392f0) !important;
  background-color: var(--v2-background-bg-layer-02, light-dark(rgba(0, 0, 0, 0.05), rgba(255, 255, 255, 0.08)));
}
.plugin-settings-gear-btn svg { width: 16px; height: 16px; }

.settings-nav-groups [data-slot="tabs-v2-trigger-wrapper"][data-value="${A}"] [data-slot="tabs-v2-trigger"] svg {
  color: light-dark(#6b4fae, #9d7cd8) !important;
}
`;function N(){if(typeof document>`u`)return;function e(){let e=document.querySelector(`.settings-nav-groups [data-slot="tabs-v2-trigger-wrapper"][data-value="${A}"] button, .settings-nav-groups [data-slot="tabs-v2-trigger-wrapper"][data-value="${A}"] [data-slot="tabs-v2-trigger"]`);if(e){e.click();return}let t=new URL(window.location.href);t.searchParams.set(`tab`,A),window.history.pushState({},``,t.toString()),window.dispatchEvent(new PopStateEvent(`popstate`))}function t(){for(let t of Array.from(document.querySelectorAll(`.settings-extension-row`))){if(!(t.querySelector(`.settings-extension-name`)?.textContent?.trim()??``).includes(A))continue;let n=t.querySelector(`.settings-servers-actions`);if(!n||n.querySelector(`.${A}-settings-btn`))continue;let r=document.createElement(`button`);r.type=`button`,r.className=`plugin-settings-gear-btn ${A}-settings-btn`,r.title=`Open settings`,r.setAttribute(`aria-label`,`Open settings`),r.innerHTML=j,r.addEventListener(`click`,t=>{t.preventDefault(),t.stopPropagation(),e()}),n.insertBefore(r,n.firstElementChild)}}t();let n=new MutationObserver(t);return n.observe(document.body,{childList:!0,subtree:!0}),()=>n.disconnect()}function P(n){let r=(0,t.createMemo)(()=>{let e=n.input.session.id,t=n.input.session.server.id;try{return n.ctx.servers.get(t)?.data.session.get(e)}catch{return}}),i=()=>({locale:n.locale(),format:n.settings().format,clock:n.settings().clock}),a=()=>{let e=r();if(e)return[n.t(`title.created`,{time:g(e.time.created,n.locale())}),n.t(`title.updated`,{time:g(e.time.updated??e.time.created,n.locale())})].join(`
`)};return(0,e.createComponent)(t.Show,{get when(){return(0,e.memo)(()=>!!(s(n.settings())&&n.settings().header))()?r():void 0},children:r=>{let o=()=>r().time.updated??r().time.created;return(()=>{var s=T();return(0,e.insert)(s,(0,e.createComponent)(t.Show,{get when(){return!n.input.compact},get fallback(){return(()=>{var t=E();return(0,e.insert)(t,()=>m(o(),i())),(0,e.effect)(()=>(0,e.setAttribute)(t,`datetime`,new Date(o()).toISOString())),t})()},get children(){return[(()=>{var t=C(),a=t.firstChild,o=a.nextSibling;return(0,e.insert)(t,()=>n.t(`labels.created`),a),(0,e.insert)(o,()=>m(r().time.created,i())),(0,e.effect)(()=>(0,e.setAttribute)(o,`datetime`,new Date(r().time.created).toISOString())),t})(),w(),(()=>{var t=C(),r=t.firstChild,a=r.nextSibling;return(0,e.insert)(t,()=>n.t(`labels.updated`),r),(0,e.insert)(a,()=>m(o(),i())),(0,e.effect)(()=>(0,e.setAttribute)(a,`datetime`,new Date(o()).toISOString())),t})()]}})),(0,e.effect)(()=>(0,e.setAttribute)(s,`title`,a())),s})()}})}function F(n){let r=(e,t)=>{let r=n.t(e,t);return r===e?S(n.locale(),e,t):r},i=()=>({...l,...n.settings()}),a=()=>({locale:n.locale(),format:i().format,clock:i().clock}),o=Date.now(),s=[o,o-936e5,o-10368e5,o-2592e7],c=t=>(()=>{var r=D(),a=r.firstChild,o=a.firstChild,s=o.nextSibling,c=a.nextSibling;return(0,e.insert)(o,()=>t.label),(0,e.insert)(s,()=>t.desc),c.$$click=()=>n.update({[t.key]:!i()[t.key]}),(0,e.effect)(n=>{var r=i()[t.key],a=t.label,o=i()[t.key]?`true`:`false`;return r!==n.e&&(0,e.setAttribute)(c,`aria-checked`,n.e=r),a!==n.t&&(0,e.setAttribute)(c,`aria-label`,n.t=a),o!==n.a&&(0,e.setAttribute)(c,`data-on`,n.a=o),n},{e:void 0,t:void 0,a:void 0}),r})(),u=[{value:`auto`,label:r(`settings.format.auto`)},{value:`absolute`,label:r(`settings.format.absolute`)}],d=[{value:`auto`,label:r(`settings.clock.auto`)},{value:`24h`,label:r(`settings.clock.24h`)},{value:`12h`,label:r(`settings.clock.12h`)}];return(()=>{var o=ee(),l=o.firstChild,f=l.firstChild,p=f.firstChild;p.nextSibling;var h=f.nextSibling,g=l.nextSibling,_=g.firstChild,v=g.nextSibling,y=v.firstChild,b=v.nextSibling,x=b.firstChild,S=x.nextSibling,C=S.firstChild,w=C.firstChild,T=w.nextSibling,E=C.nextSibling,D=S.nextSibling,A=D.firstChild,j=A.firstChild,M=A.nextSibling,N=D.nextSibling.firstChild,P=N.firstChild,F=P.nextSibling,I=N.nextSibling,L=b.nextSibling;return(0,e.insert)(p,()=>r(`settings.header.title`)),(0,e.insert)(h,()=>r(`settings.header.desc`)),(0,e.insert)(_,()=>r(`settings.section.show`)),(0,e.insert)(g,(0,e.createComponent)(c,{key:`enabled`,get label(){return r(`settings.show.enabled`)},get desc(){return r(`settings.show.enabled.desc`)}}),null),(0,e.insert)(g,(0,e.createComponent)(c,{key:`header`,get label(){return r(`settings.show.header`)},get desc(){return r(`settings.show.header.desc`)}}),null),(0,e.insert)(g,(0,e.createComponent)(c,{key:`home`,get label(){return r(`settings.show.home`)},get desc(){return r(`settings.show.home.desc`)}}),null),(0,e.insert)(g,(0,e.createComponent)(c,{key:`sidebar`,get label(){return r(`settings.show.sidebar`)},get desc(){return r(`settings.show.sidebar.desc`)}}),null),(0,e.insert)(g,(0,e.createComponent)(c,{key:`messages`,get label(){return r(`settings.show.messages`)},get desc(){return r(`settings.show.messages.desc`)}}),null),(0,e.insert)(y,()=>r(`settings.section.context`)),(0,e.insert)(v,(0,e.createComponent)(c,{key:`contextRing`,get label(){return r(`settings.show.context`)},get desc(){return r(`settings.show.context.desc`)}}),null),(0,e.insert)(x,()=>r(`settings.section.format`)),(0,e.insert)(w,()=>r(`settings.format.label`)),(0,e.insert)(T,()=>r(`settings.format.desc`)),E.addEventListener(`change`,e=>n.update({format:e.currentTarget.value})),(0,e.insert)(E,(0,e.createComponent)(t.For,{each:u,children:t=>(()=>{var n=O();return(0,e.insert)(n,()=>t.label),(0,e.effect)(()=>n.value=t.value),n})()})),(0,e.insert)(j,()=>r(`settings.clock.label`)),M.addEventListener(`change`,e=>n.update({clock:e.currentTarget.value})),(0,e.insert)(M,(0,e.createComponent)(t.For,{each:d,children:t=>(()=>{var n=O();return(0,e.insert)(n,()=>t.label),(0,e.effect)(()=>n.value=t.value),n})()})),(0,e.insert)(P,()=>r(`settings.preview.label`)),(0,e.insert)(F,()=>r(`settings.preview.hint`)),(0,e.insert)(I,(0,e.createComponent)(t.For,{each:s,children:t=>(()=>{var n=k();return(0,e.insert)(n,()=>m(t,a())),n})()})),(0,e.addEventListener)(L,`click`,n.reset,!0),(0,e.insert)(L,()=>r(`settings.reset`)),(0,e.effect)(()=>E.value=i().format),(0,e.effect)(()=>M.value=i().clock),o})()}(0,e.delegateEvents)([`click`]);var I=`[data-component="home-session-row-container"]`,L=`[data-component="home-session-row"]`,te=`[data-titlebar-tab-action]`,R=`[data-titlebar-tab-link]`,ne=`[data-timeline] [data-timeline-row][data-message-id]`,re=`[data-component="session-tab-popover"]`,ie=`[data-component="session-tab-popover-trigger"]:hover`,z=/\/session\/(ses_[A-Za-z0-9]+)/,B=e=>e.sidebar!==!1,V=/^(New session|Child session) - \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,ae=`button[aria-controls="vertical-tabs-sidebar"]`,oe=`[data-slot="collapsed-sidebar-toggle"]`,se=`<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="10" cy="10" r="6.6"/><path d="M10 6.2V10l2.6 1.7"/></svg>`,ce=`<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="10" cy="10" r="6.6" opacity="0.35"/><path d="M10 3.4a6.6 6.6 0 0 1 5.72 9.9"/></svg>`,le=500,ue=1500,de=6e4,fe=2,pe=6048e5,me=/-(high|medium|low|minimal|max|thinking|xhigh)$/,H=6.25,U=2*Math.PI*H,W=e=>e?e.match(V)?.[1]??e:void 0;function G(e){if(typeof document>`u`)return{schedule:()=>{}};let n=new Map,r=new Set,i=[],a,o,l=!1,u,d=new Map,f=[],p=new Set,h=new Set,y=new Map,b=(t,n)=>{let r=e.translate(t,n);return r===t?S(e.locale(),t,n):r},x=()=>({locale:e.locale(),format:e.settings().format,clock:e.settings().clock}),C=t=>new Intl.NumberFormat(e.locale(),{notation:`compact`,maximumFractionDigits:0}).format(t),w=t=>{for(let n of e.ctx.servers.list()){let r=e.ctx.servers.get(n),i=r?.data.session.get(t);if(i?.time)return{ref:r,info:i,serverID:n}}},T=e=>{let t=w(e);return t?.info.time?{id:t.info.id,created:t.info.time.created,updated:t.info.time.updated??t.info.time.created,title:t.info.title,directory:t.info.location?.directory,serverID:t.serverID}:n.get(e)},E=()=>{let t=new Map;for(let n of e.ctx.servers.list())for(let r of e.ctx.servers.get(n)?.data.session.list()??[])t.set(r.id,{id:r.id,created:r.time.created,updated:r.time.updated??r.time.created,title:r.title,directory:r.location?.directory});for(let[e,r]of n)t.has(e)||t.set(e,r);let r=new Map;for(let e of t.values()){let t=W(e.title);t&&r.set(t,(r.get(t)??0)+1)}let i=new Map;for(let e of t.values()){let t=W(e.title);t&&r.get(t)===1&&i.set(t,e)}return i},D=()=>{l||o!==void 0||(o=requestAnimationFrame(()=>{o=void 0,Te()}))},ee=async t=>{if(l||r.has(t))return;let i=e.ctx.servers.get(t)?.client;if(i){r.add(t);try{let e=await i.session.list({limit:le,order:`desc`,parentID:null});if(l)return;for(let r of e.data)n.set(r.id,{id:r.id,created:r.time.created,updated:r.time.updated??r.time.created,title:r.title,directory:r.location?.directory,serverID:t});D()}catch{}finally{r.delete(t)}}},O=(t=0)=>{l||(clearTimeout(a),a=setTimeout(()=>{for(let t of e.ctx.servers.list())ee(t)},t))};function k(e,t){document.querySelectorAll(`[data-ocst-kind="${e}"]`).forEach(e=>{t&&e.dataset.ocstSession===t||e.remove()})}let A=new Set,j=new Map,M=(t,n)=>{let r=`${t}\u0000${n??``}`,i=e.ctx.servers.get(t);if(!i||A.has(r)||Date.now()-(j.get(r)??0)<6e4)return;A.add(r),j.set(r,Date.now());let a=n?{directory:n}:void 0;Promise.all([i.data.location.provider.sync(a),i.data.location.model.sync(a)]).catch(()=>{}).finally(()=>{A.delete(r),d.clear(),D()})},N=e=>(e.split(`/`).pop()??e).replace(me,``),P=(e,t)=>{if(!e)return;let n=e.findLast(e=>e.providerID===t.providerID&&(e.id===t.id||e.modelID===t.id));if(n?.limit.context)return n.limit.context;let r=N(t.id),i=e.filter(e=>N(e.id)===r||N(e.modelID)===r),a=i.findLast(e=>e.providerID===t.providerID&&e.limit.context);return a?.limit.context?a.limit.context:i.findLast(e=>e.limit.context)?.limit.context},F=(t,n,r,i)=>{let a=[...t].reverse().find(e=>e.type===`assistant`&&e.tokens);if(!a||a.type!==`assistant`||!a.tokens)return;let o=a.tokens,s=o.input+o.output+o.reasoning+o.cache.read+o.cache.write,c=e.ctx.servers.get(n)?.data.location.model.list(r?{directory:r}:void 0),l=P(c,a.model??i??a.model);if(c&&l||M(n,r),l)return{percent:Math.round(s/l*100),used:s,limit:l}},V=()=>{for(;!l&&h.size<fe&&f.length>0;){let t=f.shift();if(!t)return;if(d.get(t.id)?.at===t.at){p.delete(t.id);continue}let n=e.ctx.servers.get(t.serverID);n?(h.add(t.id),n.client.session.context({sessionID:t.id}).then(e=>{d.set(t.id,{at:t.at,usage:F(e,t.serverID,t.directory)})}).catch(()=>{d.set(t.id,{at:t.at})}).finally(()=>{h.delete(t.id),p.delete(t.id),y.set(t.id,Date.now()),V(),D()})):p.delete(t.id)}},G=(e,t,n,r)=>{p.has(e)||h.has(e)||f.length>=24||Date.now()-(y.get(e)??0)<5e3||(p.add(e),f.push({id:e,serverID:t,at:n,directory:r}),V())},K=(e,t)=>{let n=w(e);if(n?.ref){let r=d.get(e);if(r&&r.at>=t.updated)return r.usage;let i=n.ref.data.session.message.list(e);if(i.length>0){let r=F(i,n.serverID,n.info.location?.directory,n.info.model);if(r)return d.set(e,{at:t.updated,usage:r}),r}return G(e,n.serverID,t.updated,n.info.location?.directory),d.get(e)?.usage}let r=d.get(e);return r&&r.at>=t.updated?r.usage:(t.serverID&&Date.now()-t.updated<pe&&G(e,t.serverID,t.updated,t.directory),r?.usage)};function q(t,n){let r=m(n.updated,x());t.textContent!==r&&(t.textContent=r);let i=[b(`title.created`,{time:g(n.created,e.locale())}),b(`title.updated`,{time:g(n.updated,e.locale())})].join(`
`);t.title!==i&&(t.title=i),t.dateTime=new Date(n.updated).toISOString()}function he(){let t=e.settings();document.querySelectorAll(I).forEach(e=>{let n=e.querySelector(L),r=e.dataset.sessionId,i=r?T(r):void 0;n&&(!r||!i?n.querySelector(`:scope > [data-ocst-kind="trail-home"]`)?.remove():J(n,`home`,r,i,s(t)&&t.home))})}function ge(e,t,n){let r=e.querySelector(`:scope > [data-ocst-kind="date"]`);n?(r||(r=document.createElement(`time`),r.dataset.ocstKind=`date`,r.className=e.dataset.ocstTrail===`tab`?`ocst-tab-time`:`ocst-side-time`,e.prepend(r)),q(r,t)):r?.remove()}function _e(e,t,n,r){let i=e.querySelector(`:scope > [data-ocst-kind="ring"]`);if(!r){i?.remove();return}let a=K(t,n);if(!a){i?.remove();return}i||(i=document.createElement(`span`),i.dataset.ocstKind=`ring`,i.className=`ocst-ring`,i.innerHTML=`<svg viewBox="0 0 14 14" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="${H}" stroke="var(--ocst-ring-track, var(--v2-background-bg-layer-04))" stroke-width="1.5"/><circle data-ocst-arc cx="7" cy="7" r="${H}" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" transform="rotate(-90 7 7)"/></svg>`,e.append(i));let o=i.querySelector(`[data-ocst-arc]`),s=U*(1-Math.max(0,Math.min(100,a.percent))/100);o&&(o.setAttribute(`stroke-dasharray`,U.toFixed(2)),o.setAttribute(`stroke-dashoffset`,s.toFixed(2)));let c=a.percent>=95?`critical`:a.percent>=80?`high`:`normal`;i.dataset.level!==c&&(i.dataset.level=c);let l=b(`ring.title`,{percent:a.percent,used:C(a.used),limit:C(a.limit)});i.title!==l&&(i.title=l)}function J(t,n,r,i,a){let o=a,s=c(e.settings()),l=`:scope > [data-ocst-kind="trail-${n}"]`,u=t.querySelector(l);!o&&!s?u?.remove():(u||(u=document.createElement(`span`),u.dataset.ocstKind=`trail-${n}`,u.dataset.ocstTrail=n,u.className=`ocst-trail ocst-trail--${n}`,n===`side`?t.insertBefore(u,t.lastElementChild):t.append(u)),ge(u,i,o),_e(u,r,i,s))}function ve(){let t=document.querySelectorAll(te);if(t.length===0)return;let n=E();t.forEach(t=>{let r=t.getAttribute(`title`)?.trim(),i=r?n.get(r):void 0;i?J(t,`side`,i.id,i,s(e.settings())&&B(e.settings())):t.querySelector(`:scope > [data-ocst-kind="trail-side"]`)?.remove()})}function ye(){document.querySelectorAll(R).forEach(t=>{let n=t.getAttribute(`href`)?.match(z)?.[1],r=n?T(n):void 0;r?J(t,`tab`,n??``,r,s(e.settings())&&B(e.settings())):t.querySelector(`:scope > [data-ocst-kind="trail-tab"]`)?.remove()}),be()}function Y(e,t){let n=document.createElement(`div`);n.dataset.slot=`row`;let r=document.createElement(`span`);return r.dataset.slot=`detail`,r.textContent=`${e} \u00b7 ${t}`,n.append(r),n}function be(){let t=document.querySelector(re);if(!t)return;let n=document.querySelector(ie)?.querySelector(R)?.getAttribute(`href`)?.match(z)?.[1]??u,r=n?T(n):void 0,i=t.querySelector(`:scope > [data-ocst-kind="popover"]`);if(!r||!s(e.settings())||!B(e.settings())){i?.remove();return}i||(i=document.createElement(`div`),i.dataset.ocstKind=`popover`,i.className=`ocst-popover`,i.append(Y(``,``),Y(``,``)),t.append(i));let a=i.querySelectorAll(`[data-slot="detail"]`),o=`${b(`labels.created`)} \u00b7 ${_(r.created,e.locale())}`,c=`${b(`labels.updated`)} \u00b7 ${_(r.updated,e.locale())}`;a[0]&&a[0].textContent!==o&&(a[0].textContent=o),a[1]&&a[1].textContent!==c&&(a[1].textContent=c)}function xe(t,n){let r=new Map,i=e.ctx.servers.get(n)?.data.session.message.list(t)??[],a;for(let e of i){if(e.type===`user`){a=e.id,r.set(e.id,{sent:e.time.created});continue}if(e.type!==`assistant`||!a)continue;let t=r.get(a),n=e.time.completed;t&&n!==void 0&&(t.answered=Math.max(t.answered??0,n))}return r}function Se(t,n){let r=t.querySelector(`[data-component="user-message"]`)?.closest(`[data-slot="session-turn-message-container"]`)??t.querySelector(`[data-slot="session-turn-message-container"]`);if(!r)return;let i=r.querySelector(`:scope > [data-ocst-kind="turn"]`);if(!i){i=document.createElement(`div`),i.dataset.ocstKind=`turn`,i.className=`ocst-turn`;let e=document.createElement(`time`);e.className=`ocst-turn-time`,i.append(e),r.prepend(i)}let a=i.querySelector(`time`);if(!a)return;let o=v(n.sent,n.answered,x());a.textContent!==o&&(a.textContent=o);let s=[b(`title.sent`,{time:g(n.sent,e.locale())}),n.answered===void 0?b(`title.running`):b(`title.answered`,{time:g(n.answered,e.locale())})].join(`
`);a.title!==s&&(a.title=s),i.dataset.ocstSession=t.dataset.messageId??``,a.dateTime=new Date(n.answered??n.sent).toISOString()}function Ce(){let t=e.ctx.sessions.current();if(!s(e.settings())||!e.settings().messages||!t){k(`turn`);return}let n=xe(t.id,t.server.id);document.querySelectorAll(ne).forEach(e=>{if(e.dataset.timelineRow!==`UserMessage`)return;let t=e.dataset.messageId,r=t?n.get(t):void 0;r?Se(e,r):e.querySelector(`[data-ocst-kind="turn"]`)?.remove()})}function X(e,t,n,r,i){let a=document.querySelector(`[data-ocst-kind="${e}"]`);return a||(a=document.createElement(`button`),a.dataset.ocstKind=e,a.type=`button`,a.className=`ocst-toggle`,a.innerHTML=t,a.addEventListener(`click`,e=>{e.preventDefault(),e.stopPropagation(),i()})),a.dataset.on=r?`true`:`false`,a.setAttribute(`aria-pressed`,r?`true`:`false`),a.setAttribute(`aria-label`,n),a.title!==n&&(a.title=n),a}function we(){let t=Array.from(document.querySelectorAll(ae)).find(e=>!e.closest(oe))?.parentElement,n=document.querySelector(`[data-ocst-kind="toggle"]`),r=document.querySelector(`[data-ocst-kind="context-toggle"]`);if(!t||!t.parentElement){n?.remove(),r?.remove();return}let i=s(e.settings()),a=X(`toggle`,se,b(i?`toggle.hide`:`toggle.show`),i,e.toggle);(a.parentElement!==t.parentElement||(a.compareDocumentPosition(t)&Node.DOCUMENT_POSITION_FOLLOWING)===0)&&t.parentElement.insertBefore(a,t);let o=c(e.settings()),l=X(`context-toggle`,ce,b(o?`toggle.context.hide`:`toggle.context.show`),o,e.toggleContext);l.previousElementSibling!==a&&a.after(l)}function Te(){l||(we(),c(e.settings())||(f.length=0,p.clear()),he(),ve(),ye(),Ce())}let Z=()=>{for(let e of i.splice(0))e();let t=()=>O(ue);for(let n of e.ctx.servers.list()){let r=e.ctx.servers.get(n)?.data;r&&i.push(r.on(`session.execution.succeeded`,t),r.on(`session.execution.failed`,t),r.on(`session.execution.interrupted`,t),r.on(`session.renamed`,t),r.on(`session.archived`,t),r.on(`session.deleted`,t))}};(0,t.createEffect)((0,t.on)(()=>e.ctx.servers.list().join(`\0`),()=>{Z(),O()},{defer:!0}));let Q=new MutationObserver(D);Q.observe(document.body,{childList:!0,subtree:!0,characterData:!0});let Ee=e=>{let t=((e.target instanceof Element?e.target:void 0)?.closest(`[data-titlebar-tab]`)?.querySelector(R)?.getAttribute(`href`))?.match(z)?.[1];t&&(u=t)};document.addEventListener(`pointerover`,Ee,!0);let De=setInterval(()=>{document.hidden||(e.settings().home||B(e.settings()))&&O()},de),$=()=>{document.hidden||(D(),O())};return document.addEventListener(`visibilitychange`,$),Z(),O(),D(),(0,t.onCleanup)(()=>{l=!0,Q.disconnect(),clearInterval(De),clearTimeout(a),o!==void 0&&cancelAnimationFrame(o),document.removeEventListener(`visibilitychange`,$),document.removeEventListener(`pointerover`,Ee,!0);for(let e of i.splice(0))e();k(`trail-home`),k(`sidebar`),k(`tab`),k(`popover`),k(`turn`),k(`toggle`),k(`context-toggle`),k(`trail-side`),k(`trail-tab`)}),{schedule:D}}function K(t){let n=()=>({...l,...t.store.value});return(0,e.createComponent)(F,{settings:n,update:e=>t.store.set({...n(),...e}),reset:()=>t.store.set(l),get t(){return t.t},get locale(){return t.locale}})}var q=n.Plugin.define({stores:{timestamps:n.Store.global(o,l)},i18n:x,setup(r){console.info(`[session-timestamps] gui ready`);let i=()=>({...l,...r.stores.timestamps.value}),a=()=>r.locale.locale()||`en`,o=(e,t)=>{let n=r.t(e,t);return n===e?S(a(),e,t):n};r.add(n.Style,M),r.add(n.Slot,{at:`session.header`,order:20,render:t=>(0,e.createComponent)(P,{ctx:r,input:t,settings:i,locale:a,t:o})}),r.add(n.SettingsPage,()=>({id:`session-timestamps`,icon:`comment`,title:o(`settings.title`),render:()=>(0,e.createComponent)(K,{get store(){return r.stores.timestamps},t:o,locale:a})}));let u=G({ctx:r,settings:i,locale:a,translate:(e,t)=>r.t(e,t),toggle:()=>r.stores.timestamps.set({...i(),enabled:!s(i())}),toggleContext:()=>r.stores.timestamps.set({...i(),contextRing:!c(i())})});(0,t.createEffect)(()=>{i(),a(),u.schedule()}),N()}});exports.default=q;
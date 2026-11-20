Object.defineProperties(exports,{__esModule:{value:!0},[Symbol.toStringTag]:{value:`Module`}});let e=require("solid-js/web"),t=require("solid-js"),n=require("@opencode/plugin/gui"),r=require("effect");var i=r.Schema.Union([r.Schema.Literal(`auto`),r.Schema.Literal(`absolute`)]),a=r.Schema.Union([r.Schema.Literal(`auto`),r.Schema.Literal(`24h`),r.Schema.Literal(`12h`)]),o=r.Schema.Struct({enabled:r.Schema.optional(r.Schema.Boolean),header:r.Schema.Boolean,home:r.Schema.Boolean,sidebar:r.Schema.optional(r.Schema.Boolean),sidebarRelative:r.Schema.optional(r.Schema.Boolean),messages:r.Schema.Boolean,contextRing:r.Schema.optional(r.Schema.Boolean),format:i,clock:a}),s=e=>e.enabled!==!1,c=e=>e.contextRing!==!1,l=e=>e.sidebarRelative!==!1,u={enabled:!0,header:!0,home:!0,sidebar:!0,sidebarRelative:!0,messages:!0,contextRing:!0,format:`auto`,clock:`auto`},d=864e5,f=64,p=new Map,m=new Map;function h(e,t){let n=`${e}\u0000${JSON.stringify(t)}`,r=p.get(n);return r||(p.size>=f&&p.clear(),r=new Intl.DateTimeFormat(e,t),p.set(n,r)),r}function g(e){let t=m.get(e);return t||(t=new Intl.RelativeTimeFormat(e,{numeric:`auto`}),m.set(e,t)),t}function _(e){return new Date(e.getFullYear(),e.getMonth(),e.getDate()).getTime()}function v(e){return e===`24h`?{hour:`2-digit`,minute:`2-digit`,hour12:!1}:e===`12h`?{hour:`2-digit`,minute:`2-digit`,hour12:!0}:{hour:`2-digit`,minute:`2-digit`}}function y(e,t){let n=g(t).format(-e,`day`);return n&&`${n[0]?.toLocaleUpperCase(t)}${n.slice(1)}`}function b(e,t){let n=new Date(e);if(Number.isNaN(n.getTime()))return``;let r=new Date,i=h(t.locale,v(t.clock)).format(n);if(t.format===`absolute`)return`${h(t.locale,{day:`numeric`,month:`short`,year:n.getFullYear()===r.getFullYear()?void 0:`numeric`}).format(n)}, ${i}`;let a=Math.round((_(r)-_(n))/d);return a===0?i:a===1?`${y(1,t.locale)}, ${i}`:`${h(t.locale,{day:`numeric`,month:`short`,year:n.getFullYear()===r.getFullYear()?void 0:`numeric`}).format(n)}, ${i}`}function x(e,t){let n=new Date(e);return Number.isNaN(n.getTime())?``:h(t.locale,v(t.clock)).format(n)}function ee(e,t){if(!Number.isFinite(e))return``;let n=Math.max(0,Math.round(((t.now??Date.now())-e)/1e3));return n<60?t.translate(`elapsed.now`):n<3600?t.translate(`elapsed.minutes`,{count:Math.floor(n/60)}):n<86400?t.translate(`elapsed.hours`,{count:Math.floor(n/3600)}):t.translate(`elapsed.days`,{count:Math.floor(n/86400)})}function S(e,t){let n=new Date(e);return Number.isNaN(n.getTime())?``:h(t,{dateStyle:`full`,timeStyle:`medium`}).format(n)}function C(e,t){let n=new Date(e);return Number.isNaN(n.getTime())?``:h(t,{dateStyle:`medium`,timeStyle:`short`}).format(n)}function w(e,t,n){return t===void 0?b(e,n):_(new Date(e))===_(new Date(t))?`${x(e,n)} \u2192 ${x(t,n)}`:`${b(e,n)} \u2192 ${b(t,n)}`}var T={"settings.title":`Session Timestamps`,"settings.header.title":`Session Timestamps`,"settings.header.desc":`Dates for sessions and inline times for messages, so a list of weeks-old sessions reads like a chronology.`,"settings.section.show":`Where to show times`,"settings.show.enabled":`Show dates`,"settings.show.enabled.desc":`Master switch; the same as the clock button beside the sidebar toggle.`,"toggle.show":`Show dates`,"toggle.hide":`Hide dates`,"toggle.context.show":`Show context rings`,"toggle.context.hide":`Hide context rings`,"ring.title":`Context: {{percent}}% · {{used}} of {{limit}}`,"settings.show.header":`Session header`,"settings.show.header.desc":`Created and last-activity times above the transcript.`,"settings.show.home":`Home session list`,"settings.show.home.desc":`The last activity of every session row, right-aligned.`,"settings.show.sidebar":`Sidebar session list`,"settings.show.sidebar.desc":`The same stamp on the sessions listed in the left sidebar.`,"settings.show.messages":`Transcript messages`,"settings.show.messages.desc":`When a message was sent, and when its answer finished.`,"settings.section.context":`Context usage`,"settings.show.context":`Context rings`,"settings.show.context.desc":`A ring in sidebar rows and tabs shows how much of the model's context window the session uses. The ring button in the sidebar header toggles it.`,"settings.section.format":`Format`,"settings.format.label":`Date style`,"settings.format.desc":`Friendly drops today's date, absolute always keeps it.`,"settings.format.auto":`Friendly`,"settings.format.absolute":`Always date + time`,"settings.format.relative":`Relative time in sidebar`,"settings.format.relative.desc":`How long ago a session was active — 49m, 3h, 2d — instead of its date, in side tabs. On by default, like the Inbox layout; the tooltip keeps the exact times.`,"settings.clock.label":`Clock`,"settings.clock.auto":`System`,"settings.clock.24h":`24-hour`,"settings.clock.12h":`12-hour`,"settings.preview.label":`Preview`,"settings.preview.hint":`Uses the app language and the current time.`,"settings.preview.relative":`Relative`,"settings.preview.relative.hint":`What the sidebar shows with the relative style.`,"elapsed.now":`now`,"elapsed.minutes":`{{count}}m`,"elapsed.hours":`{{count}}h`,"elapsed.days":`{{count}}d`,"settings.reset":`Reset to defaults`,"labels.created":`Created`,"labels.updated":`Updated`,"labels.sent":`Sent`,"labels.answered":`Answered`,"title.created":`Session created: {{time}}`,"title.updated":`Last activity: {{time}}`,"title.sent":`Message sent: {{time}}`,"title.answered":`Answer finished: {{time}}`,"title.running":`Waiting for the answer`},E={"settings.title":`Время сессий`,"settings.header.title":`Время сессий`,"settings.header.desc":`Даты сессий и время сообщений прямо в интерфейсе, чтобы список недельной давности читался как хронология.`,"settings.section.show":`Где показывать время`,"settings.show.enabled":`Показывать даты`,"settings.show.enabled.desc":`Общий выключатель; он же кнопка-часы рядом с тумблером сайдбара.`,"toggle.show":`Показать даты`,"toggle.hide":`Скрыть даты`,"toggle.context.show":`Показать кольца контекста`,"toggle.context.hide":`Скрыть кольца контекста`,"ring.title":`Контекст: {{percent}}% · {{used}} из {{limit}}`,"settings.show.header":`Шапка сессии`,"settings.show.header.desc":`Время создания и последней активности над транскриптом.`,"settings.show.home":`Список сессий на Home`,"settings.show.home.desc":`Последняя активность каждой сессии, справа в строке.`,"settings.show.sidebar":`Список сессий в сайдбаре`,"settings.show.sidebar.desc":`Та же метка для сессий в левом сайдбаре.`,"settings.show.messages":`Сообщения в транскрипте`,"settings.show.messages.desc":`Когда сообщение отправлено и когда закончился ответ.`,"settings.section.context":`Заполнение контекста`,"settings.show.context":`Кольца контекста`,"settings.show.context.desc":`Кольцо в строках сайдбара и на вкладках показывает, какая доля контекстного окна модели занята. Кнопка-кольцо в шапке сайдбара включает и выключает его.`,"settings.section.format":`Формат`,"settings.format.label":`Стиль даты`,"settings.format.desc":`«Дружелюбный» скрывает сегодняшнюю дату, «полный» всегда её показывает.`,"settings.format.auto":`Дружелюбный`,"settings.format.absolute":`Всегда дата + время`,"settings.format.relative":`Относительное время в сайдбаре`,"settings.format.relative.desc":`Сколько прошло с последней активности — 49м, 3ч, 2д, — вместо даты, в side tabs. Включено по умолчанию, как в Inbox; в подсказке остаются точные дата и время.`,"settings.clock.label":`Часы`,"settings.clock.auto":`Как в системе`,"settings.clock.24h":`24 часа`,"settings.clock.12h":`12 часов`,"settings.preview.label":`Пример`,"settings.preview.hint":`Учитывает язык приложения и текущее время.`,"settings.preview.relative":`Относительно`,"settings.preview.relative.hint":`То, что покажет сайдбар в относительном стиле.`,"elapsed.now":`сейчас`,"elapsed.minutes":`{{count}}м`,"elapsed.hours":`{{count}}ч`,"elapsed.days":`{{count}}д`,"settings.reset":`Сбросить настройки`,"labels.created":`Создана`,"labels.updated":`Обновлена`,"labels.sent":`Отправлено`,"labels.answered":`Ответ`,"title.created":`Сессия создана: {{time}}`,"title.updated":`Последняя активность: {{time}}`,"title.sent":`Сообщение отправлено: {{time}}`,"title.answered":`Ответ завершён: {{time}}`,"title.running":`Ожидание ответа`},D={en:T,"en-us":T,"en-gb":T,ru:E,"ru-ru":E};function O(e,t,n){let r=(e||``).toLowerCase().replace(`_`,`-`),i=r.split(`-`)[0]||`en`,a=(D[r]??D[i]??T)[t]??T[t]??t;return n?a.replace(/\{\{\s*([a-zA-Z0-9_-]+)\s*\}\}/g,(e,t)=>n[t]===void 0?`{{${t}}}`:String(n[t])):a}var k=(0,e.template)(`<span> <time>`),A=(0,e.template)(`<span class=ocst-header-sep aria-hidden=true>·`),j=(0,e.template)(`<span class=ocst-header>`),M=(0,e.template)(`<time>`),N=(0,e.template)(`<div class=ocst-settings-row><div class=ocst-settings-copy><span class=ocst-settings-label></span><span class=ocst-settings-desc></span></div><button type=button role=switch class=ocst-switch>`),P=(0,e.template)(`<div style="max-width:760px;margin:0 auto;padding:32px 24px;font-family:var(--font-family-sans, -apple-system, BlinkMacSystemFont, sans-serif);color:var(--v2-text-text-base, light-dark(#1f1f1f, #eeeeee))"><div style=margin-bottom:28px><div style=display:flex;align-items:center;gap:8px;margin-bottom:6px><h1 style="font-size:20px;font-weight:600;margin:0;color:var(--v2-text-text-base, light-dark(#121212, #ffffff))"></h1><span style="font-size:11px;font-weight:500;color:light-dark(#6b4fae, #b392f0);background:light-dark(rgba(107, 79, 174, 0.10), rgba(157, 124, 216, 0.15));border:1px solid light-dark(rgba(107, 79, 174, 0.30), rgba(157, 124, 216, 0.35));border-radius:10px;padding:1px 7px;line-height:1.4">Plugin</span></div><p style="font-size:13px;color:var(--v2-text-text-muted, light-dark(#5f5f5f, #b0b0b0));margin:0;line-height:1.5"></p></div><div class=ocst-settings-card><div class=ocst-settings-card-title></div></div><div class=ocst-settings-card><div class=ocst-settings-card-title></div></div><div class=ocst-settings-card><div class=ocst-settings-card-title></div><div class=ocst-settings-row><div class=ocst-settings-copy><span class=ocst-settings-label></span><span class=ocst-settings-desc></span></div><select class=ocst-select></select></div><div class=ocst-settings-row><div class=ocst-settings-copy><span class=ocst-settings-label></span></div><select class=ocst-select></select></div><div class=ocst-settings-row><div class=ocst-settings-copy><span class=ocst-settings-label></span><span class=ocst-settings-desc></span></div><div class=ocst-preview></div></div><div class=ocst-settings-row><div class=ocst-settings-copy><span class=ocst-settings-label></span><span class=ocst-settings-desc></span></div><div class=ocst-preview></div></div></div><button type=button class=ocst-reset>`),F=(0,e.template)(`<option>`),I=(0,e.template)(`<span>`),L=`
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

.settings-nav-groups [data-slot="tabs-v2-trigger-wrapper"][data-value="session-timestamps"] [data-slot="tabs-v2-trigger"] svg {
  color: light-dark(#6b4fae, #9d7cd8) !important;
}
`;function R(n){let r=(0,t.createMemo)(()=>{let e=n.input.session.id,t=n.input.session.server.id;try{return n.ctx.servers.get(t)?.data.session.get(e)}catch{return}}),i=()=>({locale:n.locale(),format:n.settings().format,clock:n.settings().clock}),a=()=>{let e=r();if(e)return[n.t(`title.created`,{time:S(e.time.created,n.locale())}),n.t(`title.updated`,{time:S(e.time.updated??e.time.created,n.locale())})].join(`
`)};return(0,e.createComponent)(t.Show,{get when(){return(0,e.memo)(()=>!!(s(n.settings())&&n.settings().header))()?r():void 0},children:r=>{let o=()=>r().time.updated??r().time.created;return(()=>{var s=j();return(0,e.insert)(s,(0,e.createComponent)(t.Show,{get when(){return!n.input.compact},get fallback(){return(()=>{var t=M();return(0,e.insert)(t,()=>b(o(),i())),(0,e.effect)(()=>(0,e.setAttribute)(t,`datetime`,new Date(o()).toISOString())),t})()},get children(){return[(()=>{var t=k(),a=t.firstChild,o=a.nextSibling;return(0,e.insert)(t,()=>n.t(`labels.created`),a),(0,e.insert)(o,()=>b(r().time.created,i())),(0,e.effect)(()=>(0,e.setAttribute)(o,`datetime`,new Date(r().time.created).toISOString())),t})(),A(),(()=>{var t=k(),r=t.firstChild,a=r.nextSibling;return(0,e.insert)(t,()=>n.t(`labels.updated`),r),(0,e.insert)(a,()=>b(o(),i())),(0,e.effect)(()=>(0,e.setAttribute)(a,`datetime`,new Date(o()).toISOString())),t})()]}})),(0,e.effect)(()=>(0,e.setAttribute)(s,`title`,a())),s})()}})}function z(n){let r=(e,t)=>{let r=n.t(e,t);return r===e?O(n.locale(),e,t):r},i=()=>({...u,...n.settings()}),a=()=>({locale:n.locale(),format:i().format,clock:i().clock}),o=Date.now(),s=[o,o-936e5,o-10368e5,o-2592e7],c=[o-24e5,o-18e6,o-1728e5,o-3888e6],l=t=>(()=>{var r=N(),a=r.firstChild,o=a.firstChild,s=o.nextSibling,c=a.nextSibling;return(0,e.insert)(o,()=>t.label),(0,e.insert)(s,()=>t.desc),c.$$click=()=>n.update({[t.key]:!i()[t.key]}),(0,e.effect)(n=>{var r=i()[t.key],a=t.label,o=i()[t.key]?`true`:`false`;return r!==n.e&&(0,e.setAttribute)(c,`aria-checked`,n.e=r),a!==n.t&&(0,e.setAttribute)(c,`aria-label`,n.t=a),o!==n.a&&(0,e.setAttribute)(c,`data-on`,n.a=o),n},{e:void 0,t:void 0,a:void 0}),r})(),d=[{value:`auto`,label:r(`settings.format.auto`)},{value:`absolute`,label:r(`settings.format.absolute`)}],f=[{value:`auto`,label:r(`settings.clock.auto`)},{value:`24h`,label:r(`settings.clock.24h`)},{value:`12h`,label:r(`settings.clock.12h`)}];return(()=>{var u=P(),p=u.firstChild,m=p.firstChild,h=m.firstChild;h.nextSibling;var g=m.nextSibling,_=p.nextSibling,v=_.firstChild,y=_.nextSibling,x=y.firstChild,S=y.nextSibling,C=S.firstChild,w=C.nextSibling,T=w.firstChild,E=T.firstChild,D=E.nextSibling,O=T.nextSibling,k=w.nextSibling,A=k.firstChild,j=A.firstChild,M=A.nextSibling,N=k.nextSibling,L=N.firstChild,R=L.firstChild,z=R.nextSibling,B=L.nextSibling,V=N.nextSibling.firstChild,H=V.firstChild,te=H.nextSibling,U=V.nextSibling,W=S.nextSibling;return(0,e.insert)(h,()=>r(`settings.header.title`)),(0,e.insert)(g,()=>r(`settings.header.desc`)),(0,e.insert)(v,()=>r(`settings.section.show`)),(0,e.insert)(_,(0,e.createComponent)(l,{key:`enabled`,get label(){return r(`settings.show.enabled`)},get desc(){return r(`settings.show.enabled.desc`)}}),null),(0,e.insert)(_,(0,e.createComponent)(l,{key:`header`,get label(){return r(`settings.show.header`)},get desc(){return r(`settings.show.header.desc`)}}),null),(0,e.insert)(_,(0,e.createComponent)(l,{key:`home`,get label(){return r(`settings.show.home`)},get desc(){return r(`settings.show.home.desc`)}}),null),(0,e.insert)(_,(0,e.createComponent)(l,{key:`sidebar`,get label(){return r(`settings.show.sidebar`)},get desc(){return r(`settings.show.sidebar.desc`)}}),null),(0,e.insert)(_,(0,e.createComponent)(l,{key:`messages`,get label(){return r(`settings.show.messages`)},get desc(){return r(`settings.show.messages.desc`)}}),null),(0,e.insert)(x,()=>r(`settings.section.context`)),(0,e.insert)(y,(0,e.createComponent)(l,{key:`contextRing`,get label(){return r(`settings.show.context`)},get desc(){return r(`settings.show.context.desc`)}}),null),(0,e.insert)(C,()=>r(`settings.section.format`)),(0,e.insert)(E,()=>r(`settings.format.label`)),(0,e.insert)(D,()=>r(`settings.format.desc`)),O.addEventListener(`change`,e=>n.update({format:e.currentTarget.value})),(0,e.insert)(O,(0,e.createComponent)(t.For,{each:d,children:t=>(()=>{var n=F();return(0,e.insert)(n,()=>t.label),(0,e.effect)(()=>n.value=t.value),n})()})),(0,e.insert)(j,()=>r(`settings.clock.label`)),M.addEventListener(`change`,e=>n.update({clock:e.currentTarget.value})),(0,e.insert)(M,(0,e.createComponent)(t.For,{each:f,children:t=>(()=>{var n=F();return(0,e.insert)(n,()=>t.label),(0,e.effect)(()=>n.value=t.value),n})()})),(0,e.insert)(S,(0,e.createComponent)(l,{key:`sidebarRelative`,get label(){return r(`settings.format.relative`)},get desc(){return r(`settings.format.relative.desc`)}}),N),(0,e.insert)(R,()=>r(`settings.preview.label`)),(0,e.insert)(z,()=>r(`settings.preview.hint`)),(0,e.insert)(B,(0,e.createComponent)(t.For,{each:s,children:t=>(()=>{var n=I();return(0,e.insert)(n,()=>b(t,a())),n})()})),(0,e.insert)(H,()=>r(`settings.preview.relative`)),(0,e.insert)(te,()=>r(`settings.preview.relative.hint`)),(0,e.insert)(U,(0,e.createComponent)(t.For,{each:c,children:t=>(()=>{var n=I();return(0,e.insert)(n,()=>ee(t,{now:o,translate:r})),n})()})),(0,e.addEventListener)(W,`click`,n.reset,!0),(0,e.insert)(W,()=>r(`settings.reset`)),(0,e.effect)(()=>O.value=i().format),(0,e.effect)(()=>M.value=i().clock),u})()}(0,e.delegateEvents)([`click`]);var B=250;function V(e){let t=e.document??globalThis.document,n=e.interval??B;if(!t||typeof MutationObserver>`u`)return{schedule(){},flush(){},stop(){}};let r=e.observe??t.documentElement,i=0,a,o,s=!1,c=!1,l=()=>{a=void 0,o=void 0,s=!1,c||t.hidden||(i=Date.now(),e.run())},u=()=>{if(c||s)return;s=!0;let e=i+n-Date.now();e<=0?a=requestAnimationFrame(l):o=setTimeout(l,e)},d=new MutationObserver(t=>{c||s||(!e.relevant||e.relevant(t))&&u()});return d.observe(r,{childList:!0,subtree:!0}),{schedule:u,flush(){c||(a!==void 0&&cancelAnimationFrame(a),o!==void 0&&clearTimeout(o),s=!1,l())},stop(){c=!0,d.disconnect(),a!==void 0&&cancelAnimationFrame(a),o!==void 0&&clearTimeout(o),a=void 0,o=void 0,s=!1}}}var H=`[data-component="home-session-row-container"]`,te=`[data-component="home-session-row"]`,U=`[data-titlebar-tab-action]`,W=`[data-slot="sidebar-inbox-item"]`,G=`[data-titlebar-tab-link]`,K=`[data-timeline] [data-timeline-row][data-message-id]`,ne=`[data-component="session-tab-popover"]`,re=`[data-component="session-tab-popover-trigger"]:hover`,q=/\/session\/(ses_[A-Za-z0-9]+)/,J=e=>e.sidebar!==!1,ie=/^(New session|Child session) - \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,ae=`button[aria-controls="vertical-tabs-sidebar"]`,oe=`[data-slot="collapsed-sidebar-toggle"]`,se=`<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="10" cy="10" r="6.6"/><path d="M10 6.2V10l2.6 1.7"/></svg>`,ce=`<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="10" cy="10" r="6.6" opacity="0.35"/><path d="M10 3.4a6.6 6.6 0 0 1 5.72 9.9"/></svg>`,le=500,ue=1500,de=6e4,fe=250,pe=2,me=6048e5,he=/-(high|medium|low|minimal|max|thinking|xhigh)$/,Y=6.25,ge=2*Math.PI*Y,_e=e=>e?e.match(ie)?.[1]??e:void 0;function X(e){if(typeof document>`u`)return{schedule:()=>{}};let n=new Map,r=new Set,i=[],a,o=!1,u,d,f=new Map,p=[],m=new Set,h=new Set,g=new Map,_=(t,n)=>{let r=e.translate(t,n);return r===t?O(e.locale(),t,n):r},v=()=>({locale:e.locale(),format:e.settings().format,clock:e.settings().clock}),y=t=>new Intl.NumberFormat(e.locale(),{notation:`compact`,maximumFractionDigits:0}).format(t),x=t=>{for(let n of e.ctx.servers.list()){let r=e.ctx.servers.get(n),i=r?.data.session.get(t);if(i?.time)return{ref:r,info:i,serverID:n}}},T=new Map,E=e=>{if(T.has(e))return T.get(e);let t=D(e);return T.set(e,t),t},D=e=>{let t=x(e);return t?.info.time?{id:t.info.id,created:t.info.time.created,updated:t.info.time.updated??t.info.time.created,title:t.info.title,directory:t.info.location?.directory,serverID:t.serverID}:n.get(e)},k=()=>{if(d&&Date.now()-d.at<1e3)return d.titles;let t=new Map;for(let n of e.ctx.servers.list())for(let r of e.ctx.servers.get(n)?.data.session.list()??[])t.set(r.id,{id:r.id,created:r.time.created,updated:r.time.updated??r.time.created,title:r.title,directory:r.location?.directory});for(let[e,r]of n)t.has(e)||t.set(e,r);let r=new Map;for(let e of t.values()){let t=_e(e.title);t&&r.set(t,(r.get(t)??0)+1)}let i=new Map;for(let e of t.values()){let t=_e(e.title);t&&r.get(t)===1&&i.set(t,e)}return d={at:Date.now(),titles:i},i},A=[H,U,W,G,`[data-titlebar-tab]`,ne,ae].join(`,`),j=e=>e instanceof Element&&(e.matches(A)||e.querySelector(A)!==null),M=e=>e instanceof Element&&(e.matches(K)||e.querySelector(K)!==null);function N(e){for(let t of e){if(t.type!==`childList`)continue;let e=t.target;if(e===document.body)return!0;if(e instanceof Element&&e.closest(`[data-timeline]`)){for(let e of t.addedNodes)if(M(e))return!0;for(let e of t.removedNodes)if(M(e))return!0}else{if(e instanceof Element&&e.closest(A))return!0;for(let e of t.addedNodes)if(j(e))return!0;for(let e of t.removedNodes)if(j(e))return!0}}return!1}let P=V({run:He,interval:fe,relevant:N}),F=P.schedule,I=async t=>{if(o||r.has(t))return;let i=e.ctx.servers.get(t)?.client;if(i){r.add(t);try{let e=await i.session.list({limit:le,order:`desc`,parentID:null});if(o)return;d=void 0;for(let r of e.data)n.set(r.id,{id:r.id,created:r.time.created,updated:r.time.updated??r.time.created,title:r.title,directory:r.location?.directory,serverID:t});F()}catch{}finally{r.delete(t)}}},L=(t=0)=>{o||(clearTimeout(a),a=setTimeout(()=>{for(let t of e.ctx.servers.list())I(t)},t))};function R(e,t){document.querySelectorAll(`[data-ocst-kind="${e}"]`).forEach(e=>{t&&e.dataset.ocstSession===t||e.remove()})}let z=new Set,B=new Map,ie=(t,n)=>{let r=`${t}\u0000${n??``}`,i=e.ctx.servers.get(t);if(!i||z.has(r)||Date.now()-(B.get(r)??0)<6e4)return;z.add(r),B.set(r,Date.now());let a=n?{directory:n}:void 0;Promise.all([i.data.location.provider.sync(a),i.data.location.model.sync(a)]).catch(()=>{}).finally(()=>{z.delete(r),f.clear(),F()})},X=e=>(e.split(`/`).pop()??e).replace(he,``),ve=(e,t)=>{if(!e)return;let n=e.findLast(e=>e.providerID===t.providerID&&(e.id===t.id||e.modelID===t.id));if(n?.limit.context)return n.limit.context;let r=X(t.id),i=e.filter(e=>X(e.id)===r||X(e.modelID)===r),a=i.findLast(e=>e.providerID===t.providerID&&e.limit.context);return a?.limit.context?a.limit.context:i.findLast(e=>e.limit.context)?.limit.context},Z=(t,n,r,i)=>{let a=[...t].reverse().find(e=>e.type===`assistant`&&e.tokens);if(!a||a.type!==`assistant`||!a.tokens)return;let o=a.tokens,s=o.input+o.output+o.reasoning+o.cache.read+o.cache.write,c=e.ctx.servers.get(n)?.data.location.model.list(r?{directory:r}:void 0),l=ve(c,a.model??i??a.model);if(c&&l||ie(n,r),l)return{percent:Math.round(s/l*100),used:s,limit:l}},ye=()=>{for(;!o&&h.size<pe&&p.length>0;){let t=p.shift();if(!t)return;if(f.get(t.id)?.at===t.at){m.delete(t.id);continue}let n=e.ctx.servers.get(t.serverID);n?(h.add(t.id),n.client.session.context({sessionID:t.id}).then(e=>{f.set(t.id,{at:t.at,usage:Z(e,t.serverID,t.directory)})}).catch(()=>{f.set(t.id,{at:t.at})}).finally(()=>{h.delete(t.id),m.delete(t.id),g.set(t.id,Date.now()),ye(),F()})):m.delete(t.id)}},be=(e,t,n,r)=>{m.has(e)||h.has(e)||p.length>=24||Date.now()-(g.get(e)??0)<5e3||(m.add(e),p.push({id:e,serverID:t,at:n,directory:r}),ye())},xe=(e,t)=>{let n=x(e);if(n?.ref){let r=f.get(e);if(r&&r.at>=t.updated)return r.usage;let i=n.ref.data.session.message.list(e);if(i.length>0){let r=Z(i,n.serverID,n.info.location?.directory,n.info.model);if(r)return f.set(e,{at:t.updated,usage:r}),r}return be(e,n.serverID,t.updated,n.info.location?.directory),f.get(e)?.usage}let r=f.get(e);return r&&r.at>=t.updated?r.usage:(t.serverID&&Date.now()-t.updated<me&&be(e,t.serverID,t.updated,t.directory),r?.usage)};function Se(t,n,r){let i=r?ee(n.updated,{translate:(e,t)=>_(e,t)}):b(n.updated,v());t.textContent!==i&&(t.textContent=i);let a=[_(`title.created`,{time:S(n.created,e.locale())}),_(`title.updated`,{time:S(n.updated,e.locale())})].join(`
`);t.title!==a&&(t.title=a),t.dateTime=new Date(n.updated).toISOString()}function Ce(){let t=e.settings();document.querySelectorAll(H).forEach(e=>{let n=e.querySelector(te),r=e.dataset.sessionId,i=r?E(r):void 0;n&&(!r||!i?n.querySelector(`:scope > [data-ocst-kind="trail-home"]`)?.remove():Q(n,`home`,r,i,s(t)&&t.home))})}function we(e,t,n,r=!1){let i=e.querySelector(`:scope > [data-ocst-kind="date"]`);n?(i||(i=document.createElement(`time`),i.dataset.ocstKind=`date`,i.className=e.dataset.ocstTrail===`tab`?`ocst-tab-time`:`ocst-side-time`,e.prepend(i)),Se(i,t,r)):i?.remove()}function Te(){let e=document.createElement(`span`);return e.dataset.ocstKind=`ring`,e.className=`ocst-ring`,e.innerHTML=`<svg viewBox="0 0 14 14" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="${Y}" stroke="var(--ocst-ring-track, var(--v2-background-bg-layer-04))" stroke-width="1.5"/><circle data-ocst-arc cx="7" cy="7" r="${Y}" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" transform="rotate(-90 7 7)"/></svg>`,e}function Ee(e,t){let n=e.querySelector(`[data-ocst-arc]`),r=ge*(1-Math.max(0,Math.min(100,t.percent))/100);n&&(n.setAttribute(`stroke-dasharray`,ge.toFixed(2)),n.setAttribute(`stroke-dashoffset`,r.toFixed(2)));let i=t.percent>=95?`critical`:t.percent>=80?`high`:`normal`;e.dataset.level!==i&&(e.dataset.level=i);let a=_(`ring.title`,{percent:t.percent,used:y(t.used),limit:y(t.limit)});e.title!==a&&(e.title=a)}function De(e,t,n,r){let i=e.querySelector(`:scope > [data-ocst-kind="ring"]`);if(!r){i?.remove();return}let a=xe(t,n);a?(i||(i=Te(),e.append(i)),Ee(i,a)):i?.remove()}function Oe(e,t,n,r){let i=e.querySelector(`:scope > [data-ocst-kind="ring-inbox"]`);if(!r){i?.remove();return}let a=xe(t,n);if(!a)i?.remove();else{if(!i){i=Te(),i.dataset.ocstKind=`ring-inbox`;let t=e.lastElementChild;t?e.insertBefore(i,t):e.append(i)}Ee(i,a)}}function Q(t,n,r,i,a,o=!1){let s=a,l=c(e.settings()),u=`:scope > [data-ocst-kind="trail-${n}"]`,d=t.querySelector(u);!s&&!l?d?.remove():(d||(d=document.createElement(`span`),d.dataset.ocstKind=`trail-${n}`,d.dataset.ocstTrail=n,d.className=`ocst-trail ocst-trail--${n}`,n===`side`?t.insertBefore(d,t.lastElementChild):t.append(d)),we(d,i,s,o),De(d,r,i,l))}function ke(t,n){let r=e.settings(),i=s(r)&&J(r),a=l(r);t.forEach(e=>{let t=e.getAttribute(`title`)?.trim(),r=t?n.get(t):void 0;r?Q(e,`side`,r.id,r,i,a):e.querySelector(`:scope > [data-ocst-kind="trail-side"]`)?.remove()})}function Ae(t,n){let r=c(e.settings());t.forEach(e=>{let t=e.querySelector(`:scope > span:first-child > span[dir="auto"]`)?.textContent?.trim(),i=t?n.get(t):void 0,a=e.querySelector(`:scope > span:last-child > span.ms-auto`)??e.querySelector(`:scope > span:last-child > span:last-child`);if(!i||!a){e.querySelectorAll(`[data-ocst-kind="ring-inbox"]`).forEach(e=>e.remove());return}Oe(a,i.id,i,r);let o=a.querySelector(`:scope > [data-ocst-kind="ring-inbox"]`),s=a.lastElementChild;o&&s&&s!==o&&o.nextElementSibling!==s&&a.insertBefore(o,s)})}function je(){let e=document.querySelectorAll(U),t=document.querySelectorAll(W);if(e.length===0&&t.length===0)return;let n=k();ke(e,n),Ae(t,n)}function Me(){document.querySelectorAll(G).forEach(t=>{let n=t.getAttribute(`href`)?.match(q)?.[1],r=n?E(n):void 0;r?Q(t,`tab`,n??``,r,s(e.settings())&&J(e.settings())):t.querySelector(`:scope > [data-ocst-kind="trail-tab"]`)?.remove()}),Pe()}function Ne(e,t){let n=document.createElement(`div`);n.dataset.slot=`row`;let r=document.createElement(`span`);return r.dataset.slot=`detail`,r.textContent=`${e} \u00b7 ${t}`,n.append(r),n}function Pe(){let t=document.querySelector(ne);if(!t)return;let n=document.querySelector(re)?.querySelector(G)?.getAttribute(`href`)?.match(q)?.[1]??u,r=n?E(n):void 0,i=t.querySelector(`:scope > [data-ocst-kind="popover"]`);if(!r||!s(e.settings())||!J(e.settings())){i?.remove();return}i||(i=document.createElement(`div`),i.dataset.ocstKind=`popover`,i.className=`ocst-popover`,i.append(Ne(``,``),Ne(``,``)),t.append(i));let a=i.querySelectorAll(`[data-slot="detail"]`),o=`${_(`labels.created`)} \u00b7 ${C(r.created,e.locale())}`,c=`${_(`labels.updated`)} \u00b7 ${C(r.updated,e.locale())}`;a[0]&&a[0].textContent!==o&&(a[0].textContent=o),a[1]&&a[1].textContent!==c&&(a[1].textContent=c)}function Fe(t,n){let r=new Map,i=e.ctx.servers.get(n)?.data.session.message.list(t)??[],a;for(let e of i){if(e.type===`user`){a=e.id,r.set(e.id,{sent:e.time.created});continue}if(e.type!==`assistant`||!a)continue;let t=r.get(a),n=e.time.completed;t&&n!==void 0&&(t.answered=Math.max(t.answered??0,n))}return r}function Ie(t,n){let r=t.querySelector(`[data-component="user-message"]`)?.closest(`[data-slot="session-turn-message-container"]`)??t.querySelector(`[data-slot="session-turn-message-container"]`);if(!r)return;let i=r.querySelector(`:scope > [data-ocst-kind="turn"]`);if(!i){i=document.createElement(`div`),i.dataset.ocstKind=`turn`,i.className=`ocst-turn`;let e=document.createElement(`time`);e.className=`ocst-turn-time`,i.append(e),r.prepend(i)}let a=i.querySelector(`time`);if(!a)return;let o=w(n.sent,n.answered,v());a.textContent!==o&&(a.textContent=o);let s=[_(`title.sent`,{time:S(n.sent,e.locale())}),n.answered===void 0?_(`title.running`):_(`title.answered`,{time:S(n.answered,e.locale())})].join(`
`);a.title!==s&&(a.title=s),i.dataset.ocstSession=t.dataset.messageId??``,a.dateTime=new Date(n.answered??n.sent).toISOString()}let $=0,Le=-1,Re;function ze(){let t=e.settings(),n=e.ctx.sessions.current();if(!s(t)||!t.messages||!n){$=0,Le=-1,Re=void 0,R(`turn`);return}let r=document.querySelectorAll(K),i=Date.now();if(n.id===Re&&r.length===Le&&i-$<2e3)return;$=i,Le=r.length,Re=n.id;let a=Fe(n.id,n.server.id);r.forEach(e=>{if(e.dataset.timelineRow!==`UserMessage`)return;let t=e.dataset.messageId,n=t?a.get(t):void 0;n?Ie(e,n):e.querySelector(`[data-ocst-kind="turn"]`)?.remove()})}function Be(e,t,n,r,i){let a=document.querySelector(`[data-ocst-kind="${e}"]`);return a||(a=document.createElement(`button`),a.dataset.ocstKind=e,a.type=`button`,a.className=`ocst-toggle`,a.innerHTML=t,a.addEventListener(`click`,e=>{e.preventDefault(),e.stopPropagation(),i()})),a.dataset.on=r?`true`:`false`,a.setAttribute(`aria-pressed`,r?`true`:`false`),a.setAttribute(`aria-label`,n),a.title!==n&&(a.title=n),a}function Ve(){let t=Array.from(document.querySelectorAll(ae)).find(e=>!e.closest(oe))?.parentElement,n=document.querySelector(`[data-ocst-kind="toggle"]`),r=document.querySelector(`[data-ocst-kind="context-toggle"]`);if(!t||!t.parentElement){n?.remove(),r?.remove();return}let i=s(e.settings()),a=Be(`toggle`,se,_(i?`toggle.hide`:`toggle.show`),i,e.toggle);(a.parentElement!==t.parentElement||(a.compareDocumentPosition(t)&Node.DOCUMENT_POSITION_FOLLOWING)===0)&&t.parentElement.insertBefore(a,t);let o=c(e.settings()),l=Be(`context-toggle`,ce,_(o?`toggle.context.hide`:`toggle.context.show`),o,e.toggleContext);l.previousElementSibling!==a&&a.after(l)}function He(){o||(T=new Map,Ve(),c(e.settings())||(p.length=0,m.clear()),Ce(),je(),Me(),ze())}let Ue=()=>{for(let e of i.splice(0))e();let t=()=>{d=void 0,L(ue)};for(let n of e.ctx.servers.list()){let r=e.ctx.servers.get(n)?.data;r&&i.push(r.on(`session.execution.succeeded`,t),r.on(`session.execution.failed`,t),r.on(`session.execution.interrupted`,t),r.on(`session.renamed`,t),r.on(`session.archived`,t),r.on(`session.deleted`,t))}};(0,t.createEffect)((0,t.on)(()=>e.ctx.servers.list().join(`\0`),()=>{Ue(),L()},{defer:!0}));let We=e=>{let t=((e.target instanceof Element?e.target:void 0)?.closest(`[data-titlebar-tab]`)?.querySelector(G)?.getAttribute(`href`))?.match(q)?.[1];t&&(u=t)};document.addEventListener(`pointerover`,We,!0);let Ge=setInterval(()=>{document.hidden||(e.settings().home||J(e.settings()))&&L()},de),Ke=()=>{document.hidden||(F(),L())};return document.addEventListener(`visibilitychange`,Ke),Ue(),L(),F(),(0,t.onCleanup)(()=>{o=!0,P.stop(),clearInterval(Ge),clearTimeout(a),document.removeEventListener(`visibilitychange`,Ke),document.removeEventListener(`pointerover`,We,!0);for(let e of i.splice(0))e();R(`trail-home`),R(`sidebar`),R(`tab`),R(`popover`),R(`turn`),R(`toggle`),R(`context-toggle`),R(`trail-side`),R(`trail-tab`),R(`ring-inbox`)}),{schedule:F}}function ve(t){let n=()=>({...u,...t.store.value});return(0,e.createComponent)(z,{settings:n,update:e=>t.store.set({...n(),...e}),reset:()=>t.store.set(u),get t(){return t.t},get locale(){return t.locale}})}var Z=n.Plugin.define({stores:{timestamps:n.Store.global(o,u)},i18n:D,setup(r){console.info(`[session-timestamps] gui ready`);let i=()=>({...u,...r.stores.timestamps.value}),a=()=>r.locale.locale()||`en`,o=(e,t)=>{let n=r.t(e,t);return n===e?O(a(),e,t):n};r.add(n.Style,L),r.add(n.Slot,{at:`session.header`,order:20,render:t=>(0,e.createComponent)(R,{ctx:r,input:t,settings:i,locale:a,t:o})}),r.add(n.SettingsPage,()=>({id:`session-timestamps`,icon:`comment`,title:o(`settings.title`),render:()=>(0,e.createComponent)(ve,{get store(){return r.stores.timestamps},t:o,locale:a})}));let l=X({ctx:r,settings:i,locale:a,translate:(e,t)=>r.t(e,t),toggle:()=>r.stores.timestamps.set({...i(),enabled:!s(i())}),toggleContext:()=>r.stores.timestamps.set({...i(),contextRing:!c(i())})});(0,t.createEffect)(()=>{i(),a(),l.schedule()})}});exports.default=Z;
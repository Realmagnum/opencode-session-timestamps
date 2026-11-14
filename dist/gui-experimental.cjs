Object.defineProperties(exports,{__esModule:{value:!0},[Symbol.toStringTag]:{value:`Module`}});let e=require("solid-js/web"),t=require("solid-js"),n=require("@opencode/plugin/gui"),r=require("effect");var i=r.Schema.Union([r.Schema.Literal(`auto`),r.Schema.Literal(`absolute`)]),a=r.Schema.Union([r.Schema.Literal(`auto`),r.Schema.Literal(`24h`),r.Schema.Literal(`12h`)]),o=r.Schema.Struct({enabled:r.Schema.optional(r.Schema.Boolean),header:r.Schema.Boolean,home:r.Schema.Boolean,sidebar:r.Schema.optional(r.Schema.Boolean),messages:r.Schema.Boolean,format:i,clock:a}),s=e=>e.enabled!==!1,c={enabled:!0,header:!0,home:!0,sidebar:!0,messages:!0,format:`auto`,clock:`auto`},l=864e5;function u(e){return new Date(e.getFullYear(),e.getMonth(),e.getDate()).getTime()}function d(e){return e===`24h`?{hour:`2-digit`,minute:`2-digit`,hour12:!1}:e===`12h`?{hour:`2-digit`,minute:`2-digit`,hour12:!0}:{hour:`2-digit`,minute:`2-digit`}}function f(e,t){let n=new Intl.RelativeTimeFormat(t,{numeric:`auto`}).format(-e,`day`);return n&&`${n[0]?.toLocaleUpperCase(t)}${n.slice(1)}`}function p(e,t){let n=new Date(e);if(Number.isNaN(n.getTime()))return``;let r=new Date,i=new Intl.DateTimeFormat(t.locale,d(t.clock)).format(n);if(t.format===`absolute`)return`${new Intl.DateTimeFormat(t.locale,{day:`numeric`,month:`short`,year:n.getFullYear()===r.getFullYear()?void 0:`numeric`}).format(n)}, ${i}`;let a=Math.round((u(r)-u(n))/l);return a===0?i:a===1?`${f(1,t.locale)}, ${i}`:`${new Intl.DateTimeFormat(t.locale,{day:`numeric`,month:`short`,year:n.getFullYear()===r.getFullYear()?void 0:`numeric`}).format(n)}, ${i}`}function m(e,t){let n=new Date(e);return Number.isNaN(n.getTime())?``:new Intl.DateTimeFormat(t.locale,d(t.clock)).format(n)}function h(e,t){let n=new Date(e);return Number.isNaN(n.getTime())?``:new Intl.DateTimeFormat(t,{dateStyle:`full`,timeStyle:`medium`}).format(n)}function g(e,t){let n=new Date(e);return Number.isNaN(n.getTime())?``:new Intl.DateTimeFormat(t,{dateStyle:`medium`,timeStyle:`short`}).format(n)}function _(e,t,n){return t===void 0?p(e,n):u(new Date(e))===u(new Date(t))?`${m(e,n)} \u2192 ${m(t,n)}`:`${p(e,n)} \u2192 ${p(t,n)}`}var v={"settings.title":`Session Timestamps`,"settings.header.title":`Session Timestamps`,"settings.header.desc":`Dates for sessions and inline times for messages, so a list of weeks-old sessions reads like a chronology.`,"settings.section.show":`Where to show times`,"settings.show.enabled":`Show dates`,"settings.show.enabled.desc":`Master switch; the same as the clock button beside the sidebar toggle.`,"toggle.show":`Show dates`,"toggle.hide":`Hide dates`,"settings.show.header":`Session header`,"settings.show.header.desc":`Created and last-activity times above the transcript.`,"settings.show.home":`Home session list`,"settings.show.home.desc":`The last activity of every session row, right-aligned.`,"settings.show.sidebar":`Sidebar session list`,"settings.show.sidebar.desc":`The same stamp on the sessions listed in the left sidebar.`,"settings.show.messages":`Transcript messages`,"settings.show.messages.desc":`When a message was sent, and when its answer finished.`,"settings.section.format":`Format`,"settings.format.label":`Date style`,"settings.format.desc":`Friendly drops today's date, absolute always keeps it.`,"settings.format.auto":`Friendly`,"settings.format.absolute":`Always date + time`,"settings.clock.label":`Clock`,"settings.clock.auto":`System`,"settings.clock.24h":`24-hour`,"settings.clock.12h":`12-hour`,"settings.preview.label":`Preview`,"settings.preview.hint":`Uses the app language and the current time.`,"settings.reset":`Reset to defaults`,"labels.created":`Created`,"labels.updated":`Updated`,"labels.sent":`Sent`,"labels.answered":`Answered`,"title.created":`Session created: {{time}}`,"title.updated":`Last activity: {{time}}`,"title.sent":`Message sent: {{time}}`,"title.answered":`Answer finished: {{time}}`,"title.running":`Waiting for the answer`},y={"settings.title":`Время сессий`,"settings.header.title":`Время сессий`,"settings.header.desc":`Даты сессий и время сообщений прямо в интерфейсе, чтобы список недельной давности читался как хронология.`,"settings.section.show":`Где показывать время`,"settings.show.enabled":`Показывать даты`,"settings.show.enabled.desc":`Общий выключатель; он же кнопка-часы рядом с тумблером сайдбара.`,"toggle.show":`Показать даты`,"toggle.hide":`Скрыть даты`,"settings.show.header":`Шапка сессии`,"settings.show.header.desc":`Время создания и последней активности над транскриптом.`,"settings.show.home":`Список сессий на Home`,"settings.show.home.desc":`Последняя активность каждой сессии, справа в строке.`,"settings.show.sidebar":`Список сессий в сайдбаре`,"settings.show.sidebar.desc":`Та же метка для сессий в левом сайдбаре.`,"settings.show.messages":`Сообщения в транскрипте`,"settings.show.messages.desc":`Когда сообщение отправлено и когда закончился ответ.`,"settings.section.format":`Формат`,"settings.format.label":`Стиль даты`,"settings.format.desc":`«Дружелюбный» скрывает сегодняшнюю дату, «полный» всегда её показывает.`,"settings.format.auto":`Дружелюбный`,"settings.format.absolute":`Всегда дата + время`,"settings.clock.label":`Часы`,"settings.clock.auto":`Как в системе`,"settings.clock.24h":`24 часа`,"settings.clock.12h":`12 часов`,"settings.preview.label":`Пример`,"settings.preview.hint":`Учитывает язык приложения и текущее время.`,"settings.reset":`Сбросить настройки`,"labels.created":`Создана`,"labels.updated":`Обновлена`,"labels.sent":`Отправлено`,"labels.answered":`Ответ`,"title.created":`Сессия создана: {{time}}`,"title.updated":`Последняя активность: {{time}}`,"title.sent":`Сообщение отправлено: {{time}}`,"title.answered":`Ответ завершён: {{time}}`,"title.running":`Ожидание ответа`},b={en:v,"en-us":v,"en-gb":v,ru:y,"ru-ru":y};function x(e,t,n){let r=(e||``).toLowerCase().replace(`_`,`-`),i=r.split(`-`)[0]||`en`,a=(b[r]??b[i]??v)[t]??v[t]??t;return n?a.replace(/\{\{\s*([a-zA-Z0-9_-]+)\s*\}\}/g,(e,t)=>n[t]===void 0?`{{${t}}}`:String(n[t])):a}var S=(0,e.template)(`<span> <time>`),C=(0,e.template)(`<span class=ocst-header-sep aria-hidden=true>·`),w=(0,e.template)(`<span class=ocst-header>`),T=(0,e.template)(`<time>`),E=(0,e.template)(`<div class=ocst-settings-row><div class=ocst-settings-copy><span class=ocst-settings-label></span><span class=ocst-settings-desc></span></div><button type=button role=switch class=ocst-switch>`),D=(0,e.template)(`<div style="max-width:760px;margin:0 auto;padding:32px 24px;font-family:var(--font-family-sans, -apple-system, BlinkMacSystemFont, sans-serif);color:var(--v2-text-text-base, #eeeeee)"><div style=margin-bottom:28px><div style=display:flex;align-items:center;gap:8px;margin-bottom:6px><h1 style="font-size:20px;font-weight:600;margin:0;color:var(--v2-text-text-base, #ffffff)"></h1><span style="font-size:11px;font-weight:500;color:#b392f0;background:rgba(157, 124, 216, 0.15);border:1px solid rgba(157, 124, 216, 0.35);border-radius:10px;padding:1px 7px;line-height:1.4">Plugin</span></div><p style="font-size:13px;color:var(--v2-text-text-muted, #b0b0b0);margin:0;line-height:1.5"></p></div><div class=ocst-settings-card><div class=ocst-settings-card-title></div></div><div class=ocst-settings-card><div class=ocst-settings-card-title></div><div class=ocst-settings-row><div class=ocst-settings-copy><span class=ocst-settings-label></span><span class=ocst-settings-desc></span></div><select class=ocst-select></select></div><div class=ocst-settings-row><div class=ocst-settings-copy><span class=ocst-settings-label></span></div><select class=ocst-select></select></div><div class=ocst-settings-row><div class=ocst-settings-copy><span class=ocst-settings-label></span><span class=ocst-settings-desc></span></div><div class=ocst-preview></div></div></div><button type=button class=ocst-reset>`),O=(0,e.template)(`<option>`),k=(0,e.template)(`<span>`),A=`session-timestamps`,j=`<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.62516 4.46094L5.05225 3.86719L3.86475 5.05469L4.4585 7.6276L2.0835 9.21094V10.7943L4.4585 12.3776L3.86475 14.9505L5.05225 16.138L7.62516 15.5443L9.2085 17.9193H10.7918L12.3752 15.5443L14.9481 16.138L16.1356 14.9505L15.5418 12.3776L17.9168 10.7943V9.21094L15.5418 7.6276L16.1356 5.05469L14.9481 3.86719L12.3752 4.46094L10.7918 2.08594H9.2085L7.62516 4.46094Z" stroke="currentColor"/><path d="M12.5002 10.0026C12.5002 11.3833 11.3809 12.5026 10.0002 12.5026C8.61945 12.5026 7.50016 11.3833 7.50016 10.0026C7.50016 8.62189 8.61945 7.5026 10.0002 7.5026C11.3809 7.5026 12.5002 8.62189 12.5002 10.0026Z" stroke="currentColor"/></svg>`,M=`
.ocst-header {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  font-size: 11px;
  line-height: var(--line-height-compact, 1.3);
  color: var(--v2-text-text-faint, #8a8a8a);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
  user-select: none;
}
.ocst-header time { color: inherit; }
.ocst-header-sep { opacity: 0.6; }

.ocst-home {
  flex: none;
  margin-inline-end: 2px;
  padding-inline-start: 8px;
  font-size: 11px;
  line-height: var(--line-height-compact, 1.3);
  color: var(--v2-text-text-faint, #8a8a8a);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  opacity: 0.85;
  transition: opacity 120ms ease-in-out;
  pointer-events: none;
  user-select: none;
}
[data-component="home-session-row-container"]:hover .ocst-home { opacity: 0; }

.ocst-side {
  flex: none;
  padding-inline-start: 6px;
  font-size: 11px;
  line-height: var(--line-height-compact, 1.3);
  color: var(--v2-text-text-faint, #8a8a8a);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  opacity: 0.85;
  pointer-events: none;
  user-select: none;
}

.ocst-tab {
  flex: none;
  margin-inline-end: 24px;
  font-size: 10px;
  line-height: 1;
  color: var(--v2-text-text-faint, #8a8a8a);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  opacity: 0.8;
  pointer-events: none;
  user-select: none;
}
[data-titlebar-tab]:hover .ocst-tab { opacity: 0; }
@container (max-width: 150px) {
  .ocst-tab { display: none; }
}

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
  color: var(--v2-icon-icon-muted, #8a8a8a);
  cursor: pointer;
  -webkit-app-region: no-drag;
  transition: color 120ms ease, background-color 120ms ease, opacity 120ms ease;
}
.ocst-toggle svg { width: 16px; height: 16px; }
.ocst-toggle:hover {
  background: var(--v2-overlay-simple-overlay-hover, rgba(255, 255, 255, 0.06));
  color: var(--v2-text-text-base, #eeeeee);
}
.ocst-toggle[data-on="true"] { color: var(--v2-text-text-base, #eeeeee); }
.ocst-toggle[data-on="false"] { color: var(--v2-text-text-faint, #8a8a8a); opacity: 0.65; }

.ocst-turn {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 2px;
  font-size: 11px;
  line-height: var(--line-height-compact, 1.3);
  color: var(--v2-text-text-faint, #8a8a8a);
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
  border-bottom: 1px solid var(--v2-border-border-base, rgba(255, 255, 255, 0.08));
}
.ocst-settings-row:last-child { border-bottom: none; }
.ocst-settings-copy { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.ocst-settings-label { font-size: 13px; font-weight: 530; color: var(--v2-text-text-base, #eeeeee); }
.ocst-settings-desc { font-size: 12px; color: var(--v2-text-text-faint, #8a8a8a); }
.ocst-settings-card {
  border: 1px solid var(--v2-border-border-base, rgba(255, 255, 255, 0.08));
  border-radius: 10px;
  padding: 4px 16px;
  margin-bottom: 20px;
}
.ocst-settings-card-title {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--v2-text-text-faint, #8a8a8a);
  margin: 14px 0 4px;
}
.ocst-switch {
  position: relative;
  flex: none;
  width: 34px;
  height: 20px;
  border-radius: 999px;
  border: 1px solid var(--v2-border-border-base, rgba(255, 255, 255, 0.16));
  background: var(--v2-background-bg-layer-02, rgba(255, 255, 255, 0.06));
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
  border: 1px solid var(--v2-border-border-base, rgba(255, 255, 255, 0.16));
  background: var(--v2-background-bg-layer-02, rgba(255, 255, 255, 0.06));
  color: var(--v2-text-text-base, #eeeeee);
  font-size: 12px;
  outline: none;
}
.ocst-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 12px;
  color: var(--v2-text-text-muted, #b0b0b0);
  font-variant-numeric: tabular-nums;
}
.ocst-preview span {
  padding: 3px 8px;
  border-radius: 6px;
  background: var(--v2-background-bg-layer-02, rgba(255, 255, 255, 0.06));
}
.ocst-reset {
  height: 28px;
  padding: 0 12px;
  border-radius: 7px;
  border: 1px solid var(--v2-border-border-base, rgba(255, 255, 255, 0.16));
  background: transparent;
  color: var(--v2-text-text-muted, #b0b0b0);
  font-size: 12px;
  cursor: pointer;
}
.ocst-reset:hover { color: var(--v2-text-text-base, #ffffff); }

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
  color: var(--v2-text-text-muted, #8a8a8a);
  cursor: pointer;
  transition: color 0.15s ease, background-color 0.15s ease;
  flex-shrink: 0;
}
.plugin-settings-gear-btn:hover {
  color: #b392f0 !important;
  background-color: var(--v2-background-bg-layer-02, rgba(255, 255, 255, 0.08));
}
.plugin-settings-gear-btn svg { width: 16px; height: 16px; }

.settings-nav-groups [data-slot="tabs-v2-trigger-wrapper"][data-value="${A}"] [data-slot="tabs-v2-trigger"] svg {
  color: #9d7cd8 !important;
}
`;function N(){if(typeof document>`u`)return;function e(){let e=document.querySelector(`.settings-nav-groups [data-slot="tabs-v2-trigger-wrapper"][data-value="${A}"] button, .settings-nav-groups [data-slot="tabs-v2-trigger-wrapper"][data-value="${A}"] [data-slot="tabs-v2-trigger"]`);if(e){e.click();return}let t=new URL(window.location.href);t.searchParams.set(`tab`,A),window.history.pushState({},``,t.toString()),window.dispatchEvent(new PopStateEvent(`popstate`))}function t(){for(let t of Array.from(document.querySelectorAll(`.settings-extension-row`))){if(!(t.querySelector(`.settings-extension-name`)?.textContent?.trim()??``).includes(A))continue;let n=t.querySelector(`.settings-servers-actions`);if(!n||n.querySelector(`.${A}-settings-btn`))continue;let r=document.createElement(`button`);r.type=`button`,r.className=`plugin-settings-gear-btn ${A}-settings-btn`,r.title=`Open settings`,r.setAttribute(`aria-label`,`Open settings`),r.innerHTML=j,r.addEventListener(`click`,t=>{t.preventDefault(),t.stopPropagation(),e()}),n.insertBefore(r,n.firstElementChild)}}t();let n=new MutationObserver(t);return n.observe(document.body,{childList:!0,subtree:!0}),()=>n.disconnect()}function P(n){let r=(0,t.createMemo)(()=>{let e=n.input.session.id,t=n.input.session.server.id;try{return n.ctx.servers.get(t)?.data.session.get(e)}catch{return}}),i=()=>({locale:n.locale(),format:n.settings().format,clock:n.settings().clock}),a=()=>{let e=r();if(e)return[n.t(`title.created`,{time:h(e.time.created,n.locale())}),n.t(`title.updated`,{time:h(e.time.updated??e.time.created,n.locale())})].join(`
`)};return(0,e.createComponent)(t.Show,{get when(){return(0,e.memo)(()=>!!(s(n.settings())&&n.settings().header))()?r():void 0},children:r=>{let o=()=>r().time.updated??r().time.created;return(()=>{var s=w();return(0,e.insert)(s,(0,e.createComponent)(t.Show,{get when(){return!n.input.compact},get fallback(){return(()=>{var t=T();return(0,e.insert)(t,()=>p(o(),i())),(0,e.effect)(()=>(0,e.setAttribute)(t,`datetime`,new Date(o()).toISOString())),t})()},get children(){return[(()=>{var t=S(),a=t.firstChild,o=a.nextSibling;return(0,e.insert)(t,()=>n.t(`labels.created`),a),(0,e.insert)(o,()=>p(r().time.created,i())),(0,e.effect)(()=>(0,e.setAttribute)(o,`datetime`,new Date(r().time.created).toISOString())),t})(),C(),(()=>{var t=S(),r=t.firstChild,a=r.nextSibling;return(0,e.insert)(t,()=>n.t(`labels.updated`),r),(0,e.insert)(a,()=>p(o(),i())),(0,e.effect)(()=>(0,e.setAttribute)(a,`datetime`,new Date(o()).toISOString())),t})()]}})),(0,e.effect)(()=>(0,e.setAttribute)(s,`title`,a())),s})()}})}function F(n){let r=(e,t)=>{let r=n.t(e,t);return r===e?x(n.locale(),e,t):r},i=()=>({...c,...n.settings()}),a=()=>({locale:n.locale(),format:i().format,clock:i().clock}),o=Date.now(),s=[o,o-936e5,o-10368e5,o-2592e7],l=t=>(()=>{var r=E(),a=r.firstChild,o=a.firstChild,s=o.nextSibling,c=a.nextSibling;return(0,e.insert)(o,()=>t.label),(0,e.insert)(s,()=>t.desc),c.$$click=()=>n.update({[t.key]:!i()[t.key]}),(0,e.effect)(n=>{var r=i()[t.key],a=t.label,o=i()[t.key]?`true`:`false`;return r!==n.e&&(0,e.setAttribute)(c,`aria-checked`,n.e=r),a!==n.t&&(0,e.setAttribute)(c,`aria-label`,n.t=a),o!==n.a&&(0,e.setAttribute)(c,`data-on`,n.a=o),n},{e:void 0,t:void 0,a:void 0}),r})(),u=[{value:`auto`,label:r(`settings.format.auto`)},{value:`absolute`,label:r(`settings.format.absolute`)}],d=[{value:`auto`,label:r(`settings.clock.auto`)},{value:`24h`,label:r(`settings.clock.24h`)},{value:`12h`,label:r(`settings.clock.12h`)}];return(()=>{var o=D(),c=o.firstChild,f=c.firstChild,m=f.firstChild;m.nextSibling;var h=f.nextSibling,g=c.nextSibling,_=g.firstChild,v=g.nextSibling,y=v.firstChild,b=y.nextSibling,x=b.firstChild,S=x.firstChild,C=S.nextSibling,w=x.nextSibling,T=b.nextSibling,E=T.firstChild,A=E.firstChild,j=E.nextSibling,M=T.nextSibling.firstChild,N=M.firstChild,P=N.nextSibling,F=M.nextSibling,I=v.nextSibling;return(0,e.insert)(m,()=>r(`settings.header.title`)),(0,e.insert)(h,()=>r(`settings.header.desc`)),(0,e.insert)(_,()=>r(`settings.section.show`)),(0,e.insert)(g,(0,e.createComponent)(l,{key:`enabled`,get label(){return r(`settings.show.enabled`)},get desc(){return r(`settings.show.enabled.desc`)}}),null),(0,e.insert)(g,(0,e.createComponent)(l,{key:`header`,get label(){return r(`settings.show.header`)},get desc(){return r(`settings.show.header.desc`)}}),null),(0,e.insert)(g,(0,e.createComponent)(l,{key:`home`,get label(){return r(`settings.show.home`)},get desc(){return r(`settings.show.home.desc`)}}),null),(0,e.insert)(g,(0,e.createComponent)(l,{key:`sidebar`,get label(){return r(`settings.show.sidebar`)},get desc(){return r(`settings.show.sidebar.desc`)}}),null),(0,e.insert)(g,(0,e.createComponent)(l,{key:`messages`,get label(){return r(`settings.show.messages`)},get desc(){return r(`settings.show.messages.desc`)}}),null),(0,e.insert)(y,()=>r(`settings.section.format`)),(0,e.insert)(S,()=>r(`settings.format.label`)),(0,e.insert)(C,()=>r(`settings.format.desc`)),w.addEventListener(`change`,e=>n.update({format:e.currentTarget.value})),(0,e.insert)(w,(0,e.createComponent)(t.For,{each:u,children:t=>(()=>{var n=O();return(0,e.insert)(n,()=>t.label),(0,e.effect)(()=>n.value=t.value),n})()})),(0,e.insert)(A,()=>r(`settings.clock.label`)),j.addEventListener(`change`,e=>n.update({clock:e.currentTarget.value})),(0,e.insert)(j,(0,e.createComponent)(t.For,{each:d,children:t=>(()=>{var n=O();return(0,e.insert)(n,()=>t.label),(0,e.effect)(()=>n.value=t.value),n})()})),(0,e.insert)(N,()=>r(`settings.preview.label`)),(0,e.insert)(P,()=>r(`settings.preview.hint`)),(0,e.insert)(F,(0,e.createComponent)(t.For,{each:s,children:t=>(()=>{var n=k();return(0,e.insert)(n,()=>p(t,a())),n})()})),(0,e.addEventListener)(I,`click`,n.reset,!0),(0,e.insert)(I,()=>r(`settings.reset`)),(0,e.effect)(()=>w.value=i().format),(0,e.effect)(()=>j.value=i().clock),o})()}(0,e.delegateEvents)([`click`]);var I=e=>e.sidebar!==!1,L=`button[aria-controls="vertical-tabs-sidebar"]`,R=`[data-slot="collapsed-sidebar-toggle"]`,z=`<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="10" cy="10" r="6.6"/><path d="M10 6.2V10l2.6 1.7"/></svg>`,B=`[data-component="home-session-row-container"]`,V=`[data-component="home-session-row"]`,H=`[data-titlebar-tab-action]`,U=`[data-titlebar-tab-link]`,W=`[data-component="session-tab-popover"]`,G=`[data-component="session-tab-popover-trigger"]:hover`,K=`[data-timeline] [data-timeline-row][data-message-id]`,q=/\/session\/(ses_[A-Za-z0-9]+)/,J=/^(New session|Child session) - \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,Y=e=>e?e.match(J)?.[1]??e:void 0,X=500,ee=1500,te=6e4;function Z(e){if(typeof document>`u`)return{schedule:()=>{}};let n=new Map,r=new Set,i=[],a,o,c,l=!1,u=(t,n)=>{let r=e.translate(t,n);return r===t?x(e.locale(),t,n):r},d=()=>({locale:e.locale(),format:e.settings().format,clock:e.settings().clock}),f=t=>{for(let n of e.ctx.servers.list()){let r=e.ctx.servers.get(n)?.data.session.get(t);if(r?.time)return{created:r.time.created,updated:r.time.updated??r.time.created,title:r.title}}return n.get(t)},m=()=>{let t=new Map;for(let n of e.ctx.servers.list())for(let r of e.ctx.servers.get(n)?.data.session.list()??[])t.set(r.id,{created:r.time.created,updated:r.time.updated??r.time.created,title:r.title});for(let[e,r]of n)t.has(e)||t.set(e,r);let r=new Map;for(let e of t.values()){let t=Y(e.title);t&&r.set(t,(r.get(t)??0)+1)}let i=new Map;for(let e of t.values()){let t=Y(e.title);t&&r.get(t)===1&&i.set(t,e)}return i},v=()=>{l||c!==void 0||(c=requestAnimationFrame(()=>{c=void 0,P()}))},y=async t=>{if(l||r.has(t))return;let i=e.ctx.servers.get(t)?.client;if(i){r.add(t);try{let e=await i.session.list({limit:X,order:`desc`,parentID:null});if(l)return;for(let t of e.data)n.set(t.id,{created:t.time.created,updated:t.time.updated??t.time.created,title:t.title});v()}catch{}finally{r.delete(t)}}},b=(t=0)=>{l||(clearTimeout(o),o=setTimeout(()=>{for(let t of e.ctx.servers.list())y(t)},t))};function S(e,t){document.querySelectorAll(`[data-ocst-kind="${e}"]`).forEach(e=>{t&&e.dataset.ocstSession===t||e.remove()})}function C(t,n){let r=p(n.updated,d());t.textContent!==r&&(t.textContent=r);let i=[u(`title.created`,{time:h(n.created,e.locale())}),u(`title.updated`,{time:h(n.updated,e.locale())})].join(`
`);t.title!==i&&(t.title=i),t.dateTime=new Date(n.updated).toISOString()}function w(e,t,n){let r=e.querySelector(`:scope > [data-ocst-kind="${t}"]`);n?(r||(r=document.createElement(`time`),r.dataset.ocstKind=t,r.className=t===`home`?`ocst-home`:`ocst-side`,e.append(r)),C(r,n)):r?.remove()}function T(){e.settings().home?document.querySelectorAll(B).forEach(e=>{let t=e.querySelector(V),n=e.dataset.sessionId;t&&w(t,`home`,n?f(n):void 0)}):S(`home`)}function E(){let t=document.querySelectorAll(H);if(!I(e.settings())||t.length===0){I(e.settings())||S(`sidebar`);return}let n=m();t.forEach(e=>{let t=e.getAttribute(`title`)?.trim();w(e,`sidebar`,t?n.get(t):void 0)})}function D(){I(e.settings())?(document.querySelectorAll(U).forEach(e=>{let t=e.querySelector(`:scope > [data-ocst-kind="tab"]`),n=e.getAttribute(`href`)?.match(q)?.[1],r=n?f(n):void 0;r?(t||(t=document.createElement(`time`),t.dataset.ocstKind=`tab`,t.className=`ocst-tab`,e.append(t)),C(t,r)):t?.remove()}),k()):(S(`tab`),S(`popover`))}function O(e,t){let n=document.createElement(`div`);n.dataset.slot=`row`;let r=document.createElement(`span`);return r.dataset.slot=`detail`,r.textContent=`${e} \u00b7 ${t}`,n.append(r),n}function k(){let t=document.querySelector(W);if(!t)return;let n=document.querySelector(G)?.querySelector(U)?.getAttribute(`href`)?.match(q)?.[1]??a,r=n?f(n):void 0,i=t.querySelector(`:scope > [data-ocst-kind="popover"]`);if(!r||!I(e.settings())){i?.remove();return}i||(i=document.createElement(`div`),i.dataset.ocstKind=`popover`,i.className=`ocst-popover`,i.append(O(``,``),O(``,``)),t.append(i));let o=i.querySelectorAll(`[data-slot="detail"]`),s=`${u(`labels.created`)} \u00b7 ${g(r.created,e.locale())}`,c=`${u(`labels.updated`)} \u00b7 ${g(r.updated,e.locale())}`;o[0]&&o[0].textContent!==s&&(o[0].textContent=s),o[1]&&o[1].textContent!==c&&(o[1].textContent=c)}function A(t,n){let r=new Map,i=e.ctx.servers.get(n)?.data.session.message.list(t)??[],a;for(let e of i){if(e.type===`user`){a=e.id,r.set(e.id,{sent:e.time.created});continue}if(e.type!==`assistant`||!a)continue;let t=r.get(a),n=e.time.completed;t&&n!==void 0&&(t.answered=Math.max(t.answered??0,n))}return r}function j(t,n){let r=t.querySelector(`[data-component="user-message"]`)?.closest(`[data-slot="session-turn-message-container"]`)??t.querySelector(`[data-slot="session-turn-message-container"]`);if(!r)return;let i=r.querySelector(`:scope > [data-ocst-kind="turn"]`);if(!i){i=document.createElement(`div`),i.dataset.ocstKind=`turn`,i.className=`ocst-turn`;let e=document.createElement(`time`);e.className=`ocst-turn-time`,i.append(e),r.prepend(i)}let a=i.querySelector(`time`);if(!a)return;let o=_(n.sent,n.answered,d());a.textContent!==o&&(a.textContent=o);let s=[u(`title.sent`,{time:h(n.sent,e.locale())}),n.answered===void 0?u(`title.running`):u(`title.answered`,{time:h(n.answered,e.locale())})].join(`
`);a.title!==s&&(a.title=s),i.dataset.ocstSession=t.dataset.messageId??``,a.dateTime=new Date(n.answered??n.sent).toISOString()}function M(){let t=e.ctx.sessions.current();if(!e.settings().messages||!t){S(`turn`);return}let n=A(t.id,t.server.id);document.querySelectorAll(K).forEach(e=>{if(e.dataset.timelineRow!==`UserMessage`)return;let t=e.dataset.messageId,r=t?n.get(t):void 0;r?j(e,r):e.querySelector(`[data-ocst-kind="turn"]`)?.remove()})}function N(){let t=Array.from(document.querySelectorAll(L)).find(e=>!e.closest(R))?.parentElement,n=document.querySelector(`[data-ocst-kind="toggle"]`);if(!t||!t.parentElement){n?.remove();return}n||(n=document.createElement(`button`),n.dataset.ocstKind=`toggle`,n.type=`button`,n.className=`ocst-toggle`,n.innerHTML=z,n.addEventListener(`click`,t=>{t.preventDefault(),t.stopPropagation(),e.toggle()})),(n.parentElement!==t.parentElement||n.nextElementSibling!==t)&&t.parentElement.insertBefore(n,t);let r=s(e.settings()),i=u(r?`toggle.hide`:`toggle.show`);n.dataset.on=r?`true`:`false`,n.setAttribute(`aria-pressed`,r?`true`:`false`),n.setAttribute(`aria-label`,i),n.title!==i&&(n.title=i)}function P(){l||(N(),s(e.settings())?(T(),E(),D(),M()):(S(`home`),S(`sidebar`),S(`tab`),S(`popover`),S(`turn`)))}let F=()=>{for(let e of i.splice(0))e();let t=()=>b(ee);for(let n of e.ctx.servers.list()){let r=e.ctx.servers.get(n)?.data;r&&i.push(r.on(`session.execution.succeeded`,t),r.on(`session.execution.failed`,t),r.on(`session.execution.interrupted`,t),r.on(`session.renamed`,t),r.on(`session.archived`,t),r.on(`session.deleted`,t))}};(0,t.createEffect)((0,t.on)(()=>e.ctx.servers.list().join(`\0`),()=>{F(),b()},{defer:!0}));let J=new MutationObserver(v);J.observe(document.body,{childList:!0,subtree:!0,characterData:!0});let Z=e=>{let t=((e.target instanceof Element?e.target:void 0)?.closest(`[data-titlebar-tab]`)?.querySelector(U)?.getAttribute(`href`))?.match(q)?.[1];t&&(a=t)};document.addEventListener(`pointerover`,Z,!0);let Q=setInterval(()=>{document.hidden||(e.settings().home||I(e.settings()))&&b()},te),$=()=>{document.hidden||(v(),b())};return document.addEventListener(`visibilitychange`,$),F(),b(),v(),(0,t.onCleanup)(()=>{l=!0,J.disconnect(),clearInterval(Q),clearTimeout(o),c!==void 0&&cancelAnimationFrame(c),document.removeEventListener(`visibilitychange`,$),document.removeEventListener(`pointerover`,Z,!0);for(let e of i.splice(0))e();S(`home`),S(`sidebar`),S(`tab`),S(`popover`),S(`turn`),S(`toggle`)}),{schedule:v}}function Q(t){let n=()=>({...c,...t.store.value});return(0,e.createComponent)(F,{settings:n,update:e=>t.store.set({...n(),...e}),reset:()=>t.store.set(c),get t(){return t.t},get locale(){return t.locale}})}var $=n.Plugin.define({stores:{timestamps:n.Store.global(o,c)},i18n:b,setup(r){console.info(`[session-timestamps] gui ready`);let i=()=>({...c,...r.stores.timestamps.value}),a=()=>r.locale.locale()||`en`,o=(e,t)=>{let n=r.t(e,t);return n===e?x(a(),e,t):n};r.add(n.Style,M),r.add(n.Slot,{at:`session.header`,order:20,render:t=>(0,e.createComponent)(P,{ctx:r,input:t,settings:i,locale:a,t:o})}),r.add(n.SettingsPage,()=>({id:`session-timestamps`,icon:`comment`,title:o(`settings.title`),render:()=>(0,e.createComponent)(Q,{get store(){return r.stores.timestamps},t:o,locale:a})}));let l=Z({ctx:r,settings:i,locale:a,translate:(e,t)=>r.t(e,t),toggle:()=>r.stores.timestamps.set({...i(),enabled:!s(i())})});(0,t.createEffect)(()=>{i(),a(),l.schedule()}),N()}});exports.default=$;
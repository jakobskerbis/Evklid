// Besedilo z Markdownom in formulami → HTML za RichText. Isti izris kot na spletu (public/rich.js): KaTeX
// HTML s pisavami KaTeX in public/sirina.js (široke formule se zložijo pri »=«, pomanjšajo ali pomikajo),
// naloženo s strežnika kot na spletu. Brez povezave ostane MathML, ki ga WebView izriše sam.
import { Marked } from "marked";
import katex from "katex";
import { createRenderer, streamSafe } from "../../../public/rich.js";
import { annotateTex, withFormulaSubject } from "../../../public/formula-data.js";
import { cardFor, configureCard } from "../../../public/formula-card.js";
import type { Theme } from "./theme";
import type { Fx } from "./formula-ctx";
import { API_URL } from "./api";
import { t, currentLanguage } from "./i18n";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
// Vsebina strežnika (lekcije, naloge, rešitve) sme imeti HTML (npr. <details> »Pokaži formulo«).
const trustedMarked = new Marked();
// Odgovori inštruktorja (AI): surov HTML se izpiše kot besedilo.
const safeMarked = new Marked({ renderer: { html: ({ text }: { text: string }) => esc(text) } });

// sanitize: vsebina je že varna (zaupanja vredna ali z izpisanim HTML), DOMPurify v aplikaciji ni potreben.
const make = createRenderer as (o: object) => { renderRich: (s: string) => string };
const trusted = make({ marked: trustedMarked, katex, sanitize: (h: string) => h });
const untrusted = make({ marked: safeMarked, katex, sanitize: (h: string) => h });
// Klikljive črke (kot na spletu): oznake v formuli dobijo data-fx s pomenom iz predmeta in lekcije.
const annotate = (tex: string) => annotateTex(tex) as string;
const trustedFx = make({ marked: trustedMarked, katex, sanitize: (h: string) => h, annotate });
const untrustedFx = make({ marked: safeMarked, katex, sanitize: (h: string) => h, annotate });

export function toHtml(md: string, { ai = false, streaming = false, fx = null as Fx } = {}) {
  const src = streaming ? streamSafe(md) : md;
  if (!fx) return (ai ? untrusted : trusted).renderRich(src) as string;
  const r = ai ? untrustedFx : trustedFx;
  return withFormulaSubject(fx.subject || "MAT", () => r.renderRich(src), fx.symbols as never) as string;
}

// Kartica dotaknjene oznake (koda iz data-fx): { label, html } ali null; isto besedilo kot na spletu.
configureCard({ t, lang: currentLanguage, katex });
export function formulaCard(code: string): { label: string; html: string } | null {
  try {
    return cardFor(decodeURIComponent(code.replace(/\./g, "%"))) as { label: string; html: string } | null;
  } catch {
    return null;
  }
}

// Kratko besedilo brez formul in Markdowna se izriše kar z naravnim besedilom (brez WebView).
export const isPlain = (s: string) => !/[$*_`|#<>\\[\]]|^\s*[-+]\s|^\s*\d+\.\s/m.test(s);

// Celoten dokument za WebView: barve teme, pisava Instrument Sans, formule kot na spletu (KaTeX + sirina.js
// s strežnika; RichText naloži dokument z baseUrl API_URL), tabele, »Pokaži formulo«.
export function docHtml(body: string, th: Theme, { size = 17, center = false } = {}) {
  return `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline' ${API_URL}; font-src ${API_URL}; script-src 'unsafe-inline' ${API_URL}; img-src data:">
<link rel="stylesheet" href="/vendor/instrument-sans/index.css">
<link rel="stylesheet" href="/vendor/katex/katex.min.css" onload="document.documentElement.classList.add('kx')">
<script defer src="/vendor/katex/katex.min.js"></script>
<script type="module">import{prilagodiSirino as f}from"/sirina.js";document.documentElement.classList.add('sw');window.__fit=function(){f(document.getElementById('c'))};window.__fit();</script>
<style>
:root{color-scheme:${th.dark ? "dark" : "light"}}
html,body{margin:0;padding:0;background:transparent;color:${th.text};font:${size}px/1.5 "Instrument Sans Variable","Instrument Sans",system-ui,-apple-system,Roboto,"Segoe UI",sans-serif;-webkit-text-size-adjust:100%;word-wrap:break-word}
body{${center ? "text-align:center;" : ""}}
p{margin:0 0 .7em}p:last-child{margin-bottom:0}
h1,h2,h3,h4{line-height:1.25;margin:1em 0 .4em}
h3,h4,.sub-head{font-size:1.12em;font-weight:800;line-height:1.3;margin:1.4em 0 .45em;padding-inline-start:10px;border-inline-start:3px solid ${th.accent}}
#c>:first-child{margin-top:0}
ul,ol{padding-inline-start:1.4em;margin:.3em 0 .8em}li{margin:.2em 0}
a{color:${th.accent}}
strong{font-weight:700}
code{font-family:ui-monospace,Menlo,monospace;font-size:.9em;background:${th.surface2};padding:.1em .3em;border-radius:5px}
pre{background:${th.surface2};padding:10px;border-radius:10px;overflow-x:auto;font-size:13px}
pre code{background:none;padding:0}
blockquote{margin:.6em 0;padding:.4em .9em;border-inline-start:3px solid ${th.accent};background:${th.accentSoft};border-radius:8px}
html:not(.kx) .katex-html{display:none}
math{font-size:1.08em;font-family:"STIX Two Math","Cambria Math","Noto Sans Math",math}
math[display=block]{display:block;margin:.6em 0;overflow-x:auto;overflow-y:hidden}
html:not(.kx) .katex{display:inline-block;max-width:100%;overflow-x:auto;overflow-y:hidden;vertical-align:middle}
.kx .katex-display{overflow-x:auto;overflow-y:hidden;padding:4px 0 6px}
.kx .katex{white-space:nowrap}
.kx :is(p,li,dd,blockquote,h2,h3,td,th) .katex:not(.katex-display>.katex){display:inline-block;text-indent:0;margin-block:-.15em}
.kx :is(p,li,dd,blockquote,h2,h3) .katex.tb-zlozena:not(.katex-display>.katex){display:block;width:fit-content;max-width:100%;margin:6px 0}
/* KaTeX CSS iz predpomnilnika, sirina.js pa ne (brez povezave): dolga vrstična formula se pomika, ne štrli. */
.kx:not(.sw) :is(p,li,dd,blockquote,h2,h3,td,th) .katex:not(.katex-display>.katex){max-width:100%;overflow-x:auto;overflow-y:hidden;vertical-align:middle;padding:2px 0 4px}
.kx .katex.tb-dolga{display:inline-block;max-width:100%;overflow-x:auto;overflow-y:hidden;vertical-align:middle;padding:2px 0 4px}
.md-table-wrap{overflow-x:auto;margin:.6em 0;border:1px solid ${th.border};border-radius:12px}
table{border-collapse:collapse;width:100%;font-size:.95em}
th,td{padding:7px 10px;border-bottom:1px solid ${th.border};text-align:start;vertical-align:top}
th{background:${th.surface2};font-weight:700}tr:last-child td{border-bottom:0}
td.num,th.num{text-align:center}
details{margin:.6em 0;border:1px solid ${th.border};border-radius:12px;padding:.5em .8em;background:${th.surface}}
details[open]{border-inline-start:3px solid ${th.accent}}
details.tb-solution>summary{display:inline-block;padding:.35em .9em;border-radius:999px;background:${th.accentSoft};list-style:none}
details.tb-solution>summary::-webkit-details-marker{display:none}
details.tb-solution[open]>summary{margin-bottom:.4em}
summary{color:${th.accent};font-weight:700;cursor:pointer}
.tb-think{margin:.8em 0;padding:.7em .9em;border-radius:12px;background:${th.goldSoft}}
.tb-think-label{font-weight:700;color:${th.gold};margin-bottom:.3em}
img,svg{max-width:100%;height:auto}
/* Dotik: iOS pošlje click le klikljivemu elementu (cursor), KaTeX-ovi okvirji ulomkov ga ne smejo prestreči (kot ui.css). */
.katex .vlist{pointer-events:none}.katex [data-fx],.katex [data-fx] *{pointer-events:auto}.katex .pstrut{pointer-events:none!important}
[data-fx]{cursor:pointer;color:${th.accent};border-radius:3px;padding:0 .08em;margin:0 -.08em}
[data-fx].fx-open{background:${th.accentSoft}}
.fx-title{display:flex;align-items:baseline;gap:8px;color:${th.accent}}.fx-title b{color:${th.text};min-width:0}
.fx-title .katex{font-size:1.25em;color:${th.accent};flex:none}
.fx-card{display:grid;gap:6px}.fx-line{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}
.fx-k{color:${th.muted};font-size:.8em;font-weight:700;text-transform:uppercase;letter-spacing:.05em;min-width:62px}
/* Kartica kot na spletu v ozkem oknu (ui.css .fx-pop, max-width 760px): deli pod oznako »Kjer je«. */
.fx-un,.fx-sub span{color:${th.muted}}.fx-sub{padding-inline-start:0;font-size:.9em}
.fx-parts{display:flex;flex-direction:column;gap:3px;align-items:flex-start}.fx-parts ul{list-style:none;margin:0;padding:0;display:grid;gap:3px}
.fx-parts li{display:grid;grid-template-columns:minmax(1.6em,auto) 1fr;column-gap:8px;align-items:baseline}.fx-parts li>.katex{color:${th.accent}}
.fx-parts .fx-un{white-space:nowrap}.fx-note{color:${th.muted};font-size:.88em;border-top:1px solid ${th.border};padding-top:6px}
/* Formule vedno od leve proti desni, tudi v arabščini (kartica ima dir=rtl). */
.katex{direction:ltr;unicode-bidi:isolate}
</style>
<script>document.addEventListener('click',function(e){var el=e.target.closest&&e.target.closest('[data-fx]');if(!el||!window.ReactNativeWebView)return;e.preventDefault();var o=document.querySelector('.fx-open');if(o)o.classList.remove('fx-open');el.classList.add('fx-open');window.ReactNativeWebView.postMessage('fx:'+el.getAttribute('data-fx'));},true);window.__fxClose=function(){var o=document.querySelector('.fx-open');if(o)o.classList.remove('fx-open');};</script></head><body><div id="c">${body}</div></body></html>`;
}

// Merjenje višine vsebine (WebView brez drsenja, višino dobi od vsebine).
export const MEASURE_JS = `(function(){
  var last=0;function send(){var h=Math.ceil(document.getElementById('c').getBoundingClientRect().height);if(h!==last){last=h;window.ReactNativeWebView.postMessage(String(h));}}
  new ResizeObserver(send).observe(document.getElementById('c'));
  document.addEventListener('toggle',send,true);send();setTimeout(send,300);
})();true;`;

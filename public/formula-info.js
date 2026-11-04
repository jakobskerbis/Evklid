// Klikljive formule: kartica ob kliku na simbol ali enoto (slovar in označevanje sta v formula-data.js).
import { t, currentLang } from "./i18n.js";
import { cardFor, configureCard, claimMarks, createMarkPage } from "./formula-card.js";

configureCard({ t, lang: currentLang, katex: () => window.katex });

export { annotateTex, setFormulaSubject, withFormulaSubject, subjectWithGlossary } from "./formula-data.js";

// Kartice ne pokažemo pri testih (Preizkus znanja, tekmovanje), ker bi zveza izdala rešitev.
const blocked = (el) => !!el.closest(".no-fx, button, .choice, label, input, textarea, .sym-key, [contenteditable]");
const decode = (s) => decodeURIComponent(s.replace(/\./g, "%"));

let pop = null;
let openEl = null;
function close() {
  if (!pop) return;
  pop.hidden = true;
  openEl?.setAttribute("aria-expanded", "false");
  openEl?.classList.remove("fx-open");
  openEl = null;
}
function open(el) {
  const card = cardFor(decode(el.dataset.fx));
  if (!card) return;
  if (!pop) {
    pop = document.createElement("div");
    pop.id = "fx-pop";
    pop.className = "fx-pop";
    pop.setAttribute("role", "dialog");
    pop.hidden = true;
    document.body.appendChild(pop);
  }
  pop.setAttribute("aria-label", card.label);
  if (el.dataset.fxTone) pop.dataset.tone = el.dataset.fxTone;
  else delete pop.dataset.tone;
  pop.innerHTML = `${card.html}<button type="button" class="fx-close" aria-label="${t("fx.close")}">×</button>`;
  pop.hidden = false;
  openEl = el;
  el.setAttribute("aria-expanded", "true");
  el.classList.add("fx-open");
  // Vodoravno ob simbolu, navpično pod (nad) celo formulo, da kartica ne prekrije ulomka.
  const r0 = el.getBoundingClientRect();
  const f = (el.closest(".katex") || el).getBoundingClientRect();
  const r = { left: r0.left, width: r0.width, top: Math.min(r0.top, f.top), bottom: Math.max(r0.bottom, f.bottom) };
  const w = Math.min(340, window.innerWidth - 24);
  pop.style.width = `${w}px`;
  const left = Math.max(12, Math.min(r.left + r.width / 2 - w / 2, window.innerWidth - w - 12));
  // Spodnji meni na telefonu (#tabbar) prekrije dno zaslona: kartica naj se konča nad njim.
  const bar = document.getElementById("tabbar");
  const barTop = bar && getComputedStyle(bar).display !== "none" ? Math.min(window.innerHeight, bar.getBoundingClientRect().top) : window.innerHeight;
  const below = r.bottom + 8 + pop.offsetHeight < barTop || r.top < pop.offsetHeight + 16;
  pop.style.left = `${left + window.scrollX}px`;
  pop.style.top = `${(below ? r.bottom + 8 : r.top - pop.offsetHeight - 8) + window.scrollY}px`;
}

// Okvir dotika naj objame znak, ne razmika za njim: KaTeX da presledek pred »=« in
// poševni popravek črke (margin-right) v ovoj oznake, zato je bil znak levo v okvirju.
const PAD = 0.08; // em, enako kot v ui.css
function fit(el) {
  while (el.lastElementChild?.classList.contains("mspace")) el.after(el.lastElementChild);
  while (el.firstElementChild?.classList.contains("mspace")) el.before(el.firstElementChild);
  const last = el.lastElementChild;
  const mr = last?.classList.contains("mord") && /em$/.test(last.style.marginRight) ? parseFloat(last.style.marginRight) : 0;
  if (mr > 0) {
    // Polovico popravka pustimo v okvirju (nagnjen vrh črke), polovico zunaj; širina vrstice ostane ista.
    last.style.marginRight = "0";
    el.style.paddingRight = `${PAD + mr / 2}em`;
    el.style.marginRight = `${mr / 2 - PAD}em`;
  }
}

// Simboli postanejo gumbi za tipkovnico in bralnike zaslona.
function enhance(root) {
  const els = root.querySelectorAll ? root.querySelectorAll("[data-fx]:not([tabindex])") : [];
  for (const el of els) {
    if (blocked(el)) { el.setAttribute("tabindex", "-1"); el.classList.add("fx-off"); continue; }
    const card = cardFor(decode(el.dataset.fx));
    if (!card) { el.setAttribute("tabindex", "-1"); el.classList.add("fx-off"); continue; }
    el.setAttribute("tabindex", "0");
    el.setAttribute("role", "button");
    el.setAttribute("aria-expanded", "false");
    el.setAttribute("aria-label", card.label);
    fit(el);
    const html = el.closest(".katex-html");
    if (html && html.getAttribute("aria-hidden") === "true") {
      html.removeAttribute("aria-hidden");
      html.parentElement?.querySelector(".katex-mathml")?.setAttribute("aria-hidden", "true");
    }
  }
}

// Na strani (pogled, okno, razdelek lista formul, sporočilo v klepetu) je klikljiva le prva vidna pojavitev
// vsakega pomena; ostale so navadno besedilo (fx-dup). Ista črka z več pomeni dobi ton barve (data-fx-tone)
// za vsak pomen; ton ostane pomenu, dokler stran obstaja. .fx-page označi lastno stran.
const PAGE = ".msg, .fm-sec, .fx-page, [role=dialog], dialog, .view";
const pages = new WeakMap();
let marksQueued = false;
function queueMarks() {
  if (marksQueued) return;
  marksQueued = true;
  requestAnimationFrame(() => {
    marksQueued = false;
    refreshMarks();
  });
}
// Zaprt <details> (content-visibility) in hidden="until-found" imata okvirje, a nista vidna.
const visible = (el) => (el.checkVisibility ? el.checkVisibility() : el.getClientRects().length > 0);
function refreshMarks() {
  const groups = new Map();
  for (const el of document.querySelectorAll("[data-fx][tabindex]")) {
    if (el.classList.contains("fx-off")) continue;
    const root = el.closest(PAGE) || document.body;
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root).push(el);
  }
  // Najprej vsa branja (vidnost), nato pisanje, da brskalnik ne preračunava postavitve za vsak razdelek.
  const plans = [];
  for (const [root, els] of groups) {
    const shown = els.filter(visible);
    let page = pages.get(root);
    if (!page) pages.set(root, (page = createMarkPage()));
    page.owners.clear();
    const plan = claimMarks(page, root, shown.map((el) => decode(el.dataset.fx)));
    plans.push([els, new Map(shown.map((el, i) => [el, plan[i]]))]);
  }
  for (const [els, plan] of plans) {
    for (const el of els) {
      const p = plan.get(el) || { dup: false, tone: 0 };
      const dup = p.dup && el !== openEl;
      if (el.classList.contains("fx-dup") !== dup) {
        el.classList.toggle("fx-dup", dup);
        if (dup) {
          el.removeAttribute("role");
          el.setAttribute("tabindex", "-1");
        } else {
          el.setAttribute("role", "button");
          el.setAttribute("tabindex", "0");
        }
      }
      const tone = p.tone && !dup ? String(p.tone) : null;
      if ((el.dataset.fxTone ?? null) !== tone) {
        if (tone) el.dataset.fxTone = tone;
        else delete el.dataset.fxTone;
      }
    }
  }
}

export function initFormulaInfo() {
  document.addEventListener("click", (e) => {
    if (e.target.closest(".fx-close")) return close();
    if (pop && pop.contains(e.target)) return;
    const el = e.target.closest("[data-fx]");
    if (!el || blocked(el) || el.classList.contains("fx-off") || el.classList.contains("fx-dup")) {
      queueMarks(); // zavihek ali razdelek se je morda odprl
      return close();
    }
    e.preventDefault();
    if (openEl === el) return close();
    close();
    open(el);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && openEl) { const el = openEl; close(); el.focus(); return; }
    const el = e.target.closest?.("[data-fx][role=button]");
    if (el && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); el.click(); }
  });
  window.addEventListener("resize", close);
  document.addEventListener("scroll", (e) => { if (openEl && !pop.contains(e.target)) close(); }, true);
  enhance(document);
  queueMarks();
  document.addEventListener("toggle", queueMarks, true);
  new MutationObserver((list) => {
    for (const m of list) {
      if (m.type === "attributes") { queueMarks(); continue; }
      for (const node of m.removedNodes) if (node.nodeType === 1 && (node.matches?.("[data-fx]") || node.querySelector?.("[data-fx]"))) queueMarks();
      for (const node of m.addedNodes) if (node.nodeType === 1) {
        if (node.matches?.("[data-fx]")) { enhance(node.parentElement || document); queueMarks(); }
        else if (node.querySelector?.("[data-fx]")) { enhance(node); queueMarks(); }
      }
    }
  }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["hidden", "open"] });
}


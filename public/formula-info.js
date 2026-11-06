// Klikljive formule: kartica ob kliku na simbol ali enoto (slovar in označevanje sta v formula-data.js).
import { t, currentLang } from "./i18n.js";
import { cardFor, configureCard, claimMarks, createMarkPage, pruneTones } from "./formula-card.js";

configureCard({ t, lang: currentLang, katex: () => window.katex });

export { annotateTex, setFormulaSubject, withFormulaSubject, subjectWithGlossary } from "./formula-data.js";

// Kartice ne pokažemo pri testih (Preizkus znanja, tekmovanje), ker bi zveza izdala rešitev.
const blocked = (el) => !!el.closest(".no-fx, button, .choice, label, input, textarea, .sym-key, [contenteditable]");
const decode = (s) => decodeURIComponent(s.replace(/\./g, "%"));

let pop = null;
let openEl = null;
let hooks = {}; // { opened, closed }: aplikacija doda zapis v zgodovino, da tipka Nazaj zapre okno (app.js)
let openW = 0; // širina okna ob odprtju
let quietUntil = 0; // lastno drsenje (okno na telefonu odmakne formulo nad list) ne zapre okna
function close(fromBack = false) {
  if (!pop || pop.hidden) return false;
  pop.hidden = true;
  openEl?.setAttribute("aria-expanded", "false");
  openEl?.removeAttribute("aria-controls");
  openEl?.classList.remove("fx-open");
  openEl = null;
  if (!fromBack) hooks.closed?.();
  return true;
}
// Tipka Nazaj (telefon, brskalnik): zapre okno pomena, pogled ostane (app.js popstate).
export const closeFormulaPop = () => close(true);
// again: okno je bilo že odprto (druga črka), zapis v zgodovini že obstaja – sicer bi bilo treba Nazaj pritisniti
// dvakrat. focus: odprto s tipko (Enter), fokus gre v okno, da se s Tab pride do ✕.
function open(el, { again = false, focus = false } = {}) {
  const card = cardFor(decode(el.dataset.fx));
  if (!card) return;
  if (!pop) {
    pop = document.createElement("div");
    pop.id = "fx-pop";
    pop.className = "fx-pop";
    pop.tabIndex = -1;
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
  el.setAttribute("aria-controls", pop.id);
  el.classList.add("fx-open");
  openW = window.innerWidth;
  place(el);
  if (focus) pop.focus({ preventScroll: true });
  if (!again) hooks.opened?.();
}

// Okno nikoli ne prekrije formule, na katero se nanaša (j, 6. 11.). Računalnik: ob simbolu, pod ali nad celo
// vrstico formule. Telefon (ozek zaslon): spodnji list nad spodnjim menijem; če bi list prekril formulo,
// stran zdrsne, da je formula nad njim.
const SHEET_MAX = 640;
function place(el) {
  const line = () => {
    const r0 = el.getBoundingClientRect();
    const f = (el.closest(".katex") || el).getBoundingClientRect();
    return { left: r0.left, width: r0.width, top: Math.min(r0.top, f.top), bottom: Math.max(r0.bottom, f.bottom) };
  };
  // Spodnji meni na telefonu (#tabbar) prekrije dno zaslona: okno naj se konča nad njim.
  const bar = document.getElementById("tabbar");
  const barTop = bar && getComputedStyle(bar).display !== "none" ? Math.min(window.innerHeight, bar.getBoundingClientRect().top) : window.innerHeight;
  const sheet = window.innerWidth <= SHEET_MAX;
  pop.classList.toggle("fx-sheet", sheet);
  if (sheet) {
    pop.style.width = "";
    pop.style.left = "0px";
    pop.style.top = "";
    pop.style.bottom = `${Math.max(0, window.innerHeight - barTop)}px`;
    pop.style.paddingBottom = barTop < window.innerHeight ? "14px" : ""; // nad menijem varni rob ni potreben
    const sheetTop = barTop - pop.offsetHeight;
    const r = line();
    if (r.bottom + 8 > sheetTop) {
      // Formula pod listom: zdrsni jo nad list (drsni ovoj pogleda ali cela stran).
      const by = Math.min(r.bottom + 8 - sheetTop, Math.max(0, r.top - 8));
      const sc = scrollerOf(el);
      quietUntil = performance.now() + 500;
      if (sc) sc.scrollTop += by;
      else window.scrollBy(0, by);
    }
    return;
  }
  const w = Math.min(340, window.innerWidth - 24);
  pop.style.width = `${w}px`;
  pop.style.bottom = "";
  pop.style.paddingBottom = "";
  const h = pop.offsetHeight;
  const r = line();
  // Ves odstavek (vrstica v kartici, alineja, prikazna formula), če ni predolg: okno ne prekrije njegovega nadaljevanja.
  const blk = el.closest("p, li, td, th, dd, blockquote, h1, h2, h3, h4, .katex-display");
  const b = blk?.getBoundingClientRect();
  const para = b && b.height < window.innerHeight * 0.4 ? { left: b.left, right: b.right, top: Math.min(b.top, r.top), bottom: Math.max(b.bottom, r.bottom) } : null;
  const left = Math.max(12, Math.min(r.left + r.width / 2 - w / 2, window.innerWidth - w - 12));
  const spots = [];
  for (const a of para ? [para, r] : [r]) {
    if (a.bottom + 8 + h < barTop) spots.push({ left, top: a.bottom + 8 });
    if (a.top - h - 8 > 0) spots.push({ left, top: a.top - h - 8 });
  }
  // Ob robu odstavka (levo ali desno), če ni prostora ne pod ne nad njim.
  const top = Math.max(8, Math.min(r.top, barTop - h - 8));
  if (para && para.right + 8 + w < window.innerWidth) spots.push({ left: para.right + 8, top });
  if (para && para.left - 8 - w > 0) spots.push({ left: para.left - 8 - w, top });
  const at = spots[0] || { left, top: r.bottom + 8 };
  pop.style.left = `${at.left + window.scrollX}px`;
  pop.style.top = `${at.top + window.scrollY}px`;
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
let scrollTimer = 0;
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
// Na zaslonu mora biti vedno vsaj ena klikljiva črka (j, 5. 11.): oznako pomena dobi pojavitev, ki je trenutno
// na zaslonu (prva taka), ne prva na strani, ki je morda že odpeljana gor. Odprta in izbrana oznaka ostaneta.
const scrollerOf = (el) => {
  for (let a = el; a && a !== document.body; a = a.parentElement) if (/auto|scroll/.test(getComputedStyle(a).overflowY) && a.scrollHeight > a.clientHeight) return a;
  return null;
};
function onScreen(root) {
  const sc = scrollerOf(root);
  const r = sc ? sc.getBoundingClientRect() : { top: 0, bottom: innerHeight };
  const top = Math.max(0, r.top), bottom = Math.min(innerHeight, r.bottom);
  return (el) => {
    const b = el.getBoundingClientRect();
    return b.bottom > top && b.top < bottom;
  };
}
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
    // Skrit razdelek (npr. skrit podzavihek kalkulatorja, ki ostane v pomnilniku): ena poizvedba namesto ene na
    // oznako. Viden razdelek lista formul (.fm-sec, oznake nikoli skrite s CSS) brez zaprtih <details> in [hidden]:
    // vse oznake so vidne (tisoč oznak v Formulah ob vsakem preklopu na telefonu; naloga hitrost, j 6. 11. 2026).
    // Drugod (pogled, sporočilo, dialog) je oznaka lahko skrita s slogom, zato tam preverimo vsako posebej.
    const whole = root === document.body ? null : visible(root);
    const all = whole && root.classList.contains("fm-sec") && !root.querySelector("details:not([open]), [hidden]");
    const vis = whole === false ? [] : all ? els : els.filter(visible);
    // Kartica, ki jo brskalnik preskoči (content-visibility: auto, daleč od zaslona), po definiciji ni na zaslonu:
    // njenih oznak ne merimo, ker bi getBoundingClientRect prisilil postavitev vse preskočene vsebine.
    const skipped = !!whole && root.checkVisibility?.({ contentVisibilityAuto: true }) === false;
    const inView = skipped ? () => false : onScreen(root);
    const first = (el) => el === openEl || el === document.activeElement;
    // Vrstni red za claimMarks: odprta/izbrana, nato na zaslonu, nato ostale (vsak del v vrstnem redu strani).
    const shown = [...vis.filter(first), ...vis.filter((el) => !first(el) && inView(el)), ...vis.filter((el) => !first(el) && !inView(el))];
    let page = pages.get(root);
    if (!page) pages.set(root, (page = createMarkPage()));
    page.owners.clear();
    const plan = claimMarks(page, root, shown.map((el) => decode(el.dataset.fx)));
    pruneTones(page);
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

// Klikljiva črka, okno pomena in zapiranje okna so svoj dotik: kartica (Ponavljanje), vrstica, povezava ali
// razdelek okoli formule se ob njem ne odzove (j, 6. 11.: tap na x₁ je obrnil kartico). Zato poslušamo v fazi
// zajemanja (capture) na dokumentu in dotik ustavimo, preden pride do elementa okoli.
const active = (el) => el && !blocked(el) && !el.classList.contains("fx-off") && !el.classList.contains("fx-dup");
// Pravi gumbi in polja zunaj okna delujejo že ob prvem dotiku (okno se le zapre); prazen prostor dotik porabi.
const CONTROL = "button, a[href], input, select, textarea, summary, label, [contenteditable], [role=tab], [role=link], #tabbar, nav";
function stop(e) {
  e.stopPropagation();
  e.stopImmediatePropagation();
}
let byKey = false; // zadnji »klik« na črko je sprožila tipka Enter ali preslednica
export function initFormulaInfo(h = {}) {
  hooks = h || {};
  document.addEventListener("click", (e) => {
    if (pop && !pop.hidden && pop.contains(e.target)) {
      // Dotik v oknu (tudi ✕) ne obrne kartice in ne odpre ničesar pod oknom.
      stop(e);
      if (e.target.closest(".fx-close")) { const el = openEl; close(); el?.focus({ preventScroll: true }); }
      return;
    }
    const el = e.target.closest("[data-fx]");
    if (active(el)) {
      e.preventDefault();
      stop(e);
      const focus = byKey;
      byKey = false;
      if (openEl === el) return close();
      const again = close(true); // druga črka: okno ostane odprto (zapis v zgodovini tudi, ne dodamo novega)
      open(el, { again, focus });
      return;
    }
    queueMarks(); // zavihek ali razdelek se je morda odprl
    // Okno je odprto: dotik v prazno ga zapre in se tu konča (kartica se ne obrne).
    if (openEl && !e.target.closest(CONTROL)) {
      e.preventDefault();
      stop(e);
    }
    close();
  }, true);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && openEl) { const el = openEl; stop(e); close(); el.focus(); return; }
    const el = e.target.closest?.("[data-fx][role=button]");
    if (el && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); stop(e); byKey = true; el.click(); byKey = false; }
  }, true);
  // Telefon: vrstica brskalnika se ob drsenju skrije in spremeni le višino okna; okno pomena zapre le nova širina (obrat).
  window.addEventListener("resize", () => { if (window.innerWidth !== openW) close(); });
  document.addEventListener("scroll", (e) => {
    if (pop?.contains(e.target)) return;
    if (openEl && performance.now() > quietUntil) close();
    // Oznaka gre na pojavitev, ki je zdaj na zaslonu: enkrat, ko se drsenje umiri (ne ob vsaki sličici).
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(queueMarks, 120);
  }, true);
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


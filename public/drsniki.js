// Vrstice, ki se pomikajo vstran (j 2026-11-01: »zdaj se sploh ne vidi, ali je navadna vrstica ali ne«).
// Ko je v vrstici več, kot gre na zaslon, dobi razred »drs«: rob, za katerim je še kaj, zbledi
// (»drs-z« na začetku, »drs-k« na koncu), pod vrstico je tanek drsnik v barvi poudarka (na telefonu črta,
// ki kaže, kje v vrstici smo), vrstica pa se ob prvem prikazu enkrat rahlo premakne (drsniki.css).
// Seznam spodaj mora zajeti vsako pravilo z »overflow-x: auto« v public/*.css (test/drsniki.test.js).

export const DRSNE = [
  // učbenik, klepet, rešitve
  ".katex-display", ".md-table-wrap", ".msg.assistant pre", ".solution", ".textbook .katex.tb-dolga",
  ".textbook .explanation pre", ".demo-eq", ".demo-table", ".graf-eq", ".demo-readout", ".lab-table-wrap",
  ".formula-body", ".pad-value", ".fb-summary", ".pilot-scroll", ".tc-scroll", ".lab-bench",
  // kalkulator, grafi, formule
  ".gc-math", ".gc-preview", ".gc-val", ".gc-tbl", ".gc .gc-ex", ".sc-h-expr", ".sc-h-res", ".sc-preview",
  ".sc-live", ".sc-c-val", ".un-result", ".tl-v", ".tl-formula", ".tl-mx-res", ".tl-vt-wrap", ".pse-mm-res", ".pse-scroll",
  ".fm-toc", ".fm-f", ".calc-modes", ".tl-rx-sp", ".sol-scroll", ".sc-vars", ".sc-h-note", ".sc-examples",
  // skeniranje
  ".scan-hist .lr-text b", ".scan-hist .lr-text small", ".scan-pick", ".scan-preview", ".scan-problem-tex",
  ".scan-answer-tex", ".scan-approx", ".scan-step-math", ".scan-why",
  // vrstice gumbov in čipov
  ".gm-fresh-row", ".seg", ".chip-row", ".zb-track", ".tk-ctx", ".tk-tablist", ".tk-sub", ".tabs", "#chat-state",
];
// Zgornja vrstica zavihkov ima svoje bledenje (app.js, style.css), zato je tu ne označujemo.
export const IZVZETO = [".topbar .tabs"];
// Brez malih navpičnih drsnikov s puščicama ▲▼ (j 2026-11-04: »never use scrollbars like that again«).
// »overflow-x: auto« sam naredi drsno tudi navpično smer, zato ob formuli, ki za nekaj pik štrli čez vrstico
// (meje integrala, potence), Windows pokaže drsnik s puščicama. Vse drsne vrstice zato navpično obrežemo
// (clip: v vrstici, ki se pomika vstran, velja kot hidden; kjer se ne, ne postane drsna), razen teh:
// NAVPICNE se namenoma pomikajo tudi navzdol, SKRITE so vrstice gumbov s skritim drsnikom, ki na
// računalniku niso drsne (obrezali bi jim obrobo fokusa). ».katex-display« je drsna le v klepetu, učbeniku,
// tekmovanju in karticah, kjer ima že »overflow-y: hidden«; drugje bi ji obrezali meje integrala.
export const NAVPICNE = [".lab-table-wrap", ".tl-vt-wrap", ".lab-bench"];
export const SKRITE = [".seg", ".chip-row", ".tk-ctx", ".tk-tablist", ".tk-sub", ".tabs", "#chat-state", ".katex-display"];
export const BREZ_NAVPICNEGA = DRSNE.filter((s) => !NAVPICNE.includes(s) && !SKRITE.includes(s));

const SEL = DRSNE.join(",");
const NI = IZVZETO.join(",");
const sledeni = new Set();
const pokukano = new WeakSet();
let ro = null;
let io = null;
let caka = false;

const premik = (el) => Math.abs(el.scrollLeft); // v RTL je scrollLeft ≤ 0

// Le ob spremembi: vsak zapis v »style« sproži opazovalca spodaj, ki bi sicer tekel v vsakem okvirju.
const nastavi = (el, k, v) => el.style.getPropertyValue(k) !== v && el.style.setProperty(k, v);

export function oznaci(el) {
  const cs = getComputedStyle(el);
  const max = el.scrollWidth - el.clientWidth;
  const vec = max > 1 && (cs.overflowX === "auto" || cs.overflowX === "scroll");
  const at = premik(el);
  el.classList.toggle("drs", vec);
  el.classList.toggle("drs-z", vec && at > 1);
  el.classList.toggle("drs-k", vec && at < max - 1);
  // Smer šteje element sam (».sc-preview« je LTR tudi na arabski strani), ne <html dir>.
  el.classList.toggle("drs-rtl", vec && cs.direction === "rtl");
  // Položaj in dolžina črte pod vrstico na telefonu (drsniki.css); v RTL se začetek šteje z desne.
  if (vec) {
    const p = Math.min(1, at / max);
    nastavi(el, "--drs-d", (el.clientWidth / el.scrollWidth).toFixed(3));
    nastavi(el, "--drs-x", `${((cs.direction === "rtl" ? 1 - p : p) * 100).toFixed(1)}%`);
  }
  if (vec && !pokukano.has(el)) io?.observe(el);
}

// Na zaslonu na dotik vrstico enkrat rahlo premaknemo in vrnemo, ko je prvič vidna.
function pokukaj(el) {
  pokukano.add(el);
  io.unobserve(el);
  if (!el.classList.contains("drs") || premik(el) > 1) return;
  const smer = getComputedStyle(el).direction === "rtl" ? -1 : 1;
  const cilj = Math.min(28, el.scrollWidth - el.clientWidth);
  // Če se je učenec medtem sam dotaknil vrstice, je ne vračamo (sicer bi mu jo izpulili izpod prsta).
  let dotik = false;
  const ustavi = () => (dotik = true);
  for (const t of ["pointerdown", "touchstart", "wheel"]) el.addEventListener(t, ustavi, { once: true, passive: true });
  el.scrollBy({ left: smer * cilj, behavior: "smooth" });
  setTimeout(() => {
    for (const t of ["pointerdown", "touchstart", "wheel"]) el.removeEventListener(t, ustavi);
    if (el.isConnected && !dotik && Math.abs(premik(el) - cilj) <= 2) el.scrollTo({ left: 0, behavior: "smooth" });
  }, 450);
}

function preglej() {
  caka = false;
  // Spremembe le v Evklidovi tipkovnici (pritisk tipke, povečana črka, predlogi): pregledamo samo njo,
  // ne vse strani (getComputedStyle in scrollWidth za vsako vrstico sta ob vsakem pritisku zavirala tipkanje).
  const o = obmocje || document;
  const kje = o === document || o.isConnected ? o : null;
  obmocje = null;
  if (!kje) return;
  sledeni.forEach((el) => el.isConnected || (ro.unobserve(el), io?.unobserve(el), sledeni.delete(el)));
  kje.querySelectorAll(SEL).forEach((el) => {
    if (NI && el.matches(NI)) return;
    if (!sledeni.has(el)) {
      sledeni.add(el);
      ro.observe(el);
    }
    oznaci(el);
  });
}

// Kaj pregledati v naslednjem okvirju: document (vse) ali le tipkovnico.
let obmocje = null;
const kmalu = (kje = document) => {
  obmocje = !obmocje || obmocje === kje ? kje : document;
  if (caka) return;
  caka = true;
  requestAnimationFrame(preglej);
};
// Vnosno polje samo ne vsebuje drsnih vrstic; višino (app.js autoGrow) mu nastavljamo ob vsakem znaku.
const polje = (m) => m.type === "attributes" && m.attributeName === "style" && /^(INPUT|TEXTAREA)$/.test(m.target.nodeName);

export function initDrsniki() {
  if (ro || typeof ResizeObserver === "undefined") return;
  // :where() ima ničelno prednost: pravilo z »overflow: auto« ali »overflow-y« v CSS ostane, kot je.
  const slog = document.createElement("style");
  slog.id = "drs-navpicno";
  slog.textContent = `:where(${BREZ_NAVPICNEGA.join(",")}) { overflow-y: clip; }`;
  document.head.append(slog);
  ro = new ResizeObserver((vnosi) => vnosi.forEach((v) => oznaci(v.target)));
  const dotik = matchMedia("(pointer: coarse)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (dotik && typeof IntersectionObserver !== "undefined") {
    io = new IntersectionObserver((vnosi) => vnosi.forEach((v) => v.intersectionRatio >= 0.9 && pokukaj(v.target)), { threshold: 0.9 });
  }
  document.addEventListener("scroll", (e) => sledeni.has(e.target) && oznaci(e.target), { capture: true, passive: true });
  // »style«: sirina.js formulo pomanjša z velikostjo pisave, kar spremeni širino vsebine, ne pa okvirja.
  // Lastnih zapisov --drs-d/--drs-x (ob vsakem pomiku) ne štejemo, sicer bi vsak pomik pregledal vso stran.
  const brez = (s) => (s || "").replace(/--drs-[dx]:[^;]*;?\s*/g, "").trim();
  const nase = (m) => m.type === "attributes" && m.attributeName === "style" && sledeni.has(m.target) && brez(m.oldValue) === brez(m.target.getAttribute("style"));
  new MutationObserver((ms) => {
    const vse = ms.filter((m) => !nase(m) && !polje(m));
    if (!vse.length) return;
    const tk = document.getElementById("tipkovnica");
    // odpiranje ali zapiranje tipkovnice (hidden) spremeni prostor za stran, zato takrat pregledamo vse
    kmalu(tk && vse.every((m) => tk.contains(m.target) && !(m.target === tk && m.type === "attributes")) ? tk : document);
  }).observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeOldValue: true, attributeFilter: ["style", "hidden", "open"] });
  document.fonts?.ready?.then(() => kmalu());
  kmalu();
}

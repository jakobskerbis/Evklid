// Klikljive formule: kartica ob kliku na simbol ali enoto (slovar in označevanje sta v formula-data.js).
import { t, currentLang } from "./i18n.js";
import { cardFor, configureCard } from "./formula-card.js";

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

export function initFormulaInfo() {
  document.addEventListener("click", (e) => {
    if (e.target.closest(".fx-close")) return close();
    if (pop && pop.contains(e.target)) return;
    const el = e.target.closest("[data-fx]");
    if (!el || blocked(el) || el.classList.contains("fx-off")) return close();
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
  new MutationObserver((list) => {
    for (const m of list) for (const node of m.addedNodes) if (node.nodeType === 1) {
      if (node.matches?.("[data-fx]")) enhance(node.parentElement || document);
      else if (node.querySelector?.("[data-fx]")) enhance(node);
    }
  }).observe(document.body, { childList: true, subtree: true });
}


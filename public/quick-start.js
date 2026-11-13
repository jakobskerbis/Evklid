// Klik na klobuk (logotip zgoraj levo): »Nadaljuj z učenjem« (j, 2026-10-30).
// Prej je odprl mrežo vseh delov aplikacije, ki jih učenec že vidi v spodnji vrstici in pod »Jaz«.
// Zdaj z enim dotikom, s katerega koli zaslona, pokaže naslednji korak učenja: tema, kjer je
// ostal, današnji trening in kar je danes na vrsti (ponavljanje, bližnji test, kartice).
import { icon } from "./icons.js";
import { t } from "./i18n.js";
import { mountSubjectSwitch, SUBJECT_KEYS } from "./subject-switch.js";

const $ = (sel) => document.querySelector(sel);
let D = null; // { getState, refresh, showView, goNew, startSession, showTestPrep, overlayOpened, overlayClosed }

const TEST_DAYS = 14; // bližnji test: pokažemo ga dva tedna prej
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

export function initQuickStart(deps) {
  D = deps;
  const btn = $(".topbar .brand");
  const pop = $("#quick-pop");
  if (!btn || !pop) return;
  btn.addEventListener("click", () => {
    // Prijava in prvi profil: brez profila učenja ni.
    if (document.body.classList.contains("auth-mode") || !D.getState().student) return;
    isOpen() ? close() : open();
  });
  pop.addEventListener("click", onPick);
  pop.addEventListener("keydown", onKey);
  document.addEventListener("pointerdown", (e) => {
    if (isOpen() && !pop.contains(e.target) && !btn.contains(e.target)) close();
  });
  window.addEventListener("resize", () => close());
}

const isOpen = () => !$("#quick-pop").hidden;

// Tipka Nazaj najprej zapre odprt meni (vrne true, če je bil odprt).
export function closeQuickStart() {
  if (!isOpen()) return false;
  close();
  return true;
}

// Vrstice iz zadnjega pregleda načinov (/modes). Brez njega (npr. brez povezave) le Učna pot.
function rows(m) {
  if (!m) return [{ act: "path", ic: "map", title: t("nav.path"), sub: t("mode.newSub"), main: true }];
  const out = [];
  if (m.newTopic) out.push({ act: "new", ic: "compass", eyebrow: t("mode.newSub"), title: m.newTopic.name, main: true });
  else out.push({ act: "path", ic: "trophy", title: t("nav.path"), sub: t("path.allDone"), main: true });
  const d = m.daily || {};
  out.push({ act: "daily", ic: "zap", title: t("daily.title"), sub: d.done ? t("daily.doneText") : d.open ? t("daily.continue") : t("daily.about"), done: d.done });
  if (m.reviewBacklog > 0) out.push({ act: "review", ic: "repeat", title: t("mode.review"), sub: t("mode.reviewBadge", { n: m.reviewBacklog }) });
  const p = m.testPlan;
  if (p && p.daysLeft >= 0 && p.daysLeft <= TEST_DAYS) {
    const when = p.daysLeft === 0 ? t("test.today") : p.daysLeft === 1 ? t("test.tomorrow") : t("test.inDays", { n: p.daysLeft });
    out.push({ act: "test", ic: "clipboard-check", title: t("mode.test"), sub: [t("qs.test", { when }), ...(p.unitTitles || [])].join(" · ") });
  }
  if (m.cardsDue > 0) out.push({ act: "cards", ic: "layers", title: t("mode.cards"), sub: t("cards.dueN", { n: m.cardsDue }) });
  return out;
}

// Naslov, predmet (menjava kar tu: naslednji korak je potem v novem predmetu) in vrstice.
function render() {
  $("#quick-pop").innerHTML = `<div class="qs-title" id="quick-title">${esc(t("qs.title"))}</div>
    <div class="subj-sw" hidden></div><div class="qs-rows"></div>`;
  renderRows();
  mountSubjectSwitch($("#quick-pop .subj-sw"), { onPicked: afterSubject });
}

// Po menjavi predmeta meni ostane odprt in pokaže naslednji korak v novem predmetu.
function afterSubject() {
  if (!isOpen()) return;
  Promise.resolve(D.refresh())
    .catch(() => null)
    .then(() => {
      if (!isOpen()) return;
      render();
      place();
      $("#quick-pop .qs-row")?.focus({ preventScroll: true });
    });
}

function renderRows() {
  const list = rows(D.getState().modes);
  $("#quick-pop .qs-rows").innerHTML = `${list
      .map(
        (r) => `<button type="button" class="list-row qs-row${r.main ? " qs-main" : ""}${r.done ? " qs-done" : ""}" role="menuitem" data-act="${r.act}">
          <span class="ic" aria-hidden="true">${icon(r.done ? "check" : r.ic)}</span>
          <span class="lr-text">${r.eyebrow ? `<small class="qs-eyebrow">${esc(r.eyebrow)}</small>` : ""}<b dir="auto">${esc(r.title)}</b>${r.sub ? `<small>${esc(r.sub)}</small>` : ""}</span>
          ${icon("chevron-right")}</button>`,
      )
      .join("")}`;
}

function place() {
  const btn = $(".topbar .brand");
  const pop = $("#quick-pop");
  const r = btn.getBoundingClientRect();
  const rtl = document.documentElement.dir === "rtl";
  pop.style.top = `${Math.round(r.bottom + 8)}px`;
  pop.style.left = pop.style.right = "";
  // Ob logotipu, a na ozkem telefonu enako daleč od obeh robov.
  const edge = Math.max(8, Math.min(Math.round(rtl ? window.innerWidth - r.right : r.left), window.innerWidth - pop.offsetWidth - 8));
  pop.style[rtl ? "right" : "left"] = `${edge}px`;
}

function open() {
  const usage = $("#usage-pop");
  if (usage) usage.hidden = true;
  const pop = $("#quick-pop");
  render();
  pop.hidden = false;
  place();
  $(".topbar .brand").setAttribute("aria-expanded", "true");
  D.overlayOpened(); // na Učni poti tipka Nazaj zapre meni, ne aplikacije
  pop.querySelector(".qs-row")?.focus({ preventScroll: true });
  // Sveže stanje (npr. trening je bil medtem opravljen); ob napaki ostane zadnje znano.
  const sid = D.getState().student?.id;
  Promise.resolve(D.refresh())
    .catch(() => null)
    .then((m) => {
      if (!m || !isOpen() || D.getState().student?.id !== sid) return;
      const focused = document.activeElement?.closest?.(".qs-row")?.dataset.act;
      renderRows();
      place();
      (pop.querySelector(`.qs-row[data-act="${focused}"]`) || pop.querySelector(".qs-row"))?.focus({ preventScroll: true });
    });
}

function close(refocus = false) {
  const pop = $("#quick-pop");
  if (pop.hidden) return;
  pop.hidden = true;
  const btn = $(".topbar .brand");
  btn.setAttribute("aria-expanded", "false");
  D.overlayClosed();
  if (refocus) btn.focus({ preventScroll: true });
}

function onPick(e) {
  const b = e.target.closest(".qs-row");
  if (!b) return;
  close();
  const act = b.dataset.act;
  if (act === "new") return D.goNew();
  if (act === "daily") return D.startSession("daily", { path: D.getState().pathKey });
  if (act === "review") return D.startSession("review");
  if (act === "test") return D.showTestPrep();
  if (act === "cards") return D.showView("cards");
  D.showView("path");
}

function onKey(e) {
  if (e.key === "Escape" || e.key === "Tab") {
    if (e.key === "Escape") e.preventDefault();
    return close(e.key === "Escape");
  }
  const items = [...$("#quick-pop").querySelectorAll(`.qs-row, ${SUBJECT_KEYS}`)];
  const i = items.indexOf(document.activeElement);
  const go = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: items.length - 1 }[e.key];
  if (go === undefined) return;
  e.preventDefault();
  items[(go + items.length) % items.length]?.focus();
}

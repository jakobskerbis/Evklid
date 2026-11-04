// Začetna stran (Učna pot) po stopnji (j 2026-11-01, načrt »Delitev na OŠ, SŠ in faks«): isti videz in iste
// kartice, drug vrstni red, in ena kartica stopnje (#stage-card). Nič se ne skrije: vse ostane v zavihkih in pod Jaz.
// - OŠ: učna pot z današnjim treningom, igre, urnik.
// - SŠ: testi iz Urnika (ko je test v 14 dneh), priprava na maturo, učna pot.
// - Faks: Moj študij z izpitnimi roki, urnik, učna pot.
import { icon } from "./icons.js";

// Kartice med glavo učne poti in izbiro načina (#modebar), od zgoraj navzdol. Kartice, ki jih ni na seznamu
// (cilj, predlog prehoda, mnenje, namestitev), ostanejo nad njimi.
export const VRSTNI_RED = {
  OS: ["xp-card", "stage-card", "schedule-card"],
  SS: ["xp-card", "schedule-card", "stage-card"],
  SS_TEST: ["schedule-card", "stage-card", "xp-card"],
  FAKS: ["stage-card", "schedule-card", "xp-card"],
};

// Vrste dogodkov v Urniku, ki štejejo kot test (enako kot public/schedule.js) in kot izpitni rok na faksu.
const TESTI = ["test", "kolokvij", "izpit", "ustno"];
const IZPITI = ["kolokvij", "izpit", "ustno"];

/**
 * Vrstni red kartic za stopnjo. SŠ: Urnik gre na vrh le, ko je v njem test v naslednjih 14 dneh.
 * @param {"OS"|"SS"|"FAKS"} level
 * @param {{ upcoming?: Array<{kind: string, daysLeft: number}> }|null} schedule pogled Urnika s strežnika
 */
export function vrstniRed(level, schedule = null) {
  if (level === "SS") {
    const test = (schedule?.upcoming || []).some((e) => TESTI.includes(e.kind) && e.daysLeft >= 0 && e.daysLeft <= 14);
    return test ? VRSTNI_RED.SS_TEST : VRSTNI_RED.SS;
  }
  return VRSTNI_RED[level] || VRSTNI_RED.OS;
}

/** Premakne kartice v .path-side v dani vrstni red (tik pred #modebar). */
export function uvrstiKartice(side, order) {
  const anchor = side?.querySelector("#modebar");
  if (!anchor) return;
  for (const id of order) {
    const el = side.querySelector(`#${id}`);
    if (el && el.parentElement === side) side.insertBefore(el, anchor);
  }
}

// Izpitno obdobje, ki je pred študentom (slovenske fakultete): zimsko januar–februar, poletno junij–julij,
// jesensko avgust–september. Mesec 0–11.
export function izpitnoObdobje(month) {
  if (month >= 2 && month <= 6) return "summer";
  if (month === 7 || month === 8) return "autumn";
  return "winter";
}

/** Izpitni roki iz Urnika (kolokviji, izpiti, ustni), najbližji prvi, največ n. */
export function izpitniRoki(schedule, n = 3) {
  return (schedule?.upcoming || []).filter((e) => IZPITI.includes(e.kind) && e.daysLeft >= 0).slice(0, n);
}

const when = (t, n) => (n === 0 ? t("test.today") : n === 1 ? t("test.tomorrow") : t("test.inDays", { n }));
const row = (go, ic, title, sub, esc) =>
  `<button type="button" class="list-row" data-home-go="${go}"><span class="ic">${icon(ic)}</span><span class="lr-text"><b>${esc(title)}</b><small>${esc(sub)}</small></span>${icon("chevron-right")}</button>`;

/**
 * HTML kartice stopnje ali "" (ni kartice).
 * @param {"OS"|"SS"|"FAKS"} level
 * @param {{ games: boolean, exams: boolean, schedule: object|null, t: Function, esc: (s: string) => string, now?: Date }} o
 *   games: igre niso skrite; exams: zavihek »NPZ in matura« obstaja (slovenski šolski sistem)
 */
export function stageCardHtml(level, o) {
  const { esc, t } = o;
  if (level === "OS") return o.games ? `<div class="card list-card stage-card">${row("games", "gamepad-2", t("nav.games"), t("home.gamesSub"), esc)}</div>` : "";
  if (level === "SS") return o.exams ? `<div class="card list-card stage-card">${row("exams", "graduation-cap", t("home.matura"), t("home.maturaSub"), esc)}</div>` : "";
  if (level !== "FAKS") return "";
  const roki = izpitniRoki(o.schedule);
  const period = izpitnoObdobje((o.now || new Date()).getMonth());
  const list = roki.length
    ? `<ul class="stage-exams">${roki.map((e) => `<li><span class="se-name">${esc(e.name)}</span><span class="se-when">${esc(when(t, e.daysLeft))}</span></li>`).join("")}</ul>`
    : `<p class="muted stage-note">${esc(t("home.examsNone"))} ${esc(t(`home.period.${period}`))}</p>`;
  return `<div class="card list-card stage-card">
    ${row("textbook", "book-open", t("tbk.myStudy"), t("home.studySub"), esc)}
    <div class="stage-exams-box">
      <button type="button" class="sch-card-head" data-home-go="schedule"><span class="eyebrow">${esc(t("home.examsTitle"))}</span>${icon("chevron-right")}</button>
      ${list}
      ${roki.length ? "" : `<button type="button" class="secondary small" data-home-go="schedule">${icon("calendar-days")}${esc(t("home.examsAdd"))}</button>`}
    </div>
  </div>`;
}

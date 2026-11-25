// Cilj in datum cilja: vprašamo enkrat (nov profil), nato le vrstica z odštevanjem na Učni poti,
// v Napredku in v zgornji vrstici. Spremeni ali izbriši se v Nastavitvah. Opomnik ob OPOMNIK_URA (goal-data.js):
// kartica v aplikaciji (ko jo odpreš po tej uri) in, z računom, e-pošta (server/accounts/goal-reminder.js).
import { t, locale } from "./i18n-osnova.js";
import { icon } from "./icons.js";
import { odstevanje } from "./zacetna.js";
import { goalsFor, daysUntil, validDate, DEFAULT_GOAL, hasGoal, privzetiCilj, ciljObrazca, OPOMNIK_URA } from "./goal-data.js";
import { celDatum, zdruzi } from "./datum.js";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
export const goalName = (g) => t(`goal.${g || DEFAULT_GOAL}`);

export function fmtDate(s) {
  if (!validDate(s)) return "";
  const [y, m, d] = s.split("-").map(Number);
  try {
    return celDatum(new Intl.DateTimeFormat(locale(), { day: "numeric", month: "numeric", year: "numeric" }).format(new Date(y, m - 1, d)));
  } catch {
    return celDatum(`${d}. ${m}. ${y}`);
  }
}

// »še 215 dni« / »danes« / »datum je že mimo« / "" brez datuma (public/zacetna.js, skupno s kartico »Danes«)
export const countdown = (date) => odstevanje(t, date);

// Kratek napis za vrstico in zgornjo vrstico: »Matura · 1. 6. 2027 · še 215 dni«
export function goalSummary(settings = {}) {
  const parts = [goalName(settings.goal)];
  if (validDate(settings.goal_date)) parts.push(fmtDate(settings.goal_date), countdown(settings.goal_date));
  return zdruzi(parts);
}
export { hasGoal }; // public/goal-data.js (tudi strežnik: server/pot-takoj.js)

// Polja za obrazec (nov profil in Nastavitve). withReminder: stikalo za opomnik in gumb Izbriši datum.
export function goalFieldsHtml(settings = {}, { withReminder = false, idPrefix = "goal" } = {}) {
  const goals = goalsFor(settings);
  const cur = goals.includes(settings.goal) ? settings.goal : DEFAULT_GOAL;
  const date = validDate(settings.goal_date) ? settings.goal_date : "";
  const today = new Date();
  const min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  return `
    <div class="goal-chips chip-row" role="radiogroup" aria-label="${esc(t("goal.title"))}">${goals
      .map((g) => `<button type="button" role="radio" data-goal="${g}" class="${g === cur ? "active" : ""}" aria-checked="${g === cur}">${esc(goalName(g))}</button>`)
      .join("")}</div>
    <input type="hidden" name="goal" value="${cur}">
    <div class="goal-date-row">
      <label class="goal-date"><span>${esc(t("goal.date"))} <small class="muted">${esc(t("goal.optional"))}</small></span>
        <input type="date" name="goal_date" id="${idPrefix}-date" value="${date}" min="${min}">
      </label>
      ${withReminder ? `<button type="button" class="secondary goal-clear" ${date ? "" : "hidden"}>${icon("trash-2")}${esc(t("goal.clear"))}</button>` : ""}
    </div>
    <p class="goal-countdown" aria-live="polite">${esc(date ? zdruzi([goalName(cur), countdown(date)]) : "")}</p>
    ${withReminder ? `
    <div class="goal-reminder-row" ${date ? "" : "hidden"}>
      <span class="gr-text"><b id="${idPrefix}-rem-label">${esc(t("goal.reminder", { h: OPOMNIK_URA }))}</b><small class="muted">${esc(t("goal.reminderNote", { date: fmtDate(date) }))}</small></span>
      <button type="button" class="switch" role="switch" aria-checked="${settings.goal_reminder !== false}" aria-labelledby="${idPrefix}-rem-label" data-goal-reminder></button>
      <input type="hidden" name="goal_reminder" value="${settings.goal_reminder !== false ? "1" : "0"}">
    </div>
    <p class="muted small-note goal-no-date" ${date ? "hidden" : ""}>${esc(t("goal.reminderNeedsDate", { h: OPOMNIK_URA }))}</p>` : ""}`;
}

// Odzivnost polj: izbira cilja, datum, brisanje datuma, stikalo. Klic po vsakem izrisu polj.
export function wireGoalFields(box) {
  if (!box || box.dataset.goalWired) return;
  box.dataset.goalWired = "1";
  const refresh = () => {
    const date = box.querySelector("input[name=goal_date]").value;
    const goal = box.querySelector("input[name=goal]").value;
    box.querySelector(".goal-countdown").textContent = validDate(date) ? zdruzi([goalName(goal), countdown(date)]) : "";
    const clear = box.querySelector(".goal-clear");
    if (clear) clear.hidden = !date;
    const rem = box.querySelector(".goal-reminder-row");
    if (rem) {
      rem.hidden = !date;
      rem.querySelector("small").textContent = t("goal.reminderNote", { date: fmtDate(date) });
    }
    const nd = box.querySelector(".goal-no-date");
    if (nd) nd.hidden = !!date;
  };
  box.addEventListener("click", (e) => {
    const g = e.target.closest("[data-goal]");
    if (g) {
      box.querySelectorAll("[data-goal]").forEach((b) => {
        b.classList.toggle("active", b === g);
        b.setAttribute("aria-checked", String(b === g));
      });
      box.querySelector("input[name=goal]").value = g.dataset.goal;
      return refresh();
    }
    if (e.target.closest(".goal-clear")) {
      box.querySelector("input[name=goal_date]").value = "";
      return refresh();
    }
    const sw = e.target.closest("[data-goal-reminder]");
    if (sw) {
      const on = sw.getAttribute("aria-checked") !== "true";
      sw.setAttribute("aria-checked", String(on));
      box.querySelector("input[name=goal_reminder]").value = on ? "1" : "0";
    }
  });
  box.addEventListener("input", (e) => {
    if (e.target.name === "goal_date") refresh();
  });
}

// Vrednosti iz obrazca za PUT /api/students/:id
export function readGoalFields(box) {
  const date = box.querySelector("input[name=goal_date]")?.value || "";
  const rem = box.querySelector("input[name=goal_reminder]");
  return {
    goal: box.querySelector("input[name=goal]")?.value || DEFAULT_GOAL,
    goal_date: validDate(date) ? date : "",
    ...(rem ? { goal_reminder: rem.value === "1" } : {}),
  };
}

// Vrstica na Učni poti / v Napredku: »Srednja šola · Matura · 1. 6. 2027 · še 215 dni · Spremeni«.
// brezDni: brez »še N dni« (na Učni poti pri cilju matura odštevanje že kaže kartica »Danes«; j, 20. 11. 2026).
export function goalLineHtml(student, levelText = "", brezDni = false) {
  const s = student?.settings || {};
  const sum = brezDni ? zdruzi([goalName(s.goal), fmtDate(s.goal_date)]) : goalSummary(s);
  const parts = zdruzi([levelText, sum]);
  return `<span class="gl-ic" aria-hidden="true">${icon("target")}</span><span class="gl-text">${esc(parts)}</span>
    <button type="button" class="text-btn gl-edit" data-view="settings" data-goal-edit>${esc(t("goal.change"))}</button>`;
}

// Opomnik: danes od OPOMNIK_URA, do dneva cilja vključno, če je vključen in še ni bil skrit danes.
const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const seenKey = (id) => `evklid.goalSeen.${id}`;
// vadil: učenec je danes že zbral XP – kartice ni, kot ne e-pošte in obvestila (vadilDanes, pregled #917).
export function reminderDue(student, now = new Date(), { vadil = false } = {}) {
  const s = student?.settings || {};
  if (vadil || !s.goal_reminder || !validDate(s.goal_date)) return false;
  const n = daysUntil(s.goal_date);
  if (n === null || n < 0 || now.getHours() < OPOMNIK_URA) return false;
  try {
    return localStorage.getItem(seenKey(student.id)) !== todayKey();
  } catch {
    return true;
  }
}
export function dismissReminder(student) {
  try {
    localStorage.setItem(seenKey(student.id), todayKey());
  } catch {}
}
// Besedilo opomnika: »Matura: še 215 dni. Danes 15 minut?«
export function reminderText(settings = {}) {
  const n = daysUntil(settings.goal_date);
  const head = n === 0 ? t("goal.remToday", { goal: goalName(settings.goal) }) : `${goalName(settings.goal)}: ${countdown(settings.goal_date)}.`;
  return `${head} ${t("goal.remAsk")}`;
}
export function reminderCardHtml(student, { preview = false } = {}) {
  return `<span class="gr-ic" aria-hidden="true">${icon("bell")}</span>
    <div class="gr-body">
      <div class="gr-head"><span>${esc(t("goal.remHead"))}</span><span>${esc(t("goal.remWhen", { h: OPOMNIK_URA }))}</span></div>
      <b>${esc(reminderText(student.settings))}</b>
      ${preview ? "" : `<div class="actions"><button type="button" class="primary small" data-goal-start>${icon("play")}${esc(t("goal.remStart"))}</button><button type="button" class="ghost small" data-goal-later>${esc(t("goal.remLater"))}</button></div>`}
    </div>`;
}

// Cilj v obrazcu ob prvem zagonu (app.js onboard). Dokler cilja ne izbere sam, velja privzeti cilj šole (4. letnik SŠ:
// matura z datumom roka, goal-data.js privzetiCilj) in obrazec ga ne pošlje: strežnik ga določi po istem pravilu
// (server/db.js createStudent). read() vrne polja za POST, draw() izriše znova ob spremembi šole ali letnika.
export function onbGoal(box, f) {
  let touched = false;
  box.addEventListener("click", (e) => e.target.closest("[data-goal]") && (touched = true));
  box.addEventListener("input", () => (touched = true));
  const where = () => ({ school_system: f.school_system.value, educational_track: f.educational_track.value, curriculum_level: f.curriculum_level.value });
  const draw = () => {
    const w = where();
    box.innerHTML = goalFieldsHtml({ ...(touched ? readGoalFields(box) : privzetiCilj(w)), ...w }, { idPrefix: "onb-goal" });
  };
  draw();
  wireGoalFields(box);
  return { draw, read: () => (touched ? ciljObrazca(readGoalFields(box), where()) : {}) };
}

// Gumbi kartice »Danes« in ponudbe »cilj matura« na Učni poti. o: state (state.student), start(mode) seja,
// topic(id) odpre temo z vajo, save(student, settings, yes) shrani nastavitve.
export function wireDanes(o) {
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-danes-review]")) o.start("review");
    const dt = e.target.closest("[data-danes-topic]");
    if (dt) o.topic(dt.dataset.danesTopic);
    const mo = e.target.closest("[data-matura-offer]");
    const st = o.state.student;
    if (!mo || !st) return;
    // Kartica izgine takoj, shrani se v ozadju (sprejeto ali zavrnjeno: ponudbe ni več).
    document.getElementById("goal-reminder").hidden = true;
    document.querySelector("#xp-card button")?.focus({ preventScroll: true }); // fokus s tipkovnico ne pade na začetek strani
    const yes = mo.dataset.maturaOffer === "yes";
    o.save(st, { matura_offer: 1, ...(yes ? privzetiCilj(st.settings) : {}) }, yes);
  });
}

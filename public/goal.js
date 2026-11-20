// Cilj in datum cilja: vprašamo enkrat (nov profil), nato le vrstica z odštevanjem na Učni poti,
// v Napredku in v zgornji vrstici. Spremeni ali izbriši se v Nastavitvah. Opomnik ob 12.00:
// kartica v aplikaciji (ko jo odpreš po 12.00) in, z računom, e-pošta (server/accounts/goal-reminder.js).
import { t, locale } from "./i18n-osnova.js";
import { icon } from "./icons.js";
import { goalsFor, daysUntil, validDate, DEFAULT_GOAL, privzetiCilj, ciljObrazca, ponudiMaturo } from "./goal-data.js";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
export const goalName = (g) => t(`goal.${g || DEFAULT_GOAL}`);

export function fmtDate(s) {
  if (!validDate(s)) return "";
  const [y, m, d] = s.split("-").map(Number);
  try {
    return new Intl.DateTimeFormat(locale(), { day: "numeric", month: "numeric", year: "numeric" }).format(new Date(y, m - 1, d));
  } catch {
    return `${d}. ${m}. ${y}`;
  }
}

// »še 215 dni« / »danes« / »datum je že mimo« / "" brez datuma
export function countdown(date) {
  const n = daysUntil(date);
  if (n === null) return "";
  if (n < 0) return t("goal.past");
  if (n === 0) return t("goal.today");
  return t("goal.left", { n });
}

// Kratek napis za vrstico in zgornjo vrstico: »Matura · 1. 6. 2027 · še 215 dni«
export function goalSummary(settings = {}) {
  const parts = [goalName(settings.goal)];
  if (validDate(settings.goal_date)) parts.push(fmtDate(settings.goal_date), countdown(settings.goal_date));
  return parts.join(" · ");
}
export const hasGoal = (s = {}) => (s.goal && s.goal !== DEFAULT_GOAL) || validDate(s.goal_date);

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
    <p class="goal-countdown" aria-live="polite">${esc(date ? `${goalName(cur)} · ${countdown(date)}` : "")}</p>
    ${withReminder ? `
    <div class="goal-reminder-row" ${date ? "" : "hidden"}>
      <span class="gr-text"><b id="${idPrefix}-rem-label">${esc(t("goal.reminder"))}</b><small class="muted">${esc(t("goal.reminderNote", { date: fmtDate(date) }))}</small></span>
      <button type="button" class="switch" role="switch" aria-checked="${settings.goal_reminder !== false}" aria-labelledby="${idPrefix}-rem-label" data-goal-reminder></button>
      <input type="hidden" name="goal_reminder" value="${settings.goal_reminder !== false ? "1" : "0"}">
    </div>
    <p class="muted small-note goal-no-date" ${date ? "hidden" : ""}>${esc(t("goal.reminderNeedsDate"))}</p>` : ""}`;
}

// Odzivnost polj: izbira cilja, datum, brisanje datuma, stikalo. Klic po vsakem izrisu polj.
export function wireGoalFields(box) {
  if (!box || box.dataset.goalWired) return;
  box.dataset.goalWired = "1";
  const refresh = () => {
    const date = box.querySelector("input[name=goal_date]").value;
    const goal = box.querySelector("input[name=goal]").value;
    box.querySelector(".goal-countdown").textContent = validDate(date) ? `${goalName(goal)} · ${countdown(date)}` : "";
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

// Vrstica na Učni poti / v Napredku: »Srednja šola · Matura · 1. 6. 2027 · še 215 dni · Spremeni«
export function goalLineHtml(student, levelText = "") {
  const s = student?.settings || {};
  const parts = [levelText, goalSummary(s)].filter(Boolean).join(" · ");
  return `<span class="gl-ic" aria-hidden="true">${icon("target")}</span><span class="gl-text">${esc(parts)}</span>
    <button type="button" class="text-btn gl-edit" data-view="settings" data-goal-edit>${esc(t("goal.change"))}</button>`;
}

// Opomnik: danes po 12.00, do dneva cilja vključno, če je vključen in še ni bil skrit danes.
const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const seenKey = (id) => `evklid.goalSeen.${id}`;
export function reminderDue(student, now = new Date()) {
  const s = student?.settings || {};
  if (!s.goal_reminder || !validDate(s.goal_date)) return false;
  const n = daysUntil(s.goal_date);
  if (n === null || n < 0 || now.getHours() < 12) return false;
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
      <div class="gr-head"><span>${esc(t("goal.remHead"))}</span><span>${esc(t("goal.remWhen"))}</span></div>
      <b>${esc(reminderText(student.settings))}</b>
      ${preview ? "" : `<div class="actions"><button type="button" class="primary small" data-goal-start>${icon("play")}${esc(t("goal.remStart"))}</button><button type="button" class="ghost small" data-goal-later>${esc(t("goal.remLater"))}</button></div>`}
    </div>`;
}

// Vrh Učne poti (#xp-card, p = /path): [kartica, vrstica pod njo]. Navadno Današnji trening in »Naslednja tema«.
// Pri cilju matura kartica »Danes« (j, 20. 11. 2026): odštevanje do mature, korak za danes (najprej ponavljanje, kar je
// na vrsti, nato tema iz »Najprej vadi« na strani NPZ in matura; podatki: /path → danes), približne minute in en gumb,
// po vsaj 3 dneh odsotnosti kratek pozdrav; Današnji trening je tedaj vrstica pod njo.
export function heroHtml(student, p, done = false) {
  const d = p.danes;
  if (!d || (!d.due && !d.next))
    return [
      `<div class="hero">
      <div class="hero-icon">${icon("zap")}</div>
      <div class="hero-text"><h2>${t("daily.title")}</h2><p>${done ? t("daily.doneText") : t("daily.text")}</p></div>
      <button class="primary big" data-daily>${done ? t("daily.again") : t("daily.start")}</button>
    </div>`,
      p.next
        ? `<button class="next-row" data-open="${esc(p.next.id)}"><span class="eyebrow">${t("path.next")}</span><span class="next-name">${esc(p.next.name)}</span>${icon("chevron-right")}</button>`
        : `<div class="next-row done">${icon("trophy")}<span class="next-name">${t("path.allDone")}</span></div>`,
    ];
  const s = student?.settings || {};
  const when = [goalName("matura"), countdown(s.goal_date)].filter(Boolean).join(" · ");
  const min = esc(t("danes.min", { n: d.minutes }));
  const back = d.odsoten >= 3 ? `<p class="danes-back">${esc(t(d.due ? "danes.back" : "danes.backHi"))}</p>` : "";
  const step = d.due
    ? `<p><b>${esc(t("mode.reviewBadge", { n: d.review }))}</b> · ${min}</p>${d.next ? `<p>${esc(t("danes.then", { topic: d.next.name }))}</p>` : ""}`
    : `<p><b>${esc(t("danes.next", { topic: d.next.name }))}</b> · ${min}</p>`;
  const btn = d.due
    ? `<button class="primary big" data-danes-review>${esc(t("danes.review"))}</button>`
    : `<button class="primary big" data-danes-topic="${esc(d.next.id)}">${esc(t("ready.practice"))}</button>`;
  return [
    `<div class="hero danes">
      <div class="hero-icon">${icon("target")}</div>
      <div class="hero-text"><h2>${esc(t("danes.title"))}</h2><p>${esc(when)}</p>${back}${step}</div>
      ${btn}
    </div>`,
    `<button type="button" class="next-row" data-daily><span class="eyebrow">${esc(t("daily.title"))}</span><span class="next-name">${esc(t(done ? "daily.doneTitle" : "daily.about"))}</span>${icon("zap")}</button>`,
  ];
}

// Ponudba za star profil maturanta s privzetim ciljem (goal-data.js ponudiMaturo): en dotik nastavi cilj matura.
// Drugim profilom "".
export function maturaPonudbaHtml(settings) {
  if (!ponudiMaturo(settings)) return "";
  return `<span class="gr-ic" aria-hidden="true">${icon("target")}</span>
    <div class="gr-body">
      <b>${esc(t("danes.offerTitle"))}</b>
      <span>${esc(t("danes.offerText"))}</span>
      <div class="actions"><button type="button" class="primary small" data-matura-offer="yes">${esc(t("danes.offerYes"))}</button><button type="button" class="ghost small" data-matura-offer="no">${esc(t("danes.offerNo"))}</button></div>
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
    const yes = mo.dataset.maturaOffer === "yes";
    o.save(st, { matura_offer: 1, ...(yes ? privzetiCilj(st.settings) : {}) }, yes);
  });
}

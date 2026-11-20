// Kartica »Danes imaš …« na Učni poti (ponovitev pred uro, opomnik pred testom) in stanje urnika, ki ga berejo Učna pot,
// kartica stopnje (lastSchedule) in stran Urnik (public/schedule.js). Del prvega odprtja; stran Urnik ne (naloga hitrost,
// docs/meritve/prijavljen-mobilno-2026-11-19.md točka 2): app.js jo naloži po prvem izrisu ali ob prvem odprtju.
import { icon } from "./icons.js";
import { t } from "./i18n-osnova.js";
import { jeFaks } from "./stopnja.js";

export let D = null; // { api, getStudent, showView, startSession, toast, escapeHtml, onChange }
export let data = null; // zadnji odgovor strežnika { schedule, courses }
let dataFor = null; // id profila, za katerega je data (pozen odgovor prejšnjega profila ga prepiše)
// Nov odgovor strežnika (stran Urnik: shrani, izbriši, osveži); id: profil, za katerega je.
export function nastaviUrnik(d, id = dataFor) {
  data = d;
  dataFor = id;
}

export const REMIND_KEY = "evklid.scheduleReminders";
const NOTIFIED_KEY = "evklid.scheduleNotified";
const HIDE_KEY = "evklid.scheduleCardHidden";
export const ls = {
  get: (k) => {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set: (k, v) => {
    try {
      localStorage.setItem(k, v);
    } catch {}
  },
};

// Zadnji pogled Urnika (po renderScheduleCard), za kartico stopnje na Učni poti (public/zacetna.js).
// Le za podani profil: odgovor, ki je prispel za drug (prejšnji) profil, vrne null.
export const lastSchedule = (studentId) => (data && dataFor === studentId ? data.schedule : null);

export function initSchedule(deps) {
  D = deps;
}

export const sid = () => D.getStudent()?.id;
export const esc = (s) => D.escapeHtml(s ?? "");
export const TEST_KINDS = ["test", "kolokvij", "izpit", "ustno"];
export const when = (n) => (n === 0 ? t("test.today") : n === 1 ? t("test.tomorrow") : t("test.inDays", { n }));

export async function load() {
  const id = sid();
  data = await D.api(`/api/students/${id}/schedule`);
  dataFor = id;
  return data;
}

// ---------------------------------------------------------------------------
// Kartica na Učni poti: danes / jutri, ponovitev pred uro, opomnik pred testom.

export async function renderScheduleCard(el) {
  if (!el || !sid()) return;
  let d;
  try {
    d = await load();
  } catch {
    data = null; // kartica stopnje (lastSchedule) ne sme pokazati urnika prejšnjega profila
    el.hidden = true;
    return;
  }
  const s = d.schedule;
  if (!s.lessons.length && !s.events.length) {
    if (ls.get(HIDE_KEY) === "1") return (el.hidden = true);
    el.hidden = false;
    el.innerHTML = `<div class="card sch-card sch-card-empty"><button type="button" class="list-row" data-go-schedule><span class="ic">${icon("calendar-days")}</span><span class="lr-text"><b>${t("sch.addPrompt")}</b><small>${t("sch.addPromptSub")}</small></span>${icon("chevron-right")}</button><button type="button" class="ghost icon-only sch-card-x" aria-label="${esc(t("pad.close"))}" title="${esc(t("pad.close"))}">${icon("x")}</button></div>`;
    el.querySelector("[data-go-schedule]").addEventListener("click", () => D.showView("schedule"));
    el.querySelector(".sch-card-x").addEventListener("click", () => {
      ls.set(HIDE_KEY, "1");
      el.hidden = true;
    });
    return;
  }
  const now = s.now.time;
  // Po zadnji današnji uri pokažemo jutrišnje ure.
  const todayLeft = s.today.filter((l) => l.end > now);
  const showTomorrow = !s.today.length || !todayLeft.length;
  const list = dedupe(showTomorrow ? s.tomorrow : s.today);
  // Ponovitev: naslednja ura s potjo v aplikaciji (danes), ali utrditev ure, ki je danes že bila.
  const nextL = !showTomorrow ? todayLeft.find((l) => l.path) : s.tomorrow.find((l) => l.path);
  const pastL = [...s.today].reverse().find((l) => l.path && l.end <= now);
  const cls = nextL || pastL;
  const after = !nextL && pastL;
  const rem = s.reminders.filter((e) => TEST_KINDS.includes(e.kind) || e.kind === "naloga");
  // Faks: izpitne roke kaže kartica »Moj študij« (public/zacetna.js), tu ne še enkrat.
  const next = jeFaks(D.getStudent()?.settings) ? null : s.upcoming.find((e) => TEST_KINDS.includes(e.kind) && e.daysLeft > 1 && e.daysLeft <= 14);
  el.hidden = false;
  el.innerHTML = `<div class="card sch-card">
    ${rem
      .map(
        (e) => `<div class="sch-remind-row"><span class="ic">${icon("bell")}</span><div><b>${t(e.daysLeft === 0 ? "sch.remindToday" : "sch.remindTomorrow", { name: esc(e.name) })}${e.time ? ` · ${e.time}` : ""}</b><p class="muted">${t("sch.remindText")}</p></div>${e.path && TEST_KINDS.includes(e.kind) ? `<button type="button" class="primary" data-prep>${t("sch.prepare")}</button><button type="button" class="secondary" data-ustno="test">${icon("speech")} ${t("ustno.vprasajMe")}</button>` : ""}</div>`,
      )
      .join("")}
    <button type="button" class="sch-card-head" data-go-schedule><span class="eyebrow">${t(showTomorrow ? "sch.cardTomorrow" : "sch.cardToday")}</span>${icon("chevron-right")}</button>
    ${list.length ? `<div class="chip-row sch-chips">${list.map((l) => `<span class="sch-chip ${nextL && l.id === nextL.id ? "next" : ""}"><b>${l.start}</b> ${esc(l.name)}</span>`).join("")}</div>` : `<p class="muted">${t("sch.free")}</p>`}
    ${cls ? `<button type="button" class="secondary sch-class" data-class="${esc(cls.path)}">${icon("repeat")} ${t(after ? "sch.reviewAfter" : "sch.reviewBefore")}: ${esc(cls.name)}</button>` : ""}
    ${next ? `<p class="muted sch-next">${icon("clipboard-check")} ${t("sch.nextTest", { name: esc(next.name), when: when(next.daysLeft) })}</p>` : ""}
  </div>`;
  el.querySelectorAll("[data-go-schedule]").forEach((b) => b.addEventListener("click", () => D.showView("schedule")));
  el.querySelector("[data-prep]")?.addEventListener("click", () => D.startSession("test-prep"));
  el.querySelector("[data-class]")?.addEventListener("click", (e) => D.startSession("class", { path: e.currentTarget.dataset.class }));
  notify(rem);
}

// Iste ure več skupin vaj pokažemo enkrat.
function dedupe(list) {
  const seen = new Set();
  return list.filter((l) => {
    const k = `${l.start}|${l.name}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

// Obvestilo na napravi dan pred testom (enkrat na test), če ga je učenec vklopil.
function notify(reminders) {
  if (ls.get(REMIND_KEY) !== "1" || !("Notification" in window) || Notification.permission !== "granted") return;
  let done = {};
  try {
    done = JSON.parse(ls.get(NOTIFIED_KEY) || "{}");
  } catch {}
  for (const e of reminders) {
    const k = `${e.id}|${e.date}|${e.daysLeft}`;
    if (done[k]) continue;
    done[k] = 1;
    const title = t(e.daysLeft === 0 ? "sch.remindToday" : "sch.remindTomorrow", { name: e.name });
    const opts = { body: t("sch.notifyBody"), icon: "/icons/icon-192.png", tag: `sch-${e.id}` };
    navigator.serviceWorker?.ready
      .then((r) => r.showNotification(title, opts))
      .catch(() => {
        try {
          new Notification(title, opts);
        } catch {}
      });
  }
  ls.set(NOTIFIED_KEY, JSON.stringify(Object.fromEntries(Object.entries(done).slice(-50))));
}

// Kartica »Danes imaš …« na Učni poti (ponovitev pred uro, opomnik pred testom) in stanje urnika, ki ga berejo Učna pot,
// kartica stopnje (lastSchedule) in stran Urnik (public/schedule.js). Del prvega odprtja; stran Urnik ne (naloga hitrost,
// docs/meritve/prijavljen-mobilno-2026-11-19.md točka 2): app.js jo naloži po prvem izrisu ali ob prvem odprtju.
import { t } from "./i18n-osnova.js";
import { jeFaks } from "./stopnja.js";
import { scheduleCardHtml, scheduleReminders } from "./zacetna.js";

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
  // Izris je skupen s strežnikom (public/zacetna.js): Učna pot v prvem odgovoru strani ima isto kartico.
  const k = scheduleCardHtml(t, s, { faks: jeFaks(D.getStudent()?.settings) });
  if (k.empty) {
    if (ls.get(HIDE_KEY) === "1") return (el.hidden = true);
    el.hidden = false;
    el.innerHTML = k.html;
    el.querySelector("[data-go-schedule]").addEventListener("click", () => D.showView("schedule"));
    el.querySelector(".sch-card-x").addEventListener("click", () => {
      ls.set(HIDE_KEY, "1");
      el.hidden = true;
    });
    return;
  }
  const rem = scheduleReminders(s);
  el.hidden = false;
  el.innerHTML = k.html;
  el.querySelectorAll("[data-go-schedule]").forEach((b) => b.addEventListener("click", () => D.showView("schedule")));
  el.querySelector("[data-prep]")?.addEventListener("click", () => D.startSession("test-prep"));
  el.querySelector("[data-class]")?.addEventListener("click", (e) => D.startSession("class", { path: e.currentTarget.dataset.class }));
  notify(rem);
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

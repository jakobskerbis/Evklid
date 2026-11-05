// Urnik učenca (Jaz → Urnik): ure v tednu in testi. Strežnik: server/schedule.js, server/schedule-api.js.
// - showSchedule(): stran z urnikom (teden, testi, ročni vnos, fotografija, koledar .ics, urnik UL FMF).
// - renderScheduleCard(): kartica »Danes imaš …« na Učni poti (ponovitev pred uro, opomnik pred testom).
import { icon, hydrateIcons } from "./icons.js";
import { t, locale } from "./i18n.js";
import { schoolSubjectsFor, SUBJECT_NAMES } from "./programs.js";
import { renderPassOffer } from "./pass-offer.js";
import { jeFaks } from "./stopnja.js";

let D = null; // { api, getStudent, showView, startSession, toast, escapeHtml, onChange }
let data = null; // zadnji odgovor strežnika { schedule, courses }
let dataFor = null; // id profila, za katerega je data (pozen odgovor prejšnjega profila ga prepiše)
let preview = null; // uvoz, ki ga učenec še preverja { lessons, events, source }

const REMIND_KEY = "evklid.scheduleReminders";
const NOTIFIED_KEY = "evklid.scheduleNotified";
const HIDE_KEY = "evklid.scheduleCardHidden";
const ls = {
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

const sid = () => D.getStudent()?.id;
const esc = (s) => D.escapeHtml(s ?? "");
const box = () => document.querySelector("#view-schedule .sch-body");
const KINDS = ["test", "kolokvij", "izpit", "ustno", "naloga", "drugo"];
const TEST_KINDS = ["test", "kolokvij", "izpit", "ustno"];
const dayName = (d, style = "long") => new Intl.DateTimeFormat(locale(), { weekday: style }).format(new Date(Date.UTC(2024, 0, d, 12)));
// Mesec s številko: »čet., 30. 10.« (dolgo ime meseca bi bilo v slovenščini v napačnem sklonu).
const fmtDate = (s) => new Date(`${s}T12:00:00`).toLocaleDateString(locale(), { weekday: "short", day: "numeric", month: "numeric" });
const when = (n) => (n === 0 ? t("test.today") : n === 1 ? t("test.tomorrow") : t("test.inDays", { n }));
const lessonLabel = (l) => [l.kind, l.group ? t("sch.group", { g: l.group }) : ""].filter(Boolean).join(" · ");

async function load() {
  const id = sid();
  data = await D.api(`/api/students/${id}/schedule`);
  dataFor = id;
  return data;
}
async function save(body) {
  const id = sid();
  data = await D.api(`/api/students/${id}/schedule`, { method: "PUT", body });
  dataFor = id;
  D.onChange?.();
  return data;
}

// ---------------------------------------------------------------------------
// Stran »Urnik«

export async function showSchedule() {
  if (!sid()) return;
  const v = box();
  v.innerHTML = `<p class="muted">${t("common.loading")}</p>`;
  try {
    await load();
  } catch (err) {
    v.innerHTML = `<p class="muted">${esc(err.message)}</p>`;
    return;
  }
  render();
}

// Šolski zvonec: običajni začetek in konec ure (ročni vnos in mreža tedna).
const BELLS = { 0: ["07:30", "08:15"], 1: ["08:20", "09:05"], 2: ["09:10", "09:55"], 3: ["10:15", "11:00"], 4: ["11:05", "11:50"], 5: ["11:55", "12:40"], 6: ["12:45", "13:30"], 7: ["13:35", "14:20"], 8: ["14:25", "15:10"] };
const toMin = (x) => {
  const [h, m] = String(x || "").split(":").map(Number);
  return h * 60 + (m || 0);
};
const pad = (n) => String(n).padStart(2, "0");
// Šolska ura, v katero spada ura z urnika (po številki ali po začetku), ali null.
function bellOf(l) {
  if (l.period != null) return l.period;
  if (!l.start) return null;
  const m = toMin(l.start);
  const hit = Object.entries(BELLS).find(([, [a, b]]) => m >= toMin(a) - 10 && m < toMin(b));
  return hit ? Number(hit[0]) : null;
}

// Teden kot urnik na steni (j, 4. 11. 2026: »prazen prostor naj bo izkoriščen«): dnevi v stolpcih, ure v vrsticah,
// čez vso širino strani. Šola: vrstice so šolske ure; fakulteta ali ure, ki ne sledijo zvoncu: vrstice so polne ure in
// predavanje zavzame toliko vrstic, kolikor traja. Prazno polje doda uro na ta dan in ob to uro.
// V ozkem vsebniku (telefon, majhno okno) CSS namesto mreže pokaže dneve drugega pod drugim (.sch-week).
function gridHtml(s, days) {
  const L = s.lessons;
  // Šolski zvonec samo, ko vse ure sledijo zvoncu in nobena ne traja dlje od ene šolske ure (dvourno predavanje → polne ure).
  const short = (l) => l.period != null || !l.start || !l.end || toMin(l.end) - toMin(l.start) <= 60;
  const school = !jeFaks(D.getStudent()?.settings) && L.every((l) => bellOf(l) != null && short(l));
  let rows;
  const place = new Map(); // "dan:vrstica" → { span, items }
  if (school) {
    const used = L.map(bellOf);
    const lo = Math.min(1, ...used), hi = Math.max(7, ...used);
    rows = [...Array(hi - lo + 1)].map((_, i) => lo + i);
    for (const l of L) {
      const k = `${l.day}:${bellOf(l)}`;
      if (!place.has(k)) place.set(k, { span: 1, items: [] });
      place.get(k).items.push(l);
    }
  } else {
    const starts = L.filter((l) => l.start).map((l) => Math.floor(toMin(l.start) / 60));
    const ends = L.filter((l) => l.end).map((l) => Math.ceil(toMin(l.end) / 60) - 1);
    const lo = Math.min(8, ...starts), hi = Math.max(lo + 7, ...starts, ...ends);
    rows = [...Array(hi - lo + 1)].map((_, i) => lo + i);
    // Ura, ki se začne med daljšo uro istega dne (vzporedne skupine), gre v isto polje, ki se po potrebi podaljša.
    for (const l of [...L].sort((a, b) => a.day - b.day || toMin(a.start) - toMin(b.start))) {
      const h = l.start ? Math.floor(toMin(l.start) / 60) : lo;
      const span = l.start && l.end ? Math.max(1, Math.min(hi + 1, Math.ceil(toMin(l.end) / 60)) - h) : 1;
      let h0 = h;
      for (const [k, c] of place) {
        const [d, r] = k.split(":").map(Number);
        if (d === l.day && r <= h && h < r + c.span) h0 = r;
      }
      const k = `${l.day}:${h0}`;
      if (!place.has(k)) place.set(k, { span: 1, items: [] });
      const c = place.get(k);
      c.span = Math.max(c.span, h + span - h0);
      c.items.push(l);
    }
  }
  const row0 = rows[0];
  let html = `<span class="sch-g-corner"></span>${days.map((d, i) => `<span class="sch-g-day ${d === s.now.day ? "today" : ""}" style="grid-column:${i + 2}">${esc(dayName(d))}</span>`).join("")}`;
  html += rows
    .map((r, i) => {
      const label = school ? `<b>${t("sch.periodN", { n: r })}</b><small>${BELLS[r]?.[0] || ""}</small>` : `<b>${pad(r)}:00</b>`;
      return `<span class="sch-g-row" style="grid-row:${i + 2}">${label}</span>`;
    })
    .join("");
  for (const [ci, d] of days.entries()) {
    let covered = -Infinity; // zadnja vrstica, ki jo prekriva že narisano polje (šolska ura 0 je prava vrstica)
    for (const r of rows) {
      const gr = r - row0 + 2;
      const c = place.get(`${d}:${r}`);
      if (c) {
        const span = Math.min(c.span, rows.length - (r - row0));
        covered = Math.max(covered, r + span - 1);
        html += `<div class="sch-g-cell ${d === s.now.day ? "today" : ""}" style="grid-row:${gr} / span ${span};grid-column:${ci + 2}">${c.items
          .sort((a, b) => toMin(a.start) - toMin(b.start))
          .map((l) => `<button type="button" class="sch-lesson" data-lesson="${l.id}"><b>${esc(l.name)}</b><span class="sch-time">${l.start}–${l.end}</span>${
            lessonLabel(l) || l.room ? `<small class="muted">${esc([lessonLabel(l), l.room].filter(Boolean).join(" · "))}</small>` : ""
          }</button>`)
          .join("")}</div>`;
      } else if (r > covered) {
        const at = school ? { day: d, period: r } : { day: d, start: `${pad(r)}:00`, end: `${pad(r + 1)}:00` };
        const name = t("sch.addAt", { day: dayName(d), time: school ? t("sch.periodN", { n: r }) : `${pad(r)}:00` });
        html += `<button type="button" class="sch-g-add ${d === s.now.day ? "today" : ""}" style="grid-row:${gr};grid-column:${ci + 2}" data-add='${JSON.stringify(at)}' aria-label="${esc(name)}" title="${esc(name)}">${icon("plus")}</button>`;
      }
    }
  }
  return `<div class="sch-grid" style="--sch-dni:${days.length}">${html}</div>`;
}

function render() {
  const s = data.schedule;
  const days = [1, 2, 3, 4, 5, ...[6, 7].filter((d) => s.lessons.some((l) => l.day === d))];
  const week = s.lessons.length
    ? `<div class="sch-week">${days
        .map(
          (d) => `<section class="sch-day ${d === s.now.day ? "today" : ""}"><h3>${esc(dayName(d))}</h3>${
            s.lessons
              .filter((l) => l.day === d)
              .map(
                (l) => `<button type="button" class="sch-lesson" data-lesson="${l.id}"><span class="sch-time">${l.start}–${l.end}</span><b>${esc(l.name)}</b>${
                  lessonLabel(l) || l.room ? `<small class="muted">${esc([lessonLabel(l), l.room].filter(Boolean).join(" · "))}</small>` : ""
                }</button>`,
              )
              .join("") || `<p class="muted sch-free">–</p>`
          }</section>`,
        )
        .join("")}</div>`
    : `<p class="muted">${t("sch.empty")}</p>`;
  const events = s.events.filter((e) => e.daysLeft >= 0);
  const evList = events.length
    ? `<div class="card list-card">${events
        .map(
          (e) => `<button type="button" class="list-row" data-event="${e.id}"><span class="ic">${icon(TEST_KINDS.includes(e.kind) ? "clipboard-check" : "calendar")}</span><span class="lr-text"><b>${esc(e.name)}</b><small>${esc(fmtDate(e.date))}${e.time ? ` · ${e.time}` : ""} · ${when(e.daysLeft)}</small></span>${icon("chevron-right")}</button>`,
        )
        .join("")}</div>`
    : `<p class="muted">${t("sch.noEvents")}</p>`;
  const plan = s.testPlan;
  const remind = ls.get(REMIND_KEY) === "1";
  box().innerHTML = `
    <div class="sch-top">
    <div class="sch-lead">
    <p class="muted sch-intro">${t("sch.intro")}</p>
    <div class="sch-add actions">
      <button type="button" class="primary" data-act="lesson">${icon("plus")} ${t("sch.addLesson")}</button>
      <button type="button" class="secondary" data-act="event">${icon("clipboard-check")} ${t("sch.addTest")}</button>
    </div>
    </div>
    <div class="card list-card sch-import">
      <button type="button" class="list-row" data-act="photo"><span class="ic">${icon("camera")}</span><span class="lr-text"><b>${t("sch.photo")}</b><small>${t("sch.photoSub")}</small></span>${icon("chevron-right")}</button>
      <button type="button" class="list-row" data-act="ics"><span class="ic">${icon("calendar-days")}</span><span class="lr-text"><b>${t("sch.import")}</b><small>${t("sch.importSub")}</small></span>${icon("chevron-right")}</button>
    </div>
    <input type="file" accept="image/*" capture="environment" id="sch-photo" hidden>
    <div id="sch-panel"></div>
    <section class="sch-events">
    <h2 class="sch-h">${t("sch.upcoming")}</h2>
    ${evList}
    <div id="sch-pass"></div>
    ${plan && plan.daysLeft >= 0 ? `<p class="muted">${t("sch.planNote", { date: esc(fmtDate(plan.date)) })} <button type="button" class="text-btn" data-act="prep">${t("sch.prepare")}</button></p>` : ""}
    </section>
    <div class="sch-foot">
    <div class="card sch-remind">
      <label class="check"><input type="checkbox" id="sch-remind" ${remind ? "checked" : ""}> <span><b>${t("sch.remindersOn")}</b><br><small class="muted">${t("sch.remindersSub")}</small></span></label>
    </div>
    <p class="muted sch-private">${icon("lock")} ${t("sch.private")}</p>
    ${s.lessons.length || s.events.length ? `<button type="button" class="ghost danger-text" data-act="clear">${icon("trash-2")} ${t("sch.clear")}</button>` : ""}
    </div>
    </div>
    <section class="sch-weekbox">
    <h2 class="sch-h">${t("sch.week")}</h2>
    ${gridHtml(s, days)}
    <div class="sch-list">${week}</div>
    ${s.source?.url ? `<p class="muted sch-linked">${icon("link")} ${t("sch.linked", { label: esc(s.source.label || new URL(s.source.url).hostname) })} <button type="button" class="text-btn" data-act="refresh">${t("sch.refresh")}</button></p>` : ""}
    </section>`;
  hydrateIcons?.(box());
  wire();
  // Paket pred testom (samo z računi in brez naročnine; strežnik odloči, ali ga ponudi).
  renderPassOffer(box().querySelector("#sch-pass"), { api: D.api, studentId: sid(), toast: D.toast });
}

function wire() {
  const b = box();
  b.querySelector('[data-act="lesson"]').addEventListener("click", () => lessonForm());
  b.querySelector('[data-act="event"]').addEventListener("click", () => eventForm());
  b.querySelector('[data-act="photo"]').addEventListener("click", () => b.querySelector("#sch-photo").click());
  b.querySelector("#sch-photo").addEventListener("change", (e) => readPhoto(e.target.files[0]));
  b.querySelector('[data-act="ics"]').addEventListener("click", () => icsPanel());
  b.querySelector('[data-act="refresh"]')?.addEventListener("click", refresh);
  b.querySelector('[data-act="prep"]')?.addEventListener("click", () => D.startSession("test-prep"));
  b.querySelector('[data-act="clear"]')?.addEventListener("click", async () => {
    if (!confirm(t("sch.confirmClear"))) return;
    data = await D.api(`/api/students/${sid()}/schedule`, { method: "DELETE" });
    D.onChange?.();
    showSchedule();
  });
  b.querySelectorAll("[data-add]").forEach((x) => x.addEventListener("click", () => lessonForm(null, JSON.parse(x.dataset.add))));
  b.querySelectorAll("[data-lesson]").forEach((x) => x.addEventListener("click", () => lessonForm(data.schedule.lessons.find((l) => l.id === x.dataset.lesson))));
  b.querySelectorAll("[data-event]").forEach((x) => x.addEventListener("click", () => eventForm(data.schedule.events.find((e) => e.id === x.dataset.event))));
  b.querySelector("#sch-remind").addEventListener("change", async (e) => {
    if (!e.target.checked) return ls.set(REMIND_KEY, "0");
    let perm = "Notification" in window ? Notification.permission : "denied";
    if (perm === "default") perm = await Notification.requestPermission().catch(() => "denied");
    ls.set(REMIND_KEY, "1");
    if (perm !== "granted") D.toast(t("sch.remindersDenied"), "info");
  });
}

function panel(html) {
  const p = box().querySelector("#sch-panel");
  p.innerHTML = html;
  hydrateIcons?.(p);
  p.scrollIntoView({ behavior: "smooth", block: "nearest" });
  return p;
}
const closePanel = () => (box().querySelector("#sch-panel").innerHTML = "");

// Predlogi za ime predmeta: šolski predmeti ali predmeti letnika na fakulteti.
function subjectList() {
  const st = D.getStudent().settings;
  if (data.courses?.length) return data.courses.map((c) => c.name);
  return schoolSubjectsFor(st.educational_track, st.curriculum_level, (st.school_system || "SI") !== "SI").map((k) => SUBJECT_NAMES[k]);
}
const datalist = () => `<datalist id="sch-subjects">${[...new Set([...subjectList(), ...data.schedule.lessons.map((l) => l.name)])].map((n) => `<option value="${esc(n)}">`).join("")}</datalist>`;

function lessonForm(l = null, at = {}) {
  const periods = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const p = panel(`<form class="card form sch-form" id="sch-lesson-form">
    <h2>${icon("calendar-clock")} ${t(l ? "sch.editLesson" : "sch.addLesson")}</h2>
    <label>${t("sch.subject")}<input name="name" list="sch-subjects" maxlength="60" required value="${esc(l?.name || "")}" autocomplete="off"></label>
    ${datalist()}
    <label>${t("sch.day")}<select name="day">${[1, 2, 3, 4, 5, 6, 7].map((d) => `<option value="${d}" ${(l?.day || at.day || data.schedule.now.day) === d ? "selected" : ""}>${esc(dayName(d))}</option>`).join("")}</select></label>
    <label>${t("sch.period")}<select name="period"><option value="">${t("sch.periodNone")}</option>${periods.map((n) => `<option value="${n}" ${(l ? l.period : at.period) === n ? "selected" : ""}>${t("sch.periodN", { n })}</option>`).join("")}</select></label>
    <div class="sch-times"><label>${t("sch.start")}<input type="time" name="start" value="${l?.start || at.start || BELLS[at.period]?.[0] || ""}"></label><label>${t("sch.end")}<input type="time" name="end" value="${l?.end || at.end || BELLS[at.period]?.[1] || ""}"></label></div>
    <label>${t("sch.room")}<input name="room" maxlength="30" value="${esc(l?.room || "")}"></label>
    <p class="muted sch-err" role="alert"></p>
    <div class="actions"><button class="primary">${t("common.save")}</button><button type="button" class="secondary" data-x>${t("cards.cancel")}</button>${l ? `<button type="button" class="ghost danger-text" data-del>${icon("trash-2")} ${t("cards.delete")}</button>` : ""}</div>
  </form>`);
  const f = p.querySelector("form");
  // Šolska ura izpolni čase po običajnem zvoncu (učenec jih lahko popravi).
  f.period.addEventListener("change", () => {
    const b = BELLS[f.period.value];
    if (b) [f.start.value, f.end.value] = b;
  });
  f.querySelector("[data-x]").addEventListener("click", closePanel);
  f.querySelector("[data-del]")?.addEventListener("click", async () => {
    await save({ lessons: data.schedule.lessons.filter((x) => x.id !== l.id) });
    render();
  });
  f.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!f.start.value && f.period.value === "") return (f.querySelector(".sch-err").textContent = t("sch.errTime"));
    const item = { id: l?.id, day: Number(f.day.value), period: f.period.value === "" ? null : Number(f.period.value), start: f.start.value, end: f.end.value, name: f.name.value.trim(), room: f.room.value.trim(), kind: l?.kind || "", group: l?.group || "", source: l?.source || "manual", key: l?.key };
    const rest = data.schedule.lessons.filter((x) => x.id !== l?.id);
    try {
      await save({ lessons: [...rest, item] });
      D.toast(t("sch.saved"), "check");
      render();
    } catch (err) {
      f.querySelector(".sch-err").textContent = err.message;
    }
  });
}

async function eventForm(ev = null) {
  const today = data.schedule.now.date;
  const p = panel(`<form class="card form sch-form" id="sch-event-form">
    <h2>${icon("clipboard-check")} ${t(ev ? "sch.editTest" : "sch.addTest")}</h2>
    <label>${t("sch.kindLabel")}<select name="kind">${KINDS.map((k) => `<option value="${k}" ${(ev?.kind || "test") === k ? "selected" : ""}>${t(`sch.kind.${k}`)}</option>`).join("")}</select></label>
    <label>${t("sch.subject")}<input name="subject" list="sch-subjects" maxlength="60" value="${esc(ev ? subjectOf(ev) : "")}" autocomplete="off"></label>
    ${datalist()}
    <div class="sch-times"><label>${t("sch.date")}<input type="date" name="date" min="${today}" value="${ev?.date || ""}" required></label><label>${t("sch.time")}<input type="time" name="time" value="${ev?.time || ""}"></label></div>
    <label>${t("sch.note")}<input name="note" maxlength="200" value="${esc(ev?.note || "")}" placeholder="${esc(t("sch.notePh"))}"></label>
    <div class="sch-units"></div>
    <p class="muted sch-err" role="alert"></p>
    <div class="actions"><button class="primary">${t("common.save")}</button><button type="button" class="secondary" data-x>${t("cards.cancel")}</button>${ev ? `<button type="button" class="ghost danger-text" data-del>${icon("trash-2")} ${t("cards.delete")}</button>` : ""}</div>
  </form>`);
  const f = p.querySelector("form");
  f.querySelector("[data-x]").addEventListener("click", closePanel);
  f.querySelector("[data-del]")?.addEventListener("click", async () => {
    await save({ events: data.schedule.events.filter((x) => x.id !== ev.id) });
    render();
  });
  // Sklopi učne poti (če ima predmet pot v aplikaciji): iz njih so vaje v Pripravi na test.
  if (ev?.path && TEST_KINDS.includes(ev.kind)) {
    const path = await D.api(`/api/students/${sid()}/path?key=${encodeURIComponent(ev.path)}`).catch(() => null);
    if (path?.units?.length) {
      const chosen = new Set(ev.units || []);
      f.querySelector(".sch-units").innerHTML = `<fieldset><legend>${t("sch.units")}</legend><div class="tp-units">${path.units
        .map((u, i) => (u.hasPractice ? `<label class="check"><input type="checkbox" name="unit" value="${i}" ${chosen.has(i) ? "checked" : ""}> ${esc(u.title)}</label>` : ""))
        .join("")}</div><small class="muted">${t("sch.unitsNote")}</small></fieldset>`;
    }
  }
  f.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!f.date.value) return (f.querySelector(".sch-err").textContent = t("sch.errDate"));
    const subject = f.subject.value.trim();
    const kindName = t(`sch.kind.${f.kind.value}`).split(" / ")[0];
    // Ime predmeta je nespremenjeno: ostaneta predmet aplikacije in (uvoženo) ime dogodka.
    const same = ev && subject === subjectOf(ev);
    const item = {
      id: ev?.id,
      date: f.date.value,
      time: f.time.value,
      kind: f.kind.value,
      name: same && !subject ? ev.name : subject ? `${kindName} – ${subject}` : kindName,
      subject_name: subject,
      note: f.note.value.trim(),
      units: [...f.querySelectorAll('input[name="unit"]:checked')].map((x) => Number(x.value)),
      source: ev?.source || "manual",
      ...(same ? { subject: ev.subject, course: ev.course } : {}),
    };
    const rest = data.schedule.events.filter((x) => x.id !== ev?.id);
    try {
      await save({ events: [...rest, item] });
      D.toast(t("sch.saved"), "check");
      const saved = data.schedule.events.find((x) => x.date === item.date && x.kind === item.kind && (x.id === ev?.id || !rest.some((r) => r.id === x.id)));
      // Nov test s predmetom iz aplikacije: takoj ponudi izbiro snovi.
      if (!ev && saved?.path && TEST_KINDS.includes(saved.kind)) {
        render();
        return eventForm(saved);
      }
      render();
    } catch (err) {
      f.querySelector(".sch-err").textContent = err.message;
    }
  });
}
// Ime predmeta, kot ga je vpisal učenec (»Test – Matematika« → »Matematika«).
function subjectOf(ev) {
  const m = String(ev.name).match(/ – (.+)$/);
  return m ? m[1] : "";
}

// ---------------------------------------------------------------------------
// Uvoz: fotografija, koledar .ics, urnik UL FMF

async function readPhoto(file) {
  if (!file || !file.type.startsWith("image/")) return;
  panel(`<div class="card"><p>${icon("camera")} ${t("sch.reading")}</p></div>`);
  try {
    const bitmap = await createImageBitmap(file);
    // Urnik ima drobno besedilo: večja slika kot pri nalogah (do 2000 px).
    const scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height));
    const c = document.createElement("canvas");
    c.width = Math.round(bitmap.width * scale);
    c.height = Math.round(bitmap.height * scale);
    c.getContext("2d").drawImage(bitmap, 0, 0, c.width, c.height);
    const out = await D.api(`/api/students/${sid()}/schedule/photo`, { method: "POST", body: { image: c.toDataURL("image/jpeg", 0.85) } });
    if (out.mock) return panel(`<div class="card"><p>${t("sch.mockPhoto")}</p></div>`);
    showPreview({ lessons: out.lessons, events: out.events, source: undefined });
  } catch (err) {
    panel(`<div class="card"><p class="muted">${esc(err.message)}</p></div>`);
  } finally {
    box().querySelector("#sch-photo").value = "";
  }
}

async function icsPanel() {
  const p = panel(`<div class="card form sch-form">
    <h2>${icon("calendar-days")} ${t("sch.import")}</h2>
    <div class="sch-fmf"></div>
    <label>${t("sch.icsUrl")}<div class="inline"><input name="url" inputmode="url" placeholder="https://… .ics"><button type="button" class="primary" data-url>${t("sch.load")}</button></div></label>
    <label>${t("sch.icsFile")}<input type="file" accept=".ics,text/calendar" data-file></label>
    <small class="muted">${t("sch.icsHelp")}</small>
    <p class="muted sch-err" role="alert"></p>
    <div class="actions"><button type="button" class="secondary" data-x>${t("cards.cancel")}</button></div>
  </div>`);
  const err = (m) => (p.querySelector(".sch-err").textContent = m);
  const go = async (body) => {
    err(t("common.loading"));
    try {
      const out = await D.api(`/api/students/${sid()}/schedule/ics`, { method: "POST", body });
      showPreview(out);
    } catch (e) {
      err(e.message);
    }
  };
  p.querySelector("[data-x]").addEventListener("click", closePanel);
  p.querySelector("[data-url]").addEventListener("click", () => go({ url: p.querySelector('[name="url"]').value }));
  p.querySelector("[data-file]").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (file) go({ text: await file.text() });
  });
  // Javni urnik UL FMF: izbira letnika (predlagan je letnik iz profila).
  const st = D.getStudent().settings;
  if (!jeFaks(st)) return;
  const src = await D.api(`/api/students/${sid()}/schedule/sources`).catch(() => null);
  const fmf = src?.sources?.[0];
  if (!fmf?.layers?.length) return;
  const isFmf = /UL-FMF/.test(st.study_program || "");
  p.querySelector(".sch-fmf").innerHTML = `<label>${t("sch.fmf")}<select name="layer"><option value="">${t("sch.fmfPick")}</option>${fmf.layers
    .map((l) => `<option value="${l.id}" ${isFmf && l.id === fmf.suggested ? "selected" : ""}>${esc(l.label)}</option>`)
    .join("")}</select></label><div class="actions"><button type="button" class="primary" data-fmf>${t("sch.load")}</button></div>`;
  p.querySelector("[data-fmf]").addEventListener("click", () => {
    const layer = fmf.layers.find((l) => String(l.id) === p.querySelector('[name="layer"]').value);
    if (layer) go({ url: layer.url, label: `UL FMF – ${layer.label}` });
  });
}

// Predogled uvoza: učenec odkljuka ure, ki niso njegove (druge skupine vaj, rezervirani termini).
function showPreview(out) {
  preview = out;
  const n = out.lessons.length + out.events.length;
  if (!n) return panel(`<div class="card"><p>${t("sch.nothingFound")}</p></div>`);
  const slot = (l) => /kolokvij|izpit/i.test(l.name);
  const lessons = out.lessons
    .map(
      (l, i) => `<label class="check"><input type="checkbox" data-l="${i}" ${slot(l) ? "" : "checked"}> <span><b>${esc(dayName(l.day, "short"))} ${l.start}–${l.end}</b> ${esc(l.name)}${lessonLabel(l) ? ` <small class="muted">${esc(lessonLabel(l))}</small>` : ""}</span></label>`,
    )
    .join("");
  const events = out.events
    .map((e, i) => `<label class="check"><input type="checkbox" data-e="${i}" checked> <span><b>${esc(fmtDate(e.date))}</b> ${esc(e.name)}</span></label>`)
    .join("");
  const groups = [...new Set(out.lessons.map((l) => l.group).filter(Boolean))].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const p = panel(`<div class="card sch-preview">
    <h2>${icon("list-checks")} ${t("sch.previewTitle")}</h2>
    <p class="muted">${t("sch.previewText")}</p>
    ${groups.length > 1 ? `<p class="sch-group-pick"><b>${t("sch.myGroup")}</b></p><div class="chip-row sch-groups">${groups.map((g) => `<button type="button" data-g="${esc(g)}">${esc(g)}</button>`).join("")}</div>` : ""}
    ${lessons ? `<h3>${t("sch.week")}</h3><div class="sch-checks">${lessons}</div>` : ""}
    ${events ? `<h3>${t("sch.upcoming")}</h3><div class="sch-checks">${events}</div>` : ""}
    ${lessons && data.schedule.lessons.length ? `<label class="check"><input type="checkbox" data-replace checked> ${t("sch.replace")}</label>` : ""}
    <div class="actions"><button type="button" class="primary" data-save>${t("common.save")}</button><button type="button" class="secondary" data-x>${t("cards.cancel")}</button></div>
  </div>`);
  p.querySelector("[data-x]").addEventListener("click", closePanel);
  // Izbira skupine vaj: ure drugih skupin se odkljukajo (ure brez skupine ostanejo).
  p.querySelectorAll("[data-g]").forEach((b) =>
    b.addEventListener("click", () => {
      p.querySelectorAll("[data-g]").forEach((x) => x.classList.toggle("active", x === b));
      out.lessons.forEach((l, i) => {
        if (l.group) p.querySelector(`[data-l="${i}"]`).checked = l.group === b.dataset.g;
      });
    }),
  );
  p.querySelector("[data-save]").addEventListener("click", async () => {
    const keepL = out.lessons.filter((_, i) => p.querySelector(`[data-l="${i}"]`).checked);
    const hidden = out.lessons.filter((_, i) => !p.querySelector(`[data-l="${i}"]`).checked).map((l) => l.key).filter(Boolean);
    const keepE = out.events.filter((_, i) => p.querySelector(`[data-e="${i}"]`).checked);
    const replace = p.querySelector("[data-replace]")?.checked ?? true;
    const cur = data.schedule;
    const seen = new Set(cur.events.map((e) => `${e.date}|${e.name}`));
    const body = {
      lessons: replace ? keepL : [...cur.lessons, ...keepL],
      events: [...cur.events, ...keepE.filter((e) => !seen.has(`${e.date}|${e.name}`))],
    };
    if (out.source !== undefined) body.source = out.source ? { ...out.source, hidden, at: new Date().toISOString() } : cur.source;
    await save(body);
    preview = null;
    D.toast(t("sch.saved"), "check");
    render();
  });
}

async function refresh() {
  try {
    data = await D.api(`/api/students/${sid()}/schedule/refresh`, { method: "POST" });
    D.onChange?.();
    D.toast(t("sch.saved"), "check");
    render();
  } catch (err) {
    D.toast(err.message, "info");
  }
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
        (e) => `<div class="sch-remind-row"><span class="ic">${icon("bell")}</span><div><b>${t(e.daysLeft === 0 ? "sch.remindToday" : "sch.remindTomorrow", { name: esc(e.name) })}${e.time ? ` · ${e.time}` : ""}</b><p class="muted">${t("sch.remindText")}</p></div>${e.path && TEST_KINDS.includes(e.kind) ? `<button type="button" class="primary" data-prep>${t("sch.prepare")}</button>` : ""}</div>`,
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
    const opts = { body: t("sch.notifyBody"), icon: "/icons/icon-192.png?v=kristal", tag: `sch-${e.id}` };
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

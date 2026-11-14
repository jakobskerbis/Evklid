// Urnik učenca: ure v tednu (dan, čas, predmet, učilnica) in datumi testov, kolokvijev in izpitov.
// Vnos: ročno, s fotografijo urnika (model prebere, učenec potrdi), iz koledarja .ics ali iz javnega
// urnika fakultete (UL FMF ima izvoz .ics za cel semester).
// Uporaba: »Danes imaš …« na Učni poti, kratka ponovitev pred uro in po njej, Priprava na test se
// nastavi sama iz najbližjega testa, opomnik dan prej, inštruktor ve, kaj ima učenec ta teden.
// Urnik je zaseben: vidi ga samo učenec (in starš na njegovi napravi), nikoli lige ali učitelj.
import "./env.js";
import crypto from "node:crypto";
import { prenesiJavno, privateIp, readLimited } from "./prenos-uporabnik.js";
import { cleanText, normalizeSettings } from "./settings.js";
import { PROGRAMS, UNI_PATHS } from "./university-data.js";
import { ALL_SUBJECTS } from "./subjects.js";
import { getPath, pathKeyFor } from "./curriculum.js";
import { getClient, isMockMode, MODEL_DEEP, MODEL_MID, quickParams } from "./claude.js";
import { EVENT_KINDS } from "../public/settings-registry.js";
import { seal, unseal } from "./crypto-polje.js";
import { jeFaks } from "../public/stopnja.js";

export { EVENT_KINDS };
export const TEST_KINDS = ["test", "kolokvij", "izpit", "ustno"];
export const LIMITS = { lessons: 120, events: 150 };
// Običajen zvonec slovenske šole (ura → začetek, konec). Ure na fotografiji brez časov dobijo te čase.
export const BELLS = {
  0: ["07:30", "08:15"],
  1: ["08:20", "09:05"],
  2: ["09:10", "09:55"],
  3: ["10:15", "11:00"],
  4: ["11:05", "11:50"],
  5: ["11:55", "12:40"],
  6: ["12:45", "13:30"],
  7: ["13:35", "14:20"],
  8: ["14:25", "15:10"],
};

const norm = (s) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
const newId = () => crypto.randomBytes(5).toString("hex");
const pad2 = (n) => String(n).padStart(2, "0");

export function cleanTime(v) {
  const m = String(v ?? "").trim().match(/^(\d{1,2})[:.](\d{2})$/);
  if (!m) return null;
  const h = Number(m[1]), min = Number(m[2]);
  return h < 24 && min < 60 ? `${pad2(h)}:${pad2(min)}` : null;
}
const minutes = (hhmm) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3));
const fromMinutes = (m) => `${pad2(Math.floor(m / 60) % 24)}:${pad2(m % 60)}`;
export function cleanDate(v) {
  const s = String(v ?? "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const d = new Date(`${s}T12:00:00Z`);
  return !isNaN(d) && d.toISOString().slice(0, 10) === s ? s : null;
}

// ---------------------------------------------------------------------------
// Predmet iz imena ure: šolski predmet (MAT, FIZ …) ali predmet iz predmetnika fakultete.

const SCHOOL_WORDS = [
  ["MAT", /^(mat\b|matemat|math)/],
  ["FIZ", /^(fiz\b|fizik|physic)/],
  ["KEM", /^(kem\b|kemij|chemi)/],
  ["NAR", /^(nar\b|naravoslov|science)/],
  ["BIO", /^(bio\b|biolog)/],
  ["GEO", /^(geo\b|geograf)/],
  ["RAC", /^(rac\b|racunal|informatik|ina\b|inf\b|computer|computing)/],
  ["EKO", /^(eko\b|ekonom|economic)/],
];

function programCourses(settings) {
  const p = PROGRAMS[settings.study_program];
  if (!p) return [];
  return [...p.courseKeys.flat(), ...(p.electiveKeys || [])]
    .filter((k) => UNI_PATHS[k])
    .map((k) => ({ key: k, name: UNI_PATHS[k].label.replace(/ \([^)]*\)$/, ""), subject: UNI_PATHS[k].subject }));
}

// Vrne { subject, course } ali prazen objekt, če predmet ni iz aplikacije (npr. športna vzgoja).
export function matchSubject(name, settings) {
  const n = norm(name);
  if (!n) return {};
  if (jeFaks(settings)) {
    const courses = programCourses(settings);
    const hit =
      courses.find((c) => norm(c.name) === n) ||
      courses.find((c) => norm(c.name).length >= 4 && (n.startsWith(norm(c.name) + " ") || norm(c.name).startsWith(n + " ")));
    if (hit) return { course: hit.key, subject: ALL_SUBJECTS.includes(hit.subject) ? hit.subject : null };
  }
  const s = SCHOOL_WORDS.find(([, re]) => re.test(n));
  return s ? { subject: s[0] } : {};
}

// Učna pot za uro ali test (ključ poti) ali null.
export function pathFor(item, settings) {
  if (item.course && getPath(item.course)) return item.course;
  if (!item.subject) return null;
  if (jeFaks(settings)) {
    const c = programCourses(settings).find((x) => x.subject === item.subject);
    return c && getPath(c.key) ? c.key : null;
  }
  const s = normalizeSettings({ ...settings, subject: item.subject });
  // V 6. in 7. razredu OŠ so fizika, kemija in biologija del naravoslovja; drugih predmetov šola nima.
  if (s.subject !== item.subject && !(s.subject === "NAR" && ["FIZ", "KEM", "BIO"].includes(item.subject))) return null;
  const key = pathKeyFor(s);
  return key && getPath(key) ? key : null;
}

// ---------------------------------------------------------------------------
// Preverjanje vnosov

export function normalizeLesson(l, settings) {
  if (!l || typeof l !== "object") return null;
  const day = Number(l.day);
  if (!Number.isInteger(day) || day < 1 || day > 7) return null;
  const period = Number.isInteger(Number(l.period)) && BELLS[Number(l.period)] && l.period !== "" && l.period !== null ? Number(l.period) : null;
  let start = cleanTime(l.start) || (period !== null ? BELLS[period][0] : null);
  if (!start) return null;
  let end = cleanTime(l.end) || (period !== null ? BELLS[period][1] : null);
  if (!end || minutes(end) <= minutes(start)) end = fromMinutes(minutes(start) + 45);
  const name = cleanText(String(l.name ?? ""), 60);
  if (!name) return null;
  const out = {
    id: /^[a-z0-9]{4,16}$/.test(String(l.id || "")) ? String(l.id) : newId(),
    day,
    start,
    end,
    name,
    room: cleanText(String(l.room ?? ""), 30),
    kind: cleanText(String(l.kind ?? ""), 20),
    group: cleanText(String(l.group ?? ""), 12),
    source: ["manual", "photo", "ics"].includes(l.source) ? l.source : "manual",
  };
  if (period !== null) out.period = period;
  const subject = ALL_SUBJECTS.includes(l.subject) ? l.subject : null;
  const course = typeof l.course === "string" && UNI_PATHS[l.course] ? l.course : null;
  const auto = subject || course ? {} : matchSubject(name, settings);
  out.subject = subject || auto.subject || (course ? UNI_PATHS[course].subject : null) || null;
  out.course = course || auto.course || null;
  if (l.key) out.key = cleanText(String(l.key), 120);
  return out;
}

export function normalizeEvent(e, settings) {
  if (!e || typeof e !== "object") return null;
  const date = cleanDate(e.date);
  if (!date) return null;
  const kind = EVENT_KINDS.includes(e.kind) ? e.kind : guessKind(e.name) || "test";
  const subject = ALL_SUBJECTS.includes(e.subject) ? e.subject : null;
  const course = typeof e.course === "string" && UNI_PATHS[e.course] ? e.course : null;
  const subjectName = cleanText(String(e.subject_name ?? ""), 60);
  const name = cleanText(String(e.name ?? ""), 80) || subjectName || kind;
  const auto = subject || course ? {} : matchSubject(subjectName || stripKindWords(name), settings);
  const units = Array.isArray(e.units) ? [...new Set(e.units.map(Number))].filter((i) => Number.isInteger(i) && i >= 0 && i < 60).slice(0, 30) : [];
  return {
    id: /^[a-z0-9]{4,16}$/.test(String(e.id || "")) ? String(e.id) : newId(),
    date,
    time: cleanTime(e.time) || "",
    kind,
    name,
    subject: subject || auto.subject || (course ? UNI_PATHS[course].subject : null) || null,
    course: course || auto.course || null,
    units,
    note: cleanText(String(e.note ?? ""), 200),
    source: ["manual", "photo", "ics", "chat"].includes(e.source) ? e.source : "manual",
  };
}

const KIND_WORDS = [
  ["izpit", /izpit|exam\b|final/],
  ["kolokvij", /kolokvij|midterm/],
  ["ustno", /ustno|sprasevanj|oral/],
  ["naloga", /domac\w* nalog|oddaj|homework|seminarsk/],
  ["test", /test|kontroln|preizkus|pisno|quiz|kviz/],
];
export function guessKind(text) {
  const n = norm(text);
  return KIND_WORDS.find(([, re]) => re.test(n))?.[0] || null;
}
function stripKindWords(text) {
  return String(text || "")
    .replace(/\b\d+\.\s*/g, "")
    .replace(/\b(kolokvij\w*|izpit\w*|kontroln\w* nalog\w*|test\w*|preizkus\w* znanja|ustno sprašev\w*|iz|pri)\b/gi, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function normalizeSchedule(input = {}, settings) {
  const lessons = (Array.isArray(input.lessons) ? input.lessons : []).map((l) => normalizeLesson(l, settings)).filter(Boolean).slice(0, LIMITS.lessons);
  lessons.sort((a, b) => a.day - b.day || a.start.localeCompare(b.start));
  const events = (Array.isArray(input.events) ? input.events : []).map((e) => normalizeEvent(e, settings)).filter(Boolean);
  events.sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  const src = input.source && typeof input.source === "object" ? input.source : null;
  const source =
    src && /^https:\/\//.test(String(src.url || ""))
      ? {
          url: String(src.url).slice(0, 500),
          label: cleanText(String(src.label || ""), 80),
          hidden: (Array.isArray(src.hidden) ? src.hidden : []).map((k) => cleanText(String(k), 120)).filter(Boolean).slice(0, 200),
          at: cleanText(String(src.at || ""), 30),
        }
      : null;
  return { lessons, events: events.slice(-LIMITS.events), source };
}

// ---------------------------------------------------------------------------
// Koledar .ics (iCalendar)

function unescapeIcs(s) {
  return s.replace(/\\([\\,;nN])/g, (_, c) => (c === "n" || c === "N" ? "\n" : c));
}

const WEEKDAY = { MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6, SU: 7 };
const ZONE = "Europe/Ljubljana";
const localParts = new Intl.DateTimeFormat("en-GB", { timeZone: ZONE, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });

// Vrednost DTSTART/DTEND → { date: 'YYYY-MM-DD', time: 'HH:MM' | '' } v slovenskem času.
function icsTime(value) {
  const m = String(value || "").match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?(Z)?)?$/);
  if (!m) return null;
  if (!m[4]) return { date: `${m[1]}-${m[2]}-${m[3]}`, time: "" };
  if (m[7]) {
    const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]));
    const p = Object.fromEntries(localParts.formatToParts(d).map((x) => [x.type, x.value]));
    return { date: `${p.year}-${p.month}-${p.day}`, time: `${p.hour}:${p.minute}` };
  }
  return { date: `${m[1]}-${m[2]}-${m[3]}`, time: `${m[4]}:${m[5]}` };
}
const weekdayOf = (date) => ((new Date(`${date}T12:00:00Z`).getUTCDay() + 6) % 7) + 1;

// Ime ure v slogu FMF: »Analiza 1 (MAT-1, PM-1), Predavanja (P), [2]« → ime, vrsta, skupina.
export function splitSummary(summary) {
  const parts = String(summary || "").split(/,\s*(?![^()[\]]*[)\]])/).map((x) => x.trim()).filter(Boolean);
  let name = parts[0] || "";
  // Kode letnikov v oklepaju na koncu (»(MAT-1, PM-1)«) niso del imena.
  name = name.replace(/\s*\((?=[^)]*[A-ZČŠŽ]{2,}-?\d)[^)]*\)\s*$/, "").trim();
  let kind = "", group = "";
  for (const p of parts.slice(1)) {
    const g = p.match(/^\[(\w{1,4})\]$/);
    if (g) group = g[1];
    else if (/^(predavanja|vaje|seminar|laboratorij|lab|tutorial|lecture|ostalo)/i.test(p)) kind = p.replace(/\s*\(\w+\)$/, "");
  }
  return { name, kind, group };
}

export function parseIcs(text, settings) {
  const src = String(text || "").replace(/\r\n?/g, "\n").replace(/\n[ \t]/g, "");
  if (!/BEGIN:VCALENDAR/.test(src)) return null;
  const raw = [];
  for (const block of src.split("BEGIN:VEVENT").slice(1)) {
    const body = block.split("END:VEVENT")[0];
    const props = {};
    for (const line of body.split("\n")) {
      const m = line.match(/^([A-Z-]+)((?:;[^:]*)?):(.*)$/);
      if (m && props[m[1]] === undefined) props[m[1]] = { params: m[2], value: m[3] };
    }
    const start = icsTime(props.DTSTART?.value);
    if (!start || !props.SUMMARY) continue;
    const end = icsTime(props.DTEND?.value);
    const summary = unescapeIcs(props.SUMMARY.value).trim();
    const desc = props.DESCRIPTION ? unescapeIcs(props.DESCRIPTION.value) : "";
    const room = (props.LOCATION ? unescapeIcs(props.LOCATION.value) : desc.match(/Prostor:\s*([^\n]+)/)?.[1] || "").trim();
    raw.push({ summary, start, end, room, rrule: props.RRULE?.value || "" });
  }
  const lessons = [];
  const events = [];
  // Ponavljajoče se ure (RRULE) gredo naravnost v teden.
  const groups = new Map();
  for (const r of raw) {
    const { name, kind, group } = splitSummary(r.summary);
    if (!name) continue;
    const timed = r.start.time && r.end?.time;
    if (r.rrule && /FREQ=WEEKLY/.test(r.rrule) && timed) {
      const days = (r.rrule.match(/BYDAY=([A-Z,]+)/)?.[1] || "").split(",").map((d) => WEEKDAY[d]).filter(Boolean);
      for (const day of days.length ? days : [weekdayOf(r.start.date)]) lessons.push({ day, start: r.start.time, end: r.end.time, name, kind, group, room: r.room });
      continue;
    }
    const k = [name, kind, group, timed ? weekdayOf(r.start.date) : "", r.start.time, r.end?.time || ""].join("|");
    if (!groups.has(k)) groups.set(k, { name, kind, group, room: r.room, items: [] });
    groups.get(k).items.push(r);
  }
  const dates = raw.map((r) => r.start.date).sort();
  const spanDays = dates.length ? (Date.parse(dates[dates.length - 1]) - Date.parse(dates[0])) / 86400000 : 0;
  const minRepeat = spanDays < 8 ? 1 : 2;
  for (const g of groups.values()) {
    const first = g.items[0];
    const testLike = guessKind(g.name + " " + first.summary);
    const timed = first.start.time && first.end?.time;
    if (testLike && g.items.length <= 2 && TEST_KINDS.concat("naloga").includes(testLike)) {
      for (const r of g.items) events.push({ date: r.start.date, time: r.start.time, kind: testLike, name: r.summary.replace(/\s*\((?=[^)]*[A-ZČŠŽ]{2,}-?\d)[^)]*\)/, "").slice(0, 80), subject_name: stripKindWords(g.name), source: "ics" });
      continue;
    }
    if (timed && g.items.length >= minRepeat) {
      lessons.push({ day: weekdayOf(first.start.date), start: first.start.time, end: first.end.time, name: g.name, kind: g.kind, group: g.group, room: g.room });
    }
  }
  const keyed = lessons.map((l) => ({ ...l, source: "ics", key: [l.name, l.kind, l.group, l.day, l.start].join("|") }));
  const uniq = [...new Map(keyed.map((l) => [l.key, l])).values()];
  return normalizeSchedule({ lessons: uniq, events }, settings);
}

// Naslov koledarja je od učenca: samo https (webcal → https), javni naslovi, največ 3 MB in 15 s.
// Preverjanje naslova in prenos sta v server/prenos-uporabnik.js (točka A4); privateIp in readLimited ostaneta izvožena tu.
export const ICS_MAX_BYTES = 3 * 1024 * 1024;
export { privateIp, readLimited };

export function cleanIcsUrl(url) {
  let s = String(url || "").trim().replace(/^webcals?:\/\//i, "https://");
  let u;
  try {
    u = new URL(s);
  } catch {
    return null;
  }
  if (u.protocol !== "https:" || u.username || u.password || (u.port && u.port !== "443")) return null;
  if (/^(localhost|.*\.local|.*\.internal)$/i.test(u.hostname)) return null;
  // FMF: navaden naslov letnika (/layer_one/32/) → izvoz celega semestra.
  if (/(^|\.)urnik\.fmf\.uni-lj\.si$/.test(u.hostname) && /\/layer_one\/\d+\/?/.test(u.pathname) && !u.searchParams.has("export")) {
    u.searchParams.delete("day");
    u.searchParams.set("export", "1");
  }
  return u.toString();
}

// fetchFn samo za teste; brez njega gre prenos prek prenesiJavno s preverjanjem naslova ob povezovanju (točka A4).
const ICS_NAPAKE = {
  NASLOV: "Povezava mora biti javni naslov https (ali webcal) do koledarja.",
  NI_NASLOVA: "Koledarja na tej povezavi ni mogoče najti.",
  ZASEBNI: "Ta naslov ni javen.",
  PREVELIK: "Koledar je prevelik.",
};
export async function fetchIcs(url, { fetchFn = null, lookup } = {}) {
  const clean = cleanIcsUrl(url);
  if (!clean) throw new Error(ICS_NAPAKE.NASLOV);
  try {
    const text = await prenesiJavno(clean, { max: ICS_MAX_BYTES, timeoutMs: 15000, headers: { Accept: "text/calendar, text/plain;q=0.5" }, ...(lookup ? { lookup } : {}), fetchFn });
    return { url: clean, text };
  } catch (err) {
    if (err?.code === "STATUS" && err.status) throw new Error(`Koledarja ni bilo mogoče prenesti (${err.status}).`);
    throw new Error(ICS_NAPAKE[err?.code] || "Koledarja ni bilo mogoče prenesti.");
  }
}

// ---------------------------------------------------------------------------
// Javni urniki fakultet: UL FMF (urnik.fmf.uni-lj.si). Seznam letnikov se prebere s strani,
// spodnji seznam velja, kadar strani ni mogoče doseči (stanje zimski semester 2026/27).

const FMF_BASE = "https://urnik.fmf.uni-lj.si";
const FMF_FALLBACK = [
  [32, "1. letnik (M) (MAT-1)"], [35, "2. letnik (M) (MAT-2)"], [37, "3. letnik (M) (MAT-3)"], [40, "magistrski študij (M) (MAT-M)"],
  [33, "1. letnik (PM) (PM-1)"], [51, "2. letnik (PM) (PM-2)"], [27, "3. letnik (PM) (PM-3)"], [36, "4. letnik (PM) (PM-4)"], [39, "5. letnik (PM) (PM-5)"],
  [48, "1. letnik (FM) (FM-1)"], [46, "2. letnik (FM) (FM-2)"], [34, "3. letnik (FM) (FM-3)"], [38, "magistrski študij (FM) (FM-M)"],
  [42, "1. letnik (IŠRM) (IŠRM-1)"], [49, "2. letnik (IŠRM) (IŠRM-2)"], [55, "3. letnik (IŠRM) (IŠRM-3)"], [52, "magistrski študij (IŠRM) (IŠRM-M)"],
  [8, "1. letnik (Fizika, 1. stopnja) (FIZ-1)"], [3, "2. letnik (Fizika, 1. stopnja) (FIZ-2)"], [11, "3. letnik (Fizika, 1. stopnja) (FIZ-3)"],
  [12, "1. letnik (Fizika, 2. stopnja) (FIZ-M1)"], [14, "2. letnik (Fizika, 2. stopnja) (FIZ-M2)"],
];
// Program aplikacije → oznaka letnika na FMF (za predlog pravega letnika).
const FMF_PROGRAM = { "UL-FMF-MAT": "MAT", "UL-FMF-FIMA": "FM", "UL-FMF-FIZ": "FIZ", "UL-FMF-RM": "IŠRM" };

let fmfCache = null;
export function parseFmfLayers(html) {
  const out = [];
  for (const m of String(html).matchAll(/"Letnik: ([^"]{3,120})": "\/layer_one\/(\d+)\/"/g)) out.push({ id: Number(m[2]), label: m[1].replace(/&#x27;|&#39;/g, "'") });
  return out;
}
export async function scheduleSources({ fetchFn = fetch, settings = null } = {}) {
  if (!fmfCache || Date.now() - fmfCache.at > 24 * 3600 * 1000) {
    let layers = [];
    try {
      const res = await fetchFn(`${FMF_BASE}/`, { signal: AbortSignal.timeout(8000) });
      if (res.ok) layers = parseFmfLayers(await res.text());
    } catch {}
    if (layers.length) fmfCache = { at: Date.now(), layers };
    else if (!fmfCache) fmfCache = { at: Date.now() - 23 * 3600 * 1000, layers: FMF_FALLBACK.map(([id, label]) => ({ id, label })) };
  }
  const layers = fmfCache.layers.map((l) => ({ ...l, url: `${FMF_BASE}/layer_one/${l.id}/?export=1` }));
  let suggested = null;
  if (jeFaks(settings) && FMF_PROGRAM[settings.study_program]) {
    const code = FMF_PROGRAM[settings.study_program];
    const year = Number((String(settings.curriculum_level).match(/([1-5])/) || [])[1]) || 1;
    suggested = layers.find((l) => l.label.endsWith(`(${code}-${year})`))?.id ?? null;
  }
  return [{ id: "UL-FMF", name: "UL FMF – Fakulteta za matematiko in fiziko", layers, suggested }];
}

// ---------------------------------------------------------------------------
// Fotografija urnika: model prebere ure in teste, učenec jih pred shranjevanjem preveri.

// Natančnost je tu pomembnejša od cene (urnik se prebere enkrat na semester), zato zmogljivejši model.
// capped: aktivacijska koda dovoli največ Sonnet (j 2026-10-30), zato tam MODEL_MID namesto Opusa.
export const photoModel = (capped = false) => (capped ? MODEL_MID : process.env.EVKLID_SCHEDULE_MODEL || MODEL_DEEP);

export async function readTimetablePhoto({ imageBase64, mediaType = "image/jpeg", today = new Date().toISOString().slice(0, 10), capped = false }) {
  const model = photoModel(capped);
  if (isMockMode()) return { mock: true, lessons: [], events: [], usage: null, model };
  const final = await getClient().messages.create({
    model,
    max_tokens: 6000,
    ...quickParams(model),
    messages: [
      {
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: imageBase64 } },
          {
            type: "text",
            text:
              `The image shows a student's school or university timetable (Slovenia, today is ${today}), or a list of test dates. Read it exactly; do not invent anything.\n` +
              "Return only JSON: {\"lessons\":[{\"day\":1-7 (1 = Monday),\"period\":school period number or null,\"start\":\"HH:MM\" or null,\"end\":\"HH:MM\" or null,\"name\":\"subject as written, abbreviations expanded if obvious (MAT → Matematika)\",\"room\":\"\",\"kind\":\"Predavanja|Vaje|Seminar|\",\"group\":\"\"}],\"events\":[{\"date\":\"YYYY-MM-DD\",\"time\":\"HH:MM\" or \"\",\"kind\":\"test|kolokvij|izpit|ustno|naloga|drugo\",\"name\":\"e.g. Kontrolna naloga iz matematike\"}]}\n" +
              "One entry per lesson per day (a double lesson = two periods = two entries, or one entry with the full time span). Use times printed on the timetable; if only period numbers are shown, give period and leave times null. Dates without a year are in the current school year. Empty lists if nothing is readable.",
          },
        ],
      },
    ],
  });
  const raw = final.content.filter((b) => b.type === "text").map((b) => b.text).join("");
  let data = {};
  try {
    data = JSON.parse(raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1));
  } catch {}
  const lessons = (Array.isArray(data.lessons) ? data.lessons : []).map((l) => ({ ...l, source: "photo" }));
  const events = (Array.isArray(data.events) ? data.events : []).map((e) => ({ ...e, source: "photo" }));
  return { lessons, events, usage: final.usage, model: final.model || model };
}

// ---------------------------------------------------------------------------
// Shramba in pogled

export class Schedules {
  constructor(db) {
    this.db = db;
    db.exec(`CREATE TABLE IF NOT EXISTS schedules (
      student_id INTEGER PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
      data TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`);
  }
  get(studentId) {
    const r = this.db.prepare("SELECT data FROM schedules WHERE student_id = ?").get(studentId);
    if (!r) return { lessons: [], events: [], source: null };
    try {
      const d = JSON.parse(unseal(r.data)); // šifrirano (server/crypto-polje.js)
      return { lessons: d.lessons || [], events: d.events || [], source: d.source || null };
    } catch {
      return { lessons: [], events: [], source: null };
    }
  }
  save(studentId, data, settings) {
    const clean = normalizeSchedule(data, settings);
    // Stari dogodki (več kot 60 dni) odpadejo.
    const cut = new Date(Date.now() - 60 * 86400000).toISOString().slice(0, 10);
    clean.events = clean.events.filter((e) => e.date >= cut);
    this.db
      .prepare(
        `INSERT INTO schedules (student_id, data) VALUES (?, ?)
         ON CONFLICT(student_id) DO UPDATE SET data = excluded.data, updated_at = datetime('now')`,
      )
      .run(studentId, seal(JSON.stringify(clean)));
    return clean;
  }
  clear(studentId) {
    this.db.prepare("DELETE FROM schedules WHERE student_id = ?").run(studentId);
  }
}

// Lokalni čas strežnika (aplikacija teče v Sloveniji); za teste se da podati.
export function nowParts(now = new Date()) {
  const p = Object.fromEntries(localParts.formatToParts(now).map((x) => [x.type, x.value]));
  const date = `${p.year}-${p.month}-${p.day}`;
  return { date, time: `${p.hour}:${p.minute}`, day: weekdayOf(date) };
}
const addDays = (date, n) => new Date(Date.parse(`${date}T12:00:00Z`) + n * 86400000).toISOString().slice(0, 10);
const daysBetween = (a, b) => Math.round((Date.parse(`${b}T12:00:00Z`) - Date.parse(`${a}T12:00:00Z`)) / 86400000);

export function scheduleView(data, settings, now = new Date()) {
  const n = nowParts(now);
  const lessons = data.lessons.map((l) => ({ ...l, path: pathFor(l, settings) }));
  const events = data.events.map((e) => ({ ...e, path: pathFor(e, settings), daysLeft: daysBetween(n.date, e.date) }));
  const upcoming = events.filter((e) => e.daysLeft >= 0);
  const dayLessons = (d) => lessons.filter((l) => l.day === d);
  const tomorrow = (n.day % 7) + 1;
  return {
    lessons,
    events,
    source: data.source,
    now: n,
    today: dayLessons(n.day),
    tomorrow: dayLessons(tomorrow),
    upcoming: upcoming.slice(0, 8),
    // Opomnik: test danes ali jutri.
    reminders: upcoming.filter((e) => e.daysLeft <= 1),
  };
}

// Kratek opis za sistemski prompt (pod črto predpomnjenja): danes, jutri in testi v 30 dneh.
const DAY_NAMES = ["", "ponedeljek", "torek", "sreda", "četrtek", "petek", "sobota", "nedelja"];
export function schedulePrompt(view) {
  if (!view || (!view.lessons.length && !view.events.length)) return "(učenec urnika ni vnesel; lahko ga doda v aplikaciji: Jaz → Urnik ali tukaj v pogovoru)";
  const fmt = (list) => (list.length ? list.map((l) => `${l.start} ${l.name}${l.kind ? ` (${l.kind})` : ""}`).join(", ") : "nič");
  const tests = view.upcoming
    .filter((e) => e.daysLeft <= 30)
    .slice(0, 5)
    .map((e) => `${e.date} (${e.daysLeft === 0 ? "danes" : e.daysLeft === 1 ? "jutri" : `čez ${e.daysLeft} dni`}) ${e.kind}: ${e.name}`);
  return `danes je ${DAY_NAMES[view.now.day]} ${view.now.date}, ura ${view.now.time}; danes: ${fmt(view.today)}; jutri: ${fmt(view.tomorrow)}; testi in roki: ${tests.length ? tests.join("; ") : "ni vnesenih"}`;
}

// Enote za test brez izbranih sklopov: zadnja dva sklopa, ki jih je učenec že začel, sicer prvi, ki ni »naprej«.
function defaultUnits(view) {
  if (!view) return [];
  const idx = view.units.map((u, i) => ({ u, i })).filter(({ u }) => u.topics.some((t) => t.practice));
  const started = idx.filter(({ u }) => u.topics.some((t) => t.status === "learning" || t.status === "mastered"));
  if (started.length) return started.slice(-2).map(({ i }) => i);
  const open = idx.find(({ u }) => !u.ahead);
  return open ? [open.i] : [];
}

// Priprava na test sledi najbližjemu testu iz urnika, dokler je učenec ne nastavi sam.
export function syncTestPlan(progress, studentId, view) {
  const plan = progress.testPlan(studentId);
  const auto = !plan || plan.daysLeft < 0 || plan.eventId;
  if (!auto) return plan;
  const next = view.upcoming.find((e) => TEST_KINDS.includes(e.kind) && e.path && e.daysLeft <= 30);
  if (!next) {
    // Test iz urnika je izbrisan ali mimo: tudi priprava nanj odpade.
    if (plan?.eventId) {
      progress.clearTestPlan(studentId);
      return null;
    }
    return plan;
  }
  if (plan && plan.eventId === next.id && plan.date === next.date && plan.path === next.path && (!next.units.length || plan.units.join() === next.units.join())) return plan;
  const units = next.units.length ? next.units : defaultUnits(progress.pathView(studentId, next.path));
  return progress.setTestPlan(studentId, next.path, units, next.date, next.id) || plan;
}

// Uvoz (fotografija, .ics) k obstoječemu urniku: ure zamenja ali doda, dogodke doda brez podvojenih.
export function mergeImport(cur, incoming, { replaceLessons = true } = {}) {
  const lessons = replaceLessons ? incoming.lessons : [...cur.lessons, ...incoming.lessons];
  const seen = new Set(cur.events.map((e) => `${e.date}|${norm(e.name)}`));
  const events = [...cur.events, ...incoming.events.filter((e) => !seen.has(`${e.date}|${norm(e.name)}`))];
  return { lessons, events, source: incoming.source !== undefined ? incoming.source : cur.source };
}

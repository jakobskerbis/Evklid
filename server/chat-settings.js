// Inštruktor spreminja nastavitve iz klepeta: orodji za model (get_settings, change_settings),
// preverjanje vrednosti in uporaba. Seznam nastavitev je v public/settings-registry.js.
//
// - Profil (šola, razred/letnik, program, predmet, način, ton, jezik …) shrani strežnik.
// - Šola, razred/letnik, program in šolski sistem zamenjajo učno pot: najprej predlog, ki ga učenec
//   potrdi z gumbom ali z »da« (model nato pokliče orodje s confirmed=true).
// - Nastavitve naprave (videz, hitrost izpisa, kalkulator, igre …) uporabi odjemalec (dogodek device_settings).
// - Finančnih in osebnih podatkov orodji ne poznata (ne bereta in ne spreminjata).
import { PROGRAMS, UNI_PATHS, FACULTIES, UNIVERSITIES } from "./university-data.js";
import { normalizeSettings, courseKeysFor, cleanText, normalizeWeaknessList } from "./settings.js";
import { LANGUAGE_CODES, langInfo } from "../public/i18n/languages.js";
import { SCHOOL_SYSTEMS, SYSTEM_IDS, isRegional, gradesOf } from "../public/regions.js";
import { PROFILE_SETTINGS, DEVICE_SETTINGS, SCHEDULE_SETTINGS, EVENT_KINDS, deviceValue } from "../public/settings-registry.js";
import { scheduleView } from "./schedule.js";
import { goalsFor, validDate, DEFAULT_GOAL } from "../public/goal-data.js";
import { Avatars } from "./avatar.js";
import { ITEMS, SLOTS, MULTI_MAX, isMulti, itemOf, wear } from "../public/avatar.js";
import { INTERESTS, cleanInterests } from "../public/interests.js";
import { GENRE_IDS, cleanChildhood, cleanTitles } from "../public/games/childhood.js";
import { dialectsFor } from "../public/dialects.js";
import { jeSs, jeFaks, stopnja, imaStopnjo } from "../public/stopnja.js";

// Deli aplikacije, ki jih inštruktor odpre v premičnem oknu (public/okna.js), in načini kalkulatorja.
// »uci« je zavihek »Uči se« (zadnji uporabljeni od treh); textbook, lab in 3d odprejo njegov zavihek (public/uci-se.js).
export const WINDOW_VIEWS = ["graph", "uci", "textbook", "lab", "3d", "path", "scan", "schedule", "corner", "progress", "games", "competition", "exams", "league", "settings"];
export const CALC_MODES = ["sci", "graph", "tools", "pse", "formulas"];

const PATH_KEYS = Object.keys(PROFILE_SETTINGS).filter((k) => PROFILE_SETTINGS[k].confirm);
const PENDING_MS = 30 * 60 * 1000;

// ---------------------------------------------------------------------------
// Opis orodij za model. Stalen (enak za vse učence), da ostane v predpomnilniku skupaj s promptom.

function schemaFor(def, extra = {}) {
  if (def.list) return { type: "array", items: { type: "string" }, description: def.desc };
  if (def.object) return { type: "object", additionalProperties: { type: "string" }, description: def.desc };
  return { type: "string", ...(def.values ? { enum: def.values } : {}), description: def.desc, ...extra };
}

export const SETTINGS_TOOLS = [
  {
    name: "get_settings",
    description:
      "Read the student's current app settings (profile and this device). Optionally list allowed values for study_program, study_course, school_system or dialect. Financial and personal data are not available.",
    input_schema: {
      type: "object",
      properties: { options: { type: "string", enum: ["study_program", "study_course", "school_system", "dialect"], description: "list allowed values of this setting" } },
      additionalProperties: false,
    },
  },
  {
    name: "change_settings",
    description:
      "Change app settings when the student explicitly asks (e.g. »zamenjaj na 2. letnik«, »vklopi temni način«, »piši hitreje«). Profile settings apply on all devices, device settings only here. school_system, educational_track, curriculum_level and study_program change the learning path: they are only proposed until the student confirms (button in the app, or a clear »da« to exactly this change; then call again with confirmed=true). No financial or personal data (plans, payments, codes, name, e-mail, password, age).",
    input_schema: {
      type: "object",
      properties: {
        changes: {
          type: "object",
          description: "only the settings to change",
          properties: {
            ...Object.fromEntries(Object.entries(PROFILE_SETTINGS).map(([k, d]) => [k, k === "school_system" ? schemaFor(d, { enum: SYSTEM_IDS }) : schemaFor(d)])),
            ...Object.fromEntries(Object.entries(DEVICE_SETTINGS).map(([k, d]) => [k, schemaFor(d)])),
          },
          additionalProperties: false,
        },
        confirmed: { type: "boolean", description: "true only if the student's latest message clearly confirms the proposed learning-path change" },
      },
      required: ["changes"],
      additionalProperties: false,
    },
  },
  {
    name: "get_schedule",
    description: "Read the student's timetable (weekly lessons) and upcoming tests/deadlines with their ids. The summary for today and tomorrow is already in the settings below.",
    input_schema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "change_schedule",
    description:
      "Change the student's own timetable when they ask (e.g. »v torek imam ob 8.00 fiziko«, »v petek pišem test iz matematike«, »izbriši kemijo v sredo«). Adding a test makes the app prepare the student for it (Priprava na test) and remind them the day before. Remove items by id from get_schedule. Never invent lessons or dates: ask if day, time or date is unclear.",
    input_schema: {
      type: "object",
      properties: {
        add_lessons: {
          type: "array",
          description: SCHEDULE_SETTINGS.lessons.desc,
          items: {
            type: "object",
            properties: { day: { type: "integer", minimum: 1, maximum: 7 }, start: { type: "string" }, end: { type: "string" }, period: { type: "integer" }, name: { type: "string" }, room: { type: "string" } },
            required: ["day", "name"],
            additionalProperties: false,
          },
        },
        add_events: {
          type: "array",
          description: SCHEDULE_SETTINGS.events.desc,
          items: {
            type: "object",
            properties: { date: { type: "string" }, time: { type: "string" }, kind: { type: "string", enum: EVENT_KINDS }, name: { type: "string" }, note: { type: "string" } },
            required: ["date", "kind", "name"],
            additionalProperties: false,
          },
        },
        remove_lessons: { type: "array", items: { type: "string" }, description: "lesson ids to remove" },
        remove_events: { type: "array", items: { type: "string" }, description: "event ids to remove" },
      },
      additionalProperties: false,
    },
  },
  {
    name: "open_window",
    description:
      "Open a part of the app beside the chat as a movable window (a bottom sheet on phones) when the student asks, e.g. »odpri kalkulator«, »pokaži periodni sistem«, »odpri učbenik«. Then reply with one short sentence (e.g. »Odprl sem kalkulator.«).",
    input_schema: {
      type: "object",
      properties: {
        view: { type: "string", enum: WINDOW_VIEWS, description: "graph = calculator; path = learning path; corner = news corner; uci = »Uči se« (textbook, lab and 3D world in one view); textbook, lab (virtual laboratory, all experiments) and 3d (3D world: body atlas, cells, molecules) open that tab of »Uči se«" },
        calc_mode: { type: "string", enum: CALC_MODES, description: "only for view graph: sci = scientific, graph = graphing, tools = unit converter and tools, pse = periodic table, formulas" },
      },
      required: ["view"],
      additionalProperties: false,
    },
  },
];

// ---------------------------------------------------------------------------
// Pomožne funkcije

const norm = (s) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const programLabel = (id) => (PROGRAMS[id]?.label || id || "").replace(/( \(UN\))+/g, " (UN)").replace(/ \(UN\) – /, " – ");
const courseLabel = (key) => UNI_PATHS[key]?.label || key || "";

// Najboljše ujemanje besedila z vnosi [{ id, text }]: vse besede poizvedbe morajo biti v besedilu.
function bestMatch(query, items) {
  const toks = norm(query).split(" ").filter(Boolean);
  if (!toks.length) return { candidates: [] };
  const q = norm(query);
  const exact = items.filter((it) => norm(it.name || it.text) === q);
  if (exact.length === 1) return { id: exact[0].id };
  const scored = items.map((it) => {
    const hay = ` ${norm(it.text)} `;
    return { it, hit: toks.filter((t) => hay.includes(` ${t}`)).length };
  });
  const full = scored.filter((s) => s.hit === toks.length);
  if (full.length === 1) return { id: full[0].it.id };
  if (full.length > 1) return { candidates: full.map((s) => s.it) };
  const best = Math.max(...scored.map((s) => s.hit));
  const top = best > 0 ? scored.filter((s) => s.hit === best) : [];
  return top.length === 1 && best >= Math.ceil(toks.length / 2) ? { id: top[0].it.id } : { candidates: top.map((s) => s.it) };
}

const programItems = () =>
  Object.entries(PROGRAMS).map(([id, p]) => ({
    id,
    name: p.name,
    label: programLabel(id),
    text: `${id} ${p.label} ${FACULTIES[p.faculty] || ""} ${UNIVERSITIES[p.faculty.split("-")[0]] || ""}`,
  }));

function courseItems(program, level) {
  return courseKeysFor(program, level).map((k) => {
    const name = courseLabel(k).replace(/ \([^)]*\)$/, "");
    return { id: k, name, label: courseLabel(k), text: name };
  });
}

const WORDS = { prvi: 1, drugi: 2, tretji: 3, cetrti: 4, peti: 5, sesti: 6, sedmi: 7, osmi: 8, deveti: 9, first: 1, second: 2, third: 3, fourth: 4 };
function levelNumber(s) {
  const m = String(s).match(/([1-9])/);
  if (m) return Number(m[1]);
  const w = norm(s).split(" ").find((x) => WORDS[x]);
  return w ? WORDS[w] : null;
}

// Razred ali letnik v zapisu aplikacije za izbrano šolo. Vrne { level } ali { error }.
function canonicalLevel(input, track, cur, program) {
  const n = levelNumber(input);
  if (track === "OSNOVNA_SOLA") {
    if (n >= 1 && n <= 9) return { level: `${n}. razred` };
    return { error: "OŠ grades are '1. razred' to '9. razred'" };
  }
  if (track === "SREDNJA_SOLA") {
    if (!(n >= 1 && n <= 4)) return { error: "SŠ years are '1. letnik' to '4. letnik' (optionally with OR/VR)" };
    const raw = String(input).toUpperCase();
    const suffix = /\bVR\b|VIŠJ|VISJ/.test(raw) ? " VR" : /\bOR\b|OSNOVN/.test(raw) ? " OR" : jeSs(cur) ? (cur.curriculum_level.match(/ (OR|VR)$/)?.[0] ?? "") : "";
    return { level: `${n}. letnik${suffix}` };
  }
  const years = PROGRAMS[program]?.years.length || 4;
  if (n >= 1 && n <= years) return { level: `${n}. letnik` };
  return { error: `this programme has years '1. letnik' to '${years}. letnik'` };
}

// Kratek opis šole za predlog: { system, track, level, program }.
export function describeSchool(s) {
  return {
    system: isRegional(s.school_system) ? SCHOOL_SYSTEMS[s.school_system]?.name || s.school_system : null,
    track: s.educational_track,
    level: s.curriculum_level,
    program: jeFaks(s) ? programLabel(s.study_program) : null,
  };
}

function profileView(student) {
  const s = student.settings;
  return {
    school_system: s.school_system,
    educational_track: s.educational_track,
    curriculum_level: s.curriculum_level,
    study_program: s.study_program ? `${s.study_program} (${programLabel(s.study_program)})` : "",
    study_course: s.study_course ? courseLabel(s.study_course) : "",
    subject: s.subject,
    track: s.track,
    solving_mode: s.solving_mode,
    personality_setting: s.personality_setting,
    language: s.language,
    dialect: s.dialect || "",
    data_mode: s.data_mode,
    goal: s.goal,
    goal_date: s.goal_date,
    goal_reminder: s.goal_reminder ? "on" : "off",
    xp_goal: String(s.xp_goal ?? 50),
    interests: s.interests ?? [],
    interest_custom: s.interest_custom || "",
    news_level: s.news_level,
    news_lang: s.news_lang,
    games: s.games || "on",
    game_childhood: s.game_childhood ?? [],
    game_titles: s.game_titles ?? [],
    weak_points: student.manual_weaknesses || [],
  };
}

// Nastavitve naprave, ki jih odjemalec pošlje s sporočilom (samo znani ključi in veljavne vrednosti).
export function cleanDevice(input) {
  const out = {};
  if (!input || typeof input !== "object") return out;
  for (const key of Object.keys(DEVICE_SETTINGS)) {
    const v = deviceValue(key, input[key]);
    if (v) out[key] = v;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Preverjanje sprememb profila. Vrne { patch, errors, extraWeak }.

function validateProfile(changes, student) {
  const cur = student.settings;
  const errors = [];
  const patch = {};
  let weak;

  if (changes.school_system !== undefined) {
    if (SYSTEM_IDS.includes(changes.school_system)) patch.school_system = changes.school_system;
    else errors.push(`school_system: unknown id; allowed ${SYSTEM_IDS.join(", ")}`);
  }
  const system = patch.school_system ?? cur.school_system;

  if (changes.educational_track !== undefined) {
    if (PROFILE_SETTINGS.educational_track.values.includes(changes.educational_track)) patch.educational_track = changes.educational_track;
    else errors.push("educational_track: use OSNOVNA_SOLA, SREDNJA_SOLA or UNIVERZA");
  }
  if (isRegional(system) && (patch.educational_track || changes.study_program)) {
    errors.push("regional school systems have no faculty programmes and pick the stage from the grade: set curriculum_level only");
    delete patch.educational_track;
  }

  if (changes.study_program !== undefined && !isRegional(system)) {
    const r = bestMatch(changes.study_program, programItems());
    if (r.id) patch.study_program = r.id;
    else
      errors.push(
        r.candidates.length
          ? `study_program is ambiguous, ask which one: ${r.candidates.slice(0, 8).map((c) => c.label).join("; ")}`
          : "study_program: no such programme (get_settings options=study_program lists all)",
      );
    if (patch.study_program && !patch.educational_track && !jeFaks(cur)) patch.educational_track = "UNIVERZA";
  }

  let track = patch.educational_track ?? cur.educational_track;
  const program = patch.study_program ?? (track === "UNIVERZA" ? cur.study_program : "");

  if (changes.curriculum_level !== undefined) {
    const raw = String(changes.curriculum_level);
    if (isRegional(system)) {
      const g = gradesOf(system).find((x) => norm(x.label) === norm(raw));
      if (g) patch.curriculum_level = g.label;
      else errors.push(`curriculum_level: grades of this system are ${gradesOf(system).map((x) => x.label).join(", ")}`);
    } else {
      // »8. razred« pove osnovno šolo; »letnik« ob osnovni šoli pa ni jasen (srednja šola ali fakulteta).
      if (!patch.educational_track && /razred/i.test(raw) && track !== "OSNOVNA_SOLA") track = patch.educational_track = "OSNOVNA_SOLA";
      if (!patch.educational_track && /letnik/i.test(raw) && track === "OSNOVNA_SOLA") {
        errors.push("curriculum_level: 'letnik' needs educational_track SREDNJA_SOLA or UNIVERZA – ask the student which");
      } else {
        const r = canonicalLevel(raw, track, cur, program || Object.keys(PROGRAMS)[0]);
        if (r.level) patch.curriculum_level = r.level;
        else errors.push(`curriculum_level: ${r.error}`);
      }
    }
  } else if (imaStopnjo(patch) && stopnja(patch) !== stopnja(cur) && !isRegional(system)) {
    errors.push("curriculum_level is required when the school stage changes – ask which grade/year");
  }
  if (track === "UNIVERZA" && !program && !isRegional(system)) errors.push("study_program is required for faculty – ask which programme");

  const level = patch.curriculum_level ?? cur.curriculum_level;
  if (changes.study_course !== undefined) {
    if (track !== "UNIVERZA") errors.push("study_course is only for faculty students; use subject");
    else {
      const r = bestMatch(changes.study_course, courseItems(program, level));
      if (r.id) {
        patch.study_course = r.id;
        patch.subject = UNI_PATHS[r.id].subject;
      } else
        errors.push(
          `study_course: ${r.candidates.length ? "ambiguous" : "not in this year"}; courses: ${(r.candidates.length ? r.candidates : courseItems(program, level)).map((c) => c.name).join("; ")}`,
        );
    }
  }
  if (changes.subject !== undefined) {
    if (!PROFILE_SETTINGS.subject.values.includes(changes.subject)) errors.push("subject: unknown");
    else if (track === "UNIVERZA" && !patch.study_course) {
      const c = courseItems(program, level).find((x) => UNI_PATHS[x.id].subject === changes.subject);
      if (c) {
        patch.study_course = c.id;
        patch.subject = changes.subject;
      } else errors.push(`subject: this programme year has no ${changes.subject} course; courses: ${courseItems(program, level).map((x) => x.name).join("; ")}`);
    } else if (track !== "UNIVERZA") patch.subject = changes.subject;
  }
  if (changes.interests !== undefined) {
    const raw = Array.isArray(changes.interests) ? changes.interests : String(changes.interests).split(",");
    const ids = cleanInterests(raw);
    const bad = raw.filter((v) => String(v).trim() && !cleanInterests([v]).length);
    if (bad.length) errors.push(`interests: unknown ${bad.join(", ")}; allowed ${INTERESTS.map((i) => `${i.id} (${i.en})`).join(", ")}`);
    else patch.interests = ids;
  }
  if (changes.game_childhood !== undefined) {
    const raw = Array.isArray(changes.game_childhood) ? changes.game_childhood : String(changes.game_childhood ?? "").split(",");
    const bad = raw.filter((v) => String(v).trim() && !GENRE_IDS.includes(String(v).trim()));
    if (bad.length) errors.push(`game_childhood: unknown ${bad.join(", ")}; allowed ${GENRE_IDS.join(", ")}`);
    else patch.game_childhood = cleanChildhood(raw);
  }
  if (changes.game_titles !== undefined) patch.game_titles = cleanTitles(Array.isArray(changes.game_titles) ? changes.game_titles : String(changes.game_titles ?? "").split(","));
  if (changes.interest_custom !== undefined) patch.interest_custom = cleanText(String(changes.interest_custom ?? ""), 40);
  for (const key of ["track", "solving_mode", "data_mode", "news_level", "news_lang", "games"]) {
    if (changes[key] === undefined) continue;
    if (PROFILE_SETTINGS[key].values.includes(changes[key])) patch[key] = changes[key];
    else errors.push(`${key}: allowed ${PROFILE_SETTINGS[key].values.join(", ")}`);
  }
  if (patch.track === "COMPETITION" && (track === "UNIVERZA" || isRegional(system))) errors.push("track: competitions exist only for Slovenian OŠ/SŠ");
  if (changes.goal !== undefined) {
    if (goalsFor({ ...cur, educational_track: track, school_system: system }).includes(changes.goal)) patch.goal = changes.goal;
    else errors.push(`goal: allowed for this school ${goalsFor({ ...cur, educational_track: track, school_system: system }).join(", ")}`);
  }
  // Program sledi cilju (j, 4. 11.): tekmovanja = cilj Tekmovanje, redni pouk = kateri koli drug cilj.
  if (patch.goal === undefined && patch.track === "COMPETITION") patch.goal = "tekmovanje";
  if (patch.goal === undefined && patch.track === "REGULAR" && cur.goal === "tekmovanje") patch.goal = DEFAULT_GOAL;
  if (changes.goal_date !== undefined) {
    const d = String(changes.goal_date).trim();
    if (d === "" || validDate(d)) patch.goal_date = d;
    else errors.push("goal_date: use YYYY-MM-DD or '' to delete");
  }
  if (changes.goal_reminder !== undefined) {
    if (["on", "off"].includes(changes.goal_reminder)) patch.goal_reminder = changes.goal_reminder === "on";
    else errors.push("goal_reminder: on or off");
  }
  if (changes.xp_goal !== undefined) {
    if (PROFILE_SETTINGS.xp_goal.values.includes(String(changes.xp_goal))) patch.xp_goal = Number(changes.xp_goal);
    else errors.push(`xp_goal: allowed ${PROFILE_SETTINGS.xp_goal.values.join(", ")}`);
  }
  if (changes.personality_setting !== undefined) patch.personality_setting = cleanText(String(changes.personality_setting), 200);
  if (changes.language !== undefined) {
    const code = String(changes.language).trim();
    const found = LANGUAGE_CODES.find((c) => c.toLowerCase() === code.toLowerCase());
    if (found) patch.language = found;
    else errors.push("language: use an ISO 639 code the app supports, e.g. sl, en, de, hr, it, es, fr, uk, zh");
  }
  if (changes.dialect !== undefined) {
    const lang = patch.language ?? cur.language;
    const raw = norm(changes.dialect);
    const list = dialectsFor(lang);
    // Id ali ime (»štajersko«, »Hinglish«); prazno ali »knjižno« = knjižni jezik.
    const d = list.find((x) => norm(x.id) === raw || norm(x.name) === raw || (raw.length >= 4 && norm(x.name).startsWith(raw)));
    if (!raw || /^(knjizn|standard|none|default)/.test(raw)) patch.dialect = "";
    else if (d) patch.dialect = d.id;
    else errors.push(list.length ? `dialect: for this language use '' or ${list.map((x) => x.id).join(", ")}` : "dialect: this language has no dialect options, only standard ('')");
  }
  if (changes.weak_points !== undefined) weak = normalizeWeaknessList(changes.weak_points);
  return { patch, errors, weak };
}

// Spremembe za poročilo modelu: [{ setting, from, to }].
function diff(before, after, keys) {
  const show = (k, v) => (k === "study_program" ? programLabel(v) : k === "study_course" ? courseLabel(v) : v);
  const same = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null); // seznami (interests)
  return keys.filter((k) => !same(before[k], after[k])).map((k) => ({ setting: k, from: show(k, before[k]), to: show(k, after[k]) }));
}

const PROFILE_KEYS = Object.keys(PROFILE_SETTINGS).filter((k) => k !== "weak_points");

// ---------------------------------------------------------------------------
// Orodja v enem pogovoru. pending: Map (pogovor → predlog, ki čaka na potrditev).
// send(event, data): dogodki za odjemalca. Vrne { onToolUse, state }.

export function createSettingsTools({ store, studentId, conversationId, device = {}, pending, send = () => {}, schedules = null, onSchedule = () => {} }) {
  const state = { used: false, proposal: null, language: null, student: null };
  const dev = { ...device };
  const avatars = new Avatars(store.db);

  function getSettings(input = {}) {
    const student = store.getStudent(studentId);
    const out = { profile: profileView(student), device: dev, note: "Device settings not listed are at their defaults." };
    const owned = new Set(avatars.owned(studentId));
    out.profile.avatar = avatars.view(studentId).equipped;
    // Brezplačni in svoji deli; sezonski predmeti s svojo sezono (npr. pass_coat~2026-1).
    out.avatar_items_available = [
      ...ITEMS.filter((x) => x.price === 0 || owned.has(x.id)).map((x) => [x, x.id]),
      ...[...owned].filter((id) => id.includes("~") && itemOf(id)).map((id) => [itemOf(id), id]),
    ].map(([x, id]) => `${x.slot}: ${id} (${x.name.en})`);
    const s = student.settings;
    if (input.options === "study_program") out.options = programItems().map((p) => `${p.id}: ${p.label}`);
    if (input.options === "study_course")
      out.options = jeFaks(s) ? courseItems(s.study_program, s.curriculum_level).map((c) => c.name) : "only for faculty students";
    if (input.options === "dialect") out.options = ["'' = standard", ...dialectsFor(s.language).map((d) => `${d.id}: ${d.name}`)];
    if (input.options === "school_system") out.options = SYSTEM_IDS.map((id) => `${id}: ${SCHOOL_SYSTEMS[id].name}`);
    return { content: JSON.stringify(out) };
  }

  function changeSettings(input = {}) {
    const changes = input.changes && typeof input.changes === "object" ? input.changes : {};
    const student = store.getStudent(studentId);
    const cur = student.settings;
    const unknown = Object.keys(changes).filter((k) => !PROFILE_SETTINGS[k] && !DEVICE_SETTINGS[k]);
    const { patch, errors, weak } = validateProfile(changes, student);
    const deviceChanges = {};
    for (const key of Object.keys(DEVICE_SETTINGS)) {
      if (changes[key] === undefined) continue;
      const v = deviceValue(key, changes[key]);
      if (v) deviceChanges[key] = v;
      else errors.push(`${key}: allowed ${DEVICE_SETTINGS[key].values?.join(", ") || DEVICE_SETTINGS[key].desc}`);
    }
    if (unknown.length) errors.push(`not changeable from chat: ${unknown.join(", ")} (financial and personal data only in Settings / Account)`);
    // Avatar: samo brezplačni ali kupljeni deli; kupuje se le v trgovini v igrah (kovanci).
    let avatarChange = null;
    if (changes.avatar !== undefined) {
      const a = changes.avatar;
      if (!a || typeof a !== "object" || Array.isArray(a)) errors.push("avatar: object {slot: item id or list of ids}");
      else {
        const owned = new Set(avatars.owned(studentId));
        for (const [slot, v] of Object.entries(a)) {
          if (!SLOTS.includes(slot)) {
            errors.push(`avatar: unknown slot ${slot}`);
            continue;
          }
          if (Array.isArray(v) && (!isMulti(slot) || v.length > MULTI_MAX)) errors.push(isMulti(slot) ? `avatar: at most ${MULTI_MAX} items in ${slot}` : `avatar: ${slot} takes one item id`);
          for (const id of Array.isArray(v) ? v : [v]) {
            const x = itemOf(String(id));
            if (!x || x.slot !== slot) errors.push(`avatar: ${id} is not a ${slot} item`);
            else if (x.price !== 0 && !owned.has(id)) errors.push(x.earn ? `avatar: ${id} is locked (unlocked only by ${x.collection === "igre" ? "playing games" : x.collection === "smesni" ? `collecting ${x.need.xp} XP (learning and games)` : "learning"}, see Zbirke)` : `avatar: ${id} not owned yet (bought with game coins in the games shop)`);
          }
        }
        avatarChange = a;
      }
    }
    if (errors.length) return { content: JSON.stringify({ status: "error", errors, applied: [] }), isError: true };

    // Šola, razred, program, sistem: predlog ali potrjena sprememba.
    const pathPatch = {};
    for (const k of Object.keys(patch)) if (PATH_KEYS.includes(k)) pathPatch[k] = patch[k];
    const wantsPath = Object.keys(pathPatch).length > 0;
    const prev = pending.get(conversationId);
    const prevValid = prev && Date.now() - prev.at < PENDING_MS;
    const result = { status: "applied", applied: [], needs_confirmation: [], device: [] };

    let applyPatch = {};
    if (wantsPath) {
      // Predmet in predmet iz predmetnika sta odvisna od nove šole: gresta s predlogom.
      for (const k of ["study_course", "subject"]) if (patch[k] !== undefined) pathPatch[k] = patch[k];
      const next = normalizeSettings({ ...cur, ...pathPatch });
      const same = prevValid && JSON.stringify(normalizeSettings({ ...cur, ...prev.patch })) === JSON.stringify(next);
      const changed = diff(cur, next, PROFILE_KEYS);
      if (!changed.length) {
        result.note = "already set";
      } else if (input.confirmed === true && same) {
        applyPatch = { ...prev.patch };
      } else {
        const full = Object.fromEntries(["school_system", "educational_track", "curriculum_level", "study_program", "study_course", "subject"].map((k) => [k, next[k]]));
        pending.set(conversationId, { patch: full, at: Date.now() });
        state.proposal = { settings: full, from: describeSchool(cur), to: describeSchool(next) };
        result.needs_confirmation = changed;
        result.status = "needs_confirmation";
        result.note =
          "Not applied yet: the app shows the student a confirm button under your reply. Ask in one short sentence whether to change; if they answer yes in chat, call change_settings again with the same changes and confirmed=true.";
      }
      for (const k of Object.keys(patch)) if (!PATH_KEYS.includes(k) && k !== "study_course" && k !== "subject") applyPatch[k] = patch[k];
    } else {
      applyPatch = { ...patch };
      if (input.confirmed === true && prevValid && !Object.keys(patch).length) applyPatch = { ...prev.patch };
    }

    if (Object.keys(applyPatch).length || weak) {
      const updated = store.updateStudent(studentId, { settings: applyPatch, manual_weaknesses: weak });
      result.applied = diff(cur, updated.settings, PROFILE_KEYS);
      if (weak) result.applied.push({ setting: "weak_points", to: updated.manual_weaknesses });
      if (PATH_KEYS.some((k) => applyPatch[k] !== undefined)) pending.delete(conversationId);
      if (updated.settings.language !== cur.language) state.language = updated.settings.language;
      state.student = updated;
      send("settings", { student: updated, language: state.language });
      if (applyPatch.language && langInfo(applyPatch.language).code !== "sl") result.note = (result.note ? result.note + " " : "") + "Reply in the new language from now on.";
    }
    if (avatarChange) {
      // En id v predalu z več predmeti se doda k ostalim (wear), seznam zamenja cel predal.
      let eq = avatars.view(studentId).equipped;
      for (const [slot, v] of Object.entries(avatarChange)) eq = isMulti(slot) && !Array.isArray(v) ? wear(eq, String(v)) : { ...eq, [slot]: v };
      const to = avatars.equip(studentId, eq);
      result.applied.push({ setting: "avatar", to });
      send("avatar", { avatar: to });
    }
    if (Object.keys(deviceChanges).length) {
      Object.assign(dev, deviceChanges);
      result.device = Object.entries(deviceChanges).map(([setting, to]) => ({ setting, to }));
      send("device_settings", { changes: deviceChanges });
    }
    if (result.status !== "needs_confirmation" && !result.applied.length && !result.device.length) result.note = result.note || "nothing changed (already set)";
    return { content: JSON.stringify(result) };
  }

  // Urnik (server/schedule.js): branje in spremembe brez potrditve.
  function getSchedule() {
    if (!schedules) return { content: "timetable not available", isError: true };
    const student = store.getStudent(studentId);
    const v = scheduleView(schedules.get(studentId), student.settings);
    return {
      content: JSON.stringify({
        tool: "schedule",
        today: { date: v.now.date, weekday: v.now.day, time: v.now.time },
        lessons: v.lessons.map((l) => ({ id: l.id, day: l.day, start: l.start, end: l.end, name: l.name, ...(l.kind ? { kind: l.kind } : {}), ...(l.room ? { room: l.room } : {}) })),
        upcoming: v.upcoming.map((e) => ({ id: e.id, date: e.date, time: e.time || undefined, kind: e.kind, name: e.name, days_left: e.daysLeft })),
      }),
    };
  }
  function changeSchedule(input = {}) {
    if (!schedules) return { content: "timetable not available", isError: true };
    const student = store.getStudent(studentId);
    const cur = schedules.get(studentId);
    const list = (v) => (Array.isArray(v) ? v : []);
    const rmL = new Set(list(input.remove_lessons).map(String));
    const rmE = new Set(list(input.remove_events).map(String));
    const addL = list(input.add_lessons).map((l) => ({ ...l, source: "manual" }));
    const addE = list(input.add_events).map((e) => ({ ...e, source: "chat" }));
    const saved = schedules.save(
      studentId,
      { lessons: [...cur.lessons.filter((l) => !rmL.has(l.id)), ...addL], events: [...cur.events.filter((e) => !rmE.has(e.id)), ...addE], source: cur.source },
      student.settings,
    );
    const before = new Set([...cur.lessons.map((l) => l.id), ...cur.events.map((e) => e.id)]);
    const added = { lessons: saved.lessons.filter((l) => !before.has(l.id)), events: saved.events.filter((e) => !before.has(e.id)) };
    const rejected = addL.length - added.lessons.length + (addE.length - added.events.length);
    onSchedule(studentId);
    send("schedule", {});
    return {
      content: JSON.stringify({
        tool: "schedule",
        status: rejected ? "partly" : "applied",
        added_lessons: added.lessons.map((l) => `${l.id}: day ${l.day} ${l.start}-${l.end} ${l.name}`),
        added_events: added.events.map((e) => `${e.id}: ${e.date} ${e.kind} ${e.name}`),
        removed: cur.lessons.filter((l) => rmL.has(l.id)).length + cur.events.filter((e) => rmE.has(e.id)).length,
        ...(rejected ? { note: `${rejected} item(s) not saved: need day 1-7 with start time (or period) and name, or a valid date YYYY-MM-DD` } : {}),
      }),
    };
  }

  // Odpre del aplikacije v oknu ob klepetu (odjemalec: dogodek open_window).
  function openWindow(input = {}) {
    if (!WINDOW_VIEWS.includes(input.view)) return { content: `unknown view; use one of ${WINDOW_VIEWS.join(", ")}`, isError: true };
    const mode = input.view === "graph" && CALC_MODES.includes(input.calc_mode) ? input.calc_mode : undefined;
    send("open_window", { view: input.view, ...(mode ? { mode } : {}) });
    return { content: JSON.stringify({ status: "opened", view: input.view, ...(mode ? { calc_mode: mode } : {}) }) };
  }

  async function onToolUse(name, input) {
    state.used = true;
    try {
      if (name === "get_settings") return getSettings(input);
      if (name === "change_settings") return changeSettings(input);
      if (name === "get_schedule") return getSchedule();
      if (name === "change_schedule") return changeSchedule(input);
      if (name === "open_window") return openWindow(input);
      return { content: `unknown tool ${name}`, isError: true };
    } catch (err) {
      console.error("[evklid] orodje nastavitev:", err?.message ?? err);
      return { content: "internal error, settings not changed", isError: true };
    }
  }
  return { onToolUse, state };
}

// Sporočila, ki morda prosijo za spremembo nastavitev: odgovora ne vzamemo iz predpomnilnika odgovorov.
export const looksLikeSettings = (text) =>
  /nastav|zamenjaj|spremeni|preklopi|vklopi|izklopi|temn|svetl|barv|hitrej|počasnej|jezik|narečj|dialect|sem (zdaj )?v \d|settings|dark mode|theme|language|urnik|jutri|danes|test|kontroln|kolokvij|izpit|spraševanj|schedule|timetable/i.test(String(text || ""));

// ---------------------------------------------------------------------------
// »Odpri kalkulator«, »pokaži periodni sistem«, »open textbook«: okno odpremo brez klica modela.
// Samo kratek ukaz brez vprašanja (»kako odprem kalkulator?« gre k modelu).

const WINDOW_TARGETS = [
  // [regex, view, calc mode, sl, en]
  [/^(periodn\w* sistem\w*( elementov)?|pse|periodic table)$/, "graph", "pse", "periodni sistem", "the periodic table"],
  [/^(grafičn\w* kalkulator\w*|graphing calculator)$/, "graph", "graph", "grafični kalkulator", "the graphing calculator"],
  [/^(znanstven\w* kalkulator\w*|scientific calculator)$/, "graph", "sci", "znanstveni kalkulator", "the scientific calculator"],
  // Samo množina ali zbirka: »pokaži formulo« (za to nalogo) je vprašanje za inštruktorja.
  [/^(formule( iz \w+)?|zbirk\w* formul|formulas|formula sheet)$/, "graph", "formulas", "formule", "the formulas"],
  [/^(pretvornik\w*( enot)?|orodja|unit converter)$/, "graph", "tools", "pretvornik enot", "the unit converter"],
  [/^(kalkulator\w*|računal\w*|calculator)$/, "graph", null, "kalkulator", "the calculator"],
  [/^(učbenik\w*|textbook)$/, "textbook", null, "učbenik", "the textbook"],
  [/^(urnik\w*|timetable|schedule)$/, "schedule", null, "urnik", "the timetable"],
  [/^((virtualn\w* )?laboratorij\w*|(the )?lab|laboratory)$/, "lab", null, "laboratorij", "the laboratory"],
  [/^(3d( svet\w*)?|3d world|(3d )?atlas\w* (človeškega )?telesa|body atlas)$/, "3d", null, "3D svet", "the 3D world"],
];

export function openWindowIntent(text) {
  const raw = String(text || "").toLowerCase().trim();
  if (raw.length > 60 || raw.includes("?")) return null;
  const m = /^(?:prosim,?\s+|please,?\s+|lahko\s+)?(odpri|pokaži|pokazi|daj|open|show)\s+(?:mi\s+|me\s+)?(?:the\s+|a\s+)?(.+?)(?:,?\s+(?:prosim|please))?[\s.!]*$/.exec(raw);
  if (!m) return null;
  const en = /^(open|show)$/.test(m[1]);
  const what = m[2].trim();
  const hit = WINDOW_TARGETS.find(([re]) => re.test(what));
  if (!hit) return null;
  const [, view, mode, sl, eng] = hit;
  return { view, ...(mode ? { mode } : {}), text: en ? `I opened ${eng}.` : `Odprl sem ${sl}.` };
}

// ---------------------------------------------------------------------------
// Preizkusni način (brez ključa): preprosto prepoznavanje najpogostejših prošenj.

const ASK = /zamenjaj|spremeni|nastavi|preklopi|vklopi|izklopi|prestavi|daj\b|hočem|želim|rad bi|sem v|sem zdaj|piši|govori|switch|change|set\b|turn|speak/i;

export function mockToolCall(text, hasPending = false) {
  const t = String(text || "").toLowerCase().trim();
  const ev = mockEvent(t);
  if (ev) return { name: "change_schedule", input: { add_events: [ev] } };
  if (hasPending && /^(da|ja|ok|okej|potrdi|potrdim|seveda|yes)\b/.test(t)) return { name: "change_settings", input: { changes: {}, confirmed: true } };
  if (!ASK.test(t)) return null;
  const changes = {};
  if (/temn|dark/.test(t)) changes.theme = "dark";
  else if (/svetl|light/.test(t)) changes.theme = "light";
  if (/naključne barve|random colou?rs/.test(t)) changes.colors = "random";
  else if (/privzete barve|ponastavi barve/.test(t)) changes.colors = "default";
  if (/hitrej|hitro/.test(t) && /piš|izpis|odgovor|besedil/.test(t)) changes.reply_speed = "hitro";
  else if (/počasnej|počasi/.test(t) && /piš|izpis|odgovor|besedil/.test(t)) changes.reply_speed = "pocasi";
  const lvl = t.match(/([1-9])\.\s*(letnik|razred)/);
  if (lvl) changes.curriculum_level = `${lvl[1]}. ${lvl[2]}`;
  const subj = [["MAT", /matematik/], ["FIZ", /fizik/], ["KEM", /kemij/], ["NAR", /naravoslov/], ["BIO", /biologij/]].find(([, re]) => re.test(t));
  if (subj && /predmet|preklopi|zamenjaj/.test(t)) changes.subject = subj[0];
  const dia = t.match(/po (ljubljansk|gorenjsk|dolenjsk|štajersk|prekmursk|korošk|primorsk|pogovorn|knjižn)/);
  if (dia) changes.dialect = dia[1] === "knjižn" ? "" : dia[1];
  if (/celo rešitev|celotno rešitev|način b/.test(t)) changes.solving_mode = "B";
  else if (/način a|korak za korakom/.test(t)) changes.solving_mode = "A";
  return Object.keys(changes).length ? { name: "change_settings", input: { changes } } : null;
}

// »V petek 14. 11. pišem test iz matematike« → dogodek v urniku (preizkusni način).
function mockEvent(t, now = new Date()) {
  if (!/(imam|pišem|pisem|bo|dodaj|zapiši|zapisi)/.test(t)) return null;
  const kind = /kolokvij/.test(t) ? "kolokvij" : /izpit/.test(t) ? "izpit" : /ustno|spraševanj/.test(t) ? "ustno" : /test|kontroln/.test(t) ? "test" : null;
  const d = t.match(/\b(\d{1,2})\.\s*(\d{1,2})\.(?:\s*(\d{4}))?/);
  if (!kind || !d) return null;
  let year = Number(d[3]) || now.getFullYear();
  const pad = (n) => String(n).padStart(2, "0");
  let date = `${year}-${pad(d[2])}-${pad(d[1])}`;
  if (!d[3] && date < now.toISOString().slice(0, 10)) date = `${year + 1}-${pad(d[2])}-${pad(d[1])}`;
  const subj = [["matematike", /matematik/], ["fizike", /fizik/], ["kemije", /kemij/], ["biologije", /biologij/], ["naravoslovja", /naravoslov/]].find(([, re]) => re.test(t));
  const names = { test: "Test", kolokvij: "Kolokvij", izpit: "Izpit", ustno: "Ustno spraševanje" };
  return { date, kind, name: `${names[kind]}${subj ? ` iz ${subj[0]}` : ""}` };
}

const MOCK_LABELS = {
  style: "slog",
  goal: "cilj",
  goal_date: "datum cilja",
  theme: "videz",
  colors: "barve",
  accent: "poudarek",
  reply_speed: "hitrost izpisa",
  curriculum_level: "razred/letnik",
  educational_track: "šola",
  study_program: "program",
  subject: "predmet",
  solving_mode: "način",
  dialect: "narečje",
  game_childhood: "igre iz otroštva",
  game_titles: "lastni naslovi iger",
};

// Besedilo odgovora v preizkusnem načinu iz rezultata orodja.
export function mockToolText(resultContent) {
  let r;
  try {
    r = JSON.parse(resultContent);
  } catch {
    return "Nastavitve ne morem spremeniti.";
  }
  const fmt = (list) => list.map((c) => `${MOCK_LABELS[c.setting] || c.setting}: ${c.from ? `${c.from} → ` : ""}${Array.isArray(c.to) ? c.to.join(", ") : c.to}`).join(", ");
  if (r.tool === "schedule") {
    const added = [...(r.added_lessons || []), ...(r.added_events || [])].map((x) => x.replace(/^\w+: /, ""));
    return added.length ? `Zapisal sem v urnik: ${added.join(", ")}. ✅` : r.removed ? "Odstranil sem iz urnika. ✅" : "V urniku ni sprememb.";
  }
  if (r.status === "error") return `Tega ne morem nastaviti (${r.errors.join("; ")}).`;
  const parts = [];
  if (r.applied?.length || r.device?.length) parts.push(`Urejeno: ${fmt([...(r.applied || []), ...(r.device || [])])}. ✅`);
  if (r.status === "needs_confirmation") parts.push(`Res želiš spremembo (${fmt(r.needs_confirmation)})? Potrdi z gumbom spodaj ali napiši »da«.`);
  if (!parts.length) parts.push("To je že nastavljeno.");
  return parts.join(" ");
}

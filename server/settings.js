// Nastavitve učenca (nadzorna plošča) in njihovo preverjanje.
import { PROGRAMS, UNI_PATHS } from "./university-data.js";
import { ALL_SUBJECTS, SCHOOL_SUBJECTS, REGIONAL_SUBJECTS, subjectForLevel } from "./subjects.js";
import { LANGUAGE_CODES, DEFAULT_LANGUAGE } from "../public/i18n/languages.js";
import { cleanInterests, NEWS_LEVELS, NEWS_LANGS } from "../public/interests.js";
import { cleanDialect } from "../public/dialects.js";
import { cleanChildhood, cleanTitles } from "../public/games/childhood.js";
import { SYSTEM_IDS, DEFAULT_SYSTEM, isRegional, gradeInfo, defaultGrade, trackForLevel } from "../public/regions.js";
import { GOALS, DEFAULT_GOAL, goalsFor, validDate } from "../public/goal-data.js";
import { DEFAULT_XP_GOAL, cleanXpGoal } from "../public/xp-levels.js";
import { jeFaks } from "../public/stopnja.js";

export const ENUMS = {
  subject: ALL_SUBJECTS,
  track: ["REGULAR", "COMPETITION"],
  educational_track: ["OSNOVNA_SOLA", "SREDNJA_SOLA", "UNIVERZA"],
  study_program: ["", ...Object.keys(PROGRAMS)],
  solving_mode: ["A", "B"],
  language: LANGUAGE_CODES,
  // Šolski sistem (public/regions.js): SI = slovenski učni načrt, drugo = regijski profil.
  school_system: SYSTEM_IDS,
  // Lahki način (varčevanje s podatki): auto = po povezavi naprave, lite = vedno, normal = nikoli.
  data_mode: ["auto", "lite", "normal"],
  // Cilj učenca (public/goal-data.js); datum je neobvezen, opomnik ob 12.00 velja le z datumom.
  goal: GOALS,
  // Kotiček zanimanj: kako zahtevne novice (auto = po šoli) in ali tudi v angleščini.
  news_level: NEWS_LEVELS,
  news_lang: NEWS_LANGS,
};

export const DEFAULT_SETTINGS = {
  subject: "MAT",
  track: "REGULAR",
  educational_track: "OSNOVNA_SOLA",
  curriculum_level: "8. razred",
  study_program: "",
  study_course: "", // fakulteta: izbrani predmet iz predmetnika (ključ poti), prazno = prvi predmet letnika
  solving_mode: "A",
  personality_setting: "prijazen in spodbuden",
  language: DEFAULT_LANGUAGE,
  // Narečje inštruktorja / različica jezika (public/dialects.js), "" = knjižni jezik.
  dialect: "",
  region: "",
  school_system: DEFAULT_SYSTEM,
  data_mode: "auto",
  goal: DEFAULT_GOAL,
  goal_date: "", // YYYY-MM-DD ali prazno
  goal_reminder: true, // dnevni opomnik ob 12.00 do datuma cilja
  xp_goal: DEFAULT_XP_GOAL, // dnevni cilj XP (public/xp-levels.js XP_GOALS)
  // Kotiček zanimanj (public/interests.js): null = vprašalnik še ni bil izpolnjen, [] = preskočen.
  interests: null,
  interest_custom: "",
  news_level: "auto",
  news_lang: "all",
  // Igre iz otroštva (public/games/childhood.js): null = vprašalnik še ni bil izpolnjen, [] = preskočen.
  game_childhood: null,
  game_titles: [], // lastni naslovi iger iz vprašalnika (childhood.js matchTitle)
};

// Proste besedilne nastavitve gredo v sistemski prompt, zato jih skrajšamo
// in odstranimo prelome vrstic, da ne morejo posnemati novih razdelkov.
export function cleanText(value, maxLen) {
  if (typeof value !== "string") return "";
  return value.replace(/[\r\n\t]+/g, " ").replace(/\s{2,}/g, " ").trim().slice(0, maxLen);
}

export function normalizeSettings(input = {}) {
  const out = { ...DEFAULT_SETTINGS };
  for (const [key, allowed] of Object.entries(ENUMS)) {
    if (allowed.includes(input[key])) out[key] = input[key];
  }
  if (input.curriculum_level !== undefined) {
    out.curriculum_level = cleanText(input.curriculum_level, 60) || DEFAULT_SETTINGS.curriculum_level;
  }
  // Regijski sistem: razred mora biti iz tega sistema, šola sledi letu šolanja, fakultet ni.
  if (isRegional(out.school_system)) {
    if (!gradeInfo(out.school_system, out.curriculum_level)) out.curriculum_level = defaultGrade(out.school_system);
    out.educational_track = trackForLevel(gradeInfo(out.school_system, out.curriculum_level).level);
  } else if (/^(Class|Grade|JSS|SS|JHS|SHS|Form|S\d|Prep|Secondary|Kelas|Lớp|[1-6](e|re|nde)|Terminale)/.test(out.curriculum_level)) {
    // Nazaj na Slovenijo z razredom iz drugega sistema: privzeti slovenski razred.
    out.educational_track = DEFAULT_SETTINGS.educational_track;
    out.curriculum_level = DEFAULT_SETTINGS.curriculum_level;
  }
  // Fakulteta: program je obvezen, tekmovanj ni; brez fakultete programa ne hranimo.
  if (jeFaks(out)) {
    if (!out.study_program) out.study_program = Object.keys(PROGRAMS)[0];
    out.track = "REGULAR";
    // Predmet iz predmetnika: veljati mora za program in letnik (ali biti izbirni),
    // sicer (npr. po prehodu v višji letnik) velja prvi predmet letnika. Predmet aplikacije sledi njemu.
    const course = typeof input.study_course === "string" ? input.study_course : "";
    if (course && courseKeysFor(out.study_program, out.curriculum_level).includes(course)) {
      out.study_course = course;
      if (ALL_SUBJECTS.includes(UNI_PATHS[course]?.subject)) out.subject = UNI_PATHS[course].subject;
    }
  } else {
    out.study_program = "";
    // Strokovni predmeti fakultet (biologija …) v OŠ/SŠ ne obstajajo.
    if (!SCHOOL_SUBJECTS.includes(out.subject)) out.subject = DEFAULT_SETTINGS.subject;
    // Predmetnik: v 6. in 7. razredu OŠ naravoslovje namesto fizike, kemije in biologije (regijski sistemi imajo svoje).
    if (!isRegional(out.school_system)) out.subject = subjectForLevel(out.subject, out.educational_track, out.curriculum_level);
    else if (!REGIONAL_SUBJECTS.includes(out.subject)) out.subject = "FIZ";
  }
  // Regija naprave (ISO 3166, npr. "BR"): inštruktor prilagodi izraze in zapis.
  if (typeof input.region === "string" && /^[A-Z]{2}$/.test(input.region)) out.region = input.region;
  if (input.interests !== undefined) out.interests = cleanInterests(input.interests);
  if (input.game_childhood !== undefined) out.game_childhood = cleanChildhood(input.game_childhood);
  if (input.game_titles !== undefined) out.game_titles = cleanTitles(input.game_titles);
  if (input.interest_custom !== undefined) out.interest_custom = cleanText(input.interest_custom, 40);
  // Narečje mora pripadati jeziku pogovora (ob menjavi jezika se vrne na knjižni jezik).
  out.dialect = cleanDialect(input.dialect, out.language);
  if (input.personality_setting !== undefined) {
    out.personality_setting = cleanText(input.personality_setting, 200);
  }
  // Cilj mora ustrezati šoli (NPZ le v OŠ, matura le v SŠ …), sicer sprotno učenje.
  if (!goalsFor(out).includes(out.goal)) out.goal = DEFAULT_GOAL;
  if (validDate(input.goal_date)) out.goal_date = input.goal_date;
  if (input.xp_goal !== undefined) out.xp_goal = cleanXpGoal(input.xp_goal);
  if (input.goal_reminder !== undefined) out.goal_reminder = input.goal_reminder === true || input.goal_reminder === 1 || input.goal_reminder === "1" || input.goal_reminder === "true";
  // Različica vodiča ob prvi uporabi, ki jo je profil že videl (public/app.js TOUR_VERSION); ni nastavitev za inštruktorja.
  const tv = Number(input.tour_version);
  if (Number.isInteger(tv) && tv >= 0 && tv <= 99) out.tour_version = tv;
  return out;
}

// Ključi predmetov programa za letnik (»2. letnik«) in izbirni predmeti.
export function courseKeysFor(programId, level) {
  const p = PROGRAMS[programId];
  if (!p) return [];
  const year = Number((String(level || "").match(/([1-4])/) || [])[1]) || 1;
  return [...(p.courseKeys[year - 1] || []), ...(p.electiveKeys || [])];
}

export function normalizeWeaknessList(value) {
  const list = Array.isArray(value) ? value : String(value ?? "").split(",");
  return [...new Set(list.map((w) => cleanText(String(w), 60)).filter(Boolean))].slice(0, 20);
}

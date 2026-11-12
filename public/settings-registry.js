// Vse nastavitve, ki jih inštruktor sme spremeniti iz klepeta (orodji v server/chat-settings.js).
// Isti seznam uporabljata strežnik (opis orodja za model, preverjanje) in odjemalec (nastavitve naprave).
//
// NIKOLI tukaj: finančni podatki (naročnina, plačila, cene, kode za aktivacijo, račun) in osebni
// podatki (ime, e-pošta, geslo, starost, starši, vzdevek). Te ureja samo učenec v Nastavitvah / Računu.
//
// Nova nastavitev v aplikaciji → nov vnos tukaj. test/chat-settings.test.js preveri, da ima vsako
// polje obrazca Nastavitve in vsaka nastavitev naprave svoj vnos (razen izrecno izvzetih).
//
// Opisi (desc) so v angleščini, ker jih bere model (manj žetonov); učencu jih ne kažemo.

import { INTEREST_IDS, NEWS_LEVELS, NEWS_LANGS } from "./interests.js";
import { DIALECTS } from "./dialects.js";
import { GENRE_IDS } from "./games/childhood.js";

const DIALECT_LIST = Object.entries(DIALECTS).map(([l, list]) => `${l}: ${list.map((d) => d.id).join(", ")}`).join("; ");

// Profil učenca (shrani se na strežniku, velja na vseh napravah).
// confirm: sprememba zamenja učno pot, zato jo učenec najprej potrdi (gumb ali »da«).
export const PROFILE_SETTINGS = {
  school_system: { confirm: true, desc: "country / school system id: SI = Slovenia (default), others are regional curricula (see get_settings)" },
  educational_track: { confirm: true, values: ["OSNOVNA_SOLA", "SREDNJA_SOLA", "UNIVERZA"], desc: "school stage: primary (OŠ), secondary (SŠ) or faculty" },
  curriculum_level: { confirm: true, desc: "grade or year: OŠ '1. razred'…'9. razred'; SŠ '1. letnik'…'4. letnik', optional maths level ' OR'/' VR' (e.g. '3. letnik VR'); faculty '1. letnik'…; regional systems use their grade names (e.g. 'Class 8')" },
  study_program: { confirm: true, desc: "faculty study programme: id or name with faculty, e.g. 'Kemija UL FKKT' (get_settings options=study_program lists them)" },
  study_course: { desc: "faculty only: course of the programme's current year or an elective, by name (get_settings options=study_course)" },
  subject: { values: ["MAT", "FIZ", "KEM", "NAR", "BIO", "GEO", "RAC", "EKO"], desc: "school subject; OŠ 6./7. has MAT and NAR only; at faculty prefer study_course" },
  track: { values: ["REGULAR", "COMPETITION"], desc: "REGULAR = school (NPZ/matura), COMPETITION = competition preparation (not at faculty or in regional systems). Follows goal: COMPETITION is the same as goal tekmovanje" },
  solving_mode: { values: ["A", "B"], desc: "A = step-by-step guidance, B = full worked solution with explanation (permanent default)" },
  personality_setting: { desc: "tutor tone / theme of examples, max 200 chars, e.g. 'strog', 'šaljiv, primeri iz nogometa'" },
  language: { desc: "conversation and app language, ISO 639 code (e.g. 'sl', 'en', 'de', 'hr', 'zh-Hant'); the app reloads in it" },
  dialect: { desc: `tutor's dialect or language variant, only for the chat tone (terms, formulas, boxes and tasks stay standard); '' = standard language; must belong to the conversation language: ${DIALECT_LIST}` },
  data_mode: { values: ["auto", "lite", "normal"], desc: "light mode (less data, shorter replies): auto = on slow connection, lite = always, normal = never" },
  goal: { values: ["sprotno", "test", "npz", "matura", "tekmovanje", "izpit"], desc: "student's goal: sprotno = everyday learning, test = school test, npz (OŠ), matura (SŠ), tekmovanje (competition), izpit (faculty / regional exam)" },
  goal_date: { desc: "date of the goal 'YYYY-MM-DD', or '' to delete it (daily reminder at 12:00 until then)" },
  goal_reminder: { values: ["on", "off"], desc: "daily reminder at 12:00 until goal_date" },
  xp_goal: { values: ["30", "50", "100", "200"], desc: "daily XP goal (≈ 15 XP per solved task): 30 relaxed, 50 normal (default), 100 serious, 200 intense" },
  avatar: { object: true, desc: "avatar look (the only thing other students see): object {slot: value}; kind (character: cat, fox, dragon …), body (colour), eyes, mouth, bg take one item id; hat, outfit, acc, badge, fx take a list of up to 6 item ids worn together (a single id is added to what the drawer already holds, a list replaces the whole drawer, [] empties it; two items on the same spot, e.g. two pairs of glasses, keep only the last); only free items or items the student owns (get_settings lists both); buying with game coins happens only in the games shop" },
  interests: { list: true, values: INTEREST_IDS, desc: `news corner (Kotiček) interests, whole new list (replaces the old one), max 8, ids: ${INTEREST_IDS.join(", ")}` },
  interest_custom: { desc: "own extra topic for the news corner, max 40 chars of keywords, e.g. 'črne luknje' (English keywords find more news); '' clears it" },
  news_level: { values: NEWS_LEVELS, desc: "news corner depth: simple = written for kids and teens, all = also research news, auto = by school stage" },
  news_lang: { values: NEWS_LANGS, desc: "news corner: all = also English sources, mine = only news in the app language (fewer)" },
  games: { values: ["on", "off"], desc: "games section (Igre) shown (on, default) or hidden (off = »Skrij igre« in Settings); progress, coins and avatar stay" },
  game_childhood: { list: true, values: GENRE_IDS, desc: `kinds of games the student played as a child (games questionnaire); the games section shows Evklid's own learning games in these styles; whole new list, ids: ${GENRE_IDS.join(", ")}` },
  game_titles: { list: true, desc: "student's own titles of childhood games typed in the games questionnaire (max 5 × 40 chars, whole new list); Evklid maps them to similar game kinds or to wishes for new games" },
  weak_points: { list: true, desc: "student's own list of weak points (whole new list, replaces the old one), e.g. ['ulomki', 'pretvarjanje enot']" },
};

// Nastavitve te naprave (localStorage); strežnik jih ne hrani, odjemalec jih uporabi takoj.
// ls: ključ v localStorage in preslikava vrednosti; brez ls ima nastavitev svojo kodo v public/chat-settings.js.
export const DEVICE_SETTINGS = {
  // Zgodovinski slogi (public/theme.js → ERAS) so našteti tu, ker strežnik ne bere theme.js; test/teme.test.js preveri oboje.
  style: { values: ["cist", "igriv", "temen", "antik", "renesansa", "bagdad", "indija", "egipt"], desc: "visual style: cist = clean (default), igriv = playful/rounded, temen = always dark; history styles (light or dark, subtle period drawings in the background, serif headings, facts card about that era's mathematicians): antik = ancient Greece (marble, terracotta), renesansa = Renaissance (parchment, crimson), bagdad = House of Wisdom / Islamic golden age (teal and gold), indija = Indian mathematics (saffron and indigo), egipt = ancient Egyptian mathematics (sand and lapis lazuli)" },
  theme: { values: ["light", "dark", "system"], desc: "light / dark mode, system = follow the device (ignored in style temen)" },
  accent: { desc: "accent colour: '#rrggbb', 'random' or 'default' (contrast is fixed automatically)" },
  colors: { values: ["random", "default"], desc: "whole colour palette of the current light/dark mode: random or back to default" },
  color_background: { desc: "background colour '#rrggbb' (current light/dark mode)" },
  color_windows: { desc: "windows/cards colour '#rrggbb'" },
  color_menus: { desc: "menus colour '#rrggbb'" },
  color_text: { desc: "text colour '#rrggbb' (adjusted for readability)" },
  reply_speed: { values: ["zelo_pocasi", "pocasi", "srednje", "hitro", "takoj"], ls: ["pace"], desc: "how fast tutor replies appear, takoj = no animation" },
  fullscreen: { values: ["on", "off"], ls: ["evklid.fullscreen", { on: "1", off: "0" }], desc: "full-screen mode in the browser (off by default)" },
  calculator: { values: ["sci", "graph", "tools", "pse", "formulas"], ls: ["evklid.calcMode"], desc: "calculator opens in: scientific, graphing, tools, periodic table, formulas" },
  writing_pad: { values: ["auto", "off"], desc: "at tasks Evklid's keyboard or the handwriting pad opens by itself (auto) or only on tap (off)" },
  writing_pad_tab: { values: ["keys", "draw"], desc: "at tasks open Evklid's keyboard (keys) or the handwriting pad (draw)" },
  keyboard: { values: ["always", "math", "never"], desc: "Evklid's own on-screen keyboard on touch devices instead of the phone's: always (default), math = only maths fields (calculator, task answers), never = phone keyboard everywhere; login e-mail and password always use the phone keyboard" },
  keyboard_words: { values: ["on", "off"], desc: "word suggestions above the letters of Evklid's keyboard (off by default)" },
  keyboard_vibration: { values: ["on", "off"], desc: "short vibration on key press of Evklid's keyboard (on by default)" },
  keyboard_glide: { values: ["on", "off"], desc: "glide typing on Evklid's keyboard: swipe a finger across the letters to type a word (on by default)" },
  game_sound: { values: ["on", "off"], ls: ["evklid.gameSound"], desc: "sound in games" },
  game_speed: { values: ["slow", "mid", "fast"], ls: ["evklid.gamePace"], desc: "game speed" },
  windows: { values: ["on", "off"], ls: ["evklid.windows", { on: "1", off: "0" }], desc: "movable windows: drag top tabs onto the page to open them as windows, tutor chat bubble outside the chat (on by default)" },
  schedule_reminders: { values: ["on", "off"], ls: ["evklid.scheduleReminders", { on: "1", off: "0" }], desc: "notification on this device the day before a test from the timetable (the app also shows it in the app)" },
};

// Urnik učenca (Jaz → Urnik, server/schedule.js): ure v tednu ter testi in roki. Inštruktor ga bere in
// ureja z orodjema get_schedule / change_schedule (brez potrditve: to so učenčevi lastni podatki).
export const EVENT_KINDS = ["test", "kolokvij", "izpit", "ustno", "naloga", "drugo"];
export const SCHEDULE_SETTINGS = {
  lessons: { desc: "weekly timetable: day 1-7 (1 = Monday), start and end 'HH:MM' (or school period 0-8 instead), name = subject as the student says it, optional room" },
  events: { desc: "tests and deadlines: date 'YYYY-MM-DD', optional time 'HH:MM', kind test|kolokvij|izpit|ustno|naloga|drugo, name e.g. 'Kontrolna naloga iz matematike', optional note (material)" },
};

export const ALL_SETTING_KEYS = [...Object.keys(PROFILE_SETTINGS), ...Object.keys(DEVICE_SETTINGS), ...Object.keys(SCHEDULE_SETTINGS).map((k) => `schedule_${k}`)];
export const HEX = /^#[0-9a-f]{6}$/i;

// Preveri vrednost nastavitve naprave; vrne normalizirano vrednost ali null.
export function deviceValue(key, value) {
  const def = DEVICE_SETTINGS[key];
  if (!def || typeof value !== "string") return null;
  const v = value.trim();
  if (def.values) return def.values.includes(v) ? v : null;
  if (key === "accent") return v === "random" || v === "default" || HEX.test(v) ? v.toLowerCase() : null;
  if (key.startsWith("color_")) return HEX.test(v) ? v.toLowerCase() : null;
  return null;
}

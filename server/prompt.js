// Sestavi sistemski prompt iz predloge in aktivnih nastavitev.
import "./env.js";
import { BRAND } from "./brand.js";
import fs from "node:fs";
import { goalPrompt } from "../public/goal-data.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { cleanText } from "./settings.js";
import { interestById } from "../public/interests.js";
import { studyProgramPrompt } from "./curriculum.js";
import { langInfo } from "../public/i18n/languages.js";
import { dialectInfo } from "../public/dialects.js";
import { SCHOOL_SYSTEMS, isRegional, gradeInfo } from "../public/regions.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_PATH = process.env.EVKLID_PROMPT_PATH || path.join(here, "..", "prompts", "system_prompt.md");

// Vrstica, ki loči stalni del prompta (enak za vse učence, predpomnjen pri
// Claude API) od nastavitev učenca, ki jih vstavi strežnik.
export const SPLIT_MARKER = `<!-- ${BRAND.env}:NASTAVITVE`;

let cached = null;
export function loadTemplate() {
  if (!cached) cached = fs.readFileSync(TEMPLATE_PATH, "utf8");
  return cached;
}

const PLACEHOLDERS = [
  "student_name",
  "subject",
  "track",
  "educational_track",
  "curriculum_level",
  "study_program",
  "solving_mode",
  "personality_setting",
  "weaknesses",
  "student_results",
  "learning_path",
  "language",
  "dialect",
  "school_system",
  "reply_length",
  "student_schedule",
  "interests",
];

// settings: normalizirane nastavitve; weaknesses: seznam nizov.
// lite: lahki način (kratki odgovori za drag ali počasen prenos podatkov).
// results: besedilo iz studentResults() (server/results.js) za zahtevnost primerov in nalog.
export function buildSystemPrompt({ settings, weaknesses = [], studentName = "", learningPath = "", lite = false, results = "", schedule = "" }, template = loadTemplate()) {
  const values = {
    learning_path: learningPath || "(Prost pogovor: ni izbrane teme učne poti.)",
    ...settings,
    study_program: studyProgramPrompt(settings),
    student_name: cleanText(studentName, 40) || "(ni podano)",
    personality_setting: settings.personality_setting || "nevtralna",
    weaknesses: weaknesses.length ? weaknesses.join(", ") : "(še ni podatkov)",
    student_results: results || "še ni podatkov. Predlagana začetna zahtevnost: osnovna.",
    language: languagePrompt(settings.language, settings.region),
    dialect: dialectPrompt(settings),
    school_system: schoolSystemPrompt(settings) + goalPrompt(settings),
    reply_length: lite ? "kratka (lahki način)" : "običajna",
    student_schedule: schedule || "(ni podatkov)",
    interests: interestsPrompt(settings),
  };
  // Zamenjamo samo znana imena, da LaTeX zapisi kot {,} ostanejo nedotaknjeni.
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    PLACEHOLDERS.includes(key) ? String(values[key] ?? "") : match,
  );
}

// Zanimanja iz kotička: inštruktor lahko primere vzame iz njih, kadar se prilegajo snovi.
function interestsPrompt(settings) {
  const names = (settings.interests || []).map((id) => interestById(id)?.name).filter(Boolean);
  const own = cleanText(settings.interest_custom, 40);
  if (own) names.push(own);
  return names.length ? names.join(", ") : "(ni izbranih)";
}

// Razdeli sestavljeni prompt na stalni del (predpomnjen) in del z nastavitvami.
// Vrne bloke za polje `system` Claude API; če oznake ni, en sam blok.
export function systemBlocks(prompt, { cacheStatic = true, ttl = null } = {}) {
  const at = prompt.indexOf(SPLIT_MARKER);
  if (at === -1) return [{ type: "text", text: prompt }];
  const end = prompt.indexOf("\n", at);
  const staticPart = prompt.slice(0, at).trimEnd();
  const dynamicPart = (end === -1 ? "" : prompt.slice(end + 1)).trim();
  const blocks = [{ type: "text", text: staticPart }];
  if (cacheStatic) blocks[0].cache_control = ttl ? { type: "ephemeral", ttl } : { type: "ephemeral" };
  if (dynamicPart) blocks.push({ type: "text", text: dynamicPart });
  return blocks;
}

// Narečje za prompt: »knjižni jezik« ali »Štajersko – štajersko narečje (…)«.
export function dialectPrompt(settings) {
  const d = dialectInfo(settings.dialect, settings.language);
  return d ? `${d.name} – ${d.hint}` : "knjižni jezik";
}

// Jezik pogovora za prompt, npr. »slovenščina (sl)« ali »German – Deutsch (de)«.
export function languagePrompt(code, region = "") {
  const l = langInfo(code || "sl");
  const base = l.code === "sl" ? "slovenščina (sl)" : `${l.english} – ${l.native} (${l.code})`;
  if (!region || (l.code === "sl" && region === "SI")) return base;
  let name = region;
  try {
    name = new Intl.DisplayNames(["en"], { type: "region" }).of(region) || region;
  } catch {}
  return `${base}, regija: ${name} (${region})`;
}

// Šolski sistem za prompt: »Slovenija« ali npr. »India – CBSE / NCERT; razred Class 8 (8. leto šolanja); …«.
export function schoolSystemPrompt(settings) {
  if (!isRegional(settings.school_system)) return "Slovenija (slovenski učni načrt)";
  const sys = SCHOOL_SYSTEMS[settings.school_system];
  const g = gradeInfo(settings.school_system, settings.curriculum_level);
  return [
    `${sys.name}; razred ${settings.curriculum_level}${g ? ` (${g.level}. leto šolanja, ${g.stage})` : ""}`,
    sys.exams ? `izpiti: ${sys.exams}` : "",
    sys.help ? `pomoč v stiski: ${sys.help}` : "",
  ]
    .filter(Boolean)
    .join("; ");
}

// Prehod v višji razred, letnik ali na fakulteto.
// Na začetku šolskega leta učencu predlagamo naslednjo raven (en klik),
// ob prehodu OŠ → SŠ → fakulteta pa pokažemo, kaj je na novi ravni novega.
import { PROGRAMS } from "./university-data.js";
import { stageCode } from "../public/stopnja.js";
import { SCHOOL_SYSTEMS, isRegional, gradesOf, trackForLevel } from "../public/regions.js";

const ORDER = ["OS", "SS", "UNI"];
export const stageOf = (settings) => stageCode(settings);

/** Ali je sprememba nastavitev prehod na višjo stopnjo (OŠ → SŠ, SŠ → fakulteta)? Vrne novo stopnjo ali null. */
export function stageUp(before, after) {
  const a = ORDER.indexOf(stageOf(before));
  const b = ORDER.indexOf(stageOf(after));
  return b > a ? ORDER[b] : null;
}

const num = (level) => Number(/^(\d)/.exec(String(level || ""))?.[1]) || 0;
const programYears = (id) => {
  const y = PROGRAMS[id]?.years;
  return Array.isArray(y) ? y.length : Number(y) || 3;
};

/**
 * Naslednja raven za učenca ali null (zadnji letnik fakultete).
 * choose: true pomeni, da mora učenec še kaj izbrati (fakulteto in program).
 */
export function nextLevel(settings) {
  const s = settings || {};
  // Regijski sistem: naslednji razred s seznama sistema (fakultet tam ni).
  if (isRegional(s.school_system)) {
    const list = gradesOf(s.school_system);
    const i = list.findIndex((g) => g.label === s.curriculum_level);
    const next = i >= 0 ? list[i + 1] : null;
    if (!next) return null;
    return { label: next.label, settings: { educational_track: trackForLevel(next.level), curriculum_level: next.label } };
  }
  const n = num(s.curriculum_level);
  const stage = stageOf(s);
  if (stage === "OS") {
    if (n && n < 9) return { label: `${n + 1}. razred`, settings: { educational_track: "OSNOVNA_SOLA", curriculum_level: `${n + 1}. razred` } };
    return {
      label: "1. letnik srednje šole",
      stageUp: "SS",
      settings: { educational_track: "SREDNJA_SOLA", study_program: "", curriculum_level: "1. letnik OR" },
    };
  }
  if (stage === "SS") {
    const lvl = /VR/.test(s.curriculum_level) ? "VR" : "OR";
    if (n && n < 4) return { label: `${n + 1}. letnik`, settings: { educational_track: "SREDNJA_SOLA", curriculum_level: `${n + 1}. letnik ${lvl}` } };
    return { label: "fakulteta", stageUp: "UNI", choose: true, settings: { educational_track: "UNIVERZA" } };
  }
  if (n && n < programYears(s.study_program)) {
    return { label: `${n + 1}. letnik`, settings: { educational_track: "UNIVERZA", study_program: s.study_program, curriculum_level: `${n + 1}. letnik` } };
  }
  return null;
}

// Šolsko leto, ki se začne 1. septembra: 2026 za čas od avgusta 2026 do julija 2027.
export const schoolYearOf = (now = new Date()) => (now.getUTCMonth() >= 7 ? now.getUTCFullYear() : now.getUTCFullYear() - 1);

const parseTime = (iso) => (iso ? Date.parse(String(iso).replace(" ", "T") + (/[zZ]|[+-]\d\d:?\d\d$/.test(iso) ? "" : "Z")) : NaN);

/**
 * Predlog za prehod na začetku šolskega leta (od 20. avgusta do 31. oktobra),
 * če je bila raven nazadnje nastavljena pred 1. julijem tega leta (torej v prejšnjem šolskem letu).
 */
export function levelUpSuggestion(student, now = new Date()) {
  // Šolsko leto se v regijskih sistemih začne ob drugem mesecu (Indija aprila, Kenija januarja …):
  // predlog od 12 dni pred začetkom do konca naslednjega meseca. Slovenija: 20. avgust–31. oktober.
  const start = SCHOOL_SYSTEMS[student.settings?.school_system]?.yearStart || 9;
  const t = now.getTime();
  // Pri začetku v januarju okno seže v december prejšnjega leta.
  const y = [now.getUTCFullYear(), now.getUTCFullYear() + 1].find((yy) => t >= Date.UTC(yy, start - 1, 1) - 12 * 86400000 && t <= Date.UTC(yy, start + 1, 1) - 60000);
  if (!y) return null;
  const since = parseTime(student.level_since || student.created_at);
  if (!(since < Date.UTC(y, start - 3, 1))) return null;
  const next = nextLevel(student.settings);
  if (!next) return null;
  return { ...next, current: student.settings.curriculum_level, schoolYear: start >= 7 ? `${y}/${String(y + 1).slice(2)}` : `${y}` };
}

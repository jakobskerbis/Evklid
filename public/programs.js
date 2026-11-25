// Univerzitetni študijski programi (1. stopnja in enoviti magistrski): seznam s strežnika in izbirnik.
import { t } from "./i18n-osnova.js";
let cache = null;

export async function loadPrograms(api) {
  if (!cache) cache = await api("/api/programs");
  return cache;
}

// Že naloženi programi (prazen seznam, dokler jih ne naložimo).
export const programsCache = () => cache || [];

export const UNI_YEARS = ["1. letnik", "2. letnik", "3. letnik", "4. letnik"];

// Letniki programa (večina ima 3, nekateri 4).
export const programYears = (program) => UNI_YEARS.slice(0, program?.years || 3);

// Predmeti aplikacije. Študenti imajo še strokovne predmete svojega programa.
export const SUBJECT_NAMES = Object.fromEntries(["MAT", "FIZ", "KEM", "NAR", "BIO", "GEO", "RAC", "EKO"].map((k) => [k, t(`subj.${k}`)]));
export const SCHOOL_SUBJECTS = ["MAT", "FIZ", "KEM", "BIO"];
const REGIONAL_SUBJECTS = ["MAT", "FIZ", "KEM"];
// Predmetnik slovenske OŠ: v 6. in 7. razredu matematika in naravoslovje, fizika, kemija in biologija
// od 8. razreda in v gimnaziji (enako na strežniku, server/subjects.js). Regijski sistemi imajo matematiko, fiziko in kemijo.
export function schoolSubjectsFor(track, level, regional = false) {
  if (regional) return REGIONAL_SUBJECTS;
  return track === "OSNOVNA_SOLA" && /^[67]\./.test(String(level || "").trim()) ? ["MAT", "NAR"] : SCHOOL_SUBJECTS;
}

// <option> za izbiro predmeta: OŠ/SŠ po predmetniku (list), študent predmete svojega programa.
export function subjectOptions(program, selected, list = SCHOOL_SUBJECTS) {
  if (program?.subjects?.length) list = program.subjects;
  return list.map((k) => `<option value="${k}" ${k === selected ? "selected" : ""}>${SUBJECT_NAMES[k]}</option>`).join("");
}

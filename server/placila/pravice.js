// Pravice: kaj učenec dobi iz vseh virov skupaj (j 2026-10-30, načrt »Šolska licenca in Evklid Osebno«).
// Ena funkcija za vso aplikacijo; viri so osebni paket (naročnina, preizkus, koda, bonus, paket pred
// testom = »Evklid Osebno«) in šolska licenca. Viri se združijo: učenec dobi vse, kar da kateri koli
// vir, vprašanja na dan pa se seštejejo. Brez vira velja brezplačni paket (kot doslej).
//
// Šolska licenca: vse za šolske predmete licence (tudi interaktivne lekcije), inštruktor 15 vprašanj
// na dan, »Razloži podrobneje« največ s Sonnetom, mesečna meja AI na šolo.
// Osebno: vsi predmeti in ravni, 60 vprašanj na dan, Opus ob 3. zaporedni prošnji »Razloži podrobneje«,
// skeniranje naloge, načrt pred testom, tedensko poročilo staršem.
import { getTopic } from "../curriculum.js";

const envNum = (k, d) => {
  const v = Number(process.env[k]);
  return process.env[k] !== undefined &&
    process.env[k] !== "" &&
    Number.isFinite(v) &&
    v >= 0
    ? v
    : d;
};
// 0 = brez omejitve. S proračunom AI se meja plačljivih virov prilagaja proračunu (server/usage.js dailyLimit),
// ti števili veljata samo brez proračuna.
export const schoolDailyQuestions = () =>
  envNum("EVKLID_SOLA_DAILY_QUESTIONS", 15);
export const personalDailyQuestions = () =>
  envNum("EVKLID_OSEBNO_DAILY_QUESTIONS", 60);

// Rok brez ure (»2027-06-30«) velja do konca tega dne (UTC).
const later = (iso, now) => {
  if (!iso) return false;
  const v = String(iso);
  if (/^\d{4}-\d\d-\d\d$/.test(v))
    return Date.parse(`${v}T23:59:59.999Z`) > now;
  return (
    Date.parse(v.replace(" ", "T") + (/Z|[+-]\d\d:?\d\d$/.test(v) ? "" : "Z")) >
    now
  );
};

// Ali licenca še velja: rok ni potekel in šola ni porabila mesečne meje AI (0 ali prazno = brez meje).
export function schoolValid(s, now = Date.now()) {
  if (!s) return false;
  if (s.valid_until && !later(s.valid_until, now)) return false;
  return !(s.ai_month_usd > 0 && (s.ai_spent_usd || 0) >= s.ai_month_usd);
}

// Seznam iz licence: tabela, besedilo JSON ali »MAT, FIZ«; napačna oblika ne sme podreti zahteve.
const list = (v) => {
  if (v == null || v === "") return null;
  if (Array.isArray(v))
    return v.map((x) => String(x).trim().toUpperCase().replace(/Š/g, "S"));
  if (typeof v === "string" && v.trim().startsWith("[")) {
    try {
      return list(JSON.parse(v));
    } catch {
      return ["?"]; // pokvarjen zapis ne pokrije ničesar (ne vsega)
    }
  }
  return list(String(v).split(","));
};

// Ali licenca pokriva temo: samo šolske poti (OŠ, SŠ), predmet in razred s seznama licence
// (prazen seznam = vsi šolski predmeti oziroma razredi). Razred je zapisan kot »OS-8«, »SS-2« ali samo
// številka (8, »2«): razredi OŠ (6–9) in SŠ (1–4) se ne prekrivajo.
export function schoolCovers(s, topicId) {
  const t = getTopic(topicId);
  if (!t) return false;
  const [subject, school, grade] = String(t.path).split("-");
  if (school !== "OS" && school !== "SS") return false;
  // Stopnja šole (OS/SS) iz server/schools.js: razred »1« OŠ ni 1. letnik SŠ.
  if (s.stage && String(s.stage).toUpperCase() !== school) return false;
  const subjects = list(s.subjects);
  const grades = list(s.grades);
  if (subjects?.length && !subjects.includes(subject)) return false;
  if (
    grades?.length &&
    !grades.includes(`${school}-${grade}`) &&
    !grades.includes(String(Number(grade)))
  )
    return false;
  return true;
}

// personal: { tier, until } ali null; schools: vrstice licenc, ki jim učenec pripada (z ai_spent_usd).
// freeDaily: vprašanja na dan v brezplačnem paketu. Vrne opis pravic.
export function rights({
  personal = null,
  schools = [],
  freeDaily = 10,
  now = Date.now(),
} = {}) {
  const valid = schools.filter((s) => schoolValid(s, now));
  const school = valid.length > 0;
  const own = !!personal;
  // Vprašanja na dan: vsota virov; 0 pri katerem koli viru pomeni brez omejitve (null).
  const parts = [
    own && (personal.tier === "legacy" ? 0 : personalDailyQuestions()), // stari profili brez starša: brez meje kot doslej
    school && schoolDailyQuestions(),
  ].filter((x) => x !== false);
  const dailyQuestions = !parts.length
    ? freeDaily
    : parts.includes(0)
      ? null
      : parts.reduce((a, b) => a + b, 0);
  const until =
    [own && personal.until, ...valid.map((s) => s.valid_until)]
      .filter(Boolean)
      .sort()
      .at(-1) || null;
  return {
    sources: [...(own ? ["osebno"] : []), ...(school ? ["sola"] : [])],
    personal: own,
    personalTier: own ? personal.tier : null,
    school,
    schools: valid,
    dailyQuestions,
    // Najmočnejši model za »Razloži podrobneje«: Osebno do Opusa (ob 3. prošnji), šola do Sonneta.
    maxModel: own ? "opus" : school ? "sonnet" : null,
    allSubjects: own,
    scan: own,
    testPlan: own,
    parentReport: own,
    until,
  };
}

// Interaktivni del lekcije: Osebno za vse teme, šolska licenca za teme svojih predmetov in razredov.
export function lessonInteractive(r, topicId) {
  if (r.personal) return true;
  return r.schools.some((s) => schoolCovers(s, topicId));
}

// Šolska licenca kot vir pravic (server/placila/pravice.js). Podatke o šolah, licencah in razredih ima
// server/schools.js (ločen del: učiteljevi računi, razredi, licence, ki jih vnese skrbnik). Tukaj jih
// samo beremo: schoolAccess(db, studentId, now) in schoolStudents(db, schoolId). Dokler modula ni,
// šolskih pravic ni (vsi učenci imajo samo osebne vire).
// Uvozimo le, če datoteka obstaja: napaka v schools.js (tudi manjkajoč modul, ki ga ta uvaža) se ne sme skriti.
import { existsSync } from "node:fs";
const SCHOOLS_URL = new URL("../schools.js", import.meta.url);
const schools = existsSync(SCHOOLS_URL) ? await import(SCHOOLS_URL.href) : null;

const SPENT_MS = 60000; // poraba AI šole se preračuna največ enkrat na minuto
const CACHES = new WeakMap(); // db → Map(schoolId → { at, usd })

// source: { access(db, studentId, now), students(db, schoolId), seats?(db, schoolId) }; privzeto server/schools.js.
// seats: število mest veljavne licence (students je v vrstnem redu mest); brez njega šteje access().
// elsewhere?(db, schoolId, ids): kdo od ids je tudi v drugi šoli; ta šteje samo v šolo, ki mu da pravice (access()).
// personalOf(studentId): ali ima učenec osebni paket; njegova poraba AI se ne šteje v mejo šole.
export function createSchoolSource(
  db,
  { source = null, personalOf = () => false } = {},
) {
  const src =
    source ||
    (schools
      ? {
          access: schools.schoolAccess,
          students: schools.schoolStudents,
          seats: (d, schoolId) => schools.activeLicence(d, schoolId)?.seats ?? 0,
          membership: schools.schoolMembership,
          elsewhere: schools.inOtherSchools,
        }
      : null);
  if (!CACHES.has(db)) CACHES.set(db, new Map());
  const cache = CACHES.get(db);

  const hasLedger = () => {
    try {
      return !!db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'ai_school_use'").get();
    } catch {
      return false;
    }
  };
  const ledgerStart = () => (hasLedger() ? db.prepare("SELECT value FROM kv WHERE key = 'ai_school_ledger_start'").get()?.value || null : null);
  const ledgerSum = (schoolId) => db.prepare("SELECT COALESCE(SUM(usd),0) AS s FROM ai_school_use WHERE school_id = ? AND created_at >= date('now','start of month')").get(schoolId).s;
  function spentUsd(schoolId) {
    const c = cache.get(schoolId);
    if (c && Date.now() - c.at < SPENT_MS) return c.usd;
    // V mejo šole šteje samo poraba učencev z mestom licence (prvih »seats«) in brez osebnega paketa.
    const all = src.students(db, schoolId) || [];
    const seated = src.seats
      ? all.slice(0, src.seats(db, schoolId))
      : all.filter((id) => src.access(db, id, Date.now())?.schoolId === schoolId);
    // Učenec z mestom v dveh šolah šteje samo v šolo, ki mu da pravice (access() izbere eno).
    const both = new Set(src.seats && src.elsewhere ? src.elsewhere(db, schoolId, seated) : []);
    const ids = seated.filter((id) => !personalOf(id) && (!both.has(id) || src.access(db, id, Date.now())?.schoolId === schoolId));
    // Poraba sedanjih učencev z mestom (kot prej) in knjiga ob zapisu (recordUse; pregled #462 H7: poraba učenca, ki je
    // razred zapustil ali kupil osebni paket, ostane v šoli) s starejšo porabo pred začetkom knjige. Velja večje.
    const start = ledgerStart();
    const sumOf = (extra, args) =>
      ids.length
        ? db
            .prepare(`SELECT COALESCE(SUM(cost_usd),0) AS s FROM usage WHERE created_at >= date('now','start of month')${extra} AND student_id IN (${ids.map(() => "?").join(",")})`)
            .get(...args, ...ids).s
        : 0;
    const members = sumOf("", []);
    const usd = start ? Math.max(members, sumOf(" AND created_at < ?", [start]) + ledgerSum(schoolId)) : members;
    cache.set(schoolId, { at: Date.now(), usd });
    return usd;
  }

  return {
    available: !!src,
    // Licence učenca v obliki, ki jo pričakuje rights(): [] ali [{ ... }].
    forStudent(studentId, now = Date.now()) {
      const a = src?.access(db, studentId, now);
      if (!a) return [];
      const cap = Number(a.aiCapUsdMonth) || 0;
      return [
        {
          id: a.licenceId,
          school_id: a.schoolId,
          school_name: a.schoolName,
          stage: a.stage ?? null,
          plan: a.plan,
          subjects: a.subjects ?? null,
          grades: a.grades ?? null,
          valid_until: a.validUntil ?? null,
          ai_month_usd: cap,
          ai_spent_usd: cap > 0 ? spentUsd(a.schoolId) : 0,
        },
      ];
    },
    // Ali ima učenec zdaj šolsko licenco (brez porabe AI; za ceno Osebno ob šolski licenci).
    hasLicence: (studentId) => !!src?.access(db, studentId, Date.now()),
    // Članstvo za pravila ponudb (server/placila/ponudbe.js): { inSchool, inClass, offersOff } ali null.
    membership: (studentId) => src?.membership?.(db, studentId) || null,
    clearCache: () => cache.clear(),
    // Poraba, ki je šla pod mejo šole (accounts/index.js onLog), v knjigo šole.
    recordUse(schoolId, studentId, usd) {
      if (!hasLedger() || !(usd > 0) || schoolId == null) return;
      db.prepare("INSERT INTO ai_school_use (school_id, student_id, usd) VALUES (?, ?, ?)").run(schoolId, studentId, usd);
      cache.delete(schoolId);
    },
  };
}

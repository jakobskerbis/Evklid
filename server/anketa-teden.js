// Točka B3 (pilot, j 2026-11-14 potrdil besedilo in pravila): kratka anketa s tremi vprašanji 7 dni po prvi uporabi.
// 1. Ti je Evklid ta teden pomagal pri matematiki? (zelo / malo / ne)
// 2. Boš Evklid uporabljal tudi naslednji teden? (da / mogoce / ne)
// 3. Bi za Evklid plačal, ko ti zmanjka brezplačnih vprašanj? (da / mogoce / ne); pod 15 let (ali brez znane starosti)
//    namesto tega: Bi Evklid priporočil prijatelju? Cena ni nikjer omenjena.
// Pravila prikaza: enkrat, samo profilom z vsaj 2 aktivnima dnevoma in prvo uporabo pred vsaj 7 dnevi; nikoli med
// poukom po Urniku, pri šolskem učencu brez Urnika ne ob delavnikih 7.00–15.00, ne, če je učitelj ponudbe izklopil
// (server/placila/ponudbe.js offerPolicy); »Pozneje« skrije za 2 dni, največ dvakrat (tretjič je anketa zaprta).
// Odjemalec (public/anketa-teden.js) jo pokaže samo na Učni poti, ne v ligi ali med preizkusom. Brez točk XP.
// Skrbnik vidi samo vsote, šele od MIN_ODGOVOROV odgovorov naprej (pri 3. vprašanju za vsako različico posebej).
import { Schedules, nowParts } from "./schedule.js";
import { offerPolicy, NO_PRICE_AGE } from "./placila/ponudbe.js";
import { adminStudentIds } from "./rast.js";

export const PO_DNEH = 7;
export const MIN_AKTIVNIH_DNI = 2;
export const SKRIJ_DNI = 2;
export const NAJVEC_POZNEJE = 2;
export const MIN_ODGOVOROV = 3;
export const ODGOVORI = { pomaga: ["zelo", "malo", "ne"], naprej: ["da", "mogoce", "ne"], tretje: ["da", "mogoce", "ne"] };
const DAY = 86400000;
const isoDay = (t) => new Date(t).toISOString().slice(0, 10);

export function migrateAnketa(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS anketa_teden (
    student_id INTEGER PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
    pozneje INTEGER NOT NULL DEFAULT 0,
    skrito_do TEXT,
    vprasanje3 TEXT,
    odgovori TEXT,
    koncano TEXT
  )`);
}

// Aktivni dnevi učenca (kot server/rast.js): odgovor na nalogo, vprašanje inštruktorju ali točke (brez točk pilota).
function aktivniDnevi(db, id) {
  return db
    .prepare(
      `SELECT substr(created_at, 1, 10) AS d FROM events WHERE student_id = ?
       UNION SELECT substr(m.created_at, 1, 10) FROM conversations c JOIN messages m ON m.conversation_id = c.id WHERE c.student_id = ? AND m.role = 'user'
       UNION SELECT substr(created_at, 1, 10) FROM xp_events WHERE student_id = ? AND COALESCE(reason, '') NOT LIKE 'pilot:%'
       ORDER BY d`,
    )
    .all(id, id, id)
    .map((r) => r.d);
}

// Katero tretje vprašanje dobi učenec: »placal« od 15 let naprej, sicer »priporocil« (neznana starost = pod 15).
export const tretjeVprasanje = (age) => (age != null && age >= NO_PRICE_AGE ? "placal" : "priporocil");

// Ali je anketa za učenca odprta (brez pravil o času): ni še zaključena, dovolj dni, ni skrita s »Pozneje«.
function odprta(db, id, now) {
  const st = db.prepare("SELECT pozneje, skrito_do, koncano FROM anketa_teden WHERE student_id = ?").get(id);
  if (st?.koncano) return false;
  if (st?.skrito_do && isoDay(now) < st.skrito_do) return false;
  const dnevi = aktivniDnevi(db, id);
  return dnevi.length >= MIN_AKTIVNIH_DNI && dnevi[0] <= isoDay(now - PO_DNEH * DAY);
}

export function createAnketa(db, { accounts = null } = {}) {
  migrateAnketa(db);
  const urniki = new Schedules(db);
  const starost = (id, now) => accounts?.ageOfStudent?.(id, new Date(now)) ?? null;
  // Pravila prikaza iz ponudbe.js (pouk po Urniku, šolski čas, izklop učitelja); cena tu ni pomembna.
  const smeZdaj = (id, now) =>
    offerPolicy({ age: starost(id, now), membership: accounts?.schools?.membership?.(id) || null, lessons: urniki.get(id).lessons, now: nowParts(new Date(now)) }).show;

  function stanje(id, now = Date.now()) {
    const st = db.prepare("SELECT pozneje FROM anketa_teden WHERE student_id = ?").get(id);
    const pokazi = odprta(db, id, now) && smeZdaj(id, now);
    return { pokazi, vprasanje3: tretjeVprasanje(starost(id, now)), zadnjic: (st?.pozneje || 0) >= NAJVEC_POZNEJE };
  }

  function oddaj(id, body, now = Date.now()) {
    if (!odprta(db, id, now)) return { status: 409, error: "Anketa ni odprta." };
    const out = {};
    for (const [k, moznosti] of Object.entries(ODGOVORI)) {
      const v = body?.[k];
      if (typeof v !== "string" || !moznosti.includes(v)) return { status: 400, error: "Odgovori na vsa vprašanja." };
      out[k] = v;
    }
    db.prepare(
      `INSERT INTO anketa_teden (student_id, vprasanje3, odgovori, koncano) VALUES (?, ?, ?, ?)
       ON CONFLICT (student_id) DO UPDATE SET vprasanje3 = excluded.vprasanje3, odgovori = excluded.odgovori, koncano = excluded.koncano
       WHERE anketa_teden.koncano IS NULL`,
    ).run(id, tretjeVprasanje(starost(id, now)), JSON.stringify(out), isoDay(now));
    return { status: 200 };
  }

  // »Pozneje«: skrije za SKRIJ_DNI dni; po NAJVEC_POZNEJE odlogih tretji zapre anketo brez odgovora.
  function pozneje(id, now = Date.now()) {
    const st = db.prepare("SELECT pozneje, koncano FROM anketa_teden WHERE student_id = ?").get(id);
    if (st?.koncano) return;
    const n = (st?.pozneje || 0) + 1;
    db.prepare(
      `INSERT INTO anketa_teden (student_id, pozneje, skrito_do, koncano) VALUES (?, ?, ?, ?)
       ON CONFLICT (student_id) DO UPDATE SET pozneje = excluded.pozneje, skrito_do = excluded.skrito_do, koncano = excluded.koncano`,
    ).run(id, n, isoDay(now + SKRIJ_DNI * DAY), n > NAJVEC_POZNEJE ? isoDay(now) : null);
  }

  // Skrbnik: samo vsote, od MIN_ODGOVOROV odgovorov naprej; skrbnikovi profili se ne štejejo.
  function porocilo({ adminEmails = [] } = {}) {
    const admins = adminStudentIds(db, adminEmails);
    const vrstice = db.prepare("SELECT student_id AS s, vprasanje3 AS v3, odgovori FROM anketa_teden WHERE odgovori IS NOT NULL").all().filter((r) => !admins.has(r.s));
    const zavrnili = db.prepare("SELECT student_id AS s FROM anketa_teden WHERE koncano IS NOT NULL AND odgovori IS NULL").all().filter((r) => !admins.has(r.s)).length;
    const odg = vrstice.map((r) => ({ v3: r.v3, ...JSON.parse(r.odgovori) }));
    const n = odg.length;
    const prestej = (izbor, k) => (izbor.length >= MIN_ODGOVOROV ? Object.fromEntries(ODGOVORI[k].map((m) => [m, izbor.filter((a) => a[k] === m).length])) : null);
    const za = (v3) => odg.filter((a) => a.v3 === v3);
    return {
      n,
      min: MIN_ODGOVOROV,
      zavrnili: n >= MIN_ODGOVOROV ? zavrnili : null,
      pomaga: prestej(odg, "pomaga"),
      naprej: prestej(odg, "naprej"),
      placal: n >= MIN_ODGOVOROV ? prestej(za("placal"), "tretje") : null,
      priporocil: n >= MIN_ODGOVOROV ? prestej(za("priporocil"), "tretje") : null,
    };
  }
  return { stanje, oddaj, pozneje, porocilo };
}

export function mountAnketa(app, store, { loadStudent, accounts = null, isLocalRequest, adminEmails = [] }) {
  const a = createAnketa(store.db, { accounts });
  app.get("/api/students/:id/anketa-teden", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    res.set("Cache-Control", "no-store").json(a.stanje(s.id));
  });
  app.post("/api/students/:id/anketa-teden", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const r = a.oddaj(s.id, req.body);
    if (r.error) return res.status(r.status).json({ error: r.error });
    res.json({ ok: true });
  });
  app.post("/api/students/:id/anketa-teden/pozneje", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    a.pozneje(s.id);
    res.json({ ok: true });
  });
  app.get("/api/admin/anketa-teden", (req, res) => {
    const ok = accounts ? !!req.parent?.is_admin : isLocalRequest(req);
    if (!ok) return res.status(403).json({ error: "Samo za skrbnika." });
    res.set("Cache-Control", "no-store").json(a.porocilo({ adminEmails }));
  });
  return a;
}

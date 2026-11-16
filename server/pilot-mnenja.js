// Mnenja članov pilota (j, 2026-11-10): ocena 1–5 zvezdic, »Kaj ti je najbolj všeč?«, »Kaj te najbolj moti?« in
// ločeno dovoljenje za objavo brez imena (samo razred ali letnik). Aplikacija vpraša po smiselni uporabi (3 dni
// uporabe ali 10 rešenih nalog), največ enkrat na teden; vedno je dostopno v Jaz → »Povej mnenje« (public/mnenje.js).
// - Nič se ne objavi samodejno: dovoljenje je samo zapis (publish = 1 in besedilo, ki ga je učenec potrdil); objavo
//   naredi človek. Dovoljenje se da kadar koli preklicati (POST …/mnenje/objava).
// - Mlajši od 15 let (ali brez letnice rojstva): stikala ne vidi in strežnik dovoljenja ne sprejme (GDPR čl. 8,
//   brez soglasja starša objava ni mogoča).
// - Brez imena: v tabeli ni imena, besede imena profila (tudi sklonjene) v besedilu zamenja »[ime]«; skrbnik vidi
//   seznam brez imena, brez številke profila in brez ure (samo mesec), z naključno oznako mnenja (»M-7K2Q«).
// - Šifriranje besedil je odvisno od ključa EVKLID_DATA_KEY (server/crypto-polje.js SEALED). Brez ključa se besedili
//   NE shranita (kot fotografije pilota): shrani se samo ocena, aplikacija polj za besedilo ne pokaže.
// - Izbris profila ali računa izbriše mnenja (ON DELETE CASCADE); izvoz podatkov jih vsebuje (accounts/index.js).
//   Če je bilo za mnenje kdaj dano dovoljenje za objavo, ob izbrisu ostane samo zapis brez vsebine in brez povezave
//   z računom (pilot_mnenja_prenehalo: oznaka, razlog, dan), da skrbnik ve, da mora morebitno objavo umakniti.
//   Zapis se izbriše po TOMBSTONE_DAYS dneh.
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { cleanText } from "./settings.js";
import { seal, unseal, encryptionOn } from "./crypto-polje.js";
import { pilotMember } from "./pilot-naloge.js";

export const MIN_DAYS = 3; // dni uporabe (dnevi z vsaj eno točko XP)
export const MIN_SOLVED = 10; // ali rešenih nalog
export const ASK_EVERY_DAYS = 7; // vprašanje največ enkrat na teden
export const AFTER_OPINION_DAYS = 30; // po oddanem mnenju aplikacija sama ne vpraša znova prej kot čez 30 dni
export const TEXT_MAX = 600;
export const DAILY_MAX = 3; // oddanih mnenj na profil na dan
export const PUBLISH_MIN_AGE = 15;
// Različica besedila dovoljenja (public/i18n mn.publish): ob spremembi pomena povečaj.
export const CONSENT_VERSION = 2; // 2 (j, 10. 11. 2026): besedilo pove, da objavimo tudi zvezdice, in kje (stran evklid.app)
export const TOMBSTONE_DAYS = 365; // koliko časa ostane zapis »dovoljenje prenehalo (izbris)«

// Besedilo dovoljenja (ključ mn.publish) v vseh jezikih vmesnika: strežnik sprejme dovoljenje samo, če je učenec
// potrdil natanko eno od teh besedil (ne poljubnega niza).
const I18N = path.join(import.meta.dirname, "..", "public", "i18n");
let consentTexts = null; // Map besedilo → jezik
async function knownConsent(text) {
  if (!consentTexts) {
    const m = new Map();
    m.set((await import("../public/i18n/sl.js")).default["mn.publish"], "sl");
    for (const f of fs.readdirSync(path.join(I18N, "ui")).filter((x) => x.endsWith(".json"))) {
      const v = JSON.parse(fs.readFileSync(path.join(I18N, "ui", f), "utf8"))["mn.publish"];
      if (typeof v === "string" && !m.has(v)) m.set(v, f.slice(0, -5));
    }
    consentTexts = m;
  }
  return consentTexts.get(text) || null;
}

// Naključna oznaka mnenja za skrbnika (brez osebnih podatkov): »M-« in 4 znaki brez podobnih (0/O, 1/I).
const LABEL_CHARS = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const newLabel = () => "M-" + Array.from(crypto.randomBytes(4), (b) => LABEL_CHARS[b % LABEL_CHARS.length]).join("");

// Ime profila v besedilu zamenja »[ime]« (osebni podatek mladoletnih: raje preveč kot premalo; skrbnik vsako mnenje
// pred objavo prebere ročno). Vsaka beseda imena posebej, brez ločevanja velikih črk:
// - osnova = beseda brez končnega samoglasnika (Maja → Maj, Zalika → Zalik) in, pri besedi na soglasnik, tudi brez
//   neobstojnega e pred zadnjim soglasnikom (Peter → Petr, Pavel → Pavl; obe obliki, Aleš → Aleš ali Alš);
// - osnova s 3 ali več črkami: zamenja se VSAKA beseda, ki se začne z osnovo (Petra, Petru, Petrom; Maji; Brezovnika).
//   Dosledno tudi navadne besede: »Jan« zamenja »januar«, »Lana« zamenja »lani«, »Rok« zamenja »roka«;
// - osnova z 2 črkama (Ana, Eva): samo osnova s sklonsko končnico kot cela beseda (Ana, Ani, Anin; »analiza« ostane);
// - ime krajše od 3 črk (Al): samo kot cela beseda.
const ENDINGS = "a|e|i|o|u|ja|je|ju|jem|jev|jeva|jevo|jevi|jeve|jevega|jevem|ovem|evem|inem|em|om|ama|ami|ah|ih|ev|ov|eva|ova|evo|ovo|evi|ovi|eve|ove|in|ina|ine|ino|ini|eta|etu|etom|ega|emu|ovega|evega|inega";
const reEsc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const VOWEL = /[aeiou]$/i;
export function withoutName(text, name) {
  let out = String(text || "");
  const L = "\\p{L}\\p{N}";
  for (const w of String(name || "").split(/[^\p{L}\p{N}]+/u).filter((x) => [...x].length >= 2)) {
    const letters = [...w];
    let body;
    if (letters.length < 3) body = reEsc(w);
    else {
      const stems = new Set([VOWEL.test(w) ? letters.slice(0, -1).join("") : w]);
      // Neobstojni e: soglasnik + e + zadnji soglasnik (Peter → Petr).
      if (!VOWEL.test(w) && letters.length >= 4 && /[^aeiou]e[^aeiou]$/iu.test(w)) stems.add([...letters.slice(0, -2), letters.at(-1)].join(""));
      const long = [...stems].filter((x) => [...x].length >= 3);
      body = long.length ? `(?:${long.map(reEsc).join("|")})[${L}]*` : `${reEsc([...stems][0])}(?:${ENDINGS})?`;
    }
    out = out.replace(new RegExp(`(?<![${L}])${body}(?![${L}])`, "giu"), "[ime]");
  }
  return out;
}

const hasCol = (db, t, c) => db.prepare(`PRAGMA table_info(${t})`).all().some((x) => x.name === c);

export function migrateOpinions(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS pilot_mnenja (
      id INTEGER PRIMARY KEY,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      stars INTEGER NOT NULL,          -- 1–5
      liked TEXT,                      -- »Kaj ti je najbolj všeč?« (šifrirano)
      bothers TEXT,                    -- »Kaj te najbolj moti?« (šifrirano)
      grade TEXT,                      -- razred ali letnik ob oddaji (edina oznaka ob morebitni objavi)
      publish INTEGER NOT NULL DEFAULT 0, -- 1 = dovoli objavo brez imena
      consent TEXT,                    -- JSON {v, lang, text, at}: kaj je potrdil; ob preklicu dobi še withdrawn_at
      lang TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      label TEXT                       -- naključna oznaka za skrbnika (»M-7K2Q«), brez osebnih podatkov
    );
    CREATE INDEX IF NOT EXISTS idx_pilot_mnenja_student ON pilot_mnenja(student_id, created_at);
    -- Kdaj je aplikacija nazadnje sama vprašala (največ enkrat na teden).
    CREATE TABLE IF NOT EXISTS pilot_mnenja_vprasano (
      student_id INTEGER PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
      asked_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    -- Mnenje z (kdaj) danim dovoljenjem za objavo je izbrisano (izbris profila ali računa): samo oznaka, razlog in dan,
    -- brez vsebine in brez povezave z računom. Skrbnik po oznaki umakne morebitno objavo.
    CREATE TABLE IF NOT EXISTS pilot_mnenja_prenehalo (
      label TEXT PRIMARY KEY,
      reason TEXT NOT NULL DEFAULT 'izbris',
      day TEXT NOT NULL DEFAULT (date('now'))
    );
  `);
  if (!hasCol(db, "pilot_mnenja", "label")) db.exec("ALTER TABLE pilot_mnenja ADD COLUMN label TEXT");
  // Sproži se tudi ob kaskadnem izbrisu (izbris profila ali računa).
  db.exec(`CREATE TRIGGER IF NOT EXISTS pilot_mnenja_izbris BEFORE DELETE ON pilot_mnenja
    WHEN OLD.consent IS NOT NULL AND OLD.label IS NOT NULL BEGIN
      INSERT OR IGNORE INTO pilot_mnenja_prenehalo (label, reason) VALUES (OLD.label, 'izbris');
    END`);
  db.prepare("DELETE FROM pilot_mnenja_prenehalo WHERE day < date('now', ?)").run(`-${TOMBSTONE_DAYS} days`);
}

const ms = (sqlTime) => Date.parse(`${String(sqlTime).replace(" ", "T")}Z`);
const sqlTime = (d) => new Date(d).toISOString().slice(0, 19).replace("T", " ");

// Objavo sme dovoliti samo profil z znano letnico rojstva, ki je 15 let zagotovo že dopolnil. Poznamo samo letnico,
// zato velja: tekoče leto − letnica rojstva > 15 (v letu 15. rojstnega dne še šteje kot mlajši, tudi po rojstnem
// dnevu; enako kot pri fotografijah v pilotu). Brez letnice objava ni mogoča.
export function publishAllowed(db, studentId, now = new Date()) {
  try {
    if (!hasCol(db, "students", "birth_year")) return false;
    const y = db.prepare("SELECT birth_year FROM students WHERE id = ?").get(studentId)?.birth_year;
    return Number.isInteger(y) && now.getFullYear() - y > PUBLISH_MIN_AGE;
  } catch {
    return false;
  }
}

// Smiselna uporaba: vsaj MIN_DAYS dni z vajo ali vsaj MIN_SOLVED rešenih nalog.
export function usageOf(db, studentId) {
  const days = db.prepare("SELECT COUNT(DISTINCT substr(created_at, 1, 10)) AS n FROM xp_events WHERE student_id = ?").get(studentId).n;
  const solved = db.prepare("SELECT COUNT(*) AS n FROM tasks WHERE student_id = ? AND solved = 1").get(studentId).n;
  return { days, solved };
}

export function opinionState(db, studentId, { now = new Date() } = {}) {
  migrateOpinions(db);
  // Ali ima katero od oddanih mnenj dovoljenje za objavo (za gumb »Prekliči dovoljenje«).
  const published = !!db.prepare("SELECT 1 FROM pilot_mnenja WHERE student_id = ? AND publish = 1 LIMIT 1").get(studentId);
  // Bivši član pilota: mnenja ne odda več, dano dovoljenje pa še lahko prekliče (vrstica v Jaz ostane).
  if (!pilotMember(db, studentId)) return published ? { member: false, published: true } : { member: false };
  const last = db.prepare("SELECT created_at FROM pilot_mnenja WHERE student_id = ? ORDER BY id DESC LIMIT 1").get(studentId);
  const asked = db.prepare("SELECT asked_at FROM pilot_mnenja_vprasano WHERE student_id = ?").get(studentId);
  const { days, solved } = usageOf(db, studentId);
  const t = now.getTime();
  const due =
    (days >= MIN_DAYS || solved >= MIN_SOLVED) &&
    (!asked || t - ms(asked.asked_at) >= ASK_EVERY_DAYS * 864e5) &&
    (!last || t - ms(last.created_at) >= AFTER_OPINION_DAYS * 864e5);
  return {
    member: true,
    due,
    canPublish: publishAllowed(db, studentId, now),
    // Besedili shranimo samo šifrirani: brez ključa aplikacija polj ne pokaže in strežnik besedila ne shrani.
    canText: encryptionOn(),
    sent: db.prepare("SELECT COUNT(*) AS n FROM pilot_mnenja WHERE student_id = ?").get(studentId).n,
    published,
  };
}

const text = (v, name) => {
  if (!encryptionOn()) return null; // brez ključa bi bilo besedilo v bazi in kopijah nešifrirano
  const s = typeof v === "string" ? cleanText(withoutName(v, name), TEXT_MAX) : "";
  return s ? seal(s) : null;
};

// Seznam za skrbnika: brez imena, brez številke profila, brez ure (samo mesec); najnovejša najprej. Dovoljenje:
// "none" (ni dano), "given" ali "withdrawn" z dnem preklica (skrbnik mora morebitno objavo umakniti); consent_v je
// različica potrjenega besedila, consent_old = starejše besedilo od trenutnega (»staro besedilo – ne objavljaj«).
// `ended`: oznake izbrisanih mnenj, za katera je bilo dovoljenje kdaj dano (brez vsebine).
export function opinionsReport(db) {
  migrateOpinions(db);
  const rows = db
    .prepare("SELECT label, stars, liked, bothers, grade, publish, consent, substr(created_at, 1, 7) AS month FROM pilot_mnenja ORDER BY id DESC LIMIT 500")
    .all()
    .map((r) => {
      let c = null;
      try {
        c = r.consent ? JSON.parse(r.consent) : null;
      } catch {}
      const withdrawn = !r.publish && typeof c?.withdrawn_at === "string" ? c.withdrawn_at.slice(0, 10) : null;
      return {
        label: r.label || "",
        stars: r.stars,
        liked: unseal(r.liked, null) || "",
        bothers: unseal(r.bothers, null) || "",
        grade: r.grade || "",
        publish: !!r.publish,
        consent: r.publish ? "given" : withdrawn ? "withdrawn" : "none",
        // Različica potrjenega besedila dovoljenja; starejša od CONSENT_VERSION = staro besedilo, ne objavljaj.
        consent_v: Number.isInteger(c?.v) ? c.v : null,
        consent_old: !!c && !(Number.isInteger(c.v) && c.v >= CONSENT_VERSION),
        ...(withdrawn ? { withdrawn_day: withdrawn } : {}),
        month: r.month,
      };
    });
  const n = rows.length;
  const ended = db.prepare("SELECT label, reason, day FROM pilot_mnenja_prenehalo ORDER BY day DESC, label").all();
  return { n, avg: n ? Math.round((rows.reduce((a, r) => a + r.stars, 0) / n) * 10) / 10 : null, opinions: rows, ended };
}

export function mountOpinions(app, store, { loadStudent, accounts = false, isLocalRequest = () => false }) {
  const db = store.db;
  migrateOpinions(db);
  const isAdmin = (req) => (accounts ? !!req.parent?.is_admin : isLocalRequest(req));
  const member = (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return null;
    if (!pilotMember(db, s.id)) {
      res.status(403).json({ error: "Mnenja so samo za člane pilota." });
      return null;
    }
    return s;
  };

  app.get("/api/students/:id/pilot/mnenje", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    res.set("Cache-Control", "no-store").json(opinionState(db, s.id));
  });

  // Aplikacija je vprašanje pokazala: naslednjič najprej čez teden dni (tudi če ga učenec zapre brez odgovora).
  app.post("/api/students/:id/pilot/mnenje/vprasano", (req, res) => {
    const s = member(req, res);
    if (!s) return;
    db.prepare("INSERT INTO pilot_mnenja_vprasano (student_id, asked_at) VALUES (?, datetime('now')) ON CONFLICT(student_id) DO UPDATE SET asked_at = excluded.asked_at").run(s.id);
    res.json(opinionState(db, s.id));
  });

  app.post("/api/students/:id/pilot/mnenje", async (req, res) => {
    const s = member(req, res);
    if (!s) return;
    const b = req.body || {};
    const stars = b.stars;
    if (typeof stars !== "number" || !Number.isInteger(stars) || stars < 1 || stars > 5) return res.status(400).json({ error: "Izberi oceno od 1 do 5." });
    // Dovoljenje za objavo: samo izrecna vrednost true in samo z besedilom dovoljenja, kot ga pokaže aplikacija
    // (mn.publish v enem od jezikov vmesnika); drugačno besedilo ni dokaz privolitve.
    const consentLang = b.publish === true && typeof b.consent_text === "string" ? await knownConsent(b.consent_text) : null;
    if (b.publish === true && typeof b.consent_text === "string" && b.consent_text && !consentLang) return res.status(400).json({ error: "Besedilo dovoljenja ni veljavno. Osveži stran in poskusi znova." });
    if (db.prepare("SELECT COUNT(*) AS n FROM pilot_mnenja WHERE student_id = ? AND created_at >= ?").get(s.id, sqlTime(Date.now() - 864e5)).n >= DAILY_MAX)
      return res.status(429).json({ error: "Za danes je mnenj dovolj. Hvala!" });
    // Samo za profil, ki je 15 let zagotovo dopolnil (publishAllowed); shrani se besedilo, ki ga je učenec potrdil.
    const publish = !!consentLang && publishAllowed(db, s.id);
    const lang = cleanText(b.lang, 12) || s.settings?.language || "sl";
    const consent = publish ? JSON.stringify({ v: CONSENT_VERSION, lang: consentLang, text: b.consent_text, at: new Date().toISOString() }) : null;
    let label = newLabel();
    while (db.prepare("SELECT 1 FROM pilot_mnenja WHERE label = ? UNION SELECT 1 FROM pilot_mnenja_prenehalo WHERE label = ?").get(label, label)) label = newLabel();
    db.prepare("INSERT INTO pilot_mnenja (student_id, stars, liked, bothers, grade, publish, consent, lang, label) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").run(
      s.id,
      stars,
      text(b.liked, s.name),
      text(b.bothers, s.name),
      cleanText(s.settings?.curriculum_level, 60) || null,
      publish ? 1 : 0,
      consent,
      lang,
      label,
    );
    db.prepare("INSERT INTO pilot_mnenja_vprasano (student_id, asked_at) VALUES (?, datetime('now')) ON CONFLICT(student_id) DO UPDATE SET asked_at = excluded.asked_at").run(s.id);
    res.status(201).json({ ...opinionState(db, s.id), publish });
  });

  // Preklic dovoljenja za objavo (vsa mnenja profila). Tudi bivši član pilota ga lahko prekliče.
  app.post("/api/students/:id/pilot/mnenje/objava", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    if (req.body?.publish !== false) return res.status(400).json({ error: "Tukaj lahko dovoljenje samo prekličeš." });
    const at = new Date().toISOString();
    for (const r of db.prepare("SELECT id, consent FROM pilot_mnenja WHERE student_id = ? AND publish = 1").all(s.id)) {
      let c = {};
      try {
        c = JSON.parse(r.consent) || {};
      } catch {}
      db.prepare("UPDATE pilot_mnenja SET publish = 0, consent = ? WHERE id = ?").run(JSON.stringify({ ...c, withdrawn_at: at }), r.id);
    }
    res.json(opinionState(db, s.id));
  });

  app.get("/api/admin/pilot-mnenja", (req, res) => {
    if (!isAdmin(req)) return res.status(403).json({ error: "Samo za skrbnika." });
    res.set("Cache-Control", "no-store").json(opinionsReport(db));
  });
}

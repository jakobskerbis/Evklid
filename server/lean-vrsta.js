// Vrsta preverjanj z Lean (docs/lean.md, L5). Strežnik hrani naloge (samo matematična trditev in vrsta), delavec na
// j-jevem prenosniku jih pobira z izhodno povezavo (scripts/lean-delavec/delavec.mjs) in vrne izid. Strežnik nikoli
// ne kliče prenosnika in sam ne zažene Leana. Poti delavca zahtevajo dolg žeton iz EVKLID_LEAN_TOKEN (primerjan v
// stalnem času); brez žetona so izklopljene (404). Ta modul ne kliče AI (L6 doda gumb »Preveri z Lean« in strošek).
import "./env.js";
import crypto from "node:crypto";
import express from "express";
import { preveriTrditev, IZIDI, TAKTIKE, DOVOLJENI_AKSIOMI, NAJVEC_SPOROCILA } from "../scripts/lean-delavec/trditev.mjs";
import { VRSTE } from "../public/preverjanje/trditev.js";

export const NAJMANJ_ZNAKOV_ZETONA = 32;
export const PRIVZETO = {
  najemMs: 10 * 60 * 1000, // delavec ima nalogo največ toliko časa, nato gre nazaj v vrsto
  poskusov: 3, // po toliko potečenih najemih naloga dobi »timeout«
  cakaMs: 24 * 60 * 60 * 1000, // nepobrana naloga po tem dobi »timeout« (prenosnik ugasnjen)
  hraniDni: 7, // končane in stare naloge se izbrišejo
  najvecVVrsti: 500, // več čakajočih nalog → vpis zavrnjen
  utripMs: 3 * 60 * 1000, // delavec je »na voljo«, če se je oglasil v tem času
  napacnihNaIp: 10, // napačnih žetonov na IP v oknu → 429
  oknoMs: 15 * 60 * 1000,
  klicevNaMinuto: 120, // vseh klicev delavca skupaj (pravilen žeton) → 429
};

const ID = /^ln_[0-9a-f]{32}$/;
const NAJEM = /^[0-9a-f]{32}$/;
const sha = (s) => crypto.createHash("sha256").update(s).digest("hex");

export function ensureLeanTable(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS lean_naloge (
    id TEXT PRIMARY KEY,
    trditev TEXT NOT NULL,
    vrsta TEXT NOT NULL,
    sha TEXT NOT NULL,
    stanje TEXT NOT NULL CHECK (stanje IN ('queued','leased','proved','failed','rejected','timeout')),
    poskusi INTEGER NOT NULL DEFAULT 0,
    najem TEXT,
    najem_do INTEGER,
    taktika TEXT,
    aksiomi TEXT,
    sporocilo TEXT,
    razlicica TEXT,
    ms INTEGER,
    ustvarjeno INTEGER NOT NULL,
    koncano INTEGER
  );
  CREATE INDEX IF NOT EXISTS lean_naloge_stanje ON lean_naloge (stanje, ustvarjeno);
  CREATE INDEX IF NOT EXISTS lean_naloge_sha ON lean_naloge (sha);`);
}

/** Žeton iz okolja, če je dovolj dolg (sicer null: poti delavca so izklopljene). */
export function leanToken(env = process.env) {
  const t = String(env.EVKLID_LEAN_TOKEN || "").trim();
  return t.length >= NAJMANJ_ZNAKOV_ZETONA ? t : null;
}

function enakZeton(dan, pravi) {
  if (typeof dan !== "string" || !pravi) return false;
  const a = crypto.createHash("sha256").update(dan).digest();
  const b = crypto.createHash("sha256").update(pravi).digest();
  return crypto.timingSafeEqual(a, b);
}

const javno = (r) =>
  r && {
    id: r.id,
    vrsta: r.vrsta,
    stanje: r.stanje,
    koncano: ["proved", "failed", "rejected", "timeout"].includes(r.stanje),
    ...(r.taktika ? { taktika: r.taktika } : {}),
    ...(r.aksiomi ? { aksiomi: JSON.parse(r.aksiomi) } : {}),
    ...(r.sporocilo ? { sporocilo: r.sporocilo } : {}),
    ...(r.razlicica ? { razlicica: r.razlicica } : {}),
    ...(r.ms != null ? { ms: r.ms } : {}),
  };

/**
 * Vrsta nalog nad bazo. now() za teste. Vse metode so sinhrone (DatabaseSync).
 */
export function createLeanVrsta(db, { now = () => Date.now(), meje = {} } = {}) {
  ensureLeanTable(db);
  const M = { ...PRIVZETO, ...meje };
  let utrip = null; // { cas, razlicica, stanje } zadnjega klica delavca (v pomnilniku; po zagonu ga obnovi naslednji klic)

  function pocisti() {
    const t = now();
    db.prepare("DELETE FROM lean_naloge WHERE ustvarjeno < ?").run(t - M.hraniDni * 86400000);
    db.prepare("UPDATE lean_naloge SET stanje = 'timeout', sporocilo = 'delavec ni bil dosegljiv', koncano = ? WHERE stanje = 'queued' AND ustvarjeno < ?").run(t, t - M.cakaMs);
  }

  return {
    meje: M,
    pocisti,
    /**
     * Vpis v vrsto: SAMO trditev in vrsta (VRSTE iz public/preverjanje/trditev.js). Tretji argument je napaka:
     * v nalogo ne sme priti nič drugega (podatki učenca ostanejo na strežniku).
     * Vrne { id } ali { napaka }. Ista trditev in vrsta, ki še ni zavrnjena ali potekla, vrne obstoječo nalogo.
     */
    vpisi(trditev, vrsta, ...odvec) {
      if (odvec.length) throw new Error("lean-vrsta: naloga sme nositi samo trditev in vrsto");
      if (typeof vrsta !== "string" || !VRSTE.includes(vrsta)) return { napaka: "neznana vrsta" };
      const f = preveriTrditev(trditev);
      if (!f.ok) return { napaka: f.razlog };
      pocisti();
      const h = sha(`${vrsta}\n${f.trditev}`);
      const obstaja = db.prepare("SELECT id FROM lean_naloge WHERE sha = ? AND stanje IN ('queued','leased','proved','failed') ORDER BY ustvarjeno DESC LIMIT 1").get(h);
      if (obstaja) return { id: obstaja.id, obstaja: true };
      const vVrsti = db.prepare("SELECT COUNT(*) AS n FROM lean_naloge WHERE stanje IN ('queued','leased')").get().n;
      if (vVrsti >= M.najvecVVrsti) return { napaka: "vrsta je polna" };
      const id = `ln_${crypto.randomBytes(16).toString("hex")}`;
      db.prepare("INSERT INTO lean_naloge (id, trditev, vrsta, sha, stanje, ustvarjeno) VALUES (?, ?, ?, ?, 'queued', ?)").run(id, f.trditev, vrsta, h, now());
      return { id };
    },
    /** Stanje naloge za aplikacijo (brez najema). null, če je ni. */
    rezultat(id) {
      if (typeof id !== "string" || !ID.test(id)) return null;
      return javno(db.prepare("SELECT * FROM lean_naloge WHERE id = ?").get(id)) || null;
    },
    /** Delavec vzame naslednjo nalogo (najstarejšo). Potekel najem gre nazaj v vrsto ali po M.poskusov v »timeout«. */
    vzemi() {
      const t = now();
      pocisti();
      db.prepare("UPDATE lean_naloge SET stanje = 'timeout', sporocilo = 'delavec ni oddal izida', koncano = ?, najem = NULL WHERE stanje = 'leased' AND najem_do < ? AND poskusi >= ?").run(t, t, M.poskusov);
      const r = db.prepare("SELECT * FROM lean_naloge WHERE stanje = 'queued' OR (stanje = 'leased' AND najem_do < ?) ORDER BY ustvarjeno, id LIMIT 1").get(t);
      if (!r) return null;
      const najem = crypto.randomBytes(16).toString("hex");
      const ok = db.prepare("UPDATE lean_naloge SET stanje = 'leased', najem = ?, najem_do = ?, poskusi = poskusi + 1 WHERE id = ? AND stanje = ? AND (najem IS ? OR najem = ?)").run(najem, t + M.najemMs, r.id, r.stanje, r.najem, r.najem);
      if (ok.changes !== 1) return null;
      // Delavec dobi samo to (test preveri ključe): nič o učencu.
      return { id: r.id, trditev: r.trditev, najem, rokMs: M.najemMs };
    },
    /** Izid delavca. Vrne { ok } ali { napaka, koda }. */
    oddaj(b) {
      if (!b || typeof b !== "object" || Array.isArray(b)) return { napaka: "telo ni predmet", koda: 400 };
      const { id, najem, izid } = b;
      if (typeof id !== "string" || !ID.test(id) || typeof najem !== "string" || !NAJEM.test(najem)) return { napaka: "napačen id ali najem", koda: 400 };
      if (!IZIDI.includes(izid)) return { napaka: "neznan izid", koda: 400 };
      const sporocilo = b.sporocilo == null ? null : typeof b.sporocilo === "string" ? b.sporocilo.slice(0, NAJVEC_SPOROCILA) : undefined;
      if (sporocilo === undefined) return { napaka: "sporočilo ni besedilo", koda: 400 };
      let taktika = null;
      let aksiomi = null;
      if (izid === "proved") {
        if (!TAKTIKE.includes(b.taktika)) return { napaka: "neznana taktika", koda: 400 };
        if (!Array.isArray(b.aksiomi) || b.aksiomi.length > 3 || b.aksiomi.some((a) => !DOVOLJENI_AKSIOMI.includes(a))) return { napaka: "nedovoljeni aksiomi", koda: 400 };
        taktika = b.taktika;
        aksiomi = JSON.stringify([...new Set(b.aksiomi)]);
      }
      const ms = Number.isInteger(b.ms) && b.ms >= 0 && b.ms < 86400000 ? b.ms : null;
      const razlicica = typeof b.razlicica === "string" ? b.razlicica.replace(/[^\w .:/+-]/g, "").slice(0, 80) : null;
      const r = db.prepare("SELECT stanje, najem, najem_do FROM lean_naloge WHERE id = ?").get(id);
      if (!r) return { napaka: "ni naloge", koda: 404 };
      if (r.stanje !== "leased" || !enakZeton(najem, r.najem)) return { napaka: "najem ni več veljaven", koda: 409 };
      db.prepare("UPDATE lean_naloge SET stanje = ?, taktika = ?, aksiomi = ?, sporocilo = ?, razlicica = ?, ms = ?, koncano = ?, najem = NULL, najem_do = NULL WHERE id = ? AND najem = ?").run(izid, taktika, aksiomi, sporocilo, razlicica, ms, now(), id, najem);
      return { ok: true };
    },
    utrip(b = {}) {
      utrip = {
        cas: now(),
        razlicica: typeof b?.razlicica === "string" ? b.razlicica.replace(/[^\w .:/+-]/g, "").slice(0, 80) : null,
        stanje: typeof b?.stanje === "string" ? b.stanje.replace(/[^\w]/g, "").slice(0, 20) : null,
      };
      return { ok: true, cakajocih: db.prepare("SELECT COUNT(*) AS n FROM lean_naloge WHERE stanje = 'queued'").get().n };
    },
    /** Je delavec na voljo (oglasil se je pred kratkim)? Če ne, aplikacija pokaže »ni preverjeno z Lean«. */
    naVoljo() {
      return !!utrip && now() - utrip.cas < M.utripMs;
    },
    stanje() {
      const n = Object.fromEntries(db.prepare("SELECT stanje, COUNT(*) AS n FROM lean_naloge GROUP BY stanje").all().map((r) => [r.stanje, r.n]));
      return { vklopljen: !!leanToken(), naVoljo: this.naVoljo(), zadnjiUtripMs: utrip ? now() - utrip.cas : null, razlicica: utrip?.razlicica ?? null, naloge: n };
    },
  };
}

/**
 * Lean dokaz v skupnem zapisu trditve (docs/preverjanje.md, public/preverjanje/trditev.js). Samo »proved« je dokaz;
 * »failed« (taktike niso našle dokaza), »rejected« in »timeout« NISO »ne drži«, zato vrnejo null in status ostane,
 * kot ga dajo drugi motorji (aplikacija pokaže »ni preverjeno z Lean«). Popolnost (cela množica rešitev) pove klicatelj:
 * Lean dokaže samo zapisano trditev; privzeto »unknown«.
 */
export function dokazIzLean(n, trditev, { complete = "unknown" } = {}) {
  if (!n || n.stanje !== "proved" || !TAKTIKE.includes(n.taktika) || typeof trditev !== "string") return null;
  const izrek = `theorem t : ${trditev} := by intros; ${n.taktika}`;
  return {
    dokazi: [{ motor: "lean", holds: true, how: "formal", complete, ms: n.ms ?? null, razlicica: n.razlicica ?? null }],
    dokaz: { izrek, sha256: sha(izrek) },
  };
}

/**
 * Poti delavca (pred prijavo računov: delavec ni uporabnik, ima svoj žeton). Brez EVKLID_LEAN_TOKEN: 404.
 *   POST /api/lean/delavec/naloga    → 200 { id, trditev, najem, rokMs } ali 204 (ni nalog)
 *   POST /api/lean/delavec/rezultat  { id, najem, izid, sporocilo, taktika, aksiomi, ms, razlicica } → 200 / 4xx
 *   POST /api/lean/delavec/utrip     { razlicica, stanje } → 200 { ok, cakajocih }
 */
export function mountLeanDelavec(app, vrsta, { env = process.env, now = () => Date.now(), log = console } = {}) {
  const token = () => leanToken(env);
  if (String(env.EVKLID_LEAN_TOKEN || "").trim() && !token()) log.warn?.(`[lean] EVKLID_LEAN_TOKEN je krajši od ${NAJMANJ_ZNAKOV_ZETONA} znakov: delavec Lean je izklopljen`);
  const M = vrsta.meje;
  const napacni = new Map(); // ip → časi napačnih žetonov
  let klici = [];
  const ipOf = (req) => String((req.app.get("trust proxy") ? req.ip : req.headers["cf-connecting-ip"] || req.ip) || req.socket?.remoteAddress || "");
  const json = express.json({ limit: "16kb", strict: true });
  const router = express.Router();
  router.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    if (!token() || req.nekanonicnaApi) return res.status(404).json({ error: "Pot ne obstaja." });
    if (req.method !== "POST") return res.status(405).json({ error: "Samo POST." });
    const t = now();
    const ip = ipOf(req);
    const moji = (napacni.get(ip) || []).filter((x) => t - x < M.oknoMs);
    if (moji.length >= M.napacnihNaIp) return res.status(429).json({ error: "Preveč poskusov." });
    const m = String(req.headers.authorization || "").match(/^Bearer (\S+)$/);
    if (!enakZeton(m?.[1], token())) {
      if (napacni.size > 10000) napacni.clear();
      napacni.set(ip, [...moji, t]);
      return res.status(401).json({ error: "Napačen žeton." });
    }
    klici = klici.filter((x) => t - x < 60000);
    if (klici.length >= M.klicevNaMinuto) return res.status(429).json({ error: "Preveč klicev." });
    klici.push(t);
    next();
  });
  router.use(json);
  router.post("/naloga", (req, res) => {
    vrsta.utrip(req.body && typeof req.body === "object" ? req.body : {});
    const n = vrsta.vzemi();
    if (!n) return res.status(204).end();
    res.json(n);
  });
  router.post("/rezultat", (req, res) => {
    const r = vrsta.oddaj(req.body);
    if (r.napaka) return res.status(r.koda).json({ error: r.napaka });
    res.json({ ok: true });
  });
  router.post("/utrip", (req, res) => {
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) return res.status(400).json({ error: "Telo ni predmet." });
    res.json(vrsta.utrip(req.body));
  });
  router.use((req, res) => res.status(404).json({ error: "Pot ne obstaja." }));
  // Napake razčlenjevalnika (pokvarjen JSON, preveliko telo) → 4xx v JSON, nikoli 500.
  // eslint-disable-next-line no-unused-vars
  router.use((err, req, res, _next) => {
    const s = err?.status >= 400 && err.status < 500 ? err.status : 400;
    res.status(s).json({ error: s === 413 ? "Telo je preveliko." : "Neveljavno telo." });
  });
  app.use("/api/lean/delavec", router);
  const t = setInterval(() => {
    try {
      vrsta.pocisti();
    } catch (e) {
      log.warn?.(`[lean] čiščenje vrste: ${e.message}`);
    }
  }, 60 * 60 * 1000);
  t.unref?.();
}

/** Branje izida za aplikacijo (za prijavo računov): GET /api/lean/naloge/:id → stanje naloge ali 404. */
export function mountLeanBranje(app, vrsta) {
  app.get("/api/lean/naloge/:id", (req, res) => {
    res.set("Cache-Control", "no-store");
    const r = vrsta.rezultat(req.params.id);
    if (!r) return res.status(404).json({ error: "Naloge ni." });
    res.json(r);
  });
}

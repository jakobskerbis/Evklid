// Poti priprave na test iz zapiskov (docs/priprava.md, PR 2a): seznam, nova, ena, sprememba in izbris priprave ter
// dodajanje, prenos in izbris virov. Samo lastnik: vsaka poizvedba je omejena na profil iz poti (student_id), ki ga
// računi (server/accounts/index.js) že preverijo za prijavljeni račun. Tuj račun in drug profil istega računa dobita
// 404, tudi za obstoječ id. Brez AI in brez razčlenjevanja (PR 3). Vsebine (naslov, ime datoteke, izvirnik) ne gredo
// v dnevnik strežnika.
import express from "express";
import { seal, unseal } from "../crypto-polje.js";
import { cleanText } from "../settings.js";
import { danIzbrisa } from "./ciscenje.js";
import {
  preveriDatoteko, shraniIzvirnik, preberiIzvirnik, lahkoShranim, zVarnimBrisanjem,
  MEJE, MIME, NAJVEC_BAJTOV, NAJVEC_VIROV, NAJVEC_PRIPRAV, NAJVEC_SKUPAJ, zasedeno, prostorVsi,
} from "./shramba.js";

const NASLOV_MAX = 120;
const IME_MAX = 160;
const DAN = 86400000;
const PREDMET = /^[A-Z]{2,6}$/;

const idIz = (v) => (/^\d{1,15}$/.test(String(v ?? "")) ? Number(v) : NaN);
const sqlCas = (ms) => new Date(ms).toISOString().replace("T", " ").slice(0, 19);
const sqlDan = (ms) => new Date(ms).toISOString().slice(0, 10);

// Datum testa: YYYY-MM-DD, pravi koledarski dan, od včeraj (časovni pasovi) do 400 dni naprej. null = brez datuma.
// Vrne { ok, value } ali { ok: false }.
export function preveriDatum(v, now = Date.now()) {
  if (v === null || v === "") return { ok: true, value: null };
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return { ok: false };
  const t = Date.parse(`${v}T00:00:00Z`);
  if (!Number.isFinite(t) || sqlDan(t) !== v) return { ok: false };
  if (v < sqlDan(now - DAN) || v > sqlDan(now + 400 * DAN)) return { ok: false };
  return { ok: true, value: v };
}

// Ime datoteke iz glave X-Ime-Datoteke (encodeURIComponent), brez poti in kontrolnih znakov.
function imeIz(req) {
  let v = req.get("x-ime-datoteke");
  if (!v) return null;
  try {
    v = decodeURIComponent(v);
  } catch {
    return null;
  }
  v = v.replace(/[\u0000-\u001f\u007f]/g, "").split(/[\\/]/).pop();
  return cleanText(v, IME_MAX) || null;
}

const virVen = (r) => ({
  id: r.id,
  vrsta: r.vrsta,
  mime: r.mime,
  velikost: r.velikost,
  ime: r.ime == null ? null : unseal(r.ime),
  izvirnik: !!r.ima_izvirnik,
  created_at: r.created_at,
});
const pripravaVen = (r) => ({
  id: r.id,
  naslov: unseal(r.naslov),
  predmet: r.predmet,
  datum_testa: r.datum_testa,
  zadnja_uporaba: r.zadnja_uporaba,
  izbris_dne: danIzbrisa(r),
  created_at: r.created_at,
  ...(r.virov !== undefined ? { virov: r.virov } : {}),
});

/**
 * Poti pod /api/students/:id/priprave. loadStudent iz app.js (404 za neobstoječ profil); lastništvo profila preverijo
 * računi pred potjo. now(): ura (testi).
 */
export function mountPriprave(app, store, { loadStudent, now = () => Date.now() }) {
  const db = store.db;
  const niPriprave = (res) => res.status(404).json({ error: "Priprava ne obstaja." });
  const niVira = (res) => res.status(404).json({ error: "Vir ne obstaja." });
  const ena = (s, req) => {
    const pid = idIz(req.params.pid);
    return Number.isFinite(pid) ? db.prepare("SELECT * FROM priprave WHERE id = ? AND student_id = ?").get(pid, s.id) : undefined;
  };
  const uporabljena = (p) => db.prepare("UPDATE priprave SET zadnja_uporaba = ? WHERE id = ?").run(sqlCas(now()), p.id);
  const viriOd = (p) =>
    db
      .prepare(
        `SELECT v.*, EXISTS (SELECT 1 FROM priprava_izvirniki i WHERE i.vir_id = v.id) AS ima_izvirnik
         FROM priprava_viri v WHERE v.priprava_id = ? AND v.student_id = ? ORDER BY v.id`,
      )
      .all(p.id, p.student_id)
      .map(virVen);
  const celotna = (p) => ({ ...pripravaVen(db.prepare("SELECT * FROM priprave WHERE id = ?").get(p.id)), viri: viriOd(p) });

  app.get("/api/students/:id/priprave", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const rows = db
      .prepare("SELECT p.*, (SELECT COUNT(*) FROM priprava_viri v WHERE v.priprava_id = p.id) AS virov FROM priprave p WHERE p.student_id = ? ORDER BY p.id DESC")
      .all(s.id);
    res.set("Cache-Control", "no-store").json({ priprave: rows.map(pripravaVen) });
  });

  app.post("/api/students/:id/priprave", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const b = req.body || {};
    const naslov = cleanText(b.naslov, NASLOV_MAX);
    if (!naslov) return res.status(400).json({ error: "Vpiši naslov priprave." });
    const predmet = b.predmet == null || b.predmet === "" ? null : String(b.predmet).toUpperCase();
    if (predmet !== null && !PREDMET.test(predmet)) return res.status(400).json({ error: "Napačen predmet." });
    const d = preveriDatum(b.datum_testa ?? null, now());
    if (!d.ok) return res.status(400).json({ error: "Napačen datum testa." });
    if (db.prepare("SELECT COUNT(*) AS n FROM priprave WHERE student_id = ?").get(s.id).n >= NAJVEC_PRIPRAV)
      return res.status(409).json({ error: `Imaš že ${NAJVEC_PRIPRAV} priprav. Izbriši staro, da dodaš novo.`, code: "priprava_polno" });
    const t = sqlCas(now());
    const id = Number(
      db
        .prepare("INSERT INTO priprave (student_id, naslov, predmet, datum_testa, zadnja_uporaba, created_at) VALUES (?, ?, ?, ?, ?, ?)")
        .run(s.id, seal(naslov), predmet, d.value, t, t).lastInsertRowid,
    );
    res.status(201).json({ priprava: celotna({ id, student_id: s.id }) });
  });

  app.get("/api/students/:id/priprave/:pid", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const p = ena(s, req);
    if (!p) return niPriprave(res);
    uporabljena(p);
    res.set("Cache-Control", "no-store").json({ priprava: celotna(p) });
  });

  // Sprememba naslova ali datuma testa. Nov datum (ali odstranjen datum) začne nov rok izbrisa.
  app.put("/api/students/:id/priprave/:pid", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const p = ena(s, req);
    if (!p) return niPriprave(res);
    const b = req.body || {};
    const set = [];
    const args = [];
    if (b.naslov !== undefined) {
      const naslov = cleanText(b.naslov, NASLOV_MAX);
      if (!naslov) return res.status(400).json({ error: "Vpiši naslov priprave." });
      set.push("naslov = ?");
      args.push(seal(naslov));
    }
    if (b.datum_testa !== undefined) {
      const d = preveriDatum(b.datum_testa, now());
      if (!d.ok) return res.status(400).json({ error: "Napačen datum testa." });
      set.push("datum_testa = ?");
      args.push(d.value);
    }
    set.push("zadnja_uporaba = ?");
    args.push(sqlCas(now()));
    db.prepare(`UPDATE priprave SET ${set.join(", ")} WHERE id = ? AND student_id = ?`).run(...args, p.id, s.id);
    res.json({ priprava: celotna(p) });
  });

  // Izbris takoj: priprava, viri in izvirniki (ON DELETE CASCADE), izbrisani bajti prepisani (secure_delete).
  app.delete("/api/students/:id/priprave/:pid", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const p = ena(s, req);
    if (!p) return niPriprave(res);
    zVarnimBrisanjem(db, () => db.prepare("DELETE FROM priprave WHERE id = ? AND student_id = ?").run(p.id, s.id));
    res.json({ ok: true });
  });

  // Nov vir: datoteka kot telo zahteve (fotografija, PDF, .docx, .pptx; vrsta po vsebini, ime v glavi X-Ime-Datoteke)
  // ali JSON { besedilo, ime } za prilepljeno besedilo (prek splošnega razčlenjevalnika JSON, 100 kb).
  const surovo = express.raw({ type: () => true, limit: NAJVEC_BAJTOV });
  app.post("/api/students/:id/priprave/:pid/viri", (req, res, next) => {
    // Lastništvo pred branjem telesa: tuj ali neobstoječ id ne porabi 15 MB pomnilnika.
    const s = loadStudent(req, res);
    if (!s) return;
    const p = ena(s, req);
    if (!p) return niPriprave(res);
    req.priprava = { s, p };
    if (req.is("application/json")) return next();
    surovo(req, res, next);
  }, (req, res) => {
    // Znova po branju telesa: priprava je bila med nalaganjem morda izbrisana (drug zavihek, dnevno čiščenje).
    const s = req.priprava.s;
    const p = ena(s, req);
    if (!p) return niPriprave(res);
    if (!lahkoShranim()) return res.status(503).json({ error: "Shranjevanje virov ni nastavljeno (manjka ključ za šifriranje).", code: "priprava_brez_kljuca" });
    let buf;
    let t;
    let ime;
    if (req.is("application/json")) {
      const b = req.body || {};
      if (typeof b.besedilo !== "string" || !b.besedilo.trim()) return res.status(400).json({ error: "Besedilo manjka." });
      if (b.besedilo.length > MEJE.besedilo) return res.status(413).json({ error: "Besedilo je predolgo.", code: "priprava_velikost" });
      buf = Buffer.from(b.besedilo.replace(/\u0000/g, ""), "utf8");
      t = { vrsta: "besedilo", mime: MIME.besedilo };
      ime = cleanText(typeof b.ime === "string" ? b.ime : "", IME_MAX) || null;
    } else {
      const v = preveriDatoteko(Buffer.isBuffer(req.body) ? req.body : null);
      if (!v.ok) return res.status(v.status).json({ error: v.error, code: v.code });
      buf = req.body;
      t = v;
      ime = imeIz(req);
    }
    if (db.prepare("SELECT COUNT(*) AS n FROM priprava_viri WHERE priprava_id = ?").get(p.id).n >= NAJVEC_VIROV)
      return res.status(409).json({ error: `Priprava ima že ${NAJVEC_VIROV} virov.`, code: "priprava_viri_polno" });
    if (zasedeno(db, s.id) + buf.length > NAJVEC_SKUPAJ) return res.status(409).json({ error: "Za vire ni več prostora. Izbriši stare priprave ali vire.", code: "priprava_prostor" });
    if (zasedeno(db) + buf.length > prostorVsi()) return res.status(507).json({ error: "Prostor za vire je trenutno poln. Poskusi pozneje.", code: "priprava_prostor_streznik" });
    let virId;
    db.exec("BEGIN IMMEDIATE");
    try {
      virId = Number(
        db
          .prepare("INSERT INTO priprava_viri (priprava_id, student_id, vrsta, mime, velikost, ime, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)")
          .run(p.id, s.id, t.vrsta, t.mime, buf.length, ime === null ? null : seal(ime), sqlCas(now())).lastInsertRowid,
      );
      shraniIzvirnik(db, virId, buf);
      uporabljena(p);
      db.exec("COMMIT");
    } catch (e) {
      db.exec("ROLLBACK");
      throw e;
    }
    const vir = viriOd(p).find((v) => v.id === virId);
    res.status(201).json({ vir });
  });

  const enVir = (s, p, req) => {
    const vid = idIz(req.params.vid);
    return Number.isFinite(vid) ? db.prepare("SELECT * FROM priprava_viri WHERE id = ? AND priprava_id = ? AND student_id = ?").get(vid, p.id, s.id) : undefined;
  };

  // Izvirnik lastniku (pogled in pravica do dostopa): vedno kot priponka, s tipom, ki ga je določila vsebina.
  app.get("/api/students/:id/priprave/:pid/viri/:vid/izvirnik", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const p = ena(s, req);
    if (!p) return niPriprave(res);
    const v = enVir(s, p, req);
    if (!v) return niVira(res);
    const buf = preberiIzvirnik(db, v.id);
    if (!buf) return res.status(404).json({ error: "Izvirnika ni več.", code: "priprava_ni_izvirnika" });
    uporabljena(p);
    const konc = { slika: v.mime === MIME.png ? "png" : v.mime === MIME.webp ? "webp" : "jpg", pdf: "pdf", word: "docx", powerpoint: "pptx", besedilo: "txt" }[v.vrsta] || "bin";
    res.set({
      "Content-Type": v.mime,
      "Content-Disposition": `attachment; filename="vir-${v.id}.${konc}"`,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "sandbox; default-src 'none'",
    });
    res.send(buf);
  });

  app.delete("/api/students/:id/priprave/:pid/viri/:vid", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const p = ena(s, req);
    if (!p) return niPriprave(res);
    const v = enVir(s, p, req);
    if (!v) return niVira(res);
    zVarnimBrisanjem(db, () => db.prepare("DELETE FROM priprava_viri WHERE id = ? AND student_id = ?").run(v.id, s.id));
    uporabljena(p);
    res.json({ ok: true });
  });
}

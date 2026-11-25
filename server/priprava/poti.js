// Poti priprave na test iz zapiskov (docs/priprava.md, PR 2a): seznam, nova, ena, sprememba in izbris priprave ter
// dodajanje, prenos in izbris virov. Samo lastnik: vsaka poizvedba je omejena na profil iz poti (student_id), ki ga
// računi (server/accounts/index.js) že preverijo za prijavljeni račun. Tuj račun in drug profil istega računa dobita
// 404, tudi za obstoječ id. Brez AI in brez razčlenjevanja (PR 3). Vsebine (naslov, ime datoteke, izvirnik) ne gredo
// v dnevnik strežnika.
import express from "express";
import { seal, unseal } from "../crypto-polje.js";
import { cleanText } from "../settings.js";
import { danIzbrisa } from "./ciscenje.js";
import { uvoziVNiti, preberiVir, NapakaUvoza } from "./uvoz.js";
import { shraniIzseke, razrezi, VRSTE, izbrisiPostavkeVira } from "./izseki.js";
import { zemljevid } from "./teme.js";
import { sestaviNacrt, ocenaTeme } from "./nacrt.js";
import { STANJE_OCENE, LIST } from "../progress.js";
import { rateLimiter } from "../vaja-iz-lista.js";
import { razloziTemo, preveriRazlago, izberiIzseke, rezervaRazlage, odtisIzsekov, sporociloRazlage } from "./postavke.js";
import { lokalnaVrsta } from "../nujno.js";
import { getTopic } from "../curriculum.js";
import { hasGenerator } from "../practice/index.js";
import { nowParts } from "../schedule.js";
import { readNotePhoto, readReserveUsd, pageLimit, pagesUsed, takePage, givePage, nextMonth } from "../zapiski.js";
import { nujnoZa } from "../nujno.js";
import { AI_JSON } from "../ai-oznaka.js";
import {
  preveriDatoteko, shraniIzvirnik, preberiIzvirnik, lahkoShranim, zVarnimBrisanjem,
  MEJE, MIME, NAJVEC_BAJTOV, NAJVEC_VIROV, NAJVEC_PRIPRAV, NAJVEC_SKUPAJ, NAJVEC_HKRATI, zasedeno, prostorVsi,
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
  if (typeof v !== "string" || !v) return null;
  try {
    v = decodeURIComponent(v);
  } catch {
    return null;
  }
  v = v.replace(/[\u0000-\u001f\u007f]/g, "").split(/[\\/]/).pop();
  return cleanText(v, IME_MAX) || null;
}

const sklopiIz = (v) => {
  try {
    const a = JSON.parse(v || "[]");
    return Array.isArray(a) ? a : [];
  } catch {
    return [];
  }
};

const jsonIz = (v, privzeto) => {
  try {
    return v ? JSON.parse(v) : privzeto;
  } catch {
    return privzeto;
  }
};
const virVen = (r) => ({
  id: r.id,
  vrsta: r.vrsta,
  mime: r.mime,
  velikost: r.velikost,
  ime: r.ime == null ? null : unseal(r.ime),
  izvirnik: !!r.ima_izvirnik,
  created_at: r.created_at,
  // Obdelava (PR 3a): caka | obdelan | branje (fotografija ali skeniran PDF čaka na branje) | napaka
  stanje: r.stanje || (r.vrsta === "slika" ? "branje" : "caka"),
  strani: r.strani ?? null,
  napaka: r.napaka ?? null,
  opozorila: jsonIz(r.opozorila, []),
  izsekov: r.izsekov ?? 0,
});
const izsekVen = (r) => ({
  id: r.id,
  vir_id: r.vir_id,
  stran: r.stran,
  zaporedje: r.zaporedje,
  vrsta: r.vrsta,
  naslov: r.naslov == null ? null : unseal(r.naslov),
  besedilo: unseal(r.besedilo),
  negotovo: r.negotovo == null ? [] : jsonIz(unseal(r.negotovo), []),
  ...(r.ai ? AI_JSON : {}), // prepis modela (fotografija, skenirana stran)
});
const pripravaVen = (r) => ({
  id: r.id,
  naslov: unseal(r.naslov),
  predmet: r.predmet,
  datum_testa: r.datum_testa,
  zadnja_uporaba: r.zadnja_uporaba,
  izbris_dne: danIzbrisa(r),
  created_at: r.created_at,
  // Načrt testa (PR 2b, server/priprava/aktivna.js): aktivna = »Priprava na test« v Vadnici in Urniku.
  aktivna: !!r.aktivna,
  pot: r.pot ?? null,
  sklopi: sklopiIz(r.sklopi),
  dogodek_id: r.dogodek_id ?? null,
  ...(r.virov !== undefined ? { virov: r.virov } : {}),
});

/**
 * Poti pod /api/students/:id/priprave. loadStudent iz app.js (404 za neobstoječ profil); lastništvo profila preverijo
 * računi pred potjo. now(): ura (testi).
 */
export function mountPriprave(app, store, { loadStudent, now = () => Date.now(), log = console, usage = null, rightsFor = null, readFn = readNotePhoto, progress = null, razlagaFn = razloziTemo }) {
  const db = store.db;
  // Izbris profila (DELETE /api/students/:id, store.deleteStudent) odnese priprave s kaskado; s secure_delete, da
  // šifrirani izvirniki ne ostanejo v prostih straneh baze (izbris računa: server/accounts/izbris.js).
  const izbrisiProfil = store.deleteStudent.bind(store);
  store.deleteStudent = (id) => zVarnimBrisanjem(db, () => izbrisiProfil(id));
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
        `SELECT v.*, EXISTS (SELECT 1 FROM priprava_izvirniki i WHERE i.vir_id = v.id) AS ima_izvirnik,
           (SELECT COUNT(*) FROM priprava_izseki z WHERE z.vir_id = v.id) AS izsekov
         FROM priprava_viri v WHERE v.priprava_id = ? AND v.student_id = ? ORDER BY v.id`,
      )
      .all(p.id, p.student_id)
      .map(virVen);
  const celotna = (p) => ({ ...pripravaVen(db.prepare("SELECT * FROM priprave WHERE id = ?").get(p.id)), viri: viriOd(p) });

  // Obdelava vira (PR 3a): besedilo, Word, PowerPoint, PDF z besedilom → izseki. Shranjeni prepisi modela (fotografija,
  // skenirane strani PDF, PR 3b) se vstavijo na svoje strani, zato ponovna obdelava ne kliče modela. Vir ostane
  // »branje«, dokler ima neprebrane skenirane strani. Uvoz teče v ločeni niti; hkrati največ OBDELAVE_HKRATI, sicer
  // vir ostane »caka« in ga odjemalec obdela pozneje (POST …/viri/:vid/obdelaj).
  let obdelujem = 0;
  const OBDELAVE_HKRATI = 2;
  const napakaVira = (vir, koda) => db.prepare("UPDATE priprava_viri SET stanje = 'napaka', napaka = ? WHERE id = ?").run(koda, vir.id);
  const obstaja = (virId) => !!db.prepare("SELECT 1 FROM priprava_viri WHERE id = ?").get(virId);
  const prepisiVira = (virId) => db.prepare("SELECT stran, stanje, besedilo FROM priprava_prepisi WHERE vir_id = ? ORDER BY stran").all(virId);
  const besedilaPrepisov = (rows) => Object.fromEntries(rows.filter((r) => r.stanje === "ok" && r.besedilo).map((r) => [r.stran, unseal(r.besedilo)]));
  const shraniPrepis = (vir, stran, stanje, besedilo = null) =>
    db
      .prepare(
        `INSERT INTO priprava_prepisi (vir_id, priprava_id, student_id, stran, stanje, besedilo) VALUES (?, ?, ?, ?, ?, ?)
         ON CONFLICT (vir_id, stran) DO UPDATE SET stanje = excluded.stanje, besedilo = excluded.besedilo, created_at = datetime('now')`,
      )
      .run(vir.id, vir.priprava_id, vir.student_id, stran, stanje, besedilo == null ? null : seal(besedilo));
  // Skenirane strani vira PDF iz opozoril zadnjega uvoza.
  const skeniraneStrani = (vir) => jsonIz(vir.opozorila, []).find((o) => o?.koda === "uvoz_brez_besedila")?.strani || [];

  // Izseki iz izvirnika in shranjenih prepisov. Fotografija: prepis strani 1. Vrne false, če vira ni več.
  async function sestavi(vir, buf) {
    const rows = prepisiVira(vir.id);
    const prepisi = besedilaPrepisov(rows);
    const ai = new Set(Object.keys(prepisi).map(Number));
    if (vir.vrsta === "slika") {
      const r = rows.find((x) => x.stran === 1);
      const izseki = prepisi[1] ? razrezi((await preberiVir("besedilo", Buffer.from(prepisi[1], "utf8"))).strani).map((i) => ({ ...i, ai: true })) : [];
      if (!izseki.length) {
        if (!r) return obstaja(vir.id);
        napakaVira(vir, r.stanje === "neucno" ? "branje_neucno" : "branje_prazno");
        return obstaja(vir.id);
      }
      return shraniIzseke(db, { vir, izseki, strani: 1, opozorila: [], stanje: "obdelan", seal });
    }
    const r = await uvoziVNiti(vir.vrsta, buf, { prepisi });
    const prebrane = new Set(rows.map((x) => x.stran));
    const brez = r.brezBesedila.slice(0, 100);
    const opozorila = [...r.opozorila, ...(brez.length ? [{ koda: "uvoz_brez_besedila", strani: brez }] : [])];
    const brezSlike = rows.filter((x) => x.stanje === "sken_ni_slike" || x.stanje === "sken_napaka").map((x) => x.stran);
    if (brezSlike.length) opozorila.push({ koda: "sken_ni_slike", strani: brezSlike });
    const stanje = brez.some((n) => !prebrane.has(n)) ? "branje" : "obdelan";
    return shraniIzseke(db, { vir, izseki: r.izseki.map((i) => ({ ...i, ai: ai.has(i.stran) })), strani: r.strani, opozorila, stanje, seal });
  }

  async function obdelaj(vir, buf) {
    if (vir.vrsta === "slika") {
      if (!prepisiVira(vir.id).length) db.prepare("UPDATE priprava_viri SET stanje = 'branje' WHERE id = ?").run(vir.id);
      else await sestavi(vir, buf);
      return;
    }
    if (obdelujem >= OBDELAVE_HKRATI) return;
    obdelujem++;
    try {
      await sestavi(vir, buf);
    } catch (e) {
      if (!(e instanceof NapakaUvoza)) throw e;
      napakaVira(vir, e.code);
    } finally {
      obdelujem--;
    }
  }

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
    if (b.predmet != null && typeof b.predmet !== "string") return res.status(400).json({ error: "Napačen predmet." });
    const predmet = b.predmet == null || b.predmet === "" ? null : b.predmet.toUpperCase();
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
    const b = req.body;
    if (!b || typeof b !== "object" || Array.isArray(b) || (b.naslov === undefined && b.datum_testa === undefined)) return res.status(400).json({ error: "Ni sprememb." });
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
  // Hkratna nalaganja (pomnilnik: vsako drži telo do 15 MB in šifrirano kopijo): največ eno na profil in nekaj vseh.
  const vTeku = new Set();
  const preveriProstor = (s, p, bajtov) => {
    if (db.prepare("SELECT COUNT(*) AS n FROM priprava_viri WHERE priprava_id = ?").get(p.id).n >= NAJVEC_VIROV)
      return [409, { error: `Priprava ima že ${NAJVEC_VIROV} virov.`, code: "priprava_viri_polno" }];
    if (zasedeno(db, s.id) + bajtov > NAJVEC_SKUPAJ) return [409, { error: "Za vire ni več prostora. Izbriši stare priprave ali vire.", code: "priprava_prostor" }];
    if (zasedeno(db) + bajtov > prostorVsi()) return [507, { error: "Prostor za vire je trenutno poln. Poskusi pozneje.", code: "priprava_prostor_streznik" }];
    return null;
  };
  app.post("/api/students/:id/priprave/:pid/viri", (req, res, next) => {
    // Lastništvo, meje in prostor pred branjem telesa: tuj ali neobstoječ id in poln prostor ne porabijo 15 MB pomnilnika.
    const s = loadStudent(req, res);
    if (!s) return;
    const p = ena(s, req);
    if (!p) return niPriprave(res);
    req.priprava = { s, p };
    if (req.is("application/json")) return next();
    const dolzina = Number(req.get("content-length"));
    if (Number.isFinite(dolzina) && dolzina > NAJVEC_BAJTOV) return res.status(413).json({ error: "Datoteka je prevelika.", code: "priprava_velikost" });
    const polno = preveriProstor(s, p, Number.isFinite(dolzina) ? dolzina : 0);
    if (polno) return res.status(polno[0]).json(polno[1]);
    if (vTeku.has(s.id) || vTeku.size >= NAJVEC_HKRATI) return res.status(429).set("Retry-After", "5").json({ error: "Nalaganje že teče. Poskusi čez nekaj sekund.", code: "priprava_zasedeno" });
    vTeku.add(s.id);
    res.on("close", () => vTeku.delete(s.id));
    surovo(req, res, next);
  }, async (req, res) => {
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
      if (Buffer.byteLength(b.besedilo, "utf8") > MEJE.besedilo) return res.status(413).json({ error: "Besedilo je predolgo.", code: "priprava_velikost" });
      buf = Buffer.from(b.besedilo.replace(/\u0000/g, ""), "utf8");
      t = { vrsta: "besedilo", mime: MIME.besedilo };
      ime = cleanText(typeof b.ime === "string" ? b.ime : "", IME_MAX) || null;
    } else {
      // Telo mora biti Buffer iz express.raw (ne niz, polje ali predmet iz drugega razčlenjevalnika).
      const telo = req.body;
      if (Array.isArray(telo) || typeof telo !== "object" || !Buffer.isBuffer(telo)) return res.status(400).json({ error: "Datoteka manjka.", code: "priprava_prazno" });
      const v = preveriDatoteko(telo);
      if (!v.ok) return res.status(v.status).json({ error: v.error, code: v.code });
      buf = telo;
      t = v;
      ime = imeIz(req);
    }
    // Znova z dejansko velikostjo (Content-Length morda manjka); sinhrono do vpisa, zato brez tekme.
    const polno = preveriProstor(s, p, buf.length);
    if (polno) return res.status(polno[0]).json(polno[1]);
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
    try {
      await obdelaj({ id: virId, priprava_id: p.id, student_id: s.id, vrsta: t.vrsta }, buf);
    } catch (e) {
      // Nepričakovana napaka branja: vir je shranjen, obdelava se lahko ponovi.
      napakaVira({ id: virId }, "uvoz_napaka");
      log.error?.(`[evklid] obdelava vira priprave: ${e?.name || "napaka"}`);
    }
    const vir = viriOd(p).find((v) => v.id === virId);
    // Vir ali priprava je bila med branjem izbrisana (drug zavihek, čiščenje).
    if (!vir) return niVira(res);
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

  // Ponovna obdelava vira (vir »caka« ali »napaka«, ali po izboljšanem uvozu). Fotografije: 409 (preberi jih …/preberi).
  app.post("/api/students/:id/priprave/:pid/viri/:vid/obdelaj", async (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const p = ena(s, req);
    if (!p) return niPriprave(res);
    const v = enVir(s, p, req);
    if (!v) return niVira(res);
    if (v.vrsta === "slika") return res.status(409).json({ error: "Fotografijo prebere …/preberi.", code: "priprava_branje" });
    if (berem.has(v.id)) return res.status(409).json({ error: "Vir se že bere.", code: "priprava_zasedeno" });
    if (obdelujem >= OBDELAVE_HKRATI) return res.status(429).set("Retry-After", "5").json({ error: "Obdelava že teče. Poskusi čez nekaj sekund.", code: "priprava_zasedeno" });
    const buf = preberiIzvirnik(db, v.id);
    if (!buf) return res.status(404).json({ error: "Izvirnika ni več.", code: "priprava_ni_izvirnika" });
    try {
      await obdelaj(v, buf);
    } catch (e) {
      napakaVira(v, "uvoz_napaka");
      log.error?.(`[evklid] obdelava vira priprave: ${e?.name || "napaka"}`);
    }
    uporabljena(p);
    res.json({ vir: viriOd(p).find((x) => x.id === v.id) || null });
  });

  // Branje z modelom (PR 3b): fotografija vira ali skenirane strani PDF (največ SKEN_NAENKRAT na zahtevek; slike strani
  // naredi sken.js v ločeni niti). Isto branje kot »Moji zapiski« (server/zapiski.js readNotePhoto: prepis brez
  // popravkov, imena → [ime], zavrnitev neučnih fotografij, zastavica stiske), ista mesečna meja strani (STRANI, ena
  // slika = ena stran) in trda meja AI. Prepisi se shranijo šifrirano (priprava_prepisi), izseki iz njih imajo oznako AI.
  // Že prebrane strani se ne berejo znova (brez stroška); fotografijo prebere znova ?znova=1, slabši izid (neučno,
  // prazno) pa ne zamenja dobrega prejšnjega. Stran se ne porabi, če klica ni bilo. Izvirnik ostane šifriran.
  const berem = new Set();
  const SKEN_NAENKRAT = 5;
  const SLIKA_MODEL_B64 = 5 * 1024 * 1024; // meja slike pri modelu (base64)
  const straniInfo = (s) => {
    const limit = pageLimit(rightsFor ? rightsFor(s.id) : null, s.settings);
    const used = pagesUsed(db, s.id);
    return { used, limit, left: Math.max(0, limit - used), renews: nextMonth() };
  };
  // Ena slika: stran iz meje, trda meja AI, klic. Vrne { stanje: ok|neucno|prazno, besedilo } ali { ustavi: meja|ai|mock }.
  // Zastavica stiske gre v st.nujno takoj po klicu, da jo dobi tudi odgovor ob poznejši napaki.
  async function preberiSliko(s, b64, mediaType, st) {
    if (!takePage(db, s.id, pageLimit(rightsFor ? rightsFor(s.id) : null, s.settings))) return { ustavi: "meja" };
    const hold = usage?.guard ? usage.guard(s.id, readReserveUsd()) : null;
    if (usage?.guard && !hold) {
      givePage(db, s.id);
      return { ustavi: "ai" };
    }
    let placano = false;
    try {
      const out = await readFn({ imageBase64: b64, mediaType });
      if (out.mock) {
        givePage(db, s.id);
        return { ustavi: "mock" };
      }
      if (out.usage) {
        placano = true;
        try {
          usage?.log(s.id, out.model, out.usage, "priprava");
        } catch {
          // profil izbrisan med klicem: zapis stroška ne sme zavreči odgovora (stiska)
        }
      }
      if (out.distress && !st.nujno) st.nujno = nujnoZa(out.distress, s.settings);
      if (out.unrelated) return { stanje: "neucno" };
      return out.text ? { stanje: "ok", besedilo: out.text } : { stanje: "prazno" };
    } catch (e) {
      if (!placano) givePage(db, s.id);
      throw e;
    } finally {
      hold?.release();
    }
  }

  // Slike skeniranih strani v ločeni niti. Če nit pade (čas, pomnilnik, poškodovana stran), poskusi strani eno po eno;
  // stran, ki tudi sama pade, dobi »sken_napaka« in se ne poskuša znova (vir lahko konča obdelavo).
  async function slikeZaStrani(buf, strani) {
    try {
      return (await uvoziVNiti("pdf", buf, { sken: { strani, najvec: strani.length } })).slike;
    } catch (e) {
      if (!(e instanceof NapakaUvoza)) throw e;
      if (strani.length === 1) return [{ stran: strani[0], napaka: "sken_napaka" }];
      const out = [];
      for (const n of strani) out.push(...(await slikeZaStrani(buf, [n])));
      return out;
    }
  }

  app.post("/api/students/:id/priprave/:pid/viri/:vid/preberi", async (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const p = ena(s, req);
    if (!p) return niPriprave(res);
    const v = enVir(s, p, req);
    if (!v) return niVira(res);
    if (v.vrsta !== "slika" && v.vrsta !== "pdf") return res.status(409).json({ error: "Branje je samo za fotografije in skenirane strani PDF.", code: "priprava_ni_slika" });
    const vir = () => viriOd(p).find((x) => x.id === v.id) || null;
    const rows = prepisiVira(v.id);
    const prej = new Map(rows.map((r) => [r.stran, r.stanje]));
    const cilji = v.vrsta === "slika" ? (req.query.znova === "1" || !prej.has(1) ? [1] : []) : skeniraneStrani(v).filter((n) => !prej.has(n));
    // Nič za brati: izseki iz shranjenih prepisov (če jih ni, na primer po napaki), brez klica modela.
    const sestaviBrez = !cilji.length && v.stanje !== "obdelan" && rows.some((r) => r.stanje === "ok");
    if (!cilji.length && !sestaviBrez) return res.json({ vir: vir(), pages: straniInfo(s) });
    if (berem.has(v.id)) return res.status(409).json({ error: "Vir se že bere.", code: "priprava_zasedeno" });
    const buf = preberiIzvirnik(db, v.id);
    if (!buf) return res.status(404).json({ error: "Izvirnika ni več.", code: "priprava_ni_izvirnika" });
    // Ločena nit (skenirane strani PDF, zmanjšanje prevelike fotografije JPEG) šteje v mejo hkratnih obdelav.
    const nit = v.vrsta === "pdf" || (cilji.length > 0 && v.mime === MIME.jpeg && Math.ceil(buf.length / 3) * 4 > SLIKA_MODEL_B64);
    if (nit && obdelujem >= OBDELAVE_HKRATI) return res.status(429).set("Retry-After", "5").json({ error: "Obdelava že teče. Poskusi čez nekaj sekund.", code: "priprava_zasedeno" });
    if (cilji.length) {
      const blocked = usage?.blockInfo?.(s.id);
      if (blocked) return res.status(429).json(blocked);
      if (straniInfo(s).left < 1) return res.status(429).json({ error: "Ta mesec si porabil vse strani.", code: "zapiski_strani", pages: straniInfo(s) });
    }
    berem.add(v.id);
    if (nit) obdelujem++;
    const st = { nujno: null };
    const dodatno = () => (st.nujno ? { nujno: st.nujno } : {});
    const prebrano = [];
    try {
      let ustavi = null;
      if (cilji.length) {
        let slike;
        if (v.vrsta === "slika") {
          let b64 = buf.toString("base64");
          let mime = v.mime;
          if (b64.length > SLIKA_MODEL_B64 && v.mime === MIME.jpeg) {
            // Prevelika fotografija JPEG se zmanjša (sivine, 1568 točk) v ločeni niti.
            const r = await uvoziVNiti("slika", buf, { sken: { strani: [1], najvec: 1, jpeg: true } }).catch(() => null);
            if (r?.slike?.[0]?.png) [b64, mime] = [r.slike[0].png, "image/png"];
            else if (r?.slike?.[0]?.prazna) b64 = null;
          }
          if (b64 && b64.length > SLIKA_MODEL_B64) {
            if (!prej.has(1)) napakaVira(v, "branje_velika");
            return res.status(413).json({ error: "Fotografija je prevelika za branje. Fotografiraj znova ali jo zmanjšaj.", code: "priprava_slika_velika", vir: vir() });
          }
          slike = [b64 ? { stran: 1, b64, mime } : { stran: 1, prazna: true }];
        } else {
          const k = Math.min(SKEN_NAENKRAT, cilji.length, straniInfo(s).left);
          slike = (await slikeZaStrani(buf, cilji.slice(0, k))).map((x) => (x.png ? { stran: x.stran, b64: x.png, mime: "image/png" } : x));
        }
        for (const sl of slike) {
          if (!obstaja(v.id)) break;
          // Brez klica modela (in brez strani iz meje): prazna stran, stran brez slike, stran, ki je nit ni prebrala.
          const brez = sl.prazna ? "prazno" : sl.napaka || (sl.b64.length > SLIKA_MODEL_B64 ? "sken_ni_slike" : null);
          if (brez) {
            if (brez !== "prazno" || prej.get(sl.stran) !== "ok") shraniPrepis(v, sl.stran, brez);
            prebrano.push({ stran: sl.stran, stanje: brez });
            continue;
          }
          const o = await preberiSliko(s, sl.b64, sl.mime, st);
          if (o.ustavi) {
            ustavi = o.ustavi;
            break;
          }
          // Ponovno branje: slabši izid ne zamenja dobrega prejšnjega prepisa.
          if (!obstaja(v.id)) break;
          if (o.stanje === "ok" || prej.get(sl.stran) !== "ok") shraniPrepis(v, sl.stran, o.stanje, o.besedilo);
          prebrano.push({ stran: sl.stran, stanje: o.stanje });
        }
      }
      if (!obstaja(v.id)) return res.status(404).json({ error: "Vir ne obstaja.", ...dodatno() });
      if (!prebrano.length && ustavi) {
        if (ustavi === "mock") return res.json({ vir: vir(), pages: straniInfo(s), mock: true });
        if (ustavi === "ai") return res.status(429).json(usage.guardBlock(s.id));
        return res.status(429).json({ error: "Ta mesec si porabil vse strani.", code: "zapiski_strani", pages: straniInfo(s) });
      }
      if (!(await sestavi(v, buf))) return res.status(404).json({ error: "Vir ne obstaja.", ...dodatno() });
      uporabljena(p);
      const ai = prebrano.some((x) => x.stanje === "ok") ? AI_JSON : {};
      const zdaj = { vir: vir(), pages: straniInfo(s), prebrano, ...(ustavi ? { ustavljeno: ustavi } : {}), ...ai, ...dodatno() };
      if (v.vrsta === "slika" && prebrano[0]?.stanje === "neucno") return res.status(422).json({ error: "To niso zapiski za šolo.", code: "zapiski_neucno", ...zdaj });
      res.json(zdaj);
    } catch (e) {
      // Vir brez izsekov po napaki ostane »napaka«; shranjeni prepisi ostanejo, zato ponovni poskus ne plača znova.
      if (v.vrsta === "slika" && obstaja(v.id) && !prepisiVira(v.id).some((r) => r.stanje === "ok")) napakaVira(v, "branje_napaka");
      log.error?.(`[evklid] branje vira priprave: ${e?.name || "napaka"}`);
      res.status(e instanceof NapakaUvoza ? 422 : 502).json({
        error: e instanceof NapakaUvoza ? e.message : "Branje trenutno ne deluje. Poskusi znova.",
        code: e instanceof NapakaUvoza ? e.code : "priprava_branje_napaka",
        ...dodatno(),
      });
    } finally {
      berem.delete(v.id);
      if (nit) obdelujem--;
    }
  });

  // Izseki priprave (vsi viri ali en vir: ?vir=<id>; ?vrsta=<vrsta>), v vrstnem redu virov in zaporedja.
  app.get("/api/students/:id/priprave/:pid/izseki", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const p = ena(s, req);
    if (!p) return niPriprave(res);
    const where = ["priprava_id = ?", "student_id = ?"];
    const args = [p.id, s.id];
    if (req.query.vir !== undefined) {
      const vid = idIz(req.query.vir);
      if (!Number.isFinite(vid)) return res.status(400).json({ error: "Napačen vir." });
      where.push("vir_id = ?");
      args.push(vid);
    }
    if (req.query.vrsta !== undefined) {
      if (!VRSTE.includes(String(req.query.vrsta))) return res.status(400).json({ error: "Napačna vrsta izseka." });
      where.push("vrsta = ?");
      args.push(String(req.query.vrsta));
    }
    const rows = db.prepare(`SELECT * FROM priprava_izseki WHERE ${where.join(" AND ")} ORDER BY vir_id, zaporedje`).all(...args);
    uporabljena(p);
    res.set("Cache-Control", "no-store").json({ izseki: rows.map(izsekVen) });
  });

  // Tematski zemljevid priprave (PR 4, teme.js): izseki → Evklidove teme, obseg testa iz načrta (pot, sklopi),
  // pokritost obsega z zapiski in predznanje. Brez AI; računa se sproti iz trenutnih izsekov.
  // Zadnji izračuni (ključ: izseki, načrt, raven), da ponovno odpiranje ne računa znova.
  const zemljevidi = new Map();
  async function zemljevidZa(s, p) {
    const settings = typeof s.settings === "string" ? jsonIz(s.settings, {}) : s.settings || {};
    // Sled izsekov: število, največji id, skupna dolžina in zadnji čas vpisa (id-ji se po izbrisu vira lahko ponovijo).
    const sled = db
      .prepare("SELECT COUNT(*) AS n, MAX(id) AS m, SUM(LENGTH(besedilo)) AS d, MAX(created_at) AS c FROM priprava_izseki WHERE priprava_id = ? AND student_id = ?")
      .get(p.id, s.id);
    const kljuc = JSON.stringify([p.id, sled.n, sled.m, sled.d, sled.c, p.pot, p.sklopi, p.predmet, settings?.subject, settings?.curriculum_level, settings?.educational_track, settings?.school_system]);
    if (zemljevidi.has(kljuc)) return zemljevidi.get(kljuc);
    const izseki = db
      .prepare("SELECT id, naslov, besedilo FROM priprava_izseki WHERE priprava_id = ? AND student_id = ? ORDER BY vir_id, zaporedje")
      .all(p.id, s.id)
      .map((r) => ({ id: r.id, naslov: r.naslov == null ? null : unseal(r.naslov), besedilo: unseal(r.besedilo) }));
    const z = await zemljevid({ pot: p.pot, sklopi: sklopiIz(p.sklopi), predmet: p.predmet }, izseki, settings || {});
    zemljevidi.set(kljuc, z);
    while (zemljevidi.size > 50) zemljevidi.delete(zemljevidi.keys().next().value);
    return z;
  }
  app.get("/api/students/:id/priprave/:pid/teme", async (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const p = ena(s, req);
    if (!p) return niPriprave(res);
    uporabljena(p);
    res.set("Cache-Control", "no-store").json(await zemljevidZa(s, p));
  });

  // Načrt priprave (PR 5, nacrt.js): teme obsega testa (brez načrta testa teme iz zapiskov), izkazano znanje iz
  // rešenih nalog (topicScore, osnovne teme kot pri pripravljenosti na izpit), zgodovina vaje in rešene naloge danes.
  // Šteje vsaka odgovorjena naloga (tudi napačna) vaje, ponavljanja in vaje iz lista (kot obvladanje, progress.js
  // checkMastery), ne test ali uvrstitev.
  // Dan naloge je dan, ko je bila izdana (created_at, UTC → slovenski dan).
  const danLj = (sql) => (sql ? nowParts(new Date(`${String(sql).replace(" ", "T")}Z`)).date : null);
  async function temeNacrta(s, p) {
    const z = await zemljevidZa(s, p);
    const izsekov = new Map(z.teme.map((t) => [t.id, t.izseki.length]));
    const ids = z.obseg ? z.obseg.map((t) => t.id) : z.teme.map((t) => t.id);
    const danes = nowParts(new Date(now())).date;
    const zdaj = sqlCas(now());
    const stanje = db.prepare(STANJE_OCENE);
    const naloge = db.prepare(
      "SELECT created_at FROM tasks WHERE student_id = ? AND topic_id = ? AND first_try_correct IS NOT NULL AND mode IN ('practice','review','list') ORDER BY id DESC LIMIT 20",
    );
    const prebrano = new Map(db.prepare("SELECT tema_id, datum FROM priprava_prebrano WHERE priprava_id = ? AND student_id = ?").all(p.id, s.id).map((r) => [r.tema_id, r.datum]));
    const teme = ids.map((id, i) => {
      const t = getTopic(id);
      const vse = [id, ...(t?.base || [])];
      let ocena = 0;
      let ponovitev = null;
      let zadnjic = null;
      let danesNalog = 0;
      for (const x of vse) {
        const st = stanje.get(s.id, x);
        const o = ocenaTeme(st, zdaj);
        if (o > ocena || (o === ocena && o >= 1 && !ponovitev)) (ocena = o), (ponovitev = o >= 1 ? danLj(st?.review_due) : null);
        for (const r of naloge.all(s.id, x)) {
          const d = danLj(r.created_at);
          if (!zadnjic || d > zadnjic) zadnjic = d;
          if (d === danes) danesNalog++;
        }
      }
      return { id, ime: t?.name || id, sklop: t?.unit || null, red: i, izsekov: izsekov.get(id) || 0, ocena, vaja: vse.some((x) => hasGenerator(x)), danesNalog, zadnjic, ponovitev, prebrano: prebrano.get(id) || null };
    });
    return { z, teme, danes };
  }
  app.get("/api/students/:id/priprave/:pid/nacrt", async (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const p = ena(s, req);
    if (!p) return niPriprave(res);
    const { z, teme, danes } = await temeNacrta(s, p);
    // Poskusni test samo, ko ga /test-prep res sestavi: aktivna priprava z načrtom testa in vsaj eno temo z nalogami.
    const poskusniTest = p.aktivna === 1 && !!p.pot && sklopiIz(p.sklopi).length > 0 && teme.some((t) => hasGenerator(t.id));
    const nacrt = sestaviNacrt({ danes, datum: p.datum_testa || null, teme, poskusniTest });
    zabeleziNapredek(s, p, danes, nacrt.pripravljenost);
    uporabljena(p);
    res.set("Cache-Control", "no-store").json({ ...nacrt, obsegIzNacrta: !!z.obseg });
  });

  // Napredek priprave (PR 6): pripravljenost po dnevih (posnetek ob vsakem odprtju načrta ali napredka, en na dan) in
  // stanje vsake teme iz izkazanega znanja (rešene naloge vaje, ponavljanja in lista). Koda, brez AI in brez napovedi.
  function zabeleziNapredek(s, p, danes, pr) {
    if (pr.odstotek === null || (p.datum_testa && danes > p.datum_testa)) return;
    db.prepare(
      `INSERT INTO priprava_napredek (priprava_id, student_id, datum, odstotek, obvladanih, preverljivih) VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(priprava_id, datum) DO UPDATE SET odstotek = excluded.odstotek, obvladanih = excluded.obvladanih, preverljivih = excluded.preverljivih`,
    ).run(p.id, s.id, danes, pr.odstotek, pr.obvladanih, pr.preverljivih);
  }
  const stanjeOcene = (t) => (!t.vaja ? "zapiski" : t.ocena >= 1 ? "obvladana" : t.ocena >= 0.8 ? "ponovitev" : t.ocena > 0 ? "ucim" : "nova");
  app.get("/api/students/:id/priprave/:pid/napredek", async (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const p = ena(s, req);
    if (!p) return niPriprave(res);
    const { teme, danes } = await temeNacrta(s, p);
    const nacrt = sestaviNacrt({ danes, datum: p.datum_testa || null, teme, poskusniTest: false });
    zabeleziNapredek(s, p, danes, nacrt.pripravljenost);
    const naloge = db.prepare(
      "SELECT COUNT(*) AS n, SUM(first_try_correct = 1) AS ok FROM tasks WHERE student_id = ? AND topic_id = ? AND first_try_correct IS NOT NULL AND mode IN ('practice','review','list')",
    );
    const dnevi = db.prepare("SELECT datum, odstotek, obvladanih, preverljivih FROM priprava_napredek WHERE priprava_id = ? AND student_id = ? ORDER BY datum").all(p.id, s.id);
    uporabljena(p);
    res.set("Cache-Control", "no-store").json({
      pripravljenost: nacrt.pripravljenost,
      dnevi,
      teme: teme.map((t) => {
        const vse = [t.id, ...(getTopic(t.id)?.base || [])];
        const r = vse.map((x) => naloge.get(s.id, x)).reduce((a, x) => ({ n: a.n + (x.n || 0), ok: a.ok + (x.ok || 0) }), { n: 0, ok: 0 });
        return { id: t.id, ime: t.ime, sklop: t.sklop, stanje: stanjeOcene(t), ocena: t.ocena, nalog: r.n, pravilnihVPrvo: r.ok, zadnjic: t.zadnjic };
      }),
    });
  });

  // Kviz priprave (PR 6): kratka vaja iz najšibkejših tem obsega z nalogami Vadnice (preveri koda), obstoječa seja
  // »list« (progress.js startList: namigi, povzetek po temah, obvladanje), zato rezultat takoj spremeni načrt. Teme brez
  // nalog niso v kvizu. Brez AI.
  const temaKviza = (id) => (hasGenerator(id) ? id : (getTopic(id)?.base || []).find((x) => hasGenerator(x)) || null);
  const kvizHitro = rateLimiter({ max: 20, windowMs: 10 * 60 * 1000 });
  app.post("/api/students/:id/priprave/:pid/kviz", async (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const p = ena(s, req);
    if (!p) return niPriprave(res);
    if (!progress) return res.status(503).json({ error: "Kviz ni na voljo." });
    const body = req.body && typeof req.body === "object" && !Array.isArray(req.body) ? req.body : {};
    const dolzina = body.dolzina === undefined ? LIST.lengths[0] : body.dolzina;
    if (!LIST.lengths.includes(dolzina)) return res.status(400).json({ error: "Napačna dolžina kviza.", code: "kviz_dolzina" });
    const naTemo = Math.floor(dolzina / 2); // največ toliko tem: vsaka vsaj z dvema nalogama
    const { teme } = await temeNacrta(s, p);
    const zKvizom = teme.map((t) => ({ ...t, kviz: temaKviza(t.id) })).filter((t) => t.kviz);
    let izbrane;
    if (body.teme !== undefined) {
      // Izbrane teme: neprazen seznam nizov, vse iz načrta te priprave in z nalogami.
      const zelene = Array.isArray(body.teme) && body.teme.length <= LIST.maxSkills ? body.teme : [];
      const poId = new Map(zKvizom.map((t) => [t.id, t]));
      if (!zelene.length || !zelene.every((x) => typeof x === "string" && poId.has(x)))
        return res.status(400).json({ error: "Izberi teme iz načrta te priprave, ki imajo naloge.", code: "kviz_teme" });
      izbrane = [...new Set(zelene)].map((x) => poId.get(x));
    } else {
      // Najšibkejše teme (obvladane samo, če drugih ni).
      const sibke = zKvizom.filter((t) => t.ocena < 1);
      izbrane = (sibke.length ? sibke : zKvizom).sort((a, b) => a.ocena - b.ocena || a.red - b.red);
    }
    // Ena tema na nalogo osnovne teme (dve temi z isto osnovno temo nista dve veščini).
    const skills = [...new Set(izbrane.map((t) => t.kviz))].slice(0, Math.max(1, naTemo));
    if (!skills.length) return res.status(400).json({ error: "V tej pripravi ni tem z nalogami za kviz.", code: "kviz_brez_tem" });
    // Isti nedokončani kviz istega (slovenskega) dne se nadaljuje: enak izbor (samodejno ali iste izbrane teme) in
    // dolžina. Izbor, ne izračunane teme: te se med kvizom lahko spremenijo (tema postane obvladana). Novih sej ne more
    // biti brez meje.
    const izbor = body.teme === undefined ? "auto" : [...new Set(body.teme)].sort().join("|");
    const danes = nowParts(new Date(now())).date;
    const isti = (x) => x.params.priprava === p.id && x.params.izbor === izbor && x.plan.length === dolzina && danLj(x.created_at) === danes;
    const odprt = progress.openSession(s.id, "list", isti);
    if (odprt) {
      uporabljena(p);
      return res.json(progress.sessionNext(odprt.id));
    }
    if (!kvizHitro(s.id)) return res.status(429).json({ error: "Preveč kvizov naenkrat. Poskusi čez nekaj minut.", code: "kviz_hitro" });
    const out = progress.startList(s.id, skills, dolzina, { priprava: p.id, izbor });
    if (!out) return res.status(400).json({ error: "V tej pripravi ni tem z nalogami za kviz.", code: "kviz_brez_tem" });
    uporabljena(p);
    res.json(out);
  });
  // Zapiski teme brez nalog so prebrani (enota »zapiski« v načrtu je opravljena); prebrano: false oznako odstrani.
  app.post("/api/students/:id/priprave/:pid/nacrt/prebrano", async (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const p = ena(s, req);
    if (!p) return niPriprave(res);
    const tema = typeof req.body?.tema_id === "string" ? req.body.tema_id : "";
    const z = await zemljevidZa(s, p);
    const danes = nowParts(new Date(now())).date;
    if (!(z.obseg || z.teme).some((t) => t.id === tema)) return res.status(400).json({ error: "Tema ni v načrtu te priprave.", code: "tema_ni_v_nacrtu" });
    if (req.body?.prebrano === false) db.prepare("DELETE FROM priprava_prebrano WHERE priprava_id = ? AND tema_id = ?").run(p.id, tema);
    else
      db.prepare(
        "INSERT INTO priprava_prebrano (priprava_id, student_id, tema_id, datum) VALUES (?, ?, ?, ?) ON CONFLICT(priprava_id, tema_id) DO UPDATE SET datum = excluded.datum",
      ).run(p.id, s.id, tema, danes);
    uporabljena(p);
    res.json({ ok: true });
  });

  // Razlaga teme z izvorom (PR 6b, postavke.js): model razloži temo samo iz izsekov te teme (način A), koda obdrži le
  // odstavke, podprte z zapiski (navedek, formule, števila, račun). Shrani se šifrirano (priprava_postavke) z odtisom
  // izsekov in se ne kliče znova, dokler se izseki ne spremenijo (znova: true za novo razlago); izbris ali ponovna obdelava
  // vira izbriše razlage iz njegovih izsekov. Strošek: ena stran iz mesečne meje zapiskov (STRANI), trda meja AI
  // (usage.guard z rezervo iz dejanskega sporočila), zapis porabe »priprava«. Oznaka AI; stiska v zapiskih → nujno.
  const razlagam = new Set();
  function razlagaVen(row, t) {
    const surovo = unseal(row.vsebina);
    if (!surovo) return null;
    const v = JSON.parse(surovo);
    const zastarela = !t || row.odtis !== t.odtis;
    return {
      tema_id: row.tema_id,
      ...v,
      // Vir (vir, stran) samo, dokler je razlaga sveža: id-ji izsekov se po izbrisu lahko ponovijo.
      odstavki: v.odstavki.map((o) => ({ ...o, viri: o.viri.map((id) => (!zastarela && t.izsekiPoId.get(id)) || { id }) })),
      ustvarjeno: row.created_at,
      zastarela,
      ...AI_JSON,
    };
  }
  async function izsekiTeme(s, p, tema) {
    const z = await zemljevidZa(s, p);
    const t = z.teme.find((x) => x.id === tema);
    if (!t) return null;
    const vrstice = db
      .prepare(`SELECT id, vir_id, stran, naslov, besedilo FROM priprava_izseki WHERE priprava_id = ? AND student_id = ? AND id IN (${t.izseki.map(() => "?").join(",") || "NULL"})`)
      .all(p.id, s.id, ...t.izseki);
    const poId = new Map(vrstice.map((r) => [r.id, r]));
    const izseki = izberiIzseke(
      t.izseki.filter((id) => poId.has(id)).map((id) => ({ id, naslov: poId.get(id).naslov == null ? null : unseal(poId.get(id).naslov), besedilo: unseal(poId.get(id).besedilo) || "" })),
    );
    const izsekiPoId = new Map(izseki.map((i) => [i.id, { id: i.id, vir_id: poId.get(i.id).vir_id, stran: poId.get(i.id).stran }]));
    return { ime: t.ime, izseki, izsekiPoId, odtis: odtisIzsekov(izseki) };
  }
  // Stiska v zapiskih (npr. dnevnik med snovjo): lokalni zaznavalnik brez AI, kot pri zapiskih; tudi ob branju shranjene.
  const nujnoIzsekov = (s, t) => (t?.izseki.length ? nujnoZa(lokalnaVrsta(t.izseki.map((i) => i.besedilo).join("\n")), s.settings) : null);
  const shranjenaRazlaga = (p, tema) => db.prepare("SELECT * FROM priprava_postavke WHERE priprava_id = ? AND vrsta = 'razlaga' AND tema_id = ?").get(p.id, tema);
  app.get("/api/students/:id/priprave/:pid/razlaga", async (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const p = ena(s, req);
    if (!p) return niPriprave(res);
    const tema = typeof req.query.tema_id === "string" ? req.query.tema_id : "";
    const row = tema ? shranjenaRazlaga(p, tema) : null;
    const t = row ? await izsekiTeme(s, p, tema) : null;
    const out = row ? razlagaVen(row, t) : null;
    if (!out) return res.status(404).json({ error: "Razlage te teme še ni.", code: "razlaga_ni" });
    uporabljena(p);
    const nujno = nujnoIzsekov(s, t);
    res.set("Cache-Control", "no-store").json(nujno ? { ...out, nujno } : out);
  });
  app.post("/api/students/:id/priprave/:pid/razlaga", async (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const p = ena(s, req);
    if (!p) return niPriprave(res);
    const tema = typeof req.body?.tema_id === "string" ? req.body.tema_id : "";
    const t = tema ? await izsekiTeme(s, p, tema) : null;
    if (!t || !t.izseki.length) return res.status(400).json({ error: "Tema nima izsekov v zapiskih te priprave.", code: "razlaga_tema" });
    const nujno = nujnoIzsekov(s, t);
    const zNujno = (o) => (nujno ? { ...o, nujno } : o);
    const prej = shranjenaRazlaga(p, tema);
    if (prej && prej.odtis === t.odtis && req.body?.znova !== true) {
      const out = razlagaVen(prej, t);
      if (out) {
        uporabljena(p);
        return res.json(zNujno(out));
      }
    }
    if (razlagam.has(s.id)) return res.status(409).json(zNujno({ error: "Razlaga se že pripravlja.", code: "razlaga_poteka" }));
    const blocked = usage?.blockInfo?.(s.id);
    if (blocked) return res.status(429).json(zNujno(blocked));
    if (!takePage(db, s.id, pageLimit(rightsFor ? rightsFor(s.id) : null, s.settings)))
      return res.status(429).json(zNujno({ error: "Ta mesec si porabil vse strani.", code: "zapiski_strani", pages: straniInfo(s) }));
    const sporocilo = sporociloRazlage(t.ime, t.izseki);
    const hold = usage?.guard ? usage.guard(s.id, rezervaRazlage(sporocilo)) : null;
    if (usage?.guard && !hold) {
      givePage(db, s.id);
      return res.status(429).json(zNujno(usage.guardBlock(s.id)));
    }
    razlagam.add(s.id);
    let placano = false;
    try {
      const out = await razlagaFn({ sporocilo, izseki: t.izseki });
      if (out.mock) {
        givePage(db, s.id);
        return res.status(503).json(zNujno({ error: "Razlaga v preizkusnem načinu ni na voljo.", code: "razlaga_mock" }));
      }
      if (out.usage) {
        placano = true;
        try {
          usage?.log(s.id, out.model, out.usage, "priprava");
        } catch {
          // profil izbrisan med klicem
        }
      }
      const r = preveriRazlago(out.data, t.izseki);
      if (!r.odstavki.length)
        return res
          .status(422)
          .json(zNujno({ error: "Razlage ni bilo mogoče preveriti z zapiski. Poskusi znova ali dodaj zapiske.", code: "razlaga_nepreverjena", zavrnjenih: r.zavrnjenih, pages: straniInfo(s), ...AI_JSON }));
      const vsebina = seal(JSON.stringify({ nacin: "A", preverjeno: "zapiski", odstavki: r.odstavki, zavrnjenih: r.zavrnjenih }));
      // Izseki so se med klicem modela lahko spremenili (vir izbrisan ali znova obdelan): razlaga iz izbrisanih zapiskov
      // se ne shrani. Odtis se preveri znova tik pred zapisom; med preverjanjem in zapisom ni čakanja (await), zato ga
      // izbris ne more prehiteti.
      const zdaj = await izsekiTeme(s, p, tema);
      // Priprava še obstaja (in je ista: id-ji se po izbrisu lahko ponovijo).
      if (!db.prepare("SELECT 1 FROM priprave WHERE id = ? AND student_id = ? AND created_at = ?").get(p.id, s.id, p.created_at)) return niPriprave(res);
      if (!zdaj || zdaj.odtis !== t.odtis)
        return res.status(409).json(zNujno({ error: "Zapiski so se med razlago spremenili. Poskusi znova.", code: "razlaga_zapiski_spremenjeni", pages: straniInfo(s), ...AI_JSON }));
      db.prepare(
        `INSERT INTO priprava_postavke (priprava_id, student_id, vrsta, tema_id, izseki, odtis, vsebina, created_at) VALUES (?, ?, 'razlaga', ?, ?, ?, ?, ?)
         ON CONFLICT(priprava_id, vrsta, tema_id) DO UPDATE SET izseki = excluded.izseki, odtis = excluded.odtis, vsebina = excluded.vsebina, created_at = excluded.created_at`,
      ).run(p.id, s.id, tema, JSON.stringify(t.izseki.map((i) => i.id)), t.odtis, vsebina, sqlCas(now()));
      uporabljena(p);
      res.status(201).json(zNujno({ ...razlagaVen(shranjenaRazlaga(p, tema), t), pages: straniInfo(s) }));
    } catch (e) {
      if (!placano) givePage(db, s.id);
      log.warn?.(`[priprava] razlaga ni uspela: ${e?.message || e}`);
      res.status(502).json(zNujno({ error: "Razlaga ni uspela. Poskusi znova.", code: "razlaga_napaka" }));
    } finally {
      razlagam.delete(s.id);
      hold?.release();
    }
  });

  app.delete("/api/students/:id/priprave/:pid/viri/:vid", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const p = ena(s, req);
    if (!p) return niPriprave(res);
    const v = enVir(s, p, req);
    if (!v) return niVira(res);
    zVarnimBrisanjem(db, () => {
      izbrisiPostavkeVira(db, { id: v.id, priprava_id: p.id });
      db.prepare("DELETE FROM priprava_viri WHERE id = ? AND student_id = ?").run(v.id, s.id);
    });
    uporabljena(p);
    res.json({ ok: true });
  });
}

// Poti priprave na test iz zapiskov (docs/priprava.md, PR 2a): seznam, nova, ena, sprememba in izbris priprave ter
// dodajanje, prenos in izbris virov. Samo lastnik: vsaka poizvedba je omejena na profil iz poti (student_id), ki ga
// računi (server/accounts/index.js) že preverijo za prijavljeni račun. Tuj račun in drug profil istega računa dobita
// 404, tudi za obstoječ id. Brez AI in brez razčlenjevanja (PR 3). Vsebine (naslov, ime datoteke, izvirnik) ne gredo
// v dnevnik strežnika.
import express from "express";
import { seal, unseal } from "../crypto-polje.js";
import { cleanText } from "../settings.js";
import { danIzbrisa } from "./ciscenje.js";
import { uvoziVNiti, NapakaUvoza } from "./uvoz.js";
import { shraniIzseke, VRSTE } from "./izseki.js";
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
export function mountPriprave(app, store, { loadStudent, now = () => Date.now(), log = console }) {
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

  // Obdelava vira brez AI (PR 3a): besedilo, Word, PowerPoint, PDF z besedilom → izseki. Fotografije in skenirane
  // strani PDF čakajo na branje (PR 3b). PDF bere ločena nit; hkrati največ OBDELAVE_HKRATI, sicer vir ostane »caka«
  // in ga odjemalec obdela pozneje (POST …/viri/:vid/obdelaj).
  let obdelujem = 0;
  const OBDELAVE_HKRATI = 2;
  const napakaVira = (vir, koda) => db.prepare("UPDATE priprava_viri SET stanje = 'napaka', napaka = ? WHERE id = ?").run(koda, vir.id);
  async function obdelaj(vir, buf) {
    if (vir.vrsta === "slika") {
      db.prepare("UPDATE priprava_viri SET stanje = 'branje' WHERE id = ?").run(vir.id);
      return;
    }
    if (obdelujem >= OBDELAVE_HKRATI) return;
    obdelujem++;
    try {
      const r = await uvoziVNiti(vir.vrsta, buf);
      const izseki = r.izseki;
      const opozorila = [...r.opozorila, ...(r.brezBesedila.length ? [{ koda: "uvoz_brez_besedila", strani: r.brezBesedila.slice(0, 100) }] : [])];
      // Samo skenirane strani (PDF brez besedila): čaka na branje fotografij.
      const stanje = !izseki.length && r.brezBesedila.length ? "branje" : "obdelan";
      shraniIzseke(db, { vir, izseki, strani: r.strani, opozorila, stanje, seal });
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

  // Ponovna obdelava vira (vir »caka« ali »napaka«, ali po izboljšanem uvozu). Fotografije: 409 (branje je PR 3b).
  app.post("/api/students/:id/priprave/:pid/viri/:vid/obdelaj", async (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const p = ena(s, req);
    if (!p) return niPriprave(res);
    const v = enVir(s, p, req);
    if (!v) return niVira(res);
    if (v.vrsta === "slika") return res.status(409).json({ error: "Fotografije prebere branje zapiskov.", code: "priprava_branje" });
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

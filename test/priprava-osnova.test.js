// Priprava na test iz zapiskov, PR 2a (docs/priprava.md): tabele, šifriranje, poti z lastništvom, izbris, samodejni
// izbris po 30 dneh (podtaknjena ura), varnostne kopije in izvoz brez izvirnikov, izbris računa. Brez AI.
import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { prepoznaj, preveriDatoteko, MIME, MEJE } from "../server/priprava/shramba.js";
import { pocistiPriprave, danIzbrisa } from "../server/priprava/ciscenje.js";
import { preveriDatum } from "../server/priprava/poti.js";
import { sealBytes, unsealBytes, SEALED } from "../server/crypto-polje.js";
import { runRetention } from "../server/zasebnost.js";
import { makeBackup, listBackups } from "../server/kopije.js";

process.env.EVKLID_DATA_KEY ||= crypto.randomBytes(32).toString("base64");
const quiet = { log() {}, info() {}, warn() {}, error() {} };
const DAN = 86400000;
const dan = (ms) => new Date(ms).toISOString().slice(0, 10);
const YEAR = new Date().getFullYear();

// Najmanjši ZIP (shranjeni vnosi, samo glave): dovolj za prepoznavo Worda in PowerPointa po imeniku.
function zip(names) {
  const locals = [];
  const central = [];
  let off = 0;
  for (const n of names) {
    const name = Buffer.from(n, "latin1");
    const lh = Buffer.alloc(30);
    lh.writeUInt32LE(0x04034b50, 0);
    lh.writeUInt16LE(20, 4);
    lh.writeUInt32LE(1, 18);
    lh.writeUInt32LE(1, 22);
    lh.writeUInt16LE(name.length, 26);
    locals.push(lh, name, Buffer.from("x"));
    const ch = Buffer.alloc(46);
    ch.writeUInt32LE(0x02014b50, 0);
    ch.writeUInt16LE(20, 4);
    ch.writeUInt16LE(20, 6);
    ch.writeUInt32LE(1, 20);
    ch.writeUInt32LE(1, 24);
    ch.writeUInt16LE(name.length, 28);
    ch.writeUInt32LE(off, 42);
    central.push(ch, name);
    off += 30 + name.length + 1;
  }
  const cd = Buffer.concat(central);
  const e = Buffer.alloc(22);
  e.writeUInt32LE(0x06054b50, 0);
  e.writeUInt16LE(names.length, 8);
  e.writeUInt16LE(names.length, 10);
  e.writeUInt32LE(cd.length, 12);
  e.writeUInt32LE(off, 16);
  return Buffer.concat([...locals, cd, e]);
}
const DOCX = zip(["[Content_Types].xml", "_rels/.rels", "word/document.xml"]);
const PPTX = zip(["[Content_Types].xml", "ppt/presentation.xml", "ppt/slides/slide1.xml"]);
const MARKER = "IZVIRNIK-ZASEBNO-Q7";
const PDF = Buffer.from(`%PDF-1.4\n1 0 obj << /Title (${MARKER}) >> endobj\ntrailer\n%%EOF\n`, "latin1");
const JPEG = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.from(`JFIF ${MARKER} slika`), Buffer.from([0xff, 0xd9])]);
const PNG = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), Buffer.alloc(20)]);
const WEBP = Buffer.concat([Buffer.from("RIFF"), Buffer.alloc(4), Buffer.from("WEBPVP8 "), Buffer.alloc(10)]);

async function withServer(fn, { file = ":memory:", clock = { t: Date.now() } } = {}) {
  const store = openDb(file);
  const app = createApp(store, { accounts: true, scheduler: false, resendKey: "re_x", fetchFn: async () => ({ ok: true, status: 200, json: async () => ({ id: "e" }) }), log: quiet, pripravaNow: () => clock.t });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const client = () => {
    const jar = {};
    return async (p, opts = {}) => {
      const headers = { cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; "), ...(opts.raw === undefined ? { "Content-Type": "application/json" } : {}), ...(opts.headers || {}) };
      const res = await fetch(base + p, { method: opts.method || "GET", headers, body: opts.raw ?? (opts.body ? JSON.stringify(opts.body) : undefined) });
      for (const c of res.headers.getSetCookie()) {
        const [kv] = c.split(";");
        const i = kv.indexOf("=");
        jar[kv.slice(0, i)] = kv.slice(i + 1);
      }
      const type = res.headers.get("content-type") || "";
      return { status: res.status, headers: res.headers, body: type.includes("json") ? await res.json() : Buffer.from(await res.arrayBuffer()) };
    };
  };
  const warn = console.warn;
  console.warn = () => {};
  try {
    await fn({ client, store, db: store.db, clock });
  } finally {
    console.warn = warn;
    await new Promise((r) => server.close(r));
    store.db.close();
  }
}

async function account(client, store, email) {
  const call = client();
  const r = await call("/api/auth/register", { method: "POST", body: { email, password: "geslo1234", accept_privacy: true, country: "SI", birth_date: `${YEAR - 40}-01-15` } });
  assert.equal(r.status, 201, JSON.stringify(r.body));
  store.db.prepare("UPDATE parents SET email_verified_at = datetime('now') WHERE email = ?").run(email);
  const s = await call("/api/students", { method: "POST", body: { name: "Maja", birth_year: YEAR - 15, consent: true } });
  assert.equal(s.status, 201, JSON.stringify(s.body));
  return { call, sid: s.body.id };
}
const nova = async (a, body = { naslov: "Integrali", predmet: "MAT" }, sid = a.sid) => {
  const r = await a.call(`/api/students/${sid}/priprave`, { method: "POST", body });
  assert.equal(r.status, 201, JSON.stringify(r.body));
  return r.body.priprava;
};
const nalozi = (a, pid, buf, { sid = a.sid, ime = null, type = "application/octet-stream" } = {}) =>
  a.call(`/api/students/${sid}/priprave/${pid}/viri`, { method: "POST", raw: buf, headers: { "Content-Type": type, ...(ime ? { "X-Ime-Datoteke": encodeURIComponent(ime) } : {}) } });
const stej = (db) => ({
  priprave: db.prepare("SELECT COUNT(*) AS n FROM priprave").get().n,
  viri: db.prepare("SELECT COUNT(*) AS n FROM priprava_viri").get().n,
  izvirniki: db.prepare("SELECT COUNT(*) AS n FROM priprava_izvirniki").get().n,
});

test("prepoznava po vsebini: podprte vrste, končnica in Content-Type ne štejeta", () => {
  assert.deepEqual(prepoznaj(JPEG), { vrsta: "slika", mime: MIME.jpeg });
  assert.deepEqual(prepoznaj(PNG), { vrsta: "slika", mime: MIME.png });
  assert.deepEqual(prepoznaj(WEBP), { vrsta: "slika", mime: MIME.webp });
  assert.deepEqual(prepoznaj(PDF), { vrsta: "pdf", mime: MIME.pdf });
  assert.deepEqual(prepoznaj(DOCX), { vrsta: "word", mime: MIME.word });
  assert.deepEqual(prepoznaj(PPTX), { vrsta: "powerpoint", mime: MIME.powerpoint });
  // Nepodprto: izvršljiva datoteka, HTML, navaden ZIP, ZIP brez [Content_Types].xml, stari .doc (OLE), HEIC, prazno.
  assert.equal(prepoznaj(Buffer.from("MZ\x90\x00\x03\x00\x00\x00\x04\x00", "latin1")), null);
  assert.equal(prepoznaj(Buffer.from("<html><script>alert(1)</script></html>")), null);
  assert.equal(prepoznaj(zip(["a.txt", "b.txt"])), null);
  assert.equal(prepoznaj(zip(["word/document.xml"])), null);
  assert.equal(prepoznaj(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1, 0, 0])), null);
  assert.equal(prepoznaj(Buffer.concat([Buffer.from([0, 0, 0, 0x18]), Buffer.from("ftypheic"), Buffer.alloc(8)])), null);
  assert.equal(prepoznaj(Buffer.alloc(0)), null);
  // Niz ali polje namesto Buffer (podtaknjeno telo zahteve): nikoli prepoznano.
  for (const x of ["%PDF-1.4 xxxxxxxx", ["%PDF-"], [0xff, 0xd8, 0xff, 0, 0, 0, 0, 0], { length: 20 }, null]) {
    assert.equal(prepoznaj(x), null);
    assert.equal(preveriDatoteko(x).status, 400);
  }
  // Pokvarjen ZIP (imenik kaže izven datoteke, odrezan konec): brez napake, samo null.
  const bad = Buffer.from(DOCX);
  bad.writeUInt32LE(0xfffffff0, bad.length - 6);
  assert.equal(prepoznaj(bad), null);
  assert.equal(prepoznaj(DOCX.subarray(0, DOCX.length - 10)), null);
  for (let i = 0; i < 200; i++) prepoznaj(crypto.randomBytes(1 + (i % 64)));
  // Meje velikosti po vrsti.
  const velika = Buffer.concat([JPEG, Buffer.alloc(MEJE.slika)]);
  assert.equal(preveriDatoteko(velika).status, 413);
  assert.equal(preveriDatoteko(Buffer.concat([PDF, Buffer.alloc(MEJE.slika)])).ok, true);
  assert.equal(preveriDatoteko(Buffer.from("navadno besedilo")).status, 415);
});

test("šifriranje bajtov: isti ključi kot seal(), tuj ključ ali poškodba vrne null", () => {
  const s = sealBytes(PDF);
  assert.ok(s.subarray(0, 5).toString() === "enc1:" && s.indexOf(MARKER) < 0);
  assert.deepEqual(unsealBytes(s), PDF);
  const t = Buffer.from(s);
  t[t.length - 1] ^= 1;
  assert.equal(unsealBytes(t), null);
  assert.equal(unsealBytes(PDF), null);
  const key = process.env.EVKLID_DATA_KEY;
  process.env.EVKLID_DATA_KEY = crypto.randomBytes(32).toString("base64");
  try {
    assert.equal(unsealBytes(s), null);
  } finally {
    process.env.EVKLID_DATA_KEY = key;
  }
  assert.ok(SEALED.some((x) => x.table === "priprave" && x.cols.includes("naslov")));
  assert.ok(SEALED.some((x) => x.table === "priprava_viri" && x.cols.includes("ime")));
});

test("datum testa in dan izbrisa", () => {
  const now = Date.parse("2026-11-25T10:00:00Z");
  assert.deepEqual(preveriDatum("2026-12-15", now), { ok: true, value: "2026-12-15" });
  assert.deepEqual(preveriDatum(null, now), { ok: true, value: null });
  assert.equal(preveriDatum("2026-11-24", now).ok, true); // včeraj (časovni pasovi)
  assert.equal(preveriDatum("2026-11-23", now).ok, false);
  assert.equal(preveriDatum("2026-02-30", now).ok, false);
  assert.equal(preveriDatum("2028-11-25", now).ok, false);
  assert.equal(preveriDatum("15. 12. 2026", now).ok, false);
  assert.equal(danIzbrisa({ datum_testa: "2026-12-15" }), "2027-01-14");
  assert.equal(danIzbrisa({ datum_testa: null, zadnja_uporaba: "2026-11-25 10:00:00" }), "2026-12-25");
});

test("poti: ustvari, seznam, spremeni, viri vseh vrst, šifrirano v bazi, prenos izvirnika", async () => {
  await withServer(async ({ client, store, db }) => {
    const a = await account(client, store, "lastnik@priprava.si");
    const p = await nova(a, { naslov: "Integrali TAJNO-N4", predmet: "mat", datum_testa: dan(Date.now() + 10 * DAN) });
    assert.equal(p.naslov, "Integrali TAJNO-N4");
    assert.equal(p.predmet, "MAT");
    assert.equal(p.izbris_dne, dan(Date.now() + 40 * DAN));
    assert.deepEqual(p.viri, []);
    for (const [buf, vrsta, ime] of [[PDF, "pdf", "Zapiski ZASEBNO-IME.pdf"], [JPEG, "slika", "foto.jpg"], [PNG, "slika", null], [WEBP, "slika", null], [DOCX, "word", "a.docx"], [PPTX, "powerpoint", "b.pptx"]]) {
      // Content-Type laže (image/png za PDF): vrsta je iz vsebine.
      const r = await nalozi(a, p.id, buf, { ime, type: "image/png" });
      assert.equal(r.status, 201, JSON.stringify(r.body));
      assert.equal(r.body.vir.vrsta, vrsta);
      assert.equal(r.body.vir.velikost, buf.length);
      assert.equal(r.body.vir.izvirnik, true);
      assert.equal(r.body.vir.ime, ime);
    }
    const t = await a.call(`/api/students/${a.sid}/priprave/${p.id}/viri`, { method: "POST", body: { besedilo: `Odvod ${MARKER}`, ime: "Prilepljeno" } });
    assert.equal(t.status, 201, JSON.stringify(t.body));
    assert.equal(t.body.vir.vrsta, "besedilo");
    // Nepodprta vrsta s končnico .pdf in glavo application/pdf: 415.
    const html = await nalozi(a, p.id, Buffer.from("<html><body>x</body></html>"), { ime: "test.pdf", type: "application/pdf" });
    assert.equal(html.status, 415);
    assert.equal(html.body.code, "priprava_vrsta");
    const prazno = await nalozi(a, p.id, Buffer.alloc(0));
    assert.equal(prazno.status, 400);
    // Prevelika fotografija (meja 10 MB) in preveliko telo (15 MB, razčlenjevalnik).
    assert.equal((await nalozi(a, p.id, Buffer.concat([JPEG, Buffer.alloc(MEJE.slika)]))).status, 413);
    assert.equal((await nalozi(a, p.id, Buffer.concat([PDF, Buffer.alloc(15 * 1024 * 1024)]))).status, 413);

    const one = await a.call(`/api/students/${a.sid}/priprave/${p.id}`);
    assert.equal(one.status, 200);
    assert.equal(one.body.priprava.viri.length, 7);
    const list = await a.call(`/api/students/${a.sid}/priprave`);
    assert.equal(list.body.priprave.length, 1);
    assert.equal(list.body.priprave[0].virov, 7);

    // Šifrirano v bazi: naslov, ime datoteke in izvirnik ne vsebujejo besedila.
    const row = db.prepare("SELECT naslov FROM priprave WHERE id = ?").get(p.id);
    assert.ok(row.naslov.startsWith("enc1:") && !row.naslov.includes("TAJNO"));
    for (const v of db.prepare("SELECT ime FROM priprava_viri WHERE ime IS NOT NULL").all()) assert.ok(v.ime.startsWith("enc1:") && !v.ime.includes("ZASEBNO"));
    for (const r of db.prepare("SELECT podatki FROM priprava_izvirniki").all()) {
      const b = Buffer.from(r.podatki);
      assert.ok(b.subarray(0, 5).toString() === "enc1:");
      assert.equal(b.indexOf(MARKER), -1);
      assert.equal(b.indexOf("%PDF"), -1);
    }
    // Prenos: isti bajti, tip iz vsebine, priponka.
    const pdfVir = one.body.priprava.viri.find((v) => v.vrsta === "pdf");
    const dl = await a.call(`/api/students/${a.sid}/priprave/${p.id}/viri/${pdfVir.id}/izvirnik`);
    assert.equal(dl.status, 200);
    assert.deepEqual(dl.body, PDF);
    assert.equal(dl.headers.get("content-type"), MIME.pdf);
    assert.match(dl.headers.get("content-disposition"), /^attachment; filename="vir-\d+\.pdf"$/);
    assert.equal(dl.headers.get("x-content-type-options"), "nosniff");
    assert.equal(dl.headers.get("cache-control"), "no-store");

    // Sprememba: naslov in datum; napačen datum 400.
    const u = await a.call(`/api/students/${a.sid}/priprave/${p.id}`, { method: "PUT", body: { naslov: "Odvodi", datum_testa: null } });
    assert.equal(u.status, 200);
    assert.equal(u.body.priprava.naslov, "Odvodi");
    assert.equal(u.body.priprava.datum_testa, null);
    assert.equal((await a.call(`/api/students/${a.sid}/priprave/${p.id}`, { method: "PUT", body: { datum_testa: "2001-01-01" } })).status, 400);
    assert.equal((await a.call(`/api/students/${a.sid}/priprave`, { method: "POST", body: { naslov: "" } })).status, 400);
    assert.equal((await a.call(`/api/students/${a.sid}/priprave`, { method: "POST", body: { naslov: "x", predmet: "mat; drop" } })).status, 400);
    assert.equal((await a.call(`/api/students/${a.sid}/priprave`, { method: "POST", body: { naslov: "x", predmet: { toString: 1 } } })).status, 400);
    assert.equal((await a.call(`/api/students/${a.sid}/priprave`, { method: "POST", body: { naslov: "x", predmet: ["MAT"] } })).status, 400);
    assert.equal((await a.call(`/api/students/${a.sid}/priprave/${p.id}`, { method: "PUT", body: [1] })).status, 400);
    assert.equal((await a.call(`/api/students/${a.sid}/priprave/${p.id}`, { method: "PUT", body: {} })).status, 400);
    // Prilepljeno besedilo: meja v bajtih (pod splošno mejo JSON 100 kb), koda priprava_velikost.
    const dolgo = await a.call(`/api/students/${a.sid}/priprave/${p.id}/viri`, { method: "POST", body: { besedilo: "č".repeat(46_000) } });
    assert.equal(dolgo.status, 413);
    assert.equal(dolgo.body.code, "priprava_velikost");
    assert.equal((await a.call(`/api/students/${a.sid}/priprave/abc`)).status, 404);
  });
});

test("lastništvo: tuj račun in drug profil istega računa dobita 404 in ničesar ne spremenita", async () => {
  await withServer(async ({ client, store, db }) => {
    const a = await account(client, store, "ana@priprava.si");
    const b = await account(client, store, "bor@priprava.si");
    // Drug profil istega računa (družinski račun).
    const sib = await a.call("/api/students", { method: "POST", body: { name: "Tin", birth_year: YEAR - 12, consent: true } });
    assert.equal(sib.status, 201, JSON.stringify(sib.body));
    const a2 = sib.body.id;
    assert.equal((await a.call(`/api/students/${a2}/priprave`)).status, 200);
    const p = await nova(a, { naslov: "Ana TAJNO" });
    const v = (await nalozi(a, p.id, PDF)).body.vir;
    const pred = JSON.stringify(stej(db));
    const poti = (sid) => [
      ["GET", `/api/students/${sid}/priprave/${p.id}`],
      ["PUT", `/api/students/${sid}/priprave/${p.id}`, { naslov: "vdor" }],
      ["DELETE", `/api/students/${sid}/priprave/${p.id}`],
      ["POST", `/api/students/${sid}/priprave/${p.id}/viri`, { besedilo: "vdor" }],
      ["GET", `/api/students/${sid}/priprave/${p.id}/viri/${v.id}/izvirnik`],
      ["DELETE", `/api/students/${sid}/priprave/${p.id}/viri/${v.id}`],
    ];
    // B s profilom A (računi), B s svojim profilom in id-ji A, A z drugim profilom in id-ji prvega.
    for (const [who, sid] of [[b, a.sid], [b, b.sid], [a, a2]]) {
      for (const [method, url, body] of poti(sid)) {
        const r = await who.call(url, { method, body });
        assert.equal(r.status, 404, `${method} ${url}: ${r.status}`);
        assert.ok(!JSON.stringify(r.body).includes("TAJNO"));
      }
      const raw = await nalozi(who, p.id, PDF, { sid });
      assert.equal(raw.status, 404);
      const list = await who.call(`/api/students/${sid}/priprave`);
      assert.ok(list.status === 404 || list.body.priprave.length === 0);
    }
    assert.equal(JSON.stringify(stej(db)), pred);
    assert.equal((await a.call(`/api/students/${a.sid}/priprave/${p.id}`)).body.priprava.naslov, "Ana TAJNO");
  });
});

test("izbris priprave in vira odstrani vrstice in izvirnike takoj", async () => {
  await withServer(async ({ client, store, db }) => {
    const a = await account(client, store, "izbris@priprava.si");
    const p = await nova(a);
    const v1 = (await nalozi(a, p.id, PDF)).body.vir;
    await nalozi(a, p.id, JPEG);
    assert.deepEqual(stej(db), { priprave: 1, viri: 2, izvirniki: 2 });
    assert.deepEqual((await a.call(`/api/students/${a.sid}/priprave/${p.id}/viri/${v1.id}`, { method: "DELETE" })).body, { ok: true });
    assert.deepEqual(stej(db), { priprave: 1, viri: 1, izvirniki: 1 });
    assert.equal((await a.call(`/api/students/${a.sid}/priprave/${p.id}/viri/${v1.id}/izvirnik`)).status, 404);
    assert.deepEqual((await a.call(`/api/students/${a.sid}/priprave/${p.id}`, { method: "DELETE" })).body, { ok: true });
    assert.deepEqual(stej(db), { priprave: 0, viri: 0, izvirniki: 0 });
    assert.equal((await a.call(`/api/students/${a.sid}/priprave/${p.id}`)).status, 404);
  });
});

test("samodejni izbris: 30 dni po testu, brez datuma 30 dni po zadnji uporabi, nov datum začne nov rok", async () => {
  const t0 = Date.parse(`${dan(Date.now())}T08:00:00Z`);
  const clock = { t: t0 };
  await withServer(
    async ({ client, store, db }) => {
      const a = await account(client, store, "rok@priprava.si");
      const D = dan(t0 + 5 * DAN);
      const sTestom = await nova(a, { naslov: "S testom", datum_testa: D });
      await nalozi(a, sTestom.id, PDF);
      const premik = await nova(a, { naslov: "Premik", datum_testa: D });
      const brez = await nova(a, { naslov: "Brez datuma" });
      await nalozi(a, brez.id, JPEG);
      const ime = () => db.prepare("SELECT id FROM priprave ORDER BY id").all().map((r) => r.id);
      const ob = (d) => Date.parse(`${D}T00:00:00Z`) + d * DAN + 3 * 3600000;

      // Uporaba brez datuma na dan D+10 (ura +15 dni od t0), premik datuma na D+20 na dan D+20.
      clock.t = ob(10);
      assert.equal((await a.call(`/api/students/${a.sid}/priprave/${brez.id}`)).status, 200);
      assert.equal(pocistiPriprave(db, { now: ob(29) }), 0);
      assert.deepEqual(ime(), [sTestom.id, premik.id, brez.id]);
      clock.t = ob(20);
      const r = await a.call(`/api/students/${a.sid}/priprave/${premik.id}`, { method: "PUT", body: { datum_testa: dan(ob(20)) } });
      assert.equal(r.status, 200, JSON.stringify(r.body));
      // D+30: priprava s testom gre (z viri in izvirniki), premaknjena ostane.
      const out = runRetention(db, { now: ob(30), log: quiet });
      assert.equal(out.priprave, 1);
      assert.deepEqual(ime(), [premik.id, brez.id]);
      assert.equal(db.prepare("SELECT COUNT(*) AS n FROM priprava_viri WHERE priprava_id = ?").get(sTestom.id).n, 0);
      // Brez datuma: zadnja uporaba D+10 → izbris od D+40 naprej (D+39 še ostane).
      assert.equal(pocistiPriprave(db, { now: ob(39) }), 0);
      assert.equal(pocistiPriprave(db, { now: ob(40) }), 1);
      assert.deepEqual(ime(), [premik.id]);
      // Premaknjena: test D+20 → izbris od D+50.
      assert.equal(pocistiPriprave(db, { now: ob(49) }), 0);
      assert.equal(pocistiPriprave(db, { now: ob(50) }), 1);
      assert.deepEqual(stej(db), { priprave: 0, viri: 0, izvirniki: 0 });
    },
    { clock },
  );
});

test("odstranjen datum testa: rok od zadnje uporabe; stara priprava z datumom ostane, če ga učenec podaljša", async () => {
  const t0 = Date.parse(`${dan(Date.now())}T08:00:00Z`);
  const clock = { t: t0 };
  await withServer(
    async ({ client, store, db }) => {
      const a = await account(client, store, "brez@priprava.si");
      const p = await nova(a, { naslov: "X", datum_testa: dan(t0) });
      clock.t = t0 + 25 * DAN;
      await a.call(`/api/students/${a.sid}/priprave/${p.id}`, { method: "PUT", body: { datum_testa: null } });
      assert.equal(pocistiPriprave(db, { now: t0 + 40 * DAN }), 0); // brez odstranitve bi šla na dan +30
      assert.equal(pocistiPriprave(db, { now: t0 + 55 * DAN }), 1);
    },
    { clock },
  );
});

test("brez ključa izvirnika ne sprejmemo (nešifrirano se ne shrani)", async () => {
  await withServer(async ({ client, store, db }) => {
    const a = await account(client, store, "kljuc@priprava.si");
    const p = await nova(a);
    const key = process.env.EVKLID_DATA_KEY;
    delete process.env.EVKLID_DATA_KEY;
    try {
      const r = await nalozi(a, p.id, PDF);
      assert.equal(r.status, 503);
      assert.equal(r.body.code, "priprava_brez_kljuca");
      assert.equal((await a.call(`/api/students/${a.sid}/priprave/${p.id}/viri`, { method: "POST", body: { besedilo: "x" } })).status, 503);
    } finally {
      process.env.EVKLID_DATA_KEY = key;
    }
    assert.deepEqual(stej(db), { priprave: 1, viri: 0, izvirniki: 0 });
  });
});

test("varnostna kopija in izvoz ne vsebujeta izvirnikov; izbris profila in računa odstrani vse", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "priprava-"));
  const file = path.join(dir, "evklid.db");
  try {
    await withServer(
      async ({ client, store, db }) => {
        const a = await account(client, store, "kopija@priprava.si");
        const b = await account(client, store, "drugi@priprava.si");
        const p = await nova(a, { naslov: "Kopija TAJNO" });
        await nalozi(a, p.id, PDF, { ime: "zapiski.pdf" });
        await a.call(`/api/students/${a.sid}/priprave/${p.id}/viri`, { method: "POST", body: { besedilo: `Besedilo ${MARKER}` } });
        const pb = await nova(b, { naslov: "Bor" });
        // Večji izvirnik (strani s prelivom v SQLite), da izbris preveri tudi proste strani.
        const vb = (await nalozi(b, pb.id, Buffer.concat([PDF, crypto.randomBytes(200_000)]))).body.vir;
        const kos = (vir) => {
          const blob = Buffer.from(db.prepare("SELECT podatki FROM priprava_izvirniki WHERE vir_id = ?").get(vir.id).podatki);
          return blob.subarray(blob.length >> 1, (blob.length >> 1) + 32);
        };
        const kosB = kos(vb);
        const vA = db.prepare("SELECT id FROM priprava_viri WHERE student_id = ? AND vrsta = 'pdf'").get(a.sid);
        const kosA = kos(vA);
        const vDatoteki = (k) => {
          db.exec("PRAGMA wal_checkpoint(TRUNCATE)");
          return fs.readFileSync(file).indexOf(k) >= 0;
        };
        assert.equal(vDatoteki(kosB), true);
        // test_plans ostane nedotaknjen (selitev pride pozneje).
        db.prepare("INSERT INTO test_plans (student_id, path_key, units, test_date) VALUES (?, 'p', '[0]', '2026-12-15')").run(a.sid);

        // Varnostna kopija: brez izvirnikov, brez bajtov izvirnika, metapodatki ostanejo.
        assert.equal(makeBackup(db, file, { now: new Date() }).made, true);
        const copy = listBackups(file)[0].file;
        const c = new DatabaseSync(copy, { readOnly: true });
        try {
          assert.equal(c.prepare("SELECT COUNT(*) AS n FROM priprava_izvirniki").get().n, 0);
          assert.equal(c.prepare("SELECT COUNT(*) AS n FROM priprava_viri").get().n, 3);
          assert.equal(c.prepare("SELECT COUNT(*) AS n FROM test_plans").get().n, 1);
        } finally {
          c.close();
        }
        const bytes = fs.readFileSync(copy);
        assert.equal(bytes.indexOf(MARKER), -1);
        assert.equal(bytes.indexOf("%PDF"), -1);
        // Tudi šifrirani bajti izvirnikov niso v kopiji (ne v prostih straneh).
        assert.equal(bytes.indexOf(kosA), -1);
        assert.equal(bytes.indexOf(kosB), -1);

        // Izvoz podatkov: priprava in metapodatki virov (odšifrirani), brez izvirnikov.
        const ex = await a.call("/api/account/export", { method: "POST", body: { password: "geslo1234" } });
        assert.equal(ex.status, 200, JSON.stringify(ex.body).slice(0, 200));
        const json = JSON.stringify(ex.body);
        assert.equal(ex.body.other.priprave[0].naslov, "Kopija TAJNO");
        assert.equal(ex.body.other.priprava_viri.length, 2);
        assert.equal(ex.body.other.priprava_viri.find((v) => v.vrsta === "pdf").ime, "zapiski.pdf");
        assert.equal(ex.body.other.priprava_izvirniki, undefined);
        assert.ok(!json.includes(MARKER));
        assert.ok(!json.includes(PDF.toString("base64").slice(0, 24)));
        assert.ok(!json.includes("Bor"));

        // Izbris profila (drug račun): njegove priprave gredo, prve ne.
        const delB = await b.call(`/api/students/${b.sid}`, { method: "DELETE", body: { password: "geslo1234" } });
        assert.ok([200, 204].includes(delB.status), JSON.stringify(delB.body));
        assert.deepEqual(stej(db), { priprave: 1, viri: 2, izvirniki: 2 });
        // secure_delete: šifrirani izvirnik izbrisanega profila ne ostane v prostih straneh baze.
        assert.equal(vDatoteki(kosB), false);
        // Izbris računa: vse priprave, viri in izvirniki, tudi iz prostih strani.
        assert.equal(vDatoteki(kosA), true);
        const del = await a.call("/api/account", { method: "DELETE", body: { password: "geslo1234" } });
        assert.equal(del.status, 200, JSON.stringify(del.body));
        assert.deepEqual(stej(db), { priprave: 0, viri: 0, izvirniki: 0 });
        assert.equal(vDatoteki(kosA), false);
      },
      { file },
    );
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("migracija na obstoječi bazi: tabele nastanejo, ponoven zagon ne spremeni ničesar, test_plans ostane", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "priprava-m-"));
  const file = path.join(dir, "evklid.db");
  try {
    let store = openDb(file);
    store.db.prepare("INSERT INTO students (id, name, settings) VALUES (1, 'A', '{}')").run();
    store.db.prepare("INSERT INTO test_plans (student_id, path_key, units, test_date) VALUES (1, 'p', '[1]', '2026-12-01')").run();
    // Starejša baza brez tabel priprave.
    store.db.exec("DROP TABLE priprava_izvirniki; DROP TABLE priprava_viri; DROP TABLE priprave;");
    store.db.close();
    store = openDb(file);
    const t = (n) => !!store.db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?").get(n);
    assert.ok(t("priprave") && t("priprava_viri") && t("priprava_izvirniki"));
    assert.deepEqual({ ...store.db.prepare("SELECT student_id, path_key, units, test_date FROM test_plans").get() }, { student_id: 1, path_key: "p", units: "[1]", test_date: "2026-12-01" });
    store.db.prepare("INSERT INTO priprave (student_id, naslov) VALUES (1, 'x')").run();
    const fk = store.db.prepare("PRAGMA foreign_key_list(priprava_izvirniki)").all();
    assert.equal(fk[0].table, "priprava_viri");
    assert.equal(fk[0].on_delete, "CASCADE");
    store.db.close();
    store = openDb(file);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM priprave").get().n, 1);
    store.db.prepare("DELETE FROM students WHERE id = 1").run();
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM priprave").get().n, 0);
    store.db.close();
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("menjava ključa: izvirniki se zašifrirajo znova s sedanjim ključem, stari ključ nato ni več potreben", async () => {
  const { migrateEncryption, encryptionStats } = await import("../server/zasebnost.js");
  const k1 = process.env.EVKLID_DATA_KEY;
  await withServer(async ({ client, store, db }) => {
    const a = await account(client, store, "menjava@priprava.si");
    const p = await nova(a);
    const v = (await nalozi(a, p.id, PDF)).body.vir;
    const k2 = crypto.randomBytes(32).toString("base64");
    process.env.EVKLID_DATA_KEY = k2;
    process.env.EVKLID_DATA_KEYS_OLD = `staro:${k1}`;
    try {
      assert.equal(encryptionStats(db).find((x) => x.table === "priprava_izvirniki").oldKey, 1);
      assert.equal(migrateEncryption(db).priprava_izvirniki, 1);
      const st = encryptionStats(db).find((x) => x.table === "priprava_izvirniki");
      assert.deepEqual([st.encrypted, st.oldKey, st.unreadable], [1, 0, 0]);
      delete process.env.EVKLID_DATA_KEYS_OLD;
      const dl = await a.call(`/api/students/${a.sid}/priprave/${p.id}/viri/${v.id}/izvirnik`);
      assert.equal(dl.status, 200);
      assert.deepEqual(dl.body, PDF);
      assert.equal(migrateEncryption(db).priprava_izvirniki, undefined); // nič več za menjavo
    } finally {
      process.env.EVKLID_DATA_KEY = k1;
      delete process.env.EVKLID_DATA_KEYS_OLD;
    }
  });
});

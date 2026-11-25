// Priprava na test PR 3b: branje fotografij vira z modelom (server/priprava/poti.js …/preberi), ista meja strani in
// trda meja AI kot »Moji zapiski« (server/zapiski.js). Model je tu nadomeščen (readFn); pravi klic ni v testih.
import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { cleanRead } from "../server/zapiski.js";

process.env.EVKLID_DATA_KEY ||= crypto.randomBytes(32).toString("base64");
const quiet = { log() {}, info() {}, warn() {}, error() {} };
const JPEG = (n = 40) => Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), crypto.randomBytes(n), Buffer.from([0xff, 0xd9])]);
const usageOf = () => ({ input_tokens: 1500, output_tokens: 400 });
const PREPIS = "Integrali\nDoločeni integral: $\\int_a^b f(x)\\,dx = F(b) - F(a)$.\n- Newton-Leibnizova formula\n- ploščina pod krivuljo";

async function withApp(readFn, fn) {
  const store = openDb(":memory:");
  const app = createApp(store, { scheduler: false, log: quiet, pripravaReadFn: readFn, zapiskiRights: () => ({ personal: false, school: false }) });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const req = async (method, p, body, headers = { "Content-Type": "application/json" }) => {
    const r = await fetch(base + p, { method, headers, body: Buffer.isBuffer(body) ? body : body ? JSON.stringify(body) : undefined });
    return { status: r.status, body: r.headers.get("content-type")?.includes("json") ? await r.json() : await r.text() };
  };
  const s = (await req("POST", "/api/students", { name: "Eva", settings: { curriculum_level: "4. letnik", subject: "MAT" } })).body;
  const p = (await req("POST", `/api/students/${s.id}/priprave`, { naslov: "Integrali", predmet: "MAT" })).body.priprava;
  const nalozi = async (buf) => {
    const r = await req("POST", `/api/students/${s.id}/priprave/${p.id}/viri`, buf, { "Content-Type": "application/octet-stream" });
    assert.equal(r.status, 201, JSON.stringify(r.body));
    return r.body.vir;
  };
  const beri = (vid, q = "") => req("POST", `/api/students/${s.id}/priprave/${p.id}/viri/${vid}/preberi${q}`);
  try {
    await fn({ store, db: store.db, req, s, p, nalozi, beri });
  } finally {
    await new Promise((r) => server.close(r));
    store.db.close();
  }
}

test("branje fotografije: prepis → izseki, porabi stran, strošek v usage »priprava«, oznaka AI; brez ponovnega klica", async () => {
  const klici = [];
  const readFn = async (a) => {
    klici.push(a);
    return { ...cleanRead({ text: PREPIS, kind: "rokopis" }), usage: usageOf(), model: "claude-sonnet-5-5" };
  };
  await withApp(readFn, async ({ db, req, s, p, nalozi, beri }) => {
    const slika = JPEG();
    const vir = await nalozi(slika);
    assert.equal(vir.stanje, "branje");
    const r = await beri(vir.id);
    assert.equal(r.status, 200, JSON.stringify(r.body));
    assert.equal(r.body.ai_generated, true);
    assert.equal(r.body.vir.stanje, "obdelan");
    assert.ok(r.body.vir.izsekov >= 1);
    assert.deepEqual({ used: r.body.pages.used, limit: r.body.pages.limit }, { used: 1, limit: 2 });
    assert.equal(klici.length, 1);
    assert.equal(klici[0].mediaType, "image/jpeg");
    assert.ok(Buffer.from(klici[0].imageBase64, "base64").equals(slika));
    const iz = (await req("GET", `/api/students/${s.id}/priprave/${p.id}/izseki?vir=${vir.id}`)).body.izseki;
    const vse = iz.map((x) => x.besedilo).join("\n");
    assert.ok(vse.includes("Newton-Leibnizova formula") && vse.includes("\\int_a^b"), vse);
    assert.equal(iz[0].naslov ?? "Integrali", "Integrali");
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM usage WHERE student_id = ? AND kind = 'priprava'").get(s.id).n, 1);
    // Prepis je v bazi šifriran.
    assert.ok(!JSON.stringify(db.prepare("SELECT * FROM priprava_izseki").all()).includes("Newton"));
    // Že prebrano: brez klica in brez strani; ?znova=1 prebere znova (stara izseka zamenja).
    const r2 = await beri(vir.id);
    assert.equal(r2.status, 200);
    assert.equal(klici.length, 1);
    assert.equal(r2.body.pages.used, 1);
    const r3 = await beri(vir.id, "?znova=1");
    assert.equal(r3.status, 200);
    assert.equal(klici.length, 2);
    assert.equal(r3.body.pages.used, 2);
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM priprava_izseki WHERE vir_id = ?").get(vir.id).n, r.body.vir.izsekov);
  });
});

test("branje: meja strani, neuspelo branje in brez ključa strani ne porabi; samo fotografije; tuj profil 404", async () => {
  let nacin = "ok";
  const readFn = async () => {
    if (nacin === "napaka") throw new Error("overloaded");
    if (nacin === "mock") return { mock: true, text: "", kind: "rokopis", usage: null };
    return { ...cleanRead({ text: "Odvod\nf'(x) = 2x", kind: "rokopis" }), usage: usageOf(), model: "claude-sonnet-5-5" };
  };
  await withApp(readFn, async ({ db, req, s, p, nalozi, beri }) => {
    const a = await nalozi(JPEG());
    nacin = "napaka";
    const e = await beri(a.id);
    assert.equal(e.status, 502);
    assert.equal(e.body.code, "priprava_branje_napaka");
    nacin = "mock";
    const m = await beri(a.id);
    assert.equal(m.body.mock, true);
    assert.equal(m.body.pages.used, 0);
    nacin = "ok";
    assert.equal((await beri(a.id)).status, 200);
    const b = await nalozi(JPEG(41));
    assert.equal((await beri(b.id)).status, 200);
    const c = await nalozi(JPEG(42));
    const over = await beri(c.id);
    assert.equal(over.status, 429);
    assert.equal(over.body.code, "zapiski_strani");
    assert.equal(over.body.pages.used, 2);
    // Besedilni vir se ne bere z modelom.
    const t = await req("POST", `/api/students/${s.id}/priprave/${p.id}/viri`, { besedilo: "# Naslov\nbesedilo" });
    assert.equal(t.status, 201, JSON.stringify(t.body));
    assert.equal((await beri(t.body.vir.id)).body.code, "priprava_ni_slika");
    // Tuj profil in neobstoječ vir: 404.
    const tuj = (await req("POST", "/api/students", { name: "Ana", settings: {} })).body;
    assert.equal((await req("POST", `/api/students/${tuj.id}/priprave/${p.id}/viri/${a.id}/preberi`)).status, 404);
    assert.equal((await beri(999999)).status, 404);
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM usage WHERE kind = 'priprava'").get().n, 2);
  });
});

test("branje: neučna fotografija 422 (vir napaka), stiska odpre okno nujne pomoči, prazna stran, prevelika slika", async () => {
  let odgovor = { unrelated: true, text: "selfie", distress: "self_harm" };
  const readFn = async () => ({ ...cleanRead(odgovor), usage: usageOf(), model: "claude-sonnet-5-5" });
  await withApp(readFn, async ({ db, nalozi, beri }) => {
    const a = await nalozi(JPEG());
    const r = await beri(a.id);
    assert.equal(r.status, 422);
    assert.equal(r.body.code, "zapiski_neucno");
    assert.equal(r.body.vir.stanje, "napaka");
    assert.equal(r.body.vir.napaka, "branje_neucno");
    assert.equal(r.body.nujno?.vrsta, "stiska");
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM priprava_izseki").get().n, 0);
    odgovor = { text: "" };
    const b = await nalozi(JPEG(41));
    const prazna = await beri(b.id);
    assert.equal(prazna.status, 200);
    assert.equal(prazna.body.vir.napaka, "branje_prazno");
    // Fotografija nad mejo slike modela (base64 > 6 MB) se ne pošlje.
    const velika = await nalozi(JPEG(4.6 * 1024 * 1024));
    const v = await beri(velika.id);
    assert.equal(v.status, 413);
    assert.equal(v.body.code, "priprava_slika_velika");
    assert.equal(v.body.vir.napaka, "branje_velika");
  });
});

test("branje: vir, izbrisan med branjem, se ne shrani; hkratno branje istega vira je zavrnjeno", async () => {
  let spusti;
  const zapora = new Promise((r) => (spusti = r));
  const readFn = async () => {
    await zapora;
    return { ...cleanRead({ text: PREPIS }), usage: usageOf(), model: "claude-sonnet-5-5" };
  };
  await withApp(readFn, async ({ db, req, s, p, nalozi, beri }) => {
    const a = await nalozi(JPEG());
    const prvo = beri(a.id);
    await new Promise((r) => setTimeout(r, 50));
    const drugo = await beri(a.id);
    assert.equal(drugo.status, 409);
    assert.equal(drugo.body.code, "priprava_zasedeno");
    assert.equal((await req("DELETE", `/api/students/${s.id}/priprave/${p.id}/viri/${a.id}`)).status, 200);
    spusti();
    assert.equal((await prvo).status, 404);
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM priprava_izseki").get().n, 0);
  });
});

// Priprava na test PR 5: načrtovalnik (server/priprava/nacrt.js) – dnevni načrt do testa iz izkazanega znanja,
// brez AI in brez napovedi ocen; pot …/priprave/:pid/nacrt.
import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { sestaviNacrt, enoteTeme, ocenaTeme, NA_DAN, BREZ_DATUMA_DNI } from "../server/priprava/nacrt.js";

process.env.EVKLID_DATA_KEY ||= crypto.randomBytes(32).toString("base64");
const tema = (id, ocena, o = {}) => ({ id, ime: id, sklop: "S", red: Number(id.replace(/\D/g, "")) || 0, izsekov: 1, ocena, vaja: true, danesNalog: 0, ...o });
const vseNaloge = (n) => n.dnevi.flatMap((d) => d.naloge.map((x) => ({ ...x, datum: d.datum })));

test("enote po izkazanem znanju; ocena teme kot pripravljenost na izpit", () => {
  assert.deepEqual(enoteTeme(tema("t1", 0)), ["nova", "vaja", "ponovitev"]);
  assert.deepEqual(enoteTeme(tema("t1", 0.4)), ["vaja", "ponovitev"]);
  assert.deepEqual(enoteTeme(tema("t1", 0.8)), ["ponovitev"]);
  assert.deepEqual(enoteTeme(tema("t1", 1)), []);
  assert.deepEqual(enoteTeme(tema("t1", 0, { vaja: false })), ["zapiski"]);
  assert.equal(ocenaTeme(null, "2026-12-01 00:00:00"), 0);
  assert.equal(ocenaTeme({ status: "learning", level: 2 }, "x"), 0.4);
  assert.equal(ocenaTeme({ status: "mastered", review_due: "2026-11-01 00:00:00" }, "2026-12-01 00:00:00"), 0.8);
  assert.equal(ocenaTeme({ status: "mastered", review_due: "2026-12-31 00:00:00" }, "2026-12-01 00:00:00"), 1);
});

test("načrt do testa: najšibkejše prve, razmik med enotami, največ NA_DAN na dan, poskusni test zadnji dan", () => {
  const n = sestaviNacrt({ danes: "2026-12-01", datum: "2026-12-11", teme: [tema("t1", 1), tema("t2", 0), tema("t3", 0.4), tema("t4", 0.8)] });
  assert.equal(n.dni, 10);
  assert.equal(n.dnevi[0].datum, "2026-12-01");
  assert.equal(n.dnevi.at(-1).datum, "2026-12-10");
  assert.ok(n.dnevi.every((d) => d.naloge.length <= NA_DAN + (d === n.dnevi.at(-1) ? 1 : 0)));
  assert.deepEqual(n.dnevi.at(-1).naloge.map((x) => x.vrsta), ["poskusni_test"]);
  // Obvladana tema nima enot; nova ima tri, razmaknjene vsaj za dan in vse pred poskusnim testom.
  const vse = vseNaloge(n);
  assert.ok(!vse.some((x) => x.tema?.id === "t1"));
  const t2 = vse.filter((x) => x.tema?.id === "t2");
  assert.deepEqual(t2.map((x) => x.vrsta), ["nova", "vaja", "ponovitev"]);
  assert.ok(t2[0].datum < t2[1].datum && t2[1].datum < t2[2].datum);
  // Prvi dan začne z najšibkejšo temo.
  assert.equal(n.naslednja.tema.id, "t2");
  assert.equal(n.stisnjeno, false);
  assert.deepEqual(n.pripravljenost, { odstotek: Math.round((100 * (1 + 0 + 0.4 + 0.8)) / 4), obvladanih: 1, preverljivih: 4, nepreverljivih: 0 });
});

test("premalo časa: vsaka šibka tema pride na vrsto, odpadejo poznejše enote; brez datuma en teden; test mimo", () => {
  const teme = Array.from({ length: 8 }, (_, i) => tema(`t${i + 1}`, 0));
  const n = sestaviNacrt({ danes: "2026-12-01", datum: "2026-12-04", teme });
  assert.equal(n.dni, 3);
  assert.equal(n.stisnjeno, true);
  const prve = vseNaloge(n).filter((x) => x.vrsta === "nova").map((x) => x.tema.id);
  // 2 učna dneva × 3 = 6 mest: šest tem dobi novo snov, dve ne prideta na vrsto.
  assert.equal(prve.length, 6);
  assert.ok(n.nePrideNaVrsto.some((x) => x.tema.id === "t8" && x.vrsta === "nova"));
  assert.ok(!vseNaloge(n).some((x) => x.vrsta === "vaja" && !prve.includes(x.tema.id)), "vaja brez nove snovi ne pride v načrt");
  const brez = sestaviNacrt({ danes: "2026-12-01", teme: [tema("t1", 0)] });
  assert.equal(brez.dni, BREZ_DATUMA_DNI);
  assert.ok(!vseNaloge(brez).some((x) => x.vrsta === "poskusni_test"));
  const mimo = sestaviNacrt({ danes: "2026-12-05", datum: "2026-12-01", teme: [tema("t1", 0)] });
  assert.equal(mimo.mimo, true);
  assert.deepEqual(mimo.dnevi, []);
  assert.equal(mimo.naslednja, null);
});

test("danes opravljeno po rešenih nalogah; tema brez nalog je »zapiski« in ne šteje v pripravljenost", () => {
  const n = sestaviNacrt({ danes: "2026-12-01", datum: "2026-12-08", teme: [tema("t1", 0.4, { danesNalog: 3 }), tema("t2", 0.2), tema("t3", 0, { vaja: false })] });
  const danes = n.dnevi[0].naloge;
  assert.equal(danes.find((x) => x.tema.id === "t1").opravljeno, true);
  assert.equal(danes.find((x) => x.tema.id === "t2").opravljeno, false);
  assert.equal(n.naslednja.tema.id, "t2");
  assert.ok(vseNaloge(n).some((x) => x.tema?.id === "t3" && x.vrsta === "zapiski"));
  assert.equal(n.pripravljenost.preverljivih, 2);
  assert.equal(n.pripravljenost.nepreverljivih, 1);
});

test("API: načrt iz obsega testa in rešenih nalog; tuj profil 404", async () => {
  const store = openDb(":memory:");
  const app = createApp(store, { scheduler: false, log: { log() {}, info() {}, warn() {}, error() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const req = async (method, p, body) => {
    const r = await fetch(base + p, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    return { status: r.status, body: await r.json() };
  };
  try {
    const s = (await req("POST", "/api/students", { name: "Eva", settings: { curriculum_level: "4. letnik", educational_track: "SREDNJA_SOLA", subject: "MAT" } })).body;
    const datum = new Date(Date.now() + 10 * 86400000).toISOString().slice(0, 10);
    const p = (await req("POST", `/api/students/${s.id}/priprave`, { naslov: "Integrali", predmet: "MAT", datum_testa: datum })).body.priprava;
    const zap = fs.readFileSync(new URL("./fixtures/priprava/mat-integrali.md", import.meta.url), "utf8");
    assert.equal((await req("POST", `/api/students/${s.id}/priprave/${p.id}/viri`, { besedilo: zap })).status, 201);
    store.db.prepare("UPDATE priprave SET pot = 'MAT-SS-4', sklopi = '[2]' WHERE id = ?").run(p.id);
    // Določeni integral je obvladan (izkazano z nalogami): v načrtu ga ni.
    store.db
      .prepare("INSERT INTO topic_state (student_id, topic_id, level, streak, status, mastered_at, review_due) VALUES (?, 'MAT-SS-4/doloceni-integral', 3, 3, 'mastered', datetime('now'), datetime('now', '+30 days'))")
      .run(s.id);
    const r = await req("GET", `/api/students/${s.id}/priprave/${p.id}/nacrt`);
    assert.equal(r.status, 200, JSON.stringify(r.body));
    assert.equal(r.body.obsegIzNacrta, true);
    const ids = r.body.dnevi.flatMap((d) => d.naloge.map((x) => x.tema?.id)).filter(Boolean);
    assert.ok(ids.includes("MAT-SS-4/nedoloceni-integral"));
    assert.ok(!ids.includes("MAT-SS-4/doloceni-integral"));
    assert.equal(r.body.pripravljenost.obvladanih, 1);
    // Priprava ni aktivna (ni načrta testa iz urnika): brez poskusnega testa.
    assert.ok(!r.body.dnevi.some((d) => d.naloge.some((x) => x.vrsta === "poskusni_test")));
    const tuj = (await req("POST", "/api/students", { name: "Ana", settings: {} })).body;
    assert.equal((await req("GET", `/api/students/${tuj.id}/priprave/${p.id}/nacrt`)).status, 404);
  } finally {
    await new Promise((r) => server.close(r));
    store.db.close();
  }
});

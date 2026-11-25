// Priprava na test PR 6a: kviz (seja »list« iz najšibkejših tem obsega, naloge Vadnice) in napredek (pripravljenost po
// dnevih, stanje tem iz rešenih nalog); brez AI. Pot …/priprave/:pid/kviz in …/napredek.
import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

process.env.EVKLID_DATA_KEY ||= crypto.randomBytes(32).toString("base64");

async function streznik() {
  const store = openDb(":memory:");
  const app = createApp(store, { scheduler: false, log: { log() {}, info() {}, warn() {}, error() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const req = async (method, p, body) => {
    const r = await fetch(base + p, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    return { status: r.status, body: await r.json() };
  };
  const s = (await req("POST", "/api/students", { name: "Eva", settings: { curriculum_level: "4. letnik", educational_track: "SREDNJA_SOLA", subject: "MAT" } })).body;
  const p = (await req("POST", `/api/students/${s.id}/priprave`, { naslov: "Integrali", predmet: "MAT" })).body.priprava;
  const zap = fs.readFileSync(new URL("./fixtures/priprava/mat-integrali.md", import.meta.url), "utf8");
  assert.equal((await req("POST", `/api/students/${s.id}/priprave/${p.id}/viri`, { besedilo: zap })).status, 201);
  store.db.prepare("UPDATE priprave SET pot = 'MAT-SS-4', sklopi = '[2]' WHERE id = ?").run(p.id);
  const konec = async () => {
    await new Promise((r) => server.close(r));
    store.db.close();
  };
  return { store, req, s, p, konec };
}

test("kviz: seja »list« iz najšibkejših tem obsega; obvladana tema ne, tuje teme ne; tuj profil 404", async () => {
  const { store, req, s, p, konec } = await streznik();
  try {
    store.db
      .prepare("INSERT INTO topic_state (student_id, topic_id, level, streak, status, source, mastered_at, review_due) VALUES (?, 'MAT-SS-4/doloceni-integral', 3, 3, 'mastered', 'practice', datetime('now'), datetime('now', '+30 days'))")
      .run(s.id);
    const r = await req("POST", `/api/students/${s.id}/priprave/${p.id}/kviz`, { dolzina: 6 });
    assert.equal(r.status, 200, JSON.stringify(r.body));
    const sess = store.db.prepare("SELECT kind, plan FROM sessions WHERE student_id = ? ORDER BY id DESC LIMIT 1").get(s.id);
    assert.equal(sess.kind, "list");
    const teme = new Set(JSON.parse(sess.plan).map((x) => x.topic));
    assert.ok(teme.has("MAT-SS-4/nedoloceni-integral"), [...teme].join());
    assert.ok(!teme.has("MAT-SS-4/doloceni-integral"), "obvladana tema ni v kvizu, dokler so šibke");
    assert.ok([...teme].every((t) => t.startsWith("MAT-SS-4/")));
    assert.ok(store.db.prepare("SELECT COUNT(*) AS n FROM tasks WHERE student_id = ? AND mode = 'list'").get(s.id).n >= 1);
    // Izbrane teme: samo iz načrta te priprave.
    assert.equal((await req("POST", `/api/students/${s.id}/priprave/${p.id}/kviz`, { dolzina: 6, teme: ["MAT-OS-8/pitagorov-izrek"] })).status, 400);
    const izb = await req("POST", `/api/students/${s.id}/priprave/${p.id}/kviz`, { dolzina: 6, teme: ["MAT-SS-4/doloceni-integral"] });
    assert.equal(izb.status, 200);
    assert.equal((await req("POST", `/api/students/${s.id}/priprave/${p.id}/kviz`, { dolzina: 7 })).status, 400);
    const tuj = (await req("POST", "/api/students", { name: "Ana", settings: {} })).body;
    assert.equal((await req("POST", `/api/students/${tuj.id}/priprave/${p.id}/kviz`, { dolzina: 6 })).status, 404);
  } finally {
    await konec();
  }
});

test("napredek: en posnetek na dan, stanje tem iz rešenih nalog vaje (ne testa); tuj profil 404", async () => {
  const { store, req, s, p, konec } = await streznik();
  try {
    let r = await req("GET", `/api/students/${s.id}/priprave/${p.id}/napredek`);
    assert.equal(r.status, 200, JSON.stringify(r.body));
    assert.equal(r.body.dnevi.length, 1);
    assert.equal(r.body.dnevi[0].odstotek, 0);
    const ned = r.body.teme.find((t) => t.id === "MAT-SS-4/nedoloceni-integral");
    assert.equal(ned.stanje, "nova");
    // Rešene naloge: vaja šteje, test ne.
    const ins = store.db.prepare("INSERT INTO tasks (student_id, topic_id, level, payload, solved, mode, first_try_correct) VALUES (?, 'MAT-SS-4/nedoloceni-integral', 1, '{}', 1, ?, ?)");
    ins.run(s.id, "practice", 1);
    ins.run(s.id, "practice", 0);
    ins.run(s.id, "test", 1);
    store.db.prepare("INSERT INTO topic_state (student_id, topic_id, level, status) VALUES (?, 'MAT-SS-4/nedoloceni-integral', 2, 'learning')").run(s.id);
    await req("GET", `/api/students/${s.id}/priprave/${p.id}/nacrt`);
    r = await req("GET", `/api/students/${s.id}/priprave/${p.id}/napredek`);
    assert.equal(r.body.dnevi.length, 1, "en posnetek na dan");
    assert.ok(r.body.dnevi[0].odstotek > 0);
    const t = r.body.teme.find((x) => x.id === "MAT-SS-4/nedoloceni-integral");
    assert.deepEqual([t.stanje, t.nalog, t.pravilnihVPrvo], ["ucim", 2, 1]);
    // Posnetek se izbriše s pripravo.
    assert.equal((await req("DELETE", `/api/students/${s.id}/priprave/${p.id}`)).status, 200);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM priprava_napredek").get().n, 0);
    const tuj = (await req("POST", "/api/students", { name: "Ana", settings: {} })).body;
    assert.equal((await req("GET", `/api/students/${tuj.id}/priprave/${p.id}/napredek`)).status, 404);
  } finally {
    await konec();
  }
});

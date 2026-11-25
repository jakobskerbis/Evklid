// »Kaj še ne znam« na vrhu Napredka (P1-8, 2. del; j 25. 11. 2026): šibke teme z dokazom (napake, kje) in gumboma
// Vadi (samo tema z generatorjem) in Ponovi lekcijo (samo tema z lekcijo). GET /api/students/:id/vrzeli, public/vrzeli.js.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { recordSkill } from "../server/weaknesses.js";

const OHM = "FIZ-OS-9/upor-in-ohmov-zakon";

test("vrzeli: šibka tema z viri od največ napak, vaja in lekcija; ročne šibke točke posebej", async () => {
  const store = openDb(":memory:");
  const server = createApp(store, { scheduler: false }).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const get = async (p) => (await fetch(base + p)).json();
  try {
    const s = await (await fetch(`${base}/api/students`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "Ana", settings: { subject: "FIZ", curriculum_level: "9. razred" } }) })).json();
    assert.deepEqual(await get(`/api/students/${s.id}/vrzeli`), { teme: [], rocne: [] });
    recordSkill(store.db, s.id, { source: "lesson", topicId: OHM, n: 2, wrong: 1 });
    recordSkill(store.db, s.id, { source: "cards", topicId: OHM, n: 3, wrong: 3 });
    recordSkill(store.db, s.id, { source: "game", topicId: OHM, n: 1, wrong: 0 });
    store.db.prepare("UPDATE students SET manual_weaknesses = ? WHERE id = ?").run(JSON.stringify(["ulomki"]), s.id);
    const d = await get(`/api/students/${s.id}/vrzeli`);
    assert.equal(d.teme.length, 1);
    const [w] = d.teme;
    assert.equal(w.topic_id, OHM);
    assert.equal(w.errors, 4);
    assert.equal(w.turns, 6);
    assert.deepEqual(w.viri, ["cards", "lesson"]); // igra brez napak ni vir
    assert.equal(w.lekcija, true);
    assert.equal(typeof w.vaja, "boolean");
    assert.deepEqual(d.rocne, ["ulomki"]);
    assert.equal((await fetch(`${base}/api/students/99999/vrzeli`)).status >= 400, true);
  } finally {
    server.close();
  }
});

test("vrzeli: Napredek začne s karto »Kaj še ne znam«, app.js samo kliče modul, prevodi v 6 živih jezikih", () => {
  const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
  const prog = html.slice(html.indexOf('id="view-progress"'));
  assert.ok(prog.indexOf('class="card vrzeli-card"') < prog.indexOf('id="prog-goal"'), "karta je na vrhu Napredka");
  const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
  const vrstica = app.split("\n").find((l) => l.includes('import("./vrzeli.js")')) || "";
  for (const del of ["m.narisiVrzeli(state.student.id", 'setBack("path")', "openTopic(id)", "nextPractice()"]) assert.ok(vrstica.includes(del), del);
  assert.doesNotMatch(app, /p\.weak\.map/);
  const keys = ["vr.napake", "vr.kje", "vr.in", "vr.vadi", "vr.lekcija", "vr.prazno", ...["chat", "practice", "game", "lesson", "paper", "cards", "kviz", "scan", "lab", "atlas"].map((v) => `vr.vir.${v}`)];
  const sl = fs.readFileSync(new URL("../public/i18n/sl.js", import.meta.url), "utf8");
  for (const k of keys) assert.ok(sl.includes(`"${k}":`), `sl ${k}`);
  assert.match(sl, /"prog\.weak": "Kaj še ne znam"/);
  for (const l of ["en", "de", "hr", "it", "hu"]) {
    const j = JSON.parse(fs.readFileSync(new URL(`../public/i18n/ui/${l}.json`, import.meta.url), "utf8"));
    for (const k of keys) assert.ok(j[k], `${l} ${k}`);
  }
});

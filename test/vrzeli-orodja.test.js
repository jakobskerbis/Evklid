// Vrzeli iz orodij (P1-8, načrt treh prioritet): skener, laboratorij in kviz atlasa polnijo iste šibke točke
// (server/weaknesses.js recordToolResult, POST /api/students/:id/tool-check).
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { recordToolResult, skillStats, TOOL_DAY_MAX } from "../server/weaknesses.js";
import { sourceWords } from "../server/accounts/weekly.js";

const OHM = "FIZ-OS-9/upor-in-ohmov-zakon";
const S9 = { subject: "FIZ", curriculum_level: "9. razred", school_system: "SI" };

test("orodja: rezultat šteje pod temo učne poti, isto vprašanje enkrat na dan, največ TOOL_DAY_MAX na temo", () => {
  const store = openDb(":memory:");
  const s = store.createStudent("Ana", S9);
  assert.equal(recordToolResult(store.db, s.id, { source: "scan", topicId: OHM, item: "n1", ok: false }), true);
  assert.equal(recordToolResult(store.db, s.id, { source: "scan", topicId: OHM, item: "n1", ok: false }), false); // isto vprašanje
  assert.equal(recordToolResult(store.db, s.id, { source: "lab", topicId: OHM, item: "ohm:napoved", ok: true }), true);
  // Neveljavno: neznan vir, neznana tema, ok ni true/false.
  assert.equal(recordToolResult(store.db, s.id, { source: "game", topicId: OHM, item: "x", ok: false }), false);
  assert.equal(recordToolResult(store.db, s.id, { source: "lab", topicId: "X/y", item: "x", ok: false }), false);
  assert.equal(recordToolResult(store.db, s.id, { source: "lab", topicId: OHM, item: "y", ok: "da" }), false);
  for (let i = 0; i < 10; i++) recordToolResult(store.db, s.id, { source: "atlas", topicId: OHM, item: `q${i}`, ok: false });
  const atlas = store.db.prepare("SELECT n, wrong FROM skill_results WHERE source = 'atlas'").get();
  assert.deepEqual({ ...atlas }, { n: TOOL_DAY_MAX, wrong: TOOL_DAY_MAX });
  const [row] = skillStats(store, s).filter((x) => x.topic_id === OHM);
  assert.deepEqual(row.sources.scan, { n: 1, wrong: 1 });
  assert.deepEqual(row.sources.lab, { n: 1, wrong: 0 });
  assert.equal(row.turns, 1 + 1 + TOOL_DAY_MAX);
  assert.equal(row.weak, true); // 5 napak od 6, iz istega dne, a ≥ 3 napake
  assert.equal(sourceWords(row.sources), "v kvizu 3D atlasa in pri skeniranih nalogah");
});

test("orodja API: laboratorij in atlas prek tool-check, skenerja brskalnik ne more zapisati", async () => {
  const store = openDb(":memory:");
  const server = createApp(store, { scheduler: false }).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (p, body) => {
    const res = await fetch(base + p, { method: body ? "POST" : "GET", headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    return { status: res.status, body: await res.json() };
  };
  try {
    const s = (await call("/api/students", { name: "Bor", settings: S9 })).body;
    const p = `/api/students/${s.id}/tool-check`;
    for (const bad of [{ source: "scan", topic: OHM, item: "a", ok: false }, { source: "lab", topic: "X/y", item: "a", ok: false }, { source: "lab", topic: OHM, ok: false }, { source: "lab", topic: OHM, item: "a", ok: 1 }])
      assert.equal((await call(p, bad)).status, 400, JSON.stringify(bad));
    assert.deepEqual((await call(p, { source: "lab", topic: OHM, item: "ohm:racun", ok: false })).body, { counted: true });
    assert.deepEqual((await call(p, { source: "lab", topic: OHM, item: "ohm:racun", ok: true })).body, { counted: false });
    assert.deepEqual((await call(p, { source: "atlas", topic: OHM, item: "q1", ok: false })).body, { counted: true });
    const row = (await call(`/api/students/${s.id}/progress`)).body.topics.find((x) => x.topic_id === OHM);
    assert.deepEqual(row.sources, { lab: { n: 1, wrong: 1 }, atlas: { n: 1, wrong: 1 } });
  } finally {
    server.close();
  }
});

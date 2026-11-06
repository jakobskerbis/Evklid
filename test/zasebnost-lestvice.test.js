// P2: vaje brez povezave ne dajo neomejenega XP (samo izdane naloge, največ 60 na dan).
// P3: ime učenca se v odgovoru za druge učence zamenja samo kot cela beseda.
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { Progress } from "../server/progress.js";
import { pathKeyFor } from "../server/curriculum.js";
import { generateTask, hasGenerator } from "../server/practice/index.js";
import { genericAnswer } from "../server/reports.js";

// Pravilen odgovor naloge kot niz, kot bi ga vpisal učenec.
const rightAnswer = (a) =>
  a.type === "number" ? String(a.value).replace(".", ",") + (a.unit ? " " + a.unit : "") : a.type === "fraction" ? `${a.num}/${a.den}` : a.type === "choice" ? String(a.index) : (a.values || []).join(",");

test("P2: offline-sync ne sprejme semen, ki jih strežnik ni izdal (brez kmetovanja XP)", () => {
  const store = openDb(":memory:");
  const progress = new Progress(store);
  const s = store.createStudent("Ana", { level: "OS", grade: 8 });
  const pack = progress.offlinePack(s.id, pathKeyFor(s.settings), 2);
  const topicId = Object.keys(pack.tasks).find((id) => hasGenerator(id));
  // izmišljene naloge (lastna semena) s pravilnimi odgovori, kot bi jih poslal skript
  const forged = Array.from({ length: 300 }, (_, i) => {
    const t = generateTask(topicId, 3, 900000 + i, "sl");
    return { topic_id: topicId, level: 3, seed: 900000 + i, answer: rightAnswer(t.answer) };
  });
  const out = progress.offlineSync(s.id, forged);
  assert.equal(out.synced, 0);
  assert.equal(out.skipped, 300);
  assert.equal(progress.xpSummary(s.id).total, 0);
  // izdana naloga z napačno ravnjo tudi ne šteje
  const one = pack.tasks[topicId][0];
  assert.equal(progress.offlineSync(s.id, [{ topic_id: topicId, level: one.level === 3 ? 1 : one.level + 1, seed: one.seed, answer: "1" }]).synced, 0);
  // izdana naloga šteje (enkrat)
  const real = pack.tasks[topicId].map((t) => ({ topic_id: topicId, level: t.level, seed: t.seed, answer: rightAnswer(t.answer) }));
  assert.equal(progress.offlineSync(s.id, real).synced, real.length);
  assert.ok(progress.xpSummary(s.id).total > 0);
  assert.equal(progress.offlineSync(s.id, real).synced, 0, "ista naloga ne šteje dvakrat");
});

test("P2: največ 60 nalog brez povezave na dan, tudi z izdanimi semeni", async () => {
  const store = openDb(":memory:");
  const app = createApp(store, { scheduler: false });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const j = (p, o = {}) => fetch(base + p, { method: o.method || "GET", headers: { "Content-Type": "application/json" }, body: o.body ? JSON.stringify(o.body) : undefined }).then((r) => r.json());
  try {
    const s = await j("/api/students", { method: "POST", body: { name: "Ana", settings: { level: "OS", grade: 8 } } });
    // več paketov zapored (vsak izda nove naloge), vse odgovorjene pravilno
    const results = [];
    for (let k = 0; k < 6 && results.length < 120; k++) {
      const pack = await j(`/api/students/${s.id}/offline-pack`);
      for (const [topic_id, list] of Object.entries(pack.tasks)) for (const t of list) results.push({ topic_id, level: t.level, seed: t.seed, answer: rightAnswer(t.answer) });
    }
    assert.ok(results.length > 60, `izdanih nalog: ${results.length}`);
    const first = await j(`/api/students/${s.id}/offline-sync`, { method: "POST", body: { results } });
    assert.equal(first.synced, 60);
    assert.equal(first.skipped, results.length - 60);
    const again = await j(`/api/students/${s.id}/offline-sync`, { method: "POST", body: { results } });
    assert.equal(again.synced, 0, "dnevna meja velja tudi za naslednji klic");
    // XP ostane omejen: 60 nalog po največ 20 XP + bonusi teme
    assert.ok(again.xp.total <= 60 * 20 + 25 * 20 + 40, `XP: ${again.xp.total}`);
  } finally {
    server.close();
  }
});

test("P3: ime se zamenja samo kot cela beseda, ne glede na velike črke", () => {
  assert.equal(genericAnswer("Bravo, Nik. Nik-ov korak (Nik) in NIK", "Nik"), "Bravo, {{IME}}. {{IME}}-ov korak ({{IME}}) in {{IME}}");
  assert.equal(genericAnswer("Ana, x je tu. Ana!", "ana"), "{{IME}}, x je tu. {{IME}}!", "zastavica i");
  assert.equal(genericAnswer("Žan in Bravo, ŽAN", "Žan"), "{{IME}} in Bravo, {{IME}}", "zastavica u (šumniki)");
  assert.equal(genericAnswer("Lan2 in Lan", "Lan"), "Lan2 in {{IME}}");
  assert.equal(genericAnswer("A je točka", "A"), "A je točka", "enoznakovno ime ostane");
  assert.equal(genericAnswer("Dr. (x) in Dr. (x)", "Dr. (x)"), "{{IME}} in {{IME}}", "posebni znaki v imenu");
  assert.equal(genericAnswer("Bravo, Ana Marija in Marija!", "Ana Marija"), "Bravo, {{IME}} in {{IME}}!", "besede imena");
});

test("P3: sklonjeno ime (ali beseda, ki se z imenom začne) – odgovor se ne shrani za druge", () => {
  assert.equal(genericAnswer("Jakobu bom pomagal. Bravo, Jakob!", "Jakob"), null, "Jakob/Jakobu");
  assert.equal(genericAnswer("Bravo, Lan! Lanu predlagam vajo.", "Lan"), null, "Lan/Lanu");
  assert.equal(genericAnswer("Z Lanom bova vadila.", "Lan"), null, "Lan/Lanom");
  assert.equal(genericAnswer("Bravo, Ana! Ani bom pokazal.", "Ana"), null, "Ana/Ani");
  assert.equal(genericAnswer("Ano bom vprašal.", "Ana"), null, "Ana/Ano");
  assert.equal(genericAnswer("jakobu bom pomagal", "Jakob"), null, "male črke");
  assert.equal(genericAnswer("Nikoli ne deli z 0, Nik.", "Nik"), null, "beseda se začne z imenom");
  assert.equal(genericAnswer("Bravo, Ana! Analiza je dobra.", "Ana"), null, "beseda se začne z imenom");
  assert.equal(genericAnswer("Bravo, Lan! Plan je dober.", "Lan"), "Bravo, {{IME}}! Plan je dober.", "ime sredi besede ne ovira");
});

test("P3: odgovor iz predpomnilnika nima imena prejšnjega učenca, sklonjeno ime se ne shrani", async () => {
  const store = openDb(":memory:");
  let reply = "";
  const app = createApp(store, {
    scheduler: false,
    streamFn: async ({ onText }) => {
      const t = `${reply}\n<<META subject=MAT topic="množenje" error=0 mode=A flag=none>>`;
      onText(t);
      return { text: t, stopReason: "end_turn", usage: { input_tokens: 10, output_tokens: 10 }, model: "claude-haiku-4-5" };
    },
  });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const j = (p, o = {}) => fetch(base + p, { method: o.method || "GET", headers: { "Content-Type": "application/json" }, body: o.body ? JSON.stringify(o.body) : undefined });
  const ask = async (name, question) => {
    const s = await (await j("/api/students", { method: "POST", body: { name, settings: { level: "OS", grade: 8 } } })).json();
    const c = await (await j(`/api/students/${s.id}/conversations`, { method: "POST" })).json();
    const sse = await (await j(`/api/conversations/${c.id}/messages`, { method: "POST", body: { text: question } })).text();
    return JSON.parse(/event: done\ndata: (.*)/.exec(sse)[1]).text;
  };
  try {
    reply = "Bravo, Nik. Analiza pokaže, da je 8 · 7 = 56.";
    await ask("Nik", "koliko je 8 krat 7");
    const cached = store.db.prepare("SELECT text FROM answer_cache").get()?.text;
    assert.ok(cached, "odgovor je v predpomnilniku");
    assert.match(cached, /^Bravo, \{\{IME\}\}\. Analiza/);
    store.db.prepare("UPDATE answer_cache SET verified = 1").run();
    reply = "NE SME PRITI (odgovor mora priti iz predpomnilnika)";
    const second = await ask("Ana", "koliko je 8 krat 7");
    assert.match(second, /^Bravo, Ana\. Analiza/);
    assert.doesNotMatch(second, /Nik/);

    reply = "Jakobu bom pomagal: 9 · 6 = 54. Bravo, Jakob!";
    await ask("Jakob", "koliko je 9 krat 6");
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM answer_cache").get().n, 1, "sklonjeno ime: odgovor ni shranjen");
    assert.ok(!store.db.prepare("SELECT 1 FROM answer_cache WHERE text LIKE '%Jakob%'").get());
  } finally {
    server.close();
  }
});

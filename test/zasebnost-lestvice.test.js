// P2: vaje brez povezave ne dajo neomejenega XP (samo izdane naloge; XP največ za dnevni sklop, napredek za vse).
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

test("P2: brez povezave vse izdane naloge štejejo v napredek, XP največ za dnevni sklop; omejena izdaja paketov", async () => {
  const store = openDb(":memory:");
  const app = createApp(store, { scheduler: false });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const raw = (p, o = {}) => fetch(base + p, { method: o.method || "GET", headers: { "Content-Type": "application/json" }, body: o.body ? JSON.stringify(o.body) : undefined });
  const j = (p, o) => raw(p, o).then((r) => r.json());
  try {
    const s = await j("/api/students", { method: "POST", body: { name: "Ana", settings: { level: "OS", grade: 8 } } });
    // več paketov zapored (vsak izda nove naloge), vse odgovorjene pravilno
    const results = [];
    for (let k = 0; k < 6; k++) {
      const pack = await j(`/api/students/${s.id}/offline-pack`);
      for (const [topic_id, list] of Object.entries(pack.tasks)) for (const t of list) results.push({ topic_id, level: t.level, seed: t.seed, answer: rightAnswer(t.answer) });
    }
    const batch = results.slice(0, 120);
    assert.ok(batch.length > 60, `izdanih nalog: ${batch.length}`);
    const first = await j(`/api/students/${s.id}/offline-sync`, { method: "POST", body: { results: batch } });
    assert.equal(first.synced, batch.length, "vse naloge štejejo v napredek (nič se ne izgubi)");
    assert.equal(first.no_xp, batch.length - 10, "XP samo za prvih 10 (dnevni sklop)");
    assert.equal(store.db.prepare("SELECT COUNT(*) n FROM tasks WHERE student_id = ? AND solved = 1").get(s.id).n, batch.length);
    // XP: 10 nalog po največ 20 XP + bonusi za obvladane teme ob teh nalogah (lige ne dobijo več)
    assert.ok(first.xp.total <= 10 * 20 + 10 * 25 + 40, `XP: ${first.xp.total}`);
    const again = await j(`/api/students/${s.id}/offline-sync`, { method: "POST", body: { results: batch } });
    assert.equal(again.synced, 0, "ista naloga ne šteje dvakrat");
    // Izdaja paketov je omejena (8 na dan na profil).
    for (let k = 6; k < 8; k++) assert.equal((await raw(`/api/students/${s.id}/offline-pack`)).status, 200);
    assert.equal((await raw(`/api/students/${s.id}/offline-pack`)).status, 429);
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

test("GDPR: izbris profila prepiše kopijo mnenj v datoteki (brez ključa za šifriranje)", async () => {
  const fs = await import("node:fs");
  const os = await import("node:os");
  const path = await import("node:path");
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-fb-"));
  const file = path.join(dir, "mnenja.json");
  const store = openDb(":memory:");
  const app = createApp(store, { scheduler: false, feedbackFile: file });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const j = (p, o = {}) => fetch(base + p, { method: o.method || "GET", headers: { "Content-Type": "application/json" }, body: o.body ? JSON.stringify(o.body) : undefined });
  try {
    const s = await (await j("/api/students", { method: "POST", body: { name: "Lan", settings: { level: "OS", grade: 8 } } })).json();
    assert.equal((await j(`/api/students/${s.id}/feedback`, { method: "POST", body: { name: "Lan", ratings: { tutor: 4 }, ideas: "več iger z ulomki" } })).status < 300, true);
    assert.match(fs.readFileSync(file, "utf8"), /več iger z ulomki/);
    assert.equal((await j(`/api/students/${s.id}`, { method: "DELETE" })).status, 200);
    await new Promise((r) => setTimeout(r, 20));
    assert.doesNotMatch(fs.readFileSync(file, "utf8"), /več iger z ulomki/, "besedilo ne ostane v datoteki");
  } finally {
    server.close();
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("P7: javna lekcija /api/lesson nima učenčevih polj in se sme shraniti", async () => {
  const store = openDb(":memory:");
  const app = createApp(store, { scheduler: false });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const s = store.createStudent("Ana", { level: "OS", grade: 8 });
    const topic = new Progress(store).pathView(s.id, pathKeyFor(s.settings)).units.flatMap((u) => u.topics)[0].id;
    const res = await fetch(`${base}/api/lesson?id=${encodeURIComponent(topic)}`);
    assert.equal(res.status, 200);
    assert.equal(res.headers.get("cache-control"), "no-cache");
    const L = await res.json();
    assert.equal(L.id, topic);
    assert.equal(L.pretest_due, false);
    assert.equal(L.interactive, false);
    assert.ok(!("offers" in L));
    assert.equal((await fetch(`${base}/api/lesson?id=ni-teme`)).status, 404);
    assert.equal((await fetch(`${base}/api/students/${s.id}/lesson?id=${encodeURIComponent(topic)}`)).headers.get("cache-control"), "no-store");
  } finally {
    server.close();
  }
});

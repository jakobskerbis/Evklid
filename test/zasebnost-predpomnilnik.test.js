// Zasebnost: shranjen odgovor (answer_cache) za prvo vprašanje gre drugim učencem samo, če je nastal brez
// osebnih podatkov iz prompta, ki jih ključ ne pozna (zanimanja in lastno zanimanje iz kotička, urnik in testi,
// šibke točke, cilj). Inštruktor primere vzame iz zanimanj (prompts/system_prompt.md), zato bi drug otrok
// sicer dobil npr. ime konja ali datum testa prvega otroka.
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

const META = '\n<<META subject=MAT topic="ulomki" error=0 mode=A flag=none done=0>>';
const Q = "Kako seštejem dva ulomka z različnima imenovalcema?";

async function withServer(fn) {
  const store = openDb(":memory:");
  let calls = 0;
  // Model »uporabi« zanimanja iz prompta, kot mu naroča prompt.
  const streamFn = async ({ system, onText }) => {
    calls++;
    const sys = Array.isArray(system) ? system.map((b) => b.text || "").join("\n") : String(system || "");
    const interests = /Zanimanja učenca[^:]*: (.*)/.exec(sys)?.[1] || "";
    const text = `Primer s tem, kar te zanima (${interests}): 1/2 + 1/3 = 5/6.${META}`;
    onText(text);
    return { content: [{ type: "text", text }], text, stopReason: "end_turn", model: "claude-haiku-5-5", usage: { input_tokens: 100, output_tokens: 50 } };
  };
  const app = createApp(store, { streamFn });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (path, opts = {}) => {
    const res = await fetch(base + path, {
      method: opts.method || "GET",
      headers: { "Content-Type": "application/json" },
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    });
    const type = res.headers.get("content-type") || "";
    return { status: res.status, body: type.includes("json") ? await res.json() : await res.text() };
  };
  try {
    await fn({ call, calls: () => calls, store });
  } finally {
    server.close();
  }
}

const ask = async (call, settings, name, schedule = null) => {
  const s = (await call("/api/students", { method: "POST", body: { name, settings } })).body;
  if (schedule) schedule(s.id);
  const c = (await call(`/api/students/${s.id}/conversations`, { method: "POST" })).body;
  return (await call(`/api/conversations/${c.id}/messages`, { method: "POST", body: { text: Q } })).body;
};

test("odgovor z lastnim zanimanjem prvega otroka ne gre drugemu otroku", async () => {
  await withServer(async ({ call }) => {
    const a = await ask(call, { interest_custom: "konj Bliska" }, "Zala");
    assert.match(a, /konj Bliska/);
    const b = await ask(call, {}, "Bor");
    assert.doesNotMatch(b, /Bliska/, "drug otrok ne sme dobiti zanimanja prvega otroka");
  });
});

test("brez osebnih podatkov se odgovor še vedno ponovno uporabi (strošek)", async () => {
  await withServer(async ({ call, calls }) => {
    await ask(call, {}, "Ana");
    await ask(call, {}, "Bor");
    assert.equal(calls(), 1, "drugi učenec dobi shranjen odgovor");
  });
});

test("z zanimanji ali ciljem se odgovor ne shrani za druge in ne vzame shranjenega (tudi brez preverjanja)", async () => {
  await withServer(async ({ call, calls }) => {
    await ask(call, { interests: ["space"] }, "Ana");
    await ask(call, { interests: ["space"] }, "Bor");
    assert.equal(calls(), 2, "enaka zanimanja: vsak dobi svoj odgovor");
    const c = await ask(call, {}, "Cene");
    assert.equal(calls(), 3, "odgovor z zanimanji ni v predpomnilniku");
    assert.doesNotMatch(c, /vesolje/);
    await ask(call, { goal: "matura", goal_date: "2099-05-05" }, "Dora");
    assert.equal(calls(), 4, "s ciljem ne vzame shranjenega");
  });
});

test("učenec z urnikom ali testi: odgovor se ne shrani za druge in ne vzame shranjenega", async () => {
  await withServer(async ({ call, calls, store }) => {
    const withTest = (id) =>
      store.db.prepare("INSERT INTO schedules (student_id, data) VALUES (?, ?)").run(id, JSON.stringify({ lessons: [], events: [{ date: "2099-01-05", kind: "test", name: "Ulomki" }] }));
    await ask(call, {}, "Zala", withTest);
    await ask(call, {}, "Bor");
    assert.equal(calls(), 2, "odgovor učenca z urnikom ni šel v predpomnilnik");
    await ask(call, {}, "Cene", withTest);
    assert.equal(calls(), 3, "učenec z urnikom ne dobi shranjenega odgovora");
  });
});

test("stari shranjeni odgovori (pred popravkom ključa) se ob zagonu enkrat izbrišejo", async () => {
  const fs = await import("node:fs");
  const os = await import("node:os");
  const path = await import("node:path");
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-cache-"));
  const file = path.join(dir, "t.db");
  let store = openDb(file);
  store.db.prepare("DELETE FROM kv WHERE key = 'answer_cache_personal_purge'").run(); // baza pred popravkom
  store.db.prepare("INSERT INTO answer_cache (key, text, verified) VALUES ('k', 'konj Bliska', 1)").run();
  store.db.close();
  store = openDb(file);
  assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM answer_cache").get().n, 0);
  store.db.prepare("INSERT INTO answer_cache (key, text, verified) VALUES ('k2', 'nov', 1)").run();
  store.db.close();
  store = openDb(file);
  assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM answer_cache").get().n, 1, "samo enkrat");
  store.db.close();
  fs.rmSync(dir, { recursive: true, force: true });
});

test("krajši način B (17. 11.): shranjeni odgovori načina B dobijo nov ključ, ključi načina A ostanejo enaki", async () => {
  const { cacheKey } = await import("../server/app.js");
  const crypto = await import("node:crypto");
  const s = { subject: "MAT", track: "REGULAR", educational_track: "SREDNJA_SOLA", study_program: "", study_course: "", curriculum_level: "4. letnik VR", personality_setting: "nevtralna", language: "sl" };
  // Ključ kot pred spremembo (server/app.js cacheKey brez oznake »b2«).
  const star = (st, ...extra) => crypto.createHash("sha256").update([Q.toLowerCase().replace(/[\s.!?]+$/, ""), st.subject, st.track, st.educational_track, st.study_program, st.study_course, st.curriculum_level, st.solving_mode, st.personality_setting, 0, ...extra].join("|")).digest("hex");
  const a = { ...s, solving_mode: "A" };
  const b = { ...s, solving_mode: "B" };
  assert.equal(cacheKey(Q, a, "chat"), star(a), "način A: ključ kot doslej");
  assert.equal(cacheKey(Q, a, "think"), star(a, "think"), "način A (think): ključ kot doslej");
  assert.notEqual(cacheKey(Q, b, "chat"), star(b), "način B: star dolg odgovor se ne vrne");
  assert.notEqual(cacheKey(Q, b, "think"), star(b, "think"));
  // Prošnja za celo rešitev v načinu A: odgovor je v obliki načina B, zato nov ključ.
  for (const q of ["Daj mi celo rešitev: avto pospešuje iz mirovanja s 3 m/s² 5 s. Kolikšno pot prevozi?", "Prosim celotno rešitev naloge 2x + 3 = 11", "V načinu B reši 2x + 3 = 11"]) {
    const old = crypto.createHash("sha256").update([q.toLowerCase().replace(/\s+/g, " ").replace(/[\s.!?]+$/, "").trim(), a.subject, a.track, a.educational_track, a.study_program, a.study_course, a.curriculum_level, "A", a.personality_setting, 0].join("|")).digest("hex");
    assert.notEqual(cacheKey(q, a, "chat"), old, q);
  }
});

test("samo rezultat pri eni nalogi (17. 11., #799): prošnja samo za rezultat dobi nov ključ, ključi načina A ostanejo enaki", async () => {
  const { cacheKey } = await import("../server/app.js");
  const crypto = await import("node:crypto");
  const a = { subject: "FIZ", track: "REGULAR", educational_track: "OSNOVNA_SOLA", study_program: "", study_course: "", curriculum_level: "8. razred", solving_mode: "A", personality_setting: "nevtralna", language: "sl" };
  // Ključ kot pred spremembo (server/app.js cacheKey brez oznake »r1«).
  const old = (q, ...extra) => crypto.createHash("sha256").update([q.toLowerCase().replace(/\s+/g, " ").replace(/[\s.!?]+$/, "").trim(), a.subject, a.track, a.educational_track, a.study_program, a.study_course, a.curriculum_level, "A", a.personality_setting, 0, ...extra].join("|")).digest("hex");
  for (const q of ["Kolikšna je kinetična energija telesa z maso 2,0 kg pri 3,0 m/s? Samo končni rezultat, brez postopka.", "Samo rezultat prosim: 3x + 4 = 19", "Brez postopka: koliko je 15 % od 240?"]) {
    assert.notEqual(cacheKey(q, a, "chat"), old(q), q);
  }
  // Običajna vprašanja v načinu A ohranijo ključ.
  for (const q of [Q, "Kolikšna je kinetična energija telesa z maso 2,0 kg pri 3,0 m/s?", "Kako izračunam rezultat te enačbe?"]) {
    assert.equal(cacheKey(q, a, "chat"), old(q), q);
    assert.equal(cacheKey(q, a, "think"), old(q, "think"), q);
  }
});

test("Preizkus 3 (17. 11.): odgovori načina B in »samo rezultat« pred popravkom (»b2«, »r1«) se ne vrnejo, način A ostane", async () => {
  const { cacheKey } = await import("../server/app.js");
  const crypto = await import("node:crypto");
  const s = { subject: "MAT", track: "REGULAR", educational_track: "OSNOVNA_SOLA", study_program: "", study_course: "", curriculum_level: "8. razred", personality_setting: "nevtralna", language: "sl" };
  const norm = (q) => q.toLowerCase().replace(/\s+/g, " ").replace(/[\s.!?]+$/, "").trim();
  // Ključ, kot ga je računal #799 (z oznakama »b2« in »r1«).
  const prej = (q, st, ...extra) => crypto.createHash("sha256").update([norm(q), st.subject, st.track, st.educational_track, st.study_program, st.study_course, st.curriculum_level, st.solving_mode, st.personality_setting, 0, ...extra].join("|")).digest("hex");
  const b = { ...s, solving_mode: "B" };
  const a = { ...s, solving_mode: "A" };
  const razstavi = "Razstavi izraze: a) 4x² − 25 b) x² − 7x + 12 c) 3a²b − 12ab²";
  assert.notEqual(cacheKey(razstavi, b, "chat"), prej(razstavi, b, "b2"), "način B");
  const dva = "Samo končna rezultata, brez postopka: a) pH HCl s koncentracijo 0,0010 mol/L b) koncentracija 4,0 g NaOH v 250 mL";
  assert.notEqual(cacheKey(dva, a, "chat"), prej(dva, a, "r1"), "samo rezultat, način A");
  assert.notEqual(cacheKey(dva, b, "chat"), prej(dva, b, "b2", "r1"), "samo rezultat, način B");
  // »moram oddati« (pregled #811): nov ključ tudi v načinu A.
  const oddaja = "Moram oddati do jutri: izračunaj a) 3 + 4 · 2, b) 12 : 3 − 1, c) 5 · (2 + 3)";
  assert.notEqual(cacheKey(oddaja, a, "chat"), prej(oddaja, a), "moram oddati");
  // Običajno vprašanje v načinu A obdrži ključ.
  assert.equal(cacheKey(razstavi, a, "chat"), prej(razstavi, a));
});

test("#835 (18. 11.): odgovori načina B pred pravili brez posploševanja (»b3«) se ne vrnejo, način A ostane", async () => {
  const { cacheKey } = await import("../server/app.js");
  const crypto = await import("node:crypto");
  const s = { subject: "BIO", track: "REGULAR", educational_track: "GIMNAZIJA", study_program: "", study_course: "", curriculum_level: "2. letnik", personality_setting: "nevtralna", language: "sl" };
  const norm = (q) => q.toLowerCase().replace(/\s+/g, " ").replace(/[\s.!?]+$/, "").trim();
  const prej = (q, st, ...extra) => crypto.createHash("sha256").update([norm(q), st.subject, st.track, st.educational_track, st.study_program, st.study_course, st.curriculum_level, st.solving_mode, st.personality_setting, 0, ...extra].join("|")).digest("hex");
  const q = "Konj ima 64 kromosomov, osel 62. Koliko jih ima mula in zakaj je neplodna?";
  const b = { ...s, solving_mode: "B" };
  const a = { ...s, solving_mode: "A" };
  assert.notEqual(cacheKey(q, b, "chat"), prej(q, b, "b3"), "način B: stari ključ");
  assert.equal(cacheKey(q, b, "chat"), prej(q, b, "b4"), "način B: nov ključ");
  assert.equal(cacheKey(q, a, "chat"), prej(q, a), "način A obdrži ključ");
});

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

test("enaka zanimanja: odgovor se ponovno uporabi; drugačna: ne", async () => {
  await withServer(async ({ call, calls }) => {
    await ask(call, { interests: ["space"] }, "Ana");
    await ask(call, { interests: ["space"] }, "Bor");
    assert.equal(calls(), 1);
    const c = await ask(call, { interests: ["robots"] }, "Cene");
    assert.equal(calls(), 2);
    assert.doesNotMatch(c, /vesolje/);
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

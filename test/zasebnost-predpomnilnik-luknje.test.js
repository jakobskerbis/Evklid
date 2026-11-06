// Pregled #484 (B): poti, po katerih shranjen odgovor (answer_cache) še nese podatke drugega otroka.
// Model tu »uporabi« podatek iz prompta, kot ga lahko pravi model; drug otrok z istim prvim vprašanjem ga ne sme dobiti.
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

const META = '\n<<META subject=MAT topic="ulomki" error=0 mode=A flag=none done=0>>';
const Q = "Kako seštejem dva ulomka z različnima imenovalcema?";

async function withServer(reply, fn) {
  const store = openDb(":memory:");
  const streamFn = async ({ system, onText }) => {
    const sys = Array.isArray(system) ? system.map((b) => b.text || "").join("\n") : String(system || "");
    const text = reply(sys) + META;
    onText(text);
    return { content: [{ type: "text", text }], text, stopReason: "end_turn", model: "claude-haiku-5-5", usage: { input_tokens: 100, output_tokens: 50 } };
  };
  const app = createApp(store, { streamFn });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (path, opts = {}) => {
    const res = await fetch(base + path, { method: opts.method || "GET", headers: { "Content-Type": "application/json" }, body: opts.body ? JSON.stringify(opts.body) : undefined });
    const type = res.headers.get("content-type") || "";
    return { status: res.status, body: type.includes("json") ? await res.json() : await res.text() };
  };
  try {
    await fn({ call, store });
  } finally {
    server.close();
  }
}

const student = async (call, name, settings = {}) => (await call("/api/students", { method: "POST", body: { name, settings } })).body;
const ask = async (call, s) => {
  const c = (await call(`/api/students/${s.id}/conversations`, { method: "POST" })).body;
  return (await call(`/api/conversations/${c.id}/messages`, { method: "POST", body: { text: Q } })).body;
};

test("rezultati iz vadnice prvega otroka ne gredo drugemu otroku", async () => {
  // Model omeni rezultat iz vrstice »Rezultati učenca«.
  const reply = (sys) => `Super ti gre (${/Rezultati učenca: ([^;.]*)/.exec(sys)?.[1] || ""}). 1/2 + 1/3 = 5/6.`;
  await withServer(reply, async ({ call, store }) => {
    const a = await student(call, "Zala");
    const ins = store.db.prepare("INSERT INTO tasks (student_id, topic_id, level, payload, first_try_correct, solved) VALUES (?, 'x', 1, '{}', 1, 1)");
    for (let i = 0; i < 12; i++) ins.run(a.id);
    assert.match(await ask(call, a), /12 od 12/);
    const b = await student(call, "Bor");
    assert.doesNotMatch(await ask(call, b), /12 od 12/, "Bor ne sme dobiti Zaline rezultate");
  });
});

test("ime v drugi pisavi (ruščina) ne gre drugemu otroku", async () => {
  // Pri pogovoru v ruščini model latinično ime zapiše v cirilici.
  const reply = (sys) => (/Ime učenca: Zala/.test(sys) ? "Привет, Зала! 1/2 + 1/3 = 5/6." : "Привет! 1/2 + 1/3 = 5/6.");
  await withServer(reply, async ({ call }) => {
    assert.match(await ask(call, await student(call, "Zala", { language: "ru" })), /Зала/);
    assert.doesNotMatch(await ask(call, await student(call, "Bor", { language: "ru" })), /Зала/, "Bor ne sme dobiti Zalinega imena");
  });
});

test("ime brez strešice (Žiga → Ziga) ne gre drugemu otroku", async () => {
  const reply = (sys) => (/Ime učenca: Žiga/.test(sys) ? "Ziga, poglejva: 1/2 + 1/3 = 5/6." : "Poglejva: 1/2 + 1/3 = 5/6.");
  await withServer(reply, async ({ call }) => {
    assert.match(await ask(call, await student(call, "Žiga")), /Ziga/);
    assert.doesNotMatch(await ask(call, await student(call, "Bor")), /Ziga/, "Bor ne sme dobiti Žigovega imena");
  });
});

test("genericAnswer: ime brez strešic ali naglasov ni skupno, točno ime še vedno zamenja", async () => {
  const { genericAnswer } = await import("../server/reports.js");
  assert.equal(genericAnswer("Ziga, poglejva.", "Žiga"), null);
  assert.equal(genericAnswer("Zoe, poglejva.", "Zoë"), null);
  assert.equal(genericAnswer("Žiga, poglejva.", "Žiga"), "{{IME}}, poglejva.");
  assert.equal(genericAnswer("Poglejva skupaj.", "Žiga"), "Poglejva skupaj.");
});

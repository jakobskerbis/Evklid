import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { messageCode, parseMessageCode } from "../server/reports.js";

// Napaka, ki je koda ne ujame (račun ni zapisan v $…$); ujela bi jo AI pregleda.
const REPLY = 'Ana, 7 krat 8 je 54.\n<<META subject=MAT topic="poštevanka" error=0 mode=A flag=none done=0>>';

async function withServer(fn) {
  const store = openDb(":memory:");
  const streamFn = async ({ onText }) => {
    onText(REPLY);
    return { content: [{ type: "text", text: REPLY }], text: REPLY, stopReason: "end_turn" };
  };
  const server = createApp(store, { streamFn }).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (p, o = {}) => {
    const res = await fetch(base + p, { method: o.method || "GET", headers: { "Content-Type": "application/json" }, body: o.body ? JSON.stringify(o.body) : undefined });
    const type = res.headers.get("content-type") || "";
    return { status: res.status, body: type.includes("json") ? await res.json() : await res.text() };
  };
  try {
    await fn({ call, store });
  } finally {
    server.close();
  }
}

const doneOf = (sse) => JSON.parse(/event: done\ndata: (.*)/.exec(sse)[1]);

test("message code: short, reversible", () => {
  assert.equal(messageCode(1234), "#00YA");
  assert.equal(parseMessageCode("#00YA"), 1234);
  assert.equal(parseMessageCode("00ya"), 1234);
  assert.equal(parseMessageCode("#ab-c"), null);
});

test("report a wrong answer: stored, removed from the answer cache, once per message", async () => {
  await withServer(async ({ call, store }) => {
    const s = (await call("/api/students", { method: "POST", body: { name: "Ana" } })).body;
    const c = (await call(`/api/students/${s.id}/conversations`, { method: "POST" })).body;
    const done = doneOf((await call(`/api/conversations/${c.id}/messages`, { method: "POST", body: { text: "koliko je 7 krat 8" } })).body);
    assert.equal(done.code, messageCode(done.id), "koda pride z odgovorom");
    const cached = () => store.db.prepare("SELECT COUNT(*) AS n FROM answer_cache").get().n;
    assert.equal(cached(), 1, "odgovor je shranjen za ponovno uporabo");

    const conv = (await call(`/api/conversations/${c.id}`)).body;
    const userMsg = conv.messages.find((m) => m.role === "user");
    assert.equal(conv.messages.find((m) => m.role === "assistant").code, done.code);
    assert.equal(userMsg.code, undefined);

    const url = `/api/conversations/${c.id}/messages/${done.id}/report`;
    assert.equal((await call(url, { method: "POST", body: { reason: "nope" } })).status, 400);
    assert.equal((await call(`/api/conversations/${c.id}/messages/${userMsg.id}/report`, { method: "POST", body: { reason: "wrong" } })).status, 404, "samo odgovori inštruktorja");
    assert.equal((await call(`/api/conversations/${c.id}/messages/abc/report`, { method: "POST", body: { reason: "wrong" } })).status, 404);
    const r = await call(url, { method: "POST", body: { reason: "wrong", note: "7 · 8 = 56" } });
    assert.equal(r.status, 201);
    assert.equal(r.body.code, done.code);
    assert.equal(cached(), 0, "prijavljen odgovor ne gre več drugim učencem");
    const again = await call(url, { method: "POST", body: { reason: "other" } });
    assert.equal(again.body.already, true);

    const row = store.db.prepare("SELECT * FROM message_reports").get();
    assert.equal(row.reason, "wrong");
    assert.equal(row.note, "7 · 8 = 56");
    assert.equal(row.question, "koliko je 7 krat 8");
    assert.match(row.answer, /54/);
    assert.equal(row.purged, 1);
    assert.equal((await call(`/api/conversations/${c.id}`)).body.messages.find((m) => m.id === done.id).reported, true);
    // seznam prijav je viden na računalniku, kjer teče strežnik
    assert.equal((await call("/api/reports")).body.reports[0].code, done.code);
    // izbris pogovora: prijava ostane, vprašanje in opomba učenca pa ne
    await call(`/api/conversations/${c.id}`, { method: "DELETE" });
    const kept = store.db.prepare("SELECT * FROM message_reports").get();
    assert.equal(kept.question, null);
    assert.equal(kept.note, null);
    assert.match(kept.answer, /54/);
    // izbris profila izbriše tudi njegove prijave
    await call(`/api/students/${s.id}`, { method: "DELETE" });
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM message_reports").get().n, 0);
  });
});

test("EVKLID_CHAT_OFF=1 switches the tutor chat off for everyone", async () => {
  process.env.EVKLID_CHAT_OFF = "1";
  try {
    await withServer(async ({ call, store }) => {
      assert.equal((await call("/api/config")).body.chat_off, true);
      const s = (await call("/api/students", { method: "POST", body: { name: "Ana" } })).body;
      const c = (await call(`/api/students/${s.id}/conversations`, { method: "POST" })).body;
      const r = await call(`/api/conversations/${c.id}/messages`, { method: "POST", body: { text: "koliko je 7 krat 8" } });
      assert.equal(r.status, 503);
      assert.equal(r.body.chat_off, true);
      assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM messages").get().n, 0, "vprašanje se ne shrani");
    });
  } finally {
    delete process.env.EVKLID_CHAT_OFF;
  }
  await withServer(async ({ call }) => assert.equal((await call("/api/config")).body.chat_off, false));
});

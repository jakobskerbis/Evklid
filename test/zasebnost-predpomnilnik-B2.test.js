// Ponovni pregled #484 (B): ime, vpisano v nelatinični pisavi, pri pogovoru v latinici.
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

test("ime v cirilici pri pogovoru v slovenščini (model ga prečrka v latinico) ne gre drugemu otroku", async () => {
  const reply = (sys) => (/Ime učenca: Иван/.test(sys) ? "Ivan, poglejva: 1/2 + 1/3 = 5/6." : "Poglejva: 1/2 + 1/3 = 5/6.");
  await withServer(reply, async ({ call }) => {
    assert.match(await ask(call, await student(call, "Иван")), /Ivan/);
    assert.doesNotMatch(await ask(call, await student(call, "Bor")), /Ivan/, "Bor ne sme dobiti Ivanovega imena");
  });
});

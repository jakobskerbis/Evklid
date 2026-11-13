// Premična okna: ukaz inštruktorju »odpri kalkulator« odpre okno brez klica modela (server/chat-settings.js).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { SETTINGS_TOOLS, createSettingsTools, openWindowIntent, WINDOW_VIEWS } from "../server/chat-settings.js";
import { DEVICE_SETTINGS, deviceValue } from "../public/settings-registry.js";

test("open-window intent: short commands only, right view and calculator mode", () => {
  assert.deepEqual(openWindowIntent("Odpri kalkulator"), { view: "graph", text: "Odprl sem kalkulator." });
  assert.deepEqual(openWindowIntent("odpri učbenik, prosim"), { view: "textbook", text: "Odprl sem učbenik." });
  assert.deepEqual(openWindowIntent("Pokaži periodni sistem!"), { view: "graph", mode: "pse", text: "Odprl sem periodni sistem." });
  assert.deepEqual(openWindowIntent("pokaži mi periodni sistem elementov"), { view: "graph", mode: "pse", text: "Odprl sem periodni sistem." });
  assert.equal(openWindowIntent("odpri grafični kalkulator").mode, "graph");
  assert.equal(openWindowIntent("Open calculator").text, "I opened the calculator.");
  assert.deepEqual(openWindowIntent("please open the textbook"), { view: "textbook", text: "I opened the textbook." });
  assert.equal(openWindowIntent("show the periodic table").mode, "pse");
  // Vprašanja in daljša sporočila gredo k modelu.
  assert.equal(openWindowIntent("Kako odprem kalkulator?"), null);
  assert.equal(openWindowIntent("odpri kalkulator?"), null);
  assert.equal(openWindowIntent("Odpri oklepaje v izrazu 3(x+2)"), null);
  assert.equal(openWindowIntent("Izračunaj s kalkulatorjem 2+2"), null);
  assert.equal(openWindowIntent(""), null);
  assert.equal(openWindowIntent("odpri lekcijo o ulomkih"), null);
  assert.equal(openWindowIntent("kako odprem oklepaj"), null);
  assert.equal(openWindowIntent("pokaži formulo"), null);
  assert.equal(openWindowIntent("show the formula"), null);
  assert.equal(openWindowIntent("pokaži formule").mode, "formulas");
});

test("open_window tool: valid views only, sends the client event", async () => {
  assert.ok(SETTINGS_TOOLS.some((x) => x.name === "open_window"));
  const store = openDb(":memory:");
  const events = [];
  const t = createSettingsTools({ store, studentId: 1, conversationId: 1, pending: new Map(), send: (e, d) => events.push({ e, d }) });
  const ok = JSON.parse((await t.onToolUse("open_window", { view: "graph", calc_mode: "pse" })).content);
  assert.equal(ok.status, "opened");
  assert.deepEqual(events.at(-1), { e: "open_window", d: { view: "graph", mode: "pse" } });
  await t.onToolUse("open_window", { view: "textbook", calc_mode: "pse" });
  assert.deepEqual(events.at(-1).d, { view: "textbook" });
  const bad = await t.onToolUse("open_window", { view: "account" });
  assert.ok(bad.isError);
  // Vsak pogled, ki ga sme odpreti inštruktor, obstaja v aplikaciji.
  const html = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
  for (const v of WINDOW_VIEWS) assert.ok(html.includes(`id="view-${v}"`), v);
});

test("windows device setting is registered", () => {
  assert.deepEqual(DEVICE_SETTINGS.windows.values, ["on", "off"]);
  assert.equal(deviceValue("windows", "off"), "off");
  assert.equal(deviceValue("windows", "maybe"), null);
});

test("chat turn: »odpri kalkulator« opens the window without a model call", async () => {
  const store = openDb(":memory:");
  let calls = 0;
  const streamFn = async () => {
    calls++;
    throw new Error("model se ne sme poklicati");
  };
  const app = createApp(store, { streamFn });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const post = (p, body) => fetch(base + p, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const s = await (await post("/api/students", { name: "Eva", settings: { curriculum_level: "8. razred" } })).json();
    const c = await (await post(`/api/students/${s.id}/conversations`, {})).json();
    const sse = await (await post(`/api/conversations/${c.id}/messages`, { text: "Pokaži periodni sistem" })).text();
    const ev = sse.split("\n\n").filter(Boolean).map((x) => ({ event: /^event: (.*)$/m.exec(x)[1], data: JSON.parse(/^data: (.*)$/m.exec(x)[1]) }));
    assert.deepEqual(ev.find((e) => e.event === "open_window").data, { view: "graph", mode: "pse" });
    const done = ev.at(-1);
    assert.equal(done.event, "done");
    assert.equal(done.data.text, "Odprl sem periodni sistem.");
    assert.equal(done.data.settings, true);
    assert.equal(done.data.cost_usd, 0);
  } finally {
    server.close();
  }
  assert.equal(calls, 0);
});

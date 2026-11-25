// Brezplačni paket SŠ/faks: učenčev korak presodi Haiku z razmislekom (LIMITS.stepThink, j 19. 11.; meritev
// scripts/meri-prav-matura.mjs). Brez računov tu »chat« izsilimo z EVKLID_SS_THINK=0 (tako kot meritev --nacin chat).
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { modeParams } from "../server/claude.js";

const META = '\n<<META subject=MAT topic="enačbe" error=0 mode=A flag=none done=0>>';

async function pogovor(settings, sporocila, env = {}) {
  const prej = {};
  for (const [k, v] of Object.entries({ EVKLID_SS_THINK: "0", EVKLID_STEP_THINK: "1", ...env })) {
    prej[k] = process.env[k];
    process.env[k] = v;
  }
  const store = openDb(":memory:");
  const modes = [];
  const streamFn = async ({ mode, onText }) => {
    modes.push(mode);
    const text = "Kaj dobiš, ko odpraviš oklepaj?" + META;
    onText(text);
    return { content: [{ type: "text", text }], text, stopReason: "end_turn", model: modeParams(mode).model, usage: { input_tokens: 100, output_tokens: 20 } };
  };
  const reviewCreateFn = async (p) => ({ content: [{ type: "text", text: "OK" }], stop_reason: "end_turn", model: p.model, usage: { input_tokens: 10, output_tokens: 2 } });
  const server = createApp(store, { streamFn, reviewCreateFn }).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (p, body) => fetch(base + p, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then((r) => r.text());
  try {
    const s = JSON.parse(await post("/api/students", { name: "Ana", settings }));
    const c = JSON.parse(await post(`/api/students/${s.id}/conversations`, {}));
    for (const t of sporocila) await post(`/api/conversations/${c.id}/messages`, { text: t });
    return modes;
  } finally {
    server.close();
    for (const [k, v] of Object.entries(prej)) v === undefined ? delete process.env[k] : (process.env[k] = v);
  }
}

const SS = { educational_track: "SREDNJA_SOLA", curriculum_level: "4. letnik VR", subject: "MAT" };

test("brezplačni paket SŠ: učenčev korak gre k Haikuju z razmislekom, vprašanje in prvo sporočilo ne", async () => {
  const modes = await pogovor(SS, ["Reši enačbo 5 - 2(x - 3) = 3x + 1", "5 - 2x - 6 = 3x + 1", "Ne razumem, kako naprej?"]);
  assert.deepEqual(modes.slice(0, 1), ["chat"], "prvo sporočilo (naloga)");
  assert.equal(modes[1], "think", "korak učenca");
  assert.equal(modes.at(-1), "chat", "vprašanje ni trditev");
});

test("brezplačni paket: OŠ ostane pri navadnem Haikuju; EVKLID_STEP_THINK=0 izklopi", async () => {
  const os = await pogovor({ educational_track: "OSNOVNA_SOLA", curriculum_level: "8. razred", subject: "MAT" }, ["Reši 2x + 3 = 11", "2x = 8"]);
  assert.ok(os.every((m) => m === "chat"), os.join(","));
  const off = await pogovor(SS, ["Reši 2x + 3 = 11", "2x = 8"], { EVKLID_STEP_THINK: "0" });
  assert.ok(off.every((m) => m === "chat"), off.join(","));
});

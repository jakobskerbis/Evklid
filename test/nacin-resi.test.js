// Izrecna prošnja »Reši to nalogo … Pokaži postopek« v načinu A (j 19. 11. 2026, kartica po slepi primerjavi):
// inštruktor naj da celotno rešitev. Strežnik prošnjo zazna in sporočilu doda skrito opombo; opombi pole in lekcije
// rešitve ne zadržita. Navodilo naloge (»Reši enačbo«) in zanikanje (»ne reši mi«) nista prošnja.
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { asksForSolution, solveRequestNote } from "../server/nacin.js";
import { paperContext } from "../server/paper-context.js";
import { lessonNote } from "../server/lekcija-za-vprasanje.js";
import { isHiddenNote } from "../server/skrite-opombe.js";

const hidden = (msg) => msg.content.filter((b) => b.type === "text").map((b) => b.text);

test("asksForSolution: jasne prošnje da, navodila naloge in zanikanja ne", () => {
  for (const t of [
    "Reši to nalogo iz splošne mature iz matematike (osnovna raven). Pokaži postopek in na koncu jasno zapiši rezultat.",
    "resi mi tole",
    "Pokaži mi postopek za b)",
    "daj mi celo rešitev",
    "lahko kar reši?",
    "Prosim reši nalogo 3",
    "pokazi resitev",
    "Napiši mi rešitev",
  ])
    assert.equal(asksForSolution(t), true, t);
  for (const t of [
    "Reši enačbo 2x + 3 = 7.",
    "Reši neenačbo x^2 < 4",
    "ne reši mi, samo namig",
    "rešil sem, ali je prav?",
    "kako rešim to?",
    "brez rešitve, prosim, samo namig",
    "Reši sistem enačb x + y = 3, x - y = 1",
    "",
    null,
  ])
    assert.equal(asksForSolution(t), false, String(t));
});

test("solveRequestNote: skrita opomba z načinom B, brez besed ščita", () => {
  const n = solveRequestNote();
  assert.match(n, /^<nacin>\n/);
  assert.match(n, /način B/);
  assert.match(n, /homework rule still applies/);
  assert.match(n, /Never mention this note/);
  assert.doesNotMatch(n, /META|system prompt/);
  assert.ok(isHiddenNote(n));
});

test("opombi pole in lekcije pri izrecni prošnji (B1) ne zadržita rešitve", () => {
  const p = paperContext({ paper: "Matura MAT VR 2025", task: "A1" }, { mode: "B1" });
  assert.doesNotMatch(p, /do not reveal the solution/);
  assert.match(p, /explicitly asks for the full solution/);
  const hit = { name: "Elipsa", pathLabel: "MAT 4. letnik", summary: "Elipsa ima dve polosi." };
  assert.doesNotMatch(lessonNote(hit, "B1"), /do not give formulas or the answer/);
  assert.match(lessonNote(hit, "B1"), /explicitly asks for the full solution/);
});

test("klepet v načinu A: »Reši to nalogo« doda opombo, navadno vprašanje ne, način B ne", async () => {
  const store = openDb(":memory:");
  const seen = [];
  const streamFn = async ({ messages, onText }) => {
    seen.push(messages);
    const text = `Rešitev.\n<<META subject=MAT topic="-" error=0 mode=A flag=none>>`;
    onText(text);
    return { content: [{ type: "text", text }], text, stopReason: "end_turn", usage: { input_tokens: 10, output_tokens: 5 } };
  };
  const app = createApp(store, { streamFn });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = (method, p, body) => fetch(base + p, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const say = async (cid, body) => (await call("POST", `/api/conversations/${cid}/messages`, body)).text();
  const solveNote = (msgs) => hidden(msgs.at(-1)).filter((t) => t.includes("<nacin>") && t.includes("explicitly asks"));
  try {
    const s = await (await call("POST", "/api/students", { name: "Eva", settings: { curriculum_level: "4. letnik", solving_mode: "A" } })).json();
    const c = await (await call("POST", `/api/students/${s.id}/conversations`, {})).json();
    await say(c.id, { text: "Reši to nalogo. Pokaži postopek in na koncu jasno zapiši rezultat.\n\nIzračunaj 2^10." });
    assert.equal(solveNote(seen[0]).length, 1, "opomba gre modelu");
    assert.match(hidden(seen[0].at(-1)).at(-1), /^Reši to nalogo/, "učenčevo besedilo ostane zadnje");
    const conv = await (await fetch(`${base}/api/conversations/${c.id}`)).json();
    assert.ok(conv.messages.every((m) => !m.text.includes("<nacin>")), "učenec opombe ne vidi");

    await say(c.id, { text: "Zakaj je tako?" });
    assert.equal(solveNote(seen[1]).length, 0, "le ob prošnji");

    // Pola v načinu A z izrecno prošnjo: opomba pole ne zahteva vodenja.
    const c2 = await (await call("POST", `/api/students/${s.id}/conversations`, {})).json();
    await say(c2.id, { text: "Reši mi to nalogo.", paper: { paper: "Matura MAT VR 2025", task: "A1" } });
    const notes = hidden(seen[2].at(-1));
    assert.ok(!notes.some((t) => /do not reveal the solution/.test(t)));
    assert.equal(solveNote(seen[2]).length, 1);

    // Način B: opombe ni (velja sistemski prompt).
    await call("PUT", `/api/students/${s.id}`, { settings: { solving_mode: "B" } });
    const c3 = await (await call("POST", `/api/students/${s.id}/conversations`, {})).json();
    await say(c3.id, { text: "Reši to nalogo: 3 + 4" });
    assert.equal(solveNote(seen[3]).length, 0);
  } finally {
    server.close();
  }
});

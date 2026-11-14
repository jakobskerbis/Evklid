// Zamenjava načina Vodenje/Celotna rešitev v glavi Inštruktorja (j 14. 11. 2026): potrdilo »Način: Celotna rešitev«
// se je pokazalo, naslednji odgovor pa je bil še vedno v starem načinu (zgodovina z META mode=A in opomba pole
// »vodi z namigi«). Strežnik ob zamenjavi sporočilu doda skrito opombo, opombi pole in lekcije sledita načinu,
// izbira v glavi pa kaže nastavitev, ne načina zadnjega odgovora.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { modeSwitchNote } from "../server/nacin.js";
import { paperContext } from "../server/paper-context.js";
import { lessonNote } from "../server/lekcija-za-vprasanje.js";
import { isHiddenNote } from "../server/skrite-opombe.js";
import { transcript } from "../server/povzetek.js";

const hidden = (msg) => msg.content.filter((b) => b.type === "text").map((b) => b.text);

test("modeSwitchNote: le ob dejanski zamenjavi, z novim načinom", () => {
  assert.equal(modeSwitchNote(null, "B"), "");
  assert.equal(modeSwitchNote("A", "A"), "");
  assert.equal(modeSwitchNote("X", "B"), "");
  const n = modeSwitchNote("A", "B");
  assert.match(n, /^<nacin>\n/);
  assert.match(n, /način B \(celotna rešitev\)/);
  assert.match(n, /mode=B in META/);
  assert.match(n, /Never mention this note/);
  assert.match(modeSwitchNote("B", "A"), /follow the rules of način A/);
  // Skrita opomba: povzetek, sodba kode o prejšnji nalogi in preizkusni način (»system prompt« → ščit) je ne berejo kot učenčevo besedilo.
  assert.ok(isHiddenNote(n));
  assert.doesNotMatch(transcript([{ role: "user", content: [{ type: "text", text: n }, { type: "text", text: "Reši 2x = 4" }] }]), /nacin|switched/);
});

test("opombi pole in lekcije: pri načinu B ne zadržita rešitve", () => {
  const a = paperContext({ paper: "Matura MAT VR 2025", task: "A1" });
  assert.match(a, /do not reveal the solution/);
  const b = paperContext({ paper: "Matura MAT VR 2025", task: "A1" }, { mode: "B" });
  assert.doesNotMatch(b, /do not reveal the solution/);
  assert.match(b, /način B \(celotna rešitev\)/);
  const hit = { name: "Elipsa", pathLabel: "MAT 4. letnik", summary: "Elipsa ima dve polosi." };
  assert.match(lessonNote(hit), /do not give formulas or the answer/);
  assert.doesNotMatch(lessonNote(hit, "B"), /do not give formulas or the answer/);
  assert.match(lessonNote(hit, "B"), /način B/);
});

test("klepet: po zamenjavi načina gre naslednjemu sporočilu opomba z novim načinom, nato ne več", async () => {
  const store = openDb(":memory:");
  const seen = [];
  const streamFn = async ({ messages, system, onText }) => {
    seen.push({ messages, system: JSON.stringify(system) });
    const mode = /Način: B/.test(JSON.stringify(system)) ? "B" : "A";
    const text = `Kaj je polos?\n<<META subject=MAT topic="-" error=0 mode=${mode} flag=none>>`;
    onText(text);
    return { content: [{ type: "text", text }], text, stopReason: "end_turn", usage: { input_tokens: 10, output_tokens: 5 } };
  };
  const app = createApp(store, { streamFn });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = (method, p, body) => fetch(base + p, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const say = async (cid, body) => (await call("POST", `/api/conversations/${cid}/messages`, body)).text();
  try {
    const s = await (await call("POST", "/api/students", { name: "Eva", settings: { curriculum_level: "4. letnik", solving_mode: "A" } })).json();
    const c = await (await call("POST", `/api/students/${s.id}/conversations`, {})).json();
    await say(c.id, { text: "Rešujem preteklo polo: Matura MAT VR 2025, naloga A1.", paper: { paper: "Matura MAT VR 2025", task: "A1" } });
    assert.match(hidden(seen[0].messages.at(-1))[0], /do not reveal the solution/, "v načinu A pola vodi");
    await say(c.id, { text: "Še enkrat" });
    assert.ok(!hidden(seen[1].messages.at(-1)).some((t) => t.includes("<nacin>")), "brez zamenjave ni opombe");

    // Zamenjava v glavi (isti klic kot izbira v glavi Inštruktorja).
    const upd = await (await call("PUT", `/api/students/${s.id}`, { settings: { solving_mode: "B" } })).json();
    assert.equal(upd.settings.solving_mode, "B");
    await say(c.id, { text: "B" });
    const third = seen[2];
    assert.match(third.system, /Način: B/);
    const notes = hidden(third.messages.at(-1));
    assert.equal(notes.at(-1), "B", "učenčevo besedilo ostane zadnje");
    assert.ok(notes.some((t) => /^<nacin>[\s\S]*način A \(vodenje\) to način B \(celotna rešitev\)/.test(t)), "opomba o zamenjavi gre modelu");
    // Opomba je v zgodovini (stalen začetek za predpomnjenje), učenec je ne vidi.
    const conv = await (await fetch(`${base}/api/conversations/${c.id}`)).json();
    assert.ok(conv.messages.every((m) => !m.text.includes("<nacin>")));
    assert.equal(conv.state.mode, "B");

    await say(c.id, { text: "In naprej?" });
    const fourth = seen[3].messages;
    assert.ok(!hidden(fourth.at(-1)).some((t) => t.includes("<nacin>")), "le enkrat");
    assert.ok(hidden(fourth.at(-3)).some((t) => t.includes("<nacin>")), "ostane v zgodovini");

    // Nazaj na vodenje: spet ena opomba.
    await call("PUT", `/api/students/${s.id}`, { settings: { solving_mode: "A" } });
    await say(c.id, { text: "Raje me vodi" });
    assert.ok(hidden(seen[4].messages.at(-1)).some((t) => /from način B \(celotna rešitev\) to način A \(vodenje\)/.test(t)));

    // Star pogovor brez shranjenega načina: prej = način iz META zadnjega odgovora.
    store.db.prepare("UPDATE conversations SET solving_mode = NULL WHERE id = ?").run(c.id);
    await call("PUT", `/api/students/${s.id}`, { settings: { solving_mode: "B" } });
    await say(c.id, { text: "Reši" });
    assert.ok(hidden(seen[5].messages.at(-1)).some((t) => t.includes("<nacin>")));

    // Nov pogovor v načinu B: opombe ni (velja sistemski prompt), pola ne zahteva vodenja.
    const c2 = await (await call("POST", `/api/students/${s.id}/conversations`, {})).json();
    await say(c2.id, { text: "Rešujem preteklo polo: Matura MAT VR 2025, naloga A2.", paper: { paper: "Matura MAT VR 2025", task: "A2" } });
    const first = hidden(seen[6].messages.at(-1));
    assert.ok(!first.some((t) => t.includes("<nacin>")));
    assert.doesNotMatch(first[0], /do not reveal the solution/);
  } finally {
    server.close();
  }
});

test("glava Inštruktorja: izbira načina kaže nastavitev, ne načina zadnjega odgovora", () => {
  const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
  const fn = app.slice(app.indexOf("function renderState("), app.indexOf("async function wireStatePicks("));
  assert.match(fn, /const mode = s\.solving_mode/);
  assert.doesNotMatch(fn, /convState\?\.mode/);
});

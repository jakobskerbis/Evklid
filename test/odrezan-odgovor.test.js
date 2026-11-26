// Odrezan odgovor (P1-2, j 26. 11. 2026, server/odrezan-odgovor.js): ob stop_reason »max_tokens« en klic nadaljevanja
// brez razmisleka; besedilo, poraba in META iz obeh klicev skupaj. Spet odrezano, napaka ali brez prostora pod mejo AI:
// vidna opomba »nadaljuj«, nikoli drugi klic nadaljevanja. Model je lažen (streamFn), API se ne kliče.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { Usage } from "../server/usage.js";
import { costUsd } from "../server/claude.js";
import { CONTINUE_INSTRUCTION, continuationMessages, cutNote, continueCut } from "../server/odrezan-odgovor.js";
import { LIVE_UI_LANGUAGES } from "../public/i18n/languages.js";
import SL from "../public/i18n/sl.js";

const META = '\n<<META subject=MAT topic="enačbe" error=0 mode=A flag=none done=0>>';
const HAIKU = "claude-haiku-5-5";
const DEL_A = "Gostota pove, koliko mase je v enoti prostornine. Najprej zapišemo podatke:\n\n- masa ";
const DEL_B = "$m = 2$ kg,\n- prostornina $V = 1$ L.\n\nKoliko je gostota?" + META;
const use = (o) => ({ input_tokens: 1000, output_tokens: o, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 });

function events(body) {
  return body
    .split("\n\n")
    .filter(Boolean)
    .map((c) => ({ event: /^event: (.*)$/m.exec(c)?.[1], data: JSON.parse(/^data: (.*)$/m.exec(c)?.[1] || "null") }));
}

// Lažen model: odgovori po vrsti iz seznama; vsak odgovor { text, stop } se pretoči v dveh kosih.
function fake(odgovori, klici, { onCall = null } = {}) {
  return async (o) => {
    klici.push({ messages: o.messages, system: o.system, tools: o.tools, mode: o.mode, noThinking: !!o.noThinking, onToolUse: o.onToolUse, onRetract: o.onRetract });
    onCall?.(klici.length);
    const r = odgovori[Math.min(klici.length - 1, odgovori.length - 1)];
    const mid = Math.floor(r.text.length / 2);
    o.onText(r.text.slice(0, mid));
    o.onText(r.text.slice(mid));
    return { content: [{ type: "text", text: r.text }], text: r.text, stopReason: r.stop, usage: use(r.out ?? 50), model: HAIKU, toolCalls: 0, timing: { thinking: true, firstThinkMs: 0, firstTextMs: 1, totalMs: 2 } };
  };
}

async function pogovor(streamFn, sporocila, { usage = null, reviewCreateFn = null } = {}) {
  const store = openDb(":memory:");
  const u = usage ? usage(store) : null;
  const app = createApp(store, { streamFn, scheduler: false, ...(u ? { usage: u.usage } : {}), ...(reviewCreateFn ? { reviewCreateFn } : {}), log: { error() {}, warn() {}, info() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (p, body) => fetch(base + p, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body || {}) });
  try {
    const s = await (await post("/api/students", { name: "Eva", settings: { educational_track: "OSNOVNA_SOLA", curriculum_level: "8. razred", subject: "MAT" } })).json();
    u?.setPupil(s.id);
    const c = await (await post(`/api/students/${s.id}/conversations`)).json();
    const out = [];
    for (const text of sporocila) out.push(events(await (await post(`/api/conversations/${c.id}/messages`, { text })).text()));
    const msgs = store.listMessages(c.id);
    return { out, store, msgs, conv: c.id };
  } finally {
    server.close();
  }
}

const deltas = (ev) => ev.filter((e) => e.event === "delta").map((e) => e.data.text).join("");
const done = (ev) => ev.find((e) => e.event === "done")?.data;
const NOTE_SL = SL["chat.cutNote"];

test("pozivi nadaljevanja: delni odgovor brez končnih presledkov + skrito navodilo; brez besedila isti pozivi", () => {
  const m = [{ role: "user", content: "Kaj je gostota?" }];
  const c = continuationMessages(m, "Gostota je  \n");
  assert.equal(c.length, 3);
  assert.deepEqual(c[1], { role: "assistant", content: [{ type: "text", text: "Gostota je" }] });
  assert.deepEqual(c[2], { role: "user", content: [{ type: "text", text: CONTINUE_INSTRUCTION }] });
  assert.match(CONTINUE_INSTRUCTION, /cut off by the length limit.*META line/);
  assert.equal(continuationMessages(m, "  \n"), m, "ves izhod v razmisleku: isti pozivi");
});

test("opomba: v vseh živih jezikih vmesnika, zamrznjeni po verigi uiChain, slovensko besedilo z »nadaljuj«", () => {
  assert.equal(NOTE_SL, "Odgovor je bil predolg in je odrezan. Napiši »nadaljuj«, da ga dokončam.");
  assert.equal(cutNote("sl"), `\n\n*(${NOTE_SL})*`);
  for (const l of LIVE_UI_LANGUAGES.filter((x) => x !== "sl")) {
    const ui = JSON.parse(fs.readFileSync(new URL(`../public/i18n/ui/${l}.json`, import.meta.url), "utf8"));
    assert.ok(ui["chat.cutNote"] && ui["chat.cutNote"] !== NOTE_SL, l);
    assert.equal(cutNote(l), `\n\n*(${ui["chat.cutNote"]})*`, l);
  }
  const hr = JSON.parse(fs.readFileSync(new URL("../public/i18n/ui/hr.json", import.meta.url), "utf8"));
  assert.equal(cutNote("sr"), `\n\n*(${hr["chat.cutNote"]})*`, "sr → hr");
});

test("continueCut: end_turn in refusal brez klica; prekinitev nese porabo obeh klicev; napaka vrne prvi odgovor", async () => {
  const hold = { taken: 0, take(x) { this.taken += x; return true; }, settle(x) { this.taken -= x; } };
  let n = 0;
  const streamFn = async () => (n++, { text: "x", stopReason: "end_turn" });
  for (const stop of ["end_turn", "refusal", "tool_use"]) {
    const r = { text: "a", stopReason: stop };
    assert.equal(await continueCut(r, { streamFn, args: { messages: [] }, hold, reserveUsd: () => 1 }), r);
  }
  assert.equal(n, 0);
  const ac = new AbortController();
  const abortFn = async () => {
    ac.abort();
    throw Object.assign(new Error("aborted"), { usage: use(7) });
  };
  await assert.rejects(continueCut({ text: "a", stopReason: "max_tokens", usage: use(3000) }, { streamFn: abortFn, args: { messages: [], signal: ac.signal }, hold, reserveUsd: () => 1 }), (e) => e.usage.output_tokens === 3007);
  const lost = [];
  const failFn = async () => {
    throw Object.assign(new Error("529"), { usage: use(5) });
  };
  const first = { text: "a", stopReason: "max_tokens", usage: use(3000) };
  assert.equal(await continueCut(first, { streamFn: failFn, args: { messages: [] }, hold, reserveUsd: () => 1, onLost: (e) => lost.push(e.usage.output_tokens) }), first);
  assert.deepEqual(lost, [5]);
  assert.equal(hold.taken, 0, "rezerva nadaljevanja sproščena");
});

test("max_tokens → en klic nadaljevanja brez razmisleka; besedilo skupaj v toku, prikazu in zgodovini; META iz nadaljevanja; poraba obeh", async () => {
  const klici = [];
  const { out, msgs, store } = await pogovor(fake([{ text: DEL_A, stop: "max_tokens", out: 3000 }, { text: DEL_B, stop: "end_turn", out: 80 }], klici), ["Kaj je gostota?"]);
  assert.equal(klici.length, 2);
  assert.equal(klici[0].noThinking, false);
  assert.equal(klici[1].noThinking, true, "nadaljevanje brez razmisleka");
  assert.equal(klici[1].onToolUse, null, "nadaljevanje ne izvaja orodij");
  assert.equal(klici[1].onRetract, null, "in ne umika že prikazanega besedila");
  // Isti sistemski prompt in orodja (predpomnjen začetek), pozivi = prvi + delni odgovor + navodilo.
  assert.deepEqual(klici[1].system, klici[0].system);
  assert.deepEqual(klici[1].tools, klici[0].tools);
  assert.deepEqual(klici[1].messages.slice(0, -2), klici[0].messages);
  assert.equal(klici[1].messages.at(-2).content[0].text, DEL_A.trimEnd());
  assert.equal(klici[1].messages.at(-1).content[0].text, CONTINUE_INSTRUCTION);
  const ev = out[0];
  const d = done(ev);
  const shown = deltas(ev);
  assert.ok(shown.includes("Najprej zapišemo podatke") && shown.includes("prostornina $V = 1$ L"), shown);
  assert.ok(!shown.includes("<<META"), "META ostane skrita");
  assert.ok(!d.text.includes(NOTE_SL), "dokončan odgovor nima opombe");
  assert.match(d.text, /masa \$m = 2\$ kg/);
  assert.deepEqual(d.state, { subject: "MAT", mode: "A" }, "META iz nadaljevanja");
  const a = msgs.find((m) => m.role === "assistant");
  assert.match(a.display_text, /masa \$m = 2\$ kg/);
  assert.match(JSON.stringify(a.api_content), /masa \$m = 2\$ kg,\\n- prostornina/, "zgodovina za model: en odgovor");
  assert.equal(store.db.prepare("SELECT COUNT(*) n FROM answer_cache").get().n, 1, "dokončan odgovor (end_turn) gre v predpomnilnik kot prej");
  // Poraba: oba klica v enem zapisu »chat«, strošek iz seštevka.
  const rows = store.db.prepare("SELECT kind, output_tokens, cost_usd FROM usage WHERE model != 'koda' AND kind != 'povzetek'").all();
  const chat = rows.filter((r) => r.kind === "chat");
  assert.equal(chat.length, 1, JSON.stringify(rows));
  assert.equal(chat[0].output_tokens, 3080);
  const expect = costUsd(HAIKU, { ...use(3080), input_tokens: 2000 });
  assert.ok(Math.abs(chat[0].cost_usd - expect) < 1e-9, `${chat[0].cost_usd} ≠ ${expect}`);
});

test("nadaljevanje spet odrezano: opomba, brez drugega nadaljevanja, ne v predpomnilnik odgovorov", async () => {
  const klici = [];
  const { out, store, msgs } = await pogovor(fake([{ text: DEL_A, stop: "max_tokens" }, { text: "$m = 2$ kg, nato še ", stop: "max_tokens" }], klici), ["Kaj je gostota?"]);
  assert.equal(klici.length, 2, "nikoli zanka");
  const d = done(out[0]);
  assert.ok(d.text.trimEnd().endsWith(`*(${NOTE_SL})*`), d.text);
  assert.ok(deltas(out[0]).includes(NOTE_SL), "opomba tudi v toku");
  const a = msgs.find((m) => m.role === "assistant");
  assert.ok(a.display_text.includes(NOTE_SL) && JSON.stringify(a.api_content).includes(NOTE_SL), "opomba v prikazu in zgodovini za model");
  assert.equal(store.db.prepare("SELECT COUNT(*) n FROM answer_cache").get().n, 0);
});

test("dokončan odgovor (end_turn) brez dodatnega klica in brez opombe", async () => {
  const klici = [];
  const { out } = await pogovor(fake([{ text: DEL_A + DEL_B, stop: "end_turn" }], klici), ["Kaj je gostota?"]);
  assert.equal(klici.length, 1);
  assert.ok(!done(out[0]).text.includes(NOTE_SL));
});

test("brez prostora pod mejo AI za nadaljevanje: opomba, brez klica", async () => {
  const klici = [];
  let tesno = false;
  let pupil = null;
  const usage = (store) => {
    const u = new Usage(store.db);
    // Po prvem klicu je meja skoraj porabljena: prostora za odgovor ni več.
    u.configure({ capsOf: (id) => (id === pupil ? [{ key: `t:${id}`, usd: 10, spent: tesno ? 9.9999 : 0 }] : []) });
    return { usage: u, setPupil: (id) => (pupil = id) };
  };
  const { out } = await pogovor(fake([{ text: DEL_A, stop: "max_tokens" }, { text: DEL_B, stop: "end_turn" }], klici, { onCall: () => (tesno = true) }), ["Kaj je gostota?"], { usage });
  assert.equal(klici.length, 1, "nadaljevanje se ne pokliče");
  const d = done(out[0]);
  assert.ok(d.text.includes(NOTE_SL), d.text);
  assert.ok(d.text.includes("Najprej zapišemo podatke"), "delni odgovor ostane");
});

test("trditev učenca (zadržan tok do sodbe): nadaljevanje gre v zadržane dele, učenec dobi cel odgovor", async () => {
  const klici = [];
  const prvi = { text: "Gostota je masa na enoto prostornine. Kakšna je njena enota?" + META, stop: "end_turn" };
  const delni = { text: "Zapišimo enoto kot ulomek: najprej enota za maso, ", stop: "max_tokens" };
  const konec = { text: "nato enota za prostornino." + META, stop: "end_turn" };
  const reviewCreateFn = async (p) => ({ content: [{ type: "text", text: "OK" }], stop_reason: "end_turn", model: p.model, usage: { input_tokens: 10, output_tokens: 1 } });
  const { out } = await pogovor(fake([prvi, delni, konec], klici), ["Kaj je gostota?", "kilogram na kubični meter"], { reviewCreateFn });
  assert.equal(klici.length, 3);
  assert.equal(klici[2].noThinking, true);
  const ev = out[1];
  const shown = deltas(ev);
  assert.ok(shown.includes("najprej enota za maso, nato enota za prostornino."), shown);
  assert.ok(!ev.some((e) => e.event === "retract"));
  const d = done(ev);
  assert.ok(!d.text.includes(NOTE_SL));
  assert.deepEqual(d.state, { subject: "MAT", mode: "A" });
});

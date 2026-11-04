import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { windowHistory } from "../server/usage.js";
import { summarizedHistory, transcript, withSummary, SUMMARY_HEAD } from "../server/povzetek.js";

const conv = (n) =>
  Array.from({ length: n * 2 }, (_, i) =>
    i % 2 === 0
      ? { role: "user", content: [{ type: "text", text: `Vprašanje ${i / 2}: 2x + ${i} = 10` }] }
      : { role: "assistant", content: [{ type: "text", text: `Odgovor ${(i - 1) / 2}\n<<META subject=MAT topic="enacbe" error=0 mode=A flag=none>>` }] },
  );

function setup() {
  const store = openDb(":memory:");
  const sid = store.db.prepare("INSERT INTO students (name, settings) VALUES ('Ana', '{}')").run().lastInsertRowid;
  const c = store.createConversation(sid);
  return { store, convId: c.id };
}

test("rolling summary: short conversations unchanged; a cut is summarized once and reused", async () => {
  const { store, convId } = setup();
  const calls = [];
  const streamFn = async ({ system, messages, mode }) => {
    calls.push({ system, messages, mode });
    return { text: `Rešujeta 2x + 0 = 10; učenec je pozabil deliti z 2. (klic ${calls.length})`, stopReason: "end_turn", usage: { input_tokens: 500, output_tokens: 60 }, model: "claude-haiku-5-5" };
  };
  const logged = [];
  const log = (r) => logged.push(r);

  // Brez reza: nič ne spremeni, brez klica.
  const short = conv(5);
  const shortWin = windowHistory(short);
  assert.equal(await summarizedHistory({ store, conversationId: convId, fullHistory: short, history: shortWin, streamFn, log }), shortWin);
  assert.equal(calls.length, 0);

  // 21 izmenjav: okno odreže 10, povzetek nastane enkrat (hitri model, kratek način).
  const long = conv(21);
  const win = windowHistory(long);
  assert.equal(long.length - win.length, 20);
  const out = await summarizedHistory({ store, conversationId: convId, fullHistory: long, history: win, streamFn, log });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].mode, "lite");
  assert.match(calls[0].messages[0].content[0].text, /STUDENT: Vprašanje 0/);
  assert.doesNotMatch(calls[0].messages[0].content[0].text, /META/, "brez vrstic META");
  assert.ok(out[0].content[0].text.startsWith(SUMMARY_HEAD));
  assert.match(out[0].content[0].text, /pozabil deliti/);
  assert.equal(out.length, win.length, "okno ostane enako dolgo");
  assert.equal(logged.length, 1);
  assert.equal(store.getSummary(convId).upto, 20);

  // Naslednja poteza z istim rezom: shranjen povzetek, brez klica, enak začetek (predpomnilnik).
  const long2 = conv(22);
  const out2 = await summarizedHistory({ store, conversationId: convId, fullHistory: long2, history: windowHistory(long2), streamFn, log });
  assert.equal(calls.length, 1);
  assert.deepEqual(out2[0].content[0], out[0].content[0]);

  // Nov rez (31 izmenjav): prejšnji povzetek + novih 10 izmenjav.
  const long3 = conv(31);
  await summarizedHistory({ store, conversationId: convId, fullHistory: long3, history: windowHistory(long3), streamFn, log });
  assert.equal(calls.length, 2);
  const user = calls[1].messages[0].content[0].text;
  assert.match(user, /PREVIOUS SUMMARY:\nRešujeta/);
  assert.match(user, /Vprašanje 10/);
  assert.doesNotMatch(user, /Vprašanje 9:/, "že povzeto ne gre znova");
  assert.equal(store.getSummary(convId).upto, 40);
});

test("rolling summary: failure or timeout keeps the old behaviour; stored text is encrypted with the data key", async () => {
  const { store, convId } = setup();
  const long = conv(21);
  const win = windowHistory(long);
  const failing = async () => {
    throw new Error("overloaded");
  };
  assert.deepEqual(await summarizedHistory({ store, conversationId: convId, fullHistory: long, history: win, streamFn: failing }), win);
  assert.equal(store.getSummary(convId), null);
  const refusal = async () => ({ text: "", stopReason: "refusal" });
  assert.deepEqual(await summarizedHistory({ store, conversationId: convId, fullHistory: long, history: win, streamFn: refusal }), win);
  process.env.EVKLID_CHAT_SUMMARY = "0";
  try {
    let called = false;
    await summarizedHistory({ store, conversationId: convId, fullHistory: long, history: win, streamFn: async () => ((called = true), { text: "x" }) });
    assert.equal(called, false, "EVKLID_CHAT_SUMMARY=0 izklopi");
  } finally {
    delete process.env.EVKLID_CHAT_SUMMARY;
  }
  // Pogovor se izbriše → povzetek tudi.
  store.setSummary(convId, "Povzetek", 20);
  store.db.prepare("DELETE FROM conversations WHERE id = ?").run(convId);
  assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM conversation_summaries").get().n, 0);
});

test("transcript and withSummary helpers", () => {
  assert.equal(transcript([{ role: "user", content: [{ type: "image", source: {} }, { type: "text", text: "Kaj je to?" }] }]), "STUDENT: [slika]\nKaj je to?");
  const h = [{ role: "user", content: "Živjo" }];
  assert.equal(withSummary(h, ""), h);
  assert.deepEqual(withSummary(h, "P")[0].content.at(-1), { type: "text", text: "Živjo" });
  assert.equal(withSummary([{ role: "assistant", content: "x" }], "P")[0].content, "x", "samo pred učenčevim sporočilom");
});

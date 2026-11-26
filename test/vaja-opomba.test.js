// Pot Vadnica → »Vprašaj inštruktorja« (pregled pripravljenosti pilota 26. 11. 2026, poseg 2): inštruktor dobi preverjeni
// rezultat generatorja kot skrito opombo, prvi odgovor imenuje tipično napako, napaka se šteje enkrat, pomoč pred
// odgovorom pomeni »s pomočjo«.
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { modeParams } from "../server/claude.js";
import { codeHint } from "../server/hints.js";
import { vajaOpomba, diagnoza, rezultatNaloge } from "../server/vaja-opomba.js";
import { isHiddenNote } from "../server/skrite-opombe.js";
import { generateTask } from "../server/practice/index.js";

const META = '\n<<META subject=MAT topic="potence" error=1 mode=A flag=none done=0>>';
const TEMA = "MAT-SS-2/potencna-in-korenska-funkcija";
// »Koliko realnih rešitev ima enačba x⁶ = −64?« (vrz-potencna, raven 1): pravilno 0, tipična napaka 2.
const POTENCA = generateTask(TEMA, 1, 92, "sl", 12);

async function withServer(fn) {
  const store = openDb(":memory:");
  const seen = [];
  const streamFn = async ({ messages, mode, onText }) => {
    seen.push({ messages, mode });
    const text = `Odgovor ${seen.length}.${META}`;
    onText(text);
    return { content: [{ type: "text", text }], text, stopReason: "end_turn", model: modeParams(mode).model, usage: { input_tokens: 1000, output_tokens: 500 } };
  };
  const server = createApp(store, { streamFn }).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (path, opts = {}) => {
    const res = await fetch(base + path, { method: opts.method || "GET", headers: { "Content-Type": "application/json" }, body: opts.body ? JSON.stringify(opts.body) : undefined });
    const type = res.headers.get("content-type") || "";
    return { status: res.status, body: type.includes("json") ? await res.json() : await res.text() };
  };
  try {
    await fn({ call, seen, store });
  } finally {
    server.close();
  }
}
const doneOf = (sse) => JSON.parse(/^data: (.*)$/m.exec(sse.split("\n\n").findLast((c) => c.startsWith("event: done")))[1]);
const textOf = (content) => (Array.isArray(content) ? content : [{ text: content }]).map((b) => b.text || "").join("\n");

test("primer naloge: x⁶ = −64, pravilno 0, napaka 2 je v seznamu", () => {
  assert.match(POTENCA.text, /x\^\{6\} = -64/);
  assert.equal(POTENCA.answer.value, 0);
  assert.ok(POTENCA.answer.mistakes.some((m) => m.value === 2));
});

test("diagnoza: tipična napaka iz seznama generatorja, pravilen odgovor brez napake", () => {
  assert.deepEqual(diagnoza(POTENCA, "2"), { pravilno: false, napaka: "Pomisli, ali je soda potenca lahko negativna." });
  assert.deepEqual(diagnoza(POTENCA, "0"), { pravilno: true, napaka: null });
  assert.equal(diagnoza(POTENCA, "5").napaka, null, "neznana napaka: koda ne ugiba");
  assert.equal(diagnoza(POTENCA, null).pravilno, null);
  // Razlaga, ki izda rezultat, se ne uporabi.
  const izda = { text: "x", answer: { type: "number", value: 12, mistakes: [{ value: 7, why: "Pravilno je 12." }] } };
  assert.equal(diagnoza(izda, "7").napaka, null);
  // Izbira: razlaga izbrane napačne možnosti.
  const izbira = { text: "x", answer: { type: "choice", options: ["A", "B"], index: 0, why: [null, "B je pogost zdrs."] } };
  assert.equal(diagnoza(izbira, "1").napaka, "B je pogost zdrs.");
});

test("rezultat naloge v opombi: število z enoto in zaokrožitvijo, ulomek, izbira", () => {
  assert.equal(rezultatNaloge({ type: "number", value: 49.05, unit: "m/s", decimals: 1 }), "49,1 m/s (rounded to 1 decimal place)");
  assert.equal(rezultatNaloge({ type: "fraction", num: 11, den: 40 }), "11/40");
  assert.equal(rezultatNaloge({ type: "choice", options: ["a", "b"], index: 1 }), "the option »b«");
  assert.match(rezultatNaloge({ type: "number", value: Math.PI * 4, alsoAccept: [12.56], unit: "cm²", decimals: 2 }), /12,57 cm².*also accepted: 12,56 cm²/);
  assert.equal(rezultatNaloge(null), null);
});

test("opomba: skrita, z rezultatom, zgledom, oceno odgovora in pravili", () => {
  const n = vajaOpomba({ payload: POTENCA, last_answer: "2", solved: 0 });
  assert.ok(isHiddenNote(n), "skrita opomba (učenec je ne vidi)");
  assert.match(n, /is correct: 0\./);
  assert.match(n, /Eksponent je sod/, "rešen zgled");
  assert.match(n, /»2«, which is wrong\. It matches a typical mistake for this task \(likely cause; check it against the student.s steps\): Pomisli, ali je soda potenca lahko negativna\./);
  assert.match(n, /a correct step from a different method is correct/);
  assert.match(n, /If the answer is correct, confirm it and do not look for errors/);
  assert.match(n, /likely cause; check it against the student.s steps/);
  assert.match(n, /never state the final result or the full solution/);
  assert.match(n, /without giving that step.s correct value/);
  assert.equal(vajaOpomba({ payload: { text: "x" } }), null, "brez znanega rezultata ni opombe");
  // Vse vrste odgovorov iz generatorjev dajo opombo.
  for (const [tema, raven] of [["MAT-OS-7/sestevanje-in-odstevanje-ulomkov", 1], ["BIO-SS-3/imunski-sistem", 1], ["FIZ-OS-9/prosti-pad", 2]]) {
    assert.ok(vajaOpomba({ payload: generateTask(tema, raven, 3, "sl", 9) }), tema);
  }
});

test("prvi odgovor kode imenuje tipično napako in ne izda rezultata; brez napake ne ponavlja vprašanja po koraku", () => {
  const h = codeHint(POTENCA, { subject: "MAT", topicName: "Potenčna funkcija", lastAnswer: "2", work: "x^6 = -64\nx = ±2" });
  assert.match(h, /\*\*Kaj je šlo narobe:\*\* Pomisli, ali je soda potenca lahko negativna\./);
  assert.ok(!/\*\*Namig:\*\*/.test(h), "najmanjši namig: samo napaka");
  assert.ok(!/realnih rešitev.*\b0\b|rešitev je 0|Število rešitev/.test(h), "rezultat ni izdan");
  assert.match(h, /error=0/, "napako je štela že Vadnica");
  // Koraki brez prepoznane napake: prvi odgovor da model (z opombo), koda ne ugiba.
  assert.equal(codeHint(POTENCA, { subject: "MAT", topicName: "Potenčna funkcija", lastAnswer: "5", work: "x = 5" }), null);
  // Brez korakov in brez prepoznane napake: splošen namig kot prej.
  assert.match(codeHint(POTENCA, { subject: "MAT", topicName: "Potenčna funkcija", lastAnswer: "5" }), /\*\*Namig:\*\*/);
  // Angleška razlaga (mednarodna matura) ne gre v slovenski odgovor.
  const eng = { ...POTENCA, answer: { ...POTENCA.answer, mistakes: [{ value: 2, why: "Check the sign of the even power." }] } };
  assert.ok(!/Check the sign/.test(codeHint(eng, { subject: "MAT", topicName: "x", lastAnswer: "2" })));
});

test("pot Vadnica → inštruktor: opomba v prvem sporočilu, model jo vidi, napaka šteta enkrat", async () => {
  await withServer(async ({ call, seen, store }) => {
    const s = (await call("/api/students", { method: "POST", body: { name: "Nika", settings: { subject: "MAT", educational_track: "SREDNJA_SOLA", curriculum_level: "2" } } })).body;
    const taskId = store.db
      .prepare("INSERT INTO tasks (student_id, topic_id, level, payload, last_answer, attempts, hint_used) VALUES (?, ?, 1, ?, '2', 1, 1)")
      .run(s.id, TEMA, JSON.stringify(POTENCA)).lastInsertRowid;
    const h = (await call(`/api/students/${s.id}/tasks/${taskId}/help`, { method: "POST", body: { work: "x^6 = -64\nx = ±2\n2 rešitvi" } })).body;
    assert.match(h.text, /x = ±2/);
    const r1 = await call(`/api/conversations/${h.conversation.id}/messages`, { method: "POST", body: { text: h.text } });
    assert.equal(seen.length, 0, "prvi odgovor sestavi koda");
    assert.match(doneOf(r1.body).text, /Kaj je šlo narobe/);
    const prvo = store.listMessages(h.conversation.id).find((m) => m.role === "user");
    const opomba = prvo.api_content.find((b) => isHiddenNote(b.text));
    assert.ok(opomba, "opomba shranjena s prvim sporočilom");
    assert.match(opomba.text, /is correct: 0\./);
    assert.ok(!textOf(prvo.content ?? "").includes("preverjen_racun"), "učenec opombe ne vidi");
    await call(`/api/conversations/${h.conversation.id}/messages`, { method: "POST", body: { text: "Aha, soda potenca ni negativna, torej 0." } });
    assert.equal(seen.length, 1);
    assert.match(textOf(seen[0].messages[0].content), /is correct: 0\./, "model ima rezultat v drugem koraku");
    const napake = store.db.prepare("SELECT error FROM events WHERE conversation_id = ?").all(h.conversation.id);
    assert.ok(napake.length >= 1);
    assert.equal(napake[0].error, 0, "prvi odgovor kode ne šteje napake še enkrat");
  });
});

test("pomoč pred odgovorom (Razloži nalogo) označi nalogo kot rešeno s pomočjo; rešene ne spremeni", async () => {
  await withServer(async ({ call, store }) => {
    const s = (await call("/api/students", { method: "POST", body: { name: "Tim", settings: { subject: "MAT", educational_track: "SREDNJA_SOLA", curriculum_level: "2" } } })).body;
    const ins = (solved) => store.db.prepare("INSERT INTO tasks (student_id, topic_id, level, payload, solved) VALUES (?, ?, 1, ?, ?)").run(s.id, TEMA, JSON.stringify(POTENCA), solved).lastInsertRowid;
    const odprta = ins(0);
    const resena = ins(1);
    for (const id of [odprta, resena]) await call(`/api/students/${s.id}/tasks/${id}/help`, { method: "POST", body: { kind: "explain" } });
    const hu = (id) => store.db.prepare("SELECT hint_used FROM tasks WHERE id = ?").get(id).hint_used;
    assert.equal(hu(odprta), 1);
    assert.equal(hu(resena), 0);
  });
});

test("koraki brez prepoznane napake: prvi odgovor da model, ki ima opombo z rezultatom", async () => {
  await withServer(async ({ call, seen, store }) => {
    const s = (await call("/api/students", { method: "POST", body: { name: "Ana", settings: { subject: "MAT", educational_track: "SREDNJA_SOLA", curriculum_level: "2" } } })).body;
    const taskId = store.db
      .prepare("INSERT INTO tasks (student_id, topic_id, level, payload, last_answer, attempts, hint_used) VALUES (?, ?, 1, ?, '4', 1, 1)")
      .run(s.id, TEMA, JSON.stringify(POTENCA)).lastInsertRowid;
    const h = (await call(`/api/students/${s.id}/tasks/${taskId}/help`, { method: "POST", body: { work: "x^6 = -64\nx = ±2, ±2i\n4 rešitve" } })).body;
    await call(`/api/conversations/${h.conversation.id}/messages`, { method: "POST", body: { text: h.text } });
    assert.equal(seen.length, 1, "model, ne koda");
    assert.match(textOf(seen[0].messages.at(-1).content), /is correct: 0\./);
  });
});

import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { Kvizi, KVIZ, hostView, playerView } from "../server/kviz.js";

const OHM = "FIZ-OS-9/upor-in-ohmov-zakon"; // samo številski odgovori (z enoto)
const CHOICE = "NAR-OS-6/mikroskop-in-celica"; // samo izbira
const cls = { id: 1, name: "8.b" };
const right = (task) => (task.answer.type === "choice" ? task.answer.index : String(Number(task.answer.value.toFixed(task.answer.decimals ?? 4))).replace(".", ","));

test("live quiz: lobby, questions, speed points, reveal when all answered or time is up", () => {
  let now = 1_000_000;
  const k = new Kvizi(() => now);
  assert.equal(k.create(cls, { topicId: "X/y", n: 5, seconds: 20 }), null);
  const g = k.create(cls, { topicId: OHM, n: 5, seconds: 20, seed: 9 });
  assert.equal(g.tasks.length, 5);
  assert.equal(k.create(cls, { topicId: OHM, n: 7, seconds: 7, seed: 9 }).seconds, 30, "neznana izbira → privzeto");
  const g2 = k.create(cls, { topicId: OHM, n: 5, seconds: 20, seed: 9 });
  assert.equal(k.forClass(1), g2, "nov kviz zamenja starega");
  k.join(g2, 10, "Ana");
  k.join(g2, 11, "Bor");
  k.join(g2, 10, "Ana");
  assert.equal(g2.players.size, 2);
  assert.deepEqual(hostView(g2, now).nicks, ["Ana", "Bor"]);

  // Dvojni klik učitelja ne preskoči vprašanja.
  k.next(g2, { state: "lobby", q: -1 });
  k.next(g2, { state: "lobby", q: -1 });
  assert.equal(g2.state, "question");
  assert.equal(g2.q, 0);
  const hv = hostView(g2, now);
  assert.equal(hv.question.answerHtml, undefined, "projektor med vprašanjem ne kaže rešitve");
  assert.equal(playerView(g2, 10, now).question.answerHtml, undefined);
  assert.ok(!JSON.stringify(playerView(g2, 10, now)).includes('"value"'));

  // Prazno in brez števila: vpiše znova, ni napaka. Enoto doda vnosno polje.
  assert.equal(k.answer(g2, 10, 0, "").retry, true);
  assert.equal(k.answer(g2, 10, 0, "abc").retry, true);
  now += 5000; // četrtina časa porabljena
  assert.deepEqual(k.answer(g2, 10, 0, right(g2.tasks[0])), { ok: true });
  assert.equal(g2.players.get(10).score, KVIZ.base + Math.round(KVIZ.bonus * 0.75));
  assert.equal(k.answer(g2, 10, 0, right(g2.tasks[0])).code, "kv.sent");
  assert.equal(g2.state, "question");
  k.answer(g2, 11, 0, "999999");
  assert.equal(g2.state, "reveal", "vsi so odgovorili");
  const rv = hostView(g2, now);
  assert.deepEqual([rv.counts.right, rv.counts.wrong, rv.counts.none], [1, 1, 0]);
  assert.ok(rv.question.answerHtml.includes("V") || rv.question.answerHtml.includes("A") || rv.question.answerHtml.includes("Ω"));
  assert.deepEqual(rv.board.map((b) => [b.nick, b.rank]), [["Ana", 1], ["Bor", 2]]);
  const pv = playerView(g2, 11, now);
  assert.equal(pv.result.ok, false);
  assert.equal(pv.rank, 2);

  // Čas poteče: vprašanje se zapre samo, odgovor po koncu ne šteje.
  k.next(g2, { state: "reveal", q: 0 });
  now += 21_000 + KVIZ.graceMs;
  assert.equal(k.answer(g2, 10, 1, right(g2.tasks[1])).status, 409);
  assert.equal(g2.state, "reveal");
  assert.equal(playerView(g2, 10, now).result.none, true);
  for (let i = 0; i < 20 && g2.state !== "end"; i++) k.next(g2, null);
  assert.equal(g2.q, 4);
  assert.equal(g2.state, "end");
  assert.equal(hostView(g2, now).board.length, 2);
  assert.equal(k.join(g2, 12, "Cvet").code, "kv.over");

  // Po 30 minutah brez dejavnosti kviza ni več.
  now += KVIZ.idleMs + 1;
  assert.equal(k.forClass(1), null);
});

test("live quiz: late answer within grace counts, score and rank do not leak before reveal", () => {
  let now = 50_000;
  const k = new Kvizi(() => now);
  const g = k.create(cls, { topicId: OHM, n: 5, seconds: 20, seed: 4 });
  k.join(g, 1, "Ana");
  k.join(g, 2, "Bor");
  k.next(g);
  assert.deepEqual(k.answer(g, 1, 0, right(g.tasks[0])), { ok: true });
  const pv = playerView(g, 1, now);
  assert.deepEqual([pv.score, pv.correct, pv.rank], [0, 0, 1], "med vprašanjem točke brez tega odgovora");
  now += 20_000 + KVIZ.graceMs / 2; // čas je potekel, oddaja je še na poti
  assert.equal(g.state, "question");
  assert.deepEqual(k.answer(g, 2, 0, right(g.tasks[0])), { ok: true });
  assert.equal(g.players.get(2).score, KVIZ.base, "brez bonusa za hitrost");
  assert.equal(g.state, "reveal");
  assert.equal(playerView(g, 1, now).score, g.players.get(1).score);
});

test("live quiz: multiple choice counts per option", () => {
  const now = 5_000;
  const k = new Kvizi(() => now);
  const g = k.create(cls, { topicId: CHOICE, n: 5, seconds: 30, seed: 3 });
  k.join(g, 1, "A");
  k.join(g, 2, "B");
  k.next(g);
  const t = g.tasks[0];
  assert.equal(t.answer.type, "choice");
  assert.equal(playerView(g, 1, now).question.options.length, t.answer.options.length);
  k.answer(g, 1, 0, t.answer.index);
  k.answer(g, 2, 0, (t.answer.index + 1) % t.answer.options.length);
  const v = hostView(g, now);
  assert.equal(v.question.index, t.answer.index);
  assert.equal(v.counts.options[t.answer.index], 1);
  assert.equal(v.counts.options.reduce((a, b) => a + b, 0), 2);
});

test("HTTP: teacher worksheet and live quiz for class members only", async () => {
  const store = openDb(":memory:");
  const app = createApp(store);
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const req = (p, { method = "GET", body, key } = {}) =>
    fetch(base + p, { method, headers: { "Content-Type": "application/json", ...(key ? { "X-Teacher-Key": key } : {}) }, body: body && JSON.stringify(body) });
  try {
    const c = await (await req("/api/classes", { method: "POST", body: { name: "8.b" } })).json();
    const T = `/api/teacher/classes/${c.code}`;
    // Delovni list za razred: brez ključa ne, z ključem z rešitvami ali brez.
    assert.equal((await req(`${T}/delovni-list?topic=${OHM}`)).status, 403);
    let r = await req(`${T}/delovni-list?topic=${OHM}&n=5&seme=4`, { key: c.teacherKey });
    assert.equal(r.status, 200);
    let html = await r.text();
    assert.match(html, /5 nalog/);
    assert.match(html, /<h2>Rešitve<\/h2>/);
    html = await (await req(`${T}/delovni-list?topic=${OHM}&n=5&seme=4&resitve=0`, { key: c.teacherKey })).text();
    assert.doesNotMatch(html, /<h2>Rešitve<\/h2>/);
    assert.equal((await req(`${T}/delovni-list?topic=X/y`, { key: c.teacherKey })).status, 404);

    // Kviz: učitelj ga začne, učenec razreda ga vidi v Ligah in se pridruži; tujec ne.
    assert.equal((await req(`${T}/kviz`, { method: "POST", body: { topicId: OHM } })).status, 403);
    assert.equal((await (await req(`${T}/kviz`, { key: c.teacherKey })).json()).state, null);
    r = await req(`${T}/kviz`, { method: "POST", key: c.teacherKey, body: { topicId: OHM, n: 5, seconds: 30 } });
    assert.equal(r.status, 201);
    const g = await r.json();
    assert.equal(g.state, "lobby");
    const ana = store.createStudent("Ana");
    const tujec = store.createStudent("Tujec");
    assert.equal((await req(`/api/students/${ana.id}/classes`, { method: "POST", body: { code: c.code } })).status < 300, true);
    let list = await (await req(`/api/students/${ana.id}/kviz`)).json();
    assert.deepEqual(list.games.map((x) => [x.id, x.className, x.joined]), [[g.id, "8.b", false]]);
    assert.deepEqual((await (await req(`/api/students/${tujec.id}/kviz`)).json()).games, []);
    assert.equal((await req(`/api/students/${tujec.id}/kviz/${g.id}/join`, { method: "POST" })).status, 404);
    const P = `/api/students/${ana.id}/kviz/${g.id}`;
    let pv = await (await req(`${P}/join`, { method: "POST" })).json();
    assert.equal(pv.joined, true);
    assert.equal(pv.state, "lobby");
    let hv = await (await req(`${T}/kviz/naprej`, { method: "POST", key: c.teacherKey, body: { state: "lobby", q: -1 } })).json();
    assert.equal(hv.state, "question");
    assert.equal(hv.players, 1);
    r = await req(`${P}/odgovor`, { method: "POST", body: { q: 0, input: "" } });
    assert.equal(r.status, 422);
    assert.equal((await r.json()).code, "chk.empty");
    pv = await (await req(`${P}/odgovor`, { method: "POST", body: { q: 0, input: "1" } })).json();
    assert.equal(pv.answered, true);
    assert.equal(pv.state, "reveal", "edini učenec je odgovoril");
    hv = await (await req(`${T}/kviz`, { key: c.teacherKey })).json();
    assert.equal(hv.counts.right + hv.counts.wrong, 1);
    assert.ok(hv.question.answerHtml);
    assert.equal((await req(`${T}/kviz`, { method: "DELETE", key: c.teacherKey })).status, 200);
    assert.equal((await req(P)).status, 404);
  } finally {
    server.close();
  }
});

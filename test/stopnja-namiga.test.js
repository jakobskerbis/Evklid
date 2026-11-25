// P1-6: strežnik šteje zatike pri trenutni nalogi (server/stopnja-namiga.js) in pove stopničko lestvice pomoči.
import test from "node:test";
import assert from "node:assert/strict";
import { stopnjaNamiga, prosiZaPomoc, STOPNICKE } from "../server/stopnja-namiga.js";

const meta = ({ error = 0, mode = "A", topic = "linearne enačbe", done = 0, flag = "none" } = {}) => `<<META subject=MAT topic="${topic}" error=${error} mode=${mode} flag=${flag} done=${done}>>`;
const u = (text) => ({ role: "user", text });
const a = (m) => ({ role: "assistant", text: `Poglejva.\n${meta(m)}` });

test("brez zatika ni opombe (brez dodatnih žetonov)", () => {
  assert.equal(stopnjaNamiga([]), null);
  assert.equal(stopnjaNamiga([u("Reši 2x + 3 = 7"), a()]), null);
  assert.equal(stopnjaNamiga([u("2x = 4"), a({ error: 0 })], { besedilo: "x = 2" }), null);
});

test("šteje zaporedne zatike: napačen korak ali prošnja za pomoč", () => {
  const conv = [u("Reši 2x + 3 = 7"), a(), u("2x = 10"), a({ error: 1 }), u("ne vem"), a({ error: 0 })];
  const r = stopnjaNamiga(conv);
  assert.equal(r.zatikov, 2);
  assert.equal(r.stopnicka, 3);
  assert.match(r.opomba, /zataknil že 2-krat/);
  assert.match(r.opomba, /3\. stopnička/);
  assert.match(r.opomba, /ne izdaj končnega rezultata/);
  // trenutna prošnja za pomoč
  const z = stopnjaNamiga(conv, { besedilo: "Daj mi namig" });
  assert.match(z.opomba, /zdaj prosi za pomoč/);
  const prvi = stopnjaNamiga([u("Reši 2x + 3 = 7"), a()], { besedilo: "pomagaj" });
  assert.deepEqual([prvi.zatikov, prvi.stopnicka], [0, 1]);
});

test("stopnička ne preseže zadnje (4)", () => {
  const conv = [u("naloga"), a()];
  for (let i = 0; i < 7; i++) conv.push(u("x = 9"), a({ error: 1 }));
  const r = stopnjaNamiga(conv);
  assert.equal(r.zatikov, 7);
  assert.equal(r.stopnicka, STOPNICKE.length);
});

test("štetje se ustavi pri pravilnem koraku, done=1, načinu B, oznaki, drugi temi in brez META", () => {
  const za = [u("x = 9"), a({ error: 1 })];
  assert.equal(stopnjaNamiga([u("x"), a({ error: 1 }), u("2x = 4"), a({ error: 0 }), ...za]).zatikov, 1, "pravilen korak");
  assert.equal(stopnjaNamiga([u("x"), a({ error: 1 }), u("povzetek"), a({ done: 1 }), ...za]).zatikov, 1, "done");
  assert.equal(stopnjaNamiga([u("x"), a({ error: 1 }), u("reši"), a({ mode: "B" }), ...za]).zatikov, 1, "način B");
  assert.equal(stopnjaNamiga([u("x"), a({ error: 1, topic: "ulomki" }), ...za]).zatikov, 1, "druga tema");
  assert.equal(stopnjaNamiga([u("x"), { role: "assistant", text: "brez meta" }, ...za]).zatikov, 1, "brez META");
  assert.equal(stopnjaNamiga([u("x"), a({ error: 1, flag: "offtopic" }), ...za]).zatikov, 1, "oznaka");
  assert.equal(stopnjaNamiga([u("x"), a({ mode: "B", error: 1 })]), null);
});

test("vsebina API in že prebrana META", () => {
  const api = [{ role: "user", content: [{ type: "text", text: "ne razumem" }] }, { role: "assistant", content: [{ type: "text", text: `Hm.\n${meta()}` }] }];
  assert.equal(stopnjaNamiga(api).zatikov, 1);
  assert.equal(stopnjaNamiga([u("x = 1"), { role: "assistant", meta: { error: 1, mode: "A", flag: "none", done: 0, topic: null } }]).zatikov, 1);
});

test("prošnja za pomoč: kratka sporočila, šumniki, ne del daljšega poskusa", () => {
  for (const s of ["ne vem", "nevem", "Ne vem.", "namig prosim", "pomagaj", "Potrebujem pomoč", "ne razumem tega", "kako naprej?", "zataknil sem se", "hint"]) assert.ok(prosiZaPomoc(s), s);
  for (const s of ["x = 3", "pomočnik je rekel 5", "ne vem, če je prav: x = 3", "ne vem, če je prav, ampak najprej odštejem tri na obeh straneh in delim z dve, tako dobim rešitev"]) assert.ok(!prosiZaPomoc(s), s);
});

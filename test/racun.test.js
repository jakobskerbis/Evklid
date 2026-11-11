// Preverjanje s pravim računalniškim algebrskim sistemom (server/cas.js, server/cas/worker.py) in skrit
// »račun za kodo« (server/racun.js). Brez SymPy (npr. Python ni nameščen) se testi SymPy preskočijo.
import test, { after } from "node:test";
import assert from "node:assert/strict";
import { casCheck, casAvailable, casStop } from "../server/cas.js";
import { parseClaims, checkAnswerClaims, chemBalanced, molarOk, STATS_KV } from "../server/racun.js";
import { stripMeta, createStreamFilter } from "../server/meta.js";
import { stripRacunBlocks } from "../server/textbook.js";
import { verifyAiFull } from "../server/scan.js";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { modeParams } from "../server/claude.js";

const HAVE = await casAvailable();
const cas = HAVE ? test : test.skip;
after(() => casStop());

const META = '\n<<META subject=MAT topic="enačbe" error=0 mode=B flag=none done=0>>';

test("blok RACUN: učenec ga ne vidi (končno besedilo in pretakanje)", () => {
  const t = "Rešitvi sta $2$ in $3$.\n<<RACUN\nresi: x^2-5*x+6=0 | x | 2, 3\nkemija: 2 H2 + O2 -> 2 H2O\n>>" + META;
  assert.equal(stripMeta(t), "Rešitvi sta $2$ in $3$.");
  const f = createStreamFilter();
  let shown = "";
  for (let i = 0; i < t.length; i += 7) shown += f.push(t.slice(i, i + 7));
  shown += f.end().rest;
  assert.equal(shown.trim(), "Rešitvi sta $2$ in $3$.");
  assert.doesNotMatch(shown, /RACUN|resi:/);
  // nedokončan blok (odrezan odgovor)
  assert.equal(stripMeta("Rezultat je $4$.\n<<RACUN\nresi: 2*x=8 | x"), "Rezultat je $4$.");
  // lekcija
  assert.equal(stripRacunBlocks("A\n<<RACUN\nvrednost: 1+1 | 2\n>>\nB"), "A\nB");
});

test("razčlenitev trditev: slovenske in angleške ključne besede, največ 16", () => {
  const c = parseClaims("x\n<<RACUN\n- resi: x+1=2 | x | 1\nodvod: x^2 | x | 2*x\nmolska masa: H2O | 18\nneznano: 1\nsolve: y=1 | y | 1\n>>");
  assert.deepEqual(c.map((x) => x.op), ["solve", "diff", "molar", "solve"]);
  assert.deepEqual(c[0].args, ["x+1=2", "x", "1"]);
  const many = parseClaims(`<<RACUN\n${Array.from({ length: 30 }, (_, i) => `vrednost: ${i} | ${i}`).join("\n")}\n>>`);
  assert.equal(many.length, 16);
});

test("kemija: urejenost enačbe (atomi in naboj) in molska masa, brez Pythona", () => {
  assert.equal(chemBalanced("2 H2 + O2 -> 2 H2O").ok, true);
  assert.equal(chemBalanced("CH4 + 2O2 → CO2 + 2H2O").ok, true);
  assert.equal(chemBalanced("Cu + 2Ag+ -> Cu2+ + 2Ag").ok, true);
  assert.equal(chemBalanced("Fe^3+ + e- -> Fe^2+").ok, true);
  assert.equal(chemBalanced("H2 + O2 -> H2O").ok, false);
  assert.equal(chemBalanced("Cu + Ag+ -> Cu2+ + Ag").ok, false, "naboj ni urejen");
  assert.equal(chemBalanced("brez puščice").ok, null);
  assert.equal(molarOk("H2SO4", "98.08").ok, true);
  assert.equal(molarOk("NaCl", "58.5").ok, true, "šolska tabela (Cl 35,5)");
  assert.equal(molarOk("NaCl", "60").ok, false);
  assert.equal(molarOk("CuSO4·5H2O", "249.7").ok, true);
});

cas("SymPy: enačbe, sistemi, periodične rešitve, neenačbe", async () => {
  assert.equal((await casCheck("solve", ["x^2-5*x+6=0", "x", "2, 3"])).ok, true);
  const miss = await casCheck("solve", ["x^2-5*x+6=0", "x", "2"]);
  assert.equal(miss.ok, false);
  assert.match(miss.why, /manjka rešitev 3/);
  assert.equal((await casCheck("solve", ["x^2-5*x+6=0", "x", "2, 3, 4"])).ok, false, "odvečna rešitev");
  assert.equal((await casCheck("solve", ["x^2+1=0", "x", "none"])).ok, true);
  assert.equal((await casCheck("solve", ["2*x+y=5, x-y=1", "x, y", "x=2, y=1"])).ok, true);
  assert.equal((await casCheck("solve", ["2*x+y=5, x-y=1", "x, y", "x=1, y=3"])).ok, false);
  assert.equal((await casCheck("solve", ["sin(x)=1/2", "x", "pi/6+2*k*pi, 5*pi/6+2*k*pi"])).ok, true);
  assert.equal((await casCheck("solve", ["sin(x)=1/2", "x", "pi/6+2*k*pi"])).ok, false, "manjka druga družina");
  assert.equal((await casCheck("solve", ["(x-2000000)*(x-1)=0", "x", "1"])).ok, false, "rešitev daleč od izhodišča");
  assert.equal((await casCheck("solve", ["log(x, 2)=3", "x", "8"])).ok, true);
  assert.equal((await casCheck("ineq", ["x^2<4", "x", "(-2, 2)"])).ok, true);
  assert.equal((await casCheck("ineq", ["x^2-1>0", "x", "(-oo, -1) U (1, oo)"])).ok, true);
  assert.equal((await casCheck("ineq", ["x^2-1>0", "x", "x<-1 or x>1"])).ok, true);
  assert.equal((await casCheck("ineq", ["x^2-1>0", "x", "(1, oo)"])).ok, false);
});

cas("SymPy: identitete, odvodi, integrali, limite, vrste, matrike", async () => {
  assert.equal((await casCheck("equal", ["(a+b)^2", "a^2+2*a*b+b^2"])).ok, true);
  assert.equal((await casCheck("equal", ["(a+b)^2", "a^2+b^2"])).ok, false);
  assert.equal((await casCheck("equal", ["sin(x)^2+cos(x)^2", "1"])).ok, true);
  assert.equal((await casCheck("diff", ["x^2*sin(x)", "x", "2*x*sin(x)+x^2*cos(x)"])).ok, true);
  assert.equal((await casCheck("diff", ["x^2*sin(x)", "x", "2*x*cos(x)"])).ok, false);
  assert.equal((await casCheck("int", ["x*exp(x)", "x", "(x-1)*exp(x)+C"])).ok, true, "konstanta je poljubna");
  assert.equal((await casCheck("int", ["1/x", "x", "ln(abs(x))"])).ok, true);
  assert.equal((await casCheck("int", ["x^2", "x", "0", "3", "9"])).ok, true);
  assert.equal((await casCheck("int", ["x^2", "x", "0", "3", "8"])).ok, false);
  assert.equal((await casCheck("limit", ["sin(x)/x", "x", "0", "1"])).ok, true);
  assert.equal((await casCheck("limit", ["1/x", "x", "0+", "oo"])).ok, true);
  assert.equal((await casCheck("limit", ["(1+1/n)^n", "n", "oo", "e"])).ok, true);
  assert.equal((await casCheck("value", ["summation(1/n^2, (n, 1, oo))", "pi^2/6"])).ok, true);
  assert.equal((await casCheck("value", ["det(Matrix([[1,2],[3,4]]))", "-2"])).ok, true);
  assert.equal((await casCheck("value", ["inv(Matrix([[2,0],[0,4]]))", "Matrix([[1/2,0],[0,1/4]])"])).ok, true);
});

cas("SymPy: zaokroženi rezultati in enote", async () => {
  assert.equal((await casCheck("value", ["3.2*9.81", "31.4"])).ok, true, "zaokroženo na 1 decimalko");
  assert.equal((await casCheck("value", ["3.2*9.81", "31.5"])).ok, false);
  assert.equal((await casCheck("value", ["sqrt(2)", "1.41"])).ok, true);
  assert.equal((await casCheck("value", ["sqrt(2)", "1.42"])).ok, false);
  assert.equal((await casCheck("value", ["3/4+2/5", "23/20"])).ok, true);
  assert.equal((await casCheck("value", ["sin(30*pi/180)", "1/2"])).ok, true);
  assert.equal((await casCheck("units", ["3.2*kg*9.81*m/s^2", "31.4*N"])).ok, true);
  assert.equal((await casCheck("units", ["3.2*kg*9.81*m/s^2", "31.4*J"])).ok, false, "napačna enota");
  assert.equal((await casCheck("units", ["72*km/h", "20*m/s"])).ok, true);
  assert.equal((await casCheck("units", ["2*kg*9.81*m/s^2*1.5*m", "29.4*J"])).ok, true);
  assert.equal((await casCheck("units", ["12*V/(4*ohm)", "3*A"])).ok, true);
});

cas("SymPy: varnost (beli seznam imen) in nepreverljivo ni napaka", async () => {
  for (const evil of ["__import__('os').system('id')", "x.__class__", "open('/etc/passwd')", "eval(1)", "exec(1)"]) {
    const r = await casCheck("value", [evil, "1"]);
    assert.equal(r.ok, null, evil);
  }
  assert.equal((await casCheck("bla", ["1"])).ok, null, "neznan ukaz");
  assert.equal((await casCheck("value", ["x+1", "2"])).ok, null, "izraz z neznanko ni vrednost");
});

cas("odgovor z blokom RACUN: napačna trditev vrne opis za popravek", async () => {
  const r = await checkAnswerClaims("Rešitev je $x = 2$.\n<<RACUN\nresi: x^2-5*x+6=0 | x | 2\nvrednost: 2^10 | 1024\n>>" + META);
  assert.equal(r.claims, 2);
  assert.equal(r.checked, 2);
  assert.equal(r.failed.length, 1);
  assert.match(r.issue, /resi: x\^2-5\*x\+6=0 \| x \| 2.*manjka rešitev 3/);
  const ok = await checkAnswerClaims("<<RACUN\nodvod: x^3 | x | 3*x^2\nkemija: 2 H2 + O2 -> 2 H2O\n>>");
  assert.equal(ok.issue, null);
  assert.equal(ok.checked, 2);
});

cas("skeniranje: AI rešitev preverita numerika in SymPy", async () => {
  assert.equal((await verifyAiFull("x^2-5x+6=0", { kind: "equation", variable: "x", solutions: ["2", "3"] })).verified, true);
  const m = await verifyAiFull("x^2-5x+6=0", { kind: "equation", variable: "x", solutions: ["2"] });
  assert.equal(m.verified, false);
  assert.equal(m.reason, "missing");
  assert.equal((await verifyAiFull("(x-2000000)(x-1)=0", { kind: "equation", variable: "x", solutions: ["1"] })).verified, false);
  assert.equal((await verifyAiFull("2x+y=5; x-y=1", { kind: "system", solutions: ["x=2; y=1"] })).verified, true);
  assert.equal((await verifyAiFull("f(x) = x^2 sin(x)", { kind: "derivative", variable: "x", value: "2x sin(x) + x^2 cos(x)" })).verified, true);
  assert.equal((await verifyAiFull("\\frac{1}{2}+\\frac{1}{3}", { kind: "arith", value: "5/6" })).verified, true);
});

// Celoten krog v klepetu: inštruktor napiše napačno trditev v skrit blok → en »Popravek:«, odgovor se ne shrani za druge.
cas("klepet: napačna trditev v bloku RACUN sproži en popravek; blok ni viden", async () => {
  const store = openDb(":memory:");
  const calls = [];
  const answer = "Enačbo razstaviva: $(x-2)(x-3)=0$, zato je $x = 2$." + "\n<<RACUN\nresi: x^2-5*x+6=0 | x | 2\n>>" + META;
  const streamFn = async ({ system, mode, onText, messages }) => {
    const isFix = typeof system === "string" && system.startsWith("You fix one mistake");
    calls.push({ isFix, messages });
    const text = isFix ? "Popravek: rešitvi sta $x = 2$ in $x = 3$." : answer;
    if (!isFix) onText(text);
    return { content: [{ type: "text", text }], text, stopReason: "end_turn", model: modeParams(mode).model, usage: { input_tokens: 100, output_tokens: 20 } };
  };
  const server = createApp(store, { streamFn, reviewCreateFn: async (p) => ({ content: [{ type: "text", text: "OK" }], stop_reason: "end_turn", model: p.model, usage: { input_tokens: 10, output_tokens: 1 } }) }).listen(0);
  try {
    const base = `http://127.0.0.1:${server.address().port}`;
    const post = (p, b) => fetch(base + p, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) });
    const s = await (await post("/api/students", { name: "Ana", settings: {} })).json();
    const c = await (await post(`/api/students/${s.id}/conversations`, {})).json();
    const sse = await (await post(`/api/conversations/${c.id}/messages`, { text: "Pomagaj mi z nalogo iz zvezka, prosim." })).text();
    assert.doesNotMatch(sse, /RACUN|resi:/, "blok ni pretočen učencu");
    assert.equal(calls.filter((x) => x.isFix).length, 1, "en popravek");
    assert.match(calls.find((x) => x.isFix).messages[0].content[0].text, /manjka rešitev 3/);
    assert.match(sse, /Popravek:/);
    const a = store.listMessages(c.id).at(-1);
    assert.doesNotMatch(a.display_text, /RACUN/);
    const stats = JSON.parse(store.db.prepare("SELECT value FROM kv WHERE key = ?").get(STATS_KV).value);
    const day = Object.values(stats)[0];
    assert.equal(day.z_blokom, 1);
    assert.equal(day.napake, 1);
  } finally {
    server.close();
  }
});

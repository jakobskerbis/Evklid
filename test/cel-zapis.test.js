// Iskani del namesto celega zapisa (j, 19. 11. 2026, posnetek): pri nalogi »√175 = a√b, koliko je b?« je vnos
// »5√7« (pravilno delno korenjenje) veljal kot napačen, po treh poskusih brez razlage pa je prišel rešen zgled.
// Zdaj: pravilen cel zapis ni poskus in učenec izve, da vpiše samo b; cel zapis z napako je poskus z isto razlago.
// Ista vrsta napake drugje: »b = 7«, znanstveni zapis 2,5·10³, kπ, y = kx + n, x = c, izraz namesto števila.
import test from "node:test";
import assert from "node:assert/strict";
import * as MATH from "../public/graph/math.js";
import { checkAnswer } from "../server/practice/check.js";
import { GENERATORS } from "../server/practice/index.js";
import { makeRng } from "../server/practice/rng.js";
import { openDb } from "../server/db.js";
import { Progress } from "../server/progress.js";
import SL from "../public/i18n/sl.js";
import fs from "node:fs";

const opts = (o = {}) => ({ math: MATH, ...o });
const kind = (a, s, o) => {
  const r = checkAnswer(a, s, opts(o));
  return r.code || r.mistake?.code || r.kind;
};

test("√175 = a√b, iščemo b: 5√7 je pravilen cel zapis (ne poskus), 7 in b = 7 sta pravilna", () => {
  const A = { type: "number", value: 7, form: { expr: "a√(b)", vals: { a: 5, b: 7 }, ask: "b" } };
  for (const s of ["5√7", "5√(7)", "5·√7", "5 * sqrt(7)", "√(7)·5"]) {
    const r = checkAnswer(A, s, opts({ find: ["b"] }));
    assert.equal(r.kind, "format", s);
    assert.equal(r.code, "chk.partOnly", s);
    assert.match(r.message, /samo po b/);
  }
  assert.equal(kind(A, "7", { find: ["b"] }), "correct");
  assert.equal(kind(A, "b = 7", { find: ["b"] }), "correct");
  assert.equal(kind(A, "b=7"), "correct"); // iskana črka iz answer.form
  // Cel zapis z napako: napačen poskus z razlago (ne prazno »Ni še pravilno«).
  const w = checkAnswer(A, "4√7", opts());
  assert.equal(w.kind, "wrong");
  assert.equal(w.mistake.code, "chk.partOnlyWrong");
  assert.equal(kind(A, "√175"), "chk.partOnlyWrong");
  assert.equal(kind(A, "5"), "wrong");
  // Druga črka pred enačajem ni iskana: ostane opozorilo o zapisu.
  assert.equal(kind(A, "a = 5"), "chk.number");
});

test("iščemo a: 5√7 ni več sprejet le zato, ker se začne s 5", () => {
  const A = { type: "number", value: 5, form: { expr: "a√(b)", vals: { a: 5, b: 7 }, ask: "a" } };
  assert.equal(kind(A, "5√7"), "chk.partOnly");
  assert.equal(kind(A, "5"), "correct");
  assert.equal(kind(A, "√7"), "chk.partOnlyWrong"); // a = 1
});

test("brez razčlenjevalnika (vaje brez povezave, ko se ni naložil) preverjanje dela kot prej", () => {
  const A = { type: "number", value: 7, form: { expr: "a√(b)", vals: { a: 5, b: 7 }, ask: "b" } };
  assert.equal(checkAnswer(A, "5√7").kind, "wrong");
  assert.equal(checkAnswer(A, "7").kind, "correct");
  assert.equal(checkAnswer(A, "b = 7").kind, "correct");
});

test("oblike iz besedila: y = kx + n, x = c, x + c, kπ, z = x + yi", () => {
  const tang = "Tangenta je vzporedna premici $y = 2x$. Zapiši jo v obliki $y = kx + n$. Koliko je $n$?";
  const N = { type: "number", value: -1 };
  for (const s of ["y = 2x - 1", "y=-1+2x", "2x - 1", "f(x) = 2x − 1"]) assert.equal(kind(N, s, { text: tang }), "chk.partOnlyAsk", s);
  assert.equal(kind(N, "y = 2x + 1", { text: tang }), "chk.partOnlyWrong");
  assert.equal(kind(N, "n = -1", { text: tang }), "correct");
  assert.equal(kind(N, "-1", { text: tang }), "correct");

  const vod = "Parabola ima enačbo $y^2 = 24x$. Njena vodnica ima enačbo $x = m$. Koliko je $m$?";
  assert.equal(kind({ type: "number", value: -6 }, "x = -6", { text: vod }), "chk.partOnly");
  assert.equal(kind({ type: "number", value: -6 }, "x = 6", { text: vod }), "chk.partOnlyWrong");
  assert.equal(kind({ type: "number", value: -6 }, "m = -6", { text: vod }), "correct");

  const fak = "Izraz $x^3 - 27$ ima linearni faktor oblike $x + c$. Koliko je $c$?";
  assert.equal(kind({ type: "number", value: -3 }, "x - 3", { text: fak }), "chk.partOnly");
  assert.equal(kind({ type: "number", value: -3 }, "x + 3", { text: fak }), "chk.partOnlyWrong");

  const rad = "Kot $150^\\circ$ zapiši v radianih v obliki $k\\pi$. Koliko je $k$? Vpiši okrajšan ulomek.";
  const K = { type: "fraction", num: 5, den: 6 };
  for (const s of ["5π/6", "5/6π", "5/6 π"]) assert.equal(kind(K, s, { text: rad, find: ["k"] }), "chk.partOnly", s);
  assert.equal(kind(K, "π/6", { text: rad }), "chk.partOnlyWrong");
  assert.equal(kind(K, "5/6", { text: rad }), "correct");
  assert.equal(kind(K, "k = 5/6", { text: rad }), "correct");

  const kom = "Poišči kompleksno število $z = x + yi$, za katero velja $2z = 6 + 4i$. Koliko je $x$?";
  assert.equal(kind({ type: "number", value: 3 }, "3 + 2i", { text: kom, find: ["x"] }), "chk.partOnlyAsk");
  assert.equal(kind({ type: "number", value: 3 }, "4 + 2i", { text: kom, find: ["x"] }), "chk.partOnlyWrong");
});

test("znanstveni zapis je število (prej »1000-krat premajhen«)", () => {
  const A = { type: "number", value: 2500 };
  for (const s of ["2,5·10^3", "2,5 × 10^(3)", "2,5*10³", "2.5x10^3", "2,5·10^{3}"]) assert.equal(kind(A, s), "correct", s);
  assert.equal(kind({ type: "number", value: 0.0012, unit: "m" }, "1,2·10^-3 m"), "correct");
  assert.equal(kind({ type: "number", value: 0.0012, unit: "m" }, "1,2·10⁻³ m"), "correct");
  assert.equal(kind(A, "2,5·10^4"), "chk.magnitudeBig");
  // Brez razčlenjevalnika tudi.
  assert.equal(checkAnswer(A, "2,5·10^3").kind, "correct");
});

test("izraz namesto enega števila: prava vrednost ni poskus, napačna dobi razlago", () => {
  const A = { type: "number", value: 7 };
  assert.equal(kind(A, "√(49)"), "chk.calcFully");
  assert.equal(kind(A, "3 + 4"), "chk.calcFully");
  assert.equal(kind(A, "5√7"), "chk.expression");
  assert.equal(kind(A, "x = 7", { find: ["x"] }), "correct");
  assert.equal(kind(A, "7 kg"), "correct"); // beseda za številom ostane kot prej
  // Natančen zapis s π je pravilen kot »2π«.
  assert.equal(kind({ type: "number", value: (2 * Math.PI) / 3, decimals: 2 }, "2π/3"), "correct");
  // Z enoto ali decimalno piko (angleške naloge) se nič ne spremeni.
  assert.equal(kind({ type: "number", value: 7, unit: "cm" }, "√(49) cm"), "chk.number");
});

test("generatorji z obliko: pravilen cel zapis je prepoznan, pravilno število sprejeto", () => {
  let seen = 0;
  for (const g of GENERATORS) {
    for (const level of [1, 2, 3]) {
      for (let seed = 0; seed < 25; seed++) {
        let t;
        try {
          t = g.gen(level, makeRng(seed), (g.topics || [])[0], "sl", null);
        } catch {
          continue;
        }
        const f = t?.answer?.form;
        if (!f) continue;
        seen++;
        const whole = f.expr.replace(/\b[a-zA-Z]\b/g, (c) => (c in f.vals ? `(${f.vals[c]})` : c));
        assert.equal(kind(t.answer, whole, { text: t.text, find: t.data?.find }), "chk.partOnly", `${g.id}: ${whole}`);
      }
    }
  }
  assert.ok(seen > 50, `nalog z obliko: ${seen}`);
});

test("vaja (progress): pravilen cel zapis ne porabi poskusa, prvi pravi odgovor velja kot prvi poskus", () => {
  const store = openDb(":memory:");
  const p = new Progress(store);
  const s = store.createStudent("Ana");
  p.nextPractice(s.id, "MAT-SS-2/koreni");
  const n = p.nextPractice(s.id, "MAT-SS-2/koreni");
  const row = p.getTask(n.task.id);
  const payload = {
    ...row.payload,
    text: "Delno koreni $\\sqrt{175}$, tako da dobiš obliko $a\\sqrt{b}$, kjer je $b$ čim manjše naravno število. Koliko je $b$?",
    data: { given: ["\\sqrt{175} = a\\sqrt{b}"], find: ["b"] },
    answer: { type: "number", value: 7, form: { expr: "a√(b)", vals: { a: 5, b: 7 }, ask: "b" } },
  };
  p.db.prepare("UPDATE tasks SET payload = ? WHERE id = ?").run(JSON.stringify(payload), n.task.id);
  const r = p.answer(s.id, n.task.id, "5√(7)");
  assert.equal(r.retry, true);
  assert.equal(r.code, "chk.partOnly");
  assert.equal(p.getTask(n.task.id).attempts, 0);
  const ok = p.answer(s.id, n.task.id, "7");
  assert.equal(ok.correct, true);
  assert.equal(p.getTask(n.task.id).first_try_correct, 1);
});

test("sporočila so prevedena v vse jezike in ne izdajo števila", () => {
  const codes = ["chk.partOnly", "chk.partOnlyAsk", "chk.partOnlyWrong", "chk.calcFully", "chk.expression"];
  for (const c of codes) {
    assert.ok(SL[c], c);
    assert.doesNotMatch(SL[c], /\d/, c);
  }
  for (const f of fs.readdirSync("public/i18n/ui")) {
    const ui = JSON.parse(fs.readFileSync(`public/i18n/ui/${f}`, "utf8"));
    for (const c of codes) {
      assert.ok(ui[c], `${f} ${c}`);
      assert.equal(ui[c].includes("{sym}"), SL[c].includes("{sym}"), `${f} ${c}`);
    }
  }
});

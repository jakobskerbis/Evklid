import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { checkIdentities, splitFormulas } from "../server/lesson-identity.js";

const bad = (md, o) => checkIdentities(md, o).mismatches.length;

test("identities: a wrong rule is caught, a right one passes (j, 1. 11. 2026)", () => {
  assert.equal(bad("$(a+b)^2 = a^2 + 2ab + b^2$"), 0);
  assert.equal(bad("$(a+b)^2 = a^2 + b^2$"), 1);
  assert.equal(bad("$\\sqrt{a} \\cdot \\sqrt{b} = \\sqrt{ab}$"), 0);
  assert.equal(bad("$\\sqrt{a+b} = \\sqrt{a} + \\sqrt{b}$"), 1);
  assert.equal(bad("$a^m \\cdot a^n = a^{m+n}$ in $\\dfrac{a^m}{a^n} = a^{m-n}$"), 0);
  assert.equal(bad("$\\sin^2 x + \\cos^2 x = 1$ in $\\sin 2x = 2\\sin x\\cos x$"), 0);
  assert.equal(bad("$\\sin(\\alpha + \\beta) = \\sin\\alpha + \\sin\\beta$"), 1);
  assert.equal(bad("$a(b + c) = ab + ac \\qquad a(b - c) = ab + ac$"), 1, "second formula after \\qquad");
  // \left … \right (prej ga je SKIP_TEX ujel kot \le), |a|+|b|, oglati oklepaji, deljenje z »:«
  assert.equal(bad("$\\left(a+b\\right)^{2} = a^{2}-2ab+b^{2}$"), 1);
  assert.equal(bad("$\\left[(a+b)^2 - (a-b)^2\\right] = 2ab$"), 1);
  assert.equal(bad("kompleksna števila: $\\left|z_1 z_2\\right| = |z_1| + |z_2|$"), 1);
  assert.equal(bad("$\\dfrac{a}{b} : \\dfrac{c}{d} = \\dfrac{ac}{bd}$"), 1);
  assert.equal(bad("$\\dfrac{a}{b} : \\dfrac{c}{d} = \\dfrac{ad}{bc}$ in $ka : kb : kc = a : b : c$"), 0);
  // Stran, ki je za vse vrednosti enaka, proti številu; enačba (x · 0 = 12 v pogojniku) ostane neoznačena
  assert.equal(bad("$\\sin^2\\alpha + \\cos^2\\alpha = 2$"), 1);
  assert.equal(bad("Če bi bilo $12 : 0 = x$, bi moralo veljati $x \\cdot 0 = 12$."), 0);
});

test("identities: complex numbers use z = a + bi from the lesson (z·z̄ = a² − b² must fail)", () => {
  const lesson = (rel) => `Kompleksno število $z = a + bi$, konjugirano $\\bar{z} = a - bi$.\n\n## Povzetek\n\n- $${rel}$\n`;
  assert.equal(bad(lesson("z \\cdot \\bar{z} = a^2 + b^2")), 0);
  assert.equal(bad(lesson("z \\cdot \\bar{z} = a^2 - b^2")), 1);
  assert.equal(bad("kompleksna števila: $(2 - i)^2 = 4 - 4i + i^2 = 3 - 4i$"), 0);
  assert.equal(bad("kompleksna števila: $(2 - i)^2 = 5 - 4i$"), 1);
});

test("identities: equations, laws, wrong-on-purpose text and quiz distractors are not flagged", () => {
  assert.equal(bad("$P = \\dfrac{A}{t} = \\dfrac{F s}{t} = F v$"), 0, "physics law, different quantities");
  assert.equal(bad("## Rešeni primeri\n\n$2x + 3 = x + 5$\n\n$x = 2$"), 0, "equation in an example");
  assert.equal(bad("Napačno: $(x + 3)^2 = x^2 + 9$"), 0);
  assert.equal(bad("## Pogoste napake\n\n- $(a+b)^2 = a^2 + b^2$"), 0);
  assert.equal(bad("## Preveri se\n\n? Kaj velja?\n- $(a+b)^2 = a^2 + b^2$\n+ $(a+b)^2 = a^2 + 2ab + b^2$"), 0);
  assert.equal(bad("## Preveri se\n\n? Kaj velja?\n+ $(a+b)^2 = a^2 + b^2$"), 1, "the key answer is checked");
  assert.equal(bad("Absolutna vrednost: $|x| = -x$ za $x < 0$."), 0);
  assert.equal(bad("$c(t) = c_0 e^{-kt}$ in $S(r) = 2\\pi r^2$"), 0, "function notation");
  assert.deepEqual(splitFormulas("a = 1, b = 2"), ["a = 1", "b = 2"]);
  assert.deepEqual(splitFormulas("\\frac{1}{2}\\, t \\cdot g t = \\frac{g t^2}{2}"), ["\\frac{1}{2}\\, t \\cdot g t = \\frac{g t^2}{2}"]);
});

test("identities: :::simboli relations are checked too", () => {
  assert.equal(bad(":::simboli\nS | ploščina | S = (a+b)^2 - a^2 - b^2 = ab | m^2 |\n:::"), 1);
  assert.equal(bad(":::simboli\nS | ploščina | S = (a+b)^2 - a^2 - b^2 = 2ab | m^2 |\n:::"), 0);
});

test("identities: every lesson, formula sheet, :::simboli relation and mind map holds", () => {
  const root = new URL("../content/", import.meta.url);
  const out = [];
  const walk = (u) => {
    for (const e of readdirSync(u, { withFileTypes: true })) {
      if (e.isDirectory()) walk(new URL(e.name + "/", u));
      else if (e.name.endsWith(".md") && e.name !== "README.md") {
        for (const m of checkIdentities(readFileSync(new URL(e.name, u), "utf8")).mismatches) out.push(`${u.pathname.split("/content/")[1]}${e.name}:${m.line} ${m.tex}`);
      }
    }
  };
  for (const d of ["lessons/", "formulas/", "gradiva/"]) walk(new URL(d, root));
  assert.deepEqual(out, []);
});

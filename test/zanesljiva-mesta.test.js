// AUDIT-068: kompleksne ničle v gruči so imele z »≈« napačna zadnja mesta: ((x − 9/2)⁴ + 10⁻²⁶)(x³ − 3x + 1) = 0 →
// Im 2,24542·10⁻⁷ (prava 2,23607·10⁻⁷), ((x − 1/2)⁴ + 10⁻²²)(x³ − 2) = 0 → 2,2358·10⁻⁶ (prava 2,23607·10⁻⁶).
// Zdaj: zmnožek točnih faktorjev rešimo po faktorjih, kadar so polmeri napake ožji, in majhen imaginarni del pokažemo
// le na zanesljiva mesta. Vrednosti: mpmath polyroots na 120 mest (fixtures/gruce-068-mpmath.json).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { analyze, solutionTex } from "../public/graph/scisolve.js";

const ENV = { vars: {}, funcs: {}, ans: 0, deg: false, grad: false, comma: true };
// prikazano število → [vrednost, enota zadnjega mesta]
const num = (t) => {
  const m = /^(-?)(\d+)(?:\{,\}(\d+))?(?:\\cdot 10\^\{(-?\d+)\})?$/.exec(t.trim());
  if (!m) return null;
  const e = Number(m[4] || 0);
  return [Number(`${m[1]}${m[2]}.${m[3] || "0"}e${e}`), 10 ** (e - (m[3] || "").length)];
};
// vsaka prikazana kompleksna ničla a ± bi se z mpmath ujema na pol enote zadnjega prikazanega mesta
function badDigits(t, cx) {
  const bad = [];
  for (const p of solutionTex(analyze(t, ENV)).split(",\\quad ")) {
    const m = /^x_\{[^}]*\} (=|\\approx) (.*?)(\;.*)?$/.exec(p);
    if (!m || !/i$/.test(m[2])) continue;
    const body = m[2].replace(/\\,i$|i$/, "");
    let k = -1;
    for (let j = body.length - 1; j > 0; j--)
      if ((body[j] === "+" || body[j] === "-") && body[j - 1] !== "{") {
        k = j;
        break;
      }
    if (k <= 0) continue;
    const a = num(body.slice(0, k));
    const b = num(body.slice(k + 1) || "1");
    if (!a || !b) continue; // točna oblika (ulomek, koren)
    const sg = body[k] === "-" ? -1 : 1;
    const ok = cx.some(([re, im]) => Math.abs(re - a[0]) <= 0.5000001 * a[1] + 1e-15 * Math.abs(re) && Math.abs(im - sg * b[0]) <= 0.5000001 * b[1] + 1e-15 * Math.abs(im));
    if (!ok) bad.push(p);
  }
  return bad;
}

test("pregled: (x − 9/2)⁴ + 10⁻²⁶ in (x − 1/2)⁴ + 10⁻²² z drugim faktorjem", () => {
  const t = "((x−9/2)^4+10^(−26))*(x^3−3x+1)=0";
  const s = solutionTex(analyze(t, ENV));
  assert.ok(!s.includes("2{,}24542"), s);
  assert.ok(s.includes("x_{4} \\approx 4{,}4999998-2{,}23607\\cdot 10^{-7}\\,i"), s);
  const s2 = solutionTex(analyze("((x−(1/2))^4+10^(−22))*(x^3−2)=0", ENV));
  assert.ok(!s2.includes("22358"), s2);
});

test("gruče z drugim faktorjem: prikazana mesta kompleksnih ničel so zanesljiva (mpmath, 60 enačb)", () => {
  const cases = JSON.parse(fs.readFileSync(new URL("./fixtures/gruce-068-mpmath.json", import.meta.url)));
  const bad = [];
  for (const c of cases) for (const p of badDigits(c.t, c.cx)) bad.push(`${c.t}: ${p}`);
  assert.deepEqual(bad, []);
});

test("majhen imaginarni del ob iracionalnem predstavljivem realnem delu: le zanesljiva mesta", () => {
  // (x − 4/3)² + 10⁻²⁷: Im = 10^(−13,5) = 3,16228·10⁻¹⁴ (prej 3,16227·10⁻¹⁴, ker 4/3 v double ni točno)
  assert.deepEqual(badDigits("((x−(4/3))^2+10^(−27))*(x^2+1)=0", [[1.3333333333333333, -3.1622776601683794e-14], [1.3333333333333333, 3.1622776601683794e-14], [0, -1], [0, 1]]), []);
  assert.deepEqual(badDigits("((x+(4/3))^2+10^(−28))*(x^3−2)=0", [[-1.3333333333333333, -1e-14], [-1.3333333333333333, 1e-14], [-0.6299605249474366, -1.0911236359717214], [-0.6299605249474366, 1.0911236359717214]]), []);
});

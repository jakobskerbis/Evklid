// Urejanje naloge v skenerju »kar v formuli, kot v klepetu« (j 26. 11.): polje kaže zapis s tipkovnice (·, √, ≤, □),
// reševanje pa dobi isto nalogo. Lepši zapis ne sme spremeniti rezultata lastnega reševalnika.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { solve, analyze } from "../public/scan/solvecore.js";
import { lepZapis, zaPolje, izPolja, VIDNA_OZNAKA } from "../public/scan/zapis-polja.js";
import { casText } from "../server/scan.js";

const naloge = () => {
  const fx = JSON.parse(fs.readFileSync(new URL("./fixtures/sken/naloge.json", import.meta.url), "utf8"));
  const out = new Set();
  JSON.stringify(fx).replace(/"racun":"((?:[^"\\]|\\.)*)"/g, (m, a) => out.add(JSON.parse(`"${a}"`)));
  for (const s of ["1/2/3", "2/3+3/4*8/9", "sqrt(2)*pi", "x<=pi/2", "x >= 3*x - 4", "3/(x+1)=2", "2^3/4", "x^2/3", "1,5/2", "2**3", "sin(pi/6)", "-3/4", "2/1e8", "sqrt (x) * sqrt(x)", "msqrt(2)"]) out.add(s);
  return [...out];
};
const key = (r) => JSON.stringify(r && { ok: r.ok, a: r.answer, g: r.goal, t: r.type, s: r.status });

test("lepZapis: zapis s tipkovnice", () => {
  assert.equal(lepZapis("2*x^2-3*x-5=0"), "2·x^2-3·x-5=0");
  assert.equal(lepZapis("sqrt(x+7)=x+1"), "√(x+7)=x+1");
  assert.equal(lepZapis("x^2-2*x-8<=0"), "x^2-2·x-8≤0");
  assert.equal(lepZapis("x >= 1"), "x ≥ 1");
  assert.equal(lepZapis("2**3"), "2^3");
  assert.equal(lepZapis("sin(pi/6)"), "sin(pi/6)", "π ostane pi (reševalnik bi ga pri sin bral v stopinjah)");
  assert.equal(lepZapis("2/3"), "2/3", "ulomki ostanejo");
  assert.equal(zaPolje("2*x^2-[?]*x-5=0"), `2·x^2-${VIDNA_OZNAKA}·x-5=0`);
  assert.equal(izPolja(`2·x^2-${VIDNA_OZNAKA}·x-5=0`), "2·x^2-[?]·x-5=0");
  assert.equal(izPolja(null), "");
});

test("lepZapis ne spremeni rezultata reševalnika ne razčlenitve (naloge meritve in robni primeri)", () => {
  for (const t of naloge()) {
    const l = lepZapis(t);
    assert.equal(analyze(l).type, analyze(t).type, t);
    assert.equal(key(solve(l)), key(solve(t)), t);
    // tudi zapis za SymPy (worker.py zamenja · in ≤ sam)
    assert.equal(casText(l).replace(/·/g, "*").replace(/≤/g, "<=").replace(/≥/g, ">=").replace(/\s+/g, ""), casText(t).replace(/\*\*/g, "^").replace(/\s+/g, ""), t);
  }
});

test("zaslon Skeniraj: polje kaže zaPolje, reševanje dobi nespremenjeno prebrano nalogo", () => {
  const src = fs.readFileSync(new URL("../public/scan/scan.js", import.meta.url), "utf8");
  const conf = src.slice(src.indexOf("function renderConfirm(box)"), src.indexOf("// Negotovo branje (P3-5): obvestilo o branju"));
  assert.match(conf, /value="\$\{esc\(zaPolje\(S\.text\)\)\}"/);
  assert.match(conf, /const naloga = \(\) => \(input\.value === field\.shown \? field\.text : izPolja\(input\.value\)\);/);
  assert.doesNotMatch(conf.replace(/input\.value === field\.shown|izPolja\(input\.value\)|input\.value = field\.shown|input\.value\.trim\(\)|prevField = input\.value|\{ shown: input\.value|input\.isConnected && input\.value/g, ""), /input\.value/, "nalogo bere le naloga()");
  const css = fs.readFileSync(new URL("../public/scan.css", import.meta.url), "utf8");
  assert.match(css, /\.scan-input-wrap \.vnos-izrisan ~ \.scan-input-izris \{ display: none; \}/, "skupni izris vnosa ima prednost");
  assert.match(css, /\.scan-input-wrap\.ima-izris input \{ -webkit-text-fill-color: transparent;/, "barva polja ostane (skupni izris jo prevzame)");
  assert.doesNotMatch(css, /\.ima-izris input \{ color: transparent/);
  assert.match(conf, /m\.initPredogledVnosa\(\);\s*if \(input\.isConnected && input\.value\) input\.dispatchEvent\(new Event\("change"/, "prebrana naloga se izriše brez vnosa");
});

// AUDIT-040: bralnik zaslona dobi opis matematike (»integral od 0 do 1 x d x«) namesto surovega vnosa »∫(x;0;1)«.
// Besede so v i18n (sc.say.*, vsi jeziki vmesnika); polje ima aria-describedby na skrit opis, ki sledi vnosu in kazalcu.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import katex from "katex";
import SL from "../public/i18n/sl.js";
import { entryBase, caretTex, texSpeech, SAY_WORDS, SAY_GREEK } from "../public/graph/sci-vnos.js";

const env = { vars: {}, funcs: {}, ans: 0, deg: false, grad: false, comma: true };
const say = (k, v) => SL[`sc.say.${k}`].replace(/\{(\w+)\}/g, (_, x) => v[x] ?? "");
const words = Object.fromEntries(SL["sc.say.words"].split("|").map((w, i) => [SAY_WORDS[i], w]));
const greek = Object.fromEntries(SL["sc.say.greek"].split("|").map((w, i) => [SAY_GREEK[i], w]));
const speech = (t, p = t.length) => texSpeech(caretTex(entryBase(t, env), p), { say, words, greek, parse: katex.__parse });

test("opis vnosa za bralnik zaslona v slovenščini (AUDIT-040)", () => {
  assert.equal(speech("∫(x;0;1)"), "integral od 0 do 1 x d x kazalec");
  assert.equal(speech("∫(x;0;1)", 4), "integral od kazalec 0 do 1 x d x");
  assert.equal(speech("∫(;;)", 2), "integral od prazno do prazno kazalec prazno d x");
  assert.equal(speech("d/dx(x³)"), "odvod po x oklepaj x na 3 zaklepaj kazalec");
  assert.equal(speech("√(2)+3"), "koren iz 2 plus 3 kazalec");
  assert.equal(speech("2,5+1"), "2 cela 5 plus 1 kazalec");
  assert.equal(speech("1/2"), "1 skozi 2 kazalec");
  assert.equal(speech("(1+2)/(3+4)"), "ulomek: 1 plus 2, skozi 3 plus 4, konec ulomka kazalec");
  assert.equal(speech("∑_(n=1)^(5) n"), "vsota od n je enako 1 do 5 n kazalec");
  assert.match(speech("limita(sin(x)/x; x; 0)"), /^limita x proti 0 /);
  assert.equal(speech("x²≤4"), "x na 2 manj ali enako 4 kazalec");
  assert.equal(speech("abs(x−1)"), "absolutna vrednost x minus 1, konec absolutne vrednosti kazalec");
  assert.equal(speech("abs(x−1)", 7), "absolutna vrednost x minus 1 kazalec, konec absolutne vrednosti");
  // AUDIT-048: |x−1|+2 in |x−1+2| se ne smeta slišati enako
  assert.equal(speech("abs(x−1)+2"), "absolutna vrednost x minus 1, konec absolutne vrednosti plus 2 kazalec");
  assert.equal(speech("abs(x−1+2)"), "absolutna vrednost x minus 1 plus 2, konec absolutne vrednosti kazalec");
  assert.equal(speech("abs(x)+2"), "absolutna vrednost x plus 2 kazalec");
  // pregled #974: konec korena in potence, kjer je argument iz več členov; kazalec na pravem mestu; grške črke
  assert.equal(speech("√(x²+1)"), "koren iz x na 2 plus 1, konec korena kazalec");
  assert.equal(speech("√(x²)+1"), "koren iz x na 2 plus 1 kazalec");
  assert.equal(speech("2^(x+1)"), "2 na x plus 1, konec potence kazalec");
  assert.equal(speech("2^(x)+1"), "2 na x plus 1 kazalec");
  assert.equal(speech("sin(x)²"), "sinus na 2 oklepaj x zaklepaj kazalec");
  assert.equal(speech("3·α"), "3 alfa kazalec");
  assert.equal(speech("3·α", 0), "kazalec 3 alfa");
  assert.equal(speech("θ+φ"), "theta plus fi kazalec");
  // nikoli surov vnos ali TeX
  for (const t of ["∫(x;0;1)", "integriraj(x²)", "det([[1; 2]; [3; 4]])", "nCr(5;2)", "d/dx(x³;2)", "x_1+x_2", "30°", "5!"]) {
    const s = speech(t);
    assert.ok(s && !/[\\{}()∫]|integriraj|frac|left/.test(s), `${t} → ${s}`);
  }
});

test("besede sc.say.* so v vseh jezikih vmesnika in imajo 32 besed (AUDIT-040)", () => {
  assert.equal(SAY_WORDS.length, 32);
  assert.equal(SAY_GREEK.length, 13);
  const ui = (l) => JSON.parse(fs.readFileSync(path.resolve(`public/i18n/ui/${l}.json`), "utf8"));
  // pregled #974: števec pred imenovalcem, binomski koeficient v pravem vrstnem redu, oklepaji
  for (const l of ["zh", "zh-Hant", "ja", "ko"]) assert.ok(ui(l)["sc.say.fracLong"].indexOf("{a}") < ui(l)["sc.say.fracLong"].indexOf("{b}"), l);
  assert.equal(ui("fr")["sc.say.binom"], "{b} parmi {a}");
  assert.match(ui("ru")["sc.say.paren"], /^открыть скобку \{a\} закрыть скобку$/);
  assert.ok(ui("sq")["sc.say.binom"] !== ui("sq")["sc.say.frac"], "sq: binom ≠ ulomek");
  for (const l of ["hu", "tr"]) assert.doesNotMatch(Object.entries(ui(l)).filter(([k]) => k.startsWith("sc.say.")).map(([, v]) => v).join(" "), /\}['-]/, `${l}: pripona ob spremenljivki`);
  const dir = path.resolve("public/i18n/ui");
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".json"))) {
    const d = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
    assert.equal(d["sc.say.words"].split("|").length, 32, f);
    assert.equal(d["sc.say.greek"].split("|").length, 13, f);
  }
});

test("polje kalkulatorja ima aria-describedby na skrit opis, ki se osveži ob vnosu (AUDIT-040)", () => {
  const src = fs.readFileSync(path.resolve("public/graph/sci.js"), "utf8");
  assert.match(src, /class="sc-input"[^>]*aria-describedby="\$\{sayId\}"/);
  assert.match(src, /class="sc-say sr-only" id="\$\{sayId\}"/);
  assert.match(src, /speak\(tex\)/);
});

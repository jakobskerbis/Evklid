// Opomba brez modela (AUDIT-059, 060, 066; dokončanje pred pilotom): ugotovitve kode (fact) in besedilo opombe.
// Celotni primeri v klepetu (meja porabe, napaka klica, »OK« modela, prost proračun) so v test/popravek-ob-meji.test.js.
import test from "node:test";
import assert from "node:assert/strict";
import { checkNoteFor, factText } from "../server/opomba-preverjanja.js";
import { codeFindings, presolve, isClaim } from "../server/live-check.js";
import { stepVerdict, verdictIgnored } from "../server/sodba-koraka.js";
import { visibleFinding, parseClaims } from "../server/racun.js";
import { calcFact, calcToTex, plainToTex, numTex } from "../server/besedilo-trditev.js";
import { LIVE_UI_LANGUAGES } from "../public/i18n/languages.js";

const R = String.raw;
const note = (a, q) => {
  const f = codeFindings(a, q ? presolve(q) : null, q || "");
  return { f, text: checkNoteFor(f.fact, "sl", { soft: !!f.soft }) };
};

test("AUDIT-060: konkretne opombe za račun, odvod, gol rezultat in vrednost neznanke", () => {
  const cases = [
    ["Koliko je 7 krat 8 plus 2?", R`Izračunajmo: $7 \cdot 8 = 54$.`, R`Opomba: $7 \cdot 8 = 54$ ne drži, ker je $7 \cdot 8 = 56$. Preveri še sam.`],
    [null, R`Velja $54 = 7 \cdot 8$.`, R`Opomba: $54 = 7 \cdot 8$ ne drži, ker je $7 \cdot 8 = 56$. Preveri še sam.`],
    [R`Odvajaj $f(x) = x^3$.`, R`Odvod je $f'(x) = 2x$.`, R`Opomba: odvod funkcije $f(x) = x^{3}$ je $f'(x) = 3x^{2}$, ne $f'(x) = 2x$. Preveri še sam.`],
    [R`Izračunaj $7 \cdot 8$.`, "**54**", R`Opomba: $7 \cdot 8 = 54$ ne drži, ker je $7 \cdot 8 = 56$. Preveri še sam.`],
    [R`Izračunaj $\frac{10}{3}$.`, "**Rezultat:** 3,4", R`Opomba: $\left(\frac{10}{3}\right) = 3{,}4$ ne drži, ker je $\left(\frac{10}{3}\right) = \frac{10}{3} \approx 3{,}33333$. Preveri še sam.`],
    [R`Reši enačbo $2x + 3 = 11$.`, R`Rešitev je $x = 5$.`, R`Opomba: $x = 5$ ni rešitev enačbe $2x + 3 = 11$ (rešitev: $x = 4$). Preveri še sam.`],
  ];
  for (const [q, a, want] of cases) assert.equal(note(a, q).text, `\n\n*(${want})*`, a);
});

test("AUDIT-060: enota ali odstotek v računu → opomba brez vrednosti (pretvorba ni zanesljiva)", () => {
  const { f, text } = note(R`Skupaj: $3\,\text{km} + 200\,\text{m} = 3500\,\text{m}$.`);
  assert.ok(f.issue);
  assert.equal(f.fact.right, undefined);
  assert.match(text, /ne drži\. Preveri še sam\./);
  assert.equal(calcFact({ lhs: R`20\,\% \cdot 60`, op: "=", rhs: "15", lv: 12 }).right, undefined);
});

test("AUDIT-066: blaga ugotovitev dobi le blago opombo", () => {
  const { f, text } = note(R`Če najprej množimo: $7 \cdot 8 = 54$.`, "Koliko je 7 krat 8 plus 2?");
  assert.equal(f.soft, true);
  assert.equal(text, R`

*(Opomba: v odgovoru je zapis $7 \cdot 8 = 54$, ki ne drži ($7 \cdot 8 = 56$). Če je naveden kot primer napake, je odgovor v redu.)*`);
  assert.match(checkNoteFor(null, "sl", { soft: true }), /v odgovoru je račun, ki ne drži\. Če je naveden kot primer napake/);
});

test("AUDIT-060: vidna rešitev proti bloku RACUN dobi konkretno ugotovitev", () => {
  const t = "Rešitev je $x = 5$.\n<<RACUN\nresi: 2*x+3=11 | x | 4\n>>";
  const f = visibleFinding(t, parseClaims(t));
  assert.deepEqual(f.fact, { kind: "value", wrong: "x = 5", eq: "2x + 3 = 11", right: "x = 4" });
  const t2 = "Rešitev je $x = 1{,}5$.\n<<RACUN\nresi: x^2=2 | x | -sqrt(2), sqrt(2)\n>>";
  assert.match(checkNoteFor(visibleFinding(t2, parseClaims(t2)).fact), /\$x = 1\{,\}5\$ ni rešitev enačbe \$x\^2 = 2\$ \(rešitev: \$x = -\\sqrt\{2\},\\; x = \\sqrt\{2\}\$\)/);
});

test("AUDIT-059: vprašanje-predlog in golo število proti inštruktorjevemu vprašanju", () => {
  const T = presolve(R`Izračunaj $7 \cdot 8 + 2$.`, { first: true, narrow: false });
  const E = presolve("Reši enačbo $2x + 3 = 11$.", { first: true, narrow: false });
  const ask = R`Koliko je $7 \cdot 8$?`;
  const wrong = [
    ["je 7 · 8 = 54?", T, ask],
    ["7 · 8 = 54, ne?", T, ask],
    ["7 · 8 je 54?", T, ask],
    ["54?", T, ask],
    ["mogoče 54?", T, "Najprej pomnoži. Koliko je 7 · 8?"],
    ["x = 5, kajne?", E, "Koliko je x?"],
  ];
  for (const [q, pre, prev] of wrong) {
    assert.equal(isClaim(q, prev), true, q);
    const v = stepVerdict(q, { pre, prevTutor: prev });
    assert.equal(v?.wrong, true, q);
    assert.equal(v.asked, true, q);
    assert.match(checkNoteFor(v.fact, "sl", { verdict: true }), /Opomba: \$(?:7 \\cdot 8 = 54\$ ne drži, ker je \$7 \\cdot 8 = 56|x = 5\$ ni rešitev enačbe \$2x \+ 3 = 11)/, q);
    assert.equal(verdictIgnored("Da, tako je.", v), true, q);
    assert.equal(verdictIgnored(R`Ne, $7 \cdot 8 = 56$.`, v), false, q);
  }
  // pravilen predlog: koda ga potrdi (ali ne sodi), nikoli napačna sodba
  for (const [q, prev] of [["56?", ask], ["je 7 · 8 = 56?", ask], ["58?", "Koliko je?"]]) assert.notEqual(stepVerdict(q, { pre: T, prevTutor: prev })?.wrong, true, q);
  // golo število brez inštruktorjevega vprašanja z računom: brez sodbe
  for (const prev of ["Kaj narediš najprej?", R`Koliko je $7 \cdot 8$, če ...?`, "Koliko je x?"]) assert.equal(stepVerdict("54?", { pre: T, prevTutor: prev }), null, prev);
  assert.equal(isClaim("Koliko je 7 · 8?", ask), false);
});

test("AUDIT-060: sodba koraka ima ugotovitev za opombo (račun, vrednost, korak, pravilen korak)", () => {
  const E = presolve("Reši enačbo $2x + 3 = 11$.", { first: true, narrow: false });
  const t = (q, prev = "Kaj dobiš?") => checkNoteFor(stepVerdict(q, { pre: E, prevTutor: prev })?.fact, "sl", { verdict: true });
  assert.match(t("x = 5"), /\$x = 5\$ ni rešitev enačbe \$2x \+ 3 = 11\$ \(rešitev: \$x = 4\$\)/);
  assert.match(t("2x = 7", "Odštej 3. Kaj dobiš?"), /\$2x = 7\$ ne sledi iz \$2x \+ 3 = 11\$ \(rešitev: \$x = 4\$\)/);
  assert.match(t("x = 4"), /\$x = 4\$ je pravilna rešitev enačbe \$2x \+ 3 = 11\$/);
  assert.match(t("2x = 8", "Odštej 3. Kaj dobiš?"), /korak \$2x = 8\$ je pravilen/);
  assert.match(t("2 · 3 = 7"), /\$2 \\cdot 3 = 7\$ ne drži, ker je \$2 \\cdot 3 = 6\$/);
  // brez ugotovitve: splošna opomba o sodbi
  assert.match(checkNoteFor(null, "sl", { verdict: true }), /Ta ocena tvojega koraka morda ni pravilna/);
});

test("opombe v vseh živih jezikih, pomožni zapisi", () => {
  const facts = [
    { kind: "calc", wrong: "7 \\cdot 8 = 54", right: "7 \\cdot 8 = 56" },
    { kind: "calc", wrong: "7 \\cdot 8 = 54" },
    { kind: "value", wrong: "x = 5", eq: "2x + 3 = 11", right: "x = 4" },
    { kind: "value", wrong: "x = 5", sys: true, eq: "x + y = 3", right: "x = 1" },
    { kind: "value", wrong: "x = 5", right: "x = 4" },
    { kind: "step", wrong: "2x = 7", eq: "2x + 3 = 11", right: "x = 4" },
    { kind: "deriv", wrong: "f'(x) = 2x", fn: "f(x) = x^3", right: "f'(x) = 3x^2" },
    { kind: "rightValue", stmt: "x = 4", eq: "2x + 3 = 11" },
    { kind: "rightCalc", stmt: "56", eq: "7 \\cdot 8 = 56" },
    { kind: "rightStep", stmt: "2x = 8", eq: "2x + 3 = 11", right: "x = 4" },
  ];
  for (const lang of LIVE_UI_LANGUAGES) {
    for (const f of facts) {
      const t = factText(f, lang);
      assert.ok(t && !/\{\w+\}/.test(t) && t.includes("$"), `${lang} ${f.kind}: ${t}`);
    }
    assert.ok(factText(facts[0], lang, { soft: true }));
  }
  // nepopolni ali predolgi zapisi → splošna opomba (null)
  assert.equal(factText({ kind: "calc", wrong: "x".repeat(200) }), null);
  assert.equal(factText({ kind: "calc", wrong: "\\frac{1}{2" }), null);
  assert.equal(factText({ kind: "value", wrong: "x = 5", eq: "2x = 1" }), null);
  assert.equal(plainToTex("x ≈ 0,7 · 2"), "x \\approx 0{,}7 \\cdot 2");
  assert.equal(plainToTex("2*x+3 = 11"), "2x+3 = 11");
  assert.equal(calcToTex("x^2-5*x+6=0"), "x^2 - 5x + 6 = 0");
  assert.equal(calcToTex("log(x,2)=3"), null);
  assert.deepEqual(numTex(56), { rel: "=", tex: "56" });
  assert.deepEqual(numTex(1 / 3), { rel: "\\approx", tex: "0{,}333333" });
  assert.equal(numTex(Infinity), null);
});

test("časovna meja: nova koda na 60 000 znakih pod 200 ms", () => {
  const ms = (fn) => {
    const s = performance.now();
    fn();
    return performance.now() - s;
  };
  const many = R`Izračunajmo: $7 \cdot 8 = 54$.` + "\n";
  const long = many.repeat(Math.ceil(60000 / many.length)).slice(0, 60000);
  const pre = presolve("Koliko je 7 krat 8 plus 2?");
  // checkArithmetic sam je kot na main; nova je le ugotovitev prvega neujemanja in opomba
  const f = codeFindings(long, pre, "");
  assert.ok(f.fact);
  assert.ok(ms(() => checkNoteFor(f.fact)) < 200);
  for (const q of [" ".repeat(60000) + "?", "7 · 8 = 54" + " ,ne".repeat(15000) + "?", "1".repeat(59999) + "?"]) {
    assert.ok(ms(() => stepVerdict(q, { prevTutor: R`Koliko je $7 \cdot 8$?` + " ".repeat(60000) })) < 200, q.slice(0, 20));
  }
  const prev = "Koliko je " + "1 + ".repeat(15000) + "1?";
  assert.ok(ms(() => stepVerdict("54?", { prevTutor: prev })) < 200);
  const blk = "Rešitev je $x = 5$.\n".repeat(3000) + "<<RACUN\nresi: 2*x+3=11 | x | 4\n>>";
  assert.ok(ms(() => visibleFinding(blk, parseClaims(blk))) < 200);
  assert.ok(ms(() => factText({ kind: "calc", wrong: "{".repeat(60000) })) < 200);
  assert.ok(ms(() => plainToTex("1,1 ".repeat(15000))) < 200);
  assert.ok(ms(() => calcToTex("1*".repeat(30000))) < 200);
});

test("AUDIT-059: končni rezultat na »Kaj dobiš na koncu?«, potrditev s ponovljeno vrednostjo, zavrnitev pravilnega", () => {
  const T = presolve(R`Izračunaj $9 \cdot 7 - 3$.`, { first: true, narrow: false });
  const E = presolve("Reši enačbo $3x + 7 = 22$.", { first: true, narrow: false });
  const fin = stepVerdict("mogoče 54?", { pre: T, prevTutor: "Kaj dobiš na koncu?" });
  assert.equal(fin?.wrong, true);
  assert.equal(verdictIgnored("Bravo!", fin), true);
  assert.equal(verdictIgnored("Ne, preveri še enkrat.", fin), false);
  assert.match(checkNoteFor(fin.fact), /\$9 \\cdot 7 - 3 = 54\$ ne drži, ker je \$9 \\cdot 7 - 3 = 60\$/);
  assert.notEqual(stepVerdict("mogoče 60?", { pre: T, prevTutor: "Kaj dobiš na koncu?" })?.wrong, true);
  const six = stepVerdict("x = 6?", { pre: E, prevTutor: "Koliko je $x$?" });
  for (const a of [R`Da, $x = 6$ je pravilno.`, "Ja, 6 drži!"]) assert.equal(verdictIgnored(a, six), true, a);
  for (const a of [R`Da, $x = 5$ je pravilno.`, R`Ne, $x = 6$ ne da 22.`, R`Skoraj. Vstavi $x = 6$.`, R`Dobro razmišljaš, a $x = 6$ ne drži.`]) assert.equal(verdictIgnored(a, six), false, a);
  const five = stepVerdict("x = 5?", { pre: E, prevTutor: "Koliko je $x$?" });
  assert.equal(five.wrong, false);
  for (const a of ["Ne, to ni prav.", "Žal ne.", "Narobe!"]) assert.equal(verdictIgnored(a, five), true, a);
  for (const a of [R`Ne, $x = 5$ je pravilno!`, R`Hmm, $22 - 7 = 15$, torej $x = 5$.`, "Da!", "Ne pozabi na preizkus."]) assert.equal(verdictIgnored(a, five), false, a);
  assert.match(checkNoteFor(five.fact, "sl", { verdict: true }), /\$x = 5\$ je pravilna rešitev enačbe \$3x \+ 7 = 22\$/);
});

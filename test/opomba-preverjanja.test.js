// Opomba brez modela (AUDIT-059, 060, 066; dokončanje pred pilotom): ugotovitve kode (fact) in besedilo opombe.
// Celotni primeri v klepetu (meja porabe, napaka klica, »OK« modela, prost proračun) so v test/popravek-ob-meji.test.js.
import test from "node:test";
import assert from "node:assert/strict";
import { checkNoteFor, factText } from "../server/opomba-preverjanja.js";
import { codeFindings, presolve, isClaim } from "../server/live-check.js";
import { stepVerdict, verdictIgnored, verdictNoteSafe } from "../server/sodba-koraka.js";
import { visibleFinding, parseClaims } from "../server/racun.js";
import { calcFact, calcToTex, plainToTex, numTex, noteLine, valueTex } from "../server/besedilo-trditev.js";
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

test("AUDIT-059: »Kaj dobiš na koncu?« brez sodbe, potrditev s ponovljeno vrednostjo, zavrnitev pravilnega", () => {
  const T = presolve(R`Izračunaj $9 \cdot 7 - 3$.`, { first: true, narrow: false });
  const E = presolve("Reši enačbo $3x + 7 = 22$.", { first: true, narrow: false });
  // pregled B (7f565d941): golo število na vprašanje brez računa (»Kaj dobiš na koncu?«) koda ne sodi (kot main)
  assert.equal(stepVerdict("mogoče 54?", { pre: T, prevTutor: "Kaj dobiš na koncu?" }), null);
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

// Pregled B (7f565d941): lažni alarmi, ki jih main nima. Brez sodbe in brez opombe.
const B_ASKED = [
  [R`Izračunaj $7 \cdot 8 + 2$.`, R`Odlično! Zdaj pa reši še $x + 3 = 5$. Kaj dobiš na koncu?`, "2?", "Da, 2."],
  [R`Izračunaj $7 \cdot 8 + 2$.`, R`Zdaj pa še nova vaja: $3 \cdot 4 + 1$. Kaj je končni rezultat?`, "13?", "Da."],
  [R`Izračunaj $7 \cdot 8 + 2$.`, "Kaj pa če bi namesto 2 prišteli 5? Kaj dobiš na koncu?", "61?", "Da."],
  [R`Izračunaj $7 \cdot 8 + 2$.`, "Kaj dobiš na koncu, če namesto 8 vzameš 9?", "65?", "Da."],
  [R`Izračunaj $(7 \cdot 8 + 2) \cdot 2$.`, "Koliko je vsebina oklepaja na koncu?", "58?", "Da."],
  [R`Izračunaj $7 \cdot 8 + 2$.`, R`Koliko je $45° + 45°$?`, "90?", "Da."],
  [R`Izračunaj $7 \cdot 8 + 2$.`, R`Koliko je $90° : 2$?`, "45?", "Da."],
  [R`Izračunaj $7 \cdot 8 + 2$.`, R`Koliko je $360° : 6$?`, "60?", "Da."],
  [R`Izračunaj $7 \cdot 8 + 2$.`, R`Koliko je $180° - 50°$?`, "130?", "Da."],
  [R`Izračunaj $7 \cdot 8 + 2$.`, R`Koliko je $10 : 3$?`, "3?", "Da, 3."],
  [R`Izračunaj $7 \cdot 8 + 2$.`, R`Deljenje z ostankom. Koliko je $10 : 3$?`, "3,33?", "Ne."],
  [R`Izračunaj $7 \cdot 8 + 2$.`, "Koliko je 10 : 4?", "2?", "Da."],
];
export const B_TEXTS = {
  soft: [R`Ali veš, da je $\frac{1}{3} = 0{,}(3)$?`, R`Če zapišemo periodično, je $\frac{1}{9} = 0{,}(1)$.`, R`Ali je $1.000 + 1 = 1.001$?`],
  hard: [R`Torej je $\frac{1}{3} = 0{,}(3)$.`, R`$\frac{1}{7} = 0{,}(142857)$`, R`$\frac{1}{6} = 0{,}1(6)$`, R`$2.500 + 500 = 3.000$`, R`Skupaj: $1.200 + 300 = 1.500$ €.`, R`$\frac{1}{3} = 0{,}\overline{3}$`, R`$\frac{1}{3} = 0{,}\dot{3}$`],
};
test("pregled B: »na koncu« po novi vaji, stopinje in deljenje z ostankom brez sodbe vprašanja-predloga", () => {
  for (const [task, prev, q, a] of B_ASKED) {
    const v = stepVerdict(q, { pre: presolve(task, { first: true, narrow: false }), prevTutor: prev });
    assert.ok(!v || !verdictIgnored(a, v), `${prev} ${q}: ${v?.finding}`);
    assert.notEqual(v?.wrong, true, `${prev} ${q}`);
  }
  // celo deljenje ostane: »Koliko je $10 : 2$?« → »4?« je napaka, »5?« pravilno (zaokroženo z »≈«)
  assert.equal(stepVerdict("4?", { prevTutor: R`Koliko je $10 : 2$?` })?.wrong, true);
  // zaokrožen rezultat ni sodba (pregled A): »0,33?« na $1/3$, »6,28?« na $2 \cdot \pi$, »3,33?« na $10 : 3$; točen da
  for (const [prev, q] of [[R`Koliko je $\sqrt{2} + 0$?`, "1,41?"], [R`Koliko je $1/3$?`, "0,33?"], [R`Koliko je $2 \cdot \pi$?`, "6,28?"], [R`Koliko je $\pi \cdot 2$?`, "6,28?"], [R`Koliko je $10 : 3$?`, "3,33?"], [R`Koliko je $2 : 3$?`, "0,67?"]]) {
    assert.equal(stepVerdict(q, { prevTutor: prev }), null, `${prev} ${q}`);
  }
  assert.equal(stepVerdict("2,25?", { prevTutor: R`Koliko je $1{,}5 \cdot 1{,}5$?` }).fact.eq, R`1{,}5 \cdot 1{,}5 = 2{,}25`);
});
test("pregled B: periodični zapis in pika za tisočice nista ugotovitev kode", () => {
  for (const a of [...B_TEXTS.soft, ...B_TEXTS.hard]) assert.equal(codeFindings(a, null, "").issue, null, a);
  assert.ok(codeFindings(R`Torej $7 \cdot 8 = 54$.`, null, "").issue);
  assert.ok(codeFindings(R`Torej $2{,}5 + 0{,}5 = 4$.`, null, "").issue);
});

// Pregled A (7f565d941): lažni alarmi main pri pravilnih odgovorih. Ugotovitev za popravek ostane (kot main), opombe
// brez modela ni (fact null); nikoli besedilni zapis računa ali decimalna pika.
export const A_VALUE = [
  [R`Reši enačbo $x^2 - 6x + 5 = 0$.`, R`Rešitvi sta $x_1 = 1$ in $x_2 = 5$. Simetrala parabole je premica $x = 3$.`],
  [R`Reši enačbo $5x = 100$.`, R`$x = 20$ (to je $x = 0{,}2$ m).`],
  [R`Reši enačbo $x - 2 = 0$ v cm.`, R`Rešitev: $x = 2$ cm, kar je $x = 20$ mm.`],
  [R`Reši enačbo $4x + 2 = 18$.`, R`Pomagaj si z obratnimi operacijami. Npr. pri $x + 3 = 5$ odšteješ 3 in dobiš $x = 2$. Kaj narediš pri svoji enačbi najprej?`],
  [R`Reši enačbo $3x - 4 = 11$.`, R`Poglejmo na podobnem primeru: iz $2x = 6$ sledi $x = 3$. Zdaj poskusi sam: kaj je prvi korak pri $3x - 4 = 11$?`],
  [R`Reši enačbo $6x = 42$.`, R`Pomisli, katero število pomnoženo s 6 da 42. Ugani in preveri – na primer za $x = 6$ dobiš $36$, kar je premalo.`],
  [R`Reši enačbo $2x - 1 = 5$.`, R`$2x = 6$, $x = 3$. Za vajo: reši še $2x - 1 = 7$ (rešitev $x = 4$).`],
  [R`Reši enačbo $2x + 4 = 10$.`, R`$x = 3$. Pogosta napaka je $x = 7$ (ko pozabiš deliti z 2).`],
  [R`Reši enačbo $3x = 12$.`, R`$x = 4$. Zdaj ti: reši $3x = 15$. (Namig: $x = 5$.)`],
  [R`Reši enačbo $x^3 - x = 0$.`, R`$x(x^2 - 1) = 0$: $x = 0$, $x = 1$, $x = -1$. Lokalni ekstrem pri $x = \frac{1}{\sqrt{3}}$.`],
  [R`Reši enačbo $x^2 - 2x - 3 = 0$.`, R`$(x - 3)(x + 1) = 0$, rešitvi $x_1 = 3$, $x_2 = -1$. Teme parabole je pri $x = 1$, kar je ravno sredina med ničlama.`],
  [R`Reši enačbo $x^2 - 4 = 0$.`, R`Rešitvi sta $x = 2$ in $x = -2$; za $x = 0$ je vrednost $-4$.`],
  [R`Reši enačbo $x^2 - 1 = 0$.`, R`Rešitvi sta $x = 1$ in $x = -1$. Graf $y = x^2 - 1$ ima teme v točki, kjer je $x = 0$.`],
  [R`Reši enačbo $x^2 - 9 = 0$.`, R`$x = \pm 3$. Za $x = 0$ dobimo $-9$.`],
  [R`Reši enačbo $x^2 - 5x + 6 = 0$.`, R`Rešitvi: $x = 2$, $x = 3$. Teme je pri $x = 2{,}5$.`],
  [R`Reši enačbo $\frac{x}{x - 1} = 2$.`, R`$x = 2$. Navpična asimptota je $x = 1$.`],
  [R`Reši enačbo $x + 5 = 9$.`, R`$x = 4$. Graf: premica $y = x + 5$ seka os y pri $x = 0$.`],
];
test("pregled A: vrednost pri temenu, osi, zgledu, vaji, enoti ali ob vseh pravih rešitvah brez opombe", () => {
  for (const [q, a] of A_VALUE) {
    const f = codeFindings(a, presolve(q), q);
    assert.ok(!f.soft, a);
    assert.equal(f.fact ?? null, null, `${a}: ${JSON.stringify(f.fact)}`);
  }
  // ura: račun ostane ugotovitev, opombe ni
  const ura = codeFindings(R`$23 + 3 = 2$ (ura po polnoči).`, null, "Ura?");
  assert.ok(ura.issue);
  assert.equal(ura.fact, null);
  // prava napaka ostane s konkretno opombo, z decimalno vejico
  const v = codeFindings(R`$5x = 1$, torej $x = 2.5$.`, presolve(R`Reši enačbo $5x = 1$.`), "");
  assert.match(checkNoteFor(v.fact), /\$x = 2\{,\}5\$ ni rešitev/);
  assert.match(checkNoteFor(codeFindings(R`$2x = 8$, torej $x = 5$.`, presolve(R`Reši enačbo $2x + 3 = 11$.`), "").fact), /\$x = 5\$ ni rešitev enačbe \$2x \+ 3 = 11\$/);
  assert.match(checkNoteFor(codeFindings(R`$v = g t = 10 \cdot 3 = 13\,\mathrm{m/s}$`, null, "").fact), /Opomba: \$10 \\cdot 3 = 13\\,\\mathrm\{m\/s\}\$ ne drži/);
  // besedilni zapis računa nikoli v opombi; decimalna pika → vejica (razen v angleščini)
  assert.equal(valueTex("((1)/(sqrt(3)))"), null);
  assert.equal(valueTex(R`\frac{1}{\sqrt{3}}`), R`\frac{1}{\sqrt{3}}`);
  assert.equal(valueTex(" 0.2 "), "0{,}2");
  assert.doesNotMatch(checkNoteFor({ kind: "value", wrong: "x = ((1)/(sqrt(3)))", eq: "x^3 - x = 0", right: "x = 0" }), /sqrt\(/);
  assert.match(checkNoteFor({ kind: "value", wrong: "x = 0.2", eq: "5x = 100", right: "x = 20" }), /\$x = 0\{,\}2\$/);
  assert.match(checkNoteFor({ kind: "value", wrong: "x = 0.2", eq: "5x = 100", right: "x = 20" }, "en"), /\$x = 0\.2\$/);
  for (const l of ["Teme je pri $x = 1$.", "Rešitev: $x = 2$ cm", "Za vajo: $x = 4$", "$x = 3$ (ura)"]) assert.equal(noteLine(l), false, l);
  assert.equal(noteLine(R`$v = 10 \cdot 3 = 13\,\mathrm{m/s}$`, { value: false }), true);
  assert.equal(noteLine("Torej je $x = 5$."), true);
});

test("pregled A: 059 golo število le proti vprašanju z računom, zaokroženo in ostanek brez sodbe", () => {
  const A1 = R`Izračunaj $(12 - 4) \cdot 3$.`;
  const A2 = R`Izračunaj $(12 - 4) \cdot 3 + 5$.`;
  const T1 = R`Izračunaj $7 \cdot 8 + 2$.`;
  const cases = [
    [A1, "Super. Koliko dobiš na koncu za oklepaj?", "8?", "Da, 8. Zdaj pomnoži s 3."],
    [A1, "Najprej izračunaj oklepaj. Koliko dobiš na koncu za oklepaj?", "8?", "Da, 8."],
    [A2, "Prvi korak je oklepaj, drugi množenje. Kaj dobiš na koncu drugega koraka?", "24?", "Da, pravilno! Zdaj še prištej 5."],
    [A1, "Kaj dobiš na koncu drugega koraka?", "8?", "Da, 8."],
    [T1, R`Koliko je $1/3$?`, "0,33?", R`Ne. Pusti ulomek: $\frac{1}{3}$.`],
    [T1, R`Koliko je $2 \cdot \pi$?`, "6,28?", R`Ne. Pusti kar $2\pi$.`],
    [T1, R`Koliko je $10 : 3$?`, "3,33?", "Ne."],
    [T1, R`Koliko je $10 : 3$?`, "3?", "Da, 3. Ostanek je 1."],
    [T1, R`Koliko je $10 : 3$?`, "3?", "Da, 3 in ostanek 1."],
    [T1, R`Koliko je $\sqrt{50}$?`, "7,07?", R`Ne. Delno koreni: $5\sqrt{2}$.`],
    [T1, R`Koliko je $7 \cdot 8$?`, "58?", "Ne."], // vmesni korak: 58 ni odgovor na $7 \cdot 8$, »Ne.« je prav
    // golo število proti nalogi in zaokrožena decimalka: sodba kot main, zavrnitev pa ni prezrta (noReject)
    [T1, "Kaj pa če bi namesto 2 prišteli 5? Kaj dobiš na koncu?", "58?", "Ne."],
    [T1, "Kaj dobiš na koncu?", "58?", "Ne."],
    [R`Izračunaj $\frac{1}{3} + \frac{1}{6}$.`, "Kakšen je končni rezultat? Zapiši ga kot ulomek.", "0,5?", "Ne, kot ulomek, prosim."],
  ];
  for (const [task, prev, q, a] of cases) {
    const v = stepVerdict(q, { pre: presolve(task, { first: true, narrow: false }), prevTutor: prev });
    assert.ok(!v || !verdictIgnored(a, v), `${prev} ${q} → ${a}: ${v?.finding}`);
    if (v && !v.wrong) assert.equal(v.noReject, true, `${prev} ${q}: zavrnitev ni prezrta, brez opombe »je pravilen«`);
  }
});

test("pregled A: opomba ob prezrti sodbi le ob izrecni potrditvi napačnega koraka", () => {
  const T = R`Reši enačbo $3x + 7 = 22$.`;
  const v = stepVerdict("x = 6", { pre: presolve(T), prevTutor: R`Koliko je $x$?` });
  assert.equal(v?.wrong, true);
  assert.equal(verdictNoteSafe(R`Ne. $3 \cdot 6 + 7 = 25$, ne 22.`, v), false);
  assert.equal(verdictNoteSafe("Odlično, $x = 6$ je pravilno.", v), true);
  const v5 = stepVerdict("x = 5", { pre: presolve(R`Reši enačbo $2x + 3 = 11$.`), prevTutor: "Kaj dobiš za x?" });
  assert.equal(verdictNoteSafe(R`Napisal si $x = 5$. Vstavi v enačbo: $2 \cdot 5 + 3 = 13$, kar ni 11. Poskusi znova.`, v5), false);
  assert.equal(verdictNoteSafe("Da, pravilno!", v5), true);
});


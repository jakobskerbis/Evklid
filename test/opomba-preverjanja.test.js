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
  const many = R`Torej $7 \cdot 8 = 54$.` + "\n";
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

// Pregled B (018af7ab6), rt3/h3 t7 in t8: pravilne razlage z označenim napačnim zapisom, drugim sistemom, izbirnimi
// odgovori … Nobena trdna opomba brez modela (ugotovitev za popravek ostane kot na main).
export const B_T78 = ["Pogosta napaka je $2^3 = 6$.",
  "Pogosto vidim $2^3 = 6$. Pravilno: $2^3 = 8$.",
  "Pogosto učenci zapišejo $2^3 = 6$. Ali vidiš, zakaj ne drži?",
  "Mnogi zamenjajo potenco z množenjem: $2^3 = 6$. Prav je $2^3 = 8$.",
  "Mnogi zamenjajo potenco z množenjem: $2^3 = 6$. Ali vidiš razliko? $2^3 = 8$.",
  "Kaj je narobe tukaj? $2^3 = 6$",
  "Kaj je narobe tukaj: $2^3 = 6$? Potenca ni množenje.",
  "Je $2^3 = 6$? Ne, $2^3 = 8$.",
  "Ali je $2^3 = 6$? Ne.",
  "Zakaj ni $2^3 = 6$? Ker potenca pomeni množenje osnove.",
  "Zakaj ne $2^3 = 6$? Ker potenca pomeni množenje osnove.",
  "Zakaj $2^3 \\neq 6$? Ker …",
  "Zamenjati $2^3 = 6$ in $2 \\cdot 3 = 6$ je lahko. Prvo ne drži.",
  "Primerjaj $2 \\cdot 3 = 6$ in $2^3 = 8$. Kaj opaziš?",
  "Vprašanje zate: koliko je $2^3$? Ni $6$! $2^3 = 8$.",
  "Recimo, da bi kdo napisal $2^3 = 6$.",
  "Npr. $2^3 = 6$ je tipična zamenjava.",
  "Npr. zapis $2^3 = 6$ je tipična zamenjava.",
  "Zapis $2^3 = 6$ je tipična zamenjava.",
  "Zapis $2^3 = 6$ je zmota.",
  "Tole ne drži: $2^3 = 6$.",
  "Tole ne velja: $2^3 = 6$.",
  "Ta vrstica je napačna: $7 \\cdot 8 = 54$.",
  "✗ $7 \\cdot 8 = 54$\n✓ $7 \\cdot 8 = 56$",
  "❌ $7 \\cdot 8 = 54$\n✅ $7 \\cdot 8 = 56$",
  "~~$7 \\cdot 8 = 54$~~ $7 \\cdot 8 = 56$",
  "Ne $7 \\cdot 8 = 54$, temveč $7 \\cdot 8 = 56$.",
  "Ne: $7 \\cdot 8 = 54$. Da: $7 \\cdot 8 = 56$.",
  "Namesto $7 \\cdot 8 = 54$ pišemo $7 \\cdot 8 = 56$.",
  "| Napačno | Pravilno |\n|---|---|\n| $7 \\cdot 8 = 54$ | $7 \\cdot 8 = 56$ |",
  "Napačno: $7 \\cdot 8 = 54$\nPravilno: $7 \\cdot 8 = 56$",
  "Kje je napaka? $7 \\cdot 8 = 54$",
  "Najdi napako: $7 \\cdot 8 = 54$.",
  "Poišči napako v računu $7 \\cdot 8 = 54$.",
  "Kje se je zalomilo pri $7 \\cdot 8 = 54$?",
  "Pri $7 \\cdot 8 = 54$ se je zalomilo.",
  "Se ti zdi $7 \\cdot 8 = 54$ prav? Preveri.",
  "Se ti zdi $7 \\cdot 8 = 54$ prav. Preveri.",
  "Zdi se, da je $7 \\cdot 8 = 54$. Preverimo.",
  "Napisala si $7 \\cdot 8 = 54$. Preveri še enkrat.",
  "Zapišeš $7 \\cdot 8 = 54$. Poglejva še enkrat.",
  "Si zapisal $7 \\cdot 8 = 54$? Poglejva.",
  "V tvojem računu stoji $7 \\cdot 8 = 54$.",
  "Pri tebi piše $7 \\cdot 8 = 54$.",
  "Piše $7 \\cdot 8 = 54$. Ni čisto prav.",
  "Na listu je $7 \\cdot 8 = 54$.",
  "Na sliki vidim $7 \\cdot 8 = 54$.",
  "Na fotografiji je $7 \\cdot 8 = 54$.",
  "V nalogi piše $7 \\cdot 8 = 54$, kar ni res.",
  "V nalogi piše $7 \\cdot 8 = 54$ — to ni res.",
  "»$7 \\cdot 8 = 54$« — to ni res.",
  "Trditev $7 \\cdot 8 = 54$ je neresnična.",
  "Trditev $7 \\cdot 8 = 54$ je lažna.",
  "Trditev »$7 \\cdot 8 = 54$« je napačna.",
  "Trditev »$7 \\cdot 8 = 54$« ne drži.",
  "Izjava $7 \\cdot 8 = 54$ je neresnična.",
  "$7 \\cdot 8 = 54$ je neresnična izjava.",
  "$7 \\cdot 8 = 54$? Ne!",
  "$7 \\cdot 8 = 54$? Ne, $56$.",
  "$7 \\cdot 8 = 54$ ali $56$?",
  "Je $7 \\cdot 8$ enako $54$ ali $56$? $7 \\cdot 8 = 56$.",
  "Kaj dobimo, če zamenjamo vrstni red? $7 \\cdot 8 = 8 \\cdot 7 = 56$.",
  "Če bi množil narobe, $7 \\cdot 8 = 54$.",
  "Če narobe množiš, $7 \\cdot 8 = 54$.",
  "Če narobe množiš: $7 \\cdot 8 = 54$.",
  "Če množiš narobe, pride $7 \\cdot 8 = 54$.",
  "Kdor množi narobe, dobi $7 \\cdot 8 = 54$.",
  "Kdor množi narobe, ima $7 \\cdot 8 = 54$.",
  "Kdor množi narobe, pride do $7 \\cdot 8 = 54$.",
  "If you multiply wrongly: $7 \\cdot 8 = 54$.",
  "A typical slip: $7 \\cdot 8 = 54$.",
  "A typical slip is $7 \\cdot 8 = 54$; correct is $56$.",
  "Students often write $7 \\cdot 8 = 54$. It should be $56$.",
  "Don't write $7 \\cdot 8 = 54$.",
  "Never write $7 \\cdot 8 = 54$.",
  "Nikoli ne piši $7 \\cdot 8 = 54$.",
  "Ne piši $7 \\cdot 8 = 54$.",
  "Ne zapiši $7 \\cdot 8 = 54$.",
  "Izogibaj se zapisu $7 \\cdot 8 = 54$.",
  "Ali res velja $7 \\cdot 8 = 54$? Ne.",
  "Velja ali ne velja $7 \\cdot 8 = 54$? Ne velja.",
  "Kaj pa $7 \\cdot 8 = 54$? To ne gre.",
  "Kaj pa $7 \\cdot 8 = 54$. To ne gre.",
  "Preverimo $7 \\cdot 8 = 54$: ne, $56$.",
  "Rezultat $7 \\cdot 8 = 54$ ne more biti, ker je produkt dveh števil ...",
  "Če pa zamenjaš $+$ in $\\cdot$, je $2 + 3 \\cdot 4 = 20$ – to se zgodi, ko ne upoštevaš vrstnega reda.",
  "Kaj dobiš, če pozabiš na oklepaj?\n\n$2 + 3 \\cdot 4 = 20$",
  "Kaj dobiš, če pozabiš na oklepaj?\n$2 + 3 \\cdot 4 = 20$ – narobe!",
  "Ko pozabiš na vrstni red, dobiš $2 + 3 \\cdot 4 = 20$.",
  "Ko pozabiš na vrstni red: $2 + 3 \\cdot 4 = 20$.",
  "Brez upoštevanja vrstnega reda: $2 + 3 \\cdot 4 = 20$.",
  "Od leve proti desni: $2 + 3 \\cdot 4 = 20$. Pravilno: $14$.",
  "Od leve proti desni bi bilo $2 + 3 \\cdot 4 = 20$.",
  "Kalkulator brez prednosti pokaže $2 + 3 \\cdot 4 = 20$.",
  "Kalkulator brez prednosti računskih operacij pokaže 20 pri $2 + 3 \\cdot 4$.",
  "Pravilno: $(2 + 3) \\cdot 4 = 20$ in $2 + 3 \\cdot 4 = 14$.",
  "Velja $0{,}1 + 0{,}2 = 0{,}3$.",
  "Velja $\\frac{1}{3} \\approx 0{,}33$.",
  "Velja $\\frac{1}{3} = 0{,}33$.",
  "Velja $\\frac{1}{3} = 0{,}\\overline{3}$.",
  "Velja $\\frac{2}{3} = 0{,}67$.",
  "Velja $\\pi = 3{,}14$.",
  "Velja $\\sqrt{2} = 1{,}414$.",
  "Velja $\\sqrt 2 = 1{,}41$.",
  "Ploščina: $3{,}14 \\cdot 2^2 = 12{,}56\\,\\text{cm}^2$.",
  "$S = \\pi r^2 = 3{,}14 \\cdot 4 = 12{,}56$",
  "$S = \\pi \\cdot 4 = 12{,}57$",
  "$S = \\pi \\cdot 4 = 12{,}56$",
  "$S = \\pi \\cdot 4 \\approx 12{,}57$",
  "$1\\,\\text{h} = 60\\,\\text{min}$",
  "$1 \\text{ km} = 1000 \\text{ m}$",
  "$2{,}5\\,\\text{m} = 250\\,\\text{cm}$",
  "$20 \\% \\text{ od } 50 = 10$",
  "$20\\,\\% \\cdot 50 = 10$",
  "$50 \\cdot 1{,}2 = 60$ (povečanje za $20\\,\\%$)",
  "$100\\% + 20\\% = 120\\%$",
  "$3 \\tfrac{1}{3} = \\frac{10}{3}$",
  "$3\\frac{1}{3} = \\frac{10}{3}$",
  "$2\\frac12 \\cdot 2 = 5$",
  "$5! = 120$",
  "$10^{-3} = 0{,}001$",
  "$2^{10} = 1024$",
  "$2^{10} = 1\\,024$",
  "$2^{10} = 1.024$",
  "$1000 \\cdot 1000 = 1\\,000\\,000$",
  "$1000 \\cdot 1000 = 10^6$",
  "$\\lim_{x \\to \\infty} \\frac{1}{x} = 0$",
  "$\\frac{x^2 - 1}{x - 1} = x + 1$",
  "Asimptota: $y = 0$, ker $\\frac{1}{x} \\to 0$.",
  "$x > 3$, torej $2x > 6$.",
  "$|-3| = 3$",
  "$-3^2 = -9$",
  "$(-3)^2 = 9$",
  "$\\sqrt{9} = \\pm 3$ ni prav, $\\sqrt{9} = 3$.",
  "$\\sqrt{9} = 3$",
  "$8^{1/3} = 2$",
  "$0{,}\\overline{9} = 1$",
  "$1 - 0{,}999 = 0{,}001$",
  "$\\log_2 8 = 3$",
  "$\\binom{5}{2} = 10$",
  "$6 : 2(1+2) = 9$",
  "$6 / 2 \\cdot 3 = 9$",
  "$7 \\cdot 8 = 56$, kar ni $54$.",
  "Če najprej množimo: $7 \\cdot 8 = 54$.",
  "Mnogi pišejo $2^3 = 6$. Zakaj to ne gre?",
  "Mnogi pišejo $2^3 = 6$. Vidiš, kje je zanka?",
  "Pogosto vidim $2^3 = 6$. Kje je past?",
  "Pogosto vidim $2^3 = 6$. Ali veš zakaj?",
  "Klasična past: $2^3 = 6$. Ali jo prepoznaš?",
  "Klasična past: $2^3 = 6$. Prepoznaš?",
  "Past: $2^3 = 6$ (osnova krat eksponent). Pravilno: $2 \\cdot 2 \\cdot 2 = 8$.",
  "Zamenjava: $2^3 = 6$. Pravilno: $8$.",
  "Tipična zamenjava je $2^3 = 6$, pravilno je $8$.",
  "Tipično: $2^3 = 6$ namesto $8$.",
  "$2^3 = 6$ namesto $8$ je tipično.",
  "Pazi na past $2^3 = 6$. Ali vidiš, zakaj?",
  "Kot primer zamenjave: $2^3 = 6$. Opaziš razliko? Prava vrednost je $8$.",
  "Sošolec je trdil, da $7 \\cdot 8 = 54$. Kdo ima prav?",
  "Sošolec trdi $7 \\cdot 8 = 54$. Ali ima prav?",
  "Sošolec trdi: $7 \\cdot 8 = 54$. Ima prav?",
  "Učitelj je na tablo napisal $7 \\cdot 8 = 54$. Je to res?",
  "Na tabli piše $7 \\cdot 8 = 54$. Je to res?",
  "Recimo, da v nalogi piše $7 \\cdot 8 = 54$. Je to res?",
  "V knjigi je tiskarska napaka $7 \\cdot 8 = 54$.",
  "Miha trdi: $7 \\cdot 8 = 54$. Kaj praviš?",
  "Miha je izračunal $7 \\cdot 8 = 54$. Kaj praviš?",
  "Miha meni: $7 \\cdot 8 = 54$. Ali ima prav? Ne: $7 \\cdot 8 = 56$.",
  "Miha meni, da je $7 \\cdot 8 = 54$. Ne drži: $56$.",
  "Ana pravi, da $7 \\cdot 8 = 54$. Ali se strinjaš?",
  "Ana pravi, da $7 \\cdot 8 = 54$. Se strinjaš?",
  "Ana: »$7 \\cdot 8 = 54$.« Se strinjaš?",
  "Kateri račun je pravilen: $7 \\cdot 8 = 54$ ali $7 \\cdot 8 = 56$?",
  "Kateri račun je pravilen? $7 \\cdot 8 = 54$ ali $7 \\cdot 8 = 56$",
  "Izberi pravilnega: $7 \\cdot 8 = 54$ ali $7 \\cdot 8 = 56$.",
  "Izberi pravilnega: (a) $7 \\cdot 8 = 54$ (b) $7 \\cdot 8 = 56$",
  "A) $7 \\cdot 8 = 54$\nB) $7 \\cdot 8 = 56$\nKateri je pravilen?",
  "Kateri je pravilen?\nA) $7 \\cdot 8 = 54$\nB) $7 \\cdot 8 = 56$",
  "Kviz: $7 \\cdot 8 = 54$. Drži ali ne drži?",
  "Drži ali ne drži: $7 \\cdot 8 = 54$.",
  "Res ali ni res: $7 \\cdot 8 = 54$?",
  "Res ali ni res? $7 \\cdot 8 = 54$",
  "Pravilno ali napačno? $7 \\cdot 8 = 54$",
  "True or false? $7 \\cdot 8 = 54$",
  "True or false: $7 \\cdot 8 = 54$.",
  "Is this right? $7 \\cdot 8 = 54$",
  "Is $7 \\cdot 8 = 54$ right? No, it is $56$.",
  "Check this: $7 \\cdot 8 = 54$. Does it hold?",
  "Look at $7 \\cdot 8 = 54$. Something is off. Can you see it?",
  "Poglej $7 \\cdot 8 = 54$. Nekaj ni v redu.",
  "Oglej si $7 \\cdot 8 = 54$. Nekaj ni v redu. Kaj?",
  "Oglej si $7 \\cdot 8 = 54$. Kaj ni v redu?",
  "Je tole prav: $7 \\cdot 8 = 54$? Ne.",
  "Tole: $7 \\cdot 8 = 54$. Je prav? Ne.",
  "Ugotovi, ali drži: $7 \\cdot 8 = 54$.",
  "Ugotovi, ali drži $7 \\cdot 8 = 54$.",
  "Preveri, če drži $7 \\cdot 8 = 54$.",
  "Preveri, ali velja $7 \\cdot 8 = 54$.",
  "Ocena: $7 \\cdot 8 \\approx 50$. Točno: $56$.",
  "Ocenimo: $7 \\cdot 8 = 50$ približno.",
  "Zaokroženo: $7 \\cdot 8 = 60$.",
  "Na desetice zaokroženo je $7 \\cdot 8 = 60$.",
  "Zaokrožimo na desetice: $56 \\approx 60$.",
  "Groba ocena: $49 \\cdot 21 = 50 \\cdot 20 = 1000$.",
  "Groba ocena: $49 \\cdot 21 \\approx 50 \\cdot 20 = 1000$.",
  "Ocena: $49 \\cdot 21 \\approx 1000$. Točno: $49 \\cdot 21 = 1029$.",
  "Pri dvojiškem sistemu je $1 + 1 = 10$.",
  "V dvojiškem sistemu: $1 + 1 = 10$. Zakaj?",
  "Po modulu 5: $3 + 4 = 2$.",
  "Na uri: $10 + 5 = 3$.",
  "Na uri velja $10 + 5 = 3$ (ura 15 je 3 popoldne). Vidiš?",
  "V Booleovi algebri je $1 + 1 = 1$.",
  "Ure: $45 + 30 = 75$ min, kar je $1$ h $15$ min. Ali $1{,}25$ h?",
  "Kot: $90° + 45° = 135°$. Ali ga znaš narisati?",
  "Čas: $1\\text{ h } 30\\text{ min} + 45\\text{ min} = 2\\text{ h } 15\\text{ min}$. Prav?",
  "Če pa najprej sešteješ, dobiš $(2+3) \\cdot 4 = 20$; če ne, $2 + 3 \\cdot 4 = 14$.",
  "Pri prvem: $2 + 3 = 5$; ali pri drugem $5 \\cdot 4 = 20$?"];
// Pregled A (018af7ab6), rt2/k10: pravilni odgovori z vrednostmi in računi, ki niso rezultat odgovora.
export const A_K10 = [["Koliko je 22 h + 5 h?","Ob 22h čez 5 h je $22 + 5 = 3$ zjutraj."],
  ["Kot?","$350° + 20° = 10°$ (poln kot se odšteje)."],
  ["Kot?","Smer $350^\\circ + 20^\\circ = 10^\\circ$."],
  ["Dvojiško?","V dvojiškem sistemu je $1 + 1 = 10$."],
  ["Logika?","Pri logičnem ALI je $1 + 1 = 1$."],
  ["Modulo?","V $\\mathbb{Z}_5$ velja $3 + 4 = 2$."],
  ["Modulo?","Ostanki pri deljenju s 5: $3 + 4 = 2$."],
  ["Teden?","Dan v tednu: $6 + 3 = 2$ (sobota + 3 = torek)."],
  ["Koliko je 1 + 1 v Z2?","V $\\mathbb{Z}_2$: $1 + 1 = 0$."],
  ["Odstotek?","Cena zraste za 10 % in pade za 10 %: $100 \\cdot 1{,}1 \\cdot 0{,}9 = 99$."],
  ["Pretvori.","$1 h = 60 min$, torej $2{,}5 h = 150 min$."],
  ["Pretvori.","$3 dm = 30 cm = 300 mm$."],
  ["Pretvori.","$1 \\ \\text{m}^2 = 10000 \\ \\text{cm}^2$."],
  ["Kaj je napačno?","Učenec je napisal $2 \\cdot 3^2 = 36$; prav je $2 \\cdot 3^2 = 18$."],
  ["Kaj je narobe?","V nalogi piše $5 - 2 \\cdot 2 = 6$, a prav je $1$."],
  ["Razloži.","Zapis $\\sqrt{16} = \\pm 4$ ni pravilen, ker je $\\sqrt{16} = 4$."],
  ["Razloži.","Trditev $0{,}1 + 0{,}2 = 0{,}3$ v računalniku ne drži natančno, v matematiki pa drži."],
  ["Primerjaj.","Kdo ima prav: Ana ($2^3 = 8$) ali Bor ($2^3 = 6$)? Ana."],
  ["Razloži.","Bor misli, da je $2^3 = 6$. Ana ga popravi: $2^3 = 8$."],
  ["Razloži.","Kalkulator pokaže $2/3 = 0{,}6666667$."],
  ["Razloži.","Na tri decimalke: $\\pi \\cdot 2 = 6{,}283$."],
  ["Reši enačbo $2x + 3 = 11$.","Preverimo $x = 3$: $2 \\cdot 3 + 3 = 9$, kar ni 11. Torej več."],
  ["Reši enačbo $2x + 3 = 11$.","Ali je $x = 3$? $2 \\cdot 3 + 3 = 9$, premalo. Kaj misliš, koliko je $x$?"],
  ["Reši enačbo $2x + 3 = 11$.","Odštej 3 in deli z 2. Pri $x = 1$ bi bila leva stran 5."],
  ["Reši enačbo $2x + 3 = 11$.","Začni z $x = 0$: leva stran je 3. Nato povečuj $x$, dokler ne dobiš 11."],
  ["Reši enačbo $2x + 3 = 11$.","Tabela: $x = 1 \\to 5$, $x = 2 \\to 7$, $x = 3 \\to 9$. Nadaljuj!"],
  ["Reši enačbo $x^2 - 5x + 6 = 0$.","Razcepi: $(x - 2)(x - 3) = 0$. Kateri dve števili zadoščata?"],
  ["Reši enačbo $x^2 - 5x + 6 = 0$.","Diskriminanta: $D = 25 - 24 = 1$. Torej $x = \\frac{5 \\pm 1}{2}$."],
  ["Reši enačbo $x^2 - 5x + 6 = 0$.","Ena rešitev je $x = 2$. Drugo poišči sam."],
  ["Reši enačbo $x^2 - 5x + 6 = 0$.","Vsota rešitev je 5, produkt 6. Pri $x = 1$ je izraz 2, pri $x = 4$ je 2."],
  ["Reši enačbo $x^2 - 5x + 6 = 0$.","Parabola $y = x^2 - 5x + 6$ seka abscisno os dvakrat; najnižja točka je pri $x = 2{,}5$."],
  ["Reši enačbo $x^2 = 9$.","$x = 3$ ali $x = -3$; za dolžino stranice vzamemo $x = 3$."],
  ["Reši enačbo $x^2 = 9$.","Pozitivna rešitev: $x = 3$. (Pri $x = 0$ je leva stran 0.)"],
  ["Reši enačbo $3x = 12$.","Deli s 3. Prej smo imeli $3x = 9$ in $x = 3$; zdaj je podobno."],
  ["Reši enačbo $3x = 12$.","Lani si reševal $3x = 9$, takrat je bilo $x = 3$."],
  ["Reši enačbo $3x = 12$.","Deli s 3.\nČe bi delil z 2, bi dobil $x = 6$, kar ni prav."],
  ["Reši enačbo $3x = 12$.","Deli s 3.\nNe deli z 2, sicer dobiš $x = 6$."],
  ["Reši enačbo $3x = 12$.","Deli obe strani s 3.\nKaj pa dobiš? Ali je $x = 5$? Preveri."],
  ["Reši sistem $x + y = 5$, $x - y = 1$.","Seštej enačbi. Ko dobiš $x$, vstavi.\nZačetni približek $x = 0$, $y = 0$ ne zadošča."],
  ["Reši enačbo $\\sin x = 0$ na $[0, \\pi]$.","$x = 0$ in $x = \\pi$."],
  ["Reši enačbo $x^2 - 4 = 0$.","Prestavi 4: $x^2 = 4$. Koren: $x = 2$ in $x = -2$. Graf ima ničli tam."],
  ["Reši enačbo $x^2 - 4 = 0$.","Pri $x = 1$: $1 - 4 = -3 \\neq 0$. Pri $x = 2$: $0$. Torej $x = 2$ in po simetriji $x = -2$."]];

const hardNote = (f) => !!(f.issue && !f.soft && f.fact);
test("pregleda A in B (018af7ab6): trdna opomba le ob pozitivnem znaku rezultata", () => {
  for (const a of B_T78) assert.equal(hardNote(codeFindings(a, null, "")), false, a);
  for (const [q, a] of A_K10) assert.equal(hardNote(codeFindings(a, presolve(q), q)), false, a);
  // drug številski sistem, ura, logika: nobene opombe, tudi blage ne
  for (const a of [R`V dvojiškem zapisu je $1 + 1 = 10$.`, R`V binarnem sistemu: $1 + 1 = 10$.`, R`Po modulu $5$ je $3 + 4 = 2$.`, R`V $\mathbb{Z}_5$ je $3 + 4 = 2$.`, R`V $\mathbb{Z}_2$: $1 + 1 = 0$.`, R`Logično ALI: $1 + 1 = 1$.`, R`Ob 22h čez 5 h je $22 + 5 = 3$ zjutraj.`, R`Dan v tednu: $6 + 3 = 2$.`, R`V dvojiškem sistemu: $1 + 1 = 10$. Zakaj?`, R`Če je ura 23, čez 3 ure na uri piše $23 + 3 = 2$?`]) {
    const f = codeFindings(a, null, "");
    assert.equal(f.fact ?? null, null, a);
    if (f.soft) assert.equal(f.quiet, true, a);
  }
  // označena napaka s pravo vrednostjo v odgovoru: brez blage opombe
  const lab = codeFindings(R`Je $2^3 = 6$? Ne, $2^3 = 8$.`, null, "");
  assert.ok(!lab.issue || lab.quiet || !lab.soft);
  // vrednosti, ki niso rezultat (pregled A, k10)
  const T = R`Reši enačbo $2x + 3 = 11$.`;
  for (const a of [R`Lani si reševal $3x = 9$, takrat je bilo $x = 3$.`, R`Ne deli z 2, sicer dobiš $x = 6$.`, R`Začni z $x = 0$: leva stran je 3.`, R`(Pri $x = 0$ je leva stran 3.)`, R`Preverimo $x = 3$: $2 \cdot 3 + 3 = 9$, kar ni 11. Torej več.`, R`Odgovor $x = 7$ dobiš, ko pozabiš odšteti.`]) {
    assert.equal(hardNote(codeFindings(a, presolve(T), T)), false, a);
  }
  // prava napaka, predstavljena kot rezultat, ostane s konkretno opombo (060)
  for (const a of [R`Torej $7 \cdot 8 = 54$.`, R`Pomnožimo: $7 \cdot 8 = 54$`, R`Ker je $7 \cdot 8 = 54$, sledi ...`]) assert.equal(hardNote(codeFindings(a, null, "")), true, a);
  for (const a of [R`$2x = 8$, torej $x = 5$.`, R`Rešitev je $x = 5$.`, R`$x = 5$`, R`**$x = 5$**`]) assert.equal(hardNote(codeFindings(a, presolve(T), T)), true, a);
  const Q = R`Reši enačbo $x^2 + x - 12 = 0$.`;
  assert.equal(hardNote(codeFindings(R`$(x - 4)(x + 3) = 0$, rešitvi $x_1 = 4$, $x_2 = -3$.`, presolve(Q), Q)), true);
  assert.equal(hardNote(codeFindings(R`Vsota rešitev je 5, produkt 6. Pri $x = 1$ je izraz 2, pri $x = 4$ je 2.`, presolve(R`Reši enačbo $x^2 - 5x + 6 = 0$.`), "")), false);
});

test("pregled B (018af7ab6): golo število, ki je rezultat naloge ali že vidno, ni napaka vmesnega koraka", () => {
  const T1 = R`Izračunaj $7 \cdot 8 + 2$.`;
  const K = R`Najprej množenje. Koliko je $7 \cdot 8$?`;
  const v = stepVerdict("58?", { pre: presolve(T1, { first: true, narrow: false }), prevTutor: K });
  assert.equal(v?.wrong, false, "kot main: končni rezultat naloge");
  assert.equal(v.noReject, true);
  assert.equal(verdictIgnored("Ne.", v), false);
  assert.equal(stepVerdict("58?", { prevTutor: K }), null, "vmesni korak brez rešene naloge");
  assert.equal(stepVerdict("8?", { prevTutor: R`Koliko je $7 \cdot 8$?` }), null, "število je v vprašanju");
  assert.equal(stepVerdict("12?", { prevTutor: R`Koliko je $7 \cdot 8$?`, seen: "Ana ima 12 jabolk." }), null, "število je že v pogovoru");
  assert.equal(stepVerdict("54?", { prevTutor: R`Koliko je $7 \cdot 8$?` })?.wrong, true, "jedro 059 ostane");
  assert.equal(stepVerdict("54?", { pre: presolve(T1, { first: true, narrow: false }), prevTutor: K })?.wrong, true);
  // dvoumna dogovora: brez sodbe
  for (const [prev, q] of [[R`Koliko je $6 : 2(1+2)$?`, "1?"], [R`Koliko je $6 : 2(1+2)$?`, "9?"], [R`Koliko je $-3^2$?`, "9?"], [R`Koliko je $-3^2$?`, "-9?"]]) {
    assert.equal(stepVerdict(q, { prevTutor: prev }), null, `${prev} ${q}`);
  }
});

// Pregled B (4cf3be1fb, bd0af5dac): ura s piko in angleška vejica za tisočice ostaneta ugotovitev kode (popravek kot
// main), opombe brez modela pa ni, tudi blage ne.
export const B_CLOCK = [
  R`Če začneš ob 8.45 in delaš 30 minut: $8.45 + 0.30 = 9.15$.`,
  R`Ali prideš ob $8.45 + 0.30 = 9.15$?`,
  R`Rezultat: $8.45 + 0.30 = 9.15$`,
  R`Rezultat: $14.30 + 2.45 = 17.15$`,
  R`Rezultat: $10.15 - 9.50 = 0.25$`,
  R`Konec: $9.50 + 0.25 = 10.15$`,
  R`Result: $1,000 + 1 = 1,001$`,
  R`Result: $2,000 - 500 = 1,500$`,
  R`So the answer is $2,500 + 500 = 3,000$.`,
];
test("pregled B: ura s piko in angleške tisočice brez opombe, ugotovitev ostane", () => {
  for (const a of B_CLOCK) {
    const f = codeFindings(a, null, "");
    assert.equal(f.fact ?? null, null, a);
    if (f.soft) assert.equal(f.quiet, true, a);
  }
  // ulov main ostane (pregled B, bd0af5dac): napačen račun v uri ali tisočicah gre v popravek
  for (const a of [R`Result: $2.45 + 1.30 = 3.85$`, R`Result: $0.25 \cdot 4 = 2$`, R`Result: $1,250 + 250 = 1,600$`]) {
    const f = codeFindings(a, null, "");
    assert.ok(f.issue && !f.soft, a);
    assert.equal(f.fact ?? null, null, a);
  }
  // periodični zapis in pika za tisočice ostaneta brez ugotovitve
  for (const a of [R`Torej je $0{,}(3) \cdot 3 = 1$.`, R`Torej $10.000 - 2.500 = 7.500$.`]) assert.equal(codeFindings(a, null, "").issue, null, a);
  for (const a of [R`Torej $7 \cdot 8 = 54$.`, R`Torej $2{,}5 + 0{,}5 = 4$.`, R`Torej $2.5 + 0.5 = 4$.`]) assert.ok(codeFindings(a, null, "").fact, a);
});

// Pregled A (4cf3be1fb): spremenjena naloga, beseda ali enota za formulo, zaokroževanje in inštruktorjeva hipoteza →
// brez opombe (ugotovitev gre v popravek kot na main); vprašanje z nalogo in brez spremembe obdrži opombo.
export const A_TASK_CHANGE = [
  [R`Reši enačbo $2x + 3 = 11$. Kaj pa, če je desna stran 13?`, R`Potem je rešitev $x = 5$.`],
  [R`Reši enačbo $2x + 3 = 11$. Kaj pa, če je desna stran 13?`, "Pri desni strani 11: $x = 4$.\nČe je desna stran 13, je rešitev $x = 5$."],
  [R`Reši enačbo $x + 3 = 5$, a namesto 5 vzemi 7.`, R`Rešitev je $x = 4$.`],
  [R`Reši enačbo $2x + 3 = 11$, potem pa še $2x + 3 = 13$.`, R`Prva: $2x = 8$. Druga: $2x = 10$, torej $x = 5$.`],
  [R`Reši enačbo $2x + 3 = 11$. What if the right side is 13?`, R`Then $x = 5$.`],
  ["Koliko avtobusov po 6 sedežev potrebujemo za 25 otrok?", R`Torej $25 : 6 = 5$ avtobusov (zaokrožimo navzgor).`],
  ["Koliko kilogramov so 3 vrečke po 500 g?", R`Skupaj torej $3 \cdot 500 = 1{,}5$ kg.`],
  ["Čas?", R`Skupaj torej $2 \cdot 45 = 1{,}5$ h.`],
  [R`Reši enačbo $3x = 10$.`, R`Torej $x = 3$ (na cela zaokroženo).`],
  ["Zaokroževanje?", R`Na stotice zaokroženo je torej $1249 = 1200$.`],
  ["Zaokroževanje?", R`Zaokroženo na desetice je torej $47 = 50$.`],
];
test("pregled A (4cf3be1fb): spremenjena naloga, beseda za formulo in zaokroževanje brez opombe", () => {
  for (const [q, a] of A_TASK_CHANGE) {
    const f = codeFindings(a, presolve(q, { first: true }), q);
    assert.ok(!f.issue || !f.fact || f.soft, `${q} → ${a}: ${f.fact && checkNoteFor(f.fact, "sl")}`);
  }
  // brez spremembe naloge in brez besede za formulo opomba ostane
  for (const [q, a] of [
    [R`Reši enačbo $2x + 3 = 11$.`, R`$2x = 8$, torej $x = 5$.`],
    ["Reši enačbo 2x + 3 = 11.", R`Rešitev je $x = 5$.`],
    ["Koliko je 7 krat 8?", R`Torej $7 \cdot 8 = 54$.`],
    ["Koliko je 7 krat 8?", R`Torej $7 \cdot 8 = 54$ in to je vse.`],
  ]) {
    const f = codeFindings(a, presolve(q, { first: true }), q);
    assert.ok(f.issue && f.fact && !f.soft, `${q} → ${a}`);
  }
});

test("pregled A (4cf3be1fb): opomba ob prezrti sodbi ne po inštruktorjevi hipotezi ali drugi enačbi", () => {
  const T = R`Reši enačbo $2x + 3 = 11$.`;
  const pre = presolve(T, { first: true, narrow: false });
  const at = (prev, q, a) => {
    const v = stepVerdict(q, { pre, prevTutor: prev, seen: T + "\n" + prev });
    return !!v && verdictNoteSafe(a, v, { prevTutor: prev, pre });
  };
  assert.equal(at("Kaj pa, če bi bila desna stran 13?", "x = 5", "Odlično!"), false);
  assert.equal(at("Vzemimo enostavnejšo enačbo x + 3 = 5. Kaj dobiš?", "x = 2", "Bravo!"), false);
  assert.equal(at(R`Poskusi najprej z $x + 3 = 5$.`, "x = 2", "Odlično, tako je!"), false);
  assert.equal(at(R`Zdaj pa sam: reši $2x + 3 = 13$.`, "x = 5", "Odlično!"), false);
  assert.equal(at("Recimo, da je desna stran 13. Kaj dobiš?", "x = 5", "Da!"), false);
  // primer ChatGPT: inštruktor brez druge enačbe ali le z enačbo naloge → opomba ostane
  assert.equal(at("Kaj narediš najprej?", "x = 5", "Da, pravilno!"), true);
  assert.equal(at("Kaj dobiš za x?", "x = 5", "Da, pravilno!"), true);
  assert.equal(at(R`Reši $2x + 3 = 11$. Kaj dobiš za $x$?`, "x = 5", "Da, pravilno!"), true);
});

test("pregled A (4cf3be1fb): beseda za formulo, spremenjena naloga in hipoteza v linearnem času", () => {
  const ms = (f) => {
    const s = performance.now();
    f();
    return performance.now() - s;
  };
  const T = R`Reši enačbo $2x + 3 = 11$.`;
  const pre = presolve(T, { first: true, narrow: false });
  const v = stepVerdict("x = 5", { pre, prevTutor: "Kaj dobiš?" });
  for (const s of [" ".repeat(60000) + "1", " ".repeat(30000) + "~" + " ".repeat(30000) + "1"]) {
    assert.ok(ms(() => codeFindings(R`Torej $7 \cdot 8 = 54$` + s, null, "")) < 300, "beseda za formulo");
  }
  for (const q of ["$".repeat(60000), "$a".repeat(30000), "a".repeat(60000) + "=", "$1$ ".repeat(15000), "tri ".repeat(15000), "3" + " x".repeat(30000) + ",", "3" + " ".repeat(60000) + "x"]) {
    assert.ok(ms(() => codeFindings(R`Rešitev je $x = 5$.`, pre, T + q)) < 300, q.slice(0, 10));
    assert.ok(ms(() => verdictNoteSafe("Da, pravilno!", v, { prevTutor: q, pre })) < 300, q.slice(0, 10));
  }
});

// Pregled A (bd0af5dac): pozitivni pogoji namesto seznamov besed.
// A: opomba ob prezrti sodbi le brez tujega števila (s števkami ali z besedo) v prejšnjem inštruktorjevem odgovoru.
export const A_STEP_FOREIGN = [
  "Če je desna stran 13, koliko je x?",
  "Desno stran zamenjajmo s 13. Koliko je x?",
  "Pri desni strani 13: koliko je x?",
  "Naj bo desna stran 13. Koliko je x?",
  "Kaj dobiš, ko desno stran povečaš na 13?",
  "Še ena: dva iks plus tri je trinajst. Koliko je x?",
  "Lažja: x plus tri je pet. Koliko je x?",
  "Zdaj pa obratno: desno 13, levo isto. Koliko je x?",
  "Spremenimo enačbo: desno naj bo 13. Koliko je x?",
  "Kaj, ko bi bilo desno 13?",
  "Kaj pa pri 13?",
  "Pa poskusiva še z desno stranjo 13.",
  R`Reši še to: $2x + 3 = 13$.`,
  R`Zdaj z $13$ na desni. Koliko je x?`,
  "Naj bo desna stran trinajst.",
  "What if the right side were thirteen?",
];
test("pregled A (bd0af5dac): opomba ob prezrti sodbi le brez tujega števila v prejšnjem odgovoru", () => {
  const T = R`Reši enačbo $2x + 3 = 11$.`;
  const pre = presolve(T, { first: true, narrow: false });
  const at = (prev, q, a) => {
    const v = stepVerdict(q, { pre, prevTutor: prev, seen: T + "\n" + prev });
    return !!v && verdictNoteSafe(a, v, { prevTutor: prev, pre });
  };
  for (const prev of A_STEP_FOREIGN) assert.equal(at(prev, "x = 5", "Odlično!"), false, prev);
  // primer ChatGPT: navadno vprašanje ali namig brez tujih števil → opomba ostane
  for (const prev of ["Kaj dobiš za x?", "Koliko je x? Namig: odštej 3.", "Kaj dobiš, če odšteješ 3 in deliš z 2?", "Kaj dobiš, če obe strani deliš z dva?", "Kaj narediš najprej?"]) {
    assert.equal(at(prev, "x = 5", "Odlično!"), true, prev);
  }
  assert.equal(at("Kaj dobiš za x?", "x = 5?", "Da, pravilno!"), true);
  // števila izraza, ki ga sodba presoja, niso tuja (naloga brez »presolve«: »Izračunaj $7 \\cdot 8$.«)
  const P = presolve(R`Izračunaj $7 \cdot 8$.`, { first: true, narrow: false });
  const v = stepVerdict("mogoče 54?", { pre: P, prevTutor: R`Koliko je $7 \cdot 8$?` });
  assert.equal(verdictNoteSafe("Ja, 54 je pravilno.", v, { prevTutor: R`Koliko je $7 \cdot 8$?`, pre: P }), true);
  assert.equal(verdictNoteSafe("Ja, 54 je pravilno.", v, { prevTutor: R`Koliko je $7 \cdot 9$?`, pre: P }), false);
});

// B: opomba proti nalogi le, ko je v sporočilu samo stavek z nalogo.
export const A_TASK_EXTRA = [
  [R`Reši enačbo $2x + 3 = 11$. Oprosti, mislil sem trinajst.`, R`Potem je rešitev $x = 5$.`],
  [R`Reši enačbo $2x + 3 = 11$. Ups, na desni je trinajst.`, R`Rešitev je torej $x = 5$.`],
  [R`Reši enačbo $2x + 3 = 11$. Kako bi bilo pri trinajst?`, R`Pri trinajst je rešitev $x = 5$.`],
  [R`Reši enačbo $2x + 3 = 11$ (v knjigi je desno trinajst).`, R`Za trinajst je rešitev $x = 5$.`],
  [R`Solve $2x + 3 = 11$. Sorry, I meant thirteen.`, R`Then the solution is $x = 5$.`],
  [R`Reši enačbo $2x + 3 = 11$. Pomota – plus pet, ne plus tri.`, R`Torej je rešitev $x = 3$.`],
  [R`Odvajaj $f(x) = x^3$, oziroma kvadrat.`, R`Odvod je torej $f'(x) = 2x$.`],
  [R`Odvajaj $f(x) = x^3$. Pardon, mislil sem $x^2$.`, R`Odvod je torej $f'(x) = 2x$.`],
  [R`Izračunaj $7 \cdot 8$. Oziroma sedem krat devet.`, "**63**"],
  [R`Izračunaj $7 \cdot 8$. Pravzaprav me zanima sedem krat devet.`, "Rezultat je **63**."],
  ["Reši enačbo 2x + 3 = 11. Oprosti, mislil sem trinajst.", R`Potem je rešitev $x = 5$.`],
  ["Odvajaj x^3, oziroma kvadrat.", R`Odvod je torej $f'(x) = 2x$.`],
];
test("pregled A (bd0af5dac): dodatek za zapisom naloge izklopi opombo o vrednosti, odvodu in golem rezultatu", () => {
  for (const [q, a] of A_TASK_EXTRA) {
    const f = codeFindings(a, presolve(q, { first: true }), q);
    assert.ok(!f.issue || !f.fact || f.soft, `${q} → ${a}`);
  }
  for (const [q, a] of [
    [R`Reši enačbo $2x + 3 = 11$.`, R`Rešitev je $x = 5$.`],
    ["Reši enačbo 2x + 3 = 11", R`Rešitev je $x = 5$.`],
    ["Reši 2x + 3 = 11.", R`Rešitev je $x = 5$.`],
    [R`Odvajaj $f(x) = x^3$.`, R`Odvod je torej $f'(x) = 2x$.`],
    [R`Odvajaj $\sin x$.`, R`$f'(x) = -\cos x$`],
    [R`Izračunaj $7 \cdot 8$.`, "**54**"],
  ]) {
    const f = codeFindings(a, presolve(q, { first: true }), q);
    assert.ok(f.issue && f.fact && !f.soft, `${q} → ${a}`);
  }
});

// C: rezultat besedilne naloge (deljenje, zaokroženo navzgor ali navzdol; pretvorba enot) brez opombe.
export const A_WORD_RESULT = [
  R`Potrebujemo torej $25 : 6 = 5$, saj zadnji avtobus ni poln.`,
  R`Potrebujemo torej $25 : 6 = 5$ – zadnji ne bo poln.`,
  R`Odgovor: $25 : 6 = 5$.`,
  R`Torej $50 : 12 = 4$, dve jajci ostaneta.`,
  R`Odgovor: $50 : 12 = 5$, ker 4 škatle niso dovolj.`,
  R`Torej $25 / 6 = 5$.`,
  R`Rezultat: $3 \cdot 500 = 1{,}5$.`,
  R`Torej $3 \cdot 500 = 1{,}5$ (v kg).`,
  R`Torej $3 \cdot 500 = 1{,}5$, izraženo v kilogramih.`,
  R`Torej $250 : 100 = 2{,}5$, kar so metri.`,
  R`Torej $2 \cdot 45 = 1{,}5$.`,
  R`Torej $3 \cdot 24 = 3$.`,
];
test("pregled A (bd0af5dac): zaokroženo deljenje in pretvorba enot brez opombe, ugotovitev ostane", () => {
  for (const a of A_WORD_RESULT) {
    const f = codeFindings(a, null, "");
    assert.equal(f.fact ?? null, null, a);
    if (f.soft) assert.equal(f.quiet, true, a);
  }
  assert.ok(codeFindings(R`Odgovor: $25 : 6 = 5$.`, null, "").issue, "ugotovitev ostane");
  // drugačna napaka ostane z opombo
  for (const a of [R`Odgovor: $25 : 5 = 4$.`, R`Odgovor: $25 : 6 = 6$.`, R`Rezultat: $3 \cdot 500 = 1600$.`, R`Torej $7 \cdot 8 = 54$.`]) {
    assert.ok(codeFindings(a, null, "").fact?.wrong, a);
  }
});

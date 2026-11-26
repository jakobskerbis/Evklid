// Preverjanje besedilnih nalog s podatki (public/scan/podatki.js; j 26. 11.: »Da, začni«). Primeri so naloge iz
// nabora fotografij (test/fixtures/sken: trapez, grelnik, trikotnik, zaporedje, odstotki, vezje) z odgovori, kot jih
// vrne AI, in pokvarjeni odgovori: napačen račun, zapis brez povezave s podatki, neuporabljen podatek.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import SL from "../public/i18n/sl.js";
import { preveriPodatke, stevilaPodatkov, steviloOdgovora, cleanRacun, iskanaKolicina, istiPodatek } from "../public/scan/podatki.js";
import { cleanSolution, solvePrompt, solveWithAi, retryFeedback } from "../server/scan.js";
import { setClient } from "../server/claude.js";
import { LIVE_UI_LANGUAGES } from "../public/i18n/languages.js";

const TRAPEZ = ["a = 10\\,\\text{cm}", "c = 6\\,\\text{cm}", "v = 4\\,\\text{cm}"];
const GRELNIK = ["P = 2\\ \\mathrm{kW}", "m = 1{,}5\\ \\mathrm{kg}", "T_1 = 20\\ ^\\circ\\mathrm{C}", "T_2 = 80\\ ^\\circ\\mathrm{C}", "c = 4200\\ \\mathrm{J/(kg\\,K)}"];
const TRIKOTNIK = ["a = 5\\,\\text{cm}", "b = 12\\,\\text{cm}"];
const VEZJE = ["R_1 = 4\\,\\Omega", "R_2 = 12\\,\\Omega", "U = 6\\,\\mathrm{V}"];
const sol = (values, equations, odgovor = {}) => ({ value: "", answer_tex: "", solutions: [], ...odgovor, racun: cleanRacun({ values, equations }) });
const status = (text, given, s) => preveriPodatke(text, given, s).status;

test("števila v podatkih: indeksi, eksponenti enot in vejice niso podatki", () => {
  assert.deepEqual(stevilaPodatkov(GRELNIK), [2, 1.5, 20, 80, 4200]);
  assert.deepEqual(stevilaPodatkov(["a_3 = 7", "a_{8} = 22", "n = 10"]), [7, 22, 10]);
  assert.deepEqual(stevilaPodatkov(["S = 2 \\cdot 10^{-3}\\,\\mathrm{m^2}", "g = 10\\,\\mathrm{m/s^{2}}", "\\frac{1}{2}", "v = 1,5 m/s", "T(1,4)"]), [0.002, 10, 0.5, 1.5, 1, 4]);
  assert.deepEqual(stevilaPodatkov(["T_1 = -5\\,^\\circ\\text{C}", "p = 20\\,\\%"]), [-5, 20]);
  assert.equal(iskanaKolicina("S=?"), "S");
  assert.equal(iskanaKolicina("alpha = ?"), "α");
  assert.equal(iskanaKolicina("S_10=?"), "S_10");
  assert.equal(iskanaKolicina("f(x)=?"), null);
  assert.equal(iskanaKolicina("x^2=4"), null);
  // pretvorbe enot: predpone, čas, km/h, stopinje, °C → K; drugo ne
  for (const [n, p] of [[2, 2000], [1.5, 0.0015], [3, 180], [72, 20], [30, Math.PI / 6], [20, 293.15], [20, 0.2], [-5, 5]]) assert.ok(istiPodatek(n, p), `${n} ~ ${p}`);
  for (const [n, p] of [[2, 3], [10, 11], [0, 1e-9]]) assert.ok(!istiPodatek(n, p), `${n} !~ ${p}`);
  assert.equal(steviloOdgovora({ value: "32 cm^2" }), 32);
  assert.equal(steviloOdgovora({ value: "", answer_tex: "t \\approx 189\\,\\mathrm{s}" }), 189);
  assert.equal(steviloOdgovora({ value: "22.62°" }), 22.62);
  assert.equal(steviloOdgovora({ value: "S = 1{,}5" }), 1.5);
});

test("pravilne rešitve nalog iz nabora: račun preverjen, formule ne (»partial«)", () => {
  assert.equal(status("S=?", TRAPEZ, sol({ a: "10", c: "6", v: "4", S: "32" }, ["S=(a+c)/2*v"], { value: "32" })), "partial");
  // pretvorba kW → W, vmesni rezultat Q, odgovor v LaTeX z enoto
  assert.equal(status("t=?", GRELNIK, sol({ P: "2000", m: "1.5", T_1: "20", T_2: "80", c: "4200", Q: "378000", t: "189" }, ["Q=m*c*(T_2-T_1)", "P*t=Q"], { answer_tex: "t = 189\\,\\mathrm{s}" })), "partial");
  // kelvini in minute
  assert.equal(status("t=?", GRELNIK, sol({ P: "2000", m: "1.5", T_1: "293.15", T_2: "353.15", c: "4200", t: "3.15" }, ["P*t*60=m*c*(T_2-T_1)"], { value: "3.15 min" })), "partial");
  // kot v stopinjah, zaokrožen na stotinko
  assert.equal(status("alpha=?", TRIKOTNIK, sol({ a: "5", b: "12", alpha: "22.62°" }, ["tan(alpha)=a/b"], { value: "22.62°" })), "partial");
  assert.equal(status("S_10=?", ["a_3 = 7", "a_8 = 22"], sol({ a_3: "7", a_8: "22", d: "3", a_1: "1", S_10: "145" }, ["a_8=a_3+5*d", "a_3=a_1+2*d", "S_10=10/2*(2*a_1+9*d)"], { value: "145" })), "partial");
  assert.equal(status("x=?", ["20\\,\\%", "15\\,\\%", "408\\,€"], sol({ p: "0.2", q: "0.15", y: "408", x: "400" }, ["x*(1+p)*(1-q)=y"], { value: "400 €" })), "partial");
  assert.equal(status("I=?", VEZJE, sol({ R_1: "4", R_2: "12", U: "6", R: "3", I: "2" }, ["1/R=1/R_1+1/R_2", "I=U/R"], { value: "2 A" })), "partial");
  // zaokrožen vmesni rezultat: 6/3.3 = 1.818… → 1.82 drži v okviru zapisanih decimalk
  assert.equal(status("I=?", ["U = 6\\,V", "R = 3{,}3\\,\\Omega"], sol({ U: "6", R: "3.3", I: "1.82" }, ["I=U/R"], { value: "1.82" })), "partial");
  // Status ni »verified« in ni »numeric«: postavitev naloge (ali je formula prava) ni preverjena
  assert.equal(status("S=?", TRAPEZ, sol({ a: "10", c: "6", v: "4", S: "40" }, ["S=(a+c)/2*v+8"], { value: "40" })), "partial");
});

test("napačen račun → »wrong« z razlago za ponovitev", () => {
  const r = preveriPodatke("S=?", TRAPEZ, sol({ a: "10", c: "6", v: "4", S: "40" }, ["S=(a+c)/2*v"], { value: "40" }));
  assert.equal(r.status, "wrong");
  assert.equal(r.reason, "wrong");
  assert.match(r.note, /S=\(a\+c\)\/2\*v gives 40 on the left and 32 on the right/);
  assert.match(retryFeedback({ value: "40", solutions: [] }, r), /your result was 40; recomputing your "check": with your values/);
  assert.equal(status("alpha=?", TRIKOTNIK, sol({ a: "5", b: "12", alpha: "24.62°" }, ["tan(alpha)=a/b"], { value: "24.62°" })), "wrong");
  assert.equal(status("I=?", VEZJE, sol({ R_1: "4", R_2: "12", U: "6", R: "3", I: "0.5" }, ["1/R=1/R_1+1/R_2", "I=U/R"], { value: "0.5 A" })), "wrong");
  // celo število ni zaokroženo: 6/3.3 ni 2
  assert.equal(status("I=?", ["U = 6\\,V", "R = 3{,}3\\,\\Omega"], sol({ U: "6", R: "3.3", I: "2" }, ["I=U/R"], { value: "2" })), "wrong");
});

test("česar ne znamo preveriti, ostane »unverified« (brez ponovitve)", () => {
  const nic = (text, given, s, why) => {
    const r = preveriPodatke(text, given, s);
    assert.equal(r.status, "unverified", why);
    assert.equal(r.reason, "given");
    if (why) assert.match(r.why, new RegExp(why));
  };
  nic("S=?", TRAPEZ, { value: "32" }, "no check");
  nic("f(x)=?", ["T(1,-4)"], sol({ a: "1" }, ["a=1"], { value: "(x-1)^2-4" }), "not a quantity");
  nic("x^2+b*x=0", ["b = 2"], sol({ b: "2", x: "0" }, ["x^2+b*x=0"]), "not a quantity");
  // odgovor ni odvisen od podatkov (zapis »S=32«) ali ga formule ne določijo
  nic("S=?", TRAPEZ, sol({ a: "10", c: "6", v: "4", S: "32" }, ["S=32", "a=10", "c=6", "v=4"], { value: "32" }), "does not depend");
  nic("S=?", TRAPEZ, sol({ a: "10", c: "6", v: "4", S: "32", k: "2" }, ["S=(a+c)/k*v"], { value: "32" }), "not determined");
  nic("S=?", TRAPEZ, sol({ a: "10", c: "6", v: "4", S: "32" }, ["S=S+a-a+(c+v)*0+32-32"], { value: "32" }));
  // podatek v rešitvi ne nastopa
  nic("S=?", TRAPEZ, sol({ a: "10", c: "6", S: "32" }, ["S=(a+c)*2"], { value: "32" }), "unused datum");
  // vrednost iskane količine ni končni odgovor
  nic("S=?", TRAPEZ, sol({ a: "10", c: "6", v: "4", S: "32" }, ["S=(a+c)/2*v"], { value: "33" }), "answer differs");
  // nečitljivo: ime iz dveh črk brez _, neznana spremenljivka v formuli, vrednost ni število, nedefinirano
  nic("E=?", ["m = 2\\,kg", "v = 3\\,m/s"], sol({ m: "2", v: "3", Ek: "9" }, ["Ek=m*v^2/2"], { value: "9" }), "value Ek");
  nic("S=?", TRAPEZ, sol({ a: "10", c: "6", v: "4", S: "32" }, ["S=(a+c)/2*h"], { value: "32" }), "equation");
  nic("S=?", TRAPEZ, sol({ a: "10", c: "6", v: "4", S: "x+1" }, ["S=(a+c)/2*v"], { value: "32" }), "value S");
  nic("x=?", ["a = -4"], sol({ a: "-4", x: "2" }, ["x=sqrt(a)"], { value: "2" }), "not defined");
  // kot brez °, ki drži v stopinjah: zapis, ne napačen račun (ne skrijemo morda pravilne rešitve)
  nic("alpha=?", TRIKOTNIK, sol({ a: "5", b: "12", alpha: "22.62" }, ["tan(alpha)=a/b"], { value: "22.62°" }), "angle without");
  // iskana količina 0 (rezultanta sil): stolpec z vrednostjo 0 ne pokvari ranga
  assert.equal(status("F=?", ["F_1 = 5\,N", "F_2 = 5\,N"], sol({ F_1: "5", F_2: "5", F: "0" }, ["F=F_1-F_2"], { value: "0 N" })), "partial");
});

test("check iz odgovora AI: očiščen, imena kot seznam (ne lastnosti objekta)", () => {
  const raw = JSON.parse('{"values":{"__proto__":"1","a":"10","b":12},"equations":["S=a*b",3]}');
  const c = cleanRacun(raw);
  assert.deepEqual(c, { values: [["__proto__", "1"], ["a", "10"], ["b", "12"]], equations: ["S=a*b"] });
  assert.equal(cleanRacun({ values: {}, equations: ["S=a"] }), null);
  assert.equal(cleanRacun("x"), null);
  assert.equal(preveriPodatke("S=?", ["a = 10"], { value: "120", racun: c }).status, "unverified");
  const s = cleanSolution({ kind: "other", methods: [{ name: "a", steps: [{ title: "t", tex: "", why: "" }] }], check: { values: { a: "10", S: "100" }, equations: ["S=a^2"] } });
  assert.deepEqual(s.racun, { values: [["a", "10"], ["S", "100"]], equations: ["S=a^2"] });
  assert.equal(cleanSolution({ kind: "other", methods: [{ name: "a", steps: [{ title: "t" }] }] }).racun, undefined);
});

test("poziv zahteva check le pri nalogi s podatki in iskano količino", () => {
  assert.match(solvePrompt("S=?", "slovenščina", null, null, TRAPEZ), /"check": \{"values"/);
  assert.match(solvePrompt("alpha=?", "slovenščina", null, null, TRIKOTNIK), /asked quantity named "alpha"/);
  assert.doesNotMatch(solvePrompt("S=?", "slovenščina"), /"check"/);
  assert.doesNotMatch(solvePrompt("x^2+b*x=0", "slovenščina", null, null, ["b = 2"]), /"check"/);
});

test("AI: napačen račun pri nalogi s podatki sproži ponovitev, preverjen račun da »partial«", async () => {
  const prevKey = process.env.ANTHROPIC_API_KEY;
  const prevMock = process.env.EVKLID_MOCK;
  process.env.ANTHROPIC_API_KEY = "test-ni-pravi";
  delete process.env.EVKLID_MOCK;
  const odgovor = (S) => ({
    kind: "other",
    variable: "S",
    problem_tex: "S",
    answer_tex: `S = ${S}\\,\\text{cm}^2`,
    solutions: [],
    value: `${S}`,
    methods: [{ name: "a", steps: [{ title: "t", tex: "S", why: "w" }] }],
    check: { values: { a: "10", c: "6", v: "4", S: `${S}` }, equations: ["S=(a+c)/2*v"] },
  });
  const prompts = [];
  let answers = [];
  setClient({
    messages: {
      create: async (req) => {
        prompts.push(req.messages[0].content);
        return { content: [{ type: "text", text: JSON.stringify(answers[Math.min(prompts.length - 1, answers.length - 1)]) }], usage: { input_tokens: 10, output_tokens: 10 }, model: "m" };
      },
    },
  });
  try {
    answers = [odgovor(40), odgovor(32)];
    let a = await solveWithAi({ text: "S=?", given: TRAPEZ });
    assert.equal(prompts.length, 2);
    assert.match(prompts[1], /recomputing your "check": with your values S=\(a\+c\)\/2\*v gives 40/);
    assert.equal(a.solution.status, "partial");
    assert.equal(a.solution.check, "given");
    assert.equal(a.solution.verified, false);
    assert.equal(a.solution.value, "32");
    // brez check: kot doslej »unverified«, en klic
    prompts.length = 0;
    answers = [{ ...odgovor(32), check: undefined }];
    a = await solveWithAi({ text: "S=?", given: TRAPEZ });
    assert.equal(prompts.length, 1);
    assert.equal(a.solution.status, "unverified");
    // vedno napačno: »wrong« po SOLVE_ATTEMPTS klicih
    prompts.length = 0;
    answers = [odgovor(40)];
    a = await solveWithAi({ text: "S=?", given: TRAPEZ });
    assert.equal(prompts.length, 3);
    assert.equal(a.solution.status, "wrong");
  } finally {
    setClient(null);
    if (prevKey === undefined) delete process.env.ANTHROPIC_API_KEY;
    else process.env.ANTHROPIC_API_KEY = prevKey;
    if (prevMock !== undefined) process.env.EVKLID_MOCK = prevMock;
  }
});

test("zaslon: pri nalogi s podatki »Delno preverjeno« pove, da formule niso preverjene", () => {
  const src = fs.readFileSync(new URL("../public/scan/scan.js", import.meta.url), "utf8");
  assert.match(src, /given: sol\.check === "given"/);
  assert.match(src, /status === "partial" && r\.given \? "scan\.st\.partialGivenTip"/);
  assert.match(SL["scan.st.partialGivenTip"], /ponovil sam.*formule/);
  for (const lang of LIVE_UI_LANGUAGES.filter((l) => l !== "sl")) {
    const ui = JSON.parse(fs.readFileSync(new URL(`../public/i18n/ui/${lang}.json`, import.meta.url), "utf8"));
    assert.ok(ui["scan.st.partialGivenTip"], `${lang}: scan.st.partialGivenTip`);
  }
});

// Preverjanje besedilnih nalog s podatki (public/scan/podatki.js; j 26. 11.: »Da, začni«). Primeri so naloge iz
// nabora fotografij (test/fixtures/sken: trapez, grelnik, trikotnik, zaporedje, odstotki, vezje) z odgovori, kot jih
// vrne AI, in pokvarjeni odgovori: napačen račun, zapis brez povezave s podatki, neuporabljen podatek.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import SL from "../public/i18n/sl.js";
import { preveriPodatke, stevilaPodatkov, steviloOdgovora, cleanRacun, iskanaKolicina, istiPodatek, podatkiNaloge } from "../public/scan/podatki.js";
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
  // pretvorbe enot le v osnovno enoto SI, ki jo pove enota ob podatku; predznak ostane
  const ena = (g) => podatkiNaloge([g])[0];
  for (const [g, p] of [["P = 2\\,\\mathrm{kW}", 2000], ["P = 2\\,\\mathrm{kW}", 2], ["m = 1{,}5\\,\\mathrm{g}", 0.0015], ["t = 3\\,\\text{min}", 180], ["v = 72\\,\\mathrm{km/h}", 20], ["\\alpha = 30^\\circ", Math.PI / 6], ["T = 20\\,^\\circ\\mathrm{C}", 293.15], ["p = 20\\,\\%", 0.2], ["S = 5\\,\\mathrm{cm}^2", 5e-4], ["\\rho = 1\\,\\mathrm{g/cm^3}", 1000], ["E = 2\\,\\text{kWh}", 7.2e6], ["a = 12\\,000\\,\\mathrm{m}", 12000]]) assert.ok(istiPodatek(ena(g), p), `${g} ~ ${p}`);
  for (const [g, p] of [["v = 4\\,\\text{cm}", 40], ["v = 4\\,\\text{cm}", 0.4], ["v = 72\\,\\mathrm{km/h}", 259.2], ["t = 2\\,\\text{h}", 120], ["T = -10\\,^\\circ\\mathrm{C}", 10], ["a = 2", 3], ["a = 10\\,\\text{neznano}", 0.01]]) assert.ok(!istiPodatek(ena(g), p), `${g} !~ ${p}`);
  assert.ok(!istiPodatek(0, 1e-9));
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
  // celo število je morda zaokroženo (6/3,3 = 1,82 → 2): nepreverjeno, ne »drži« in ne »napačno«; 3 pa je napačno
  assert.equal(status("I=?", ["U = 6\\,V", "R = 3{,}3\\,\\Omega"], sol({ U: "6", R: "3.3", I: "2" }, ["I=U/R"], { value: "2" })), "unverified");
  assert.equal(status("I=?", ["U = 6\\,V", "R = 3{,}3\\,\\Omega"], sol({ U: "6", R: "3.3", I: "3" }, ["I=U/R"], { value: "3" })), "wrong");
});

test("pregled: podatki so točni, odgovor v isti enoti, zaokrožene konstante v formuli, »wrong« le za prikazani odgovor", () => {
  const G12 = ["P = 2\\ \\mathrm{kW}", "m = 1{,}2\\ \\mathrm{kg}", "T_1 = 20\\ ^\\circ\\mathrm{C}", "T_2 = 80\\ ^\\circ\\mathrm{C}", "c = 4200\\ \\mathrm{J/(kg\\,K)}"];
  const grel = (t) => sol({ P: "2000", m: "1.2", T_1: "20", T_2: "80", c: "4200", t }, ["P*t=m*c*(T_2-T_1)"], { value: t });
  assert.equal(status("t=?", G12, grel("151.2")), "partial");
  // podatek 1,2 kg nima zaokrožitve ±0,05: 4 % napačen rezultat ne preide
  assert.equal(status("t=?", G12, grel("148")), "wrong");
  assert.equal(status("t=?", G12, grel("145")), "wrong");
  // odgovor v drugi enoti kot preverjena vrednost (0,32 namesto 32): ne »ujema se«
  assert.equal(status("S=?", TRAPEZ, sol({ a: "10", c: "6", v: "4", S: "32" }, ["S=(a+c)/2*v"], { value: "0.32 m^2" })), "unverified");
  assert.equal(status("S=?", TRAPEZ, sol({ a: "10", c: "6", v: "4", S: "32" }, ["S=(a+c)/2*v"], { value: "1920" })), "unverified");
  // zaokrožena konstanta v formuli (3.14, 9.8) ima zaokrožitev zadnjega mesta
  assert.equal(status("O=?", ["r = 5\\,cm"], sol({ r: "5", O: "31.42" }, ["O=2*3.14*r"], { value: "31.42" })), "partial");
  assert.equal(status("F=?", ["m = 3\\,kg"], sol({ m: "3", F: "29.43" }, ["F=m*9.8"], { value: "29.43" })), "partial");
  assert.equal(status("F=?", ["m = 3\\,kg"], sol({ m: "3", F: "31" }, ["F=m*9.8"], { value: "31" })), "wrong");
  // pomožni zapis ne vodi do prikazanega odgovora: nepreverjeno, ne »napačno« (ne skrijemo morda pravilne rešitve)
  assert.equal(status("S=?", TRAPEZ, sol({ a: "10", c: "6", v: "4", S: "40" }, ["S=(a+c)/2*v"], { value: "32" })), "unverified");
});

test("pregled 2: koti v stopinjah brez trigonometrije, vsa števila odgovora, podatek v napačni enoti ali z drugim predznakom", () => {
  // γ = 180° − α − β in krožni izsek z α v stopinjah (AI zapiše °, kot zahteva poziv)
  assert.equal(status("gamma=?", ["\\alpha = 50^\\circ", "\\beta = 60^\\circ"], sol({ alpha: "50°", beta: "60°", gamma: "70°" }, ["gamma=180-alpha-beta"], { value: "70°" })), "partial");
  assert.equal(status("S=?", ["r = 6\\,cm", "\\alpha = 60^\\circ"], sol({ r: "6", alpha: "60°", S: "18.85" }, ["S=pi*r^2*alpha/360"], { value: "18.85" })), "partial");
  assert.equal(status("gamma=?", ["\\alpha = 50^\\circ", "\\beta = 60^\\circ"], sol({ alpha: "50°", beta: "60°", gamma: "80°" }, ["gamma=180-alpha-beta"], { value: "80°" })), "wrong");
  // kot brez ° v trigonometriji: velja branje v stopinjah
  assert.equal(status("alpha=?", TRIKOTNIK, sol({ a: "5", b: "12", alpha: "22.62" }, ["tan(alpha)=a/b"], { value: "22.62°" })), "partial");
  // vsako število v odgovoru mora biti preverjena vrednost (value 32, na zaslonu 23), tudi predznak
  assert.equal(status("S=?", TRAPEZ, sol({ a: "10", c: "6", v: "4", S: "32" }, ["S=(a+c)/2*v"], { value: "32", answer_tex: "S = 23\\,\\text{cm}^2" })), "unverified");
  assert.equal(status("S=?", TRAPEZ, sol({ a: "10", c: "6", v: "4", S: "32" }, ["S=(a+c)/2*v"], { value: "-32" })), "unverified");
  // podatek v napačni enoti (4 cm kot 40 ali 0,04) ali z napačnim predznakom ni »uporabljen podatek«
  assert.equal(status("S=?", TRAPEZ, sol({ a: "10", c: "6", v: "40", S: "320" }, ["S=(a+c)/2*v"], { value: "320" })), "unverified");
  assert.equal(status("Q=?", ["m = 2\\,kg", "c = 4200\\,J/(kg\\,K)", "T_1 = -10\\,^\\circ C", "T_2 = 20\\,^\\circ C"], sol({ m: "2", c: "4200", T_1: "10", T_2: "20", Q: "84000" }, ["Q=m*c*(T_2-T_1)"], { value: "84000" })), "unverified");
  assert.equal(status("Q=?", ["m = 2\\,kg", "c = 4200\\,J/(kg\\,K)", "T_1 = -10\\,^\\circ C", "T_2 = 20\\,^\\circ C"], sol({ m: "2", c: "4200", T_1: "-10", T_2: "20", Q: "252000" }, ["Q=m*c*(T_2-T_1)"], { value: "252000" })), "partial");
  // decimalni podatek nima zaokrožitve: 10 % napačna pot ni »drži«
  assert.equal(status("s=?", ["v = 0{,}5\\,m/s", "t = 4\\,s"], sol({ v: "0.5", t: "4", s: "2.2" }, ["s=v*t"], { value: "2.2" })), "wrong");
  // ime z indeksom v zavitih oklepajih gre v poziv kot S_10
  assert.match(solvePrompt("S_{10}=?", "slovenščina", null, null, ["a_1 = 2"]), /named "S_10"/);
});

test("pregled 3: način kotov in enoten sistem enot", () => {
  const NIHALO = ["A = 5\\,\\mathrm{cm}", "\\omega = 2\\,\\mathrm{s^{-1}}", "t = 1\\,\\mathrm{s}"];
  // brez ° nikjer: trigonometrija v radianih (odgovor kalkulatorja v načinu DEG je napačen)
  assert.equal(status("y=?", NIHALO, sol({ A: "5", omega: "2", t: "1", y: "0.17" }, ["y=A*sin(omega*t)"], { value: "0.17" })), "wrong");
  assert.equal(status("y=?", NIHALO, sol({ A: "5", omega: "2", t: "1", y: "4.55" }, ["y=A*sin(omega*t)"], { value: "4.55" })), "partial");
  // podatek s ° kot golo število ni v radianih (sin 30 rad)
  assert.equal(status("h=?", ["\\alpha = 30^\\circ", "c = 10"], sol({ alpha: "30", c: "10", h: "-9.88" }, ["h=c*sin(alpha)"], { value: "-9.88" })), "wrong");
  assert.equal(status("h=?", ["\\alpha = 30^\\circ", "c = 10"], sol({ alpha: "30", c: "10", h: "5" }, ["h=c*sin(alpha)"], { value: "5" })), "partial");
  // ponovitev dobi namig za ° pri kotu brez stopinj
  assert.match(preveriPodatke("alpha=?", TRIKOTNIK, sol({ a: "5", b: "12", alpha: "22.62" }, ["tan(alpha)=a/b"], { value: "22.62" })).note, /write it with °/);
  // mešane enote: del podatkov v svoji enoti, del v SI
  assert.equal(status("S=?", TRAPEZ, sol({ a: "10", c: "6", v: "0.04", S: "0.32" }, ["S=(a+c)/2*v"], { value: "0.32" })), "unverified");
  assert.equal(status("S=?", TRAPEZ, sol({ a: "0.1", c: "0.06", v: "0.04", S: "0.0032" }, ["S=(a+c)/2*v"], { value: "0.0032" })), "partial");
  const POT = ["s = 36\\,\\mathrm{km}", "v = 72\\,\\mathrm{km/h}"];
  assert.equal(status("t=?", POT, sol({ s: "36", v: "20", t: "1.8" }, ["t=s/v"], { value: "1.8" })), "unverified");
  assert.equal(status("t=?", POT, sol({ s: "36", v: "72", t: "0.5" }, ["t=s/v"], { value: "0.5" })), "partial");
  assert.equal(status("t=?", POT, sol({ s: "36000", v: "20", t: "1800" }, ["t=s/v"], { value: "1800" })), "partial");
  const HOJA = ["v = 2\\,\\mathrm{m/s}", "t = 3\\,\\mathrm{min}"];
  assert.equal(status("s=?", HOJA, sol({ v: "2", t: "3", s: "6" }, ["s=v*t"], { value: "6" })), "unverified");
  assert.equal(status("s=?", HOJA, sol({ v: "2", t: "180", s: "360" }, ["s=v*t"], { value: "360" })), "partial");
});

test("meritev 26. 11.: odgovori AI, kot jih je dal pravi zagon (zapis z dvema enotama, izraz v value, branje s podatki)", () => {
  // f02: answer_tex pokaže tudi minute (»≈ 3,15 min«); zadošča, da je ena vrednost zapisa preverjena
  const GREL = ["P = 2\\ \\mathrm{kW}", "m = 1{,}5\\ \\mathrm{kg}", "T_1 = 20\\ ^\\circ\\mathrm{C}", "T_2 = 80\\ ^\\circ\\mathrm{C}", "c = 4200\\ \\mathrm{J/(kg\\,K)}"];
  assert.equal(status("t=?", GREL, sol({ P: "2000", m: "1.5", T_1: "20", T_2: "80", c: "4200", t: "189" }, ["P*t=m*c*(T_2-T_1)"], { value: "189", solutions: ["189"], answer_tex: "t = 189\\ \\mathrm{s} \\approx 3{,}15\\ \\mathrm{min}" })), "partial");
  // s07: value kot izraz, besedilo z grško črko, podatek brez števila
  const TRI = ["\\text{pravokotni trikotnik } ABC \\text{ s pravim kotom pri } B", "AB = 12\\ \\mathrm{cm}", "BC = 5\\ \\mathrm{cm}"];
  assert.equal(status("α=?", TRI, sol({ a: "5", b: "12", alpha: "22.62°" }, ["tan(alpha)=a/b"], { value: "atan(5/12)*180/pi", solutions: ["atan(5/12)*180/pi"], answer_tex: "\\alpha\\approx 22{,}62^\\circ" })), "partial");
  // o03: zapis z izračunom pred rezultatom
  assert.equal(status("P=?", TRAPEZ, sol({ a: "10", c: "6", v: "4", P: "32" }, ["P=(a+c)/2*v"], { value: "32", answer_tex: "P = \\frac{(10+6)\\cdot 4}{2} = 32\\ \\mathrm{cm^2}" })), "partial");
  // pregled: drug, nepreverjen končni rezultat v zapisu ni »partial«
  const TRP = (tex, extra = {}) => status("P=?", TRAPEZ, sol({ a: "10", c: "6", v: "4", P: "32" }, ["P=(a+c)/2*v"], { value: "32", answer_tex: tex, ...extra }));
  assert.equal(TRP("P = 32\\ \\mathrm{cm^2} \\text{ ali } P = 48\\ \\mathrm{cm^2}"), "unverified");
  assert.equal(TRP("P_1 = 32,\\ P_2 = 48", { value: "", solutions: ["32"] }), "unverified");
  assert.equal(TRP("P = 32\\ \\mathrm{cm^2} = 0{,}32\\ \\mathrm{m^2}"), "unverified");
  assert.equal(TRP("P = 32 \\approx 30\\ \\mathrm{cm^2}"), "unverified");
  assert.equal(TRP("P = 32\\ \\mathrm{cm^2} = 0{,}0032\\ \\mathrm{m^2}"), "partial");
  assert.equal(TRP("P = 48\\ \\mathrm{cm^2} \\text{ ali } P = 32"), "unverified");
  assert.equal(TRP("P = 32\\ \\mathrm{cm^2} \\approx 0\\ \\mathrm{m^2}"), "unverified");
  const HIT = (tex) => status("v=?", ["s = 36\\,\\mathrm{km}", "t = 30\\,\\mathrm{min}"], sol({ s: "36000", t: "1800", v: "20" }, ["v=s/t"], { value: "20", answer_tex: tex }));
  assert.equal(HIT("v = 20\\ \\mathrm{m/s} = 72\\ \\mathrm{km/h}"), "partial");
  assert.equal(HIT("v = 20\\ \\mathrm{m/s} = 20\\ \\mathrm{km/h}"), "unverified");
  // s15: odstotki v besedilu podatka
  assert.equal(status("x=?", ["\\text{cena se je zvišala za } 20\\ \\%", "\\text{cena se je znižala za } 15\\ \\%", "\\text{končna cena } 408\\ €"], sol({ p: "20", q: "15", y: "408", x: "400" }, ["x*(1+p/100)*(1-q/100)=y"], { value: "400", solutions: ["400"], answer_tex: "x=400\\ €" })), "partial");
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
  // pogoj v podatkih (koda ga ne preveri)
  nic("a=?", ["a < 0", "b = 16"], sol({ b: "16", a: "4" }, ["a^2=b"], { value: "4" }), "condition");
  // druga rešitev, ki prav tako ustreza: negativna dolžina, drugi pozitivni čas
  nic("c=?", ["a = 4", "b = 5"], sol({ a: "4", b: "5", c: "-6.40" }, ["c^2=a^2+b^2"], { value: "-6.40" }), "another solution");
  nic("t=?", ["v_0 = 20\\,m/s", "h = 15\\,m"], sol({ v_0: "20", h: "15", t: "3" }, ["h=v_0*t-10/2*t^2"], { value: "3" }), "another solution");
  // odstotek v vrednosti (5 % je 0,05 ali 5?) ni berljiv
  nic("x=?", ["G = 200", "p = 5\\,\\%"], sol({ G: "200", p: "5%", x: "10" }, ["x=p/100*G"], { value: "10" }), "value p");
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
  assert.match(SL["scan.st.partialGivenTip"], /ponovil sam.*formule.*pravi enoti/);
  for (const lang of LIVE_UI_LANGUAGES.filter((l) => l !== "sl")) {
    const ui = JSON.parse(fs.readFileSync(new URL(`../public/i18n/ui/${lang}.json`, import.meta.url), "utf8"));
    assert.ok(ui["scan.st.partialGivenTip"], `${lang}: scan.st.partialGivenTip`);
  }
});

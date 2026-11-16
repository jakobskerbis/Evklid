// Razmerje a : b in znaki za deljenje (»:«, »÷«, »∶«, »/«) pri preverjanju odgovorov (j, 2026-11-12:
// učenec je pri nalogi o razmerju vpisal »5:4« in dobil namig o ulomkih).
import test from "node:test";
import assert from "node:assert/strict";
import { checkAnswer } from "../server/practice/check.js";

const kind = (a, i) => checkAnswer(a, i).kind;
const R54 = { type: "fraction", num: 5, den: 4 };

test("razmerje 5 : 4 je pravilen odgovor pri ulomku 5/4", () => {
  for (const i of ["5:4", "5 : 4", "5÷4", "5 ÷ 4", "5∶4", "5/4", "5 / 4", " 5:4 "]) assert.equal(kind(R54, i), "correct", i);
  assert.equal(kind({ type: "fraction", num: -3, den: 4 }, "3:-4"), "correct");
  assert.equal(kind({ type: "fraction", num: 3, den: 4 }, "٣:٤"), "correct");
});

test("neokrajšano razmerje: okrajšaj, razen če naloga tega ne zahteva", () => {
  assert.equal(kind(R54, "10:8"), "simplify");
  assert.equal(kind(R54, "10 ÷ 8"), "simplify");
  const free = { ...R54, simplest: false };
  for (const i of ["10:8", "10 : 8", "10÷8", "10/8", "5:4"]) assert.equal(kind(free, i), "correct", i);
  assert.equal(kind(free, "8:10"), "wrong");
});

test("decimalno število pri razmerju: prava vrednost, a ne v zahtevani obliki (ni napačen poskus)", () => {
  const r = checkAnswer(R54, "1,25");
  assert.equal(r.kind, "format");
  assert.match(r.message, /Vrednost je prava/);
  assert.equal(kind(R54, "1.25"), "format");
  // sporočilo ne izda ulomka (pri »okrajšaj razmerje« bi bil to odgovor)
  assert.doesNotMatch(r.message, /5\/4|5 : 4/);
  // decimalno število z napačno vrednostjo je napačen poskus: sicer bi bilo ugibanje brezplačno, »Vrednost je prava« pa bi izdala vrednost
  assert.equal(kind(R54, "1,3"), "wrong");
  assert.equal(kind(R54, "0,8"), "wrong");
});

test("količnik: enota in cel račun", () => {
  // enota se preveri tudi pri količniku
  assert.equal(kind({ type: "number", value: 0.5, unit: "m" }, "1/2 kg"), "unit");
  assert.equal(kind({ type: "number", value: 0.5, unit: "m" }, "1/3 kg"), "unit");
  assert.equal(kind({ type: "number", value: 0.5, unit: "m" }, "1/2"), "unit");
  assert.match(checkAnswer({ type: "number", value: 0.5, unit: "m" }, "1/2 m").message, /Količnik je zapisan pravilno/);
  // »12:3=5« ni »pravilen količnik«
  assert.doesNotMatch(checkAnswer({ type: "number", value: 4 }, "12:3=5").message || "", /Količnik je zapisan pravilno/);
  assert.equal(kind({ type: "number", value: 4 }, "12:3=4"), "format");
});

test("napačna razmerja ostanejo napačna", () => {
  assert.equal(kind(R54, "4:5"), "wrong"); // obrnjeno
  assert.match(checkAnswer(R54, "4:5").mistake.message, /obratno vrednost/);
  assert.equal(kind(R54, "5:3"), "wrong");
  assert.equal(kind(R54, "6 ÷ 4"), "wrong");
  assert.equal(kind(R54, "5:0"), "format");
  assert.equal(kind(R54, "5::4"), "format");
  assert.equal(kind(R54, "5:4:1"), "format");
  assert.equal(kind(R54, ":4"), "format");
});

test("razmerje treh členov 2 : 3 : 4 (vrste odgovora za tri člene še ni): ni sprejeto in ne povzroči napake", () => {
  assert.equal(kind({ type: "fraction", num: 2, den: 3 }, "2:3:4"), "format");
  assert.equal(kind({ type: "number", value: 2 }, "2:3:4"), "format"); // prej: »2« z »enoto« :3:4 je veljalo za pravilno
});

test("količnik pri številskem odgovoru: znak za deljenje prepoznan, število pa je treba izračunati", () => {
  const n = { type: "number", value: 1.25 };
  assert.equal(kind(n, "1,25"), "correct");
  assert.equal(kind(n, "1.25"), "correct");
  for (const i of ["5:4", "5 : 4", "5÷4", "5/4", "10:8", "2,5 : 2"]) {
    const r = checkAnswer(n, i);
    assert.equal(r.kind, "format", i);
    assert.match(r.message, /Količnik je zapisan pravilno/, i);
  }
  assert.equal(kind(n, "4:5"), "wrong");
  assert.equal(checkAnswer(n, "4:5").mistake?.code, "chk.reciprocal");
  // zahtevano zaokroževanje, rešitev shranjena zaokrožena: količnik je še vedno prav zapisan
  assert.match(checkAnswer({ type: "number", value: 1.67, decimals: 2 }, "5/3").message, /Količnik je zapisan pravilno/);
  assert.match(checkAnswer({ type: "number", value: 0.33, decimals: 2 }, "1:3").message, /Količnik je zapisan pravilno/);
  assert.equal(kind(n, "5÷0"), "format");
  // prej je »5/4« pri rezultatu 5 veljal za pravilnega (»/4« je bil prebran kot enota)
  assert.equal(kind({ type: "number", value: 5 }, "5/4"), "wrong");
  assert.equal(kind({ type: "number", value: 5 }, "5:4"), "wrong");
});

test("ure, oznake in enote z »/« se ne berejo kot količnik", () => {
  // ura pri nalogi z enoto časa: prejšnje branje (10 s »enoto« :30 → namig o enoti)
  assert.equal(kind({ type: "number", value: 10.5, unit: "h" }, "10:30"), "unit");
  assert.notEqual(checkAnswer({ type: "number", value: 10.5, unit: "h" }, "10:30").message, undefined);
  // oznaka pred odgovorom ni razmerje
  assert.equal(kind({ type: "number", value: 5 }, "Odgovor: 5"), "format");
  assert.equal(kind(R54, "Odgovor: 5"), "format");
  // enote z »/«
  assert.equal(kind({ type: "number", value: 50, unit: "km/h" }, "50 km/h"), "correct");
  assert.equal(kind({ type: "number", value: 3, unit: "m/s" }, "3 m/s"), "correct");
  assert.equal(kind({ type: "number", value: 3, unit: "m/s" }, "3 m/s²"), "unit");
  // mešano število in obstoječa logika ulomkov
  assert.equal(kind({ type: "fraction", num: 3, den: 2 }, "1 1/2"), "correct");
  assert.equal(kind({ type: "fraction", num: 3, den: 4 }, "6/8"), "simplify");
  assert.equal(kind({ type: "fraction", num: 0, den: 1 }, "0/5"), "correct");
  assert.equal(kind({ type: "fraction", num: 2, den: 1 }, "2"), "correct");
});

test("vsak nov namig ima svojo kodo s prevodom, besedilo pa ne izda števil iz rešitve", async () => {
  const SL = (await import("../public/i18n/sl.js")).default;
  const cases = [
    [{ type: "number", value: 1.25 }, "5:4", "chk.quotient"],
    [{ type: "number", value: 1.25 }, "5÷0", "chk.divZero"],
    [{ type: "number", value: 2 }, "2:3:4", "chk.oneNumber"],
    [R54, "1,25", "chk.fractionForm"],
    [R54, "10:8", "chk.simplifyRatio"],
    [R54, "10/8", "chk.simplify"],
    [R54, "Odgovor: 5", "chk.fraction"],
  ];
  for (const [a, i, code] of cases) {
    const r = checkAnswer(a, i);
    assert.equal(r.code, code, i);
    assert.equal(r.message, SL[code], `${i}: besedilo mora biti enako kot v sl.js`);
  }
  // nova namiga ob pravi vrednosti nimata nobenega zgleda s števili (zgled bi lahko bil ravno rešitev)
  for (const code of ["chk.quotient", "chk.oneNumber", "chk.fractionForm", "chk.simplifyRatio"]) assert.doesNotMatch(SL[code], /\d/, code);
  assert.match(SL["chk.fraction"], /a : b/);
});

test("razmerje s tisočicami (1 : 100 000) in z negativnim členom (6 : -3)", () => {
  const map = { type: "fraction", num: 1, den: 100000 };
  for (const i of ["1:100 000", "1 : 100 000", "1:100000", "1÷100 000"]) assert.equal(kind(map, i), "correct", i);
  assert.equal(kind({ type: "fraction", num: 1, den: 2 }, "1 000 : 2 000"), "simplify");
  assert.equal(kind({ type: "fraction", num: 1, den: 2, simplest: false }, "1 000 : 2 000"), "correct");
  assert.equal(kind({ type: "fraction", num: 11, den: 2 }, "1 100/200"), "wrong"); // pri »/« je to mešano število 1 100/200 = 3/2, ne 1100/200
  assert.equal(kind({ type: "fraction", num: -2, den: 1, simplest: false }, "6:-3"), "correct");
  assert.equal(kind({ type: "fraction", num: -2, den: 1 }, "-2:1"), "correct");
  assert.equal(kind({ type: "fraction", num: -2, den: 1 }, "6:-3"), "simplify");
  assert.equal(checkAnswer({ type: "number", value: -2 }, "6:-3").code, "chk.quotient");
  assert.equal(checkAnswer({ type: "number", value: -2 }, "6 : - 3").code, "chk.quotient");
  assert.equal(kind({ type: "number", value: 2 }, "6:-3"), "wrong");
});

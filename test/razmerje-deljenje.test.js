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
  assert.doesNotMatch(checkAnswer(R54, "1,3").message, /Vrednost je prava/);
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
    assert.match(r.message, /Količnik je pravilen/, i);
  }
  assert.equal(kind(n, "4:5"), "wrong");
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

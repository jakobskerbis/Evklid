// Sklanjatev ob številu v nalogah (server/practice/rng.js): odločata zadnji dve števki, ne le zadnja.
// 1, 101 → ednina; 2, 102 → dvojina; 3, 4, 103 → množina; 0, 5–20, 21, 22, 23 … → rodilnik množine.
import { test } from "node:test";
import assert from "node:assert/strict";
import { nOf, verbOf } from "../server/practice/rng.js";

const D = (n) => nOf(n, "delavec", "delavca", "delavci", "delavcev");
const V = (n) => verbOf(n, "je prišel", "sta prišla", "so prišli", "je prišlo");

test("nOf: oblika samostalnika po zadnjih dveh števkah", () => {
  assert.equal(D(1), "1 delavec");
  assert.equal(D(2), "2 delavca");
  assert.equal(D(3), "3 delavci");
  assert.equal(D(4), "4 delavci");
  assert.equal(D(5), "5 delavcev");
  assert.equal(D(11), "11 delavcev");
  assert.equal(D(12), "12 delavcev");
  assert.equal(D(21), "21 delavcev");
  assert.equal(D(22), "22 delavcev");
  assert.equal(D(33), "33 delavcev");
  assert.equal(D(101), "101 delavec");
  assert.equal(D(102), "102 delavca");
  assert.equal(D(104), "104 delavci");
  assert.equal(D(111), "111 delavcev");
});

test("verbOf: glagol se ujema s številom po zadnjih dveh števkah", () => {
  assert.equal(V(1), "je prišel");
  assert.equal(V(2), "sta prišla");
  assert.equal(V(3), "so prišli");
  assert.equal(V(5), "je prišlo");
  assert.equal(V(21), "je prišlo");
  assert.equal(V(22), "je prišlo");
  assert.equal(V(24), "je prišlo");
  assert.equal(V(101), "je prišel");
  assert.equal(V(102), "sta prišla");
  assert.equal(V(103), "so prišli");
});

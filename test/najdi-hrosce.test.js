// scripts/najdi-hrosce.mjs: podvojeni ključi v kodi in prevodih (CI posel »hrosci«, j 2026-11-15).
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { preveriBesedilo } from "../scripts/najdi-hrosce.mjs";

const imena = (src, pot = "x.js") => preveriBesedilo(src, pot).map((n) => `${n.ime}@${n.vrstica}<${n.prej}`);

test("najde podvojen ključ v predmetu (primer has_password)", () => {
  const src = "const f = (p) => ({\n  a: 1,\n  has_password: true,\n  b: 2,\n  has_password: false,\n});";
  assert.deepEqual(imena(src), ["has_password@5<3"]);
});

test("najde podvojen ključ v prevodih sl.js in JSON (primer games.wishThanks)", () => {
  assert.deepEqual(imena('export default {\n  "games.wishThanks": "a",\n  "games.wishThanks": "b",\n};', "sl.js"), ["games.wishThanks@3<2"]);
  assert.deepEqual(imena('{\n  "x": 1,\n  "y": { "one": "a", "other": "b" },\n  "z": { "one": "a", "other": "b" },\n  "x": 2\n}', "en.json"), ["x@5<2"]);
});

test("ne prijavi dovoljenih vzorcev", () => {
  const src = [
    "const o = { get v() { return 1; }, set v(x) {} };", // getter + setter
    "const a = { x: 1, ...b, y: 2 };", // razširitev
    "const k = 'x'; const c = { [k]: 1, [k]: 2 };", // izračunan ključ
    "const d = { one: 1 }; const e = { one: 2 };", // različna predmeta
    "class K { m() {} m2() {} }",
  ].join("\n");
  assert.deepEqual(imena(src), []);
  assert.deepEqual(imena("const o = { get v() {}, v: 1 };"), ["v@1<1"]);
  assert.deepEqual(imena("const o = { a: 1, 'a': 2, \"b\": 1, b: 3 };"), ["a@1<1", "b@1<1"]);
});

test("repozitorij je brez najdb (kot CI posel)", () => {
  const izid = JSON.parse(execFileSync(process.execPath, ["scripts/najdi-hrosce.mjs", "--json"], { encoding: "utf8" }));
  assert.ok(izid.datotek > 500, `pregledanih datotek: ${izid.datotek}`);
  assert.deepEqual(izid.najdbe, []);
  assert.deepEqual(izid.napake, []);
});

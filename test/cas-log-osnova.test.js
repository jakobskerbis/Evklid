// Logaritem z osnovo v workerju (27. 11. 2026, nit »Preveri pripravljenost za zaprt pilot«): »log_2(x)« je parse_expr
// prej prebral kot simbol log_2 krat (x), zato je blok RACUN inštruktorja (racun.js → casCheck) pravilno rešitev
// x = 4 zavrnil (»4 ni rešitev«). Zdaj log_b(x), log_(b)(x), log_{b}(x) in logN(x) pomenijo log(x, b); ime funkcije z
// indeksom, ki ga ne preberemo, je »ne vem« (null), nikoli »napačno«.
import { test, after } from "node:test";
import assert from "node:assert/strict";
import { casCheck, casAvailable, casStop } from "../server/cas.js";

const HAVE = await casAvailable();
after(() => casStop());
const ok = async (eq, v) => (await casCheck("solve", [eq, "x", v])).ok;
const skip = !HAVE && "SymPy ni na voljo";

test("log_b: pravilna rešitev je potrjena, napačna zavrnjena", { skip }, async () => {
  for (const eq of ["log_2(x)+log_2(x-2)=3", "log_(2)(x)+log_(2)(x-2)=3", "log_{2}(x)+log_{2}(x-2)=3", "log(x,2)+log(x-2,2)=3"]) {
    assert.equal(await ok(eq, "4"), true, eq);
    assert.equal(await ok(eq, "5"), false, eq);
    assert.equal(await ok(eq, "-2"), false, eq); // zunaj definicijskega območja
  }
  assert.equal(await ok("log_3(x-1)-log_3(x-3)=1", "4"), true);
  assert.equal(await ok("log_3(x-1)-log_3(x-3)=1", "5"), false);
  assert.equal(await ok("log3(x)=2", "9"), true);
  assert.equal(await ok("log3(x)=2", "8"), false);
  assert.equal(await ok("log_2(log_2(x))=1", "4"), true);
  assert.equal(await ok("log_10(x)=2", "100"), true);
});

test("funkcija z indeksom, ki je ne preberemo: »ne vem«, ne »napačno«", { skip }, async () => {
  for (const eq of ["log_2 x=3", "sin_2(x)=0"]) assert.equal(await ok(eq, "8"), null, eq);
});

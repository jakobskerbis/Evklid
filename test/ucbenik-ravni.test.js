// Učbenik: vrstica predmetov sledi ravni (j 2026-11-14 »Zakaj je [Naravoslovje] pri srednji šoli in tekmovanjih«).
import test from "node:test";
import assert from "node:assert/strict";
import { listBooks } from "../server/textbook.js";
import { predmetiNaRavni, knjigaNaRavni } from "../public/ucbenik-ravni.js";

const books = listBooks({ system: "SI" });
const subjects = [...new Map(books.map((b) => [b.subject, b.subjectName])).entries()];
const vidni = (key) => predmetiNaRavni(subjects, books, books.find((b) => b.key === key)).map(([k]) => k);

test("Naravoslovje samo pri osnovni šoli, Biologija ne pri tekmovanjih", () => {
  assert.ok(books.some((b) => b.key === "NAR-OS"), "NAR-OS obstaja");
  assert.ok(!books.some((b) => b.subject === "NAR" && b.school !== "OS"), "Naravoslovje ima samo učbenik OŠ");
  assert.ok(vidni("FIZ-OS").includes("NAR"));
  assert.ok(vidni("MAT-OS").includes("NAR"));
  for (const key of ["FIZ-SS", "MAT-SS", "FIZ-TEK", "MAT-TEK", "KEM-TEK"]) assert.ok(!vidni(key).includes("NAR"), key);
  assert.ok(vidni("FIZ-SS").includes("BIO"));
  assert.ok(!vidni("FIZ-TEK").includes("BIO"));
  for (const key of ["FIZ-SS", "FIZ-TEK"]) for (const k of ["MAT", "FIZ", "KEM"]) assert.ok(vidni(key).includes(k), `${key} ${k}`);
});

test("menjava predmeta obdrži raven, če jo predmet ima", () => {
  assert.equal(knjigaNaRavni(books, "KEM", "TEK"), "KEM-TEK");
  assert.equal(knjigaNaRavni(books, "FIZ", "SS"), "FIZ-SS");
  assert.equal(knjigaNaRavni(books, "NAR", "SS"), null);
  assert.equal(knjigaNaRavni(books, "MAT", undefined), null);
});

test("študijski program in neznane ravni: vsi predmeti", () => {
  const prog = { key: "P-X", subject: "PROG", school: "UNI" };
  const all = [["PROG", "Moj študij"], ...subjects];
  assert.deepEqual(predmetiNaRavni(all, [prog, ...books], prog), all);
  assert.deepEqual(predmetiNaRavni(subjects, books, undefined), subjects);
  // PROG ostane v vrstici tudi pri šolski ravni.
  assert.ok(predmetiNaRavni(all, [prog, ...books], books.find((b) => b.key === "FIZ-SS")).some(([k]) => k === "PROG"));
});

// AUDIT-069: 208 kratkih odgovorov »Samo rezultat« (OŠ/SŠ/faks): koda ne sme označiti nobenega pravilnega, gole
// rezultate računov pa ujame (prej 18 od 90 napačnih, zdaj vsaj 37).
import test from "node:test";
import assert from "node:assert/strict";
import { presolve, codeFindings } from "../server/live-check.js";
import C from "./fixtures/kratki-odgovori.mjs";

test("kratki odgovori: 0 lažnih alarmov, vsi goli rezultati računov OŠ ujeti", () => {
  const fa = [];
  let caught = 0;
  const bare = { n: 0, caught: 0 };
  for (const c of C) {
    const f = codeFindings(c.a, presolve(c.q, { first: true }), c.q);
    if (c.ok && f.issue) fa.push(`${c.q} | ${c.a} | ${f.issue}`);
    if (!c.ok && f.issue) caught++;
    if (!c.ok && /^os-arit/.test(c.tag)) {
      bare.n++;
      if (f.issue) bare.caught++;
    }
  }
  assert.deepEqual(fa, []);
  assert.equal(C.filter((c) => c.ok).length, 118);
  assert.equal(bare.caught, bare.n, "vsi napačni računi OŠ (gol rezultat ali en zapis)");
  assert.ok(caught >= 37, `ujetih ${caught} od ${C.filter((c) => !c.ok).length}`);
});

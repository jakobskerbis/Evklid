// Pregled mrež vseh 3D modelov (scripts/atlas/preveri-mreze.mjs): noben GLB ne sme dobiti novih lukenj, odprtih ali
// nemnogoternih robov, obrnjenih ploskev, delov, obrnjenih navznoter, ali izrojenih trikotnikov glede na izhodišče
// scripts/atlas/mreze-izhodisce.json. Ko popravek težave odpravi, izhodišče zmanjšaj:
// node scripts/atlas/preveri-mreze.mjs --izhodisce (zavrne povečanje).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { analiziraj, preveriGLB, seznamDatotek, noveTezave, IZHODISCE, MERE } from "../scripts/atlas/preveri-mreze.mjs";

const MODELI = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "3d", "modeli");
const izh = JSON.parse(fs.readFileSync(IZHODISCE, "utf8"));

test("pregled mrež: kocka, obrnjena kocka, ena obrnjena ploskev, odprta škatla", () => {
  const p = new Float64Array([0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1]);
  const q = [0, 2, 1, 0, 3, 2, 4, 5, 6, 4, 6, 7, 0, 1, 5, 0, 5, 4, 1, 2, 6, 1, 6, 5, 2, 3, 7, 2, 7, 6, 3, 0, 4, 3, 4, 7];
  const k = analiziraj(p, Uint32Array.from(q));
  assert.deepEqual([k.odprtiRobovi, k.luknje, k.nemnogoterni, k.obrnjene, k.zaprte, k.navznoter, k.izrojeni], [0, 0, 0, 0, 1, 0, 0]);
  const obr = q.map((_, i) => q[i - (i % 3) + [0, 2, 1][i % 3]]);
  assert.equal(analiziraj(p, Uint32Array.from(obr)).navznoter, 1);
  const ena = q.slice(); [ena[1], ena[2]] = [ena[2], ena[1]];
  assert.equal(analiziraj(p, Uint32Array.from(ena)).obrnjene, 1);
  const odprta = analiziraj(p, Uint32Array.from(q.slice(6)));
  assert.deepEqual([odprta.odprtiRobovi, odprta.luknje, odprta.zaprte], [4, 1, 0]);
  // Podvojena oglišča na šivu (enak položaj, drug indeks) se zvarijo: ni odprtih robov.
  const p2 = new Float64Array([...p, 0, 0, 0]);
  const q2 = q.slice(); q2[0] = 8;
  assert.equal(analiziraj(p2, Uint32Array.from(q2)).odprtiRobovi, 0);
  // Zrcaljena kocka (x → −x) v zrcaljenem vozlišču (det < 0) ni obrnjena navznoter.
  const zrc = Float64Array.from(p, (v, i) => (i % 3 === 0 ? -v : v));
  assert.equal(analiziraj(zrc, Uint32Array.from(q), true).navznoter, 0);
  assert.equal(analiziraj(zrc, Uint32Array.from(q), false).navznoter, 1);
  // Ista kocka brez indeksov (tri oglišča na trikotnik) je ena zaprta komponenta.
  const brez = new Float64Array(q.length * 3);
  q.forEach((v, i) => brez.set(p.subarray(v * 3, v * 3 + 3), i * 3));
  const b = analiziraj(brez, null);
  assert.deepEqual([b.odprtiRobovi, b.zaprte, b.navznoter], [0, 1, 0]);
  // Votlina: notranja lupina (obrnjena) v zaprti zunanji lupini ni »navznoter« (votla žila); sama zase je.
  const zun = Float64Array.from(p, (v) => v * 3 - 1);
  const oba = new Float64Array([...zun, ...p]);
  const votla = analiziraj(oba, Uint32Array.from([...q, ...obr.map((v) => v + 8)]));
  assert.deepEqual([votla.zaprte, votla.navznoter], [2, 0]);
});

test("pregled mrež: izhodišče ima mere v pravem vrstnem redu", () => {
  assert.ok(izh.opis.includes(MERE.join(", ")));
  for (const [rel, deli] of Object.entries(izh.modeli)) for (const [ime, v] of Object.entries(deli)) assert.equal(v.length, MERE.length, `${rel} »${ime}«`);
});

for (const rel of seznamDatotek()) {
  test(`pregled mrež: ${rel} brez novih težav glede na izhodišče`, async () => {
    const nove = noveTezave(rel, await preveriGLB(path.join(MODELI, rel)), izh.modeli);
    assert.equal(nove.length, 0, `Nove težave mrež (luknje, robovi, obrnjene ploskve):\n${nove.slice(0, 30).join("\n")}${nove.length > 30 ? `\n… še ${nove.length - 30}` : ""}`);
  });
}

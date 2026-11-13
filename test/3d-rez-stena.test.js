// Delež stene za rezne ploskve (scripts/atlas/rez-stena.mjs): število navitij zaprtega telesa na mreži vokslov.
// Zagon: node --test test/3d-rez-stena.test.js

import { test } from "node:test";
import assert from "node:assert/strict";
import { delezStene, rezine, pngRGB } from "../scripts/atlas/rez-stena.mjs";

// kocka [a, b]³ z normalami navzven (trikotniki po 9 koordinat)
function kocka(a, b) {
  const v = [[a, a, a], [b, a, a], [b, b, a], [a, b, a], [a, a, b], [b, a, b], [b, b, b], [a, b, b]];
  const f = [[0, 2, 1], [0, 3, 2], [4, 5, 6], [4, 6, 7], [0, 1, 5], [0, 5, 4], [2, 3, 7], [2, 7, 6], [1, 2, 6], [1, 6, 5], [3, 0, 4], [3, 4, 7]];
  return Float64Array.from(f.flatMap((t) => t.flatMap((i) => v[i])));
}

test("rez-stena: zaprta kocka da delež 1 znotraj, 0 zunaj, vsota je prostornina", () => {
  const n = [8, 8, 8];
  const { delez, negativnih } = delezStene(kocka(2, 6), { lo: [0, 0, 0], korak: 1, n });
  const v = (x, y, z) => delez[(z * n[1] + y) * n[0] + x];
  assert.ok(Math.abs(v(3, 3, 3) - 1) < 1e-6 && Math.abs(v(5, 2, 4) - 1) < 1e-6);
  assert.equal(v(0, 0, 0), 0);
  assert.equal(v(7, 3, 3), 0);
  assert.equal(negativnih, 0);
  assert.ok(Math.abs(delez.reduce((a, b) => a + b, 0) - 64) < 0.5);
});

test("rez-stena: kocka v kocki z nasprotnim navitjem je votlina (stena samo med njima)", () => {
  const n = [10, 10, 10];
  const zun = kocka(1, 9), notr = kocka(3, 7);
  // obrnemo navitje notranje kocke: normale v votlino
  for (let t = 0; t < notr.length; t += 9) for (let c = 0; c < 3; c++) { const x = notr[t + 3 + c]; notr[t + 3 + c] = notr[t + 6 + c]; notr[t + 6 + c] = x; }
  const tri = new Float64Array(zun.length + notr.length);
  tri.set(zun); tri.set(notr, zun.length);
  const { delez } = delezStene(tri, { lo: [0, 0, 0], korak: 1, n });
  const v = (x, y, z) => delez[(z * n[1] + y) * n[0] + x];
  assert.ok(v(5, 5, 5) < 1e-6, "votlina");
  assert.ok(Math.abs(v(2, 5, 5) - 1) < 1e-6, "stena");
  assert.ok(Math.abs(delez.reduce((a, b) => a + b, 0) - (512 - 64)) < 1);
});

test("rez-stena: rezine zložijo kanale v ploščice z robom; PNG ima pravi podpis", () => {
  const n = [4, 3, 5];
  const r = rezine([new Float32Array(60).fill(1), new Float32Array(60)], n);
  assert.equal(r.ploscice[0] * r.ploscice[1] >= n[2], true);
  assert.equal(r.slika.length, r.w * r.h * 3);
  const png = pngRGB(r.w, r.h, r.slika);
  assert.deepEqual([...png.subarray(0, 4)], [137, 80, 78, 71]);
});

test("rez-stena (krog m2): žarki skozi odprtino mreže ne pustijo proge – izpuščeni so, vrstica dobi delež sosed", () => {
  const n = [8, 8, 8], mreza = { lo: [0, 0, 0], korak: 1, n };
  const cela = kocka(2, 6);
  assert.equal(delezStene(cela, mreza).odprtih, 0);
  // kocki manjka majhen trikotnik na ploskvi x = 6 (odprtina): žarki skozenj se ne končajo z navitjem 0
  const tri = Array.from(cela);
  tri.push(...[6, 3.1, 3.1, 6, 3.9, 3.1, 6, 3.1, 3.9]); // dodaten trikotnik z normalo +x (dvojni izstop = neuravnotežen žarek)
  const r = delezStene(Float64Array.from(tri), mreza);
  assert.ok(r.odprtih > 0, "neuravnoteženi žarki so prešteti");
  const v = (x, y, z) => r.delez[(z * n[1] + y) * n[0] + x];
  assert.ok(Math.abs(v(4, 3, 3) - 1) < 1e-6, "v kocki ostane stena");
  assert.ok(v(7, 3, 3) < 1e-6 && v(0, 3, 3) < 1e-6, "zunaj kocke ni proge");
});

// Očesne mišice na zrklu HRA (scripts/atlas/oko_misice.py, docs/3d.md »Eye muscles«): narastišča premih mišic ležijo
// na Tillauxovi spirali (5,5 notranja, 6,5 spodnja, 6,9 zunanja, 7,7 mm zgornja za limbusom), nobena mišica ni zarita
// globoko v zrklo (prej raztrgan rob ob beločnici) in kita je nad površino beločnice.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";

const KOREN = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const ORGANI = path.join(KOREN, "public", "3d", "modeli", "organi-3d");
const CILJ = { Medial: 5.5, Inferior: 6.5, Lateral: 6.9, Superior: 7.7 }; // mm za limbusom

async function tocke(datoteka) {
  const doc = await new NodeIO().registerExtensions(ALL_EXTENSIONS).read(path.join(ORGANI, datoteka));
  const po = new Map();
  for (const n of doc.getRoot().listNodes()) {
    const m = n.getMesh();
    if (!m) continue;
    const W = n.getWorldMatrix(), P = [], v = [0, 0, 0];
    for (const p of m.listPrimitives()) {
      const a = p.getAttribute("POSITION");
      for (let i = 0; i < a.getCount(); i++) {
        a.getElement(i, v);
        P.push([0, 1, 2].map((k) => W[k] * v[0] + W[4 + k] * v[1] + W[8 + k] * v[2] + W[12 + k]));
      }
    }
    po.set(n.getName(), P);
  }
  return po;
}
const pct = (a, q) => [...a].sort((x, y) => x - y)[Math.min(a.length - 1, Math.max(0, Math.round(q * (a.length - 1))))];

for (const datoteka of ["oko.glb", "oko-telefon.glb"]) {
  test(`očesne mišice (${datoteka}): narastišča na Tillauxovi spirali, mišice na površini zrkla`, async () => {
    const po = await tocke(datoteka);
    const najdi = (rx) => [...po.entries()].find(([ime]) => rx.test(ime))?.[1];
    const S = najdi(/^sclera/i), C = najdi(/^cornea/i);
    assert.ok(S && C, "beločnica in roženica HRA");
    const lo = [0, 1, 2].map((k) => Math.min(...S.map((p) => p[k]))), hi = [0, 1, 2].map((k) => Math.max(...S.map((p) => p[k])));
    const G = lo.map((x, k) => (x + hi[k]) / 2);
    const sr = [0, 1, 2].map((k) => C.reduce((s, p) => s + p[k], 0) / C.length - G[k]);
    const dl = Math.hypot(...sr), os = sr.map((x) => x / dl);
    const polarno = (p) => {
      const d = p.map((x, k) => x - G[k]), r = Math.hypot(...d);
      return [r, Math.acos(Math.max(-1, Math.min(1, (d[0] * os[0] + d[1] * os[1] + d[2] * os[2]) / r)))];
    };
    const sp = S.map(polarno), rS = sp.map((x) => x[0]);
    const R0 = pct(rS, 0.9);
    const zunanji = sp.filter((x) => x[0] > pct(rS, 0.5));
    const thL = pct(zunanji.map((x) => x[1]), 0.002); // limbus = sprednji rob beločnice
    assert.ok(R0 > 0.0115 && R0 < 0.0145, `zunanji polmer zrkla ${(R0 * 1000).toFixed(1)} mm`);
    for (const [kljuc, cilj] of Object.entries(CILJ)) {
      const M = najdi(new RegExp(`^${kljuc} rectus muscle`));
      assert.ok(M, `${kljuc} rectus muscle`);
      const mp = M.map(polarno);
      const lok = (pct(mp.map((x) => x[1]), 0.005) - thL) * R0 * 1000;
      assert.ok(Math.abs(lok - cilj) < 1.2, `${kljuc} rectus: narastišče ${lok.toFixed(1)} mm za limbusom (cilj ${cilj})`);
      // ob zrklu (pred ekvatorjem) nobeno oglišče več kot 0,9 mm pod zunanjim polmerom beločnice (prej do 2 mm)
      const globoko = mp.filter(([r, th]) => th < 1.6 && r < pct(rS, 0.5) - 0.0009).length;
      assert.ok(globoko <= mp.length * 0.01, `${kljuc} rectus: ${globoko} oglišč zaritih v zrklo`);
    }
    const vrstni = Object.keys(CILJ).map((k) => (pct(najdi(new RegExp(`^${k} rectus muscle`)).map((p) => polarno(p)[1]), 0.005) - thL) * R0);
    assert.ok(vrstni[0] < vrstni[1] && vrstni[1] < vrstni[2] + 0.0006 && vrstni[2] < vrstni[3], "spirala: notranja < spodnja ≤ zunanja < zgornja");
  });
}

test("oko_misice.py: mere narastišč in kit iz literature, korak v izvozu", () => {
  const src = fs.readFileSync(path.join(KOREN, "scripts", "atlas", "oko_misice.py"), "utf8");
  assert.match(src, /NARASTISCE = \{"Medial": 0\.0055, "Inferior": 0\.0065, "Lateral": 0\.0069, "Superior": 0\.0077\}/);
  const izvoz = fs.readFileSync(path.join(KOREN, "scripts", "atlas", "izvozi-organe.py"), "utf8");
  assert.match(izvoz, /dodaj=\["ocesne_misice"\]/);
  assert.match(fs.readFileSync(path.join(KOREN, "scripts", "atlas", "peka.py"), "utf8"), /r\.get\("kita"\)/);
});

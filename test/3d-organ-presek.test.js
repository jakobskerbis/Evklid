// Pravi presek mreže z ravnino reza (public/3d/organ-presek.js, tkivo.rezPresek v organ.js): obris preseka je sklenjen,
// luknje ostanejo luknje, »polno« jih zapolni, »ovoj« da izbočeno podlago. Ledvica: vsaka sekana piramida da svoj presek.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { zankePreseka, presekMreze, ploscina, ovojnica } from "../public/3d/organ-presek.js";
import { preberi } from "../scripts/atlas/zile-mreza.mjs";

const KOREN = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const ORGANI = path.join(KOREN, "public", "3d", "modeli", "organi-3d");

// kvader [x0, x1] × [y0, y1] × [z0, z1] z lastnimi oglišči na vsaki ploskvi (kot mreža s šivi UV); navznoter = votlina
function kvader(lo, hi, navznoter = false) {
  const pos = [], idx = [];
  const ploskve = [[0, 1, 2, 0], [0, 1, 2, 1], [1, 2, 0, 0], [1, 2, 0, 1], [2, 0, 1, 0], [2, 0, 1, 1]];
  for (const [a, b, c, zg] of ploskve) {
    const z = pos.length / 3;
    for (const [u, v] of [[0, 0], [1, 0], [1, 1], [0, 1]]) {
      const p = [0, 0, 0];
      p[a] = u ? hi[a] : lo[a];
      p[b] = v ? hi[b] : lo[b];
      p[c] = zg ? hi[c] : lo[c];
      pos.push(...p);
    }
    const t = zg !== navznoter ? [0, 1, 2, 0, 2, 3] : [0, 2, 1, 0, 3, 2];
    idx.push(...t.map((i) => z + i));
  }
  return { pos, idx };
}
// preprosta triangulacija za preizkus: pahljača obrisa (izbočeni liki), ploščino lukenj odštejemo posebej
const pahljaca = (obris) => obris.slice(1, -1).map((_, i) => [0, i + 1, i + 2]);
const ploscinaTrikotnikov = (r) => {
  let s = 0;
  for (let f = 0; f < r.indeksi.length; f += 3) {
    const [a, b, c] = [0, 1, 2].map((k) => [0, 1, 2].map((j) => r.polozaji[r.indeksi[f + k] * 3 + j]));
    const u = b.map((x, i) => x - a[i]), v = c.map((x, i) => x - a[i]);
    s += Math.hypot(u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]) / 2;
  }
  return s;
};

test("presek: kvader da eno sklenjeno zanko s pravo ploščino, točke ležijo na ravnini", () => {
  const { pos, idx } = kvader([-1, -2, -3], [1, 2, 3]);
  const { zanke } = zankePreseka(pos, idx, [0, 0, 1], -0.5);
  assert.equal(zanke.length, 1);
  assert.ok(Math.abs(Math.abs(ploscina(zanke[0])) - 8) < 1e-9);
  const r = presekMreze(pos, idx, [0, 0, 1], -0.5, { trianguliraj: pahljaca });
  assert.ok(Math.abs(ploscinaTrikotnikov(r) - 8) < 1e-6);
  for (let i = 2; i < r.polozaji.length; i += 3) assert.ok(Math.abs(r.polozaji[i] - 0.5) < 1e-6);
  assert.equal(presekMreze(pos, idx, [0, 0, 1], -5, { trianguliraj: pahljaca }), null, "ravnina mimo mreže");
});

test("presek: votlina je luknja, »polno« jo zapolni, ločena telesa se ne gnezdijo, »ovoj« je izbočena podlaga", () => {
  const zunaj = kvader([-2, -2, -2], [2, 2, 2]);
  const znotraj = kvader([-1, -1, -1], [1, 1, 1], true);
  const pos = [...zunaj.pos, ...znotraj.pos];
  const idx = [...zunaj.idx, ...znotraj.idx.map((i) => i + zunaj.pos.length / 3)];
  let klici = [];
  const tri = (obris, luknje) => (klici.push(luknje.length), pahljaca(obris));
  presekMreze(pos, idx, [1, 0, 0], 0, { trianguliraj: tri });
  assert.deepEqual(klici, [1], "en obris z eno luknjo");
  klici = [];
  const polno = presekMreze(pos, idx, [1, 0, 0], 0, { polno: true, trianguliraj: tri });
  assert.deepEqual(klici, [0]);
  assert.ok(Math.abs(ploscinaTrikotnikov(polno) - 16) < 1e-6);
  // isti telesi kot ločena dela (vsako zase): notranje ni več luknja zunanjega
  klici = [];
  presekMreze(pos, [zunaj.idx, znotraj.idx.map((i) => i + zunaj.pos.length / 3)], [1, 0, 0], 0, { trianguliraj: tri });
  assert.deepEqual(klici, [0, 0]);
  // ovoj dveh ločenih kvadrov: pravokotnik čez oba
  const a = kvader([0, 0, 0], [1, 1, 1]), b = kvader([0, 3, 0], [1, 4, 1]);
  const ov = presekMreze([...a.pos, ...b.pos], [...a.idx, ...b.idx.map((i) => i + 24)], [1, 0, 0], -0.5, { ovoj: true, trianguliraj: tri });
  assert.ok(Math.abs(ploscinaTrikotnikov(ov) - 4) < 1e-6);
  assert.equal(ovojnica([[0, 0], [1, 0], [1, 1], [0, 1], [0.5, 0.5]]).length, 4);
});

test("presek ledvice: ravnina iz JSON seka skorjo, meh in vsaj šest piramid; vsaka da sklenjen obris", async () => {
  const j = JSON.parse(fs.readFileSync(path.join(ORGANI, "ledvica.json"), "utf8"));
  const rv = j.prerez.ravnine[0];
  const l = Math.hypot(...rv.n);
  const n = rv.n.map((x) => x / l), d = (rv.d || 0) / l;
  for (const t of ["ovojnica", "skorja", "piramida", "meh"]) assert.ok(j.tkiva[t].rezPresek, `tkivo ${t}: rezPresek`);
  for (const f of ["ledvica.glb", "ledvica-telefon.glb"]) {
    const doc = await new NodeIO().registerExtensions(ALL_EXTENSIONS).read(path.join(ORGANI, f));
    let piramid = 0;
    for (const node of doc.getRoot().listNodes()) {
      const tk = node.getExtras()?.tkivo;
      if (!node.getMesh() || !["skorja", "piramida", "meh"].includes(tk)) continue;
      const m = preberi(node, node.getMesh().listPrimitives()[0]);
      const { zanke } = zankePreseka(m.P, m.F, n, d, 1e-6);
      const velike = zanke.filter((z) => Math.abs(ploscina(z)) > 2e-6); // > 2 mm²
      if (tk === "piramida") piramid += velike.length ? 1 : 0;
      else assert.ok(velike.length >= 1, `${f}: ${node.getName()} brez preseka`);
    }
    assert.ok(piramid >= 6, `${f}: sekanih piramid ${piramid}`);
  }
});

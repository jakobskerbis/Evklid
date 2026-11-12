// Pravi presek mreže z ravnino reza (public/3d/organ-presek.js, tkivo.rezPresek v organ.js): obris preseka je sklenjen,
// luknje ostanejo luknje, »polno« jih zapolni, »ovoj« da izbočeno podlago, »luknje« in »rob« dasta svetlino in steno cevi.
// Ledvica: skorja, ovojnica in meh dajo sklenjen obris; piramide na rezu so stožci iz papil modela (rezPiramide).
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

test("presek cevi: dvojna stena da obroč in svetlino, polna cev svetlino z obrobo; vrste oglišč", () => {
  const zunaj = kvader([-2, -2, -2], [2, 2, 2]);
  const znotraj = kvader([-1, -1, -1], [1, 1, 1], true);
  const pos = [...zunaj.pos, ...znotraj.pos];
  const idx = [...zunaj.idx, ...znotraj.idx.map((i) => i + zunaj.pos.length / 3)];
  const tri = (obris, luknje) => (luknje.length ? [[0, 1, 4], [1, 5, 4]] : pahljaca(obris)); // obroč: dovolj je nekaj trikotnikov
  const votla = presekMreze(pos, idx, [1, 0, 0], 0, { luknje: true, trianguliraj: tri });
  assert.deepEqual([...new Set(votla.vrste)].sort(), [0, 2], "stena (0) in svetlina (2)");
  assert.equal(votla.vrste.length, votla.polozaji.length / 3);
  const polna = presekMreze(zunaj.pos, zunaj.idx, [1, 0, 0], 0, { luknje: true, rob: 0.1, trianguliraj: tri });
  assert.deepEqual([...new Set(polna.vrste)].sort(), [1, 2], "polna cev: svetlina (2) z obrobo (1)");
  const samoRob = presekMreze(zunaj.pos, zunaj.idx, [1, 0, 0], 0, { brezPloskve: true, rob: 0.1, trianguliraj: tri });
  assert.ok(samoRob.indeksi.every((i) => samoRob.vrste[i] === 1), "samo obroba");
  assert.ok(Math.abs(samoRob.os.U[0]) < 1e-9 && Math.abs(samoRob.os.V[0]) < 1e-9, "osi ležita v ravnini");
});

test("presek ledvice: ravnina iz JSON seka skorjo, ovojnico in meh; piramide so stožci iz papil modela", async () => {
  const j = JSON.parse(fs.readFileSync(path.join(ORGANI, "ledvica.json"), "utf8"));
  const rv = j.prerez.ravnine[0];
  const l = Math.hypot(...rv.n);
  const n = rv.n.map((x) => x / l), d = (rv.d || 0) / l;
  for (const t of ["ovojnica", "skorja", "meh"]) assert.ok(j.tkiva[t].rezPresek, `tkivo ${t}: rezPresek`);
  assert.ok(j.tkiva.meh.rezVotlina, "meh: odprta votlina");
  const stozci = j.tkiva.skorja.rezPiramide.seznam;
  assert.ok(stozci.length >= 8 && stozci.length <= 12, `piramid ${stozci.length}`);
  assert.deepEqual(j.tkiva.ovojnica.rezPiramide.seznam, stozci, "ovojnica in skorja rišeta iste piramide");
  for (const f of ["ledvica.glb", "ledvica-telefon.glb"]) {
    const doc = await new NodeIO().registerExtensions(ALL_EXTENSIONS).read(path.join(ORGANI, f));
    const papile = [];
    for (const node of doc.getRoot().listNodes()) {
      const tk = node.getExtras()?.tkivo;
      if (!node.getMesh() || !["skorja", "ovojnica", "meh", "papila"].includes(tk)) continue;
      const m = preberi(node, node.getMesh().listPrimitives()[0]);
      if (tk === "papila") {
        const c = [0, 0, 0];
        for (let i = 0; i < m.P.length; i++) c[i % 3] += m.P[i] / (m.P.length / 3);
        papile.push(c);
        continue;
      }
      const { zanke } = zankePreseka(m.P, m.F, n, d, 1e-6);
      assert.ok(zanke.some((z) => Math.abs(ploscina(z)) > 2e-6), `${f}: ${node.getName()} brez preseka`);
    }
    // vrh vsakega stožca leži ob papili modela (≤ 6 mm), dolžina in polkot sta v mejah prave piramide
    for (const s of stozci) {
      const naj = Math.min(...papile.map((p) => Math.hypot(p[0] - s[0], p[1] - s[1], p[2] - s[2])));
      assert.ok(naj < 0.006, `${f}: vrh stožca ${s.slice(0, 3)} je ${(naj * 1000).toFixed(1)} mm od najbližje papile`);
      assert.ok(Math.abs(Math.hypot(s[3], s[4], s[5]) - 1) < 1e-3, "os stožca je enotska");
      assert.ok(s[6] > 0.007 && s[6] < 0.02 && s[7] > 0.25 && s[7] < 0.65, `mere stožca ${s.slice(6)}`);
    }
  }
});

// Atlas v2: izvleče eno strukturo (vozel) iz sloja telesa v binarni PLY (svetovne koordinate v metrih, Y gor),
// za Python (trimesh). meshopt in kvantizacija se razpakirata, barva oglišč (COLOR_0, pečena senca) ostane.
//   node scripts/atlas/v2/izvleci.mjs <sloj.glb> <ime vozla> <izhod.ply>
// Primer: node scripts/atlas/v2/izvleci.mjs public/3d/modeli/telo-hd/okostje.glb Femur.l /tmp/femur-hd.ply
// Indeksi se ne zvarijo (to je del meritve izhodišča); vhodna datoteka ostane nespremenjena.
import fs from "node:fs";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { MeshoptDecoder } from "meshoptimizer";

const [vhod, ime, izhod] = process.argv.slice(2);
if (!vhod || !ime || !izhod) {
  console.error("uporaba: izvleci.mjs <sloj.glb> <ime vozla> <izhod.ply>");
  process.exit(2);
}
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ "meshopt.decoder": MeshoptDecoder });
const doc = await io.read(vhod);
// izvoz Z-Anatomy doda pripono ».001« (atlas.js jo odreže)
const cilj = doc.getRoot().listNodes().find((n) => n.getName().replace(/\.\d{3}$/, "") === ime);
if (!cilj || !cilj.getMesh()) {
  console.error(`vozla »${ime}« z mrežo ni v ${vhod}`);
  process.exit(1);
}
const M = cilj.getWorldMatrix();
const tocke = [], barve = [], tri = [];
for (const p of cilj.getMesh().listPrimitives()) {
  if (p.getMode() !== 4) throw new Error("primitiv ni TRIANGLES");
  const pos = p.getAttribute("POSITION"), col = p.getAttribute("COLOR_0"), idx = p.getIndices();
  const z = tocke.length, v = [0, 0, 0], c = [0, 0, 0, 1];
  for (let i = 0; i < pos.getCount(); i++) {
    pos.getElement(i, v); // getElement upošteva »normalized« (kvantizacija); preostanek je v matriki vozla
    tocke.push([M[0] * v[0] + M[4] * v[1] + M[8] * v[2] + M[12], M[1] * v[0] + M[5] * v[1] + M[9] * v[2] + M[13], M[2] * v[0] + M[6] * v[1] + M[10] * v[2] + M[14]]);
    if (col) { col.getElement(i, c); barve.push([c[0], c[1], c[2]]); } else barve.push([1, 1, 1]);
  }
  const n = idx ? idx.getCount() : pos.getCount();
  for (let i = 0; i < n; i += 3) tri.push([0, 1, 2].map((k) => z + (idx ? idx.getScalar(i + k) : i + k)));
}
const glava = `ply\nformat binary_little_endian 1.0\ncomment ${ime} iz ${vhod}\nelement vertex ${tocke.length}\nproperty float x\nproperty float y\nproperty float z\nproperty uchar red\nproperty uchar green\nproperty uchar blue\nelement face ${tri.length}\nproperty list uchar int vertex_indices\nend_header\n`;
const b = Buffer.alloc(tocke.length * 15 + tri.length * 13);
let o = 0;
tocke.forEach((t, i) => {
  for (const x of t) { b.writeFloatLE(x, o); o += 4; }
  for (const x of barve[i]) { b.writeUInt8(Math.max(0, Math.min(255, Math.round(x * 255))), o); o += 1; }
});
for (const t of tri) { b.writeUInt8(3, o); o += 1; for (const x of t) { b.writeInt32LE(x, o); o += 4; } }
fs.writeFileSync(izhod, Buffer.concat([Buffer.from(glava, "latin1"), b]));
const det = M[0] * (M[5] * M[10] - M[6] * M[9]) - M[4] * (M[1] * M[10] - M[2] * M[9]) + M[8] * (M[1] * M[6] - M[2] * M[5]);
console.log(JSON.stringify({ vhod, ime, primitivi: cilj.getMesh().listPrimitives().length, oglisca: tocke.length, trikotniki: tri.length, zrcaljeno: det < 0 }));

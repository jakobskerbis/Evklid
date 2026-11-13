// Naslikane ledvične piramide (ledvica.json, tkiva.skorja/ovojnica.rezPiramide.seznam) po novem izvozu ledvice:
// vrh vsake piramide = središče njene čaše (izpis »[organi] čaše« izvoza, premaknjen v koordinate GLB s središčem škatle
// ledvičnega meha), dolžina = razdalja od vrha vzdolž osi do obrisa ovojnice v ravnini reza minus debelina skorje.
// Zagon: node scripts/atlas/ledvica-piramide.mjs <izvoz.log> [--skorja 0.0088] [--suho]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { zankePreseka } from "../../public/3d/organ-presek.js";
import { preberi } from "./zile-mreza.mjs";

const ORGANI = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "public", "3d", "modeli", "organi-3d");
const a = process.argv.slice(2);
const dnevnik = fs.readFileSync(a[0], "utf8");
const skorja = a.includes("--skorja") ? +a[a.indexOf("--skorja") + 1] : 0.0088;
const case_ = [...dnevnik.match(/\[organi\] čaše[^\n]*/)[0].matchAll(/\('([a-z])', ([-\d.e]+), ([-\d.e]+), ([-\d.e]+), ([-\d.e]+)\)/g)].map((m) => ({ crka: m[1], x: +m[2], z: +m[3], ox: +m[4], oz: +m[5] }));
const sk = dnevnik.match(/meh škatla \(Blender\): \[([^\]]+)\] \[([^\]]+)\]/);
const lo = sk[1].split(",").map(Number), hi = sk[2].split(",").map(Number);
const p = path.join(ORGANI, "ledvica.json");
const j = JSON.parse(fs.readFileSync(p, "utf8"));
const rv = j.prerez.ravnine[0];
const yr = +dnevnik.match(/ravnina meha \(Blender y\): ([-\d.e]+)/)[1];
const doc = await new NodeIO().registerExtensions(ALL_EXTENSIONS).read(path.join(ORGANI, "ledvica.glb"));
let meh = null, ovoj = null;
for (const node of doc.getRoot().listNodes()) {
  const tk = node.getExtras()?.tkivo;
  if (!node.getMesh()) continue;
  if (tk === "meh") meh = preberi(node, node.getMesh().listPrimitives()[0]);
  if (tk === "ovojnica") ovoj = preberi(node, node.getMesh().listPrimitives()[0]);
}
const skatla = (P) => { const l = [1e9, 1e9, 1e9], h = [-1e9, -1e9, -1e9]; for (let i = 0; i < P.length; i++) { l[i % 3] = Math.min(l[i % 3], P[i]); h[i % 3] = Math.max(h[i % 3], P[i]); } return [l, h]; };
const [ml, mh] = skatla(meh.P);
// Blender (x, y, z) → GLB (x, z, −y) + zamik
const dx = (ml[0] + mh[0]) / 2 - (lo[0] + hi[0]) / 2, dy = (ml[1] + mh[1]) / 2 - (lo[2] + hi[2]) / 2;
// ravnina reza = ravnina čaš (Blender y = yr → GLB z); središče škatle modela se z vsakim izvozom premakne
const zr = +(-(yr - (lo[1] + hi[1]) / 2) + (ml[2] + mh[2]) / 2).toFixed(5);
console.log("ravnina z =", zr, "(prej d =", rv.d, ")");
rv.d = +(-zr * rv.n[2]).toFixed(5);
for (const t of Object.values(j.tkiva)) for (const k of ["sredisce", "sredisce2"]) if (t.rezZarki?.[k]) t.rezZarki[k][2] = zr;
for (const c of j.tkiva.ovojnica.rezPiramide.sinus?.kapsule || []) c[2] = c[5] = zr;
const { zanke } = zankePreseka(ovoj.P, ovoj.F, [0, 0, 1], -zr, 1e-6);
const dalj = [];
for (const z of zanke) for (let i = 0; i < z.length; i++) dalj.push([z[i], z[(i + 1) % z.length]]);
function doObrisa(o, s) { // najdaljši zadetek žarka o + t s z obrisom ovojnice
  let naj = 0;
  for (const [A, B] of dalj) {
    const ex = B[0] - A[0], ey = B[1] - A[1], den = s[0] * ey - s[1] * ex;
    if (Math.abs(den) < 1e-12) continue;
    const t = ((A[0] - o[0]) * ey - (A[1] - o[1]) * ex) / den, u = ((A[0] - o[0]) * s[1] - (A[1] - o[1]) * s[0]) / den;
    if (t > 0 && u >= 0 && u <= 1) naj = Math.max(naj, t);
  }
  return naj;
}
const crke = "abcdefghi";
const sez = j.tkiva.skorja.rezPiramide.seznam.map((c, i) => {
  const k = case_.find((x) => x.crka === crke[i]);
  if (!k) return c;
  const o = [+(k.x + dx).toFixed(5), +(k.z + dy).toFixed(5), +zr.toFixed(5)];
  const os = [c[3], c[4], c[5]];
  const d = doObrisa(o, os);
  const dol = d > 0 ? Math.min(0.0195, Math.max(0.0075, d - skorja)) : c[6];
  console.log(crke[i], o.map((x) => (x * 1000).toFixed(1)).join(", "), "do obrisa", (d * 1000).toFixed(1), "mm → dolžina", (dol * 1000).toFixed(1));
  return [...o, ...os, +dol.toFixed(4), c[7], c[8]];
});
if (!a.includes("--suho")) {
  j.tkiva.skorja.rezPiramide.seznam = sez;
  j.tkiva.ovojnica.rezPiramide.seznam = sez;
  fs.writeFileSync(p, JSON.stringify(j, null, 1) + "\n");
}

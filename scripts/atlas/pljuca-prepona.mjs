// Prepona pod pljuči (docs/3d.md »Lung finishing«): node scripts/atlas/pljuca-prepona.mjs [--suho]
// Pljuča brez prepone so imela na dnu odprto kupolo (prepona je pljučem pritisnila bazo navznoter): v prerezu se je
// pod pljuči videla notranjost te kupole brez pokrova, od zadaj in spodaj so bili spodnji režnji videti kot odprte
// lupine (ocena posnetkov 18. 11.). Skripta doda Z-Anatomy prepono (CC BY-SA 4.0, isti vir kot pljuča) iz telesnega
// atlasa (telo-hd/misice.glb za računalnik, telo/misice.glb za telefon), premaknjeno v prostor pljuč: premik je razlika
// središč škatel režnjev v telo-hd/organi.glb in pljuca.glb (enak za vseh pet režnjev do 0,4 mm, merilo 1). Kraka
// prepone (crus) proti ledvenim vretencem sta odrezana 2 cm pod najnižjo točko pljuč (sicer bi bila škatla organa dvakrat
// višja). Enkrat (vozlišče »Diaphragm« z extras tkivo/del »prepona«); pljuca.glb in pljuca-telefon.glb na mestu.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { MeshoptDecoder } from "meshoptimizer";
import * as G from "./zile-mreza.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const MODELI = path.join(ROOT, "public", "3d", "modeli");
export const POD = 0; // rebrni del in kraka odrežemo pri najnižji točki pljuč (spodaj bi visela kot krilo, ocena 18. 11.)
const REZNJI = /^(Superior|Middle|Inferior) lobe of (left|right) lung/;

await MeshoptDecoder.ready;
const io = () => new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ "meshopt.decoder": MeshoptDecoder });
const skatla = (W) => {
  const a = [Infinity, Infinity, Infinity], b = [-Infinity, -Infinity, -Infinity];
  for (const p of W) for (let k = 0; k < 3; k++) { a[k] = Math.min(a[k], p[k]); b[k] = Math.max(b[k], p[k]); }
  return [a, b];
};
const mreze = (doc, rx) => doc.getRoot().listNodes().filter((n) => n.getMesh() && rx.test(n.getName())).map((n) => [n.getName().replace(/\.\d+$/, ""), G.preberi(n, n.getMesh().listPrimitives()[0])]);

export async function dodaj(cilj, telo, { suho = false } = {}) {
  const doc = await io().read(cilj);
  if (doc.getRoot().listNodes().some((n) => n.getExtras()?.tkivo === "prepona")) return [`${path.basename(cilj)}: prepona že dodana (brez sprememb)`];
  const [organi, misice] = await Promise.all([io().read(path.join(MODELI, telo, "organi.glb")), io().read(path.join(MODELI, telo, "misice.glb"))]);
  // premik telo → pljuča: povprečje razlik središč škatel režnjev
  const vTelesu = new Map(mreze(organi, REZNJI));
  const premiki = [];
  let dno = Infinity;
  for (const [ime, m] of mreze(doc, REZNJI)) {
    const t = vTelesu.get(ime);
    if (!t) throw new Error(`${telo}/organi.glb: ni režnja ${ime}`);
    const [a, b] = skatla(m.W), [c, d] = skatla(t.W);
    premiki.push([0, 1, 2].map((k) => (a[k] + b[k]) / 2 - (c[k] + d[k]) / 2));
    dno = Math.min(dno, a[1]);
  }
  const t = [0, 1, 2].map((k) => premiki.reduce((s, p) => s + p[k], 0) / premiki.length);
  const raztros = Math.max(...premiki.map((p) => Math.hypot(p[0] - t[0], p[1] - t[1], p[2] - t[2])));
  if (raztros > 0.002) throw new Error(`${path.basename(cilj)}: režnji v telesu niso le premaknjeni (raztros ${(raztros * 1000).toFixed(1)} mm)`);
  const [[, p]] = mreze(misice, /^Diaphragm(\.\d+)?$/);
  const meja = dno - POD;
  const P = [], N = [], F = [], nova = new Map();
  const nor = p.A.get("NORMAL");
  for (let f = 0; f < p.F.length; f += 3) {
    const ix = [p.F[f], p.F[f + 1], p.F[f + 2]];
    if (ix.every((i) => p.P[i * 3 + 1] + t[1] < meja)) continue;
    for (const i of ix) {
      if (!nova.has(i)) {
        nova.set(i, P.length / 3);
        P.push(p.P[i * 3] + t[0], p.P[i * 3 + 1] + t[1], p.P[i * 3 + 2] + t[2]);
        if (nor) N.push(nor.d[i * nor.n], nor.d[i * nor.n + 1], nor.d[i * nor.n + 2]);
      }
      F.push(nova.get(i));
    }
  }
  // odrezana kraka: odprtine zapremo s pahljačo okoli središča (zaprta mreža kot ostali deli, test 3d-mreze)
  const m = { P, F, A: new Map() };
  G.zvari(m);
  let zaprtih = 0;
  for (const z of G.zanke(m)) {
    const c = [0, 0, 0];
    for (const e of z) for (let k = 0; k < 3; k++) c[k] += P[e.r * 3 + k] / z.length;
    const ic = P.length / 3;
    P.push(...c);
    if (nor) N.push(0, -1, 0);
    for (const e of z) F.push(e.r2, e.r, ic);
    zaprtih++;
  }
  const por = [`${path.basename(cilj)}: prepona iz ${telo}/misice.glb, premik ${t.map((x) => (x * 1000).toFixed(1)).join(", ")} mm (raztros ${(raztros * 1000).toFixed(1)} mm), ${P.length / 3} oglišč, ${F.length / 3} trikotnikov, kraka odrezana pod y = ${(meja * 1000).toFixed(0)} mm, zaprtih odprtin ${zaprtih}`];
  if (suho) return por;
  const buf = doc.getRoot().listBuffers()[0];
  const prim = doc.createPrimitive()
    .setAttribute("POSITION", doc.createAccessor().setType("VEC3").setArray(new Float32Array(P)).setBuffer(buf))
    .setIndices(doc.createAccessor().setType("SCALAR").setArray(P.length / 3 > 65535 ? new Uint32Array(F) : new Uint16Array(F)).setBuffer(buf))
    .setMaterial(doc.createMaterial("prepona").setBaseColorFactor([0.62, 0.2, 0.2, 1]).setRoughnessFactor(0.5).setMetallicFactor(0));
  if (N.length) prim.setAttribute("NORMAL", doc.createAccessor().setType("VEC3").setArray(new Float32Array(N)).setBuffer(buf));
  // UV in barva oglišč kot pri drugih delih (organ.js riše z barvami oglišč; R = pečena senca okolice, 1 = brez sence).
  // Tkivo »prepona« ima tekstura: false, zato UV ne bere nobene mape.
  const n = P.length / 3;
  prim.setAttribute("TEXCOORD_0", doc.createAccessor().setType("VEC2").setArray(new Float32Array(n * 2).fill(0.5)).setBuffer(buf));
  const barve = new Float32Array(n * 4);
  for (let i = 0; i < n; i++) { barve[i * 4] = 1; barve[i * 4 + 3] = 1; }
  prim.setAttribute("COLOR_0", doc.createAccessor().setType("VEC4").setArray(barve).setBuffer(buf));
  const vozel = doc.createNode("Diaphragm").setMesh(doc.createMesh("Diaphragm").addPrimitive(prim)).setExtras({ tkivo: "prepona", del: "prepona", ime: "Diaphragm" });
  doc.getRoot().listScenes()[0].addChild(vozel);
  await io().write(cilj, doc);
  return por;
}

async function glavni() {
  const suho = process.argv.includes("--suho");
  const j = path.join(MODELI, "organi-3d", "pljuca.json");
  const podatki = JSON.parse(fs.readFileSync(j, "utf8"));
  for (const [ime, telo, kljuc] of [["pljuca.glb", "telo-hd", "racunalnik"], ["pljuca-telefon.glb", "telo", "telefon"]]) {
    const pot = path.join(MODELI, "organi-3d", ime);
    for (const v of await dodaj(pot, telo, { suho })) console.log(v);
    if (suho) continue;
    const doc = await io().read(pot);
    let tri = 0;
    for (const mesh of doc.getRoot().listMeshes()) for (const q of mesh.listPrimitives()) tri += q.getIndices().getCount() / 3;
    podatki.trikotniki[kljuc] = tri;
  }
  if (!suho) fs.writeFileSync(j, JSON.stringify(podatki, null, 1) + "\n");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await glavni();

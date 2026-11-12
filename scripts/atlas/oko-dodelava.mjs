// Dodelava očesa po izvozu (docs/3d.md »Eye finishing«): node scripts/atlas/oko-dodelava.mjs [--suho]
// Vidni živec iz Z-Anatomy je ob zrklu tanek (≈ 1,9 mm), na koncu pa ima kavelj (del proti križišču vidnih živcev, ki
// brez lobanje visi v prazno). Pravi živec v očnici je debel 3–4 mm (z ovojnicami), dolg ≈ 25–30 mm in v rahlem
// loku S teče od papile do vrha očnice, kjer gre skozi skupni kitni obroč v vidni kanal. Skripta mrežo živca zamenja
// s cevjo po tej poti: od papile (središče dela optic_disc) skozi kitni obroč (Common tendinous ring), raven odrezan
// konec ob vidnem kanalu. Barva: UV in barva oglišča enega oglišča stare mreže (živec je enobarven).
// Enkrat (vozlišče dobi extras »cev«); oko.glb in oko-telefon.glb na mestu.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import * as G from "./zile-mreza.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const MAPA = path.join(ROOT, "public", "3d", "modeli", "organi-3d");
export const POLMER = 0.00175; // 3,5 mm debel živec z ovojnicami

const sredina = (W) => { const c = [0, 0, 0]; for (const p of W) for (let k = 0; k < 3; k++) c[k] += p[k] / W.length; return c; };

// Os živca: kubična Bézierjeva krivulja od papile (iz zrkla naravnost ven) do točke za kitnim obročem, z rahlim S.
export function osZivca(papila, zrklo, obroc, n) {
  const d0 = G.v3.norm(G.v3.sub(papila, zrklo));
  const zac = G.v3.add(papila, G.v3.mul(d0, 0.0011)); // začetek v beločnici za papilo (ne sega v zrklo)
  const dE = G.v3.norm(G.v3.sub(obroc, zac));
  const kon = G.v3.add(obroc, G.v3.mul(dE, 0.004)); // 4 mm za obročem: vhod v vidni kanal
  const s = G.v3.norm(G.v3.cross(dE, [0, 1, 0]));
  const l = G.v3.dist(zac, kon);
  const b1 = G.v3.add(G.v3.add(zac, G.v3.mul(d0, 0.33 * l)), G.v3.mul(s, 0.07 * l));
  const b2 = G.v3.add(G.v3.sub(kon, G.v3.mul(dE, 0.33 * l)), G.v3.mul(s, -0.07 * l));
  const t = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n, v = 1 - u;
    t.push([0, 1, 2].map((c) => v * v * v * zac[c] + 3 * v * v * u * b1[c] + 3 * v * u * u * b2[c] + u * u * u * kon[c]));
  }
  return t;
}

// Cev okoli osi (vzporedni prenos okvirja), z ravnima pokrovoma. Vrne { P: [[x,y,z]], N: [[x,y,z]], F: [i…] }.
export function cev(os, polmer, stranic) {
  const P = [], N = [], F = [];
  let x = null;
  const tang = (i) => G.v3.norm(G.v3.sub(os[Math.min(os.length - 1, i + 1)], os[Math.max(0, i - 1)]));
  for (let i = 0; i < os.length; i++) {
    const t = tang(i);
    x = x ? G.v3.norm(G.v3.sub(x, G.v3.mul(t, G.v3.dot(x, t)))) : G.v3.norm(G.v3.cross(t, Math.abs(t[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0]));
    const y = G.v3.cross(t, x);
    for (let j = 0; j < stranic; j++) {
      const a = (2 * Math.PI * j) / stranic;
      const n = G.v3.add(G.v3.mul(x, Math.cos(a)), G.v3.mul(y, Math.sin(a)));
      P.push(G.v3.add(os[i], G.v3.mul(n, polmer)));
      N.push(n);
    }
  }
  for (let i = 0; i + 1 < os.length; i++) for (let j = 0; j < stranic; j++) {
    const a = i * stranic + j, b = i * stranic + (j + 1) % stranic, c = a + stranic, d = b + stranic;
    F.push(a, b, d, a, d, c);
  }
  // pokrova: svoja oglišča z normalo vzdolž osi (raven rez)
  for (const [i, smer] of [[0, -1], [os.length - 1, 1]]) {
    const n = G.v3.mul(tang(i), smer);
    const s0 = P.length;
    for (let j = 0; j < stranic; j++) { P.push(P[i * stranic + j].slice()); N.push(n); }
    P.push(os[i].slice()); N.push(n);
    for (let j = 0; j < stranic; j++) {
      const a = s0 + j, b = s0 + (j + 1) % stranic, c = s0 + stranic;
      if (smer > 0) F.push(a, b, c); else F.push(b, a, c);
    }
  }
  // usmeritev navzven: prostornina mora biti pozitivna
  let v = 0;
  for (let q = 0; q < F.length; q += 3) v += G.v3.dot(P[F[q]], G.v3.cross(P[F[q + 1]], P[F[q + 2]]));
  if (v < 0) for (let q = 0; q < F.length; q += 3) { const a = F[q + 1]; F[q + 1] = F[q + 2]; F[q + 2] = a; }
  return { P, N, F };
}

export async function dodelaj(datoteka, { suho = false } = {}) {
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
  const doc = await io.read(datoteka);
  const telefon = /-telefon\.glb$/.test(datoteka);
  const vozl = (rx) => doc.getRoot().listNodes().find((n) => n.getMesh() && rx.test(n.getName()));
  const zivec = vozl(/^Optic nerve/), papila = vozl(/^optic_disc/), belocnica = vozl(/^sclera/), obroc = vozl(/^Common tendinous ring/);
  if (!zivec || !papila || !belocnica || !obroc) throw new Error(`${path.basename(datoteka)}: manjka živec, papila, beločnica ali kitni obroč`);
  if (zivec.getExtras()?.cev) return [`${path.basename(datoteka)}: vidni živec je že cev (brez sprememb)`];
  const W = (n) => G.preberi(n, n.getMesh().listPrimitives()[0]).W;
  const os = osZivca(sredina(W(papila)), sredina(W(belocnica)), sredina(W(obroc)), telefon ? 14 : 28);
  const c = cev(os, POLMER, telefon ? 10 : 16);
  const prim = zivec.getMesh().listPrimitives()[0];
  const m = G.preberi(zivec, prim);
  // vir atributov: oglišče stare mreže najbližje sredini osi (stran od zrkla in od kavlja)
  const n0 = m.P.length / 3;
  const sr = os[Math.floor(os.length / 2)];
  let vir = 0, bd = Infinity;
  for (let r = 0; r < n0; r++) { const d = G.v3.dist([m.P[r * 3], m.P[r * 3 + 1], m.P[r * 3 + 2]], sr); if (d < bd) { bd = d; vir = r; } }
  for (let i = 0; i < c.P.length; i++) G.dodajOglisce(m, c.P[i], [[vir, 1]], m.A.has("NORMAL") ? { NORMAL: c.N[i] } : {});
  // stara oglišča odpadejo
  m.P = m.P.slice(n0 * 3);
  for (const a of m.A.values()) a.d = a.d.slice(n0 * a.n);
  m.F = c.F.slice();
  m.spremenjeno = true;
  G.zvari(m);
  let dol = 0;
  for (let i = 0; i + 1 < os.length; i++) dol += G.v3.dist(os[i], os[i + 1]);
  const por = [`${path.basename(datoteka)}: vidni živec ${n0} → ${c.P.length} oglišč, cev ${(2 * POLMER * 1000).toFixed(1)} mm × ${(dol * 1000).toFixed(0)} mm`];
  if (suho) return por;
  G.zapisi(doc, zivec, prim, m);
  zivec.setExtras({ ...(zivec.getExtras() || {}), cev: 1 });
  await io.write(datoteka, doc);
  return por;
}

async function glavni() {
  const suho = process.argv.includes("--suho");
  const j = path.join(MAPA, "oko.json");
  const podatki = JSON.parse(fs.readFileSync(j, "utf8"));
  for (const [ime, kljuc] of [["oko.glb", "racunalnik"], ["oko-telefon.glb", "telefon"]]) {
    for (const v of await dodelaj(path.join(MAPA, ime), { suho })) console.log(v);
    if (suho) continue;
    const doc = await new NodeIO().registerExtensions(ALL_EXTENSIONS).read(path.join(MAPA, ime));
    let tri = 0;
    for (const mesh of doc.getRoot().listMeshes()) for (const p of mesh.listPrimitives()) tri += p.getIndices().getCount() / 3;
    podatki.trikotniki[kljuc] = tri;
  }
  if (!suho) fs.writeFileSync(j, JSON.stringify(podatki, null, 1) + "\n");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await glavni();

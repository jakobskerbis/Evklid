// Dodelava ledvice po izvozu (docs/3d.md »Kidney finishing«): node scripts/atlas/ledvica-dodelava.mjs [--suho]
// Ledvična vena iz Z-Anatomy je 15 mm dolg štrcelj, ki iz hilusa kaže naravnost naprej (proti kameri pogleda »celota«),
// z ≈ 2,5 mm debelo steno: na sliki je bila debel moder obroč (j 16. 11.). Prava vena teče iz hilusa medialno pred
// arterijo, ima premer ≈ 1 cm in tanko steno (≈ 0,5 mm). Skripta mrežo vene zamenja s cevjo z dvojno steno: iz hilusa
// najprej v smeri starega štrclja, nato v loku medialno (vzporedno z arterijo, pred in pod njo), z ravno odrezanim
// odprtim koncem (obroč stene in svetlina). Barva: atributi enega oglišča stare mreže (vena je enobarvna).
// Enkrat (vozlišče dobi extras »cev«); ledvica.glb in ledvica-telefon.glb na mestu. Poženi za debelina-cevi.mjs.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import * as G from "./zile-mreza.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const MAPA = path.join(ROOT, "public", "3d", "modeli", "organi-3d");
export const POLMER = 0.0048; // zunanji polmer (premer ≈ 1 cm, kot debelina-cevi.mjs)
export const STENA = 0.0006; // debelina stene
export const RAZMIK = 0.001; // reža med veno in arterijo na medialnem koncu
// UV nove cevi: majhna krpa (± UV_KRPA) okoli točke na stari krpi vene, kjer so pečene mape (ORM, normalna) v okolici
// 7 × 7 pik enakomerne in normalna mapa ravna (preverjeno na obeh slikah). Ena sama točka UV za vsa oglišča ne gre:
// senčilnik računa tangentni prostor normalne mape iz odvodov UV, brez njih je osvetlitev ploska in bleda.
const UV = { racunalnik: [0.89465, 0.26308], telefon: [0.89075, 0.16046] };
const UV_KRPA = 0.0006;

const v3 = G.v3;

// Os vene: kubična Bézierjeva krivulja od hilusa (konec starega štrclja ob ledvici) v smeri štrclja, nato medialno do
// točke »kon« pod medialnim koncem arterije; tam teče vzporedno z arterijo (smer »medialno«).
export function osVene(hilus, smer, kon, medialno, n) {
  const l = v3.dist(hilus, kon);
  const b1 = v3.add(hilus, v3.mul(smer, 0.4 * l));
  const b2 = v3.sub(kon, v3.mul(medialno, 0.45 * l));
  const t = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n, v = 1 - u;
    t.push([0, 1, 2].map((c) => v * v * v * hilus[c] + 3 * v * v * u * b1[c] + 3 * v * u * u * b2[c] + u * u * u * kon[c]));
  }
  return t;
}

// Cev z dvojno steno okoli osi (vzporedni prenos okvirja): zunanji in notranji plašč ter obroča stene na obeh koncih
// (zaprta ploskev, rod 1). Vrne { P: [[x,y,z]], N: [[x,y,z]], F: [i…] }, normale navzven iz stene.
export function cevSSteno(os, zunanji, notranji, stranic) {
  const P = [], N = [], F = [], T = []; // T: parametra (po obodu, vzdolž osi) v [−0,5, 0,5] za UV
  let x = null;
  const tang = (i) => v3.norm(v3.sub(os[Math.min(os.length - 1, i + 1)], os[Math.max(0, i - 1)]));
  const obroci = []; // [i] → { smeri }
  for (let i = 0; i < os.length; i++) {
    const t = tang(i);
    x = x ? v3.norm(v3.sub(x, v3.mul(t, v3.dot(x, t)))) : v3.norm(v3.cross(t, Math.abs(t[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0]));
    const y = v3.cross(t, x);
    const s = [];
    for (let j = 0; j < stranic; j++) {
      const a = (2 * Math.PI * j) / stranic;
      s.push(v3.add(v3.mul(x, Math.cos(a)), v3.mul(y, Math.sin(a))));
    }
    obroci.push(s);
  }
  const plasc = (r, znak) => {
    const s0 = P.length;
    for (let i = 0; i < os.length; i++) for (let j = 0; j < stranic; j++) { P.push(v3.add(os[i], v3.mul(obroci[i][j], r))); N.push(v3.mul(obroci[i][j], znak)); T.push([j / stranic - 0.5, i / (os.length - 1) - 0.5]); }
    for (let i = 0; i + 1 < os.length; i++) for (let j = 0; j < stranic; j++) {
      const a = s0 + i * stranic + j, b = s0 + i * stranic + ((j + 1) % stranic), c = a + stranic, d = b + stranic;
      if (znak > 0) F.push(a, b, d, a, d, c); else F.push(a, d, b, a, c, d);
    }
  };
  plasc(zunanji, 1);
  plasc(notranji, -1);
  // obroča stene na koncih: svoja oglišča z normalo vzdolž osi (raven rez)
  for (const [i, smer] of [[0, -1], [os.length - 1, 1]]) {
    const n = v3.mul(tang(i), smer);
    const s0 = P.length;
    for (let j = 0; j < stranic; j++) { P.push(v3.add(os[i], v3.mul(obroci[i][j], zunanji))); N.push(n); T.push([j / stranic - 0.5, 0.5]); }
    for (let j = 0; j < stranic; j++) { P.push(v3.add(os[i], v3.mul(obroci[i][j], notranji))); N.push(n); T.push([j / stranic - 0.5, 0.3]); }
    for (let j = 0; j < stranic; j++) {
      const a = s0 + j, b = s0 + ((j + 1) % stranic), c = a + stranic, d = b + stranic;
      if (smer > 0) F.push(a, d, c, a, b, d); else F.push(a, c, d, a, d, b);
    }
  }
  // usmeritev navzven: prostornina stene mora biti pozitivna
  let v = 0;
  for (let q = 0; q < F.length; q += 3) v += v3.dot(P[F[q]], v3.cross(P[F[q + 1]], P[F[q + 2]]));
  if (v < 0) for (let q = 0; q < F.length; q += 3) { const a = F[q + 1]; F[q + 1] = F[q + 2]; F[q + 2] = a; }
  return { P, N, F, T };
}

// glavna smer oblaka točk (potenčna metoda na kovariančni matriki)
function glavnaSmer(W, c) {
  const C = [0, 0, 0, 0, 0, 0];
  for (const p of W) {
    const x = p[0] - c[0], y = p[1] - c[1], z = p[2] - c[2];
    C[0] += x * x; C[1] += x * y; C[2] += x * z; C[3] += y * y; C[4] += y * z; C[5] += z * z;
  }
  let a = [1, 0.7, 0.4];
  for (let k = 0; k < 80; k++) a = v3.norm([C[0] * a[0] + C[1] * a[1] + C[2] * a[2], C[1] * a[0] + C[3] * a[1] + C[4] * a[2], C[2] * a[0] + C[4] * a[1] + C[5] * a[2]]);
  return a;
}
const sredina = (W) => { const c = [0, 0, 0]; for (const p of W) for (let k = 0; k < 3; k++) c[k] += p[k] / W.length; return c; };

export async function dodelaj(datoteka, { suho = false } = {}) {
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
  const doc = await io.read(datoteka);
  const telefon = /-telefon\.glb$/.test(datoteka);
  const vozl = (rx) => doc.getRoot().listNodes().find((n) => n.getMesh() && rx.test(n.getName()));
  const vena = vozl(/^Left renal vein$/), arterija = vozl(/^Left renal artery$/), ovojnica = doc.getRoot().listNodes().filter((n) => n.getMesh() && n.getExtras()?.del === "ovojnica");
  if (!vena || !arterija || !ovojnica.length) throw new Error(`${path.basename(datoteka)}: manjka ledvična vena, arterija ali ovojnica`);
  if (vena.getExtras()?.cev) return [`${path.basename(datoteka)}: ledvična vena je že cev (brez sprememb)`];
  const W = (n) => G.preberi(n, n.getMesh().listPrimitives()[0]).W;
  const Wv = W(vena), cv = sredina(Wv);
  const cl = sredina(ovojnica.flatMap(W)); // središče ledvice
  // smer štrclja od ledvice ven; hilus = konec štrclja ob ledvici
  let smer = glavnaSmer(Wv, cv);
  if (v3.dot(smer, v3.sub(cv, cl)) < 0) smer = v3.mul(smer, -1);
  let s0 = Infinity;
  for (const p of Wv) s0 = Math.min(s0, v3.dot(v3.sub(p, cv), smer));
  const hilus = v3.add(cv, v3.mul(smer, s0));
  // medialno: glavna smer arterije stran od ledvice; konec vene: pod medialnim koncem arterije (navzdol = −y, smer
  // sečevoda), z režo RAZMIK med plaščema
  const Wa = W(arterija), ca = sredina(Wa);
  let med = glavnaSmer(Wa, ca);
  if (v3.dot(med, v3.sub(ca, cl)) < 0) med = v3.mul(med, -1);
  let s1 = -Infinity;
  const ra = [];
  for (const p of Wa) { const d = v3.sub(p, ca), s = v3.dot(d, med); s1 = Math.max(s1, s); ra.push(v3.len(v3.sub(d, v3.mul(med, s)))); }
  ra.sort((x, y) => x - y);
  const polmerArterije = ra[Math.floor(ra.length * 0.75)];
  const dol = v3.norm(v3.sub([0, -1, 0], v3.mul(med, v3.dot([0, -1, 0], med))));
  const kon = v3.add(v3.add(ca, v3.mul(med, s1)), v3.mul(dol, POLMER + polmerArterije + RAZMIK));
  const os = osVene(hilus, smer, kon, med, telefon ? 10 : 20);
  const c = cevSSteno(os, POLMER, POLMER - STENA, telefon ? 12 : 24);
  const prim = vena.getMesh().listPrimitives()[0];
  const m = G.preberi(vena, prim);
  const n0 = m.P.length / 3;
  // vir drugih atributov (COLOR_0 = pečena senca okolice): najsvetlejše oglišče stare mreže
  const col = m.A.get("COLOR_0");
  let vir = 0;
  if (col) for (let r = 1; r < n0; r++) if (col.d[r * col.n] > col.d[vir * col.n]) vir = r;
  const uv0 = UV[telefon ? "telefon" : "racunalnik"];
  for (let i = 0; i < c.P.length; i++) {
    const attr = {};
    if (m.A.has("NORMAL")) attr.NORMAL = c.N[i];
    if (m.A.has("TEXCOORD_0")) attr.TEXCOORD_0 = [uv0[0] + c.T[i][0] * 2 * UV_KRPA, uv0[1] + c.T[i][1] * 2 * UV_KRPA];
    G.dodajOglisce(m, c.P[i], [[vir, 1]], attr);
  }
  m.P = m.P.slice(n0 * 3);
  for (const a of m.A.values()) a.d = a.d.slice(n0 * a.n);
  m.F = c.F.slice();
  m.spremenjeno = true;
  G.zvari(m);
  const por = [`${path.basename(datoteka)}: ledvična vena ${n0} → ${c.P.length} oglišč, cev ${(2 * POLMER * 1000).toFixed(1)} mm × ${(os.slice(1).reduce((d, p, i) => d + v3.dist(p, os[i]), 0) * 1000).toFixed(0)} mm, stena ${(STENA * 1000).toFixed(1)} mm; hilus ${hilus.map((x) => (x * 1000).toFixed(1))}, konec ${os[os.length - 1].map((x) => (x * 1000).toFixed(1))}`];
  if (suho) return por;
  G.zapisi(doc, vena, prim, m);
  const ex = { ...(vena.getExtras() || {}), cev: 1 };
  delete ex.debelinaCevi; // nova mreža ima pravi polmer; debelina-cevi.mjs je ne sme več raztegniti
  vena.setExtras(ex);
  await io.write(datoteka, doc);
  return por;
}

async function glavni() {
  const suho = process.argv.includes("--suho");
  const j = path.join(MAPA, "ledvica.json");
  const podatki = JSON.parse(fs.readFileSync(j, "utf8"));
  for (const [ime, kljuc] of [["ledvica.glb", "racunalnik"], ["ledvica-telefon.glb", "telefon"]]) {
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

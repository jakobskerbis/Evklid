// Dodelava pljuč po izvozu (docs/3d.md »Lung finishing«): node scripts/atlas/pljuca-dodelava.mjs [--suho]
// Režnji so pri izvozu skrčeni za 1,8 mm (reže med režnji) in poenostavljeni. Tanki robovi režnjev (spodnji rob ob
// preponi, rob ob srčni zarezi; debeli manj kot dvakratnik skrčka) so se pri tem obrnili navznoter: sprednja in zadnja
// ploskev lista sta se prekrižali. Od spredaj je zato vidna ploskev, ki je bila pri peki tik za drugo ploskvijo
// (črna senca okolice v barvi oglišč in v pečeni mapi, pokvarjena normalna mapa): temne oziroma sive lise z
// nazobčanim robom ob levem hilusu in spodaj (j 16. 11.). Skripta v vsakem režnju poišče ploskve, ki si iz bližine
// gledajo v obraz (strani lista v zamenjanem vrstnem redu), in jim posvetli pečeno senco okolice v ogliščih
// (COLOR_0.r) ter nastavi normale iz geometrije. Pred tem lista razpre (razpri, j 18. 11. »dokončaj prereze«):
// oglišča prekrižanih ploskev premakne za polovico razmika (+ 0,3 mm) vzdolž normale ploskve mimo sredine, nato jih z
// enim korakom Laplacea zgladi skupaj z obročem sosedov; do 25 krogov, skupaj največ 10 mm na oglišče. Sam premik
// ne konvergira (strani lista si delita oglišča roba), z glajenjem pa ostane le nekaj ploskev, ki jih posvetli
// posvetli(). Enkrat na izvoz (vozlišče dobi extras »razprto«). Pravi popravek je še vedno izvoz, ki tankih robov ne
// skrči čez polovico debeline (scripts/atlas/izvozi-organe.py, »skrci«), in nova peka. Pečeni mapi (senca, normalna) sta tam pokvarjeni, zato ju tkivo »pljuca« ne bere (pljuca.json:
// orm false, normala 0). Ponovljivo: drugi zagon ne spremeni nič. pljuca.glb in pljuca-telefon.glb na mestu.
import path from "node:path";
import { fileURLToPath } from "node:url";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import * as G from "./zile-mreza.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const MAPA = path.join(ROOT, "public", "3d", "modeli", "organi-3d");
const { v3 } = G;
export const SENCA = 0.85; // senca okolice (COLOR_0.r, 1 = brez sence) na prekrižanih ploskvah
export const SENCA_OBROC = 0.6; // najmanj toliko v sosednjih ogliščih (mehak prehod)
export const DOSEG = 0.006;
export const RAZPRI = { krogov: 25, cez: 0.0003, gladi: 0.5, najvec: 0.01 }; // prekrižani ploskvi sta največ toliko narazen (skrček 1,8 mm na vsaki strani + rezerva)

// Prekrižane ploskve: žarek iz težišča ploskve navzven najprej (bliže kot DOSEG) zadene ploskev iste mreže, ki gleda
// proti njej (normali nasprotni). Pri pravem tankem listu gledata ploskvi narazen; ploskvi, ki si gledata v obraz
// tako blizu, sta strani lista v zamenjanem vrstnem redu. Vrne [{ f, t, n }].
export function prekrizane(m) {
  const out = [];
  const T = m.F.length / 3;
  for (let f = 0; f < T; f++) {
    const nf = G.normalaPloskve(m, f);
    const l = v3.len(nf);
    if (l < 1e-12) continue;
    const n = v3.mul(nf, 1 / l);
    const a = G.pol(m, m.F[f * 3]), b = G.pol(m, m.F[f * 3 + 1]), c = G.pol(m, m.F[f * 3 + 2]);
    const o = v3.add(v3.mul(v3.add(v3.add(a, b), c), 1 / 3), v3.mul(n, 2e-6));
    const h = G.zarek(m, o, n, 1e-7);
    if (!h || h.f === f || h.t >= DOSEG) continue;
    const nh = v3.norm(G.normalaPloskve(m, h.f));
    if (v3.dot(nh, n) < -0.3) out.push({ f, t: h.t, n });
  }
  return out;
}

// Razpre prekrižane liste (glej uvod). Vrne { krogi: [prekrižanih po krogih], premaknjenih, najvec (m), zvarjena }.
export function razpri(m, { krogov, cez, gladi, najvec } = RAZPRI) {
  G.zvari(m);
  const P0 = m.P.slice();
  const krogi = [prekrizane(m).length];
  const premaknjena = new Set();
  for (let k = 0; k < krogov && krogi[krogi.length - 1]; k++) {
    const o = prekrizane(m);
    const D = new Map();
    for (const { f, t, n } of o) for (let q = 0; q < 3; q++) {
      const w = m.zvar[m.F[f * 3 + q]];
      const d = D.get(w) || [0, 0, 0, 0];
      for (let c = 0; c < 3; c++) d[c] += n[c] * (t / 2 + cez);
      d[3]++;
      D.set(w, d);
    }
    for (let i = 0; i < m.zvar.length; i++) { const d = D.get(m.zvar[i]); if (d) for (let c = 0; c < 3; c++) m.P[i * 3 + c] += d[c] / d[3]; }
    G.zvari(m);
    // en korak Laplacea na premaknjenih ogliščih (nove številke zvarjenih: po položaju prvega izrisnega oglišča)
    const S = new Set();
    for (const w of D.keys()) S.add(w);
    const izr = new Set();
    for (let i = 0; i < m.zvar.length; i++) if (D.has(m.zvar[i])) izr.add(i);
    const jedro = new Set([...izr].map((i) => m.zvar[i]));
    const sos = new Map();
    for (let f = 0; f < m.F.length; f += 3) {
      const w = [m.zvar[m.F[f]], m.zvar[m.F[f + 1]], m.zvar[m.F[f + 2]]];
      for (const a of w) if (jedro.has(a)) for (const b of w) if (b !== a) { if (!sos.has(a)) sos.set(a, new Set()); sos.get(a).add(b); }
    }
    const nova = new Map();
    for (const [a, s] of sos) {
      const c = [0, 0, 0];
      for (const b of s) for (let q = 0; q < 3; q++) c[q] += m.W[b][q] / s.size;
      nova.set(a, v3.lerp(m.W[a], c, gladi));
    }
    for (let i = 0; i < m.zvar.length; i++) { const q = nova.get(m.zvar[i]); if (q) { for (let c = 0; c < 3; c++) m.P[i * 3 + c] = q[c]; premaknjena.add(i); } }
    // skupni premik omejen
    for (const i of premaknjena) {
      const d = [0, 1, 2].map((c) => m.P[i * 3 + c] - P0[i * 3 + c]);
      const l = v3.len(d);
      if (l > najvec) for (let c = 0; c < 3; c++) m.P[i * 3 + c] = P0[i * 3 + c] + (d[c] * najvec) / l;
    }
    G.zvari(m);
    krogi.push(prekrizane(m).length);
  }
  let mx = 0;
  for (const i of premaknjena) mx = Math.max(mx, Math.hypot(m.P[i * 3] - P0[i * 3], m.P[i * 3 + 1] - P0[i * 3 + 1], m.P[i * 3 + 2] - P0[i * 3 + 2]));
  // normale premaknjenih oglišč iz nove geometrije
  const nor = m.A.get("NORMAL");
  if (nor && premaknjena.size) {
    const N = G.normaleZvarjenih(m);
    for (const i of premaknjena) for (let c = 0; c < 3; c++) nor.d[i * nor.n + c] = N[m.zvar[i]][c];
  }
  if (premaknjena.size) m.spremenjeno = true;
  return { krogi, premaknjenih: premaknjena.size, najvec: mx };
}

// Posvetli pečeno senco okolice (COLOR_0.r ≥ SENCA) v ogliščih prekrižanih ploskev in njihovih sosedov ter tem
// ogliščem nastavi normalo iz geometrije. Oblike ne spreminja. Vrne { ploskev, oglisc (spremenjenih izrisnih oglišč) }.
export function posvetli(m) {
  G.zvari(m);
  const o = prekrizane(m);
  const col = m.A.get("COLOR_0");
  if (!o.length || !col) return { ploskev: o.length, oglisc: 0 };
  const jedro = new Set();
  for (const { f } of o) for (let k = 0; k < 3; k++) jedro.add(m.zvar[m.F[f * 3 + k]]);
  // en obroč sosedov: mehak prehod v pravo senco
  const obroc = new Set();
  for (let f = 0; f < m.F.length; f += 3) {
    const w = [m.zvar[m.F[f]], m.zvar[m.F[f + 1]], m.zvar[m.F[f + 2]]];
    if (w.some((x) => jedro.has(x))) for (const x of w) if (!jedro.has(x)) obroc.add(x);
  }
  // normale iz geometrije: shranjene normale teh oglišč so prenesene z gostejše mreže pred križanjem in kažejo tudi
  // do 90° stran od ploskve (ploskev je bila brez razpršene svetlobe, samo s sijajem: siva lisa)
  const N = G.normaleZvarjenih(m);
  const nor = m.A.get("NORMAL");
  let oglisc = 0;
  for (let i = 0; i < m.zvar.length; i++) {
    const w = m.zvar[i];
    const cilj = jedro.has(w) ? SENCA : obroc.has(w) ? SENCA_OBROC : 0;
    let sprememba = false;
    if (cilj > col.d[i * col.n] + 0.004) { col.d[i * col.n] = cilj; sprememba = true; }
    if (nor && jedro.has(w)) {
      const d = nor.d[i * nor.n] * N[w][0] + nor.d[i * nor.n + 1] * N[w][1] + nor.d[i * nor.n + 2] * N[w][2];
      if (d < 0.995) { for (let c = 0; c < 3; c++) nor.d[i * nor.n + c] = N[w][c]; sprememba = true; }
    }
    if (sprememba) oglisc++;
  }
  if (oglisc) m.spremenjeno = true;
  return { ploskev: o.length, oglisc };
}

export async function dodelaj(datoteka, { suho = false } = {}) {
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
  const doc = await io.read(datoteka);
  const por = [];
  let sprememb = 0;
  for (const node of doc.getRoot().listNodes()) {
    if (!node.getMesh() || !/lobe of (left|right) lung/.test(node.getName())) continue;
    for (const prim of node.getMesh().listPrimitives()) {
      const m = G.preberi(node, prim);
      let raz = null;
      if (!node.getExtras()?.razprto) {
        raz = razpri(m);
        por.push(`${path.basename(datoteka)}: ${node.getName()}: razprto, prekrižanih po krogih ${raz.krogi.join(" → ")}, premaknjenih oglišč ${raz.premaknjenih}, največ ${(raz.najvec * 1000).toFixed(1)} mm`);
      }
      const r = posvetli(m);
      por.push(`${path.basename(datoteka)}: ${node.getName()}: prekrižanih ploskev ${r.ploskev} od ${m.F.length / 3}, popravljenih oglišč ${r.oglisc}`);
      if ((raz || r.oglisc) && !suho) {
        G.zapisi(doc, node, prim, m);
        if (raz) node.setExtras({ ...(node.getExtras() || {}), razprto: 1 });
        sprememb++;
      }
    }
  }
  if (!suho && (G.brezSirot(doc) || sprememb)) await io.write(datoteka, doc);
  return por;
}

async function glavni() {
  const suho = process.argv.includes("--suho");
  for (const ime of ["pljuca.glb", "pljuca-telefon.glb"]) for (const v of await dodelaj(path.join(MAPA, ime), { suho })) console.log(v);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await glavni();

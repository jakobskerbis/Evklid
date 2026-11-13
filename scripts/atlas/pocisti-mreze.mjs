// Čiščenje mrež organov po izvozu z manj trikotniki (#567): drobne napake, ki jih poenostavljanje pusti v delih GLB.
// Oblika, imena, UV, teksture in kvantizacija ostanejo; popravki so manjši od 0,02 mm (na zaslonu nevidni).
//
// Zagon (ponovljivo; drugi zagon ne spremeni nič):
//   node scripts/atlas/pocisti-mreze.mjs            vse datoteke iz NACRT
//   node scripts/atlas/pocisti-mreze.mjs pljuca     samo datoteke, katerih pot vsebuje »pljuca«
//   node scripts/atlas/pocisti-mreze.mjs --suho     brez pisanja, samo poročilo
//
// Kaj naredi v izbranih delih (po imenu vozlišča):
//   izrojeni   odstrani trikotnike z dvema enakima ogliščema (po položaju)
//   blazinice  odstrani pare trikotnikov z istimi tremi oglišči (zložen trikotnik brez prostornine)
//   stisk      rob, ki si ga delijo štiri ploskve dveh lupin (notranja in zunanja stena žile se dotikata vzdolž roba):
//              oglišča ene lupine odmakne za 12 µm, da je vsaka lupina zase mnogoterna (v žilo ne naredi luknje)
//   navitje    obrne manjšino ploskev komponente, ki je navita drugače kot sosede (šarenica: 8 obrnjenih ploskev)
//   igle       zasuka rob trikotnika s ploščino ~0 s sosedom (jetra: šivi režnjev po kvantizaciji)
// Žile srca in jeter z debelino sten ureja scripts/atlas/popravi-zile.mjs; to orodje je za vse druge dele.
// Po čiščenju: node scripts/atlas/preveri-mreze.mjs <filter> in izhodišče (docs/3d.md, »Mesh check«).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import * as G from "./zile-mreza.mjs";

const { v3 } = G;
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const MODELI = path.join(ROOT, "public", "3d", "modeli");

// datoteka → [vzorec imena dela, koraki]. Jetra za telefon niso v načrtu: tanke vejice so tam namenoma sploščene v
// dvostranske trakove (pari trikotnikov z istimi oglišči), ki jih »blazinice« ne sme odstraniti.
export const NACRT = {
  // pljuča in jetra (2026-11-12): cevi nastanejo kot zaprte mreže pri izvozu (drevesa.py), čiščenje ni več potrebno
  // režnji jeter (2026-11-13): skupna kvantizacija (organi.mjs) splošči tanke trikotnike ob šivih režnjev v igle
  "organi-3d/jetra.glb": [[/lobe of liver \(lastno\)$/, ["izrojeni", "igle"]]],
  "organi-3d/jetra-telefon.glb": [[/lobe of liver \(lastno\)$/, ["izrojeni", "igle"]]],
  "organi-3d/oko.glb": [[/^iris_L/, ["izrojeni", "navitje"]]],
  "organi-3d/oko-telefon.glb": [[/^iris_L/, ["izrojeni", "navitje"]]],
};

const kljucTrikotnika = (m, f) => [m.zvar[m.F[f * 3]], m.zvar[m.F[f * 3 + 1]], m.zvar[m.F[f * 3 + 2]]].sort((a, b) => a - b).join("_");

// Pari trikotnikov z istimi tremi oglišči: oba odpadeta. Vrne število odstranjenih trikotnikov.
export function brezBlazinic(m) {
  const T = m.F.length / 3;
  const st = new Map();
  for (let f = 0; f < T; f++) { const k = kljucTrikotnika(m, f); st.set(k, (st.get(k) || 0) + 1); }
  const F = [];
  let odstranjenih = 0;
  for (let f = 0; f < T; f++) {
    if (st.get(kljucTrikotnika(m, f)) > 1) { odstranjenih++; continue; }
    F.push(m.F[f * 3], m.F[f * 3 + 1], m.F[f * 3 + 2]);
  }
  if (odstranjenih) { m.F = F; m.spremenjeno = true; }
  return odstranjenih;
}

// Igle: trikotnik s ploščino ~0 (oglišča na premici; kvantizacija splošči tanek trikotnik ob šivu režnjev) se zasuka s
// sosedom čez najdaljši rob (A, B, C) + (B, A, D) → (C, A, D) + (C, D, B). Oglišča in robovi meje ostanejo, nič ne
// odpade; zasuk le, če nova trikotnika nista prepognjena. Čez šiv UV (sosed ima svoja izrisna oglišča) igla odpade in
// sosed se razdeli v njenem srednjem oglišču.
export function obrniIgle(m, krogov = 4) {
  let n = 0;
  let lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < m.P.length; i += 3) for (let c = 0; c < 3; c++) { lo[c] = Math.min(lo[c], m.P[i + c]); hi[c] = Math.max(hi[c], m.P[i + c]); }
  const diag = Math.hypot(hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]);
  const minPl = (1e-5 * diag) ** 2 * 1e-2; // kot preveri-mreze.mjs
  const p = (v) => [m.P[v * 3], m.P[v * 3 + 1], m.P[v * 3 + 2]];
  const kriz = (a, b, c) => v3.cross(v3.sub(p(b), p(a)), v3.sub(p(c), p(a)));
  const pl = (a, b, c) => Math.hypot(...kriz(a, b, c)) * 0.5;
  for (let krog = 0; krog < krogov; krog++) {
    const E = G.robovi(m), T = m.F.length / 3;
    const dotaknjen = new Uint8Array(T);
    let ta = 0;
    for (let f = 0; f < T; f++) {
      if (dotaknjen[f]) continue;
      const t = [m.F[f * 3], m.F[f * 3 + 1], m.F[f * 3 + 2]];
      if (m.zvar[t[0]] === m.zvar[t[1]] || m.zvar[t[1]] === m.zvar[t[2]] || m.zvar[t[0]] === m.zvar[t[2]]) continue;
      if (pl(...t) >= minPl) continue;
      // najprej najdaljši rob (oglišče na sredi premice), sicer še ostala dva
      const red = [0, 1, 2].sort((i, j) => v3.len(v3.sub(p(t[(j + 1) % 3]), p(t[j]))) - v3.len(v3.sub(p(t[(i + 1) % 3]), p(t[i]))));
      for (const k of red) {
        const A = t[k], B = t[(k + 1) % 3], C = t[(k + 2) % 3];
        const a = m.zvar[A], b = m.zvar[B];
        const l = E.get(a < b ? a * 4294967296 + b : b * 4294967296 + a);
        if (!l || l.length !== 2) continue;
        const h = l.find((x) => ((x / 3) | 0) !== f);
        if (h === undefined) continue;
        const g = (h / 3) | 0, kk = h % 3;
        if (dotaknjen[g]) continue;
        const Bg = m.F[g * 3 + kk], Ag = m.F[g * 3 + (kk + 1) % 3], D = m.F[g * 3 + (kk + 2) % 3];
        if (m.zvar[Bg] !== b || m.zvar[Ag] !== a) continue; // drugačno navijanje
        const c = m.zvar[C], d = m.zvar[D];
        if (c === d || E.has(c < d ? c * 4294967296 + d : d * 4294967296 + c)) continue; // rob C–D že obstaja (nemnogoteren)
        if (Bg !== B || Ag !== A) {
          // šiv UV: sosed ima na robu svoja izrisna oglišča. Igla odpade, sosed se razdeli v točki C (novo oglišče na
          // njegovi strani šiva, UV vmes), tako da robova igle (B–C, C–A) dobita par v B–M in M–A.
          const AB = v3.sub(p(B), p(A)), L2 = v3.dot(AB, AB);
          if (!(L2 > 0)) continue;
          const u = v3.dot(v3.sub(p(C), p(A)), AB) / L2;
          if (!(u > 1e-3 && u < 1 - 1e-3)) continue;
          const ng = kriz(Bg, Ag, D), n1 = kriz(Bg, C, D), n2 = kriz(C, Ag, D);
          if (v3.dot(n1, ng) <= 0 || v3.dot(n2, ng) <= 0 || pl(Bg, C, D) < minPl || pl(C, Ag, D) < minPl) continue;
          const M = G.dodajOglisce(m, p(C), [[Ag, 1 - u], [Bg, u]]);
          m.F[g * 3] = Bg; m.F[g * 3 + 1] = M; m.F[g * 3 + 2] = D;
          m.F.push(M, Ag, D);
          m.F[f * 3] = m.F[f * 3 + 1] = m.F[f * 3 + 2] = -1; // odstranjena po krogu
          dotaknjen[f] = dotaknjen[g] = 1; ta++;
          break;
        }
        const ng = kriz(B, A, D), n1 = kriz(C, A, D), n2 = kriz(C, D, B);
        if (v3.dot(n1, ng) <= 0 || v3.dot(n2, ng) <= 0 || pl(C, A, D) < minPl || pl(C, D, B) < minPl) continue;
        m.F[f * 3] = C; m.F[f * 3 + 1] = A; m.F[f * 3 + 2] = D;
        m.F[g * 3] = C; m.F[g * 3 + 1] = D; m.F[g * 3 + 2] = B;
        dotaknjen[f] = dotaknjen[g] = 1; ta++;
        break;
      }
    }
    if (m.F.includes(-1)) {
      const F = [];
      for (let i = 0; i < m.F.length; i += 3) if (m.F[i] !== -1) F.push(m.F[i], m.F[i + 1], m.F[i + 2]);
      m.F = F;
    }
    n += ta;
    if (!ta) break;
  }
  if (n) m.spremenjeno = true;
  return n;
}

// Rob s 4 ploskvami, kjer se dotikata dve lupini: komponente določimo brez prehodov čez nemnogoterne robove; ploskve
// manjše komponente ob takem robu dobijo svoja oglišča, odmaknjena za `odmik` v smeri svoje normale navznoter.
export function razmakniStiske(m, odmik = 12e-6) {
  let E = G.robovi(m);
  const T = m.F.length / 3;
  const par = new Int32Array(T);
  for (let i = 0; i < T; i++) par[i] = i;
  const najdi = (x) => { while (par[x] !== x) { par[x] = par[par[x]]; x = par[x]; } return x; };
  for (const l of E.values()) if (l.length === 2) { const a = najdi((l[0] / 3) | 0), b = najdi((l[1] / 3) | 0); if (a !== b) par[a] = b; }
  const velikost = new Map();
  for (let f = 0; f < T; f++) velikost.set(najdi(f), (velikost.get(najdi(f)) || 0) + 1);
  const premik = new Map(); // "komponenta|zvarjeno oglišče" → { n: vsota normal, ogl: Set izrisnih oglišč }
  let robov = 0;
  for (const [k, l] of E) {
    if (l.length !== 4) continue;
    const komp = [...new Set(l.map((h) => najdi((h / 3) | 0)))];
    if (komp.length !== 2 || komp.some((c) => l.filter((h) => najdi((h / 3) | 0) === c).length !== 2)) continue;
    const mala = velikost.get(komp[0]) <= velikost.get(komp[1]) ? komp[0] : komp[1];
    const a = Math.floor(k / 4294967296), b = k % 4294967296;
    for (const w of [a, b]) if (!premik.has(`${mala}|${w}`)) premik.set(`${mala}|${w}`, { komp: mala, w });
    robov++;
  }
  if (!robov) return 0;
  // vsa izrisna oglišča male komponente na premaknjenih zvarjenih ogliščih (tudi ploskve, ki se roba dotikajo samo v oglišču)
  const nova = new Map(); // "komponenta|izrisno oglišče" → novo izrisno oglišče
  for (let f = 0; f < T; f++) {
    const c = najdi(f);
    for (let i = 0; i < 3; i++) {
      const v = m.F[f * 3 + i];
      const p = premik.get(`${c}|${m.zvar[v]}`);
      if (!p) continue;
      p.n = v3.add(p.n || [0, 0, 0], G.normalaPloskve(m, f));
      (p.ploskve ||= []).push([f, i]);
    }
  }
  for (const p of premik.values()) {
    if (!p.ploskve) continue;
    const n = v3.norm(p.n);
    for (const [f, i] of p.ploskve) {
      const v = m.F[f * 3 + i];
      const kl = `${p.komp}|${v}`;
      if (!nova.has(kl)) nova.set(kl, G.dodajOglisce(m, v3.sub(G.pol(m, v), v3.mul(n, odmik)), [[v, 1]]));
      m.F[f * 3 + i] = nova.get(kl);
    }
  }
  m.spremenjeno = true;
  return robov;
}

export async function pocisti(pot, nacrt, { suho = false } = {}) {
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
  const doc = await io.read(pot);
  let delov = 0;
  for (const node of doc.getRoot().listNodes()) {
    const mesh = node.getMesh();
    const koraki = nacrt.find(([rx]) => rx.test(node.getName()))?.[1];
    if (!mesh || !koraki) continue;
    const prims = mesh.listPrimitives().filter((p) => p.getMode() === 4 && p.getAttribute("POSITION"));
    if (prims.length !== 1) continue;
    const m = G.preberi(node, prims[0]);
    const opombe = [];
    for (const k of koraki) {
      const n = k === "izrojeni" ? G.brezIzrojenih(m) : k === "igle" ? obrniIgle(m) : k === "blazinice" ? brezBlazinic(m) : k === "stisk" ? razmakniStiske(m) : k === "navitje" ? G.usmeri(m, { samoNavitje: true }).obrnjene : 0;
      if (n) opombe.push(`${k} ${n}`);
      if (n && k === "stisk") G.zvari(m);
    }
    if (!m.spremenjeno) continue;
    delov++;
    console.log(`   ${node.getName()}: ${opombe.join(", ")}`);
    if (!suho) G.zapisi(doc, node, prims[0], m);
  }
  if (delov && !suho) {
    for (const acc of doc.getRoot().listAccessors()) if (acc.listParents().every((p) => p.propertyType === "Root")) acc.dispose();
    await io.write(pot, doc);
  }
  return delov;
}

async function glavni() {
  const arg = process.argv.slice(2);
  const suho = arg.includes("--suho");
  const filtri = arg.filter((a) => !a.startsWith("--"));
  for (const [rel, nacrt] of Object.entries(NACRT)) {
    if (filtri.length && !filtri.some((f) => rel.includes(f))) continue;
    const pot = path.join(MODELI, rel);
    const prej = fs.statSync(pot).size;
    console.log(rel);
    const delov = await pocisti(pot, nacrt, { suho });
    console.log(`   spremenjenih delov ${delov}, velikost ${(prej / 1048576).toFixed(2)} → ${(fs.statSync(pot).size / 1048576).toFixed(2)} MB`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await glavni();

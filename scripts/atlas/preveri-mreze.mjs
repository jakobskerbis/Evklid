// Samodejni pregled mrež vseh 3D modelov (GLB): luknje, odprti robovi, nemnogoterni robovi, obrnjene ploskve,
// zaprti deli, obrnjeni navznoter, izrojeni trikotniki, primitivi, ki niso trikotniki. Za vsako vozlišče z mrežo (del);
// več primitivov istega vozlišča se pregleda skupaj.
//
// Zagon:
//   node scripts/atlas/preveri-mreze.mjs                 tabela za vse GLB (organi-3d, telo, telo-hd)
//   node scripts/atlas/preveri-mreze.mjs srce zile       samo datoteke, katerih pot vsebuje »srce« ali »zile«
//   node scripts/atlas/preveri-mreze.mjs --vse           vsi deli s težavami (privzeto največ 12 na model)
//   node scripts/atlas/preveri-mreze.mjs --json          vse ugotovitve kot JSON (tudi zanke lukenj z obsegom v mm)
//   node scripts/atlas/preveri-mreze.mjs --izhodisce     zapiše scripts/atlas/mreze-izhodisce.json (izhodišče za
//                                                        test/3d-mreze.test.js); zavrne, če je kateri del slabši od
//                                                        starega izhodišča, razen z --sprejmi-slabse
//   node scripts/atlas/preveri-mreze.mjs --primerjaj     primerja z izhodiščem (izhod 1 ob novih težavah)
//
// Metode: oglišča najprej zvarimo po položaju (mreža 1e-5 diagonale primitiva; glTF podvoji oglišča na šivih UV in
// normal), šele nato štejemo robove. Rob z eno ploskvijo = odprt rob; povezane verige odprtih robov = luknje (zanke;
// odprt konec cevi je tudi zanka). Rob z več kot dvema ploskvama = nemnogoteren. Sosednji ploskvi, ki rob prehodita
// v isti smeri, imata nasprotno navijanje: z obhodom (BFS) vsako povezano komponento usmerimo po večini, manjšina so
// »obrnjene ploskve«. Za zaprte komponente (brez odprtih in nemnogoternih robov) izračunamo predznačeno prostornino v
// svetovnih koordinatah (z matriko vozlišča); < 0 = obrnjena navznoter, razen če je votlina: notranja lupina votle žile,
// ki leži v zaprti zunanji lupini istega dela (preverimo z žarkom). Izrojen = trikotnik z dvema enakima ogliščema
// po varjenju ali s ploščino skoraj 0.
// Žile (stolpec »žila«): organi po extras.tkivo (arterija, vena, portalna, pljucna*), telo po sistemu »zile« v
// public/3d/atlas-strukture.json (extras.zid) brez srčnih votlin in zaklopk, sicer po imenu (artery, vein, aorta …).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { MeshoptDecoder } from "meshoptimizer";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const MODELI = path.join(ROOT, "public", "3d", "modeli");
export const MAPE = ["organi-3d", "telo", "telo-hd"];
export const IZHODISCE = path.join(ROOT, "scripts", "atlas", "mreze-izhodisce.json");
// Mere, ki jih test primerja z izhodiščem (vrstni red v izhodišču).
export const MERE = ["odprtiRobovi", "luknje", "nemnogoterni", "obrnjene", "navznoter", "izrojeni", "neTrikotniki"];

const ZILA_TKIVO = /^(arterija|vena|portalna|pljucna(-arterija|-vena)?(-v)?)$/;
const ZILA_IME = /arter|\bvein|\bvena\b|venae|venous|aort|truncus|\btrunk\b|sinus|arch of|plexus|anastomo|vessel|\bbranch(es)?\b|striate/i;
const NI_ZILA = /atrium|ventricle|leaflet|papillary|valve|auricle|nerve|bronch|lymph|node of/i;

let strukture = null;
function sistem(id) {
  if (!strukture) {
    strukture = new Map();
    for (const r of JSON.parse(fs.readFileSync(path.join(ROOT, "public", "3d", "atlas-strukture.json"), "utf8"))) strukture.set(r.id, r);
  }
  return strukture.get(id)?.sistem;
}

export function jeZila(ime, extras = {}) {
  if (extras.tkivo != null) return ZILA_TKIVO.test(extras.tkivo);
  const id = extras.zid || ime;
  if (NI_ZILA.test(id) && !/\bveins? of\b/i.test(id)) return false; // »Inferior vein of left ventricle« je žila
  const s = sistem(id);
  return s ? s === "zile" : ZILA_IME.test(id);
}

let io = null;
async function bralnik() {
  if (io) return io;
  await MeshoptDecoder.ready;
  io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ "meshopt.decoder": MeshoptDecoder });
  return io;
}

// Položaji v svetovnih koordinatah (Float64Array, 3 na oglišče), z upoštevanjem normalizirane kvantizacije.
function polozaji(acc, M) {
  const a = acc.getArray();
  const n = acc.getCount();
  let k = 1;
  if (acc.getNormalized()) {
    if (a instanceof Int8Array) k = 1 / 127;
    else if (a instanceof Uint8Array) k = 1 / 255;
    else if (a instanceof Int16Array) k = 1 / 32767;
    else if (a instanceof Uint16Array) k = 1 / 65535;
  }
  const signed = acc.getNormalized() && (a instanceof Int8Array || a instanceof Int16Array);
  const st = acc.getElementSize();
  const p = new Float64Array(n * 3);
  for (let i = 0; i < n; i++) {
    let x = a[i * st] * k, y = a[i * st + 1] * k, z = a[i * st + 2] * k;
    if (signed) { x = Math.max(x, -1); y = Math.max(y, -1); z = Math.max(z, -1); }
    p[i * 3] = M[0] * x + M[4] * y + M[8] * z + M[12];
    p[i * 3 + 1] = M[1] * x + M[5] * y + M[9] * z + M[13];
    p[i * 3 + 2] = M[2] * x + M[6] * y + M[10] * z + M[14];
  }
  return p;
}

const det3 = (M) => M[0] * (M[5] * M[10] - M[9] * M[6]) - M[4] * (M[1] * M[10] - M[9] * M[2]) + M[8] * (M[1] * M[6] - M[5] * M[2]);

// Topologija enega trikotniškega primitiva. p: svetovni položaji, idx: indeksi (ali null), zrcaljeno: det matrike < 0.
export function analiziraj(p, idx, zrcaljeno = false) {
  const nv = p.length / 3;
  const ni = idx ? idx.length : nv;
  const T = Math.floor(ni / 3);
  // 1. Varjenje po položaju.
  let mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < nv; i++) for (let c = 0; c < 3; c++) { const v = p[i * 3 + c]; if (v < mn[c]) mn[c] = v; if (v > mx[c]) mx[c] = v; }
  const diag = Math.hypot(mx[0] - mn[0], mx[1] - mn[1], mx[2] - mn[2]) || 1;
  const eps = diag * 1e-5;
  const B = 131072; // 17 bitov na os: diag / eps = 1e5 < 2^17
  const zvar = new Uint32Array(nv);
  const kljuci = new Map();
  let W = 0;
  for (let i = 0; i < nv; i++) {
    const k = Math.round((p[i * 3] - mn[0]) / eps) * B * B + Math.round((p[i * 3 + 1] - mn[1]) / eps) * B + Math.round((p[i * 3 + 2] - mn[2]) / eps);
    let w = kljuci.get(k);
    if (w === undefined) { w = W++; kljuci.set(k, w); }
    zvar[i] = w;
  }
  const v = (j) => zvar[idx ? idx[j] : j];
  // 2. Izrojeni trikotniki.
  const F = new Uint32Array(T * 3);
  const ziv = new Uint8Array(T);
  let izrojeni = 0, zivih = 0;
  const minPl = eps * eps * 1e-2;
  for (let f = 0; f < T; f++) {
    const a = v(f * 3), b = v(f * 3 + 1), c = v(f * 3 + 2);
    F[f * 3] = a; F[f * 3 + 1] = b; F[f * 3 + 2] = c;
    if (a === b || b === c || a === c) { izrojeni++; continue; }
    const ia = (idx ? idx[f * 3] : f * 3) * 3, ib = (idx ? idx[f * 3 + 1] : f * 3 + 1) * 3, ic = (idx ? idx[f * 3 + 2] : f * 3 + 2) * 3;
    const ux = p[ib] - p[ia], uy = p[ib + 1] - p[ia + 1], uz = p[ib + 2] - p[ia + 2];
    const wx = p[ic] - p[ia], wy = p[ic + 1] - p[ia + 1], wz = p[ic + 2] - p[ia + 2];
    const cx = uy * wz - uz * wy, cy = uz * wx - ux * wz, cz = ux * wy - uy * wx;
    if (Math.hypot(cx, cy, cz) * 0.5 < minPl) izrojeni++;
    ziv[f] = 1; zivih++; // trikotnik s ploščino ~0 ostane v topologiji (ima robove)
  }
  // Svetovni položaj zvarjenega oglišča.
  const P = new Float64Array(W * 3);
  for (let i = 0; i < nv; i++) { const w = zvar[i]; P[w * 3] = p[i * 3]; P[w * 3 + 1] = p[i * 3 + 1]; P[w * 3 + 2] = p[i * 3 + 2]; }
  // 3. Robovi: polrobove razvrstimo v vedra po manjšem oglišču (CSR), v vedru združimo po drugem oglišču.
  const cnt = new Uint32Array(W + 1);
  for (let f = 0; f < T; f++) if (ziv[f]) for (let k = 0; k < 3; k++) { const a = F[f * 3 + k], b = F[f * 3 + (k + 1) % 3]; cnt[Math.min(a, b) + 1]++; }
  for (let i = 0; i < W; i++) cnt[i + 1] += cnt[i];
  const he = new Uint32Array(cnt[W]);
  const pos = cnt.slice(0, W);
  for (let f = 0; f < T; f++) if (ziv[f]) for (let k = 0; k < 3; k++) { const a = F[f * 3 + k], b = F[f * 3 + (k + 1) % 3]; he[pos[Math.min(a, b)]++] = f * 3 + k; }
  const druga = (h) => { const f = (h / 3) | 0, k = h % 3; const a = F[f * 3 + k], b = F[f * 3 + (k + 1) % 3]; return a < b ? b : a; };
  const naprej = (h) => { const f = (h / 3) | 0, k = h % 3; return F[f * 3 + k] < F[f * 3 + (k + 1) % 3]; };
  const robA = [], robB = [];
  const adjA = [], adjB = [], adjIsti = [];
  const slab = new Uint8Array(T); // ploskev ob odprtem ali nemnogoternem robu
  let nemnogoterni = 0, nasprotniPari = 0;
  const vzeto = new Uint8Array(he.length);
  for (let u = 0; u < W; u++) {
    const s = cnt[u], e = cnt[u + 1];
    for (let i = s; i < e; i++) {
      if (vzeto[i]) continue;
      const w = druga(he[i]);
      const sk = [he[i]];
      for (let j = i + 1; j < e; j++) if (!vzeto[j] && druga(he[j]) === w) { vzeto[j] = 1; sk.push(he[j]); }
      if (sk.length === 1) {
        robA.push(u); robB.push(w); slab[(sk[0] / 3) | 0] = 1;
      } else if (sk.length === 2) {
        const isti = naprej(sk[0]) === naprej(sk[1]);
        if (isti) nasprotniPari++;
        adjA.push((sk[0] / 3) | 0); adjB.push((sk[1] / 3) | 0); adjIsti.push(isti ? 1 : 0);
      } else {
        nemnogoterni++;
        for (const h of sk) slab[(h / 3) | 0] = 1;
      }
    }
  }
  // 4. Usmeritev komponent (BFS po mnogoternih robovih).
  const deg = new Uint32Array(T + 1);
  for (let i = 0; i < adjA.length; i++) { deg[adjA[i] + 1]++; deg[adjB[i] + 1]++; }
  for (let i = 0; i < T; i++) deg[i + 1] += deg[i];
  const nb = new Uint32Array(deg[T]), nbIsti = new Uint8Array(deg[T]);
  const dp = deg.slice(0, T);
  for (let i = 0; i < adjA.length; i++) {
    nb[dp[adjA[i]]] = adjB[i]; nbIsti[dp[adjA[i]]++] = adjIsti[i];
    nb[dp[adjB[i]]] = adjA[i]; nbIsti[dp[adjB[i]]++] = adjIsti[i];
  }
  const o = new Int8Array(T).fill(-1);
  const vrsta = new Uint32Array(T);
  let komponente = 0, zaprte = 0, obrnjene = 0, navznoter = 0, neusmerljive = 0;
  const vol = (f) => {
    const a = F[f * 3] * 3, b = F[f * 3 + 1] * 3, c = F[f * 3 + 2] * 3;
    return (P[a] * (P[b + 1] * P[c + 2] - P[b + 2] * P[c + 1]) - P[a + 1] * (P[b] * P[c + 2] - P[b + 2] * P[c]) + P[a + 2] * (P[b] * P[c + 1] - P[b + 1] * P[c])) / 6;
  };
  const telesa = []; // zaprte komponente: { V, mn, mx, ploskve }
  // Število presečišč žarka iz (ox, oy, oz) v stalni smeri s ploskvami (liho = točka je v telesu).
  const SMERI = [[0.5377, 0.7151, 0.4463], [-0.6713, 0.2911, 0.6816], [0.3015, -0.8452, 0.4413]];
  const presecisc = (ox, oy, oz, ploskve, smer = 0) => {
    const [dx, dy, dz] = SMERI[smer];
    let st = 0;
    for (const f of ploskve) {
      const a = F[f * 3] * 3, b = F[f * 3 + 1] * 3, c = F[f * 3 + 2] * 3;
      const e1x = P[b] - P[a], e1y = P[b + 1] - P[a + 1], e1z = P[b + 2] - P[a + 2];
      const e2x = P[c] - P[a], e2y = P[c + 1] - P[a + 1], e2z = P[c + 2] - P[a + 2];
      const px = dy * e2z - dz * e2y, py = dz * e2x - dx * e2z, pz = dx * e2y - dy * e2x;
      const det = e1x * px + e1y * py + e1z * pz;
      if (Math.abs(det) < 1e-24) continue;
      const tx = ox - P[a], ty = oy - P[a + 1], tz = oz - P[a + 2];
      const u = (tx * px + ty * py + tz * pz) / det;
      if (u < 0 || u > 1) continue;
      const qx = ty * e1z - tz * e1y, qy = tz * e1x - tx * e1z, qz = tx * e1y - ty * e1x;
      const w = (dx * qx + dy * qy + dz * qz) / det;
      if (w < 0 || u + w > 1) continue;
      if ((e2x * qx + e2y * qy + e2z * qz) / det > 0) st++;
    }
    return st;
  };
  for (let s = 0; s < T; s++) {
    if (!ziv[s] || o[s] >= 0) continue;
    komponente++;
    let g = 0, r = 1, n1 = 0, zaprta = true, konflikt = 0;
    o[s] = 0; vrsta[0] = s;
    while (g < r) {
      const f = vrsta[g++];
      if (o[f]) n1++;
      if (slab[f]) zaprta = false;
      for (let i = deg[f]; i < deg[f + 1]; i++) {
        const h = nb[i], want = nbIsti[i] ? 1 - o[f] : o[f];
        if (o[h] < 0) { o[h] = want; vrsta[r++] = h; } else if (o[h] !== want) konflikt++;
      }
    }
    const n0 = r - n1;
    obrnjene += Math.min(n0, n1);
    if (konflikt) neusmerljive++;
    if (zaprta && !konflikt) {
      zaprte++;
      const vecina = n1 > n0 ? 1 : 0;
      let V = 0;
      const mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity];
      for (let i = 0; i < r; i++) {
        const f = vrsta[i];
        V += (o[f] === vecina ? 1 : -1) * vol(f);
        for (let k = 0; k < 3; k++) for (let c = 0; c < 3; c++) { const x = P[F[f * 3 + k] * 3 + c]; if (x < mn[c]) mn[c] = x; if (x > mx[c]) mx[c] = x; }
      }
      telesa.push({ V: zrcaljeno ? -V : V, mn, mx, ploskve: vrsta.slice(0, r) });
    }
  }
  // Obrnjena navznoter: zaprta komponenta z negativno prostornino, razen votline (svetlina votle žile: notranja lupina,
  // ki leži v zaprti zunanji lupini istega dela in gleda v votlino; tako so narejene votle žile v organih).
  // Vgnezdenost: vzorec težišč do 9 ploskev, točka je znotraj, če je v vsaj eni drugi zaprti lupini s prostornino > 0
  // (unija: svetlina teče skozi več prekrivajočih se zunanjih lupin); odloči večina. Isto pravilo: zile-mreza.mjs.
  const lupine = telesa.filter((c) => c.V > 0);
  const vsota = lupine.reduce((a, c) => a + c.V, 0);
  for (const k of telesa) {
    if (k.V >= 0) continue;
    let votlina = false;
    if (-k.V < vsota) {
      const st = Math.min(9, k.ploskve.length);
      let znotraj = 0;
      for (let i = 0; i < st; i++) {
        const f = k.ploskve[Math.floor(((i + 0.5) * k.ploskve.length) / st)];
        const a = F[f * 3] * 3, b = F[f * 3 + 1] * 3, c = F[f * 3 + 2] * 3;
        const ox = (P[a] + P[b] + P[c]) / 3, oy = (P[a + 1] + P[b + 1] + P[c + 1]) / 3, oz = (P[a + 2] + P[b + 2] + P[c + 2]) / 3;
        if (lupine.some((c2) => c2.mn[0] <= ox && c2.mn[1] <= oy && c2.mn[2] <= oz && c2.mx[0] >= ox && c2.mx[1] >= oy && c2.mx[2] >= oz && presecisc(ox, oy, oz, c2.ploskve, i % 3) % 2 === 1)) znotraj++;
      }
      votlina = znotraj * 2 > st;
    }
    if (!votlina) navznoter++;
  }
  // Zrcaljeno vozlišče (det < 0): glTF tam za sprednjo šteje nasprotno navijanje, zato je predznak prostornine iz
  // svetovnih položajev obrnjen (zgoraj: zrcaljeno ? -V : V).
  // 5. Luknje: povezane verige odprtih robov (union-find), obseg v svetovnih enotah.
  const par = new Map();
  const najdi = (x) => { let y = x; while (par.get(y) !== y) y = par.get(y); let z = x; while (par.get(z) !== y) { const n = par.get(z); par.set(z, y); z = n; } return y; };
  for (let i = 0; i < robA.length; i++) {
    for (const x of [robA[i], robB[i]]) if (!par.has(x)) par.set(x, x);
    const ra = najdi(robA[i]), rb = najdi(robB[i]);
    if (ra !== rb) par.set(ra, rb);
  }
  const obseg = new Map(), robov = new Map();
  for (let i = 0; i < robA.length; i++) {
    const r0 = najdi(robA[i]);
    const a = robA[i] * 3, b = robB[i] * 3;
    obseg.set(r0, (obseg.get(r0) || 0) + Math.hypot(P[a] - P[b], P[a + 1] - P[b + 1], P[a + 2] - P[b + 2]));
    robov.set(r0, (robov.get(r0) || 0) + 1);
  }
  const zanke = [...obseg.entries()].map(([k, l]) => ({ robov: robov.get(k), obseg: l })).sort((x, y) => y.obseg - x.obseg);
  return {
    trikotniki: T, oglisca: W, odprtiRobovi: robA.length, luknje: zanke.length, nemnogoterni, nasprotniPari, obrnjene,
    komponente, zaprte, navznoter, neusmerljive, izrojeni, zanke,
  };
}

// Analiza ene datoteke GLB: seznam delov (vozlišče; več trikotniških primitivov istega vozlišča se pregleda skupaj).
export async function preveriGLB(datoteka) {
  const doc = await (await bralnik()).read(datoteka);
  const deli = [];
  const imena = new Map();
  for (const node of doc.getRoot().listNodes()) {
    const mesh = node.getMesh();
    if (!mesh) continue;
    const M = node.getWorldMatrix();
    const zrc = det3(M) < 0;
    let ime = node.getName() || mesh.getName() || "(brez imena)";
    if (imena.has(ime)) { imena.set(ime, imena.get(ime) + 1); ime = `${ime} #${imena.get(ime)}`; } else imena.set(ime, 1);
    const extras = node.getExtras() || {};
    const sk = { ime, zila: jeZila(node.getName() || "", extras), trikotniki: 0, oglisca: 0, zanke: [], neTrikotniki: 0 };
    for (const m of ["odprtiRobovi", "luknje", "nemnogoterni", "nasprotniPari", "obrnjene", "komponente", "zaprte", "navznoter", "neusmerljive", "izrojeni"]) sk[m] = 0;
    // Vsi trikotniški primitivi vozlišča skupaj (šiv med primitivoma ni luknja: oglišča se zvarijo po položaju).
    // Primitiv, ki ni TRIANGLES (trakovi, pahljače, črte, točke), je težava: pregled ga ne zna preveriti.
    const kosi = [];
    let stOgl = 0, stInd = 0;
    for (const prim of mesh.listPrimitives()) {
      if (prim.getMode() !== 4) { sk.neTrikotniki++; continue; }
      const pos = prim.getAttribute("POSITION");
      if (!pos) continue;
      const ind = prim.getIndices();
      const p = polozaji(pos, M);
      const idx = ind ? ind.getArray() : null;
      kosi.push({ p, idx, odmik: stOgl });
      stOgl += p.length / 3;
      stInd += idx ? idx.length : p.length / 3;
    }
    if (kosi.length === 1) {
      const r = analiziraj(kosi[0].p, kosi[0].idx, zrc);
      for (const k of Object.keys(r)) if (k === "zanke") sk.zanke.push(...r.zanke); else sk[k] += r[k];
    } else if (kosi.length > 1) {
      const p = new Float64Array(stOgl * 3), idx = new Uint32Array(stInd);
      let j = 0;
      for (const k of kosi) {
        p.set(k.p, k.odmik * 3);
        const n = k.idx ? k.idx.length : k.p.length / 3;
        for (let i = 0; i < n; i++) idx[j++] = (k.idx ? k.idx[i] : i) + k.odmik;
      }
      const r = analiziraj(p, idx, zrc);
      for (const k of Object.keys(r)) if (k === "zanke") sk.zanke.push(...r.zanke); else sk[k] += r[k];
    }
    sk.zanke.sort((a, b) => b.obseg - a.obseg);
    deli.push(sk);
  }
  return deli;
}

export function seznamDatotek(filtri = []) {
  const out = [];
  for (const m of MAPE) {
    const d = path.join(MODELI, m);
    if (!fs.existsSync(d)) continue;
    for (const f of fs.readdirSync(d).filter((x) => x.endsWith(".glb")).sort()) {
      const rel = `${m}/${f}`;
      if (!filtri.length || filtri.some((x) => rel.includes(x))) out.push(rel);
    }
  }
  return out;
}

// Izhodišče: { "<mapa>/<datoteka>": { "<del>": [odprtiRobovi, luknje, nemnogoterni, obrnjene, navznoter, izrojeni] } },
// samo deli z vsaj eno neničelno mero.
export function vIzhodisce(deli) {
  const o = {};
  for (const d of deli) {
    const v = MERE.map((m) => d[m]);
    if (v.some((x) => x > 0)) o[d.ime] = v;
  }
  return o;
}

// Nove težave glede na izhodišče: seznam besedil (prazen = v redu).
export function noveTezave(rel, deli, izh) {
  const staro = izh[rel] || {};
  const out = [];
  for (const d of deli) {
    const b = staro[d.ime] || [];
    MERE.forEach((m, i) => {
      if (d[m] > (b[i] ?? 0)) out.push(`${rel} »${d.ime}«${d.zila ? " (žila)" : ""}: ${m} ${b[i] ?? 0} → ${d[m]}`);
    });
  }
  return out;
}

const mm = (x) => (x * 1000).toFixed(1).replace(".", ",");

async function glavni() {
  const arg = process.argv.slice(2);
  const zast = new Set(arg.filter((a) => a.startsWith("--")));
  const filtri = arg.filter((a) => !a.startsWith("--"));
  const datoteke = seznamDatotek(filtri);
  const rezultati = {};
  const t0 = Date.now();
  for (const rel of datoteke) rezultati[rel] = await preveriGLB(path.join(MODELI, rel));
  const cas = ((Date.now() - t0) / 1000).toFixed(1);

  if (zast.has("--json")) {
    const out = {};
    for (const [rel, deli] of Object.entries(rezultati)) out[rel] = deli.map((d) => ({ ...d, zanke: d.zanke.map((z) => ({ robov: z.robov, obsegMm: +(z.obseg * 1000).toFixed(2) })) }));
    process.stdout.write(JSON.stringify(out, null, 1) + "\n");
  } else {
    const vrstice = [["model", "delov", "trikotn.", "s luknjo", "lukenj", "odpr. robov", "nemnog.", "obrnj. ploskev", "navznoter", "izrojenih", "žil", "žil z luknjo", "lukenj v žilah"]];
    for (const [rel, deli] of Object.entries(rezultati)) {
      const s = (f, m) => deli.filter(f).reduce((a, d) => a + d[m], 0);
      const zile = deli.filter((d) => d.zila);
      vrstice.push([rel, deli.length, s(() => 1, "trikotniki"), deli.filter((d) => d.luknje).length, s(() => 1, "luknje"), s(() => 1, "odprtiRobovi"),
        s(() => 1, "nemnogoterni"), s(() => 1, "obrnjene"), s(() => 1, "navznoter"), s(() => 1, "izrojeni"), zile.length, zile.filter((d) => d.luknje).length, s((d) => d.zila, "luknje")].map(String));
    }
    const sir = vrstice[0].map((_, i) => Math.max(...vrstice.map((r) => r[i].length)));
    for (const r of vrstice) console.log(r.map((c, i) => (i ? c.padStart(sir[i]) : c.padEnd(sir[i]))).join("  "));
    console.log(`\n${datoteke.length} datotek v ${cas} s. Luknja = sklenjena veriga odprtih robov (tudi odprt konec cevi).\n`);
    const meja = zast.has("--vse") ? Infinity : 12;
    for (const [rel, deli] of Object.entries(rezultati)) {
      const slabi = deli.filter((d) => MERE.some((m) => d[m] > 0)).sort((a, b) => (b.zila - a.zila) || (b.luknje - a.luknje) || (b.obrnjene - a.obrnjene));
      if (!slabi.length) continue;
      console.log(`${rel}: ${slabi.length} delov s težavami`);
      for (const d of slabi.slice(0, meja)) {
        const z = d.zanke.slice(0, 3).map((x) => mm(x.obseg)).join(", ");
        console.log(`  ${d.zila ? "[žila] " : ""}${d.ime}: lukenj ${d.luknje}${z ? ` (obseg največjih ${z} mm)` : ""}, odprtih robov ${d.odprtiRobovi}, nemnog. ${d.nemnogoterni}, obrnjenih ${d.obrnjene}, navznoter ${d.navznoter}/${d.zaprte} zaprtih, izrojenih ${d.izrojeni}${d.neTrikotniki ? `, primitivov, ki niso trikotniki, ${d.neTrikotniki}` : ""}`);
      }
      if (slabi.length > meja) console.log(`  … še ${slabi.length - meja} (--vse)`);
    }
  }

  let izh = {};
  try { izh = JSON.parse(fs.readFileSync(IZHODISCE, "utf8")); }
  catch (e) { if (e.code !== "ENOENT") throw e; }
  const nove = Object.entries(rezultati).flatMap(([rel, deli]) => noveTezave(rel, deli, izh.modeli || {}));
  if (zast.has("--izhodisce")) {
    if (filtri.length) { console.error("--izhodisce zapiše vse modele: zaženi brez filtra."); process.exit(1); }
    if (nove.length && Object.keys(izh).length && !zast.has("--sprejmi-slabse")) {
      console.error(`Izhodišče se sme samo zmanjšati. Slabše kot prej (${nove.length}):\n${nove.slice(0, 40).join("\n")}\nZ --sprejmi-slabse ga vseeno zapišeš.`);
      process.exit(1);
    }
    const modeli = {};
    for (const [rel, deli] of Object.entries(rezultati)) modeli[rel] = vIzhodisce(deli);
    const besedilo = "{\n \"opis\": \"Izhodišče pregleda mrež (scripts/atlas/preveri-mreze.mjs --izhodisce). Na del: [" + MERE.join(", ") + "]. test/3d-mreze.test.js pade, ko je kateri del slabši. Samo zmanjševati.\",\n \"modeli\": {\n" +
      Object.entries(modeli).map(([rel, d]) => `  ${JSON.stringify(rel)}: {` + Object.entries(d).map(([k, v]) => `\n   ${JSON.stringify(k)}: ${JSON.stringify(v)}`).join(",") + (Object.keys(d).length ? "\n  }" : "}")).join(",\n") +
      "\n }\n}\n";
    fs.writeFileSync(IZHODISCE, besedilo);
    console.error(`Zapisano ${path.relative(ROOT, IZHODISCE)}.`);
  } else if (zast.has("--primerjaj")) {
    if (nove.length) { console.error(`Nove težave glede na izhodišče (${nove.length}):\n${nove.join("\n")}`); process.exit(1); }
    console.error("Brez novih težav glede na izhodišče.");
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await glavni();

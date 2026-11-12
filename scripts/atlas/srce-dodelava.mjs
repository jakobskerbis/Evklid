// Dodelava srca po izvozu in popravilu žil (docs/3d.md »Heart finishing«). Vrstni red po vsakem novem izvozu:
//   1. node scripts/atlas/popravi-zile.mjs srce        (žile: stene, zaprti konci; samo enkrat na svežem izvozu)
//   2. node scripts/atlas/srce-dodelava.mjs            (ta skripta; ponovni zagon ne spremeni nič)
//   3. node scripts/atlas/rez-stena.mjs srce           (delež stene za pokrov reza iz končne mreže)
// Kaj naredi (srce.glb in srce-telefon.glb, na mestu; --suho samo poroča):
//   tkiva   gubi ob ustjih (zaklopka spodnje votle vene in venčnega sinusa) in dno ovalne kotanje dobijo tkivo »guba«:
//           tanka, gladka guba endokarda brez pečene teksture (prej sivo modre ploščice v desnem preddvoru)
//   zvari   deli brez pečene teksture (tkiva s »tekstura«: false: lističi, tetive, obroči, žepki, gube) nimajo šivov UV,
//           zato se oglišča z istim položajem in normalo združijo (UV se ne uporablja); ≈ polovica oglišč teh delov
//   enoUV   (samo telefon) mesnate trabekule: UV-otoki so drobni (skoraj vsak trikotnik svoj), zato imajo več oglišč
//           kot trikotnikov; vsa oglišča dobijo UV ene točke endokarda (barva iz pečene teksture ostane, drobni vzorec
//           ne) in se zvarijo. Tako telefon ostane pod 2 MiB brez manj trikotnikov.
//   vgrezni venčne arterije in vene (tkivi vencna-arterija, vencna-vena) ležijo pod epikardom, napol v steni oziroma v
//           maščobi žleba. Po izvozu je os cevi ponekod nad površino (cev »leži« na srcu kot črv), drugod globoko
//           pod njo (iz stene gleda le kratek kos). Vsak prerez cevi se premakne vzdolž normale epikarda, da je os
//           povsod VGREZ polmera nad površino (≈ 60 % premera vidnega); premik je gladek vzdolž žile, oblika prereza
//           ostane. Enkrat (vozlišče dobi extras »vgreznjeno«).
//   potopi  (v istem koraku kot vgrezni) papilarne mišice, trabekule in prevodni sistem, ki na tankem mestu stene
//           desnega prekata gledajo skozi epikard (rdeči »štrclji« na površini), se premaknejo pod površino
//   krpe    luknjice v steni iz CT (majhne zanke odprtih robov, ki niso šiv med deli stene) se zakrpajo
// Pri zvari/enoUV se položaji, normale in barve oglišč ne spremenijo (surove kvantizirane vrednosti).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import * as G from "./zile-mreza.mjs";
import { zapriZanko } from "./popravi-zile.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const MAPA = path.join(ROOT, "public", "3d", "modeli", "organi-3d");

// Novo tkivo po imenu vozlišča.
export const TKIVA = [
  [/^Valve of (coronary sinus|inferior vena cava)$/, "guba"],
  [/^Fossa ovalis$/, "guba"],
];
// Deli, ki na telefonu dobijo UV ene točke.
export const ENO_UV = /^Trabeculae carneae of (left|right) ventricle/;

// Vgrez venčnih žil: os cevi toliko polmerov nad epikardom (0 = os na površini, 1 = cev leži na njej).
export const VGREZ = 0.2;
const ZILA = /^vencna-(arterija|vena)$/;

// Mreža trikotnikov epikarda za iskanje najbližje točke (celice velikosti h).
export function mrezaTrikotnikov(tri, h) {
  const cel = new Map();
  for (let t = 0; t < tri.length; t += 9) {
    const lo = [0, 1, 2].map((c) => Math.floor(Math.min(tri[t + c], tri[t + 3 + c], tri[t + 6 + c]) / h));
    const hi = [0, 1, 2].map((c) => Math.floor(Math.max(tri[t + c], tri[t + 3 + c], tri[t + 6 + c]) / h));
    for (let x = lo[0]; x <= hi[0]; x++) for (let y = lo[1]; y <= hi[1]; y++) for (let z = lo[2]; z <= hi[2]; z++) {
      const k = `${x},${y},${z}`;
      let l = cel.get(k);
      if (!l) cel.set(k, (l = []));
      l.push(t);
    }
  }
  // najbližja točka površine v polmeru `doseg`: { d (predznačena razdalja, + zunaj), n (normala trikotnika) } ali null
  return (p, doseg) => {
    const c = p.map((v) => Math.floor(v / h));
    const R = Math.ceil(doseg / h);
    let bd = doseg, naj = null;
    const videni = new Set();
    for (let x = c[0] - R; x <= c[0] + R; x++) for (let y = c[1] - R; y <= c[1] + R; y++) for (let z = c[2] - R; z <= c[2] + R; z++) {
      const l = cel.get(`${x},${y},${z}`);
      if (!l) continue;
      for (const t of l) {
        if (videni.has(t)) continue;
        videni.add(t);
        const a = [tri[t], tri[t + 1], tri[t + 2]], b = [tri[t + 3], tri[t + 4], tri[t + 5]], cc = [tri[t + 6], tri[t + 7], tri[t + 8]];
        const q = G.najblizjaNaTrikotniku(p, a, b, cc);
        const tocka = Array.isArray(q) ? q : q.p || q.q || q.tocka;
        const d = G.v3.dist(p, tocka);
        if (d < bd) { bd = d; naj = { tocka, n: G.v3.norm(G.v3.cross(G.v3.sub(b, a), G.v3.sub(cc, a))) }; }
      }
    }
    if (!naj) return null;
    return { d: G.v3.dot(G.v3.sub(p, naj.tocka), naj.n) >= 0 ? bd : -bd, n: naj.n };
  };
}

// Premik oglišč žile (m: mreža iz G.preberi) na enakomerno globino. Vrne { premaknjenih, najvecji (m) }.
export function vgrezni(m, povrsina, vgrez = VGREZ) {
  const W = m.W;
  const s = W.map((p) => povrsina(p, 0.012));
  // sosedje v krogli 3 mm (ves prerez cevi in kos vzdolž nje): povprečje = lega osi, razpon = premer
  const h = 0.003;
  const cel = new Map();
  W.forEach((p, w) => { const k = p.map((v) => Math.floor(v / h)).join(","); let l = cel.get(k); if (!l) cel.set(k, (l = [])); l.push(w); });
  const premik = W.map((p, w) => {
    if (!s[w]) return null;
    const c = p.map((v) => Math.floor(v / h));
    let sd = 0, st = 0, mn = Infinity, mx = -Infinity;
    const n = [0, 0, 0];
    for (let x = c[0] - 1; x <= c[0] + 1; x++) for (let y = c[1] - 1; y <= c[1] + 1; y++) for (let z = c[2] - 1; z <= c[2] + 1; z++) for (const u of cel.get(`${x},${y},${z}`) || []) {
      if (!s[u] || G.v3.dist(p, W[u]) > h) continue;
      sd += s[u].d; st++;
      if (s[u].d < mn) mn = s[u].d;
      if (s[u].d > mx) mx = s[u].d;
      n[0] += s[u].n[0]; n[1] += s[u].n[1]; n[2] += s[u].n[2];
    }
    if (!st || G.v3.len(n) < 0.3 * st) return null; // normale si nasprotujejo (žila med dvema stenama): ostane
    const r = (mx - mn) / 2;
    const k = Math.max(-0.004, Math.min(0.004, vgrez * r - sd / st));
    return G.v3.mul(G.v3.norm(n), k);
  });
  // premik zgladimo po sosedih mreže (brez stopnic med prerezi)
  const sos = W.map(() => new Set());
  for (let f = 0; f < m.F.length; f += 3) for (let k = 0; k < 3; k++) { const a = m.zvar[m.F[f + k]], b = m.zvar[m.F[f + (k + 1) % 3]]; sos[a].add(b); sos[b].add(a); }
  let P = premik.map((v) => v || [0, 0, 0]);
  for (let krog = 0; krog < 6; krog++) {
    P = P.map((v, w) => {
      const a = [v[0], v[1], v[2]];
      for (const u of sos[w]) { a[0] += P[u][0]; a[1] += P[u][1]; a[2] += P[u][2]; }
      return a.map((x) => x / (sos[w].size + 1));
    });
  }
  let najvecji = 0, premaknjenih = 0;
  for (let r = 0; r < m.zvar.length; r++) {
    const v = P[m.zvar[r]];
    const l = G.v3.len(v);
    if (l < 1e-6) continue;
    premaknjenih++;
    if (l > najvecji) najvecji = l;
    m.P[r * 3] += v[0]; m.P[r * 3 + 1] += v[1]; m.P[r * 3 + 2] += v[2];
  }
  if (premaknjenih) { m.spremenjeno = true; G.zvari(m); }
  return { premaknjenih, najvecji };
}

// Luknjice v steni: deli stene so krpe ene zaprte površine, zato so njihovi robovi šivi s sosednjimi deli. Majhna
// zanka odprtih robov (obseg do KRPA m), ki ni na šivu (nobeno njeno oglišče ni na robu drugega dela), je prava
// luknja v steni iz CT (okence, skozi katero se od zunaj vidi papilarna mišica v votlini): zapre se s krpo.
// mreze: [G.preberi(...)] vseh delov stene; vrne [{ del, oglisc, sredisce }].
export const KRPA = 0.02;
export function zakrpajStene(mreze) {
  const h = 1e-4;
  const cel = new Map();
  const zanke = mreze.map((m) => G.zanke(m));
  zanke.forEach((zz, d) => { for (const z of zz) for (const e of z) {
    const k = mreze[d].W[e.w].map((v) => Math.floor(v / h)).join(",");
    let l = cel.get(k);
    if (!l) cel.set(k, (l = []));
    l.push([d, e.w]);
  } });
  const naSivu = (d, p) => {
    const c = p.map((v) => Math.floor(v / h));
    for (let x = c[0] - 1; x <= c[0] + 1; x++) for (let y = c[1] - 1; y <= c[1] + 1; y++) for (let z = c[2] - 1; z <= c[2] + 1; z++)
      for (const [d2, w] of cel.get(`${x},${y},${z}`) || []) if (d2 !== d && G.v3.dist(p, mreze[d2].W[w]) < 5e-5) return true;
    return false;
  };
  const krpe = [];
  mreze.forEach((m, d) => {
    const prave = zanke[d].filter((z) => G.opisZanke(m, z).obseg <= KRPA && !z.some((e) => naSivu(d, m.W[e.w])));
    for (const z of prave) { krpe.push({ del: d, oglisc: z.length, sredisce: G.opisZanke(m, z).c }); zapriZanko(m, z); }
    if (prave.length) { m.spremenjeno = true; G.zvari(m); }
  });
  return krpe;
}

// Notranje strukture (papilarne mišice, trabekule, prevodni sistem), ki na tankem mestu stene gledajo skozi epikard: oglišča zunaj
// površine (ali manj kot POD pod njo) se premaknejo pod površino. Vrne število premaknjenih oglišč.
const NOTRANJE = /papillary muscle|Trabeculae carneae|Septomarginal|Conducting system/;
// deli s tkivom stene, ki niso stena (ležijo v votlinah ali so naša dopolnitev): ne štejejo v površino epikarda
const NI_STENA = /papillary|Trabecul|Septomarginal|pectinati|Crista|Limbus|\(lastno\)/;
const POD = 0.0015;
// Drugi korak (»vidno«: { bvh trikotnikov stene, sredisce srca }) za ostre robove in vdolbine, kjer predznak do
// najbližje ploskve vara: oglišče, od katerega žarek stran od središča srca ne zadene stene, proti središču pa jo
// zadene v 8 mm, je zunaj; premakne se proti središču POD pod to ploskev.
export function potopi(m, povrsina, vidno = null) {
  let st = 0;
  const premik = m.W.map((p) => {
    if (vidno) {
      const ven = G.v3.norm(G.v3.sub(p, vidno.sredisce));
      if (vidno.bvh.zarek(p, ven, 1) < 0) {
        const t = vidno.bvh.zarek(p, G.v3.mul(ven, -1), 0.008);
        if (t >= 0) { st++; return G.v3.mul(ven, -(t + POD)); }
      }
    }
    const q = povrsina(p, 0.006);
    if (q && q.d >= -POD) { st++; return G.v3.mul(q.n, -(q.d + POD)); }
    return null;
  });
  if (!st) return 0;
  for (let r = 0; r < m.zvar.length; r++) {
    const v = premik[m.zvar[r]];
    if (!v) continue;
    m.P[r * 3] += v[0]; m.P[r * 3 + 1] += v[1]; m.P[r * 3 + 2] += v[2];
  }
  m.spremenjeno = true;
  G.zvari(m);
  return st;
}

// Združi oglišča z enakimi surovimi vrednostmi atributov iz `kljuci` (drugi atributi: vrednost prvega oglišča).
// atributi: { ime: { a: TypedArray, n: velikost elementa } }, indeksi: TypedArray. Vrne { atributi, indeksi, n }.
export function zvari(atributi, indeksi, kljuci) {
  const st = atributi[kljuci[0]].a.length / atributi[kljuci[0]].n;
  const prvi = new Map();
  const nov = new Uint32Array(st);
  const obdrzi = [];
  for (let i = 0; i < st; i++) {
    let k = "";
    for (const ime of kljuci) { const { a, n } = atributi[ime]; for (let c = 0; c < n; c++) k += a[i * n + c] + ","; }
    let j = prvi.get(k);
    if (j === undefined) { j = obdrzi.length; prvi.set(k, j); obdrzi.push(i); }
    nov[i] = j;
  }
  const out = {};
  for (const [ime, { a, n }] of Object.entries(atributi)) {
    const b = new a.constructor(obdrzi.length * n);
    for (let j = 0; j < obdrzi.length; j++) for (let c = 0; c < n; c++) b[j * n + c] = a[obdrzi[j] * n + c];
    out[ime] = { a: b, n };
  }
  // trikotniki, ki se po varjenju izrodijo (dve enaki oglišči), odpadejo
  const idx = [];
  for (let f = 0; f + 2 < indeksi.length; f += 3) {
    const a = nov[indeksi[f]], b = nov[indeksi[f + 1]], c = nov[indeksi[f + 2]];
    if (a !== b && b !== c && a !== c) idx.push(a, b, c);
  }
  return { atributi: out, indeksi: obdrzi.length > 65535 ? Uint32Array.from(idx) : Uint16Array.from(idx), n: obdrzi.length };
}

// UV sredine trikotnika z največjo ploščino v UV med najmanj zasenčenimi (COLOR_0.r): točka sredi otoka svetlega endokarda.
export function tockaUV(uv, barva, nb, indeksi) {
  let naj = null, najO = -Infinity;
  for (let f = 0; f + 2 < indeksi.length; f += 3) {
    const [a, b, c] = [indeksi[f], indeksi[f + 1], indeksi[f + 2]];
    const pl = Math.abs((uv[b * 2] - uv[a * 2]) * (uv[c * 2 + 1] - uv[a * 2 + 1]) - (uv[c * 2] - uv[a * 2]) * (uv[b * 2 + 1] - uv[a * 2 + 1]));
    const sv = barva ? (barva[a * nb] + barva[b * nb] + barva[c * nb]) / 3 : 1;
    const ocena = pl * sv * sv;
    if (ocena > najO) { najO = ocena; naj = [Math.round((uv[a * 2] + uv[b * 2] + uv[c * 2]) / 3), Math.round((uv[a * 2 + 1] + uv[b * 2 + 1] + uv[c * 2 + 1]) / 3)]; }
  }
  return naj;
}

export async function dodelaj(datoteka, tkiva, { suho = false, stenaVozlisca = [] } = {}) {
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
  const doc = await io.read(datoteka);
  const telefon = /-telefon\.glb$/.test(datoteka);
  const porocilo = [];
  let prej = 0, potem = 0, trikotnikov = 0;
  // luknjice v steni (po krpanju jih ni več, zato je korak ponovljiv)
  {
    const deli = doc.getRoot().listNodes().filter((n) => n.getMesh() && (tkiva[n.getExtras()?.tkivo]?.rezVolumen || stenaVozlisca.includes(n.getName())));
    const prims = deli.map((n) => n.getMesh().listPrimitives()[0]);
    const mreze = deli.map((n, i) => G.preberi(n, prims[i]));
    for (const k of zakrpajStene(mreze)) porocilo.push(`${deli[k.del].getName()}: zakrpana luknjica v steni (${k.oglisc} oglišč, ${k.sredisce.map((v) => (v * 1000).toFixed(0)).join(", ")} mm)`);
    if (!suho) deli.forEach((n, i) => { if (mreze[i].spremenjeno) G.zapisi(doc, n, prims[i], mreze[i]); });
  }
  // vgrez venčnih žil: epikard = zunanje ploskve sten (tkiva s prostorsko teksturo reza in vozlišča iste stene),
  // zunanje po odprtosti v barvi oglišč (COLOR_0.g: zunaj 1, votline 0)
  {
    const zile = doc.getRoot().listNodes().filter((n) => n.getMesh() && ZILA.test(n.getExtras()?.tkivo) && !n.getExtras().vgreznjeno);
    if (zile.length) {
      const tri = [];
      const stena = new Set(stenaVozlisca);
      for (const node of doc.getRoot().listNodes()) {
        const ex = node.getExtras() || {};
        if (!node.getMesh() || NI_STENA.test(node.getName()) || !(tkiva[ex.tkivo]?.rezVolumen || stena.has(node.getName()))) continue;
        for (const prim of node.getMesh().listPrimitives()) {
          const m = G.preberi(node, prim);
          const b = m.A.get("COLOR_0");
          for (let f = 0; f < m.F.length; f += 3) {
            const [i, j, k] = [m.F[f], m.F[f + 1], m.F[f + 2]];
            if (b && (b.d[i * b.n + 1] + b.d[j * b.n + 1] + b.d[k * b.n + 1]) / 3 < 0.5) continue; // stena votline
            for (const v of [i, j, k]) tri.push(m.P[v * 3], m.P[v * 3 + 1], m.P[v * 3 + 2]);
          }
        }
      }
      const povrsina = mrezaTrikotnikov(Float64Array.from(tri), 0.004);
      // vsi trikotniki stene (tudi stene votlin) za žarke in središče srca
      const vse = [];
      for (const node of doc.getRoot().listNodes()) {
        if (!node.getMesh() || NI_STENA.test(node.getName()) || !(tkiva[(node.getExtras() || {}).tkivo]?.rezVolumen || stena.has(node.getName()))) continue;
        for (const prim of node.getMesh().listPrimitives()) { const m = G.preberi(node, prim); for (const i of m.F) vse.push(m.P[i * 3], m.P[i * 3 + 1], m.P[i * 3 + 2]); }
      }
      const sredisce = [0, 0, 0];
      for (let i = 0; i < vse.length; i += 3) for (let c = 0; c < 3; c++) sredisce[c] += vse[i + c] / (vse.length / 3);
      const vidno = { bvh: new G.BVH(Float64Array.from(vse)), sredisce };
      for (const node of zile) {
        const prim = node.getMesh().listPrimitives()[0];
        const m = G.preberi(node, prim);
        const r = vgrezni(m, povrsina);
        porocilo.push(`${node.getName()}: vgreznjena (${r.premaknjenih} oglišč, največ ${(r.najvecji * 1000).toFixed(1)} mm)`);
        if (suho) continue;
        if (m.spremenjeno) G.zapisi(doc, node, prim, m);
        node.setExtras({ ...(node.getExtras() || {}), vgreznjeno: 1 });
      }
      for (const node of doc.getRoot().listNodes()) {
        if (!node.getMesh() || !NOTRANJE.test(node.getName())) continue;
        const prim = node.getMesh().listPrimitives()[0];
        const m = G.preberi(node, prim);
        const st = potopi(m, povrsina, vidno);
        if (!st) continue;
        porocilo.push(`${node.getName()}: ${st} oglišč pod epikard`);
        if (!suho) G.zapisi(doc, node, prim, m);
      }
    }
  }
  for (const node of doc.getRoot().listNodes()) {
    const mesh = node.getMesh();
    if (!mesh) continue;
    const ime = node.getName();
    const ex = { ...(node.getExtras() || {}) };
    const novo = TKIVA.find(([rx]) => rx.test(ime));
    if (novo && ex.tkivo !== novo[1]) {
      porocilo.push(`${ime}: tkivo ${ex.tkivo} → ${novo[1]}`);
      ex.tkivo = novo[1];
      node.setExtras(ex);
    }
    for (const prim of mesh.listPrimitives()) {
      const ind = prim.getIndices();
      const st0 = prim.getAttribute("POSITION").getCount();
      prej += st0;
      const brezTeksture = tkiva[ex.tkivo]?.tekstura === false;
      const enoUV = telefon && ENO_UV.test(ime) && prim.getAttribute("TEXCOORD_0");
      if (!ind || prim.getMode() !== 4 || !(brezTeksture || enoUV)) { potem += st0; trikotnikov += ind ? ind.getCount() / 3 : 0; continue; }
      const atributi = {};
      for (const sem of prim.listSemantics()) atributi[sem] = { a: prim.getAttribute(sem).getArray().slice(), n: prim.getAttribute(sem).getElementSize() };
      if (enoUV) {
        const uv = atributi.TEXCOORD_0.a;
        const enaka = uv.every((v, i) => v === uv[i % 2]);
        if (!enaka) {
          const t = tockaUV(uv, atributi.COLOR_0?.a, atributi.COLOR_0?.n, ind.getArray());
          for (let i = 0; i < uv.length; i += 2) { uv[i] = t[0]; uv[i + 1] = t[1]; }
        }
      }
      // ključ: položaj in normala (tkivo brez teksture) oziroma vsi atributi razen barve (en UV); barva oglišč je senca,
      // ki se na šivu ne razlikuje
      const kljuci = Object.keys(atributi).filter((s) => (brezTeksture ? s === "POSITION" || s === "NORMAL" : s !== "COLOR_0"));
      const r = zvari(atributi, ind.getArray(), kljuci);
      potem += r.n;
      trikotnikov += r.indeksi.length / 3;
      if (r.n === st0 && !enoUV) continue;
      if (r.n !== st0) porocilo.push(`${ime}: oglišč ${st0} → ${r.n}${enoUV ? " (en UV)" : ""}`);
      if (suho) continue;
      for (const [sem, { a }] of Object.entries(r.atributi)) {
        const star = prim.getAttribute(sem);
        prim.setAttribute(sem, doc.createAccessor(star.getName()).setType(star.getType()).setNormalized(star.getNormalized()).setBuffer(star.getBuffer()).setArray(a));
      }
      prim.setIndices(doc.createAccessor(ind.getName()).setType("SCALAR").setBuffer(ind.getBuffer()).setArray(r.indeksi));
    }
  }
  if (!suho && porocilo.length) {
    for (const acc of doc.getRoot().listAccessors()) if (acc.listParents().every((p) => p.propertyType === "Root")) acc.dispose();
    await io.write(datoteka, doc);
  }
  return { porocilo, prej, potem, trikotnikov };
}

async function glavni() {
  const suho = process.argv.includes("--suho");
  const pot = path.join(MAPA, "srce.json");
  const j = JSON.parse(fs.readFileSync(pot, "utf8"));
  const st = {};
  for (const [f, kljuc] of [["srce.glb", "racunalnik"], ["srce-telefon.glb", "telefon"]]) {
    const d = path.join(MAPA, f);
    const b0 = fs.statSync(d).size;
    const r = await dodelaj(d, j.tkiva, { suho, stenaVozlisca: j.prerez?.volumen?.stenaVozlisca || [] });
    console.log(`${f}: oglišč ${r.prej} → ${r.potem}, ${(b0 / 1048576).toFixed(2)} → ${(fs.statSync(d).size / 1048576).toFixed(2)} MiB${r.porocilo.length ? "" : " (brez sprememb)"}`);
    for (const v of r.porocilo) console.log(`   ${v}`);
    st[kljuc] = r.trikotnikov;
  }
  if (!suho && (j.trikotniki?.racunalnik !== st.racunalnik || j.trikotniki?.telefon !== st.telefon)) {
    j.trikotniki = st;
    fs.writeFileSync(pot, JSON.stringify(j, null, 1) + "\n");
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await glavni();

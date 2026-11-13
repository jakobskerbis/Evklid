// Delež stene za pokrov reza (docs/3d.md »Cut surface in any plane«): iz KONČNE mreže organa izračuna, kolikšen del
// vsakega voksla leži v polnem tkivu, in ga zapiše kot sliko rezin ob GLB (R = stena: tkiva z `rezVolumen`, G = druga
// polna telesa s pokrovom reza, npr. venčne žile v maščobi žleba, B prazen; <organ>-stena.png, telefon
// <organ>-stena-telefon.png, ker ima telefon svojo mrežo). organ.js (materialPokrova, vol.stena) z njo odloči, kje je
// pokrov reza na globini ravnine. Prej je to odločala prostorska tekstura CT (dolžina vektorja vlaken), ki se z mrežo
// ne ujema povsod (endokard, premaknjen v votlino, relief maščobe in trabekul): rob reza je bil stopničast, ob njem
// »luske«. Poženi po vsaki spremembi mreže sten:  node scripts/atlas/rez-stena.mjs [organ = srce] [--korak 0.001]
//
// Postopek (vrstično vzorčenje): za vsak podvzorec (y, z) gre žarek vzdolž x skozi vse trikotnike tkiv z `rezVolumen`
// (brez delov iz prerez.brezPokrova); zadetke uredimo in štejemo navitje (+1 vstop, −1 izstop), zato se prekrivajoča
// zaprta telesa (dno papilarne mišice v steni) štejejo pravilno. Dolžina odsekov z navitjem > 0 v vsakem vokslu = delež.
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import * as G from "./zile-mreza.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const MAPA = path.join(ROOT, "public", "3d", "modeli", "organi-3d");
const PODVZORCI = 4; // podvzorcev na voksel v y in z
const OBRNJENA_STENA = 0.004; // najdaljši odsek z negativnim navitjem, ki še šteje kot (obrnjena) stena (m)
const SDF = 0.003; // obseg predznačene razdalje v kanalu R (m): 0 = 3 mm zunaj stene, 1 = 3 mm v steni

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}
// Slika RGB 8 bitov (px: 3 bajti na piko) → PNG (brez odvisnosti); k = 4: RGBA.
export function pngRGB(w, h, px, k = 3) {
  const kos = (tip, d) => {
    const b = Buffer.alloc(12 + d.length);
    b.writeUInt32BE(d.length, 0);
    b.write(tip, 4, "ascii");
    d.copy(b, 8);
    b.writeUInt32BE(crc32(b.subarray(4, 8 + d.length)), 8 + d.length);
    return b;
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // globina
  ihdr[9] = k === 4 ? 6 : 2; // RGBA | RGB
  // filter vrstice (PNG: 0 brez, 1 Sub, 2 Up, 4 Paeth): izbran po najmanjši vsoti |bajt| (gladka razdalja se tako stisne)
  const L = w * k, surovo = Buffer.alloc((L + 1) * h);
  const vr = (y) => Buffer.from(px.buffer, px.byteOffset + y * L, L);
  const paeth = (a, b, c) => { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); return pa <= pb && pa <= pc ? a : pb <= pc ? b : c; };
  const kand = [Buffer.alloc(L), Buffer.alloc(L), Buffer.alloc(L), Buffer.alloc(L)];
  for (let y = 0; y < h; y++) {
    const r = vr(y), g = y ? vr(y - 1) : Buffer.alloc(L);
    let naj = 0, najV = Infinity;
    [0, 1, 2, 4].forEach((f, fi) => {
      const o = kand[fi];
      let v = 0;
      for (let i = 0; i < L; i++) {
        const a = i >= k ? r[i - k] : 0, b = g[i], c = i >= k ? g[i - k] : 0;
        const x = (r[i] - (f === 0 ? 0 : f === 1 ? a : f === 2 ? b : paeth(a, b, c))) & 255;
        o[i] = x;
        v += x < 128 ? x : 256 - x;
      }
      if (v < najV) { najV = v; naj = fi; }
    });
    surovo[y * (L + 1)] = [0, 1, 2, 4][naj];
    kand[naj].copy(surovo, y * (L + 1) + 1);
  }
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), kos("IHDR", ihdr), kos("IDAT", zlib.deflateSync(surovo, { level: 9 })), kos("IEND", Buffer.alloc(0))]);
}

// Trikotniki (svetovne koordinate GLB, Float64Array po 9) → delež stene na mreži { lo, korak, n }.
export function delezStene(tri, { lo, korak, n }) {
  const S = PODVZORCI;
  const h = korak / S;
  const ny = n[1] * S, nz = n[2] * S;
  const glava = new Int32Array(ny * nz).fill(-1);
  let nasl = new Int32Array(1 << 20), xs = new Float64Array(1 << 20), zn = new Int8Array(1 << 20), st = 0;
  const rasti = () => {
    const a = new Int32Array(nasl.length * 2); a.set(nasl); nasl = a;
    const b = new Float64Array(xs.length * 2); b.set(xs); xs = b;
    const c = new Int8Array(zn.length * 2); c.set(zn); zn = c;
  };
  // majhen zamik vzorcev, da žarek ne zadene natanko roba ali oglišča (kvantizirana oglišča ležijo na mreži)
  const oy = lo[1] + h * 0.5 + korak * 1.37e-4, oz = lo[2] + h * 0.5 + korak * 2.11e-4;
  for (let t = 0; t < tri.length; t += 9) {
    const ax = tri[t], ay = tri[t + 1], az = tri[t + 2], bx = tri[t + 3], by = tri[t + 4], bz = tri[t + 5], cx = tri[t + 6], cy = tri[t + 7], cz = tri[t + 8];
    // normala.x = (b − a) × (c − a) v ravnini yz; 0 → trikotnik vzporeden žarku
    const nx = (by - ay) * (cz - az) - (bz - az) * (cy - ay);
    if (Math.abs(nx) < 1e-18) continue;
    const j0 = Math.max(0, Math.ceil((Math.min(ay, by, cy) - oy) / h)), j1 = Math.min(ny - 1, Math.floor((Math.max(ay, by, cy) - oy) / h));
    const k0 = Math.max(0, Math.ceil((Math.min(az, bz, cz) - oz) / h)), k1 = Math.min(nz - 1, Math.floor((Math.max(az, bz, cz) - oz) / h));
    for (let k = k0; k <= k1; k++) {
      const z = oz + k * h;
      for (let j = j0; j <= j1; j++) {
        const y = oy + j * h;
        // težiščne koordinate v ravnini yz
        const w0 = ((by - y) * (cz - z) - (bz - z) * (cy - y)) / nx;
        const w1 = ((cy - y) * (az - z) - (cz - z) * (ay - y)) / nx;
        const w2 = 1 - w0 - w1;
        if (w0 < 0 || w1 < 0 || w2 < 0) continue;
        if (st === nasl.length) rasti();
        xs[st] = w0 * ax + w1 * bx + w2 * cx;
        zn[st] = nx < 0 ? 1 : -1; // normala proti −x: žarek v smeri +x vstopi
        nasl[st] = glava[k * ny + j];
        glava[k * ny + j] = st++;
      }
    }
  }
  const delez = new Float32Array(n[0] * n[1] * n[2]);
  const utez = 1 / (S * S * korak);
  let negativnih = 0, odprtih = 0;
  const zad = [];
  // krog m2: žarek, ki se ne konča z navitjem 0 (zadel je rob odprtine v mreži ali natanko rob trikotnika), ne šteje:
  // vrstica vokslov se uteži s preostalimi podvzorci (prej je tak žarek čez ves rez pustil tanko progo napačne stene)
  const slabih = new Uint8Array(n[1] * n[2]);
  for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) {
    zad.length = 0;
    for (let i = glava[k * ny + j]; i >= 0; i = nasl[i]) zad.push(i);
    if (!zad.length) continue;
    zad.sort((a, b) => xs[a] - xs[b]);
    const vr = (Math.floor(k / S) * n[1] + Math.floor(j / S)) * n[0];
    let vsota = 0;
    for (let q = 0; q < zad.length; q++) vsota += zn[zad[q]];
    if (vsota !== 0) { odprtih++; slabih[vr / n[0]]++; continue; }
    let nav = 0;
    for (let q = 0; q < zad.length; q++) {
      const prej = nav;
      nav += zn[zad[q]];
      if (nav < 0) negativnih++;
      // krog 9 (ocena: »bledi zavihki stene levega preddvora na rezu telefona«): tanka stena preddvora se pri
      // poenostavitvi telefonske mreže ponekod obrne (endokard pride čez epikard), navitje je tam −1. Kratek odsek z
      // negativnim navitjem (< OBRNJENA_STENA) je zato obrnjena stena, ne votlina med odprtimi deli mreže.
      if (q > 0 && (prej > 0 || (prej < 0 && xs[zad[q]] - xs[zad[q - 1]] < OBRNJENA_STENA))) {
        // odsek [x0, x1] je v tkivu
        const x0 = (xs[zad[q - 1]] - lo[0]) / korak, x1 = (xs[zad[q]] - lo[0]) / korak;
        for (let i = Math.max(0, Math.floor(x0)); i <= Math.min(n[0] - 1, Math.floor(x1)); i++) {
          const d = Math.min(x1, i + 1) - Math.max(x0, i);
          if (d > 0) delez[vr + i] += d * korak * utez;
        }
      }
    }
  }
  // vrstice z izpuščenimi žarki: delež iz preostalih podvzorcev; brez veljavnega podvzorca povprečje sosednjih vrstic
  const prazne = [];
  for (let v = 0; v < slabih.length; v++) {
    if (!slabih[v]) continue;
    if (slabih[v] >= S * S) { prazne.push(v); continue; }
    const f = (S * S) / (S * S - slabih[v]);
    for (let i = 0; i < n[0]; i++) delez[v * n[0] + i] *= f;
  }
  for (const v of prazne) {
    const j = v % n[1], k = (v - j) / n[1];
    const sos = [[j - 1, k], [j + 1, k], [j, k - 1], [j, k + 1]].filter(([a, b]) => a >= 0 && b >= 0 && a < n[1] && b < n[2] && slabih[b * n[1] + a] < S * S);
    if (!sos.length) continue;
    for (let i = 0; i < n[0]; i++) delez[v * n[0] + i] = sos.reduce((a, [x, y]) => a + delez[(y * n[1] + x) * n[0] + i], 0) / sos.length;
  }
  return { delez, zadetkov: st, negativnih, odprtih };
}

// Krog 8 (ocena: »enakomerna lososova ploskev s svetlim sijem ob vsakem robu«): predznačena razdalja do površine stene in
// stran najbližje površine, za plasti na pokrovu reza (epikard, miokard, endokard) v pravih milimetrih. Vrne
// { razdalja (+ v steni, metri, omejeno na ±D), epi (1 = najbližja ploskev je epikard: žarek iz trikotnika v smeri
// normale ne zadene stene; 0 = stena votline) }. Trikotnik se razširi na voksle v svoji škatli ± D (točna razdalja
// točka–trikotnik); predznak iz deleža (delez > 0,5 = v steni).
export function razdaljaStene(tri, { lo, korak, n }, delez, D = 0.003, jeEpi = null) {
  const N = n[0] * n[1] * n[2];
  const raz = new Float32Array(N).fill(D);
  const epi = new Float32Array(N).fill(0.5);
  const nt = tri.length / 9;
  for (let t = 0; t < nt; t++) {
    const k = t * 9;
    const a = [tri[k], tri[k + 1], tri[k + 2]], b = [tri[k + 3], tri[k + 4], tri[k + 5]], c = [tri[k + 6], tri[k + 7], tri[k + 8]];
    const e = jeEpi ? jeEpi[t] : 0.5;
    const i0 = [0, 1, 2].map((q) => Math.max(0, Math.floor((Math.min(a[q], b[q], c[q]) - D - lo[q]) / korak - 0.5)));
    const i1 = [0, 1, 2].map((q) => Math.min(n[q] - 1, Math.ceil((Math.max(a[q], b[q], c[q]) + D - lo[q]) / korak - 0.5)));
    for (let z = i0[2]; z <= i1[2]; z++) for (let y = i0[1]; y <= i1[1]; y++) for (let x = i0[0]; x <= i1[0]; x++) {
      const v = (z * n[1] + y) * n[0] + x;
      const p = [lo[0] + (x + 0.5) * korak, lo[1] + (y + 0.5) * korak, lo[2] + (z + 0.5) * korak];
      const q = G.najblizjaNaTrikotniku(p, a, b, c);
      const d = Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
      if (d < raz[v]) { raz[v] = d; epi[v] = e; }
    }
  }
  for (let v = 0; v < N; v++) if (delez[v] <= 0.5) raz[v] = -raz[v];
  return { razdalja: raz, epi };
}

// Epikard ali stena votline za vsak trikotnik (1 / 0): žarek iz težišča v smeri normale ne zadene / zadene stene.
export function epikardniTrikotniki(tri) {
  const bvh = new G.BVH(tri);
  const nt = tri.length / 9;
  const r = new Float32Array(nt);
  for (let t = 0; t < nt; t++) {
    const k = t * 9;
    const a = [tri[k], tri[k + 1], tri[k + 2]], b = [tri[k + 3], tri[k + 4], tri[k + 5]], c = [tri[k + 6], tri[k + 7], tri[k + 8]];
    const nn = G.v3.norm(G.v3.cross(G.v3.sub(b, a), G.v3.sub(c, a)));
    if (G.v3.len(nn) < 0.5) { r[t] = 0.5; continue; }
    const s = [(a[0] + b[0] + c[0]) / 3 + nn[0] * 2e-4, (a[1] + b[1] + c[1]) / 3 + nn[1] * 2e-4, (a[2] + b[2] + c[2]) / 3 + nn[2] * 2e-4];
    r[t] = bvh.zarek(s, nn, 1) < 0 ? 1 : 0;
  }
  return r;
}

// Rezine z enim vokslom roba (kot <organ>-volumen.png): slika ploscice[0] × ploscice[1] ploščic velikosti (nx + 2) × (ny + 2).
// kanali: [delež R, delež G] (Float32Array ali null).
export function rezine(kanali, n) {
  const px = Math.ceil(Math.sqrt(n[2]));
  const py = Math.ceil(n[2] / px);
  const tw = n[0] + 2, th = n[1] + 2;
  const K = kanali.length > 3 ? 4 : 3;
  const slika = new Uint8Array(px * tw * py * th * K);
  for (let z = 0; z < n[2]; z++) {
    const ox = (z % px) * tw, oy = Math.floor(z / px) * th;
    for (let y = 0; y < th; y++) for (let x = 0; x < tw; x++) {
      const vx = Math.min(n[0] - 1, Math.max(0, x - 1)), vy = Math.min(n[1] - 1, Math.max(0, y - 1));
      for (let c = 0; c < kanali.length; c++) if (kanali[c]) slika[((oy + y) * px * tw + ox + x) * K + c] = Math.round(255 * Math.min(1, Math.max(0, kanali[c][(z * n[1] + vy) * n[0] + vx])));
    }
  }
  return { slika, w: px * tw, h: py * th, ploscice: [px, py], kanalov: K };
}

// Trikotniki vozlišč, ki jih izbere `izberi(extras, ime)`.
async function trikotniki(datoteka, izberi) {
  const doc = await new NodeIO().registerExtensions(ALL_EXTENSIONS).read(datoteka);
  const kosi = [];
  let st = 0;
  for (const node of doc.getRoot().listNodes()) {
    const mesh = node.getMesh();
    const ex = node.getExtras() || {};
    if (!mesh || !izberi(ex, node.getName())) continue;
    for (const prim of mesh.listPrimitives()) {
      const m = G.preberi(node, prim);
      const t = new Float64Array(m.F.length * 3);
      for (let f = 0; f < m.F.length; f++) for (let c = 0; c < 3; c++) t[f * 3 + c] = m.P[m.F[f] * 3 + c];
      kosi.push(t);
      st += t.length;
    }
  }
  const tri = new Float64Array(st);
  let o = 0;
  for (const t of kosi) { tri.set(t, o); o += t.length; }
  return tri;
}

async function glavni() {
  const arg = process.argv.slice(2);
  const organ = arg.find((a) => !a.startsWith("--") && arg[arg.indexOf(a) - 1] !== "--korak") || "srce";
  const korak = arg.includes("--korak") ? +arg[arg.indexOf("--korak") + 1] : 0.001;
  const pot = path.join(MAPA, `${organ}.json`);
  const j = JSON.parse(fs.readFileSync(pot, "utf8"));
  if (!j.prerez?.volumen) throw new Error(`${organ}.json: prerez.volumen manjka`);
  // brez pokrova in deli, ki jih pogled prereza skrije (pogledi.prerez.skrijDele): ne štejejo ne v steno ne v druga telesa
  const brez = new Set([...(j.prerez.brezPokrova || []), ...(j.pogledi?.prerez?.skrijDele || [])]);
  for (const d of j.deli || []) if (d.skupina && brez.has(d.skupina)) brez.add(d.id); // skupina skrije tudi svoje dele (kot organ.js)
  // B: notranji deli stene v votlinah (prerez.volumen.brezMasce, regularni izraz imen vozlišč: papilarne mišice,
  // trabekule); prostorska tekstura ima v votlinah naključno »maščobo«, zato je bil njihov prerez bel
  const brezMasce = j.prerez.volumen.brezMasce ? new RegExp(j.prerez.volumen.brezMasce) : null;
  const jeBrezMasce = (ex, ime) => (!!brezMasce?.test(ime) || !!votlo?.test(ime)) && !brez.has(ex.del);
  // stena: tkiva s prostorsko teksturo reza in vozlišča iste zaprte stene z drugim tkivom (stenaVozlisca: korena aorte
  // in pljučnega debla sta del stene iz CT); druga: vsa druga tkiva, ki imajo pokrov reza (pravilo kot v organ.js)
  const dodatna = new Set(j.prerez.volumen.stenaVozlisca || []);
  // votlo (regularni izraz imen): votla telesa iz tkiva stene (srčni ušesi kot naša dopolnitev): niso polna stena, zato
  // brez pokrova na ravnini (v prerezu se vidi notranjost žepa), in tam ni maščobe (kanal B)
  const votlo = j.prerez.volumen.votlo ? new RegExp(j.prerez.volumen.votlo) : null;
  const jeStena = (ex, ime) => !brez.has(ex.del) && !votlo?.test(ime) && (!!j.tkiva[ex.tkivo]?.rezVolumen || dodatna.has(ime));
  const jeDrugo = (ex, ime) => {
    const t = j.tkiva[ex.tkivo] || {};
    return !brez.has(ex.del) && !jeStena(ex, ime) && !votlo?.test(ime) && !t.brezReza && !t.dvostransko && (t.prosojnost ?? 1) >= 1;
  };
  let mreza = null;
  const meta = { slika: `${organ}-stena.png`, telefon: `${organ}-stena-telefon.png` };
  for (const [pripona, kljuc] of [["", "slika"], ["-telefon", "telefon"]]) {
    const tri = await trikotniki(path.join(MAPA, `${organ}${pripona}.glb`), jeStena);
    const triDrugo = await trikotniki(path.join(MAPA, `${organ}${pripona}.glb`), jeDrugo);
    if (!mreza) {
      // mreža vokslov iz škatle računalniške mreže (telefonska je ista oblika), z robom dveh vokslov
      const mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity];
      for (let i = 0; i < tri.length; i++) { const c = i % 3; if (tri[i] < mn[c]) mn[c] = tri[i]; if (tri[i] > mx[c]) mx[c] = tri[i]; }
      mreza = { lo: mn.map((v) => +(v - 2 * korak).toFixed(5)), korak };
      mreza.n = mx.map((v, c) => Math.ceil((v - mreza.lo[c]) / korak) + 2);
    }
    const r = delezStene(tri, mreza);
    const triB = brezMasce || votlo ? await trikotniki(path.join(MAPA, `${organ}${pripona}.glb`), jeBrezMasce) : [];
    // R: predznačena razdalja (0,5 = površina stene, ±SDF m → 1 / 0), A: stran najbližje površine (epikard 1)
    const rd = razdaljaStene(tri, mreza, r.delez, SDF, epikardniTrikotniki(tri));
    const R = rd.razdalja.map((d) => 0.5 + d / (2 * SDF));
    const s = rezine([R, triDrugo.length ? delezStene(triDrugo, mreza).delez : null, triB.length ? delezStene(triB, mreza).delez : null, rd.epi], mreza.n);
    fs.writeFileSync(path.join(MAPA, meta[kljuc]), pngRGB(s.w, s.h, s.slika, s.kanalov));
    mreza.ploscice = s.ploscice;
    let polnih = 0;
    for (const v of r.delez) if (v > 0.5) polnih++;
    console.log(`${meta[kljuc]}: ${s.w} × ${s.h} px, ${(fs.statSync(path.join(MAPA, meta[kljuc])).size / 1024).toFixed(0)} kB; trikotnikov ${tri.length / 9}, zadetkov ${r.zadetkov}, negativno navitje ${r.negativnih}, odprtih žarkov ${r.odprtih}, tkivo ${(polnih * korak ** 3 * 1e6).toFixed(0)} cm³`);
  }
  j.prerez.volumen.stena = { ...meta, lo: mreza.lo, korak, n: mreza.n, ploscice: mreza.ploscice, sdf: SDF };
  fs.writeFileSync(pot, JSON.stringify(j, null, 1) + "\n");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await glavni();

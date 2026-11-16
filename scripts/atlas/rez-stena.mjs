// Delež stene za pokrov reza (docs/3d.md »Cut surface in any plane«): iz KONČNE mreže organa izračuna, kolikšen del
// vsakega voksla leži v polnem tkivu, in ga zapiše kot sliko rezin ob GLB (R = stena: tkiva z `rezVolumen`, G = druga
// polna telesa s pokrovom reza, npr. venčne žile v maščobi žleba (delež); R je predznačena razdalja do ploskve, glej
// razdaljaStene; B = delež notranjih delov stene v votlinah; <organ>-stena.png, telefon
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

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}
// Slika RGB 8 bitov (px: 3 bajti na piko) → PNG (brez odvisnosti).
export function pngRGB(w, h, px) {
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
  ihdr[9] = 2; // RGB
  const surovo = Buffer.alloc((w * 3 + 1) * h);
  for (let y = 0; y < h; y++) Buffer.from(px.buffer, px.byteOffset + y * w * 3, w * 3).copy(surovo, y * (w * 3 + 1) + 1);
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
  let negativnih = 0;
  const zad = [];
  for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) {
    zad.length = 0;
    for (let i = glava[k * ny + j]; i >= 0; i = nasl[i]) zad.push(i);
    if (!zad.length) continue;
    zad.sort((a, b) => xs[a] - xs[b]);
    const vr = (Math.floor(k / S) * n[1] + Math.floor(j / S)) * n[0];
    let nav = 0;
    for (let q = 0; q < zad.length; q++) {
      const prej = nav;
      nav += zn[zad[q]];
      if (nav < 0) negativnih++;
      if (prej > 0 && q > 0) {
        // odsek [x0, x1] je v tkivu
        const x0 = (xs[zad[q - 1]] - lo[0]) / korak, x1 = (xs[zad[q]] - lo[0]) / korak;
        for (let i = Math.max(0, Math.floor(x0)); i <= Math.min(n[0] - 1, Math.floor(x1)); i++) {
          const d = Math.min(x1, i + 1) - Math.max(x0, i);
          if (d > 0) delez[vr + i] += d * korak * utez;
        }
      }
    }
  }
  return { delez, zadetkov: st, negativnih };
}

// Predznačena razdalja do ploskve (j 16. 11.: »prerez ima nazobčan, valovit rob«). Delež voksla je ob ploskvi nasičen
// že v enem vokslu, zato je bila izoploskev 0,5 po trilinearni interpolaciji v ravnini, ki ni poravnana z mrežo,
// valovita (≈ 0,3 mm pri vokslu 1 mm, na zaslonu 1–2 piki). Razdalja je ob gladki ploskvi linearna, zato jo
// interpolacija ohrani: rob pokrova je gladek pri isti velikosti slike. Zapis: 0,5 + razdalja / (2 · PAS), znotraj
// tkiva > 0,5 (prag v organ.js ostane 0,5).
export const PAS = 0.002; // m: razdalje se odrežejo pri ±PAS

// Kvadrat razdalje točke p do trikotnika (a, b, c) (Ericson, Real-Time Collision Detection, 5.1.5).
function razdalja2(px, py, pz, t, o) {
  const ax = t[o], ay = t[o + 1], az = t[o + 2], abx = t[o + 3] - ax, aby = t[o + 4] - ay, abz = t[o + 5] - az, acx = t[o + 6] - ax, acy = t[o + 7] - ay, acz = t[o + 8] - az;
  const apx = px - ax, apy = py - ay, apz = pz - az;
  const d1 = abx * apx + aby * apy + abz * apz, d2 = acx * apx + acy * apy + acz * apz;
  let u, w; // najbližja točka = a + u·ab + w·ac
  if (d1 <= 0 && d2 <= 0) { u = 0; w = 0; }
  else {
    const bpx = apx - abx, bpy = apy - aby, bpz = apz - abz;
    const d3 = abx * bpx + aby * bpy + abz * bpz, d4 = acx * bpx + acy * bpy + acz * bpz;
    if (d3 >= 0 && d4 <= d3) { u = 1; w = 0; }
    else {
      const vc = d1 * d4 - d3 * d2;
      if (vc <= 0 && d1 >= 0 && d3 <= 0) { u = d1 / (d1 - d3); w = 0; }
      else {
        const cpx = apx - acx, cpy = apy - acy, cpz = apz - acz;
        const d5 = abx * cpx + aby * cpy + abz * cpz, d6 = acx * cpx + acy * cpy + acz * cpz;
        if (d6 >= 0 && d5 <= d6) { u = 0; w = 1; }
        else {
          const vb = d5 * d2 - d1 * d6;
          if (vb <= 0 && d2 >= 0 && d6 <= 0) { u = 0; w = d2 / (d2 - d6); }
          else {
            const va = d3 * d6 - d5 * d4;
            if (va <= 0 && d4 - d3 >= 0 && d5 - d6 >= 0) { w = (d4 - d3) / (d4 - d3 + (d5 - d6)); u = 1 - w; }
            else { const den = 1 / (va + vb + vc); u = vb * den; w = vc * den; }
          }
        }
      }
    }
  }
  const dx = apx - u * abx - w * acx, dy = apy - u * aby - w * acy, dz = apz - u * abz - w * acz;
  return dx * dx + dy * dy + dz * dz;
}

// Predznačena razdalja središč vokslov do ploskve trikotnikov, odrezana pri ±PAS, zapisana kot 0,5 + d / (2 · PAS).
// Predznak iz deleža voksla (16 žarkov z navitjem): en sam žarek skozi središče ob zgrešenem zadetku na robu trikotnika
// obrne predznak vsej vrstici (črta lukenj v pokrovu).
export function razdaljaStene(tri, mreza, delez = delezStene(tri, mreza).delez) {
  const { lo, korak, n } = mreza;
  const C = PAS * 1.001; // celica razpršilne mreže ≥ PAS: dovolj je 27 sosednjih celic
  const m = n.map((x) => Math.ceil((x * korak) / C) + 1);
  const celice = new Map();
  for (let t = 0; t < tri.length; t += 9) {
    const od = [0, 0, 0], dok = [0, 0, 0];
    for (let c = 0; c < 3; c++) {
      od[c] = Math.max(0, Math.floor((Math.min(tri[t + c], tri[t + 3 + c], tri[t + 6 + c]) - lo[c]) / C));
      dok[c] = Math.min(m[c] - 1, Math.floor((Math.max(tri[t + c], tri[t + 3 + c], tri[t + 6 + c]) - lo[c]) / C));
    }
    for (let z = od[2]; z <= dok[2]; z++) for (let y = od[1]; y <= dok[1]; y++) for (let x = od[0]; x <= dok[0]; x++) {
      const k = (z * m[1] + y) * m[0] + x;
      let s = celice.get(k);
      if (!s) celice.set(k, (s = []));
      s.push(t);
    }
  }
  const out = new Float32Array(n[0] * n[1] * n[2]);
  const P2 = PAS * PAS;
  for (let k = 0; k < n[2]; k++) for (let j = 0; j < n[1]; j++) for (let i = 0; i < n[0]; i++) {
    const px = lo[0] + (i + 0.5) * korak, py = lo[1] + (j + 0.5) * korak, pz = lo[2] + (k + 0.5) * korak;
    const cx = Math.floor((px - lo[0]) / C), cy = Math.floor((py - lo[1]) / C), cz = Math.floor((pz - lo[2]) / C);
    let d2 = P2;
    for (let z = cz - 1; z <= cz + 1; z++) for (let y = cy - 1; y <= cy + 1; y++) for (let x = cx - 1; x <= cx + 1; x++) {
      if (x < 0 || y < 0 || z < 0 || x >= m[0] || y >= m[1] || z >= m[2]) continue;
      const s = celice.get((z * m[1] + y) * m[0] + x);
      if (s) for (const t of s) { const d = razdalja2(px, py, pz, tri, t); if (d < d2) d2 = d; }
    }
    const q = (k * n[1] + j) * n[0] + i;
    // 64 stopenj (korak 0,06 mm) namesto 256: slika je za četrtino manjša, rob ostane gladek; stopnje ne prečkajo praga
    // 0,5 (127 → 126, 128 → 130)
    const b = Math.round(255 * Math.min(1, Math.max(0, 0.5 + ((delez[q] > 0.5 ? 1 : -1) * Math.sqrt(d2)) / (2 * PAS))));
    out[q] = (b > 0 && b < 255 ? (b >> 2) * 4 + 2 : b) / 255;
  }
  return out;
}

// Rezine z enim vokslom roba (kot <organ>-volumen.png): slika ploscice[0] × ploscice[1] ploščic velikosti (nx + 2) × (ny + 2).
// kanali: [delež R, delež G] (Float32Array ali null).
export function rezine(kanali, n) {
  const px = Math.ceil(Math.sqrt(n[2]));
  const py = Math.ceil(n[2] / px);
  const tw = n[0] + 2, th = n[1] + 2;
  const slika = new Uint8Array(px * tw * py * th * 3);
  for (let z = 0; z < n[2]; z++) {
    const ox = (z % px) * tw, oy = Math.floor(z / px) * th;
    for (let y = 0; y < th; y++) for (let x = 0; x < tw; x++) {
      const vx = Math.min(n[0] - 1, Math.max(0, x - 1)), vy = Math.min(n[1] - 1, Math.max(0, y - 1));
      for (let c = 0; c < kanali.length; c++) if (kanali[c]) slika[((oy + y) * px * tw + ox + x) * 3 + c] = Math.round(255 * Math.min(1, kanali[c][(z * n[1] + vy) * n[0] + vx]));
    }
  }
  return { slika, w: px * tw, h: py * th, ploscice: [px, py] };
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
    // R: predznačena razdalja (gladek rob pokrova). G in B ostaneta delež: tanka žila, ki teče v ravnini reza, z deležem
    // redko preseže 0,5 in jo pokrov stene prekrije; z razdaljo bi se v pokrovu odprla po vsej dolžini
    const s = rezine([razdaljaStene(tri, mreza, r.delez), triDrugo.length ? delezStene(triDrugo, mreza).delez : null, triB.length ? delezStene(triB, mreza).delez : null], mreza.n);
    fs.writeFileSync(path.join(MAPA, meta[kljuc]), pngRGB(s.w, s.h, s.slika));
    mreza.ploscice = s.ploscice;
    let polnih = 0;
    for (const v of r.delez) if (v > 0.5) polnih++;
    console.log(`${meta[kljuc]}: ${s.w} × ${s.h} px, ${(fs.statSync(path.join(MAPA, meta[kljuc])).size / 1024).toFixed(0)} kB; trikotnikov ${tri.length / 9}, zadetkov ${r.zadetkov}, negativno navitje ${r.negativnih}, tkivo ${(polnih * korak ** 3 * 1e6).toFixed(0)} cm³`);
  }
  j.prerez.volumen.stena = { ...meta, lo: mreza.lo, korak, n: mreza.n, ploscice: mreza.ploscice };
  fs.writeFileSync(pot, JSON.stringify(j, null, 1) + "\n");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await glavni();

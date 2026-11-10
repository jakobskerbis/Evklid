// »Pravi prerez«: pomožne funkcije brez DOM in brez three (test/3d-rezine.test.js jih kliče v Node).
// Podatke pripravi scripts/atlas/rezine.py (meta.json, mali.webp, a|k|s/<i>.webp, p/…) in rezine_oznake.py (oznake.bin).
// Osi volumna: x od desne proti levi strani telesa, y od spredaj nazaj, z od glave proti nogam; enota mm.
// Smeri: a = prečno (ravnina z), k = frontalno (ravnina y), s = sagitalno (ravnina x).
export const SMERI = ["a", "k", "s"];

// Velikost slike rezine [stolpci, vrstice] v vokslih volumna dim = [W, H, Z].
export function velikostRezine(dim, smer) {
  const [W, H, Z] = dim;
  return smer === "a" ? [W, H] : smer === "k" ? [W, Z] : [H, Z];
}
export const steviloRezin = (dim, smer) => (smer === "a" ? dim[2] : smer === "k" ? dim[1] : dim[0]);

// Točka slike (stolpec u, vrstica v, oba 0–1) na rezini i → [x, y, z] v mm.
export function tockaRezine(dim, smer, i, u, v) {
  const [W, H, Z] = dim;
  if (smer === "a") return [u * W, v * H, i + 0.5];
  if (smer === "k") return [u * W, i + 0.5, v * Z];
  return [i + 0.5, u * H, v * Z];
}

// List prečnih rezin malega volumna (RGBA iz canvasa, širina lista sw) → { dim, mm, data } (z, y, x, RGBA).
export function maliIzLista(rgba, sw, mali) {
  const [W, H, Z] = mali.dim;
  const data = new Uint8Array(W * H * Z * 4);
  for (let z = 0; z < Z; z++) {
    const ox = (z % mali.stolpcev) * W, oy = Math.floor(z / mali.stolpcev) * H;
    for (let y = 0; y < H; y++) {
      const s = ((oy + y) * sw + ox) * 4;
      data.set(rgba.subarray(s, s + W * 4), (z * H + y) * W * 4);
    }
  }
  return { dim: [W, H, Z], mm: mali.mm, data };
}

// Rezina malega volumna kot slika RGBA (takoj, brez omrežja): i je indeks v vokslih malega volumna.
export function rezinaMalega(m, smer, i) {
  const [W, H, Z] = m.dim;
  const [w, h] = velikostRezine(m.dim, smer);
  const out = new Uint8ClampedArray(w * h * 4);
  i = Math.max(0, Math.min(steviloRezin(m.dim, smer) - 1, i | 0));
  if (smer === "a") out.set(m.data.subarray(i * H * W * 4, (i + 1) * H * W * 4));
  else if (smer === "k") for (let z = 0; z < Z; z++) out.set(m.data.subarray(((z * H + i) * W) * 4, ((z * H + i) * W + W) * 4), z * W * 4);
  else
    for (let z = 0; z < Z; z++)
      for (let y = 0; y < H; y++) {
        const s = ((z * H + y) * W + i) * 4, d = (z * H + y) * 4;
        out[d] = m.data[s]; out[d + 1] = m.data[s + 1]; out[d + 2] = m.data[s + 2]; out[d + 3] = m.data[s + 3];
      }
  return { w, h, data: out };
}

// Luknje znotraj telesa v rezini (temna kri ali zrak, ki ju je maska štela za ozadje) postanejo neprosojne: sicer se skozi
// njih vidi ozadje odra (»modra pika« v srcu). Ozadje, povezano z robom slike, ostane prosojno. Spremeni r na mestu.
export function zapolniLuknje(r, prag = 40) {
  const { w, h, data } = r, n = w * h;
  const zunaj = new Uint8Array(n), vrsta = new Int32Array(n);
  let g = 0, k = 0;
  const dodaj = (i) => { if (!zunaj[i] && data[i * 4 + 3] <= prag) { zunaj[i] = 1; vrsta[k++] = i; } };
  for (let x = 0; x < w; x++) { dodaj(x); dodaj((h - 1) * w + x); }
  for (let y = 0; y < h; y++) { dodaj(y * w); dodaj(y * w + w - 1); }
  while (g < k) {
    const i = vrsta[g++], x = i % w;
    if (x > 0) dodaj(i - 1); if (x < w - 1) dodaj(i + 1); if (i >= w) dodaj(i - w); if (i < n - w) dodaj(i + w);
  }
  for (let i = 0; i < n; i++) if (!zunaj[i] && data[i * 4 + 3] < 255) {
    const a = data[i * 4 + 3] / 255;
    // pobarvaj s temno barvo krvi namesto ozadja (premultiplicirano s staro alfo)
    data[i * 4] = data[i * 4] * a + 24 * (1 - a); data[i * 4 + 1] = data[i * 4 + 1] * a + 10 * (1 - a); data[i * 4 + 2] = data[i * 4 + 2] * a + 8 * (1 - a);
    data[i * 4 + 3] = 255;
  }
  return r;
}

// oznake.bin: pari uint16 (dolžina, oznaka), mali endian → Uint8Array(n) (z, y, x).
export function razpakirajOznake(buf, n) {
  const dv = new DataView(buf instanceof ArrayBuffer ? buf : buf.buffer, buf.byteOffset || 0, buf.byteLength);
  const out = new Uint8Array(n); // oznak je manj kot 256: pol manj pomnilnika kot Uint16 (telefon)
  let p = 0;
  for (let o = 0; o + 3 < dv.byteLength && p < n; o += 4) {
    const d = dv.getUint16(o, true), v = dv.getUint16(o + 2, true);
    if (v) out.fill(v, p, Math.min(n, p + d));
    p += d;
  }
  return out;
}

// Oznaka (0 = brez) v točki [x, y, z] mm; o = { dim, mm, data }.
export function oznakaV(o, x, y, z) {
  const [W, H, Z] = o.dim;
  const i = Math.floor(x / o.mm), j = Math.floor(y / o.mm), k = Math.floor(z / o.mm);
  if (i < 0 || j < 0 || k < 0 || i >= W || j >= H || k >= Z) return 0;
  return o.data[(k * H + j) * W + i];
}

// Rezina mreže oznak: { w, h, data: Uint8Array } za rezino i (mm) v dani smeri.
export function rezinaOznak(o, smer, iMm) {
  const [W, H, Z] = o.dim;
  const [w, h] = velikostRezine(o.dim, smer);
  const i = Math.max(0, Math.min(steviloRezin(o.dim, smer) - 1, Math.floor(iMm / o.mm)));
  const data = new Uint8Array(w * h);
  if (smer === "a") data.set(o.data.subarray(i * H * W, (i + 1) * H * W));
  else if (smer === "k") for (let z = 0; z < Z; z++) data.set(o.data.subarray((z * H + i) * W, (z * H + i) * W + W), z * W);
  else for (let z = 0; z < Z; z++) for (let y = 0; y < H; y++) data[z * H + y] = o.data[(z * H + y) * W + i];
  return { w, h, data };
}

// Strukture na rezini, po površini padajoče: [[oznaka, število celic], …] (vsaj `najmanj` celic).
export function struktureRezine(r, najmanj = 4) {
  const st = new Map();
  for (const v of r.data) if (v) st.set(v, (st.get(v) || 0) + 1);
  return [...st].filter(([, n]) => n >= najmanj).sort((a, b) => b[1] - a[1]);
}

// Okvir vsebine rezine malega volumna (alfa > 0): { u0, v0, u1, v1 } v deležih slike ali null, če je prazna.
export function okvirVsebine(r) {
  let x0 = r.w, y0 = r.h, x1 = -1, y1 = -1;
  for (let y = 0; y < r.h; y++)
    for (let x = 0; x < r.w; x++)
      if (r.data[(y * r.w + x) * 4 + 3] > 40) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
  return x1 < 0 ? null : { u0: x0 / r.w, v0: y0 / r.h, u1: (x1 + 1) / r.w, v1: (y1 + 1) / r.h };
}

// Polje telesa za površje (0–255 na voksel malega volumna): alfa, v kateri so zaprte tanke reže v koži (zapiranje za en
// voksel) in zapolnjene votline, ki jih zrak v črevesu ali pljučih pusti v maski (zalivanje od zunaj). Brez tega je imelo
// telo okoli rezine luknje, skozi katere se je videlo črevo.
export function poljeTelesa(m, prag = 0.3) {
  const [W, H, Z] = m.dim, n = W * H * Z, d = m.data, P = Math.round(prag * 255);
  const notri = new Uint8Array(n);
  for (let k = 0; k < n; k++) notri[k] = d[k * 4 + 3] > P ? 1 : 0;
  const sosedje = (k, x, y, z, fn) => {
    if (x > 0) fn(k - 1); if (x < W - 1) fn(k + 1);
    if (y > 0) fn(k - W); if (y < H - 1) fn(k + W);
    if (z > 0) fn(k - W * H); if (z < Z - 1) fn(k + W * H);
  };
  // zapiranje: razširi za en voksel (6 sosedov), nato skrči
  const raz = notri.slice();
  for (let z = 0, k = 0; z < Z; z++) for (let y = 0; y < H; y++) for (let x = 0; x < W; x++, k++) if (notri[k]) sosedje(k, x, y, z, (j) => (raz[j] = 1));
  const zap = raz.slice();
  for (let z = 0, k = 0; z < Z; z++) for (let y = 0; y < H; y++) for (let x = 0; x < W; x++, k++) {
    if (!raz[k]) continue;
    if (x === 0 || y === 0 || z === 0 || x === W - 1 || y === H - 1 || z === Z - 1) { zap[k] = notri[k]; continue; }
    if (!raz[k - 1] || !raz[k + 1] || !raz[k - W] || !raz[k + W] || !raz[k - W * H] || !raz[k + W * H]) zap[k] = notri[k];
  }
  // zalivanje: ozadje, povezano z robom volumna, je zunaj; vse drugo je telo
  const zunaj = new Uint8Array(n), vrsta = new Int32Array(n);
  let g = 0, r = 0;
  const dodaj = (k) => { if (!zap[k] && !zunaj[k]) { zunaj[k] = 1; vrsta[r++] = k; } };
  for (let z = 0; z < Z; z++) for (let y = 0; y < H; y++) for (let x = 0; x < W; x++)
    if (x === 0 || y === 0 || z === 0 || x === W - 1 || y === H - 1 || z === Z - 1) dodaj((z * H + y) * W + x);
  while (g < r) {
    const k = vrsta[g++], x = k % W, y = ((k / W) | 0) % H, z = (k / (W * H)) | 0;
    sosedje(k, x, y, z, dodaj);
  }
  const out = new Uint8Array(n);
  for (let k = 0; k < n; k++) out[k] = zunaj[k] ? Math.min(d[k * 4 + 3], P) : Math.max(d[k * 4 + 3], 160); // telo je vedno nad pragom 0,5
  return out;
}

// Površje telesa iz polja telesa (naivne »surface nets«): { pos, col, idx } v mm; korak 2 = pol manj podrobno.
export function povrsje(m, korak = 1, gladi = 8) {
  const [W0, H0, Z0] = m.dim, d = m.data, mm = m.mm * korak;
  const W = Math.ceil(W0 / korak), H = Math.ceil(H0 / korak), Z = Math.ceil(Z0 / korak);
  const polje = poljeTelesa(m);
  const ix = (x, y, z) => ((Math.min(z * korak, Z0 - 1) * H0 + Math.min(y * korak, H0 - 1)) * W0 + Math.min(x * korak, W0 - 1)) * 4;
  const f = (x, y, z) => (x < 0 || y < 0 || z < 0 || x >= W || y >= H || z >= Z ? -0.5 : polje[ix(x, y, z) / 4] / 255 - 0.5);
  const nx = W + 1, ny = H + 1, nz = Z + 1;
  const id = new Int32Array(nx * ny * nz).fill(-1);
  const pos = [], col = [], idx = [];
  const v = new Float32Array(8);
  const ROB = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
  for (let cz = 0; cz < nz; cz++)
    for (let cy = 0; cy < ny; cy++)
      for (let cx = 0; cx < nx; cx++) {
        let maska = 0;
        for (let k = 0; k < 8; k++) {
          v[k] = f(cx - 1 + (k & 1), cy - 1 + ((k >> 1) & 1), cz - 1 + (k >> 2));
          if (v[k] > 0) maska |= 1 << k;
        }
        if (maska === 0 || maska === 255) continue;
        let sx = 0, sy = 0, sz = 0, n = 0;
        for (const [a, b] of ROB) {
          if ((v[a] > 0) === (v[b] > 0)) continue;
          const t = v[a] / (v[a] - v[b]);
          sx += (a & 1) + t * ((b & 1) - (a & 1)); sy += ((a >> 1) & 1) + t * (((b >> 1) & 1) - ((a >> 1) & 1)); sz += (a >> 2) + t * ((b >> 2) - (a >> 2)); n++;
        }
        let r = 0, g = 0, bl = 0, c = 0;
        for (let k = 0; k < 8; k++)
          if (v[k] > 0) {
            const s = ix(cx - 1 + (k & 1), cy - 1 + ((k >> 1) & 1), cz - 1 + (k >> 2));
            if (d[s + 3] < 64) continue; // zapolnjena votlina nima barve kože
            r += d[s]; g += d[s + 1]; bl += d[s + 2]; c++;
          }
        if (!c) { r = 214; g = 186; bl = 150; c = 1; } // barva kože, če so v celici samo zapolnjeni voksli
        id[(cz * ny + cy) * nx + cx] = pos.length / 3;
        // oglišče celice (cx−1 … cx) v mm: središče voksla x je (x + 0,5) · mm
        pos.push((cx - 1 + sx / n + 0.5) * mm, (cy - 1 + sy / n + 0.5) * mm, (cz - 1 + sz / n + 0.5) * mm);
        col.push(r / c / 255, g / c / 255, bl / c / 255);
        // ploskve: robovi iz vogala 7 celice nazaj po vsaki osi (sosednje celice z manjšim indeksom že obstajajo)
        const os = [[1, nx, nx * ny], [nx, nx * ny, 1], [nx * ny, 1, nx]];
        const tu = (cz * ny + cy) * nx + cx;
        const cc = [cx, cy, cz];
        for (let a = 0; a < 3; a++) {
          const b = (a + 1) % 3, e = (a + 2) % 3;
          if (cc[b] === 0 || cc[e] === 0) continue;
          const k0 = 0, k1 = 1 << a; // rob vzdolž osi a iz vogala 0
          if ((v[k0] > 0) === (v[k1] > 0)) continue;
          const p0 = id[tu], p1 = id[tu - os[b][0]], p2 = id[tu - os[b][0] - os[e][0]], p3 = id[tu - os[e][0]];
          if (p0 < 0 || p1 < 0 || p2 < 0 || p3 < 0) continue;
          if (v[k0] > 0) idx.push(p0, p1, p2, p0, p2, p3);
          else idx.push(p0, p2, p1, p0, p3, p2);
        }
      }
  const P = new Float32Array(pos), I = new Uint32Array(idx);
  // glajenje (stopničasto površje iz vokslov): vsako oglišče proti povprečju sosedov, izmenično z odmikom nazaj (Taubin),
  // da se telo ne skrči
  const n = P.length / 3;
  for (let krog = 0; krog < gladi * 2; krog++) {
    const vs = new Float32Array(P.length), st = new Uint16Array(n);
    for (let i = 0; i < I.length; i += 3)
      for (let k = 0; k < 3; k++) {
        const a = I[i + k], b = I[i + ((k + 1) % 3)];
        vs[a * 3] += P[b * 3]; vs[a * 3 + 1] += P[b * 3 + 1]; vs[a * 3 + 2] += P[b * 3 + 2]; st[a]++;
      }
    const l = krog % 2 ? -0.53 : 0.5;
    for (let a = 0; a < n; a++) {
      if (!st[a]) continue;
      for (let k = 0; k < 3; k++) P[a * 3 + k] += l * (vs[a * 3 + k] / st[a] - P[a * 3 + k]);
    }
  }
  // barva: koža v vokslih 4 mm je mešanica kože, maščobe in ledu → zgladimo jo in približamo povprečnemu tonu,
  // da površje ni lisasto (prava barva tkiva je na rezini, ne na telesu)
  const C = new Float32Array(col);
  for (let krog = 0; krog < 6; krog++) {
    const vs = new Float32Array(C.length), st = new Uint16Array(n);
    for (let i = 0; i < I.length; i += 3)
      for (let k = 0; k < 3; k++) {
        const a = I[i + k], b = I[i + ((k + 1) % 3)];
        vs[a * 3] += C[b * 3]; vs[a * 3 + 1] += C[b * 3 + 1]; vs[a * 3 + 2] += C[b * 3 + 2]; st[a]++;
      }
    for (let a = 0; a < n; a++) if (st[a]) for (let k = 0; k < 3; k++) C[a * 3 + k] = 0.5 * C[a * 3 + k] + 0.5 * (vs[a * 3 + k] / st[a]);
  }
  const sr = [0, 0, 0];
  for (let a = 0; a < n; a++) for (let k = 0; k < 3; k++) sr[k] += C[a * 3 + k] / Math.max(n, 1);
  for (let a = 0; a < n; a++) for (let k = 0; k < 3; k++) C[a * 3 + k] = 0.45 * C[a * 3 + k] + 0.55 * sr[k];
  return { pos: P, col: C, idx: I };
}

// Ploščice podrobne ravni, ki pokrivajo sliko rezine: [{ ime, u0, v0, u1, v1 }] (u, v 0–1 v sliki rezine).
// p = meta.podrobno, dim = meta.dim (mm), i = indeks rezine v mm.
export function ploscice(p, dim, smer, i) {
  if (!p || !p.ravnine.includes(smer)) return [];
  const T = p.ploscica, [Wp, Hp, N] = p.dim_px;
  const out = [];
  const sir = smer === "s" ? Hp : Wp, vis = smer === "a" ? Hp : N;
  for (let ty = 0; ty * T < vis; ty++)
    for (let tx = 0; tx * T < sir; tx++)
      out.push({ ime: `${i}_${ty}_${tx}`, u0: (tx * T) / sir, v0: (ty * T) / vis, u1: ((tx + 1) * T) / sir, v1: ((ty + 1) * T) / vis });
  return out;
}

// Središče oznake id v mreži oznak (mm), po želji le voksli z x (mm), za katere je izberi(x) res; null, če je ni.
export function sredisce(o, id, izberi = null) {
  if (!id) return null;
  const [W, H] = o.dim, d = o.data;
  let sx = 0, sy = 0, sz = 0, n = 0;
  for (let k = 0; k < d.length; k++) {
    if (d[k] !== id) continue;
    const x = ((k % W) + 0.5) * o.mm;
    if (izberi && !izberi(x)) continue;
    sx += x; sy += ((((k / W) | 0) % H) + 0.5) * o.mm; sz += (((k / (W * H)) | 0) + 0.5) * o.mm; n++;
  }
  return n ? [sx / n, sy / n, sz / n] : null;
}

// Točka [x, y, z] mm → [u, v] (0–1) v sliki rezine dane smeri.
export function uvTocke(dim, smer, [x, y, z]) {
  const [W, H, Z] = dim;
  return smer === "a" ? [x / W, y / H] : smer === "k" ? [x / W, z / Z] : [y / H, z / Z];
}

// Gladek obris strukture na rezini mreže oznak r = { w, h, data } (je[oznaka] = 1 za izbrano strukturo): brez otočkov
// (deli, manjši od 10 % največjega, razen tistega, ki se ga je učenec dotaknil), povečan f-krat z bilinearno
// interpolacijo in pragom, zato rob nima stopnic mreže 2 mm. → { w, h, data: Uint8Array (0 zunaj, 1 notri, 2 rob) } ali null.
export function gladekObris(r, je, f = 4, tap = null) {
  const { w, h, data } = r, n = w * h;
  const M = new Int32Array(n).fill(-1); // -1 = ni strukture, sicer številka dela
  const velikost = [];
  const sklad = new Int32Array(n);
  for (let k = 0; k < n; k++) {
    if (!je[data[k]] || M[k] >= 0) continue;
    const id = velikost.length;
    let sp = 0, st = 0;
    sklad[sp++] = k; M[k] = id;
    while (sp) {
      const q = sklad[--sp], x = q % w;
      st++;
      for (const j of [x > 0 ? q - 1 : -1, x < w - 1 ? q + 1 : -1, q >= w ? q - w : -1, q < n - w ? q + w : -1])
        if (j >= 0 && M[j] < 0 && je[data[j]]) { M[j] = id; sklad[sp++] = j; }
    }
    velikost.push(st);
  }
  if (!velikost.length) return null;
  const naj = Math.max(...velikost);
  let tapId = -1;
  if (tap) {
    const tx = Math.min(w - 1, Math.max(0, Math.floor(tap[0] * w))), ty = Math.min(h - 1, Math.max(0, Math.floor(tap[1] * h)));
    tapId = M[ty * w + tx];
  }
  const obdrzi = velikost.map((v, id) => id === tapId || v >= Math.max(3, naj * 0.1));
  // rahlo glajenje maske (središče 1/2, štirje sosedje po 1/8), da tanke stene (srčna mišica) ostanejo
  const B = new Float32Array(n);
  const m = (x, y) => (x < 0 || y < 0 || x >= w || y >= h ? 0 : M[y * w + x] >= 0 && obdrzi[M[y * w + x]] ? 1 : 0);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) B[y * w + x] = 0.5 * m(x, y) + 0.125 * (m(x - 1, y) + m(x + 1, y) + m(x, y - 1) + m(x, y + 1));
  const W2 = w * f, H2 = h * f, out = new Uint8Array(W2 * H2);
  const b = (x, y) => (x < 0 || y < 0 || x >= w || y >= h ? 0 : B[y * w + x]);
  let ima = false;
  for (let Y = 0; Y < H2; Y++) {
    const fy = (Y + 0.5) / f - 0.5, y0 = Math.floor(fy), ty = fy - y0;
    for (let X = 0; X < W2; X++) {
      const fx = (X + 0.5) / f - 0.5, x0 = Math.floor(fx), tx = fx - x0;
      const v = (b(x0, y0) * (1 - tx) + b(x0 + 1, y0) * tx) * (1 - ty) + (b(x0, y0 + 1) * (1 - tx) + b(x0 + 1, y0 + 1) * tx) * ty;
      if (v > 0.4) { out[Y * W2 + X] = 1; ima = true; }
    }
  }
  if (!ima) return null;
  // rob: notranja točka z zunanjim sosedom (do 2 px daleč pri f ≥ 3, da je črta vidna)
  const rob = f >= 3 ? 2 : 1;
  const o2 = out.slice();
  for (let Y = 0; Y < H2; Y++) for (let X = 0; X < W2; X++) {
    const k = Y * W2 + X;
    if (!out[k]) continue;
    let r2 = false;
    for (let d = 1; d <= rob && !r2; d++)
      r2 = X < d || Y < d || X >= W2 - d || Y >= H2 - d || !out[k - d] || !out[k + d] || !out[k - d * W2] || !out[k + d * W2];
    if (r2) o2[k] = 2;
  }
  return { w: W2, h: H2, data: o2 };
}

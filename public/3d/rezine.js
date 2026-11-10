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
  // reže, ki jih je zaprlo samo zapiranje in ne vodijo v votlino (med dlanjo in stegnom, med prsti), so spet zunaj:
  // del brez telesa znotraj zaprtega telesa, ki ga sestavljajo samo z zapiranjem dodani voksli, je reža ob koži
  // (ocena A, krog 5: dlani zlite s stegni); del z vsaj enim vokslom prave votline (zrak v pljučih) ostane zaprt
  const del = new Int32Array(n).fill(-1);
  for (let k0 = 0; k0 < n; k0++) {
    if (zunaj[k0] || notri[k0] || del[k0] >= 0) continue;
    let g2 = 0, r2 = 0, votlina = false, obZunaj = false;
    del[k0] = k0; vrsta[r2++] = k0;
    while (g2 < r2) {
      const k = vrsta[g2++], x = k % W, y = ((k / W) | 0) % H, z = (k / (W * H)) | 0;
      if (!zap[k]) votlina = true;
      sosedje(k, x, y, z, (j) => {
        if (zunaj[j]) obZunaj = true;
        else if (!notri[j] && del[j] < 0) { del[j] = k0; vrsta[r2++] = j; }
      });
    }
    if (!votlina && obZunaj) for (let q = 0; q < r2; q++) zunaj[vrsta[q]] = 1;
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
// opts.celica = velikost celice mreže v mm (privzeto 2): luknje, ožje od 5 mm, se zapolnijo (ocena A, krog 5: krožec žile brez
// vidne žile); opts.tkivo(X, Y) → false za piksel povečane slike, ki je na fotografiji maščoba: tak piksel ob robu
// (do 4 px) ni del obrisa (desni preddvor ne sega v maščobo okoli srca).
export function gladekObris(r, je, f = 4, tap = null, opts = {}) {
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
  // veliki organi (jetra, pljuča): še en prehod glajenja, da rob ob žilah in vratih ni resast
  if (naj > 300) {
    const C = B.slice(), c = (x, y) => (x < 0 || y < 0 || x >= w || y >= h ? 0 : C[y * w + x]);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) B[y * w + x] = 0.5 * c(x, y) + 0.125 * (c(x - 1, y) + c(x + 1, y) + c(x, y - 1) + c(x, y + 1));
  }
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
  // drobne luknje (do 2,5 celice mreže: ostanek praga na poševnih vrzelih ali 2 mm žilica, ki se ne bere kot žila) zapolnimo
  // (ocena A, krog 4: 2 px luknji v levem prekatu in jetrih)
  const celica = opts.celica > 0 ? opts.celica : 2;
  zapolniDrobne(out, W2, H2, Math.max(Math.round(2.5 * f * f), Math.round(Math.PI * (2.5 / celica) ** 2 * f * f))); // ostanki povečave, ožji od 5 mm
  // veliki organi: še glajenje v povečani sliki (dvakratno okno 2f+1, prag 1/2), ki odstrani zobce mreže ob vratih in
  // žilah (resast notranji rob jeter), ne da bi organ skrčilo; zapiranje (razširi in skrči za 2,5 mm) zapre ozke zareze
  // ob vratih jeter (ocena A, krog 5), široke vdolbine (prava vrata, žolčnik) ostanejo
  if (naj > 300) {
    zapri(out, W2, H2, Math.max(2, Math.round((2.5 / celica) * f)));
    for (let p = 0; p < 2; p++) gladiMasko(out, W2, H2, f);
  }
  if (typeof opts.tkivo === "function") {
    const d = razdaljaDoRoba(out, W2, H2);
    for (let Y = 0; Y < H2; Y++) for (let X = 0; X < W2; X++) {
      const k = Y * W2 + X;
      if (out[k] && d[k] <= 4 && !opts.tkivo(X, Y)) out[k] = 0;
    }
    gladiMasko(out, W2, H2, 1);
    if (!out.some(Boolean)) return null;
  }
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

// Zapolni zaprte luknje (0, 4-sosednost, ne dotikajo se roba) do `najvec` celic v maski m (w × h), na mestu.
function zapolniDrobne(m, w, h, najvec) {
  const n = w * h, vid = new Uint8Array(n), sklad = new Int32Array(n), clani = [];
  for (let k = 0; k < n; k++) {
    if (m[k] || vid[k]) continue;
    let sp = 0, odprta = false;
    clani.length = 0;
    sklad[sp++] = k; vid[k] = 1;
    while (sp) {
      const q = sklad[--sp], x = q % w;
      if (clani.length <= najvec) clani.push(q);
      if (x === 0 || x === w - 1 || q < w || q >= n - w) odprta = true;
      for (const j of [x > 0 ? q - 1 : -1, x < w - 1 ? q + 1 : -1, q >= w ? q - w : -1, q < n - w ? q + w : -1])
        if (j >= 0 && !m[j] && !vid[j]) { vid[j] = 1; sklad[sp++] = j; }
    }
    if (!odprta && clani.length <= najvec) for (const q of clani) m[q] = 1;
  }
}

// Glajenje binarne maske m (w × h) na mestu: ločljivo povprečje v oknu 2r+1, nato prag 1/2.
function gladiMasko(m, w, h, r) {
  const a = new Float32Array(w * h), b = new Float32Array(w * h), d = 2 * r + 1;
  for (let y = 0; y < h; y++) {
    let s = 0;
    for (let x = -r; x <= r; x++) s += x >= 0 && x < w ? m[y * w + x] : 0;
    for (let x = 0; x < w; x++) {
      a[y * w + x] = s / d;
      const iz = x - r, v = x + r + 1;
      if (iz >= 0) s -= m[y * w + iz];
      if (v < w) s += m[y * w + v];
    }
  }
  for (let x = 0; x < w; x++) {
    let s = 0;
    for (let y = -r; y <= r; y++) s += y >= 0 && y < h ? a[y * w + x] : 0;
    for (let y = 0; y < h; y++) {
      b[y * w + x] = s / d;
      const iz = y - r, v = y + r + 1;
      if (iz >= 0) s -= a[iz * w + x];
      if (v < h) s += a[v * w + x];
    }
  }
  for (let k = 0; k < w * h; k++) m[k] = b[k] >= 0.5 ? 1 : 0;
}

// Razdalja (v pikslih, šahovnica 3-4 / 3) vsakega piksla maske do najbližjega piksla zunaj nje; zunaj 0.
function razdaljaDoRoba(m, w, h, notri = true) {
  const n = w * h, d = new Float32Array(n), INF = 1e9;
  for (let k = 0; k < n; k++) d[k] = (notri ? m[k] : !m[k]) ? INF : 0;
  const pr = (k, j, c) => { if (d[j] + c < d[k]) d[k] = d[j] + c; };
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const k = y * w + x;
    if (!d[k]) continue;
    if (notri && (x === 0 || y === 0 || x === w - 1 || y === h - 1)) d[k] = Math.min(d[k], 3); // rob slike je zunaj
    if (x > 0) pr(k, k - 1, 3);
    if (y > 0) { pr(k, k - w, 3); if (x > 0) pr(k, k - w - 1, 4); if (x < w - 1) pr(k, k - w + 1, 4); }
  }
  for (let y = h - 1; y >= 0; y--) for (let x = w - 1; x >= 0; x--) {
    const k = y * w + x;
    if (!d[k]) continue;
    if (x < w - 1) pr(k, k + 1, 3);
    if (y < h - 1) { pr(k, k + w, 3); if (x < w - 1) pr(k, k + w + 1, 4); if (x > 0) pr(k, k + w - 1, 4); }
  }
  for (let k = 0; k < n; k++) d[k] /= 3;
  return d;
}

// Morfološko zapiranje maske m (na mestu) s krogom polmera r px: zapolni ozke zareze in vrzeli, ne poveča organa.
function zapri(m, w, h, r) {
  const zunaj = razdaljaDoRoba(m, w, h, false); // razdalja praznih pikslov do maske
  const raz = new Uint8Array(w * h);
  for (let k = 0; k < w * h; k++) raz[k] = m[k] || zunaj[k] <= r ? 1 : 0;
  const notri = razdaljaDoRoba(raz, w, h, true);
  for (let k = 0; k < w * h; k++) if (!m[k] && notri[k] > r) m[k] = 1;
}

// Največja žila (v celicah mreže oznak s stranico celica mm), ki se na rezini zapolni: do ~6 mm (3 × 3 celice po 2 mm);
// po glajenju je tak krožec videti manjši od 5 mm in na fotografiji ga ni videti kot žilo (ocena A, krog 5).
export const ZILA_CELIC = (celica = 2) => Math.round((6 / celica) ** 2);

// Barva piksla fotografije je maščoba (svetlo rumena/bela), ne mišica, kri ali organ (temno rdeče do rjavo).
export const jeMascoba = (r, g, b) => g > 135 && r > 160 && r - b > 25;
// Strukture, katerih obris ne sme segati v maščobo ob njih (srce, organi trebuha).
export const BREZ_MASCOBE = new Set(["desni-preddvor", "levi-preddvor", "desni-prekat", "levi-prekat", "srce", "jetra", "vranica", "ledvica", "desna-ledvica", "leva-ledvica"]);

// Deli, ki so anatomsko znotraj strukture in je na rezini ne preluknjajo (papilarne mišice so del prekata).
export const NOTRANJI = { "levi-prekat": ["papilarne-misice"], "desni-prekat": ["papilarne-misice"], srce: ["papilarne-misice", "srcne-zaklopke", "medprekatni-pretin"] };

// Ključ shrambe za krajevno kazalo razvijalca (<slug>.* iz brand.json; scripts/preimenuj.js ga zamenja, test preveri).
export const KLJUC_KAZALA = "evklid.3d.rezine";

// Kazalo podatkov → telesa, ki res obstajajo: vsak meta.json se bere posebej, zato manjkajoče telo (npr. ženska, ki se
// še peče) ne podre drugih. → { osnova, spoli, mete } ali napaka, če ni nobenega. beriJson(url) → Promise<objekt>.
export async function telesaKazala(k, koren, beriJson) {
  const osnova = new URL(k.osnova || "./", koren).href;
  const sp = Object.keys(k.telesa || {}).filter((s) => /^[mz]$/.test(s));
  const r = await Promise.allSettled(sp.map((s) => beriJson(new URL(k.telesa[s], osnova).href + "meta.json")));
  const spoli = [], mete = [];
  r.forEach((x, j) => {
    if (x.status === "fulfilled" && x.value?.dim?.length === 3) { spoli.push(sp[j]); mete.push(x.value); }
  });
  if (!spoli.length) throw r.find((x) => x.status === "rejected")?.reason || new Error("kazalo brez teles");
  return { osnova, spoli, mete };
}

// Prvo telo, ki se res naloži: najprej `prvi`, nato druga telesa iz kazala (napaka podatkov enega telesa, npr. ženske, ki
// se še peče, ne pokaže takoj vzorca). nalozi(spol) → Promise. → { spol, neuspela: [spoli z napako] } ali zadnja napaka.
export async function prvoTelo(spoli, prvi, nalozi, obNapaki = () => {}) {
  const neuspela = [];
  let napaka = null;
  for (const s of [prvi, ...spoli.filter((x) => x !== prvi)]) {
    try {
      await nalozi(s);
      return { spol: s, neuspela };
    } catch (err) {
      neuspela.push(s);
      napaka = err;
      obNapaki(s, err);
    }
  }
  throw napaka || new Error("ni teles");
}

// Anatomska raven prečne rezine i (mm od vrha volumna): vretence, katerega sredina je najbližja (vretenca se po višini
// prekrivajo zaradi nagiba in odrastkov); ravni = meta.oznake.ravni [[z0, z1, "Th8"], …]; vrsta = "C" | "Th" | "L"
// omeji izbiro na eno vrsto. "" zunaj hrbtenice (±12 mm) ali brez podatkov.
export function ravenPri(ravni, i, vrsta = "") {
  if (!ravni?.length) return "";
  let naj = "", d = 1e9;
  for (const [z0, z1, ime] of ravni) {
    if (i < z0 - 12 || i > z1 + 12 || (vrsta && ime.replace(/\d+$/, "") !== vrsta)) continue;
    const dd = Math.abs(i - (z0 + z1) / 2);
    if (dd < d) { d = dd; naj = ime; }
  }
  return naj;
}

// Meje posameznega vretenca po višini (mm): od polovice do prejšnjega do polovice do naslednjega vretenca iste vrste
// (za starejše oznake, kjer imajo vsa prsna vretenca eno oznako). → [z0, z1] ali null.
export function mejeVretenca(ravni, ime) {
  const vrsta = ime.replace(/\d+$/, "");
  const ista = (ravni || []).filter((r) => r[2].replace(/\d+$/, "") === vrsta).map((r) => [(r[0] + r[1]) / 2, r]).sort((a, b) => a[0] - b[0]);
  const k = ista.findIndex(([, r]) => r[2] === ime);
  if (k < 0) return null;
  const c = ista[k][0];
  return [k ? (ista[k - 1][0] + c) / 2 : ista[k][1][0] - 4, k < ista.length - 1 ? (ista[k + 1][0] + c) / 2 : ista[k][1][1] + 4];
}

const VRSTE_VRETENC = { "vratno-vretence": "C", "prsno-vretence": "Th", "ledveno-vretence": "L" };
const RIM = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
// Oznaka posameznega vretenca: »prsno-vretence-th8« → { osnova: "prsno-vretence", raven: "Th8", rim: "VIII" }; tudi
// osnova + raven (starejše oznake: raven iz višine dotika). null, če ni vretence.
export function vretence(kl, raven = "") {
  const m = /^((?:vratno|prsno|ledveno)-vretence)(?:-(c|th|l)(\d{1,2}))?$/.exec(kl || "");
  if (!m) return null;
  const vrsta = VRSTE_VRETENC[m[1]];
  const st = m[2] ? Number(m[3]) : Number((/^(?:C|Th|L)(\d+)$/.exec(raven) || [])[1]);
  if (m[2] && vrsta.toLowerCase() !== m[2]) return null;
  return st >= 1 && st <= 12 ? { osnova: m[1], raven: `${vrsta}${st}`, rim: RIM[st] } : { osnova: m[1], raven: "", rim: "" };
}

// Ime, latinsko ime, opis in barva oznake iz rezine-oznake.json; posamezno vretence dobi raven (»Prsno vretence Th8«,
// »Vertebra thoracica VIII«). null, če oznake ni v preglednici.
export function opisOznake(tab, kl, raven = "") {
  const v = vretence(kl, raven);
  const o = tab.oznake[v ? v.osnova : kl];
  if (!o) return null;
  if (!v?.raven) return o;
  return { ...o, sl: `${o.sl} ${v.raven}`, la: `${o.la} ${v.rim}` };
}

// Lega rezine z besedilom: { smer, i, vzorec, ravni, os, n }; t(kljuc, privzeto), jezik za decimalno vejico; os = OŠ (samo
// predel telesa, n = število rezin v smeri). Na vzorcu
// (lega od temena ni znana) samo anatomska raven ali, če je ni, razdalja od vrha vzorca.
// OŠ: predel telesa namesto vretenca in milimetrov (ocena B, krog 4): smer a po vretencu (C vrat, Th1–Th10 prsni koš,
// Th11–L5 trebuh), zunaj hrbtenice po deležu višine telesa; k in s po deležu globine oz. širine. → ključ (»prsi«, …).
export function predelRezine({ smer, i, n, ravni, vzorec }) {
  const f = n > 0 ? i / n : 0.5;
  if (smer === "k") return f < 0.4 ? "spredaj" : f <= 0.6 ? "sredina" : "zadaj";
  if (smer === "s") return f < 0.4 ? "desno" : f <= 0.6 ? "sredina" : "levo";
  const rv = ravenPri(ravni, i);
  if (rv) return rv[0] === "C" ? "vrat" : rv[0] === "L" || Number(rv.slice(2)) >= 11 ? "trebuh" : "prsi";
  if (vzorec) return "prsi"; // vzorec je izrez prsnega koša
  const meje = [[0.12, "glava"], [0.165, "vrat"], [0.3, "prsi"], [0.45, "trebuh"], [0.53, "medenica"], [0.72, "stegna"], [0.78, "kolena"], [0.94, "goleni"]];
  return (meje.find(([m]) => f < m) || [0, "stopala"])[1];
}
export const PREDELI = { glava: "v višini glave", vrat: "v višini vratu", prsi: "v višini prsnega koša", trebuh: "v višini trebuha", medenica: "v višini medenice",
  stegna: "v višini stegen", kolena: "v višini kolen", goleni: "v višini goleni", stopala: "v višini stopal", spredaj: "spredaj",
  sredina: "skozi sredino telesa", zadaj: "zadaj", desno: "desno", levo: "levo" };
// smeri imajo že ključe oznak ob robu odra (proračun prvega odprtja: brez podvojenih besedil v sl.js)
const KLJUCI_PREDELOV = { spredaj: "a3.rez.front", zadaj: "a3.rez.back", desno: "a3.right", levo: "a3.left" };

export function besediloLege({ smer, i, vzorec, ravni, os = false, n = 0 }, t, jezik = "sl") {
  if (os) {
    const p = predelRezine({ smer, i, n, ravni, vzorec });
    return t(KLJUCI_PREDELOV[p] || `a3.rez.os.${p}`, PREDELI[p]);
  }
  const cm = (i / 10).toLocaleString(jezik, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const rv = smer === "a" ? ravenPri(ravni, i) : "";
  const vVisini = rv ? t("a3.rez.atLevel", "v višini {r}").replace("{r}", rv) : "";
  if (vzorec) return vVisini || `${cm} cm ${t("a3.rez.fromSampleTop", "od vrha izreza")}`;
  const od = smer === "a" ? `${cm} cm ${t("a3.rez.fromTop", "pod vrhom")}` : smer === "k" ? `${cm} cm ${t("a3.rez.fromFront", "od sprednje strani")}` : `${cm} cm ${t("a3.rez.fromRight", "od desne strani telesa")}`;
  return vVisini ? `${vVisini} · ${od}` : od;
}

// Zapolni majhne luknje znotraj izbrane strukture na rezini oznak (celice brez oznake, ki jih struktura povsem obdaja,
// do `najvec` celic): mreža oznak ima ob robu organov drobne vrzeli. Luknje z drugo oznako (žile v jetrih) ostanejo.
// Vrne nov je (Uint8Array dolžine w·h, 1 = del strukture) za gladekObris z je = [0, 1].
// notranje = Uint8Array(256) oznak, ki so del strukture (R.NOTRANJI, npr. papilarne mišice v prekatu): štejejo k njej.
// zile = največ celic luknje z drugo oznako (žila), ki se še zapolni: žila, ožja od ~5 mm, se na rezini ne bere kot
// žila (ocena A, krog 5: krožec »jetrne vene« brez vidne žile); večje žile ostanejo luknje.
export function zapolniObris(r, je, najvec = 40, notranje = null, zile = 0) {
  const { w, h, data } = r, n = w * h;
  const v = new Uint8Array(n);
  for (let k = 0; k < n; k++) if (je[data[k]]) v[k] = 1;
  const tuja = (d) => d && !notranje?.[d]; // celica druge strukture (žila)
  const vid = new Int32Array(n).fill(-1), sklad = new Int32Array(n);
  for (let k = 0; k < n; k++) {
    if (v[k] || vid[k] >= 0) continue;
    // ena luknja (4-sosednost); če se dotakne roba slike, ni luknja
    let sp = 0, st = 0, odprta = false, notri = false, zila = false;
    const clani = [];
    sklad[sp++] = k; vid[k] = k;
    while (sp) {
      const q = sklad[--sp], x = q % w;
      clani.push(q); st++;
      if (tuja(data[q])) zila = true;
      else if (data[q]) notri = true;
      if (x === 0 || x === w - 1 || q < w || q >= n - w) odprta = true;
      for (const j of [x > 0 ? q - 1 : -1, x < w - 1 ? q + 1 : -1, q >= w ? q - w : -1, q < n - w ? q + w : -1]) {
        if (j < 0 || v[j] || vid[j] >= 0) continue;
        vid[j] = k; sklad[sp++] = j;
      }
    }
    const meja = zila ? zile : notri ? najvec * 15 : najvec;
    if (!odprta && st <= meja) for (const q of clani) v[q] = 1;
  }
  return { w, h, data: v };
}

// Luknje žil v obrisu z = zapolniObris(...) (celice mreže r), ki jih na fotografiji ni videti: svetlost fotografije v
// luknji (svetlost(x, y) → 0–255 za celico) se od pasu organa okoli nje razlikuje za manj kot `prag` → luknja se zapolni
// (ocena A, krog 5: krožec »jetrne vene« brez vidne žile). Vidne žile (temna kri, svetel prazen lumen) ostanejo.
export function zapolniNevidneZile(z, svetlost, prag = 22) {
  const { w, h, data } = z, n = w * h, vid = new Uint8Array(n), clani = [];
  for (let k0 = 0; k0 < n; k0++) {
    if (data[k0] || vid[k0]) continue;
    clani.length = 0;
    const st = [k0]; vid[k0] = 1;
    let odprta = false;
    while (st.length) {
      const q = st.pop(), x = q % w;
      clani.push(q);
      if (x === 0 || x === w - 1 || q < w || q >= n - w) odprta = true;
      for (const j of [x > 0 ? q - 1 : -1, x < w - 1 ? q + 1 : -1, q >= w ? q - w : -1, q < n - w ? q + w : -1])
        if (j >= 0 && !data[j] && !vid[j]) { vid[j] = 1; st.push(j); }
    }
    if (odprta || clani.length > 400) continue;
    // pas organa okoli luknje: celice obrisa, ki se luknje dotikajo (do 2 celici daleč)
    const v = new Set(clani);
    let sl = 0, sn = 0, ol = 0, on = 0;
    const pas = new Set();
    for (const q of clani) {
      const x = q % w, y = (q / w) | 0;
      sl += svetlost(x, y); sn++;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
        const xx = x + dx, yy = y + dy, j = yy * w + xx;
        if (xx >= 0 && yy >= 0 && xx < w && yy < h && data[j] && !v.has(j)) pas.add(j);
      }
    }
    for (const j of pas) { ol += svetlost(j % w, (j / w) | 0); on++; }
    if (on && Math.abs(sl / sn - ol / on) < prag) for (const q of clani) data[q] = 1;
  }
  return z;
}

// Ključ oznake za raven: na OŠ preprostejše skupno ime (rezine-oznake.json »os«; posamezno vretence → ime skupine
// njegove vrste), strukture brez vnosa (npr. spolni organi) OŠ ne imenuje (""); sicer ključ sam.
export function kljucZaRaven(tab, k, os) {
  if (!k) return "";
  if (!os) return k;
  return tab.os[k] ?? tab.os[vretence(k)?.osnova] ?? "";
}

// Začetni pogled za raven: OŠ = prečni prerez naravnost na rezino, brez telesa okoli rezine (j, 10. 11.; ocena B).
export const pogledZaRaven = (raven) => (raven === 1 ? { smer: "a", pogled: "ravno", telo: false } : {});

// Rezina smeri (k ali s) blizu sredine, v kateri je telo najbolj sklenjeno od glave do stopal (največ vrstic s tkivom),
// da frontalni prerez zapolni okno in noge niso prekinjene. → indeks v mm ali null (mali volumen brez telesa).
export function najpolnejsaRezina(m, smer) {
  if (!m) return null;
  const n = smer === "k" ? m.dim[1] : m.dim[0];
  let naj = -1, kje = null;
  for (let j = Math.floor(n * 0.3); j <= Math.ceil(n * 0.7) && j < n; j++) {
    const r = rezinaMalega(m, smer, j);
    let vrst = 0;
    for (let y = 0; y < r.h; y++) {
      let ima = 0;
      for (let x = 0; x < r.w && ima < 3; x++) if (r.data[(y * r.w + x) * 4 + 3] > 100) ima++;
      if (ima >= 3) vrst++;
    }
    const ocena = vrst - Math.abs(j - n / 2) * 0.05; // ob enaki pokritosti bližje sredini
    if (ocena > naj) { naj = ocena; kje = j; }
  }
  return kje === null ? null : Math.round((kje + 0.5) * m.mm);
}

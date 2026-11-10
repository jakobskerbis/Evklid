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

// oznake.bin: pari uint16 (dolžina, oznaka), mali endian → Uint16Array(n) (z, y, x).
export function razpakirajOznake(buf, n) {
  const dv = new DataView(buf instanceof ArrayBuffer ? buf : buf.buffer, buf.byteOffset || 0, buf.byteLength);
  const out = new Uint16Array(n);
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

// Rezina mreže oznak: { w, h, data: Uint16Array } za rezino i (mm) v dani smeri.
export function rezinaOznak(o, smer, iMm) {
  const [W, H, Z] = o.dim;
  const [w, h] = velikostRezine(o.dim, smer);
  const i = Math.max(0, Math.min(steviloRezin(o.dim, smer) - 1, Math.floor(iMm / o.mm)));
  const data = new Uint16Array(w * h);
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

// Tkivo po barvi, kjer mreže HRA ni: rumenkasto = maščoba, temno rdeče = mišica; drugače null.
export function tkivoPoBarvi(r, g, b) {
  const mx = Math.max(r, g, b);
  if (mx < 40) return null;
  if (r > 150 && g > 120 && b < g - 25 && r - g < 70) return "t-mascoba";
  if (r > 70 && r < 190 && g < r * 0.55 && b < r * 0.5) return "t-misica";
  return null;
}

// Površje telesa iz alfe malega volumna (naivne »surface nets«): { pos, col, idx } v mm; korak 2 = pol manj podrobno.
export function povrsje(m, korak = 1, gladi = 8) {
  const [W0, H0, Z0] = m.dim, d = m.data, mm = m.mm * korak;
  const W = Math.ceil(W0 / korak), H = Math.ceil(H0 / korak), Z = Math.ceil(Z0 / korak);
  const ix = (x, y, z) => ((Math.min(z * korak, Z0 - 1) * H0 + Math.min(y * korak, H0 - 1)) * W0 + Math.min(x * korak, W0 - 1)) * 4;
  const f = (x, y, z) => (x < 0 || y < 0 || z < 0 || x >= W || y >= H || z >= Z ? -0.5 : d[ix(x, y, z) + 3] / 255 - 0.5);
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
            r += d[s]; g += d[s + 1]; bl += d[s + 2]; c++;
          }
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

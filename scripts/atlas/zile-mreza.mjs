// Geometrijska orodja za popravek žil (scripts/atlas/popravi-zile.mjs): branje dela GLB v svetovne koordinate,
// varjenje oglišč, robovi in zanke lukenj, usmeritev ploskev, sledenje osi cevi, dopolnitev odrezane stene cevi,
// stena z debelino, pokrovi. Brez odvisnosti (samo @gltf-transform/core za dostop do atributov pri branju/pisanju).
//
// Mreža dela: P (svetovni položaji, 3 na izrisno oglišče), A (drugi atributi: Map semantika → { n, d: number[] };
// NORMAL in TANGENT v svetovnih smereh), F (indeksi trikotnikov), zvar (izrisno → zvarjeno oglišče po položaju).
// Enote so metri (GLB), nastavitve v popravi-zile.mjs so v milimetrih.

export const v3 = {
  sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
  add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
  mul: (a, k) => [a[0] * k, a[1] * k, a[2] * k],
  dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
  cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
  len: (a) => Math.hypot(a[0], a[1], a[2]),
  norm: (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; },
  lerp: (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t],
  dist: (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]),
};

const det3 = (M) => M[0] * (M[5] * M[10] - M[9] * M[6]) - M[4] * (M[1] * M[10] - M[9] * M[2]) + M[8] * (M[1] * M[6] - M[5] * M[2]);

// ---------------------------------------------------------------------------------------------------------------
// Branje in pisanje
// ---------------------------------------------------------------------------------------------------------------

// Primitiv (TRIANGLES) vozlišča → mreža v svetovnih koordinatah. Zrcaljeno vozlišče (det < 0): indekse obrnemo, da
// je v svetu sprednja stran vedno v nasprotni smeri urinega kazalca; ob pisanju jih obrnemo nazaj.
export function preberi(node, prim) {
  const M = node.getWorldMatrix();
  const zrcaljeno = det3(M) < 0;
  const pos = prim.getAttribute("POSITION");
  const n = pos.getCount();
  const P = new Array(n * 3);
  const el = [0, 0, 0, 0];
  for (let i = 0; i < n; i++) {
    pos.getElement(i, el);
    P[i * 3] = M[0] * el[0] + M[4] * el[1] + M[8] * el[2] + M[12];
    P[i * 3 + 1] = M[1] * el[0] + M[5] * el[1] + M[9] * el[2] + M[13];
    P[i * 3 + 2] = M[2] * el[0] + M[6] * el[1] + M[10] * el[2] + M[14];
  }
  const A = new Map();
  for (const sem of prim.listSemantics()) {
    if (sem === "POSITION") continue;
    const acc = prim.getAttribute(sem);
    const k = acc.getElementSize();
    const d = new Array(n * k);
    const smer = sem === "NORMAL" || sem === "TANGENT";
    for (let i = 0; i < n; i++) {
      acc.getElement(i, el);
      if (smer) {
        const x = M[0] * el[0] + M[4] * el[1] + M[8] * el[2], y = M[1] * el[0] + M[5] * el[1] + M[9] * el[2], z = M[2] * el[0] + M[6] * el[1] + M[10] * el[2];
        const l = Math.hypot(x, y, z) || 1;
        d[i * k] = x / l; d[i * k + 1] = y / l; d[i * k + 2] = z / l;
        if (k === 4) d[i * k + 3] = el[3];
      } else for (let c = 0; c < k; c++) d[i * k + c] = el[c];
    }
    A.set(sem, { n: k, d });
  }
  const ind = prim.getIndices();
  const I = ind ? Array.from(ind.getArray()) : Array.from({ length: n }, (_, i) => i);
  if (zrcaljeno) for (let f = 0; f + 2 < I.length; f += 3) { const t = I[f + 1]; I[f + 1] = I[f + 2]; I[f + 2] = t; }
  const m = { P, A, F: I, zrcaljeno, spremenjeno: false };
  zvari(m);
  return m;
}

// Inverz afine matrike 4×4 (stolpčni zapis glTF).
function inverz(M) {
  const a = M[0], b = M[4], c = M[8], d = M[1], e = M[5], f = M[9], g = M[2], h = M[6], i = M[10];
  const D = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
  const r = [(e * i - f * h) / D, (c * h - b * i) / D, (b * f - c * e) / D, (f * g - d * i) / D, (a * i - c * g) / D, (c * d - a * f) / D, (d * h - e * g) / D, (b * g - a * h) / D, (a * e - b * d) / D];
  const tx = M[12], ty = M[13], tz = M[14];
  return { r, t: [-(r[0] * tx + r[1] * ty + r[2] * tz), -(r[3] * tx + r[4] * ty + r[5] * tz), -(r[6] * tx + r[7] * ty + r[8] * tz)] };
}

const TIP = (arr) => arr.constructor;
function vTip(Tip, normalizirano, x) {
  if (Tip === Float32Array) return x;
  if (!normalizirano) return Math.round(x);
  if (Tip === Int8Array) return Math.max(-127, Math.min(127, Math.round(x * 127)));
  if (Tip === Uint8Array) return Math.max(0, Math.min(255, Math.round(x * 255)));
  if (Tip === Int16Array) return Math.max(-32767, Math.min(32767, Math.round(x * 32767)));
  if (Tip === Uint16Array) return Math.max(0, Math.min(65535, Math.round(x * 65535)));
  return x;
}

// Mreža → primitiv. Ohrani tipe dostopnikov (kvantizacijo), material in imena. Pri normaliziranih celoštevilskih
// položajih (KHR_mesh_quantization) na novo določi premik in merilo vozlišča, da nova oglišča ostanejo v [-1, 1];
// to sme le, kadar mrežo uporablja eno samo vozlišče in ima en primitiv (sicer ostane merilo in se preveri obseg).
export function zapisi(doc, node, prim, m) {
  const M = node.getWorldMatrix();
  const { r, t } = inverz(M);
  const n = m.P.length / 3;
  const L = new Float64Array(n * 3);
  let mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < n; i++) {
    const x = m.P[i * 3], y = m.P[i * 3 + 1], z = m.P[i * 3 + 2];
    for (let c = 0; c < 3; c++) {
      const v = r[c * 3] * x + r[c * 3 + 1] * y + r[c * 3 + 2] * z + t[c];
      L[i * 3 + c] = v;
      if (v < mn[c]) mn[c] = v;
      if (v > mx[c]) mx[c] = v;
    }
  }
  const staro = prim.getAttribute("POSITION");
  const TipP = TIP(staro.getArray());
  const norm = staro.getNormalized();
  const buf = staro.getBuffer();
  let out;
  if (TipP === Float32Array) out = Float32Array.from(L);
  else {
    const predznacen = TipP === Int16Array || TipP === Int8Array;
    const sama = node.getMesh().listParents().filter((p) => p.propertyType === "Node").length === 1 && node.getMesh().listPrimitives().length === 1;
    if (norm && predznacen && sama) {
      const c = [(mn[0] + mx[0]) / 2, (mn[1] + mx[1]) / 2, (mn[2] + mx[2]) / 2];
      // Ohranimo število bitov izvirne kvantizacije (npr. 14 bitov v Int16: manjša datoteka po stiskanju).
      const polno = TipP === Int16Array ? 32767 : 127;
      let najv = 1;
      for (const x of staro.getArray()) { const a = Math.abs(x); if (a > najv) najv = a; }
      const lim = Math.min(polno, 2 ** Math.ceil(Math.log2(najv + 1)) - 1);
      const h = ((Math.max(mx[0] - mn[0], mx[1] - mn[1], mx[2] - mn[2]) / 2 || 1) * polno) / lim;
      for (let i = 0; i < n; i++) for (let k = 0; k < 3; k++) L[i * 3 + k] = (L[i * 3 + k] - c[k]) / h;
      // lokalna matrika vozlišča · T(c) · S(h): premik += R · (S ∘ c), merilo *= h
      const T = node.getTranslation(), [qx, qy, qz, qw] = node.getRotation(), S = node.getScale();
      const v = [S[0] * c[0], S[1] * c[1], S[2] * c[2]];
      const tx = 2 * (qy * v[2] - qz * v[1]), ty = 2 * (qz * v[0] - qx * v[2]), tz = 2 * (qx * v[1] - qy * v[0]);
      const rc = [v[0] + qw * tx + qy * tz - qz * ty, v[1] + qw * ty + qz * tx - qx * tz, v[2] + qw * tz + qx * ty - qy * tx];
      node.setTranslation([T[0] + rc[0], T[1] + rc[1], T[2] + rc[2]]);
      node.setScale([S[0] * h, S[1] * h, S[2] * h]);
    } else {
      const meja = norm ? 1 : TipP === Int16Array ? 32767 : TipP === Uint16Array ? 65535 : TipP === Int8Array ? 127 : 255;
      if (mn.some((v) => v < (predznacen ? -meja : 0) - 1e-9) || mx.some((v) => v > meja + 1e-9)) throw new Error(`${node.getName()}: nova oglišča so izven obsega kvantizacije, mreža pa je v skupni rabi`);
    }
    out = new TipP(n * 3);
    for (let i = 0; i < n * 3; i++) out[i] = vTip(TipP, norm, L[i]);
  }
  const novAcc = (star, arr) => doc.createAccessor(star.getName()).setType(star.getType()).setNormalized(star.getNormalized()).setBuffer(star.getBuffer() || buf).setArray(arr);
  prim.setAttribute("POSITION", novAcc(staro, out));
  for (const [sem, a] of m.A) {
    const star = prim.getAttribute(sem);
    const Tip = TIP(star.getArray());
    const nrm = star.getNormalized();
    const arr = new Tip(n * a.n);
    const smer = sem === "NORMAL" || sem === "TANGENT";
    for (let i = 0; i < n; i++) {
      if (smer) {
        // svet → lokalno: za smeri uporabimo transponirano matriko M (do merila natančno), nato normaliziramo
        const x = a.d[i * a.n], y = a.d[i * a.n + 1], z = a.d[i * a.n + 2];
        let lx = M[0] * x + M[1] * y + M[2] * z, ly = M[4] * x + M[5] * y + M[6] * z, lz = M[8] * x + M[9] * y + M[10] * z;
        const l = Math.hypot(lx, ly, lz) || 1;
        lx /= l; ly /= l; lz /= l;
        arr[i * a.n] = vTip(Tip, nrm, lx); arr[i * a.n + 1] = vTip(Tip, nrm, ly); arr[i * a.n + 2] = vTip(Tip, nrm, lz);
        if (a.n === 4) arr[i * a.n + 3] = vTip(Tip, nrm, a.d[i * a.n + 3]);
      } else for (let c = 0; c < a.n; c++) arr[i * a.n + c] = vTip(Tip, nrm, a.d[i * a.n + c]);
    }
    prim.setAttribute(sem, novAcc(star, arr));
  }
  const I = m.F.slice();
  if (m.zrcaljeno) for (let f = 0; f + 2 < I.length; f += 3) { const x = I[f + 1]; I[f + 1] = I[f + 2]; I[f + 2] = x; }
  const starI = prim.getIndices();
  const arrI = n > 65535 ? Uint32Array.from(I) : Uint16Array.from(I);
  prim.setIndices(doc.createAccessor(starI ? starI.getName() : "").setType("SCALAR").setBuffer((starI && starI.getBuffer()) || buf).setArray(arrI));
}

// ---------------------------------------------------------------------------------------------------------------
// Topologija
// ---------------------------------------------------------------------------------------------------------------

const KLJUC = 2e6; // mreža varjenja 0,5 µm (kvantizirani položaji so v svetu natančni na ~1 µm)
export function zvari(m) {
  const n = m.P.length / 3;
  const kl = new Map();
  m.zvar = new Array(n);
  m.W = []; // položaj zvarjenega oglišča
  m.predst = []; // eno izrisno oglišče za vsako zvarjeno
  for (let i = 0; i < n; i++) {
    const k = `${Math.round(m.P[i * 3] * KLJUC)},${Math.round(m.P[i * 3 + 1] * KLJUC)},${Math.round(m.P[i * 3 + 2] * KLJUC)}`;
    let w = kl.get(k);
    if (w === undefined) { w = m.W.length; kl.set(k, w); m.W.push([m.P[i * 3], m.P[i * 3 + 1], m.P[i * 3 + 2]]); m.predst.push(i); }
    m.zvar[i] = w;
  }
  m.kljuci = kl;
  return m;
}

export const pol = (m, i) => [m.P[i * 3], m.P[i * 3 + 1], m.P[i * 3 + 2]];

// Novo izrisno oglišče. attr: { NORMAL: [x,y,z], … } ali kopija/mešanica iz obstoječih (viri: [[i, utež], …]).
export function dodajOglisce(m, p, viri, attr = {}) {
  const i = m.P.length / 3;
  m.P.push(p[0], p[1], p[2]);
  let sw = 0;
  for (const [, w] of viri) sw += w;
  for (const [sem, a] of m.A) {
    if (attr[sem]) { for (let c = 0; c < a.n; c++) a.d.push(attr[sem][c] ?? (c === 3 ? 1 : 0)); continue; }
    const v = new Array(a.n).fill(0);
    for (const [j, w] of viri) for (let c = 0; c < a.n; c++) v[c] += (a.d[j * a.n + c] * w) / (sw || 1);
    if (sem === "NORMAL" || sem === "TANGENT") { const l = Math.hypot(v[0], v[1], v[2]) || 1; v[0] /= l; v[1] /= l; v[2] /= l; if (a.n === 4) v[3] = v[3] < 0 ? -1 : 1; }
    for (let c = 0; c < a.n; c++) a.d.push(v[c]);
  }
  const k = `${Math.round(p[0] * KLJUC)},${Math.round(p[1] * KLJUC)},${Math.round(p[2] * KLJUC)}`;
  let w = m.kljuci.get(k);
  if (w === undefined) { w = m.W.length; m.kljuci.set(k, w); m.W.push([p[0], p[1], p[2]]); m.predst.push(i); }
  m.zvar.push(w);
  m.spremenjeno = true;
  return i;
}

export function nastaviAtribut(m, sem, i, v) {
  const a = m.A.get(sem);
  if (!a) return;
  for (let c = 0; c < Math.min(a.n, v.length); c++) a.d[i * a.n + c] = v[c];
  m.spremenjeno = true;
}

// Odstrani izrojene trikotnike (dve enaki zvarjeni oglišči). Vrne število odstranjenih.
export function brezIzrojenih(m) {
  const F = [];
  let st = 0;
  for (let f = 0; f < m.F.length; f += 3) {
    const a = m.zvar[m.F[f]], b = m.zvar[m.F[f + 1]], c = m.zvar[m.F[f + 2]];
    if (a === b || b === c || a === c) { st++; continue; }
    F.push(m.F[f], m.F[f + 1], m.F[f + 2]);
  }
  if (st) { m.F = F; m.spremenjeno = true; }
  return st;
}

// Robovi po zvarjenih ogliščih: Map "a_b" (a < b) → seznam polrobov { f, k } (f = indeks trikotnika, k = 0..2).
export function robovi(m) {
  const E = new Map();
  const T = m.F.length / 3;
  for (let f = 0; f < T; f++) for (let k = 0; k < 3; k++) {
    const a = m.zvar[m.F[f * 3 + k]], b = m.zvar[m.F[f * 3 + (k + 1) % 3]];
    const kl = a < b ? a * 4294967296 + b : b * 4294967296 + a;
    let l = E.get(kl);
    if (!l) E.set(kl, (l = []));
    l.push(f * 3 + k);
  }
  return E;
}

// Povezane komponente trikotnikov (po robovih). Vrne { komp: Int32Array(T), st }.
export function komponente(m, E = robovi(m)) {
  const T = m.F.length / 3;
  const par = new Int32Array(T);
  for (let i = 0; i < T; i++) par[i] = i;
  const najdi = (x) => { while (par[x] !== x) { par[x] = par[par[x]]; x = par[x]; } return x; };
  for (const l of E.values()) for (let i = 1; i < l.length; i++) { const a = najdi((l[0] / 3) | 0), b = najdi((l[i] / 3) | 0); if (a !== b) par[a] = b; }
  const id = new Map();
  const komp = new Int32Array(T);
  for (let i = 0; i < T; i++) { const r = najdi(i); if (!id.has(r)) id.set(r, id.size); komp[i] = id.get(r); }
  return { komp, st: id.size };
}

// Zanke odprtih robov. Vsaka zanka: seznam { w (zvarjeno oglišče na začetku roba), r (izrisno oglišče), r2 (izrisno
// oglišče na koncu roba), f (trikotnik) } v smeri polroba ploskve (ploskev je na levi strani). Zanka z enim
// ogliščem v dveh zankah (nemnogoterno) se razreže po prvi sklenjeni poti.
export function zanke(m, E = robovi(m)) {
  const izh = new Map(); // w → [polrob]
  for (const l of E.values()) {
    if (l.length !== 1) continue;
    const h = l[0], f = (h / 3) | 0, k = h % 3;
    const r = m.F[f * 3 + k], r2 = m.F[f * 3 + (k + 1) % 3];
    const a = m.zvar[r];
    let s = izh.get(a);
    if (!s) izh.set(a, (s = []));
    s.push({ w: a, w2: m.zvar[r2], r, r2, f });
  }
  const out = [];
  for (const s of izh.values()) {
    while (s.length) {
      const z = [];
      let e = s.pop();
      const start = e.w;
      let varno = 0;
      while (e && varno++ < 1e6) {
        z.push(e);
        if (e.w2 === start) break;
        const nasl = izh.get(e.w2);
        e = nasl && nasl.length ? nasl.pop() : null;
      }
      if (!e) continue; // ni sklenjena
      // oglišče, ki ga zanka obišče dvakrat (stik dveh lukenj v eni točki): razrežemo na enostavne zanke
      const sklad = [], kje = new Map();
      for (const x of z) {
        if (kje.has(x.w)) {
          const i = kje.get(x.w);
          const del = sklad.splice(i);
          for (const y of del) kje.delete(y.w);
          out.push(del);
        }
        kje.set(x.w, sklad.length);
        sklad.push(x);
      }
      if (sklad.length) out.push(sklad);
    }
  }
  return out;
}

export function normalaPloskve(m, f) {
  const a = pol(m, m.F[f * 3]), b = pol(m, m.F[f * 3 + 1]), c = pol(m, m.F[f * 3 + 2]);
  return v3.cross(v3.sub(b, a), v3.sub(c, a)); // dolžina = 2 × ploščina
}

// Gladke normale zvarjenih oglišč (utež: ploščina × kot bi bila natančnejša; ploščina zadošča za cevi).
export function normaleZvarjenih(m) {
  const N = m.W.map(() => [0, 0, 0]);
  const T = m.F.length / 3;
  for (let f = 0; f < T; f++) {
    const p = [pol(m, m.F[f * 3]), pol(m, m.F[f * 3 + 1]), pol(m, m.F[f * 3 + 2])];
    const n = v3.norm(v3.cross(v3.sub(p[1], p[0]), v3.sub(p[2], p[0])));
    for (let k = 0; k < 3; k++) {
      const u = v3.norm(v3.sub(p[(k + 1) % 3], p[k])), w = v3.norm(v3.sub(p[(k + 2) % 3], p[k]));
      const kot = Math.acos(Math.max(-1, Math.min(1, v3.dot(u, w))));
      const W = N[m.zvar[m.F[f * 3 + k]]];
      W[0] += n[0] * kot; W[1] += n[1] * kot; W[2] += n[2] * kot;
    }
  }
  return N.map(v3.norm);
}

// Žarek proti trikotnikom mreže (Möller–Trumbore). Vrne { t, f } najbližjega zadetka z t > tmin ali null.
// stran: 1 = samo ploskve, ki jih žarek zadene od znotraj (v smeri njihove normale), -1 = samo od zunaj, 0 = vse.
// ploskve: seznam indeksov trikotnikov (privzeto vsi).
export function zarek(m, o, d, tmin = 1e-7, ploskve = null, stran = 0) {
  let best = null;
  const T = ploskve ? ploskve.length : m.F.length / 3;
  for (let i = 0; i < T; i++) {
    const f = ploskve ? ploskve[i] : i;
    const ia = m.F[f * 3] * 3, ib = m.F[f * 3 + 1] * 3, ic = m.F[f * 3 + 2] * 3;
    const e1x = m.P[ib] - m.P[ia], e1y = m.P[ib + 1] - m.P[ia + 1], e1z = m.P[ib + 2] - m.P[ia + 2];
    const e2x = m.P[ic] - m.P[ia], e2y = m.P[ic + 1] - m.P[ia + 1], e2z = m.P[ic + 2] - m.P[ia + 2];
    const px = d[1] * e2z - d[2] * e2y, py = d[2] * e2x - d[0] * e2z, pz = d[0] * e2y - d[1] * e2x;
    const det = e1x * px + e1y * py + e1z * pz;
    if (Math.abs(det) < 1e-18) continue;
    if (stran && (det < 0 ? 1 : -1) !== stran) continue; // stran 1: samo izstopni zadetki (žarek v smeri normale ploskve)
    const inv = 1 / det;
    const tx = o[0] - m.P[ia], ty = o[1] - m.P[ia + 1], tz = o[2] - m.P[ia + 2];
    const u = (tx * px + ty * py + tz * pz) * inv;
    if (u < -1e-9 || u > 1 + 1e-9) continue;
    const qx = ty * e1z - tz * e1y, qy = tz * e1x - tx * e1z, qz = tx * e1y - ty * e1x;
    const vv = (d[0] * qx + d[1] * qy + d[2] * qz) * inv;
    if (vv < -1e-9 || u + vv > 1 + 1e-9) continue;
    const t = (e2x * qx + e2y * qy + e2z * qz) * inv;
    if (t > tmin && (!best || t < best.t)) best = { t, f };
  }
  return best;
}

// Število presečišč žarka s ploskvami (parnost: liho = izhodišče je v zaprtem telesu).
export function steviloZadetkov(m, o, d, ploskve) {
  let st = 0;
  for (const f of ploskve) {
    const ia = m.F[f * 3] * 3, ib = m.F[f * 3 + 1] * 3, ic = m.F[f * 3 + 2] * 3;
    const e1x = m.P[ib] - m.P[ia], e1y = m.P[ib + 1] - m.P[ia + 1], e1z = m.P[ib + 2] - m.P[ia + 2];
    const e2x = m.P[ic] - m.P[ia], e2y = m.P[ic + 1] - m.P[ia + 1], e2z = m.P[ic + 2] - m.P[ia + 2];
    const px = d[1] * e2z - d[2] * e2y, py = d[2] * e2x - d[0] * e2z, pz = d[0] * e2y - d[1] * e2x;
    const det = e1x * px + e1y * py + e1z * pz;
    if (Math.abs(det) < 1e-24) continue;
    const inv = 1 / det;
    const tx = o[0] - m.P[ia], ty = o[1] - m.P[ia + 1], tz = o[2] - m.P[ia + 2];
    const u = (tx * px + ty * py + tz * pz) * inv;
    if (u < 0 || u > 1) continue;
    const qx = ty * e1z - tz * e1y, qy = tz * e1x - tx * e1z, qz = tx * e1y - ty * e1x;
    const w = (d[0] * qx + d[1] * qy + d[2] * qz) * inv;
    if (w < 0 || u + w > 1) continue;
    if ((e2x * qx + e2y * qy + e2z * qz) * inv > 0) st++;
  }
  return st;
}

// Usmeritev: v vsaki komponenti vse ploskve enako navite (večina zmaga), nato zunanja stran navzven.
// Zaprta komponenta: predznak prostornine (votlina v drugi zaprti komponenti gleda navznoter). Odprta: žarki iz
// vzorca ploskev; stran, s katere žarek redkeje zadene isto komponento, je zunanja. Vrne { obrnjene (manjšinske ploskve), navznoter (obrnjene cele komponente) }.
export function usmeri(m, { vzorec = 120 } = {}) {
  const E = robovi(m);
  const T = m.F.length / 3;
  const sos = Array.from({ length: T }, () => []);
  const odprt = new Uint8Array(T);
  for (const l of E.values()) {
    if (l.length === 2) {
      const [h0, h1] = l;
      const f0 = (h0 / 3) | 0, f1 = (h1 / 3) | 0;
      const a0 = m.zvar[m.F[h0]], a1 = m.zvar[m.F[h1]];
      const isti = a0 === a1; // oba polroba v isto smer → nasprotno navitje
      sos[f0].push([f1, isti]); sos[f1].push([f0, isti]);
    } else for (const h of l) odprt[(h / 3) | 0] = 1;
  }
  const o = new Int8Array(T).fill(-1);
  let obrnjene = 0, navznoter = 0;
  const obrni = (f) => { const x = m.F[f * 3 + 1]; m.F[f * 3 + 1] = m.F[f * 3 + 2]; m.F[f * 3 + 2] = x; };
  const zaprte = [];
  for (let s = 0; s < T; s++) {
    if (o[s] >= 0) continue;
    const vr = [s];
    o[s] = 0;
    let n1 = 0, zaprta = true;
    for (let g = 0; g < vr.length; g++) {
      const f = vr[g];
      if (o[f]) n1++;
      if (odprt[f]) zaprta = false;
      for (const [h, isti] of sos[f]) if (o[h] < 0) { o[h] = isti ? 1 - o[f] : o[f]; vr.push(h); }
    }
    const manj = n1 * 2 > vr.length ? 0 : 1;
    for (const f of vr) if (o[f] === manj) { obrni(f); obrnjene++; }
    if (zaprta) {
      // zaprta komponenta: predznak prostornine, odločimo spodaj (votlina v drugi komponenti gleda navznoter)
      let V = 0;
      const mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity];
      for (const f of vr) {
        const a = pol(m, m.F[f * 3]), b = pol(m, m.F[f * 3 + 1]), c = pol(m, m.F[f * 3 + 2]);
        V += v3.dot(a, v3.cross(b, c));
        for (const p of [a, b, c]) for (let k = 0; k < 3; k++) { if (p[k] < mn[k]) mn[k] = p[k]; if (p[k] > mx[k]) mx[k] = p[k]; }
      }
      zaprte.push({ vr, V, mn, mx });
      continue;
    }
    let spredaj = 0, zadaj = 0;
    const korak = Math.max(1, Math.floor(vr.length / vzorec));
    for (let i = (korak / 2) | 0; i < vr.length; i += korak) {
      const f = vr[i];
      const n = normalaPloskve(m, f);
      const pl = v3.len(n);
      if (pl < 1e-14) continue;
      const nn = v3.mul(n, 1 / pl);
      const c = v3.mul(v3.add(v3.add(pol(m, m.F[f * 3]), pol(m, m.F[f * 3 + 1])), pol(m, m.F[f * 3 + 2])), 1 / 3);
      const eps = Math.sqrt(pl) * 1e-3;
      if (zarek(m, v3.add(c, v3.mul(nn, eps)), nn, 0, vr)) spredaj++;
      if (zarek(m, v3.sub(c, v3.mul(nn, eps)), v3.mul(nn, -1), 0, vr)) zadaj++;
    }
    if (spredaj > 2 * zadaj + 2) { for (const f of vr) obrni(f); navznoter++; } // samo ob jasni večini (ponovljivo)
  }
  // Zaprte komponente: prostornina > 0 je prav. Prostornina < 0 je prav samo za votlino (svetlina votle žile: notranja
  // lupina v zaprti zunanji lupini istega dela); sicer je komponenta obrnjena navznoter in jo obrnemo.
  const smer = [0.5377, 0.7151, 0.4463];
  for (const k of zaprte) {
    if (k.V >= 0) continue;
    const p = pol(m, m.F[k.vr[0] * 3]);
    const votlina = zaprte.some((c) => c.V > 0 && -k.V < c.V && [0, 1, 2].every((i) => c.mn[i] <= k.mn[i] && c.mx[i] >= k.mx[i]) && steviloZadetkov(m, p, smer, c.vr) % 2 === 1);
    if (!votlina) { for (const f of k.vr) obrni(f); navznoter++; }
  }
  if (obrnjene || navznoter) m.spremenjeno = true;
  return { obrnjene, navznoter };
}

// ---------------------------------------------------------------------------------------------------------------
// Ravnine, krogi
// ---------------------------------------------------------------------------------------------------------------

// Lastni vektorji simetrične matrike 3×3 (Jacobi). Vrne [{ l, v }] urejeno po l naraščajoče.
function lastni(S) {
  const a = [S[0].slice(), S[1].slice(), S[2].slice()];
  const V = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  for (let it = 0; it < 60; it++) {
    let p = 0, q = 1;
    if (Math.abs(a[0][2]) > Math.abs(a[p][q])) { p = 0; q = 2; }
    if (Math.abs(a[1][2]) > Math.abs(a[p][q])) { p = 1; q = 2; }
    if (Math.abs(a[p][q]) < 1e-30) break;
    const th = (a[q][q] - a[p][p]) / (2 * a[p][q]);
    const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1));
    const c = 1 / Math.sqrt(t * t + 1), s = t * c;
    for (let k = 0; k < 3; k++) { const x = a[k][p], y = a[k][q]; a[k][p] = c * x - s * y; a[k][q] = s * x + c * y; }
    for (let k = 0; k < 3; k++) { const x = a[p][k], y = a[q][k]; a[p][k] = c * x - s * y; a[q][k] = s * x + c * y; }
    for (let k = 0; k < 3; k++) { const x = V[k][p], y = V[k][q]; V[k][p] = c * x - s * y; V[k][q] = s * x + c * y; }
  }
  return [0, 1, 2].map((i) => ({ l: a[i][i], v: [V[0][i], V[1][i], V[2][i]] })).sort((x, y) => x.l - y.l);
}

// Najboljša ravnina skozi točke: { c (težišče), n (normala), osi: [u, v] (v ravnini, u = najdaljša smer), odmik (največji) }.
export function ravnina(tocke) {
  const c = [0, 0, 0];
  for (const p of tocke) { c[0] += p[0] / tocke.length; c[1] += p[1] / tocke.length; c[2] += p[2] / tocke.length; }
  const S = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (const p of tocke) { const d = v3.sub(p, c); for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) S[i][j] += d[i] * d[j]; }
  const e = lastni(S);
  const n = v3.norm(e[0].v);
  let odmik = 0;
  for (const p of tocke) odmik = Math.max(odmik, Math.abs(v3.dot(v3.sub(p, c), n)));
  return { c, n, osi: [v3.norm(e[2].v), v3.norm(e[1].v)], odmik };
}

// Krog skozi točke 2D (Kåsa, z izločanjem osamelcev). Vrne { x, y, r } ali null.
export function krog2(pts) {
  let izbor = pts;
  let k = null;
  for (let it = 0; it < 3; it++) {
    const n = izbor.length;
    if (n < 3) return k;
    let sx = 0, sy = 0;
    for (const p of izbor) { sx += p[0]; sy += p[1]; }
    const mx = sx / n, my = sy / n;
    let suu = 0, suv = 0, svv = 0, suuu = 0, svvv = 0, suvv = 0, svuu = 0;
    for (const p of izbor) {
      const u = p[0] - mx, v = p[1] - my;
      suu += u * u; suv += u * v; svv += v * v; suuu += u * u * u; svvv += v * v * v; suvv += u * v * v; svuu += v * u * u;
    }
    const D = suu * svv - suv * suv;
    if (Math.abs(D) < 1e-30) return k;
    const uc = (0.5 * (suuu + suvv) * svv - 0.5 * (svvv + svuu) * suv) / D;
    const vc = (0.5 * (svvv + svuu) * suu - 0.5 * (suuu + suvv) * suv) / D;
    k = { x: uc + mx, y: vc + my, r: Math.sqrt(uc * uc + vc * vc + (suu + svv) / n) };
    const ost = izbor.filter((p) => Math.abs(Math.hypot(p[0] - k.x, p[1] - k.y) - k.r) < 0.12 * k.r);
    if (ost.length === izbor.length || ost.length < 5) break;
    izbor = ost;
  }
  return k;
}

// Pravokotni vektor na t, čim bližje smeri »ref«.
export function pravokotno(t, ref) {
  let e = v3.sub(ref, v3.mul(t, v3.dot(ref, t)));
  if (v3.len(e) < 1e-6) { const a = Math.abs(t[0]) < 0.8 ? [1, 0, 0] : [0, 1, 0]; e = v3.sub(a, v3.mul(t, v3.dot(a, t))); }
  return v3.norm(e);
}

// Opis zanke: težišče, normala (Newell, v smeri obhoda), obseg, srednji polmer, okroglost (rmin / rmax), odmik od ravnine.
export function opisZanke(m, z) {
  const t = z.map((e) => m.W[e.w]);
  const c = [0, 0, 0];
  for (const p of t) { c[0] += p[0] / t.length; c[1] += p[1] / t.length; c[2] += p[2] / t.length; }
  const n = [0, 0, 0];
  let obseg = 0;
  for (let i = 0; i < t.length; i++) {
    const a = t[i], b = t[(i + 1) % t.length];
    n[0] += (a[1] - b[1]) * (a[2] + b[2]); n[1] += (a[2] - b[2]) * (a[0] + b[0]); n[2] += (a[0] - b[0]) * (a[1] + b[1]);
    obseg += v3.dist(a, b);
  }
  const nn = v3.norm(n);
  let rmin = Infinity, rmax = 0, rs = 0, odmik = 0;
  for (const p of t) { const d = v3.sub(p, c); const r = v3.len(d); rmin = Math.min(rmin, r); rmax = Math.max(rmax, r); rs += r / t.length; odmik = Math.max(odmik, Math.abs(v3.dot(d, nn))); }
  return { c, n: nn, obseg, r: rs, okroglost: rmax ? rmin / rmax : 0, odmik, ploscina: v3.len(n) / 2 };
}

// ---------------------------------------------------------------------------------------------------------------
// Os cevi
// ---------------------------------------------------------------------------------------------------------------

// Sledi osi cevi skozi oblak oglišč »tocke« od kroga (c0, smer t0, polmer r0). Na vsakem koraku prilagodi krog
// ogliščem v rezini pravokotno na smer. Vrne postaje [{ c, t, r, s }] (s = dolžina loka), zglajene.
export function osCevi(tocke, c0, t0, r0, { najDolzina = 2 } = {}) {
  const post = [{ c: c0, t: v3.norm(t0), r: r0, ok: 2 }];
  let c = c0, t = v3.norm(t0), r = r0, prazno = 0, dolzina = 0;
  const rezina = (q, tt, rr) => {
    const e1 = pravokotno(tt, [0.31, 0.77, 0.55]), e2 = v3.cross(tt, e1);
    const pts = [];
    for (const p of tocke) {
      const d = v3.sub(p, q);
      if (Math.abs(v3.dot(d, tt)) > 0.6 * rr) continue;
      const x = v3.dot(d, e1), y = v3.dot(d, e2);
      const h = Math.hypot(x, y);
      if (h > 1.6 * rr || h < 0.45 * rr) continue;
      pts.push([x, y]);
    }
    return { pts, e1, e2 };
  };
  const razpon = (pts, k) => {
    const koti = pts.map((p) => Math.atan2(p[1] - k.y, p[0] - k.x)).sort((a, b) => a - b);
    let vrzel = koti[0] + 2 * Math.PI - koti[koti.length - 1];
    for (let i = 1; i < koti.length; i++) vrzel = Math.max(vrzel, koti[i] - koti[i - 1]);
    return 2 * Math.PI - vrzel;
  };
  // središče kroga z znanim polmerom (Gauss–Newton): za žleb, kjer je ostalo manj kot pol oboda
  const zPolmerom = (pts, rr) => {
    let x = 0, y = 0;
    for (let it = 0; it < 12; it++) {
      let a11 = 0, a12 = 0, a22 = 0, b1 = 0, b2 = 0;
      for (const p of pts) {
        const dx = x - p[0], dy = y - p[1], d = Math.hypot(dx, dy) || 1e-9;
        const res = d - rr;
        if (Math.abs(res) > 0.25 * rr) continue;
        const jx = dx / d, jy = dy / d;
        a11 += jx * jx; a12 += jx * jy; a22 += jy * jy; b1 += jx * res; b2 += jy * res;
      }
      const D = a11 * a22 - a12 * a12;
      if (Math.abs(D) < 1e-12) return null;
      x -= (a22 * b1 - a12 * b2) / D; y -= (a11 * b2 - a12 * b1) / D;
    }
    const blizu = pts.filter((p) => Math.abs(Math.hypot(p[0] - x, p[1] - y) - rr) < 0.12 * rr);
    if (blizu.length < 4 || razpon(blizu, { x, y }) < 1.0 || Math.hypot(x, y) > 0.5 * rr) return null;
    return { x, y, r: rr };
  };
  for (let it = 0; it < 4000 && dolzina < najDolzina; it++) {
    const h = 0.3 * r;
    const q = v3.add(c, v3.mul(t, h));
    const { pts, e1, e2 } = rezina(q, t, r);
    let k = pts.length >= 6 ? krog2(pts) : null;
    let ok = 2;
    if (k && (razpon(pts, k) < 3.3 || Math.hypot(k.x, k.y) > 0.5 * r || k.r > 1.3 * r || k.r < 0.75 * r)) k = null;
    if (!k && pts.length >= 4) { k = zPolmerom(pts, r); ok = 1; }
    let cn;
    if (k) { cn = v3.add(q, v3.add(v3.mul(e1, k.x), v3.mul(e2, k.y))); r = k.r; prazno = 0; } else { cn = q; prazno += h; ok = 0; }
    if (prazno > 2.5 * r) break;
    t = v3.norm(v3.add(v3.mul(t, 0.5), v3.mul(v3.norm(v3.sub(cn, c)), 0.5)));
    dolzina += v3.dist(cn, c);
    c = cn;
    post.push({ c, t, r, ok });
  }
  // žleb: polmer linearno med sosednjima postajama s polnim krogom, središče še enkrat s tem polmerom
  for (let i = 1; i < post.length; i++) {
    if (post[i].ok !== 1) continue;
    let a = i - 1, b = i;
    while (b < post.length && post[b].ok !== 2) b++;
    if (b >= post.length) break;
    for (let j = i; j < b; j++) {
      const rr = post[a].r + ((post[b].r - post[a].r) * (j - a)) / (b - a);
      const tt = v3.norm(v3.sub(post[j + 1].c, post[j - 1].c));
      const { pts, e1, e2 } = rezina(post[j].c, tt, rr);
      const k = pts.length >= 4 ? zPolmerom(pts, rr) : null;
      post[j].r = rr;
      if (k) post[j].c = v3.add(post[j].c, v3.add(v3.mul(e1, k.x), v3.mul(e2, k.y)));
    }
    i = b;
  }
  // odreži rep brez podatkov, razen kratkega podaljška
  let zadnji = post.length - 1;
  while (zadnji > 0 && !post[zadnji].ok) zadnji--;
  post.length = Math.min(post.length, zadnji + 1 + 6);
  // glajenje (obdrži prvo točko)
  for (let pass = 0; pass < 6; pass++) {
    const cc = post.map((p) => p.c), rr = post.map((p) => p.r);
    for (let i = 1; i + 1 < post.length; i++) {
      post[i].c = v3.add(v3.mul(cc[i], 0.5), v3.mul(v3.add(cc[i - 1], cc[i + 1]), 0.25));
      post[i].r = rr[i] * 0.5 + (rr[i - 1] + rr[i + 1]) * 0.25;
    }
  }
  let s = 0;
  for (let i = 0; i < post.length; i++) {
    if (i) s += v3.dist(post[i].c, post[i - 1].c);
    post[i].s = s;
    const a = post[Math.max(0, i - 1)].c, b = post[Math.min(post.length - 1, i + 1)].c;
    post[i].t = v3.norm(v3.sub(b, a));
  }
  return post;
}

// Parametrizacija okoli osi: tocka → { s, kot, rho }, (s, kot) → točka na cevi. ref: smer kota 0 (npr. normala
// ravnine obreza navzven).
export function parametrizacija(os, ref) {
  const n = os.length;
  const okvir = (i) => { const e1 = pravokotno(os[i].t, ref); return [e1, v3.cross(os[i].t, e1)]; };
  const okv = os.map((_, i) => okvir(i));
  function vTocki(s) {
    let i = 0;
    if (s <= os[0].s) i = 0;
    else if (s >= os[n - 1].s) i = n - 2;
    else { let lo = 0, hi = n - 1; while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (os[mid].s <= s) lo = mid; else hi = mid; } i = lo; }
    const a = os[i], b = os[i + 1];
    const u = (s - a.s) / (b.s - a.s || 1); // sme biti izven [0, 1]: linearni podaljšek
    const uu = Math.max(0, Math.min(1, u));
    const t = v3.norm(v3.lerp(a.t, b.t, uu));
    const e1 = pravokotno(t, ref);
    return { c: v3.lerp(a.c, b.c, u), t, e1, e2: v3.cross(t, e1), r: a.r + (b.r - a.r) * uu };
  }
  function izTocke(p) {
    // najbližja točka na lomljenki (s podaljškoma), nato popravek s: (p − c(s))·t(s) = 0
    let best = Infinity, s = 0;
    for (let i = 0; i + 1 < n; i++) {
      const a = os[i].c, b = os[i + 1].c;
      const ab = v3.sub(b, a);
      let u = v3.dot(v3.sub(p, a), ab) / (v3.dot(ab, ab) || 1);
      if (i > 0) u = Math.max(0, u);
      if (i + 2 < n) u = Math.min(1, u);
      const d = v3.dist(p, v3.add(a, v3.mul(ab, u)));
      if (d < best) { best = d; s = os[i].s + u * (os[i + 1].s - os[i].s); }
    }
    for (let it = 0; it < 6; it++) { const o = vTocki(s); s += v3.dot(v3.sub(p, o.c), o.t); }
    const o = vTocki(s);
    const d = v3.sub(p, o.c);
    return { s, kot: Math.atan2(v3.dot(d, o.e2), v3.dot(d, o.e1)), rho: Math.hypot(v3.dot(d, o.e1), v3.dot(d, o.e2)) };
  }
  function naCevi(s, kot, rho = null) {
    const o = vTocki(s);
    const smer = v3.add(v3.mul(o.e1, Math.cos(kot)), v3.mul(o.e2, Math.sin(kot)));
    return { p: v3.add(o.c, v3.mul(smer, rho ?? o.r)), n: smer, r: o.r };
  }
  return { izTocke, naCevi, vTocki, okv };
}

// ---------------------------------------------------------------------------------------------------------------
// Triangulacija mnogokotnika v ravnini z notranjimi točkami (rezanje ušes + vstavljanje + Delaunayeve zamenjave)
// ---------------------------------------------------------------------------------------------------------------

const orient = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
function vTrikotniku(p, a, b, c) {
  const d1 = orient(a, b, p), d2 = orient(b, c, p), d3 = orient(c, a, p);
  return (d1 >= 0 && d2 >= 0 && d3 >= 0) || (d1 <= 0 && d2 <= 0 && d3 <= 0);
}
export function vMnogokotniku(p, poly) {
  let znotraj = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j];
    if (a[1] > p[1] !== b[1] > p[1] && p[0] < ((b[0] - a[0]) * (p[1] - a[1])) / (b[1] - a[1]) + a[0]) znotraj = !znotraj;
  }
  return znotraj;
}
function razdaljaDoRoba(p, poly) {
  let best = Infinity;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[j], b = poly[i];
    const abx = b[0] - a[0], aby = b[1] - a[1];
    const u = Math.max(0, Math.min(1, ((p[0] - a[0]) * abx + (p[1] - a[1]) * aby) / (abx * abx + aby * aby || 1)));
    best = Math.min(best, Math.hypot(p[0] - a[0] - abx * u, p[1] - a[1] - aby * u));
  }
  return best;
}

// poly: [[x, y], …] (enostaven mnogokotnik, poljubna smer). notranje: [[x, y], …]. Vrne trikotnike kot trojke
// indeksov (0..poly.length-1 = oglišča mnogokotnika, naprej notranje točke), usmerjene kot mnogokotnik.
export function trianguliraj(poly, notranje = []) {
  const n = poly.length;
  let pl = 0;
  for (let i = 0; i < n; i++) { const a = poly[i], b = poly[(i + 1) % n]; pl += a[0] * b[1] - b[0] * a[1]; }
  const ccw = pl > 0;
  const V = poly.map((_, i) => i);
  if (!ccw) V.reverse();
  const pts = [...poly, ...notranje];
  const tri = [];
  let varno = 0;
  while (V.length > 3 && varno++ < 100000) {
    let naj = -1, najKot = -Infinity;
    for (let i = 0; i < V.length; i++) {
      const a = pts[V[(i + V.length - 1) % V.length]], b = pts[V[i]], c = pts[V[(i + 1) % V.length]];
      if (orient(a, b, c) <= 1e-30) continue;
      let prazno = true;
      for (let j = 0; j < V.length && prazno; j++) {
        const q = V[j];
        if (q === V[(i + V.length - 1) % V.length] || q === V[i] || q === V[(i + 1) % V.length]) continue;
        if (vTrikotniku(pts[q], a, b, c)) prazno = false;
      }
      if (!prazno) continue;
      // kakovost: najmanjši kot trikotnika
      const la = Math.hypot(b[0] - c[0], b[1] - c[1]), lb = Math.hypot(a[0] - c[0], a[1] - c[1]), lc = Math.hypot(a[0] - b[0], a[1] - b[1]);
      const kak = (2 * orient(a, b, c)) / (la * la + lb * lb + lc * lc);
      if (kak > najKot) { najKot = kak; naj = i; }
    }
    if (naj < 0) naj = 0; // izrojeno: vseeno odreži
    const L = V.length;
    tri.push([V[(naj + L - 1) % L], V[naj], V[(naj + 1) % L]]);
    V.splice(naj, 1);
  }
  if (V.length === 3) tri.push([V[0], V[1], V[2]]);
  // vstavljanje notranjih točk
  for (let k = 0; k < notranje.length; k++) {
    const id = n + k, p = pts[id];
    let naj = -1, najD = -Infinity;
    for (let i = 0; i < tri.length; i++) {
      const [a, b, c] = tri[i];
      const d = Math.min(orient(pts[a], pts[b], p), orient(pts[b], pts[c], p), orient(pts[c], pts[a], p));
      if (d > najD) { najD = d; naj = i; }
    }
    if (naj < 0 || najD <= 0) continue; // izven ali na robu: izpusti
    const [a, b, c] = tri[naj];
    tri.splice(naj, 1, [a, b, id], [b, c, id], [c, a, id]);
    delaunay(tri, pts, n);
  }
  delaunay(tri, pts, n);
  const upor = new Set(tri.flat());
  return { tri: ccw ? tri : tri.map(([a, b, c]) => [a, c, b]), uporabljene: upor };
}

function delaunay(tri, pts, nRob) {
  const jeRob = (a, b) => a < nRob && b < nRob && (Math.abs(a - b) === 1 || Math.abs(a - b) === nRob - 1);
  for (let pass = 0; pass < 50; pass++) {
    const E = new Map();
    tri.forEach((t, i) => { for (let k = 0; k < 3; k++) { const a = t[k], b = t[(k + 1) % 3]; const kl = a < b ? a * 1e7 + b : b * 1e7 + a; (E.get(kl) || E.set(kl, []).get(kl)).push([i, k]); } });
    let sprememba = false;
    const zaklenjen = new Set();
    for (const l of E.values()) {
      if (l.length !== 2) continue;
      const [[i, k], [j, q]] = l;
      if (zaklenjen.has(i) || zaklenjen.has(j)) continue;
      const a = tri[i][k], b = tri[i][(k + 1) % 3], c = tri[i][(k + 2) % 3], d = tri[j][(q + 2) % 3];
      if (jeRob(a, b)) continue;
      const A = pts[a], B = pts[b], C = pts[c], D = pts[d];
      // konveksen štirikotnik in D v očrtanem krogu (A, B, C)?
      if (orient(C, A, D) <= 1e-30 || orient(D, B, C) <= 1e-30) continue;
      const ax = A[0] - D[0], ay = A[1] - D[1], bx = B[0] - D[0], by = B[1] - D[1], cx = C[0] - D[0], cy = C[1] - D[1];
      const det = (ax * ax + ay * ay) * (bx * cy - cx * by) - (bx * bx + by * by) * (ax * cy - cx * ay) + (cx * cx + cy * cy) * (ax * by - bx * ay);
      if (det > 1e-24) {
        tri[i] = [c, a, d]; tri[j] = [c, d, b];
        zaklenjen.add(i); zaklenjen.add(j);
        sprememba = true;
      }
    }
    if (!sprememba) break;
  }
}

// Notranje točke: zamaknjena mreža s korakom h znotraj mnogokotnika, vsaj »rob« od roba.
export function notranjeTocke(poly, h, rob = 0.55 * h) {
  let mnx = Infinity, mny = Infinity, mxx = -Infinity, mxy = -Infinity;
  for (const p of poly) { mnx = Math.min(mnx, p[0]); mny = Math.min(mny, p[1]); mxx = Math.max(mxx, p[0]); mxy = Math.max(mxy, p[1]); }
  const out = [];
  const dy = h * 0.866;
  let vr = 0;
  for (let y = mny + dy / 2; y < mxy; y += dy, vr++) for (let x = mnx + (vr % 2 ? h / 2 : 0) + h / 4; x < mxx; x += h) {
    const p = [x, y];
    if (vMnogokotniku(p, poly) && razdaljaDoRoba(p, poly) > rob) out.push(p);
  }
  return out;
}

// ---------------------------------------------------------------------------------------------------------------
// Normale in senca okolice (AO) za spremenjene dele
// ---------------------------------------------------------------------------------------------------------------

// Shranjena normala, ki kaže na nasprotno stran kot ploskve (del je bil obrnjen navznoter), se obrne.
export function poravnajNormale(m) {
  const a = m.A.get("NORMAL");
  if (!a) return 0;
  // geometrijska normala izrisnega oglišča: vsota normal ploskev, ki ga uporabljajo (utež ploščina)
  const n = m.P.length / 3;
  const g = new Float64Array(n * 3);
  for (let f = 0; f < m.F.length; f += 3) {
    const nf = normalaPloskve(m, f / 3);
    for (let k = 0; k < 3; k++) { const i = m.F[f + k] * 3; g[i] += nf[0]; g[i + 1] += nf[1]; g[i + 2] += nf[2]; }
  }
  let st = 0;
  for (let i = 0; i < n; i++) {
    const l = Math.hypot(g[i * 3], g[i * 3 + 1], g[i * 3 + 2]);
    if (l < 1e-16) continue; // oglišče brez ploskev s ploščino
    if ((a.d[i * 3] * g[i * 3] + a.d[i * 3 + 1] * g[i * 3 + 1] + a.d[i * 3 + 2] * g[i * 3 + 2]) / l < -0.2) { a.d[i * 3] *= -1; a.d[i * 3 + 1] *= -1; a.d[i * 3 + 2] *= -1; st++; }
  }
  if (st) m.spremenjeno = true;
  return st;
}

// Hierarhija škatel (BVH) nad trikotniki: tri = Float64Array (9 na trikotnik).
export class BVH {
  constructor(tri) {
    this.tri = tri;
    const n = tri.length / 9;
    this.red = new Uint32Array(n);
    const cx = new Float64Array(n * 3);
    for (let i = 0; i < n; i++) { this.red[i] = i; for (let c = 0; c < 3; c++) cx[i * 3 + c] = (tri[i * 9 + c] + tri[i * 9 + 3 + c] + tri[i * 9 + 6 + c]) / 3; }
    this.vozl = []; // [minx, miny, minz, maxx, maxy, maxz, levo | -1, desno | začetek, konec]
    const zgradi = (od, doo) => {
      const b = [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity];
      const cb = [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity];
      for (let i = od; i < doo; i++) {
        const t = this.red[i];
        for (let k = 0; k < 3; k++) for (let c = 0; c < 3; c++) { const v = tri[t * 9 + k * 3 + c]; if (v < b[c]) b[c] = v; if (v > b[3 + c]) b[3 + c] = v; }
        for (let c = 0; c < 3; c++) { const v = cx[t * 3 + c]; if (v < cb[c]) cb[c] = v; if (v > cb[3 + c]) cb[3 + c] = v; }
      }
      const id = this.vozl.length;
      this.vozl.push(null);
      if (doo - od <= 4) { this.vozl[id] = [...b, -1, od, doo]; return id; }
      let os = 0;
      if (cb[4] - cb[1] > cb[3 + os] - cb[os]) os = 1;
      if (cb[5] - cb[2] > cb[3 + os] - cb[os]) os = 2;
      const sred = (cb[os] + cb[3 + os]) / 2;
      let i = od, j = doo - 1;
      while (i <= j) { if (cx[this.red[i] * 3 + os] < sred) i++; else { const x = this.red[i]; this.red[i] = this.red[j]; this.red[j] = x; j--; } }
      if (i === od || i === doo) i = (od + doo) >> 1;
      const l = zgradi(od, i), r = zgradi(i, doo);
      this.vozl[id] = [...b, l, r, 0];
      return id;
    };
    zgradi(0, n);
  }
  // Razdalja do najbližjega zadetka v (0, tmax) ali -1.
  zarek(o, d, tmax) {
    const tri = this.tri;
    const inv = [1 / d[0], 1 / d[1], 1 / d[2]];
    let best = tmax, zadet = false;
    const sklad = [0];
    while (sklad.length) {
      const v = this.vozl[sklad.pop()];
      let t0 = 0, t1 = best, ok = true;
      for (let c = 0; c < 3 && ok; c++) {
        let a = (v[c] - o[c]) * inv[c], b = (v[3 + c] - o[c]) * inv[c];
        if (a > b) { const x = a; a = b; b = x; }
        if (a > t0) t0 = a;
        if (b < t1) t1 = b;
        if (t0 > t1) ok = false;
      }
      if (!ok) continue;
      if (v[6] >= 0) { sklad.push(v[6], v[7]); continue; }
      for (let i = v[7]; i < v[8]; i++) {
        const k = this.red[i] * 9;
        const e1x = tri[k + 3] - tri[k], e1y = tri[k + 4] - tri[k + 1], e1z = tri[k + 5] - tri[k + 2];
        const e2x = tri[k + 6] - tri[k], e2y = tri[k + 7] - tri[k + 1], e2z = tri[k + 8] - tri[k + 2];
        const px = d[1] * e2z - d[2] * e2y, py = d[2] * e2x - d[0] * e2z, pz = d[0] * e2y - d[1] * e2x;
        const det = e1x * px + e1y * py + e1z * pz;
        if (Math.abs(det) < 1e-20) continue;
        const id = 1 / det;
        const tx = o[0] - tri[k], ty = o[1] - tri[k + 1], tz = o[2] - tri[k + 2];
        const u = (tx * px + ty * py + tz * pz) * id;
        if (u < 0 || u > 1) continue;
        const qx = ty * e1z - tz * e1y, qy = tz * e1x - tx * e1z, qz = tx * e1y - ty * e1x;
        const w = (d[0] * qx + d[1] * qy + d[2] * qz) * id;
        if (w < 0 || u + w > 1) continue;
        const t = (e2x * qx + e2y * qy + e2z * qz) * id;
        if (t > 0 && t < best) { best = t; zadet = true; }
      }
    }
    return zadet ? best : -1;
  }
}

function psevdo(seme) { // majhen determinističen generator (mulberry32)
  let a = seme >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function smeriPoloble(st, seme) { // kosinusno utežene smeri (z = normala), kot v izvozi-organe.py
  const rnd = psevdo(seme);
  const out = [];
  for (let i = 0; i < st; i++) {
    const u = (i + 0.5) / st, v = rnd();
    const r = Math.sqrt(u), f = 2 * Math.PI * (v + i * 0.618);
    out.push([r * Math.cos(f), r * Math.sin(f), Math.sqrt(Math.max(0, 1 - u))]);
  }
  return out;
}

// Senca okolice v COLOR_0 po postopku izvoza (scripts/atlas/izvozi-organe.py, _zapeci_ao in zapeci_odprtost):
// R = 0,22 + 0,78 · ao^1,15 (žarki do 0,14 × velikost organa), G = odprtost (delež dolgih žarkov, ki pobegnejo; samo
// z { odprtost: true }). Za vsa oglišča mreže m; ovire = BVH vseh delov modela.
export function zapeciSenco(m, bvh, velikost, { odprtost = false, zarkov = 14 } = {}) {
  const barva = m.A.get("COLOR_0"), nrm = m.A.get("NORMAL");
  if (!barva || !nrm) return;
  const n = m.P.length / 3;
  const smAO = smeriPoloble(zarkov, 7), smOd = smeriPoloble(10, 11);
  const dolzina = velikost * 0.14;
  const ao = new Float64Array(n), od = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const nn = [nrm.d[i * 3], nrm.d[i * 3 + 1], nrm.d[i * 3 + 2]];
    const t = pravokotno(nn, [0.37, 0.91, 0.19]), b = v3.cross(nn, t);
    const p = [m.P[i * 3] + nn[0] * velikost * 1e-4, m.P[i * 3 + 1] + nn[1] * velikost * 1e-4, m.P[i * 3 + 2] + nn[2] * velikost * 1e-4];
    let zad = 0;
    for (const d of smAO) {
      const w = [t[0] * d[0] + b[0] * d[1] + nn[0] * d[2], t[1] * d[0] + b[1] * d[1] + nn[1] * d[2], t[2] * d[0] + b[2] * d[1] + nn[2] * d[2]];
      const h = bvh.zarek(p, w, dolzina);
      if (h >= 0) zad += 1 - (h / dolzina) ** 2 * 0.6;
    }
    ao[i] = 1 - zad / zarkov;
    if (odprtost) {
      const p2 = [m.P[i * 3] + nn[0] * velikost * 2e-4, m.P[i * 3 + 1] + nn[1] * velikost * 2e-4, m.P[i * 3 + 2] + nn[2] * velikost * 2e-4];
      let ven = 0;
      for (const d of smOd) {
        const w = [t[0] * d[0] + b[0] * d[1] + nn[0] * d[2], t[1] * d[0] + b[1] * d[1] + nn[1] * d[2], t[2] * d[0] + b[2] * d[1] + nn[2] * d[2]];
        if (bvh.zarek(p2, w, velikost * 2) < 0) ven++;
      }
      od[i] = ven / smOd.length;
    }
  }
  // glajenje po robovih (izrisna oglišča): AO enkrat, odprtost dvakrat
  const sos = Array.from({ length: n }, () => new Set());
  for (let f = 0; f < m.F.length; f += 3) for (let k = 0; k < 3; k++) { const a = m.F[f + k], c = m.F[f + (k + 1) % 3]; sos[a].add(c); sos[c].add(a); }
  const gladi = (x) => { const y = new Float64Array(n); for (let i = 0; i < n; i++) { let s = 0; for (const j of sos[i]) s += x[j]; y[i] = sos[i].size ? 0.5 * x[i] + (0.5 * s) / sos[i].size : x[i]; } return y; };
  const ao2 = gladi(ao);
  const od2 = odprtost ? gladi(gladi(od)) : null;
  for (let i = 0; i < n; i++) {
    barva.d[i * barva.n] = 0.22 + 0.78 * Math.max(0, Math.min(1, ao2[i])) ** 1.15;
    if (odprtost && barva.n > 1) barva.d[i * barva.n + 1] = od2[i];
  }
  m.spremenjeno = true;
}

// Najbližja točka na trikotniku (a, b, c) do p (Ericson, Real-Time Collision Detection).
export function najblizjaNaTrikotniku(p, a, b, c) {
  const ab = v3.sub(b, a), ac = v3.sub(c, a), ap = v3.sub(p, a);
  const d1 = v3.dot(ab, ap), d2 = v3.dot(ac, ap);
  if (d1 <= 0 && d2 <= 0) return a;
  const bp = v3.sub(p, b);
  const d3 = v3.dot(ab, bp), d4 = v3.dot(ac, bp);
  if (d3 >= 0 && d4 <= d3) return b;
  const vc = d1 * d4 - d3 * d2;
  if (vc <= 0 && d1 >= 0 && d3 <= 0) return v3.add(a, v3.mul(ab, d1 / (d1 - d3)));
  const cp = v3.sub(p, c);
  const d5 = v3.dot(ab, cp), d6 = v3.dot(ac, cp);
  if (d6 >= 0 && d5 <= d6) return c;
  const vb = d5 * d2 - d1 * d6;
  if (vb <= 0 && d2 >= 0 && d6 <= 0) return v3.add(a, v3.mul(ac, d2 / (d2 - d6)));
  const va = d3 * d6 - d5 * d4;
  if (va <= 0 && d4 - d3 >= 0 && d5 - d6 >= 0) return v3.add(b, v3.mul(v3.sub(c, b), (d4 - d3) / (d4 - d3 + (d5 - d6))));
  const den = 1 / (va + vb + vc);
  return v3.add(a, v3.add(v3.mul(ab, vb * den), v3.mul(ac, vc * den)));
}

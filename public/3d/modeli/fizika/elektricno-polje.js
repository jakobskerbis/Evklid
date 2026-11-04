// Električno polje (FIZ): silnice in ekvipotencialne ploskve, izračunane iz Coulombovega zakona.
// Polje je vsota prispevkov točkastih nabojev (superpozicija); kondenzatorjevi plošči sta mreži točkastih nabojev.
// Silnice so integrirane z RK4 s prilagodljivim korakom iz začetnih točk; število silnic je sorazmerno z nabojem
// (Faradayevo pravilo). Ekvipotencialne ploskve so izračunane z lastnimi »marching tetrahedra« na mreži potenciala V.
// Enote: 1 enota modela = 10 cm (premer enotske krogle = 20 cm); naboji v nC; fizika v SI.

export const info = {
  id: "elektricno-polje",
  naslov: "Električno polje",
  podrocje: "fizika",
  predmet: "FIZ",
  opis:
    "Silnice in ekvipotencialne ploskve točkastega naboja, dipola, dveh enakih nabojev in ploščatega kondenzatorja, " +
    "izračunane iz Coulombovega zakona. Preizkusni naboj pokaže silo F = q·E in kako ga polje pospeši " +
    "(poenostavitve: naboji mirujejo, teža preizkusnega naboja je zanemarjena, plošči sta enakomerno nabiti).",
  merilo: { m: 0.2, oznaka: "20 cm" },
  poskusi: "Vklopi preizkusni naboj in ga spusti; nato vklopi ekvipotencialne ploskve in preveri, da so pravokotne na silnice.",
};

// ---------------------------------------------------------------- fizika (SI) --
export const K = 8.9875517923e9; // N m² / C²
export const EPS0 = 8.8541878128e-12; // F/m
export const ENOTA = 0.1; // m na enoto modela
export const R_POGLED = 0.88; // silnice se končajo na robu vidnega polja (enote)
export const R_KROGLE = 0.06; // polmer kroglice naboja (enote) = 6 mm
export const SILNIC_NA_NC = 6; // Faradayevo pravilo: 6 silnic na 1 nC
export const Q0 = 1e-10; // preizkusni naboj 0,1 nC
export const MASA = 1e-4; // masa preizkusnega naboja 0,1 g
// Plošči 12 cm × 12 cm z razmikom 1,4 cm: v središču je E ≈ 0,89 σ/ε₀ (robni pojav); pri večjem razmiku bi bilo precej manj.
export const PLOSCA = { x: 0.07, pol: 0.6, deb: 0.02, n: 20 }; // enote: plošči pri x = ∓0,7 cm
const R_TEST = 0.03; // polmer kroglice preizkusnega naboja (enote)
const SILA_NA_ENOTO = 2e-5; // puščica: 1 enota (10 cm) ≙ 20 µN, torej 1 cm ≙ 2 µN
const L_SILA_MAX = 0.5;

/** Točkasti naboji postavitve v SI ({q v C, x/y/z v m}). */
export function naboji(postavitev, qnC = 5, predznak = 1) {
  const q = qnC * 1e-9;
  if (postavitev === "tocka") return [{ q: (predznak < 0 ? -1 : 1) * q, x: 0, y: 0, z: 0 }];
  if (postavitev === "dipol") return [{ q, x: -0.04, y: 0, z: 0 }, { q: -q, x: 0.04, y: 0, z: 0 }];
  if (postavitev === "enaka") return [{ q, x: -0.04, y: 0, z: 0 }, { q, x: 0.04, y: 0, z: 0 }];
  const out = [], n = PLOSCA.n, a = PLOSCA.pol * ENOTA, dq = q / (n * n);
  for (const [s, x] of [[1, -PLOSCA.x * ENOTA], [-1, PLOSCA.x * ENOTA]])
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        out.push({ q: s * dq, x, y: -a + ((i + 0.5) * 2 * a) / n, z: -a + ((j + 0.5) * 2 * a) / n });
  return out;
}

/** Jakost električnega polja E (N/C) v točki (m): vsota Coulombovih prispevkov. */
export function poljeE(nab, x, y, z, out = [0, 0, 0]) {
  let ex = 0, ey = 0, ez = 0;
  for (let i = 0; i < nab.length; i++) {
    const c = nab[i], dx = x - c.x, dy = y - c.y, dz = z - c.z;
    const r2 = dx * dx + dy * dy + dz * dz + 1e-14;
    const f = (K * c.q) / (r2 * Math.sqrt(r2));
    ex += f * dx; ey += f * dy; ez += f * dz;
  }
  out[0] = ex; out[1] = ey; out[2] = ez;
  return out;
}

/** Električni potencial V (V) v točki (m), nič v neskončnosti. */
export function potencial(nab, x, y, z) {
  let v = 0;
  for (let i = 0; i < nab.length; i++) {
    const c = nab[i], dx = x - c.x, dy = y - c.y, dz = z - c.z;
    v += (K * c.q) / Math.sqrt(dx * dx + dy * dy + dz * dz + 1e-14);
  }
  return v;
}

const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const len3 = (a) => Math.hypot(a[0], a[1], a[2]);

/**
 * Sledi silnici iz začetne točke: RK4 po enotski smeri polja, korak se prilagaja ukrivljenosti
 * (razpolovi, če se smer v koraku zasuka za več kot ~6°, poveča, če je skoraj ravna).
 * polje(p) → vektor; smer +1 = vzdolž polja, −1 = proti polju. Vrne {tocke, konec, zaprta, dolzina}.
 */
export function sledi(polje, zacetek, o = {}) {
  const smer = o.smer ?? 1, hmin = o.hmin ?? 0.0015, hmax = o.hmax ?? 0.03, maxDol = o.maxDolzina ?? 8;
  const maxN = o.maxKorakov ?? 5000;
  let h = o.h ?? 0.01;
  const p = zacetek.slice();
  const tocke = [p.slice()];
  let dol = 0, konec = null, zaprta = false;
  const t = [0, 0, 0];
  const smerV = (x, y, z) => {
    t[0] = x; t[1] = y; t[2] = z;
    const v = polje(t), m = Math.hypot(v[0], v[1], v[2]);
    if (!(m > 0) || !Number.isFinite(m)) return null;
    return [(smer * v[0]) / m, (smer * v[1]) / m, (smer * v[2]) / m];
  };
  for (let n = 0; n < maxN; n++) {
    const k1 = smerV(p[0], p[1], p[2]);
    if (!k1) { konec = { razlog: "nicla" }; break; }
    let pn = null, hNaslednji = h;
    for (;;) {
      const k2 = smerV(p[0] + (h / 2) * k1[0], p[1] + (h / 2) * k1[1], p[2] + (h / 2) * k1[2]);
      const k3 = k2 && smerV(p[0] + (h / 2) * k2[0], p[1] + (h / 2) * k2[1], p[2] + (h / 2) * k2[2]);
      const k4 = k3 && smerV(p[0] + h * k3[0], p[1] + h * k3[1], p[2] + h * k3[2]);
      if (!k4) break;
      const c = dot3(k1, k4);
      if (c < 0.995 && h > hmin) { h = Math.max(hmin, h / 2); continue; }
      if (c < 0) break; // smer se obrne: ničelna točka polja
      pn = [0, 1, 2].map((i) => p[i] + (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
      hNaslednji = c > 0.9995 ? Math.min(hmax, h * 1.5) : h;
      break;
    }
    if (!pn) { konec = { razlog: "nicla" }; break; }
    if (o.zapri && dol > (o.minZapri ?? 0.2) && razdaljaDoDaljice(zacetek, p, pn) < (o.tolZapri ?? 0.008)) {
      tocke.push(zacetek.slice()); zaprta = true; break;
    }
    dol += h; p[0] = pn[0]; p[1] = pn[1]; p[2] = pn[2];
    tocke.push(pn);
    const s = o.ustavi && o.ustavi(pn);
    if (s) { konec = s; break; }
    if (dol > maxDol) { konec = { razlog: "dolzina" }; break; }
    h = hNaslednji;
  }
  return { tocke, konec, zaprta, dolzina: dol };
}

function razdaljaDoDaljice(c, a, b) {
  const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  const l2 = dot3(ab, ab) || 1e-30;
  const t = Math.max(0, Math.min(1, dot3(ab, ac) / l2));
  return Math.hypot(ac[0] - t * ab[0], ac[1] - t * ab[1], ac[2] - t * ab[2]);
}

/** Zadnjo točko, ki je ušla iz vidnega polja, premakne točno na rob krogle s polmerom R. */
function obreziNaRob(tocke, R) {
  const n = tocke.length;
  if (n < 2) return;
  const a = tocke[n - 2], b = tocke[n - 1];
  if (len3(b) <= R) return;
  let lo = 0, hi = 1;
  for (let i = 0; i < 30; i++) {
    const m = (lo + hi) / 2;
    if (Math.hypot(a[0] + m * (b[0] - a[0]), a[1] + m * (b[1] - a[1]), a[2] + m * (b[2] - a[2])) > R) hi = m; else lo = m;
  }
  tocke[n - 1] = [a[0] + lo * (b[0] - a[0]), a[1] + lo * (b[1] - a[1]), a[2] + lo * (b[2] - a[2])];
}

/** Fibonaccijeva krogla: n skoraj enakomerno razporejenih smeri (os x). */
export function fibonacci(n) {
  const out = [], zk = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const x = 1 - (2 * (i + 0.5)) / n, r = Math.sqrt(Math.max(0, 1 - x * x)), f = zk * i;
    out.push([x, r * Math.cos(f), r * Math.sin(f)]);
  }
  return out;
}

const vSvet = (c) => [c.x / ENOTA, c.y / ENOTA, c.z / ENOTA];

/** Silnice postavitve v enotah modela, urejene v smeri polja. Vrne [{tocke, jakost}] (jakost = |E| v N/C). */
export function silnice(postavitev, qnC, predznak = 1) {
  const nab = naboji(postavitev, qnC, predznak);
  const tmp = [0, 0, 0];
  const polje = (p) => poljeE(nab, p[0] * ENOTA, p[1] * ENOTA, p[2] * ENOTA, tmp);
  const crte = [];
  const dodaj = (tocke) => {
    crte.push({ tocke, jakost: tocke.map((p) => len3(poljeE(nab, p[0] * ENOTA, p[1] * ENOTA, p[2] * ENOTA, [0, 0, 0]))) });
  };
  if (postavitev !== "kondenzator") {
    const ustavi = (p) => {
      if (len3(p) > R_POGLED) return { razlog: "rob" };
      for (const c of nab) {
        const s = vSvet(c);
        if (Math.hypot(p[0] - s[0], p[1] - s[1], p[2] - s[2]) < 0.035) return { razlog: "naboj", znak: Math.sign(c.q) };
      }
      return null;
    };
    for (const c of nab) {
      const n = Math.round(SILNIC_NA_NC * Math.abs(c.q) * 1e9), s = vSvet(c), plus = c.q > 0;
      for (const d of fibonacci(n)) {
        const dd = plus ? d : [-d[0], d[1], d[2]]; // zrcalno pri negativnem naboju (simetrija dipola)
        const zac = [s[0] + 0.04 * dd[0], s[1] + 0.04 * dd[1], s[2] + 0.04 * dd[2]];
        const r = sledi(polje, zac, { smer: plus ? 1 : -1, ustavi });
        if (!plus && r.konec && r.konec.razlog === "naboj" && r.konec.znak > 0) continue; // že narisana iz + naboja
        if (r.konec && r.konec.razlog === "rob") obreziNaRob(r.tocke, R_POGLED);
        dodaj(plus ? r.tocke : r.tocke.reverse());
      }
    }
    return crte;
  }
  // Kondenzator: silnice iz pozitivne plošče; v reži m × m enakomerno, ostale z roba (delež pretoka po Gaussu).
  const P = PLOSCA, pol = P.pol, xp = -P.x;
  const N = Math.round(SILNIC_NA_NC * qnC);
  const delez = delezPretokaVRezi();
  const m = Math.max(1, Math.round(Math.sqrt(N * delez)));
  const nRob = Math.max(0, N - m * m);
  const ustavi = (p) => {
    if (len3(p) > R_POGLED) return { razlog: "rob" };
    for (const [x, znak] of [[-P.x, 1], [P.x, -1]])
      if (Math.abs(p[0] - x) < P.deb / 2 + 0.03 && Math.abs(p[1]) < pol + 0.01 && Math.abs(p[2]) < pol + 0.01)
        return { razlog: "plosca", znak };
    return null;
  };
  const naPlosco = (p, x) => [
    Math.min(x + P.deb / 2, Math.max(x - P.deb / 2, p[0])),
    Math.min(pol, Math.max(-pol, p[1])),
    Math.min(pol, Math.max(-pol, p[2])),
  ];
  const semena = [];
  for (let i = 0; i < m; i++)
    for (let j = 0; j < m; j++)
      semena.push([xp + P.deb / 2 + 0.05, -pol + ((i + 0.5) * 2 * pol) / m, -pol + ((j + 0.5) * 2 * pol) / m]);
  const a = pol + 0.02, obseg = 8 * a;
  for (let k = 0; k < nRob; k++) {
    let s = ((k + 0.5) * obseg) / nRob, y, z;
    if (s < 2 * a) { y = a; z = -a + s; } else if ((s -= 2 * a) < 2 * a) { y = a - s; z = a; }
    else if ((s -= 2 * a) < 2 * a) { y = -a; z = a - s; } else { s -= 2 * a; y = -a + s; z = -a; }
    semena.push([xp, y, z]);
  }
  for (const [plus, zrcalo] of [[true, 1], [false, -1]]) {
    for (const s0 of semena) {
      const zac = [zrcalo * s0[0], s0[1], s0[2]];
      const r = sledi(polje, zac, { smer: plus ? 1 : -1, ustavi });
      if (!plus && r.konec && r.konec.razlog === "plosca" && r.konec.znak > 0) continue;
      const t = r.tocke;
      t.unshift(naPlosco(zac, zrcalo * xp));
      if (r.konec && r.konec.razlog === "plosca") t.push(naPlosco(t[t.length - 1], r.konec.znak > 0 ? xp : -xp));
      if (r.konec && r.konec.razlog === "rob") obreziNaRob(t, R_POGLED);
      dodaj(plus ? t : t.reverse());
    }
  }
  return crte;
}

let _delez = null;
/** Delež električnega pretoka pozitivne plošče, ki gre skozi režo (numerično; celota je Q/ε₀ po Gaussu). */
export function delezPretokaVRezi() {
  if (_delez !== null) return _delez;
  const nab = naboji("kondenzator", 1, 1), P = PLOSCA, n = 24, a = P.pol * ENOTA, x = (-P.x + P.deb / 2 + 0.05) * ENOTA;
  const dA = (2 * a / n) ** 2, e = [0, 0, 0];
  let fi = 0;
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++) fi += poljeE(nab, x, -a + ((i + 0.5) * 2 * a) / n, -a + ((j + 0.5) * 2 * a) / n, e)[0] * dA;
  _delez = Math.min(1, fi / (1e-9 / EPS0));
  return _delez;
}

// ---------------------------------------------------------------- izpis --
const SUP = { "-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
export function dec(x, d) {
  return (x < 0 ? "−" : "") + Math.abs(x).toFixed(d).replace(".", ",");
}
export function lepo(x) {
  const a = Math.abs(x);
  return dec(x, a >= 10 ? 0 : a >= 1 ? 1 : 2);
}
/** Znanstveni zapis z decimalno vejico: 36000 → »3,6 · 10⁴«. */
export function znanstveno(x, mest = 2) {
  if (!x) return "0";
  let e = Math.floor(Math.log10(Math.abs(x)));
  if (e >= -1 && e < 3) return dec(x, Math.max(0, mest - 1 - e));
  let m = x / 10 ** e;
  if (Math.abs(+m.toFixed(mest - 1)) >= 10) { m /= 10; e++; }
  return `${dec(m, mest - 1)} · 10${String(e).split("").map((c) => SUP[c]).join("")}`;
}
function silaBesedilo(F) {
  if (F >= 1e-6) return `${lepo(F * 1e6)} µN`;
  return `${lepo(F * 1e9)} nN`;
}

// ---------------------------------------------------------------- gradnja --
const BARVE = {
  plus: "#e5564d", minus: "#4f7ff0", znak: "#f7f8fb", preizkusni: "#f5b942", sila: "#6fe0a0",
  ploscaPlus: "#b8564f", ploscaMinus: "#5574c4",
  silnicaTemna: "#5a3210", silnicaSrednja: "#ec9230", silnicaSvetla: "#ffeec4", ozadje: "#0b0f16",
  ekviPlus: "#ff8c7c", ekviMinus: "#88a8ff", ekviNic: "#dfe4ee",
};
const POSTAVITVE = [
  ["tocka", "Točkasti naboj"],
  ["dipol", "Dipol (+q in −q)"],
  ["enaka", "Dva enaka naboja"],
  ["kondenzator", "Ploščati kondenzator"],
];

function smoothstep(a, b, x) {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

/** Združi več geometrij (brez indeksov) v eno: pozicije in normale. */
function zdruzi(THREE, geos) {
  const ne = geos.map((g) => (g.index ? g.toNonIndexed() : g));
  let n = 0;
  for (const g of ne) n += g.attributes.position.count;
  const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3);
  let o = 0;
  for (const g of ne) {
    pos.set(g.attributes.position.array, o * 3);
    nor.set(g.attributes.normal.array, o * 3);
    o += g.attributes.position.count;
  }
  for (const g of geos) g.dispose();
  for (const g of ne) g.dispose();
  const out = new THREE.BufferGeometry();
  out.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  out.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
  return out;
}

/** Osvetljena cevka, ki tudi sama sveti (emisija = lastna barva · sij), da so silnice vidne na temnem ozadju. */
function sijocMaterial(THREE, sij, o = {}) {
  const m = new THREE.MeshStandardMaterial({ roughness: 0.3, metalness: 0, ...o });
  m.onBeforeCompile = (sh) => {
    sh.fragmentShader = sh.fragmentShader.replace("#include <emissivemap_fragment>", `#include <emissivemap_fragment>\n\ttotalEmissiveRadiance += diffuseColor.rgb * ${sij.toFixed(3)};`);
  };
  m.customProgramCacheKey = () => `sij${sij}`;
  return m;
}

/** Barvni prelivi v treh postankih (šibko → srednje → močno polje), t ∈ [0, 1]. */
function preliv(out, c0, c1, c2, t) {
  return t < 0.55 ? out.copy(c0).lerp(c1, t / 0.55) : out.copy(c1).lerp(c2, ((t - 0.55) / 0.45) ** 1.5);
}

/** Cevke vzdolž silnic (ena geometrija, barve po ogliščih; barva() lahko vrne še 5. člen: faktor debeline). */
function cevi(THREE, crte, polmer, rad, barva) {
  let nv = 0, ni = 0;
  for (const c of crte) if (c.tocke.length > 1) { nv += c.tocke.length * rad; ni += (c.tocke.length - 1) * rad * 6; }
  const pos = new Float32Array(nv * 3), nor = new Float32Array(nv * 3), col = new Float32Array(nv * 4);
  const idx = nv > 65535 ? new Uint32Array(ni) : new Uint16Array(ni);
  let v = 0, ii = 0;
  for (const c of crte) {
    const P = c.tocke, n = P.length;
    if (n < 2) continue;
    let N = null;
    const v0 = v;
    for (let i = 0; i < n; i++) {
      const a = P[Math.max(0, i - 1)], b = P[Math.min(n - 1, i + 1)];
      let T = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
      const lt = len3(T) || 1;
      T = [T[0] / lt, T[1] / lt, T[2] / lt];
      if (!N) { const ref = Math.abs(T[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0]; const d = dot3(ref, T); N = [ref[0] - d * T[0], ref[1] - d * T[1], ref[2] - d * T[2]]; }
      else { const d = dot3(N, T); N = [N[0] - d * T[0], N[1] - d * T[1], N[2] - d * T[2]]; }
      let ln = len3(N);
      if (ln < 1e-6) { const ref = Math.abs(T[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0]; const d = dot3(ref, T); N = [ref[0] - d * T[0], ref[1] - d * T[1], ref[2] - d * T[2]]; ln = len3(N); }
      N = [N[0] / ln, N[1] / ln, N[2] / ln];
      const B = [T[1] * N[2] - T[2] * N[1], T[2] * N[0] - T[0] * N[2], T[0] * N[1] - T[1] * N[0]];
      const [r, g, bb, al = 1, deb = 1] = barva(c, i);
      for (let k = 0; k < rad; k++) {
        const f = (k / rad) * Math.PI * 2, cf = Math.cos(f), sf = Math.sin(f), cs = cf * polmer * deb, sn = sf * polmer * deb;
        nor[v * 3] = cf * N[0] + sf * B[0]; nor[v * 3 + 1] = cf * N[1] + sf * B[1]; nor[v * 3 + 2] = cf * N[2] + sf * B[2];
        pos[v * 3] = P[i][0] + cs * N[0] + sn * B[0];
        pos[v * 3 + 1] = P[i][1] + cs * N[1] + sn * B[1];
        pos[v * 3 + 2] = P[i][2] + cs * N[2] + sn * B[2];
        col[v * 4] = r; col[v * 4 + 1] = g; col[v * 4 + 2] = bb; col[v * 4 + 3] = al;
        v++;
      }
    }
    for (let i = 0; i < n - 1; i++)
      for (let k = 0; k < rad; k++) {
        const a = v0 + i * rad + k, b = v0 + i * rad + ((k + 1) % rad), c2 = a + rad, d = b + rad;
        idx[ii++] = a; idx[ii++] = c2; idx[ii++] = b;
        idx[ii++] = b; idx[ii++] = c2; idx[ii++] = d;
      }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
  g.setAttribute("color", new THREE.BufferAttribute(col, 4));
  g.setIndex(new THREE.BufferAttribute(idx, 1));
  g.computeBoundingSphere();
  return g;
}

/** Položaji puščic vzdolž silnic na vsakih `korak` dolžine. */
function strelice(crte, korak, zacetek, preskoci) {
  const out = [];
  crte.forEach((c, ci) => {
    const P = c.tocke;
    let s = 0, cilj = zacetek;
    for (let i = 1; i < P.length; i++) {
      const a = P[i - 1], b = P[i], d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], l = len3(d);
      while (l > 0 && s + l >= cilj) {
        const t = (cilj - s) / l, p = [a[0] + t * d[0], a[1] + t * d[1], a[2] + t * d[2]];
        if (!preskoci(p, i, P)) out.push({ p, d: [d[0] / l, d[1] / l, d[2] / l], ci, i });
        cilj += korak;
      }
      s += l;
    }
  });
  return out;
}

/**
 * Marching tetrahedra: trikotniki ploskev V = raven na mreži n³ v kocki [−R, R]³.
 * Vrne [{a, b, c, na, nb, nc, li}]: oglišča in normale (smer E = −∇V, iz mreže), trikotnik je obrnjen tako,
 * da njegova normala kaže v smeri E. simetrijaYZ: V(x, ±y, ±z) je enak, zato računamo le četrtino mreže.
 */
export function izoploskve(Vfn, ravni, n, R, simetrijaYZ = false) {
  const h = (2 * R) / (n - 1), N = n, NN = N * N;
  const val = new Float64Array(N * NN);
  const pol = (N - 1) / 2;
  for (let k = 0; k < N; k++)
    for (let j = 0; j < N; j++)
      for (let i = 0; i < N; i++) {
        if (simetrijaYZ && (j > pol || k > pol)) continue;
        val[i + N * (j + N * k)] = Vfn(-R + i * h, -R + j * h, -R + k * h);
      }
  if (simetrijaYZ)
    for (let k = 0; k < N; k++)
      for (let j = 0; j < N; j++) {
        if (j <= pol && k <= pol) continue;
        const jj = j > pol ? N - 1 - j : j, kk = k > pol ? N - 1 - k : k;
        for (let i = 0; i < N; i++) val[i + N * (j + N * k)] = val[i + N * (jj + N * kk)];
      }
  const V = (i, j, k) => val[i + N * (j + N * k)];
  // E = −∇V s centralnimi diferencami
  const grad = (i, j, k, out) => {
    const i0 = Math.max(0, i - 1), i1 = Math.min(N - 1, i + 1), j0 = Math.max(0, j - 1), j1 = Math.min(N - 1, j + 1), k0 = Math.max(0, k - 1), k1 = Math.min(N - 1, k + 1);
    out[0] = -(V(i1, j, k) - V(i0, j, k)) / ((i1 - i0) * h);
    out[1] = -(V(i, j1, k) - V(i, j0, k)) / ((j1 - j0) * h);
    out[2] = -(V(i, j, k1) - V(i, j, k0)) / ((k1 - k0) * h);
    return out;
  };
  const TET = [[0, 1, 3, 7], [0, 1, 5, 7], [0, 2, 3, 7], [0, 2, 6, 7], [0, 4, 5, 7], [0, 4, 6, 7]];
  const out = [];
  const cv = new Float64Array(8), cp = [], cg = [];
  for (let c = 0; c < 8; c++) { cp.push([0, 0, 0]); cg.push([0, 0, 0]); }
  const rob = (a, b, sa, sb) => {
    const t = sa / (sa - sb), pa = cp[a], pb = cp[b], ga = cg[a], gb = cg[b];
    return [
      [pa[0] + t * (pb[0] - pa[0]), pa[1] + t * (pb[1] - pa[1]), pa[2] + t * (pb[2] - pa[2])],
      [ga[0] + t * (gb[0] - ga[0]), ga[1] + t * (gb[1] - ga[1]), ga[2] + t * (gb[2] - ga[2])],
    ];
  };
  const dodaj = (A, B, C, li) => {
    const a = A[0], b = B[0], c = C[0];
    const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    const ng = [ab[1] * ac[2] - ab[2] * ac[1], ab[2] * ac[0] - ab[0] * ac[2], ab[0] * ac[1] - ab[1] * ac[0]];
    if (len3(ng) < 1e-12) return;
    const e = [A[1][0] + B[1][0] + C[1][0], A[1][1] + B[1][1] + C[1][1], A[1][2] + B[1][2] + C[1][2]];
    if (dot3(ng, e) >= 0) out.push({ a, b, c, na: A[1], nb: B[1], nc: C[1], li });
    else out.push({ a, b: c, c: b, na: A[1], nb: C[1], nc: B[1], li });
  };
  for (let k = 0; k < N - 1; k++)
    for (let j = 0; j < N - 1; j++)
      for (let i = 0; i < N - 1; i++) {
        let mn = Infinity, mx = -Infinity;
        for (let c = 0; c < 8; c++) {
          const v = V(i + (c & 1), j + ((c >> 1) & 1), k + ((c >> 2) & 1));
          cv[c] = v; if (v < mn) mn = v; if (v > mx) mx = v;
        }
        let ima = false;
        for (const L of ravni) if (mn <= L && mx >= L) ima = true;
        if (!ima) continue;
        for (let c = 0; c < 8; c++) {
          const di = c & 1, dj = (c >> 1) & 1, dk = (c >> 2) & 1;
          cp[c][0] = -R + (i + di) * h; cp[c][1] = -R + (j + dj) * h; cp[c][2] = -R + (k + dk) * h;
          grad(i + di, j + dj, k + dk, cg[c]);
        }
        for (let li = 0; li < ravni.length; li++) {
          const L = ravni[li];
          if (mn > L || mx < L) continue;
          for (const t of TET) {
            const s = [cv[t[0]] - L, cv[t[1]] - L, cv[t[2]] - L, cv[t[3]] - L];
            const poz = [], neg = [];
            for (let q = 0; q < 4; q++) (s[q] > 0 ? poz : neg).push(q);
            if (poz.length === 0 || poz.length === 4) continue;
            const e = (x, y) => rob(t[x], t[y], s[x], s[y]);
            if (poz.length === 1 || poz.length === 3) {
              const sam = poz.length === 1 ? poz[0] : neg[0], ost = poz.length === 1 ? neg : poz;
              dodaj(e(sam, ost[0]), e(sam, ost[1]), e(sam, ost[2]), li);
            } else {
              const [a, b] = poz, [c2, d] = neg;
              const e1 = e(a, c2), e2 = e(a, d), e3 = e(b, d), e4 = e(b, c2);
              dodaj(e1, e2, e3, li); dodaj(e1, e3, e4, li);
            }
          }
        }
      }
  return out;
}

/**
 * Marching squares: izolinije V = raven v ravnini z = 0 (kvadrat [−R, R]²), sestavljene v lomljenke.
 * Vrne [{tocke, li}]. Sedlaste celice razreši vrednost v središču celice.
 */
export function izolinije(Vfn, ravni, M, R) {
  const h = (2 * R) / M, n = M + 1;
  const val = new Float64Array(n * n);
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) val[i + n * j] = Vfn(-R + i * h, -R + j * h);
  const out = [];
  ravni.forEach((L, li) => {
    const seg = []; // [robA, robB]
    const tocka = new Map();
    const robId = (i, j, smer) => 2 * (i + n * j) + smer; // smer 0: vodoraven rob (i,j)-(i+1,j), 1: navpičen (i,j)-(i,j+1)
    const tockaRoba = (id) => {
      if (tocka.has(id)) return tocka.get(id);
      const smer = id & 1, k = id >> 1, i = k % n, j = (k - i) / n;
      const a = val[i + n * j] - L, b = (smer ? val[i + n * (j + 1)] : val[i + 1 + n * j]) - L;
      const t = a / (a - b);
      const p = smer ? [-R + i * h, -R + (j + t) * h, 0] : [-R + (i + t) * h, -R + j * h, 0];
      tocka.set(id, p);
      return p;
    };
    for (let j = 0; j < M; j++)
      for (let i = 0; i < M; i++) {
        const v0 = val[i + n * j] - L, v1 = val[i + 1 + n * j] - L, v2 = val[i + 1 + n * (j + 1)] - L, v3 = val[i + n * (j + 1)] - L;
        const c = (v0 > 0 ? 1 : 0) | (v1 > 0 ? 2 : 0) | (v2 > 0 ? 4 : 0) | (v3 > 0 ? 8 : 0);
        if (c === 0 || c === 15) continue;
        const e0 = robId(i, j, 0), e1 = robId(i + 1, j, 1), e2 = robId(i, j + 1, 0), e3 = robId(i, j, 1);
        const sredina = (v0 + v1 + v2 + v3) / 4 > 0;
        const T = {
          1: [[e3, e0]], 2: [[e0, e1]], 3: [[e3, e1]], 4: [[e1, e2]], 6: [[e0, e2]], 7: [[e3, e2]], 8: [[e2, e3]],
          9: [[e2, e0]], 11: [[e2, e1]], 12: [[e1, e3]], 13: [[e1, e0]], 14: [[e0, e3]],
          5: sredina ? [[e3, e2], [e1, e0]] : [[e3, e0], [e1, e2]],
          10: sredina ? [[e0, e3], [e2, e1]] : [[e0, e1], [e2, e3]],
        }[c];
        for (const sg of T) seg.push(sg);
      }
    const poRobu = new Map();
    seg.forEach(([a, b], k) => { for (const e of [a, b]) { if (!poRobu.has(e)) poRobu.set(e, []); poRobu.get(e).push(k); } });
    const rabljen = new Uint8Array(seg.length);
    for (let k0 = 0; k0 < seg.length; k0++) {
      if (rabljen[k0]) continue;
      rabljen[k0] = 1;
      const veriga = [seg[k0][0], seg[k0][1]];
      for (const naprej of [true, false]) {
        for (;;) {
          const konec = naprej ? veriga[veriga.length - 1] : veriga[0];
          const k = (poRobu.get(konec) || []).find((x) => !rabljen[x]);
          if (k === undefined) break;
          rabljen[k] = 1;
          const nov = seg[k][0] === konec ? seg[k][1] : seg[k][0];
          if (naprej) veriga.push(nov); else veriga.unshift(nov);
        }
      }
      out.push({ tocke: veriga.map(tockaRoba), li });
    }
  });
  return out;
}

/** Odreže trikotnik na polprostor z ≤ 0 (Sutherland–Hodgman); vrne 0–2 trikotnika [[p, n], …]. */
function odreziZ(tri) {
  const izhod = [];
  for (let i = 0; i < 3; i++) {
    const A = tri[i], B = tri[(i + 1) % 3], za = A[0][2], zb = B[0][2];
    if (za <= 0) izhod.push(A);
    if ((za <= 0) !== (zb <= 0)) {
      const t = za / (za - zb), m = (u, v) => u.map((x, k) => x + t * (v[k] - x));
      izhod.push([m(A[0], B[0]), m(A[1], B[1])]);
    }
  }
  const out = [];
  for (let i = 1; i + 1 < izhod.length; i++) out.push([izhod[0], izhod[i], izhod[i + 1]]);
  return out;
}

// Velikost točke (PointsMaterial, sizeAttenuation) je v enotah višine zaslona/razdalje; za premer w v sceni pri vidnem kotu ~40° je size ≈ w / tan(20°).
const TOCKA_V_SVET = 2.75;

export function zgradi(THREE, ctx = {}) {
  const visoka = ctx.kakovost !== "nizka";
  const gib = ctx.gibanje !== false;
  const z0 = ctx.zacetek || {};
  const st = {
    postavitev: POSTAVITVE.some((o) => o[0] === z0.postavitev) ? z0.postavitev : "dipol",
    q: Number.isFinite(+z0.q) && z0.q !== undefined ? Math.min(10, Math.max(1, +z0.q)) : 5,
    predznak: z0.predznak === "minus" ? "minus" : "plus",
    ekvi: z0.ekvipotencialne === true || z0.ekvipotencialne === "1",
    preizkusni: !(z0.preizkusni === false || z0.preizkusni === "0"),
    t: [+(z0.x ?? 0) || 0, z0.y !== undefined ? +z0.y || 0 : 3, +(z0.z ?? 0) || 0].map((c) => Math.min(5, Math.max(-5, c))), // cm, v območju silnic
  };
  const group = new THREE.Group();
  group.name = "elektricno-polje";
  const smeti = new Set();
  const mat = (o) => { const m = new THREE.MeshPhysicalMaterial(o); smeti.add(m); return m; };
  const geo = (g) => { smeti.add(g); return g; };

  const segK = visoka ? 48 : 24, segV = visoka ? 32 : 16;
  const kroglaG = geo(new THREE.SphereGeometry(R_KROGLE, segK, segV));
  // naboja: lakirani kroglici, ki rahlo žarita v svoji barvi (+ mehak sij za njima, če je na voljo platno)
  const kroglaMat = (b, sheen) => mat({ color: b, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.08, emissive: b, emissiveIntensity: 0.3, sheen: 0.6, sheenRoughness: 0.4, sheenColor: sheen });
  const matPlus = kroglaMat(BARVE.plus, "#ffd2c8");
  const matMinus = kroglaMat(BARVE.minus, "#cfe0ff");
  const matZnak = mat({ color: BARVE.znak, roughness: 0.3, clearcoat: 0.6, emissive: "#ffffff", emissiveIntensity: 0.25 });
  const halo = (barva) => {
    if (typeof document === "undefined") return null;
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const x = c.getContext && c.getContext("2d");
    if (!x) return null;
    const col = new THREE.Color(barva), rgb = `${Math.round(col.r * 255)},${Math.round(col.g * 255)},${Math.round(col.b * 255)}`;
    const gr = x.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, `rgba(${rgb},0.55)`); gr.addColorStop(0.35, `rgba(${rgb},0.22)`); gr.addColorStop(1, `rgba(${rgb},0)`);
    x.fillStyle = gr; x.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; smeti.add(t);
    // točka (Points) namesto sprite: prekrivanje okolice (GTAO) črt in točk ne upošteva, sprite bi dal temen kvadrat
    const m = new THREE.PointsMaterial({ map: t, size: R_KROGLE * 6 * TOCKA_V_SVET, sizeAttenuation: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    smeti.add(m);
    return m;
  };
  const tockaG = geo(new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0], 3)));
  const haloPlus = halo(BARVE.plus), haloMinus = halo(BARVE.minus);
  // znak + ali − : letvici, ki gledata iz kroglice spredaj in zadaj (os z)
  const znakG = (plus, s = 1) => {
    const g = [new THREE.BoxGeometry(0.07 * s, 0.016 * s, 0.13 * s)];
    if (plus) g.push(new THREE.BoxGeometry(0.016 * s, 0.07 * s, 0.13 * s));
    return geo(zdruzi(THREE, g));
  };
  const plusG = znakG(true), minusG = znakG(false);
  const ploscaG = geo(new THREE.BoxGeometry(PLOSCA.deb, PLOSCA.pol * 2, PLOSCA.pol * 2));
  // plošči sta prosojni, da se vidijo silnice v reži
  const prosojna = { roughness: 0.18, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.1, transparent: true, opacity: 0.32, depthWrite: false, side: THREE.DoubleSide, emissiveIntensity: 0.18 };
  const matPlPlus = mat({ color: BARVE.ploscaPlus, emissive: BARVE.ploscaPlus, ...prosojna });
  const matPlMinus = mat({ color: BARVE.ploscaMinus, emissive: BARVE.ploscaMinus, ...prosojna });
  // svetla roba plošč, da se plošči berljivo ločita od silnic
  const robG = geo(new THREE.EdgesGeometry(ploscaG));
  const matRobPlus = new THREE.LineBasicMaterial({ color: "#ff9a8f", transparent: true, opacity: 0.85 });
  const matRobMinus = new THREE.LineBasicMaterial({ color: "#9fb8ff", transparent: true, opacity: 0.85 });
  smeti.add(matRobPlus); smeti.add(matRobMinus);
  const matZnPlus = mat({ color: BARVE.plus, roughness: 0.25, clearcoat: 0.9, emissive: BARVE.plus, emissiveIntensity: 0.25 });
  const matZnMinus = mat({ color: BARVE.minus, roughness: 0.25, clearcoat: 0.9, emissive: BARVE.minus, emissiveIntensity: 0.25 });
  const plusVelikG = (() => { const g = new THREE.BoxGeometry(0.11, 0.024, 0.024); const g2 = new THREE.BoxGeometry(0.024, 0.11, 0.024); return geo(zdruzi(THREE, [g, g2])); })();
  const minusVelikG = geo(zdruzi(THREE, [new THREE.BoxGeometry(0.11, 0.024, 0.024)]));

  const matSilnice = sijocMaterial(THREE, 0.6, { vertexColors: true, transparent: true });
  smeti.add(matSilnice);
  const stozecG = geo(new THREE.ConeGeometry(0.021, 0.056, visoka ? 18 : 8));
  const matStozec = sijocMaterial(THREE, 0.55, { color: "#ffffff" });
  smeti.add(matStozec);
  // prosojna dvostranska ploskev se nariše dvakrat (zadnja, nato sprednja stran); pri nizki kakovosti le enkrat (proračun ≤ 60k)
  const matEkvi = new THREE.MeshStandardMaterial({ vertexColors: true, transparent: true, depthWrite: false, side: THREE.DoubleSide, forceSinglePass: !visoka, roughness: 0.35, metalness: 0 });
  smeti.add(matEkvi);

  // preizkusni naboj, sila, sled
  const testG = geo(new THREE.SphereGeometry(R_TEST, visoka ? 32 : 16, visoka ? 20 : 10));
  const test = new THREE.Mesh(testG, mat({ color: BARVE.preizkusni, roughness: 0.3, clearcoat: 0.6, emissive: "#3a2400" }));
  const testZnak = new THREE.Mesh(znakG(true, 0.55), matZnak);
  const testSk = new THREE.Group();
  testSk.add(test, testZnak);
  const matSila = mat({ color: BARVE.sila, roughness: 0.4, clearcoat: 0.3, emissive: "#0d3a22" });
  const steblo = new THREE.Mesh(geo(new THREE.CylinderGeometry(0.009, 0.009, 1, 12).translate(0, 0.5, 0)), matSila);
  const konica = new THREE.Mesh(geo(new THREE.ConeGeometry(0.026, 1, 16).translate(0, 0.5, 0)), matSila);
  const prelom = new THREE.Mesh(geo(zdruzi(THREE, [new THREE.TorusGeometry(0.016, 0.004, 6, 16).rotateX(Math.PI / 2).translate(0, -0.012, 0), new THREE.TorusGeometry(0.016, 0.004, 6, 16).rotateX(Math.PI / 2).translate(0, 0.012, 0)])), mat({ color: "#ffffff", roughness: 0.5 }));
  const sila = new THREE.Group();
  sila.add(steblo, konica, prelom);
  const MAXSLED = 4000;
  const sledG = geo(new THREE.BufferGeometry());
  sledG.setAttribute("position", new THREE.BufferAttribute(new Float32Array(MAXSLED * 3), 3));
  sledG.setDrawRange(0, 0);
  const sledMat = new THREE.LineBasicMaterial({ color: BARVE.preizkusni, transparent: true, opacity: 0.65 });
  smeti.add(sledMat);
  const sled = new THREE.Line(sledG, sledMat);
  sled.frustumCulled = false;
  const testSkupina = new THREE.Group();
  testSkupina.add(testSk, sila, sled);
  group.add(testSkupina);

  const nabojiSk = new THREE.Group();
  group.add(nabojiSk);
  let silniceM = null, puscM = null, ekviM = null, ekviO = null, crte = [], nab = [];
  const ekviPredpomnilnik = new Map();
  const gibanje = { leti: false, p: null, v: [0, 0, 0], t: 0, konec: "", sled: 0 };
  let deliNabojev = [];

  function nabojiVidni() {
    for (const o of [...nabojiSk.children]) nabojiSk.remove(o);
    deliNabojev = [];
    const plusM = [], minusM = [];
    if (st.postavitev === "kondenzator") {
      const a = new THREE.Mesh(ploscaG, matPlPlus); a.position.x = -PLOSCA.x;
      const b = new THREE.Mesh(ploscaG, matPlMinus); b.position.x = PLOSCA.x;
      a.add(new THREE.LineSegments(robG, matRobPlus)); b.add(new THREE.LineSegments(robG, matRobMinus));
      a.renderOrder = b.renderOrder = 3;
      const za = new THREE.Mesh(plusVelikG, matZnPlus); za.position.set(-PLOSCA.x, PLOSCA.pol + 0.11, 0);
      const zb = new THREE.Mesh(minusVelikG, matZnMinus); zb.position.set(PLOSCA.x, PLOSCA.pol + 0.11, 0);
      nabojiSk.add(a, b, za, zb);
      deliNabojev.push({
        id: "plosci", ime: "Plošči kondenzatorja", barva: BARVE.ploscaPlus,
        opis: "Leva plošča je nabita pozitivno, desna negativno; med njima je polje skoraj homogeno (E ≈ σ/ε₀), ob robovih pa se silnice izbočijo navzven in polje oslabi (robni pojav).",
        meshes: [a, b, za, zb], tocka: [-PLOSCA.x, PLOSCA.pol * 0.7, PLOSCA.pol * 0.7],
      });
      return;
    }
    for (const c of nab) {
      const s = vSvet(c), plus = c.q > 0;
      const k = new THREE.Mesh(kroglaG, plus ? matPlus : matMinus);
      const z = new THREE.Mesh(plus ? plusG : minusG, matZnak);
      k.position.set(...s); z.position.set(...s);
      nabojiSk.add(k, z);
      const hm = plus ? haloPlus : haloMinus;
      if (hm) { const h = new THREE.Points(tockaG, hm); h.raycast = () => {}; h.position.set(...s); h.renderOrder = 0; nabojiSk.add(h); }
      (plus ? plusM : minusM).push(k, z);
    }
    const qT = `${lepo(st.q)} nC`;
    if (plusM.length)
      deliNabojev.push({
        id: "pozitivni-naboj", ime: plusM.length > 2 ? "Pozitivna naboja" : "Pozitivni naboj", barva: BARVE.plus,
        opis: `Naboj +${qT}; silnice iz njega izhajajo, njihovo število je sorazmerno z nabojem.`,
        meshes: plusM, tocka: [plusM[0].position.x, R_KROGLE * 1.2, 0],
      });
    if (minusM.length)
      deliNabojev.push({
        id: "negativni-naboj", ime: "Negativni naboj", barva: BARVE.minus,
        opis: `Naboj −${qT}; silnice vanj vstopajo, ker kažejo smer sile na pozitivni naboj.`,
        meshes: minusM, tocka: [minusM[0].position.x, R_KROGLE * 1.2, 0],
      });
  }

  const cT = new THREE.Color(BARVE.silnicaTemna), cM = new THREE.Color(BARVE.silnicaSrednja), cS = new THREE.Color(BARVE.silnicaSvetla);
  const tmpC = new THREE.Color();
  const svetlost = (E) => smoothstep(0, 1, (Math.log10(Math.max(E, 1)) - 3.5) / 2.8); // ≈ 3 kN/C → 0, ≈ 2 MN/C → 1
  const zatemni = (p) => 1 - smoothstep(R_POGLED - 0.2, R_POGLED, len3(p));

  function silniceVidne() {
    for (const m of [silniceM, puscM]) if (m) { group.remove(m); m.geometry !== stozecG && m.geometry.dispose(); if (m.isInstancedMesh) m.dispose(); }
    crte = silnice(st.postavitev, st.q, st.predznak === "minus" ? -1 : 1);
    // barva in debelina po jakosti polja: šibko polje temno jantarno in tanko, močno svetlo in debelejše
    const g = cevi(THREE, crte, visoka ? 0.0072 : 0.0078, visoka ? 8 : 4, (c, i) => {
      const t = svetlost(c.jakost[i]);
      preliv(tmpC, cT, cM, cS, t);
      return [tmpC.r, tmpC.g, tmpC.b, zatemni(c.tocke[i]) * (0.75 + 0.25 * t), 0.7 + 0.6 * t];
    });
    silniceM = new THREE.Mesh(g, matSilnice);
    silniceM.renderOrder = 1;
    silniceM.name = "silnice";
    group.add(silniceM);
    const centri = st.postavitev === "kondenzator" ? [] : nab.map(vSvet);
    const pus = strelice(crte, 0.3, st.postavitev === "kondenzator" ? 0.07 : 0.16, (p) => len3(p) > R_POGLED - 0.1 || centri.some((s) => Math.hypot(p[0] - s[0], p[1] - s[1], p[2] - s[2]) < 0.12));
    puscM = new THREE.InstancedMesh(stozecG, matStozec, Math.max(1, pus.length));
    puscM.count = pus.length;
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), dv = new THREE.Vector3(), one = new THREE.Vector3(1, 1, 1), pv = new THREE.Vector3();
    pus.forEach((a, k) => {
      dv.set(...a.d); q.setFromUnitVectors(up, dv); pv.set(...a.p);
      m4.compose(pv, q, one); puscM.setMatrixAt(k, m4);
      const c = crte[a.ci];
      preliv(tmpC, cT, cM, cS, 0.35 + 0.65 * svetlost(c.jakost[a.i]));
      puscM.setColorAt(k, tmpC);
    });
    puscM.instanceMatrix.needsUpdate = true;
    if (puscM.instanceColor) puscM.instanceColor.needsUpdate = true;
    puscM.computeBoundingSphere();
    puscM.name = "puscice";
    group.add(puscM);
  }

  function ravniEkvi(qnC = st.q) {
    const kq = K * qnC * 1e-9, sg = st.predznak === "minus" ? -1 : 1;
    if (st.postavitev === "tocka") return { ravni: [1, 2, 3, 4, 5].map((n) => (sg * kq * n) / 0.09), dV: kq / 0.09 };
    if (st.postavitev === "dipol") return { ravni: [-75, -50, -25, 0, 25, 50, 75].map((s) => kq * s), dV: kq * 25 };
    if (st.postavitev === "enaka") return { ravni: [30, 45, 60, 75, 90].map((s) => kq * s), dV: kq * 15 };
    const Vp = potencial(naboji("kondenzator", qnC, 1), -PLOSCA.x * ENOTA, 0, 0);
    return { ravni: [-0.5, 0, 0.5].map((f) => f * Vp), dV: 0.5 * Vp, U: 2 * Vp };
  }

  function ekviVidne() {
    for (const m of [ekviM, ekviO]) if (m) group.remove(m);
    ekviM = ekviO = null;
    if (!st.ekvi) return;
    const kljuc = `${st.postavitev}|${st.predznak}`;
    let g = ekviPredpomnilnik.get(kljuc);
    if (!g) {
      const enot = naboji(st.postavitev, 1, st.predznak === "minus" ? -1 : 1);
      const { ravni } = ravniEkvi(1); // ravni za 1 nC: oblika ploskev ni odvisna od q, ΔV je sorazmerna s q
      const Vfn = (x, y, z) => potencial(enot, x * ENOTA, y * ENOTA, z * ENOTA);
      const tris = izoploskve(Vfn, ravni, visoka ? 40 : 30, 0.9, true);
      const centri = st.postavitev === "kondenzator" ? [] : enot.map(vSvet);
      const vNaboju = (p, rr) => centri.some((s) => Math.hypot(p[0] - s[0], p[1] - s[1], p[2] - s[2]) < rr) ||
        (st.postavitev === "kondenzator" && Math.abs(Math.abs(p[0]) - PLOSCA.x) < PLOSCA.deb && Math.abs(p[1]) < PLOSCA.pol && Math.abs(p[2]) < PLOSCA.pol);
      const barvaRavni = (li) => { const L = ravni[li]; return new THREE.Color(Math.abs(L) < 1e-9 ? BARVE.ekviNic : L > 0 ? BARVE.ekviPlus : BARVE.ekviMinus); };
      const pos = [], nor = [], col = [];
      // ploskve: le zadnja polovica (z ≤ 0), da se vidijo prerezi in silnice spredaj
      for (const t of tris) {
        if (len3(t.a) > R_POGLED || len3(t.b) > R_POGLED || len3(t.c) > R_POGLED) continue;
        const cc = barvaRavni(t.li);
        for (const tri of odreziZ([[t.a, t.na], [t.b, t.nb], [t.c, t.nc]])) {
          const m = [0, 1, 2].map((k) => (tri[0][0][k] + tri[1][0][k] + tri[2][0][k]) / 3);
          if (st.postavitev !== "kondenzator" && vNaboju(m, R_KROGLE)) continue; // plošč ne režemo (sicer nazobčan rob)
          for (const [p, ev] of tri) {
            pos.push(p[0], p[1], p[2]);
            const l = len3(ev) || 1;
            nor.push(ev[0] / l, ev[1] / l, ev[2] / l);
            col.push(cc.r, cc.g, cc.b, 0.2 * zatemni(p));
          }
        }
      }
      const lupine = new THREE.BufferGeometry();
      lupine.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      lupine.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
      lupine.setAttribute("color", new THREE.Float32BufferAttribute(col, 4));
      lupine.computeBoundingSphere();
      // obroči: prerez ploskev z ravnino z = 0 (marching squares), razrezani na robu vidnega polja
      const crteO = [];
      for (const { tocke, li } of izolinije((x, y) => Vfn(x, y, 0), ravni, visoka ? 150 : 100, R_POGLED)) {
        let kos = [];
        const zapri = () => { if (kos.length > 1) crteO.push({ tocke: kos, li }); kos = []; };
        for (const p of tocke) { if (len3(p) > R_POGLED - 0.005 || vNaboju(p, R_KROGLE * 0.9)) zapri(); else kos.push(p); }
        zapri();
      }
      const obroci = cevi(THREE, crteO, visoka ? 0.0035 : 0.0045, visoka ? 5 : 4, (c, i) => {
        const cc = barvaRavni(c.li);
        return [cc.r, cc.g, cc.b, 0.9 * zatemni(c.tocke[i])];
      });
      g = { lupine, obroci };
      ekviPredpomnilnik.set(kljuc, g);
    }
    ekviM = new THREE.Mesh(g.lupine, matEkvi);
    ekviM.renderOrder = 2;
    ekviM.name = "ekvipotencialne";
    ekviO = new THREE.Mesh(g.obroci, matSilnice);
    ekviO.renderOrder = 1;
    ekviO.name = "ekvipotencialni-obroci";
    group.add(ekviM, ekviO);
  }

  // --- preizkusni naboj
  const polozajTesta = () => (gibanje.p ? gibanje.p : st.t.map((c) => c * 0.01)); // m
  const Etest = () => { const p = polozajTesta(); return poljeE(nab, p[0], p[1], p[2], [0, 0, 0]); };
  function ovira(p) {
    // vrne opis ovire, če je preizkusni naboj zadel naboj, ploščo ali rob (p v m)
    const s = [p[0] / ENOTA, p[1] / ENOTA, p[2] / ENOTA];
    if (len3(s) > R_POGLED - R_TEST) return "rob";
    if (st.postavitev === "kondenzator") {
      for (const x of [-PLOSCA.x, PLOSCA.x])
        if (Math.abs(s[0] - x) < PLOSCA.deb / 2 + R_TEST && Math.abs(s[1]) < PLOSCA.pol && Math.abs(s[2]) < PLOSCA.pol) return x < 0 ? "plosca+" : "plosca-";
      return null;
    }
    for (const c of nab) {
      const v = vSvet(c);
      if (Math.hypot(s[0] - v[0], s[1] - v[1], s[2] - v[2]) < R_KROGLE + R_TEST) return c.q > 0 ? "naboj+" : "naboj-";
    }
    return null;
  }
  const _E = [0, 0, 0], _gor = new THREE.Vector3(0, 1, 0), _smer = new THREE.Vector3(), _a = [0, 0, 0], _an = [0, 0, 0]; // brez dodeljevanja v korak()
  function testVidni() {
    testSkupina.visible = st.preizkusni;
    if (!st.preizkusni) return;
    const p = polozajTesta();
    testSk.position.set(p[0] / ENOTA, p[1] / ENOTA, p[2] / ENOTA);
    const E = poljeE(nab, p[0], p[1], p[2], _E), Em = len3(E), F = Q0 * Em;
    let L = F / SILA_NA_ENOTO;
    const skrajsana = L > L_SILA_MAX;
    if (skrajsana) L = L_SILA_MAX;
    sila.visible = Em > 0 && L > 0.004;
    if (sila.visible) {
      sila.position.copy(testSk.position);
      sila.quaternion.setFromUnitVectors(_gor, _smer.set(E[0] / Em, E[1] / Em, E[2] / Em));
      const kl = Math.min(0.065, L * 0.55), zac = R_TEST * 0.9;
      const dolzS = Math.max(0.001, L - kl);
      steblo.position.y = zac; steblo.scale.set(1, dolzS, 1);
      konica.position.y = zac + dolzS; konica.scale.set(Math.min(1, kl / 0.04), kl, Math.min(1, kl / 0.04));
      prelom.visible = skrajsana;
      prelom.position.y = zac + dolzS * 0.55;
    }
    sledG.setDrawRange(0, gibanje.sled);
    sled.visible = gibanje.sled > 1;
  }
  function ponastaviGibanje() {
    gibanje.leti = false; gibanje.p = null; gibanje.v = [0, 0, 0]; gibanje.t = 0; gibanje.konec = ""; gibanje.sled = 0;
  }
  function dodajSled(p) {
    if (gibanje.sled >= MAXSLED) return;
    const a = sledG.attributes.position;
    a.setXYZ(gibanje.sled++, p[0] / ENOTA, p[1] / ENOTA, p[2] / ENOTA);
    a.needsUpdate = true;
  }
  /** Gibanje preizkusnega naboja: hitrostni Verlet z majhnimi podkoraki (brez dušenja). */
  function premakni(dt) {
    let ost = dt;
    const e = _E, a = _a, an = _an;
    let n = 0;
    while (ost > 1e-9 && gibanje.leti && n++ < 20000) {
      const p = gibanje.p, v = gibanje.v;
      poljeE(nab, p[0], p[1], p[2], e);
      for (let i = 0; i < 3; i++) a[i] = (Q0 * e[i]) / MASA;
      const vm = len3(v), am = len3(a), ds = 0.0004;
      const h = Math.min(ost, ds / (vm + Math.sqrt(ds * am) + 1e-9), 0.01);
      for (let i = 0; i < 3; i++) p[i] += v[i] * h + 0.5 * a[i] * h * h; // p in v se posodabljata na mestu
      const pn = p;
      poljeE(nab, pn[0], pn[1], pn[2], e);
      for (let i = 0; i < 3; i++) { an[i] = (Q0 * e[i]) / MASA; v[i] += 0.5 * (a[i] + an[i]) * h; }
      gibanje.t += h; ost -= h;
      const sl = gibanje.sled ? sledG.attributes.position : null;
      if (!sl || Math.hypot(pn[0] / ENOTA - sl.getX(gibanje.sled - 1), pn[1] / ENOTA - sl.getY(gibanje.sled - 1), pn[2] / ENOTA - sl.getZ(gibanje.sled - 1)) > 0.008) dodajSled(pn);
      const ov = ovira(pn);
      if (ov || gibanje.t > 40) {
        gibanje.leti = false;
        gibanje.konec = ov === "rob" ? "zapustil je vidno polje" : ov === "naboj-" ? "zadel je negativni naboj" : ov === "naboj+" ? "zadel je pozitivni naboj"
          : ov === "plosca-" ? "zadel je negativno ploščo" : ov === "plosca+" ? "zadel je pozitivno ploščo" : "ustavljeno po 40 s";
        dodajSled(pn);
      }
    }
  }
  function spusti() {
    ponastaviGibanje();
    st.preizkusni = true;
    const sk = out.nadzor.find((n) => n.id === "preizkusni"); if (sk) sk.vrednost = true; // stikalo naj kaže, da je naboj spet vklopljen
    gibanje.p = st.t.map((c) => c * 0.01);
    if (ovira(gibanje.p)) { gibanje.konec = "preizkusni naboj je v naboju ali zunaj vidnega polja"; testVidni(); return; }
    gibanje.leti = true;
    dodajSled(gibanje.p);
    if (!gib) for (let i = 0; i < 4000 && gibanje.leti; i++) premakni(0.01); // brez animacije: takoj končno stanje
    testVidni();
  }

  // --- deli
  const out = { group, deli: [], nadzor: [], merilo: info.merilo };
  function dele() {
    const deli = [...deliNabojev];
    const c0 = crte.find((c) => c.tocke.length > 8) || crte[0];
    if (c0) {
      const p = c0.tocke.find((p) => len3(p) > 0.3 && len3(p) < 0.7 && nab.every((c) => Math.hypot(...vSvet(c).map((v, i) => v - p[i])) > 0.15)) || c0.tocke[Math.floor(c0.tocke.length / 2)];
      deli.push({
        id: "silnice", ime: "Silnice", barva: BARVE.silnicaSvetla,
        opis: "Kažejo smer sile na pozitivni naboj; kjer so gostejše in svetlejše, je polje močnejše.",
        meshes: [silniceM, puscM], tocka: p.slice(),
      });
    }
    if (ekviM && ekviO) {
      const a = ekviO.geometry.attributes.position;
      let best = 0, by = -Infinity;
      for (let i = 0; i < a.count; i += 3) { const y = a.getY(i), r = Math.hypot(a.getX(i), y, a.getZ(i)); if (r < 0.7 && y - Math.abs(a.getZ(i)) > by) { by = y - Math.abs(a.getZ(i)); best = i; } }
      deli.push({
        id: "ekvipotencialne", ime: "Ekvipotencialne ploskve", barva: BARVE.ekviNic,
        opis: "Na vsaki ploskvi je potencial enak; silnice jih sekajo pravokotno (prikazana je zadnja polovica ploskev).",
        meshes: [ekviM, ekviO], tocka: [a.getX(best), a.getY(best), a.getZ(best)],
      });
    }
    if (st.preizkusni) {
      const p = testSk.position;
      deli.push({
        id: "preizkusni-naboj", ime: "Preizkusni naboj", barva: BARVE.preizkusni,
        opis: "Majhen pozitivni naboj (0,1 nC), s katerim merimo jakost polja v izbrani točki.",
        meshes: [test, testZnak], tocka: [p.x, p.y, p.z],
      });
      if (sila.visible) {
        const t = new THREE.Vector3(0, R_TEST * 0.9 + steblo.scale.y + konica.scale.y, 0).applyQuaternion(sila.quaternion).add(sila.position);
        deli.push({
          id: "sila", ime: "Sila na preizkusni naboj", barva: BARVE.sila,
          opis: "Električna sila F = q·E kaže v smeri silnice skozi to točko.",
          meshes: [steblo, konica], tocka: [t.x, t.y, t.z],
        });
      }
    }
    out.deli = deli;
  }

  function vse() {
    ponastaviGibanje();
    nab = naboji(st.postavitev, st.q, st.predznak === "minus" ? -1 : 1);
    nabojiVidni();
    silniceVidne();
    ekviVidne();
    testVidni();
    dele();
  }

  // --- izpisi
  const izpisE = () => {
    if (!st.preizkusni) return "Vklopi preizkusni naboj.";
    return `E = ${znanstveno(len3(Etest()))} N/C`;
  };
  const izpisF = () => {
    if (!st.preizkusni) return "—";
    const F = Q0 * len3(Etest()), skr = F / SILA_NA_ENOTO > L_SILA_MAX;
    return `F = q₀·E = ${silaBesedilo(F)} (q₀ = 0,1 nC; puščica 1 cm ≙ 2 µN${skr ? ", skrajšana" : ""})`;
  };
  const izpisR = () => {
    if (!st.preizkusni) return "—";
    const p = polozajTesta();
    if (st.postavitev === "kondenzator") {
      const d = (p[0] + PLOSCA.x * ENOTA) * 100;
      return `x = ${dec(d, 1)} cm od pozitivne plošče (razmik plošč ${dec(2 * PLOSCA.x * ENOTA * 100, 1)} cm)`;
    }
    const r = nab.map((c) => Math.hypot(p[0] - c.x, p[1] - c.y, p[2] - c.z) * 100);
    if (r.length === 1) return `r = ${dec(r[0], 1)} cm`;
    return `r₁ = ${dec(r[0], 1)} cm, r₂ = ${dec(r[1], 1)} cm`;
  };
  const izpisGib = () => {
    if (!st.preizkusni) return "—";
    if (gibanje.leti) return `t = ${dec(gibanje.t, 1)} s, v = ${dec(len3(gibanje.v) * 100, 1)} cm/s`;
    if (gibanje.konec) return `${gibanje.konec[0].toUpperCase()}${gibanje.konec.slice(1)} (t = ${dec(gibanje.t, 1)} s, v = ${dec(len3(gibanje.v) * 100, 1)} cm/s).`;
    return "Miruje; pritisni »Spusti«.";
  };
  const izpisPolje = () => {
    const nS = Math.round(SILNIC_NA_NC * st.q);
    let s = `${nS} silnic na naboj ${lepo(st.q)} nC (${SILNIC_NA_NC} na 1 nC)`;
    if (st.ekvi) {
      const r = ravniEkvi();
      s += st.postavitev === "kondenzator" ? `; U = ${lepo(r.U)} V, ΔV = ${lepo(r.dV)} V med ploskvama` : `; ΔV = ${lepo(r.dV)} V med sosednjima ploskvama`;
    }
    return s;
  };

  const posodobi = (fn) => (v) => { fn(v); vse(); };
  out.nadzor = [
    { tip: "izbira", id: "postavitev", oznaka: "Postavitev", moznosti: POSTAVITVE, vrednost: st.postavitev, ob: posodobi((v) => { if (POSTAVITVE.some((o) => o[0] === v)) st.postavitev = v; }) },
    { tip: "drsnik", id: "q", oznaka: "Naboj q (nC)", min: 1, max: 10, korak: 1, vrednost: st.q, ob: posodobi((v) => { st.q = Math.min(10, Math.max(1, Math.round(+v) || 1)); }) },
    { tip: "izbira", id: "predznak", oznaka: "Predznak točkastega naboja", moznosti: [["plus", "Pozitiven (+)"], ["minus", "Negativen (−)"]], vrednost: st.predznak, vidno: () => st.postavitev === "tocka", ob: posodobi((v) => { st.predznak = v === "minus" ? "minus" : "plus"; }) },
    { tip: "stikalo", id: "ekvipotencialne", oznaka: "Ekvipotencialne ploskve", vrednost: st.ekvi, ob: (v) => { st.ekvi = !!v; ekviVidne(); dele(); } },
    { tip: "stikalo", id: "preizkusni", oznaka: "Preizkusni naboj", vrednost: st.preizkusni, ob: (v) => { st.preizkusni = !!v; ponastaviGibanje(); testVidni(); dele(); } },
    { tip: "drsnik", id: "x", oznaka: "Preizkusni naboj x (cm)", min: -5, max: 5, korak: 0.25, vrednost: st.t[0], ob: (v) => { st.t[0] = +v || 0; ponastaviGibanje(); testVidni(); dele(); } },
    { tip: "drsnik", id: "y", oznaka: "Preizkusni naboj y (cm)", min: -5, max: 5, korak: 0.25, vrednost: st.t[1], ob: (v) => { st.t[1] = +v || 0; ponastaviGibanje(); testVidni(); dele(); } },
    { tip: "drsnik", id: "z", oznaka: "Preizkusni naboj z (cm)", min: -5, max: 5, korak: 0.25, vrednost: st.t[2], ob: (v) => { st.t[2] = +v || 0; ponastaviGibanje(); testVidni(); dele(); } },
    { tip: "gumb", id: "spusti", oznaka: "Spusti preizkusni naboj", ob: () => { spusti(); dele(); } },
    { tip: "izpis", id: "E", oznaka: "Jakost električnega polja", vrednost: izpisE },
    { tip: "izpis", id: "F", oznaka: "Sila na preizkusni naboj", vrednost: izpisF },
    { tip: "izpis", id: "r", oznaka: "Razdalja", vrednost: izpisR },
    { tip: "izpis", id: "gibanje", oznaka: "Gibanje preizkusnega naboja", vrednost: izpisGib },
    { tip: "izpis", id: "polje", oznaka: "Silnice in potencial", vrednost: izpisPolje },
  ];

  out.korak = (t, dt) => {
    if (!gib || !gibanje.leti) return;
    premakni(Math.min(0.05, Math.max(0, dt || 0)));
    testVidni();
    if (!gibanje.leti) dele();
    else { const d = out.deli.find((x) => x.id === "preizkusni-naboj"); if (d) testSk.position.toArray(d.tocka); const f = out.deli.find((x) => x.id === "sila"); if (f && sila.visible) _smer.set(0, R_TEST * 0.9 + steblo.scale.y + konica.scale.y, 0).applyQuaternion(sila.quaternion).add(sila.position).toArray(f.tocka); }
  };
  out.dispose = () => {
    for (const g of ekviPredpomnilnik.values()) { g.lupine.dispose(); g.obroci.dispose(); }
    for (const m of [silniceM, puscM]) if (m) { m.geometry !== stozecG && m.geometry.dispose(); if (m.isInstancedMesh) m.dispose(); }
    for (const s of smeti) s.dispose();
  };

  vse();
  return out;
}

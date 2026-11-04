// Magnetno polje (FIZ): silnice, izračunane po Biot–Savartovem zakonu.
// Ravni odsek toka ima zaprto obliko Biot–Savartovega integrala, krožna zanka pa obliko s popolnima eliptičnima
// integraloma K in E (AGM). Paličasti magnet je enakomerno magneten kvader = gost niz pravokotnih tokovnih zank
// na njegovem plašču (ekvivalentni površinski tok K = M). Silnice so integrirane z RK4 s prilagodljivim korakom
// v obe smeri iz začetnih točk in se zaprejo vase. Enote: 1 enota modela = 10 cm; fizika v SI.

export const info = {
  id: "magnetno-polje",
  naslov: "Magnetno polje",
  podrocje: "fizika",
  predmet: "FIZ",
  opis:
    "Silnice magnetnega polja paličastega magneta, ravnega vodnika, tuljave in krožne zanke, izračunane po " +
    "Biot–Savartovem zakonu, s kompasi in gostoto magnetnega polja B. Poenostavitve: ovoji tuljave so krožne zanke, " +
    "magnet je enakomerno magneten, ravni vodnik je dolg 2 m.",
  merilo: { m: 0.2, oznaka: "20 cm" },
};

// ---------------------------------------------------------------- fizika (SI) --
export const MU0 = 4e-7 * Math.PI; // T m / A
export const ENOTA = 0.1; // m na enoto modela
export const R_POGLED = 0.88; // enote
export const MAGNET = { dolzina: 0.08, pol: 0.008, M: 3e5, zank: 40 }; // feritni magnet 8 × 1,6 × 1,6 cm, M v A/m
export const TULJAVA = { dolzina: 0.1, polmer: 0.02 }; // m
export const ZANKA = { polmer: 0.03 }; // m
export const VODNIK = { dolzina: 2 }; // m (»dolg« vodnik; vidni del je 18 cm)

/** Prispevek ravnega odseka toka I od (x1,y1,z1) do (x2,y2,z2) k B v točki (x,y,z) (zaprta oblika Biot–Savarta). */
export function poljeOdseka(x1, y1, z1, x2, y2, z2, I, x, y, z, out) {
  const Lx = x2 - x1, Ly = y2 - y1, Lz = z2 - z1;
  const ax = x - x1, ay = y - y1, az = z - z1, bx = x - x2, by = y - y2, bz = z - z2;
  const cx = Ly * az - Lz * ay, cy = Lz * ax - Lx * az, cz = Lx * ay - Ly * ax;
  const c2 = cx * cx + cy * cy + cz * cz;
  const L2 = Lx * Lx + Ly * Ly + Lz * Lz;
  if (c2 < 1e-24 * L2 * L2) return out; // točka na premici odseka
  const ra = Math.sqrt(ax * ax + ay * ay + az * az), rb = Math.sqrt(bx * bx + by * by + bz * bz);
  const f = ((MU0 * I) / (4 * Math.PI)) * ((Lx * ax + Ly * ay + Lz * az) / ra - (Lx * bx + Ly * by + Lz * bz) / rb) / c2;
  out[0] += f * cx; out[1] += f * cy; out[2] += f * cz;
  return out;
}

/** Popolna eliptična integrala K(m) in E(m) (parameter m = k²) z aritmetično-geometrijsko sredino. */
export function elipticna(m) {
  let a = 1, b = Math.sqrt(Math.max(0, 1 - m)), c = Math.sqrt(Math.max(0, m)), vsota = 0.5 * m, p = 0.5;
  for (let n = 0; n < 40 && c > 1e-15; n++) {
    const an = (a + b) / 2, bn = Math.sqrt(a * b);
    c = (a - b) / 2; a = an; b = bn; p *= 2; vsota += p * c * c;
  }
  const K = Math.PI / (2 * a);
  return [K, K * (1 - vsota)];
}

/** Prispevek krožne zanke (os x, središče pri x = xc, polmer a, tok I; pozitiven tok kroži okoli +x) k B. */
export function poljeZanke(xc, a, I, x, y, z, out) {
  const u = x - xc, rho = Math.hypot(y, z);
  const ap = a + rho, am = a - rho;
  const d1 = ap * ap + u * u, d2 = am * am + u * u;
  if (d2 < 1e-16) return out; // na žici
  const [Kk, Ek] = elipticna((4 * a * rho) / d1);
  const C = (MU0 * I) / (2 * Math.PI * Math.sqrt(d1));
  out[0] += C * (Kk + ((a * a - rho * rho - u * u) / d2) * Ek);
  if (rho > 1e-12) {
    const Br = ((C * u) / rho) * (-Kk + ((a * a + rho * rho + u * u) / d2) * Ek);
    out[1] += (Br * y) / rho; out[2] += (Br * z) / rho;
  }
  return out;
}

/**
 * Vir polja v SI: {odseki: [[x1,y1,z1,x2,y2,z2,I]], zanke: [[xc, a, I]]}.
 * ime: "magnet" | "vodnik" | "tuljava" | "zanka"; o = {I, N, smer, dolzina, polmer}.
 */
export function vir(ime, o = {}) {
  const I = o.I ?? 10, N = o.N ?? 20, s = (o.smer ?? 1) < 0 ? -1 : 1;
  if (ime === "vodnik") { const h = (o.dolzina ?? VODNIK.dolzina) / 2; return { odseki: [[0, -h * s, 0, 0, h * s, 0, I]], zanke: [] }; }
  if (ime === "zanka") return { odseki: [], zanke: [[0, o.polmer ?? ZANKA.polmer, s * I]] };
  if (ime === "tuljava") {
    const L = o.dolzina ?? TULJAVA.dolzina, R = o.polmer ?? TULJAVA.polmer, zanke = [];
    for (let i = 0; i < N; i++) zanke.push([-L / 2 + ((i + 0.5) * L) / N, R, s * I]);
    return { odseki: [], zanke };
  }
  // paličasti magnet: M v smeri +x (od S proti N); površinski tok K = M × n kroži okoli +x
  const { dolzina: L, pol: h, M, zank } = MAGNET, Ieq = (M * L) / zank, odseki = [];
  const v = [[h, -h], [h, h], [-h, h], [-h, -h]]; // (y, z) v smeri kroženja okoli +x
  for (let i = 0; i < zank; i++) {
    const x = -L / 2 + ((i + 0.5) * L) / zank;
    for (let k = 0; k < 4; k++) { const a = v[k], b = v[(k + 1) % 4]; odseki.push([x, a[0], a[1], x, b[0], b[1], Ieq]); }
  }
  return { odseki, zanke: [] };
}

/** Gostota magnetnega polja B (T) v točki (m): vsota prispevkov vseh odsekov in zank. */
export function poljeB(v, x, y, z, out = [0, 0, 0]) {
  out[0] = 0; out[1] = 0; out[2] = 0;
  for (const o of v.odseki) poljeOdseka(o[0], o[1], o[2], o[3], o[4], o[5], o[6], x, y, z, out);
  for (const r of v.zanke) poljeZanke(r[0], r[1], r[2], x, y, z, out);
  return out;
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

/**
 * Silnice vira v enotah modela za tok 1 A v pozitivni smeri, urejene v smeri B.
 * Začetne točke: pri vodniku krogi okoli žice v treh ravninah (polmeri v geometrijskem zaporedju, ker B ∝ 1/r);
 * pri magnetu, tuljavi in zanki v srednjem prerezu (x = 0) na K polravninah, polmeri razdeljeni po pretoku B_x.
 * Vrne [{tocke, jakost (|B| v T pri 1 A oz. pri magnetu), zaprta}].
 */
export function silniceB(ime, o = {}) {
  const visoka = o.visoka !== false;
  const v = vir(ime, { I: 1, N: o.N ?? 20, smer: 1 });
  const tmp = [0, 0, 0];
  const polje = (p) => poljeB(v, p[0] * ENOTA, p[1] * ENOTA, p[2] * ENOTA, tmp);
  const zice = ime === "tuljava" || ime === "zanka" ? v.zanke.map((r) => [r[0] / ENOTA, r[1] / ENOTA]) : null;
  const ustavi = (p) => {
    if (len3(p) > R_POGLED) return { razlog: "rob" };
    if (zice) {
      const rho = Math.hypot(p[1], p[2]);
      for (const [xc, a] of zice) if (Math.hypot(p[0] - xc, rho - a) < 0.012) return { razlog: "zica" };
    }
    if (ime === "vodnik" && Math.hypot(p[0], p[2]) < 0.025) return { razlog: "zica" };
    return null;
  };
  const sem = [];
  if (ime === "vodnik") {
    const n = visoka ? 6 : 5, r0 = 0.1, r1 = 0.72;
    [-0.45, 0, 0.45].forEach((y, k) => {
      for (let i = 0; i < n; i++) {
        const r = r0 * (r1 / r0) ** (i / (n - 1)), f = 0.9 * k + 1.3 * i;
        sem.push([r * Math.cos(f), y, r * Math.sin(f)]);
      }
    });
  } else {
    const K = visoka ? 6 : 4, M = visoka ? 4 : 3;
    const rmax = ime === "magnet" ? (0.85 * MAGNET.pol) / ENOTA : ime === "tuljava" ? (0.75 * TULJAVA.polmer) / ENOTA : (0.9 * ZANKA.polmer) / ENOTA;
    sem.push([0, 0, 0]);
    for (let k = 0; k < K; k++) {
      const f = Math.PI / 2 + (k / K) * 2 * Math.PI, cy = Math.cos(f), cz = Math.sin(f);
      // kumulativni pretok B_x vzdolž polmera → polmeri z enakim deležem pretoka
      const n = 120, kum = [0];
      let prej = polje([0, 0, 0])[0];
      for (let i = 1; i <= n; i++) {
        const r = (rmax * i) / n, b = polje([0, r * cy, r * cz])[0];
        kum.push(kum[i - 1] + 0.5 * (prej + b) * (rmax / n));
        prej = b;
      }
      for (let j = 0; j < M; j++) {
        const cilj = ((j + 0.75) / (M + 0.25)) * kum[n];
        let i = 1;
        while (i < n && kum[i] < cilj) i++;
        const t = (cilj - kum[i - 1]) / (kum[i] - kum[i - 1] || 1), r = (rmax * (i - 1 + t)) / n;
        sem.push([0, r * cy, r * cz]);
      }
    }
  }
  const crte = [];
  for (const s0 of sem) {
    const f = sledi(polje, s0, { smer: 1, ustavi, zapri: true, maxDolzina: 12, hmax: 0.03 });
    let tocke = f.tocke;
    if (!f.zaprta) {
      if (f.konec && f.konec.razlog === "rob") obreziNaRob(tocke, R_POGLED);
      const b = sledi(polje, s0, { smer: -1, ustavi, maxDolzina: 12, hmax: 0.03 });
      if (b.konec && b.konec.razlog === "rob") obreziNaRob(b.tocke, R_POGLED);
      tocke = b.tocke.reverse().concat(tocke.slice(1));
    }
    if (tocke.length < 2) continue;
    crte.push({ tocke, zaprta: f.zaprta, jakost: tocke.map((p) => len3(poljeB(v, p[0] * ENOTA, p[1] * ENOTA, p[2] * ENOTA, [0, 0, 0]))) });
  }
  return crte;
}

/** Ali je točka (enote, ravnina y = 0) preblizu vira za kompas. */
function izlociKompas(ime, x, z) {
  if (ime === "magnet") return Math.abs(x) < 0.47 && Math.abs(z) < 0.14;
  if (ime === "vodnik") return Math.hypot(x, z) < 0.07;
  if (ime === "tuljava") return Math.abs(x) < TULJAVA.dolzina / 2 / ENOTA + 0.05 && Math.abs(Math.abs(z) - TULJAVA.polmer / ENOTA) < 0.07;
  return Math.abs(x) < 0.07 && Math.abs(Math.abs(z) - ZANKA.polmer / ENOTA) < 0.07;
}

// ---------------------------------------------------------------- izpis --
export function dec(x, d) {
  return (x < 0 ? "−" : "") + Math.abs(x).toFixed(d).replace(".", ",");
}
export function lepo(x) {
  const a = Math.abs(x);
  return dec(x, a >= 10 ? 0 : a >= 1 ? 1 : 2);
}
function smoothstep(a, b, x) {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

/** Cevke vzdolž silnic (ena geometrija, barve po ogliščih). */
function cevi(THREE, crte, polmer, rad, barva) {
  let nv = 0, ni = 0;
  for (const c of crte) if (c.tocke.length > 1) { nv += c.tocke.length * rad; ni += (c.tocke.length - 1) * rad * 6; }
  const pos = new Float32Array(nv * 3), col = new Float32Array(nv * 4);
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
      const [r, g, bb, al = 1] = barva(c, i);
      for (let k = 0; k < rad; k++) {
        const f = (k / rad) * Math.PI * 2, cs = Math.cos(f) * polmer, sn = Math.sin(f) * polmer;
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

function besediloB(B) {
  if (B >= 1e-3) return `${lepo(B * 1e3)} mT`;
  return `${lepo(B * 1e6)} µT`;
}

// ---------------------------------------------------------------- gradnja --
const BARVE = {
  sever: "#d9534f", jug: "#4f78d0", crka: "#f4f5f8", baker: "#c97b4b", tok: "#ffb547",
  silnicaTemna: "#2c3f6a", silnicaSvetla: "#cfe0ff", notranjost: "#6e9bff", igla: "#e0473f", iglaJug: "#e9ecf2",
};
const VIRI = [
  ["magnet", "Paličasti magnet"],
  ["vodnik", "Raven vodnik"],
  ["tuljava", "Tuljava"],
  ["zanka", "Krožna zanka"],
];

/** Ravna ploskovna črka »N« ali »S« (višina 1, središče v izhodišču), izvlečena za `globina`. */
function crkaG(THREE, crka, globina) {
  const w = 0.17, liki = [];
  const lik = (tocke) => { const s = new THREE.Shape(); tocke.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y))); s.closePath(); liki.push(s); };
  if (crka === "N") {
    const x = 0.3;
    lik([[-x - w / 2, -0.5], [-x + w / 2, -0.5], [-x + w / 2, 0.5], [-x - w / 2, 0.5]]);
    lik([[x - w / 2, -0.5], [x + w / 2, -0.5], [x + w / 2, 0.5], [x - w / 2, 0.5]]);
    lik([[-x - w / 2, 0.5], [-x + w / 2, 0.5], [x + w / 2, -0.5], [x - w / 2, -0.5]]);
  } else {
    // sredinska črta: zgornji lok (središče (0, 0,25)) od 20° do 270°, spodnji (0, −0,25) od 90° do −160°
    const c = [], r = 0.25 - w / 4;
    for (let i = 0; i <= 24; i++) { const f = ((20 + (250 * i) / 24) * Math.PI) / 180; c.push([1.15 * r * Math.cos(f), 0.25 + r * Math.sin(f)]); }
    for (let i = 1; i <= 24; i++) { const f = ((90 - (250 * i) / 24) * Math.PI) / 180; c.push([1.15 * r * Math.cos(f), -0.25 + r * Math.sin(f)]); }
    const L = [], R = [];
    for (let i = 0; i < c.length; i++) {
      const a = c[Math.max(0, i - 1)], b = c[Math.min(c.length - 1, i + 1)];
      const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
      const nx = -dy / l, ny = dx / l;
      L.push([c[i][0] + (nx * w) / 2, c[i][1] + (ny * w) / 2]);
      R.push([c[i][0] - (nx * w) / 2, c[i][1] - (ny * w) / 2]);
    }
    lik([...L, ...R.reverse()]);
  }
  const g = new THREE.ExtrudeGeometry(liki, { depth: globina, bevelEnabled: false, curveSegments: 4 });
  g.computeBoundingBox();
  const bb = g.boundingBox;
  g.translate(-(bb.min.x + bb.max.x) / 2, -(bb.min.y + bb.max.y) / 2, 0);
  return g;
}

export function zgradi(THREE, ctx = {}) {
  const visoka = ctx.kakovost !== "nizka";
  // model nima samodejnega gibanja, zato ctx.gibanje ne potrebuje
  const z0 = ctx.zacetek || {};
  const num = (v, d, lo, hi) => (v !== undefined && Number.isFinite(+v) ? Math.min(hi, Math.max(lo, +v)) : d);
  const st = {
    vir: VIRI.some((o) => o[0] === z0.vir) ? z0.vir : "magnet",
    I: num(z0.I, 10, 1, 20),
    N: Math.round(num(z0.N, 20, 5, 50)),
    smer: z0.smer === "nazaj" ? "nazaj" : "naprej",
    kompasi: z0.kompasi === true || z0.kompasi === "1",
    k: [num(z0.kx, 0, -5, 5), num(z0.ky, 4, -5, 5), num(z0.kz, 5, -5, 5)], // cm, v območju silnic
  };
  const sg = () => (st.smer === "nazaj" ? -1 : 1);
  const group = new THREE.Group();
  group.name = "magnetno-polje";
  const smeti = new Set();
  const mat = (o) => { const m = new THREE.MeshPhysicalMaterial(o); smeti.add(m); return m; };
  const geo = (g) => { smeti.add(g); return g; };

  const matN = mat({ color: BARVE.sever, roughness: 0.32, clearcoat: 0.5, clearcoatRoughness: 0.25 });
  const matS = mat({ color: BARVE.jug, roughness: 0.32, clearcoat: 0.5, clearcoatRoughness: 0.25 });
  const matCrka = mat({ color: BARVE.crka, roughness: 0.4, clearcoat: 0.3 });
  const matBaker = mat({ color: BARVE.baker, roughness: 0.3, metalness: 0.75, clearcoat: 0.35 });
  const matTok = mat({ color: BARVE.tok, roughness: 0.35, clearcoat: 0.4, emissive: "#4a2a00" });
  const matNotr = new THREE.MeshStandardMaterial({ color: BARVE.notranjost, transparent: true, opacity: 0.1, depthWrite: false, side: THREE.DoubleSide, roughness: 0.5 });
  smeti.add(matNotr);
  const matSilnice = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true });
  smeti.add(matSilnice);
  const matStozec = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.45, emissive: "#16233d" });
  smeti.add(matStozec);
  const matIgla = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.4, metalness: 0.1 });
  smeti.add(matIgla);
  const stozecG = geo(new THREE.ConeGeometry(0.018, 0.05, visoka ? 14 : 8));
  const tokG = geo(new THREE.ConeGeometry(0.042, 0.11, visoka ? 20 : 10));
  const crkaN = geo(crkaG(THREE, "N", 0.007)), crkaS = geo(crkaG(THREE, "S", 0.007));

  // magnetna igla: severni del rdeč (+x), južni bel (−x)
  const iglaG = (() => {
    const s = visoka ? 10 : 6;
    const a = new THREE.ConeGeometry(0.012, 0.045, s).rotateZ(-Math.PI / 2).translate(0.0225, 0, 0);
    const b = new THREE.ConeGeometry(0.012, 0.045, s).rotateZ(Math.PI / 2).translate(-0.0225, 0, 0);
    const n = [a, b].map((g) => g.toNonIndexed());
    const pos = [], nor = [], col = [];
    n.forEach((g, i) => {
      const c = new THREE.Color(i === 0 ? BARVE.igla : BARVE.iglaJug);
      pos.push(...g.attributes.position.array); nor.push(...g.attributes.normal.array);
      for (let k = 0; k < g.attributes.position.count; k++) col.push(c.r, c.g, c.b);
    });
    [a, b, ...n].forEach((g) => g.dispose());
    const out = new THREE.BufferGeometry();
    out.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    out.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
    out.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    return geo(out);
  })();

  // ---- viri (zgrajeni ob prvi rabi)
  const viri = {};
  const xAx = new THREE.Vector3(1, 0, 0), yAx = new THREE.Vector3(0, 1, 0);
  function crkaMesh(g, m, x, y, z, ry = 0, rx = 0, s = 0.1, debelina = 1) {
    const o = new THREE.Mesh(g, m);
    o.scale.set(s, s, debelina); o.position.set(x, y, z); o.rotation.set(rx, ry, 0, "YXZ");
    return o;
  }
  function zgradiVir(ime) {
    const g = new THREE.Group();
    const d = { g };
    if (ime === "magnet") {
      const L = MAGNET.dolzina / ENOTA, h = MAGNET.pol / ENOTA;
      const nG = geo(new THREE.BoxGeometry(L / 2, 2 * h, 2 * h).translate(L / 4, 0, 0));
      const sG = geo(new THREE.BoxGeometry(L / 2, 2 * h, 2 * h).translate(-L / 4, 0, 0));
      d.n = [new THREE.Mesh(nG, matN)]; d.s = [new THREE.Mesh(sG, matS)];
      for (const [arr, cg, x] of [[d.n, crkaN, L / 4], [d.s, crkaS, -L / 4]]) {
        arr.push(crkaMesh(cg, matCrka, x, 0, h - 0.001, 0, 0, 0.11));
        arr.push(crkaMesh(cg, matCrka, x, 0, -h + 0.001, Math.PI, 0, 0.11));
        arr.push(crkaMesh(cg, matCrka, x, h - 0.001, 0, 0, -Math.PI / 2, 0.11));
      }
      g.add(...d.n, ...d.s);
    } else if (ime === "vodnik") {
      d.zica = new THREE.Mesh(geo(new THREE.CylinderGeometry(0.02, 0.02, 1.8, visoka ? 24 : 12)), matBaker);
      d.tok = [-0.55, 0.05, 0.6].map((y) => { const m = new THREE.Mesh(tokG, matTok); m.position.y = y; return m; });
      g.add(d.zica, ...d.tok);
    } else if (ime === "zanka") {
      const a = ZANKA.polmer / ENOTA;
      d.zica = new THREE.Mesh(geo(new THREE.TorusGeometry(a, 0.013, visoka ? 14 : 8, visoka ? 120 : 64).rotateY(Math.PI / 2)), matBaker);
      d.tokPol = [[0, a, 0, 0, 0, 1], [0, -a, 0, 0, 0, -1], [0, 0, a, 0, -1, 0], [0, 0, -a, 0, 1, 0]];
      d.tok = d.tokPol.map(() => new THREE.Mesh(tokG, matTok));
      g.add(d.zica, ...d.tok);
    } else {
      const R = TULJAVA.polmer / ENOTA, L = TULJAVA.dolzina / ENOTA;
      d.notr = new THREE.Mesh(geo(new THREE.CylinderGeometry(0.82 * R, 0.82 * R, 0.8 * L, visoka ? 40 : 20, 1, true).rotateZ(Math.PI / 2)), matNotr);
      d.notr.renderOrder = 2;
      d.crkaP = crkaMesh(crkaN, matN, 0, 0.3, -0.01, 0, 0, 0.1, 3);
      d.crkaM = crkaMesh(crkaS, matS, 0, 0.3, -0.01, 0, 0, 0.1, 3);
      d.tok = [0, 1, 2].map(() => new THREE.Mesh(tokG, matTok));
      g.add(d.notr, d.crkaP, d.crkaM, ...d.tok);
      d.N = 0;
    }
    group.add(g);
    viri[ime] = d;
    return d;
  }

  /** Ovoji tuljave (vijačnica) za trenutni N in puščice toka. */
  function tuljavaN(d) {
    const R = TULJAVA.polmer / ENOTA, L = TULJAVA.dolzina / ENOTA, N = st.N;
    if (d.N !== N) {
      if (d.zica) { d.g.remove(d.zica); d.zica.geometry.dispose(); }
      const krivulja = new THREE.Curve();
      krivulja.getPoint = (t, v = new THREE.Vector3()) => v.set(-L / 2 + t * L, R * Math.cos(2 * Math.PI * N * t), R * Math.sin(2 * Math.PI * N * t));
      const korakOvoja = L / N;
      d.zica = new THREE.Mesh(new THREE.TubeGeometry(krivulja, N * (visoka ? 24 : 14), Math.min(0.012, 0.36 * korakOvoja), visoka ? 8 : 5, false), matBaker);
      d.g.add(d.zica);
      d.N = N;
    }
    const s = sg();
    [0.2, 0.5, 0.8].forEach((f, k) => {
      const i = Math.min(N - 1, Math.floor(f * N)), t = (i + 0.25) / N;
      const m = d.tok[k], rz = Math.min(0.012, (0.36 * L) / N);
      m.position.set(-L / 2 + t * L, 0, R + rz + 0.012);
      m.quaternion.setFromUnitVectors(yAx, new THREE.Vector3(L * s, -2 * Math.PI * N * R * s, 0).normalize());
    });
    // tuljava je kot magnet: severni pol tam, kjer silnice izstopajo
    d.crkaP.position.x = 0.62 * s; d.crkaM.position.x = -0.62 * s;
  }

  // ---- silnice in puščice
  const crtePredp = new Map();
  let silniceM = null, puscM = null, crte = [];
  const cT = new THREE.Color(BARVE.silnicaTemna), cS = new THREE.Color(BARVE.silnicaSvetla), tmpC = new THREE.Color();
  const faktor = () => (st.vir === "magnet" ? 1 : st.I);
  const svetlost = (B) => Math.max(0, Math.min(1, (Math.log10(Math.max(B, 1e-9)) + 6) / 4)); // 1 µT → 0, 10 mT → 1
  const zatemni = (p) => 1 - smoothstep(R_POGLED - 0.2, R_POGLED, len3(p));
  function silniceVidne() {
    for (const m of [silniceM, puscM]) if (m) { group.remove(m); if (m.isInstancedMesh) m.dispose(); else m.geometry.dispose(); }
    const kljuc = st.vir === "tuljava" ? `tuljava|${st.N}` : st.vir;
    if (!crtePredp.has(kljuc)) crtePredp.set(kljuc, silniceB(st.vir, { N: st.N, visoka }));
    crte = crtePredp.get(kljuc);
    const f = faktor();
    const g = cevi(THREE, crte, visoka ? 0.0055 : 0.0065, visoka ? 6 : 4, (c, i) => {
      tmpC.copy(cT).lerp(cS, 0.15 + 0.85 * svetlost(c.jakost[i] * f));
      return [tmpC.r, tmpC.g, tmpC.b, zatemni(c.tocke[i])];
    });
    silniceM = new THREE.Mesh(g, matSilnice);
    silniceM.renderOrder = 1;
    silniceM.name = "silnice";
    group.add(silniceM);
    const obrni = st.vir !== "magnet" && sg() < 0;
    const pus = strelice(crte, 0.3, 0.15, (p) => len3(p) > R_POGLED - 0.1 || vTelesu(p));
    puscM = new THREE.InstancedMesh(stozecG, matStozec, Math.max(1, pus.length));
    puscM.count = pus.length;
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), dv = new THREE.Vector3(), one = new THREE.Vector3(1, 1, 1), pv = new THREE.Vector3();
    pus.forEach((a, k) => {
      dv.set(...a.d); if (obrni) dv.negate();
      q.setFromUnitVectors(yAx, dv); pv.set(...a.p);
      m4.compose(pv, q, one); puscM.setMatrixAt(k, m4);
      tmpC.copy(cT).lerp(cS, 0.35 + 0.65 * svetlost(crte[a.ci].jakost[a.i] * f));
      puscM.setColorAt(k, tmpC);
    });
    puscM.instanceMatrix.needsUpdate = true;
    if (puscM.instanceColor) puscM.instanceColor.needsUpdate = true;
    puscM.computeBoundingSphere();
    puscM.name = "puscice";
    group.add(puscM);
  }
  function vTelesu(p) {
    if (st.vir === "magnet") return Math.abs(p[0]) < MAGNET.dolzina / 2 / ENOTA + 0.01 && Math.abs(p[1]) < MAGNET.pol / ENOTA + 0.01 && Math.abs(p[2]) < MAGNET.pol / ENOTA + 0.01;
    if (st.vir === "vodnik") return Math.hypot(p[0], p[2]) < 0.05;
    return false;
  }

  // ---- kompasi
  const mreza = [];
  for (let x = -0.75; x <= 0.751; x += 0.15) for (let z = -0.75; z <= 0.751; z += 0.15) if (Math.hypot(x, z) <= 0.8) mreza.push([x, z]);
  const kompasiM = new THREE.InstancedMesh(iglaG, matIgla, mreza.length);
  kompasiM.name = "kompasi";
  group.add(kompasiM);
  const kompas = new THREE.Group();
  const iglaVelika = new THREE.Mesh(iglaG, matIgla);
  iglaVelika.scale.set(2.8, 2.2, 2.2);
  const os = new THREE.Mesh(geo(new THREE.SphereGeometry(0.016, 16, 10)), mat({ color: "#cfd5df", roughness: 0.25, metalness: 0.8 }));
  const obroc = new THREE.Mesh(geo(new THREE.TorusGeometry(0.14, 0.006, 8, visoka ? 64 : 32)), mat({ color: "#c3ccda", roughness: 0.3, metalness: 0.5, transparent: true, opacity: 0.7 }));
  kompas.add(iglaVelika, os, obroc);
  group.add(kompas);
  let virTren = null;
  const Bt = (p) => poljeB(virTren, p[0], p[1], p[2], [0, 0, 0]);
  function kompasiVidni() {
    kompasiM.visible = st.kompasi;
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), dv = new THREE.Vector3(), one = new THREE.Vector3(1, 1, 1), pv = new THREE.Vector3();
    if (st.kompasi) {
      let n = 0;
      for (const [x, z] of mreza) {
        if (izlociKompas(st.vir, x, z)) continue;
        const B = Bt([x * ENOTA, 0, z * ENOTA]);
        dv.set(B[0], B[1], B[2]).normalize();
        q.setFromUnitVectors(xAx, dv); pv.set(x, 0, z);
        m4.compose(pv, q, one); kompasiM.setMatrixAt(n++, m4);
      }
      kompasiM.count = n;
      kompasiM.instanceMatrix.needsUpdate = true;
      kompasiM.computeBoundingSphere();
    }
    const p = st.k.map((c) => c * 0.01), B = Bt(p);
    kompas.position.set(p[0] / ENOTA, p[1] / ENOTA, p[2] / ENOTA);
    dv.set(B[0], B[1], B[2]);
    if (dv.lengthSq() > 0) iglaVelika.quaternion.setFromUnitVectors(xAx, dv.normalize());
    // obroč leži v navpični ravnini skozi iglo (kot okvir inklinacijske igle)
    const n2 = new THREE.Vector3().crossVectors(dv, yAx);
    if (n2.lengthSq() > 1e-6) obroc.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), n2.normalize());
    else obroc.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(1, 0, 0));
  }

  // ---- deli
  const out = { group, deli: [], nadzor: [], merilo: info.merilo };
  function dele() {
    const d = viri[st.vir], deli = [];
    const s = sg();
    if (st.vir === "magnet") {
      deli.push(
        { id: "severni-pol", ime: "Severni pol", barva: BARVE.sever, opis: "Iz severnega pola silnice izstopajo; ta konec magneta se obrne proti severu Zemlje.", meshes: d.n, tocka: [0.38, 0.09, 0.09] },
        { id: "juzni-pol", ime: "Južni pol", barva: BARVE.jug, opis: "V južni pol silnice vstopajo; nasprotna pola se privlačita, enaka odbijata.", meshes: d.s, tocka: [-0.38, 0.09, 0.09] },
      );
    } else if (st.vir === "vodnik") {
      deli.push(
        { id: "vodnik", ime: "Raven vodnik", barva: BARVE.baker, opis: "Bakrena žica s tokom; okoli nje so silnice krogi, polje slabi z oddaljenostjo.", meshes: [d.zica], tocka: [0.02, -0.3, 0] },
        { id: "smer-toka", ime: "Smer toka", barva: BARVE.tok, opis: "Pravilo desne roke: palec kaže smer toka, ukrivljeni prsti smer silnic.", meshes: d.tok, tocka: [0, s > 0 ? 0.65 : 0.55, 0.03] },
      );
    } else if (st.vir === "zanka") {
      const a = ZANKA.polmer / ENOTA;
      deli.push(
        { id: "vodnik", ime: "Krožna zanka", barva: BARVE.baker, opis: "Ena zanka žice s tokom; v njenem središču je polje pravokotno na zanko.", meshes: [d.zica], tocka: [0, -a * 0.71, a * 0.71] },
        { id: "smer-toka", ime: "Smer toka", barva: BARVE.tok, opis: "Pravilo desne roke: prsti v smeri toka po zanki, palec kaže smer polja v sredini.", meshes: d.tok, tocka: [0, a + 0.02, 0] },
      );
    } else {
      const R = TULJAVA.polmer / ENOTA;
      deli.push(
        { id: "tuljava", ime: "Tuljava (ovoji)", barva: BARVE.baker, opis: `Žica, navita v ${st.N} ovojev; polja posameznih ovojev se seštejejo.`, meshes: [d.zica], tocka: [-0.3, R, 0] },
        { id: "smer-toka", ime: "Smer toka", barva: BARVE.tok, opis: "Pravilo desne roke: prsti v smeri toka po ovojih, palec kaže proti severnemu polu.", meshes: d.tok, tocka: d.tok[1].position.toArray() },
        { id: "notranjost", ime: "Notranjost tuljave (homogeno polje)", barva: BARVE.notranjost, opis: "V notranjosti so silnice skoraj vzporedne in enako goste, zato je polje homogeno.", meshes: [d.notr], tocka: [0.15, 0, 0] },
        { id: "severni-pol", ime: "Severni pol tuljave", barva: BARVE.sever, opis: "Na tem koncu silnice izstopajo iz tuljave, tako kot pri magnetu.", meshes: [d.crkaP], tocka: d.crkaP.position.toArray() },
        { id: "juzni-pol", ime: "Južni pol tuljave", barva: BARVE.jug, opis: "Na tem koncu silnice vstopajo v tuljavo, tako kot pri magnetu.", meshes: [d.crkaM], tocka: d.crkaM.position.toArray() },
      );
    }
    const c0 = crte.find((c) => c.tocke.some((p) => len3(p) > 0.35 && len3(p) < 0.65 && Math.abs(p[2]) < 0.05)) || crte[0];
    const tp = c0.tocke.find((p) => len3(p) > 0.35 && len3(p) < 0.65 && Math.abs(p[2]) < 0.05) || c0.tocke[Math.floor(c0.tocke.length / 2)];
    deli.push({ id: "silnice", ime: "Silnice", barva: BARVE.silnicaSvetla, opis: "Sklenjene črte, ki kažejo smer polja; svetlejše so tam, kjer je polje močnejše.", meshes: [silniceM, puscM], tocka: tp.slice() });
    deli.push({
      id: "kompas", ime: st.kompasi ? "Kompasi" : "Kompas", barva: BARVE.igla,
      opis: "Magnetna igla se zasuče v smer polja; rdeča konica (severni pol) kaže smer silnic.",
      meshes: st.kompasi ? [iglaVelika, kompasiM] : [iglaVelika], tocka: kompas.position.toArray().map((v, i) => v + (i === 1 ? 0.04 : 0)),
    });
    out.deli = deli;
  }

  function vse() {
    for (const [ime, d] of Object.entries(viri)) d.g.visible = ime === st.vir;
    const d = viri[st.vir] || zgradiVir(st.vir);
    d.g.visible = true;
    const s = sg();
    if (st.vir === "vodnik") d.tok.forEach((m) => m.quaternion.setFromUnitVectors(yAx, new THREE.Vector3(0, s, 0)));
    if (st.vir === "zanka") d.tok.forEach((m, k) => { const t = d.tokPol[k]; m.position.set(t[0], t[1], t[2]); m.quaternion.setFromUnitVectors(yAx, new THREE.Vector3(t[3] * s, t[4] * s, t[5] * s)); });
    if (st.vir === "tuljava") tuljavaN(d);
    virTren = vir(st.vir, { I: st.I, N: st.N, smer: s });
    silniceVidne();
    kompasiVidni();
    dele();
  }

  // ---- izpisi
  const polozajK = () => st.k.map((c) => c * 0.01);
  const izpisFormula = () => {
    const p = polozajK(), I = st.I;
    if (st.vir === "vodnik") {
      const r = Math.max(1e-4, Math.hypot(p[0], p[2]));
      return `B = μ₀I/(2πr) = ${besediloB((MU0 * I) / (2 * Math.PI * r))} pri r = ${dec(r * 100, 1)} cm (I = ${lepo(I)} A)`;
    }
    if (st.vir === "tuljava") {
      const n = st.N / TULJAVA.dolzina, B0 = len3(Bt([0, 0, 0]));
      return `B = μ₀NI/l = ${besediloB(MU0 * n * I)} (dolga tuljava, N = ${st.N}, l = 10 cm); izračunano v središču: ${besediloB(B0)}`;
    }
    if (st.vir === "zanka") return `B = μ₀I/(2R) = ${besediloB((MU0 * I) / (2 * ZANKA.polmer))} v središču zanke (R = 3 cm, I = ${lepo(I)} A)`;
    return `Feritni magnet 8 cm × 1,6 cm × 1,6 cm, M = 3 · 10⁵ A/m; v središču B = ${besediloB(len3(Bt([0, 0, 0])))}`;
  };
  const izpisKompas = () => {
    const p = polozajK(), B = len3(Bt(p));
    return `B = ${besediloB(B)} na mestu kompasa (${dec(st.k[0], 1)}; ${dec(st.k[1], 1)}; ${dec(st.k[2], 1)}) cm, po Biot–Savartu`;
  };
  const izpisPravilo = () => {
    if (st.vir === "magnet") return "Zunaj magneta silnice tečejo od severnega k južnemu polu, v njem pa od južnega k severnemu.";
    if (st.vir === "vodnik") return `Tok teče ${sg() > 0 ? "navzgor" : "navzdol"}: palec desne roke v smeri toka, prsti kažejo smer silnic.`;
    if (st.vir === "zanka") return "Pravilo desne roke: prsti v smeri toka po zanki, palec kaže smer polja v sredini zanke.";
    return "Pravilo desne roke: prsti v smeri toka po ovoju, palec kaže smer polja v notranjosti (proti severnemu polu).";
  };

  const posodobi = (fn) => (v) => { fn(v); vse(); };
  out.nadzor = [
    { tip: "izbira", id: "vir", oznaka: "Vir polja", moznosti: VIRI, vrednost: st.vir, ob: posodobi((v) => { if (VIRI.some((o) => o[0] === v)) st.vir = v; }) },
    { tip: "drsnik", id: "I", oznaka: "Tok I (A)", min: 1, max: 20, korak: 1, vrednost: st.I, vidno: () => st.vir !== "magnet", ob: posodobi((v) => { st.I = Math.min(20, Math.max(1, +v || 1)); }) },
    { tip: "drsnik", id: "N", oznaka: "Število ovojev N (tuljava)", min: 5, max: 50, korak: 5, vrednost: st.N, vidno: () => st.vir === "tuljava", ob: posodobi((v) => { st.N = Math.min(50, Math.max(5, Math.round(+v) || 5)); }) },
    { tip: "izbira", id: "smer", oznaka: "Smer toka", moznosti: [["naprej", "Navzgor"], ["nazaj", "Navzdol"]], vrednost: st.smer, vidno: () => st.vir === "vodnik", ob: posodobi((v) => { st.smer = v === "nazaj" ? "nazaj" : "naprej"; }) },
    // zanka in tuljava: gledano z desne (s strani +x, kot v privzetem pogledu) teče pozitivni tok v nasprotni smeri urinega kazalca
    { tip: "izbira", id: "smerKroga", oznaka: "Smer toka (gledano z desne)", moznosti: [["naprej", "Nasprotno urinemu kazalcu"], ["nazaj", "V smeri urinega kazalca"]], vrednost: st.smer, vidno: () => st.vir === "zanka" || st.vir === "tuljava", ob: posodobi((v) => { st.smer = v === "nazaj" ? "nazaj" : "naprej"; }) },
    { tip: "stikalo", id: "kompasi", oznaka: "Mreža kompasov", vrednost: st.kompasi, ob: (v) => { st.kompasi = !!v; kompasiVidni(); dele(); } },
    { tip: "drsnik", id: "kx", oznaka: "Kompas x (cm)", min: -5, max: 5, korak: 0.5, vrednost: st.k[0], ob: (v) => { st.k[0] = +v || 0; kompasiVidni(); dele(); } },
    { tip: "drsnik", id: "ky", oznaka: "Kompas y (cm)", min: -5, max: 5, korak: 0.5, vrednost: st.k[1], ob: (v) => { st.k[1] = +v || 0; kompasiVidni(); dele(); } },
    { tip: "drsnik", id: "kz", oznaka: "Kompas z (cm)", min: -5, max: 5, korak: 0.5, vrednost: st.k[2], ob: (v) => { st.k[2] = +v || 0; kompasiVidni(); dele(); } },
    { tip: "izpis", id: "formula", oznaka: "Gostota magnetnega polja", vrednost: izpisFormula },
    { tip: "izpis", id: "kompasB", oznaka: "Kompas", vrednost: izpisKompas },
    { tip: "izpis", id: "pravilo", oznaka: "Smer polja", vrednost: izpisPravilo },
  ];
  out.dispose = () => {
    for (const m of [silniceM, puscM]) if (m) { if (m.isInstancedMesh) m.dispose(); else m.geometry.dispose(); }
    kompasiM.dispose();
    const t = viri.tuljava;
    if (t && t.zica) t.zica.geometry.dispose();
    for (const s of smeti) s.dispose();
  };
  vse();
  return out;
}

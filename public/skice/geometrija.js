// Geometrija v ravnini: računi za skice (preverjeni v test/skice.test.js). Koordinate v enotah, y navzgor.
// Oznake kot na karticah: stranice a = BC, b = CA, c = AB, koti α, β, γ, ploščina S, s = o/2.
export const rad = (d) => (d * Math.PI) / 180;
export const stop = (r) => (r * 180) / Math.PI;
const dol = (P, Q) => Math.hypot(P[0] - Q[0], P[1] - Q[1]);
const omeji = (v) => Math.min(1, Math.max(-1, v));

export function trikotnik(A, B, C) {
  const a = dol(B, C), b = dol(C, A), c = dol(A, B);
  const kot = (x, y, z) => (y && z ? stop(Math.acos(omeji((y * y + z * z - x * x) / (2 * y * z)))) : 0);
  const alfa = kot(a, b, c), beta = kot(b, c, a), gama = kot(c, a, b);
  const bx = B[0] - A[0], by = B[1] - A[1], cx = C[0] - A[0], cy = C[1] - A[1];
  const det = bx * cy - by * cx;
  const S = Math.abs(det) / 2, o = a + b + c, s = o / 2;
  const izrojen = S < 1e-9;
  // Središče očrtane krožnice O (presečišče simetral) in včrtane I (utežene z nasprotnimi stranicami).
  const d = 2 * det;
  const O = izrojen ? null : [A[0] + (cy * (bx * bx + by * by) - by * (cx * cx + cy * cy)) / d, A[1] + (bx * (cx * cx + cy * cy) - cx * (bx * bx + by * by)) / d];
  const I = [(a * A[0] + b * B[0] + c * C[0]) / o, (a * A[1] + b * B[1] + c * C[1]) / o];
  // Nožišče višine iz C na premico AB.
  const t = c ? (cx * bx + cy * by) / (c * c) : 0;
  const N = [A[0] + t * bx, A[1] + t * by];
  return { a, b, c, alfa, beta, gama, o, s, S, izrojen, R: izrojen ? Infinity : (a * b * c) / (4 * S), r: izrojen ? 0 : S / s, O, I, N, vc: c ? (2 * S) / c : 0, t };
}

// Pravilni n-kotnik z R = 1: stranica, polmer včrtane krožnice, ploščina, diagonale, notranji koti.
export function nKotnik(n) {
  const fi = Math.PI / n;
  return { a: 2 * Math.sin(fi), r: Math.cos(fi), S: (n / 2) * Math.sin(2 * fi), d: (n * (n - 3)) / 2, vsota: (n - 2) * 180, kot: ((n - 2) * 180) / n, srediscni: 360 / n };
}

// Krožni lok in izsek: l = πrα/180°, S = πr²α/360°.
export const izsek = (r, alfa) => ({ l: (Math.PI * r * alfa) / 180, S: (Math.PI * r * r * alfa) / 360 });

// Enakostranični trikotnik s stranico a: višina, ploščina, polmera (težišče deli višino v razmerju 2 : 1).
export function enakostranicni(a) {
  const v = (a * Math.sqrt(3)) / 2;
  return { o: 3 * a, v, S: (a * a * Math.sqrt(3)) / 4, R: (2 * v) / 3, r: v / 3 };
}

// Pravokotni trikotnik nad premerom AB = c (Talesova krožnica), C pri kotu φ od središča:
// a = BC, b = AC, nožišče višine N, a₁ = NB (pravokotna projekcija a na c), b₁ = AN.
export function talesov(c, fi) {
  const A = [-c / 2, 0], B = [c / 2, 0], C = [(c / 2) * Math.cos(rad(fi)), (c / 2) * Math.sin(rad(fi))];
  const a = dol(B, C), b = dol(A, C), N = [C[0], 0];
  return { A, B, C, N, a, b, c, vc: C[1], a1: B[0] - N[0], b1: N[0] - A[0] };
}

// Štirikotniki kot na kartici (oglišča A, B, C, D v nasprotni smeri urinega kazalca, A spodaj levo).
export function stirikotnik(lik, p) {
  const { a = 4, b = 3, c = 2, v = 2, alfa = 60, e = 4, f = 3 } = p;
  const s = Math.sin(rad(alfa)), k = Math.cos(rad(alfa));
  switch (lik) {
    case "kvadrat":
      return { T: [[0, 0], [a, 0], [a, a], [0, a]], o: 4 * a, S: a * a, d: a * Math.SQRT2 };
    case "pravokotnik":
      return { T: [[0, 0], [a, 0], [a, b], [0, b]], o: 2 * a + 2 * b, S: a * b, d: Math.hypot(a, b) };
    case "paralelogram": {
      const T = [[0, 0], [a, 0], [a + b * k, b * s], [b * k, b * s]];
      return { T, o: 2 * a + 2 * b, va: b * s, S: a * b * s, e: dol(T[0], T[2]), f: dol(T[1], T[3]) };
    }
    case "romb": {
      const T = [[0, 0], [a, 0], [a + a * k, a * s], [a * k, a * s]];
      const E = dol(T[0], T[2]), F = dol(T[1], T[3]);
      return { T, o: 4 * a, v: a * s, S: a * a * s, e: E, f: F, Sef: (E * F) / 2 };
    }
    case "trapez": {
      // Enakokraki trapez: osnovnici a (spodaj) in c (zgoraj), kraka b = d.
      const x = (a - c) / 2, T = [[0, 0], [a, 0], [x + c, v], [x, v]];
      const kr = Math.hypot(x, v);
      return { T, b: kr, d: kr, o: a + c + 2 * kr, s: (a + c) / 2, S: ((a + c) * v) / 2 };
    }
    case "deltoid": {
      // Simetrijska diagonala e navpično, diagonala f jo seka v tretjini od vrha.
      const T = [[0, 0], [f / 2, (2 * e) / 3], [0, e], [-f / 2, (2 * e) / 3]];
      const A = Math.hypot(f / 2, e / 3), B = Math.hypot(f / 2, (2 * e) / 3);
      return { T, a: A, b: B, o: 2 * A + 2 * B, S: (e * f) / 2 };
    }
  }
  return null;
}

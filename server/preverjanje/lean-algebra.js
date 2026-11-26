// Točna algebra za primerjavo prevoda z izvirnikom (PV-13, docs/preverjanje.md »Prevod v Lean«). Brez vzorčenja in
// brez tolerance: racionalne funkcije več spremenljivk s koeficienti v Q(√2, √3, …) (vsota q·√m, m brez kvadratov).
// Kjer točen zapis ni mogoč (koren ali absolutna vrednost izraza s spremenljivko, koren iracionalnega števila,
// prevelik izraz), vrne null; klicatelj tedaj zahteva enak zapis (zavrnitev je varna smer).
//
// Drevo izraza je isto kot v lean-izraz.js: num, var, neg, add, sub, mul, div, pow (n celo), sqrt, abs.

import { Q, vrednost, velikost } from "./lean-izraz.js";

export { velikost };

const NAJVEC_BITOV = 20000; // ocena velikosti izraza (bitov), nad tem izraz ni primerjan
const NAJVEC_STOPNJA = 256;
const NAJVEC_CLENOV = 4000;
const NAJVEC_KORENOV = 32;

class Prevelik extends Error {}

// ---------- vsota korenov: Σ q_m · √m (m celo, brez kvadratov; m = 1 je racionalni del) ----------
function brezKvadratov(n) {
  // n > 0 → { k, m }: n = k² · m, m brez kvadratov; null, če tega ni mogoče zanesljivo ugotoviti
  let k = 1n;
  let m = 1n;
  let r = n;
  for (let p = 2n; p <= 1000000n && p * p <= r; p += p === 2n ? 1n : 2n) {
    let e = 0;
    while (r % p === 0n) (r /= p), e++;
    k *= p ** BigInt(e >> 1);
    if (e & 1) m *= p;
  }
  if (r > 1n) {
    // r nima prafaktorjev ≤ 10⁶: pod 10¹⁸ je praštevilo, kvadrat praštevila ali zmnožek dveh različnih
    if (r >= 10n ** 18n) return null;
    const s = isqrt(r);
    if (s * s === r) k *= s;
    else m *= r;
  }
  return { k, m };
}
function isqrt(n) {
  if (n < 2n) return n;
  let x = BigInt(Math.floor(Math.sqrt(Number(n))));
  if (x === 0n) x = 1n;
  for (;;) {
    const y = (x + n / x) >> 1n;
    if ((y > x ? y - x : x - y) <= 1n) {
      let r = y;
      while (r * r > n) r--;
      while ((r + 1n) * (r + 1n) <= n) r++;
      return r;
    }
    x = y;
  }
}

export class S {
  constructor(m = new Map()) {
    this.m = m; // ključ: String(m), vrednost: Q ≠ 0
  }
  static q(q) {
    return new S(q.isZero() ? new Map() : new Map([["1", q]]));
  }
  isZero() {
    return this.m.size === 0;
  }
  rac() {
    // racionalna vrednost ali null
    if (this.isZero()) return new Q(0n);
    return this.m.size === 1 && this.m.has("1") ? this.m.get("1") : null;
  }
  add(o) {
    const m = new Map(this.m);
    for (const [k, v] of o.m) {
      const w = m.has(k) ? m.get(k).add(v) : v;
      if (w.isZero()) m.delete(k);
      else m.set(k, w);
    }
    return new S(m);
  }
  neg() {
    return new S(new Map([...this.m].map(([k, v]) => [k, v.neg()])));
  }
  sub(o) {
    return this.add(o.neg());
  }
  mul(o) {
    let r = new S();
    for (const [k1, v1] of this.m)
      for (const [k2, v2] of o.m) {
        const a = BigInt(k1);
        const b = BigInt(k2);
        const g = gcd(a, b);
        // √a·√b = g·√(a/g · b/g); a/g in b/g sta tuja in brez kvadratov
        r = r.add(new S(new Map([[String((a / g) * (b / g)), v1.mul(v2).mul(new Q(g))]])));
      }
    if (r.m.size > NAJVEC_KORENOV) throw new Prevelik();
    return r;
  }
  eq(o) {
    return this.sub(o).isZero();
  }
  /** Predznak (−1, 0, 1) ali null, če je vrednost premajhna za zanesljivo oceno. */
  predznak() {
    if (this.isZero()) return 0;
    const q = this.rac();
    if (q) return q.sign();
    const SK = 10n ** 80n;
    let v = 0n;
    for (const [k, c] of this.m) v += (c.n * isqrt(BigInt(k) * SK * SK)) / c.d;
    const meja = SK / 10n ** 40n;
    if (v > meja) return 1;
    if (v < -meja) return -1;
    return null;
  }
  /** √q za racionalno q ≥ 0, sicer null. */
  static koren(q) {
    if (q.sign() < 0) return null;
    if (q.isZero()) return new S();
    const r = brezKvadratov(q.n * q.d); // √(n/d) = √(n·d)/d
    if (!r) return null;
    return new S(new Map([[String(r.m), new Q(r.k, q.d)]]));
  }
}
function gcd(a, b) {
  while (b) [a, b] = [b, a % b];
  return a < 0n ? -a : a;
}

// ---------- polinomi več spremenljivk s koeficienti S ----------
// Polinom: Map(ključ eksponentov "e1,e2,…" → S ≠ 0); spremenljivke po vrstnem redu seznama imena.
const kljuc = (exps) => exps.join(",");
const eksponenti = (k) => (k === "" ? [] : k.split(",").map(Number));
function pKonst(s, n) {
  return s.isZero() ? new Map() : new Map([[kljuc(Array(n).fill(0)), s]]);
}
function pAdd(a, b) {
  const r = new Map(a);
  for (const [k, v] of b) {
    const w = r.has(k) ? r.get(k).add(v) : v;
    if (w.isZero()) r.delete(k);
    else r.set(k, w);
  }
  return r;
}
const pNeg = (a) => new Map([...a].map(([k, v]) => [k, v.neg()]));
function pMul(a, b) {
  let r = new Map();
  for (const [k1, v1] of a)
    for (const [k2, v2] of b) {
      const e1 = eksponenti(k1);
      const e2 = eksponenti(k2);
      const k = kljuc(e1.map((x, i) => x + e2[i]));
      const w = r.has(k) ? r.get(k).add(v1.mul(v2)) : v1.mul(v2);
      if (w.isZero()) r.delete(k);
      else r.set(k, w);
    }
  if (r.size > NAJVEC_CLENOV) throw new Prevelik();
  return r;
}
const pStopnja = (a) => Math.max(0, ...[...a.keys()].map((k) => eksponenti(k).reduce((s, x) => s + x, 0)));
const pKonstanten = (a) => [...a.keys()].every((k) => eksponenti(k).every((x) => x === 0));

// ---------- racionalna funkcija: { n, d } (d ni ničelni polinom) ----------
/**
 * Izraz → racionalna funkcija nad Q(√…) v spremenljivkah imena, ali null (koren/abs s spremenljivko, koren
 * iracionalnega števila, deljenje z ničelnim izrazom, 0⁰, prevelik izraz). Deljenje je mišljeno kot v matematiki:
 * kjer je imenovalec 0, izraz ni definiran (to preveri pokritost s pogoji, ne ta funkcija).
 */
export function racFunkcija(e, imena) {
  if (velikost(e) > NAJVEC_BITOV) return null;
  const n = imena.length;
  const ena = () => pKonst(S.q(new Q(1n)), n);
  const r = (x) => {
    switch (x.t) {
      case "num":
        return { n: pKonst(S.q(x.v), n), d: ena() };
      case "var": {
        const i = imena.indexOf(x.n);
        if (i < 0) return null;
        const exps = Array(n).fill(0);
        exps[i] = 1;
        return { n: new Map([[kljuc(exps), S.q(new Q(1n))]]), d: ena() };
      }
      case "neg": {
        const a = r(x.a);
        return a && { n: pNeg(a.n), d: a.d };
      }
      case "add":
      case "sub": {
        const a = r(x.a);
        const b = r(x.b);
        if (!a || !b) return null;
        const bn = x.t === "sub" ? pNeg(b.n) : b.n;
        return { n: pAdd(pMul(a.n, b.d), pMul(bn, a.d)), d: pMul(a.d, b.d) };
      }
      case "mul": {
        const a = r(x.a);
        const b = r(x.b);
        return a && b && { n: pMul(a.n, b.n), d: pMul(a.d, b.d) };
      }
      case "div": {
        const a = r(x.a);
        const b = r(x.b);
        if (!a || !b || !b.n.size) return null;
        return { n: pMul(a.n, b.d), d: pMul(a.d, b.n) };
      }
      case "pow": {
        const a = r(x.a);
        if (!a) return null;
        if (x.n === 0) return !a.n.size || !pKonstanten(a.n) || !pKonstanten(a.d) ? null : { n: ena(), d: ena() }; // 0⁰ in x⁰ nista definirana
        if (x.n < 0 && !a.n.size) return null;
        const b = x.n < 0 ? { n: a.d, d: a.n } : a;
        let out = { n: ena(), d: ena() };
        for (let i = 0; i < Math.abs(x.n); i++) out = { n: pMul(out.n, b.n), d: pMul(out.d, b.d) };
        return out;
      }
      case "sqrt": {
        const a = r(x.a);
        if (!a || !pKonstanten(a.n) || !pKonstanten(a.d)) return null;
        const an = a.n.size ? [...a.n.values()][0].rac() : new Q(0n);
        const ad = [...a.d.values()][0].rac();
        if (!an || !ad) return null;
        const s = S.koren(an.div(ad));
        return s && { n: pKonst(s, n), d: ena() };
      }
      case "abs": {
        const a = r(x.a);
        if (!a || !pKonstanten(a.n) || !pKonstanten(a.d)) return null;
        const zn = (p) => (p.size ? [...p.values()][0].predznak() : 0);
        const s1 = zn(a.n);
        const s2 = zn(a.d);
        if (s1 == null || s2 == null) return null;
        return s1 * s2 < 0 ? { n: pNeg(a.n), d: a.d } : a;
      }
      default:
        return null;
    }
  };
  try {
    const f = r(e);
    if (f && (pStopnja(f.n) > NAJVEC_STOPNJA || pStopnja(f.d) > NAJVEC_STOPNJA)) return null;
    return f;
  } catch (err) {
    if (err instanceof Prevelik) return null;
    throw err;
  }
}

/** Točno: ali je f ≡ 0 (kot racionalna funkcija). */
export const jeNicelna = (f) => f.n.size === 0;
/** Točno: f ≡ g. */
export const enakiFunkciji = (f, g) => pAdd(pMul(f.n, g.d), pNeg(pMul(g.n, f.d))).size === 0;
/** Ali je f konstanta (brez spremenljivk). */
export const konstantna = (f) => pKonstanten(f.n) && pKonstanten(f.d);
/** Predznak konstantne funkcije (−1, 0, 1) ali null. */
export function predznakKonstante(f) {
  const zn = (p) => (p.size ? [...p.values()][0].predznak() : 0);
  const a = zn(f.n);
  const b = zn(f.d);
  return a == null || b == null ? null : a * b;
}

/**
 * Ali je f = c · g za konstanto c ≠ 0 (pri pozitiven še c > 0). Točno: n_f·d_g in n_g·d_f morata biti sorazmerna
 * polinoma. Obe ničelni ni sorazmerje (o tem odloči klicatelj).
 */
export function sorazmerni(f, g, { pozitiven = false } = {}) {
  const A = pMul(f.n, g.d);
  const B = pMul(g.n, f.d);
  if (!A.size || !B.size) return false;
  const kljuci = new Set([...A.keys(), ...B.keys()]);
  const k = [...B.keys()][0];
  if (!A.has(k)) return false;
  const a0 = A.get(k);
  const b0 = B.get(k);
  for (const j of kljuci) {
    const aj = A.get(j) || new S();
    const bj = B.get(j) || new S();
    if (!aj.mul(b0).eq(bj.mul(a0))) return false; // A[j]/B[j] = A[k]/B[k]
  }
  if (!pozitiven) return true;
  const z1 = a0.predznak();
  const z2 = b0.predznak();
  return z1 != null && z2 != null && z1 * z2 > 0;
}

// ---------- zapis brez oznak tipov (strukturna enakost) ----------
/** Kanoničen niz drevesa izraza (brez oznak tipov in oklepajev; −število je število). */
export function kanon(e) {
  switch (e.t) {
    case "num":
      return e.v.toString();
    case "var":
      return e.n;
    case "neg":
      return e.a.t === "num" ? e.a.v.neg().toString() : `neg(${kanon(e.a)})`;
    case "pow":
      return `pow(${kanon(e.a)},${e.n})`;
    case "sqrt":
    case "abs":
      return `${e.t}(${kanon(e.a)})`;
    default:
      return `${e.t}(${kanon(e.a)},${kanon(e.b)})`;
  }
}

/** Ali je zaprt izraz zanesljivo različen od 0 (točno, sicer z oceno na 40 mest) oziroma ≥ 0. */
export function zaprtPredznak(e) {
  const f = racFunkcija(e, []);
  if (f) return predznakKonstante(f);
  if (velikost(e) > NAJVEC_BITOV) return null;
  const v = vrednost(e, {});
  if (v == null) return null;
  const meja = 10n ** 40n;
  return v > meja ? 1 : v < -meja ? -1 : null;
}

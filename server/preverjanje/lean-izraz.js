// Izrazi za prevod trditev v Lean (PV-13, docs/preverjanje.md). Brez odvisnosti: razčlenjevalnik zapisa RACUN
// (isti jezik kot server/cas/worker.py, a le njegov del), racionalna števila, polinomi in izračun vrednosti z
// visoko natančnostjo za primerjavo prevoda z izvirnikom.
//
// Drevo izraza: { t: "num", v: Q } | { t: "var", n } | { t: "neg", a } | { t: "add"|"sub"|"mul"|"div", a, b }
//             | { t: "pow", a, n } (n celo število) | { t: "sqrt", a } | { t: "abs", a }

// ---------- racionalna števila (BigInt) ----------
const babs = (a) => (a < 0n ? -a : a);
function gcd(a, b) {
  a = babs(a);
  b = babs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}
export class Q {
  constructor(n, d = 1n) {
    if (d === 0n) throw new Error("deljenje z 0");
    if (d < 0n) [n, d] = [-n, -d];
    const g = gcd(n, d) || 1n;
    this.n = n / g;
    this.d = d / g;
  }
  static of(x) {
    return x instanceof Q ? x : new Q(BigInt(x));
  }
  add(o) {
    return new Q(this.n * o.d + o.n * this.d, this.d * o.d);
  }
  sub(o) {
    return new Q(this.n * o.d - o.n * this.d, this.d * o.d);
  }
  mul(o) {
    return new Q(this.n * o.n, this.d * o.d);
  }
  div(o) {
    return new Q(this.n * o.d, this.d * o.n);
  }
  neg() {
    return new Q(-this.n, this.d);
  }
  pow(k) {
    let r = new Q(1n);
    const b = k < 0 ? new Q(1n).div(this) : this;
    for (let i = 0; i < Math.abs(k); i++) r = r.mul(b);
    return r;
  }
  isZero() {
    return this.n === 0n;
  }
  sign() {
    return this.n === 0n ? 0 : this.n > 0n ? 1 : -1;
  }
  cmp(o) {
    return this.sub(o).sign();
  }
  eq(o) {
    return this.n === o.n && this.d === o.d;
  }
  isInt() {
    return this.d === 1n;
  }
  toString() {
    return this.d === 1n ? String(this.n) : `${this.n}/${this.d}`;
  }
}
export const ZERO = new Q(0n);
export const ONE = new Q(1n);

/** Decimalni zapis »12.375« → točno racionalno število. */
export function qIzDecimalnega(s) {
  const m = /^(\d+)(?:\.(\d+))?$/.exec(s);
  if (!m) return null;
  const dec = m[2] || "";
  return new Q(BigInt(m[1] + dec), 10n ** BigInt(dec.length));
}

// ---------- razčlenjevalnik zapisa RACUN ----------
const FUNKCIJE = new Set(["sqrt", "abs"]);
const NAJVEC_ZNAKOV = 400;
const NAJVEC_POTENCA = 12;

function tokens(s) {
  const out = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === " ") {
      i++;
      continue;
    }
    if (/[0-9]/.test(c) || (c === "." && /[0-9]/.test(s[i + 1] || ""))) {
      let j = i;
      while (j < s.length && /[0-9]/.test(s[j])) j++;
      if (s[j] === "." && /[0-9]/.test(s[j + 1] || "")) {
        j++;
        while (j < s.length && /[0-9]/.test(s[j])) j++;
      }
      const v = qIzDecimalnega(s.slice(i, j).replace(/^\./, "0."));
      if (!v) return null;
      out.push({ k: "num", v });
      i = j;
      continue;
    }
    if (/[A-Za-z]/.test(c)) {
      let j = i;
      while (j < s.length && /[A-Za-z]/.test(s[j])) j++;
      out.push({ k: "id", v: s.slice(i, j) });
      i = j;
      continue;
    }
    if (c === "*" && s[i + 1] === "*") {
      out.push({ k: "op", v: "^" });
      i += 2;
      continue;
    }
    if ("+-*/^(),".includes(c)) {
      out.push({ k: "op", v: c });
      i++;
      continue;
    }
    return null; // neznan znak: zunaj obsega prevajalnika
  }
  return out;
}

/**
 * Izraz iz zapisa RACUN → drevo ali null (zunaj obsega: neznana funkcija, konstanta e/pi, ime iz več črk …).
 * Spremenljivke so posamezne črke razen e, E, i, I (v worker.py konstante).
 */
export function razcleni(s) {
  if (typeof s !== "string" || !s.trim() || s.length > NAJVEC_ZNAKOV) return null;
  const tk = tokens(s.replace(/−/g, "-").replace(/·/g, "*"));
  if (!tk) return null;
  let p = 0;
  const peek = () => tk[p];
  const jeOp = (v) => peek() && peek().k === "op" && peek().v === v;
  function atom() {
    const t = peek();
    if (!t) throw 0;
    if (t.k === "num") {
      p++;
      return { t: "num", v: t.v };
    }
    if (t.k === "id") {
      p++;
      if (FUNKCIJE.has(t.v)) {
        if (!jeOp("(")) throw 0;
        p++;
        const a = expr();
        if (!jeOp(")")) throw 0;
        p++;
        return { t: t.v, a };
      }
      if (t.v.length !== 1 || "eEiI".includes(t.v)) throw 0;
      return { t: "var", n: t.v };
    }
    if (t.k === "op" && t.v === "(") {
      p++;
      const a = expr();
      if (!jeOp(")")) throw 0;
      p++;
      return a;
    }
    throw 0;
  }
  function power() {
    const a = atom();
    if (jeOp("^")) {
      p++;
      const e = unary();
      const n = konstanta(e);
      if (!n || !n.isInt() || babs(n.n) > BigInt(NAJVEC_POTENCA)) throw 0;
      return { t: "pow", a, n: Number(n.n) };
    }
    return a;
  }
  function unary() {
    if (jeOp("-")) {
      p++;
      return { t: "neg", a: unary() };
    }
    if (jeOp("+")) {
      p++;
      return unary();
    }
    return power();
  }
  const zacneAtom = () => {
    const t = peek();
    return t && (t.k === "num" || t.k === "id" || (t.k === "op" && t.v === "("));
  };
  function term() {
    let a = unary();
    for (;;) {
      if (jeOp("*") || jeOp("/")) {
        const op = peek().v;
        p++;
        const b = unary();
        a = { t: op === "*" ? "mul" : "div", a, b };
      } else if (zacneAtom()) {
        a = { t: "mul", a, b: power() }; // implicitno množenje: 2x, 3(x+1), x(x-2)
      } else return a;
    }
  }
  function expr() {
    let a = term();
    while (jeOp("+") || jeOp("-")) {
      const op = peek().v;
      p++;
      a = { t: op === "+" ? "add" : "sub", a, b: term() };
    }
    return a;
  }
  try {
    const e = expr();
    if (p !== tk.length) return null;
    return e;
  } catch {
    return null;
  }
}

// ---------- lastnosti dreves ----------
export function spremenljivke(e, out = new Set()) {
  if (!e) return out;
  if (e.t === "var") out.add(e.n);
  for (const k of ["a", "b"]) if (e[k]) spremenljivke(e[k], out);
  return out;
}
export const zaprt = (e) => spremenljivke(e).size === 0;

/** Racionalna vrednost zaprtega izraza brez korenov (null, če je ni ali vsebuje koren/deljenje z 0). */
export function konstanta(e) {
  try {
    const r = (x) => {
      switch (x.t) {
        case "num":
          return x.v;
        case "neg":
          return r(x.a).neg();
        case "add":
          return r(x.a).add(r(x.b));
        case "sub":
          return r(x.a).sub(r(x.b));
        case "mul":
          return r(x.a).mul(r(x.b));
        case "div": {
          const b = r(x.b);
          if (b.isZero()) throw 0;
          return r(x.a).div(b);
        }
        case "pow": {
          const a = r(x.a);
          if (a.isZero() && x.n < 0) throw 0;
          return a.pow(x.n);
        }
        case "abs": {
          const a = r(x.a);
          return a.sign() < 0 ? a.neg() : a;
        }
        default:
          throw 0;
      }
    };
    return r(e);
  } catch {
    return null;
  }
}

/** Vsi imenovalci (deljenje) in argumenti korenov v izrazu, v vrstnem redu pojavitve. */
export function obmocje(e, out = { imenovalci: [], koreni: [] }) {
  if (!e) return out;
  if (e.a) obmocje(e.a, out);
  if (e.b) obmocje(e.b, out);
  if (e.t === "div") out.imenovalci.push(e.b);
  if (e.t === "pow" && e.n < 0) out.imenovalci.push(e.a);
  if (e.t === "sqrt") out.koreni.push(e.a);
  return out;
}

// ---------- polinomi v eni spremenljivki (koeficienti Q, od najnižje stopnje) ----------
export const P = {
  norm(p) {
    const q = p.slice();
    while (q.length && q[q.length - 1].isZero()) q.pop();
    return q;
  },
  add(a, b) {
    const n = Math.max(a.length, b.length);
    return P.norm(Array.from({ length: n }, (_, i) => (a[i] || ZERO).add(b[i] || ZERO)));
  },
  neg: (a) => a.map((c) => c.neg()),
  sub: (a, b) => P.add(a, P.neg(b)),
  mul(a, b) {
    if (!a.length || !b.length) return [];
    const r = Array.from({ length: a.length + b.length - 1 }, () => ZERO);
    a.forEach((x, i) => b.forEach((y, j) => (r[i + j] = r[i + j].add(x.mul(y)))));
    return P.norm(r);
  },
  scale: (a, c) => P.norm(a.map((x) => x.mul(c))),
  deg: (a) => P.norm(a).length - 1,
  /** Deljenje z ostankom: { q, r }. */
  divmod(a, b) {
    a = P.norm(a);
    b = P.norm(b);
    if (!b.length) throw new Error("deljenje s polinomom 0");
    let r = a.slice();
    const q = Array.from({ length: Math.max(0, a.length - b.length + 1) }, () => ZERO);
    while (r.length >= b.length && r.length) {
      const k = r.length - b.length;
      const c = r[r.length - 1].div(b[b.length - 1]);
      q[k] = c;
      r = P.sub(r, P.mul(b, [...Array(k).fill(ZERO), c]));
    }
    return { q: P.norm(q), r };
  },
  val(a, x) {
    let r = ZERO;
    for (let i = a.length - 1; i >= 0; i--) r = r.mul(x).add(a[i]);
    return r;
  },
};

/**
 * Izraz v spremenljivki v kot racionalna funkcija { num, den } (polinoma) ali null (koren, absolutna vrednost
 * spremenljivke ali druga spremenljivka). Ulomki se ne krajšajo: den je zmnožek vseh imenovalcev.
 */
export function racionalna(e, v) {
  try {
    const r = (x) => {
      switch (x.t) {
        case "num":
          return { num: P.norm([x.v]), den: [ONE] };
        case "var":
          if (x.n !== v) throw 0;
          return { num: [ZERO, ONE], den: [ONE] };
        case "neg": {
          const a = r(x.a);
          return { num: P.neg(a.num), den: a.den };
        }
        case "add":
        case "sub": {
          const a = r(x.a);
          const b = r(x.b);
          const bn = x.t === "add" ? b.num : P.neg(b.num);
          return { num: P.add(P.mul(a.num, b.den), P.mul(bn, a.den)), den: P.mul(a.den, b.den) };
        }
        case "mul": {
          const a = r(x.a);
          const b = r(x.b);
          return { num: P.mul(a.num, b.num), den: P.mul(a.den, b.den) };
        }
        case "div": {
          const a = r(x.a);
          const b = r(x.b);
          if (!P.norm(b.num).length) throw 0;
          return { num: P.mul(a.num, b.den), den: P.mul(a.den, b.num) };
        }
        case "pow": {
          let a = r(x.a);
          if (x.n < 0) a = { num: a.den, den: a.num };
          let num = [ONE];
          let den = [ONE];
          for (let i = 0; i < Math.abs(x.n); i++) {
            num = P.mul(num, a.num);
            den = P.mul(den, a.den);
          }
          return { num, den };
        }
        case "abs":
        case "sqrt": {
          const c = konstanta(x);
          if (c) return { num: P.norm([c]), den: [ONE] };
          throw 0;
        }
        default:
          throw 0;
      }
    };
    return r(e);
  } catch {
    return null;
  }
}

/** Racionalne ničle polinoma (izrek o racionalnih ničlah; števci in imenovalci do 10^6). */
export function racionalneNicle(p) {
  p = P.norm(p);
  const out = [];
  if (P.deg(p) < 1) return out;
  // cela števila: pomnoži z najmanjšim skupnim imenovalcem
  let L = 1n;
  for (const c of p) L = (L * c.d) / gcd(L, c.d);
  let z = p.map((c) => (c.n * L) / c.d);
  while (z.length && z[0] === 0n) {
    out.push(ZERO);
    z = z.slice(1);
  }
  if (z.length < 2) return out;
  const delitelji = (n) => {
    n = babs(n);
    if (n > 10n ** 12n) return null;
    const r = [];
    for (let i = 1n; i * i <= n; i++) if (n % i === 0n) r.push(i, n / i);
    return r;
  };
  const ps = delitelji(z[0]);
  const qs = delitelji(z[z.length - 1]);
  if (!ps || !qs) return out;
  const seen = new Set();
  const pz = z.map((c) => new Q(c));
  for (const a of ps)
    for (const b of qs)
      for (const s of [1n, -1n]) {
        const x = new Q(s * a, b);
        const k = x.toString();
        if (seen.has(k)) continue;
        seen.add(k);
        if (P.val(pz, x).isZero()) out.push(x);
      }
  return out;
}

// ---------- vrednost z visoko natančnostjo (primerjava prevoda z izvirnikom) ----------
const SKALA = 10n ** 80n;
const fx = (q) => (q.n * SKALA) / q.d;
function isqrt(n) {
  if (n < 0n) return null;
  if (n < 2n) return n;
  let x = BigInt(Math.floor(Math.sqrt(Number(n))));
  if (x === 0n) x = 1n;
  for (;;) {
    const y = (x + n / x) >> 1n;
    if (babs(y - x) <= 1n) {
      let r = y;
      while (r * r > n) r--;
      while ((r + 1n) * (r + 1n) <= n) r++;
      return r;
    }
    x = y;
  }
}

/**
 * Vrednost izraza v točki (spremenljivka → Q) kot celo število, pomnoženo s 10^80, ali null, kjer izraz ni
 * definiran (deljenje z 0, koren negativnega števila). Matematični pomen, ne Leanov (v Leanu je x/0 = 0).
 */
export function vrednost(e, tocka) {
  const r = (x) => {
    switch (x.t) {
      case "num":
        return fx(x.v);
      case "var": {
        if (!tocka[x.n]) return null;
        return fx(tocka[x.n]);
      }
      case "neg": {
        const a = r(x.a);
        return a == null ? null : -a;
      }
      case "add":
      case "sub":
      case "mul":
      case "div": {
        const a = r(x.a);
        const b = r(x.b);
        if (a == null || b == null) return null;
        if (x.t === "add") return a + b;
        if (x.t === "sub") return a - b;
        if (x.t === "mul") return (a * b) / SKALA;
        if (babs(b) < 10n ** 30n) return null; // |b| < 1e-50: deljenje z (skoraj) 0
        return (a * SKALA) / b;
      }
      case "pow": {
        let a = r(x.a);
        if (a == null) return null;
        if (x.n < 0) {
          if (babs(a) < 10n ** 30n) return null;
          a = (SKALA * SKALA) / a;
        }
        let v = SKALA;
        for (let i = 0; i < Math.abs(x.n); i++) v = (v * a) / SKALA;
        return v;
      }
      case "sqrt": {
        const a = r(x.a);
        if (a == null || a < -(10n ** 30n)) return null;
        return isqrt((a < 0n ? 0n : a) * SKALA);
      }
      case "abs": {
        const a = r(x.a);
        return a == null ? null : babs(a);
      }
      default:
        return null;
    }
  };
  return r(e);
}

/** Ali sta vrednosti (s skalo 10^80) enaki do relativne napake 1e-40. */
export function enakaVrednost(a, b) {
  if (a == null || b == null) return false;
  const m = babs(a) > babs(b) ? babs(a) : babs(b);
  const meja = (m > SKALA ? m : SKALA) / 10n ** 40n;
  return babs(a - b) <= meja;
}
export const jeNic = (a) => a != null && babs(a) <= SKALA / 10n ** 40n;
export const predznak = (a) => (jeNic(a) ? 0 : a > 0n ? 1 : -1);

/** Deterministične psevdonaključne racionalne točke (seme iz niza): vsaka spremenljivka svojo vrednost. */
export function tocke(imena, seme, n = 14) {
  let h = 2166136261;
  for (const c of String(seme)) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0;
  const rnd = () => {
    h = (Math.imul(h, 1103515245) + 12345) >>> 0;
    return h;
  };
  const out = [];
  for (let i = 0; i < n; i++) {
    const t = {};
    // več velikostnih redov: meja pri |x − 2000| ali x = 0,001 ne sme ostati med točkami
    const skala = [new Q(1n), new Q(1n), new Q(1n, 1000n), new Q(10n ** 6n)][i % 4];
    for (const v of imena) t[v] = new Q(BigInt((rnd() % 2001) - 1000), BigInt((rnd() % 13) + 1)).mul(skala);
    out.push(t);
  }
  return out;
}

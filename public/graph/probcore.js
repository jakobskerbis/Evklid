// Verjetnostne porazdelitve: normalna, binomska, Poissonova, geometrijska, hipergeometrijska, Studentova t, hi-kvadrat.
// Brez DOM (preizkusi v test/tools.test.js). Natančnost ~1e-10, kar je več kot dovolj za tabele.

const LN_SQRT_2PI = 0.9189385332046727;

/** ln Γ(x) (Lanczos, g = 7). */
export function lnGamma(x) {
  const g = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  if (x < 0.5) return Math.log(Math.PI / Math.abs(Math.sin(Math.PI * x))) - lnGamma(1 - x);
  x -= 1;
  let a = g[0];
  const t = x + 7.5;
  for (let i = 1; i < 9; i++) a += g[i] / (x + i);
  return LN_SQRT_2PI + (x + 0.5) * Math.log(t) - t + Math.log(a);
}

/** Regularizirana spodnja nepopolna funkcija gama P(a, x). */
export function gammaP(a, x) {
  if (x <= 0) return 0;
  if (x < a + 1) {
    let sum = 1 / a;
    let term = sum;
    for (let n = 1; n < 500; n++) {
      term *= x / (a + n);
      sum += term;
      if (Math.abs(term) < Math.abs(sum) * 1e-15) break;
    }
    return sum * Math.exp(-x + a * Math.log(x) - lnGamma(a));
  }
  // verižni ulomek za Q
  let b = x + 1 - a;
  let c = 1e300;
  let d = 1 / b;
  let h = d;
  for (let i = 1; i < 500; i++) {
    const an = -i * (i - a);
    b += 2;
    d = an * d + b;
    if (Math.abs(d) < 1e-300) d = 1e-300;
    c = b + an / c;
    if (Math.abs(c) < 1e-300) c = 1e-300;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < 1e-15) break;
  }
  return 1 - Math.exp(-x + a * Math.log(x) - lnGamma(a)) * h;
}

/** Regularizirana nepopolna funkcija beta I_x(a, b). */
export function betaI(x, a, b) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const bt = Math.exp(lnGamma(a + b) - lnGamma(a) - lnGamma(b) + a * Math.log(x) + b * Math.log(1 - x));
  const cf = (x, a, b) => {
    let c = 1;
    let d = 1 - ((a + b) * x) / (a + 1);
    if (Math.abs(d) < 1e-300) d = 1e-300;
    d = 1 / d;
    let h = d;
    for (let m = 1; m < 500; m++) {
      const m2 = 2 * m;
      let aa = (m * (b - m) * x) / ((a + m2 - 1) * (a + m2));
      d = 1 + aa * d;
      if (Math.abs(d) < 1e-300) d = 1e-300;
      c = 1 + aa / c;
      if (Math.abs(c) < 1e-300) c = 1e-300;
      d = 1 / d;
      h *= d * c;
      aa = (-(a + m) * (a + b + m) * x) / ((a + m2) * (a + m2 + 1));
      d = 1 + aa * d;
      if (Math.abs(d) < 1e-300) d = 1e-300;
      c = 1 + aa / c;
      if (Math.abs(c) < 1e-300) c = 1e-300;
      d = 1 / d;
      const del = d * c;
      h *= del;
      if (Math.abs(del - 1) < 1e-15) break;
    }
    return h;
  };
  return x < (a + 1) / (a + b + 2) ? (bt * cf(x, a, b)) / a : 1 - (bt * cf(1 - x, b, a)) / b;
}

/** Φ(z): porazdelitvena funkcija standardne normalne porazdelitve. */
export function phi(z) {
  if (!Number.isFinite(z)) return z > 0 ? 1 : 0;
  const p = 0.5 * (1 + Math.sign(z) * gammaP(0.5, (z * z) / 2));
  return p;
}

/** Inverzna Φ (Wichura AS241, natančnost ~1e-16). */
export function phiInv(p) {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  const q = p - 0.5;
  let r;
  if (Math.abs(q) <= 0.425) {
    r = 0.180625 - q * q;
    return (q * (((((((r * 2509.0809287301226727 + 33430.575583588128105) * r + 67265.770927008700853) * r + 45921.953931549871457) * r + 13731.693765509461125) * r + 1971.5909503065514427) * r + 133.14166789178437745) * r + 3.387132872796366608)) /
      (((((((r * 5226.495278852545925 + 28729.085735721942674) * r + 39307.89580009271061) * r + 21213.794301586595867) * r + 5394.1960214247511077) * r + 687.1870074920579083) * r + 42.313330701600911252) * r + 1);
  }
  r = q < 0 ? p : 1 - p;
  r = Math.sqrt(-Math.log(r));
  let v;
  if (r <= 5) {
    r -= 1.6;
    v = (((((((r * 7.7454501427834140764e-4 + 0.0227238449892691845833) * r + 0.24178072517745061177) * r + 1.27045825245236838258) * r + 3.64784832476320460504) * r + 5.7694972214606914055) * r + 4.6303378461565452959) * r + 1.42343711074968357734) /
      (((((((r * 1.05075007164441684324e-9 + 5.475938084995344946e-4) * r + 0.0151986665636164571966) * r + 0.14810397642748007459) * r + 0.68976733498510000455) * r + 1.6763848301838038494) * r + 2.05319162663775882187) * r + 1);
  } else {
    r -= 5;
    v = (((((((r * 2.01033439929228813265e-7 + 2.71155556874348757815e-5) * r + 0.0012426609473880784386) * r + 0.026532189526576123093) * r + 0.29656057182850489123) * r + 1.7848265399172913358) * r + 5.4637849111641143699) * r + 6.6579046435011037772) /
      (((((((r * 2.04426310338993978564e-15 + 1.4215117583164458887e-7) * r + 1.8463183175100546818e-5) * r + 7.868691311456132591e-4) * r + 0.0148753612908506148525) * r + 0.13692988092273580531) * r + 0.59983220655588793769) * r + 1);
  }
  return q < 0 ? -v : v;
}

// ---------- porazdelitve ----------
// Vsaka ima: discrete, pdf(x), cdf(x) = P(X ≤ x), inv(p) (zvezne), mean, sd, range [od, do] za risanje.

export function normal(mu = 0, sigma = 1) {
  return {
    discrete: false,
    pdf: (x) => Math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI)),
    cdf: (x) => phi((x - mu) / sigma),
    inv: (p) => mu + sigma * phiInv(p),
    mean: mu,
    sd: sigma,
    range: [mu - 4 * sigma, mu + 4 * sigma],
  };
}

export function studentT(nu) {
  const lc = lnGamma((nu + 1) / 2) - lnGamma(nu / 2) - 0.5 * Math.log(nu * Math.PI);
  const cdf = (t) => {
    const x = nu / (nu + t * t);
    const tail = 0.5 * betaI(x, nu / 2, 0.5);
    return t >= 0 ? 1 - tail : tail;
  };
  return {
    discrete: false,
    pdf: (t) => Math.exp(lc - ((nu + 1) / 2) * Math.log(1 + (t * t) / nu)),
    cdf,
    inv: (p) => invert(cdf, p, -1e7, 1e7), // df = 1, 99,9 %: |t| ≈ 636
    mean: nu > 1 ? 0 : NaN,
    sd: nu > 2 ? Math.sqrt(nu / (nu - 2)) : NaN,
    range: [-5, 5],
  };
}

export function chi2(k) {
  const cdf = (x) => (x <= 0 ? 0 : gammaP(k / 2, x / 2));
  return {
    discrete: false,
    pdf: (x) => (x <= 0 ? 0 : Math.exp((k / 2 - 1) * Math.log(x) - x / 2 - (k / 2) * Math.LN2 - lnGamma(k / 2))),
    cdf,
    inv: (p) => invert(cdf, p, 0, Math.max(100, k * 10)),
    mean: k,
    sd: Math.sqrt(2 * k),
    range: [0, Math.max(k + 5 * Math.sqrt(2 * k), 8)],
  };
}

export function binomial(n, p) {
  const lnC = (k) => lnGamma(n + 1) - lnGamma(k + 1) - lnGamma(n - k + 1);
  const pmf = (k) => {
    if (k < 0 || k > n || k !== Math.floor(k)) return 0;
    if (p === 0) return k === 0 ? 1 : 0;
    if (p === 1) return k === n ? 1 : 0;
    return Math.exp(lnC(k) + k * Math.log(p) + (n - k) * Math.log(1 - p));
  };
  const sd = Math.sqrt(n * p * (1 - p));
  return {
    discrete: true,
    pdf: pmf,
    cdf: (x) => {
      const k = Math.floor(x);
      if (k < 0) return 0;
      if (k >= n) return 1;
      return 1 - betaI(p, k + 1, n - k);
    },
    mean: n * p,
    sd,
    range: [0, n],
  };
}

export function poisson(lambda) {
  const pmf = (k) => (k < 0 || k !== Math.floor(k) ? 0 : Math.exp(k * Math.log(lambda) - lambda - lnGamma(k + 1)));
  return {
    discrete: true,
    pdf: pmf,
    cdf: (x) => {
      const k = Math.floor(x);
      return k < 0 ? 0 : 1 - gammaP(k + 1, lambda);
    },
    mean: lambda,
    sd: Math.sqrt(lambda),
    range: [0, Math.ceil(lambda + 5 * Math.sqrt(lambda) + 3)],
  };
}

/** Geometrijska: P(X = k) = (1 − p)^(k−1) · p za k ≥ 1 (kot geometpdf/geometcdf na TI-84). */
export function geometric(p) {
  return {
    discrete: true,
    pdf: (k) => (k < 1 || k !== Math.floor(k) ? 0 : p === 1 ? (k === 1 ? 1 : 0) : Math.exp((k - 1) * Math.log1p(-p)) * p),
    cdf: (x) => {
      const k = Math.floor(x);
      return k < 1 ? 0 : p === 1 ? 1 : -Math.expm1(k * Math.log1p(-p));
    },
    mean: 1 / p,
    sd: Math.sqrt(1 - p) / p,
    range: [0, Math.ceil(1 / p + (5 * Math.sqrt(1 - p)) / p + 3)],
  };
}

/** Hipergeometrijska: N vseh, K ugodnih, n izbranih; P(X = k) = C(K,k)·C(N−K,n−k) / C(N,n). */
export function hypergeometric(N, K, n) {
  const lnC = (a, b) => lnGamma(a + 1) - lnGamma(b + 1) - lnGamma(a - b + 1);
  const lo = Math.max(0, n - (N - K));
  const hi = Math.min(n, K);
  const pmf = (k) => (k < lo || k > hi || k !== Math.floor(k) ? 0 : Math.exp(lnC(K, k) + lnC(N - K, n - k) - lnC(N, n)));
  const q = K / N;
  return {
    discrete: true,
    pdf: pmf,
    cdf: (x) => {
      const k = Math.min(Math.floor(x), hi);
      let s = 0;
      for (let i = lo; i <= k; i++) s += pmf(i);
      return Math.min(1, s);
    },
    mean: n * q,
    sd: N > 1 ? Math.sqrt(n * q * (1 - q) * ((N - n) / (N - 1))) : 0,
    range: [lo, hi],
  };
}

function invert(cdf, p, lo, hi) {
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (cdf(mid) < p) lo = mid;
    else hi = mid;
    if (hi - lo < 1e-12 * Math.max(1, Math.abs(mid))) break;
  }
  return (lo + hi) / 2;
}

/**
 * Verjetnost dogodka. kind: "le" P(X ≤ a), "ge" P(X ≥ a), "lt", "gt", "between" P(a ≤ X ≤ b), "eq" P(X = a).
 * Pri diskretnih porazdelitvah so neenakosti strogo upoštevane (P(X < 3) = P(X ≤ 2)).
 */
export function probability(d, kind, a, b) {
  if (d.discrete) {
    const F = (x) => d.cdf(x);
    switch (kind) {
      case "le": return F(a);
      case "lt": return F(Math.ceil(a) - 1);
      case "ge": return 1 - F(Math.ceil(a) - 1);
      case "gt": return 1 - F(Math.floor(a));
      case "eq": return d.pdf(a);
      case "between": return F(Math.floor(b)) - F(Math.ceil(a) - 1);
    }
  } else {
    switch (kind) {
      case "le":
      case "lt": return d.cdf(a);
      case "ge":
      case "gt": return 1 - d.cdf(a);
      case "eq": return 0;
      case "between": return d.cdf(b) - d.cdf(a);
    }
  }
  return NaN;
}

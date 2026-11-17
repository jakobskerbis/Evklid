// Graf v odgovoru inštruktorja (public/odpri.js): okno, ki pokaže zanimive dele funkcije (ničle, pole, presečišče z
// osjo y, ekstreme, prevoje), in asimptote (navpične, vodoravne, poševne), ki jih plot.js nariše črtkano z oznako.
// Brez DOM (testi v test/graf-okno.test.js). Funkcije f(x) tu vračajo število (NaN zunaj definicijskega območja).
import { toNum, specialPoints, intersections } from "./model.js";

const fin = Number.isFinite;

// Bisekcija po predznaku (ok(x) pove, na kateri strani je meja); vrne mejo na ~strojno natančnost.
function bisect(ok, a, b) {
  const okA = ok(a);
  for (let i = 0; i < 200; i++) {
    const m = (a + b) / 2;
    if (m <= Math.min(a, b) || m >= Math.max(a, b)) break;
    if (ok(m) === okA) a = m;
    else b = m;
  }
  return (a + b) / 2;
}

// Največja |f| na [a, b] (zlati rez): pol, kjer predznak ostane (1/x²).
function maxAbs(f, a, b) {
  const g = 0.618033988749895;
  const v = (x) => {
    const y = Math.abs(f(x));
    return fin(y) ? y : y === Infinity ? Infinity : -1;
  };
  let c = b - g * (b - a);
  let d = a + g * (b - a);
  for (let i = 0; i < 120 && b - a > 1e-15 * (1 + Math.abs(a)); i++) {
    if (v(c) >= v(d)) b = d;
    else a = c;
    c = b - g * (b - a);
    d = a + g * (b - a);
  }
  return (a + b) / 2;
}

/** Ali |f| ob c raste čez vse meje (vsaj z ene strani)? ln x pri 0 da, √x pri 0 in skok (predznak) ne. */
export function blowsUp(f, c) {
  const s = Math.max(1, Math.abs(c));
  for (const side of [-1, 1]) {
    const v = [1e-2, 1e-4, 1e-6, 1e-8, 1e-10].map((e) => Math.abs(f(c + side * e * s)));
    if (v.some((y) => Number.isNaN(y))) continue;
    if (v.at(-1) === Infinity) return true;
    let up = true;
    for (let i = 1; i < v.length; i++) if (!(v[i] > v[i - 1])) up = false;
    if (up && v.at(-1) - v[0] > 10 && v.at(-1) >= 4 * v[0]) return true;
  }
  return false;
}

/** Navpične asimptote na [a, b] (poli in rob definicijskega območja z neomejeno vrednostjo), naraščajoče. */
export function verticalAsymptotes(f, a, b, n = 800) {
  if (!(b > a)) return [];
  const h = (b - a) / n;
  const xs = [];
  const ys = [];
  for (let i = 0; i <= n; i++) {
    xs.push(a + i * h);
    ys.push(f(xs[i]));
  }
  const cand = [];
  for (let i = 0; i < n; i++) {
    const [y0, y1] = [ys[i], ys[i + 1]];
    if (fin(y0) && fin(y1)) {
      if (y0 !== 0 && y1 !== 0 && y0 < 0 !== y1 < 0) cand.push(bisect((x) => f(x) < 0, xs[i], xs[i + 1]));
    } else if (fin(y0) !== fin(y1)) cand.push(bisect((x) => fin(f(x)), xs[i], xs[i + 1]));
  }
  // pol brez spremembe predznaka (1/x²): krajevni maksimum |f| med vzorci
  for (let i = 1; i < n; i++) {
    const [y0, y1, y2] = [ys[i - 1], ys[i], ys[i + 1]].map(Math.abs);
    if (fin(y0) && fin(y1) && fin(y2) && y1 >= y0 && y1 >= y2 && y1 > 0) cand.push(maxAbs(f, xs[i - 1], xs[i + 1]));
  }
  cand.sort((p, q) => p - q);
  const out = [];
  for (const c of cand) {
    if (c < a - h || c > b + h) continue;
    if (out.length && Math.abs(c - out.at(-1)) < h / 2) continue;
    // prekoračitev (e^x pri x ≈ 710 da Infinity) ni pol: ob pravem polu je f malo stran spet končna ali NaN
    const d = 1e-3 * Math.max(1, Math.abs(c));
    if ([f(c - d), f(c + d)].some((y) => y === Infinity || y === -Infinity)) continue;
    if (blowsUp(f, c)) out.push(snap(c));
  }
  return out.filter((c, i) => i === 0 || c - out[i - 1] > h / 2);
}

/**
 * Vodoravne in poševne asimptote y = k·x + n za x → ±∞.
 * @returns {{k:number,n:number,sides:number[]}[]}
 */
export function endAsymptotes(f) {
  const found = [];
  for (const s of [-1, 1]) {
    const A = s * 1e4, B = s * 2e4, C = s * 1e6, D = s * 2e6;
    const [fa, fb, fc, fd] = [f(A), f(B), f(C), f(D)];
    if (![fa, fb, fc, fd].every(fin)) continue;
    const k0 = (fb - fa) / (B - A);
    let k = (fd - fc) / (D - C);
    if (Math.abs(k - k0) > 1e-4 * (1 + Math.abs(k))) continue;
    if (Math.abs(k) < 1e-9) k = 0;
    // Richardsonova ocena odpravi člen c/x (npr. 1 − 3/(x + 1) → 1)
    const nAt = (X, fx) => fx - k * X;
    const n0 = 2 * nAt(B, fb) - nAt(A, fa);
    const n1 = 2 * nAt(D, fd) - nAt(C, fc);
    if (Math.abs(n1 - n0) > 1e-3 * (1 + Math.abs(n0))) continue;
    // nihanje (sin x) ali počasna rast (ln x, √x): ostanek na drugih točkah mora biti majhen
    let ok = true;
    for (const X of [3.1e3, 5.7e4, 4.3e5]) {
      const r = f(s * X) - (k * s * X + n0);
      if (!fin(r) || Math.abs(r) > 2e-2 * (1 + Math.abs(n0)) + 30 / X) ok = false;
    }
    if (!ok) continue;
    const line = { k: snapCoef(k), n: snapCoef(n0) };
    const same = found.find((q) => Math.abs(q.k - line.k) < 1e-6 * (1 + Math.abs(line.k)) && Math.abs(q.n - line.n) < 1e-6 * (1 + Math.abs(line.n)));
    if (same) same.sides.push(s);
    else found.push({ ...line, sides: [s] });
  }
  // funkcija, ki je sama premica (y = 2x + 1, y = 3), nima asimptote
  return found.filter(({ k, n }) => {
    const pts = [-2.3, 0.5, 1.7, 3.9].map((x) => [x, f(x)]).filter(([, y]) => fin(y));
    return !pts.length || pts.some(([x, y]) => Math.abs(y - (k * x + n)) > 1e-7 * (1 + Math.abs(y)));
  });
}

// lepa števila: celo, ulomek z majhnim imenovalcem ali večkratnik π (sicer nespremenjeno)
const snap = (v) => {
  const r = Math.round(v);
  return Math.abs(v - r) < 1e-9 * (1 + Math.abs(v)) ? r || 0 : v;
};
const snapCoef = (v) => {
  for (let q = 1; q <= 12; q++) {
    const p = Math.round(v * q);
    if (Math.abs(v - p / q) < 1e-6 * (1 + Math.abs(v))) return p / q;
  }
  return v;
};

/** Število za oznako: 1, −1/2, π/2, −3π/4, 0,37 (decimalna vejica, pravi minus). */
export function niceNumber(v) {
  const minus = (s) => s.replace(/^-/, "−");
  for (let q = 1; q <= 12; q++) {
    const p = Math.round(v * q);
    if (Math.abs(v - p / q) < 1e-9 * (1 + Math.abs(v))) return minus(q === 1 ? String(p) : `${p}/${q}`);
  }
  for (const d of [1, 2, 3, 4, 6]) {
    const k = Math.round((v * d) / Math.PI);
    if (k && Math.abs(v - (k * Math.PI) / d) < 1e-9 * (1 + Math.abs(v))) {
      const num = k === 1 ? "π" : k === -1 ? "−π" : `${minus(String(k))}π`;
      return d === 1 ? num : `${num}/${d}`;
    }
  }
  return minus(String(Math.round(v * 100) / 100).replace(".", ","));
}

/** Oznaka asimptote: »x = 1«, »y = 0«, »y = x + 1«, »y = −2x − 1/2«. */
export function asymptoteLabel(a) {
  if (a.x != null) return `x = ${niceNumber(a.x)}`;
  const { k, n } = a;
  if (!k) return `y = ${niceNumber(n)}`;
  const kk = k === 1 ? "" : k === -1 ? "−" : niceNumber(k);
  const lin = `${kk}${/\/|π/.test(kk) && kk.length > 1 ? "·" : ""}x`;
  if (!n) return `y = ${lin}`;
  return `y = ${lin} ${n < 0 ? "−" : "+"} ${niceNumber(Math.abs(n))}`;
}

// prevoji iz drugih diferenc (stran od polov)
function inflections(xs, ys, poles, h) {
  const out = [];
  let last = null; // [x, predznak]
  for (let i = 1; i < xs.length - 1; i++) {
    const [y0, y1, y2] = [ys[i - 1], ys[i], ys[i + 1]];
    if (![y0, y1, y2].every(fin) || poles.some((p) => Math.abs(p - xs[i]) < 4 * h)) {
      last = null;
      continue;
    }
    const d2 = y2 - 2 * y1 + y0;
    if (Math.abs(d2) <= 1e-9 * (1 + Math.abs(y0) + Math.abs(y1) + Math.abs(y2))) continue;
    const s = Math.sign(d2);
    if (last && last[1] !== s && xs[i] - last[0] < 3 * h) out.push({ x: (last[0] + xs[i]) / 2, type: "infl" });
    last = [xs[i], s];
  }
  return out;
}

/** Zanimive točke funkcije na [a, b]: ničle, ekstremi, presečišče z osjo y, prevoji, poli (le x). */
export function features(f, a, b, n = 4000) {
  const poles = verticalAsymptotes(f, a, b, n);
  const pts = specialPoints(f, a, b, n).filter((p) => !poles.some((q) => Math.abs(q - p.x) < (b - a) / n));
  const h = (b - a) / n;
  const xs = [];
  const ys = [];
  for (let i = 0; i <= n; i++) xs.push(a + i * h), ys.push(f(a + i * h));
  for (const p of inflections(xs, ys, poles, h)) {
    p.y = f(p.x);
    if (fin(p.y)) pts.push(p);
  }
  for (const x of poles) pts.push({ x, y: NaN, type: "pole" });
  return pts.sort((p, q) => p.x - q.x);
}

const quantile = (sorted, q) => sorted[Math.min(sorted.length - 1, Math.max(0, Math.round(q * (sorted.length - 1))))];

/**
 * Okno za funkcije y = f(x) (in točke), ki pokaže njihove zanimive dele.
 * @param {((x:number)=>number)[]} fns
 * @param {{W?:number,H?:number,points?:number[][],fixed?:{xmin?,xmax?,ymin?,ymax?}}} opts
 * @returns {{xmin:number,xmax:number,ymin:number,ymax:number}|null}
 */
export function fitView(fns, { W = 320, H = 220, points = [], fixed = {} } = {}) {
  const hasX = fin(fixed.xmin) && fin(fixed.xmax) && fixed.xmax > fixed.xmin;
  const hasY = fin(fixed.ymin) && fin(fixed.ymax) && fixed.ymax > fixed.ymin;
  if (hasX && hasY) return { xmin: fixed.xmin, xmax: fixed.xmax, ymin: fixed.ymin, ymax: fixed.ymax };
  if (!fns.length && !points.length) return null;
  const ratio = H / W;
  // 1) zanimive točke: najprej na [−40, 40], brez njih še na [−200, 200]
  let feats = [];
  const ends = [];
  const range = hasX ? [[fixed.xmin, fixed.xmax]] : [[-40, 40], [-200, 200]];
  for (const [a, b] of range) {
    feats = [];
    for (const f of fns) feats.push(...features(f, a, b, hasX ? 1500 : 4000));
    for (let i = 0; i < fns.length; i++) for (let j = i + 1; j < fns.length; j++) feats.push(...intersections(fns[i], fns[j], a, b, 2000));
    if (feats.some((p) => p.type !== "yint") || points.length) break;
  }
  for (const f of fns) ends.push(...endAsymptotes(f));
  for (const [x, y] of points) if (fin(x) && fin(y)) feats.push({ x, y, type: "point" });

  // 2) os x: vse zanimive x; če jih je veliko (periodične funkcije), le do polmera 8. (na ozkem zaslonu 6.)
  // najbližje izhodišču, simetrično; vsaj 6 enot, s prostorom 10 %
  let x0, x1;
  if (hasX) [x0, x1] = [fixed.xmin, fixed.xmax];
  else {
    const xsU = [];
    for (const p of [...feats].sort((p, q) => Math.abs(p.x) - Math.abs(q.x) || p.x - q.x))
      if (!xsU.some((x) => Math.abs(x - p.x) < 0.05)) xsU.push(p.x);
    // veliko točk (periodična funkcija): le najbližje; na ozkem telefonu ena perioda manj
    const K = W < 480 ? 6 : 8;
    if (xsU.length > 12) {
      const r = Math.abs(xsU[K - 1]) * (1 + 1e-4) + 1e-6; // ekstrem iz iskanja je lahko malo zamaknjen
      xsU.splice(0, xsU.length, ...xsU.filter((x) => Math.abs(x) <= r));
    }
    if (!xsU.length) xsU.push(0);
    x0 = Math.min(...xsU);
    x1 = Math.max(...xsU);
    const MIN = 6;
    if (x1 - x0 < MIN) {
      // dopolni na stran, kjer je funkcija definirana (√x, ln x: desno od 0)
      const need = MIN - (x1 - x0);
      const def = (a, b) => {
        let k = 0;
        for (let i = 0; i <= 20; i++) if (fns.some((f) => fin(f(a + ((b - a) * i) / 20)))) k++;
        return k;
      };
      const l = fns.length ? def(x0 - need, x0) : 1;
      const r = fns.length ? def(x1, x1 + need) : 1;
      const left = l + r ? (need * l) / (l + r) : need / 2;
      x0 -= left;
      x1 += need - left;
    }
    const pad = (x1 - x0) * 0.1;
    x0 -= pad;
    x1 += pad;
    // os y naj bo vidna, če je blizu
    if (x0 > 0 && x0 < (x1 - x0) * 0.5) x0 = -(x1 - x0) * 0.06;
    if (x1 < 0 && -x1 < (x1 - x0) * 0.5) x1 = (x1 - x0) * 0.06;
  }
  const xspan = x1 - x0;
  if (hasY) return { xmin: x0, xmax: x1, ymin: fixed.ymin, ymax: fixed.ymax };

  // 3) os y: zanimive točke (trdno) + vodoravne asimptote; vrednosti funkcij le do 5. in 95. percentila
  // (pol ne raztegne okna), skupaj največ 2,5 × kvadratnega razmerja
  const core = feats.filter((p) => fin(p.y) && p.x >= x0 && p.x <= x1).map((p) => p.y);
  for (const e of ends) if (!e.k) core.push(e.n);
  const samples = [];
  for (const f of fns)
    for (let i = 0; i <= 600; i++) {
      const y = f(x0 + (xspan * i) / 600);
      if (fin(y)) samples.push(y);
    }
  samples.sort((p, q) => p - q);
  if (!core.length && samples.length) core.push(quantile(samples, 0.5));
  if (!core.length) core.push(0);
  let c0 = Math.min(...core);
  let c1 = Math.max(...core);
  let y0 = c0;
  let y1 = c1;
  if (samples.length) {
    const lo = Math.min(c0, quantile(samples, 0.05));
    const hi = Math.max(c1, quantile(samples, 0.95));
    const allowed = Math.max((c1 - c0) * 1.3, 2.5 * xspan * ratio);
    const below = c0 - lo;
    const above = hi - c1;
    const extra = Math.max(0, allowed - (c1 - c0));
    const scale = below + above > extra ? extra / (below + above) : 1;
    y0 = c0 - below * scale;
    y1 = c1 + above * scale;
  }
  if (y1 - y0 < 1e-9) (y0 -= 1), (y1 += 1);
  // os x naj bo vidna, če je blizu
  if (y0 > 0 && y0 < (y1 - y0) * 0.5) y0 = 0;
  if (y1 < 0 && -y1 < (y1 - y0) * 0.5) y1 = 0;
  const padY = (y1 - y0) * 0.1;
  y0 -= padY;
  y1 += padY;

  // 4) razumno razmerje osi (podane osi x ne spreminjamo): enota na osi y največ 8× in najmanj 1/5 enote na osi x; blizu 1 kar enako (krog je krog)
  const rho = (y1 - y0) / H / (xspan / W);
  const grow = (lo, hi, span) => {
    const mid = (lo + hi) / 2;
    return [mid - span / 2, mid + span / 2];
  };
  let xa = x0, xb = x1;
  if (rho < 1 / 5) [y0, y1] = grow(y0, y1, (xspan / W) * H / 5);
  else if (rho > 8 && !hasX) [xa, xb] = grow(x0, x1, (y1 - y0) / H * W / 8);
  else if (rho > 0.6 && rho < 1.6) {
    if (rho < 1) [y0, y1] = grow(y0, y1, (xspan / W) * H);
    else if (!hasX) [xa, xb] = grow(x0, x1, ((y1 - y0) / H) * W);
  }
  return { xmin: xa, xmax: xb, ymin: y0, ymax: y1 };
}

/** Okno za model grafičnega kalkulatorja (funkcije y = …, točke, tabele); null, če ni česa prilagoditi. */
export function fitModelView(model, { W, H, fixed } = {}) {
  const fns = [];
  const points = [];
  for (const o of model?.items || []) {
    if (o.src?.hidden) continue;
    if ((o.kind === "y" || (o.kind === "func" && o.plot === "y")) && o.fn) {
      const fn = o.fn;
      fns.push((x) => {
        try {
          const v = fn(x);
          return Array.isArray(v) ? NaN : toNum(v);
        } catch {
          return NaN;
        }
      });
    }
    if (o.kind === "points") for (const p of o.evalPoints?.() || []) points.push(p);
  }
  if (!fns.length && !points.length && !(fixed && Object.keys(fixed).length)) return null;
  return fitView(fns, { W, H, points, fixed });
}

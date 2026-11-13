// Pomožne funkcije za tekmovalne generatorje (tek-*.js).
import { fmt, gcd, roundHalfUp } from "../check.js";

export { gcd, roundHalfUp, fmt };

// Število za LaTeX z decimalno vejico.
export const tx = (x, d = null) => fmt(x, d).replace(",", "{,}").replace("−", "-");
// Enota za LaTeX: unitTex("cm²") → "\mathrm{cm^2}"; enota, ki se začne z \, ostane.
export const unitTex = (u) => (u.startsWith("\\") ? u : `\\mathrm{${u.replace("²", "^2").replace("³", "^3")}}`);
export const qty = (v, u) => `${v}\\ ${unitTex(u)}`;
// Vrstica podatka (Podatki): vrednost mora biti zapisana enako kot v besedilu.
export const dat = (sym, v, u) => `${sym} = ${u ? qty(v, u) : v}`;
const needsRounding = (x, d) => d != null && Math.abs(x - roundHalfUp(x, d)) > 1e-9;
// Rezultat: "= 4{,}5\ \mathrm{cm}" oz. "\approx 4{,}51\ \mathrm{cm}", kadar je zaokrožen.
export const res = (x, d, u) => {
  const v = needsRounding(x, d) ? tx(x, d) : tx(roundHalfUp(x, 10));
  return `${needsRounding(x, d) ? "\\approx" : "="} ${u ? qty(v, u) : v}`;
};
// Veliko število v LaTeX: sci(1.6e9) → "1{,}6 \cdot 10^{9}".
export function sci(x, digits = 2) {
  const e = Math.floor(Math.log10(Math.abs(x)));
  const m = Number((x / 10 ** e).toPrecision(digits));
  return m === 1 ? `10^{${e}}` : `${tx(m)} \\cdot 10^{${e}}`;
}
// Negativno število v oklepaju.
export const par = (x) => (x < 0 ? `(${x})` : `${x}`);

// Številski odgovor: num(12), num(2.5, "m"), num(x, "m/s", 2).
export const num = (value, unit = null, decimals = null, extra = {}) => ({
  type: "number",
  value,
  ...(unit ? { unit } : {}),
  ...(decimals != null ? { decimals } : {}),
  ...extra,
});
export function fracAns(n, d) {
  const k = gcd(n, d) * (d < 0 ? -1 : 1);
  return { type: "fraction", num: n / k, den: d / k };
}
export const fracTex = (n, d) => {
  const k = gcd(n, d) * (d < 0 ? -1 : 1);
  const [a, b] = [n / k, d / k];
  return b === 1 ? `${a}` : a < 0 ? `-\\frac{${-a}}{${b}}` : `\\frac{${a}}{${b}}`;
};

export function binom(n, k) {
  if (k < 0 || k > n) return 0;
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return Math.round(r);
}
export const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));

export function modpow(a, e, m) {
  let r = 1n;
  let b = ((BigInt(a) % BigInt(m)) + BigInt(m)) % BigInt(m);
  let E = BigInt(e);
  const M = BigInt(m);
  while (E > 0n) {
    if (E & 1n) r = (r * b) % M;
    b = (b * b) % M;
    E >>= 1n;
  }
  return Number(r);
}

export function divisors(n) {
  const d = [];
  for (let i = 1; i * i <= n; i++) {
    if (n % i === 0) {
      d.push(i);
      if (i * i !== n) d.push(n / i);
    }
  }
  return d.sort((a, b) => a - b);
}
// Razcep: factorize(360) → { 2: 3, 3: 2, 5: 1 }.
export function factorize(n) {
  const f = {};
  for (let p = 2; p * p <= n; p++) {
    while (n % p === 0) {
      f[p] = (f[p] || 0) + 1;
      n /= p;
    }
  }
  if (n > 1) f[n] = (f[n] || 0) + 1;
  return f;
}
export const factorTex = (f) =>
  Object.entries(f)
    .map(([p, e]) => (e === 1 ? p : `${p}^{${e}}`))
    .join(" \\cdot ");
export const isPrime = (n) => n > 1 && Object.keys(factorize(n)).length === 1 && factorize(n)[n] === 1;
export function phi(n) {
  let r = n;
  for (const p of Object.keys(factorize(n)).map(Number)) r = (r / p) * (p - 1);
  return r;
}

// Slovenski vrstilni števniki za naštevanje oseb.
export const ORD = ["prvi", "drugi", "tretji", "četrti", "peti", "šesti", "sedmi", "osmi", "deveti", "deseti", "enajsti", "dvanajsti"];
export const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
export const DAYS = ["ponedeljek", "torek", "sreda", "četrtek", "petek", "sobota", "nedelja"];
// Tožilnik dneva: "v sredo", "v soboto", "v nedeljo", "v ponedeljek".
export const dayAcc = (d) => (d.endsWith("a") ? d.slice(0, -1) + "o" : d);

// Izbira z možnostmi (do 4); pravilni in motilci se ne ponovijo.
export function choiceAns(r, correct, distractors) {
  const uniq = [...new Set(distractors.filter((d) => d !== correct))].slice(0, 3);
  const options = r.shuffle([correct, ...uniq]);
  return { type: "choice", options, index: options.indexOf(correct) };
}

// Tipične napačne rezultate doda v answer.mistakes (največ 3): list = [[vrednost, zakaj], …].
// Izpusti neveljavne, ponovljene in tiste, ki bi se zaokrožili v pravilni rezultat.
export function withMistakes(ans, list) {
  const d = ans.decimals;
  const key = (x) => (d == null ? Number(x.toPrecision(9)) : roundHalfUp(x, d));
  const seen = new Set([key(ans.value)]);
  const out = [];
  for (const [value, why] of list) {
    if (!Number.isFinite(value) || !why || seen.has(key(value))) continue;
    if (ans.tolerance && Math.abs(value - ans.value) <= ans.tolerance * Math.max(1, Math.abs(ans.value))) continue;
    seen.add(key(value));
    out.push({ value, why });
  }
  if (out.length) ans.mistakes = out.slice(0, 3);
  return ans;
}
// Izbira z razlago za vsako napačno možnost: wrong = [[besedilo, zakaj], …]; pri pravilni je why null.
export function choiceWhy(r, correct, wrong) {
  const map = new Map(wrong.filter(([t]) => t !== correct));
  const options = r.shuffle([correct, ...[...map.keys()].slice(0, 3)]);
  return { type: "choice", options, index: options.indexOf(correct), why: options.map((o) => (o === correct ? null : map.get(o))) };
}

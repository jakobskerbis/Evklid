// Referenčni nabor v1 za merjenje preverjanja (PV-02, docs/preverjanje.md). Ustvari
// test/fixtures/preverjanje/nabor-v1.json: ~330 trditev z znano resnico, polovica pravilnih, polovica namerno
// napačnih (manjkajoča ali odvečna rešitev, predznak, luknja v definicijskem območju, tuja rešitev po kvadriranju,
// zaprt namesto odprtega intervala, pozabljen obrat neenačbe, verižno pravilo, zavajajoč zapis, velika števila …).
//
// Resnica je znana iz konstrukcije, ne iz preverjevalnikov Evklida: enačbe nastanejo iz izbranih ničel (zmnožek
// linearnih faktorjev s celimi koeficienti), korenske iz izbrane veljavne in tuje rešitve, neenačbe iz izbranih
// krajišč; odvodi, integrali, identitete, limite in enote so znani pari iz učbenika. Skripta pred zapisom vsako
// številsko resnico preizkusi sama (vstavi ničle, preveri tujo rešitev), sicer se ustavi.
//
// Zagon: node scripts/nabor-preverjanje.mjs  (deterministično, seme 2026; isti izid ob vsakem zagonu)
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "test", "fixtures", "preverjanje", "nabor-v1.json");

// ---------- naključje s semenom ----------
let seed = 2026;
const rnd = () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const int = (a, b) => a + Math.floor(rnd() * (b - a + 1));
const pick = (xs) => xs[Math.floor(rnd() * xs.length)];
const shuffle = (xs) => xs.map((x) => [rnd(), x]).sort((a, b) => a[0] - b[0]).map((p) => p[1]);
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));

// ---------- ulomki in polinomi s celimi koeficienti ----------
// Ničla p/q → faktor (q·x − p); zmnožek faktorjev ima cele koeficiente (BigInt, brez zaokroževanja).
const ratStr = ({ p, q }) => (q === 1 ? String(p) : `${p}/${q}`);
const ratVal = ({ p, q }) => p / q;
const polyMul = (a, b) => {
  const out = Array(a.length + b.length - 1).fill(0n);
  a.forEach((x, i) => b.forEach((y, j) => (out[i + j] += x * y)));
  return out;
};
const polyStr = (c) => {
  // c[k] = koeficient pri x^k
  let s = "";
  for (let k = c.length - 1; k >= 0; k--) {
    const v = c[k];
    if (v === 0n) continue;
    const neg = v < 0n;
    const a = neg ? -v : v;
    const mon = k === 0 ? String(a) : `${a === 1n ? "" : `${a}*`}x${k > 1 ? `^${k}` : ""}`;
    s += s ? (neg ? "-" : "+") + mon : (neg ? "-" : "") + mon;
  }
  return s || "0";
};
const polyEval = (c, x) => c.reduce((s, v, k) => s + Number(v) * x ** k, 0);

const items = [];
// Od nabora v2 naprej se ista trditev (naloga, rešitev, ukaz) ne ponovi: ponovljena se izpusti (dvojnike = DVOJNIKI).
const videneV2 = new Set();
let DVOJNIKI = null;
const add = (it) => {
  if (DVOJNIKI !== null) {
    const k = JSON.stringify([it.naloga, it.sol, it.racun]);
    if (videneV2.has(k)) return DVOJNIKI++;
    videneV2.add(k);
  }
  items.push({ id: `${it.skupina}-${String(items.filter((x) => x.skupina === it.skupina).length + 1).padStart(3, "0")}`, ...it });
};
const fail = (msg) => {
  throw new Error(`nabor: ${msg}`);
};

// ---------- A. polinomske enačbe (80) ----------
const ROOTS = [];
for (let p = -9; p <= 9; p++) ROOTS.push({ p, q: 1 });
for (const q of [2, 3, 4, 5]) for (let p = -12; p <= 12; p++) if (gcd(p, q) === 1 && Math.abs(p / q) <= 6) ROOTS.push({ p, q });
const videneP = new Set();
for (let i = 0; i < 40; i++) {
  const deg = 1 + (i % 4);
  const roots = [];
  while (roots.length < deg) {
    const r = pick(ROOTS);
    if (!roots.some((x) => x.p * r.q === r.p * x.q)) roots.push(r);
  }
  let c = [1n];
  for (const r of roots) c = polyMul(c, [BigInt(-r.p), BigInt(r.q)]);
  if (i % 10 === 7) c = polyMul(c, [BigInt(-roots[0].p), BigInt(roots[0].q)]); // dvojna ničla
  if (i % 10 === 9) c = polyMul(c, [1n, 0n, 1n]); // x² + 1 brez realnih ničel
  for (const r of roots) if (Math.abs(polyEval(c, ratVal(r))) > 1e-6 * Math.max(1, ...c.map((v) => Math.abs(Number(v))))) fail(`ničla ${ratStr(r)} ne drži`);
  const naloga = `${polyStr(c)}=0`;
  if (videneP.has(naloga)) {
    i--; // ista enačba že obstaja: izžrebaj nove ničle
    continue;
  }
  videneP.add(naloga);
  const truth = roots.map(ratStr);
  const isRoot = (v) => roots.some((r) => Math.abs(ratVal(r) - v) < 1e-12);
  const claim = (sols) => ({ naloga, sol: { kind: "equation", variable: "x", solutions: sols }, racun: ["solve", [naloga, "x", sols.length ? sols.join(", ") : "none"]], resnica: truth });
  add({ skupina: "polinom", opis: `polinomska enačba ${deg + (i % 10 === 9 ? 2 : 0)}. stopnje`, pravilno: true, ...claim(shuffle(truth)) });
  // vrsta napake neodvisno od stopnje (deg = 1 + i % 4), sicer bi bila »manjka« vedno pri 1. stopnji
  let kind = ["manjka", "odvec", "predznak", "vrednost"][(i >> 2) % 4];
  if (kind === "manjka" && deg < 2) kind = "vrednost";
  let wrong;
  if (kind === "manjka") wrong = truth.slice(1);
  else if (kind === "odvec") {
    let v = Math.max(...roots.map(ratVal)) + 1;
    while (isRoot(v)) v++;
    wrong = [...truth, String(Math.round(v))];
  } else if (kind === "predznak") {
    const r = roots.find((x) => x.p !== 0 && !isRoot(-ratVal(x)));
    if (!r) kind = "vrednost";
    else wrong = truth.map((t) => (t === ratStr(r) ? ratStr({ p: -r.p, q: r.q }) : t));
  }
  if (kind === "vrednost") {
    const r = roots.find((x) => !isRoot(ratVal(x) + 1));
    wrong = truth.map((t) => (t === ratStr(r) ? ratStr({ p: r.p + r.q, q: r.q }) : t));
  }
  add({ skupina: "polinom", opis: `polinomska enačba, napaka: ${kind}`, pravilno: false, napaka: kind, ...claim(shuffle(wrong)) });
}

// ---------- B. iracionalne ničle a ± √c (20) in približki (4) ----------
const surd = (a, c, sign) => (a === 0 ? `${sign < 0 ? "-" : ""}sqrt(${c})` : `${a}${sign < 0 ? "-" : "+"}sqrt(${c})`);
for (let i = 0; i < 10; i++) {
  const a = int(-4, 4);
  const c = pick([2, 3, 5, 6, 7, 10]);
  const coef = [BigInt(a * a - c), BigInt(-2 * a), 1n];
  const naloga = `${polyStr(coef)}=0`;
  if (videneP.has(naloga)) {
    i--; // brez podvojenih enačb
    continue;
  }
  videneP.add(naloga);
  for (const s of [1, -1]) if (Math.abs(polyEval(coef, a + s * Math.sqrt(c))) > 1e-9) fail(`a±√c ${naloga}`);
  const truth = [surd(a, c, 1), surd(a, c, -1)];
  const claim = (sols) => ({ naloga, sol: { kind: "equation", variable: "x", solutions: sols }, racun: ["solve", [naloga, "x", sols.join(", ")]], resnica: truth });
  add({ skupina: "koren-nicle", opis: "kvadratna enačba z iracionalnima ničlama", pravilno: true, ...claim(truth) });
  const kind = ["manjka", a === 0 ? "brez-korena" : "predznak", "brez-korena"][i % 3];
  const wrong = kind === "manjka" ? [truth[0]] : kind === "predznak" ? [surd(-a, c, 1), surd(-a, c, -1)] : [String(a + c), String(a - c)];
  add({ skupina: "koren-nicle", opis: `iracionalni ničli, napaka: ${kind}`, pravilno: false, napaka: kind, ...claim(wrong) });
}
for (const [a, c] of [[1, 2], [0, 3], [-2, 5], [3, 7]]) {
  const coef = [BigInt(a * a - c), BigInt(-2 * a), 1n];
  const naloga = `${polyStr(coef)}=0`;
  const sols = [(a + Math.sqrt(c)).toFixed(3), (a - Math.sqrt(c)).toFixed(3)];
  // pravilen zaokrožen odgovor: največ »numerično«, ker zaokroženo število ni točna rešitev
  add({ skupina: "priblizek", opis: "ničli, zaokroženi na 3 decimalke", pravilno: true, najvec: "numericno", naloga, sol: { kind: "equation", variable: "x", solutions: sols }, racun: ["solve", [naloga, "x", sols.join(", ")]], resnica: [surd(a, c, 1), surd(a, c, -1)] });
  // napačno zaokrožena ničla: zadnja decimalka za 1 previsoka (odmik 0,0005–0,0015), tik nad mejo tolerance
  const slabe = [(a + Math.sqrt(c) + 0.001).toFixed(3), sols[1]];
  add({ skupina: "priblizek", opis: "napaka: napačno zaokrožena ničla", pravilno: false, napaka: "zaokrozitev", naloga, sol: { kind: "equation", variable: "x", solutions: slabe }, racun: ["solve", [naloga, "x", slabe.join(", ")]], resnica: [surd(a, c, 1), surd(a, c, -1)] });
}

// ---------- C. luknja v definicijskem območju (20) ----------
const videne = new Set();
for (let i = 0; i < 10; i++) {
  const luknja = i % 2 === 0; // c = 2a: edina »rešitev« je x = a, ki je izključena
  let a, c;
  do {
    a = int(1, 6) * (rnd() < 0.5 ? -1 : 1);
    c = luknja ? 2 * a : int(-8, 8);
    if (!luknja && c - a === a) c++;
  } while (videne.has(`${a},${c}`)); // brez podvojenih nalog
  videne.add(`${a},${c}`);
  const naloga = `(x^2-${a * a})/(x${a < 0 ? "+" : "-"}${Math.abs(a)})=${c}`;
  const truth = luknja ? [] : [String(c - a)];
  const claim = (sols) => ({ naloga, sol: { kind: "equation", variable: "x", solutions: sols }, racun: ["solve", [naloga, "x", sols.length ? sols.join(", ") : "none"]], resnica: truth });
  add({ skupina: "luknja", opis: luknja ? "racionalna enačba brez rešitve (luknja)" : "racionalna enačba z luknjo", pravilno: true, ...claim(truth) });
  add({ skupina: "luknja", opis: "napaka: izključena vrednost kot rešitev", pravilno: false, napaka: "obmocje", ...claim(luknja ? [String(a)] : [String(c - a), String(a)]) });
}

// ---------- D. korenske enačbe (20) ----------
for (let i = 0; i < 5; i++) {
  const a = int(-6, 6);
  const b = int(2, 5); // b ≥ 2: pri b = 1 je b = b² in »napačna« rešitev bi bila pravilna
  const naloga = `sqrt(x${a < 0 ? "+" : "-"}${Math.abs(a)})=${b}`;
  const truth = [String(a + b * b)];
  const claim = (sols) => ({ naloga, sol: { kind: "equation", variable: "x", solutions: sols }, racun: ["solve", [naloga, "x", sols.join(", ")]], resnica: truth });
  add({ skupina: "koren", opis: "korenska enačba √(x − a) = b", pravilno: true, ...claim(truth) });
  add({ skupina: "koren", opis: "korenska enačba, napaka: b namesto b²", pravilno: false, napaka: "vrednost", ...claim([String(a + b)]) });
}
let made = 0;
for (let q = -3; q <= 4 && made < 5; q++)
  for (let r1 = q + 1; r1 <= q + 6 && made < 5; r1++) {
    const p = (r1 - q) ** 2 - r1; // √(x + p) = x − q ima veljavno rešitev r1
    const r2 = 2 * q + 1 - r1; // druga ničla po kvadriranju
    if (r2 >= q || r2 === r1 || (q + r1) % 3) continue; // r2 je tuja (desna stran negativna); redčenje izbire
    if (Math.abs(Math.sqrt(r1 + p) - (r1 - q)) > 1e-12) fail("korenska r1");
    if (r2 + p >= 0 && Math.abs(Math.sqrt(r2 + p) - (r2 - q)) < 1e-9) fail("korenska r2 ni tuja");
    const naloga = `sqrt(x${p < 0 ? "-" : "+"}${Math.abs(p)})=x${q < 0 ? "+" : "-"}${Math.abs(q)}`.replace("+0)", ")").replace("x-0", "x");
    const claim = (sols) => ({ naloga, sol: { kind: "equation", variable: "x", solutions: sols }, racun: ["solve", [naloga, "x", sols.join(", ")]], resnica: [String(r1)] });
    add({ skupina: "koren", opis: "korenska enačba s tujo rešitvijo po kvadriranju", pravilno: true, ...claim([String(r1)]) });
    add({ skupina: "koren", opis: "napaka: tuja rešitev ni izločena", pravilno: false, napaka: "tuja", ...claim([String(r1), String(r2)]) });
    made++;
  }
if (made < 5) fail("premalo korenskih enačb s tujo rešitvijo");

// ---------- E. neenačbe (30) ----------
const REL = ["<", "<=", ">", ">="];
for (let i = 0; i < 10; i++) {
  const a = int(-6, 4);
  const b = a + int(1, 5);
  const rel = REL[i % 4];
  const naloga = `${polyStr([BigInt(a * b), BigInt(-(a + b)), 1n])}${rel}0`;
  const set = { "<": `(${a}, ${b})`, "<=": `[${a}, ${b}]`, ">": `(-oo, ${a}) U (${b}, oo)`, ">=": `(-oo, ${a}] U [${b}, oo)` };
  const truth = set[rel];
  const wrong = i % 2 ? set[{ "<": "<=", "<=": "<", ">": ">=", ">=": ">" }[rel]] : set[{ "<": ">", "<=": ">=", ">": "<", ">=": "<=" }[rel]];
  const claim = (v) => ({ naloga, sol: { kind: "inequality", variable: "x", value: v }, racun: ["ineq", [naloga, "x", v]], resnica: truth });
  add({ skupina: "neenacba", opis: "kvadratna neenačba", pravilno: true, ...claim(truth) });
  add({ skupina: "neenacba", opis: i % 2 ? "napaka: zaprt in odprt interval zamenjana" : "napaka: komplement množice", pravilno: false, napaka: i % 2 ? "krajisca" : "komplement", ...claim(wrong) });
}
for (let i = 0; i < 5; i++) {
  const k = int(2, 5);
  const m = k * int(-3, 3) + (i % 2 ? 1 : 0);
  const g = gcd(m, k) || 1;
  const v = k / g === 1 ? String(m / g) : `${m / g}/${k / g}`;
  const naloga = `-${k}*x${m < 0 ? "-" : "+"}${Math.abs(m)}>0`;
  const claim = (s) => ({ naloga, sol: { kind: "inequality", variable: "x", value: s }, racun: ["ineq", [naloga, "x", s]], resnica: `(-oo, ${v})` });
  add({ skupina: "neenacba", opis: "linearna neenačba z negativnim koeficientom", pravilno: true, ...claim(`(-oo, ${v})`) });
  add({ skupina: "neenacba", opis: "napaka: pri deljenju z negativnim številom znak ni obrnjen", pravilno: false, napaka: "obrat", ...claim(`(${v}, oo)`) });
}

// ---------- F. identitete in poenostavitve (30) ----------
const IDENT = [
  ["(x+3)^2", "x^2+6*x+9", true], ["(x+3)^2", "x^2+9", false],
  ["(x-2)*(x+2)", "x^2-4", true], ["(x-2)^2", "x^2-4", false],
  ["x^3-1", "(x-1)*(x^2+x+1)", true], ["x^3-1", "(x-1)^3", false],
  ["x^4-16", "(x-2)*(x+2)*(x^2+4)", true], ["(x+1)^3", "x^3+1", false],
  ["sin(x)^2+cos(x)^2", "1", true], ["sin(2*x)", "2*sin(x)", false],
  ["sin(2*x)", "2*sin(x)*cos(x)", true], ["cos(x+pi)", "cos(x)", false],
  ["cos(2*x)", "1-2*sin(x)^2", true], ["tan(x)", "sin(x)*cos(x)", false],
  ["exp(2*x)", "exp(x)^2", true], ["exp(x+1)", "exp(x)+e", false],
  ["1/(x*(x+1))", "1/x-1/(x+1)", true], ["1/(x*(x+1))", "1/x+1/(x+1)", false],
  ["x^2*x^3", "x^5", true], ["x^2*x^3", "x^6", false],
  ["(2*x)^3", "8*x^3", true], ["(2*x)^3", "2*x^3", false],
  ["2^(x+1)", "2*2^x", true], ["2^(x+1)", "2^x+2", false],
  ["(x+1)^2", "x^2+2*x+1", true], ["(x+1)^2", "x^2+2*x+1.000001", false],
  ["(x^2-4)/(x-2)", "x+2", true], ["(x^2-4)/(x-2)", "x-2", false],
  ["sqrt(x^2+6*x+9)", "abs(x+3)", true], ["sqrt(x^2+9)", "x+3", false],
];
for (const [l, r, ok] of IDENT) add({ skupina: "identiteta", opis: ok ? "pravilna poenostavitev" : "napačna poenostavitev", pravilno: ok, ...(ok ? {} : { napaka: "pravilo" }), naloga: l, sol: { kind: "expression", variable: "x", value: r }, racun: ["equal", [l, r]] });

// ---------- G. odvodi (30) ----------
const ODV = [
  ["x^3", "3*x^2", "x^2"], ["sin(3*x)", "3*cos(3*x)", "cos(3*x)"], ["exp(2*x)", "2*exp(2*x)", "exp(2*x)"],
  ["ln(x)", "1/x", "ln(x)/x"], ["x*exp(x)", "exp(x)+x*exp(x)", "exp(x)"], ["sqrt(x)", "1/(2*sqrt(x))", "1/sqrt(x)"],
  ["x^2*sin(x)", "2*x*sin(x)+x^2*cos(x)", "2*x*cos(x)"], ["1/x", "-1/x^2", "1/x^2"], ["cos(x)^2", "-2*sin(x)*cos(x)", "2*cos(x)"],
  ["ln(x^2+1)", "2*x/(x^2+1)", "1/(x^2+1)"], ["(x^2+1)^3", "6*x*(x^2+1)^2", "3*(x^2+1)^2"], ["tan(x)", "1/cos(x)^2", "-1/cos(x)^2"],
  ["x/(x+1)", "1/(x+1)^2", "1/(x+1)"], ["exp(-x^2)", "-2*x*exp(-x^2)", "exp(-x^2)"], ["5*x^4-3*x+7", "20*x^3-3", "20*x^3-3+7"],
];
for (const [f, d, w] of ODV) {
  for (const [v, ok] of [[d, true], [w, false]]) add({ skupina: "odvod", opis: ok ? "pravilen odvod" : "napačen odvod (pravilo)", pravilno: ok, ...(ok ? {} : { napaka: "pravilo" }), naloga: `f(x) = ${f}`, sol: { kind: "derivative", variable: "x", value: v }, racun: ["diff", [f, "x", v]] });
}

// ---------- H. integrali (20) ----------
const INT = [
  ["x^2", "x^3/3", "x^3"], ["cos(x)", "sin(x)", "-sin(x)"], ["exp(3*x)", "exp(3*x)/3", "3*exp(3*x)"], ["1/x", "ln(abs(x))", "-1/x^2"],
  ["2*x*exp(x^2)", "exp(x^2)", "x^2*exp(x^2)"], ["sin(2*x)", "-cos(2*x)/2", "cos(2*x)/2"], ["1/(1+x^2)", "atan(x)", "ln(1+x^2)"], ["x*cos(x)", "x*sin(x)+cos(x)", "x*sin(x)"],
];
for (const [f, F, W] of INT)
  for (const [v, ok] of [[F, true], [W, false]]) add({ skupina: "integral", opis: ok ? "pravilen nedoločeni integral" : "napačen nedoločeni integral", pravilno: ok, ...(ok ? {} : { napaka: "pravilo" }), naloga: `∫ ${f} dx`, sol: { kind: "integral", variable: "x", value: v }, racun: ["int", [f, "x", v]] });
// »1« pri ∫_1^10 1/x dx: učenec zamenja ln z desetiškim logaritmom
for (const [f, a, b, val, wrong] of [["x^2", "0", "3", "9", "27"], ["sin(x)", "0", "pi", "2", "0"], ["1/x", "1", "10", "ln(10)", "1"]])
  for (const [v, ok] of [[val, true], [wrong, false]]) add({ skupina: "integral", opis: ok ? "pravilen določeni integral" : "napačen določeni integral", pravilno: ok, ...(ok ? {} : { napaka: "vrednost" }), naloga: `∫_${a}^${b} ${f} dx`, sol: { kind: "integral", variable: "x", value: v }, racun: ["int", [f, "x", a, b, v]] });

// ---------- I. računi (40) ----------
for (let i = 0; i < 10; i++) {
  const [a, b, c, d] = [int(1, 9), int(2, 9), int(1, 9), int(2, 9)];
  const num = a * d + c * b;
  const den = b * d;
  const g = gcd(num, den);
  const expr = `${a}/${b}+${c}/${d}`;
  const ok = den / g === 1 ? String(num / g) : `${num / g}/${den / g}`;
  const wrong = `${a + c}/${b + d}`;
  if (Math.abs((a + c) / (b + d) - num / den) < 1e-12) continue;
  for (const [v, good] of [[ok, true], [wrong, false]]) add({ skupina: "racun", opis: good ? "seštevanje ulomkov" : "napaka: števca in imenovalca seštejemo", pravilno: good, ...(good ? {} : { napaka: "pravilo" }), naloga: expr, sol: { kind: "arith", value: v }, racun: ["value", [expr, v]] });
}
const RAC = [
  ["-3^2", "-9", "9", "zapis"], ["2^3^2", "512", "64", "zapis"], ["(-2)^4", "16", "-16", "predznak"], ["2^(-2)", "1/4", "-4", "pravilo"],
  ["sqrt(50)", "5*sqrt(2)", "25*sqrt(2)", "pravilo"], ["305-7", "298", "297", "vrednost"], ["7*8", "56", "54", "vrednost"],
  ["1.2*0.3", "0.36", "3.6", "vrednost"], ["0.2*150", "30", "300", "vrednost"], ["1000/8", "125", "12.5", "vrednost"],
  ["6/2*(1+2)", "9", "1", "zapis"], ["2+3*4", "14", "20", "zapis"],
];
for (const [e, ok, w, kind] of RAC)
  for (const [v, good] of [[ok, true], [w, false]]) add({ skupina: "racun", opis: good ? "račun" : `napaka: ${kind}`, pravilno: good, ...(good ? {} : { napaka: kind }), naloga: e, sol: { kind: "arith", value: v }, racun: ["value", [e, v]] });

// ---------- J. limite (10) ----------
for (const [f, p, ok, w] of [["sin(x)/x", "0", "1", "0"], ["(x^2-1)/(x-1)", "1", "2", "ne obstaja"], ["(1+1/x)^x", "oo", "e", "1"], ["(exp(x)-1)/x", "0", "1", "e"], ["x*sin(1/x)", "0", "0", "1"]])
  for (const [v, good] of [[ok, true], [w, false]]) add({ skupina: "limita", opis: good ? "limita" : "napačna limita", pravilno: good, ...(good ? {} : { napaka: "vrednost" }), naloga: `lim_{x→${p}} ${f}`, racun: ["limit", [f, "x", p, v]] });

// ---------- K. enote (10) ----------
for (const [e, ok, w] of [["3.2*kg*9.81*m/s^2", "31.4*N", "31.4*J"], ["72*km/h", "20*m/s", "25*m/s"], ["2*kW*3*h", "21600000*J", "6000*J"], ["5*m*4*m", "20*m^2", "20*m"], ["1500*g", "1.5*kg", "15*kg"]])
  // 31.4 N je zaokroženo (točno 31.392 N): največ »numerično«
  for (const [v, good] of [[ok, true], [w, false]]) add({ skupina: "enote", opis: good ? "fizikalni račun z enotami" : "napaka v enoti ali pretvorbi", pravilno: good, ...(good ? {} : { napaka: "enota" }), ...(good && /\./.test(v) ? { najvec: "numericno" } : {}), naloga: e, racun: ["units", [e, v]] });
add({ skupina: "enote", opis: "napaka: napačno zaokrožena vrednost", pravilno: false, napaka: "zaokrozitev", naloga: "3.2*kg*9.81*m/s^2", racun: ["units", ["3.2*kg*9.81*m/s^2", "31.5*N"]] });

// ---------- L. periodične rešitve (10) ----------
for (const [eq, ok, w] of [["sin(x)=0", ["k*pi"], ["pi"]], ["cos(x)=1/2", ["pi/3+2*k*pi", "-pi/3+2*k*pi"], ["pi/3+2*k*pi"]], ["tan(x)=1", ["pi/4+k*pi"], ["pi/4+2*k*pi"]], ["sin(x)=1", ["pi/2+2*k*pi"], ["pi/2+k*pi"]], ["cos(2*x)=1", ["k*pi"], ["2*k*pi"]]])
  // sin(x)=1 s π/2 + kπ: odvečne rešitve (3π/2 ni rešitev); drugje manjka del rešitev
  for (const [v, good, odvec = eq === "sin(x)=1"] of [[ok, true], [w, false]]) add({ skupina: "periodicna", opis: good ? "trigonometrična enačba" : odvec ? "napaka: odvečne rešitve" : "napaka: manjka del rešitev", pravilno: good, ...(good ? {} : { napaka: odvec ? "tuja" : "manjka" }), naloga: eq, sol: { kind: "equation", variable: "x", solutions: v }, racun: ["solve", [eq, "x", v.join(", ")]] });

// ---------- M. velika števila (AUDIT-001) (6) ----------
for (const [eq, ok, w] of [["(x-2)*(x-2000000)=0", ["2", "2000000"], ["2"]], ["x^2-10000001*x+10000000=0", ["1", "10000000"], ["1"]], ["x^2-1000000000000=0", ["1000000", "-1000000"], ["1000000"]]])
  for (const [v, good] of [[ok, true], [w, false]]) add({ skupina: "velika", opis: good ? "enačba z velikimi ničlami" : "napaka: manjka velika ničla", pravilno: good, ...(good ? {} : { napaka: "manjka" }), naloga: eq, sol: { kind: "equation", variable: "x", solutions: v }, racun: ["solve", [eq, "x", v.join(", ")]], resnica: ok });

// ---------- N. skoraj pravilno (tik ob meji tolerance) ----------
// Napake, ki jih lahko sprejme preizkus v točkah ali preizkus s toleranco: velike koeficiente, znanstveni zapis,
// »≈«, zaokrožene decimalke, bližnji ulomki, velika števila. Pravilen zaokrožen odgovor ima mejo »numericno«.
const eqC = (naloga, sols, ok, opis, extra = {}) => add({ skupina: "skoraj", opis, pravilno: ok, ...(ok ? {} : { napaka: "skoraj" }), ...extra, naloga, sol: { kind: "equation", variable: "x", solutions: sols }, racun: ["solve", [naloga, "x", sols.join(", ")]] });
const exC = (naloga, v, ok, opis, extra = {}) => add({ skupina: "skoraj", opis, pravilno: ok, ...(ok ? {} : { napaka: "skoraj" }), ...extra, naloga, sol: { kind: "expression", variable: "x", value: v }, racun: ["equal", [naloga, v]] });
const arC = (naloga, v, ok, opis, extra = {}) => add({ skupina: "skoraj", opis, pravilno: ok, ...(ok ? {} : { napaka: "skoraj" }), ...extra, naloga, sol: { kind: "arith", value: v }, racun: ["value", [naloga, v]] });
const dvC = (f, v, ok, opis) => add({ skupina: "skoraj", opis, pravilno: ok, ...(ok ? {} : { napaka: "skoraj" }), naloga: `f(x) = ${f}`, sol: { kind: "derivative", variable: "x", value: v }, racun: ["diff", [f, "x", v]] });
const NUM = { najvec: "numericno" };
exC("(x+1000000)^2", "x^2+2000000*x+1000000000000", true, "identiteta z velikimi koeficienti");
exC("(x+1000000)^2", "x^2+1999999*x+1000000000000", false, "identiteta z velikimi koeficienti, koeficient za 1 premajhen");
exC("(x+1000)^3", "x^3+3000*x^2+3000000*x+1000000000", true, "kub z velikimi koeficienti");
exC("(x+1000)^3", "x^3+3000*x^2+3000001*x+1000000000", false, "kub z velikimi koeficienti, koeficient za 1 prevelik");
dvC("(x+1000000)^3", "3*(x+1000000)^2", true, "odvod z velikimi koeficienti");
dvC("(x+1000000)^3", "3*x^2+5999999*x+3000000000000", false, "odvod z velikimi koeficienti, koeficient za 1 premajhen");
eqC("(x-2)*(x-2400000)=0", ["2", "2.4*10^6"], true, "ničla v znanstvenem zapisu (točna)");
eqC("(x-2)*(x-2400000)=0", ["2", "2*10^6"], false, "ničla v znanstvenem zapisu, napačna mantisa");
eqC("x-1400000=0", ["1.4e6"], true, "ničla v zapisu e (točna)");
eqC("x-1400000=0", ["1e6"], false, "ničla v zapisu e, napačna mantisa");
eqC("x^2=2000000", ["≈1414.2", "≈-1414.2"], true, "ničli z »≈«, zaokroženi", NUM);
eqC("x^2=2000000", ["≈1414.3", "≈-1414.3"], false, "ničli z »≈«, napačno zaokroženi");
eqC("x^2=2000000", ["≈1414", "≈-1414"], true, "ničli z »≈«, zaokroženi na cela števila", NUM);
eqC("7*x=100", ["≈14.29"], true, "ničla, zaokrožena na 2 decimalki", NUM);
eqC("7*x=100", ["≈14.28"], false, "ničla, odrezana namesto zaokrožena");
arC("1/3+1/7", "0.476", true, "račun, zaokrožen na 3 decimalke", NUM);
arC("1/3+1/7", "0.477", false, "račun, napačno zaokrožen");
arC("sqrt(2)", "1.414", true, "koren, zaokrožen", NUM);
arC("sqrt(2)", "1.415", false, "koren, napačno zaokrožen");
arC("1/(4/3)", "3/4", true, "obratna vrednost ulomka");
arC("1/(4/3)", "4/3", false, "obratna vrednost: ulomek ni obrnjen");
arC("1/3", "0.33", true, "ulomek kot zaokroženo decimalno število", NUM);
arC("1/3", "0.34", false, "ulomek, napačno zaokrožen");
arC("123456789*987654321", "121932631112635269", true, "zmnožek velikih števil");
arC("123456789*987654321", "121932631112635260", false, "zmnožek velikih števil, napaka za 9");
arC("123456789*987654321", "1.2193263111263526*10^17", false, "zmnožek velikih števil v znanstvenem zapisu, napaka za 9");

// ---------- O. druge tipične napake ----------
const drC = (naloga, sols, ok, napaka, opis) => add({ skupina: "druge", opis, pravilno: ok, ...(ok ? {} : { napaka }), naloga, sol: { kind: "equation", variable: "x", solutions: sols }, racun: ["solve", [naloga, "x", sols.length ? sols.join(", ") : "none"]] });
const drN = (naloga, v, ok, napaka, opis) => add({ skupina: "druge", opis, pravilno: ok, ...(ok ? {} : { napaka }), naloga, sol: { kind: "inequality", variable: "x", value: v }, racun: ["ineq", [naloga, "x", v]] });
drC("ln(x)+ln(x-3)=ln(4)", ["4"], true, "", "logaritemska enačba");
drC("ln(x)+ln(x-3)=ln(4)", ["4", "-1"], false, "tuja", "logaritemska enačba, tuja rešitev ni izločena");
drC("abs(x-2)=3", ["5", "-1"], true, "", "enačba z absolutno vrednostjo");
drC("abs(x-2)=3", ["5"], false, "manjka", "enačba z absolutno vrednostjo, manjka negativni primer");
drN("abs(x-1)<2", "(-1, 3)", true, "", "neenačba z absolutno vrednostjo");
drN("abs(x-1)<2", "(-oo, 3)", false, "manjka", "neenačba z absolutno vrednostjo, en primer pozabljen");
drN("(x-1)/(x+2)>=0", "(-oo, -2) U [1, oo)", true, "", "racionalna neenačba");
drN("(x-1)/(x+2)>=0", "(-oo, -2] U [1, oo)", false, "obmocje", "racionalna neenačba, izključena točka vključena");
drC("2^(x+1)=8", ["2"], true, "", "eksponentna enačba");
drC("2^(x+1)=8", ["3"], false, "pravilo", "eksponentna enačba, pozabljen +1 v eksponentu");
drC("x^2-4=0", ["2", "-2"], true, "", "kvadratna enačba");
drC("x^2-4=0", [], false, "manjka", "»ni rešitve«, čeprav rešitvi obstajata");
drC("x^2+1=0", [], true, "", "kvadratna enačba brez realnih rešitev");
drC("x^2+1=0", ["i", "-i"], false, "obmocje", "kompleksni rešitvi navedeni kot realni");
drC("sin(x)=0", ["k*pi/2"], false, "tuja", "periodična rešitev s prekratko periodo (odvečne rešitve)");
drC("cos(x)=0", ["pi/2+k*pi"], true, "", "periodična enačba");
drC("cos(x)=0", ["pi/2+2*k*pi"], false, "manjka", "periodična rešitev s predolgo periodo");

// Samopreverba: napačen odgovor enačbe se mora od prave množice rešitev res razlikovati (številsko).
const mnozica = (a) => JSON.stringify((a || []).map((x) => Number(Function(`"use strict"; const sqrt = Math.sqrt; return (${String(x).replace(/\^/g, "**")});`)()).toFixed(9)).sort());
const POLJA = { naloga: "besedilo naloge za skener", sol: "rešitev v obliki AI rešitve skenerja", racun: "[ukaz SymPy, argumenti] kot v bloku RACUN", pravilno: "ali trditev drži", napaka: "vrsta namerne napake", najvec: "najvišji upravičen status (zaokrožen odgovor)", resnica: "prava množica rešitev (kjer je znana)" };
function zapisi(pot, opis, seznam, polja = POLJA) {
  const ids = new Set(seznam.map((x) => x.id));
  if (ids.size !== seznam.length) fail("podvojen id");
  for (const x of seznam) if (x.sol?.kind === "equation" && Array.isArray(x.resnica) && !x.pravilno && !x.najvec && mnozica(x.sol.solutions) === mnozica(x.resnica)) fail(`${x.id}: napačen odgovor je enak pravemu`);
  mkdirSync(dirname(pot), { recursive: true });
  writeFileSync(pot, JSON.stringify({ opis, polja, primeri: seznam }, null, 1) + "\n");
  const by = {};
  for (const x of seznam) by[x.skupina] = (by[x.skupina] || 0) + 1;
  console.log(`${pot.split("/").pop()}: ${seznam.length} trditev (${seznam.filter((x) => x.pravilno).length} pravilnih):`, JSON.stringify(by));
}
zapisi(OUT, "Referenčni nabor v1 za merjenje preverjanja (PV-02, docs/preverjanje.md). Resnica (pravilno) je znana iz konstrukcije, ne iz preverjevalnikov Evklida. Ustvari scripts/nabor-preverjanje.mjs; ne urejaj na roko.", items);

// =====================================================================================================================
// Nabor v2 (N-01): v1 + nove družine do ≥ 1000 trditev, od tega ≥ 250 napačnih ali robnih. Lastno seme, da v1 ostane
// enak. Pričakovano oceno (pravilno, najvec) sta pred prvim zagonom preverjevalnikov na slepo določila dva neodvisna
// pregledovalca (docs/preverjanje.md, »Nabor v2«); ob spremembi družine je treba novo oceno ponoviti.
// =====================================================================================================================
seed = 2027;
const V1 = items.length;
DVOJNIKI = 0;
for (const x of items) videneV2.add(JSON.stringify([x.naloga, x.sol, x.racun]));
const Fr = (p, q = 1n) => {
  p = BigInt(p);
  q = BigInt(q);
  if (q < 0n) [p, q] = [-p, -q];
  const g = (a, b) => (b ? g(b, a % b) : a < 0n ? -a : a);
  const d = g(p, q) || 1n;
  return { p: p / d, q: q / d };
};
const frAdd = (a, b) => Fr(a.p * b.q + b.p * a.q, a.q * b.q);
const frMul = (a, b) => Fr(a.p * b.p, a.q * b.q);
const frStr = (a) => (a.q === 1n ? String(a.p) : `${a.p}/${a.q}`);
const frPow = (x, n) => Array.from({ length: n }).reduce((s) => frMul(s, x), Fr(1));
const sgnStr = (v) => (v < 0 ? `-${-v}` : `+${v}`);
const eqn = (skupina, naloga, sols, pravilno, opis, extra = {}) =>
  add({ skupina, opis, pravilno, ...extra, naloga, sol: { kind: "equation", variable: "x", solutions: sols }, racun: ["solve", [naloga, "x", sols.length ? sols.join(", ") : "none"]] });
const par = (fn, ok, w, kind) => {
  fn(ok, true, {});
  fn(w, false, { napaka: kind });
};

// ---------- P. eksponentne enačbe (40) ----------
for (let i = 0; i < 20; i++) {
  const a = pick([2, 3, 5]);
  if (i % 4 === 3) {
    // a^x = m, m ni potenca a: x = ln m / ln a; napaka: obrnjen ulomek
    const m = pick([3, 5, 6, 7, 10, 11].filter((v) => v !== a && v % a !== 0));
    const n = `${a}^x=${m}`;
    eqn("eksp", n, [`ln(${m})/ln(${a})`], true, "eksponentna enačba z logaritmom");
    eqn("eksp", n, [`ln(${a})/ln(${m})`], false, "napaka: logaritma v ulomku zamenjana", { napaka: "pravilo" });
    continue;
  }
  const k = pick([1, 2, 3]);
  const b = int(-4, 4);
  const x0 = int(-3, 4);
  const c = k * x0 + b;
  const rhs = c >= 0 ? String(a ** c) : `1/${a ** -c}`;
  const n = `${a}^(${k}*x${sgnStr(b)})=${rhs}`.replace("+0)", ")").replace("1*x", "x");
  eqn("eksp", n, [String(x0)], true, "eksponentna enačba, ista osnova");
  // napaka: b prenesen z napačnim predznakom ali pozabljen deljenje s k
  let w = frStr(Fr(c + b, k));
  if (w === String(x0)) w = String(c);
  if (w === String(x0)) w = String(x0 + 1);
  eqn("eksp", n, [w], false, "napaka: eksponent napačno izražen", { napaka: "vrednost" });
}

// ---------- Q. logaritemske enačbe (40) ----------
for (let i = 0; i < 20; i++) {
  if (i % 5 === 4) {
    // ln x + ln(x + d) = ln(r(r + d)): druga ničla −(r + d) je zunaj definicijskega območja
    const r = int(1, 6);
    const d = int(1, 5);
    const n = `ln(x)+ln(x+${d})=ln(${r * (r + d)})`;
    eqn("log", n, [String(r)], true, "logaritemska enačba, tuja rešitev izločena");
    eqn("log", n, [String(r), String(-(r + d))], false, "napaka: rešitev zunaj definicijskega območja", { napaka: "obmocje" });
    continue;
  }
  const a = pick([2, 3, 5, 10]);
  const b = int(-5, 5);
  const c = int(0, a === 10 ? 3 : 4);
  const x0 = a ** c - b;
  const n = `log(x${sgnStr(b)}, ${a})=${c}`.replace("+0,", ",");
  eqn("log", n, [String(x0)], true, `logaritemska enačba z osnovo ${a}`);
  let w = String(a * c - b);
  if (w === String(x0)) w = String(c ** a - b);
  if (w === String(x0)) w = String(x0 + a);
  eqn("log", n, [w], false, "napaka: logaritem razrešen kot množenje", { napaka: "pravilo" });
}

// ---------- R. absolutna vrednost (40) ----------
for (let i = 0; i < 20; i++) {
  const k = pick([1, 1, 2, 3]);
  const a = int(-6, 6);
  const lhs = `abs(${k === 1 ? "" : `${k}*`}x${sgnStr(-a)})`.replace("+0)", ")");
  if (i % 5 === 4) {
    const b = -int(1, 5);
    const n = `${lhs}=${b}`;
    eqn("abs", n, [], true, "absolutna vrednost je negativna: ni rešitve");
    eqn("abs", n, [frStr(Fr(a + b, k)), frStr(Fr(a - b, k))], false, "napaka: rešitev enačbe z negativno desno stranjo", { napaka: "obmocje" });
    continue;
  }
  const b = int(1, 7);
  const n = `${lhs}=${b}`;
  const t = [frStr(Fr(a + b, k)), frStr(Fr(a - b, k))];
  eqn("abs", n, shuffle(t), true, "enačba z absolutno vrednostjo");
  const manjka = i % 2 || a === 0 || a + b === 0; // pri a = 0 je »napačen predznak« spet prava množica
  eqn("abs", n, manjka ? [t[0]] : [frStr(Fr(a + b, k)), frStr(Fr(-a - b, k))], false, manjka ? "napaka: manjka drugi primer" : "napaka: drugi primer z napačnim predznakom", { napaka: manjka ? "manjka" : "predznak" });
}

// ---------- S. sistemi linearnih enačb (60) ----------
const sys = (naloga, vs, sol, pravilno, opis, extra = {}) => {
  const resitev = sol === null ? "none" : sol.map((t) => t.map((v, j) => `${vs[j]}=${v}`).join(", ")).join("; ");
  add({ skupina: "sistem", opis, pravilno, ...extra, naloga: naloga.join("; "), sol: { kind: "system", solutions: sol === null ? [] : sol.map((t) => t.map((v, j) => `${vs[j]}=${v}`).join(", ")) }, racun: ["solve", [naloga.join(", "), vs.join(", "), resitev]] });
};
const lin = (co, vs, rhs) => co.map((c, j) => (c === 0 ? "" : `${c < 0 ? "-" : "+"}${Math.abs(c) === 1 ? "" : `${Math.abs(c)}*`}${vs[j]}`)).join("").replace(/^\+/, "") + `=${rhs}`;
const det3 = (m) => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
for (let i = 0; i < 30; i++) {
  if (i % 3 === 2) {
    const vs = ["x", "y", "z"];
    let m;
    do m = [0, 1, 2].map(() => [0, 1, 2].map(() => int(-3, 3)));
    while (det3(m) === 0 || m.some((r) => r.every((v) => v === 0)));
    const s = [int(-4, 4), int(-4, 4), int(-4, 4)];
    const eqs = m.map((r) => lin(r, vs, r.reduce((t, v, j) => t + v * s[j], 0)));
    sys(eqs, vs, [s], true, "sistem treh linearnih enačb");
    const w = [...s];
    w[i % 3] += 1;
    sys(eqs, vs, [w], false, "napaka: ena neznanka za 1 napačna", { napaka: "vrednost" });
    continue;
  }
  const vs = ["x", "y"];
  let m;
  do m = [0, 1].map(() => [int(-5, 5), int(-5, 5)]);
  while (m[0][0] * m[1][1] - m[0][1] * m[1][0] === 0 || m.some((r) => r.every((v) => v === 0)));
  const s = [int(-6, 6), int(-6, 6)];
  const rhs = m.map((r) => r[0] * s[0] + r[1] * s[1]);
  const eqs = m.map((r, j) => lin(r, vs, rhs[j]));
  if (i % 3 === 1 && i % 2 === 1) {
    // protislovni sistem: druga enačba je prva, pomnožena z 2, a z drugo desno stranjo
    const e2 = lin(m[0].map((v) => 2 * v), vs, 2 * rhs[0] + 1);
    sys([eqs[0], e2], vs, null, true, "protisloven sistem: ni rešitve");
    sys([eqs[0], e2], vs, [s], false, "napaka: rešitev protislovnega sistema (ustreza le prvi enačbi)", { napaka: "obmocje" });
    continue;
  }
  sys(eqs, vs, [s], true, "sistem dveh linearnih enačb");
  sys(eqs, vs, [s[0] !== s[1] ? [s[1], s[0]] : [s[0], s[1] + 1]], false, s[0] !== s[1] ? "napaka: neznanki zamenjani" : "napaka: y za 1 napačen", { napaka: "vrednost" });
}

// ---------- T. trigonometrijske identitete (40) ----------
const TRIG = [
  ["sin(x+pi/2)", "cos(x)", "sin(x)"], ["cos(x-pi/2)", "sin(x)", "-sin(x)"], ["sin(pi-x)", "sin(x)", "-sin(x)"], ["cos(pi-x)", "-cos(x)", "cos(x)"],
  ["tan(x)*cos(x)", "sin(x)", "1"], ["1-cos(x)^2", "sin(x)^2", "sin(x)"], ["cos(2*x)", "cos(x)^2-sin(x)^2", "2*cos(x)^2"], ["cos(2*x)", "2*cos(x)^2-1", "2*cos(x)-1"],
  ["sin(x)^2/(1-cos(x))", "1+cos(x)", "1-cos(x)"], ["2*sin(x)*cos(x)/sin(2*x)", "1", "2"], ["sin(3*x)", "3*sin(x)-4*sin(x)^3", "3*sin(x)"], ["cos(x)^4-sin(x)^4", "cos(2*x)", "1"],
  ["sin(x+pi)", "-sin(x)", "sin(x)"], ["1+tan(x)^2", "1/cos(x)^2", "1/sin(x)^2"], ["sin(x)/tan(x)", "cos(x)", "1/cos(x)"], ["sin(-x)", "-sin(x)", "sin(x)"],
  ["cos(-x)", "cos(x)", "-cos(x)"], ["sin(x)*cos(y)+cos(x)*sin(y)", "sin(x+y)", "sin(x-y)"], ["cos(x)*cos(y)+sin(x)*sin(y)", "cos(x-y)", "cos(x+y)"], ["(sin(x)+cos(x))^2", "1+sin(2*x)", "1"],
];
for (const [l, r, w] of TRIG) par((v, ok, ex) => add({ skupina: "trig-id", opis: ok ? "trigonometrijska identiteta" : "napačna trigonometrijska identiteta", pravilno: ok, ...ex, naloga: l, sol: { kind: "expression", variable: "x", value: v }, racun: ["equal", [l, v]] }), r, w, "pravilo");

// ---------- U. odvodi, generirani (80) ----------
const odv = (f, v, ok, opis, ex = {}) => add({ skupina: "odvod2", opis, pravilno: ok, ...ex, naloga: `f(x) = ${f}`, sol: { kind: "derivative", variable: "x", value: v }, racun: ["diff", [f, "x", v]] });
for (let i = 0; i < 40; i++) {
  const k = pick([2, 3, 4, 5, -2, -3]);
  const n = int(2, 7);
  const a = pick([2, 3, 5, 7, -4]);
  const b = int(1, 6);
  const kind = i % 8;
  let f, d, w, opis;
  if (kind === 0) [f, d, w, opis] = [`${a}*x^${n}`, `${a * n}*x^${n - 1}`, `${a}*x^${n - 1}`, "potenca"];
  else if (kind === 1) [f, d, w, opis] = [`sin(${k}*x)`, `${k}*cos(${k}*x)`, `cos(${k}*x)`, "verižno pravilo (sin)"];
  else if (kind === 2) [f, d, w, opis] = [`exp(${k}*x)`, `${k}*exp(${k}*x)`, `exp(${k}*x)`, "verižno pravilo (exp)"];
  else if (kind === 3) [f, d, w, opis] = [`ln(${Math.abs(k)}*x+${b})`, `${Math.abs(k)}/(${Math.abs(k)}*x+${b})`, `1/(${Math.abs(k)}*x+${b})`, "verižno pravilo (ln)"];
  else if (kind === 4) [f, d, w, opis] = [`x^${n}*exp(x)`, `(${n}*x^${n - 1}+x^${n})*exp(x)`, `${n}*x^${n - 1}*exp(x)`, "pravilo za produkt"];
  else if (kind === 5) {
    const c = b === 1 ? 2 : 1;
    [f, d, w, opis] = [`(x+${b})/(x+${b + c})`, `${c}/(x+${b + c})^2`, `${-c}/(x+${b + c})^2`, "pravilo za kvocient"];
  } else if (kind === 6) [f, d, w, opis] = [`cos(x^${n})`, `-${n}*x^${n - 1}*sin(x^${n})`, `-sin(x^${n})`, "verižno pravilo (cos)"];
  else [f, d, w, opis] = [`(${Math.abs(k)}*x+${b})^${n}`, `${n * Math.abs(k)}*(${Math.abs(k)}*x+${b})^${n - 1}`, `${n}*(${Math.abs(k)}*x+${b})^${n - 1}`, "verižno pravilo (potenca)"];
  odv(f, d, true, `odvod: ${opis}`);
  odv(f, w, false, `napaka: ${opis}`, { napaka: "pravilo" });
}

// ---------- V. integrali, generirani (80) ----------
const intg = (f, v, ok, opis, meje, ex = {}) =>
  add({ skupina: "integral2", opis, pravilno: ok, ...ex, naloga: meje ? `∫_${meje[0]}^${meje[1]} ${f} dx` : `∫ ${f} dx`, sol: { kind: "integral", variable: "x", value: v }, racun: ["int", meje ? [f, "x", meje[0], meje[1], v] : [f, "x", v]] });
for (let i = 0; i < 40; i++) {
  const k = pick([2, 3, 4, 5]);
  const n = int(1, 5);
  const a = pick([2, 3, 4, 6]);
  const kind = i % 5;
  if (kind === 4) {
    // določeni integral polinoma: točna vrednost z ulomki
    const co = [int(-4, 4), int(-3, 3), int(-2, 2)];
    if (co.every((v) => v === 0)) co[0] = 1;
    const lo = int(-2, 1);
    const hi = lo + int(1, 3);
    let val = Fr(0);
    co.forEach((c, j) => (val = frAdd(val, frMul(Fr(c, j + 1), frAdd(frPow(Fr(hi), j + 1), Fr(-(lo ** (j + 1))))))));
    const f = co.map((c, j) => (c === 0 ? "" : `${c < 0 ? "-" : "+"}${Math.abs(c)}${j ? `*x${j > 1 ? `^${j}` : ""}` : ""}`)).join("").replace(/^\+/, "");
    const ok = frStr(val);
    const w = frStr(frAdd(val, Fr(i % 2 ? 1 : -1)));
    intg(f, ok, true, "določeni integral polinoma", [String(lo), String(hi)]);
    intg(f, w, false, "napaka: določeni integral za 1 napačen", [String(lo), String(hi)], { napaka: "vrednost" });
    continue;
  }
  let f, F, W, opis;
  if (kind === 0) [f, F, W, opis] = [`${a}*x^${n}`, `${frStr(Fr(a, n + 1))}*x^${n + 1}`, `${a}*x^${n + 1}`, "potenca"];
  else if (kind === 1) [f, F, W, opis] = [`exp(${k}*x)`, `exp(${k}*x)/${k}`, `${k}*exp(${k}*x)`, "eksponentna funkcija"];
  else if (kind === 2) [f, F, W, opis] = [`cos(${k}*x)`, `sin(${k}*x)/${k}`, `-sin(${k}*x)/${k}`, "kosinus"];
  else [f, F, W, opis] = [`1/(x+${a})`, `ln(abs(x+${a}))`, `-1/(x+${a})^2`, "1/(x + a)"];
  intg(f, F, true, `nedoločeni integral: ${opis}`);
  intg(f, W, false, `napaka: ${opis}`, null, { napaka: "pravilo" });
}

// ---------- W. limite, generirane (60) ----------
const lim = (f, p, v, ok, opis, ex = {}) => add({ skupina: "limita2", opis, pravilno: ok, ...ex, naloga: `lim_{x→${p}} ${f}`, racun: ["limit", [f, "x", p, v]] });
for (let i = 0; i < 30; i++) {
  const a = pick([1, 2, 3, 4, 5, -2, -3]);
  const p = int(1, 6);
  const q = pick([1, 2, 3, 4, 5].filter((v) => v !== p));
  const kind = i % 3;
  if (kind === 0) {
    const f = `(x^2-${a * a})/(x${sgnStr(-a)})`;
    lim(f, String(a), String(2 * a), true, "limita z ničlo v števcu in imenovalcu");
    lim(f, String(a), String(a), false, "napaka: limita okrajšanega izraza napačno izračunana", { napaka: "vrednost" });
  } else if (kind === 1) {
    const f = `(${p}*x^2+${q}*x+1)/(${q}*x^2-${p})`;
    lim(f, "oo", frStr(Fr(p, q)), true, "limita racionalne funkcije v neskončnosti");
    lim(f, "oo", frStr(Fr(q, p)), false, "napaka: koeficienta zamenjana", { napaka: "vrednost" });
  } else {
    const k = Math.abs(a) + 1;
    lim(`sin(${k}*x)/x`, "0", String(k), true, "limita sin(kx)/x");
    lim(`sin(${k}*x)/x`, "0", "1", false, "napaka: faktor k pozabljen", { napaka: "vrednost" });
  }
}

// ---------- X. računi, generirani (80) ----------
const rac = (e, v, ok, opis, ex = {}) => add({ skupina: "racun2", opis, pravilno: ok, ...ex, naloga: e, sol: { kind: "arith", value: v }, racun: ["value", [e, v]] });
for (let i = 0; i < 40; i++) {
  const kind = i % 8;
  if (kind === 0) {
    const k = pick([2, 3, 5, 6, 7]);
    const m = pick([2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== k)); // k·√m = m·√k le pri m = k
    rac(`sqrt(${m * m * k})`, `${m}*sqrt(${k})`, true, "delno korenjenje");
    rac(`sqrt(${m * m * k})`, `${k}*sqrt(${m})`, false, "napaka: napačno delno korenjenje", { napaka: "pravilo" });
  } else if (kind === 1) {
    const b = pick([2, 3, 5]);
    const n = int(2, 4);
    rac(`${b}^(-${n})`, `1/${b ** n}`, true, "negativni eksponent");
    rac(`${b}^(-${n})`, `-${b ** n}`, false, "napaka: negativni eksponent kot predznak", { napaka: "pravilo" });
  } else if (kind === 2) {
    const p = pick([5, 12, 15, 20, 25, 40]);
    const N = pick([80, 120, 240, 360, 480]);
    rac(`${p}/100*${N}`, String((p * N) / 100), true, "odstotek od števila");
    rac(`${p}/100*${N}`, String(p * N), false, "napaka: odstotek brez deljenja s 100", { napaka: "pravilo" });
  } else if (kind === 3) {
    const [a, b, c] = [int(2, 9), int(2, 9), int(2, 9)];
    rac(`${a}+${b}*${c}`, String(a + b * c), true, "vrstni red računskih operacij");
    rac(`${a}+${b}*${c}`, String((a + b) * c), false, "napaka: seštevanje pred množenjem", { napaka: "zapis" });
  } else if (kind === 4) {
    const [a, b, c, d] = [int(1, 9), int(2, 9), int(1, 9), int(2, 9)];
    const ok = frMul(Fr(a, b), Fr(d, c));
    const w = frMul(Fr(a, b), Fr(c, d));
    if (ok.p === w.p && ok.q === w.q) {
      i--;
      continue;
    }
    rac(`(${a}/${b})/(${c}/${d})`, frStr(ok), true, "deljenje ulomkov");
    rac(`(${a}/${b})/(${c}/${d})`, frStr(w), false, "napaka: delitelj ni obrnjen", { napaka: "pravilo" });
  } else if (kind === 5) {
    const x = int(12, 99);
    const y = int(12, 99);
    const z = int(1001, 9999);
    const ok = BigInt(x) * BigInt(y) * BigInt(z);
    rac(`${x}*${y}*${z}`, String(ok), true, "zmnožek večmestnih števil");
    rac(`${x}*${y}*${z}`, String(ok + (i % 2 ? 10n : -1n)), false, "napaka: zmnožek za malo napačen", { napaka: "vrednost" });
  } else if (kind === 6) {
    const a = pick([2, 3, 5, 10]);
    const m = int(2, 5);
    const n = int(2, 4);
    rac(`log(${a ** (m + n)}, ${a})`, String(m + n), true, "logaritem potence");
    rac(`log(${a ** (m + n)}, ${a})`, String(m * n === m + n ? m * n + 1 : m * n), false, "napaka: eksponenta zmnožena namesto seštevka", { napaka: "pravilo" });
  } else {
    // ekvivalentna oblika: neokrajšan ulomek, decimalni zapis točne vrednosti
    const [a, b] = [int(1, 7), pick([2, 4, 5, 8])];
    const m = int(2, 4);
    const opis = "pravilno v neokrajšani obliki";
    rac(`${a}/${b}+${a}/${b}`, `${2 * a * m}/${b * m}`, true, opis);
    rac(`${a}/${b}+${a}/${b}`, `${2 * a}/${2 * b}`, false, "napaka: seštejemo tudi imenovalca", { napaka: "pravilo" });
  }
}

// ---------- Y. neenačbe, generirane (60) ----------
const neen = (naloga, v, ok, opis, ex = {}) => add({ skupina: "neenacba2", opis, pravilno: ok, ...ex, naloga, sol: { kind: "inequality", variable: "x", value: v }, racun: ["ineq", [naloga, "x", v]] });
for (let i = 0; i < 30; i++) {
  const a = int(-5, 5);
  const b = int(1, 6);
  const kind = i % 3;
  if (kind === 0) {
    const n = `abs(x${sgnStr(-a)})<${b}`.replace("+0)", ")");
    neen(n, `(${a - b}, ${a + b})`, true, "neenačba |x − a| < b");
    neen(n, `(-oo, ${a + b})`, false, "napaka: en primer pozabljen", { napaka: "manjka" });
  } else if (kind === 1) {
    const n = `abs(x${sgnStr(-a)})>=${b}`.replace("+0)", ")");
    neen(n, `(-oo, ${a - b}] U [${a + b}, oo)`, true, "neenačba |x − a| ≥ b");
    neen(n, `[${a - b}, ${a + b}]`, false, "napaka: unija in presek zamenjana", { napaka: "komplement" });
  } else {
    const c = a + b;
    const n = `(x${sgnStr(-a)})/(x${sgnStr(-c)})<=0`.replace(/\+0\)/g, ")");
    neen(n, `[${a}, ${c})`, true, "racionalna neenačba");
    neen(n, `[${a}, ${c}]`, false, "napaka: ničla imenovalca vključena", { napaka: "obmocje" });
  }
}

// ---------- Z. enote in pretvorbe (30) ----------
const ENOTE = [
  ["108*km/h", "30*m/s", "300*m/s"], ["15*m/s", "54*km/h", "15*km/h"], ["1*kW*h", "3600000*J", "1000*J"], ["250*cm^2", "0.025*m^2", "2.5*m^2"],
  ["2*g/cm^3", "2000*kg/m^3", "2*kg/m^3"], ["45*minute", "2700*s", "4500*s"], ["3*N*4*m", "12*J", "12*N"], ["12*V*2*A", "24*W", "24*J"],
  ["500*g*2*m/s^2", "1*N", "1000*N"], ["0.5*kg*(4*m/s)^2/2", "4*J", "8*J"], ["2*kg*9.81*m/s^2*3*m", "58.86*J", "58.86*N"], ["1*km/(4*minute)", "250/60*m/s", "250*m/s"],
  ["20*m/(4*s)", "5*m/s", "80*m/s"], ["36*km/h*600*s", "6000*m", "21600*m"], ["1200*W*30*s", "36000*J", "40*J"],
];
for (const [e, ok, w] of ENOTE) par((v, good, ex) => add({ skupina: "enote2", opis: good ? "fizikalni račun z enotami" : "napaka v enoti ali pretvorbi", pravilno: good, ...ex, naloga: e, racun: ["units", [e, v]] }), ok, w, "enota");

// ---------- Ž. ekvivalentne oblike pravilnih odgovorov in skoraj enaki napačni (40) ----------
const ekv = (naloga, v, ok, opis, kind = "expression", ex = {}) =>
  add({ skupina: "ekvivalentno", opis, pravilno: ok, ...ex, naloga, sol: kind === "expression" ? { kind, variable: "x", value: v } : { kind: "equation", variable: "x", solutions: v }, racun: kind === "expression" ? ["equal", [naloga, v]] : ["solve", [naloga, "x", v.join(", ")]] });
const EKV = [
  ["(1+sqrt(5))/2", "1/2+sqrt(5)/2", "(1+sqrt(5))/4"], ["2*x+2", "2*(x+1)", "2*(x+2)"], ["x^2-5*x+6", "(x-3)*(x-2)", "(x-3)*(x+2)"], ["1/sqrt(2)", "sqrt(2)/2", "sqrt(2)"],
  ["(x+1)/(x^2-1)", "1/(x-1)", "1/(x+1)"], ["exp(ln(x)+1)", "e*x", "x+e"], ["ln(8)", "3*ln(2)", "8*ln(1)"], ["sqrt(12)/sqrt(3)", "2", "4"],
  ["6/8", "0.75", "0.68"], ["(x^3-x)/x", "x^2-1", "x^2"],
];
for (const [n, ok, w] of EKV) par((v, good, ex) => ekv(n, v, good, good ? "pravilen odgovor v drugi, enakovredni obliki" : "napaka: skoraj enaka, a napačna oblika", "expression", ex), ok, w, "skoraj");
const EKVE = [
  ["x^2-x-1=0", ["(1-sqrt(5))/2", "(1+sqrt(5))/2"], ["(1-sqrt(5))/2", "(1+sqrt(3))/2"]], ["6*x=3", ["3/6"], ["6/3"]], ["4*x^2=1", ["0.5", "-0.5"], ["0.5"]],
  ["x^2=8", ["2*sqrt(2)", "-sqrt(8)"], ["2*sqrt(2)", "-2*sqrt(8)"]], ["(x-1)^2=0", ["1"], ["1", "-1"]], ["x^3=x", ["0", "1", "-1"], ["1", "-1"]],
  ["2^x=1/8", ["-3"], ["3"]], ["ln(x)=0", ["1"], ["0"]], ["sqrt(x)=0", ["0"], ["1"]], ["x/(x-1)=2", ["2"], ["1", "2"]],
];
for (const [n, ok, w] of EKVE) par((v, good, ex) => ekv(n, v, good, good ? "pravilne rešitve v nenavadni obliki" : "napaka: skoraj enake rešitve", "equation", ex), ok, w, "skoraj");

// ---------- AA. zaporedja in kombinatorika (dodano po odstranitvi dvojnikov; svoje seme) ----------
seed = 2028;
const nZap = items.length;
for (let i = 0; i < 400 && items.length - nZap < 40; i++) {
  const n = int(5, 20);
  const a1 = int(-5, 9);
  const d = pick([2, 3, 4, 5, -2, -3]);
  const e = `${n}*(2*${a1 < 0 ? `(${a1})` : a1}+(${n}-1)*${d < 0 ? `(${d})` : d})/2`;
  const S = (n * (2 * a1 + (n - 1) * d)) / 2;
  const W = (n * (2 * a1 + n * d)) / 2;
  const pred = items.length;
  rac(`${e}`, String(S), true, "vsota aritmetičnega zaporedja");
  if (items.length === pred) continue;
  rac(`${e}`, String(W), false, "napaka: n namesto n − 1 v vsoti", { napaka: "pravilo" });
  const a = int(1, 5);
  const q = pick([2, 3, -2]);
  const m = int(3, 8);
  const g = `${a}*(${q < 0 ? `(${q})` : q}^${m}-1)/(${q}-1)`; // (−2)^m z oklepajem: −2^m je −(2^m) (pregledovalec, N-01)
  const G = (a * (q ** m - 1)) / (q - 1);
  const pred2 = items.length;
  rac(g, String(G), true, "vsota geometrijskega zaporedja");
  if (items.length === pred2) continue;
  rac(g, String(a * q ** m), false, "napaka: vsota zamenjana z n-tim členom", { napaka: "pravilo" });
}
const nKomb = items.length;
for (let i = 0; i < 400 && items.length - nKomb < 40; i++) {
  const n = int(5, 14);
  const k = int(2, n - 2);
  const C = Array.from({ length: k }).reduce((t, _, j) => (t * BigInt(n - j)) / BigInt(j + 1), 1n);
  const P = Array.from({ length: k }).reduce((t, _, j) => t * BigInt(n - j), 1n);
  const pred = items.length;
  if (i % 2) {
    rac(`binomial(${n}, ${k})`, String(C), true, "binomski koeficient");
    if (items.length === pred) continue;
    rac(`binomial(${n}, ${k})`, String(P), false, "napaka: variacije namesto kombinacij", { napaka: "pravilo" });
  } else {
    rac(`factorial(${n})/factorial(${n - k})`, String(P), true, "variacije brez ponavljanja");
    if (items.length === pred) continue;
    rac(`factorial(${n})/factorial(${n - k})`, String(P * BigInt(n - k)), false, "napaka: fakulteta v imenovalcu za 1 premajhna", { napaka: "vrednost" });
  }
}

const v2 = items;
console.log(`v2: izpuščenih dvojnikov ${DVOJNIKI}`);
if (v2.length < 1000) fail(`v2 ima le ${v2.length} trditev`);
if (v2.filter((x) => !x.pravilno).length < 250) fail("v2 ima premalo napačnih trditev");
zapisi(
  join(dirname(OUT), "nabor-v2.json"),
  `Referenčni nabor v2 (N-01, docs/preverjanje.md): prvih ${V1} trditev je enakih kot v v1, ostale so nove družine. Resnica iz konstrukcije. Vseh ${v2.length - V1} novih trditev so pred zagonom preverjevalnikov na slepo (premešane, brez oznak) ocenili trije neodvisni pregledovalci (26. 11. 2026). Razhajanja: racun2-062 (5/5 + 5/5 = 2, ne 10/10 = 1) je pregledovalčeva napaka; racun2-084 in racun2-108 sta bili napaka nabora (−2^n namesto (−2)^n), popravljeni z oklepajem. Ustvari scripts/nabor-preverjanje.mjs; ne urejaj na roko.`,
  v2,
  POLJA,
);

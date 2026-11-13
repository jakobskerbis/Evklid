// Samodejno preračunavanje številskih korakov v lekciji (docs/kakovost.md §1.1, docs/token-rules.md §3).
// Vsako formulo $…$ razbije ob »=« in »\approx« na dele. Del brez spremenljivk (samo števila,
// + − · / ^, ulomki, mešana števila, zapis a · 10ⁿ, koreni, |x|, π, odstotki, enote) izračuna in ga
// primerja s sosednjim izračunanim delom. Ne preverja: pretvorb enot (3 kg = 3 · 100 = 300 dag,
// 4157 J ≈ 4,16 kJ), ustreznic v odstotkih (20 % = 60 €), stopinj proti radianom, izjav iz dveh
// golih števil (1 eV = 1,602 · 10⁻¹⁹ J, »0 = 4 ni res«), vrstic o ocenjevanju (ohlapneje) ter
// razdelkov »Pogoste napake« in »Preveri se«, kjer napačni računi stojijo namenoma.
// Uporaba: checkArithmetic(bodyMarkdown) → { checked, mismatches: [{ line, tex, left, right, rel }] }

const SKIP_LINE = /napačn|narobe|ne velja|ni enako|nepravil|ni res|neresnič|protislov|nemogoč|nima rešit|nesmisel|ne drži|✗/i;
const LOOSE_LINE = /ocen|približ|zaokrož/i; // ocenjevanje: 48² ≈ 50² = 2500
const SKIP_TEX = /\\(pm|mp|le|ge|leq|geq|neq|ne|lt|gt|in|to|rightarrow|Rightarrow|longrightarrow|iff|implies|infty|ldots|cdots|dots|equiv|sim|propto)\b|[<>≤≥≠→]/;
const SEP = /(=|\\approx|\\doteq)/;
const WORDS = /\b(sqrt|root|abs|pi)\b/g;

// Količniki pri pretvorbah enot (×10ⁿ): 1 (10, 100, …), 3,6 (km/h ↔ m/s, kWh ↔ J, 360°), 6 (60 s),
// 2,4 (24 h), 1,44 (1440 min), 8,64 (86400 s), 2,7778 (1/3,6), 1,6667 (1/60); konstante
// 1,602 (eV ↔ J), 1,66 (u ↔ kg), 4,184 (cal ↔ J), 1,013 (atm ↔ Pa), 2,54 (in ↔ cm).
const CONVERSION_MANTISSAS = [1, 3.6, 6, 2.4, 1.44, 8.64, 2.77778, 1.66667, 1.602, 1.66, 4.184, 1.013, 2.54];
function isConversionRatio(a, b, tol) {
  if (!a || !b) return false;
  const r = Math.abs(a / b) >= 1 ? Math.abs(a / b) : Math.abs(b / a);
  const m = r / 10 ** Math.floor(Math.log10(r) + 1e-9);
  // tudi obratne vrednosti (1/1,602 → 6,242; 1/3,6 → 2,778)
  return CONVERSION_MANTISSAS.some((c0) => [c0, 10 / c0].some((c) => Math.abs(m - c) / c < tol || Math.abs(m / 10 - c) / c < tol));
}

// LaTeX → preprost aritmetični izraz. Vrne null, če del ni čisto številski.
// pct: "div" bere »25\%« kot 25/100, "unit" kot število 25 z enoto %.
export function normalizeTex(tex, pct = "div") {
  if (tex.length > 300) return null;
  let s = tex.replace(/\\,/g, "").replace(/\\left|\\right|\\[!;:>]|\\quad|\\qquad|\\ |~/g, " ");
  const units = [];
  // Enote: \mathrm{kW}, \text{cm}^2, \Omega, °, ^\circ
  s = s.replace(/\\(?:mathrm|text|textrm|textit|operatorname|mathit|mathbf)\s*\{([^{}]*)\}(\s*\^\s*(?:\{[^{}]*\}|\\circ|\w))?/g, (_, u, e) => {
    if (u.trim()) units.push(u.trim() + (e || "").replace(/\s/g, ""));
    return " ";
  });
  s = s.replace(/\\(Omega|degree)\b/g, (_, u) => (units.push(u === "degree" ? "°" : u), " "));
  s = s.replace(/\^\s*(?:\{\\circ\}|\\circ)|°/g, () => (units.push("°"), " "));
  s = s.replace(/\\[dt]?frac\s*\{\s*\}\s*\{\s*\}/g, " "); // ostanek enote m/s
  // Decimalna vejica, ločila stavka, odstotki, operatorji
  s = s.replace(/\{,\}/g, ".").replace(/(\d),(\d)/g, "$1.$2").replace(/[.,;]\s*$/, "");
  s = s.replace(/\\%/g, () => (pct === "unit" ? (units.push("%"), " ") : "/100"));
  s = s.replace(/\\cdot|\\times/g, "*").replace(/\\div/g, "/").replace(/\\pi\b/g, " pi ");
  s = s.replace(/\\lvert|\\rvert|\\vert/g, "|");
  // Mešano število 2\frac{1}{3} = 2 + 1/3
  s = s.replace(/(\d+(?:\.\d+)?)\s*(\\[dt]?frac\s*\{[^{}]*\}\s*\{[^{}]*\})/g, "($1+$2)");
  // Potence, ulomki, koreni od znotraj navzven
  let prev;
  do {
    prev = s;
    s = s.replace(/\^\s*\{([^{}]*)\}/g, "**($1)");
    s = s.replace(/\\[dt]?frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, "(($1)/($2))");
    s = s.replace(/\\sqrt\s*\[([^\]{}]*)\]\s*\{([^{}]*)\}/g, "root($1,$2)");
    s = s.replace(/\\sqrt\s*\{([^{}]*)\}/g, "sqrt($1)");
    s = s.replace(/\\sqrt\s*(\d+(?:\.\d+)?)/g, "sqrt($1)");
  } while (s !== prev);
  s = s.replace(/\|([^|]*)\|/g, "abs($1)");
  s = s.replace(/[{]/g, "(").replace(/[}]/g, ")").replace(/\^/g, "**");
  // Zapis a · 10ⁿ je eno število: 3,97 · 10⁻¹⁹ / 1,602 · 10⁻¹⁹ pomeni (3,97 · 10⁻¹⁹) / (1,602 · 10⁻¹⁹).
  s = s.replace(/(\d+\.?\d*)\s*\*\s*10\s*\*\*\s*(\(\s*[-+]?\d+\s*\)|[-+]?\d+)/g, "($1*10**$2)");
  s = s.replace(/[*/]\s*$/, "").replace(/\(\s*\)/g, "").trim(); // ostanek po odstranjeni enoti
  if (!/\d/.test(s)) return null;
  if (/[^\d\s.+\-*/(),]/.test(s.replace(WORDS, ""))) return null;
  // Golo število: 6,5 | -36 | (1.602*10**(-19))
  const lit = s.match(/^-?\(?(-?\d+(?:\.\d+)?)(?:\*10\*\*\(?([-+]?\d+)\)?)?\)?$/);
  const bare = !!lit;
  const mantissa = bare ? lit[1].replace("-", "") : "";
  const decimals = bare ? (mantissa.split(".")[1] || "").length : null;
  const exp = bare && lit[2] ? Number(lit[2]) : 0;
  const ulp = bare ? 10 ** (exp - decimals) : null;
  const trailingZeros = bare && !mantissa.includes(".") ? (mantissa.match(/0*$/) || [""])[0].length : 0;
  const maxLiteral = Math.max(0, ...(s.match(/\d+\.?\d*/g) || []).map(Number));
  return { expr: s, units, bare, ulp, exp, trailingZeros, maxLiteral };
}

// Majhen razčlenjevalnik: števila, + - * / **, oklepaji, sqrt/root/abs/pi, implicitno množenje (2 pi, 2(3+4)).
// Dve števili zapored (»1 30« iz »1 h 30 min«) nista izraz → NaN.
export function evaluate(expr) {
  const toks = [];
  const re = /\s*(\d+\.?\d*|\.\d+|\*\*|[+\-*/(),]|[a-z]+)/gy;
  let m;
  let pos = 0;
  while (pos < expr.length) {
    re.lastIndex = pos;
    m = re.exec(expr);
    if (!m) {
      if (/^\s*$/.test(expr.slice(pos))) break;
      return NaN;
    }
    pos = re.lastIndex;
    const t = m[1];
    const last = toks[toks.length - 1];
    const isNum = /^[\d.]/.test(t);
    const isValueStart = isNum || t === "(" || t === "pi" || t === "sqrt" || t === "root" || t === "abs";
    const prevIsValueEnd = last && (/^[\d.]/.test(last) || last === ")" || last === "pi");
    if (isNum && last && /^[\d.]/.test(last)) return NaN;
    if (isValueStart && prevIsValueEnd) toks.push("*");
    toks.push(t);
  }
  let i = 0;
  const peek = () => toks[i];
  const next = () => toks[i++];
  const expect = (t) => {
    if (next() !== t) throw new Error("syntax");
  };
  function atom() {
    const t = next();
    if (t === undefined) throw new Error("eof");
    if (t === "(") {
      const v = sum();
      expect(")");
      return v;
    }
    if (t === "pi") return Math.PI;
    if (t === "sqrt" || t === "abs" || t === "root") {
      expect("(");
      const a = sum();
      let b;
      if (t === "root") {
        expect(",");
        b = sum();
      }
      expect(")");
      if (t === "sqrt") return Math.sqrt(a);
      if (t === "abs") return Math.abs(a);
      return a % 2 === 1 && b < 0 ? -((-b) ** (1 / a)) : b ** (1 / a);
    }
    if (/^[\d.]/.test(t)) return Number(t);
    throw new Error("token " + t);
  }
  function power() {
    const base = atom();
    if (peek() === "**") {
      next();
      return base ** unary();
    }
    return base;
  }
  function unary() {
    if (peek() === "-") return (next(), -unary());
    if (peek() === "+") return (next(), unary());
    return power();
  }
  function product() {
    let v = unary();
    while (peek() === "*" || peek() === "/") v = next() === "*" ? v * unary() : v / unary();
    return v;
  }
  function sum() {
    let v = product();
    while (peek() === "+" || peek() === "-") v = next() === "+" ? v + product() : v - product();
    return v;
  }
  try {
    const v = sum();
    if (i !== toks.length) return NaN;
    return v;
  } catch {
    return NaN;
  }
}

// Polovica zadnjega izpisanega mesta: 6,5 → 0,05; 1,602·10⁻¹⁹ → 0,0005·10⁻¹⁹; pri »≈« tudi 4 600 000 → 50 000.
const halfUlp = (x, approx) => 0.5 * (approx && x.trailingZeros && x.ulp === 1 ? 10 ** x.trailingZeros : x.ulp);

// Primerja dva izračunana dela. Vrne null (ujema se), "skip" (pretvorba, ustreznica, izjava) ali relativno razliko.
function compare(a, b, approx, loose) {
  const diff = Math.abs(a.value - b.value);
  const scale = Math.max(Math.abs(a.value), Math.abs(b.value), 1e-12);
  // 1 % rezultata (zaokrožanje, 3,14 za π) ali polovica zadnjega mesta; pri ocenah 15 %.
  // Pri odštevanju skoraj enakih števil (39,9 − 39,8 ≈ 0) 1 % operandov.
  const cancel = /\d\s*-/.test(a.expr) || /\d\s*-/.test(b.expr);
  let tol = (loose ? 0.15 : 0.01) * (cancel ? Math.max(scale, a.maxLiteral, b.maxLiteral) : scale);
  let ratioTol = 0.01;
  for (const x of [a, b]) {
    if (!x.bare) continue;
    tol = Math.max(tol, halfUlp(x, approx));
    ratioTol = Math.min(0.03, Math.max(ratioTol, halfUlp(x, approx) / Math.max(Math.abs(x.value), 1e-12)));
  }
  if (diff <= tol + 1e-12) return null;
  if (a.bare && b.bare) return "skip"; // 1 eV = 1,602·10⁻¹⁹ J, 10 m = 1000 cm, »0 = 4«
  const ua = a.units.join();
  const ub = b.units.join();
  if (a.units.includes("%") !== b.units.includes("%")) return "skip"; // 20 % = 60 €
  if (a.units.includes("°") !== b.units.includes("°")) return "skip"; // 150° = 5π/6
  if (ua !== ub && (a.units.length || b.units.length)) {
    if ((a.bare || b.bare) && isConversionRatio(a.value, b.value, ratioTol)) return "skip"; // 3 kg = 3 · 100 = 300 dag
  }
  return diff / scale;
}

const fmt = (v) => String(Number(v.toPrecision(6))).replace(".", ",");

function checkChain(tex, pct, loose) {
  const parts = tex.split(SEP); // del, ločilo, del, …
  let prev = null;
  let checked = 0;
  const mismatches = [];
  for (let k = 0; k < parts.length; k += 2) {
    const n = normalizeTex(parts[k], pct);
    const value = n ? evaluate(n.expr) : NaN;
    if (!Number.isFinite(value)) {
      prev = null;
      continue;
    }
    const cur = { ...n, value };
    if (prev) {
      const r = compare(prev, cur, parts[k - 1] !== "=", loose);
      if (r !== "skip") checked++;
      if (typeof r === "number") mismatches.push({ left: fmt(prev.value), right: fmt(cur.value), rel: r });
    }
    prev = cur;
  }
  return { checked, mismatches };
}

export function checkArithmetic(body) {
  const mismatches = [];
  let checked = 0;
  // Razdelek za vsako vrstico (da izpustimo Pogoste napake in Preveri se).
  const lines = body.split("\n");
  const skipLine = [];
  let skipSection = false;
  lines.forEach((l, i) => {
    const h = l.match(/^## +(.*)/);
    if (h) skipSection = /^(pogoste|preveri)/i.test(h[1].trim());
    skipLine[i] = skipSection || SKIP_LINE.test(l);
  });
  const lineOf = (idx) => body.slice(0, idx).split("\n").length - 1;
  const re = /\$\$([\s\S]+?)\$\$|(^|[^\\$])\$([^$\n]+?)\$/g;
  let m;
  while ((m = re.exec(body))) {
    const tex = m[1] ?? m[3];
    const line = lineOf(m.index + (m[2] ? m[2].length : 0));
    if (skipLine[line]) continue;
    if (!SEP.test(tex) || SKIP_TEX.test(tex)) continue;
    const loose = LOOSE_LINE.test(lines[line] || "");
    // Odstotek je lahko količnik (25 % · 80 = 20) ali enota (0,10 · 100 = 10 %): velja ugodnejše branje.
    let r = checkChain(tex, "div", loose);
    if (r.mismatches.length && tex.includes("\\%")) {
      const u = checkChain(tex, "unit", loose);
      if (u.mismatches.length < r.mismatches.length) r = u;
    }
    checked += r.checked;
    for (const x of r.mismatches) mismatches.push({ line: line + 1, tex: tex.trim().slice(0, 80), ...x });
  }
  return { checked, mismatches };
}

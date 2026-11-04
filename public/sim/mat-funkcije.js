// Simulacije: grafi funkcij (s prednastavitvami), limita, odvod, integral, zaporedja, vrste, obresti,
// kompleksna števila in gibanje (srečanje).
import { h, s, svgBox, slider, select, segmented, toggle, button, buttons, readout, layout, tex, texBlock, fmt, tfmt, clamp, label, axes, fnPath, arrow, animate, playButton, draggable, handle, deg, rad, axisMark, spanMark, axisSlider, snapTo } from "./kit.js";

const PI = Math.PI;
const T = (x, d = 2) => tfmt(x, d);
const sgn = (x) => (x < 0 ? "-" : "+");
// »+ 3«, »- 2«, ali nič, za lepši zapis izrazov.
const term = (v, suffix = "", first = false) => {
  if (Math.abs(v) < 1e-12) return "";
  const a = Math.abs(v), coef = suffix && Math.abs(a - 1) < 1e-12 ? "" : T(a);
  return first ? `${v < 0 ? "-" : ""}${coef}${suffix}` : ` ${sgn(v)} ${coef}${suffix}`;
};
// koeficient pred izrazom: 1 → "", −1 → "-"
const cf = (v) => (Math.abs(v - 1) < 1e-12 ? "" : Math.abs(v + 1) < 1e-12 ? "-" : T(v));
// negativna števila v oklepaju
const par = (v) => (v < 0 ? `(${T(v)})` : T(v));
// večkratnik π/12 v zapisu LaTeX
const piTex = (v) => {
  const k = Math.round((v / PI) * 12);
  if (Math.abs(v - (k * PI) / 12) > 1e-9) return T(v);
  if (k === 0) return "0";
  const g = ((a, b) => { while (b) [a, b] = [b, a % b]; return a; })(Math.abs(k), 12);
  const n = Math.abs(k) / g, d = 12 / g, sg = k < 0 ? "-" : "";
  return d === 1 ? `${sg}${n === 1 ? "" : n}\\pi` : `${sg}\\frac{${n === 1 ? "" : n}\\pi}{${d}}`;
};
const shift = (name, v) => (Math.abs(v) < 1e-12 ? name : `(${name} ${sgn(-v)} ${T(Math.abs(v))})`);
// Ničle (iskanje sprememb predznaka).
function zeros(f, a, b, n = 600) {
  const out = [];
  let px = a, py = f(a);
  for (let i = 1; i <= n; i++) {
    const x = a + ((b - a) * i) / n, y = f(x);
    if (Number.isFinite(py) && Number.isFinite(y) && (py === 0 || py * y < 0) && Math.abs(y - py) < 5) {
      let lo = px, hi = x;
      for (let k = 0; k < 40; k++) {
        const m = (lo + hi) / 2;
        if (f(lo) * f(m) <= 0) hi = m;
        else lo = m;
      }
      const z = (lo + hi) / 2;
      if (!out.some((q) => Math.abs(q - z) < 1e-3)) out.push(z);
    }
    px = x;
    py = y;
  }
  return out;
}
const piTicks = (v) => {
  const k = Math.round(v / (PI / 2));
  if (Math.abs(v - (k * PI) / 2) > 1e-6) return "";
  if (k === 0) return "0";
  const n = k / 2;
  return Number.isInteger(n) ? `${n === 1 ? "" : n === -1 ? "−" : fmt(n)}π` : `${k === 1 ? "" : k === -1 ? "−" : fmt(k)}π/2`;
};
// večkratnik π/12 kot besedilo: π/4, −π/2, 3π/4, π, 2π; sicer decimalno
const piTxt = (v) => {
  const k = Math.round((v / PI) * 12);
  if (Math.abs(v - (k * PI) / 12) > 1e-6) return fmt(v, 2);
  if (k === 0) return "0";
  const g = ((a, b) => { while (b) [a, b] = [b, a % b]; return a; })(Math.abs(k), 12);
  const n = Math.abs(k) / g, d = 12 / g;
  return `${k < 0 ? "−" : ""}${n === 1 ? "" : n}π${d === 1 ? "" : "/" + d}`;
};
// osnovna perioda 2π/b kot večkratnik π (b je večkratnik 0,5): 4π, 2π, 4π/3, π …
const periodTex = (b) => {
  const m = Math.round(2 * b);
  if (Math.abs(2 * b - m) > 1e-9 || m <= 0) return `${T(2 / b, 2)}\\pi`;
  const g = ((a, c) => { while (c) [a, c] = [c, a % c]; return a; })(4, m);
  const n = 4 / g, d = m / g;
  return d === 1 ? `${n === 1 ? "" : n}\\pi` : `\\frac{${n === 1 ? "" : n}\\pi}{${d}}`;
};

// ------------------------------------------------------------ prednastavitve za graf
const PRESETS = {
  kvadratna: {
    params: [["a", -3, 3, 0.25, 1], ["p", -4, 4, 0.5, 1], ["q", -5, 5, 0.5, -2]],
    f: (x, P) => P.a * (x - P.p) ** 2 + P.q,
    tex: (P) => (P.a ? `f(x) = ${cf(P.a)}${shift("x", P.p)}^2${term(P.q)}` : `f(x) = ${T(P.q)}`),
    marks: (A, P, svg) => {
      s("line", { x1: A.X(P.p), y1: A.T, x2: A.X(P.p), y2: A.B, class: "guide", "data-name": "Simetrijska os" }, svg);
      dot(svg, A, P.p, P.q, "c", "T", "Teme");
      dot(svg, A, 0, P.a * P.p * P.p + P.q, "b", "", "Presečišče z osjo y");
    },
    info: (P) => {
      const b = -2 * P.a * P.p, c = P.a * P.p * P.p + P.q;
      const D = b * b - 4 * P.a * c;
      return `<p>Teme <b>T(${fmt(P.p)}, ${fmt(P.q)})</b>, simetrijska os x = ${fmt(P.p)}. ${P.a > 0 ? "a > 0: parabola je odprta navzgor, teme je najnižja točka." : P.a < 0 ? "a < 0: parabola je odprta navzdol, teme je najvišja točka." : "a = 0: to ni več kvadratna funkcija."} ${Math.abs(P.a) > 1 ? "|a| > 1: ožja od y = x²." : Math.abs(P.a) < 1 && P.a ? "|a| < 1: širša od y = x²." : ""}</p>
        <p>${P.a ? `Splošna oblika: ${tex(`f(x) = ${term(P.a, "x^2", true)}${term(b, "x")}${term(c)}`)}. ` : ""}Presečišče z osjo y: (0, ${fmt(c)}). ${P.a ? (D > 0 ? `Ničli: ${fmt(P.p - Math.sqrt(-P.q / P.a))} in ${fmt(P.p + Math.sqrt(-P.q / P.a))}.` : D === 0 ? `Ena dvojna ničla: ${fmt(P.p)}.` : "Ničel ni (D < 0).") : ""}</p>
        <p class="muted">Zaloga vrednosti: ${P.a > 0 ? `[${fmt(P.q)}, ∞)` : P.a < 0 ? `(−∞, ${fmt(P.q)}]` : "{" + fmt(P.q) + "}"}. Parameter p premakne graf vodoravno, q navpično.</p>`;
    },
    tryText: "Kaj naredi parameter p? Zakaj se pri p = 2 graf premakne v desno, čeprav v oklepaju piše x − 2?",
  },
  "kvadratna-enacba": {
    params: [["a", -3, 3, 0.25, 1], ["b", -6, 6, 0.5, -1], ["c", -6, 6, 0.5, -2]],
    f: (x, P) => P.a * x * x + P.b * x + P.c,
    tex: (P) => `${term(P.a || 0.0001, "x^2", true)}${term(P.b, "x")}${term(P.c)} = 0`,
    marks: (A, P, svg) => {
      if (!P.a) return;
      const D = P.b * P.b - 4 * P.a * P.c;
      if (D >= 0) [(-P.b - Math.sqrt(D)) / (2 * P.a), (-P.b + Math.sqrt(D)) / (2 * P.a)].forEach((x) => dot(svg, A, x, 0, "a", "", "Ničli"));
      dot(svg, A, -P.b / (2 * P.a), P.c - (P.b * P.b) / (4 * P.a), "c", "T", "Teme");
    },
    info: (P) => {
      if (!P.a) return "<p>Pri a = 0 enačba ni kvadratna, ampak linearna.</p>";
      const D = P.b * P.b - 4 * P.a * P.c;
      const x1 = (-P.b - Math.sqrt(D)) / (2 * P.a), x2 = (-P.b + Math.sqrt(D)) / (2 * P.a);
      return texBlock(`D = b^2 - 4ac = ${par(P.b)}^2 - 4\\cdot ${par(P.a)}\\cdot ${par(P.c)} = ${T(D)}`) +
        (D > 0 ? texBlock(`x_{1,2} = \\frac{-b \\pm \\sqrt{D}}{2a}:\\quad x_1 = ${T(Math.min(x1, x2))},\\ x_2 = ${T(Math.max(x1, x2))}`) + `<p><b>D > 0</b>: dve realni rešitvi, parabola seka os x v dveh točkah.</p>`
          : D === 0 ? texBlock(`x = -\\frac{b}{2a} = ${T(-P.b / (2 * P.a))}`) + `<p><b>D = 0</b>: ena (dvojna) rešitev, teme leži na osi x.</p>`
          : `<p><b>D < 0</b>: realnih rešitev ni, parabola ne seka osi x. (Rešitvi sta kompleksni.)</p>`) +
        `<p class="muted">Vietovi formuli: x₁ + x₂ = −b/a = ${fmt(-P.b / P.a)}, x₁ · x₂ = c/a = ${fmt(P.c / P.a)}.</p>`;
    },
    tryText: "Spreminjaj samo c. Pri kateri vrednosti c je D = 0? Kaj se takrat zgodi z grafom?",
  },
  "kvadratna-neenacba": {
    params: [["a", -3, 3, 0.5, 1], ["b", -6, 6, 0.5, -1], ["c", -6, 6, 0.5, -2]],
    choice: ["znak", [[">", "> 0"], ["≥", "≥ 0"], ["<", "< 0"], ["≤", "≤ 0"]]],
    f: (x, P) => P.a * x * x + P.b * x + P.c,
    tex: (P) => `${term(P.a || 0.0001, "x^2", true)}${term(P.b, "x")}${term(P.c)} ${{ ">": ">", "≥": "\\ge", "<": "<", "≤": "\\le" }[P.choice]} 0`,
    marks: (A, P, svg, f) => {
      const ok = (y) => ({ ">": y > 0, "≥": y >= -1e-9, "<": y < 0, "≤": y <= 1e-9 })[P.choice];
      let start = null;
      const n = 400;
      for (let i = 0; i <= n; i++) {
        const x = A.x0 + ((A.x1 - A.x0) * i) / n, good = ok(f(x));
        if (good && start === null) start = x;
        if ((!good || i === n) && start !== null) {
          s("line", { x1: A.X(start), y1: A.Y(0), x2: A.X(good ? x : x - (A.x1 - A.x0) / n), y2: A.Y(0), class: "ray a", "data-name": "Rešitev" }, svg);
          start = null;
        }
      }
      zeros(f, A.x0, A.x1).forEach((z) => s("circle", { cx: A.X(z), cy: A.Y(0), r: 6, class: P.choice === ">" || P.choice === "<" ? "pt open stroke-a" : "pt fill-a" }, svg));
    },
    info: (P, f) => {
      const z = zeros(f, -50, 50).sort((u, v) => u - v);
      const rel = P.choice;
      const above = rel === ">" || rel === "≥";
      const br = (closed) => (closed ? ["[", "]"] : ["(", ")"]);
      const [lb, rb] = br(rel === "≥" || rel === "≤");
      let sol;
      if (!P.a) sol = "a = 0: neenačba ni kvadratna.";
      else if (z.length === 2) {
        const [x1, x2] = z.map((v) => fmt(v));
        sol = (P.a > 0) === above ? `x ∈ (−∞, ${x1}${rb} ∪ ${lb}${x2}, ∞)` : `x ∈ ${lb}${x1}, ${x2}${rb}`;
      } else {
        const pos = P.a > 0;
        sol = pos === above ? (z.length && (rel === ">" || rel === "<") ? `x ∈ ℝ, x ≠ ${fmt(z[0])}` : "vsa realna števila") : z.length && (rel === "≥" || rel === "≤") ? `samo x = ${fmt(z[0])}` : "ni rešitev";
      }
      return `<p>Rešitev: <b>${sol}</b>.</p><p>Odebeljeni del osi x so tisti x, kjer je graf ${above ? "nad" : "pod"} osjo x${rel === "≥" || rel === "≤" ? " ali na njej" : ""}. Najprej poiščemo ničle, nato pogledamo, kako je parabola odprta.</p>`;
    },
    tryText: "Obrni predznak a. Kako se spremeni rešitev neenačbe, če ostanejo ničle enake?",
  },
  potencna: {
    params: [["m (števec)", -3, 4, 1, 1], ["n (imenovalec)", 1, 4, 1, 2]],
    f: (x, P) => {
      const m = P["m (števec)"], n = P["n (imenovalec)"];
      if (m === 0) return 1;
      if (x < 0 && n % 2 === 0) return NaN;
      if (x === 0 && m < 0) return NaN;
      const v = Math.abs(x) ** (m / n);
      return x < 0 && m % 2 ? -v : v;
    },
    win: [-4, 4, -4, 4],
    tex: (P) => {
      const m = P["m (števec)"], n = P["n (imenovalec)"];
      if (n === 1) return `f(x) = x^{${m}}`;
      return `f(x) = x^{${m}/${n}} = ${n === 2 ? "\\sqrt" : `\\sqrt[${n}]`}{${m === 1 ? "x" : `x^{${m}}`}}`;
    },
    marks: (A, P, svg) => dot(svg, A, 1, 1, "c", "(1, 1)"),
    info: (P) => {
      const m = P["m (števec)"], n = P["n (imenovalec)"];
      return `<p>${tex(`x^{m/n} = \\sqrt[n]{x^m}`)}: imenovalec je stopnja korena, števec je eksponent. ${n % 2 === 0 ? "Sod koren obstaja le za x ≥ 0, zato je definicijsko območje [0, ∞)" : "Lih koren obstaja za vsa realna števila"}${m < 0 ? ", poleg tega x ≠ 0 (negativni eksponent pomeni ulomek 1/x…)" : ""}.</p>
        <p class="muted">Vsi grafi gredo skozi točko (1, 1). ${m / n > 1 ? "Eksponent > 1: graf je nad x = 1 strmejši od premice y = x." : m / n > 0 && m / n < 1 ? "0 < eksponent < 1: graf se počasi dviga (kot koren)." : m < 0 ? "Negativni eksponent: graf pada in se osem le približuje." : ""}</p>`;
    },
    tryText: "Primerjaj x^(1/2) in x^(2/4). Ali sta enaki funkciji? (Namig: definicijsko območje.)",
  },
  koreni: {
    params: [["n", 2, 5, 1, 2]],
    f: (x, P) => (x < 0 && P.n % 2 === 0 ? NaN : Math.sign(x) * Math.abs(x) ** (1 / P.n)),
    gName: "y = xⁿ",
    g: (x, P) => (P.n % 2 === 0 && x < 0 ? NaN : x ** P.n),
    win: [-4, 4, -4, 4],
    tex: (P) => `f(x) = \\sqrt[${P.n}]{x}`,
    marks: (A, P, svg) => s("line", { x1: A.X(-4), y1: A.Y(-4), x2: A.X(4), y2: A.Y(4), class: "guide" }, svg),
    info: (P) => `<p>${tex(`\\sqrt[${P.n}]{x}`)} je obratna funkcija od ${tex(`x^{${P.n}}`)} <span class="dot dot-b"></span>${P.n % 2 === 0 ? " (za x ≥ 0)" : ""}: grafa sta zrcalna čez premico y = x.</p>
      <p>${P.n % 2 === 0 ? `Sod koren: definiran le za x ≥ 0, ker nobeno realno število na ${P.n}. potenco ni negativno.` : `Lih koren: definiran za vsa realna števila, npr. ${tex(`\\sqrt[${P.n}]{-8} = ${fmt(-(8 ** (1 / P.n)), 3)}`)}.`}</p>`,
    tryText: "Kje se graf korena in graf potence sekata? Zakaj vedno v (1, 1)?",
  },
  eksponentna: {
    params: [["a", 0.2, 4, 0.1, 2], ["p", -3, 3, 0.5, 0], ["q", -3, 3, 0.5, 0]],
    f: (x, P) => (Math.abs(P.a - 1) < 1e-9 ? 1 + P.q : P.a ** (x - P.p) + P.q),
    tex: (P) => `f(x) = ${T(P.a, 1)}^{${shift("x", P.p).replace(/[()]/g, "")}}${term(P.q)}`,
    marks: (A, P, svg) => {
      s("line", { x1: A.L, y1: A.Y(P.q), x2: A.R, y2: A.Y(P.q), class: "guide stroke-danger", "data-name": "Asimptota" }, svg);
      dot(svg, A, P.p, 1 + P.q, "c", "", "Točka (p, 1 + q)");
    },
    info: (P) => `<p>${P.a > 1 ? "a > 1: funkcija <b>narašča</b> (eksponentna rast)." : P.a < 1 ? "0 < a < 1: funkcija <b>pada</b> (eksponentno upadanje)." : "a = 1: konstantna funkcija, ni eksponentna."} Vodoravna asimptota je y = ${fmt(P.q)} (rdeča črta): graf se ji približuje, a je ne doseže.</p>
      <p>Graf gre skozi (${fmt(P.p)}, ${fmt(1 + P.q)}), ker je a⁰ = 1. Zaloga vrednosti: (${fmt(P.q)}, ∞).</p>
      <p class="muted">Pri a = 2 se vrednost ob vsakem koraku x za 1 podvoji: ${[0, 1, 2, 3].map((k) => fmt(2 ** k)).join(", ")}, …</p>`,
    tryText: "Primerjaj a = 2 in a = 0,5. Kako sta grafa povezana? (Namig: zrcaljenje.)",
  },
  "eksponentna-enacba": {
    params: [["a", 0.5, 4, 0.1, 2], ["b", 0.2, 10, 0.1, 5]],
    f: (x, P) => P.a ** x,
    gName: "y = b",
    g: (x, P) => P.b,
    tex: (P) => `${T(P.a, 1)}^x = ${T(P.b, 1)}`,
    win: [-4, 4, -1, 11],
    marks: (A, P, svg) => {
      if (Math.abs(P.a - 1) < 1e-9) return;
      const x = Math.log(P.b) / Math.log(P.a);
      if (Math.abs(x) < 4) {
        s("line", { x1: A.X(x), y1: A.Y(P.b), x2: A.X(x), y2: A.Y(0), class: "guide" }, svg);
        dot(svg, A, x, P.b, "c", "");
      }
    },
    info: (P) => (Math.abs(P.a - 1) < 1e-9 ? "<p>a = 1: 1ˣ = 1 za vsak x.</p>" : texBlock(`x = \\log_{${T(P.a, 1)}} ${T(P.b, 1)} = \\frac{\\ln ${T(P.b, 1)}}{\\ln ${T(P.a, 1)}} \\approx ${T(Math.log(P.b) / Math.log(P.a), 3)}`) +
      `<p>Rešitev je x-koordinata presečišča grafa y = aˣ in premice y = b. ${Number.isInteger(Math.round(Math.log(P.b) / Math.log(P.a) * 1000) / 1000) ? "Rešitev je celo število: b je potenca a." : "Ko b ni potenca a, rešitev zapišemo z logaritmom."}</p>`),
    tryText: "Reši 2ˣ = 8 in 2ˣ = 5. Pri kateri dobiš celo število?",
  },
  logaritem: {
    params: [["a", 0.3, 4, 0.1, 2], ["x (preizkus)", 0.1, 8, 0.1, 4]],
    f: (x, P) => (x > 0 ? Math.log(x) / Math.log(P.a) : NaN),
    gName: "y = aˣ",
    g: (x, P) => P.a ** x,
    win: [-3, 8, -3, 8],
    tex: (P) => `f(x) = \\log_{${T(P.a, 1)}} x`,
    marks: (A, P, svg, f) => {
      s("line", { x1: A.X(-3), y1: A.Y(-3), x2: A.X(8), y2: A.Y(8), class: "guide", "data-name": "y = x" }, svg);
      const x = P["x (preizkus)"], y = f(x);
      dot(svg, A, x, y, "c", "", "Preizkusna točka");
      dot(svg, A, y, x, "b", "");
      dot(svg, A, 1, 0, "a", "", "Točka (1, 0)");
    },
    info: (P, f) => {
      const x = P["x (preizkus)"], y = f(x);
      return texBlock(`\\log_{${T(P.a, 1)}} ${T(x, 1)} = ${T(y, 3)} \\iff ${T(P.a, 1)}^{${T(y, 3)}} = ${T(x, 1)}`) +
        `<p>Logaritem odgovori: na katero potenco moram dvigniti osnovo a, da dobim x? Graf logaritma je zrcalna slika grafa aˣ <span class="dot dot-b"></span> čez premico y = x.</p>
         <p class="muted">Logaritem obstaja le za x > 0. log_a 1 = 0 za vsako osnovo. ${P.a > 1 ? "Pri a > 1 narašča." : P.a < 1 ? "Pri a < 1 pada." : ""}</p>`;
    },
    tryText: "Nastavi a = 2 in poišči x, pri katerem je log₂ x = 3.",
  },
  logaritemska: {
    params: [["a", 0.3, 4, 0.1, 2], ["p", -3, 3, 0.5, 1], ["q", -3, 3, 0.5, 0]],
    f: (x, P) => (x - P.p > 0 ? Math.log(x - P.p) / Math.log(P.a) + P.q : NaN),
    tex: (P) => `f(x) = \\log_{${T(P.a, 1)}}${shift("x", P.p)}${term(P.q)}`,
    marks: (A, P, svg) => {
      s("line", { x1: A.X(P.p), y1: A.T, x2: A.X(P.p), y2: A.B, class: "guide stroke-danger" }, svg);
      const z = P.p + P.a ** -P.q;
      if (Number.isFinite(z) && z < A.x1) dot(svg, A, z, 0, "c", "");
    },
    info: (P) => `<p>Definicijsko območje: x > ${fmt(P.p)}. Navpična asimptota x = ${fmt(P.p)} (rdeča). Ničla: ${tex(`x = ${T(P.p)} + ${T(P.a, 1)}^{${T(-P.q)}} \\approx ${T(P.p + P.a ** -P.q)}`)}.</p>
      <p class="muted">Pri reševanju logaritemskih enačb vedno preveri, ali rešitev leži v definicijskem območju.</p>`,
    tryText: "Kako parameter p vpliva na definicijsko območje? In parameter q?",
  },
  sinus: {
    params: [["A", 0.5, 3, 0.5, 1], ["b", 0.5, 3, 0.5, 1], ["c", -PI, PI, PI / 12, 0], ["d", -2, 2, 0.5, 0]],
    fmtParam: { c: piTxt },
    f: (x, P) => P.A * Math.sin(P.b * (x - P.c)) + P.d,
    gName: "y = sin x",
    g: (x) => Math.sin(x),
    win: [-2 * PI, 2 * PI, -4, 4],
    xStep: PI / 2,
    xFmt: piTicks,
    tex: (P) => {
      const c = Math.abs(P.c) < 1e-9 ? "" : ` ${P.c > 0 ? "-" : "+"} ${piTex(Math.abs(P.c))}`;
      const inner = !c ? `${cf(P.b)}x` : Math.abs(P.b - 1) < 1e-12 ? `x${c}` : `${cf(P.b)}\\left(x${c}\\right)`;
      return `f(x) = ${cf(P.A)}\\sin\\left(${inner}\\right)${term(P.d)}`;
    },
    marks: (A, P, svg) => {
      s("line", { x1: A.L, y1: A.Y(P.d + P.A), x2: A.R, y2: A.Y(P.d + P.A), class: "guide" }, svg);
      s("line", { x1: A.L, y1: A.Y(P.d - P.A), x2: A.R, y2: A.Y(P.d - P.A), class: "guide" }, svg);
    },
    info: (P) => `<p>Amplituda |A| = ${fmt(P.A)}, osnovna perioda ${tex(`\\frac{2\\pi}{b} = ${periodTex(P.b)}`)}, premik ${P.c < -1e-9 ? "v levo" : "v desno"} za ${piTxt(Math.abs(P.c))}, premik navzgor za ${fmt(P.d)}. Zaloga vrednosti [${fmt(P.d - P.A)}, ${fmt(P.d + P.A)}].</p>
      <p class="muted"><span class="dot dot-b"></span> je osnovni graf y = sin x. Kosinus je sinus, premaknjen za π/2 v levo: cos x = sin(x + π/2).</p>`,
    tryText: "Nastavi c = −π/2. Kateri znan graf dobiš?",
  },
  polinom: {
    params: [["a", -2, 2, 0.25, 0.5], ["x₁", -4, 4, 0.5, -3], ["x₂", -4, 4, 0.5, 0], ["x₃", -4, 4, 0.5, 2.5], ["stopnja x₁", 0, 3, 1, 1], ["stopnja x₂", 0, 3, 1, 2], ["stopnja x₃", 0, 3, 1, 1]],
    f: (x, P) => P.a * (x - P["x₁"]) ** P["stopnja x₁"] * (x - P["x₂"]) ** P["stopnja x₂"] * (x - P["x₃"]) ** P["stopnja x₃"],
    win: [-5, 5, -8, 8],
    tex: (P) => !P.a ? "p(x) = 0" : `p(x) = ${["x₁", "x₂", "x₃"].some((k) => P[`stopnja ${k}`]) ? cf(P.a) : T(P.a)}${["x₁", "x₂", "x₃"].map((k, i) => (P[`stopnja ${k}`] ? `${shift("x", P[k])}${P[`stopnja ${k}`] > 1 ? `^${P[`stopnja ${k}`]}` : ""}` : "")).join("")}`,
    marks: (A, P, svg) => P.a && ["x₁", "x₂", "x₃"].forEach((k) => P[`stopnja ${k}`] && dot(svg, A, P[k], 0, P[`stopnja ${k}`] % 2 ? "a" : "c", "")),
    info: (P) => {
      if (!P.a) return `<p>Pri a = 0 je p(x) = 0 (ničelni polinom): graf je os x, vsak x je ničla. Nastavi a ≠ 0.</p>`;
      const deg = P["stopnja x₁"] + P["stopnja x₂"] + P["stopnja x₃"];
      const lim = (side) => (deg === 0 ? "konstanta" : (P.a > 0) === (side > 0 || deg % 2 === 0) ? "+∞" : "−∞");
      return `<p>Stopnja polinoma: <b>${deg}</b>. Vodilni koeficient a = ${fmt(P.a)}. Ko gre x → +∞, gre p(x) → ${lim(1)}; ko gre x → −∞, gre p(x) → ${lim(-1)}.</p>
        <p><span class="dot dot-a"></span> Pri ničli lihe stopnje graf <b>preseka</b> os x (predznak se spremeni). <span class="dot dot-c"></span> Pri ničli sode stopnje se osi x le <b>dotakne</b>.</p>
        <p class="muted">Ničla stopnje 3 je prevoj na osi x: graf se ob njej »splošči«.</p>`;
    },
    tryText: "Nastavi vse tri ničle s stopnjo 1. Koliko največ ekstremov ima polinom 3. stopnje?",
  },
  racionalna: {
    params: [["a", -3, 3, 0.5, 1], ["ničla", -4, 4, 0.5, -2], ["pol", -4, 4, 0.5, 1], ["stopnja pola", 1, 2, 1, 1]],
    f: (x, P) => (P.a * (x - P["ničla"])) / (x - P.pol) ** P["stopnja pola"],
    tex: (P) => (P.a ? `f(x) = \\frac{${cf(P.a)}${shift("x", P["ničla"])}}{${shift("x", P.pol)}${P["stopnja pola"] > 1 ? "^2" : ""}}` : "f(x) = 0"),
    marks: (A, P, svg) => {
      // Ista ničla in pol stopnje 1: ostane luknja. Pri polu stopnje 2 se okrajša en faktor, pol ostane.
      // Pri a = 0 je f(x) = 0 za x ≠ pol: premica z luknjo, pola ni.
      const hole = !P.a || (P["ničla"] === P.pol && P["stopnja pola"] === 1);
      if (!hole) s("line", { x1: A.X(P.pol), y1: A.T, x2: A.X(P.pol), y2: A.B, class: "guide stroke-danger" }, svg);
      const hy = P["stopnja pola"] === 1 ? P.a : 0;
      s("line", { x1: A.L, y1: A.Y(hy), x2: A.R, y2: A.Y(hy), class: "guide stroke-danger" }, svg);
      if (P.a && P["ničla"] !== P.pol) dot(svg, A, P["ničla"], 0, "a", "");
      else if (hole) s("circle", { cx: A.X(P.pol), cy: A.Y(P.a), r: 6, class: "pt open stroke-a" }, svg);
    },
    info: (P) => (!P.a
      ? `<p>Pri a = 0 je števec enak 0: f(x) = 0 za vse x ≠ ${fmt(P.pol)}. Graf je os x z <b>luknjo</b> pri x = ${fmt(P.pol)} (tam funkcija ni definirana), pola ni.</p>`
      : P["ničla"] === P.pol && P["stopnja pola"] === 2
      ? `<p>Števec in imenovalec imata skupni faktor ${tex(shift("x", P.pol))}: izraz se okrajša v ${tex(`f(x) = \\frac{${T(P.a)}}{${shift("x", P.pol).replace(/^\((.*)\)$/, "$1")}}`)} (za x ≠ ${fmt(P.pol)}). Pri x = ${fmt(P.pol)} ostane <b>pol</b> lihe stopnje: navpična asimptota. Ničle ni, vodoravna asimptota je y = 0.</p>`
      : P["ničla"] === P.pol
      ? `<p>Števec in imenovalec imata isti faktor: izraz se okrajša. Pri x = ${fmt(P.pol)} je v grafu <b>luknja</b> (funkcija tam ni definirana), pola ni.</p>`
      : `<p><b>Pol</b> pri x = ${fmt(P.pol)} (ničla imenovalca): navpična asimptota. ${P["stopnja pola"] === 2 ? "Pol sode stopnje: na obeh straneh gre graf v isto neskončnost." : "Pol lihe stopnje: graf na eni strani gre v +∞, na drugi v −∞."}</p>
         <p><b>Ničla</b> pri x = ${fmt(P["ničla"])} (ničla števca). Vodoravna asimptota: y = ${fmt(P["stopnja pola"] === 1 ? P.a : 0)} (${P["stopnja pola"] === 1 ? "stopnji števca in imenovalca sta enaki, zato je to razmerje vodilnih koeficientov" : "stopnja imenovalca je večja, zato y = 0"}).</p>`),
    tryText: "Kaj se zgodi, ko ničlo premakneš točno na pol?",
  },
  ulomljeni: {
    params: [["a", -3, 3, 0.5, 2], ["x (preizkus)", -5, 5, 0.25, 1]],
    f: (x, P) => (Math.abs(x - P.a) < 1e-9 ? NaN : (x * x - P.a * P.a) / (x - P.a)),
    tex: (P) => `\\frac{x^2 - ${T(P.a * P.a)}}{${shift("x", P.a).replace(/[()]/g, "")}} = \\frac{(x ${sgn(-P.a)} ${T(Math.abs(P.a))})(x ${sgn(P.a)} ${T(Math.abs(P.a))})}{x ${sgn(-P.a)} ${T(Math.abs(P.a))}} = x ${sgn(P.a)} ${T(Math.abs(P.a))},\\ x \\ne ${T(P.a)}`,
    marks: (A, P, svg, f) => {
      s("circle", { cx: A.X(P.a), cy: A.Y(2 * P.a), r: 6, class: "pt open stroke-a" }, svg);
      const x = P["x (preizkus)"];
      if (Number.isFinite(f(x))) dot(svg, A, x, f(x), "c", "");
    },
    info: (P, f) => {
      const x = P["x (preizkus)"];
      return `<p>Izraz okrajšamo, a <b>le za x ≠ ${fmt(P.a)}</b>: pri x = ${fmt(P.a)} je imenovalec 0 in izraz ni definiran. Na grafu je tam luknja (prazen krožec).</p>
        <p>Preizkus pri x = ${fmt(x)}: ${Math.abs(x - P.a) < 1e-9 ? "<b>ni definirano</b> (deljenje z 0)." : `${fmt(x * x - P.a * P.a)} : ${fmt(x - P.a)} = ${fmt(f(x))}.`}</p>
        <p class="muted">Definicijsko območje ulomljenega izraza: vsa števila, za katera imenovalec ni 0.</p>`;
    },
    tryText: "Postavi preizkusni x točno na a. Kaj izpiše?",
  },
  limita: {
    params: [["razdalja h", 0.001, 1, 0.001, 0.5]],
    choice: ["funkcija", [["luknja", "(x² − 1)/(x − 1)"], ["skok", "skok"], ["pol", "1/(x − 1)²"], ["sinx", "sin x / x"]]],
    f: (x, P) => ({ luknja: Math.abs(x - 1) < 1e-12 ? NaN : (x * x - 1) / (x - 1), skok: x < 1 ? x : x + 1, pol: 1 / (x - 1) ** 2, sinx: x === 0 ? NaN : Math.sin(x) / x })[P.choice],
    win: [-4, 4, -1, 6],
    tex: (P) => ({ luknja: "f(x) = \\frac{x^2 - 1}{x - 1}", skok: "f(x) = \\begin{cases} x, & x < 1\\\\ x + 1, & x \\ge 1 \\end{cases}", pol: "f(x) = \\frac{1}{(x - 1)^2}", sinx: "f(x) = \\frac{\\sin x}{x}" })[P.choice],
    marks: (A, P, svg, f) => {
      const a = P.choice === "sinx" ? 0 : 1, hh = P["razdalja h"];
      s("line", { x1: A.X(a), y1: A.T, x2: A.X(a), y2: A.B, class: "guide" }, svg);
      [a - hh, a + hh].forEach((x, i) => Number.isFinite(f(x)) && f(x) < A.y1 && dot(svg, A, x, f(x), i ? "b" : "a", ""));
      if (P.choice === "luknja") s("circle", { cx: A.X(1), cy: A.Y(2), r: 6, class: "pt open stroke-c" }, svg);
      if (P.choice === "sinx") s("circle", { cx: A.X(0), cy: A.Y(1), r: 6, class: "pt open stroke-c" }, svg);
      if (P.choice === "skok") { s("circle", { cx: A.X(1), cy: A.Y(1), r: 6, class: "pt open stroke-c" }, svg); dot(svg, A, 1, 2, "c", ""); }
    },
    info: (P, f) => {
      const a = P.choice === "sinx" ? 0 : 1, hh = P["razdalja h"];
      const rows = [hh * 100, hh * 10, hh].filter((v) => v <= 1).map((d) => `<tr><td>${fmt(d, 4)}</td><td>${fmt(f(a - d), 4)}</td><td>${fmt(f(a + d), 4)}</td></tr>`).join("");
      const msg = {
        luknja: "Leva in desna limita sta 2, zato je limita 2, čeprav f(1) ne obstaja (luknja). Funkcijo lahko »zakrpamo«: dodamo f(1) = 2.",
        skok: "Leva limita je 1, desna 2: limita pri x = 1 ne obstaja. Funkcija ima skok, zato tam ni zvezna.",
        pol: "Vrednosti rastejo čez vse meje: limita je +∞ (pol). Funkcija pri x = 1 ni definirana.",
        sinx: "Leva in desna limita sta 1: lim sin x / x = 1, čeprav pri x = 0 izraz ni definiran.",
      }[P.choice];
      return `<p>Približujemo se x = ${a} z leve (<span class="dot dot-a"></span>) in z desne (<span class="dot dot-b"></span>). Zmanjšuj h!</p>
        <table class="demo-table"><tr><th>h</th><th>f(${a} − h)</th><th>f(${a} + h)</th></tr>${rows}</table><p>${msg}</p>`;
    },
    tryText: "Pri vsaki funkciji zmanjšaj h na 0,001. Ali se leva in desna vrednost ujemata?",
  },
  // Lastnosti funkcij: definicijsko območje, zaloga vrednosti, ničle, monotonost, sodost, injektivnost, inverzna funkcija.
  lastnosti: {
    params: [["a", -3, 3, 0.5, 1]],
    choice: ["funkcija", [["kv", "a(x² − 4)"], ["kub", "a·x³"], ["abs", "a(|x| − 2)"], ["rec", "a/x"], ["kor", "a·√(x + 4)"], ["lin", "a·x + 2"]]],
    f: (x, P) => (P.choice === "lin" ? P.a * x + 2 : P.a * LAST[P.choice].f(x)),
    gName: "Inverzna funkcija",
    g: (x, P) => (P.a ? LAST[P.choice].inv?.(x, P.a) ?? NaN : NaN),
    tex: (P) => `f(x) = ${LAST[P.choice].tex(P.a)}`,
    marks: (A, P, svg) => {
      if (P.a && LAST[P.choice].inv) s("line", { x1: A.X(-6), y1: A.Y(-6), x2: A.X(6), y2: A.Y(6), class: "guide", "data-name": "y = x" }, svg);
      (P.a ? LAST[P.choice].zeros(P.a) : []).forEach((z) => dot(svg, A, z, 0, "a", "", "Ničle"));
    },
    info: (P) => {
      const F = LAST[P.choice], a = P.a;
      if (!a) return "<p>Pri a = 0 je funkcija konstantna: f(x) = 0 za vsak x iz definicijskega območja. Vsako število tega območja je ničla.</p>";
      const z = F.zeros(a);
      return `<p><b>Definicijsko območje:</b> ${F.D}. <b>Zaloga vrednosti:</b> ${F.Z(a)}. <b>Ničle:</b> ${z.length ? z.map((v) => fmt(v)).join(" in ") : "jih ni"}.</p>
        <p><b>Monotonost:</b> ${F.mono(a)}. <b>Sodost:</b> ${F.par}. <b>Injektivnost:</b> ${F.inv ? "injektivna (vsaka vodoravna premica seka graf največ enkrat)" : "ni injektivna (neka vodoravna premica seka graf dvakrat)"}.</p>
        <p class="muted">${F.inv ? `Inverzna funkcija <span class="dot dot-b"></span> ${tex(`f^{-1}(x) = ${F.invTex(a)}`)}: njen graf je zrcalna slika grafa f čez premico y = x.` : "Ker funkcija ni injektivna, na celem definicijskem območju nima inverzne funkcije."}</p>`;
    },
    tryText: "Katere izmed funkcij so sode in katere lihe? Preveri na grafu: soda je simetrična glede na os y, liha glede na izhodišče. Katere imajo inverzno funkcijo?",
  },
  // Transformacije grafa: g(x) = a·f(b(x − p)) + q
  transformacije: {
    params: [["a", -3, 3, 0.5, 1], ["b", -1, 1, 2, 1], ["p", -4, 4, 0.5, 0], ["q", -4, 4, 0.5, 0]],
    fmtParam: { b: (v) => (v < 0 ? "−1 (zrcali čez os y)" : "1") },
    choice: ["osnovna funkcija", [["kv", "f(x) = x²"], ["abs", "f(x) = |x|"], ["kor", "f(x) = √x"], ["kub", "f(x) = x³"], ["rec", "f(x) = 1/x"]]],
    f: (x, P) => P.a * TRANS[P.choice].f(P.b * (x - P.p)) + P.q,
    fName: "g(x)",
    gName: "Osnovna funkcija f",
    g: (x, P) => TRANS[P.choice].f(x),
    tex: (P) => {
      const inner = P.b < 0 ? `-${shift("x", P.p)}` : shift("x", P.p).replace(/^\((.*)\)$/, "$1");
      return P.a ? `g(x) = ${cf(P.a)}${TRANS[P.choice].tex(inner)}${term(P.q)}` : `g(x) = ${T(P.q)}`;
    },
    marks: (A, P, svg) => {
      if (P.choice === "rec") {
        s("line", { x1: A.X(P.p), y1: A.T, x2: A.X(P.p), y2: A.B, class: "guide stroke-danger", "data-name": "Asimptote" }, svg);
        s("line", { x1: A.L, y1: A.Y(P.q), x2: A.R, y2: A.Y(P.q), class: "guide stroke-danger", "data-name": "Asimptote" }, svg);
      } else dot(svg, A, P.p, P.q, "c", "", "Premaknjeno izhodišče");
    },
    info: (P) => {
      const st = [];
      if (P.b < 0) st.push("zrcaljenje čez os y (x zamenjamo z −x)");
      if (P.p) st.push(`vzporedni premik za ${fmt(Math.abs(P.p))} v ${P.p > 0 ? "desno" : "levo"} (x zamenjamo z x ${P.p > 0 ? "−" : "+"} ${fmt(Math.abs(P.p))})`);
      if (Math.abs(P.a) !== 1 && P.a) st.push(`${Math.abs(P.a) > 1 ? "raztezanje" : "skrčitev"} v smeri osi y s faktorjem ${fmt(Math.abs(P.a))}`);
      if (P.a < 0) st.push("zrcaljenje čez os x (vrednosti pomnožimo z −1)");
      if (P.q) st.push(`vzporedni premik za ${fmt(Math.abs(P.q))} ${P.q > 0 ? "navzgor" : "navzdol"}`);
      return `<p>Graf <span class="dot dot-b"></span>osnovne funkcije f preslikamo po vrsti: ${st.length ? st.map((x, i) => `<b>${i + 1}.</b> ${x}`).join("; ") : "nič se ne spremeni"}.</p>
        <p class="muted">${P.choice === "kv" || P.choice === "abs" ? "f je soda, zato zrcaljenje čez os y grafa ne spremeni. " : ""}Sprememba znotraj oklepaja (pri x) deluje vodoravno in »obratno« od pričakovanja, sprememba zunaj pa navpično.</p>`;
    },
    tryText: "Izberi f(x) = √x. Nastavi p = 2 in q = −1. Kam se premakne začetna točka grafa? Kaj naredi b = −1 pri x² in kaj pri √x?",
  },
  // Potenčne funkcije s celim eksponentom: f(x) = a·xⁿ
  "potencna-cela": {
    params: [["n", -3, 5, 1, 3], ["a", -2, 2, 0.5, 1]],
    win: [-4, 4, -4, 4],
    f: (x, P) => (P.n < 0 && x === 0 ? NaN : P.a * x ** P.n),
    tex: (P) => (P.n === 0 ? `f(x) = ${T(P.a)}` : `f(x) = ${cf(P.a)}x^{${P.n}}${P.n < 0 ? ` = ${P.a < 0 ? "-" : ""}\\frac{${T(Math.abs(P.a))}}{x^{${-P.n}}}` : ""}`),
    marks: (A, P, svg) => {
      dot(svg, A, 1, P.a, "c", "", "Točki pri x = ±1");
      dot(svg, A, -1, P.a * (-1) ** P.n, "c", "", "Točki pri x = ±1");
    },
    info: (P) => {
      const { n, a } = P;
      if (n === 0 || a === 0) return `<p>Pri ${n === 0 ? "n = 0" : "a = 0"} je funkcija konstantna (vodoravna premica).</p>`;
      const even = n % 2 === 0, pos = n > 0;
      const Z = even ? (pos ? (a > 0 ? "[0, ∞)" : "(−∞, 0]") : a > 0 ? "(0, ∞)" : "(−∞, 0)") : pos ? "ℝ" : "ℝ ∖ {0}";
      return `<p><b>${pos ? "Pozitivni" : "Negativni"} ${even ? "sodi" : "lihi"} eksponent.</b> Definicijsko območje ${pos ? "ℝ" : "ℝ ∖ {0}"}, zaloga vrednosti ${Z}. Funkcija je <b>${even ? "soda" : "liha"}</b>: graf je simetričen glede na ${even ? "os y" : "koordinatno izhodišče"}.</p>
        <p>${pos ? `Ničla x = 0 (stopnje ${n}). ${n === 1 ? "To je premica." : n === 2 ? "Graf je parabola." : n === 3 ? "Graf je kubična parabola." : even ? "Graf je podoben paraboli, ob izhodišču je bolj sploščen." : "Graf je podoben kubični paraboli, ob izhodišču je bolj sploščen."}` : "Ničel ni. Os x in os y sta asimptoti (hiperbola)."} Graf gre skozi (1, ${fmt(a)}) in (−1, ${fmt(a * (-1) ** n)}).</p>
        <p class="muted">Večji kot je |n|, bolj se graf na intervalu (−1, 1) približa osi x${pos ? "" : " (pri negativnem n pa se vrednosti na tem intervalu večajo)"}.</p>`;
    },
    tryText: "Primerjaj n = 2 in n = 4 ter n = −1 in n = −2. Kje sta grafa x² in x⁴ enaka? Kateri je bližje osi x med −1 in 1?",
  },
};

// Funkcije za prednastavitev »lastnosti« (pri a ≠ 0). f brez faktorja a (lin: f(x) = x).
const intv = (lo, hi, l = "[", r = "]") => `${l}${lo}, ${hi}${r}`;
const LAST = {
  kv: { f: (x) => x * x - 4, tex: (a) => (a === 1 ? "x^2 - 4" : `${cf(a)}(x^2 - 4)`), D: "ℝ", Z: (a) => (a > 0 ? intv(fmt(-4 * a), "∞", "[", ")") : intv("−∞", fmt(-4 * a), "(", "]")), zeros: () => [-2, 2], mono: (a) => (a > 0 ? "pada na (−∞, 0], narašča na [0, ∞)" : "narašča na (−∞, 0], pada na [0, ∞)"), par: "soda, f(−x) = f(x)" },
  kub: { f: (x) => x ** 3, tex: (a) => `${cf(a)}x^3`, D: "ℝ", Z: () => "ℝ", zeros: () => [0], mono: (a) => (a > 0 ? "narašča na vsem ℝ" : "pada na vsem ℝ"), par: "liha, f(−x) = −f(x)", inv: (x, a) => Math.cbrt(x / a), invTex: (a) => (a === 1 ? "\\sqrt[3]{x}" : `\\sqrt[3]{\\frac{x}{${T(a)}}}`) },
  abs: { f: (x) => Math.abs(x) - 2, tex: (a) => (a === 1 ? "|x| - 2" : `${cf(a)}(|x| - 2)`), D: "ℝ", Z: (a) => (a > 0 ? intv(fmt(-2 * a), "∞", "[", ")") : intv("−∞", fmt(-2 * a), "(", "]")), zeros: () => [-2, 2], mono: (a) => (a > 0 ? "pada na (−∞, 0], narašča na [0, ∞)" : "narašča na (−∞, 0], pada na [0, ∞)"), par: "soda, f(−x) = f(x)" },
  rec: { f: (x) => (x === 0 ? NaN : 1 / x), tex: (a) => (a < 0 ? `-\\frac{${T(-a)}}{x}` : `\\frac{${T(a)}}{x}`), D: "ℝ ∖ {0}", Z: () => "ℝ ∖ {0}", zeros: () => [], mono: (a) => `${a > 0 ? "pada" : "narašča"} na (−∞, 0) in posebej na (0, ∞), ne pa na celem definicijskem območju`, par: "liha, f(−x) = −f(x)", inv: (x, a) => (x === 0 ? NaN : a / x), invTex: (a) => `\\frac{${T(a)}}{x}\\ (\\text{sama sebi inverzna})` },
  kor: { f: (x) => (x < -4 ? NaN : Math.sqrt(x + 4)), tex: (a) => `${cf(a)}\\sqrt{x + 4}`, D: "[−4, ∞)", Z: (a) => (a > 0 ? "[0, ∞)" : "(−∞, 0]"), zeros: () => [-4], mono: (a) => (a > 0 ? "narašča na [−4, ∞)" : "pada na [−4, ∞)"), par: "ni ne soda ne liha (definicijsko območje ni simetrično)", inv: (x, a) => (x / a < 0 ? NaN : (x / a) ** 2 - 4), invTex: (a) => `\\left(\\frac{x}{${T(a)}}\\right)^2 - 4,\\ \\frac{x}{${T(a)}} \\ge 0` },
  lin: { f: (x) => x, tex: (a) => `${cf(a)}x + 2`, D: "ℝ", Z: () => "ℝ", zeros: (a) => [-2 / a], mono: (a) => (a > 0 ? "narašča na vsem ℝ" : "pada na vsem ℝ"), par: "ni ne soda ne liha", inv: (x, a) => (x - 2) / a, invTex: (a) => `\\frac{x - 2}{${T(a)}}` },
};
// Osnovne funkcije za »transformacije«; tex(inner) zapiše f(inner).
const TRANS = {
  kv: { f: (x) => x * x, tex: (u) => (u === "x" ? "x^2" : `\\left(${u}\\right)^2`) },
  abs: { f: (x) => Math.abs(x), tex: (u) => `\\left|${u}\\right|` },
  kor: { f: (x) => (x < 0 ? NaN : Math.sqrt(x)), tex: (u) => `\\sqrt{${u}}` },
  kub: { f: (x) => x ** 3, tex: (u) => (u === "x" ? "x^3" : `\\left(${u}\\right)^3`) },
  rec: { f: (x) => (x === 0 ? NaN : 1 / x), tex: (u) => `\\frac{1}{${u}}` },
};

// title: ime točke na gumbu »Prikaži« (public/sim/prikaz.js), npr. »Teme«.
function dot(svg, A, x, y, cls, name, title) {
  if (!Number.isFinite(y) || y < A.y0 - 1 || y > A.y1 + 1 || x < A.x0 || x > A.x1) return;
  s("circle", { cx: A.X(x), cy: A.Y(y), r: 6, class: `pt fill-${cls}`, "data-name": title || null }, svg);
  if (name) label(svg, A.X(x) + 12, A.Y(y) - 10, name, "pt-lbl");
}

export function graf(el, { preset = "kvadratna" } = {}) {
  const C = PRESETS[preset] || PRESETS.kvadratna;
  const svg = svgBox(340, 340);
  const out = readout();
  const eq = h("div", { class: "demo-eq graf-eq" });
  const P = {};
  C.params.forEach(([k, , , , v]) => (P[k] = v));
  if (C.choice) P.choice = C.choice[1][0][0];
  const draw = () => {
    svg.replaceChildren();
    const [x0, x1, y0, y1] = C.win || [-6, 6, -6, 6];
    const A = axes(svg, { W: 340, H: 340, x: [x0, x1], y: [y0, y1], xStep: C.xStep, xFmt: C.xFmt });
    const f = (x) => C.f(x, P);
    if (C.g) s("path", { d: fnPath((x) => C.g(x, P), A), class: "graph-line stroke-b thin-line", "data-name": C.gName }, svg);
    C.marks?.(A, P, svg, f);
    s("path", { d: fnPath(f, A, { n: 500 }), class: "graph-line", "data-name": C.fName || "f(x)" }, svg);
    C.marks && svg.querySelectorAll(".pt").forEach((p) => svg.append(p));
    eq.innerHTML = tex(C.tex(P));
    out.innerHTML = C.info(P, f);
  };
  const ctl = C.params.map(([k, min, max, step, v]) => slider({ label: k, min, max, step, value: v, format: C.fmtParam?.[k], onInput: (x) => ((P[k] = x), draw()) }));
  if (C.choice) ctl.unshift(select({ label: C.choice[0], options: C.choice[1], value: P.choice, onChange: (v) => ((P.choice = v), draw()) }));
  layout(el, { stage: [eq, svg], controls: ctl, out, tryText: C.tryText });
  draw();
}

// ------------------------------------------------------------ odvod
const DFUN = {
  x2: { name: "x²", f: (x) => x * x, d: (x) => 2 * x, dtex: "f'(x) = 2x", win: [-3, 3, -2, 8] },
  x3: { name: "x³ − 3x", f: (x) => x ** 3 - 3 * x, d: (x) => 3 * x * x - 3, dtex: "f'(x) = 3x^2 - 3", win: [-3, 3, -5, 5] },
  x4: { name: "x⁴ − 4x²", f: (x) => x ** 4 - 4 * x * x, d: (x) => 4 * x ** 3 - 8 * x, dtex: "f'(x) = 4x^3 - 8x", win: [-3, 3, -6, 6] },
  sin: { name: "sin x", f: Math.sin, d: Math.cos, dtex: "f'(x) = \\cos x", win: [-2 * PI, 2 * PI, -2, 2], pi: true },
  exp: { name: "eˣ", f: Math.exp, d: Math.exp, dtex: "f'(x) = e^x", win: [-3, 2.5, -1, 8] },
  ln: { name: "ln x", f: (x) => (x > 0 ? Math.log(x) : NaN), d: (x) => (x > 0 ? 1 / x : NaN), dtex: "f'(x) = \\frac{1}{x}", win: [-0.5, 6, -3, 3] },
};
export function odvod(el, { mode = "tangenta" } = {}) {
  const svg = svgBox(340, 300), svg2 = svgBox(340, 170);
  const out = readout();
  let key = mode === "ekstremi" ? "x3" : "x2", x0 = 1, hh = 1, showD = mode === "ekstremi";
  const draw = () => {
    const F = DFUN[key];
    const [a, b, c, d] = F.win;
    x0 = clamp(x0, a, b);
    svg.replaceChildren();
    const A = axes(svg, { W: 340, H: 300, x: [a, b], y: [c, d], xStep: F.pi ? PI / 2 : undefined, xFmt: F.pi ? piTicks : undefined });
    if (mode === "ekstremi") {
      // obarvaj naraščanje / padanje
      const n = 300;
      let seg = "", up = null;
      const flush = () => seg && s("path", { d: seg, class: `graph-line ${up ? "stroke-ok" : "stroke-danger"}`, "data-name": up ? "f narašča" : "f pada" }, svg);
      for (let i = 0; i <= n; i++) {
        const x = a + ((b - a) * i) / n, y = F.f(x);
        if (!Number.isFinite(y)) continue;
        const u = F.d(x) >= 0;
        if (up !== null && u !== up) { seg += `L${A.X(x)},${A.Y(y)}`; flush(); seg = ""; }
        seg += `${seg ? "L" : "M"}${A.X(x)},${A.Y(y)}`;
        up = u;
      }
      flush();
      zeros(F.d, a, b).forEach((z) => {
        const kind = F.d(z - 0.01) > 0 && F.d(z + 0.01) < 0 ? "max" : F.d(z - 0.01) < 0 && F.d(z + 0.01) > 0 ? "min" : "";
        dot(svg, A, z, F.f(z), "c", kind === "max" ? "maks." : kind === "min" ? "min." : "");
      });
    } else s("path", { d: fnPath(F.f, A), class: "graph-line", "data-name": "f(x)" }, svg);
    const y0v = F.f(x0), k = F.d(x0);
    // drsnika na grafu: x₀ (vijolično) in h (oranžno), vlečeš lahko tudi oznaki
    xs.align(A);
    axisMark(svg, A, x0, `x₀ = ${fmt(x0)}`, "c", { y: y0v, sl: xs, key: "x0" });
    if (mode === "tangenta") spanMark(svg, A, x0, x0 + hh, `h = ${fmt(hh)}`, "a", { sl: hs, key: "h", y2: F.f(x0 + hh) });
    if (Number.isFinite(y0v)) {
      // tangenta
      s("line", { x1: A.X(a), y1: A.Y(y0v + k * (a - x0)), x2: A.X(b), y2: A.Y(y0v + k * (b - x0)), class: "graph-line stroke-c thin-line", "data-name": "Tangenta" }, svg);
      if (mode === "tangenta") {
        const x1 = x0 + hh, y1 = F.f(x1);
        if (Number.isFinite(y1)) {
          const ks = (y1 - y0v) / hh;
          s("line", { x1: A.X(a), y1: A.Y(y0v + ks * (a - x0)), x2: A.X(b), y2: A.Y(y0v + ks * (b - x0)), class: "graph-line stroke-a thin-line", "data-name": "Sekanta" }, svg);
          s("path", { d: `M${A.X(x0)},${A.Y(y0v)} H${A.X(x1)} V${A.Y(y1)}`, class: "slope-tri" }, svg);
          dot(svg, A, x1, y1, "a", "");
        }
      }
      const hnd = handle(svg, "c");
      hnd.move(A.X(x0), A.Y(y0v));
      draggable(svg, hnd, (px) => {
        x0 = snapTo(xs, A.inv(px, 0)[0]);
        xs.set(x0, true);
        draw();
      });
    }
    // graf odvoda
    svg2.replaceChildren();
    if (showD) {
      const ys = [];
      for (let i = 0; i <= 50; i++) ys.push(F.d(a + ((b - a) * i) / 50));
      const fin = ys.filter(Number.isFinite);
      const m = Math.max(1, ...fin.map(Math.abs));
      const A2 = axes(svg2, { W: 340, H: 170, x: [a, b], y: [-Math.min(m, 8), Math.min(m, 8)], yLabel: "f'", xStep: F.pi ? PI / 2 : undefined, xFmt: F.pi ? piTicks : undefined });
      s("path", { d: fnPath(F.d, A2), class: "graph-line stroke-b", "data-name": "f′(x)" }, svg2);
      dot(svg2, A2, x0, k, "c", "");
    }
    svg2.style.display = showD ? "" : "none";
    const x1 = x0 + hh, ks = (F.f(x1) - y0v) / hh;
    out.innerHTML = (mode === "tangenta"
      ? `<p><span class="dot dot-a"></span> Sekanta skozi x₀ = ${fmt(x0)} in x₀ + h = ${fmt(x1)}: naklon ${tex(`\\frac{f(x_0 + h) - f(x_0)}{h} = ${T(ks, 3)}`)}.</p>
         <p><span class="dot dot-c"></span> Tangenta: ko gre h → 0, se sekanta približuje tangenti. Njen naklon je odvod: ${tex(`f'(${T(x0)}) = ${T(k, 3)}`)}.</p>`
      : `<p><span class="dot" style="background:var(--ok)"></span> Kjer je f' > 0, funkcija narašča; <span class="dot" style="background:var(--danger)"></span> kjer je f' < 0, pada. V stacionarnih točkah je f' = 0 in tangenta vodoravna.</p>
         <p>V x₀ = ${fmt(x0)}: ${tex(`f'(x_0) = ${T(k, 3)}`)}, funkcija tam ${Math.abs(k) < 0.05 ? "ima (skoraj) vodoravno tangento" : k > 0 ? "narašča" : "pada"}.</p>`) +
      `<p class="muted">${tex(DFUN[key].dtex)} (spodnji graf). Povleci točko na grafu.</p>`;
  };
  const xs = axisSlider(slider({ label: "x₀", min: -6, max: 6, step: 0.05, value: x0, cls: "c", onInput: (v) => ((x0 = v), draw()) }), svg);
  const hs = slider({ label: "h", min: 0.01, max: 2, step: 0.01, value: hh, cls: "a", onInput: (v) => ((hh = v), draw()) });
  layout(el, {
    stage: [svg, xs, svg2],
    controls: [
      select({ label: "funkcija", options: Object.entries(DFUN).filter(([k]) => mode === "tangenta" || k !== "ln").map(([k, v]) => [k, v.name]), value: key, onChange: (v) => ((key = v), draw()) }),
      ...(mode === "tangenta" ? [hs, toggle("pokaži graf odvoda", showD, (v) => ((showD = v), draw()))] : []),
    ],
    out,
    tryText: mode === "tangenta" ? "Zmanjšuj h proti 0 in opazuj naklon sekante. Kateri vrednosti se približuje?" : "Poišči točke, kjer je f'(x) = 0. Ali je vsaka taka točka ekstrem? (Namig: x³.)",
  });
  draw();
}

// ------------------------------------------------------------ integral
const IFUN = {
  x2: { name: "x²", tex: "x^2", f: (x) => x * x, F: (x) => x ** 3 / 3, Ftex: "\\frac{x^3}{3}", win: [-1, 3.2, -1, 9] },
  lin: { name: "0,5x + 1", tex: "(0{,}5x + 1)", f: (x) => 0.5 * x + 1, F: (x) => x * x / 4 + x, Ftex: "\\frac{x^2}{4} + x", win: [-1, 4.5, -1, 4] },
  sin: { name: "sin x + 1", tex: "(\\sin x + 1)", f: (x) => Math.sin(x) + 1, F: (x) => -Math.cos(x) + x, Ftex: "x - \\cos x", win: [-0.5, 2 * PI, -0.5, 2.5] },
  sqrt: { name: "√x", tex: "\\sqrt{x}", f: (x) => (x >= 0 ? Math.sqrt(x) : NaN), F: (x) => (2 / 3) * x ** 1.5, Ftex: "\\frac{2}{3}x^{3/2}", win: [-0.5, 5, -0.5, 2.6] },
  x3: { name: "x³ − 2x", tex: "(x^3 - 2x)", f: (x) => x ** 3 - 2 * x, F: (x) => x ** 4 / 4 - x * x, Ftex: "\\frac{x^4}{4} - x^2", win: [-2.2, 2.2, -4, 4] },
};
export function integral(el, { mode = "doloceni" } = {}) {
  const svg = svgBox(340, 300);
  const out = readout();
  let key = "x2", a = 0, b = 2, n = 6, rule = "sredina", C = 0;
  const draw = () => {
    const Fn = IFUN[key];
    svg.replaceChildren();
    const [x0, x1, y0, y1] = Fn.win;
    if (mode === "doloceni") {
      const A = axes(svg, { W: 340, H: 300, x: [x0, x1], y: [y0, y1] });
      // drsnika a in b obsegata okno osi (ob menjavi funkcije ju align omeji): a in b sta potem enaki drsnikoma
      sa.align(A);
      sb.align(A);
      (a = sa.get()), (b = sb.get());
      const lo = clamp(Math.min(a, b), x0, x1), hi = clamp(Math.max(a, b), x0, x1), w = (hi - lo) / n;
      let sum = 0;
      const nm = rule === "trapez" ? "Trapezi" : "Pravokotniki";
      for (let i = 0; i < n; i++) {
        const u = lo + i * w;
        if (rule === "trapez") {
          const fa = Fn.f(u), fb = Fn.f(u + w);
          sum += ((fa + fb) / 2) * w;
          s("polygon", { points: `${A.X(u)},${A.Y(0)} ${A.X(u)},${A.Y(fa)} ${A.X(u + w)},${A.Y(fb)} ${A.X(u + w)},${A.Y(0)}`, class: `rect-sum ${fa + fb < 0 ? "neg" : ""}`, "data-name": fa + fb < 0 ? `${nm} pod osjo` : nm }, svg);
        } else {
          const xm = rule === "levo" ? u : rule === "desno" ? u + w : u + w / 2, fm = Fn.f(xm);
          sum += fm * w;
          s("rect", { x: A.X(u), y: A.Y(Math.max(0, fm)), width: A.X(u + w) - A.X(u), height: Math.abs(A.Y(fm) - A.Y(0)), class: `rect-sum ${fm < 0 ? "neg" : ""}`, "data-name": fm < 0 ? `${nm} pod osjo` : nm }, svg);
        }
      }
      s("path", { d: fnPath(Fn.f, A), class: "graph-line", "data-name": "f(x)" }, svg);
      // meji a in b sta na osi označeni v barvi svojih drsnikov; oznaki se da vleči
      axisMark(svg, A, clamp(a, x0, x1), `a = ${fmt(a, 1)}`, "a", { y: Fn.f(clamp(a, x0, x1)), sl: sa, key: "a" });
      axisMark(svg, A, clamp(b, x0, x1), `b = ${fmt(b, 1)}`, "c", { y: Fn.f(clamp(b, x0, x1)), sl: sb, key: "b", lblDy: Math.abs(A.X(a) - A.X(b)) < 56 ? 14 : 0 });
      const exact = Fn.F(hi) - Fn.F(lo);
      out.innerHTML = texBlock(`\\int_{${T(lo)}}^{${T(hi)}} ${Fn.tex}\\,dx = \\Big[${Fn.Ftex}\\Big]_{${T(lo)}}^{${T(hi)}} = ${T(exact, 4)}`) +
        `<p>Vsota ${n} ${rule === "trapez" ? "trapezov" : "pravokotnikov"}: <b>${fmt(sum, 4)}</b>, napaka ${fmt(Math.abs(sum - exact), 4)}. Več ko je delov, manjša je napaka: določeni integral je limita teh vsot.</p>
         <p class="muted">Ploščine pod osjo x štejejo negativno (rdeče). Newton–Leibniz: integral izračunamo z nedoločenim integralom F, ker je F' = f.</p>`;
    } else {
      // družina primitivnih funkcij in polje smeri
      const A = axes(svg, { W: 340, H: 300, x: [x0, x1], y: [-4, 6] });
      for (let i = 0; i < 13; i++) for (let j = 0; j < 10; j++) {
        const x = x0 + ((x1 - x0) * (i + 0.5)) / 13, y = -4 + (10 * (j + 0.5)) / 10, k = Fn.f(x);
        if (!Number.isFinite(k)) continue;
        const L = 5 / Math.hypot(1, k * ((A.Y(0) - A.Y(1)) / (A.X(1) - A.X(0))));
        const dx = L, dy = -k * L * ((A.Y(0) - A.Y(1)) / (A.X(1) - A.X(0)));
        s("line", { x1: A.X(x) - dx, y1: A.Y(y) - dy, x2: A.X(x) + dx, y2: A.Y(y) + dy, class: "field" }, svg);
      }
      for (let c2 = -3; c2 <= 3; c2++) if (c2 !== C) s("path", { d: fnPath((x) => Fn.F(x) + c2, A), class: "graph-line stroke-muted thin-line", opacity: 0.35, "data-name": "Druge primitivne" }, svg);
      s("path", { d: fnPath((x) => Fn.F(x) + C, A), class: "graph-line stroke-c", "data-name": "F(x) + C" }, svg);
      s("path", { d: fnPath(Fn.f, A), class: "graph-line stroke-b thin-line", "data-name": "f(x)" }, svg);
      out.innerHTML = texBlock(`\\int ${Fn.tex}\\,dx = ${Fn.Ftex} + C,\\quad C = ${C}`) +
        `<p><span class="dot dot-c"></span> Primitivna funkcija F ima v vsaki točki naklon enak vrednosti <span class="dot dot-b"></span> f(x). Kratke črtice kažejo ta naklon (polje smeri).</p>
         <p class="muted">Konstanta C premakne graf F navzgor ali navzdol: vse te funkcije imajo isti odvod, zato je nedoločeni integral cela družina funkcij.</p>`;
    }
  };
  const ctl = [select({ label: "funkcija", options: Object.entries(IFUN).map(([k, v]) => [k, v.name]), value: key, onChange: (v) => ((key = v), draw()) })];
  const sa = axisSlider(slider({ label: "a", min: -2, max: 6, step: 0.1, value: a, cls: "a", onInput: (v) => ((a = v), draw()) }), svg);
  const sb = axisSlider(slider({ label: "b", min: -2, max: 6, step: 0.1, value: b, cls: "c", onInput: (v) => ((b = v), draw()) }), svg);
  if (mode === "doloceni")
    ctl.push(
      slider({ label: "število delov", min: 1, max: 60, value: n, onInput: (v) => ((n = v), draw()) }),
      segmented({ options: [["levo", "levo"], ["desno", "desno"], ["sredina", "sredina"], ["trapez", "trapezi"]], value: rule, onChange: (v) => ((rule = v), draw()) }),
    );
  else ctl.push(slider({ label: "C", min: -3, max: 3, value: C, onInput: (v) => ((C = v), draw()) }));
  layout(el, { stage: mode === "doloceni" ? [svg, sa, sb] : [svg], controls: ctl, out, tryText: mode === "doloceni" ? "Pri katerem pravilu je napaka najmanjša pri istem številu delov?" : "Zakaj ima vsaka funkcija neskončno primitivnih funkcij?" });
  draw();
}

// ------------------------------------------------------------ zaporedja
const SEQS = {
  inv: ["1/n", (n) => 1 / n, 0],
  alt: ["(−1)ⁿ/n", (n) => (-1) ** n / n, 0],
  frac: ["(n + 1)/n", (n) => (n + 1) / n, 1],
  sq: ["n²/10", (n) => (n * n) / 10, null],
  osc: ["(−1)ⁿ", (n) => (-1) ** n, null],
  e: ["(1 + 1/n)ⁿ", (n) => (1 + 1 / n) ** n, Math.E],
};
export function zaporedje(el, { mode = "ag" } = {}) {
  const svg = svgBox(340, 280);
  const out = readout();
  let kind = "a", a1 = 2, d = 1.5, q = 1.5, key = "inv", eps = 0.2, N = 15;
  const ctl = h("div", { class: "demo-controls" });
  const build = () => {
    ctl.replaceChildren(
      ...(mode === "ag"
        ? [segmented({ options: [["a", "aritmetično"], ["g", "geometrijsko"]], value: kind, onChange: (v) => ((kind = v), build()) }), slider({ label: "a₁", min: -5, max: 5, step: 0.5, value: a1, onInput: (v) => ((a1 = v), draw()) }), kind === "a" ? slider({ label: "d (razlika)", min: -3, max: 3, step: 0.25, value: d, onInput: (v) => ((d = v), draw()) }) : slider({ label: "q (količnik)", min: -2, max: 2, step: 0.1, value: q, onInput: (v) => ((q = v), draw()) }), slider({ label: "n (členov)", min: 3, max: 20, value: N, onInput: (v) => ((N = v), draw()) })]
        : [select({ label: "zaporedje", options: Object.entries(SEQS).map(([k, v]) => [k, `aₙ = ${v[0]}`]), value: key, onChange: (v) => ((key = v), draw()) }), slider({ label: "ε (pas)", min: 0.01, max: 0.5, step: 0.01, value: eps, onInput: (v) => ((eps = v), draw()) })]),
    );
    draw();
  };
  const draw = () => {
    svg.replaceChildren();
    const terms = [];
    const n = mode === "ag" ? N : 30;
    for (let i = 1; i <= n; i++) terms.push(mode === "ag" ? (kind === "a" ? a1 + (i - 1) * d : a1 * q ** (i - 1)) : SEQS[key][1](i));
    let lo = Math.min(0, ...terms), hi = Math.max(0, ...terms);
    if (hi - lo < 1) hi = lo + 1;
    const pad = (hi - lo) * 0.1;
    const A = axes(svg, { W: 340, H: 280, x: [0, n + 1], y: [Math.max(lo - pad, -60), Math.min(hi + pad, 60)], xLabel: "n", yLabel: "aₙ", xStep: n > 20 ? 5 : n > 10 ? 2 : 1 });
    const L = mode === "ag" ? null : SEQS[key][2];
    if (L != null) {
      s("rect", { x: A.L, y: A.Y(L + eps), width: A.R - A.L, height: A.Y(L - eps) - A.Y(L + eps), class: "band" }, svg);
      s("line", { x1: A.L, y1: A.Y(L), x2: A.R, y2: A.Y(L), class: "guide stroke-c" }, svg);
    }
    let Ne = 0;
    // zunaj pasu: |aₙ − L| ≥ ε (toleranca za zaokrožitev, npr. 6/5 − 1 = 0,19999…)
    const zunaj = (t) => Math.abs(t - L) >= eps - 1e-9;
    terms.forEach((t, i) => {
      if (L != null && zunaj(t)) Ne = i + 1;
      if (t >= A.y0 && t <= A.y1) s("circle", { cx: A.X(i + 1), cy: A.Y(t), r: 4.5, class: `pt ${L != null && !zunaj(t) ? "fill-c" : "fill-a"}` }, svg);
    });
    // Narisanih je le 30 členov; pri majhnem ε je zadnji člen zunaj pasu lahko dlje.
    if (L != null) for (let i = n + 1; i <= 5000; i++) if (zunaj(SEQS[key][1](i))) Ne = i;
    if (mode === "ag") {
      const S = terms.reduce((x, y) => x + y, 0);
      out.innerHTML = (kind === "a"
        ? texBlock(`a_n = a_1 + (n - 1)d = ${T(a1)} + (n - 1)\\cdot ${d < 0 ? `(${T(d)})` : T(d)},\\quad a_{${N}} = ${T(terms[N - 1])}`) + texBlock(`s_{${N}} = \\frac{n(a_1 + a_n)}{2} = ${T(S)}`) + `<p>Vsak člen dobimo tako, da prejšnjemu <b>prištejemo</b> d. Točke ležijo na premici. ${d > 0 ? "d > 0: zaporedje narašča." : d < 0 ? "d < 0: zaporedje pada." : "d = 0: konstantno."}</p>`
        : texBlock(`a_n = a_1 q^{n-1} = ${T(a1)}\\cdot ${q < 0 ? `(${T(q, 1)})` : T(q, 1)}^{n-1},\\quad a_{${N}} = ${T(terms[N - 1])}`) + texBlock(`s_{${N}} = a_1\\frac{q^n - 1}{q - 1} = ${T(S)}`) + `<p>Vsak člen dobimo tako, da prejšnjega <b>pomnožimo</b> s q. ${Math.abs(q) > 1 ? "|q| > 1: členi po absolutni vrednosti hitro rastejo." : Math.abs(q) < 1 ? "|q| < 1: členi se bližajo 0." : ""}${q < 0 ? " q < 0: predznaki se izmenjujejo." : ""}</p>`);
    } else {
      const inc = terms.every((t, i) => !i || t >= terms[i - 1] - 1e-12), dec = terms.every((t, i) => !i || t <= terms[i - 1] + 1e-12);
      out.innerHTML = `<p>${inc ? "Zaporedje <b>narašča</b>." : dec ? "Zaporedje <b>pada</b>." : "Zaporedje ni monotono."} ${L != null || key === "osc" ? "Je <b>omejeno</b>." : "Ni navzgor omejeno."}</p>
        <p>${L != null ? `Limita je ${fmt(L, 4)}. Za ε = ${fmt(eps, 2)} so vsi členi od n = ${Ne + 1} naprej ${Ne < n ? "(vijolične pike) " : `(na sliki jih ni: narisanih je le prvih ${n} členov) `}v senčenem pasu: to pomeni, da je ${fmt(L, 4)} limita. Manjši ε zahteva večji n.` : key === "osc" ? "Členi skačejo med −1 in 1: limite ni (zaporedje ima dve stekališči)." : "Členi rastejo čez vse meje: zaporedje je divergentno."}</p>`;
    }
  };
  layout(el, { stage: [svg], controls: ctl, out, tryText: mode === "ag" ? "Kateri pogoj mora veljati za q, da gredo členi geometrijskega zaporedja proti 0?" : "Zmanjšaj ε na 0,01 pri 1/n. Od katerega člena naprej so vsi v pasu?" });
  build();
}

// najmanjše število oblike 1, 2, 5 · 10ⁿ, ki je ≥ v
const niceCeil = (v) => {
  const e = 10 ** Math.floor(Math.log10(v));
  return [1, 2, 5, 10].map((k) => k * e).find((x) => x >= v - 1e-9);
};

// ------------------------------------------------------------ geometrijska vrsta
export function vrsta(el) {
  const svg = svgBox(340, 240);
  const out = readout();
  let a1 = 1, q = 0.5, n = 6;
  const draw = () => {
    svg.replaceChildren();
    const lim = Math.abs(q) < 1 ? a1 / (1 - q) : null;
    // trak: delni vsoti kot zaporedni kosi
    const sums = [];
    let s0 = 0;
    for (let i = 0; i < n; i++) (s0 += a1 * q ** i), sums.push(s0);
    // merilo na okroglih korakih (1, 2, 5 · 10ⁿ): večji a₁ da res daljši trak
    const maxV = niceCeil(Math.max(Math.abs(lim ?? 0), ...sums.map(Math.abs), 1));
    const X = (v) => 20 + (v / maxV) * 290;
    for (let i = 0; i <= 5; i++) {
      const v = (maxV * i) / 5;
      s("line", { x1: X(v), y1: 66, x2: X(v), y2: 72, class: "axis" }, svg);
      label(svg, X(v), 82, fmt(v, 2), "tick small");
    }
    let x = 0;
    for (let i = 0; i < n; i++) {
      const t = a1 * q ** i;
      s("rect", { x: Math.min(X(x), X(x + t)), y: 30, width: Math.abs(X(x + t) - X(x)), height: 34, class: `bar fill-${"abc"[i % 3]}` }, svg);
      x += t;
    }
    if (lim != null) {
      s("line", { x1: X(lim), y1: 20, x2: X(lim), y2: 74, class: "guide stroke-danger" }, svg);
      label(svg, X(lim), 12, `S = ${fmt(lim, 3)}`, "tick b");
    }
    // delne vsote
    const B = 220, H = 120;
    sums.forEach((v, i) => {
      const bw = 290 / n;
      s("rect", { x: 20 + i * bw + 2, y: B - (Math.max(v, 0) / maxV) * H, width: bw - 4, height: (Math.abs(v) / maxV) * H, class: "bar fill-b" }, svg);
      label(svg, 20 + i * bw + bw / 2, B + 12, `s${i + 1}`.replace(/\d+/, (m) => [...m].map((c) => "₀₁₂₃₄₅₆₇₈₉"[c]).join("")), "tick small");
    });
    if (lim != null) s("line", { x1: 20, y1: B - (lim / maxV) * H, x2: 310, y2: B - (lim / maxV) * H, class: "guide stroke-danger" }, svg);
    s("line", { x1: 18, y1: B, x2: 312, y2: B, class: "axis" }, svg);
    out.innerHTML = texBlock(`s_n = a_1\\frac{1 - q^n}{1 - q}:\\quad s_{${n}} = ${T(sums[n - 1], 4)}`) +
      (lim != null
        ? `<p>Ker je |q| < 1, delne vsote konvergirajo: ${tex(`S = \\frac{a_1}{1 - q} = \\frac{${T(a1)}}{1 - ${T(q)}} = ${T(lim, 4)}`)}. Neskončno mnogo kosov ima končno skupno dolžino.</p>`
        : `<p>Ker je |q| ≥ 1, vrsta <b>divergira</b>: delne vsote ne gredo proti nobenemu številu.</p>`);
  };
  layout(el, {
    stage: [svg],
    controls: [slider({ label: "a₁", min: 0.5, max: 3, step: 0.5, value: a1, onInput: (v) => ((a1 = v), draw()) }), slider({ label: "q", min: -1.2, max: 1.2, step: 0.05, value: q, onInput: (v) => ((q = v), draw()) }), slider({ label: "n (členov)", min: 1, max: 30, value: n, onInput: (v) => ((n = v), draw()) })],
    out,
    tryText: "Pri q = 0,5 in a₁ = 1 se trak bliža 2: vsak kos pokrije polovico manjkajočega dela. Kaj se zgodi pri q = −0,5?",
  });
  draw();
}

// ------------------------------------------------------------ obrestni račun
export function obresti(el) {
  const svg = svgBox(340, 260);
  const out = readout();
  let G = 1000, p = 5, n = 20, m = 1;
  const draw = () => {
    svg.replaceChildren();
    const simple = (t) => G * (1 + (p / 100) * t), comp = (t) => G * (1 + p / 100 / m) ** (m * t);
    const maxV = niceCeil(comp(n) * 1.08); // okrogla meja osi: večja glavnica da višji graf
    const A = axes(svg, { W: 340, H: 260, x: [0, n], y: [0, maxV], xLabel: "leta", yLabel: "€", pad: 40 });
    s("path", { d: fnPath(simple, A, { from: 0, to: n }), class: "graph-line stroke-b" }, svg);
    s("path", { d: fnPath(comp, A, { from: 0, to: n }), class: "graph-line stroke-a" }, svg);
    const dbl = Math.log(2) / (m * Math.log(1 + p / 100 / m));
    if (dbl <= n) s("circle", { cx: A.X(dbl), cy: A.Y(2 * G), r: 5, class: "pt fill-c" }, svg);
    out.innerHTML = `<p><span class="dot dot-b"></span> <b>Navadno obrestovanje</b>: obresti vsako leto od začetne glavnice: ${tex(`G_n = G_0(1 + \\frac{p}{100}n) = ${T(simple(n))}\\ €`)}.</p>
      <p><span class="dot dot-a"></span> <b>Obrestno obrestovanje</b>: obresti se pripišejo in naprej obrestujejo: ${tex(`G_n = G_0\\left(1 + \\frac{p}{100 m}\\right)^{mn} = ${T(comp(n))}\\ €`)}.</p>
      <p>Razlika po ${n} ${n === 1 ? "letu" : "letih"}: ${fmt(comp(n) - simple(n))} €. <span class="dot dot-c"></span> Pri obrestnem obrestovanju se glavnica podvoji po ${fmt(dbl, 1)} letih (pravilo 72: 72 / ${p} ≈ ${fmt(72 / p, 1)}).</p>`;
  };
  layout(el, {
    stage: [svg],
    controls: [
      slider({ label: "glavnica", min: 100, max: 10000, step: 100, value: G, unit: "€", onInput: (v) => ((G = v), draw()) }),
      slider({ label: "obrestna mera", min: 0.5, max: 15, step: 0.5, value: p, unit: "%", onInput: (v) => ((p = v), draw()) }),
      slider({ label: "leta", min: 1, max: 40, value: n, onInput: (v) => ((n = v), draw()) }),
      select({ label: "pripis obresti", options: [[1, "letno"], [2, "polletno"], [4, "četrtletno"], [12, "mesečno"]], value: 1, onChange: (v) => ((m = Number(v)), draw()) }),
    ],
    out,
    tryText: "Koliko let potrebuješ, da se 1000 € pri 7 % podvoji? Kaj spremeni mesečni pripis obresti?",
  });
  draw();
}

// ------------------------------------------------------------ kompleksna števila
export function kompleksna(el) {
  const svg = svgBox(340, 340);
  const out = readout();
  let z = [2, 1], w = [1, 2], op = "+", npow = 3;
  const mul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
  const ztex = (c) => `${T(c[0])} ${c[1] < 0 ? "-" : "+"} ${T(Math.abs(c[1]))}i`;
  const draw = () => {
    svg.replaceChildren();
    const A = axes(svg, { W: 340, H: 340, x: [-6, 6], y: [-6, 6], xStep: 1, yStep: 1, xLabel: "Re", yLabel: "Im" });
    let r;
    if (op === "+") r = [z[0] + w[0], z[1] + w[1]];
    else if (op === "−") r = [z[0] - w[0], z[1] - w[1]];
    else if (op === "·") r = mul(z, w);
    else if (op === ":") { const d = w[0] ** 2 + w[1] ** 2 || 1e-9; r = [(z[0] * w[0] + z[1] * w[1]) / d, (z[1] * w[0] - z[0] * w[1]) / d]; }
    else if (op === "z̄") r = [z[0], -z[1]];
    else { r = [1, 0]; for (let i = 0; i < npow; i++) r = mul(r, z); }
    const vec = (c, col) => arrow(svg, A.X(0), A.Y(0), A.X(c[0]), A.Y(c[1]), col, 2.5);
    if (op === "+" || op === "−") {
      const w2 = op === "+" ? w : [-w[0], -w[1]];
      s("line", { x1: A.X(z[0]), y1: A.Y(z[1]), x2: A.X(r[0]), y2: A.Y(r[1]), class: "guide" }, svg);
      s("line", { x1: A.X(w2[0]), y1: A.Y(w2[1]), x2: A.X(r[0]), y2: A.Y(r[1]), class: "guide" }, svg);
    }
    if (op === "z̄") s("line", { x1: A.X(z[0]), y1: A.Y(z[1]), x2: A.X(r[0]), y2: A.Y(r[1]), class: "guide" }, svg);
    vec(r, "c");
    const useW = ["+", "−", "·", ":"].includes(op);
    [["z", z, "a"], ...(useW ? [["w", w, "b"]] : [])].forEach(([nm, c, col]) => {
      vec(c, col);
      const hd = handle(svg, col);
      label(hd, 0, -16, nm, "pt-lbl");
      hd.move(A.X(c[0]), A.Y(c[1]));
      draggable(svg, hd, (x, y) => {
        const [u, v] = A.inv(x, y);
        c[0] = clamp(Math.round(u * 2) / 2, -6, 6);
        c[1] = clamp(Math.round(v * 2) / 2, -6, 6);
        draw();
      });
    });
    const abs = (c) => Math.hypot(...c), arg = (c) => (deg(Math.atan2(c[1], c[0])) + 360) % 360;
    const nm = op === "z̄" ? "\\bar z" : op === "^" ? `z^{${npow}}` : `z ${{ "+": "+", "−": "-", "·": "\\cdot", ":": ":" }[op]} w`;
    out.innerHTML = texBlock(`${nm} = ${ztex(r)}`) +
      `<p>z = ${ztex(z).replace(/\{,\}/g, ",")}: |z| = ${fmt(abs(z))}, kot ${fmt(arg(z), 1)}°.${useW ? ` w: |w| = ${fmt(abs(w))}, kot ${fmt(arg(w), 1)}°.` : ""}</p>
       <p>${op === "+" || op === "−" ? "Seštevamo kot vektorje: realne dele posebej, imaginarne posebej (paralelogram)." : op === "·" ? `Pri množenju se absolutni vrednosti zmnožita (${fmt(abs(z))} · ${fmt(abs(w))} = ${fmt(abs(r))}), kota pa seštejeta (${fmt(arg(z), 1)}° + ${fmt(arg(w), 1)}° = ${fmt((arg(z) + arg(w)) % 360, 1)}°). Množenje z i je zasuk za 90°.` : op === ":" ? "Pri deljenju se absolutni vrednosti delita, kota odštejeta." : op === "z̄" ? `Konjugirano število je zrcalna slika čez realno os. ${tex("z \\cdot \\bar{z} = |z|^2")} je realno.` : `Potenciranje: |z|ⁿ = ${fmt(abs(z) ** npow)}, kot se pomnoži z n.`}</p>`;
  };
  layout(el, {
    stage: [svg],
    controls: [segmented({ options: ["+", "−", "·", ":", "z̄", "^"], value: op, onChange: (v) => ((op = v), draw()) }), slider({ label: "n (potenca)", min: 2, max: 6, value: npow, onInput: (v) => ((npow = v), (op = "^"), draw()) })],
    out,
    tryText: "Postavi w = i (0, 1) in izberi množenje. Kaj se zgodi z z? Kaj pa, če je w = −1?",
  });
  draw();
}

// ------------------------------------------------------------ srečanje in dohitevanje (besedilne naloge)
export function srecanje(el) {
  const svg = svgBox(340, 90), g2 = svgBox(340, 240);
  const out = readout();
  let mode = "nasproti", v1 = 60, v2 = 40, d = 100, t0 = 0, t = 0;
  const meet = () => (mode === "nasproti" ? (d + v2 * t0) / (v1 + v2) : v1 > v2 ? (d - v2 * 0 + v1 * 0) : null);
  const pos = (tt) => {
    if (mode === "nasproti") return [v1 * Math.max(0, tt), d - v2 * Math.max(0, tt - t0)];
    return [v1 * Math.max(0, tt - t0), d + v2 * tt];
  };
  const tm = () => (mode === "nasproti" ? (d + v2 * t0) / (v1 + v2) : v1 > v2 ? (d + v1 * t0) / (v1 - v2) : null);
  const anim = animate(el, (dt) => {
    const T2 = tm();
    t += dt * 0.6;
    if (T2 != null && t >= T2) (t = T2), draw();
    else if (t > 4) t = 4;
    draw();
    if (T2 != null && t >= T2) return false;
  }, { autoplay: false });
  const draw = () => {
    void meet;
    const T2 = tm();
    const maxT = T2 != null ? Math.max(T2 * 1.2, 0.5) : 4;
    const [p1, p2] = pos(t);
    const maxS = mode === "nasproti" ? d : Math.max(d + v2 * maxT, v1 * maxT, 1);
    svg.replaceChildren();
    const X = (v) => 20 + (v / maxS) * 300;
    s("line", { x1: 20, y1: 60, x2: 320, y2: 60, class: "road" }, svg);
    label(svg, 20, 80, "A", "tick b");
    label(svg, X(d), 80, "B", "tick b");
    s("rect", { x: X(clamp(p1, 0, maxS)) - 12, y: 44, width: 24, height: 12, rx: 3, class: "fill-a" }, svg);
    s("rect", { x: X(clamp(p2, 0, maxS)) - 12, y: 28, width: 24, height: 12, rx: 3, class: "fill-b" }, svg);
    label(svg, 170, 12, `t = ${fmt(t, 2)} h`, "tick b");
    g2.replaceChildren();
    const A = axes(g2, { W: 340, H: 240, x: [0, maxT], y: [0, maxS], xLabel: "t [h]", yLabel: "s [km]", pad: 36 });
    s("path", { d: fnPath((tt) => pos(tt)[0], A, { from: 0, to: maxT }), class: "graph-line stroke-a" }, g2);
    s("path", { d: fnPath((tt) => pos(tt)[1], A, { from: 0, to: maxT }), class: "graph-line stroke-b" }, g2);
    s("line", { x1: A.X(t), y1: A.T, x2: A.X(t), y2: A.B, class: "guide" }, g2);
    if (T2 != null) s("circle", { cx: A.X(T2), cy: A.Y(pos(T2)[0]), r: 6, class: "pt fill-c" }, g2);
    out.innerHTML = mode === "nasproti"
      ? `<p>Iz A pelje <span class="dot dot-a"></span> s hitrostjo ${v1} km/h, iz B (${d} km stran) ${t0 ? `${fmt(t0, 1)} h pozneje ` : ""}nasproti <span class="dot dot-b"></span> s ${v2} km/h.</p>
         ${texBlock(`${v1}t + ${v2}(t ${t0 ? `- ${T(t0, 1)}` : ""}) = ${d} \\Rightarrow t = ${T(T2, 2)}\\,\\mathrm{h}`)}
         <p>Srečata se po ${fmt(T2, 2)} h, ${fmt(v1 * T2, 1)} km od A. Skupaj sta prevozila vso razdaljo: hitrosti se <b>seštejeta</b>.</p>`
      : `<p>Iz A pelje <span class="dot dot-a"></span> ${t0 ? `${fmt(t0, 1)} h pozneje ` : ""}s ${v1} km/h za <span class="dot dot-b"></span>, ki je ${d} km pred njim in vozi s ${v2} km/h.</p>
         ${T2 != null ? texBlock(`${v1}(t ${t0 ? `- ${T(t0, 1)}` : ""}) = ${d} + ${v2}t \\Rightarrow t = ${T(T2, 2)}\\,\\mathrm{h}`) + `<p>Dohiti ga po ${fmt(T2, 2)} h. Razdalja se manjša za razliko hitrosti ${v1 - v2} km/h.</p>` : "<p>Prvi ni hitrejši, zato drugega nikoli ne dohiti: črti na grafu se ne sekata.</p>"}`;
  };
  layout(el, {
    stage: [h("div", { class: "demo-seg-wrap" }, segmented({ options: [["nasproti", "Vožnja nasproti"], ["dohitevanje", "Dohitevanje"]], value: mode, onChange: (v) => ((mode = v), (t = 0), draw()) })), svg, g2],
    controls: [
      slider({ label: "v₁", min: 10, max: 120, step: 5, value: v1, unit: "km/h", onInput: (v) => ((v1 = v), (t = 0), draw()) }),
      slider({ label: "v₂", min: 10, max: 120, step: 5, value: v2, unit: "km/h", onInput: (v) => ((v2 = v), (t = 0), draw()) }),
      slider({ label: "razdalja", min: 10, max: 300, step: 10, value: d, unit: "km", onInput: (v) => ((d = v), (t = 0), draw()) }),
      slider({ label: "zamik štarta", min: 0, max: 2, step: 0.25, value: t0, unit: "h", onInput: (v) => ((t0 = v), (t = 0), draw()) }),
      buttons(playButton(anim, { play: "Poženi", pause: "Ustavi" }), button("Na začetek", () => ((t = 0), draw()))),
    ],
    out,
    tryText: "Na grafu poišči presečišče črt. Kaj pomenita njegovi koordinati?",
  });
  draw();
}

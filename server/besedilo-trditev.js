// Lahka pravila za besedilo odgovora (vrstice, ki niso trditev, vaje, kratki TeX), brez odvisnosti od strežnika: uvažata
// jih live-check.js in racun.js, racun.js pa tudi skripte brez npm paketov (lean-prevod v GitHubu).

// Vrstice, kjer napačna vrednost lahko stoji namenoma (učenčeva napaka, vprašanje, »če bi …«).
// Tudi učenčev zapis (»Ti si napisal …«), zavrnjeni kandidati (»$x = 1$ odpade«) in poskusi.
export const SKIP_LINE = /napačn|narobe|ne velja|ni enako|nepravil|ni res|ne drži|ni prav|ni pravil|ne ustreza|ne zadošča|odpade|ni rešitev|kandidat|definicijsk|poskus|tvoj|✗|\?|(?<!\p{L})(če|ali|bi|if|wrong|incorrect|you|napisal[a]?|zapisal[a]?|dobil[a]?|izračunal[a]?|extraneous|reject)(?!\p{L})/iu;

// Računi in končne vrednosti (AUDIT-066): vrstica se preskoči kot na main (SKIP_LINE).
export const notClaimAt = (line) => SKIP_LINE.test(String(line || ""));

// »\frac14«, »\frac12 x«, »\sqrt4« brez oklepajev: texToText jih bere narobe, zato koda o njih ne sodi.
export const TEX_SHORT = /\\(?:d|t)?(?:frac|sqrt)(?![a-zA-Z])\s*[^{\s\\[]/;

export const EXERCISE_RE = /(?:^|\n)[ \t>*_]*(?:dodatna vaja|vaja|za vajo|practice(?: exercise)?)[*_ \t]*[:：]/iu;
export const hasExercise = (answer) => EXERCISE_RE.test(String(answer || ""));

// Zapis števila, ki ga račun ne bere zanesljivo (pregled B, 7f565d941): periodična decimalka (»0{,}(3)«, »0,1(6)«,
// »\overline«, »\dot«, »\ldots«), pika za tisočice (»2.500«, »1.200 €«), kratki TeX (»\frac12«) in mešano število
// (»1\tfrac12«). Neujemanje v takem zapisu ni ugotovitev kode (ne popravek ne opomba).
export const AMBIGUOUS_NUM = /\d(?:[.,]|\{,\})\d*\(\d+\)|\\overline|\\dot(?![a-zA-Z])|\\l?dots|…|(?<![\d.,{])\d{1,3}(?:\.\d{3})+(?![\d,{])|\d\s*\\[dt]?frac(?![a-zA-Z])/;
// Vrstica, kjer zapis lahko stoji namenoma ali v drugem pomenu (pregled A, 7f565d941): zgled, pogosta napaka, vaja,
// namig, teme, os, ekstrem, asimptota, vrednost funkcije, ura, ostanek, enota (»cm«, »mm«, enota za vrednostjo,
// »\text{…}«). Ugotovitev ostane (popravek modela kot main), opombe brez modela pa ni: ob pravilnem odgovoru bi bila
// konkretna opomba lažna (»$x = 3$ ni rešitev« pri simetrali parabole).
// Pri računu (»calc«) šteje le zgled, napaka, vaja, ura, ostanek; enote in »vrednost« so pri besedilnih nalogah
// običajne (»$v = 10 \cdot 3 = 13\,\mathrm{m/s}$« je prava napaka).
const NOTE_WORDS = /(?<!\p{L})(?:npr|primer\p{L}*|zgled\p{L}*|podob\p{L}*|vaj\p{L}*|pogost\p{L}*|napak\p{L}*|namig\p{L}*|ugani|ugib\p{L}*|poskus\p{L}*|ur[aeio]?|polnoč\p{L}*|ostan\p{L}*|mod|e\.g|example|instance|common|mistake|exercise|hint|clock)(?!\p{L})/iu;
const NOTE_TEX = /\\(?:pmod|bmod|equiv)(?![a-zA-Z])/;
const VALUE_WORDS = /(?<!\p{L})(?:tem(?:e|ena|enu|enom)|simetral\p{L}*|ekstrem\p{L}*|minim\p{L}*|maksim\p{L}*|asimptot\p{L}*|središč\p{L}*|os|osi|vrednost\p{L}*|graf\p{L}*|mm|cm|dm|km|vertex|axis)(?!\p{L})|[€%°′″]/iu;
const VALUE_TEX = /\\(?:text|mathrm|circ|degree)(?![a-zA-Z])|[°%′″]/;
const UNIT_AFTER = /^\s*(?:\\,|~)?\s*(?:mm|cm|dm|km|m|kg|dag|g|mg|t|s|min|h|ml|dl|l|€|%|°|EUR|N|J|W|V|A|Pa|K)(?![\p{L}\d])/u;
const MATH_SEG = /\$\$[\s\S]+?\$\$|\$[^$\n]+?\$/g;
export function noteLine(line, { value = true } = {}) {
  const s = String(line || "");
  const prose = s.replace(MATH_SEG, " ");
  if (NOTE_TEX.test(s) || NOTE_WORDS.test(prose)) return false;
  if (!value) return true;
  if (VALUE_TEX.test(s) || VALUE_WORDS.test(prose)) return false;
  for (const m of s.matchAll(MATH_SEG)) if (UNIT_AFTER.test(s.slice(m.index + m[0].length))) return false;
  return true;
}

// Vrednost iz odgovora kot TeX za opombo (pregled A): le število, ulomek, koren ali π v zapisu odgovora, z decimalno
// vejico. Karkoli drugega (besedilni zapis »sqrt(3)«, enote, dvoumna števila) → null: brez opombe.
export function valueTex(tex) {
  const t = String(tex || "").trim().replace(/[.,;:]$/, "").trim();
  if (!t || t.length > 60 || AMBIGUOUS_NUM.test(t) || TEX_SHORT.test(t)) return null;
  if (!/^[-−+\d\s{}(),.^_/]+$/.test(t.replace(/\\(?:[dt]?frac|sqrt|pi|cdot|left|right)(?![a-zA-Z])/g, ""))) return null;
  if (!/\d/.test(t)) return null;
  return t.replace(/−/g, "-").replace(/(\d)[.,](?=\d)/g, "$1{,}");
}

// vsak del posebej: stik »… = 20« in »\frac« iz drugega dela ni mešano število
export const ambiguousCalc = (m) => [m?.tex, m?.lhs, m?.rhs].some((t) => AMBIGUOUS_NUM.test(String(t || ""))) || TEX_SHORT.test(String(m?.tex || ""));

// Zapisi za opombo brez modela (server/opomba-preverjanja.js, AUDIT-060): podatki ugotovitev so TeX brez »$«.
/** Navaden zapis (»x = 2,5«, »7 · 8«, »x ≈ 0,7«) v TeX za opombo. */
export function plainToTex(s) {
  return String(s ?? "")
    .replace(/\$/g, "")
    .replace(/(\d),(?=\d)/g, "$1{,}")
    .replace(/(\d)\s*\*\s*(?=[a-zA-Z(])/g, "$1")
    .replace(/·|⋅|\*/g, " \\cdot ")
    .replace(/×/g, " \\times ")
    .replace(/÷/g, " : ")
    .replace(/≈/g, " \\approx ")
    .replace(/≠/g, " \\neq ")
    .replace(/→/g, " \\to ")
    .replace(/−|–/g, "-")
    .replace(/√\s*\(([^()]*)\)/g, "\\sqrt{$1}")
    .replace(/\s+/g, " ")
    .trim();
}

/** Število za opombo v TeX: točno (»56«, »2{,}5«) ali zaokroženo z »\approx«; null, ko ga ni mogoče lepo zapisati. */
export function numTex(x) {
  if (typeof x !== "number" || !Number.isFinite(x) || Math.abs(x) >= 1e15 || (x !== 0 && Math.abs(x) < 1e-6)) return null;
  const r = Number(x.toPrecision(6));
  const exact = Math.abs(r - x) <= 1e-12 * Math.max(1, Math.abs(x));
  return { rel: exact ? "=" : "\\approx", tex: String(r).replace(".", "{,}") };
}

/**
 * Ugotovitev za opombo iz neujemanja računa (checkArithmetic): zapis, ki ne drži, in resnična enakost za eno stran
 * (»7 \\cdot 8 = 56«). Z enoto ali odstotkom brez vrednosti (pretvorba enot, odstotek kot količnik ali enota).
 */
export function calcFact(m) {
  if (!m?.lhs || !m?.rhs || ambiguousCalc(m)) return { kind: "calc", wrong: null };
  const op = m.op === "=" ? "=" : m.op;
  const wrong = `${m.lhs} ${op} ${m.rhs}`;
  if (m.units || /%/.test(wrong)) return { kind: "calc", wrong };
  const bare = (t) => /^[-+]?[\d\s.,{}]+$/.test(t);
  // »54 = 7 \\cdot 8«: vrednost računa na desni, ne golega števila na levi
  const [side, v] = bare(m.lhs) && !bare(m.rhs) && typeof m.rv === "number" ? [m.rhs, m.rv] : [m.lhs, m.lv];
  const n = numTex(v);
  return { kind: "calc", wrong, right: n && !bare(side) ? `${side} ${n.rel} ${n.tex}` : null };
}

/** Zapis v sintaksi kalkulatorja (»2*x+3=11«, »sqrt(2)«) v TeX za opombo; null, ko zapis ni preprost. */
export function calcToTex(s) {
  const t = String(s ?? "").trim();
  if (!t || t.length > 120 || !/^[\w\s+\-*/^().=,]+$/.test(t)) return null;
  if ((t.match(/[a-zA-Z]{2,}/g) || []).some((w) => w !== "sqrt" && w !== "pi")) return null;
  return t
    .replace(/sqrt\(([^()]*)\)/g, "\\sqrt{$1}")
    .replace(/(?<![a-zA-Z])pi(?![a-zA-Z])/g, "\\pi ")
    .replace(/(\d)\s*\*\s*(?=[a-zA-Z(\\])/g, "$1")
    .replace(/\*/g, " \\cdot ")
    .replace(/(\d)\.(?=\d)/g, "$1{,}")
    .replace(/\s+/g, " ")
    .replace(/\s*([=+-])\s*/g, " $1 ")
    .replace(/^ - /, "-")
    .trim();
}


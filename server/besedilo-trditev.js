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
// Pregled B (4cf3be1fb): tudi angleška vejica za tisočice (»1,000 + 1 = 1,001«) in ura s piko (»8.45 + 0.30 = 9.15«).
export const AMBIGUOUS_NUM = /\d(?:[.,]|\{,\})\d*\(\d+\)|\\overline|\\dot(?![a-zA-Z])|\\l?dots|…|(?<![\d.,{])\d{1,3}(?:\.\d{3})+(?![\d,{])|(?<![\d.,{])\d{1,3}(?:,\d{3})+(?![\d{])|(?<![\d.,{])\d{1,2}\.[0-5]\d(?![\d.])|\d\s*\\[dt]?frac(?![a-zA-Z])/;
// Vrstica, kjer zapis lahko stoji namenoma ali v drugem pomenu (pregled A, 7f565d941): zgled, pogosta napaka, vaja,
// namig, teme, os, ekstrem, asimptota, vrednost funkcije, ura, ostanek, enota (»cm«, »mm«, enota za vrednostjo,
// »\text{…}«). Ugotovitev ostane (popravek modela kot main), opombe brez modela pa ni: ob pravilnem odgovoru bi bila
// konkretna opomba lažna (»$x = 3$ ni rešitev« pri simetrali parabole).
// Pri računu (»calc«) šteje le zgled, napaka, vaja, ura, ostanek; enote in »vrednost« so pri besedilnih nalogah
// običajne (»$v = 10 \cdot 3 = 13\,\mathrm{m/s}$« je prava napaka).
// Pregled B (018af7ab6): odgovor, ki zapis sam označi kot napako (»Mnogi zamenjajo …«, »Ne piši …«, »❌«, »~~«,
// »Trditev … je lažna«, opis učenčevega lista ali slike, izbirni odgovori »(a) … (b)«), ali račun v drugem sistemu
// (dvojiški, po modulu, $\mathbb{Z}_5$, Boolova algebra, logični ALI) prav tako ne dobi opombe brez modela.
const NOTE_WORDS = /(?<!\p{L})(?:npr|primer\p{L}*|zgled\p{L}*|podob\p{L}*|vaj\p{L}*|pogost\p{L}*|napak\p{L}*|napačn\p{L}*|namig\p{L}*|ugani|ugib\p{L}*|poskus\p{L}*|ur[aeio]?|polnoč\p{L}*|ostan\p{L}*|mod|modul\p{L}*|mnog\p{L}*|tipičn\p{L}*|zamenja\p{L}*|zamenjav\p{L}*|past\p{L}*|zmot\p{L}*|piš[ei]|zapiši|napiši|zapišeš|zapisal\p{L}*|pozab\p{L}*|namesto|izogib\p{L}*|lažn\p{L}*|narobe|zalomil\p{L}*|spodrsl\p{L}*|temveč|ne drži|ne velja|ne gre|ne more|ni (?:čisto |povsem |res )?(?:prav|pravilno|res|v redu|točno)|zdi|sošol\p{L}*|trdi\p{L}*|fotografij\p{L}*|slik\p{L}*|listu|tabl\p{L}*|kalkulator\p{L}*|upoštev\p{L}*|prednost\p{L}*|dvojišk\p{L}*|binar\p{L}*|šestnajst\p{L}*|osmišk\p{L}*|boole\p{L}*|logičn\p{L}*|zaokrož\p{L}*|round\p{L}*|e\.g|example|instance|common|mistake|exercise|hint|clock|instead|slip|never|don't|avoid|false|wrong|typical\p{L}*|often|binary|modulo)(?!\p{L})|❌|✗|✘|~~/iu;
const NOTE_UPPER = /(?<!\p{L})(?:ALI|IN|OR|AND|XOR|NE)(?!\p{L})/u; // logični operatorji
const NOTE_CHOICE = /(?:^|\s)\(?[a-dA-D]\)\s*\$|^\s*[a-dA-D][.)]\s/;
const NOTE_TEX = /\\(?:pmod|bmod|equiv|oplus|lor|vee)(?![a-zA-Z])|\\mathbb\s*\{?\s*Z/;
// Drug številski sistem, ostanki, ura ali logika kjerkoli v odgovoru (pregled A in B, 018af7ab6): »$1 + 1 = 10$« v
// dvojiškem, »$3 + 4 = 2$« v $\mathbb{Z}_5$, »$22 + 5 = 3$ zjutraj«, »Dan v tednu: $6 + 3 = 2$«, »Logično ALI: $1 + 1 = 1$«.
// Tak račun ne dobi nobene opombe brez modela (ne trdne ne blage).
const OTHER_SYSTEM_WORDS = /(?<!\p{L})(?:mod|modul\p{L}*|dvojišk\p{L}*|binar\p{L}*|šestnajst\p{L}*|osmišk\p{L}*|boole\p{L}*|logičn\p{L}*|binary|modulo|hex\p{L}*|na uri|ura (?:je|bo|kaže)|uri kaže|zjutraj|zvečer|ponoči|popoldn\p{L}*|dopoldn\p{L}*|opoldn\p{L}*|polnoč\p{L}*|dan v tednu|dnevi v tednu|dni v tednu|clock|o'clock|minut\p{L}*|ob\s+\d+)(?!\p{L})|(?<![\p{L}/])h(?![\p{L}/])/iu;
const OTHER_SYSTEM_TEX = /\\(?:pmod|bmod|mod|equiv|oplus|lor|vee|land|wedge)(?![a-zA-Z])|\\mathbb\s*\{?\s*Z|(?<![\p{L}\\])Z_\{?\d/u;
const LOGIC_UPPER = /(?<!\p{L})(?:ALI|OR|XOR|AND|NOT)(?!\p{L})/u;
// besede in »h« (ura) le zunaj formul: »$h = \sqrt{16}$« je višina
export const OTHER_SYSTEM = {
  test: (t) => {
    const prose = String(t || "").replace(/\$\$[\s\S]+?\$\$|\$[^$\n]+?\$/g, " ");
    return OTHER_SYSTEM_WORDS.test(prose) || LOGIC_UPPER.test(prose) || OTHER_SYSTEM_TEX.test(String(t || ""));
  },
};
// Odgovor kot celota označi napačen zapis (»❌ … ✅ …«, »~~…~~«, »Namesto … pišemo …«, preglednica »Napačno | Pravilno«).
export const LABELLED_REPLY = /✅|✓|✔|❌|✗|✘|~~|(?<!\p{L})(?:namesto|instead)(?!\p{L})|\|\s*\**\s*napačn/iu;
const VALUE_WORDS = /(?<!\p{L})(?:tem(?:e|ena|enu|enom)|simetral\p{L}*|ekstrem\p{L}*|minim\p{L}*|maksim\p{L}*|asimptot\p{L}*|središč\p{L}*|os|osi|vrednost\p{L}*|graf\p{L}*|mm|cm|dm|km|vertex|axis)(?!\p{L})|[€%°′″]/iu;
const VALUE_TEX = /\\(?:text|mathrm|circ|degree)(?![a-zA-Z])|[°%′″]/;
const UNIT_AFTER = /^\s*(?:\\,|~)?\s*(?:mm|cm|dm|km|m|kg|dag|g|mg|t|s|min|h|ml|dl|l|€|%|°|EUR|N|J|W|V|A|Pa|K)(?![\p{L}\d])/u;
const MATH_SEG = /\$\$[\s\S]+?\$\$|\$[^$\n]+?\$/g;
export function noteLine(line, { value = true } = {}) {
  const s = String(line || "");
  const prose = s.replace(MATH_SEG, " ");
  if (NOTE_TEX.test(s) || NOTE_WORDS.test(prose) || NOTE_UPPER.test(prose) || NOTE_CHOICE.test(s)) return false;
  if (!value) return true;
  if (VALUE_TEX.test(s) || VALUE_WORDS.test(prose)) return false;
  for (const m of s.matchAll(MATH_SEG)) if (UNIT_AFTER.test(s.slice(m.index + m[0].length))) return false;
  return true;
}

// Pozitivni znak, da je zapis odgovor (pregled A, 018af7ab6): beseda rezultata v vrstici ali vrstici pred njo,
// krepko ali \boxed, ali pa je odgovor le ta zapis. Opomba brez modela pri vrednosti neznanke in računu je samo takrat.
export const RESULT_CUE = /(?<!\p{L})(?:rešitev|rešitvi|rešitve|torej|zato|sledi|odgovor\p{L}*|rezultat\p{L}*|dobimo|je enak\p{L}*|so|therefore|answer|result|hence|thus)(?!\p{L})/iu;
const proseOf = (t) => String(t || "").replace(MATH_SEG, " ");
export function prevLine(lines, i) {
  let k = i - 1;
  while (k >= 0 && !String(lines[k] || "").trim()) k--;
  return k >= 0 ? String(lines[k]) : "";
}
/** Zapis v vrstici »i« na mestu [start, end) (z »$«) je predstavljen kot rezultat odgovora. */
export function presentedAsResult(answer, lines, i, start, end) {
  const line = String(lines[i] || "");
  if (line.slice(end).includes("?")) return false;
  // beseda rezultata pred zapisom (»Rešitev: $x = 4$«, »torej $x = 4$«), ne za njim (»Preverimo $x = 3$ … Torej več.«)
  // in v istem stavku (»Vsota rešitev je 5. Pri $x = 4$ …« ni rezultat); vrstica pred njim le, ko stavek začne vrstico
  const before = proseOf(line.slice(0, start));
  const stop = before.search(/[.!?;][^.!?;]*$/);
  if (RESULT_CUE.test(stop >= 0 ? before.slice(stop + 1) : before) || (stop < 0 && RESULT_CUE.test(proseOf(prevLine(lines, i))))) return true;
  if (/\\(?:boxed|mathbf)(?![a-zA-Z])/.test(line.slice(start, end))) return true;
  if (/\*\*\s*$/.test(line.slice(0, start)) && /^\s*\*\*/.test(line.slice(end))) return true;
  return (proseOf(answer).match(/\p{L}+/gu) || []).length <= 3;
}
/** Za formulo v vrstici sledi beseda ali enota (»$25 : 6 = 5$ avtobusov«, »$= 1{,}5$ kg«; pregled A, 4cf3be1fb). */
export function wordAfter(line, end) {
  return /^\s*(?:(?:\\,|~)\s*)?(?!(?:in|and|ali|or|ter|kar|ker|saj|zato|ki)(?!\p{L}))\p{L}/u.test(String(line || "").slice(end));
}
/** Zapis je zadnja formula odgovora: za njim le presledki in ločila (brez »?«). */
export function lastFormula(lines, i, end) {
  const rest = [String(lines[i] || "").slice(end), ...lines.slice(i + 1)].join("\n");
  return /^[\s.,;:!)*_»"']*$/u.test(rest);
}
/** Mesto zapisa »tex« v vrstici: [start, end) z »$« ali null. */
export function segmentOf(line, tex) {
  for (const m of String(line || "").matchAll(MATH_SEG)) if (m[0].includes(String(tex || "").trim())) return [m.index, m.index + m[0].length];
  return null;
}
/** Odgovor kjerkoli navede vrednost »v« (pravo vrednost računa), zunaj zapisa »skip«. */
export function statesNumber(answer, v, skip = "") {
  if (typeof v !== "number" || !Number.isFinite(v)) return false;
  const rest = skip ? String(answer || "").split(skip).join(" ") : String(answer || "");
  for (const n of rest.matchAll(/(?<![\d.,{}])[-−]?\d+(?:(?:[.,]|\{,\})\d+)?(?![\d]|[.,]\d|\{,\})/g)) {
    const x = Number(n[0].replace("−", "-").replace("{,}", ".").replace(",", "."));
    if (Math.abs(x - v) <= 1e-9 * Math.max(1, Math.abs(v))) return true;
  }
  return false;
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


// Evklidova tipkovnica: podatki in čista pravila brez DOM (razporeditve po jeziku, različice črk,
// skupine funkcij, kdaj polje dobi našo tipkovnico, vstavljanje predloge z »@«).
// Komponenta je v public/tipkovnica.js; test/tipkovnica.test.js preveri ta modul v Node.
import { LANGUAGES } from "./i18n/languages.js";

// ---------- razporeditve črk ----------
// rows: tri vrstice črk; caseless: pisava brez velikih črk (brez ⇧); rtl: od desne proti levi;
// globe: tipka 🌐 da temu polju telefonovo tipkovnico (jeziki, ki pišejo z načinom za znake);
// hints: samo te črke imajo namig različice v kotu (sicer vse z različicami; zgornja vrsta ima vedno številko).
const QWERTY = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
const QWERTZ = ["qwertzuiop", "asdfghjkl", "yxcvbnm"];
const split = (rows) => rows.map((r) => [...r]);

export const LAYOUTS = {
  // slovenščina kot Gboard na telefonu (j, 4. 11.): QWERTY, č š ž z dolgim pritiskom na c s z
  sl: { rows: split(QWERTY), hints: "csz" },
  hr: { rows: split(["qwertzuiopš", "asdfghjklčž", "yxcvbnm"]) },
  de: { rows: split(["qwertzuiopü", "asdfghjklöä", "yxcvbnmß"]) },
  qwertz: { rows: split(QWERTZ) },
  qwerty: { rows: split(QWERTY) },
  ru: { rows: split(["йцукенгшщзх", "фывапролджэ", "ячсмитьбю"]) },
  uk: { rows: split(["йцукенгшщзх", "фівапролджє", "ячсмитьбю"]) },
  be: { rows: split(["йцукенгшўзх", "фывапролджэ", "ячсмітьбю"]) },
  sr: { rows: split(["љњертзуиопш", "асдфгхјклчћ", "жџцвбнмђ"]) },
  mk: { rows: split(["љњертѕуиопш", "асдфгхјклчќ", "жзџцвбнмѓ"]) },
  el: { rows: split(["ςερτυθιοπ", "ασδφγηξκλ", "ζχψωβνμ"]) },
  ar: { rows: split(["ضصثقفغعهخحج", "شسيبلاتنمكط", "ذءؤرىةوزظد"]), caseless: true, rtl: true },
  fa: { rows: split(["ضصثقفغعهخحج", "شسیبلاتنمکگ", "ظطزرذدپوچژ"]), caseless: true, rtl: true },
  ime: { rows: split(QWERTY), globe: true },
};

// Različice ob dolgem pritisku. Prva je tudi namig v kotu tipke.
const LATIN_VARIANTS = {
  a: ["á", "à", "â", "ä", "ã", "å", "ą", "æ"], c: ["č", "ć", "ç"], d: ["đ", "ď"], e: ["é", "è", "ê", "ë", "ę", "ě", "ė"],
  g: ["ğ"], i: ["í", "ì", "î", "ï", "ı"], l: ["ł", "ľ"], n: ["ñ", "ń", "ň"], o: ["ó", "ò", "ô", "ö", "õ", "ø", "ő"],
  r: ["ř"], s: ["š", "ś", "ş", "ß"], t: ["ť", "ţ"], u: ["ú", "ù", "û", "ü", "ů", "ű"], y: ["ý", "ÿ"], z: ["ž", "ź", "ż"],
};
const PUNCT = { ".": ["?", "!", "…", ":"], ",": [";", "'", '"', "-"] };
export const VARIANTS = {
  sl: { c: ["č", "ć"], s: ["š"], z: ["ž"], d: ["đ"], e: ["é", "è", "ê", "ë"], a: ["á", "à", "â", "ä"], o: ["ó", "ô", "ö"], u: ["ú", "ü"], i: ["í", "î"], n: ["ñ"], ...PUNCT },
  hr: { c: ["č", "ć"], s: ["š"], z: ["ž"], d: ["đ"], e: ["é", "è", "ê", "ë"], a: ["á", "à", "â", "ä"], o: ["ó", "ô", "ö"], u: ["ú", "ü"], i: ["í", "î"], n: ["ñ"], ...PUNCT },
  de: { a: ["á", "à", "â"], o: ["ó", "ò", "ô"], u: ["ú", "ù", "û"], e: ["é", "è", "ê", "ë"], s: ["ś", "š"], c: ["ç", "č"], n: ["ñ"], ...PUNCT },
  latin: { ...LATIN_VARIANTS, ...PUNCT },
  ru: { "е": ["ё"], "ь": ["ъ"], ...PUNCT },
  uk: { "г": ["ґ"], "і": ["ї"], "ь": ["'"], ...PUNCT },
  be: { "е": ["ё"], "ь": ["'"], ...PUNCT },
  sr: PUNCT,
  mk: PUNCT,
  el: { "α": ["ά"], "ε": ["έ"], "η": ["ή"], "ι": ["ί", "ϊ", "ΐ"], "ο": ["ό"], "υ": ["ύ", "ϋ", "ΰ"], "ω": ["ώ"], ".": [";", "!", "…", ":"], ",": ["·", "'", '"'] },
  ar: { "ا": ["أ", "إ", "آ"], "ي": ["ئ", "ى"], "و": ["ؤ"], "ه": ["ة"], "ك": ["ک", "گ"], "ب": ["پ"], "ج": ["چ"], "ز": ["ژ"], ".": ["؟", "!", ":"], "،": ["؛", "'", '"'] },
  fa: { "ا": ["آ", "أ"], "ی": ["ئ", "ي", "ے"], "ک": ["ك"], "ه": ["ة", "ۀ", "ہ", "ھ"], "و": ["ؤ"], "ت": ["ٹ"], "د": ["ڈ"], "ر": ["ڑ"], "ن": ["ں"], ".": ["؟", "!", ":"], "،": ["؛", "'", '"'] },
};

const LANG_LAYOUT = {
  sl: "sl", hr: "hr", bs: "hr", "sr-Latn": "hr",
  de: "de", gsw: "de", bar: "de", nds: "de", lb: "de",
  cs: "qwertz", sk: "qwertz", hu: "qwertz",
  ru: "ru", bg: "ru", uk: "uk", be: "be", sr: "sr", mk: "mk", el: "el",
  ar: "ar", fa: "fa", ur: "fa", ps: "fa",
};
// Latinica, ki jo telefon piše z načinom za znake (tonski znaki): ostane tipka 🌐.
const IME_LATIN = new Set(["vi"]);
const NATIVE = new Map(LANGUAGES.map(([code, native]) => [code, native]));

/** Razporeditev ABC za jezik aplikacije: { id, rows, variants, hints, caseless, rtl, globe, comma }. */
export function layoutFor(lang = "sl") {
  let id = LANG_LAYOUT[lang];
  if (!id) {
    const base = String(lang).split("-")[0];
    id = LANG_LAYOUT[base];
    if (!id) {
      const name = NATIVE.get(lang) || NATIVE.get(base) || "";
      if (IME_LATIN.has(base)) id = "ime";
      else if (/^[\p{Script=Latin}\p{P}\p{Zs}\d]+$/u.test(name)) id = "qwerty";
      else if (/\p{Script=Cyrillic}/u.test(name)) id = "ru";
      else if (/\p{Script=Arabic}/u.test(name)) id = "fa";
      else id = "ime"; // japonščina, kitajščina, hindijščina, korejščina, tajščina …
    }
  }
  const L = LAYOUTS[id];
  const variants = VARIANTS[id] || (id === "ime" || id === "qwerty" || id === "qwertz" ? VARIANTS.latin : PUNCT);
  return { id, rows: L.rows, variants, hints: L.hints || null, caseless: !!L.caseless, rtl: !!L.rtl, globe: !!L.globe, comma: L.rtl ? "،" : "," };
}

// ---------- matematika: f(x) po skupinah ----------
// Samo zapisi, ki jih razume kalkulator (public/graph/math.js BUILTINS, scicore.js, scisolve.js).
// [napis, vstavi]; »@« je mesto kazalca (in označenega besedila).
export const FX_GROUPS = [
  ["trig", "sc.grp.trig", [["sin", "sin(@)"], ["cos", "cos(@)"], ["tan", "tan(@)"], ["cot", "cot(@)"], ["°", "°"], ["′", "′"], ["″", "″"], ["sin⁻¹", "arcsin(@)"], ["cos⁻¹", "arccos(@)"], ["tan⁻¹", "arctan(@)"], ["cot⁻¹", "arccot(@)"], ["π", "π"], ["sinh", "sinh(@)"], ["cosh", "cosh(@)"], ["tanh", "tanh(@)"]]],
  ["pow", "tk.fx.pow", [["x²", "²"], ["x³", "³"], ["xⁿ", "^(@)"], ["x⁻¹", "⁻¹"], ["√", "√(@)"], ["∛", "∛(@)"], ["ⁿ√", "root(@;)"], ["eˣ", "e^(@)"], ["10ˣ", "10^(@)"], ["log", "log(@)"], ["ln", "ln(@)"], ["logₐ", "logb(@;)"], ["|x|", "abs(@)"], ["a/b", "(@)/()"], ["×10ⁿ", "×10^(@)"]]],
  ["ana", "sc.grp.ana", [["d/dx", "d/dx(@)"], ["f′(a)", "d/dx(@;)"], ["∫ₐᵇ", "∫(@;;)"], ["integrate", "integrate(@)"], ["limit", "limit(@; x; )"], ["taylor", "taylor(@; x; 0; 5)"], ["∑", "∑_(n=1)^(@) "], ["∏", "∏_(n=1)^(@) "], ["f(x)=", "f(x)="], ["g(x)=", "g(x)="], ["x", "x"], ["y", "y"], ["=", "="], [";", ";"], ["<", "<"], [">", ">"], ["≤", "≤"], ["≥", "≥"]]],
  // simbolno računanje (public/graph/cas.js, calculus.js); v slovenščini se napisi in ukazi zamenjajo s CAS_SL
  ["alg", "sc.grp.alg", [["simplify", "simplify(@)"], ["expand", "expand(@)"], ["factor", "factor(@)"], ["solve", "solve(@; x)"], ["x", "x"], ["y", "y"], ["a", "a"], ["b", "b"], ["c", "c"], ["=", "="], [";", ";"], ["²", "²"], ["a/b", "(@)/()"]]],
  ["num", "sc.grp.num", [["n!", "!"], ["nCr", "nCr(@;)"], ["nPr", "nPr(@;)"], ["gcd", "gcd(@;)"], ["lcm", "lcm(@;)"], ["mod", "mod(@;)"], ["round", "round(@;)"], ["⌊x⌋", "floor(@)"], ["⌈x⌉", "ceil(@)"], ["sgn", "sgn(@)"], ["Int", "Int(@)"], ["frac", "frac(@)"], ["Ran#", "rand"], ["RanInt", "randint(@;)"], ["Pol", "Pol(@;)"], ["Rec", "Rec(@;)"], ["%", "%"], ["Ans", "Ans"]]],
  ["stat", "sc.grp.stat", [["mean", "mean(@)"], ["median", "median(@)"], ["σ", "stdev(@)"], ["min", "min(@)"], ["max", "max(@)"], ["Σ", "total(@)"], [";", ";"]]],
  ["cplx", "sc.grp.cplx", [["i", "i"], ["|z|", "abs(@)"]]],
];

// Imena ukazov CAS v slovenščini (enako kot commandName v public/graph/cas.js; kalkulator razume oboje).
export const CAS_SL = { simplify: "poenostavi", expand: "razvij", factor: "razstavi", solve: "reši", integrate: "integriraj", limit: "limita", taylor: "taylor" };

// Kemija: elementi, indeksi, naboji, puščice, agregatna stanja.
export const KEM_ROWS = [
  ["H", "C", "N", "O", "S", "Cl", "Na", "K", "Ca", "Fe"],
  ["₂", "₃", "₄", "₅", "₆", "⁺", "⁻", "²⁺", "³⁺", "²⁻"],
  ["→", "⇌", "↑", "↓", "(aq)", "(s)", "(l)", "(g)", "Δ", "e⁻"],
];

// Vrstica 123 nad številkami: v matematiki zapisi, drugje pogosti znaki.
export const NUM_TOP_MATH = [["x²", "²"], ["√", "√(@)"], ["xⁿ", "^(@)"], ["π", "π"], ["( )", "(@)"], ["a/b", "(@)/()"]];
export const NUM_TOP_TEXT = [["( )", "(@)"], ["%", "%"], ["€", "€"], ["/", "/"], ["#", "#"], ["&", "&"]];
// Pogosti znaki v klepetu z inštruktorjem (vrstica nad tipkami).
// Ulomek, potenca, indeks (zaporedja), integral in vsota se v poslanem sporočilu izrišejo kot formula (public/vnos-formul.js).
export const TUTOR_CHIPS = [
  ["a/b", "(@)/()"], ["x²", "²"], ["xⁿ", "^(@)"], ["√", "√(@)"], ["aₙ", "_(@)"], ["∫", "∫ (@) dx"], ["∫ₐᵇ", "∫_(@)^() () dx"], ["∑", "∑_(n=1)^(@) "],
  ["π", "π"], ["∞", "∞"], ["→", "→"], ["≤", "≤"], ["≠", "≠"], ["·", "·"], ["°", "°"],
];
export const URL_CHIPS = [["https://", "https://"], [".com", ".com"], [".si", ".si"], ["/", "/"]];
/** Ali je polje za povezavo (type=url ali inputmode=url): dobi tipko Prilepi in pripone. */
export const isUrlField = (el) => String(el?.type || el?.getAttribute?.("type") || "").toLowerCase() === "url" || String(el?.getAttribute?.("inputmode") || "").toLowerCase() === "url";
// e-pošta v obrazcu z geslom = prijava ali registracija
const hasPassword = (el) => !!(el.form || el.closest?.("form"))?.querySelector?.('input[type="password"]');
export const EMAIL_CHIPS = [["@", "@"], [".si", ".si"], [".com", ".com"], ["@gmail.com", "@gmail.com"]];

// ---------- katera polja dobijo našo tipkovnico ----------
// Telefonova tipkovnica samo za prijavne podatke (j, 1. 11.: »no other keyboard than Evklid's, except on the sign-in page for credentials«):
// geslo in e-pošta/uporabniško ime v obrazcu z geslom. Vse ostalo (tudi povezave) piše Evklidova, s tipko Prilepi.
const NO_KB_TYPES = new Set(["password", "file", "date", "datetime-local", "month", "week", "time", "color", "range", "checkbox", "radio", "submit", "button", "reset", "image", "hidden"]);
const NUM_TYPES = new Set(["number", "tel"]);
const NUM_MODES = new Set(["numeric", "decimal", "tel"]);
const LOGIN = /\b(username|current-password|new-password|one-time-code)\b/;

/**
 * Vrsta polja za Evklidovo tipkovnico: null (ostane telefonova), "num" (samo 123) ali "text".
 * el je element ali podoben predmet (tagName, type, getAttribute, hasAttribute, closest, isContentEditable).
 * inputmode: izvirni inputmode (preden ga tipkovnica nastavi na »none«).
 */
export function fieldKind(el, inputmode = el?.getAttribute?.("inputmode")) {
  if (!el || el.disabled || el.readOnly) return null;
  if (el.hasAttribute?.("data-system-kb") || el.closest?.("[data-system-kb]")) return null;
  const tag = String(el.tagName || "").toUpperCase();
  const auto = String(el.getAttribute?.("autocomplete") || "").toLowerCase();
  if (LOGIN.test(auto)) return null;
  if (tag === "TEXTAREA") return "text";
  if (tag === "INPUT") {
    const type = String(el.type || el.getAttribute?.("type") || "text").toLowerCase();
    if (NO_KB_TYPES.has(type)) return null;
    if ((type === "email" || /\bemail\b/.test(auto)) && hasPassword(el)) return null;
    if (NUM_TYPES.has(type) || NUM_MODES.has(String(inputmode || "").toLowerCase())) return "num";
    return "text";
  }
  if (el.isContentEditable) return "text";
  return null;
}

/** Ali polje dobi našo tipkovnico pri nastavitvi mode (always | math | never); math: polje za matematiko. */
export function usesOwnKeyboard(el, mode = "always", { math = false, inputmode } = {}) {
  const kind = fieldKind(el, inputmode);
  if (!kind || mode === "never") return false;
  if (mode === "math") return math || kind === "num";
  return true;
}

// ---------- vstavljanje predloge ----------
/**
 * Vstavi predlogo v besedilo: »@« je mesto kazalca, tja gre označeno besedilo (označiš 16, pritisneš √ → √(16)).
 * Vrne { value, caret, text } (text = vstavljeni del).
 */
// Zapisi za ljudi (j, 2. 11.: »Vmesni koraki« so izpisali abs(abs(…)) namesto |x|). Kalkulator in skener
// (configureKeyboard … parsed: true) dobita zapis, ki ga razčleni math.js; |x| razume tudi ta.
const PRETTY_ALWAYS = { "abs(@)": "|@|" };
const PRETTY_TEXT = {
  "floor(@)": "⌊@⌋",
  "ceil(@)": "⌈@⌉",
  "stdev(@)": "σ(@)",
  "total(@)": "Σ(@)",
  "root(@;)": "@√()",
  "logb(@;)": "log_@()",
  "gcd(@;)": "D(@; )",
  "lcm(@;)": "v(@; )",
};
/** Kaj vstavi tipka: v poljih, ki jih bere človek ali inštruktor, matematični zapis namesto imena funkcije. */
export function prettyIns(ins, parsed = false) {
  return PRETTY_ALWAYS[ins] ?? (parsed ? ins : PRETTY_TEXT[ins] ?? ins);
}

export function applyTemplate(value, start, end, ins, maxLength = -1, literal = false) {
  const v = String(value ?? "");
  const s = Math.max(0, Math.min(start ?? v.length, v.length));
  const e = Math.max(s, Math.min(end ?? s, v.length));
  const sel = v.slice(s, e);
  const at = literal ? -1 : ins.indexOf("@"); // literal: »@« je znak (e-pošta, prilepljena povezava), ne mesto kazalca
  let text = at < 0 ? ins : ins.slice(0, at) + sel + ins.slice(at + 1);
  if (maxLength >= 0) {
    const room = maxLength - (v.length - (e - s));
    if (room <= 0) return { value: v, caret: e, text: "" };
    if (text.length > room) text = text.slice(0, room);
  }
  const caret = at < 0 ? s + text.length : Math.min(s + at + sel.length, s + text.length);
  return { value: v.slice(0, s) + text + v.slice(e), caret, text };
}

/** Briši pred kazalcem (cel znak, tudi par nadomestnih znakov) ali označeno besedilo. */
export function deleteBack(value, start, end) {
  const v = String(value ?? "");
  if (end > start) return { value: v.slice(0, start) + v.slice(end), caret: start };
  if (start <= 0) return { value: v, caret: 0 };
  const before = [...v.slice(0, start)];
  before.pop();
  const s = before.join("");
  return { value: s + v.slice(start), caret: s.length };
}

/** Pomik kazalca za en znak (cel znak). */
export function stepCaret(value, pos, dir) {
  const v = String(value ?? "");
  if (dir < 0) return pos <= 0 ? 0 : pos - (/[\uDC00-\uDFFF]/.test(v[pos - 1]) && pos > 1 ? 2 : 1);
  return pos >= v.length ? v.length : pos + (/[\uD800-\uDBFF]/.test(v[pos]) ? 2 : 1);
}

/** Enota pri nalogi: zamenja prejšnjo enoto na koncu odgovora (»12 m« + km/h → »12 km/h«). */
export function withUnit(value, unit) {
  return String(value ?? "").replace(/\s+[^\d\s,./−-][^\s]*$/, "").trimEnd() + " " + unit;
}

// ---------- nastavitve naprave ----------
export const PREF_KEY = "evklid.tipkovnica";
export const MODES = ["always", "math", "never"];
export const DEFAULT_PREFS = { mode: "always", words: false, buzz: true, glide: true };
export function parsePrefs(raw) {
  let p = {};
  try {
    p = JSON.parse(raw || "{}") || {};
  } catch {}
  return {
    mode: MODES.includes(p.mode) ? p.mode : DEFAULT_PREFS.mode,
    words: typeof p.words === "boolean" ? p.words : DEFAULT_PREFS.words,
    buzz: typeof p.buzz === "boolean" ? p.buzz : DEFAULT_PREFS.buzz,
    glide: typeof p.glide === "boolean" ? p.glide : DEFAULT_PREFS.glide,
  };
}

/** Predlogi besed: do n besed iz seznama, ki se začnejo z začetkom besede (velika začetnica ostane). */
export function suggest(words, prefix, n = 3) {
  if (!words?.length || !prefix) return [];
  const low = prefix.toLocaleLowerCase();
  const out = [];
  for (const w of words) {
    if (w.length > low.length && w.toLocaleLowerCase().startsWith(low) && !out.includes(w)) out.push(prefix[0] !== low[0] ? w[0].toLocaleUpperCase() + w.slice(1) : w);
    if (out.length >= n) break;
  }
  return out;
}

// ---------- črke kot Gboard (j, 3. 11.: »po funkcionalnosti enak g-boardu«) ----------
// Zgornja vrsta: dolg pritisk da številko (namig v kotu tipke), nato različice črke.
const DIGITS = "1234567890";
/** Številka za tipko v zgornji vrsti (prvih deset tipk) ali "". */
export const digitFor = (rows, c) => {
  const i = rows?.[0]?.indexOf(c) ?? -1;
  return i >= 0 && i < DIGITS.length ? DIGITS[i] : "";
};

/** Velika začetnica: na začetku polja, po . ! ? … in presledku ali v novi vrstici. */
export function autoCapNeeded(before) {
  const b = String(before ?? "");
  return !b.trim() || /[.!?…]\s+$/u.test(b) || /\n\s*$/.test(b);
}

/** Dva presledka za besedo ali številko = pika in presledek (kot Gboard). Vrne položaj prvega presledka ali -1. */
export function doubleSpaceAt(before) {
  return /[\p{L}\p{N})] $/u.test(String(before ?? "")) ? String(before).length - 1 : -1;
}

/** Začetek n-te besede nazaj od pos (poteg levo po ⌫ označi besede). */
export function wordsBack(value, pos, n = 1) {
  const v = String(value ?? "");
  let p = Math.max(0, Math.min(pos, v.length));
  for (let k = 0; k < n && p > 0; k++) {
    while (p > 0 && /\s/u.test(v[p - 1])) p--;
    while (p > 0 && !/\s/u.test(v[p - 1])) p--;
  }
  return p;
}

/** Začetek povedi pred kazalcem (troklik na ⌫): za zadnjim ».«, »!«, »?« ali »…« s presledkom ali za novo vrstico. */
export function sentenceBack(value, pos) {
  const v = String(value ?? "");
  let p = Math.max(0, Math.min(pos, v.length));
  while (p > 0 && /[ \t]/u.test(v[p - 1])) p--; // presledki tik pred kazalcem gredo s povedjo
  while (p > 0 && /[.!?…]/u.test(v[p - 1])) p--; // ločilo konca te povedi
  while (p > 0) {
    const c = v[p - 1];
    if (c === "\n" || (/\s/u.test(c) && p > 1 && /[.!?…]/u.test(v[p - 2]))) break;
    p--;
  }
  return p;
}

// Samopopravek (le s predlogi besed): seznam je majhen, zato popravimo samo varne tipkarske napake —
// manjkajoče strešice (resitev → rešitev) in zamenjani sosednji črki (enacba ← enčaba ni, a »koilko« → »koliko«).
const FOLD = { č: "c", ć: "c", š: "s", ž: "z", đ: "d" };
const fold = (w) => [...w].map((ch) => FOLD[ch] || ch).join("");
function swapped(a, b) {
  if (a.length !== b.length) return false;
  const d = [];
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d.push(i);
  return d.length === 2 && d[1] === d[0] + 1 && a[d[0]] === b[d[1]] && a[d[1]] === b[d[0]];
}
/** Popravek besede ali null. words: seznam po pogostosti. Velika začetnica ostane. */
export function autocorrect(word, words) {
  const w = String(word ?? "");
  if (!words?.length || w.length < 3 || !/^[\p{L}]+$/u.test(w)) return null;
  const low = w.toLocaleLowerCase();
  if (low !== w && low.slice(1) !== w.slice(1)) return null; // KRATICE ostanejo
  const set = new Set(words.map((x) => x.toLocaleLowerCase()));
  if (set.has(low)) return null;
  const f = fold(low);
  const hit = words.find((x) => {
    const xl = x.toLocaleLowerCase();
    return xl.length === low.length && ((fold(xl) === f && f === low) || swapped(xl, low));
  });
  if (!hit) return null;
  return w[0] !== low[0] ? hit[0].toLocaleUpperCase() + hit.slice(1) : hit;
}

// ---------- drsenje po črkah (glide, kot Gboard) ----------
// Tipka za črko: črka sama, sicer osnovna črka (č → c, če je v razporeditvi ni ali jo ima le kot različico).
const baseKey = (c, centers) => {
  if (centers[c]) return c;
  const b = FOLD[c] || c.normalize("NFD").replace(/\p{M}/gu, "");
  return centers[b] ? b : null;
};
function resample(pts, n) {
  if (pts.length === 1) return Array.from({ length: n }, () => pts[0]);
  let total = 0;
  const seg = [0];
  for (let i = 1; i < pts.length; i++) seg.push((total += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y)));
  if (total < 1e-6) return Array.from({ length: n }, () => pts[0]);
  const out = [];
  let j = 1;
  for (let k = 0; k < n; k++) {
    const d = (total * k) / (n - 1);
    while (j < pts.length - 1 && seg[j] < d) j++;
    const span = seg[j] - seg[j - 1] || 1;
    const u = Math.min(1, Math.max(0, (d - seg[j - 1]) / span));
    out.push({ x: pts[j - 1].x + (pts[j].x - pts[j - 1].x) * u, y: pts[j - 1].y + (pts[j].y - pts[j - 1].y) * u });
  }
  return out;
}
function normalised(p) {
  const cx = p.reduce((s, q) => s + q.x, 0) / p.length;
  const cy = p.reduce((s, q) => s + q.y, 0) / p.length;
  const r = Math.sqrt(p.reduce((s, q) => s + (q.x - cx) ** 2 + (q.y - cy) ** 2, 0) / p.length) || 1;
  return p.map((q) => ({ x: (q.x - cx) / r, y: (q.y - cy) / r }));
}
const meanDist = (a, b) => a.reduce((s, q, i) => s + Math.hypot(q.x - b[i].x, q.y - b[i].y), 0) / a.length;

/**
 * Drsenje po črkah: do n najboljših besed za pot prsta.
 * points: [{x, y}] (ali [x, y]); keyCenters: { črka: {x, y} }; words: seznam po pogostosti.
 * opts: n (3), keyW (širina tipke; sicer ocena), radius (v širinah tipke: kako blizu mora biti prvi/zadnji znak).
 * Beseda se začne pri tipki blizu prve točke in konča blizu zadnje; idealna pot skozi središča tipk
 * (podvojene črke se strnejo) se primerja z narisano: povprečna razdalja točk + oblika + pokritost črk + majhna prednost pogostih besed.
 */
export function glideDecode(points, keyCenters, words, { n = 3, keyW, radius } = {}) {
  const pts = (points || []).map((p) => (Array.isArray(p) ? { x: p[0], y: p[1] } : p));
  if (pts.length < 2 || !words?.length) return [];
  const centers = {};
  for (const [c, p] of Object.entries(keyCenters || {})) centers[c] = Array.isArray(p) ? { x: p[0], y: p[1] } : p;
  const chars = Object.keys(centers);
  if (chars.length < 2) return [];
  if (!keyW) {
    const nn = chars.map((a) => Math.min(...chars.filter((b) => b !== a).map((b) => Math.hypot(centers[a].x - centers[b].x, centers[a].y - centers[b].y))));
    keyW = nn.sort((a, b) => a - b)[nn.length >> 1] || 40;
  }
  const rad = (radius || 1.4) * keyW;
  const first = pts[0];
  const last = pts[pts.length - 1];
  const near = (c, p) => Math.hypot(centers[c].x - p.x, centers[c].y - p.y) <= rad;
  const fk = new Set(chars.filter((c) => near(c, first)));
  const lk = new Set(chars.filter((c) => near(c, last)));
  if (!fk.size || !lk.size) return [];
  const N = 32;
  const user = resample(pts, N);
  const userShape = normalised(user);
  const scored = [];
  const seen = new Set();
  for (let rank = 0; rank < words.length; rank++) {
    const w = words[rank];
    if (w.length < 2) continue;
    const low = w.toLocaleLowerCase();
    const a = baseKey(low[0], centers);
    const z = baseKey(low[low.length - 1], centers);
    if (!a || !z || !fk.has(a) || !lk.has(z) || seen.has(low)) continue;
    const ks = [];
    let ok = true;
    for (const ch of low) {
      const k = baseKey(ch, centers);
      if (!k) {
        ok = false;
        break;
      }
      if (ks[ks.length - 1] !== k) ks.push(k);
    }
    if (!ok) continue;
    seen.add(low);
    const ideal = resample(ks.map((k) => centers[k]), N);
    const loc = meanDist(user, ideal) / keyW;
    const shape = meanDist(userShape, normalised(ideal));
    const uniq = [...new Set(ks)];
    let cover = 0;
    for (const k of uniq) cover += Math.min(...user.map((q) => Math.hypot(q.x - centers[k].x, q.y - centers[k].y))) / keyW;
    cover /= uniq.length;
    scored.push({ w, s: loc + 0.5 * shape + 0.3 * cover + 0.05 * Math.log10(rank + 1) });
  }
  return scored.sort((x, y) => x.s - y.s).slice(0, n).map((x) => x.w);
}

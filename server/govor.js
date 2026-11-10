// Besedilo lekcije (Markdown + LaTeX) → slovensko besedilo za branje na glas (zvočni povzetek).
// Brskalnik ga prebere s slovenskim glasom (speechSynthesis), strežnik nič ne stane.
// Formule beremo, kot jih prebere učitelj: »I je enako U deljeno z R«, »v nič«, »deset na minus tri«.

// Enote: [ednina, dvojina, 3–4, 5 in več, rodilnik ednine (decimalno število), tožilnik ednine (»na sekundo«)].
const UNITS = {
  m: ["meter", "metra", "metri", "metrov", "metra", "meter"],
  cm: ["centimeter", "centimetra", "centimetri", "centimetrov", "centimetra", "centimeter"],
  mm: ["milimeter", "milimetra", "milimetri", "milimetrov", "milimetra", "milimeter"],
  km: ["kilometer", "kilometra", "kilometri", "kilometrov", "kilometra", "kilometer"],
  s: ["sekunda", "sekundi", "sekunde", "sekund", "sekunde", "sekundo"],
  min: ["minuta", "minuti", "minute", "minut", "minute", "minuto"],
  h: ["ura", "uri", "ure", "ur", "ure", "uro"],
  g: ["gram", "grama", "grami", "gramov", "grama", "gram"],
  kg: ["kilogram", "kilograma", "kilogrami", "kilogramov", "kilograma", "kilogram"],
  mg: ["miligram", "miligrama", "miligrami", "miligramov", "miligrama", "miligram"],
  N: ["njuton", "njutona", "njutoni", "njutonov", "njutona", "njuton"],
  J: ["džul", "džula", "džuli", "džulov", "džula", "džul"],
  kJ: ["kilodžul", "kilodžula", "kilodžuli", "kilodžulov", "kilodžula", "kilodžul"],
  W: ["vat", "vata", "vati", "vatov", "vata", "vat"],
  kW: ["kilovat", "kilovata", "kilovati", "kilovatov", "kilovata", "kilovat"],
  kWh: ["kilovatna ura", "kilovatni uri", "kilovatne ure", "kilovatnih ur", "kilovatne ure", "kilovatno uro"],
  V: ["volt", "volta", "volti", "voltov", "volta", "volt"],
  kV: ["kilovolt", "kilovolta", "kilovolti", "kilovoltov", "kilovolta", "kilovolt"],
  A: ["amper", "ampera", "amperi", "amperov", "ampera", "amper"],
  mA: ["miliamper", "miliampera", "miliamperi", "miliamperov", "miliampera", "miliamper"],
  "Ω": ["ohm", "ohma", "ohmi", "ohmov", "ohma", "ohm"],
  "kΩ": ["kiloohm", "kiloohma", "kiloohmi", "kiloohmov", "kiloohma", "kiloohm"],
  Pa: ["paskal", "paskala", "paskali", "paskalov", "paskala", "paskal"],
  kPa: ["kilopaskal", "kilopaskala", "kilopaskali", "kilopaskalov", "kilopaskala", "kilopaskal"],
  Hz: ["herc", "herca", "herci", "hercev", "herca", "herc"],
  K: ["kelvin", "kelvina", "kelvini", "kelvinov", "kelvina", "kelvin"],
  C: ["kulon", "kulona", "kuloni", "kulonov", "kulona", "kulon"],
  mol: ["mol", "mola", "moli", "molov", "mola", "mol"],
  L: ["liter", "litra", "litri", "litrov", "litra", "liter"],
  l: ["liter", "litra", "litri", "litrov", "litra", "liter"],
  mL: ["mililiter", "mililitra", "mililitri", "mililitrov", "mililitra", "mililiter"],
  ml: ["mililiter", "mililitra", "mililitri", "mililitrov", "mililitra", "mililiter"],
  "°C": ["stopinja Celzija", "stopinji Celzija", "stopinje Celzija", "stopinj Celzija", "stopinje Celzija", "stopinjo Celzija"],
  "°": ["stopinja", "stopinji", "stopinje", "stopinj", "stopinje", "stopinjo"],
  "%": ["odstotek", "odstotka", "odstotki", "odstotkov", "odstotka", "odstotek"],
};

// Imena grških črk, kot jih beremo.
const GREEK = {
  alpha: "alfa", beta: "beta", gamma: "gama", delta: "delta", Delta: "delta", varepsilon: "epsilon", epsilon: "epsilon",
  eta: "eta", theta: "theta", varphi: "fi", phi: "fi", lambda: "lambda", mu: "mi", nu: "ni", pi: "pi", rho: "ro",
  sigma: "sigma", Sigma: "vsota", tau: "tau", omega: "omega", Omega: "ohm",
  fnod: "od", // I(U) → »I od U« (glej speakTex)
  absv: "absolutna vrednost", // |x| (glej speakTex)
};

// Predlog z/s: s pred nezvenečimi soglasniki (p, f, t, s, š, c, č, k, h), sicer z (SP 2001).
const S_LETTER = /^[pftsšcčkh]/i;
const S_NAME = new Set(["c", "č", "h", "k", "p", "t", "š"]); // imena črk se začnejo z nezvenečim soglasnikom (ce, ha, ka …)
const S_DIGIT = [false, false, false, true, true, true, true, true, false, false]; // nič, ena, dva, tri, štiri, pet, šest, sedem, osem, devet
function startsVoiceless(word) {
  const w = String(word || "").trim();
  const num = /^(\d+)/.exec(w);
  if (num) {
    const d = num[1].replace(/^0+(?=\d)/, "");
    const n = d.length;
    if (n === 1) return S_DIGIT[+d];
    // 11–19: enajst, dvanajst, trinajst …; 21–99: najprej enice (petindvajset), sicer desetice (trideset).
    if (n === 2) return d[0] === "1" ? d !== "10" && S_DIGIT[+d[1]] : d[1] !== "0" ? S_DIGIT[+d[1]] : S_DIGIT[+d[0]];
    if (n === 3 || n === 4) return d[0] === "1" ? true : S_DIGIT[+d[0]]; // sto, tisoč; dvesto, tristo …
    return false;
  }
  const first = w.split(/\s+/)[0] || "";
  if (first.length === 1) return S_NAME.has(first.toLowerCase());
  return S_LETTER.test(first);
}
export const zs = (next) => (startsVoiceless(next) ? "s" : "z");

// Oblika enote ob številu: 1 meter, 2 metra, 3 metri, 5 metrov, 2,5 metra.
function unitWord(sym, number) {
  const f = UNITS[sym];
  if (!f) return null;
  if (number == null) return f[0];
  const s = String(number).replace(/\s/g, "");
  if (/[,.]/.test(s)) return f[4];
  const n = Math.abs(parseInt(s, 10));
  if (!Number.isFinite(n)) return f[3];
  const r = n % 100;
  if (r === 1) return f[0];
  if (r === 2) return f[1];
  if (r === 3 || r === 4) return f[2];
  return f[3];
}

// Sestavljena enota (m/s, km/h, g/mol, m^2): »metrov na sekundo«.
function compoundUnit(u, number) {
  const clean = u.replace(/\s+/g, "");
  const pow = /^([a-zA-ZΩ°%]+)\^?([23])$/.exec(clean);
  if (pow && UNITS[pow[1]]) {
    const base = unitWord(pow[1], number);
    return pow[1] === "m" || pow[1] === "cm" || pow[1] === "mm" || pow[1] === "km"
      ? `${pow[2] === "2" ? "kvadratn" : "kubičn"}${ending(base)} ${base}`
      : `${base} na ${pow[2] === "2" ? "kvadrat" : "kub"}`;
  }
  const parts = clean.split("/");
  if (parts.length === 2 && UNITS[parts[0]] && UNITS[parts[1]]) return `${unitWord(parts[0], number)} na ${UNITS[parts[1]][5]}`;
  return unitWord(clean, number);
}
// Pridevnik ob enoti: kvadratni meter, kvadratna metra, kvadratni metri, kvadratnih metrov.
function ending(word) {
  if (/ov$/.test(word)) return "ih";
  if (/a$/.test(word)) return "a";
  return "i";
}

// Vsebina prvega para zavitih oklepajev od mesta i (vrne [vsebina, indeks za zaklepajem]).
function group(s, i) {
  while (s[i] === " ") i++;
  if (s[i] !== "{") {
    if (s[i] === "\\") {
      const m = /^\\[a-zA-Z]+/.exec(s.slice(i));
      if (m) return [m[0], i + m[0].length];
    }
    return [s[i] || "", i + 1];
  }
  let depth = 0;
  for (let j = i; j < s.length; j++) {
    if (s[j] === "{") depth++;
    else if (s[j] === "}" && --depth === 0) return [s.slice(i + 1, j), j + 1];
  }
  return [s.slice(i + 1), s.length];
}

// Ulomki z besedo: ena polovica, dve tretjini, tri četrtine, pet šestin.
const NUM = ["", "ena", "dve", "tri", "štiri", "pet", "šest", "sedem", "osem", "devet"];
const DEN = { 2: "polovic", 3: "tretjin", 4: "četrtin", 5: "petin", 6: "šestin", 7: "sedmin", 8: "osmin", 9: "devetin", 10: "desetin" };
function fractionWords(n, d) {
  const end = n === 1 ? "a" : n === 2 ? "i" : n <= 4 ? "e" : "";
  return `${NUM[n]} ${DEN[d]}${end}`;
}

const POWERS = { 2: "na kvadrat", 3: "na kub" };

/** LaTeX izraz (brez $) → slovensko branje. */
export function speakTex(tex) {
  let s = String(tex || "");
  // enote: \ \mathrm{V}, \,\text{m/s}
  s = s.replace(/\\(?:left|right|displaystyle|,|;|:|!|quad|qquad)(?![a-zA-Z])/g, " ").replace(/\\ /g, " ");
  // zapis decimalke {,}
  s = s.replace(/\{,\}/g, ",");
  // absolutna vrednost: |x| → »absolutna vrednost x« (sicer bi se brala kot x)
  s = s.replace(/\|([^|]+)\|/g, " \\absv $1 ");
  // funkcija ene spremenljivke: I(U) → I od U
  s = s.replace(/([a-zA-Z])\(([a-zA-Z])\)/g, "$1 \\fnod $2");
  // stopinje: 20^{\circ}\mathrm{C} → 20 °C
  s = s.replace(/\^\s*\{?\s*\\circ\s*\}?\s*(?:\\(?:mathrm|text)\{C\}|C(?![a-zA-Z]))/g, "°C").replace(/\^\s*\{?\s*\\circ\s*\}?/g, "°");
  return expr(s).replace(/\s+/g, " ").trim();
}

function expr(s) {
  let out = "";
  let i = 0;
  let lastNumber = null; // zadnje število (za obliko enote)
  const push = (w) => {
    out += ` ${w} `;
  };
  while (i < s.length) {
    const rest = s.slice(i);
    let m;
    if ((m = /^\\(?:d|t)?frac/.exec(rest))) {
      const [a, j] = group(s, i + m[0].length);
      const [b, k] = group(s, j);
      // Preprost ulomek: \frac{4}{3} → »štiri tretjine«.
      if (/^[1-9]$/.test(a.trim()) && /^(?:[2-9]|10)$/.test(b.trim())) {
        push(fractionWords(+a.trim(), +b.trim()));
        i = k;
        lastNumber = null;
        continue;
      }
      const sb = expr(b).trim().replace(/^(?:(tretji|\d+\.) )?koren iz/, (_, n) => `${n === "tretji" ? "tretjim " : n ? `${n} ` : ""}korenom iz`); // »deljeno s korenom iz b«
      push(`${expr(a)} deljeno ${zs(sb)} ${sb}`);
      i = k;
      lastNumber = null;
      continue;
    }
    if ((m = /^\\sqrt(?:\[(\d)\])?/.exec(rest))) {
      const [a, j] = group(s, i + m[0].length);
      push(`${m[1] === "3" ? "tretji koren iz" : m[1] ? `${m[1]}. koren iz` : "koren iz"} ${expr(a)}`);
      i = j;
      continue;
    }
    if ((m = /^\\(?:mathrm|text|textrm|mathit|operatorname|mathbf|boldsymbol|vec|overline|bar)/.exec(rest))) {
      const [a, j] = group(s, i + m[0].length);
      const sym = a.replace(/\\Omega/g, "Ω").replace(/\\%/g, "%").replace(/\^\{?(\d)\}?/, "^$1");
      // Brez števila pred njim je en sam velik znak simbol (kemijski element C, O, H), ne enota.
      const unit = lastNumber == null && /^[A-Z]$/.test(sym.trim()) ? null : compoundUnit(sym, lastNumber);
      push(unit && /^(?:mathrm|text)/.test(m[0].slice(1)) ? unit : expr(a));
      i = j;
      lastNumber = null;
      continue;
    }
    if ((m = /^\^/.exec(rest))) {
      const [a, j] = group(s, i + 1);
      if (a === "\\circ") push(lastNumber != null ? unitWord("°", lastNumber) : "stopinj");
      else if (POWERS[a]) push(POWERS[a]);
      else push(`na ${expr(a)}`);
      i = j;
      lastNumber = null;
      continue;
    }
    if ((m = /^_/.exec(rest))) {
      const [a, j] = group(s, i + 1);
      push(a === "0" ? "nič" : expr(a));
      i = j;
      continue;
    }
    if ((m = /^\\(cdot|times)(?![a-zA-Z])/.exec(rest))) { push("krat"); i += m[0].length; lastNumber = null; continue; }
    if ((m = /^\\(approx)(?![a-zA-Z])/.exec(rest))) { push("je približno"); i += m[0].length; lastNumber = null; continue; }
    if ((m = /^\\(neq|ne)(?![a-zA-Z])/.exec(rest))) { push("ni enako"); i += m[0].length; lastNumber = null; continue; }
    if ((m = /^\\(le|leq)(?![a-zA-Z])/.exec(rest))) { push("je manjše ali enako"); i += m[0].length; continue; }
    if ((m = /^\\(ge|geq)(?![a-zA-Z])/.exec(rest))) { push("je večje ali enako"); i += m[0].length; continue; }
    if ((m = /^\\(Rightarrow|implies|to|rightarrow|longrightarrow)(?![a-zA-Z])/.exec(rest))) { push(m[1] === "to" || m[1] === "rightarrow" || m[1] === "longrightarrow" ? "v" : "torej"); i += m[0].length; continue; }
    if ((m = /^\\(pm)(?![a-zA-Z])/.exec(rest))) { push("plus minus"); i += m[0].length; continue; }
    if ((m = /^\\(sin|cos|tan|log|ln)(?![a-zA-Z])/.exec(rest))) { push({ sin: "sinus", cos: "kosinus", tan: "tangens", log: "logaritem", ln: "naravni logaritem" }[m[1]]); i += m[0].length; continue; }
    if ((m = /^\\(Omega)(?![a-zA-Z])/.exec(rest))) { push(lastNumber != null ? unitWord("Ω", lastNumber) : "ohm"); i += m[0].length; lastNumber = null; continue; }
    if ((m = /^\\%/.exec(rest))) { push(unitWord("%", lastNumber) || "odstotkov"); i += 2; lastNumber = null; continue; }
    if ((m = /^\\([a-zA-Z]+)/.exec(rest))) { push(GREEK[m[1]] || ""); i += m[0].length; continue; }
    if ((m = /^\d+(?:[.,]\d+)?/.exec(rest))) { push(m[0].replace(".", ",")); lastNumber = m[0]; i += m[0].length; continue; }
    const c = s[i];
    if (c === "=") { push("je enako"); lastNumber = null; }
    else if (c === "+") push("plus");
    else if (c === "-" || c === "−") push("minus");
    else if (c === "<") push("je manjše od");
    else if (c === ">") push("je večje od");
    else if (c === ":" || c === "/") { const nx = expr(s.slice(i + 1).match(/^\s*[^\s+\-=]+/)?.[0] || ""); push(`deljeno ${zs(nx)}`); }
    else if (c === "(" || c === ")" || c === "{" || c === "}" || c === "&" || c === "\\") push(" ");
    else if (c === "%") push(unitWord("%", lastNumber) || "odstotkov");
    else if (/[a-zA-ZΩ°]/.test(c)) {
      // enota za številom brez \mathrm (npr. 5 m) ali spremenljivka
      const word = /^[a-zA-ZΩ°]+(?:\/[a-zA-Z]+)?/.exec(rest)[0];
      if (lastNumber != null && (UNITS[word] || compoundUnit(word, lastNumber))) {
        push(compoundUnit(word, lastNumber));
        i += word.length;
        lastNumber = null;
        continue;
      }
      push(c);
    } else if (c !== " ") push(c);
    if (c !== " ") lastNumber = /\d/.test(c) ? lastNumber : c === "=" ? null : lastNumber;
    i++;
  }
  return out;
}

/** Markdown z $…$ → besedilo za branje (brez oznak, formule izgovorjene). */
export function speakMarkdown(md) {
  return String(md || "")
    .replace(/^[ \t]*:::[ \t]*risba[^\n]*\n([\s\S]*?)\n[ \t]*:::[ \t]*$/gm, (_, b) => /^\s*opis\s*:\s*(.+)$/im.exec(b)?.[1] || "")
    .replace(/^[ \t]*:::[ \t]*(formula|premisli)[ \t]*\n([\s\S]*?)\n[ \t]*:::[ \t]*$/gm, "$2")
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, t) => ` ${speakTex(t)}. `)
    .replace(/\$([^$\n]+?)\$/g, (_, t) => speakTex(t))
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<\/?[a-z][^>\n]*>/gi, "") // HTML v lekcijah (npr. <code>)
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&nbsp;/g, " ")
    .replace(/^[ \t]*(?:#+|>)[ \t]*/gm, "") // naslovi in citati samo na začetku vrstice; »a > b« ostane
    .replace(/[*_`|]/g, "")
    .replace(/^\s*[-+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/[ \t]+/g, " ")
    .replace(/ +([,.;:!?])/g, "$1")
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => (/[.!?:]$/.test(l) ? l : `${l}.`))
    .join("\n");
}

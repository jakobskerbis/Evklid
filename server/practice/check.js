// Preverjanje odgovorov: števila (z zaokroževanjem in enotami), ulomki in razmerja,
// izbira, koeficienti kemijskih enačb.

// ---------- pomožno ----------

export function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

// Zaokroževanje, kot ga učijo v šoli: števka 0–4 navzdol, 5–9 navzgor.
export function roundHalfUp(x, d) {
  const f = 10 ** d;
  const sign = x < 0 ? -1 : 1;
  return (sign * Math.round(Math.abs(x) * f + 1e-9)) / f;
}

// Slovenski zapis števila: decimalna vejica.
export function fmt(x, d = null) {
  let s = d === null ? String(Number(x.toFixed(10))) : roundHalfUp(x, d).toFixed(d);
  return s.replace("-", "−").replace(".", ",");
}

const SUP = { "²": "2", "³": "3" };
// Enota brez presledkov in potenc, velike in male črke ostanejo (m = mili, M = mega).
function unitForm(u) {
  return String(u || "")
    .replace(/[²³]/g, (c) => SUP[c])
    .replace(/\^/g, "")
    .replace(/\s+/g, "")
    .replace(/\*|·/g, "")
    .replace(/^stopinj[ae]?$|^°$/i, "°")
    .replace(/kmh$/i, "km/h");
}
export function normUnit(u) {
  return unitForm(u).toLowerCase();
}

// Ista enota? Velikost črke večinoma ne spremeni pomena (l/L, °C/°c, km/h/Km/h, Hz/hz, M/S, Min, Mol),
// pri m/M kot predponi pa ga: ms ≠ Ms, mA ≠ MA, mJ ≠ MJ, mm ≠ Mm (razlika je milijardo-krat).
// Predpona je m/M, ki mu sledi črka in ni začetek »min« ali »mol«; sam m (»M/S«, »M2«, »DM3«) je meter.
export function sameUnit(a, b) {
  const x = unitForm(a);
  const y = unitForm(b);
  if (x === y) return true;
  if (x.toLowerCase() !== y.toLowerCase() || x.length !== y.length) return false;
  for (let i = 0; i < x.length; i++) {
    if (x[i] === y[i] || !/m/i.test(x[i])) continue;
    const rest = x.slice(i).toLowerCase();
    if (!/^\p{L}/u.test(rest.slice(1)) || /^m(?:in|ol)(?!\p{L})/u.test(rest)) continue;
    // Razlika m/M šteje le, če se preostanek enote ujema tudi v velikosti črk (mJ/MJ, mm/Mm).
    // »MM«, »MG«, »mhz«: učenec ne pazi na velikost črk, zato zapis sprejmemo.
    if (x.slice(0, i) + x.slice(i + 1) === y.slice(0, i) + y.slice(i + 1)) return false;
  }
  return true;
}

// Arabske in perzijske števke (٢٫٥, ۲٫۵) → 0–9, arabsko decimalno ločilo ٫ in vejica ، → vejica,
// arabsko ločilo tisočic ٬ (٢٬٥٠٠) → presledek.
export function westernDigits(s) {
  return String(s)
    .replace(/[\u0660-\u0669]/g, (c) => String(c.charCodeAt(0) - 0x0660))
    .replace(/[\u06f0-\u06f9]/g, (c) => String(c.charCodeAt(0) - 0x06f0))
    .replace(/[\u066b\u060c]/g, ",")
    .replace(/\u066c/g, " ");
}

// Razčleni vnos, npr. "12,5 cm²", "−3", "1 200", "2.5m".
// dot: decimalna pika (angleške izpitne naloge); takrat "0.120" ni 120 s piko za tisočice.
// Skupina tisočic ima natanko 3 števke: "1.1484" je decimalno število, ne 1.148 z enoto "4".
export function parseNumberWithUnit(input, { dot = false } = {}) {
  const s = westernDigits(String(input).trim()).replace(/−/g, "-");
  const m = s.match(/^([+-]?\s*(?:\d{1,3}(?:[ .]\d{3}(?!\d))+|\d+)?(?:[.,]\d+)?)\s*(.*)$/);
  if (!m || !/\d/.test(m[1])) return null;
  let num = m[1].replace(/\s/g, "");
  // "1.200", "-1.200" in "1.200,5" s piko kot ločilom tisočic (natanko 3 števke po vsaki piki).
  // Z vodilno ničlo (»0.500«, »-0.250«) je zapis vedno decimalen: tisočice se ne začnejo z 0.
  if (!dot && /^[+-]?[1-9]\d{0,2}(\.\d{3})+(,\d+)?$/.test(num)) num = num.replace(/\./g, "");
  num = num.replace(",", ".");
  const value = Number(num);
  if (!Number.isFinite(value)) return null;
  const decimals = (num.split(".")[1] || "").length;
  return { value, decimals, unit: m[2].trim() };
}

// ---------- preverjanje ----------

const ROUNDING_RULE =
  "Pri zaokroževanju pogledaš prvo števko za mestom, na katero zaokrožuješ: če je 0, 1, 2, 3 ali 4, zaokrožiš navzdol (števka ostane), če je 5, 6, 7, 8 ali 9, zaokrožiš navzgor (števka se poveča za 1).";

function decimalsWord(d) {
  if (d === 0) return "na celo število";
  if (d === 1) return "na eno decimalko";
  if (d === 2) return "na dve decimalki";
  if (d === 3 || d === 4) return `na ${d} decimalke`;
  return `na ${d} decimalk`;
}

// Znaki za deljenje: »:« (tudi tipka ÷ na Evklidovi tipkovnici vpiše »:«), »÷«, »∶« (znak za razmerje), »/«.
const DIV = /[:÷∶/]/;
const DIV_ALL = /[:÷∶/]/g;

// Ura (»10:30«, »8:05 h«) pri nalogi z enoto časa ni količnik: tak vnos ostane pri običajnem branju števila.
const TIME_UNIT = /^(?:h|min|s|ura|ure|ur|uri)$/i;
function clockLike(ans, s) {
  const m = s.match(/^\d{1,2}:\d{2}(?::\d{2})?\s*(\p{L}*)$/u);
  return !!m && (TIME_UNIT.test(m[1]) || TIME_UNIT.test(normUnit(ans.unit)));
}

// Količnik dveh števil: »5:4«, »5 : 4«, »5÷4«, »5/4«, »2,5 : 0,5«, po želji z enoto (»3/4 m«).
// Vrne { value, unit } ali null (ni natanko en znak za deljenje med dvema številoma, npr. »Odgovor: 5«, »2:3:4«).
function parseQuotient(input, { dot = false } = {}) {
  const s = westernDigits(String(input).trim()).replace(/−/g, "-");
  if ((s.match(DIV_ALL) || []).length !== 1) return null;
  const [l, r] = s.split(DIV).map((x) => x.trim());
  const a = parseNumberWithUnit(l, { dot });
  const b = parseNumberWithUnit(r, { dot });
  // »12:3=4«: zapisan je cel račun, ne količnik (ni ga mogoče preveriti kot količnik).
  if (!a || !b || a.unit || !/^[+-]?\s*\d/.test(r) || b.unit.includes("=")) return null;
  return { value: a.value / b.value, unit: b.unit };
}

// Znanstveni zapis: »2,5·10^3«, »2,5 × 10^(-3) m«, »1,2*10⁻⁴ kg«, »3x10^8 m/s« (tipka ×10ⁿ na tipkovnici).
const SUPER = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9", "⁻": "-", "⁺": "+" };
function parseScientific(input) {
  const s = westernDigits(String(input).trim()).replace(/[−–]/g, "-");
  // Brez dveh zaporednih delov, ki oba sprejmeta presledke (»[+-]?\s*« za »\s*«, »\s*(.*)«): sicer kvadratni čas pri dolgem nizu presledkov.
  const m = s.match(/^((?:[+-]\s*)?\d+(?:[.,]\d+)?)\s*[·*×xX]\s*10\s*(?:\^\s*(?:\(\s*((?:[+-]\s*)?\d+)\s*\)|\{\s*((?:[+-]\s*)?\d+)\s*\}|((?:[+-]\s*)?\d+))|([⁻⁺]?[⁰¹²³⁴⁵⁶⁷⁸⁹]+))(?![\d⁰¹²³⁴⁵⁶⁷⁸⁹])([\s\S]*)$/);
  if (!m) return null;
  const exp = (m[2] ?? m[3] ?? m[4] ?? [...m[5]].map((c) => SUPER[c]).join("")).replace(/\s/g, "");
  const value = Number(`${m[1].replace(/\s/g, "").replace(",", ".")}e${exp}`);
  if (!Number.isFinite(value)) return null;
  return { value, decimals: effDecimals(value), unit: m[6].trim() };
}

// Izraz namesto števila (»5√7«, »√(49)«, »3 + 4«): vrednost izraza brez spremenljivk ali null.
// math: { parse, compile } iz public/graph/math.js (strežnik in vaje brez povezave ga podata v opts.math).
const MATH_TAIL = /^(?:[√∛^²³(*·×+\-−/]|π\s*\S|\\?(?:sqrt|root|log|ln|sin|cos|tan)\b)/;
function constNode(n) {
  if (!n || typeof n !== "object") return true;
  if (n.k === "var") return false;
  if (n.k === "const") return n.name === "π" || n.name === "pi" || n.name === "e";
  return Object.values(n).every((v) => (Array.isArray(v) ? v.every(constNode) : typeof v !== "object" || constNode(v)));
}
// Učenčev zapis → besedilo za parse() po istem pravilu kot kalkulatorja (math.numberText): »sin(0,5)« je sin 0,5,
// »1 000« je tisoč, »max(1,5; 2)« ima dve vrednosti. Brez tega je »sin(0,5)« veljal kot sin(0) ali napaka (AUDIT-024).
// dot: naloga z decimalno piko (vejica v oklepaju loči vrednosti).
function studentText(input, math, dot = false) {
  const s = westernDigits(String(input).trim());
  return math.numberText ? math.numberText(s, !dot) : s;
}
// own: false za zapis iz naloge (decimalna pika), ne za učenčev odgovor.
function exprValue(input, math, { own = true, dot = false } = {}) {
  if (!math) return null;
  try {
    const node = math.parse(own ? studentText(input, math, dot) : String(input).trim());
    if (!constNode(node) || node.k === "num" || node.k === "cmp") return null;
    const v = math.compile(node)({});
    return typeof v === "number" && Number.isFinite(v) ? v : null;
  } catch {
    return null;
  }
}

// Je vrednost enaka pravemu rezultatu (točno ali, pri zahtevanem zaokroževanju, zaokroženo enako)?
function sameValue(ans, v) {
  const d = ans.decimals;
  return [ans.value, ...(ans.alsoAccept || [])].some(
    (e) => Math.abs(v - e) <= (ans.tolerance ?? 1e-9) * Math.max(1, Math.abs(e)) || (d !== undefined && d !== null && Math.abs(roundHalfUp(v, d) - roundHalfUp(e, d)) < 1e-9),
  );
}

function checkNumber(ans, input, opts = {}) {
  const s = westernDigits(String(input).trim());
  // Znanstveni zapis je število (prej je »2,5·10^3« veljal kot 2,5 z namigom »1000-krat premajhen«).
  const sci = parseScientific(input);
  if (sci) return checkParsed(ans, sci, opts);
  const q = clockLike(ans, s) ? null : parseQuotient(input, { dot: !!ans.dot });
  if (q) {
    // Količnik je zapisan prav, a število je treba še izračunati (»Izračunaj 5 : 4« z odgovorom »5 : 4« ne velja).
    // Vrsta »format« ne šteje kot napačen poskus.
    if (!Number.isFinite(q.value)) return { kind: "format", code: "chk.divZero", message: "Z 0 ne moreš deliti. Vpiši število." };
    // Enota se preveri kot pri številu (»1/2 kg« pri nalogi v m: namig o enoti, ne »količnik je pravilen«).
    const unit = unitIssue(ans, q.unit);
    if (unit) return unit;
    const exacts = [ans.value, ...(ans.alsoAccept || [])];
    // Pri zahtevanem zaokroževanju je »5/3« prav tudi, kadar je rešitev shranjena že zaokrožena (1,67).
    const d = ans.decimals;
    const same = (e) =>
      Math.abs(q.value - e) <= (ans.tolerance ?? 1e-9) * Math.max(1, Math.abs(e)) ||
      (d !== undefined && d !== null && Math.abs(roundHalfUp(q.value, d) - roundHalfUp(e, d)) < 1e-9);
    if (exacts.some(same)) {
      // Brez zgleda s števili: zgled bi lahko bil ravno rešitev naloge.
      return { kind: "format", code: "chk.quotient", message: "Količnik je zapisan pravilno. Izračunaj ga še do konca in rezultat zapiši kot število." };
    }
    // Obrnjeni količnik (»4 : 5« namesto 5 : 4) in napake iz generatorja dobijo isti namig kot pri številu.
    return { kind: "wrong", ...diagnose(ans, { value: q.value, decimals: 6, unit: "" }) };
  }
  const p = parseNumberWithUnit(input, { dot: !!ans.dot });
  // Izraz namesto enega števila (»5√7«, »√(49)«): prej je »5√7« veljal kot 5 (ostanek je bil kot enota prezrt).
  // Prava vrednost: zapis še ni končan (ne šteje kot poskus); napačna: poskus z razlago, da se išče eno število.
  if (!ans.unit && !ans.dot && (!p || MATH_TAIL.test(p.unit))) {
    const v = exprValue(input, opts.math);
    if (v !== null) {
      // S π je točen zapis pravilen kot pri »2π« (»2π/3«, »π/4«).
      if (/π|\\pi/.test(s) && sameValue(ans, v)) return checkConverted(ans, { value: v, decimals: effDecimals(v), unit: "" });
      if (sameValue(ans, v)) return { kind: "format", code: "chk.calcFully", message: "Vrednost je prava. Izračunaj jo še do konca in vpiši eno samo število." };
      // Tudi brez števila na začetku (»(8)«, »√50«): sicer bi učenec brez poskusov ugibal, dokler ne dobi »Vrednost je prava«.
      return { kind: "wrong", mistake: { code: "chk.expression", params: {}, message: "Naloga sprašuje po enem številu, ti pa si vpisal izraz. Preveri, katero število iščemo, in vpiši samo to število." } };
    }
  }
  if (!p) return { kind: "format", code: "chk.number", message: "Vpiši število (za decimalno ločilo lahko uporabiš vejico ali piko)." };
  // »2:3:4« pri nalogi brez enote: znak za deljenje ni enota (prej je veljalo kot 2).
  if (!ans.unit && /^[:÷∶/]/.test(p.unit)) return { kind: "format", code: "chk.oneNumber", message: "Vpiši eno samo število (za decimalno ločilo lahko uporabiš vejico ali piko)." };
  // »2π cm«, »4\pi«: število krat π, enota ostane (pregled PR 786, G).
  const pi = /^(?:π|\\pi)(?![a-zA-Z])\s*/.exec(p.unit);
  if (pi) {
    const value = p.value * Math.PI;
    Object.assign(p, { value, decimals: effDecimals(value), unit: p.unit.slice(pi[0].length).trim(), pi: true });
  }
  const res = checkParsed(ans, p, opts);
  // »2.500« je lahko 2500 (pika za tisočice) ali 2,5 s piko kot decimalnim ločilom (tipkovnica v
  // angleščini, arabščini, urdujščini). Decimalno branje upoštevamo samo, kadar rezultat res ima tri
  // decimalke (zahtevano zaokroževanje ali točna vrednost, kot 12,345): sicer je »2.500« za 2,5 najverjetneje
  // pozabljena pretvorba enot (2500 m namesto 2,5 km) in učenec dobi namig o velikostnem redu.
  // Pri zaokroževanju na 0 ali 1 decimalko »2.500« skoraj gotovo ni decimalna pika: namig o velikostnem redu.
  // Pri dveh decimalkah je zapis dvoumen (2500 ali 2,500 z decimalko preveč): napačno, a brez namiga, ki bi
  // lahko bil napačen (»izračun je pravilen« z razkritim rezultatom ali »1000-krat prevelik«).
  const dotLike = res.kind !== "correct" && !ans.dot && /^[+-]?[1-9]\d{0,2}\.\d{3}(?!\d)/.test(westernDigits(String(input).trim()).replace(/−/g, "-"));
  if (dotLike && threeDecimals(ans)) {
    const q = parseNumberWithUnit(input, { dot: true });
    const alt = q && checkParsed(ans, q, opts);
    if (alt?.kind === "correct" || alt?.kind === "rounding") return alt;
  } else if (dotLike && ans.decimals === 2 && res.kind === "wrong") {
    const q = parseNumberWithUnit(input, { dot: true });
    const alt = q && checkParsed(ans, q, opts);
    if (alt?.kind === "rounding") return { kind: "wrong" };
  }
  return res;
}

// Število decimalk pretvorjene vrednosti (brez ničel na koncu in brez napake plavajoče vejice).
function effDecimals(x) {
  const s = String(Number(x.toPrecision(12)));
  if (/e-/.test(s)) return Number(s.split("e-")[1]) + ((s.split("e")[0].split(".")[1] || "").length);
  return (s.split(".")[1] || "").length;
}
// Pretvorjen rezultat ali rezultat s π (»2π cm«): pravilen, če se zaokroži na isto kot pravi rezultat
// (pravilo zaokroževanja naloge velja za vrednost v enoti naloge), sicer običajno preverjanje (zaokroževanje, napake).
function checkConverted(ans, q) {
  const exacts = [ans.value, ...(ans.alsoAccept || [])];
  const d = ans.decimals;
  const ok =
    d === undefined || d === null
      ? exacts.some((e) => Math.abs(q.value - e) <= Math.max(ans.tolerance ?? 1e-9, 1e-9) * Math.max(1, Math.abs(e)))
      : exacts.some((e) => Math.abs(roundHalfUp(q.value, d) - roundHalfUp(e, d)) < 1e-9);
  if (ok) return { kind: "correct" };
  return checkParsed({ ...ans, unitAlternatives: [] }, q);
}

// Ima pravilni odgovor lahko tri decimalke? Da, kadar je zahtevano zaokroževanje na vsaj 3 decimalke ali kadar
// točna vrednost potrebuje natanko tri decimalke (12,345, 0,125; ne pa 2,5 ali 2500).
function threeDecimals(ans) {
  if (ans.decimals !== undefined && ans.decimals !== null) return ans.decimals >= 3;
  const whole = (x) => Math.abs(x - Math.round(x)) <= 1e-9 * Math.max(1, Math.abs(x));
  return [ans.value, ...(ans.alsoAccept || [])].some((e) => Number.isFinite(e) && whole(e * 1000) && !whole(e * 100));
}

function unitIssue(ans, unit) {
  if (!ans.unit) return null;
  if (!normUnit(unit)) return { kind: "unit", code: "chk.addUnit", message: `Število je zapisano, dodaj še enoto. V kateri enoti je rezultat?` };
  if (![ans.unit, ...(ans.unitAlternatives || [])].some((u) => sameUnit(u, unit))) {
    // Sporočilo ne imenuje prave enote (j, 17. 11. 2026): enota je del odgovora.
    return { kind: "unit", code: "chk.unit", params: {}, message: "Ta enota ni prava. Preveri, v kateri enoti je rezultat." };
  }
  return null;
}

// ---------- pretvorba enot s predpono (j, 17. 11. 2026: »Sprejmi pravilno pretvorbo«) ----------
// Pravilno pretvorjen rezultat v isti osnovni enoti z drugo predpono SI je pravilen (5,42 N = 5420 mN = 0,00542 kN),
// razen če besedilo naloge zahteva enoto (unitRequired). Le predpone SI na isti osnovi; ² in ³ s pravo potenco
// (cm² = 10⁻⁴ m²); L = dm³, mL = cm³. Ne med različnimi količinami, ne °C ↔ K, ne min/h/s, ne sestavljene enote (m/s).
// »da« (deka): dag = 10 g (250 dag = 2,5 kg).
const SI_PREFIX = { G: 1e9, M: 1e6, k: 1e3, h: 1e2, da: 1e1, d: 1e-1, c: 1e-2, m: 1e-3, µ: 1e-6, μ: 1e-6, u: 1e-6, n: 1e-9, p: 1e-12 };
const SI_BASES = ["mol", "Pa", "Hz", "eV", "Wh", "Bq", "Wb", "bar", "m", "g", "s", "V", "A", "W", "J", "N", "Ω", "C", "F", "T", "L", "l"];
const POW = { "²": 2, "³": 3, 2: 2, 3: 3 };
// Enota → { base, pow, scale } (vrednost v osnovni enoti = vrednost · scale) ali null.
export function siUnit(u) {
  const m = String(u || "").replace(/\s+/g, "").replace(/\^\{?([23])\}?$/, "$1").match(/^(.+?)([²³23])?$/);
  if (!m) return null;
  const body = m[1];
  const pow = m[2] ? POW[m[2]] : 1;
  for (const b of SI_BASES) {
    let pre = null;
    if (body === b) pre = "";
    else if (body.length === b.length + 1 && body.endsWith(b) && SI_PREFIX[body[0]]) pre = body[0];
    else if (body === `da${b}`) pre = "da";
    if (pre === null) continue;
    // Predpone na ² in ³ le pri metru (mm², cm³, dm³, km²); s ni s predpono v potenci.
    if (pow > 1 && b !== "m") return null;
    const f = pre ? SI_PREFIX[pre] : 1;
    if (b === "L" || b === "l") return pow === 1 ? { base: "m", pow: 3, scale: f * 1e-3 } : null;
    return { base: b, pow, scale: f ** pow };
  }
  return null;
}
// Faktor, s katerim se vrednost v enoti »from« pretvori v enoto »to«, ali null (ni ista količina ali ni pretvorbe).
export function unitFactor(from, to) {
  const a = siUnit(from);
  const b = siUnit(to);
  if (!a || !b || a.base !== b.base || a.pow !== b.pow) return null;
  return a.scale / b.scale;
}
// Zahteva besedilo naloge točno to enoto? Previdno: da, če je enota v besedilu za »v«, »na«, »kot«, »in« (angl.),
// »enotah«, »= ?«, »?«, ali v zahtevi »izrazi/zapiši/podaj/pretvori … v«. Številka z enoto (»5 kN«) ni zahteva.
const escRe = (w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export function unitRequired(text, unit) {
  if (!text || !unit) return false;
  const t = String(text).replace(/\\(?:mathrm|text|rm|mbox)\s*\{\s*([^{}]*?)\s*\}/g, "$1").replace(/\\[,;:! ]|~|\$/g, " ").replace(/\^\{?2\}?/g, "²").replace(/\^\{?3\}?/g, "³");
  const forms = new Set([unit, String(unit).replace(/\^\{?2\}?/g, "²").replace(/\^\{?3\}?/g, "³")]);
  return [...forms].some((u) => {
    const U = escRe(u.replace(/\s+/g, " ")).replace(/ /g, "\\s*");
    return new RegExp(`(?:^|[\\s(])(?:v|na|kot|in|enotah?|enoti)\\s+(?:enot[aio]?\\s+)?${U}(?![\\p{L}\\d])|[=?]\\s*\\??\\s*(?:\\\\square|_+|\\.\\.\\.|…)?\\s*${U}(?![\\p{L}\\d])`, "u").test(t);
  });
}

function checkParsed(ans, p, opts = {}) {

  // Enota: pravilno pretvorjen rezultat (druga predpona iste osnove) se pretvori v enoto naloge in preveri naprej.
  let unit = unitIssue(ans, p.unit);
  if (unit && unit.code === "chk.unit" && opts.convert && !unitRequired(opts.text, ans.unit)) {
    const f = unitFactor(p.unit, ans.unit);
    if (f !== null) return checkConverted(ans, { value: p.value * f, decimals: effDecimals(p.value * f), unit: ans.unit, converted: true });
  }
  if (unit) return unit;
  if (p.pi) return checkConverted(ans, { ...p, pi: false });

  const exacts = [ans.value, ...(ans.alsoAccept || [])];
  const d = ans.decimals;

  // Brez zahtevanega zaokroževanja: točen rezultat (z drobno toleranco).
  if (d === undefined || d === null) {
    const ok = exacts.some((e) => Math.abs(p.value - e) <= (ans.tolerance ?? 1e-9) * Math.max(1, Math.abs(e)));
    return ok ? { kind: "correct" } : { kind: "wrong", ...diagnose(ans, p) };
  }

  for (const e of exacts) {
    const right = roundHalfUp(e, d);
    if (Math.abs(p.value - right) < 1e-9 && p.decimals <= d) {
      // Npr. 2,5 pri dveh decimalkah je enako 2,50 – sprejmemo.
      return { kind: "correct" };
    }
  }

  // Je izračun pravilen, a je narobe le zaokroževanje?
  for (const e of exacts) {
    const right = roundHalfUp(e, d);
    const own = p.decimals;
    const diff = Math.abs(p.value - e);
    const step = 10 ** -own;
    const roundedOwn = diff <= 0.5 * step * (1 + 1e-7); // pravilno zaokroženo, a na napačno število mest
    const truncated = Math.abs(p.value) <= Math.abs(e) + 1e-12 && diff < step; // odrezano namesto zaokroženo
    const closeToExact = own === d ? diff < step : roundedOwn || truncated;
    if (!closeToExact) continue;
    let what;
    if (own !== d) {
      what = `Rezultat je treba zaokrožiti ${decimalsWord(d)}, ti si ga zapisal ${own === 0 ? "kot celo število" : `na ${own} decimal${own === 1 ? "ko" : own === 2 ? "ki" : own < 5 ? "ke" : "k"}`}.`;
    } else {
      what = `Zaokrožil si v napačno smer.`;
    }
    const next = Math.floor(Math.abs(e) * 10 ** (d + 1) + 1e-9) % 10;
    return {
      kind: "rounding",
      code: "chk.rounding",
      params: { right: (ans.dot ? roundHalfUp(right, d).toFixed(d) : fmt(right, d)) + (ans.unit ? ` ${ans.unit}` : "") },
      message:
        `Izračun je pravilen, popraviti je treba le zaokroževanje. ${what} ${ROUNDING_RULE} ` +
        `Tu je natančnejši rezultat ${fmt(e, Math.min(d + 3, 6))}, števka za ${d === 0 ? "enicami" : `${d}. decimalko`} je ${next}, ` +
        `zato je pravilno zaokroženo ${fmt(right, d)}.`,
      reveal: fmt(right, d) + (ans.unit ? ` ${ans.unit}` : ""),
    };
  }
  return { kind: "wrong", ...diagnose(ans, p) };
}

// ---------- prepoznavanje tipičnih napak ----------
// Napačen številski odgovor primerjamo z napakami, ki jih našteje generator
// (answer.mistakes: [{ value, why }]), in s splošnimi vzorci: napačen predznak,
// napačen velikostni red (pretvorba enot), obratna vrednost, faktor 2.
// Vrne { mistake: { message, code?, params? } } ali {}.
function near(v, target, p) {
  const step = 10 ** -Math.max(p.decimals, 0);
  return Math.abs(v - target) <= Math.max(step * 0.51, 0.005 * Math.abs(target)) + 1e-12;
}
const MISTAKE_TEXT = {
  "chk.sign": "Velikost je prava, predznak pa ne. Preveri, ali je rezultat pozitiven ali negativen.",
  "chk.magnitudeBig": "Števke so prave, velikostni red pa ne: rezultat je {times}-krat prevelik. Preveri pretvorbo enot in decimalno vejico.",
  "chk.magnitudeSmall": "Števke so prave, velikostni red pa ne: rezultat je {times}-krat premajhen. Preveri pretvorbo enot in decimalno vejico.",
  "chk.reciprocal": "Dobil si obratno vrednost. Si morda delil v napačnem vrstnem redu?",
  "chk.factor2Big": "Rezultat je natanko 2-krat prevelik. Preveri, ali si izpustil ali dodal faktor 2 (npr. ½ v formuli, premer namesto polmera).",
  "chk.factor2Small": "Rezultat je natanko 2-krat premajhen. Preveri, ali si izpustil ali dodal faktor 2 (npr. ½ v formuli, premer namesto polmera).",
};
const mk = (code, params = {}) => ({
  mistake: { code, params, message: MISTAKE_TEXT[code].replace(/\{(\w+)\}/g, (_, k) => params[k]) },
});
export function diagnose(ans, p) {
  const v = p.value;
  for (const m of ans.mistakes || []) {
    if (m && Number.isFinite(m.value) && m.why && near(v, m.value, p)) return { mistake: { message: m.why } };
  }
  for (const e of [ans.value, ...(ans.alsoAccept || [])]) {
    if (!Number.isFinite(e) || e === 0 || v === 0) continue;
    if (Math.sign(v) !== Math.sign(e) && near(-v, e, p)) return mk("chk.sign");
    const ratio = v / e;
    if (ratio > 0) {
      const k = Math.round(Math.log10(ratio));
      if (k !== 0 && Math.abs(k) <= 9 && near(v, e * 10 ** k, p)) {
        return mk(k > 0 ? "chk.magnitudeBig" : "chk.magnitudeSmall", { times: String(10 ** Math.abs(k)) });
      }
      if (Math.abs(e) > 1.05 || Math.abs(e) < 0.95) {
        if (near(v, 1 / e, p) && Math.abs(v - e) > 1e-9) return mk("chk.reciprocal");
      }
      if (near(v, 2 * e, p)) return mk("chk.factor2Big");
      if (near(v, e / 2, p)) return mk("chk.factor2Small");
    }
  }
  return {};
}

function parseFraction(input) {
  const s = westernDigits(String(input).trim()).replace(/−/g, "-").replace(/\s+/g, " ");
  // predznak lahko stoji tudi v imenovalcu: 3/-4 = -3/4
  // Ulomek a/b ali razmerje / količnik a : b, a ÷ b, a ∶ b (razmerje 5 : 4 je ulomek 5/4).
  // Pri razmerju sta lahko člena zapisana s presledkom med tisočicami (»1 : 100 000«); pri »/« ne, ker je »1 100/200«
  // mešano število. ratio: zapisano z znakom za razmerje oziroma deljenje (namig »okrajšaj razmerje«).
  let m = s.match(/^([+-]?\d+)\s*\/\s*([+-]?\d+)$/) || s.match(/^([+-]?(?:\d{1,3}(?: \d{3})+|\d+))\s*[:÷∶]\s*([+-]?(?:\d{1,3}(?: \d{3})+|\d+))$/);
  if (m) {
    const num = Number(m[1].replace(/ /g, ""));
    const den = Number(m[2].replace(/ /g, ""));
    const ratio = !s.includes("/");
    return den < 0 ? { num: -num, den: -den, ratio } : { num, den, ratio };
  }
  m = s.match(/^([+-]?)(\d+) (\d+)\s*\/\s*(\d+)$/); // mešano število "1 1/2"
  if (m) {
    const sign = m[1] === "-" ? -1 : 1;
    const den = Number(m[4]);
    return { num: sign * (Number(m[2]) * den + Number(m[3])), den };
  }
  m = s.match(/^[+-]?\d+$/);
  if (m) return { num: Number(s), den: 1 };
  return null;
}

function checkFraction(ans, input) {
  const f = parseFraction(input);
  if (!f || f.den === 0) {
    // Decimalno število s pravo vrednostjo (»1,25« za 5/4): vrednost je prava, zapis pa ne. Sporočilo ne izda
    // ulomka (pri nalogi »okrajšaj razmerje« bi bil to odgovor). Decimalno število z napačno vrednostjo je
    // napačen poskus: sicer bi bil vsak decimalni vnos brezplačen in »Vrednost je prava« bi izdala vrednost
    // (kviz, preizkus v pilotu in tekmovanje imajo en poskus, napaka v zapisu pa se lahko ponavlja).
    const p = !f && parseNumberWithUnit(input);
    if (p && !p.unit && ans.den) {
      if (Math.abs(p.value - ans.num / ans.den) < 1e-9) {
        return { kind: "format", code: "chk.fractionForm", message: "Vrednost je prava, zapiši jo še kot ulomek a/b ali razmerje a : b." };
      }
      return { kind: "wrong" };
    }
    return { kind: "format", code: "chk.fraction", message: "Zapiši ulomek v obliki a/b (npr. 3/4), razmerje v obliki a : b (npr. 3 : 4) ali mešano število (npr. 1 1/2)." };
  }
  const same = f.num * ans.den === ans.num * f.den;
  if (!same) {
    // answer.mistakes: [{ value, why }] tudi pri ulomkih (value je vrednost ulomka, npr. 3/4 → 0.75)
    const v = f.num / f.den;
    const m = (ans.mistakes || []).find((x) => x && x.why && Math.abs(x.value - v) < 1e-9);
    if (m) return { kind: "wrong", mistake: { message: m.why } };
    if (f.num * ans.num !== 0 && f.den * ans.den === f.num * ans.num && Math.abs(v - 1) > 1e-9) {
      return { kind: "wrong", mistake: { code: "chk.reciprocal", params: {}, message: "Dobil si obratno vrednost. Si morda delil v napačnem vrstnem redu?" } };
    }
    return { kind: "wrong" };
  }
  // 0/5 je že 0: okrajšati ni česa. answer.simplest === false: naloga ne zahteva okrajšanega zapisa (10 : 8 = 5 : 4).
  if (ans.simplest !== false && f.num !== 0 && gcd(f.num, f.den) !== 1) {
    return f.ratio
      ? { kind: "simplify", code: "chk.simplifyRatio", message: "Vrednost je pravilna, a razmerje še okrajšaj do konca." }
      : { kind: "simplify", code: "chk.simplify", message: "Vrednost je pravilna, a ulomek še okrajšaj do konca." };
  }
  return { kind: "correct" };
}

function checkChoice(ans, input) {
  if (Number(input) === ans.index) return { kind: "correct" };
  // answer.why[i]: zakaj je izbira i napačna (tipična napačna predstava)
  const why = Array.isArray(ans.why) ? ans.why[Number(input)] : null;
  return why ? { kind: "wrong", mistake: { message: why } } : { kind: "wrong" };
}

function checkCoefficients(ans, input) {
  const nums = String(input)
    .split(/[,;\s]+/)
    .filter(Boolean)
    .map(Number);
  if (nums.length !== ans.values.length || nums.some((n) => !Number.isInteger(n) || n < 1)) {
    return { kind: "format", code: "chk.coef", params: { n: ans.values.length }, message: `Vpiši ${ans.values.length} celih števil, ločenih z vejico (koeficient 1 tudi zapiši).` };
  }
  if (nums.every((n, i) => n === ans.values[i])) return { kind: "correct" };
  const ratio = nums[0] / ans.values[0];
  if (nums.every((n, i) => Math.abs(n / ans.values[i] - ratio) < 1e-9)) {
    return { kind: "simplify", code: "chk.coefMin", message: "Enačba je urejena, a koeficienti morajo biti najmanjša možna cela števila." };
  }
  return { kind: "wrong" };
}

// ---------- iskani del namesto celega zapisa (j, 19. 11. 2026) ----------
// Naloga »√175 = a√b, koliko je b?«: učenec pogosto vpiše cel zapis (»5√7«) ali »b = 7«.
// answer.form = { expr, vals, ask }: expr je oblika v zapisu tipkovnice (»a√(b)«, »y = k*x + n«, »k*π«), vals
// prave vrednosti črk v obliki, ask iskana črka. Pravilen cel zapis ne šteje kot poskus (učenec izve, da vpiše
// samo iskano število); cel zapis z napako je napačen poskus z isto razlago.

// Iskana količina pred enačajem (»b = 7«, »x=4«, »n = −3«): odstrani jo, če je to res iskana črka.
const symKey = (s) => String(s ?? "").replace(/\\(?:mathrm|text|rm)\b/g, "").replace(/\\([a-zA-Z]+)/g, "$1").replace(/[\s${}_\\]/g, "");
function askedSymbols(answer, opts) {
  return new Set([answer.form?.ask, askedLetter(opts), ...[].concat(opts.find || [])].filter(Boolean).map(symKey).filter(Boolean));
}
function stripAsked(input, answer, opts) {
  // Brez »\s*« ob razredu, ki tudi sprejme presledke (kvadratni čas pri »A=« + mnogo presledkov).
  const m = String(input).trim().match(/^([A-Za-zͰ-Ͽ][A-Za-z0-9_Ͱ-Ͽ']*)\s*=([\s\S]*)$/);
  if (!m || m[2].includes("=") || !m[2].trim()) return input;
  return askedSymbols(answer, opts).has(symKey(m[1])) ? m[2].trim() : input;
}

const ungrp = (n) => (n && n.k === "grp" ? ungrp(n.a) : n);
// Vrednost številskega poddrevesa (−3, 1/2, 2,5) ali null.
function constVal(n) {
  n = ungrp(n);
  if (!n) return null;
  if (n.k === "num") return n.v;
  if (n.k === "neg") return constVal(n.a) === null ? null : -constVal(n.a);
  if (n.k === "*" || n.k === "/") {
    const a = constVal(n.a);
    const b = constVal(n.b);
    if (a === null || b === null || (n.k === "/" && b === 0)) return null;
    return n.k === "*" ? a * b : a / b;
  }
  return null;
}
const close = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
function bind(b, name, v) {
  if (v === null || !Number.isFinite(v)) return false;
  if (name in b) return close(b[name], v);
  b[name] = v;
  return true;
}
// Seštevanci s predznakom: a − b + (−c) → [+a, −b, −c].
function addends(n, sign = 1, out = []) {
  n = ungrp(n);
  if (n.k === "+") return addends(n.b, sign, addends(n.a, sign, out));
  if (n.k === "-" && n.b) return addends(n.b, -sign, addends(n.a, sign, out));
  if (n.k === "neg") return addends(n.a, -sign, out);
  out.push({ sign, node: n });
  return out;
}
// Člen → { coef (število), ph (črka iz oblike kot koeficient ali null), rest [faktorji] }.
function factorize(n, P, t = { coef: 1, ph: null, rest: [] }, inv = false) {
  n = ungrp(n);
  const c = constVal(n);
  if (c !== null) {
    t.coef = inv ? t.coef / c : t.coef * c;
    return t;
  }
  if (n.k === "neg") {
    t.coef = -t.coef;
    return factorize(n.a, P, t, inv);
  }
  if (n.k === "*") return factorize(n.b, P, factorize(n.a, P, t, inv), inv);
  if (n.k === "/" && constVal(n.b) !== null) return factorize(n.b, P, factorize(n.a, P, t, inv), !inv);
  if (n.k === "var" && P.has(n.name) && !t.ph && !inv) {
    t.ph = n.name;
    return t;
  }
  t.rest.push(inv ? { k: "/", a: { k: "num", v: 1 }, b: n } : n);
  return t;
}
// Ujemanje dela oblike (z mesti za črke) z učenčevim izrazom; b dobi vrednosti črk.
function unify(T, I, P, b) {
  T = ungrp(T);
  I = ungrp(I);
  if (T.k === "var" && P.has(T.name)) return bind(b, T.name, constVal(I));
  // x^m z m = 1: učenec napiše samo x.
  if (T.k === "^" && ungrp(T.b).k === "var" && P.has(ungrp(T.b).name) && I.k !== "^") return unify(T.a, I, P, b) && bind(b, ungrp(T.b).name, 1);
  if (T.k !== I.k) return false;
  switch (T.k) {
    case "num":
      return close(T.v, I.v);
    case "var":
    case "const":
      return T.name === I.name;
    case "call":
      return T.f === I.f && T.args.length === I.args.length && T.args.every((a, i) => unify(a, I.args[i], P, b));
    case "^":
    case "/":
      return unify(T.a, I.a, P, b) && unify(T.b, I.b, P, b);
    case "+":
    case "-":
    case "*":
      return sumMatch(T, I, P, b);
    case "neg":
      return unify(T.a, I.a, P, b);
    default:
      return false;
  }
}
// Vsi vrstni redi kratkega seznama (do 4 elementi).
function perms(a) {
  if (a.length <= 1) return [a];
  return a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map((p) => [x, ...p]));
}
function restMatch(Tr, Ir, P, b) {
  if (Tr.length !== Ir.length || Tr.length > 4) return false;
  return perms(Ir).some((order) => {
    const trial = { ...b };
    if (!Tr.every((f, i) => unify(f, order[i], P, trial))) return false;
    Object.assign(b, trial);
    return true;
  });
}
// Vsota iz oblike proti vsoti učenca v poljubnem vrstnem redu; manjkajoč prosti člen s črko je 0 (y = −9x pri n = 0).
function sumMatch(T, I, P, b) {
  const tt = addends(T).map((x) => ({ ...factorize(x.node, P), sign: x.sign }));
  const it = addends(I).map((x) => ({ ...factorize(x.node, P), sign: x.sign }));
  if (tt.length > 4 || it.length > 4) return false;
  const tryFrom = (ti, used, cur) => {
    if (ti === tt.length) {
      if (used.size !== it.length) return null;
      return cur;
    }
    const t = tt[ti];
    for (let j = 0; j < it.length; j++) {
      if (used.has(j)) continue;
      const u = it[j];
      if (u.ph) continue; // učenec ne piše črk iz oblike
      const trial = { ...cur };
      if (!restMatch(t.rest, u.rest, P, trial)) continue;
      const v = u.sign * u.coef;
      if (t.ph ? !bind(trial, t.ph, v / (t.sign * t.coef)) : !close(v, t.sign * t.coef)) continue;
      const done = tryFrom(ti + 1, new Set([...used, j]), trial);
      if (done) return done;
    }
    // Prosti člen s črko, ki ga učenec ni napisal: vrednost 0.
    if (t.ph && !t.rest.length) {
      const trial = { ...cur };
      if (bind(trial, t.ph, 0)) return tryFrom(ti + 1, used, trial);
    }
    return null;
  };
  const res = tryFrom(0, new Set(), { ...b });
  if (!res) return false;
  Object.assign(b, res);
  return true;
}
const isVar = (n, name) => ungrp(n)?.k === "var" && ungrp(n).name === name;
const fnSide = (n) => isVar(n, "y") || (n.k === "*" && isVar(n.a, "f") && isVar(n.b, "x")) || (n.k === "call" && n.f === "f" && n.args.length === 1 && isVar(n.args[0], "x"));
// Enačba: »y = k*x + n« proti »y = −9x + 6« ali samo desni strani »−9x + 6«.
function formValues(form, input, math, dot = false) {
  let T;
  let I;
  try {
    T = math.parse(form.expr);
    I = math.parse(studentText(input, math, dot));
  } catch {
    return null;
  }
  const P = new Set([...Object.keys(form.vals), ...(form.free || [])]);
  const sides = (n) => (n.k === "cmp" ? (n.ops.length === 1 && n.ops[0] === "=" ? n.terms : null) : [n]);
  let ts = sides(T);
  const is = sides(I);
  if (!ts || !is) return null;
  if (ts.length === 2 && is.length === 1) ts = [ts[1]];
  if (ts.length !== is.length) return null;
  const b = {};
  // »y = …« in »f(x) = …« sta ista leva stran.
  if (ts.length === 2 && fnSide(ts[0]) && fnSide(is[0])) {
    ts = [ts[1]];
    is.shift();
  }
  if (!ts.every((t, i) => sumMatch(t, is[i], P, b))) return null;
  return [...P].every((k) => k in b) ? b : null;
}
// Oblika brez answer.form, prepoznana iz besedila naloge (vse take naloge naenkrat, tudi prihodnje):
// »v obliki $k\pi$«, »tangenta $y = kx + n$ … vpiši $n$«, »vodnica $x = m$«, »faktor $x + c$«, »$z = x + yi$«, »$= e^k$«.
// Iz besedila poznamo le vrednost iskane črke; druge črke oblike so proste (free).
const IMPLIED = [
  [/\$k\s*\\pi\$/, () => "k*π"],
  [/\$(y|f\(x\)) = ([a-z])x \+ ([a-z])\$/, (m) => `${m[1]} = ${m[2]}*x + ${m[3]}`],
  [/\$y = x \+ ([a-z])\$/, (m) => `y = x + ${m[1]}`],
  [/\$x = ([a-z])\$/, (m) => `x = ${m[1]}`],
  [/\$x \+ ([a-z])\$/, (m) => `x + ${m[1]}`],
  [/\$z = x \+ yi\$/, () => "z = x + y*i"],
  [/= e\^k\$/, () => "e^k"],
];
// Iskana črka: edina v »Iščemo« ali zadnja v »Koliko je $n$?«, »Vpiši $k$«, »find k«.
function askedLetter(opts) {
  const find = [].concat(opts.find || []).map(symKey).filter(Boolean);
  if (find.length === 1 && /^[a-zA-Z]$/.test(find[0])) return find[0];
  const all = [...String(opts.text || "").matchAll(/(?:Koliko je|Vpiši|Izračunaj|Določi)\s+\$([a-zA-Z])\$|\bfind\s+\$?([a-zA-Z])\$?(?![\w{(\\])/g)];
  // V slovenskem besedilu je črka v $…$ (»Koliko je v posodi« ni črka v).
  return all.length ? all[all.length - 1][1] || all[all.length - 1][2] : null;
}
function impliedForm(answer, opts) {
  if (answer.form) return answer.form;
  const value = answer.type === "fraction" ? answer.num / answer.den : answer.value;
  const ask = askedLetter(opts);
  if (!Number.isFinite(value) || !ask) return null;
  const text = String(opts.text || "");
  for (const [re, make] of IMPLIED) {
    const m = text.match(re);
    if (!m) continue;
    const expr = make(m);
    const letters = new Set([...(expr.replace(/\b(?:x|y|z|f|i|e)\b/g, " ").match(/\b[a-zA-Z]\b/g) || []), ...(expr === "z = x + y*i" ? ["x", "y"] : [])]);
    if (!letters.has(ask)) continue;
    return { expr, vals: { [ask]: value }, ask, free: [...letters].filter((l) => l !== ask) };
  }
  return null;
}
// Izid za cel zapis ali null (vnos ni v obliki naloge).
function checkForm(answer, input, opts) {
  const f = impliedForm(answer, opts);
  if (!f || !opts.math || !/[A-Za-zͰ-Ͽ√∛^=π⁰¹²³⁴⁵⁶⁷⁸⁹]/.test(String(input))) return null;
  // »3,2x10^4«: x je tu znak za množenje (kot v parseScientific), ne spremenljivka.
  const inp = /10\^/.test(f.expr) ? String(input).replace(/(\d)\s*[xX]\s*(?=10)/g, "$1*") : input;
  const got = formValues(f, inp, opts.math, !!answer.dot);
  if (!got) return null;
  const sym = f.ask;
  // Iskana vrednost mora biti tudi enaka odgovoru naloge (če bi se form.vals in answer kdaj razšla, ne izdamo »pravilno«).
  const want = answer.type === "fraction" ? answer.num / answer.den : answer.value;
  if (sym in got && close(got[sym], want) && Object.entries(f.vals).every(([k, v]) => close(got[k], v))) {
    // Drugih črk ne poznamo (oblika iz besedila): ne trdimo, da je cel zapis pravilen.
    if (f.free?.length) return { kind: "format", code: "chk.partOnlyAsk", params: { sym }, message: `Naloga sprašuje samo po ${sym}, ne po celem zapisu. Vpiši le to število.` };
    return { kind: "format", code: "chk.partOnly", params: { sym }, message: `Celoten zapis je pravilen, naloga pa sprašuje samo po ${sym}. Vpiši le to število.` };
  }
  // »√175« pri obliki a√b: vrednost je prava, zapis pa še ni v zahtevani obliki (ni »napaka v zapisu«).
  if (!f.free?.length && !Object.entries(f.vals).every(([k, v]) => close(got[k], v))) {
    const whole = exprValue(f.expr.replace(/\b[a-zA-Z]\b/g, (c) => (c in f.vals ? `(${f.vals[c]})` : c)), opts.math, { own: false });
    const own = exprValue(inp, opts.math, { dot: !!answer.dot });
    if (whole !== null && own !== null && close(whole, own)) {
      return { kind: "wrong", mistake: { code: "chk.partOnlyForm", params: { sym }, message: `Vrednost je prava, a zapis še ni v zahtevani obliki. Naloga sprašuje samo po ${sym}: vpiši le to število.` } };
    }
  }
  return { kind: "wrong", mistake: { code: "chk.partOnlyWrong", params: { sym }, message: `Vpisal si celoten zapis, v njem pa je napaka. Naloga sprašuje samo po ${sym}: vpiši le to število.` } };
}

export function checkAnswer(answer, input, opts = {}) {
  if (input === undefined || input === null || String(input).trim() === "") {
    return { kind: "format", code: "chk.empty", message: "Najprej vpiši odgovor." };
  }
  if (answer.type === "number" || answer.type === "fraction") {
    const form = checkForm(answer, input, opts);
    if (form) return form;
    input = stripAsked(input, answer, opts);
  }
  switch (answer.type) {
    case "number":
      return checkNumber(answer, input, opts);
    case "fraction":
      return checkFraction(answer, input);
    case "choice":
      return checkChoice(answer, input);
    case "coefficients":
      return checkCoefficients(answer, input);
    default:
      throw new Error(`Neznana vrsta odgovora: ${answer.type}`);
  }
}

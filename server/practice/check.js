// Preverjanje odgovorov: števila (z zaokroževanjem in enotami), ulomki,
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
    if (/^\p{L}/u.test(rest.slice(1)) && !/^m(?:in|ol)(?!\p{L})/u.test(rest)) return false;
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

function checkNumber(ans, input) {
  const p = parseNumberWithUnit(input, { dot: !!ans.dot });
  if (!p) return { kind: "format", code: "chk.number", message: "Vpiši število (za decimalno ločilo lahko uporabiš vejico ali piko)." };
  const res = checkParsed(ans, p);
  // »2.500« je lahko 2500 (pika za tisočice) ali 2,5 s piko kot decimalnim ločilom (tipkovnica v
  // angleščini, arabščini, urdujščini). Decimalno branje upoštevamo samo, kadar rezultat res ima tri
  // decimalke (zahtevano zaokroževanje ali točna vrednost, kot 12,345): sicer je »2.500« za 2,5 najverjetneje
  // pozabljena pretvorba enot (2500 m namesto 2,5 km) in učenec dobi namig o velikostnem redu.
  // Pri zahtevanem zaokroževanju dobi namig za zaokroževanje (»2.500« pri dveh decimalkah).
  if (res.kind !== "correct" && !ans.dot && threeDecimals(ans) && /^[+-]?[1-9]\d{0,2}\.\d{3}(?!\d)/.test(westernDigits(String(input).trim()).replace(/−/g, "-"))) {
    const q = parseNumberWithUnit(input, { dot: true });
    const alt = q && checkParsed(ans, q);
    if (alt?.kind === "correct" || alt?.kind === "rounding") return alt;
  }
  return res;
}

// Ima pravilni odgovor lahko tri decimalke? Da, kadar je zaokroževanje zahtevano ali kadar točna vrednost
// potrebuje natanko tri decimalke (12,345, 0,125; ne pa 2,5 ali 2500).
function threeDecimals(ans) {
  if (ans.decimals !== undefined && ans.decimals !== null) return true;
  const whole = (x) => Math.abs(x - Math.round(x)) <= 1e-9 * Math.max(1, Math.abs(x));
  return [ans.value, ...(ans.alsoAccept || [])].some((e) => Number.isFinite(e) && whole(e * 1000) && !whole(e * 100));
}

function checkParsed(ans, p) {

  // Enota
  if (ans.unit) {
    const got = normUnit(p.unit);
    if (!got) return { kind: "unit", code: "chk.addUnit", message: `Število je zapisano, dodaj še enoto. V kateri enoti je rezultat?` };
    if (![ans.unit, ...(ans.unitAlternatives || [])].some((u) => sameUnit(u, p.unit))) {
      return { kind: "unit", code: "chk.unit", params: { unit: ans.unit }, message: `Preveri enoto: rezultat zapiši v ${ans.unit}.` };
    }
  }

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
  let m = s.match(/^([+-]?\d+)\s*\/\s*([+-]?\d+)$/);
  if (m) {
    const num = Number(m[1]);
    const den = Number(m[2]);
    return den < 0 ? { num: -num, den: -den } : { num, den };
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
    return { kind: "format", code: "chk.fraction", message: "Zapiši ulomek v obliki a/b (npr. 3/4) ali mešano število (npr. 1 1/2)." };
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
  // 0/5 je že 0: okrajšati ni česa
  if (f.num !== 0 && gcd(f.num, f.den) !== 1) return { kind: "simplify", code: "chk.simplify", message: "Vrednost je pravilna, a ulomek še okrajšaj do konca." };
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

export function checkAnswer(answer, input) {
  if (input === undefined || input === null || String(input).trim() === "") {
    return { kind: "format", code: "chk.empty", message: "Najprej vpiši odgovor." };
  }
  switch (answer.type) {
    case "number":
      return checkNumber(answer, input);
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

// »Preveri se« v lekciji: preverjanje odgovorov na vprašanja z vpisom števila in razvrščanjem.
// Čiste funkcije brez DOM: uporabljajo jih splet (public/textbook.js), aplikacija (mobile/src/app/topic/[id].tsx)
// in strežnik (server/textbook.js razčlenjevanje, server/weaknesses.js šibke točke), zato so odgovori povsod enaki.
//
// Vrste vprašanj (content/lessons/README.md, »Preveri se«):
//   izbira (brez polja type): { q, options, correct, why, optionWhy }
//   število:  { type: "stevilo", q, answer, value, tol, unit, wrong: [{ answer, value, tol, why }], why }
//   razvrsti: { type: "razvrsti", q, items (pravilni vrstni red), shown (premešan vrstni red indeksov), why }

const MINUS = /[−‐-―﹣－]/g;
const SPACES = /[\s   ]+/g;
// Število na začetku: predznak, števke (tisočice smejo biti ločene s presledkom), decimalna vejica ali pika,
// neobvezno »e-3«, »·10^-3«, »×10^{-3}«, »* 10^3«. Kar sledi (enota), se ne upošteva.
const NUM = /^([+-]?)\s*(\d+(?: \d{3})*(?:[.,]\d*)?|[.,]\d+)(?:\s*(?:[eE]|[·⋅*×xX]\s*10\s*\^)\s*\{?\s*([+-]?\d+)\s*\}?)?/;

function token(s) {
  const t = String(s ?? "")
    .replace(/\{,\}/g, ",")
    .replace(MINUS, "-")
    .replace(SPACES, " ")
    .trim()
    // »x = 2,5« ali »pH = 2,30«: oznaka pred enačajem se ne šteje.
    .replace(/^[^\d+\-.,=]{0,12}=\s*/, "")
    // »10^-4« (brez množitelja) je 1·10^-4.
    .replace(/^([+-]?)\s*10\s*\^/, "$11·10^");
  // Tisočice s piko (»10.000«, »1.250.000«, »10.000,5«): pike so ločila tisočic, ne decimalna vejica.
  // Z eno samo piko in brez vejice (»10.000«) je zapis dvoumen (lahko je tudi 10,000), zato token vrne
  // obe branji (value in alt); checkNumber sprejme odgovor, če se katero od njiju ujema.
  const th = /^([+-]?)\s*([1-9]\d{0,2}(?:\.\d{3})+)(,\d*)?(?![\d.])/.exec(t);
  if (th && (th[3] != null || (th[2].match(/\./g) || []).length > 1)) {
    return token(t.replace(th[2], th[2].replace(/\./g, "")));
  }
  const m = NUM.exec(t);
  if (!m) return null;
  const digits = m[2].replace(/ /g, "").replace(",", ".");
  const exp = m[3] ? Number(m[3]) : 0;
  const n = Number(`${m[1]}${digits}`);
  const value = exp < 0 ? n / 10 ** -exp : n * 10 ** exp; // deljenje: 1·10^-4 je točno 0,0001
  if (!Number.isFinite(value)) return null;
  const decimals = (/[.,](\d*)/.exec(m[2]) || [, ""])[1].length;
  const rest = t.slice(m[0].length).trim();
  // Za številom še števka, ulomek, potenca ali množenje (»2 5«, »1/2«, »10^-3«, »2·10³«): to ni eno število.
  if (/^[\d.,/^:·⋅*×⁰¹²³⁴⁵⁶⁷⁸⁹⁻]/.test(rest)) return null;
  let alt = th && !m[3] ? Number(`${m[1]}${m[2].replace(".", "")}`) : null;
  // »2.000«, »1.000«: decimalke 000 nihče ne piše za 2 ali 1, zato je to skoraj gotovo dva tisoč (branje zamenjamo).
  if (alt != null && /\.000$/.test(m[2])) return { value: alt, decimals: 0, exp: 0, rest, text: m[0].trim().replace(".", ""), mant: `${m[1]}${m[2].replace(".", "")}`, hasExp: false, alt: null };
  return { value, decimals, exp, rest, text: m[0].trim(), mant: `${m[1]}${m[2]}`, hasExp: m[3] != null, alt };
}

/** Število iz vnosa učenca (vejica ali pika, različni minusi, enota za številom se ne upošteva); sicer null. */
export function parseNum(s) {
  return token(s)?.value ?? null;
}

/**
 * Vrstica »= 2,30 | 0,01« oziroma »= 2,5 m/s | 0,1« (brez »=«): { answer, value, unit, tol } ali null.
 * Brez tolerance velja natančno na izpisane decimalke (2,30 → ±0,005).
 */
export function parseAnswerLine(s) {
  const [left, ...rest] = String(s ?? "").split("|");
  const tk = token(left);
  if (!tk || /^[\d.,]/.test(tk.rest)) return null;
  const tolText = rest.join("|").trim();
  let tol;
  if (tolText) {
    const tt = token(tolText);
    if (!tt || tt.value < 0 || tt.rest) return null;
    tol = tt.value;
  } else tol = 0.5 * 10 ** (tk.exp - tk.decimals);
  // S potenco kot formula ($1{,}5\cdot 10^{-3}$), da se v rešitvi, tisku in aplikaciji izpiše kot potenca.
  const answer = tk.hasExp
    ? `$${tk.mant.replace(/^\+/, "").replace(" ", "\\,").replace(/[.,]/, "{,}")}\\cdot 10^{${tk.exp}}$`
    : tk.text.replace(/^\+/, "").replace(/-/g, "−").replace(".", ",");
  return { answer, value: tk.value, unit: tk.rest, tol };
}

const near = (x, v, tol) => Math.abs(x - v) <= tol * (1 + 1e-9) + 1e-12 * Math.max(1, Math.abs(v));

/**
 * Odgovor na vprašanje z vpisom števila: { empty } (ni števila: vpiše znova), { ok: true } ali
 * { ok: false, wrong } (wrong = indeks tipične napačne vrednosti »~« ali -1).
 */
export function checkNumber(c, input) {
  const tk = token(input);
  if (!tk) return { empty: true, ok: false, wrong: -1 };
  const wrong = c.wrong || [];
  const x = tk.value;
  if (near(x, c.value, c.tol)) return { ok: true, wrong: -1 };
  // Tipična napačna vrednost »~« ima svojo natančnost (izpisane decimalke), ne tolerance pravilnega odgovora.
  const exact = wrong.findIndex((w) => near(x, w.value, w.tol ?? c.tol));
  if (exact >= 0) return { ok: false, wrong: exact };
  // »12.345« je lahko 12,345 ali dvanajst tisoč: branje s tisočicami velja le, če prvo branje ni tipična napaka
  // (»2.345« pri pretvorbi kg v g je napaka »~ 2,345«, ne pravilni odgovor 2345).
  if (tk.alt != null) {
    if (near(tk.alt, c.value, c.tol)) return { ok: true, wrong: -1 };
    const i = wrong.findIndex((w) => near(tk.alt, w.value, w.tol ?? c.tol));
    if (i >= 0) return { ok: false, wrong: i };
  }
  // Učenec napačno vrednost pogosto vpiše zaokroženo (1/64 kot 0,016 ali 0,0156): če ima vnos vsaj eno decimalko in
  // je napačna vrednost na toliko decimalk enaka vnosu, se pokaže razlaga najbližje. Ne, če je vnos le zaokrožen ali
  // odrezan pravilni odgovor (2,5 ali 2,6 pri 2,54; 0,6 pri 0,67) ali 0.
  const d = tk.decimals > 0 && !tk.hasExp ? tk.decimals : 0;
  const half = 0.5 * 10 ** -d;
  if (!d || x === 0 || Math.abs(x - c.value) < 10 ** -d * (1 + 1e-9)) return { ok: false, wrong: -1 };
  let best = -1;
  wrong.forEach((w, i) => {
    if (near(x, w.value, half) && (best < 0 || Math.abs(x - w.value) < Math.abs(x - wrong[best].value))) best = i;
  });
  return { ok: false, wrong: best };
}

/** Vrstni red učenca (indeksi elementov v pravilnem vrstnem redu) je pravilen. */
export function orderOk(c, order) {
  return Array.isArray(order) && order.length === c.items.length && order.every((v, i) => v === i);
}
/** Koliko elementov je na pravem mestu. */
export const orderHits = (order) => (order || []).filter((v, i) => v === i).length;

// Premešan vrstni red, enak ob vsakem nalaganju (seme iz besedila vprašanja), nikoli že pravilen.
function seed(text) {
  let h = 2166136261;
  for (const ch of String(text)) h = Math.imul(h ^ ch.codePointAt(0), 16777619) >>> 0;
  return h;
}
export function shuffled(n, key) {
  let a = seed(key) || 1;
  const rnd = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  if (n > 1 && out.every((v, i) => v === i)) out.push(out.shift());
  return out;
}

/** Premakne element na mestu i za d mest (−1 gor, +1 dol); vrne nov seznam. */
export function moveItem(order, i, d) {
  const j = i + d;
  if (j < 0 || j >= order.length) return order.slice();
  const out = order.slice();
  [out[i], out[j]] = [out[j], out[i]];
  return out;
}
/** Dotik elementa na mestu i: postavi ga na prvo še nepostavljeno mesto (placed = koliko jih je že po vrsti). */
export function placeItem(order, placed, i) {
  if (i < placed) return { order: order.slice(), placed };
  const out = order.slice();
  const [x] = out.splice(i, 1);
  out.splice(placed, 0, x);
  return { order: out, placed: placed + 1 };
}

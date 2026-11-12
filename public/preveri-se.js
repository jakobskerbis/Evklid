// »Preveri se« v lekciji: preverjanje odgovorov na vprašanja z vpisom števila in razvrščanjem.
// Čiste funkcije brez DOM: uporabljajo jih splet (public/textbook.js), aplikacija (mobile/src/app/topic/[id].tsx)
// in strežnik (server/textbook.js razčlenjevanje, server/weaknesses.js šibke točke), zato so odgovori povsod enaki.
//
// Vrste vprašanj (content/lessons/README.md, »Preveri se«):
//   izbira (brez polja type): { q, options, correct, why, optionWhy }
//   število:  { type: "stevilo", q, answer, value, tol, unit, wrong: [{ answer, value, why }], why }
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
    .replace(/^[^\d+\-.,=]{0,12}=\s*/, "");
  const m = NUM.exec(t);
  if (!m) return null;
  const digits = m[2].replace(/ /g, "").replace(",", ".");
  const exp = m[3] ? Number(m[3]) : 0;
  const value = Number(`${m[1]}${digits}`) * 10 ** exp;
  if (!Number.isFinite(value)) return null;
  const decimals = (/[.,](\d*)/.exec(m[2]) || [, ""])[1].length;
  const rest = t.slice(m[0].length).trim();
  // Za številom še števka, ulomek, potenca ali množenje (»2 5«, »1/2«, »10^-3«, »2·10³«): to ni eno število.
  if (/^[\d.,/^:·⋅*×⁰¹²³⁴⁵⁶⁷⁸⁹⁻]/.test(rest)) return null;
  return { value, decimals, exp, rest, text: m[0].trim(), mant: `${m[1]}${m[2]}`, hasExp: m[3] != null };
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
  const x = parseNum(input);
  if (x === null) return { empty: true, ok: false, wrong: -1 };
  if (near(x, c.value, c.tol)) return { ok: true, wrong: -1 };
  return { ok: false, wrong: (c.wrong || []).findIndex((w) => near(x, w.value, c.tol)) };
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

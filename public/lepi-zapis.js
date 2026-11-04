// Lep zapis med pisanjem v klepetu (j, 2026-11-04: »naj se potence in ulomki izpisujejo tudi v chatboxu, ne kot
// * in /«, »koreni tudi«, »itd.«). Ko učenec napiše x^2, 3/4, sqrt, a_n, * ali <=, se zapis v polju takoj zamenja z
// znaki Unicode: x², ³⁄₄, √, aₙ, ·, ≤. Tako je že v polju videti kot matematika in inštruktor dobi enak zapis.
// Zapletenejše formule s tipkovnice ((x+1)/(x−1), ∫, ∑) ostanejo zapis v vrstici; nad poljem jih izriše predogled.

const map = (keys, vals) => Object.fromEntries([...keys].map((k, i) => [k, [...vals][i]]));
export const SUP = {
  ...map("0123456789+-−=()", "⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁻⁼⁽⁾"),
  ...map("abcdefghijklmnoprstuvwxyz", "ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖʳˢᵗᵘᵛʷˣʸᶻ"),
};
export const SUB = {
  ...map("0123456789+-−=()", "₀₁₂₃₄₅₆₇₈₉₊₋₋₌₍₎"),
  ...map("aehijklmnoprstuvx", "ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜᵤᵥₓ"),
};
const conv = (s, m) => ([...s].every((c) => c in m) ? [...s].map((c) => m[c]).join("") : null);
const SUPS = Object.values(SUP).join("");
const SUBS = Object.values(SUB).join("");

// Zamenjave na koncu besedila pred kazalcem. Vsaka vrne [nov konec, ime teka] ali null. »Tek« pomeni, da se naslednja
// vpisana števka nadaljuje v isti višini (x²³, log₁₀, ¹⁄₂₅).
const RULES = [
  [/\*$/, () => ["·"]],
  [/(?<!\p{L})sqrt$/u, () => ["√"]],
  [/<=$/, () => ["≤"]],
  [/>=$/, () => ["≥"]],
  [/!=$/, () => ["≠"]],
  [/->$/, () => ["→"]],
  [/\+-$/, () => ["±"]],
  // Ulomek iz števil: 3/4 → ³⁄₄ (ne datum ali del daljšega števila z vejico).
  [/(?<![\d.,/⁄])(\d+)\/(\d)$/, (m) => [conv(m[1], SUP) + "⁄" + SUB[m[2]], "sub"]],
  // Ulomek s tipkovnice s preprostim števcem in imenovalcem: (3)/(4) → ³⁄₄, tudi ko kazalec že gre naprej.
  [/\((\d+|\p{L})\)\/\((\d+|\p{L})\)(\D?)$/u, (m) => {
    const a = conv(m[1], SUP), b = conv(m[2], SUB);
    return a && b ? [a + "⁄" + b + m[3]] : null;
  }],
  // Potenca in indeks: x^2, x^-1, x^n, x^(n+1), a_n, log_10, a_(n+1).
  [/(?<=\S)([\^_])([−-]?\d)$/, (m) => [conv(m[2], m[1] === "^" ? SUP : SUB), m[1] === "^" ? "sup" : "sub"]],
  [/(?<=\S)([\^_])(\p{Ll})$/u, (m) => (m[1] === "^" ? SUP : SUB)[m[2]] ? [(m[1] === "^" ? SUP : SUB)[m[2]]] : null],
  [/(?<=\S)([\^_])\(([^()\s]+)\)(.?)$/, (m) => {
    const s = conv(m[2], m[1] === "^" ? SUP : SUB);
    return s ? [s + m[3]] : null;
  }],
  // Koren s tipkovnice s preprostim argumentom: √(2) → √2.
  [/([√∛∜])\((\d+|\p{L})\)(\D?)$/u, (m) => [m[1] + m[2] + m[3]]],
];

/**
 * Lepši konec besedila pred kazalcem. `before` je besedilo do kazalca po vnosu, `typed` vpisani znaki, `run` tek
 * iz prejšnjega klica ({ at, kind } ali null). Vrne { from, text, run }: zamenjaj before.slice(from) s text,
 * ali null, ko ni kaj zamenjati.
 */
export function prettify(before, typed, run = null) {
  // Nadaljevanje teka: števka takoj za nadpisano ali podpisano števko.
  if (run && /^\d$/.test(typed) && before.length === run.at + 1) {
    const prev = before[before.length - 2] || "";
    const m = run.kind === "sup" ? SUP : SUB;
    if ((run.kind === "sup" ? SUPS : SUBS).includes(prev)) return { from: before.length - 1, text: m[typed], run: { at: before.length, kind: run.kind } };
  }
  for (const [re, fn] of RULES) {
    const m = before.match(re);
    if (!m) continue;
    const r = fn(m);
    if (!r || r[0] == null) continue;
    return { from: m.index, text: r[0], run: r[1] ? { at: m.index + r[0].length, kind: r[1] } : null };
  }
  return null;
}

/** Polje (textarea) med pisanjem sproti lepša. Kliči pred drugimi poslušalci »input«. */
export function attachPrettify(field) {
  let run = null;
  field.addEventListener("input", (e) => {
    const typed = e.data ?? "";
    if (e.isComposing || !/^insert(Text|CompositionText)?$/.test(e.inputType || "") || !typed) return void (run = null);
    const at = field.selectionStart;
    if (at !== field.selectionEnd) return void (run = null);
    const r = prettify(field.value.slice(0, at), typed.slice(-1), run);
    run = r?.run ?? null;
    if (!r) return;
    field.setRangeText(r.text, r.from, at, "end");
  });
}

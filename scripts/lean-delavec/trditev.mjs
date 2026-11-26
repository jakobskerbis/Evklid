// Strogi filter matematične trditve za Lean (docs/lean.md, L5). Isti modul uporabljata strežnik (server/lean-vrsta.js,
// ob vpisu v vrsto) in delavec na prenosniku (delavec.mjs, pred vsakim zagonom Leana). Brez uvozov: delavec ga
// kopira na Windows kot samostojno datoteko.
//
// Zakaj tako strogo: Lean lahko izvaja programe (#eval, run_cmd, elab, macro, initialize, IO, attribute
// [implemented_by] …). Ukaz se v datoteki Lean vedno začne z znakom (#, @[, /--) ali z besedo (open, def, elab …),
// tudi sredi vrstice in po napaki razčlenjevanja (Lean se ujame na naslednjem ukazu). Zato filter ne išče
// prepovedanih besed (seznam ukazov Mathliba je dolg in raste), ampak spusti SAMO:
//   - znake z belega seznama (ena vrstica, brez narekovajev, #, @, ;, «», \, `, $, ⟨⟩, komentarjev);
//   - imena: ena črka (latinska ali grška) s števkami ali indeksi (x, x1, x_2, a₁), besede z belega seznama
//     (fun, deriv, sqrt …) in imena z dovoljeno predpono (Real.…, Nat.…, Finset.…);
//   - števila.
// Nobena beseda z belega seznama ne začne ukaza, zato v trditev ni mogoče skriti ukaza. Trditev nikoli ne
// vsebuje »:=«, »by«, komentarja, nove vrstice ali neuravnoteženih oklepajev. Ker so dovoljena le kratka imena
// spremenljivk in matematična imena, trditev ne more nositi osebnih podatkov (imen, e-naslovov, besedila).

export const NAJVEC_ZNAKOV = 1000;

// Dovoljeni znaki poleg črk, števk in presledka.
const ZNAKI = new Set([..."()[]{}+-*/^=<>,.:|!%_", ..."ℝℕℤℚℂ∀∃¬∧∨→↔≤≥≠·•∑∏∈∉⊆⊂⊇⊃∩∪∅√∣⌊⌋⌈⌉∘×⁻¹²³↑↦‖∞π"]);
const GRSKE = "αβγδεζηθικμνξοπρστυφχψωΓΔΘΛΞΠΣΦΨΩ"; // brez λ (to je »fun«)
const INDEKSI = "₀₁₂₃₄₅₆₇₈₉";

// Besede brez predpone. Nobena ne začne ukaza Lean ali Mathlib.
export const BESEDE = new Set([
  "fun", "deriv", "iteratedDeriv", "abs", "max", "min", "True", "False", "Real", "Nat", "Int", "Rat", "Complex",
  "Finset", "Set", "Even", "Odd", "Prime", "Irrational", "Fin", "id",
  // z »open Real« v predlogi delavca
  "sqrt", "exp", "log", "sin", "cos", "tan", "arctan", "arcsin", "arccos", "sinh", "cosh", "logb", "cot",
]);
// Dovoljene predpone imen (Real.sqrt, Nat.choose, Finset.range …).
export const PREDPONE = new Set(["Real", "Nat", "Int", "Rat", "Complex", "Finset", "Set", "Polynomial"]);

const PARI = { ")": "(", "]": "[", "}": "{", "⌋": "⌊", "⌉": "⌈" };

const jeCrka = (c) => /[A-Za-z]/.test(c) || GRSKE.includes(c);
const jeStevka = (c) => /[0-9]/.test(c);

function preveriIme(ime) {
  // Spremenljivka: ena črka, nato samo števke, »_« in števke ali indeksi (x, x1, x_1, a₁).
  if (new RegExp(`^[A-Za-z${GRSKE}](?:_?[0-9]+|[${INDEKSI}]+)?$`).test(ime)) return null;
  if (BESEDE.has(ime)) return null;
  const deli = ime.split(".");
  if (deli.length >= 2 && PREDPONE.has(deli[0]) && deli.slice(1).every((d) => /^[A-Za-z][A-Za-z0-9_]*$/.test(d))) return null;
  return `ime »${ime.slice(0, 40)}« ni dovoljeno`;
}

/**
 * Preveri trditev. Vrne { ok: true, trditev } (presledki na robu odrezani) ali { ok: false, razlog }.
 * Razlog je kratek in ne ponovi dolgega besedila.
 */
export function preveriTrditev(vhod) {
  if (typeof vhod !== "string") return { ok: false, razlog: "trditev ni besedilo" };
  const s = vhod.trim();
  if (!s) return { ok: false, razlog: "prazna trditev" };
  if (s.length > NAJVEC_ZNAKOV) return { ok: false, razlog: `predolga trditev (največ ${NAJVEC_ZNAKOV} znakov)` };
  if (s.normalize("NFC") !== s) return { ok: false, razlog: "znaki niso v obliki NFC" };
  for (const [vzorec, razlog] of [
    [":=", "»:=« ni dovoljen"],
    ["--", "komentar ni dovoljen"],
    ["/-", "komentar ni dovoljen"],
    ["-/", "komentar ni dovoljen"],
  ]) {
    if (s.includes(vzorec)) return { ok: false, razlog };
  }
  const sklad = [];
  let abs = 0;
  let norma = 0;
  let i = 0;
  const znaki = [...s]; // po kodnih točkah (ne po polovicah UTF-16)
  while (i < znaki.length) {
    const c = znaki[i];
    if (c === " ") {
      i++;
      continue;
    }
    if (jeCrka(c) || c === "_") {
      let j = i;
      while (j < znaki.length && (jeCrka(znaki[j]) || jeStevka(znaki[j]) || znaki[j] === "_" || znaki[j] === "." || INDEKSI.includes(znaki[j]))) j++;
      let ime = znaki.slice(i, j).join("");
      // pika na koncu (npr. »x.«) ni del imena
      while (ime.endsWith(".")) ime = ime.slice(0, -1);
      if (ime === "_") {
        i += 1;
        continue;
      }
      const napaka = preveriIme(ime);
      if (napaka) return { ok: false, razlog: napaka };
      i += [...ime].length;
      continue;
    }
    if (jeStevka(c)) {
      while (i < znaki.length && jeStevka(znaki[i])) i++;
      continue;
    }
    if (INDEKSI.includes(c)) return { ok: false, razlog: "indeks brez imena" };
    if (!ZNAKI.has(c)) {
      const k = c.codePointAt(0).toString(16).toUpperCase().padStart(4, "0");
      return { ok: false, razlog: `znak U+${k} ni dovoljen` };
    }
    if ("([{⌊⌈".includes(c)) sklad.push(c);
    else if (PARI[c]) {
      if (sklad.pop() !== PARI[c]) return { ok: false, razlog: "oklepaji niso uravnoteženi" };
    } else if (c === "|") abs++;
    else if (c === "‖") norma++;
    i++;
  }
  if (sklad.length) return { ok: false, razlog: "oklepaji niso uravnoteženi" };
  if (abs % 2 || norma % 2) return { ok: false, razlog: "absolutne vrednosti niso v parih" };
  return { ok: true, trditev: s };
}

// Taktike, ki jih delavec poskusi po vrsti (vsaka v svojem izreku iste datoteke). Brez polyrith (uporablja
// omrežje), brez native_decide (ni dokaz v jedru).
export const TAKTIKE = ["norm_num", "simp", "ring", "ring_nf", "linarith", "nlinarith", "positivity", "omega", "decide", "field_simp"];
export const DOVOLJENI_AKSIOMI = ["propext", "Classical.choice", "Quot.sound"];
export const IZIDI = ["proved", "failed", "rejected", "timeout"];
export const NAJVEC_SPOROCILA = 2000;

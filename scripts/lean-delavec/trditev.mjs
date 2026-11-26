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
//   - števila (največ 12 števk; eksponent največ 1000, brez potence potence: varovalo pomnilnika).
// Poleg tega: vsaka vezana spremenljivka ima tip, števila imajo tip (glej preveriVezave, preveriTipe).
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

// Meje števil (DoS na prenosniku, docs/lean.md): GMP pri potenci ne pogleda meje pomnilnika Leana (-M), zato
// število največ 12 števk, eksponent kot število največ 1000 in nobena potenca potence (a^b^c, (a^b)^c, (a^b)²).
export const NAJVEC_STEVK = 12;
export const NAJVEC_EKSPONENT = 1000;
const POTENCE = new Set(["^", "²", "³"]);
const SPREMENLJIVKA = new RegExp(`^[A-Za-z${GRSKE}](?:_?[0-9]+|[${INDEKSI}]+)?$`);
// Tip za »:« (pripis tipa). Brez pripisa Lean števila privzame v ℕ (2 - 3 = 0), zato vsaj en pripis.
const TIPI = new Set(["ℝ", "ℤ", "ℚ", "ℕ", "ℂ", "Fin", "Set", "Finset", "Real", "Nat", "Int", "Rat", "Complex", "Polynomial"]);

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
  const zetoni = []; // { v, vrsta: "ime" | "st" | "z", tesno: brez presledka pred njim }
  while (i < znaki.length) {
    const c = znaki[i];
    const tesno = i > 0 && znaki[i - 1] !== " ";
    if (c === " ") {
      i++;
      continue;
    }
    if (jeCrka(c) || c === "_") {
      let j = i;
      // »!« takoj za imenom je del imena (Lean: x!, Nat.foo!), zato ga filter vidi in zavrne.
      while (j < znaki.length && (jeCrka(znaki[j]) || jeStevka(znaki[j]) || znaki[j] === "_" || znaki[j] === "." || znaki[j] === "!" || INDEKSI.includes(znaki[j]))) j++;
      let ime = znaki.slice(i, j).join("");
      // pika na koncu (npr. »x.«) ni del imena
      while (ime.endsWith(".")) ime = ime.slice(0, -1);
      if (ime === "_") {
        zetoni.push({ v: "_", vrsta: "z", tesno });
        i += 1;
        continue;
      }
      const napaka = preveriIme(ime);
      if (napaka) return { ok: false, razlog: napaka };
      zetoni.push({ v: ime, vrsta: "ime", tesno });
      i += [...ime].length;
      continue;
    }
    if (jeStevka(c)) {
      let j = i;
      while (j < znaki.length && jeStevka(znaki[j])) j++;
      if (j - i > NAJVEC_STEVK) return { ok: false, razlog: `število z več kot ${NAJVEC_STEVK} števkami` };
      zetoni.push({ v: znaki.slice(i, j).join(""), vrsta: "st", tesno });
      i = j;
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
    const prej = zetoni[zetoni.length - 1];
    if (c === ">" && tesno && prej?.v === "=") prej.v = "=>";
    else zetoni.push({ v: c, vrsta: "z", tesno });
    i++;
  }
  if (sklad.length) return { ok: false, razlog: "oklepaji niso uravnoteženi" };
  if (abs % 2 || norma % 2) return { ok: false, razlog: "absolutne vrednosti niso v parih" };
  const napaka = preveriPotence(zetoni) || preveriVezave(zetoni) || preveriTipe(zetoni);
  if (napaka) return { ok: false, razlog: napaka };
  return { ok: true, trditev: s };
}

const ODPRI = new Set(["(", "[", "{", "⌊", "⌈"]);
const ZAPRI = new Set([")", "]", "}", "⌋", "⌉"]);
/** Indeks zaklepaja, ki zapre oklepaj na k (oklepaji so že uravnoteženi). */
function zaklepaj(z, k) {
  let d = 0;
  for (let j = k; j < z.length; j++) {
    if (ODPRI.has(z[j].v)) d++;
    else if (ZAPRI.has(z[j].v) && --d === 0) return j;
  }
  return z.length - 1;
}
/** Indeks oklepaja, ki odpre zaklepaj na k. */
function oklepaj(z, k) {
  let d = 0;
  for (let j = k; j >= 0; j--) {
    if (ZAPRI.has(z[j].v)) d++;
    else if (ODPRI.has(z[j].v) && --d === 0) return j;
  }
  return 0;
}

function preveriPotence(z) {
  for (let k = 0; k < z.length; k++) {
    if (!POTENCE.has(z[k].v)) continue;
    const prej = z[k - 1];
    if (!prej) return "potenca brez osnove";
    // osnova ne sme biti potenca: x²², x² ^ 3, (a^b)^c, (a^b)²
    if (POTENCE.has(prej.v)) return "potenca potence ni dovoljena";
    if (ZAPRI.has(prej.v) && z.slice(oklepaj(z, k - 1), k).some((t) => POTENCE.has(t.v))) return "potenca potence ni dovoljena";
    if (z[k].v !== "^") continue;
    const e = z[k + 1];
    let konec;
    if (!e) return "potenca brez eksponenta";
    if (e.vrsta === "st") {
      if (Number(e.v) > NAJVEC_EKSPONENT) return `eksponent največ ${NAJVEC_EKSPONENT}`;
      konec = k + 1;
    } else if (e.vrsta === "ime" && SPREMENLJIVKA.test(e.v)) konec = k + 1;
    else if (e.v === "(") {
      konec = zaklepaj(z, k + 1);
      for (const t of z.slice(k + 2, konec)) {
        if (POTENCE.has(t.v)) return "potenca potence ni dovoljena";
        if (t.vrsta === "st" && Number(t.v) > NAJVEC_EKSPONENT) return `eksponent največ ${NAJVEC_EKSPONENT}`;
        if (t.vrsta === "ime" && !SPREMENLJIVKA.test(t.v) && !TIPI.has(t.v)) return "v eksponentu so samo števila in spremenljivke";
      }
    } else return "v eksponentu so samo števila in spremenljivke";
    if (z[konec + 1] && POTENCE.has(z[konec + 1].v)) return "potenca potence ni dovoljena";
  }
  return null;
}

// Vsaka vezana spremenljivka (∀, ∃, fun) ima zapisan tip: ∀ x : ℝ, … ali ∀ (x : ℝ) (n : ℕ), …; ne »∀ x, …«,
// »∀ x > 0, …« ali »∃ x ∈ S, …«. Brez tipa Lean vzame ℕ (ali tip iz okolice), kar da napačne »dokaze«.
function preveriVezave(z) {
  for (let k = 0; k < z.length; k++) {
    const v = z[k].v;
    if (v !== "∀" && v !== "∃" && v !== "fun") continue;
    let a = k + 1;
    if (v === "∃" && z[a]?.v === "!") a++;
    const konci = v === "fun" ? ["=>", "↦"] : [","];
    let b = a;
    let d = 0;
    while (b < z.length && !(d === 0 && konci.includes(z[b].v))) {
      if (ODPRI.has(z[b].v)) d++;
      else if (ZAPRI.has(z[b].v)) d--;
      if (d < 0) break;
      b++;
    }
    if (b >= z.length || d !== 0 || b === a) return "vezava brez tipa (piši npr. ∀ x : ℝ, …)";
    const del = z.slice(a, b);
    if (ODPRI.has(del[0].v)) {
      // skupine (x y : ℝ) {n : ℕ}: vsaka ima »:« na prvi ravni, zunaj skupin ni ničesar
      for (let j = 0; j < del.length; ) {
        if (!ODPRI.has(del[j].v)) return "vezava brez tipa (piši npr. ∀ x : ℝ, …)";
        const kz = zaklepaj(del, j);
        let dd = 0;
        let dvopicje = false;
        for (let q = j + 1; q < kz; q++) {
          if (ODPRI.has(del[q].v)) dd++;
          else if (ZAPRI.has(del[q].v)) dd--;
          else if (dd === 0 && del[q].v === ":") dvopicje = true;
        }
        if (!dvopicje) return "vezava brez tipa (piši npr. ∀ x : ℝ, …)";
        j = kz + 1;
      }
    } else {
      const p = del.findIndex((t) => t.v === ":");
      if (p < 1 || del.slice(0, p).some((t) => t.vrsta !== "ime" || !SPREMENLJIVKA.test(t.v))) return "vezava brez tipa (piši npr. ∀ x : ℝ, …)";
    }
  }
  return null;
}

// Števila brez pripisa tipa Lean privzame v ℕ: »2 - 3 = 0« bi bil »dokazan«. Trditev s števili zato vsaj enkrat
// pove tip (spremenljivka ali število: ∀ x : ℝ, … ali (2 : ℝ)). Deljenje z ničlo (x / 0 = 0 v Leanu) je zavrnjeno.
function preveriTipe(z) {
  for (let k = 0; k < z.length - 1; k++) {
    if (z[k].v !== "/") continue;
    const n = z[k + 1].v === "(" ? z[k + 2] : z[k + 1];
    if (n?.vrsta === "st" && /^0+$/.test(n.v) && z[z.indexOf(n) + 1]?.v !== ".") return "deljenje z 0 ni dovoljeno";
  }
  if (!z.some((t) => t.vrsta === "st")) return null;
  const pripis = z.some((t, k) => t.v === ":" && z[k + 1] && TIPI.has(z[k + 1].v));
  return pripis ? null : "števila brez tipa (piši npr. (2 : ℝ) ali ∀ x : ℝ, …)";
}

// Taktike, ki jih delavec poskusi po vrsti (vsaka v svojem izreku iste datoteke). Brez polyrith (uporablja
// omrežje), brez native_decide (ni dokaz v jedru).
export const TAKTIKE = ["norm_num", "simp", "ring", "ring_nf", "linarith", "nlinarith", "positivity", "omega", "decide", "field_simp"];
export const DOVOLJENI_AKSIOMI = ["propext", "Classical.choice", "Quot.sound"];
// »napaka«: delavec ni pripravljen (manjka Lean ali Mathlib, ni se zagnal); ni izid trditve, naloga gre nazaj v vrsto.
export const IZIDI = ["proved", "failed", "rejected", "timeout", "napaka"];
export const NAJVEC_SPOROCILA = 2000;

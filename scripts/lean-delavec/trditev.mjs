// Strogi filter matematične trditve za Lean (docs/lean.md, L5). Isti modul uporabljata strežnik (server/lean-vrsta.js,
// ob vpisu v vrsto) in delavec na prenosniku (delavec.mjs, pred vsakim zagonom Leana). Brez uvozov: delavec ga
// kopira na Windows kot samostojno datoteko.
//
// Zakaj tako strogo: Lean lahko izvaja programe (#eval, run_cmd, elab, macro, initialize, IO, attribute
// [implemented_by] …). Ukaz se v datoteki Lean vedno začne z znakom (#, @[, /--) ali z besedo (open, def, elab …),
// tudi sredi vrstice in po napaki razčlenjevanja (Lean se ujame na naslednjem ukazu). Zato filter ne išče
// prepovedanih besed (seznam ukazov Mathliba je dolg in raste), ampak spusti SAMO:
//   - znake z belega seznama (ena vrstica, brez narekovajev, #, @, ;, «», \, `, $, ⟨⟩, ·, ∏, komentarjev);
//   - imena: ena črka (latinska ali grška) s števkami ali indeksi (x, x1, x_2, a₁) in imena z belega seznama
//     (BESEDE, IMENA: izbrana posebej, nobeno ne zna sestaviti ogromnega števila: ni pow, shiftLeft, factorial,
//     choose, iterate, repeat, fib, rpow …);
//   - števila (največ 12 števk, za njimi ne sme biti črka ali pika: 0x…, 1e5, 2x).
// Pomnilnik (Lean računa z GMP, ki ne pogleda meje -M): eksponent je eno število ≤ 1000 ali ena spremenljivka,
// nobena potenca potence, `fun` samo kot argument `deriv` (ni beta-redukcije na velikem številu), meje Finset.range
// in Fin največ 100. Filter ni popoln dokaz, da Lean ne porabi veliko pomnilnika: trdo mejo postavi delavec
// (Job Object na Windows, ulimit -v na Linuxu; docs/lean.md).
// Tipi: vsaka vezava ima tip; vsak del trditve med ∧ ∨ → ↔ ¬ , => s števili ima tipizirano spremenljivko ali pripis
// tipa; odštevanje dveh golih števil (ℕ: 2 - 3 = 0) in deljenje z izrazom, ki je lahko 0, sta zavrnjena.
// Nobena beseda z belega seznama ne začne ukaza, zato v trditev ni mogoče skriti ukaza. Trditev nikoli ne
// vsebuje »:=«, »by«, komentarja, nove vrstice ali neuravnoteženih oklepajev. Ker so dovoljena le kratka imena
// spremenljivk in matematična imena, trditev ne more nositi osebnih podatkov (imen, e-naslovov, besedila).

export const NAJVEC_ZNAKOV = 1000;

// Dovoljeni znaki poleg črk, števk in presledka (brez ».«: pika je samo v imenu ali decimalnem številu).
const ZNAKI = new Set([..."()[]{}+-*/^=<>,:|!%", ..."ℝℕℤℚℂ∀∃¬∧∨→↔≤≥≠•∑∈∉⊆⊂⊇⊃∩∪∅√∣⌊⌋⌈⌉∘×⁻¹²³↑↦‖∞π"]);
const GRSKE = "αβγδεζηθικμνξοπρστυφχψωΓΔΘΛΞΠΣΦΨΩ"; // brez λ (to je »fun«)
const INDEKSI = "₀₁₂₃₄₅₆₇₈₉";

// Besede brez predpone. Nobena ne začne ukaza Lean ali Mathlib in nobena ne sestavi velikega števila.
export const BESEDE = new Set([
  "fun", "deriv", "abs", "max", "min", "True", "False", "Real", "Nat", "Int", "Rat", "Complex",
  "Finset", "Set", "Even", "Odd", "Prime", "Irrational", "Fin",
  // z »open Real« v predlogi delavca
  "sqrt", "exp", "log", "sin", "cos", "tan", "arctan", "arcsin", "arccos", "sinh", "cosh", "logb", "cot",
]);
// Imena s predpono: izrecen seznam (ne predpone), vsako preverjeno, da ne zna sestaviti ogromnega števila.
export const IMENA = new Set([
  "Real.sqrt", "Real.exp", "Real.log", "Real.logb", "Real.sin", "Real.cos", "Real.tan", "Real.cot", "Real.arctan",
  "Real.arcsin", "Real.arccos", "Real.sinh", "Real.cosh", "Real.pi",
  "Nat.Prime", "Nat.Coprime", "Nat.gcd", "Nat.lcm", "Nat.sqrt", "Nat.succ", "Nat.pred", "Nat.floor", "Nat.ceil",
  "Int.gcd", "Int.lcm", "Int.natAbs", "Int.toNat", "Int.floor", "Int.ceil", "Int.fract",
  "Complex.I", "Complex.re", "Complex.im", "Complex.abs", "Complex.exp",
  "Finset.range", "Finset.Icc", "Finset.Ico", "Finset.Ioc", "Finset.Ioo", "Finset.card",
]);
// Imena, katerih argumenti (število jih je zraven) so meje naštevanja: samo število ≤ NAJVEC_MEJA, spremenljivka ali
// oklepaj s spremenljivkami, takimi števili, + in -. Sicer `decide`/`simp` razpiše 10^12 členov.
const OMEJENI = { "Finset.range": 1, "Finset.Icc": 2, "Finset.Ico": 2, "Finset.Ioc": 2, "Finset.Ioo": 2, Fin: 1 };
export const NAJVEC_MEJA = 100;
export const NAJVEC_STEVK = 12;
export const NAJVEC_EKSPONENT = 1000;

const PARI = { ")": "(", "]": "[", "}": "{", "⌋": "⌊", "⌉": "⌈" };
const ODPRI = new Set(["(", "[", "{", "⌊", "⌈"]);
const ZAPRI = new Set([")", "]", "}", "⌋", "⌉"]);
const POTENCE = new Set(["^", "²", "³"]);
const SPREMENLJIVKA = new RegExp(`^[A-Za-z${GRSKE}](?:_?[0-9]+|[${INDEKSI}]+)?$`);
// Tip za »:« (pripis tipa). Brez pripisa Lean števila privzame v ℕ (2 - 3 = 0).
const TIPI = new Set(["ℝ", "ℤ", "ℚ", "ℕ", "ℂ", "Fin", "Set", "Finset", "Real", "Nat", "Int", "Rat", "Complex"]);
// Ločila delov trditve (za pravilo tipov) in meje operanda pri odštevanju.
const DELI = new Set(["∧", "∨", "→", "↔", "¬", ",", "=>", "↦"]);
const MEJE_OPERANDA = new Set([...DELI, "+", "-", "=", "<", ">", "≤", "≥", "≠", "∈", "∉", "⊆", "⊂", "⊇", "⊃", "∣", "|", "‖", ":", "∩", "∪", "×"]);

const jeCrka = (c) => /[A-Za-z]/.test(c) || GRSKE.includes(c);
const jeStevka = (c) => /[0-9]/.test(c);
const jeSpr = (t) => t?.vrsta === "ime" && SPREMENLJIVKA.test(t.v);
const nic = (v) => /^0+(?:\.0+)?$/.test(v);
const celo = (t, meja) => t?.vrsta === "st" && /^[0-9]+$/.test(t.v) && Number(t.v) <= meja;

function preveriIme(ime) {
  if (SPREMENLJIVKA.test(ime) || BESEDE.has(ime) || IMENA.has(ime)) return null;
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
  const z = []; // žetoni { v, vrsta: "ime" | "st" | "z", tesno: brez presledka pred njim }
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
      while (ime.endsWith(".")) ime = ime.slice(0, -1); // pika na koncu ni del imena (in je nato zavrnjena)
      if (ime === "_") return { ok: false, razlog: "»_« ni dovoljen (napiši tip ali vrednost)" };
      const napaka = preveriIme(ime);
      if (napaka) return { ok: false, razlog: napaka };
      z.push({ v: ime, vrsta: "ime", tesno });
      i += [...ime].length;
      continue;
    }
    if (jeStevka(c)) {
      let j = i;
      while (j < znaki.length && jeStevka(znaki[j])) j++;
      if (znaki[j] === "." && jeStevka(znaki[j + 1] ?? "")) for (j++; j < znaki.length && jeStevka(znaki[j]); ) j++;
      const za = znaki[j];
      // Lean bere 0x10, 0b1, 1e5, 2.5e3 kot eno število (1e999999999999 = 10^…), zato nič takoj za številom.
      if (za !== undefined && (jeCrka(za) || za === "_" || za === "." || INDEKSI.includes(za))) return { ok: false, razlog: "za številom ne sme biti črka, »_« ali pika (0x…, 1e5, 2x)" };
      const v = znaki.slice(i, j).join("");
      if (v.replace(".", "").length > NAJVEC_STEVK) return { ok: false, razlog: `število z več kot ${NAJVEC_STEVK} števkami` };
      z.push({ v, vrsta: "st", tesno });
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
    const prej = z[z.length - 1];
    if (c === ">" && tesno && prej?.v === "=") prej.v = "=>";
    else if (c === "¹" && tesno && prej?.v === "⁻") prej.v = "⁻¹";
    else z.push({ v: c, vrsta: "z", tesno });
    i++;
  }
  if (sklad.length) return { ok: false, razlog: "oklepaji niso uravnoteženi" };
  if (abs % 2 || norma % 2) return { ok: false, razlog: "absolutne vrednosti niso v parih" };
  const vezave = najdiVezave(z);
  if (typeof vezave === "string") return { ok: false, razlog: vezave };
  const napaka = preveriZnake(z) || preveriImenaZArgumenti(z) || preveriPotence(z) || preveriDeljenje(z) || preveriOdstevanje(z) || preveriTipe(z, vezave);
  if (napaka) return { ok: false, razlog: napaka };
  return { ok: true, trditev: s };
}

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

// Posamezni znaki: »!« samo v ∃!, »⁻« samo kot ⁻¹, »¹« samo v ⁻¹; ∑ največ dvakrat, deriv največ dvakrat, fun samo
// kot argument deriv (»deriv (fun x : ℝ => …)«; sicer (fun n : ℕ => 2^n) 999999999999 ali |f| 5 izračuna 2^…).
function preveriZnake(z) {
  let vsote = 0;
  let odvodi = 0;
  for (let k = 0; k < z.length; k++) {
    const v = z[k].v;
    if (v === "!" && z[k - 1]?.v !== "∃") return "»!« je dovoljen samo v ∃!";
    if (v === "⁻" || v === "¹") return "»⁻« je dovoljen samo kot ⁻¹";
    if (v === "∑" && ++vsote > 2) return "največ dve vsoti ∑";
    if (v === "deriv" && ++odvodi > 2) return "največ dva odvoda deriv";
    if (v === "fun" && !(z[k - 1]?.v === "(" && z[k - 2]?.v === "deriv")) return "fun je dovoljen samo kot deriv (fun x : ℝ => …)";
  }
  return null;
}

function preveriImenaZArgumenti(z) {
  const napaka = `meja v Finset.range, Finset.Icc … in Fin je število ≤ ${NAJVEC_MEJA} ali spremenljivka`;
  for (let k = 0; k < z.length; k++) {
    const st = z[k].vrsta === "ime" ? OMEJENI[z[k].v] : undefined;
    if (!st) continue;
    let j = k + 1;
    for (let a = 0; a < st; a++) {
      const t = z[j];
      if (celo(t, NAJVEC_MEJA) || jeSpr(t)) j++;
      else if (t?.v === "(") {
        const kz = zaklepaj(z, j);
        for (const u of z.slice(j + 1, kz)) if (!(celo(u, NAJVEC_MEJA) || jeSpr(u) || ["+", "-", ":", "ℕ", "ℤ"].includes(u.v))) return napaka;
        j = kz + 1;
      } else return napaka;
    }
  }
  return null;
}

// Eksponent za ^ je eno število ≤ 1000 ali ena spremenljivka (ne oklepaj: (1000*1000*1000) ali (2 - 3) v ℕ);
// v telesu fun samo število (spremenljivka iz fun dobi vrednost, npr. deriv (fun x : ℝ => 2^x) 999999999999).
// Nobena potenca potence: a^b^c, (a^b)^c, (a^b)², x²².
function preveriPotence(z) {
  const vFun = new Set();
  for (let k = 0; k < z.length; k++) if (z[k].v === "fun") for (let j = k; j < zaklepaj(z, k - 1); j++) vFun.add(j);
  for (let k = 0; k < z.length; k++) {
    if (!POTENCE.has(z[k].v)) continue;
    const prej = z[k - 1];
    if (!prej || (MEJE_OPERANDA.has(prej.v) && prej.v !== "|" && prej.v !== "‖") || ODPRI.has(prej.v)) return "potenca brez osnove";
    if (POTENCE.has(prej.v)) return "potenca potence ni dovoljena";
    if (ZAPRI.has(prej.v) && z.slice(oklepaj(z, k - 1), k).some((t) => POTENCE.has(t.v))) return "potenca potence ni dovoljena";
    if (z[k].v !== "^") {
      if (z[k + 1] && POTENCE.has(z[k + 1].v)) return "potenca potence ni dovoljena";
      continue;
    }
    const e = z[k + 1];
    if (celo(e, NAJVEC_EKSPONENT)) {
      /* v redu */
    } else if (e?.vrsta === "st") return `eksponent je celo število največ ${NAJVEC_EKSPONENT}`;
    else if (jeSpr(e)) {
      if (vFun.has(k)) return "v fun je eksponent samo število";
    } else return `eksponent je eno število ≤ ${NAJVEC_EKSPONENT} ali ena spremenljivka`;
    const za = z[k + 2];
    if (za && (POTENCE.has(za.v) || za.v === "⁻¹")) return "potenca potence ni dovoljena";
  }
  return null;
}

// Delitelj (/, %) in osnova za ⁻¹: spremenljivka, število ≠ 0 ali oklepaj (x) / (2 : ℝ). Lean ima x / 0 = 0 in
// 0⁻¹ = 0, zato bi bila »x / 0.0 = 0« ali »x / (1 - 1) = 0« dokazana.
function varenDelitelj(g) {
  if (g.length === 1) return jeSpr(g[0]) || (g[0].vrsta === "st" && !nic(g[0].v));
  return g.length === 3 && g[0].vrsta === "st" && !nic(g[0].v) && g[1].v === ":" && TIPI.has(g[2].v);
}
function preveriDeljenje(z) {
  const napaka = "deli samo s spremenljivko ali številom ≠ 0 (x / (x + 1) ni dovoljeno, ker je lahko 0)";
  for (let k = 0; k < z.length; k++) {
    if (z[k].v === "/" || z[k].v === "%") {
      const n = z[k + 1];
      if (!n) return napaka;
      const g = n.v === "(" ? z.slice(k + 2, zaklepaj(z, k + 1)) : [n];
      if (!varenDelitelj(g)) return napaka;
    } else if (z[k].v === "⁻¹") {
      const p = z[k - 1];
      if (!p) return napaka;
      const g = p.v === ")" ? z.slice(oklepaj(z, k - 1) + 1, k - 1) : [p];
      if (!varenDelitelj(g)) return napaka;
    }
  }
  return null;
}

// Operand pri odštevanju: žetoni levo/desno od »-« do prvega ločila na isti globini oklepajev.
function operand(z, k, smer) {
  const out = [];
  let d = 0;
  for (let j = k + smer; j >= 0 && j < z.length; j += smer) {
    const v = z[j].v;
    if ((smer < 0 ? ZAPRI : ODPRI).has(v)) d++;
    else if ((smer < 0 ? ODPRI : ZAPRI).has(v) && --d < 0) break;
    if (d === 0 && MEJE_OPERANDA.has(v)) break;
    out.push(z[j]);
  }
  return smer < 0 ? out.reverse() : out;
}
const tipiziran = (del) => del.some((t, q) => jeSpr(t) || (t.v === ":" && TIPI.has(del[q + 1]?.v)));
// Odštevanje dveh golih števil (brez spremenljivke in pripisa) je lahko v ℕ: 2 - 3 = 0, x ^ (5 - 7). Zavrnjeno.
function preveriOdstevanje(z) {
  for (let k = 0; k < z.length; k++) {
    if (z[k].v !== "-") continue;
    const levo = operand(z, k, -1);
    if (!levo.length) continue; // enočleni minus (-3) ali za |…|: v ℕ ni Neg, Lean javi napako
    const desno = operand(z, k, 1);
    const gol = (o) => !tipiziran(o);
    if (gol(levo) && gol(desno)) return "odštevanje števil brez tipa (ℕ: 2 - 3 = 0); piši (2 : ℝ) - 3";
  }
  return null;
}

// Vezave (∀, ∃, fun) s tipom: ∀ x : ℝ, … ali ∀ (x : ℝ) (n : ℕ), …; ne »∀ x, …«, »∀ x > 0, …«, »∃ x ∈ S, …«, »x : _«.
// Brez tipa Lean vzame ℕ (ali tip iz okolice), kar da napačne »dokaze«. Vrne razpone vezav [od, do] ali napako.
function najdiVezave(z) {
  const napaka = "vezava brez tipa (piši npr. ∀ x : ℝ, …)";
  const razponi = [];
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
    if (b >= z.length || d !== 0 || b === a) return napaka;
    const del = z.slice(a, b);
    if (ODPRI.has(del[0].v)) {
      // skupine (x y : ℝ) {n : ℕ}: vsaka ima »:« s tipom na prvi ravni, zunaj skupin ni ničesar
      for (let j = 0; j < del.length; ) {
        if (!ODPRI.has(del[j].v)) return napaka;
        const kz = zaklepaj(del, j);
        let dd = 0;
        let p = -1;
        for (let q = j + 1; q < kz; q++) {
          if (ODPRI.has(del[q].v)) dd++;
          else if (ZAPRI.has(del[q].v)) dd--;
          else if (dd === 0 && del[q].v === ":" && p < 0) p = q;
        }
        if (p < j + 2 || !TIPI.has(del[p + 1]?.v) || del.slice(j + 1, p).some((t) => !jeSpr(t))) return napaka;
        j = kz + 1;
      }
    } else {
      const p = del.findIndex((t) => t.v === ":");
      if (p < 1 || !TIPI.has(del[p + 1]?.v) || del.slice(0, p).some((t) => !jeSpr(t))) return napaka;
    }
    razponi.push([k, b]);
  }
  return razponi;
}

// Lean števila brez tipa privzame v ℕ: »2 - 3 = 0« bi bil »dokazan«. En pripis nekje v trditvi ne tipizira drugih
// števil (»(1:ℝ) = 1 ∧ 2 - 3 = 0«), zato: vsak del med ∧ ∨ → ↔ ¬ , => (vezave izvzete) s števili ima
// spremenljivko (vse imajo tip) ali pripis tipa.
function preveriTipe(z, vezave) {
  const loci = new Set();
  for (const [od, doK] of vezave) for (let j = od; j <= doK; j++) loci.add(j);
  let del = [];
  for (let k = 0; k <= z.length; k++) {
    if (k === z.length || loci.has(k) || DELI.has(z[k].v)) {
      if (del.some((t) => t.vrsta === "st") && !tipiziran(del)) return "števila brez tipa (piši npr. (2 : ℝ) ali ∀ x : ℝ, …) v vsakem delu trditve";
      del = [];
    } else del.push(z[k]);
  }
  return null;
}

// Taktike, ki jih delavec poskusi po vrsti (vsaka v svojem izreku iste datoteke). Brez polyrith (uporablja
// omrežje), brez native_decide (ni dokaz v jedru).
export const TAKTIKE = ["norm_num", "simp", "ring", "ring_nf", "linarith", "nlinarith", "positivity", "omega", "decide", "field_simp"];
export const DOVOLJENI_AKSIOMI = ["propext", "Classical.choice", "Quot.sound"];
// »napaka«: delavec ni pripravljen (manjka Lean ali Mathlib, ni se zagnal); ni izid trditve, naloga gre nazaj v vrsto.
export const IZIDI = ["proved", "failed", "rejected", "timeout", "napaka"];
export const NAJVEC_SPOROCILA = 2000;

// Predloga datoteke Lean in branje izpisa (docs/lean.md, L5). Datoteko sestavi delavec sam: iz naloge vzame samo
// trditev, ki je prestala filter (trditev.mjs). Prva vrstica za glavo je preverba tipov (#check trditve z izpisom
// vseh implicitnih argumentov), nato je vsaka taktika svoj izrek v svoji vrstici, za njim #print axioms.
import { TAKTIKE, DOVOLJENI_AKSIOMI, NAJVEC_SPOROCILA, preveriTrditev } from "./trditev.mjs";

export const GLAVA = ["import Mathlib", "set_option autoImplicit false", "open Real"];
export const ime = (k) => `evklid_t${k + 1}`;
const vrsticaTaktike = (trditev, k, t) => `theorem ${ime(k)} : ${trditev} := by intros; ${t}`;

/**
 * Natančno besedilo, ki ga je Lean preveril za dokaz s taktiko (glava + vrstica izreka): iz njega strežnik naredi
 * dokaz.izrek in sha256, ki ju lahko kdorkoli ponovi (lean.md). null, če taktika ni znana.
 */
export function izrekDokaza(trditev, taktika) {
  const k = TAKTIKE.indexOf(taktika);
  if (k < 0) return null;
  return [...GLAVA, vrsticaTaktike(trditev, k, taktika)].join("\n") + "\n";
}
// Preverba tipov: Lean trditev elaborira (kot v izreku) in izpiše izraz z vsemi tipi (@HSub.hSub Nat …, brez zapisov
// ∑ ↑ in brez skrajšav ⋯). Iz izpisa delavec vidi, v katerem tipu Lean računa, česar filter iz besedila ne more.
const PP = ["pp.explicit true", "pp.notation false", "pp.fieldNotation false", "pp.funBinderTypes true", "pp.proofs true", "pp.deepTerms true", "pp.maxSteps 100000000", "format.width 1000000"].map((o) => `set_option ${o} in`).join(" ");
export const vrsticaPreverbe = (trditev) => `${PP} #check (${trditev} : Prop)`;
const VRSTICA_PREVERBE = GLAVA.length + 1;
// Vrstica (od 1) izreka k in njegovega #print axioms.
const vrsticaIzreka = (k) => GLAVA.length + 2 + 2 * k;

// Kar je v Leanu drugače kot v šoli in ga filter iz besedila ne vidi (∑-indeks je ℕ, {x | …}, ↑(7 / 2), pari, Fin …).
// BELI SEZNAM (pregledi r3var, r3fun PR #1172): izpis je s pp.explicit, zato ima vsaka operacija tipe kot prve
// argumente (@HSub.hSub Nat Nat Nat …). Dovoljeno je samo:
//   - + * (in •) v ℕ, ℤ, ℝ, ℚ, ℂ; - / ⁻¹ in negacija samo v ℝ, ℚ, ℂ (negacija v ℤ samo števila: (-2:ℤ)); % nikoli;
//   - ^ z eksponentom v ℕ; v ℝ, ℚ, ℂ tudi ℤ (zpow), v ℝ tudi ℝ (rpow);
//   - števila (OfNat, decimalna OfScientific) samo v ℕ, ℤ, ℝ, ℚ, ℂ (decimalna ne v ℕ, ℤ);
//   - vsak tip v izpisu (prvi argument vsake @-aplikacije, tip vsake vezave) je sestavljen samo iz ℕ ℤ ℝ ℚ ℂ, Prop,
//     Set, Finset in →; drugo (Prod, Fin, ZMod, Float …) je zavrnjeno.
// Druga varovalka: imena primerkov in funkcij za odštevanje, deljenje in ostanek v ℕ in ℤ kjerkoli v izpisu.
// Ne zavrne (»smetne« vrednosti, ki jih mora L6 zapisati s predpostavkami, docs/lean.md): x / 0 = 0 v ℝ, sqrt in log
// negativnega, logb z osnovo 1, tan (π / 2), negativna osnova z realnim eksponentom.
const OSNOVNI = new Set(["Nat", "Int", "Real", "Rat", "Complex", "ℕ", "ℤ", "ℝ", "ℚ", "ℂ"]);
const POLJA = new Set(["Real", "Rat", "Complex", "ℝ", "ℚ", "ℂ"]);
const CELA = new Set(["Nat", "Int", "ℕ", "ℤ"]);
const TIP_ZETONI = new Set([...OSNOVNI, "Prop", "Set", "Finset", "→"]);
const PREPOVEDANA_IMENA = /(?<![\w.'])(?:instSubNat|Nat\.instDiv|Nat\.instMod|Int\.instDivInt|Int\.instModInt|Int\.instDiv|Int\.instMod|Int\.instSub|Fin\.instOfNat|Nat\.(?:sub|div|mod|pred|sqrt|floor|ceil|log)|Int\.(?:sub|div|ediv|emod|tdiv|tmod|fdiv|fmod|bdiv|bmod|toNat))(?![\w.'])/;
const OPERACIJE = /(?<![\w.'])@?(HAdd\.hAdd|HSub\.hSub|HMul\.hMul|HDiv\.hDiv|HMod\.hMod|HPow\.hPow|HSMul\.hSMul|Neg\.neg|Inv\.inv|OfNat\.ofNat|OfScientific\.ofScientific)(?![\w.'])/g;
const ZNAK = { "HAdd.hAdd": "+", "HSub.hSub": "-", "HMul.hMul": "*", "HDiv.hDiv": "/", "HMod.hMod": "%", "HPow.hPow": "^", "HSMul.hSMul": "•", "Neg.neg": "negacija", "Inv.inv": "⁻¹" };
const IME_TIPA = { Nat: "ℕ", Int: "ℤ", Real: "ℝ", Rat: "ℚ", Complex: "ℂ" };
const kratko = (t) => (t.length > 40 ? t.slice(0, 39) + "…" : t);

/** Argumenti za položajem k v normaliziranem izpisu: oklepaj v celoti ali žeton do presledka ali oklepaja. */
function argumenti(s, k, n) {
  const out = [];
  let i = k;
  while (out.length < n) {
    while (s[i] === " ") i++;
    if (i >= s.length || s[i] === ")") break;
    let j = i;
    if (s[i] === "(") {
      let d = 0;
      for (; j < s.length; j++) {
        if (s[j] === "(") d++;
        else if (s[j] === ")" && --d === 0) break;
      }
      j++;
    } else while (j < s.length && !" ()".includes(s[j])) j++;
    out.push(s.slice(i, j));
    i = j;
  }
  return out;
}
const golTip = (t) => t.replace(/^\((.*)\)$/, "$1").trim();
const jeDovoljenTip = (t) => t.replace(/[()]/g, " ").split(" ").filter(Boolean).every((z) => TIP_ZETONI.has(z));
// Prvi argument @-aplikacije je (po dogovoru Leana) tip, če je ime z veliko začetnico ali oklepaj, ki se začne z njim.
const videtiTip = (t) => /^\(?[A-Z][\w']*(?:\.[A-Z][\w']*)*(?:[ )]|$)/.test(t);

function preveriOperacijo(op, tipi, ostalo) {
  const [a, b, c] = tipi.map(golTip);
  if (op === "OfNat.ofNat") return OSNOVNI.has(a) ? null : `število v tipu ${kratko(a)}`;
  if (op === "OfScientific.ofScientific") return POLJA.has(a) ? null : `decimalno število v tipu ${kratko(a)} (piši (0.5 : ℝ))`;
  if (op === "HMod.hMod") return "ostanek % (Lean: x % 0 = x); piši Even, Odd ali ∣";
  const ime = IME_TIPA[a] || a;
  if (op === "Neg.neg" || op === "Inv.inv") {
    if (POLJA.has(a)) return null;
    // negativno celo število (−2 : ℤ), npr. eksponent (3:ℝ)^(-2:ℤ): brez smetne vrednosti
    if (op === "Neg.neg" && a === "Int" && /^\(@OfNat\.ofNat Int \(nat_lit \d+\) /.test(ostalo[2] ?? "")) return null;
    return `${ZNAK[op]} v ${kratko(ime)} (v ℕ in ℤ samo + * ^); piši v ℝ`;
  }
  if (!(OSNOVNI.has(a) && OSNOVNI.has(b) && OSNOVNI.has(c))) return `računanje v tipu ${kratko(a === b ? a : `${a}, ${b}`)}`;
  if (op === "HPow.hPow") {
    if (a !== c) return `potenca v tipu ${kratko(c)}`;
    if (b === "Nat" || (b === "Int" && POLJA.has(a)) || (b === "Real" && a === "Real")) return null;
    return `eksponent v ${IME_TIPA[b] || b} pri osnovi v ${ime}`;
  }
  if (op === "HSMul.hSMul") return null;
  if (op === "HAdd.hAdd" || op === "HMul.hMul") return a === b && b === c ? null : `računanje v tipu ${kratko(c)}`;
  // HSub, HDiv
  if (POLJA.has(a) && a === b && b === c) return null;
  if (a === "Nat" && op === "HSub.hSub") return "odštevanje v ℕ (Lean: 2 - 3 = 0); piši v ℝ";
  if (CELA.has(a)) return op === "HSub.hSub" ? `odštevanje v ${ime} (v ℕ in ℤ samo + * ^); piši v ℝ` : `deljenje v ${ime} (Lean: 7 / 2 = 3); piši v ℝ`;
  return `${ZNAK[op]} v tipu ${kratko(a)}`;
}

/** Razlog, zakaj je elaborirana trditev (izpis #check s pp.explicit) zavrnjena, ali null. */
export function preveriElaboracijo(izpis) {
  if (typeof izpis !== "string" || !izpis.trim()) return "ni izpisa tipov";
  const s = izpis.replace(/\s+/g, " ").trim();
  if (s.includes("⋯")) return "izpis tipov je skrajšan";
  if (/(?<![\w.'])Float(?![\w.'])/.test(s)) return "Float (decimalno število brez tipa; piši (0.5 : ℝ))";
  for (const m of s.matchAll(OPERACIJE)) {
    const op = m[1];
    const enTip = op === "Neg.neg" || op === "Inv.inv" || op.startsWith("Of");
    const args = argumenti(s, m.index + m[0].length, 3);
    const tipi = args.slice(0, enTip ? 1 : 3);
    if (tipi.length < (enTip ? 1 : 3)) return `ne razumem izpisa pri ${op}`;
    const r = preveriOperacijo(op, tipi, args);
    if (r) return r;
  }
  // tip vsake vezave: ∀ (x y : T), fun (x : T) =>
  for (const m of s.matchAll(/(?:∀ |fun |∃ |\) )\(([^\s():]+(?: [^\s():]+)*) : /g)) {
    const [t] = argumenti("(" + s.slice(m.index + m[0].length), 0, 1);
    const tip = t.slice(1, -1);
    if (!jeDovoljenTip(tip)) return `vezava v tipu ${kratko(tip)}`;
  }
  // prvi argument vsake @-aplikacije, ki je tip (@Eq (Prod Nat Nat), @LT.lt (Fin 5), @Membership.mem Real (Set Real) …)
  for (const m of s.matchAll(/@[\w.']+ /g)) {
    const [t] = argumenti(s, m.index + m[0].length, 1);
    if (t && videtiTip(t) && !jeDovoljenTip(t)) return `tip ${kratko(golTip(t))} (dovoljeni ℕ ℤ ℝ ℚ ℂ, Set, Finset)`;
  }
  const ime = s.match(PREPOVEDANA_IMENA);
  if (ime) return `${ime[0]} (v ℕ, ℤ ali Fin Lean računa drugače kot šola)`;
  return null;
}

/** Besedilo datoteke Lean za trditev. Vrže napako, če trditev ne prestane filtra (dvojna varovalka). */
export function predloga(trditev, taktike = TAKTIKE) {
  const f = preveriTrditev(trditev);
  if (!f.ok) throw new Error(`trditev zavrnjena: ${f.razlog}`);
  if (/[\r\n]/.test(f.trditev)) throw new Error("trditev zavrnjena: nova vrstica");
  const vrstice = [...GLAVA, vrsticaPreverbe(f.trditev)];
  taktike.forEach((t, k) => {
    if (!TAKTIKE.includes(t)) throw new Error(`taktika ${t} ni dovoljena`);
    vrstice.push(vrsticaTaktike(f.trditev, k, t), `#print axioms ${ime(k)}`);
  });
  return vrstice.join("\n") + "\n";
}

const skrajsaj = (s, n = NAJVEC_SPOROCILA) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

/**
 * Izid iz izpisa `lean --json` (eno sporočilo na vrstico). Najprej preverba tipov: če Lean trditev razume drugače kot
 * šola (preveriElaboracijo), je izid »rejected«. Izrek k je dokazan, ko je preverba tipov izpisana in čista, v
 * njegovi vrstici ni napake ne opozorila o sorry in #print axioms našteje samo dovoljene aksiome. Prvi tak izrek zmaga.
 * Vrne { izid: "proved" | "failed" | "rejected" | "napaka", taktika?, aksiomi?, sporocilo }. »napaka« pomeni
 * pokvarjeno namestitev, ne trditve: napaka v glavi (npr. manjka ali je zastarel Mathlib) ali nobena vrstica
 * #print axioms ni dala nobenega sporočila (Lean se sploh ni izvedel). Takrat delavec ne sme poslati »failed« (lean.md).
 */
export function preberiIzpis(izpis, taktike = TAKTIKE) {
  const sporocila = [];
  for (const v of String(izpis).split("\n")) {
    if (!v.trim().startsWith("{")) continue;
    try {
      const m = JSON.parse(v);
      if (m && typeof m === "object") sporocila.push(m);
    } catch {
      /* nepopolna vrstica (ubit proces) */
    }
  }
  const vVrstici = (n) => sporocila.filter((m) => m?.pos?.line === n);
  const glava = sporocila.find((m) => m.severity === "error" && m.pos?.line <= GLAVA.length);
  if (glava) return { izid: "napaka", sporocilo: skrajsaj(`napaka v glavi (namestitev Mathliba?): ${String(glava.data)}`) };
  const preverba = vVrstici(VRSTICA_PREVERBE);
  const tipi = preverba.find((m) => m.severity === "information" && typeof m.data === "string");
  let prvaNapaka = preverba.find((m) => m.severity === "error") || null;
  // Napaka v preverbi (npr. neznano ime): izpis je delno sorry, zato ga ne beremo in izid ni nikoli »proved«.
  if (tipi && !prvaNapaka) {
    const razlog = preveriElaboracijo(tipi.data);
    if (razlog) return { izid: "rejected", sporocilo: `Lean trditev razume drugače kot šola: ${razlog}` };
  }
  for (let k = 0; k < taktike.length && tipi && !preverba.some((m) => m.severity === "error"); k++) {
    const izrek = vVrstici(vrsticaIzreka(k));
    const napaka = izrek.find((m) => m.severity === "error" || /sorry/i.test(String(m.data)));
    if (napaka) {
      prvaNapaka ||= napaka;
      continue;
    }
    const ax = vVrstici(vrsticaIzreka(k) + 1).map((m) => String(m.data)).find((d) => d.includes(`'${ime(k)}'`));
    if (!ax) continue;
    let aksiomi;
    if (ax.includes("does not depend on any axioms")) aksiomi = [];
    else {
      const m = ax.match(/depends on axioms: \[([^\]]*)\]/);
      if (!m) continue;
      aksiomi = m[1].split(",").map((a) => a.trim()).filter(Boolean);
    }
    if (aksiomi.some((a) => !DOVOLJENI_AKSIOMI.includes(a))) continue;
    return { izid: "proved", taktika: taktike[k], aksiomi, sporocilo: `dokazano s taktiko ${taktike[k]}` };
  }
  if (!taktike.some((_, k) => vVrstici(vrsticaIzreka(k) + 1).length)) return { izid: "napaka", sporocilo: "Lean ni izpisal nobenega izida (namestitev?)" };
  // Brez izpisa tipov (in brez napake v tej vrstici) nikoli »proved«: varno zavrnemo.
  if (!tipi && !preverba.some((m) => m.severity === "error")) return { izid: "rejected", sporocilo: "Lean ni izpisal tipov trditve" };
  const opis = prvaNapaka ? String(prvaNapaka.data) : "nobena taktika ni dokazala trditve";
  return { izid: "failed", sporocilo: skrajsaj(`nobena taktika ni uspela; prva napaka: ${opis}`) };
}

/** Sporočilo brez poti na disku in uporabniškega imena (pošlje se na strežnik). */
export function ocistiSporocilo(s, poti = []) {
  let out = String(s ?? "");
  for (const p of poti.filter(Boolean).sort((a, b) => b.length - a.length)) out = out.split(p).join("…");
  out = out.replace(/[A-Za-z]:\\Users\\[^\\\s]+/gi, "…").replace(/\/(?:home|Users)\/[^/\s]+/g, "…");
  out = out.replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, "");
  return skrajsaj(out);
}

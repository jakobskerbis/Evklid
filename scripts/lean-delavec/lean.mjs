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
const PP = ["pp.explicit true", "pp.notation false", "pp.proofs true", "pp.deepTerms true", "pp.maxSteps 100000000"].map((o) => `set_option ${o} in`).join(" ");
export const vrsticaPreverbe = (trditev) => `${PP} #check (${trditev} : Prop)`;
const VRSTICA_PREVERBE = GLAVA.length + 1;
// Vrstica (od 1) izreka k in njegovega #print axioms.
const vrsticaIzreka = (k) => GLAVA.length + 2 + 2 * k;

// Kar je v Leanu drugače kot v šoli in ga filter iz besedila ne vidi (∑-indeks je ℕ, {x | …}, ↑(7 / 2), (7 / 2) ^ n …).
// Izpis je s pp.explicit, zato ima vsaka operacija tip kot prvi argument. Ne zavrne: ℝ deljenje z izrazom (filter
// zahteva spremenljivko ali število ≠ 0), Real.sqrt in Real.log negativnega (Lean: 0) – to mora L6 zapisati s
// predpostavkami (docs/lean.md).
const NAT = "(?:Nat|ℕ)(?![\\w.'])";
const INT = "(?:Int|ℤ)(?![\\w.'])";
const PREPOVEDANO = [
  [new RegExp(`@?HSub\\.hSub ${NAT}`), "odštevanje v ℕ (Lean: 2 - 3 = 0); piši v ℝ ali ℤ"],
  [new RegExp(`@?HDiv\\.hDiv ${NAT}`), "deljenje v ℕ (Lean: 7 / 2 = 3); piši v ℝ"],
  [new RegExp(`@?HDiv\\.hDiv ${INT}`), "deljenje v ℤ (Lean: 7 / 2 = 3); piši v ℝ"],
  [/@?HMod\.hMod(?![\w.'])/, "ostanek % (Lean: x % 0 = x)"],
  [/(?<![\w.'])(?:Nat\.(?:sub|div|mod|pred)|Int\.(?:div|ediv|emod|tdiv|tmod|fdiv|fmod|bdiv|bmod|toNat))(?![\w.'])/, "celoštevilsko odštevanje ali deljenje"],
  [/@?(?:HAdd\.hAdd|HSub\.hSub|HMul\.hMul|HDiv\.hDiv|HPow\.hPow|Neg\.neg) \(Fin(?![\w.'])/, "računanje v Fin (po modulu)"],
  [/(?<![\w.'])Float(?![\w.'])/, "Float (decimalno število brez tipa; piši (0.5 : ℝ))"],
  [/⋯/, "izpis tipov je skrajšan"],
];
/** Razlog, zakaj je elaborirana trditev (izpis #check s pp.explicit) zavrnjena, ali null. */
export function preveriElaboracijo(izpis) {
  if (typeof izpis !== "string" || !izpis.trim()) return "ni izpisa tipov";
  for (const [vzorec, razlog] of PREPOVEDANO) if (vzorec.test(izpis)) return razlog;
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
  if (tipi) {
    const razlog = preveriElaboracijo(tipi.data);
    if (razlog) return { izid: "rejected", sporocilo: `Lean trditev razume drugače kot šola: ${razlog}` };
  }
  let prvaNapaka = preverba.find((m) => m.severity === "error") || null;
  for (let k = 0; k < taktike.length && tipi; k++) {
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

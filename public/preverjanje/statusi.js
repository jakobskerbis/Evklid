// Enotni statusi preverjanja za ves Evklid (docs/preverjanje.md, PV-01; j, 25. 11. 2026: »Vzpostavi enoten sistem
// statusov v celotnem Evklidu« in »Nikoli ne označi celotnega odgovora kot formalno dokazanega, če je dokazan samo
// končni rezultat ali posamezen korak«). Brez DOM in brez uvozov: teče v brskalniku, v Node in v mobilni aplikaciji.
// Je edina definicija statusov; skener (public/scan/status.js) jo kliče in jo prevede v svojih pet statusov.
//
//   dokazano      Formalno dokazano     Lean je sprejel izrek trditve, vključno s popolnostjo (cela množica rešitev)
//   izracunano    Računsko preverjeno   točna aritmetika, točna algebra ali SymPy brez naključnih točk, v celoti
//   numericno     Numerično preverjeno  samo preizkus s števili (naključne točke, mreža); ni dokaz
//   delno         Delno preverjeno      del trditve ali odgovora preverjen, del ne (npr. popolnost množice rešitev)
//   v_teku        Preverjanje v teku    počasnejši motor (Lean) še dela; začasno
//   napaka        Zaznana napaka        preverjanje je pokazalo, da trditev ne velja
//   nepreverjeno  Nepreverjeno          noben motor trditve ne zna preveriti
export const STATUSI = ["dokazano", "izracunano", "numericno", "delno", "v_teku", "napaka", "nepreverjeno"];

// Moč dokaza statusov, ki jih lahko uredimo po gotovosti. »napaka« in »v_teku« nista na tej lestvici.
const MOC = { dokazano: 4, izracunano: 3, numericno: 2, delno: 1, nepreverjeno: 0 };

export const jeStatus = (s) => STATUSI.includes(s);

// Potrjeno = trditev sme biti pokazana kot preverjena z dokazom (merilo »napačno potrjene«, docs/preverjanje.md).
export const jePotrjeno = (s) => s === "dokazano" || s === "izracunano";

/**
 * Dokazi enega preverjanja → status trditve.
 *   holds:    true (trditev drži) | false (ne drži) | null (ni preverjeno)
 *   how:      "formal" (Lean) | "exact" (točna aritmetika, točna algebra, SymPy simbolno) | "numeric" (števila s toleranco)
 *   complete: "formal" (popolnost dokazal Lean) | "exact" (popolnost dokazana točno) | "na" (vprašanje popolnosti ne
 *             obstaja: račun, identiteta, odvod) | "numeric" (iskanje na omejenem območju) | "unknown" (ni preverjena)
 *             | false (katera rešitev manjka ali je odveč)
 * Status je največ tako močan kot šibkejši od obeh delov: Lean dokaz trditve s popolnostjo, dokazano s SymPy, je
 * »izracunano«; točen preizkus z numerično popolnostjo je »numericno«. Neznana vrednost »how« šteje kot numerična.
 */
export function statusIzDokazov({ holds = null, how = "numeric", complete = "unknown" } = {}) {
  if (holds === false || complete === false) return "napaka";
  if (holds !== true) return "nepreverjeno";
  if (complete === "unknown") return "delno";
  const drzi = how === "formal" ? 4 : how === "exact" ? 3 : 2;
  const popolno = complete === "na" || complete === "formal" ? 4 : complete === "exact" ? 3 : 2;
  return { 4: "dokazano", 3: "izracunano", 2: "numericno" }[Math.min(drzi, popolno)];
}

/**
 * Status odgovora (ali koraka, ki ga sestavlja več trditev) iz statusov njegovih trditev: najšibkejši člen.
 *   - ena »napaka« → »napaka«; sicer ena »v_teku« → »v_teku«;
 *   - vse »nepreverjeno« (ali nič trditev) → »nepreverjeno«;
 *   - mešanica preverjenih in nepreverjenih → »delno«;
 *   - sicer najšibkejši status (»dokazano« samo, če je dokazana vsaka trditev, tudi vsak prehod med koraki).
 * Neznan status šteje kot »nepreverjeno«.
 */
export function statusOdgovora(statusi = []) {
  const s = [...statusi].map((x) => (jeStatus(x) ? x : "nepreverjeno"));
  if (s.includes("napaka")) return "napaka";
  if (s.includes("v_teku")) return "v_teku";
  if (!s.length || s.every((x) => x === "nepreverjeno")) return "nepreverjeno";
  if (s.includes("nepreverjeno")) return "delno";
  return s.reduce((a, b) => (MOC[b] < MOC[a] ? b : a));
}

// Skener ima svojih pet statusov (public/scan/status.js) in njihova besedila na zaslonu; skupna definicija jih ne
// spremeni. »dokazano« je za skener »verified« (najvišje, kar pozna); »v_teku« ni odgovor, zato »unverified«.
const V_SKENER = { dokazano: "verified", izracunano: "verified", numericno: "numeric", delno: "partial", v_teku: "unverified", napaka: "wrong", nepreverjeno: "unverified" };
const IZ_SKENERJA = { verified: "izracunano", partial: "delno", numeric: "numericno", unverified: "nepreverjeno", wrong: "napaka" };

export const vSkener = (s) => V_SKENER[s] || "unverified";
export const izSkenerja = (s) => IZ_SKENERJA[s] || "nepreverjeno";

// Zapis matematične trditve, skupen vsem delom Evklida (docs/preverjanje.md, PV-01). Vsak vir (inštruktor, skener,
// kalkulator, učbenik, generatorji, pole, laboratorij …) odda trditve v tem zapisu; usmerjevalnik (PV-03) jih
// preveri, status pa se izračuna tukaj iz dokazov. Brez DOM in brez omrežja: teče v brskalniku, Node in aplikaciji.
//
// Trditev:
//   id           niz, enoličen znotraj odgovora ali vira (npr. "k3")
//   besedilo     izvirno besedilo, kot ga vidi učenec (tudi trditev z besedami)
//   zapis        strojni zapis (isti jezik kot blok RACUN in server/cas/worker.py), npr. "x^2-5*x+6=0 | x | 2, 3"
//   vrsta        ena od VRSTE
//   predpostavke seznam pogojev, ki veljajo (npr. ["x > 0"])
//   obmocje      definicijsko območje (npr. "x ≠ 1"), "" če ni omejitev
//   enote        merske enote vrednosti, "" če jih ni
//   prejsnji     id koraka, iz katerega trditev sledi, ali null
//   pravilo      uporabljeno pravilo (npr. "Vietove formule"), "" če ni navedeno
//   dokazi       seznam preverjanj: { motor, holds, how, complete, ms?, razlicica?, opomba? } (statusi.js)
//   dokaz        Lean izrek, ki trditev dokaže: { izrek, sha256 } ali null
//   izid         status (statusi.js), izračunan iz dokazov s statusTrditve; vir ga ne nastavi sam
import { statusIzDokazov } from "./statusi.js";

export const VRSTE = ["racun", "enacba", "neenacba", "sistem", "identiteta", "odvod", "integral", "limita", "vrednost", "enote", "kemija", "izrek", "sklep", "korak", "beseda"];
export const MOTORJI = ["aritmetika", "algebra", "sympy", "lean", "stevila", "kemija", "ai"];

const niz = (v) => typeof v === "string";

/** Trditev z vsemi polji (manjkajoča dobijo privzete vrednosti). Izid se izračuna iz dokazov. */
export function novaTrditev(p = {}) {
  const t = {
    id: niz(p.id) ? p.id : "",
    besedilo: niz(p.besedilo) ? p.besedilo : "",
    zapis: niz(p.zapis) ? p.zapis : "",
    vrsta: niz(p.vrsta) ? p.vrsta : "beseda",
    predpostavke: Array.isArray(p.predpostavke) ? [...p.predpostavke] : [],
    obmocje: niz(p.obmocje) ? p.obmocje : "",
    enote: niz(p.enote) ? p.enote : "",
    prejsnji: niz(p.prejsnji) ? p.prejsnji : null,
    pravilo: niz(p.pravilo) ? p.pravilo : "",
    dokazi: Array.isArray(p.dokazi) ? p.dokazi.map((d) => ({ ...d })) : [],
    dokaz: p.dokaz && niz(p.dokaz.izrek) ? { izrek: p.dokaz.izrek, sha256: niz(p.dokaz.sha256) ? p.dokaz.sha256 : "" } : null,
  };
  t.izid = statusTrditve(t.dokazi);
  return t;
}

/** Napake v zapisu trditve (prazen seznam = zapis je popoln). Ne preverja matematike, samo obliko. */
export function napakeZapisa(t) {
  const e = [];
  if (!t || typeof t !== "object") return ["trditev ni predmet"];
  if (!niz(t.id) || !t.id) e.push("id manjka");
  if (!niz(t.besedilo) || !t.besedilo.trim()) e.push("besedilo manjka");
  if (!VRSTE.includes(t.vrsta)) e.push(`neznana vrsta: ${t.vrsta}`);
  if (t.vrsta !== "beseda" && (!niz(t.zapis) || !t.zapis.trim())) e.push("zapis manjka (samo trditev z besedami je brez zapisa)");
  if (t.predpostavke != null && !Array.isArray(t.predpostavke)) e.push("predpostavke niso seznam");
  if (t.prejsnji != null && !niz(t.prejsnji)) e.push("prejsnji ni id");
  if (!Array.isArray(t.dokazi)) e.push("dokazi niso seznam");
  else
    t.dokazi.forEach((d, i) => {
      if (!d || !MOTORJI.includes(d.motor)) e.push(`dokaz ${i}: neznan motor`);
      if (d && ![true, false, null].includes(d.holds)) e.push(`dokaz ${i}: holds ni true, false ali null`);
    });
  if (t.dokaz != null && !(t.dokaz && niz(t.dokaz.izrek) && t.dokaz.izrek)) e.push("dokaz brez imena izreka");
  return e;
}

/**
 * Status trditve iz vseh njenih dokazov.
 *   - Dokaz, da trditev ne drži, iz točnega ali formalnega motorja → »napaka«.
 *   - Številski »ne drži«, ki mu točen ali formalni motor nasprotuje (»drži«) → »nepreverjeno«: motorja se ne
 *     strinjata, zato trditve ne potrdimo in ne zavrnemo (neskladje gre v meritev, docs/preverjanje.md).
 *   - Številski »ne drži« brez močnejšega dokaza → »napaka« (kot doslej v skenerju).
 *   - Sicer najmočnejši status med dokazi. Dokaz motorja »ai« ni dokaz: največ »nepreverjeno«.
 */
export function statusTrditve(dokazi = []) {
  const d = (dokazi || []).filter((x) => x && x.motor !== "ai");
  const s = d.map((x) => ({ x, s: statusIzDokazov(x) }));
  const mocen = (x) => x.how === "exact" || x.how === "formal";
  if (s.some(({ x, s }) => s === "napaka" && mocen(x))) return "napaka";
  const stevilskaNapaka = s.some(({ s }) => s === "napaka");
  const mocnoDrzi = s.some(({ x, s }) => s !== "napaka" && x.holds === true && mocen(x));
  if (stevilskaNapaka) return mocnoDrzi ? "nepreverjeno" : "napaka";
  const red = ["dokazano", "izracunano", "numericno", "delno", "nepreverjeno"];
  return s.map(({ s }) => s).sort((a, b) => red.indexOf(a) - red.indexOf(b))[0] || "nepreverjeno";
}

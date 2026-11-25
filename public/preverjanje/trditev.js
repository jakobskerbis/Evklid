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
//   izid         status (statusi.js), izračunan z izidTrditve; vir ga ne nastavi sam
import { statusIzDokazov } from "./statusi.js";

export const VRSTE = ["racun", "enacba", "neenacba", "sistem", "identiteta", "odvod", "integral", "limita", "vrednost", "enote", "kemija", "izrek", "sklep", "korak", "beseda"];

// Najmočnejši način, ki ga motor sme navesti. Kar motor navede močneje, šteje le do te meje: SymPy ni Lean, številski
// preizkus ni točen račun. Mnenje AI (»ai«) in neznan motor nista dokaz in se ne štejeta.
export const MOTORJI = { lean: "formal", aritmetika: "exact", algebra: "exact", sympy: "exact", kemija: "exact", stevila: "numeric", ai: null };
const MOC_NACINA = { formal: 3, exact: 2, numeric: 1 };

// Vrste, pri katerih je popolnost (cela množica rešitev) del trditve: »na« (popolnost ne obstaja) tu ne velja.
const S_POPOLNOSTJO = ["enacba", "neenacba", "sistem"];

const niz = (v) => typeof v === "string";

/** Dokaz, kot ga sme šteti status: znan motor, način največ do meje motorja, »na« samo, kjer popolnost ne obstaja. */
function veljavenDokaz(d, vrsta, dokaz) {
  if (!d || typeof d !== "object") return null;
  const meja = MOTORJI[d.motor];
  if (!meja || !Object.hasOwn(MOTORJI, d.motor)) return null;
  // Lean šteje samo z imenovanim izrekom (izvor dokaza), sicer ga ne moremo izslediti.
  if (d.motor === "lean" && !(dokaz && niz(dokaz.izrek) && dokaz.izrek)) return null;
  const how = (MOC_NACINA[d.how] || 1) > MOC_NACINA[meja] ? meja : MOC_NACINA[d.how] ? d.how : "numeric";
  let complete = d.complete;
  if (complete === "formal" && d.motor !== "lean") complete = "exact";
  if (complete === "exact" && how === "numeric") complete = "numeric";
  if (complete === "na" && S_POPOLNOSTJO.includes(vrsta)) complete = "unknown";
  return { ...d, how, complete };
}

/**
 * Status trditve iz vseh njenih dokazov (vrsta: VRSTE; dokaz: Lean izrek trditve).
 *   - Formalni »ne drži« → »napaka«.
 *   - Točen »ne drži« → »napaka«, razen če Lean isto trditev dokaže: SymPy lahko »ne drži« odloči tudi s preizkusom v
 *     naključnih točkah (worker.py is_zero), zato ob dokazu Lean velja »nepreverjeno« (neskladje gre v meritev).
 *   - Številski »ne drži« → »napaka«, razen če ga močnejši motor ovrže za ISTI del: »ne drži« ovrže samo močnejši
 *     »drži«, manjkajočo rešitev (complete: false) samo močnejši dokaz popolnosti. Takrat »nepreverjeno«.
 *   - Sicer najmočnejši status med dokazi.
 */
export function statusTrditve(dokazi = [], vrsta = "beseda", dokaz = null) {
  const d = (Array.isArray(dokazi) ? dokazi : []).map((x) => veljavenDokaz(x, vrsta, dokaz)).filter(Boolean);
  const s = d.map((x) => ({ x, s: statusIzDokazov(x) }));
  const moc = (x) => MOC_NACINA[x.how] || 1;
  const napake = s.filter((e) => e.s === "napaka");
  if (napake.length) {
    const ovrzena = (n) => {
      const vecji = d.filter((x) => moc(x) > moc(n.x));
      if (n.x.holds === false && !vecji.some((x) => x.holds === true)) return false;
      if (n.x.complete === false && !vecji.some((x) => x.holds === true && ["formal", "exact", "na"].includes(x.complete))) return false;
      return true;
    };
    if (napake.some((n) => !ovrzena(n))) return "napaka";
    return "nepreverjeno";
  }
  const red = ["dokazano", "izracunano", "numericno", "delno", "nepreverjeno"];
  return s.map((e) => e.s).sort((a, b) => red.indexOf(a) - red.indexOf(b))[0] || "nepreverjeno";
}

/** Izid trditve, kot ga izračuna zapis (statusTrditve z njeno vrsto in izrekom). */
export const izidTrditve = (t) => statusTrditve(t?.dokazi, t?.vrsta, t?.dokaz);

/** Trditev z vsemi polji (manjkajoča dobijo privzete vrednosti). Izid se izračuna iz dokazov. */
export function novaTrditev(p) {
  p = p && typeof p === "object" ? p : {};
  const t = {
    id: niz(p.id) ? p.id : "",
    besedilo: niz(p.besedilo) ? p.besedilo : "",
    zapis: niz(p.zapis) ? p.zapis : "",
    vrsta: VRSTE.includes(p.vrsta) ? p.vrsta : "beseda",
    predpostavke: Array.isArray(p.predpostavke) ? [...p.predpostavke] : [],
    obmocje: niz(p.obmocje) ? p.obmocje : "",
    enote: niz(p.enote) ? p.enote : "",
    prejsnji: niz(p.prejsnji) ? p.prejsnji : null,
    pravilo: niz(p.pravilo) ? p.pravilo : "",
    dokazi: Array.isArray(p.dokazi) ? p.dokazi.filter((d) => d && typeof d === "object").map((d) => ({ ...d })) : [],
    dokaz: p.dokaz && niz(p.dokaz.izrek) && p.dokaz.izrek ? { izrek: p.dokaz.izrek, sha256: niz(p.dokaz.sha256) ? p.dokaz.sha256 : "" } : null,
  };
  t.izid = izidTrditve(t);
  return t;
}

/** Napake v zapisu trditve (prazen seznam = zapis je popoln). Ne preverja matematike, samo obliko in skladnost. */
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
      if (!d || !Object.hasOwn(MOTORJI, d.motor)) return e.push(`dokaz ${i}: neznan motor`);
      if (![true, false, null].includes(d.holds)) e.push(`dokaz ${i}: holds ni true, false ali null`);
      const meja = MOTORJI[d.motor];
      if (MOC_NACINA[d.how] && (!meja || MOC_NACINA[d.how] > MOC_NACINA[meja])) e.push(`dokaz ${i}: motor ${d.motor} ne sme navesti načina ${d.how}`);
      if (d.complete === "na" && S_POPOLNOSTJO.includes(t.vrsta)) e.push(`dokaz ${i}: pri vrsti ${t.vrsta} je popolnost del trditve (ne »na«)`);
      if (d.motor === "lean" && !(t.dokaz && t.dokaz.izrek)) e.push(`dokaz ${i}: Lean brez imena izreka`);
    });
  if (t.dokaz != null && !(t.dokaz && niz(t.dokaz.izrek) && t.dokaz.izrek)) e.push("dokaz brez imena izreka");
  if (t.izid !== undefined && Array.isArray(t.dokazi) && t.izid !== izidTrditve(t)) e.push(`izid ${t.izid} se ne ujema z dokazi (${izidTrditve(t)})`);
  return e;
}

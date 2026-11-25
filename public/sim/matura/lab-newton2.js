// Maturitetni poskus: masa iz grafa a(F) pri drugem Newtonovem zakonu (motor lab-gibanje.js → labNewton2; okvir lab-matura.js).
// Neznanka je masa, ki jo pospešuje sila obešala: voziček, šest utežic in obešalo ter vrtenje koles in škripca
// (ProgaBench: mVoz + utezi + mObes + Iw + Ip; naklon premice a(F) je 1/m). Seme jo spremeni le malo (tehtanje vozička ±1 g,
// utežice ±20 mg), zato je skoraj stalna, ~334 g. Vsota nazivnih mas (320 g, vidna v tabeli) je ~4 % premajhna: kdor jo
// vpiše brez meritve, dobi 3 od 4 točk za rezultat. Pravo vrednost da le naklon grafa.
import { VOZICEK, SKRIPEC } from "../lab-model-gibanje.js";
import { stevilo, celica } from "../lab-vodeno-pomoc.js";
import { LIBELA, IZRAVNANO, NI_IZRAVNANO, silPriMasi } from "../vodeno/lab-newton2.js";

// Kateri od vzorcev se ujema z najnovejšo vrstico dnevnika, ki se ujema s katerim od njih (-1: noben).
function zadnji(dn, ...res) {
  for (let k = dn.length - 1; k >= 0; k--) {
    const i = res.findIndex((re) => re.test(dn[k]));
    if (i >= 0) return i;
  }
  return -1;
}
// Sile meritev pri vsaki skupni masi (stolpec m [g]); zapisane so le meritve z vrvico in obema vratoma.
function silePoMasi(c) {
  const po = new Map();
  for (const r of c.vrstice) {
    const m = stevilo(celica(r, /^m\b/)), F = stevilo(celica(r, /^F\b/));
    if (Number.isFinite(m) && Number.isFinite(F) && Number.isFinite(stevilo(celica(r, /^a\b/)))) po.set(m, [...(po.get(m) || []), F]);
  }
  return [...po.values()];
}

export default {
  naslov: "Masa iz grafa a(F)",
  naloga: "Določi maso m, ki jo pospešuje sila obešala. Progo izravnaj z libelo, nato s podložko izravnaj kotalni upor (preizkus brez vrvice s potiskom). Časovnik nastavi na »od spusta« in voziček spuščaj z elektromagnetom. Palic ne dodajaj. Utežice samo prestavljaj z vozička na obešalo, da ostane skupna masa enaka. Izmeri pospešek pri vsaj petih različnih silah, od največ 0,2 N do vsaj 0,5 N. Nariši graf a(F) in iz naklona premice izračunaj m. Oceni napako meritve.",
  kolicina: "m",
  zgled: "0,335",
  dec: 3,
  enote: [["kg", 1], ["g", 1e-3], ["N", null], ["1/kg", null]],
  // Skrben dijak (libela, podložka na 0,5 mm, časovnik od spusta, 7 sil od 0,1 do 0,7 N, premica a(F) z odsekom) dobi
  // ~1,7 % preveliko maso: zamik elektromagneta podaljša izmerjeni čas, bolj pri večjih pospeških. Simulacija na 300 vzorcih
  // (test/laboratorij-matura.test.js): največ ~2,3 %. Z načinom »vrata 1 → 2« je odmik do ~5 % (vrata zastavico
  // »vidijo« ~1 % širšo), zato naloga zahteva način od spusta.
  tol: 0.025,
  resnica: (B) => B.mVoz + B.utezi.reduce((a, b) => a + b, 0) + B.mObes + VOZICEK.Iw + SKRIPEC.Ip,
  meritve: [
    { kaj: "Progo si izravnal z libelo", tock: 1, ok: (c) => c.dnevnik.some((t) => LIBELA.test(t)) },
    { kaj: "Kotalni upor si izravnal s podložko (preizkus po libeli: »trenje je izravnano«)", tock: 1, ok: (c) => c.dnevnik.some((t) => LIBELA.test(t)) && zadnji(c.dnevnik, LIBELA, IZRAVNANO, NI_IZRAVNANO) === 1 },
    { kaj: "Pospešek si izmeril pri vsaj petih različnih silah pri isti skupni masi", tock: 1, ok: (c) => silPriMasi(c) >= 5 },
    {
      kaj: "Sile pri isti skupni masi segajo od največ 0,2 N do vsaj 0,5 N",
      tock: 1,
      ok: (c) => silePoMasi(c).some((F) => F.length >= 2 && Math.min(...F) <= 0.2 && Math.max(...F) >= 0.5),
    },
  ],
  // Račun pod grafom pokaže naklon in maso m = F/a.
  skrij: [".lab-gib-calc"],
};

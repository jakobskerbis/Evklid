// Vodeni poskus »Hookov zakon« (lab-hooke, motor lab-sile.js → labHooke; docs/laboratorij.md »Vodeni poskus«).
// Postopek kot v šoli: oko v višini kazalca (paralaksa), začetni odčitek brez uteži, uteži 50–250 g na mehki vzmeti, vsakič
// umirjena vzmet, graf F(x), k iz naklona (lab.js → racun) in na koncu obremenitev prek meje prožnosti.
import { stevilo, celica, kjer } from "../lab-vodeno-pomoc.js";

const G = 9.81; // kot G_SOLA v lab-model-sile.js: F = m g v tabeli
const OPOZORILO = /Gledal si (od zgoraj|od spodaj)|Vzmet še niha/;

// Začetni odčitek (record v lab-sile.js) je zapisan, ko oko ni bilo v višini kazalca ali je vzmet nihala, če sta opozorili
// tik pred vrstico »Začetni odčitek«. Pred začetnim odčitkom vsak »Zapiši« konča z vrstico (začetni odčitek ali »Najprej
// zapiši …«), zato opozorila tik pred njim sodijo k istemu pritisku.
export function cistZacetni(dn) {
  let k = dn.length - 1;
  while (k >= 0 && !/^Začetni odčitek:/.test(dn[k])) k--;
  return k >= 0 && !(k > 0 && OPOZORILO.test(dn[k - 1]));
}

const masa = (r) => stevilo(celica(r, /^m\b/));
const podaljsek = (r) => stevilo(celica(r, /^podaljšek/));
const mehka = (c) => kjer(c, /^vzmet/, /mehka/);

// Najnovejša meritev pri vsaki masi (> 0 g) na mehki vzmeti: ponovljena meritev nadomesti napačno.
function zadnjePoMasi(c) {
  const po = new Map();
  for (const r of mehka(c)) if (masa(r) > 0 && Number.isFinite(podaljsek(r))) po.set(masa(r), r);
  return [...po.values()];
}
// Prožnostni koeficient (N/m) kot v motorju: premica skozi izhodišče, k = Σ F x / Σ x² (x v cm).
export function koeficient(rows) {
  let sxy = 0, sxx = 0;
  for (const r of rows) {
    const x = podaljsek(r), F = (masa(r) / 1000) * G;
    if (!Number.isFinite(x) || !Number.isFinite(F)) continue;
    sxy += x * F;
    sxx += x * x;
  }
  return sxx > 0 ? (sxy / sxx) * 100 : NaN;
}
// Vsaj 5 različnih mas do vsaj 200 g, vsaka točka največ 2,5 mm od premice skozi izhodišče: odčitek pri nihajoči vzmeti
// je napačen za več milimetrov, zaokroževanje na 1 mm (začetni in končni odčitek) pa največ 1 mm.
export function lepaVrsta(c) {
  const r = zadnjePoMasi(c);
  if (r.length < 5 || Math.max(...r.map(masa)) < 200) return false;
  const k = koeficient(r) / 100; // N/cm
  return k > 0 && r.every((x) => Math.abs(podaljsek(x) - ((masa(x) / 1000) * G) / k) <= 0.25);
}
// Vpisani rezultat (lab.js → racun, polje »tvoj rezultat [N/m]«) se ujema s k iz meritev mehke vzmeti. Natančnost (4 %) preveri
// že motor (c.racun()); vodilo računa iz zaokrožene tabele, zato ima ohlapnejšo mejo 6 % in preveri le pravi cilj.
export function pravilenK(c) {
  const izbira = c.par("kaj računaš");
  if (izbira && !/mehka/.test(izbira)) return false;
  const k = koeficient(mehka(c)), v = stevilo(c.par("tvoj rezultat [N/m]"));
  return Number.isFinite(k) && Number.isFinite(v) && Math.abs(v - k) <= 0.06 * k;
}

export default {
  naslov: "Hookov zakon: kako se vzmet podaljša?",
  cilj: "Na mehko vzmet boš obešal uteži, meril podaljšek in iz grafa F(x) določil prožnostni koeficient. Na koncu boš videl, kaj se zgodi prek meje prožnosti.",
  konec: "Izmeril si prožnostni koeficient vzmeti in videl, da Hookov zakon velja le do meje prožnosti. Preklopi na »Prosto« in izmeri še trdo vzmet: kako se razlikujeta premici na grafu?",
  koraki: [
    {
      naslov: "Poglej kazalec od zgoraj",
      kaj: "Pri »oko« izberi »više« in v povečavi poglej, kje tvoj pogled zadene ravnilo. Meritve še ne zapisuj.",
      namig: "Ravnilo je nekaj milimetrov za kazalcem.",
      zakaj: "Če gledaš poševno, pogled zadene ravnilo nad kazalcem ali pod njim in odčitek je napačen za približno 2 mm. Temu pravimo paralaksa.",
      poudari: ["oko"],
      done: (c) => /više|niže/.test(c.par("oko")),
    },
    {
      naslov: "Zapiši začetni odčitek",
      kaj: "Pri »oko« izberi »v višini kazalca«. Mehka vzmet je brez uteži: pritisni »Zapiši meritev«.",
      namig: "Če si začetni odčitek zapisal, ko oko ni bilo v višini kazalca, pritisni »Zamenjaj z novo vzmetjo« in ga zapiši znova.",
      zakaj: "Podaljšek je odčitek z utežmi minus začetni odčitek. Napaka v začetnem odčitku bi pokvarila vse meritve.",
      poudari: ["oko", "Zapiši meritev"],
      done: (c) => /mehka/.test(c.par("vzmet")) && cistZacetni(c.dnevnik) && mehka(c).some((r) => masa(r) === 0),
    },
    {
      naslov: "Obesi 50\u00a0g in umiri vzmet",
      kaj: "Klikni utež »50 g«. Vzmet zaniha: pritisni »Umiri vzmet z roko« ali počakaj, da pod odčitkom piše »kazalec miruje«. Nato pritisni »Zapiši meritev«.",
      zakaj: "Med nihanjem se kazalec premika gor in dol, zato odčitek ni zanesljiv. Ko vzmet miruje, je sila vzmeti enaka teži uteži.",
      poudari: ["50", "Umiri vzmet", "Zapiši meritev"],
      done: (c) => mehka(c).some((r) => masa(r) === 50 && podaljsek(r) > 0),
    },
    {
      naslov: "Izmeri pri 100, 150, 200 in 250\u00a0g",
      kaj: "Obesi še 100, 150, 200 in 250 g. Vsakič umiri vzmet in zapiši meritev.",
      namig: "150 g je 100 g in 50 g, 250 g pa 200 g in 50 g. Točka, ki ni na premici, je bila odčitana, ko je vzmet še nihala ali oko ni bilo v višini kazalca: to maso izmeri znova.",
      zakaj: "Teža uteži F = mg napenja vzmet. Pri petih masah vidiš, ali so točke F(x) na premici skozi izhodišče.",
      poudari: ["Umiri vzmet", "Zapiši meritev"],
      done: (c) => lepaVrsta(c),
    },
    {
      naslov: "Kaj kaže graf F(x)?",
      kaj: "Pod grafom je vprašanje »Sklep«. Poglej, kako ležijo točke, in izberi pravilen odgovor.",
      namig: "Kaj se zgodi s podaljškom, ko silo podvojiš?",
      zakaj: "Točke ležijo na premici skozi izhodišče: F = k·x. To je Hookov zakon. Naklon premice je prožnostni koeficient k.",
      pokazi: /dokler je ne obremeniš/,
      done: (c) => c.sklep(/dokler je ne obremeniš/),
    },
    {
      naslov: "Izračunaj prožnostni koeficient",
      kaj: "Iz naklona premice F(x) izračunaj k mehke vzmeti v N/m. Vpiši ga v polje »tvoj rezultat« pod grafom in pritisni »Preveri moj račun«.",
      namig: "Vzemi točko na premici daleč od izhodišča: k = F/x. Podaljšek pretvori v metre (1 cm = 0,01 m).",
      zakaj: "k pove, kolikšna sila je potrebna za vsak meter podaljška. Mehka vzmet ima majhen k, trda velik.",
      poudari: ["tvoj rezultat", "Preveri moj račun"],
      // Pritisnil je »Preveri moj račun« in račun je bil pravilen (»Pokaži rešitev« ne šteje), vpisan pa je k mehke vzmeti.
      done: (c) => c.racun() && pravilenK(c),
    },
    {
      naslov: "Obremeni vzmet prek meje prožnosti",
      kaj: "Obesi 350 g (200, 100 in 50 g). Nato pritisni »Snemi vse«, umiri vzmet in zapiši odčitek brez uteži. To naredi samo tukaj: v šoli bi vzmet uničil.",
      zakaj: "Prek meje prožnosti se vzmet trajno raztegne in se ne vrne v začetno lego. Hookov zakon velja le do meje prožnosti.",
      poudari: ["Snemi vse", "Umiri vzmet", "Zapiši meritev"],
      done: (c) => c.bilo(/trajno raztegnjena, ker si jo obremenil/),
    },
    {
      naslov: "Zamenjaj raztegnjeno vzmet",
      kaj: "Pritisni »Zamenjaj z novo vzmetjo«.",
      zakaj: "Trajno raztegnjena vzmet ne kaže več prave sile. Zato tudi silomera nikoli ne obremeniš prek njegovega merilnega območja.",
      poudari: ["Zamenjaj z novo"],
      done: (c) => c.zadnji(/trajno raztegnjena/, /Nova vzmet je na stojalu/) === 1,
    },
  ],
};

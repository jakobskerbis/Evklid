// Vodeni poskus: elektroliza vode v Hofmannovem aparatu (motor lab-elektrokemija.js → labElektroliza).
// Koraki berejo dnevnik poskusa (polnjenje, praznjenje, napajalnik, mehurčki, preskusi plina, klor) in tabelo meritev.
import { stevilo, celica } from "../lab-vodeno-pomoc.js";

const nb = " ";
// Polnjenje in praznjenje aparata (lab-elektrokemija.js → fill, emptyBtn). »Aparat je prazen.« brez »in spran« je le
// opozorilo ob dejanju na praznem aparatu, zato ne šteje.
const NALIL = /V aparat si natočil tekočino|Natočil si tekočino \(/, PRAZEN = /Aparat je prazen in spran/;
const ZVEPLOVA = /žveplova\(VI\) kislina 0,5 mol\/L/;
const MEHURCKI = /Na elektrodah se pojavijo mehurčki/;
const VKLOP = /^Napajalnik je vklopljen/, IZKLOP = /^Napajalnik je izklopljen/;

// Kaj je zdaj v aparatu: najnovejše polnjenje (besedilo vrstice in njen indeks) ali null, če je prazen.
export function polnilo(dn) {
  for (let k = dn.length - 1; k >= 0; k--) {
    if (PRAZEN.test(dn[k])) return null;
    if (NALIL.test(dn[k])) return { t: dn[k], k };
  }
  return null;
}

// Ujet zrak (polnjenje z zaprto pipo): odpiranje pipe ga izpusti (»Pipa levo je odprta: plin je ušel …«).
function zrakIzpuscen(dn, p) {
  if (!/zrak je ostal ujet/.test(p.t)) return true;
  const po = dn.slice(p.k + 1);
  const L = po.some((t) => /^Pipa levo je odprta: plin je ušel/.test(t)), D = po.some((t) => /^Pipa desno je odprta: plin je ušel/.test(t));
  return /obe pipi/.test(p.t) ? L && D : L || D;
}

// Napajalnik res teče: praznjenje ga izklopi (ElektrolizaBench → izprazni; lab-elektrokemija.js izklopi tudi stikalo).
const vklopljen = (c) => c.zadnji(VKLOP, IZKLOP, PRAZEN) === 0;

// Veljavne meritve: čas, tok večji od nič (pregorela varovalka kaže 0) in prostornina na katodi.
export const meritve = (c) =>
  c.vrstice
    .map((r) => ({ t: stevilo(celica(r, /^t\b/)), I: stevilo(celica(r, /^I\b/)), Vk: stevilo(celica(r, /^V katoda/)) }))
    .filter((r) => Number.isFinite(r.t) && r.I > 0 && Number.isFinite(r.Vk));

export default {
  naslov: "Elektroliza vode: koliko vodika in kisika nastane?",
  cilj: "V Hofmannovem aparatu boš razkrojil vodo z električnim tokom, izmeril prostornini plinov, ju dokazal in primerjal elektrolizo destilirane vode in raztopine natrijevega klorida.",
  konec: `Pokazal si, da pri elektrolizi vode nastaneta vodik in kisik v razmerju 2${nb}:${nb}1 in da brez ionov tok ne teče. Pod grafom je iz tvojih meritev izračunana Faradayeva konstanta: primerjaj jo s 96${nb}485${nb}C/mol. Preklopi na »Prosto« in poskusi elektrolizo raztopine NaCl z grafitnima elektrodama.`,
  koraki: [
    {
      naslov: "Napolni aparat in zapri pipi",
      kaj: `Žveplova(VI) kislina je jedka, zato si v pravem laboratoriju najprej nadeni zaščitna očala. Pri »tekočina« pusti razredčeno žveplovo(VI) kislino s koncentracijo 0,5${nb}mol/L, pipi pusti odprti in pritisni »Nalij tekočino skozi srednjo cev«. Nato zapri obe pipi.`,
      namig: "Če pipi pri polnjenju nista odprti, ostane zrak ujet v cevi. Takrat pipo odpri, da zrak uide, in jo spet zapri. Če si nalil drugo tekočino ali koncentracijo, pritisni »Izprazni in speri aparat« in nalij znova.",
      zakaj: "Plin, ki nastaja na elektrodi, se zbira v zaprti cevi in izpodriva tekočino navzdol. Na skali cevi zato bereš prostornino plina. Ujet zrak bi to prostornino povečal.",
      poudari: ["tekočina", "Nalij tekočino", "pipa"],
      done: (c) => {
        const p = polnilo(c.dnevnik);
        return !!p && ZVEPLOVA.test(p.t) && zrakIzpuscen(c.dnevnik, p) && c.par("pipa levo odprta") === "ne" && c.par("pipa desno odprta") === "ne";
      },
    },
    {
      naslov: "Napovej in vklopi napajalnik",
      kaj: `Napovej: v kateri cevi se bo nabralo več plina? Nato napetost napajalnika nastavi na približno 6${nb}V in vklopi »napajalnik vklopljen«.`,
      namig: `Levo je katoda (−), desno anoda (+). Pri 9${nb}V ali več bi tok presegel 200${nb}mA in varovalka v ampermetru bi pregorela.`,
      zakaj: "Elektrolit (ioni H₃O⁺ in SO₄²⁻) prevaja tok skozi tekočino. Na obeh elektrodah se razkraja voda in nastajajo mehurčki plina.",
      poudari: ["napetost napajalnika", "napajalnik vklopljen"],
      done: (c) => !!polnilo(c.dnevnik) && c.zadnji(NALIL, PRAZEN, MEHURCKI) === 2,
    },
    {
      naslov: "Meri čas, tok in prostornini plinov",
      kaj: `Štoparico daj na nič in jo zaženi. Hitrost časa nastavi na ×60 in vsakih nekaj minut pritisni »Zapiši meritev«. Zapisuj, dokler na katodi ni vsaj 10${nb}mL plina, skupaj vsaj 3 meritve.`,
      namig: "Lahko vklopiš tudi »zapiši samodejno vsako minuto«. Na katodi in anodi odčitaš prostornino v povečavi ob meniskih.",
      zakaj: `Iz toka in časa dobiš naboj Q = I · t. Pod grafom je iz tvojih meritev izračunana množina vodika in Faradayeva konstanta F = Q/(2n).`,
      poudari: ["Štoparica: začni", "hitrost časa", "Zapiši meritev"],
      done: (c) => {
        const p = polnilo(c.dnevnik), r = meritve(c);
        return !!p && /žveplova/.test(p.t) && new Set(r.map((x) => x.t)).size >= 3 && r.length > 0 && r[r.length - 1].Vk >= 10;
      },
    },
    {
      naslov: "Zakaj je na katodi dvakrat več plina?",
      kaj: "Pod grafom je vprašanje »Sklep«. Primerjaj prostornini v tabeli in izberi pravilen odgovor.",
      namig: "Koliko elektronov potrebuje ena molekula vodika in koliko ena molekula kisika?",
      zakaj: `Na katodi nastaja vodik: 2H₂O + 2e⁻ → H₂ + 2OH⁻. Na anodi nastaja kisik: 2H₂O → O₂ + 4H⁺ + 4e⁻. Pri istem naboju nastane dvakrat več molekul vodika, zato je razmerje prostornin 2${nb}:${nb}1.`,
      pokazi: /dvakrat toliko plina/,
      done: (c) => c.sklep(/dvakrat toliko plina/),
    },
    {
      naslov: "Dokaži vodik z gorečo trsko",
      kaj: "Pri »cev« izberi cev s katodo (−) in pritisni »Goreča trska k pipi«.",
      namig: "Oznaka »katoda (−)« je pod cevjo. Ob preskusu se pipa odpre in plin uide: če si izbral napačno cev, počakaj, da se plin znova nabere.",
      zakaj: "Vodik se z zrakom ob plamenu vžge s pokom. To je značilen preskus za vodik.",
      poudari: ["cev", "Goreča trska"],
      done: (c) => c.bilo(/v cevi je vodik/),
    },
    {
      naslov: "Dokaži kisik s tlečo trsko",
      kaj: "Pri »cev« izberi cev z anodo (+) in pritisni »Tleča trska k pipi«.",
      namig: `V cevi mora biti vsaj 2${nb}mL plina. Če ga je premalo, počakaj, da se ga nabere več.`,
      zakaj: "V čistem kisiku tleča trska znova zagori, v zraku z 21\u00a0% kisika le tli. To je značilen preskus za kisik.",
      poudari: ["cev", "Tleča trska"],
      done: (c) => c.bilo(/Tleča trska se znova vžge/),
    },
    {
      naslov: "Zamenjaj pola",
      kaj: "Pri »priključitev« izberi »levo +, desno −«. Napajalnik naj bo vklopljen. Opazuj, v kateri cevi se zdaj nabira več plina.",
      zakaj: "Katoda je vedno elektroda na negativnem polu, ne določena cev. Vodik zdaj nastaja v desni cevi, kisik v levi.",
      poudari: ["priključitev", "napajalnik vklopljen"],
      done: (c) => !!polnilo(c.dnevnik) && c.zadnji(/Leva elektroda je na negativnem/, /Leva elektroda je zdaj na pozitivnem/) === 1 && vklopljen(c),
    },
    {
      naslov: "Ali destilirana voda prevaja tok?",
      kaj: `Pritisni »Izprazni in speri aparat« (napajalnik se izklopi). Pri »tekočina« izberi destilirano vodo, odpri obe pipi in jo nalij. Napetost povečaj na približno 10${nb}V in vklopi napajalnik.`,
      namig: "Destilirana voda je skoraj čista voda brez raztopljenih snovi. Opazuj ampermeter in elektrodi.",
      zakaj: "Destilirana voda skoraj nima ionov, zato skoraj ne prevaja električnega toka. Zato vodi za elektrolizo dodamo elektrolit, na primer žveplovo(VI) kislino.",
      poudari: ["Izprazni in speri", "tekočina", "napetost napajalnika", "napajalnik vklopljen"],
      done: (c) => c.bilo(/destilirana voda skoraj nima ionov/),
    },
    {
      naslov: "Elektroliza raztopine natrijevega klorida",
      kaj: `Izklopi napajalnik in aparat izprazni. Izberi raztopino natrijevega klorida 1${nb}mol/L, jo nalij z odprtima pipama in pipi zapri. Vklopi napajalnik pri približno 10${nb}V. Klor je strupen: v pravem laboratoriju ta poskus delaj le v digestoriju.`,
      namig: "Pri »koncentracija« izberi 1,0\u00a0mol/L. Opazuj dnevnik ob anodi.",
      zakaj: "V raztopini NaCl se na anodi namesto vode oksidirajo kloridni ioni: 2Cl⁻ → Cl₂ + 2e⁻. Na katodi še vedno nastaja vodik.",
      poudari: ["Izprazni in speri", "tekočina", "koncentracija", "napajalnik vklopljen"],
      done: (c) => c.bilo(/Ob anodi diši po kloru/),
    },
    {
      naslov: "Dokaži klor z vlažnim lakmusovim papirjem",
      kaj: `Ko se v cevi z anodo (+) nabere vsaj 2${nb}mL plina, pri »cev« izberi to cev in pritisni »Vlažen lakmusov papir«.`,
      namig: "Klor se v vodi precej raztaplja, zato se ga v cevi nabere manj kot vodika. Hitrost časa ×60 pomaga.",
      zakaj: "Klor z vodo tvori klorovodikovo kislino in klorovo(I) kislino HClO, zato moder lakmusov papir najprej pordeči. Klorova(I) kislina nato barvilo razbarva.",
      poudari: ["cev", "Vlažen lakmusov papir"],
      done: (c) => c.bilo(/klor beli barvila/),
    },
  ],
};

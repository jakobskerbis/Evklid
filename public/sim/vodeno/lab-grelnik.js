// Vodeni poskus: potopni grelec, Q = mcΔT, W = UIt in izkoristek (motor lab-toplota.js → labGrelnik).
// Tabela: »t [s]« (samodejni zapis brez decimalk, ročni »Zapiši meritev« z eno decimalko), »U [V]«, »I [A]«, »T [°C]«.
// »Natoči svežo vodo« izbriše tabelo, zato so v njej le meritve zadnjega nalivanja.
import { stevilo, celica } from "../lab-vodeno-pomoc.js";
import { preveriRacun } from "../lab.js";

const NALIL = /^V čaši je sveža voda/, TEHTAL = /^Tehtnica:/, VKLOP = /^Grelec je vklopljen/, IZKLOP = /^Grelec je izklopljen/, NEPREMESANA = /^Voda ni premešana/;
const C_VODE = 4182; // J/(kg·K), kot VODA.c v lab-model-toplota.js

// Indeks najnovejše vrstice dnevnika, ki se ujema z `re` (od `od` naprej), sicer -1.
const zadnja = (dn, re, od = 0) => {
  for (let k = dn.length - 1; k >= od; k--) if (re.test(dn[k])) return k;
  return -1;
};
const nalivanje = (dn) => zadnja(dn, NALIL);
// Masa iz vrstice nalivanja (»približno 200 g«): učenec je izbral približno 200 g.
const priblizno200 = (vrstica) => Math.abs(stevilo(String(vrstica).replace(/^\D+/, "")) - 200) <= 10;
const nastavljen = (c) => c.par("grelec je potopljen v vodo") === "da" && Math.abs(c.num("napetost napajalnika") - 12) <= 0.5 && c.num("omejitev toka") >= 4.5;
// Po zadnjem nalivanju je grelec vklopljen in voda stehtana.
const vklopljenPo = (dn, p) => p >= 0 && zadnja(dn, VKLOP, p + 1) > p && zadnja(dn, TEHTAL, p + 1) > p;
// Grelec je izklopljen po zadnjem vklopu (po zadnjem nalivanju) in je segreval vsaj 4 minute.
export function izklopljen(dn) {
  const p = nalivanje(dn), on = zadnja(dn, VKLOP, p + 1), off = zadnja(dn, IZKLOP, p + 1);
  return p >= 0 && on > p && off > on && stevilo(dn[off].replace(/^[^(]*\(/, "")) >= 240;
}

const t = (r) => stevilo(celica(r, /^t\b/));
const U = (r) => stevilo(celica(r, /^U\b/));
const I = (r) => stevilo(celica(r, /^I\b/));
const T = (r) => stevilo(celica(r, /^T\b/));
// Med segrevanjem teče okoli 4 A. Izklopljen ampermeter zaradi zamika ničle kaže do nekaj stotink ampera (lab-model.js →
// meterRead), zato tok pod 0,2 A pomeni, da je grelec izklopljen.
const tece = (r) => I(r) > 0.2;
// Vrstice po izklopu: za zadnjo vrstico, v kateri je tekel tok.
const poIzklopu = (v) => {
  const k = v.findLastIndex(tece);
  return k < 0 ? [] : v.slice(k + 1).filter((r) => t(r) > 0);
};
// Po izklopu je učenec z »Zapiši meritev« (t z decimalko) zapisal temperaturo premešane vode: vsaj en ročni zapis ni
// dobil opozorila »Voda ni premešana« (lab-toplota.js → record).
export function premesanoZapisal(c) {
  const dn = c.dnevnik, off = zadnja(dn, IZKLOP);
  const rocni = poIzklopu(c.vrstice).filter((r) => /,/.test(celica(r, /^t\b/))).length;
  const opozoril = dn.slice(off + 1).filter((x) => NEPREMESANA.test(x)).length;
  return off >= 0 && c.zadnji(VKLOP, IZKLOP) === 1 && rocni > opozoril;
}

// Izkoristek v % iz tabele in dnevnika, kot ga računa motor (labGrelnik → sync): T1 pri t = 0, T2 najvišja po izklopu,
// povprečna U in I med segrevanjem, m iz tehtnice po zadnjem nalivanju, t iz vrstice »segreval je … s«.
export function izkoristekIzMeritev(c) {
  const dn = c.dnevnik, p = nalivanje(dn), teh = zadnja(dn, TEHTAL, p + 1), off = zadnja(dn, IZKLOP, p + 1);
  if (p < 0 || teh < 0 || off < 0) return NaN;
  const v = c.vrstice;
  const zac = v.findLast((r) => t(r) === 0);
  const med = v.filter((r) => tece(r) && Number.isFinite(U(r)));
  const po = poIzklopu(v);
  if (!zac || !med.length || !po.length) return NaN;
  const m = stevilo(dn[teh]) / 1000, tOn = stevilo(dn[off].replace(/^[^(]*\(/, ""));
  const Us = med.reduce((a, r) => a + U(r), 0) / med.length, Is = med.reduce((a, r) => a + I(r), 0) / med.length;
  return (100 * m * C_VODE * (Math.max(...po.map(T)) - T(zac))) / (Us * Is * tOn);
}
const racunPravilen = (c) => c.racun() && !!preveriRacun(c.par("tvoj rezultat [%]"), izkoristekIzMeritev(c), { tol: 0.045, enota: "%" })?.ok; // natančnost (3 %) preveri motor, vodilo računa iz zaokroženega dnevnika

export default {
  naslov: "Grelec: kolikšen je njegov izkoristek?",
  cilj: "Z grelcem 12\u00a0V boš segrel vodo, izmeril delo električnega toka in toploto, ki jo je prejela voda, ter izračunal izkoristek grelca. Nato boš poskus ponovil s pokrovom in z mešanjem.",
  konec: "Izkoristek grelca si izmeril dvakrat: s pokrovom je večji, ker manj toplote uide skozi gladino in z izhlapevanjem. Preklopi na »Prosto« in poskusi s 100\u00a0g vode. V »Prosto« lahko vidiš tudi, kaj se zgodi z grelcem zunaj vode: to naredi samo tukaj, v pravem laboratoriju nikoli.",
  koraki: [
    {
      naslov: "Natoči 200\u00a0g vode in jo stehtaj",
      kaj: "Drsnik »masa vode« nastavi na 200\u00a0g, pritisni »Natoči svežo vodo« in nato »Stehtaj vodo«.",
      namig: "Čaša na tehtnici je že tarirana, zato tehtnica pokaže samo maso vode.",
      zakaj: "Toplota, ki jo voda prejme, je sorazmerna z njeno maso (Q = mcΔT). Natočena voda ima le približno 200\u00a0g, zato jo stehtaš.",
      poudari: ["masa vode", "Natoči svežo vodo", "Stehtaj vodo"],
      done: (c) => {
        const dn = c.dnevnik, p = nalivanje(dn);
        return p >= 0 && priblizno200(dn[p]) && zadnja(dn, TEHTAL, p + 1) > p;
      },
    },
    {
      naslov: "Vklopi grelec pri 12\u00a0V",
      kaj: "Preveri, da je grelec ves pod vodo, napetost napajalnika 12\u00a0V in omejitev toka 5\u00a0A. Nato pritisni »Vklopi grelec«.",
      namig: "Grelec je narejen za 12\u00a0V in 50\u00a0W, zato pri 12\u00a0V teče okoli 4\u00a0A. Pri manjši omejitvi toka bi napajalnik znižal napetost.",
      zakaj: "Ob vklopu se zapiše začetna temperatura vode pri t = 0. Grelec mora biti pod vodo, sicer se pregreje in pokvari.",
      poudari: ["grelec je potopljen", "napetost napajalnika", "omejitev toka", "Vklopi grelec"],
      done: (c) => vklopljenPo(c.dnevnik, nalivanje(c.dnevnik)) && c.zadnji(VKLOP, IZKLOP) === 0 && nastavljen(c),
    },
    {
      naslov: "Pospeši čas in spremljaj meritve",
      kaj: "Pri »hitrost časa« izberi ×10. Pusti vklopljeno »zapisuj vsakih 30\u00a0s« in opazuj, kako v tabeli raste temperatura.",
      namig: "Zapise napetosti in toka med segrevanjem potrebuješ za delo W = UIt.",
      zakaj: "Pri stalni moči grelca temperatura vode raste skoraj enakomerno, zato je graf T(t) skoraj premica.",
      poudari: ["hitrost časa", "zapisuj vsakih 30"],
      done: (c) => /×(10|60)/.test(c.par("hitrost časa")) && c.vrstice.filter(tece).length >= 2,
    },
    {
      naslov: "Po 5 minutah izklopi grelec",
      kaj: "Ko štoparica kaže približno 5 minut in se voda segreje za 10 do 20\u00a0°C, pritisni »Izklopi grelec«.",
      namig: "Če si grelec izklopil prezgodaj, ga vklopi znova: štoparica šteje ves čas segrevanja. Korak je opravljen, ko je grelec skupaj segreval vsaj 4 minute.",
      zakaj: "Večja sprememba temperature pomeni manjšo relativno napako. Pri 2\u00a0K bi napaka termometra že precej pokvarila rezultat.",
      poudari: ["Izklopi grelec"],
      done: (c) => izklopljen(c.dnevnik),
    },
    {
      naslov: "Premešaj in zapiši končno temperaturo",
      kaj: "Vklopi »mešaj z mešalno palčko«, počakaj nekaj sekund in pritisni »Zapiši meritev«. Ponavljaj, dokler temperatura še raste.",
      namig: "Topla voda se nabere zgoraj, termometer ob strani pa je spodaj. Brez mešanja kaže premalo.",
      zakaj: "Grelec je še nekaj časa toplejši od vode in ji oddaja toploto, zato temperatura po izklopu še malo naraste. V računu uporabiš najvišjo.",
      poudari: ["mešaj z mešalno", "Zapiši meritev"],
      done: (c) => premesanoZapisal(c),
    },
    {
      naslov: "Izračunaj izkoristek grelca",
      kaj: "Iz tabele izračunaj delo W = UIt, toploto Q = mcΔT in izkoristek η = Q/W. Izkoristek v odstotkih vpiši v »tvoj rezultat« in pritisni »Preveri moj račun«.",
      namig: "Za U in I vzemi povprečje med segrevanjem, za t čas segrevanja iz dnevnika, za ΔT razliko med najvišjo temperaturo po izklopu in začetno. Specifična toplota vode je 4182\u00a0J/(kg\u00a0K). Maso pretvori v kilograme.",
      zakaj: "Izkoristek pove, kolikšen del električnega dela je ostal v vodi kot toplota.",
      poudari: ["tvoj rezultat", "Preveri moj račun"],
      done: (c) => racunPravilen(c),
    },
    {
      naslov: "Zakaj izkoristek ni 100\u00a0%?",
      kaj: "Odgovori na vprašanje »Sklep« pod izračunom.",
      namig: "Kaj se poleg vode še segreje? Kam gre para nad gladino?",
      zakaj: "Energija se ne izgubi, le del toplote dobijo čaša, grelec in zrak. Zato je izmerjeni izkoristek manjši od 100\u00a0%.",
      pokazi: /izkoristek grelca manjši/,
      done: (c) => c.sklep(/izkoristek grelca manjši/),
    },
    {
      naslov: "Ponovi s pokrovom in z mešanjem",
      kaj: "Znova natoči 200\u00a0g vode in jo stehtaj. Vklopi »pokrov na čaši« in »mešaj z mešalno palčko«, nato vklopi grelec pri 12\u00a0V.",
      namig: "Pri ponovitvi spremeniš le pokrov in mešanje. Masa vode, napetost in čas segrevanja ostanejo enaki, sicer izkoristkov ne moreš primerjati.",
      zakaj: "Pokrov zmanjša izhlapevanje in oddajanje toplote skozi gladino. Mešanje poskrbi, da termometer kaže povprečno temperaturo vode.",
      poudari: ["Natoči svežo vodo", "Stehtaj vodo", "pokrov na čaši", "mešaj z mešalno", "Vklopi grelec"],
      done: (c) => {
        const dn = c.dnevnik, p = nalivanje(dn);
        return zadnja(dn.slice(0, Math.max(p, 0)), VKLOP) >= 0 && priblizno200(dn[p]) && vklopljenPo(dn, p) && c.zadnji(VKLOP, IZKLOP) === 0 &&
          nastavljen(c) && c.par("pokrov na čaši") === "da" && c.par("mešaj z mešalno palčko") === "da";
      },
    },
    {
      naslov: "Izklopi in znova izračunaj izkoristek",
      kaj: "Po približno 5 minutah izklopi grelec, zapiši najvišjo temperaturo in izračunaj nov izkoristek. Vpiši ga v »tvoj rezultat« in pritisni »Preveri moj račun«.",
      namig: "Pokrov in mešanje pusti vklopljena do konca.",
      zakaj: "S pokrovom manj toplote uide skozi gladino in z izhlapevanjem, zato je izkoristek večji. Mešanje vodi toplote ne doda, le termometer kaže povprečno temperaturo. Masa vode, napetost in čas segrevanja so bili enaki, zato lahko izkoristka primerjaš.",
      poudari: ["Izklopi grelec", "Zapiši meritev"],
      done: (c) => izklopljen(c.dnevnik) && c.par("pokrov na čaši") === "da" && racunPravilen(c),
    },
  ],
};

// Maturitetni poskus: lomni količnik akrila (motor lab-optika.js → labLom; okvir lab-matura.js).
// Model ne spreminja lomnega količnika s semenom (LomBench: seme spremeni le napako nastavitve diska in odčitka), zato je
// prava vrednost lomni količnik akrila iz modela, SNOVI.pmma.n = 1,4881 pri 650 nm (Sultanova in sod. 2009).
// Napis z lomnim količnikom na disku in viri pod poskusom sta med nalogo skrita.
import { SNOVI } from "../lab-model-optika.js";
import { razlicne } from "../lab-vodeno-pomoc.js";
import { lomZrakAkril, alfa } from "../vodeno/lab-lom.js";

const OD_PLOSKVE = /^Kote si meril od ploskve/, MIMO = /mimo središča/;
const koti = (c) => lomZrakAkril(c).map(alfa).filter(Number.isFinite);

export default {
  naslov: "Lomni količnik akrila",
  naloga: "Z laserjem in optičnim diskom določi lomni količnik akrila. Svetloba naj gre iz zraka v akrilni polvalj. Izmeri lomni kot pri vsaj šestih različnih vpadnih kotih od 10 ° do 80 °. Kote meri od vpadne pravokotnice, žarek naj gre skozi središče diska. Nariši graf sin β v odvisnosti od sin α in iz naklona premice izračunaj lomni količnik. Oceni napako meritve.",
  kolicina: "n akrila",
  zgled: "1,35",
  dec: 3,
  enote: [["(brez enote)", 1], ["°", null], ["m/s", null]],
  // Skrben dijak (od pravokotnice, brez zamika, 10–80° po 10°, kot na pol stopinje) je pri naklonu premice v 95 % vzorcev
  // do 0,4 % od prave vrednosti, pri povprečju sin α/sin β po točkah do 0,9 % (test/matura/lab-lom.js:
  // simulacija na 500 vzorcih). Toleranca 1 % velja za obe metodi.
  tol: 0.01,
  resnica: () => SNOVI.pmma.n,
  meritve: [
    { kaj: "Lomni kot si izmeril pri vsaj šestih različnih vpadnih kotih (iz zraka v akril)", tock: 1, ok: (c) => razlicne(lomZrakAkril(c), /^α/, 0).size >= 6 },
    {
      kaj: "Vpadni koti segajo od največ 20 ° do vsaj 70 °",
      tock: 1,
      ok: (c) => {
        const a = koti(c);
        return a.length > 0 && Math.min(...a) <= 20 && Math.max(...a) >= 70;
      },
    },
    { kaj: "Vse kote si meril od vpadne pravokotnice", tock: 1, ok: (c) => koti(c).length > 0 && !c.dnevnik.some((t) => OD_PLOSKVE.test(t)) },
    { kaj: "Laserski žarek je vedno šel skozi središče diska", tock: 1, ok: (c) => koti(c).length > 0 && !c.dnevnik.some((t) => MIMO.test(t)) },
  ],
  // Izračun n pod tabelo (po »Pokaži rešitev«), napis »akril, n = …« na disku in viri z lomnimi količniki.
  skrij: [".lab-top-calc", ".lab-opt-n", ".lab-opt-viri"],
};

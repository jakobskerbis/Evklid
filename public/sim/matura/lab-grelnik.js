// Maturitetni poskus: izkoristek potopnega grelca (motor lab-toplota.js → labGrelnik; okvir lab-matura.js).
// Neznanka je izkoristek η = Q/W tega segrevanja. Prava vrednost je iz modela: natočena masa (B.m0), povprečna temperatura
// vode tik pred prvim vklopom (B.T0) in najvišja po izklopu (B.Tvrh) ter pravo električno delo na grelcu (B.E).
// Seme spremeni upor grelca (±5 %), merilnike, termometer in tehtnico; izkoristek sam se s semenom komaj spremeni
// (pri 200 g, 5 min, brez pokrova 86,6–87,1 %), odvisen je predvsem od postopka (masa, čas, pokrov).
import { VODA } from "../lab-model-toplota.js";
import { premesanoZapisal, zadnja, NALIL, TEHTAL, VKLOP, IZKLOP, t, T } from "../vodeno/lab-grelnik.js";

// Napačna raba grelca (lab-toplota.js → say, potT, weigh): zunaj vode, delno v zraku, pregret, prek 12 V, pokvarjen.
const NAROBE = /^Grelec si dvignil iz vode|^Grelec ni v vodi|^Voda ne pokrije vse grelne spirale|^Grelec je segret že na|termična varovalka|^Grelna žica je pregorela|več od nazivnih 12 V|^Voda komaj pokrije grelno spiralo/;

// Prvi vklop po zadnjem nalivanju (brez nalivanja: od začetka naloge, voda je že v čaši).
const prviVklop = (dn) => {
  const p = zadnja(dn, NALIL);
  return { p, v: dn.findIndex((x, k) => k > p && VKLOP.test(x)) };
};

export default {
  naslov: "Izkoristek potopnega grelca",
  naloga: "V čaši je približno 200 g vode. Stehtaj jo. Grelec za 12 V naj bo ves pod vodo, napajalnik nastavi na 12 V. Vklopi grelec in med segrevanjem zapisuj napetost, tok in temperaturo. Ko se voda segreje za 10 do 20 °C, grelec izklopi, vodo premešaj in zapiši najvišjo temperaturo. Izračunaj izkoristek grelca v odstotkih in oceni napako meritve.",
  kolicina: "η grelca",
  zgled: "78,5",
  dec: 1,
  enote: [["%", 1], ["delež (brez enote)", 100], ["J", null], ["W", null]],
  // Skrben dijak (stehta vodo, 12 V, 5 min, zapis U in I vsakih 30 s, po izklopu meša in zapiše najvišjo temperaturo)
  // je v 95 % vzorcev do 1,7 % od prave vrednosti (merilniki, termometer, tehtnica; test/matura/lab-grelnik.js:
  // simulacija na 500 vzorcih).
  tol: 0.02,
  resnica: (B) => (B.E > 0 ? (100 * B.m0 * VODA.c * ((B.Tvrh ?? B.voda.T) - B.T0)) / B.E : NaN),
  niResnice: "Najprej segrej vodo z grelcem: izkoristek se izračuna iz tvoje meritve.",
  meritve: [
    {
      kaj: "Vodo si stehtal, preden si vklopil grelec",
      tock: 1,
      ok: (c) => {
        const { p, v } = prviVklop(c.dnevnik);
        return v > 0 && c.dnevnik.slice(p + 1, v).some((x) => TEHTAL.test(x));
      },
    },
    {
      kaj: "Grelec je bil ves čas pod vodo in na največ 12 V",
      tock: 1,
      ok: (c) => prviVklop(c.dnevnik).v >= 0 && !c.dnevnik.some((x) => NAROBE.test(x)),
    },
    {
      kaj: "Voda se je segrela za vsaj 10 °C",
      tock: 1,
      ok: (c) => {
        const zac = c.vrstice.findLast((r) => t(r) === 0), Ts = c.vrstice.map(T).filter(Number.isFinite);
        return !!zac && c.zadnji(VKLOP, IZKLOP) === 1 && Math.max(...Ts) - T(zac) >= 10;
      },
    },
    { kaj: "Končno temperaturo si zapisal, ko si vodo premešal", tock: 1, ok: premesanoZapisal },
  ],
  // Pod tabelo: podatki iz meritev (povprečna U in I, T₁, T₂, t) in izračun izkoristka po »Pokaži rešitev«.
  skrij: [".lab-top-calc"],
};

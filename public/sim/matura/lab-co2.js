// Maturitetni poskus: masa sode bikarbone v vzorcu iz izgube mase pri reakciji s kislino (motor lab-kem.js → labCo2;
// okvir lab-matura.js). Ob »Začni nalogo« priprava v prazno bučko stresi vzorec NaHCO₃ z neznano maso 0,80–1,40 g
// (Co2Bench.addSoda, naključno iz semena modela; labCo2 seme vzame iz Math.random, zato je vsak vzorec nov).
// Prava vrednost je masa vzorca v modelu (B.vzorec). Učenec nalije presežek kisline, bučka ostane odprta, maso bere,
// dokler se ne ustali: m(NaHCO₃) = Δm · M(NaHCO₃) / M(CO₂). Del CO₂ ostane raztopljen v kislini in uhaja počasi
// (Co2Bench: τ 300 s), zato je izguba mase po 5 minutah še ~5 % premajhna; toleranco to upošteva.
import { stevilo, celica } from "../lab-vodeno-pomoc.js";
import { NALIL } from "../vodeno/lab-co2.js";
import { ACIDS, M } from "../lab-model.js";

// Vzorec: masa v gramih (min–max), naloga pove le zgornjo mejo.
export const VZOREC = { min: 0.8, max: 1.4, meja: 1.5 };
const OCALA = /^Nadel si si zaščitna očala/;
const USLO = /Pena je prelila bučko|Pena je prišla v cevko|Zamašek je izletel/;
const prvi = (dn, re) => dn.findIndex((t) => re.test(t));
// Množina kislih protonov (mol), ki jih je učenec nalil v bučko (dnevnik: prostornina in ime tekočine).
export const nKisline = (dn) =>
  dn.map((t) => t.match(NALIL)).filter(Boolean).reduce((s, m) => s + (stevilo(m[1]) / 1000) * (Object.values(ACIDS).find((A) => A.name === m[2])?.cH ?? 0), 0);

export default {
  naslov: "Masa sode bikarbone v vzorcu",
  naloga: "V bučki na tehtnici je vzorec sode bikarbone (NaHCO₃) neznane mase, manjše od 1,5 g. Nadeni si zaščitna očala in v bučko nalij presežek kisline, na primer 30 mL kisa. Bučka naj ostane odprta. Maso bučke zapisuj, dokler se ne ustali, vsaj 5 minut po začetku reakcije. Iz izgube mase izračunaj maso NaHCO₃ v vzorcu in oceni napako meritve.",
  kolicina: "m(NaHCO₃)",
  zgled: "1,12",
  zgledNap: "0,05",
  dec: 2,
  enote: [["g", 1], ["mg", 1e-3], ["mol", null], ["mL", null]],
  // Skrben dijak (30 mL kisa, odprta bučka, odčitek po 5 minutah) je zaradi raztopljenega CO₂ 2–8 % pod pravo vrednostjo
  // (test/laboratorij-matura.test.js: simulacija na 500 vzorcih).
  tol: 0.08,
  // Po »↺ Ponastavi« med nalogo vzorca ni več: takrat šteje soda, ki jo je učenec stresel sam.
  resnica: (B) => B.vzorec ?? B.sodaAdded,
  // Iz tabele: izguba mase v zadnji vrstici (Δm je masa CO₂, ki je ušel), m(NaHCO₃) = −Δm · M(NaHCO₃) / M(CO₂).
  izMeritev: (c) => {
    const dm = c.vrstice.map((r) => stevilo(celica(r, /^Δm\b/))).filter(Number.isFinite).at(-1);
    return dm < 0 ? (-dm * M.NaHCO3) / M.CO2 : NaN;
  },
  meritve: [
    {
      kaj: "Zaščitna očala si nadel, preden si nalil kislino",
      tock: 1,
      ok: (c) => {
        const k = prvi(c.dnevnik, NALIL), o = prvi(c.dnevnik, OCALA);
        return k >= 0 && o >= 0 && o < k;
      },
    },
    {
      kaj: "Kisline je bilo dovolj za ves vzorec (presežek)",
      tock: 1,
      ok: (c) => nKisline(c.dnevnik) >= VZOREC.meja / M.NaHCO3,
    },
    {
      kaj: "Bučka je bila odprta in nič se ni prelilo",
      tock: 1,
      ok: (c) => prvi(c.dnevnik, NALIL) >= 0 && c.par("zamašek") === "brez zamaška" && !c.dnevnik.some((t) => USLO.test(t)),
    },
    {
      kaj: "Maso si zapisoval vsaj 5 minut po začetku reakcije",
      tock: 1,
      ok: (c) => {
        const t = c.vrstice.map((r) => stevilo(celica(r, /^t\b/))).filter(Number.isFinite);
        return t.length >= 3 && Math.max(...t) >= 300;
      },
    },
  ],
  // Račun s pravo maso sode je le v vprašanju »Sklep« (.lab-q), ki ga okvir že skrije.
  skrij: [],
  // Nov vzorec: v prazno bučko (motor je postavljen znova) stresi sodo z neznano maso, brez vrstice v dnevniku.
  priprava: (mount) => {
    const B = mount._labBench;
    if (!B || B.vzorec != null) return;
    B.vzorec = B.addSoda(VZOREC.min + (VZOREC.max - VZOREC.min) * B.r());
  },
};

// Maturitetni poskus: upor upornika iz grafa I(U) (motor lab-fiz.js → labOhm; okvir lab-matura.js).
// Neznanka je pravi upor upornika z oznako 100 Ω (OhmBench → parts.R100.R pri 20 °C). Seme ga izbere znotraj
// tolerance ±5 % (lab-model.js → UPOR.tol), zato ima vsaka naloga drug upor. Oznaka 100 Ω je vidna kot na pravem uporniku:
// kdor vpiše kar 100 Ω, je do 5 % od prave vrednosti in brez ujemajočih se meritev (izMeritev) ne dobi točk za rezultat.
import { stevilo, celica, kjer, razlicne } from "../lab-vodeno-pomoc.js";
import { fitOrigin } from "../lab-model.js";

// Popolne meritve upornika 100 Ω: v tabeli sta odčitka obeh merilnikov (ne »OL« ali »–«).
const polne = (c) => kjer(c, /^porabnik/, /^100\b/).filter((r) => Number.isFinite(stevilo(celica(r, /^U\b/))) && Number.isFinite(stevilo(celica(r, /^I\b/))));
const napetosti = (c) => polne(c).map((r) => stevilo(celica(r, /^U\b/)));
const petNapetosti = (c) => razlicne(polne(c), /^U\b/, 1).size >= 5;
// Dnevnik motorja (lab-fiz.js → say): pregret ali zgorel upornik, pregorela varovalka ampermetra.
export const PREGRET = /Upornik se greje|Upornik je zgorel/, VAROVALKA = /pregorela varovalka/;

export default {
  naslov: "Upor upornika iz grafa I(U)",
  naloga: "Določi upor upornika z oznako 100 Ω. Ampermeter veži zaporedno, voltmeter vzporedno z upornikom. Izmeri tok pri vsaj petih različnih napetostih, od največ 2 V do vsaj 5 V. Upornik zdrži le 0,5 W, zato napetosti ne povečaj nad 6,5 V. Nariši graf I(U) in iz naklona premice izračunaj upor. Oceni napako meritve.",
  kolicina: "R",
  zgled: "101,3",
  zgledNap: "0,8",
  dec: 1,
  enote: [["Ω", 1], ["kΩ", 1e3], ["A/V", null], ["W", null]],
  // Skrben dijak (7 napetosti od 1 do 7 V, območji 200 mA in 20 V, premica skozi izhodišče) je zaradi stalne napake
  // umeritve obeh merilnikov do ~1 % od prave vrednosti (test/laboratorij-matura.test.js: simulacija na 500 vzorcih).
  tol: 0.01,
  resnica: (B) => B.parts.R100.R,
  // Iz tabele kot graf pod poskusom: premica I(U) skozi izhodišče (vsaj tri popolne meritve upornika 100 Ω), R = 1/naklon
  // (tok v mA, zato 1000/naklon v Ω). Napis 100 Ω brez meritev ne prinese točk.
  izMeritev: (c) => {
    const pts = polne(c).map((r) => [stevilo(celica(r, /^U\b/)), stevilo(celica(r, /^I\b/))]);
    return pts.length >= 3 ? 1000 / fitOrigin(pts) : NaN;
  },
  meritve: [
    { kaj: "Tok si izmeril pri vsaj petih različnih napetostih (upornik 100 Ω)", tock: 1, ok: petNapetosti },
    {
      kaj: "Napetosti segajo od največ 2 V do vsaj 5 V",
      tock: 1,
      ok: (c) => {
        const U = napetosti(c);
        return U.length >= 2 && Math.min(...U) <= 2 && Math.max(...U) >= 5;
      },
    },
    { kaj: "Upornika nisi pregrel: moč je ostala pod 0,5 W", tock: 1, ok: (c) => petNapetosti(c) && !c.dnevnik.some((t) => PREGRET.test(t)) },
    {
      kaj: "Ampermeter je vezan zaporedno, voltmeter vzporedno, varovalka ni pregorela",
      tock: 1,
      ok: (c) => polne(c).length >= 1 && c.par("ampermeter") === "zaporedno" && c.par("voltmeter") === "vzporedno" && !c.dnevnik.some((t) => VAROVALKA.test(t)),
    },
  ],
  // Besedilo pod grafom pokaže naklon in upor, ko je račun razkrit.
  skrij: [".lab-fitout"],
};

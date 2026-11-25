// Maturitetni poskus: titracija klorovodikove kisline z NaOH (motor lab-titracija.js; okvir lab-matura.js).
// Neznanka je koncentracija HCl v vzorcu (TitrBench → c.hcl, 0,08–0,12 mol/L, novo seme = nov vzorec).
import { celica, stevilo } from "../lab-vodeno-pomoc.js";
import { ujemanje, PIPETIRAL, NAROBE, SPRAL, NAPOLNIL, ZRAK } from "../lab-vodeno-koraki.js";

const prvi = (dn, re) => dn.findIndex((t) => re.test(t));
const hcl = (c) => c.vrstice.filter((r) => celica(r, /^vzorec/) === "HCl");

export default {
  naslov: "Koncentracija klorovodikove kisline",
  naloga: "V erlenmajerico odpipetiraj 25,00 mL vzorca klorovodikove kisline neznane koncentracije in ga titriraj z raztopino NaOH s koncentracijo 0,1000 mol/L. Titriraj, dokler se dve titraciji ne ujemata na 0,10 mL. Izračunaj koncentracijo HCl v vzorcu in oceni napako meritve.",
  kolicina: "c(HCl)",
  zgled: "0,0985",
  zgledNap: "0,0010",
  dec: 4,
  enote: [["mol/L", 1], ["mmol/L", 1e-3], ["g/L", null], ["mol", null]],
  // Skrben dijak (spiranje, brez zraka, po kapljicah, odčitek na 0,05 mL) je zaradi napake pipete in umeritve birete
  // do ~2 % od prave vrednosti (test/laboratorij-matura.test.js: simulacija na 500 vzorcih).
  tol: 0.025,
  resnica: (B) => B.c.hcl,
  // Iz tabele: povprečje titracij HCl, ki se ujemajo na 0,10 mL (največ jih v oknu 0,10 mL), c = 0,1000 · V / 25,00.
  izMeritev: (c) => {
    const V = hcl(c).map((r) => stevilo(celica(r, /^V\b/))).filter(Number.isFinite);
    let best = [];
    for (const a of V) {
      const s = V.filter((b) => b >= a - 1e-9 && b <= a + 0.1 + 1e-9);
      if (s.length > best.length) best = s;
    }
    return best.length >= 2 ? (0.1 * best.reduce((x, y) => x + y, 0)) / best.length / 25 : NaN;
  },
  meritve: [
    {
      kaj: "Bireto si pred polnjenjem spral s titrantom",
      tock: 1,
      ok: (c) => {
        const f = prvi(c.dnevnik, NAPOLNIL);
        return f > 0 && c.dnevnik.slice(0, f).some((t) => SPRAL.test(t));
      },
    },
    {
      kaj: "Po polnjenju si izpustil zrak iz konice",
      tock: 1,
      ok: (c) => {
        const f = prvi(c.dnevnik, NAPOLNIL);
        return f >= 0 && c.dnevnik.slice(f).some((t) => ZRAK.test(t));
      },
    },
    {
      kaj: "Vzorec si vedno pipetiral pravilno (pipeta sprana z vzorcem, erlenmajerica ne)",
      tock: 1,
      ok: (c) => c.dnevnik.some((t) => PIPETIRAL.test(t) && /klorovodikova/.test(t)) && !c.dnevnik.some((t) => NAROBE.test(t)),
    },
    { kaj: "Dve titraciji HCl se ujemata na 0,10 mL", tock: 1, ok: (c) => ujemanje(hcl(c)) },
  ],
  // Povzetek titracij s povprečno porabo in preverjanje koncentracije (pove pravo vrednost).
  skrij: [".lab-tit-sum", ".lab-tit-calc"],
  // Neznani vzorec je HCl: izbira vzorca ostane na klorovodikovi kislini.
  priprava: (mount) => {
    const sel = [...mount.querySelectorAll("select")].find((s) => s.getAttribute("aria-label") === "vzorec");
    if (sel && sel.value !== "hcl") (sel.value = "hcl"), sel.dispatchEvent(new Event("change"));
  },
};

// Maturitetni poskus: aktivacijska energija reakcije tiosulfata s klorovodikovo kislino (motor lab-reakcije.js → labHitrost,
// le srednješolski ključ; okvir lab-matura.js). Učenec meri čas, v katerem izgine križ, pri sobni temperaturi in v topli
// vodni kopeli z enako raztopino; hitrost je obratno sorazmerna s časom, zato Eₐ = R · ln(t₁/t₂) / (1/T₁ − 1/T₂).
// Prava vrednost je konstanta modela TIO.Ea = 52 kJ/mol (lab-model-reakcije.js, ocena iz literature), zato je pri vsaki
// nalogi enaka. Novo seme spremeni le sobno temperaturo (20–24 °C), presojo križa in reakcijski čas.
import { TIO } from "../lab-model-reakcije.js";
import { R_PLIN } from "../lab-model.js";
import { tiosulfat } from "../vodeno/lab-hitrost.js";

const NAROBE = /Križ je še precej viden|Raztopina je že povsem motna/;
const dobre = (c) => tiosulfat(c).filter((x) => !x.slabo);
// Najmanjša razlika temperatur (°C) med meritvami pri sobni temperaturi in v kopeli.
export const DT_MIN = 15;
// Ponovljivost: pri vsaki od obeh temperatur (±3 °C od najnižje in najvišje) vsaj dva časa, ki se ujemata na 5 %.
export function ponovljeno(c) {
  const d = dobre(c);
  if (d.length < 4) return false;
  const T = d.map((x) => x.T), lo = Math.min(...T), hi = Math.max(...T);
  if (hi - lo < 10) return false;
  const par = (g) => g.some((a, i) => g.some((b, j) => i !== j && Math.abs(a.t - b.t) <= 0.05 * Math.max(a.t, b.t)));
  return par(d.filter((x) => x.T <= lo + 3)) && par(d.filter((x) => x.T >= hi - 3));
}

export default {
  naslov: "Aktivacijska energija reakcije tiosulfata",
  naloga: `Določi aktivacijsko energijo reakcije natrijevega tiosulfata s klorovodikovo kislino. Izvedi poskus s tiosulfatom in križem. Čas, v katerem križ izgine, izmeri pri sobni temperaturi in v vodni kopeli, ki je vsaj ${DT_MIN} °C toplejša. Pri obeh temperaturah uporabi enako raztopino tiosulfata in pri vsaki izmeri vsaj dvakrat, tako da se časa ujemata na 5 %. Hitrost reakcije je obratno sorazmerna s časom. Pri reakciji nastaja dražljiv SO₂, zato delaj v zračnem prostoru. Plinska konstanta je R = 8,314 J/(mol K). Z Arrheniusovo enačbo izračunaj aktivacijsko energijo in oceni napako meritve.`,
  kolicina: "Eₐ",
  zgled: "48,5",
  zgledNap: "2,5",
  dec: 1,
  enote: [["kJ/mol", 1], ["J/mol", 1e-3], ["kJ", null], ["s⁻¹", null]],
  // Skrben dijak (50 mL raztopine, kopel 40 °C, dve meritvi pri vsaki temperaturi, povprečna časa in temperaturi iz tabele)
  // je zaradi presoje križa in reakcijskega časa do ~2,5 % od prave vrednosti (test/laboratorij-matura.test.js, 500 vzorcev).
  tol: 0.03,
  resnica: (Bs) => (Bs?.tio ? TIO.Ea / 1000 : NaN),
  // Prava vrednost je konstanta: rezultat se mora z izMeritev ujemati na tol (lab-matura.js → oceni).
  stalnica: true,
  // Iz tabele in dnevnika: pravočasno ustavljene meritve pri najnižji in najvišji temperaturi (±3 °C, kot ponovljivost),
  // povprečna časa in temperaturi, Eₐ = R · ln(t₁/t₂) / (1/T₁ − 1/T₂). Temperaturi se morata razlikovati za več kot 6 °C.
  izMeritev: (c) => {
    const d = dobre(c).filter((x) => Number.isFinite(x.T) && x.t > 0);
    if (!d.length) return NaN;
    const T = d.map((x) => x.T), lo = Math.min(...T), hi = Math.max(...T);
    if (!(hi - lo > 6)) return NaN;
    const povp = (g, k) => g.reduce((s, x) => s + x[k], 0) / g.length;
    const a = d.filter((x) => x.T <= lo + 3), b = d.filter((x) => x.T >= hi - 3);
    const T1 = povp(a, "T") + 273.15, T2 = povp(b, "T") + 273.15;
    return (R_PLIN * Math.log(povp(a, "t") / povp(b, "t"))) / (1 / T1 - 1 / T2) / 1000;
  },
  meritve: [
    {
      kaj: `Meril si pri dveh temperaturah, ki se razlikujeta vsaj za ${DT_MIN} °C`,
      tock: 1,
      ok: (c) => {
        const T = dobre(c).map((x) => x.T).filter(Number.isFinite);
        return T.length >= 2 && Math.max(...T) - Math.min(...T) >= DT_MIN;
      },
    },
    {
      kaj: "Vse meritve si naredil z enako raztopino tiosulfata",
      tock: 1,
      ok: (c) => {
        const d = dobre(c);
        return d.length >= 2 && d.every((x) => x.V === d[0].V);
      },
    },
    { kaj: "Pri vsaki temperaturi si meril vsaj dvakrat in časa se ujemata na 5 %", tock: 1, ok: ponovljeno },
    {
      kaj: "Nobene meritve nisi ustavil prezgodaj ali prepozno",
      tock: 1,
      ok: (c) => tiosulfat(c).length >= 2 && !c.dnevnik.some((t) => NAROBE.test(t)),
    },
  ],
  // Račun pod grafom (red reakcije, Eₐ iz Arrheniusove enačbe) in viri (»Ea ≈ 52 kJ/mol«) povedo pravo vrednost.
  skrij: [".lab-ek-calc", ".lab-rk-viri"],
  // Poskus s tiosulfatom: izbira poskusa preklopi na »tiosulfat (križ)«.
  priprava: (mount) => {
    const b = [...mount.querySelectorAll(".seg-btn")].find((x) => !x.closest(".lab-vod-wrap") && x.textContent.trim().startsWith("tiosulfat"));
    if (b && b.getAttribute("aria-checked") !== "true") b.click();
  },
};

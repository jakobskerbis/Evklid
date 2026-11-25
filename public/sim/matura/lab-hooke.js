// Maturitetni poskus: prožnostni koeficient vzmeti (motor lab-sile.js → labHooke; okvir lab-matura.js).
// Neznanka je k mehke vzmeti (HookeBench → kNom.mehka: 15 N/m ±5 %, novo seme = nova vzmet). Učenec meri podaljšek pri
// vsaj petih masah do 250 g (meja prožnosti mehke vzmeti je 2,5 N) in k določi iz naklona premice F(x).
import { cistZacetni, koeficient, masa, podaljsek, mehka, zadnjePoMasi, OPOZORILO } from "../vodeno/lab-hooke.js";

// Najnovejše meritve pri vsaki masi ležijo največ 2,5 mm od premice skozi izhodišče (kot vodeni korak »lepaVrsta«):
// odčitek pri nihajoči vzmeti ali po preobremenitvi (trajni podaljšek) je odmaknjen več milimetrov.
export function naPremici(c) {
  const r = zadnjePoMasi(c);
  if (r.length < 3) return false;
  const k = koeficient(r) / 100; // N/cm
  return k > 0 && r.every((x) => Math.abs(podaljsek(x) - ((masa(x) / 1000) * 9.81) / k) <= 0.25);
}

export default {
  naslov: "Prožnostni koeficient vzmeti",
  naloga: "Na stojalu je mehka vzmet z neznanim prožnostnim koeficientom. Najprej zapiši odčitek kazalca brez uteži. Nato obešaj uteži od 50 g do 250 g in izmeri podaljšek vzmeti pri vsaj petih različnih masah. Vzmeti ne obremeni z več kot 250 g. Nariši graf F(x) in iz naklona premice določi prožnostni koeficient vzmeti. Oceni napako meritve.",
  kolicina: "k",
  zgled: "14,6",
  dec: 2,
  enote: [["N/m", 1], ["N/cm", 100], ["N", null], ["m/N", null]],
  // Skrben dijak (začetni odčitek in vsi odčitki z očesom v višini kazalca pri mirni vzmeti, 50–250 g, odčitek na 1 mm)
  // je pri naklonu premice v 95 % vzorcev do 0,5 % od prave vrednosti, pri povprečju F/x po točkah do 1,0 %
  // (test/matura/lab-hooke.js: simulacija na 500 vzorcih).
  tol: 0.01,
  resnica: (B) => B.kNom.mehka,
  // Iz tabele kot račun pod grafom: premica F(x) skozi izhodišče iz najnovejše meritve pri vsaki masi mehke vzmeti
  // (vsaj tri mase), k = Σ F·x / Σ x² (x v cm, zato · 100 v N/m).
  izMeritev: (c) => {
    const r = zadnjePoMasi(c);
    return r.length >= 3 ? koeficient(r) : NaN;
  },
  meritve: [
    {
      kaj: "Začetni odčitek brez uteži si zapisal z očesom v višini kazalca pri mirni vzmeti",
      tock: 1,
      ok: (c) => cistZacetni(c.dnevnik) && mehka(c).some((r) => masa(r) === 0),
    },
    {
      kaj: "Meril si pri vsaj petih različnih masah, največja vsaj 200 g",
      tock: 1,
      ok: (c) => {
        const r = zadnjePoMasi(c);
        return r.length >= 5 && Math.max(...r.map(masa)) >= 200;
      },
    },
    {
      kaj: "Noben odčitek ni bil zapisan s poševnim pogledom ali pri nihajoči vzmeti",
      tock: 1,
      ok: (c) => mehka(c).some((r) => masa(r) > 0) && !c.dnevnik.some((t) => OPOZORILO.test(t)),
    },
    { kaj: "Točke ležijo na premici skozi izhodišče (vzmet ni preobremenjena)", tock: 1, ok: naPremici },
  ],
  // Izračun pod grafom pokaže k (po »Pokaži rešitev«) in napisano vrednost na vzmeti.
  skrij: [".lab-top-calc"],
  // Neznana vzmet je mehka: izbira vzmeti ostane na njej.
  priprava: (mount) => {
    const seg = [...mount.querySelectorAll("[role=radiogroup]")].find((s) => s.getAttribute("aria-label") === "vzmet");
    const b = seg?.querySelector('[data-v="mehka"]');
    if (b && !b.classList.contains("on")) b.click();
  },
};

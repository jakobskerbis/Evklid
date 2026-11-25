// Igra maturitetnega poskusa lab-co2 (test/laboratorij-matura.test.js): po »Začni nalogo« je v bučki vzorec sode,
// učenec si nadene očala in nalije 30 mL kisa (privzeta izbira); reakcija se začne. Maso zapiše takoj, po 2,5 in po
// 5 minutah. Motor nima hitrejšega časa, zato igra čakanje skrajša: model poskusa premakne naprej (kot bi učenec čakal).
export default {
  meritve: [1, 1, 1, 1],
  novaNeznanka: true,
  igra: async () => {
    const B = m._labBench;
    if (!(B.vzorec > 0) || B.t0 != null) throw new Error("v bučki ni vzorca sode");
    await stikalo("zaščitna očala");
    await gumb("Nalij v bučko");
    await dokler(() => B.t0 != null && /Začetna masa bučke/.test(m.querySelector(".lab-log")?.textContent || ""));
    await wait(1500); // mehurčki: masa se že manjša
    const vrstic = () => m.querySelectorAll("table.lab-table tbody tr").length;
    for (const t of [0, 150, 305]) {
      while (B.t - B.t0 < t) B.step(0.5);
      const n = vrstic();
      await gumb("Zapiši meritev");
      await dokler(() => vrstic() > n);
    }
  },
};

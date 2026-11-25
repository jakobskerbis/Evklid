// Igra maturitetnega poskusa lab-co2 (test/laboratorij-matura.test.js): po »Začni nalogo« je v bučki vzorec sode,
// učenec si nadene očala in nalije 30 mL kisa (privzeta izbira); reakcija se začne.
export default {
  meritve: [1, 1, 1, 0],
  novaNeznanka: true,
  igra: async () => {
    if (!(m._labBench.vzorec > 0) || m._labBench.t0 != null) throw new Error("v bučki ni vzorca sode");
    await stikalo("zaščitna očala");
    await gumb("Nalij v bučko");
    await dokler(() => m._labBench.t0 != null && /Začetna masa bučke/.test(m.querySelector(".lab-log")?.textContent || ""));
    await wait(1500); // mehurčki: masa se že manjša
  },
};

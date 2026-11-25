// Igra maturitetnega poskusa lab-hitrost (test/laboratorij-matura.test.js): priprava izbere poskus s tiosulfatom;
// učenec si nadene očala, pripravi 50 mL raztopine, prilije kislino in ustavi štoparico, ko križ izgine; dvakrat pri sobni
// temperaturi in dvakrat v kopeli pri 40 °C. Čas teče hitreje (×20, v kopeli ×5), tik pred izginotjem križa pa ×1,
// da je ustavljeni čas natančen kot pri učencu (pozna ustavitev za desetinko sekunde).
// Meritve: obe temperaturi, ista raztopina, ponovljivost na 5 % (odvisna od presoje križa, zato ni določena), pravočasno.
export default {
  meritve: [1, 1, null, 1],
  igra: async () => {
    const seg = async (t) => {
      const b = [...m.querySelectorAll(".seg-btn")].find((x) => !x.closest(".lab-vod-wrap") && txt(x) === t);
      if (!b) throw new Error("ni izbire " + t);
      b.click();
      await wait(120);
    };
    if (m._labBench.tio == null) throw new Error("motor ne izpostavi tiosulfata");
    const tio = () => m._labBench.tio;
    await stikalo("zaščitna očala");
    for (const [kopel, hitro] of [[20, "×20"], [20, "×20"], [40, "×5"], [40, "×5"]]) {
      if (kopel > 20 && !(tio().Tkop > 35)) await drsnik("vodna kopel", kopel);
      await seg(hitro);
      await gumb("Pripravi 50 mL");
      await gumb("Prilij 5 mL");
      await dokler(() => tio().vidnost() < 0.04 || tio().kriz != null, 30000);
      await seg("×1");
      await dokler(() => tio().kriz != null, 30000);
      await gumb("Križa ne vidim več");
    }
    if ([...m.querySelectorAll(".lab-log li")].filter((x) => /Križ je izginil po/.test(x.textContent)).length < 2) throw new Error("ni meritev");
  },
};

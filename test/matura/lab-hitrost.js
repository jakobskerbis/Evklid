// Igra maturitetnega poskusa lab-hitrost (test/laboratorij-matura.test.js): priprava izbere poskus s tiosulfatom;
// učenec si nadene očala, pospeši čas, pripravi 50 mL raztopine, prilije kislino in ustavi štoparico,
// ko križ izgine; to ponovi.
export default {
  meritve: [0, 1, 0, 1],
  igra: async () => {
    const seg = async (t) => {
      const b = [...m.querySelectorAll(".seg-btn")].find((x) => !x.closest(".lab-vod-wrap") && txt(x) === t);
      if (!b) throw new Error("ni izbire " + t);
      b.click();
      await wait(120);
    };
    if (m._labBench.tio == null) throw new Error("motor ne izpostavi tiosulfata");
    await stikalo("zaščitna očala");
    await seg("×20");
    // Dve meritvi pri sobni temperaturi z enako raztopino: ista raztopina in pravočasno ustavljeno (2 točki od 4).
    for (let i = 0; i < 2; i++) {
      await gumb("Pripravi 50 mL");
      await gumb("Prilij 5 mL");
      await dokler(() => m._labBench.tio.kriz != null, 20000);
      await gumb("Križa ne vidim več");
    }
    if ([...m.querySelectorAll(".lab-log li")].filter((x) => /Križ je izginil po/.test(x.textContent)).length !== 2) throw new Error("ni dveh meritev");
  },
};

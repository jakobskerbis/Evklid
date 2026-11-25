// Igra maturitetnega poskusa lab-elektroliza (test/laboratorij-matura.test.js): učenec napolni aparat z odprtima pipama,
// pipi zapre, nastavi 6 V, vklopi napajalnik, samodejni zapis vsako minuto in štoparico pri ×60; ko je na katodi več kot
// 20 mL vodika, počaka še na en zapis in ustavi štoparico. Plinov ne dokaže. Izračun F pod grafom je skrit.
export default {
  meritve: [1, 1, 1, 0],
  igra: async () => {
    const seg = async (t) => {
      const b = [...m.querySelectorAll(".seg-btn")].find((x) => !x.closest(".lab-vod-wrap") && txt(x) === t);
      if (!b) throw new Error("ni izbire " + t);
      b.click();
      await wait(120);
    };
    const B = m._labBench;
    await gumb("Nalij tekočino skozi srednjo cev");
    await preklopi("pipa levo odprta", false);
    await preklopi("pipa desno odprta", false);
    await drsnik("napetost napajalnika", 6);
    await preklopi("napajalnik vklopljen", true);
    await preklopi("zapiši samodejno vsako minuto", true);
    await seg("×60");
    await gumb("Štoparica: začni");
    await dokler(() => B.odcitek(B.katoda).value > 20.5, 90000);
    const n = m.querySelectorAll("table.lab-table tbody tr").length;
    await dokler(() => m.querySelectorAll("table.lab-table tbody tr").length > n, 10000);
    await gumb("Štoparica: začni");
    await dokler(() => /Faradayeva konstanta/.test(m.querySelector(".lab-ek-calc")?.textContent || ""));
  },
};

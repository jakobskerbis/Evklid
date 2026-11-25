// Igra maturitetnega poskusa lab-elektroliza (test/laboratorij-matura.test.js): učenec napolni aparat z odprtima pipama,
// pipi zapre, nastavi 6 V, vklopi napajalnik in štoparico pri ×60 in zapiše meritev; izračun F pod grafom je skrit.
export default {
  meritve: [1, 0, 0, 0],
  igra: async () => {
    const preklopi = async (t, on) => {
      const c = [...m.querySelectorAll(".demo-check")].find((x) => txt(x).startsWith(t))?.querySelector("input");
      if (!c) throw new Error("ni stikala " + t);
      if (c.checked !== on) c.click();
      await wait(120);
    };
    const seg = async (t) => {
      const b = [...m.querySelectorAll(".seg-btn")].find((x) => !x.closest(".lab-vod-wrap") && txt(x) === t);
      if (!b) throw new Error("ni izbire " + t);
      b.click();
      await wait(120);
    };
    await gumb("Nalij tekočino skozi srednjo cev");
    await preklopi("pipa levo odprta", false);
    await preklopi("pipa desno odprta", false);
    const r = [...m.querySelectorAll(".demo-slider-label")].find((x) => txt(x).startsWith("napetost napajalnika"))?.parentElement.querySelector('input[type="range"]');
    r.value = "6";
    r.dispatchEvent(new Event("input", { bubbles: true }));
    await preklopi("napajalnik vklopljen", true);
    await seg("×60");
    await gumb("Štoparica: začni");
    await dokler(() => m._labBench.odcitek(m._labBench.katoda).value > 3, 30000);
    await gumb("Zapiši meritev");
    await dokler(() => /Faradayeva konstanta/.test(m.querySelector(".lab-ek-calc")?.textContent || ""));
  },
};

// Igra vodenega poskusa lab-hitrost (test/laboratorij-vodeno.test.js): teče v testni strani, le s kliki kot učenec.
export default async () => {
  const vrsticTabele = () => [...document.querySelectorAll("table.lab-table")].filter((t) => !t.closest("[hidden]") && !t.hidden).reduce((n, t) => n + t.querySelectorAll("tbody tr").length, 0);
  // Marmor: sveža kislina, marmor (srednji, 5 g, vata, štoparica ob dodatku), počakaj na samodejni zapis pri 30 s.
  const marmor = async (c) => {
    await izbira("klorovodikova kislina (40 mL)", c);
    await klik("Nalij 40 mL");
    const n = vrsticTabele();
    await klik("Dodaj marmor");
    await dokler(() => vrsticTabele() >= n + 2, 30000); // t = 0 ob dodatku, nato t = 30 s
  };
  // Tiosulfat: učenec gleda od zgoraj in ustavi, ko je križ skoraj neviden (motnost v pogledu od zgoraj ≥ 0,9).
  const motnost = () => {
    for (const x of document.querySelectorAll("svg.lab-bench circle")) {
      const m = (x.getAttribute("fill") || "").match(/^rgb\(246 242 214 \/ ([\d.]+)\)$/);
      if (m) return Number(m[1]);
    }
    return 0;
  };
  const tio = async (V, hitrost) => {
    await izbira("hitrost časa", hitrost);
    await izbira("raztopina Na₂S₂O₃ (40 g/L) + voda do 50 mL", `${V} mL`);
    await klik("Pripravi 50 mL");
    await klik("Prilij 5 mL");
    await dokler(() => motnost() >= 0.9, 60000);
    const n = vrsticTabele();
    await klik("Križa ne vidim");
    await dokler(() => vrsticTabele() > n);
  };
  await stikalo("zaščitna očala");
  await izbira("hitrost časa", "×20");
  for (const c of ["0,5 mol", "1 mol", "2 mol"]) await marmor(c);
  await izbira("prikaži", "začetna hitrost");
  await izbira("poskus", "tiosulfat");
  // Pri hitrih meritvah ×5, da je med »križ še viden« in »povsem motna« dovolj časa za klik.
  for (const V of [50, 40, 30, 20, 10]) await tio(V, V >= 40 ? "×5" : "×20");
  await drsnik("vodna kopel", 35);
  await tio(30, "×5");
  await sklep(0);
};

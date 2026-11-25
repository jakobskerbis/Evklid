// Igra vodenega poskusa lab-grelnik (test/laboratorij-vodeno.test.js): teče v testni strani s pomočniki klik, stikalo …
export default async () => {
  const m = document.getElementById("m");
  const txt = (e) => (e.textContent || "").replace(/\s+/g, " ").trim();
  // Učenec vzame podatke iz namiga pod tabelo (m, T₁, T₂, U, I, t) in izračuna izkoristek v %.
  const izracunaj = async () => {
    await dokler(() => m.querySelector("details.lab-top-podatki"));
    const p = txt(m.querySelector("details.lab-top-podatki p"));
    const v = (re) => Number(p.match(re)[1].replace(",", "."));
    const eta = (100 * v(/\bm = ([\d,]+)/) * 4182 * (v(/T₂ = ([\d,]+)/) - v(/T₁ = ([\d,]+)/))) / (v(/\bU = ([\d,]+)/) * v(/\bI = ([\d,]+)/) * v(/\bt = ([\d,]+)/));
    await vpisi("tvoj rezultat v %", eta.toFixed(1).replace(".", ","));
    await klik("Preveri moj račun");
  };
  // Segreva pri ×60, dokler tabela nima zapisa pri 300 s (t = 0 in 10 samodejnih), nato izklopi, premeša in zapiše.
  const segrej = async () => {
    await klik("Vklopi grelec");
    await izbira("hitrost časa", "×60");
    await dokler(() => vrstic() >= 11, 30000);
    await klik("Izklopi grelec");
    await izbira("hitrost časa", "×1");
    await stikalo("mešaj z mešalno palčko", true);
    await wait(500);
    await klik("Zapiši meritev");
  };
  const korak = async (n, kje) => {
    await wait(300);
    if (vod.korak !== n) throw new Error(`${kje}: korak ${vod.korak + 1}, pričakovan ${n + 1}`);
  };
  await klik("Stehtaj vodo"); // voda v čaši ni na novo natočena: ne šteje
  await korak(0, "tehtanje brez nalivanja");
  await drsnik("masa vode", 200);
  await klik("Natoči svežo vodo");
  await klik("Stehtaj vodo");
  await segrej();
  await izracunaj();
  await korak(6, "pred sklepom");
  await sklep(0);
  await klik("Vklopi grelec"); // brez nove vode: grelec le nadaljuje prvi poskus, to ni ponovitev
  await stikalo("pokrov na čaši", true);
  await stikalo("mešaj z mešalno palčko", true);
  await korak(7, "ponovitev brez nove vode");
  await klik("Natoči svežo vodo");
  await klik("Stehtaj vodo");
  await stikalo("pokrov na čaši", true);
  await stikalo("mešaj z mešalno palčko", true);
  await segrej();
  await izracunaj();
};

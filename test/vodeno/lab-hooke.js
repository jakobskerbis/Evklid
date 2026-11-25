// Igra vodenega poskusa lab-hooke (test/laboratorij-vodeno.test.js): teče v testni strani s kliki, kot bi jih naredil učenec.
export default async () => {
  const lcd = () => document.querySelector(".lab-lcd")?.textContent || "";
  // Utež (gumb »50 g« …) obesi ali snemi tako, da je obešenih natanko `g` gramov.
  const obesi = async (...g) => {
    await klik("Snemi vse");
    for (const x of g) await klik(x + " g"); // klik primerja besedilo, v katerem je NBSP že navaden presledek
  };
  const umiriInZapisi = async () => {
    await klik("Umiri vzmet");
    await wait(250);
    await dokler(() => /kazalec miruje/.test(lcd()));
    await klik("Zapiši meritev");
  };
  await izbira("oko", "više");
  await izbira("oko", "v višini");
  await klik("Zapiši meritev"); // začetni odčitek
  for (const g of [[50], [100], [100, 50], [200], [200, 50]]) {
    await obesi(...g);
    await umiriInZapisi();
  }
  await sklep(0);
  // k iz tabele kot učenec: naklon premice skozi izhodišče, F = m g, x v cm.
  const st = (t) => Number(String(t).replace(",", "."));
  let sxy = 0, sxx = 0;
  for (const tr of document.querySelectorAll("table.lab-table tbody tr")) {
    const td = [...tr.children].map((x) => x.textContent.trim());
    const m = st(td.at(-4)), x = st(td.at(-1));
    sxy += x * (m / 1000) * 9.81;
    sxx += x * x;
  }
  await vpisi("tvoj rezultat v N/m", ((sxy / sxx) * 100).toFixed(1).replace(".", ","));
  await klik("Preveri moj račun");
  await obesi(200, 100, 50);
  await umiriInZapisi();
  await klik("Snemi vse");
  await umiriInZapisi();
  await klik("Zamenjaj z novo");
};

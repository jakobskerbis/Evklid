// Igra vodenega poskusa lab-lom (test/laboratorij-vodeno.test.js): teče v testni strani s pomočniki klik, stikalo, drsnik …
export default async () => {
  const m = document.getElementById("m");
  const txt = (e) => (e.textContent || "").replace(/\s+/g, " ").trim();
  const glava = () => [...m.querySelectorAll("table.lab-table thead th")].map(txt);
  const vrstice = () => [...m.querySelectorAll("table.lab-table tbody tr")].map((tr) => Object.fromEntries(glava().map((g, i) => [g, txt(tr.children[i] || {})])));
  const st = (s) => Number(String(s).replace(",", "."));
  const korak = async (n, kje) => {
    await wait(300);
    if (vod.korak !== n) throw new Error(`${kje}: korak ${vod.korak + 1}, pričakovan ${n + 1}`);
  };
  await korak(0, "laser izklopljen");
  await stikalo("laser vklopljen");
  for (const a of [10, 20, 30, 40, 50, 60, 70, 80]) {
    await drsnik("vpadni kot α", a);
    await klik("Zapiši meritev");
  }
  await korak(3, "pred sklepom");
  await sklep(0);
  // Lomni količnik iz naklona premice skozi izhodišče (sin β od sin α), kot bi ga izračunal učenec iz tabele.
  const pts = vrstice().filter((r) => /zrak → akril/.test(r["snov, smer"])).map((r) => [st(r["sin α"]), st(r["sin β"])]);
  const k = pts.reduce((s, [x, y]) => s + x * y, 0) / pts.reduce((s, [x]) => s + x * x, 0);
  await vpisi("tvoj rezultat", "1,30"); // napačen račun ne šteje
  await korak(4, "napačen račun");
  await vpisi("tvoj rezultat", (1 / k).toFixed(2).replace(".", ","));
  await klik("Preveri moj račun");
  await korak(5, "po računu");
  await izbira("smer svetlobe", "iz snovi");
  // Od 38° navzgor po 1°, dokler lomljeni žarek ne izgine (mejni kot za akril je okoli 42°).
  for (let a = 38; a <= 50; a++) {
    await drsnik("vpadni kot α", a);
    await klik("Zapiši meritev");
    if (/popolni odboj/.test(vrstice().at(-1)["β"])) break;
  }
};

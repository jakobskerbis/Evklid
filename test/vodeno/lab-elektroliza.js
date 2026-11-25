// Igra vodenega poskusa lab-elektroliza (public/sim/vodeno/lab-elektroliza.js): teče v testni strani
// test/laboratorij-vodeno.test.js (PAGE) z njenimi pomočniki klik, stikalo, drsnik, izbira, sklep, wait, dokler, vrstic.
export default async () => {
  const v = (re) => [...document.querySelectorAll(".lab-ev")].some((x) => re.test(x.textContent));
  // Prostornina na katodi v zadnji vrstici tabele (stolpec »V katoda (−) [mL]«).
  const zadnjaVk = () => {
    const t = document.querySelector("table.lab-table");
    const i = [...t.querySelectorAll("thead th")].findIndex((x) => /^V katoda/.test(x.textContent.trim()));
    const tr = t.querySelector("tbody tr:last-child");
    return tr ? Number(tr.children[i]?.textContent.replace(",", ".")) || 0 : 0;
  };
  const korak = async (n) => {
    await wait(300);
    if (vod.korak !== n) throw new Error(`pričakoval korak ${n + 1}, je ${vod.korak + 1}`);
  };
  // 1: žveplova kislina 0,5 mol/L z odprtima pipama, nato pipi zapri.
  await klik("Nalij tekočino");
  await korak(0);
  await stikalo("pipa levo odprta", false);
  await stikalo("pipa desno odprta", false);
  await korak(1);
  // 2: 6 V, napajalnik vklopljen, mehurčki.
  await drsnik("napetost napajalnika", 6);
  await stikalo("napajalnik vklopljen", true);
  await dokler(() => v(/pojavijo mehurčki/));
  await korak(2);
  // 3: meritve do vsaj 10 mL na katodi.
  await klik("Štoparica na nič");
  await klik("Štoparica: začni");
  await izbira("hitrost časa", "×60");
  for (let k = 0; k < 60 && !(vrstic() >= 3 && zadnjaVk() >= 10); k++) {
    await wait(1200);
    await klik("Zapiši meritev");
  }
  await korak(3);
  await sklep(0);
  await korak(4);
  // 5, 6: preskusa plinov (katoda levo, anoda desno).
  await izbira("cev", "levo");
  await klik("Tleča trska"); // tleča trska v vodiku ugasne (plin uide): korak o vodiku ni opravljen
  await korak(4);
  // Plin se mora znova nabrati (vsaj 2 mL), šele nato goreča trska.
  for (let k = 0; k < 30 && !v(/v cevi je vodik/); k++) {
    await wait(1000);
    await klik("Goreča trska");
  }
  await korak(5);
  await izbira("cev", "desno");
  await klik("Tleča trska");
  await korak(6);
  // 7: zamenjaj pola.
  await izbira("priključitev", "levo +");
  await korak(7);
  // 8: destilirana voda.
  await stikalo("napajalnik vklopljen", false);
  await klik("Izprazni in speri");
  await izbira("tekočina", "destilirana");
  await stikalo("pipa levo odprta", true);
  await stikalo("pipa desno odprta", true);
  await klik("Nalij tekočino");
  await drsnik("napetost napajalnika", 10);
  await stikalo("napajalnik vklopljen", true);
  await dokler(() => v(/nima ionov/));
  await korak(8);
  // 9: raztopina NaCl 1 mol/L.
  await stikalo("napajalnik vklopljen", false);
  await klik("Izprazni in speri");
  await izbira("tekočina", "raztopina natrijevega klorida");
  await izbira("koncentracija", "1,0");
  await klik("Nalij tekočino");
  await stikalo("pipa levo odprta", false);
  await stikalo("pipa desno odprta", false);
  await stikalo("napajalnik vklopljen", true);
  await dokler(() => v(/diši po kloru/));
  await korak(9);
  // 10: anoda je po zamenjavi polov levo; počakaj, da se nabere vsaj 2 mL klora.
  await izbira("cev", "levo");
  for (let k = 0; k < 60 && !v(/klor beli/); k++) {
    await wait(1000);
    await klik("Vlažen lakmusov");
  }
};

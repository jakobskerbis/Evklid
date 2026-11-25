// Igra vodenega poskusa lab-co2 (test/laboratorij-vodeno.test.js): teče v testni strani, le s kliki kot učenec.
export default async () => {
  const sklepBesedilo = async (re) => {
    // Vprašanje »Sklep« po besedilu (vrstni red obeh vprašanj je odvisen od tega, kdaj je bila trska).
    let q = null;
    await dokler(() => (q = [...document.querySelectorAll(".lab-q")].find((x) => re.test(x.textContent))), 30000);
    for (const b of q.querySelectorAll(".lab-opt")) {
      if (q.querySelector(".lab-opt.ok")) break;
      b.click();
      await wait(60);
    }
    await wait(120);
  };
  const napis = (t) => [...document.querySelectorAll("svg.lab-bench text")].some((x) => x.textContent.trim() === t);
  await stikalo("zaščitna očala");
  await izbira("tekočina", "kis");
  await drsnik("merilni valj", 30);
  await klik("Nalij v bučko");
  await izbira("zamašek", "zamašek s cevko");
  await izbira("v epruveti", "apnica");
  await stikalo("zapisuj vsakih 10 s");
  await drsnik("soda bikarbona", 1);
  await klik("Stresi sodo");
  await dokler(() => napis("motna"), 60000); // apnica v epruveti se pomotni
  // Kis reagira počasi: soda se porabi v ~100 s (lab-model.js → Co2Bench, tau 6 s, hitrost pada s kislino).
  await dokler(() => /Reakcija je končana/.test(document.querySelector(".lab-status")?.textContent || ""), 300000);
  await izbira("zamašek", "brez zamaška");
  await klik("Prižgi trsko");
  await sklepBesedilo(/Kako si dokazal/);
  await sklepBesedilo(/izmerjena izguba manjša/);
};

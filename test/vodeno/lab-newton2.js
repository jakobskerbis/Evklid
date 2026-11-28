// Igra vodenega poskusa lab-newton2 (test/laboratorij-vodeno.test.js): teče v testni strani s kliki, kot bi jih naredil učenec.
export default async () => {
  const vrh = () => document.querySelector(".lab-log li");
  // Spusti voziček in počakaj na novo vrstico dnevnika, ki se ujema z `re`; vrne njeno besedilo ("" po `ms` brez nje).
  const spustiInBeri = async (re, ms) => {
    const prej = vrh();
    await klik("Spusti voziček");
    try {
      await dokler(() => vrh() !== prej && re.test(vrh().textContent), ms);
      return vrh().textContent;
    } catch {
      return "";
    }
  };
  // Spusti in zapiši, ko je voziček peljal skozi obe vrati (»Počakaj, da voziček pelje …« = še ne).
  const izmeri = async () => {
    await klik("Spusti voziček");
    const n = vrstic();
    for (let k = 0; k < 60 && vrstic() === n; k++) {
      await wait(200);
      await klik("Zapiši meritev");
    }
    if (vrstic() === n) throw new Error("meritev ni zapisana: " + zadnjiDnevnik());
  };
  await klik("Izravnaj progo");
  await stikalo("vrvica pripeta", false);
  await izbira("spust", "s potiskom");
  // Preizkus trenja: podložko popravlja po izidu v dnevniku (preizkus se konča, ko se voziček ustavi, do 12 s).
  let p = 3, ok = false;
  for (let k = 0; k < 20 && !ok; k++) {
    await drsnik("podložka pod levo nogo", p);
    const t = await spustiInBeri(/Preizkus trenja/, 16000);
    if (/izravnano/.test(t)) ok = true;
    else if (/preveč nagnjena/.test(t)) p = Math.max(0, p - 0.5);
    else p = Math.min(8, p + 0.5); // ustavlja se ali sploh ni prišel do vrat 2
  }
  if (!ok) throw new Error("trenje ni izravnano");
  await stikalo("vrvica pripeta", true);
  await izbira("spust", "elektromagnet");
  await izmeri(); // 20 g na obešalu
  for (let k = 0; k < 3; k++) {
    await klik("Utežico z vozička na obešalo");
    await izmeri();
  }
  await sklep(0);
  await izbira("palice 250 g", "1");
  await izmeri();
  await izbira("palice 250 g", "2");
  await izmeri();
  await izbira("prikaži", "a(1/m)");
  await sklep(1);
};

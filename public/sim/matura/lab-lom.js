// Maturitetni poskus: lomni količnik neznane snovi X (motor lab-optika.js → labLom; okvir lab-matura.js).
// Vsaka naloga ima nov vzorec: »Začni nalogo« postavi poskus z novim semenom in model iz semena izžreba lomni količnik
// snovi X, enakomerno med 1,42 in 1,62 (lab-model-optika.js → NX, nNeznane, LomBench.nX). Prava vrednost je B.nX.
// Napis na disku kaže le »snov X«, brez lomnega količnika. Napise drugih snovi (»akril, n = …«) in vire z lomnimi
// količniki med nalogo vseeno skrijemo, ker vir ni del maturitetne naloge.
import { kjer, celica, stevilo, razlicne } from "../lab-vodeno-pomoc.js";
import { alfa } from "../vodeno/lab-lom.js";
import { naklon } from "../lab-model-optika.js";

const OD_PLOSKVE = /^Kote si meril od ploskve/, MIMO = /mimo središča/;
const beta = (r) => stevilo(celica(r, /^β/));
// Lom iz zraka v snov X, merjen od vpadne pravokotnice: β < α (kot od ploskve obrne neenakost, taka vrstica ne šteje).
export const lomZrakX = (c) => kjer(c, /^snov/, /zrak → snov X/).filter((r) => beta(r) < alfa(r));
const koti = (c) => lomZrakX(c).map(alfa).filter(Number.isFinite);

export default {
  naslov: "Lomni količnik neznane snovi",
  naloga: "Z laserjem in optičnim diskom določi lomni količnik neznane prozorne snovi X. Na disk postavi polvalj iz snovi X. Svetloba naj gre iz zraka v snov. Izmeri lomni kot pri vsaj šestih različnih vpadnih kotih od 10 ° do 80 °. Kote meri od vpadne pravokotnice, žarek naj gre skozi središče diska. Nariši graf sin β v odvisnosti od sin α in iz naklona premice izračunaj lomni količnik. Oceni napako meritve.",
  kolicina: "n",
  zgled: "1,35",
  dec: 3,
  enote: [["(brez enote)", 1], ["°", null], ["m/s", null]],
  // Skrben dijak (od pravokotnice, brez zamika, 10–80° po 10°, kot na pol stopinje, sinusi na tri decimalke) je pri
  // naklonu premice v 95 % vzorcev do 0,4 % od prave vrednosti, pri povprečju sin α/sin β po točkah do 0,9 %. Znotraj 1 %
  // je pri naklonu 100 %, pri povprečju 98 % vzorcev (test/matura/lab-lom.js: simulacija na 500 vzorcih, n snovi X od
  // 1,42 do 1,62; na 5000 vzorcih 100 % in 97,9 %). Toleranca 1 % velja za obe metodi.
  tol: 0.01,
  resnica: (B) => B.nX,
  // Iz tabele kot v nalogi: naklon premice sin β(sin α) skozi izhodišče je 1/n (koti iz tabele, sinusi točni).
  izMeritev: (c) => {
    const RAD = Math.PI / 180;
    const pts = lomZrakX(c).map((r) => [alfa(r), beta(r)]).filter(([a, b]) => Number.isFinite(a) && Number.isFinite(b) && a > 0).map(([a, b]) => [Math.sin(a * RAD), Math.sin(b * RAD)]);
    return pts.length >= 3 ? 1 / naklon(pts) : NaN;
  },
  meritve: [
    { kaj: "Lomni kot si izmeril pri vsaj šestih različnih vpadnih kotih (iz zraka v snov X)", tock: 1, ok: (c) => razlicne(lomZrakX(c), /^α/, 0).size >= 6 },
    {
      kaj: "Vpadni koti segajo od največ 20 ° do vsaj 70 °",
      tock: 1,
      ok: (c) => {
        const a = koti(c);
        return a.length > 0 && Math.min(...a) <= 20 && Math.max(...a) >= 70;
      },
    },
    { kaj: "Vse kote si meril od vpadne pravokotnice", tock: 1, ok: (c) => koti(c).length > 0 && !c.dnevnik.some((t) => OD_PLOSKVE.test(t)) },
    { kaj: "Laserski žarek je vedno šel skozi središče diska", tock: 1, ok: (c) => koti(c).length > 0 && !c.dnevnik.some((t) => MIMO.test(t)) },
  ],
  // Izračun n pod tabelo (po »Pokaži rešitev«), napis snovi na disku in viri z lomnimi količniki.
  skrij: [".lab-top-calc", ".lab-opt-n", ".lab-opt-viri"],
  // Neznana snov je X: na disk postavi polvalj iz snovi X, svetloba gre iz zraka v snov.
  priprava: (mount) => {
    const sel = [...mount.querySelectorAll("select")].find((s) => s.getAttribute("aria-label") === "snov na disku");
    if (sel && sel.value !== "x") (sel.value = "x"), sel.dispatchEvent(new Event("change"));
    const seg = [...mount.querySelectorAll("[role=radiogroup]")].find((s) => s.getAttribute("aria-label") === "smer svetlobe");
    const b = seg?.querySelector('[data-v="zrak"]');
    if (b && !b.classList.contains("on")) b.click();
  },
};

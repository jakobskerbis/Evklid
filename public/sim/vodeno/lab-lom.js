// Vodeni poskus: optični disk z laserjem, lom svetlobe in popolni odboj (motor lab-optika.js → labLom).
// Tabela: »snov, smer« (npr. »zrak → akril«, »akril → zrak«), »α«, »odbojni«, »β« (kot ali »popolni odboj«), »sin α«, »sin β«.
import { stevilo, celica, kjer, razlicne } from "../lab-vodeno-pomoc.js";
import { preveriRacun } from "../lab.js";
import { naklon } from "../lab-model-optika.js";

const RAD = Math.PI / 180;
export const alfa = (r) => stevilo(celica(r, /^α/));
const beta = (r) => stevilo(celica(r, /^β/));
// Pravilno izmerjen lom (od vpadne pravokotnice): iz zraka v snov je β < α, iz snovi v zrak β > α. Kot od ploskve
// (90° − kot, lab-model-optika.js → odcitaj) obrne neenakost, zato taka vrstica ne šteje.
export const lomZrakAkril = (c) => kjer(c, /^snov/, /zrak → akril/).filter((r) => beta(r) < alfa(r));
const odPravokotnice = (c) => c.par("kot merim od") === "vpadne pravokotnice";

// Lomni količnik kot v motorju (labLom → sync): n = 1/k, k = Σ sin α sin β / Σ sin² α za vrstice »zrak → akril« z
// izmerjenim β. Kote iz tabele vzamemo, ker so točni (α na stopinjo, β na pol stopinje); sinusi so zaokroženi.
export function nAkril(c) {
  const pts = kjer(c, /^snov/, /zrak → akril/).map((r) => [alfa(r), beta(r)]).filter(([a, b]) => Number.isFinite(a) && Number.isFinite(b))
    .map(([a, b]) => [Math.sin(a * RAD), Math.sin(b * RAD)]);
  return pts.length >= 2 ? 1 / naklon(pts) : NaN;
}
// Mejni kot je ujet na 1°: zadnji kot z lomljenim žarkom in prvi s popolnim odbojem (iz akrila v zrak).
export function mejniUjet(c) {
  const v = kjer(c, /^snov/, /akril → zrak/);
  const tir = v.filter((r) => /popolni/.test(celica(r, /^β/))).map(alfa).filter(Number.isFinite);
  if (!tir.length) return false;
  const aT = Math.min(...tir);
  const lom = v.filter((r) => beta(r) > alfa(r) && alfa(r) < aT).map(alfa);
  return lom.length > 0 && aT - Math.max(...lom) <= 1;
}

export default {
  naslov: "Lom svetlobe: kolikšen je lomni količnik akrila?",
  cilj: "Z laserjem in optičnim diskom boš meril vpadni in lomni kot, iz grafa sin β(sin α) določil lomni količnik akrila in poiskal mejni kot popolnega odboja.",
  konec: "Iz svojih meritev si določil lomni količnik akrila in ujel mejni kot popolnega odboja. Preklopi na »Prosto« in izmeri še steklo ali vodo: kateri ima večji lomni količnik in manjši mejni kot?",
  koraki: [
    {
      naslov: "Vklopi laser, a nikoli ne glej v žarek",
      kaj: "Pri »snov na disku« pusti polvalj iz akrila, pri »smer svetlobe« pusti »iz zraka v snov« in vklopi »laser vklopljen«.",
      namig: "Šolski laser je razreda 2. Žarek nikoli ne usmeri v oči, tudi ne prek zrcala ali bleščeče ploskve.",
      zakaj: "Že šibek laserski žarek v očesu se zbere v drobno piko na mrežnici in jo lahko poškoduje. Zato laser vedno usmeriš v disk, ne proti ljudem.",
      poudari: ["snov na disku", "smer svetlobe", "laser vklopljen"],
      done: (c) => /akril/.test(c.par("snov na disku")) && /iz zraka/.test(c.par("smer svetlobe")) && c.par("laser vklopljen") === "da",
    },
    {
      naslov: "Izmeri lomni kot pri 10\u00a0°",
      kaj: "Drsnik »vpadni kot α« nastavi na 10\u00a0°. Na skali odčitaj lomni kot β in pritisni »Zapiši meritev«.",
      namig: "Kote meriš od vpadne pravokotnice (črtkana navpična črta), ne od ploskve. Žarek mora iti skozi središče diska, zato naj bo zamik laserja 0\u00a0mm.",
      zakaj: "Žarek gre skozi središče ravne ploskve, zato zadene okroglo ploskev pravokotno in se tam ne lomi več. Na skali zato odčitaš pravi lomni kot.",
      poudari: ["vpadni kot", "Zapiši meritev"],
      done: (c) => odPravokotnice(c) && lomZrakAkril(c).some((r) => alfa(r) === 10),
    },
    {
      naslov: "Izmeri od 10\u00a0° do 80\u00a0°",
      kaj: "Ponovi pri 20, 30, 40, 50, 60, 70 in 80\u00a0°. Potrebuješ vsaj 6 različnih vpadnih kotov, med njimi vsaj enega od 70\u00a0° naprej.",
      namig: "Če si kdaj meril od ploskve ali z zamaknjenim laserjem, pritisni »Pobriši meritve« in meri znova.",
      zakaj: "Pri prehodu iz zraka v akril je lomni kot manjši od vpadnega, a razlika ni stalna: pri velikih kotih je precej večja. Zato potrebuješ meritve čez vse območje.",
      poudari: ["vpadni kot", "Zapiši meritev"],
      done: (c) => {
        const r = lomZrakAkril(c);
        return odPravokotnice(c) && razlicne(r, /^α/, 0).size >= 6 && Math.max(...r.map(alfa)) >= 70;
      },
    },
    {
      naslov: "Kaj velja pri lomu?",
      kaj: "Poglej tabelo in graf sin β od sin α ter odgovori na vprašanje »Sklep«.",
      namig: "Izračunaj α/β in sin α/sin β pri 10\u00a0° in pri 80\u00a0°. Kateri količnik ostane enak?",
      zakaj: "To je lomni zakon: sin α/sin β je stalen in enak lomnemu količniku n. Svetloba se pri prehodu v optično gostejšo snov lomi k vpadni pravokotnici.",
      pokazi: /Kaj velja, ko svetloba preide/,
      done: (c) => c.sklep(/Kaj velja, ko svetloba preide/),
    },
    {
      naslov: "Izračunaj lomni količnik akrila",
      kaj: "Iz naklona premice na grafu izračunaj lomni količnik akrila, ga vpiši v »tvoj rezultat« in pritisni »Preveri moj račun«.",
      namig: "Naklon premice je sin β/sin α = 1/n. Lomni količnik je zato obratna vrednost naklona.",
      zakaj: "Lomni količnik pove, kolikokrat počasneje potuje svetloba v snovi kot v vakuumu. Za akril je okoli 1,49.",
      poudari: ["tvoj rezultat", "Preveri moj račun"],
      done: (c) => {
        const izbira = c.par("kaj računaš");
        if (izbira && !/zrak → akril/.test(izbira)) return false;
        const nazivno = [1.49, 1.5].map((v) => ({ v, kaj: "vrednost iz učbenika" })); // kot UCBENIK_N.pmma v lab-optika.js
        return c.racun() && !!preveriRacun(c.par("tvoj rezultat"), nAkril(c), { tol: 0.045, nazivno })?.ok; // natančnost (3 %) preveri motor, vodilo računa iz zaokrožene tabele
      },
    },
    {
      naslov: "Obrni smer svetlobe",
      kaj: "Pri »smer svetlobe« izberi »iz snovi v zrak«. Laser zdaj sveti skozi okroglo ploskev v akril in na ravni ploskvi izstopi v zrak.",
      zakaj: "Pri prehodu v optično redkejšo snov se svetloba lomi od vpadne pravokotnice, zato je lomni kot večji od vpadnega.",
      poudari: ["smer svetlobe"],
      done: (c) => /iz snovi/.test(c.par("smer svetlobe")),
    },
    {
      naslov: "Poišči mejni kot popolnega odboja",
      kaj: "Od 38\u00a0° naprej povečuj vpadni kot po 1\u00a0° in vsakič zapiši meritev, dokler lomljeni žarek ne izgine. Zapisana morata biti zadnji kot z lomljenim žarkom in prvi brez njega.",
      namig: "Opazuj lomljeni žarek: tik pred mejnim kotom se skoraj prilepi na ploskev in postane šibek, odbiti pa močnejši.",
      zakaj: "Pri mejnem kotu je lomni kot 90\u00a0°, zato je sinus mejnega kota enak 1/n. Pri večjih kotih se vsa svetloba odbije nazaj v akril. Tako deluje optično vlakno.",
      poudari: ["vpadni kot", "Zapiši meritev"],
      done: (c) => odPravokotnice(c) && mejniUjet(c),
    },
  ],
};

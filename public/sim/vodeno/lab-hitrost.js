// Vodeni poskus »Hitrost kemijske reakcije« za srednjo šolo (lab-reakcije.js → labHitrost brez ravni »os«; docs/laboratorij.md
// »Vodeni poskus«, faza 2). Sledi nalogi »Poskusi«: marmor v 0,5, 1 in 2 mol/L HCl (začetna hitrost, red reakcije), nato
// tiosulfat pri petih koncentracijah in dveh temperaturah, na koncu »Sklep«.
// Meritev šteje le, če je bila res izvedena prav, kar pove dnevnik motorja:
// - marmor: »Na tehtnici je bučka s 40 mL HCl (c mol/L[, segreta …])« in »Dodal si m g marmorja (oblika)[ in vrat zamašil
//   z vato]« začneta poskus; »Štoparica še ne teče!« tik pred dodatkom pomeni, da štoparica ni tekla od dodatka. Oblika in
//   štoparica se tako berejo ob dodatku, ne iz trenutnih nastavitev. »Štoparico si zagnal … po začetku reakcije« (pozen
//   zagon) in »Pena je šla čez rob« pokvarita zadnji poskus z marmorjem, a le dokler ni začet poskus z drugo snovjo.
//   Vrstice tabele imajo stolpec »poskus« (zaporedna številka od zadnjega »Izbriši meritve«, ki ga dnevnik ne zapiše),
//   zato poskuse iz dnevnika povežemo s tabelo od zadnjega nazaj. Začetna hitrost (graf r₀) potrebuje meritev pri 5–65 s.
// - tiosulfat: »V bučki je V mL raztopine tiosulfata …[, segreto …]«, »Prilil si 5 mL HCl …«, »Križ je izginil po t s«;
//   »Križ je še precej viden« (prezgodaj ustavljeno) ali »Raztopina je že povsem motna« (prepozno) meritev pokvarita.
import { stevilo, celica } from "../lab-vodeno-pomoc.js";

const KISLINA = /Na tehtnici je bučka s 40 mL HCl \(([\d,]+) mol\/L(, segreta)?/;
const MARMOR = /Dodal si ([\d,]+) g marmorja(?: \(([^)]+)\))?( in vrat zamašil z vato)?/;
const BREZ_URE = /^Štoparica še ne teče!/;
const DRUGA_SNOV = /^Spustil si .* traku|^Dodal si katalizator|^V bučki je \d+ mL raztopine tiosulfata|^Prilil si 5 mL HCl/;
const POKVARJEN = /Štoparico si zagnal .* po začetku reakcije|Pena je šla čez rob bučke/;
const PRIPRAVA = /V bučki je (\d+) mL raztopine tiosulfata in \d+ mL vode(, segreto)?/;
const PRILIL = /Prilil si 5 mL HCl in zagnal štoparico/;
const NAROBE = /Križ je še precej viden|Raztopina je že povsem motna/;
const IZGINIL = /Križ je izginil po ([\d,]+) s/;

// Poskusi z marmorjem iz dnevnika, povezani z vrsticami tabele: { c, toplo, m, oblika, vata, ura, ok, r0 }.
export function marmorji(c) {
  const runs = [];
  let kis = null, brezUre = false, aktiven = false;
  for (const t of c.dnevnik) {
    let m;
    if ((m = t.match(KISLINA))) (kis = { c: stevilo(m[1]), toplo: !!m[2] }), (brezUre = false), (aktiven = false);
    else if (BREZ_URE.test(t)) brezUre = true;
    else if ((m = t.match(MARMOR)) && kis) {
      runs.push({ ...kis, m: stevilo(m[1]), oblika: m[2] || "", vata: !!m[3], ura: !brezUre, ok: true, r0: false });
      (brezUre = false), (aktiven = true);
    } else if (DRUGA_SNOV.test(t)) (brezUre = false), (aktiven = false);
    else if (POKVARJEN.test(t) && aktiven) runs.at(-1).ok = false;
  }
  if (!/^marmor/.test(c.par("poskus"))) return runs; // tabela marmorja je skrita
  const p = (r) => stevilo(celica(r, /^poskus/));
  const zadnji = Math.max(0, ...c.vrstice.map(p).filter(Number.isFinite));
  const od = runs.length - zadnji; // poskusi pred zadnjim »Izbriši meritve« niso več v tabeli
  runs.forEach((run, i) => {
    run.r0 = i >= od && c.vrstice.some((r) => {
      const t = stevilo(celica(r, /^t\b/));
      return p(r) === i - od + 1 && t > 5 && t <= 65 && stevilo(celica(r, /^Δm/)) > 0;
    });
  });
  return runs;
}
// Primerljiv poskus: srednji koščki 5 g z vato pri sobni temperaturi, štoparica od dodatka, brez prelite pene.
const primerljiv = (r) => r.ok && r.ura && r.vata && !r.toplo && /^srednji/.test(r.oblika) && Math.abs(r.m - 5) < 0.1;

// Meritve tiosulfata iz dnevnika, povezane z vrsticami tabele: { V, toplo, slabo, t, T }.
export function tiosulfat(c) {
  const mer = [];
  let prip = null, cur = null;
  for (const t of c.dnevnik) {
    let m;
    if ((m = t.match(PRIPRAVA))) (prip = { V: Number(m[1]), toplo: !!m[2] }), (cur = null);
    else if (PRILIL.test(t) && prip) cur = { ...prip, slabo: false };
    else if (NAROBE.test(t) && cur) cur.slabo = true;
    else if ((m = t.match(IZGINIL)) && cur) mer.push({ ...cur, t: stevilo(m[1]), T: NaN }), (cur = null);
  }
  if (!/^tiosulfat/.test(c.par("poskus"))) return [];
  // Vrstica in meritev se ujemata od zadnje nazaj (»Izbriši meritve« izprazni le tabelo) in imata isti čas.
  const out = [];
  for (let j = 1; j <= Math.min(mer.length, c.vrstice.length); j++) {
    const me = mer[mer.length - j], r = c.vrstice[c.vrstice.length - j];
    if (stevilo(celica(r, /^t\b/)) === me.t) out.push({ ...me, T: stevilo(celica(r, /^T\b/)) });
  }
  return out;
}
const dobre = (c) => tiosulfat(c).filter((x) => !x.slabo);

export default {
  naslov: "Hitrost reakcije: koncentracija in temperatura",
  cilj: "Izmeril boš, kako hitro marmor izgublja maso v kislini različnih koncentracij in kako hitro tiosulfat skali raztopino pri različnih koncentracijah in temperaturah. Iz meritev boš določil red reakcije.",
  konec: "Pokazal si, da je hitrost obeh reakcij sorazmerna s koncentracijo, hitrost reakcije tiosulfata pa se pri 10\u00a0°C višji temperaturi približno podvoji. Preklopi na »Prosto« in primerjaj marmor v koščkih in v prahu ali razkroj vodikovega peroksida z različnimi katalizatorji.",
  koraki: [
    {
      naslov: "Nadeni si zaščitna očala",
      kaj: "Vklopi stikalo »zaščitna očala«.",
      zakaj: "Klorovodikova kislina draži kožo in oči. Pri tiosulfatu nastaja dražljiv SO₂, zato delaš v dobro prezračenem prostoru.",
      poudari: ["zaščitna očala"],
      done: (c) => c.par("zaščitna očala") === "da",
    },
    {
      naslov: "Marmor v 0,5\u00a0mol/L kislini",
      kaj: "Pri »klorovodikova kislina (40 mL)« izberi 0,5\u00a0mol/L in pritisni »Nalij 40 mL kisline v bučko na tehtnici«. Srednje koščke marmorja (5\u00a0g), vato in hkratni zagon štoparice pusti in pritisni »Dodaj marmor (in vato)«.",
      namig: "Vata v vratu bučke spusti CO₂ ven, zadrži pa kapljice kisline, ki bi jih razpršili mehurčki.",
      zakaj: "CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂. Plin uhaja iz bučke, zato se masa na tehtnici manjša. Štoparica teče od dodatka marmorja.",
      poudari: ["klorovodikova kislina (40", "Nalij 40 mL", "Dodaj marmor"],
      // Najnovejši poskus: 0,5 mol/L, srednji koščki 5 g z vato, štoparica zagnana ob dodatku (nastavitve ob dodatku).
      done: (c) => {
        const r = marmorji(c).at(-1);
        return !!r && r.c === 0.5 && primerljiv(r);
      },
    },
    {
      naslov: "Počakaj na meritev pri 30\u00a0s",
      kaj: "Tabela vsakih 30\u00a0s sama zapiše maso. Počakaj na meritev pri 30\u00a0s.",
      namig: "Pri »hitrost časa« izberi ×5 ali ×20, da ne čakaš predolgo. Če se nič ne zapiše, pri »zapisuj samodejno« izberi »vsakih 30 s«.",
      zakaj: "Iz izgube mase v prvih 30\u00a0s dobiš začetno hitrost: r₀ = Δm/t. Na začetku je kisline največ, zato reakcija tedaj teče najhitreje.",
      poudari: ["hitrost časa"],
      done: (c) => marmorji(c).some((r) => r.c === 0.5 && primerljiv(r) && r.r0),
    },
    {
      naslov: "Ponovi z 1 in 2\u00a0mol/L kislino",
      kaj: "Izberi 1\u00a0mol/L, nalij svežo kislino in dodaj enak marmor (srednji koščki, 5\u00a0g). Počakaj na meritev pri 30\u00a0s. Nato enako ponovi z 2\u00a0mol/L.",
      namig: "Vse drugo mora ostati enako: oblika in masa marmorja, vata in temperatura. Spreminjaš le koncentracijo kisline.",
      zakaj: "Ker je bilo vse drugo enako, razlika v hitrosti kaže samo vpliv koncentracije kisline.",
      poudari: ["klorovodikova kislina (40", "Nalij 40 mL", "Dodaj marmor"],
      done: (c) => {
        const cs = new Set(marmorji(c).filter((r) => primerljiv(r) && r.r0).map((r) => r.c));
        return [0.5, 1, 2].every((x) => cs.has(x));
      },
    },
    {
      naslov: "Iz začetnih hitrosti določi red reakcije",
      kaj: "Pri »prikaži« izberi »začetna hitrost«. Poglej graf r₀ v odvisnosti od c(HCl) in račun pod njim.",
      namig: "Če se pri dvakrat večji koncentraciji tudi začetna hitrost poveča dvakrat, je reakcija 1. reda glede na kislino.",
      zakaj: "Točke ležijo približno na premici skozi izhodišče: začetna hitrost je sorazmerna s c(HCl). Reakcija je 1. reda glede na klorovodikovo kislino.",
      poudari: ["prikaži"],
      done: (c) => /^marmor/.test(c.par("poskus")) && c.par("prikaži") === "začetna hitrost",
    },
    {
      naslov: "Tiosulfat: kdaj križ izgine?",
      kaj: "Pri »poskus« izberi »tiosulfat (križ)«. Pusti 50\u00a0mL raztopine brez vode in pritisni »Pripravi 50 mL v bučki na listu s križem«, nato »Prilij 5 mL HCl (2 mol/L) in zaženi štoparico«. Glej pogled od zgoraj. Ko križa ne vidiš več, pritisni »Križa ne vidim več«.",
      namig: "Ne ustavi, ko križ le zbledi, ker je tak čas prekratek. Ne čakaj pa, da je raztopina povsem motna.",
      zakaj: "Na₂S₂O₃ + 2HCl → 2NaCl + S + SO₂ + H₂O. Drobni delci žvepla skalijo raztopino. Križ izgine vedno pri enaki množini žvepla, zato je 1/t merilo hitrosti.",
      poudari: ["poskus", "Pripravi 50 mL", "Prilij 5 mL", "Križa ne vidim"],
      done: (c) => dobre(c).some((x) => x.V === 50 && !x.toplo),
    },
    {
      naslov: "Izmeri pri petih koncentracijah",
      kaj: "Ponovi s 40, 30, 20 in 10\u00a0mL raztopine tiosulfata (z vodo do 50\u00a0mL). Vodna kopel naj ostane pri sobni temperaturi.",
      namig: "Pri manj raztopine traja dlje. Pri »hitrost časa« lahko izbereš ×5.",
      zakaj: "Na grafu 1/t ležijo točke na premici skozi izhodišče: hitrost je sorazmerna s koncentracijo tiosulfata. Reakcija je 1. reda glede na tiosulfat.",
      poudari: ["raztopina Na₂S₂O₃", "Pripravi 50 mL", "Prilij 5 mL", "Križa ne vidim"],
      done: (c) => new Set(dobre(c).filter((x) => !x.toplo).map((x) => x.V)).size >= 5,
    },
    {
      naslov: "Ponovi v topli vodni kopeli",
      kaj: "Z drsnikom »vodna kopel« jo segrej za približno 10\u00a0°C nad sobno temperaturo (npr. na 30\u00a0°C). Nato ponovi meritev pri eni od koncentracij, ki si jih že izmeril.",
      namig: "Sobno temperaturo kaže termometer. Raztopino pripravi šele, ko je kopel topla. Graf pokažeš pri »prikaži« z izbiro »1/t od T«.",
      zakaj: "Pri višji temperaturi se delci gibljejo hitreje in več trkov ima dovolj energije za reakcijo. Pri 10\u00a0°C višji temperaturi je hitrost približno dvakrat večja.",
      poudari: ["vodna kopel", "Pripravi 50 mL", "Prilij 5 mL", "Križa ne vidim"],
      // Ista koncentracija pri dveh temperaturah, ki se razlikujeta vsaj za 5 °C (kot račun pod grafom 1/t od T).
      done: (c) => {
        const d = dobre(c);
        return d.some((a) => d.some((b) => a.V === b.V && b.T - a.T >= 5));
      },
    },
    {
      naslov: "Odgovori na vprašanje »Sklep«",
      kaj: "Pod grafom je vprašanje »Sklep«. Izberi odgovor, ki se ujema s tvojimi meritvami.",
      namig: "Kako se je spremenil čas, ko si raztopino razredčil? Ali višja temperatura spremeni tudi končno množino produkta?",
      zakaj: "Hitrost je odvisna od števila uspešnih trkov. Koncentracija, temperatura, površina in katalizator spremenijo hitrost reakcije, ne pa končne množine produkta.",
      pokazi: /o hitrosti (kemijske )?reakcije/,
      done: (c) => c.sklep(/o hitrosti (kemijske )?reakcije/),
    },
  ],
};

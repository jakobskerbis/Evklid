// Maturitetni poskus: težni pospešek s prostim padom jeklene kroglice (motor lab-gibanje.js → labProstiPad; okvir lab-matura.js).
// Model nima naključne količine, ki bi jo dijak meril namesto g: seme spremeni le merilne okoliščine (zamik elektromagneta
// 5 ± 1,5 ms, zamik vrat iz navpičnice 2–6 mm, napaka postavitve vrat, gostota zraka). Zato je neznanka težni pospešek
// modela (G_LJ = 9,806 m/s², Ljubljana; vzgon in upor zraka sta pri jekleni kroglici pod 0,1 %). Prava vrednost je vedno
// ista: točke za rezultat dobi le, kdor res meri (izMeritev: g iz njegove tabele), ne kdor vpiše 9,81 m/s² brez meritev.
import { G_LJ, naklonSkoziIzhodisce } from "../lab-model-gibanje.js";
import { stevilo, celica, kjer, razlicne } from "../lab-vodeno-pomoc.js";

const kroglica = (c) => kjer(c, /^predmet/, /kroglica/).filter((r) => Number.isFinite(stevilo(celica(r, /^t\b/))));
const visina = (r) => stevilo(celica(r, /^h\b/));
// Koliko meritev je pri vsaki višini (višina na 1 cm, kot v tabeli).
function poVisinah(rows) {
  const m = new Map();
  for (const r of rows) if (Number.isFinite(visina(r))) m.set(visina(r).toFixed(2), (m.get(visina(r).toFixed(2)) || 0) + 1);
  return m;
}
// Žarek skozi sredino kroglice: pri prostem padu iz mirovanja je hitrost ob vratih v = 2h/t. Če žarek kroglico le oplazi,
// zastre krajšo tetivo, zato je v = D/Δt prevelik (pri zamiku 2 mm za ~3 %, pri 3 mm za ~7 %). Pri nizkih vratih je
// razmerje večje že zaradi zamika spusta, zato štejejo le višine od 0,5 m. Povprečje razmerij v·t/(2h) je pri
// naravnanih vratih 0,98–1,01 (test/laboratorij-matura.test.js), meja 1,03.
export const SREDINA = 1.03;
export function razmerjeHitrosti(rows) {
  const q = rows
    .map((r) => [visina(r), stevilo(celica(r, /^t\b/)), stevilo(celica(r, /^v\b/))])
    .filter(([h, t, v]) => h >= 0.5 && t > 0 && v > 0)
    .map(([h, t, v]) => (v * t) / (2 * h));
  return q.length >= 2 ? q.reduce((a, b) => a + b, 0) / q.length : NaN;
}

export default {
  naslov: "Težni pospešek s prostim padom",
  naloga: "Določi težni pospešek g. Jekleno kroglico spuščaj z elektromagnetom. Najprej naravnaj vrata, da gre žarek skozi sredino kroglice (pomagaj si s povečavo od zgoraj). Izmeri čas padca pri vsaj petih različnih višinah, od največ 0,5 m do vsaj 1,5 m. Pri vsaj treh višinah meritev ponovi in vzemi povprečje. Nariši graf h(t²) in iz naklona premice izračunaj g. Oceni napako meritve.",
  kolicina: "g",
  zgled: "9,72",
  zgledNap: "0,15",
  dec: 3,
  enote: [["m/s²", 1], ["cm/s²", 0.01], ["m/s", null], ["N", null]],
  // Skrben dijak (naravnana vrata, 5 višin od 0,2 do 2,0 m, vsaka dvakrat, povprečje, premica h(t²) skozi izhodišče) dobi
  // ~2 % premajhen g, ker časovnik začne teči ob izklopu magneta, kroglica pa se odlepi ~5 ms pozneje. Simulacija na 500
  // vzorcih (test/laboratorij-matura.test.js): največ ~2,5 % od prave vrednosti.
  tol: 0.025,
  resnica: () => G_LJ,
  // Iz tabele po navodilu naloge: pri vsaki višini povprečni čas kroglice, premica h(t²) skozi izhodišče (vsaj tri višine),
  // g = 2 · naklon. Vrednost 9,81 m/s² brez meritev ne prinese točk.
  izMeritev: (c) => {
    const po = new Map();
    for (const r of kroglica(c)) if (Number.isFinite(visina(r))) {
      const k = visina(r).toFixed(2);
      po.set(k, [...(po.get(k) || []), stevilo(celica(r, /^t\b/))]);
    }
    const pts = [...po].map(([h, t]) => [(t.reduce((a, b) => a + b, 0) / t.length) ** 2, Number(h)]);
    return pts.length >= 3 ? 2 * naklonSkoziIzhodisce(pts) : NaN;
  },
  meritve: [
    { kaj: "Kroglico si spustil z vsaj petih različnih višin", tock: 1, ok: (c) => razlicne(kroglica(c), /^h\b/, 2).size >= 5 },
    {
      kaj: "Višine segajo od največ 0,5 m do vsaj 1,5 m",
      tock: 1,
      ok: (c) => {
        const h = kroglica(c).map(visina).filter(Number.isFinite);
        return h.length >= 2 && Math.min(...h) <= 0.5 && Math.max(...h) >= 1.5;
      },
    },
    { kaj: "Pri vsaj treh višinah si meritev ponovil", tock: 1, ok: (c) => [...poVisinah(kroglica(c)).values()].filter((n) => n >= 2).length >= 3 },
    { kaj: "Vrata si naravnal: žarek gre skozi sredino kroglice (v = D/Δt se ujema z 2h/t)", tock: 1, ok: (c) => razmerjeHitrosti(kroglica(c)) <= SREDINA },
  ],
  // Račun pod grafom pokaže 2k (g iz naklona), ko je račun razkrit.
  skrij: [".lab-gib-calc"],
};

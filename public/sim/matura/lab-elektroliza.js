// Maturitetni poskus: Faradayeva konstanta z elektrolizo vode v Hofmannovem aparatu (motor lab-elektrokemija.js →
// labElektroliza; okvir lab-matura.js). Učenec zapisuje čas, tok in prostornino vodika na katodi, odčita zračni tlak in
// temperaturo ter izračuna F = I · t / (2 n(H₂)), n(H₂) = (p − p(H₂O)) · V / (R · T).
// Prava vrednost je konstanta modela F = 96 485 C/mol (lab-model-elektrokemija.js, CODATA 2018), zato je pri vsaki nalogi
// enaka. Novo seme spremeni zračni tlak, sobno temperaturo, umeritev ampermetra in skale cevi.
// Model upošteva tudi, česar dijak ne: vodik, ki se na začetku raztopi ob elektrodi, in višji tlak plina zaradi višje
// gladine v bučki. Zato je F skrbnega dijaka ~3–4 % prevelik; toleranca to upošteva.
import { F } from "../lab-model-elektrokemija.js";
import { R_PLIN } from "../lab-model.js";
import { polnilo, zrakIzpuscen, poPolnilu, meritve } from "../vodeno/lab-elektroliza.js";

// Najmanj plina na katodi (mL), da je relativna napaka odčitka majhna.
export const V_MIN = 20;
const VAROVALKA = /Varovalka v ampermetru je pregorela/;
// Zračnega tlaka in temperature tekočine ni v tabeli, dnevniku ali nastavitvah (le na barometru in termometru, ki ju
// kontekst vodenja ne bere), zato izMeritev vzame srednji vrednosti laboratorija (lab-model-elektrokemija.js →
// laboratorij: 98,0 ± 1,8 kPa, 22 ± 2 °C) in parni tlak pri 22 °C iz naloge. To spremeni F za največ ~4 %, kar je v
// dovoljeni razliki 2·tol (9 %).
export const PT_LAB = { p: 98000, T: 22, pw: 2640 };

export default {
  naslov: "Faradayeva konstanta z elektrolizo vode",
  naloga: `Hofmannov aparat napolni z razredčeno žveplovo(VI) kislino, tako da v ceveh ne ostane zrak, in pipi zapri. Vklopi napajalnik in štoparico. Med elektrolizo zapisuj čas, tok in prostornino plina na katodi, dokler se na katodi ne nabere vsaj ${V_MIN} mL vodika. Odčitaj zračni tlak in temperaturo tekočine. Vodik je nasičen z vodno paro. Parni tlak vode je 2,33 kPa pri 20 °C, 2,64 kPa pri 22 °C, 2,97 kPa pri 24 °C, 3,35 kPa pri 26 °C in 3,77 kPa pri 28 °C. Na koncu dokaži oba plina. Izračunaj Faradayevo konstanto in oceni napako meritve.`,
  kolicina: "F",
  zgled: "98500",
  dec: 0,
  enote: [["C/mol", 1], ["kC/mol", 1000], ["C", null], ["mol/C", null]],
  // Skrben dijak (5–8 V, vsaj 20 mL vodika, povprečni tok, tlak in temperatura z merilnikov, parni tlak iz tabele) je
  // 3–4,5 % nad pravo vrednostjo (test/laboratorij-matura.test.js: simulacija na 500 vzorcih).
  tol: 0.045,
  resnica: (B) => (B ? F : NaN),
  // Iz tabele: povprečni tok vseh meritev, čas in prostornina vodika v zadnji vrstici; n(H₂) = (p − p(H₂O)) · V / (R · T),
  // F = I · t / (2 n). Tlak in temperatura: PT_LAB.
  izMeritev: (c) => {
    const v = meritve(c), z = v.at(-1);
    if (!z || !(z.t > 0) || !(z.Vk > 0)) return NaN;
    const I = v.reduce((a, r) => a + r.I, 0) / v.length / 1000;
    const n = ((PT_LAB.p - PT_LAB.pw) * z.Vk * 1e-6) / (R_PLIN * (PT_LAB.T + 273.15));
    return (I * z.t) / (2 * n);
  },
  meritve: [
    {
      kaj: "Aparat si napolnil z žveplovo(VI) kislino brez ujetega zraka in pipi zaprl",
      tock: 1,
      ok: (c) => {
        const p = polnilo(c.dnevnik);
        return !!p && /žveplova/.test(p.t) && zrakIzpuscen(c.dnevnik, p) && c.par("pipa levo odprta") === "ne" && c.par("pipa desno odprta") === "ne";
      },
    },
    {
      kaj: "Zapisal si vsaj tri meritve časa, toka in prostornine, varovalka ni pregorela",
      tock: 1,
      ok: (c) => new Set(meritve(c).map((r) => r.t)).size >= 3 && !c.dnevnik.some((t) => VAROVALKA.test(t)),
    },
    {
      kaj: `Na katodi si zbral vsaj ${V_MIN} mL vodika`,
      tock: 1,
      ok: (c) => (meritve(c).at(-1)?.Vk ?? 0) >= V_MIN,
    },
    {
      kaj: "Vodik si dokazal z gorečo trsko, kisik s tlečo trsko",
      tock: 1,
      ok: (c) => poPolnilu(c, /v cevi je vodik/) && poPolnilu(c, /Tleča trska se znova vžge/),
    },
  ],
  // Pod grafom sta izračunana množina vodika in Faradayeva konstanta iz učenčevih meritev ob literaturni vrednosti.
  skrij: [".lab-ek-calc"],
};

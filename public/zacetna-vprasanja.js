// Začetna vprašanja na praznem pogovoru Inštruktorja (j, 16. 11. 2026, zunanji pregledi posnetkov: prej vedno
// »2x + 3 = 11«, Pitagorov izrek in gostota, tudi v 4. letniku VR in pri fiziki).
//
// Tri vprašanja za predmet v glavi Inštruktorja ter razred ali letnik (in raven matematike) profila. Vsako je iz
// teme učnega načrta tega razreda (server/curriculum-data.js, ime teme v STARTERS; test/zacetna-vprasanja.test.js
// preveri, da tema v poti res je). 1.–5. razred OŠ v aplikaciji nima učne poti: vprašanja so iz učnega načrta
// za matematiko (ZRSŠ 2011, 1. in 2. vzgojno-izobraževalno obdobje). Besedila so v i18n (start.<pot>.<n>).
// Drug šolski sistem: razred po letu šolanja (1.–9. → OŠ, 10.–13. → SŠ 1.–4.); fakulteta: splošna vprašanja
// predmeta; drugi predmeti fakultete: stara splošna vprašanja (chat.idea1–3).
import { jeFaks, jeSs } from "./stopnja.js";
import { isRegional, gradeInfo } from "./regions.js";

// Pot → imena tem (za preverjanje; "" = brez učne poti v aplikaciji, glej zgoraj). Vrstni red = start.<pot>.1–3.
export const STARTERS = {
  "MAT-OS-1": ["", "", ""],
  "MAT-OS-2": ["", "", ""],
  "MAT-OS-3": ["", "", ""],
  "MAT-OS-4": ["", "", ""],
  "MAT-OS-5": ["", "", ""],
  "MAT-OS-6": ["Deljivost", "Računanje z decimalnimi števili", "Obseg in ploščina pravokotnika in kvadrata"],
  "MAT-OS-7": ["Seštevanje in odštevanje ulomkov", "Odstotni račun", "Vrste trikotnikov in notranji koti"],
  "MAT-OS-8": ["Linearne enačbe", "Pitagorov izrek", "Obseg in ploščina kroga"],
  "MAT-OS-9": ["Graf linearne funkcije", "Valj", "Verjetnost"],
  "NAR-OS-6": ["Ločevanje zmesi", "Fotosinteza in celično dihanje", "Agregatna stanja"],
  "NAR-OS-7": ["Kisle in bazične raztopine", "Prehranjevalne verige in spleti", "Dihanje in krvni obtok"],
  "FIZ-OS-8": ["Gostota", "Enakomerno gibanje", "Lom svetlobe"],
  "FIZ-OS-9": ["Upor in Ohmov zakon", "Kinetična in potencialna energija", "Newtonovi zakoni"],
  "KEM-OS-8": ["Urejanje kemijskih enačb", "Periodni sistem", "pH lestvica"],
  "KEM-OS-9": ["Računanje z množino snovi", "Alkani, alkeni, alkini", "Alkoholi"],
  "BIO-OS-8": ["Celični organeli", "Kri in krvožilje", "Prebavila in prehrana"],
  "BIO-OS-9": ["Dedovanje lastnosti", "Naravni izbor", "Ekosistemi in biomi"],
  "MAT-SS-1": ["Razstavljanje izrazov", "Sistemi linearnih enačb", "Množice"],
  "MAT-SS-2": ["Kvadratna enačba", "Logaritem", "Kotne funkcije v pravokotnem trikotniku"],
  "MAT-SS-3": ["Trigonometrijske enačbe", "Skalarni produkt", "Krožnica"],
  "MAT-SS-4": ["Odvod", "Določeni integral", "Aritmetično in geometrijsko zaporedje"],
  "FIZ-SS-1": ["Prosti pad in navpični met", "Newtonovi zakoni", "Gibalna količina"],
  "FIZ-SS-2": ["Plinska enačba", "Električni naboj in Coulombov zakon", "Električna vezja"],
  "FIZ-SS-3": ["Nihanje", "Indukcija", "Geometrijska optika"],
  "FIZ-SS-4": ["Fotoefekt in foton", "Jedro in radioaktivnost", "Zvezde in vesolje"],
  "KEM-SS-1": ["Stehiometrija", "Kemijske vezi", "Raztopine"],
  "KEM-SS-2": ["Kemijsko ravnotežje", "pH", "Oksidacijska števila"],
  "KEM-SS-3": ["Izomerija", "Karboksilne kisline in derivati", "Organske reakcije"],
  "KEM-SS-4": ["Kemijsko računanje", "Organska kemija", "Splošna in anorganska kemija"],
  "BIO-SS-1": ["Mendlovo dedovanje", "Celično dihanje in vrenje", "Celični cikel in mitoza"],
  "BIO-SS-2": ["Mehanizmi evolucije", "Prehrana in transport pri rastlinah", "Dihanje"],
  "BIO-SS-3": ["Živčna celica in sinapsa", "Imunski sistem", "Populacije"],
  "BIO-SS-4": ["Molekularna genetika", "Homeostaza", "Populacijska genetika"],
};
// Višja raven matematike v 4. letniku: tretje vprašanje je matematična indukcija (samo VR), prvi dve kot OR.
export const VR_EXTRA = { "MAT-SS-4": ["MAT-SS-4.1", "MAT-SS-4.2", "MAT-SS-4-VR.3"] };
export const VR_TOPICS = { "MAT-SS-4-VR.3": "Matematična indukcija" };
export const UNI = ["MAT", "FIZ", "KEM", "BIO"];
export const FALLBACK = ["chat.idea1", "chat.idea2", "chat.idea3"];

const num = (level) => Number(/(\d+)/.exec(String(level || ""))?.[1]) || 0;

// Šola in razred profila: { school: "OS"|"SS"|"UNI", grade, vr }.
function where(s) {
  if (isRegional(s.school_system)) {
    const y = gradeInfo(s.school_system, s.curriculum_level)?.level || 8;
    return y <= 9 ? { school: "OS", grade: Math.max(1, y) } : { school: "SS", grade: Math.min(4, y - 9) };
  }
  if (jeFaks(s)) return { school: "UNI", grade: num(s.curriculum_level) };
  if (jeSs(s)) return { school: "SS", grade: Math.min(4, Math.max(1, num(s.curriculum_level) || 1)), vr: / VR\b/.test(s.curriculum_level || "") };
  return { school: "OS", grade: Math.min(9, Math.max(1, num(s.curriculum_level) || 8)) };
}

/** Ključi i18n treh začetnih vprašanj za nastavitve profila in predmet v glavi Inštruktorja. */
export function starterKeys(settings = {}, subject = settings.subject || "MAT") {
  const w = where(settings);
  if (w.school === "UNI") return UNI.includes(subject) ? [1, 2, 3].map((n) => `start.${subject}-UNI.${n}`) : FALLBACK;
  // Predmet, ki ga ta razred v aplikaciji nima: OŠ 1.–5. samo matematika; naravoslovje 6.–7. (NAR); v 8.–9. NAR → FIZ.
  let subj = subject;
  if (w.school === "OS" && w.grade <= 5) subj = "MAT";
  else if (w.school === "OS" && w.grade <= 7 && subj !== "MAT") subj = "NAR";
  else if (subj === "NAR") subj = w.school === "OS" ? "FIZ" : "BIO";
  const key = `${subj}-${w.school}-${w.grade}`;
  if (!STARTERS[key]) return FALLBACK;
  if (w.vr && VR_EXTRA[key]) return VR_EXTRA[key].map((k) => `start.${k}`);
  return [1, 2, 3].map((n) => `start.${key}.${n}`);
}

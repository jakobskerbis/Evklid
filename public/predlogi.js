// Predlogi vprašanj v praznem klepetu (j, 17. 11. 2026): po profilu in vsakič drugačni.
// Teme z učne poti učenčevega razreda/letnika in predmeta: naslednja in nekaj neosvojenih za njo, za ponavljanje
// nekaj osvojenih. Vsak predlog ima drugo temo in drugo vrsto vprašanja (razlaga, naloga, rešen primer, kratko
// preverjanje, pogoste napake, ponavljanje). Maturant (4. letnik MAT/FIZ/KEM/BIO) pogosto dobi nalogo v slogu mature
// (pri MAT z ravnijo), 6. in 9. razred pri MAT v slogu NPZ. Brez učne poti ostanejo splošni predlogi.
import { jeOs, jeSs, jeFaks } from "./stopnja.js";
import { isRegional, gradeInfo } from "./regions.js";

const NEW = ["chat.ideaExplain", "chat.ideaTask", "chat.ideaExample", "chat.ideaQuiz", "chat.ideaMistakes"];
const OLD = ["chat.ideaRepeat", "chat.ideaTask", "chat.ideaQuiz"];
const NEAR = 6; // koliko neosvojenih tem od naslednje naprej pride v poštev
const EXAM_SHARE = 0.6; // kako pogosto je med predlogi naloga v slogu mature/NPZ
const CONCRETE_SHARE = 0.5; // kako pogosto je med predlogi konkretno vprašanje razreda (CONCRETE)

// Konkretna vprašanja po razredu/letniku in predmetu (#792, pregledana): ključi start.<pot>.<n>, vsako iz teme učnega
// načrta tega razreda (server/curriculum-data.js; test/predlogi-konkretni.test.js preveri teme). 1.–5. razred OŠ v
// aplikaciji nima učne poti: vprašanja po učnem načrtu za matematiko (ZRSŠ 2011). Fakulteta: splošna vprašanja predmeta.
// Dodatni kandidati k predlogom iz učne poti; brez poti (1.–5. razred, fakulteta, drug sistem brez poti) so edini.
export const CONCRETE = {
  "MAT-OS-1": [], "MAT-OS-2": [], "MAT-OS-3": [], "MAT-OS-4": [], "MAT-OS-5": [],
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
// Višja raven matematike v 4. letniku: tretje vprašanje je matematična indukcija (samo VR).
const VR_KEYS = { "MAT-SS-4": ["start.MAT-SS-4.1", "start.MAT-SS-4.2", "start.MAT-SS-4-VR.3"] };
export const UNI_SUBJECTS = ["MAT", "FIZ", "KEM", "BIO"];
const num = (level) => Number(/(\d+)/.exec(String(level || ""))?.[1]) || 0;

/** Ključi i18n konkretnih vprašanj za profil (predmet iz nastavitev) ali []. */
export function concreteKeys(s = {}) {
  if (!s.curriculum_level) return []; // brez razreda: splošni predlogi
  const subject = s.subject || "MAT";
  let school, grade, vr = false;
  if (isRegional(s.school_system)) {
    const y = gradeInfo(s.school_system, s.curriculum_level)?.level || 8;
    [school, grade] = y <= 9 ? ["OS", Math.max(1, y)] : ["SS", Math.min(4, y - 9)];
  } else if (jeFaks(s)) {
    return UNI_SUBJECTS.includes(subject) ? [1, 2, 3].map((n) => `start.${subject}-UNI.${n}`) : [];
  } else if (jeSs(s)) {
    [school, grade, vr] = ["SS", Math.min(4, Math.max(1, num(s.curriculum_level) || 1)), / VR$/.test(s.curriculum_level || "")];
  } else [school, grade] = ["OS", Math.min(9, Math.max(1, num(s.curriculum_level) || 8))];
  // Predmet, ki ga ta razred v aplikaciji nima: OŠ 1.–5. samo matematika, 6.–7. naravoslovje, NAR pozneje → FIZ/BIO.
  let subj = subject;
  if (school === "OS" && grade <= 5) subj = "MAT";
  else if (school === "OS" && grade <= 7 && subj !== "MAT") subj = "NAR";
  else if (subj === "NAR") subj = school === "OS" ? "FIZ" : "BIO";
  const key = `${subj}-${school}-${grade}`;
  if (!CONCRETE[key]) return [];
  return (vr && VR_KEYS[key]) || [1, 2, 3].map((n) => `start.${key}.${n}`);
}

function shuffle(list, rnd) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Naloga v slogu izpita za ta profil (ključ i18n) ali null. */
export function examIdea(s = {}) {
  const level = String(s.curriculum_level || "");
  if (jeSs(s) && /^4\. letnik/.test(level) && ["MAT", "FIZ", "KEM", "BIO"].includes(s.subject)) {
    const raven = / (VR|OR)$/.exec(level)?.[1];
    return s.subject === "MAT" && raven ? (raven === "VR" ? "chat.ideaMaturaVR" : "chat.ideaMaturaOR") : "chat.ideaMatura";
  }
  if (jeOs(s) && /^(6|9)\. razred/.test(level) && s.subject === "MAT") return "chat.ideaNpz";
  return null;
}

/**
 * Trije predlogi za prazen klepet.
 * @param {object} s nastavitve učenca
 * @param {{ next?: object, topics?: object[] }|null} path učna pot (teme z id, name, status)
 * @param {(key: string, params?: object) => string} t prevod
 * @param {() => number} rnd naključje (v testih stalno)
 */
export function chatIdeas(s = {}, path = null, t = (k) => k, rnd = Math.random) {
  const topics = (path?.topics || []).filter((x) => x?.name);
  const open = topics.filter((x) => x.status !== "mastered");
  const at = path?.next?.id ? Math.max(0, open.findIndex((x) => x.id === path.next.id)) : 0;
  const near = open.slice(at, at + NEAR);
  if (path?.next?.name && !near.some((x) => x.id === path.next.id)) near.unshift(path.next);
  const done = topics.filter((x) => x.status === "mastered").slice(-NEAR);
  const concrete = concreteKeys(s);
  if (!near.length && !done.length) return shuffle((concrete.length ? concrete : ["chat.idea1", "chat.idea2", "chat.idea3"]).map((k) => t(k)), rnd);

  const out = [];
  const exam = examIdea(s);
  if (exam && rnd() < EXAM_SHARE) out.push({ text: t(exam), kind: "exam", topic: null });
  // Eno konkretno vprašanje razreda (npr. »Kaj je fotoefekt?«) ob predlogih iz teme poti.
  if (concrete.length && rnd() < CONCRETE_SHARE) out.push({ text: t(concrete[Math.floor(rnd() * concrete.length)]), kind: "concrete", topic: null });
  const options = shuffle([...near.flatMap((x) => NEW.map((k) => ({ k, x }))), ...done.flatMap((x) => OLD.map((k) => ({ k, x })))], rnd);
  // Najprej različne teme in različne vrste; če tem ni dovolj, ista tema z drugo vrsto vprašanja.
  for (const strict of [true, false]) {
    for (const o of options) {
      if (out.length >= 3) break;
      if (out.some((i) => i.kind === o.k && i.topic === o.x.id)) continue;
      if (out.some((i) => i.kind === o.k || (strict && i.topic === o.x.id))) continue;
      out.push({ text: t(o.k, { topic: o.x.name }), kind: o.k, topic: o.x.id });
    }
  }
  if (exam && out.length < 3 && !out.some((i) => i.kind === "exam")) out.push({ text: t(exam), kind: "exam", topic: null });
  return shuffle(out.map((i) => i.text), rnd);
}

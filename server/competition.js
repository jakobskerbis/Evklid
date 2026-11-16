// Razdelek »Tekmovanja«: samo težje naloge v slogu tekmovanj (MAT, FIZ, KEM; OŠ in SŠ).
// Teme so v curriculum-data.js (poti <predmet>-TEK-<OS|SS>), naloge v
// practice/generators/tek-*.js. Fakultete tekmovanj nimajo.
import { getPath } from "./curriculum.js";
import { jeFaks, jeSs } from "../public/stopnja.js";

export const COMPETITIONS = {
  "MAT-TEK-OS": ["Kenguru", "Vegovo priznanje"],
  "MAT-TEK-SS": ["Kenguru", "Vegovo priznanje", "matematična olimpijada"],
  "FIZ-TEK-OS": ["Stefanovo priznanje"],
  "FIZ-TEK-SS": ["Stefanovo priznanje", "fizikalna olimpijada"],
  "KEM-TEK-OS": ["Preglovo priznanje"],
  "KEM-TEK-SS": ["Preglovo priznanje", "kemijska olimpijada"],
};

// Poskusno tekmovanje: naloge od lažjih k težjim, točke po težavnosti (kot pri Kenguruju: 3, 4 in 5).
export const CONTEST = {
  levels: [1, 1, 1, 2, 2, 2, 2, 3, 3, 3],
  points: { 1: 3, 2: 4, 3: 5 },
  minutes: 45,
};
export const TRAINING_TASKS = 10;

// Imena težavnosti v razdelku: tudi najlažja raven je nad rednim poukom.
export const LEVEL_NAMES = { 1: "težja", 2: "zahtevna", 3: "izziv" };

// Najnižje leto šolanja za vsako tekmovalno temo (OŠ 1–9, SŠ 10–13 = 1.–4. letnik). Kot kategorije po
// razredih pri Kenguruju, Vegovem, Stefanovem in Preglovem priznanju: tema pride v trening in poskusno
// tekmovanje šele v razredu, v katerem učenec njeno snov po učnem načrtu že pozna (razporeditev snovi po
// razredih kot v rednih poteh MAT-OS-6 … KEM-SS-4 v curriculum-data.js, npr. Pitagorov izrek v 8. razredu,
// množina snovi v 9., Coulombov zakon v 2. letniku). Teme samo za tekmovanja (Dirichletovo načelo,
// kongruence, invariante) so na voljo od razreda, v katerem učenec obvlada potrebno računanje; razred je
// preverjen tudi po vsebini generatorjev (npr. razporeditve uporabljajo n! in binomske simbole, simetrija
// notranje kote mnogokotnikov, štetje deliteljev potence prafaktorjev).
// test/tekmovanja-razred.test.js preveri, da ima vsaka tema vpis.
export const MIN_YEAR = {
  "MAT-TEK-OS": {
    "logicne-naloge-in-sklepanje": 3,
    "parnost-in-invariante": 5,
    "dirichletovo-nacelo": 5,
    "igre-in-zmagovalne-strategije": 3,
    "deljivost-in-ostanki": 6, // pravila deljivosti: 6. razred
    "prastevila-in-delitelji-v-nalogah": 7, // razcep, D in v: 7. razred
    "stevilske-uganke-in-zapisi": 3,
    "enacbe-s-celostevilskimi-resitvami": 6, // preproste enačbe: 6. razred
    "prestevanje-moznosti": 4,
    "razporeditve-in-izbire": 7,
    "stetje-poti-in-likov": 3,
    "lovljenje-kotov": 7, // pari kotov, notranji koti trikotnika: 7. razred
    "ploscine-z-razrezom-in-dopolnjevanjem": 5,
    "pitagorov-izrek-v-tekmovalnih-nalogah": 8,
    "simetrija-vrtenje-in-tlakovanje": 6, // simetrija, kot: 6. razred
    "delo-hitrost-in-mesanice": 7, // ulomki, sorazmerja: 7. razred
    "starosti-ure-in-koledar": 3,
    "ocenjevanje-in-fermijeve-naloge": 5,
  },
  "MAT-TEK-SS": {
    "deljivost-d-in-v-evklidov-algoritem": 10,
    kongruence: 10,
    "mali-fermatov-in-eulerjev-izrek": 11,
    "diofantske-enacbe": 10,
    "prastevila-in-eksponent-prastevila": 11,
    "neenakosti-med-sredinami": 10,
    "cauchy-schwarzeva-neenakost-in-urejanje": 11,
    "polinomi-in-vietove-formule": 11, // kvadratna enačba: 2. letnik
    "funkcijske-enacbe": 11, // funkcije: 2. letnik
    "zaporedja-rekurzije-in-indukcija": 12, // rekurzije z zaprto obliko rabijo geometrijsko zaporedje (v poti 4. letnik)
    "stetje-z-bijekcijami": 10,
    "dirichletovo-nacelo": 10,
    "invariante-in-monovariante": 10,
    "ekstremalni-princip": 10,
    "grafi-in-barvanja": 10,
    "koti-v-kroznici-in-tetivni-stirikotniki": 10,
    "potenca-tocke-in-radikalna-os": 11, // podobnost v SŠ: 2. letnik
    "podobnost-menelaj-in-ceva": 11,
    "znacilne-tocke-trikotnika": 10,
    "geometrijske-neenakosti-in-ekstremi": 10,
  },
  // Fizika in kemija sta v OŠ v 8. in 9. razredu (tudi Stefanovo in Preglovo priznanje sta v OŠ le za 8. in 9. razred).
  "FIZ-TEK-OS": {
    "branje-in-risanje-grafov-gibanja": 8,
    "ocenjevanje-in-merske-napake": 8,
    "sestavljeno-gibanje-in-povprecna-hitrost": 8,
    "sile-ravnovesje-in-vzvod": 8,
    "tlak-in-vzgon-v-nalogah": 8,
    "delo-energija-in-izkoristek": 9,
    "toplotne-bilance": 9,
    "zrcala-in-lece-v-nalogah": 8,
    "vezja-z-vec-porabniki": 9,
    "elektricna-energija-in-moc-v-gospodinjstvu": 9,
    "nacrtovanje-poskusa-in-obdelava-meritev": 8,
  },
  "FIZ-TEK-SS": {
    "posevni-met-in-gibanje-v-ravnini": 10,
    "newtonovi-zakoni-s-trenjem-in-klanci": 10,
    "gibalna-kolicina-in-trki": 10,
    "vrtenje-in-navor": 10,
    "gravitacija-in-krozenje": 11,
    "nihanje-in-valovanje": 12,
    "idealni-plin-in-termodinamika": 11,
    elektrostatika: 11,
    "tokokrogi-s-kirchhoffovimi-pravili": 11,
    "magnetno-polje-in-lorentzova-sila": 12,
    "geometrijska-optika": 12,
    "ocenjevanje-in-dimenzijska-analiza": 10,
  },
  "KEM-TEK-OS": {
    "lastnosti-snovi-in-locevanje-zmesi": 8,
    "zgradba-atoma-in-periodni-sistem-v-nalogah": 8,
    "kemijske-vezi-in-formule-spojin": 8,
    "urejanje-enacb-in-mnozina-snovi": 9, // množina snovi: 9. razred
    "racunanje-mas-iz-enacb": 9,
    "raztopine-in-masni-delez": 9,
    "kisline-baze-in-soli-v-nalogah": 8,
    "organske-spojine-v-nalogah": 9,
    "eksperimentalne-in-opazovalne-naloge": 8,
  },
  "KEM-TEK-SS": {
    "stehiometrija-z-omejitvenim-reaktantom-in-izkoristkom": 10,
    "plini-in-plinska-enacba": 10,
    termokemija: 10,
    "kemijsko-ravnotezje": 11,
    "kisline-baze-ph-in-pufri": 11,
    "redoks-reakcije-in-elektrokemija": 11,
    "zgradba-atoma-in-periodne-lastnosti": 10,
    "kemijska-vez-in-geometrija-molekul": 10,
    "organska-kemija-reakcijski-mehanizmi": 12,
    "analizna-kemija-titracije": 11,
  },
};

// Najnižje leto šolanja teme (null: ni tekmovalna tema ali nima vpisa).
export function minYear(topicId) {
  const [path, slug] = String(topicId || "").split("/");
  return MIN_YEAR[path]?.[slug] ?? null;
}

// Teme, primerne za učenca v letu šolanja `year` (games.js schoolYear: OŠ 1–9, SŠ 10–13, faks 14).
// Če ni nobene (npr. učenec 6. razreda odpre fiziko ali tekmovanja SŠ), ostane najnižja kategorija poti.
// Brez leta: vse teme.
export function topicsForYear(ids, year) {
  if (!year || !ids.length) return ids;
  const min = (id) => minYear(id) ?? 0;
  const fit = ids.filter((id) => min(id) <= year);
  if (fit.length) return fit;
  const low = Math.min(...ids.map(min));
  return ids.filter((id) => min(id) === low);
}

export const isCompetitionPath = (key) => /^(MAT|FIZ|KEM)-TEK-(OS|SS)$/.test(String(key || ""));

export function competitionKey(subject, school) {
  const key = `${subject}-TEK-${school === "SS" ? "SS" : "OS"}`;
  return isCompetitionPath(key) ? key : null;
}

// Privzeta tekmovalna pot iz nastavitev učenca (fakulteta: ni tekmovanj).
export function competitionKeyFor(settings) {
  if (jeFaks(settings)) return null;
  // Tekmovanja so za MAT, FIZ in KEM; pri drugih predmetih (npr. biologija) pokažemo matematiko.
  const subject = ["MAT", "FIZ", "KEM"].includes(settings.subject) ? settings.subject : "MAT";
  return competitionKey(subject, jeSs(settings) ? "SS" : "OS");
}

export function competitionInfo(key) {
  const p = getPath(key);
  if (!p || !isCompetitionPath(key)) return null;
  const [subject, , school] = key.split("-");
  return {
    key,
    label: p.label,
    subject,
    school,
    competitions: COMPETITIONS[key],
    contest: { tasks: CONTEST.levels.length, minutes: CONTEST.minutes, maxPoints: CONTEST.levels.reduce((s, l) => s + CONTEST.points[l], 0) },
    levelNames: LEVEL_NAMES,
  };
}

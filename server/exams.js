// Priprave na izpite (SAT, gaokao, JEE, NEET, CBSE, ICSE/ISC …): poti, poskusni izpit in točkovanje.
// Podatki so v exam-data.js, poti "<predmet>-EX-<izpit>" sestavi curriculum.js.
// Trening uporablja isti mehanizem kot tekmovalni trening, poskusni izpit pa isti kot
// poskusno tekmovanje (na čas, en poskus), le z izpitnim formatom in točkami.
import crypto from "node:crypto";
import { getPath } from "./curriculum.js";
import { hasGenerator } from "./practice/index.js";
import { EXAMS, EXAM_IDS, SUBJECT_NAMES_EN } from "./exam-data.js";
import { gradeInfo } from "../public/regions.js";
import { uiChain } from "../public/i18n/languages.js";
import { EXAM_HI, NAMES_HI, COUNTRY_HI, SUBJECT_HI } from "./exam-hi.js";
import { jeSs, stopnja } from "../public/stopnja.js";

// Jezik besedila pri dvojezičnih (angleško-hindijskih) nalogah in opisih izpitov: "hi", če je
// hindijščina v verigi jezikov vmesnika pred angleščino (hi, bho, mai, mr …), sicer "en".
export function taskLanguage(code) {
  const chain = uiChain(code || "en");
  const hi = chain.indexOf("hi");
  return hi >= 0 && hi < chain.indexOf("en") ? "hi" : "en";
}

export const isExamPath = (key) => {
  const m = /^(MAT|FIZ|KEM|BIO)-EX-([A-Z0-9]+)$/.exec(String(key || ""));
  return !!(m && Object.hasOwn(EXAMS, m[2]) && EXAMS[m[2]].subjects[m[1]] && getPath(key));
};
export const examOf = (key) => (isExamPath(key) ? String(key).split("-")[2] : null);

// Izpiti šolskega sistema (najprej domači), nato vsi ostali.
// Slovenski izpiti (NPZ, matura: naloge v slovenščini) so med »drugimi« samo za slovenske učence.
export function examsFor(system) {
  const own = EXAM_IDS.filter((id) => EXAMS[id].systems.includes(system));
  const other = EXAM_IDS.filter((id) => !own.includes(id) && (system === "SI" || !EXAMS[id].systems.includes("SI")));
  return { own, other };
}

// Ali ima šolski sistem svoje izpite (takrat je zavihek »Izpiti« namesto »Tekmovanja«).
export const hasExams = (system) => examsFor(system).own.length > 0;

// Privzeta pot: izbrani izpit (ali prvi domači) in predmet učenca, če ga izpit ima.
// Slovenija: »7. razred« → 7, »2. letnik« srednje šole → 11 (leto šolanja).
function slovenianLevel(settings) {
  const n = parseInt(String(settings.curriculum_level || ""), 10);
  if (!n) return null;
  return jeSs(settings) ? 9 + n : n;
}

// Brez izbire: domači izpit za učenčev razred (najprej šolski izpit, npr. CBSE 10 za Class 8,
// CBSE 12 za Class 12), sicer prvi domači.
export function examKeyFor(settings, examId = null) {
  const { own } = examsFor(settings.school_system);
  const level = gradeInfo(settings.school_system, settings.curriculum_level)?.level || slovenianLevel(settings);
  const fits = (x) =>
    level && EXAMS[x].forLevel && level >= EXAMS[x].forLevel[0] && level <= EXAMS[x].forLevel[1] && (!EXAMS[x].track || stopnja({ educational_track: EXAMS[x].track }) === stopnja(settings));
  const forGrade = own.filter(fits).sort((a, b) => !!EXAMS[b].board - !!EXAMS[a].board);
  const id = examId && Object.hasOwn(EXAMS, examId) ? examId : forGrade[0] || own[0] || "SAT"; // brez domačih izpitov: SAT (mednarodno najbolj razširjen)
  if (!id) return null;
  const subjects = Object.keys(EXAMS[id].subjects);
  const subject = subjects.includes(settings.subject) ? settings.subject : subjects[0];
  return `${subject}-EX-${id}`;
}

const mockOf = (key) => {
  const [subject, , id] = key.split("-");
  return EXAMS[id].subjects[subject].mock;
};

// Uradne pretekle pole: RIC ima vse pravice (»© Državni izpitni center, vse pravice pridržane«),
// zato jih ne kopiramo, ampak povežemo na stran RIC; poskusni izpit je iz naših nalog.
const MATURA_PAGE = { MAT: "matematika", FIZ: "fizika", KEM: "kemija", BIO: "biologija" };
export function officialPapers(examId, subject) {
  if (examId === "NPZ6" || examId === "NPZ9") return { source: "RIC", url: "https://www.ric.si/nacionalno-preverjanje-znanja/preizkusi-znanja/" };
  if (examId === "MATURA" && MATURA_PAGE[subject]) return { source: "RIC", url: `https://www.ric.si/splosna-matura/predmeti/${MATURA_PAGE[subject]}/` };
  if (examId === "POKLICNA" && subject === "MAT") return { source: "RIC", url: "https://www.ric.si/poklicna-matura/predmeti/tretji-predmet/matematika/" };
  return null;
}

// Opis za zavihek: izpit, predmeti, format poskusnega izpita.
export function examInfo(key, system, lang = "en") {
  if (!isExamPath(key)) return null;
  const [subject, , id] = key.split("-");
  const e = localExam(id, lang);
  const mock = mockOf(key);
  const groups = mock.groups;
  const { own, other } = examsFor(system);
  const brief = (x) => ({ id: x, name: localExam(x, lang).name, country: localExam(x, lang).country, ...(EXAMS[x].track ? { track: EXAMS[x].track } : {}) });
  return {
    key,
    exam: id,
    name: e.name,
    full: e.full,
    country: e.country,
    about: e.about,
    subject,
    lang: e.lang,
    // Jezik nalog: slovenski izpiti slovensko, indijski v hindijščini za hindijske učence, sicer angleško.
    tasksLang: e.systems.includes("SI") ? "sl" : e.lang,
    subjectName: e.subjectNames[subject],
    official: officialPapers(id, subject),
    subjects: Object.keys(e.subjects).map((s) => ({ key: `${s}-EX-${id}`, subject: s, name: e.subjectNames[s] })),
    exams: { own: own.map(brief), other: other.map(brief) },
    mock: {
      tasks: groups.reduce((n, g) => n + g.n, 0),
      choice: groups.filter((g) => g.format === "choice").reduce((n, g) => n + g.n, 0),
      minutes: mock.minutes,
      maxPoints: groups.reduce((n, g) => n + g.n * g.points, 0),
      negative: groups.some((g) => g.penalty < 0),
      penalty: Math.min(0, ...groups.map((g) => g.penalty)),
      scale: mock.scale ? mock.scale.slice(0, 2) : null,
      graded: !!mock.grades,
      options: Math.max(4, ...groups.map((g) => g.options || 4)),
    },
  };
}

// Izpit v jeziku učenca: hindijska imena in opis, kjer obstajajo (indijski izpiti), sicer angleško.
function localExam(id, lang) {
  const e = EXAMS[id];
  const hi = lang === "hi" && EXAM_HI[id];
  if (!hi) return { ...e, lang: "en", subjectNames: SUBJECT_NAMES_EN };
  return { ...e, ...hi, name: hi.name || e.name, country: COUNTRY_HI[e.country] || e.country, lang: "hi", subjectNames: { ...SUBJECT_NAMES_EN, ...SUBJECT_HI } };
}

// Hindijsko ime sklopa ali teme indijskega izpita (manjkajoče ostane angleško).
export const localName = (name, lang) => (lang === "hi" && NAMES_HI[name]) || name;
// Pogled poti izpita (pathView) z imeni sklopov in tem v jeziku učenca.
export function localizeExamView(view, lang) {
  if (lang !== "hi" || !view?.units) return view;
  return { ...view, units: view.units.map((u) => ({ ...u, title: localName(u.title, lang), topics: u.topics.map((t) => ({ ...t, name: localName(t.name, lang) })) })) };
}
// Tema izpita (npr. /api/topic) z imeni v jeziku učenca.
export function localizeExamTopic(topic, lang) {
  if (lang !== "hi" || !isExamPath(topic.path)) return topic;
  const id = examOf(topic.path);
  const label = `${localExam(id, lang).name} – ${SUBJECT_HI[topic.subject] || topic.subject}`;
  return { ...topic, name: localName(topic.name, lang), unit: localName(topic.unit, lang), pathLabel: label };
}

const pickWeighted = (items, weight) => {
  const total = items.reduce((s, x) => s + weight(x), 0);
  let x = crypto.randomInt(1_000_000) / 1_000_000 * total;
  for (const it of items) {
    x -= weight(it);
    if (x <= 0) return it;
  }
  return items[items.length - 1];
};

// Načrt poskusnega izpita: vprašanja po skupinah formata, teme po utežeh sklopov,
// ista tema ne pride dvakrat zapored in se ne ponovi, dokler ni prišla vsaka.
export function mockPlan(key) {
  const [subject, , id] = key.split("-");
  const def = EXAMS[id].subjects[subject];
  const units = getPath(key).units
    .map((u, i) => ({ topics: u.topics.filter((t) => hasGenerator(t.id)).map((t) => t.id), weight: def.units[i][2] || 1 }))
    .filter((u) => u.topics.length);
  const used = new Map();
  const plan = [];
  for (const g of def.mock.groups) {
    for (let i = 0; i < g.n; i++) {
      const unit = pickWeighted(units, (u) => u.weight);
      const least = Math.min(...unit.topics.map((t) => used.get(t) || 0));
      const pool = unit.topics.filter((t) => (used.get(t) || 0) === least && t !== plan[plan.length - 1]?.topic);
      const list = pool.length ? pool : unit.topics;
      const topic = list[crypto.randomInt(list.length)];
      used.set(topic, (used.get(topic) || 0) + 1);
      plan.push({ topic, mode: "contest", level: g.level, format: g.format, points: g.points, penalty: g.penalty, ...(g.options ? { options: g.options } : {}) });
    }
  }
  return { plan, minutes: def.mock.minutes };
}

// Ocena na lestvici izpita (npr. SAT 200–800 na 10 natančno, bac 0–20 na pol točke).
export function scaledScore(key, points, maxPoints) {
  const mock = isExamPath(key) && mockOf(key);
  if (!mock?.scale || !maxPoints) return null;
  const [lo, hi, step = 10] = mock.scale;
  const value = Math.round((lo + ((hi - lo) * Math.max(0, points)) / maxPoints) / step) * step;
  return { value: Number(value.toFixed(2)), min: lo, max: hi };
}

// Približna ocena po odstotku točk (A-level A*–E, WAEC A1–F9, Abitur 15–0 točk …).
export function examGrade(key, points, maxPoints) {
  const grades = isExamPath(key) && mockOf(key).grades;
  if (!grades || !maxPoints) return null;
  const pct = (100 * Math.max(0, points)) / maxPoints;
  return (grades.find(([min]) => pct >= min) || grades[grades.length - 1])[1];
}

// Besedilo za sistemski prompt, ko pogovor teče o izpitni temi.
export function examPrompt(key) {
  if (!isExamPath(key)) return "";
  const e = EXAMS[examOf(key)];
  return `Učenec se pripravlja na izpit ${e.full} (${e.country}). Format: ${e.about} Razlagaj v slogu tega izpita (pristopi, pasti, časovna razporeditev), a ne izdaj rešitve, dokler je učenec ne poskusi sam.`;
}

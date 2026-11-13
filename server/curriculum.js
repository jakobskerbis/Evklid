// Učne poti: dostop do podatkov iz curriculum-data.js.
import { PATHS } from "./curriculum-data.js";
import { UNI_PATHS, PROGRAMS, FACULTIES, FAC_SHORT, UNIVERSITIES } from "./university-data.js";
import { ALL_SUBJECTS } from "./subjects.js";
import { EN, EN_UNITS, INT_LEVELS, IN_PATHS, SUBJECT_EN } from "./region-curricula.js";
import { SCHOOL_SYSTEMS, isRegional, gradeInfo, gradesOf } from "../public/regions.js";
import { BANK, EXAMS, SUBJECT_NAMES_EN } from "./exam-data.js";
import { jeFaks, jeSs } from "../public/stopnja.js";

export function slugify(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Razširjena oblika: vsaka tema dobi stalen id "<pot>/<slug-teme>".
// Brez prototipa: ključ iz poizvedbe (npr. »toString«, »__proto__«) ne sme najti podedovane lastnosti.
const BUILT = Object.create(null);
const TOPICS = Object.create(null);
for (const [key, p] of Object.entries({ ...PATHS, ...UNI_PATHS })) {
  // OŠ/SŠ: "<predmet>-<OS|SS>-<razred>"; fakultete: podatki so zapisani v poti.
  const [subject, school, grade] = p.school === "UNI" ? [p.subject, "UNI", 0] : key.split("-");
  const units = p.units.map(([title, topics], ui) => ({
    title,
    topics: topics.map((t) => {
      // »Ime | cilji => POT/tema«: osnovna tema drugega predmeta (naravoslovje → fizika, kemija).
      const [text, refs = ""] = t.split("=>");
      const [name, goals = ""] = text.split("|").map((x) => x.trim());
      const topic = { id: `${key}/${slugify(name)}`, name, goals, unit: title, unitIndex: ui, path: key, subject };
      const base = refs.split(",").map((x) => x.trim()).filter(Boolean);
      if (base.length) topic.base = base;
      TOPICS[topic.id] = topic;
      return topic;
    }),
  }));
  BUILT[key] = { key, label: p.label, subject, school, grade: Number(grade), units };
}
for (const t of Object.values(TOPICS)) {
  for (const b of t.base || []) if (!TOPICS[b] || TOPICS[b].base) throw new Error(`${t.id}: osnovna tema ${b} ne obstaja`);
}

// ---------- regijske poti (public/regions.js, server/region-curricula.js) ----------
// Mednarodna pot ima angleška imena; v slovenskem vmesniku (ui = "sl") pokažemo imena
// izvirnih slovenskih tem in sklopov, da v slovenski aplikaciji ni angleških naslovov.
export const localTopic = (t, ui) => (ui === "sl" && t?.sl ? { ...t, name: t.sl.name, goals: t.sl.goals, unit: t.sl.unit ?? t.unit } : t);
export const localUnitTitle = (u, ui) => (ui === "sl" && u?.sl?.title) || u?.title;
// Teme imajo »base«: osnovne teme, iz katerih vzamejo naloge, lekcije in simulacije.
function addRegionPath(key, label, subject, school, grade, units, extra = {}) {
  BUILT[key] = {
    key,
    label,
    subject,
    school,
    grade,
    region: true,
    ...extra,
    units: units.map(([title, topics, titleSl], ui) => ({
      title,
      ...(titleSl ? { sl: { title: titleSl } } : {}),
      topics: topics.map(({ name, goals, base, sl }) => {
        for (const b of base) if (!TOPICS[b] || TOPICS[b].base) throw new Error(`${key}: osnovna tema ${b} ne obstaja`);
        const topic = { id: `${key}/${slugify(name)}`, name, goals, unit: title, unitIndex: ui, path: key, subject, base };
        if (sl) topic.sl = { ...sl, unit: titleSl || title };
        if (TOPICS[topic.id]) throw new Error(`${key}: tema »${name}« se ponovi`);
        TOPICS[topic.id] = topic;
        return topic;
      }),
    })),
  };
}

// Mednarodni načrt: slovenske poti z angleškimi imeni, po letih šolanja.
for (const [subject, levels] of Object.entries(INT_LEVELS)) {
  for (const [level, keys] of Object.entries(levels)) {
    const units = keys.flatMap((k) =>
      BUILT[k].units.map((u) => [
        EN_UNITS[u.title] || u.title,
        u.topics.map((t) => {
          const [name, goals = ""] = (EN[t.id] || `${t.name} | ${t.goals}`).split("|").map((x) => x.trim());
          // sl: izvirna slovenska imena za slovenski vmesnik (localTopic, localUnitTitle).
          return { name, goals, base: [t.id], sl: { name: t.name, goals: t.goals } };
        }),
        u.title,
      ]),
    );
    addRegionPath(`${subject}-INT-${level}`, `${SUBJECT_EN[subject]}, year ${level} of school`, subject, "INT", Number(level), units);
  }
}

// Indija (CBSE / NCERT): "Ime | cilji => POT/tema, POT/tema".
for (const [key, p] of Object.entries(IN_PATHS)) {
  const [subject, , grade] = key.split("-");
  const units = p.units.map(([title, topics]) => [
    title,
    topics.map((line) => {
      const [text, refs = ""] = line.split("=>");
      const [name, goals = ""] = text.split("|").map((x) => x.trim());
      return { name, goals, base: refs.split(",").map((x) => x.trim()).filter(Boolean) };
    }),
  ]);
  addRegionPath(key, p.label, subject, "IN", Number(grade), units);
}

// Banka izpitnih nalog (angleške naloge, server/exam-data.js): teme brez »base«, ki jih
// izpitne poti uporabijo kot osnovo. Niso na nobenem seznamu poti.
for (const [key, topics] of Object.entries(BANK)) {
  const subject = key.split("-")[0];
  BUILT[key] = {
    key,
    label: `${SUBJECT_NAMES_EN[subject]} – exam question bank`,
    subject,
    school: "EXB",
    grade: 0,
    region: true,
    hidden: true,
    units: [
      {
        title: "Exam topics",
        topics: topics.map((line) => {
          const [name, goals = ""] = line.split("|").map((x) => x.trim());
          const topic = { id: `${key}/${slugify(name)}`, name, goals, unit: "Exam topics", unitIndex: 0, path: key, subject };
          TOPICS[topic.id] = topic;
          return topic;
        }),
      },
    ],
  };
}

// Priprave na izpite: pot "<predmet>-EX-<izpit>", npr. MAT-EX-SAT (server/exams.js).
const parseRefs = (line) => {
  const [text, refs = ""] = line.split("=>");
  const [name, goals = ""] = text.split("|").map((x) => x.trim());
  return { name, goals, base: refs.split(",").map((x) => x.trim()).filter(Boolean) };
};
for (const [examId, exam] of Object.entries(EXAMS)) {
  for (const [subject, def] of Object.entries(exam.subjects)) {
    const units = def.units.map(([title, topics]) => [title, topics.map(parseRefs)]);
    addRegionPath(`${subject}-EX-${examId}`, `${exam.name} – ${SUBJECT_NAMES_EN[subject]}`, subject, "EX", 0, units, { exam: examId });
  }
}

// Letnik predmeta v programu (za oznako "moj letnik").
for (const prog of Object.values(PROGRAMS)) {
  prog.courseKeys.forEach((keys, yi) => keys.forEach((k) => (BUILT[k].grade ||= yi + 1)));
}

export function getPath(key) {
  return BUILT[key] || null;
}

export function getTopic(id) {
  return TOPICS[id] || null;
}

const brief = ({ key, label, subject, school, grade }) => ({ key, label, subject, school, grade });

// Osnovne teme regijske teme (za naloge, lekcije, razlage); pri ostalih tema sama.
export function baseTopicIds(id) {
  const t = TOPICS[id];
  return t?.base || (t ? [id] : []);
}

// Poti OŠ in SŠ (fakultetni predmeti gredo prek listProgramPaths).
// Brez šolskega sistema ali s »SI« samo slovenske poti; z regijskim sistemom njegove poti
// z imeni razredov tega sistema (npr. »Mathematics, JSS 2«).
export function listPaths(subject, system = "SI") {
  const syllabus = isRegional(system) ? SCHOOL_SYSTEMS[system].syllabus : null;
  const levels = syllabus ? [...new Set(gradesOf(system).map((g) => g.level))] : [];
  // Pot je v sistemu, če ima sistem razred na njeni ravni ali če je zamenjava za razred brez poti.
  const used = (p) => levels.includes(p.grade) || levels.some((l) => pickPath(syllabus, p.subject, l)?.key === p.key);
  return Object.values(BUILT)
    .filter((p) => p.school !== "UNI" && (!subject || p.subject === subject))
    .filter((p) => (syllabus ? p.school === syllabus && used(p) : !p.region))
    .map((p) => ({ ...brief(p), label: pathLabelFor(p.key, system) }));
}

// Pot učnega načrta za leto šolanja; če je ni, najbližja višja (sicer zadnja nižja).
function pickPath(syllabus, subject, level) {
  const all = Object.values(BUILT)
    .filter((p) => p.school === syllabus && p.subject === subject)
    .sort((a, b) => a.grade - b.grade);
  return all.find((p) => p.grade === level) || all.find((p) => p.grade > level) || all[all.length - 1] || null;
}

// Ime poti v šolskem sistemu: INT poti dobijo imena razredov sistema.
export function pathLabelFor(key, system = "SI") {
  const p = BUILT[key];
  if (!p) return "";
  if (p.school !== "INT" || !isRegional(system)) return p.label;
  const grades = gradesOf(system).filter((g) => g.level === p.grade).map((g) => g.label);
  if (grades.length) return `${SUBJECT_EN[p.subject]}, ${grades.join(" / ")}`;
  const below = gradesOf(system).filter((g) => g.level < p.grade).pop();
  return below ? `${SUBJECT_EN[p.subject]}, ${below.label}+` : p.label;
}

// ---------- fakultete ----------

export function getProgram(id) {
  return Object.hasOwn(PROGRAMS, String(id)) ? PROGRAMS[id] : null;
}

function mainSubject(keys) {
  const count = (s) => keys.filter((k) => UNI_PATHS[k].subject === s).length;
  return ALL_SUBJECTS.reduce((best, s) => (count(s) > count(best) ? s : best), ALL_SUBJECTS[0]);
}

export function listPrograms() {
  return Object.entries(PROGRAMS).map(([id, p]) => ({
    id,
    label: p.label,
    name: p.name,
    faculty: p.faculty,
    facultyName: FACULTIES[p.faculty],
    facultyShort: FAC_SHORT[p.faculty],
    university: p.faculty.split("-")[0],
    universityName: UNIVERSITIES[p.faculty.split("-")[0]] || p.faculty.split("-")[0],
    source: p.source,
    sourceYear: p.sourceYear,
    years: p.years.length,
    // »UN« (univerzitetni 1. stopnje) ali »EMŠ« (enoviti magistrski).
    degree: p.degree || "UN",
    // Predmeti aplikacije, ki jih program ima (za izbirnik predmeta).
    subjects: ALL_SUBJECTS.filter((s) => [...p.courseKeys.flat(), ...p.electiveKeys].some((k) => UNI_PATHS[k].subject === s)),
    // Glavni predmet programa (največ obveznih predmetov), npr. BIO pri biologiji.
    mainSubject: mainSubject(p.courseKeys.flat()),
  }));
}

// Predmeti programa po letnikih: [{ ...pot, year }]; izbirni imajo year: null.
export function listProgramPaths(programId) {
  const p = getProgram(programId);
  if (!p) return [];
  return [
    ...p.courseKeys.flatMap((keys, yi) => keys.map((k) => ({ ...brief(BUILT[k]), year: yi + 1 }))),
    ...p.electiveKeys.map((k) => ({ ...brief(BUILT[k]), year: null, elective: true })),
  ];
}

// Id-ji tem z danim naslovom v vseh fakultetnih predmetih (za generatorje nalog).
export function uniTopicIds(...names) {
  const want = new Set(names);
  return Object.values(TOPICS)
    .filter((t) => BUILT[t.path].school === "UNI" && want.has(t.name))
    .map((t) => t.id);
}

// Ista fakultetna tema (enak naslov in predmet) v drugih predmetih in programih.
// Lekcija učbenika se napiše enkrat in velja za vse (server/textbook.js).
const SAME = new Map();
for (const t of Object.values(TOPICS)) {
  if (BUILT[t.path].school !== "UNI") continue;
  const k = `${t.subject}|${slugify(t.name)}`;
  if (!SAME.has(k)) SAME.set(k, []);
  SAME.get(k).push(t.id);
}
export function sameTopics(id) {
  const t = TOPICS[id];
  if (!t || BUILT[t.path].school !== "UNI") return t ? [id] : [];
  return SAME.get(`${t.subject}|${slugify(t.name)}`);
}

// Vsi id-ji tem po vrsti (za "naslednja tema").
export function topicOrder(key) {
  const p = BUILT[key];
  return p ? p.units.flatMap((u) => u.topics) : [];
}

// Iz nastavitev učenca ugane ustrezno pot, npr. "8. razred" -> MAT-OS-8.
export function pathKeyFor(settings) {
  const level = settings.curriculum_level || "";
  if (isRegional(settings.school_system)) return regionPathKeyFor(settings);
  if (jeFaks(settings)) return uniPathKeyFor(settings);
  const school = jeSs(settings) ? "SS" : "OS";
  const num = Number((level.match(/([1-9])\s*\.?/) || [])[1]);
  const candidates = listPaths(settings.subject).filter((p) => p.school === school);
  if (!candidates.length) return null;
  const exact = candidates.find((p) => p.grade === num);
  if (exact) return exact.key;
  // Ni poti za ta razred (npr. stara nastavitev): ponudimo prvo pot predmeta.
  return candidates[0].key;
}

// Regijski sistem: pot za leto šolanja izbranega razreda.
function regionPathKeyFor(settings) {
  const level = gradeInfo(settings.school_system, settings.curriculum_level)?.level ?? 8;
  return pickPath(SCHOOL_SYSTEMS[settings.school_system].syllabus, settings.subject, level)?.key || null;
}

// Besedilo za sistemski prompt, ko pogovor teče o temi učne poti.
export function learningPathPrompt(topicId) {
  const t = getTopic(topicId);
  if (!t) return "(Prost pogovor: ni izbrane teme učne poti.)";
  const order = topicOrder(t.path);
  const next = order[order.findIndex((x) => x.id === t.id) + 1];
  return [
    `Ta pogovor je del učne poti »${BUILT[t.path].label}«.`,
    `Sklop: ${t.unit}. Tema: ${t.name}.`,
    t.goals ? `Cilji: ${t.goals}.` : "",
    next ? `Naslednja tema na poti: ${next.name}.` : "To je zadnja tema na poti.",
  ]
    .filter(Boolean)
    .join("\n");
}

// Fakulteta: prvi predmet izbranega letnika, ki ustreza predmetu (MAT/FIZ/KEM).
function uniPathKeyFor(settings) {
  const p = PROGRAMS[settings.study_program];
  if (!p) return null;
  const year = Number((String(settings.curriculum_level || "").match(/([1-4])/) || [])[1]) || 1;
  // Letnik brez zajetih predmetov (npr. moduli v 3. letniku): vzamemo zadnjega s predmeti.
  const years = p.courseKeys.slice(0, year).filter((k) => k.length);
  const keys = years[years.length - 1] || [];
  // Predmet, ki ga je študent izbral v Nastavitvah (preveri ga normalizeSettings).
  if (settings.study_course && BUILT[settings.study_course]) return settings.study_course;
  return keys.find((k) => BUILT[k].subject === settings.subject) || keys[0] || null;
}

// Opis programa za sistemski prompt.
export function studyProgramPrompt(settings) {
  if (!jeFaks(settings)) return "(ni fakultete)";
  const p = PROGRAMS[settings.study_program];
  if (!p) return "(program ni izbran)";
  const year = Number((String(settings.curriculum_level || "").match(/([1-4])/) || [])[1]) || 1;
  const names = (p.courseKeys[year - 1] || []).map((k) => BUILT[k].label.replace(/ \(.*\)$/, ""));
  const kind = p.degree === "EMŠ" ? "enoviti magistrski študijski program" : "univerzitetni študijski program 1. stopnje";
  return `${FACULTIES[p.faculty]}, ${kind} ${p.name}` + (names.length ? `; predmeti ${year}. letnika: ${names.join(", ")}` : "");
}

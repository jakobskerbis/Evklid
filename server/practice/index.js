// Register generatorjev in ustvarjanje nalog.
import crypto from "node:crypto";
import { makeRng } from "./rng.js";
import { popraviNastevanja } from "../nastevanje.js";
import { MAT_GENERATORS } from "./generators/mat.js";
import { FIZ_GENERATORS } from "./generators/fiz.js";
import { KEM_GENERATORS } from "./generators/kem.js";
import { UNI_GENERATORS } from "./generators/uni.js";
import { DODATNE_MAT_OS } from "./generators/dodatne-mat-os.js";
import { DODATNE_MAT_SS12 } from "./generators/dodatne-mat-ss12.js";
import { DODATNE_MAT_SS34 } from "./generators/dodatne-mat-ss34.js";
import { DODATNE_OS_FIZ_KEM } from "./generators/dodatne-os-fiz-kem.js";
import { DODATNE_FIZ_SS } from "./generators/dodatne-fiz-ss.js";
import { DODATNE_KEM_SS } from "./generators/dodatne-kem-ss.js";
import { DODATNE_VRZELI_MAT } from "./generators/dodatne-vrzeli-mat.js";
import { DODATNE_VRZELI_FIZ_KEM } from "./generators/dodatne-vrzeli-fiz-kem.js";
import { NAR_GENERATORS } from "./generators/nar.js";
import { BIO_GENERATORS } from "./generators/bio.js";
import { TEK_MAT_OS } from "./generators/tek-mat-os.js";
import { TEK_MAT_SS } from "./generators/tek-mat-ss.js";
import { TEK_FIZ } from "./generators/tek-fiz.js";
import { TEK_KEM } from "./generators/tek-kem.js";
import { EXAM_MAT } from "./generators/exam-mat.js";
import { EXAM_FIZ } from "./generators/exam-fiz.js";
import { EXAM_KEM } from "./generators/exam-kem.js";
import { EXAM_IN_MAT } from "./generators/exam-in-mat.js";
import { EXAM_IN_FIZ } from "./generators/exam-in-fiz.js";
import { EXAM_IN_KEM } from "./generators/exam-in-kem.js";
import { EXAM_IN_BIO } from "./generators/exam-in-bio.js";
import { EXAM_GAP_MAT } from "./generators/exam-gap-mat.js";
import { EXAM_GAP_FIZ } from "./generators/exam-gap-fiz.js";
import { EXAM_GAP_KEM } from "./generators/exam-gap-kem.js";
import { EXAM_GAP_BIO } from "./generators/exam-gap-bio.js";
import { baseTopicIds } from "../curriculum.js";

export const GENERATORS = [
  ...MAT_GENERATORS,
  ...FIZ_GENERATORS,
  ...KEM_GENERATORS,
  ...UNI_GENERATORS,
  // teme OŠ/SŠ, ki prej niso imele nalog
  ...DODATNE_MAT_OS,
  ...DODATNE_MAT_SS12,
  ...DODATNE_MAT_SS34,
  ...DODATNE_OS_FIZ_KEM,
  ...DODATNE_FIZ_SS,
  ...DODATNE_KEM_SS,
  // teme, dodane po primerjavi z učnimi načrti (2026-10-30)
  ...DODATNE_VRZELI_MAT,
  ...DODATNE_VRZELI_FIZ_KEM,
  // naravoslovje OŠ 6. in 7. razred
  ...NAR_GENERATORS,
  ...BIO_GENERATORS,
  // Tekmovanja (razdelek »Tekmovanja«): samo težje naloge v slogu tekmovanj.
  ...TEK_MAT_OS,
  ...TEK_MAT_SS,
  ...TEK_FIZ,
  ...TEK_KEM,
  // Priprave na izpite (SAT, gaokao, JEE, NEET, CBSE): angleške naloge v banki *-EXB.
  ...EXAM_MAT,
  ...EXAM_FIZ,
  ...EXAM_KEM,
  // Indija (CBSE, ICSE/ISC, državne šole, JEE, NEET): dvojezične naloge (angleško, hindijsko).
  ...EXAM_IN_MAT,
  ...EXAM_IN_FIZ,
  ...EXAM_IN_KEM,
  ...EXAM_IN_BIO,
  // Teme drugih državnih izpitov (množice, razpršenost, tlak, polimeri …).
  ...EXAM_GAP_MAT,
  ...EXAM_GAP_FIZ,
  ...EXAM_GAP_KEM,
  ...EXAM_GAP_BIO,
];

const BY_TOPIC = Object.create(null); // brez prototipa (id teme pride iz zahteve)
for (const g of GENERATORS) {
  for (const t of g.topics) (BY_TOPIC[t] ||= []).push(g);
}

// Regijska tema (npr. MAT-IN-8/…) vzame generatorje svojih osnovnih tem.
function gensFor(topicId) {
  if (BY_TOPIC[topicId]) return BY_TOPIC[topicId].map((g) => [g, topicId]);
  return baseTopicIds(topicId).flatMap((b) => (b === topicId ? [] : (BY_TOPIC[b] || []).map((g) => [g, b])));
}

export function hasGenerator(topicId) {
  return gensFor(topicId).length > 0;
}

export function topicsWithGenerators() {
  return Object.keys(BY_TOPIC);
}

// TeX-ova vejica {,} zunaj formul ($…$, $$…$$) bi se izpisala dobesedno (»1{,}86 a.e.«):
// tam jo zamenjamo z navadno vejico (tx() se uporablja tudi v navadnem besedilu).
const MATH_SPLIT = /(\$\$[\s\S]+?\$\$|\$[^$\n]+\$)/;
// Pred tem naštevanja z decimalno vejico dobijo podpičje (»$1{,}5$; $2$«, »$(3; 7{,}5)$«; server/nastevanje.js),
// razen pri dvojezičnih (indijskih) generatorjih z decimalno piko.
const plainOnly = (s) => (typeof s === "string" && s.includes("{,}") ? s.split(MATH_SPLIT).map((p, i) => (i % 2 ? p : p.replaceAll("{,}", ","))).join("") : s);
function plainCommas(t, slovensko = true) {
  const plain = slovensko ? (s) => plainOnly(popraviNastevanja(s)) : plainOnly;
  const a = t.answer;
  return {
    ...t,
    text: plain(t.text),
    hint: plain(t.hint),
    solution: Array.isArray(t.solution) ? t.solution.map(plain) : plain(t.solution),
    answer: {
      ...a,
      ...(a.mistakes ? { mistakes: a.mistakes.map((m) => (m ? { ...m, why: plain(m.why) } : m)) } : {}),
      ...(Array.isArray(a.why) ? { why: a.why.map(plain) } : {}),
    },
  };
}

// Ustvari nalogo za temo. level: 1 (lažje) – 3 (težje).
// lang: jezik besedila pri dvojezičnih generatorjih ("hi" = hindijsko, sicer angleško
// ali slovensko); drugi generatorji ga prezrejo. Isto seme da v vseh jezikih isto nalogo.
export function generateTask(topicId, level = 1, seed = crypto.randomInt(2 ** 31), lang = "en") {
  const gens = gensFor(topicId);
  if (!gens.length) return null;
  const r = makeRng(seed);
  const [g, genTopic] = r.pick(gens);
  // Nekaj poskusov, če bi generator vrnil neveljavno nalogo.
  for (let i = 0; i < 5; i++) {
    const t = g.gen(level, r, genTopic, lang);
    if (t && t.text && t.answer) return plainCommas({ ...t, generator: g.id, topicId, level, seed, ...(lang === "hi" && g.langs?.includes("hi") ? { textLang: "hi" } : {}) }, !g.langs);
  }
  throw new Error(`Generator ${g.id} ni ustvaril naloge.`);
}

// Lestev namigov pred odgovorom: 1) podatki in iskano, 2) formula, 3) prvi korak (namig).
export function hintSteps(task) {
  const steps = [];
  const given = task.data?.given?.filter(Boolean) || [];
  const find = task.data?.find?.filter(Boolean) || [];
  if (given.length) steps.push({ kind: "data", given, find });
  const formula = task.formula ? [].concat(task.formula).filter(Boolean) : [];
  if (formula.length) steps.push({ kind: "formula", formula });
  if (task.hint) steps.push({ kind: "hint", text: task.hint });
  return steps;
}

// Možnosti so čisti TeX (»A \\wedge \\neg B«), tudi če generator ni nastavil options_tex:
// vsaj ena ima ukaz TeX in nobena nima $…$. Sicer bi učenec videl surove ukaze.
export function optionsAreTex(task) {
  if (task.options_tex) return true;
  const opts = task.answer?.type === "choice" ? (task.answer.options || []).map(String) : [];
  return opts.length > 0 && !opts.some((o) => o.includes("$")) && opts.some((o) => /\\[a-zA-Z]+/.test(o));
}

// Kar gre k odjemalcu: brez pravilnega odgovora in rešitve.
export function publicTask(task) {
  const { answer } = task;
  return {
    text: task.text,
    figure: task.figure || null,
    inputHint: task.inputHint || null,
    level: task.level,
    answerType: answer.type,
    unit: answer.unit || null,
    options: answer.type === "choice" ? answer.options : null,
    optionsTex: optionsAreTex(task),
    coefficientCount: answer.type === "coefficients" ? answer.values.length : null,
    // Podatki iz besedila (Podatki / Iščemo) in potrebna formula za rešen zgled.
    data: task.data || null,
    formula: task.formula || null,
    topicId: task.topicId || null, // za razlago teme ob seriji nalog
    textLang: task.textLang || null, // "hi" pri hindijski nalogi (atribut lang v vmesniku)
    hintSteps: hintSteps(task).length, // koliko korakov ima lestev namigov
  };
}

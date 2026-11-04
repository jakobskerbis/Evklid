// Učbenik: lekcije za teme učnih poti.
//
// Lekcije so Markdown datoteke v content/lessons/<pot>/<slug-teme>.md, da jih
// učitelj lahko pregleda in popravi kar v repozitoriju. Branje ne stane nič.
// Oblika je opisana v content/lessons/README.md.
import "./env.js";
import { SUBJECT_NAMES } from "./subjects.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getTopic, getPath, listPaths, topicOrder, getProgram, listProgramPaths, sameTopics, baseTopicIds } from "./curriculum.js";
import { getExplanation } from "./explanations.js";
import { hasGenerator } from "./practice/index.js";
import { simsForTopic } from "../public/sim/katalog.js";
import { SCHOOL_SYSTEMS, isRegional } from "../public/regions.js";
import { SUBJECT_EN } from "./region-curricula.js";
import { hasEngine } from "../public/sim/index.js";
import { SYMBOLS_BLOCK_RE, parseSymbolsBlock } from "../public/formula-data.js";

const here = path.dirname(fileURLToPath(import.meta.url));
export const LESSONS_DIR = process.env.EVKLID_LESSONS || path.join(here, "..", "content", "lessons");

// Lastne interaktivne simulacije (public/sim/). Katera se pokaže pri kateri temi,
// je zapisano v public/sim/katalog.js; prikažemo samo že narejene.
export function simsFor(topicId, lesson = loadLesson(topicId)) {
  const usable = (d) => hasEngine(d.id) && (d.id !== "zbirka" || (d.opts?.items || []).some((it) => hasEngine(it[0])));
  // Regijska tema vzame simulacije svojih osnovnih tem (brez ponovitev).
  const seen = new Set();
  const list = baseTopicIds(topicId)
    .flatMap((id) => simsForTopic(id))
    .filter((d) => usable(d) && !seen.has(d.id + JSON.stringify(d.opts)) && seen.add(d.id + JSON.stringify(d.opts)));
  const extra = lesson?.meta.demo;
  if (extra && hasEngine(extra) && !list.some((d) => d.id === extra)) list.unshift({ id: extra, title: "Interaktivni poskus", opts: {} });
  return list;
}

// Glave razdelkov, ki imajo v lekciji poseben pomen.
const ALT_PREFIX = /^drugače\s*:\s*/i;
const CHECKS = /^preveri se$/i;

// Razčleni lekcijo. Glava med --- vrsticama: "ključ: vrednost".
// Razdelki so ## naslovi; "## Drugače: …" so druge razlage, "## Preveri se"
// vsebuje vprašanja (? vprašanje, - napačen, + pravilen odgovor, > pojasnilo).
export function parseLesson(src) {
  const meta = {};
  let body = src.replace(/^﻿/, "").replace(/\r\n/g, "\n");
  const fm = /^---\n([\s\S]*?)\n---\n?/.exec(body);
  if (fm) {
    for (const line of fm[1].split("\n")) {
      const m = /^\s*([\w-]+)\s*:\s*(.*)$/.exec(line);
      if (m) meta[m[1].toLowerCase()] = m[2].trim();
    }
    body = body.slice(fm[0].length);
  }
  // Oznake lekcije (:::simboli, kjerkoli v datoteki): za klikljive formule, ne izpišejo se.
  const symbols = [];
  body = body.replace(SYMBOLS_BLOCK_RE, (_, block) => {
    symbols.push(...parseSymbolsBlock(block).list);
    return "";
  });
  const sections = [];
  const alternatives = [];
  let checks = [];
  const parts = body.split(/^## +/m);
  const intro = parts.shift().trim();
  if (intro) sections.push({ title: "", md: intro });
  for (const part of parts) {
    const nl = part.indexOf("\n");
    const title = (nl === -1 ? part : part.slice(0, nl)).trim();
    const md = nl === -1 ? "" : part.slice(nl + 1).trim();
    if (ALT_PREFIX.test(title)) alternatives.push({ title: title.replace(ALT_PREFIX, "").trim(), md });
    else if (CHECKS.test(title)) checks = parseChecks(md);
    else sections.push({ title, md });
  }
  return { meta, sections, alternatives, checks, symbols };
}

function parseChecks(md) {
  const out = [];
  let cur = null;
  for (const raw of md.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    const kind = line[0];
    const text = line.slice(1).trim();
    if (kind === "?") {
      cur = { q: text, options: [], correct: -1, why: "", optionWhy: [] };
      out.push(cur);
    } else if (!cur) continue;
    else if (kind === "+" || kind === "-") {
      if (kind === "+") cur.correct = cur.options.length;
      cur.options.push(text);
      cur.optionWhy.push("");
    } else if (kind === "~" && cur.options.length) {
      // »~« pod napačno možnostjo: zakaj je napačna (tipična napačna predstava)
      const i = cur.options.length - 1;
      cur.optionWhy[i] += (cur.optionWhy[i] ? " " : "") + text;
    } else if (kind === ">") cur.why += (cur.why ? " " : "") + text;
    else if (!cur.options.length) cur.q += " " + line;
  }
  return out.filter((c) => c.options.length >= 2 && c.correct >= 0);
}

// Blok s formulo v rešenem primeru: vrstice med »:::formula« in »:::«.
// V aplikaciji je skrit za gumbom »Pokaži formulo« (učenec najprej poskusi sam),
// v PDF-ju je izpisan kot okvir »Formula«, tutor ga dobi kot navadno besedilo.
const FORMULA_RE = /^[ \t]*:::[ \t]*formula[ \t]*\n([\s\S]*?)\n[ \t]*:::[ \t]*$/gm;
export function expandFormulaBlocks(md, mode = "html") {
  return expandThinkBlocks(md, mode).replace(SYMBOLS_BLOCK_RE, "").replace(FORMULA_RE, (_, body) => {
    const inner = body.trim();
    if (mode === "plain") return inner;
    if (mode === "print") return `<div class="formula"><p class="formula-label">Formula</p>\n\n${inner}\n\n</div>`;
    return `<details class="tb-formula"><summary>Pokaži formulo</summary>\n\n${inner}\n\n</details>`;
  });
}
// Rešitev rešenega primera (od »**Rešitev:**« do naslednjega naslova ali vprašanja »Premisli«) je v
// aplikaciji skrita za gumbom »Pokaži rešitev«, da učenec najprej poskusi sam (j, 1. 11. 2026). Samo v
// načinu html. »Premisli« na koncu razdelka (v 270 lekcijah) ostane viden pod gumbom, ne v rešitvi.
const SOLUTION_RE = /^\*\*Rešitev:\*\*[ \t]*([^\n]*)\n([\s\S]*?)(?=^#{2,3}[ \t]|^[ \t]*<div class="tb-think">|(?![\s\S]))/gm;
export function hideSolutions(md) {
  return String(md ?? "").replace(SOLUTION_RE, (_, first, body) => {
    const inner = `${first.trim()}\n\n${body.trim()}`.trim();
    return `<details class="tb-solution"><summary>Pokaži rešitev</summary>\n\n${inner}\n\n</details>\n\n`;
  });
}
// Vmesno vprašanje v razlagi (»Premisli«): vprašanje, vrstica »---«, odgovor.
//   :::premisli
//   Kaj se zgodi z gostoto, če kocko prerežemo na pol?
//   ---
//   Ostane enaka: masa in prostornina se razpolovita.
//   :::
// V aplikaciji je odgovor skrit za gumbom (učenec najprej odgovori v mislih).
const THINK_RE = /^[ \t]*:::[ \t]*premisli[ \t]*\n([\s\S]*?)\n[ \t]*:::[ \t]*$/gm;
export function expandThinkBlocks(md, mode = "html") {
  return String(md ?? "").replace(THINK_RE, (_, body) => {
    const [q, ...rest] = body.split(/^[ \t]*---[ \t]*$/m);
    const question = q.trim();
    const answer = rest.join("\n").trim();
    if (mode === "plain") return `Vprašanje: ${question}${answer ? `\nOdgovor: ${answer}` : ""}`;
    if (mode === "print") return `<div class="think"><p class="think-label">Premisli</p>\n\n${question}\n\n${answer ? `*Odgovor:* ${answer}\n\n` : ""}</div>`;
    return `<div class="tb-think"><p class="tb-think-label">Premisli</p>\n\n${question}\n\n${
      answer ? `<details><summary>Pokaži odgovor</summary>\n\n${answer}\n\n</details>` : ""
    }</div>`;
  });
}
const withFormulas = (parts, mode) =>
  parts.map((x) => ({ ...x, md: mode === "html" ? hideSolutions(expandFormulaBlocks(x.md, mode)) : expandFormulaBlocks(x.md, mode) }));

function lessonFile(topicId) {
  const [pathKey, slug] = topicId.split("/");
  if (!/^[A-Z]+-[A-Z]+-[A-Z0-9]+$/.test(pathKey) || !/^[a-z0-9-]+$/.test(slug || "")) return null;
  return path.join(LESSONS_DIR, pathKey, `${slug}.md`);
}

const cache = new Map(); // datoteka -> { mtime, lesson }

// Lekcija teme. Fakultetna tema, ki se ponovi v več predmetih (enak naslov in
// predmet), ima eno lekcijo: če je ni v mapi tega predmeta, vzamemo prvo, ki obstaja.
export function loadLesson(topicId) {
  const t = getTopic(topicId);
  // Regijska tema: lekcija prve osnovne teme, ki jo ima.
  if (t?.base) {
    for (const id of t.base) {
      const l = loadLesson(id);
      if (l) return l;
    }
    return null;
  }
  const own = readLesson(lessonFile(topicId));
  if (own !== null || !t) return own;
  for (const id of sameTopics(topicId)) {
    if (id === topicId) continue;
    const l = readLesson(lessonFile(id));
    if (l) return l;
  }
  return null;
}

function readLesson(file) {
  if (!file) return null;
  let st;
  try {
    st = fs.statSync(file);
  } catch {
    cache.delete(file);
    return null;
  }
  const hit = cache.get(file);
  if (hit && hit.mtime === st.mtimeMs) return hit.lesson;
  const lesson = parseLesson(fs.readFileSync(file, "utf8"));
  cache.set(file, { mtime: st.mtimeMs, lesson });
  return lesson;
}

// Vnaprej pripravljena razlaga teme (pri regijski temi prve osnovne teme, ki jo ima).
export function explanationFor(topicId) {
  for (const id of baseTopicIds(topicId)) {
    const e = getExplanation(id)?.text;
    if (e) return e;
  }
  return null;
}

// Vse, kar potrebuje stran lekcije.
export function lessonView(topicId) {
  const t = getTopic(topicId);
  if (!t) return null;
  const lesson = loadLesson(topicId);
  const demos = simsFor(topicId, lesson);
  const order = topicOrder(t.path);
  const i = order.findIndex((x) => x.id === topicId);
  const nav = (x) => (x ? { id: x.id, name: x.name } : null);
  return {
    id: t.id,
    name: t.name,
    goals: t.goals,
    unit: t.unit,
    path: t.path,
    pathLabel: getPath(t.path).label,
    subject: t.subject,
    lesson: lesson
      ? {
          status: lesson.meta.stanje || "osnutek",
          sections: withFormulas(lesson.sections, "html"),
          alternatives: withFormulas(lesson.alternatives, "html"),
          checks: lesson.checks,
          symbols: lesson.symbols,
        }
      : null,
    // Če lekcije še ni, pokažemo vsaj kratko razlago teme (če obstaja).
    explanation: lesson ? null : explanationFor(topicId),
    demos,
    demo: demos[0] || null,
    practice: hasGenerator(topicId),
    prev: nav(order[i - 1]),
    next: nav(order[i + 1]),
  };
}

// Učbeniki: za vsak predmet in vsako raven svoj učbenik (npr. MAT-OS = matematika
// za osnovno šolo, vsi razredi). Nove poti (npr. univerzitetne) se samodejno
// pridružijo; ime predmeta in ravni dopolni v SUBJECT_NAMES / SCHOOL_NAMES.
export { SUBJECT_NAMES };
export const SCHOOL_NAMES = { OS: "osnovna šola", SS: "srednja šola", TEK: "tekmovanja in olimpijade" };
const SCHOOL_ORDER = ["OS", "SS", "TEK"];
const subjectName = (p) => SUBJECT_NAMES[p.subject] || p.label.split(",")[0].trim();
const schoolName = (school) => SCHOOL_NAMES[school] || school;

// Študijski program (fakulteta): en učbenik, deli so predmeti programa po letnikih.
function programBook(programId) {
  const prog = getProgram(programId);
  if (!prog) return null;
  const paths = listProgramPaths(programId).map((p) => ({
    key: p.key,
    label: `${p.elective ? "Izbirni predmet" : `${p.year}. letnik`}: ${p.label}`,
    group: p.elective ? "Izbirni predmeti" : `${p.year}. letnik`,
  }));
  const topics = paths.flatMap((p) => topicOrder(p.key));
  return {
    key: `P-${programId}`,
    subject: "PROG",
    school: "UNI",
    subjectName: prog.label || prog.name,
    schoolName: "študijski program",
    paths,
    label: prog.label || prog.name,
    topics: topics.length,
    lessons: topics.filter((t) => loadLesson(t.id)).length,
  };
}

export function listBooks({ program, system = "SI" } = {}) {
  const prog = program ? programBook(program) : null;
  return prog ? [prog, ...schoolBooks(system)] : schoolBooks(system);
}

// Regijski sistem (public/regions.js) ima svoje učbenike: po en na predmet (npr. MAT-IN, FIZ-INT).
function schoolBooks(system = "SI") {
  const regional = isRegional(system);
  const all = listPaths(undefined, system);
  const books = new Map();
  for (const p of all) {
    const key = `${p.subject}-${p.school}`;
    if (!books.has(key))
      books.set(key, {
        key,
        subject: p.subject,
        school: p.school,
        subjectName: regional ? SUBJECT_EN[p.subject] || subjectName(p) : subjectName(p),
        schoolName: regional ? SCHOOL_SYSTEMS[system].name : schoolName(p.school),
        paths: [],
      });
    books.get(key).paths.push({ key: p.key, label: p.label });
  }
  const rank = (s) => (SCHOOL_ORDER.includes(s) ? SCHOOL_ORDER.indexOf(s) : SCHOOL_ORDER.length);
  const subjects = [...new Set(all.map((p) => p.subject))];
  return [...books.values()]
    .sort((a, b) => subjects.indexOf(a.subject) - subjects.indexOf(b.subject) || rank(a.school) - rank(b.school))
    .map((b) => {
      const topics = b.paths.flatMap((p) => topicOrder(p.key));
      return {
        ...b,
        label: `${b.subjectName} · ${b.schoolName}`,
        topics: topics.length,
        lessons: topics.filter((t) => loadLesson(t.id)).length,
        formulas: !!formulaSheet(b.key),
      };
    });
}

// Formule in konstante predmeta: content/formulas/<učbenik>.md (npr. MAT-OS.md).
export const FORMULAS_DIR = process.env.EVKLID_FORMULAS || path.join(here, "..", "content", "formulas");
export function formulaSheet(bookKey) {
  if (!/^[A-Z]+-[A-Z]+$/.test(bookKey || "")) return null;
  try {
    return fs.readFileSync(path.join(FORMULAS_DIR, `${bookKey}.md`), "utf8");
  } catch {
    return null;
  }
}

// Vsak razdelek lista (## …) ima lahko svoj skrit blok :::simboli: pomen črk v tem razdelku
// (pri »Številih« je a poljubno število, pri kvadratni enačbi vodilni koeficient). Bloki se ne izpišejo.
export function formulaSheetSections(bookKey) {
  const raw = formulaSheet(bookKey);
  if (!raw) return null;
  const sections = raw
    .split(/^(?=## )/m)
    .map((part) => {
      const symbols = [];
      const md = part.replace(SYMBOLS_BLOCK_RE, (_, block) => (symbols.push(...parseSymbolsBlock(block).list), "")).trim();
      return { md, symbols };
    })
    .filter((x) => x.md);
  return { md: sections.map((x) => x.md).join("\n\n"), sections };
}

export function getBook(bookKey, system = "SI") {
  if (String(bookKey).startsWith("P-")) return programBook(String(bookKey).slice(2));
  // Regijski učbenik brez podanega sistema (npr. povezava za PDF): vzamemo tipičen sistem učnega načrta.
  for (const sys of [system, "SI", "IN-CBSE", "INTL"]) {
    const b = schoolBooks(sys).find((x) => x.key === bookKey);
    if (b) return b;
  }
  return null;
}

// Kazalo celega učbenika: deli = razredi oziroma letniki.
export function bookView(bookKey, system = "SI") {
  const b = getBook(bookKey, system);
  if (!b) return null;
  // group: letnik pri študijskem programu (več predmetov skupaj), sicer vsak del zase.
  return { ...b, parts: b.paths.map((p) => ({ ...tocView(p.key), group: p.group || null })) };
}

// Kazalo poti: sklopi in teme z oznakami, kaj je na voljo.
export function tocView(pathKey) {
  const p = getPath(pathKey);
  if (!p) return null;
  return {
    key: p.key,
    label: p.label,
    subject: p.subject,
    units: p.units.map((u) => ({
      title: u.title,
      topics: u.topics.map((t) => ({
        id: t.id,
        name: t.name,
        lesson: !!loadLesson(t.id),
        demo: simsFor(t.id).length > 0,
        practice: hasGenerator(t.id),
      })),
    })),
  };
}

const fold = (s) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

// Iskanje po naslovih, ciljih in besedilu lekcij. Brez stroškov, brez indeksa:
// tem je nekaj sto, zato preprosto preletimo vse.
export function searchTextbook(q, { subject, limit = 30, system = "SI" } = {}) {
  const words = fold(q).split(/[^a-z0-9]+/).filter((w) => w.length >= 2);
  if (!words.length) return [];
  const hits = [];
  for (const p of listPaths(subject, system)) {
    for (const t of topicOrder(p.key)) {
      const lesson = loadLesson(t.id);
      const title = fold(t.name);
      const meta = fold(`${t.goals} ${t.unit} ${simsFor(t.id, lesson).map((d) => d.title).join(" ")}`);
      const text = lesson ? fold([...lesson.sections, ...lesson.alternatives].map((s) => `${s.title} ${s.md}`).join(" ")) : "";
      let score = 0;
      for (const w of words) {
        const s = (title.includes(w) ? 10 : 0) + (meta.includes(w) ? 4 : 0) + (text.includes(w) ? 1 : 0);
        if (!s) {
          score = 0;
          break;
        }
        score += s;
      }
      if (!score) continue;
      if (lesson) score += 1;
      hits.push({ id: t.id, name: t.name, unit: t.unit, path: p.key, pathLabel: p.label, subject: p.subject, lesson: !!lesson, snippet: snippet(lesson, words), score });
    }
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, limit).map(({ score, ...h }) => h);
}

function snippet(lesson, words) {
  if (!lesson) return "";
  const plain = lesson.sections
    .map((s) => s.md)
    .join(" ")
    .replace(/\$([^$]*)\$/g, (_, t) => t.replace(/\\(mathrm|text|,)/g, "").replace(/[{}\\]/g, ""))
    .replace(/[#*_>`|]/g, "")
    .replace(/\s+/g, " ");
  const f = fold(plain);
  const at = Math.min(...words.map((w) => f.indexOf(w)).filter((i) => i >= 0));
  if (!Number.isFinite(at)) return "";
  const start = Math.max(0, at - 50);
  return (start ? "…" : "") + plain.slice(start, start + 140).trim() + "…";
}

// Razlaga teme iz lekcije, kadar vnaprej pripravljene razlage (explanations.json) ni:
// »Zakaj se tega učimo« in »Povzetek« ter napotek na celotno lekcijo.
export function lessonExplanation(topicId) {
  const lesson = loadLesson(topicId);
  if (!lesson) return null;
  const pick = (re) => expandFormulaBlocks(lesson.sections.find((s) => re.test(s.title))?.md ?? "", "html").trim();
  const why = pick(/^zakaj/i);
  const sum = pick(/^povzetek/i);
  if (!why && !sum) return null;
  return [why, sum ? `### Bistvo\n${sum}` : "", "*Celotna lekcija z rešenimi primeri in vprašanji je pod gumbom »Lekcija«.*"]
    .filter(Boolean)
    .join("\n\n");
}

// Oznake lekcije (:::simboli) za razlago teme in »Bistvo« zunaj učbenika (kartica ob temi, naloge).
export function lessonSymbols(topicId) {
  const list = loadLesson(topicId)?.symbols;
  return list?.length ? list : null;
}

// Kratek povzetek lekcije za sistemski prompt tutorja (če lekcija obstaja),
// da tutor razlaga skladno z učbenikom.
export function lessonSummaryForPrompt(topicId) {
  const lesson = loadLesson(topicId);
  if (!lesson) return "";
  const sum = lesson.sections.find((s) => /^povzetek/i.test(s.title));
  if (!sum) return "";
  return `Učenec ima v učbeniku lekcijo o tej temi. Njen povzetek (razlagaj skladno z njim, a z drugimi besedami in primeri):\n${expandFormulaBlocks(sum.md, "plain").slice(0, 1200)}`;
}

// Preverjanje oblike lekcije učbenika (content/lessons/README.md).
// Uporabljata ga scripts/check-lesson.js in testi.
import katex from "katex";
import { parseLesson, expandFormulaBlocks } from "./textbook.js";
import { getTopic } from "./curriculum.js";
import { checkArithmetic } from "./lesson-math.js";
import { checkIdentities } from "./lesson-identity.js";
import { SYMBOLS_BLOCK_RE, parseSymbolsBlock, symbolsIn, SYMBOLS, SUBJECT_TABLES } from "../public/formula-data.js";

const REQUIRED = [
  [/^zakaj/i, "Zakaj se tega učimo"],
  [/^razlag/i, "Razlaga"],
  [/^rešen/i, "Rešeni primeri"],
  [/^pogoste/i, "Pogoste napake"],
  [/^povzetek/i, "Povzetek"],
];

// Vrne { errors, warnings } za vir lekcije. topicId je neobvezen (preveri obstoj teme).
const STOCK_PHRASES = [/\bV tej lekciji\b/, /\bse bomo naučili\b/, /\bPoglejmo si\b/, /\bKot vemo\b/, /\bKot vidimo\b/];

export function checkLessonSource(src, topicId) {
  const errors = [];
  const warnings = [];
  const err = (m) => errors.push(m);
  const warn = (m) => warnings.push(m);

  if (topicId && !getTopic(topicId)) err(`tema ${topicId} ne obstaja v server/curriculum-data.js`);
  const lesson = parseLesson(src);
  const { meta, sections, alternatives, checks } = lesson;

  if (!meta.stanje) err("v glavi manjka »stanje: osnutek« ali »stanje: pregledano«");
  else if (!/^(osnutek|pregledano)$/.test(meta.stanje)) err(`stanje »${meta.stanje}« ni osnutek ali pregledano`);
  if (/opus|sonnet|haiku|fable|claude|gpt/i.test(meta.avtor || "")) err("v glavi ne navajaj imena modela, piši »avtor: AI«");

  for (const [re, name] of REQUIRED) if (!sections.some((s) => re.test(s.title))) err(`manjka razdelek »## ${name}«`);
  if (alternatives.length < 2) err(`premalo razdelkov »## Drugače: …« (${alternatives.length}, vsaj 2)`);

  // Fakultetna zgradba (j 2026-11-04, po primerjavi s preteklimi izpiti): razdelek »Za izpit« z
  // 2–3 izpitnimi nalogami, katerih »**Rešitev:**« je skrita za gumbom, »Uporaba v stroki« namesto šolskega »Iz vsakdanjega življenja«.
  // Opozorilo, ne napaka, dokler starejših fakultetnih lekcij ne predelamo.
  const uni = /^UNI-/.test(topicId || "");
  if (uni) {
    const exam = sections.find((s) => /^za izpit/i.test(s.title));
    if (!exam) warn("fakultetna lekcija: manjka razdelek »## Za izpit« (kaj moraš znati povedati + 2–3 izpitne naloge s skrito rešitvijo)");
    else {
      const tasks = exam.md.split(/^### +/m).slice(1);
      if (tasks.length < 2) warn(`»Za izpit«: potrebni sta vsaj 2 nalogi z naslovom »### Naloga …« (${tasks.length})`);
      const open = tasks.filter((t) => !/^\*\*Rešitev:\*\*/m.test(t)).length;
      if (open) warn(`»Za izpit«: ${open} nalog nima celotne rešitve za »**Rešitev:**« (v aplikaciji skrita za gumbom)`);
    }
    if (alternatives.some((a) => /vsakdanjega/i.test(a.title))) warn("fakultetna lekcija: namesto »Drugače: Iz vsakdanjega življenja« napiši »Drugače: Uporaba v stroki«");
  }

  // Rešeni primeri: vsak ### Primer ima Podatki, Iščemo in blok :::formula.
  const ex = sections.find((s) => /^rešen/i.test(s.title));
  if (ex) {
    const examples = ex.md.split(/^### +/m).slice(1);
    if (examples.length < 2) err(`v »Rešeni primeri« sta potrebna vsaj 2 primera z naslovom »### Primer …« (${examples.length})`);
    for (const e of examples) {
      const title = e.split("\n")[0].trim();
      if (!/\*\*Podatki:?\*\*/.test(e)) err(`primer »${title}«: manjka vrstica »**Podatki:** …« z vsemi podatki iz besedila`);
      if (!/\*\*Iščemo:?\*\*/.test(e)) err(`primer »${title}«: manjka vrstica »**Iščemo:** …«`);
      if (!/^[ \t]*:::[ \t]*formula[ \t]*$/m.test(e)) err(`primer »${title}«: manjka blok »:::formula … :::« s formulo ali pravilom`);
      if (!/\*\*Rešitev:?\*\*/.test(e)) warn(`primer »${title}«: ni oznake »**Rešitev:**«`);
    }
  }

  // Bloki s formulo morajo biti zaprti.
  const body = src.replace(/^---\n[\s\S]*?\n---\n?/, "");
  const stripped = expandFormulaBlocks(body, "plain");
  if (/^[ \t]*:::/m.test(stripped)) err("nezaprt ali napačno zapisan blok »:::formula … :::« ali »:::premisli … :::« (vsak začetek in konec v svoji vrstici)");
  // Merila docs/kakovost.md §1: vmesna vprašanja v razlagi in razlaga vsakega napačnega odgovora.
  const thinks = body.match(/^[ \t]*:::[ \t]*premisli[ \t]*$/gm) || [];
  if (thinks.length < 2) warn(`v razlagi sta priporočeni 2 vmesni vprašanji »:::premisli« (${thinks.length})`);
  const noWhy = checks.reduce((n, c) => n + c.options.filter((_, i) => i !== c.correct && !c.optionWhy?.[i]).length, 0);
  if (checks.length && noWhy) warn(`${noWhy} napačnih možnosti v »Preveri se« nima razlage »~ …«`);

  // Kviz: vsako vprašanje natanko en »+«, vsaj 3 možnosti, brez ponavljanja.
  const quizMd = body.split(/^## +/m).find((p) => /^preveri se/i.test(p)) || "";
  const qs = [];
  for (const raw of quizMd.split("\n").slice(1)) {
    const line = raw.trim();
    if (!line) continue;
    if (line[0] === "?") qs.push({ q: line.slice(1).trim(), plus: 0, opts: [] });
    else if (!qs.length) continue;
    else if (line[0] === "+" || line[0] === "-") {
      const cur = qs[qs.length - 1];
      if (line[0] === "+") cur.plus++;
      cur.opts.push(line.slice(1).trim().replace(/\s+/g, " ").toLowerCase());
    }
  }
  if (qs.length < 3) err(`v »Preveri se« so potrebna vsaj 3 vprašanja (${qs.length})`);
  qs.forEach((q, i) => {
    const n = i + 1;
    if (q.plus !== 1) err(`vprašanje ${n}: natanko en pravilen odgovor »+« (zdaj ${q.plus})`);
    if (q.opts.length < 3) err(`vprašanje ${n}: vsaj 3 možnosti (zdaj ${q.opts.length})`);
    if (new Set(q.opts).size !== q.opts.length) err(`vprašanje ${n}: možnosti se ponavljajo`);
    if (q.opts.some((o) => !o)) err(`vprašanje ${n}: prazna možnost`);
  });
  if (checks.length !== qs.length) err("nekaterih vprašanj v »Preveri se« ni mogoče prebrati (oblika ? - + >)");

  // LaTeX: vsaka formula se mora izrisati, $ v vrstici v parih.
  const lines = body.split("\n");
  lines.forEach((line, i) => {
    const n = (line.replace(/\\\$/g, "").match(/\$/g) || []).length;
    if (n % 2) err(`vrstica ${i + 1}: liho število znakov $ (${n})`);
  });
  const texs = [];
  body.replace(/\$\$([\s\S]+?)\$\$/g, (_, t) => (texs.push([t, true]), ""));
  body.replace(/\$\$[\s\S]+?\$\$/g, "").replace(/(^|[^\\$])\$([^$\n]+?)\$/g, (_, p, t) => (texs.push([t, false]), ""));
  for (const [tex, display] of texs) {
    try {
      katex.renderToString(tex, { displayMode: display, throwOnError: true, strict: "ignore" });
    } catch (e) {
      err(`formula se ne izriše: $${tex.slice(0, 60)}$ (${String(e.message).split("\n")[0].slice(0, 80)})`);
    }
  }
  // Računi: čisto številske korake preračuna sam (docs/kakovost.md §1.1); razlika nad 2 % je napaka, manjša opozorilo.
  const calc = checkArithmetic(body);
  const fmOffset = src.split("\n").length - body.split("\n").length; // vrstice glave
  for (const m of calc.mismatches) {
    (m.rel > 0.02 ? err : warn)(`vrstica ${m.line + fmOffset}: račun se ne ujema: $${m.tex}$ (${m.left} ≠ ${m.right})`);
  }
  // Enačbe z neznankami (identitete, :::simboli, odgovori kviza): naključna števila v vse strani (j, 1. 11. 2026).
  const ids = checkIdentities(body);
  for (const m of ids.mismatches) err(`vrstica ${m.line + fmOffset}: enakost ne velja za vse vrednosti: $${m.tex}$ (${m.left} ≠ ${m.right}); če je to enačba ali pogoj, to napiši v isti vrstici (»enačba«, »če je …«)`);
  checkSymbols(body, err, warn);
  if (/\bPhET\b/.test(body)) err("v besedilu ne omenjaj PhET; napiši »interaktivna simulacija spodaj«");
  if (/\.{3}\s*$/m.test(body.replace(/\$[^$]*\$/g, ""))) warn("vrstica se konča s »...« (nedokončano besedilo?)");

  const words = body.replace(SYMBOLS_BLOCK_RE, "").replace(/\$[^$]*\$/g, " ").split(/\s+/).filter(Boolean).length;
  // Šablonski stavki naredijo lekcije enolične (j, 29. 10. 2026: lekcije ne smejo biti monotone).
  const stock = STOCK_PHRASES.filter((re) => re.test(body)).map((re) => `»${re.source.replace(/\\b|\\s\+/g, " ").trim()}«`);
  if (stock.length) warn(`šablonski stavek ${stock.join(", ")}: začni s situacijo, vprašanjem ali poskusom`);
  const goal = /^UNI-/.test(topicId || "") ? "1800–3000" : "1300–2300"; // fakultetne imajo še »Za izpit«
  if (words < 800) warn(`lekcija je kratka (${words} besed, cilj ${goal})`);
  if (words > (goal === "1300–2300" ? 2800 : 3500)) warn(`lekcija je dolga (${words} besed, cilj ${goal})`);
  return { errors, warnings, words, examples: ex ? ex.md.split(/^### +/m).length - 1 : 0, questions: qs.length, calcChecked: calc.checked, identitiesChecked: ids.checked };
}

// Oznake lekcije (:::simboli, content/lessons/README.md): vsaka vrstica se razbere in izriše,
// vsaka oznaka iz izpostavljenih formul ($$…$$ in :::formula) ima svojo vrstico.
const DISPLAY_FORMULA_RE = /^[ \t]*:::[ \t]*formula[ \t]*\n([\s\S]*?)\n[ \t]*:::[ \t]*$/gm;
const ALWAYS_KNOWN = new Set(["π"]);
export function checkSymbols(body, err, warn) {
  const blocks = [...body.matchAll(SYMBOLS_BLOCK_RE)];
  const keys = new Set();
  for (const [, block] of blocks) {
    const { list, errors } = parseSymbolsBlock(block);
    for (const e of errors) err(`:::simboli: ${e}`);
    for (const g of list) {
      for (const [what, tex] of [["oznaka", g.tex.join(", ")], ["zveza", g.r], ["enota", g.u && !/^(–|-|—|1|brez)$/.test(g.u) ? `\\mathrm{${g.u}}` : ""]]) {
        if (!tex) continue;
        try {
          katex.renderToString(tex, { throwOnError: true, strict: "ignore" });
        } catch (e) {
          err(`:::simboli: ${what} »${tex.slice(0, 40)}« se ne izriše (${String(e.message).split("\n")[0].slice(0, 60)})`);
        }
      }
      if (/\\[a-zA-Z]|[_^]\{/.test(`${g.n} ${g.note}`.replace(/\$[^$]*\$/g, ""))) warn(`:::simboli: ime ali opomba pri »${g.tex.join(", ")}« ima TeX brez $…$ (na kartici bi se izpisal surov)`);
      g.keys.forEach((k) => keys.add(k));
    }
  }
  if (blocks.length > 1) warn("več blokov »:::simboli«; združi jih v enega na koncu lekcije");
  const text = body.replace(SYMBOLS_BLOCK_RE, "");
  const display = [];
  text.replace(/\$\$([\s\S]+?)\$\$/g, (_, t) => (display.push(t), ""));
  text.replace(DISPLAY_FORMULA_RE, (_, f) => (f.replace(/\$\$?([^$]+?)\$\$?/g, (__, t) => (display.push(t), "")), ""));
  const used = new Set();
  const missing = new Set();
  const inner = (k) => /^\w+\((.+)\)/.exec(k)?.[1]; // bar(x) → x
  const covered = (k) => covered1(k) || covered1(k.replace(/'/g, "")); // v'_1 brez lastne vrstice = pomen v
  const covered1 = (k) => keys.has(k) || keys.has(k.split("_")[0]) || (k[0] === "Δ" && keys.has(k.slice(1).split("_")[0])) || keys.has(inner(k));
  for (const tex of display) {
    for (const [k] of symbolsIn(tex, "@*")) if (!covered(k) && !ALWAYS_KNOWN.has(k)) missing.add(k);
  }
  const all = [];
  text.replace(/\$\$?([^$]+?)\$\$?/g, (_, t) => (all.push(t), ""));
  for (const tex of all) for (const [k] of symbolsIn(tex, "@*")) { used.add(k); used.add(k.split("_")[0]); if (k[0] === "Δ") used.add(k.slice(1).split("_")[0]); if (inner(k)) used.add(inner(k)).add(k.replace(/^\w+\((.+?)\)/, "$1")); }
  if (missing.size) {
    const list = [...missing];
    warn(`${list.length} oznak v formulah nima vrstice v »:::simboli«: ${list.slice(0, 12).join(", ")}${list.length > 12 ? " …" : ""}`);
  }
  const rawUsed = (k) => { // \mathrm{SE}, \mathrm{pH}, \mathrm{p}K_a
    const b = k.replace(/^Δ/, "").split("_")[0];
    return text.includes(`{${b}}`) || (b.length > 1 && text.includes(`{${b.slice(0, -1)}}${b.slice(-1)}`));
  };
  const unused = [...keys].filter((k) => !used.has(k) && !rawUsed(k));
  if (unused.length) warn(`:::simboli: oznake ${unused.slice(0, 8).join(", ")} ni v nobeni formuli lekcije`);
}

// Pomen črke iz drugega predmeta (c = »hitrost svetlobe« v matematiki, j 1. 11. 2026): ime vrstice je
// enako pomenu iste črke v slovarju drugega predmeta, v slovarju lastnega predmeta pa ga ni.
// Samo za liste s formulami: v lekciji je t = »čas« pri besedilni nalogi iz matematike pravilen.
const normName = (x) => String(x || "").toLowerCase().replace(/\(.*?\)/g, "").replace(/\s+/g, " ").trim();
export function foreignMeanings(list, subject) {
  const own = new Set(SUBJECT_TABLES[subject] || [subject]);
  const out = [];
  for (const g of list) {
    for (const k of g.keys) {
      const name = normName(g.n);
      const names = (tb) => [].concat(SYMBOLS[tb]?.[k] || []).map((e) => normName(e.n));
      if ([...own].some((tb) => names(tb).includes(name))) continue;
      const other = Object.keys(SYMBOLS).find((tb) => !own.has(tb) && names(tb).includes(name));
      if (other) out.push(`»${k}« je »${g.n}«, kar je pomen iz predmeta ${other}, ne ${subject}`);
    }
  }
  return out;
}

// List s formulami (content/formulas/<PREDMET>-<STOPNJA>.md): vsak razdelek »## …« ima svoj blok
// :::simboli in v njem vrstico za vsako črko iz formul razdelka, s pomenom iz tega predmeta.
export function checkFormulaSheet(raw, subject) {
  const problems = [];
  for (const part of String(raw).split(/^(?=## )/m)) {
    const title = /^## +(.+)/.exec(part)?.[1]?.trim() || "(uvod)";
    const blocks = [...part.matchAll(SYMBOLS_BLOCK_RE)];
    const text = part.replace(SYMBOLS_BLOCK_RE, "");
    const formulas = [];
    text.replace(/\$\$?([^$]+?)\$\$?/g, (_, t) => (formulas.push(t), ""));
    if (!formulas.length) continue;
    if (blocks.length !== 1) { problems.push(`${title}: ${blocks.length ? "več blokov" : "ni bloka"} »:::simboli«`); if (!blocks.length) continue; }
    const { list, errors } = parseSymbolsBlock(blocks[0][1]);
    errors.forEach((e) => problems.push(`${title}: ${e}`));
    const keys = new Set(list.flatMap((g) => g.keys));
    const inner = (k) => /^\w+\((.+)\)/.exec(k)?.[1];
    const has = (k) => keys.has(k) || keys.has(k.replace(/'/g, "")) || keys.has(k.split("_")[0]) || (k[0] === "Δ" && keys.has(k.slice(1).split("_")[0])) || keys.has(inner(k));
    const missing = new Set();
    for (const f of formulas) for (const [k] of symbolsIn(f, "@*")) if (!has(k) && !ALWAYS_KNOWN.has(k)) missing.add(k);
    if (missing.size) problems.push(`${title}: brez vrstice: ${[...missing].join(", ")}`);
    // Fizika in kemija si pomene delita (T, Q, c); tuj pomen je napaka le na listu iz matematike.
    if (subject === "MAT") foreignMeanings(list, subject).forEach((f) => problems.push(`${title}: ${f}`));
  }
  return problems;
}

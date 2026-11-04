// Učbenik za tiskanje oziroma shranjevanje kot PDF (brezplačno, brez prijave).
// Strežnik izriše HTML z že izrisanimi formulami; brskalnik ga shrani kot PDF.
import katex from "katex";
import { marked } from "marked";
import { getPath, getTopic, topicOrder } from "./curriculum.js";
import { loadLesson, simsFor, expandFormulaBlocks, getBook, formulaSheetSections } from "./textbook.js";
import { splitFormulaCells } from "../public/rich.js";

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// Enako kot renderRich v brskalniku: formule umaknemo, izrišemo Markdown, vrnemo formule.
// Vsebina prihaja iz datotek v repozitoriju, zato je ne čistimo dodatno.
export function renderMd(text) {
  const math = [];
  const stash = (tex, display) => `@@MATH${math.push({ tex, display }) - 1}@@`;
  const src = expandFormulaBlocks(text, "print")
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, t) => stash(t, true))
    .replace(/(^|[^\\$])\$([^$\n]+?)\$/g, (_, pre, t) => pre + stash(t, false));
  return marked
    .parse(splitFormulaCells(src, math), { breaks: true })
    .replace(/@@MATH(\d+)@@/g, (_, i) => katex.renderToString(math[i].tex, { displayMode: math[i].display, throwOnError: false, strict: "ignore" }));
}

const demoFor = (topicId, lesson) => simsFor(topicId, lesson)[0] || null;

function lessonHtml(t, lesson, n) {
  const demo = demoFor(t.id, lesson);
  const sections = lesson.sections
    .map((s) => {
      const body = `<section>${s.title ? `<h3>${esc(s.title)}</h3>` : ""}${renderMd(s.md)}</section>`;
      const note =
        demo && /rešen/i.test(s.title)
          ? `<aside class="demo-note">Interaktivni poskus »${esc(demo.title)}« je na voljo v aplikaciji Evklid.</aside>`
          : "";
      return body + note;
    })
    .join("");
  const alts = lesson.alternatives.length
    ? `<section class="alts"><h3>Razloži drugače</h3>${lesson.alternatives
        .map((a) => `<div class="alt"><h4>${esc(a.title)}</h4>${renderMd(a.md)}</div>`)
        .join("")}</section>`
    : "";
  const letters = "abcdefgh";
  const checks = lesson.checks.length
    ? `<section class="checks"><h3>Preveri se</h3><ol>${lesson.checks
        .map((c) => `<li>${renderMd(c.q)}<ol class="opts">${c.options.map((o) => `<li>${renderMd(o)}</li>`).join("")}</ol></li>`)
        .join("")}</ol>
        <details open class="key"><summary>Rešitve</summary><ol>${lesson.checks
          .map((c) => `<li><b>${letters[c.correct]})</b> ${c.why ? renderMd(c.why) : ""}</li>`)
          .join("")}</ol></details></section>`
    : "";
  return `<article class="lesson" id="${esc(t.id)}">
    <p class="crumb">${esc(t.unit)}</p>
    <h2>${n ? `${n}. ` : ""}${esc(t.name)}</h2>
    ${t.goals ? `<p class="goals"><b>Cilji:</b> ${esc(t.goals)}</p>` : ""}
    ${sections}${alts}${checks}
  </article>`;
}

const today = () => new Date().toLocaleDateString("sl-SI", { day: "numeric", month: "long", year: "numeric" });
const NOTE = `<p class="muted small">Interaktivni poskusi, simulacije, sprotno preverjanje in vaje so na voljo v aplikaciji Evklid.
        Lekcije z oznako osnutek še pregleduje učitelj.</p>`;

// Celoten učbenik predmeta (npr. MAT-OS): deli so razredi oziroma letniki.
export function printBook(bookKey) {
  const book = getBook(bookKey);
  if (!book) return null;
  let n = 0;
  const parts = book.paths.map((p) => {
    const topics = topicOrder(p.key);
    const ready = topics.map((t) => ({ t, lesson: loadLesson(t.id) })).filter((x) => x.lesson);
    return { p, topics, ready };
  });
  const total = parts.reduce((s, x) => s + x.topics.length, 0);
  const have = parts.reduce((s, x) => s + x.ready.length, 0);
  const cover = `<section class="cover">
        <p class="brand">Evkli<span>d</span></p>
        <h1>${esc(book.subjectName)}</h1>
        <p class="sub">Učbenik za ${esc(book.schoolName)}: razlage, rešeni primeri in vprašanja za preverjanje</p>
        <p class="muted">Izdaja ${esc(today())} · ${have} od ${total} tem${have < total ? " (ostale lekcije so v pripravi)" : ""}</p>
        <h2>Kazalo</h2>
        ${parts
          .filter((x) => x.ready.length)
          .map(
            ({ p, ready }) => `<h3 class="toc-part">${esc(p.label)}</h3>
        <ol class="toc">${ready.map(({ t }) => `<li><a href="#${esc(t.id)}">${esc(t.name)}</a> ${t.unit && t.unit !== t.name ? `<span class="muted">${esc(t.unit)}</span>` : ""}</li>`).join("")}</ol>`,
          )
          .join("")}
        ${NOTE}
      </section>`;
  const body = have
    ? parts
        .filter((x) => x.ready.length)
        .map(({ p, ready }) => {
          n = 0;
          return `<section class="part"><p class="brand small">${esc(book.subjectName)}</p><h1>${esc(p.label)}</h1>
            <p class="muted">${ready.length} lekcij</p></section>${ready.map(({ t, lesson }) => lessonHtml(t, lesson, ++n)).join("")}`;
        })
        .join("")
    : `<p>Za ta učbenik lekcije še nastajajo.</p>`;
  return shell(`${book.subjectName} · ${book.schoolName} · učbenik`, cover + body);
}

// List s formulami in konstantami predmeta (/ucbenik/MAT-OS/formule ali /ucbenik/MAT-OS-8/formule).
export function printFormulas(key) {
  const p = getPath(key);
  const bookKey = p ? `${p.subject}-${p.school}` : key;
  const book = getBook(bookKey);
  const md = formulaSheetSections(bookKey)?.md;
  if (!book || !md) return null;
  const content = `<section class="sheet">
      <p class="brand small">Evkli<span>d</span></p>
      <h1>${esc(book.subjectName)}: formule in konstante</h1>
      <p class="muted">${esc(book.schoolName.charAt(0).toUpperCase() + book.schoolName.slice(1))} · izdaja ${esc(today())}</p>
      ${renderMd(md)}
    </section>`;
  return shell(`${book.subjectName} · ${book.schoolName} · formule in konstante`, content);
}

// pathKey: cela pot; topicSlug (neobvezno): samo ena lekcija.
export function printPage(pathKey, topicSlug = null) {
  if (topicSlug === "formule") return printFormulas(pathKey);
  const p = getPath(pathKey);
  if (!p) return topicSlug ? null : printBook(pathKey);
  let topics = topicOrder(pathKey);
  if (topicSlug) {
    const t = getTopic(`${pathKey}/${topicSlug}`);
    if (!t) return null;
    topics = [t];
  }
  const ready = topics.map((t) => ({ t, lesson: loadLesson(t.id) })).filter((x) => x.lesson);
  if (topicSlug && !ready.length) return null;
  const title = topicSlug ? `${ready[0].t.name} · ${p.label}` : `${p.label} · učbenik`;

  const toc = topicSlug
    ? ""
    : `<section class="cover">
        <p class="brand">Evkli<span>d</span></p>
        <h1>${esc(p.label)}</h1>
        <p class="sub">Učbenik z razlagami, rešenimi primeri in vprašanji za preverjanje</p>
        <p class="muted">Izdaja ${esc(today())} · ${ready.length} od ${topics.length} tem${ready.length < topics.length ? " (ostale lekcije so v pripravi)" : ""}</p>
        <h2>Kazalo</h2>
        <ol class="toc">${ready.map(({ t }) => `<li><a href="#${esc(t.id)}">${esc(t.name)}</a> ${t.unit && t.unit !== t.name ? `<span class="muted">${esc(t.unit)}</span>` : ""}</li>`).join("")}</ol>
        ${NOTE}
      </section>`;

  const body = ready.length
    ? ready.map(({ t, lesson }, i) => lessonHtml(t, lesson, topicSlug ? 0 : i + 1)).join("")
    : `<p>Za to pot lekcije še nastajajo.</p>`;
  return shell(title, toc + body);
}

// Skupna lupina strani za tisk (tudi gradiva: povzetek na eni strani, delovni list); css: dodatna pravila.
export function shell(title, content, css = "") {
  return `<!doctype html>
<html lang="sl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<link rel="stylesheet" href="/vendor/katex/katex.min.css">
<style>
  :root { color-scheme: light; }
  body { font: 11.5pt/1.55 Georgia, "Times New Roman", serif; color: #1c2233; background: #fff; margin: 0; }
  main { max-width: 760px; margin: 0 auto; padding: 24px 20px 60px; }
  h1, h2, h3, h4, .brand, .bar, .crumb, .toc { font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
  .bar { position: sticky; top: 0; background: #2f6fed; color: #fff; padding: 10px 16px; display: flex; gap: 12px; align-items: center; justify-content: space-between; flex-wrap: wrap; }
  .bar button { font: inherit; font-weight: 700; border: 0; border-radius: 10px; padding: 8px 14px; background: #fff; color: #2f6fed; cursor: pointer; }
  .cover { page-break-after: always; break-after: page; }
  .brand { font-weight: 800; font-size: 1.4rem; margin: 0; } .brand span { color: #2f6fed; }
  .cover h1 { font-size: 2.2rem; margin: 40px 0 6px; }
  .sub { font-size: 1.15rem; }
  .muted { color: #667089; } .small { font-size: 0.9em; }
  .toc li { margin: 4px 0; } .toc a { color: inherit; text-decoration: none; font-weight: 600; }
  .lesson, .part { break-before: page; page-break-before: always; }
  .sheet { font: 9.5pt/1.35 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
  .sheet h1 { font-size: 1.5rem; margin: 2px 0; }
  .sheet h2 { font-size: 1.02rem; margin: 12px 0 4px; color: #2f6fed; border-bottom: 2px solid #dde2ec; padding-bottom: 2px; break-after: avoid; }
  .sheet table { width: 100%; margin: 0 0 4px; break-inside: auto; }
  .sheet th:empty, .sheet thead:has(th:empty) { display: none; }
  .sheet td, .sheet th { padding: 2px 6px; vertical-align: middle; }
  .sheet td:first-child { font-weight: 600; white-space: nowrap; }
  .sheet tr { break-inside: avoid; }
  /* Vsaka formula v svoji vrstici; prazna prva celica nadaljuje ime iz vrstice nad njo. */
  td:first-child:empty { border-top-color: transparent; }
  tr:has(+ tr > td:first-child:empty) > td:first-child { border-bottom-color: transparent; }
  .sheet p { margin: 4px 0; }
  .part h1 { font-size: 2rem; margin: 30vh 0 6px; } .toc-part { margin: 16px 0 4px; font-size: 1.05rem; }
  .lesson h2 { font-size: 1.6rem; margin: 0 0 6px; }
  .crumb { color: #667089; margin: 0; font-size: 0.9rem; }
  .lesson h3 { font-size: 1.15rem; margin: 22px 0 6px; border-bottom: 2px solid #dde2ec; padding-bottom: 3px; }
  .lesson h4 { margin: 14px 0 4px; }
  table { border-collapse: collapse; margin: 8px 0; font-variant-numeric: tabular-nums; } th, td { border: 1px solid #ccd3e0; padding: 4px 10px; text-align: left; vertical-align: middle; }
  th { background: #eef2f9; font-weight: 700; } tr { break-inside: avoid; } th[align="center"], td[align="center"] { text-align: center; } th[align="right"], td[align="right"] { text-align: right; }
  pre { background: #f3f5f9; padding: 8px; border-radius: 6px; }
  .demo-note { border: 1px dashed #2f6fed; border-radius: 8px; padding: 6px 10px; color: #2f6fed; font-family: system-ui, sans-serif; font-size: 0.9rem; margin: 10px 0; }
  .alt { border-left: 3px solid #7b61d1; padding-left: 12px; margin: 10px 0; }
  .think { border-left: 4px solid #e0a100; background: #fbf7ea; padding: 4px 12px; margin: 8px 0; }
  .think-label { margin: 2px 0 0; font: 700 0.78rem system-ui, sans-serif; text-transform: uppercase; letter-spacing: 0.04em; color: #8a6a00; }
  .formula { border: 1px solid #c9d3ea; background: #f3f6fc; border-radius: 8px; padding: 4px 12px; margin: 8px 0; }
  .formula-label { margin: 2px 0 0; font: 700 0.78rem system-ui, sans-serif; text-transform: uppercase; letter-spacing: 0.04em; color: #2f6fed; }
  .checks .opts { list-style: lower-alpha; }
  .checks p { margin: 2px 0; }
  .key { margin-top: 10px; font-size: 0.92em; } .key summary { font-weight: 700; font-family: system-ui, sans-serif; }
  .katex-display { overflow-x: auto; overflow-y: hidden; }
  section, .alt, li { break-inside: avoid-page; }
  @media print {
    .bar { display: none; }
    main { max-width: none; padding: 0; }
    a { color: inherit; }
    @page { margin: 18mm 16mm; }
  }
${css}
</style></head>
<body>
<div class="bar"><span>${esc(title)}</span><button type="button">Shrani kot PDF</button></div>
<main>${content}</main>
<script src="/ucbenik-tisk.js"></script>
</body></html>`;
}

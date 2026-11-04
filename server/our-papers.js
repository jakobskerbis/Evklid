// Naše pole v slogu preteklih pol NPZ in mature (j 30. 10. 2026: »ne uporabljaj dobesednih nalog, samo strukturo
// nalog«). Vsaka datoteka content/exam-papers/<id>.json ima isti id kot vnos v server/exam-papers-si.js, isto
// število nalog in točk po delih kot izvirna pola RIC, naloge pa so naše (Opus pisec, Opus pregledovalec, Opus
// bralec). Vsak del ima rešitev in razlago na enega ali več načinov (ways), deli z 2 ali več točkami vsaj dva.
//
// Oblika: { id, exam, subject, minutes, points, author: "AI", tools?, tasks: [{ n, intro?, figure?, parts: [{
//   id: "a", points, format: open|choice|fill|construct|table, text, figure?, choices?, correct?, answer,
//   ways: [{ title, text }], solutionFigure?, scoring?, mistake? }] }] }
// figure se vidi ob nalogi, solutionFigure (npr. končana konstrukcija) šele v »Pokaži rešitev«.
// Besedila so Markdown z LaTeX v $…$ (public/markdown.js), figure so vrstični SVG brez skript.
import fs from "node:fs";
import path from "node:path";
import katex from "katex";
import { checkArithmetic } from "./lesson-math.js";

export const OUR_PAPERS_DIR = path.join(path.dirname(new URL(import.meta.url).pathname), "..", "content", "exam-papers");
const FORMATS = ["open", "choice", "fill", "construct", "table"];
const ID = /^(NPZ6|NPZ9|MATURA|POKLICNA)-(MAT|FIZ|KEM|BIO)-\d{4}-[a-z0-9-]+$/;
const SVG_BAD_RE = /<script|[\s/"']on\w+\s*=|javascript:|<foreignObject|xlink:href\s*=\s*["']?(?!#)|href\s*=\s*["']?(?!#)/i;
// Samo risarske oznake: <img>, <iframe>, <embed>, <style>, <set>/<animate> (href → javascript:) ipd. niso dovoljene.
const SVG_TAGS = new Set(["svg", "g", "path", "circle", "ellipse", "line", "polyline", "polygon", "rect", "text", "tspan", "title", "desc", "defs", "marker", "use", "lineargradient", "stop", "clippath", "pattern"]);
const SVG_BAD = { test: (s) => SVG_BAD_RE.test(s) || [...String(s).matchAll(/<\s*([a-zA-Z][\w:-]*)/g)].some((m) => !SVG_TAGS.has(m[1].toLowerCase())) };

function texErrors(md, where, err) {
  const s = String(md ?? "");
  const n = (s.replace(/\\\$/g, "").match(/\$/g) || []).length;
  if (n % 2) err(`${where}: liho število znakov $`);
  const texs = [];
  s.replace(/\$\$([\s\S]+?)\$\$/g, (_, t) => (texs.push([t, true]), ""));
  s.replace(/\$\$[\s\S]+?\$\$/g, "").replace(/(^|[^\\$])\$([^$\n]+?)\$/g, (_, p, t) => (texs.push([t, false]), ""));
  for (const [tex, display] of texs) {
    try {
      katex.renderToString(tex, { displayMode: display, throwOnError: true, strict: "ignore" });
    } catch (e) {
      err(`${where}: formula se ne izriše: $${tex.slice(0, 50)}$ (${String(e.message).split("\n")[0].slice(0, 70)})`);
    }
  }
}

// Preveri eno polo. expected: { points, tasks: [[točke dela a, b, …], …] } iz zgradbe izvirne pole (neobvezno).
export function validatePaper(p, expected = null) {
  const errors = [];
  const err = (m) => errors.push(m);
  if (!p || typeof p !== "object") return { errors: ["ni objekt"], checked: 0, points: 0 };
  if (!ID.test(p.id || "")) err(`id »${p.id}« ni v obliki NPZ9-MAT-2026-redni`);
  if (p.author !== "AI") err("author mora biti »AI«");
  if (!Number.isInteger(p.minutes) || p.minutes < 10) err("minutes manjka");
  if (!Array.isArray(p.tasks) || !p.tasks.length) err("ni nalog");
  let total = 0;
  let checked = 0;
  const md = [];
  (p.tasks || []).forEach((task, ti) => {
    const tw = `naloga ${task?.n ?? ti + 1}`;
    if (task?.n !== ti + 1) err(`${tw}: n mora biti ${ti + 1}`);
    if (task.intro) md.push([task.intro, `${tw} uvod`]);
    if (task.figure && (typeof task.figure !== "string" || !/^<svg[\s>]/.test(task.figure.trim()) || SVG_BAD.test(task.figure))) err(`${tw}: figure mora biti varen <svg>`);
    if (!Array.isArray(task.parts) || !task.parts.length) return err(`${tw}: ni delov`);
    const ids = new Set();
    task.parts.forEach((part) => {
      const w = `${tw}${part?.id ? ` ${part.id})` : ""}`;
      if (!/^[a-z]?$/.test(part.id ?? "")) err(`${w}: id je ena črka ali prazen`);
      if (ids.has(part.id)) err(`${w}: podvojen id`);
      ids.add(part.id);
      if (!Number.isInteger(part.points) || part.points < 1) err(`${w}: points`);
      total += part.points || 0;
      if (!FORMATS.includes(part.format)) err(`${w}: format mora biti ${FORMATS.join("|")}`);
      if (!String(part.text || "").trim() && !task.intro) err(`${w}: ni besedila`);
      if (!String(part.answer || "").trim()) err(`${w}: ni odgovora (answer)`);
      if (part.format === "choice") {
        if (!Array.isArray(part.choices) || part.choices.length < 2) err(`${w}: izbirni del potrebuje choices`);
        if (!Array.isArray(part.correct) || !part.correct.length || part.correct.some((i) => !Number.isInteger(i) || i < 0 || i >= (part.choices || []).length)) err(`${w}: correct mora biti seznam indeksov v choices`);
      }
      for (const k of ["figure", "solutionFigure"]) if (part[k] && (typeof part[k] !== "string" || !/^<svg[\s>]/.test(part[k].trim()) || SVG_BAD.test(part[k]))) err(`${w}: ${k} mora biti varen <svg>`);
      const ways = Array.isArray(part.ways) ? part.ways : [];
      if (!ways.length) err(`${w}: ni razlage (ways)`);
      if (part.points >= 2 && ways.length < 2) err(`${w}: del z ${part.points} točkama potrebuje vsaj dva načina razlage`);
      ways.forEach((x, i) => {
        if (!String(x?.title || "").trim() || !String(x?.text || "").trim()) err(`${w}: način ${i + 1} potrebuje title in text`);
        md.push([x?.text, `${w} način ${i + 1}`]);
      });
      for (const k of ["text", "answer", "scoring", "mistake"]) if (part[k]) md.push([part[k], `${w} ${k}`]);
      for (const c of part.choices || []) md.push([c, `${w} izbira`]);
    });
    if (expected?.tasks?.[ti]) {
      const want = expected.tasks[ti];
      const got = task.parts.map((x) => x.points);
      if (want.join(",") !== got.join(",")) err(`${tw}: točke po delih ${got.join("+")}, zgradba izvirne pole ${want.join("+")}`);
    }
  });
  if (expected?.tasks && (p.tasks || []).length !== expected.tasks.length) err(`število nalog ${(p.tasks || []).length}, izvirna pola ${expected.tasks.length}`);
  if (Number.isInteger(p.points) && p.points !== total) err(`points ${p.points}, vsota delov ${total}`);
  if (expected?.points && total !== expected.points) err(`vsota točk ${total}, izvirna pola ${expected.points}`);
  for (const [text, where] of md) {
    texErrors(text, where, err);
    const calc = checkArithmetic(String(text || ""));
    checked += calc.checked;
    for (const m of calc.mismatches) err(`${where}: račun se ne izide: $${m.tex}$ (${m.left} ≠ ${m.right})`);
  }
  return { errors, checked, points: total };
}

// Pole, ki obstajajo (id → pot). Prebere imenik ob zagonu; manjkajoč imenik pomeni brez naših pol.
let index = null;
export function ourPaperIds() {
  if (!index) {
    index = new Map();
    try {
      for (const f of fs.readdirSync(OUR_PAPERS_DIR)) if (f.endsWith(".json") && ID.test(f.slice(0, -5))) index.set(f.slice(0, -5), path.join(OUR_PAPERS_DIR, f));
    } catch {
      /* brez naših pol */
    }
  }
  return index;
}
export function loadOurPaper(id) {
  const file = ourPaperIds().get(String(id));
  if (!file) return null;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

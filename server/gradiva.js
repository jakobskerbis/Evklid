// Nove vrste gradiv ob lekciji (docs/gradiva.md): povzetek na eni strani z miselnim vzorcem,
// zvočni povzetek in delovni list za tisk z rešitvami. Vse je narejeno iz že pregledanih lekcij
// in generatorjev nalog, zato ne stane nič in ne potrebuje nove vsebine.
// Kdo kaj dobi, odloča ena funkcija (canUse) po pravicah iz server/placila/pravice.js:
// šolska licenca za teme svojih predmetov in razredov, Evklid Osebno za vse.
import fs from "node:fs";
import path from "node:path";
import { getTopic, getPath } from "./curriculum.js";
import { loadLesson } from "./textbook.js";
import { renderMd, shell } from "./textbook-print.js";
import { createPageCache, lessonVersion } from "./tisk-predpomnilnik.js";
import { generateTask, hasGenerator, optionsAreTex } from "./practice/index.js";
import { speakMarkdown } from "./govor.js";
import { GRADIVA_DIR, hasGradivo, gradivoPage, videoFor } from "./gradiva-vsebina.js";
import { weakTopicsFor } from "./weaknesses.js";

// free: brezplačno kot besedilo učbenika (narejeno iz lekcije, brez stroškov).
// Ostalo velja za šolsko licenco (šolski predmeti) in Evklid Osebno (vsi predmeti).
export const VRSTE = {
  povzetek: { icon: "file-text", free: true },
  zvok: { icon: "volume-2", free: true },
  "delovni-list": { icon: "clipboard-check", free: false },
  // Napisana gradiva (server/gradiva-vsebina.js): samo, kjer datoteka obstaja.
  video: { icon: "play", free: false },
  poskus: { icon: "flask-conical", free: false },
  projekt: { icon: "lightbulb", free: false },
};

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const today = () => new Date().toLocaleDateString("sl-SI", { day: "numeric", month: "long", year: "numeric" });
const inline = (md) => renderMd(md).replace(/^<p>([\s\S]*)<\/p>\s*$/, "$1");

// --- povzetek na eni strani ---

const sectionMd = (lesson, re) => lesson.sections.find((s) => re.test(s.title || ""))?.md || "";
const bullets = (md) =>
  md
    .split(/\n(?=\s*[-*+]\s)/)
    .map((b) => b.replace(/^\s*[-*+]\s+/, "").replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);

// Formule iz blokov :::formula (brez ponovitev), največ 6.
function lessonFormulas(lesson) {
  const all = [lesson.sections, lesson.alternatives].flat().map((s) => s.md).join("\n");
  const out = [];
  for (const m of all.matchAll(/^[ \t]*:::[ \t]*formula[ \t]*\n([\s\S]*?)\n[ \t]*:::[ \t]*$/gm)) {
    const f = m[1].trim();
    if (f && !out.includes(f)) out.push(f);
  }
  return out.slice(0, 6);
}

// Veja miselnega vzorca iz alineje povzetka: »Ohmov zakon: $I = U/R$« → naslov + podrobnost.
export function branchOf(text) {
  const plain = text.replace(/\$[^$]*\$/g, (m) => m.replace(/:/g, "\u0000"));
  const at = plain.indexOf(":");
  if (at > 0 && at <= 48) return { label: text.slice(0, at).trim(), detail: text.slice(at + 1).trim() };
  return { label: "", detail: text };
}

// Napisan miselni vzorec (content/gradiva/miselni/<POT>/<tema>.md, docs/gradiva.md): alineje prve
// ravni so veje (»Veja: podrobnost«), zamaknjene alineje so podrobnosti veje. Brez datoteke so veje
// alineje povzetka lekcije.
export function authoredMap(topicId) {
  const file = path.join(GRADIVA_DIR, "miselni", `${topicId}.md`);
  if (!/^[A-Z0-9-]+\/[a-z0-9-]+$/.test(topicId) || !fs.existsSync(file)) return null;
  const body = fs.readFileSync(file, "utf8").replace(/^---\n[\s\S]*?\n---\n/, "");
  const out = [];
  for (const line of body.split("\n")) {
    const m = /^(\s*)[-*+]\s+(.*)$/.exec(line);
    if (!m) continue;
    if (!m[1].length) out.push({ ...branchOf(m[2].trim()), subs: [] });
    else if (out.length) out[out.length - 1].subs.push(m[2].trim());
  }
  return out.length
    ? out.slice(0, 8).map((b) => {
        if (!b.subs.length) return { label: b.label, detail: b.detail };
        // »Veja: podrobnost« s podalinejami: podrobnost za dvopičjem ostane pred podalinejami.
        return b.label ? { label: b.label, detail: [b.detail, ...b.subs].filter(Boolean).join(" · ") } : { label: b.detail, detail: b.subs.join(" · ") };
      })
    : null;
}

export function summaryParts(topicId) {
  const t = getTopic(topicId);
  const lesson = t && loadLesson(topicId);
  if (!lesson) return null;
  const povzetek = sectionMd(lesson, /^povzetek/i);
  if (!povzetek.trim()) return null;
  const items = bullets(povzetek);
  const authored = authoredMap(topicId);
  return {
    topic: t,
    pathLabel: getPath(t.path)?.label || "",
    status: lesson.status,
    povzetek,
    authored: !!authored,
    branches: authored || items.slice(0, 8).map(branchOf),
    mistakes: bullets(sectionMd(lesson, /^pogoste napake/i)).slice(0, 4),
    formulas: lessonFormulas(lesson),
  };
}

// Mesta vej v mreži 3 × 3 okoli središča (indeks celice 0–8, 4 je središče).
const SLOTS = { 1: [1], 2: [3, 5], 3: [1, 6, 8], 4: [1, 3, 5, 7], 5: [0, 2, 3, 5, 7], 6: [0, 2, 3, 5, 6, 8], 7: [0, 1, 2, 3, 5, 6, 8], 8: [0, 1, 2, 3, 5, 6, 7, 8] };

export function mindMapHtml(center, branches) {
  const slots = SLOTS[branches.length] || [];
  const cells = Array(9).fill("");
  cells[4] = `<div class="mm-node mm-center">${esc(center)}</div>`;
  branches.forEach((b, i) => {
    cells[slots[i]] = `<div class="mm-node mm-branch">${b.label ? `<b>${inline(b.label)}</b>` : ""}${b.detail ? `<span>${inline(b.detail)}</span>` : ""}</div>`;
  });
  const lines = slots
    .map((c) => `<line x1="1.5" y1="1.5" x2="${(c % 3) + 0.5}" y2="${Math.floor(c / 3) + 0.5}" />`)
    .join("");
  return `<div class="mm" role="img" aria-label="Miselni vzorec: ${esc(center)}">
    <svg class="mm-lines" viewBox="0 0 3 3" preserveAspectRatio="none" aria-hidden="true">${lines}</svg>
    ${cells.map((c) => `<div class="mm-cell">${c}</div>`).join("")}</div>`;
}

const SUMMARY_CSS = `
  .one { font: 10pt/1.4 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
  .one h1 { font-size: 1.45rem; margin: 2px 0 0; }
  .one h2 { font-size: 1rem; margin: 10px 0 4px; color: #2353d1; border-bottom: 2px solid #dde2ec; padding-bottom: 2px; }
  .one ul { margin: 4px 0; padding-left: 18px; } .one li { margin: 2px 0; }
  .mm { position: relative; display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-rows: minmax(64px, auto); gap: 10px; margin: 8px 0 4px; }
  .mm-lines { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; }
  .mm-lines line { stroke: #9fb3df; stroke-width: 2; vector-effect: non-scaling-stroke; }
  .mm-cell { display: flex; align-items: center; justify-content: center; z-index: 1; min-width: 0; }
  .mm-node { background: #fff; border: 2px solid #c9d3ea; border-radius: 12px; padding: 6px 9px; font-size: 0.86rem; line-height: 1.3; text-align: center; max-width: 100%; overflow-wrap: anywhere; }
  .mm-node b { display: block; color: #1c2233; } .mm-node span { color: #3a4257; }
  .mm-center { background: #2f6fed; border-color: #2353d1; color: #fff; font-weight: 800; font-size: 1.05rem; padding: 12px 14px; }
  .one .cols { display: grid; grid-template-columns: 1.4fr 1fr; gap: 16px; }
  .one .fbox { border: 1px solid #c9d3ea; background: #f3f6fc; border-radius: 8px; padding: 2px 10px 6px; }
  .one .fbox p { margin: 6px 0; }
  @media (max-width: 560px) {
    .one .cols { grid-template-columns: 1fr; }
    .mm { display: flex; flex-direction: column; gap: 6px; padding-left: 14px; border-left: 3px solid #9fb3df; }
    .mm-lines, .mm-cell:empty { display: none; }
    .mm-cell { justify-content: flex-start; } .mm-cell:nth-child(6) { order: -1; } .mm-node { text-align: left; width: 100%; }
  }
  @media print { .one { font-size: 9.5pt; } .one, .mm { break-inside: avoid; } }
`;

// Podpis povzetka za predpomnilnik: datum, različica lekcije in čas spremembe napisanega miselnega vzorca.
export function summarySignature(topicId) {
  const t = getTopic(topicId);
  const lesson = t && loadLesson(topicId);
  if (!lesson) return null;
  let mapMtime = 0;
  if (/^[A-Z0-9-]+\/[a-z0-9-]+$/.test(topicId)) {
    try {
      mapMtime = fs.statSync(path.join(GRADIVA_DIR, "miselni", `${topicId}.md`), { throwIfNoEntry: false })?.mtimeMs || 0;
    } catch {}
  }
  return `${today()}|${lessonVersion(lesson)}|${mapMtime}`;
}

export function summaryPage(topicId) {
  const p = summaryParts(topicId);
  if (!p) return null;
  const { topic: t } = p;
  const formulas = p.formulas.length
    ? `<div class="fbox"><h2>Formule</h2>${p.formulas.map((f) => renderMd(f)).join("")}</div>`
    : "";
  const content = `<section class="one">
    <p class="brand small">Evkli<span>d</span></p>
    <h1>${esc(t.name)}</h1>
    <p class="muted">${esc(p.pathLabel)}${t.unit && t.unit !== t.name ? ` · ${esc(t.unit)}` : ""} · povzetek na eni strani · ${esc(today())}</p>
    <h2>Miselni vzorec</h2>
    ${mindMapHtml(t.name, p.branches)}
    <div class="cols"><div>${
      // Brez napisanega vzorca so veje že alineje povzetka: namesto ponovitve pokažemo pogoste napake.
      p.authored ? `<h2>Povzetek</h2>${renderMd(p.povzetek)}` : p.mistakes.length ? `<h2>Pazi na</h2><ul>${p.mistakes.map((m) => `<li>${inline(m)}</li>`).join("")}</ul>` : ""
    }</div>${formulas}</div>
    ${p.status !== "pregledano" ? `<p class="muted small">Narejeno iz lekcije, ki jo še pregleduje učitelj.</p>` : ""}
  </section>`;
  return shell(`${t.name} · povzetek`, content, SUMMARY_CSS);
}

// --- zvočni povzetek ---

export function audioSummary(topicId) {
  const p = summaryParts(topicId);
  if (!p) return null;
  const formulas = p.formulas.length ? `\nFormule.\n${p.formulas.map((f) => speakMarkdown(f)).join("\n")}` : "";
  const text = `Povzetek: ${p.topic.name}.\n${speakMarkdown(p.povzetek)}${formulas}`;
  return { topic: p.topic.id, title: p.topic.name, lang: "sl-SI", text, parts: text.split("\n").filter(Boolean) };
}

// --- delovni list ---

const comma = (s) => String(s).replace(".", ",");
function formatNumber(a) {
  const v = Number(a.value);
  const d = Number.isInteger(a.decimals) ? a.decimals : Number.isInteger(v) ? 0 : Math.abs(v) >= 100 ? 1 : Math.abs(v) >= 1 ? 2 : 3;
  // Brez predpisanih decimalk ničel na koncu ne pišemo (12,6 V kot v rešitvi, ne 12,60 V).
  const out = d >= 0 ? v.toFixed(d) : String(v);
  return comma(Number.isInteger(a.decimals) ? out : out.replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, ""));
}
const LETTERS = "abcdefghij";
// Ena izbira pri nalogi z izbiro (LaTeX ali navadno besedilo); tudi za kviz v živo.
export const optionHtml = (task, o) => (optionsAreTex(task) ? inline(`$${o}$`) : inline(String(o)));
export function answerHtml(task) {
  const a = task.answer;
  switch (a.type) {
    case "number":
      return `${esc(formatNumber(a))}${a.unit ? ` ${esc(a.unit)}` : ""}`;
    case "fraction":
      return renderMd(`$\\dfrac{${a.num}}{${a.den}}$`).replace(/^<p>|<\/p>\s*$/g, "");
    case "choice":
      return `${LETTERS[a.index]}) ${optionHtml(task, a.options[a.index])}`;
    case "coefficients":
      return esc(a.values.join(", "));
    default:
      return "";
  }
}

// Naloge za list: po temah enakomerno, težavnost narašča (1, 1, 2, 2, 3 …). Naloge s sliko,
// ki se rešujejo z dotikom (graf, številska premica), preskočimo, ker jih na papirju ni.
export function worksheetTasks(topicIds, perTopic = 4, seed = 1) {
  const tasks = [];
  topicIds.forEach((id, ti) => {
    for (let i = 0; i < perTopic; i++) {
      const level = Math.min(3, 1 + Math.floor((i * 3) / Math.max(1, perTopic)));
      for (let k = 0; k < 6; k++) {
        let t;
        try {
          t = generateTask(id, level, (seed * 7919 + ti * 131 + i * 17 + k * 100003) % 2 ** 31, "sl");
        } catch {
          continue; // generator brez naloge za to seme: poskusimo drugo, list ostane cel
        }
        if (!t) break;
        if (t.figure || tasks.some((x) => x.text === t.text)) continue;
        tasks.push(t);
        break;
      }
    }
  });
  return tasks;
}

const WORKSHEET_CSS = `
  .ws { font: 10.5pt/1.45 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
  .ws h1 { font-size: 1.4rem; margin: 2px 0; }
  .ws .who { display: flex; gap: 24px; margin: 8px 0 12px; } .ws .who span { flex: 1; border-bottom: 1px solid #889; padding-bottom: 2px; }
  .ws ol.tasks > li { margin: 0 0 14px; break-inside: avoid; }
  .ws .opts { list-style: lower-alpha; margin: 4px 0; }
  .ws .lines { border: 1px solid #ccd3e0; border-radius: 8px; padding: 6px 10px; margin-top: 6px; color: #667089; font-size: 0.9em; }
  .ws .lines p { margin: 0 0 22px; } .ws .lines p:last-child { margin: 0; }
  .ws .lvl { float: right; margin-left: 8px; color: #667089; font-size: 0.85em; }
  .ws ol.tasks > li > p:first-of-type { margin-top: 0; }
  .ws .key { break-before: page; page-break-before: always; }
  .ws .key li { margin: 0 0 10px; break-inside: avoid; }
  .ws .key .ans { font-weight: 700; }
  .ws .key p { margin: 2px 0; }
`;
// 1 naloga, 2 nalogi, 3 in 4 naloge, 5 nalog (tudi 101, 102 … po zadnjih dveh števkah).
const nalog = (n) => `${n} ${["nalog", "naloga", "nalogi", "naloge", "naloge"][n % 100] || "nalog"}`;
const STARS = ["", "★", "★★", "★★★"];

export function worksheetPage({ topicIds, perTopic = 4, seed = 1, title = null, solutions = true }) {
  const topics = topicIds.map(getTopic).filter((t) => t && hasGenerator(t.id));
  if (!topics.length) return null;
  const tasks = worksheetTasks(topics.map((t) => t.id), perTopic, seed);
  if (!tasks.length) return null;
  const name = title || (topics.length === 1 ? topics[0].name : "Delovni list");
  const sub = [...new Set(topics.map((t) => getPath(t.path)?.label).filter(Boolean))].join(", ");
  const list = tasks
    .map((t) => {
      const opts = t.answer.type === "choice"
        ? `<ol class="opts">${t.answer.options.map((o) => `<li>${optionHtml(t, o)}</li>`).join("")}</ol>`
        : `<div class="lines"><p>Podatki:</p><p>Iščemo:</p><p>Rešitev:</p><p>Odgovor:${t.answer.unit ? ` ____________ ${esc(t.answer.unit)}` : ""}</p></div>`;
      return `<li><span class="lvl" aria-label="težavnost ${t.level}">${STARS[t.level] || ""}</span> ${renderMd(t.text)}${opts}</li>`;
    })
    .join("");
  const key = solutions
    ? `<section class="key"><h2>Rešitve</h2><ol>${tasks
        .map((t) => {
          const given = t.data?.given?.filter(Boolean) || [];
          const find = t.data?.find?.filter(Boolean) || [];
          const data = given.length ? `<p><b>Podatki:</b> ${given.map((g) => inline(`$${g}$`)).join(", ")}${find.length ? `; <b>Iščemo:</b> ${find.map((f) => inline(`$${f}$`)).join(", ")}` : ""}</p>` : "";
          const steps = t.solution ? renderMd(t.solution) : "";
          return `<li>${data}${steps}<p class="ans">Odgovor: ${answerHtml(t)}</p></li>`;
        })
        .join("")}</ol></section>`
    : "";
  const content = `<section class="ws">
    <p class="brand small">Evkli<span>d</span></p>
    <h1>${esc(name)}</h1>
    <p class="muted">${esc(sub)} · ${nalog(tasks.length)} · ${esc(today())} · koda lista ${seed}</p>
    <div class="who"><span>Ime in priimek:</span><span>Razred:</span><span>Datum:</span></div>
    <p class="muted small">Pri vsaki računski nalogi zapiši podatke, kaj iščeš, račun z enotami in odgovor. Zvezdice kažejo težavnost.</p>
    <ol class="tasks">${list}</ol>
    ${key}
  </section>`;
  return shell(`${name} · delovni list`, content, WORKSHEET_CSS);
}

// Šibke teme učenca: z učencem (student) najprej šibke teme iz vseh virov (server/weaknesses.js), nato
// naloge zadnjih 60 dni: vsaj 3 naloge in vsaj 40 % napačnih v prvem poskusu. Le teme z nalogami.
export function weakTopicIds(db, studentId, limit = 3, student = null) {
  const all = student ? weakTopicsFor({ db }, student).map((w) => w.topic_id).filter(Boolean) : [];
  const fromTasks = db
    .prepare(
      `SELECT topic_id, COUNT(*) AS n, SUM(first_try_correct = 0) AS wrong FROM tasks
       WHERE student_id = ? AND mode != 'pretest' AND first_try_correct IS NOT NULL AND created_at >= datetime('now', '-60 days')
       GROUP BY topic_id HAVING n >= 3 AND wrong * 1.0 / n >= 0.4 ORDER BY wrong * 1.0 / n DESC, n DESC LIMIT ?`,
    )
    .all(studentId, limit * 3)
    .map((r) => r.topic_id);
  return [...new Set([...all, ...fromTasks])].filter((id) => getTopic(id) && hasGenerator(id)).slice(0, limit);
}

// --- HTTP ---

const SEED_MAX = 999999;
const seedOf = (v) => (/^\d{1,6}$/.test(String(v ?? "")) ? Math.max(1, Number(v)) : 1 + Math.floor(Math.random() * SEED_MAX));

export function mountGradiva(app, store, { loadStudent, accounts, leagues = null }) {
  // topicId: gradivo ene teme (kot interaktivni del lekcije); brez teme (list iz šibkih tem) samo Osebno.
  const canUse = (s, vrsta, topicId = null) => {
    if (!VRSTE[vrsta]) return false;
    if (VRSTE[vrsta].free || !accounts) return true;
    return topicId ? accounts.lessonInteractive(s.id, topicId) : !!accounts.rightsFor(s.id).personal;
  };
  const topicOf = (req, res) => {
    const t = getTopic(String(req.query.topic || ""));
    if (!t) res.status(404).json({ error: "Tema ne obstaja." });
    return t;
  };

  // Povzetek na eni strani je besedilo učbenika: za vse, brez prijave (kot /ucbenik).
  // Predpomnjen po različici lekcije in miselnega vzorca (server/tisk-predpomnilnik.js).
  const summaries = createPageCache({ maxBytes: 8 * 1024 * 1024 });
  app.get("/gradiva/povzetek/:path/:topic", (req, res, next) => {
    const id = `${req.params.path}/${req.params.topic}`;
    const page = summaries.get(id, summarySignature(id), () => summaryPage(id));
    if (!page) return res.status(404).send("Za to temo povzetka še ni.");
    summaries.send(req, res, page).catch(next);
  });

  // Katera gradiva ima tema in katera so učencu odklenjena.
  app.get("/api/students/:id/gradiva", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const t = topicOf(req, res);
    if (!t) return;
    const items = [];
    if (summaryParts(t.id)) {
      const [p, slug] = t.id.split("/");
      items.push({ vrsta: "povzetek", url: `/gradiva/povzetek/${p}/${slug}` }, { vrsta: "zvok" });
    }
    if (hasGenerator(t.id)) items.push({ vrsta: "delovni-list" });
    for (const v of ["video", "poskus", "projekt"]) if (hasGradivo(v, t.id)) items.push({ vrsta: v });
    res.json({ topic: t.id, items: items.map((x) => ({ ...x, icon: VRSTE[x.vrsta].icon, locked: !canUse(s, x.vrsta, t.id) })) });
  });

  // Šibke teme za delovni list za doma (gumb na strani Napredek).
  app.get("/api/students/:id/gradiva/sibke", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const topics = weakTopicIds(store.db, s.id, 3, s).map((id) => ({ id, name: getTopic(id).name }));
    res.json({ topics, locked: !canUse(s, "delovni-list") });
  });

  app.get("/api/students/:id/gradiva/zvok", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const t = topicOf(req, res);
    if (!t) return;
    const a = audioSummary(t.id);
    if (!a) return res.status(404).json({ error: "Za to temo povzetka še ni." });
    res.json(a);
  });

  // Domači poskus ali projekt: stran za tisk (odjemalec jo odpre v novem oknu).
  app.get("/api/students/:id/gradiva/stran", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const vrsta = String(req.query.vrsta || "");
    if (vrsta !== "poskus" && vrsta !== "projekt") return res.status(400).json({ error: "Neznana vrsta gradiva." });
    const t = topicOf(req, res);
    if (!t) return;
    if (!canUse(s, vrsta, t.id)) return res.status(403).json({ error: "To gradivo je v paketu.", code: "gr.lockedAny" });
    const html = gradivoPage(vrsta, t.id);
    if (!html) return res.status(404).json({ error: "Za to temo tega gradiva še ni." });
    res.type("html").send(html);
  });

  // Kratek video: scenarij, po katerem predvajalnik upravlja simulacijo in bere podnapise.
  app.get("/api/students/:id/gradiva/video", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const t = topicOf(req, res);
    if (!t) return;
    if (!canUse(s, "video", t.id)) return res.status(403).json({ error: "To gradivo je v paketu.", code: "gr.lockedAny" });
    const v = videoFor(t.id);
    if (!v) return res.status(404).json({ error: "Za to temo videa še ni." });
    res.json(v);
  });

  // Delovni list za doma: ena tema ali šibke teme (?sibke=1). Odjemalec stran odpre v novem oknu.
  app.get("/api/students/:id/gradiva/delovni-list", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const weak = req.query.sibke === "1";
    const locked = () => res.status(403).json({ error: "Delovni listi so v paketu.", code: "gr.locked" });
    let ids;
    if (weak) {
      if (!canUse(s, "delovni-list")) return locked();
      ids = weakTopicIds(store.db, s.id, 3, s);
      if (!ids.length) return res.status(404).json({ error: "Še nimaš šibkih tem. Najprej reši nekaj nalog.", code: "gr.noWeak" });
    } else {
      const t = topicOf(req, res);
      if (!t) return;
      if (!canUse(s, "delovni-list", t.id)) return locked();
      ids = [t.id];
    }
    const perTopic = Math.min(10, Math.max(2, Math.trunc(Number(req.query.n)) || (weak ? 4 : 6)));
    const html = worksheetPage({ topicIds: ids, perTopic, seed: seedOf(req.query.seme), title: weak ? "Vaja iz šibkih tem" : null });
    if (!html) return res.status(404).json({ error: "Za to temo nalog za tisk še ni." });
    res.set("Cache-Control", "no-store").type("html").send(html);
  });

  // Delovni list za razred: učitelju vedno zastonj (koda razreda in učiteljev ključ ali lastnik razreda).
  // ?resitve=0 natisne list brez rešitev (za učence); privzeto so rešitve na zadnji strani.
  app.get("/api/teacher/classes/:code/delovni-list", (req, res) => {
    const cls = leagues?.authTeacher(req.params.code, req.get("x-teacher-key"), req.parent?.id ?? null);
    if (!cls) return res.status(403).json({ error: "Napačna koda ali ključ razreda." });
    const t = topicOf(req, res);
    if (!t) return;
    const perTopic = Math.min(12, Math.max(2, Math.trunc(Number(req.query.n)) || 8));
    const html = worksheetPage({ topicIds: [t.id], perTopic, seed: seedOf(req.query.seme), solutions: req.query.resitve !== "0" });
    if (!html) return res.status(404).json({ error: "Za to temo nalog za tisk še ni." });
    res.set("Cache-Control", "no-store").type("html").send(html);
  });
}

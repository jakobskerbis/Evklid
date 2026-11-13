// Učbenik: kazalo, iskanje in lekcije z interaktivnimi demonstracijami.
import { mountSim } from "./sim/index.js";
import { t, locale, currentLang } from "./i18n.js";
import { uiLanguage } from "./i18n/languages.js";
import { withFormulaSubject, plainTex } from "./formula-data.js";
import { lessonSteps, demoSteps } from "./lesson-steps.js";
import { gradivaHtml, wireGradiva, stopReading } from "./gradiva.js";
import { prilagodiSirino } from "./sirina.js";
import { jeFaks } from "./stopnja.js";
import { wireLessonReport } from "./prijave.js";

// Povezava na učbenik za tisk/PDF (server/textbook-print.js): ?l= je jezik besedil na strani (pregrada »Pripravljam
// učbenik …«, navodilo za brskalnike brez tiskanja); ?poglavje= samo en sklop poti (manjši in hitrejši PDF).
const pdfHref = (path, { topic = "", unit = "" } = {}) => {
  const q = new URLSearchParams();
  if (unit) q.set("poglavje", unit);
  q.set("l", uiLanguage(currentLang()));
  // Razred, poglavje in cel predmet: vnaprej izdelana datoteka PDF (server/ucbenik-pdf.js), telefon jo samo prenese;
  // če je strežnik (še) nima, sam preusmeri na tisk v brskalniku. Lekcija in list formul: tisk v brskalniku.
  if (!topic) return `/ucbenik-pdf/${path}?${q}`;
  return `/ucbenik/${path}/${topic}?${q}#natisni`;
};

let ctx = null; // { api, renderRich, escapeHtml, getStudent, openTopic, nextPractice, learnWithTutor, showView, openLab, open3d }
const $ = (sel) => document.querySelector(sel);
// Zaporedni številki prikaza: odgovor starejše zahteve (prejšnja poizvedba iskanja, prej kliknjena lekcija,
// domača stran po »Nazaj«) ne sme prepisati novejšega, ki je prišel prej.
let navSeq = 0; // celoten pogled Učbenika (domača stran ali lekcija)
let bodySeq = 0; // spodnji del domače strani (iskanje, kazalo, viri)
const tb = { browse: false, subject: null, book: null, group: null, query: "", topicId: null, books: [], myPath: null, program: null, profile: null, mode: "lessons", refType: "", refSl: false, refs: null, refOpen: new Set() };

// Kar iz Nastavitev določa učbenik: smer, program, predmet in razred/letnik.
const profileOf = (s) =>
  s ? [s.id, s.settings?.educational_track, s.settings?.study_program, s.settings?.subject, s.settings?.study_course, s.settings?.curriculum_level].join("|") : "";

// Ko učenec v Nastavitvah zamenja smer, predmet ali letnik, se učbenik znova prilagodi.
function syncProfile() {
  const key = profileOf(ctx.getStudent());
  if (key === tb.profile) return;
  Object.assign(tb, { profile: key, browse: false, subject: null, book: null, group: null, myPath: null, topicId: null, query: "", mode: "lessons", refs: null });
}

// Deli učbenika v skupinah: pri šolskem učbeniku razred/letnik, pri študijskem programu letnik (z vsemi predmeti).
function groupsOf(book) {
  const groups = [];
  for (const p of book.parts || []) {
    const name = p.group || p.label.split(",").slice(1).join(",").trim() || p.label;
    let g = groups.find((x) => x.name === name);
    if (!g) groups.push((g = { name, parts: [] }));
    g.parts.push(p);
  }
  return groups;
}

// Privzeta skupina: tista z učenčevo potjo, sicer isti razred/letnik pri drugem predmetu, sicer prva.
function defaultGroup(groups) {
  const mine = groups.find((g) => g.parts.some((p) => p.key === tb.myPath));
  if (mine) return mine.name;
  const grade = (tb.myPath.match(/-(\d)$/) || [])[1];
  const same = grade && groups.find((g) => g.parts.some((p) => p.key.endsWith(`-${grade}`)));
  return (same || groups[0])?.name || null;
}

// Ikone iz icons.js (ko je na voljo prenovljen vmesnik), sicer brez ikon.
let iconFn = () => "";
import("./icons.js")
  .then((m) => {
    if (typeof m.icon === "function") iconFn = (n) => m.icon(n) || "";
  })
  .catch(() => {});
const ic = (n) => iconFn(n);


export function initTextbook(c) {
  ctx = c;
  wireSelectionAsk();
}

// ---------- Označi besedilo in vprašaj tutorja ----------
// Učenec v lekciji označi del besedila (z miško ali prstom), ob izboru se
// pokaže gumb »Razloži«, ki odpre klepet s tutorjem z označenim delom.
let current = null; // { id, name } odprte lekcije
const SELECT_AREA = ".tb-section, .tb-alt-body, .tb-checks, .tb-goals, .tb-title";
const MAX_QUOTE = 800;

// Besedilo izbora; formule (KaTeX) zamenja z LaTeX-om, da jih tutor prebere pravilno.
function selectionText(sel) {
  const parts = [];
  for (let i = 0; i < sel.rangeCount; i++) {
    // Izbor, ki se začne ali konča sredi formule, razširimo na celo formulo; sicer
    // kopija vsebuje le del izrisa brez LaTeX-a (npr. »x+2)(« namesto (x+2)(x-3)).
    const range = sel.getRangeAt(i).cloneRange();
    const katexOf = (n) => (n?.nodeType === 1 ? n : n?.parentElement)?.closest(".katex-display, .katex");
    const ks = katexOf(range.startContainer);
    const ke = katexOf(range.endContainer);
    if (ks) range.setStartBefore(ks);
    if (ke) range.setEndAfter(ke);
    const frag = range.cloneContents();
    frag.querySelectorAll(".katex").forEach((k) => {
      const tex = k.querySelector('annotation[encoding="application/x-tex"]')?.textContent;
      // Brez oznak klikljivih simbolov (\htmlData{fx=…}), sicer inštruktor in mehurček dobita »\htmlData«.
      if (tex) k.replaceWith(document.createTextNode(` $${plainTex(tex).trim()}$ `));
    });
    frag.querySelectorAll(".katex-mathml, button, .i").forEach((n) => n.remove());
    const div = document.createElement("div");
    div.appendChild(frag);
    parts.push(div.innerText ?? div.textContent);
  }
  return parts.join(" ").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

function selectionInLesson(sel) {
  if (!current || !sel || sel.isCollapsed || !sel.rangeCount) return null;
  const view = $("#view-textbook");
  if (!view || view.hidden || view.offsetParent === null) return null;
  const node = sel.getRangeAt(0).commonAncestorContainer;
  const el = node.nodeType === 1 ? node : node.parentElement;
  if (!el || !view.contains(el)) return null;
  // Izbor mora biti znotraj besedila lekcije (ne v gumbih ali menijih).
  const start = sel.anchorNode?.nodeType === 1 ? sel.anchorNode : sel.anchorNode?.parentElement;
  if (!el.closest(SELECT_AREA) && !start?.closest(SELECT_AREA)) return null;
  // Stran »Lekcija še nastaja« nima snovi (ne obvestilo ne naslov ali cilji): tam »Razloži« ne ponudimo.
  if (view.querySelector(".tb-pending")) return null;
  const text = selectionText(sel);
  return text.length >= 2 ? text : null;
}

function askButton() {
  let b = document.getElementById("tb-sel-ask");
  if (b) return b;
  b = document.createElement("button");
  b.type = "button";
  b.id = "tb-sel-ask";
  b.className = "tb-sel-ask";
  b.hidden = true;
  b.innerHTML = `${ic("message-circle")}Razloži`;
  // Ne izgubi izbora ob pritisku na gumb.
  b.addEventListener("mousedown", (e) => e.preventDefault());
  b.addEventListener("click", () => {
    const text = selectionInLesson(document.getSelection()) || b.dataset.text;
    b.hidden = true;
    if (!text || !current) return;
    const quote = text.length > MAX_QUOTE ? `${text.slice(0, MAX_QUOTE)} …` : text;
    document.getSelection()?.removeAllRanges();
    ctx.learnWithTutor(current, `V lekciji »${current.name}« mi ni jasen ta del:\n\n»${quote}«\n\nMi ga razložiš preprosteje, po korakih?`);
  });
  document.body.appendChild(b);
  return b;
}

function placeAskButton() {
  const b = askButton();
  const sel = document.getSelection();
  const text = selectionInLesson(sel);
  if (!text) {
    b.hidden = true;
    return;
  }
  b.dataset.text = text;
  b.hidden = false;
  const rects = [...sel.getRangeAt(0).getClientRects()].filter((r) => r.width || r.height);
  const r = rects.length ? rects[rects.length - 1] : sel.getRangeAt(0).getBoundingClientRect();
  // Pod izborom (nad njim telefon pokaže svoj meni Kopiraj/Izberi vse).
  const coarse = matchMedia("(pointer: coarse)").matches;
  const w = b.offsetWidth || 110;
  const left = Math.min(Math.max(8, r.left + r.width / 2 - w / 2), document.documentElement.clientWidth - w - 8);
  let top = r.bottom + (coarse ? 30 : 8);
  if (top + 44 > window.innerHeight) top = Math.max(8, r.top - 52);
  b.style.left = `${left + window.scrollX}px`;
  b.style.top = `${top + window.scrollY}px`;
}

function wireSelectionAsk() {
  let t = null;
  document.addEventListener("selectionchange", () => {
    clearTimeout(t);
    // Počakamo, da učenec konča z označevanjem (posebej na telefonu).
    t = setTimeout(placeAskButton, 250);
  });
  window.addEventListener("resize", () => document.getElementById("tb-sel-ask") && placeAskButton());
}

const esc = (s) => ctx.escapeHtml(String(s ?? ""));

// Odpre učbenik (kazalo ali zadnjo odprto lekcijo).
// Tipka Nazaj (telefon): iz odprte lekcije nazaj na seznam lekcij. Vrne true, če je bila lekcija odprta.
export function textbookBack() {
  if (!tb.topicId || !$("#view-textbook") || $("#view-textbook").closest("[hidden]")) return false;
  tb.topicId = null;
  renderHome();
  window.scrollTo(0, 0);
  return true;
}

/** Lekcija, odprta v Učbeniku (ali null na kazalu); za zadnji zaslon ob naslednjem odprtju (app.js). */
export const openLessonId = () => tb.topicId || null;

// Z Učne poti (»Nižji razredi so v Učbeniku«): odpre izbiro vseh učbenikov in razredov.
export function openTextbookLower() {
  syncProfile();
  Object.assign(tb, { browse: true, topicId: null });
}

export async function showTextbook() {
  const box = $("#view-textbook");
  if (!box) return;
  syncProfile();
  if (tb.topicId) return renderLesson(tb.topicId);
  await renderHome();
}

// Na širokem zaslonu so poskusi v desnem stolpcu (ostanejo vidni med branjem), sicer med besedilom.
// Isti pogoj kot v ui.css: računalnik od 1200 px ali tablica ležeče od 1000 px.
const WIDE = matchMedia("(min-width: 1200px), (min-width: 1000px) and (hover: none) and (pointer: coarse)");
// Po korakih ima vsak korak, ki simulacijo omenja, svoje mesto zanjo (data-demos); simulacija se
// premakne na mesto vidnega koraka in ohrani stanje (lesson-steps.js demoSteps).
function placeDemos(root = document) {
  root.querySelectorAll(".tb-lesson-grid").forEach((grid) => {
    const side = grid.querySelector(".tb-side");
    const slots = [...grid.querySelectorAll(".tb-demo-slot")];
    // Po zaporedni številki simulacije, ne po mestu v strani: premik na korak spremeni vrstni red v DOM.
    const nr = (d) => Number(d.querySelector(".tb-demo-mount")?.dataset.sim || 0);
    const demos = [...grid.querySelectorAll(".tb-demo, .tb-locked")].sort((a, b) => nr(a) - nr(b));
    if (!demos.length) return;
    if (WIDE.matches || !slots.length) return side.append(...demos);
    const shown = slots.filter((s) => !s.closest(".tb-step[hidden]"));
    demos.forEach((d, i) => {
      const mine = (s) => !s.dataset.demos || s.dataset.demos.split(",").includes(String(i));
      const slot = shown.find(mine) || slots.find(mine) || slots[0];
      if (d.parentElement !== slot) slot.append(d);
    });
  });
}
WIDE.addEventListener?.("change", () => placeDemos());

export async function openLesson(topicId) {
  syncProfile();
  tb.topicId = topicId;
  ctx.showView("textbook");
}

async function renderHome() {
  const my = ++navSeq;
  stopReading();
  current = null;
  const box = $("#view-textbook");
  const student = ctx.getStudent();
  syncProfile();
  // Študent fakultete: najprej učbenik njegovega študijskega programa, nato OŠ/SŠ.
  const program = jeFaks(student?.settings) ? student.settings.study_program || "" : "";
  const system = student?.settings?.school_system || "SI";
  if (!tb.books.length || tb.program !== program || tb.system !== system) {
    const books = await ctx.api(`/api/textbook/books?system=${encodeURIComponent(system)}${program ? `&program=${encodeURIComponent(program)}` : ""}`);
    // Stanje šele po preverjanju: zavržen odgovor ne sme pustiti novih knjig brez ponastavitve predmeta in poti.
    if (my !== navSeq) return;
    tb.program = program;
    tb.system = system;
    tb.books = books;
    tb.subject = null;
    tb.book = null;
    tb.group = null;
    tb.myPath = null;
  }
  if (tb.myPath === null) {
    const key = (await ctx.api(`/api/students/${student.id}/path`).catch(() => null))?.key || "";
    if (my !== navSeq) return;
    tb.myPath = key;
  }
  // Privzeto: učbenik predmeta in ravni, ki ju učenec ima v učni poti.
  if (!tb.subject) tb.subject = program ? "PROG" : (tb.myPath || student?.settings?.subject || "MAT").split("-")[0];
  const subjects = [...new Map(tb.books.map((b) => [b.subject, b.subject === "PROG" ? t("tbk.myStudy") : b.subjectName])).entries()];
  if (!subjects.some(([k]) => k === tb.subject)) tb.subject = subjects[0]?.[0];
  const books = tb.books.filter((b) => b.subject === tb.subject);
  if (!books.some((b) => b.key === tb.book)) {
    const mine = tb.myPath.split("-");
    tb.book = (books.find((b) => mine[0] === b.subject && mine[1] === b.school) || books[0])?.key || null;
  }
  const book = books.find((b) => b.key === tb.book);
  const SHORT = { OS: t("lp.os"), SS: t("lp.ss"), TEK: t("nav.competition") };
  const levelName = (b) => SHORT[b.school] || b.schoolName.charAt(0).toUpperCase() + b.schoolName.slice(1);
  box.innerHTML = `
    <div class="tb-head">
      <h1>${ic("book-open")}${esc(t("nav.textbook"))}</h1>
      <p class="muted">${esc(t(tb.browse ? "tbk.introBrowse" : "tbk.intro"))}</p>
      <div class="tb-search">
        <input id="tb-q" type="search" placeholder="${esc(t("tbk.searchPh"))}" value="${esc(tb.query)}" aria-label="${esc(t("tbk.searchAria"))}" autocomplete="off">
      </div>
      ${tb.browse ? "" : `<button type="button" class="text-btn tb-browse" id="tb-browse">${ic("library")}${esc(t("tbk.browse"))}</button>`}
      <div class="tb-filters"${tb.browse ? "" : " hidden"}>
        <div class="seg" role="tablist" aria-label="${esc(t("set.subject"))}">${subjects
          .map(([k, v]) => `<button type="button" role="tab" data-subj="${esc(k)}" class="${k === tb.subject ? "active" : ""}" aria-selected="${k === tb.subject}">${esc(v)}</button>`)
          .join("")}</div>
        ${books.length > 1 ? `<div class="seg" role="tablist" aria-label="${esc(t("tbk.level"))}">${books
          .map((b) => `<button type="button" role="tab" data-book="${esc(b.key)}" class="${b.key === tb.book ? "active" : ""}" aria-selected="${b.key === tb.book}">${esc(levelName(b))}</button>`)
          .join("")}</div>` : ""}
      </div>
      ${book ? `<div class="tb-book card">
        <div><p class="eyebrow">${esc(t("nav.textbook"))}</p><h2>${esc(book.subjectName)} · ${esc(book.schoolName)}</h2>
        <p class="muted">${esc(t(book.lessons < book.topics ? "tbk.countMore" : "tbk.count", { done: book.lessons, total: book.topics }))}</p></div>
        <div class="tb-book-actions">
          <a class="btn-primary tb-book-pdf" href="${esc(pdfHref(book.key))}" target="_blank" rel="noopener">${ic("download")}${esc(t("tbk.pdfAll"))}</a>
          ${book.formulas ? `<a class="btn-secondary tb-book-pdf" href="${esc(pdfHref(book.key, { topic: "formule" }))}" target="_blank" rel="noopener">${ic("sigma")}${esc(t("tbk.pdfFormulas"))}</a>` : ""}
        </div>
        ${book.subject === "PROG" ? `<div class="seg tb-mode" role="tablist" aria-label="${esc(t("refs.title"))}">
          <button type="button" role="tab" data-mode="lessons" class="${tb.mode !== "refs" ? "active" : ""}" aria-selected="${tb.mode !== "refs"}">${ic("book-open")}${esc(t("refs.tabLessons"))}</button>
          <button type="button" role="tab" data-mode="refs" class="${tb.mode === "refs" ? "active" : ""}" aria-selected="${tb.mode === "refs"}">${ic("library")}${esc(t("refs.title"))}</button>
        </div>` : ""}
      </div>` : ""}
    </div>
    <div id="tb-body"></div>`;
  const q = $("#tb-q");
  let timer;
  q.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      tb.query = q.value.trim();
      renderBody();
    }, 200);
  });
  // Privzeto učenec vidi samo svoj učbenik (predmet in raven iz učne poti); druge odpre na zahtevo.
  $("#tb-browse")?.addEventListener("click", () => {
    tb.browse = true;
    renderHome();
  });
  box.querySelectorAll("[data-subj]").forEach((b) =>
    b.addEventListener("click", () => {
      tb.subject = b.dataset.subj;
      tb.book = null;
      tb.group = null;
      renderHome();
    }),
  );
  box.querySelectorAll("[data-mode]").forEach((b) =>
    b.addEventListener("click", () => {
      tb.mode = b.dataset.mode;
      box.querySelectorAll("[data-mode]").forEach((x) => {
        x.classList.toggle("active", x === b);
        x.setAttribute("aria-selected", String(x === b));
      });
      renderBody();
    }),
  );
  box.querySelectorAll("[data-book]").forEach((b) =>
    b.addEventListener("click", () => {
      tb.book = b.dataset.book;
      tb.group = null;
      renderHome();
    }),
  );
  await renderBody();
}

async function renderBody() {
  const body = $("#tb-body");
  if (!body) return;
  const my = ++bodySeq;
  const stale = () => my !== bodySeq || !body.isConnected;
  // Napaka iskanja ali kazala: sporočilo namesto zadetkov starejše poizvedbe (in brez neobravnavane zavrnitve).
  const failed = (err) => {
    if (stale()) return;
    // 502/503 od gostitelja (objava nove različice): »Strežnik se ne odziva«, ne »Ni povezave« (app.js api, offline).
    const msg = err?.status ? t("common.error", { status: err.status }) : err?.offline && err.message ? err.message : t("off.noConnection");
    body.innerHTML = `<div class="card" role="alert"><p>${esc(msg)}</p></div>`;
  };
  if (tb.query.length >= 2) {
    let hits;
    try {
      hits = await ctx.api(`/api/textbook/search?q=${encodeURIComponent(tb.query)}&system=${encodeURIComponent(tb.system || "SI")}`);
    } catch (err) {
      return failed(err);
    }
    if (stale()) return;
    body.innerHTML = hits.length
      ? `<p class="muted">${esc(t("tbk.hits", { q: tb.query }))}</p><ul class="tb-list">${hits
          .map(
            (h) => `<li><button type="button" class="tb-topic" data-lesson="${esc(h.id)}">
              <span class="tb-name">${esc(h.name)}</span>
              <span class="tb-sub">${esc(h.pathLabel)} · ${esc(h.unit)}</span>
              ${h.snippet ? `<span class="tb-snip">${esc(h.snippet)}</span>` : ""}
            </button></li>`,
          )
          .join("")}</ul>`
      : `<div class="card"><p>${esc(t("tbk.noHits", { q: tb.query }))}</p></div>`;
    return;
  }
  if (!tb.book) {
    body.innerHTML = `<div class="card"><p>${esc(t("tbk.noBook"))}</p></div>`;
    return;
  }
  let book;
  try {
    book = await ctx.api(`/api/textbook/toc?book=${encodeURIComponent(tb.book)}&system=${encodeURIComponent(tb.system || "SI")}`);
  } catch (err) {
    return failed(err);
  }
  if (stale()) return;
  if (book.subject === "PROG" && tb.mode === "refs") return renderRefs(body, book, stale);
  const unitHtml = (u, i, pathKey) => `<section class="card tb-unit">
        <h2><span class="tb-num">${i + 1}</span>${esc(u.title)}</h2>
        <ul class="tb-list">${u.topics
          .map(
            (tp) => `<li><button type="button" class="tb-topic ${tp.lesson ? "" : "pending"}" data-lesson="${esc(tp.id)}">
              <span class="tb-name">${esc(tp.name)}</span>
              <span class="tb-badges">
                ${tp.lesson ? `<span class="tb-badge">${esc(t("tbk.lesson"))}</span>` : ""}
                ${tp.demo ? `<span class="tb-badge demo">${esc(t("tbk.demo"))}</span>` : ""}
                ${tp.practice ? `<span class="tb-badge vaje">${esc(t("tbk.practice"))}</span>` : ""}
              </span>
            </button></li>`,
          )
          .join("")}</ul>
        ${u.topics.some((tp) => tp.lesson) ? `<p class="tb-unit-pdf"><a class="tb-pdf" href="${esc(pdfHref(pathKey, { unit: u.title }))}" target="_blank" rel="noopener">${ic("download")}${esc(t("tbk.pdfUnit"))}</a></p>` : ""}
      </section>`;
  // Prikažemo razred/letnik iz Nastavitev; druge lahko izbereš zgoraj (ali »Vse«).
  const groups = groupsOf(book);
  if (tb.group !== "ALL" && !groups.some((g) => g.name === tb.group)) tb.group = defaultGroup(groups);
  const mineGroup = groups.find((g) => g.parts.some((p) => p.key === tb.myPath))?.name;
  const shown = tb.group === "ALL" ? book.parts : groups.find((g) => g.name === tb.group)?.parts || book.parts;
  const chip = (key, label) =>
    `<button type="button" data-group="${esc(key)}" class="${key === tb.group ? "active" : ""}" aria-pressed="${key === tb.group}">${esc(label)}${key === mineGroup ? ` <span class="tb-mine">${esc(t("tbk.mine"))}</span>` : ""}</button>`;
  body.innerHTML = `${groups.length > 1 ? `<nav class="tb-jump chip-row" aria-label="${esc(t(book.subject === "PROG" || book.school === "SS" ? "tbk.year" : "tbk.grade"))}">${groups
      .map((g) => chip(g.name, g.name))
      .join("")}${chip("ALL", t("refs.all"))}</nav>` : ""}
    ${shown
      .map(
        (p) => `<section class="tb-part" id="tb-part-${esc(p.key)}">
        <div class="tb-part-head"><h2>${esc(p.label)}</h2>
          <a class="tb-pdf" href="${esc(pdfHref(p.key))}" target="_blank" rel="noopener">${ic("download")}${esc(t("tbk.pdfPart"))}</a></div>
        ${p.units.map((u, i) => unitHtml(u, i, p.key)).join("")}
      </section>`,
      )
      .join("")}`;
  body.querySelectorAll("[data-group]").forEach((b) =>
    b.addEventListener("click", () => {
      tb.group = b.dataset.group;
      renderBody();
    }),
  );
}

// Klik na temo v kazalu ali iskanju.
document.addEventListener("click", (e) => {
  const b = e.target.closest("#view-textbook [data-lesson]");
  if (b) {
    tb.topicId = b.dataset.lesson;
    renderLesson(tb.topicId);
  }
});

// Formula in rešitev v rešenem primeru sta skriti za gumbom, da učenec najprej poskusi sam.
// Kadar je vsaka črka formule klikljiva s pomenom iz lekcije (:::simboli), okna »Pokaži formulo«
// ni (j, 1. 11. 2026): formula je razložena že v rešitvi. V PDF-ju ostane.
// Grafi z drsniki (»drsnik:« v bloku :::risba graf): izris naložimo šele, ko ga lekcija potrebuje. Brez
// povezave ali ob napaki ostane strežniška slika pri začetnih vrednostih.
function oziviRisbe(root) {
  if (root?.querySelector("figure.risba-ziva")) import("./risbe-zive.js").then((m) => m.oziviRisbe(root)).catch(() => {});
}

function wireFormulas(root) {
  root.querySelectorAll("details.tb-formula").forEach((d) => {
    const fx = [...d.querySelectorAll("[data-fx]")].map((el) => decodeURIComponent(el.dataset.fx.replace(/\./g, "%")).split(":"));
    const syms = fx.filter(([kind]) => kind !== "u");
    if (!syms.length || syms.some(([, subj]) => subj?.[0] !== "@")) return;
    if (![...d.querySelectorAll(".katex-html .mathnormal")].some((x) => !x.closest("[data-fx]"))) d.remove();
  });
  root.querySelectorAll("details.tb-formula").forEach((d) =>
    d.addEventListener("toggle", () => {
      d.querySelector("summary").textContent = d.open ? "Skrij formulo" : "Pokaži formulo";
    }),
  );
  root.querySelectorAll("details.tb-solution").forEach((d) =>
    d.addEventListener("toggle", () => {
      d.querySelector("summary").textContent = d.open ? "Skrij rešitev" : "Pokaži rešitev";
    }),
  );
}

async function renderLesson(topicId) {
  const my = ++navSeq;
  stopReading();
  const box = $("#view-textbook");
  let L;
  try {
    L = await ctx.api(`/api/students/${ctx.getStudent().id}/lesson?id=${encodeURIComponent(topicId)}`);
  } catch (err) {
    // Brez povezave: javna kopija že obiskane lekcije iz predpomnilnika (public/sw.js, samo besedilo).
    L = err?.status ? null : await ctx.api(`/api/lesson?id=${encodeURIComponent(topicId)}`).catch(() => null);
    if (my !== navSeq) return;
    if (!L) {
      tb.topicId = null;
      return renderHome();
    }
  }
  if (my !== navSeq) return;
  current = { id: L.id, name: L.name };
  // Simboli v formulah po predmetu lekcije (FIZ-OS-9 → fizika, fakultetna tema → njen predmet), ne po
  // predmetu v nastavitvah. Oznake lekcije (:::simboli) imajo prednost: T v T = I/I₀ je prepustnost.
  // Fakultetna tema (UNI-…) ima predmet v podatkih (KEM, FIZ …); »UNI« sam ni predmet (bila bi tabela MAT).
  const lessonSubject = L.subject || (/^UNI-/.test(L.id || "") ? null : (/^([A-Z]{3})-/.exec(L.id || "") || [])[1]);
  // Tema za pomen dvoumnih črk: ime lekcije in sklopa (x₁ je ničla le v lekciji o kvadratni enačbi).
  const R = (text) => withFormulaSubject(lessonSubject, () => ctx.renderRich(text), L.lesson?.symbols, [L.name, L.unit].filter(Boolean).join(" · "));
  const lesson = L.lesson;
  const sections = lesson?.sections || [];
  // Demonstracijo postavimo za rešene primere (ali za razlago, če primerov ni).
  let demoAfter = sections.findIndex((s) => /rešen/i.test(s.title));
  if (demoAfter < 0) demoAfter = sections.findIndex((s) => /razlag/i.test(s.title));
  if (demoAfter < 0) demoAfter = sections.length - 1;
  const explainAt = sections.findIndex((s) => /razlag/i.test(s.title));
  const altAt = explainAt >= 0 ? explainAt : 0;

  const locked = !L.interactive && !!L.locked?.demo;
  const demos = L.demos || (L.demo ? [L.demo] : []);
  const demoHtml = demos.length
    ? demos.map((d, i) => `<section class="card tb-demo"><h2>${ic("flask-conical")}Preizkusi sam: ${esc(d.title)}</h2><div class="tb-demo-mount" data-sim="${i}"></div></section>`).join("")
    : locked
      ? `<section class="card tb-locked"><h2>${ic("lock")}Poskus: ${esc(L.locked.demo)}</h2>
          <p>Interaktivni poskusi, simulacije in sprotno preverjanje so na voljo v plačljivem paketu in med 7-dnevnim preizkusom. Besedilo lekcije in PDF sta brezplačna.</p>
          ${!L.offers || (L.offers.show && L.offers.prices) ? `<button type="button" class="primary" id="tb-upgrade">${ic("sparkles")}Poglej pakete</button>` : ""}</section>`
      : "";
  const altHtml = lesson?.alternatives?.length
    ? `<div class="tb-alt">
        <button type="button" class="secondary" id="tb-alt-btn">${ic("refresh-cw")}Razloži drugače</button>
        <div id="tb-alt-box" hidden>
          <div class="tb-alt-tabs chip-row" role="tablist">${lesson.alternatives
            .map((a, i) => `<button type="button" role="tab" data-alt="${i}" class="${i ? "" : "active"}">${esc(a.title)}</button>`)
            .join("")}</div>
          <div class="tb-alt-body" id="tb-alt-body"></div>
        </div>
      </div>`
    : "";
  const SLOT = '<div class="tb-demo-slot"></div>';
  const sectionCls = (title) => (/povzetek/i.test(title) ? "tb-summary" : /napak/i.test(title) ? "tb-mistakes" : /zakaj/i.test(title) ? "tb-why" : "");
  const sectionHtml = sections
    .map((s, i) => {
      return `<section class="card tb-section ${sectionCls(s.title)}">${s.title ? `<h2>${esc(s.title)}</h2>` : ""}<div class="explanation">${R(s.md)}</div>${
        i === altAt ? altHtml : ""
      }</section>${i === demoAfter ? SLOT : ""}`;
    })
    .join("");

  // Tema brez lekcije in brez razlage: le obvestilo (ni česa označiti in »Razložiti«), gumb pa vpraša o temi.
  const pending = !lesson && !L.explanation;
  const pendingNext = L.demo && L.practice ? "tbk.pendingDemoPractice" : L.demo ? "tbk.pendingDemo" : L.practice ? "tbk.pendingPractice" : "tbk.pendingAsk";
  const fallback = !lesson
    ? pending
      ? `<section class="card tb-section tb-pending"><div class="explanation"><p>${esc(t("tbk.pending"))}${/^(zh|ja)/.test(locale()) ? "" : " "}${esc(t(pendingNext))}</p></div>
        <div class="actions"><button type="button" class="primary" id="tb-ask-topic">${ic("message-circle")}${esc(t("tbk.askTopic"))}</button></div></section>${SLOT}`
      : `<section class="card tb-section"><div class="explanation">${R(L.explanation)}</div></section>${SLOT}`
    : "";

  const typedItem = (c, qi, tag) => `<${tag} class="tb-check tb-typed" data-q="${qi}"><div class="tb-q">${R(c.q)}</div><div class="tb-typed-body"></div></${tag}>`;
  const staticItem = (c, qi) =>
    c.type
      ? typedItem(c, qi, "li")
      : `<li><div class="tb-q">${R(c.q)}</div><ol type="a">${c.options.map((o) => `<li>${R(o)}</li>`).join("")}</ol>
      <details><summary>Rešitev</summary>${"abcdefgh"[c.correct]}) ${c.why ? R(c.why) : ""}</details></li>`;
  const liveItem = (c, qi) =>
    c.type
      ? typedItem(c, qi, "div")
      : `<div class="tb-check" data-q="${qi}">
            <div class="tb-q">${R(c.q)}</div>
            <div class="tb-opts">${c.options.map((o, oi) => `<button type="button" class="tb-opt" data-o="${oi}">${R(o)}</button>`).join("")}</div>
            <div class="tb-why" hidden></div>
          </div>`;
  // Vprašanja »Preveri se« (vsa ali le nekatera, pri prikazu po korakih).
  const checksCard = (idx, title = "Preveri se") =>
    `<section class="card tb-checks"><h2>${ic("circle-help")}${esc(title)}</h2>${
      L.interactive
        ? idx.map((qi) => liveItem(lesson.checks[qi], qi)).join("")
        : `<ol start="${idx[0] + 1}">${idx.map((qi) => staticItem(lesson.checks[qi], qi)).join("")}</ol>`
    }</section>`;
  const nChecks = lesson?.checks?.length || 0;
  const checksHtml = nChecks ? checksCard(lesson.checks.map((_, i) => i)) : "";

  // Po korakih (privzeto): kratke kartice, vmes vprašanje, spodaj Nazaj / Naprej.
  const stepMode = !!lesson && sections.length > 0 && stepPref();
  const steps = stepMode ? lessonSteps(sections, nChecks) : [];
  // Simulacija je na istem koraku kot besedilo, ki jo omenja (j, 2. 11. 2026).
  const onStep = steps.map(() => []);
  if (steps.length) demoSteps(steps, demos.length ? demos : locked ? [{ title: L.locked.demo }] : [], demoAfter).forEach((ks, i) => ks.forEach((k) => onStep[k]?.push(i)));
  const stepSlot = (k) => (onStep[k].length ? `<div class="tb-demo-slot" data-demos="${onStep[k].join(",")}"></div>` : "");
  const stepsHtml = steps
    .map((st, k) => {
      const body =
        st.type === "check"
          ? checksCard(st.checks, st.final ? "Preveri se" : t("tb.steps.quick"))
          : `<section class="card tb-section ${sectionCls(st.title)}">${st.title ? `<h2>${esc(st.title)}</h2>` : ""}<div class="explanation">${R(st.md)}</div>${
              st.last && st.section === altAt ? altHtml : ""
            }</section>${stepSlot(k)}`;
      return `<div class="tb-step" data-step="${k}"${k ? " hidden" : ""}>${body}</div>`;
    })
    .join("");
  const stepper = stepMode
    ? `<div class="tb-stepper">
        <button type="button" class="tb-step-btn" id="tb-step-prev" aria-label="${esc(t("tb.steps.prev"))}" title="${esc(t("tb.steps.prev"))}">${ic("arrow-left")}</button>
        <span class="tb-step-count" aria-live="polite"></span>
        <button type="button" class="tb-step-btn next" id="tb-step-next" aria-label="${esc(t("tb.steps.next"))}" title="${esc(t("tb.steps.next"))}">${ic("arrow-right")}</button>
      </div>`
    : "";
  const modeBtn = lesson
    ? `<button type="button" class="ghost tb-mode-btn" id="tb-mode">${ic(stepMode ? "file-text" : "layers")}${esc(t(stepMode ? "tb.steps.all" : "tb.steps.byStep"))}</button>`
    : "";

  // Ista tema v Laboratoriju ali 3D svetu (public/sim/katalog.js, strežnik: lessonView → links): en dotik odpre poskus
  // v zavihku Laboratorij ali atlas oziroma model čez cel zaslon.
  const linkHtml = (L.links || []).length
    ? `<div class="tb-links">${L.links
        .map((k) =>
          k.kind === "lab"
            ? `<button type="button" class="tb-link" data-tb-lab="${esc(k.key)}" aria-label="${esc(t("tb.openLab", { title: k.title }))}">${ic("flask-conical")}<span><small>${esc(t("tb.inLab"))}</small><b dir="auto">${esc(k.title)}</b></span></button>`
            : `<button type="button" class="tb-link" data-tb-3d="${esc(k.id)}" data-title="${esc(k.title)}"${k.zacetek ? ` data-zacetek="${esc(new URLSearchParams(k.zacetek).toString())}"` : ""} aria-label="${esc(t("tb.open3d", { title: k.title }))}">${ic("box")}<span><small>${esc(t("tb.in3d"))}</small><b dir="auto">${esc(k.title)}</b></span></button>`,
        )
        .join("")}</div>`
    : "";
  // »Prijavi napako« v vsaki lekciji (tudi brez besedila lekcije): prijava gre skrbniku (server/reports.js).
  const reportBtn = `<button type="button" class="ghost tb-report-btn" id="tb-report" aria-expanded="false">${ic("flag")}<span>${esc(t("rep.btn"))}</span></button>`;
  // »Kaj zdaj?«: po korakih je del zadnjega koraka, nad krogi Nazaj · 1/12 · Naprej (ti plavajo na dnu nad
  // vsebino; vrstica zavzame svojo višino na koncu, zato zadnje vrstice odpeljemo nadnjo). Krogi so za mrežo,
  // ne v levem stolpcu: na računalniku s poskusi desno je ← levo spodaj, številka na sredini in → desno spodaj.
  const nextHtml = `<section class="card tb-next"${stepMode ? " hidden" : ""}>
    <h2>Kaj zdaj?</h2>
    ${L.practice || !pending ? `<div class="actions">
      ${L.practice ? `<button type="button" class="primary" id="tb-practice">${ic("pencil")}Vadi naloge</button>` : ""}
      ${lesson ? `<button type="button" class="secondary" data-ustno="${esc(L.id)}">${ic("mic")}${esc(t("ustno.vprasajMe"))}</button>` : ""}
      ${pending ? "" : `<button type="button" class="secondary" id="tb-ask">${ic("message-circle")}Še ni jasno? Vprašaj inštruktorja</button>`}
    </div>` : ""}
    <div class="tb-nav">
      ${L.prev ? `<button type="button" class="ghost" data-lesson="${esc(L.prev.id)}">← ${esc(L.prev.name)}</button>` : "<span></span>"}
      ${L.next ? `<button type="button" class="ghost" data-lesson="${esc(L.next.id)}">${esc(L.next.name)} →</button>` : ""}
    </div>
  </section>`;
  box.innerHTML = `<div class="tb-lesson-grid${demoHtml ? " has-side" : ""}"><div class="tb-main">
    <button type="button" class="ghost back tb-back" id="tb-back">${ic("arrow-left")}${esc(t("nav.textbook"))}</button>
    <p class="muted tb-crumb">${esc(L.pathLabel)} · ${esc(L.unit)}</p>
    <h1 class="tb-title">${esc(L.name)}</h1>
    ${lesson ? `<div class="tb-tools"><a class="tb-pdf" href="${esc(pdfHref(L.path, { topic: L.id.split("/")[1] }))}" target="_blank" rel="noopener">${ic("download")}${esc(t("tbk.pdfLesson"))}</a>${L.unit ? `<a class="tb-pdf" href="${esc(pdfHref(L.path, { unit: L.unit }))}" target="_blank" rel="noopener">${ic("download")}${esc(t("tbk.pdfUnit"))}</a>` : ""}${modeBtn}<span class="tb-gradiva"></span>${reportBtn}</div>` : `<div class="tb-tools">${reportBtn}</div>`}
    ${linkHtml}
    ${pending ? "" : `<p class="muted tb-sel-hint">${ic("message-circle")}Ti kakšen del ni jasen? Označi ga in pritisni »Razloži«.</p>`}
    ${L.goals ? `<p class="tb-goals"><b>Cilji:</b> ${esc(L.goals)}</p>` : ""}
    ${L.pretest_due ? `<section class="card tb-pretest"><h2>${ic("target")}${esc(t("pretest.title"))}</h2><p>${esc(t("pretest.lessonIntro"))}</p><button type="button" class="primary" id="tb-pretest">${ic("play")}${esc(t("pretest.start"))}</button></section>` : ""}
    ${lesson && lesson.status !== "pregledano" ? `<p class="tb-draft">Osnutek: lekcijo mora še pregledati učitelj. Če opaziš napako, pritisni »Prijavi napako«.</p>` : ""}
    ${stepMode ? `<div class="tb-progress" role="progressbar" aria-valuemin="1" aria-valuemax="${steps.length}"><span></span></div>${stepsHtml}${nextHtml}` : `${sectionHtml}${fallback}${checksHtml}${nextHtml}`}
    </div><aside class="tb-side">${demoHtml}</aside></div>${stepper}`;
  placeDemos(box);
  window.scrollTo(0, 0);
  // Gradiva (povzetek na eni strani, branje na glas, delovni list) naložimo zraven.
  const gr = box.querySelector(".tb-gradiva");
  if (gr) {
    const sid = ctx.getStudent().id;
    gradivaHtml(sid, L.id).then((html) => {
      if (!gr.isConnected || current?.id !== L.id) return;
      gr.innerHTML = html;
      wireGradiva(gr, sid);
    });
  }
  box.scrollTop = 0;

  $("#tb-back").addEventListener("click", () => {
    tb.topicId = null;
    renderHome();
  });
  wireFormulas(box);
  prilagodiSirino(box);
  oziviRisbe(box);
  wireLessonReport($("#tb-report"), {
    api: ctx.api,
    studentId: ctx.getStudent().id,
    topic: L.id,
    // Korak lekcije po korakih (1, 2 …), sicer brez.
    step: () => {
      const st = box.querySelector(".tb-step:not([hidden])");
      return st ? Number(st.dataset.step) + 1 : null;
    },
    toast: ctx.toast,
  });
  box.querySelectorAll("[data-tb-lab]").forEach((b) => b.addEventListener("click", () => ctx.openLab?.(b.dataset.tbLab)));
  // getAttribute: »data-tb-3d« v dataset ni »tb3d« (vezaj pred števko ostane, ključ je »tb-3d«).
  // data-zacetek: začetne vrednosti modela iz kataloga (faks lekcije: faks=1), open3d jih doda v naslov /3d#<id>?…
  box.querySelectorAll("[data-tb-3d]").forEach((b) =>
    b.addEventListener("click", () => ctx.open3d?.(b.getAttribute("data-tb-3d"), b.dataset.title, b.dataset.zacetek ? Object.fromEntries(new URLSearchParams(b.dataset.zacetek)) : null)),
  );
  box.querySelectorAll(".tb-demo-mount").forEach((m) => {
    const d = demos[Number(m.dataset.sim)];
    mountSim(d.id, m, d.opts);
  });
  // Zavihek Račun se izriše ob kliku nanj (account.js); sam showView bi pokazal prazen pogled.
  $("#tb-upgrade")?.addEventListener("click", () => document.querySelector("#account-tab")?.click());
  // Razloži drugače
  const altBody = $("#tb-alt-body");
  const showAlt = (i) => {
    box.querySelectorAll("[data-alt]").forEach((b) => b.classList.toggle("active", Number(b.dataset.alt) === i));
    altBody.innerHTML = `<div class="explanation">${R(lesson.alternatives[i].md)}</div>`;
    wireFormulas(altBody);
    prilagodiSirino(altBody);
    oziviRisbe(altBody);
  };
  $("#tb-alt-btn")?.addEventListener("click", () => {
    const altBox = $("#tb-alt-box");
    altBox.hidden = !altBox.hidden;
    if (!altBox.hidden) showAlt(0);
  });
  box.querySelectorAll("[data-alt]").forEach((b) => b.addEventListener("click", () => showAlt(Number(b.dataset.alt))));
  // Preveri se. Prvi odgovor na vsako vprašanje gre tudi med šibke točke (strežnik sam preveri pravilnost).
  const answered = new Set();
  const sendFirst = (qi, body) => {
    const sid = ctx.getStudent()?.id;
    if (sid && !answered.has(qi)) {
      answered.add(qi);
      ctx.api(`/api/students/${sid}/lesson-check`, { method: "POST", body: { topic: L.id, q: qi, ...body } }).catch(() => {});
    }
  };
  if (box.querySelector(".tb-typed"))
    import("./preveri-se-ziv.js")
      .then((m) => current?.id === L.id && m.oziviPreveri(box, { checks: lesson.checks, interactive: !!L.interactive, R, esc, ic, send: sendFirst, fit: prilagodiSirino }))
      .catch(() => {});
  if (L.interactive) box.querySelectorAll(".tb-check:not(.tb-typed)").forEach((el) => {
    const qi = Number(el.dataset.q);
    const c = lesson.checks[qi];
    el.querySelectorAll(".tb-opt").forEach((b) =>
      b.addEventListener("click", () => {
        const o = Number(b.dataset.o);
        const ok = o === c.correct;
        const sid = ctx.getStudent()?.id;
        if (sid && !answered.has(qi)) {
          answered.add(qi);
          ctx.api(`/api/students/${sid}/lesson-check`, { method: "POST", body: { topic: L.id, q: qi, o } }).catch(() => {});
        }
        b.classList.add(ok ? "ok" : "bad");
        const why = el.querySelector(".tb-why");
        why.hidden = false;
        why.className = `tb-why fb ${ok ? "ok" : "bad"}`;
        const wrongWhy = c.optionWhy?.[o];
        why.innerHTML = `<div>${ok
          ? `Pravilno! ${c.why ? R(c.why) : ""}`
          : wrongWhy
          ? `Ni čisto tako. ${R(wrongWhy)} Poskusi še enkrat.`
          : "Ni čisto tako. Premisli še enkrat ali preberi razlago zgoraj."}</div>`;
        prilagodiSirino(why);
        if (ok) el.querySelectorAll(".tb-opt").forEach((x) => (x.disabled = true));
      }),
    );
  });
  $("#tb-mode")?.addEventListener("click", () => {
    setStepPref(!stepMode);
    renderLesson(topicId);
  });
  if (stepMode) wireSteps(box, L.id, steps.length);
  $("#tb-practice")?.addEventListener("click", async () => {
    if (!(await ctx.openTopic(L.id))) ctx.nextPractice();
  });
  $("#tb-pretest")?.addEventListener("click", () => ctx.openTopic(L.id));
  $("#tb-ask")?.addEventListener("click", () =>
    ctx.learnWithTutor({ id: L.id, name: L.name }, `Prebral sem lekcijo »${L.name}«, pa mi še ni čisto jasno. Mi razložiš na drug način?`),
  );
  // Lekcija še nastaja: inštruktor začne s temo (»Začniva s temo: …«, z imenom teme).
  $("#tb-ask-topic")?.addEventListener("click", () => ctx.learnWithTutor({ id: L.id, name: L.name }));
}

// ---------- Lekcija po korakih ----------
const STEP_PREF = "tb-steps";
function stepPref() {
  try {
    return localStorage.getItem(STEP_PREF) !== "0";
  } catch {
    return true;
  }
}
function setStepPref(on) {
  try {
    localStorage.setItem(STEP_PREF, on ? "1" : "0");
  } catch {}
}
function wireSteps(box, lessonId, n) {
  const key = `tb-step:${lessonId}`;
  const all = [...box.querySelectorAll(".tb-step")];
  const bar = box.querySelector(".tb-progress");
  const count = box.querySelector(".tb-step-count");
  const prev = $("#tb-step-prev");
  const next = $("#tb-step-next");
  const end = box.querySelector(".tb-next");
  let cur = 0;
  const go = (k, scroll) => {
    cur = Math.max(0, Math.min(n - 1, k));
    all.forEach((el, i) => (el.hidden = i !== cur));
    placeDemos(box);
    count.innerHTML = `<b>${cur + 1}</b><small>/${n}</small>`;
    count.setAttribute("aria-label", t("tb.steps.count", { n: cur + 1, m: n }));
    bar.setAttribute("aria-valuenow", String(cur + 1));
    bar.firstElementChild.style.width = `${((cur + 1) / n) * 100}%`;
    prev.disabled = cur === 0;
    next.disabled = cur === n - 1;
    end.hidden = cur !== n - 1;
    try {
      sessionStorage.setItem(key, String(cur));
    } catch {}
    if (scroll && bar.getBoundingClientRect().top < 0) bar.scrollIntoView({ block: "start" });
  };
  prev.addEventListener("click", () => go(cur - 1, true));
  next.addEventListener("click", () => go(cur + 1, true));
  let saved = 0;
  try {
    saved = Number(sessionStorage.getItem(key)) || 0;
  } catch {}
  go(saved < n ? saved : 0, false);
  // Mehurček inštruktorja se umakne nad krog Naprej (okna.js).
  window.dispatchEvent(new CustomEvent("evklid:stepper"));
}

// ---------- Referenčni material (fakultetni predmeti) ----------
// Prosto dostopni zunanji viri po predmetih programa: učbeniki, zapiski, video, naloge.
// Podatki: content/references/*.json prek /api/references.
const REF_TYPES = ["ucbenik", "zapiski", "video", "naloge", "tecaj", "prirocnik"];
const REF_ICONS = { ucbenik: "book-open", zapiski: "notebook-pen", video: "monitor-play", naloge: "list-checks", tecaj: "graduation-cap", prirocnik: "file-text" };
const REF_SHOWN = 5;

function langName(code) {
  try {
    const n = new Intl.DisplayNames([locale()], { type: "language" }).of(code);
    return n ? n.charAt(0).toUpperCase() + n.slice(1) : code;
  } catch {
    return code;
  }
}

const refRow = (it) => `<a class="list-row ref-row" href="${esc(it.url)}" target="_blank" rel="noopener noreferrer">
    <span class="ic">${ic(REF_ICONS[it.type] || "file-text")}</span>
    <span class="lr-text">
      <b>${esc(it.title)}</b>
      <small>${esc([it.source, it.author].filter(Boolean).join(" · "))}</small>
      ${it.desc ? `<span class="ref-desc">${esc(it.desc)}</span>` : ""}
      <span class="tb-badges ref-badges">
        <span class="tb-badge">${esc(t(`refs.type.${it.type}`))}</span>
        <span class="tb-badge ref-lang">${esc(langName(it.lang))}</span>
        ${it.theme ? "" : `<span class="tb-badge vaje">${esc(t("refs.faculty"))}</span>`}
        ${it.license ? `<span class="ref-license">${esc(t("refs.license", { license: it.license }))}</span>` : ""}
      </span>
    </span>
    ${ic("external-link")}<span class="sr-only">${esc(t("refs.newTab"))}</span>
  </a>`;

async function renderRefs(body, book, stale) {
  if (tb.refs?.program !== tb.program) {
    body.innerHTML = `<p class="muted">${esc(t("common.loading"))}</p>`;
    try {
      const refs = await ctx.api(`/api/references?program=${encodeURIComponent(tb.program)}`);
      if (stale()) return;
      tb.refs = refs;
    } catch {
      if (stale()) return;
      tb.refs = null;
      body.innerHTML = `<div class="card"><p>${esc(t("refs.none"))}</p></div>`;
      return;
    }
  }
  const groups = groupsOf(book);
  if (tb.group !== "ALL" && !groups.some((g) => g.name === tb.group)) tb.group = defaultGroup(groups);
  const courses = tb.refs.courses.filter((c) => tb.group === "ALL" || c.group === tb.group);
  const keep = (it) => (!tb.refType || it.type === tb.refType) && (!tb.refSl || it.lang === "sl");
  const chip = (attr, key, label, on) =>
    `<button type="button" ${attr}="${esc(key)}" class="${on ? "active" : ""}" aria-pressed="${on}">${esc(label)}</button>`;
  const types = REF_TYPES.filter((ty) => tb.refs.courses.some((c) => c.items.some((it) => it.type === ty)));
  const courseHtml = (c) => {
    const items = c.items.filter(keep);
    const open = tb.refOpen.has(c.key);
    const shown = open ? items : items.slice(0, REF_SHOWN);
    return `<section class="card ref-course">
      <h2>${esc(c.label)}</h2>
      ${c.themes.length ? `<p class="muted ref-area">${esc(t("refs.area", { areas: c.themes.join(", ") }))}</p>` : ""}
      ${items.length
        ? `<div class="list-card ref-list">${shown.map(refRow).join("")}</div>
          ${items.length > REF_SHOWN ? `<button type="button" class="text-btn ref-more" data-ref-more="${esc(c.key)}">${esc(open ? t("refs.showLess") : t("refs.showAll", { count: items.length }))}</button>` : ""}`
        : `<p class="muted">${esc(c.items.length ? t("refs.noneFilter") : t("refs.none"))}</p>`}
    </section>`;
  };
  body.innerHTML = `
    <p class="muted ref-intro">${esc(t("refs.intro"))}</p>
    ${groups.length > 1 ? `<nav class="tb-jump chip-row" aria-label="Letnik">${groups.map((g) => chip("data-group", g.name, g.name, g.name === tb.group)).join("")}${chip("data-group", "ALL", t("refs.all"), tb.group === "ALL")}</nav>` : ""}
    <div class="chip-row ref-filters" aria-label="${esc(t("refs.filter"))}">
      ${chip("data-ref-type", "", t("refs.all"), !tb.refType)}
      ${types.map((ty) => chip("data-ref-type", ty, t(`refs.type.${ty}`), tb.refType === ty)).join("")}
      ${chip("data-ref-sl", "1", t("refs.onlySl"), tb.refSl)}
    </div>
    <div class="ref-courses">${courses.map(courseHtml).join("")}</div>`;
  body.querySelectorAll("[data-group]").forEach((b) =>
    b.addEventListener("click", () => {
      tb.group = b.dataset.group;
      renderBody();
    }),
  );
  body.querySelectorAll("[data-ref-type]").forEach((b) =>
    b.addEventListener("click", () => {
      tb.refType = b.dataset.refType;
      renderBody();
    }),
  );
  body.querySelector("[data-ref-sl]")?.addEventListener("click", () => {
    tb.refSl = !tb.refSl;
    renderBody();
  });
  body.querySelectorAll("[data-ref-more]").forEach((b) =>
    b.addEventListener("click", () => {
      const k = b.dataset.refMore;
      if (tb.refOpen.has(k)) tb.refOpen.delete(k);
      else tb.refOpen.add(k);
      renderBody();
    }),
  );
}

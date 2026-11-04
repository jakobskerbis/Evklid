// Naša pola v slogu pretekle pole NPZ ali mature (server/our-papers.js, content/exam-papers): naloge napiše Evklid
// (AI) z enako zgradbo, kot jo ima izvirna pola RIC, nikoli njenega besedila. Odpre se čez cel zaslon kot
// pregledovalnik prenesene pole (public/paper-viewer.js, isti razredi .pv). Pri vsakem delu: »Pokaži rešitev«
// (odgovor, razlaga na več načinov, točkovanje, pogosta napaka), »Imam prav« (učenec si sam šteje točke) in
// »Vprašaj inštruktorja« (nov pogovor z nalogo; rešitev dobi inštruktor kot skrit kontekst).
import { t } from "./i18n.js";
import { icon } from "./icons.js";
import { partKey, partLabel } from "./our-paper-key.js";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const label = partKey;

let current = null;
export const ourPaperOpen = () => !!current;
export function closeOurPaper() {
  if (!current) return false;
  current.close();
  return true;
}

// paper: JSON pole; title: oznaka (»Naša pola v slogu NPZ 9 – Matematika, 2026«); rich(md) → HTML;
// onTutor(task, part): vprašaj inštruktorja; score: { get() → { "1a": true }, set(obj) } (shrani napravo).
export function openOurPaper(paper, { title, rich, onTutor, score = null }) {
  closeOurPaper();
  const back = document.activeElement;
  const got = { ...(score?.get?.() || {}) };
  const max = paper.tasks.reduce((s, tk) => s + tk.parts.reduce((a, p) => a + p.points, 0), 0);
  const el = document.createElement("div");
  el.className = "pv op";
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-modal", "true");
  el.setAttribute("aria-label", title);
  el.tabIndex = -1;
  const sum = () => paper.tasks.reduce((s, tk) => s + tk.parts.reduce((a, p) => a + (got[label(tk, p)] ? p.points : 0), 0), 0);
  // Figure preveri že strežnik (server/our-papers.js, validatePaper); DOMPurify (globalen, public/rich.js) še enkrat.
  const clean = (svg) => (globalThis.DOMPurify ? globalThis.DOMPurify.sanitize(svg, { USE_PROFILES: { svg: true } }) : "");
  const fig = (svg) => (svg ? `<figure class="op-fig">${clean(svg)}</figure>` : "");
  // Naslov izpitne pole (čas, pripomočki) in dela (»A) Kratke naloge«), kadar se začne nova.
  const headings = (tk, prev) => {
    let h = "";
    if (tk.pola && tk.pola !== prev?.pola) {
      const info = (paper.polas || []).find((x) => x.pola === tk.pola);
      h += `<h2 class="op-pola">${esc(t("pp.oursPola", { n: tk.pola }))}${info?.minutes ? ` <small>${esc(`${info.minutes} min`)}</small>` : ""}</h2>${info?.tools ? `<p class="op-tools">${esc(info.tools)}</p>` : ""}`;
    }
    if (tk.section && (tk.section !== prev?.section || tk.pola !== prev?.pola)) h += `<h3 class="op-section">${esc(paper.sections?.[tk.section] || `${tk.section})`)}</h3>`;
    return h;
  };
  const partHtml = (tk, p) => {
    const id = label(tk, p);
    const choices = p.format === "choice" && p.choices ? `<ol class="op-choices" type="A">${p.choices.map((c) => `<li>${rich(c)}</li>`).join("")}</ol>` : "";
    const ways = (p.ways || []).map((w, i) => `<section class="op-way"><h4>${esc(w.title || t("pp.oursWay", { n: i + 1 }))}</h4>${rich(w.text)}</section>`).join("");
    return `<li class="op-part" data-op="${esc(id)}">
      <div class="op-q"><span class="op-no">${esc(p.id ? `${p.id})` : `${tk.section || ""}${tk.n}.`)}</span><div class="op-text">${rich(p.text || "")}${fig(p.figure)}${choices}</div><span class="op-pts">${esc(t("pp.oursPoints", { n: p.points }))}</span></div>
      <div class="op-actions">
        <button type="button" class="secondary small" data-op-show aria-expanded="false">${icon("eye")}<span>${esc(t("pp.oursShow"))}</span></button>
        ${onTutor ? `<button type="button" class="secondary small" data-op-tutor>${icon("message-circle")}<span>${esc(t("pp.oursTutor"))}</span></button>` : ""}
        <label class="op-got"><input type="checkbox" data-op-got ${got[id] ? "checked" : ""}><span>${esc(t("pp.oursGot"))}</span></label>
      </div>
      <div class="op-sol" hidden>
        <div class="op-answer"><b>${esc(t("pp.oursAnswer"))}</b> ${rich(p.answer)}</div>
        ${fig(p.solutionFigure)}
        ${ways}
        ${p.scoring ? `<div class="op-note"><b>${esc(t("pp.oursScoring"))}</b> ${rich(p.scoring)}</div>` : ""}
        ${p.mistake ? `<div class="op-note op-mistake"><b>${esc(t("pp.oursMistake"))}</b> ${rich(p.mistake)}</div>` : ""}
      </div>
    </li>`;
  };
  el.innerHTML = `<header class="pv-bar">
      <button type="button" class="ghost pv-ic" data-op-close aria-label="${esc(t("pp.viewerClose"))}" title="${esc(t("pp.viewerClose"))}">${icon("x")}</button>
      <div class="pv-title"><b>${esc(title)}</b><small>${esc(t("pp.oursInfo", { minutes: paper.minutes, points: max }))}</small></div>
      <span class="op-score" aria-live="polite"></span>
    </header>
    <div class="pv-scroll"><div class="op-body">
      <p class="op-about">${icon("info")}<span>${esc(t("pp.oursAbout"))}</span></p>
      ${paper.tools ? `<p class="op-tools">${esc(paper.tools)}</p>` : ""}
      ${paper.tasks
        .map((tk, i) => `${headings(tk, paper.tasks[i - 1])}<article class="op-task"><h3>${esc(t("pp.oursTask", { n: `${tk.section || ""}${tk.n}` }))}</h3>${tk.intro ? rich(tk.intro) : ""}${fig(tk.figure)}<ol class="op-parts">${tk.parts.map((p) => partHtml(tk, p)).join("")}</ol></article>`)
        .join("")}
    </div></div>`;
  const showScore = () => (el.querySelector(".op-score").textContent = t("pp.oursScore", { got: sum(), max }));
  showScore();
  const find = (node) => {
    const li = node.closest("[data-op]");
    if (!li) return null;
    for (const tk of paper.tasks) for (const p of tk.parts) if (label(tk, p) === li.dataset.op) return { li, tk, p };
    return null;
  };
  el.addEventListener("click", (e) => {
    if (e.target.closest("[data-op-close]")) return close();
    const show = e.target.closest("[data-op-show]");
    if (show) {
      const sol = show.closest("[data-op]").querySelector(".op-sol");
      sol.hidden = !sol.hidden;
      show.setAttribute("aria-expanded", String(!sol.hidden));
      show.querySelector("span").textContent = t(sol.hidden ? "pp.oursShow" : "pp.oursHide");
      return;
    }
    const tutor = e.target.closest("[data-op-tutor]");
    if (tutor) {
      const f = find(tutor);
      if (f) {
        close();
        onTutor(f.tk, f.p);
      }
    }
  });
  el.addEventListener("change", (e) => {
    const box = e.target.closest("[data-op-got]");
    const f = box && find(box);
    if (!f) return;
    if (box.checked) got[label(f.tk, f.p)] = true;
    else delete got[label(f.tk, f.p)];
    score?.set?.(got);
    showScore();
  });
  el.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      close();
    }
  });
  const close = () => {
    if (!current) return;
    current = null;
    el.remove();
    document.documentElement.classList.remove("pv-open");
    back?.focus?.();
  };
  current = { close };
  document.body.append(el);
  document.documentElement.classList.add("pv-open");
  el.querySelector("[data-op-close]").focus();
  return el;
}

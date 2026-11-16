// Naša pola v slogu pretekle pole NPZ ali mature (server/our-papers.js, content/exam-papers): naloge napiše Evklid
// (AI) z enako zgradbo, kot jo ima izvirna pola RIC, nikoli njenega besedila. Odpre se čez cel zaslon kot
// pregledovalnik prenesene pole (public/paper-viewer.js, isti razredi .pv). Pri vsakem delu: »Pokaži rešitev«
// (odgovor, razlaga na več načinov, točkovanje, pogosta napaka), »Imam prav« (učenec si sam šteje točke) in
// »Vprašaj inštruktorja« (nov pogovor z nalogo; rešitev dobi inštruktor kot skrit kontekst).
import { t, locale } from "./i18n.js";
import { prilagodiSirino } from "./sirina.js";
import { icon } from "./icons.js";
import { zadrziFokus } from "./fokus-okna.js";
import { partKey } from "./our-paper-key.js";

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
// onTutor(task, part): vprašaj inštruktorja; score: { get() → { "1a": true }, set(obj) } (shrani napravo);
// onChecked([{ key, ok }]): ob zaprtju deli, pri katerih je učenec odprl rešitev ali (od)označil »Imam prav«
// (za šibke točke; ok = označeno).
export function openOurPaper(paper, { title, rich, onTutor, score = null, onChecked = null }) {
  closeOurPaper();
  const back = document.activeElement;
  const got = { ...(score?.get?.() || {}) };
  const touched = new Set();
  // maxPoints: izpit, pri katerem učenec izbere le nekaj nalog (pola našteje vse, šteje pa le izbrane).
  const max = paper.maxPoints || paper.tasks.reduce((s, tk) => s + tk.parts.reduce((a, p) => a + p.points, 0), 0);
  const el = document.createElement("div");
  el.className = "pv op";
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-modal", "true");
  el.setAttribute("aria-label", title);
  el.tabIndex = -1;
  const sum = () => Math.min(max, paper.tasks.reduce((s, tk) => s + tk.parts.reduce((a, p) => a + (got[label(tk, p)] ? p.points : 0), 0), 0));
  // Figure preveri že strežnik (server/our-papers.js, validatePaper); DOMPurify (globalen, public/rich.js) še enkrat.
  // Profil svg odstrani <use>; dovolimo ga kot strežnik, a samo z notranjo povezavo (href="#oznaka").
  let figNo = 0;
  const clean = (svg) => {
    if (!globalThis.DOMPurify) return "";
    const frag = globalThis.DOMPurify.sanitize(svg, { USE_PROFILES: { svg: true }, ADD_TAGS: ["use"], RETURN_DOM_FRAGMENT: true });
    for (const u of frag.querySelectorAll("use")) if ([...u.attributes].some((a) => a.localName === "href" && !a.value.startsWith("#"))) u.remove();
    // Oznake (id) so v vsaki sliki svoje: več slik z istim id="ar" bi delilo puščice, skrita rešitev pa bi jih skrila drugim.
    const ids = new Map();
    for (const n of frag.querySelectorAll("[id]")) ids.set(n.id, (n.id = `op${++figNo}-${n.id}`));
    if (ids.size)
      for (const n of frag.querySelectorAll("*"))
        for (const a of [...n.attributes]) {
          const v = a.value.replace(/url\(\s*(["']?)#([^"')\s]+)\1\s*\)/g, (m, q, id) => (ids.has(id) ? `url(#${ids.get(id)})` : m));
          const w = a.localName === "href" && v.startsWith("#") && ids.has(v.slice(1)) ? `#${ids.get(v.slice(1))}` : v;
          if (w !== a.value) a.value = w;
        }
    const box = document.createElement("div");
    box.append(frag);
    return box.innerHTML;
  };
  const fig = (svg) => (svg ? `<figure class="op-fig">${clean(svg)}</figure>` : "");
  // »90 minut« / »90 دقيقة« v jeziku vmesnika (števke latinske kot v glavi).
  const minutes = (n) => {
    try {
      return new Intl.NumberFormat(`${locale()}-u-nu-latn`, { style: "unit", unit: "minute", unitDisplay: "long" }).format(n);
    } catch {
      return `${n} min`;
    }
  };
  // Naslov izpitne pole (čas, pripomočki) in dela (»A) Kratke naloge«), kadar se začne nova.
  const headings = (tk, prev) => {
    let h = "";
    if (tk.pola && tk.pola !== prev?.pola) {
      const info = (paper.polas || []).find((x) => x.pola === tk.pola);
      h += `<h2 class="op-pola">${esc(t("pp.oursPola", { n: tk.pola }))}${info?.minutes ? ` <small>${esc(minutes(info.minutes))}</small>` : ""}</h2>${info?.tools ? `<p class="op-tools">${esc(info.tools)}</p>` : ""}`;
    }
    if (tk.section && (tk.section !== prev?.section || tk.pola !== prev?.pola)) h += `<h3 class="op-section">${esc(`${tk.section}) ${paper.sections?.[tk.section] || ""}`.trim())}</h3>`;
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
      ${paper.tools && !(paper.polas?.length && paper.polas.every((x) => x.tools)) ? `<p class="op-tools">${esc(paper.tools)}</p>` : ""}
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
      touched.add(show.closest("[data-op]").dataset.op);
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
    touched.add(label(f.tk, f.p));
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
  let sprosti = () => {}; // zadrziFokus spodaj; close() je varen tudi, če izris prej vrže napako
  const close = () => {
    if (!current) return;
    current = null;
    if (touched.size && onChecked) onChecked([...touched].map((key) => ({ key, ok: !!got[key] })));
    sprosti({ vrni: false });
    el.remove();
    document.documentElement.classList.remove("pv-open");
    back?.focus?.();
  };
  current = { close };
  document.body.append(el);
  document.documentElement.classList.add("pv-open");
  // Predolga formula se zloži pri enačajih, preširoka formula ali tabela se najprej pomanjša (public/sirina.js);
  // skrite rešitve se prilagodijo, ko se pokažejo.
  prilagodiSirino(el, { vrstice: false });
  sprosti = zadrziFokus(el, { zacetni: el.querySelector("[data-op-close]"), prej: back });
  return el;
}

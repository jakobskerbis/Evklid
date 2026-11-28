// Naša pola v slogu pretekle pole NPZ ali mature (server/our-papers.js, content/exam-papers): naloge napiše Evklid
// (AI) z enako zgradbo, kot jo ima izvirna pola RIC, nikoli njenega besedila. Odpre se čez cel zaslon kot
// pregledovalnik prenesene pole (public/paper-viewer.js, isti razredi .pv). Izbirne odgovore učenec označi z dotikom,
// rešitve (odgovor, razlaga na več načinov, točkovanje, pogosta napaka) so samo na koncu (»Preveri rešitve«); tam
// si pri delih brez samodejne ocene sam šteje točke (»Imam prav«). »Vprašaj inštruktorja«: nov pogovor z nalogo
// (rešitev dobi inštruktor kot skrit kontekst).
import { t, locale } from "./i18n.js";
import { prilagodiSirino } from "./sirina.js";
import { icon } from "./icons.js";
import { oznakeHtml } from "./oznake-vsebine.js";
import { zadrziFokus, escZaOkno } from "./fokus-okna.js";
import { partKey, simPolas } from "./our-paper-key.js";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const label = partKey;

// Izris delov naše pole (tudi za poskusni izpit, public/poskusna-pola.js): slike, naslovi izpitnih pol in delov,
// besedilo dela (vprašanje) in rešitev (odgovor, načini, točkovanje, pogosta napaka).
export function izrisPole(paper, rich) {
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
  // Izbirni del (j, 26. 11. 2026): odgovor učenec izbere z dotikom na črko ali besedilo možnosti (cel gumb, ≥ 44 px).
  // izb = { sel: [indeksi], konec } (konec: pokaži pravilne in napačno izbrane, brez spreminjanja); brez izb samo seznam.
  const choiceList = (p, izb) => {
    if (!izb) return `<ol class="op-choices" type="A">${p.choices.map((c) => `<li>${rich(c)}</li>`).join("")}</ol>`;
    const sel = new Set(izb.sel || []);
    const ok = new Set(Array.isArray(p.correct) ? p.correct : []);
    const vec = ok.size > 1;
    const items = p.choices.map((c, i) => {
      const crka = String.fromCharCode(65 + i);
      const on = sel.has(i);
      let cls = on ? " on" : "";
      let znak = "";
      if (izb.konec && ok.has(i)) (cls += " prav"), (znak = `<span class="op-ch-z">${icon("check")}<span class="sr-only">${esc(t("pp.oursRight"))}</span></span>`);
      else if (izb.konec && on) (cls += " narobe"), (znak = `<span class="op-ch-z">${icon("x")}<span class="sr-only">${esc(t("pp.oursWrong"))}</span></span>`);
      return `<li><button type="button" class="choice op-ch${cls}" data-op-ch="${i}" aria-pressed="${on}"${izb.konec ? ' aria-disabled="true"' : ""}><span class="op-ch-l" aria-hidden="true">${crka}</span><span class="sr-only">${crka}.</span><span class="op-ch-t">${rich(c)}</span>${znak}</button></li>`;
    });
    return `<ul class="op-choices op-chs" aria-label="${esc(t(vec ? "pp.oursPickMany" : "pp.oursPickOne"))}">${items.join("")}</ul>`;
  };
  const question = (tk, p, izb = null) => {
    const choices = p.format === "choice" && p.choices ? choiceList(p, izb) : "";
    return `<div class="op-q"><span class="op-no">${esc(p.id ? `${p.id})` : `${tk.section || ""}${tk.n}.`)}</span><div class="op-text">${rich(p.text || "")}${fig(p.figure)}${choices}</div><span class="op-pts">${esc(t("pp.oursPoints", { n: p.points }))}</span></div>`;
  };
  const solution = (tk, p) => {
    const ways = (p.ways || []).map((w, i) => `<section class="op-way"><h4>${esc(w.title || t("pp.oursWay", { n: i + 1 }))}</h4>${rich(w.text)}</section>`).join("");
    return `<div class="op-answer"><b>${esc(t("pp.oursAnswer"))}</b> ${rich(p.answer)}</div>
        ${fig(p.solutionFigure)}
        ${ways}
        ${p.scoring ? `<div class="op-note"><b>${esc(t("pp.oursScoring"))}</b> ${rich(p.scoring)}</div>` : ""}
        ${p.mistake ? `<div class="op-note op-mistake"><b>${esc(t("pp.oursMistake"))}</b> ${rich(p.mistake)}</div>` : ""}`;
  };
  // Poskusni izpit (ocena na telefonu): odgovor in točkovanje pred točkami, postopek (načini, pogosta napaka) zložen.
  const kratko = (tk, p) =>
    `<div class="op-answer"><b>${esc(t("pp.oursAnswer"))}</b> ${rich(p.answer)}</div>${fig(p.solutionFigure)}${p.scoring ? `<div class="op-note"><b>${esc(t("pp.oursScoring"))}</b> ${rich(p.scoring)}</div>` : ""}`;
  const postopek = (tk, p) =>
    `${(p.ways || []).map((w, i) => `<section class="op-way"><h4>${esc(w.title || t("pp.oursWay", { n: i + 1 }))}</h4>${rich(w.text)}</section>`).join("")}${p.mistake ? `<div class="op-note op-mistake"><b>${esc(t("pp.oursMistake"))}</b> ${rich(p.mistake)}</div>` : ""}`;
  // Naloga z naslovom, uvodom in sliko; parts = HTML seznama delov.
  const task = (tk, i, parts) => `<article class="op-task" data-op-i="${i}"><h3>${esc(t("pp.oursTask", { n: `${tk.section || ""}${tk.n}` }))}</h3>${tk.intro ? rich(tk.intro) : ""}${fig(tk.figure)}<ol class="op-parts">${parts}</ol></article>`;
  return { fig, minutes, headings, question, solution, kratko, postopek, task };
}

// Izbirni del z enim pravilnim odgovorom: točke se štejejo same (izbran pravilni odgovor = vse točke dela). Pri več
// pravilnih (preglednice »vsakemu izrazu en odgovor«, točka za vsak pravilen) točke še vedno označi učenec.
export const samodejno = (p) => p.format === "choice" && Array.isArray(p.choices) && Array.isArray(p.correct) && p.correct.length === 1;
export const pravilno = (p, sel) => Array.isArray(sel) && sel.length === 1 && sel[0] === p.correct[0];
// Dotik na možnost: pri enem pravilnem odgovoru zamenja izbiro (drugi dotik na isto jo pobriše), pri več jih preklaplja.
export function izberi(p, sel, i) {
  const now = Array.isArray(sel) ? sel : [];
  if (!(Number.isInteger(i) && i >= 0 && i < (p.choices || []).length)) return now;
  if ((p.correct || []).length > 1) return now.includes(i) ? now.filter((x) => x !== i) : [...now, i].sort((a, b) => a - b);
  return now.length === 1 && now[0] === i ? [] : [i];
}
// Gumbi možnosti v DOM po novi izbiri (brez ponovnega izrisa formul).
function oznaciIzbiro(li, sel) {
  for (const b of li.querySelectorAll("[data-op-ch]")) {
    const on = sel.includes(Number(b.dataset.opCh));
    b.classList.toggle("on", on);
    b.setAttribute("aria-pressed", String(on));
  }
}

let current = null;
export const ourPaperOpen = () => !!current;
export function closeOurPaper() {
  if (!current) return false;
  current.close();
  return true;
}

// paper: JSON pole; title: oznaka (»Naša pola v slogu NPZ 9 – Matematika, 2026«); rich(md) → HTML;
// onTutor(task, part): vprašaj inštruktorja; score: { get() → { "1a": true, _izb: { "1b": [2] }, _konec: true }, set(obj) }
// (shrani napravo; ključi delov = »Imam prav«, _izb = izbrani odgovori, _konec = rešitve so odprte);
// onChecked([{ key, ok, sel? }]): ob zaprtju (ali »Reši znova«) deli, ki jih je učenec preveril (za šibke točke;
// ok = prav): ob koncu vsi deli razen izbirnih brez odgovora; izbirni z enim pravilnim pošlje še izbiro (sel). focus: indeks naloge v paper.tasks, pri
// kateri se pola odpre (klepet, naloga-pole.js).
// Rešitve so samo na koncu (j, 26. 11. 2026): med reševanjem jih ni, »Preveri rešitve« pod zadnjo nalogo odpre vse
// hkrati, izbirne dele z enim pravilnim odgovorom oceni sam, pri drugih učenec označi »Imam prav«.
export function openOurPaper(paper, { title, rich, onTutor, score = null, onChecked = null, focus = null }) {
  closeOurPaper();
  const back = document.activeElement;
  const saved = score?.get?.() || {};
  const got = {};
  for (const [k, v] of Object.entries(saved)) if (!k.startsWith("_") && v === true) got[k] = true;
  let izb = saved._izb && typeof saved._izb === "object" && !Array.isArray(saved._izb) ? { ...saved._izb } : {};
  // Prej shranjena pola z označenimi točkami (pred 26. 11. 2026 so bile rešitve pri vsakem delu) se odpre preverjena.
  let konec = !!saved._konec || Object.keys(got).length > 0;
  const touched = new Set();
  let redo = false; // »Reši znova« zahteva drugi pritisk (brez okna brskalnika)
  // maxPoints: izpit, pri katerem učenec izbere le nekaj nalog (pola našteje vse, šteje pa le izbrane).
  const max = paper.maxPoints || paper.tasks.reduce((s, tk) => s + tk.parts.reduce((a, p) => a + p.points, 0), 0);
  const el = document.createElement("div");
  el.className = "pv op";
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-modal", "true");
  el.setAttribute("aria-label", title);
  el.tabIndex = -1;
  const sum = () => Math.min(max, paper.tasks.reduce((s, tk) => s + tk.parts.reduce((a, p) => a + (got[label(tk, p)] ? p.points : 0), 0), 0));
  const save = () => score?.set?.({ ...got, ...(Object.keys(izb).length ? { _izb: izb } : {}), ...(konec ? { _konec: true } : {}) });
  const r = izrisPole(paper, rich);
  const all = paper.tasks.flatMap((tk) => tk.parts.map((p) => ({ tk, p, id: label(tk, p) })));
  const izbirni = all.filter((x) => x.p.format === "choice" && x.p.choices);
  // Po koncu: izbirni del z enim pravilnim odgovorom pokaže izid, drugi dobijo »Imam prav«.
  const izid = (p, id) => {
    if (!izb[id]?.length) return `<span class="op-izid">${esc(t("pp.oursNone"))}</span>`;
    const ok = pravilno(p, izb[id]);
    return `<span class="op-izid ${ok ? "prav" : "narobe"}">${icon(ok ? "check" : "x")}<span>${esc(t(ok ? "pp.oursChoiceOk" : "pp.oursChoiceBad", { n: ok ? p.points : 0 }))}</span></span>`;
  };
  const partHtml = (tk, p) => {
    const id = label(tk, p);
    const choice = p.format === "choice" && p.choices;
    // Stara shranjena pola: izbirni del z »Imam prav« brez izbire ostane s kljukico (da jo učenec lahko odznači).
    const oceni = konec ? (samodejno(p) && (izb[id]?.length || !got[id]) ? izid(p, id) : `<label class="op-got"><input type="checkbox" data-op-got ${got[id] ? "checked" : ""}><span>${esc(t("pp.oursGot"))}</span></label>`) : "";
    const tutor = onTutor ? `<button type="button" class="secondary small" data-op-tutor>${icon("message-circle")}<span>${esc(t("pp.oursTutor"))}</span></button>` : "";
    return `<li class="op-part" data-op="${esc(id)}">
      ${r.question(tk, p, choice ? { sel: izb[id], konec } : null)}
      ${tutor || oceni ? `<div class="op-actions">${oceni}${tutor}</div>` : ""}
      ${konec ? `<div class="op-sol">${r.solution(tk, p)}</div>` : ""}
    </li>`;
  };
  const endHtml = () => {
    if (!konec) {
      const n = izbirni.filter((x) => izb[x.id]?.length).length;
      return `<div class="op-sim-end"><p class="muted small-note" data-op-rest>${esc(izbirni.length ? t("pp.oursChosen", { done: n, all: izbirni.length }) : t("pp.oursEndNote"))}</p>
        <button type="button" class="primary big" data-op-finish>${icon("check")}<span>${esc(t("pp.oursCheck"))}</span></button></div>`;
    }
    return `<div class="op-sim-end"><button type="button" class="text-btn" data-op-redo>${icon("rotate-ccw")}<span>${esc(t("pp.oursRedo"))}</span></button></div>`;
  };
  const bodyHtml = () => `<p class="op-about">${icon("info")}<span>${esc(t(konec ? "pp.oursAboutDone" : "pp.oursAbout"))}</span></p>
      ${oznakeHtml(paper.labels, { ikona: icon, vrsta: "pola" })}
      ${paper.tools && !(paper.polas?.length && paper.polas.every((x) => x.tools)) ? `<p class="op-tools">${esc(paper.tools)}</p>` : ""}
      ${paper.tasks.map((tk, i) => `${r.headings(tk, paper.tasks[i - 1])}${r.task(tk, i, tk.parts.map((p) => partHtml(tk, p)).join(""))}`).join("")}
      ${endHtml()}`;
  el.innerHTML = `<header class="pv-bar">
      <button type="button" class="ghost pv-ic" data-op-close aria-label="${esc(t("pp.viewerClose"))}" title="${esc(t("pp.viewerClose"))}">${icon("x")}</button>
      <div class="pv-title"><b>${esc(title)}</b><small>${esc(t("pp.oursInfo", { minutes: paper.minutes, points: max }))}</small></div>
      <span class="op-score" aria-live="polite"></span>
    </header>
    <div class="pv-scroll"><div class="op-body">${bodyHtml()}</div></div>`;
  const showScore = () => (el.querySelector(".op-score").textContent = konec ? t("pp.oursScore", { got: sum(), max }) : t("pp.oursScore", { got: "–", max }));
  showScore();
  // Nov izris telesa (konec, »Reši znova«): na vrh pole, fokus na gumb ×.
  const rerender = () => {
    redo = false;
    el.querySelector(".op-body").innerHTML = bodyHtml();
    prilagodiSirino(el, { vrstice: false });
    el.querySelector(".pv-scroll")?.scrollTo?.(0, 0);
    showScore();
    el.querySelector("[data-op-close]")?.focus();
  };
  const oddaj = () => {
    const po = new Map(all.map((x) => [x.id, x.p]));
    if (touched.size && onChecked) onChecked([...touched].map((key) => (samodejno(po.get(key)) && izb[key]?.length ? { key, ok: !!got[key], sel: izb[key] } : { key, ok: !!got[key] })));
    touched.clear();
  };
  const find = (node) => {
    const li = node.closest("[data-op]");
    if (!li) return null;
    const x = all.find((y) => y.id === li.dataset.op);
    return x ? { li, tk: x.tk, p: x.p } : null;
  };
  el.addEventListener("click", (e) => {
    if (e.target.closest("[data-op-close]")) return close();
    const ch = e.target.closest("[data-op-ch]");
    if (ch) {
      const f = find(ch);
      if (!f || konec) return;
      const id = label(f.tk, f.p);
      const sel = izberi(f.p, izb[id], Number(ch.dataset.opCh));
      if (sel.length) izb[id] = sel;
      else delete izb[id];
      oznaciIzbiro(f.li, sel);
      save();
      const rest = el.querySelector("[data-op-rest]");
      if (rest) rest.textContent = t("pp.oursChosen", { done: izbirni.filter((x) => izb[x.id]?.length).length, all: izbirni.length });
      return;
    }
    if (e.target.closest("[data-op-finish]")) {
      konec = true;
      // Šibke točke: kot prej odprta rešitev so zdaj odprte vse; neoznačen del je napaka le, če učenec polo res
      // ocenjuje (strežnik: vsaj en »Imam prav« ali izbirni odgovor). Izbirni del brez odgovora ne šteje.
      for (const x of all) {
        if (samodejno(x.p)) {
          if (pravilno(x.p, izb[x.id])) got[x.id] = true;
          else delete got[x.id];
          if (izb[x.id]?.length) touched.add(x.id);
        } else touched.add(x.id);
      }
      save();
      return rerender();
    }
    const rd = e.target.closest("[data-op-redo]");
    if (rd) {
      if (!redo) {
        redo = true;
        rd.querySelector("span").textContent = t("pi.resetSure");
        return;
      }
      oddaj();
      konec = false;
      izb = {};
      for (const k of Object.keys(got)) delete got[k];
      save();
      return rerender();
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
    save();
    showScore();
  });
  el.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      close();
    }
  });
  // Esc zapre polo tudi, ko fokus ni v njej (npr. na body, ko izgine element s fokusom). Kot gumb ×: izbrani odgovori
  // in označene točke ostanejo (save ob vsaki spremembi), šibke točke gredo na strežnik (onChecked).
  const naEsc = (e) => escZaOkno(e, el) && close();
  document.addEventListener("keydown", naEsc, true);
  let sprosti = () => {}; // zadrziFokus spodaj; close() je varen tudi, če izris prej vrže napako
  const close = () => {
    if (!current) return;
    current = null;
    document.removeEventListener("keydown", naEsc, true);
    oddaj();
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
  if (Number.isInteger(focus)) el.querySelector(`[data-op-i="${focus}"]`)?.scrollIntoView({ block: "start" });
  return el;
}

// ---------- Poskusni izpit na naši poli (server/poskusna-pola.js) ----------
// Ena izpitna pola s pravim časom: najprej uvod (čas, točke, pripomočki), nato pisanje brez rešitev (ura teče
// tudi, ko je pola zaprta), nato ocenjevanje po točkovniku (0 … točke dela), nato rezultat po temah z gumbom Vadi.
// paper, title, rich kot zgoraj (izpitne pole za uvod: simPolas, public/our-paper-key.js); store: { get() → stanje
// | null, set(stanje), clear() } (naprava); onSave({ pola, points, seconds }) → Promise<{ points, maxPoints, percent,
// topics, weak }>; onPractice(topicId); fokusPo() → element za fokus po zaprtju, če gumba, ki je polo odprl, ni več.
// Stanje: { pola, start (ms), phase: "write" | "grade", pts: { ključ: točke }, izb: { ključ: [izbrani odgovori] },
// spent (s, ob koncu pisanja) }.
export function openExamSim(paper, { title, rich, store, onSave, onPractice, fokusPo = null }) {
  closeOurPaper();
  const polas = simPolas(paper).map((x) => ({ ...x, points: x.maxPoints }));
  const back = document.activeElement;
  const r = izrisPole(paper, rich);
  let st = store.get();
  if (st && !polas.some((x) => x.pola === st.pola)) st = null;
  let timer = 0;
  let saving = false;
  let reset = false; // »Začni znova« zahteva drugi pritisk (brez okna brskalnika)
  const el = document.createElement("div");
  el.className = "pv op op-sim";
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-modal", "true");
  el.setAttribute("aria-label", title);
  el.tabIndex = -1;
  const info = () => polas.find((x) => x.pola === st?.pola) || polas[0];
  const tasksOf = (pola) => (pola === null ? paper.tasks : paper.tasks.filter((tk) => tk.pola === pola));
  const partsOf = (pola) => tasksOf(pola).flatMap((tk) => tk.parts.map((p) => ({ tk, p, key: label(tk, p) })));
  const left = () => Math.max(0, Math.round(info().minutes * 60 - (Date.now() - st.start) / 1000));
  const clock = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const sum = () => Math.min(info().points, partsOf(st.pola).reduce((a, x) => a + (st.pts[x.key] || 0), 0));
  const save = () => store.set(st);
  const bar = (right) => `<header class="pv-bar">
      <button type="button" class="ghost pv-ic" data-op-close aria-label="${esc(t("pp.viewerClose"))}" title="${esc(t("pp.viewerClose"))}">${icon("x")}</button>
      <div class="pv-title"><b>${esc(title)}</b><small>${esc(st?.pola ? t("pp.oursPola", { n: st.pola }) : st ? t("pi.whole") : t("pp.oursInfo", { minutes: paper.minutes, points: polas.reduce((a, x) => a + x.points, 0) }))}</small></div>
      ${right}
    </header>`;
  const body = (html) => `<div class="pv-scroll"><div class="op-body">${html}</div></div>`;
  // Naloge izbrane izpitne pole; part(tk, p, key) → HTML enega dela.
  const tasksHtml = (part) => {
    const list = tasksOf(st.pola);
    return list.map((tk, i) => `${r.headings(tk, list[i - 1])}${r.task(tk, paper.tasks.indexOf(tk), tk.parts.map((p) => part(tk, p, label(tk, p))).join(""))}`).join("");
  };
  const show = (html) => {
    reset = false;
    el.innerHTML = html;
    prilagodiSirino(el, { vrstice: false });
    el.querySelector(".pv-scroll")?.scrollTo?.(0, 0);
    el.querySelector("[data-op-close]")?.focus();
  };

  const intro = () => {
    clearInterval(timer);
    show(`${bar("")}${body(`
      <p class="op-about">${icon("info")}<span>${esc(t("pi.about"))}</span></p>
      <ul class="op-sim-polas">${polas
        .map(
          (x) => `<li class="card"><div><h2>${esc(x.pola ? t("pp.oursPola", { n: x.pola }) : t("pi.whole"))}</h2>
            <p class="muted">${esc(t("pi.polaInfo", { minutes: r.minutes(x.minutes), points: x.points }))}</p>
            ${x.tools ? `<p class="op-tools">${esc(x.tools)}</p>` : ""}${x.choice ? `<p class="op-tools">${esc(t("pi.choice"))}</p>` : ""}</div>
            <button type="button" class="primary" data-sim-start="${x.pola ?? ""}">${icon("timer")}<span>${esc(t("pi.start"))}</span></button></li>`,
        )
        .join("")}</ul>`)}`);
  };

  const write = () => {
    show(`${bar(`<span class="op-timer" role="timer" aria-live="off"></span>`)}${body(`
      <p class="op-about">${icon("notebook-pen")}<span>${esc(t("pi.writeNote"))}</span></p>
      ${tasksHtml((tk, p, key) => `<li class="op-part" data-op="${esc(key)}">${r.question(tk, p, p.format === "choice" && p.choices ? { sel: st.izb?.[key], konec: false } : null)}</li>`)}
      <div class="op-sim-end"><button type="button" class="primary big" data-sim-finish>${icon("check")}<span>${esc(t("pi.finish"))}</span></button>${resetBtn}</div>`)}`);
    const tick = () => {
      const s = left();
      const out = el.querySelector(".op-timer");
      if (out) {
        out.textContent = clock(s);
        out.classList.toggle("low", s <= 300);
        out.setAttribute("aria-label", t("pi.left", { time: clock(s) }));
      }
      if (!s) finish(true);
    };
    clearInterval(timer);
    timer = setInterval(tick, 1000);
    tick();
  };

  const finish = (timeUp = false) => {
    clearInterval(timer);
    st.phase = "grade";
    st.spent = Math.min(info().minutes * 60, Math.round((Date.now() - st.start) / 1000));
    // Izbirni del z enim pravilnim odgovorom, ki ga je učenec izbral, dobi točke sam (učenec jih lahko še popravi).
    for (const x of partsOf(st.pola)) if (samodejno(x.p) && st.izb?.[x.key]?.length && st.pts[x.key] === undefined) st.pts[x.key] = pravilno(x.p, st.izb[x.key]) ? x.p.points : 0;
    save();
    grade(timeUp);
  };

  const picker = (p, key) => {
    const cur = st.pts[key];
    let b = "";
    for (let n = 0; n <= p.points; n++) b += `<button type="button" class="op-pt${cur === n ? " on" : ""}" data-sim-pt="${n}" aria-pressed="${cur === n}">${n}</button>`;
    return `<div class="op-pick" role="group" aria-label="${esc(t("pi.pickLabel", { n: key.replace(/^\d+-/, "") }))}"><span>${esc(t("pi.pick"))}</span>${b}</div>`;
  };
  const resetBtn = `<button type="button" class="text-btn" data-sim-reset>${icon("rotate-ccw")}<span>${esc(t("pi.reset"))}</span></button>`;
  const graded = () => partsOf(st.pola).filter((x) => st.pts[x.key] !== undefined).length;
  const gradeHead = () => t("pp.oursScore", { got: sum(), max: info().points });

  const grade = (timeUp = false) => {
    show(`${bar(`<span class="op-score" aria-live="polite">${esc(gradeHead())}</span>`)}${body(`
      ${timeUp ? `<p class="op-about op-timeup">${icon("timer")}<span>${esc(t("pi.timeUp"))}</span></p>` : ""}
      <p class="op-about">${icon("info")}<span>${esc(t("pi.gradeNote"))}</span></p>
      ${tasksHtml((tk, p, key) => {
        const more = r.postopek(tk, p);
        return `<li class="op-part" data-op="${esc(key)}">${r.question(tk, p, p.format === "choice" && p.choices ? { sel: st.izb?.[key], konec: true } : null)}<div class="op-sol">${r.kratko(tk, p)}</div>${picker(p, key)}${more ? `<details class="op-more"><summary>${esc(t("pi.more"))}</summary><div class="op-sol">${more}</div></details>` : ""}</li>`;
      })}
      <div class="op-sim-end"><p class="muted small-note" data-sim-rest></p><button type="button" class="primary big" data-sim-save>${icon("check")}<span>${esc(t("pi.save"))}</span></button>${resetBtn}</div>`)}`);
    updateRest();
  };
  const updateRest = () => {
    const all = partsOf(st.pola).length;
    const n = all - graded();
    const rest = el.querySelector("[data-sim-rest]");
    if (rest) rest.textContent = [t("pi.gradeScore", { done: graded(), all }), n ? t(info().choice ? "pi.ungradedChoice" : "pi.ungraded", { n }) : ""].filter(Boolean).join(" ");
    const sc = el.querySelector(".op-score");
    if (sc) sc.textContent = gradeHead();
  };

  const result = (res) => {
    const pct = (g, m) => Math.round((100 * g) / m);
    show(`${bar("")}${body(`
      <section class="card op-sim-result">
        <div class="ring er-ring" style="--p:${res.percent}" role="img" aria-label="${esc(t("pi.resultAria", { got: res.points, max: res.maxPoints, pct: res.percent }))}"><span>${res.percent}%</span></div>
        <div><h2>${esc(t("pi.result", { got: res.points, max: res.maxPoints }))}</h2>
          <p class="muted">${esc(t("pi.time", { time: r.minutes(Math.max(1, Math.round((st.spent || 0) / 60))) }))}</p></div>
      </section>
      <h3>${esc(t("pi.byTopic"))}</h3>
      <ul class="op-sim-topics">${res.topics
        .map(
          (x) => `<li><span class="op-sim-name">${esc(x.name || t("pi.other"))}</span><span class="bar" aria-hidden="true"><i style="width:${pct(x.got, x.max)}%"></i></span><b>${esc(t("pp.oursScore", { got: x.got, max: x.max }))}</b>${
            x.id && x.got / x.max < 0.7 ? `<button type="button" class="secondary small" data-sim-practice="${esc(x.id)}">${icon("pencil")}<span>${esc(t("ready.practice"))}</span></button>` : ""
          }</li>`,
        )
        .join("")}</ul>
      <p class="muted small-note">${esc(t("pi.topicNote"))}</p>
      <div class="op-sim-end"><button type="button" class="secondary" data-op-close>${esc(t("pi.close"))}</button></div>`)}`);
  };

  el.addEventListener("click", async (e) => {
    if (e.target.closest("[data-op-close]")) return close();
    const start = e.target.closest("[data-sim-start]");
    if (start) {
      const v = start.dataset.simStart;
      st = { pola: v === "" ? null : Number(v), start: Date.now(), phase: "write", pts: {} };
      save();
      return write();
    }
    if (e.target.closest("[data-sim-finish]")) return finish(false);
    const ch = e.target.closest("[data-op-ch]");
    if (ch) {
      if (st?.phase !== "write") return;
      const li = ch.closest("[data-op]");
      const x = li && partsOf(st.pola).find((y) => y.key === li.dataset.op);
      if (!x) return;
      const sel = izberi(x.p, st.izb?.[x.key], Number(ch.dataset.opCh));
      st.izb = { ...(st.izb || {}) };
      if (sel.length) st.izb[x.key] = sel;
      else delete st.izb[x.key];
      oznaciIzbiro(li, sel);
      return save();
    }
    const rs = e.target.closest("[data-sim-reset]");
    if (rs) {
      if (!reset) {
        reset = true;
        rs.querySelector("span").textContent = t("pi.resetSure");
        return;
      }
      clearInterval(timer);
      store.clear();
      st = null;
      return intro();
    }
    const pt = e.target.closest("[data-sim-pt]");
    if (pt) {
      const key = pt.closest("[data-op]").dataset.op;
      st.pts[key] = Number(pt.dataset.simPt);
      save();
      for (const b of pt.parentElement.querySelectorAll("[data-sim-pt]")) {
        const on = b === pt;
        b.classList.toggle("on", on);
        b.setAttribute("aria-pressed", String(on));
      }
      return updateRest();
    }
    const sv = e.target.closest("[data-sim-save]");
    if (sv && !saving) {
      if (!graded()) return el.querySelector("[data-sim-pt]")?.focus();
      saving = true;
      sv.disabled = true;
      try {
        const res = await onSave({ pola: st.pola, points: st.pts, seconds: st.spent || 0 });
        store.clear();
        if (current?.el === el) result(res);
      } catch {
        sv.disabled = false;
      } finally {
        saving = false;
      }
      return;
    }
    const pr = e.target.closest("[data-sim-practice]");
    if (pr) {
      close();
      onPractice?.(pr.dataset.simPractice);
    }
  });
  el.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      close();
    }
  });
  const naEsc = (e) => escZaOkno(e, el) && close();
  document.addEventListener("keydown", naEsc, true);
  let sprosti = () => {};
  // Zapiranje med pisanjem: stanje ostane v napravi in ura teče naprej (kot na izpitu); ob naslednjem odprtju se pola nadaljuje.
  const close = () => {
    if (current?.el !== el) return;
    current = null;
    clearInterval(timer);
    document.removeEventListener("keydown", naEsc, true);
    sprosti({ vrni: false });
    el.remove();
    document.documentElement.classList.remove("pv-open");
    (back?.isConnected ? back : fokusPo?.())?.focus?.();
  };
  current = { close, el };
  document.body.append(el);
  document.documentElement.classList.add("pv-open");
  if (!st) intro();
  else if (st.phase === "grade") grade();
  else if (left() > 0) write();
  else finish(true);
  sprosti = zadrziFokus(el, { zacetni: el.querySelector("[data-op-close]"), prej: back });
  return el;
}

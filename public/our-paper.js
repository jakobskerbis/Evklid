// Naša pola v slogu pretekle pole NPZ ali mature (server/our-papers.js, content/exam-papers): naloge napiše Evklid
// (AI) z enako zgradbo, kot jo ima izvirna pola RIC, nikoli njenega besedila. Odpre se čez cel zaslon kot
// pregledovalnik prenesene pole (public/paper-viewer.js, isti razredi .pv). Pri vsakem delu: »Pokaži rešitev«
// (odgovor, razlaga na več načinov, točkovanje, pogosta napaka), »Imam prav« (učenec si sam šteje točke) in
// »Vprašaj inštruktorja« (nov pogovor z nalogo; rešitev dobi inštruktor kot skrit kontekst).
import { t, locale } from "./i18n.js";
import { prilagodiSirino } from "./sirina.js";
import { icon } from "./icons.js";
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
  const question = (tk, p) => {
    const choices = p.format === "choice" && p.choices ? `<ol class="op-choices" type="A">${p.choices.map((c) => `<li>${rich(c)}</li>`).join("")}</ol>` : "";
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
// (za šibke točke; ok = označeno). focus: indeks naloge v paper.tasks, pri kateri se pola odpre (klepet, naloga-pole.js).
export function openOurPaper(paper, { title, rich, onTutor, score = null, onChecked = null, focus = null }) {
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
  const r = izrisPole(paper, rich);
  const partHtml = (tk, p) => {
    const id = label(tk, p);
    return `<li class="op-part" data-op="${esc(id)}">
      ${r.question(tk, p)}
      <div class="op-actions">
        <button type="button" class="secondary small" data-op-show aria-expanded="false">${icon("eye")}<span>${esc(t("pp.oursShow"))}</span></button>
        ${onTutor ? `<button type="button" class="secondary small" data-op-tutor>${icon("message-circle")}<span>${esc(t("pp.oursTutor"))}</span></button>` : ""}
        <label class="op-got"><input type="checkbox" data-op-got ${got[id] ? "checked" : ""}><span>${esc(t("pp.oursGot"))}</span></label>
      </div>
      <div class="op-sol" hidden>${r.solution(tk, p)}</div>
    </li>`;
  };
  const headings = r.headings;
  el.innerHTML = `<header class="pv-bar">
      <button type="button" class="ghost pv-ic" data-op-close aria-label="${esc(t("pp.viewerClose"))}" title="${esc(t("pp.viewerClose"))}">${icon("x")}</button>
      <div class="pv-title"><b>${esc(title)}</b><small>${esc(t("pp.oursInfo", { minutes: paper.minutes, points: max }))}</small></div>
      <span class="op-score" aria-live="polite"></span>
    </header>
    <div class="pv-scroll"><div class="op-body">
      <p class="op-about">${icon("info")}<span>${esc(t("pp.oursAbout"))}</span></p>
      ${paper.tools && !(paper.polas?.length && paper.polas.every((x) => x.tools)) ? `<p class="op-tools">${esc(paper.tools)}</p>` : ""}
      ${paper.tasks
        .map((tk, i) => `${headings(tk, paper.tasks[i - 1])}${r.task(tk, i, tk.parts.map((p) => partHtml(tk, p)).join(""))}`)
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
  // Esc zapre polo tudi, ko fokus ni v njej (npr. na body, ko izgine element s fokusom). Kot gumb ×: označene
  // točke ostanejo (score.set ob vsaki spremembi), šibke točke gredo na strežnik (onChecked).
  const naEsc = (e) => escZaOkno(e, el) && close();
  document.addEventListener("keydown", naEsc, true);
  let sprosti = () => {}; // zadrziFokus spodaj; close() je varen tudi, če izris prej vrže napako
  const close = () => {
    if (!current) return;
    current = null;
    document.removeEventListener("keydown", naEsc, true);
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
  if (Number.isInteger(focus)) el.querySelector(`[data-op-i="${focus}"]`)?.scrollIntoView({ block: "start" });
  return el;
}

// ---------- Poskusni izpit na naši poli (server/poskusna-pola.js) ----------
// Ena izpitna pola s pravim časom: najprej uvod (čas, točke, pripomočki), nato pisanje brez rešitev (ura teče
// tudi, ko je pola zaprta), nato ocenjevanje po točkovniku (0 … točke dela), nato rezultat po temah z gumbom Vadi.
// paper, title, rich kot zgoraj (izpitne pole za uvod: simPolas, public/our-paper-key.js); store: { get() → stanje
// | null, set(stanje), clear() } (naprava); onSave({ pola, points, seconds }) → Promise<{ points, maxPoints, percent,
// topics, weak }>; onPractice(topicId); fokusPo() → element za fokus po zaprtju, če gumba, ki je polo odprl, ni več.
// Stanje: { pola, start (ms), phase: "write" | "grade", pts: { ključ: točke }, spent (s, ob koncu pisanja) }.
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
            <button type="button" class="primary" data-sim-start="${x.pola ?? ""}">${icon("clock")}<span>${esc(t("pi.start"))}</span></button></li>`,
        )
        .join("")}</ul>`)}`);
  };

  const write = () => {
    show(`${bar(`<span class="op-timer" role="timer" aria-live="off"></span>`)}${body(`
      <p class="op-about">${icon("notebook-pen")}<span>${esc(t("pi.writeNote"))}</span></p>
      ${tasksHtml((tk, p, key) => `<li class="op-part" data-op="${esc(key)}">${r.question(tk, p)}</li>`)}
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
        return `<li class="op-part" data-op="${esc(key)}">${r.question(tk, p)}<div class="op-sol">${r.kratko(tk, p)}</div>${picker(p, key)}${more ? `<details class="op-more"><summary>${esc(t("pi.more"))}</summary><div class="op-sol">${more}</div></details>` : ""}</li>`;
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

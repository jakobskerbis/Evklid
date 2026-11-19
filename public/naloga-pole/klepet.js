// Naloga iz pretekle pole, omenjena v klepetu (j 19. 11. 2026: »naj učenec napiše številko naloge, raven in predmet in
// naj Evklid sam v klepetu odpre nalogo«). Naloži se šele ob prvi omembi (public/app.js odpriNalogoPole), z lastnimi
// besedili (besedila/<koda>.json, kot public/ustno). Učenec napiše npr. »matura mat OR 2024 pola 1 naloga 5«: Evklid
// najde polo v katalogu in v klepetu odpre NAŠO nalogo s to številko (naloge RIC ne prepisujemo, j 30. 10.),
// inštruktor dobi našo rešitev kot skrit kontekst. Pod učenčevim oblačkom je opomba (samo na tej napravi, ne shrani
// se), da je naloga Evklidova, s povezavo na izvirnik na ric.si in z »Odpri izvirnik« (PDF ostane v napravi;
// public/paper-viewer.js). Kadar kaj manjka (leto, raven, pola …), opomba vpraša z gumbi; »Pošlji kot navadno
// vprašanje« pošlje besedilo.
import { currentLang } from "../i18n.js";
import { uiChain, UI_LANGUAGES } from "../i18n/languages.js";
import { mentionsPaperTask, parsePaperTask, resolvePaper, findPaperTask, originalFiles, ricFileName, fileMatches, looksLikeRicFile } from "../naloga-pole.js";
import SL from "./besedila/sl.js";

export const jeOmemba = mentionsPaperTask;

// Funkcije in stanje aplikacije (public/app.js): klepet, API, prevodi, odpiranje pol.
let state, $, send, api, t, escapeHtml, icon, toast, autoGrow, restoreDraft, prilagodiZdaj, loadPapers, paperLabel, fileText;
let siExamName, SUBJECT_NAMES, partKey, partLabel, taskMdForChat, openOurs, openLocalPaper;
export function nastavi(app) {
  ({ state, $, send, api, t, escapeHtml, icon, toast, autoGrow, restoreDraft, prilagodiZdaj, loadPapers, paperLabel, fileText } = app);
  ({ siExamName, SUBJECT_NAMES, partKey, partLabel, taskMdForChat, openOurs, openLocalPaper } = app);
}

// Besedila: slovenska v modulu, druge jezike naloži ob prvi uporabi (manjkajoč ključ → slovenščina).
let dicts = [SL];
let dictsLang = null;
async function naloziBesedila() {
  const lang = currentLang();
  if (dictsLang === lang) return;
  const chain = uiChain(lang);
  const want = chain.slice(0, chain.indexOf("sl")).map((c) => (c === "sr-Latn" ? "sr" : c)).filter((c) => UI_LANGUAGES.includes(c) && c !== "sl");
  const got = await Promise.all(want.map((c) => fetch(`/naloga-pole/besedila/${c}.json`).then((r) => (r.ok ? r.json() : null)).catch(() => null)));
  dicts = [...got.filter(Boolean), SL];
  dictsLang = lang;
}
function tt(key, vars = {}) {
  const v = dicts.find((d) => d[key] !== undefined)?.[key] ?? key;
  return v.replace(/\{(\w+)\}/g, (m, k) => (vars[k] !== undefined ? String(vars[k]) : m));
}

// Učenec napiše npr. »matura mat OR 2024 pola 1 naloga 5«: Evklid najde polo v katalogu in v klepetu odpre NAŠO
// nalogo s to številko (naloge RIC ne prepisujemo, j 30. 10.), inštruktor dobi našo rešitev kot skrit kontekst.
// Pod učenčevim oblačkom je opomba (samo na tej napravi, ne shrani se), da je naloga Evklidova, s povezavo na
// izvirnik na ric.si in z »Odpri izvirnik« (PDF, ki ga je učenec prenesel, ostane v napravi; public/paper-viewer.js).
// Kadar kaj manjka (leto, raven, pola …), opomba vpraša z gumbi; »Pošlji kot navadno vprašanje« pošlje besedilo.
const keptOriginals = new Map(); // `${učenec}|${povezava}` → izbrani PDF izvirnika (dokler je aplikacija odprta)
let nalogaBusy = false;
export const busy = () => nalogaBusy;
export const pozabi = () => keptOriginals.clear();
function paperNote(html, after = null) {
  const el = document.createElement("div");
  el.className = "msg assistant paper-note";
  el.setAttribute("role", "note");
  el.innerHTML = html;
  const box = $("#messages");
  box.querySelector(".empty")?.remove();
  after ? after.after(el) : box.appendChild(el);
  prilagodiZdaj();
  box.scrollTop = box.scrollHeight;
  return el;
}
const chip = (label, attrs) => `<button type="button" class="secondary small choice-btn" ${attrs}>${escapeHtml(label)}</button>`;
// key: polje omembe, ki ga izbira dopolni (exam, subject, level, year, pola, section); over: že izbrano.
function askPaperNote(shown, question, options, label, key = "", over = {}) {
  document.querySelectorAll(".paper-note .choice-row").forEach((x) => x.remove()); // samo zadnje vprašanje
  const el = paperNote(`<p class="np-quote"><bdi>${escapeHtml(shown.trim().slice(0, 200))}</bdi></p><p>${escapeHtml(question)}</p><div class="choice-row" role="group" aria-label="${escapeHtml(t("chat.choices"))}">${options
    .map((o, i) => chip(label(o), `data-np-add="${i}"`))
    .join("")}${chip(tt("np.plain"), "data-np-plain")}</div>`);
  el.addEventListener("click", (e) => {
    const b = e.target.closest("[data-np-add], [data-np-plain]");
    if (!b || state.sending || nalogaBusy) return;
    // Odgovor ostane pod vprašanjem (kot učenčeva izbira), gumbi izginejo.
    el.querySelector(".choice-row")?.replaceWith(Object.assign(document.createElement("p"), { className: "np-quote np-chosen", textContent: `→ ${b.textContent}` }));
    if (b.dataset.npPlain !== undefined) return send(shown, { plain: true, draft: shown });
    odpri(shown, { over: { ...over, [key]: options[Number(b.dataset.npAdd)].value }, fromInput: false });
  });
}
// Opomba pod nalogo: Evklidova naloga ali še ni naše različice; povezave na izvirnik in »Odpri izvirnik«.
// missing: naša pola nima te naloge (opomba z vprašanjem je že nad njo): samo izvirnik, brez besedila.
function originalNote(userEl, { entry, ref, ours = null, focus = null, label = "", hasFigure = false, missing = false }) {
  const subjectName = (k) => SUBJECT_NAMES[k] || k;
  const paper = paperLabel(entry, subjectName);
  const pola = ours?.task?.pola || ref.pola || null;
  const files = originalFiles(entry, pola);
  const head = missing
    ? ""
    : ours
    ? `<p>${icon("info")} ${escapeHtml(tt("np.ours", { paper }))}${hasFigure ? ` ${escapeHtml(tt("np.figure"))}` : ""}</p>`
    : `<p>${icon("info")} ${escapeHtml(tt("np.noOurs", { paper, n: label, help: t("pp.taskHelp") }))}</p>`;
  const oursBtn = ours ? `<button type="button" class="secondary small" data-np-ours>${icon("notebook-pen")}<span>${escapeHtml(tt("np.openOurs"))}</span></button>` : "";
  const links = files
    .map((f) => `<a class="btn-secondary small" href="${escapeHtml(f.url)}" target="_blank" rel="noopener noreferrer" title="${escapeHtml(t("pp.opens"))}">${icon("download")}<span>${escapeHtml(tt("np.download", { file: fileText(f, entry) }))}</span></a>`)
    .join("");
  const names = files.map((f) => ricFileName(f.url)).filter(Boolean);
  const open = `<label class="btn-secondary small np-open">${icon("folder-open")}<span>${escapeHtml(tt("np.openOriginal"))}</span><input type="file" accept="application/pdf,.pdf" data-np-file></label>`;
  // Ime datoteke se ne prelomi (učenec ga mora najti v izbirniku); dve imeni: »… / …«.
  const nameHtml = names.map((x) => `<span class="np-file" dir="ltr">${escapeHtml(x)}</span>`).join(" / ");
  const hint = names.length ? `<p class="np-hint muted">${escapeHtml(tt("np.pickHint", { name: "\u0000" })).replace("\u0000", nameHtml)}</p>` : "";
  const el = paperNote(`${head}<div class="np-acts">${oursBtn}${links}${open}</div>${hint}`, userEl);
  const sid = state.student.id;
  const taskLabel = ours ? `${ours.task.section || ""}${ours.task.n}` : `${ref.section || ""}${ref.n}`;
  const openFile = (file, f, keep = true) => {
    if (keep) keptOriginals.set(`${sid}|${f.url}`, file);
    openLocalPaper(entry, file, subjectName, 0, taskLabel);
  };
  el.addEventListener("click", (e) => {
    if (e.target.closest("[data-np-ours]")) return openOurs(entry, subjectName, focus);
    // Izvirnik je že izbran (ta seja): odpre se brez ponovnega izbiranja.
    if (e.target.closest(".np-open") && state.student?.id === sid) {
      const f = files.find((x) => keptOriginals.has(`${sid}|${x.url}`));
      if (f) {
        e.preventDefault();
        openFile(keptOriginals.get(`${sid}|${f.url}`), f);
      }
    }
  });
  el.addEventListener("change", (e) => {
    const input = e.target.closest("[data-np-file]");
    const file = input?.files?.[0];
    if (!file) return;
    input.value = "";
    const f = files.find((x) => fileMatches(file.name, x.url));
    // Druga pola RIC (ime »M241-401-1-2.pdf« namesto »…-1-1.pdf«): opozorilo; neznano ime (preimenovana datoteka) se
    // odpre, a se ne zapomni (naslednjič lahko učenec izbere drugo datoteko).
    if (!f && looksLikeRicFile(file.name)) return toast(tt("np.wrongFile", { name: names.join(" / ") }), "circle-x");
    openFile(file, f || files[0], !!f);
  });
}
// shown: kar je učenec napisal (gre v oblaček); over: izbire z gumbov (leto, raven, pola …) čez prebrano omembo;
// fromInput: besedilo je iz polja (polje se izprazni in ob neuspehu dobi besedilo nazaj).
export async function odpri(shown, { over = {}, fromInput = true } = {}) {
  if (nalogaBusy || state.sending) return;
  nalogaBusy = true;
  await naloziBesedila().catch(() => {});
  const sid = state.student.id;
  const conv = state.conversationId;
  if (fromInput) {
    $("#input").value = "";
    autoGrow();
    state.dictated = false;
  }
  const restore = () => fromInput && restoreDraft(shown, null);
  // Med čakanjem je učenec zamenjal profil ali pogovor: nič ne pošljemo.
  const moved = () => state.student?.id !== sid || state.conversationId !== conv;
  const sendPlain = () => (moved() ? restore() : send(shown, { plain: true, draft: shown }));
  try {
    const ref = { ...parsePaperTask(shown), ...over };
    let papers = [];
    try {
      papers = await loadPapers(api);
    } catch {
      /* brez kataloga: navadno vprašanje */
    }
    const r = resolvePaper(ref, papers);
    if (r.none) return void (await sendPlain());
    if (moved()) return restore();
    const subjectName = (k) => SUBJECT_NAMES[k] || k;
    if (r.ask) {
      const label = {
        exam: (o) => siExamName(o.value),
        subject: (o) => subjectName(o.value),
        level: (o) => t(o.value === "VR" ? "lp.vr" : "lp.or"),
        year: (o) => String(o.value),
      }[r.ask];
      return askPaperNote(shown, tt(`np.ask.${r.ask}`), r.options, label, r.ask, over);
    }
    const entry = r.entry;
    const paper = paperLabel(entry, subjectName);
    const label = `${ref.section || ""}${ref.n}${ref.part || ""}`;
    if (!entry.ours) {
      const ctx = { paper, task: `${ref.pola ? `${ref.pola}-` : ""}${label}`, noText: true };
      return void (await send(shown, { plain: true, draft: shown, paper: ctx, afterUser: (el) => originalNote(el, { entry, ref, label }) }));
    }
    let ours;
    try {
      ours = await api(`/api/exam-papers/ours/${encodeURIComponent(entry.id)}`);
    } catch {
      return void (await sendPlain()); // naša pola se ni naložila: vprašanje gre inštruktorju kot navadno
    }
    if (moved()) return restore();
    const found = findPaperTask(ours, ref);
    if (found.missing) {
      askPaperNote(shown, tt("np.missing", { paper, n: label }), []);
      return originalNote(null, { entry, ref, label, missing: true });
    }
    if (found.ask) {
      const ask = { pola: (o) => t("pp.oursPola", { n: o.value }), section: (o) => t("pp.oursTask", { n: `${o.value}${ref.n}` }) }[found.ask];
      return askPaperNote(shown, tt(`np.ask.${found.ask}`, { n: ref.n }), found.options, ask, found.ask, over);
    }
    const { task, part } = found;
    const parts = part ? [part] : task.parts;
    const strip = taskMdForChat;
    const partText = (p) => {
      const choices = p.format === "choice" && p.choices ? p.choices.map((c, i) => `${String.fromCharCode(65 + i)}) ${strip(c)}`).join("\n") : "";
      return [parts.length > 1 && p.id ? `${p.id}) ${strip(p.text)}` : strip(p.text), choices].filter(Boolean).join("\n");
    };
    const body = [strip(task.intro), ...parts.map(partText)].filter(Boolean).join("\n\n").slice(0, 3000);
    const title = t("pp.oursTitle", { paper });
    const n = part ? partLabel(task, part) : `${task.section || ""}${task.n}`;
    const polaTxt = task.pola ? `${t("pp.oursPola", { n: task.pola })} · ` : "";
    const hasFigure = !!(task.figure || parts.some((p) => p.figure));
    const ctx = { paper: title, task: part ? partKey(task, part) : partKey(task, {}), ours: entry.id };
    const focus = ours.tasks.indexOf(task);
    await send(`${shown.trim()}\n\n${title} · ${polaTxt}${t("pp.oursTask", { n })}\n\n${body}`, {
      plain: true,
      draft: shown,
      paper: ctx,
      afterUser: (el) => originalNote(el, { entry, ref, ours: { task }, focus, hasFigure }),
    });
  } catch (err) {
    restore();
    toast(err.message);
  } finally {
    nalogaBusy = false;
  }
}


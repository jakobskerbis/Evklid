// Pretekle pole NPZ in mature v razdelku »NPZ in matura«: izbira po korakih kot pri ravni izobrazbe
// (level-picker.js): šola → izpit → predmet → (matematika na maturi: raven) → leta in roki.
// Katalog (server/exam-papers-si.js) ima samo povezave na ric.si: pole so last Državnega izpitnega centra,
// zato jih ne kopiramo in ne prenašamo; vsaka povezava odpre dokument na ric.si v novem zavihku.
import { t } from "./i18n.js";
import { icon } from "./icons.js";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export const SI_EXAMS = { OSNOVNA_SOLA: ["NPZ6", "NPZ9"], SREDNJA_SOLA: ["MATURA", "POKLICNA"] };
export const examName = (id) => t(`pp.exam.${id}`);
const SUBS = { MATURA: "pp.sub.MATURA", POKLICNA: "pp.sub.POKLICNA" };
const SUBJECTS = ["MAT", "FIZ", "KEM", "BIO"];
const SHOW = 8; // toliko rokov naenkrat, ostali za »Pokaži starejše«

let cache = null;
export async function loadPapers(api) {
  cache ||= api("/api/exam-papers").then((r) => r.papers || []).catch((err) => {
    cache = null;
    throw err;
  });
  return cache;
}

const termText = (e) => [t(`pp.term.${e.term}`), e.session ? t("pp.session", { n: e.session }) : ""].filter(Boolean).join(" · ");
// RIC pri NPZ: »preizkus znanja« in »navodila za vrednotenje«, pri maturi »izpitna pola« in »navodila za ocenjevanje«.
const NPZ_FILE = { paper: "pp.file.test", scoring: "pp.file.scoringNpz" };
const fileText = (f, e) => t((e.exam.startsWith("NPZ") && NPZ_FILE[f.kind]) || `pp.file.${f.kind}`);

// Koraki izbire: [ključ, vprašanje, možnosti [vrednost, oznaka, opis], izbrana oznaka].
function steps(v, papers, subjectName) {
  const out = [["track", t("pp.qSchool"), [["OSNOVNA_SOLA", t("lp.os")], ["SREDNJA_SOLA", t("lp.ss")]], v.track && t(v.track === "OSNOVNA_SOLA" ? "lp.os" : "lp.ss")]];
  if (!v.track) return out;
  out.push(["exam", t("pp.qExam"), SI_EXAMS[v.track].map((id) => [id, examName(id), SUBS[id] ? t(SUBS[id]) : ""]), v.exam && examName(v.exam)]);
  if (!v.exam) return out;
  const subjects = SUBJECTS.filter((s) => papers.some((p) => p.exam === v.exam && p.subject === s));
  out.push(["subject", t("pp.qSubject"), subjects.map((s) => [s, subjectName(s)]), v.subject && subjectName(v.subject)]);
  if (!v.subject) return out;
  if (papers.some((p) => p.exam === v.exam && p.subject === v.subject && p.level)) {
    const levels = [["OR", t("lp.or"), t("lp.orSub")], ["VR", t("lp.vr"), t("lp.vrSub")]];
    out.push(["level", t("lp.qLevel"), levels, levels.find((l) => l[0] === v.level)?.[1]]);
  }
  return out;
}
const AFTER = { track: ["exam", "subject", "level"], exam: ["subject", "level"], subject: ["level"] };

// Samodejna izbira, kadar je možnost ena sama (NPZ 6 in poklicna matura imata samo matematiko).
function autofill(v, papers, subjectName) {
  for (let guard = 0; guard < 4; guard++) {
    const next = steps(v, papers, subjectName).find((s) => !s[3]);
    if (!next || next[2].length !== 1) return;
    v[next[0]] = next[2][0][0];
  }
}

// Oznaka pole za besedilo inštruktorju: »Splošna matura – Matematika (osnovna raven), 2025, spomladanski rok«.
export function paperLabel(e, subjectName = (s) => s) {
  const level = e.level ? ` (${t(e.level === "VR" ? "lp.vr" : "lp.or")})` : "";
  return `${examName(e.exam)} – ${subjectName(e.subject)}${level}, ${e.year}, ${termText(e)}`;
}

function rowHtml(e, i, tutor, local, ours) {
  const files = e.files
    .map((f) => `<a class="btn-secondary small pp-file" href="${esc(f.url)}" target="_blank" rel="noopener noreferrer" title="${esc(t("pp.opens"))}">${icon("file-text")}<span>${esc(fileText(f, e))}</span>${icon("external-link")}</a>`)
    .join("");
  // Nalog RIC ne prepisujemo, uporabimo le zgradbo pole (structure). Naša pola v istem slogu (ours) z razlagami
  // pride pozneje (Opus s trojnim pregledom); do takrat »Naša pola v tem slogu je v pripravi«, povezava na ric.si ostane.
  // Naša pola obstaja: gumb »Reši našo polo v tem slogu« pred povezavami na ric.si (public/our-paper.js).
  const expl = e.ours ? "" : `<span class="pp-expl">${icon("notebook-pen")}${esc(t("pp.oursSoon"))}</span>`;
  const oursBtn = e.ours && ours ? `<button type="button" class="pp-ours small" data-pp-ours="${i}">${icon("notebook-pen")}<span>${esc(t("pp.oursOpen"))}</span></button>` : "";
  // »Rešuj z inštruktorjem«: pogovor z inštruktorjem, ki ve, katero polo učenec rešuje (nalogo pošlje s fotografijo ali prepisom).
  const help = tutor ? `<button type="button" class="secondary small pp-tutor" data-pp-tutor="${i}">${icon("message-circle")}<span>${esc(t("pp.tutor"))}</span></button>` : "";
  // »Odpri preneseno polo«: PDF, ki ga je učenec prenesel z ric.si, ostane v napravi (public/paper-viewer.js).
  const open = local ? `<label class="btn-secondary small pp-file pp-local">${icon("folder-open")}<span>${esc(t("pp.openLocal"))}</span><input type="file" accept="application/pdf,.pdf" data-pp-local="${i}"></label>` : "";
  return `<li class="pp-row"><div class="pp-when"><b>${e.year}</b><span>${esc(termText(e))}</span></div><div class="pp-files">${oursBtn}${files}${help}${open}</div>${expl}</li>`;
}

// Namesti izbirnik v `box`. start: { track, exam, subject, level } (privzeto učenčeva raven).
export function mountPapers(box, papers, start, { subjectName = (s) => s, onTutor = null, onLocal = null, onReopen = null, onOurs = null } = {}) {
  const v = { ...start };
  // Neveljavna začetna izbira (npr. predmet, ki ga izpit nima) se izbriše od tam naprej.
  for (const key of ["track", "exam", "subject", "level"]) {
    const st = steps(v, papers, subjectName).find((s) => s[0] === key);
    if (v[key] && (!st || !st[2].some((o) => o[0] === v[key]))) {
      for (const k of [key, ...(AFTER[key] || [])]) delete v[k];
      break;
    }
  }
  autofill(v, papers, subjectName);
  let open = steps(v, papers, subjectName).find((s) => !s[3])?.[0] || null;
  let all = false;
  let shown = [];

  const render = () => {
    const list = steps(v, papers, subjectName);
    const done = list.filter((s) => s[3] && s[0] !== open);
    const current = list.find((s) => s[0] === open) || list.find((s) => !s[3]);
    const entries = current ? [] : papers.filter((p) => p.exam === v.exam && p.subject === v.subject && (!p.level || p.level === v.level));
    shown = all ? entries : entries.slice(0, SHOW);
    box.innerHTML = `
      <div class="lp-crumbs pp-crumbs">${done
        .map(([k, , , label]) => `<button type="button" class="lp-crumb" data-pp-step="${k}" title="${esc(t("common.change"))}">${esc(label)}</button>`)
        .join(`<span class="lp-sep" aria-hidden="true">›</span>`)}</div>
      ${
        current
          ? `<p class="lp-q">${esc(current[1])}</p>
        <div class="lp-options">${current[2]
          .map(([val, label, sub]) => `<button type="button" class="choice lp-opt ${val === v[current[0]] ? "on" : ""}" data-pp-key="${current[0]}" data-pp-val="${esc(val)}"><span>${esc(label)}</span>${sub ? `<small>${esc(sub)}</small>` : ""}</button>`)
          .join("")}</div>`
          : entries.length
            ? `${onLocal ? `<p class="pp-local-hint">${esc(t("pp.openLocalHint"))}</p>` : ""}<ul class="pp-list">${shown.map((e, i) => rowHtml(e, i, !!onTutor, !!onLocal, !!onOurs)).join("")}</ul>${entries.length > shown.length ? `<button type="button" class="text-btn pp-more" data-pp-more>${esc(t("pp.more", { n: entries.length - shown.length }))}</button>` : ""}`
            : `<p class="muted">${esc(t("pp.empty"))}</p>`
      }`;
  };
  box.onchange = (e) => {
    const input = e.target.closest("[data-pp-local]");
    const file = input?.files?.[0];
    if (!file || !onLocal) return;
    input.value = "";
    onLocal(shown[Number(input.dataset.ppLocal)], file, subjectName);
  };
  box.onclick = (e) => {
    // Pola, ki je po »Pomoč pri tej nalogi« še v pomnilniku, se odpre znova brez izbire datoteke.
    const local = e.target.closest(".pp-local");
    if (local && onReopen?.(shown[Number(local.querySelector("[data-pp-local]").dataset.ppLocal)], subjectName)) return e.preventDefault();
    const ours = e.target.closest("[data-pp-ours]");
    if (ours && onOurs) return onOurs(shown[Number(ours.dataset.ppOurs)], subjectName);
    const tutor = e.target.closest("[data-pp-tutor]");
    if (tutor && onTutor) return onTutor(shown[Number(tutor.dataset.ppTutor)], subjectName);
    const step = e.target.closest("[data-pp-step]");
    if (step) {
      open = step.dataset.ppStep;
      return render();
    }
    const opt = e.target.closest("[data-pp-key]");
    if (opt) {
      const { ppKey: key, ppVal: val } = opt.dataset;
      if (v[key] !== val) for (const k of AFTER[key] || []) delete v[k];
      v[key] = val;
      autofill(v, papers, subjectName);
      open = steps(v, papers, subjectName).find((s) => !s[3])?.[0] || null;
      all = false;
      return render();
    }
    if (e.target.closest("[data-pp-more]")) {
      all = true;
      render();
    }
  };
  render();
}

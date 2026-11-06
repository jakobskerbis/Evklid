// Naloge za člane pilota (server/pilot-naloge.js): v zavihku Jaz »Pomagaj izboljšati Evklid«.
// Ob prvi prijavi enkrat obvestilo (»Poglej naloge« / »Pozneje«), po enem tednu enkrat obvestilo o anketi.
// 1. skeniraj 10 nalog pod različnimi pogoji (ocena »Prebrano prav / narobe« na zaslonu Skeniraj),
// 2. preizkusi 5 delov aplikacije, 3. kje je zastavica za prijavo napake, 4. kratka anketa. Vse je prostovoljno.
import { t, locale } from "./i18n.js";
import { icon, hydrateIcons } from "./icons.js";

const $ = (sel, root = document) => root.querySelector(sel);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export const CONDS = ["light", "dark", "tilted", "handwritten", "printed", "board", "screen", "crumpled", "many", "notation"];
const FEATURE_VIEW = { chat: "chat", textbook: "textbook", graph: "graph", cards: "cards", exams: "exams", "3d": "3d" };
const FEATURE_NAME = { chat: "nav.chat", textbook: "nav.textbook", graph: "nav.graph", cards: "cards.title", exams: "nav.examsSi", "3d": "a3.hubTitle" };
const FEATURE_ICON = { chat: "message-circle", textbook: "book-open", graph: "calculator", cards: "layers", exams: "clipboard-check", "3d": "box" };
const SCALE = ["overall", "tutor", "scan", "school"];
const IMPROVE = ["tutor", "textbook", "practice", "scan", "calc", "speed", "look"];

let D = null; // { api, getStudent, showView, toast, refreshXp, hasExams, startScan }
let st = null; // stanje s strežnika za trenutni profil (ali { member: false })
let owner = null;
let seq = 0;
let noteOpen = null; // del aplikacije z odprto opombo
let survey = {}; // izbrani odgovori ankete, preden jih pošlje

export function initPilot(deps) {
  D = deps;
  const view = $("#view-pilot");
  view?.addEventListener("click", onClick);
  view?.addEventListener("submit", (e) => {
    e.preventDefault(); // Enter v opombi = Shrani
    e.target.querySelector('[data-pn="note-save"]')?.click();
  });
  view?.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && e.target.closest(".pn-note-form")) {
      const f = noteOpen;
      noteOpen = null;
      render();
      setTimeout(() => $(`[data-pn="note"][data-f="${f}"]`)?.focus());
    }
  });
}

export const pilotState = () => (st?.member && owner === D?.getStudent()?.id ? st : null);
export const isPilotMember = () => !!pilotState();

// Pet delov: kdor ima zavihek NPZ in matura, preizkusi tega, drugi 3D svet.
const features = () => ["chat", "textbook", "graph", "cards", D?.hasExams?.() ? "exams" : "3d"];

/** Naloži stanje za trenutni profil; ob prvi prijavi pokaže obvestilo. */
export async function loadPilot({ notices = true } = {}) {
  const s = D?.getStudent();
  const my = ++seq;
  if (!s) return;
  if (owner !== s.id) {
    st = null;
    survey = {};
    noteOpen = null;
  }
  owner = s.id;
  try {
    const r = await D.api(`/api/students/${s.id}/pilot`);
    if (my !== seq) return;
    st = r;
  } catch {
    if (my !== seq) return;
    st = st?.member ? st : { member: false };
  }
  paintMeRow();
  D.onMember?.(!!st.member);
  if (!$("#view-pilot")?.hidden) render();
  if (notices && st.member) maybeNotice();
}

function paintMeRow() {
  const row = $("#me-pilot");
  if (!row) return;
  row.hidden = !st?.member;
  row.parentElement.hidden = row.hidden;
  if (!st?.member) return;
  row.innerHTML = `<span class="ic">${icon("sparkles")}</span><span class="lr-text"><b>${esc(t("pn.title"))}</b><small>${esc(t("pn.meSub", { done: st.done, total: st.total }))}</small></span>${icon("chevron-right")}`;
}

// ---------- obvestila (enkrat) ----------

const busy = () =>
  document.body.classList.contains("onboarding") || !$("#tour")?.hidden || !!document.querySelector("dialog[open]") || !!document.querySelector(".lock-card, .iq, .xp-cele-card");

let noticeTimer = null;
function maybeNotice(tries = 0) {
  clearTimeout(noticeTimer);
  const what = st?.intro ? "intro" : st?.surveyNotice ? "survey" : null;
  if (!what) return;
  // Ne čez uvodni ogled, vprašalnik zanimanj ali drugo okno: počakamo (največ nekaj minut).
  if (busy()) {
    if (tries < 40) noticeTimer = setTimeout(() => maybeNotice(tries + 1), 4000);
    return;
  }
  noticeTimer = setTimeout(() => showNotice(what), tries ? 0 : 1200);
}

function showNotice(what) {
  if (!pilotState() || busy()) return maybeNotice(1);
  let dlg = $("#pilot-notice");
  if (!dlg) {
    dlg = document.createElement("dialog");
    dlg.id = "pilot-notice";
    dlg.className = "install-sheet pn-notice";
    dlg.setAttribute("aria-labelledby", "pn-notice-title");
    document.body.append(dlg);
    dlg.addEventListener("cancel", (e) => {
      e.preventDefault();
      closeNotice(dlg, false);
    });
    dlg.addEventListener("click", (e) => {
      if (e.target === dlg) return closeNotice(dlg, false); // dotik ob okvirju
      const b = e.target.closest("[data-pn-notice]");
      if (b) closeNotice(dlg, b.dataset.pnNotice === "go");
    });
  }
  dlg.dataset.what = what;
  const intro = what === "intro";
  dlg.innerHTML = `<div class="is-box" role="document">
    <div class="is-head"><span class="pn-notice-ic">${icon(intro ? "sparkles" : "clipboard-check")}</span><h2 id="pn-notice-title">${esc(t(intro ? "pn.title" : "pn.surveyTitle"))}</h2>
      <button type="button" class="ghost icon-only" data-pn-notice="x" aria-label="${esc(t("pn.later"))}" title="${esc(t("pn.later"))}">${icon("x")}</button></div>
    ${intro ? `<p>${esc(t("pn.introText"))}</p><p class="muted">${esc(t("pn.introFree"))}</p><p class="muted">${esc(t("pn.introWhere"))}</p>` : `<p>${esc(t("pn.surveyNotice"))}</p>`}
    <div class="pn-notice-actions">
      <button type="button" class="secondary" data-pn-notice="later">${esc(t("pn.later"))}</button>
      <button type="button" class="primary" data-pn-notice="go">${esc(t(intro ? "pn.open" : "pn.surveyGo"))}</button>
    </div>
  </div>`;
  dlg.showModal();
  $('[data-pn-notice="go"]', dlg).focus();
}

function closeNotice(dlg, go) {
  const what = dlg.dataset.what;
  dlg.close();
  const s = D.getStudent();
  if (st) st[what === "intro" ? "intro" : "surveyNotice"] = false;
  // Zaprto ostane zaprto (enkrat), tudi če zapis ne uspe takoj: naloge so vedno v zavihku Jaz.
  if (s) D.api(`/api/students/${s.id}/pilot/seen`, { method: "POST", body: { what } }).catch(() => {});
  if (go) {
    D.showView("pilot");
    if (what === "survey") setTimeout(() => $("#pn-survey")?.scrollIntoView({ block: "start", behavior: "smooth" }), 50);
  } else if (what === "intro" && st?.surveyNotice) maybeNotice(1);
}

// ---------- zaslon »Pomagaj izboljšati Evklid« ----------

export function showPilot() {
  render();
  loadPilot({ notices: false });
}

function render() {
  const box = $("#view-pilot .pn-body");
  if (!box) return;
  const s = pilotState();
  if (!s) {
    box.innerHTML = st && !st.member ? "" : `<p class="muted">${esc(t("common.loading"))}</p>`;
    return;
  }
  const pct = Math.round((s.done / Math.max(1, s.total)) * 100);
  box.innerHTML = `
    <div class="card pn-top">
      <div class="pn-progress-row"><b>${esc(t("pn.progress", { done: s.done, total: s.total }))}</b><span class="pn-badge${s.badge ? " on" : ""}">${icon("badge-check")}<span>Pilot</span></span></div>
      <div class="pn-bar" role="progressbar" aria-valuemin="0" aria-valuemax="${s.total}" aria-valuenow="${s.done}" aria-label="${esc(t("pn.progress", { done: s.done, total: s.total }))}"><span style="width:${pct}%"></span></div>
      <p class="muted small">${esc(t(s.badge ? "pn.badgeOn" : "pn.badgeOff"))}</p>
      <p class="muted small">${esc(t(s.photo.allowed ? "pn.privacyPhoto" : "pn.privacy"))}</p>
    </div>
    ${scanCard(s)}
    ${featureCard(s)}
    ${flagCard(s)}
    ${surveyCard(s)}`;
  hydrateIcons(box);
}

const head = (n, ic, title, text, done) =>
  `<div class="pn-head"><span class="pn-num${done ? " done" : ""}" aria-hidden="true">${done ? icon("check") : n}</span><div><h2>${esc(title)}</h2>${text ? `<p class="muted">${esc(text)}</p>` : ""}</div></div>`;

function scanCard(s) {
  const n = Object.keys(s.scans).length;
  const rows = CONDS.map((c) => {
    const r = s.scans[c];
    const status = r ? `<small class="pn-status ${r.ok ? "ok" : "bad"}">${icon(r.ok ? "circle-check" : "circle-x")}${esc(t(r.ok ? "pn.ok" : "pn.bad"))}${r.photo ? ` · ${icon("image")}${esc(t("pn.photoSaved"))}` : ""}</small>` : "";
    return `<li class="pn-row">
      <span class="pn-row-text"><b>${esc(t(`pn.cond.${c}`))}</b>${status}</span>
      <span class="pn-row-btns">
        ${r?.photo ? `<button type="button" class="ghost icon-only" data-pn="photo-del" data-cond="${c}" aria-label="${esc(t("pn.photoDelete"))}" title="${esc(t("pn.photoDelete"))}">${icon("trash-2")}</button>` : ""}
        <button type="button" class="${r ? "secondary" : "primary"}" data-pn="scan" data-cond="${c}">${icon("scan-line")}<span>${esc(t(r ? "pn.again" : "pn.scanBtn"))}</span></button>
      </span>
    </li>`;
  }).join("");
  return `<section class="card pn-card">${head(1, "scan-line", `${t("pn.scanTitle")} (${n}/${CONDS.length})`, t("pn.scanText"), n >= CONDS.length)}<ul class="pn-list">${rows}</ul></section>`;
}

function featureCard(s) {
  const list = features();
  const n = list.filter((f) => s.features[f]).length;
  const rows = list.map((f) => {
    const r = s.features[f];
    const open = noteOpen === f;
    return `<li class="pn-row pn-feat">
      <span class="pn-row-text"><b>${icon(FEATURE_ICON[f])}${esc(t(FEATURE_NAME[f]))}</b><small class="muted">${esc(t(`pn.fd.${f}`))}</small></span>
      <span class="pn-row-btns">
        <button type="button" class="secondary" data-pn="open" data-f="${f}">${icon("external-link")}<span>${esc(t("pn.openBtn"))}</span></button>
        <span class="pn-yn" role="group" aria-label="${esc(t(FEATURE_NAME[f]))}">
          <button type="button" data-pn="works" data-f="${f}" aria-pressed="${r?.ok === true}">${icon("check")}<span>${esc(t("pn.works"))}</span></button>
          <button type="button" data-pn="broken" data-f="${f}" aria-pressed="${r?.ok === false}">${icon("x")}<span>${esc(t("pn.broken"))}</span></button>
        </span>
      </span>
      ${r && !open ? `<button type="button" class="text-btn pn-add-note" data-pn="note" data-f="${f}">${esc(t("pn.addNote"))}</button>` : ""}
      ${open ? `<form class="pn-note-form" data-f="${f}"><label class="sr-only" for="pn-note-${f}">${esc(t("pn.note"))}</label><input id="pn-note-${f}" type="text" maxlength="300" placeholder="${esc(t("pn.featNotePh"))}"><button type="button" class="primary" data-pn="note-save" data-f="${f}">${esc(t("common.save"))}</button></form>` : ""}
    </li>`;
  }).join("");
  return `<section class="card pn-card">${head(2, "box", `${t("pn.featTitle")} (${n}/${list.length})`, t("pn.featText"), n >= list.length)}<ul class="pn-list">${rows}</ul></section>`;
}

function flagCard(s) {
  return `<section class="card pn-card">${head(3, "flag", t("pn.flagTitle"), t("pn.flagText"), s.flag)}
    <div class="pn-actions">
      <button type="button" class="secondary" data-pn="flag-show">${icon("flag")}<span>${esc(t("pn.flagShow"))}</span></button>
      ${s.flag ? "" : `<button type="button" class="primary" data-pn="flag-ok">${icon("check")}<span>${esc(t("pn.flagOk"))}</span></button>`}
    </div></section>`;
}

function surveyCard(s) {
  const date = new Date(s.surveyOpensAt).toLocaleDateString(locale(), { weekday: "long", day: "numeric", month: "long" });
  let body;
  if (s.survey) body = `<p class="pn-status ok">${icon("circle-check")}${esc(t("pn.surveyDone"))}</p>`;
  else if (!s.surveyOpen) body = `<p class="muted">${esc(t("pn.surveyWait", { date }))}</p>`;
  else
    body = `<p class="muted small">${esc(t("pn.scale"))}</p>
      ${SCALE.map(
        (q) => `<fieldset class="pn-q"><legend>${esc(t(`pn.q.${q}`))}</legend><div class="pn-scale">${[1, 2, 3, 4, 5]
          .map((v) => `<button type="button" data-pn="ans" data-q="${q}" data-v="${v}" aria-pressed="${survey[q] === v}">${v}</button>`)
          .join("")}</div></fieldset>`,
      ).join("")}
      <fieldset class="pn-q"><legend>${esc(t("pn.q.improve"))}</legend><div class="pn-choices">${IMPROVE.map(
        (k) => `<button type="button" data-pn="imp" data-v="${k}" aria-pressed="${survey.improve === k}">${esc(t(`pn.i.${k}`))}</button>`,
      ).join("")}</div></fieldset>
      <p class="pn-err" role="alert" hidden></p>
      <button type="button" class="primary" data-pn="survey">${esc(t("pn.send"))}</button>`;
  return `<section class="card pn-card" id="pn-survey">${head(4, "clipboard-check", t("pn.surveyTitle"), s.survey || !s.surveyOpen ? "" : t("pn.surveyText"), s.survey)}${body}</section>`;
}

// Odgovor strežnika: novo stanje, nagrada (toast z XP), osvežitev zvezdic.
function applied(r, { quiet = false } = {}) {
  st = r;
  paintMeRow();
  if (r.gained) {
    D.toast(t("pn.thanks", { n: r.gained }), "star");
    D.refreshXp?.();
  } else if (!quiet) D.toast(t("pn.thanksNoXp"), "check");
  if (!$("#view-pilot")?.hidden) render();
}

const post = (path, body) => D.api(`/api/students/${D.getStudent().id}/pilot/${path}`, { method: "POST", body });

async function onClick(e) {
  const b = e.target.closest("[data-pn]");
  if (!b) return;
  const s = pilotState();
  if (!s) return;
  const act = b.dataset.pn;
  const f = b.dataset.f;
  const keep = (sel) => setTimeout(() => $(sel)?.focus());
  try {
    if (act === "scan") return D.startScan(b.dataset.cond);
    if (act === "photo-del") {
      const r = await D.api(`/api/students/${D.getStudent().id}/pilot/scan/${b.dataset.cond}/photo`, { method: "DELETE" });
      D.toast(t("pn.photoDeleted"), "check");
      applied(r, { quiet: true });
      return keep(`[data-pn="scan"][data-cond="${b.dataset.cond}"]`);
    }
    if (act === "open") return D.showView(FEATURE_VIEW[f]);
    if (act === "works" || act === "broken") {
      const ok = act === "works";
      if (s.features[f]?.ok === ok) return;
      const r = await post("feature", { feature: f, ok });
      noteOpen = ok ? (noteOpen === f ? null : noteOpen) : f; // »Ne deluje«: polje za opombo se odpre samo
      applied(r);
      return keep(ok ? `[data-pn="works"][data-f="${f}"]` : `#pn-note-${f}`);
    }
    if (act === "note") {
      noteOpen = f;
      render();
      return keep(`#pn-note-${f}`);
    }
    if (act === "note-save") {
      const note = $(`#pn-note-${f}`)?.value.trim();
      noteOpen = null;
      if (note) applied(await post("feature", { feature: f, note }));
      else render();
      return keep(`[data-pn="note"][data-f="${f}"]`);
    }
    if (act === "flag-show") return showFlag();
    if (act === "flag-ok") {
      applied(await post("flag", {}));
      return keep('[data-pn="flag-show"]');
    }
    if (act === "ans" || act === "imp") {
      if (act === "ans") survey[b.dataset.q] = Number(b.dataset.v);
      else survey.improve = b.dataset.v;
      const group = b.parentElement;
      group.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      return;
    }
    if (act === "survey") {
      const err = $("#pn-survey .pn-err");
      if (SCALE.some((q) => !survey[q]) || !survey.improve) {
        err.textContent = t("pn.surveyNeed");
        err.hidden = false;
        return;
      }
      const { improve, ...answers } = survey;
      applied(await post("survey", { answers, improve }));
      survey = {};
      return keep("#pn-survey");
    }
  } catch (err) {
    D.toast(err?.message || t("off.noConnection"));
  }
}

// Zastavica je v glavi Inštruktorja: odpremo klepet in jo za trenutek poudarimo.
function showFlag() {
  D.showView("chat");
  const btn = $("#chat-bug");
  if (!btn || btn.hidden) return;
  btn.classList.add("pn-spot");
  btn.focus();
  D.toast(t("pn.flagHere"), "flag");
  setTimeout(() => btn.classList.remove("pn-spot"), 4000);
}

// ---------- ocena branja na zaslonu Skeniraj (public/scan/scan.js) ----------

/** Podatki za kartico ocene pri skeniranju (ali null, če profil ni v pilotu). */
export function scanTask(cond) {
  const s = pilotState();
  if (!s || !CONDS.includes(cond)) return null;
  return {
    cond,
    title: t("pn.rateTitle", { cond: t(`pn.cond.${cond}`) }),
    photo: s.photo,
    async rate({ ok, note, image, consent, problems }) {
      const body = { cond, ok, problems };
      if (note) body.note = note;
      if (consent && image && s.photo.allowed) Object.assign(body, { image, consent: true });
      applied(await post("scan", body));
      D.showView("pilot");
      setTimeout(() => $(`[data-pn="scan"][data-cond="${cond}"]`)?.focus(), 50);
    },
  };
}

// ---------- skrbnik: vsote brez imen (Račun → »Pilot: naloge članov«) ----------

export async function renderPilotAdmin(box, { api, toast }) {
  if (!box) return;
  let r;
  try {
    r = await api("/api/admin/pilot-naloge");
  } catch (err) {
    box.innerHTML = `<p class="muted">${esc(err.message)}</p>`;
    return;
  }
  const pc = (x) => (x == null ? "–" : Number(x).toLocaleString(locale(), { style: "percent", maximumFractionDigits: 0 }));
  const th = (k) => `<th scope="col">${esc(t(k))}</th>`;
  const cond = (c) => t(`pn.cond.${c}`);
  const feat = (f) => t(FEATURE_NAME[f] || f);
  box.innerHTML = `
    <p>${esc(t("pilot.n.sum", { members: r.members, photos: r.photos, survey: r.survey.n }))}</p>
    <h3>${esc(t("pilot.n.scan"))}</h3>
    <div class="pilot-scroll"><table class="table pilot-table"><thead><tr>${th("pilot.n.cond")}${th("pilot.n.n")}${th("pilot.n.ok")}${th("pilot.n.rate")}</tr></thead>
      <tbody>${r.scans.map((s) => `<tr><td>${esc(cond(s.cond))}</td><td>${s.n}</td><td>${s.ok}</td><td>${pc(s.rate)}</td></tr>`).join("")}</tbody></table></div>
    <h3>${esc(t("pilot.n.feat"))}</h3>
    <div class="pilot-scroll"><table class="table pilot-table"><thead><tr>${th("pilot.n.feature")}${th("pilot.n.n")}${th("pilot.n.bad")}</tr></thead>
      <tbody>${r.features.map((f) => `<tr><td>${esc(feat(f.feature))}</td><td>${f.n}</td><td>${f.bad}</td></tr>`).join("")}</tbody></table></div>
    <h3>${esc(t("pilot.n.survey"))} (${r.survey.n})</h3>
    <ul class="pilot-sum">${SCALE.map((q) => `<li><b>${r.survey.avg[q] == null ? "–" : Number(r.survey.avg[q]).toLocaleString(locale())}</b> ${esc(t(`pn.q.${q}`))}</li>`).join("")}
      <li>${esc(t("pilot.n.improve"))}: ${esc(IMPROVE.filter((k) => r.survey.improve[k]).map((k) => `${t(`pn.i.${k}`)} ${r.survey.improve[k]}`).join(", ") || "–")}</li></ul>
    ${r.notes.length ? `<h3>${esc(t("pilot.n.notes"))}</h3><ul class="pn-admin-notes">${r.notes.map((n) => `<li><small class="muted">${esc(n.kind === "scan" ? cond(n.what) : feat(n.what))} · ${esc(t(n.kind === "scan" ? (n.ok ? "pn.ok" : "pn.bad") : n.ok ? "pn.works" : "pn.broken"))}</small><br>${esc(n.note)}</li>`).join("")}</ul>` : ""}
    ${r.photoList.length ? `<h3>${esc(t("pilot.n.photosH"))}</h3><ul class="pn-admin-photos">${r.photoList.map((p) => `<li><a href="/api/admin/pilot-naloge/foto/${p.id}" target="_blank" rel="noopener">${icon("image")} ${esc(cond(p.cond))} · ${esc(t(p.ok ? "pn.ok" : "pn.bad"))}</a></li>`).join("")}</ul>` : ""}
    ${r.canAdd ? `<h3>${esc(t("pilot.n.members"))}</h3>
      <p class="muted small">${esc(t("pilot.n.schools"))}</p>
      ${r.accounts.length ? `<ul class="pn-admin-acc">${r.accounts.map((e) => `<li><span>${esc(e)}</span><button type="button" class="ghost" data-pn-rm="${esc(e)}">${esc(t("pilot.n.remove"))}</button></li>`).join("")}</ul>` : ""}
      <form class="pn-admin-add"><label for="pn-admin-email">${esc(t("pilot.n.email"))}</label><input id="pn-admin-email" type="email" autocomplete="off" required><button type="submit" class="primary">${esc(t("pilot.n.add"))}</button></form>` : ""}`;
  const set = async (email, on) => {
    try {
      await api("/api/admin/pilot-naloge/clani", { method: "POST", body: { email, on } });
      toast(t(on ? "pilot.n.added" : "pilot.n.removed"));
      renderPilotAdmin(box, { api, toast });
    } catch (err) {
      toast(err.message);
    }
  };
  box.querySelector(".pn-admin-add")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = $("#pn-admin-email", box).value.trim();
    if (v) set(v, true);
  });
  box.querySelectorAll("[data-pn-rm]").forEach((b) => b.addEventListener("click", () => set(b.dataset.pnRm, false)));
}

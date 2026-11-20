// Vadnica (tema, naloge, serije, preizkus predznanja), tekmovanja, NPZ in matura ter pretekle pole: iz public/app.js
// (naloga hitrost, docs/meritve/prijavljen-mobilno-2026-11-19.md točka 2). Ni del prvega odprtja Učne poti: app.js
// ga naloži takoj po prvem izrisu (zasloniPozneje) ali ob prvi uporabi (vadMod). Skupno stanje in pomožne funkcije
// dobi iz app.js (žive vezave ES modulov); besedila iz jedra (i18n-osnova.js, server/i18n-jedro.js ZASLONI_V_JEDRU).
import { icon } from "./icons.js";
import { t, locale, currentLang } from "./i18n-osnova.js";
import { figureSvg } from "./slike-nalog.js";
import { rewardOffer } from "./games/reward.js";
import { STAGES, stageOf } from "./games/stage.js";
import { attachPad, closePad, padIsSheet, openPad } from "./pad.js";
import { configureKeyboard, toggleKeyboard, keyboardOpenFor, keyboardLayer } from "./tipkovnica-lena.js";
import { expectedMs, progressAt, addDuration } from "./check-progress.js";
import { xpItemsHtml } from "./xp-fx.js";
import { accountsOn, accountStatus } from "./account.js";
import { povabiPoUspehu } from "./povabi.js";
import { SUBJECT_NAMES } from "./programs.js";
import { jeOs, TRACK, stopnja } from "./stopnja.js";
import { validDate } from "./goal-data.js";
import { matLevel, examName as siExamName, SI_EXAMS, loadPapers, mountPapers, paperLabel } from "./exam-papers.js";
import { levelLabel } from "./level-picker.js";
import { fmtDate, countdown } from "./goal.js";
import { partLabel, partKey } from "./our-paper-key.js";
import { refreshBubble } from "./okna.js";
import { poSliki } from "./kliki.js";
import { $, COMP_LEVEL_NAMES, EXTRA_SESSIONS, NODE, api, calcMode, calcSubject, choiceHtml, diffBadge, escapeHtml, examMode, extraSession, fbText, fillInput, isCompTopic, keptPaper, loadConversations, localStorageGet, localStorageSet, markFirstTask, markTopic, mayPlot, meBackHtml, offTabbarViews, openCalcOverlay, openConversation, openLesson, openLocalPaper, ourMod, plotFromText, prepBack, pripraviIzris, refreshXp, regionalExams, renderGoal, renderMath, renderRich, send, setActiveMode, setBack, setTaskFx, showView, siExams, state, studentUpdated, toast, topicCache, topicRich, unlockedHtml, withFormulaSubject, currentView, pathData, pathUnitsFor, prefetchPractice, takePractice, topicEntry, kopija } from "./app.js";

// Tema iz pomnilnika takoj (po sliki tapa); sicer pogled takoj z »Nalagam …« in oba klica hkrati (kliki.js teme).
let topicSeq = 0;
async function openTopic(topicId) {
  const n = ++topicSeq;
  const entry = topicEntry(topicId);
  // Stanje teme (sklop, vaje, status): zadnja Učna pot, če je tema v njej; sicer njena pot hkrati z vsebino (samo pot,
  // ki ji tema pripada; sicer pot teme, tp.path, ko vsebina pride).
  const known = pathUnitsFor(topicId);
  const guess = !known && state.pathKey && topicId.startsWith(`${state.pathKey}/`) ? pathData(state.pathKey) : null;
  guess?.catch(() => {});
  let tp = entry.v ? kopija(entry.v) : null;
  if (tp) {
    await poSliki();
    if (n !== topicSeq) return false;
  } else {
    // Vsebina še ni prišla: pogled teme takoj, z obvestilom »Nalagam …« (prejšnja tema ne ostane na zaslonu).
    const prev = currentView;
    state.topicFx = false;
    showView("topic");
    $("#topic-content").replaceChildren(Object.assign(document.createElement("p"), { className: "muted topic-loading", textContent: t("common.loading") }));
    try {
      tp = kopija(await entry.p);
    } catch (err) {
      // Tema ne obstaja ali ni povezave: nazaj, od koder je učenec prišel (prej se pogled sploh ni zamenjal).
      if (n === topicSeq && currentView === "topic") showView(prev && prev !== "topic" ? prev : state.backTo || "path");
      throw err;
    }
    if (n !== topicSeq) return false; // medtem odprta druga tema
  }
  state.topic = tp;
  state.topicFx = true;
  showView("topic");
  markTopic(tp?.id || topicId); // po showView: tema, odprta iz pogovora, je za odhodom iz inštruktorja
  // Pogled teme se drsi sam in si zapomni mesto: nova tema se vedno odpre na vrhu (»Nova snov« drugič, #view-topic).
  const vt = $("#view-topic");
  if (vt) vt.scrollTop = 0;
  let units = known;
  if (!units && guess) units = await guess.then((p) => (p?.key === tp.path ? p.units : null)).catch(() => null);
  if (!units) units = (await pathData(tp.path)).units;
  if (n !== topicSeq) return false;
  const unit = units.find((u) => u.topics.some((x) => x.id === tp.id));
  const hasPractice = unit?.topics.find((x) => x.id === tp.id);
  // Vse teme so odprte; če prejšnji sklop še ni osvojen, samo priporočimo, kje začeti.
  const tip = unit?.suggest?.topic;
  const aheadHint = tip
    ? `<div class="fb info ahead-hint">${icon("info")}<span>${t("topic.aheadHint", { unit: `<bdi>${escapeHtml(unit.suggest.unit)}</bdi>` })} <button type="button" class="text-btn" data-open="${escapeHtml(tip.id)}">${escapeHtml(tip.name)}</button></span></div>`
    : "";
  const canPractice = !!hasPractice?.practice;
  $("#topic-content").innerHTML = `<div class="topic-grid">
    <div class="card topic-head">
      <span class="eyebrow">${escapeHtml(tp.pathLabel)} · ${escapeHtml(tp.unit)}</span>
      <h1>${escapeHtml(tp.name)}</h1>
      <p class="goals">${icon("target")}<span>${escapeHtml(tp.goals)}</span></p>
      ${aheadHint}
      <div class="actions">
        ${canPractice ? `<button class="primary big" id="t-practice">${icon("pencil")}${t("topic.practice")}</button>` : ""}
        <button class="${canPractice ? "secondary" : "primary big"}" id="t-learn">${icon("message-circle")}${t("topic.learn")}</button>
        <button id="t-lesson" class="secondary">${icon("book-open")}${t("topic.lesson")}</button>
      </div>
      ${hasPractice?.status === "mastered" ? "" : `<button id="t-done" class="text-btn">${t("topic.known")}</button>`}
    </div>
    <div class="card explanation">
      <h2 class="with-icon">${icon("book-open")} ${t("topic.explanation")}</h2>
      ${
        tp.explanation
          ? topicRich(tp, tp.explanation)
          : `<p class="muted">${t("topic.noExplanation")}</p>`
      }
    </div>
    <div id="practice"></div></div>`;
  $("#t-practice")?.addEventListener("click", () => nextPractice());
  $("#t-learn").addEventListener("click", () => learnWithTutor(tp));
  $("#t-lesson").addEventListener("click", () => openLesson(tp.id));
  $("#t-done")?.addEventListener("click", async () => {
    if (!confirm(t("topic.confirmKnown"))) return;
    await api(`/api/students/${state.student.id}/topic-status`, { method: "POST", body: { topic_id: tp.id, status: "mastered" } });
    toast(t("topic.markedKnown"));
    openTopic(tp.id);
  });
  // Nova tema: najprej kratek test predznanja (tri naloge, od lažje do težje).
  if (canPractice && hasPractice.status === "new") return startPretest(tp);
  if (canPractice) prefetchPractice(tp.id); // »Vadi naloge« brez čakanja strežnika
  return false;
}

// Začetni test predznanja: rezultat določi začetno stopnjo vaj in zahtevnost inštruktorja.
// Vrne true, če je test prikazan (»Nova snov« takrat ne odpre takoj vaje).
async function startPretest(tp) {
  const out = await api(`/api/students/${state.student.id}/pretest`, { method: "POST", body: { topic_id: tp.id } }).catch(() => null);
  if (!out || out.skip || out.finished || !out.task) return false;
  // Test se odpre skupaj s temo: stran ostane na vrhu, polje brez samodejnega fokusa.
  renderTask(out.task, { mode: "pretest", index: out.index, total: out.total, noFocus: true });
  return true;
}

function pretestResultHtml(p) {
  const name = { osnovna: t("pretest.tierBasic"), srednja: t("pretest.tierMid"), "višja": t("pretest.tierHigh") }[p.tier];
  return `<div class="card result pretest-result">
    <div class="result-icon">${icon("target")}</div>
    <h2>${t("pretest.resultTitle", { tier: name })}</h2>
    <p>${t("pretest.score", { correct: p.correct, total: p.total })}</p>
    <p class="muted">${t(p.known >= 3 ? "pretest.textHigh" : p.known === 2 ? "pretest.textMid" : "pretest.textBasic")}</p>
    <div class="actions">
      <button class="primary big" id="pt-learn">${icon("message-circle")}${t("topic.learn")}</button>
      <button class="secondary" id="pt-practice">${icon("pencil")}${t("topic.practice")}</button>
      <button class="secondary" id="pt-lesson">${icon("book-open")}${t("topic.lesson")}</button>
    </div></div>`;
}

async function learnWithTutor(topic, firstMessage = t("topic.startMsg", { name: topic.name })) {
  const conv = await api(`/api/students/${state.student.id}/conversations`, { method: "POST", body: { topic_id: topic.id } });
  await loadConversations();
  showView("chat");
  await openConversation(conv.id);
  send(firstMessage);
}

// ---------- vadnica ----------

// stay: naloga se odpre skupaj s temo (»Nova snov«), zato ne skočimo do nje in ne fokusiramo polja.
async function nextPractice(opts) {
  const stay = opts?.stay === true;
  const box = $("#practice");
  let out;
  try {
    const pre = takePractice();
    out = pre && (await pre);
    if (out) await poSliki(); // pripravljena naloga: najprej slika tapa, nato izris
    else out = await api(`/api/students/${state.student.id}/practice/next`, { method: "POST", body: { topic_id: state.topic.id } });
  } catch (err) {
    box.innerHTML = `<div class="card task"><div class="fb bad">${icon("circle-x")}<span>${t("task.loadError", { msg: escapeHtml(err.message) })}</span></div></div>`;
    return;
  }
  if (out.example) {
    box.innerHTML = `<div class="card task example">
      <div class="task-top"><span class="eyebrow with-icon">${icon("book-open")} ${t("task.example")}</span></div>
      <div class="task-text"${out.example.textLang ? ` lang="${out.example.textLang}"` : ""}>${renderRich(out.example.text)}</div>
      ${out.example.figure ? figureSvg(out.example.figure) : ""}
      ${workedBlock(out.example, out.example.solution)}
      <div class="fb hint">${icon("lightbulb")}<div>${renderRich(out.example.hint)}</div></div>
      <div class="actions"><button class="primary big" id="ex-next">${t("task.yourTurn")}${icon("arrow-right")}</button></div>
    </div>`;
    $("#ex-next").addEventListener("click", nextPractice);
  } else {
    renderTask(out.task, { mode: "practice", noFocus: stay });
  }
  if (!stay) box.scrollIntoView({ behavior: "smooth", block: "start" });
}

const SESSIONS = {
  review: { mode: "review", icon: "repeat", title: t("session.review"), intro: t("session.reviewIntro"), empty: t("session.reviewEmpty") },
  placement: { mode: "placement", icon: "target", title: t("session.placement"), intro: t("session.placementIntro") },
  daily: { mode: "daily", icon: "zap", title: t("session.daily"), intro: t("session.dailyIntro"), empty: t("session.dailyEmpty") },
  "unit-practice": { mode: "unit", icon: "puzzle", title: t("session.unit"), intro: t("session.unitIntro") },
  "test-prep": { mode: "test", icon: "clipboard-check", title: t("session.testPrep"), intro: t("session.testPrepIntro") },
  class: { mode: "class", icon: "calendar-clock", title: t("session.class"), intro: t("session.classIntro"), empty: t("session.classEmpty") },
  tek: { mode: "tek", endpoint: "competition-training", icon: "medal", title: t("session.tek"), intro: t("session.tekIntro") },
  contest: { mode: "contest", icon: "timer", title: t("session.contest"), intro: t("session.contestIntro") },
};
const SESSION_DONE = { review: t("sessionDone.review"), daily: t("sessionDone.daily"), unit: t("sessionDone.unit"), test: t("sessionDone.test"), tek: t("sessionDone.tek"), class: t("sessionDone.class") };

async function startSession(kind, body = {}) {
  let cfg = SESSIONS[kind] || EXTRA_SESSIONS[kind];
  // Izpiti (zunaj Slovenije): isti mehanizem, a z izpitnimi naslovi.
  if (examMode() && kind === "tek") cfg = { ...cfg, icon: "target", title: t("exam.train"), intro: t("exam.trainText") };
  if (examMode() && kind === "contest") cfg = { ...cfg, title: t("exam.mock"), intro: t("exam.mockIntro") };
  setActiveMode({ review: "review", daily: "daily", "test-prep": "test" }[kind] || null);
  if (kind === "review" && state.pathKey) body = { path: state.pathKey, ...body }; // le izbrani predmet
  let out;
  try {
    out = await api(`/api/students/${state.student.id}/${cfg.endpoint || kind}`, { method: "POST", body });
  } catch (err) {
    toast(cfg.errorText?.(err) || err.message); // seje modulov prevedejo svoje kode napak (vaja_potekla …)
    return;
  }
  state.topicFx = false; // naloge serije niso iz odprte teme
  if (kind !== "tek" && kind !== "contest") setBack(cfg.back || "path");
  showView("topic");
  $("#topic-content").innerHTML = `<div class="session-grid"><div class="session-main"><div class="session-head"><span class="session-icon">${icon(cfg.icon)}</span><div><h1>${cfg.title}</h1><p class="muted">${cfg.intro}</p></div></div><div id="practice"></div></div><aside id="session-side" class="card explanation" hidden></aside></div>`;
  if (kind === "contest") {
    if (out.contest) return showContestResult(out.contest);
    state.contestDeadline = out.deadline;
    renderTask(out.task, { mode: "contest", index: out.index, total: out.total, sessionId: out.sessionId });
    return startContestTimer(out.sessionId, out.deadline);
  }
  if (out.finished) {
    $("#practice").innerHTML = out.empty ? `<p>${cfg.empty || t("session.noTasks")}</p>` : sessionDoneCard(cfg.mode, out);
    cfg.wire?.($("#practice"), out);
    $("#fb-back")?.addEventListener("click", () => showView(state.backTo || "path"));
    return;
  }
  renderTask(out.task, { mode: cfg.mode, index: out.index, total: out.total });
}

function sessionDoneCard(mode, n, xp = null) {
  const extra = extraSession(mode);
  if (extra?.doneHtml) return extra.doneHtml(n, xp);
  return `<div class="card result celebrate"><div class="result-icon">${icon("trophy")}</div><h2>${SESSION_DONE[mode] || t("common.done")}!</h2>
    <p>${t("result.firstTry", { correct: n.correct, total: n.total })}${n.xp ? ` · +${n.xp.gained} XP` : ""}</p>
    <button class="primary big" id="fb-back">${state.backTo === "competition" || state.backTo === "exams" ? prepBack() : t("result.toPath")}</button>${rewardHtml(mode, n, xp)}</div>`;
}
// Igra kot nagrada (public/games/reward.js): po dnevnem treningu ali doseženem dnevnem cilju ponudba ene igre
// iz pravkar vadene snovi; nikoli med učenjem, »Skrij igre« jo skrije, videz po stopnji (SŠ, fakulteta umirjeno).
function rewardHtml(mode, n, xp) {
  const list = state.student && rewardOffer(state.student.settings, mode, n, xp || state.xp);
  if (!list) return "";
  const calm = STAGES[stageOf(state.student.settings)].calm;
  return `<div class="reward-offer${calm ? " calm" : ""}"><span class="reward-ic" aria-hidden="true">${icon("gamepad-2")}</span><span class="reward-t"><b>${t("reward.title")}</b><small>${t("reward.sub")}</small></span>
    <button type="button" class="secondary" data-reward="${escapeHtml(list.join(","))}">${icon("gamepad-2")}${t("reward.play")}</button></div>`;
}

// Slike pri nalogah (graf premice, številska premica): public/slike-nalog.js.

// Na širokem zaslonu je med serijo nalog desno razlaga teme trenutne naloge (ne pri preizkusu znanja in tekmovanju).
const SIDE_MODES = ["review", "daily", "unit", "test", "tek", "list"];
async function showSideExplanation(task, ctx) {
  const side = $("#session-side");
  if (!side) return;
  if (!SIDE_MODES.includes(ctx.mode) || !task.topicId) return (side.hidden = true);
  if (side.dataset.topic === task.topicId) return;
  side.dataset.topic = task.topicId;
  try {
    if (!topicCache.has(task.topicId)) topicCache.set(task.topicId, await api(`/api/topic?id=${encodeURIComponent(task.topicId)}`));
    const tp = topicCache.get(task.topicId);
    if (side.dataset.topic !== task.topicId) return;
    side.innerHTML = `<h2 class="with-icon">${icon("book-open")} ${escapeHtml(tp.name)}</h2>${
      tp.explanation ? topicRich(tp, tp.explanation) : `<p class="muted">${t("topic.noExplanationShort")}</p>`
    }<button type="button" class="secondary small" id="side-lesson">${icon("book-open")}${t("topic.fullLesson")}</button>`;
    side.hidden = false;
    $("#side-lesson").addEventListener("click", () => openLesson(tp.id));
  } catch {
    side.hidden = true;
  }
}

// Ena izbira: čisti TeX, besedilo z $…$ (»$f(x) = x^4$«, »elipsa, $e = \\frac{5}{4}$«) ali navadno besedilo.

function renderTask(task, ctx) {
  setTaskFx(task);
  showSideExplanation(task, ctx);
  const box = $("#practice");
  // Tekmovalna imena težavnosti (težja, zahtevna, izziv) samo pri slovenskih tekmovanjih, ne pri izpitih.
  const comp = !examMode() && (ctx.mode === "tek" || ctx.mode === "contest" || (ctx.mode === "practice" && isCompTopic(state.topic?.id)));
  const stars = !["placement", "pretest"].includes(ctx.mode) && task.level ? diffBadge(task.level, comp) : "";
  const pts = ctx.mode === "contest" && task.points ? `<span class="pts">${t("task.points", { n: task.points })}</span>` : "";
  const counter = ctx.total ? `<span class="count">${ctx.index} / ${ctx.total}</span>` : "";
  let input;
  if (task.answerType === "choice") {
    // Dolge izbire (logični izrazi, formule) v enem stolpcu, da se na telefonu ne prelomijo sredi izraza.
    const oneCol = task.options.some((o) => String(o).replace(/\\[a-zA-Z]+/g, "x").length > 20);
    input = `<div class="choices${oneCol ? " one-col" : ""}">${task.options
      .map((o, i) => `<button type="button" class="choice" data-i="${i}">${choiceHtml(task, o, false)}</button>`)
      .join("")}</div>`;
  } else {
    const ph =
      task.inputHint ||
      (task.answerType === "coefficients" ? t("task.phCoef") : task.hasUnit ? t("task.phUnit") : t("task.phResult"));
    input = `<form class="answer-row"><input id="answer" aria-label="${escapeHtml(t("games.yourAnswer"))}" dir="ltr" autocomplete="off" autocapitalize="off" spellcheck="false" inputmode="${task.answerType === "number" && !task.hasUnit ? "decimal" : "text"}" placeholder="${escapeHtml(ph)}"><button type="button" class="pad-open-btn secondary" title="${t("task.writeTitle")}">${icon("pencil")}<span>${t("task.write")}</span></button><button class="primary">${t("task.check")}</button></form>`;
  }
  const calcBtn = ["contest", "placement", "pretest"].includes(ctx.mode) ? "" : `<button type="button" class="ghost task-calc icon-only" title="${escapeHtml(t("nav.graph"))}" aria-label="${escapeHtml(t("nav.graph"))}">${icon("calculator")}</button>`;
  const bar = ctx.mode === "contest" ? `<div class="contest-bar"><span id="contest-timer" class="contest-timer" role="timer">${icon("timer")}<b>${leftText(state.contestDeadline)}</b></span><span class="muted">${t("comp.timerNote")}</span>${ctx.total ? `<span class="contest-count">${ctx.index} / ${ctx.total}</span>` : ""}</div>` : "";
  const penalty = ctx.mode === "contest" && task.penalty ? `<span class="pts neg">${t("exam.penaltyPts", { n: String(task.penalty).replace("-", "−") })}</span>` : "";
  const hintLadder = task.hintSteps > 0 && !["contest", "placement", "pretest"].includes(ctx.mode);
  const pretestHead =
    ctx.mode === "pretest" ? `<div class="card pretest-head"><h2 class="with-icon">${icon("target")} ${t("pretest.title")}</h2><p class="muted">${t("pretest.intro")}</p>${ctx.note ? `<p class="pretest-note with-icon" role="status">${icon(ctx.note.icon)}<span>${escapeHtml(ctx.note.text)}</span></p>` : ""}</div>` : "";
  box.innerHTML = `${bar}${pretestHead}<div class="card task${["contest", "placement", "pretest"].includes(ctx.mode) ? " no-fx" : ""}" data-task-id="${escapeHtml(String(task.id ?? ""))}">
    <div class="task-top task-tag"><span class="task-topic">${task.topicName ? escapeHtml(task.topicName) : ""}</span>${stars}${pts}${penalty}${counter}${calcBtn}</div>
    ${ctx.total ? `<div class="progress" aria-hidden="true"><div style="width:${Math.round(((ctx.index - 1) / ctx.total) * 100)}%"></div></div>` : ""}
    <div class="task-text"${task.textLang ? ` lang="${task.textLang}"` : ""}>${renderRich(task.text)}</div>
    ${task.figure ? figureSvg(task.figure) : ""}
    ${workHtml()}
    ${input}
    ${hintLadder ? `<div id="hint-box" class="hint-box" aria-live="polite"></div><div class="hint-row"><button type="button" class="ghost small" id="hint-btn">${icon("lightbulb")}<span>${t("task.hintBtn")}</span></button></div>` : ""}
    <div id="feedback" class="feedback" aria-live="polite"></div>
    ${ctx.mode === "pretest" ? `<div class="contest-actions"><button type="button" class="secondary small" id="p-skip">${icon("circle-help")}${t("pretest.dontKnow")}</button></div>` : ""}
    ${ctx.mode === "contest" ? `<div class="contest-actions"><button type="button" class="secondary small" id="c-skip">${icon("skip-forward")}${t("comp.skip")}</button><button type="button" class="text-btn" id="c-finish">${icon("flag")}${examMode() ? t("exam.finish") : t("comp.finish")}</button></div>` : ""}
  </div>`;
  wireWork(box, task);
  // En »Preveri« naenkrat; po končnem izidu (edini poskus, rešeno, rešen zgled) se odgovor ne pošilja več.
  // Elemente ujamemo zdaj: po odgovoru lahko #practice že prikazuje naslednjo nalogo.
  const card = box.querySelector(".card.task");
  const sendBtns = [...card.querySelectorAll(".answer-row button.primary, .choice")];
  let checking = false;
  let finished = false;
  const submit = async (value) => {
    if (checking || finished) return;
    checking = true;
    sendBtns.forEach((b) => (b.disabled = true));
    try {
      finished = await checkTask(task, ctx, value);
    } finally {
      checking = false;
    }
    if (finished) card.querySelectorAll(".answer-row input, .answer-row button, .choice").forEach((el) => (el.disabled = true));
    else sendBtns.forEach((b) => (b.disabled = false));
  };
  // Lestev namigov: vsak klik odpre en korak več (podatki → formula → prvi korak).
  let hintShown = 0;
  $("#hint-btn")?.addEventListener("click", async () => {
    const btn = $("#hint-btn");
    btn.disabled = true;
    try {
      const r = await api(`/api/students/${state.student.id}/tasks/${task.id}/hint`, { method: "POST", body: { step: hintShown + 1 } });
      hintShown = r.steps.length;
      $("#hint-box").innerHTML = r.steps.map((st, i) => hintStepHtml(st, i + 1, r.total)).join("");
      if (hintShown >= r.total) btn.remove();
      else {
        btn.disabled = false;
        btn.querySelector("span").textContent = t("task.hintMore");
      }
    } catch (err) {
      btn.disabled = false;
      $("#hint-box").innerHTML = `<div class="fb bad">${escapeHtml(err.message)}</div>`;
    }
  });
  box.querySelector(".task-calc")?.addEventListener("click", async () => {
    const exprs = mayPlot(task.text) ? await plotFromText(task.text) : [];
    // enačba krivulje → graf, sicer računalo
    openCalcOverlay(exprs.length ? { mode: "graph", exprs, backLabel: t("gc.backTask") } : { mode: calcSubject() === "KEM" ? "pse" : calcMode === "graph" ? "sci" : calcMode, backLabel: t("gc.backTask") });
  });
  $("#p-skip")?.addEventListener("click", async () => {
    $("#p-skip").disabled = true;
    const r = await api(`/api/students/${state.student.id}/tasks/${task.id}/skip`, { method: "POST" }).catch((e) => ({ error: e.message }));
    if (r.error) return toast(r.error);
    pretestStep(r, ctx);
  });
  if (ctx.mode === "contest") {
    $("#c-skip").addEventListener("click", async () => {
      if (!confirm(t("comp.confirmSkip"))) return;
      contestStep(await api(`/api/students/${state.student.id}/tasks/${task.id}/skip`, { method: "POST" }).catch((e) => ({ error: e.message })), ctx);
    });
    $("#c-finish").addEventListener("click", async () => {
      if (!confirm(examMode() ? t("exam.confirmFinish") : t("comp.confirmFinish"))) return;
      finishContest(ctx.sessionId);
    });
  }
  box.querySelector("form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    submit($("#answer").value);
  });
  box.querySelectorAll(".choice").forEach((b) => b.addEventListener("click", () => submit(b.dataset.i)));
  const form = box.querySelector("form");
  if (form) {
    attachPad({
      task,
      form,
      input: $("#answer"),
      opener: form.querySelector(".pad-open-btn"),
      subject: calcSubject(),
      readFn: (image) => api(`/api/students/${state.student.id}/tasks/${task.id}/read`, { method: "POST", body: { image } }),
      stay: !!ctx.noFocus,
    });
    if (!ctx.noFocus && !document.body.classList.contains("pad-open")) $("#answer").focus();
  } else closePad();
}

// ---------- vmesni koraki (kot v zvezek) in pomoč inštruktorja pri nalogi ----------
const WORK_OPEN_KEY = "evklid.workOpen";
const workKey = (id) => `evklid.work.${id}`;
function lsGet(k) {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
}
function lsSet(k, v) {
  try {
    if (v) localStorage.setItem(k, v);
    else localStorage.removeItem(k);
  } catch {}
}
const workOf = (taskId) => (taskId ? lsGet(workKey(taskId)) || "" : "");

function workHtml() {
  return `<div class="work">
    <button type="button" class="work-toggle" aria-expanded="false">${icon("notebook-pen")}<span>${t("task.work")}</span>${icon("chevron-down")}</button>
    <div class="work-body" hidden>
      <textarea class="work-text" rows="3" spellcheck="false" aria-label="${escapeHtml(t("task.work"))}" placeholder="${escapeHtml(t("task.workPh"))}"></textarea>
      <button type="button" class="ghost small icon-only work-sym" aria-pressed="false" title="${escapeHtml(t("chat.symbols"))}" aria-label="${escapeHtml(t("chat.symbols"))}">${icon("sigma")}</button>
    </div>
  </div>`;
}

// Zapis se shrani v napravo (po nalogi) in gre zraven, ko učenec vpraša inštruktorja.
function wireWork(box, task) {
  const w = box.querySelector(".work");
  if (!w) return;
  const btn = w.querySelector(".work-toggle");
  const body = w.querySelector(".work-body");
  const ta = w.querySelector(".work-text");
  const grow = () => {
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight + 2, 420)}px`;
  };
  const setOpen = (open, remember) => {
    body.hidden = !open;
    w.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", String(open));
    if (remember) lsSet(WORK_OPEN_KEY, open ? "1" : "0");
    if (open) grow();
  };
  ta.value = workOf(task.id);
  const pref = lsGet(WORK_OPEN_KEY);
  // Na računalniku je prostor odprt, na telefonu se odpre z dotikom (manj drsenja); izbira se zapomni.
  setOpen(ta.value ? true : pref ? pref === "1" : matchMedia("(min-width: 900px) and (pointer: fine)").matches, false);
  btn.addEventListener("click", () => {
    setOpen(body.hidden, true);
    if (!body.hidden) ta.focus();
  });
  ta.addEventListener("input", () => {
    lsSet(workKey(task.id), ta.value.trim() ? ta.value : "");
    grow();
  });
  // Na telefonu bi plošča Piši in tipkovnica skupaj prekrili vse.
  ta.addEventListener("focus", () => {
    if (padIsSheet()) closePad();
  });
  // Σ odpre Evklidovo tipkovnico na plasti simbolov za zvezek.
  configureKeyboard(ta, { math: true, layers: ["abc", "num", "fx", "sym", "kem"], start: "num" });
  const symBtn = w.querySelector(".work-sym");
  symBtn.addEventListener("click", () => toggleKeyboard(ta, { layer: "sym" }));
  const sync = () => {
    if (!symBtn.isConnected) return window.removeEventListener("evklid:tipkovnica", sync);
    const on = keyboardOpenFor(ta) && keyboardLayer() === "sym";
    symBtn.setAttribute("aria-pressed", String(on));
    symBtn.classList.toggle("on", on);
  };
  window.addEventListener("evklid:tipkovnica", sync);
}

const tutorRow = (taskId) =>
  taskId && navigator.onLine !== false
    ? `<div class="tutor-row" data-task="${taskId}">
        <button type="button" class="secondary small" data-tutor="explain">${icon("message-circle")}${t("task.explain")}</button>
        <button type="button" class="secondary small" data-tutor="review">${icon("clipboard-check")}${t("task.reviewTutor")}</button>
      </div>`
    : "";

// Odpre Inštruktorja z nalogo, odgovorom in vmesnimi koraki.
async function askTutorAbout(taskId, kind) {
  try {
    const h = await api(`/api/students/${state.student.id}/tasks/${taskId}/help`, { method: "POST", body: { kind, work: workOf(taskId) } });
    await loadConversations();
    showView("chat");
    await openConversation(h.conversation.id);
    send(h.text);
  } catch (err) {
    toast(err.message);
  }
}
document.addEventListener("click", (e) => {
  const b = e.target.closest(".tutor-row [data-tutor]");
  if (b) askTutorAbout(b.closest(".tutor-row").dataset.task, b.dataset.tutor);
});

function hintStepHtml(st, n, total) {
  const tex = (x) => renderMath(String(x), false);
  const head = `<b>${t("task.hintStep", { n, total })}</b> `;
  if (st.kind === "data") {
    return `<div class="fb hint">${icon("list-checks")}<div>${head}${t("task.hintData")}<div class="task-data">
      <div class="data-col"><span class="sol-label">${t("task.given")}</span><div class="data-list">${st.given.map((x) => `<div>${tex(x)}</div>`).join("")}</div></div>
      ${st.find.length ? `<div class="data-col"><span class="sol-label">${t("task.find")}</span><div class="data-list">${st.find.map((x) => `<div>${tex(`${x} = \\,?`)}</div>`).join("")}</div></div>` : ""}
    </div></div></div>`;
  }
  if (st.kind === "formula") return `<div class="fb hint">${icon("sigma")}<div>${head}${t("task.hintFormula")}<div class="formula-body">${st.formula.map((f) => `<div>${tex(f)}</div>`).join("")}</div></div></div>`;
  return `<div class="fb hint">${icon("lightbulb")}<div>${head}${renderRich(st.text)}</div></div>`;
}

// Prepoznana tipična napaka (iz generatorja ali splošni vzorec: predznak, pretvorba enot …).
// Razlage generatorjev imajo pogosto formule ($\frac{1}{5}$): te izrišemo, preostalo besedilo ubežimo.
const inlineMath = (s) =>
  String(s ?? "")
    .split(/(\$[^$\n]+\$)/)
    .map((p) => (/^\$[^$\n]+\$$/.test(p) ? renderMath(p.slice(1, -1), false, false) : escapeHtml(p)))
    .join("");
const mistakeHtml = (m) => (m ? `<div class="fb info mistake">${icon("search")}<span>${m.code ? escapeHtml(fbText(m)) : inlineMath(m.message)}</span></div>` : "");

// Rešitev z izpisanimi podatki iz besedila (Podatki / Iščemo) in formulo, skrito za gumbom.
function workedBlock(task, solution, label = t("task.solution")) {
  const d = task.data;
  const tex = (t) => renderMath(String(t), false);
  const dataHtml =
    d && Array.isArray(d.given) && d.given.length
      ? `<div class="task-data">
          <div class="data-col"><span class="sol-label">${t("task.given")}</span><div class="data-list">${d.given.map((x) => `<div>${tex(x)}</div>`).join("")}</div></div>
          ${Array.isArray(d.find) && d.find.length ? `<div class="data-col"><span class="sol-label">${t("task.find")}</span><div class="data-list">${d.find.map((x) => `<div>${tex(`${x} = \\,?`)}</div>`).join("")}</div></div>` : ""}
        </div>`
      : "";
  const formulas = task.formula ? (Array.isArray(task.formula) ? task.formula : [task.formula]) : [];
  const formulaHtml = formulas.length
    ? `<details class="formula"><summary>${icon("eye")}${t("task.showFormula")}</summary><div class="formula-body">${formulas.map((f) => `<div>${tex(f)}</div>`).join("")}</div></details>`
    : "";
  return `<div class="solution">${dataHtml}${formulaHtml}<span class="sol-label">${label}</span>${renderRich(solution)}</div>`;
}

// Preverjanje, ki traja več kot 2 s, dobi vrstico napredka z oceno preostalega časa (public/check-progress.js).
const CHECK_TIMES_KEY = "evklid.checkTimes";
function checkBar(fb) {
  const start = Date.now();
  let hist = [];
  try { hist = JSON.parse(lsGet(CHECK_TIMES_KEY) || "[]"); } catch {}
  const expected = expectedMs(hist);
  const tick = () => {
    const p = progressAt(Date.now() - start, expected);
    if (!p) return;
    let bar = fb.querySelector(".check-bar");
    if (!bar) {
      fb.innerHTML = `<div class="fb info check-wait"><div><span class="check-label"></span><div class="check-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-label="${escapeHtml(t("task.checking"))}"><div></div></div></div></div>`;
      bar = fb.querySelector(".check-bar");
    }
    bar.firstElementChild.style.width = `${Math.round(p.pct * 100)}%`;
    bar.setAttribute("aria-valuenow", String(Math.round(p.pct * 100)));
    fb.querySelector(".check-label").textContent = `${t("task.checking")} ${p.left ? t("task.checkLeft", { n: p.left }) : t("task.checkAlmost")}`;
  };
  const timer = setInterval(tick, 250);
  // Trajanje shranimo samo, ko je izid prišel (napaka povezave bi pokvarila oceno).
  return (ok) => {
    clearInterval(timer);
    if (ok) lsSet(CHECK_TIMES_KEY, JSON.stringify(addDuration(hist, Date.now() - start)));
  };
}

async function checkTask(task, ctx, value) {
  const fb = $("#feedback");
  const asked = state.student; // profil, ki je odgovoril (med preverjanjem lahko zamenjan)
  let r;
  try {
    fb.innerHTML = `<div class="fb info">${t("task.checking")}</div>`;
    const stop = checkBar(fb);
    try {
      r = await api(`/api/students/${state.student.id}/tasks/${task.id}/answer`, { method: "POST", body: { answer: value } });
    } finally {
      stop(!!r);
    }
  } catch (err) {
    // Učenec napako vidi, namesto da se ne zgodi nič. Z »Preveri povezavo« samo, ko strežnik ni odgovoril.
    const msg = escapeHtml(err.message);
    fb.innerHTML = `<div class="fb bad">${icon("circle-x")}<span>${err.status ? t("task.checkFailed", { msg }) : t("task.checkError", { msg })}</span></div>`;
    return false;
  }
  if (r.correct) markFirstTask(asked); // po prvi rešeni nalogi pridejo vprašalnik zanimanj in vodič (maybeIntro)
  const next = (label = t("task.next")) => `<div class="actions"><button class="primary big" id="fb-next">${label}${icon("arrow-right")}</button></div>`;
  // Naloga je bila že preverjena (npr. drugi dotik na »Preveri«): pokažemo shranjeni izid, ne napake.
  const closedNote = r.closed ? `<div class="fb info">${icon("info")}<span>${t("task.alreadyChecked")}</span></div>` : "";
  let html = "";
  if (ctx.mode === "contest" && !r.retry) {
    contestStep(r, ctx);
    return true;
  }
  if (ctx.mode === "pretest" && !r.retry) {
    pretestStep(r, ctx);
    return true;
  }
  if (r.retry) {
    html = `<div class="fb info">${escapeHtml(fbText(r))}</div>`;
  } else if (ctx.mode === "placement") {
    html = `<div class="fb ${r.correct ? "ok" : "bad"}">${icon(r.correct ? "circle-check" : "circle-x")}<span>${r.correct ? t("task.correct") : t("task.wrong")}</span></div>${closedNote}${r.message ? `<div class="fb info">${icon("info")}<span>${escapeHtml(fbText(r))}</span></div>` : ""}`;
    if (r.placement) {
      const p = r.placement;
      html += `<div class="card result ${p.passed ? "celebrate" : ""}">${p.passed ? `<div class="result-icon">${icon("award")}</div>` : ""}<h2>${p.passed ? t("placement.passed") : t("placement.notYet")}</h2>
        <p>${t("placement.score", { correct: p.correct, total: p.total })}${p.passed ? (p.xp ? ` +${p.xp.gained} XP` : "") : t("placement.startFirst")}</p>${r.unlocked ? unlockedHtml(r.unlocked) : ""}
        <button class="primary big" id="fb-back">${t("result.toPath")}</button></div>`;
      if (p.passed) html += `<div class="povabi-slot"></div>`;
    } else html += next();
  } else if (r.closed) {
    html = `<div class="fb ${r.correct ? "ok" : "bad"}">${icon(r.correct ? "circle-check" : "circle-x")}<span>${r.correct ? t("task.correct") : t("task.wrong")}</span></div>${closedNote}
      ${r.solution ? workedBlock(task, r.solution, r.correct ? t("task.solution") : t("task.example")) : ""}`;
    html += ctx.mode !== "practice" && r.next?.finished ? sessionDoneCard(ctx.mode, r.next, r.xp) : next(ctx.mode === "practice" && !r.correct ? t("task.similar") : t("task.next"));
  } else if (r.correct) {
    html = `<div class="fb ok pop">${icon("circle-check")}<span><b>${t("task.correctBang")}</b>${r.levelUp ? t("task.harder") : ""}</span><span class="xp-gain">${r.offline ? t("off.xpLater") : `<bdi dir="ltr">+${r.xp.gained} XP</bdi>`}</span></div>
      ${r.offline ? "" : xpItemsHtml(r.xp)}
      ${r.mastered ? `<div class="fb mastered pop">${icon("trophy")}<span>${t("task.mastered")}</span></div>` : ""}
      ${r.unlocked ? unlockedHtml(r.unlocked) : ""}
      ${workedBlock(task, r.solution)}
      ${r.selfExplain ? `<div class="fb info">${icon("circle-help")}<span>${escapeHtml(r.selfExplain)}</span></div>` : ""}
      ${r.offline ? "" : tutorRow(task.id)}`;
    html += ctx.mode !== "practice" && r.next?.finished ? sessionDoneCard(ctx.mode, r.next, r.xp) : next();
    if (!r.offline) html += `<div class="potrdi-slot"></div>`; // potrditev e-naslova šele po rešeni nalogi (#747)
    // Osvojena tema: povabilo po končani nalogi; med serijo (trening, priprava na test) šele, ko je serija končana.
    if (r.mastered && !r.offline && (ctx.mode === "practice" || r.next?.finished)) html += `<div class="povabi-slot"></div>`;
  } else {
    html = `<div class="fb bad shake">${icon("circle-x")}<span>${escapeHtml(fbText(r) || t("task.wrong"))}</span></div>
      ${mistakeHtml(r.mistake)}
      ${r.levelDown ? `<div class="muted">${t("task.easier")}</div>` : ""}
      ${r.hint ? `<div class="fb hint">${icon("lightbulb")}<div><b>${t("task.hint")}</b> ${renderRich(r.hint)}</div></div>` : ""}`;
    if (r.solution) {
      html += workedBlock(task, r.solution, t("task.example"));
      if (!r.offline) html += tutorRow(task.id);
      html += ctx.mode !== "practice" && r.next?.finished ? sessionDoneCard(ctx.mode, r.next, r.xp) : next(ctx.mode === "practice" ? t("task.similar") : t("task.next"));
    } else {
      html += `<div class="actions"><button id="fb-retry" class="primary big">${t("task.retry")}</button>
        ${r.offline ? "" : `<button id="fb-help" class="secondary">${icon("message-circle")}${t("task.askTutor")}</button>`}</div>
        ${r.offline ? "" : `<p class="muted small-note">${t("task.attemptsLeft", { n: r.attemptsLeft })}</p>`}`;
    }
  }
  fb.innerHTML = html;
  const sid = state.student?.id;
  if (accountsOn()) povabiPoUspehu(fb.querySelector(".povabi-slot"), { api, profileId: sid, toast, alive: () => state.student?.id === sid });
  // Modul se naloži šele ob rešeni nalogi (ni ga na zagonu); potrjen račun ne vidi ničesar.
  const potrdiSlot = accountsOn() && accountStatus()?.parent?.verified === false && fb.querySelector(".potrdi-slot");
  if (potrdiSlot) import("./potrditev-po-nalogi.js").then((m) => m.potrdiPoNalogi(potrdiSlot)).catch(() => {});
  // Nov XP (pravilno, opravljen preizkus znanja, konec treninga): zgornji znesek se animira, ob novi ravni čestitka.
  if (!r.offline && (r.correct || r.xp || r.placement?.xp || r.next?.xp)) refreshXp();
  // Ko je naloga zaključena, plošča izgine, da sta razlaga in gumb »Naprej« vidna.
  let padClosedForFeedback = false;
  if (!r.retry && (r.correct || r.solution || ctx.mode === "placement")) closePad();
  else if (!r.retry && padIsSheet()) {
    // Na telefonu plošča prekrije povratno informacijo; zapremo jo, »Poskusi znova« jo spet odpre.
    closePad();
    padClosedForFeedback = true;
  }
  fb.scrollIntoView({ block: "nearest", behavior: "smooth" });
  $("#fb-retry")?.addEventListener("click", () => {
    fb.innerHTML = "";
    if (padClosedForFeedback) openPad();
    else $("#answer")?.select();
  });
  const done = !r.retry && (r.closed || r.correct || !!r.solution || ctx.mode === "placement");
  $("#fb-help")?.addEventListener("click", async () => {
    const h = await api(`/api/students/${state.student.id}/tasks/${task.id}/help`, { method: "POST", body: { work: workOf(task.id) } });
    await loadConversations();
    showView("chat");
    await openConversation(h.conversation.id);
    send(h.text);
  });
  $("#fb-back")?.addEventListener("click", () => showView(state.backTo || "path"));
  if (r.next?.finished) extraSession(ctx.mode)?.wire?.(fb, r.next);
  if (ctx.mode === "practice" && $("#fb-next")) prefetchPractice(state.topic?.id); // »Naprej« brez čakanja strežnika
  $("#fb-next")?.addEventListener("click", () => {
    if (ctx.mode === "practice") return nextPractice();
    const n = r.next;
    if (n && !n.finished) renderTask(n.task, { mode: ctx.mode, index: n.index, total: n.total });
  });
  return done;
}

// Test predznanja: brez rešitve in namigov, takoj naslednja naloga; na koncu raven in nadaljevanje.
function pretestStep(r, ctx) {
  closePad();
  if (r.pretest) {
    const tp = state.topic;
    $("#practice").innerHTML = pretestResultHtml(r.pretest);
    $("#pt-learn").addEventListener("click", () => learnWithTutor(tp));
    $("#pt-practice").addEventListener("click", () => nextPractice());
    $("#pt-lesson").addEventListener("click", () => openLesson(tp.id));
    $("#practice").scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  const n = r.next;
  if (n && !n.finished) {
    // Odziv na prejšnje vprašanje je v glavi preizkusa, ne v obvestilu na dnu, ki bi prekrilo izbire.
    const note = { text: r.skipped ? t("pretest.skipped") : r.correct ? t("task.correct") : t("pretest.noted"), icon: r.correct ? "circle-check" : "arrow-right" };
    renderTask(n.task, { mode: "pretest", index: n.index, total: n.total, note });
  }
}

// ---------- tekmovanja ----------

const SCHOOL_NAMES = { OS: t("comp.os"), SS: t("comp.ss") };

async function loadCompetition(key = state.compKey) {
  const box = $("#competition-content");
  const act = state.compAction; // bližnjica s Učne poti (renderGoalModes)
  state.compAction = null;
  const q = key ? `?key=${encodeURIComponent(key)}` : "";
  let c;
  try {
    c = await api(`/api/students/${state.student.id}/competition${q}`);
  } catch (err) {
    box.innerHTML = `<p class="muted">${t("comp.loadError", { msg: escapeHtml(err.message) })}</p>`;
    return;
  }
  if (!c.key) {
    box.innerHTML = `<h1>${t("comp.title")}</h1><p class="muted">${escapeHtml(c.message)}</p>`;
    return;
  }
  state.compKey = c.key;
  const seg = (items, cur, attr) =>
    `<div class="seg" role="group">${items.map(([v, label]) => `<button type="button" class="${v === cur ? "active" : ""}" aria-pressed="${v === cur}" ${attr}="${v}">${label}</button>`).join("")}</div>`;
  const left = c.openContest ? Math.max(1, Math.ceil((c.openContest.deadline - Date.now()) / 60000)) : 0;
  const hist = c.history.length
    ? `<ul class="contest-history">${c.history.map((h) => `<li><span>${escapeHtml(new Date(h.date).toLocaleDateString(locale()))}</span><b>${h.points} / ${h.maxPoints}</b><span class="bar"><i style="width:${Math.round((h.points / h.maxPoints) * 100)}%"></i></span></li>`).join("")}</ul>`
    : `<p class="muted small-note">${t("comp.historyEmpty")}</p>`;
  const learning = c.units.flatMap((u) => u.topics).filter((t) => t.status !== "new").length;
  box.innerHTML = `
    ${offTabbarViews().includes("competition") ? meBackHtml("competition") : ""}
    <h1>${t("comp.title")}</h1>
    <div class="comp-pickers">
      ${seg(["MAT", "FIZ", "KEM"].map((k) => [k, SUBJECT_NAMES[k] || k]), c.subject, "data-comp-subject")}
      ${seg(Object.entries(SCHOOL_NAMES), c.school, "data-comp-school")}
    </div>
    <p class="muted comp-intro">${t("comp.intro", { list: c.competitions.map(escapeHtml).join(", ") })}</p>
    <div class="card xp-card comp-hero">
      <div class="hero">
        <div class="hero-icon">${icon("medal")}</div>
        <div class="hero-text"><h2>${t("session.tek")}</h2><p>${t("comp.trainText")}</p></div>
        <button class="primary big" data-comp-train>${t("common.start")}</button>
      </div>
    </div>
    <section class="card contest-card">
      <div class="contest-head">
        <span class="session-icon">${icon("timer")}</span>
        <div><h2>${t("session.contest")}</h2>
          <p class="muted">${t("comp.contestText", { tasks: c.contest.tasks, minutes: c.contest.minutes, max: c.contest.maxPoints })}</p></div>
      </div>
      <button class="primary" data-comp-contest>${c.openContest ? t("comp.continue", { n: left }) : t("comp.startContest")}</button>
      <span class="field-label">${t("comp.lastResults")}</span>
      ${hist}
    </section>
    <h2 class="comp-topics-title">${t("comp.topics")}</h2>
    <p class="muted small-note">${learning ? t("comp.topicsSaved") : t("comp.topicsFree")}</p>
    ${c.units
      .map(
        (u, ui) => `<section class="unit card">
        <div class="unit-head"><div class="ring" style="--p:${Math.round(u.progress * 100)}"><span>${Math.round(u.progress * 100)}%</span></div>
          <div class="unit-title"><span class="eyebrow">${t("unit.label", { n: ui + 1 })}</span><h2>${escapeHtml(u.title)}</h2></div></div>
        <ol class="path">${u.topics
          .map((tp) => {
            const st = tp.due ? "due" : tp.status;
            const sub = NODE[st][1] + (tp.practice && tp.status === "learning" ? ` · ${COMP_LEVEL_NAMES[tp.level]}` : "");
            return `<li><button class="node ${st}" data-open="${tp.id}"><span class="node-dot">${icon(NODE[st][0])}</span>
              <span class="node-text"><span class="node-name">${escapeHtml(tp.name)}</span><span class="node-sub">${sub}</span></span></button></li>`;
          })
          .join("")}</ol></section>`,
      )
      .join("")}`;
  // Bližnjica s Učne poti (cilj tekmovanje): trening se začne takoj, pri poskusnem tekmovanju (na čas) le pokažemo kartico.
  if (act === "tek") box.querySelector("[data-comp-train]")?.click();
  if (act === "contest") {
    box.querySelector(".contest-card")?.scrollIntoView({ block: "center" });
    box.querySelector("[data-comp-contest]")?.focus({ preventScroll: true });
  }
}

document.addEventListener("click", (e) => {
  const subj = e.target.closest("[data-comp-subject]");
  const school = e.target.closest("[data-comp-school]");
  if (subj || school) {
    const [s0, , sc0] = (state.compKey || "MAT-TEK-OS").split("-");
    loadCompetition(`${subj ? subj.dataset.compSubject : s0}-TEK-${school ? school.dataset.compSchool : sc0}`);
  }
  // Iz razdelka »NPZ in matura« gre serija na izpitno pot in nazaj tja; regijski »Izpiti« so v zavihku Tekmovanja.
  const prep = e.target.closest("#view-exams") ? "exams" : "competition";
  const key = prep === "exams" || regionalExams() ? state.examKey : state.compKey;
  // Matura iz matematike: Vadba in Poskusni izpit na ravni, izbrani na strani (examRaven).
  const raven = prep === "exams" ? examRaven() : null;
  if (e.target.closest("[data-comp-train]")) {
    setBack(prep);
    startSession("tek", { path: key, ...(raven ? { raven } : {}) });
  }
  if (e.target.closest("[data-comp-contest]")) {
    setBack(prep);
    startSession("contest", { path: key, ...(raven ? { raven } : {}) });
  }
});

// ---------- priprave na izpite: regijski »Izpiti« (v zavihku Tekmovanja) in slovenski »NPZ in matura« ----------

// Cilj, ki ustreza izpitom šole: NPZ v OŠ, matura v SŠ (splošna ali poklicna).
const siGoal = () => (jeOs(state.student?.settings) ? "npz" : "matura");

// Kartica Pripravljenost: dni do izpita (datum cilja), delež znane snovi izpita in tri najšibkejše teme.
function readinessHtml(c) {
  const s = state.student.settings;
  const r = c.readiness || { percent: 0, weakest: [] };
  const date = s.goal === siGoal() && validDate(s.goal_date) ? s.goal_date : "";
  const d = new Date();
  const min = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  // Raven mature iz matematike (izbrana ob profilu, »4. letnik VR«) se vidi ob imenu izpita (Geminijev pregled 17. 11.).
  const raven = c.exam === "MATURA" && c.subject === "MAT" ? c.raven || null : null;
  const name = siExamName(c.exam) + (raven ? ` · ${t(raven === "VR" ? "lp.vr" : "lp.or")}` : "");
  const dateForm = `<div class="er-form" ${date ? "hidden" : ""}>
      <label class="goal-date"><span>${t("ready.date")}</span><input type="date" id="er-date" value="${date}" min="${min}"></label>
      <button type="button" class="primary" data-er-save>${t("common.save")}</button>
      <small class="muted er-note">${t("ready.saveNote")}</small>
    </div>`;
  const weak = r.weakest.length
    ? `<ul class="er-weak">${r.weakest
        .map(
          (w) => `<li><span class="node-dot er-dot ${w.status}">${icon(NODE[w.status][0])}</span><span class="er-name"><b>${escapeHtml(w.name)}</b><small>${escapeHtml(levelLabel(w.unit))}</small></span>
          <button type="button" class="secondary small" data-er-practice="${escapeHtml(w.id)}">${icon("pencil")}${t("ready.practice")}</button></li>`,
        )
        .join("")}</ul>`
    : `<p class="muted small-note">${t("ready.weakNone")}</p>`;
  return `<section class="card exam-ready">
    <div class="er-top">
      <div class="ring er-ring" style="--p:${r.percent}" role="img" aria-label="${escapeHtml(`${t("ready.title")}: ${name}, ${r.percent} %`)}"><span>${r.percent}%</span></div>
      <div class="er-text"><span class="eyebrow">${t("ready.title")}</span><h2>${escapeHtml(name)}</h2><p class="muted small-note">${t("ready.pctNote")}</p></div>
    </div>
    <div class="er-date">
      ${date ? `<p class="er-when">${icon("calendar")}<span><b>${escapeHtml(fmtDate(date))}</b> · ${escapeHtml(countdown(date))}</span><button type="button" class="text-btn" data-er-edit>${t("ready.changeDate")}</button></p>` : ""}
      ${dateForm}
    </div>
    <h3 class="er-weak-title">${t("ready.weakTitle")}</h3>
    ${weak}
  </section>`;
}

// Raven mature iz matematike na strani »NPZ in matura« (j, 20. 11.): izbira pri Preteklih polah velja za celo stran
// (Pripravljenost, Najprej vadi, Teme, Vadba, Poskusni izpit). Velja, dokler se raven v profilu ne spremeni;
// brez izbire raven iz profila (strežnik, exams.js examRaven).
const examRaven = () => (state.examRaven && state.examRaven.cl === state.student?.settings?.curriculum_level ? state.examRaven.raven : null);

async function loadExams(key = state.examKey, exam = null) {
  const si = siExams();
  const box = si ? $("#exams-content") : $("#competition-content");
  const raven = si ? examRaven() : null;
  const q = (key ? `?key=${encodeURIComponent(key)}` : exam ? `?exam=${encodeURIComponent(exam)}` : "") + (raven ? `${key || exam ? "&" : "?"}raven=${raven}` : "");
  let c;
  try {
    c = await api(`/api/students/${state.student.id}/exams${q}`);
  } catch (err) {
    box.innerHTML = `<p class="muted">${t("exam.loadError", { msg: escapeHtml(err.message) })}</p>`;
    return;
  }
  // Slovenski izpit zunaj šole učenca (npr. ostanek izbire po menjavi OŠ → SŠ): privzeti izpit šole.
  const own = si ? SI_EXAMS[TRACK[stopnja(state.student.settings)]] : null;
  if (si && !own.includes(c.exam) && (key || exam)) return loadExams(null, null);
  if (!c.key) {
    box.innerHTML = `<h1>${t("exam.title")}</h1>`;
    return;
  }
  state.examKey = c.key;
  if (!si) state.compKey = c.key;
  const seg = (items, cur, attr) =>
    `<div class="seg" role="group">${items.map(([v, label]) => `<button type="button" class="${v === cur ? "active" : ""}" aria-pressed="${v === cur}" ${attr}="${v}">${escapeHtml(label)}</button>`).join("")}</div>`;
  const left = c.openContest ? Math.max(1, Math.ceil((c.openContest.deadline - Date.now()) / 60000)) : 0;
  const hist = c.history.length
    ? `<ul class="contest-history">${c.history.map((h) => `<li><span>${escapeHtml(new Date(h.date).toLocaleDateString(locale()))}</span><b>${h.points} / ${h.maxPoints}</b><span class="bar"><i style="width:${Math.max(0, Math.round((h.points / h.maxPoints) * 100))}%"></i></span></li>`).join("")}</ul>`
    : `<p class="muted small-note">${t("exam.historyEmpty")}</p>`;
  const others = si ? [] : c.exams.other.filter((x) => x.id !== c.exam);
  const ownIds = c.exams.own.map((x) => x.id);
  const examSeg = si
    ? own.map((id) => [id, siExamName(id)])
    : [...c.exams.own, ...(ownIds.includes(c.exam) ? [] : [{ id: c.exam, name: c.name }])].map((x) => [x.id, x.name]);
  const m = c.mock;
  box.innerHTML = `
    ${offTabbarViews().includes(si ? "exams" : "competition") ? meBackHtml(si ? "exams" : "competition") : ""}
    <h1>${si ? t("nav.examsSi") : t("exam.title")}</h1>
    <div class="comp-pickers">
      ${seg(examSeg, c.exam, "data-exam")}
      ${others.length ? `<label class="field exam-other"><span class="field-label">${t("exam.otherExams")}</span><select data-exam-other><option value="">…</option>${others.map((x) => `<option value="${x.id}">${escapeHtml(`${x.name} (${x.country})`)}</option>`).join("")}</select></label>` : ""}
      ${c.subjects.length > 1 ? seg(c.subjects.map((x) => [x.key, SUBJECT_NAMES[x.subject] || x.name]), c.key, "data-exam-subject") : ""}
    </div>
    ${si ? readinessHtml(c) : ""}
    <details class="card exam-about"><summary>${icon("info")}<span><b>${escapeHtml(c.full)}</b> · ${escapeHtml(c.country)}</span></summary><p lang="${c.lang || "en"}">${escapeHtml(c.about)}</p></details>
    <div class="card xp-card comp-hero">
      <div class="hero">
        <div class="hero-icon">${icon("target")}</div>
        <div class="hero-text"><h2>${t("exam.train")}</h2><p>${t("exam.trainText")}</p></div>
        <button class="primary big" data-comp-train>${t("common.start")}</button>
      </div>
    </div>
    <section class="card contest-card">
      <div class="contest-head">
        <span class="session-icon">${icon("timer")}</span>
        <div><h2>${t("exam.mock")}</h2>
          <p class="muted">${t(m.choice ? "exam.mockText" : "exam.mockTextNoChoice", { tasks: m.tasks, choice: m.choice, minutes: m.minutes, max: m.maxPoints })}</p>
          ${m.negative ? `<p class="muted small-note">${t("exam.negative", { p: String(m.penalty).replace("-", "−") })}</p>` : ""}
          ${m.scale ? `<p class="muted small-note">${t("exam.scaleNote", { min: m.scale[0], max: m.scale[1] })}</p>` : ""}
          ${m.graded ? `<p class="muted small-note">${t("exam.gradeNote")}</p>` : ""}</div>
      </div>
      <button class="primary" data-comp-contest>${c.openContest ? t("comp.continue", { n: left }) : t("exam.startMock")}</button>
      <span class="field-label">${t("comp.lastResults")}</span>
      ${hist}
    </section>
    ${
      si
        ? `<section class="card exam-official exam-papers"><h2>${icon("file-text")}${t("pp.title")}</h2><p class="muted">${t("pp.text")}</p><div id="exam-papers" class="pp-picker"><p class="muted">${t("common.loading")}</p></div></section>`
        : c.official
          ? `<section class="card exam-official"><h2>${icon("file-text")}${t("gr.pastTitle")}</h2><p class="muted">${t("gr.pastText", { src: escapeHtml(c.official.source) })}</p><a class="btn-secondary" href="${escapeHtml(c.official.url)}" target="_blank" rel="noopener">${icon("external-link")}${t("gr.pastOpen")}</a></section>`
          : ""
    }
    <h2 class="comp-topics-title">${t("comp.topics")}</h2>
    <p class="muted small-note">${c.tasksLang === "en" && currentLang() !== "en" ? t("exam.topicsNote") : t("exam.topicsPick")}</p>
    ${c.units
      .map(
        (u, ui) => `<section class="unit card">
        <div class="unit-head"><div class="ring" style="--p:${Math.round(u.progress * 100)}"><span>${Math.round(u.progress * 100)}%</span></div>
          <div class="unit-title"><span class="eyebrow">${t("unit.label", { n: ui + 1 })}</span><h2>${escapeHtml(si ? levelLabel(u.title) : u.title)}</h2></div></div>
        <ol class="path">${u.topics
          .map((tp) => {
            const st = tp.due ? "due" : tp.status;
            return `<li><button class="node ${st}" data-open="${tp.id}"><span class="node-dot">${icon(NODE[st][0])}</span>
              <span class="node-text"><span class="node-name">${escapeHtml(tp.name)}</span><span class="node-sub">${NODE[st][1]}</span></span></button></li>`;
          })
          .join("")}</ol></section>`,
      )
      .join("")}`;
  if (si) showPapers(c);
}

// Pretekle pole: privzeto izbrani izpit in predmet razdelka ter učenčeva raven matematike (OR/VR).
async function showPapers(c) {
  const slot = $("#exam-papers");
  let papers;
  try {
    papers = await loadPapers(api);
  } catch (err) {
    if (slot.isConnected) slot.innerHTML = `<p class="muted">${t("pp.loadError", { msg: escapeHtml(err.message) })}</p>`;
    return;
  }
  if (!slot.isConnected) return;
  const s = state.student.settings;
  const level = c.raven || matLevel(s) || "OR";
  mountPapers(slot, papers, { track: s.educational_track, exam: c.exam, subject: c.subject, level }, {
    subjectName: (k) => SUBJECT_NAMES[k] || k,
    follow: true,
    // Druga raven pri polah: cela stran se izriše znova za to raven (pole ostanejo na izbrani ravni).
    onLevel: (raven) => {
      if (c.exam !== "MATURA" || c.subject !== "MAT" || raven === c.raven) return;
      state.examRaven = { cl: s.curriculum_level, raven };
      loadExams(state.examKey);
    },
    onTutor: paperTutor,
    onOurs: openOurs,
    onLocal: (entry, file, subjectName) => openLocalPaper(entry, file, subjectName),
    onReopen: (entry, subjectName) => {
      const k = keptPaper;
      if (!k || k.sid !== state.student.id || k.key !== paperLabel(entry, subjectName)) return false;
      openLocalPaper(entry, k.file, subjectName, k.page);
      return true;
    },
  });
}
// Besedilo naloge naše pole za učenčev oblaček: brez slik (SVG), formule v $$…$$ kot $…$ v eni vrstici, ker oblaček
// (renderUserText) izriše samo $…$.
const taskMdForChat = (md) =>
  String(md || "")
    .replace(/<svg[\s\S]*?<\/svg>/g, "")
    .replace(/\$\$\s*([\s\S]+?)\s*\$\$/g, (_, tex) => `$${tex.replace(/\s*\n\s*/g, " ")}$`)
    .trim();
// »Rešuj z inštruktorjem« pri pretekli poli: nov pogovor z vnaprej napisanim kratkim sporočilom (katera pola);
// učenec doda nalogo s fotografijo ali prepisom in pošlje sam. Pole RIC ne pošiljamo. Navodilo za inštruktorja
// (namigi namesto rešitve) gre s prvim sporočilom kot skrit kontekst (state.paperCtx), učenec ga ne vidi.
// Dvojni dotik ne odpre dveh pogovorov.
let paperBusy = false;
async function paperTutor(entry, subjectName) {
  if (!entry || paperBusy) return;
  paperBusy = true;
  try {
    await newTutorChat();
    const paper = paperLabel(entry, subjectName);
    state.paperCtx = { conv: state.conversationId, paper };
    fillInput(`${t("pp.tutorMsg", { paper })} `);
  } catch (err) {
    toast(err.message);
  } finally {
    paperBusy = false;
  }
}
// »Reši našo polo v tem slogu« (public/our-paper.js): naloge Evklida z zgradbo izvirne pole. Točke, ki si jih
// učenec označi, ostanejo v tej napravi. »Vprašaj inštruktorja«: nov pogovor z nalogo, naša rešitev gre
// inštruktorju kot skrit kontekst (server/paper-context.js), učenec vidi le nalogo.
async function openOurs(entry, subjectName, focus = null) {
  if (!entry?.ours || paperBusy) return;
  paperBusy = true;
  try {
    const [paper, op] = await Promise.all([api(`/api/exam-papers/ours/${encodeURIComponent(entry.id)}`), ourMod.load(), pripraviIzris()]);
    const { openOurPaper } = op;
    const title = t("pp.oursTitle", { paper: paperLabel(entry, subjectName) });
    const key = `evklid.ours.${state.student.id}.${entry.id}`;
    openOurPaper(paper, {
      title,
      rich: (md) => withFormulaSubject(entry.subject, () => renderRich(String(md ?? "")), null, ""),
      score: {
        get: () => {
          try {
            return JSON.parse(localStorageGet(key) || "{}");
          } catch {
            return {};
          }
        },
        set: (v) => localStorageSet(key, JSON.stringify(v)),
      },
      focus,
      onTutor: (task, part) => oursTutor(entry, title, task, part),
      // Šibke točke: deli z odprto rešitvijo ali oznako »Imam prav« (strežnik vsak del šteje enkrat).
      onChecked: (parts) => api(`/api/students/${state.student.id}/paper-check`, { method: "POST", body: { paper: entry.id, parts } }).catch(() => {}),
    });
  } catch (err) {
    toast(err.message);
  } finally {
    paperBusy = false;
  }
}
async function oursTutor(entry, title, task, part) {
  if (paperBusy) return;
  paperBusy = true;
  try {
    await newTutorChat();
    const n = partLabel(task, part);
    const pola = task.pola ? `${t("pp.oursPola", { n: task.pola })} · ` : "";
    const strip = taskMdForChat;
    const choices = part.format === "choice" && part.choices ? part.choices.map((c, i) => `${String.fromCharCode(65 + i)}) ${strip(c)}`).join("\n") : "";
    const body = [strip(task.intro), strip(part.text), choices].filter(Boolean).join("\n\n").slice(0, 1500);
    state.paperCtx = { conv: state.conversationId, paper: title, task: partKey(task, part), ours: entry.id };
    await send(`${title} · ${pola}${t("pp.oursTask", { n })}\n\n${body}`);
  } catch (err) {
    toast(err.message);
  } finally {
    paperBusy = false;
  }
}
// ---------- naloga iz pretekle pole, omenjena v klepetu (j 19. 11. 2026) ----------
// »matura mat OR 2024 pola 1 naloga 5«: public/naloga-pole/klepet.js (s svojimi besedili) se naloži šele ob prvi
// omembi pole, ker ni del prvega odprtja (proračun hitrosti, test/hitrost-proracun.test.js).
// Hiter predpregled (brez nalaganja modula): kratko sporočilo z izpitom in »naloga«; natančno prepozna modul.
async function newTutorChat() {
  const conv = await api(`/api/students/${state.student.id}/conversations`, { method: "POST", body: {} });
  await loadConversations();
  showView("chat");
  await openConversation(conv.id);
}
// »Pomoč pri tej nalogi« v preneseni poli (public/paper-viewer.js): nov pogovor, v enem sporočilu izrez naloge
// (slika kot pri fotografiji) in besedilo iz pole. Pošlje se samo ta naloga, ker jo je učenec izbral.
// Učenec vidi le kratek naslov in čisto besedilo naloge; navodilo za inštruktorja je skrit kontekst (state.paperCtx).
async function paperTask(entry, subjectName, task) {
  if (!entry || !task?.image || paperBusy) return;
  paperBusy = true;
  try {
    await newTutorChat();
    const paper = paperLabel(entry, subjectName);
    const head = task.label ? t("pp.taskMsg", { paper, n: task.label }) : t("pp.boxMsg", { paper, page: task.page });
    const text = String(task.text || "").slice(0, 1500).trim();
    state.paperCtx = { conv: state.conversationId, paper, task: task.label || "", page: task.label ? 0 : task.page, fromPdf: !!text };
    await send(text ? `${head}\n\n${text}` : head, { image: task.image });
  } catch (err) {
    toast(err.message);
  } finally {
    paperBusy = false;
  }
}

// Datum izpita: prazno polje na Androidu nima namiga, zato »Shrani« brez datuma (in »Spremeni datum«) odpre koledar;
// sam fokus na telefonu ne naredi nič in je bil videti kot pokvarjen gumb. Klic je pred prvim await (dotik še velja).
function openDatePicker(input) {
  input.focus();
  try {
    input.showPicker?.();
  } catch {}
}

document.addEventListener("click", async (e) => {
  if (!e.target.closest("#view-exams")) return;
  const edit = e.target.closest("[data-er-edit]");
  if (edit) {
    $("#view-exams .er-form").hidden = false;
    edit.closest(".er-when").hidden = true;
    return openDatePicker($("#er-date"));
  }
  if (e.target.closest("[data-er-save]")) {
    const date = $("#er-date").value;
    if (!validDate(date)) return openDatePicker($("#er-date"));
    try {
      const updated = await api(`/api/students/${state.student.id}`, { method: "PUT", body: { settings: { goal: siGoal(), goal_date: date } } });
      studentUpdated(updated);
      renderGoal();
      toast(t("ready.saved"));
    } catch (err) {
      return toast(err.message);
    }
    return loadExams(state.examKey);
  }
  const pr = e.target.closest("[data-er-practice]");
  if (pr) {
    setBack("exams");
    const pretest = await openTopic(pr.dataset.erPractice);
    if (!pretest && $("#t-practice")) nextPractice();
  }
});


document.addEventListener("click", (e) => {
  const ex = e.target.closest("[data-exam]");
  if (ex) loadExams(null, ex.dataset.exam);
  const sub = e.target.closest("[data-exam-subject]");
  if (sub) loadExams(sub.dataset.examSubject);
});
document.addEventListener("change", (e) => {
  const sel = e.target.closest("[data-exam-other]");
  if (sel?.value) loadExams(null, sel.value);
});

// Odgovor ali preskok pri poskusnem tekmovanju: brez povratne informacije, takoj naslednja naloga.
function contestStep(r, ctx) {
  if (r.error) return toast(r.error);
  if (r.contest) return showContestResult(r.contest, r.timeUp);
  const n = r.next;
  if (n && !n.finished) {
    toast(r.skipped ? t("comp.skipped") : t("comp.saved"), r.skipped ? "skip-forward" : "check");
    renderTask(n.task, { mode: "contest", index: n.index, total: n.total, sessionId: n.sessionId });
    $("#practice").scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

async function finishContest(sessionId, timeUp = false) {
  try {
    const r = await api(`/api/students/${state.student.id}/contest/finish`, { method: "POST", body: { sessionId } });
    showContestResult(r.contest, timeUp);
  } catch (err) {
    toast(err.message);
  }
}

function startContestTimer(sessionId, deadline) {
  stopContestTimer();
  const tick = () => {
    const el = $("#contest-timer");
    const ms = deadline - Date.now();
    if (!el?.offsetParent) glavaMedTestom(false);
    if (el) {
      el.querySelector("b").textContent = leftText(deadline);
      el.classList.toggle("warn", ms <= 300000);
    }
    if (ms <= 0) {
      stopContestTimer();
      finishContest(sessionId, true);
    }
  };
  tick();
  state.contestTimer = setInterval(tick, 1000);
  refreshBubble();
}
function leftText(deadline) {
  const s = Math.max(0, Math.ceil(((deadline || 0) - Date.now()) / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
function stopContestTimer() {
  if (state.contestTimer) clearInterval(state.contestTimer);
  state.contestTimer = null;
  glavaMedTestom(false);
}

// Med testom na telefonu (j 2026-11-15): pomik navzdol skrije zgornjo vrstico (timer se pripne na njeno mesto),
// pomik navzgor ali vrh strani jo vrne. Samo v pogledu, ki ima timer; competition.css → body.glava-skrita.
// Skrita vrstica podaljša pogled; brskalnik ob dnu zato sam zmanjša scrollTop. Da to ni videti kot pomik navzgor
// (utripanje), po vsakem preklopu 300 ms ne beremo pomika, ob dnu ga ne štejemo za »gor«, kratke naloge pa glave ne skrijejo.
let glavaZaklep = 0;
function glavaMedTestom(skrij) {
  const bar = document.querySelector(".topbar");
  const zdaj = document.body.classList.contains("glava-skrita");
  if (!!skrij === zdaj) return;
  if (skrij && bar) document.body.style.setProperty("--glava-h", `${bar.offsetHeight}px`);
  document.body.classList.toggle("glava-skrita", !!skrij);
  glavaZaklep = skrij ? Date.now() + 300 : 0;
}
{
  const zadnji = new WeakMap();
  document.addEventListener(
    "scroll",
    (e) => {
      const box = e.target;
      if (!(box instanceof Element) || !box.querySelector("#contest-timer")) return;
      const y = box.scrollTop;
      if (Date.now() < glavaZaklep || !zadnji.has(box)) return void zadnji.set(box, y);
      const prej = zadnji.get(box);
      const max = box.scrollHeight - box.clientHeight;
      const glavaH = parseFloat(document.body.style.getPropertyValue("--glava-h")) || 64;
      const skrita = document.body.classList.contains("glava-skrita");
      if (y < 0 || y > max) return; // odboj na robu (iPhone)
      if (y < 12) glavaMedTestom(false);
      else if (y > prej + 6) {
        if (!skrita && max > (document.querySelector(".topbar")?.offsetHeight || 64) + 120) glavaMedTestom(true);
      } else if (y < prej - 6) {
        if (y < max - glavaH) glavaMedTestom(false);
      } else return;
      zadnji.set(box, Date.now() < glavaZaklep ? box.scrollTop : y);
    },
    { capture: true, passive: true },
  );
  // Samo sprememba širine (obrat, drugo okno); višino spreminja tudi naslovna vrstica brskalnika med pomikom.
  let sirina = innerWidth;
  const pokazi = () => {
    if (innerWidth !== sirina) glavaMedTestom(false);
    sirina = innerWidth;
  };
  addEventListener("resize", pokazi, { passive: true });
  addEventListener("orientationchange", pokazi);
}

function showContestResult(c, timeUp = false) {
  stopContestTimer();
  closePad();
  const yours = (it) => {
    if (it.yourAnswer == null) return t("comp.noAnswer");
    if (it.task?.answerType === "choice") return it.task.options?.[Number(it.yourAnswer)] ?? it.yourAnswer;
    return it.yourAnswer;
  };
  const pct = c.maxPoints ? Math.round((c.points / c.maxPoints) * 100) : 0;
  $("#practice").innerHTML = `<div class="card result ${pct >= 50 ? "celebrate" : ""}">
      <div class="result-icon">${icon("medal")}</div>
      ${timeUp ? `<p class="muted">${t("comp.timeUp")}</p>` : ""}
      <h2 class="score-line">${t("comp.score", { points: `<span class="count-up" data-to="${Number(c.points) || 0}">0</span>`, max: c.maxPoints })}</h2>
      <div class="score-bar" aria-hidden="true"><div style="--pct:${Math.max(0, Math.min(100, pct))}%"></div></div>
      <p>${t("comp.summary", { correct: c.correct, total: c.total, minutes: c.minutes })}${c.xp ? ` · +${c.xp.gained} XP` : ""}</p>
      ${c.scaled ? `<p>${t("exam.scaled", { value: c.scaled.value, min: c.scaled.min, max: c.scaled.max })}</p>` : ""}
      ${c.grade ? `<p>${t("exam.grade", { grade: escapeHtml(c.grade) })}</p>` : ""}
      ${c.wrong && c.items.some((x) => x.earned < 0) ? `<p class="muted">${t("exam.wrongPenalty", { n: c.wrong })}</p>` : ""}
      <p class="muted">${examMode() ? (pct >= 75 ? t("exam.great") : pct >= 50 ? t("exam.good") : t("exam.hard")) : pct >= 75 ? t("comp.great") : pct >= 50 ? t("comp.good") : t("comp.hard")}</p>
      <button class="primary big" id="fb-back">${prepBack()}</button>
    </div>
    <h2 class="comp-topics-title">${t("comp.review")}</h2>
    ${c.items
      .map((it, i) => {
        const st = it.correct ? "ok" : it.yourAnswer == null ? "skip" : "bad";
        return `<details class="card review-item ${st}" style="--i:${i}">
        <summary><span class="ri-icon">${icon(st === "ok" ? "circle-check" : st === "skip" ? "skip-forward" : "circle-x")}</span>
          <span class="ri-name">${i + 1}. ${escapeHtml(it.topicName)}</span><span class="ri-pts">${it.earned}/${it.points}</span></summary>
        ${
          it.task
            ? `<div class="task-text">${renderRich(it.task.text)}</div>
          ${it.task.answerType === "choice" ? `<div class="choices static">${it.task.options.map((o, k) => `<div class="choice ${String(k) === String(it.yourAnswer) ? "picked" : ""} ${k === it.task.correctIndex ? "right" : ""}">${choiceHtml(it.task, o)}</div>`).join("")}</div>` : ""}
          <p><b>${t("comp.yourAnswer")}</b> ${it.task.optionsTex && it.yourAnswer != null && it.task.answerType === "choice" ? renderMath(yours(it), false) : escapeHtml(yours(it))}</p>
          ${workedBlock(it.task, it.task.solution)}
          ${tutorRow(it.taskId)}`
            : `<p class="muted">${t("comp.notReached")}</p>`
        }
      </details>`;
      })
      .join("")}`;
  $("#fb-back").addEventListener("click", () => showView(state.backTo === "exams" ? "exams" : "competition"));
  countUp($("#practice .count-up"));
  refreshXp();
}

// Število točk se prešteje od 0 navzgor (brez animacije, če jih učenec ne želi).
function countUp(el, ms = 900) {
  if (!el) return;
  const to = Number(el.dataset.to) || 0;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !to) {
    el.textContent = String(to);
    return;
  }
  const t0 = performance.now();
  const step = (now) => {
    const k = Math.min(1, (now - t0) / ms);
    el.textContent = String(Math.round(to * (1 - Math.pow(1 - k, 3))));
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}


export { closePad, padIsSheet, stopContestTimer, openTopic, loadExams, loadCompetition, startSession, nextPractice, taskMdForChat, openOurs, paperTask, learnWithTutor };

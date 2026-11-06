// Evklid – odjemalec (brez ogrodja).
import { fetchThroughRestart as fetchRetry } from "./restart-retry.js";
import { attachPad, closePad, openPad, padIsSheet } from "./pad.js";
import { icon, hydrateIcons } from "./icons.js";
import { greekFactHtml, wireGreekFacts } from "./greek.js";
import { t, locale, currentLang, currentRegion, regionFor, setLanguage, deviceRegion } from "./i18n.js";
import { systemForCountry, isRegional, SCHOOL_SYSTEMS } from "./regions.js";
import { mountLanguageCard } from "./language.js";
import { dialectsFor } from "./dialects.js";

hydrateIcons();
import { initAccount, accountsOn, openAddChild, logout, openProfileLock, renderAccount } from "./account.js";
import { captureSource, currentSource } from "./vir.js";
import { showFull, closeFull, fullOpen } from "./razpri.js";
import { makeSplitter } from "./razdelilnik.js";
import { initOkna, isFloating, openWindow, closeWindow, focusWindow, refreshBubble, chatReply, restoreWindows, windowsOn, tabHint, floatingViews, syncTabbarH } from "./okna.js";
import { initProfileMenu, refreshProfileButton, closeProfileMenu } from "./profile-menu.js";
import { initQuickStart, closeQuickStart } from "./quick-start.js";
import { openPrintable, stopReading } from "./gradiva.js";
import { initSubjectSwitch } from "./subject-switch.js";
import { initTextbook, showTextbook, openLesson, textbookBack, openTextbookLower } from "./textbook.js";
import { loadLeague } from "./leagues.js";
import { PACES, DEFAULT_PACE, createPacer } from "./pace.js";
import { createRenderer, streamSafe } from "./rich.js";
import { loadPrograms, programsCache, subjectOptions, schoolSubjectsFor, SUBJECT_NAMES } from "./programs.js";
import { mountLevelPicker, levelLabel, levelChoices, schoolSystemOptions } from "./level-picker.js";
import { attachMic } from "./speech.js";
import { initKeyboard, configureKeyboard, toggleKeyboard, hideKeyboard, keyboardOpenFor, keyboardLayer, setKeyboardContext, mountKeyboardSettings } from "./tipkovnica.js";
import { TUTOR_CHIPS } from "./tipkovnica-data.js";
import { splitFormulas, hasFormula } from "./vnos-formul.js";
import { attachPrettify } from "./lepi-zapis.js";
import { renderSuggestion, renderWelcome, stageUp } from "./level-up.js";
import { offlineApi, offlineBootApi, saveStudents, saveConfig, clearProfile, refreshPack, syncOffline, packTaskCount, pendingCount } from "./offline.js";
import { initFeedback, showFeedback } from "./feedback.js";
import { openAdminBug, deviceInfo, shownHtml } from "./prijave.js";
import { initInstall, installSheetOpen, closeInstallSheet } from "./install.js";
import { initFlashcards, showFlashcards, addCardsNote } from "./flashcards.js";
// Igre (games/, ~2 MB kode s predmeti) se naložijo šele, ko jih učenec odpre, ali v mirnem trenutku po
// zagonu: prvo odprtje Evklida mora prenesti in zagnati pol manj kode (j, 2026-11-04: »stran deluje počasi«).
let gamesMod = null;
let gamesCtx = null;
let gamesP = null;
let gamesTries = 0;
// Brskalnik si neuspel modul zapomni do ponovnega nalaganja strani: nov poskus zato z drugim naslovom (?r=).
const loadGames = () =>
  (gamesP ||= (gamesTries++ ? import(`./games/index.js?r=${gamesTries}`) : import("./games/index.js")).then((m) => {
    gamesMod = m;
    if (gamesCtx) m.initGames(gamesCtx);
    return m;
  }).catch((err) => {
    gamesP = null; // brez povezave ali napaka: naslednji poskus znova
    throw err;
  }));
const initGames = (c) => {
  gamesCtx = c;
  gamesMod?.initGames(c);
};
const gamesNote = (key) =>
  document.querySelector("#games-content")?.replaceChildren(Object.assign(document.createElement("p"), { className: "muted", textContent: t(key) }));
const showGames = () => {
  if (!gamesMod) gamesNote("common.loading");
  return loadGames().then((m) => m.showGames()).catch(() => gamesMod || gamesNote("off.noConnection"));
};
const gamesBack = () => gamesMod?.gamesBack() ?? false;
const leaveGames = () => gamesMod?.leaveGames();
import { gamesOn, stageOf, STAGES } from "./games/stage.js";
import { rewardOffer } from "./games/reward.js";
import { initCorner, showCorner, cornerBack, closeBoard, askInterests, maybeAskInterests, interestsSummary } from "./corner.js";
import { initUsageMeter, refreshUsageMeter } from "./usage-meter.js";
import { initFullscreen } from "./fullscreen.js";
import { deviceSnapshot, applyDeviceSettings, addProposal } from "./chat-settings.js";
import { initSchedule, showSchedule, renderScheduleCard, lastSchedule } from "./schedule.js";
import { stageCardHtml, vrstniRed, uvrstiKartice, stageRows } from "./zacetna.js";
import { initScan, showScan, leaveScan, scanBack } from "./scan/scan.js";
import { initLab, showLab, labBack, openLabExperiment } from "./laboratorij.js";
import { initUci, showUci, setUciTab, uciTab, uciBack, leaveUci, open3d, isOpen3d, labFromLesson, UCI_TABS } from "./uci-se.js";
import { initZbirke, showZbirke, meCard, unlockedText, itemThumb } from "./zbirke-view.js";
import { initTestNotice } from "./testna-verzija.js";
import { initFormulaInfo, closeFormulaPop, annotateTex, setFormulaSubject, withFormulaSubject, subjectWithGlossary } from "./formula-info.js";
import { plainTex } from "./formula-data.js";
import { xpStatsHtml, xpItemsHtml, levelRowHtml, paintBadge, celebrateXp } from "./xp-fx.js";
import { heatmapHtml, weeksHtml } from "./aktivnost.js";
import { goalFieldsHtml, wireGoalFields, readGoalFields, goalLineHtml, goalName, countdown, hasGoal, reminderDue, dismissReminder, reminderCardHtml, fmtDate } from "./goal.js";
import { validDate, goalShortcuts, goalTabbarView } from "./goal-data.js";
import { loadPapers, mountPapers, paperLabel, examName as siExamName, SI_EXAMS } from "./exam-papers.js";
import { openPaperViewer, closePaperViewer } from "./paper-viewer.js";
import { openOurPaper, closeOurPaper } from "./our-paper.js";
import { partKey, partLabel } from "./our-paper-key.js";
import { initDrsniki } from "./drsniki.js";
import { initSirina, prilagodiZdaj } from "./sirina.js";
import { jeFaks, jeSs, jeOs, stageCode, stopnja, TRACK } from "./stopnja.js";
import { expectedMs, progressAt, addDuration } from "./check-progress.js";
import { GUIDE } from "./vodic.js";
import { initOpen, addOpen, simOverlayOpen, closeSimOverlay } from "./odpri.js";

const $ = (sel) => document.querySelector(sel);
// Brez povezave odgovori vadnica iz shranjenega paketa nalog (public/offline.js).
// Za zagon brez povezave še seznam profilov (osebni odgovori API niso v predpomnilniku, P7).
const fromPack = (url, opts) => (state.student ? offlineApi(state.student.id, url, opts) : undefined) ?? offlineBootApi(url, opts);
// Računalnik z Evklidom je ugasnjen ali okno ni odprto: ngrok ali Cloudflare vrneta
// svojo napako. Takrat delamo kot brez povezave (vaje iz shranjenega paketa).
// Napaka v JSON pride od našega strežnika (npr. 502, ko branje rokopisa ne uspe):
// strežnik dela, zato pokažemo njegovo sporočilo, ne »Ni povezave«.
function serverDown(res) {
  const code = res.headers.get("ngrok-error-code");
  const ours = /json/i.test(res.headers.get("content-type") || "");
  const down = !!(code && code !== "ERR_NGROK_6024") || (!ours && [502, 503, 504, 530].includes(res.status));
  if (down !== serverIsDown) {
    serverIsDown = !!down;
    setTimeout(() => syncOfflineBanner(), 0);
  }
  return down;
}
let serverIsDown = false;

// Med objavo nove različice: tiho ponovimo, pasica »Evklid se posodablja …« (public/restart-retry.js).
// Samo stran gostitelja 502/503/504 (Render med ponovnim zagonom); izpad tunela (ngrok, 530) gre takoj na vaje brez povezave.
const restarting = (res) => !res.headers.get("ngrok-error-code") && !/json/i.test(res.headers.get("content-type") || "") && [502, 503, 504].includes(res.status);
let serverUpdating = false;
function setUpdating(on) {
  if (on === serverUpdating) return;
  serverUpdating = on;
  setTimeout(() => syncOfflineBanner(), 0);
}
async function fetchThroughRestart(url, init) {
  try {
    return await fetchRetry(url, init, { busy: (r) => (restarting(r) && (setUpdating(true), true)) });
  } finally {
    setUpdating(false);
  }
}

// Napaka strežnika v jeziku vmesnika: code je ključ i18n (npr. »block.daily« iz server/usage.js blockInfo),
// error je slovensko besedilo strežnika (rezerva, če ključa ni). Samo imenski prostori, ki jih strežnik
// pošilja kot kode napak (usage.js block.*, gradiva.js gr.*, kviz.js kv.*/comp.*, progress.js chk.*), da
// drugačna koda (npr. iz drugega vira) ne pokaže nepovezanega besedila.
const ERROR_CODE = /^(block|gr|kv|comp|chk)\.[A-Za-z]+$/;
// hint: neobvezen drugi ključ (npr. »block.hintGuest«), ki ga dodamo za razlogom, kako do več vprašanj.
const serverError = (err, status) => {
  const own = typeof err?.code === "string" && ERROR_CODE.test(err.code) ? t(err.code, err.params || {}) : null;
  if (!own || own === err.code) return err?.error || t("common.error", { status });
  const hint = typeof err.hint === "string" && ERROR_CODE.test(err.hint) ? t(err.hint) : "";
  return hint && hint !== err.hint ? `${own} ${hint}` : own;
};

const api = async (url, opts = {}) => {
  if (/\/tasks\/off-/.test(url)) {
    const local = fromPack(url, opts);
    if (local !== undefined) return local;
    throw new Error(t("off.noConnection"));
  }
  const res = await fetchThroughRestart(url, {
    ...opts,
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    body: opts.body && typeof opts.body !== "string" ? JSON.stringify(opts.body) : opts.body,
  });
  if (!res || (res.status === 503 && res.headers.get("X-Offline")) || serverDown(res)) {
    const local = fromPack(url, opts);
    if (local !== undefined) return local;
    // Gostitelj odgovori, naš strežnik pa ne (npr. med objavo nove različice): ne pišemo »Ni povezave z internetom«.
    throw new Error(!res || navigator.onLine === false ? t("off.noConnection") : t("off.serverBusy"));
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    // status: strežnik je odgovoril (napaka ni v povezavi); body: dodatni podatki (npr. unavailable).
    throw Object.assign(new Error(serverError(err, res.status)), { status: res.status, body: err });
  }
  return res.json();
};

const MODE_NAMES = { A: t("chatMode.A"), B: t("chatMode.B") };

const isUni = (s) => jeFaks(s);

const state = {
  students: [],
  student: null,
  conversations: [],
  conversationId: null,
  sending: false,
  image: null, // { media_type, data, url }
};

// ---------- izris matematike in markdowna ----------

// Klikljive formule (formula-info.js): znani simboli in enote dobijo data-fx; renderMath(…, false) za gumbe.
const { renderMath, renderRich } = createRenderer({ annotate: (tex, o) => annotateTex(tex, undefined, o) });
// Predmet za pomen simbolov: tema naloge (FIZ-OS-9 …), sicer predmet učenca.
const subjectOfId = (id) => (/^([A-Z]{3})-/.exec(id || "") || [])[1];
// Predmet teme: fakultetne teme (UNI-…) imajo predmet v podatkih, šolske ga imajo v oznaki.
const topicSubject = (tp) => tp?.subject || (/^UNI-/.test(tp?.id || "") ? null : subjectOfId(tp?.id));
// Odprta tema: naloge, namigi, rešitve in klepet o njej uporabijo oznake njene lekcije. Serija nalog iz več tem
// (ponavljanje, dnevni izziv, sklop, tekmovanje) in drugi pogledi jih ne, sicer bi črka imela pomen iz zadnje odprte teme.
const topicGlossary = () => (currentView === "topic" && state.topicFx ? state.topic?.symbols : null);
// Ime teme in sklopa: dvoumna črka dobi pomen iz slovarja le, če se tema ujema (x₁ je ničla le pri kvadratni enačbi).
const topicScope = (tp) => (tp ? [tp.name, tp.unit].filter(Boolean).join(" · ") : "");
setFormulaSubject(
  () => subjectWithGlossary(topicSubject(state.topic) || state.student?.settings?.subject || "MAT", topicGlossary()),
  () => (currentView === "topic" ? topicScope(state.topic) : ""),
);
// Razlaga teme in »Bistvo«: črke imajo pomen iz lekcije te teme (:::simboli), sicer iz slovarja predmeta.
const topicRich = (tp, text) => withFormulaSubject(topicSubject(tp) || state.student?.settings?.subject || "MAT", () => renderRich(text), tp?.symbols, topicScope(tp));

// Sporočilo učenca: besedilo ostane besedilo, $...$ in zapis s tipkovnice ((3)/(4), √(2), x^(2), ∑_(n=1)^∞ …,
// public/vnos-formul.js) se izrišeta kot formula.
function renderUserText(text) {
  const parts = String(text).split(/(\$[^$\n]+?\$)/g);
  return parts
    .map((p, i) =>
      i % 2
        ? renderMath(plainTex(p.slice(1, -1)), false, false) // starejša sporočila iz »Razloži« imajo še \htmlData
        : splitFormulas(p).map((x) => ("tex" in x ? renderMath(`\\displaystyle ${x.tex}`, false, false) : escapeHtml(x.text))).join(""), // ulomek v polni velikosti
    )
    .join("");
}

// ---------- pogledi ----------

function showView(name) {
  if (name === "games" && state.student && !gamesOn(state.student.settings)) name = "me"; // »Skrij igre«
  // Učbenik, Laboratorij in 3D svet so zavihki pogleda »Uči se« (public/uci-se.js): stare poti izberejo zavihek.
  if (UCI_TABS.includes(name)) {
    setUciTab(name);
    name = "uci";
  }
  // Uvod profila: izbira v meniju pod logotipom ali tipka Nazaj ga zapreta (prej so ostali skriti vsi zavihki).
  // Prvi profil na napravi mora nastati, zato takrat ostanemo na uvodu.
  if (name !== "onboard" && document.body.classList.contains("onboarding")) {
    if (!state.student) return;
    document.body.classList.remove("onboarding");
  }
  // Pogled v premičnem oknu (public/okna.js): okno pride v ospredje in se osveži, glavni pogled ostane.
  // Tipka Nazaj (na Učno pot) pa okno vrne v glavni del.
  if (isFloating(name)) {
    if (!fromBack) {
      focusWindow(name);
      initView(name);
      return;
    }
    closeWindow(name, { keep: true });
  }
  closeFull(); // okno s celim besedilom (public/razpri.js) pripada prejšnjemu pogledu
  const away = (v) => name !== v && !isFloating(v); // pogled ni ne glavni ne v oknu
  if (away("uci")) {
    stopReading(); // branje povzetka na glas ne teče naprej brez gumba za ustavitev
    leaveUci(); // atlas ali model čez cel zaslon (3D svet)
  }
  syncHistory(name);
  if (name !== currentView) prevView = currentView;
  currentView = name;
  syncCompetitionTab();
  if (name === "path" || name === "competition" || name === "exams") setBack(name);
  if (name !== "topic") stopContestTimer();
  document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t.dataset.view === name));
  // Na telefonu so Napredek, Lige, Nastavitve in Račun pod zavihkom »Jaz«.
  if (meView(name)) $('#tabbar [data-view="me"]').classList.add("active");
  document.querySelectorAll(".view").forEach((v) => {
    if (!v.classList.contains("in-okno")) v.hidden = v.id !== `view-${name}`;
  });
  initView(name);
  if (away("scan")) leaveScan();
  if (away("games")) leaveGames();
  if (away("corner")) closeBoard();
  hideKeyboard(); // odhod z zaslona: Evklidova tipkovnica se zapre (public/tipkovnica.js)
  closeCalcOverlay();
  if (name !== "topic") closePad();
  if (name !== "topic" && name !== "cards") setActiveMode(null);
  refreshBubble();
  peekBar(false);
  window.scrollTo(0, 0);
}
// Priprava pogleda ob prikazu (glavni del ali premično okno); ne spremeni trenutnega pogleda in zgodovine.
function initView(name) {
  if (name === "me") renderMe();
  if (name === "settings") {
    fillSettingsForm();
    $("#settings-account").hidden = $("#account-tab").hidden;
    loadUsage();
  }
  if (name === "progress") loadProgress();
  if (name === "schedule") showSchedule();
  if (name === "uci") showUci();
  if (name === "scan") showScan();
  if (name === "league") loadLeague(state.student.id);
  if (name === "path") loadPath();
  if (name === "competition") (regionalExams() ? loadExams() : loadCompetition());
  if (name === "exams") loadExams();
  if (name === "feedback") showFeedback();
  if (name === "games") showGames();
  if (name === "zbirke") {
    showZbirke(zbOpen.item, zbOpen.from);
    zbOpen = {};
  }
  if (name === "corner") showCorner();
  if (name === "cards") {
    setActiveMode("cards");
    showFlashcards();
  }
  if (name === "graph") showGraph();
}
// ---------- spodnja vrstica se pri branju umakne (telefon, tablica na dotik; touch.css) ----------
// Kje se umakne, določa touch.css (vrstica je takrat position: fixed in skrita pod robom). Poteg navzdol (drsenje
// nazaj gor) ali kolešček gor jo pokaže (body.tb-peek), poteg navzgor jo spet skrije; v lekciji Učbenika samo ob
// robu (lessonEdge) ali ko drsenje udari v vrh ali dno. Med pisanjem (odprta tipkovnica) se ne pokaže. Na vseh teh zaslonih je v glavi gumb Nazaj.
const tabbarEl = $("#tabbar");
const barAuto = () => !!tabbarEl && getComputedStyle(tabbarEl).position === "fixed";
const typing = () => !!document.activeElement?.matches?.('textarea, [contenteditable="true"], input:not([type="checkbox"], [type="radio"], [type="range"], [type="button"], [type="submit"])');
const NO_SWIPE = "#tabbar, canvas, input[type=range], .pad, .graph-slot, .demo, .okno, .tour";
function peekBar(on) {
  if (on && typing()) on = false;
  if (document.body.classList.contains("tb-peek") !== on) document.body.classList.toggle("tb-peek", on);
  syncTabbarH();
}
// Odprta lekcija v Učbeniku (j 2026-11-04): vrstica ostane skrita med branjem in se pokaže šele ob robu, torej s
// potegom navzgor, ko je lekcija že na dnu, ali s potegom navzdol, ko je že na vrhu. Rob šteje ob začetku potega,
// zato isti poteg, ki pripelje do dna, vrstice še ne pokaže. Drugje se pokaže ob vsakem drsenju nazaj gor.
const lessonEdge = (target) => {
  const v = target?.closest?.("#view-textbook");
  if (!v || !v.querySelector(".tb-lesson-grid")) return null;
  return { top: v.scrollTop <= 1, bottom: v.scrollTop + v.clientHeight >= v.scrollHeight - 2 };
};
// up = drsenje proti vrhu (poteg prsta navzdol, kolešček gor). Lekcija, ki se ne drsi (kratek korak), je na obeh
// robovih hkrati: vsak navpični poteg vrstico pokaže (skrije jo šele poteg sredi daljšega koraka).
const barWanted = (up, edge) => (edge ? (up ? edge.top : edge.bottom) : up);
let swipe = null;
document.addEventListener("touchstart", (e) => {
  const t = e.touches[0];
  swipe = e.touches.length === 1 && !e.target.closest?.(NO_SWIPE) ? { x: t.clientX, y: t.clientY, edge: lessonEdge(e.target) } : null;
}, { passive: true });
document.addEventListener("touchmove", (e) => {
  if (!swipe) return;
  const t = e.touches[0];
  const dy = t.clientY - swipe.y;
  if (Math.abs(dy) < 24 || Math.abs(t.clientX - swipe.x) > Math.abs(dy)) return;
  // Rob ob začetku ali že zdaj: poteg, ki se začne tik ob robu in vanj udari, vrstice ne skrije (j 2026-11-04).
  const now = lessonEdge(e.target);
  const on = barWanted(dy > 0, swipe.edge) || !!(now && (dy > 0 ? now.top : now.bottom));
  swipe = null;
  requestAnimationFrame(() => barAuto() && peekBar(on));
}, { passive: true });
let wheelFrame = 0;
document.addEventListener("wheel", (e) => {
  if (wheelFrame || Math.abs(e.deltaY) < 4 || e.target.closest?.(NO_SWIPE)) return;
  const on = barWanted(e.deltaY < 0, lessonEdge(e.target));
  wheelFrame = requestAnimationFrame(() => {
    wheelFrame = 0;
    if (barAuto()) peekBar(on);
  });
}, { passive: true });
// Drsenje v lekciji, ki udari v vrh ali dno (j 2026-11-04), vrstico pokaže, tudi ko lekcija pride do roba z zagonom
// po potegu ali isti poteg pripelje do dna. Šteje samo drsenje uporabnika (poteg ali kolešček v zadnjih 4 s, dolg zamah);
// dotik gumba (npr. Naprej, ki korak prestavi na vrh) ni drsenje. rAF: pride za umikom ob istem potegu ali koleščku.
let lessonTop = null, userScrollAt = 0;
const userScroll = () => { userScrollAt = performance.now(); };
document.addEventListener("touchmove", userScroll, { passive: true });
document.addEventListener("touchend", () => userScrollAt && userScroll(), { passive: true });
document.addEventListener("wheel", userScroll, { passive: true });
document.addEventListener("click", () => { userScrollAt = 0; }, true);
document.addEventListener("scroll", (e) => {
  if (e.target?.id !== "view-textbook" || e.target.closest(".in-okno")) return;
  const prev = lessonTop;
  lessonTop = e.target.scrollTop;
  if (prev == null || prev === lessonTop || performance.now() - userScrollAt > 4000) return;
  const edge = lessonEdge(e.target);
  if (edge && (lessonTop < prev ? edge.top : edge.bottom)) requestAnimationFrame(() => barAuto() && peekBar(true));
}, { capture: true, passive: true });
document.addEventListener("focusin", () => document.body.classList.contains("tb-peek") && typing() && peekBar(false));
// Odprta lekcija v Učbeniku (vrstica se umakne) ali nazaj na kazalo: pogled ostane isti, vsebina se zamenja.
new MutationObserver(() => { lessonTop = null; peekBar(false); }).observe($("#view-textbook"), { childList: true });
$("#chat-back").addEventListener("click", () => showView(!["chat", "onboard", "auth"].includes(prevView) && !isFloating(prevView) ? prevView : "path"));

// Zavihek pogleda v premičnem oknu okno le prinese v ospredje (branje, vnos in drsenje v njem ostanejo).
document.querySelectorAll(".tab").forEach((t) => t.addEventListener("click", () => (isFloating(t.dataset.view) ? focusWindow(t.dataset.view) : showView(t.dataset.view))));

// Tipka Nazaj (Android, aplikacija na začetnem zaslonu, brskalnik): brez tega bi tipka Nazaj
// v nameščeni aplikaciji takoj zaprla Evklid. Zgodovina ima dve ravni: Učna pot (0) in
// trenutni pogled (1). Nazaj najprej zapre odprto okno (kalkulator, navodila) ali lekcijo,
// s podstrani »Jaz« (Nastavitve, Napredek …) vodi na »Jaz«, sicer na Učno pot.
let currentView = "path";
let prevView = "path"; // za gumb Nazaj v glavi klepeta (telefon)
let fromBack = false;
let skipPop = 0;
let overlayEntry = false; // zapis v zgodovini samo za okno, odprto na Učni poti
const atTop = () => history.state?.stm !== 1;
function syncHistory(name) {
  if (fromBack) return;
  if (name === "path") {
    // Korak nazaj že čaka (history.back je asinhron, history.state se še ni spremenil):
    // drugi klic bi šel čez prvi zapis aplikacije, npr. ob osvežitvi na podstrani na about:blank.
    if (!atTop() && !skipPop) {
      skipPop++;
      overlayEntry = false;
      history.back();
    }
    return;
  }
  const entry = { stm: 1, v: name };
  if (atTop()) history.pushState(entry, "");
  else history.replaceState(entry, "");
}
// Okno se je odprlo: na Učni poti dodamo zapis, da ga tipka Nazaj zapre namesto aplikacije.
function overlayOpened() {
  if (currentView === "path" && atTop()) {
    history.pushState({ stm: 1, v: "path" }, "");
    overlayEntry = true;
  }
}
// Okno zaprto z gumbom: odvečni zapis odstranimo, da ni treba dvakrat pritisniti Nazaj.
function overlayClosed() {
  if (overlayEntry && currentView === "path" && !atTop() && !skipPop) {
    skipPop++;
    history.back();
  }
  overlayEntry = false;
}
window.addEventListener("popstate", () => {
  // Pred prijavo (pristajalna stran, prijava, registracija) Nazaj ureja account.js.
  if (document.body.classList.contains("auth-mode")) return;
  if (skipPop) {
    skipPop--;
    // Medtem odprt drug pogled (npr. takoj po zagonu) dobi svoj zapis, da Nazaj ne zapre aplikacije.
    if (!skipPop && currentView !== "path" && atTop()) history.pushState({ stm: 1, v: currentView }, "");
    return;
  }
  const wasOverlay = overlayEntry;
  overlayEntry = false;
  const keep = () => currentView !== "path" && history.pushState({ stm: 1, v: currentView }, "");
  // Odprt meni (klobuk ali profil) Nazaj le zapre, pogled ostane.
  // Okno pomena črke (formula-info.js) Nazaj le zapre.
  if (closeFormulaPop() || closePaperViewer() || closeOurPaper() || closeQuickStart() || closeProfileMenu()) return keep();
  if (installSheetOpen()) {
    closeInstallSheet({ fromBack: true });
    return keep();
  }
  if (calcOverlayOpen()) {
    closeCalcOverlay({ fromBack: true });
    return keep();
  }
  if (cornerBack()) return keep();
  // Poskus, ki ga je odprl inštruktor (okno nad pogovorom, public/odpri.js).
  if (simOverlayOpen()) {
    closeSimOverlay();
    return keep();
  }
  // 3D čez cel zaslon (»Uči se« → 3D svet ali povezava iz lekcije) tudi, ko je »Uči se« v premičnem oknu nad drugim pogledom.
  if (isOpen3d()) {
    leaveUci();
    return keep();
  }
  if (wasOverlay && currentView === "path") return;
  if ($("#tour") && !$("#tour").hidden) {
    startTour.end?.(); // Nazaj zapre vodič (kot Esc ali »Preskoči«)
    return keep();
  }
  if (currentView === "uci" && uciBack({ textbookBack, labBack })) return keep();
  if (currentView === "games" && gamesBack()) return keep();
  if (currentView === "scan" && scanBack()) return keep();
  const subMe = meView(currentView) && !["me", "graph"].includes(currentView);
  if (subMe && $("#tabbar").offsetParent) return showView("me"); // telefon: nazaj na »Jaz«
  fromBack = true;
  try {
    showView("path");
  } finally {
    fromBack = false;
  }
});

const ME_VIEWS = ["me", "progress", "league", "settings", "account", "feedback", "graph", "games", "corner", "schedule", "zbirke", "scan"];
// Četrto mesto spodnje vrstice: Laboratorij ali »NPZ in matura« (ko je cilj NPZ/matura); kar ni tam, je pod »Jaz«.
const meView = (name) => ME_VIEWS.includes(name) || (!!name && offTabbarViews().includes(name));
// Zbirke in učni pass: odpre pogled, po želji s predmetom v pogledu »preglej« (from = pogled za Nazaj).
let zbOpen = {};
function openZbirke(item = null, from = null) {
  zbOpen = { item, from };
  showView("zbirke");
}
// Obvestilo o novih predmetih po nalogi ali pogovoru (z gumbom v zbirke).
function unlockedHtml(ids) {
  const text = unlockedText(ids);
  if (!text) return "";
  return `<button type="button" class="fb mastered pop zb-unlocked" data-zb="${escapeHtml(ids[0])}">${itemThumb(ids[0], 40)}<span>${escapeHtml(text)}</span>${icon("chevron-right")}</button>`;
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-zb]");
  if (b) openZbirke(b.dataset.zb);
});
function renderMe() {
  const s = state.student;
  if (!s) return;
  meCard($("#me-zbirke"));
  $("#me-avatar").textContent = (s.name || "?").trim().charAt(0).toUpperCase();
  $("#me-name").textContent = s.name;
  $("#me-level").textContent = $("#path-select").selectedOptions[0]?.textContent.replace(t("path.myLevel"), "") || "";
  $("#me-xp").textContent = state.xp?.total ?? $("#xp-total").textContent;
  paintMeLevel();
  $("#me-streak").textContent = $("#xp-streak").textContent;
  $("#me-account").hidden = $("#account-tab").hidden;
  loadMeOverview();
}
// Pregled na strani Jaz (j, 4. 11. 2026: prazen spodnji del strani naj bo izkoriščen): koledar aktivnosti,
// »Nadaljuj« (današnji trening, Učna pot, Inštruktor) in prihodnji testi iz Urnika.
async function loadMeOverview() {
  const box = $("#me-overview");
  const id = state.student?.id;
  if (!box || !id) return;
  if (box.dataset.for !== String(id)) box.innerHTML = ""; // pregled prejšnjega profila ne ostane na zaslonu
  box.dataset.for = id;
  const [p, sch] = await Promise.all([api(`/api/students/${id}/progress`).catch(() => null), api(`/api/students/${id}/schedule`).catch(() => null)]);
  if (state.student?.id !== id) return;
  if (!p && !sch) return void (box.innerHTML = `<p class="muted">${t("lock.offline")}</p>`);
  const events = (sch?.schedule?.events || []).filter((e) => e.daysLeft >= 0).slice(0, 4);
  const when = (n) => (n === 0 ? t("test.today") : n === 1 ? t("test.tomorrow") : t("test.inDays", { n }));
  const row = (go, ic, title, sub = "") =>
    `<button type="button" class="list-row" data-me="${go}"><span class="ic">${icon(ic)}</span><span class="lr-text"><b>${title}</b>${sub ? `<small>${sub}</small>` : ""}</span>${icon("chevron-right")}</button>`;
  box.innerHTML = `
    <div class="card me-akt">
      <div class="me-ov-head"><h2>${t("akt.title")}</h2><button type="button" class="text-btn" data-me="progress">${t("nav.progress")}</button></div>
      ${heatmapHtml(p?.xpDays || [])}
    </div>
    <div class="card me-next">
      <h2>${t("qs.title")}</h2>
      <div class="list-card">
        ${row("daily", "zap", t("daily.title"), t("daily.about"))}
        ${row("path", "map", t("nav.path"))}
        ${row("chat", "message-circle", t("nav.chat"))}
      </div>
    </div>
    <div class="card me-tests">
      <div class="me-ov-head"><h2>${t("sch.upcoming")}</h2><button type="button" class="text-btn" data-me="schedule">${t("sch.title")}</button></div>
      ${
        events.length
          ? `<div class="list-card">${events
              .map((e) => row("schedule", "clipboard-check", escapeHtml(e.name), `${escapeHtml(new Date(`${e.date}T12:00:00`).toLocaleDateString(locale(), { weekday: "short", day: "numeric", month: "numeric" }))} · ${when(e.daysLeft)}`))
              .join("")}</div>`
          : `<p class="muted">${t("sch.noEvents")}</p><button type="button" class="secondary" data-me="schedule">${icon("plus")} ${t("sch.addTest")}</button>`
      }
    </div>`;
  hydrateIcons?.(box);
}
$("#me-overview")?.addEventListener("click", (e) => {
  const b = e.target.closest("[data-me]");
  if (!b) return;
  if (b.dataset.me === "daily") startSession("daily", { path: state.pathKey });
  else showView(b.dataset.me);
});
// Raven z vrstico napredka na strani Jaz.
function paintMeLevel() {
  const box = $("#me-lvl");
  if (!box) return;
  box.hidden = !state.xp;
  if (state.xp) {
    box.innerHTML = levelRowHtml(state.xp);
    $("#me-xp").textContent = state.xp.total;
    $("#me-streak").textContent = state.xp.streak;
  }
}
// Nazaj na »Jaz« s podstrani (viden samo, ko je spodnja vrstica: telefon in tablica).
document.addEventListener("click", (e) => {
  if (e.target.closest(".me-back")) showView("me");
});
document.querySelectorAll("#view-me [data-go], #settings-account [data-go]").forEach((b) =>
  b.addEventListener("click", () => (b.dataset.go === "account" ? $("#account-tab").click() : showView(b.dataset.go))),
);
// Klik na kartico s profilom: Nastavitve, na mestu šole in letnika (pod njimi je povezava na Račun).
$("#me-head")?.addEventListener("click", () => {
  showView("settings");
  const el = $("#settings-form .level-field") || $("#settings-form");
  requestAnimationFrame(() => {
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    const card = $("#settings-form");
    card?.classList.remove("flash-target");
    void card?.offsetWidth;
    card?.classList.add("flash-target");
  });
});

// ---------- učenci ----------

async function loadStudents(selectId) {
  state.students = await api("/api/students");
  saveStudents(state.students);
  if (!state.students.length) {
    if (accountsOn()) return openAddChild(); // otroka doda starš s soglasjem
    state.students = [await onboard()];
  }
  const sel = $("#student-select");
  sel.innerHTML = state.students.map((s) => `<option value="${s.id}">${escapeHtml(s.name)}</option>`).join("");
  const saved = Number(selectId ?? localStorageGet("studentId"));
  const pick = state.students.find((s) => s.id === saved) || state.students[0];
  sel.value = pick.id;
  await selectStudent(pick.id);
}

// Nov profil: ime in izbira šole po korakih (OŠ / SŠ / fakulteta → … → letnik).
async function onboard(name = "") {
  const programs = await loadPrograms(api);
  // Privzeti šolski sistem po državi naprave (Indija → CBSE, Nigerija → JSS/SS …), sicer Slovenija.
  const defaultSystem = systemForCountry(deviceRegion());
  const box = $("#view-onboard");
  box.innerHTML = `
    <form id="onboard-form" class="card form">
      <h1>${t("onb.hello")}</h1>
      <p class="muted">${t("onb.text")}</p>
      <div class="onb-lang"></div>
      <label>${t("onb.name")} <input name="name" maxlength="40" required placeholder="${escapeHtml(t("onb.namePh"))}" value="${escapeHtml(name)}"></label>
      <fieldset class="level-field">
        <legend>${t("set.school")}</legend>
        <label class="system-field"><span>${t("set.system")}</span>
          <select name="school_system">${schoolSystemOptions(defaultSystem)}</select>
        </label>
        <div class="level-picker"></div>
        <input type="hidden" name="educational_track">
        <input type="hidden" name="study_program">
        <input type="hidden" name="curriculum_level">
      </fieldset>
      <fieldset class="goal-field">
        <legend>${t("goal.title")}</legend>
        <small class="muted">${t("goal.note")}</small>
        <div class="goal-box"></div>
      </fieldset>
      <p class="form-error" hidden></p>
      <button class="primary big" type="submit">${t("common.start")}</button>
      ${state.student ? `<button type="button" class="ghost" data-onb-cancel>${t("cards.cancel")}</button>` : ""}
    </form>`;
  const f = $("#onboard-form");
  mountLanguageCard(f.querySelector(".onb-lang"), { compact: true });
  // Cilj in datum: vprašamo samo tokrat (izbira ciljev je odvisna od šole).
  const goalBox = f.querySelector(".goal-box");
  const drawGoal = () => {
    const keep = goalBox.innerHTML ? readGoalFields(goalBox) : {};
    goalBox.innerHTML = goalFieldsHtml({ ...keep, school_system: f.school_system.value, educational_track: f.educational_track.value }, { idPrefix: "onb-goal" });
  };
  drawGoal();
  wireGoalFields(goalBox);
  const picker = mountLevelPicker(f.querySelector(".level-picker"), f, { programs, settings: { school_system: defaultSystem }, onChange: drawGoal });
  f.school_system.addEventListener("change", () => {
    picker.setSystem(f.school_system.value);
    drawGoal();
  });
  showView("onboard");
  document.body.classList.add("onboarding");
  return new Promise((resolve) => {
    let busy = false; // ob počasni povezavi večkratni pritisk ne sme ustvariti več učencev
    // Dodajanje profila iz Nastavitev se da preklicati (brez tega ni bilo poti nazaj).
    f.querySelector("[data-onb-cancel]")?.addEventListener("click", () => {
      document.body.classList.remove("onboarding");
      resolve(null);
    });
    f.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (busy) return;
      const err = f.querySelector(".form-error");
      if (!picker.complete()) {
        err.textContent = t("onb.finish");
        err.hidden = false;
        return;
      }
      const track = f.educational_track.value;
      const settings = {
        school_system: f.school_system.value,
        educational_track: track,
        study_program: f.study_program.value,
        curriculum_level: f.curriculum_level.value,
        language: currentLang(),
        region: currentRegion(),
        ...readGoalFields(goalBox),
      };
      if (track === "UNIVERZA") settings.subject = programs.find((p) => p.id === settings.study_program)?.mainSubject || "MAT";
      const btn = f.querySelector('button[type="submit"]');
      busy = true;
      btn.disabled = true;
      err.hidden = true;
      let s;
      try {
        s = await api("/api/students", { method: "POST", body: { name: f.name.value, settings, vir: currentSource() } });
      } catch (ex) {
        err.textContent = ex.message;
        err.hidden = false;
        busy = false;
        btn.disabled = false;
        return;
      }
      document.body.classList.remove("onboarding");
      resolve(s);
    });
  });
}

async function selectStudent(id) {
  const target = state.students.find((s) => s.id === Number(id));
  // Vsak profil ima svoje geslo (z računi): zaklenjen profil najprej odklenemo, profil brez gesla ga dobi.
  // Uporabnik lahko namesto tega izbere drug profil; seznam se nato naloži znova (stanje zaklepa profilov se je lahko spremenilo).
  // Brez povezave s strežnikom (shranjena kopija) računi niso vklopljeni: odpremo profil za vadbo brez gesla,
  // zaklenjenega pa ne (zanj ni shranjenih nastavitev).
  if (target && accountsOn() && (target.locked || target.needs_password)) return loadStudents(await openProfileLock(target, state.students));
  if (target?.locked) {
    const open = state.students.find((s) => !s.locked);
    // Vsi profili zaklenjeni: brez strežnika ni kaj odpreti; ob zagonu bootFailed pokaže »ni dosegljiva« in počaka.
    if (!open) throw new Error(t("lock.offline"));
    $("#student-select").value = open.id;
    return selectStudent(open.id);
  }
  state.student = target;
  state.aiOut = false; // delež drugega profila ne skrije »Razloži podrobneje« (osveži ga naslednji odgovor)
  keptPaper = null;
  state.paperCtx = null; // skrit kontekst pole ne gre v pogovor drugega profila
  // Jezik je del profila: ob menjavi učenca se vmesnik preklopi v njegov jezik (stran se naloži znova).
  const want = state.student.settings.language;
  if (want && want !== currentLang()) {
    localStorageSet("studentId", state.student.id);
    if (setLanguage(want)) return;
  }
  syncCompetitionTab();
  applyLite();
  refreshBubble(); // premična okna zavihkov, ki jih ta profil nima (NPZ in matura, Tekmovanja), se zaprejo
  localStorageSet("studentId", state.student.id);
  leaveHiddenGames(); // »Skrij igre« novega profila
  // Igre (glavni pogled ali okno): igra, kovanci in videz po stopnji prejšnjega profila ne ostanejo.
  if (!$("#view-games").hidden) {
    leaveGames();
    showGames();
  }
  sendOffline();
  state.conversationId = null;
  await loadConversations();
  if (state.conversations.length) await openConversation(state.conversations[0].id);
  else renderEmptyChat();
  if (!$("#view-settings").hidden) fillSettingsForm();
  if (!$("#view-progress").hidden) loadProgress();
  if (!$("#view-me").hidden) renderMe(); // pregled (aktivnost, testi) novega profila
  if (!$("#view-league").hidden) loadLeague(state.student.id);
  if (!$("#view-scan").hidden) showScan(); // naloga prejšnjega profila ne ostane na zaslonu
  if (!$("#view-lab").closest("[hidden]")) showLab(); // zaklep in vrstni red poskusov sta po profilu
  state.pathKey = null;
  state.modes = null; // »Nadaljuj z učenjem« in goNew ne smeta pokazati naslednje teme prejšnjega profila
  clearLevelCard();
  maybeTour.done = false; // vodič je za vsak profil posebej (settings.tour_version)
  if (!$("#view-path").hidden || !$("#view-topic").hidden) showView("path");
  // Tekmovanja, Izpiti ter NPZ in matura: izbira in rezultati prejšnjega profila ne ostanejo na zaslonu.
  state.examKey = state.compKey = null;
  if (!$("#view-exams").hidden) showView(siExams() ? "exams" : "path");
  if (!$("#view-competition").hidden) showView(isUni(state.student.settings) ? "path" : "competition");
  // Drugi pogledi v premičnih oknih pokažejo podatke novega profila (zgornji so se že osvežili).
  for (const v of floatingViews()) if (!["settings", "progress", "league", "scan", "path", "exams", "competition", "games"].includes(v)) v === "account" ? renderAccount() : initView(v);
  refreshProfileButton();
  refreshXp();
  // Vprašalnik kotička zanimanj: profil, ki ga še ni izpolnil, ga dobi ob zagonu (enkrat).
  state.interestsAsk = maybeAskInterests();
}
$("#student-select").addEventListener("change", (e) => selectStudent(e.target.value));

// Klik na klobuk zgoraj levo: »Nadaljuj z učenjem« (naslednja tema, trening, kar je danes na vrsti).
// Menjava predmeta v obeh menijih zgoraj (klobuk in ime), ne le v Nastavitvah.
initSubjectSwitch({ choices: subjectChoices, pick: pickSubject });
initQuickStart({ getState: () => state, refresh: refreshModes, showView, goNew, startSession, showTestPrep, overlayOpened, overlayClosed });

// Klik na ime zgoraj desno: meni profila (menjava, nov profil, zbirke, mnenje, nastavitve, račun, odjava).
initProfileMenu({
  getState: () => state,
  showView,
  escapeHtml,
  accountsOn,
  logout,
  describe: (s) => {
    const st = s.settings || {};
    const program = isUni(st) ? programsCache().find((p) => p.id === st.study_program)?.label : null;
    return [program || SUBJECT_NAMES[st.subject], levelLabel(st.curriculum_level)].filter(Boolean).join(" · ");
  },
});

// ---------- pogovori ----------

async function loadConversations() {
  state.conversations = await api(`/api/students/${state.student.id}/conversations`);
  renderConversationList();
  refreshBubble();
}

function renderConversationList() {
  const list = $("#conversation-list");
  list.innerHTML = "";
  for (const c of state.conversations) {
    const li = document.createElement("li");
    li.className = c.id === state.conversationId ? "active" : "";
    li.innerHTML = `<span>${escapeHtml(c.title)}</span><button title="${t("chat.delete")}" aria-label="${t("chat.delete")}">${icon("trash-2")}</button>`;
    li.querySelector("span").addEventListener("click", () => openConversation(c.id));
    // Brisanje z enim klikom, brez potrditve (j, 4. 11.): pogovor takoj izgine iz seznama (tudi ob hitrem
    // brisanju več pogovorov), ob napaki se seznam znova naloži.
    li.querySelector("button").addEventListener("click", async (e) => {
      e.stopPropagation();
      state.conversations = state.conversations.filter((x) => x.id !== c.id);
      if (state.paperCtx?.conv === c.id) state.paperCtx = null; // id se lahko ponovi pri novem pogovoru
      if (state.conversationId === c.id) {
        state.pacer?.skip();
        state.conversationId = null;
        state.convTopic = null;
        renderEmptyChat();
      }
      renderConversationList();
      refreshBubble();
      $("#new-chat")?.focus(); // fokus ne pade na stran (tipkovnica, bralnik zaslona)
      try {
        await api(`/api/conversations/${c.id}`, { method: "DELETE" });
        toast(t("chat.deleted"), "trash-2");
      } catch (err) {
        await loadConversations().catch(() => {});
        if (err.status !== 404) throw err; // obvestilo o napaki (unhandledrejection)
      }
    });
    list.appendChild(li);
  }
}

function renderEmptyChat() {
  state.chatFx = null; // nov pogovor (tudi po brisanju odprtega ali menjavi profila): predmet iz nastavitev
  $("#chat-title").textContent = t("chat.new");
  const ideas = [t("chat.idea1"), t("chat.idea2"), t("chat.idea3")];
  // .empty-hall: okvir pozdrava (ui.css → »Klepet obdobja«: s chat.frame »stebri« pročelje templa iz
  // ERAS[…].arch.temple, templeParts doda dele in jih ob menjavi sloga zamenja; »pilon« iz ERAS[…].building enako).
  $("#messages").innerHTML = `<div class="empty"><div class="empty-hall">
    <div class="tutor-avatar big" aria-hidden="true">${icon("sparkles")}</div>
    <p class="big">${t("chat.hello", { name: escapeHtml(state.student.name) })}</p>
    <p>${t("chat.intro")}</p>
    <div class="ideas">${ideas.map((t) => `<button type="button" class="idea" data-idea="${escapeHtml(t)}">${escapeHtml(t)}</button>`).join("")}</div></div>
    ${greekFactHtml("gr-chat")}</div>`;
  templeParts();
  wireGreekFacts($("#messages"));
  // Predlog se pošlje takoj in inštruktor nanj odgovori (j, 3. 11.): ni ga treba še enkrat poslati.
  // Če je učenec že kaj napisal ali dodal fotografijo, predlog gre v polje (da se nič ne izgubi).
  $("#messages").querySelectorAll("[data-idea]").forEach((b) =>
    b.addEventListener("click", () => {
      if (!$("#input").value.trim() && !state.image) return send(b.dataset.idea);
      fillInput(b.dataset.idea);
    }),
  );
  renderState(null);
}

function templeParts() {
  const hall = $("#messages .empty-hall");
  if (!hall) return;
  hall.querySelectorAll(".t-part").forEach((e) => e.remove());
  const t = window.STEMTheme?.temple?.(document.documentElement.dataset.era);
  if (!t) return;
  hall.insertAdjacentHTML("afterbegin", t.top);
  hall.insertAdjacentHTML("beforeend", t.bottom);
}
window.addEventListener("evklid:era", templeParts);

function renderState(convState) {
  const s = state.student.settings;
  const subject = convState?.subject || s.subject;
  const mode = convState?.mode || s.solving_mode;
  const program = isUni(s) ? programsCache().find((p) => p.id === s.study_program)?.label : null;
  // Predmet, način in letnik se zamenjajo kar v glavi (izbirni seznam), program je le napis.
  const pick = (key, label, options) =>
    `<span class="chip chip-pick"><select data-pick="${key}" aria-label="${escapeHtml(label)}">${options}</select></span>`;
  const opt = (value, label, current) => `<option value="${escapeHtml(value)}"${current ? " selected" : ""}>${escapeHtml(label)}</option>`;
  const levels = levelChoices(s);
  const head = $("#chat-state");
  head.innerHTML = [
    SUBJECT_NAMES[subject] && pick("subject", t("set.subject"), opt(subject, SUBJECT_NAMES[subject], true)),
    MODE_NAMES[mode] && pick("mode", t("set.mode"), Object.entries(MODE_NAMES).map(([k, v]) => opt(k, v, k === mode)).join("")),
    program && `<span class="chip">${escapeHtml(program)}</span>`,
    levelLabel(s.curriculum_level) &&
      (levels.length > 1
        ? pick("level", t("set.school"), levels.map((x, i) => opt(i, x.label, x.current)).join(""))
        : `<span class="chip">${escapeHtml(levelLabel(s.curriculum_level))}</span>`),
  ]
    .filter(Boolean)
    .join("");
  wireStatePicks(head, subject, levels);
  // Pogovor o temi učne poti: povezava na lekcijo v učbeniku.
  const topicId = state.conversationId && state.convTopic;
  if (topicId) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip chip-btn chat-lesson";
    b.innerHTML = `${icon("book-open")}<span>${escapeHtml(t("chat.readLesson"))}</span>`;
    b.addEventListener("click", () => openLesson(topicId));
    $("#chat-state").prepend(b); // prvi tudi za tipko Tab, ne le na zaslonu
  }
}

async function wireStatePicks(head, subject, levels) {
  const save = async (settings, what, label) => {
    const updated = await api(`/api/students/${state.student.id}`, { method: "PUT", body: { settings } });
    studentUpdated(updated);
    toast(`${what}: ${label}`, "check");
  };
  head.querySelector('[data-pick="mode"]')?.addEventListener("change", (e) =>
    save({ solving_mode: e.target.value }, t("set.mode"), MODE_NAMES[e.target.value]).catch(() => renderState(null)),
  );
  head.querySelector('[data-pick="level"]')?.addEventListener("change", (e) => {
    const next = { ...levels[Number(e.target.value)].settings };
    // Predmet, ki ga novi razred nima (npr. fizika v 7. razredu), zamenja prvi predmet razreda.
    if (!jeFaks(next)) {
      const list = schoolSubjectsFor(next.educational_track, next.curriculum_level, isRegional(next.school_system));
      if (list.length && !list.includes(state.student.settings.subject)) next.subject = list.includes("NAR") && ["FIZ", "KEM", "BIO"].includes(state.student.settings.subject) ? "NAR" : list[0];
    } else next.study_course = "";
    save(next, t("set.school"), levels[Number(e.target.value)].label).catch(() => renderState(null));
  });
  const sel = head.querySelector('[data-pick="subject"]');
  if (!sel) return;
  const groups = await subjectChoices().catch(() => []);
  if (!sel.isConnected || !groups.length) return;
  const items = groups.flatMap((g) => g.items);
  const isCur = (it) => (isUni(state.student.settings) ? it.current : it.id === subject);
  let i = 0;
  sel.innerHTML = groups
    .map((g) => {
      const o = g.items.map((it) => `<option value="${i++}"${isCur(it) ? " selected" : ""}>${escapeHtml(it.label)}</option>`).join("");
      return g.label && groups.length > 1 ? `<optgroup label="${escapeHtml(g.label)}">${o}</optgroup>` : o;
    })
    .join("");
  // Predmet pogovora ni na seznamu: ostane prikazan, izbira drugega ga zamenja.
  if (!items.some(isCur)) sel.insertAdjacentHTML("afterbegin", `<option value="" selected>${escapeHtml(SUBJECT_NAMES[subject] || subject)}</option>`);
  sel.addEventListener("change", () => {
    const it = sel.value === "" ? null : items[Number(sel.value)];
    if (it) pickSubject(it).catch(() => renderState(null));
  });
}

// Formule v odgovorih inštruktorja: črke s pomenom iz predmeta pogovora in, pri pogovoru o temi
// učne poti, iz lekcije te teme (:::simboli). Nov pogovor: predmet iz nastavitev.
async function setChatFx(conv) {
  state.chatFx = { subject: conv?.state?.subject || state.student?.settings?.subject || "MAT", symbols: null };
  const id = conv?.topic?.id;
  if (!id) return;
  try {
    if (!topicCache.has(id)) topicCache.set(id, await api(`/api/topic?id=${encodeURIComponent(id)}`));
    if (state.conversationId !== conv.id) return; // medtem odprt drug pogovor
    const tp = topicCache.get(id);
    state.chatFx = { subject: topicSubject(tp) || state.chatFx.subject, symbols: tp?.symbols || null, topic: tp?.id ? { id: tp.id, unit: tp.unit, name: tp.name, subject: tp.subject } : null };
  } catch { /* brez oznak lekcije */ }
}
const chatRich = (text) => withFormulaSubject(state.chatFx?.subject || state.student?.settings?.subject || "MAT", () => renderRich(text), state.chatFx?.symbols, topicScope(state.chatFx?.topic));

async function openConversation(id) {
  const conv = await api(`/api/conversations/${id}`);
  state.conversationId = conv.id;
  state.convTopic = conv.topic?.id || null;
  await setChatFx(conv);
  if (state.conversationId !== conv.id) return; // medtem odprt drug pogovor
  $("#chat-title").textContent = conv.title;
  const box = $("#messages");
  box.innerHTML = "";
  if (!conv.messages.length) renderEmptyChat();
  for (const m of conv.messages) addMessage(m.role, m.text, m.has_image, m);
  renderState(conv.state);
  renderConversationList();
  prilagodiZdaj(); // zložene formule (sirina.js) so višje: na dno šele zdaj
  box.scrollTop = box.scrollHeight;
  refreshBubble();
}

// Telefon: seznam pogovorov se odpre čez klepet; gumb ostane viden in ga zapre (tudi Esc).
const setSidebar = (open) => {
  $(".sidebar").classList.toggle("open", open);
  $("#toggle-sidebar").setAttribute("aria-expanded", String(open));
};
// Na računalniku je seznam lahko skrit s potegom ločnice do roba (public/razdelilnik.js): isti gumb ga vrne.
let chatSplit = null;
$("#toggle-sidebar").addEventListener("click", () => (chatSplit?.collapsed ? chatSplit.expand() : setSidebar(!$(".sidebar").classList.contains("open"))));
$("#conversation-list").addEventListener("click", () => setSidebar(false));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && $(".sidebar").classList.contains("open")) setSidebar(false);
});

$("#chat-bug").addEventListener("click", (e) => {
  const btn = e.currentTarget;
  const open = $("#view-chat .bug-box");
  if (open) return open.focusFirst();
  btn.setAttribute("aria-expanded", "true");
  openAdminBug($("#view-chat .chat-head"), {
    api,
    studentId: state.student.id,
    conversationId: () => state.conversationId,
    view: "chat",
    toast,
    onClose: () => {
      btn.setAttribute("aria-expanded", "false");
      btn.focus();
    },
  });
});

$("#new-chat").addEventListener("click", () => {
  setSidebar(false);
  state.conversationId = null;
  state.chatFx = null;
  renderConversationList();
  renderEmptyChat();
  $("#input").focus();
  refreshBubble();
});

// ---------- sporočila ----------

function addMessage(role, text, hasImage = false, info = null) {
  const box = $("#messages");
  box.querySelector(".empty")?.remove();
  const el = document.createElement("div");
  // Napaka (npr. izklopljen klepet) je brez »Razloži podrobneje« in brez prijave.
  el.className = `msg ${role}${info?.error ? " error" : ""}`;
  if (role === "user") {
    el.innerHTML = renderUserText(text);
    if (hasImage) {
      const note = document.createElement("div");
      note.className = "photo-note";
      note.innerHTML = `${icon("camera")} ${t("chat.photoNote")}`;
      el.prepend(note);
    }
  } else {
    el.innerHTML = chatRich(text);
    if (text) addDeepButton(el, false);
    if (text && info?.full_offer) addFullButton(el);
    if (text && info?.choices) addChoices(el, info.choices);
    if (text && info?.open) addOpen(el, info.open);
    if (text && !info?.open?.some((x) => x.kind === "graph")) addGraphButton(el, text);
    if (text && info?.id) addMsgFoot(el, info);
  }
  box.appendChild(el);
  prilagodiZdaj();
  box.scrollTop = box.scrollHeight;
  return el;
}

async function send(text, { deep = false, image: attached = null } = {}) {
  if (state.sending) return;
  // Samodejno sestavljeno sporočilo (Razloži, Vprašaj o temi, izbire …) ni iz polja: učenčev osnutek in
  // fotografija v polju ostaneta (ne pošljemo ju zraven in ju ne pobrišemo). Slika samodejnega sporočila
  // (izrez naloge iz pole) pride kot attached.
  const fromInput = !attached && ($("#input").value.trim() || "") === (text || "").trim();
  const image = attached || (fromInput ? state.image : null);
  if (!text && !image) return;
  // Izklopljen klepet (EVKLID_CHAT_OFF): nič ne pošljemo, vprašanje in fotografija ostaneta.
  if (!$("#chat-off").hidden) return;
  let userEl = null;
  let bubble = null;
  let pacer = null;
  state.sending = true;
  $("#send").disabled = true;
  state.pacer?.skip();

  try {
    if (!state.conversationId) {
      const conv = await api(`/api/students/${state.student.id}/conversations`, { method: "POST" });
      state.conversationId = conv.id;
    }
    const sentTo = state.conversationId;
    // Skrit kontekst pole (»Pomoč pri tej nalogi«, »Rešuj z inštruktorjem«): samo s prvim sporočilom tega pogovora.
    const paperCtx = state.paperCtx?.conv === sentTo ? state.paperCtx : null;
    document.querySelectorAll(".full-btn, .choice-row").forEach((x) => x.remove());
    userEl = addMessage("user", text, !!image);
    if (fromInput) {
      $("#input").value = "";
      autoGrow();
      clearImage();
    }

    bubble = addMessage("assistant", "");
    bubble.classList.add("typing");
    const box = $("#messages");
    const paint = (shown) => {
      const atBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 80;
      bubble.innerHTML = chatRich(streamSafe(shown)) || "<p></p>"; // prazen odstavek nosi piko »piše« (style.css)
      prilagodiZdaj(); // dolgo enačbo zloži že zdaj, da pomik na dno šteje njeno pravo višino
      if (atBottom) box.scrollTop = box.scrollHeight;
    };
    paint("");
    // Odgovor se izpisuje z berljivim tempom; dotik sporočila pokaže vse naenkrat.
    pacer = createPacer(currentPace(), paint);
    state.pacer = pacer;
    const skip = () => pacer.skip();
    bubble.addEventListener("click", skip);
    bubble.title = t("chat.tapToSkip");

    const res = await fetchThroughRestart(`/api/conversations/${state.conversationId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, deep, lite: liteActive(), device: deviceSnapshot(), image: image ? { media_type: image.media_type, data: image.data } : undefined, paper: paperCtx || undefined }),
    });
    if (!res) {
      bubble.remove();
      throw new Error(t("off.noConnection"));
    }
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      bubble.remove();
      if (serverDown(res)) throw new Error(t("off.serverBusy"));
      if (err.chat_off) throw Object.assign(new Error(t("chat.off")), { chatOff: true });
      // Meja porabe (429, limit): sporočilo je »poslano« (ostane v oblačku), polje ostane prazno.
      throw Object.assign(new Error(serverError(err, res.status)), { limit: res.status === 429 && err.limit === true });
    }

    if (paperCtx && state.paperCtx === paperCtx) state.paperCtx = null; // strežnik ga je shranil s sporočilom
    let doneData = null;
    let cardsData = null;
    let proposal = null;
    let newLanguage = null;
    let allowanceData = null;
    await readSse(res, {
      // Zajamčena poraba naročnika: obvestilo pri 80 %, opomba pri 100 % (server/app.js, j 2026-11-01).
      allowance: (d) => {
        allowanceData = d;
        if (d.stage === "out") state.aiOut = true;
      },
      delta: (d) => pacer.push(d.text),
      cards: (d) => (cardsData = d),
      // Inštruktor je spremenil nastavitve (server/chat-settings.js).
      settings: (d) => {
        studentUpdated(d.student);
        if (d.language) newLanguage = d.language;
      },
      device_settings: (d) => applyDeviceSettings(d.changes),
      // »Odpri kalkulator«, »pokaži periodni sistem« … (server/chat-settings.js): okno ob klepetu.
      open_window: (d) => openFromTutor(d),
      // Inštruktor je spremenil urnik: kartica na Učni poti in stran Urnik se osvežita.
      schedule: () => scheduleChanged(),
      proposal: (d) => (proposal = d),
      mastered: (d) => toast(d.unlocked?.length ? `${t("chat.mastered", { topic: d.topic })} ${unlockedText(d.unlocked)}` : t("chat.mastered", { topic: d.topic }), "trophy"),
      done: (d) => {
        doneData = d;
        // Ves delež podrobnih razlag porabljen (strežnik, ai_out): gumba »Razloži podrobneje« ne kažemo več.
        state.aiOut = !!d.ai_out;
        // Predmet pogovora, ki ga je inštruktor pravkar določil (nov pogovor brez teme): formule v tem in naslednjih odgovorih.
        if (d.state?.subject && state.conversationId === sentTo && !state.chatFx?.symbols) state.chatFx = { subject: d.state.subject, symbols: null };
        pacer.finish(d.text);
        chatReply(d.text); // mehurček, če klepet ni na zaslonu (public/okna.js)
        // Pogovor je med odgovorom morda izbrisan ali zamenjan: naslov in stanje ostaneta odprtemu pogovoru.
        if (state.conversationId !== sentTo) return;
        if (d.state) renderState(d.state);
        if (d.title) $("#chat-title").textContent = d.title;
      },
      error: (d) => {
        bubble.classList.add("error");
        pacer.finish(d.error);
        pacer.skip();
        if (state.conversationId === sentTo && !deep) restoreDraft(text, image); // vrni besedilo za ponovni poskus
      },
    });
    pacer.finish();
    pacer.done.then(() => {
      bubble.classList.remove("typing");
      bubble.removeEventListener("click", skip);
      bubble.removeAttribute("title");
      // Odgovor, ki samo spremeni nastavitve, ne potrebuje »Razloži podrobneje«.
      if (doneData && !doneData.settings) addDeepButton(bubble, doneData.deep);
      // Ne, če je učenec med počasnim izpisom že poslal novo sporočilo (gumb samo pri zadnjem odgovoru).
      // bubble.isConnected: učenec je med izpisom morda odprl drug pogovor.
      if (doneData?.full_offer && bubble.isConnected && !bubble.nextElementSibling) addFullButton(bubble);
      if (doneData?.choices && bubble.isConnected && !bubble.nextElementSibling) {
        // Gumbi pridejo po izpisu: če je bil učenec na dnu, jih pokažemo (na telefonu bi bili pod robom).
        const box = $("#messages");
        const atBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 80;
        addChoices(bubble, doneData.choices);
        if (atBottom) requestAnimationFrame(() => (box.scrollTop = box.scrollHeight));
      }
      if (doneData?.open) addOpen(bubble, doneData.open);
      if (doneData?.text && !doneData.open?.some((x) => x.kind === "graph")) addGraphButton(bubble, doneData.text);
      if (cardsData) addCardsNote(bubble, cardsData);
      if (allowanceData) addAllowanceNote(bubble, allowanceData);
      if (doneData?.id) addMsgFoot(bubble, doneData);
      if (proposal) addProposal(bubble, proposal, { onConfirm: confirmChatProposal });
      checkReplyFits(bubble, doneData?.id);
      if (state.pacer === pacer) state.pacer = null;
      // Nov jezik: vmesnik se naloži znova v njem (ko je odgovor izpisan).
      if (newLanguage && newLanguage !== currentLang()) setTimeout(() => setLanguage(newLanguage), 1200);
      refreshUsageMeter();
    });
    await loadConversations();
  } catch (err) {
    // Odgovor, prekinjen sredi izpisa: pokažemo, kar je prišlo, brez pike »piše« (prazen mehurček odstranimo).
    if (pacer) {
      pacer.finish();
      pacer.skip();
      if (state.pacer === pacer) state.pacer = null;
    }
    if (bubble) {
      bubble.classList.remove("typing");
      bubble.removeAttribute("title");
      if (!bubble.textContent.trim()) bubble.remove();
    }
    // Izklopljen klepet: samo obvestilo nad poljem, vprašanje ostane v polju.
    if (err.chatOff) {
      userEl?.remove();
      if (!$("#messages .msg")) renderEmptyChat(); // prazen pogovor spet pokaže pozdrav in predloge
      $("#chat-off").hidden = false;
      if (!deep) restoreDraft(text, image);
      return;
    }
    // Prekinjena povezava (npr. med objavo nove različice) je TypeError z »network error« v angleščini: učenec
    // dobi razumljivo obvestilo, vprašanje ostane v polju za ponovno pošiljanje.
    const dropped = err instanceof TypeError && /^(network ?error|failed to fetch|load failed|networkerror)/i.test(err.message);
    if (!dropped) console.error(err);
    addMessage("assistant", dropped ? t("off.serverBusy") : err.message, false, { error: true });
    // Neuspelo pošiljanje (omrežje, strežnik): besedilo in fotografija se vrneta v polje, da se ne izgubita.
    // Meja porabe: ne (sporočilo ostane v oblačku, polje prazno).
    // »Razloži podrobneje« (deep) se ne vrne v polje (kot mobilna): ponovno pošiljanje bi šlo kot navadno vprašanje.
    if (!err.limit && !deep) restoreDraft(text, image);
  } finally {
    state.sending = false;
    $("#send").disabled = false;
  }
}

// Pripravljeno vprašanje (kalkulator, skener, 3D, kotiček, predlog) v polje: učenčevega osnutka ne prepiše,
// ampak ga doda na konec v novi vrstici (j, 6. 11.: nikoli izgube vnosa).
function fillInput(text) {
  const box = $("#input");
  const typed = box.value.replace(/\s+$/, "");
  box.value = typed ? `${typed}\n\n${text}` : text;
  autoGrow();
  box.focus();
  box.setSelectionRange?.(box.value.length, box.value.length);
}

// Besedilo neuspelega sporočila nazaj v polje; osnutka, ki ga je učenec medtem (ali že prej) napisal, ne prepiše.
// (Pri sporočilu iz polja je polje ob pošiljanju izpraznjeno; kar je v njem zdaj, je nov osnutek.)
function restoreDraft(text, image) {
  const box = $("#input");
  if (text && !box.value.trim()) {
    box.value = text;
    autoGrow();
  }
  if (image && !state.image) {
    state.image = image;
    $("#image-preview img").src = image.url;
    $("#image-preview").hidden = false;
  }
}

// Odgovor inštruktorja ne gre v vidni del klepeta (telefon z odprto tipkovnico ali ploščo): pokažemo ga v oknu.
function checkReplyFits(bubble, id) {
  const box = $("#messages");
  if (!bubble?.isConnected || !box.offsetParent || !matchMedia("(hover: none) and (pointer: coarse)").matches) return;
  const typing = document.activeElement?.matches?.("textarea, input:not([type=checkbox]):not([type=radio])");
  if (!typing && !document.body.classList.contains("pad-open")) return;
  if (bubble.offsetHeight <= box.clientHeight * 1.1) return;
  const copy = bubble.cloneNode(true);
  copy.querySelectorAll("button, .msg-foot, .graph-btn").forEach((b) => b.remove());
  showFull({ kind: "reply", sig: String(id || bubble.textContent.length), title: t("nav.chat"), html: copy.innerHTML });
}

// Obvestilo pod odgovorom: koliko podrobnih razlag je še ostalo (nikoli € ali $). Gumb za dokup samo, ko ga
// strežnik dovoli (polnoleten imetnik, profil 15+, ena ponudba naenkrat).
function addAllowanceNote(bubble, d) {
  const el = document.createElement("div");
  el.className = "cards-note allowance-note";
  // Pri 80 % dve vrstici: obvestilo, pod njim preostanek (»Podrobne razlage ta mesec: še 6«).
  const base = d.stage === "out" ? escapeHtml(t("ai.out")) : `${escapeHtml(t("ai.low"))}<br><small>${escapeHtml(t("ai.left", { n: d.left }))}</small>`;
  // Družina: obvestilo velja za skupen delež vseh profilov.
  const text = d.pool ? `${base}<br><small>${escapeHtml(t("ai.pool"))}</small>` : base;
  el.innerHTML = `<div class="cn-head">${icon("info")} <span>${text}</span></div>${d.buy ? `<button type="button" class="text-btn">${escapeHtml(t("ai.buy"))} ${icon("chevron-right")}</button>` : ""}`;
  el.querySelector("button")?.addEventListener("click", () => $("#account-tab").click());
  bubble.appendChild(el);
}

async function readSse(res, handlers) {
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let idx;
    while ((idx = buf.indexOf("\n\n")) !== -1) {
      const chunk = buf.slice(0, idx);
      buf = buf.slice(idx + 2);
      const event = /^event: (.*)$/m.exec(chunk)?.[1];
      const data = /^data: (.*)$/m.exec(chunk)?.[1];
      if (event && data && handlers[event]) handlers[event](JSON.parse(data));
    }
  }
}

const input = $("#input");
// Polje raste z besedilom do 40 % vidne višine (tudi z odprto tipkovnico), nato drsi; nobena vrstica ni odrezana.
// Če besedilo ne gre več v polje, se samodejno pokaže v večjem oknu (public/razpri.js). Zadnja sporočila
// ostanejo vidna nad poljem.
function autoGrow(stick, again) {
  // Predogled formul nad poljem: (3)/(4) se pokaže kot ulomek, preden ga pošlješ.
  const pv = $("#formula-preview");
  const show = hasFormula(input.value);
  if (show) pv.innerHTML = renderUserText(input.value);
  pv.hidden = !show;
  const box = $("#messages");
  const atBottom = typeof stick === "boolean" ? stick : box.scrollHeight - box.scrollTop - box.clientHeight < 80;
  const max = Math.max(80, Math.round((window.visualViewport?.height || window.innerHeight) * 0.4));
  input.style.maxHeight = `${max}px`;
  input.style.height = "auto";
  const h = input.scrollHeight;
  input.style.height = `${Math.min(h, max)}px`;
  input.style.overflowY = h > max ? "auto" : "hidden";
  // Telefon: daljše besedilo dobi celo širino vrstice, gumbi gredo pod polje (nazaj šele, ko je polje prazno).
  const row = input.closest(".composer-row");
  const multi = h > 60 || (row.classList.contains("multi") && !!input.value);
  // Samo enkrat: v ozkem oknu se prazno polje z zavitim namigom sicer preklaplja v neskončnost (prekoračen sklad).
  if (multi !== row.classList.contains("multi") && !again) {
    row.classList.toggle("multi", multi);
    return autoGrow(atBottom, true); // širina polja se je spremenila: višino izmerimo znova
  }
  if (atBottom) box.scrollTop = box.scrollHeight;
  if (h > max + 2 && input.value.trim() && input.offsetParent) showFull({ kind: "composer", title: t("full.message"), field: input });
  else if (fullOpen("composer") && (h <= max || !input.value.trim())) closeFull();
}
attachPrettify(input); // x^2 → x², 3/4 → ³⁄₄, sqrt → √ že med pisanjem (pred autoGrow, ki izmeri novo besedilo)
input.addEventListener("input", autoGrow);
// Ozko polje (telefon): namig se ne odreže sredi besede (»Napiši nalogo a«), ampak za zadnjo celo besedo
// (»Napiši nalogo …«). Celoten namig ostane v polju, ko je prostora dovolj; nov namig (jezik, način) se izmeri znova.
{
  let full = "";
  let shown = "";
  const ctx = document.createElement("canvas").getContext("2d");
  const fit = () => {
    if (input.placeholder !== shown) full = input.placeholder;
    const cs = getComputedStyle(input);
    const room = input.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - 2;
    if (!full || !ctx || room <= 0) return;
    ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    let text = full;
    if (ctx.measureText(full).width > room) {
      const words = full.replace(/\s*…$/, "").split(/\s+/);
      while (words.length > 1 && ctx.measureText(`${words.join(" ")} …`).width > room) words.pop();
      text = `${words.join(" ")} …`;
    }
    shown = text;
    if (input.placeholder !== text) input.placeholder = text;
  };
  if (window.ResizeObserver) new ResizeObserver(fit).observe(input);
  new MutationObserver(() => input.placeholder !== shown && fit()).observe(input, { attributes: true, attributeFilter: ["placeholder"] });
  document.fonts?.ready.then(fit);
}
// Besedilo, vpisano iz kode (predlogi, kalkulator, kotiček, vrnjeno po napaki), tudi poveča polje.
{
  const desc = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value");
  Object.defineProperty(input, "value", {
    configurable: true,
    get() {
      return desc.get.call(this);
    },
    set(v) {
      desc.set.call(this, v);
      requestAnimationFrame(autoGrow);
    },
  });
  let raf = 0;
  const later = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => input.offsetParent && autoGrow());
  };
  window.visualViewport?.addEventListener("resize", later);
  window.addEventListener("resize", later);
  input.addEventListener("focus", later);
}
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    $("#composer").requestSubmit();
  }
});
$("#composer").addEventListener("submit", (e) => {
  e.preventDefault();
  send(input.value.trim());
});

// Glasovni vnos (brskalnik, sl-SI) in napredna tipkovnica s simboli.
attachMic($("#mic-btn"), input, { onMessage: (m) => toast(m, "mic"), onChange: autoGrow });
// Evklidova tipkovnica (public/tipkovnica.js): na dotik za vsa polja, Σ jo odpre na plasti simbolov (tudi na računalniku).
initKeyboard();
initSirina();
initDrsniki();
setKeyboardContext({ settings: () => state.student?.settings, chapter: calcChapter });
mountKeyboardSettings($("#tipkovnica-card"));
configureKeyboard(input, { layers: ["abc", "num", "fx", "sym", "kem"], start: "abc", enter: "send", ctx: TUTOR_CHIPS });
$("#sym-btn").addEventListener("click", () => toggleKeyboard(input, { layer: "sym" }));
window.addEventListener("evklid:tipkovnica", () => {
  const on = keyboardOpenFor(input) && keyboardLayer() === "sym";
  $("#sym-btn").setAttribute("aria-pressed", String(on));
  $("#sym-btn").classList.toggle("on", on);
});

// ---------- fotografije ----------

async function loadImage(file) {
  if (!file || !file.type.startsWith("image/")) return;
  // Pomanjšaj na največ 1600 px, da je pošiljanje hitro in poceni.
  const bitmap = await createImageBitmap(file);
  // Lahki način: še manjša in bolj stisnjena slika (manj prenosa in manj žetonov).
  const lite = liteActive();
  const scale = Math.min(1, (lite ? 900 : 1200) / Math.max(bitmap.width, bitmap.height)); // manjša slika = manj žetonov
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const url = canvas.toDataURL("image/jpeg", lite ? 0.6 : 0.8);
  state.image = { media_type: "image/jpeg", data: url.split(",")[1], url };
  $("#image-preview img").src = url;
  $("#image-preview").hidden = false;
}
function clearImage() {
  state.image = null;
  $("#image-preview").hidden = true;
  $("#image-input").value = "";
}
$("#image-input").addEventListener("change", (e) => loadImage(e.target.files[0]));
$("#remove-image").addEventListener("click", clearImage);
input.addEventListener("paste", (e) => {
  const file = [...(e.clipboardData?.files || [])].find((f) => f.type.startsWith("image/"));
  if (file) {
    e.preventDefault();
    loadImage(file);
  }
});

// ---------- lahki način in delo brez povezave ----------

// Lahki način: vedno, nikoli ali samodejno, kadar naprava varčuje s podatki ali ima počasno povezavo.
function liteActive() {
  const mode = state.student?.settings?.data_mode || "auto";
  if (mode !== "auto") return mode === "lite";
  const c = navigator.connection;
  return !!(c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || "")));
}
function applyLite() {
  const on = liteActive();
  document.documentElement.classList.toggle("lite", on);
  localStorageSet("evklid.lite", on ? "1" : "0"); // za theme.js ob naslednjem odprtju
}
navigator.connection?.addEventListener?.("change", applyLite);

// Service worker: aplikacija se odpre brez povezave; ob prvem obisku shrani že naložene datoteke.
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker
    .register("/sw.js")
    .then(async () => {
      const reg = await navigator.serviceWorker.ready;
      const urls = performance.getEntriesByType("resource").map((e) => e.name).concat(location.href);
      reg.active?.postMessage({ type: "precache", urls });
    })
    .catch(() => null);
}

// Samodejna posodobitev (docs/posodobitve.md): ko strežnik teče z novejšo različico, se stran
// tiho osveži, a samo, ko to učenca ne zmoti: ob vrnitvi v aplikacijo (vsaj 1 minuto v ozadju)
// ali po 10 minutah brez dotika, nikoli med tekmovanjem ali z napisanim, a neposlanim besedilom.
let appVersion = null;
let hiddenAt = 0;
let lastInput = Date.now();
for (const ev of ["pointerdown", "keydown", "input", "wheel", "touchstart"]) {
  addEventListener(ev, () => (lastInput = Date.now()), { capture: true, passive: true });
}
const serverVersion = () =>
  fetch("/healthz/stanje", { cache: "no-store" })
    .then((r) => (r.ok ? r.json() : null))
    .then((s) => s?.razlicica || null)
    .catch(() => null);
const unsentText = () =>
  [...document.querySelectorAll("textarea, input[type=text], input[type=search], input:not([type])")].some(
    (el) => el.offsetParent !== null && !el.readOnly && el.value.trim() && el.value !== el.defaultValue,
  );
async function reloadIfNewer() {
  if (!appVersion || state.contestTimer || unsentText()) return;
  const v = await serverVersion();
  if (!v || v === appVersion) return;
  const reg = await navigator.serviceWorker?.getRegistration?.().catch(() => null);
  await reg?.update?.().catch(() => null); // nov service worker (nove knjižnice) pred osvežitvijo
  location.reload();
}
serverVersion().then((v) => (appVersion = v));
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    hiddenAt = Date.now();
    return;
  }
  if (hiddenAt && Date.now() - hiddenAt >= 60 * 1000) reloadIfNewer();
});
setInterval(() => {
  if (document.visibilityState === "visible" && Date.now() - lastInput >= 10 * 60 * 1000) reloadIfNewer();
}, 5 * 60 * 1000);

// Pasica brez povezave na učni poti in pošiljanje odgovorov, ko se povezava vrne.
function syncOfflineBanner() {
  const box = $("#offline-banner");
  if (!box || !state.student) return;
  const sid = state.student.id;
  const off = !navigator.onLine || serverIsDown || serverUpdating;
  const n = packTaskCount(sid);
  const pending = pendingCount(sid);
  box.hidden = !off && !pending;
  // internet deluje, strežnik pa se ravno znova zaganja (objava nove različice)
  const updating = serverUpdating && navigator.onLine !== false;
  box.innerHTML = updating
    ? `${icon("refresh-cw")}<span>${t("off.updating")}</span>`
    : off
    ? `${icon("wifi-off")}<span>${n ? t("off.banner", { n }) : t("off.bannerEmpty")}</span>`
    : `${icon("refresh-cw")}<span>${t("off.pending", { n: pending })}</span>`;
}
async function sendOffline() {
  if (!state.student || !navigator.onLine) return;
  const out = await syncOffline(api, state.student.id).catch(() => null);
  if (out?.synced) {
    toast(t("off.synced", { n: out.synced }), "cloud-upload");
    refreshXp().catch(() => null);
  }
  syncOfflineBanner();
}
window.addEventListener("online", () => {
  sendOffline();
  syncOfflineBanner();
});
window.addEventListener("offline", syncOfflineBanner);

// ---------- nastavitve ----------

// Izbira predmeta: OŠ in SŠ matematika, fizika, kemija; fakulteta predmeti iz predmetnika
// izbrane smeri in letnika (in izbirni predmeti).
function fillSubjectOptions() {
  const f = $("#settings-form");
  const uni = f.educational_track.value === "UNIVERZA";
  $("#subject-row").hidden = uni;
  $("#course-row").hidden = !uni;
  if (uni) return fillCourseOptions();
  const prev = f.subject.value || state.student?.settings?.subject;
  const list = schoolSubjectsFor(f.educational_track.value, f.curriculum_level.value, isRegional(f.school_system.value));
  // Predmet, ki ga razred nima: fizika, kemija ali biologija v 6./7. → naravoslovje, naravoslovje v 8. → fizika.
  const want = list.includes(prev) ? prev : ["FIZ", "KEM", "BIO"].includes(prev) && list.includes("NAR") ? "NAR" : prev === "NAR" || prev === "BIO" ? "FIZ" : "MAT";
  f.subject.innerHTML = subjectOptions(null, want, list);
  if (![...f.subject.options].some((o) => o.value === want)) f.subject.selectedIndex = 0;
}

const courseCache = new Map(); // program → predmeti po letnikih (/api/paths?program=)
let courseReq = 0;
// Predmeti študijskega programa za letnik: predmeti letnika in izbirni predmeti (Nastavitve in meni profila).
async function courseChoices(program, level) {
  if (!courseCache.has(program)) courseCache.set(program, await api(`/api/paths?program=${encodeURIComponent(program)}`).catch(() => []));
  const list = courseCache.get(program);
  const year = Number((String(level).match(/([1-4])/) || [])[1]) || 1;
  // Letnik brez predmetov (moduli): zadnji letnik s predmeti, kot na učni poti.
  const years = [...new Set(list.filter((c) => c.year).map((c) => c.year))].filter((y) => y <= year);
  const y = years.length ? Math.max(...years) : null;
  return { y, mine: list.filter((c) => c.year === y), elect: list.filter((c) => c.elective) };
}
const courseName = (c) => c.label.replace(/ \([^)]*\)$/, "");
const currentCourse = (mine, elect, s) =>
  [...mine, ...elect].some((c) => c.key === s.study_course) ? s.study_course : (mine.find((c) => c.subject === s.subject) || mine[0] || elect[0])?.key;

// Menjava predmeta iz menija profila (zgoraj desno, na vsakem zaslonu), ne le v Nastavitvah.
async function subjectChoices() {
  const s = state.student?.settings || {};
  if (!isUni(s)) {
    const list = schoolSubjectsFor(s.educational_track, s.curriculum_level, isRegional(s.school_system));
    return [{ items: list.map((k) => ({ id: k, label: SUBJECT_NAMES[k], current: k === s.subject })) }];
  }
  if (!s.study_program) return [];
  const { y, mine, elect } = await courseChoices(s.study_program, s.curriculum_level);
  const cur = currentCourse(mine, elect, s);
  const items = (list) => list.map((c) => ({ id: c.key, subject: c.subject, label: courseName(c), current: c.key === cur }));
  return [
    { label: y ? t("path.year", { n: y }) : null, items: items(mine) },
    { label: t("path.electives"), items: items(elect) },
  ].filter((g) => g.items.length);
}
async function pickSubject(item) {
  const uni = isUni(state.student.settings);
  const settings = uni ? { study_course: item.id, subject: item.subject || state.student.settings.subject } : { subject: item.id, study_course: "" };
  const updated = await api(`/api/students/${state.student.id}`, { method: "PUT", body: { settings } });
  studentUpdated(updated);
  toast(`${t("set.subject")}: ${item.label}`, "check");
  // Odprt zaslon pokaže novi predmet takoj.
  if (currentView === "path") loadPath();
  else if (currentView === "uci") showUci(); // učbenik, poskusi in 3D svet po novem predmetu
  else if (currentView === "me") renderMe();
  else if (currentView === "exams") loadExams();
  else if (currentView === "competition") regionalExams() ? loadExams() : loadCompetition();
  else if (currentView === "cards") showFlashcards();
}

async function fillCourseOptions() {
  const f = $("#settings-form");
  const program = f.study_program.value;
  const sel = f.study_course;
  if (!program) return (sel.innerHTML = "");
  const req = ++courseReq;
  const { y, mine, elect } = await courseChoices(program, f.curriculum_level.value);
  if (req !== courseReq) return; // medtem je bil izbran drug program
  const s = state.student?.settings || {};
  const prev = [...mine, ...elect].some((c) => c.key === sel.value) ? sel.value : currentCourse(mine, elect, s);
  const opt = (c) => `<option value="${c.key}" data-subject="${c.subject}"${c.key === prev ? " selected" : ""}>${escapeHtml(courseName(c))}</option>`;
  sel.innerHTML =
    (mine.length ? `<optgroup label="${escapeHtml(t("path.year", { n: y }))}">${mine.map(opt).join("")}</optgroup>` : "") +
    (elect.length ? `<optgroup label="${escapeHtml(t("path.electives"))}">${elect.map(opt).join("")}</optgroup>` : "");
}

// Narečje inštruktorja: možnosti za jezik pogovora; brez možnosti je vrstica skrita.
function fillDialectOptions(f, s) {
  const list = dialectsFor(s.language);
  $("#dialect-row").hidden = !list.length;
  f.dialect.innerHTML = [`<option value="">${escapeHtml(t("set.dialectStd"))}</option>`, ...list.map((d) => `<option value="${d.id}">${escapeHtml(d.name)}</option>`)].join("");
  f.dialect.value = list.some((d) => d.id === s.dialect) ? s.dialect : "";
}

function fillLevelOptions(track) {
  // Fakulteta in regijski šolski sistemi: brez slovenskih tekmovanj (NPZ, matura, olimpijade).
  $("#track-row").hidden = track === "UNIVERZA" || isRegional($("#settings-form").school_system.value);
  fillSubjectOptions();
  fillGoalFields();
}
// Cilj, datum in opomnik ob 12.00 (cilji so odvisni od šole: NPZ v OŠ, matura v SŠ, izpit na fakulteti).
function fillGoalFields(fresh = false) {
  const box = $("#settings-goal");
  const f = $("#settings-form");
  if (!box || !state.student) return;
  const base = fresh || !box.innerHTML ? state.student.settings : { ...state.student.settings, ...readGoalFields(box) };
  box.innerHTML = goalFieldsHtml({ ...base, educational_track: f.educational_track.value || base.educational_track, school_system: f.school_system.value || base.school_system }, { withReminder: true, idPrefix: "set-goal" });
  wireGoalFields(box);
}

// Izbira šole po korakih (OŠ/SŠ/fakulteta → … → letnik).
let levelPicker = null;

// Kartica »Izbriši profil« nosi ime trenutnega profila (tudi po preimenovanju v Nastavitvah).
function fillDeleteCard() {
  const name = state.student.name;
  $("#delete-student-text").textContent = t("set.deleteText", { name });
  $("#delete-student").textContent = t("set.deleteStudent", { name });
}

async function fillSettingsForm() {
  const f = $("#settings-form");
  const s = state.student.settings;
  fillCornerSummary();
  f.name.value = state.student.name;
  fillDeleteCard();
  const programs = await loadPrograms(api);
  for (const key of ["track", "personality_setting"]) f[key].value = s[key];
  f.data_mode.value = s.data_mode || "auto";
  f.games.checked = !gamesOn(s);
  f.xp_goal.value = String(s.xp_goal || 50);
  fillDialectOptions(f, s);
  f.subject.innerHTML = subjectOptions(null, s.subject, schoolSubjectsFor(s.educational_track, s.curriculum_level, isRegional(s.school_system)));
  f.study_course.innerHTML = "";
  f.school_system.innerHTML = schoolSystemOptions(s.school_system || "SI");
  if (!levelPicker) {
    levelPicker = mountLevelPicker($("#settings-level"), f, { programs, settings: s, onChange: (_, track) => fillLevelOptions(track) });
    f.school_system.addEventListener("change", () => levelPicker.setSystem(f.school_system.value));
  } else levelPicker.set(s);
  f.querySelector(`input[name=solving_mode][value=${s.solving_mode}]`).checked = true;
  f.manual_weaknesses.value = state.student.manual_weaknesses.join(", ");
  fillGoalFields(true);
  fillLevelOptions(s.educational_track);
  if (state.pickUniversity) {
    state.pickUniversity = false;
    levelPicker.set({ ...s, educational_track: "UNIVERZA", study_program: "", curriculum_level: "" });
    $("#settings-level").scrollIntoView({ block: "center" });
  }
}
// Jezik aplikacije in inštruktorja: shrani se v profil učenca in na napravo.
mountLanguageCard($("#language-card"), {
  onChange: async (code) => {
    if (!state.student) return;
    await api(`/api/students/${state.student.id}`, { method: "PUT", body: { settings: { language: code, region: regionFor(code) } } }).catch(() => null);
  },
});
$("#lang-note").hidden = currentLang() === "sl";

// Hitrost izpisa je nastavitev naprave (ne profila), shrani se takoj.
{
  const sel = $("#pace-select");
  sel.innerHTML = Object.entries(PACES)
    .map(([k]) => `<option value="${k}">${t(`pace.${k}`)}</option>`)
    .join("");
  sel.value = PACES[localStorageGet("pace")] ? localStorageGet("pace") : DEFAULT_PACE;
  sel.addEventListener("change", () => localStorageSet("pace", sel.value));
}

$("#settings-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = e.target;
  const before = state.student.settings;
  if (levelPicker && !levelPicker.complete()) {
    alert(t("set.finishSchool"));
    return;
  }
  const updated = await api(`/api/students/${state.student.id}`, {
    method: "PUT",
    body: {
      name: f.name.value,
      manual_weaknesses: f.manual_weaknesses.value,
      settings: {
        school_system: f.school_system.value,
        ...(f.educational_track.value === "UNIVERZA"
          ? { study_course: f.study_course.value, subject: f.study_course.selectedOptions[0]?.dataset.subject || state.student.settings.subject }
          : { subject: f.subject.value, study_course: "" }),
        track: isRegional(f.school_system.value) ? "REGULAR" : f.track.value,
        educational_track: f.educational_track.value,
        study_program: f.educational_track.value === "UNIVERZA" ? f.study_program.value : "",
        curriculum_level: f.curriculum_level.value,
        solving_mode: f.querySelector("input[name=solving_mode]:checked").value,
        personality_setting: f.personality_setting.value,
        dialect: f.dialect.value,
        data_mode: f.data_mode.value,
        games: f.games.checked ? "off" : "on",
        xp_goal: Number(f.xp_goal.value),
        ...readGoalFields($("#settings-goal")),
      },
    },
  });
  const i = state.students.findIndex((s) => s.id === updated.id);
  state.students[i] = updated;
  state.student = updated;
  if (before.xp_goal !== updated.settings.xp_goal) refreshXp().catch(() => null);
  syncCompetitionTab();
  applyLite();
  leaveHiddenGames();
  $("#student-select").options[$("#student-select").selectedIndex].textContent = updated.name;
  fillDeleteCard();
  refreshProfileButton();
  renderState(null);
  if (levelChanged(before, updated.settings) || before.subject !== updated.settings.subject || before.study_course !== updated.settings.study_course) {
    state.pathKey = null; // Ponavljanje in Kartice (state.pathKey) za novi predmet, ne za prejšnjega
    refreshModes();
  }
  // Prehod OŠ → SŠ ali SŠ → fakulteta: na Učni poti pokažemo, kaj je novega.
  const up = stageUp(before, updated.settings);
  if (up) {
    state.welcome = { stage: up };
    return showView("path");
  }
  const ok = $("#settings-saved");
  ok.hidden = false;
  setTimeout(() => (ok.hidden = true), 2000);
});

// ---------- nastavitve, ki jih spremeni inštruktor ----------

// Posodobljen profil (iz klepeta): stanje, zavihki, pot in odprte Nastavitve.
function studentUpdated(updated) {
  if (!updated || updated.id !== state.student?.id) return;
  const before = state.student.settings;
  const i = state.students.findIndex((s) => s.id === updated.id);
  if (i >= 0) state.students[i] = updated;
  state.student = updated;
  syncCompetitionTab();
  applyLite();
  leaveHiddenGames();
  refreshProfileButton();
  renderState(null);
  if (before.goal !== updated.settings.goal || before.games !== updated.settings.games) renderGoal(); // bližnjici po cilju na Učni poti
  if (levelChanged(before, updated.settings) || before.subject !== updated.settings.subject || before.study_course !== updated.settings.study_course) {
    state.pathKey = null;
    refreshModes(); // številki na gumbih Ponavljanje in Kartice za novi predmet
  }
  const up = stageUp(before, updated.settings);
  if (up) state.welcome = { stage: up };
  if (!$("#view-settings").hidden) fillSettingsForm();
  fillCornerSummary();
  if (before.xp_goal !== updated.settings.xp_goal) refreshXp().catch(() => null); // dnevni cilj spremenil inštruktor
}

// Kotiček zanimanj v Nastavitvah: kratek seznam izbranih tem in gumb za vprašalnik.
function fillCornerSummary() {
  const el = $("#corner-summary");
  if (el && state.student) el.textContent = interestsSummary(state.student.settings) || t("set.cornerNone");
}
$("#corner-edit").addEventListener("click", () => askInterests());

// Gumb »Da, spremeni« pod predlogom inštruktorja (šola, razred/letnik, program).
async function confirmChatProposal(settings) {
  const updated = await api(`/api/students/${state.student.id}`, { method: "PUT", body: { settings } });
  studentUpdated(updated);
  toast(t("chat.setDone"), "check");
}

// Nastavitve naprave, ki jih je spremenil inštruktor: posodobi odprte izbire.
window.addEventListener("evklid:device-setting", (e) => {
  const { key, value } = e.detail || {};
  if (key === "reply_speed" && PACES[value]) $("#pace-select").value = value;
  if (key === "calculator" && CALC_MODES.includes(value)) calcMode = value;
});

// ---------- prehod v višji razred / letnik ----------

const levelChanged = (a, b) => ["educational_track", "curriculum_level", "study_program", "school_system"].some((k) => a?.[k] !== b?.[k]);

function clearLevelCard() {
  const box = $("#level-card");
  box.hidden = true;
  box.innerHTML = "";
  state.levelChecked = null;
  state.welcome = null;
}

async function showLevelCard() {
  const box = $("#level-card");
  const sid = state.student?.id;
  if (!sid) return;
  if (state.welcome) {
    const { stage } = state.welcome;
    state.welcome = null;
    const r = await api(`/api/students/${sid}/level-up`).catch(() => ({ premium: true }));
    renderWelcome(box, { stage, premium: r.premium, offers: r.offers, accounts: accountsOn(), onAccount: () => $("#account-tab").click() });
    return;
  }
  if (!box.hidden || state.levelChecked === sid) return;
  state.levelChecked = sid;
  const r = await api(`/api/students/${sid}/level-up`).catch(() => null);
  if (!r?.suggestion || state.student?.id !== sid) return;
  renderSuggestion(box, { studentId: sid, suggestion: r.suggestion, onApply: (s) => applyLevel(s.settings), onChoose: chooseUniversity });
}

// En klik: nov razred ali letnik.
async function applyLevel(settings) {
  const before = state.student.settings;
  const updated = await api(`/api/students/${state.student.id}`, { method: "PUT", body: { settings } });
  state.students[state.students.findIndex((s) => s.id === updated.id)] = updated;
  state.student = updated;
  syncCompetitionTab();
  state.pathKey = null;
  const up = stageUp(before, updated.settings);
  if (up) state.welcome = { stage: up };
  else toast(t("path.levelNow", { level: levelLabel(updated.settings.curriculum_level) }), "circle-arrow-up");
  showView("path");
}

// Iz srednje šole na fakulteto: izbira univerze, fakultete in programa v Nastavitvah.
function chooseUniversity() {
  state.pickUniversity = true;
  showView("settings");
}

$("#new-student-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const s = await onboard(e.target.name.value);
  if (!s) return showView("settings");
  e.target.reset();
  await loadStudents(s.id);
  showView("path");
});

$("#delete-student").addEventListener("click", async () => {
  if (!confirm(t("set.confirmDelete", { name: state.student.name }))) return;
  const gone = state.student.id;
  await api(`/api/students/${gone}`, { method: "DELETE" });
  clearProfile(gone); // podatki profila na tej napravi (paket vaj, skener, kalkulator …)
  localStorageSet("studentId", "");
  await loadStudents();
  fillSettingsForm();
});

// ---------- napredek ----------

// Cilj: vrstica na Učni poti, značka v zgornji vrstici in opomnik ob 12.00 (public/goal.js).
function goalLevelText(st) {
  return [jeFaks(st) ? t("lp.uni") : jeSs(st) ? t("lp.ss") : t("lp.os"), levelLabel(st.curriculum_level)].filter(Boolean).join(" ");
}
function renderGoal() {
  const st = state.student;
  if (!st) return;
  const s = st.settings;
  const line = $("#goal-line");
  line.hidden = !hasGoal(s);
  if (hasGoal(s)) line.innerHTML = goalLineHtml(st, goalLevelText(s));
  const chip = $("#goal-chip");
  chip.hidden = !hasGoal(s);
  if (hasGoal(s)) {
    // V zgornji vrstici le cilj in odštevanje (datum je v vrstici na Učni poti).
    chip.querySelector("b").textContent = [goalName(s.goal), countdown(s.goal_date)].filter(Boolean).join(" · ");
    chip.title = t("goal.change");
  }
  const rem = $("#goal-reminder");
  const due = reminderDue(st);
  rem.hidden = !due;
  if (due) rem.innerHTML = reminderCardHtml(st);
  renderGoalModes();
}

// Domači zaslon po cilju: dve bližnjici na Učni poti, pri NPZ, maturi, tekmovanju in izpitu nad načini učenja
// (public/goal-data.js → goalShortcuts). Videz je isti kot pri načinih; vse ostane dosegljivo tudi v meniju.
const GOAL_MODES = {
  scan: ["scan-line", "scan.title", "scan.meSub"],
  games: ["gamepad-2", "nav.games", "games.meSub"],
  chat: ["message-circle", "nav.chat", "goal.mChatSub"],
  textbook: ["book-open", "nav.textbook", "goal.mTextbookSub"],
  exams: ["clipboard-check", "nav.examsSi", "exam.meSub"],
  izpiti: ["clipboard-check", "nav.exams", "exam.title"],
  tek: ["medal", "session.tek", "goal.mTekSub"],
  contest: ["timer", "session.contest", "goal.mContestSub"],
};
// Cilj »test« premakne Pripravo na test na prvo mesto; ob drugem cilju gre nazaj pred svojega prejšnjega soseda.
// Le ta gumb, da ostane red, ki ga je učenec nastavil s potegom (public/vrstice.js).
let testModeNext; // undefined: ni premaknjen; sicer gumb (ali null = konec), pred katerim je bil
function renderGoalModes() {
  const st = state.student;
  const box = $("#goal-modes");
  const bar = $("#modebar");
  if (!st || !box || !bar) return;
  const s = st.settings;
  const { first, items } = goalShortcuts(s);
  // Kar že odpre kartica stopnje (public/zacetna.js: OŠ igre, SŠ matura, faks Moj študij), tu nadomesti druga bližnjica.
  const shown = stageRows(stopnja(s), { games: gamesOn(s), exams: siExams() });
  const list = items
    .map((k) => (k === "games" && !gamesOn(s) ? "chat" : k))
    .filter((k) => !(k === "exams" && !siExams()) && !(k === "izpiti" && !regionalExams()))
    .filter((k) => !shown.includes(k))
    .filter((k, i, a) => a.indexOf(k) === i);
  for (const alt of ["scan", "chat"]) if (list.length < 2 && !list.includes(alt)) list.push(alt);
  box.innerHTML = list
    .map((k) => {
      const [ic, name, sub] = GOAL_MODES[k];
      return `<button type="button" data-gm="${k}"><span class="ic">${icon(ic)}</span><span class="m-name">${t(name)}</span><span class="m-sub">${t(sub)}</span></button>`;
    })
    .join("");
  box.hidden = !list.length;
  if (first) bar.before(box);
  else bar.after(box);
  const test = bar.querySelector('[data-mode="test"]');
  if (!test) return;
  if (s.goal === "test" && testModeNext === undefined && bar.firstElementChild !== test) {
    testModeNext = test.nextElementSibling;
    bar.prepend(test);
  } else if (s.goal !== "test" && testModeNext !== undefined) {
    if (testModeNext?.parentElement === bar && testModeNext !== test) testModeNext.before(test);
    else bar.append(test);
    testModeNext = undefined;
  }
}
$("#goal-modes")?.addEventListener("click", (e) => {
  const k = e.target.closest("[data-gm]")?.dataset.gm;
  if (!k || !state.student) return;
  if (k === "tek" || k === "contest") {
    state.compAction = k;
    showView("competition");
  } else showView({ izpiti: "competition" }[k] || k);
});
document.addEventListener("click", (e) => {
  if (e.target.closest("[data-goal-edit], #goal-chip")) {
    showView("settings");
    setTimeout(() => $("#settings-goal")?.closest("fieldset")?.scrollIntoView({ block: "center", behavior: "smooth" }), 60);
    return;
  }
  if (e.target.closest("[data-goal-start], [data-goal-later]")) {
    dismissReminder(state.student);
    $("#goal-reminder").hidden = true;
    if (e.target.closest("[data-goal-start]")) startSession("daily", { path: state.pathKey });
  }
});
// Opomnik ob 12.00, tudi če je aplikacija ves čas odprta.
setInterval(() => {
  if (state.student && currentView === "path" && $("#goal-reminder").hidden && reminderDue(state.student)) renderGoal();
}, 5 * 60000);

async function loadProgress() {
  const st = state.student;
  const pg = $("#prog-goal");
  pg.hidden = !hasGoal(st.settings);
  if (hasGoal(st.settings))
    pg.innerHTML = `<div class="goal-line">${goalLineHtml(st, goalLevelText(st.settings))}</div>${
      st.settings.goal_reminder && st.settings.goal_date ? `<div class="goal-reminder preview">${reminderCardHtml(st, { preview: true })}</div>` : ""
    }`;
  const p = await api(`/api/students/${state.student.id}/progress`);
  const weak = $("#weak-list");
  const items = [
    ...p.manual_weaknesses.map((w) => `<li>${escapeHtml(w)}</li>`),
    ...p.weak.map((w) => `<li class="auto" title="${t("prog.errRate", { n: Math.round(w.rate * 100) })}">${escapeHtml(w.topic)} (${w.subject ?? "?"})</li>`),
  ];
  weak.innerHTML = items.length ? items.join("") : `<li>${t("common.noData")}</li>`;
  // Delovni list za doma iz šibkih tem (iz nalog v Vadnici; strežnik pove, če je zaklenjen).
  const sheetBtn = $("#weak-sheet");
  $("#weak-sheet-msg").hidden = true;
  api(`/api/students/${state.student.id}/gradiva/sibke`)
    .then((w) => (sheetBtn.hidden = !w.topics.length || w.locked))
    .catch(() => (sheetBtn.hidden = true));

  // Koledar aktivnosti čez zadnje leto in XP po tednih (public/aktivnost.js).
  $("#prog-heatmap").innerHTML = heatmapHtml(p.xpDays);
  $("#prog-weeks").innerHTML = weeksHtml(p.xpDays);

  // 30 stolpcev, en na dan (dnevi brez aktivnosti so prazni).
  const byDay = Object.fromEntries(p.activity.map((a) => [a.day, a]));
  const days = [...Array(30)].map((_, i) => {
    const d = new Date(Date.now() - (29 - i) * 86400000).toISOString().slice(0, 10);
    return byDay[d] || { day: d, turns: 0, errors: 0 };
  });
  const max = Math.max(1, ...days.map((a) => a.turns));
  $("#prog-turns").hidden = !p.activity.length; // koledar zgoraj že pokaže, da še ni aktivnosti
  $("#activity").innerHTML = p.activity.length
    ? days
        .map(
          (a) => `<div class="bar" style="height:${(a.turns / max) * 100}%" title="${t("prog.dayTitle", { day: a.day, turns: a.turns, errors: a.errors })}">
            <div class="err" style="height:${a.turns ? (a.errors / a.turns) * 100 : 0}%"></div></div>`,
        )
        .join("")
    : `<p class="muted">${t("prog.noActivity")}</p>`;

  $("#topic-rows").innerHTML = p.topics.length
    ? p.topics
        .map(
          (t) => `<tr><td>${t.subject ?? "–"}</td><td>${escapeHtml(t.topic)}</td><td>${t.turns}</td>
            <td class="${(t.weak ?? (t.rate >= 0.4 && t.turns >= 3)) ? "bad" : ""}">${t.errors} (${Math.round(t.rate * 100)} %)<span class="tp-bar" aria-hidden="true"><i style="width:${Math.round((1 - t.rate) * 100)}%"></i></span></td></tr>`,
        )
        .join("")
    : `<tr><td colspan="4" class="muted">${t("common.noData")}</td></tr>`;

  const FLAG_NAMES = { distress: t("flag.distress"), unsafe: t("flag.unsafe"), injection: t("flag.injection"), offtopic: t("flag.offtopic") };
  const flags = p.flags.filter((f) => f.flag !== "offtopic" && f.flag !== "photo"); // zavrnjena fotografija ni opozorilo za starše
  $("#flags-card").hidden = !flags.length;
  refreshXp();
  $("#flag-list").innerHTML = flags
    .map((f) => `<li>${t("prog.flagIn", { when: f.created_at.slice(0, 16), flag: FLAG_NAMES[f.flag] ?? f.flag, title: escapeHtml(f.title) })}</li>`)
    .join("");
}

// Pod odgovorom inštruktorja: koda sporočila (z njo najdemo sporočilo s posnetka zaslona,
// scripts/najdi-sporocilo.js) in »Prijavi napako« (server/reports.js, docs/krizni-nacrt.md).
function addMsgFoot(el, { id, code, reported }) {
  if (el.classList.contains("error") || el.querySelector(".msg-foot")) return;
  const foot = document.createElement("div");
  foot.className = "msg-foot";
  const tag = document.createElement("span");
  tag.className = "msg-code";
  tag.textContent = code || "";
  tag.title = t("rep.code");
  const done = () => {
    foot.querySelector(".msg-report")?.remove();
    const s = document.createElement("span");
    s.className = "rep-done";
    s.innerHTML = `${icon("check")}<span></span>`;
    s.lastChild.textContent = t("rep.done");
    foot.append(s);
  };
  foot.append(tag);
  if (reported) done();
  else {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "ghost msg-report";
    b.innerHTML = `${icon("flag")}<span></span>`;
    b.lastChild.textContent = t("rep.btn");
    b.addEventListener("click", () => openReport(el, foot, b, id, done));
    foot.append(b);
  }
  el.appendChild(foot);
}

function openReport(el, foot, btn, id, done) {
  if (el.querySelector(".report-box")) return;
  const convId = state.conversationId;
  btn.setAttribute("aria-expanded", "true");
  const box = document.createElement("div");
  box.className = "report-box";
  box.setAttribute("role", "group");
  box.innerHTML = `<p></p><div class="rep-reasons"></div><textarea maxlength="500" rows="2"></textarea>
    <p class="rep-err" role="alert" hidden></p>
    <div class="rep-actions"><button type="button" class="primary small rep-send"></button><button type="button" class="ghost rep-cancel"></button></div>`;
  box.querySelector("p").textContent = t("rep.ask");
  box.setAttribute("aria-label", t("rep.ask"));
  const area = box.querySelector("textarea");
  area.placeholder = t("rep.notePh");
  area.setAttribute("aria-label", t("rep.notePh"));
  let reason = null;
  for (const r of ["wrong", "unsafe", "other"]) {
    const rb = document.createElement("button");
    rb.type = "button";
    rb.className = "secondary small";
    rb.setAttribute("aria-pressed", "false");
    rb.textContent = t(`rep.${r}`);
    rb.addEventListener("click", () => {
      reason = r;
      box.querySelectorAll(".rep-reasons button").forEach((x) => x.setAttribute("aria-pressed", String(x === rb)));
      err.hidden = true;
    });
    box.querySelector(".rep-reasons").append(rb);
  }
  const err = box.querySelector(".rep-err");
  const sendBtn = box.querySelector(".rep-send");
  const close = () => {
    box.remove();
    btn.setAttribute("aria-expanded", "false");
    btn.focus();
  };
  sendBtn.textContent = t("rep.send");
  box.querySelector(".rep-cancel").textContent = t("rep.cancel");
  box.querySelector(".rep-cancel").addEventListener("click", close);
  box.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      close();
    }
  });
  sendBtn.addEventListener("click", async () => {
    if (!reason) {
      err.textContent = t("rep.pick");
      err.hidden = false;
      return;
    }
    sendBtn.disabled = true;
    try {
      // Zraven gre, kar je učenec videl: izrisan HTML sporočila in naprava (napaka v izpisu formule).
      await api(`/api/conversations/${convId}/messages/${id}/report`, { method: "POST", body: { reason, note: area.value, shown: shownHtml(el), ...deviceInfo() } });
      box.remove();
      done();
      toast(t("rep.thanks"), "check");
    } catch (e) {
      err.textContent = e.message;
      err.hidden = false;
      sendBtn.disabled = false;
    }
  });
  foot.after(box);
  box.querySelector(".rep-reasons button").focus();
}

// Gumb »Razloži podrobneje« uporabi zmogljivejši (dražji) model samo na zahtevo.
function addDeepButton(el, wasDeep) {
  // Ponovna razlaga je vedno na voljo (tudi po ponovni razlagi); strežnik izbere najcenejši model.
  if (el.classList.contains("error") || el.querySelector(".deep-btn:not(.full-btn)")) return;
  document.querySelectorAll(".deep-btn:not(.full-btn)").forEach((x) => x.remove()); // samo pri zadnjem odgovoru
  if (state.aiOut) return; // 100 % deleža: inštruktor odgovarja v hitrem načinu, podrobne razlage ni
  const b = document.createElement("button");
  b.className = "deep-btn";
  b.type = "button";
  b.innerHTML = `${icon("search")} ${t("chat.deeper")}`;
  b.addEventListener("click", () => {
    if (state.sending || !$("#chat-off").hidden) return;
    b.remove();
    send(t("chat.deeperMsg"), { deep: true });
  });
  el.appendChild(b);
}

// »Pokaži celoten postopek«: strežnik ga ponudi po treh zaporednih korakih vodenja (način A) v istem pogovoru.
// Je enkratna prošnja: inštruktor pokaže celotno rešitev te naloge, nato se vrne v vodenje.
function addFullButton(el) {
  if (el.classList.contains("error") || el.querySelector(".full-btn")) return;
  document.querySelectorAll(".full-btn").forEach((x) => x.remove()); // samo pri zadnjem odgovoru
  const b = document.createElement("button");
  b.className = "deep-btn full-btn";
  b.type = "button";
  b.innerHTML = `${icon("list-checks")} ${t("chat.full")}`;
  b.addEventListener("click", () => {
    if (state.sending || !$("#chat-off").hidden) return;
    b.remove();
    send(t("chat.fullMsg"));
  });
  (el.querySelector(".deep-btn:not(.full-btn)") || el.lastElementChild)?.after(b);
  if (!b.isConnected) el.appendChild(b);
}

// Gumbi z izbirami (<<IZBIRE [...]>>, server/meta.js): kratki odgovori pod zadnjim sporočilom. Tap pošlje
// odgovor kot učenčevo sporočilo (kot predlogi v praznem klepetu); če je učenec že kaj napisal, gre pred to besedilo.
function addChoices(el, choices) {
  if (el.classList.contains("error") || el.querySelector(".choice-row") || !Array.isArray(choices) || choices.length < 2) return;
  document.querySelectorAll(".choice-row").forEach((x) => x.remove()); // samo pri zadnjem odgovoru
  const row = document.createElement("div");
  row.className = "choice-row";
  row.setAttribute("role", "group");
  row.setAttribute("aria-label", t("chat.choices"));
  for (const c of choices.slice(0, 4)) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "secondary small choice-btn";
    b.dir = "auto";
    b.textContent = c;
    b.addEventListener("click", () => {
      // Med pošiljanjem ali ob izklopljenem klepetu tap ne sme izgubiti gumbov.
      if (state.sending || !$("#chat-off").hidden) return;
      const typed = $("#input").value.trim();
      row.remove();
      if (typed || state.image) {
        // Napisano besedilo in fotografija ostaneta: izbira gre pred besedilo, učenec pošlje sam.
        $("#input").value = typed ? `${c}, ${typed}` : c;
        autoGrow();
        $("#input").focus();
        return;
      }
      send(c);
    });
    row.append(b);
  }
  // Takoj za besedilom odgovora, pred »Razloži podrobneje« in nogo sporočila.
  const before = el.querySelector(":scope > .deep-btn, :scope > .graph-btn, :scope > .msg-foot");
  before ? before.before(row) : el.appendChild(row);
}

// Tiha napaka (npr. prekinjena povezava) se pokaže kot obvestilo, ne pa kot »nič se ne zgodi«.
window.addEventListener("unhandledrejection", (e) => {
  const msg = e.reason?.message || String(e.reason || "");
  if (msg) toast(t("common.errorMsg", { msg }), "circle-x");
});

function toast(msg, ic = null) {
  const t = $("#toast");
  t.innerHTML = `${ic ? icon(ic) : ""}<span></span>`;
  t.querySelector("span").textContent = msg;
  t.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => (t.hidden = true), 3500);
}

// ---------- pomožno ----------

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
function currentPace() {
  return PACES[localStorageGet("pace")] || PACES[DEFAULT_PACE];
}
function localStorageGet(k) {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
}
function localStorageSet(k, v) {
  try {
    localStorage.setItem(k, v);
  } catch {}
}

// ---------- učna pot ----------

const LEVEL_NAMES = { 1: t("level.1"), 2: t("level.2"), 3: t("level.3") };
const NODE = {
  due: ["rotate-ccw", t("node.due")],
  mastered: ["check", t("node.mastered")],
  learning: ["pencil", t("node.learning")],
  new: ["play", t("node.new")],
};
// Tekmovalni razdelek ima svoja imena težavnosti: tudi najlažja raven je nad rednim poukom.
const COMP_LEVEL_NAMES = { 1: t("level.comp1"), 2: t("level.comp2"), 3: t("level.comp3") };
const isCompTopic = (id) => /^(MAT|FIZ|KEM)-TEK-/.test(String(id || ""));
const diffBadge = (level, comp = false) =>
  `<span class="diff d${level}" title="${t("level.title")}"><span class="dots"><i></i><i></i><i></i></span>${(comp ? COMP_LEVEL_NAMES : LEVEL_NAMES)[level] || ""}</span>`;

// Povzetek XP (skupaj, raven, danes, cilj …). Ob rasti istega profila: animacija in čestitke (public/xp-fx.js).
let xpSeq = 0; // samo zadnji odgovor velja (starejši, ki pride pozneje, ne sme povoziti novejšega)
async function refreshXp() {
  if (!state.student) return;
  const sid = state.student.id;
  const seq = ++xpSeq;
  const x = await api(`/api/students/${sid}/xp`);
  if (state.student?.id !== sid || seq !== xpSeq) return x;
  const prev = state.xp?.sid === sid ? state.xp : null;
  state.xp = { ...x, sid };
  const chip = $("#xp-badge .stat.xp");
  paintBadge(chip, x);
  if (prev && x.total > prev.total) celebrateXp(prev, x, { badge: chip, total: $("#xp-total"), alive: () => state.student?.id === sid });
  else $("#xp-total").textContent = x.total;
  $("#xp-streak").textContent = x.streak;
  const card = $("#xp-card .xp-stats");
  if (card) card.innerHTML = xpStatsHtml(x, prev);
  if (!$("#view-me").hidden) paintMeLevel();
  state.leaderboard = x.leaderboard;
  refreshModes();
  return x;
}

// ---------- načini učenja (spodnja vrstica) ----------

async function refreshModes() {
  if (!state.student) return null;
  const sid = state.student.id;
  const q = state.pathKey ? `?path=${encodeURIComponent(state.pathKey)}` : "";
  const m = await api(`/api/students/${sid}/modes${q}`).catch(() => null);
  if (!m || state.student?.id !== sid) return null; // medtem zamenjan profil
  state.modes = m;
  setCardsDue(m.cardsDue);
  const badge = $('#modebar [data-mode="review"] .badge');
  badge.hidden = !m.reviewBacklog;
  badge.textContent = m.reviewBacklog;
  badge.title = t("mode.reviewBadge", { n: m.reviewBacklog });
  const daily = $('#modebar [data-mode="daily"]');
  if (!daily) return m;
  daily.classList.toggle("done", m.daily.done);
  daily.title = m.daily.done ? t("daily.doneTitle") : m.daily.open ? t("daily.continue") : t("daily.about");
  return m;
}

// Število kartic za ponavljanje, ki so danes na vrsti (značka na gumbu »Kartice«).
function setCardsDue(n) {
  const b = $('#modebar [data-mode="cards"] .badge');
  if (!b || n === undefined) return;
  b.hidden = !n;
  b.textContent = n;
  b.title = t("cards.dueN", { n });
}

function setActiveMode(mode) {
  document.querySelectorAll("#modebar [data-mode]").forEach((b) => b.classList.toggle("active", b.dataset.mode === mode));
}

const REVIEW_HINT_KEY = "evklid.reviewHint";
async function goNew({ skipHint = false } = {}) {
  const m = (await refreshModes()) || state.modes;
  setActiveMode("new");
  let shown = null;
  try {
    shown = localStorage.getItem(REVIEW_HINT_KEY);
  } catch {}
  const today = new Date().toISOString().slice(0, 10);
  if (!skipHint && m?.suggestReview && shown !== today) {
    try {
      localStorage.setItem(REVIEW_HINT_KEY, today);
    } catch {}
    showView("topic");
    $("#topic-content").innerHTML = `<div class="card suggest">
      <h2>${icon("repeat")} ${t("suggest.title")}</h2>
      <p>${t("suggest.text", { n: m.reviewBacklog })}</p>
      <div class="actions"><button class="primary" id="sg-review">${t("suggest.yes")}</button><button id="sg-new">${t("suggest.no")}</button></div>
    </div>`;
    $("#sg-review").addEventListener("click", () => startSession("review", { quick: true }));
    $("#sg-new").addEventListener("click", () => goNew({ skipHint: true }));
    return;
  }
  if (!m?.newTopic) {
    showView("path");
    toast(t(isUni(state.student.settings) ? "path.allDoneToast" : "path.allDoneSchool"), "trophy");
    return;
  }
  const pretest = await openTopic(m.newTopic.id);
  // Stran ostane na vrhu (razlaga teme); naloga čaka spodaj brez samodejnega fokusa.
  if (m.newTopic.practice && !pretest) await nextPractice({ stay: true });
}

async function showTestPrep(edit = false) {
  setActiveMode("test");
  const { plan } = await api(`/api/students/${state.student.id}/test-plan`);
  showView("topic");
  const box = $("#topic-content");
  if (plan && !edit && plan.daysLeft >= 0) {
    const when = plan.daysLeft === 0 ? t("test.today") : plan.daysLeft === 1 ? t("test.tomorrow") : t("test.inDays", { n: plan.daysLeft });
    box.innerHTML = `<h1 class="with-icon">${icon("clipboard-check")} ${t("mode.test")}</h1>
      <div class="card"><p>${t("test.when", { when, date: escapeHtml(new Date(plan.date).toLocaleDateString(locale())) })}</p>
      <p class="muted">${t("test.material", { list: (plan.subject && state.pathSubject && plan.subject !== state.pathSubject ? `${escapeHtml(SUBJECT_NAMES[plan.subject] || plan.subject)} – ` : "") + plan.unitTitles.map(escapeHtml).join(", ") })}</p>
      <p class="muted">${t("test.howto")}</p>
      <div class="actions"><button class="primary" id="tp-start">${t("test.startToday")}</button><button id="tp-edit">${t("common.change")}</button></div></div>`;
    $("#tp-start").addEventListener("click", () => startSession("test-prep"));
    $("#tp-edit").addEventListener("click", () => showTestPrep(true));
    return;
  }
  const p = await api(`/api/students/${state.student.id}/path?key=${encodeURIComponent(state.pathKey || "")}`);
  const today = new Date().toISOString().slice(0, 10);
  const chosen = new Set(plan?.path === p.key ? plan.units : []);
  box.innerHTML = `<h1 class="with-icon">${icon("clipboard-check")} ${t("mode.test")}</h1>
    <form id="tp-form" class="card">
      <p><b>${t("test.which")}</b> <span class="muted">(${escapeHtml(p.label || "")})</span></p>
      <div class="tp-units">${p.units
        .map((u, i) =>
          u.hasPractice
            ? `<label class="check"><input type="checkbox" name="unit" value="${i}" ${chosen.has(i) ? "checked" : ""}> ${escapeHtml(u.title)}</label>`
            : "",
        )
        .join("")}</div>
      <p><label><b>${t("test.date")}</b><br><input type="date" name="date" min="${today}" value="${plan?.date && plan.date >= today ? plan.date : ""}" required></label></p>
      <div class="actions"><button class="primary">${t("test.saveStart")}</button>${plan ? `<button type="button" id="tp-del">${t("test.remove")}</button>` : ""}</div>
      <div id="tp-err" class="muted"></div>
    </form>`;
  $("#tp-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const units = f.getAll("unit").map(Number);
    if (!units.length) return ($("#tp-err").textContent = t("test.pickUnit"));
    try {
      await api(`/api/students/${state.student.id}/test-plan`, { method: "POST", body: { path: p.key, units, date: f.get("date") } });
      startSession("test-prep");
    } catch (err) {
      $("#tp-err").textContent = err.message;
    }
  });
  $("#tp-del")?.addEventListener("click", async () => {
    await api(`/api/students/${state.student.id}/test-plan`, { method: "DELETE" });
    showTestPrep(true);
  });
}

document.querySelectorAll("#modebar [data-mode]").forEach((b) =>
  b.addEventListener("click", () => {
    if (!state.student) return;
    const mode = b.dataset.mode;
    if (mode === "new") goNew();
    else if (mode === "review") startSession("review");
    else if (mode === "test") showTestPrep();
    else if (mode === "daily") startSession("daily", { path: state.pathKey });
    else if (mode === "cards") showView("cards");
  }),
);

async function loadPath(key = state.pathKey) {
  // Šola (OŠ/SŠ): učna pot je vedno za razred/letnik iz profila; nižje razrede ima Učbenik (j, 1. 11.).
  // Fakulteta: izbira med predmeti študijskega programa ostane.
  const uni = isUni(state.student.settings);
  const q = uni && key ? `?key=${encodeURIComponent(key)}` : "";
  const p = await api(`/api/students/${state.student.id}/path${q}`);
  const content = $("#path-content");
  if (uni) await loadPrograms(api);
  const sys = state.student.settings.school_system || "SI";
  const paths = await api(uni ? `/api/paths?program=${encodeURIComponent(state.student.settings.study_program)}` : `/api/paths?subject=${state.student.settings.subject}&system=${encodeURIComponent(sys)}`);
  const pathName = (x) => escapeHtml(x.label.replace(/ \((?:UL|UM|UP|UNG) [A-Z]+\)$/, ""));
  const opt = (x) => `<option value="${x.key}" ${x.key === p.key ? "selected" : ""}>${pathName(x)}${uni && x.key === p.defaultKey ? t("path.mySubject") : ""}</option>`;
  const own = uni ? null : paths.find((x) => x.key === p.key);
  $("#path-select").innerHTML = uni
    ? [1, 2, 3, 4, null]
        .map((y) => paths.filter((x) => x.year === y))
        .filter((list) => list.length)
        .map((list) => `<optgroup label="${list[0].year ? t("path.year", { n: list[0].year }) : t("path.electives")}">${list.map(opt).join("")}</optgroup>`)
        .join("")
    : own
      ? opt(own)
      : "";
  $(".path-head").classList.toggle("fixed", !uni);
  // Napis v jeziku učenca: »Matematika, 2. letnik« → »Mathematics, Year 2« (oznaka poti s strežnika je slovenska).
  const lvl = /^(.+), (\d+\. (?:razred|letnik).*)$/.exec(own?.label || "");
  $("#path-level").textContent = lvl ? [SUBJECT_NAMES[own.subject] || lvl[1], levelLabel(lvl[2])].join(document.documentElement.dir === "rtl" ? "، " : ", ") : own?.label || p.label || "";
  // Povezava na Učbenik, kadar so pred to potjo nižji razredi/letniki istega predmeta
  // (ali kadar za to raven poti še ni, a ima predmet druge poti).
  $("#path-lower").hidden = uni || (own ? paths.indexOf(own) < 1 : !paths.length);
  if (!p.key) {
    content.innerHTML = `<p class="muted">${escapeHtml(p.message)}</p>`;
    return;
  }
  const changed = state.pathKey !== p.key;
  state.pathKey = p.key;
  state.pathSubject = paths.find((x) => x.key === p.key)?.subject || state.student.settings.subject;
  if (changed) refreshModes(); // fakulteta: drug predmet iz seznama poti
  showLevelCard();
  renderStageHome();
  syncOfflineBanner();
  // Naloge za vadbo brez povezave (enkrat na dan, v ozadju).
  if (!p.offline) refreshPack(api, state.student.id, p.key).then(syncOfflineBanner);
  // Fakulteta: vir predmetnika in opozorilo, da je osnutek.
  const prog = uni ? programsCache().find((x) => x.id === state.student.settings.study_program) : null;
  // OŠ 1.–5. razred: učne poti še ni, prikažemo snov 6. razreda (igre in inštruktor so prilagojeni razredu).
  const st = state.student.settings;
  const early = !prog && !isRegional(sys) && jeOs(st) && /^[1-5]\./.test(String(st.curriculum_level || "").trim());
  $("#path-note").hidden = !prog && !isRegional(sys) && !early;
  if (early) $("#path-note").textContent = t("path.earlyNote", { grade: levelLabel(st.curriculum_level) });
  // Regijski šolski sistem: učna pot je preslikana na snov te države (osnutek).
  if (!prog && isRegional(sys)) $("#path-note").textContent = t("path.regionNote", { system: SCHOOL_SYSTEMS[sys].name });
  $("#lang-note").hidden = currentLang() === "sl" || isRegional(sys);
  if (prog) {
    $("#path-note").innerHTML = `${t(prog.degree === "EMŠ" ? "path.emsNote" : "path.uniNote", { faculty: escapeHtml(prog.facultyName), program: escapeHtml(prog.name), year: escapeHtml(prog.sourceYear || "") })} ${prog.source ? `<a href="${escapeHtml(prog.source)}" target="_blank" rel="noopener">${t("path.uniSource")}</a>.` : ""}`;
  }
  renderGoal();
  const x = p.xp;
  const done = state.modes?.daily?.done;
  $("#xp-card").innerHTML = `
    <div class="hero">
      <div class="hero-icon">${icon("zap")}</div>
      <div class="hero-text"><h2>${t("daily.title")}</h2><p>${done ? t("daily.doneText") : t("daily.text")}</p></div>
      <button class="primary big" data-daily>${done ? t("daily.again") : t("daily.start")}</button>
    </div>
    ${
      p.next
        ? `<button class="next-row" data-open="${p.next.id}"><span class="eyebrow">${t("path.next")}</span><span class="next-name">${escapeHtml(p.next.name)}</span>${icon("chevron-right")}</button>`
        : `<div class="next-row done">${icon("trophy")}<span class="next-name">${t("path.allDone")}</span></div>`
    }
    ${gamesOn(state.student.settings) ? `<button type="button" class="next-row dz-path-row" data-dnevna><span class="eyebrow">${t("dz.title")}</span><span class="next-name">${t("dz.statusNew")}</span>${icon("puzzle")}</button>` : ""}
    <div class="xp-stats">${xpStatsHtml(x)}</div>`;
  // Dnevna uganka (public/games/daily.js): stanje v ozadju; rešena danes → niz dni.
  if (gamesOn(state.student.settings)) {
    const sid = state.student.id;
    api(`/api/students/${sid}/daily`)
      .then((d) => {
        const el = $("#xp-card .dz-path-row .next-name");
        if (el && state.student?.id === sid && d?.streak?.today) el.textContent = t("dz.streak", { n: d.streak.days });
      })
      .catch(() => {});
  }

  content.innerHTML =
    `<div class="legend">${["mastered", "learning", "due"].map((k) => `<span class="lg ${k}">${icon(NODE[k][0])}${NODE[k][1]}</span>`).join("")}</div>` +
    p.units
      .map((u, ui) => {
        const rel = u.topics.filter((t) => t.practice).length ? u.topics.filter((t) => t.practice) : u.topics;
        const nDone = rel.filter((t) => t.status === "mastered").length;
        const pct = Math.round(u.progress * 100);
        return `<section class="unit card ${u.ahead ? "ahead" : ""} ${u.mastered ? "mastered" : ""}">
        <div class="unit-head">
          <div class="ring" style="--p:${pct}">${u.mastered ? icon("award") : `<span>${pct}%</span>`}</div>
          <div class="unit-title"><span class="eyebrow">${t("unit.label", { n: ui + 1 })}</span><h2>${escapeHtml(u.title)}</h2>
            <span class="muted">${u.suggest ? t("unit.aheadNote", { unit: `<bdi>${escapeHtml(u.suggest.unit)}</bdi>` }) : t("unit.progress", { done: nDone, total: rel.length })}</span></div>
        </div>
        <ol class="path">
          ${u.topics
            .map((tp) => {
              const st = tp.due ? "due" : tp.status;
              const isNext = p.next && p.next.id === tp.id;
              const sub = NODE[st][1] + (tp.practice && tp.status === "learning" ? ` · ${LEVEL_NAMES[tp.level]}` : "");
              return `<li><button class="node ${st} ${isNext ? "current" : ""}" data-open="${tp.id}">
                <span class="node-dot">${icon(NODE[st][0])}</span>
                <span class="node-text"><span class="node-name">${escapeHtml(tp.name)}</span><span class="node-sub">${isNext ? t("node.nextPrefix") : ""}${sub}</span></span>
              </button></li>`;
            })
            .join("")}
        </ol>
        <div class="unit-actions">
          ${u.hasPractice && u.started ? `<button class="secondary small" data-unit="${ui}">${icon("puzzle")}${t("unit.practice")}</button>` : ""}
          ${u.hasPractice && !u.mastered ? `<button class="secondary small" data-placement="${ui}">${icon("target")}${u.ahead ? t("unit.skipTest") : t("unit.test")}</button>` : ""}
        </div>
      </section>`;
      })
      .join("") +
    greekFactHtml("gr-path");
  wireGreekFacts(content);
  if (!maybeTour.done) {
    maybeTour.done = true;
    maybeTour();
  }
}

$("#path-select").addEventListener("change", (e) => loadPath(e.target.value));
$("#path-lower").addEventListener("click", () => {
  openTextbookLower();
  showView("textbook");
});
document.addEventListener("click", (e) => {
  const open = e.target.closest("[data-open]");
  if (open && !open.disabled) {
    setBack(open.closest("#view-competition") ? "competition" : open.closest("#view-exams") ? "exams" : open.closest("#view-path") ? "path" : state.backTo || "path");
    openTopic(open.dataset.open);
  }
  const pl = e.target.closest("[data-placement]");
  if (pl) startSession("placement", { path: state.pathKey, unit: Number(pl.dataset.placement) });
  const un = e.target.closest("[data-unit]");
  if (un) startSession("unit-practice", { path: state.pathKey, unit: Number(un.dataset.unit) });
  if (e.target.closest("[data-daily]")) startSession("daily", { path: state.pathKey });
  if (e.target.closest("[data-dnevna]")) {
    showView("games");
    loadGames().then((m) => m.openDailyPuzzle()).catch(() => {});
  }
  const rw = e.target.closest("[data-reward]");
  if (rw) {
    showView("games");
    loadGames().then((m) => m.openReward(rw.dataset.reward.split(","))).catch(() => null);
  }
});
$("#back-to-path").addEventListener("click", () => showView(state.backTo || "path"));
// Tekmovanja so za osnovno in srednjo šolo; fakulteta zavihka nima.
// Šolski sistemi zunaj Slovenije: isti zavihek je »Izpiti« (SAT, gaokao, JEE, NEET, CBSE …).
// Sporočilo preverjanja: slovensko besedilo s strežnika, v drugih jezikih prevod po kodi.
const fbText = (r) => (r.code && currentLang() !== "sl" ? t(r.code, r.params || {}) : r.message);
// Slovenski učenci OŠ in SŠ imajo NPZ in maturo v svojem razdelku (#view-exams, zavihek »NPZ in matura«).
const regionalExams = () => !!state.student && isRegional(state.student.settings.school_system);
const siExams = () => !!state.student && !regionalExams() && Object.hasOwn(SI_EXAMS, state.student.settings.educational_track || "");
// Izpitni naslovi (trening, poskusni izpit, rezultat): regijski »Izpiti« ali serija iz razdelka »NPZ in matura«.
const examMode = () => regionalExams() || state.backTo === "exams";
const prepLabel = () => (regionalExams() ? t("nav.exams") : t("nav.competition"));
const prepBack = () => (examMode() ? t("exam.back") : t("result.toCompetitions"));
// Telefon: četrto mesto po cilju (public/goal-data.js → goalTabbarView): »NPZ« ali »Matura«, ko je cilj NPZ ali
// matura, sicer Tekmovanja (regijski sistemi: Izpiti). Laboratorij je od 4. 11. v »Uči se«, zato ga tu ni več; drugi od
// obeh je vrstica pod Jaz. Fakulteta tekmovanj nima: spodnja vrstica ima takrat štiri zavihke.
const tabbarFourth = () => (state.student ? goalTabbarView(state.student.settings, { siExams: siExams() }) : null);
function offTabbarViews() {
  if (!state.student) return [];
  const v = tabbarFourth();
  return v === "exams" ? ["competition"] : siExams() ? ["exams"] : [];
}
const meBackHtml = () => `<button type="button" class="ghost back me-back">${icon("arrow-left")}<span>${t("nav.me")}</span></button>`;
// »Skrij igre« (nastavitev profila games: off): brez zavihka, vrstice pod Jaz in koraka v uvodnem ogledu.
function syncGamesTab() {
  const off = !!state.student && !gamesOn(state.student.settings);
  document.querySelectorAll('.tab[data-view="games"], [data-go="games"]').forEach((el) => (el.hidden = off));
}
// Igre so se pravkar skrile (Nastavitve, inštruktor, menjava profila): odprto okno se zapre, glavni pogled gre na Jaz.
function leaveHiddenGames() {
  if (!state.student || gamesOn(state.student.settings)) return;
  if (isFloating("games")) closeWindow("games");
  if (currentView === "games") showView("me");
}
function syncCompetitionTab() {
  syncGamesTab();
  const noComp = !state.student || isUni(state.student.settings);
  $("#competition-tab").hidden = noComp;
  $("#exams-tab").hidden = !siExams();
  const span = $("#competition-tab").querySelector("span");
  span.dataset.i18n = regionalExams() ? "nav.exams" : "nav.competition";
  span.textContent = prepLabel();
  $("#competition-tab").querySelector("i, svg").outerHTML = icon(regionalExams() ? "clipboard-check" : "medal");
  const m = $("#competition-tab-m");
  const fourth = tabbarFourth();
  const exams = fourth === "exams";
  m.hidden = !fourth || (!exams && noComp);
  m.dataset.view = exams ? "exams" : "competition";
  const ms = m.querySelector("span");
  // Na ozki spodnji vrstici kratko: »NPZ« v OŠ, »Matura« v SŠ (zgoraj »NPZ in matura«).
  const short = jeOs(state.student?.settings) ? "goal.npz" : "goal.matura";
  const mKey = exams ? short : regionalExams() ? "nav.exams" : "nav.competition";
  ms.dataset.i18n = mKey;
  ms.textContent = t(mKey);
  m.querySelector("i, svg").outerHTML = icon(exams || regionalExams() ? "clipboard-check" : "medal");
  m.classList.toggle("active", currentView === m.dataset.view);
  $("#me-exams").hidden = !siExams() || exams;
  $("#me-competition").hidden = noComp || !exams; // Tekmovanja so pod Jaz le, ko je na četrtem mestu NPZ ali matura
  // Regijski sistemi: isti vnos pod Jaz je »Izpiti« (pogled competition naloži loadExams).
  const mc = $("#me-competition");
  const [mb, msub] = mc.querySelectorAll("b, small");
  mb.dataset.i18n = regionalExams() ? "nav.exams" : "nav.competition";
  mb.textContent = prepLabel();
  msub.dataset.i18n = regionalExams() ? "exam.title" : "comp.meSub";
  msub.textContent = t(msub.dataset.i18n);
  mc.querySelector(".ic").innerHTML = icon(regionalExams() ? "clipboard-check" : "medal");
}
// Gumb »nazaj« na temi oziroma pri seriji nalog vodi tja, od koder je učenec prišel.
function setBack(view) {
  state.backTo = view;
  $("#back-to-path").innerHTML = `${icon("arrow-left")}${view === "competition" ? prepLabel() : view === "exams" ? t("nav.examsSi") : t("nav.path")}`;
}

async function openTopic(topicId) {
  const tp = await api(`/api/topic?id=${encodeURIComponent(topicId)}&lang=${encodeURIComponent(state.student?.settings?.language || "")}`);
  state.topic = tp;
  state.topicFx = true;
  showView("topic");
  // Pogled teme se drsi sam in si zapomni mesto: nova tema se vedno odpre na vrhu (»Nova snov« drugič, #view-topic).
  const vt = $("#view-topic");
  if (vt) vt.scrollTop = 0;
  const units = (await api(`/api/students/${state.student.id}/path?key=${encodeURIComponent(tp.path)}`)).units;
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
    out = await api(`/api/students/${state.student.id}/practice/next`, { method: "POST", body: { topic_id: state.topic.id } });
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
  let cfg = SESSIONS[kind];
  // Izpiti (zunaj Slovenije): isti mehanizem, a z izpitnimi naslovi.
  if (examMode() && kind === "tek") cfg = { ...cfg, icon: "target", title: t("exam.train"), intro: t("exam.trainText") };
  if (examMode() && kind === "contest") cfg = { ...cfg, title: t("exam.mock"), intro: t("exam.mockIntro") };
  setActiveMode({ review: "review", daily: "daily", "test-prep": "test" }[kind] || null);
  if (kind === "review" && state.pathKey) body = { path: state.pathKey, ...body }; // le izbrani predmet
  let out;
  try {
    out = await api(`/api/students/${state.student.id}/${cfg.endpoint || kind}`, { method: "POST", body });
  } catch (err) {
    toast(err.message);
    return;
  }
  state.topicFx = false; // naloge serije niso iz odprte teme
  if (kind !== "tek" && kind !== "contest") setBack("path");
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
    return;
  }
  renderTask(out.task, { mode: cfg.mode, index: out.index, total: out.total });
}

function sessionDoneCard(mode, n, xp = null) {
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

// Slike pri nalogah: graf premice in številska premica. Barve so enake v svetlem
// in temnem načinu (risba je na belem »listu«).
let figSeq = 0;
function figureSvg(f) {
  if (f.type === "line") return lineFigure(f);
  if (f.type === "numberline") return numberLineFigure(f);
  return "";
}

function lineFigure(f) {
  const id = `fig${++figSeq}`;
  const R = 6, S = 28, P = 22; // polmer mreže, velikost enote, rob
  const W = 2 * R * S + 2 * P;
  const X = (x) => P + (x + R) * S, Y = (y) => P + (R - y) * S;
  let g = "", nums = "";
  for (let i = -R; i <= R; i++) {
    g += `<line x1="${X(i)}" y1="${Y(-R)}" x2="${X(i)}" y2="${Y(R)}"/><line x1="${X(-R)}" y1="${Y(i)}" x2="${X(R)}" y2="${Y(i)}"/>`;
    if (i && Math.abs(i) < R) {
      nums += `<text x="${X(i)}" y="${Y(0) + 17}" text-anchor="middle">${i < 0 ? "−" + -i : i}</text>`;
      nums += `<text x="${X(0) - 7}" y="${Y(i) + 4}" text-anchor="end">${i < 0 ? "−" + -i : i}</text>`;
    }
  }
  const f0 = (x) => f.k * x + f.n;
  // Do tri točke s celimi koordinatami blizu izhodišča; dotik pokaže koordinate.
  const pts = [];
  for (let x = -R + 1; x < R; x++) if (Math.abs(f0(x)) < R) pts.push(x);
  pts.sort((a, b) => Math.abs(a) + Math.abs(f0(a)) - (Math.abs(b) + Math.abs(f0(b))));
  const shown = pts.slice(0, 3).sort((a, b) => a - b);
  const ptsSvg = shown
    .map((x) => {
      const y = f0(x);
      const right = X(x) < W - 90;
      return `<g class="fig-pt" tabindex="0" role="button" aria-label="${t("task.pointAria", { x, y })}">
        <circle cx="${X(x)}" cy="${Y(y)}" r="14" class="hit"/><circle cx="${X(x)}" cy="${Y(y)}" r="6.5" class="dot"/>
        <text x="${X(x) + (right ? 12 : -12)}" y="${Y(y) - 10}" text-anchor="${right ? "start" : "end"}" class="coord">(${x}, ${y})</text></g>`;
    })
    .join("");
  return `<figure class="fig"><svg viewBox="0 0 ${W} ${W}" role="img" aria-label="${t("task.graphAria")}">
    <defs><marker id="${id}a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="arrow"/></marker>
      <clipPath id="${id}c"><rect x="${X(-R)}" y="${Y(R)}" width="${2 * R * S}" height="${2 * R * S}"/></clipPath></defs>
    <rect x="0" y="0" width="${W}" height="${W}" rx="14" class="paper"/>
    <g class="grid">${g}</g>
    <line x1="${X(-R)}" y1="${Y(0)}" x2="${X(R) + 12}" y2="${Y(0)}" class="axis" marker-end="url(#${id}a)"/>
    <line x1="${X(0)}" y1="${Y(-R)}" x2="${X(0)}" y2="${Y(R) - 12}" class="axis" marker-end="url(#${id}a)"/>
    <g class="nums">${nums}<text x="${X(0) - 7}" y="${Y(0) + 17}" text-anchor="end">0</text></g>
    <text x="${X(R) + 6}" y="${Y(0) - 10}" class="axis-name">x</text><text x="${X(0) + 10}" y="${Y(R) - 4}" class="axis-name">y</text>
    <line clip-path="url(#${id}c)" x1="${X(-R - 1)}" y1="${Y(f0(-R - 1))}" x2="${X(R + 1)}" y2="${Y(f0(R + 1))}" class="plot"/>
    ${ptsSvg}</svg>
    <figcaption>${icon("info")} ${t("task.tapPoint")}</figcaption></figure>`;
}

function numberLineFigure(f) {
  const id = `fig${++figSeq}`;
  const S = 40, P = 26, from = f.x0 - 5, to = f.x0 + 5;
  const W = (to - from) * S + 2 * P, H = 84, Y = 40;
  const X = (x) => P + (x - from) * S;
  let ticks = "";
  for (let x = from; x <= to; x++) {
    ticks += `<line x1="${X(x)}" y1="${Y - 7}" x2="${X(x)}" y2="${Y + 7}" class="tick"/><text x="${X(x)}" y="${Y + 28}" text-anchor="middle" class="${x === f.x0 ? "strong" : ""}">${x < 0 ? "−" + -x : x}</text>`;
  }
  const end = f.dir < 0 ? P - 8 : W - P + 8;
  return `<figure class="fig wide"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${t("task.lineAria")}">
    <defs><marker id="${id}a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="arrow"/></marker>
      <marker id="${id}b" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="ray-arrow"/></marker></defs>
    <rect x="0" y="0" width="${W}" height="${H}" rx="14" class="paper"/>
    <line x1="${P - 14}" y1="${Y}" x2="${W - P + 14}" y2="${Y}" class="axis" marker-end="url(#${id}a)"/>
    ${ticks}
    <line x1="${X(f.x0)}" y1="${Y}" x2="${end}" y2="${Y}" class="ray" marker-end="url(#${id}b)"/>
    <circle cx="${X(f.x0)}" cy="${Y}" r="8" class="${f.closed ? "closed" : "open"}"/></svg></figure>`;
}

// Dotik točke na grafu pokaže ali skrije njene koordinate.
document.addEventListener("click", (e) => e.target.closest(".fig-pt")?.classList.toggle("show"));
document.addEventListener("keydown", (e) => {
  if ((e.key === "Enter" || e.key === " ") && e.target.closest?.(".fig-pt")) {
    e.preventDefault();
    e.target.closest(".fig-pt").classList.toggle("show");
  }
});

// Na širokem zaslonu je med serijo nalog desno razlaga teme trenutne naloge (ne pri preizkusu znanja in tekmovanju).
const SIDE_MODES = ["review", "daily", "unit", "test", "tek"];
const topicCache = new Map();
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
function choiceHtml(task, o, fx = true) {
  if (task.optionsTex) return renderMath(o, false, fx);
  const s = String(o);
  if (!s.includes("$")) return escapeHtml(s);
  return s.split(/(\$[^$]+\$)/).map((p) => (/^\$[^$]+\$$/.test(p) ? renderMath(p.slice(1, -1), false, fx) : escapeHtml(p))).join("");
}

function renderTask(task, ctx) {
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
      (task.answerType === "coefficients" ? t("task.phCoef") : task.unit ? t("task.phUnit", { unit: task.unit }) : t("task.phResult"));
    input = `<form class="answer-row"><input id="answer" autocomplete="off" autocapitalize="off" spellcheck="false" inputmode="${task.answerType === "number" && !task.unit ? "decimal" : "text"}" placeholder="${escapeHtml(ph)}"><button type="button" class="pad-open-btn secondary" title="${t("task.writeTitle")}">${icon("pencil")}<span>${t("task.write")}</span></button><button class="primary">${t("task.check")}</button></form>`;
  }
  const calcBtn = ["contest", "placement", "pretest"].includes(ctx.mode) ? "" : `<button type="button" class="ghost task-calc icon-only" title="${escapeHtml(t("nav.graph"))}" aria-label="${escapeHtml(t("nav.graph"))}">${icon("calculator")}</button>`;
  const bar = ctx.mode === "contest" ? `<div class="contest-bar"><span id="contest-timer" class="contest-timer" role="timer">${icon("timer")}<b>${leftText(state.contestDeadline)}</b></span><span class="muted">${t("comp.timerNote")}</span></div>` : "";
  const penalty = ctx.mode === "contest" && task.penalty ? `<span class="pts neg">${t("exam.penaltyPts", { n: String(task.penalty).replace("-", "−") })}</span>` : "";
  const hintLadder = task.hintSteps > 0 && !["contest", "placement", "pretest"].includes(ctx.mode);
  const pretestHead =
    ctx.mode === "pretest" ? `<div class="card pretest-head"><h2 class="with-icon">${icon("target")} ${t("pretest.title")}</h2><p class="muted">${t("pretest.intro")}</p>${ctx.note ? `<p class="pretest-note with-icon" role="status">${icon(ctx.note.icon)}<span>${escapeHtml(ctx.note.text)}</span></p>` : ""}</div>` : "";
  box.innerHTML = `${bar}${pretestHead}<div class="card task${["contest", "placement", "pretest"].includes(ctx.mode) ? " no-fx" : ""}">
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
      <textarea class="work-text" rows="3" spellcheck="false" placeholder="${escapeHtml(t("task.workPh"))}"></textarea>
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
    ${offTabbarViews().includes("competition") ? meBackHtml() : ""}
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
  if (e.target.closest("[data-comp-train]")) {
    setBack(prep);
    startSession("tek", { path: key });
  }
  if (e.target.closest("[data-comp-contest]")) {
    setBack(prep);
    startSession("contest", { path: key });
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
  const name = siExamName(c.exam);
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

async function loadExams(key = state.examKey, exam = null) {
  const si = siExams();
  const box = si ? $("#exams-content") : $("#competition-content");
  const q = key ? `?key=${encodeURIComponent(key)}` : exam ? `?exam=${encodeURIComponent(exam)}` : "";
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
    ${offTabbarViews().includes(si ? "exams" : "competition") ? meBackHtml() : ""}
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
          <p class="muted">${t("exam.mockText", { tasks: m.tasks, choice: m.choice, minutes: m.minutes, max: m.maxPoints })}</p>
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
  const level = /VR/.test(String(s.curriculum_level || "")) ? "VR" : "OR";
  mountPapers(slot, papers, { track: s.educational_track, exam: c.exam, subject: c.subject, level }, {
    subjectName: (k) => SUBJECT_NAMES[k] || k,
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
async function openOurs(entry, subjectName) {
  if (!entry?.ours || paperBusy) return;
  paperBusy = true;
  try {
    const paper = await api(`/api/exam-papers/ours/${encodeURIComponent(entry.id)}`);
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
    const strip = (md) => String(md || "").replace(/<svg[\s\S]*?<\/svg>/g, "").trim();
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
// Prenesena pola ostane v pomnilniku (ta seja, ta učenec): po »Pomoč pri tej nalogi« jo »Odpri preneseno polo« pri isti
// poli odpre znova pri isti strani, brez ponovne izbire datoteke. Zapiranje pole ali menjava profila jo pozabi.
let keptPaper = null;
function openLocalPaper(entry, file, subjectName, page = 0) {
  const key = paperLabel(entry, subjectName);
  const sid = state.student.id;
  openPaperViewer(file, {
    title: key,
    page,
    onClose: () => (keptPaper = null),
    onHelp: (task) => {
      keptPaper = { sid, key, file, page: task.page };
      paperTask(entry, subjectName, task);
    },
  });
}
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

document.addEventListener("click", async (e) => {
  if (!e.target.closest("#view-exams")) return;
  const edit = e.target.closest("[data-er-edit]");
  if (edit) {
    $("#view-exams .er-form").hidden = false;
    edit.closest(".er-when").hidden = true;
    return $("#er-date").focus();
  }
  if (e.target.closest("[data-er-save]")) {
    const date = $("#er-date").value;
    if (!validDate(date)) return $("#er-date").focus();
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

$("#weak-sheet")?.addEventListener("click", () => {
  const msg = $("#weak-sheet-msg");
  msg.hidden = true;
  openPrintable(`/api/students/${state.student.id}/gradiva/delovni-list?sibke=1`, (m) => {
    msg.textContent = m;
    msg.hidden = false;
  });
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

// ---------- poraba in lestvica ----------

async function loadUsage() {
  // Poraba je samo za skrbnika: strežnik drugim vrne 403, kartica ostane skrita.
  const card = $("#usage")?.closest(".card");
  const res = await fetch("/api/usage").catch(() => null);
  if (card) card.hidden = !res?.ok;
  if (!res?.ok) return;
  const u = await res.json();
  const eur = (x) => (x || 0).toLocaleString(locale(), { minimumFractionDigits: 2, maximumFractionDigits: x && x < 1 ? 3 : 2 }); // kot števec zgoraj: 3 decimalke le pod 1 €
  const L = u.limits || {};
  $("#usage").innerHTML = `<p>${t("usage.total", { usd: (u.month_usd || 0).toLocaleString(locale(), { minimumFractionDigits: 2, maximumFractionDigits: 2 }) })}${t("usage.eur", { eur: eur(u.month_eur) })}${u.budget_usd ? t("usage.budget", { budget: u.budget_usd.toLocaleString(locale()) }) : ""}${
    u.daily_questions ? t("usage.limit", { n: u.daily_questions }) : ""
  }</p>
  <p>${t("usage.summary", { active: u.active_students, avg: eur(u.per_active_eur), msg: eur(u.per_message_eur), proj: eur(u.projected_eur) })}</p>
  <p class="muted">${t("usage.saved", { count: u.saved_answers || 0 })}</p>
  ${L.daily_deep || L.student_soft_usd || L.student_hard_usd ? `<p class="muted">${t("usage.limits", { deep: L.daily_deep ?? "∞", soft: L.student_soft_usd ?? "∞", hard: L.student_hard_usd ?? "∞" })}</p>` : ""}
  <div class="md-table-wrap"><table class="table"><thead><tr><th>${t("usage.student")}</th><th>${t("usage.calls")}</th><th>${t("usage.savedCol")}</th><th>${t("usage.tokens")}</th><th>${t("usage.cost")}</th></tr></thead><tbody>
  ${u.students
    .map((s) => `<tr><td>${escapeHtml(s.name)}</td><td>${s.calls}</td><td>${s.saved || 0}</td><td>${s.input_tokens} / ${s.output_tokens} / ${s.cache_read_tokens}</td><td>${eur(s.cost_eur)} € <span class="muted">(${(s.cost_usd || 0).toLocaleString(locale(), { minimumFractionDigits: 3, maximumFractionDigits: 3 })} $)</span></td></tr>`)
    .join("")}</tbody></table></div>
  ${(u.by_model || []).length ? `<div class="md-table-wrap"><table class="table"><thead><tr><th>${t("usage.model")}</th><th>${t("usage.calls")}</th><th>${t("usage.tokens")}</th><th>${t("usage.cost")}</th></tr></thead><tbody>
  ${u.by_model
    .map((m) => `<tr><td>${escapeHtml(m.model)} <span class="muted">· ${escapeHtml(m.kind)}</span></td><td>${m.calls}</td><td>${m.input_tokens} / ${m.output_tokens} / ${m.cache_read_tokens}</td><td>${eur(m.cost_eur)} €</td></tr>`)
    .join("")}</tbody></table></div>` : ""}`;
}

// ---------- uvodni ogled ----------

// Vodič ob prvi uporabi (j, 29. 10. 2026): kako aplikacija deluje in kje je kaj. Vsak profil ga
// vidi enkrat (settings.tour_version na strežniku, zato tudi na drugi napravi ne znova).
// Korak brez »sel« je kartica na sredini; korak, katerega gumb ni viden (npr. zavihki, ki so na
// telefonu pod »Jaz«), se preskoči.
const TOUR_VERSION = 2;
const TOUR = [
  { title: "tour.welcome", text: "tour.welcomeText" },
  { title: "tour.how", text: "tour.howText" },
  { sel: "#xp-card", title: "daily.title", text: "tour.dailyText" },
  { sel: "#path-content .unit", title: "nav.path", text: "tour.pathText" },
  { sel: "#modebar", title: "tour.modes", text: "tour.modesText" },
  { sel: '.tab[data-view="uci"]', title: "nav.learn", text: "tour.learnText" },
  { sel: '.tab[data-view="chat"]', title: "nav.chat", text: "tour.chatText" },
  { sel: '.tab[data-view="graph"]', title: "nav.graph", text: "tour.graphText" },
  { sel: '.tab[data-view="competition"]', title: "nav.competition", text: "tour.competitionText" },
  { sel: '.tab[data-view="games"]', title: "nav.games", text: "tour.gamesText" },
  { sel: '.tab[data-view="schedule"]', title: "sch.title", text: "tour.scheduleText" },
  { sel: '.tab[data-view="corner"]', title: "nav.corner", text: "tour.cornerText" },
  { sel: '.tab[data-view="progress"]', title: "nav.progress", text: "tour.progressText" },
  { sel: '.tab[data-view="league"]', title: "nav.league", text: "tour.leagueText" },
  { sel: '.tab[data-view="settings"]', title: "nav.settings", text: "tour.settingsText" },
  { sel: '.tab[data-view="feedback"]', title: "nav.feedbackShort", text: "tour.feedbackText" },
  { sel: '#tabbar [data-view="me"]', title: "nav.me", text: "tour.meText2" },
  { sel: "#profile-btn", title: "tour.profile", text: "tour.profileText" },
  { title: "tour.end", text: "tour.endText" },
];
const TOUR_KEY = "evklid.tour";
const visibleEl = (sel) => [...document.querySelectorAll(sel)].find((el) => el.getClientRects().length && !el.closest("[hidden]"));

function startTour() {
  const box = $("#tour");
  if (!box.hidden) return; // že odprt (npr. »Ponovi ogled« med ogledom)
  // Koraki, ki jih na tem zaslonu lahko pokažemo (števec »3 / 12« potem drži).
  const steps = TOUR.filter((s) => !s.sel || visibleEl(s.sel));
  let i = 0;
  const spot = box.querySelector(".tour-spot");
  const card = box.querySelector(".tour-card");
  const show = () => {
    const step = steps[i];
    const target = step.sel && visibleEl(step.sel);
    if (step.sel && !target) return next();
    card.classList.toggle("center", !target);
    if (target) {
      target.scrollIntoView({ block: "nearest" });
      const r = target.getBoundingClientRect();
      const pad = 6;
      const h = Math.min(r.height, innerHeight * 0.5);
      Object.assign(spot.style, { left: `${r.left - pad}px`, top: `${r.top - pad}px`, width: `${r.width + 2 * pad}px`, height: `${h + 2 * pad}px` });
      const below = r.top + h / 2 < innerHeight / 2;
      card.style.top = below ? `${Math.min(r.top + h + 16, innerHeight - 240)}px` : "auto";
      card.style.bottom = below ? "auto" : `${Math.max(innerHeight - r.top + 16, 16)}px`;
    } else {
      Object.assign(spot.style, { left: "50%", top: "50%", width: "0px", height: "0px" });
      card.style.top = "";
      card.style.bottom = "";
    }
    box.querySelector(".tour-step").textContent = `${i + 1} / ${steps.length}`;
    box.querySelector("#tour-title").textContent = t(step.title);
    box.querySelector(".tour-text").textContent = t(step.text);
    box.querySelector('[data-tour="next"]').textContent = i === steps.length - 1 ? t("tour.start") : t("tour.next");
    box.querySelector('[data-tour="back"]').hidden = i === 0;
    box.querySelector('[data-tour="next"]').focus({ preventScroll: true });
  };
  const end = () => {
    box.hidden = true;
    startTour.end = null;
    document.removeEventListener("keydown", onKey);
    try {
      localStorage.setItem(TOUR_KEY, "done");
    } catch {}
    if (state.student && (state.student.settings?.tour_version || 0) < TOUR_VERSION) {
      state.student.settings = { ...state.student.settings, tour_version: TOUR_VERSION };
      api(`/api/students/${state.student.id}`, { method: "PUT", body: { settings: { tour_version: TOUR_VERSION } } }).catch(() => null);
    }
  };
  const next = () => (++i >= steps.length ? end() : show());
  const back = () => {
    i = Math.max(0, i - 1);
    show();
  };
  const onKey = (e) => {
    if (e.key === "Escape") end();
    else if (e.key === "ArrowRight") next();
    else if (e.key === "ArrowLeft") back();
  };
  box.querySelector('[data-tour="next"]').onclick = next;
  box.querySelector('[data-tour="back"]').onclick = back;
  box.querySelector('[data-tour="skip"]').onclick = end;
  document.addEventListener("keydown", onKey);
  startTour.end = end;
  box.hidden = false;
  show();
}
// Vsak profil vidi vodič enkrat, ob prvi uporabi (tudi star profil, ki je videl le kratek ogled).
function maybeTour() {
  if ((state.student?.settings?.tour_version || 0) >= TOUR_VERSION) return;
  // Vodič šele, ko je vprašalnik kotička zaprt. Če je učenec medtem odprl drug pogled,
  // vodič počaka na naslednjo vrnitev na Učno pot (sicer bi kazal na skrite elemente).
  Promise.resolve(state.interestsAsk).then(() =>
    setTimeout(() => {
      if (currentView === "path" && (state.student?.settings?.tour_version || 0) < TOUR_VERSION) startTour();
      else maybeTour.done = false;
    }, 400),
  );
}
$("#tour-again").addEventListener("click", () => {
  showView("path");
  setTimeout(startTour, 500);
});

// Vodič po aplikaciji (Nastavitve → Pomoč): opis vsakega dela, tapni vrstico in odpre se ta del.
$("#guide-open").addEventListener("click", (e) => {
  const list = $("#guide-list");
  const open = list.hidden;
  if (open) {
    // Ob vsakem odprtju znova: profil določa, kaj obstaja (fakulteta brez tekmovanj, regionalni sistemi imajo Izpite).
    // Nastavitve izpustimo, ker smo že tu.
    const skip = (g) => g.view === "settings" || (g.view === "competition" && (isUni(state.student?.settings) || regionalExams()));
    const row = (g) => {
      const inner = `<span class="ic">${icon(g.icon)}</span><span class="lr-text"><b>${escapeHtml(t(g.title))}</b><small>${escapeHtml(t(g.text))}</small></span>`;
      return g.view ? `<button type="button" class="list-row" data-guide-view="${g.view}">${inner}${icon("chevron-right")}</button>` : `<div class="list-row">${inner}</div>`;
    };
    list.innerHTML = `<p class="muted guide-intro">${escapeHtml(t("guide.intro"))}</p>${GUIDE.filter((g) => !skip(g)).map(row).join("")}`;
  }
  list.hidden = !open;
  e.currentTarget.setAttribute("aria-expanded", String(open));
});
$("#guide-list").addEventListener("click", (e) => {
  const row = e.target.closest("[data-guide-view]");
  if (row?.dataset.guideView) showView(row.dataset.guideView);
});

// ---------- kalkulatorji (public/graph/): znanstveni, grafični, pretvornik enot ----------
// Naložijo se šele ob prvem odprtju. Vsako orodje obstaja enkrat: v zavihku Kalkulator ali
// čez cel zaslon (iz Učne poti, vadnice, naloge in Inštruktorja), z gumbom nazaj.

const CALC_MODES = ["sci", "graph", "tools", "pse", "formulas"];
let calcMode = "sci";
try {
  if (CALC_MODES.includes(localStorage.getItem("evklid.calcMode"))) calcMode = localStorage.getItem("evklid.calcMode");
} catch {}
const calcTools = {};
let calcP = null; // grafični kalkulator
function calcOverlayOpen() {
  return !$("#graph-overlay").hidden;
}
function calcSlot() {
  return calcOverlayOpen() ? $("#graph-overlay-body") : $("#graph-slot");
}

function graphCalc() {
  calcP ||= import("./graph/calc.js").then(({ createCalculator }) => {
    const host = document.createElement("div");
    host.id = "graph-host";
    queueMicrotask(() => makeSplitter(host, splitOpts("gc")));
    return createCalculator(host, {
      t,
      icon,
      locale,
      api,
      toast: (m) => toast(m, "check"),
      storageKey: () => `evklid.graph.${state.student?.id ?? 0}`,
      studentId: () => state.student?.id,
      askTutor: (text) => {
        closeCalcOverlay();
        showView("chat");
        fillInput(text);
      },
    });
  });
  return calcP;
}
// predmet, ki ga učenec trenutno dela (tema v vadnici, sicer nastavitev)
function calcSubject() {
  const id = !$("#view-topic").hidden ? state.topic?.id : null;
  return (id && /^[A-Z]+/.exec(id)?.[0]) || state.student?.settings?.subject || "MAT";
}
// Poglavje, iz katerega je odprt kalkulator (tema učne poti ali pogovor o temi): tipke se mu prilagodijo.
function calcChapter() {
  if (!$("#view-topic").hidden && state.topic?.id) return { id: state.topic.id, unit: state.topic.unit, name: state.topic.name, subject: state.topic.subject };
  if (!$("#view-chat").hidden && state.chatFx?.topic) return state.chatFx.topic;
  return null;
}
function formulaBook() {
  const s = calcSubject();
  const subj = ["MAT", "FIZ", "KEM"].includes(s) ? s : "MAT";
  return `${subj}-${stageCode(state.student?.settings)}`;
}
async function insertIntoCalc(text, o) {
  const tool = await setCalcMode("sci");
  tool.insert(text, o);
}
function calcTool(mode) {
  if (mode === "graph") return graphCalc();
  calcTools[mode] ||= (mode === "sci" ? import("./graph/sci.js") : import("./graph/tools.js")).then((m) => {
    const host = document.createElement("div");
    if (mode === "sci") queueMicrotask(() => makeSplitter(host, splitOpts("sc")));
    const base = { t, icon, locale, onInsert: insertIntoCalc };
    if (mode === "sci")
      return m.createScientific(host, {
        ...base,
        toast: (msg) => toast(msg, "check"),
        chapter: calcChapter,
        storageKey: () => `evklid.sci.${state.student?.id ?? 0}`,
        // »Nariši graf«: isti zaslon, način Grafični z vpisanimi izrazi
        openGraph: async (exprs) => (await setCalcMode("graph"))?.show(exprs),
        // »Po korakih«: zaslon Skeniraj (public/scan/) ima reševalnik po korakih
        canSteps: () => !!document.getElementById("view-scan"),
        // goal: po »Razstavi« pokaže korake razstavljanja, ne poenostavljanja
        steps: async (text, goal) => {
          if (!document.getElementById("view-scan")) return;
          closeCalcOverlay();
          showView("scan");
          (await import("./scan/scan.js")).showScan?.({ text, goal });
        },
      });
    if (mode === "tools") return m.createTools(host, { ...base, subject: calcSubject });
    if (mode === "pse") return m.createPse(host, { ...base, lang: currentLang });
    return m.createFormulas(host, { ...base, api, renderRich, withSymbols: withFormulaSubject, bookKey: formulaBook });
  });
  return calcTools[mode];
}
/** Pokaže izbrano orodje v zavihku ali v prekrivnem oknu. */
async function setCalcMode(mode) {
  if (!CALC_MODES.includes(mode)) mode = "sci";
  calcMode = mode;
  try {
    localStorage.setItem("evklid.calcMode", mode);
  } catch {}
  document.querySelectorAll(".calc-modes [data-calc-mode]").forEach((b) => {
    b.classList.toggle("active", b.dataset.calcMode === mode);
    b.setAttribute("aria-selected", String(b.dataset.calcMode === mode));
  });
  hideKeyboard();
  const tool = await calcTool(mode);
  if (calcMode !== mode) return; // medtem izbran drug način
  // zgodovina in grafi so po učencih: ob menjavi učenca naložimo njegove
  if (tool._student !== state.student?.id) {
    if (tool._student !== undefined) tool.reload?.();
    tool._student = state.student?.id;
  }
  if (mode === "formulas" || mode === "tools") tool.reload();
  if (mode === "sci") tool.adapt?.();
  const slot = calcSlot();
  if (tool.root.parentElement !== slot) slot.replaceChildren(tool.root);
  tool.resize?.();
  return tool;
}
document.querySelectorAll(".calc-modes").forEach((seg) =>
  seg.addEventListener("click", (e) => {
    const b = e.target.closest("[data-calc-mode]");
    if (b) setCalcMode(b.dataset.calcMode);
  }),
);
function showGraph() {
  return setCalcMode(calcMode);
}
/** Odpre kalkulator čez cel zaslon. mode: "sci" | "graph" | "units"; exprs: izrazi za graf. */
async function openCalcOverlay({ mode = calcMode, exprs = [], backLabel = t("nav.back") } = {}) {
  $("#graph-close-label").textContent = backLabel;
  $("#graph-close").setAttribute("aria-label", backLabel);
  if ($("#graph-overlay").hidden) overlayOpened();
  $("#graph-overlay").hidden = false;
  document.body.classList.add("graph-open");
  const tool = await setCalcMode(mode);
  if (mode === "graph" && exprs.length) tool.show(exprs);
  return tool;
}
// združljivost: grafični kalkulator z izrazi (inštruktor, preizkusi)
const openGraphOverlay = (exprs = [], backLabel = t("nav.back")) => openCalcOverlay({ mode: "graph", exprs, backLabel });
function closeCalcOverlay({ fromBack = false } = {}) {
  if (!calcOverlayOpen()) return;
  if (!fromBack) overlayClosed();
  $("#graph-overlay").hidden = true;
  document.body.classList.remove("graph-open");
  hideKeyboard();
  $("#graph-overlay-body").replaceChildren();
  if (!$("#view-graph").hidden) setCalcMode(calcMode);
}
$("#graph-close").addEventListener("click", () => closeCalcOverlay());
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && calcOverlayOpen() && !document.querySelector(".gc-pop:not([hidden])")) closeCalcOverlay();
});
// gumbi »Kalkulator« v Učni poti, vadnici in Inštruktorju
document.querySelectorAll(".calc-open").forEach((b) =>
  b.addEventListener("click", () => {
    // Kalkulator je že v premičnem oknu: okno pride v ospredje (pri kemiji s periodnim sistemom).
    if (isFloating("graph")) {
      focusWindow("graph");
      if (calcSubject() === "KEM") setCalcMode("pse");
      else calcTools.sci?.then((tool) => tool.adapt?.()); // tipke poglavja, iz katerega je odprt
      return;
    }
    const view = document.querySelector("main.view:not([hidden]):not(.in-okno)")?.id;
    const back = view === "view-chat" ? t("nav.chat") : view === "view-path" ? t("nav.path") : t("nav.back");
    // pri kemiji najprej periodni sistem, sicer zadnje uporabljeno orodje (privzeto znanstveni)
    openCalcOverlay({ mode: calcSubject() === "KEM" ? "pse" : calcMode, backLabel: back });
  }),
);
// Enačbe v besedilu (LaTeX) → izrazi za kalkulator. Hiter pregled brez nalaganja modula.
const mayPlot = (text) => /\$[^$]*(?:[xy]\s*(?:=|<|>|\\le|\\ge)|=[^$]*\bx\b)/.test(String(text || "")) && /x/.test(String(text || ""));
async function plotFromText(text) {
  const { plottableFromText } = await import("./graph/math.js");
  return plottableFromText(text);
}
// Gumb »Nariši graf« pod odgovorom inštruktorja, če ta vsebuje funkcijo ali enačbo krivulje.
async function addGraphButton(bubble, text) {
  if (!mayPlot(text) || bubble.querySelector(".graph-btn")) return;
  const exprs = await plotFromText(text);
  if (!exprs.length) return;
  const b = document.createElement("button");
  b.type = "button";
  b.className = "secondary small graph-btn";
  b.innerHTML = `${icon("chart-spline")}<span>${escapeHtml(t("chat.drawGraph"))}</span>`;
  b.addEventListener("click", (e) => {
    e.stopPropagation();
    openGraphOverlay(exprs, t("nav.chat"));
  });
  bubble.append(b);
}

// Za samodejne preizkuse v brskalniku.
window.evklid = { openTopic, showView, openLesson, openGraphOverlay, openCalcOverlay, openZbirke, openWindow, closeWindow, openFromTutor };

// ---------- besedilo naloge vedno vidno (telefon s ploščo za vnos) ----------
// Plošča pomakne nalogo nad sebe (pad.js); če je besedilo naloge višje od prostora nad ploščo,
// se samodejno pokaže v oknu (public/razpri.js), enkrat za nalogo.
function checkTaskFits() {
  if (!document.body.classList.contains("pad-open")) {
    if (fullOpen("task")) closeFull();
    return;
  }
  const text = [...document.querySelectorAll("#view-topic .task .task-text")].filter((x) => x.offsetParent).at(-1);
  if (!text) return;
  const pad = document.getElementById("pad");
  const r = pad && !pad.hidden ? pad.getBoundingClientRect() : null;
  const vh = window.visualViewport?.height || window.innerHeight;
  const bottom = r && r.top > vh * 0.3 ? r.top : vh; // plošča spodaj (telefon pokončno) ali ob strani
  const top = Math.max(0, $(".topbar")?.offsetParent ? $(".topbar").getBoundingClientRect().bottom : 0);
  if (text.offsetHeight <= bottom - top - 24) return;
  showFull({ kind: "task", sig: text.textContent.trim().slice(0, 120), title: t("full.task"), html: text.innerHTML });
}
{
  let timer = 0;
  const later = () => {
    clearTimeout(timer);
    timer = setTimeout(checkTaskFits, 350); // po premiku naloge nad ploščo
  };
  let wasOpen = false;
  new MutationObserver(() => {
    const open = document.body.classList.contains("pad-open");
    if (open !== wasOpen) later();
    wasOpen = open;
  }).observe(document.body, { attributes: true, attributeFilter: ["class"] });
  window.visualViewport?.addEventListener("resize", later);
}

// ---------- premična okna in mehurček inštruktorja (public/okna.js) ----------

// Ukaz inštruktorju »odpri kalkulator«: okno ob klepetu (telefon: spodnji list), kalkulator v pravem načinu.
async function openFromTutor({ view, mode } = {}) {
  if (!document.getElementById(`view-${view}`)) return;
  // Učbenik, Laboratorij, 3D svet: zavihek pogleda »Uči se« (v oknu ali glavnem delu).
  if (UCI_TABS.includes(view)) {
    const sameTab = uciTab() === view;
    setUciTab(view);
    if (isFloating("uci")) focusWindow("uci");
    if (currentView === "uci" || isFloating("uci")) return sameTab || showUci();
    view = "uci";
  }
  const calc = () => view === "graph" && mode && setCalcMode(mode);
  if (currentView === view) return calc();
  if (!windowsOn() || !openWindow(view, { side: "right" })) {
    if (view === "graph") return openCalcOverlay({ mode: mode || calcMode, backLabel: t("nav.chat") });
    return showView(view);
  }
  calc();
}
initOkna({
  showView,
  initView: (name) => (name === "account" ? renderAccount() : initView(name)),
  leaveView: (name) => {
    if (name === "uci") {
      stopReading();
      leaveUci();
    }
    if (name === "scan") leaveScan();
    if (name === "games") leaveGames();
    if (name === "corner") closeBoard();
    if (name === "graph") hideKeyboard();
  },
  // Pogled iz glavnega dela je šel v okno: glavni del pokaže prvi prosti zavihek.
  leaveMain: (name) =>
    showView(["path", "uci", "chat", "graph", "progress", "schedule", "settings"].find((v) => v !== name && !isFloating(v)) || "me"),
  mainView: () => currentView,
  onResize: (name) => name === "graph" && calcTool(calcMode).then((tool) => tool.resize?.()),
  chatInfo: () => {
    const n = document.querySelectorAll("#messages .msg").length;
    const body = document.body.classList;
    return {
      key: state.conversationId && n ? `${state.conversationId}:${n}` : null,
      visible: currentView === "chat" || isFloating("chat"),
      blocked: !state.student || body.contains("onboarding") || body.contains("auth-mode") || !!state.contestTimer || !$("#chat-off").hidden,
    };
  },
  toast: (m) => toast(m, "check"),
});

// Ločnice med deli strani (public/razdelilnik.js, docs/oblikovanje.md »Spreminjanje velikosti delov«):
// širina stranskega dela v px; min/max varujeta, da noben del ni neuporabno ozek.
function splitOpts(name) {
  const base = { label: t("split.resize"), labelKey: "split.resize", hint: t("split.hint"), hintKey: "split.hint" };
  const o = {
    chat: { side: "start", min: 200, max: 480, otherMin: 420, collapse: true },
    path: { side: "start", min: 300, max: 620, otherMin: 420 },
    topic: { side: "end", min: 320, max: 900, otherMin: 400, grid: () => $("#topic-content > .topic-grid, #topic-content > .session-grid") },
    lesson: { side: "end", min: 320, max: 900, otherMin: 400, grid: () => $("#view-textbook > .tb-lesson-grid.has-side") },
    gc: { side: "start", min: 280, max: 640, otherMin: 320, varName: "--gc-panel" },
    sc: { side: "end", min: 320, max: 720, otherMin: 280 },
  }[name];
  return { ...base, key: name, varName: `--split-${name}`, ...o };
}
chatSplit = makeSplitter($("#view-chat"), {
  ...splitOpts("chat"),
  onCollapse: (hidden) => {
    const b = $("#toggle-sidebar");
    const key = hidden ? "split.showList" : "chat.list";
    b.dataset.i18nAria = key;
    b.setAttribute("aria-label", t(key));
    b.title = hidden ? t(key) : "";
    b.setAttribute("aria-expanded", String(!hidden));
  },
});
makeSplitter($("#view-path"), splitOpts("path"));
makeSplitter($("#topic-content"), splitOpts("topic"));
makeSplitter($("#view-textbook"), splitOpts("lesson"));

// Kartica: črke dobijo pomen po predmetu in temi kartice ter po drugi strani kartice (vprašanje ↔ odgovor).
const cardRich = (text, c, other = "") =>
  withFormulaSubject(c?.subject || state.student?.settings?.subject || "MAT", () => renderRich(text), null, [c?.topic, other].filter(Boolean).join("\n"));
initFlashcards({ api, renderRich, cardRich, escapeHtml, toast, showView, getStudent: () => state.student, getPath: () => state.pathKey, subjectName: () => SUBJECT_NAMES[(state.pathKey && state.pathSubject) || state.student?.settings.subject] || "", onDue: setCardsDue });

// Urnik (public/schedule.js): po spremembi se osvežita kartica »Danes imaš …« in Priprava na test.
function scheduleChanged() {
  if (currentView === "schedule") showSchedule();
  renderStageHome();
  refreshModes();
}
initSchedule({ api, escapeHtml, toast, showView, startSession, getStudent: () => state.student, onChange: () => (renderStageHome(), refreshModes()) });

// Začetna stran po stopnji (public/zacetna.js, j 2026-11-01): kartica »Danes imaš …«, kartica stopnje
// (OŠ igre, SŠ matura, faks Moj študij z izpitnimi roki) in vrstni red kartic na Učni poti.
async function renderStageHome() {
  if (!state.student) return;
  const sid = state.student.id;
  await renderScheduleCard($("#schedule-card"));
  if (state.student?.id !== sid) return; // med nalaganjem zamenjan profil
  const level = stopnja(state.student.settings);
  const schedule = lastSchedule(sid);
  const box = $("#stage-card");
  box.innerHTML = stageCardHtml(level, { games: gamesOn(state.student.settings), exams: siExams(), schedule, t, esc: escapeHtml });
  box.hidden = !box.innerHTML;
  uvrstiKartice($("#view-path .path-side"), vrstniRed(level, schedule));
}
$("#stage-card").addEventListener("click", (e) => {
  const go = e.target.closest("[data-home-go]")?.dataset.homeGo;
  if (go) showView(go);
});
// Skeniranje nalog (public/scan/): fotografija ali vpis → rešitev po korakih.
initScan({
  api,
  escapeHtml,
  toast,
  getStudent: () => state.student,
  askTutor: (text) => {
    showView("chat");
    fillInput(text);
  },
  openGraph: (exprs) => openGraphOverlay(exprs, t("scan.nav")),
});
// Laboratorij (public/laboratorij.js): vsi virtualni poskusi; »Odpri temo v učbeniku« odpre lekcijo.
initLab({ api, escapeHtml, getStudent: () => state.student, openLesson });
// Uči se (public/uci-se.js): Učbenik, Laboratorij in 3D svet v enem pogledu; »Vprašaj inštruktorja« iz 3D atlasa.
initUci({
  escapeHtml,
  getStudent: () => state.student,
  showTextbook,
  showLab,
  stopReading,
  askTutor: (text) => {
    showView("chat");
    fillInput(text);
  },
  onOverlay: (open) => (open ? overlayOpened() : overlayClosed()),
});
document.querySelectorAll("[data-open-scan]").forEach((b) => b.addEventListener("click", () => showView("scan")));

initTextbook({
  api,
  renderRich,
  escapeHtml,
  getStudent: () => state.student,
  openTopic,
  nextPractice,
  learnWithTutor,
  showView,
  toast,
  // Iz lekcije: poskus iste teme v zavihku Laboratorij, atlas ali model čez cel zaslon (public/uci-se.js).
  openLab: (key) => {
    openLabExperiment(key);
    showView("lab");
    labFromLesson(); // tipka Nazaj iz poskusa vrne v lekcijo
  },
  open3d,
});

// Gumbi inštruktorja za orodja aplikacije (public/odpri.js).
initOpen({
  t,
  icon,
  escapeHtml,
  renderMath,
  openLesson,
  open3d,
  openGames: (concepts) => {
    showView("games");
    loadGames().then((m) => m.openReward(concepts)).catch(() => null);
  },
  openLab: () => openFromTutor({ view: "lab" }),
  openFormulas: () => openFromTutor({ view: "graph", mode: "formulas" }),
  openGraph: (exprs) => openGraphOverlay(exprs, t("nav.chat")),
});

// ---------- zagon ----------

// Bližnjica z ikone aplikacije (dolg pritisk na ikono): /?pogled=chat odpre Inštruktorja. Iz 3D atlasa (/3d)
// »Vprašaj inštruktorja«: /?pogled=chat&vprasaj=… odpre klepet z vpisanim vprašanjem (pošlje ga učenec sam).
// Pogled »Uči se« z zadnjim zavihkom: ?pogled=uci; določen zavihek: ?pogled=textbook, lab ali 3d.
const START_VIEW = ["chat", "graph", "uci", ...UCI_TABS].find((v) => v === new URLSearchParams(location.search).get("pogled"));
const START_ASK = START_VIEW === "chat" ? (new URLSearchParams(location.search).get("vprasaj") || "").slice(0, 2000) : "";
if (new URLSearchParams(location.search).has("pogled")) history.replaceState(null, "", location.pathname);
initInstall({ toast, onSheet: (open) => (open ? overlayOpened() : overlayClosed()) });
initFullscreen();
initFormulaInfo({ opened: overlayOpened, closed: overlayClosed });

(async () => {
  const cfg = await api("/api/config");
  saveConfig(cfg); // za zagon brez povezave (brez skrbniških zastavic, public/offline.js)
  $("#mock-banner").hidden = !cfg.mock;
  initTestNotice(cfg.test_notice, { showView });
  $("#chat-off").hidden = !cfg.chat_off;
  // Skrbnik: »Prijavi napako« v glavi klepeta (napaka v aplikaciji ali pri inštruktorju, public/prijave.js).
  $("#chat-bug").hidden = !cfg.admin;
  initFeedback({ api, getStudent: () => state.student, showView, toast, currentLang }, cfg);
  initGames({ api, getStudent: () => state.student, setStudent: studentUpdated, toast: (m, ic = "check") => toast(m, ic), refreshXp, currentLang });
  // Igre v ozadju, ko se je stran že odprla (zavihek Igre se nato odpre takoj); ne ob »Skrij igre« in ne ob varčevanju s podatki.
  const idle = window.requestIdleCallback || ((f) => setTimeout(f, 1500));
  setTimeout(() => idle(() => {
    if ((state.student && !gamesOn(state.student.settings)) || navigator.connection?.saveData) return;
    loadGames().catch(() => {});
  }), 3000);
  // Dotik zavihka Igre (ali vrstice v »Jaz«) začne nalaganje že pred klikom.
  document.addEventListener("pointerdown", (e) => {
    if (!gamesMod && e.target.closest?.('[data-view="games"], [data-go="games"]')) loadGames().catch(() => {});
  }, { passive: true, capture: true });
  initZbirke({ api, getStudent: () => state.student, currentLang, showView });
  initCorner({
    api,
    getStudent: () => state.student,
    setStudent: studentUpdated,
    toast: (m) => toast(m, "check"),
    askTutor: (text) => {
      showView("chat");
      fillInput(text);
    },
  });
  // Starševski računi (account.js): prijava, potrditev, prvi otrok.
  let first = true;
  const start = async (o) => {
    // Prijava brez ponovnega nalaganja strani: /api/config pred prijavo še ni vedel, da je to skrbnik.
    if (!cfg.admin) api("/api/config").then((c) => ($("#chat-bug").hidden = !c.admin)).catch(() => {});
    await loadStudents();
    if (first) initUsageMeter({ escapeHtml, showView, toast });
    else refreshUsageMeter();
    if (!o?.keepView) showView("path");
    if (first && START_VIEW && !o?.keepView) showView(START_VIEW);
    if (first && START_ASK && !o?.keepView) {
      const box = $("#input");
      box.value = START_ASK;
      autoGrow();
      box.focus();
    }
    if (first) restoreWindows();
    first = false;
  };
  captureSource(); // oznaka vira iz povezave (public/vir.js), pred prijavo, ki lahko preusmeri
  if (await initAccount({ onReady: start })) await start();
})().catch(bootFailed);

// Strežnik ni dosegljiv ob odprtju (računalnik ugasnjen, stara povezava): namesto prazne strani
// sporočilo; ko je strežnik spet dosegljiv (ali stara povezava preusmeri drugam), se stran odpre.
// Če strežnik odgovarja, napaka ni v povezavi: sporočila ne kažemo (sicer bi se stran vsakih 10 s
// znova nalagala in skrila aplikacijo, ki morda deloma deluje).
const serverReach = () =>
  fetch("/healthz", { cache: "no-store", redirect: "manual" })
    .then((r) => (r.type === "opaqueredirect" ? "moved" : r.ok && !r.headers.get("ngrok-error-code") ? "ok" : "down"))
    .catch(() => "down");
async function bootFailed(err) {
  console.error(err);
  if (document.getElementById("boot-down") || (await serverReach()) === "ok") return;
  const box = document.createElement("div");
  box.id = "boot-down";
  box.className = "boot-down";
  box.setAttribute("role", "alert");
  box.innerHTML = `<div class="card">${icon("wifi-off")}<p>${t("off.serverDown")}</p><button class="primary" type="button">${t("task.retry")}</button></div>`;
  box.querySelector("button").onclick = () => location.reload();
  for (const el of document.body.children) el.inert = true; // prazna lupina pod sporočilom ni dosegljiva s tipkovnico
  document.body.append(box);
  document.body.classList.add("boot-down-on");
  box.querySelector("button").focus();
  const timer = setInterval(async () => {
    if ((await serverReach()) !== "down") {
      clearInterval(timer);
      location.reload();
    }
  }, 10000);
}

// Računalnik: če zavihki z napisi ne gredo v zgornjo vrstico (ožje okno ali več zavihkov),
// jih postopoma stisnemo; zavihek brez napisa ga pokaže ob lebdenju (title).
{
  const bar = document.querySelector(".topbar");
  const tabs = bar?.querySelector(".tabs");
  if (bar && tabs) {
    // Koraki, dokler zavihki ne gredo v vrstico: ožji zavihki, brez napisa »Evklid« ob logotipu,
    // manj pogosti zavihki samo z ikono, na koncu vsi samo z ikono (izbrani obdrži napis).
    const STEPS = ["tabs-tight", "tabs-nobrand", "tabs-minor", "tabs-compact"];
    const over = () => tabs.scrollWidth > tabs.clientWidth + 1;
    const fit = () => {
      tabs.querySelectorAll(".tab").forEach((tab) => (tab.title = [tab.textContent.trim(), tabHint(tab)].filter(Boolean).join(" · ")));
      bar.classList.remove(...STEPS);
      for (const step of STEPS) {
        if (!over()) break;
        bar.classList.add(step);
      }
      if (over()) tabs.querySelector(".tab.active")?.scrollIntoView({ block: "nearest", inline: "nearest" });
      fade();
    };
    // Vrstica, ki ne gre na zaslon, se pomika; rob, za katerim je še kaj, zbledi (style.css). V RTL je scrollLeft ≤ 0.
    const fade = () => {
      const max = tabs.scrollWidth - tabs.clientWidth;
      const at = Math.abs(tabs.scrollLeft);
      tabs.classList.toggle("fade-start", max > 1 && at > 1);
      tabs.classList.toggle("fade-end", max > 1 && at < max - 1);
    };
    tabs.addEventListener("scroll", fade, { passive: true });
    tabs.addEventListener(
      "wheel",
      (e) => {
        if (!over() || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
        e.preventDefault();
        tabs.scrollLeft += document.documentElement.dir === "rtl" ? -e.deltaY : e.deltaY;
      },
      { passive: false },
    );
    new ResizeObserver(fit).observe(tabs);
    new MutationObserver(fit).observe(tabs, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["hidden", "class"] });
    document.fonts?.ready.then(fit);
  }
}

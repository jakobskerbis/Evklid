// Evklid – odjemalec (brez ogrodja).
import { vnaprejGotovo } from "./zasloni-vnaprej.js"; // prvi: začne prenos zaslonov, ko so moduli preneseni (pred izvajanjem ostalih)
import { fetchThroughRestart as fetchRetry } from "./restart-retry.js";
import { jsonAliNic } from "./odgovor.js";
import { icon, hydrateIcons } from "./icons.js";
import { greekFactHtml, wireGreekFacts } from "./greek.js";
import { t, locale, currentLang, currentRegion, regionFor, setLanguage, deviceRegion, naloziVse } from "./i18n-osnova.js";
import { zaznajNujno, stevilke, vrstice, klici, telHref, drzavaNaprave, izoliraj, izsiljevanje, opomba, ogrej as ogrejNujno } from "./nujno.js";
import { systemForCountry, isRegional, SCHOOL_SYSTEMS } from "./regions.js";
import { mountLanguageCard } from "./language.js";
import { dialectsFor } from "./dialects.js";

hydrateIcons();
import { initAccount, naloziRacun, endPrerenderedLanding, prefetchAccountStatus, accountsOn, openAddChild, logout, openProfileLock, renderAccount } from "./account.js";
import { captureSource, currentSource } from "./vir.js";
import { showFull, closeFull, fullOpen } from "./razpri.js";
import { makeSplitter } from "./razdelilnik.js";
import { nastaviNogo } from "./noga.js";
import { initOkna, isFloating, openWindow, closeWindow, focusWindow, refreshBubble, chatReply, restoreWindows, windowsOn, tabHint, floatingViews, syncTabbarH } from "./okna.js";
import { initProfileMenu, refreshProfileButton, closeProfileMenu } from "./profile-menu.js";
import { initQuickStart, closeQuickStart } from "./quick-start.js";
import { openPrintable, stopReading } from "./gradiva.js";
import { initSubjectSwitch } from "./subject-switch.js";
import { PACES, DEFAULT_PACE, createPacer } from "./pace.js";
import { createIzrisBlokov, enIzrisNaSlicico } from "./izpis-toka.js";
import { createRenderer, streamSafe, naloziKnjiznice } from "./rich.js";
import { loadPrograms, programsCache, subjectOptions, schoolSubjectsFor, SUBJECT_NAMES } from "./programs.js";
import { mountLevelPicker, levelLabel, levelChoices, ravenChoices, schoolSystemOptions } from "./level-picker.js";
import { initKeyboard, configureKeyboard, toggleKeyboard, hideKeyboard, keyboardOpenFor, keyboardLayer, setKeyboardContext, mountKeyboardSettings, naloziTipkovnico, obTipkovnici } from "./tipkovnica-lena.js";
import { splitFormulas, hasFormula } from "./vnos-formul.js";
import { attachPrettify } from "./lepi-zapis.js";
import { renderSuggestion, renderWelcome, stageUp } from "./level-up.js";
import { offlineApi, offlineBootApi, pripraviPreverjanje, saveStudents, saveConfig, clearProfile, refreshPack, syncOffline, packTaskCount, pendingCount } from "./offline.js";
import { initFeedback, showFeedback, renderFeedbackCard } from "./feedback.js";
import { initInstall, installSheetOpen, closeInstallSheet } from "./install.js";
// Igre (games/, ~0,7 MB kode; naloge predmetov še ~0,1–0,4 MB na predmet, games/subjects/) se naložijo šele, ko jih učenec odpre, ali v mirnem trenutku po
// zagonu: prvo odprtje Evklida mora prenesti in zagnati pol manj kode (j, 2026-11-04: »stran deluje počasi«).
import { vzporedno, teme, zapomni, vadnica, topli, temeVnaprej, pathUrl } from "./kliki.js"; // kliki brez čakanja (pomnilniki, vnaprej)
let gamesMod = null;
let gamesCtx = null;
let gamesP = null;
let gamesTries = 0;
// Brskalnik si neuspel modul zapomni do ponovnega nalaganja strani: nov poskus zato z drugim naslovom (?r=).
const loadGames = () =>
  (gamesP ||= (gamesTries++ ? import(`./games/index.js?r=${gamesTries}`) : (vzporedno("games/index.js"), import("./games/index.js"))).then((m) => {
    gamesMod = m;
    if (gamesCtx) m.initGames(gamesCtx);
    m.prepareSubjects?.(); // naloge le za učenčev predmet (ostali predmeti ob izbiri v Igrah)
    return m;
  }).catch((err) => {
    gamesP = null; // brez povezave ali napaka: naslednji poskus znova
    throw err;
  }));
const initGames = (c) => {
  gamesCtx = c;
  gamesMod?.initGames(c);
  gamesMod?.prepareSubjects?.();
};
const gamesNote = (key) =>
  document.querySelector("#games-content")?.replaceChildren(Object.assign(document.createElement("p"), { className: "muted", textContent: t(key) }));
const showGames = () => {
  if (!gamesMod) gamesNote("common.loading");
  return loadGames().then((m) => m.showGames()).catch(() => gamesMod || gamesNote("off.noConnection"));
};
const gamesBack = () => gamesMod?.gamesBack() ?? false;
const leaveGames = () => gamesMod?.leaveGames();
import { gamesOn, backgroundLoadOk } from "./games/stage.js";
import { initUsageMeter, refreshUsageMeter } from "./usage-meter.js";
import { initFullscreen } from "./fullscreen.js";
import { initSchedule, renderScheduleCard, lastSchedule } from "./urnik-kartica.js";
import { stageCardHtml, vrstniRed, uvrstiKartice, stageRows } from "./zacetna.js";
import { initAnketa, preveriAnketo } from "./anketa-teden.js";
import { initUci, showUci, setUciTab, uciTab, uciBack, leaveUci, open3d, isOpen3d, labFromLesson, UCI_TABS } from "./uci-se.js";
import { initTestNotice } from "./testna-verzija.js";
import { xpStatsHtml, levelRowHtml, paintBadge, celebrateXp } from "./xp-fx.js";
import { heatmapHtml, weeksHtml } from "./aktivnost.js";
import { goalFieldsHtml, wireGoalFields, readGoalFields, goalLineHtml, goalName, countdown, hasGoal, reminderDue, dismissReminder, reminderCardHtml } from "./goal.js";
import { goalShortcuts, goalTabbarView } from "./goal-data.js";
import { loadPapers, paperLabel, fileText, examName as siExamName, SI_EXAMS } from "./exam-papers.js";
// Zasloni, ki niso Učna pot (naloga hitrost, docs/meritve/prijavljen-mobilno-2026-11-19.md točka 2): skener z
// reševalnikom (scan/, ~65 KB stisnjeno) ter zbirke, avatar in lige (~55 KB) niso več del zagona. Naložijo se takoj po
// prvem izrisu zaslona (zasloniPozneje, ob koncu zagona) ali ob prvi uporabi, če je ta prej; prvi izris Učne poti na
// počasni povezavi tako ne čaka nanje. Ob neuspehu (brez povezave, nova različica) nov poskus z drugim naslovom (?r=).
const lenModul = (url, ob) => {
  let p = null;
  let n = 0;
  let mod = null;
  const load = () =>
    // Prvo nalaganje: vse odvisnosti modula hkrati (kliki.js vzporedno, seznam server/app.js LENI_MODULI).
    (p ||= (n++ ? import(`${url}?r=${n}`) : (vzporedno(url.replace(/^\.\//, "")), import(url))).then((m) => {
      if (mod !== m) {
        mod = m;
        ob?.(m);
      }
      return m;
    }).catch((err) => {
      p = null;
      throw err;
    }));
  return { load, now: () => mod };
};
let oznakaZdaj = null; // aiOznaka: showView("chat") jo naloži takoj, ne šele po prenosu zaslonov
const viewNote = (sel, key, force = false) => {
  const el = document.querySelector(sel);
  if (el && (force || !el.childElementCount)) el.replaceChildren(Object.assign(document.createElement("p"), { className: "muted", textContent: t(key) }));
};
let scanDeps = null;
let scanSeq = 0; // skener, zapuščen pred prihodom modula, se ne odpre (ne zažene kamere) za drugim zaslonom
const scanMod = lenModul("./scan/scan.js", (m) => scanDeps && m.initScan(scanDeps));
const scanLoad = () => Promise.all([scanMod.load(), naloziKnjiznice()]).then(([m]) => m); // skener izriše formule s KaTeX
const initScan = (deps) => {
  scanDeps = deps;
  scanMod.now()?.initScan(deps);
};
const showScan = (o) => {
  const n = ++scanSeq;
  if (!scanMod.now()) viewNote("#view-scan .scan-body", "common.loading");
  return scanLoad().then((m) => n === scanSeq && m.showScan(o)).catch(() => scanMod.now() || viewNote("#view-scan .scan-body", "off.noConnection", true));
};
const leaveScan = () => {
  scanSeq++;
  scanMod.now()?.leaveScan();
};
const scanBack = () => scanMod.now()?.scanBack() ?? false;
const startPilotScan = (task) => scanLoad().then((m) => m.startPilotScan(task)).catch(() => {});
const startTutorScan = (onSend) => scanLoad().then((m) => m.startTutorScan(onSend)).catch(() => {});
let zbCtx = null;
const zbMod = lenModul("./zbirke-view.js", (m) => zbCtx && m.initZbirke(zbCtx));
const initZbirke = (c) => {
  zbCtx = c;
  zbMod.now()?.initZbirke(c);
};
const showZbirke = (item, from) => {
  return zbMod.load().then((m) => m.showZbirke(item, from)).catch(() => zbMod.now() || viewNote("#zbirke-content", "off.noConnection", true));
};
const meCard = (el) => zbMod.load().then((m) => m.meCard(el)).catch(() => {});
// Obvestilo o novem predmetu po nalogi ali pogovoru: modul je do takrat že naložen (zasloniPozneje); sicer brez obvestila.
const unlockedText = (ids) => zbMod.now()?.unlockedText(ids) ?? "";
const itemThumb = (id, size) => zbMod.now()?.itemThumb(id, size) ?? "";
// Vadnica (tema, naloge, serije), tekmovanja, NPZ in matura ter pretekle pole (public/vadnica.js, ~20 KB stisnjeno s
// tipkovnico za naloge pad.js) niso del prvega izrisa Učne poti: naložijo se takoj po njem (zasloniPozneje) ali ob prvi
// uporabi. Klic pred prihodom modula ga počaka; pogleda Tekmovanja ter NPZ in matura do takrat kažeta »Nalagam …«.
// Nastavitve naprave za inštruktorja (posnetek z vsakim sporočilom, predlog in sprememba iz odgovora) in obrazca
// »Prijavi napako«: v vrsti po prvem izrisu takoj za izrisom formul (zasloniPozneje), ob prvem sporočilu skoraj vedno že tu.
// Naložen modul se kliče takoj (isti vrstni red kot prej); posnetek sporočilo sicer počaka (brez modula gre brez njega).
const nastMod = lenModul("./chat-settings.js");
const nast = (fn) => (...a) => (nastMod.now() ? nastMod.now()[fn](...a) : nastMod.load().then((m) => m[fn](...a), () => {}));
const applyDeviceSettings = nast("applyDeviceSettings");
const addProposal = nast("addProposal");
const deviceSnapshot = () => nastMod.now()?.deviceSnapshot() ?? nastMod.load().then((m) => m.deviceSnapshot(), () => undefined);
const prijMod = lenModul("./prijave.js");
const prij = (fn) => (...a) => prijMod.load().then((m) => m[fn](...a), () => (toast(t("off.noConnection")), a.at(-1)?.onClose?.()));
const openAdminBug = prij("openAdminBug");
const openMsgReport = prij("openMsgReport");
const vadMod = lenModul("./vadnica.js");
const vad = (fn) => (...a) => vadMod.load().then((m) => m[fn](...a));
const vadPogled = (fn, sel) => (...a) => vadMod.load().then((m) => m[fn](...a), () => vadMod.now() || viewNote(sel, "off.noConnection", true));
// Podatki zaslona hkrati z modulom, ki ga še ni (prvi obisk): zaslon jih ob prihodu modula prevzame (prefetchGet,
// kliki.js topli: isti učenec, brez vmesne spremembe); če se modul ne naloži, se odgovor zavrže.
const zModulom = (mod, url) => {
  if (mod.now() || !state.student?.id) return;
  prefetchGet(url);
  mod.load().catch(() => apiWarm.drop(url));
};
// Tema z Učne poti, preden je vadnica.js naložena (prvi obisk, klik takoj po izrisu): vsebino teme (kliki.js teme) in,
// če stanja teme ni v zadnji Učni poti, pot te teme zahtevamo hkrati z modulom, ne šele za njim. Pot samo za temo
// iz trenutne poti (openTopic v vadnica.js sicer prebere pot teme, tp.path).
const openTopic = (id, ...a) => {
  if (!vadMod.now() && state.student?.id) {
    topicEntry(id);
    if (!pathUnitsFor(id) && state.pathKey && id.startsWith(`${state.pathKey}/`)) zModulom(vadMod, pathUrl(state.student.id, state.pathKey));
  }
  return vad("openTopic")(id, ...a);
};
const nextPractice = vad("nextPractice");
const learnWithTutor = vad("learnWithTutor");
const startSession = vad("startSession");
const loadCompetition = (...a) => {
  const key = a.length ? a[0] : state.compKey; // kot loadCompetition v vadnica.js
  if (state.student?.id) zModulom(vadMod, `/api/students/${state.student.id}/competition${key ? `?key=${encodeURIComponent(key)}` : ""}`);
  return vadPogled("loadCompetition", "#competition-content")(...a);
};
const loadExams = vadPogled("loadExams", "#exams-content");
const openOurs = vad("openOurs");
const paperTask = vad("paperTask");
const stopContestTimer = () => vadMod.now()?.stopContestTimer();
// Plošča za vnos odgovora (pad.js) je odprta samo v nalogi vadnice: brez naloženega modula ni odprta.
const closePad = () => vadMod.now()?.closePad();
const padIsSheet = () => vadMod.now()?.padIsSheet() ?? false;
// Kalkulator (public/kalkulator-zaslon.js; orodja v public/graph/ se naložijo ob prvi uporabi kot prej): po prvem izrisu
// Učne poti (zasloniPozneje) ali ob prvi uporabi; vprašanja »je odprto?« brez modula vrnejo »ne«.
const calcMod = lenModul("./kalkulator-zaslon.js");
const calcCall = (fn) => (...a) => calcMod.load().then((m) => m[fn](...a));
const setCalcMode = calcCall("setCalcMode");
const showGraph = () => {
  if (!calcMod.now()) viewNote("#graph-slot", "common.loading");
  return calcMod.load().then((m) => m.showGraph(), () => calcMod.now() || viewNote("#graph-slot", "off.noConnection", true));
};
const openCalcOverlay = calcCall("openCalcOverlay");
const openGraphOverlay = calcCall("openGraphOverlay");
const calcTool = calcCall("calcTool");
const prefetchNext = () => calcMod.load().then((m) => m.prefetchNext()).catch(() => {});
const calcBack = () => calcMod.now()?.calcBack() ?? false;
const closeCalcOverlay = (o) => calcMod.now()?.closeCalcOverlay(o);
// Stran Urnik (public/schedule.js); kartica na Učni poti je v urnik-kartica.js.
const urnikMod = lenModul("./schedule.js");
const showSchedule = () => {
  if (!urnikMod.now()) viewNote("#view-schedule .sch-body", "common.loading");
  return urnikMod.load().then((m) => m.showSchedule(), () => urnikMod.now() || viewNote("#view-schedule .sch-body", "off.noConnection", true));
};
// Moduli zaslonov, ki jih Učna pot ne rabi (Kotiček, Laboratorij, Kartice, naloge pilota, gumbi orodij pod odgovorom
// inštruktorja): po prvem izrisu (zasloniPozneje) ali ob prvi uporabi. init* si zapomni odvisnosti in jih modulu preda ob
// prihodu; klic, ki ga zaslon počaka, gre skozi load(); vprašanja »je odprto?« brez modula vrnejo »ne«.
const cornerMod = lenModul("./corner.js", (m) => cornerDeps && m.initCorner(cornerDeps));
let cornerDeps = null;
const initCorner = (d) => ((cornerDeps = d), cornerMod.now()?.initCorner(d));
const showCorner = () => {
  if (state.student?.id) zModulom(cornerMod, `/api/students/${state.student.id}/corner`); // kot corner.js load()
  return cornerMod.load().then((m) => m.showCorner(), () => cornerMod.now() || viewNote("#corner-content", "off.noConnection", true));
};
const cornerBack = () => cornerMod.now()?.cornerBack() ?? false;
const closeBoard = (o) => cornerMod.now()?.closeBoard(o);
const askInterests = (o) => cornerMod.load().then((m) => m.askInterests(o));
const maybeAskInterests = () => cornerMod.load().then((m) => m.maybeAskInterests(), () => false);
const labMod = lenModul("./laboratorij.js", (m) => labDeps && m.initLab(labDeps));
let labDeps = null;
const initLab = (d) => ((labDeps = d), labMod.now()?.initLab(d));
const showLab = () => labMod.load().then((m) => m.showLab(), () => labMod.now() || viewNote("#lab-content", "off.noConnection", true));
const labBack = () => labMod.now()?.labBack() ?? false;
const openLabExperiment = (key) => labMod.load().then((m) => m.openLabExperiment(key)).catch(() => {});
const cardsMod = lenModul("./flashcards.js", (m) => cardsDeps && m.initFlashcards(cardsDeps));
let cardsDeps = null;
const initFlashcards = (d) => ((cardsDeps = d), cardsMod.now()?.initFlashcards(d));
const showFlashcards = () => {
  if (!cardsMod.now()) viewNote("#view-cards", "common.loading");
  if (state.student?.id) zModulom(cardsMod, `/api/students/${state.student.id}/flashcards${state.pathKey ? `?path=${encodeURIComponent(state.pathKey)}` : ""}`); // kot flashcards.js
  return cardsMod.load().then((m) => m.showFlashcards(), () => cardsMod.now() || viewNote("#view-cards", "off.noConnection", true));
};
// Opomba o novih karticah pod odgovorom inštruktorja: ob prihodu modula, če še ni naložen.
const addCardsNote = (bubble, data) => cardsMod.load().then((m) => bubble.isConnected && m.addCardsNote(bubble, data)).catch(() => {});
const showNotes = () => {
  if (!cardsMod.now()) viewNote("#view-cards", "common.loading");
  return cardsMod.load().then((m) => m.showNotes(), () => cardsMod.now() || viewNote("#view-cards", "off.noConnection", true));
};
const pilotMod = lenModul("./pilot-naloge.js", (m) => pilotDeps && m.initPilot(pilotDeps));
let pilotDeps = null;
const initPilot = (d) => ((pilotDeps = d), pilotMod.now()?.initPilot(d));
// Stanje pilota za profil (vrstica v Jaz, obvestilo ob prvi prijavi) ni del prvega izrisa Učne poti: po njem.
const loadPilot = () => poZagonu(() => pilotMod.load().then((m) => m.loadPilot()).catch(() => {}));
const showPilot = () => pilotMod.load().then((m) => m.showPilot(), () => {});
const isPilotMember = () => pilotMod.now()?.isPilotMember() ?? false;
// Gumbi orodij pod odgovorom inštruktorja (odpri.js): ob prihodu modula, če še ni naložen.
const openMod = lenModul("./odpri.js", (m) => openDeps && m.initOpen(openDeps));
let openDeps = null;
const initOpen = (d) => ((openDeps = d), openMod.now()?.initOpen(d));
const addOpen = (bubble, list) => {
  const m = openMod.now();
  if (m) return m.addOpen(bubble, list);
  openMod.load().then((x) => bubble.isConnected && x.addOpen(bubble, list)).catch(() => {});
};
const simOverlayOpen = () => openMod.now()?.simOverlayOpen() ?? false;
const closeSimOverlay = () => openMod.now()?.closeSimOverlay();
const leagueMod = lenModul("./leagues.js");
const loadLeague = (id) => {
  return leagueMod.load().then((m) => m.loadLeague(id, apiGen)).catch(() => leagueMod.now() || viewNote("#league-content", "off.noConnection", true));
};
// Liga vnaprej (odprt »Jaz«, dotik vrstice Lige).
const prefetchLeague = () => {
  const id = state.student?.id;
  if (id) leagueMod.load().then((m) => m.prefetchLeague?.(id, apiGen)).catch(() => {});
};
let pozneje = false;
// Delo, ki ni za prvi izris Učne poti (moduli, ki jih ta ne rabi): po njem (zasloniPozneje), sicer takoj.
const poZagonuVrsta = [];
const poZagonu = (fn) => (pozneje ? fn() : void poZagonuVrsta.push(fn));
const zasloniPozneje = () => {
  if (pozneje) return;
  pozneje = true;
  for (const fn of poZagonuVrsta.splice(0)) fn();
  // Vzorci varnostnega zaznavalnika nastanejo šele ob prvi uporabi (public/nujno.js compile): pripravimo jih takoj po
  // prvem izrisu v kosih v času mirovanja, ne šele ob prvem odprtju Inštruktorja (prvi »Pošlji« bi sicer čakal nanje).
  pripraviZaznavalnik();
  // Takoj po prvem izrisu (sličica s potjo, nato vrsta; ne šele v mirovanju): najprej zasloni, ki jih učenec najverjetneje odpre (že prenašajo se,
  // zasloni-vnaprej.js; tu se izvedejo), nato cel slovar (moduli, ki dobijo t() od app.js, npr. orodja kalkulatorja),
  // tipkovnica, izris formul in ostali zasloni. Med pošiljanjem sporočila inštruktorju vrsta počaka (poPosiljanju), da
  // odgovor dobi vso povezavo. Tap ali lebdenje nad zavihkom modul tega zaslona naloži takoj (vnaprejObDotiku).
  requestAnimationFrame(() => setTimeout(() =>
    [vadMod, { load: naloziRacun }, cardsMod, cornerMod, calcMod, urnikMod, { load: naloziVse }, { load: naloziTipkovnico }, { load: pripraviIzris }, nastMod, prijMod, tbMod, scanMod, zbMod, openMod, labMod, pilotMod, leagueMod, ourMod, { load: pripraviPreverjanje }]
      .reduce((p, x) => p.then(poPosiljanju).then(() => prednost).then(() => x.load().catch(() => null)), Promise.resolve())
      // Za delo brez povezave: service worker shrani tudi te module (ob prvem obisku je seznam »precache« že poslan).
      .then(() => navigator.serviceWorker?.ready)
      .then((reg) => reg?.active && predpomni(reg.active, performance.getEntriesByType("resource").map((e) => e.name).filter((u) => /\.js(\?|$)/.test(u))))
      .catch(() => null),
  ));
};
// Med pošiljanjem in izpisom odgovora inštruktorja (state.sending) prenosi v ozadju počakajo.
const poPosiljanju = () => (state.sending ? new Promise((r) => setTimeout(r, 250)).then(poPosiljanju) : Promise.resolve());
// Seznam za service worker po kosih: naslednji kos šele, ko je prejšnji shranjen (odgovor »ok«; starejši service worker
// ne odgovori, zato največ 5 s na kos) in ko ni pošiljanja. Prej ves seznam naenkrat (do ~0,6 MB hkrati ob prvem obisku).
const predpomni = async (sw, urls) => {
  for (let i = 0; i < urls.length; i += 8) {
    await poPosiljanju();
    await new Promise((ok) => {
      const ch = new MessageChannel();
      ch.port1.onmessage = ok;
      setTimeout(ok, 5000);
      sw.postMessage({ type: "precache", urls: urls.slice(i, i + 8) }, [ch.port2]);
    });
  }
};
// Dotik ali lebdenje nad zavihkom ali temo na Učni poti: modul tega zaslona se začne nalagati takoj, pred klikom.
const modulPogleda = (v) => ({ competition: vadMod, exams: vadMod, account: { load: naloziRacun }, cards: cardsMod, corner: cornerMod, graph: calcMod, schedule: urnikMod, lab: labMod, textbook: tbMod })[v];
const vnaprejObDotiku = (e) => {
  const el = e.target.closest?.("[data-view], #modebar [data-mode], #view-path [data-open], [data-uci-tab]");
  if (!el) return;
  const m = el.matches("#view-path [data-open]") ? vadMod : modulPogleda(el.dataset.view || el.dataset.mode || el.dataset.uciTab);
  // Dotaknjen zaslon ima prednost pred vrsto v ozadju (zasloniPozneje): naslednji modul vrste počaka nanj, da si na
  // počasni povezavi ne delita pasovne širine (prvi obisk: Laboratorij je bil 16. v vrsti, pregled 3 hitrost-skupaj).
  if (m) prednost = m.load().catch(() => null);
};
let prednost = Promise.resolve();
document.addEventListener("pointerdown", vnaprejObDotiku, { capture: true, passive: true });
document.addEventListener("pointerover", (e) => e.pointerType === "mouse" && vnaprejObDotiku(e), { capture: true, passive: true });
// Pregledovalnik prenesene pole (paper-viewer.js, paper-tasks.js) šele ob odprtju pole: ni del zagona.
// Ob neuspehu (brez povezave, nova različica) se obljuba pozabi in naslednji poskus gre z drugim naslovom (?r=), kot loadGames.
let paperViewer = null;
let paperViewerP = null;
let paperViewerTries = 0;
const loadPaperViewer = () =>
  (paperViewerP ||= (paperViewerTries++ ? import(`./paper-viewer.js?r=${paperViewerTries}`) : import("./paper-viewer.js"))
    .then((m) => (paperViewer = m))
    .catch((err) => {
      paperViewerP = null;
      throw err;
    }));
const closePaperViewer = () => paperViewer?.closePaperViewer() || false;
import { partKey, partLabel } from "./our-paper-key.js";
import { initDrsniki } from "./drsniki.js";
import { jeFaks, jeSs, jeOs, stopnja } from "./stopnja.js";
import { chatIdeas as pickIdeas } from "./predlogi.js";
import { GUIDE } from "./vodic.js";
import { FREE_LIMIT_CODES, showLimitCard } from "./meja-placilo.js";

const $ = (sel) => document.querySelector(sel);
// Delo ob nedejavnosti glavne niti (priprava naslednjih zaslonov), da ne zakasni dotikov.
const whenIdle = (fn, timeout = 2000) => (window.requestIdleCallback ? requestIdleCallback((d) => fn(d), { timeout }) : setTimeout(fn, 200));
// Gradnja vnaprej (kalkulator, orodja) samo, ko se učenec ni dotaknil zaslona vsaj 0,8 s: dolga naloga ne zakasni tapa.
const whenQuiet = (fn) => whenIdle(() => (Date.now() - lastInput < 800 ? setTimeout(() => whenQuiet(fn), 400) : fn()));
// Brez povezave odgovori vadnica iz shranjenega paketa nalog (public/offline.js).
// Za zagon brez povezave še seznam profilov (osebni odgovori API niso v predpomnilniku, P7).
// Naloga ali odgovor iz paketa lahko čaka na check.js (offline.js pripraviPreverjanje vrne obljubo): če klica paket ne
// zna (undefined) ali se check.js ne naloži (brez povezave in brez kopije), klicatelj dobi isto prevedeno sporočilo
// brez povezave (offline: true) kot pri vsakem drugem klicu, nikoli undefined ali surove napake uvoza.
const fromPack = (url, opts, napaka) => {
  const v = (state.student ? offlineApi(state.student.id, url, opts) : undefined) ?? offlineBootApi(url, opts);
  if (!(v instanceof Promise)) return v;
  return v.then(
    (r) => (r === undefined ? Promise.reject(napaka()) : r),
    () => Promise.reject(napaka()),
  );
};
const brezPovezave = (msg) => () => Object.assign(new Error(msg()), { offline: true });
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

// Obljuba, ki jo konec zagona počaka kot klic pogleda (finishStart), npr. klic brez api().
const sledi = (p) => {
  const id = ++apiSeq;
  apiOpen.add(id);
  Promise.resolve(p).finally(() => apiOpen.delete(id)).catch(() => {});
};
// Klic v ozadju (api(url, { ozadje: true })): prenos, ki ga pogled ne prikaže (paket za vaje brez povezave).
const apiOzadje = (url, opts = {}) => api(url, { ...opts, ozadje: true });
// Klici v teku (zaporedna številka): konec zagona počaka, da se prvi pogled napolni, preden zamenja posnetek
// zadnjega zaslona (finishStart).
let apiSeq = 0;
const apiOpen = new Set();
// Isti GET, ki je že v teku (ob zagonu ga zahteva več delov strani hkrati: Učna pot, predlogi v klepetu, urnik …),
// gre na strežnik enkrat. Vsak klic, tudi prvi, dobi svojo kopijo odgovora (structuredClone), zato nobeden ne
// spremeni odgovora drugemu. Zahteva, ki ni GET, pozabi vse GET v teku: GET po njej gre znova na strežnik in
// prebere novo stanje (GET, ki je že v teku, se ne prekine; ostane le zunaj seznama za združevanje).
const apiInFlight = new Map();
const kopija = (v) => (v && typeof v === "object" ? structuredClone(v) : v);
// Vnaprej prenesen GET (kliki.js topli: ob dotiku, v mirovanju ali hkrati z modulom zaslona, ki ga še ni): prvi enak
// klic ga prevzame, če je za istega učenca, mlajši od 60 s in vmes ni bilo nobene spremembe. apiGen šteje spremembe
// (klic, ki ni GET, ob začetku in koncu; sporočilo inštruktorju): vsaka pobriše vse vnaprej prenesene odgovore.
let apiGen = 0;
const apiWarm = topli({ get: (url) => api(url, { ozadje: true }), gen: () => apiGen, ucenec: () => state.student?.id });
const prefetchGet = apiWarm.prefetch;
const sprememba = () => {
  apiWarm.clear();
  apiGen++;
};
// Zapisi mimo api() (leagues.js, kviz.js, 3d/atlas.js s svojim fetch) to sporočijo z dogodkom.
addEventListener("evklid:sprememba", sprememba);
const api = (url, opts = {}) => {
  const get = !opts.method && !opts.body && !opts.headers && !opts.signal;
  if (!get) apiInFlight.clear();
  // ohrani: klic, ki ne spremeni ničesar, kar je shranjeno (naloga vadnice vnaprej, prefetchPractice).
  if (!get && !opts.ohrani) sprememba();
  const w = get && apiWarm.take(url);
  if (w) return w.catch(() => api(url));
  if (get && apiInFlight.has(url)) return apiInFlight.get(url).then(kopija);
  const p = (async () => {
    const id = ++apiSeq;
    if (!opts.ozadje) apiOpen.add(id); // klic v ozadju (paket za vaje brez povezave) ne zadrži konca zagona
    try {
      return await apiCall(url, opts);
    } finally {
      apiOpen.delete(id);
    }
  })();
  if (!get) {
    if (!opts.ohrani) p.finally(sprememba).catch(() => {});
    return p;
  }
  apiInFlight.set(url, p);
  const pobrisi = () => apiInFlight.get(url) === p && apiInFlight.delete(url);
  p.then(pobrisi, pobrisi);
  return p.then(kopija);
};
const apiCall = async (url, opts = {}) => {
  // Klic, ki ga je zagon že začel v <head> (public/zacetek.js): enkrat, samo uspešen odgovor; sicer običajna pot.
  if (!opts.method && !opts.body) {
    const early = await window.evklidZacetek?.vnaprej?.(url);
    if (early != null) return early;
  }
  if (/\/tasks\/off-/.test(url)) {
    const napaka = brezPovezave(() => t("off.noConnection"));
    const local = fromPack(url, opts, napaka);
    if (local !== undefined) return local;
    throw napaka();
  }
  const { ozadje, ohrani, ...init } = opts;
  const res = await fetchThroughRestart(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    body: opts.body && typeof opts.body !== "string" ? JSON.stringify(opts.body) : opts.body,
  });
  if (!res || (res.status === 503 && res.headers.get("X-Offline")) || serverDown(res)) {
    // Gostitelj odgovori, naš strežnik pa ne (npr. med objavo nove različice): ne pišemo »Ni povezave z internetom«.
    // offline: sporočilo je že prevedeno in pove, ali manjka povezava ali odgovor strežnika (npr. 502 med objavo).
    const napaka = brezPovezave(() => (!res || navigator.onLine === false ? t("off.noConnection") : t("off.serverBusy")));
    const local = fromPack(url, opts, napaka);
    if (local !== undefined) return local;
    throw napaka();
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
// Izris formul (KaTeX, marked, DOMPurify v rich.js in oznake formul formula-info.js + formula-data.js, ~130 KB stisnjeno)
// ni del prvega izrisa Učne poti: naloži se takoj po njem (zasloniPozneje) ali ob prvi potrebi (pripraviIzris). Izris
// pred tem da nadomestek, ki ga rich.js zamenja, ko je vse naloženo; predmet formul (withFormulaSubject) se ohrani.
let fxDeps = null;
let fxSubject = null; // zadnji setFormulaSubject pred prihodom modula
const fxMod = lenModul("./formula-info.js", (m) => {
  if (fxSubject) m.setFormulaSubject(...fxSubject);
  if (fxDeps) m.initFormulaInfo(fxDeps);
});
const initFormulaInfo = (deps) => {
  fxDeps = deps;
  fxMod.now()?.initFormulaInfo(deps);
};
const closeFormulaPop = () => fxMod.now()?.closeFormulaPop() || false;
const setFormulaSubject = (...a) => {
  fxSubject = a;
  fxMod.now()?.setFormulaSubject(...a);
};
const subjectWithGlossary = (subject, glossary) => fxMod.now()?.subjectWithGlossary(subject, glossary) ?? subject;
let fxOkolje; // argumenti withFormulaSubject med izrisom pred prihodom modula (za nadomestek)
const withFormulaSubject = (...a) => {
  const m = fxMod.now();
  if (m) return m.withFormulaSubject(...a);
  const prej = fxOkolje;
  fxOkolje = a;
  try {
    return a[1]();
  } finally {
    fxOkolje = prej;
  }
};
// Prilagajanje širine formul (sirina.js) opazuje stran šele, ko so formule lahko izrisane (prej jih ni).
const sirinaMod = lenModul("./sirina.js", (m) => m.initSirina());
const prilagodiZdaj = () => sirinaMod.now()?.prilagodiZdaj();
const pripraviIzris = () => Promise.all([naloziKnjiznice(), fxMod.load(), sirinaMod.load()]);
// »Reši našo polo« (our-paper.js) šele ob odprtju.
const ourMod = lenModul("./our-paper.js");
const closeOurPaper = () => ourMod.now()?.closeOurPaper() || false;
// Učbenik (textbook.js s simulacijami in koraki lekcije) ni del prvega izrisa Učne poti: naloži se po njem
// (zasloniPozneje) ali ob prvem odprtju; lekcija počaka še izris formul.
let tbDeps = null;
let tbSeq = 0; // lekcija ali kazalo, zahtevano pred prihodom modula: velja zadnja zahteva
const tbMod = lenModul("./textbook.js", (m) => tbDeps && m.initTextbook(tbDeps));
const tbReady = () => Promise.all([tbMod.load(), pripraviIzris()]).then(([m]) => m);
const initTextbook = (deps) => {
  tbDeps = deps;
  tbMod.now()?.initTextbook(deps);
};
const showTextbook = () => {
  const n = ++tbSeq;
  if (!tbMod.now()) viewNote("#view-textbook", "common.loading");
  return tbReady()
    .then((m) => n === tbSeq && m.showTextbook())
    .catch(() => tbMod.now() || viewNote("#view-textbook", "off.noConnection", true));
};
const openLesson = (id) => {
  const m = tbMod.now();
  if (m && fxMod.now() && sirinaMod.now()) return m.openLesson(id);
  const n = ++tbSeq; // novejša zahteva (druga lekcija, kazalo) med čakanjem na modul prevlada
  return tbReady()
    .then((x) => n === tbSeq && x.openLesson(id))
    .catch(() => n === tbSeq && viewNote("#view-textbook", "off.noConnection", true));
};
const textbookBack = () => tbMod.now()?.textbookBack() ?? false;
const openLessonId = () => tbMod.now()?.openLessonId() ?? null;
const openTextbookLower = () => {
  const m = tbMod.now();
  if (m) return m.openTextbookLower();
  // Klicatelj takoj pokaže Učbenik (showView): ta čaka isti modul in pride za tem klicem.
  return tbReady().then((x) => x.openTextbookLower()).catch(() => {});
};
const { renderMath, renderRich, odlozi: odloziIzris, nared: izrisNared } = createRenderer({
  annotate: (tex, o) => fxMod.now().annotateTex(tex, undefined, o),
  pripravljen: () => !!fxMod.now(),
  pripravi: pripraviIzris,
  kontekst: () => fxOkolje || null,
  vKontekstu: (a, fn) => (a ? fxMod.now().withFormulaSubject(a[0], fn, a[2], ...a.slice(3)) : fn()),
});
// Predmet za pomen simbolov: tema naloge (FIZ-OS-9 …), sicer predmet učenca.
const subjectOfId = (id) => (/^([A-Z]{3})-/.exec(id || "") || [])[1];
// Predmet teme: fakultetne teme (UNI-…) imajo predmet v podatkih, šolske ga imajo v oznaki.
const topicSubject = (tp) => tp?.subject || (/^UNI-/.test(tp?.id || "") ? null : subjectOfId(tp?.id));
// Odprta tema: naloge, namigi, rešitve in klepet o njej uporabijo oznake njene lekcije. Serija nalog iz več tem
// (ponavljanje, dnevni izziv, sklop, tekmovanje) in drugi pogledi jih ne, sicer bi črka imela pomen iz zadnje odprte teme.
const topicGlossary = () => (currentView === "topic" && state.topicFx ? state.topic?.symbols : null);
// Ime teme in sklopa: dvoumna črka dobi pomen iz slovarja le, če se tema ujema (x₁ je ničla le pri kvadratni enačbi).
const topicScope = (tp) => (tp ? [tp.name, tp.unit].filter(Boolean).join(" · ") : "");
// Naloga v seriji iz več tem (ponavljanje, dnevni izziv, tekmovanje): tema in predmet naloge sama (task.topicId),
// ne zadnje odprte teme; sicer bi bil P pri verjetnosti spet »površina« (pregled 463-2, §5.6).
let taskFx = null; // { view, scope, subject }
const taskFxNow = () => (taskFx && currentView !== "topic" && currentView === taskFx.view ? taskFx : null);
function setTaskFx(task) {
  if (!task?.topicId) return (taskFx = null);
  const tp = topicCache.get(task.topicId);
  taskFx = {
    view: currentView,
    scope: tp ? topicScope(tp) : task.topicName || "",
    subject: topicSubject(tp || { id: task.topicId }) || null,
  };
}
setFormulaSubject(
  () => subjectWithGlossary(taskFxNow()?.subject || topicSubject(state.topic) || state.student?.settings?.subject || "MAT", topicGlossary()),
  () => (currentView === "topic" ? topicScope(state.topic) : taskFxNow()?.scope || ""),
);
// Razlaga teme in »Bistvo«: črke imajo pomen iz lekcije te teme (:::simboli), sicer iz slovarja predmeta.
// Izris razlage se zapomni (na telefonu ~150 ms Markdowna in KaTeX ob vsakem odprtju teme); verjetne naslednje teme
// vnaprej v mirovanju (prefetchTopics). Samo dokončan izris, ključ so vsi vhodi.
const richMemo = zapomni();
const topicRich = (tp, text) => {
  const subject = topicSubject(tp) || state.student?.settings?.subject || "MAT";
  const k = izrisNared() ? JSON.stringify([currentLang(), subject, topicScope(tp), tp?.symbols ?? null, text]) : null;
  return richMemo(k, () => withFormulaSubject(subject, () => renderRich(text), tp?.symbols, topicScope(tp)));
};

// Sporočilo učenca: besedilo ostane besedilo, $...$ in zapis s tipkovnice ((3)/(4), √(2), x^(2), ∑_(n=1)^∞ …,
// public/vnos-formul.js) se izrišeta kot formula.
function renderUserText(text) {
  const parts = String(text).split(/(\$[^$\n]+?\$)/g);
  return odloziIzris(
    () =>
      parts
        .map((p, i) =>
          i % 2
            ? renderMath(fxMod.now().plainTex(p.slice(1, -1)), false, false) // starejša sporočila iz »Razloži« imajo še \htmlData
            : splitFormulas(p).map((x) => ("tex" in x ? renderMath(`\\displaystyle ${x.tex}`, false, false) : escapeHtml(x.text))).join(""), // ulomek v polni velikosti
        )
        .join(""),
    String(text),
  );
}

// ---------- pogledi ----------

function showView(name) {
  if (name === "chat") oznakaZdaj?.();
  if (name === "games" && state.student && !gamesOn(state.student.settings)) name = "me"; // »Skrij igre«
  // »Moji zapiski« so del pogleda Kartice (nazaj po vaji iz testa, public/zapiski/vaja.js).
  const notes = name === "zapiski";
  if (notes) name = "cards";
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
      initView(name, notes);
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
  if (currentView === "chat" && name !== "chat" && !isFloating("chat")) leaveChat(); // odhod iz inštruktorja: od tu teče 10 min
  if (name !== currentView) {
    if (BACK_ORIGIN.includes(name)) meBackFrom[name] = startHold ? "me" : currentView; // zagon na zadnjem zaslonu: Jaz
    prevView = currentView;
    hideOldToast();
  }
  currentView = name;
  syncCompetitionTab();
  if (name === "path" || name === "competition" || name === "exams") setBack(name);
  if (name !== "topic") stopContestTimer();
  document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t.dataset.view === name));
  // Na telefonu so Napredek, Lige, Nastavitve in Račun pod zavihkom »Jaz«.
  // Skener iz kamere v Inštruktorju ostane pod zavihkom Inštruktor.
  if (name === "scan" && state.scanFromChat) $('#tabbar [data-view="chat"]')?.classList.add("active");
  else if (meView(name)) $('#tabbar [data-view="me"]').classList.add("active");
  // Računalnik: kar ni med glavnimi zavihki zgoraj, je pod »Jaz« (j, 17. 11. 2026).
  if (podJazZgoraj(name)) $("#me-tab-top").classList.add("active");
  pinSnapshot(); // posnetek zadnjega zaslona (zagon) ostane na svojem mestu, pravi pogled se pripravi pod njim
  document.querySelectorAll(".view").forEach((v) => {
    if (!v.classList.contains("in-okno") && !v.hasAttribute("data-posnetek")) v.hidden = v.id !== `view-${name}`;
  });
  initView(name, notes);
  syncMeBack(name);
  if (away("scan")) leaveScan(), scanFromChat(false);
  if (away("games")) leaveGames();
  if (away("corner")) closeBoard();
  hideKeyboard(); // odhod z zaslona: Evklidova tipkovnica se zapre (public/tipkovnica.js)
  closeCalcOverlay();
  if (name !== "topic") closePad();
  if (name !== "topic" && name !== "cards") setActiveMode(null);
  refreshBubble();
  peekBar(false, true);
  window.scrollTo(0, 0);
  if (!startHold) startDone();
  rememberScreen();
  snapshotSoon();
}
// Zadnji zaslon (j 2026-11-10, public/zacetek.js): ob naslednjem odprtju aplikacije se odpre ta pogled (z odprto
// lekcijo Učbenika ali temo), če od zadnjega obiska ni minilo več kot 12 ur. Zapis se osveži ob vsaki menjavi
// pogleda in ko stran izgine z zaslona (čas zadnjega obiska, lekcija, odprta med branjem kazala).
const ZACETEK = window.evklidZacetek || null;
let startRec = ZACETEK?.beri() ?? null; // prebrano pred prvim showView, ki zapis prepiše
let startHold = true; // do konca zagona (start) Učna pot ostane skrita: vmesni showView("path") ne sme utripniti
// Konec zagona: oznaki na <html> in posnetek zadnjega zaslona izginejo skupaj, pravi pogled se pokaže v istem izrisu.
const startShot = () => document.querySelector("main[data-posnetek]");
const startDone = () => {
  zasloniPozneje(); // moduli drugih zaslonov po prvem izrisu (zgoraj)
  if (ZACETEK?.konec) return ZACETEK.konec();
  document.documentElement.removeAttribute("data-zacetek");
};
// Posnetek pripnemo na njegovo mesto, pravi pogled se pod njim izriše neviden (style.css html[data-zacetek-pod]).
function pinSnapshot() {
  const shot = startShot();
  const root = document.documentElement;
  if (!shot || root.hasAttribute("data-zacetek-pod")) return;
  const r = shot.getBoundingClientRect();
  Object.assign(shot.style, { top: `${r.top + scrollY}px`, left: `${r.left + scrollX}px`, width: `${r.width}px`, height: `${r.height}px` });
  root.setAttribute("data-zacetek-pod", "");
}
// Posnetek zamenjamo, ko so klici pogleda končani in se 120 ms ni spremenil, najpozneje po 2,5 s (dotik zavihka takoj).
// mark: zadnji klic pred zadnjim zaslonom (Učne poti pod njim ne čakamo); null: čakamo vse.
function finishStart(mark = null) {
  startHold = false;
  // Modul posnetka vnaprej (v miru): ob pagehide se ne naloži več pravočasno.
  setTimeout(() => (window.requestIdleCallback || setTimeout)(loadShot), 1500);
  if (!startShot()) return startDone();
  const last = apiSeq;
  const mine = (id) => mark == null || (id > mark && id <= last);
  const view = document.getElementById(`view-${currentView}`);
  const t0 = performance.now();
  let changed = t0;
  const mo = view && new MutationObserver(() => (changed = performance.now()));
  mo?.observe(view, { childList: true, subtree: true, characterData: true });
  const check = () => {
    if (!startShot()) return mo?.disconnect();
    const now = performance.now();
    if (now - t0 <= 2500 && ([...apiOpen].some(mine) || now - changed < 120)) return setTimeout(check, 40);
    mo?.disconnect();
    startDone();
  };
  setTimeout(check, 40);
}
// Po clearPrivate (odjava, 401) in med zaklepom do naslednje izbire profila (znova) brez zapisa (pregled #560 A2, A3).
const shotClosed = () => ZACETEK?.lahkoShrani?.() === false;
function rememberScreen() {
  if (!ZACETEK || shotClosed() || !state.student || ["onboard", "auth", "account"].includes(currentView) || document.body.classList.contains("auth-mode")) return;
  const rec = { v: currentView, t: Date.now(), s: state.student.id };
  if (currentView === "uci" && uciTab() === "textbook" && openLessonId()) rec.l = openLessonId();
  if (currentView === "topic" && state.topicFx && state.topic?.id) rec.p = state.topic.id;
  localStorageSet(ZACETEK.KEY, JSON.stringify(rec));
  return rec;
}
// Posnetek zadnjega zaslona za hiter zagon (public/posnetek.js, naložen po zagonu; zacetek.js ga pokaže ob odprtju).
let shotMod = null;
const loadShot = () => import("./posnetek.js").then((m) => (shotMod = m)).catch(() => null);
// a = lastnik naprave, z = profil z geslom (zacetek.js počaka strežnik); zaklenjen ali brez gesla: null (izbris).
function shotMeta() {
  const s = state.student;
  if (!s || s.locked || (accountsOn() && s.needs_password)) return null;
  return { a: localStorageGet(ZACETEK.OWNER || "evklid.offline.owner"), z: s.needs_password === false ? 1 : 0 };
}
// Tudi ne ob oknu zaklepa (423) ali ko na napravi ni več izbran ta profil.
const shotAllowed = () =>
  !shotClosed() && !document.getElementById("lock-overlay") && !!state.student && localStorageGet("studentId") === String(state.student.id) && !startHold && !startShot();
function saveSnapshot() {
  if (shotClosed()) return;
  const rec = rememberScreen();
  if (!ZACETEK?.POSNETEK || !shotAllowed()) return;
  if (shotMod) shotMod.shrani(ZACETEK.POSNETEK, rec, shotMeta());
  else loadShot().then((m) => m && shotAllowed() && m.shrani(ZACETEK.POSNETEK, rememberScreen(), shotMeta()));
}
function dropOtherShot(id) {
  if (!ZACETEK?.POSNETEK) return;
  let shot = null;
  try {
    shot = JSON.parse(localStorageGet(ZACETEK.POSNETEK) || "null");
  } catch {}
  if (shot && String(shot.s) !== String(id)) localStorageRemove(ZACETEK.POSNETEK);
}
// Med uporabo: nekaj sekund po menjavi pogleda (telefon lahko aplikacijo v ozadju ustavi brez dogodka).
let shotTimer = 0;
function snapshotSoon() {
  clearTimeout(shotTimer);
  shotTimer = setTimeout(() => (window.requestIdleCallback || setTimeout)(() => document.visibilityState === "visible" && saveSnapshot()), 4000);
}
// Zaslon za odprtje: zapis istega profila, mlajši od 12 ur, in pogled, ki ga ta profil ima; sicer null (Učna pot).
function startScreen() {
  const rec = startRec;
  const v = ZACETEK?.izberi(rec, Date.now());
  if (!v || v === "path" || !state.student || Number(rec.s) !== state.student.id) return null;
  if (v === "topic") return typeof rec.p === "string" && rec.p ? { v, p: rec.p } : null;
  if (!document.querySelector(`.tab[data-view="${v}"]:not([hidden]), #view-me [data-go="${v}"]:not([hidden])`) || !document.getElementById(`view-${v}`)) return null;
  return { v, l: v === "uci" && uciTab() === "textbook" && typeof rec.l === "string" ? rec.l : null };
}
async function openStartScreen(z) {
  await pripraviIzris().catch(() => null); // zadnji zaslon ima skoraj vedno formule: brez nadomestkov
  if (z.v === "topic") {
    try {
      await openTopic(z.p);
    } catch {} // brez povezave ali tema ne obstaja več: ostane Učna pot
    return;
  }
  if (z.l) openLesson(z.l);
  else showView(z.v);
}
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden" && (currentView === "chat" || isFloating("chat"))) leaveChat();
  if (document.visibilityState === "hidden") return saveSnapshot();
  // Vrnitev iz ozadja z odprtim inštruktorjem: pravilo »10 min zunaj« (freshChatIfStale) velja tudi tu (j, 14. 11. 2026).
  if (currentView === "chat" || isFloating("chat")) freshChatIfStale();
  // Nameščena aplikacija, ki je v ozadju ostala odprta več kot 12 ur: Učna pot, kot ob novem odprtju.
  const installed = matchMedia("(display-mode: standalone)").matches || / EvklidApp\//.test(navigator.userAgent);
  // Tekmovanje z uro ali neposlano besedilo (klepet, odgovor) ostaneta na zaslonu.
  const busy = state.contestTimer || unsentText();
  if (installed && !busy && hiddenAt && Date.now() - hiddenAt > (ZACETEK?.MAX ?? Infinity) && state.student && currentView !== "path" && !document.body.classList.contains("auth-mode")) showView("path");
});
window.addEventListener("pagehide", saveSnapshot);
// Točka B2 (pilot): odprtje dela aplikacije se zabeleži na strežniku (server/odpiranje-delov.js) največ enkrat na dan,
// del in profil; strežnik hrani samo prvi in zadnji dan ter število dni. Brez povezave ali 5xx: poskusi ob naslednjem odprtju.
const DEL_POGLEDA = { chat: "instruktor", topic: "vadnica", cards: "vadnica", exams: "vadnica", competition: "vadnica", games: "igre" };
const odprtoDanes = new Set();
let brezStetja = false; // zadnji zaslon in okna, obnovljena ob zagonu, niso odprtje (učenec jih ni odprl sam)
function odprto(del) {
  const id = state.student?.id;
  if (!id || !del || brezStetja) return;
  const k = `${id}:${del}:${new Date().toISOString().slice(0, 10)}`;
  if (odprtoDanes.has(k)) return;
  odprtoDanes.add(k);
  const ne = () => odprtoDanes.delete(k);
  fetch(`/api/students/${id}/odprto`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ del }), keepalive: true })
    .then((r) => r.ok || r.status < 500 || ne()) // 4xx (npr. profil odprt drugje) se ne popravi s ponovitvijo
    .catch(ne);
}
// Priprava pogleda ob prikazu (glavni del ali premično okno); ne spremeni trenutnega pogleda in zgodovine.
function initView(name, notes = false) {
  odprto(DEL_POGLEDA[name]);
  if (name === "chat") {
    freshChatIfStale();
    zgodovinaVidna();
    pripraviZaznavalnik();
    prefetchConversations(); // računalnik: seznam pogovorov je ob klepetu
  }
  if (name === "me") {
    renderMe();
    whenIdle(prefetchLeague); // naslednji klik z »Jaz«: Lige rabijo strežnik, ostale vrstice ne
  }
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
  if (name === "path") {
    loadPath();
    preveriAnketo(); // B3: anketa po 7 dneh (public/anketa-teden.js)
  }
  if (name === "competition") (regionalExams() ? loadExams() : loadCompetition());
  if (name === "exams") loadExams();
  if (name === "feedback") showFeedback();
  if (name === "pilot") showPilot();
  if (name === "games") showGames();
  if (name === "zbirke") {
    showZbirke(zbOpen.item, zbOpen.from);
    zbOpen = {};
  }
  if (name === "corner") showCorner();
  if (name === "cards") {
    setActiveMode("cards");
    if (notes) showNotes();
    else showFlashcards();
  }
  if (name === "graph") showGraph();
}
// ---------- spodnja vrstica se pri branju umakne (telefon, tablica na dotik; touch.css) ----------
// Kje se umakne, določa touch.css (vrstica je takrat position: fixed in skrita pod robom). Poteg navzdol (drsenje
// nazaj gor) ali kolešček gor jo pokaže (body.tb-peek), poteg navzgor jo spet skrije; v lekciji Učbenika samo ob
// robu (lessonEdge) ali ko drsenje udari v vrh ali dno. Med pisanjem (odprta tipkovnica) se ne pokaže. Na vseh teh zaslonih je v glavi gumb Nazaj.
const tabbarEl = $("#tabbar");
// Vrstica, ki je zaradi neuporabe (body.tb-mir) ali vrnitve iz nje (tb-vraca) pritrjena, ni zaslon za branje (noga.js).
const barAuto = () => !!tabbarEl && !document.body.matches(".tb-mir, .tb-vraca") && getComputedStyle(tabbarEl).position === "fixed";
const typing = () => !!document.activeElement?.matches?.('textarea, [contenteditable="true"], input:not([type="checkbox"], [type="radio"], [type="range"], [type="button"], [type="submit"])');
const NO_SWIPE = "#tabbar, canvas, input[type=range], .pad, .graph-slot, .demo, .okno, .tour";
// soon (menjava pogleda): --tabbar-h v naslednjem okvirju pred risanjem; branje sloga sredi tapa je vsililo slog in
// postavitev novega pogleda. Pokazana vrstica (drsenje) ga popravi takoj, da vrstica za pisanje ne ostane pod njo.
let tabbarRaf = 0;
function peekBar(on, soon = false) {
  if (on && typing()) on = false;
  if (document.body.classList.contains("tb-peek") !== on) document.body.classList.toggle("tb-peek", on);
  if (!soon) syncTabbarH();
  else tabbarRaf ||= requestAnimationFrame(() => ((tabbarRaf = 0), syncTabbarH()));
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
// Po 3 s neuporabe se vrstica skrije (j 2026-11-14, 3 s od 2026-11-15), kjer ni že drugače določeno (public/noga.js).
nastaviNogo({ bar: tabbarEl, sync: syncTabbarH, skrijPokukano: () => peekBar(false) });
$("#chat-back").addEventListener("click", () => showView(!["chat", "onboard", "auth"].includes(prevView) && !isFloating(prevView) ? prevView : "path"));

// Zavihek pogleda v premičnem oknu okno le prinese v ospredje (branje, vnos in drsenje v njem ostanejo).
document.querySelectorAll(".tab").forEach((t) => t.addEventListener("click", () => (isFloating(t.dataset.view) ? focusWindow(t.dataset.view) : showView(t.dataset.view))));

// Tipka Nazaj (Android, aplikacija na začetnem zaslonu, APK, brskalnik) gre po plasteh (j 2026-11-10):
// okno ali tipkovnica → podstran (lekcija, poskus, igra) → seznam → … → Učna pot; na Učni poti sta za izhod
// potrebna dva pritiska (ob prvem obvestilo). Zgodovina ima tri ravni in se ne nabira:
//   0  vstop (zapis brskalnika, history.state brez »stm«); od tu Nazaj zapusti aplikacijo,
//   1  Učna pot ({ stm: 2 }, »varovalo«): Nazaj z nje pride na raven 0, kjer pokažemo obvestilo,
//   2  trenutni pogled ali okno na Učni poti ({ stm: 1, v }).
// Vsak pritisk Nazaj je popstate; po njem zapis, s katerega smo prišli, postavimo nazaj (keep / ensureGuard).
// APK (mobile/src/app/web.tsx) gre nazaj po isti zgodovini (goBack), zato tam ni treba ničesar spreminjati.
let currentView = "path";
let prevView = "path"; // za gumb Nazaj v glavi klepeta (telefon)
const BACK_ORIGIN = ["schedule", "exams", "competition", "scan"]; // »←« na teh podstraneh: meBackTarget (skener se odpre tudi z Učne poti)
const meBackFrom = {};
let fromBack = false;
let skipPop = 0;
let overlayEntry = false; // zapis v zgodovini samo za okno, odprto na Učni poti
let exitTimer = 0; // teče po prvem pritisku Nazaj na Učni poti: drugi pritisk v tem času zapre aplikacijo
const EXIT_MS = 3500; // toliko je vidno tudi obvestilo (toast)
const atTop = () => history.state?.stm !== 1;
const atEntry = () => history.state?.stm == null; // raven 0
// Varovalo pod Učno potjo: brez njega bi prvi pritisk Nazaj na Učni poti zaprl aplikacijo brez obvestila.
function ensureGuard() {
  clearTimeout(exitTimer);
  exitTimer = 0;
  if (atEntry()) history.pushState({ stm: 2 }, "");
}
function syncHistory(name) {
  if (fromBack) return;
  if (name === "path") {
    // Korak nazaj že čaka (history.back je asinhron, history.state se še ni spremenil):
    // drugi klic bi šel čez prvi zapis aplikacije, npr. ob osvežitvi na podstrani na about:blank.
    if (!atTop() && !skipPop) {
      skipPop++;
      overlayEntry = false;
      history.back();
    } else if (!skipPop) ensureGuard();
    return;
  }
  ensureGuard();
  const entry = { stm: 1, v: name };
  if (atTop()) history.pushState(entry, "");
  else history.replaceState(entry, "");
}
// Okno se je odprlo: na Učni poti dodamo zapis, da ga tipka Nazaj zapre namesto aplikacije.
function overlayOpened() {
  if (currentView === "path" && atTop()) {
    ensureGuard();
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
// Odprto okno <dialog> (kviz, video, namestitev …): kot Esc. Okno, ki zaprtje ureja samo (cancel), odloči samo.
function closeTopDialog() {
  const dlg = [...document.querySelectorAll("dialog[open]")].pop();
  if (!dlg) return false;
  if (dlg.dispatchEvent(new Event("cancel", { cancelable: true }))) dlg.close();
  return true;
}
// Majhna okna, ki jih zapre Esc (meni porabe, izbira predmeta, spustni seznam, ogled predmeta zbirke …): Nazaj
// pošlje Esc in pogleda, ali se je na strani kaj zaprlo. Polja za pisanje ga ne dobijo (tam Esc briše vnos).
function closeByEsc() {
  const sig = () => [document.querySelectorAll("[hidden]").length, document.querySelectorAll("body *").length, document.querySelectorAll(".open, [open], [aria-expanded='true']").length].join();
  const before = sig();
  const ev = new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true });
  document.body.dispatchEvent(ev);
  return ev.defaultPrevented || sig() !== before;
}
// Telefon: spodnja vrstica je v postavitvi, tudi ko se na zaslonu za branje (klepet, tema, kalkulator) umakne. Takrat je
// position: fixed (touch.css) in offsetParent je vedno null, zato beremo display.
const tabbarShown = () => getComputedStyle($("#tabbar")).display !== "none";
// En korak Nazaj: zapre najvišjo plast ali odpre pogled nad trenutnim. Vrne false, ko na Učni poti ni česa zapreti.
function backStep(wasOverlay) {
  // Okna in meniji: Nazaj jih le zapre, pogled ostane.
  if (closeTopDialog()) return true;
  // »Povečaj risbo« v poskusu (public/sim/lab.js): vrhnja plast nad vsem, Nazaj jo zapre in poskus ostane odprt.
  const povecava = document.querySelector(".demo-stage.lab-povecano .lab-zoom");
  if (povecava) {
    povecava.click();
    return true;
  }
  // Okno pomena črke (formula-info.js), pola, meni pod klobukom ali profilom.
  if (closeFormulaPop() || closePaperViewer() || closeOurPaper() || closeQuickStart() || closeProfileMenu()) return true;
  if (installSheetOpen()) {
    closeInstallSheet({ fromBack: true });
    return true;
  }
  if (document.querySelector(".razpri")) {
    closeFull({ dismiss: true }); // okno s celim besedilom (public/razpri.js)
    return true;
  }
  // Evklidova tipkovnica (public/tipkovnica.js) in plošča za risanje čez cel zaslon (public/pad.js).
  if (keyboardOpenFor()) {
    hideKeyboard({ blur: true });
    return true;
  }
  if (padIsSheet()) {
    closePad();
    return true;
  }
  // Kalkulator čez cel zaslon: najprej plast v njem (plošča funkcij ali konstant, meni vrstice grafa, povečan graf), nato okno.
  if (calcOverlayOpen()) {
    if (!calcBack()) closeCalcOverlay({ fromBack: true });
    return true;
  }
  if (cornerBack()) return true;
  // Poskus, ki ga je odprl inštruktor (okno nad pogovorom, public/odpri.js).
  if (simOverlayOpen()) {
    closeSimOverlay();
    return true;
  }
  // 3D čez cel zaslon (»Uči se« → 3D svet ali povezava iz lekcije) tudi, ko je »Uči se« v premičnem oknu nad drugim pogledom.
  if (isOpen3d()) {
    leaveUci();
    return true;
  }
  if (wasOverlay && currentView === "path") return true;
  if ($("#tour") && !$("#tour").hidden) {
    startTour.end?.(); // Nazaj zapre vodič (kot Esc ali »Preskoči«)
    return true;
  }
  if ($(".sidebar").classList.contains("open") && $("#toggle-sidebar").offsetParent && tabbarShown()) {
    setSidebar(false); // seznam pogovorov na telefonu
    return true;
  }
  // Plast v pogledu Kalkulator; šele za 3D in drugimi plastmi, ki ga prekrijejo.
  if (currentView === "graph" && calcBack()) return true;
  // Podstran pogleda: lekcija → kazalo, poskus → seznam, igra → seznam iger …
  if (currentView === "uci" && uciBack({ textbookBack, labBack })) return true;
  if (currentView === "games" && gamesBack()) return true;
  if (currentView === "scan" && scanBack()) return true;
  if (currentView === "scan" && state.scanFromChat) return showView("chat"), true; // skener iz kamere v Inštruktorju
  if (closeByEsc()) return true;
  if (currentView === "path") return false;
  const subMe = currentView !== "me" && (meView(currentView) || podJazZgoraj(currentView));
  // Telefon: s podstrani »Jaz« nazaj na »Jaz« (tudi s Kalkulatorja, saj tja vodi tudi gumb ← v njegovi glavi).
  // Tema ali naloge s Tekmovanj ali iz »NPZ in matura«: nazaj na ta seznam.
  // Urnik, NPZ/matura, Tekmovanja: tja, od koder je učenec prišel (kot gumb »←«, meBackTarget).
  const up = subMe && (tabbarShown() || podJazZgoraj(currentView)) ? (BACK_ORIGIN.includes(currentView) ? meBackTarget(currentView) : "me") : currentView === "topic" && ["competition", "exams"].includes(state.backTo) ? state.backTo : "path";
  if (up !== "path") {
    showView(up); // zapis v zgodovini doda showView (syncHistory)
    return true;
  }
  fromBack = true;
  try {
    showView("path");
  } finally {
    fromBack = false;
  }
  return true;
}
window.addEventListener("popstate", () => {
  // Pred prijavo (pristajalna stran, prijava, registracija) Nazaj ureja account.js.
  if (document.body.classList.contains("auth-mode")) return;
  if (skipPop) {
    skipPop--;
    if (skipPop) return;
    ensureGuard();
    // Medtem odprt drug pogled (npr. takoj po zagonu) dobi svoj zapis, da Nazaj ne zapre aplikacije.
    if (currentView !== "path" && atTop()) history.pushState({ stm: 1, v: currentView }, "");
    return;
  }
  // Naprej (brskalnik) na zapis pogleda: pogledov ne obnavljamo iz zgodovine, zato se vrnemo.
  if (!atTop()) {
    skipPop++;
    history.back();
    return;
  }
  const wasOverlay = overlayEntry;
  overlayEntry = false;
  const entry = atEntry(); // Nazaj z ravni Učne poti (sicer z ravni pogleda)
  if (backStep(wasOverlay)) {
    ensureGuard();
    if (currentView !== "path" && atTop()) history.pushState({ stm: 1, v: currentView }, "");
    return;
  }
  // Učna pot, nič odprtega. Z ravni pogleda (zastarel zapis) samo ostanemo; z ravni Učne poti je to prvi pritisk
  // za izhod: zapis varovala vrnemo šele čez EXIT_MS, zato drugi pritisk do takrat zapusti aplikacijo.
  if (!entry) return;
  toast(t("nav.exitAgain"), "log-out");
  clearTimeout(exitTimer);
  exitTimer = setTimeout(ensureGuard, EXIT_MS);
});

// Glavni zavihki zgornje vrstice na računalniku; vse ostalo s strani »Jaz« je pod zavihkom »Jaz« (index.html data-pod-jaz).
const TOP_MAIN = ["path", "uci", "chat", "scan", "graph", "competition"];
const podJazZgoraj = (name) => name !== "me" && !TOP_MAIN.includes(name) && (meView(name) || name === "exams");
const ME_VIEWS = ["me", "progress", "league", "settings", "account", "feedback", "graph", "games", "corner", "schedule", "zbirke", "scan", "pilot"];
// Četrto mesto spodnje vrstice: Laboratorij ali »NPZ in matura« (ko je cilj NPZ/matura); kar ni tam, je pod »Jaz«.
const meView = (name) => ME_VIEWS.includes(name) || (!!name && offTabbarViews().includes(name));
// Zbirke in nagradna pot: odpre pogled, po želji s predmetom v pogledu »preglej« (from = pogled za Nazaj).
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
  $("#me-feedback").hidden = $("#feedback-tab").hidden;
  loadMeOverview();
}
// Pregled na strani Jaz (j, 4. 11. 2026: prazen spodnji del strani naj bo izkoriščen): koledar aktivnosti,
// »Nadaljuj« (današnji trening) in prihodnji testi iz Urnika. Brez povezav, ki so tik ob njem že na zaslonu
// (j, 12. 11.): Učna pot in Inštruktor sta v spodnji vrstici, Napredek in Urnik v seznamu nad pregledom.
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
      <div class="me-ov-head"><h2>${t("akt.title")}</h2></div>
      ${heatmapHtml(p?.xpDays || [])}
    </div>
    <div class="card me-next">
      <h2>${t("qs.title")}</h2>
      <div class="list-card">
        ${row("daily", "zap", t("daily.title"), t("daily.about"))}
      </div>
    </div>
    <div class="card me-tests">
      <div class="me-ov-head"><h2>${t("sch.upcoming")}</h2></div>
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
  if (!e.target.closest(".me-back")) return;
  if (e.target.closest("#view-scan") && state.scanFromChat) return showView("chat");
  showView(meBackTarget(e.target.closest(".view")?.id.replace(/^view-/, "")));
});
document.querySelectorAll("#view-me [data-go], #settings-account [data-go]").forEach((b) =>
  b.addEventListener("click", () => (b.dataset.go === "account" ? $("#account-tab").click() : showView(b.dataset.go))),
);
// Klik na kartico s profilom (in »Druga šola ali stopnja …« v glavi Inštruktorja): Nastavitve, na mestu šole in
// letnika (pod njimi je povezava na Račun). Tam veljajo vsa pravila izbire (stopnja, program, šolski sistem).
$("#me-head")?.addEventListener("click", () => openSchoolSettings());
function openSchoolSettings() {
  showView("settings");
  const el = $("#settings-form .level-field") || $("#settings-form");
  requestAnimationFrame(() => {
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    const card = $("#settings-form");
    card?.classList.remove("flash-target");
    void card?.offsetWidth;
    card?.classList.add("flash-target");
  });
}


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

let zagonIzbira = false; // izbira profila v start (zagon ali prijava), ki nato sam pokaže Učno pot
async function selectStudent(id) {
  const target = state.students.find((s) => s.id === Number(id));
  // Vsak profil ima svoje geslo (z računi): zaklenjen profil najprej odklenemo, profil brez gesla ga dobi.
  // Uporabnik lahko namesto tega izbere drug profil; seznam se nato naloži znova (stanje zaklepa profilov se je lahko spremenilo).
  // Brez povezave s strežnikom (shranjena kopija) računi niso vklopljeni: odpremo profil za vadbo brez gesla,
  // zaklenjenega pa ne (zanj ni shranjenih nastavitev).
  if (target?.locked || (target && accountsOn() && target.needs_password)) ZACETEK?.pozabi?.(); // zaklenjen profil: posnetek njegovega zaslona izgine
  if (target && accountsOn() && (target.locked || target.needs_password)) return loadStudents(await openProfileLock(target, state.students));
  if (target?.locked) {
    const open = state.students.find((s) => !s.locked);
    // Vsi profili zaklenjeni: brez strežnika ni kaj odpreti; ob zagonu bootFailed pokaže »ni dosegljiva« in počaka.
    if (!open) throw new Error(t("lock.offline"));
    $("#student-select").value = open.id;
    return selectStudent(open.id);
  }
  dropOtherShot(target?.id); // menjava profila: posnetek zaslona prejšnjega profila izgine takoj
  if (target) ZACETEK?.znova?.(); // izbran odklenjen profil: zapis zadnjega zaslona in posnetka spet velja
  state.student = target;
  state.aiOut = false; // delež drugega profila ne skrije »Razloži podrobneje« (osveži ga naslednji odgovor)
  keptPaper = null;
  nalogaPole?.pozabi(); // izbrani izvirniki pol (public/naloga-pole/klepet.js) so od prejšnjega profila
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
  // Učna pot novega profila takoj, hkrati s seznamom pogovorov (prej šele za njim: dva čakanja strežnika zapored).
  state.pathKey = null;
  state.modes = null; // »Nadaljuj z učenjem« in goNew ne smeta pokazati naslednje teme prejšnjega profila
  clearLevelCard();
  maybeTour.done = false; // vodič je za vsak profil posebej (settings.tour_version)
  refreshProfileButton();
  // Ob zagonu Učno pot pokaže start (showView takoj za izbiro profila): brez dvojnega izrisa poti pred prvim prikazom.
  if (!zagonIzbira && (!$("#view-path").hidden || !$("#view-topic").hidden)) showView("path");
  await loadConversations();
  // Nov pogovor ob odprtju (j 2026-11-14): zadnji pogovor samo, če je bil učenec v inštruktorju pred manj kot 10 min.
  const keep = chatKeepId();
  if (keep) await openConversation(keep, { mark: false });
  else renderEmptyChat();
  if (!$("#view-settings").hidden) fillSettingsForm();
  if (!$("#view-progress").hidden) loadProgress();
  if (!$("#view-me").hidden) renderMe(); // pregled (aktivnost, testi) novega profila
  if (!$("#view-league").hidden) loadLeague(state.student.id);
  if (!$("#view-scan").hidden) showScan(); // naloga prejšnjega profila ne ostane na zaslonu
  if (!$("#view-lab").closest("[hidden]")) showLab(); // zaklep in vrstni red poskusov sta po profilu
  // Tekmovanja, Izpiti ter NPZ in matura: izbira in rezultati prejšnjega profila ne ostanejo na zaslonu.
  state.examKey = state.compKey = null;
  state.examRaven = null;
  if (!$("#view-exams").hidden) showView(siExams() ? "exams" : "path");
  if (!$("#view-competition").hidden) showView(isUni(state.student.settings) ? "path" : "competition");
  // Drugi pogledi v premičnih oknih pokažejo podatke novega profila (zgornji so se že osvežili).
  for (const v of floatingViews()) if (!["settings", "progress", "league", "scan", "path", "exams", "competition", "games"].includes(v)) v === "account" ? renderAccount() : initView(v);
  refreshProfileButton();
  refreshXp();
  loadPilot(); // naloge za člane pilota (vrstica v Jaz, obvestilo ob prvi prijavi)
  // Vprašalnik zanimanj in vodič prideta šele po prvi rešeni nalogi, na Učni poti (maybeIntro, j 15. 11. 2026).
  state.interestsAsk = null;
  renderFeedbackCard(); // kartica mnenja šele od drugega dne profila
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
    li.dataset.id = c.id; // prenos vnaprej ob dotiku (prefetchConversations)
    li.innerHTML = `<span>${escapeHtml(c.title)}</span><button title="${t("chat.delete")}" aria-label="${t("chat.delete")}">${icon("trash-2")}</button>`;
    // Klik kjerkoli v vrstici (ne le na besedilu): dotik ob robu vrstice je prej samo zaprl seznam (j, 17. 11. 2026).
    li.addEventListener("click", () => openConversation(c.id));
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
  zgodovina = { conv: null, ostala: [], prvo: null, zadnji: {} };
  state.chatFx = null; // nov pogovor (tudi po brisanju odprtega ali menjavi profila): predmet iz nastavitev
  $("#chat-title").textContent = t("chat.new");
  state.ideasNow = null; // nov prazen klepet: novi predlogi
  const ideas = chatIdeas(state.student);
  // .empty-hall: okvir pozdrava (ui.css → »Klepet obdobja«: s chat.frame »stebri« pročelje templa iz
  // ERAS[…].arch.temple, templeParts doda dele in jih ob menjavi sloga zamenja; »pilon« iz ERAS[…].building enako).
  $("#messages").innerHTML = `<div class="empty"><div class="empty-hall">
    <div class="tutor-avatar big" aria-hidden="true">${icon("sparkles")}</div>
    <p class="big">${t("chat.hello", { name: escapeHtml(state.student.name) })}</p>
    <p>${t("chat.intro")}</p>
    <div class="ideas">${ideasHtml(ideas)}</div></div>
    ${greekFactHtml("gr-chat")}</div>`;
  templeParts();
  wireGreekFacts($("#messages"));
  // Predlog se pošlje takoj in inštruktor nanj odgovori (j, 3. 11.): ni ga treba še enkrat poslati.
  // Če je učenec že kaj napisal ali dodal fotografijo, predlog gre v polje (da se nič ne izgubi).
  renderState(null);
  if (!ideasPath(state.student)) refreshIdeas();
  aiOznaka();
}
// AI Act čl. 50 (public/ai-oznaka/)
// Oznaka je v Inštruktorju: ob zagonu (Učna pot) šele po prvem izrisu, sicer takoj.
function aiOznaka() {
  const go = () => import("./ai-oznaka/ai-oznaka.js").then((m) => m.oznaciKlepet(state.student)).catch(() => {});
  if (pozneje || currentView === "chat" || isFloating("chat")) return go();
  // Na Učni poti počaka, da so zasloni za prvi klik preneseni (zasloni-vnaprej.js), a ne dlje, kot je Inštruktor skrit.
  return new Promise((ok) => poZagonu(() => Promise.race([vnaprejGotovo, new Promise((r) => (oznakaZdaj = r))]).then(go).then(ok)));
}
$("#messages").addEventListener("click", ideaClick); // enkrat: predlogi se ob osvežitvi zamenjajo
function ideaClick(e) {
  const b = e.target.closest?.("[data-idea]");
  if (!b) return;
  if (!$("#input").value.trim() && !state.image) return send(b.dataset.idea);
  fillInput(b.dataset.idea);
}
const ideasHtml = (ideas) => ideas.map((x) => `<button type="button" class="idea" data-idea="${escapeHtml(x)}">${escapeHtml(x)}</button>`).join("");

// Predlogi v praznem klepetu po profilu in vsakič drugačni (public/predlogi.js). Izbrani predlogi ostanejo isti,
// dokler je odprt isti prazen klepet (sicer bi se ob vsakem osveženju zamenjali pred očmi); nov klepet = novi predlogi.
const ideasKey = (s) => [s?.subject, s?.educational_track, s?.curriculum_level, s?.study_program, s?.study_course, s?.school_system].join("|");
const ideasPath = (st) => (state.ideasPath && state.ideasPath.student === st?.id && state.ideasPath.key === ideasKey(st?.settings) ? state.ideasPath : null);
function chatIdeas(st) {
  const path = ideasPath(st);
  const key = `${st?.id}|${ideasKey(st?.settings)}|${path?.topics?.length || path?.next ? 1 : 0}`; // pot brez tem = splošni predlogi, brez ponovnega žrebanja
  if (state.ideasNow?.key !== key) state.ideasNow = { key, list: pickIdeas(st?.settings || {}, path, t) };
  return state.ideasNow.list;
}
// Učna pot za predloge: shrani jo loadPath; sicer (klepet odprt pred Učno potjo, menjava v glavi) jo naložimo tu.
async function refreshIdeas() {
  const st = state.student;
  if (!st || ideasPath(st)) return showIdeas();
  try {
    const p = await api(`/api/students/${st.id}/path`);
    rememberIdeasPath(st, p);
  } catch { return; }
  showIdeas();
}
function rememberIdeasPath(st, p) {
  if (!st || !p) return;
  state.ideasPath = { student: st.id, key: ideasKey(st.settings), next: p.next || null, topics: (p.units || []).flatMap((u) => u.topics || []) };
}
function showIdeas() {
  const box = $("#messages .empty-hall .ideas");
  if (!box || state.conversationId || !state.student) return;
  box.innerHTML = ideasHtml(chatIdeas(state.student));
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
  // Izbira načina kaže nastavitev, ki jo spreminja, ne načina zadnjega odgovora (META): sicer je po
  // zamenjavi v glavi spet pisalo »Vodenje«, čeprav je bila nastavitev že celotna rešitev (j 14. 11.).
  const mode = s.solving_mode || "A";
  const program = isUni(s) ? programsCache().find((p) => p.id === s.study_program)?.label : null;
  // Predmet, način in letnik se zamenjajo kar v glavi (izbirni seznam), program je le napis.
  const pick = (key, label, options) =>
    `<span class="chip chip-pick"><select data-pick="${key}" aria-label="${escapeHtml(label)}">${options}</select></span>`;
  const opt = (value, label, current, attrs = "") => `<option value="${escapeHtml(value)}"${current ? " selected" : ""}${attrs}>${escapeHtml(label)}</option>`;
  const levels = levelChoices(s);
  const ravni = ravenChoices(s);
  const head = $("#chat-state");
  head.innerHTML = [
    SUBJECT_NAMES[subject] && pick("subject", t("set.subject"), opt(subject, SUBJECT_NAMES[subject], true)),
    MODE_NAMES[mode] && pick("mode", t("set.mode"), Object.entries(MODE_NAMES).map(([k, v]) => opt(k, v, k === mode)).join("")),
    program && `<span class="chip">${escapeHtml(program)}</span>`,
    // Zadnja izbira »Druga šola ali stopnja …« odpre Jaz → Šola in letnik (prehod OŠ ↔ SŠ ↔ fakulteta, drug sistem; #792).
    // SŠ: letnik in raven matematike v enem seznamu (»3. letnik OR«), da glava na telefonu (360 px) ne gre čez rob.
    levelLabel(s.curriculum_level) &&
      // Ime seznama pove tudi raven; trenutna raven ima kljukico (data-checked), pred »Druga šola …« je črta (data-sep; dropdown.js).
      pick("level", ravni.length ? `${t("set.school")}, ${t("tbk.level")}` : t("set.school"), (() => {
        const years = levels.length ? levels.map((x, i) => opt(i, x.label, x.current)).join("") : opt("", levelLabel(s.curriculum_level), true);
        const grp = (label, html) => `<optgroup label="${escapeHtml(label)}">${html}</optgroup>`;
        const raven = (x, i) => opt(`r${i}`, x.label, false, x.current ? " data-checked" : "");
        return (ravni.length ? grp(t("tbk.year"), years) + grp(t("tbk.level"), ravni.map(raven).join("")) : years) + opt("other", t("chat.levelOther"), false, " data-sep");
      })()),
  ]
    .filter(Boolean)
    .join("");
  wireStatePicks(head, subject, levels, ravni);
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

async function wireStatePicks(head, subject, levels, ravni = []) {
  const save = async (settings, what, label) => {
    const updated = await api(`/api/students/${state.student.id}`, { method: "PUT", body: { settings } });
    studentUpdated(updated);
    toast(`${what}: ${label}`, "check");
  };
  head.querySelector('[data-pick="mode"]')?.addEventListener("change", (e) =>
    save({ solving_mode: e.target.value }, t("set.mode"), MODE_NAMES[e.target.value]).catch(() => renderState(null)),
  );
  head.querySelector('[data-pick="level"]')?.addEventListener("change", (e) => {
    if (e.target.value === "other") return renderState(null), openSchoolSettings(); // izbira v glavi ostane sedanja
    // Raven matematike (SŠ, »r0«…): ostaneta letnik in predmet, spremeni se le OR/VR/še ne vem.
    if (e.target.value.startsWith("r")) {
      const r = ravni[Number(e.target.value.slice(1))];
      if (!r || r.current) return renderState(null);
      return save({ ...r.settings }, t("tbk.level"), r.label).catch(() => renderState(null));
    }
    if (!levels[Number(e.target.value)]) return;
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

// Nov pogovor v inštruktorju (j 2026-11-14): ko je učenec 10 min ali več zunaj inštruktorja (tudi z zaprto
// aplikacijo) ali je medtem odprl drugo temo, kot je tema pogovora, se inštruktor odpre na novem pogovoru.
// Stari pogovori ostanejo v seznamu »Pogovori«; nedokončano vprašanje v polju se nikoli ne izgubi.
const CHAT_FRESH_MS = 10 * 60 * 1000;
const chatSeenKey = () => `evklid.chatSeen.${state.student?.id}`;
const chatTopicKey = () => `evklid.chatTopic.${state.student?.id}`;
const readRec = (k) => {
  try {
    return JSON.parse(localStorageGet(k) || "null");
  } catch {
    return null;
  }
};
// Učenec je (bil) v inštruktorju: čas in odprti pogovor.
function markChat() {
  if (state.student) localStorageSet(chatSeenKey(), JSON.stringify({ t: Date.now(), conv: state.conversationId }));
}
// Odprta tema (učna pot, lekcija): za pravilo »druga tema«.
function markTopic(id) {
  if (state.student && id) localStorageSet(chatTopicKey(), JSON.stringify({ id, t: Date.now() }));
}
// Ali pogovor po pravilu ostane (zadnji obisk pred manj kot 10 min in vmes ni bila odprta druga tema).
function chatStillFresh(convTopic) {
  const seen = readRec(chatSeenKey());
  if (!seen || !(Date.now() - seen.t < CHAT_FRESH_MS)) return false;
  const tp = readRec(chatTopicKey());
  return !(convTopic && tp && tp.t >= seen.t && tp.id !== convTopic);
}
// Ob zagonu: id pogovora, ki naj ostane odprt, ali null (nov pogovor).
function chatKeepId() {
  const seen = readRec(chatSeenKey());
  const conv = seen?.conv && state.conversations.find((c) => c.id === seen.conv);
  return conv && chatStillFresh(conv.path_topic ?? null) ? conv.id : null;
}
// Inštruktor se prikaže: zastarel pogovor zamenja nov (razen z nedokončanim besedilom v polju ali med odgovorom).
// Samo ob vrnitvi (chatAway): klik zavihka ali okna, ko je učenec že v inštruktorju, pogovora ne zamenja.
let chatAway = true;
function leaveChat() {
  markChat();
  chatAway = true;
}
function freshChatIfStale() {
  if (!state.student) return; // profil se še nalaga
  const back = chatAway;
  chatAway = false;
  if (!state.conversationId) return; // nov pogovor je že odprt
  if (!back || state.sending || $("#input")?.value.trim()) return markChat();
  if (!chatStillFresh(state.convTopic)) {
    state.conversationId = null;
    state.convTopic = null;
    state.chatFx = null;
    renderConversationList();
    renderEmptyChat();
    refreshBubble();
  }
  markChat();
}

async function openConversation(id, { mark = true } = {}) {
  const conv = await api(`/api/conversations/${id}`);
  state.conversationId = conv.id;
  state.convTopic = conv.topic?.id || null;
  if (mark) markChat();
  await setChatFx(conv);
  if (state.conversationId !== conv.id) return; // medtem odprt drug pogovor
  $("#chat-title").textContent = conv.title;
  const box = $("#messages");
  box.innerHTML = "";
  if (!conv.messages.length) renderEmptyChat();
  izrisiZgodovino(conv.id, conv.messages);
  renderState(conv.state);
  renderConversationList();
  const oznaka = aiOznaka();
  prilagodiZdaj(); // zložene formule (sirina.js) so višje: na dno šele zdaj
  box.scrollTop = box.scrollHeight;
  // Obvestilo »AI« nad pogovorom (prvi pogovor profila) pride za pomikom; brskalnik ga ne izravna vedno: še enkrat na dno,
  // če se učenec vmes ni premaknil.
  const st = box.scrollTop;
  oznaka.then(() => state.conversationId === conv.id && box.scrollTop === st && (box.scrollTop = box.scrollHeight));
  // Pogovor, odprt takoj po zagonu, ko knjižnice za formule (rich.js) še prihajajo: nadomestke zamenja višji izris.
  // Ko so zamenjani, še enkrat na dno, razen če se je učenec vmes pomaknil navzgor.
  if (!izrisNared()) pripraviIzris().then(() => requestAnimationFrame(() => {
    if (state.conversationId !== conv.id || !box.clientHeight || box.scrollTop < st - 2) return;
    prilagodiZdaj();
    box.scrollTop = box.scrollHeight;
  }), () => {});
  zgodovina.naDno = !box.clientHeight; // skrit Inštruktor (zagon, menjava profila): na dno, ko se pokaže
  refreshBubble();
  dopolniKmalu(); // kratka zadnja sporočila ne napolnijo zaslona: starejša takoj za prvo sliko
}

// Dolg pogovor se odpre takoj (docs/meritve/prijavljen-mobilno-2026-11-19.md, 1. točka: 120 sporočil je na telefonu
// trajalo 11 s, ker je vsako sporočilo posebej merilo formule in pomikalo na dno). Izrišemo zadnjih ZGODOVINA_NAJPREJ
// sporočil brez meritev, formule prilagodimo in na dno pomaknemo enkrat; starejša pridejo po ZGODOVINA_PO, ko se
// učenec pomakne proti vrhu (dopolniZgodovino), mesto na zaslonu pa ostane isto.
const ZGODOVINA_NAJPREJ = 20;
const ZGODOVINA_PO = 20;
// conv: pogovor, ostala: še neizrisana starejša sporočila (od najstarejšega), prvo: najstarejše izrisano sporočilo (starejša gredo pred njega), zadnji: kateremu od neizrisanih pripadajo gumbi,
// ki so samo pri zadnjem takem odgovoru (addDeepButton, addFullButton, addChoices).
let zgodovina = { conv: null, ostala: [], prvo: null, zadnji: {} };
// Po naslednji sliki, v svoji nalogi (ne v tapu ali drsenju), največ ena čakajoča naenkrat.
let dopolniCaka = false;
function dopolniKmalu() {
  if (dopolniCaka || !zgodovina.ostala.length) return;
  dopolniCaka = true;
  requestAnimationFrame(() =>
    setTimeout(() => {
      dopolniCaka = false;
      dopolniZgodovino();
    }, 0),
  );
}
// Inštruktor se pokaže (initView): pogovor, odprt, ko je bil skrit, gre na dno (sicer bi se pokazal njegov vrh in
// sprožil nalaganje starejših); kratek pogovor, ki ne napolni zaslona, dobi starejša sporočila.
// Varnostni zaznavalnik (public/nujno.js ogrej) prevede svoje vzorce vnaprej, ko se Inštruktor prvič pokaže, v kosih po
// 8 ms v času mirovanja: prvi tap »Pošlji« je sicer čakal nanj (telefon ~0,8 s, docs/meritve/prijavljen-mobilno-2026-11-19.md).
// Modul zaznavalnika je namenoma statično uvožen (del prvega odprtja): varnostni odgovor mora biti na voljo vedno,
// tudi brez povezave in ob zavrnitvi strežnika (pregled varnosti #888: varnost pred ~32 KB).
let zaznavalnikPripravljen = false;
function pripraviZaznavalnik() {
  if (zaznavalnikPripravljen) return;
  zaznavalnikPripravljen = true;
  // Kos traja, kolikor je v času mirovanja prostora (requestIdleCallback), od 8 do 20 ms (vzorci zdaj nastanejo šele tu,
  // nujno.js: po 8 ms na sličico bi to na telefonu trajalo več sekund); ko čaka dotik ali tipka (isInputPending), kos
  // izpusti. Tako ni nikoli dolgo opravilo ob interakciji.
  const kos = () => whenIdle((d) => (navigator.scheduling?.isInputPending?.() ? kos() : ogrejNujno(Math.min(20, Math.max(8, (d?.timeRemaining?.() ?? 0) - 2))) || kos()));
  kos();
}
function zgodovinaVidna() {
  const box = $("#messages");
  if (zgodovina.naDno && box.clientHeight) {
    zgodovina.naDno = false;
    box.scrollTop = box.scrollHeight;
    // Formule skritega pogovora se prilagodijo šele zdaj (sirina.js; na telefonu tudi ~0,7 s dolgo opravilo, ki
    // pogovor podaljša): do 2 s ga v vsaki sličici drži na dnu, razen ko se učenec sam pomakne navzgor.
    let st = box.scrollTop;
    const konec = performance.now() + 2000;
    const drzi = () => {
      if (box.scrollTop < st - 2 || !box.clientHeight) return; // učenec se je pomaknil ali je zapustil Inštruktor
      box.scrollTop = box.scrollHeight;
      st = box.scrollTop;
      if (performance.now() < konec) requestAnimationFrame(drzi);
    };
    requestAnimationFrame(drzi);
  }
  dopolniKmalu();
}

function izrisiZgodovino(convId, msgs) {
  const n = Math.max(0, msgs.length - ZGODOVINA_NAJPREJ);
  // Kot da bi bila izrisana vsa: gumb ima zadnji odgovor, ki ga sme imeti (pogoji kot v addMessage in add…Button).
  const zadnji = {};
  msgs.forEach((m, i) => {
    if (m.role === "user" || !m.text || m.error) return;
    zadnji.deep = i;
    if (m.full_offer) zadnji.full = i;
    if (Array.isArray(m.choices) && m.choices.length >= 2) zadnji.choices = i;
  });
  for (const k of Object.keys(zadnji)) if (zadnji[k] >= n) delete zadnji[k];
  zgodovina = { conv: convId, ostala: msgs.slice(0, n), prvo: null, zadnji };
  for (const m of msgs.slice(n)) {
    const el = addMessage(m.role, m.text, m.has_image, m, { meri: false });
    zgodovina.prvo ||= el;
  }
}

// Učenec je blizu vrha izrisanega dela: še ZGODOVINA_PO starejših sporočil nad njim, brez premika vidnega dela.
function dopolniZgodovino() {
  const box = $("#messages");
  const z = zgodovina;
  // Skrit klepet (clientHeight 0) počaka: initView("chat") pokliče znova, ko se pokaže.
  if (!z.ostala.length || z.conv !== state.conversationId || !box.clientHeight || box.scrollTop > box.clientHeight) return;
  const pred = z.prvo?.isConnected ? z.prvo : box.querySelector(".msg");
  const y0 = pred?.getBoundingClientRect().top; // to sporočilo ostane na istem mestu na zaslonu
  const kos = z.ostala.splice(-ZGODOVINA_PO);
  const zac = z.ostala.length;
  let prvo = null;
  kos.forEach((m, j) => {
    const i = zac + j;
    const info = { ...m, full_offer: z.zadnji.full === i ? m.full_offer : undefined, choices: z.zadnji.choices === i ? m.choices : undefined };
    const el = addMessage(m.role, m.text, m.has_image, info, { meri: false, pred, globoko: z.zadnji.deep === i });
    prvo ||= el;
  });
  z.prvo = prvo || z.prvo;
  prilagodiZdaj();
  if (pred) box.scrollTop += pred.getBoundingClientRect().top - y0;
  dopolniKmalu(); // zaslon še ni poln: naslednji kos v svoji nalogi
}
$("#messages").addEventListener("scroll", dopolniKmalu, { passive: true });

// Telefon: seznam pogovorov se odpre čez klepet; gumb ostane viden in ga zapre (tudi Esc).
const setSidebar = (open) => {
  $(".sidebar").classList.toggle("open", open);
  $("#toggle-sidebar").setAttribute("aria-expanded", String(open));
  if (open) prefetchConversations();
};
// Viden seznam pogovorov: zadnji pogovori vnaprej, dotik vrstice začne prenos ob pointerdown.
function prefetchConversations() {
  whenIdle(() => {
    if (!$(".sidebar")?.getClientRects().length) return; // seznam ni viden (telefon z zaprtim seznamom)
    for (const c of state.conversations.slice(0, 4)) if (c.id !== state.conversationId) prefetchGet(`/api/conversations/${c.id}`);
  });
}
$("#conversation-list").addEventListener(
  "pointerdown",
  (e) => {
    const li = e.target.closest("li[data-id]");
    if (li && !e.target.closest("button") && Number(li.dataset.id) !== state.conversationId) prefetchGet(`/api/conversations/${li.dataset.id}`);
  },
  { passive: true },
);
// Na računalniku je seznam lahko skrit s potegom ločnice do roba (public/razdelilnik.js): isti gumb ga vrne.
let chatSplit = null;
$("#toggle-sidebar").addEventListener("click", () => (chatSplit?.collapsed ? chatSplit.expand() : setSidebar(!$(".sidebar").classList.contains("open"))));
$("#conversation-list").addEventListener("click", () => setSidebar(false));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && $(".sidebar").classList.contains("open")) setSidebar(false);
});

let bugAdmin = false;
let usageAdmin = false; // /api/usage sme samo skrbnik ali računalnik s strežnikom (/api/config admin)
function syncBugButton() {
  $("#chat-bug").hidden = !(bugAdmin || isPilotMember());
}
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
    thanks: bugAdmin ? null : t("pn.bugThanks"), // »najdeš jo v Računu« velja samo za skrbnika
    ask: bugAdmin ? null : t("pn.bugAsk"), // član pilota: kdo vidi sporočila, ki gredo zraven
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

// meri: false = brez meritev (klicatelj enkrat za vsa sporočila prilagodi formule in pomakne na dno); pred: starejše
// sporočilo gre pred ta element; globoko: false = brez »Razloži podrobneje« (ima ga novejši odgovor).
function addMessage(role, text, hasImage = false, info = null, { meri = true, pred = null, globoko = true } = {}) {
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
    if (!info?.error) el.dataset.aiGenerated = "true";
    if (text && globoko) addDeepButton(el, false);
    if (text && info?.full_offer) addFullButton(el);
    if (text && info?.choices) addChoices(el, info.choices);
    if (text && info?.open) addOpen(el, info.open);
    if (text && !info?.open?.some((x) => x.kind === "graph")) addGraphButton(el, text);
    if (text && info?.id) addMsgFoot(el, info);
  }
  if (pred?.parentNode === box) box.insertBefore(el, pred);
  else box.appendChild(el);
  if (!meri) return el;
  prilagodiZdaj();
  box.scrollTop = box.scrollHeight;
  return el;
}

// Ustno spraševanje (public/ustno/ustno.js, naloži se ob odprtju).
const openUstno = (src) => state.student && import("./ustno/ustno.js").then((m) => m.odpri(src, { api, student: state.student, renderRich, openLesson, topic: state.chatFx?.topic?.id }));
document.addEventListener("click", (e) => (e = e.target.closest?.("[data-ustno]")) && openUstno(e.dataset.ustno));
// paper: skrit kontekst pole za to sporočilo (naloga, omenjena v klepetu); afterUser(el): po učenčevem oblačku
// (opomba »Evklidova naloga« s povezavo na izvirnik); plain: ne išči omembe pole znova; draft: besedilo, ki se ob
// neuspehu vrne v polje (namesto sestavljenega sporočila z nalogo).
async function send(text, { deep = false, image: attached = null, paper: paperOpt = null, afterUser = null, plain = false, draft = null } = {}) {
  if (state.sending) return;
  if (nalogaPole?.busy() && !plain) return; // Evklid še odpira nalogo pole: novo sporočilo počaka (besedilo ostane v polju)
  if (!attached && !state.image && /^\s*vprašaj me\b/i.test(text)) return ($("#input").value = ""), openUstno({ besedilo: text });
  // Samodejno sestavljeno sporočilo (Razloži, Vprašaj o temi, izbire …) ni iz polja: učenčev osnutek in
  // fotografija v polju ostaneta (ne pošljemo ju zraven in ju ne pobrišemo). Slika samodejnega sporočila
  // (izrez naloge iz pole) pride kot attached.
  const fromInput = !attached && ($("#input").value.trim() || "") === (text || "").trim();
  const image = attached || (fromInput ? state.image : null);
  if (!text && !image) return;
  // Izklopljen klepet (EVKLID_CHAT_OFF): nič ne pošljemo, vprašanje in fotografija ostaneta. Varnostni
  // odgovor pa se pokaže tudi zdaj (lokalni zaznavalnik, strošek 0; pregled A V3).
  if (!$("#chat-off").hidden) {
    const n = lokalnoNujno(text);
    if (n) addNujno(n, { meja: true });
    return;
  }
  // »matura mat OR 2024 pola 1 naloga 5«: Evklid v klepetu odpre našo nalogo s to številko (public/naloga-pole.js).
  // Ne med reševanjem pole (»Rešuj z inštruktorjem«: učenec dopiše izvirno nalogo).
  if (fromInput && !image && !plain && !deep && state.student && state.paperCtx?.conv !== state.conversationId && MOZNA_POLA(text)) return odpriNalogoPole(text);
  let userEl = null;
  let bubble = null;
  let pacer = null;
  let shownText = ""; // že izpisano besedilo odgovora (napis med čakanjem ni del odgovora)
  // Varnostni odgovor (public/nujno.js) največ enkrat na sporočilo: lokalni zaznavalnik takoj ob pošiljanju,
  // nato strežnik (AI pregled čez mejo). meja: učenec ni dobil odgovora → opomba »ne šteje se med vprašanja«.
  let nujnoEl = null;
  const showNujno = (n, opts = {}) => {
    if (nujnoEl) {
      if (opts.meja) {
        nujnoEl.querySelector(".nujno-opomba").textContent = t(opomba(nujnoEl._st, true));
        nujnoNaVrh(nujnoEl);
      }
      return;
    }
    // Izsiljevanje prepozna vmesnik sam iz besedila (tudi, ko vrsto pošlje AI pregled).
    if (n?.vrsta) nujnoEl = addNujno({ ...n, izs: izsiljevanje(text) }, opts);
  };
  state.sending = true;
  state.sendSeq = (state.sendSeq || 0) + 1; // »Razloži podrobneje« v čakanju ve, ali je vmes šlo novo sporočilo
  $("#send").disabled = true;
  state.pacer?.skip();

  try {
    if (!state.conversationId) {
      const conv = await api(`/api/students/${state.student.id}/conversations`, { method: "POST" });
      state.conversationId = conv.id;
    }
    const sentTo = state.conversationId;
    // Skrit kontekst pole (»Pomoč pri tej nalogi«, »Rešuj z inštruktorjem«): samo s prvim sporočilom tega pogovora.
    const paperCtx = paperOpt || (state.paperCtx?.conv === sentTo ? state.paperCtx : null);
    document.querySelectorAll(".full-btn, .choice-row").forEach((x) => x.remove());
    zgodovina.zadnji = {}; // tudi starejši, še neizrisani odgovori teh gumbov ne dobijo več
    const nacin = fromInput && state.dictated ? "glas" : undefined; // narekovano z mikrofonom (strežnik preveri stikalo starša)
    // Tap »Pošlji« (INP, docs/meritve/prijavljen-mobilno-2026-11-19.md, 3. točka): oba mehurčka in prazno polje brez
    // sinhronih meritev; formule, višino polja in pomik na dno naredi naDno enkrat, tik pred izrisom sličice (ali prej,
    // če kaj drugega meri prej: varnostno okno, izris odgovora).
    const box = $("#messages");
    let naDnoRaf = 0;
    const naDno = () => {
      if (!naDnoRaf) return;
      cancelAnimationFrame(naDnoRaf);
      naDnoRaf = 0;
      if (fromInput) autoGrow(true);
      prilagodiZdaj();
      box.scrollTop = box.scrollHeight;
    };
    userEl = addMessage("user", text, !!image, null, { meri: false });
    naDnoRaf = requestAnimationFrame(naDno);
    if (fromInput) {
      $("#input").value = "";
      clearImage();
      state.dictated = false;
    }
    if (afterUser) naDno(); // opomba pod učenčevim oblačkom (public/naloga-pole/klepet.js) meri sama
    afterUser?.(userEl);
    if (afterUser) naDnoRaf = requestAnimationFrame(naDno); // še enkrat na dno, ko sta opomba in mehurček odgovora dodana

    bubble = addMessage("assistant", "", false, null, { meri: false });
    bubble.classList.add("typing");
    // Napis med čakanjem (j 16. 11.): takoj, ob piki »piše«; #messages je aria-live, zato ga bralnik prebere.
    // Pravo fazo pove strežnik (dogodek phase: »check«, ko koda ali pregled preverja račun); nikoli izmišljene.
    let waitNote = t(deep ? "chat.waitDeep" : "chat.wait");
    let checkTimer = null;
    let vVrsti = false; // napis »Si v vrsti (mesto N)« (naval, server/vrsta-ai.js)
    const noteHtml = () => (waitNote ? `<p class="wait-note">${escapeHtml(waitNote)}</p>` : "");
    // Takoj, brez čakanja na strežnik (objava nove različice, počasen AI pregled): pregled A V4.
    // Blažje okno »pogovor« (posredna stiska) počaka na strežnik, ki lahko pošlje močnejšo vrsto.
    const takoj = lokalnoNujno(text);
    if (takoj?.vrsta && takoj.vrsta !== "pogovor") {
      naDno(); // okno meri, ali je učenec na dnu
      showNujno(takoj, { before: bubble });
    }
    // D5: med izpisom dokončani bloki iz predpomnilnika in največ en izris na sličico; končni izris cel in takoj.
    const izrisBlokov = createIzrisBlokov(chatRich);
    const narisi = (shown, koncno) => {
      shownText = shown || "";
      const html = koncno ? chatRich(shown) : izrisBlokov(streamSafe(shown));
      // Napis med čakanjem: dokler odgovora ni, in med preverjanjem računa pod že izpisanim besedilom.
      // Zadnji odstavek nosi piko »piše« (style.css).
      bubble.innerHTML = (html ? html + (bubble.classList.contains("checking") ? noteHtml() : "") : noteHtml()) || "<p></p>";
    };
    // Največ en izris na sličico: ena meritev (formule, pomik na dno) na sličico, ne na žeton.
    const paint = enIzrisNaSlicico((shown, koncno) => {
      naDno();
      const atBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 80;
      narisi(shown, koncno);
      prilagodiZdaj(); // dolgo enačbo zloži že zdaj, da pomik na dno šteje njeno pravo višino
      if (atBottom) box.scrollTop = box.scrollHeight;
      // Varnostno okno ostane v celoti vidno: izpis odgovora ga ne potisne nad zgornji rob (pregled B2).
      if (atBottom && nujnoEl?.isConnected) box.scrollTop = Math.min(box.scrollTop, box.scrollTop + nujnoEl.getBoundingClientRect().top - box.getBoundingClientRect().top - 8);
    });
    narisi("", true); // napis med čakanjem takoj, izmeri ga naDno
    // Odgovor se izpisuje z berljivim tempom; dotik sporočila pokaže vse naenkrat.
    pacer = createPacer(currentPace(), paint);
    state.pacer = pacer;
    const skip = () => pacer.skip();
    bubble.addEventListener("click", skip);
    bubble.title = t("chat.tapToSkip");

    sprememba(); // sporočilo spremeni pogovor (mimo api())
    const res = await fetchThroughRestart(`/api/conversations/${state.conversationId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, deep, nacin, lite: liteActive(), device: await deviceSnapshot(), image: image ? { media_type: image.media_type, data: image.data } : undefined, paper: paperCtx || undefined }),
    });
    if (!res) {
      bubble.remove();
      throw new Error(t("off.noConnection"));
    }
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      bubble.remove();
      // Zavrnitev (meja porabe, izklopljen klepet, strežnik ne odgovarja): najprej varnostni odgovor, če je nujno.
      showNujno(err.nujno || lokalnoNujno(text), { meja: true });
      if (serverDown(res)) throw new Error(t("off.serverBusy"));
      if (err.chat_off) throw Object.assign(new Error(t("chat.off")), { chatOff: true });
      // Meja porabe (429, limit): sporočilo je »poslano« (ostane v oblačku), polje ostane prazno.
      // limitBody: kartica »Z naročnino dobiš« ob porabljenih brezplačnih vprašanjih (public/meja-placilo.js).
      throw Object.assign(new Error(serverError(err, res.status)), { limit: res.status === 429 && err.limit === true, limitBody: res.status === 429 ? err : null });
    }

    if (paperCtx && state.paperCtx === paperCtx) state.paperCtx = null; // strežnik ga je shranil s sporočilom
    if (paperOpt && state.paperCtx?.conv === sentTo) state.paperCtx = null; // starejši kontekst pole ne gre k naslednjemu
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
      delta: (d) => {
        if (!shownText && !bubble.classList.contains("checking")) waitNote = ""; // odgovor se začne: napis zamenja besedilo
        pacer.push(d.text);
      },
      // Uvod pred klicem orodja se umakne (server/claude.js onRetract): spet napis med čakanjem, dokler ni novega besedila.
      retract: () => {
        if (!bubble.classList.contains("checking")) waitNote = t(deep ? "chat.waitDeep" : "chat.wait");
        pacer.reset();
      },
      // Strežnik preverja odgovor (server/app.js): napis »Preverjam odgovor …«; pod izpisanim besedilom šele čez 0,6 s,
      // da hitro preverjanje ne utripne.
      phase: (d) => {
        // Konec čakanja v vrsti (server/vrsta-ai.js): spet »Pripravljam razlago …«, dokler ne pride besedilo.
        if (d?.phase === "answer" && vVrsti) {
          vVrsti = false;
          if (!shownText && !bubble.classList.contains("checking")) {
            waitNote = t(deep ? "chat.waitDeep" : "chat.wait");
            return paint("");
          }
        }
        // Preverjanje je končano (»answer«): napis izgine pod besedilom; brez besedila spet »Pripravljam …«.
        if (d?.phase === "answer") {
          clearTimeout(checkTimer);
          checkTimer = null;
          if (!bubble.classList.contains("checking")) return;
          bubble.classList.remove("checking");
          waitNote = shownText ? "" : t(deep ? "chat.waitDeep" : "chat.wait");
          return paint(shownText);
        }
        // »Razmišljam …« (server/claude.js onPhase), dokler ne pride prvo besedilo.
        if (d?.phase === "think") return shownText || bubble.classList.contains("checking") || ((waitNote = t("chat.waitThink")), paint(""));
        // Naval (server/vrsta-ai.js): veliko učencev hkrati, učenec vidi svoje mesto v vrsti namesto zamrznitve.
        if (d?.phase === "queue") {
          if (shownText || bubble.classList.contains("checking")) return;
          vVrsti = true;
          waitNote = t("chat.waitQueue", { n: Math.max(1, Math.floor(Number(d.mesto)) || 1) });
          return paint("");
        }
        if (d?.phase !== "check" || bubble.classList.contains("checking") || checkTimer) return;
        const show = () => {
          checkTimer = null;
          if (!bubble.classList.contains("typing")) return;
          waitNote = t("chat.waitCheck");
          bubble.classList.add("checking");
          paint(shownText);
        };
        if (shownText) checkTimer = setTimeout(show, 600);
        else show();
      },
      // Pod mejo: varnostni odgovor nad odgovorom inštruktorja (ga ne ustavi).
      nujno: (d) => showNujno(d, { before: bubble }),
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
        clearTimeout(checkTimer);
        checkTimer = null;
        bubble.classList.remove("checking");
        waitNote = "";
        // Strežnik ni poslal okna, lokalni zaznavalnik pa je našel nujnost: lokalno okno.
        if (!nujnoEl && takoj) showNujno(takoj, { before: bubble });
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
        clearTimeout(checkTimer);
        bubble.classList.remove("checking");
        waitNote = "";
        showNujno(d.nujno || lokalnoNujno(text), { before: bubble, meja: true });
        bubble.classList.add("error");
        pacer.finish(d.error);
        pacer.skip();
        if (state.conversationId === sentTo && !deep) restoreDraft(draft ?? text, image); // vrni besedilo za ponovni poskus
      },
    });
    clearTimeout(checkTimer);
    waitNote = ""; // tok se je končal: napis med čakanjem ne ostane v mehurčku
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
      bubble.classList.remove("checking");
      bubble.removeAttribute("title");
      bubble.querySelector(".wait-note")?.remove(); // napis med čakanjem ni del odgovora
      if (!shownText.trim() || !bubble.textContent.trim()) bubble.remove();
    }
    // Brez povezave ali prekinjen odgovor: lokalni zaznavalnik (strošek 0).
    if (text) showNujno(lokalnoNujno(text), { meja: true });
    // Izklopljen klepet: samo obvestilo nad poljem, vprašanje ostane v polju.
    if (err.chatOff) {
      userEl?.remove();
      if (!$("#messages .msg")) renderEmptyChat(); // prazen pogovor spet pokaže pozdrav in predloge
      $("#chat-off").hidden = false;
      if (!deep) restoreDraft(draft ?? text, image);
      return;
    }
    // Prekinjena povezava (npr. med objavo nove različice) je TypeError z »network error« v angleščini: učenec
    // dobi razumljivo obvestilo, vprašanje ostane v polju za ponovno pošiljanje.
    const dropped = err instanceof TypeError && /^(network ?error|failed to fetch|load failed|networkerror)/i.test(err.message);
    if (!dropped && !err.limit) console.error(err); // meja porabe je pričakovan odgovor, ne napaka aplikacije
    if (err.limitBody && FREE_LIMIT_CODES.has(err.limitBody.code)) await showLimitCard($("#messages"), err.limitBody, limitCardCtx());
    else addMessage("assistant", dropped ? t("off.serverBusy") : err.message, false, { error: true });
    // Neuspelo pošiljanje (omrežje, strežnik): besedilo in fotografija se vrneta v polje, da se ne izgubita.
    // Meja porabe: ne (sporočilo ostane v oblačku, polje prazno).
    // »Razloži podrobneje« (deep) se ne vrne v polje (kot mobilna): ponovno pošiljanje bi šlo kot navadno vprašanje.
    if (!err.limit && !deep) restoreDraft(draft ?? text, image);
  } finally {
    state.sending = false;
    sprememba(); // odgovor je v pogovoru: kopije, prenesene vnaprej med pisanjem, niso več sveže
    $("#send").disabled = false;
    if (currentView === "chat" || isFloating("chat")) markChat(); // učenec je v pogovoru: 10 min teče od zdaj
  }
}

// --- varnostni odgovor (public/nujno.js, besedila potrdil j 6. 11.) ---
// Lokalni zaznavalnik v brskalniku: brez povezave in kot rezerva, ko strežnik ne pošlje vrste.
function lokalnoNujno(text) {
  const vrsta = zaznajNujno(text);
  return vrsta ? { vrsta, izs: izsiljevanje(text) } : null;
}
// Okno na vrh vidnega dela klepeta, razen če je učenec seznam sam odmaknil navzgor (pregled B2).
function nujnoNaVrh(el) {
  const box = $("#messages");
  if (!el?.isConnected || el._odmaknjen?.()) return;
  el.scrollIntoView?.({ block: "start" });
}
// Številke v besedilu krepko (kartica: **112**), pregled B.
function krepke(html, p) {
  const nums = [p.sos, p.policija, p.otroci, p.odrasli, p.stevilka].filter(Boolean).sort((a, b) => b.length - a.length);
  if (!nums.length) return html;
  const re = new RegExp(`(?<![0-9])(${nums.map((x) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})(?![0-9])`, "g");
  return html.replace(re, "<strong>$1</strong>");
}
// Okno z varnostnim odgovorom: ni napaka, se zapre (×), inštruktorja ne ustavi. before: nad tem mehurčkom.
// meja: učenec ni dobil odgovora inštruktorja (opomba, da se ne šteje med vprašanja).
function addNujno(n, { before = null, meja = false } = {}) {
  const box = $("#messages");
  box.querySelector(".empty")?.remove();
  const el = document.createElement("section");
  el.className = `msg nujno-card nujno-${n.vrsta}`;
  el.setAttribute("role", "alert");
  // Bralnik zaslona prebere naslov in vsebino (aria-labelledby, ne aria-label: pregled B2).
  const hid = `nujno-h-${Date.now()}`;
  el.setAttribute("aria-labelledby", hid);
  // Številke vedno tu: strežnik ne pozna države naprave (učenec brez izbrane države, telefon v HR …).
  const st = stevilke(state.student?.settings, drzavaNaprave());
  // Parameter [ključ, parametri] (ure, splošno ime linije) najprej prevedemo.
  const tr = ([k, p]) => t(k, Object.fromEntries(Object.entries(izoliraj(p)).map(([a, v]) => [a, Array.isArray(v) ? t(v[0], v[1]) : v ?? ""])));
  const [head, ...rest] = vrstice(n.vrsta, st, { izsiljevanje: !!n.izs });
  const calls = klici(n.vrsta, st).filter(Boolean);
  el.innerHTML =
    `<button type="button" class="nujno-zapri" aria-label="${escapeHtml(t("nujno.zapri"))}">${icon("x")}</button>` +
    `<h3 id="${hid}">${escapeHtml(tr(head))}</h3>` +
    rest.map((v) => `<p>${krepke(escapeHtml(tr(v)), v[1])}</p>`).join("") +
    `<div class="nujno-klici">${calls.map((c) => `<a class="nujno-klic" href="${telHref(c)}">${icon("phone")} ${escapeHtml(t("nujno.klic", izoliraj({ n: c })))}</a>`).join("")}</div>` +
    `<p class="nujno-opomba">${escapeHtml(t(opomba(st, meja)))}</p>`;
  el._st = st;
  // Po zaprtju fokus v polje za vnos (samo z miško in tipkovnico: na telefonu se tipkovnica ne odpre sama).
  const zapri = () => {
    el.remove();
    if (!matchMedia("(hover: none)").matches) $("#input")?.focus();
  };
  el.querySelector(".nujno-zapri").addEventListener("click", zapri);
  // Esc zapre okno, ko je fokus v njem (pregled B).
  el.addEventListener("keydown", (e) => {
    if (e.key === "Escape") zapri();
  });
  // Učenec je seznam sam pomaknil navzgor (bere starejša sporočila): okna ne vlečemo na vrh.
  const top0 = box.scrollTop;
  const atBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 80;
  el._odmaknjen = () => !atBottom && box.scrollTop < top0 - 40;
  if (before?.isConnected) box.insertBefore(el, before);
  else box.appendChild(el);
  nujnoNaVrh(el);
  return el;
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

// Kartica ob porabljenih brezplačnih vprašanjih: Vadnica odpre temo pogovora (če jo ima) ali dnevno vajo.
const limitCardCtx = () => ({
  api,
  toast,
  level: stopnja(state.student),
  inApp: / EvklidApp\//.test(navigator.userAgent),
  openAccount: () => $("#account-tab").click(),
  openPractice: () => (state.chatFx?.topic?.id ? openTopic(state.chatFx.topic.id) : startSession("daily", { path: state.pathKey })),
  key: () => `${state.student?.id ?? ""}|${state.conversationId ?? ""}`,
});

// Obvestilo pod odgovorom: koliko podrobnih razlag je še ostalo (nikoli € ali $). Gumb za dokup samo, ko ga
// strežnik dovoli (polnoleten imetnik, profil 15+, ena ponudba naenkrat).
function addAllowanceNote(bubble, d) {
  const el = document.createElement("div");
  el.className = "cards-note allowance-note";
  // Pri 80 % dve vrstici: obvestilo, pod njim preostanek (»Podrobne razlage v tem obdobju: še 6«).
  // Pri 100 % še, kaj sledi hitremu načinu (do konca obdobja naročnine, aiPeriodEnd, vsak dan kot brezplačni paket, server/usage.js tailToday).
  const base = d.stage === "out" ? (d.spread ? `${escapeHtml(t("ai.out"))}<br><small>${escapeHtml(t("ai.then"))}</small>` : escapeHtml(t("ai.out"))) : `${escapeHtml(t("ai.low"))}<br><small>${escapeHtml(t("ai.left", { n: d.left }))}</small>`;
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
  const box = $("#messages");
  const atBottom = typeof stick === "boolean" ? stick : box.scrollHeight - box.scrollTop - box.clientHeight < 80;
  const max = Math.max(80, Math.round((window.visualViewport?.height || window.innerHeight) * 0.4));
  input.style.maxHeight = `${max}px`;
  input.style.height = "auto";
  // Formule (ulomek, koren …) se izrišejo kar v polju (public/predogled-vnosa.js): višina po izrisu, ne po surovem zapisu.
  const izris = input.classList.contains("vnos-izrisan") ? Number(input.dataset.izrisVisina) || 0 : 0;
  const h = izris || input.scrollHeight;
  input.style.height = `${Math.min(h, max)}px`;
  input.style.overflowY = h > max && !izris ? "auto" : "hidden";
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
input.addEventListener("vnos-izris-visina", () => autoGrow());
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
    // Ne gre cel: kratek namig (»Napiši nalogo«, #792), šele nato rez za zadnjo celo besedo.
    const short = t("chat.placeholderShort");
    if (ctx.measureText(full).width > room && short && ctx.measureText(short).width <= room) text = short;
    else if (ctx.measureText(full).width > room) {
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

// Glasovni vnos (brskalnik, sl-SI): public/speech.js se naloži po zagonu (ni del prvega odprtja). Za mlajše od 15 let
// le s stikalom starša v Računu (j 10. 11.); nacin "glas" ob pošiljanju preveri tudi strežnik. Tipkanje dela vedno.
const glasOk = {};
const glasZa = (id) => api(`/api/students/${id}/ustno`).then((r) => (glasOk[id] = r?.glas?.dovoljen !== false), () => true);
poZagonu(() => vnaprejGotovo.then(() => whenIdle(() =>
  import("./speech.js").then((m) =>
    m.attachMic($("#mic-btn"), input, {
      onMessage: (msg) => toast(msg, "mic"),
      onChange: () => ((state.dictated = true), autoGrow()),
      allowed: () => {
        const id = state.student?.id;
        if (!id) return true;
        const p = glasZa(id);
        return id in glasOk ? glasOk[id] : p;
      },
      onBlocked: () => import("./ustno/ustno.js").then(async (u) => (await u.loadDicts(), toast(u.tt("u.glasStarsKlepet"), "mic"))),
    }),
  ),
)));
// Napredna tipkovnica s simboli.
// Evklidova tipkovnica (public/tipkovnica.js): na dotik za vsa polja, Σ jo odpre na plasti simbolov (tudi na računalniku).
initKeyboard();
initDrsniki();
document.addEventListener("input", (e) => hasFormula(e.target.value || "") && import("./predogled-vnosa.js").then((m) => m.initPredogledVnosa(e.target)), true);
setKeyboardContext({ settings: () => state.student?.settings, chapter: calcChapter });
mountKeyboardSettings($("#tipkovnica-card"));
// Predlogi nad tipkovnico (TUTOR_CHIPS) so v tipkovnica-data.js, ki pride s tipkovnico (tipkovnica-lena.js).
obTipkovnici(() =>
  import("./tipkovnica-data.js")
    .then(({ TUTOR_CHIPS }) => configureKeyboard(input, { layers: ["abc", "num", "fx", "sym", "kem"], start: "abc", enter: "send", ctx: TUTOR_CHIPS }))
    .catch(() => {}),
);
$("#sym-btn").addEventListener("click", () => toggleKeyboard(input, { layer: "sym" }));
window.addEventListener("evklid:tipkovnica", () => {
  const on = keyboardOpenFor(input) && keyboardLayer() === "sym";
  $("#sym-btn").setAttribute("aria-pressed", String(on));
  $("#sym-btn").classList.toggle("on", on);
});

// ---------- fotografije ----------

// Slika za inštruktorja: največ 1200 px (lahki način 900 px, kakovost 0,6), da je pošiljanje hitro in poceni.
// Vir je datoteka (prilepljena slika) ali slika iz skenerja (data URL).
async function scaledImage(src) {
  // data URL brez fetch (pravila CSP za connect-src ga ne dovolijo): prek elementa <img>.
  let bitmap = src;
  if (typeof src === "string") {
    bitmap = new Image();
    bitmap.src = src;
    await bitmap.decode();
  } else bitmap = await createImageBitmap(src);
  const lite = liteActive();
  const scale = Math.min(1, (lite ? 900 : 1200) / Math.max(bitmap.width, bitmap.height)); // manjša slika = manj žetonov
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const url = canvas.toDataURL("image/jpeg", lite ? 0.6 : 0.8);
  return { media_type: "image/jpeg", data: url.split(",")[1], url };
}
function showImage(img) {
  state.image = img;
  $("#image-preview img").src = img.url;
  $("#image-preview").hidden = false;
}
async function loadImage(file) {
  if (!file || !file.type.startsWith("image/")) return;
  showImage(await scaledImage(file));
}
function clearImage() {
  state.image = null;
  $("#image-preview").hidden = true;
}
// Kamera v Inštruktorju (j 17. 11.: en vhod za fotografijo, skener namesto neposredne slike): zajem, izrez, branje,
// učenec prepis pregleda in popravi, nato gre naloga v odprti pogovor (predmet, način in letnik ostanejo).
// Fotografija gre zraven le, če jo učenec pusti označeno (skica, graf ali branje ni uspelo).
function scanFromChat(on) {
  state.scanFromChat = on;
  const back = $("#view-scan .me-back span");
  if (back) back.textContent = t(on ? "nav.chat" : "nav.me");
}
async function scanToChat({ text, image }) {
  // Pomanjšana kot slika iz polja; če pomanjšanje ne uspe, gre izvirni izrez (nikoli se ne izgubi).
  const img = image ? await scaledImage(image).catch(() => ({ media_type: "image/jpeg", data: image.split(",")[1], url: image })) : null;
  showView("chat");
  // Odgovor se še izpisuje ali je klepet izklopljen: naloga in fotografija gresta v polje (nič se ne izgubi),
  // učenec ju pošlje sam.
  if (state.sending || !$("#chat-off").hidden) {
    if (text) fillInput(text);
    if (img && !state.image) showImage(img);
    return $("#input").focus();
  }
  $("#input").focus(); // fokus nazaj v polje za pisanje (dostopnost), pošiljanje ga ne potrebuje
  send(text, { image: img });
}
$("#photo-btn").addEventListener("click", () => {
  if (!state.student) return;
  startTutorScan((x) => scanToChat(x));
  scanFromChat(true);
  showView("scan");
  requestAnimationFrame(() => $("#view-scan h1")?.focus({ preventScroll: true })); // fokus na naslov skenerja
});
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
// Različica, ki jo stran res izvaja: iz vstopne strani (<meta name="evklid-app">, server/vstopna-stran.js), ne s
// strežnika ob zagonu – stran je lahko prišla iz predpomnilnika, strežnik pa že teče z novo (PR #481, pregled 1).
// Brez oznake (stara stran) kot prej: različica strežnika ob zagonu.
const pageApp = document.querySelector('meta[name="evklid-app"]')?.content || null;
let appVersion = pageApp;
let hiddenAt = 0;
let lastInput = Date.now();
for (const ev of ["pointerdown", "keydown", "input", "wheel", "touchstart"]) {
  addEventListener(ev, () => (lastInput = Date.now()), { capture: true, passive: true });
}
const serverVersion = () =>
  fetch("/healthz/stanje", { cache: "no-store" })
    .then((r) => jsonAliNic(r))
    .then((s) => (pageApp ? s?.datoteke : s?.razlicica) || null)
    .catch(() => null);
const unsentText = () =>
  [...document.querySelectorAll("textarea, input[type=text], input[type=search], input:not([type])")].some(
    (el) => el.offsetParent !== null && !el.readOnly && el.value.trim() && el.value !== el.defaultValue,
  );
// Service worker pobriše kopije stare različice (public/sw.js »app-stale«), da osvežitev ne dobi znova stare strani.
function dropStaleCopies(v) {
  const sw = navigator.serviceWorker?.controller;
  if (!sw) return Promise.resolve();
  return new Promise((done) => {
    const ch = new MessageChannel();
    ch.port1.onmessage = () => done();
    setTimeout(done, 1500);
    sw.postMessage({ type: "app-stale", app: v }, [ch.port2]);
  });
}
// once: osveži samo, če ta zavihek za to različico še ni bil osvežen (brez zanke osveževanja). Oznaka se zapiše
// šele tik pred osvežitvijo, ko so tekmovanje in neposlano besedilo že preverjeni (pregled B2 P2-1).
const RELOADED = "evklid.osvezeno";
async function reloadIfNewer(once = false) {
  const busy = () => state.contestTimer || unsentText();
  if (!appVersion || busy()) return;
  const shot = shotMod ? null : loadShot(); // vzporedno s klicem različice (posnetek ob pagehide)
  const v = await serverVersion();
  // Med klicem je lahko začel pisati (B4).
  if (!v || v === appVersion || busy()) return;
  try {
    if (once && sessionStorage.getItem(RELOADED) === v) return;
  } catch {
    return; // brez sessionStorage ne tvegamo zanke
  }
  if (pageApp) await dropStaleCopies(v);
  // Posnetek tega zaslona se zapiše ob pagehide (saveSnapshot): modul mora biti že naložen (največ 1,5 s čakanja).
  if (!shotMod && shot) await Promise.race([shot, new Promise((ok) => setTimeout(ok, 1500))]);
  if (busy()) return;
  // Brez reg.update(): osvežitev sama preveri sw.js; klic med že tekočo namestitvijo je v Chromiumu zataknil novi
  // service worker ali izgubil osvežitev (pregled B2 P2-4).
  try {
    if (once) sessionStorage.setItem(RELOADED, v); // šele tik pred osvežitvijo
    // Nova stran ob tej osvežitvi pokaže posnetek tega zaslona, čeprav je iz prejšnje različice (public/zacetek.js
    // PRENOS): sicer se je po vsaki objavi zaslon izpraznil v okostje in nato izrisal znova (j 16. 11. 2026, utripanje).
    sessionStorage.setItem(ZACETEK?.PRENOS || "evklid.posnetek-prenos", "1");
  } catch {}
  location.reload();
}
// Stara stran iz predpomnilnika (npr. počasno omrežje), strežnik pa že ima novo različico: osvežimo takoj, preden
// učenec odpre zaslon, ki bi naložil modul nove različice. Do osvežitve service worker tej strani daje lene module
// njene različice (sporočilo »page-app«, public/sw.js).
const reloadOnceFor = () => reloadIfNewer(true);
// Service worker izve, katero različico izvaja ta stran (ob zagonu in ob vsaki menjavi service workerja).
const tellPage = () => pageApp && navigator.serviceWorker?.controller?.postMessage({ type: "page-app", app: pageApp });
tellPage();
navigator.serviceWorker?.addEventListener?.("controllerchange", tellPage);
// Service worker, ki te strani ni naložil (po menjavi ali ponovnem zagonu), vpraša, katero različico izvaja.
navigator.serviceWorker?.addEventListener?.("message", (e) => e.data?.type === "which-app" && tellPage());
navigator.serviceWorker?.startMessages?.();
if (pageApp)
  serverVersion().then((v) => {
    if (v && v !== pageApp) reloadOnceFor();
  });
else serverVersion().then((v) => (appVersion = v));
// Nov service worker sporoči svojo različico (public/sw.js ob activate): stara stran se osveži takoj samo, če je
// komaj odprta (prvih 30 s); sicer ob običajni priložnosti spodaj (vrnitev po ≥ 1 min, 10 minut miru), da se
// stanje (graf, izbira, branje) ne izgubi med delom (pregled A2 P2-2). Do takrat ji SW daje module njene različice.
navigator.serviceWorker?.addEventListener?.("message", (e) => {
  if (e.data?.type !== "app-version" || !pageApp || !e.data.app || e.data.app === pageApp) return;
  tellPage();
  if (performance.now() < 30 * 1000) reloadOnceFor();
});
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
  // Optimistično (j 6. 11. 2026: odziven Evklid): izbira, glava in obvestilo takoj, shranjevanje na strežnik
  // v ozadju (meni se zapre brez čakanja). Podatke zaslona naložimo po shranjevanju (strežnik jih bere po
  // shranjenem predmetu); ob napaki se vrne prejšnji predmet in pokaže napaka.
  const prev = state.student;
  const save = api(`/api/students/${prev.id}`, { method: "PUT", body: { settings } });
  studentUpdated({ ...prev, settings: { ...prev.settings, ...settings } });
  toast(`${t("set.subject")}: ${item.label}`, "check");
  save.then(
    (updated) => {
      studentUpdated(updated);
      if (state.student?.id !== prev.id) return;
      // Odprt zaslon pokaže novi predmet.
      if (currentView === "path") loadPath();
      else if (currentView === "uci") showUci(); // učbenik, poskusi in 3D svet po novem predmetu
      else if (currentView === "me") renderMe();
      else if (currentView === "exams") loadExams();
      else if (currentView === "competition") regionalExams() ? loadExams() : loadCompetition();
      else if (currentView === "cards") showFlashcards();
    },
    (err) => {
      if (state.student?.id === prev.id) studentUpdated({ ...state.student, settings: prev.settings });
      toast(err?.message || String(err));
    },
  );
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

function fillLevelOptions() {
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
  f.personality_setting.value = s.personality_setting;
  f.gender.value = s.gender || "";
  f.data_mode.value = s.data_mode || "auto";
  f.games.checked = !gamesOn(s);
  f.xp_goal.value = String(s.xp_goal || 50);
  fillDialectOptions(f, s);
  f.subject.innerHTML = subjectOptions(null, s.subject, schoolSubjectsFor(s.educational_track, s.curriculum_level, isRegional(s.school_system)));
  f.study_course.innerHTML = "";
  f.school_system.innerHTML = schoolSystemOptions(s.school_system || "SI");
  if (!levelPicker) {
    levelPicker = mountLevelPicker($("#settings-level"), f, { programs, settings: s, onChange: () => fillLevelOptions() });
    f.school_system.addEventListener("change", () => levelPicker.setSystem(f.school_system.value));
  } else levelPicker.set(s);
  f.querySelector(`input[name=solving_mode][value=${s.solving_mode}]`).checked = true;
  f.manual_weaknesses.value = state.student.manual_weaknesses.join(", ");
  fillGoalFields(true);
  fillLevelOptions();
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
        educational_track: f.educational_track.value,
        study_program: f.educational_track.value === "UNIVERZA" ? f.study_program.value : "",
        curriculum_level: f.curriculum_level.value,
        solving_mode: f.querySelector("input[name=solving_mode]:checked").value,
        personality_setting: f.personality_setting.value,
        gender: f.gender.value,
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
  if (ideasKey(before) !== ideasKey(updated.settings)) refreshIdeas(); // prazen klepet: predlogi po novem razredu, ravni, predmetu
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
  if (ideasKey(before) !== ideasKey(updated.settings)) refreshIdeas(); // predlogi v praznem klepetu po novem razredu, ravni, predmetu
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
  if (!el || !state.student) return;
  // Kotiček (corner.js) se naloži po prvem izrisu; Nastavitve, odprte prej, dobijo povzetek ob njegovem prihodu.
  const povzetek = (m) => state.student && (el.textContent = m.interestsSummary(state.student.settings) || t("set.cornerNone"));
  const m = cornerMod.now();
  if (m) povzetek(m);
  else cornerMod.load().then(povzetek).catch(() => {});
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
    .filter((k) => k !== "scan") // »Skeniraj nalogo« je že vrstica v #xp-card tik pod današnjim treningom (j, 18. 11. 2026)
    .filter((k, i, a) => a.indexOf(k) === i);
  // Nadomestki ne smejo podvojiti kartice stopnje (shown) niti ponuditi izklopljenih iger.
  for (const alt of ["chat", "textbook", "games"]) if (list.length < 2 && !list.includes(alt) && !shown.includes(alt) && (alt !== "games" || gamesOn(s))) list.push(alt);
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
  // Koda sporočila (#00YA, server/reports.js: z njo skrbnik najde sporočilo s posnetka zaslona) je samo v obrazcu
  // prijave, z napisom »Koda sporočila«; pod vsakim odgovorom je bila videti kot notranja številka (#792).
  if (code) foot.dataset.code = code;
  const done = () => {
    foot.querySelector(".msg-report")?.remove();
    const s = document.createElement("span");
    s.className = "rep-done";
    s.innerHTML = `${icon("check")}<span></span>`;
    s.lastChild.textContent = t("rep.done");
    foot.append(s);
  };
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

// Obrazec »Prijavi napako« pod odgovorom je v public/prijave.js (openMsgReport).
function openReport(el, foot, btn, id, done) {
  openMsgReport(el, foot, btn, id, done, { convId: state.conversationId, api, toast });
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
  // Takojšen odziv (j 16. 11.): gumb je pritisnjen in onemogočen; če prejšnji odgovor še ni povsem zaključen
  // (state.sending), počaka nanj, namesto da bi se dotik izgubil. Nato napis »Pripravljam podrobnejšo razlago …«.
  b.addEventListener("click", () => {
    if (b.disabled || !$("#chat-off").hidden) return;
    b.disabled = true;
    b.classList.add("pressed");
    b.setAttribute("aria-busy", "true");
    const seq = state.sendSeq;
    const release = () => {
      b.disabled = false;
      b.classList.remove("pressed");
      b.removeAttribute("aria-busy");
    };
    const go = (tries = 0) => {
      if (!b.isConnected) return;
      // Vmes je učenec poslal novo sporočilo: podrobnejša razlaga prejšnjega odgovora ne gre več.
      if (state.sendSeq !== seq) return b.remove();
      if (state.sending && tries < 150) return setTimeout(() => go(tries + 1), 100);
      if (state.sending) return release(); // po 15 s tiho spet omogočen
      b.remove();
      send(t("chat.deeperMsg"), { deep: true });
    };
    go();
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
  t.dataset.at = Date.now();
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => (t.hidden = true), 3500);
}
// Obvestilo s prejšnjega zaslona ne ostane po menjavi pogleda; tisto, ki ga je pokazalo isto dejanje tik pred
// menjavo (npr. »Zdaj si v …« in nato Učna pot), ostane.
function hideOldToast() {
  const el = $("#toast"); // čas zapišejo vsi toast() (app.js, account.js, leagues.js)
  if (Date.now() - Number(el.dataset.at || 0) > 500) el.hidden = true;
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
function localStorageRemove(k) {
  try {
    localStorage.removeItem(k);
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

const pathsCache = new Map(); // /api/paths?… -> seznam poti (javni podatki, enaki za vse)
async function loadPath(key = state.pathKey) {
  // Šola (OŠ/SŠ): učna pot je vedno za razred/letnik iz profila; nižje razrede ima Učbenik (j, 1. 11.).
  // Fakulteta: izbira med predmeti študijskega programa ostane.
  const uni = isUni(state.student.settings);
  const ideasFor = state.student, ideasFrom = ideasKey(ideasFor.settings); // predlogi: pot za tega učenca in te nastavitve
  const q = uni && key ? `?key=${encodeURIComponent(key)}` : "";
  const sys = state.student.settings.school_system || "SI";
  // Učna pot, seznam poti in programi hkrati (prej drug za drugim: trije čakanji na strežnik ob vsakem odprtju
  // domačega zaslona); seznam poti je enak za vse in se v seji ne spremeni (j, 15. 11. 2026: »vse takoj«).
  const pathsUrl = uni ? `/api/paths?program=${encodeURIComponent(state.student.settings.study_program)}` : `/api/paths?subject=${state.student.settings.subject}&system=${encodeURIComponent(sys)}`;
  const sid = state.student.id, gen = apiGen;
  const [p, , paths] = await Promise.all([
    api(`/api/students/${state.student.id}/path${q}`).then((x) => keepPath(x, sid, gen)),
    uni ? loadPrograms(api) : null,
    pathsCache.get(pathsUrl) || api(pathsUrl).then((list) => (Array.isArray(list) && pathsCache.set(pathsUrl, list), list)),
  ]);
  const content = $("#path-content");
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
  if ((!uni || !key || key === p.defaultKey) && state.student?.id === ideasFor.id && ideasKey(state.student.settings) === ideasFrom) (rememberIdeasPath(state.student, p), showIdeas());
  if (changed) refreshModes(); // fakulteta: drug predmet iz seznama poti
  showLevelCard();
  renderStageHome();
  syncOfflineBanner();
  // Naloge za vadbo brez povezave (enkrat na dan, v ozadju).
  if (!p.offline) vnaprejGotovo.then(() => refreshPack(apiOzadje, state.student.id, p.key)).then(syncOfflineBanner);
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
    ${document.getElementById("view-scan") ? `<button type="button" class="next-row scan-path-row" data-scan-home><span class="eyebrow">${t("scan.title")}</span><span class="next-name">${t("scan.meSub")}</span>${icon("camera")}</button>` : ""}
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
  prefetchTopics(); // teme, ki jih učenec verjetno odpre: vsebina v miru vnaprej (odprtje brez čakanja strežnika)
  // Kartice (gumb nad potjo): seznam kartic te poti vnaprej, enak naslov kot public/flashcards.js showFlashcards.
  const sidNow = state.student.id;
  whenIdle(() => state.student?.id === sidNow && state.pathKey && prefetchGet(`/api/students/${sidNow}/flashcards?path=${encodeURIComponent(state.pathKey)}`));
  renderFeedbackCard(); // nov dan med odprto aplikacijo: kartica se pokaže ob naslednjem izrisu poti
  if (!maybeTour.done) {
    maybeTour.done = true;
    maybeIntro();
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
  // Prvi zaslon: »Skeniraj nalogo« tik pod današnjim treningom (j, 18. 11. 2026: pristajalna stran obljublja pomoč pri domači nalogi).
  if (e.target.closest("[data-scan-home]")) showView("scan");
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
// Urnik, NPZ/matura in Tekmovanja se odprejo tudi z Učne poti (kartica urnika, cilj): »←« vodi nazaj na zavihek spodnje
// vrstice, s katerega je učenec prišel, in nosi njegovo ime; z drugih zaslonov na Jaz.
function meBackTarget(view) {
  const o = BACK_ORIGIN.includes(view) ? meBackFrom[view] : null;
  return o && o !== view && $(`#tabbar .tab[data-view="${o}"]:not([hidden])`) ? o : "me";
}
const meBackKey = (view) => $(`#tabbar .tab[data-view="${meBackTarget(view)}"] span`)?.dataset.i18n || "nav.me";
function syncMeBack(view) {
  if (!BACK_ORIGIN.includes(view)) return;
  document.querySelectorAll(`#view-${view} .me-back span`).forEach((s) => ((s.dataset.i18n = meBackKey(view)), (s.textContent = t(s.dataset.i18n))));
}
const meBackHtml = (view) => `<button type="button" class="ghost back me-back">${icon("arrow-left")}<span data-i18n="${meBackKey(view)}">${t(meBackKey(view))}</span></button>`;
// »Skrij igre« (nastavitev profila games: off): brez zavihka, vrstice pod Jaz in koraka v uvodnem ogledu.
function syncGamesTab() {
  const off = !!state.student && !gamesOn(state.student.settings);
  document.querySelectorAll('.tab[data-view="games"], [data-go="games"]').forEach((el) => (el.hidden = off));
}
// Igre so se pravkar skrile (Nastavitve, inštruktor, menjava profila): odprto okno se zapre, glavni pogled gre na Jaz.
function leaveHiddenGames() {
  // Igre so vklopljene: naložene igre pripravijo naloge novega predmeta ali profila (tudi za delo brez povezave).
  if (!state.student || gamesOn(state.student.settings)) return void gamesMod?.prepareSubjects?.();
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
  const mKey = exams ? short : regionalExams() ? "nav.exams" : "nav.competitionShort"; // »Contests«: cela beseda v 360 px
  ms.dataset.i18n = mKey;
  ms.textContent = t(mKey);
  m.querySelector("i, svg").outerHTML = icon(exams || regionalExams() ? "clipboard-check" : "medal");
  m.classList.toggle("active", currentView === m.dataset.view);
  // Ko je NPZ/matura na četrtem mestu spodnje vrstice, vrstice pod Jaz na telefonu ni (touch.css .v-vrstici);
  // na računalniku je »NPZ in matura« samo pod Jaz (zgornja vrstica, j 17. 11. 2026), zato tam ostane.
  $("#me-exams").hidden = !siExams();
  $("#me-exams").classList.toggle("v-vrstici", !!exams);
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
// Vsebina teme in stanje iz zadnje Učne poti (kliki.js): tema z Učne poti ne čaka strežnika.
const tm = teme({ api, kopija, jezik: () => state.student?.settings?.language || "", ucenec: () => state.student?.id, gen: () => apiGen });
const topicEntry = tm.entry;
const topicContent = tm.content;
const keepPath = tm.keepPath;
const pathData = tm.pathData;
const pathUnitsFor = tm.unitsFor;
// Verjetne naslednje teme v miru po izrisu Učne poti; dotik vozlišča ob pointerdown.
const prefetchTopics = () => temeVnaprej($("#path-content"), { entry: topicEntry, whenIdle, izrisi: (tp) => izrisNared() && topicRich(kopija(tp), tp.explanation) });
document.addEventListener(
  "pointerdown",
  (e) => {
    const b = e.target.closest?.("[data-open]");
    if (b && !b.disabled && state.student) topicContent(b.dataset.open).catch(() => {});
  },
  { passive: true, capture: true },
);

// Naslednja naloga vadnice vnaprej (kliki.js vadnica; vadnica.js jo prevzame ob »Vadi naloge« in »Naprej«).
const vadi = vadnica({ api, ucenec: () => state.student?.id, tema: () => state.topic?.id, gen: () => apiGen, smem: () => navigator.onLine !== false && !serverIsDown && !serverUpdating });
const prefetchPractice = vadi.prefetch;
const takePractice = vadi.take;

// Gumb »nazaj« na temi oziroma pri seriji nalog vodi tja, od koder je učenec prišel.
function setBack(view) {
  state.backTo = view;
  $("#back-to-path").innerHTML = `${icon("arrow-left")}${view === "competition" ? prepLabel() : view === "exams" ? t("nav.examsSi") : view === "zapiski" ? t("cards.notes") : t("nav.path")}`;
}

// Seje modulov, ki se naložijo šele ob odprtju (»Vaja iz testa«, public/zapiski/vaja.js): modul doda naslov, uvod,
// povzetek ob koncu (doneHtml) in gumbe povzetka (wire). Glavni slovar teh besedil ne nosi.
const EXTRA_SESSIONS = {};
function addSession(kind, cfg) {
  EXTRA_SESSIONS[kind] = cfg;
}
const extraSession = (mode) => Object.values(EXTRA_SESSIONS).find((c) => c.mode === mode) || null;
const topicCache = new Map();
function choiceHtml(task, o, fx = true) {
  if (task.optionsTex) return renderMath(o, false, fx);
  const s = String(o);
  if (!s.includes("$")) return escapeHtml(s);
  return s.split(/(\$[^$]+\$)/).map((p) => (/^\$[^$]+\$$/.test(p) ? renderMath(p.slice(1, -1), false, fx) : escapeHtml(p))).join("");
}
const MOZNA_POLA = (text) => text.length <= 100 && /\b(matur|npz|poklicn|nacionaln)/i.test(text) && /nalog/i.test(text);
let nalogaPole = null;
async function odpriNalogoPole(text) {
  let m, v;
  try {
    [m, v] = await Promise.all([import("./naloga-pole/klepet.js"), vadMod.load()]);
  } catch {
    return send(text, { plain: true }); // modul se ni naložil (brez povezave): navadno vprašanje
  }
  if (!nalogaPole) {
    nalogaPole = m;
    m.nastavi({
      state, $, send, api, t, escapeHtml, icon, toast, autoGrow, restoreDraft, prilagodiZdaj, loadPapers, paperLabel, fileText,
      siExamName, SUBJECT_NAMES, partKey, partLabel, taskMdForChat: v.taskMdForChat, openOurs, openLocalPaper,
    });
  }
  if (!m.jeOmemba(text)) return send(text, { plain: true });
  return m.odpri(text);
}
// Prenesena pola ostane v pomnilniku (ta seja, ta učenec): po »Pomoč pri tej nalogi« jo »Odpri preneseno polo« pri isti
// poli odpre znova pri isti strani, brez ponovne izbire datoteke. Zapiranje pole ali menjava profila jo pozabi.
let keptPaper = null;
function openLocalPaper(entry, file, subjectName, page = 0, task = "") {
  const key = paperLabel(entry, subjectName);
  const sid = state.student.id;
  loadPaperViewer().then(({ openPaperViewer }) => openPaperViewer(file, {
    title: key,
    page,
    task,
    onClose: () => (keptPaper = null),
    onHelp: (task) => {
      keptPaper = { sid, key, file, page: task.page };
      paperTask(entry, subjectName, task);
    },
  }), () => toast(t(navigator.onLine === false ? "off.noConnection" : "off.serverBusy"))); // modul se ni naložil (naslednjič ?r=)
}
$("#weak-sheet")?.addEventListener("click", () => {
  const msg = $("#weak-sheet-msg");
  msg.hidden = true;
  openPrintable(`/api/students/${state.student.id}/gradiva/delovni-list?sibke=1`, (m) => {
    msg.textContent = m;
    msg.hidden = false;
  });
});
// ---------- poraba in lestvica ----------

async function loadUsage() {
  // Poraba je samo za skrbnika (/api/config admin): drugim je ne zahtevamo (strežnik bi vrnil 403), kartica je skrita.
  const card = $("#usage")?.closest(".card");
  if (!usageAdmin) {
    if (card) card.hidden = true;
    return;
  }
  const res = await fetch("/api/usage").catch(() => null);
  if (card) card.hidden = !res?.ok;
  if (!res?.ok) return;
  const u = await res.json();
  const m = await import("./poraba-skrbnik.js").catch(() => null);
  if (!m) {
    if (card) card.hidden = true;
    return;
  }
  m.renderUsage($("#usage"), u, escapeHtml);
}

// ---------- uvodni ogled ----------
const TOUR_VERSION = 2;
// Ogled sam je v public/uvodni-ogled.js in se naloži šele ob prvem prikazu; startTour.end ga zapre (Nazaj).
let tourP = null;
function startTour(opts = {}) {
  tourP ||= import("./uvodni-ogled.js").catch((e) => ((tourP = null), Promise.reject(e)));
  // Med nalaganjem modula je učenec morda odprl drug pogled: samodejni ogled tedaj počaka (ročni »Ponovi« ne).
  return tourP.then((m) => (opts.full || currentView === "path" ? m.startTour(opts, { state, api, TOUR_VERSION, setEnd: (fn) => (startTour.end = fn) }) : (maybeTour.done = false))).catch(() => null);
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
// Prva rešena naloga (j, 15. 11. 2026): nov učenec pride do prve naloge brez ovinkov; vprašalnik zanimanj
// in kratek vodič dobi šele potem, ob naslednjem prihodu na Učno pot (nikoli sredi naloge).
// settings.first_task se shrani ob prvem pravilnem odgovoru; star profil brez ključa, ki že ima XP, velja za rešenega.
async function firstTaskDone(s) {
  if (s.settings?.first_task) return true;
  const x = state.xp?.sid === s.id ? state.xp : await api(`/api/students/${s.id}/xp`).catch(() => null);
  return (x?.ownTotal ?? x?.total ?? 0) > 0; // XP nalog pilota (ownTotal ga ne šteje) ni rešena naloga
}
function markFirstTask(s = state.student) {
  if (!s || s.settings?.first_task) return;
  s.settings = { ...s.settings, first_task: 1 };
  api(`/api/students/${s.id}`, { method: "PUT", body: { settings: { first_task: 1 } } }).catch(() => null);
}
async function maybeIntro() {
  const s = state.student;
  if (!s || (s.settings?.interests !== null && (s.settings?.tour_version || 0) >= TOUR_VERSION)) return;
  const done = await firstTaskDone(s);
  if (!done || state.student?.id !== s.id || currentView !== "path") {
    maybeTour.done = false; // poskusi znova ob naslednjem izrisu Učne poti
    return;
  }
  // Vprašalnik zanimanj (enkrat na profil), nato vodič, ko je vprašalnik zaprt.
  state.interestsAsk = maybeAskInterests();
  maybeTour();
}
$("#tour-again").addEventListener("click", () => {
  showView("path");
  setTimeout(() => startTour({ full: true }), 500);
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
const nastaviCalcMode = (m) => (calcMode = m); // public/kalkulator-zaslon.js setCalcMode
try {
  if (CALC_MODES.includes(localStorage.getItem("evklid.calcMode"))) calcMode = localStorage.getItem("evklid.calcMode");
} catch {}
function calcOverlayOpen() {
  return !$("#graph-overlay").hidden;
}
// Tipka Nazaj ali Esc: odprto ploščo ali meni v prikazanem orodju zapre orodje samo (back() v sci.js, calc.js).
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
document.querySelectorAll(".calc-modes").forEach((seg) =>
  seg.addEventListener("click", (e) => {
    const b = e.target.closest("[data-calc-mode]");
    if (b) setCalcMode(b.dataset.calcMode);
  }),
);
$("#graph-close").addEventListener("click", () => closeCalcOverlay());
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && calcOverlayOpen() && !e.defaultPrevented && !calcBack()) closeCalcOverlay();
});
// gumbi »Kalkulator« v Učni poti, vadnici in Inštruktorju
document.querySelectorAll(".calc-open").forEach((b) =>
  b.addEventListener("click", () => {
    // Kalkulator je že v premičnem oknu: okno pride v ospredje (pri kemiji s periodnim sistemom).
    if (isFloating("graph")) {
      focusWindow("graph");
      if (calcSubject() === "KEM") setCalcMode("pse");
      else calcMod.now()?.calcTools.sci?.then((tool) => tool.adapt?.()); // tipke poglavja, iz katerega je odprt
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
  const { worthGraph } = await import("./graph/math.js");
  // Samo, kjer ima graf smisel (#792): zveza z y ali funkcija f(x) = …, ne rešitev »x = 4« pod računom x + 1 = 5.
  if (!exprs.some(worthGraph) || !bubble.isConnected || bubble.querySelector(".graph-btn")) return;
  const b = document.createElement("button");
  b.type = "button";
  b.className = "secondary small graph-btn";
  b.innerHTML = `${icon("chart-spline")}<span>${escapeHtml(t("chat.drawGraph"))}</span>`;
  b.addEventListener("click", (e) => {
    e.stopPropagation();
    openGraphOverlay(exprs, t("nav.chat"));
  });
  // Gumb pride po izpisu (uvoz modula): če je bil učenec na dnu, ga pokažemo nad poljem za pisanje (360 px).
  const box = bubble.closest("#messages");
  const atBottom = box && box.scrollHeight - box.scrollTop - box.clientHeight < 80;
  bubble.append(b);
  if (atBottom && !bubble.nextElementSibling) box.scrollTop = box.scrollHeight;
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
    if (name === "chat" && currentView !== "chat") leaveChat(); // zaprto okno inštruktorja: od tu teče 10 min
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
    // Z neizrisanimi starejšimi sporočili (dopolniZgodovino): ključ se ob drsenju navzgor ne spremeni.
    const n = document.querySelectorAll("#messages .msg").length + (zgodovina.conv === state.conversationId ? zgodovina.ostala.length : 0);
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
initFlashcards({ api, renderRich, cardRich, escapeHtml, toast, showView, startSession, addSession, getStudent: () => state.student, getPath: () => state.pathKey, subjectName: () => SUBJECT_NAMES[(state.pathKey && state.pathSubject) || state.student?.settings.subject] || "", onDue: setCardsDue });

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
// Mnenje člana pilota (public/mnenje.js): Jaz → »Povej mnenje«, vprašanje največ enkrat na teden. Modul se naloži
// šele, ko je profil član pilota ali je kot bivši član dal dovoljenje za objavo (`published`, odgovor /pilot: opinion),
// da ga lahko prekliče (GDPR čl. 7(3)); ne ob prvem odprtju. Ob menjavi na profil brez pilota vrstico skrije.
let opinionP = null;
function syncOpinion(member, published = false) {
  if (!member && !published && !opinionP) return;
  opinionP ||= import("./mnenje.js").then((m) => {
    m.initOpinion({ api, toast, getStudent: () => state.student });
    return m;
  });
  opinionP.then((m) => m.loadOpinion()).catch(() => (opinionP = null));
}
// Naloge za člane pilota (public/pilot-naloge.js): Jaz → »Pomagaj izboljšati Evklid«.
// Anketa po 7 dneh (točka B3, public/anketa-teden.js): samo na Učni poti.
initAnketa({ api, toast, getStudent: () => state.student, currentView: () => currentView, floatingViews });
initPilot({
  api,
  toast,
  refreshXp,
  getStudent: () => state.student,
  showView,
  hasExams: () => siExams(),
  startScan: (cond) => {
    startPilotScan(pilotMod.now().scanTask(cond));
    showView("scan");
  },
  onMember: (member, published) => {
    syncBugButton();
    syncOpinion(member, published);
  },
  // Preizkus znanja v pilotu: besedilo naloge in izbire kot v vadnici (brez klikljivih formul).
  renderRich: (text) => renderRich(text),
  choiceHtml: (task, o) => choiceHtml(task, o, false),
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
  odprto,
  askTutor: (text) => {
    showView("chat");
    fillInput(text);
  },
  onOverlay: (open) => (open ? overlayOpened() : overlayClosed()),
});

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
// Zavihek Račun: ?pogled=racun (APK s strani /prenesi pošlje nakup naročnine sem, mobile/src/lib/billing.ts).
const START_VIEW = ["chat", "graph", "uci", ...UCI_TABS].find((v) => v === new URLSearchParams(location.search).get("pogled"));
const START_ACCOUNT = new URLSearchParams(location.search).get("pogled") === "racun";
const START_ASK = START_VIEW === "chat" ? (new URLSearchParams(location.search).get("vprasaj") || "").slice(0, 2000) : "";
if (new URLSearchParams(location.search).has("pogled")) history.replaceState(null, "", location.pathname);
initInstall({ toast, onSheet: (open) => (open ? overlayOpened() : overlayClosed()) });
initFullscreen();
initFormulaInfo({ opened: overlayOpened, closed: overlayClosed });

(async () => {
  prefetchAccountStatus(); // vzporedno s config (account.js)
  const cfg = await api("/api/config");
  saveConfig(cfg); // za zagon brez povezave (brez skrbniških zastavic, public/offline.js)
  $("#mock-banner").hidden = !cfg.mock;
  initTestNotice(cfg.test_notice, { showView });
  $("#chat-off").hidden = !cfg.chat_off;
  // Skrbnik: »Prijavi napako« v glavi klepeta (napaka v aplikaciji ali pri inštruktorju, public/prijave.js).
  // Člani pilota jo vidijo tudi (public/pilot-naloge.js).
  bugAdmin = !!cfg.admin;
  usageAdmin = !!cfg.admin;
  syncBugButton();
  initFeedback({ api, getStudent: () => state.student, showView, toast, currentLang }, cfg);
  initGames({ api, getStudent: () => state.student, setStudent: studentUpdated, toast: (m, ic = "check") => toast(m, ic), refreshXp, currentLang });
  // Igre v ozadju, ko se je stran že odprla (zavihek Igre se nato odpre takoj); ne ob »Skrij igre« in ne ob varčevanju
  // s podatki, počasni ali mobilni povezavi (backgroundLoadOk): takrat se igre naložijo ob dotiku zavihka Igre.
  const idle = window.requestIdleCallback || ((f) => setTimeout(f, 1500));
  setTimeout(() => idle(() => {
    if ((state.student && !gamesOn(state.student.settings)) || !backgroundLoadOk(navigator.connection)) return;
    loadGames().catch(() => {});
  }), 3000);
  // Takojšnje odpiranje (j 6. 11. 2026): ob nedejavnosti po odprtju se pripravijo verjetni naslednji zasloni.
  // Kalkulator (zadnje uporabljeno orodje) se zgradi v pomnilniku, moduli ostalih orodij in 3D sveta se le prenesejo.
  setTimeout(() => whenQuiet(prefetchNext), 2500);
  // Dotik zavihka Igre (ali vrstice v »Jaz«) začne nalaganje že pred klikom.
  document.addEventListener("pointerdown", (e) => {
    if (!gamesMod && e.target.closest?.('[data-view="games"], [data-go="games"]')) loadGames().catch(() => {});
    if (e.target.closest?.('[data-view="league"], [data-go="league"]')) prefetchLeague();
    // Kalkulator: datoteke zadnjega orodja hkrati že ob dotiku.
    if (e.target.closest?.('[data-view="graph"], [data-go="graph"], .calc-open, .task-calc')) {
      if (calcMod.now()) calcMod.now().vnaprejOrodje();
      else {
        vzporedno("kalkulator-zaslon.js");
        vzporedno(calcMode === "graph" ? "graph/calc.js" : calcMode === "sci" ? "graph/sci.js" : "graph/tools.js");
        calcMod.load().catch(() => {});
      }
    }
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
    // Prijava brez ponovnega nalaganja strani: /api/config pred prijavo še ni vedel, da je to skrbnik. Ob prvem
    // zagonu že prijavljenega (cfgFresh) je config iz te seje: drugič ga ne zahtevamo.
    const admin = (cfg.admin || o?.cfgFresh)
      ? null
      : api("/api/config")
          .then((c) => {
            bugAdmin = usageAdmin = !!c.admin;
            syncBugButton();
          })
          .catch(() => {});
    zagonIzbira = !o?.keepView;
    try {
      await loadStudents();
    } finally {
      zagonIzbira = false;
    }
    await admin; // števec porabe šele, ko vemo, ali je skrbnik (sicer 403)
    // Števec porabe (samo skrbnik) je v glavi: konec zagona počaka njegov prvi odgovor kot klic pogleda (brez premika).
    if (first) sledi(initUsageMeter({ escapeHtml, showView, toast, allowed: () => usageAdmin }));
    else refreshUsageMeter();
    // Prvo odprtje: bližnjica (?pogled=) ali zadnji zaslon (≤ 12 ur); Učna pot se pripravi pod njim.
    const z = first && !o?.keepView && !START_VIEW && !START_ACCOUNT ? startScreen() : null;
    if (!o?.keepView) showView("path");
    const mark = apiSeq; // klici do sem so od profila in Učne poti
    const other = z || (first && (START_VIEW || START_ACCOUNT) && !o?.keepView);
    if (first && START_VIEW && !o?.keepView) showView(START_VIEW);
    // Kot dotik zavihka Račun (account.js renderAccount); brez računov je zavihek skrit in ostane Učna pot.
    if (first && START_ACCOUNT && !o?.keepView && !$("#account-tab").hidden) $("#account-tab").click();
    if (z) {
      brezStetja = true;
      try {
        await openStartScreen(z);
      } finally {
        brezStetja = false;
      }
    }
    finishStart(other ? mark : null);
    if (first && START_ASK && !o?.keepView) {
      const box = $("#input");
      box.value = START_ASK;
      autoGrow();
      startDone(); // viden pogled, sicer fokus ne gre v polje (B1)
      box.focus();
    }
    if (first) {
      brezStetja = true;
      try {
        restoreWindows();
      } finally {
        brezStetja = false;
      }
    }
    first = false;
  };
  captureSource(); // oznaka vira iz povezave (public/vir.js), pred prijavo, ki lahko preusmeri
  if (await initAccount({ onReady: start }).finally(endPrerenderedLanding)) await start({ cfgFresh: true });
  else {
    // Prijava ali pristajalna stran: po prijavi se odpre Učna pot, ne zadnji zaslon pred odjavo.
    startRec = null;
    startHold = false;
    startDone();
  }
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
  startHold = false;
  startDone();
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
    // Ob spremembi zavihkov (»active« ob vsakem tapu) merimo v naslednjem okvirju, ne sredi tapa.
    let fitRaf = 0;
    const fitSoon = () => (fitRaf ||= requestAnimationFrame(() => ((fitRaf = 0), fit())));
    new MutationObserver(fitSoon).observe(tabs, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["hidden", "class"] });
    document.fonts?.ready.then(fit);
  }
}

// Skupno stanje in pomožne funkcije za module zaslonov, ki se naložijo po prvem izrisu (public/vadnica.js).
// Žive vezave ES modulov: modul vedno vidi trenutno vrednost (npr. calcMode, keptPaper).
export { CALC_MODES, calcChapter, calcOverlayOpen, currentView, loadPaperViewer, nastaviCalcMode, overlayClosed, overlayOpened, showScan, splitOpts, usageAdmin, whenQuiet };
export { $, api, calcMode, calcSubject, choiceHtml, COMP_LEVEL_NAMES, diffBadge, escapeHtml, examMode, EXTRA_SESSIONS, extraSession, fbText, fillInput, isCompTopic, keptPaper, kopija, loadConversations, localStorageGet, localStorageSet, markFirstTask, markTopic, mayPlot, meBackHtml, NODE, offTabbarViews, openCalcOverlay, openConversation, openLesson, openLocalPaper, ourMod, pathData, pathUnitsFor, plotFromText, prefetchPractice, prepBack, pripraviIzris, refreshXp, regionalExams, renderGoal, renderMath, renderRich, send, setActiveMode, setBack, setTaskFx, showView, siExams, state, studentUpdated, takePractice, toast, topicCache, topicEntry, topicRich, unlockedHtml, withFormulaSubject };

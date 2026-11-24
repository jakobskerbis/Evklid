// Zavihek Kalkulator in kalkulator čez cel zaslon (znanstveni, grafični, orodja, periodni sistem, formule): iz
// public/app.js (naloga hitrost, docs/meritve/prijavljen-mobilno-2026-11-19.md točka 2). Orodja sama (public/graph/)
// se še naprej naložijo ob prvi uporabi; ta modul app.js naloži po prvem izrisu Učne poti (zasloniPozneje) ali ob prvem
// odprtju kalkulatorja. Skupno stanje dobi iz app.js (žive vezave; zadnje orodje prek nastaviCalcMode); cel slovar.
import { naloziKnjiznice } from "./rich.js";
import { naloziVse, t, locale, currentLang } from "./i18n-osnova.js";
import { makeSplitter } from "./razdelilnik.js";
import { icon } from "./icons.js";
import { stageCode } from "./stopnja.js";
import { hideKeyboard } from "./tipkovnica-lena.js";
import { refreshBubble } from "./okna.js";
import { backgroundLoadOk } from "./games/stage.js";
import { zadrziFokus } from "./fokus-okna.js";
import { vzporedno, naloziOdvisnosti } from "./kliki.js";
import { $, CALC_MODES, api, calcChapter, calcMode, nastaviCalcMode, calcOverlayOpen, calcSubject, currentView, fillInput, loadPaperViewer, overlayClosed, overlayOpened, renderRich, showScan, showView, splitOpts, state, toast, usageAdmin, whenQuiet, withFormulaSubject } from "./app.js";

const calcTools = {};
let calcP = null; // grafični kalkulator
let calcShownTool = null; // orodje, ki je trenutno prikazano (za tipko Nazaj)
function calcBack() {
  const tool = calcShownTool;
  if (!tool?.back || !(calcOverlayOpen() || currentView === "graph")) return false;
  return !!tool.root.isConnected && !tool.root.hidden && !!tool.back();
}
function calcSlot() {
  return calcOverlayOpen() ? $("#graph-overlay-body") : $("#graph-slot");
}

function graphCalc() {
  // Kalkulator izriše formule s KaTeX (rich.js naloziKnjiznice), ki ni del prvega izrisa.
  if (!calcP) vzporedno("graph/calc.js"); // vse odvisnosti hkrati, ne raven za ravnijo (kliki.js)
  calcP ||= Promise.all([import("./graph/calc.js"), naloziKnjiznice(), naloziVse()]).then(([m]) => m).catch((e) => {
    calcP = null; // neuspel prenos (brez povezave): naslednji dotik poskusi znova
    throw e;
  }).then(({ createCalculator }) => {
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
      recent: izidi,
      askTutor: (text) => {
        closeCalcOverlay();
        showView("chat");
        fillInput(text);
      },
    });
  });
  return calcP;
}
function formulaBook() {
  const s = calcSubject();
  const subj = ["MAT", "FIZ", "KEM"].includes(s) ? s : "MAT";
  return `${subj}-${stageCode(state.student?.settings)}`;
}
// Skupna zgodovina zavihkov (j, 24. 11. 2026): zadnji številski izidi Znanstvenega, Orodij, PSE … istega učenca.
// Znanstveni jih (iz drugih zavihkov) pokaže kot čipe »Nedavno«, Grafični v meniju »Dodaj« kot vrednost drsnika.
const izidiKey = () => `evklid.izidi.${state.student?.id ?? 0}`;
const NUM_TEXT = /^-?[\d.,]+(?:E-?\d+)?$/; // 18,015 ali 6,02214076E23 (E je ×10ˣ kalkulatorja)
function izidi() {
  try {
    const l = JSON.parse(localStorage.getItem(izidiKey()) || "[]");
    return Array.isArray(l) ? l.filter((x) => x && typeof x.text === "string") : [];
  } catch {
    return [];
  }
}
function dodajIzid({ text, src }) {
  text = String(text ?? "").trim();
  if (!NUM_TEXT.test(text)) return;
  const l = [{ text, src }, ...izidi().filter((x) => !(x.text === text && x.src === src))].slice(0, 12);
  try {
    localStorage.setItem(izidiKey(), JSON.stringify(l));
  } catch {}
}
async function insertIntoCalc(text, o) {
  if (calcMode !== "sci" && !o?.replace) dodajIzid({ text, src: calcMode }); // vrednost iz Orodij, PSE, grafa
  const tool = await setCalcMode("sci");
  tool.insert(text, o);
}
function calcTool(mode) {
  if (mode === "graph") return graphCalc();
  if (!calcTools[mode]) vzporedno(mode === "sci" ? "graph/sci.js" : "graph/tools.js");
  calcTools[mode] ||= Promise.all([mode === "sci" ? import("./graph/sci.js") : import("./graph/tools.js"), naloziKnjiznice(), naloziVse()]).then(([m]) => m).catch((e) => {
    delete calcTools[mode]; // neuspel prenos (brez povezave): naslednji dotik poskusi znova
    throw e;
  }).then((m) => {
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
        recent: izidi,
        addRecent: dodajIzid,
        // »Po korakih«: zaslon Skeniraj (public/scan/) ima reševalnik po korakih
        canSteps: () => !!document.getElementById("view-scan"),
        // goal: po »Razstavi« pokaže korake razstavljanja, ne poenostavljanja
        steps: async (text, goal) => {
          if (!document.getElementById("view-scan")) return;
          closeCalcOverlay();
          showView("scan");
          showScan({ text, goal });
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
  nastaviCalcMode(mode);
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
  if (mode === "sci") {
    tool.adapt?.();
    tool.renderVars?.(); // čipi »Nedavno« (skupna zgodovina zavihkov)
  }
  // Velik razdelek (pripravljen list formul ima ~6000 elementov), ki še ni bil prikazan: najprej slika z izbranim
  // gumbom (takojšen odziv na tap), razdelek v naslednji sliki (prva postavitev lista sicer zadrži odziv).
  if (!calcShown.has(tool.root) && tool.root.getElementsByTagName("*").length > 2000) {
    await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
    if (calcMode !== mode) return;
  }
  calcShown.add(tool.root);
  calcShownTool = tool;
  showCalcRoot(calcSlot(), tool.root);
  tool.resize?.();
  refreshBubble(); // mehurček inštruktorja se umakne s tipk ali seznama tega orodja (okna.js KEEP_CLEAR)
  prebuildCalc();
  return tool;
}
// Dotik zavihka ali gumba kalkulatorja (app.js): datoteke zadnjega orodja hkrati že pred klikom.
function vnaprejOrodje() {
  if (!calcTools[calcMode] && !(calcMode === "graph" && calcP)) vzporedno(calcMode === "graph" ? "graph/calc.js" : calcMode === "sci" ? "graph/sci.js" : "graph/tools.js");
}
function prefetchNext() {
  if (navigator.connection?.saveData || document.documentElement.classList.contains("lite") || !state.student) return;
  // Lahki koraki (pregledovalnik prenesene pole, uvodni ogled) na vsaki povezavi, da delujejo tudi brez povezave;
  // težki (kalkulator, grafi, 3D, three.js) le na hitri povezavi brez omejitve podatkov (backgroundLoadOk, j 17. 11. 2026).
  const heavy = backgroundLoadOk(navigator.connection);
  const steps = [
    () => naloziOdvisnosti(), // seznam odvisnosti lenih modulov (nekaj KB): kalkulator in igre ob tapu vzporedno
    ...(heavy
      ? [
          () => calcTool(calcMode === "formulas" ? "sci" : calcMode),
          () => import("./graph/sci.js"),
          () => import("./graph/tools.js"),
          () => import("./graph/calc.js"),
          () => import("./3d/modeli.js"),
        ]
      : []),
    () => loadPaperViewer(), // pregledovalnik prenesene pole (in paper-tasks.js): odpre se tudi brez povezave
    // 3D pregledovalnik (stran /3d v okvirju) in three.js: samo v predpomnilnik service workerja, brez izvajanja,
    // da se prvi model odpre brez čakanja na omrežje.
    () =>
      navigator.serviceWorker?.controller?.postMessage({
        type: "precache",
        urls: [
          ...(heavy ? ["/3d/stran.js", "/3d/pregledovalnik.js", "/3d/scena.js", "/3d/3d.css", "/3d/nastavi.js", "/vendor/three/build/three.module.js", "/vendor/three/examples/jsm/controls/OrbitControls.js", "/vendor/three/examples/jsm/environments/RoomEnvironment.js"] : []),
          "/uvodni-ogled.js",
          ...(usageAdmin ? ["/poraba-skrbnik.js"] : []),
        ],
      }),
  ];
  const next = () => {
    const f = steps.shift();
    if (f) Promise.resolve().then(f).catch(() => null).then(() => whenQuiet(next));
  };
  next();
}
// Vsa odprta orodja ostanejo v pomnilniku in na strani (skrita): preklop Znanstveni/Grafični/Orodja/PSE/Formule
// je takojšen in ohrani vnos, graf in izbiro (j 6. 11. 2026). Prikažemo izbrano, ostala skrijemo.
const calcShown = new WeakSet(); // razdelki kalkulatorja, ki so bili že prikazani
function showCalcRoot(slot, root) {
  if (root.parentElement !== slot) slot.append(root);
  for (const el of slot.children) el.hidden = el !== root;
}
// Ko je kalkulator odprt, se ob nedejavnosti pripravijo še ostala orodja (eno za drugim), da je tudi prvi preklop takojšen.
let calcPrebuilt = false;
function prebuildCalc() {
  if (calcPrebuilt) return;
  calcPrebuilt = true;
  const rest = CALC_MODES.filter((m) => !calcTools[m] && !(m === "graph" && calcP));
  const next = () => {
    const m = rest.shift();
    if (!m) return;
    // Formule potrebujejo strežnik: v lahkem načinu jih naložimo šele ob tapu.
    if (m === "formulas" && document.documentElement.classList.contains("lite")) return next();
    // Formule: ob nedejavnosti še prenos in izris učenčevega lista v skrito orodje (ne ob varčevanju s podatki
    // in ne na telefonu z malo pomnilnika, ≤ 2 GB: skrit list doda ~8000 vozlišč DOM; pregled PR #481).
    const lowMem = navigator.deviceMemory > 0 && navigator.deviceMemory <= 2;
    const prep = (tool) => (m === "formulas" && tool && !navigator.connection?.saveData && !lowMem ? new Promise((r) => whenQuiet(() => Promise.resolve(tool.prepare?.()).catch(() => null).then(r))) : null);
    whenQuiet(() => Promise.resolve(calcTool(m)).then(prep).catch(() => null).then(() => whenQuiet(next)));
  };
  whenQuiet(next);
}
function showGraph() {
  return setCalcMode(calcMode);
}
/** Odpre kalkulator čez cel zaslon. mode: "sci" | "graph" | "units"; exprs: izrazi za graf. */
let calcFokus = null; // sprosti() fokusa v oknu kalkulatorja (fokus-okna.js)
async function openCalcOverlay({ mode = calcMode, exprs = [], backLabel = t("nav.back") } = {}) {
  $("#graph-close-label").textContent = backLabel;
  $("#graph-close").setAttribute("aria-label", backLabel);
  const zaprt = $("#graph-overlay").hidden;
  if (zaprt) overlayOpened();
  $("#graph-overlay").hidden = false;
  if (zaprt) calcFokus = zadrziFokus($("#graph-overlay"), { zacetni: $("#graph-close") });
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
  calcFokus?.();
  calcFokus = null;
  document.body.classList.remove("graph-open");
  hideKeyboard();
  $("#graph-overlay-body").replaceChildren();
  if (!$("#view-graph").hidden) setCalcMode(calcMode);
}

export { closeCalcOverlay, showGraph, calcBack, setCalcMode, calcTools, openCalcOverlay, openGraphOverlay, calcTool, prefetchNext, vnaprejOrodje };

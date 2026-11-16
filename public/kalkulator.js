// Samostojni kalkulator za /kalkulator (mobilna aplikacija ga pokaže v WebView): isti moduli kot okno
// kalkulatorja v app.js (calcTool, setCalcMode), brez prijave. »Moji grafi« potrebujejo račun, zato jih ni.
import { t, locale, currentLang, applyI18n } from "./i18n.js";
import { icon, hydrateIcons } from "./icons.js";
import { initDrsniki } from "./drsniki.js";
import { initSirina } from "./sirina.js";
// spustni meniji kot v aplikaciji (sistemski <select> pri 360 px odreže »Samodejno«; pregled #457)
import "./dropdown.js";

const MODES = ["sci", "graph", "tools", "pse"];
const q = new URLSearchParams(location.search);
const subject = /^[A-Z]{2,5}$/.test(q.get("subject") || "") ? q.get("subject") : "MAT";
const slot = document.getElementById("graph-overlay-body");
const tools = {};
let mode = null;

function toast(msg) {
  const el = document.getElementById("toast");
  el.innerHTML = `${icon("check")}<span></span>`;
  el.querySelector("span").textContent = msg;
  el.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => (el.hidden = true), 3500);
}

function tool(m) {
  const base = { t, icon, locale, onInsert: (text) => setMode("sci").then((s) => s.insert(text)) };
  const host = document.createElement("div");
  if (m === "graph") {
    host.id = "graph-host";
    tools.graph ||= import("./graph/calc.js").then(({ createCalculator }) =>
      createCalculator(host, { ...base, toast, storageKey: () => "evklid.graph.0", studentId: () => null, canExport: false }),
    );
  } else if (m === "sci") {
    tools.sci ||= import("./graph/sci.js").then((mod) =>
      mod.createScientific(host, { ...base, toast, storageKey: () => "evklid.sci.0", openGraph: async (exprs) => (await setMode("graph"))?.show(exprs), canSteps: () => false }),
    );
  } else {
    tools[m] ||= import("./graph/tools.js").then((mod) => (m === "pse" ? mod.createPse(host, { ...base, lang: currentLang }) : mod.createTools(host, { ...base, subject: () => subject })));
  }
  return tools[m];
}

async function setMode(m) {
  if (!MODES.includes(m)) m = "sci";
  mode = m;
  document.querySelectorAll("[data-calc-mode]").forEach((b) => {
    b.classList.toggle("active", b.dataset.calcMode === m);
    b.setAttribute("aria-selected", String(b.dataset.calcMode === m));
  });
  const tl = await tool(m);
  if (mode !== m) return tl;
  if (m === "tools") tl.reload?.();
  // orodja ostanejo v pomnilniku in na strani (skrita): preklop je takojšen in ohrani vnos (kot app.js showCalcRoot)
  if (tl.root.parentElement !== slot) slot.append(tl.root);
  for (const el of slot.children) el.hidden = el !== tl.root;
  tl.resize?.();
  return tl;
}

applyI18n();
document.title = t("nav.graph");
hydrateIcons();
initSirina();
initDrsniki();
document.querySelector(".calc-modes").addEventListener("click", (e) => {
  const b = e.target.closest("[data-calc-mode]");
  if (b) setMode(b.dataset.calcMode);
});
setMode(q.get("mode"));

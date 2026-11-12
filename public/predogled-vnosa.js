// Predogled formul pod poljem za vnos (j, 12. 11. 2026: »Naj se ulomki, koreni itd. izpisujejo tudi v takih poljih«).
// Tipke Evklidove tipkovnice vstavijo zapis v vrstici, npr. (3)/(4), √(2), x^(2) (public/vnos-formul.js). V klepetu ga
// predogled nad poljem že izriše kot formulo (app.js autoGrow); tu enako velja za vsa druga polja: odgovor naloge,
// vmesni koraki, kviz … Pod vrstico s poljem se pokaže, kar je učenec napisal, z ulomki, koreni in potencami. Vrednost
// polja ostane nespremenjena (preverjanje odgovora dobi točno to, kar je napisano). Prazno mesto (»()/()«) je okvirček.
import { splitFormulas, hasFormula } from "./vnos-formul.js";

// Polja s svojim izrisom: klepet (#formula-preview) in kalkulator (sprotni izračun pod vnosom).
const BREZ = "#input, [data-brez-predogleda], .graph-overlay, #graph-slot, .gc, .sc, .tl, .fm, .pse";
const predogledi = new WeakMap(); // polje → element s predogledom

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const tex = (t) => {
  try {
    // Prazno mesto iz tipke (ulomek, koren, potenca, ki ga učenec še ni izpolnil) kot okvirček, da se vidi, kam pišeš.
    return globalThis.katex.renderToString(`\\displaystyle ${t.replace(/\{\}/g, "{\\square}")}`, { throwOnError: false, strict: "ignore" });
  } catch {
    return esc(t);
  }
};

export function predogledHtml(vrednost) {
  return splitFormulas(vrednost)
    .map((p) => ("tex" in p ? tex(p.tex) : esc(p.text)))
    .join("");
}

function polje(el) {
  const f = el?.closest?.("input, textarea");
  if (!f || (f.tagName === "INPUT" && !/^(?:text|search|)$/.test(f.getAttribute("type") || ""))) return null;
  return f.closest(BREZ) ? null : f;
}

function posodobi(f) {
  let pv = predogledi.get(f);
  const pokazi = !!globalThis.katex && hasFormula(f.value);
  if (!pokazi) {
    if (pv) pv.hidden = true;
    return;
  }
  if (!pv || !pv.isConnected) {
    pv = document.createElement("div");
    pv.className = "formula-preview vnos-predogled";
    pv.setAttribute("aria-hidden", "true"); // bralnik zaslona bere polje samo
    // Pod vrstico s poljem in gumbi (odgovor naloge: polje, Napiši, Preveri), sicer tik pod poljem.
    (f.closest(".answer-row") || f).after(pv);
    predogledi.set(f, pv);
  }
  pv.innerHTML = predogledHtml(f.value);
  pv.hidden = false;
}

let zagnano = false;
// Enkrat ob zagonu aplikacije (app.js): odslej ima vsako polje predogled, ko je v njem zapis formule.
export function initPredogledVnosa() {
  if (zagnano || typeof document === "undefined") return;
  zagnano = true;
  const ob = (e) => {
    const f = polje(e.target);
    if (f) posodobi(f);
  };
  document.addEventListener("input", ob, true);
  document.addEventListener("change", ob, true);
}

// Predogled formul pod poljem za vnos (j, 12. 11. 2026: »Naj se ulomki, koreni itd. izpisujejo tudi v takih poljih«).
// Tipke Evklidove tipkovnice vstavijo zapis v vrstici, npr. (3)/(4), √(2), x^(2) (public/vnos-formul.js). V klepetu ga
// predogled nad poljem že izriše kot formulo (app.js autoGrow); tu enako velja za vsa druga polja: odgovor naloge,
// vmesni koraki, kviz … Pod vrstico s poljem se pokaže, kar je učenec napisal, z ulomki, koreni in potencami. Vrednost
// polja ostane nespremenjena (preverjanje odgovora dobi točno to, kar je napisano). Prazno mesto (»()/()«) je okvirček.
import { splitFormulas, hasFormula } from "./vnos-formul.js";

// Polja s svojim izrisom: klepet (#formula-preview), kalkulator (sprotni izračun pod vnosom), skeniraj (.scan-preview);
// iskalnik spustnega seznama (ikona kljukice je sosed polja: .dd-search input + .dd-check).
const BREZ = "#input, [data-brez-predogleda], .graph-overlay, #graph-slot, .gc, .sc, .tl, .fm, .pse, .scan-confirm, .dd-search, .razpri-area";
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
    if (!slogDodan) {
      slogDodan = true;
      const st = document.createElement("style");
      st.textContent = SLOG;
      document.head.append(st);
    }
    pv = document.createElement("div");
    pv.className = "formula-preview vnos-predogled";
    pv.setAttribute("aria-hidden", "true"); // bralnik zaslona bere polje samo
    // Pod vrstico s poljem in gumbi (odgovor naloge: polje, Napiši, Preveri; vsaka vrstica flex), sicer tik pod poljem.
    const st = f.parentElement && getComputedStyle(f.parentElement);
    const vrsta = st && /flex/.test(st.display) && !st.flexDirection.startsWith("column") ? f.parentElement : f;
    (f.closest(".answer-row") || vrsta).after(pv);
    predogledi.set(f, pv);
    sledi(f);
  }
  if (pv.dataset.v !== f.value) {
    pv.innerHTML = predogledHtml(f.value);
    pv.dataset.v = f.value;
  }
  pv.hidden = false;
}

// Polje s predogledom: tudi vrednost, ki jo nastavi koda brez dogodka »input« (plošča Piši: enota, prebrani zapis,
// Popravi; nastavitve ob menjavi profila), osveži predogled.
function sledi(f) {
  const d = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(f), "value");
  if (!d?.set || Object.getOwnPropertyDescriptor(f, "value")) return;
  Object.defineProperty(f, "value", {
    configurable: true,
    get: () => d.get.call(f),
    set: (v) => {
      d.set.call(f, v);
      queueMicrotask(() => posodobi(f));
    },
  });
}

// Videz je tu (ne v style.css), ker se modul naloži šele ob prvem zapisu formule (prvo odprtje ostane enako veliko).
let slogDodan = false;
// Odprta plošča Piši na telefonu skrije vrstico z odgovorom (touch.css): z njo tudi predogled.
const SLOG =
  ".vnos-predogled{margin:6px 0 0;padding:6px 12px;border-radius:12px;background:color-mix(in srgb,var(--text) 5%,transparent);max-width:100%;box-sizing:border-box}" +
  "@media (max-width:599px),(max-width:899px) and (min-height:501px),(hover:none) and (pointer:coarse){body.pad-open .task .answer-row+.vnos-predogled{display:none}}";

let zagnano = false;
// Ob prvem zapisu formule (app.js): odslej ima vsako polje predogled, ko je v njem zapis formule. prvo: polje, v katerem
// je učenec ravno pisal (njegov dogodek je že mimo).
export function initPredogledVnosa(prvo) {
  if (zagnano || typeof document === "undefined") return;
  zagnano = true;
  const ob = (e) => {
    const f = polje(e.target);
    if (f) posodobi(f);
  };
  document.addEventListener("input", ob, true);
  document.addEventListener("change", ob, true);
  if (prvo) ob({ target: prvo });
}

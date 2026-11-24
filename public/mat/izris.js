// Skupni izris matematike (j, 24. 11. 2026: »Evklid – obvezen enoten standard matematičnega zapisa«; faza F1 v
// projektnem dokumentu predlogi/enoten-matematicni-zapis-nacrt-2026-11-24.md). EDINO mesto v aplikaciji, ki kliče
// KaTeX: lekcije, inštruktor, kalkulatorji, skener, simulacije, skice, 3D, PDF učbenika in preverjanje na strežniku.
// Vsi izrisi imajo tako iste nastavitve:
//   - strict "ignore", meje maxSize/maxExpand (zelo velik ali rekurziven izraz od učenca ali modela ne zamrzne strani),
//   - trust samo za lastne ukaze (\htmlData oznak formul, \htmlClass kazalca), nikoli za \href, \url, \includegraphics,
//   - izhod HTML + MathML (bralniki zaslona preberejo formulo),
//   - neveljaven ali nepopoln izraz NIKOLI ne pokaže rdečega surovega LaTeX-a: privzeto prazen okvirček z razredom
//     mat-napaka (ui.css), opis za bralnik zaslona; kdor želi napako sam obravnavati, poda napaka: "vrzi".
// Brez DOM; v Node knjižnico KaTeX poda klicatelj (možnost katex), v brskalniku je globalna (rich.js naloziKnjiznice).

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// Decimalna vejica v formuli: »0,041« → »0{,}041« (KaTeX bi za vejico dodal presledek kot za ločilom: »0, 041«).
// Naštevanje (»1, 2«, »\{1, 2, 3\}«, »x_{1,2}«) ostane, kot je: le število z eno vejico med števkama.
export const decVejica = (t) =>
  String(t).replace(/\d+(?:,\d+)+/g, (m, i, s) => (m.indexOf(",") === m.lastIndexOf(",") && !/(?:_\{|\\\{)\s*$/.test(s.slice(0, i)) ? m.replace(",", "{,}") : m));

// Lastni ukazi, ki jih smemo izvesti (trust). Ime ali seznam imen; funkcija samo za posebne primere (ni v predpomnilniku).
export const ZAUPAJ = {
  oznake: (c) => c.command === "\\htmlData", // klikljive oznake formul (formula-info.js, sirina.js)
  kazalec: (c) => c.command === "\\htmlClass" && c.class === "vnos-kazalka", // kazalec v poljih za vnos
  kalkulator: (c) => (c.command === "\\htmlClass" && /^(sc-|vnos-)/.test(c.class || "")) || c.command === "\\htmlData", // sci-vnos.js
};
const zaupanje = (z) => {
  if (!z) return undefined;
  if (typeof z === "function") return z;
  const imena = [].concat(z);
  const fns = imena.map((n) => ZAUPAJ[n]).filter(Boolean);
  return (c) => fns.some((f) => f(c));
};

// errorColor: nedovoljen ukaz (npr. \href brez trust) KaTeX ne vrže, ampak ga izpiše kot surovo besedilo v barvi napake.
// Z lastno barvo ga prepoznamo in obravnavamo kot napako (nikoli surov \href na strani).
const BARVA_NAPAKE = "#c01e7a";
const OSNOVA = { strict: "ignore", maxSize: 20, maxExpand: 1000, errorColor: BARVA_NAPAKE };

// Okvirček namesto neizrisljive formule. Izvirnika ne kažemo (surov LaTeX); bralnik zaslona dobi opis.
export const NAPAKA_HTML = '<span class="mat-napaka" role="img" aria-label="Formule ni mogoče prikazati">⬚</span>';

const predpomnilnik = new Map();
const NAJVEC = 800;

// izrisi(tex, { blok, napaka, zaupaj, makri, vejica, izhod, katex }) → HTML
//   blok:   samostojna formula (displayMode)
//   napaka: "okvir" (privzeto) | "vrzi" (vrže napako KaTeX) | "besedilo" (izvirnik kot ubežano besedilo, npr. med
//           pisanjem v polju, kjer je izraz pogosto nedokončan in ga kazalec spremlja)
//   zaupaj: ime iz ZAUPAJ ali seznam imen (ali funkcija)
//   makri:  makri KaTeX (npr. skener: \sideL, \sideR)
//   vejica: decimalno vejico zapiši kot {,} (decVejica)
//   izhod:  "htmlAndMathml" (privzeto) | "html" | "mathml" (PDF učbenika)
export function izrisi(tex, { blok = false, napaka = "okvir", zaupaj, makri, vejica = false, izhod, katex } = {}) {
  const k = katex || globalThis.katex;
  let src = String(tex ?? "");
  if (vejica) src = decVejica(src);
  if (!k) {
    if (napaka === "vrzi") throw new Error("KaTeX ni naložen");
    return `<span class="mat-caka">${esc(src)}</span>`; // rich.js ima za ta primer nadomestek, ki se izriše pozneje
  }
  const kljuc = typeof zaupaj === "function" ? null : `${blok ? "D" : "i"}|${izhod || ""}|${[].concat(zaupaj || []).join(",")}|${makri ? JSON.stringify(makri) : ""}|${src}`;
  if (kljuc !== null && k === globalThis.katex) {
    const h = predpomnilnik.get(kljuc);
    if (h !== undefined) return h;
  }
  let html;
  try {
    html = k.renderToString(src, { ...OSNOVA, displayMode: blok, throwOnError: true, trust: zaupanje(zaupaj), macros: makri ? { ...makri } : undefined, output: izhod });
    if (html.includes(BARVA_NAPAKE)) throw new Error(`KaTeX: nedovoljen ukaz v »${src.slice(0, 40)}«`);
  } catch (e) {
    if (napaka === "vrzi") throw e;
    return napaka === "besedilo" ? esc(src) : NAPAKA_HTML;
  }
  if (kljuc !== null && k === globalThis.katex) {
    if (predpomnilnik.size >= NAJVEC) predpomnilnik.delete(predpomnilnik.keys().next().value);
    predpomnilnik.set(kljuc, html);
  }
  return html;
}

// Napaka izraza kot kratko besedilo ali null (preverjanje lekcij, gradiv in nalog na strežniku).
export function napakaIzraza(tex, { blok = false, katex, zaupaj, makri } = {}) {
  try {
    izrisi(tex, { blok, katex, zaupaj, makri, napaka: "vrzi" });
    return null;
  } catch (e) {
    return String(e?.message || e).split("\n")[0];
  }
}

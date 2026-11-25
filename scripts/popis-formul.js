// Popis matematičnega zapisa (j, 24. 11. 2026: »Evklid – obvezen enoten standard matematičnega zapisa«, faza F0 v
// projektnem dokumentu predlogi/enoten-matematicni-zapis-nacrt-2026-11-24.md; j, 25. 11. 2026, N-07: »Vsi matematični
// zapisi v celotnem Evklidu morajo biti dosledno prikazani v LaTeX/KaTeX«, merilo: skripta najde neizrisano matematiko
// v VSEH vidnih besedilih, teče v CI, cilj 0 zadetkov). SAMO POROČILO: nič ne spreminja.
// Vsako besedilo izriše po isti poti kot aplikacija (public/rich.js → public/mat/izris.js, KaTeX, marked) in v vidnem
// besedilu (brez izrisanih formul in kode) poišče ostanke, ki jih učenec ne bi smel videti:
//   napaka     – formula, ki je KaTeX ne zna izrisati (učenec vidi prazen okvirček ⬚)
//   latex      – ukaz LaTeX zunaj formule (\frac, \sqrt, \cdot …)
//   dolar      – osamljen $ (nezaprta formula)
//   potenca    – x^2, a_n zunaj formule
//   koren      – sqrt(…) zunaj formule
//   zvezdica   – * kot množenje (2*x, a * b) zunaj formule
//   primerjava – ASCII <=, >=, != zunaj formule
// Viri (vsi, ki jih učenec bere in nosijo matematiko; brez kalkulatorja, ki ima svojega lastnika, CLAUDE.md):
//   lekcije  content/lessons/**/*.md (razdelki, drugačne razlage, »Preveri se«)
//   formule  content/formulas/*.md (listi s formulami)
//   gradiva  content/gradiva/**/*.md (poskusi, projekti, miselni vzorci)
//   pole     content/exam-papers/*.json (NPZ, matura, poklicna: besedila, možnosti, rešitve, točkovnik)
//   vaje     generatorji nalog (server/practice): besedilo, namig, rešitev, formula, podatki, možnosti, razlage napak
//   slovar   public/formula-data.js SYMBOLS (kartica ob kliku na oznako v formuli)
//   ui       public/i18n/sl.js (besedila vmesnika)
// Namerni navadni zapis: namig za vnos (inputHint, ključi ui z »Hint« pri kalkulatorju) uči, kako se tipka, zato ga
// ne štejemo (izpiše se posebej z --vnos). Izris v brskalniku (DOM) preverja neizrisanoVDom spodaj (na vsakem zaslonu
// scripts/preveri-aplikacijo.cjs).
//
// Uporaba: node scripts/popis-formul.js [--json] [--vzorci N] [--vir lekcije,vaje,…] [--vnos] [--odstrani-popravljene] [poti lekcij …]
//   (privzeto vsi viri; s potmi samo te lekcije). Test: test/mat-zapis.test.js (izhodišče test/fiksno/mat-zapis-izhodisce.json).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import katex from "katex";
import { marked } from "marked";
import { createRenderer } from "../public/rich.js";
import { parseLesson, expandFormulaBlocks, hideSolutions, hideQuickAnswers, viewCheck, stripRacunBlocks, formulaSheetSections } from "../server/textbook.js";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const rel = (p) => path.relative(ROOT, path.resolve(p)).replace(/\\/g, "/");

function vseMd(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...vseMd(p));
    else if (e.name.endsWith(".md") && e.name !== "README.md") out.push(p);
  }
  return out.sort();
}

// Napake KaTeX štejemo posebej. Skupni izris (public/mat/izris.js) kliče KaTeX vedno s throwOnError in ob napaki
// pokaže okvirček ⬚ (NAPAKA_HTML), zato napako zabeležimo tu in jo vržemo naprej, kot bi jo KaTeX sam.
let napakeTrenutne = [];
const katexStet = {
  renderToString(tex, o) {
    try {
      return `\u0001${katex.renderToString(tex, o)}\u0002`;
    } catch (e) {
      napakeTrenutne.push({ tex, sporocilo: String(e.message).split("\n")[0] });
      throw e;
    }
  },
};
const { renderRich, renderMath } = createRenderer({ marked, katex: katexStet, sanitize: (h) => h });

// Vidno besedilo brez izrisanih formul in brez kode (```, `…`).
export const vidno = (html) =>
  html
    .replace(/\u0001[^\u0002]*\u0002/g, " ⟦F⟧ ")
    .replace(/<pre[\s\S]*?<\/pre>|<code[\s\S]*?<\/code>|<svg[\s\S]*?<\/svg>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");

export const VZOREC = {
  // Vsak ukaz (\frac, \mathbf, \angle …): zunaj formule ga učenec ne bi smel videti nikoli.
  latex: /\\[a-zA-Z]{2,}/g,
  // Znak za dolar ob znesku ni formula: »{usd} $«, »($)«, »$5« (stroški AI v ameriških dolarjih). Velja samo za
  // besedila vmesnika (t(), brez izrisa $…$); v vsebini, ki gre skozi renderRich, je vsak viden $ napaka (DOLAR_STROGO).
  dolar: /(?<![\d}][ \t]?|\()\$(?![ \t]?\d|\))/g,
  // ^ brez pogleda nazaj (cm^2, 10^3, s^-1); _ s pogledom nazaj (imena v SQL, npr. id_kluba), kemija posebej (CO_2).
  potenca: /[A-Za-z0-9)\]]\^[-−]?[\w({]|(?<![\w/:.])[A-Za-z]_[\w{(]|(?<![\w/:.])[A-Z][a-z]?[A-Z]?[a-z]?_\d/g,
  koren: /\bsqrt\s*\(/g,
  // * med števkami, posamičnimi črkami ali oklepaji (2*3, 2 * x, a*b, )*( ); Markdown poudarke (*beseda*) marked že
  // pretvori v <em>, zato ostane le dobesedna zvezdica. Zvezdica za opombo (»cena*«) nima števke ali črke za seboj.
  zvezdica: /(?:\d|(?<![\p{L}\d])\d?\p{L}|\))[ \t]?\*{1,2}[ \t]?(?:\d|\p{L}(?![\p{L}\d])|\()/gu,
  // ASCII primerjave med izrazoma (x <= 3, a != b); puščic (->, =>) ne štejemo: v besedilu so namerne.
  primerjava: /[\w)][ \t]?(?:<=|>=|!=)[ \t]?[\w(−-]/g,
};
export const VRSTE = ["napaka", ...Object.keys(VZOREC)];
const DOLAR_STROGO = /\$/g;

// Pregled enega besedila. nacin "md": Markdown s formulami $…$ (renderRich, kot naloga, lekcija, klepet);
// "tex": čisti TeX brez ločil (formula naloge, podatki, možnosti z options_tex; renderMath).
// strogo: vsak viden $ je zadetek (vsebina; brez izjeme za zneske, ki velja za besedila vmesnika).
// Vrne [{ vrsta, ujemanje, odlomek, tex? }].
export function pregledaj(besedilo, nacin = "md", { strogo = false } = {}) {
  napakeTrenutne = [];
  const s = String(besedilo ?? "");
  if (!s.trim()) return [];
  const html = nacin === "tex" ? renderMath(s, false) : renderRich(s);
  const out = napakeTrenutne.map((n) => ({ vrsta: "napaka", ujemanje: n.tex, odlomek: `${n.tex.slice(0, 80)} — ${n.sporocilo.slice(0, 80)}` }));
  if (nacin === "tex") return out;
  const t = vidno(html);
  for (const [vrsta, re] of Object.entries(VZOREC))
    for (const m of t.matchAll(strogo && vrsta === "dolar" ? DOLAR_STROGO : re))
      out.push({
        vrsta,
        ujemanje: m[0],
        odlomek: t.slice(Math.max(0, m.index - 30), m.index + 30).replace(/\s+/g, " ").trim(),
        jedro: t.slice(Math.max(0, m.index - 12), m.index + m[0].length + 12),
      });
  return out;
}

// Vrstica v izvirniku, kjer stoji zadetek (najboljši približek: prva vrstica z ujemanjem ali z besedilom pred njim).
function vrsticaV(izvor, z, json = false) {
  if (!izvor) return null;
  const esc = (x) => (json ? JSON.stringify(x).slice(1, -1) : x);
  const kosi = [z.vrsta === "napaka" ? z.ujemanje.slice(0, 40) : null, z.odlomek.replace(/⟦F⟧/g, "").split(/\s{2,}/).sort((a, b) => b.length - a.length)[0]?.slice(0, 24), z.ujemanje.length >= 3 ? z.ujemanje : null].filter((x) => x && x.trim().length >= 3);
  const vrstice = izvor.split("\n");
  for (const k of kosi) {
    const i = vrstice.findIndex((v) => v.includes(esc(k.trim())));
    if (i >= 0) return i + 1;
  }
  return null;
}

// Izris v brskalniku (DOM): kar statični pregled ne vidi (besedila s strežnika, sestavljena v kodi, napake poti izrisa).
// Teče na vsakem zaslonu scripts/preveri-aplikacijo.cjs (screen) in v test/mat-zapis.test.js. Samostojna funkcija brez
// zunanjih imen (Playwright jo prenese v stran kot besedilo). Išče:
//   napaka – .katex-error ali okvirček .mat-napaka (formula, ki je KaTeX ni izrisal)
//   latex  – ukaz LaTeX v vidnem besedilu zunaj .katex
//   dolar  – formula $…$, ki ni šla skozi izris (par $ okoli matematike)
//   koren  – sqrt(…) v vidnem besedilu
// x^2 in a_n tu ne iščemo: ti so že v izhodišču statičnega pregleda (vsebina) in bi zaradi naključnih nalog dali
// nestalen izid. Zadetki v kalkulatorju (ima svojega lastnika, CLAUDE.md) imajo kalk: true in gredo v register AUDIT.
export function neizrisanoVDom() {
  const KALK = "#view-graph, #graph-overlay, #graph-slot";
  const PRESKOCI = ".katex, script, style, code, pre, textarea, svg, noscript, [contenteditable], [aria-hidden='true']";
  const vis = (el) => !!(el.offsetParent || el.getClientRects().length) && getComputedStyle(el).visibility !== "hidden";
  const opis = (el) => {
    const v = el.closest("[id]");
    return `${v ? `#${v.id} ` : ""}${el.nodeName.toLowerCase()}${el.classList.length ? `.${[...el.classList].slice(0, 2).join(".")}` : ""}`;
  };
  const VZ = {
    latex: /\\(?:frac|dfrac|sqrt|cdot|times|int|sum|lim|left|right|mathrm|text|alpha|beta|pi|Delta|vec|overline|leq?|geq?|neq|approx|infty)(?![a-zA-Z])/,
    // Par $…$ okoli matematike; kot pri Markdownu (pandoc) brez presledka takoj za prvim in pred drugim $, sicer sta
    // to zneska (»nad 1 $ na mesec; nad 3 $«, Nastavitve → poraba).
    dolar: /(?<![\\\w])\$(?!\s)(?=[^$\n]{0,79}[\\^_=+*/\d])[^$\n]{1,80}(?<!\s)\$(?!\d)/,
    koren: /\bsqrt\s*\(/,
  };
  const out = [];
  const dodaj = (vrsta, el, besedilo) => out.push({ vrsta, kalk: !!el.closest(KALK), kje: opis(el), odlomek: String(besedilo).replace(/\s+/g, " ").trim().slice(0, 90) });
  for (const el of document.querySelectorAll(".katex-error, .mat-napaka")) if (vis(el)) dodaj("napaka", el, el.getAttribute("title") || el.textContent);
  const hodi = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = hodi.nextNode(); n; n = hodi.nextNode()) {
    const el = n.parentElement;
    const t = n.nodeValue;
    if (!el || !t || t.length < 4) continue;
    // Najprej vzorci (poceni), šele ob zadetku vidnost (getComputedStyle na vsakem besedilu bi upočasnil vsak zaslon).
    for (const [vrsta, re] of Object.entries(VZ)) {
      const m = re.exec(t);
      if (m && !el.closest(PRESKOCI) && vis(el)) dodaj(vrsta, el, t.slice(Math.max(0, m.index - 30), m.index + 50));
    }
  }
  return out;
}

// ---- viri ----

// Vrstice :::simboli (public/formula-data.js parseSymbolsBlock) se pokažejo na kartici ob kliku na oznako:
// oznaka, zveza in enota so TeX, ime in opomba Markdown z $…$ (content/lessons/README.md »Oznake«).
const simboli = (list) =>
  list.flatMap((s) => [
    ...(s.tex || []).map((b) => ({ besedilo: b, polje: "simboli.oznaka", nacin: "tex" })),
    { besedilo: s.n, polje: "simboli.ime" },
    { besedilo: s.r, polje: "simboli.zveza", nacin: "tex" },
    { besedilo: s.u && s.u !== "–" ? s.u : "", polje: "simboli.enota", nacin: "tex" },
    { besedilo: s.note, polje: "simboli.opomba" },
  ]);

function* virLekcije(datoteke) {
  for (const f of datoteke || vseMd(path.join(ROOT, "content/lessons"))) {
    const izvor = fs.readFileSync(f, "utf8");
    // Kot v aplikaciji (server/textbook.js lessonView): razdelki in drugačne razlage z razširjenimi bloki :::formula,
    // :::premisli, :::risba (:::simboli so podatki za klikljive oznake, niso vidni) in rešitvami za gumbom; »Preveri se«
    // po delih, kot jih izriše public/preveri-se-ziv.js (vprašanje, možnosti, enota, odgovor, namigi, razlaga).
    const L = parseLesson(stripRacunBlocks(izvor));
    const deli = [...(L.sections || []), ...(L.alternatives || [])].map((x) => hideSolutions(hideQuickAnswers(expandFormulaBlocks(x.md, "html"))));
    for (const c0 of L.checks || []) {
      const c = viewCheck(c0);
      deli.push(c.q, ...(c.options || []), ...(c.items || []).map((x) => (typeof x === "string" ? x : x?.text ?? x?.t ?? "")), c.unit, c.answer, c.why, ...(c.wrong || []).map((w) => w.why));
    }
    yield { mesto: rel(f), izvor, besedila: [...deli.filter((x) => typeof x === "string" && x.trim()).map((b) => ({ besedilo: b })), ...simboli(L.symbols || [])] };
  }
}

function* virFormule() {
  const dir = path.join(ROOT, "content/formulas");
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".md")).sort()) {
    const izvor = fs.readFileSync(path.join(dir, f), "utf8");
    const { sections } = formulaSheetSections(f.slice(0, -3));
    yield { mesto: rel(path.join(dir, f)), izvor, besedila: sections.flatMap((x) => [{ besedilo: x.md }, ...simboli(x.symbols)]) };
  }
}

function* virGradiva() {
  for (const f of vseMd(path.join(ROOT, "content/gradiva"))) {
    const izvor = fs.readFileSync(f, "utf8");
    const { meta, sections } = parseLesson(izvor);
    yield { mesto: rel(f), izvor, besedila: [{ besedilo: meta?.naslov || "" }, ...sections.map((s) => ({ besedilo: `${s.title ? `## ${s.title}\n\n` : ""}${s.md}` }))] };
  }
}

// Polja pol, ki niso besedilo za učenca (oznake, slike SVG, vrsta naloge).
const POLE_PRESKOCI = new Set(["id", "exam", "subject", "author", "format", "figure", "solutionFigure", "section", "image", "src", "svg"]);
function* virPole() {
  const dir = path.join(ROOT, "content/exam-papers");
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".json")).sort()) {
    const izvor = fs.readFileSync(path.join(dir, f), "utf8");
    const besedila = [];
    const hodi = (o, pot, kljuc) => {
      if (typeof o === "string") {
        if (!POLE_PRESKOCI.has(kljuc)) besedila.push({ besedilo: o, polje: pot });
      } else if (Array.isArray(o)) o.forEach((x, i) => hodi(x, `${pot}[${i}]`, kljuc));
      else if (o && typeof o === "object") for (const [k, v] of Object.entries(o)) hodi(v, pot ? `${pot}.${k}` : k, k);
    };
    hodi(JSON.parse(izvor), "", "");
    yield { mesto: rel(path.join(dir, f)), izvor, json: true, besedila };
  }
}

// Generatorji: vsak generator neposredno (ne prek izbire teme, da nov generator ne premakne semen drugim), ravni 1–3,
// semena 1–3. Mesto je datoteka in vrstica z »id: "<id>"«.
async function* virVaje() {
  const { GENERATORS, plainCommas, optionsAreTex } = await import("../server/practice/index.js");
  const { makeRng } = await import("../server/practice/rng.js");
  const gdir = path.join(ROOT, "server/practice/generators");
  const kje = new Map();
  for (const f of fs.readdirSync(gdir).filter((x) => x.endsWith(".js"))) {
    fs.readFileSync(path.join(gdir, f), "utf8").split("\n").forEach((v, i) => {
      for (const m of v.matchAll(/\bid:\s*["'`]([^"'`]+)["'`]/g)) if (!kje.has(m[1])) kje.set(m[1], `${rel(path.join(gdir, f))}:${i + 1}`);
    });
  }
  for (const g of GENERATORS) {
    const besedila = [];
    const leto = g.maxYear ?? null;
    for (const raven of [1, 2, 3])
      for (let seme = 1; seme <= 3; seme++) {
        let t;
        try {
          t = g.gen(raven, makeRng(seme), g.topics[0], "sl", leto);
        } catch {
          continue; // napake generatorjev lovi scripts/preveri-generatorje.js
        }
        if (!t?.text || !t.answer) continue;
        t = plainCommas(t, !g.langs);
        const a = t.answer;
        const md = (b, polje) => b != null && besedila.push({ besedilo: String(b), polje });
        const tex = (b, polje) => b != null && besedila.push({ besedilo: String(b), polje, nacin: "tex" });
        md(t.text, "text");
        md(t.hint, "hint");
        md(t.solution, "solution");
        [].concat(t.formula || []).forEach((f) => tex(f, "formula"));
        (t.data?.given || []).forEach((x) => tex(x, "data.given"));
        (t.data?.find || []).forEach((x) => tex(x, "data.find"));
        if (a.type === "choice") (a.options || []).forEach((o) => (optionsAreTex(t) ? tex(o, "options") : md(o, "options")));
        md(a.why, "why");
        (a.mistakes || []).forEach((m) => md(m.why, "mistakes.why"));
      }
    yield { mesto: kje.get(g.id) || `generator ${g.id}`, ident: g.id, besedila, stevila: true };
  }
}

// Splošni slovar oznak (public/formula-data.js SYMBOLS): kartica ob kliku na oznako, ko lekcija nima svojega pomena.
async function* virSlovar() {
  const f = path.join(ROOT, "public/formula-data.js");
  const { SYMBOLS } = await import(pathToFileURL(f).href);
  const izvor = fs.readFileSync(f, "utf8");
  for (const [predmet, tabela] of Object.entries(SYMBOLS)) {
    const besedila = [];
    for (const [oznaka, v] of Object.entries(tabela))
      for (const e of [].concat(v)) besedila.push(...simboli([{ tex: [oznaka], n: e.n, r: e.r, u: e.u, note: e.note }]).map((b) => ({ ...b, polje: `${oznaka}.${b.polje.split(".")[1]}` })));
    yield { mesto: rel(f), izvor, besedila, poKljucu: false, json: false, slovar: predmet };
  }
}

// Ključi kalkulatorja, ki učijo tipkanje (»Npr. x^3 − 3x, sin(x)/x«): namerni navadni zapis.
export const UI_VNOS = (k) => /^sc\./.test(k) && /(?:hint|Hint|placeholder|ph)$/.test(k);
async function* virUi(vnos = false) {
  const f = path.join(ROOT, "public/i18n/sl.js");
  const izvor = fs.readFileSync(f, "utf8");
  const sl = (await import(pathToFileURL(f).href)).default;
  const besedila = Object.entries(sl).filter(([k, v]) => typeof v === "string" && UI_VNOS(k) === vnos).map(([k, v]) => ({ besedilo: v, polje: k }));
  yield { mesto: rel(f), izvor, besedila, poKljucu: true };
}

export const VIRI = { lekcije: virLekcije, formule: virFormule, gradiva: virGradiva, pole: virPole, vaje: virVaje, slovar: virSlovar, ui: virUi };

// Ključ zadetka za izhodišče (test/fiksno/mat-zapis-izhodisce.json): brez številke vrstice (ta se premika ob vsakem
// urejanju), z ozkim odlomkom (12 znakov na vsako stran), pri vajah števila zamenjana z #, ker so naključna.
const kljucZadetka = (vir, mesto, polje, z, stevila) => {
  const n = (x) => (stevila ? x.replace(/\d+(?:[.,]\d+)?/g, "#") : x).replace(/\s+/g, " ").trim();
  return `${vir} | ${mesto.replace(/:\d+$/, "")}${polje ? ` | ${polje.replace(/\[\d+\]/g, "[]")}` : ""} | ${z.vrsta} | ${n(z.vrsta === "napaka" ? z.ujemanje.slice(0, 80) : z.jedro)}`;
};

// popis({ viri, lekcije, vnos }) → { viri: { ime: { besedil, enot, zadetkov, vrste } }, zadetki: [...], kljuci: [...] }
export async function popis({ viri = Object.keys(VIRI), lekcije = null, vnos = false } = {}) {
  const izid = { viri: {}, zadetki: [] };
  for (const ime of viri) {
    const st = (izid.viri[ime] = { enot: 0, besedil: 0, zadetkov: 0, vrste: Object.fromEntries(VRSTE.map((v) => [v, 0])) });
    const vir = ime === "lekcije" ? VIRI.lekcije(lekcije) : ime === "ui" ? VIRI.ui(vnos) : VIRI[ime]();
    for await (const enota of vir) {
      st.enot++;
      const videni = new Set();
      for (const { besedilo, polje, nacin } of enota.besedila) {
        st.besedil++;
        for (const z of pregledaj(besedilo, nacin, { strogo: ime !== "ui" })) {
          const kljuc = kljucZadetka(ime, enota.mesto, enota.poKljucu || enota.json || enota.stevila || enota.slovar ? `${enota.slovar ? `${enota.slovar}.` : ""}${polje}` : null, z, enota.stevila);
          if (videni.has(kljuc)) continue; // isti zapis v več semenih ali dvakrat v istem besedilu
          videni.add(kljuc);
          let mesto = enota.mesto;
          if (enota.poKljucu) {
            const i = enota.izvor.split("\n").findIndex((v) => v.includes(`"${polje}"`));
            if (i >= 0) mesto += `:${i + 1}`;
          } else if (enota.izvor) {
            const v = vrsticaV(enota.izvor, z, enota.json);
            if (v) mesto += `:${v}`;
          }
          st.zadetkov++;
          st.vrste[z.vrsta]++;
          izid.zadetki.push({ vir: ime, mesto, polje: polje || null, vrsta: z.vrsta, odlomek: z.odlomek, kljuc });
        }
      }
    }
  }
  izid.kljuci = [...new Set(izid.zadetki.map((z) => z.kljuc))].sort();
  return izid;
}

// Izhodišče (ratchet): znani zadetki, ki jih vsebina še ima (popravke vsebine pregledajo ločeni pregledovalci, zato jih
// ne popravljamo na slepo). Test pade ob vsakem NOVEM zadetku in ob zadetku, ki je izginil, a je še na seznamu.
// Seznam se samo krči: --odstrani-popravljene izbriše popravljene ključe, novih nikoli ne doda.
export const IZHODISCE = path.join(ROOT, "test/fiksno/mat-zapis-izhodisce.json");
export const preberiIzhodisce = () => JSON.parse(fs.readFileSync(IZHODISCE, "utf8"));
export function primerjaj(izid, kljuci = preberiIzhodisce().kljuci) {
  const znani = new Set(kljuci);
  const zdaj = new Set(izid.kljuci);
  return { novi: izid.zadetki.filter((z) => !znani.has(z.kljuc)), popravljeni: kljuci.filter((k) => !zdaj.has(k)) };
}

// ---- ukazna vrstica ----
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  const vrednost = (k) => (args.includes(k) ? args[args.indexOf(k) + 1] : null);
  const VZORCI = Number(vrednost("--vzorci")) || 3;
  const poti = args.filter((a, i) => !a.startsWith("--") && !["--vzorci", "--vir"].includes(args[i - 1]));
  const viri = poti.length ? ["lekcije"] : vrednost("--vir")?.split(",") || Object.keys(VIRI);
  const izid = await popis({ viri, lekcije: poti.length ? poti : null, vnos: args.includes("--vnos") });
  if (args.includes("--odstrani-popravljene")) {
    const izh = preberiIzhodisce();
    // Samo ključi virov (in lekcij), ki jih je ta zagon pregledal: »--vir lekcije --odstrani-popravljene« ne sme
    // izbrisati ključev drugih virov.
    const pregledan = (k) => {
      const [vir, mesto] = k.split(" | ");
      return viri.includes(vir) && (!poti.length || poti.some((p) => rel(p) === mesto));
    };
    const { popravljeni } = primerjaj(izid, izh.kljuci.filter(pregledan));
    izh.kljuci = izh.kljuci.filter((k) => !popravljeni.includes(k));
    fs.writeFileSync(IZHODISCE, `${JSON.stringify(izh, null, 1)}\n`);
    console.log(`Iz izhodišča odstranjenih ${popravljeni.length} popravljenih zadetkov, ostane ${izh.kljuci.length}.`);
  } else if (args.includes("--json")) {
    console.log(JSON.stringify(izid, null, 1));
  } else {
    for (const [ime, s] of Object.entries(izid.viri))
      console.log(`${ime.padEnd(8)} enot ${String(s.enot).padStart(4)} · besedil ${String(s.besedil).padStart(6)} · zadetkov ${s.zadetkov}${s.zadetkov ? ` (${Object.entries(s.vrste).filter(([, v]) => v).map(([k, v]) => `${k} ${v}`).join(", ")})` : ""}`);
    const poMestu = new Map();
    for (const z of izid.zadetki) {
      const k = `${z.vir}: ${z.mesto.replace(/:\d+$/, "")}`;
      if (!poMestu.has(k)) poMestu.set(k, []);
      poMestu.get(k).push(z);
    }
    for (const [k, zz] of [...poMestu].sort((a, b) => b[1].length - a[1].length)) {
      console.log(`\n${k} (${zz.length})`);
      for (const z of zz.slice(0, VZORCI)) console.log(`  ${z.mesto}${z.polje ? ` [${z.polje}]` : ""} ${z.vrsta}: ${z.odlomek}`);
    }
    console.log(`\nSkupaj zadetkov: ${izid.zadetki.length}`);
  }
}

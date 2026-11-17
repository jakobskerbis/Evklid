// p in q v premiku grafa (j, 16. 11. 2026, posnetek s telefona): inštruktor, 4. letnik, »Razloži mi logaritemsko
// funkcijo«, razdelek »Premiki grafa«: v $f(x) = \log_a(x - p) + q$ je tap na q odprl »ordinata temena T(p, q)«,
// »q = −D/4a«. Teme T(p, q) je le pri (x − p)² (temenska oblika parabole); drugje sta p in q premika grafa.
// Kjer pomena ne vemo zanesljivo, črka ni klikljiva (docs/pomen-crk.md).
import { test } from "node:test";
import assert from "node:assert/strict";
import katex from "katex";
import { Marked } from "marked";
import { createRenderer } from "../public/rich.js";
import { annotateTex, withFormulaSubject } from "../public/formula-data.js";
import { cardFor, configureCard } from "../public/formula-card.js";
import SL from "../public/i18n/sl.js";

let lang = "sl";
configureCard({ katex, lang: () => lang, t: (k, v = {}) => String(SL[k] || k).replace(/\{(\w+)\}/g, (_, n) => v[n] ?? "") });
const fx = createRenderer({ marked: new Marked(), katex, sanitize: (h) => h, annotate: (tex, o) => annotateTex(tex, undefined, o) });
const codes = (html) => [...html.matchAll(/data-fx="([^"]+)"/g)].map((m) => decodeURIComponent(m[1].replace(/\./g, "%")));
const card = (subject, topic, text, key) => {
  const html = withFormulaSubject(subject, () => fx.renderRich(text), null, topic);
  const c = codes(html).find((x) => x.split(":")[2] === key);
  return c ? cardFor(c) : null;
};
const label = (...a) => card(...a)?.label?.replace(/<[^>]+>/g, "") ?? null;
const VERTEX = /teme|vertex|-\\frac\{[bD]\}|D\/4a|b\/2a/i;

// Razdelek »Premiki grafa« iz odgovora inštruktorja (klepet nima teme, predmet MAT).
const PREMIKI = "### Premiki grafa\n\nGraf funkcije $f(x) = \\log_a(x - p) + q$ dobimo iz grafa $y = \\log_a x$ s premikom.";

test("logaritem v klepetu: p in q sta premika, nikoli teme", () => {
  for (const topic of ["", "Logaritemska funkcija"]) {
    const p = card("MAT", topic, PREMIKI, "p");
    const q = card("MAT", topic, PREMIKI, "q");
    assert.ok(p && q, `p in q sta klikljiva (tema »${topic}«)`);
    assert.doesNotMatch(p.html, VERTEX);
    assert.doesNotMatch(q.html, VERTEX);
    assert.match(p.label, /vodoravni premik grafa/);
    assert.match(q.label, /navpični premik grafa/);
    assert.match(p.html, /asimptota/);
    assert.doesNotMatch(p.html, /Nima enote/);
  }
});

test("premiki drugih funkcij: eksponentna, korenska, racionalna, kotna, absolutna, f(x − p)", () => {
  const cases = [
    "$y = 2^{x - p} + q$",
    "$y = a^{x - p} + q$",
    "$y = e^{x - p} + q$",
    "$y = \\sqrt{x - p} + q$",
    "$y = \\frac{1}{x - p} + q$",
    "$y = \\frac{k}{x - p} + q$",
    "$y = \\sin(x - p) + q$",
    "$y = a\\sin(b(x - p)) + q$",
    "$y = \\cos(x - p) + q$",
    "$y = |x - p| + q$",
    "$g(x) = f(x - p) + q$",
    "$y = \\ln(x - p) + q$",
    "$y = \\log_2 (x - p) + q$",
  ];
  for (const f of cases) {
    assert.match(label("MAT", "", f, "p") || "", /vodoravni premik/, `p v ${f}`);
    assert.match(label("MAT", "", f, "q") || "", /navpični premik/, `q v ${f}`);
  }
  // Samo navpični premik (brez p): log_a x + q, a^x + q, √x + q.
  for (const f of ["$y = \\log_a x + q$", "$y = 2^x + q$", "$y = \\sqrt{x} + q$", "$y = \\frac{1}{x} + q$"])
    assert.match(label("MAT", "", f, "q") || "", /navpični premik/, `q v ${f}`);
  // Eksponentna in racionalna: vodoravna asimptota y = q.
  assert.match(card("MAT", "", "$y = 2^{x - p} + q$", "q").html, /asimptota/);
  assert.match(label("MAT", "", "$y = \\log_{a}{(x - p)} + q$", "p") || "", /vodoravni premik/);
});

test("temenska oblika parabole: p in q ostaneta koordinati temena", () => {
  for (const topic of ["", "Kvadratna funkcija", "Premiki grafa"]) {
    for (const f of ["$y = a(x - p)^2 + q$", "$f(x) = 2(x - p)^{2} + q$", "$y = a\\left(x - p\\right)^2 + q$"]) {
      assert.match(label("MAT", topic, `Temenska oblika ${f}.`, "p") || "", /abscisa temena/, `${f} · ${topic}`);
      assert.match(label("MAT", topic, `Temenska oblika ${f}.`, "q") || "", /ordinata temena/, `${f} · ${topic}`);
    }
  }
  // Tema kvadratna funkcija, teme T(p, q) samo zase.
  assert.match(label("MAT", "Kvadratna funkcija", "Teme parabole je $T(p, q)$.", "q") || "", /ordinata temena/);
  // Krožnica: središče.
  assert.match(label("MAT", "", "$(x - p)^2 + (y - q)^2 = r^2$", "q") || "", /središča/);
});

test("neznan ali dvoumen kontekst: brez napačnega okna", () => {
  // Brez formule, ki pove pomen: p in q nista klikljiva (ne teme ne premik).
  for (const t of ["Naj bosta $p$ in $q$ realni števili.", "Velja $p + q = 1$.", "$q = 1 - p$", "$a_n = a_1 q^{n-1}$", "$p^k q^{n-k}$"]) {
    for (const k of ["p", "q"]) assert.equal(label("MAT", "", t, k), null, `${k} v »${t}«`);
  }
  // Tema o logaritmih: teme po temi ne velja.
  assert.equal(label("MAT", "Logaritemska funkcija", "Teme je $T(p, q)$.", "q"), null);
  // Premik kvadrata v ulomku 1/(x − p)² ni teme.
  assert.doesNotMatch(label("MAT", "", "$y = \\frac{1}{(x - p)^2} + q$", "p") || "", /teme/);
});

test("drugi jeziki: angleški pomen premika, ne teme", () => {
  lang = "de";
  try {
    const q = card("MAT", "", PREMIKI, "q");
    assert.match(q.label, /vertical shift/);
    assert.doesNotMatch(q.html, /vertex/i);
    assert.match(card("MAT", "", PREMIKI, "p").html, /vertical asymptote/);
  } finally {
    lang = "sl";
  }
});

// Pregled slovarja (16. 11. 2026): privzeti pomen fizike in kemije ne sme veljati, kjer ima črka drug pomen.
test("fizika in kemija: brez privzetega pomena, ki bi bil tu napačen", () => {
  const none = [
    ["FIZ", "Notranja energija", "Prvi zakon: $\\Delta U = Q + A$.", "U"],
    ["FIZ", "Plinski zakoni", "Velja $p V = n R T$.", "R"],
    ["FIZ", "Gravitacija", "Polmer Zemlje je $R = 6370\\,\\mathrm{km}$.", "R"],
    ["FIZ", "Jakost zvoka", "Jakost zvoka je $I = \\frac{P}{S}$.", "I"],
    ["FIZ", "Električno polje", "Jakost polja je $E = \\frac{F}{e}$.", "E"],
    ["FIZ", "", "Sila na naboj je $F = e E$.", "E"],
    ["FIZ", "Kondenzator", "Naboj je $Q = C U$.", "Q"],
    ["FIZ", "Toplota", "Toplotna kapaciteta $C = \\frac{Q}{\\Delta T}$.", "C"],
    ["FIZ", "Radioaktivni razpad", "Velja $N = N_0 e^{-\\lambda t}$.", "λ"],
    ["FIZ", "Fotoefekt in foton", "Vrednost $h$ vzamemo iz tabele.", "h"],
    ["KEM", "Termokemija", "Toplota $Q = m c \\Delta T$.", "c"],
  ];
  for (const [s, t, x, k] of none) assert.equal(label(s, t, x, k), null, `${k} v »${x}« (${t})`);
  // Pravi pomeni ostanejo.
  assert.match(label("FIZ", "Fotoefekt in foton", "Energija fotona je $E = \\frac{h c}{\\lambda}$.", "h") || "", /Planck/);
  assert.match(label("FIZ", "Fotoefekt in foton", "Energija fotona je $E = h c / \\lambda$.", "h") || "", /Planck/);
  assert.match(label("FIZ", "Ohmov zakon", "Velja $U = R I$.", "R") || "", /upor/);
  assert.match(label("FIZ", "Ohmov zakon", "Velja $U = R I$.", "U") || "", /napetost/);
  assert.match(label("FIZ", "Valovanje", "Velja $c = \\lambda \\nu$.", "λ") || "", /valovna/);
  assert.match(label("FIZ", "Kondenzator", "Kapaciteta $C = \\frac{e}{U}$.", "C") || "", /kapaciteta/);
  assert.match(label("KEM", "Raztopine", "Velja $c = \\frac{n}{V}$.", "c") || "", /koncentracija/);
  assert.match(label("FIZ", "Gibanje", "Telo pade z višine $h = 5\\,\\mathrm{m}$.", "h") || "", /višina/);
});

// Pregled PR 785 (17. 11. 2026): napake ločeno pregledovalcev.
test("pregled 785, 1: − q ni navzgor (brez okna)", () => {
  // 1. − q ni »premakne za q navzgor«: brez okna.
  for (const f of ["$y = \\log_a x - q$", "$y = 2^x - q$", "$y = \\frac{1}{x} - q$", "$y = \\log_a(x - p) - q$"]) assert.equal(label("MAT", "", f, "q"), null, f);
});

test("pregled 785, 2: asimptota y = q le pri členu brez x v števcu in samo + q", () => {
  // 2. (2x + 1)/(x − p) + q in 2^x + 3 − q, 2^x + 3 + q: ni vodoravne asimptote y = q (raje nič).
  for (const f of ["$y = \\frac{2x + 1}{x - p} + q$", "$y = 2^x + 3 - q$", "$y = 2^x + 3 + q$"]) assert.equal(label("MAT", "", f, "q"), null, f);
  assert.equal(label("MAT", "", "$y = \\frac{2x + 1}{x - p} + q$", "p"), null);
  assert.match(card("MAT", "", "$y = \\dfrac{3}{x - p} + q$", "q").html, /Vodoravna asimptota/);
  assert.match(card("MAT", "", "$y = \\dfrac{3}{x - p} + q$", "p").html, /Navpična asimptota/);
});

test("pregled 785, 3: krožnica: p, q v vektorju nista premik", () => {
  // 3. Krožnica (MAT-SS-3/kroznica.md): p v vektorju ni premik grafa.
  const kr = "Za točko $T(x, y)$ na krožnici je vektor $\\overrightarrow{ST} = (x - p, y - q)$, torej $\\sqrt{(x - p)^2 + (y - q)^2} = r$.";
  assert.doesNotMatch(label("MAT", "Krožnica", kr, "p") || "", /premik/);
  assert.doesNotMatch(label("MAT", "Krožnica", kr, "q") || "", /premik/);
});

test("pregled 785, 4: asimptota iz druge formule iste povedi ne velja", () => {
  // 4. Druga formula iste povedi ne prinese asimptote log ali ulomka.
  const pr = "Primerjaj $y = \\sqrt{x - p} + q$ in $y = \\log_a(x - p) + q$.";
  const html = withFormulaSubject("MAT", () => fx.renderRich(pr), null, "");
  const sqrtP = codes(html).filter((c) => c.split(":")[2] === "p").map(cardFor);
  assert.equal(sqrtP.length, 2);
  assert.doesNotMatch(sqrtP[0].html, /asimptota/, "p v √: brez asimptote");
  assert.match(sqrtP[1].html, /Navpična asimptota/, "p v log: asimptota");
});

test("pregled 785, 5: diferenčni kvocient, izrek o ostanku, perioda, x = √p + q: brez okna", () => {
  // 5. Lažni zadetki: diferenčni kvocient, izrek o ostanku, perioda, x = √p + q.
  for (const [f, k] of [["$\\frac{f(x) - f(p)}{x - p}$", "p"], ["$\\frac{P(x)}{x - p} + q$", "p"], ["$\\frac{P(x)}{x - p} + q$", "q"], ["$f(x - p) = f(x)$", "p"], ["$x = \\sqrt{p} + q$", "q"], ["$\\lim_{x \\to p} \\frac{f(x) - f(p)}{x - p}$", "p"]])
    assert.equal(label("MAT", "", f, k), null, `${k} v ${f}`);
});

test("pregled 785, 6: potenčna funkcija (x − p)ⁿ + q: premik", () => {
  // 6. Potenčna funkcija (x − p)ⁿ + q: premik, ne teme, brez asimptote.
  for (const f of ["$y = (x - p)^n + q$", "$y = a(x - p)^3 + q$", "$y = a \\cdot (x - p)^{3} + q$"]) {
    const p = card("MAT", "Potenčna in korenska funkcija", f, "p");
    const q = card("MAT", "Potenčna in korenska funkcija", f, "q");
    assert.match(p?.label || "", /vodoravni premik/, f);
    assert.match(q?.label || "", /navpični premik/, f);
    assert.doesNotMatch(p.html + q.html, /asimptota|teme/, f);
  }
});

test("pregled 785, 7: fizikalne izključitve niso preširoke", () => {
  // Plinska razelektritev, ozemljitev, sončna celica, plin v cevi: R in U ostaneta.
  assert.match(label("FIZ", "Električni tok in vezja", "Cev, napolnjena s plinom, ima upor $R = 50\\,\\Omega$.", "R") || "", /upor/);
  assert.match(label("FIZ", "Električni tok in vezja", "Pri plinski razelektritvi je $U = R I$.", "R") || "", /upor/);
  assert.match(label("FIZ", "Električni tok", "Ohišje je ozemljeno; upor ozemljitve je $R = 2\\,\\Omega$.", "R") || "", /upor/);
  assert.match(label("FIZ", "Sončna celica", "Sončna celica ima notranji upor $R$.", "R") || "", /upor/);
  assert.match(label("FIZ", "Električno delo", "Grelnik pretvarja električno delo v notranjo energijo: $A = U I t$.", "U") || "", /napetost/);
  // Plin, Zemlja, termodinamika brez električnega konteksta: še vedno nič.
  assert.equal(label("FIZ", "Idealni plin", "Velja enačba stanja idealnega plina.", "R"), null);
  assert.equal(label("FIZ", "Gravitacija", "Polmer Zemlje je $R = 6370\\,\\mathrm{km}$.", "R"), null);
  assert.equal(label("FIZ", "Termodinamika", "Notranja energija je $U = \\frac{3}{2} n R T$.", "U"), null);
});

// Pregled 785, krog 2 (17. 11. 2026): izjema za električni kontekst je bila preširoka.
test("pregled 785-2, 1: »Uporabi«, upor zraka, površinska napetost, jakost I ne vrnejo napačnega pomena", () => {
  const none = [
    ["FIZ", "Gravitacijski zakon", "Uporabi $G M_Z = 3{,}98 \\cdot 10^{14}\\,\\mathrm{m^3/s^2}$ in $R = 6370\\,\\mathrm{km}$.", "R"],
    ["FIZ", "Idealni plin in kinetična teorija", "Z $R = 8{,}314\\,\\mathrm{J/(mol\\,K)}$ uporabljaj $\\mathrm{Pa}$ in $\\mathrm{m^3}$ pri enačbi stanja idealnega plina.", "R"],
    ["FIZ", "Prevod toplote", "Uporabi toplotni upor $R = \\frac{d}{\\lambda S}$ za steno.", "R"],
    ["FIZ", "Termodinamika", "Uporabi $\\Delta U = Q + A$ in $U = \\frac{3}{2} n R T$.", "U"],
    ["FIZ", "Gibanje", "Upor zraka zanemarimo, polmer Zemlje je $R = 6370\\,\\mathrm{km}$.", "R"],
    ["FIZ", "Površinska napetost", "Kapljica s polmerom $R$ zaradi površinske napetosti ohrani obliko.", "R"],
    ["FIZ", "Mehanske lastnosti materialov", "Mehanska napetost je $\\sigma = F/S$; palica ima polmer $R$.", "R"],
    ["FIZ", "Sevanje", "Na razdalji $R$ od Sonca je $I = \\frac{P}{4\\pi R^2}$.", "R"],
    ["FIZ", "Sevanje", "Na razdalji $R$ od Sonca je $I = \\frac{P}{4\\pi R^2}$.", "I"],
  ];
  for (const [s, t, x, k] of none) assert.equal(label(s, t, x, k), null, `${k} v »${x}«`);
  // Pravi električni kontekst ostane.
  assert.match(label("FIZ", "Električni tok in vezja", "Upornik ima upor $R = 50\\,\\Omega$.", "R") || "", /upor/);
  assert.match(label("FIZ", "Električno delo", "Grelnik pretvarja električno delo v notranjo energijo: $A = U I t$.", "U") || "", /napetost/);
  assert.match(label("FIZ", "Termodinamika", "Napetost vira je $U = 12\\,\\mathrm{V}$.", "U") || "", /napetost/);
});

test("pregled 785-2, 2: x^x + q brez asimptote; člen, pomnožen z x, ni premik", () => {
  assert.doesNotMatch(card("MAT", "", "$y = x^{x} + q$", "q")?.html || "", /asimptota/);
  for (const f of ["$y = \\sqrt{x - p} \\cdot x + q$", "$y = \\frac{1}{x - p} \\cdot x + q$", "$y = x \\log_a(x - p)$"]) {
    assert.equal(label("MAT", "", f, "p"), null, f);
  }
});

// Pregled 785, krog 3: izjema I = P/… le za jakost (P/S, P/(4πr²)); I = P/U ostane tok. Mehanska napetost ni R.
test("pregled 785-3, 1: I = P/U je tok, I = P/(4πr²) in P/S nista", () => {
  for (const x of ["Tok dobiš iz moči: $I = \\frac{P}{U}$", "$P = \\dfrac{W}{t}$, $I = \\dfrac{P}{U}$", "Tok je $I = \\dfrac{P}{U\\cos\\varphi}$.", "Tok je $I = P/(U\\cos\\varphi)$."]) {
    assert.match(label("FIZ", "Električna energija in moč", x, "I") || "", /tok/, x);
  }
  for (const x of ["Svetloba: $I = \\frac{P}{4\\pi r^2}$", "Na zaslon pade $I = \\frac{P}{S}$.", "Žarek: $I = P/S$", "Laser: $I = \\dfrac{P}{\\pi d^2/4}$"]) {
    assert.equal(label("FIZ", "Valovanje", x, "I"), null, x);
  }
});

test("pregled 785-3, 2: napetost vrvi, meja tečenja, trdnost in R_e, R_m, R_p0,2 niso električni upor", () => {
  const none = [
    "Napetost vrvi je $F = 200\\,\\mathrm{N}$, kolo ima polmer $R$.",
    "Napetost v vrvi je enaka teži, škripec ima $R = 0{,}1\\,\\mathrm{m}$.",
    "Meja tečenja jekla je $R = 235\\,\\mathrm{MPa}$.",
    "Natezna trdnost je $R = 400\\,\\mathrm{MPa}$.",
    "Velja $\\sigma \\le R_e$.",
    "Velja $\\sigma \\le R_{m}$.",
    "Velja $\\sigma \\le R_{p0,2}$.",
  ];
  for (const x of none) assert.equal(label("FIZ", "Trdnost materialov", x, "R"), null, x);
  assert.match(label("FIZ", "Električni tok in vezja", "Upornik ima upor $R = 50\\,\\Omega$.", "R") || "", /upor/);
});

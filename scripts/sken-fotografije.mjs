// Slike za meritev skenerja (točka 27 načrta izboljšav, j 19. 11. 2026): naloge iz test/fixtures/sken/naloge.json kot
// fotografije s telefona. Pravih fotografij še nimamo, zato vsako nalogo izriše Chromium (Playwright) kot tiskan delovni
// list ali rokopis v zvezku (KaTeX, pisave rokopisa), nato jo »fotografira«: list na mizi v perspektivi, neenakomerna
// svetloba ali senca telefona, rahla zamegljenost, šum tipala in stiskanje JPEG (≤ ~145 KB na sliko).
// Na slikah ni ljudi, obrazov ne izdelkov učencev; »učenčev postopek« na nekaterih slikah je napisal Claude (Opus).
//
//   node scripts/sken-fotografije.mjs                  # vse slike v test/fixtures/sken/ na novo
//   node scripts/sken-fotografije.mjs --samo s01-kvadratna,f03-vezje
//   node scripts/sken-fotografije.mjs --mapa <mapa s pravimi fotografijami> [--izhod <mapa>]
//
// Prave fotografije (j jih doda pozneje): mapa z naloge.json v isti obliki (scripts/sken-ocena.mjs) in slikami. Skripta
// jih pripravi tako, kot jih pošlje aplikacija (public/scan/scan.js cropTo: zasuk po EXIF, daljša stranica največ 1600 px,
// JPEG 0,88; brez metapodatkov EXIF, tudi brez lokacije GPS) v <mapa>/pripravljene/ (ali --izhod) z novim naloge.json.
// Meritev: node scripts/meri-skener.mjs --mapa <mapa>/pripravljene. V javni repozitorij nikoli fotografij z ljudmi ali
// izdelki učencev (le lastne naloge).
//
// Pisave rokopisa (Caveat, Kalam, Patrick Hand; SIL OFL) prenese s cdn.jsdelivr.net v začasno mapo (preverjen SHA-256);
// brez omrežja rokopis nariše s poševno sistemsko pisavo. Naključnost je določena z id slike: isti vhod da isto sliko.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import { pathToFileURL, fileURLToPath } from "node:url";
import { naloziNabor, PRIVZETA_MAPA } from "./sken-ocena.mjs";

const require = createRequire(import.meta.url);
const arg = (name, d) => {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : d;
};
const ZNANI = { "--mapa": 1, "--izhod": 1, "--samo": 1 };
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (!(a in ZNANI) || (ZNANI[a] && process.argv[i + 1] === undefined)) {
    console.error(`Neznan ali nepopoln argument »${a}« (dovoljeni: ${Object.keys(ZNANI).join(", ")}).`);
    process.exit(1);
  }
  i += ZNANI[a];
}
const SAMO = arg("--samo") ? new Set(arg("--samo").split(",")) : null;
const NAJVEC_BAJTOV = 145_000;

// ---------- naključnost, določena z id ----------
function rng(seme) {
  let a = crypto.createHash("sha256").update(seme).digest().readUInt32LE(0);
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- pisave rokopisa ----------
const PISAVE = {
  caveat: { ime: "Caveat", velikost: 40, datoteke: { latin: "d0b7b931b8980049327e8f8f9ac264617c8200b8422d62e886473d3d9527bad3", "latin-ext": "b887f256176087e22d2374d634ba7d1e9def523bc02babe2eca3efa25b32ecd7" } },
  kalam: { ime: "Kalam", velikost: 29, datoteke: { latin: "954410601a823f37e219f7930b7446f86afa15621326a7078d56fb9c910135cb", "latin-ext": "1099e56781c48f97dc66c8df2039a640ded07742acd4c6f2c9dc6350c3e3f324" } },
  patrick: { ime: "Patrick Hand", velikost: 33, datoteke: { latin: "ac5bc9033b2572bf84d39f7150c1634e37ed16e8dbee632d6d0bceac0bbf0199", "latin-ext": "c16846bad9501534b8402172c18f87e927146c4e63af2942f1fa8ad8ba7e6e70" } },
};
const RAZPONI = {
  latin: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
  "latin-ext": "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF",
};
const PREDPOMNILNIK = path.join(os.tmpdir(), "evklid-sken-pisave");
async function pisava(kljuc) {
  const p = PISAVE[kljuc];
  const pakiran = { caveat: "caveat", kalam: "kalam", patrick: "patrick-hand" }[kljuc];
  const css = [];
  for (const [podnabor, sha] of Object.entries(p.datoteke)) {
    const ime = `${pakiran}-${podnabor}-400-normal.woff2`;
    const pot = path.join(PREDPOMNILNIK, ime);
    const ok = () => fs.existsSync(pot) && crypto.createHash("sha256").update(fs.readFileSync(pot)).digest("hex") === sha;
    if (!ok()) {
      try {
        const r = await fetch(`https://cdn.jsdelivr.net/npm/@fontsource/${pakiran}@5.2.8/files/${ime}`);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        fs.mkdirSync(PREDPOMNILNIK, { recursive: true });
        fs.writeFileSync(pot, Buffer.from(await r.arrayBuffer()));
      } catch (e) {
        console.warn(`Pisave ${p.ime} ni bilo mogoče prenesti (${e.message}); rokopis bo s sistemsko pisavo.`);
        return { css: "", druzina: "'FreeSans', sans-serif", velikost: 30, posevno: true };
      }
      if (!ok()) throw new Error(`${ime}: SHA-256 se ne ujema (pisava na CDN se je spremenila?).`);
    }
    css.push(`@font-face{font-family:'Roka ${p.ime}';src:url(${pathToFileURL(pot).href}) format('woff2');unicode-range:${RAZPONI[podnabor]}}`);
  }
  return { css: css.join("\n"), druzina: `'Roka ${p.ime}', 'FreeSans', sans-serif`, velikost: p.velikost, posevno: false };
}

// ---------- videz posamezne slike ----------
// papir: bel (tiskan list) | karo | crte;  pisava: tisk | roka (caveat, kalam, patrick);  glava: vrstica na vrhu lista
// stevilke: številke nalog na listu (glavna naloga + ostale v vrstnem redu postavitve: red)
// delo: učenčev postopek z roko (LaTeX vrstice); precrtano: prečrtana vrstica; oznaka: krog | puscica (pri nalogi oznacena)
// slika: trikotnik | parabola | trapez | vezje;  scena: ozadje, nagib [rx, ry, rz] v stopinjah, merilo, premik, svetloba,
// senca (telefon | roka), zamegli (px), sum (0–1), pregib (prepognjen list)
const POSTAVITVE = {
  "s01-kvadratna": { papir: "bel", pisava: "tisk", glava: ["Matematika, 3. letnik", "Kvadratna funkcija in enačba"], stevilke: ["4."], tocke: "(2 točki)", scena: { ozadje: "les", nagib: [8, -3, -2], svetloba: "mehka", zamegli: 0.5, sum: 0.05 } },
  "s02-koren": { papir: "karo", pisava: "roka", roka: "caveat", barva: "#1f3f9a", glava: ["Domača naloga"], stevilke: ["2."], scena: { blizu: 1.45, ozadje: "siva", nagib: [12, 4, 3], svetloba: "stran", zamegli: 0.6, sum: 0.07 } },
  "s03-logaritem": { papir: "bel", pisava: "tisk", glava: ["Eksponentna in logaritemska funkcija", "Ponavljanje"], stevilke: ["7."], tocke: "(3 točke)", scena: { blizu: 1.3, ozadje: "les", nagib: [24, -6, 5], svetloba: "mehka", senca: "telefon", zamegli: 0.6, sum: 0.06 } },
  "s04-eksponentna": {
    papir: "bel",
    pisava: "tisk",
    glava: ["Eksponentne enačbe", "Vaje"],
    stevilke: ["3."],
    tocke: "(3 točke)",
    roka: "kalam",
    barva: "#22305e",
    delo: ["$2^x = t$", "$t^2 - 3t - 4 = 0$", "$(t - 4)(t + 1) = 0$", "$t_1 = 4,\\ t_2 = -1$"],
    scena: { blizu: 1.25, ozadje: "blago", nagib: [10, 5, -3], svetloba: "okno", zamegli: 0.5, sum: 0.06 },
  },
  "s05-neenacba": { papir: "crte", pisava: "roka", roka: "patrick", barva: "#1a2c80", glava: ["Neenačbe"], stevilke: ["a)"], scena: { blizu: 1.45, ozadje: "les", nagib: [6, -8, -4], svetloba: "topla", zamegli: 1.1, sum: 0.06 } },
  "s06-dve-nalogi": { papir: "bel", pisava: "tisk", glava: ["Matematika, 2. letnik", "Ponavljanje za test"], red: [1, 0], stevilke: ["5.", "6."], oznacena: 1, oznaka: "krog", roka: "caveat", barva: "#20398f", scena: { ozadje: "siva", nagib: [14, 2, 2], svetloba: "mehka", zamegli: 0.6, sum: 0.06 } },
  "s07-trikotnik": { papir: "bel", pisava: "tisk", glava: ["Kotne funkcije v pravokotnem trikotniku"], stevilke: ["2."], tocke: "(2 točki)", slika: "trikotnik", scena: { blizu: 1.15, ozadje: "les", nagib: [12, -4, -3], svetloba: "stran", zamegli: 0.5, sum: 0.06 } },
  "s08-parabola": { papir: "bel", pisava: "tisk", glava: ["Kvadratna funkcija"], stevilke: ["5."], tocke: "(3 točke)", slika: "parabola", scena: { blizu: 1.05, ozadje: "blago", nagib: [9, 3, 2], svetloba: "mehka", zamegli: 0.5, sum: 0.05, pregib: true } },
  "s09-odvod": { papir: "karo", pisava: "roka", roka: "kalam", barva: "#1b1b1b", glava: ["Odvod"], stevilke: ["3."], scena: { blizu: 1.45, ozadje: "siva", nagib: [10, -5, 2], svetloba: "stran", zamegli: 0.6, sum: 0.08 } },
  "s10-limita": { papir: "bel", pisava: "tisk", glava: ["Limita funkcije"], stevilke: ["6."], tocke: "(2 točki)", scena: { blizu: 1.3, ozadje: "les", nagib: [11, 4, -2], svetloba: "mrak", zamegli: 0.8, sum: 0.11 } },
  "s11-integral": { papir: "bel", pisava: "tisk", glava: ["Določeni integral"], stevilke: ["1."], tocke: "(2 točki)", scena: { blizu: 1.3, ozadje: "siva", nagib: [7, -2, 1], svetloba: "mehka", zamegli: 1.6, sum: 0.05 } },
  "s12-trigonometrija": { papir: "crte", pisava: "roka", roka: "caveat", barva: "#22307a", glava: ["Kotne funkcije"], stevilke: ["4."], scena: { blizu: 1.25, ozadje: "blago", nagib: [8, 3, -9], svetloba: "okno", zamegli: 0.6, sum: 0.07 } },
  "s13-zaporedje": { papir: "bel", pisava: "tisk", glava: ["Zaporedja", "Aritmetično zaporedje"], stevilke: ["3."], tocke: "(3 točke)", scena: { ozadje: "les", nagib: [6, 3, 90], merilo: 0.7, premik: [-60, -70], svetloba: "mehka", zamegli: 0.5, sum: 0.06 } },
  "s14-kompleksna": { papir: "karo", pisava: "roka", roka: "patrick", barva: "#14257a", glava: ["Kompleksna števila"], stevilke: ["1."], scena: { blizu: 1.3, ozadje: "siva", nagib: [13, 6, 4], svetloba: "hladna", zamegli: 0.7, sum: 0.13, kakovost: 50 } },
  "s15-odstotki": { papir: "bel", pisava: "tisk", glava: ["Odstotki in obresti"], stevilke: ["8."], tocke: "(3 točke)", scena: { ozadje: "blago", nagib: [10, -3, 3], svetloba: "mehka", senca: "roka", zamegli: 0.5, sum: 0.06 } },
  "s16-razstavi": {
    papir: "bel",
    pisava: "tisk",
    glava: ["Polinomi"],
    stevilke: ["2."],
    tocke: "(2 točki)",
    roka: "caveat",
    barva: "#1d3384",
    precrtano: "$x(x^2 - 2x - 9) + 18$",
    delo: ["$x^2(x - 2) - 9(x - 2)$", "$(x - 2)(x^2 - 9)$"],
    scena: { blizu: 1.25, ozadje: "les", nagib: [9, 5, -2], svetloba: "stran", zamegli: 0.6, sum: 0.06 },
  },
  "o01-ulomki": { papir: "karo", pisava: "roka", roka: "patrick", barva: "#203a9c", glava: ["Ulomki"], stevilke: ["5."], scena: { blizu: 1.45, ozadje: "les", nagib: [16, -4, 2], svetloba: "topla", zamegli: 0.6, sum: 0.06 } },
  "o02-tri-naloge": { papir: "bel", pisava: "tisk", glava: ["Matematika, 8. razred", "Utrjevanje"], red: [1, 0, 2], stevilke: ["1.", "2.", "3."], oznacena: 1, oznaka: "puscica", roka: "kalam", barva: "#1d2f8a", scena: { ozadje: "siva", nagib: [9, -3, -2], svetloba: "mehka", zamegli: 0.6, sum: 0.06 } },
  "o03-trapez": { papir: "bel", pisava: "tisk", glava: ["Ploščine likov"], stevilke: ["4."], slika: "trapez", scena: { blizu: 1.1, ozadje: "blago", nagib: [11, 4, 3], svetloba: "okno", zamegli: 0.5, sum: 0.06 } },
  "f01-pospesek": { papir: "bel", pisava: "tisk", glava: ["Fizika, 1. letnik", "Enakomerno pospešeno gibanje"], stevilke: ["3."], scena: { blizu: 1.05, ozadje: "siva", nagib: [10, 3, -2], svetloba: "hladna", zamegli: 0.6, sum: 0.07 } },
  "f02-grelnik": { papir: "crte", pisava: "roka", roka: "kalam", barva: "#1c2d78", glava: ["Toplota"], stevilke: ["2."], scena: { ozadje: "les", nagib: [9, -4, 2], svetloba: "stran", zamegli: 0.6, sum: 0.07 } },
  "f03-vezje": { papir: "bel", pisava: "tisk", glava: ["Električni tok", "Vezave upornikov"], stevilke: ["5."], tocke: "(2 točki)", slika: "vezje", scena: { blizu: 1.1, ozadje: "les", nagib: [12, -5, -3], svetloba: "mehka", senca: "telefon", zamegli: 0.5, sum: 0.06 } },
};

// ---------- HTML lista ----------
const katex = require("katex");
const KATEX_CSS = pathToFileURL(require.resolve("katex/dist/katex.min.css")).href;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
// Besedilo z LaTeX med $ … $ v HTML (KaTeX).
const vHtml = (s) =>
  String(s)
    .split(/(\$[^$]+\$)/)
    .map((d) => (d.startsWith("$") && d.endsWith("$") && d.length > 2 ? katex.renderToString(d.slice(1, -1), { throwOnError: true, output: "html" }) : esc(d)))
    .join("");

const SLIKE = {
  trikotnik: `<svg width="520" height="300" viewBox="0 0 520 300"><g fill="none" stroke="#111" stroke-width="2.4">
    <path d="M60 250 L420 250 L420 100 Z"/><path d="M398 250 L398 228 L420 228"/><path d="M118 250 A58 58 0 0 0 113.5 228"/></g>
    <g font-family="Liberation Serif" font-size="26" fill="#111"><text x="215" y="285">12 cm</text><text x="432" y="183">5 cm</text>
    <text x="126" y="242" font-style="italic">α</text><text x="36" y="270">A</text><text x="426" y="275">B</text><text x="426" y="95">C</text></g></svg>`,
  parabola: (() => {
    const u = 34;
    const ox = 3 * u + 20;
    const oy = 6 * u + 10;
    const X = (x) => ox + x * u;
    const Y = (y) => oy - y * u;
    let g = "";
    for (let x = -3; x <= 5; x++) g += `<line x1="${X(x)}" y1="${Y(5)}" x2="${X(x)}" y2="${Y(-5)}"/>`;
    for (let y = -5; y <= 5; y++) g += `<line x1="${X(-3)}" y1="${Y(y)}" x2="${X(5)}" y2="${Y(y)}"/>`;
    let pot = "";
    for (let x = -1.9; x <= 3.91; x += 0.05) pot += `${pot ? "L" : "M"}${X(x).toFixed(1)} ${Y((x - 1) ** 2 - 4).toFixed(1)} `;
    let st = "";
    for (const x of [-2, -1, 1, 2, 3, 4]) st += `<text x="${X(x) - 6}" y="${Y(0) + 24}">${x < 0 ? "−" + -x : x}</text>`;
    for (const y of [-4, -3, -2, -1, 1, 2, 3, 4]) st += `<text x="${X(0) - (y < 0 ? 30 : 20)}" y="${Y(y) + 7}">${y < 0 ? "−" + -y : y}</text>`;
    return `<svg width="${X(5) + 30}" height="${Y(-5) + 20}"><g stroke="#b9c3cf" stroke-width="1">${g}</g>
      <g stroke="#111" stroke-width="2"><line x1="${X(-3)}" y1="${Y(0)}" x2="${X(5) + 18}" y2="${Y(0)}"/><line x1="${X(0)}" y1="${Y(-5)}" x2="${X(0)}" y2="${Y(5) - 16}"/></g>
      <path d="${pot}" fill="none" stroke="#111" stroke-width="2.6"/>
      <g fill="#111"><circle cx="${X(1)}" cy="${Y(-4)}" r="4.5"/><circle cx="${X(-1)}" cy="${Y(0)}" r="4.5"/><circle cx="${X(3)}" cy="${Y(0)}" r="4.5"/></g>
      <g font-family="Liberation Serif" font-size="20" fill="#111">${st}<text x="${X(5) + 8}" y="${Y(0) - 8}" font-style="italic">x</text>
      <text x="${X(0) + 8}" y="${Y(5) - 2}" font-style="italic">y</text><text x="${X(1) + 10}" y="${Y(-4) + 6}" font-style="italic" font-size="24">T</text>
      <text x="${X(2.6)}" y="${Y(2.6)}" font-style="italic" font-size="24">f</text></g></svg>`;
  })(),
  trapez: `<svg width="560" height="270" viewBox="0 0 560 270"><g fill="none" stroke="#111" stroke-width="2.4"><path d="M60 220 L460 220 L380 60 L140 60 Z"/></g>
    <g stroke="#111" stroke-width="1.8" stroke-dasharray="7 6"><line x1="140" y1="60" x2="140" y2="220"/></g><path d="M140 204 L156 204 L156 220" fill="none" stroke="#111" stroke-width="1.6"/>
    <g font-family="Liberation Serif" font-size="25" fill="#111"><text x="205" y="256">a = 10 cm</text><text x="205" y="46">c = 6 cm</text><text x="152" y="150">v = 4 cm</text>
    <text x="34" y="236">A</text><text x="468" y="236">B</text><text x="386" y="52">C</text><text x="120" y="52">D</text></g></svg>`,
  vezje: `<svg width="640" height="320" viewBox="0 0 640 320"><g fill="none" stroke="#111" stroke-width="2.4">
    <path d="M80 60 L80 130 M80 190 L80 260 L460 260 L460 60 L80 60"/><path d="M58 130 L102 130"/><path d="M68 150 L92 150" stroke-width="5"/>
    <path d="M58 170 L102 170" stroke-width="2.4"/><path d="M68 190 L92 190" stroke-width="5"/>
    <path d="M260 60 L260 110 M260 210 L260 260"/><rect x="242" y="110" width="36" height="100" fill="#fff"/>
    <rect x="442" y="110" width="36" height="100" fill="#fff"/></g>
    <g fill="#111"><circle cx="260" cy="60" r="5"/><circle cx="260" cy="260" r="5"/></g>
    <g font-family="Liberation Serif" font-size="25" fill="#111"><text x="110" y="168">U = 6 V</text><text x="290" y="168"><tspan font-style="italic">R</tspan><tspan font-size="17" dy="6">1</tspan><tspan dy="-6"> = 4 Ω</tspan></text>
    <text x="492" y="168"><tspan font-style="italic">R</tspan><tspan font-size="17" dy="6">2</tspan><tspan dy="-6"> = 12 Ω</tspan></text></g></svg>`,
};

function listHtml(s, p, r, roka) {
  const tisk = p.pisava === "tisk";
  const vse = [s.besedilo, ...(s.ostale || []).map((o) => o.besedilo)];
  const red = p.red || vse.map((_, i) => i);
  const kot = () => ((r() - 0.5) * 1.6).toFixed(2);
  const naloge = red
    .map((i, k) => {
      const st = p.stevilke?.[k] || "";
      const glavna = i === 0;
      const oznaka = glavna && p.oznaka === "krog" ? `<span class="krog roka-znak"></span>` : glavna && p.oznaka === "puscica" ? `<span class="puscica roka-znak">⟶</span>` : "";
      const slika = glavna && p.slika ? `<div class="slika">${SLIKE[p.slika]}</div>` : "";
      return `<div class="naloga${tisk ? "" : " roka"}" style="${tisk ? "" : `transform:rotate(${kot()}deg)`}">${oznaka}<span class="st">${esc(st)}</span> <span class="bes">${vHtml(vse[i])}</span>${
        tisk && p.tocke && glavna ? ` <span class="tocke">${esc(p.tocke)}</span>` : ""
      }${slika}</div>${tisk ? `<div class="prostor" style="height:${vse.length > 1 ? 120 : 60}px"></div>` : ""}`;
    })
    .join("");
  const delo = (p.delo || []).map((d, i) => `<div class="delo roka" style="transform:translate(${Math.round(r() * 24)}px,0) rotate(${kot()}deg);margin-left:${i ? 0 : 20}px">${vHtml(d)}</div>`).join("");
  const precrtano = p.precrtano ? `<div class="delo roka precrtano" style="transform:rotate(${kot()}deg)">${vHtml(p.precrtano)}<span class="crta"></span></div>` : "";
  const glava = tisk
    ? `<div class="glava"><div><b>${esc(p.glava[0])}</b>${p.glava[1] ? `<br><span>${esc(p.glava[1])}</span>` : ""}</div><div class="ime">Ime in priimek: <span class="crta-ime"></span></div></div><p class="navodilo">Rešuj na list. Pri vsaki nalogi zapiši postopek.</p>`
    : `<div class="glava-roka roka" style="transform:rotate(${kot()}deg)">${esc(p.glava?.[0] || "")}<span class="datum">${esc(["12. 11.", "14. 11.", "18. 11."][Math.floor(r() * 3)])}</span></div>`;
  const papir = { bel: "bel", karo: "karo", crte: "crte" }[p.papir];
  const delSlike = p.delo?.length && !p.slika ? `<div class="delo-blok">${delo}</div>` : "";
  return `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="${KATEX_CSS}"><style>
${roka.css}
html,body{margin:0;background:#fff}
.list{width:840px;height:1188px;position:relative;overflow:hidden;box-sizing:border-box;padding:64px 70px;font-family:'Liberation Serif',serif;font-size:27px;line-height:1.5;color:#161616;background:#fbfbf8}
.karo{background-color:#f9f9f4;background-image:linear-gradient(rgba(80,130,190,.33) 1px,transparent 1px),linear-gradient(90deg,rgba(80,130,190,.33) 1px,transparent 1px);background-size:26px 26px;background-position:9px 13px}
.crte{background-color:#fbfaf3;background-image:linear-gradient(transparent 51px,rgba(80,130,190,.5) 52px);background-size:100% 52px;background-position:0 30px}
.crte::before{content:"";position:absolute;left:96px;top:0;bottom:0;border-left:2px solid rgba(220,80,80,.55)}
.glava{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #333;padding-bottom:10px;margin-bottom:14px;font-family:'Carlito','Liberation Sans',sans-serif;font-size:24px}
.glava span{font-size:21px;color:#333}.ime{font-size:20px;padding-top:6px}.crta-ime{display:inline-block;width:210px;border-bottom:1.5px solid #333}
.navodilo{font-family:'Carlito','Liberation Sans',sans-serif;font-style:italic;font-size:20px;color:#333;margin:0 0 26px}
.naloga{position:relative;margin:0 0 6px}.st{font-weight:bold}.tocke{font-family:'Carlito',sans-serif;font-size:20px;color:#444;white-space:nowrap}
.slika{margin:22px 0 0 30px}
.roka{font-family:${roka.druzina};font-size:${roka.velikost}px;color:${p.barva || "#1f3f9a"};line-height:1.6;filter:url(#tresi);${roka.posevno ? "font-style:italic;" : ""}}
.roka .katex,.roka .katex *{font-family:${roka.druzina} !important;font-style:normal !important}
.roka .katex{font-size:1em}
.roka .st{font-weight:normal}
.list.roka-list{padding:58px 70px 64px 118px}
.glava-roka{display:flex;justify-content:space-between;margin:0 0 30px;font-size:${Math.round(roka.velikost * 1.05)}px}
.glava-roka .datum{font-size:.8em}
.delo-blok{margin:6px 0 0 40px}.delo{margin:4px 0;width:max-content}
.precrtano{position:relative;margin-left:30px}.precrtano .crta{position:absolute;left:-8px;right:-8px;top:52%;border-top:3px solid ${p.barva || "#1f3f9a"};transform:rotate(-3deg)}
.krog{position:absolute;left:-22px;top:-4px;width:58px;height:50px;border:3px solid ${p.barva || "#1f3f9a"};border-radius:50%;transform:rotate(-12deg);filter:url(#tresi)}
.puscica{position:absolute;left:-62px;top:-6px;font-family:${roka.druzina};font-size:46px;color:${p.barva || "#1f3f9a"};filter:url(#tresi)}
</style></head><body>
<svg width="0" height="0" style="position:absolute"><filter id="tresi"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="${Math.floor(r() * 1000)}"/><feDisplacementMap in="SourceGraphic" scale="${tisk ? 2.2 : 3}"/></filter></svg>
<div class="list ${papir}${tisk ? "" : " roka-list"}">${glava}${naloge}${precrtano}${delSlike}</div></body></html>`;
}

// ---------- scena: list na mizi, fotografiran s telefonom ----------
const OZADJA = {
  les: "repeating-linear-gradient(92deg,#7a5634 0 7px,#80593a 7px 15px,#73502f 15px 22px,#7d5838 22px 34px),#7a5634",
  siva: "radial-gradient(circle at 30% 20%,#9a9a96,#6f706c)",
  blago: "repeating-linear-gradient(45deg,#2f3d52 0 3px,#34445b 3px 6px),#30405a",
};
const SVETLOBA = {
  mehka: "radial-gradient(ellipse at 40% 30%,rgba(255,255,255,0) 35%,rgba(0,0,0,.22) 100%)",
  stran: "linear-gradient(100deg,rgba(255,255,255,0) 25%,rgba(25,18,5,.42) 100%)",
  mrak: "radial-gradient(ellipse at 62% 38%,rgba(255,236,190,0) 5%,rgba(35,25,8,.62) 85%)",
  okno: "linear-gradient(200deg,rgba(255,255,255,0) 30%,rgba(10,15,30,.38) 100%)",
  topla: "radial-gradient(ellipse at 50% 20%,rgba(255,220,160,.05) 20%,rgba(70,40,0,.30) 100%)",
  hladna: "radial-gradient(ellipse at 50% 50%,rgba(200,215,255,.05) 30%,rgba(10,20,50,.30) 100%)",
};
const ODTENEK = { mrak: "rgba(255,200,110,.20)", topla: "rgba(255,215,150,.16)", hladna: "rgba(170,195,255,.18)", okno: "rgba(255,255,255,0)", mehka: "rgba(255,245,230,.06)", stran: "rgba(255,240,215,.08)" };
const SENCE = {
  telefon: "left:180px;bottom:-140px;width:520px;height:460px;border-radius:120px 120px 0 0;transform:rotate(-8deg)",
  roka: "right:-160px;top:420px;width:640px;height:300px;border-radius:50%;transform:rotate(-25deg)",
};
function scenaHtml(png, sc, r) {
  const [rx, ry, rz] = sc.nagib;
  // blizu: telefon bliže nalogi (list sega čez rob); točka lista (380, 330) pride na (450, 520) zaslona.
  const m = sc.merilo || sc.blizu || 0.97;
  const izvor = sc.blizu ? "380px 330px" : "50% 55%";
  const [dx, dy] = sc.premik || (sc.blizu ? [40, 184] : [0, 0]).map((v, i) => v + Math.round((r() - 0.5) * (i ? 40 : 30)));
  const sum = Math.max(0, Math.min(1, sc.sum ?? 0.06));
  return `<!doctype html><html><head><meta charset="utf-8"><style>
html,body{margin:0;width:900px;height:1200px;overflow:hidden;background:${OZADJA[sc.ozadje] || OZADJA.siva}}
.oder{position:absolute;inset:0;perspective:1500px;filter:blur(${sc.zamegli ?? 0.6}px) saturate(.92)}
.papir{position:absolute;left:30px;top:6px;width:840px;height:1188px;transform-origin:${izvor};
 transform:translate(${dx}px,${dy}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${m});box-shadow:0 18px 38px rgba(0,0,0,.45),0 2px 6px rgba(0,0,0,.35)}
.papir img{display:block;width:840px;height:1188px}
.pregib{position:absolute;inset:0;background:linear-gradient(${Math.round(80 + r() * 20)}deg,transparent 48.6%,rgba(0,0,0,.10) 49.6%,rgba(255,255,255,.35) 50.2%,transparent 51.2%)}
.svetloba{position:absolute;inset:0;background:${SVETLOBA[sc.svetloba] || SVETLOBA.mehka};mix-blend-mode:multiply}
.odtenek{position:absolute;inset:0;background:${ODTENEK[sc.svetloba] || "transparent"};mix-blend-mode:multiply}
.senca{position:absolute;background:rgba(20,15,10,.42);filter:blur(55px);mix-blend-mode:multiply;${SENCE[sc.senca] || "display:none"}}
canvas{position:absolute;inset:0;width:900px;height:1200px;mix-blend-mode:overlay;opacity:${sum * 4}}
</style></head><body>
<div class="oder"><div class="papir"><img src="${png}">${sc.pregib ? `<div class="pregib"></div>` : ""}</div><div class="svetloba"></div><div class="odtenek"></div><div class="senca"></div></div>
<canvas width="450" height="600"></canvas>
<script>
let a=${Math.floor(r() * 2 ** 31)};const rnd=()=>{a=(a+0x6d2b79f5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296};
const c=document.querySelector("canvas"),g=c.getContext("2d"),d=g.createImageData(450,600);
for(let i=0;i<d.data.length;i+=4){const v=128+(rnd()+rnd()+rnd()-1.5)*90;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255}
g.putImageData(d,0,0);
</script></body></html>`;
}

async function izdelaj(brskalnik, s, p, izhod, roka) {
  const r = rng(s.id);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-sken-"));
  try {
    const listPot = path.join(tmp, "list.html");
    fs.writeFileSync(listPot, listHtml(s, p, r, roka));
    const stran = await brskalnik.newPage({ viewport: { width: 840, height: 1188 }, deviceScaleFactor: 1 });
    await stran.goto(pathToFileURL(listPot).href);
    await stran.evaluate(() => document.fonts.ready);
    const png = (await stran.screenshot({ type: "png" })).toString("base64");
    await stran.close();
    const scena = await brskalnik.newPage({ viewport: { width: 900, height: 1200 }, deviceScaleFactor: 1 });
    await scena.setContent(scenaHtml(`data:image/png;base64,${png}`, p.scena, r));
    await scena.waitForFunction(() => document.querySelector(".papir img")?.complete);
    let q = p.scena.kakovost || 72;
    let jpg;
    for (;;) {
      jpg = await scena.screenshot({ type: "jpeg", quality: q });
      if (jpg.length <= NAJVEC_BAJTOV || q <= 30) break;
      q -= 4;
    }
    await scena.close();
    fs.writeFileSync(path.join(izhod, s.datoteka), jpg);
    return { bajtov: jpg.length, kakovost: q };
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

// Prave fotografije: kot jih pošlje aplikacija (zasuk po EXIF, ≤ 1600 px, JPEG 0,88, brez metapodatkov).
async function pripravi(brskalnik, nabor, izhod) {
  fs.mkdirSync(izhod, { recursive: true });
  const stran = await brskalnik.newPage();
  const slike = [];
  for (const s of nabor.slike) {
    if (SAMO && !SAMO.has(s.id)) continue;
    const vhod = fs.readFileSync(path.join(nabor.mapa, s.datoteka));
    const tip = /\.png$/i.test(s.datoteka) ? "image/png" : /\.webp$/i.test(s.datoteka) ? "image/webp" : "image/jpeg";
    const url = await stran.evaluate(
      async ({ b64, tip }) => {
        const blob = await (await fetch(`data:${tip};base64,${b64}`)).blob();
        const bmp = await createImageBitmap(blob, { imageOrientation: "from-image" });
        const k = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
        const c = document.createElement("canvas");
        c.width = Math.max(1, Math.round(bmp.width * k));
        c.height = Math.max(1, Math.round(bmp.height * k));
        c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
        return c.toDataURL("image/jpeg", 0.88);
      },
      { b64: vhod.toString("base64"), tip },
    );
    const datoteka = `${s.id}.jpg`;
    const jpg = Buffer.from(url.split(",")[1], "base64");
    fs.writeFileSync(path.join(izhod, datoteka), jpg);
    slike.push({ ...s, datoteka });
    console.log(`${s.id}: ${Math.round(vhod.length / 1024)} KB → ${Math.round(jpg.length / 1024)} KB`);
  }
  await stran.close();
  const { mapa, ...brez } = nabor;
  fs.writeFileSync(path.join(izhod, "naloge.json"), JSON.stringify({ ...brez, slike }, null, 2) + "\n");
  console.log(`Pripravljenih ${slike.length} fotografij v ${izhod}. Meritev: node scripts/meri-skener.mjs --mapa ${izhod}`);
}

const MAPA = arg("--mapa");
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  console.error("Playwright ni nameščen (npm i -D playwright && npx playwright install chromium).");
  process.exit(1);
}
const brskalnik = await chromium.launch();
try {
  if (MAPA) {
    const nabor = naloziNabor(MAPA);
    await pripravi(brskalnik, nabor, path.resolve(arg("--izhod", path.join(nabor.mapa, "pripravljene"))));
  } else {
    const nabor = naloziNabor(PRIVZETA_MAPA, { preveriSlike: false });
    const izhod = fileURLToPath(PRIVZETA_MAPA);
    const brez = nabor.slike.filter((s) => !POSTAVITVE[s.id]).map((s) => s.id);
    if (brez.length) throw new Error(`Brez postavitve v scripts/sken-fotografije.mjs: ${brez.join(", ")}`);
    const pisave = {};
    let skupaj = 0;
    for (const s of nabor.slike) {
      if (SAMO && !SAMO.has(s.id)) continue;
      const p = POSTAVITVE[s.id];
      const kljuc = p.roka || "caveat";
      pisave[kljuc] ||= await pisava(kljuc);
      const { bajtov, kakovost } = await izdelaj(brskalnik, s, p, izhod, pisave[kljuc]);
      skupaj += bajtov;
      console.log(`${s.id}: ${Math.round(bajtov / 1024)} KB (JPEG ${kakovost})`);
    }
    console.log(`Skupaj ${(skupaj / 1024 / 1024).toFixed(2)} MB v ${izhod}`);
  }
} finally {
  await brskalnik.close();
}

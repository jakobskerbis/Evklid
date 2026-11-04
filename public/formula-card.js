// Kartica oznake (simbol ali enota) iz kode data-fx: { label, html }. Brez DOM, zato jo uporablja
// tudi aplikacija na telefonu (mobile/src/lib/rich.ts). Prevode, jezik in KaTeX dobi s configureCard.
import { lookupSymbol, lookupUnit, symbolsIn, SYMBOLS, GREEK, SUBJECT_TABLES } from "./formula-data.js";

let T = (k) => k;
let LANG = () => "sl";
let KX = () => globalThis.katex;
export function configureCard({ t, lang, katex } = {}) {
  if (t) T = t;
  if (lang) LANG = lang;
  if (katex) KX = typeof katex === "function" ? katex : () => katex;
}

const en = () => LANG() !== "sl";
// Oznake lekcije (:::simboli) so samo v slovenščini, kot lekcija.
const nameOf = (e) => (en() && e.en ? e.en : e.n);
const noteOf = (e) => (en() && !e.local ? e.noteEn : e.note) || "";
const descOf = (u) => (en() ? u.de : u.d) || "";
const symTex = (key) => {
  if (key[0] === "Δ") return `\\Delta ${symTex(key.slice(1))}`;
  const [b, s] = key.split("_");
  const base = Object.entries(GREEK).find(([, v]) => v === b)?.[0];
  const bt = base ? `\\${base}` : b;
  return s ? `${bt}_{${s.length > 1 && /[a-z]/.test(s) ? `\\mathrm{${s}}` : s}}` : bt;
};
const unitTex = (key) => `\\mathrm{${key.replace(/Ω/g, "\\Omega ").replace(/μ/g, "\\mu ").replace(/%/g, "\\%").replace(/ /g, "\\,")}}`;

// Ime in opomba oznake: besedilo, $…$ v njem je formula (»največje odstopanje od $\bar{h}$«).
function richText(text, tex, esc) {
  return String(text).split(/\$([^$]+)\$/).map((part, i) => (i % 2 ? tex(part) : subSup(esc(part)))).join("");
}
// Zapis brez $…$ (»F_r = 0«, »2^n«): indeks in potenca kot <sub>/<sup>, ne surov _ in ^;
// število ostane v isti vrstici kot enota (»1 m/s²«).
const subSup = (s) => s
  .replace(/(\d) (?=[\p{L}°%])/gu, "$1\u00a0")
  .replace(/([\p{L}\d)'′])_(?:\{([^{}]+)\}|([\p{L}\d]+))/gu, (m, b, x, y) => `${b}<sub>${x ?? y}</sub>`)
  .replace(/([\p{L}\d)])\^(?:\{([^{}]+)\}|([−-]?[\p{L}\d]+))/gu, (m, b, x, y) => `${b}<sup>${x ?? y}</sup>`);
// Ključ za bralnik zaslona: bar(x) → x̄, F_g → F g.
const MARKS = { bar: "\u0304", hat: "\u0302", vec: "\u20D7", tilde: "\u0303", dot: "\u0307", ddot: "\u0308" };
const plainKey = (key) => key.replace(/^(\w+)\(([^()]+)\)/, (m, d, x) => (MARKS[d] ? x + MARKS[d] : m)).replace("_", " ");
const plainText = (text) => String(text).replace(/\$([^$]+)\$/g, "$1");

export function cardFor(code) {
  const [kind, ...rest] = code.split(":");
  const k = KX();
  const tex = (s) => (k ? k.renderToString(s, { throwOnError: false, strict: "ignore" }) : s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  if (kind === "u") {
    const u = lookupUnit(rest.join(":"));
    if (!u) return null;
    return {
      label: `${u.key} — ${nameOf(u)}`,
      html: `<div class="fx-title">${tex(unitTex(u.key))}<b>${esc(nameOf(u))}</b></div>
        ${u.c ? `<div class="fx-line"><span class="fx-k">${T("fx.makeup")}</span>${tex(u.c)}</div>` : ""}
        ${descOf(u) ? `<div class="fx-note" dir="auto">${subSup(esc(descOf(u)))}</div>` : ""}`,
    };
  }
  const [subject, key] = rest;
  const e = lookupSymbol(key, subject, "") || lookupSymbolAny(key, subject);
  if (!e) return null;
  const delta = kind === "d";
  const name = delta ? T("fx.change", { what: nameOf(e) }) : nameOf(e);
  const symbol = (delta ? "\\Delta " : "") + (delta ? e.tex || symTex(key) : groupTex(e, key));
  const relation = e.r && !delta ? e.r : "";
  return {
    label: `${delta ? "Δ" : ""}${plainKey(key)}${!delta && inGroup(e, key) ? ` (${e.keys.map(plainKey).join(", ")})` : ""} — ${plainText(name)}`,
    html: `<div class="fx-title">${tex(symbol)}<b dir="auto">${richText(name, tex, esc)}</b></div>
      ${relation ? `<div class="fx-line"><span class="fx-k">${T("fx.formula")}</span>${tex(`\\displaystyle ${relation}`)}</div>${partsHtml(relation, subject, key, tex, esc)}` : ""}
      ${unitHtml(e, tex, esc)}
      ${noteOf(e) ? `<div class="fx-note" dir="auto">${richText(noteOf(e), tex, esc)}</div>` : ""}`,
  };
}

// Enota na kartici: iz slovarja enot (ime in sestava), prosta enota lekcije (TeX) ali »nima enote«.
function unitHtml(e, tex, esc) {
  const noUnit = `<div class="fx-line fx-sub"><span>${T("fx.noUnit")}</span></div>`;
  if (e.local) {
    if (!e.u) return "";
    if (/^(–|-|—|1|brez)$/.test(e.u)) return noUnit;
  } else if (!e.u) return noteOf(e) ? "" : noUnit;
  const u = lookupUnit(normUnitKey(e.u));
  if (!u) return `<div class="fx-line"><span class="fx-k">${T("fx.unit")}</span>${tex(`\\mathrm{${e.u.replace(/ +/g, "\\,")}}`)}</div>`;
  return `<div class="fx-line"><span class="fx-k">${T("fx.unit")}</span>${tex(unitTex(u.key))}${nameOf(u) !== u.key ? `<span class="fx-un" dir="auto">(${esc(nameOf(u))})</span>` : ""}</div>
    ${u.c ? `<div class="fx-line fx-sub">${tex(u.c)}${descOf(u) ? ` <span dir="auto">${subSup(esc(descOf(u)))}</span>` : ""}</div>` : descOf(u) ? `<div class="fx-line fx-sub"><span dir="auto">${subSup(esc(descOf(u)))}</span></div>` : ""}`;
}
const normUnitKey = (s) => s.replace(/\\mathrm\s*\{([^{}]*)\}/g, "$1").replace(/\\[,;: ]|~/g, " ").replace(/\\Omega\s*/g, "Ω").replace(/\\mu\s*/g, "μ")
  .replace(/\^\{(-?\d)\}/g, "^$1").replace(/[{}]/g, "").replace(/\s+/g, " ").trim();

// Vrstica oznak lekcije z več oznakami (»m_1, m_2 | masi teles«): kartica pokaže vse,
// da se ime v dvojini ali množini ujema z oznakami.
const inGroup = (e, key) => e.local && e.keys?.length > 1 && e.keys.includes(key);
const groupTex = (e, key) => (inGroup(e, key) ? e.keys.map((k, i) => e.texs?.[i] || symTex(k)).join(",\\ ") : e.tex || symTex(key));
// Sestavni deli zveze (ρ = m/V → m masa, V prostornina), vsak z enoto, če jo ima.
function partsHtml(relation, subject, self, tex, esc) {
  const parts = symbolsIn(relation, subject).filter(([k, , d]) => k !== self || d);
  if (!parts.length) return "";
  const groups = new Set();
  const rows = parts.map(([k, subj, d]) => {
    const p = lookupSymbol(k, subj, relation) || lookupSymbolAny(k, subj);
    if (!p) return "";
    const g = !d && inGroup(p, k) ? `${subj}|${p.keys.join(",")}` : "";
    if (g && (groups.has(g) || p.keys.includes(self))) return ""; // skupina tapnjene oznake je že v naslovu // m_1 in m_2 z istim imenom: ena vrstica »m₁, m₂ masi teles«
    if (g) groups.add(g);
    const nm = d ? T("fx.change", { what: nameOf(p) }) : nameOf(p);
    const unit = p.u && !/^(–|-|—|1|brez)$/.test(p.u) ? (lookupUnit(normUnitKey(p.u))?.key ? unitTex(lookupUnit(normUnitKey(p.u)).key) : `\\mathrm{${p.u.replace(/ +/g, "\\,")}}`) : "";
    return `<li>${tex(d ? `\\Delta ${p.tex || symTex(k)}` : groupTex(p, k))}<span dir="auto">${richText(nm, tex, esc)}${unit ? ` <span class="fx-un">[${tex(unit)}]</span>` : ""}</span></li>`;
  }).join("");
  return rows ? `<div class="fx-parts"><span class="fx-k">${T("fx.parts")}</span><ul>${rows}</ul></div>` : "";
}
// Kartica brez celotne formule: vzemi prvo različico (tudi s ctx).
function lookupSymbolAny(key, subject) {
  if (subject?.[0] === "@") return lookupSymbol(key, subject);
  for (const tb of SUBJECT_TABLES[subject] || ["MAT"]) {
    const v = SYMBOLS[tb][key];
    if (v) return Array.isArray(v) ? v[v.length - 1] : v;
  }
  return null;
}


// Nabor fotografij nalog za meritev skenerja (točka 27 načrta izboljšav, j 19. 11. 2026) in samodejna ocena prepisov.
// Uporabljata ga scripts/sken-fotografije.mjs (izdela ali pripravi slike) in scripts/meri-skener.mjs (plačana meritev);
// test/meri-skener.test.js preveri nabor in oceno brez klicev API.
//
// Nabor je mapa z datoteko naloge.json in slikami (privzeto test/fixtures/sken/). Ista oblika velja za prave fotografije
// s telefona (j jih doda pozneje, v svojo mapo): na vsaki sliki je ena »glavna« naloga (ta, ki jo učenec slika ali
// označi), po želji še druge. Polja ene slike:
//   id         kratko ime (a-z, 0-9, -), enolično
//   datoteka   ime slike v mapi (.jpg, .jpeg, .png, .webp)
//   predmet    MAT | FIZ | KEM;  stopnja  OŠ | SŠ (nastavitve učenca pri meritvi)
//   opis       kako slika izgleda (za človeka, ki bere izid)
//   besedilo   točno besedilo glavne naloge, kot je na listu, formule v LaTeX med $ … $ (pričakovani prepis za kamero
//              v Inštruktorju, server/scan.js readTaskPhoto); brez številke naloge
//   figure     ali je naloga brez slike (skica, graf, vezje) nerešljiva (readTaskPhoto »figure«)
//   more       ali je na sliki več ločenih nalog; tasks: koliko (readTaskPhoto »more«, »tasks«)
//   racun      pričakovano branje zaslona Skeniraj (readMathPhoto »text«) v zapisu kalkulatorja; pri besedilni nalogi
//              »<črka>=?« (takrat so podatki v »podatki«); null, če ga ni
//   goal       neobvezno: cilj, ki ga mora prebrati (factor, simplify, evaluate, derivative, solve)
//   podatki    neobvezno: števila, ki morajo biti med prebranimi podatki (»given«) ali v računu
//   resitev    pričakovani rezultat, seznam nizov v zapisu kalkulatorja (rešitve enačbe, vrednost, izraz, interval
//              »[-2,4]«, kompleksno število »-1+2i«); null, če skener naloge ne rešuje
//   toleranca  neobvezno: relativna napaka, ki še velja (zaokroževanje pri fiziki), privzeto točno
//   ostale     neobvezno: druge naloge na sliki, vsaka { besedilo, racun, goal?, podatki?, resitev?, toleranca? }
import fs from "node:fs";
import path from "node:path";
import { texToText, equalNumerically, prep, parse } from "../public/scan/solvecore.js";

export const PRIVZETA_MAPA = new URL("../test/fixtures/sken/", import.meta.url);
const KONCNICE = /\.(jpe?g|png|webp)$/i;
const CILJI = ["factor", "simplify", "evaluate", "derivative", "solve"];

// ---------- nabor ----------

function preveriNalogo(n, kje, napake) {
  if (typeof n.besedilo !== "string" || !n.besedilo.trim()) napake.push(`${kje}: manjka besedilo`);
  if (!(n.racun === null || (typeof n.racun === "string" && n.racun.trim()))) napake.push(`${kje}: racun mora biti niz ali null`);
  if (n.goal !== undefined && !CILJI.includes(n.goal)) napake.push(`${kje}: neznan goal »${n.goal}«`);
  if (n.podatki !== undefined && !(Array.isArray(n.podatki) && n.podatki.every((p) => typeof p === "string" && /^\d+(\.\d+)?$/.test(p))))
    napake.push(`${kje}: podatki morajo biti števila brez predznaka kot nizi (z decimalno piko)`);
  if (!(n.resitev === null || (Array.isArray(n.resitev) && n.resitev.length && n.resitev.every((r) => typeof r === "string" && r.trim()))))
    napake.push(`${kje}: resitev mora biti neprazen seznam nizov ali null`);
  if (n.toleranca !== undefined && !(typeof n.toleranca === "number" && n.toleranca >= 0 && n.toleranca < 0.1)) napake.push(`${kje}: toleranca 0 … 0,1`);
  if (typeof n.racun === "string" && /=\s*\?$/.test(n.racun) && !n.podatki?.length) napake.push(`${kje}: besedilna naloga (${n.racun}) brez podatkov`);
}

// Prebere in preveri naloge.json v mapi. preveriSlike: ali morajo slike obstajati (generator jih šele izdela).
export function naloziNabor(mapa = PRIVZETA_MAPA, { preveriSlike = true } = {}) {
  const dir = mapa instanceof URL ? mapa.pathname : path.resolve(String(mapa));
  const datoteka = path.join(dir, "naloge.json");
  if (!fs.existsSync(datoteka)) throw new Error(`V mapi ${dir} ni datoteke naloge.json.`);
  const nabor = JSON.parse(fs.readFileSync(datoteka, "utf8"));
  const napake = [];
  if (!Array.isArray(nabor.slike) || !nabor.slike.length) napake.push("naloge.json: manjka seznam »slike«");
  const ids = new Set();
  for (const [i, s] of (nabor.slike || []).entries()) {
    const kje = s?.id || `slika ${i + 1}`;
    if (typeof s?.id !== "string" || !/^[a-z0-9][a-z0-9-]{0,40}$/.test(s.id)) napake.push(`${kje}: id samo a-z, 0-9 in -`);
    if (ids.has(s?.id)) napake.push(`${kje}: id se ponovi`);
    ids.add(s?.id);
    if (typeof s?.datoteka !== "string" || !KONCNICE.test(s.datoteka) || s.datoteka.includes("/") || s.datoteka.includes("\\")) napake.push(`${kje}: datoteka mora biti ime slike .jpg/.png/.webp v isti mapi`);
    else if (preveriSlike && !fs.existsSync(path.join(dir, s.datoteka))) napake.push(`${kje}: slike ${s.datoteka} ni`);
    if (!["MAT", "FIZ", "KEM"].includes(s?.predmet)) napake.push(`${kje}: predmet MAT, FIZ ali KEM`);
    if (!["OŠ", "SŠ"].includes(s?.stopnja)) napake.push(`${kje}: stopnja OŠ ali SŠ`);
    if (typeof s?.figure !== "boolean" || typeof s?.more !== "boolean") napake.push(`${kje}: figure in more sta true/false`);
    if (!Number.isInteger(s?.tasks) || s.tasks < 1) napake.push(`${kje}: tasks je celo število ≥ 1`);
    else if (s.more !== s.tasks > 1) napake.push(`${kje}: more mora biti true natanko pri tasks > 1`);
    preveriNalogo(s || {}, kje, napake);
    if (s?.ostale !== undefined) {
      if (!Array.isArray(s.ostale) || s.ostale.length > s.tasks - 1) napake.push(`${kje}: ostale je seznam z največ tasks − 1 nalogami`);
      else s.ostale.forEach((o, j) => preveriNalogo(o || {}, `${kje} ostale[${j}]`, napake));
    }
  }
  if (napake.length) throw new Error(`Nabor ${datoteka} ni veljaven:\n  ${napake.join("\n  ")}`);
  return { ...nabor, mapa: dir };
}

// ---------- prepis besedila (kamera v Inštruktorju) ----------

const ZAMENJAVE = [
  [/\\[dt]frac/g, "\\frac"],
  [/\\(?:leq?|leqslant)(?![a-z])/g, "≤"],
  [/\\(?:geq?|geqslant)(?![a-z])/g, "≥"],
  [/<=/g, "≤"],
  [/>=/g, "≥"],
  [/\\(?:cdot|times)(?![a-z])|[*×⋅]/g, "·"],
  [/[−–]/g, "-"],
  [/\^\s*\{?\\circ\}?|\\circ(?![a-z])|\\degree(?![a-z])/g, "°"],
  [/\\%/g, "%"],
  [/\\pi(?![a-z])/g, "π"],
  [/\\alpha(?![a-z])/g, "α"],
  [/\\Omega(?![a-z])/g, "Ω"],
  [/\\infty(?![a-z])/g, "∞"],
  [/\\to(?![a-z])|\\rightarrow(?![a-z])|->/g, "→"],
  [/\\int(?![a-z])/g, "∫"],
  [/\\sqrt(?![a-z])/g, "√"],
  [/²/g, "^2"],
  [/³/g, "^3"],
  [/\\(log|ln|sin|cos|tan|lim)(?![a-z])/g, " $1 "],
  [/\{,\}/g, ","],
  [/\\(?:mathrm|text|textrm|mathit|mathbf|operatorname)\s*\{([^{}]*)\}/g, " $1 "],
  [/\\(?:left|right|displaystyle|limits)(?![a-z])/g, ""],
  [/\\[,;:! ]|~/g, " "],
  [/\$/g, " "],
];
// Besedilo naloge v enotni obliki: LaTeX in navaden zapis (√, ², ·) dasta isto.
export function normalizirajBesedilo(s) {
  let t = String(s ?? "").normalize("NFC");
  for (const [a, b] of ZAMENJAVE) t = t.replace(a, b);
  return t.replace(/[{}]/g, " ").replace(/\s+/g, " ").trim();
}
// Števila (decimalna vejica ali pika). V prepisu štejeta tudi deli »a,b« posebej: interval [0,2π) ali točka (1,3).
function stevila(t, razbij = false) {
  const out = [];
  for (const m of t.matchAll(/\d+(?:[.,]\d+)?/g)) {
    out.push(m[0].replace(",", "."));
    if (razbij && /[.,]/.test(m[0])) out.push(...m[0].split(/[.,]/));
  }
  return out;
}
// Računske operacije, ki morajo biti v prepisu (množenje ne: 3x in 3·x sta isto; ulomek je \frac ali /).
const OPERATORJI = [["+", /\+/g], ["-", /-/g], ["=", /=/g], ["<", /</g], [">", />/g], ["≤", /≤/g], ["≥", /≥/g], ["^", /\^/g], ["√", /√/g], ["ulomek", /\\frac|\//g], ["log", /\blog\b/g], ["ln", /\bln\b/g], ["sin", /\bsin\b/g], ["cos", /\bcos\b/g], ["tan", /\btan\b/g], ["lim", /\blim\b/g], ["∫", /∫/g], ["π", /π/g], ["%", /%/g], ["°", /°/g]];
const operatorji = (t) => OPERATORJI.flatMap(([ime, re]) => Array((t.match(re) || []).length).fill(ime));
const besede = (t) => (t.replace(/\\[a-zA-Z]+/g, " ").toLowerCase().match(/\p{L}{3,}/gu) || []).filter((w) => !["frac", "log", "sin", "cos", "tan", "lim", "mathrm", "text"].includes(w));
// Delež elementov a, ki so v b (večkratnost šteje).
function delez(a, b) {
  if (!a.length) return 1;
  const ostane = new Map();
  for (const x of b) ostane.set(x, (ostane.get(x) || 0) + 1);
  let n = 0;
  for (const x of a) {
    if (ostane.get(x) > 0) {
      n++;
      ostane.set(x, ostane.get(x) - 1);
    }
  }
  return n / a.length;
}
const r2 = (x) => Math.round(x * 100) / 100;

// Primerjava prepisa s pričakovanim besedilom: vsa števila in operacije in skoraj vse besede (≥ 85 %).
export function oceniBesedilo(pricakovano, dobljeno) {
  const a = normalizirajBesedilo(pricakovano).replace(/^\d+\s*[.)]\s*/, "");
  const b = normalizirajBesedilo(dobljeno).replace(/^\d+\s*[.)]\s*/, "");
  const st = delez(stevila(a), stevila(b, true));
  const op = delez(operatorji(a), operatorji(b));
  const be = delez(besede(a), besede(b));
  const zgosti = (t) => t.replace(/[\s·]/g, "").toLowerCase();
  return { tocno: zgosti(a) === zgosti(b), stevila: r2(st), operatorji: r2(op), besede: r2(be), ok: st === 1 && op === 1 && be >= 0.85 };
}

// ---------- branje zaslona Skeniraj (zapis kalkulatorja) ----------

const brezImena = (t) =>
  String(t ?? "")
    .trim()
    .replace(/^[a-zA-Z]\s*\(\s*x\s*\)\s*=(?!=)/, "")
    .replace(/^d\/dx\s*\((.*)\)$/s, "$1");
const zgostiRacun = (t) => brezImena(t).replace(/[\s*·]/g, "").replace(/<=/g, "≤").replace(/>=/g, "≥").toLowerCase();
const enako = (a, b, vars = null) => {
  try {
    return equalNumerically(parse(prep(a)), parse(prep(b)), vars);
  } catch {
    return false;
  }
};
const RELACIJA = /(<=|>=|≤|≥|=|<|>)/;
function enakovredno(a, b) {
  const ea = String(a).split(";").map(brezImena);
  const eb = String(b).split(";").map(brezImena);
  if (ea.length !== eb.length) return false;
  const ena = (x, y) => {
    const px = x.split(RELACIJA);
    const py = y.split(RELACIJA);
    if (px.length !== py.length) return false;
    if (px.length === 1) return enako(x, y);
    if (px.length !== 3) return false;
    const obrni = { "<": ">", ">": "<", "<=": ">=", ">=": "<=", "≤": "≥", "≥": "≤", "=": "=" };
    return (px[1] === py[1] && enako(px[0], py[0]) && enako(px[2], py[2])) || (obrni[px[1]] === py[1] && enako(px[0], py[2]) && enako(px[2], py[0]));
  };
  return ea.every((x) => eb.some((y) => ena(x, y)));
}

// Ena prebrana naloga zaslona Skeniraj ({ text, goal, given }) proti pričakovani (racun, goal, podatki).
export function oceniRacun(n, problem) {
  const text = String(problem?.text ?? "");
  const given = (problem?.given || []).join(" ; ");
  const podatki = n.podatki?.length ? delez(n.podatki, stevila(normalizirajBesedilo(`${given} ${text}`), true)) : 1;
  const out = { tocno: false, enakovredno: false, podatki: r2(podatki), cilj: n.goal ? problem?.goal === n.goal : null, ok: false };
  if (n.racun === null) return { ...out, ok: podatki === 1 };
  if (/=\s*\?$/.test(n.racun)) {
    // Besedilna naloga: iskana količina kot <črka>=? in vsi podatki prebrani.
    out.tocno = zgostiRacun(n.racun) === zgostiRacun(text);
    out.enakovredno = /=\s*\?$/.test(text.trim());
    return { ...out, ok: out.enakovredno && podatki === 1 };
  }
  out.tocno = zgostiRacun(n.racun) === zgostiRacun(text);
  out.enakovredno = out.tocno || enakovredno(n.racun, text);
  const t = oceniBesedilo(n.racun.replace(/\*/g, ""), text.replace(/\*/g, ""));
  return { ...out, ok: (out.enakovredno || (t.stevila === 1 && t.operatorji === 1)) && podatki === 1 };
}

// Katera pričakovana naloga na sliki najbolj ustreza prebrani (za oceno rešitve prve prebrane naloge).
export function najblizja(slika, problem) {
  const vse = [slika, ...(slika.ostale || [])];
  let naj = { n: vse[0], i: 0, ocena: -1 };
  for (const [i, n] of vse.entries()) {
    const o = oceniRacun(n, problem);
    const t = n.racun ? oceniBesedilo(n.racun.replace(/\*/g, ""), String(problem?.text ?? "").replace(/\*/g, "")) : { stevila: 0, operatorji: 0 };
    const ocena = (o.ok ? 10 : 0) + (o.enakovredno ? 5 : 0) + t.stevila + t.operatorji + o.podatki;
    if (ocena > naj.ocena) naj = { n, i, ocena };
  }
  return naj;
}

// ---------- rešitev ----------

const brezSpremenljivke = (t) => t.replace(/^\s*(?:[a-zA-Z](?:_\{?\w+\}?)?|f'\(x\)|f\(x\)|[A-Z]\w*)\s*(?:=|≈|\\approx)(?!=)\s*/, "").trim();
const zgostiResitev = (t) => normalizirajBesedilo(t).replace(/[\s·]/g, "").replace(/\\in|∈/g, "").replace(/\\infty/g, "∞").toLowerCase();
// Kandidati za primerjavo: rešitve in vrednost (AI) ter deli odgovora v LaTeX.
// Deli odgovora pred odstranitvijo imena količine.
const surovi = ({ solutions = [], value = "", answer_tex = "" }) =>
  [...solutions.flatMap((x) => String(x).split(";")), value, ...texToText(String(answer_tex || "")).split(/[;]|,\s+|\s{2,}|\bali\b|\bin\b|\bor\b/)]
    .map((x) => String(x || "").trim())
    .filter(Boolean);
function kandidati({ solutions = [], value = "", answer_tex = "" }) {
  const deli = texToText(String(answer_tex || ""))
    .split(/[;]|,\s+|\s{2,}|\bali\b|\bin\b|\bor\b/)
    .map((x) => x.trim())
    .filter(Boolean);
  return [...solutions.flatMap((x) => String(x).split(";")), value, ...deli].map((x) => brezSpremenljivke(String(x || ""))).filter(Boolean);
}
// Rezultat odgovora: prvo število (s predznakom) za zadnjim »=« ali »≈«, sicer prvo število v odgovoru.
function rezultat(k) {
  const t = normalizirajBesedilo(k).replace(/−/g, "-").replace(/(\d)\s+(\d{3})(?!\d)/g, "$1$2");
  const del = t.split(/=|≈|\\approx/).at(-1);
  const m = /(-\s*)?(\d+(?:[.,]\d+)?)/.exec(del);
  return m ? Number(`${m[1] ? "-" : ""}${m[2].replace(",", ".")}`) : null;
}
const decimalna = (t) => stevila(String(t).replace(/(\d)\s+(\d{3})(?!\d)/g, "$1$2")).map(Number);

// Ali se rešitev (AI ali lastni reševalnik) ujema s pričakovano: vsak pričakovani rezultat najden; pri AI rešitvah
// enačbe tudi nobena odvečna (npr. lažna rešitev korenske enačbe).
export function oceniResitev(n, dobljeno) {
  if (!n.resitev || !dobljeno) return null;
  const kand = kandidati(dobljeno);
  const vse = zgostiResitev(`${(dobljeno.solutions || []).join(";")};${dobljeno.value || ""};${texToText(String(dobljeno.answer_tex || ""))}`);
  const tol = n.toleranca || 0;
  const besedilna = /=\s*\?$/.test(n.racun || "");
  const najdi = (e) => {
    if (/^[[(].*,.*[\])]$/.test(e) || /i$/.test(e)) return vse.includes(zgostiResitev(e)); // interval, kompleksno število
    let vars;
    try {
      vars = /[a-z]/i.test(e.replace(/pi|sqrt|log|ln|sin|cos|tan|e\b/g, "")) ? null : [];
    } catch {
      vars = null;
    }
    if (!(besedilna && vars) && kand.some((k) => enako(k, e, vars))) return true;
    // Besedilna naloga ali zaokroženo število: rezultat je prvo število za zadnjim »=« ali »≈« (s predznakom), enota
    // sme slediti (400 €, 32 cm²). Brez tolerance v manifestu le zaokrožitev na 1e-6.
    if (vars && Number.isFinite(Number(e)) && (tol > 0 || besedilna)) {
      const cilj = Number(e);
      const t = tol > 0 ? tol : 1e-6;
      // Del odgovora za drugo količino (»R = 2 Ω« ob iskanem I) ne šteje.
      const ime = besedilna ? zgostiResitev(n.racun.replace(/=\s*\?$/, "")) : null;
      // Filter le, če odgovor iskano količino imenuje (sicer jo AI lahko imenuje drugače: c namesto x, P namesto S).
      const imeDela = (d) => /^\s*([^=≈\s]+)\s*(?:=|≈|\\approx)/.exec(normalizirajBesedilo(d))?.[1];
      const vsiDeli = surovi(dobljeno);
      const imenuje = ime && vsiDeli.some((d) => imeDela(d) && zgostiResitev(imeDela(d)) === ime);
      const deli = imenuje ? vsiDeli.filter((d) => !imeDela(d) || zgostiResitev(imeDela(d)) === ime) : vsiDeli;
      return deli.some((k) => {
        const x = rezultat(k);
        return x !== null && Math.abs(x - cilj) <= t * Math.max(1, Math.abs(cilj));
      });
    }
    return false;
  };
  // Sistem enačb: vrednosti po abecedi neznank (x=2, y=1 ali (2, 1)); zamenjan par ni pravilen.
  if (/;/.test(n.racun || "") && /=/.test(n.racun)) {
    const imena = [...new Set(n.racun.match(/\b[a-z]\b/g) || [])].sort();
    const par = vse.includes(zgostiResitev(`(${n.resitev.join(",")})`));
    // Cela vrednost: x=2 ne sme biti začetek x=21 ali x=2/3.
    const cela = (t) => new RegExp(`(?<![\\w.])${zgostiResitev(t).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\d./])`).test(vse);
    const poImenih = imena.length === n.resitev.length && imena.every((v, i) => cela(`${v}=${n.resitev[i]}`));
    return par || poImenih;
  }
  // Razstavi in poenostavi: številsko enak, a tudi v pravi obliki (ne nerazstavljen ali neokrajšan izvirnik).
  if (n.goal === "factor" || n.goal === "simplify") {
    const oklepaji = (t) => (String(t).match(/\(/g) || []).length;
    const dolzina = (t) => zgostiResitev(t).replace(/[*()]/g, "").length;
    const oblika = kand.some((k) =>
      n.resitev.every((e) => enako(k, e, null)) &&
      (n.goal === "factor" ? oklepaji(k) >= oklepaji(n.resitev[0]) : dolzina(k) <= dolzina(n.resitev[0]) + 4));
    if (!oblika) return false;
  }
  const vsi = n.resitev.every(najdi);
  const odvecne = Array.isArray(dobljeno.solutions) && dobljeno.solutions.length > n.resitev.length && /=/.test(n.racun || "") && !/=\s*\?$/.test(n.racun || "");
  return vsi && !odvecne;
}

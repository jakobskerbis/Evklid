// Uvoz virov priprave na test brez AI (docs/priprava.md, PR 3a): iz izvirnika (shramba.js) naredi strani z vrsticami.
// - besedilo: prilepljeno besedilo, ena stran;
// - pdf: plast z besedilom (pdfjs-dist v ločeni niti, z mejo strani in časa); stran brez besedila (skenirana) ostane
//   za branje fotografij (PR 3b) in se označi;
// - word (.docx): odstavki, naslovi (slogi Heading/Naslov), alineje, tabele po vrsticah, formule (OMML → LaTeX),
//   prelomi strani;
// - powerpoint (.pptx): ena stran na prosojnico v vrstnem redu predstavitve, z opombami govorca.
// Fotografije (vrsta slika) tu niso: berejo se z obstoječim branjem zapiskov (server/zapiski.js) v PR 3b.
// Varnost: ZIP se bere sam (brez knjižnic), z mejami razširjene velikosti (zaščita pred bombo ZIP), XML se ne
// razčlenjuje z razčlenjevalnikom (ni zunanjih entitet), PDF brez izvajanja JavaScripta in brez nalaganja pisav.
import zlib from "node:zlib";
import { Worker } from "node:worker_threads";

const MB = 1024 * 1024;
export const MEJE_UVOZA = {
  strani: 80, // največ strani (PDF) ali prosojnic na vir
  znakov: 200_000, // največ znakov besedila na vir (več se odreže z opozorilom)
  zipVnos: 20 * MB, // razširjen en vnos ZIP
  zipSkupaj: 60 * MB, // vsi prebrani vnosi skupaj
  pdfMs: 20_000, // čas za branje PDF
};

export class NapakaUvoza extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

// ---------- ZIP (Word, PowerPoint) ----------

function imenik(buf) {
  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 22 - 0xffff); i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new NapakaUvoza("uvoz_zip", "Datoteka je poškodovana.");
  const n = buf.readUInt16LE(eocd + 10);
  const off = buf.readUInt32LE(eocd + 16);
  const vnosi = new Map();
  let p = off;
  for (let k = 0; k < n; k++) {
    if (p + 46 > eocd || buf.readUInt32LE(p) !== 0x02014b50) throw new NapakaUvoza("uvoz_zip", "Datoteka je poškodovana.");
    const metoda = buf.readUInt16LE(p + 10);
    const stisnjeno = buf.readUInt32LE(p + 20);
    const razsirjeno = buf.readUInt32LE(p + 24);
    const dIme = buf.readUInt16LE(p + 28);
    const dDod = buf.readUInt16LE(p + 30);
    const dOp = buf.readUInt16LE(p + 32);
    const lokalno = buf.readUInt32LE(p + 42);
    const ime = buf.subarray(p + 46, p + 46 + dIme).toString("utf8");
    vnosi.set(ime, { metoda, stisnjeno, razsirjeno, lokalno });
    p += 46 + dIme + dDod + dOp;
  }
  return vnosi;
}

function zipBralnik(buf) {
  const vnosi = imenik(buf);
  let skupaj = 0;
  return {
    ima: (ime) => vnosi.has(ime),
    imena: () => [...vnosi.keys()],
    beri(ime) {
      const v = vnosi.get(ime);
      if (!v) return null;
      // Velikost iz glave je lahko lažna: zato še maxOutputLength pri razširjanju.
      if (v.razsirjeno > MEJE_UVOZA.zipVnos)
        throw new NapakaUvoza("uvoz_zip_velik", "Datoteka je po razširitvi prevelika.");
      const L = v.lokalno;
      if (L + 30 > buf.length || buf.readUInt32LE(L) !== 0x04034b50) throw new NapakaUvoza("uvoz_zip", "Datoteka je poškodovana.");
      const start = L + 30 + buf.readUInt16LE(L + 26) + buf.readUInt16LE(L + 28);
      const podatki = buf.subarray(start, start + v.stisnjeno);
      if (podatki.length !== v.stisnjeno) throw new NapakaUvoza("uvoz_zip", "Datoteka je poškodovana.");
      let out;
      try {
        if (v.metoda === 0) out = Buffer.from(podatki);
        else if (v.metoda === 8) out = zlib.inflateRawSync(podatki, { maxOutputLength: MEJE_UVOZA.zipVnos });
        else throw new NapakaUvoza("uvoz_zip", "Datoteka uporablja nepodprto stiskanje.");
      } catch (e) {
        if (e instanceof NapakaUvoza) throw e;
        throw new NapakaUvoza(e.code === "ERR_BUFFER_TOO_LARGE" ? "uvoz_zip_velik" : "uvoz_zip", e.code === "ERR_BUFFER_TOO_LARGE" ? "Datoteka je po razširitvi prevelika." : "Datoteka je poškodovana.");
      }
      skupaj += out.length;
      if (skupaj > MEJE_UVOZA.zipSkupaj) throw new NapakaUvoza("uvoz_zip_velik", "Datoteka je po razširitvi prevelika.");
      return out.toString("utf8");
    },
  };
}

// ---------- XML brez razčlenjevalnika ----------

const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };
export const odkodiraj = (s) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos);/gi, (m, e) => {
    if (e[0] !== "#") return ENT[e.toLowerCase()] ?? m;
    const c = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
    return Number.isFinite(c) && c > 0 && c < 0x110000 && !(c >= 0xd800 && c < 0xe000) ? String.fromCodePoint(c) : "";
  });
const atribut = (tag, ime) => {
  const m = new RegExp(`\\s${ime}="([^"]*)"`).exec(tag);
  return m ? odkodiraj(m[1]) : null;
};

// OMML (formule v Wordu) → LaTeX za najpogostejše gradnike; neznani gradnik da svoje besedilo.
// Vhod je XML enega <m:oMath>. Rekurzivno po otrocih, brez razčlenjevalnika: poišče ujemajoče zaključne oznake.
function otroci(xml) {
  const out = [];
  const re = /<(\/?)([a-zA-Z]+:[a-zA-Z]+)([^>]*?)(\/?)>/g;
  let globina = 0;
  let zacetek = -1;
  let ime = null;
  let m;
  while ((m = re.exec(xml))) {
    const [, zak, tag, , sam] = m;
    if (!zak && !sam) {
      if (globina === 0) {
        zacetek = m.index;
        ime = tag;
      }
      globina++;
    } else if (zak) {
      globina--;
      if (globina === 0 && ime === tag) out.push({ tag, xml: xml.slice(zacetek, re.lastIndex), notranje: xml.slice(xml.indexOf(">", zacetek) + 1, m.index) });
    } else if (sam && globina === 0) out.push({ tag, xml: m[0], notranje: "" });
  }
  return out;
}
const otrok = (xml, tag) => otroci(xml).find((o) => o.tag === tag)?.notranje ?? "";
class NapakaOmml extends Error {}
// × ostane \times (vektorski produkt ni skalarni). Posebni znaki LaTeXa se ubežijo: % bi sicer zakril preostanek
// formule, $ bi končal formulo v izseku, { } bi izginila (množica {1, 2}).
const ZNAKI_LATEX = { "×": "\\times ", "·": "\\cdot ", "−": "-", "≤": "\\le ", "≥": "\\ge ", "≠": "\\neq ", "∞": "\\infty ", "π": "\\pi ", "α": "\\alpha ", "β": "\\beta ", "Δ": "\\Delta ", "→": "\\rightarrow ", "∫": "\\int ", "∑": "\\sum ", "%": "\\%", "#": "\\#", "&": "\\&", "$": "\\text{\\textdollar}", "{": "\\{", "}": "\\}" };
// Oklepaji (m:d), operatorji (m:nary) in naglasi (m:acc); neznan znak: [?] namesto napačne formule.
const OKLEPAJI = { "(": "(", ")": ")", "[": "[", "]": "]", "{": "\\{", "}": "\\}", "|": "|", "‖": "\\|", "⟨": "\\langle", "⟩": "\\rangle", "⌊": "\\lfloor", "⌋": "\\rfloor", "⌈": "\\lceil", "⌉": "\\rceil", "": "." };
const OPERATORJI = { "∫": "\\int", "∬": "\\iint", "∭": "\\iiint", "∮": "\\oint", "∯": "\\oiint", "∑": "\\sum", "∏": "\\prod", "∐": "\\coprod", "⋃": "\\bigcup", "⋂": "\\bigcap" };
const NAGLASI = { "\u0302": "\\hat", "\u20d7": "\\vec", "\u0307": "\\dot", "\u0308": "\\ddot", "\u0305": "\\bar", "\u00af": "\\bar", "\u0303": "\\tilde", "\u030c": "\\check", "\u0306": "\\breve", "\u0301": "\\acute", "\u0300": "\\grave" };
const OMML_GLOBINA = 12;
const OMML_ZNAKOV = 20_000;
// Vrednost lastnosti (npr. <m:begChr m:val="["/>) ali privzeta, če je ni (ECMA-376).
const lastnost = (xml, ime, privzeto) => {
  const m = new RegExp(`<m:${ime}\\b[^>]*?m:val="([^"]*)"`).exec(xml);
  return m ? odkodiraj(m[1]) : privzeto;
};
const znak = (tabela, c) => {
  if (!(c in tabela)) throw new NapakaOmml();
  return tabela[c];
};
function omml(xml, g = 0) {
  // Pregloboka ali predolga formula (ročno sestavljena datoteka) se ne razčlenjuje: [?] namesto počasnega branja.
  if (g > OMML_GLOBINA || xml.length > OMML_ZNAKOV) throw new NapakaOmml();
  let s = "";
  const om = (x) => omml(x, g + 1);
  for (const o of otroci(xml)) {
    const n = o.notranje;
    switch (o.tag) {
      case "m:r": {
        const t = [...n.matchAll(/<m:t[^>]*>([^<]*)<\/m:t>/g)].map((x) => odkodiraj(x[1])).join("");
        s += [...t].map((c) => ZNAKI_LATEX[c] ?? c).join("");
        break;
      }
      case "m:f":
        // noBar: brez ulomkove črte (binomski koeficient v oklepaju), ni ulomek.
        s += `${lastnost(otrok(n, "m:fPr"), "type", "bar") === "noBar" ? "\\genfrac{}{}{0pt}{}" : "\\frac"}{${om(otrok(n, "m:num"))}}{${om(otrok(n, "m:den"))}}`;
        break;
      case "m:sPre":
        s += `{}_{${om(otrok(n, "m:sub"))}}^{${om(otrok(n, "m:sup"))}}{${om(otrok(n, "m:e"))}}`;
        break;
      case "m:m":
        s += `\\begin{matrix} ${otroci(n).filter((x) => x.tag === "m:mr").map((r) => otroci(r.notranje).filter((x) => x.tag === "m:e").map((x) => om(x.notranje)).join(" & ")).join(" \\\\ ")} \\end{matrix}`;
        break;
      case "m:eqArr":
        // Sistem enačb: vrstica na enačbo (& je v Wordu poravnava, ne znak).
        s += `\\begin{array}{l} ${otroci(n).filter((x) => x.tag === "m:e").map((x) => om(x.notranje).replace(/\\&/g, "")).join(" \\\\ ")} \\end{array}`;
        break;
      case "m:limLow":
      case "m:limUpp": {
        const e = om(otrok(n, "m:e"));
        const lim = om(otrok(n, "m:lim"));
        if (o.tag === "m:limLow" && /^(lim|max|min|sup|inf)$/.test(e)) s += `\\${e}_{${lim}}`;
        else s += `\\${o.tag === "m:limLow" ? "underset" : "overset"}{${lim}}{${e}}`;
        break;
      }
      case "m:acc":
        s += `${znak(NAGLASI, lastnost(otrok(n, "m:accPr"), "chr", "\u0302"))}{${om(otrok(n, "m:e"))}}`;
        break;
      case "m:bar":
        s += `\\${lastnost(otrok(n, "m:barPr"), "pos", "bot") === "top" ? "overline" : "underline"}{${om(otrok(n, "m:e"))}}`;
        break;
      case "m:groupChr": {
        const c = lastnost(otrok(n, "m:groupChrPr"), "chr", "\u23df");
        if (c !== "\u23df" && c !== "\u23de") throw new NapakaOmml();
        s += `\\${c === "\u23df" ? "underbrace" : "overbrace"}{${om(otrok(n, "m:e"))}}`;
        break;
      }
      case "m:sSup":
        s += `{${om(otrok(n, "m:e"))}}^{${om(otrok(n, "m:sup"))}}`;
        break;
      case "m:sSub":
        s += `{${om(otrok(n, "m:e"))}}_{${om(otrok(n, "m:sub"))}}`;
        break;
      case "m:sSubSup":
        s += `{${om(otrok(n, "m:e"))}}_{${om(otrok(n, "m:sub"))}}^{${om(otrok(n, "m:sup"))}}`;
        break;
      case "m:rad": {
        const deg = om(otrok(n, "m:deg"));
        s += deg ? `\\sqrt[${deg}]{${om(otrok(n, "m:e"))}}` : `\\sqrt{${om(otrok(n, "m:e"))}}`;
        break;
      }
      case "m:d": {
        // Oklepaji iz m:dPr (|x|, [0, 3], {1, 2} niso okrogli); privzeto ( ) in ločilo |.
        const pr = otrok(n, "m:dPr");
        const sep = lastnost(pr, "sepChr", "|");
        const loc = sep === "|" ? " \\mid " : sep === "," ? ", " : ` ${sep} `;
        s += `\\left${znak(OKLEPAJI, lastnost(pr, "begChr", "("))} ${otroci(n).filter((x) => x.tag === "m:e").map((x) => om(x.notranje)).join(loc)} \\right${znak(OKLEPAJI, lastnost(pr, "endChr", ")"))}`;
        break;
      }
      case "m:nary": {
        const op = znak(OPERATORJI, lastnost(otrok(n, "m:naryPr"), "chr", "∫"));
        const lo = om(otrok(n, "m:sub"));
        const hi = om(otrok(n, "m:sup"));
        s += `${op}${lo ? `_{${lo}}` : ""}${hi ? `^{${hi}}` : ""} ${om(otrok(n, "m:e"))}`;
        break;
      }
      case "m:func": {
        // Ime funkcije (sin, tg, log z indeksom, lim z mejo): \lim_{…} ostane, sicer \operatorname{ime}.
        const ime = om(otrok(n, "m:fName")).trim();
        const g = /^\{?([A-Za-z]+)\}?(.*)$/.exec(ime);
        s += `${ime.startsWith("\\") ? ime : g ? `\\operatorname{${g[1]}}${g[2]}` : `{${ime}}`} ${om(otrok(n, "m:e"))}`;
        break;
      }
      case "m:e":
      case "m:oMath":
      case "m:box":
        s += om(n);
        break;
      default:
        if (!/Pr$/.test(o.tag)) s += om(n);
    }
  }
  return s.replace(/\s+/g, " ").trim();
}

// ---------- Word ----------

function odstavek(xml) {
  // Besedilo in formule v vrstnem redu; tabulator in prelom vrstice kot presledek.
  let s = "";
  const re = /<m:oMath\b[^>]*>[\s\S]*?<\/m:oMath>|<w:t\b[^>]*>([^<]*)<\/w:t>|<w:tab\/>|<w:br\b[^>]*\/>|<w:sym\b[^>]*\/>/g;
  let m;
  while ((m = re.exec(xml))) {
    if (m[0].startsWith("<m:oMath")) {
      let f = null;
      try {
        f = omml(m[0].replace(/^<m:oMath\b[^>]*>|<\/m:oMath>$/g, ""));
      } catch (e) {
        if (!(e instanceof NapakaOmml)) throw e;
        s += " [formula] [?] ";
      }
      if (f) s += ` $${f}$ `;
    } else if (m[1] !== undefined) s += odkodiraj(m[1]);
    else if (m[0].startsWith("<w:br") && /w:type="page"/.test(m[0])) s += "\f";
    else s += " ";
  }
  return s;
}

export function beriWord(buf) {
  const zip = zipBralnik(buf);
  const doc = zip.beri("word/document.xml");
  if (!doc) throw new NapakaUvoza("uvoz_word", "V dokumentu ni besedila.");
  const telo = /<w:body>([\s\S]*)<\/w:body>/.exec(doc)?.[1] ?? doc;
  const strani = [{ stran: 1, vrstice: [] }];
  const dodaj = (v) => strani[strani.length - 1].vrstice.push(v);
  const novaStran = () => strani[strani.length - 1].vrstice.length && strani.push({ stran: strani.length + 1, vrstice: [] });
  // Odstavki in vrstice tabel po vrsti (tabela: ena vrstica na vrstico tabele, celice ločene z » | «).
  // Prazen odstavek <w:p/> mora biti prvi, sicer bi <w:p …> brez zaključka pogoltnil naslednji odstavek.
  const re = /<w:tbl>[\s\S]*?<\/w:tbl>|<w:p(?:\s[^>]*)?\/>|<w:p(?:\s[^>]*[^/])?>[\s\S]*?<\/w:p>/g;
  let m;
  while ((m = re.exec(telo))) {
    const x = m[0];
    if (x.startsWith("<w:tbl")) {
      for (const tr of x.match(/<w:tr\b[\s\S]*?<\/w:tr>/g) || []) {
        const celice = (tr.match(/<w:tc\b[\s\S]*?<\/w:tc>/g) || []).map((tc) => (tc.match(/<w:p(?:\s[^>]*[^/])?>[\s\S]*?<\/w:p>/g) || []).map(odstavek).join(" ").replace(/\s+/g, " ").trim());
        if (celice.some(Boolean)) dodaj({ besedilo: celice.join(" | "), tabela: true });
      }
      continue;
    }
    if (/<w:lastRenderedPageBreak\/>|<w:pageBreakBefore\/>/.test(x)) novaStran();
    const slog = atribut(/<w:pStyle\b[^>]*\/>/.exec(x)?.[0] || "", "w:val") || "";
    const raven = /^(?:Heading|Naslov|heading)\s*(\d)$/i.exec(slog.replace(/[^A-Za-z0-9 ]/g, ""))?.[1] ?? (/^Title$/i.test(slog) ? "1" : null);
    const alineja = /<w:numPr>/.test(x) || /^List/i.test(slog);
    const deli = odstavek(x).split("\f");
    deli.forEach((d, i) => {
      if (i > 0) novaStran();
      const t = d.replace(/[ \t ]+/g, " ").trim();
      if (!t) return dodaj({ besedilo: "" });
      dodaj({ besedilo: t, ...(raven ? { naslov: Number(raven) } : {}), ...(alineja ? { alineja: true } : {}) });
    });
  }
  return strani.filter((s) => s.vrstice.some((v) => v.besedilo));
}

// ---------- PowerPoint ----------

function prosojnica(xml, { brezSlike = false } = {}) {
  const vrstice = [];
  for (const sp of xml.match(/<p:sp\b[\s\S]*?<\/p:sp>|<a:tbl\b[\s\S]*?<\/a:tbl>/g) || []) {
    if (brezSlike && /type="sldImg"/.test(sp)) continue; // sličica prosojnice na strani z opombami
    const naslov = /<p:ph\b[^>]*type="(?:title|ctrTitle)"/.test(sp);
    for (const p of sp.match(/<a:p\b[\s\S]*?<\/a:p>/g) || []) {
      const t = (p.match(/<a:t>([^<]*)<\/a:t>|<a:t [^>]*>([^<]*)<\/a:t>/g) || []).map((x) => odkodiraj(x.replace(/<\/?a:t[^>]*>/g, ""))).join("").replace(/\s+/g, " ").trim();
      if (t) vrstice.push({ besedilo: t, ...(naslov ? { naslov: 2 } : {}), ...(/<a:buChar|<a:buAutoNum/.test(p) ? { alineja: true } : {}) });
    }
    vrstice.push({ besedilo: "" });
  }
  return vrstice;
}

export function beriPowerpoint(buf) {
  const zip = zipBralnik(buf);
  const pres = zip.beri("ppt/presentation.xml") || "";
  const rels = zip.beri("ppt/_rels/presentation.xml.rels") || "";
  const cilji = new Map([...rels.matchAll(/<Relationship\b[^>]*>/g)].map((m) => [atribut(m[0], "Id"), atribut(m[0], "Target")]));
  let poti = [...pres.matchAll(/<p:sldId\b[^>]*>/g)].map((m) => cilji.get(atribut(m[0], "r:id"))).filter(Boolean).map((t) => `ppt/${t.replace(/^\/?ppt\//, "").replace(/^\.\//, "")}`);
  // Brez seznama v predstavitvi: po številki datoteke.
  if (!poti.length) poti = zip.imena().filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n)).sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));
  const strani = [];
  for (const pot of poti.slice(0, MEJE_UVOZA.strani)) {
    const xml = zip.beri(pot);
    if (!xml) continue;
    const vrstice = prosojnica(xml);
    // Opombe govorca (pogosto razlaga učitelja).
    const rel = zip.beri(pot.replace(/slides\/(slide\d+\.xml)$/, "slides/_rels/$1.rels")) || "";
    const op = /Target="\.\.\/notesSlides\/([^"]+)"/.exec(rel)?.[1];
    const opombe = op ? zip.beri(`ppt/notesSlides/${op}`) : null;
    if (opombe) for (const v of prosojnica(opombe, { brezSlike: true })) if (v.besedilo && !/^\d+$/.test(v.besedilo)) vrstice.push({ ...v, opomba: true });
    strani.push({ stran: strani.length + 1, vrstice });
  }
  return strani.filter((s) => s.vrstice.some((v) => v.besedilo));
}

// ---------- PDF (v ločeni niti) ----------

const PDF_NIT = `
const { parentPort, workerData } = require("node:worker_threads");
(async () => {
  const pdfjs = await import(workerData.modul);
  const doc = await pdfjs.getDocument({ data: new Uint8Array(workerData.podatki), isEvalSupported: false, disableFontFace: true, useSystemFonts: false, stopAtErrors: false, verbosity: 0 }).promise;
  const n = Math.min(doc.numPages, workerData.najvec);
  const strani = [];
  for (let i = 1; i <= n; i++) {
    const page = await doc.getPage(i);
    const tc = await page.getTextContent();
    const vrstice = [];
    let cur = "";
    let y = null;
    for (const it of tc.items) {
      if (typeof it.str !== "string") continue;
      const iy = it.transform ? Math.round(it.transform[5]) : y;
      if (y !== null && iy !== null && Math.abs(iy - y) > 2 && cur) { vrstice.push(cur); cur = ""; }
      cur += it.str;
      y = iy;
      if (it.hasEOL) { vrstice.push(cur); cur = ""; }
    }
    if (cur) vrstice.push(cur);
    strani.push({ stran: i, vrstice });
    page.cleanup();
  }
  parentPort.postMessage({ ok: true, strani, skupaj: doc.numPages });
  await doc.destroy();
})().catch((e) => parentPort.postMessage({ ok: false, napaka: String(e && e.name || e) }));
`;

export function beriPdf(buf, { ms = MEJE_UVOZA.pdfMs } = {}) {
  const modul = new URL("../../node_modules/pdfjs-dist/legacy/build/pdf.mjs", import.meta.url).href;
  return new Promise((resolve, reject) => {
    const w = new Worker(PDF_NIT, { eval: true, workerData: { modul, podatki: buf, najvec: MEJE_UVOZA.strani }, resourceLimits: { maxOldGenerationSizeMb: 256 } });
    const ura = setTimeout(() => {
      w.terminate();
      reject(new NapakaUvoza("uvoz_pdf_cas", "Branje PDF je trajalo predolgo."));
    }, ms);
    w.once("message", (m) => {
      clearTimeout(ura);
      w.terminate();
      if (!m.ok) return reject(new NapakaUvoza(/Password/i.test(m.napaka) ? "uvoz_pdf_geslo" : "uvoz_pdf", /Password/i.test(m.napaka) ? "PDF je zaklenjen z geslom." : "PDF je poškodovan ali ga ni mogoče prebrati."));
      const strani = m.strani.map((s) => ({ stran: s.stran, vrstice: s.vrstice.map((t) => ({ besedilo: t.replace(/\s+/g, " ").trim() })) }));
      resolve({ strani, skupaj: m.skupaj });
    });
    w.once("error", () => {
      clearTimeout(ura);
      reject(new NapakaUvoza("uvoz_pdf", "PDF je poškodovan ali ga ni mogoče prebrati."));
    });
  });
}

// ---------- skupno ----------

export function beriBesedilo(str) {
  const vrstice = String(str)
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((t) => {
      const h = /^(#{1,4})\s+(.*)$/.exec(t);
      if (h) return { besedilo: h[2].trim(), naslov: h[1].length };
      const a = /^\s*(?:[-*•]|\d+[.)])\s+(.*)$/.exec(t);
      if (a) return { besedilo: t.trim(), alineja: true };
      return { besedilo: t.trim() };
    });
  return [{ stran: 1, vrstice }];
}

/**
 * Prebere vir: { strani: [{ stran, vrstice: [{ besedilo, naslov?, alineja?, tabela?, opomba? }] }], opozorila: [] ,
 * brezBesedila: [številke strani] }. Vrže NapakaUvoza (koda uvoz_*) za poškodovano ali nepodprto datoteko.
 */
export async function preberiVir(vrsta, buf) {
  let strani;
  const opozorila = [];
  let brezBesedila = [];
  if (vrsta === "besedilo") strani = beriBesedilo(buf.toString("utf8"));
  else if (vrsta === "word") strani = beriWord(buf);
  else if (vrsta === "powerpoint") strani = beriPowerpoint(buf);
  else if (vrsta === "pdf") {
    const r = await beriPdf(buf);
    if (r.skupaj > MEJE_UVOZA.strani) opozorila.push({ koda: "uvoz_strani", strani: r.skupaj, prebrano: MEJE_UVOZA.strani });
    // Stran z manj kot 20 znaki je verjetno skenirana: prebere jo branje fotografij (PR 3b).
    brezBesedila = r.strani.filter((s) => s.vrstice.map((v) => v.besedilo).join("").replace(/\s/g, "").length < 20).map((s) => s.stran);
    strani = r.strani.filter((s) => !brezBesedila.includes(s.stran));
  } else throw new NapakaUvoza("uvoz_slika", "Fotografije prebere branje zapiskov.");
  // Meja znakov: odreže zadnje vrstice.
  let znakov = 0;
  for (const s of strani) {
    s.vrstice = s.vrstice.filter((v) => {
      znakov += v.besedilo.length;
      return znakov <= MEJE_UVOZA.znakov;
    });
  }
  if (znakov > MEJE_UVOZA.znakov) opozorila.push({ koda: "uvoz_odrezano", znakov: MEJE_UVOZA.znakov });
  return { strani: strani.filter((s) => s.vrstice.some((v) => v.besedilo)), opozorila, brezBesedila };
}

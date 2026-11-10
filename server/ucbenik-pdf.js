// Vnaprej izdelani PDF-ji učbenika (j, 10. 11. 2026: »12 s je preveč«). PDF razreda, poglavja in celega predmeta
// izdela GitHub Actions (.github/workflows/ucbenik-pdf.yml, scripts/ucbenik-pdf.cjs) iz istega pogleda za tisk
// (/ucbenik/…) in jih objavi kot datoteke izdaje »ucbenik-pdf« v repozitoriju (ne v zgodovini gita). Strežnik jih
// po zagonu in nato vsake pol ure prenese na disk ob bazi (/var/data/ucbenik-pdf) in jih streže na /ucbenik-pdf/…;
// telefon jih samo prenese. Če PDF-ja ni ali ne ustreza sedanjim lekcijam (zgoščena vrednost vsebine), pot
// preusmeri na tisk v brskalniku (/ucbenik/…#natisni), ki ostane rezerva.
//
// Besedilo lekcij je brezplačno in javno (pot /ucbenik je brez prijave, repozitorij je javen), zato so datoteke
// izdaje lahko javne. Strežnik jih vseeno streže sam, za istim skupnim geslom kot /ucbenik (server/gate.js).
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { getPath, topicOrder, slugify } from "./curriculum.js";
import { loadLesson, listBooks, getBook, simsFor } from "./textbook.js";
import { lessonHtml, shell, unitTopics } from "./textbook-print.js";
import { lessonVersion } from "./tisk-predpomnilnik.js";
import { BRAND } from "./brand.js";

export const PDF_TAG = "ucbenik-pdf"; // oznaka izdaje na GitHubu
export const PDF_MANIFEST = "kazalo.json";
export const PDF_MAX_BYTES = 15 * 1024 * 1024; // cilj: razred < 15 MB (večji PDF se ne objavi)

// Nastavitve izdelave PDF (scripts/ucbenik-pdf.cjs). Sprememba tukaj spremeni zgoščeno vrednost predloge, zato
// se vsi PDF-ji izdelajo na novo. Pisavi sta iz paketov npm (devDependencies; skripta ju streže brskalniku sama),
// da je PDF enak na vsakem računalniku: Georgia in system-ui na strežniku za gradnjo ne obstajata. Gelasio ima
// enake mere kot Georgia, Inter je blizu sistemski pisavi. Namenoma nespremenljivi (statični) pisavi: spremenljive
// Chromium vdela kot Type 3 (slabši izris in izbiranje besedila v nekaterih bralnikih). Znake, ki jih pisavi
// nimata (grške črke, puščice, ✓, okvirčki v skicah), da DejaVu Sans; skice v <pre> so v DejaVu Sans Mono.
export const PDF_CSS = `
  @font-face { font-family: "PDF Znaki"; src: url(/__pisave/dejavu/DejaVuSans.ttf) format("truetype"); }
  @font-face { font-family: "PDF Znaki"; font-weight: 700; src: url(/__pisave/dejavu/DejaVuSans-Bold.ttf) format("truetype"); }
  @font-face { font-family: "PDF Mono"; src: url(/__pisave/dejavu/DejaVuSansMono.ttf) format("truetype"); }
  @font-face { font-family: "PDF Mono"; font-weight: 700; src: url(/__pisave/dejavu/DejaVuSansMono-Bold.ttf) format("truetype"); }
  body { font-family: "Gelasio", "PDF Znaki", serif; }
  h1, h2, h3, h4, .brand, .crumb, .toc, .toc-part, .demo-note, .think-label, .formula-label, .key summary, .sheet { font-family: "Inter", "PDF Znaki", sans-serif; }
  pre, code, kbd, samp, tt { font-family: "PDF Mono", monospace; }
  .katex { font-family: KaTeX_Main, "Gelasio", "PDF Znaki", serif; }
  /* Naslov v dveh vrsticah: brez tega Chromium v zaznamku PDF izpusti presledek na prelomu (»skupnivečkratnik«). */
  .lesson h2, .lesson h3, .lesson h4, .part h1, .cover h1 { white-space: pre-wrap; }
  .lesson h3, .lesson h4, .toc-part, .formula-label, .think-label { break-after: avoid; }
  .formula, .think, .demo-note, .katex-display, table, pre, .checks > ol > li, .key li { break-inside: avoid; }
  section { break-inside: auto; }
  p:has(+ ol), p:has(+ ul), p:has(+ table), p:has(+ .formula), p:has(+ pre) { break-after: avoid; }
  p, li { orphans: 2; widows: 2; }
  .katex-display { overflow: visible; }
  /* Ulomek ali potenca v prvi vrstici strani: brez tega vrh števca za las sega čez rob vrstice in se izriše na dnu
     prejšnje strani (odrezan košček formule). Rob 2 px vrstico poveča ravno toliko, da ostane cel na svoji strani. */
  .katex .vlist-t { margin-top: 2px; }
  .toc { padding-left: 0; list-style: none; counter-reset: toc; }
  .toc li { display: flex; align-items: baseline; gap: 6px; counter-increment: toc; break-inside: avoid; }
  .toc li::before { content: counter(toc) "."; min-width: 1.7em; color: #667089; }
  .toc li .muted { font-size: 0.85em; }
  .toc li .toc-pike { flex: 1; border-bottom: 1px dotted #9aa3b8; min-width: 12px; transform: translateY(-3px); }
  .toc li .toc-stran { font-variant-numeric: tabular-nums; font-weight: 600; }
`;
// Paketi pisav (devDependencies): skripta jih streže brskalniku pod /__pisave/<ime>/… iz node_modules.
export const PDF_FONT_DIRS = { gelasio: "@fontsource/gelasio", inter: "@fontsource/inter", dejavu: "dejavu-fonts-ttf/ttf" };
export const PDF_FONTS = [
  ...["400.css", "400-italic.css", "700.css", "700-italic.css"].map((f) => `/__pisave/gelasio/${f}`),
  ...["400.css", "600.css", "700.css", "800.css"].map((f) => `/__pisave/inter/${f}`),
];
// Pisave, ki smejo biti v PDF-ju (pregled): vse drugo pomeni nadomestno pisavo računalnika, ki je PDF izdelal.
// Noga strani (predloga Chromiuma) ne more naložiti pisav s strani, zato zanjo velja sistemska brez serifov.
export const PDF_FONT_REQUIRED = ["Gelasio-Regular", "Inter"];
export const PDF_FONT_NAMES = /^(Gelasio|Inter|KaTeX_|DejaVuSans|LiberationSans|Arimo|Arial)/;
export const PDF_FOOTER = `<div style="width:100%;padding:0 16mm;display:flex;justify-content:space-between;gap:12px;font:7.5pt 'Liberation Sans','DejaVu Sans',Arial,sans-serif;color:#667089">
  <span>Vir: ${BRAND.name} · ${BRAND.domain} · <span class="title"></span></span>
  <span style="white-space:nowrap"><span class="pageNumber"></span> / <span class="totalPages"></span></span>
</div>`;
export const PDF_OPTIONS = { format: "A4", printBackground: true, displayHeaderFooter: true, headerTemplate: "<span></span>", footerTemplate: PDF_FOOTER, outline: true, tagged: true };

const sha = (s) => crypto.createHash("sha256").update(s).digest("hex");

// Zgoščena vrednost predloge: lupina strani, izris poskusne lekcije (Markdown, formule, okvirji, tabela,
// preverjanje) in nastavitve PDF. Spremeni se ob vsaki spremembi videza ali izrisa, ne ob drugih spremembah kode.
const PROBE = {
  meta: {},
  sections: [
    { title: "Razlaga", md: "Besedilo **krepko** in $x^2 + \\frac{1}{2}$.\n\n:::premisli\nZakaj?\n---\nZato.\n:::\n\n| a | b |\n|---|---|\n| $1$ | 2 |\n\n$$E = mc^2$$" },
    { title: "Rešeni primeri", md: "### Primer 1\n**Podatki:** $v = 9\\,\\mathrm{m/s}$\n\n:::formula\n$s = v \\cdot t$\n:::\n\n1. korak" },
  ],
  alternatives: [{ title: "Na sliki", md: "Drugače." }],
  checks: [{ q: "Koliko je $1+1$?", options: ["$2$", "$3$"], correct: 0, why: "Ker." }],
};
let template;
export function pdfTemplateHash() {
  return (template ||= sha(
    [
      shell("T", "C", "", 3),
      lessonHtml({ id: "X-Y-1/poskus", name: "Poskus", unit: "Sklop", goals: "cilji" }, PROBE, 1),
      PDF_CSS,
      JSON.stringify([PDF_FONTS, PDF_FONT_DIRS]),
      JSON.stringify(PDF_OPTIONS),
    ].join("\u0000"),
  ).slice(0, 16));
}

// Cel predmet z več lekcijami (matematika OŠ: 79, SŠ: 60) Chromium ne zmore izrisati v en PDF (zmanjka mu
// pomnilnika: »Printing failed«), zato zanj ostane rezerva; razredi in poglavja teh predmetov so izdelani.
export const PDF_BOOK_MAX_LESSONS = 45;

const unitFile = (key, unit) => `${key}--${slugify(unit).slice(0, 40) || "sklop"}-${sha(unit).slice(0, 6)}`;

// Vsi PDF-ji, ki se izdelajo vnaprej: šolski učbeniki (OŠ, SŠ, tekmovanja) po predmetih, razredih in poglavjih.
// Fakultetni predmeti, posamezne lekcije in listi formul ostanejo pri tisku v brskalniku (lekcija je majhna).
// id: »MAT-OS-8«, »MAT-OS-8?Racionalna števila«, »MAT-OS«. lessons: število lekcij v PDF-ju.
export function pdfTargets() {
  const out = [];
  for (const book of listBooks()) {
    const parts = book.paths.map((p) => ({ p, ready: topicOrder(p.key).filter((t) => loadLesson(t.id)) })).filter((x) => x.ready.length);
    if (parts.length > 1 && parts.reduce((n, x) => n + x.ready.length, 0) <= PDF_BOOK_MAX_LESSONS) out.push({ id: book.key, key: book.key, unit: null, kind: "predmet", base: book.key, lessons: parts.reduce((n, x) => n + x.ready.length, 0), parts: parts.length });
    for (const { p, ready } of parts) {
      out.push({ id: p.key, key: p.key, unit: null, kind: "razred", base: p.key, lessons: ready.length });
      for (const unit of [...new Set(ready.map((t) => t.unit))].filter(Boolean))
        out.push({ id: `${p.key}?${unit}`, key: p.key, unit, kind: "poglavje", base: unitFile(p.key, unit), lessons: ready.filter((t) => t.unit === unit).length });
    }
  }
  return out;
}

// Teme, ki jih PDF vsebuje (enako kot server/textbook-print.js), ali null, če tak PDF ni predviden.
function targetTopics(key, unit) {
  if (unit != null) {
    const topics = unitTopics(key, unit);
    return topics.length ? { topics, label: [unit, getPath(key).label] } : null;
  }
  const p = getPath(key);
  if (p) {
    const all = topicOrder(key);
    const topics = all.filter((t) => loadLesson(t.id));
    return topics.length ? { topics, label: [p.label, all.length] } : null;
  }
  if (String(key).startsWith("P-")) return null; // učbenik študijskega programa: do 67 MB HTML, ostane rezerva
  const book = getBook(key);
  if (!book) return null;
  const all = book.paths.flatMap((x) => topicOrder(x.key));
  const topics = all.filter((t) => loadLesson(t.id));
  if (!topics.length || topics.length > PDF_BOOK_MAX_LESSONS || book.paths.filter((x) => topicOrder(x.key).some((t) => loadLesson(t.id))).length < 2) return null;
  return { topics, label: [book.subjectName, book.schoolName, all.length, book.paths.map((x) => x.label)] };
}

// Zgoščena vrednost vsebine PDF-ja: predloga + naslovi + vse, kar se izriše iz vsake lekcije. Enaka na strežniku
// in pri izdelavi; ko se lekcija ali predloga spremeni, stari PDF ne velja več (rezerva, dokler ni novega).
const hashes = new Map(); // id -> { sig, hash }
export function pdfHash(key, unit = null) {
  const x = targetTopics(key, unit);
  if (!x) return null;
  const id = unit != null ? `${key}?${unit}` : key;
  const lessons = x.topics.map((t) => loadLesson(t.id));
  const sig = `${pdfTemplateHash()}|${lessons.map(lessonVersion).join(",")}`;
  const hit = hashes.get(id);
  if (hit?.sig === sig) return hit.hash;
  const body = x.topics.map((t, i) => [t.id, t.name, t.unit, t.goals || "", simsFor(t.id, lessons[i])[0]?.title || "", lessons[i].sections, lessons[i].alternatives, lessons[i].checks]);
  const hash = sha(JSON.stringify([pdfTemplateHash(), id, x.label, body])).slice(0, 20);
  hashes.set(id, { sig, hash });
  return hash;
}

// Ime datoteke za prenos (Content-Disposition): »Evklid - Matematika, 8. razred.pdf«.
export function pdfDownloadName(key, unit = null) {
  const x = targetTopics(key, unit);
  if (!x) return null;
  const title = unit != null ? `${unit} - ${x.label[1]}` : getPath(key) ? x.label[0] : `${x.label[0]} - ${x.label[1]}`;
  return `${BRAND.name} - ${title}`.replace(/[\\/:*?"<>|\u0000-\u001f]/g, " ").replace(/\s+/g, " ").trim().slice(0, 120) + ".pdf";
}

const defaultUrl = () => process.env.EVKLID_PDF_URL || `https://github.com/${BRAND.repo}/releases/download/${PDF_TAG}`;
const defaultDir = () => process.env.EVKLID_PDF_DIR || path.join(path.dirname(path.resolve(process.env.EVKLID_DB || `data/${BRAND.slug}.db`)), "ucbenik-pdf");
const FILE_RE = /^[A-Za-z0-9][A-Za-z0-9._-]{0,150}\.pdf$/;

// Shramba PDF-jev na disku. find() je sinhron in poceni (stat); sync() prenese kazalo izdaje in manjkajoče datoteke.
// maxBytes: skupna meja na disku (EVKLID_PDF_MB, privzeto 300 MB); minFree: toliko prostora mora ostati bazi in
// varnostnim kopijam (disk na Renderju ima 1 GB).
export function createPdfStore({ dir = defaultDir(), url = defaultUrl(), fetchFn = fetch, maxBytes = (Number(process.env.EVKLID_PDF_MB) || 300) * 1024 * 1024, minFree = 250 * 1024 * 1024, log = console } = {}) {
  let manifest = null; // { files: { id: { file, hash, bytes, sha256 } } }
  let etag = null;
  let running = null;
  const state = { zadnjic: null, napaka: null, datotek: 0, bajtov: 0, veljavnih: 0, predvidenih: 0 };
  try {
    manifest = JSON.parse(fs.readFileSync(path.join(dir, PDF_MANIFEST), "utf8"));
  } catch {}

  const entryFor = (key, unit) => {
    const id = unit != null ? `${key}?${unit}` : key;
    const e = manifest?.files?.[id];
    if (!e || !FILE_RE.test(e.file || "")) return null;
    const hash = pdfHash(key, unit);
    return hash && e.hash === hash ? e : null;
  };

  // PDF za sedanjo vsebino ali null (ni izdelan, zastarel ali še ni prenesen).
  function find(key, unit = null) {
    const e = entryFor(key, unit);
    if (!e) return null;
    const file = path.join(dir, e.file);
    const st = fs.statSync(file, { throwIfNoEntry: false });
    if (!st || st.size !== e.bytes) return null;
    return { file, name: e.file, hash: e.hash, bytes: e.bytes, pages: e.pages || null };
  }

  const freeBytes = () => {
    try {
      const s = fs.statfsSync(dir);
      return s.bavail * s.bsize;
    } catch {
      return Infinity;
    }
  };

  async function download(e) {
    const tmp = path.join(dir, `.${e.file}.${process.pid}.del`);
    try {
      const r = await fetchFn(`${url}/${e.file}`, { signal: AbortSignal.timeout(120_000), redirect: "follow" });
      if (!r.ok || !r.body) throw new Error(`HTTP ${r.status}`);
      const h = crypto.createHash("sha256");
      let n = 0;
      await pipeline(
        Readable.fromWeb(r.body),
        async function* (src) {
          for await (const chunk of src) {
            n += chunk.length;
            if (n > e.bytes) throw new Error("datoteka je večja od napovedane");
            h.update(chunk);
            yield chunk;
          }
        },
        fs.createWriteStream(tmp),
      );
      if (n !== e.bytes || h.digest("hex") !== e.sha256) throw new Error("velikost ali kontrolna vsota se ne ujema");
      const head = Buffer.alloc(5);
      const fd = fs.openSync(tmp, "r");
      fs.readSync(fd, head, 0, 5, 0);
      fs.closeSync(fd);
      if (head.toString("latin1") !== "%PDF-") throw new Error("ni PDF");
      fs.renameSync(tmp, path.join(dir, e.file));
    } catch (err) {
      fs.rmSync(tmp, { force: true });
      throw err;
    }
  }

  async function syncOnce() {
    fs.mkdirSync(dir, { recursive: true });
    const r = await fetchFn(`${url}/${PDF_MANIFEST}`, { headers: etag && manifest ? { "If-None-Match": etag } : {}, signal: AbortSignal.timeout(30_000), redirect: "follow" });
    if (r.status === 404) throw new Error("kazalo PDF-jev še ni objavljeno");
    if (r.status !== 304) {
      if (!r.ok) throw new Error(`kazalo: HTTP ${r.status}`);
      const m = await r.json();
      if (!m || typeof m.files !== "object") throw new Error("kazalo ni veljavno");
      manifest = m;
      etag = r.headers.get("etag");
      fs.writeFileSync(path.join(dir, PDF_MANIFEST), JSON.stringify(m));
    }
    // Veljavni vnosi (ustrezajo sedanjim lekcijam); razredi pred poglavji in predmeti, če zmanjka prostora.
    const order = { razred: 0, poglavje: 1, predmet: 2 };
    const targets = pdfTargets().sort((a, b) => order[a.kind] - order[b.kind]);
    const keep = new Set([PDF_MANIFEST]);
    let total = 0;
    let valid = 0;
    let got = 0;
    let failed = null;
    for (const t of targets) {
      const e = entryFor(t.key, t.unit);
      if (!e || !/^[0-9a-f]{64}$/.test(e.sha256 || "") || !(e.bytes > 0) || e.bytes > PDF_MAX_BYTES) continue;
      valid++;
      if (total + e.bytes > maxBytes) continue;
      const st = fs.statSync(path.join(dir, e.file), { throwIfNoEntry: false });
      if (st?.size === e.bytes) {
        keep.add(e.file);
        total += e.bytes;
        continue;
      }
      if (freeBytes() - e.bytes < minFree) {
        failed ||= "premalo prostora na disku";
        continue;
      }
      try {
        await download(e);
        keep.add(e.file);
        total += e.bytes;
        got++;
      } catch (err) {
        failed ||= `${e.file}: ${err?.message || err}`;
      }
    }
    // Stare različice in ostanki prekinjenih prenosov.
    for (const f of fs.readdirSync(dir)) if (!keep.has(f) && (f.endsWith(".pdf") || f.endsWith(".del"))) fs.rmSync(path.join(dir, f), { force: true });
    Object.assign(state, { zadnjic: new Date().toISOString(), napaka: failed, datotek: keep.size - 1, bajtov: total, veljavnih: valid, predvidenih: targets.length });
    if (got) log.log(`[evklid] PDF učbenika: prenesenih ${got}, na disku ${keep.size - 1} (${Math.round(total / 1e6)} MB)`);
    if (failed) log.warn(`[evklid] PDF učbenika: ${failed}`);
    return got;
  }

  // Naenkrat teče en prenos; napaka (ni omrežja, ni izdaje) ne podre strežnika, ostane rezerva.
  function sync() {
    return (running ||= syncOnce()
      .catch((err) => {
        Object.assign(state, { zadnjic: new Date().toISOString(), napaka: String(err?.message || err) });
        return 0;
      })
      .finally(() => (running = null)));
  }

  return { dir, url, find, sync, status: () => ({ ...state }) };
}

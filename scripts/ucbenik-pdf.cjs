// Izdela PDF-je učbenika vnaprej (server/ucbenik-pdf.js; j, 10. 11. 2026): za vsak predmet, razred in poglavje
// šolskega učbenika odpre isti pogled za tisk kot brskalnik (/ucbenik/…), ga s Chromiumom shrani kot PDF
// (pisave iz repozitorija, noga z virom in številko strani, kazalo s številkami strani, zaznamki) in vsak PDF
// samodejno pregleda. PDF, ki pregleda ne prestane, ne pride v kazalo (kazalo.json), zato zanj ostane rezerva.
//
//   node scripts/ucbenik-pdf.cjs --out <mapa> [--samo MAT-OS-8,"MAT-OS-8?Racionalna števila"] [--vrsta razred,poglavje,predmet]
//        [--prejsnje <kazalo.json>]   že objavljeni PDF-ji z enako zgoščeno vrednostjo se ne izdelajo znova
//        [--obstojece <seznam.txt>]   imena datotek, ki so še objavljena (vnos brez datoteke se izdela znova)
//        [--vse]                      izdelaj vse, tudi nespremenjene
//        [--strogo]                   manjkajoče orodje (pdftoppm, qpdf) je napaka (CI); sicer se korak preskoči
// Izhod: <mapa>/<ime>.<zgoščena vrednost>.pdf, <mapa>/kazalo.json, <mapa>/porocilo.json. Koda 1, če kateri PDF pade.
// Potrebuje Playwright s Chromiumom, pdftoppm (poppler-utils) in qpdf. V CI: .github/workflows/ucbenik-pdf.yml.
const { spawn } = require("node:child_process");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const net = require("node:net");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const ROOT = path.join(__dirname, "..");
const esm = (f) => import(pathToFileURL(path.join(ROOT, f)).href);

const freePort = () =>
  new Promise((resolve, reject) => {
    const s = net.createServer();
    s.listen(0, () => {
      const { port } = s.address();
      s.close(() => resolve(port));
    });
    s.on("error", reject);
  });

async function startServer() {
  const port = await freePort();
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-pdf-"));
  const env = { ...process.env, PORT: String(port), EVKLID_MOCK: "1", EVKLID_NEWS: "0", EVKLID_DB: path.join(dir, "t.db"), EVKLID_PASSWORD: "", ANTHROPIC_API_KEY: "", RESEND_API_KEY: "", STRIPE_SECRET_KEY: "", EVKLID_TISK_PREDGREJ: "0", EVKLID_PDF: "0", EVKLID_BACKUPS: "0" };
  const log = [];
  const srv = spawn(process.execPath, ["--disable-warning=ExperimentalWarning", "server/index.js"], { cwd: ROOT, env, stdio: ["ignore", "pipe", "pipe"] });
  srv.stdout.on("data", (d) => log.push(String(d)));
  srv.stderr.on("data", (d) => log.push(String(d)));
  const base = `http://localhost:${port}`;
  for (let i = 0; i < 200; i++) {
    try {
      if ((await fetch(base + "/healthz")).ok) return { base, stop: () => (srv.kill(), fs.rmSync(dir, { recursive: true, force: true })) };
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  srv.kill();
  throw new Error(`strežnik se ni zagnal:\n${log.join("")}`);
}

let pdfjsLib;
async function openPdf(buf) {
  pdfjsLib ||= await import("pdfjs-dist/legacy/build/pdf.mjs");
  return pdfjsLib.getDocument({ data: new Uint8Array(buf), useSystemFonts: false, disableFontFace: true, fontExtraProperties: true, verbosity: 0, standardFontDataUrl: path.join(ROOT, "node_modules/pdfjs-dist/standard_fonts/") }).promise;
}
const norm = (s) => String(s).normalize("NFKC").replace(/[­​]/g, "").replace(/\s+/g, " ").trim();
async function pageText(page) {
  const tc = await page.getTextContent();
  let s = "";
  for (const it of tc.items) s += it.str + (it.hasEOL ? "\n" : "");
  return s;
}
async function destPage(doc, dest) {
  const d = typeof dest === "string" ? await doc.getDestination(dest) : dest;
  if (!Array.isArray(d) || !d[0]) return null;
  try {
    return (await doc.getPageIndex(d[0])) + 1;
  } catch {
    return null;
  }
}
// Notranje povezave (kazalo) po vrsti: [{ page, to }] (stran, na kateri je povezava, in ciljna stran).
async function internalLinks(doc, maxPage) {
  const out = [];
  for (let i = 1; i <= Math.min(maxPage, doc.numPages); i++) {
    const page = await doc.getPage(i);
    const anns = (await page.getAnnotations()).filter((a) => a.subtype === "Link" && a.dest);
    anns.sort((a, b) => b.rect[3] - a.rect[3] || a.rect[0] - b.rect[0]);
    for (const a of anns) out.push({ page: i, to: await destPage(doc, a.dest) });
  }
  return out;
}

// Kar stran za tisk vsebuje (pričakovano stanje za pregled PDF-ja).
const READ_DOM = () => {
  const text = (el) => {
    const c = el.cloneNode(true);
    c.querySelectorAll(".katex, .katex-display").forEach((k) => k.replaceWith(" "));
    return c.textContent.replace(/\s+/g, " ").trim();
  };
  // Neizrisan Markdown (tabela, krepko, ograja bloka) zunaj skic <pre> in formul.
  const plain = document.querySelector("main").cloneNode(true);
  plain.querySelectorAll("pre, code, .katex").forEach((x) => x.replaceWith(" "));
  const rawMd = (plain.textContent.match(/\|\s*:?-{3,}:?\s*\||\*\*\S[^*\n]{0,30}|^\s*:::.*|\$[^$\n]{1,40}\$/gm) || []).slice(0, 5);
  return {
    rawMd,
    title: document.title,
    errors: document.querySelectorAll(".katex-error").length,
    formulas: document.querySelectorAll(".katex").length,
    images: document.querySelectorAll("main img, main svg:not(.katex svg), main canvas, main iframe, main video").length,
    toc: [...document.querySelectorAll(".toc a")].map((a) => a.getAttribute("href").slice(1)),
    parts: [...document.querySelectorAll("section.part h1")].map((h) => h.textContent.trim()),
    lessons: [...document.querySelectorAll("article.lesson")].map((a) => ({
      id: a.id,
      title: a.querySelector("h2").textContent.replace(/\s+/g, " ").trim(),
      sections: [...a.querySelectorAll("h3")].map((h) => text(h)).filter(Boolean),
      text: text(a),
      formulas: a.querySelectorAll(".katex").length,
    })),
  };
};

// Surov zapis v besedilu PDF, ki se ne bi smel videti: LaTeX, ograje blokov, pokvarjen znak.
const RAW = /\\(?:frac|dfrac|sqrt|cdot|mathrm|text|left|right|begin|end|times|quad|,|;)|\$\$|\\\(|\\\[|@@MATH|^:::|�/m;

// Odrezani koščki formul na robu strani: tanek pas črnila tik nad spodnjim (ali tik pod zgornjim) robom vsebine,
// ki ga od ostale vsebine loči prazen pas. Strani pretvori v sive slike s pdftoppm (poppler-utils). Vrne opise napak;
// null, če pdftoppm ni nameščen.
function findSlivers(buf, { dpi = 100, marginMm = 18, sideMm = 16 } = {}) {
  const { spawnSync } = require("node:child_process");
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-rezine-"));
  try {
    fs.writeFileSync(path.join(dir, "a.pdf"), buf);
    const r = spawnSync("pdftoppm", ["-r", String(dpi), "-gray", path.join(dir, "a.pdf"), path.join(dir, "p")], { stdio: "ignore" });
    if (r.error || r.status !== 0) return null;
    const mm = dpi / 25.4;
    const out = [];
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".pgm")).sort();
    files.forEach((f, i) => {
      const img = fs.readFileSync(path.join(dir, f));
      const head = img.subarray(0, 40).toString("latin1").match(/^P5\s+(\d+)\s+(\d+)\s+(\d+)\s/);
      if (!head) return;
      const [W, H] = [Number(head[1]), Number(head[2])];
      const off = head[0].length;
      const x0 = Math.round(sideMm * mm);
      const x1 = W - x0;
      const ink = (y) => {
        for (let x = x0; x < x1; x++) if (img[off + y * W + x] < 160) return true;
        return false;
      };
      const any = (a, b) => {
        for (let y = Math.max(0, a); y < Math.min(H, b); y++) if (ink(y)) return true;
        return false;
      };
      const band = Math.round(1.3 * mm);
      const gap = Math.round(1.5 * mm);
      const bot = Math.round(H - marginMm * mm);
      const top = Math.round(marginMm * mm);
      let y = bot - band;
      while (y < bot + 2 && !ink(y)) y++;
      if (y < bot + 2 && !any(y - gap, y)) out.push(`stran ${i + 1}: odrezan košček vsebine na dnu strani`);
      y = top + band;
      while (y > top - 2 && !ink(y)) y--;
      if (y > top - 2 && !any(y + 1, y + 1 + gap)) out.push(`stran ${i + 1}: odrezan košček vsebine na vrhu strani`);
    });
    return out;
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

// Manjša datoteka in hitrejše odpiranje: qpdf zloži predmete v stisnjene tokove (označen PDF z zaznamki je tako
// ~40 % manjši) in PDF linearizira (»fast web view«: bralnik pokaže prvo stran, preden se prenese vse).
// Vrne nov Buffer; null, če qpdf ni nameščen ali ne uspe.
function optimizePdf(buf) {
  const { spawnSync } = require("node:child_process");
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-qpdf-"));
  try {
    const [a, b] = [path.join(dir, "a.pdf"), path.join(dir, "b.pdf")];
    fs.writeFileSync(a, buf);
    const r = spawnSync("qpdf", ["--object-streams=generate", "--linearize", a, b], { stdio: "ignore" });
    if (r.error || r.status !== 0 || !fs.existsSync(b)) return null;
    if (spawnSync("qpdf", ["--check", b], { stdio: "ignore" }).status !== 0) return null;
    return fs.readFileSync(b);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

// Samodejni pregled PDF-ja. dom = READ_DOM pred izdelavo; tocPages = številke strani, vpisane v kazalo.
async function checkPdf(buf, dom, { domain, maxBytes, tocPages = null, fontNames = null, requiredFonts = null, strict = false }) {
  const errors = [];
  const info = { pages: 0, bytes: buf.length, lessons: 0, fonts: 0, formulas: dom.formulas };
  if (buf.length > maxBytes) errors.push(`velikost ${(buf.length / 1e6).toFixed(1)} MB presega mejo ${(maxBytes / 1e6).toFixed(0)} MB`);
  if (buf.subarray(0, 5).toString("latin1") !== "%PDF-") return { errors: ["ni PDF"], info };
  if (dom.errors) errors.push(`${dom.errors} formul z napako (katex-error)`);
  for (const x of dom.rawMd || []) errors.push(`neizrisan zapis v besedilu: »${x.trim().slice(0, 40)}«`);
  // Prelomi strani ne režejo formul. Brez pdftoppm: napaka v strogem načinu (CI), sicer se pregled preskoči.
  const cut = findSlivers(buf);
  if (cut == null) strict && errors.push("pregled prelomov strani ni mogoč: pdftoppm (poppler-utils) ni nameščen");
  else errors.push(...cut);
  let doc;
  try {
    doc = await openPdf(buf);
  } catch (e) {
    return { errors: [`pdf.js ga ne odpre: ${e.message}`], info };
  }
  const N = (info.pages = doc.numPages);
  const texts = [];
  const fonts = new Map();
  for (let i = 1; i <= N; i++) {
    const page = await doc.getPage(i);
    const t = await pageText(page);
    texts.push(t);
    const footer = new RegExp(`${domain.replace(".", "\\.")}[\\s\\S]*\\b${i}\\s*/\\s*${N}\\s*$`);
    if (!footer.test(t.trim())) errors.push(`stran ${i}: ni noge z virom in številko strani`);
    const bodyLen = norm(t).replace(new RegExp(`Vir: .*${i} / ${N}$`), "").length;
    if (bodyLen < 3) errors.push(`stran ${i}: prazna stran`);
    const m = t.match(RAW);
    if (m) errors.push(`stran ${i}: surov zapis formule ali pokvarjen znak »${m[0]}«`);
    // Pisave: vse vdelane (pdf.js jih naloži iz datoteke, brez nadomestne sistemske pisave).
    const ops = await page.getOperatorList();
    for (let k = 0; k < ops.fnArray.length; k++) {
      if (ops.fnArray[k] !== pdfjsLib.OPS.setFont) continue;
      const name = ops.argsArray[k][0];
      if (fonts.has(name)) continue;
      const f = page.commonObjs.has(name) ? page.commonObjs.get(name) : null;
      fonts.set(name, f);
      if (!f || f.missingFile) errors.push(`stran ${i}: pisava ${f?.name || name} ni vdelana`);
      else if (f.isType3Font || /Type3/i.test(f.type || "")) errors.push(`stran ${i}: pisava ${f.name} je vdelana kot Type 3`);
      else if (fontNames && !fontNames.test(String(f.name).replace(/^[A-Z]{6}\+/, ""))) errors.push(`stran ${i}: nepredvidena (sistemska) pisava ${f.name}`);
    }
    page.cleanup();
  }
  info.fonts = fonts.size;
  // Predvidene pisave so res uporabljene (če se pisava ne naloži, bi besedilo tiho dobilo nadomestno).
  const names = [...fonts.values()].map((f) => String(f?.name || ""));
  for (const need of requiredFonts || []) if (!names.some((n) => n.includes(need))) errors.push(`pisava ${need} ni uporabljena (se ni naložila?)`);
  const all = norm(texts.join("\n"));
  for (const ch of "čšž") if (dom.lessons.some((l) => l.text.includes(ch)) && !all.includes(ch)) errors.push(`v besedilu PDF ni znaka »${ch}« (pisava ali kodiranje)`);

  // Lekcije: zaznamki (iz naslovov h2) po vrsti, vsaka na svoji strani.
  const flat = [];
  const walk = (items) => {
    for (const it of items || []) {
      flat.push(it);
      walk(it.items);
    }
  };
  walk(await doc.getOutline());
  const starts = [];
  let from = 0;
  for (const l of dom.lessons) {
    const at = flat.findIndex((o, k) => k >= from && norm(o.title) === norm(l.title));
    if (at < 0) {
      errors.push(`lekcija »${l.title}« nima zaznamka v PDF`);
      starts.push(null);
      continue;
    }
    from = at + 1;
    starts.push(await destPage(doc, flat[at].dest));
  }
  info.lessons = starts.filter(Boolean).length;
  if (info.lessons !== dom.lessons.length) errors.push(`lekcij v PDF ${info.lessons}, pričakovanih ${dom.lessons.length}`);
  for (let k = 1; k < starts.length; k++) if (starts[k] && starts[k - 1] && starts[k] <= starts[k - 1]) errors.push(`lekcija »${dom.lessons[k].title}« se ne začne na novi strani`);

  // Vsebina vsake lekcije: naslov, vsi razdelki in (skoraj) vse besede besedila so na njenih straneh.
  const words = (s) => new Set(norm(s).toLowerCase().match(/[\p{L}\p{N}]{4,}/gu) || []);
  dom.lessons.forEach((l, k) => {
    if (!starts[k]) return;
    const next = starts.slice(k + 1).find(Boolean);
    const end = next ? next : N + 1;
    const body = norm(texts.slice(starts[k] - 1, Math.max(end - 1, starts[k])).join("\n"));
    const squash = body.replace(/\s+/g, "");
    if (!squash.includes(norm(l.title).replace(/\s+/g, ""))) errors.push(`»${l.title}«: naslova ni na strani ${starts[k]}`);
    for (const s of l.sections) if (!squash.includes(norm(s).replace(/\s+/g, ""))) errors.push(`»${l.title}«: manjka razdelek »${s}«`);
    const have = words(body);
    const want = [...words(l.text)];
    const missing = want.filter((w) => !have.has(w) && !squash.toLowerCase().includes(w));
    if (missing.length > Math.max(2, want.length * 0.01)) errors.push(`»${l.title}«: v PDF manjka ${missing.length} od ${want.length} besed (npr. ${missing.slice(0, 5).join(", ")})`);
  });

  // Kazalo: vsaka povezava vodi na stran svoje lekcije in vpisana številka strani je prava.
  if (dom.toc.length) {
    const first = starts.find(Boolean) || N;
    const links = (await internalLinks(doc, first - 1)).filter((x) => x.to);
    const byId = new Map(dom.lessons.map((l, k) => [l.id, starts[k]]));
    if (links.length !== dom.toc.length) errors.push(`kazalo: ${links.length} delujočih povezav, pričakovanih ${dom.toc.length}`);
    else
      dom.toc.forEach((id, k) => {
        if (links[k].to !== byId.get(id)) errors.push(`kazalo: povezava ${k + 1} (${id}) vodi na stran ${links[k].to}, lekcija je na ${byId.get(id)}`);
        if (tocPages && tocPages[k] !== byId.get(id)) errors.push(`kazalo: pri ${id} piše stran ${tocPages[k]}, lekcija je na ${byId.get(id)}`);
      });
    if (!tocPages) errors.push("kazalo nima številk strani");
    else {
      const tocText = norm(texts.slice(0, first - 1).join(" "));
      for (const n of new Set(tocPages)) if (!new RegExp(`(^|\\D)${n}(\\D|$)`).test(tocText)) errors.push(`kazalo: številka strani ${n} ni izpisana`);
    }
    info.toc = dom.toc.length;
  }
  info.starts = starts;
  await doc.loadingTask.destroy();
  return { errors, info };
}

// Izdela en PDF: prvi prehod določi strani lekcij, drugi jih vpiše v kazalo (ponovi, če se strani premaknejo).
async function renderPdf(context, base, target, cfg) {
  const page = await context.newPage();
  try {
    const q = target.unit != null ? `?poglavje=${encodeURIComponent(target.unit)}` : "";
    const r = await page.goto(`${base}/ucbenik/${target.key}${q}`, { waitUntil: "load", timeout: 180_000 });
    if (!r || r.status() !== 200) throw new Error(`HTTP ${r?.status()}`);
    await page.evaluate(async ({ css, fonts }) => {
      for (const href of fonts) {
        const l = document.createElement("link");
        l.rel = "stylesheet";
        l.href = href;
        document.head.append(l);
        await new Promise((ok, no) => ((l.onload = ok), (l.onerror = () => no(new Error(`pisava ${href}`)))));
      }
      const s = document.createElement("style");
      s.textContent = css;
      document.head.append(s);
      document.getElementById("priprava")?.remove();
      // Ločilo tik za formulo v vrstici ostane ob njej (sicer se pika ali podpičje prelomi samo v novo vrstico).
      for (const k of document.querySelectorAll("main .katex")) {
        if (k.closest(".katex-display")) continue;
        const next = k.nextSibling;
        const m = next?.nodeType === 3 && next.data.match(/^[.,;:!?)\]«“”]+/);
        if (!m) continue;
        const wrap = document.createElement("span");
        wrap.style.whiteSpace = "nowrap";
        k.replaceWith(wrap);
        wrap.append(k, m[0]);
        next.data = next.data.slice(m[0].length);
      }
      // Vse različice pisav naložimo izrecno: tisk ne čaka na pisave, ki se naložijo šele ob prvi rabi.
      await Promise.all([...document.fonts].map((f) => f.load().catch(() => null)));
      await document.fonts.ready;
    }, { css: cfg.PDF_CSS, fonts: cfg.PDF_FONTS });
    await page.emulateMedia({ media: "print" });
    const dom = await page.evaluate(READ_DOM);
    let buf = await page.pdf(cfg.PDF_OPTIONS);
    let tocPages = null;
    if (dom.toc.length) {
      for (let round = 0; round < 4; round++) {
        const doc = await openPdf(buf);
        // Kazalo je pred prvo lekcijo; povezave po vrsti ustrezajo vnosom kazala.
        const links = (await internalLinks(doc, Math.min(doc.numPages, 12))).filter((x) => x.to).slice(0, dom.toc.length);
        await doc.loadingTask.destroy();
        if (links.length !== dom.toc.length) throw new Error(`kazalo: ${links.length} povezav za ${dom.toc.length} lekcij`);
        const pages = links.map((x) => x.to);
        if (tocPages && pages.every((p, i) => p === tocPages[i])) break;
        if (round === 3) throw new Error("kazalo: številke strani se ne ustalijo");
        tocPages = pages;
        await page.evaluate((pages) => {
          document.querySelectorAll(".toc li").forEach((li, i) => {
            li.querySelectorAll(".toc-pike, .toc-stran").forEach((x) => x.remove());
            li.insertAdjacentHTML("beforeend", `<span class="toc-pike"></span><span class="toc-stran">${pages[i]}</span>`);
          });
        }, pages);
        buf = await page.pdf(cfg.PDF_OPTIONS);
      }
    }
    return { buf, dom, tocPages };
  } finally {
    await page.close();
  }
}

// Pisave PDF-ja (server/ucbenik-pdf.js PDF_FONT_DIRS) brskalnik dobi iz node_modules, ne s strežnika aplikacije.
async function servePdfFonts(context, cfg) {
  await context.route("**/__pisave/**", (route) => {
    const m = new URL(route.request().url()).pathname.match(/^\/__pisave\/([a-z0-9-]+)\/((?:files\/)?[A-Za-z0-9._-]+\.(css|woff2|woff|ttf))$/);
    const dir = m && cfg.PDF_FONT_DIRS[m[1]];
    const file = dir ? path.join(ROOT, "node_modules", dir, m[2]) : null;
    if (!file || !fs.existsSync(file)) return route.fulfill({ status: 404, body: "" });
    route.fulfill({ status: 200, contentType: m[3] === "css" ? "text/css" : `font/${m[3]}`, body: fs.readFileSync(file) });
  });
}

async function main() {
  const args = process.argv.slice(2);
  const arg = (n) => (args.indexOf(n) >= 0 ? args[args.indexOf(n) + 1] : null);
  const cfg = await esm("server/ucbenik-pdf.js");
  const { BRAND } = await esm("server/brand.js");
  const out = path.resolve(arg("--out") || "ucbenik-pdf");
  const only = arg("--samo")?.split(",").map((s) => s.trim()).filter(Boolean);
  const kinds = arg("--vrsta")?.split(",");
  let prev = {};
  try {
    if (arg("--prejsnje")) prev = JSON.parse(fs.readFileSync(arg("--prejsnje"), "utf8")).files || {};
  } catch {}
  const all = args.includes("--vse");
  const strict = args.includes("--strogo");
  // Imena datotek, ki so še objavljena: prejšnji vnos velja le, če njegova datoteka še obstaja.
  let existing = null;
  try {
    if (arg("--obstojece")) existing = new Set(fs.readFileSync(arg("--obstojece"), "utf8").split("\n").map((x) => x.trim()).filter(Boolean));
  } catch {}
  if (existing) for (const [id, e] of Object.entries(prev)) if (!existing.has(e.file)) delete prev[id];
  fs.mkdirSync(out, { recursive: true });
  const targets = cfg.pdfTargets().filter((t) => (!only || only.includes(t.id)) && (!kinds || kinds.includes(t.kind)));
  if (only) for (const id of only) if (!targets.some((t) => t.id === id)) throw new Error(`neznan PDF: ${id}`);
  const { chromium } = require("playwright");
  const server = await startServer();
  const browser = await chromium.launch();
  const context = await browser.newContext();
  await servePdfFonts(context, cfg);
  const files = {};
  const report = [];
  let failed = 0;
  try {
    for (const t of targets) {
      const hash = cfg.pdfHash(t.key, t.unit);
      const old = prev[t.id];
      if (old && old.hash === hash && !only && !all && (!existing || existing.has(old.file))) {
        files[t.id] = old;
        report.push({ id: t.id, stanje: "nespremenjen", ...old });
        continue;
      }
      const t0 = Date.now();
      let res;
      try {
        const made = await renderPdf(context, server.base, t, cfg);
        const { dom, tocPages } = made;
        const small = optimizePdf(made.buf);
        const buf = small || made.buf;
        const { errors, info } = await checkPdf(buf, dom, { domain: BRAND.domain, maxBytes: cfg.PDF_MAX_BYTES, tocPages, fontNames: cfg.PDF_FONT_NAMES, requiredFonts: cfg.PDF_FONT_REQUIRED, strict });
        if (!small && strict) errors.push("qpdf ni nameščen ali ni uspel (stiskanje in linearizacija)");
        if (dom.lessons.length !== t.lessons) errors.push(`stran za tisk ima ${dom.lessons.length} lekcij, razred jih ima ${t.lessons}`);
        const file = `${t.base}.${hash}.pdf`;
        res = { id: t.id, vrsta: t.kind, file, hash, bytes: buf.length, pages: info.pages, lessons: info.lessons, formulas: info.formulas, fonts: info.fonts, images: dom.images, ms: Date.now() - t0, errors };
        fs.writeFileSync(path.join(out, (errors.length ? "NAPAKA-" : "") + file), buf);
        if (!errors.length) files[t.id] = { file, hash, bytes: buf.length, sha256: crypto.createHash("sha256").update(buf).digest("hex"), pages: info.pages, lessons: info.lessons, title: dom.title };
      } catch (e) {
        res = { id: t.id, vrsta: t.kind, hash, ms: Date.now() - t0, errors: [`izdelava ni uspela: ${e.message}`] };
      }
      res.stanje = res.errors.length ? "NAPAKA" : "izdelan";
      if (res.errors.length) failed++;
      report.push(res);
      console.log(`${res.stanje.padEnd(8)} ${t.id} · ${res.pages ?? "?"} strani · ${res.bytes ? (res.bytes / 1e6).toFixed(2) : "?"} MB · ${(res.ms / 1000).toFixed(1)} s${res.errors.length ? `\n   - ${res.errors.slice(0, 12).join("\n   - ")}` : ""}`);
    }
  } finally {
    await browser.close();
    server.stop();
  }
  // Kazalo vsebuje samo PDF-je, ki so prestali pregled; pri delni izdelavi (--samo, --vrsta) ohrani ostale prejšnje.
  if (only || kinds) for (const [id, e] of Object.entries(prev)) files[id] ||= e;
  fs.writeFileSync(path.join(out, cfg.PDF_MANIFEST), JSON.stringify({ v: 1, izdelano: new Date().toISOString(), predloga: cfg.pdfTemplateHash(), files }, null, 1));
  fs.writeFileSync(path.join(out, "porocilo.json"), JSON.stringify(report, null, 1));
  const made = report.filter((r) => r.stanje === "izdelan");
  console.log(`\nIzdelanih ${made.length}, nespremenjenih ${report.filter((r) => r.stanje === "nespremenjen").length}, z napako ${failed}; novih ${(made.reduce((s, r) => s + r.bytes, 0) / 1e6).toFixed(1)} MB.`);
  process.exitCode = failed ? 1 : 0;
}

module.exports = { findSlivers, optimizePdf, checkPdf, renderPdf, startServer, servePdfFonts, READ_DOM };
if (require.main === module) main().catch((e) => (console.error(e), process.exit(1)));

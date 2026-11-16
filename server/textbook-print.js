// Učbenik za tiskanje oziroma shranjevanje kot PDF (brezplačno, brez prijave).
// Strežnik izriše HTML z že izrisanimi formulami; brskalnik ga shrani kot PDF.
import zlib from "node:zlib";
import katex from "katex";
import { marked } from "marked";
import { getPath, getTopic, topicOrder } from "./curriculum.js";
import { loadLesson, simsFor, expandFormulaBlocks, getBook, formulaSheet, formulaSheetSections } from "./textbook.js";
import { lessonVersion } from "./tisk-predpomnilnik.js";
import { splitFormulaCells } from "../public/rich.js";
import { obrnjenaTabela, oznaciStolpce, vodoravnaTabela } from "../public/vodoravna-tabela.js";
import { BRAND } from "./brand.js";

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// Enako kot renderRich v brskalniku: formule umaknemo, izrišemo Markdown, vrnemo formule.
// Vsebina prihaja iz datotek v repozitoriju, zato je ne čistimo dodatno.
// output: "html" = samo vidni del formul (brez MathML, ki ga tisk ne potrebuje: PDF učbenika MAT-OS-8 v Chromu
// 28 s → 6 s, enak izpis); privzeto htmlAndMathml (aplikacija, bralniki zaslona).
// Absolutna vrednost negativnega števila: v »|-11|« TeX (in KaTeX) minus za navpičnico razume kot odštevanje in
// izpiše »| − 11|«. Za tisk minus tik za ODPIRALNO navpičnico (soda po vrsti v formuli) zapišemo kot predznak
// »|{-}11|«; »|a|-|b|« ostane odštevanje. Spremeni se samo razmik.
export function absMinus(tex) {
  let open = true;
  return tex.replace(/\\[a-zA-Z]+|\\.|\|(\s*)-|\|/g, (m, sp) => {
    if (m[0] === "\\") return m;
    const wasOpen = open;
    open = !open;
    return m.length > 1 && wasOpen ? `|${sp}{-}` : m;
  });
}

export function renderMd(text, output = "htmlAndMathml") {
  const math = [];
  const stash = (tex, display) => `@@MATH${math.push({ tex, display }) - 1}@@`;
  const src = expandFormulaBlocks(text, "print")
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, t) => stash(t, true))
    .replace(/(^|[^\\$])\$([^$\n]+?)\$/g, (_, pre, t) => pre + stash(t, false));
  return marked
    .parse(splitFormulaCells(src, math), { breaks: true })
    // Formula v svoji vrstici sredi odstavka: prelom vrstice pred in za njo bi dodal prazno vrstico.
    .replace(/(?:<br\s*\/?>\s*)*@@MATH(\d+)@@(?:\s*<br\s*\/?>)*/g, (m, i) => (math[i].display ? `@@MATH${i}@@` : m))
    .replace(/@@MATH(\d+)@@/g, (_, i) => katex.renderToString(output === "html" ? absMinus(math[i].tex) : math[i].tex, { displayMode: math[i].display, throwOnError: false, strict: "ignore", output }))
    // Vodoravna tabela (atomske mase, gostote …) se na ozkem zaslonu prelomi v več vrstic namesto pomika vstran.
    .replace(/<table>([\s\S]*?)<\/table>/g, (m, inner) => {
      const vod = vodoravnaTabela(inner);
      if (vod) return vod;
      const obrnjena = obrnjenaTabela(inner);
      if (obrnjena) return `<div class="md-obrni"><div class="md-obrni-siroka">${m}</div><div class="md-obrni-ozka"><table>${obrnjena}</table></div></div>`;
      const oznacena = oznaciStolpce(inner);
      return oznacena ? `<table class="md-stolpci">${oznacena}</table>` : m;
    });
}

const demoFor = (topicId, lesson) => simsFor(topicId, lesson)[0] || null;

const md = (text) => renderMd(text, "html");

// Opomba namesto simulacije, ki je v tisku ni. Neposredne povezave do lekcije aplikacija nima; povezava odpre Učbenik.
const APP_LINK = `https://${BRAND.domain}/?pogled=textbook`;
const simNote = (text) =>
  `<aside class="demo-note">${text} <a href="${APP_LINK}">${esc(BRAND.domain)}</a> → Učbenik → ta lekcija.</aside>`;
// Odstavek, ki bralca pošlje k simulaciji »spodaj« (v aplikaciji je pod besedilom): za njim jasna opomba.
const SIM_REF = /(<p>(?:(?!<\/p>)[\s\S])*?simulacij[a-zčšž]* spodaj(?:(?!<\/p>)[\s\S])*?<\/p>)/gi;

export function lessonHtml(t, lesson, n) {
  const demo = demoFor(t.id, lesson);
  const sections = lesson.sections
    .map((s) => {
      const html = md(s.md).replace(SIM_REF, (m) => `${m}\n${simNote("Simulacija je v aplikaciji Evklid:")}`);
      const body = `<section>${s.title ? `<h3>${esc(s.title)}</h3>` : ""}${html}</section>`;
      const note = demo && /rešen/i.test(s.title) ? simNote(`Interaktivni poskus »${esc(demo.title)}« je v aplikaciji Evklid:`) : "";
      return body + note;
    })
    .join("");
  const alts = lesson.alternatives.length
    ? `<section class="alts"><h3>Razloži drugače</h3>${lesson.alternatives
        .map((a) => `<div class="alt"><h4>${esc(a.title)}</h4>${md(a.md).replace(SIM_REF, (m) => `${m}\n${simNote("Simulacija je v aplikaciji Evklid:")}`)}</div>`)
        .join("")}</section>`
    : "";
  const letters = "abcdefgh";
  // Rešitve: pravilna možnost z razlago in pri napačnih možnostih, zakaj so napačne (vrstice »~« v lekciji).
  const whyNot = (c) => {
    const rows = c.options.map((_, i) => (i !== c.correct && c.optionWhy?.[i] ? `<li>${md(`*Zakaj ne ${letters[i]})?* ${c.optionWhy[i]}`)}</li>` : "")).join("");
    return rows ? `<ul class="zakaj-ne">${rows}</ul>` : "";
  };
  // Vpiši število: prostor za odgovor; v rešitvah vrednost (s tolerančnim območjem, če ga lekcija navede) in
  // tipične napačne vrednosti z razlago. Razvrsti: elementi premešani z začetnicami, v rešitvah pravi vrstni red.
  const unit = (c) => (c.unit ? ` ${c.unit}` : "");
  const question = (c) =>
    c.type === "stevilo"
      ? `<li>${md(c.q)}<p class="num-blank">Odgovor: ____________${md(unit(c)).replace(/^\s*<p>|<\/p>\s*$/g, "")}</p></li>`
      : c.type === "razvrsti"
        ? `<li>${md(c.q)}<ol class="opts">${c.shown.map((k) => `<li>${md(c.items[k])}</li>`).join("")}</ol></li>`
        : `<li>${md(c.q)}<ol class="opts">${c.options.map((o) => `<li>${md(o)}</li>`).join("")}</ol></li>`;
  const keyRow = (c) => {
    if (c.type === "stevilo") {
      const wrong = c.wrong.filter((w) => w.why).map((w) => `<li>${md(`*Če dobiš ${w.answer}${unit(c)}:* ${w.why}`)}</li>`).join("");
      return `<li><b>${md(`${c.answer}${unit(c)}`).replace(/^\s*<p>|<\/p>\s*$/g, "")}</b> ${c.why ? md(c.why) : ""}${wrong ? `<ul class="zakaj-ne">${wrong}</ul>` : ""}</li>`;
    }
    if (c.type === "razvrsti") return `<li><b>${c.items.map((_, i) => `${letters[c.shown.indexOf(i)]})`).join(" → ")}</b> ${c.why ? md(c.why) : ""}</li>`;
    return `<li><b>${letters[c.correct]})</b> ${c.why ? md(c.why) : ""}${whyNot(c)}</li>`;
  };
  const checks = lesson.checks.length
    ? `<section class="checks"><h3>Preveri se</h3><ol>${lesson.checks
        .map(question)
        .join("")}</ol>
        <details open class="key"><summary>Rešitve</summary><ol>${lesson.checks
          .map(keyRow)
          .join("")}</ol></details></section>`
    : "";
  return `<article class="lesson" id="${esc(t.id)}">
    <p class="crumb">${esc(t.unit)}</p>
    <h2>${n ? `${n}. ` : ""}${esc(t.name)}</h2>
    ${t.goals ? `<p class="goals"><b>Cilji:</b> ${esc(t.goals)}</p>` : ""}
    ${sections}${alts}${checks}
  </article>`;
}

const today = () => new Date().toLocaleDateString("sl-SI", { day: "numeric", month: "long", year: "numeric" });
const NOTE = `<p class="muted small">Interaktivni poskusi, simulacije, sprotno preverjanje in vaje so na voljo v aplikaciji Evklid.
        Lekcije, ki jih učitelj še ni pregledal, se lahko še spremenijo.</p>`;

// Celoten učbenik predmeta (npr. MAT-OS): deli so razredi oziroma letniki.
export function printBook(bookKey) {
  const parts = printBookParts(bookKey);
  return parts && joinParts(parts);
}
function printBookParts(bookKey) {
  const book = getBook(bookKey);
  if (!book) return null;
  let n = 0;
  const parts = book.paths.map((p) => {
    const topics = topicOrder(p.key);
    const ready = topics.map((t) => ({ t, lesson: loadLesson(t.id) })).filter((x) => x.lesson);
    return { p, topics, ready };
  });
  const total = parts.reduce((s, x) => s + x.topics.length, 0);
  const have = parts.reduce((s, x) => s + x.ready.length, 0);
  const cover = `<section class="cover">
        <p class="brand">Evkli<span>d</span></p>
        <h1>${esc(book.subjectName)}</h1>
        <p class="sub">Učbenik za ${esc(book.schoolName)}: razlage, rešeni primeri in vprašanja za preverjanje</p>
        <p class="muted">Izdaja ${esc(today())} · ${have} od ${total} tem${have < total ? " (ostale lekcije so v pripravi)" : ""}</p>
        <h2>Kazalo</h2>
        ${parts
          .filter((x) => x.ready.length)
          .map(
            ({ p, ready }) => `<h3 class="toc-part">${esc(p.label)}</h3>
        <ol class="toc">${ready.map(({ t }) => `<li><a href="#${esc(t.id)}">${esc(t.name)}</a> ${t.unit && t.unit !== t.name ? `<span class="muted">${esc(t.unit)}</span>` : ""}</li>`).join("")}</ol>`,
          )
          .join("")}
        ${NOTE}
      </section>`;
  function* body() {
    if (!have) return yield `<p>Za ta učbenik lekcije še nastajajo.</p>`;
    for (const { p, ready } of parts.filter((x) => x.ready.length)) {
      n = 0;
      yield `<section class="part"><p class="brand small">${esc(book.subjectName)}</p><h1>${esc(p.label)}</h1>
            <p class="muted">${ready.length} lekcij</p></section>`;
      for (const { t, lesson } of ready) yield lessonHtml(t, lesson, ++n);
    }
  }
  return shellParts(`${book.subjectName} · ${book.schoolName} · učbenik`, cover, body(), have);
}

// List s formulami in konstantami predmeta (/ucbenik/MAT-OS/formule ali /ucbenik/MAT-OS-8/formule).
export function printFormulas(key) {
  const p = getPath(key);
  const bookKey = p ? `${p.subject}-${p.school}` : key;
  const book = getBook(bookKey);
  const md = formulaSheetSections(bookKey)?.md;
  if (!book || !md) return null;
  const content = `<section class="sheet">
      <p class="brand small">Evkli<span>d</span></p>
      <h1>${esc(book.subjectName)}: formule in konstante</h1>
      <p class="muted">${esc(book.schoolName.charAt(0).toUpperCase() + book.schoolName.slice(1))} · izdaja ${esc(today())}</p>
      ${renderMd(md, "html")}
    </section>`;
  return shell(`${book.subjectName} · ${book.schoolName} · formule in konstante`, content);
}

// Teme enega poglavja (sklopa) poti; unit = naslov sklopa (točno kot v kazalu). Prazno: ni take poti ali poglavja.
export function unitTopics(pathKey, unit) {
  if (!getPath(pathKey) || typeof unit !== "string" || !unit) return [];
  return topicOrder(pathKey).filter((t) => t.unit === unit && loadLesson(t.id));
}

// Podpis strani printPage(pathKey, topicSlug) za predpomnilnik (server/tisk-predpomnilnik.js): datum izdaje in
// različica vsake lekcije, ki jo stran vsebuje (list formul: njegovo besedilo). null: stran ne obstaja.
export function printSignature(pathKey, topicSlug = null, unit = null) {
  const day = today();
  if (unit != null) {
    const topics = unitTopics(pathKey, unit);
    return topics.length ? `${day}|u|${topics.map((t) => lessonVersion(loadLesson(t.id))).join(",")}` : null;
  }
  if (topicSlug === "formule") {
    const p = getPath(pathKey);
    const sheet = formulaSheet(p ? `${p.subject}-${p.school}` : pathKey);
    return sheet == null ? null : `${day}|f|${sheet}`;
  }
  let topics;
  if (getPath(pathKey)) topics = topicSlug ? [getTopic(`${pathKey}/${topicSlug}`)].filter(Boolean) : topicOrder(pathKey);
  else if (topicSlug) return null;
  else topics = getBook(pathKey)?.paths.flatMap((p) => topicOrder(p.key)) ?? null;
  if (!topics || (topicSlug && !topics.length)) return null;
  return `${day}|${topics.map((t) => lessonVersion(loadLesson(t.id))).join(",")}`;
}

// pathKey: cela pot; topicSlug (neobvezno): samo ena lekcija.
export function printPage(pathKey, topicSlug = null, unit = null) {
  const parts = printPageParts(pathKey, topicSlug, unit);
  return parts && joinParts(parts);
}

// Isto kot printPage, a kot zaporedje kosov HTML (lupina, kazalo, nato lekcija za lekcijo) ali null.
// Velik učbenik programa (P-UL-FKKT-KEM: 67 MB) kot en niz dvigne proces na ~700 MB, kar zruši strežnik
// s 512 MB; pot /ucbenik zato pošilja kos za kosom in naenkrat drži v pomnilniku le eno lekcijo.
export function printPageParts(pathKey, topicSlug = null, unit = null) {
  if (unit != null && !topicSlug) {
    // »PDF poglavja«: samo sklop, brez kazala (manjši in hitrejši izris v brskalniku).
    const ready = unitTopics(pathKey, unit).map((t) => ({ t, lesson: loadLesson(t.id) }));
    if (!ready.length) return null;
    function* only() {
      for (const [i, { t, lesson }] of ready.entries()) yield lessonHtml(t, lesson, i + 1);
    }
    return shellParts(`${unit} · ${getPath(pathKey).label}`, "", only(), ready.length);
  }
  if (topicSlug === "formule") {
    const html = printFormulas(pathKey);
    return html && [html];
  }
  const p = getPath(pathKey);
  if (!p) return topicSlug ? null : printBookParts(pathKey);
  let topics = topicOrder(pathKey);
  if (topicSlug) {
    const t = getTopic(`${pathKey}/${topicSlug}`);
    if (!t) return null;
    topics = [t];
  }
  const ready = topics.map((t) => ({ t, lesson: loadLesson(t.id) })).filter((x) => x.lesson);
  if (topicSlug && !ready.length) return null;
  const title = topicSlug ? `${ready[0].t.name} · ${p.label}` : `${p.label} · učbenik`;

  const toc = topicSlug
    ? ""
    : `<section class="cover">
        <p class="brand">Evkli<span>d</span></p>
        <h1>${esc(p.label)}</h1>
        <p class="sub">Učbenik z razlagami, rešenimi primeri in vprašanji za preverjanje</p>
        <p class="muted">Izdaja ${esc(today())} · ${ready.length} od ${topics.length} tem${ready.length < topics.length ? " (ostale lekcije so v pripravi)" : ""}</p>
        <h2>Kazalo</h2>
        <ol class="toc">${ready.map(({ t }) => `<li><a href="#${esc(t.id)}">${esc(t.name)}</a> ${t.unit && t.unit !== t.name ? `<span class="muted">${esc(t.unit)}</span>` : ""}</li>`).join("")}</ol>
        ${NOTE}
      </section>`;

  function* body() {
    if (!ready.length) return yield `<p>Za to pot lekcije še nastajajo.</p>`;
    for (const [i, { t, lesson }] of ready.entries()) yield lessonHtml(t, lesson, topicSlug ? 0 : i + 1);
  }
  return shellParts(title, toc, body(), ready.length);
}

// Groba ocena velikosti izrisa cele poti ali predmeta (bajti HTML) brez izrisa: Markdown lekcij × 27.
// Izmerjeno 7. 11.: HTML/Markdown = 19 (MAT-OS) do 27 (MAT-SS); P-UL-FKKT-KEM 2,8 MB → 67 MB.
export const HTML_PER_MD = 27;
export function printSizeHint(pathKey) {
  const book = getPath(pathKey) ? null : getBook(pathKey);
  const keys = book ? book.paths.map((p) => p.key) : getPath(pathKey) ? [pathKey] : [];
  let md = 0;
  for (const k of keys)
    for (const t of topicOrder(k)) {
      const l = loadLesson(t.id);
      if (!l) continue;
      for (const x of l.sections) md += x.md.length;
      for (const a of l.alternatives) md += a.md.length;
      for (const c of l.checks) md += c.q.length + (c.options || c.items || []).reduce((n, o) => n + o.length, 0) + (c.why?.length || 0);
    }
  return md * HTML_PER_MD;
}

// Pošlje kose v odgovor in počaka, ko je medpomnilnik poln (počasen odjemalec ne kopiči celega učbenika
// v pomnilniku). Ob prekinjeni povezavi neha izrisovati. Med kosi sprosti glavno nit (setImmediate), da drugi
// zahtevki (/healthz, klepet) ne čakajo na izris 67 MB učbenika (pregled #519 B, P2-2).
// encoding: "br" | "gzip" | null – stiskanje sproti (zlib v toku). collect: do toliko bajtov zbira surovo stran in
// jo vrne kot Buffer (za predpomnilnik), sicer (večja stran, prekinitev, napaka) null.
// Napaka med izrisom po že poslanih glavah: na konec strani vidno opozorilo, nato prekinjena povezava (brez
// zaključnega kosa), da brskalnik ne misli, da je stran cela (pregled #519 B, P2-1).
export const STREAM_FAILED_HTML = `<div role="alert" style="margin:24px 0;padding:12px 16px;border:2px solid #b42318;border-radius:10px;background:#fef3f2;color:#7a271a;font:600 1rem system-ui,sans-serif">Učbenika ni bilo mogoče izrisati do konca. Osveži stran ali poskusi pozneje.</div>`;
export async function streamParts(res, parts, { collect = 0, encoding = null } = {}) {
  const it = parts[Symbol.iterator]();
  let kept = collect > 0 ? [] : null;
  let size = 0;
  let out = res;
  if (encoding) {
    res.setHeader("Content-Encoding", encoding);
    // Okno 2^19 (512 KB) namesto privzetih 4 MB: manj pomnilnika na tok (pregled #519 A, P2), stiskanje skoraj enako.
    out = encoding === "br"
      ? zlib.createBrotliCompress({ params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 4, [zlib.constants.BROTLI_PARAM_LGWIN]: 19 } })
      : zlib.createGzip({ level: 6, windowBits: 15, memLevel: 8 });
    out.pipe(res, { end: false });
    out.on("error", () => res.destroy());
  }
  const gone = () => res.destroyed || res.writableEnded;
  // Odjemalec je odšel: takoj sprosti zlib (domorodni pomnilnik), ne šele ob GC.
  const release = () => {
    if (out !== res && !out.destroyed) out.destroy();
  };
  res.once("close", () => {
    if (!res.writableFinished) release();
  });
  const waitDrain = (s) => new Promise((ok) => { const done = () => { s.off("drain", done); res.off("close", done); ok(); }; s.on("drain", done); res.on("close", done); });
  const finish = (s) => new Promise((ok) => (s === res ? ok() : s.once("end", ok)));
  let pending = ""; // kosi se združijo do ~256 KB na zapis (manj klicev write in čakanja na drain)
  let wrote = false;
  const flush = async () => {
    if (!pending) return;
    const chunk = Buffer.from(pending);
    pending = "";
    wrote = true;
    if (kept) {
      size += chunk.length;
      if (size > collect) kept = null;
      else kept.push(chunk);
    }
    if (!out.write(chunk)) await waitDrain(out);
  };
  try {
    for (let r = it.next(); !r.done; r = it.next()) {
      if (gone()) return release(), null;
      pending += r.value;
      if (pending.length >= 256 * 1024) await flush();
      await new Promise((ok) => setImmediate(ok));
    }
    if (gone()) return release(), null;
    await flush();
    if (gone()) return release(), null;
    if (out !== res) {
      out.end();
      await finish(out);
    }
    res.end();
    return kept && Buffer.concat(kept);
  } catch (err) {
    console.error("[evklid] izris učbenika po kosih:", err?.message || err);
    if (gone()) return release(), null;
    // Napaka še pred prvim poslanim bajtom: navadna napaka (500), ne 200 z opozorilom.
    if (!res.headersSent && !wrote && !pending) {
      release();
      res.removeHeader("Content-Encoding");
      throw err;
    }
    pending += STREAM_FAILED_HTML;
    try {
      await flush();
      if (out !== res) {
        out.end();
        await finish(out);
      }
    } catch {}
    // Brez zaključnega kosa: odjemalec vidi prekinjen prenos (ne cele strani).
    if (res.socket?.destroySoon) res.socket.destroySoon();
    else res.destroy();
    return null;
  } finally {
    it.return?.();
  }
}

const joinParts = (parts) => {
  let html = "";
  for (const part of parts) html += part;
  return html;
};

// Lupina okoli kosov vsebine: začetek, kosi (iterator), konec.
function* shellParts(title, head, body, total = 0) {
  const mark = "<\u0000>"; // esc() v naslovu spremeni »<« v &lt;, zato se oznaka pojavi samo v <main>
  const page = shell(title, mark, "", total);
  const at = page.indexOf(mark);
  const [start, end] = [page.slice(0, at), page.slice(at + mark.length)];
  yield start + head;
  yield* body;
  yield end;
}

// Pregrada »Pripravljam učbenik …« (besedila slovensko; druge jezike vstavi public/ucbenik-priprava.js iz
// public/i18n/ui/<jezik>.json, jezik je v ?l=). total = število lekcij na strani (za napredek).
const PRIPRAVA = (total) => `
<div class="priprava" id="priprava" role="status" aria-live="polite" data-skupaj="${total}">
  <h1 class="p-naslov">Pripravljam učbenik …</h1>
  <div class="p-trak" aria-hidden="true"><i></i></div>
  <p class="p-stanje">0 od ${total} lekcij</p>
  <p class="p-navodilo" hidden>Ta brskalnik ne zna shraniti PDF-ja. Odpri povezavo v Chromu ali Safariju.</p>
  <div class="p-akcije" hidden><button type="button" class="p-kopiraj">Kopiraj povezavo</button><button type="button" class="p-drugo p-vseeno">Vseeno poskusi</button></div>
  <div class="p-akcije p-varnost" hidden><button type="button" class="p-prikazi">Vseeno prikaži</button></div>
</div>
<script src="/ucbenik-priprava.js"></script>`;

// Skupna lupina strani za tisk (tudi gradiva: povzetek na eni strani, delovni list); css: dodatna pravila.
export function shell(title, content, css = "", total = 0) {
  return `<!doctype html>
<html lang="sl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<link rel="stylesheet" href="/vendor/katex/katex.min.css">
<link rel="stylesheet" href="/risbe.css">
<style>
  :root { color-scheme: light; }
  body { font: 11.5pt/1.55 Georgia, "Times New Roman", serif; color: #1c2233; background: #fff; margin: 0; }
  main { max-width: 760px; margin: 0 auto; padding: 24px 20px 60px; }
  h1, h2, h3, h4, .brand, .bar, .crumb, .toc { font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
  .bar { position: sticky; top: 0; background: #2f6fed; color: #fff; padding: 10px 16px; display: flex; gap: 12px; align-items: center; justify-content: space-between; flex-wrap: wrap; }
  .bar button { font: inherit; font-weight: 700; border: 0; border-radius: 10px; min-height: 44px; padding: 8px 16px; background: #fff; color: #2353d1; cursor: pointer; }
  .cover { page-break-after: always; break-after: page; }
  .brand { font-weight: 800; font-size: 1.4rem; margin: 0; } .brand span { color: #2353d1; }
  .cover h1 { font-size: 2.2rem; margin: 40px 0 6px; }
  .sub { font-size: 1.15rem; }
  .muted { color: #667089; } .small { font-size: 0.9em; }
  .toc li { margin: 4px 0; } .toc a { color: inherit; text-decoration: none; font-weight: 600; }
  .lesson, .part { break-before: page; page-break-before: always; }
  .sheet { font: 9.5pt/1.35 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
  .sheet h1 { font-size: 1.5rem; margin: 2px 0; }
  .sheet h2 { font-size: 1.02rem; margin: 12px 0 4px; color: #2353d1; border-bottom: 2px solid #dde2ec; padding-bottom: 2px; break-after: avoid; }
  .sheet table { width: 100%; margin: 0 0 4px; break-inside: auto; }
  .sheet th:empty, .sheet thead:has(th:empty) { display: none; }
  .sheet td, .sheet th { padding: 2px 6px; vertical-align: middle; }
  .sheet td:first-child { font-weight: 600; white-space: nowrap; }
  .sheet tr { break-inside: avoid; }
  /* Vsaka formula v svoji vrstici; prazna prva celica nadaljuje ime iz vrstice nad njo. */
  td:first-child:empty { border-top-color: transparent; }
  tr:has(+ tr > td:first-child:empty) > td:first-child { border-bottom-color: transparent; }
  .sheet p { margin: 4px 0; }
  /* Vodoravna tabela (public/vodoravna-tabela.js): stolpci, ki se na ozkem zaslonu prelomijo v več vrstic. */
  .md-vod { display: flex; flex-wrap: wrap; row-gap: 6px; width: fit-content; max-width: 100%; margin: 8px 0; padding: 0 1px 1px 0; font-variant-numeric: tabular-nums; break-inside: avoid; }
  .md-vod-st { display: flex; flex-direction: column; margin: 0 -1px -1px 0; border: 1px solid #ccd3e0; text-align: center; }
  .md-vod-c { display: flex; align-items: center; justify-content: center; min-height: 1.9em; padding: 2px 6px; }
  .md-vod-c + .md-vod-c { border-top: 1px solid #ccd3e0; }
  .md-vod-c:last-child { flex: 1 0 auto; }
  .md-vod-v { min-height: 2.6em; }
  .md-vod-h { background: #eef2f9; } .md-vod-h, .md-vod-leg { font-weight: 700; }
  /* Vodoravna tabela z več vrsticami vrednosti je na ozkem zaslonu obrnjena (public/vodoravna-tabela.js obrnjenaTabela). */
  .md-obrni { container-type: inline-size; } .md-obrni-ozka { display: none; }
  @container (max-width: 520px) { .md-obrni-siroka { display: none; } .md-obrni-ozka { display: block; } }
  /* Telefon: ime v prvem stolpcu se lahko prelomi; tabela s tremi ali več stolpci (rich.js oznaciStolpce) se zloži
     v kartice: prvi stolpec je naslov, pod njim vsaka vrednost z imenom svojega stolpca. */
  @media screen and (max-width: 600px) {
    .sheet td:first-child { white-space: normal; }
    .sheet table.md-stolpci, .sheet .md-stolpci > tbody, .sheet .md-stolpci > tbody > tr, .sheet .md-stolpci > tbody > tr > td { display: block; }
    .sheet .md-stolpci > thead { display: none; }
    .sheet .md-stolpci > tbody > tr { border: 1px solid #ccd3e0; margin: 0 0 -1px; break-inside: avoid; }
    .sheet .md-stolpci > tbody > tr > td { border: 0; padding: 3px 8px; }
    .sheet .md-stolpci > tbody > tr > td:first-child { background: #eef2f9; }
    .sheet .md-stolpci > tbody > tr > td:empty:not(:first-child) { display: none; }
    .sheet .md-stolpci td[data-label]:not(:first-child, :empty)::before { content: attr(data-label) ": "; color: #667089; font-weight: 600; }
  }
  .part h1 { font-size: 2rem; margin: 30vh 0 6px; } .toc-part { margin: 16px 0 4px; font-size: 1.05rem; }
  .lesson h2 { font-size: 1.6rem; margin: 0 0 6px; }
  .crumb { color: #667089; margin: 0; font-size: 0.9rem; }
  .lesson h3 { font-size: 1.15rem; margin: 22px 0 6px; border-bottom: 2px solid #dde2ec; padding-bottom: 3px; }
  .lesson h4 { margin: 14px 0 4px; }
  table { border-collapse: collapse; margin: 8px 0; font-variant-numeric: tabular-nums; } th, td { border: 1px solid #ccd3e0; padding: 4px 10px; text-align: left; vertical-align: middle; }
  th { background: #eef2f9; font-weight: 700; } tr { break-inside: avoid; } th[align="center"], td[align="center"] { text-align: center; } th[align="right"], td[align="right"] { text-align: right; }
  pre { background: #f3f5f9; padding: 8px; border-radius: 6px; }
  .demo-note { border: 1px dashed #2f6fed; border-radius: 8px; padding: 6px 10px; color: #2353d1; font-family: system-ui, sans-serif; font-size: 0.9rem; margin: 10px 0; }
  .alt { border-left: 3px solid #7b61d1; padding-left: 12px; margin: 10px 0; }
  .think { border-left: 4px solid #e0a100; background: #fbf7ea; padding: 4px 12px; margin: 8px 0; }
  .think-label { margin: 2px 0 0; font: 700 0.78rem system-ui, sans-serif; text-transform: uppercase; letter-spacing: 0.04em; color: #8a6a00; }
  .formula { border: 1px solid #c9d3ea; background: #f3f6fc; border-radius: 8px; padding: 4px 12px; margin: 8px 0; }
  .formula-label { margin: 2px 0 0; font: 700 0.78rem system-ui, sans-serif; text-transform: uppercase; letter-spacing: 0.04em; color: #2353d1; }
  .checks .opts { list-style: lower-alpha; }
  .checks p { margin: 2px 0; }
  .key { margin-top: 10px; font-size: 0.92em; } .key summary { font-weight: 700; font-family: system-ui, sans-serif; }
  /* Razmiki z notranjim robom (padding), ne z zunanjim: zunanji rob se na prelomu strani odreže in vrh prve vrstice
     (strešica velike črke) se je izrisal na dnu prejšnje strani. */
  .key li > p { display: inline; } .key li { margin: 0; padding: 3px 0; }
  .zakaj-ne { list-style: none; margin: 0; padding: 1px 0 3px; color: #4a5468; } .zakaj-ne li { margin: 0; padding: 2px 0 0; }
  .demo-note a { color: inherit; font-weight: 600; }
  .checks .opts li { margin: 3px 0; } .checks .opts li:has(.mfrac) { margin: 8px 0; }
  .katex-display { overflow-x: auto; overflow-y: hidden; }
  section, .alt, li { break-inside: avoid-page; }
  /* Med pripravo (prenos + izris) in v brskalnikih brez tiskanja: pregrada čez vso širino (public/ucbenik-priprava.js). */
  .priprava { display: none; position: fixed; inset: 0; z-index: 10; background: #fff; flex-direction: column; justify-content: center; gap: 12px; padding: 24px 20px; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
  .priprava.p-on { display: flex; }
  .priprava[hidden] { display: none; }
  html:has(.priprava.p-on:not([hidden])) { overflow: hidden; }
  .priprava h1 { font-size: 1.4rem; margin: 0; } .priprava p { margin: 0; }
  .priprava .p-trak { height: 12px; border-radius: 6px; background: #dde2ec; overflow: hidden; }
  .priprava .p-trak i { display: block; height: 100%; width: 3%; background: #2353d1; transition: width .25s; }
  .priprava .p-stanje { color: #667089; }
  .priprava .p-akcije { display: flex; flex-wrap: wrap; gap: 10px; }
  .priprava .p-akcije button { font: inherit; font-weight: 700; min-height: 44px; padding: 8px 18px; border-radius: 10px; border: 2px solid #2353d1; background: #2353d1; color: #fff; cursor: pointer; }
  .priprava .p-akcije button.p-drugo { background: #fff; color: #2353d1; }
  @media print {
    .priprava { display: none; }
    .bar { display: none; }
    main { max-width: none; padding: 0; }
    a { color: inherit; }
    @page { margin: 18mm 16mm; }
  }
${css}
</style></head>
<body>${total ? PRIPRAVA(total) : ""}
<div class="bar"><span>${esc(title)}</span><button type="button">Shrani kot PDF</button></div>
<main>${content}</main>
<script src="/ucbenik-tisk.js"></script>
</body></html>`;
}

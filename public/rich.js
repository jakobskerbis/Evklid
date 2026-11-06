// Izris besedila z Markdownom in formulami (inštruktor, razlage, naloge, lekcije, kartice).
// Knjižnice (marked, KaTeX, DOMPurify) so v brskalniku globalne; testi jih podajo sami.

const lib = (name) => globalThis[name];

// annotate(tex): klikljive formule (formula-info.js) ovijejo znane simbole in enote v \htmlData{fx=…};
// renderMath(tex, display, false) jih izpusti (npr. v gumbih z možnostmi odgovora).
export function createRenderer({ marked = lib("marked"), katex = lib("katex"), sanitize, annotate = null } = {}) {
  const clean = sanitize || ((html) => lib("DOMPurify").sanitize(html));
  const plain = { throwOnError: false, strict: "ignore" };
  const trusted = { ...plain, trust: (c) => c.command === "\\htmlData" };

  // Označena formula, ki je KaTeX ne zna izrisati, se izriše neoznačena (nikoli rdeč surov LaTeX).
  // ctx: poved okoli formule (niz) ali { sentence, block }, da dvoumna črka dobi pomen iz besedila
  // (formula-data.js annotateTex): block je celo besedilo (kartica, naloga, razdelek) z definicijami oznak.
  function renderMath(tex, display, fx = true, ctx = "") {
    try {
      if (annotate && fx) {
        const o = typeof ctx === "string" ? (ctx ? { sentence: ctx } : null) : ctx;
        const annotated = annotate(tex, o);
        if (annotated !== tex) {
          try {
            return katex.renderToString(annotated, { ...trusted, throwOnError: true, displayMode: display });
          } catch { /* spodaj brez oznak */ }
        }
      }
      return katex.renderToString(tex, { ...plain, displayMode: display });
    } catch {
      try {
        return katex.renderToString(tex, { ...plain, displayMode: display });
      } catch {
        return tex;
      }
    }
  }

  function renderRich(text) {
    const math = [];
    const stash = (tex, display) => `@@MATH${math.push({ tex, display }) - 1}@@`;
    // Formule najprej skrijemo, da Markdown ne pokvari \frac, _ ali | v njih (| bi razdelil celico tabele).
    const src = String(text ?? "")
      .replace(/\$\$([\s\S]+?)\$\$/g, (_, t) => stash(t, true))
      .replace(/\\\[([\s\S]+?)\\\]/g, (_, t) => stash(t, true))
      .replace(/\\\((.+?)\\\)/g, (_, t) => stash(t, false))
      .replace(/(^|[^\\$])\$([^$\n]+?)\$/g, (_, pre, t) => pre + stash(t, false));
    const block = String(text ?? "");
    if (annotate) {
      // Formula nazaj v $…$ (odstavek za oznake iz besedila) ali kot TeX (formule v isti povedi).
      const back = (s, asTex) => s.replace(/@@MATH(\d+)@@/g, (mk, i) => (!math[i] ? mk : asTex ? ` ${math[i].tex} ;` : math[i].display ? `$$${math[i].tex}$$` : `$${math[i].tex}$`));
      for (const m of src.matchAll(/@@MATH(\d+)@@/g)) {
        if (!math[m[1]]) continue;
        const para = paragraphAt(src, m.index, m[0].length);
        const raw = rawSentenceAt(src, m[0], m.index);
        math[m[1]].ctx = { sentence: sentenceAt(src, m[0], m.index), sentenceTex: back(raw, true), sentenceMd: back(raw, false), para: back(para, false), block };
      }
    }
    let html = clean(marked.parse(splitFormulaCells(fixTables(src), math), { breaks: true, gfm: true }));
    // Tabela dobi svoj razred (oblika v style.css velja povsod, ne glede na okvir okoli nje);
    // ulomki in potence v njej so v polni velikosti (\displaystyle), sicer so premajhni za branje.
    html = html.replace(/<table>([\s\S]*?)<\/table>/g, (_, body) => {
      const inner = centerNumberColumns(body).replace(/@@MATH(\d+)@@/g, (m, i) =>
        math[i] ? renderMath(math[i].display ? math[i].tex : `\\displaystyle ${math[i].tex}`, math[i].display, true, math[i].ctx) : m,
      );
      return `<div class="md-table-wrap"><table class="md-table">${inner}</table></div>`;
    });
    html = subHeadings(html);
    // Ločilo takoj za vrstično formulo (». , ; : ! ?«) ostane z njo v isti vrstici: pika se ne prelomi sama v novo vrstico
    // (j, 5. 11.: kartica »Zapomni si«). Ne-prelomni ovoj samo za formulo in ločilo, ne za cel stavek.
    return html.replace(/@@MATH(\d+)@@([.,;:!?]+)?/g, (m, i, punct) => {
      if (!math[i]) return m;
      const out = renderMath(math[i].tex, math[i].display, true, math[i].ctx);
      return punct && !math[i].display ? `<span class="fx-nb">${out}${punct}</span>` : out + (punct || "");
    });
  }

  return { renderMath, renderRich };
}

// Poved, v kateri stoji formula (do pike, klicaja, vprašaja ali nove vrstice), brez drugih formul in Markdowna.
// »npr.«, »oz.«, »1. Newtonov« ne končajo povedi; formula sama v vrstici ($$…$$) vzame vrstico pred njo.
const NOT_END = /(?:\d|(?<!\p{L})(?:npr|oz|tj|t\. i|prim|str|št|itn|ipd|gl|pribl|cca|e\.g|i\.e|vs))$/iu;
function splitSentences(text) {
  const out = [];
  let from = 0;
  for (const m of text.matchAll(/[.!?](?=\s|$)|\n/g)) {
    if (m[0] !== "\n" && NOT_END.test(text.slice(Math.max(from, m.index - 8), m.index))) continue;
    out.push(text.slice(from, m.index));
    from = m.index + 1;
  }
  out.push(text.slice(from));
  return out;
}
const cleanSentence = (s) => s.replace(/@@MATH\d+@@/g, " ").replace(/[*_#>`|]/g, " ").replace(/\s+/g, " ").trim();
// Poved s formulo v izvirnem besedilu (z oznakami @@MATHn@@), za formule v isti povedi.
function rawSentenceAt(src, mark, at) {
  const before = splitSentences(src.slice(Math.max(0, at - 300), at));
  const after = splitSentences(src.slice(at + mark.length, at + mark.length + 300));
  return `${before[before.length - 1]} ${mark} ${after[0]}`;
}
// Odstavek s formulo (do prazne vrstice): oznaka iz besedila (»Za $y = 2x$ …«) velja le v njem, ne v celem razdelku.
function paragraphAt(src, at, len) {
  const a = src.lastIndexOf("\n\n", at);
  const b = src.indexOf("\n\n", at + len);
  return src.slice(a < 0 ? 0 : a + 2, b < 0 ? src.length : b);
}

export function sentenceAt(src, mark, at = src.indexOf(mark)) {
  if (at < 0) return "";
  const before = splitSentences(src.slice(Math.max(0, at - 300), at));
  const after = splitSentences(src.slice(at + mark.length, at + mark.length + 300));
  const own = cleanSentence(`${before[before.length - 1]} ${after[0]}`);
  if (own) return own;
  for (let i = before.length - 2; i >= 0; i--) if (cleanSentence(before[i])) return cleanSentence(before[i]);
  return "";
}

// Oštevilčen podnaslov na začetku odstavka (»**1. Imaginarna enota.** Vpeljemo …«) postane svoj
// naslov nad odstavkom, da se loči od besedila (lekcije, razlage; enako na spletu in v aplikaciji).
export function subHeadings(html) {
  // Krepki začetek postane naslov, če je sam v odstavku ali se konča s piko/dvopičjem (»**3. Seštevanje.** …«).
  // »**3. Seštevanje** dveh števil …« je del stavka in ostane v odstavku, sicer bi se stavek pretrgal.
  return html.replace(/<p><strong>(\d{1,2}\.\s[^<]{1,80}?)([.:]?)<\/strong>\s*(?:<br>\s*)?([\s\S]*?)<\/p>/g, (all, title, end, rest) =>
    !end && rest.trim() ? all : `<h3 class="sub-head">${title}</h3>${rest.trim() ? `<p>${rest}</p>` : ""}`,
  );
}

// ---------- tabele ----------

const CELL_RE = /<(td|th)((?:\s[^>]*)?)>([\s\S]*?)<\/\1>/g;
// Celica pred izrisom formul: formule so še oznake @@MATHn@@.
const plainCell = (html) => html.replace(/@@MATH\d+@@/g, "").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
// Stolpec samo s števili ali formulami je sredinsko poravnan (lažje primerjanje vrstic),
// besedilni stolpci ostanejo levo. Poravnava, ki jo zapiše avtor (|:-:|), ima prednost.
// Stolpec z daljšim besedilom (razred »wrap«) se sme prelomiti, da tabela ni preširoka;
// formule se nikoli ne prelomijo.
export function centerNumberColumns(html) {
  const rows = [...html.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((m) => [...m[1].matchAll(CELL_RE)]);
  const body = rows.filter((r) => r.length && r[0][1] === "td");
  if (!body.length) return html;
  const width = Math.max(...rows.map((r) => r.length));
  const center = [];
  for (let c = 0; c < width; c++) {
    const vals = body.map((r) => r[c]).filter(Boolean);
    center[c] = vals.some((v) => v[3].trim()) && vals.every((v) => {
      if (/\salign=/.test(v[2])) return false;
      const raw = v[3].trim();
      if (!raw) return true;
      const onlyMath = /@@MATH\d+@@/.test(raw) && !plainCell(raw);
      return onlyMath || /^[−\-+]?[\d\s.,]+(\s?%|°)?$/.test(plainCell(raw));
    });
  }
  const wrap = [];
  for (let c = 0; c < width; c++) wrap[c] = !center[c] && rows.some((r) => r[c] && plainCell(r[c][3]).length > 28);
  if (!center.some(Boolean) && !wrap.some(Boolean)) return html;
  return html.replace(/<tr>([\s\S]*?)<\/tr>/g, (_, row) => {
    let c = -1;
    return `<tr>${row.replace(CELL_RE, (m, tag, attrs, inner) => {
      c += 1;
      let a = attrs;
      if (center[c] && !/\salign=/.test(a)) a += ' align="center"';
      if (wrap[c]) a += ' class="wrap"';
      return a === attrs ? m : `<${tag}${a}>${inner}</${tag}>`;
    })}</tr>`;
  });
}

// ---------- ena formula v eni celici (j, 2026-10-30) ----------

// Zveza v formuli (enačaj, neenačaj, ekvivalenca …): kos s tako formulo je samostojna formula ali izrek.
const RELATION = /=|<|>|[≈≤≥≠→⇒⇔]|\\(?:le|ge|leq|geq|ne|neq|approx|iff|implies|Rightarrow|Leftrightarrow|to|equiv|sim|simeq|propto|parallel|perp|in|notin|subset|subseteq|rightarrow|longrightarrow|rightleftharpoons)(?![a-zA-Z])/;
// Poimenovana formula (»gorišče $G$«, »alkohol $-OH$«): beseda zunaj formul in oklepajev.
const NAME_WORD = /\p{L}{3,}/u;
const NOT_NAME = /\b(?:npr|tj|oz|ali|in|ter)\b\.?/giu;
const LEAD_SPACE = /^(?:\s|\\[;,:!>]|\\q?quad(?![a-zA-Z])|~)+/;
// Kos, ki nadaljuje stavek (»…, ko $…$«, »…, npr. $…$«), ostane pri formuli pred njim.
const CONTINUES = /^\s*(?:ko|če|kjer|ki|da|ker|dokler|kadar|npr\.|tj\.|oz\.)(?!\p{L})/iu;

// Besedilo celice razdeli pri vejici ali podpičju (s presledkom za njim) zunaj oklepajev in formul.
// Kos brez zveze (»maksimum,«, »$a$,«) se pridruži naslednjemu, zadnji pa prejšnjemu.
function splitCell(cell, isFormula) {
  const parts = [];
  let depth = 0;
  let start = 0;
  for (let k = 0; k < cell.length; k++) {
    if (cell.startsWith("@@MATH", k)) {
      k = cell.indexOf("@@", k + 6) + 1;
      if (k === 0) break;
      continue;
    }
    const ch = cell[k];
    if (ch === "(" || ch === "[") depth++;
    else if ((ch === ")" || ch === "]") && depth > 0) depth--;
    else if (!depth && (ch === "," || ch === ";") && /\s/.test(cell[k + 1] || "")) {
      parts.push({ text: cell.slice(start, k), sep: ch });
      start = k + 1;
    }
  }
  parts.push({ text: cell.slice(start), sep: "" });
  const out = [];
  let carry = "";
  for (const p of parts) {
    const text = carry + p.text;
    if (!carry && out.length && CONTINUES.test(text)) {
      const last = out[out.length - 1];
      last.text += last.sep + text;
      last.sep = p.sep;
    } else if (isFormula(text)) {
      out.push({ text, sep: p.sep });
      carry = "";
    } else carry = text + p.sep;
  }
  if (carry.trim()) {
    if (!out.length) return [cell];
    const last = out[out.length - 1];
    last.text += last.sep + carry;
  }
  return out.map((p) => p.text.trim());
}

/**
 * Dvostolpčna tabela »ime | formule«: vsaka formula ali izrek dobi svojo vrstico (j: »samo ena mala
 * vejica je nejasna«). Nadaljnje vrstice imajo prazno prvo celico; CSS jih poveže z imenom nad njimi.
 * Dela na besedilu, v katerem so formule že oznake @@MATHn@@ (math[n].tex je njihov LaTeX).
 */
export function splitFormulaCells(src, math) {
  const texOf = (n) => math[n]?.tex || "";
  const idsOf = (piece) => [...piece.matchAll(/@@MATH(\d+)@@/g)].map((m) => m[1]);
  const hasRelation = (piece) => idsOf(piece).some((n) => RELATION.test(texOf(n)));
  // Samostojen kos: formula z zvezo ali poimenovana formula (»obroč $m r^2$«). Seznami samih simbolov
  // ali števil (»$2$, $8$, $8$«, ioni, »$a$, $b$ kateti«) in stavki (»kot ob $B$, del kotov ob $A$«)
  // ostanejo skupaj: ime velja le pred pravo formulo ali v celici, ki že ima formule z zvezo.
  const isFormula = (piece, cellRel) => {
    const ids = idsOf(piece);
    if (!ids.length) return false;
    if (hasRelation(piece)) return true;
    let flat = piece.replace(/@@MATH\d+@@/g, " ");
    while (/\([^()]*\)/.test(flat)) flat = flat.replace(/\([^()]*\)/g, " ");
    if (!NAME_WORD.test(flat.replace(NOT_NAME, " "))) return false;
    return cellRel || ids.reduce((n, id) => n + texOf(id).replace(/\s/g, "").length, 0) >= 4;
  };
  const split = (cell) => splitCell(cell, (piece) => isFormula(piece, hasRelation(cell)));
  const lines = String(src).split("\n");
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const head = lines[i];
    const sep = lines[i + 1];
    out.push(head);
    if (sep === undefined || /^\s*>/.test(head) || !isTableRow(head) || !isTableSeparator(sep) || isTableSeparator(head)) continue;
    if (cells(head).length !== 2 || cells(sep).length !== 2) continue;
    out.push(sep);
    const body = [];
    while (i + 2 < lines.length && lines[i + 2].trim() !== "" && isTableRow(lines[i + 2])) body.push(lines[++i + 1]);
    i += 1;
    const rows = body.map((line) => {
      const c = cells(line);
      return { line, c, pieces: c.length === 2 ? split(c[1].trim()) : [] };
    });
    // Tudi prvi stolpec je seznam (kisline | baze): to ni tabela »ime | formule«, ostane kot je.
    if (rows.some((r) => r.c.length === 2 && split(r.c[0].trim()).length > 1)) {
      out.push(...body);
      continue;
    }
    for (const { line, c, pieces } of rows) {
      if (pieces.length < 2) {
        out.push(line);
        continue;
      }
      pieces.forEach((p, k) => {
        // Presledek (\\;) pred formulo je bil ločilo za vejico; v svoji celici ni več potreben.
        const first = /^@@MATH(\d+)@@/.exec(p);
        if (first && math[first[1]]) math[first[1]].tex = math[first[1]].tex.replace(LEAD_SPACE, "");
        out.push(`| ${k ? "" : c[0].trim()} | ${p} |`);
      });
    }
  }
  return out.join("\n");
}

const SEP_CELL = /^\s*:?-{1,}:?\s*$/;

function cells(line) {
  let s = line.trim();
  if (s.startsWith("|")) s = s.slice(1);
  if (s.endsWith("|") && !s.endsWith("\\|")) s = s.slice(0, -1);
  return s.split(/(?<!\\)\|/);
}

/** Vrstica, ki je ločilo glave tabele (npr. »|---|:-:|«). */
export function isTableSeparator(line) {
  if (!/\|/.test(line)) return false; // »---« brez črte je vodoravna črta ali podčrtan naslov
  const c = cells(line);
  return c.length > 0 && c.every((x) => SEP_CELL.test(x));
}

/** Vrstica, ki je (verjetno) del tabele: ima navpično črto zunaj formul. */
export function isTableRow(line) {
  return /\|/.test(String(line).replace(/@@MATH\d+@@/g, "").replace(/\$[^$\n]*\$/g, ""));
}

// Model včasih zapiše tabelo malo po svoje; Markdown jo potem pokaže kot navadno besedilo.
// Popravimo: prazno vrstico pred tabelo (sicer jo seznam ali citat »pogoltne«), zamik vrstic,
// ločilo z drugačnim številom stolpcev kot glava in vrstice z manjkajočo zadnjo črto.
export function fixTables(src) {
  const lines = String(src).split("\n");
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const head = lines[i];
    const sep = lines[i + 1];
    if (sep === undefined || !isTableRow(head) || !isTableSeparator(sep) || isTableSeparator(head)) {
      out.push(lines[i]);
      continue;
    }
    const n = cells(head).length;
    const quote = /^\s*>\s?/.exec(head)?.[0] || "";
    const strip = (l) => (quote && l.startsWith(quote.trimEnd()) ? l.replace(/^\s*>\s?/, "") : l).trim();
    const row = (l) => {
      const c = cells(strip(l)).map((x) => x.trim());
      while (c.length < n) c.push("");
      return `${quote}| ${c.join(" | ")} |`;
    };
    const aligns = cells(strip(sep)).map((x) => x.trim());
    while (aligns.length < n) aligns.push("---");
    if (out.length && out[out.length - 1].trim() !== (quote ? ">" : "") && out[out.length - 1].trim() !== "") out.push(quote ? ">" : "");
    out.push(row(head), `${quote}| ${aligns.slice(0, n).map((a) => (/-/.test(a) ? a : "---")).join(" | ")} |`);
    i += 1;
    while (i + 1 < lines.length && lines[i + 1].trim() !== "" && isTableRow(strip(lines[i + 1]))) {
      out.push(row(lines[i + 1]));
      i += 1;
    }
    if (i + 1 < lines.length && lines[i + 1].trim() !== "") out.push(quote ? ">" : "");
  }
  return out.join("\n");
}

// ---------- med postopnim izpisom ----------

/**
 * Med pretakanjem odgovora skrije, kar bi se izrisalo narobe in nato poskočilo:
 * nedokončano vrstico tabele, glavo tabele brez ločila in nezaprto formulo.
 * Odprte ** in * zapre, da se ne vidijo surove zvezdice.
 */
export function streamSafe(text) {
  let t = String(text ?? "");
  // Nezaprta formula ($ ali $$): pokažemo jo šele, ko je cela.
  const dbl = t.split("$$").length - 1;
  if (dbl % 2) t = t.slice(0, t.lastIndexOf("$$"));
  const singles = [...t.replace(/\$\$[\s\S]*?\$\$/g, (m) => " ".repeat(m.length)).matchAll(/(?<!\\)\$/g)];
  if (singles.length % 2) t = t.slice(0, singles[singles.length - 1].index);

  // Tabela: nedokončana zadnja vrstica in glava, pod katero še ni ločila.
  const lines = t.split("\n");
  const last = lines[lines.length - 1];
  if (last.trim() && isTableRow(last.replace(/^\s*>\s?/, ""))) lines.pop();
  else if (last.trim() && /^\s*(>\s*)?:?-+:?$/.test(last) && lines.length > 1 && isTableRow(lines[lines.length - 2])) lines.pop();
  // Konec je zdaj prazen ali cela vrstica; glava brez ločila še ni tabela.
  let k = lines.length - 1;
  while (k >= 0 && lines[k].trim() === "") k--;
  if (k >= 0 && isTableRow(lines[k]) && !isTableSeparator(lines[k]) && (k === 0 || !isTableRow(lines[k - 1]))) {
    lines.length = k;
  }
  t = lines.join("\n");

  const plain = t.replace(/\$\$[\s\S]*?\$\$|\$[^$\n]*\$/g, "");
  const bold = (plain.match(/\*\*/g) || []).length;
  if (bold % 2) t += "**";
  const single = (plain.replace(/\*\*/g, "").match(/\*/g) || []).length;
  if (single % 2) t += "*";
  return t;
}

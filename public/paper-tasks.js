// Razdelitev prenesene pole na naloge iz besedilne plasti PDF (pdf.js getTextContent), brez DOM-a (test/paper-tasks.test.js).
// Pole RIC številčijo naloge ob levem robu (»1.«, »2.« …); podnaloge ponovijo številko (»1.« + »a)«) ali jo
// razširijo (»1.1«), naloga čez več strani ima številko na vrhu vsake strani. Deli (»A) KRATKE NALOGE«,
// »B) …«) začnejo znova pri 1. Strani brez številk (naslovnica, prazne, slike) ostanejo za ročni okvir.
// Vhod: strani [{ width, height, items: [{ str, transform: [a, b, c, d, x, y], width, height }] }] v enotah PDF
// (y od spodaj). Izhod: naloge [{ n, part, label, text, regions: [{ page, x0, y0, x1, y1 }] }], y od zgoraj.

const HEAD = 60; // glava in noga strani (koda pole, številka strani): ni del naloge
const PAD = 6;
const MARK = /^(\d{1,2})\s?\.(?:\s?(\d{1,2})\.?)?(?=\s|$|[^\d])/;
const SECTION = /^([A-Z])\)\s+\S/;

// Vrstice strani: vodoravni elementi z isto osnovnico, od leve proti desni, od zgoraj navzdol.
export function pageLines(page) {
  const items = (page.items || []).filter((i) => i && typeof i.str === "string" && i.str.trim() && i.transform && !i.transform[1] && !i.transform[2] && i.transform[0] > 0);
  const lines = [];
  for (const it of [...items].sort((a, b) => b.transform[5] - a.transform[5] || a.transform[4] - b.transform[4])) {
    const y = it.transform[5];
    let line = lines.find((l) => Math.abs(l.y - y) <= 1.5);
    if (!line) lines.push((line = { y, h: 0, items: [] }));
    line.items.push(it);
    line.h = Math.max(line.h, it.height || Math.abs(it.transform[3]) || 10);
  }
  for (const l of lines) {
    l.items.sort((a, b) => a.transform[4] - b.transform[4]);
    l.x = l.items[0].transform[4];
    let s = "";
    let end = null;
    for (const it of l.items) {
      const x = it.transform[4];
      if (end !== null && x - end > 1.5 && !/\s$/.test(s) && !/^\s/.test(it.str)) s += " ";
      s += it.str;
      end = Math.max(end ?? -Infinity, x + (it.width || 0));
    }
    l.text = s.replace(/\s+/g, " ").trim();
    l.top = page.height - (l.y + l.h); // od zgoraj
    l.bottom = page.height - l.y + 2;
  }
  return lines.sort((a, b) => a.top - b.top || a.x - b.x);
}

// Vrstice, ki niso del naloge, tudi kadar padejo v telo strani: številka strani (»5«, »5/16«, »Stran 5«) blizu
// vrha ali dna, črtna koda (»*M26140111*«), koda pole (»M261-401-1-1«), »Obrnite list.«, »Prazna stran«.
const EDGE = HEAD + 45;
const PAGE_NO = /^(?:stran\s*)?\d{1,3}(?:\s*(?:\/|od)\s*\d{1,3})?$/i;
const CHROME = [/^\*[A-Z0-9]{5,}\*$/, /^[A-Z]\d{3}-\d{3}-\d-\d\b/, /^obrnite list\.?$/i, /^prazna stran$/i, /^tukaj ne pi[sš]i/i, /^skupno število točk/i];
export const isChrome = (page, l) =>
  CHROME.some((re) => re.test(l.text)) || (PAGE_NO.test(l.text) && (l.top < EDGE || page.height - l.bottom < EDGE));
const body = (page, l) => l.top >= HEAD - 10 && l.bottom <= page.height - HEAD + 25 && !isChrome(page, l);

// Levi rob številk: najpogostejši x kandidatov v levi petini strani (prek vse pole).
function marginX(pages, linesOf) {
  const count = new Map();
  pages.forEach((p, i) => {
    for (const l of linesOf[i]) if (body(p, l) && l.x < p.width * 0.22 && MARK.test(l.text)) count.set(Math.round(l.x), (count.get(Math.round(l.x)) || 0) + 1);
  });
  let best = null;
  for (const [x, c] of count) if (!best || c > best[1] || (c === best[1] && x < best[0])) best = [x, c];
  return best ? best[0] : null;
}

export function splitTasks(pages) {
  if (!Array.isArray(pages) || !pages.length) return [];
  const linesOf = pages.map(pageLines);
  const margin = marginX(pages, linesOf);
  if (margin === null) return [];
  const tasks = [];
  let cur = null;
  let section = null; // zadnji naslov dela (»B) KRAJŠE …«)
  pages.forEach((page, pi) => {
    const lines = linesOf[pi].filter((l) => body(page, l));
    const x0 = Math.max(0, margin - 14);
    const x1 = Math.min(page.width, page.width - margin + 14);
    const bottom = page.height - HEAD + 20;
    let open = null; // območje zadnje naloge na tej strani
    for (const l of lines) {
      const near = Math.abs(l.x - margin) <= 4;
      const m = near && MARK.exec(l.text);
      const sec = near && !m && SECTION.exec(l.text);
      if (sec) {
        if (open) open.y1 = Math.max(open.y0 + 10, l.top - 2);
        open = null;
        section = sec[1];
        continue;
      }
      const n = m ? Number(m[1]) : 0;
      const inPart = cur && cur.part === section;
      const same = inPart && n === cur.n;
      // naslednja naloga (dovolimo izpuščeno številko, npr. naloga brez besedilne plasti) ali nov del od 1
      if (n > 0 && (same || (inPart && n > cur.n && n <= cur.n + 3) || n === 1 || !cur)) {
        if (!same) {
          if (open) open.y1 = Math.max(open.y0 + 10, l.top - PAD);
          open = null;
          cur = { n, part: section, label: "", text: "", regions: [], lines: [] };
          tasks.push(cur);
        }
        // ponovljena številka na isti strani (podnaloga) podaljša območje, na novi strani začne novo
        if (!open) cur.regions.push((open = { page: pi, x0, y0: Math.max(0, l.top - PAD), x1, y1: bottom }));
        cur.lines.push(l);
        continue;
      }
      if (open) cur.lines.push(l);
    }
  });
  const parts = new Set(tasks.map((t) => t.part));
  const showPart = parts.size > 1;
  for (const t of tasks) {
    if (!showPart) t.part = null;
    t.label = t.part ? `${t.part}${t.n}` : String(t.n);
    t.text = t.lines.map((l) => l.text).join("\n").trim();
    for (const r of t.regions) for (const k of ["x0", "y0", "x1", "y1"]) r[k] = Math.round(r[k] * 10) / 10;
    delete t.lines;
  }
  return tasks;
}

// Besedilo v ročno označenem okviru (enote PDF, y od zgoraj): vrstice, katerih sredina je v okviru.
export function textInBox(page, box) {
  return pageLines(page)
    .filter((l) => {
      const mid = (l.top + l.bottom) / 2;
      return mid >= box.y0 && mid <= box.y1 && l.x >= box.x0 - 4 && l.x <= box.x1 && !isChrome(page, l);
    })
    .map((l) => l.text)
    .join("\n")
    .trim();
}

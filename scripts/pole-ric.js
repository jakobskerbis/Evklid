#!/usr/bin/env node
// Katalog preteklih pol NPZ in mature: zbere POVEZAVE na uradne pole na ric.si in zapiše server/exam-papers-si.js.
// RIC ima na polah vse pravice (»© Državni izpitni center, vse pravice pridržane«), zato skript ne prenese
// nobene pole in ne shrani besedila nalog: prebere samo strani predmetov (seznam povezav) in z zahtevo HEAD
// preveri, da vsaka povezava vrne 200. V katalog gre le slovenska različica (brez italijanske in madžarske).
//
//   node scripts/pole-ric.js            # osveži katalog (potrebuje dostop do www.ric.si)
//   node scripts/pole-ric.js --dry      # samo izpiše povzetek
//
// Zgradba pole (structure) in naša pola (ours) se v katalogu ohranita: skript ju prenese iz obstoječega zapisa po id.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "server/exam-papers-si.js");
const BASE = "https://www.ric.si";
const NPZ = `${BASE}/nacionalno-preverjanje-znanja/predmeti-npz`;

// Strani predmetov, ki jih Evklid podpira (predmeti z nalogami: MAT, FIZ, KEM, BIO).
export const PAGES = [
  { exam: "NPZ6", subject: "MAT", url: `${NPZ}/predmeti-v-6%20-razredu/matematika/`, kind: "npz" },
  { exam: "NPZ9", subject: "MAT", url: `${NPZ}/predmeti-v-9%20-razredu/matematika/`, kind: "npz" },
  { exam: "NPZ9", subject: "FIZ", url: `${NPZ}/predmeti-v-9%20-razredu/fizika/`, kind: "npz" },
  { exam: "NPZ9", subject: "KEM", url: `${NPZ}/predmeti-v-9%20-razredu/kemija/`, kind: "npz" },
  { exam: "NPZ9", subject: "BIO", url: `${NPZ}/predmeti-v-9%20-razredu/biologija/`, kind: "npz" },
  { exam: "MATURA", subject: "MAT", url: `${BASE}/splosna-matura/predmeti/matematika/`, kind: "matura", levels: true },
  { exam: "MATURA", subject: "FIZ", url: `${BASE}/splosna-matura/predmeti/fizika/`, kind: "matura" },
  { exam: "MATURA", subject: "KEM", url: `${BASE}/splosna-matura/predmeti/kemija/`, kind: "matura" },
  { exam: "MATURA", subject: "BIO", url: `${BASE}/splosna-matura/predmeti/biologija/`, kind: "matura" },
  { exam: "POKLICNA", subject: "MAT", url: `${BASE}/poklicna-matura/predmeti/tretji-predmet/matematika/`, kind: "matura" },
];

const decode = (s) =>
  s
    .replace(/<span class="visually-hidden">[\s\S]*?<\/span>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&ndash;/g, "–")
    .replace(/&scaron;/g, "š")
    .replace(/&amp;/g, "&")
    .replace(/&#?\w+;/g, " ")
    .replace(/[​ ]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

// Vrsta dokumenta po napisu povezave; null = ni slovenska pola ali navodila (različice, poročila …).
function fileKind(label) {
  if (/različica|razli.ica|ital|madž/.test(label)) return null;
  const level = /\b(or|vr)\b/.exec(label)?.[1]?.toUpperCase() || null;
  if (/^i?zpitna pola ?1\b/.test(label)) return { kind: "paper1", level };
  if (/^i?zpitna pola ?2\b/.test(label)) return { kind: "paper2", level };
  if (/^i?zpitna pola\b/.test(label) || /^preizkus znanja\b/.test(label)) return { kind: "paper", level };
  if (/^navodila za (ocenjevanje|vrednotenje)/.test(label)) return { kind: "scoring", level };
  return null;
}

// Zaporedje besedila in povezav v kosu HTML.
function tokens(html) {
  const out = [];
  const re = /<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
  let last = 0;
  for (let m; (m = re.exec(html)); last = re.lastIndex) {
    out.push({ text: decode(html.slice(last, m.index)) });
    out.push({ href: m[1].replace(/&amp;/g, "&"), label: decode(m[2]) });
  }
  out.push({ text: decode(html.slice(last)) });
  return out;
}

// Splošna in poklicna matura: <li class="exam-item"> z imenom »spomladanski izpitni rok 2025« in povezavami;
// nekateri roki imajo dva termina (»Prvi termin«, »Drugi termin«).
function parseMatura(html) {
  const blocks = [];
  const re = /<li class="exam-item[^"]*">\s*<div class="exam-name">\s*<span>([\s\S]*?)<\/span>[\s\S]*?<div class="exam-text">([\s\S]*?)<\/div>\s*<\/li>/g;
  for (let m; (m = re.exec(html)); ) {
    const head = /(spomladanski|jesenski|zimski) izpitni rok (\d{4})/.exec(decode(m[1]));
    if (!head) continue;
    let session = null;
    for (const tk of tokens(m[2])) {
      if ("text" in tk) {
        const s = /(prvi|drugi|tretji) termin/.exec(tk.text);
        if (s) session = { prvi: 1, drugi: 2, tretji: 3 }[s[1]];
        continue;
      }
      if (tk.href) blocks.push({ term: head[1], year: Number(head[2]), session, href: tk.href, label: tk.label });
    }
  }
  return blocks;
}

// NPZ: odstavki »2025 redni rok:« (ali »naknadni rok«) s povezavami pod naslovom »Preizkusi znanja …«.
function parseNpz(html) {
  const start = html.search(/Preizkusi znanja in navodila za vrednotenje/);
  if (start < 0) return [];
  const blocks = [];
  let cur = null;
  for (const tk of tokens(html.slice(start))) {
    if ("text" in tk) {
      const all = [...tk.text.matchAll(/(\d{4}) (redni|naknadni) rok/g)];
      if (all.length) cur = { year: Number(all.at(-1)[1]), term: all.at(-1)[2] };
      continue;
    }
    if (cur && tk.href.startsWith("/mma/")) blocks.push({ ...cur, session: null, href: tk.href, label: tk.label });
  }
  return blocks;
}

const ORDER = { paper: 0, paper1: 1, paper2: 2, scoring: 3 };
// Kot na ric.si: zimski rok leta L (februar L+1) je za jesenskim rokom istega leta (koda pole P253 = 2025, 3. rok).
const TERM_ORDER = { spomladanski: 1, redni: 1, jesenski: 2, naknadni: 2, zimski: 3 };

async function ok(url) {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url, { method: "HEAD", redirect: "follow" });
      return r.status === 200;
    } catch {}
  }
  return false;
}

async function build() {
  const entries = new Map();
  const checks = [];
  for (const page of PAGES) {
    const res = await fetch(page.url);
    if (res.status !== 200) throw new Error(`${page.url}: ${res.status}`);
    const html = await res.text();
    const blocks = page.kind === "npz" ? parseNpz(html) : parseMatura(html);
    for (const b of blocks) {
      const k = fileKind(b.label);
      if (!k || !b.href.startsWith("/mma/")) continue;
      const levels = page.levels ? (k.level ? [k.level] : ["OR", "VR"]) : [null];
      for (const level of levels) {
        const id = [page.exam, page.subject, level, b.year, b.term, b.session].filter(Boolean).join("-");
        if (!entries.has(id))
          entries.set(id, { id, exam: page.exam, subject: page.subject, level, year: b.year, term: b.term, session: b.session, page: page.url, files: [], structure: [], ours: null });
        const e = entries.get(id);
        const url = BASE + b.href;
        if (!e.files.some((f) => f.url === url || (f.kind === k.kind && k.kind !== "scoring"))) e.files.push({ kind: k.kind, url });
      }
    }
  }
  // Vsaka povezava mora vrniti 200 (HEAD: datoteke ne prenašamo).
  const urls = [...new Set([...entries.values()].flatMap((e) => e.files.map((f) => f.url)))];
  const good = new Set();
  for (let i = 0; i < urls.length; i += 6) {
    const part = urls.slice(i, i + 6);
    const res = await Promise.all(part.map(ok));
    part.forEach((u, j) => res[j] && good.add(u));
  }
  for (const e of entries.values()) e.files = e.files.filter((f) => good.has(f.url)).sort((a, b) => ORDER[a.kind] - ORDER[b.kind]);
  checks.push(urls.length - good.size);
  const list = [...entries.values()]
    .filter((e) => e.files.some((f) => f.kind !== "scoring"))
    .sort((a, b) => a.exam.localeCompare(b.exam) || a.subject.localeCompare(b.subject) || String(a.level).localeCompare(String(b.level)) || b.year - a.year || TERM_ORDER[a.term] - TERM_ORDER[b.term] || (a.session || 0) - (b.session || 0));
  return { list, bad: checks[0], total: urls.length };
}

async function previous() {
  try {
    const mod = await import(`${OUT}?t=${Date.now()}`);
    return new Map(mod.PAPERS_SI.map((e) => [e.id, e]));
  } catch {
    return new Map();
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const { list, bad, total } = await build();
  const keep = await previous();
  for (const e of list) {
    const old = keep.get(e.id);
    if (old?.structure?.length) e.structure = old.structure;
    if (old?.ours) e.ours = old.ours;
  }
  const today = new Date().toISOString().slice(0, 10);
  console.log(`${list.length} rokov, ${total} povezav, ${bad} brez odgovora 200 (izpuščene)`);
  if (process.argv.includes("--dry")) process.exit(0);
  const body = list.map((e) => `  ${JSON.stringify(e)},`).join("\n");
  fs.writeFileSync(
    OUT,
    `// Katalog preteklih pol NPZ in mature (samo povezave na ric.si). Ustvari: node scripts/pole-ric.js (${today}).
// Pole in navodila so last Državnega izpitnega centra (»© Državni izpitni center, vse pravice pridržane«):
// ne kopiramo, ne prenašamo in ne shranjujemo njihovega besedila, vsak vnos samo povezuje na dokument na ric.si.
// Nalog RIC nikoli ne prepisujemo (j, 2026-10-30): uporabimo samo ZGRADBO pole.
// structure: zgradba izvirne pole, pozneje seznam { n, topicId, format, points } (zdaj prazen).
// ours: naša pola z enako zgradbo, vsaka naloga razložena na več načinov (pozneje napiše Opus s trojnim
// pregledom; zdaj null = v aplikaciji »Naša pola v tem slogu je v pripravi«). Povezava na ric.si ostane.
// term: spomladanski | jesenski | zimski (matura), redni | naknadni (NPZ); session: termin, kadar jih je več.
// files[].kind: paper (pola / preizkus znanja), paper1, paper2 (izpitni poli), scoring (navodila za ocenjevanje).
export const PAPERS_SOURCE = { name: "Državni izpitni center (RIC)", url: "https://www.ric.si/", checked: "${today}" };

export const PAPERS_SI = [
${body}
];
`,
  );
  console.log(`zapisano: ${path.relative(ROOT, OUT)}`);
}

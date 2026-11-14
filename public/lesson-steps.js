// Lekcija po korakih: razdeli razdelke lekcije na kratke kartice in med njih vstavi
// vprašanja iz »Preveri se«, da branje ni eno dolgo drsenje (j, 29. 10. 2026).
// Čista funkcija nad Markdownom (brez DOM), zato jo preverja tudi test/lesson-steps.test.js.

const LONG = 1400; // znakov: daljši kos razlage razdelimo na meji odstavka
const MIN = 350; // krajšega kosa ne odrežemo (razen pred naslovom ali za »Premisli«)

const opens = (s) => (s.match(/<(div|details)\b/g) || []).length;
const closes = (s) => (s.match(/<\/(div|details)>/g) || []).length;
const dollars = (s) => (s.match(/\$\$/g) || []).length;

// Odstavki, ločeni s prazno vrstico; HTML bloki (Premisli, formula) in $$…$$ ostanejo celi.
export function mdBlocks(md) {
  const out = [];
  let cur = "";
  let depth = 0;
  let math = 0;
  for (const part of String(md ?? "").split(/\n[ \t]*\n/)) {
    cur = cur ? `${cur}\n\n${part}` : part;
    depth += opens(part) - closes(part);
    math += dollars(part);
    if (depth <= 0 && math % 2 === 0) {
      if (cur.trim()) out.push(cur);
      cur = "";
      depth = 0;
    }
  }
  if (cur.trim()) out.push(cur);
  return out;
}

const kindOf = (title) =>
  /zakaj/i.test(title) ? "why"
  : /razlag/i.test(title) ? "explain"
  : /rešen|za izpit|za maturo/i.test(title) ? "examples" // ena naloga »Za izpit« ali »Za maturo« = en korak, rešitev ob besedilu
  : /napak/i.test(title) ? "mistakes"
  : /povzetek/i.test(title) ? "summary"
  : "other";

// Kosi enega razdelka. Primeri ostanejo celi (en primer = en korak), razlaga se deli
// pri naslovih ###, za vsakim »Premisli« in pri predolgih kosih.
export function splitSection(md, kind) {
  if (kind === "why" || kind === "mistakes" || kind === "summary") return [String(md ?? "")].filter((x) => x.trim());
  const chunks = [];
  let cur = [];
  const len = () => cur.join("\n\n").length;
  const flush = () => {
    if (cur.length) chunks.push(cur.join("\n\n"));
    cur = [];
  };
  // Oštevilčena točka (»**9. Absolutna vrednost.** …«) ostane cela na enem koraku (j, 1. 11. 2026):
  // kadar razdelek ima take točke, ga delimo le pred novo točko ali naslovom.
  const blocks = mdBlocks(md);
  const point = (b) => /^\s*\*\*\d+\.\s/.test(b);
  const numbered = kind !== "examples" && blocks.some(point);
  let think = false;
  for (const b of blocks) {
    const heading = /^###\s/.test(b.trimStart());
    const long = cur.length && len() >= MIN && len() + b.length > LONG;
    if (heading && cur.length) flush();
    else if (numbered) { if (point(b) && cur.length && (think || long)) flush(); }
    else if (kind !== "examples" && long && !/^\s*[|>-]/.test(b)) flush();
    if (!cur.length) think = false;
    cur.push(b);
    if (b.includes('class="tb-think"') && kind !== "examples") { if (numbered) think = true; else flush(); }
  }
  flush();
  return chunks;
}

// Koraki lekcije: [{ type: "text", section, title, md, last }, { type: "check", checks: [i], final }].
// Prvo vprašanje gre za razlago, drugo za pogoste napake (ali primere), ostala na konec.
export function lessonSteps(sections, nChecks = 0) {
  const steps = [];
  const kinds = sections.map((s) => kindOf(s.title || ""));
  const placeAt = [];
  if (nChecks >= 3) {
    const ex = kinds.indexOf("explain");
    const mi = kinds.indexOf("mistakes") >= 0 ? kinds.indexOf("mistakes") : kinds.indexOf("examples");
    if (ex >= 0) placeAt.push(ex);
    if (mi >= 0 && mi !== ex) placeAt.push(mi);
  }
  let next = 0;
  sections.forEach((s, i) => {
    const parts = splitSection(s.md, kinds[i]);
    if (!parts.length) parts.push("");
    parts.forEach((md, k) => steps.push({ type: "text", section: i, title: s.title || "", md, last: k === parts.length - 1 }));
    if (placeAt.includes(i) && next < nChecks) steps.push({ type: "check", checks: [next++], final: false });
  });
  if (next < nChecks) steps.push({ type: "check", checks: Array.from({ length: nChecks - next }, (_, k) => next + k), final: true });
  return steps;
}

// Na katerih korakih je posamezna simulacija (j, 2. 11. 2026: »Kje je simulacija?«). Simulacija je
// na ISTEM koraku kot besedilo, ki jo omenja (»V simulaciji spodaj …«); omeni jo lahko več korakov,
// stran jo med njimi premakne (textbook.js placeDemos). Korak z naslovom simulacije velja zanjo,
// korak brez naslova za simulacije, ki jih ne omeni noben naslov (sicer za vse). Simulacija, ki je
// ne omeni nihče ali jo omeni le uvod (»Zakaj«), je (tudi) na zadnjem koraku razdelka `fallback`
// (rešeni primeri), kjer je bila prej.
// Vrne seznam indeksov korakov za vsako simulacijo.
const low = (s) => String(s ?? "").toLowerCase().replace(/\s+/g, " ");
const MENTION = /simulacij|poskus\w* spodaj|spodnj\w* poskus/;
export function demoSteps(steps, demos = [], fallback = -1) {
  const titles = demos.map((d) => low(d?.title).trim());
  const text = steps.map((st, k) => ({ k, md: st.type === "text" ? low(st.md) : "" }));
  const names = (md) => titles.map((t, i) => (t.length >= 3 && (md.includes(`»${t}«`) || (MENTION.test(md) && md.includes(t))) ? i : -1)).filter((i) => i >= 0);
  const named = new Set(text.flatMap((x) => names(x.md)));
  const unnamed = demos.map((_, i) => i).filter((i) => !named.has(i));
  const out = demos.map(() => []);
  for (const { k, md } of text) {
    const hit = names(md);
    const who = hit.length ? hit : MENTION.test(md) ? (unnamed.length ? unnamed : demos.map((_, i) => i)) : [];
    for (const i of who) out[i].push(k);
  }
  let fb = -1;
  steps.forEach((st, k) => { if (st.type === "text" && st.section === fallback && st.last) fb = k; });
  if (fb < 0) fb = steps.findLastIndex((st) => st.type === "text");
  if (fb < 0) return demos.map(() => []);
  const intro = (k) => /zakaj/i.test(steps[k].title || "");
  return out.map((ks) => (ks.every(intro) && !ks.includes(fb) ? [...ks, fb] : ks));
}

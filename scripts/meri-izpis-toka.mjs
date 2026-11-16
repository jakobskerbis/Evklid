// Meritev D5: koliko časa procesorja porabi izris odgovora med pretakanjem (po besedah, kot pacer), z isto kodo
// kot public/app.js v tej različici (če obstaja public/izpis-toka.js, z bloki; sicer cel izris ob vsakem koraku).
// Zagon: node scripts/meri-izpis-toka.mjs [koren repozitorija]   (privzeto ta repozitorij; za »prej« podaj koren starejše kopije)
import path from "node:path";
import fs from "node:fs";
import { pathToFileURL } from "node:url";
const ROOT = path.resolve(process.argv[2] || path.join(path.dirname(new URL(import.meta.url).pathname), ".."));
const req = (await import("node:module")).createRequire(path.join(ROOT, "package.json"));
const { marked } = req("marked");
const katex = req("katex");
const rich = await import(pathToFileURL(path.join(ROOT, "public/rich.js")).href);
const fd = await import(pathToFileURL(path.join(ROOT, "public/formula-data.js")).href);
const imaBloke = fs.existsSync(path.join(ROOT, "public/izpis-toka.js"));
const tok = imaBloke ? await import(pathToFileURL(path.join(ROOT, "public/izpis-toka.js")).href) : null;

const odstavek = (i) =>
  `**${i}. korak.** Izračunamo $\\frac{${i}}{${i + 1}} + \\frac{1}{${i + 2}}$ in dobimo $\\frac{${i * (i + 2) + i + 1}}{${(i + 1) * (i + 2)}}$. ` +
  `Preverimo še s formulo $$\\sum_{k=1}^{${i}} k = \\frac{${i}(${i}+1)}{2} = ${(i * (i + 1)) / 2}$$ in nadaljujemo z razlago, ki ima nekaj besed več, da je odstavek dolg kot v pravem odgovoru inštruktorja.`;
const ODGOVOR = Array.from({ length: 12 }, (_, i) => odstavek(i + 1)).join("\n\n");
const meje = [...ODGOVOR.matchAll(/\s+/g)].map((m) => m.index).concat(ODGOVOR.length);

function enkrat() {
  const { renderRich } = rich.createRenderer({ marked, katex, sanitize: (h) => h, annotate: (tex, o) => fd.annotateTex(tex, undefined, o) });
  const izris = imaBloke ? tok.createIzrisBlokov(renderRich) : null;
  const t0 = performance.now();
  for (const m of meje) {
    const s = rich.streamSafe(ODGOVOR.slice(0, m));
    if (izris) izris(s);
    else renderRich(s);
  }
  renderRich(ODGOVOR); // končni izris
  return performance.now() - t0;
}
enkrat(); // ogrevanje
const casi = Array.from({ length: 5 }, enkrat).sort((a, b) => a - b);
console.log(JSON.stringify({ nacin: imaBloke ? "bloki + KaTeX v predpomnilniku" : "cel izris ob vsakem koraku", znakov: ODGOVOR.length, korakov: meje.length, mediana_ms: Math.round(casi[2]), najmanj_ms: Math.round(casi[0]), na_korak_ms: +(casi[2] / meje.length).toFixed(2) }));

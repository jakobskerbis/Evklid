// Izmeri surove risbe ikon obdobij (črnilo z debelino črte, težišče) in na novo zapiše tabelo OKVIR v scripts/ikone-obdobij.js:
// črnilo največ 20 × 20 (manjše od 17,5 se poveča na 18,5), sredina pol okvir, pol težišče na (12, 12), risba ostane v polju 1,5–22,5.
// Po spremembi risbe: node scripts/ikone-okvir.mjs && node scripts/ikone-obdobij.js   (potrebuje Playwright s Chromiumom)
import fs from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const pw = createRequire(import.meta.url)("playwright");
const FILE = fileURLToPath(new URL("./ikone-obdobij.js", import.meta.url));
const { tabele } = await import("./ikone-obdobij.js");
const items = [];
for (const [s, set] of Object.entries(tabele())) for (const [k, [v]] of Object.entries(set)) items.push([s, k, v]);

const br = await pw.chromium.launch();
const pg = await br.newPage();
await pg.setContent("<canvas id=c width=240 height=240></canvas>");
const res = await pg.evaluate(async (items) => {
  const x = document.getElementById("c").getContext("2d", { willReadFrequently: true });
  const out = [];
  for (const [s, k, v] of items) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" color="#000">${v}</svg>`;
    const im = new Image();
    im.src = "data:image/svg+xml," + encodeURIComponent(svg);
    await im.decode();
    x.clearRect(0, 0, 240, 240);
    x.drawImage(im, 0, 0);
    const d = x.getImageData(0, 0, 240, 240).data;
    let x0 = 240, y0 = 240, x1 = -1, y1 = -1, sx = 0, sy = 0, sa = 0;
    for (let i = 0; i < 240; i++) for (let j = 0; j < 240; j++) {
      const a = d[(i * 240 + j) * 4 + 3] / 255;
      if (a > 0.3) { if (j < x0) x0 = j; if (j > x1) x1 = j; if (i < y0) y0 = i; if (i > y1) y1 = i; }
      sx += a * j; sy += a * i; sa += a;
    }
    out.push([s, k, x0 / 10, y0 / 10, (x1 + 1) / 10, (y1 + 1) / 10, sx / sa / 10 + 0.05, sy / sa / 10 + 0.05]);
  }
  return out;
}, items);
await br.close();

const q = (v) => Math.round(v * 4) / 4, r2 = (v) => Math.round(v * 100) / 100;
const OK = {};
for (const [s, k, x0, y0, x1, y1, tx, ty] of res) {
  const M = Math.max(x1 - x0, y1 - y0);
  const f = r2(M > 20.25 ? 18 / (M - 2) : M < 17.5 ? 16.5 / (M - 2) : 1); // debelina črte (2) se ne spremeni
  const sc = (v) => 12 + (v - 12) * f;
  const bx = (sc(x0) + sc(x1)) / 2, by = (sc(y0) + sc(y1)) / 2;
  let dx = q(12 - (0.55 * bx + 0.45 * sc(tx))), dy = q(12 - (0.55 * by + 0.45 * sc(ty)));
  dx = q(Math.max(Math.min(dx, 22.5 - sc(x1)), 1.5 - sc(x0)));
  dy = q(Math.max(Math.min(dy, 22.5 - sc(y1)), 1.5 - sc(y0)));
  if (f !== 1 || dx || dy) (OK[s] ||= {})[k] = dy ? [f, dx, dy] : dx ? [f, dx] : [f];
}
const lines = Object.entries(OK).map(([s, o]) => `  ${s}: { ${Object.entries(o).map(([k, v]) => `${/^[a-z]+$/.test(k) ? k : JSON.stringify(k)}: [${v.join(", ")}]`).join(", ")} },`);
const table = `const OKVIR = {\n${lines.join("\n")}\n};`;
const RE = /const OKVIR = \{(?:\n.*?\n)?\};/s;
const old = fs.readFileSync(FILE, "utf8");
if ((old.match(RE) || [])[0] === table) console.log("OKVIR je že izmerjen");
else {
  fs.writeFileSync(FILE, old.replace(RE, table));
  console.log("OKVIR zapisan; zaženi node scripts/ikone-obdobij.js");
}

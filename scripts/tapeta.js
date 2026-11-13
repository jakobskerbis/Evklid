// Tapeta zgodovinskega sloga: iz 6–8 motivov (public/theme.js → ERAS[id].motifs, public/eras/<id>/*.svg, viewBox 64 × 64)
// sestavi ploščico public/eras/<id>/tapeta.svg, ki se brez šivov ponavlja (ui.css → »Tapeta«).
// Razpored: rešetka diagonalnih pikčastih črt (rombi), v vsakem rombu en motiv (diagonalni ponavljalni vzorec,
// vrste zamaknjene za pol), na križiščih rešetke majhna rozeta. Ploščica 320 × 320 ima osem rombov, zato se vsak
// motiv pokaže enkrat na ploščico.
//   node scripts/tapeta.js            sestavi tapete vseh slogov
//   node scripts/tapeta.js <id> …      samo izbrane
//   node scripts/tapeta.js --check     ali so datoteke enake sestavljenim (test/teme.test.js)
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const PUB = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public");
const S = 320; // velikost ploščice (enote viewBox; ui.css jo izriše v 300 px, na telefonu 210 px)
const STEP = 80; // razmik med vrstami motivov
const SIZE = 50; // velikost motiva (64 → 50, da ostane v rombu)

export function eras() {
  const el = () => ({ style: { setProperty() {}, removeProperty() {} }, dataset: {}, classList: { toggle() {} }, removeAttribute() {}, setAttribute() {}, appendChild() {} });
  const w = { localStorage: { getItem: () => null, setItem() {} }, matchMedia: () => ({ matches: false, addEventListener() {} }), document: { documentElement: el(), head: el(), querySelector: () => null, createElement: el }, navigator: {} };
  w.window = w;
  vm.runInNewContext(fs.readFileSync(path.join(PUB, "theme.js"), "utf8").replace("Object.keys(localStorage)", "[]"), w);
  return w.STEMTheme.ERAS;
}

const n = (v) => +v.toFixed(2);

// En motiv kot <g>: lastnosti korenskega <svg> (fill, stroke …) gredo na skupino, vsebina ostane.
// Oznake id (npr. clipPath) dobijo predpono mesta i, da se ponovljen motiv (slog s manj kot osmimi) ne podvoji.
function motif(id, name, cx, cy, i) {
  const svg = fs.readFileSync(path.join(PUB, "eras", id, `${name}.svg`), "utf8").trim();
  const m = svg.match(/^<svg ([^>]*)>([\s\S]*)<\/svg>$/);
  if (!m || !/viewBox="0 0 64 64"/.test(m[1])) throw new Error(`${id}/${name}.svg: pričakujem <svg viewBox="0 0 64 64">`);
  if (/<script|href=|<text|<svg/i.test(m[2])) throw new Error(`${id}/${name}.svg: brez skript, povezav, besedila in gnezdenih <svg>`);
  const attrs = m[1].replace(/\s*(xmlns|viewBox)="[^"]*"/g, "").trim();
  const body = m[2].replace(/\bid="([^"]+)"/g, `id="m${i}-$1"`).replace(/url\(#([^)]+)\)/g, `url(#m${i}-$1)`);
  const k = SIZE / 64;
  return `<g transform="translate(${n(cx - SIZE / 2)} ${n(cy - SIZE / 2)}) scale(${n(k)})" ${attrs}>${body}</g>`;
}

export function sestavi(id, era) {
  const list = era.motifs;
  // Središča rombov: vrste na y = 40, 120, 200, 280, v vsaki dva motiva, sosednji vrsti zamaknjeni za pol (diagonalno).
  const centers = [];
  for (let r = 0; r < S / STEP; r++) for (let c = 0; c < 2; c++) centers.push([STEP / 2 + c * 2 * STEP + (r % 2) * STEP, STEP / 2 + r * STEP]);
  // Črte rešetke x + y = 0, 160, 320, 480 in x − y = ±80, ±240 (perioda 160 deli 320, zato se ploščica zlepi brez šiva).
  const lines = [];
  for (let k = 2 * STEP; k <= 3 * S / 2; k += 2 * STEP) lines.push([Math.max(0, k - S), Math.min(S, k), Math.min(S, k), Math.max(0, k - S)]);
  for (let k = -3 * STEP; k <= 3 * STEP; k += 2 * STEP) lines.push([Math.max(0, k), Math.max(0, -k), Math.min(S, S + k), Math.min(S, S - k)]);
  // Križišča rešetke: vrhovi rombov, za pol razmika zamaknjeni od motivov.
  const knots = centers.map(([x, y]) => [(x + STEP) % S, y]);
  const rosette = (x, y) => `<circle cx="${x}" cy="${y}" r="2.2"/><path d="M${x} ${y - 5.5}v1.6M${x} ${y + 5.5}v-1.6M${x - 5.5} ${y}h1.6M${x + 5.5} ${y}h-1.6"/>`;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}">`,
    `<g fill="none" stroke="#000" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="0 ${n(STEP * Math.SQRT2 / 20)}">`,
    lines.map(([a, b, c, d]) => `<path d="M${a} ${b}L${c} ${d}"/>`).join(""),
    `</g>`,
    `<g fill="none" stroke="#000" stroke-width="1.2" stroke-linecap="round">${knots.map(([x, y]) => rosette(x, y)).join("")}</g>`,
    centers.map(([x, y], i) => motif(id, list[i % list.length], x, y, i)).join(""),
    `</svg>`,
    "",
  ].join("\n");
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const args = process.argv.slice(2);
  const check = args.includes("--check");
  const all = eras();
  const ids = args.filter((a) => !a.startsWith("--"));
  const unknown = ids.filter((a) => !Object.hasOwn(all, a)).concat(args.filter((a) => a.startsWith("--") && a !== "--check"));
  if (unknown.length) { console.error(`neznan slog ali možnost: ${unknown.join(", ")} (slogi: ${Object.keys(all).join(", ")})`); process.exit(2); }
  let bad = 0;
  for (const [id, era] of Object.entries(all)) {
    if (ids.length && !ids.includes(id)) continue;
    const file = path.join(PUB, "eras", id, "tapeta.svg");
    const out = sestavi(id, era);
    if (check) {
      if (!fs.existsSync(file) || fs.readFileSync(file, "utf8") !== out) { console.log(`zastarela: ${file} (node scripts/tapeta.js ${id})`); bad++; }
    } else {
      fs.writeFileSync(file, out);
      console.log(`${file}: ${out.length} B`);
    }
  }
  process.exit(bad ? 1 : 0);
}

// Skupno za teste laboratorija v brskalniku (laboratorij-shramba, -napoved, -racun): strežnik za public/ in stran,
// na kateri je poskus v drsnem delu kot v aplikaciji (enako kot v laboratorij-telefon.test.js).
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
export let playwright = null;
try {
  playwright = require("playwright");
} catch {}

const PUB = path.resolve("public");
const TYPES = { ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".html": "text/html", ".woff2": "font/woff2", ".webp": "image/webp", ".avif": "image/avif", ".svg": "image/svg+xml" };
const PAGE = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/ui.css"><link rel="stylesheet" href="/lab.css"><link rel="stylesheet" href="/textbook.css">
<style>body{margin:0;display:flex;flex-direction:column;height:100dvh}header{height:56px;flex:none;background:#ddd}#v{flex:1;min-height:0;overflow-y:auto;padding:24px 16px 48px}</style>
<header></header><main id="v" class="lab-view"><h2>Poskus</h2><section class="card lab-bench"><div id="m"></div></section></main>
<script type="module">
import { mountSim } from "/sim/index.js";
window.lab = await import("/sim/lab.js");
window.mount = async (id, opts = {}) => { const m = document.getElementById("m"); await mountSim(id, m, opts); await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); };
window.ready = true;
</script>`;

export function serve() {
  const server = http.createServer((req, res) => {
    const url = req.url.split("?")[0];
    if (url === "/t-lab.html") return res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(PAGE);
    const file = path.join(PUB, path.normalize(url));
    if (!file.startsWith(PUB) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return res.writeHead(404).end();
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" }).end(fs.readFileSync(file));
  });
  return new Promise((ok) => server.listen(0, "127.0.0.1", () => ok(server)));
}

// Odpre stran in nanjo postavi poskus id; vrne stran in seznam napak strani.
export async function odpri(ctx, base, id) {
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(e.message));
  await p.goto(`${base}/t-lab.html`);
  await p.waitForFunction(() => window.ready);
  if (id) await p.evaluate((id) => window.mount(id), id);
  await p.waitForLoadState("networkidle");
  return { p, errs };
}

// Drsnik po oznaki (aria-label) nastavi na v in sproži »input« kot uporabnik.
export const nastavi = (p, label, v) =>
  p.evaluate(([label, v]) => {
    const i = document.querySelector(`input[type="range"][aria-label="${label}"]`);
    i.value = String(v);
    i.dispatchEvent(new Event("input", { bubbles: true }));
  }, [label, v]);

// Ohmov zakon: izmeri tok upornika pri danih napetostih (merilnik se osveži vsakih 0,4 s).
export async function meriOhm(p, napetosti) {
  for (const U of napetosti) {
    await nastavi(p, "napetost napajalnika", U);
    await p.waitForTimeout(700);
    await p.getByRole("button", { name: "Zapiši meritev" }).click();
  }
}

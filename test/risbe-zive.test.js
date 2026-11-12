// Grafi z drsniki v brskalniku (public/risbe-zive.js; j, 11. 11. 2026): lekcija gre skozi rich.js (marked + DOMPurify)
// kot v aplikaciji, nato dobi pod sliko drsnike. Premik drsnika (tipkovnica) izriše graf znova z isto kodo kot
// strežnik, vrednosti so zapisane z decimalno vejico, na telefonu (360 px) nič ne sili vstran in drsnik je visok
// vsaj 44 px. Chromium in WebKit (Safari na iPhonu), kolikor ju Playwright ima.
import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { expandFormulaBlocks } from "../server/textbook.js";
import { renderDrawing } from "../server/risbe.js";

const require = createRequire(import.meta.url);
let playwright = null;
try {
  playwright = require("playwright");
} catch {}

const PUB = path.resolve("public");
const NM = path.resolve("node_modules");
const TYPES = { ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".html": "text/html" };

const TELO = [
  "opis: Premica y = kx + n. Izbrano je k = {k} in n = {n}.",
  "x: -6 .. 6",
  "y: -6 .. 6",
  "enako: da",
  "drsnik: k | -3 .. 3 | 0,5 | 1 | smerni koeficient k",
  "drsnik: n | -3 .. 3 | 1 | 2 | začetna vrednost n",
  "f: k*x + n",
  "točka: 0; n | (0, {n}) | levo | oranžna",
  "podnapis: y = {k}x {+n}",
].join("\n");
const MD = `Pred sliko.\n\n:::risba graf\n${TELO}\n:::\nZa sliko **krepko**.\n\n:::risba graf\nopis: Graf kvadratne funkcije brez drsnikov.\nx: -2 .. 2\ny: -1 .. 4\nf: x^2\n:::\n`;
const HTML = expandFormulaBlocks(MD, "html");
const pot = (svg) => /<path class="rs-l a rs-b"[^>]* d="([^"]+)"/.exec(svg)[1];

const PAGE = `<!doctype html><html lang="sl"><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/risbe.css">
<div id="lekcija" class="explanation"></div>
<script src="/vendor/katex/katex.min.js"></script><script src="/vendor/marked/marked.umd.js"></script><script src="/vendor/dompurify/purify.min.js"></script>
<script type="module">
import { createRenderer } from "/rich.js";
import { oziviRisbe } from "/risbe-zive.js";
const { renderRich } = createRenderer();
const root = document.getElementById("lekcija");
root.innerHTML = renderRich(${JSON.stringify(HTML).replace(/</g, "\\u003c")});
oziviRisbe(root);
oziviRisbe(root);
window.ready = true;
</script></html>`;

function serve() {
  const server = http.createServer((req, res) => {
    const url = req.url.split("?")[0];
    if (url === "/t.html") return res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(PAGE);
    const vendor = { "/vendor/katex/": "katex/dist/", "/vendor/marked/": "marked/lib/", "/vendor/dompurify/": "dompurify/dist/" };
    const pre = Object.keys(vendor).find((k) => url.startsWith(k));
    const base = pre ? path.join(NM, vendor[pre]) : PUB;
    const file = path.join(base, path.normalize(pre ? url.slice(pre.length) : url));
    if (!file.startsWith(base) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return res.writeHead(404).end();
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" }).end(fs.readFileSync(file));
  });
  return new Promise((ok) => server.listen(0, "127.0.0.1", () => ok(server)));
}

const browsers = [];
for (const kind of ["chromium", "webkit"]) {
  try {
    if (playwright) browsers.push([kind, await playwright[kind].launch()]);
  } catch {}
}
const server = browsers.length ? await serve() : null;
test.after(async () => {
  for (const [, b] of browsers) await b.close();
  server?.close();
});
if (!browsers.length) test("graf z drsniki v brskalniku", { skip: "Playwright ni nameščen" }, () => {});

for (const [kind, browser] of browsers) {
  test(`graf z drsniki (${kind}): drsnika pod sliko, premik s tipkovnico izriše graf kot strežnik`, async () => {
    const ctx = await browser.newContext({ viewport: { width: 360, height: 740 } });
    const p = await ctx.newPage();
    const errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    p.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    await p.goto(`http://127.0.0.1:${server.address().port}/t.html`);
    await p.waitForFunction(() => window.ready);
    const stanje = () =>
      p.evaluate(() => {
        const figs = [...document.querySelectorAll("#lekcija figure.risba")];
        const fig = figs[0];
        const svg = fig.querySelector("svg.rs");
        return {
          figur: figs.length,
          vrstni: [...fig.children].map((e) => e.tagName.toLowerCase() + (e.className?.baseVal ?? e.className ? `.${e.className?.baseVal ?? e.className}` : "")),
          drsniki: [...document.querySelectorAll(".rs-drsnik")].map((r) => {
            const i = r.querySelector("input");
            const l = r.querySelector("label");
            const o = r.querySelector("output");
            const box = i.getBoundingClientRect();
            return {
              type: i.type, min: i.min, max: i.max, step: i.step, value: i.value, valuetext: i.getAttribute("aria-valuetext"),
              label: l.textContent, za: l.htmlFor === i.id && o.htmlFor.value === i.id, ime: i.labels[0]?.textContent, out: o.textContent,
              h: box.height, levo: box.left, desno: box.right, pisava: parseFloat(getComputedStyle(l).fontSize),
            };
          }),
          d: svg.querySelector("path.rs-b").getAttribute("d"),
          krog: ["cx", "cy"].map((a) => svg.querySelector("circle").getAttribute(a)),
          napis: [...svg.querySelectorAll("text")].map((t) => t.textContent).find((t) => t.startsWith("(0,")),
          aria: svg.getAttribute("aria-label"),
          title: svg.querySelector("title").textContent,
          cap: fig.querySelector("figcaption").textContent,
          sirina: [document.scrollingElement.scrollWidth, window.innerWidth],
          naslednji: fig.nextElementSibling.textContent,
          aktiven: document.activeElement?.id || "",
        };
      });
    const okvir = () => p.evaluate(() => new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok))));

    let s = await stanje();
    assert.deepEqual(errors, []);
    assert.equal(s.figur, 2);
    assert.deepEqual(s.vrstni, ["svg.rs", "div.rs-drsniki", "figcaption"], "drsniki med sliko in podnapisom, dodani enkrat");
    assert.equal(s.drsniki.length, 2, "graf brez »drsnik:« ostane brez drsnikov");
    const [k, n] = s.drsniki;
    assert.deepEqual([k.type, k.min, k.max, k.step, k.value, k.label, k.ime, k.out, k.valuetext], ["range", "-3", "3", "0.5", "1", "smerni koeficient k", "smerni koeficient k", "1", "1"]);
    assert.deepEqual([n.min, n.max, n.step, n.value, n.label, n.out], ["-3", "3", "1", "2", "začetna vrednost n", "2"]);
    assert.ok(k.za && n.za, "label in output sta vezana na drsnik");
    for (const d of s.drsniki) {
      assert.ok(d.h >= 44, `drsnik je za prst visok vsaj 44 px (${d.h})`);
      assert.ok(d.levo >= 0 && d.desno <= 360, `drsnik je ves na zaslonu (${d.levo}–${d.desno})`);
      assert.ok(d.pisava >= 14, `napis drsnika ${d.pisava} px`);
    }
    assert.ok(s.sirina[0] <= s.sirina[1], `brez vodoravnega drsenja pri 360 px (${s.sirina})`);
    assert.equal(s.d, pot(renderDrawing("graf", TELO).html), "pred premikom je slika strežniška");
    assert.equal(s.naslednji, "Za sliko krepko.");

    // Tipkovnica: Tab pride do drsnika, puščica desno poveča k za en korak.
    await p.focus(".rs-drsnik input");
    await p.keyboard.press("ArrowRight");
    await okvir();
    s = await stanje();
    assert.deepEqual([s.drsniki[0].value, s.drsniki[0].out, s.drsniki[0].valuetext], ["1.5", "1,5", "1,5"], "decimalna vejica");
    let streznik = renderDrawing("graf", TELO, { vrednosti: { k: 1.5, n: 2 }, popustljivo: true });
    assert.equal(s.d, pot(streznik.svg), "krivulja je enaka strežniškemu izrisu pri k = 1,5");
    assert.equal(s.cap, "y = 1,5x + 2");
    assert.equal(s.aria, "Premica y = kx + n. Izbrano je k = 1,5 in n = 2.");
    assert.equal(s.title, s.aria);
    assert.ok(s.aktiven, "fokus ostane na drsniku");

    // Home: najmanjša vrednost, pravi minus; drugi drsnik premakne točko (0, n).
    await p.keyboard.press("Home");
    await p.focus(".rs-drsnik:nth-child(2) input");
    await p.keyboard.press("ArrowLeft");
    await p.keyboard.press("ArrowLeft");
    await p.keyboard.press("ArrowLeft");
    await okvir();
    s = await stanje();
    assert.deepEqual([s.drsniki[0].value, s.drsniki[0].out], ["-3", "−3"]);
    assert.deepEqual([s.drsniki[1].value, s.drsniki[1].out, s.drsniki[1].valuetext], ["-1", "−1", "−1"]);
    streznik = renderDrawing("graf", TELO, { vrednosti: { k: -3, n: -1 }, popustljivo: true });
    assert.equal(s.d, pot(streznik.svg));
    assert.deepEqual(s.krog, ["169", "170.5"], "točka (0, −1)");
    assert.equal(s.napis, "(0, −1)");
    assert.equal(s.cap, "y = −3x − 1");
    assert.ok(s.sirina[0] <= s.sirina[1]);
    assert.deepEqual(errors, []);
    await ctx.close();
  });
}

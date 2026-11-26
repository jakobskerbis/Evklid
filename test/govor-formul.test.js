// Izgovor formul za bralnike zaslona (public/mat/govor.js, K-11 nadaljevanje, j 26. 11. 2026): gumb, ki je samo
// formula, v Chromu sicer nima imena (MathML ne šteje v ime gumba), zato bralnik prebere le »gumb«.
import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { texGovor, slovarGovora, JEZIKI_GOVORA } from "../public/mat/govor.js";
import { LIVE_UI_LANGUAGES, uiChain } from "../public/i18n/languages.js";

test("texGovor: izbire odgovorov iz Vadbe za izpit (intervali in množice)", () => {
  assert.equal(texGovor("[0,\\pi]-\\left\\{\\frac{\\pi}{2}\\right\\}"), "oglati oklepaj 0, pi oglati zaklepaj minus zaviti oklepaj pi skozi 2 zaviti zaklepaj");
  assert.equal(texGovor("\\left[-\\frac{\\pi}{2},\\frac{\\pi}{2}\\right]-\\{0\\}"), "oglati oklepaj minus pi skozi 2, pi skozi 2 oglati zaklepaj minus zaviti oklepaj 0 zaviti zaklepaj");
  assert.equal(texGovor("(0, \\pi)"), "oklepaj 0, pi zaklepaj");
});

test("texGovor: ulomki, potence, koreni, indeksi", () => {
  assert.equal(texGovor("x^2+3x-4=0"), "x na kvadrat plus 3 x minus 4 je enako 0");
  assert.equal(texGovor("\\frac{x+1}{2x}"), "ulomek, števec x plus 1, imenovalec 2 x, konec ulomka");
  assert.equal(texGovor("\\dfrac{3}{4}"), "3 skozi 4");
  assert.equal(texGovor("-\\frac{1}{2}"), "minus 1 skozi 2");
  assert.equal(texGovor("\\sqrt{16}=4"), "kvadratni koren iz 16 je enako 4");
  assert.equal(texGovor("\\sqrt[3]{x^2+1}"), "3. koren iz x na kvadrat plus 1, konec korena");
  assert.equal(texGovor("3{,}5\\cdot 10^{-3}"), "3,5 krat 10 na minus 3");
  assert.equal(texGovor("x^{n+1}"), "x na potenco n plus 1, konec potence");
  assert.equal(texGovor("a^3"), "a na kub");
  assert.equal(texGovor("2^{10}"), "2 na 10");
  assert.equal(texGovor("a_1, a_2, \\dots, a_n"), "a 1, a 2, in tako naprej, a n");
  assert.equal(texGovor("x_{n+1}"), "x indeks n plus 1");
});

test("texGovor: funkcije, absolutna vrednost, množice, stopinje, besedilo", () => {
  assert.equal(texGovor("|x-2|<5"), "absolutna vrednost x minus 2, konec absolutne vrednosti, je manjše od 5");
  assert.equal(texGovor("\\left|x\\right|"), "absolutna vrednost x, konec absolutne vrednosti");
  assert.equal(texGovor("\\sin^2\\alpha+\\cos^2\\alpha=1"), "sinus na kvadrat alfa plus kosinus na kvadrat alfa je enako 1");
  assert.equal(texGovor("\\log_2 8 = 3"), "logaritem z osnovo 2, 8 je enako 3");
  assert.equal(texGovor("\\lim_{x\\to 0}\\frac{\\sin x}{x}"), "limita, x gre proti 0, ulomek, števec sinus x, imenovalec x, konec ulomka");
  assert.equal(texGovor("\\int_0^1 x\\,dx"), "integral od 0 do 1 x d x");
  assert.equal(texGovor("45^\\circ"), "45 stopinj");
  assert.equal(texGovor("20\\,\\%"), "20 odstotkov");
  assert.equal(texGovor("\\{x \\mid x>0\\}"), "zaviti oklepaj x za katere velja x je večje od 0 zaviti zaklepaj");
  assert.equal(texGovor("\\vec{a}\\cdot\\vec{b}"), "vektor a krat vektor b");
  assert.equal(texGovor("\\text{ni rešitve}"), "ni rešitve");
  assert.equal(texGovor("x \\le 3 \\Rightarrow x \\neq 4"), "x je manjše ali enako 3 sledi x ni enako 4");
  assert.equal(texGovor("1\\,000\\,000"), "1000000");
});

test("texGovor: oznake formul (\\htmlData) se ne slišijo, le označena črka", () => {
  assert.equal(texGovor("\\htmlData{fx=s.3A.40.3Av}{v}=\\frac{\\htmlData{fx=s.3A.40.3As}{s}}{t}"), "v je enako s skozi t");
});

test("texGovor: pokvarjen ali prazen zapis ne vrže napake", () => {
  for (const t of ["", null, undefined, "\\frac{", "x^", "}{", "\\left(", "\\sqrt["]) assert.equal(typeof texGovor(t), "string", String(t));
});

test("vsak živi jezik ima izgovor z vsemi besedami; drugi jeziki vzamejo prvega v verigi", () => {
  for (const j of LIVE_UI_LANGUAGES) assert.ok(JEZIKI_GOVORA.includes(j), j);
  const kljuci = (o) => Object.keys(o).sort();
  const sl = slovarGovora("sl");
  for (const j of JEZIKI_GOVORA) {
    const d = slovarGovora(j);
    assert.deepEqual(kljuci(d), kljuci(sl), j);
    assert.deepEqual(kljuci(d.fun), kljuci(sl.fun), `${j} fun`);
    for (const [k, v] of Object.entries(d)) if (typeof v === "string") assert.ok(v.trim(), `${j}.${k} prazen`);
    assert.match(d.nKoren("3"), /3/, `${j} nKoren`);
  }
  assert.equal(slovarGovora("sr", uiChain("sr")), slovarGovora("hr"));
  assert.equal(slovarGovora("fr", uiChain("fr")), slovarGovora("en"));
  assert.equal(texGovor("x^2 = 4", "en"), "x squared equals 4");
  assert.equal(texGovor("\\frac{a}{b}", "de"), "a durch b");
  assert.equal(texGovor("\\sqrt{2}", "hr"), "drugi korijen iz 2");
  assert.equal(texGovor("x \\ne 0", "it"), "x diverso da 0");
  assert.equal(texGovor("x \\le 2", "hu"), "x kisebb vagy egyenlő 2");
});

test("aplikacija naloži izgovor po prvem izrisu (ne v prvem odprtju)", () => {
  const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
  assert.match(app, /import\("\.\/mat\/govor\.js"\)\.then\(\(m\) => m\.initIzgovor\(currentLang, uiChain\)\)/);
  assert.doesNotMatch(app, /^import .*mat\/govor\.js/m);
});

const require = createRequire(import.meta.url);
let playwright = null;
try {
  playwright = require("playwright");
} catch {}
const PUB = path.resolve("public");
const KX = path.resolve("node_modules/katex/dist");
const PAGE = `<!doctype html><html lang="sl"><meta charset="utf-8"><link rel="stylesheet" href="/vendor/katex/katex.min.css"><script src="/vendor/katex/katex.min.js"></script>
<main id="m"></main>
<script type="module">
import { initIzgovor } from "/mat/govor.js";
const k = (tex) => katex.renderToString(tex, { throwOnError: false, output: "htmlAndMathml" });
window.k = k;
document.getElementById("m").innerHTML = \`
  <button id="b1" type="button">\${k("[0,\\\\pi]-\\\\left\\\\{\\\\frac{\\\\pi}{2}\\\\right\\\\}")}</button>
  <button id="b2" type="button"><span class="kv-l">A</span><span>\${k("x^2")}</span></button>
  <button id="b3" type="button" aria-label="Lastno ime">\${k("x")}</button>
  <button id="b4" type="button">Brez formule</button>
  <p id="p">Besedilo \${k("v=\\\\frac{s}{t}")}</p>\`;
initIzgovor(() => "sl", () => []);
window.ready = true;
</script>`;

test("brskalnik: gumb s samo formulo dobi ime, ki ga Chrome prebere; lastno ime ostane", { timeout: 120000 }, async (t) => {
  let browser = null;
  try {
    if (playwright) browser = await playwright.chromium.launch();
  } catch {}
  if (!browser) return t.skip("Playwright/Chromium ni nameščen");
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split("?")[0]);
    if (url === "/t.html") return res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(PAGE);
    const file = url.startsWith("/vendor/katex/") ? path.join(KX, url.slice(14)) : path.join(PUB, path.normalize(url));
    if (!(file.startsWith(PUB) || file.startsWith(KX)) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return res.writeHead(404).end();
    res.writeHead(200, { "content-type": file.endsWith(".js") ? "text/javascript" : file.endsWith(".css") ? "text/css" : "application/octet-stream" }).end(fs.readFileSync(file));
  });
  await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
  const page = await browser.newPage();
  t.after(async () => {
    await browser.close();
    server.close();
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/t.html`);
  await page.waitForFunction(() => window.ready && document.querySelector("#b1[aria-label]"));
  const label = (id) => page.evaluate((i) => document.getElementById(i).getAttribute("aria-label"), id);
  assert.equal(await label("b1"), "oglati oklepaj 0, pi oglati zaklepaj minus zaviti oklepaj pi skozi 2 zaviti zaklepaj");
  assert.equal(await label("b2"), "A x na kvadrat");
  assert.equal(await label("b3"), "Lastno ime");
  assert.equal(await label("b4"), null);
  assert.equal(await page.evaluate(() => document.getElementById("p").hasAttribute("aria-label")), false, "odstavek ni gumb");
  // Ime, kot ga izračuna Chrome (drevo dostopnosti), ni prazno.
  const cdp = await page.context().newCDPSession(page);
  const { nodes } = await cdp.send("Accessibility.getFullAXTree");
  const gumbi = nodes.filter((n) => n.role?.value === "button").map((n) => n.name?.value);
  assert.ok(gumbi.includes("oglati oklepaj 0, pi oglati zaklepaj minus zaviti oklepaj pi skozi 2 zaviti zaklepaj"), JSON.stringify(gumbi));
  assert.ok(!gumbi.includes(""), `gumb brez imena: ${JSON.stringify(gumbi)}`);
  // Nova vsebina (naslednja naloga): ime sledi formuli; brez formule naše ime izgine.
  await page.evaluate(() => (document.getElementById("b1").innerHTML = window.k("\\sqrt{2}")));
  await page.waitForFunction(() => document.getElementById("b1").getAttribute("aria-label") === "kvadratni koren iz 2");
  await page.evaluate(() => (document.getElementById("b1").textContent = "Besedilo"));
  await page.waitForFunction(() => !document.getElementById("b1").hasAttribute("aria-label"));
  // Nov gumb, dodan pozneje.
  await page.evaluate(() => document.getElementById("m").insertAdjacentHTML("beforeend", `<button id="b5" type="button">${window.k("\\frac{1}{2}")}</button>`));
  await page.waitForFunction(() => document.getElementById("b5").getAttribute("aria-label") === "1 skozi 2");
  assert.deepEqual(errors, []);
});

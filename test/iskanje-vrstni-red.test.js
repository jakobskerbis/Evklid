// Iskanje in lekcije v Učbeniku: odgovor starejše zahteve ne sme prepisati novejšega (iskalec 6).
// Prej: »ul« (počasen odgovor) je prišel za »ulomki« in na zaslonu so ostali zadetki za »ul«; prav tako je
// počasi naložena prej kliknjena lekcija prekrila pozneje kliknjeno. Pravi brskalnik (Playwright), če je nameščen.
import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { lessonView } from "../server/textbook.js";

const require = createRequire(import.meta.url);
let playwright = null;
try {
  playwright = require("playwright");
} catch {}

const PUB = path.resolve("public");
const TYPES = { ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".html": "text/html" };
const PAGE = `<!doctype html><meta charset="utf-8"><div id="view-textbook"></div>
<script type="module">
import { initTextbook, showTextbook, openLesson, textbookBack } from "/textbook.js";
const wait = (ms) => new Promise((ok) => setTimeout(ok, ms));
// Zakasnitve odgovorov: window.delay[q ali id lekcije] ms.
window.delay = {};
window.calls = [];
const api = async (url) => {
  const u = new URL(url, location.href);
  window.calls.push(u.pathname + u.search);
  if (u.pathname === "/api/textbook/books") return [{ key: "MAT-OS", subject: "MAT", school: "OS", subjectName: "Matematika", schoolName: "osnovna šola" }];
  if (u.pathname.endsWith("/path")) return { key: "MAT-OS-9" };
  if (u.pathname === "/api/textbook/toc") return { key: "MAT-OS", subject: "MAT", school: "OS", parts: [{ key: "MAT-OS-9", label: "Matematika, 9. razred", units: [{ title: "KAZALO", topics: [] }] }] };
  if (u.pathname === "/api/textbook/search") {
    const q = u.searchParams.get("q");
    await wait(window.delay[q] || 0);
    return [{ id: "MAT-OS-9/" + q, name: "ZADETEK " + q, unit: "u", pathLabel: "p", snippet: "" }];
  }
  if (u.pathname.endsWith("/lesson")) {
    const id = u.searchParams.get("id");
    await wait(window.delay[id] || 0);
    return { ...(await (await fetch("/t-lesson.json")).json()), id, name: "LEKCIJA " + id };
  }
  throw Object.assign(new Error("?"), { status: 404 });
};
initTextbook({ api, renderRich: (s) => s, escapeHtml: (s) => String(s), getStudent: () => ({ id: 1, settings: { subject: "MAT" } }),
  openTopic: async () => true, nextPractice() {}, learnWithTutor() {}, showView: () => showTextbook(), openLab() {}, open3d() {} });
Object.assign(window, { openLesson, textbookBack });
await showTextbook();
window.ready = true;
</script>`;

function serve() {
  const server = http.createServer((req, res) => {
    const url = req.url.split("?")[0];
    if (url === "/t-lesson.json") return res.writeHead(200, { "content-type": "application/json" }).end(JSON.stringify(lessonView("FIZ-OS-9/upor-in-ohmov-zakon")));
    if (url === "/t-tb.html") return res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(PAGE);
    const file = path.join(PUB, path.normalize(url));
    if (!file.startsWith(PUB) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return res.writeHead(404).end();
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" }).end(fs.readFileSync(file));
  });
  return new Promise((ok) => server.listen(0, "127.0.0.1", () => ok(server)));
}

let browser = null;
try {
  if (playwright) browser = await playwright.chromium.launch();
} catch {}
const skip = browser ? false : "Playwright/Chromium ni nameščen";

test("Učbenik: starejši odgovor ne prepiše novejšega", { skip }, async (t) => {
  const server = await serve();
  const base = `http://127.0.0.1:${server.address().port}`;
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  t.after(async () => {
    await browser.close();
    server.close();
  });
  await page.goto(`${base}/t-tb.html`);
  await page.waitForFunction(() => window.ready, null, { timeout: 15000 });
  const body = () => page.textContent("#tb-body");

  await t.test("počasen odgovor za »ul« ne prepiše zadetkov za »ulomki«", async () => {
    await page.evaluate(() => (window.delay.ul = 600));
    await page.fill("#tb-q", "ul");
    await page.waitForFunction(() => window.calls.some((c) => c.includes("q=ul&")));
    await page.fill("#tb-q", "ulomki");
    await page.waitForFunction(() => document.querySelector("#tb-body").textContent.includes("ZADETEK ulomki"));
    await page.waitForTimeout(900); // odgovor za »ul« je zdaj prišel
    const text = await body();
    assert.match(text, /ZADETEK ulomki/);
    assert.doesNotMatch(text, /ZADETEK ul(?!omki)/, "na zaslonu ostanejo zadetki zadnje poizvedbe");
  });

  await t.test("izbrisano iskanje: počasen odgovor ne prekrije kazala", async () => {
    await page.evaluate(() => (window.delay.ploscina = 600));
    await page.fill("#tb-q", "ploscina");
    await page.waitForFunction(() => window.calls.some((c) => c.includes("q=ploscina")));
    await page.fill("#tb-q", "");
    await page.waitForFunction(() => document.querySelector("#tb-body").textContent.includes("KAZALO"));
    await page.waitForTimeout(900);
    const text = await body();
    assert.match(text, /KAZALO/);
    assert.doesNotMatch(text, /ZADETEK/);
  });

  await t.test("lekcija, ki se nalaga, ne prekrije pozneje odprte strani", async () => {
    // Lekcija se nalaga dolgo; medtem se učenec vrne na seznam (Nazaj) in začne iskati.
    await page.evaluate(() => {
      window.delay["MAT-OS-9/pocasna"] = 600;
      window.openLesson("MAT-OS-9/pocasna");
    });
    await page.waitForFunction(() => window.calls.some((c) => c.includes("pocasna")));
    await page.evaluate(() => window.textbookBack());
    await page.waitForSelector("#tb-q");
    await page.fill("#tb-q", "koti");
    await page.waitForFunction(() => document.querySelector("#tb-body")?.textContent.includes("ZADETEK koti"));
    await page.waitForTimeout(900); // počasna lekcija je zdaj prišla
    assert.doesNotMatch(await page.textContent("#view-textbook"), /LEKCIJA MAT-OS-9\/pocasna/);
    assert.match(await body(), /ZADETEK koti/);
  });

  await t.test("od dveh kliknjenih lekcij ostane zadnja", async () => {
    await page.evaluate(() => {
      window.delay["MAT-OS-9/prva"] = 600;
      window.openLesson("MAT-OS-9/prva");
    });
    await page.waitForFunction(() => window.calls.some((c) => c.includes("prva")));
    await page.evaluate(() => window.openLesson("MAT-OS-9/druga"));
    await page.waitForFunction(() => document.querySelector("#view-textbook").textContent.includes("LEKCIJA MAT-OS-9/druga"));
    await page.waitForTimeout(900);
    const text = await page.textContent("#view-textbook");
    assert.match(text, /LEKCIJA MAT-OS-9\/druga/);
    assert.doesNotMatch(text, /LEKCIJA MAT-OS-9\/prva/);
  });

  assert.deepEqual(errors, []);
});

test("mobilna aplikacija: zadetki starejše poizvedbe se zavržejo", () => {
  const src = fs.readFileSync(new URL("../mobile/src/app/(tabs)/textbook.tsx", import.meta.url), "utf8");
  const i = src.indexOf("/api/textbook/search");
  const effect = src.slice(src.lastIndexOf("useEffect(", i), src.indexOf("}, [q,", i));
  assert.match(effect, /let alive = true/, "vsak zagon učinka ima svojo zastavico");
  assert.match(effect, /\.then\(\(h\) => alive && setHits\(h\)\)/);
  assert.match(effect, /\.catch\(\(\) => alive && setHits\(\[\]\)\)/);
  assert.match(effect, /alive = false;\s*clearTimeout\(timer\)/, "čiščenje učinka zavrže odgovor v teku");
});

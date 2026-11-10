// Hiter zagon, varnost posnetka zadnjega zaslona (pregled #560): HTML posnetka gre ob shranjevanju skozi DOMPurify
// (public/posnetek.js), ob odprtju pa še skozi ociscen() v public/zacetek.js (razčlenitev v <template>, brez nevarnih
// elementov, dogodkov in tujih naslovov). Nič se ne zažene in nič se ne naloži od drugod. Playwright (če je nameščen).
import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
let playwright = null;
try {
  playwright = require("playwright");
} catch {}

const PUB = path.resolve("public");
const DOMPURIFY = path.resolve("node_modules/dompurify/dist"); // kot server/app.js /vendor/dompurify/
const TYPES = { ".js": "text/javascript", ".html": "text/html" };
const PAGE = `<!doctype html><meta charset="utf-8"><script src="/zacetek.js"></script>
<script src="/vendor/dompurify/purify.min.js"></script><body><main id="view-chat" class="view chat-view"></main><nav id="tabbar"></nav></body>`;

function serve() {
  const server = http.createServer((req, res) => {
    const url = req.url.split("?")[0];
    if (url === "/t.html") return res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(PAGE);
    if (url === "/tuje") {
      server.tuje = (server.tuje || 0) + 1;
      return res.writeHead(404).end();
    }
    const base = url.startsWith("/vendor/dompurify/") ? DOMPURIFY : PUB;
    const file = path.join(base, path.normalize(url.startsWith("/vendor/dompurify/") ? url.slice("/vendor/dompurify/".length) : url));
    if (!file.startsWith(base) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return res.writeHead(404).end();
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" }).end(fs.readFileSync(file));
  });
  return new Promise((ok) => server.listen(0, "127.0.0.1", () => ok(server)));
}

let browser = null;
try {
  if (playwright) browser = await playwright.chromium.launch();
} catch {}
const skip = browser ? false : "Playwright/Chromium ni nameščen";

const ZLO = [
  '<p class="msg">zdravo <b>svet</b></p>',
  '<img src="/tuje" onerror="window.__zlo=1">',
  '<img src="http://127.0.0.2:9/x.png">',
  '<svg onload="window.__zlo=2"><a href="javascript:window.__zlo=3"><text>x</text></a></svg>',
  '<script>window.__zlo=4</script><iframe srcdoc="<script>parent.__zlo=5</script>"></iframe>',
  '<a href="javascript:alert(1)">a</a><a href="/pot">b</a><a href="https://drugje.example/">c</a>',
  '<div style="background:url(https://drugje.example/x.png)">s</div><div style="height:3em" data-zs="40">ok</div>',
  '<object data="https://drugje.example/x"></object><embed src="/x"><base href="https://drugje.example/"><link rel="stylesheet" href="/x.css">',
  '<form action="https://drugje.example/"><button formaction="javascript:1">g</button></form>',
].join("");

test("posnetek ob odprtju: ociscen() odstrani skripte, dogodke in tuje naslove; nič se ne zažene", { skip }, async () => {
  const server = await serve();
  const page = await browser.newPage();
  try {
    await page.goto(`http://127.0.0.1:${server.address().port}/t.html`);
    const r = await page.evaluate(async (h) => {
      const box = document.createElement("div");
      box.append(window.evklidZacetek.ociscen(h));
      document.body.append(box);
      await new Promise((ok) => setTimeout(ok, 300));
      return { html: box.innerHTML, zlo: window.__zlo ?? null };
    }, ZLO);
    assert.equal(r.zlo, null, "nič se ni zagnalo");
    assert.match(r.html, /<p class="msg">zdravo <b>svet<\/b><\/p>/, "vsebina ostane");
    assert.doesNotMatch(r.html, /<script|<iframe|<object|<embed|<base|<link|srcdoc/i);
    assert.doesNotMatch(r.html, /\son[a-z]+=/i, "brez dogodkov");
    assert.doesNotMatch(r.html, /javascript:/i);
    assert.doesNotMatch(r.html, /drugje\.example|127\.0\.0\.2/, "brez naslovov drugih izvorov");
    assert.match(r.html, /<a href="\/pot">b<\/a>/, "naslov istega izvora ostane");
    assert.match(r.html, /style="height:3em" data-zs="40"/);
    assert.equal(server.tuje ?? 0, 1, "slika istega izvora se naloži (le ob vstavitvi, ne med čiščenjem)");
  } finally {
    await page.close();
    server.close();
  }
});

test("posnetek ob shranjevanju: DOMPurify; zaklenjen profil (meta null) ali brez DOMPurify ga ni", { skip }, async () => {
  const server = await serve();
  const page = await browser.newPage();
  try {
    await page.goto(`http://127.0.0.1:${server.address().port}/t.html`);
    const r = await page.evaluate(async (h) => {
      const { shrani } = await import("/posnetek.js");
      document.getElementById("view-chat").innerHTML = h.replace(/<script[\s\S]*?<\/script>/, ""); // brez izvajanja v testu
      document.getElementById("view-chat").insertAdjacentHTML("beforeend", '<p onclick="window.__zlo=6">klik</p>');
      const KEY = "evklid.zadnji-posnetek";
      const rec = { v: "chat", t: Date.now(), s: 7 };
      shrani(KEY, rec, { a: "12", z: 1 });
      const shot = JSON.parse(localStorage.getItem(KEY));
      shrani(KEY, rec, null);
      const zaklenjen = localStorage.getItem(KEY);
      shrani(KEY, rec, { a: null, z: 0 });
      const dp = window.DOMPurify;
      delete window.DOMPurify;
      shrani(KEY, rec, { a: null, z: 0 });
      const brez = localStorage.getItem(KEY);
      window.DOMPurify = dp;
      return { shot, zaklenjen, brez };
    }, ZLO);
    assert.equal(r.shot.a, "12");
    assert.equal(r.shot.z, 1);
    assert.match(r.shot.h, /zdravo <b>svet<\/b>/);
    assert.doesNotMatch(r.shot.h, /\son[a-z]+=|javascript:|<iframe|<object|<embed/i);
    assert.equal(r.zaklenjen, null, "zaklenjen profil posnetka nima");
    assert.equal(r.brez, null, "brez DOMPurify posnetka ni");
  } finally {
    await page.close();
    server.close();
  }
});

test.after(() => browser?.close());

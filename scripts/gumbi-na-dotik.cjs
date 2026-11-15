// Gumbi na dotik v Safariju (iPad, iPhone; j 2026-11-15: »vsi gumbi na tej strani ne delajo«).
//
// Safari na iOS/iPadOS po dotiku najprej pošlje »mousemove« in nekaj deset milisekund opazuje stran
// (WebKit ContentChangeObserver). Če se v tem času na zaslonu pojavi NOV element, ki se odziva na klik
// (ima poslušalca click, mousedown ali mouseup), Safari misli, da je dotik odprl meni »ob lebdenju«,
// in klika ne pošlje. Simulacija, ki tak element nariše znova v vsaki sličici animacije (60-krat na sekundo),
// zato pokvari VSE gumbe na strani, ne le svojih (npr. destilacija v lekciji o ločevanju zmesi).
// Pravilo: animacija sme na novo risati oblike, gumbe in elemente s poslušalcem klika pa ustvari enkrat
// (ali posluša klik na stalnem staršu, npr. na sliki SVG).
//
// Ta skripta v Chromiumu postavi vsako simulacijo (vsi pogoni iz public/sim/index.js in vse možnosti iz
// kataloga) in šteje elemente s poslušalcem klika, ki se pojavijo sami od sebe (brez dotika), najprej
// takoj, nato po kliku na glavni gumb (npr. »Predvajaj«). Izhod 1, če jih kje najde.
// Zagon: node scripts/gumbi-na-dotik.cjs [id …] [--json]
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const PUB = path.join(__dirname, "..", "public");
const TYPES = { ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".glb": "model/gltf-binary", ".woff2": "font/woff2", ".wasm": "application/wasm" };

// Poslušalci, zaradi katerih WebKit element šteje za »klikljiv« (EventCategory::MouseClickRelated).
const OPAZUJ = `(() => {
  const KLIK = new Set(["click", "mousedown", "mouseup", "auxclick", "DOMActivate"]);
  const add = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (type, ...rest) {
    if (KLIK.has(type) && this instanceof Element) this.__klik = true;
    return add.call(this, type, ...rest);
  };
  for (const P of [HTMLElement.prototype, SVGElement.prototype])
    for (const k of ["onclick", "onmousedown", "onmouseup"]) {
      const d = Object.getOwnPropertyDescriptor(P, k);
      if (d?.set) Object.defineProperty(P, k, { ...d, set(v) { if (v) this.__klik = true; d.set.call(this, v); } });
    }
  window.__najdbe = [];
  window.__stej = false;
  // Brez poslušalca so klikljivi še omogočeni gumbi in polja, povezave, <summary>, okvirji in urejljivo besedilo
  // (WebKit: HTMLButtonElement, HTMLInputElement, HTMLSelectElement, HTMLAnchorElement … willRespondToMouseClickEvents).
  const SAM = "button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea, a[href], summary, iframe, label:has(input, select, textarea)";
  const klikljiv = (el) => (el.__klik || el.isContentEditable || el.matches(SAM)) && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== "hidden";
  new MutationObserver((recs) => {
    if (!window.__stej) return;
    for (const r of recs)
      for (const n of r.addedNodes) {
        if (!(n instanceof Element) || !n.isConnected) continue;
        for (const el of [n, ...n.querySelectorAll("*")])
          if (klikljiv(el)) {
            window.__najdbe.push({ t: performance.now(), opis: el.tagName.toLowerCase() + (el.getAttribute("class") ? "." + el.getAttribute("class").trim().split(/\\s+/).join(".") : "") });
            break;
          }
      }
  }).observe(document, { childList: true, subtree: true });
})();`;

const STRAN = `<!doctype html><html lang="sl"><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<link rel="stylesheet" href="/style.css"><script>${OPAZUJ}</script>
<body><div id="oder" style="max-width:900px"></div>
<script type="module">
  import { mountSim } from "/sim/index.js";
  window.__postavi = async (id, opts) => {
    const box = document.getElementById("oder");
    box.replaceChildren();
    const el = document.createElement("div");
    box.append(el);
    return mountSim(id, el, opts || {});
  };
  window.__pripravljeno = true;
</script></body></html>`;

function streznik() {
  const srv = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split("?")[0]);
    if (url === "/" || url === "/t.html") return res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(STRAN);
    const file = path.join(PUB, path.normalize(url));
    if (!file.startsWith(PUB) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return res.writeHead(404).end();
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" }).end(fs.readFileSync(file));
  });
  return new Promise((ok) => srv.listen(0, "127.0.0.1", () => ok(srv)));
}

// Vse simulacije: vsak pogon brez možnosti in vsaka različica možnosti iz kataloga.
async function seznam() {
  const { ENGINES } = await import(pathToFileURL(path.join(PUB, "sim", "index.js")).href);
  const { SIM_TOPICS } = await import(pathToFileURL(path.join(PUB, "sim", "katalog.js")).href);
  const out = new Map();
  for (const id of Object.keys(ENGINES)) if (id !== "zbirka" && id !== "3d") out.set(id, { id, opts: {} });
  for (const v of Object.values(SIM_TOPICS)) {
    const list = Array.isArray(v[0]) ? v : [v];
    for (const [id, , opts] of list) {
      if (!id || id === "zbirka") continue;
      const k = `${id}:${JSON.stringify(opts || {})}`;
      if (!out.has(k) && !out.has(id + (opts && Object.keys(opts).length ? k : ""))) out.set(k, { id, opts: opts || {} });
    }
  }
  return [...out.values()];
}

// Šteje le, kar se ponavlja: elementi, ki se pojavijo v vsaj dveh trenutkih, vsaj 200 ms narazen (animacija).
// Enkratna sprememba (npr. vklopi prikaza, ko met pristane, ali plošča 3D modela, ko se naloži) ne pokvari dotikov.
function ponavlja(najdbe) {
  if (!najdbe.length) return [];
  const t = najdbe.map((n) => n.t);
  return Math.max(...t) - Math.min(...t) >= 200 ? najdbe.map((n) => n.opis) : [];
}

// Preveri seznam simulacij; vrne [{ id, opts, najdbe: [opisi elementov] }] za tiste z najdbami.
async function preveri({ ids = null, vzporedno = 6, chromium = null, mirovanje = 1200, gumbiNajvec = 4 } = {}) {
  const pw = chromium || require("playwright").chromium;
  const browser = await pw.launch();
  const srv = await streznik();
  const base = `http://127.0.0.1:${srv.address().port}/t.html`;
  let vse = await seznam();
  if (ids?.length) vse = vse.filter((s) => ids.includes(s.id));
  const slabi = [];
  const napake = [];
  try {
    const ctx = await browser.newContext({ viewport: { width: 1024, height: 1366 }, hasTouch: true, isMobile: true, locale: "sl-SI", reducedMotion: "no-preference", serviceWorkers: "block" });
    let i = 0;
    const delavec = async () => {
      const p = await ctx.newPage();
      p.on("pageerror", (e) => napake.push(`${p.__id}: ${e.message}`));
      await p.goto(base);
      await p.waitForFunction(() => window.__pripravljeno);
      while (i < vse.length) {
        const s = vse[i++];
        p.__id = s.id;
        try {
          await p.evaluate(([id, opts]) => window.__postavi(id, opts), [s.id, s.opts]);
          await p.waitForTimeout(400);
          const najdbe = [];
          const stej = async () => {
            await p.evaluate(() => ((window.__najdbe = []), (window.__stej = true)));
            await p.waitForTimeout(mirovanje);
            najdbe.push(...ponavlja(await p.evaluate(() => ((window.__stej = false), window.__najdbe))));
          };
          await stej();
          // Gumbi simulacije (Predvajaj, Začni, Spusti …) zaženejo animacijo, ki se morda ne začne sama.
          // Brez »Ponastavi« in vklopov prikaza na grafu; največ toliko gumbov, kolikor jih določa »gumbi«.
          const gumbi = p.locator("#oder .demo-buttons button:not(.demo-reset):not(.layer-chip)");
          const n = Math.min(await gumbi.count(), gumbiNajvec);
          for (let k = 0; k < n && !najdbe.length; k++) {
            await gumbi.nth(k).click({ timeout: 1000 }).catch(() => {});
            await p.waitForTimeout(150);
            await stej();
          }
          if (najdbe.length) slabi.push({ id: s.id, opts: s.opts, najdbe: [...new Set(najdbe)].slice(0, 4), stevilo: najdbe.length });
        } catch (e) {
          napake.push(`${s.id}: ${e.message.split("\n")[0]}`);
        }
      }
      await p.close();
    };
    await Promise.all(Array.from({ length: Math.min(vzporedno, vse.length) }, delavec));
  } finally {
    await browser.close();
    srv.close();
  }
  return { slabi, napake, skupaj: vse.length };
}

module.exports = { preveri, seznam, ponavlja, OPAZUJ };

if (require.main === module) {
  const args = process.argv.slice(2);
  const ids = args.filter((a) => !a.startsWith("--"));
  preveri({ ids }).then(({ slabi, napake, skupaj }) => {
    if (args.includes("--json")) console.log(JSON.stringify({ slabi, napake, skupaj }, null, 1));
    else {
      for (const s of slabi) console.log(`✗ ${s.id} ${JSON.stringify(s.opts)}: ${s.stevilo}× nov klikljiv element (${s.najdbe.join(", ")})`);
      for (const n of napake) console.log(`! ${n}`);
      console.log(`${skupaj} simulacij, ${slabi.length} z gumbi, ki na dotik v Safariju ne bi delali.`);
    }
    process.exit(slabi.length ? 1 : 0);
  });
}

// Service worker po objavi nove različice ne sme mešati stare vstopne strani / app.js z novimi lenimi moduli
// (pregled PR #481, točka 1, scenarij »swmix«). Pravi brskalnik (Playwright Chromium, service worker vklopljen).
// »Objavo« posnemamo s posredniškim strežnikom pred aplikacijo: v načinu »nova« ima stran drugo različico
// datotek (glava X-Evklid-App, <meta name="evklid-app">, APP v sw.js, /healthz/stanje) in spremenjene
// /, /app.js in /graph/tools.js. Datotek v public/ ne spreminjamo (testi tečejo vzporedno).
import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { createRequire } from "node:module";
import { createApp } from "../server/app.js";
import { openDb } from "../server/db.js";

const require = createRequire(import.meta.url);
let chromium = null;
try {
  chromium = await require("playwright").chromium.launch();
} catch {}

const NEW = "nova0000test";
const CHANGED = new Set(["/", "/index.html", "/sw.js", "/app.js", "/graph/tools.js", "/healthz/stanje"]);

async function withDeploy(fn) {
  const app = createApp(openDb(":memory:"), { scheduler: false, log: { error() {}, warn() {}, info() {} } });
  const upstream = app.listen(0);
  const up = `http://127.0.0.1:${upstream.address().port}`;
  const old = (await (await fetch(`${up}/healthz/stanje`)).json()).datoteke;
  assert.ok(old, "/healthz/stanje pove različico datotek");
  const state = { mode: "stara", delayEntry: 0 };
  const proxy = http.createServer(async (req, res) => {
    const url = new URL(req.url, up);
    const changed = state.mode === "nova" && CHANGED.has(url.pathname);
    const headers = { ...req.headers, host: new URL(up).host };
    if (changed) {
      delete headers["if-none-match"];
      delete headers["if-modified-since"];
      headers["accept-encoding"] = "identity";
    }
    if (changed && url.pathname === "/" && state.delayEntry > 0) {
      const ms = state.delayEntry;
      state.delayEntry = 0; // samo prva zahteva (počasno omrežje), ponovna je hitra
      await new Promise((r) => setTimeout(r, ms));
    }
    const r = await fetch(up + req.url, { method: req.method, headers, redirect: "manual" }).catch(() => null);
    if (!r) return res.writeHead(502).end();
    const out = {};
    r.headers.forEach((v, k) => {
      if (!["content-length", "content-encoding", "transfer-encoding", "connection", "etag"].includes(k) || !changed) out[k] = v;
    });
    let body = Buffer.from(await r.arrayBuffer());
    if (changed) {
      let text = body.toString("utf8").split(old).join(NEW);
      if (url.pathname === "/" || url.pathname === "/index.html") text = text.replace("</body>", "<!--NOVA-->\n</body>");
      if (url.pathname === "/app.js") text += "\n;window.__evklidNova = 1;\n";
      if (url.pathname === "/graph/tools.js") text += "\n//NOVA\n";
      if (out["x-evklid-app"]) out["x-evklid-app"] = NEW;
      body = Buffer.from(text);
      out["cache-control"] = "no-store";
      // fetch() je že razpakiral telo
      delete out["content-encoding"];
    } else {
      delete out["content-encoding"];
      delete out["content-length"];
      delete out["transfer-encoding"];
    }
    res.writeHead(r.status, out);
    res.end(req.method === "HEAD" ? undefined : body);
  });
  proxy.listen(0);
  const base = `http://localhost:${proxy.address().port}`;
  try {
    await fn(base, state);
  } finally {
    proxy.close();
    upstream.close();
  }
}

// Stara različica se namesti in shrani (service worker nadzira stran, app.js in leni graph/tools.js v predpomnilniku).
async function installOld(ctx, base) {
  const p = await ctx.newPage();
  await p.goto(base + "/");
  await p.waitForFunction(() => navigator.serviceWorker?.controller, null, { timeout: 30000 });
  await p.reload();
  await p.waitForTimeout(2500);
  await p.evaluate(() => fetch("/graph/tools.js").then((r) => r.text()));
  await p.waitForTimeout(800);
  assert.equal(await p.evaluate(() => document.documentElement.outerHTML.includes("NOVA")), false);
  return p;
}

const opts = { skip: chromium ? false : "Playwright Chromium ni nameščen", timeout: 120000 };

test("po objavi: prvo odprtje je nova vstopna stran z novim app.js, leni modul tudi nov (brez mešanja)", opts, async () => {
  await withDeploy(async (base, state) => {
    const ctx = await chromium.newContext({ serviceWorkers: "allow" });
    try {
      const p = await installOld(ctx, base);
      state.mode = "nova";
      await p.goto(base + "/");
      assert.equal(await p.evaluate(() => document.documentElement.outerHTML.includes("NOVA")), true, "nova vstopna stran");
      await p.waitForFunction(() => window.__evklidNova === 1, null, { timeout: 15000 });
      await p.waitForTimeout(3000); // nov service worker se medtem namesti in prevzame stran
      assert.equal(await p.evaluate(() => fetch("/graph/tools.js").then((r) => r.text()).then((t) => t.includes("//NOVA"))), true, "leni modul nove različice");
      assert.equal(await p.evaluate(() => window.__evklidNova), 1, "stran izvaja novi app.js (ni mešanice)");
    } finally {
      await ctx.close();
    }
  });
});

test("po objavi ob počasnem omrežju: stara stran iz predpomnilnika se sama osveži v novo", opts, async () => {
  await withDeploy(async (base, state) => {
    const ctx = await chromium.newContext({ serviceWorkers: "allow" });
    try {
      const p = await installOld(ctx, base);
      state.mode = "nova";
      state.delayEntry = 6000; // daljše od roka vstopne strani v sw.js: postreže se shranjena (stara) stran
      await p.goto(base + "/");
      // stara stran ve, da je stara (meta), strežnik pove novo različico -> osvežitev, nato nova stran in app.js
      await p.waitForFunction(() => window.__evklidNova === 1 && document.documentElement.outerHTML.includes("NOVA"), null, { timeout: 30000 });
    } finally {
      await ctx.close();
    }
  });
});

test.after(() => chromium?.close());

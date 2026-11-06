// Menjava jezika na iPadu (j, 6. 11.: »Ko menjaš jezik, se aplikacija na iPadu ne naloži pravilno.«).
// Vzrok: top-level await v public/i18n.js in Safarijeva napaka WebKit 242740 (modul s top-level await,
// ki ga uvaža več modulov hkrati) – v drugih jezikih kot slovenščini se app.js ni izvedel do konca.
// 1) noben modul v public/ nima top-level await; strani zaženejo module samo prek public/zagon.js;
// 2) v pravem brskalniku (Playwright WebKit iPad, ležeče in pokončno, ter Chromium tablica, če sta
//    nameščena): menjava sl → sr-Latn → ar (RTL) → de → sl in prvo nalaganje v jeziku naprave; prevodi
//    zamujajo (počasna povezava), stran se mora vseeno izrisati v celoti (ikone, obrazec, brez napak).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { createApp } from "../server/app.js";
import { openDb } from "../server/db.js";

const PUB = path.resolve("public");

function jsFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) return d.name === "vendor" ? [] : jsFiles(p);
    return /\.m?js$/.test(d.name) ? [p] : [];
  });
}

test("no module in public/ uses top-level await (Safari bug WebKit 242740)", () => {
  const bad = [];
  for (const f of jsFiles(PUB)) {
    const src = fs.readFileSync(f, "utf8");
    // Vrstica brez zamika (raven modula), ki ni komentar, z await ali for await.
    src.split("\n").forEach((line, i) => {
      if (/^(?!\s|\/\/|\/?\*|\})(?:export\s+)?(?:(?:const|let|var)\b[^=]*=\s*)?(?:for\s+)?await\b/.test(line)) bad.push(`${path.relative(PUB, f)}:${i + 1}`);
    });
  }
  assert.deepEqual(bad, []);
});

test("every page starts its modules through zagon.js, and the listed modules exist", () => {
  const pages = fs.readdirSync(PUB).filter((f) => f.endsWith(".html"));
  for (const page of pages) {
    const html = fs.readFileSync(path.join(PUB, page), "utf8");
    const mods = [...html.matchAll(/<script\b[^>]*type="module"[^>]*>/g)].map((m) => m[0]);
    if (!mods.length) continue;
    assert.equal(mods.length, 1, `${page}: en sam modul (zagon.js)`);
    const m = mods[0].match(/src="\/?zagon\.js" data-moduli="([^"]+)"/);
    assert.ok(m, `${page}: ${mods[0]}`);
    for (const ref of m[1].split(/\s+/)) assert.ok(fs.existsSync(path.join(PUB, ref.replace(/^\.?\//, ""))), `${page}: ${ref}`);
  }
  const i18n = fs.readFileSync(path.join(PUB, "i18n.js"), "utf8");
  assert.match(i18n, /export const ready = /);
});

// ---------- pravi brskalnik ----------
const require = createRequire(import.meta.url);
let pw = null;
try {
  pw = require("playwright");
} catch {}
async function launch(kind) {
  try {
    return pw ? await pw[kind].launch() : null;
  } catch {
    return null;
  }
}
const webkit = await launch("webkit");
const chromium = await launch("chromium");

async function withApp(fn) {
  const app = createApp(openDb(":memory:"), { scheduler: false, log: { error() {}, warn() {}, info() {} } });
  const server = app.listen(0);
  try {
    await fn(`http://127.0.0.1:${server.address().port}`);
  } finally {
    server.close();
  }
}

// Stran je izrisana do konca: jezik, smer, vse ikone (app.js jih nadomesti), obrazec, brez napak strani.
async function check(p, errors, lang, dir = "ltr") {
  await p.waitForSelector("#onboard-form", { state: "visible", timeout: 15000 });
  await p.waitForFunction(() => !document.querySelector("i[data-icon]"), null, { timeout: 15000 });
  const s = await p.evaluate(() => ({ lang: document.documentElement.lang, dir: document.documentElement.dir, sel: document.querySelector("#onboard-form .lang-select")?.value }));
  assert.deepEqual(s, { lang, dir, sel: lang });
  assert.deepEqual(errors, [], `napake strani (${lang})`);
}

const DEVICES = [
  ["webkit", "iPad Pro 11"],
  ["webkit", "iPad Pro 11 landscape"],
  ["chromium", "Galaxy Tab S4"],
];
for (const [kind, dev] of DEVICES) {
  const browser = kind === "webkit" ? webkit : chromium;
  test(`language switch reloads fully: ${kind} ${dev}`, { skip: browser ? false : `Playwright ${kind} ni nameščen` }, async () => {
    await withApp(async (base) => {
      // Prvo nalaganje v jeziku naprave (nemščina), prevodi zamujajo 800 ms.
      const ctx = await browser.newContext({ ...pw.devices[dev], locale: "de-DE", serviceWorkers: "block" });
      try {
        await ctx.route("**/i18n/ui/*.json", async (r) => {
          await new Promise((ok) => setTimeout(ok, 800));
          await r.continue();
        });
        const p = await ctx.newPage();
        const errors = [];
        p.on("pageerror", (e) => errors.push(e.message));
        await p.goto(base + "/");
        await check(p, errors, "de");
        for (const [lang, dir] of [["sr-Latn"], ["ar", "rtl"], ["sl"], ["en"]]) {
          await Promise.all([
            p.waitForEvent("load", { timeout: 15000 }),
            p.selectOption("#onboard-form .lang-select", lang, { force: true }),
          ]);
          await check(p, errors, lang, dir);
        }
      } finally {
        await ctx.close();
      }
    });
  });
}

test.after(async () => {
  await webkit?.close();
  await chromium?.close();
});

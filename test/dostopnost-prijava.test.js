// Dostopnost zavihkov po prijavi (iskalec 8; pregled vseh zavihkov profila OŠ na telefonu in računalniku, svetlo/temno):
// polje klepeta in polje za ime novega profila sta imela samo placeholder (bralnik zaslona ga ne bere zanesljivo),
// oznaka »Novo« v Igrah je imela kontrast 3,3 : 1 (AA za majhno besedilo zahteva 4,5 : 1). In /sole brez računov
// ni nikoli dosegla »networkidle«: telo odgovora 404 /api/podari ni bilo prebrano, zato brskalnik zahteve ni zaključil.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

const read = (f) => fs.readFileSync(new URL(`../public/${f}`, import.meta.url), "utf8");
const html = read("index.html");
const ui = (lang) => JSON.parse(read(`i18n/ui/${lang}.json`));

test("polje klepeta in ime novega profila imata ime za bralnik zaslona (prevedeno)", async () => {
  const input = html.match(/<textarea id="input"[^>]*>/)[0];
  assert.match(input, /aria-label="[^"]+"/);
  assert.match(input, /data-i18n-aria="chat.placeholder"/);
  const name = html.match(/<form id="new-student-form"[\s\S]*?<input [^>]*>/)[0];
  assert.match(name, /aria-label="[^"]+"/);
  assert.match(name, /data-i18n-aria="set.name"/);
  const { default: sl } = await import("../public/i18n/sl.js");
  for (const k of ["chat.placeholder", "set.name"]) {
    assert.ok(sl[k], `sl ${k}`);
    for (const f of fs.readdirSync(new URL("../public/i18n/ui/", import.meta.url))) assert.ok(ui(f.replace(".json", ""))[k], `${f} ${k}`);
  }
});

const lum = (hex) => {
  const [r, g, b] = hex.match(/[0-9a-f]{2}/gi).map((x) => parseInt(x, 16) / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);

test("oznaka »Novo« v Igrah: kontrast vsaj 4,5 : 1", () => {
  const rule = read("games.css").match(/\.gm-new \{([^}]*)\}/)[1];
  const color = rule.match(/(?:^|;)\s*color:\s*(#[0-9a-f]{3,6})/i)[1].replace(/^#fff$/i, "#ffffff");
  const bg = rule.match(/background:\s*(#[0-9a-f]{6})/i)[1];
  assert.ok(ratio(color, bg) >= 4.5, `${color} na ${bg}: ${ratio(color, bg).toFixed(2)}`);
});

const require = createRequire(import.meta.url);
let playwright = null;
try {
  playwright = require("playwright");
} catch {}

test("/sole brez računov doseže networkidle (telo 404 /api/podari zavrženo)", { skip: !playwright && "Playwright ni nameščen", timeout: 60_000 }, async () => {
  const srv = createApp(openDb(":memory:"), { scheduler: false }).listen(0);
  const browser = await playwright.chromium.launch();
  try {
    const p = await browser.newPage();
    const podari = p.waitForResponse((r) => r.url().endsWith("/api/podari"));
    await p.goto(`http://127.0.0.1:${srv.address().port}/sole`, { waitUntil: "networkidle", timeout: 15_000 });
    assert.equal((await podari).status(), 404, "brez računov /api/podari ne obstaja");
    assert.equal(await p.locator("#podari").isHidden(), true, "razdelek ostane skrit");
  } finally {
    await browser.close();
    srv.close();
  }
});

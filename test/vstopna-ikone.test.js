// Utripanje ob odprtju (j 16. 11. 2026: »vedno ko odprem evklida se zaslon osveži in utripne«): ikone vstopne strani
// pridejo že izrisane s strežnika (server/vstopna-stran.js), ne šele z app.js, zato glava, spodnja vrstica in pasici ob
// odprtju ne poskočijo.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { entryHtml, withIcons } from "../server/vstopna-stran.js";
import { icon } from "../public/icons.js";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const pub = path.join(root, "public");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

test("vstopna stran: vse ikone že izrisane, enako kot icons.js icon(), z oznako data-zg", () => {
  const src = read("public/index.html");
  const names = [...src.matchAll(/<i data-icon="([a-z0-9-]+)"><\/i>/g)].map((m) => m[1]);
  assert.ok(names.length > 50, "index.html ima ikone");
  const { html } = entryHtml(pub, { version: "abc", preload: false });
  assert.doesNotMatch(html, /<i data-icon=/, "nobena ikona ne čaka na app.js");
  for (const n of new Set(["kristal", "map", "user", "star", "flame", "x", ...names])) assert.ok(html.includes(icon(n).replace("<svg ", "<svg data-zg ")), n);
  assert.equal((html.match(/<svg data-zg class="i "/g) || []).length, names.length);
  // Ostalo je nespremenjeno (oznaka različice za service worker).
  assert.match(html, /<meta name="evklid-app" content="abc">/);
});

test("vstopna stran: neznano ime ikone ostane <i> (dopolni ga app.js kot prej)", () => {
  assert.equal(withIcons('<b><i data-icon="ni-take-ikone"></i></b>'), '<b><i data-icon="ni-take-ikone"></i></b>');
  assert.equal(withIcons('<i data-icon="map"></i>'), icon("map").replace("<svg ", "<svg data-zg "));
});

test("zgodovinski slog: strežnikove ikone počakajo ikone obdobja (brez utripa privzete ikone)", () => {
  assert.match(read("public/style.css"), /html\[data-era\]:not\(\[data-ikone\]\) body > :not\(main\[data-posnetek\]\) svg\.i\[data-zg\] \{ visibility: hidden; \}/);
  // icons.js je ustvarjen s scripts/build-icons.js: oba imata isto vrstico.
  for (const line of ['useEra(document.documentElement.dataset.era || "").finally(ikone);', "setTimeout(ikone, 1500);"]) {
    assert.ok(read("public/icons.js").includes(line), line);
    assert.ok(read("scripts/build-icons.js").includes(line), line);
  }
});

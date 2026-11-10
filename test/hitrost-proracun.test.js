// Proračun hitrosti (naloga hitrost, j 6. 11. 2026): prvo odprtje ne sme rasti brez razloga, težke
// knjižnice in orodja se naložijo šele ob uporabi, vstopna stran vnaprej naloži vse module prvega odprtja.
// Meritev časov v brskalniku: node scripts/meri-hitrost.cjs (tabela v poročilu naloge).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";
import { startupFiles } from "../server/startup-files.js";
import { entryHtml } from "../server/vstopna-stran.js";

const pub = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public");
const own = startupFiles(pub, "index.html").filter((u) => u !== "/" && !u.startsWith("/vendor/"));
const br = (u) => zlib.brotliCompressSync(fs.readFileSync(path.join(pub, u)), { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 9 } }).length;

// Ob nastanku (6. 11. 2026): 128 datotek, ~690 KB stisnjeno, največja ~60 KB (i18n/sl.js, app.js).
// 10. 11. 2026 (#479, j potrdil 10. 11.): +30 KB za public/nujno.js (lokalni zaznavalnik nujnih primerov, ~24 KB stisnjeno).
// Ostane del prvega odprtja namenoma: okno z nujno pomočjo mora delovati takoj ob pošiljanju in brez povezave.
// 10. 11. 2026 (#553, čaka potrditev j): +5 KB za nove znake lokalnega zaznavalnika (public/nujno.js +3 KB stisnjeno; prvo odprtje 811,4 KB).
// 10. 11. 2026 (#560, j potrdil 10. 11.: 815 → 819 KB): +5 KB za hiter zagon (public/zacetek.js pokaže posnetek zadnjega zaslona, ga
// očisti in preveri račun/profil, klice zagona začne že v <head>; zamenjava posnetka s pravim pogledom v app.js);
// prvo odprtje 814,4 → 818,7 KB (main po #556). Shranjevanje posnetka (public/posnetek.js) se naloži po zagonu in ne šteje sem.
const BUDGET = { files: 140, totalKB: 819, fileKB: 75 };

test("prvo odprtje: velikost stisnjenih datotek v proračunu", () => {
  assert.ok(own.length <= BUDGET.files, `${own.length} datotek ob prvem odprtju (proračun ${BUDGET.files}); novo veliko kodo naloži z import() ob uporabi`);
  const sizes = own.map((u) => [u, br(u)]);
  const total = sizes.reduce((a, [, n]) => a + n, 0) / 1024;
  assert.ok(total <= BUDGET.totalKB, `prvo odprtje ${total.toFixed(0)} KB stisnjeno (proračun ${BUDGET.totalKB} KB)`);
  for (const [u, n] of sizes) assert.ok(n / 1024 <= BUDGET.fileKB, `${u}: ${(n / 1024).toFixed(0)} KB stisnjeno (proračun ${BUDGET.fileKB} KB na datoteko)`);
});

test("težka orodja niso del prvega odprtja (naložijo se ob uporabi ali ob nedejavnosti)", () => {
  for (const u of ["/graph/calc.js", "/graph/sci.js", "/graph/tools.js", "/3d/modeli.js", "/games/index.js"]) {
    assert.ok(!own.includes(u), `${u} se naloži ob prvem odprtju`);
  }
  assert.ok(!startupFiles(pub, "index.html").some((u) => u.startsWith("/vendor/three")), "three.js ob prvem odprtju");
});

test("vstopna stran vnaprej naloži vse module prvega odprtja (brez slapa uvozov)", () => {
  const { html, modules } = entryHtml(pub);
  assert.ok(modules.includes("/app.js") && modules.length > 20);
  for (const u of modules) {
    assert.ok(fs.existsSync(path.join(pub, u)), `${u} ne obstaja`);
    assert.ok(html.includes(`<link rel="modulepreload" href="${u}">`), u);
  }
  // navadne skripte (theme.js, knjižnice) niso moduli
  assert.ok(!html.includes('modulepreload" href="/theme.js"'));
  assert.ok(html.indexOf("modulepreload") < html.indexOf("</head>"));
});

test("strežnik pošlje vstopno stran z modulepreload, stisnjeno in s 304", async () => {
  const { createApp } = await import("../server/app.js");
  const { openDb } = await import("../server/db.js");
  const server = createApp(openDb(":memory:")).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const res = await fetch(`${base}/`, { headers: { "accept-encoding": "br" } });
    assert.equal(res.status, 200);
    assert.match(res.headers.get("content-type"), /text\/html/);
    const text = await res.text();
    assert.match(text, /<link rel="modulepreload" href="\/app\.js">/);
    const again = await fetch(`${base}/index.html`, { headers: { "accept-encoding": "br", "if-none-match": res.headers.get("etag") } });
    assert.equal(again.status, 304);
  } finally {
    server.close();
  }
});

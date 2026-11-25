// AUDIT-055: v načinu DEG in GRA je sproten predogled odvoda in integrala računal v stopinjah, rezultat po = pa v
// radianih (∫(sin(x);0;π): predogled ≈ 0,0861, rezultat 2; d/dx(sin(x);0): 0,01745 proti 1). Dogovor: odvodi in
// integrali so vedno v radianih (docs/oblikovanje.md »Enota kota«), predogled in rezultat sta enaka.
import { test } from "node:test";
import assert from "node:assert/strict";
import { analyze } from "../public/graph/scisolve.js";
import { analyzeLive } from "../public/graph/sci-vnos.js";

test("predogled = rezultat za odvode in integrale v DEG, RAD in GRA", () => {
  for (const t of ["∫(sin(x);0;π)", "d/dx(sin(x);0)", "∫(cos(x)²;0;1)+1", "d/dx(tan(x);π/4)·2", "∫_0^π sin(x) dx", "sin(30)+∫(x;0;1)", "∫(sin(x);0;90°)", "∫((arctan(x)·180/π); 0; 1)"]) {
    for (const angle of ["deg", "rad", "grad"]) {
      const env = { vars: {}, funcs: {}, ans: 0, deg: angle === "deg", grad: angle === "grad", comma: true };
      const live = analyzeLive(t, env);
      const done = analyze(t, env);
      assert.ok(live && !live.error && done && !done.error, `${t} ${angle}`);
      assert.ok(Math.abs(live.value - done.value) <= 1e-9 * Math.max(1, Math.abs(done.value)), `${t} (${angle}): predogled ${live.value}, rezultat ${done.value}`);
    }
  }
  const env = { vars: {}, funcs: {}, ans: 0, deg: true, comma: true };
  assert.ok(Math.abs(analyzeLive("∫(sin(x);0;π)", env).value - 2) < 1e-9);
  assert.ok(Math.abs(analyzeLive("d/dx(sin(x);0)", env).value - 1) < 1e-9);
  // radiani le znotraj ∫ in d/dx: ostanek vrstice v izbrani enoti (pregled #1005)
  for (const [t, want] of [["sin(30)+∫(x;0;1)", 1], ["cos(60)+∫(1;0;1)", 1.5], ["sin(30)·d/dx(x^2;1)", 1], ["sin(30°)+d/dx(cos(x);0)", 0.5], ["∫(sin(x);0;90°)", 1]]) {
    for (const f of [analyze, analyzeLive]) assert.ok(Math.abs(f(t, env).value - want) < 1e-9, `${t} (${f.name}): ${f(t, env).value}`);
  }
  // uporabniška funkcija znotraj ∫ in d/dx je v radianih, zunaj v stopinjah; f′ je odvod le lokalno (pregled #1005, 2. krog)
  const envF = { ...env, funcs: { f: { param: "x", body: "sin(x)" } } };
  for (const [t, want] of [["1+∫(f(x);0;π)", 3], ["2·∫(f(x);0;π)", 4], ["1+d/dx(f(x);0)", 2], ["sin(30)+f'(0)", 1.5], ["f'(0)", 1], ["f(90)+∫(f(x);0;π)", 3]]) {
    for (const f of [analyze, analyzeLive]) assert.ok(Math.abs(f(t, envF).value - want) < 1e-9, `${t} (${f.name}): ${JSON.stringify(f(t, envF))}`);
  }
  // brez odvoda in integrala ostane enota kota: sin 30 v DEG je 0,5
  assert.ok(Math.abs(analyzeLive("sin(30)", env).value - 0.5) < 1e-12);
  assert.ok(Math.abs(analyzeLive("sin(30°)+1", env).value - 1.5) < 1e-12);
});

// Opomba »Računano v radianih« pod rezultatom in v predogledu (DEG/GRA), v pravem brskalniku
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
const KX = path.resolve("node_modules/katex/dist");
const PAGE = `<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="/vendor/katex/katex.min.css"><link rel="stylesheet" href="/graph.css"><script src="/vendor/katex/katex.min.js"></script><div id="s" style="height:700px"></div>
<script type="module">
import { createScientific } from "/graph/sci.js";
localStorage.clear();
window.sci = createScientific(document.getElementById("s"), { t: (k) => k, icon: () => "", locale: () => "sl", storageKey: () => "t-sci", toast() {}, canSteps: () => false });
window.ready = true;
</script>`;
test("opomba »Računano v radianih« v DEG pod ∫ in d/dx (predogled in rezultat), v RAD je ni", { skip: playwright ? false : "Playwright ni nameščen" }, async (t) => {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split("?")[0]);
    if (url === "/stran.html") return res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(PAGE);
    const file = url.startsWith("/vendor/katex/") ? path.join(KX, url.slice(14)) : path.join(PUB, path.normalize(url));
    if (!(file.startsWith(PUB) || file.startsWith(KX)) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return res.writeHead(404).end();
    res.writeHead(200, { "content-type": file.endsWith(".js") ? "text/javascript" : file.endsWith(".css") ? "text/css" : "application/octet-stream" }).end(fs.readFileSync(file));
  });
  await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
  const browser = await playwright.chromium.launch();
  t.after(async () => {
    await browser.close();
    server.close();
  });
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${server.address().port}/stran.html`);
  await page.waitForFunction(() => window.ready);
  await page.click('[data-angle="deg"]');
  await page.fill(".sc-input", "sin(30)+∫(x;0;1)");
  // mešana vrstica: le ∫ in d/dx v radianih, ostalo v stopinjah
  await page.waitForFunction(() => document.querySelector(".sc-live")?.textContent.includes("sc.radiansPart"));
  await page.press(".sc-input", "Enter");
  assert.match(await page.locator(".sc-h-row.last").innerText(), /sc\.radiansPart/);
  // cela vrstica je integral: »Računano v radianih«
  await page.fill(".sc-input", "∫(sin(x);0;π)");
  await page.press(".sc-input", "Enter");
  assert.match(await page.locator(".sc-h-row.last").innerText(), /sc\.cas\.radians/);
  await page.click('[data-angle="rad"]');
  await page.fill(".sc-input", "∫(x;0;1)");
  await page.press(".sc-input", "Enter");
  assert.doesNotMatch(await page.locator(".sc-h-row.last").innerText(), /sc\.cas\.radians/);
});

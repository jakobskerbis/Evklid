// Široke tabele v listih formul se na telefonu ne pomikajo vstran (j: nič se ne pomika vstran, nikjer; učbenik 13. 11.:
// /ucbenik/KEM-SS/formule je bil pri 360 px širok 954 px). Vodoravne tabele (oznaka + vrstica vrednosti) se prelomijo
// v več vrstic, tabele s 3+ stolpci se zložijo v kartice (public/vodoravna-tabela.js).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import { marked } from "marked";
import katex from "katex";
import { createRenderer } from "../public/rich.js";
import { oznaciStolpce, vodoravnaTabela } from "../public/vodoravna-tabela.js";
import { printFormulas, renderMd } from "../server/textbook-print.js";
import { createApp } from "../server/app.js";
import { openDb } from "../server/db.js";

const { renderRich } = createRenderer({ marked, katex, sanitize: (h) => h });
const MASE = "| Element | H | C | N | O | Na | Mg |\n|---|---|---|---|---|---|---|\n| $A_r$ | $1{,}01$ | $12{,}01$ | $14{,}01$ | $16{,}00$ | $22{,}99$ | $24{,}31$ |";
const TELESA = '| Telo | Površina | Prostornina |\n|---|---|---|\n| Valj | $P = 2 \\pi r (r + v)$ | $V = \\pi r^2 v$ |\n| Krogla "x" | $P = 4 \\pi r^2$ | $V = \\dfrac{4 \\pi r^3}{3}$ |';

test("vodoravna tabela postane stolpci: oznaka prva, vsak stolpec glava + vrednost, višja vrstica za ulomek", () => {
  for (const html of [renderRich(MASE), renderMd(MASE, "html")]) {
    assert.ok(!/<table/.test(html), "ni več tabele");
    assert.equal((html.match(/class="md-vod-st/g) || []).length, 7);
    assert.match(html, /^<div class="md-vod"><div class="md-vod-st md-vod-leg"><div class="md-vod-c md-vod-h">Element<\/div>/);
    assert.match(html, /<div class="md-vod-st"><div class="md-vod-c md-vod-h">Mg<\/div><div class="md-vod-c">/);
    assert.ok(!html.includes("md-vod-v"), "brez ulomkov ni višjih vrstic");
  }
  const g = renderRich("| Snov | voda | led | olje | aluminij | zrak |\n|---|---|---|---|---|---|\n| $\\rho\\,[\\frac{\\text{kg}}{\\text{m}^3}]$ | $1000$ | $920$ | $900$ | $2700$ | $1{,}3$ |");
  assert.equal((g.match(/md-vod-c md-vod-v/g) || []).length, 6, "vrstica z ulomkom je višja v vseh stolpcih");
});

test("vodoravna je le tabela z glavo, 6+ stolpci in največ tremi vrsticami vrednosti", () => {
  const vrstica = (n, x) => `<tr>${Array.from({ length: n }, (_, i) => `<td>${x}${i}</td>`).join("")}</tr>`;
  const tab = (n, r) => `<thead><tr>${Array.from({ length: n }, (_, i) => `<th>h${i}</th>`).join("")}</tr></thead><tbody>${Array.from({ length: r }, () => vrstica(n, "v")).join("")}</tbody>`;
  assert.ok(vodoravnaTabela(tab(6, 1)));
  assert.ok(vodoravnaTabela(tab(6, 3)));
  assert.equal(vodoravnaTabela(tab(5, 1)), null, "5 stolpcev");
  assert.equal(vodoravnaTabela(tab(6, 4)), null, "4 vrstice vrednosti");
  assert.equal(vodoravnaTabela(tab(8, 1).replace("<th>h0</th>", "<th></th>")), null, "brez oznake v prvem stolpcu");
  assert.equal(vodoravnaTabela(tab(8, 1).replace(/<\/?thead>/g, "")), null, "brez glave");
});

test("tabela s 3+ stolpci: vsaka celica ima ime svojega stolpca (narekovaj ubežan), dvostolpčna ostane, kot je", () => {
  const html = renderRich(TELESA);
  assert.match(html, /<table class="md-table md-stolpci">/);
  assert.match(html, /<td data-label="Telo">Krogla (?:"|&quot;)x(?:"|&quot;)<\/td>/);
  assert.equal((html.match(/data-label="Prostornina"/g) || []).length, 2);
  assert.match(renderMd(TELESA, "html"), /<table class="md-stolpci">[\s\S]*<td data-label="Površina">/);
  assert.match(oznaciStolpce('<thead><tr><th>a "b"</th><th>c</th><th>d</th></tr></thead><tbody><tr><td>1</td><td align="center">2</td><td>3</td></tr></tbody>'), /<td data-label="a &quot;b&quot;">1<\/td><td align="center" data-label="c">2<\/td>/);
  assert.equal(oznaciStolpce("<thead><tr><th>a</th><th>b</th></tr></thead><tbody><tr><td>1</td><td>2</td></tr></tbody>"), null);
  // Stolpec z formulo v glavi ostane brez imena (KaTeX v atributu ni berljiv).
  const f = renderRich("| $x$ | ime | opis |\n|---|---|---|\n| $1$ | ena | prva |");
  assert.match(f, /<td align="center">[\s\S]*?<\/td>\s*<td data-label="ime">ena<\/td>/);
});

test("slog: aplikacija zloži tabelo s 3+ stolpci v kartice v ozkem listu formul, tisk na telefonu", () => {
  const css = fs.readFileSync(new URL("../public/graph.css", import.meta.url), "utf8");
  assert.match(css, /@container \(max-width: 560px\) \{[\s\S]*?\.fm-sec table\.md-stolpci[^{]*\{ display: block; \}/);
  assert.match(fs.readFileSync(new URL("../public/style.css", import.meta.url), "utf8"), /\.md-vod \{ display: flex; flex-wrap: wrap;/);
  const list = printFormulas("KEM-SS");
  assert.match(list, /@media screen and \(max-width: 600px\) \{[\s\S]*?\.sheet table\.md-stolpci/);
  assert.match(list, /<div class="md-vod">/, "relativne atomske mase so vodoravna tabela");
});

const require = createRequire(import.meta.url);
let chromium = null;
try {
  chromium = await require("playwright").chromium.launch();
} catch {}

test("list formul za tisk se pri 360 px ne pomika vstran (vsi listi OŠ in SŠ)", { skip: chromium ? false : "Playwright Chromium ni nameščen", timeout: 120000 }, async () => {
  const app = createApp(openDb(":memory:"), { scheduler: false, log: { error() {}, warn() {}, info() {} } });
  const srv = app.listen(0);
  const base = `http://127.0.0.1:${srv.address().port}`;
  const ctx = await chromium.newContext({ viewport: { width: 360, height: 740 } });
  try {
    const p = await ctx.newPage();
    for (const k of ["MAT-OS", "MAT-SS", "FIZ-OS", "FIZ-SS", "KEM-OS", "KEM-SS"]) {
      assert.equal((await p.goto(`${base}/ucbenik/${k}/formule`)).status(), 200, k);
      await p.waitForLoadState("load");
      assert.equal(await p.evaluate(() => document.scrollingElement.scrollWidth), 360, `${k} se pomika vstran`);
    }
  } finally {
    await ctx.close();
    await chromium.close();
    srv.close();
  }
});

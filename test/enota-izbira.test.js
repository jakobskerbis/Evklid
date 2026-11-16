// Enota pri številski nalogi ne sme izdati odgovora (j, 16. 11. 2026, posnetek s pravim računom): v »Testu
// predznanja« (Fotoefekt in foton) je gumb ob polju že pred odgovorom pokazal pravo enoto »V« zaporne
// napetosti, namig v polju pa »število in enota, npr. 12,5 V«. Zdaj: prazna izbira »Enota«, več enot predmeta po
// abecedi, namig brez enote. Brez enote strežnik vpraša »V kateri enoti je rezultat?« (ne šteje kot poskus).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { unitChoices } from "../public/enote-izbira.js";
import { checkAnswer } from "../server/practice/check.js";
import SL from "../public/i18n/sl.js";

const require = createRequire(import.meta.url);
let playwright = null;
try {
  playwright = require("playwright");
} catch {}

test("ponudba enot: prava je med njimi, ni vedno prva, po abecedi in vedno enaka za isto nalogo", () => {
  assert.deepEqual(unitChoices("", { subject: "FIZ" }), []);
  assert.deepEqual(unitChoices(null, { subject: "FIZ" }), []);
  const first = {};
  for (let i = 0; i < 200; i++) {
    const c = unitChoices("V", { subject: "FIZ-SS-4/fotoefekt", seed: `naloga ${i}` });
    assert.equal(c.length, 6);
    assert.ok(c.includes("V"));
    assert.equal(new Set(c).size, 6);
    assert.deepEqual(c, [...c].sort((a, b) => a.localeCompare(b, "sl", { sensitivity: "base" }) || (a < b ? -1 : 1)));
    first[c[0] === "V"] = (first[c[0] === "V"] || 0) + 1;
  }
  assert.ok(!first.true || first.true < 20, "prava enota ni pravilo na prvem mestu");
  assert.deepEqual(unitChoices("V", { subject: "FIZ", seed: "x" }), unitChoices("V", { subject: "FIZ", seed: "x" }));
  // l in L, cm^3 in cm³ sta ista enota: ne dvakrat.
  for (let i = 0; i < 50; i++) {
    const c = unitChoices("L", { subject: "KEM", seed: String(i) });
    assert.ok(!c.includes("l") && c.filter((u) => u === "L").length === 1);
  }
  // Enota, ki je ni v seznamu predmeta, je vseeno ponujena.
  assert.ok(unitChoices("a. e.", { subject: "FIZ", seed: "s" }).includes("a. e."));
});

test("namig v polju ne izda enote (vsi jeziki), app.js in aplikacija ne podata enote", () => {
  assert.doesNotMatch(SL["task.phUnit"], /\{unit\}/);
  for (const f of fs.readdirSync("public/i18n/ui")) {
    const j = JSON.parse(fs.readFileSync(path.join("public/i18n/ui", f), "utf8"));
    assert.doesNotMatch(j["task.phUnit"], /\{unit\}|12/, f);
  }
  for (const f of ["public/app.js", "public/pilot-naloge.js", "mobile/src/app/practice.tsx"])
    assert.doesNotMatch(fs.readFileSync(f, "utf8"), /phUnit", \{ unit/, f);
  // Aplikacija ne doda samo prave enote kot tipke.
  assert.doesNotMatch(fs.readFileSync("mobile/src/app/practice.tsx", "utf8"), /\.\.\.\(task\.unit \? \[task\.unit\]/);
});

test("brez enote: jasno sporočilo (vrsta unit), ne tiha napaka", () => {
  const ans = { type: "number", value: 1.23, decimals: 2, unit: "V" };
  const r = checkAnswer(ans, "1,23");
  assert.equal(r.kind, "unit");
  assert.equal(r.code, "chk.addUnit");
  assert.match(SL["chk.addUnit"], /V kateri enoti/);
  assert.equal(checkAnswer(ans, "1,23 V").kind, "correct");
  assert.equal(checkAnswer(ans, "1,23 J").kind, "unit");
  // Naloga brez enote ostane brez izbire.
  assert.equal(checkAnswer({ type: "number", value: 4 }, "4").kind, "correct");
});

const PUB = path.resolve("public");
const NM = path.resolve("node_modules");
const TYPES = { ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".html": "text/html", ".svg": "image/svg+xml" };
const PAGE = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/ui.css"><link rel="stylesheet" href="/tipkovnica.css">
<form class="answer-row"><input id="answer" placeholder="${SL["task.phUnit"]}"><button type="button" class="pad-open-btn">Piši</button><button class="primary">Preveri</button></form>
<div class="task"></div>
<script type="module">
import { attachPad, openPad } from "/pad.js";
const form = document.querySelector("form");
form.addEventListener("submit", (e) => { e.preventDefault(); window.sent = document.getElementById("answer").value; });
attachPad({ task: { unit: "V", answerType: "number", text: "Kolikšna je zaporna napetost, pri kateri fototok preneha?", topicId: "FIZ-SS-4/fotoefekt" }, form, input: document.getElementById("answer"), opener: form.querySelector(".pad-open-btn"), subject: "FIZ", readFn: async () => ({ text: null }), stay: true });
openPad("draw");
window.ready = true;
</script>`;

test("plošča Piši: izbira enote je privzeto prazna, prava enota ni sama", { skip: !playwright && "playwright ni nameščen" }, async () => {
  const srv = http.createServer((q, r) => {
    const u = decodeURIComponent(q.url.split("?")[0]);
    if (u === "/") {
      r.writeHead(200, { "content-type": "text/html" });
      return r.end(PAGE);
    }
    const f = u.startsWith("/vendor/") ? path.join(NM, u.slice(8)) : path.join(PUB, u);
    if (!f.startsWith(PUB) && !f.startsWith(NM)) return r.writeHead(403).end();
    fs.readFile(f, (err, data) => {
      if (err) return r.writeHead(404).end();
      r.writeHead(200, { "content-type": TYPES[path.extname(f)] || "application/octet-stream" });
      r.end(data);
    });
  });
  await new Promise((ok) => srv.listen(0, ok));
  const browser = await playwright.chromium.launch();
  try {
    const page = await (await browser.newContext({ viewport: { width: 360, height: 740 }, hasTouch: true })).newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(`http://localhost:${srv.address().port}/`);
    await page.waitForFunction(() => window.ready, null, { timeout: 15000 });
    const sel = page.locator("#pad .pad-unit");
    assert.equal(await sel.count(), 1, "izbira enote");
    assert.equal(await sel.inputValue(), "", "privzeto ni izbrane enote");
    assert.equal(await sel.getAttribute("aria-label"), SL["fx.unit"]);
    const opts = await sel.locator("option").allTextContents();
    assert.equal(opts[0], SL["fx.unit"]);
    assert.ok(opts.length >= 6 && opts.includes("V"), opts.join(","));
    assert.equal(await page.locator("#pad .pad-units button").count(), 0, "ni gumba s samo pravo enoto");
    assert.doesNotMatch(await page.locator("#answer").getAttribute("placeholder"), /\bV\b/);
    // Izbira enote doda enoto k številu, druga jo zamenja, prazna jo odstrani.
    await page.fill("#answer", "1,23");
    await sel.selectOption("V");
    assert.equal(await page.inputValue("#answer"), "1,23 V");
    const other = opts.find((o) => o !== "V" && o !== SL["fx.unit"]);
    await sel.selectOption(other);
    assert.equal(await page.inputValue("#answer"), `1,23 ${other}`);
    await sel.selectOption("");
    assert.equal(await page.inputValue("#answer"), "1,23");
    // Vpisana enota se pokaže v izbiri.
    await page.fill("#answer", "4,5 V");
    await page.dispatchEvent("#answer", "input");
    assert.equal(await sel.inputValue(), "V");
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
    srv.close();
  }
});

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
import { unitChoices, unitAtEnd, withUnit as putUnit } from "../public/enote-izbira.js";
import { withUnit } from "../public/tipkovnica-data.js";
import { openDb } from "../server/db.js";
import { Progress } from "../server/progress.js";
import { generateTask, publicTask, topicsWithGenerators } from "../server/practice/index.js";
import { checkAnswer, fmt } from "../server/practice/check.js";
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
attachPad({ task: { hasUnit: true, units: ${JSON.stringify(unitChoices("V", { subject: "FIZ-SS-4/fotoefekt", seed: "z" }))}, answerType: "number", text: "Kolikšna je zaporna napetost, pri kateri fototok preneha?", topicId: "FIZ-SS-4/fotoefekt" }, form, input: document.getElementById("answer"), opener: form.querySelector(".pad-open-btn"), subject: "FIZ", readFn: async () => ({ text: null }), stay: true });
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
    // J: ime iz <label> (bralnik zaslona prebere ime in izbrano enoto), ne aria-label.
    assert.equal(await sel.getAttribute("aria-label"), null);
    assert.equal(await page.locator('label[for="pad-unit"]').textContent(), SL["fx.unit"]);
    assert.equal(await page.getByLabel(SL["fx.unit"]).count(), 1);
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
    // I: prazno število + izbira »V« → »V«, izbira ostane »V«, število se vpiše pred enoto.
    await page.fill("#answer", "");
    await sel.selectOption("V");
    assert.equal(await page.inputValue("#answer"), "V");
    assert.equal(await sel.inputValue(), "V");
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

// ---------- pregled PR 786 (17. 11. 2026) ----------
const CHK_UNIT = "Ta enota ni prava. Preveri, v kateri enoti je rezultat.";

test("pregled 786, A: napačna enota – nevtralno sporočilo brez prave enote (vseh 33 jezikov)", () => {
  const r = checkAnswer({ type: "number", value: 1.23, decimals: 2, unit: "V" }, "1,23 J");
  assert.equal(r.code, "chk.unit");
  assert.equal(r.message, CHK_UNIT);
  assert.deepEqual(r.params, {});
  assert.equal(SL["chk.unit"], CHK_UNIT);
  for (const f of fs.readdirSync("public/i18n/ui")) {
    const v = JSON.parse(fs.readFileSync(path.join("public/i18n/ui", f), "utf8"))["chk.unit"];
    assert.ok(v && !/\{unit\}/.test(v), f);
  }
});

function unitTask(p, s, mode) {
  const store = p.store || null;
  let n;
  if (mode === "contest") n = p.startContest(s.id, "FIZ-TEK-OS");
  else {
    p.nextPractice(s.id, "MAT-OS-8/pitagorov-izrek");
    n = p.nextPractice(s.id, "MAT-OS-8/pitagorov-izrek");
  }
  const row = p.getTask(n.task.id);
  const payload = { ...row.payload, answer: { type: "number", value: 2.5, decimals: 1, unit: "V" } };
  p.db.prepare("UPDATE tasks SET payload = ? WHERE id = ?").run(JSON.stringify(payload), n.task.id);
  void store;
  return n.task.id;
}
test("pregled 786, A: napačna enota šteje kot poskus le na tekmovanju in poskusnem izpitu", () => {
  for (const mode of ["practice", "contest"]) {
    const store = openDb(":memory:");
    const p = new Progress(store);
    const s = store.createStudent("Ana");
    const id = unitTask(p, s, mode);
    // Manjkajoča enota: povsod nov poskus.
    const miss = p.answer(s.id, id, "2,5");
    assert.equal(miss.code, "chk.addUnit", mode);
    assert.equal(miss.retry, true, mode);
    assert.equal(p.getTask(id).attempts, 0, mode);
    const wrong = p.answer(s.id, id, "2,5 J");
    assert.equal(wrong.code, "chk.unit", mode);
    assert.doesNotMatch(wrong.message, /\bV\b/);
    if (mode === "contest") {
      assert.equal(wrong.retry, undefined);
      assert.equal(wrong.saved, true);
      assert.equal(p.getTask(id).attempts, 1);
      assert.equal(p.getTask(id).solved, 0);
    } else {
      assert.equal(wrong.retry, true);
      assert.equal(p.getTask(id).attempts, 0);
      assert.equal(p.answer(s.id, id, "2,5 V").kind, "correct");
    }
  }
});

test("pregled 786, B: pilotne naloge (enota ni obvezna) – namig je samo rezultat", () => {
  const src = fs.readFileSync("public/pilot-naloge.js", "utf8");
  assert.doesNotMatch(src, /task\.phUnit/);
  assert.match(src, /tk\.inputHint \|\| t\("task\.phResult"\)/);
});

test("pregled 786, C: branje rokopisa ne dobi prave enote, navodilo pravi, da je enota neobvezna", () => {
  const app = fs.readFileSync("server/app.js", "utf8");
  assert.doesNotMatch(app, /readFn\(\{[^}]*unit: a\.unit/);
  const claude = fs.readFileSync("server/claude.js", "utf8");
  const fn = claude.slice(claude.indexOf("export async function readHandwriting"), claude.indexOf("export async function readHandwriting") + 1500);
  assert.doesNotMatch(fn, /\$\{unit\}/);
  assert.match(fn, /morda z enoto/);
  // Plošča: izbrana enota ostane, če je prebrani zapis nima.
  assert.match(fs.readFileSync("public/pad.js", "utf8"), /const unit = chosenUnit\(cur\.input\.value\)/);
});

// Vsaka ponujena enota razen prave je pri pravi vrednosti zavrnjena (chk.unit), in ni enakovredna pravi.
const EQ = [["mL", "ml", "cm³"], ["L", "l", "dm³"], ["N s", "kg m/s"], ["N/C", "V/m"], ["J", "N m"], ["Pa", "N/m²"]];
test("pregled 786, D in E: med drugimi enotami ni enakovrednih ne sprejetih (vse naloge generatorjev)", () => {
  let n = 0;
  for (const id of topicsWithGenerators()) {
    for (const seed of [11, 12]) {
      let t;
      try {
        t = generateTask(id, 2, seed, "sl");
      } catch {
        continue;
      }
      if (!t?.answer?.unit || t.answer.type !== "number") continue;
      n++;
      const pub = publicTask({ ...t, topicId: t.topicId || id });
      const right = pub.units.filter((u) => checkAnswer(t.answer, `${fmt(t.answer.value, t.answer.decimals ?? null)} ${u}`).kind !== "unit");
      assert.equal(right.length, 1, `${id}: ${pub.units.join(", ")} (prava ${t.answer.unit})`);
      const eq = EQ.find((g) => g.some((x) => x.replace(/\s/g, "").toLowerCase() === right[0].replace(/\s/g, "").toLowerCase()));
      if (eq) for (const u of pub.units) if (u !== right[0]) assert.ok(!eq.some((x) => x.replace(/\s/g, "").toLowerCase() === u.replace(/\s/g, "").toLowerCase()), `${id}: ${u} je enakovredna ${right[0]}`);
    }
  }
  assert.ok(n > 500, `nalog z enoto: ${n}`);
  // Odjemalec brez strežnika: mL ↔ cm³, N/C ↔ V/m, m ↔ M nista med drugimi.
  for (let i = 0; i < 100; i++) {
    assert.ok(!unitChoices("mL", { subject: "KEM", seed: String(i) }).some((u) => ["cm³", "ml"].includes(u)));
    assert.ok(!unitChoices("N/C", { subject: "FIZ", seed: String(i) }).includes("V/m"));
    assert.ok(!unitChoices("N s", { subject: "FIZ", seed: String(i) }).includes("kg m/s"));
  }
});

test("pregled 786, F: prava enota je v seznamu predmeta (ne izstopa), ² in ³ lepo zapisana", () => {
  for (const [u, s] of [["€", "UNI"], ["dni", "MAT"], ["let", "MAT"], ["cm^2", "MAT"], ["m^2", "MAT"], ["µF", "FIZ"], ["N m", "FIZ"], ["min⁻¹", "FIZ"], ["MW/m²", "FIZ"], ["dm", "MAT"], ["dag", "MAT"], ["dm³", "FIZ"], ["As", "FIZ"]]) {
    const c = unitChoices(u, { subject: s, seed: "x" });
    assert.equal(c.length >= 5, true, u);
    assert.ok(!c.some((x) => /\^/.test(x)), `${u}: ${c}`);
  }
  assert.ok(unitChoices("cm^2", { subject: "MAT", seed: "x" }).includes("cm²"));
  // Denar: druge enote so iz finančnega sveta, ne fizike.
  assert.ok(unitChoices("€", { subject: "UNI", seed: "x" }).every((u) => ["€", "%", "let", "dni", "mesecev", "tednov", "ur"].includes(u)));
});

test("pregled 786, G (krog 1): 2 enoti iste količine z drugo predpono (V → mV, kV), šest, po abecedi, ponovljivo", () => {
  let withSib = 0;
  for (let i = 0; i < 100; i++) {
    const c = unitChoices("V", { subject: "FIZ", seed: `n${i}` });
    assert.equal(c.length, 6);
    const sib = c.filter((u) => ["mV", "kV", "MV", "µV"].includes(u)).length;
    assert.equal(sib, 2, c.join(","));
    withSib++;
  }
  assert.equal(withSib, 100);
  assert.ok(unitChoices("cm³", { subject: "MAT", seed: "a" }).some((u) => ["dm³", "m³", "mm³"].includes(u)));
});

test("pregled 786, H: vpis enote zamenja vso prejšnjo enoto", () => {
  const offered = ["kg m/s", "N s", "V", "cm", "mV"];
  assert.equal(withUnit("12 N s", "kg m/s", offered), "12 kg m/s");
  assert.equal(withUnit("30°", "cm", offered), "30 cm");
  assert.equal(withUnit("12,5V", "V", offered), "12,5 V");
  assert.equal(withUnit("", "V", offered), "V");
  assert.equal(withUnit("12 m/s", "km/h"), "12 km/h");
  assert.equal(putUnit("1,2 V", "mV", offered), "1,2 mV");
  assert.equal(putUnit("1,2 mV", "", offered), "1,2");
  assert.equal(unitAtEnd("V", offered), "V");
  assert.equal(unitAtEnd("12V", offered), "V");
  assert.equal(unitAtEnd("12 kg m/s", offered), "kg m/s");
});

test("pregled 786, K: tipke enot na tipkovnici so visoke vsaj 40 px", () => {
  assert.match(fs.readFileSync("public/tipkovnica.css", "utf8"), /\.tk-chip\.unit \{[^}]*min-height: 4\dpx/);
});

// ---------- pregled PR 786, krog 2 (17. 11. 2026) ----------
import { unitRequired, unitFactor } from "../server/practice/check.js";
const conv = (ans, input, text = "Kolikšna je sila?") => checkAnswer(ans, input, { convert: true, text }).kind;

test("pregled 786-2, A: pravilno pretvorjen rezultat (druga predpona) je pravilen, razen če besedilo zahteva enoto", () => {
  const F = { type: "number", value: 5.4249, decimals: 2, unit: "N" };
  for (const x of ["5,42 N", "5420 mN", "5424,93 mN", "0,00542 kN"]) assert.equal(conv(F, x), "correct", x);
  // Pravilo zaokroževanja velja za vrednost v enoti naloge: 5400 mN = 5,40 N ni 5,42 N.
  assert.equal(conv(F, "5400 mN"), "rounding");
  assert.equal(conv(F, "5,4 N"), "rounding");
  assert.equal(conv(F, "5,42 mN"), "wrong");
  // Druga količina ostane napačna enota; brez pretvorbe (kviz, pilot) kot prej.
  assert.equal(conv(F, "5,42 kg"), "unit");
  assert.equal(checkAnswer(F, "5420 mN").kind, "unit");
  // Besedilo zahteva enoto: le ta.
  assert.equal(conv(F, "5420 mN", "Rezultat zapiši v $\\mathrm{N}$."), "unit");
  assert.equal(conv({ type: "number", value: 12, unit: "mm" }, "1,2 cm", "Dolžina $x = ?\\ \\mathrm{mm}$"), "unit");
  assert.equal(conv({ type: "number", value: 12, unit: "mm" }, "1,2 cm", "Kolikšna je dolžina?"), "correct");
  // Potence in prostornina.
  const S = { type: "number", value: 3, unit: "m²" };
  assert.equal(conv(S, "30000 cm²"), "correct");
  assert.equal(conv(S, "300 cm²"), "wrong");
  const V = { type: "number", value: 2, unit: "L" };
  for (const x of ["2000 mL", "2 dm³", "2000 cm^3", "0,002 m³"]) assert.equal(conv(V, x), "correct", x);
  // °C ↔ K in min ↔ s ostaneta napačna enota.
  assert.equal(conv({ type: "number", value: 20, unit: "°C" }, "293,15 K"), "unit");
  assert.equal(conv({ type: "number", value: 2, unit: "min" }, "120 s"), "unit");
  assert.equal(unitFactor("km/h", "m/s"), null);
  assert.equal(unitFactor("mN", "N"), 1e-3);
  assert.equal(unitFactor("cm²", "m²"), 1e-4);
  // Pravilo »besedilo zahteva enoto«.
  assert.ok(unitRequired("Rezultat zapiši v $\\mathrm{kN}$.", "kN"));
  assert.ok(unitRequired("Izrazi v cm².", "cm²"));
  assert.ok(unitRequired("Pretvori 5 km v m.", "m"));
  assert.ok(!unitRequired("Sila je $5\\ \\mathrm{kN}$. Kolikšna je masa?", "kN"));
});

test("pregled 786-2, A: pretvorba velja v vadnici in na tekmovanju (progress), sporočilo »pravilno«", () => {
  for (const mode of ["practice", "contest"]) {
    const store = openDb(":memory:");
    const p = new Progress(store);
    const s = store.createStudent("Ana");
    const id = unitTask(p, s, mode);
    const r = p.answer(s.id, id, "2500 mV");
    if (mode === "contest") assert.equal(p.getTask(id).solved, 1, mode);
    else assert.equal(r.kind, "correct", mode);
  }
});

test("pregled 786-2, B: velikost družine enot ne izda odgovora; predpone primerne ravni", () => {
  let n = 0;
  let leak = 0;
  for (const id of topicsWithGenerators()) {
    let t;
    try {
      t = generateTask(id, 2, 21, "sl");
    } catch {
      continue;
    }
    if (!t?.answer?.unit || t.answer.type !== "number") continue;
    n++;
    const pub = publicTask({ ...t, topicId: t.topicId || id });
    const right = pub.units.find((u) => checkAnswer(t.answer, `${fmt(t.answer.value, t.answer.decimals ?? null)} ${u}`).kind !== "unit");
    const fam = (u) => {
      const si = /^([kMGcmdµnph]?)(mol|Pa|Hz|eV|Bq|Wb|m|g|s|V|A|W|J|N|Ω|C|F|T|L)([²³]?)$/.exec(u);
      return si ? si[2] + si[3] : `=${u}`;
    };
    const sizes = {};
    for (const u of pub.units) sizes[fam(u)] = (sizes[fam(u)] || 0) + 1;
    const max = Math.max(...Object.values(sizes));
    const largest = Object.keys(sizes).filter((k) => sizes[k] === max);
    if (max > 1 && largest.length === 1 && largest[0] === fam(right)) leak++;
    if (/(?:^|[-/])OS(?:[-/]|$)/.test(id)) assert.ok(!pub.units.some((u) => u !== right && /^(?:µ|n|p|G)/.test(u) && fam(u)[0] !== "="), `${id}: ${pub.units}`);
    assert.ok(!pub.units.some((u) => u !== right && /^(?:µ|n|p|M|G|h)m[²³]$/.test(u)), `${id}: ${pub.units}`);
  }
  assert.ok(n > 300);
  assert.ok(leak / n < 0.02, `prava družina edina največja v ${leak} od ${n} nalog`);
});

test("pregled 786-2, C: odjemalec pred odgovorom ne dobi prave enote", () => {
  const t = generateTask("FIZ-SS-4/fotoefekt-in-foton", 2, 3, "sl");
  const pub = publicTask(t);
  assert.equal(pub.unit, undefined);
  assert.equal(pub.hasUnit, !!t.answer.unit);
  for (const f of ["public/app.js", "public/pad.js", "public/pilot-naloge.js", "mobile/src/app/practice.tsx"])
    assert.doesNotMatch(fs.readFileSync(f, "utf8"), /\b(?:task|tk|opts\.task)\.unit\b/, f);
});

test("pregled 786-2, D: sporočilo ob napačni enoti v ti-obliki, v 33 jezikih", () => {
  assert.equal(SL["chk.unit"], "Ta enota ni prava. Preveri, v kateri enoti je rezultat.");
  assert.equal(checkAnswer({ type: "number", value: 1, unit: "V" }, "1 J").message, SL["chk.unit"]);
  const en = JSON.parse(fs.readFileSync("public/i18n/ui/en.json", "utf8"))["chk.unit"];
  assert.match(en, /which unit/);
});

test("pregled 786-2, F: med drugimi enotami fizike ni c, D, €, As, let, dni", () => {
  for (let i = 0; i < 300; i++) {
    const c = unitChoices("m/s", { subject: "FIZ-SS-1/x", seed: String(i) });
    assert.ok(!c.some((u) => ["c", "D", "€", "As", "let", "dni"].includes(u)), c.join(","));
  }
});

test("pregled 786-2, G: π v rezultatu, vpis enote za π, namig in zbledel rob vrstice", () => {
  const B = { type: "number", value: 2 * Math.PI, decimals: 2, unit: "cm" };
  assert.equal(conv(B, "2π cm"), "correct");
  assert.equal(conv(B, "2\\pi cm"), "correct");
  assert.notEqual(conv(B, "2π kg"), "correct");
  assert.equal(putUnit("4\\pi", "cm"), "4\\pi cm");
  assert.equal(putUnit("2π cm", "mm", ["cm", "mm"]), "2π mm");
  assert.equal(putUnit("5 cm^3", "m³"), "5 m³");
  assert.match(fs.readFileSync("public/style.css", "utf8"), /\.answer-row input::placeholder \{ font-size: 0\.8\d?em; \}/);
  assert.match(fs.readFileSync("public/tipkovnica.css", "utf8"), /\.tk-ctx\.more-end \{[^}]*mask-image/);
});

const PAGE_DD = `<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="/style.css">
<label class="sr-only" for="pad-unit">Enota</label><select id="pad-unit"><option value="">Enota</option><option value="mV">mV</option><option value="V">V</option></select>
<script type="module">import { enhanceSelect } from "/dropdown.js"; enhanceSelect(document.getElementById("pad-unit")); window.ready = true;</script>`;
test("pregled 786-2, E: spustni meni (dropdown.js) pove ime in izbrano enoto", { skip: !playwright && "playwright ni nameščen" }, async () => {
  const srv = http.createServer((q, r) => {
    const u = decodeURIComponent(q.url.split("?")[0]);
    if (u === "/") return r.writeHead(200, { "content-type": "text/html" }).end(PAGE_DD);
    const f = u.startsWith("/vendor/") ? path.join(NM, u.slice(8)) : path.join(PUB, u);
    fs.readFile(f, (err, data) => (err ? r.writeHead(404).end() : r.writeHead(200, { "content-type": TYPES[path.extname(f)] || "application/octet-stream" }).end(data)));
  });
  await new Promise((ok) => srv.listen(0, ok));
  const browser = await playwright.chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(`http://localhost:${srv.address().port}/`);
    await page.waitForFunction(() => window.ready && document.querySelector(".dd-btn"));
    const name = () => page.$eval(".dd-btn", (b) => (b.getAttribute("aria-labelledby") || "").split(" ").map((id) => document.getElementById(id)?.textContent).join(" "));
    assert.equal(await page.$eval(".dd-btn", (b) => b.getAttribute("aria-label")), null);
    assert.equal(await name(), "Enota");
    await page.$eval("#pad-unit", (s) => { s.value = "V"; s.dispatchEvent(new Event("change")); });
    assert.equal(await name(), "Enota V");
  } finally {
    await browser.close();
    srv.close();
  }
});

// AUDIT-004: ⌫ ne pusti polovice imena ali ostankov predloge (»integriraj)«, »;;)«, »)«); strojni Backspace in
// Delete gresta po isti poti kot zaslonska ⌫; ◀ ▶ (tudi puščici na tipkovnici) ne gresta v ime funkcije.
// Čiste funkcije (sci-vnos.js) in pravi brskalnik (Playwright: Chromium, WebKit, Firefox, kar je nameščeno).
import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { backspace, deleteForward, stepCaret, entryBase } from "../public/graph/sci-vnos.js";

const env = { vars: {}, funcs: {}, ans: 0, deg: false, grad: false, comma: true };
// »a|b« → besedilo in položaj kazalca
const split = (x) => [x.replace("|", ""), x.indexOf("|")];
const show = (r) => r.text.slice(0, r.pos) + "|" + r.text.slice(r.pos);
const bs = (x) => show(backspace(...split(x)));
const dl = (x) => show(deleteForward(...split(x)));

test("⌫ briše predlogo ali ime kot celoto, nikoli pol imena ali ločil (AUDIT-004)", () => {
  const cases = [
    // prazne predloge gredo v celoti
    ["∫(|;;)", "|"],
    ["integriraj(|)", "|"],
    ["d/dx(|)", "|"],
    ["d/dx(|;)", "|"],
    ["limita(|; x; )", "|"],
    ["taylor(|; x; 0; 5)", "|"],
    ["√(|)", "|"],
    ["sin(|)", "|"],
    ["×10^(|)", "|"],
    ["∑_(|n=1)^() ", "|"],
    ["det([[|; ]; [; ]])", "|"],
    ["poenostavi(|)", "|"],
    // samo prva reža ima vsebino: predloga gre, vsebina ostane (brez »)«)
    ["sin(|x)", "|x"],
    ["integriraj(|x²)", "|x²"],
    ["∫(|x;;)", "|x"],
    ["d/dx(|x³)", "|x³"],
    ["2+abs(|x)", "2+|x"],
    // druge reže niso prazne: nič se ne izbriše, kazalec gre pred predlogo
    ["∫(|x;0;1)", "|∫(x;0;1)"],
    ["limita(|x²; x; 0)", "|limita(x²; x; 0)"],
    ["∑_(|n=1)^(5) n", "|∑_(n=1)^(5) n"],
    // na začetku reže gre ⌫ na konec prejšnje (ločilo predloge se ne briše)
    ["∫(x;|;)", "∫(x|;;)"],
    ["∫(x;0;|)", "∫(x;0|;)"],
    ["∫(x;0;|1)", "∫(x;0|;1)"],
    ["limita(x; |x; 0)", "limita(x;|x; 0)"],
    ["∑_(n=1)^(|) ", "∑_(n=1|)^() "],
    ["det([[1; ]; [|; ]])", "det([[1; |]; [; ]])"],
    ["nCr(5;|2)", "nCr(5|;2)"],
    // kazalec sredi imena (prej s puščico na tipkovnici): ime ostane celo
    ["integr|iraj(x)", "|x"],
    ["si|n(x)", "|x"],
    ["An|s+1", "|+1"],
    // kazalec tik pred oklepajem imena ali sredi »d/dx(«: kot za oklepajem
    ["sin|(30)", "|30"],
    ["d|/dx(x³)", "|x³"],
    // zaklepaj se ne briše posamič, kazalec gre v oklepaj (prej »∫(sin(x;0;π)« → surovo besedilo)
    ["sin(30)|", "sin(30|)"],
    ["(1+2)|", "(1+2|)"],
    ["∫(sin(x)|;0;π)", "∫(sin(x|);0;π)"],
    ["inverz([[1; 2]; [3; 4]])|", "inverz([[1; 2]; [3; 4]]|)"],
    // navaden oklepaj gre s parom
    ["(|1+2)", "|1+2"],
    ["(|)", "|"],
    ["(1+2)/(|3+4)", "(1+2)/|3+4"],
    // običajno brisanje ostane
    ["12|3", "1|3"],
    ["∫(x²|;0;1)", "∫(x|;0;1)"],
    ["x+y=3;| x−y=1", "x+y=3| x−y=1"],
    ["sin(3;|)", "sin(3|)"],
    ["Ans|", "|"],
    ["f(x)=|", "|"],
    ["sin(x)=|0,5", "sin(x)|0,5"],
    ["|x", "|x"],
  ];
  for (const [a, b] of cases) assert.equal(bs(a), b, a);
  // izbira se izbriše
  assert.deepEqual(backspace("∫(x;0;1)", 2, 3), { text: "∫(;0;1)", pos: 2 });
});

test("Delete (strojna tipka) briše desno po istih pravilih (AUDIT-004)", () => {
  const cases = [
    ["|∫(;;)", "|"],
    ["|∫(x;0;1)", "∫(|x;0;1)"],
    ["|integriraj(x)", "|x"],
    ["|sin(x)+1", "|x+1"],
    ["2|+3", "2|3"],
    ["sin(x|)", "sin(x)|"],
    ["∫(x|;0;1)", "∫(x;|0;1)"],
    ["nCr(|;2)", "nCr(|2)"],
    ["|Ans+1", "|+1"],
    ["si|n(x)", "|x"],
    ["2|^()", "2|"],
    ["sin|(30)", "|30"],
    ["d/d|x(x)", "|x"],
    ["(1+2)/|(3+4)", "(1+2)/|3+4"],
    ["|[[1; 2]]", "[|[1; 2]]"],
    ["x|", "x|"],
  ];
  for (const [a, b] of cases) assert.equal(dl(a), b, a);
});

test("◀ ▶ gresta po mestih v zapisu: nikoli v ime funkcije ali ukaza (AUDIT-004)", () => {
  for (const t of ["integriraj(x)", "sin(30)+cos(x)", "∫(x;0;2)", "limita(x; x; 0)", "d/dx(x³)", "2+Ans"]) {
    const base = entryBase(t, env);
    const seen = [];
    for (let p = 0, k = 0; k < 40; k++) {
      seen.push(p);
      const q = stepCaret(base, t, p, 1);
      if (q === p) break;
      assert.ok(q > p, `${t}: ▶ naprej`);
      p = q;
    }
    assert.equal(seen.at(-1), t.length, `${t}: ▶ pride do konca`);
    for (const p of seen) {
      assert.ok(!(/[A-Za-z]$/.test(t.slice(0, p)) && /^[A-Za-z]/.test(t.slice(p))), `${t}: kazalec v imenu @${p}`);
      assert.ok(!t.slice(0, p).endsWith("∫"), `${t}: med ∫ in ( @${p}`);
    }
    let p = t.length;
    for (let k = 0; k < 40 && p > 0; k++) p = stepCaret(base, t, p, -1);
    assert.equal(p, 0, `${t}: ◀ pride do začetka`);
  }
  // brez zapisa (prazna vrstica) se kazalec ne premakne iz meja
  assert.equal(stepCaret(null, "", 0, -1), 0);
});

// ---------- pravi brskalnik ----------
const require = createRequire(import.meta.url);
let playwright = null;
try {
  playwright = require("playwright");
} catch {}
const PUB = path.resolve("public");
const KX = path.resolve("node_modules/katex/dist");
const TYPES = { ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".woff2": "font/woff2", ".svg": "image/svg+xml" };
const PAGE = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><link rel="stylesheet" href="/vendor/katex/katex.min.css"><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/ui.css"><link rel="stylesheet" href="/graph.css"><script src="/vendor/katex/katex.min.js"></script><div id="s" style="height:700px"></div>
<script type="module">
import { createScientific } from "/graph/sci.js";
localStorage.clear();
window.sci = createScientific(document.getElementById("s"), { t: (k) => k, icon: () => "", locale: () => "sl", storageKey: () => "t-sci", toast() {}, canSteps: () => false });
window.ready = true;
</script>`;
function serve() {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split("?")[0]);
    if (url === "/t-sci.html") return res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(PAGE);
    const file = url.startsWith("/vendor/katex/") ? path.join(KX, url.slice(14)) : path.join(PUB, path.normalize(url));
    if (!(file.startsWith(PUB) || file.startsWith(KX)) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return res.writeHead(404).end();
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" }).end(fs.readFileSync(file));
  });
  return new Promise((ok) => server.listen(0, "127.0.0.1", () => ok(server)));
}
// brskalniki se zaženejo v testu: CI teče s --test-force-exit, ki konča proces, preden bi se zagnali na vrhu datoteke
async function launchAll() {
  const out = [];
  for (const name of ["chromium", "webkit", "firefox"]) {
    try {
      if (playwright) out.push([name, await playwright[name].launch()]);
    } catch {}
  }
  return out;
}

test("zaslonska ⌫, strojni Backspace/Delete in puščice v brskalniku: brez ostankov (AUDIT-004)", { timeout: 600000 }, async (t) => {
  const engines = await launchAll();
  if (!engines.length) return t.skip("Playwright ni nameščen");
  const server = await serve();
  const url = `http://127.0.0.1:${server.address().port}/t-sci.html`;
  t.after(async () => {
    for (const [, b] of engines) await b.close();
    server.close();
  });
  for (const [engine, browser] of engines) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(url);
    await page.waitForFunction(() => window.ready);
    const start = (ins) =>
      page.evaluate((ins) => {
        const i = document.querySelector(".sc-input");
        i.value = "";
        window.sci.insert(ins);
        i.focus();
      }, ins);
    const state = () =>
      page.evaluate(() => {
        const prev = document.querySelector(".sc-preview");
        return { v: document.querySelector(".sc-input").value, shown: prev.textContent, raw: !!prev.querySelector(".text, .katex-error") };
      });
    const clean = async (where) => {
      const s = await state();
      assert.ok(!s.raw, `${engine} ${where}: surov vnos ${JSON.stringify(s)}`);
      assert.ok(!/integriraj|integral|;;\)|undefined/.test(s.shown), `${engine} ${where}: ostanek ${JSON.stringify(s)}`);
      return s.v;
    };
    for (const [ins, how] of [["∫(@;;)", "screen"], ["integriraj(@)", "screen"], ["d/dx(@)", "screen"], ["limita(@; x; )", "screen"], ["∫(@;;)", "Backspace"], ["integriraj(@)", "Backspace"], ["d/dx(@)", "Backspace"], ["sin(", "Backspace"]]) {
      await start(ins);
      await clean(`${ins} pred ⌫`);
      if (how === "screen") await page.click('.sc-key[data-ins="#del"]');
      else await page.keyboard.press("Backspace");
      assert.equal(await clean(`${ins} ${how}`), "", `${engine}: ${ins} ${how} izbriše predlogo`);
    }
    // vsebina ostane, predloga gre (prej »x)«)
    await start("integriraj(@)");
    await page.keyboard.type("x");
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("Backspace");
    assert.equal(await clean("integriraj(x) ← ⌫"), "x", `${engine}: integriraj(x)`);
    // strojni Delete pred predlogo
    await start("∫(@;;)");
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("Delete");
    assert.equal(await clean("∫ Delete"), "", `${engine}: Delete pred praznim ∫`);
    // puščica levo z začetka integranda ne gre v ime, ⌫ ne pusti pol imena
    await start("integriraj(@)");
    await page.keyboard.type("x");
    for (let k = 0; k < 3; k++) await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("Backspace");
    const v = await clean("integriraj ←←← ⌫");
    assert.ok(v === "integriraj(x)" || v === "x", `${engine}: ${v}`);
    // držanje ⌫ pri izpolnjenem integralu: na koncu prazna vrstica, vmes nikoli ostanki
    await start("∫(@;;)");
    await page.keyboard.type("x");
    for (let k = 0; k < 4; k++) await page.keyboard.press("ArrowRight");
    for (let k = 0; k < 12; k++) {
      await page.click('.sc-key[data-ins="#del"]');
      await clean(`∫ ⌫ ${k}`);
    }
    // Ctrl+Z po strojnem Backspace, Delete in zaslonski ⌫ vrne izbrisano (sistemska razveljavitev ostane; pregled #945)
    for (const how of ["Backspace", "Delete", "screen"]) {
      await start("");
      await page.keyboard.type("sin(x)+2");
      if (how === "Delete") await page.keyboard.press("ArrowLeft");
      if (how === "screen") await page.click('.sc-key[data-ins="#del"]');
      else await page.keyboard.press(how);
      assert.equal((await state()).v, "sin(x)+", `${engine} ${how}`);
      await page.keyboard.press("Control+z");
      assert.equal((await state()).v, "sin(x)+2", `${engine}: Ctrl+Z po ${how}`);
      assert.equal(await page.evaluate(() => document.querySelector(".sc-input").selectionStart), how === "Delete" ? 7 : 8, `${engine}: kazalec po Ctrl+Z (${how})`);
    }
    // razveljavitev vrne tudi kazalec na mesto pred brisanjem; prazno polje (Firefox prej ni vrnil); ponovitev
    const caretAt = () => page.evaluate(() => document.querySelector(".sc-input").selectionStart);
    for (const [typed, after, caret] of [["2+sin(", "2+", 6], ["sin(", "", 4], ["integriraj(", "", 11], ["sin(x)+2", "sin(x)+", 8]]) {
      await start("");
      await page.keyboard.type(typed);
      await page.keyboard.press("Backspace");
      assert.equal((await state()).v, after, `${engine}: ${typed} ⌫`);
      await page.keyboard.press("Control+z");
      assert.equal((await state()).v, typed, `${engine}: Ctrl+Z vrne ${typed}`);
      assert.equal(await caretAt(), caret, `${engine}: kazalec po Ctrl+Z (${typed})`);
      await page.keyboard.press("Control+Shift+z");
      assert.equal((await state()).v, after, `${engine}: Ctrl+Shift+Z ponovi brisanje (${typed})`);
      await page.keyboard.press("Control+z");
      await page.keyboard.press("Control+y");
      assert.equal((await state()).v, after, `${engine}: Ctrl+Y ponovi brisanje (${typed})`);
    }
    assert.deepEqual(errors, [], engine);
    await page.close();
  }
});

// AUDIT-047 (j na evklid.app, telefon): ∫ od 0 do 9 1/√x, kazalec v zgornji meji za 9, zaslonska ⌫ → prikaz vnosa izgine
// (⬚ »Formule ni mogoče prikazati«), besedilo pa ostane. Vzrok: ⌫ je izbrisal ločilo »;« predloge (∫(f;0) ni več
// integral). Zdaj: ⌫, po katerem se zapis ne bi izrisal, ne izbriše ničesar (kazalec gre levo), prazna predloga gre cela.
// Test: predloge s tipkovnice kalkulatorja, kazalec v vsaki reži, ⌫ do praznega; vsako vmesno stanje je izrisano s
// kazalcem in brez ⬚. Brskalnik se zažene v testu (CI teče s --test-force-exit).
import test from "node:test";
import assert from "node:assert/strict";
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
const TYPES = { ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".html": "text/html; charset=utf-8", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".png": "image/png" };
function serve() {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split("?")[0]);
    const file = url.startsWith("/vendor/katex/") ? path.join(KX, url.slice(14)) : path.join(PUB, path.normalize(url));
    if (!(file.startsWith(PUB) || file.startsWith(KX)) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return res.writeHead(404).end();
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" }).end(fs.readFileSync(file));
  });
  return new Promise((ok) => server.listen(0, "127.0.0.1", () => ok(server)));
}

// [opis, tipke s tipkovnice kalkulatorja (data-ins), položaji kazalca v vsaki reži]
const CASES = [
  ["∫ od 0 do 9 1/√x (prijava j)", ["∫(@;;)", "1", "÷", "√(", "x", ")", "#right", "0", "#right", "9"], null],
  ["∫ z izpolnjenimi mejami", ["∫(@;;)", "x", "#right", "0", "#right", "2"], null],
  ["ulomek", ["1", "÷", "2"], null],
  ["koren", ["√(", "2", "+", "x"], null],
  ["potenca", ["2", "^(", "1", "0"], null],
  ["limita", ["#more", "limita(@; x; )", "x", "#right", "#right", "#right", "#right", "0"], null],
  ["vsota", ["#more", "∑_(n=1)^(@) ", "5", "#right", "#right", "n"], null],
  ["produkt", ["#more", "∏_(n=1)^(@) ", "4", "#right", "#right", "n"], null],
];

for (const engine of ["chromium", "webkit", "firefox"]) {
  for (const [vw, opt] of [
    ["1280", { viewport: { width: 1280, height: 800 } }],
    ["360", { viewport: { width: 360, height: 740 }, hasTouch: true, isMobile: engine === "firefox" ? undefined : true }],
  ]) {
    test(`${engine} ${vw}: zaslonska ⌫ v vsaki reži do praznega – prikaz nikoli ne izgine (AUDIT-047)`, { timeout: 300000 }, async (t) => {
      let browser = null;
      try {
        browser = playwright && (await playwright[engine].launch());
      } catch {}
      if (!browser) return t.skip(`${engine} ni nameščen`);
      const server = await serve();
      t.after(async () => {
        await browser.close();
        server.close();
      });
      const page = await (await browser.newContext({ ...opt, locale: "sl-SI" })).newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(`http://127.0.0.1:${server.address().port}/kalkulator.html`);
      await page.waitForSelector(".sc-input", { state: "attached" });
      const touch = !!opt.hasTouch;
      // WebKit v Playwrightu po preventDefault na pointerdown ob dotiku ne pošlje klika (pravi iOS ga): tam klik
      const key = async (ins) => {
        const sel = (await page.locator(`.sc-key[data-ins="${ins}"]`).count()) ? `.sc-key[data-ins="${ins}"]` : `.sc-mk[data-ins="${ins}"]`;
        if (/^[a-wyz]$/.test(ins) || !(await page.locator(sel).count())) return page.keyboard.type(ins); // črka brez tipke (n)
        if (touch && engine !== "webkit") await page.tap(sel);
        else await page.click(sel);
      };
      const state = () =>
        page.evaluate(() => {
          const i = document.querySelector(".sc-input");
          const prev = document.querySelector(".sc-preview");
          return { v: i.value, p: i.selectionStart, bad: !!prev.querySelector(".mat-napaka, .katex-error, .text"), carets: prev.querySelectorAll(".sc-caret").length, empty: !prev.innerHTML.trim() };
        });
      let checked = 0;
      for (const [what, keys] of CASES) {
        await page.evaluate(() => {
          const i = document.querySelector(".sc-input");
          i.value = "";
          i.dispatchEvent(new Event("input"));
        });
        for (const k of keys) await key(k);
        const full = (await state()).v;
        // vsako mesto kazalca od konca proti začetku: ⌫ do praznega
        for (let start = full.length; start >= 1; start--) {
          await page.evaluate(([v, p]) => {
            const i = document.querySelector(".sc-input");
            i.focus({ preventScroll: true });
            i.value = v;
            i.dispatchEvent(new Event("input"));
            i.setSelectionRange(p, p);
            i.dispatchEvent(new KeyboardEvent("keyup"));
          }, [full, start]);
          // ⌫ do začetka vrstice: vsak pritisk nekaj izbriše ali premakne kazalec pred izpolnjeno predlogo (nikoli
          // »hodi« levo brez brisanja po navadnem besedilu), vsako stanje je izrisano s kazalcem
          const press = async (what2) => {
            const before = await state();
            await key("#del");
            const s = await state();
            checked++;
            assert.ok(!s.bad, `${engine} ${vw} ${what}: ⌫ na »${before.v}« @${before.p} → »${s.v}« se ne izriše`);
            if (s.v) assert.equal(s.carets, 1, `${engine} ${vw} ${what}: »${s.v}« brez kazalca`);
            if (s.v) assert.ok(!s.empty, `${engine} ${vw} ${what}: prazen prikaz pri »${s.v}«`);
            // premik brez brisanja je dovoljen le čez zgradbo predloge (oklepaj, zaklepaj, ločilo, ∫, ime; #945 tako vstopi v
            // režo ali gre pred izpolnjeno predlogo)
            const skipped = before.v.slice(s.p, before.p);
            const moved = s.v === before.v && s.p < before.p && (/[()[\];∫√∛∑∏_^]/.test(skipped) || /^[A-Za-zčšž]+$/.test(skipped));
            assert.ok(s.v.length < before.v.length || moved || before.p === 0, `${engine} ${vw} ${what}${what2}: ⌫ na »${before.v}« @${before.p} ni nič izbrisal (→ @${s.p})`);
            return s;
          };
          for (let k = 0; k < 120; k++) {
            const s = await state();
            if (!s.v || s.p === 0) break;
            await press("");
          }
          assert.equal((await state()).p, 0, `${engine} ${vw} ${what}: ⌫ od @${start} pride do začetka`);
          // nato s konca vrstice ⌫ do praznega
          await page.evaluate(() => {
            const i = document.querySelector(".sc-input");
            i.setSelectionRange(i.value.length, i.value.length);
            i.dispatchEvent(new KeyboardEvent("keyup"));
          });
          for (let k = 0; k < 120 && (await state()).v; k++) await press(" (s konca)");
          assert.equal((await state()).v, "", `${engine} ${vw} ${what}: od @${start}, nato s konca, ⌫ do praznega`);
        }
      }
      assert.ok(checked > 100, `${checked}`);
      assert.deepEqual(errors, []);
      t.diagnostic(`${engine} ${vw}: ${checked} pritiskov ⌫`);
    });
  }
}

// Regresijska matrika urejevalnika znanstvenega kalkulatorja (AUDIT-003, AUDIT-004; j, 24. 11. 2026).
// Pravilo aplikacije: v kalkulatorju se nikoli ne vidi surov vnos, samo lep zapis s kazalcem.
//
// 1. Čiste funkcije (sci-vnos.js), ≥ 100 predlog in kombinacij v praznem, delnem in gnezdenem stanju: zapis se izriše
//    (KaTeX, throwOnError), na vsakem položaju je natanko en kazalec in zapis brez kazalca je zapis besedila;
//    merilne točke za dotik niso nikoli sredi imena ali odpirala; ⌫ in Delete pred in za vsakim mestom ne pustita
//    ostankov (»;;)«, »undefined«, pol imena); ◀ ▶ prideta od začetka do konca; izračunana vrednost je prava.
// 2. Pravi brskalnik (Playwright: Chromium, WebKit, Firefox, kar je nameščeno; CI ima Chromium in WebKit), stran
//    /kalkulator.html v slovenščini, 1280 px z miško in 360 px z dotikom: klik/dotik na vsako mesto postavi kazalec
//    točno tja, zaslonska ⌫, strojni Backspace in Delete na vsakem mestu, ◀ ▶ in puščici, hitro tipkanje, preklop
//    znanstveni ↔ grafični, decimalna vejica, samo tipkovnica, osnovne oznake ARIA.
//
// Poln zagon (MATRIKA_VSE=1, vse predloge na vseh mestih) traja ~27 min (Chromium ~7, WebKit ~10, Firefox ~11 min).
// Poganjaj ga po brskalnikih, da ena ukazna meja ne ustavi celote:
//   MATRIKA_VSE=1 node --test --test-force-exit --test-name-pattern="brskalnik chromium" test/urejevalnik-matrika.test.js
//   (nato »brskalnik webkit« in »brskalnik firefox«; čiste funkcije: MATRIKA_VSE=1 … --test-name-pattern="matrika")
//
// Napake, ki jih je matrika našla (AUDIT-034 do AUDIT-040, #970–#974), so popravljene: brez oznak todo.
import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import katex from "katex";
import { entryBase, caretTex, caretStops, stopsTex, stripCaret, backspace, deleteForward, stepCaret, analyzeLive, liveTex, TRUST, HOLE, CARET, pressKey } from "../public/graph/sci-vnos.js";
import { analyze } from "../public/graph/scisolve.js";

const env = { vars: {}, funcs: {}, ans: 0, deg: false, grad: false, comma: true };
// zapis, kot ga naredi kalkulator (sci.js showEntry): za celo besedilo TeX predogleda izračuna, sicer liveTex
function appBase(t, e = env) {
  let r = null;
  try {
    r = analyzeLive(t, e);
  } catch {}
  return entryBase(t, e, (s) => (s === t && r && !r.error && r.tex ? r.tex : liveTex(s, e)));
}

// ---------- predloge in kombinacije ----------
const TEMPLATES = [
  // določeni integrali (prazni, delni, gnezdeni, prazne meje)
  "∫(;;)", "∫(x;;)", "∫(;0;)", "∫(;;1)", "∫(x;0;)", "∫(x;;2)", "∫(x²;0;2)", "∫(x;−1;π)", "∫(sin(x);0;π)", "∫(1/x;1;2)",
  "∫(∫(x;0;1);0;1)", "∫(x;0;∫(1;0;1))", "2∫(x;0;1)+3", "∫(x;0;1)·∫(x;0;1)", "∫(√(x);0;4)", "∫(x^(2);0;2)", "∫(e^(x);0;1)", "∫(x;0;0,5)", "∫(x+1;0;1)", "∫(",
  "∫(x", "∫(x;0", "∫(x;0;1",
  // nedoločeni integrali
  "integriraj()", "integriraj(x)", "integriraj(x²)", "integriraj(sin(x))", "integriraj(t²; t)", "integriraj(1/x)", "integriraj(", "integriraj(x²+1)",
  // limite
  "limita(; x; )", "limita(x; x; 0)", "limita(sin(x)/x; x; 0)", "limita(1/x; x; ∞)", "limita(x²; x; 2)", "limita(", "limita(x; x; ",
  // vsote in produkti
  "∑_(n=1)^() ", "∑_(n=1)^(5) n", "∑_(n=1)^(5) n²", "∑_(k=0)^(10) 2^k", "∑_(n=1)^(5) 1/n", "∏_(n=1)^() ", "∏_(n=1)^(5) n", "∏_(n=1)^(4) (n+1)",
  // odvodi
  "d/dx()", "d/dx(x³)", "d/dx(;)", "d/dx(x³;2)", "d/dx(sin(x))", "d/dx(d/dx(x³))", "d/dx(x²+3x)", "d/dx(", "d/dx(x³;",
  // ulomki
  "1/2", "(1+2)/(3+4)", "1/(2/3)", "3/", "x/y+1", "2/3/4", "1/2+1/3", "(1/2)/(3/4)",
  // potence
  "2^(10)", "x²", "x³", "x⁻¹", "2^(x+1)", "(x+1)^(2)", "e^(2x)", "2^(3^(2))", "10^(−3)", "2×10^(5)", "2^(", "x^(",
  // koreni
  "√(2)", "√()", "∛(8)", "root(3;8)", "√(√(16))", "√(x²+1)", "2√(3)", "√(", "∛(",
  // indeksi
  "x_1", "x_1+x_2", "a_n",
  // matrike
  "det([[; ]; [; ]])", "det([[1; 2]; [3; 4]])", "inverz([[1; 2]; [3; 4]])", "det([[1; 2; 3]; [4; 5; 6]; [7; 8; 10]])", "[[1; 2]; [3; 4]]",
  // enačbe, neenačbe, sistemi
  "2x+3=7", "x²−5x+6=0", "x²<4", "sin(x)=0,5", "reši(x²=4; x)", "x+y=3; x−y=1", "x+y+z=6; x−y=0; z=1", "2x+3=",
  // oklepaji v več ravneh
  "((1+2)·(3+4))", "((2))", "(((x)))", "((1+(2·3))·4)", "abs(x−1)", "(", "((", "(1+(2",
  // funkcije
  "sin(30)", "cos()", "tan(45)", "ln(e)", "log(100)", "nCr(5;2)", "nPr(5;2)", "gcd(12;18)", "lcm(4;6)", "mod(7;3)", "round(2,5)", "sin(cos(x))",
  // ukazi CAS
  "poenostavi(x+x)", "razvij((x+1)²)", "razstavi(x²−1)", "taylor(sin(x); x; 0; 5)", "poenostavi(",
  // decimalna vejica in drugo
  "2,5+1", "0,1+0,2", "sin(0,5)", "1,5E3", "Ans+1", "5!", "π·2", "(1+2i)(3−i)", "12%", "f(x)=x²", "f(x)=",
];

// Prej znane napake (AUDIT-034 brisanje levega operanda, AUDIT-035/036 prazne predloge ∑/∏ in det (#956), AUDIT-037
// natipkan ∫(): popravljene, zato ni več izjem.
const RAW_TODO = {};

const BAD = /;;\)|undefined/;
const render = (tex) => katex.renderToString(tex, { throwOnError: true, strict: "ignore", trust: TRUST });
// kalkulator (sci.js) poda ⌫ in Delete preverjanje izrisa (varovalo AUDIT-034): isto tukaj
const ok = (t) => !t.trim() || !!entryBase(t, env)?.ok;
const shows = (t) => {
  if (!t.trim()) return true;
  const b = entryBase(t, env);
  if (!b?.ok || BAD.test(b.tex)) return false;
  try {
    render(caretTex(b, t.length));
    return true;
  } catch {
    return false;
  }
};
const RUN = /[A-Za-zčšž]{2,}/g;
// odpiralo predloge: ime z oklepajem, ∫(, d/dx(, √(, ∑_(, ×10^( (enota: kazalec ne sme med števki 10, AUDIT-048)
const OPENER = /×10\^\(|[∑∏]_\(|d\/dx\(|[√∛∫]\(|[A-Za-zčšž]{2,}\s*\(/g;
// pol imena: niz črk, ki ga v izvirniku ni, in je del izvirnega imena ali ga vsebuje (integrira, si, sinx)
function halfName(orig, res) {
  const before = new Set(orig.match(RUN) || []);
  return (res.match(RUN) || []).find((r) => !before.has(r) && [...before].some((R) => R.includes(r) || r.includes(R)));
}

test(`matrika: ${TEMPLATES.length} predlog in kombinacij (≥ 100, vse različne)`, () => {
  assert.ok(TEMPLATES.length >= 100);
  assert.equal(new Set(TEMPLATES).size, TEMPLATES.length);
});

for (const t of TEMPLATES) {
  test(`zapis in kazalec: ${t}`, { todo: RAW_TODO[t] }, () => {
    const b = entryBase(t, env);
    assert.ok(b?.ok, "zapis se izriše (ni surovega besedila)");
    assert.doesNotMatch(b.tex, BAD);
    const plain = b.hole ? b.tex.split(b.hole).join(HOLE) : b.tex;
    for (let p = 0; p <= t.length; p++) {
      const tex = caretTex(b, p);
      assert.equal(tex.split(CARET).length - 1, 1, `@${p}: en kazalec`);
      assert.equal(stripCaret(tex), plain, `@${p}: kazalec ne spremeni zapisa`);
      render(tex);
    }
    // merilne točke za dotik: nikoli sredi imena ali odpirala, vsaka ima svoj atom v izrisu
    const html = render(stopsTex(b));
    for (const m of html.matchAll(/data-evk-p="(\d+)"/g)) {
      const p = Number(m[1]);
      const inside = [...t.matchAll(OPENER)].find((o) => o.index < p && p < o.index + o[0].length);
      assert.equal(inside?.[0], undefined, `dotik sredi imena ali odpirala @${p}`);
    }
    // ◀ ▶ od začetka do konca in nazaj
    let p = 0;
    for (let k = 0; k < 200 && p < t.length; k++) {
      const q = stepCaret(b, t, p, 1);
      assert.ok(q > p, `▶ z @${p}`);
      p = q;
    }
    assert.equal(p, t.length, "▶ do konca");
    for (let k = 0; k < 200 && p > 0; k++) p = stepCaret(b, t, p, -1);
    assert.equal(p, 0, "◀ do začetka");
  });

  // ⌫ in Delete na vsakem mestu kazalca: nikoli ostanki predloge ali pol imena (AUDIT-004)
  test(`⌫ in Delete brez ostankov: ${t}`, () => {
    const b = entryBase(t, env);
    const stops = b?.ok ? caretStops(b).map((s) => s.p) : [...Array(t.length + 1).keys()];
    for (const p of stops) {
      for (const [name, fn] of [["⌫", backspace], ["Delete", deleteForward]]) {
        const r = fn(t, p, p, { ok });
        assert.ok(r.pos >= 0 && r.pos <= r.text.length, `${name}@${p}: kazalec v besedilu`);
        assert.doesNotMatch(r.text.replace(/∫\([^()]*\)?/g, ""), /;;\)|^\s*[;)]/, `${name}@${p}: ostanek predloge v »${r.text}«`);
        assert.equal(halfName(t, r.text), undefined, `${name}@${p}: pol imena v »${r.text}«`);
        const rb = r.text.trim() ? entryBase(r.text, env) : null;
        if (rb?.ok) assert.doesNotMatch(rb.tex, /undefined/, `${name}@${p}: ${r.text}`);
      }
    }
  });
}

// zapis po brisanju se izriše (brez surovega besedila; AUDIT-034)
const AFTER_DELETE_RAW = TEMPLATES.filter((t) => {
  const b = entryBase(t, env);
  if (!b?.ok) return false;
  return caretStops(b).some(({ p }) => !shows(backspace(t, p, p, { ok }).text) || !shows(deleteForward(t, p, p, { ok }).text));
});
test("po ⌫ in Delete na vsakem mestu ostane izrisan zapis (AUDIT-034)", () => {
  assert.deepEqual(AFTER_DELETE_RAW, []);
});
test("⌫ in Delete na zgradbi predlog (∫, integriraj, limita, d/dx, koren, funkcije, ukazi) vedno pustita izrisan zapis", () => {
  const TPL = TEMPLATES.filter((t) => /^(∫\(|integriraj\(|limita\(|d\/dx\(|√\(|∛\(|sin\(|cos\(|tan\(|nCr\(|poenostavi\(|taylor\()/.test(t) && !RAW_TODO[t]);
  assert.ok(TPL.length >= 30, `${TPL.length}`);
  for (const t of TPL) {
    const b = entryBase(t, env);
    if (!b?.ok) continue;
    // ⌫ za znakom zgradbe in Delete pred njim (oklepaj, ločilo, zaklepaj): zgradba nikoli ne razpade
    for (const { p } of caretStops(b)) {
      if ("(;)".includes(t[p - 1] || "x")) assert.ok(shows(backspace(t, p).text), `${t} ⌫@${p} → »${backspace(t, p).text}«`);
      if ("(;)".includes(t[p] || "x")) assert.ok(shows(deleteForward(t, p).text), `${t} Delete@${p} → »${deleteForward(t, p).text}«`);
      // (brez varovala: zgradba predloge se ne pokvari niti brez njega)
    }
  }
});

// ---------- vnos = zapis = izračun ----------
const VALUES = [
  ["∫(x²;0;2)", 8 / 3], ["∫(∫(x;0;1);0;1)", 0.5], ["2∫(x;0;1)+3", 4], ["∫(x;0;0,5)", 0.125], ["d/dx(x³;2)", 12], ["limita(sin(x)/x; x; 0)", 1],
  ["limita(x²; x; 2)", 4], ["∑_(n=1)^(5) n", 15], ["∑_(k=0)^(10) 2^k", 2047], ["∏_(n=1)^(5) n", 120], ["√(16)", 4], ["∛(8)", 2], ["nCr(5;2)", 10],
  ["det([[1; 2]; [3; 4]])", -2], ["2,5+1", 3.5], ["0,1+0,2", 0.3], ["2^(10)", 1024], ["(1+2)/(3+4)", 3 / 7], ["1/(2/3)", 1.5], ["ln(e)", 1],
  ["log(100)", 2], ["5!", 120], ["12%", 0.12], ["gcd(12;18)", 6], ["lcm(4;6)", 12], ["mod(7;3)", 1], ["round(2,5)", 3], ["√(√(16))", 2],
];
// AUDIT-059 (j, evklid.app): xʸ v praznem integrandu ∫(□;0;1) je dal ∫(^(;0;1) – »^(« je požrl ločili in meje.
// Vsaka tipka predloge na vsakem mestu kazalca (prazne in polne reže) vsake predloge: zapis se izriše, brez surovih
// ločil (»;« v zapisu), zunanje predloge ohranijo reže (število »;«, zaprtost); ali pa se tipka ne zgodi (null).
const KEYS_T = ["²", "^(", "√(", "⁻¹", "sin(", "∫(@;;)", "d/dx(@)", ";", "×10^(", "!", "%", "°", "(", "abs(", "nCr(@;)"];
const katexOk = (tex) => {
  try {
    render(tex);
    return true;
  } catch {
    return false;
  }
};
function slotsAt(t, p) {
  const st = [];
  for (let i = 0; i < p; i++) {
    if ("([".includes(t[i])) st.push(i);
    else if (")]".includes(t[i])) st.pop();
  }
  return st.map((o) => {
    let d = 0, sep = 0, cl = -1;
    for (let j = o; j < t.length && cl < 0; j++) {
      if ("([".includes(t[j])) d++;
      else if (")]".includes(t[j])) d === 1 ? (cl = j) : d--;
      else if (t[j] === ";" && d === 1) sep++;
    }
    return `${o}:${sep}:${cl >= 0}`;
  }).join(",");
}
const texSemi = (tex) => (tex.replace(/\\text\{[^}]*\}/g, "").match(/;/g) || []).length;
test(`tipke predlog v vsaki reži vsake predloge: zunanja predloga ostane (AUDIT-059)`, () => {
  let n = 0, done = 0;
  for (const T of TEMPLATES) {
    const b0 = entryBase(T, env);
    if (!b0?.ok) continue;
    const stops = new Set([...stopsTex(b0).matchAll(/evk-p=(\d+)/g)].map((m) => Number(m[1])));
    for (const p of stops)
      for (const k of KEYS_T) {
        n++;
        const r = pressKey(T, p, k, env, { check: katexOk });
        if (!r) continue;
        done++;
        const w = `${T} @${p} ${k} → ${r.text}`;
        const b = entryBase(r.text, env);
        assert.ok(b?.ok && !BAD.test(b.tex) && katexOk(caretTex(b, r.pos)), `${w}: ne izriše`);
        assert.ok(texSemi(b.tex) <= texSemi(b0.tex), `${w}: surovo ločilo v ${b.tex}`);
        if (k !== ";") assert.equal(slotsAt(r.text, p), slotsAt(T, p), `${w}: reže zunanje predloge`);
      }
  }
  assert.ok(n > 10000 && done > 0.85 * n, `${done}/${n} tipk izvedenih`);
  // tipke, ki morajo uspeti (ne le ne pokvariti): prazne in polne reže
  for (const [t, p, k, want] of [
    ["∫(;0;1)", 2, "^(", "∫(^();0;1)"], ["∫(;0;1)", 2, "√(", "∫(√();0;1)"], ["∫(x;0;1)", 2, "sin(", "∫(sin(x);0;1)"],
    ["∫(x;0;1)", 3, "^(", "∫(x^();0;1)"], ["∫(x;0;1)", 5, "×10^(", "∫(x;0×10^();1)"], ["∫(;;)", 2, "∫(@;;)", "∫(∫(;;);;)"],
    ["nCr(5;2)", 4, "√(", "nCr(√(5);2)"], ["d/dx(x³)", 7, ";", "d/dx(x³;)"], ["x+y=3; x−y=1", 4, "√(", "x+y=√(3); x−y=1"],
    ["sin(x)", 6, "²", "sin(x)²"], ["2+3", 1, "^(", "2^(+3"], ["", 0, "√(", "√("],
  ]) assert.equal(pressKey(t, p, k, env, { check: katexOk })?.text, want, `${t} @${p} ${k}`);
  // ; v predlogi z določenim številom rež se ne zgodi
  for (const [t, p] of [["∫(;0;1)", 2], ["sin(x)", 5], ["nCr(5;2)", 6], ["2^(5)", 3]]) assert.equal(pressKey(t, p, ";", env), null, `${t} @${p} ;`);
});

test("vnos, zapis in izračun se ujemajo (decimalna vejica, predloge)", () => {
  for (const [t, v] of VALUES) {
    const r = analyze(t, env);
    const got = r?.kind === "cas" ? Number(r.resTex) : r?.value;
    assert.ok(Math.abs(got - v) < 1e-9 * Math.max(1, Math.abs(v)), `${t} = ${got}, pričakovano ${v}`);
    const b = entryBase(t, env);
    assert.ok(b?.ok, t);
    // zapis vnosa (brez kazalca) je isti TeX kot predogled izračuna
    assert.equal(stripCaret(caretTex(b, t.length)), b.tex.split(b.hole || "\u0000").join(HOLE), t);
  }
  assert.deepEqual(analyze("x²−5x+6=0", env).roots, [2, 3]);
});

// ---------- pravi brskalnik ----------
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
// brskalniki se zaženejo v testih: CI teče s --test-force-exit, ki konča proces, preden bi se zagnali na vrhu datoteke

// predloge za brskalnik: vse z do 14 mesti kazalca
const BROWSER = TEMPLATES.filter((t) => !RAW_TODO[t] && entryBase(t, env)?.ok && caretStops(entryBase(t, env)).length <= 14).slice(0, Number(process.env.MATRIKA_N) || Infinity);

let server = null;
const base = async () => {
  server ||= await serve();
  return `http://127.0.0.1:${server.address().port}`;
};
const VIEWS = [
  ["1280", { viewport: { width: 1280, height: 800 } }],
  ["360", { viewport: { width: 360, height: 740 }, hasTouch: true, isMobile: true }],
];
const ALL = process.env.MATRIKA_VSE === "1";
// izbor v CI (Chromium in WebKit, ~3 min skupaj): vsaka n-ta predloga; vse: MATRIKA_VSE=1 (lokalno, ~4 min na brskalnik in širino)
const EVERY = { chromium: { 1280: 3, 360: 6 }, webkit: { 1280: 6, 360: 12 }, firefox: { 1280: 6, 360: 12 } };
const browsers = [];
for (const engine of ["chromium", "webkit", "firefox"]) {
  for (const [vw, opt0] of VIEWS) {
    const opt = engine === "firefox" ? { ...opt0, isMobile: undefined } : opt0;
    test(`brskalnik ${engine} ${vw}: dotik na znake, ⌫, Backspace, Delete, puščice, tipkanje, preklop, vejica, tipkovnica, ARIA`, { timeout: ALL ? 3600000 : 600000 }, async (t) => {
      let browser = null;
      try {
        browser = playwright && (await playwright[engine].launch());
      } catch {}
      if (!browser) return t.skip(`${engine} ni nameščen`);
      browsers.push(browser);
      const url = await base();
      const where = `${engine} ${vw}`;
      let n = 0;
      const ctx = await browser.newContext({ ...opt, locale: "sl-SI" });
      const page = await ctx.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(`${url}/kalkulator.html`);
      await page.waitForSelector(".sc-input", { state: "attached" });
      // pisave KaTeX (velik ∫, oklepaji) se sicer naložijo šele ob prvi rabi in med merjenjem spremenijo širino zapisa;
      // učenec vidi zapis z naloženimi pisavami
      await page.evaluate(() => Promise.all([...document.fonts].filter((f) => /KaTeX/.test(f.family)).map((f) => f.load().catch(() => {}))));
      const touch = !!opt.hasTouch;
      // WebKit v Playwrightu po preventDefault na pointerdown ob dotiku ne pošlje klika (pravi iOS ga): tam klik
      const key = (ins) => (touch && engine !== "webkit" ? page.tap(`.sc-key[data-ins="${ins}"]`) : page.click(`.sc-key[data-ins="${ins}"]`));
      const set = (text, p) =>
        page.evaluate(
          ([text, p]) => {
            const i = document.querySelector(".sc-input");
            i.focus({ preventScroll: true });
            i.value = text;
            i.dispatchEvent(new Event("input"));
            i.setSelectionRange(p, p);
            i.dispatchEvent(new KeyboardEvent("keyup"));
          },
          [text, p],
        );
      const state = () =>
        page.evaluate(() => {
          const i = document.querySelector(".sc-input");
          const prev = document.querySelector(".sc-preview");
          const c = prev.querySelectorAll(".sc-caret");
          const r = c[0]?.getBoundingClientRect();
          return { v: i.value, p: i.selectionStart, shown: prev.textContent, raw: !!prev.querySelector(".text, .katex-error, .mat-napaka"), carets: c.length, x: r ? r.left + r.width / 2 : null, y: r ? r.top + r.height / 2 : null };
        });
      const clean = async (what) => {
        const s = await state();
        assert.ok(!/integriraj|integral|;;\)|undefined/.test(s.shown), `${where} ${what}: ostanek v zapisu ${JSON.stringify(s)}`);
        if (s.v) assert.equal(s.carets, 1, `${where} ${what}: en kazalec ${JSON.stringify(s)}`);
        n++;
        return s;
      };
      const tapAt = (x, y) => (touch ? page.touchscreen.tap(x, y) : page.mouse.click(x, y));

      const every = ALL ? 1 : EVERY[engine][vw];
      for (const [ti, tx] of BROWSER.entries()) {
        if ((ti + (touch ? 1 : 0)) % every) continue;
        const b = appBase(tx, { ...env, deg: true });
        // mesta za dotik (stopsTex: brez mest sredi imena ali odpirala)
        const stops = [...stopsTex(b).matchAll(/evk-p=(\d+)/g)].map((m) => Number(m[1]));
        // dotik/klik na sredino vidnih znakov zapisa (okvirji iz .katex-html, ne merilne točke kalkulatorja): kazalec je ob
        // znaku (AUDIT-003). Samo znaki, ki so v besedilu in v zapisu natanko enkrat (enolično mesto); oklepaji niso
        // vedno na istem mestu kot v besedilu, črke imena funkcije niso mesto kazalca. Preveri se izrisani kazalec ob znaku.
        await set(tx, tx.length);
        const glyphs = await page.evaluate(() => {
          const root = document.querySelector(".sc-preview .katex-html");
          const out = [];
          if (!root) return out;
          const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
          for (let nd; (nd = w.nextNode()); ) {
            if (nd.parentElement.closest(".sc-caret, .sc-hole")) continue;
            for (let k = 0; k < nd.data.length; k++) {
              if (!nd.data[k].trim() || nd.data[k] === "\u200b") continue;
              const r = document.createRange();
              r.setStart(nd, k);
              r.setEnd(nd, k + 1);
              const bb = r.getBoundingClientRect();
              if (bb.width >= 1) out.push({ ch: nd.data[k], x: bb.left + bb.width / 2, y: bb.top + bb.height / 2 });
            }
          }
          return out;
        });
        const cnt = (arr, c) => arr.filter((x) => x === c).length;
        for (const g of glyphs) {
          if (/[()[\]|]/.test(g.ch) || cnt([...tx], g.ch) !== 1 || cnt(glyphs.map((x) => x.ch), g.ch) !== 1) continue;
          const i = [...tx].indexOf(g.ch);
          if ([...tx.matchAll(/[A-Za-zčšž]{2,}(?=\s*\()|×10(?=\^\()/g)].some((m) => m.index <= i && i < m.index + m[0].length)) continue; // ime funkcije, ×10 (enota)
          await set(tx, i === 0 ? tx.length : 0);
          await tapAt(g.x, g.y);
          // kalkulator postavi kazalec v setTimeout po kliku: počakaj na naslednji krog (deterministično tudi pod obremenitvijo)
          await page.evaluate(() => new Promise((r) => setTimeout(() => setTimeout(r, 0), 0)));
          const after = await clean(`${tx} dotik na ${g.ch}`);
          assert.equal(after.v, tx, `${where} ${tx}: dotik ne spremeni vnosa`);
          // izrisani kazalec stoji tik ob tem znaku (v novem izrisu, s kazalcem): v isti višini in med kazalcem in znakom
          // ni nobenega drugega znaka (kazalec za x² in pred < je ob <, čeprav je med njima presledek relacije)
          const at = await page.evaluate((ch) => {
            const prev = document.querySelector(".sc-preview");
            const c = prev.querySelector(".sc-caret")?.getBoundingClientRect();
            if (!c) return null;
            const boxes = [];
            const w = document.createTreeWalker(prev.querySelector(".katex-html"), NodeFilter.SHOW_TEXT);
            for (let nd; (nd = w.nextNode()); ) {
              if (nd.parentElement.closest(".sc-caret, .sc-hole")) continue;
              for (let k = 0; k < nd.data.length; k++) {
                if (!nd.data[k].trim() || nd.data[k] === "\u200b") continue;
                const r = document.createRange();
                r.setStart(nd, k);
                r.setEnd(nd, k + 1);
                const b = r.getBoundingClientRect();
                if (b.width >= 1) boxes.push({ ch: nd.data[k], l: b.left, r: b.right, t: b.top, b: b.bottom });
              }
            }
            return { cx: c.left + c.width / 2, ct: c.top, cb: c.bottom, boxes };
          }, g.ch);
          let ok = false;
          const me = at?.boxes.find((x) => x.ch === g.ch);
          if (me && at.ct < me.b && at.cb > me.t) {
            const [lo, hi] = at.cx <= me.l ? [at.cx, me.l] : at.cx >= me.r ? [me.r, at.cx] : [at.cx, at.cx];
            ok = !at.boxes.some((x) => x !== me && x.l >= lo - 0.5 && x.r <= hi + 0.5 && x.r - x.l > 1 && at.ct < x.b && at.cb > x.t);
          }
          assert.ok(ok, `${where} ${tx}: dotik na »${g.ch}« (${g.x.toFixed(0)}, ${g.y.toFixed(0)}) da kazalec @${after.p}, ne ob znaku (kazalec x ${at?.cx?.toFixed(0)}, znak ${JSON.stringify(me)})`);
        }
        // ⌫ (zaslonska), Backspace in Delete (strojna) na vsakem mestu: kot čiste funkcije, brez surovega besedila
        for (const p of stops) {
          for (const [how, fn] of [["⌫", backspace], ["Backspace", backspace], ["Delete", deleteForward]]) {
            if (!ALL && how === "⌫" && ti % 2) continue;
            await set(tx, p);
            if (how === "⌫") await key("#del");
            else await page.keyboard.press(how);
            const want = fn(tx, p, p, { ok: (x) => !x.trim() || !!appBase(x, { ...env, deg: true })?.ok });
            const s = await clean(`${tx} ${how}@${p}`);
            assert.equal(s.v, want.text, `${where} ${tx} ${how}@${p}: isto kot ${fn.name}`);
            assert.ok(!s.raw, `${where} ${tx} ${how}@${p}: neizrisan zapis »${s.v}«`);
          }
        }
        // ◀ ▶ (zaslonski) in puščici (strojni) gresta po istih mestih kot stepCaret
        for (const [how, d] of [["#right", 1], ["ArrowRight", 1], ["#left", -1], ["ArrowLeft", -1]]) {
          if (!ALL && how.startsWith("#") && ti % 2) continue;
          let p = d > 0 ? 0 : tx.length;
          await set(tx, p);
          for (let k = 0; k < 40; k++) {
            const want = stepCaret(b, tx, p, d);
            if (want === p) break;
            if (how.startsWith("#")) await key(how);
            else await page.keyboard.press(how);
            const s = await clean(`${tx} ${how}`);
            assert.equal(s.p, want, `${where} ${tx} ${how} z @${p}`);
            p = want;
          }
        }
      }

      // hitro tipkanje (strojna tipkovnica, brez zamika): vnos je natanko natipkan, zapis izrisan
      for (const s of ["∫(x²+3x−1;−2;5)", "d/dx(sin(x)·cos(x))", "√(x²+1)/(x−1)+2^(10)", "limita(sin(x)/x; x; 0)", "2,5·(3,1−1,25)/0,5"]) {
        await set("", 0);
        await page.keyboard.type(s, { delay: 0 });
        const st = await clean(`tipkanje ${s}`);
        assert.equal(st.v, s, `${where}: hitro tipkanje`);
        assert.ok(!st.raw, `${where}: ${s} izrisan`);
      }
      // držanje ⌫ (zaslonska tipka ponavlja): na koncu prazno, vmes nikoli ostanki
      await set("d/dx(∫(x²;0;√(2))·sin(x))", 25);
      for (let k = 0; k < 30; k++) {
        await key("#del");
        await clean(`⌫ ${k}`);
      }
      // AUDIT-039: Shift+puščica čez del predloge in ⌫ ne pusti ostankov
      await set("∫(x;0;1)", 0);
      for (let k = 0; k < 3; k++) await page.keyboard.press("Shift+ArrowRight");
      await page.keyboard.press("Backspace");
      assert.equal((await state()).v, "", `${where}: izbira dela predloge in ⌫`);
      // AUDIT-040: opis za bralnik zaslona (slovenščina), nikoli surov vnos
      for (const [tx, want] of [["∫(x;0;1)", /^integral od 0 do 1 x d x kazalec$/], ["1/2", /^1 skozi 2 kazalec$/], ["√(2)", /^koren iz 2/]]) {
        await set(tx, tx.length);
        const said = await page.evaluate(() => document.getElementById(document.querySelector(".sc-input").getAttribute("aria-describedby"))?.textContent || "");
        assert.match(said, want, `${where}: bralnik ${tx} → ${said}`);
      }
      // decimalna vejica (slovenščina): tipka , in rezultat z vejico
      await set("", 0);
      for (const k of ["2", "#dec", "5"]) await key(k);
      await page.keyboard.press("+");
      await key("1");
      assert.equal((await state()).v, "2,5+1", `${where}: decimalna vejica`);
      assert.match(await page.locator(".sc-live").innerText(), /3,5/, `${where}: rezultat z vejico`);
      // samo tipkovnica: Enter izračuna, vrstica se izprazni, zgodovina ima rezultat
      await page.keyboard.press("Enter");
      assert.equal((await state()).v, "", `${where}: Enter izračuna`);
      // preklop znanstveni ↔ grafični: vnos ostane, zapis ostane izrisan
      await set("∫(x;0;2)", 4);
      await page.click('[data-calc-mode="graph"]');
      await page.waitForSelector(".gc-input", { state: "attached" });
      await page.click('[data-calc-mode="sci"]');
      const back = await clean("preklop");
      assert.equal(back.v, "∫(x;0;2)", `${where}: preklop ohrani vnos`);
      assert.ok(!back.raw, `${where}: po preklopu izrisano`);
      // ARIA: polje ima ime, tipke brez besedila imajo aria-label, rezultat je aria-live, zapis je skrit bralniku
      const aria = await page.evaluate(() => ({
        input: document.querySelector(".sc-input").getAttribute("aria-label"),
        unnamed: [...document.querySelectorAll(".sc-key")].filter((b) => !(b.getAttribute("aria-label") || b.textContent.trim())).length,
        icons: ["#del", "#left", "#right", "#ac"].map((k) => document.querySelector(`.sc-key[data-ins="${k}"]`)?.getAttribute("aria-label")),
        live: document.querySelector(".sc-live").getAttribute("aria-live"),
        hidden: document.querySelector(".sc-preview").getAttribute("aria-hidden"),
      }));
      assert.ok(aria.input && !/^sc\./.test(aria.input), `${where}: ime polja ${aria.input}`);
      assert.equal(aria.unnamed, 0, `${where}: tipke brez imena`);
      for (const l of aria.icons) assert.ok(l && !/^sc\./.test(l), `${where}: aria-label ${l}`);
      assert.equal(aria.live, "polite");
      assert.equal(aria.hidden, "true");
      // Tab ali Shift+Tab pride do polja (tipkovnica brez miške; Firefox začne pri zadnjem fokusu)
      await page.evaluate(() => document.activeElement?.blur());
      let found = false;
      for (const key of ["Tab", "Shift+Tab"])
        for (let k = 0; k < 120 && !found; k++) {
          await page.keyboard.press(key);
          found = await page.evaluate(() => document.activeElement?.classList.contains("sc-input"));
        }
      assert.ok(found, `${where}: Tab do polja`);
      assert.deepEqual(errors, [], `${where}: napake na strani`);
      t.diagnostic(`${where}: ${ALL ? "vse" : "izbor"}, ${BROWSER.length} predlog, ${n} preverjenih stanj`);
      await ctx.close();
    });
  }
}
test.after(async () => {
  for (const b of browsers) await b.close();
  server?.close();
});

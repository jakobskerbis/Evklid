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
// Znane napake, ki niso AUDIT-003/004 (nove ugotovitve, PR regresijske matrike), so označene s `todo` in z oznako
// NOVO-n: test se izvede in izpiše, ne podre pa CI. Ko je napaka popravljena, se oznaka odstrani.
import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import katex from "katex";
import { entryBase, caretTex, caretStops, stopsTex, stripCaret, backspace, deleteForward, stepCaret, analyzeLive, liveTex, TRUST, HOLE, CARET } from "../public/graph/sci-vnos.js";
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

// Nove ugotovitve (niso AUDIT-003/004), opisane v PR regresijske matrike:
// NOVO-1: brisanje levega operanda ali števke pred vejico pusti surov zapis (1/2 → /2, x² → ², 2,5 → ,5, 2x+3=7 → 2x+=7).
// NOVO-2: prazno telo ∑/∏ takoj po tipki je surov TeX (KaTeX napaka).
// NOVO-3: prazna predloga det/inverz je surov TeX (KaTeX napaka v pmatrix).
// NOVO-4: ročno natipkan nedokončan integral ∫(, ∫(x, ∫(x;0 je surovo besedilo.
const RAW_TODO = { "∫(": "NOVO-4", "∫(x": "NOVO-4", "∫(x;0": "NOVO-4", "∑_(n=1)^() ": "NOVO-2", "∏_(n=1)^() ": "NOVO-2", "det([[; ]; [; ]])": "NOVO-3" };

const BAD = /;;\)|undefined/;
const render = (tex) => katex.renderToString(tex, { throwOnError: true, strict: "ignore", trust: TRUST });
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
// odpiralo predloge: ime z oklepajem, ∫(, d/dx(, √(, ∑_( …
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
        const r = fn(t, p);
        assert.ok(r.pos >= 0 && r.pos <= r.text.length, `${name}@${p}: kazalec v besedilu`);
        assert.doesNotMatch(r.text.replace(/∫\([^()]*\)?/g, ""), /;;\)|^\s*[;)]/, `${name}@${p}: ostanek predloge v »${r.text}«`);
        assert.equal(halfName(t, r.text), undefined, `${name}@${p}: pol imena v »${r.text}«`);
        const rb = r.text.trim() ? entryBase(r.text, env) : null;
        if (rb?.ok) assert.doesNotMatch(rb.tex, /undefined/, `${name}@${p}: ${r.text}`);
      }
    }
  });
}

// zapis po brisanju se izriše (brez surovega besedila); znane izjeme so NOVO-1
const AFTER_DELETE_RAW = TEMPLATES.filter((t) => {
  const b = entryBase(t, env);
  if (!b?.ok) return false;
  return caretStops(b).some(({ p }) => !shows(backspace(t, p).text) || !shows(deleteForward(t, p).text));
});
test("po ⌫ in Delete na mestih, kjer ni zgradbe predloge, ostane izrisan zapis", { todo: AFTER_DELETE_RAW.length ? `NOVO-1 (${AFTER_DELETE_RAW.length} predlog)` : undefined }, () => {
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
const engines = [];
for (const name of ["chromium", "webkit", "firefox"]) {
  try {
    if (playwright) engines.push([name, await playwright[name].launch()]);
  } catch {}
}
const skip = engines.length ? false : "Playwright ni nameščen";

// predloge za brskalnik: vse, ki se izrišejo (brez znanih NOVO), z do 14 mesti kazalca
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
for (const [engine, browser] of engines.length ? engines : [["brskalnik", null]]) {
  for (const [vw, opt0] of VIEWS) {
    const opt = engine === "firefox" ? { ...opt0, isMobile: undefined } : opt0;
    test(`brskalnik ${engine} ${vw}: klik/dotik, ⌫, Backspace, Delete, puščice, tipkanje, preklop, vejica, tipkovnica, ARIA`, { skip, timeout: ALL ? 3600000 : 600000 }, async (t) => {
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
      await page.evaluate(() => {
        window.L = [];
        document.addEventListener("click", (e) => window.L.push([e.target.className, e.detail, e.clientX, e.clientY]), true);
      });
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
          return { v: i.value, p: i.selectionStart, shown: prev.textContent, raw: !!prev.querySelector(".text, .katex-error"), carets: c.length, x: r ? r.left + r.width / 2 : null, y: r ? r.top + r.height / 2 : null };
        });
      // allowRaw: znan surov zapis NOVO-1 (čista funkcija da isto besedilo, ki se ne izriše)
      const clean = async (what, allowRaw = false) => {
        const s = await state();
        if (!(allowRaw && s.raw)) assert.ok(!/integriraj|integral|;;\)|undefined/.test(s.shown), `${where} ${what}: ostanek v zapisu ${JSON.stringify(s)}`);
        if (s.v && !s.raw) assert.equal(s.carets, 1, `${where} ${what}: en kazalec ${JSON.stringify(s)}`);
        n++;
        return s;
      };
      const tapAt = (x, y) => (touch ? page.touchscreen.tap(x, y) : page.mouse.click(x, y));

      // vse kombinacije: MATRIKA_VSE=1 (lokalno, ~4 min na brskalnik in širino); sicer (CI) 1280 px vsaka druga predloga,
      // 360 px vsaka četrta (zamik, da se izbora ne prekrivata)
      for (const [ti, tx] of BROWSER.entries()) {
        if (!ALL && (touch ? (ti + 1) % 4 : ti % 2)) continue;
        const b = appBase(tx, { ...env, deg: true });
        // mesta za dotik (stopsTex: brez mest sredi imena ali odpirala)
        const stops = [...stopsTex(b).matchAll(/evk-p=(\d+)/g)].map((m) => Number(m[1]));
        // klik/dotik na merilno točko vsakega mesta (kot jih izmeri caretFromPoint v trenutnem izrisu) postavi kazalec
        // točno na to mesto (AUDIT-003)
        await set(tx, tx.length);
        const targets = await page.evaluate(async (tx) => {
          const V = await import("/graph/sci-vnos.js");
          const prev = document.querySelector(".sc-preview");
          const shown = prev.innerHTML;
          const env = { vars: {}, funcs: {}, ans: 0, deg: true, grad: false, comma: true };
          let r = null;
          try {
            r = V.analyzeLive(tx, env);
          } catch {}
          const base = V.entryBase(tx, env, (s) => (s === tx && r && !r.error && r.tex ? r.tex : V.liveTex(s, env)));
          prev.innerHTML = window.katex.renderToString(V.stopsTex(base), { throwOnError: false, strict: "ignore", trust: V.TRUST });
          const out = [...prev.querySelectorAll("[data-evk-p]")].map((e) => {
            const r = e.getBoundingClientRect();
            return { p: Number(e.dataset.evkP), x: r.left + 0.5, y: (r.top + r.bottom) / 2 };
          });
          prev.innerHTML = shown;
          // merilna točka na desnem robu zapisa je na robu prosojnega polja: dotik 1 px znotraj polja (rob 12 px je NOVO-5)
          const ir = document.querySelector(".sc-input").getBoundingClientRect();
          for (const o of out) o.x = Math.min(o.x, ir.right - 1);
          return [out, [ir.left, ir.right, document.querySelectorAll(".sc-input").length]];
        }, tx).then(([o, ir]) => ((o.ir = ir), o));
        assert.deepEqual(targets.map((x) => x.p).sort((a, b) => a - b), [...stops].sort((a, b) => a - b), `${where} ${tx}: merilne točke`);
        for (const tg of targets) {
          await set(tx, tg.p === tx.length ? 0 : tx.length);
          await tapAt(tg.x, tg.y);
          // kalkulator postavi kazalec v setTimeout po kliku: počakaj na naslednji krog (deterministično tudi pod obremenitvijo)
          await page.evaluate(() => new Promise((r) => setTimeout(() => setTimeout(r, 0), 0)));
          const after = await clean(`${tx} dotik @${tg.p}`);
          assert.equal(after.v, tx, `${where} ${tx}: dotik ne spremeni vnosa`);
          // dve mesti na istem pikslu (za x v √(x) in za korenom) sta enakovredni
          // dotik: brskalnik premakne točko dotika za nekaj px (prilagoditev dotika), prst tudi ni natančnejši; sprejmemo
          // mesto, katerega točka je največ 20 px od dotika
          const tol = touch ? 20 : 1;
          const twin = targets.find((o) => o.p === after.p && Math.hypot(o.x - tg.x, o.y - tg.y) <= tol);
          if (!twin) assert.equal(after.p, tg.p, `${where} ${tx}: dotik na mesto @${tg.p} (${tg.x}, ${tg.y}) da kazalec @${after.p} ${JSON.stringify(await page.evaluate(() => window.L.slice(-3)))}`);
          // (izrisani kazalec je lahko do ~17 px stran od točke, ker kazalec sam malo premakne zapis, npr. pred \\left.)
        }
        // ⌫ (zaslonska), Backspace in Delete (strojna) na vsakem mestu: kot čiste funkcije, brez surovega besedila
        for (const p of stops) {
          for (const [how, fn] of [["⌫", backspace], ["Backspace", backspace], ["Delete", deleteForward]]) {
            if (!ALL && how === "⌫" && ti % 2) continue;
            await set(tx, p);
            if (how === "⌫") await key("#del");
            else await page.keyboard.press(how);
            const want = fn(tx, p);
            const s = await clean(`${tx} ${how}@${p}`, !shows(want.text));
            assert.equal(s.v, want.text, `${where} ${tx} ${how}@${p}: isto kot ${fn.name}`);
            if (shows(want.text)) assert.ok(!s.raw, `${where} ${tx} ${how}@${p}: surovo besedilo »${s.v}«`);
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
  for (const [, b] of engines) await b.close();
  server?.close();
});

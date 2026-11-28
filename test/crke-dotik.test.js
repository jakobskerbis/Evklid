// Površina za dotik klikljivih črk v formulah (WCAG 2.5.8, K-11): okvir dotika je vsaj 24 × 24 px, kjer je
// prostor, sosednji okvirji se ne prekrivajo (dotik zadene pravo črko), postavitev besedila in osvetlitev znaka
// ostaneta enaki, ozka formula ne dobi drsnika (public/formula-info.js fitTargets, public/ui.css).
// Pravi brskalnik (Playwright, če je nameščen), računalnik 1280 × 800 in telefon 360 × 740.
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
const NM = path.resolve("node_modules");
const TYPES = { ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".html": "text/html" };
// Vsak razdelek je svoja stran oznak (.fx-page), zato je v vsakem vsak pomen klikljiv.
const DELI = [
  ["vrsta", "div", "Sila $F$, masa $m$ in čas $t$ so izmerjeni."],
  ["tesno", "div", "Sila je $F = m a$, hitrost pa $v = \\frac{s}{t}$."],
  ["ozko", "div", "$$F = m a$$"],
  // Ponovljena črka (v drugič) ni klikljiva, a je ovira: t ob njej ne sme prekriti v.
  ["dvojno", "div", "Prej $v$. Nato $v \\quad t$ in $F = m a$, še enkrat $F$."],
  // Števka brez kartice tik ob črki je ovira: dotik na 3 ne odpre t.
  ["stevka", "div", "Pot je $s = 3 t$."],
];
// Povezave in polje ob črki so ovire: dotik nanje ne sme odpreti črke.
const KONTROL = `Glej <a href="#r">razlago</a> \${inl("$t$")}<a href="#n">naprej</a>, vnesi \${inl("$F$")}<input size="3" aria-label="F">`;
const PAGE = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<link rel="stylesheet" href="/vendor/katex/katex.min.css"><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/ui.css">
<style>body{margin:16px}#ozko{display:inline-block;padding:0;margin:0;background:none;border:0;animation:none}</style>
<main id="c"></main>
<script src="/vendor/katex/katex.min.js"></script><script src="/vendor/marked/marked.umd.js"></script><script src="/vendor/dompurify/purify.min.js"></script>
<script type="module">
import { createRenderer } from "/rich.js";
import { initFormulaInfo, annotateTex, setFormulaSubject } from "/formula-info.js";
setFormulaSubject("FIZ");
const { renderRich } = createRenderer({ annotate: (tex, o) => annotateTex(tex, undefined, o) });
const inl = (x) => renderRich(x).replace(/^\\s*<p>|<\\/p>\\s*$/g, "");
document.getElementById("c").innerHTML = ${JSON.stringify(DELI)}
  .map(([id, tag, txt]) => "<" + tag + ' id="' + id + '" class="fx-page' + (id === "ozko" ? " msg" : "") + '">' + renderRich(txt) + "</" + tag + ">").join("")
  + '<div id="kontrol" class="fx-page"><p>' + \`${KONTROL}\` + "</p></div>";
await document.fonts.ready;
initFormulaInfo();
window.ready = true;
</script>`;

function serve() {
  const server = http.createServer((req, res) => {
    const url = req.url.split("?")[0];
    if (url === "/t.html") return res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(PAGE);
    const vendor = { "/vendor/katex/": "katex/dist/", "/vendor/marked/": "marked/lib/", "/vendor/dompurify/": "dompurify/dist/" };
    const pre = Object.keys(vendor).find((k) => url.startsWith(k));
    const base = pre ? path.join(NM, vendor[pre]) : PUB;
    const file = path.join(base, path.normalize(pre ? url.slice(pre.length) : url));
    if (!file.startsWith(base) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return res.writeHead(404).end();
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" }).end(fs.readFileSync(file));
  });
  return new Promise((ok) => server.listen(0, "127.0.0.1", () => ok(server)));
}

let browser = null;
try {
  if (playwright) browser = await playwright.chromium.launch();
} catch {}
const skip = browser ? false : "Playwright/Chromium ni nameščen";

// Stanje strani: okvir vsake klikljive oznake, njen prozoren rob, okvirji formul in širina drsnega dela.
function stanje() {
  const px = (el, p) => parseFloat(getComputedStyle(el)[p]) || 0;
  const r = (el) => { const b = el.getBoundingClientRect(); return { l: b.left, t: b.top, r: b.right, b: b.bottom }; };
  const oznake = [...document.querySelectorAll('[data-fx][role="button"]')].map((el) => {
    const rob = { t: px(el, "borderTopWidth"), r: px(el, "borderRightWidth"), b: px(el, "borderBottomWidth"), l: px(el, "borderLeftWidth") };
    const o = r(el);
    return { del: el.closest(".fx-page").id, crka: el.textContent, ...o, rob, znak: { l: o.l + rob.l, t: o.t + rob.t, r: o.r - rob.r, b: o.b - rob.b } };
  });
  const formule = [...document.querySelectorAll(".katex")].map(r);
  const ovire = [...document.querySelectorAll('[data-fx]:not([role="button"]), a[href], input, #stevka .mord:not(:has([data-fx])):not([data-fx] .mord)')].map((el) => ({ ime: el.textContent || el.tagName, ...r(el) }));
  const d = document.querySelector("#ozko .katex-display");
  return { oznake, formule, ovire, drsi: d.scrollWidth - d.clientWidth };
}
const nared = () => [...document.querySelectorAll('[data-fx][role="button"]')].every((el) => el.style.getPropertyValue("--fx-l"));
// Pisave KaTeX se naložijo ob prvem izrisu; merimo, ko so naložene in so okvirji preračunani (dve sličici).
const mirno = (p) => p.evaluate(() => document.fonts.ready.then(() => new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok)))));

test("klikljive črke v formulah: dotik vsaj 24 px, brez prekrivanja, postavitev in osvetlitev enaki", { skip }, async (t) => {
  const server = await serve();
  const base = `http://127.0.0.1:${server.address().port}`;
  t.after(async () => {
    await browser.close();
    server.close();
  });
  for (const vp of [{ width: 1280, height: 800 }, { width: 360, height: 740 }]) {
    const ctx = await browser.newContext({ viewport: vp, isMobile: vp.width < 500, hasTouch: vp.width < 500 });
    await ctx.addInitScript(`window.stanje = ${stanje}`);
    const p = await ctx.newPage();
    const errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    await p.goto(`${base}/t.html`);
    await p.waitForFunction(() => window.ready && document.querySelector("[data-fx][role=button]"));
    await p.waitForFunction(nared, null, { timeout: 3000 });
    await mirno(p);
    const po = await p.evaluate(() => window.stanje());
    const ime = (o) => `${vp.width} px, ${o.del} »${o.crka}«`;

    // Samostojne črke v stavku (F, m, t; razmik do sosedov je velik) dosežejo 24 × 24.
    const vrsta = po.oznake.filter((o) => o.del === "vrsta");
    assert.equal(vrsta.length, 3);
    for (const o of vrsta) assert.ok(o.r - o.l >= 24 && o.b - o.t >= 24, `${ime(o)}: ${(o.r - o.l).toFixed(1)} × ${(o.b - o.t).toFixed(1)}`);


    // Brez prozornega roba: formule so na istem mestu in osvetljeni del (znak) je isti kot z robom.
    const brez = await p.evaluate(() => {
      for (const el of document.querySelectorAll("[data-fx]")) for (const s of ["--fx-t", "--fx-r", "--fx-b", "--fx-l"]) el.style.setProperty(s, "0px");
      return window.stanje();
    });
    const enako = (a, b) => ["l", "t", "r", "b"].every((k) => Math.abs(a[k] - b[k]) < 0.02);
    po.formule.forEach((f, i) => assert.ok(enako(f, brez.formule[i]), `${vp.width} px: formula ${i} se je premaknila`));
    po.oznake.forEach((o, i) => assert.ok(enako(o.znak, brez.oznake[i]), `${ime(o)}: osvetljeni del se je spremenil`));
    // Rob ne seže čez okvir, ki formulo drsi: ozka formula ne drsi dlje kot brez roba (KaTeX sam da 2 px).
    assert.ok(po.drsi <= Math.max(0, brez.drsi), `${vp.width} px: ozka formula drsi za ${po.drsi} px (brez roba ${brez.drsi} px)`);
    // Prozoren rob ne prekrije sosednje oznake: prekrivanje dveh okvirjev ni večje kot brez roba (KaTeX-ova
    // okvirja m in a v »m a« se že dotikata za 0,16 em odmika; s nad t v ulomku).
    const prek = (a, b) => Math.max(0, Math.min(a.r, b.r) - Math.max(a.l, b.l)) * Math.max(0, Math.min(a.b, b.b) - Math.max(a.t, b.t));
    for (let i = 0; i < po.oznake.length; i++)
      for (let j = i + 1; j < po.oznake.length; j++) {
        const a = po.oznake[i], b = po.oznake[j];
        const zdaj = prek(a, b), prej = prek(brez.oznake[i], brez.oznake[j]);
        assert.ok(zdaj <= prej + 0.05, `${ime(a)} prekriva ${ime(b)}: ${zdaj.toFixed(2)} px² (brez roba ${prej.toFixed(2)})`);
      }
    // Ne prekrije ovire: ponovljene črke (v v »v \quad t«), povezave ali polja.
    assert.ok(po.ovire.length >= 6, `ovir ${po.ovire.length}`);
    assert.ok(po.ovire.some((v) => v.ime === "3"), "števka 3 je med ovirami");
    po.oznake.forEach((o, i) => po.ovire.forEach((v, k) => {
      const zdaj = prek(o, v), prej = prek(brez.oznake[i], brez.ovire[k]);
      assert.ok(zdaj <= prej + 0.05, `${ime(o)} prekriva oviro »${v.ime}«: ${zdaj.toFixed(2)} px² (brez roba ${prej.toFixed(2)})`);
    }));
    // »t« v »v \quad t« ima levo prostor do ponovljenega v: rob seže tja, a ne čez.
    const tq = po.oznake.find((o) => o.del === "dvojno" && o.crka === "t");
    assert.ok(tq.rob.l > 0, `${ime(tq)}: brez levega roba`);

    // Dotik: tik ob znaku t (v prozornem robu) odpre t; v »m a« del m pred a odpre m, del a za m odpre a
    // (okvirja sosednjih črk si KaTeX-ov odmik 0,08 em delita že brez roba, zato merimo zunaj skupnega dela).
    await p.reload();
    await p.waitForFunction(() => window.ready && document.querySelector("[data-fx][role=button]"));
    await p.waitForFunction(nared, null, { timeout: 3000 });
    await mirno(p);
    const zdaj = await p.evaluate(() => window.stanje());
    const najdi = (del, crka) => zdaj.oznake.find((o) => o.del === del && o.crka === crka);
    const odprta = () => p.evaluate(() => { const el = document.querySelector("[data-fx].fx-open"); return el ? `${el.closest(".fx-page").id} ${el.textContent}` : null; });
    const klik = async (x, y) => {
      await p.mouse.click(x, y);
      const o = await odprta();
      await p.keyboard.press("Escape");
      await p.waitForFunction(() => !document.querySelector("[data-fx].fx-open"));
      return o;
    };
    const tt = najdi("vrsta", "t");
    assert.ok(tt.rob.l >= 2, `rob t: ${tt.rob.l}`);
    assert.equal(await klik(tt.znak.l - tt.rob.l / 2, (tt.t + tt.b) / 2), "vrsta t", "dotik levo ob t");
    const m = najdi("tesno", "m"), a = najdi("tesno", "a");
    assert.equal(await klik((m.znak.l + a.znak.l) / 2, (m.znak.t + m.znak.b) / 2), "tesno m", "m pred a");
    assert.equal(await klik((m.znak.r + a.znak.r) / 2, (a.znak.t + a.znak.b) / 2), "tesno a", "a za m");
    // Povezava in polje tik ob črki ostaneta svoja: dotik 3 px od začetka (KaTeX-ov odmik 0,08 em je skupen že
    // brez roba) odpre povezavo oz. polje, ne črke.
    const naprej = await p.$eval('#kontrol a[href="#n"]', (el) => { const b = el.getBoundingClientRect(); return { x: b.left + 3, y: (b.top + b.bottom) / 2 }; });
    assert.equal(await klik(naprej.x, naprej.y), null, "dotik na povezavo ob t");
    assert.equal(await p.evaluate(() => location.hash), "#n");
    const polje = await p.$eval("#kontrol input", (el) => { const b = el.getBoundingClientRect(); return { x: b.left + 3, y: (b.top + b.bottom) / 2 }; });
    assert.equal(await klik(polje.x, polje.y), null, "dotik na polje ob F");

    // Oznaka preide na drugo pojavitev (prvi F postane ponovljen): njen rob izgine, nič se ne premakne.
    const dvojno = () => p.evaluate(() => {
      const [f1, f2] = [...document.querySelectorAll("#dvojno [data-fx]")].filter((el) => el.textContent === "F");
      const a = [...document.querySelectorAll("#dvojno [data-fx]")].find((el) => el.textContent === "a");
      const k = a.closest(".katex").getBoundingClientRect(), b = a.getBoundingClientRect(), c = f2.getBoundingClientRect();
      return { f1: f1.getAttribute("role"), f2: f2.getAttribute("role"), r1: f1.style.getPropertyValue("--fx-r"), a: b.left - k.left, f2xy: { x: (c.left + c.right) / 2, y: (c.top + c.bottom) / 2 } };
    });
    const pred = await dvojno();
    assert.deepEqual([pred.f1, pred.f2], ["button", null]);
    assert.ok(parseFloat(pred.r1) > 0, `prvi F ima desni rob: ${pred.r1}`);
    await p.mouse.click(pred.f2xy.x, pred.f2xy.y); // fokus na drugem F: oznaka gre nanj (refreshMarks)
    await p.waitForFunction(() => [...document.querySelectorAll("#dvojno [data-fx]")].filter((el) => el.textContent === "F")[1].getAttribute("role") === "button");
    await mirno(p);
    const zatem = await dvojno();
    assert.equal(zatem.f1, null, "prvi F je zdaj ponovljen");
    assert.equal(zatem.r1, "", "ponovljen F nima več roba");
    assert.ok(Math.abs(zatem.a - pred.a) < 0.02, `a za ponovljenim F se je premaknil: ${pred.a} → ${zatem.a}`);

    // Prisilne barve (Windows Visoki kontrast): rob bi bil viden okvir, zato ga tam ni; postavitev ostane.
    await p.emulateMedia({ forcedColors: "active" });
    const vk = await p.evaluate(() => [...document.querySelectorAll('[data-fx][role="button"]')].map((el) => getComputedStyle(el).borderLeftWidth + getComputedStyle(el).borderTopWidth));
    assert.ok(vk.every((w) => w === "0px0px"), `rob v prisilnih barvah: ${vk.join(" ")}`);
    await p.emulateMedia({ forcedColors: "none" });
    assert.deepEqual(errors, []);
    await ctx.close();
  }
});

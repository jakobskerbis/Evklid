// Laboratorij na telefonu: risba ostane vidna, medtem ko učenec uporablja kontrole (j, 2026-11-04;
// docs/laboratorij.md »Na telefonu ostane risba vidna«). Skupni mehanizem: sim/index.js → lab.js pripni + textbook.css.
// 1) brez brskalnika: vsak lab- motor se označi z .lab (tako dobi pripetje), mountSim pokliče pripni, ključ je preveden;
// 2) v pravem brskalniku (Playwright, če je nameščen): vsak lab- motor pri 360 × 740 v drsnem delu kot v aplikaciji –
//    pri vsaki kontroli je risba vsaj 80 % vidna, nobena kontrola ni pod njo, sklep spodaj ni pokrit, gumb »Pripni sliko«
//    jo odpne (zapomnjeno), ležeče (740 × 360) je risba ob kontrolah in cela vidna.
import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { ENGINES } from "../public/sim/index.js";
import SL from "../public/i18n/sl.js";

const LAB = Object.keys(ENGINES).filter((k) => k.startsWith("lab-"));

test("every lab- engine marks itself .lab, and mountSim pins it (lab.js pripni)", async () => {
  assert.ok(LAB.length >= 18);
  for (const id of LAB) {
    const [file, name] = ENGINES[id];
    const src = (await import(`../public/sim/${file}`))[name].toString();
    assert.match(src, /classList\.add\("lab"\)/, `${id} (${file} → ${name}) nima razreda .lab, zato risba na telefonu ni pripeta`);
  }
  const idx = fs.readFileSync("public/sim/index.js", "utf8");
  assert.match(idx, /classList\.contains\("lab"\)\) \(await import\("\.\/lab\.js"\)\)\.pripni\(el\)/);
  assert.ok(SL["sim.lab.pin"]);
  for (const f of fs.readdirSync("public/i18n/ui")) assert.ok(JSON.parse(fs.readFileSync(`public/i18n/ui/${f}`, "utf8"))["sim.lab.pin"], `${f}: sim.lab.pin`);
});

const require = createRequire(import.meta.url);
let playwright = null;
try {
  playwright = require("playwright");
} catch {}
let browser = null;
try {
  if (playwright) browser = await playwright.chromium.launch();
} catch {}
const skip = browser ? false : "Playwright/Chromium ni nameščen";

const PUB = path.resolve("public");
const TYPES = { ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".html": "text/html", ".woff2": "font/woff2" };
// Kot v aplikaciji: glava zgoraj, pod njo drsni pogled z odmikom, v njem kartica .lab-bench (overflow-x: auto).
const PAGE = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/ui.css"><link rel="stylesheet" href="/lab.css"><link rel="stylesheet" href="/textbook.css">
<style>body{margin:0;display:flex;flex-direction:column;height:100dvh}header{height:56px;flex:none;background:#ddd}#v{flex:1;min-height:0;overflow-y:auto;padding:24px 16px 48px}</style>
<header></header><main id="v" class="lab-view"><h2>Poskus</h2><p>Opis poskusa.</p><section class="card lab-bench"><div id="m"></div></section><p style="height:200px">Teme</p></main>
<script type="module">
import { mountSim } from "/sim/index.js";
window.mount = async (id) => { const m = document.getElementById("m"); await mountSim(id, m, {}); await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); };
window.ready = true;
</script>`;

function serve() {
  const server = http.createServer((req, res) => {
    const url = req.url.split("?")[0];
    if (url === "/t-lab.html") return res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(PAGE);
    const file = path.join(PUB, path.normalize(url));
    if (!file.startsWith(PUB) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return res.writeHead(404).end();
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" }).end(fs.readFileSync(file));
  });
  return new Promise((ok) => server.listen(0, "127.0.0.1", () => ok(server)));
}

// Pomakne se do poskusa, nato do vsake kontrole (le toliko, da je vidna) in izmeri risbo.
const MEASURE = async () => {
  const v = document.getElementById("v"), demo = document.querySelector(".demo.lab");
  const top = demo.querySelector(":scope > .lab-tit-top"), stage = top?.querySelector(":scope > .demo-stage"), ctl = top?.querySelector(":scope > .demo-controls");
  if (!stage || !ctl) return { err: "risba in kontrole nista v .lab-tit-top" };
  const frame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  const port = () => v.getBoundingClientRect();
  const vis = (e) => { const r = e.getBoundingClientRect(), p = port(); return r.height ? Math.max(0, Math.min(r.bottom, p.bottom) - Math.max(r.top, p.top)) / r.height : 0; };
  v.scrollTop += top.getBoundingClientRect().top - port().top;
  await frame();
  let min = 1, worst = "", covered = [];
  for (const it of [...ctl.querySelectorAll("button, select, input, .demo-seg")].filter((e) => e.getClientRects().length)) {
    it.scrollIntoView({ block: "nearest" });
    await frame();
    const x = vis(stage);
    if (x < min) (min = x), (worst = (it.textContent || it.getAttribute("aria-label") || it.tagName).trim().slice(0, 30));
    const r = it.getBoundingClientRect(), s = stage.getBoundingClientRect();
    if (r.top < s.bottom - 2 && r.bottom > s.top + 2 && s.left < r.right && s.right > r.left) covered.push(it.textContent.trim().slice(0, 20));
  }
  const q = demo.querySelector(".lab-q");
  q?.scrollIntoView({ block: "center" });
  await frame();
  const qr = q?.getBoundingClientRect(), s = stage.getBoundingClientRect();
  const btn = stage.querySelector(".lab-pin");
  return {
    min, worst, covered, h: s.height / port().height,
    qFree: !q || (!(qr.top < s.bottom - 2 && qr.bottom > s.top + 2) && vis(q) > 0.5),
    pin: btn?.getAttribute("aria-pressed"), label: btn?.getAttribute("aria-label"), sticky: getComputedStyle(stage).position,
    beside: ctl.getBoundingClientRect().left >= s.right - 1 || ctl.getBoundingClientRect().right <= s.left + 1,
    over: document.documentElement.scrollWidth - innerWidth,
  };
};

test("lab on a phone: the drawing stays visible while using the controls", { skip, timeout: 240000 }, async (t) => {
  const server = await serve();
  const base = `http://127.0.0.1:${server.address().port}`;
  t.after(async () => {
    await browser.close();
    server.close();
  });
  const run = async (ctx, id) => {
    const p = await ctx.newPage();
    const errs = [];
    p.on("pageerror", (e) => errs.push(e.message));
    await p.goto(`${base}/t-lab.html`);
    await p.waitForFunction(() => window.ready);
    await p.evaluate((id) => window.mount(id), id);
    await p.waitForTimeout(150);
    return { p, errs };
  };

  await t.test("portrait 360 × 740: every lab engine", async () => {
    const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true });
    for (const id of LAB) {
      const { p, errs } = await run(ctx, id);
      const r = await p.evaluate(MEASURE);
      assert.ok(!r.err, `${id}: ${r.err}`);
      assert.equal(r.sticky, "sticky", `${id}: risba ni pripeta`);
      assert.ok(r.min >= 0.8, `${id}: risba le ${Math.round(r.min * 100)} % vidna pri »${r.worst}«`);
      assert.deepEqual(r.covered, [], `${id}: kontrole pod risbo`);
      assert.ok(r.h <= 0.62, `${id}: pripeta risba zavzame ${Math.round(r.h * 100)} % vidnega dela`);
      assert.ok(r.qFree, `${id}: sklep pod risbo ni dosegljiv`);
      assert.equal(r.pin, "true");
      assert.equal(r.label, "Pripni sliko");
      assert.ok(r.over <= 0, `${id}: vodoravno drsenje`);
      assert.deepEqual(errs, [], id);
      await p.close();
    }
    await ctx.close();
  });

  await t.test("»Pripni sliko« unpins and is remembered; Ponastavi keeps it", async () => {
    const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true });
    const { p } = await run(ctx, "lab-hooke");
    await p.locator(".lab-pin").tap();
    assert.equal(await p.evaluate(() => [localStorage.getItem("evklid.lab.pripni"), getComputedStyle(document.querySelector(".demo-stage")).position, document.querySelector(".lab-pin").getAttribute("aria-pressed")].join()), "0,relative,false");
    await p.locator(".demo-reset").tap();
    await p.waitForTimeout(150);
    assert.equal(await p.evaluate(() => getComputedStyle(document.querySelector(".demo-stage")).position), "relative");
    await p.locator(".lab-pin").tap();
    assert.equal(await p.evaluate(() => localStorage.getItem("evklid.lab.pripni") + getComputedStyle(document.querySelector(".demo-stage")).position), "1sticky");
    await ctx.close();
  });

  await t.test("landscape 740 × 360 and desktop 1280 × 800: drawing beside the controls", async () => {
    for (const [width, height, ids] of [[740, 360, ["lab-ohm", "lab-titracija", "lab-grelnik", "lab-faze"]], [1280, 800, ["lab-co2", "lab-titracija"]]]) {
      const ctx = await browser.newContext({ viewport: { width, height }, isMobile: width < 1000, hasTouch: width < 1000 });
      for (const id of ids) {
        const { p, errs } = await run(ctx, id);
        const r = await p.evaluate(MEASURE);
        assert.ok(r.beside, `${id} @${width}: risba ni ob kontrolah`);
        assert.ok(r.min >= 0.9, `${id} @${width}: risba le ${Math.round(r.min * 100)} % vidna pri »${r.worst}«`);
        assert.deepEqual(errs, [], id);
        await p.close();
      }
      await ctx.close();
    }
  });
});

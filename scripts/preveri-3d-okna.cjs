#!/usr/bin/env node
// Okno dela in kader v 3D pregledovalnikih (docs/3d.md »Okno dela in kader«, j 5. 11.). Pade, ko:
//  - se okno izbranega dela (pregledovalnik .k3-info, atlas .a3-kartica) prekriva s platnom ali ni vidno na zaslonu,
//  - so na odru še barvni krogci (.k3-tocka),
//  - model ob odprtju, po vsaki izbiri (npr. »Glava in vrat (povečano)«) ali po izbiri dela ni cel v kadru.
// Telefon 390×844 (dotik) in računalnik 1280×800. Uporaba:
//   node scripts/preveri-3d-okna.cjs                  vse celice, organi in atlas
//   node scripts/preveri-3d-okna.cjs celica-spermij   le našteti modeli (atlas = »atlas«)
//   PLAYWRIGHT=/pot/do/playwright node scripts/...    (privzeto /opt/npm-tools/node_modules/playwright)
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
let chromium;
try {
  ({ chromium } = require(process.env.PLAYWRIGHT || "/opt/npm-tools/node_modules/playwright"));
} catch {
  ({ chromium } = require("playwright"));
}

function idji(podrocje) {
  const src = fs.readFileSync(path.join(ROOT, "public/3d/modeli", podrocje, "index.js"), "utf8");
  return [...src.matchAll(/id:\s*"([^"]+)"/g)].map((m) => m[1]);
}
const izbrani = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const MODELI = izbrani.length ? izbrani : [...idji("celice"), ...idji("organi"), "atlas"];
const NAPRAVE = [
  ["racunalnik", { viewport: { width: 1280, height: 800 } }],
  ["telefon", { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 }],
];

const napake = [];
const T = Date.now();
const log = (...a) => console.log(((Date.now() - T) / 1000).toFixed(0).padStart(4), ...a);

// V strani: je model (kader pregledovalnika) cel v kadru, in je izbrani del (okvir njegovih vidnih mrež) v kadru?
const STANJE = `async (zDelom) => {
  const host = [...document.querySelectorAll(".k3-pregled")].find((x) => x.k3Pregled);
  const api = host?.k3Pregled;
  if (!api?.model || !api.kit) return { nalaga: true };
  const K = await import("/3d/kader.js");
  const THREE = await import("/vendor/three/build/three.module.js");
  const kam = api.kit.camera;
  const [c, r] = api.kader();
  const out = { model: K.vKadru(THREE, kam, c, r, 1.03) };
  const canvas = host.querySelector("canvas").getBoundingClientRect();
  out.canvas = [canvas.left, canvas.top, canvas.right, canvas.bottom].map(Math.round);
  out.tocke = host.querySelectorAll(".k3-tocka").length;
  const info = host.querySelector(".k3-info");
  if (info && !info.hidden) {
    const b = info.getBoundingClientRect();
    out.info = [b.left, b.top, b.right, b.bottom].map(Math.round);
  }
  if (zDelom) {
    const ids = (api.model.deli || []).map((d) => d.id);
    const d = (api.model.deli || []).find((x) => host.querySelector('[data-del][aria-pressed="true"]')?.dataset.del === x.id);
    if (d) {
      const box = new THREE.Box3();
      for (const m of d.meshes || []) {
        let vid = true;
        for (let x = m; x; x = x.parent) if (!x.visible) vid = false;
        if (vid && m.geometry) box.union(K.obsegVidnega(THREE, m));
      }
      out.del = box.isEmpty() ? true : K.vKadru(THREE, kam, box.getCenter(new THREE.Vector3()), box.getBoundingSphere(new THREE.Sphere()).radius, 1.03);
      out.izbran = d.id;
    } else out.ids = ids.length;
  }
  return out;
}`;

const prekriva = (a, b) => a && b && a[0] < b[2] - 1 && a[2] > b[0] + 1 && a[1] < b[3] - 1 && a[3] > b[1] + 1;

async function pocakaj(p, zDelom, pogoj, ms = 9000) {
  const konec = Date.now() + ms;
  let s = null;
  while (Date.now() < konec) {
    s = await p.evaluate(`(${STANJE})(${zDelom})`).catch((e) => ({ napaka: e.message }));
    if (s && !s.nalaga && pogoj(s)) return s;
    await p.waitForTimeout(400);
  }
  return s;
}

async function preveriModel(p, nm, id, vw) {
  const kje = `${nm} ${id}`;
  await p.goto(`about:blank`);
  await p.goto(`${base}/3d#${id}`, { waitUntil: "load" });
  let s = await pocakaj(p, false, (x) => x.model, id.startsWith("organ-") && !/mreznica|mesicki|nefron|reznjic/.test(id) ? 40000 : 20000);
  if (!s || s.nalaga) return napake.push(`${kje}: model se ni naložil`);
  if (!s.model) napake.push(`${kje}: ob odprtju model ni cel v kadru`);
  if (s.tocke) napake.push(`${kje}: ${s.tocke} barvnih krogcev na odru`);
  // vse izbire (pogledi, faze), razen »ponastaviPogled« (te se vrnejo na začetni okvir)
  const izbire = await p.locator(".k3-pregled .k3-nadzor .k3-seg").count();
  for (let i = 0; i < izbire; i++) {
    const gumbi = p.locator(".k3-pregled .k3-nadzor .k3-seg").nth(i).locator("button[data-k]");
    const n = await gumbi.count();
    for (let j = 0; j < n; j++) {
      const g = gumbi.nth(j);
      if (!(await g.isVisible().catch(() => false))) continue;
      const ime = (await g.textContent()).trim();
      await g.click({ timeout: 5000 }).catch(() => {});
      s = await pocakaj(p, false, (x) => x.model);
      if (!s?.model) napake.push(`${kje}: po izbiri »${ime}« model ni cel v kadru`);
    }
  }
  // prvi in zadnji del iz seznama
  const deli = p.locator(".k3-pregled [data-del]");
  const nd = await deli.count();
  for (const k of [...new Set([0, nd - 1])].filter((k) => k >= 0)) {
    const b = deli.nth(k);
    await b.scrollIntoViewIfNeeded().catch(() => {});
    await b.click({ timeout: 5000 }).catch(() => {});
    s = await pocakaj(p, true, (x) => x.info && x.model && x.del !== false);
    const del = s?.izbran || `#${k}`;
    if (!s?.info) { napake.push(`${kje}/${del}: okno dela se ni odprlo`); continue; }
    if (prekriva(s.info, s.canvas)) napake.push(`${kje}/${del}: okno dela ${s.info} prekriva platno ${s.canvas}`);
    if (s.info[1] >= vw.height - 40 || s.info[0] >= vw.width - 40) napake.push(`${kje}/${del}: okno dela ni na zaslonu ${s.info}`);
    if (!s.model) napake.push(`${kje}/${del}: model po izbiri dela ni cel v kadru`);
    if (s.del === false) napake.push(`${kje}/${del}: izbrani del ni v kadru`);
  }
}

async function preveriAtlas(p, nm, vw) {
  await p.goto(`${base}/3d#atlas?izberi=Femur.r`, { waitUntil: "load" });
  const konec = Date.now() + 90000;
  let s = null;
  while (Date.now() < konec) {
    s = await p.evaluate(() => {
      const k = document.querySelector(".a3-kartica");
      const c = document.querySelector(".a3-oder canvas") || document.querySelector(".a3 canvas");
      if (!k || k.hidden || !c || !k.getClientRects().length) return null;
      const r = (x) => { const b = x.getBoundingClientRect(); return [b.left, b.top, b.right, b.bottom].map(Math.round); };
      return { info: r(k), canvas: r(c), tocke: document.querySelectorAll(".a3 .k3-tocka").length };
    });
    if (s) break;
    await p.waitForTimeout(500);
  }
  if (!s) return napake.push(`${nm} atlas: kartica dela se ni odprla`);
  await p.waitForTimeout(800);
  s = await p.evaluate(() => {
    const r = (x) => { const b = x.getBoundingClientRect(); return [b.left, b.top, b.right, b.bottom].map(Math.round); };
    return { info: r(document.querySelector(".a3-kartica")), canvas: r(document.querySelector(".a3-oder canvas") || document.querySelector(".a3 canvas")) };
  });
  if (prekriva(s.info, s.canvas)) napake.push(`${nm} atlas: kartica ${s.info} prekriva platno ${s.canvas}`);
  if (s.info[1] >= vw.height - 40) napake.push(`${nm} atlas: kartica ni na zaslonu ${s.info}`);
}

const port = 36000 + Math.floor(Math.random() * 2000);
const base = `http://localhost:${port}`;
(async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-3dokna-"));
  const srv = spawn(process.execPath, ["--disable-warning=ExperimentalWarning", "server/index.js"], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(port), EVKLID_MOCK: "1", EVKLID_MOCK_DELAY_MS: "0", EVKLID_NEWS: "0", EVKLID_DB: path.join(dir, "t.db"), EVKLID_PASSWORD: "", ANTHROPIC_API_KEY: "", RESEND_API_KEY: "", STRIPE_SECRET_KEY: "" },
    stdio: "ignore",
  });
  let browser;
  try {
    for (let i = 0; i < 150; i++) {
      try { if ((await fetch(base + "/healthz")).ok) break; } catch {}
      await new Promise((r) => setTimeout(r, 200));
    }
    browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
    for (const [nm, opt] of NAPRAVE) {
      const ctx = await browser.newContext(opt);
      const p = await ctx.newPage();
      p.on("pageerror", (e) => napake.push(`${nm}: napaka strani ${e.message.slice(0, 160)}`));
      for (const id of MODELI) {
        const pred = napake.length;
        try {
          if (id === "atlas") await preveriAtlas(p, nm, opt.viewport);
          else await preveriModel(p, nm, id, opt.viewport);
        } catch (e) {
          napake.push(`${nm} ${id}: ${e.message.split("\n")[0].slice(0, 200)}`);
        }
        log(nm, id, napake.length === pred ? "ok" : "NAPAKA");
      }
      await ctx.close();
    }
  } finally {
    await browser?.close();
    srv.kill();
    fs.rmSync(dir, { recursive: true, force: true });
  }
  if (napake.length) {
    console.error(`\n${napake.length} napak:\n` + napake.map((x) => "  - " + x).join("\n"));
    process.exit(1);
  }
  console.log(`\nOK: ${MODELI.length} modelov × ${NAPRAVE.length} naprav, okno dela nikoli čez platno, model cel v kadru.`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

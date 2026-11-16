// Meritev kalkulatorja (naloga hitrost +9, pregled PR #481): odprtje kalkulatorja in prvi/topli preklop razdelkov
// (Grafični, Orodja, PSE, Formule, Znanstveni) na telefonu (srednji Android) in iPadu (velikost iPada v Chromiumu,
// ni Safari). Izmenično A/B: več različic izvora (npr. main in veja), vsaka v svojem krogu, v vrstnem redu
// A, B, A, B … (ali B, A, …), da obremenitev strežnika enako zadene obe.
//
//   node scripts/meri-kalkulator.cjs [--krogi 5] [--naprave android,ipad] [--md izid.md] [--json izid.json] \
//        <oznaka>=<mapa> [<oznaka>=<mapa> …]
//   npr. node scripts/meri-kalkulator.cjs --krogi 5 main=../wt-main veja=.
//
// Mere (ms): fb = prva slika po tapu (izbran gumb, odziv), ms = prva slika z vidno vsebino razdelka.
// Izpis: mediana in razpon (min–max) čez kroge. Potrebuje Playwright s Chromiumom in v vsaki mapi nameščen
// node_modules (strežnik teče iz te mape, z lažnim AI in prazno bazo). Ena meritev naenkrat (2 jedri).
// Opomba: CPU 4× in Slow 4G v Chromiumu ni pravi telefon; številke so relativna primerjava različic.
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const net = require("node:net");
const path = require("node:path");
const { chromium } = require("playwright");

const args = process.argv.slice(2);
const opt = (n, d) => {
  const i = args.indexOf(n);
  if (i < 0) return d;
  const v = args[i + 1];
  args.splice(i, 2);
  return v;
};
const ROUNDS = Number(opt("--krogi", "5"));
const DEVICES = opt("--naprave", "android,ipad").split(",");
const MD = opt("--md", null);
const JSON_OUT = opt("--json", null);
const VARIANTS = args.map((a) => {
  const [label, dir] = a.includes("=") ? a.split("=") : [path.basename(path.resolve(a)), a];
  return { label, dir: path.resolve(dir) };
});
if (!VARIANTS.length) {
  console.error("Uporaba: node scripts/meri-kalkulator.cjs [--krogi 5] [--naprave android,ipad] [--md f] <oznaka>=<mapa> …");
  process.exit(2);
}

const SLOW_4G = { offline: false, latency: 562.5, downloadThroughput: ((1.6 * 1024 * 1024) / 8) * 0.9, uploadThroughput: ((750 * 1024) / 8) * 0.9 };
const DEV = {
  // srednji Android (npr. Galaxy A5x): 412×915, DPR 2,6, CPU ≈ 4× počasnejši od računalnika, Slow 4G
  android: { viewport: { width: 412, height: 915 }, deviceScaleFactor: 2.625, cpu: 4, net: SLOW_4G },
  // iPad (10. gen./Air) po velikosti: 820×1180, DPR 2, CPU ≈ 2×, Wi-Fi brez omejitve
  ipad: { viewport: { width: 820, height: 1180 }, deviceScaleFactor: 2, cpu: 2, net: null },
};
const MODES = ["graph", "tools", "pse", "formulas", "sci"];

const freePort = () =>
  new Promise((resolve, reject) => {
    const s = net.createServer();
    s.listen(0, () => {
      const { port } = s.address();
      s.close(() => resolve(port));
    });
    s.on("error", reject);
  });

// V strani: tap → prva slika z izpolnjenim pogojem (CSP brez unsafe-eval: pogoji so vnaprej določene funkcije).
function PAGE() {
  const vis = (el) => {
    if (!el || !el.isConnected) return false;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;
    for (let x = el; x && x.nodeType === 1; x = x.parentElement) {
      if (x.hidden) return false;
      const cs = getComputedStyle(x);
      if (cs.display === "none" || cs.visibility === "hidden") return false;
    }
    return true;
  };
  const any = (q) => [...document.querySelectorAll(q)].some(vis);
  const C = {
    sci: () => any("#graph-slot .sc-entry, #graph-overlay-body .sc-entry"),
    graph: () => any("#graph-slot canvas"),
    tools: () => any("#graph-slot .tl-view"),
    pse: () => any("#graph-slot .pse-el"),
    formulas: () => any("#graph-slot .fm-sec, #graph-slot .fm-body .card"),
  };
  window.__tap = (sel, cond, timeout = 20000) =>
    new Promise((res) => {
      const t0 = performance.now();
      const el = document.querySelector(sel);
      if (!el) return res({ err: "ni " + sel });
      el.click();
      let fb = null;
      const tick = () => {
        if (fb === null) fb = performance.now() - t0;
        let ok = false;
        try {
          ok = C[cond]();
        } catch {}
        if (ok) return setTimeout(() => res({ fb: Math.round(fb), ms: Math.round(performance.now() - t0) }), 0);
        if (performance.now() - t0 > timeout) return res({ fb: Math.round(fb), ms: null });
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
}

async function startServer(dir) {
  const port = await freePort();
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-kalk-"));
  const env = { ...process.env, PORT: String(port), EVKLID_MOCK: "1", EVKLID_MOCK_DELAY_MS: "0", EVKLID_NEWS: "0", EVKLID_DB: path.join(tmp, "t.db"), EVKLID_PASSWORD: "", ANTHROPIC_API_KEY: "", RESEND_API_KEY: "", STRIPE_SECRET_KEY: "" };
  const srv = spawn(process.execPath, ["--disable-warning=ExperimentalWarning", "server/index.js"], { cwd: dir, env, stdio: "ignore" });
  const base = `http://localhost:${port}`;
  for (let i = 0; i < 300; i++) {
    try {
      if ((await fetch(base + "/healthz")).ok) return { base, stop: () => (srv.kill(), fs.rmSync(tmp, { recursive: true, force: true })) };
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  srv.kill();
  throw new Error(`strežnik v ${dir} se ni zagnal`);
}

// Profil učenca (OŠ, 8. razred) ustvari stran sama (piškotek naprave).
async function newStudent(browser, base) {
  const ctx = await browser.newContext({ locale: "sl-SI", serviceWorkers: "block" });
  const p = await ctx.newPage();
  await p.goto(base + "/healthz");
  const id = await p.evaluate(() =>
    fetch("/api/students", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: "Meritev", settings: { school: "OSNOVNA_SOLA", grade: "8. razred" } }) })
      .then((r) => r.json())
      .then((s) => s.id),
  );
  const state = await ctx.storageState();
  await ctx.close();
  return { id, cookies: state.cookies };
}

async function measure(browser, base, name) {
  const dv = DEV[name];
  const { id, cookies } = await newStudent(browser, base);
  const ctx = await browser.newContext({ viewport: dv.viewport, deviceScaleFactor: dv.deviceScaleFactor, hasTouch: true, isMobile: true, locale: "sl-SI", timezoneId: "Europe/Ljubljana", serviceWorkers: "allow" });
  await ctx.addCookies(cookies);
  await ctx.addInitScript((id) => {
    localStorage.setItem("studentId", String(id));
    localStorage.setItem("evklid.calcMode", "sci");
    localStorage.setItem("evklid.tour", "1");
  }, id);
  await ctx.addInitScript(PAGE);
  const r = {};
  try {
    // 1. obisk: service worker se namesti, datoteke se shranijo; meritve so ob 2. in 3. obisku (toplo)
    let page = await ctx.newPage();
    await page.goto(base + "/");
    await page.waitForSelector("#view-path #xp-card .hero", { timeout: 60000 });
    await page.waitForTimeout(5000);
    await page.close();
    for (const pass of ["takoj", "mir"]) {
      page = await ctx.newPage();
      const cdp = await ctx.newCDPSession(page);
      if (dv.net) {
        await cdp.send("Network.enable");
        await cdp.send("Network.emulateNetworkConditions", dv.net);
      }
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: dv.cpu });
      await page.goto(base + "/");
      await page.waitForSelector("#view-path #xp-card .hero", { timeout: 90000 });
      // takoj: tap na Kalkulator 1 s po odprtju; mir: 8 s brez dotika, po odprtju še 6 s (priprava ob nedejavnosti)
      await page.waitForTimeout(pass === "takoj" ? 1000 : 8000);
      r[`odprtje_${pass}`] = await page.evaluate(() => window.__tap('.topbar .tab[data-view="graph"]', "sci"));
      await page.waitForTimeout(pass === "mir" ? 6000 : 300);
      for (const m of MODES) {
        r[`${m}_prvic_${pass}`] = await page.evaluate((m) => window.__tap(`#view-graph [data-calc-mode="${m}"]`, m), m);
        await page.waitForTimeout(700);
      }
      if (pass === "mir")
        for (const m of MODES) {
          r[`${m}_toplo`] = await page.evaluate((m) => window.__tap(`#view-graph [data-calc-mode="${m}"]`, m), m);
          await page.waitForTimeout(400);
        }
      await page.close();
    }
  } finally {
    await ctx.close();
  }
  return r;
}

const median = (a) => {
  const b = a.filter((x) => x != null).sort((x, y) => x - y);
  if (!b.length) return null;
  const h = b.length >> 1;
  return b.length % 2 ? b[h] : Math.round((b[h - 1] + b[h]) / 2);
};
const fmt = (a) => {
  const b = a.filter((x) => x != null);
  if (!b.length) return "–";
  return `${median(b)} (${Math.min(...b)}–${Math.max(...b)})${b.length < a.length ? ` ⚠ ${a.length - b.length}× čas potekel` : ""}`;
};

(async () => {
  const browser = await chromium.launch();
  const runs = {}; // runs[label][device][metric] = [{fb, ms}, …]
  const order = [];
  try {
    for (let k = 0; k < ROUNDS; k++) {
      // izmenično: v lihih krogih obrnjen vrstni red (A B, B A, A B …)
      const vs = k % 2 ? [...VARIANTS].reverse() : VARIANTS;
      for (const v of vs) {
        const srv = await startServer(v.dir);
        try {
          for (const d of DEVICES) {
            const r = await measure(browser, srv.base, d);
            for (const [m, x] of Object.entries(r)) ((((runs[v.label] ||= {})[d] ||= {})[m] ||= [])).push(x);
            order.push(`${k + 1}:${v.label}:${d}`);
            console.error(`krog ${k + 1}/${ROUNDS} ${v.label} ${d}: Formule prvič (mir) ${r.formulas_prvic_mir?.ms} ms`);
          }
        } finally {
          srv.stop();
        }
      }
    }
  } finally {
    await browser.close();
  }
  const out = { krogi: ROUNDS, naprave: DEVICES, vrstniRed: order, cpus: os.cpus().length, load: os.loadavg(), runs };
  if (JSON_OUT) fs.writeFileSync(JSON_OUT, JSON.stringify(out, null, 1));
  const labels = VARIANTS.map((v) => v.label);
  const lines = [`Krogov: ${ROUNDS} (izmenično ${labels.join(" ↔ ")}), mediana (min–max) v ms; vsebina, v oklepaju pri imenu odziv = prva slika.`, ""];
  for (const d of DEVICES) {
    lines.push(`### ${d}`, "", `| meritev | ${labels.join(" | ")} |`, `|---|${labels.map(() => "---").join("|")}|`);
    const metrics = Object.keys(runs[labels[0]]?.[d] || {});
    for (const m of metrics) {
      lines.push(`| ${m} | ${labels.map((l) => fmt((runs[l]?.[d]?.[m] || []).map((x) => x.ms))).join(" | ")} |`);
      if (/^formulas_/.test(m)) lines.push(`| ${m} (odziv) | ${labels.map((l) => fmt((runs[l]?.[d]?.[m] || []).map((x) => x.fb))).join(" | ")} |`);
    }
    lines.push("");
  }
  const md = lines.join("\n");
  if (MD) fs.writeFileSync(MD, md);
  console.log(md);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

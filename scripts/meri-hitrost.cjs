// Meritev hitrosti odpiranja zaslonov (naloga »Takojšnje odpiranje«, j 6. 11. 2026).
// Za vsak zaslon izmeri čas od tapa do (1) vidne lupine zaslona, (2) prve uporabne slike in
// (3) interaktivnosti (po zadnji dolgi nalogi glavne niti, 300 ms brez dolgih nalog).
// Dve napravi: telefon 390×844 (dotik, CPU 4× počasneje, omrežje »Slow 4G«) in računalnik 1280×800.
// Trije prehodi: hladno (prazen predpomnilnik, brez SW), toplo (ponovno nalaganje z delujočim SW) in
// drugič (isti zaslon še enkrat v isti seji, vse že v pomnilniku). Posebej še preklop podzavihkov kalkulatorja.
// Zagon: node scripts/meri-hitrost.cjs [--samo telefon|racunalnik] [--json <datoteka>] [--md <datoteka>]
// Potrebuje Playwright s Chromiumom. Naenkrat teče en brskalnik.
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const net = require("node:net");
const path = require("node:path");
const { chromium } = require("playwright");

const ROOT = path.join(__dirname, "..");
const args = process.argv.slice(2);
const arg = (n) => (args.indexOf(n) >= 0 ? args[args.indexOf(n) + 1] : null);
const ONLY = arg("--samo");

const freePort = () =>
  new Promise((resolve, reject) => {
    const s = net.createServer();
    s.listen(0, () => {
      const { port } = s.address();
      s.close(() => resolve(port));
    });
    s.on("error", reject);
  });

async function startServer() {
  const port = await freePort();
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-hitrost-"));
  const env = {
    ...process.env,
    PORT: String(port),
    EVKLID_MOCK: "1",
    EVKLID_MOCK_DELAY_MS: "0",
    EVKLID_NEWS: "0",
    EVKLID_DB: path.join(dir, "t.db"),
    EVKLID_PASSWORD: "",
    ANTHROPIC_API_KEY: "",
    RESEND_API_KEY: "",
    STRIPE_SECRET_KEY: "",
  };
  const log = [];
  const srv = spawn(process.execPath, ["--disable-warning=ExperimentalWarning", "server/index.js"], { cwd: ROOT, env, stdio: ["ignore", "pipe", "pipe"] });
  srv.stdout.on("data", (d) => log.push(String(d)));
  srv.stderr.on("data", (d) => log.push(String(d)));
  const base = `http://localhost:${port}`;
  for (let i = 0; i < 150; i++) {
    try {
      if ((await fetch(base + "/healthz")).ok) return { base, srv, dir };
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  srv.kill();
  throw new Error(`strežnik se ni zagnal:\n${log.join("")}`);
}

const DEVICES = {
  telefon: { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, cpu: 4, net: true },
  racunalnik: { viewport: { width: 1280, height: 800 }, hasTouch: false, isMobile: false, cpu: 1, net: false },
};
// DevTools »Slow 4G«: 562,5 ms zakasnitve, 1,6 Mb/s prenos, 750 kb/s oddaja (z 0,9 kot v DevTools).
const SLOW_4G = { offline: false, latency: 562.5, downloadThroughput: ((1.6 * 1024 * 1024) / 8) * 0.9, uploadThroughput: ((750 * 1024) / 8) * 0.9 };

// Zasloni: tap (izraz, ki klikne), lupina (vidna takoj) in uporabno (vsebina, s katero učenec že dela).
const SCREENS = [
  { id: "pot", name: "Učna pot", tap: `q('.topbar .tab[data-view="path"]').click()`, shell: "#view-path", ready: "#view-path #xp-card .hero" },
  { id: "ucbenik", name: "Uči se → Učbenik", pre: `localStorage.setItem("evklid.uciZavihek","textbook")`, tap: `q('.topbar .tab[data-view="uci"]').click(); q('#view-uci [data-uci-tab="textbook"]').click()`, shell: "#view-textbook", ready: "#view-textbook .tb-head" },
  { id: "lab", name: "Uči se → Laboratorij", tap: `q('#view-uci [data-uci-tab="lab"]').click()`, shell: "#view-lab", ready: "#view-lab .lab-card" },
  { id: "3d", name: "Uči se → 3D svet", tap: `q('#view-uci [data-uci-tab="3d"]').click()`, shell: "#view-3d", ready: "#view-3d .uci-3d-card, #view-3d .uci-3d-atlas" },
  { id: "3dmodel", name: "3D model (pregledovalnik)", tap: `q('#view-3d .uci-3d-card').click()`, shell: ".uci-3d-full, iframe.uci-3d-frame, .uci-3d-full iframe", ready: "@frame-canvas", tti: false },
  { id: "instruktor", name: "Inštruktor", tap: `q('.topbar .tab[data-view="chat"]').click()`, shell: "#view-chat", ready: "#view-chat #input" },
  { id: "tipkovnica", name: "Tipkovnica (fokus v vnos)", before: `q('.topbar .tab[data-view="chat"]')`, tap: `const i = q('#input'); i.focus(); i.click()`, shell: "#tipkovnica", ready: "#tipkovnica button", only: "telefon" },
  { id: "skener", name: "Skeniraj", tap: `q('.topbar .tab[data-view="scan"]').click()`, shell: "#view-scan", ready: '#view-scan [data-act="type"]' },
  { id: "kalk", name: "Kalkulator (zavihek)", pre: `localStorage.setItem("evklid.calcMode","sci")`, tap: `q('.topbar .tab[data-view="graph"]').click()`, shell: "#view-graph", ready: "#graph-slot > * button" },
  { id: "kalk-pot", name: "Kalkulator iz Učne poti", before: `q('.topbar .tab[data-view="path"]')`, tap: `q('#view-path .calc-open').click()`, shell: "#graph-overlay", ready: "#graph-overlay-body > * button", after: `q('#graph-close')` },
  { id: "tekmovanja", name: "Tekmovanja", tap: `q('.topbar .tab[data-view="competition"]').click()`, shell: "#view-competition", ready: "#view-competition .card, #view-competition button" },
  { id: "igre", name: "Igre", tap: `q('.topbar .tab[data-view="games"]').click()`, shell: "#view-games", ready: "#view-games .card, #view-games button" },
  { id: "urnik", name: "Urnik", tap: `q('.topbar .tab[data-view="schedule"]').click()`, shell: "#view-schedule", ready: "#view-schedule button" },
  { id: "koticek", name: "Kotiček", tap: `q('.topbar .tab[data-view="corner"]').click()`, shell: "#view-corner", ready: "#view-corner .card, #view-corner button" },
  { id: "napredek", name: "Napredek", tap: `q('.topbar .tab[data-view="progress"]').click()`, shell: "#view-progress", ready: "#view-progress .card" },
  { id: "nastavitve", name: "Nastavitve", tap: `q('.topbar .tab[data-view="settings"]').click()`, shell: "#view-settings", ready: "#settings-form select, #settings-form button" },
  { id: "lige", name: "Lige", tap: `q('.topbar .tab[data-view="league"]').click()`, shell: "#view-league", ready: "#view-league .card, #view-league li, #view-league button" },
  { id: "jaz", name: "Jaz (spodnja vrstica)", tap: `q('#tabbar .tab[data-view="me"]').click()`, shell: "#view-me", ready: "#view-me [data-go]", only: "telefon" },
  { id: "meni-profila", name: "Meni profila (dialog)", before: `q('.topbar .tab[data-view="path"]')`, tap: `q('#profile-btn').click()`, shell: "#profile-pop", ready: "#profile-pop button, #profile-pop a", after: `q('#profile-btn')` },
  { id: "nadaljuj", name: "Nadaljuj z učenjem (dialog)", tap: `q('.topbar .brand').click()`, shell: "#quick-pop", ready: "#quick-pop .qs-row", after: `q('.topbar .brand')` },
];
const CALC_MODES = [
  ["sci", "Znanstveni"],
  ["graph", "Grafični"],
  ["tools", "Orodja"],
  ["pse", "PSE"],
  ["formulas", "Formule"],
];

// V strani: tap, nato vsak okvir preveri lupino in uporabno vsebino; interaktivno = konec zadnje dolge naloge
// (≥ 50 ms) po tapu, ko 300 ms ni nove. Vrne ms od tapa.
function PAGE_MERI() {
  window.__long = [];
  try {
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) window.__long.push(e.startTime + e.duration);
    }).observe({ type: "longtask", buffered: false });
  } catch {}
  const visible = (el) => {
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
  const anyVisible = (sel) => {
    if (sel === "@calc-changed") {
      const el = [...(document.querySelector("#graph-slot")?.children || [])].find((c) => !c.hidden);
      return !!el && el !== window.__slotBefore && visible(el) && !!el.querySelector("button, canvas");
    }
    if (sel === "@frame-canvas") {
      for (const f of document.querySelectorAll("iframe")) {
        try {
          const c = f.contentDocument?.querySelector("canvas");
          if (c && visible(f) && c.width > 0) return true;
        } catch {}
      }
      return false;
    }
    return [...document.querySelectorAll(sel)].some(visible);
  };
  window.__meri = ({ tap, shell, ready, timeout, tti }) =>
    new Promise((resolve) => {
      const q = (s) => {
        const el = document.querySelector(s);
        if (!el) throw new Error(`ni elementa ${s}`);
        el.click?.();
        return el;
      };
      void q;
      window.__slotBefore = [...(document.querySelector("#graph-slot")?.children || [])].find((c) => !c.hidden) || null;
      const t0 = performance.now();
      let tShell = null;
      let tReady = null;
      try {
        new Function("q", tap)((s) => {
          const el = document.querySelector(s);
          if (!el) throw new Error(`ni elementa ${s}`);
          return el;
        });
      } catch (e) {
        // izraz q('…').focus(): q vrne element, klik naredi spodaj
        resolve({ error: String(e.message || e) });
        return;
      }
      const tick = () => {
        const now = performance.now();
        if (tShell === null && anyVisible(shell)) tShell = now - t0;
        if (tReady === null && anyVisible(ready)) {
          tReady = now - t0;
          if (tShell === null) tShell = tReady;
        }
        if (tReady !== null) {
          const last = Math.max(0, ...window.__long.filter((x) => x > t0)) - t0;
          const doneAt = Math.max(tReady, last);
          if (tti === false || now - t0 - doneAt > 300) return resolve({ shell: tShell, ready: tReady, tti: tti === false ? null : doneAt });
        }
        if (now - t0 > timeout) return resolve({ shell: tShell, ready: tReady, tti: null, timeout: true });
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
}

async function cdpSetup(page, dev) {
  const c = await page.context().newCDPSession(page);
  if (dev.cpu > 1) await c.send("Emulation.setCPUThrottlingRate", { rate: dev.cpu });
  if (dev.net) {
    await c.send("Network.enable");
    await c.send("Network.emulateNetworkConditions", SLOW_4G);
  }
  return c;
}

async function newCtx(browser, dev, studentId) {
  const ctx = await browser.newContext({
    viewport: dev.viewport,
    hasTouch: dev.hasTouch,
    isMobile: dev.isMobile,
    deviceScaleFactor: dev.isMobile ? 2 : 1,
    locale: "sl-SI",
    timezoneId: "Europe/Ljubljana",
    serviceWorkers: "allow",
  });
  if (studentId) await ctx.addInitScript((id) => localStorage.setItem("studentId", String(id)), studentId);
  await ctx.addInitScript(PAGE_MERI);
  return ctx;
}

// Nalaganje aplikacije: od začetka navigacije do prve slike (FCP) in do vidne Učne poti.
async function measureLoad(page, base, dev) {
  await page.goto(base + "/", { waitUntil: "commit" });
  await page.waitForSelector("#view-path #xp-card .hero", { timeout: 60000 });
  const t = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    const fcp = performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? null;
    return { fcp, now: performance.now(), dcl: nav?.domContentLoadedEventEnd ?? null };
  });
  // interaktivno: 500 ms brez dolgih nalog
  const tti = await page.evaluate(
    () =>
      new Promise((res) => {
        const start = performance.now();
        const loop = () => {
          const last = Math.max(0, ...window.__long);
          const now = performance.now();
          if (now - Math.max(last, start) > 500 || now - start > 20000) return res(Math.max(last, start));
          setTimeout(loop, 50);
        };
        loop();
      }),
  );
  return { fcp: t.fcp, ready: t.now, tti, dcl: t.dcl, bytes: null };
}

async function measureScreen(page, s, timeout) {
  if (s.pre) await page.evaluate(s.pre);
  if (s.before) {
    await page.evaluate((code) => new Function("q", code)((sel) => document.querySelector(sel).click()), s.before);
    await page.waitForTimeout(300);
  }
  // tap: izraz uporablja q(sel) → element; klik ali focus
  const code = s.tap;
  const r = await page.evaluate((o) => window.__meri(o), { tap: code, shell: s.shell, ready: s.ready, timeout, tti: s.tti });
  await page.waitForTimeout(250);
  if (s.after) await page.evaluate((code) => new Function("q", code)((sel) => document.querySelector(sel)?.click()), s.after).catch(() => {});
  if (s.id === "3dmodel") await page.keyboard.press("Escape").catch(() => {});
  if (s.id === "tipkovnica") await page.evaluate(() => document.activeElement?.blur());
  await page.waitForTimeout(200);
  return r;
}

async function measureCalc(page, timeout) {
  // zavihek Kalkulator odprt: preklopi zaporedoma, nato še enkrat (toplo)
  await page.evaluate(() => document.querySelector('.topbar .tab[data-view="graph"]').click());
  await page.waitForSelector("#graph-slot > * button", { timeout: 30000 });
  await page.waitForTimeout(500);
  const out = {};
  for (const round of ["prvic", "drugic"]) {
    for (const [mode] of CALC_MODES) {
      if (round === "prvic" && mode === "sci") continue; // znanstveni je že odprt
      const r = await page.evaluate((o) => window.__meri(o), {
        tap: `q('#view-graph [data-calc-mode="${mode}"]').click()`,
        shell: `#view-graph [data-calc-mode="${mode}"].active`,
        ready: "@calc-changed",
        timeout,
        tti: true,
      });
      // uporabno: vsebina novega načina (koren orodja zamenjan): preverimo posebej
      out[`${mode}-${round}`] = r;
      await page.waitForTimeout(300);
    }
  }
  return out;
}

async function onboardOnce(browser, base) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, locale: "sl-SI", serviceWorkers: "block" });
  const p = await ctx.newPage();
  await p.goto(base + "/");
  await p.waitForSelector("#onboard-form", { timeout: 20000 });
  await p.fill('#onboard-form input[name="name"]', "Meta");
  for (const v of ["OSNOVNA_SOLA", "8. razred"]) {
    const o = p.locator(`#onboard-form .lp-opt[data-val="${v}"]`);
    if (await o.count()) await o.first().click();
  }
  await p.click('#onboard-form button[type="submit"]');
  await p.waitForSelector(".iq-wrap [data-iq=skip]", { timeout: 15000 });
  await p.click(".iq-wrap [data-iq=skip]");
  await p.waitForSelector("#tour", { timeout: 15000 }).catch(() => {});
  if (await p.locator('#tour [data-tour="skip"]').isVisible().catch(() => false)) await p.click('#tour [data-tour="skip"]');
  await p.waitForSelector("#view-path #xp-card .hero", { timeout: 15000 });
  await p.waitForTimeout(500);
  const id = await p.evaluate(() => localStorage.getItem("studentId"));
  await ctx.close();
  return Number(id);
}

async function runDevice(browser, base, name, studentId) {
  const dev = DEVICES[name];
  const timeout = dev.cpu > 1 ? 20000 : 10000;
  const res = { load: {}, screens: {}, calc: {} };
  const ctx = await newCtx(browser, dev, studentId);
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e.message).slice(0, 160)));
  await cdpSetup(page, dev);
  const screens = SCREENS.filter((s) => !s.only || s.only === name);
  // HLADNO: prazen predpomnilnik, SW se šele namešča
  res.load.hladno = await measureLoad(page, base, dev);
  for (const s of screens) res.screens[`${s.id}|hladno`] = await measureScreen(page, s, timeout);
  for (const s of screens) res.screens[`${s.id}|drugic`] = await measureScreen(page, s, timeout);
  res.calc.hladno = await measureCalc(page, timeout);
  // TOPLO: SW nameščen in predpomnjen; nova stran (pomnilnik prazen, datoteke v predpomnilniku)
  await page.waitForTimeout(4000);
  await page.close();
  const page2 = await ctx.newPage();
  page2.on("pageerror", (e) => errors.push(String(e.message).slice(0, 160)));
  await cdpSetup(page2, dev);
  res.load.toplo = await measureLoad(page2, base, dev);
  for (const s of screens) res.screens[`${s.id}|toplo`] = await measureScreen(page2, s, timeout);
  res.calc.toplo = await measureCalc(page2, timeout);
  res.errors = [...new Set(errors)];
  await ctx.close();
  return res;
}

const f = (x) => (x === null || x === undefined ? "–" : `${Math.round(x)}`);
function table(all) {
  const lines = [];
  for (const [dev, r] of Object.entries(all)) {
    lines.push(`\n### ${dev === "telefon" ? "Telefon 390×844, CPU 4×, Slow 4G" : "Računalnik 1280×800, brez omejitev"}\n`);
    lines.push("Nalaganje aplikacije (ms od začetka): | FCP | Učna pot vidna | interaktivno |");
    lines.push("|---|---|---|---|");
    for (const k of ["hladno", "toplo"]) lines.push(`| ${k} | ${f(r.load[k]?.fcp)} | ${f(r.load[k]?.ready)} | ${f(r.load[k]?.tti)} |`);
    lines.push("\nZaslon (ms od tapa: lupina / uporabno / interaktivno)\n");
    lines.push("| Zaslon | hladno | toplo (SW) | drugič (v pomnilniku) |");
    lines.push("|---|---|---|---|");
    for (const s of SCREENS) {
      if (s.only && s.only !== dev) continue;
      const c = (k) => {
        const x = r.screens[`${s.id}|${k}`];
        if (!x) return "–";
        if (x.error) return `napaka: ${x.error}`;
        return `${f(x.shell)} / ${f(x.ready)} / ${f(x.tti)}${x.timeout ? " (čas potekel)" : ""}`;
      };
      lines.push(`| ${s.name} | ${c("hladno")} | ${c("toplo")} | ${c("drugic")} |`);
    }
    lines.push("\nPreklop podzavihkov kalkulatorja (ms od tapa: izbran / vsebina / interaktivno)\n");
    lines.push("| Podzavihek | hladno prvič | hladno drugič | toplo prvič | toplo drugič |");
    lines.push("|---|---|---|---|---|");
    for (const [m, nm] of CALC_MODES) {
      const c = (k, rd) => {
        const x = r.calc[k]?.[`${m}-${rd}`];
        return x ? `${f(x.shell)} / ${f(x.ready)} / ${f(x.tti)}` : "–";
      };
      lines.push(`| ${nm} | ${c("hladno", "prvic")} | ${c("hladno", "drugic")} | ${c("toplo", "prvic")} | ${c("toplo", "drugic")} |`);
    }
    if (r.errors?.length) lines.push(`\nNapake strani: ${r.errors.join("; ")}`);
  }
  return lines.join("\n");
}

(async () => {
  const { base, srv, dir } = await startServer();
  const browser = await chromium.launch();
  const all = {};
  try {
    const id = await onboardOnce(browser, base);
    for (const name of Object.keys(DEVICES)) {
      if (ONLY && ONLY !== name) continue;
      const t0 = Date.now();
      all[name] = await runDevice(browser, base, name, id);
      console.error(`${name}: ${((Date.now() - t0) / 1000).toFixed(0)} s`);
    }
  } finally {
    await browser.close();
    srv.kill();
    fs.rmSync(dir, { recursive: true, force: true });
  }
  if (arg("--json")) fs.writeFileSync(arg("--json"), JSON.stringify(all, null, 1));
  const md = table(all);
  if (arg("--md")) fs.writeFileSync(arg("--md"), md);
  console.log(md);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

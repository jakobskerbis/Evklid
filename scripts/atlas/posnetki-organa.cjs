// Posnetki in meritve organa (»Organi v 3D«, docs/3d.md): telefon (390 × 844, dotik → kakovost nizka, <o>-telefon.glb)
// in računalnik (1280 × 800, miška → visoka, <o>.glb); pogledi celota, prerez in približan prerez (zaklopke, prekati …).
// Meri prenos (bajti datotek organi-3d/) in čas do prvega prikaza pri omrežju 4G (telefon) in kabel (računalnik).
// Zagon: node scripts/atlas/posnetki-organa.cjs <organ> <izhodna mapa> [oznaka, npr. staro|novo]
// Izhod: <mapa>/<oznaka>-<telefon|racunalnik>-<pogled>.png in <mapa>/<oznaka>-meritve.json.
// Potrebuje Playwright s Chromiumom (swiftshader: čas risanja ni čas pravega telefona, primerjaj staro z novim).
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const [organ = "srce", izhod = "posnetki", oznaka = "novo"] = process.argv.slice(2);
const PORT = 3996;
const root = process.env.EVKLID_KOREN || path.join(__dirname, "..", ".."); // EVKLID_KOREN: pot brez mape s piko (express ne streže skozi .claude/)
const NAPRAVE = {
  // 4G: 9 Mbit/s, 150 ms (»Fast 4G« v orodjih Chrome); kabel: 50 Mbit/s, 20 ms
  telefon: { kakovost: "nizka", viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, omrezje: { down: 9e6, rtt: 150 } },
  racunalnik: { kakovost: "visoka", viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, isMobile: false, hasTouch: false, omrezje: { down: 50e6, rtt: 20 } },
};

(async () => {
  fs.mkdirSync(izhod, { recursive: true });
  const srv = spawn(process.execPath, ["--disable-warning=ExperimentalWarning", "server/index.js"], { cwd: root, env: { ...process.env, PORT, EVKLID_MOCK: "1" }, stdio: "ignore" });
  const base = `http://localhost:${PORT}`;
  for (let i = 0; i < 80; i++) {
    try {
      if ((await fetch(base + "/3d")).ok) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 250));
  }
  const b = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  const meritve = {};
  try {
    for (const [ime, n] of Object.entries(NAPRAVE)) {
      const ctx = await b.newContext({ ...n, omrezje: undefined, kakovost: undefined, reducedMotion: "reduce", locale: "sl-SI" });
      await ctx.addInitScript(() => {
        try {
          localStorage.setItem("evklid.lang", "sl");
        } catch {}
      });
      const p = await ctx.newPage();
      const napake = [];
      p.on("pageerror", (e) => napake.push(String(e.message).slice(0, 200)));
      p.on("console", (m) => m.type() === "error" && napake.push(m.text().slice(0, 200)));
      const datoteke = {};
      p.on("response", async (r) => {
        const u = new URL(r.url());
        if (!/\/organi-3d\/|\/3d\/okolje\//.test(u.pathname)) return; // model in skupni HDR (prenos šteje oboje)
        try {
          datoteke[path.basename(u.pathname)] = (await r.body()).length;
        } catch {}
      });
      const cdp = await ctx.newCDPSession(p);
      // kakovost izrecno: peskovnik ima 2 jedri (samodejno bi bila »nizka« tudi na računalniku)
      await p.goto(`${base}/3d?kakovost=${n.kakovost}`);
      await cdp.send("Network.enable");
      await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
      await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: n.omrezje.rtt, downloadThroughput: n.omrezje.down / 8, uploadThroughput: n.omrezje.down / 16 });
      const t0 = Date.now();
      await p.evaluate((id) => (location.hash = id), `organ-${organ}`);
      await p.waitForSelector(".k3-platno", { timeout: 60000 });
      await p.waitForFunction(() => !document.querySelector(".k3-nalaganje"), null, { timeout: 240000 });
      const nalaganje = (Date.now() - t0) / 1000;
      await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
      await p.waitForTimeout(3000);
      const slikaj = async (pogled) => {
        await p.waitForTimeout(n.kakovost === "visoka" ? 6000 : 1800);
        await p.screenshot({ path: path.join(izhod, `${oznaka}-${ime}-${pogled}.png`), timeout: 180000 });
      };
      await slikaj("celota");
      // zadaj: povlečemo po odru (vrtenje za ~180°)
      const oder = await p.locator(".k3-platno").boundingBox();
      const cx = oder.x + oder.width / 2, cy = oder.y + oder.height / 2;
      await p.mouse.move(cx - oder.width * 0.3, cy);
      await p.mouse.down();
      await p.mouse.move(cx + oder.width * 0.3, cy, { steps: 12 });
      await p.mouse.up();
      await slikaj("zadaj");
      await p.locator('[aria-label="Ponastavi"]').first().click().catch(() => {});
      const stikalo = p.locator(".k3-stikalo .switch").first();
      if (await stikalo.count()) {
        await stikalo.click();
        await p.waitForTimeout(1200);
        await slikaj("prerez");
        const blizje = p.locator('[aria-label="Približaj"]').first();
        for (let i = 0; i < 2; i++) await blizje.click().catch(() => {});
        await slikaj("prerez-blizu");
      }
      const skupaj = Object.values(datoteke).reduce((s, x) => s + x, 0);
      meritve[ime] = { prenosBajtov: skupaj, datoteke, nalaganjeS: +nalaganje.toFixed(2), omrezje: n.omrezje, napake: [...new Set(napake)] };
      console.log(`${ime}: ${(skupaj / 1024 / 1024).toFixed(2)} MB, nalaganje ${nalaganje.toFixed(1)} s${napake.length ? `, napake: ${napake.length}` : ""}`);
      await ctx.close();
    }
  } finally {
    fs.writeFileSync(path.join(izhod, `${oznaka}-meritve.json`), JSON.stringify(meritve, null, 1) + "\n");
    await b.close();
    srv.kill();
  }
})();

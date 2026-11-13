// Posnetki in meritve organa (»Organi v 3D«, docs/3d.md): telefon (390 × 844, dotik → kakovost nizka, <o>-telefon.glb)
// in računalnik (1280 × 800, miška → visoka, <o>.glb); pogledi celota, prerez in približan prerez (zaklopke, prekati …).
// Meri prenos (bajti datotek organi-3d/) in čas do prvega prikaza pri omrežju 4G (telefon) in kabel (računalnik).
// Zagon: node scripts/atlas/posnetki-organa.cjs <organ> <izhodna mapa> [oznaka, npr. staro|novo]
// Okolje: KOTI=1 (8 kotov, zgoraj, spodaj), ZILE=1 (žile od blizu), RAVEN=1|2|3 (raven razlage OŠ/SŠ/študij),
// SAMO=telefon|racunalnik, UCNE=1 (učne barve), SKUPINA=<ime skupine> (npr. Zaklopke), MERE=<mere.json iz
// scripts/atlas/mere-reza.py> (dodatna posnetka prerez-mere, prerez-blizu-mere: merilne črte debeline sten v mm čez sliko).
// Izhod: <mapa>/<oznaka>-<telefon|racunalnik>-<pogled>.png in <mapa>/<oznaka>-meritve.json.
// Potrebuje Playwright s Chromiumom (swiftshader: čas risanja ni čas pravega telefona, primerjaj staro z novim).
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const [organ = "srce", izhod = "posnetki", oznaka = "novo"] = process.argv.slice(2);
const PORT = +process.env.POSNETKI_PORT || 3996; // POSNETKI_PORT: več zagonov hkrati
const root = process.env.EVKLID_KOREN || path.join(__dirname, "..", ".."); // EVKLID_KOREN: pot brez mape s piko (express ne streže skozi .claude/)
const NAPRAVE = {
  // 4G: 9 Mbit/s, 150 ms (»Fast 4G« v orodjih Chrome); kabel: 50 Mbit/s, 20 ms
  telefon: { kakovost: "nizka", viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, omrezje: { down: 9e6, rtt: 150 } },
  racunalnik: { kakovost: "visoka", viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, isMobile: false, hasTouch: false, omrezje: { down: 50e6, rtt: 20 } },
};

(async () => {
  fs.mkdirSync(izhod, { recursive: true });
  // začasna baza: strežnik ne piše v data/evklid.db kopije, iz katere teče
  const zacasna = fs.mkdtempSync(path.join(require("node:os").tmpdir(), "posnetki-organa-"));
  const srv = spawn(process.execPath, ["--disable-warning=ExperimentalWarning", "server/index.js"], { cwd: root, env: { ...process.env, PORT, EVKLID_MOCK: "1", EVKLID_DB: path.join(zacasna, "evklid.db") }, stdio: "ignore" });
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
    for (const [ime, n] of Object.entries(NAPRAVE).filter(([k]) => !process.env.SAMO || process.env.SAMO === k)) {
      const ctx = await b.newContext({ ...n, omrezje: undefined, kakovost: undefined, reducedMotion: "reduce", locale: "sl-SI" });
      await ctx.addInitScript(() => {
        try {
          localStorage.setItem("evklid.lang", "sl");
        } catch {}
      });
      const p = await ctx.newPage();
      const napake = [];
      p.on("pageerror", (e) => napake.push(String(e.message).slice(0, 200)));
      p.on("console", (m) => (m.type() === "error" || (m.type() === "warning" && m.text().startsWith("organ:"))) && napake.push(m.text().slice(0, 200)));
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
      await p.goto(`${base}/3d?kakovost=${n.kakovost}${process.env.RAVEN ? `&raven=${process.env.RAVEN}` : ""}${process.env.MERE ? "&preizkus=1" : ""}`); // RAVEN=1: profil OŠ (raven.js)
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
      // Namig ob prvem ogledu nabora delov (pregledovalnik namigniDele): deli 3,2 s časa prizora zasijejo v svoji barvi.
      // Swiftshader riše ~0,5 sličice/s (dt omejen na 0,1 s), zato bi sij trajal minuto: tap v prazen del odra ga ugasne.
      const ugasniNamig = async () => {
        await p.waitForTimeout(2500);
        const c = await p.locator("canvas").first().boundingBox();
        if (c) await p.mouse.click(c.x + 12, c.y + c.height - 12);
        await p.waitForTimeout(500);
      };
      const slikaj = async (pogled) => {
        await p.waitForTimeout(n.kakovost === "visoka" ? 6000 : 1800);
        await p.screenshot({ path: path.join(izhod, `${oznaka}-${ime}-${pogled}.png`), timeout: 180000 });
      };
      await ugasniNamig();
      const samoPrerez = !!process.env.SAMO_PREREZ; // SAMO_PREREZ=1: samo prerez (hitro preverjanje reza)
      if (!samoPrerez) await slikaj("celota");
      // Vrtenje s tipkovnico na platnu (puščica = 10°, enako na telefonu in računalniku; vlečenje z miško na telefonu z
      // dotikom ne zavrti, zato je bil prejšnji »zadaj« sprednja stran). KOTI=1: 8 kotov okoli navpičnice (0°, 45°, …;
      // lihi koti ±5°, ker je korak 10°) ter od zgoraj in spodaj; ZILE=1: bližnji posnetki žil spredaj in zadaj.
      const platno = p.locator(".k3-platno").first();
      const ponastavi = async () => {
        await p.locator('[aria-label="Ponastavi"]').first().click().catch(() => {});
        await p.waitForTimeout(800);
      };
      const tipke = async (tipka, n) => {
        await platno.focus();
        for (let i = 0; i < n; i++) await p.keyboard.press(tipka);
        await p.waitForTimeout(700);
      };
      if (process.env.KOTI && !samoPrerez) {
        let kot = 0;
        for (let k = 1; k < 8; k++) {
          const cilj = Math.round((k * 45) / 10);
          await tipke("ArrowLeft", cilj - kot);
          kot = cilj;
          await slikaj(`kot${String(k * 45).padStart(3, "0")}`);
        }
        await ponastavi();
        await tipke("ArrowUp", 9);
        await slikaj("odzgoraj");
        await ponastavi();
        await tipke("ArrowDown", 9);
        await slikaj("odspodaj");
        await ponastavi();
      }
      if (!samoPrerez) {
        // zadaj: od zadaj IN spodaj (diafragmalna ploskev, zadnji žlebovi; kot fotografija preparata od zadaj spodaj), ne
        // ponovitev kot180 (ocena srca n10: »zadaj« je bil enak kot180)
        await tipke("ArrowLeft", 18);
        await tipke("ArrowDown", 4);
        await slikaj("zadaj");
        await ponastavi();
      }
      if (process.env.ZILE && !samoPrerez) {
        const blizje = p.locator('[aria-label="Približaj"]').first();
        for (let i = 0; i < 3; i++) await blizje.click().catch(() => {});
        await slikaj("zile-spredaj");
        await tipke("ArrowLeft", 18);
        await slikaj("zile-zadaj");
        await ponastavi();
      }
      // UCNE=1: učne barve (celota); SKUPINA=<ime>: izbira skupine delov (npr. Zaklopke) z osvetlitvijo
      if (process.env.SKUPINA && !samoPrerez) {
        await p.locator(".k3-del-skupina", { hasText: process.env.SKUPINA }).first().click().catch(() => {});
        await p.waitForTimeout(1500);
        await slikaj(`skupina-${process.env.SKUPINA.toLowerCase()}`);
        await p.locator(".k3-del-skupina", { hasText: process.env.SKUPINA }).first().click().catch(() => {});
        await ponastavi();
      }
      if (process.env.UCNE && !samoPrerez) {
        await p.locator(".k3-stikalo", { hasText: "Učne barve" }).locator(".switch").first().click().catch(() => {});
        await p.waitForTimeout(1200);
        await slikaj("ucne-celota");
        await p.locator(".k3-stikalo", { hasText: "Učne barve" }).locator(".switch").first().click().catch(() => {});
        await p.waitForTimeout(800);
      }
      // MERE: črte iz točk v metrih organa (glTF) → zaslon (kamera iz globalThis.__scena, merilo skupine organa)
      const mere = process.env.MERE ? JSON.parse(fs.readFileSync(process.env.MERE, "utf8")) : null;
      const slikajMere = async (pogled) => {
        if (!mere) return;
        await p.evaluate((mere) => {
          const sc = globalThis.__scena;
          let grp = null;
          sc.scene.traverse((o) => { if (o.userData?.merilo) grp = o; });
          const V3 = sc.camera.position.constructor;
          const r = sc.canvas.getBoundingClientRect();
          const zaslon = (x) => { const v = grp.localToWorld(new V3(...x).multiplyScalar(grp.userData.merilo)).project(sc.camera); return [r.left + ((v.x + 1) / 2) * r.width, r.top + ((1 - v.y) / 2) * r.height]; };
          const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          svg.id = "k3-mere";
          svg.setAttribute("style", "position:fixed;left:0;top:0;width:100vw;height:100vh;pointer-events:none;z-index:99999");
          for (const m of mere.filter((m) => m.ime.includes("50"))) {
            const [a, b] = [zaslon(m.a), zaslon(m.b)];
            const l = document.createElementNS(svg.namespaceURI, "line");
            Object.entries({ x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: "#00e5ff", "stroke-width": 2.5 }).forEach(([k, v]) => l.setAttribute(k, v));
            svg.append(l);
            for (const q of [a, b]) {
              const c = document.createElementNS(svg.namespaceURI, "circle");
              Object.entries({ cx: q[0], cy: q[1], r: 3.5, fill: "#00e5ff" }).forEach(([k, v]) => c.setAttribute(k, v));
              svg.append(c);
            }
            const t = document.createElementNS(svg.namespaceURI, "text");
            // napis znotraj platna (ocena n10: »RV 5,3 mm« čez seznam delov, »LV …« odrezan desno)
            const sir = 15 * 0.6 * (m.ime.length + 8);
            const tx = Math.min(Math.max((a[0] + b[0]) / 2 + 8, r.left + 4), r.right - sir - 4);
            const ty = Math.min(Math.max((a[1] + b[1]) / 2 - 10, r.top + 20), r.bottom - 6);
            Object.entries({ x: tx, y: ty, fill: "#ffffff", "font-size": 15, "font-family": "sans-serif", "font-weight": 700, stroke: "#000", "stroke-width": 3, "paint-order": "stroke" }).forEach(([k, v]) => t.setAttribute(k, v));
            t.textContent = `${m.ime.replace(/ \d+ %/, "")} ${String(m.mm).replace(".", ",")} mm`;
            svg.append(t);
          }
          document.body.append(svg);
        }, mere);
        await p.screenshot({ path: path.join(izhod, `${oznaka}-${ime}-${pogled}-mere.png`), timeout: 180000 });
        await p.evaluate(() => document.getElementById("k3-mere")?.remove());
      };
      const stikalo = p.locator(".k3-stikalo", { hasText: "Prerez" }).locator(".switch").first();
      if (await stikalo.count()) {
        await stikalo.click();
        await ugasniNamig();
        await slikaj("prerez");
        await slikajMere("prerez");
        const blizje = p.locator('[aria-label="Približaj"]').first();
        for (let i = 0; i < 2; i++) await blizje.click().catch(() => {});
        await slikaj("prerez-blizu");
        await slikajMere("prerez-blizu");
        // UCNE=1: učne barve tudi na rezu (notranji deli, ki jih celota ne pokaže: skorja, sredica, meh …)
        if (process.env.UCNE) {
          await p.locator(".k3-stikalo", { hasText: "Učne barve" }).locator(".switch").first().click().catch(() => {});
          await p.waitForTimeout(1200);
          await slikaj("ucne-prerez-blizu");
          await p.locator(".k3-stikalo", { hasText: "Učne barve" }).locator(".switch").first().click().catch(() => {});
          await p.waitForTimeout(800);
        }
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
    fs.rmSync(zacasna, { recursive: true, force: true });
  }
})();

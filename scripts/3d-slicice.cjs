// Sličice modelov za kartice zbirke /3d (public/3d/slicice/<id>.webp, docs/3d.md »Sličice«): vsak model iz kode se
// odpre na strani /3d brez vmesnika (samo oder s prosojnim ozadjem), posnetek se v brskalniku stisne v WebP.
// Zagon: node scripts/3d-slicice.cjs [id …]   (brez id: vsi modeli; --manjkajoce: samo tisti brez sličice)
// Potrebuje Playwright s Chromiumom (programsko risanje swiftshader); zažene strežnik na vratih 3997.
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const PORT = 3997;
const SIRINA = 560; // 8 : 5 kot .k3-slicica; kartica je široka do 236 px, zato je dovolj tudi za zaslone 2×
const VISINA = 350;
const root = path.join(__dirname, "..");
const izhod = path.join(root, "public", "3d", "slicice");

// Na odru ostane samo model: brez glave, plošče, gumbov, točk, oznak, merila, namiga in barve odra.
const CSS = `
  html, body, .k3-glavni, .k3-model, .k3-model-telo, .k3-pregled, .k3-oder, .k3-oder-ovoj { background: transparent !important; }
  .k3-oder::after, .k3-model-vrh, .k3-plosca, .k3-spodaj, .k3-orodja, .k3-plast, .k3-merilo, .k3-namig, .k3-nadzor { display: none !important; }
  .k3-stran-pregled .k3-oder-ovoj { position: fixed !important; inset: 0 !important; }
`;

(async () => {
  const args = process.argv.slice(2);
  const samoManjkajoce = args.includes("--manjkajoce");
  const izbrani = args.filter((a) => !a.startsWith("--"));
  const srv = spawn(process.execPath, ["--disable-warning=ExperimentalWarning", "server/index.js"], { cwd: root, env: { ...process.env, PORT, EVKLID_MOCK: "1" }, stdio: "ignore" });
  const base = `http://localhost:${PORT}`;
  for (let i = 0; i < 50; i++) {
    try {
      if ((await fetch(base + "/3d")).ok) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  fs.mkdirSync(izhod, { recursive: true });
  const b = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  // Zmanjšano gibanje: modeli z animacijo obstanejo v začetni legi (posnetek je vsakič enak).
  const ctx = await b.newContext({ viewport: { width: SIRINA, height: VISINA }, deviceScaleFactor: 1, reducedMotion: "reduce", locale: "sl-SI" });
  await ctx.addInitScript(() => {
    try {
      localStorage.setItem("evklid.lang", "sl");
    } catch {}
  });
  const p = await ctx.newPage();
  const napake = [];
  p.on("pageerror", (e) => napake.push(String(e.message).slice(0, 160)));
  await p.goto(base + "/3d");
  const modeli = await p.evaluate(async () => (await (await import("/3d/modeli.js")).seznamModelov()).map((m) => m.id));
  let seznam = izbrani.length ? modeli.filter((id) => izbrani.includes(id)) : modeli;
  if (samoManjkajoce) seznam = seznam.filter((id) => !fs.existsSync(path.join(izhod, `${id}.webp`)));
  let ok = 0;
  for (const id of seznam) {
    const t0 = Date.now();
    try {
      await p.goto(`${base}/3d#${encodeURIComponent(id)}`);
      await p.addStyleTag({ content: CSS });
      await p.waitForSelector(".k3-platno", { timeout: 30000 });
      // Model iz datotek (obljuba): počakamo, da izgine kartica nalaganja; potem še nekaj sličic za AO in teksture.
      await p.waitForFunction(() => !document.querySelector(".k3-nalaganje"), null, { timeout: 60000 });
      await p.waitForTimeout(2500);
      const png = await p.screenshot({ omitBackground: true, timeout: 90000 });
      const webp = await p.evaluate(async (src) => {
        const img = new Image();
        img.src = src;
        await img.decode();
        const c = document.createElement("canvas");
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        c.getContext("2d").drawImage(img, 0, 0);
        return c.toDataURL("image/webp", 0.8);
      }, `data:image/png;base64,${png.toString("base64")}`);
      const buf = Buffer.from(webp.split(",")[1], "base64");
      fs.writeFileSync(path.join(izhod, `${id}.webp`), buf);
      ok++;
      console.log(`${id}: ${(buf.length / 1024).toFixed(1)} KB, ${((Date.now() - t0) / 1000).toFixed(1)} s`);
    } catch (err) {
      console.log(`${id}: NAPAKA ${String(err.message).split("\n")[0]}`);
    }
  }
  if (napake.length) console.log("Napake na strani:\n" + [...new Set(napake)].join("\n"));
  console.log(`Sličic: ${ok}/${seznam.length} v ${path.relative(root, izhod)}`);
  await b.close();
  srv.kill();
})();

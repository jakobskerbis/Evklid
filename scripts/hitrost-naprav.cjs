// Hitrost odpiranja na več brskalnikih in napravah (K-12, matrika naprav, 26. 11. 2026).
// Za eno napravo (brskalnik + velikost zaslona) izmeri:
//   - prvi obisk: od začetka nalaganja do vidnega obrazca za nov profil (prazen predpomnilnik);
//   - ponovni obisk (nov zavihek v istem brskalniku, kot ob ponovnem odprtju aplikacije) in osvežitev:
//     »prva vsebina« = prvi viden pogled (lahko tudi shranjen posnetek zadnjega zaslona) in
//     »Učna pot« = pravi pogled Učna pot z napredkom (ne posnetek).
// Brskalniki: chromium, webkit, firefox (Playwright). Počasno omrežje za vse tri enako: med brskalnik in strežnik
// postavimo posrednika, ki vsakemu odgovoru doda zakasnitev (RTT) in vse odgovore pošilja skozi eno »linijo« omejene
// hitrosti (privzeto kot »Slow 4G« v Lighthouse: 150 ms, 1,6 Mbit/s). Procesorja ne upočasnimo (WebKit in Firefox
// tega v Playwrightu nimata), zato so časi primerljivi le med »prej« in »potem« na istem stroju.
// Zagon: node scripts/hitrost-naprav.cjs [--koren <mapa aplikacije>] [--brskalnik chromium|webkit|firefox]
//   [--zaslon 390x844] [--dotik] [--mobilno] [--ponovitve 7] [--omrezje 4g|hitro] [--json <datoteka>]
// --koren: druga različica aplikacije (npr. git worktree starejšega commita) z isto skripto, za meritev »prej«.
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const net = require("node:net");
const path = require("node:path");
const playwright = require("playwright");

const args = process.argv.slice(2);
const arg = (n) => (args.indexOf(n) >= 0 ? args[args.indexOf(n) + 1] : null);
const KOREN = path.resolve(arg("--koren") || path.join(__dirname, ".."));
const BRSKALNIK = arg("--brskalnik") || "chromium";
if (!["chromium", "webkit", "firefox"].includes(BRSKALNIK)) throw new Error("--brskalnik: chromium, webkit ali firefox");
const m = /^(\d{3,4})x(\d{3,4})$/.exec(arg("--zaslon") || "1280x800");
if (!m) throw new Error("--zaslon: npr. 390x844");
const ZASLON = { width: Number(m[1]), height: Number(m[2]) };
const DOTIK = args.includes("--dotik");
const MOBILNO = args.includes("--mobilno") && BRSKALNIK !== "firefox"; // Firefox v Playwrightu nima isMobile
const PONOVITVE = Math.max(1, Number(arg("--ponovitve")) || 7);
const ROK = 60000;
const OMREZJE = arg("--omrezje") || "4g";
if (!["4g", "hitro"].includes(OMREZJE)) throw new Error("--omrezje: 4g ali hitro");
const RTT = OMREZJE === "4g" ? 150 : 0; // ms
const HITROST = OMREZJE === "4g" ? (1.6e6 / 8) * 0.9 : Infinity; // bajtov na sekundo (Lighthouse: 1,6 Mbit/s × 0,9)

const freePort = () =>
  new Promise((resolve, reject) => {
    const s = net.createServer();
    s.listen(0, () => {
      const { port } = s.address();
      s.close(() => resolve(port));
    });
    s.on("error", reject);
  });

async function streznik() {
  const port = await freePort();
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-hitrost-"));
  const env = {
    ...process.env,
    PORT: String(port),
    EVKLID_MOCK: "1",
    EVKLID_SKRCI: "1", // kot produkcija (starejše različice ga ne poznajo in ga prezrejo)
    EVKLID_MOCK_DELAY_MS: "0",
    EVKLID_NEWS: "0",
    EVKLID_DB: path.join(dir, "t.db"),
    EVKLID_PASSWORD: "",
    ANTHROPIC_API_KEY: "",
    RESEND_API_KEY: "",
    STRIPE_SECRET_KEY: "",
  };
  const srv = spawn(process.execPath, ["--disable-warning=ExperimentalWarning", "server/index.js"], { cwd: KOREN, env, stdio: "ignore" });
  const base = `http://localhost:${port}`;
  for (let i = 0; i < 150; i++) {
    try {
      if ((await fetch(base + "/healthz")).ok) return { base, stop: () => (srv.kill(), fs.rmSync(dir, { recursive: true, force: true })) };
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  srv.kill();
  throw new Error("preizkusni strežnik se ni zagnal");
}

// Posrednik s počasnim omrežjem: zakasnitev RTT pred odgovorom, telo po kosih skozi skupno linijo omejene hitrosti.
async function posrednik(cilj) {
  const http = require("node:http");
  const url = new URL(cilj);
  let prosta = 0; // kdaj je linija prosta (ms, Date.now)
  const srv = http.createServer((req, res) => {
    const zac = Date.now();
    const p = http.request({ host: url.hostname, port: url.port, path: req.url, method: req.method, headers: { ...req.headers, host: url.host } }, (o) => {
      const kosi = [];
      let konec = false;
      let caka = false;
      const poslji = () => {
        caka = false;
        if (!res.headersSent) res.writeHead(o.statusCode, o.headers);
        while (kosi.length) {
          const k = kosi.shift();
          const t = Math.max(Date.now(), prosta, zac + RTT) + (HITROST === Infinity ? 0 : (k.length / HITROST) * 1000);
          prosta = t;
          const d = t - Date.now();
          if (d > 1) {
            caka = true;
            setTimeout(() => (res.write(k), poslji()), d);
            return;
          }
          res.write(k);
        }
        if (konec) res.end();
      };
      o.on("data", (k) => {
        kosi.push(k);
        if (!caka) {
          caka = true;
          setTimeout(poslji, Math.max(0, zac + RTT - Date.now()));
        }
      });
      o.on("end", () => {
        konec = true;
        if (!caka) setTimeout(poslji, Math.max(0, zac + RTT - Date.now()));
      });
    });
    p.on("error", () => res.writeHead(502).end());
    req.pipe(p);
  });
  const port = await freePort();
  await new Promise((ok) => srv.listen(port, "127.0.0.1", ok));
  return { base: `http://localhost:${port}`, stop: () => srv.close() };
}

// V strani: čas (ms od začetka nalaganja) prvega vidnega pogleda in pravega pogleda Učna pot.
const MERILNIK = () => {
  const t = (window.__hitrost = { prva: null, pot: null, uvod: null });
  const vidno = (el) => !!el && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== "hidden";
  const preveri = () => {
    const zdaj = performance.now();
    if (t.prva == null && [...document.querySelectorAll("main.view")].some((v) => !v.hidden && vidno(v) && v.textContent.trim())) t.prva = zdaj;
    const pot = document.querySelector("#view-path:not([hidden]):not([data-posnetek])");
    if (t.pot == null && pot && vidno(pot.querySelector("#xp-card .hero"))) t.pot = zdaj;
    if (t.uvod == null && vidno(document.querySelector("#onboard-form"))) t.uvod = zdaj;
    if (t.pot == null || t.prva == null) requestAnimationFrame(preveri);
  };
  requestAnimationFrame(preveri);
  new MutationObserver(preveri).observe(document, { subtree: true, childList: true, attributes: true });
};

const mediana = (a) => {
  const s = [...a].sort((x, y) => x - y);
  return s.length ? Math.round(s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2) : null;
};

async function cakaj(p, kljuc) {
  await p.waitForFunction((k) => window.__hitrost && window.__hitrost[k] != null, kljuc, { timeout: ROK });
  return p.evaluate(() => ({ ...window.__hitrost }));
}

(async () => {
  const streznikApp = await streznik();
  const pos = await posrednik(streznikApp.base);
  const app = { base: pos.base, stop: () => (pos.stop(), streznikApp.stop()) };
  const browser = await playwright[BRSKALNIK].launch();
  const izid = { brskalnik: BRSKALNIK, razlicica: browser.version(), zaslon: ZASLON, dotik: DOTIK, mobilno: MOBILNO, ponovitve: PONOVITVE, omrezje: { vrsta: OMREZJE, rttMs: RTT, bajtovNaSekundo: HITROST === Infinity ? null : Math.round(HITROST) }, koren: KOREN };
  try {
    const ctx = await browser.newContext({
      viewport: ZASLON,
      hasTouch: DOTIK,
      ...(MOBILNO ? { isMobile: true } : {}),
      locale: "sl-SI",
      timezoneId: "Europe/Ljubljana",
      reducedMotion: "reduce",
      deviceScaleFactor: 1,
    });
    await ctx.addInitScript(MERILNIK);
    // Prvi obisk in nov profil (OŠ, 8. razred).
    let p = await ctx.newPage();
    await p.goto(app.base + "/");
    izid.prviObisk = Math.round((await cakaj(p, "uvod")).uvod);
    await p.fill('#onboard-form input[name="name"]', "Ana");
    for (const v of ["OSNOVNA_SOLA", "8. razred"]) {
      await p.locator(`#onboard-form .lp-opt[data-val="${v}"]`).click();
      await p.waitForTimeout(200);
    }
    await p.click('#onboard-form button[type="submit"]');
    await p.locator("#view-path #xp-card .hero").waitFor({ timeout: ROK });
    await p.waitForTimeout(3000); // service worker in predpomnilnik se napolnita
    // Ponovni obisk: nov zavihek (prejšnji zaprt), kot ob ponovnem odprtju aplikacije.
    const obisk = { prva: [], pot: [] };
    for (let i = 0; i < PONOVITVE; i++) {
      await p.close();
      p = await ctx.newPage();
      await p.goto(app.base + "/");
      const t = await cakaj(p, "pot");
      obisk.prva.push(Math.round(t.prva ?? t.pot));
      obisk.pot.push(Math.round(t.pot));
      await p.waitForTimeout(1500); // preverjanje v ozadju (N-08b) se konča
    }
    // Osvežitev v istem zavihku.
    const osvezitev = { prva: [], pot: [] };
    for (let i = 0; i < PONOVITVE; i++) {
      await p.reload();
      const t = await cakaj(p, "pot");
      osvezitev.prva.push(Math.round(t.prva ?? t.pot));
      osvezitev.pot.push(Math.round(t.pot));
      await p.waitForTimeout(1500);
    }
    const povzemi = (o) => ({ prvaVsebina: mediana(o.prva), ucnaPot: mediana(o.pot), surovo: o });
    izid.ponovniObisk = povzemi(obisk);
    izid.osvezitev = povzemi(osvezitev);
    await ctx.close();
  } finally {
    await browser.close();
    app.stop();
  }
  const izpis = JSON.stringify(izid, null, 1);
  if (arg("--json")) fs.writeFileSync(arg("--json"), izpis + "\n");
  console.log(
    `${BRSKALNIK} ${ZASLON.width}×${ZASLON.height}: prvi obisk ${izid.prviObisk} ms; ponovni obisk prva vsebina ${izid.ponovniObisk.prvaVsebina} ms, Učna pot ${izid.ponovniObisk.ucnaPot} ms; osvežitev ${izid.osvezitev.prvaVsebina} / ${izid.osvezitev.ucnaPot} ms`,
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

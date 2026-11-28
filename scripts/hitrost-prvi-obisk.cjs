// Prvi obisk, kot ga vidi nov obiskovalec v produkciji (z računi, EVKLID_ACCOUNTS=1), na počasnem omrežju (27. 11. 2026).
// scripts/hitrost-naprav.cjs (K-12) meri prvi obisk brez računov (obrazec za nov profil), ki ga obiskovalec evklid.app ne vidi:
// v produkciji dobi pristajalno stran s strežnika (server/pristajalna-takoj.js) in se nato registrira ali prijavi.
// Za eno ali več naprav iz matrike K-12 (scripts/matrika-naprav.cjs) izmeri, vsakič s praznim predpomnilnikom (nov kontekst):
//   - pristajalna: od začetka nalaganja do vidne pristajalne strani;
//   - obrazec: obiskovalec se dotakne »Začni brezplačno« takoj, ko stran vidi; do vidnega obrazca za registracijo;
//   - aplikacija: do trenutka, ko stran prevzame app.js (account.js initAccount pokaže zavihek Račun, #account-tab).
// Omrežje in strežnik kot v hitrost-naprav.cjs (posrednik »Slow 4G«: 150 ms, 1,6 Mbit/s × 0,9; preizkusni način, EVKLID_SKRCI=1).
// Zagon: node scripts/hitrost-prvi-obisk.cjs [--samo android-360,iphone-390] [--ponovitve 7] [--koren <mapa>] [--json <datoteka>]
// --koren: druga različica aplikacije (npr. git worktree starejšega commita), za meritev »prej« z isto skripto.
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const net = require("node:net");
const path = require("node:path");
const playwright = require("playwright");
const { posrednik, mediana } = require("./hitrost-naprav.cjs");
const { MATRIKA } = require("./matrika-naprav.cjs");

const args = process.argv.slice(2);
const arg = (n) => (args.indexOf(n) >= 0 ? args[args.indexOf(n) + 1] : null);
const KOREN = path.resolve(arg("--koren") || path.join(__dirname, ".."));
const PONOVITVE = Math.max(1, Number(arg("--ponovitve")) || 7);
const ROK = 60000;

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
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-prvi-obisk-"));
  const env = {
    ...process.env,
    PORT: String(port),
    EVKLID_ACCOUNTS: "1", // kot produkcija (render.yaml): obiskovalec brez seje dobi pristajalno stran
    EVKLID_MOCK: "1",
    EVKLID_SKRCI: "1",
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

// V strani, samo v sličicah (rAF): časi od začetka nalaganja. »Dotik« je klik povezave v isti sličici, ko je stran vidna
// (najhitrejši obiskovalec; počasnejši dobi obrazec prej ali enako hitro, glej docs/meritve).
const MERILNIK = () => {
  const t = (window.__prvi = { pristajalna: null, dotik: null, obrazec: null, aplikacija: null });
  const vidno = (el) => !!el && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== "hidden";
  const preveri = () => {
    const zdaj = performance.now();
    const a = document.getElementById("view-auth");
    if (t.pristajalna == null && a && !a.hidden && vidno(a) && a.querySelector(".land")) t.pristajalna = zdaj;
    if (t.pristajalna != null && t.dotik == null) {
      const g = document.querySelector('#view-auth a[data-land="register"]');
      if (g) (t.dotik = zdaj), g.click();
    }
    if (t.obrazec == null && vidno(document.getElementById("auth-form"))) t.obrazec = zdaj;
    const tab = document.getElementById("account-tab"); // app.js je zagnal račune (account.js initAccount)
    if (t.aplikacija == null && tab && !tab.hidden) t.aplikacija = zdaj;
    if (t.obrazec == null || t.aplikacija == null) requestAnimationFrame(preveri);
  };
  requestAnimationFrame(preveri);
};

async function naprava(z, base, pos) {
  const browser = await playwright[z.brskalnik].launch();
  const izid = { id: z.id, opis: z.opis, brskalnik: z.brskalnik, razlicica: browser.version(), pristajalna: [], obrazec: [], aplikacija: [] };
  try {
    // Ena ponovitev naprej, ki ne šteje: strežnik stisne datoteke ob prvi zahtevi za vsako kodiranje (server/compress.js;
    // WebKit v Playwrightu na Linuxu ne sprejme brotlija in dobi gzip), merimo pa omrežje in brskalnik, ne prvega stiskanja.
    for (let i = -1; i < PONOVITVE; i++) {
      const ctx = await browser.newContext({
        viewport: { width: z.w, height: z.h },
        hasTouch: z.dotik,
        ...(z.mobilno && z.brskalnik !== "firefox" ? { isMobile: true } : {}),
        locale: "sl-SI",
        timezoneId: "Europe/Ljubljana",
        reducedMotion: "reduce",
        deviceScaleFactor: 1,
      });
      await ctx.addInitScript(MERILNIK);
      const p = await ctx.newPage();
      await p.goto(base + "/");
      await p.waitForFunction(() => window.__prvi.obrazec != null && window.__prvi.aplikacija != null, null, { timeout: ROK });
      const t = await p.evaluate(() => window.__prvi);
      if (i >= 0) for (const k of ["pristajalna", "obrazec", "aplikacija"]) izid[k].push(Math.round(t[k]));
      await ctx.close();
      await pos.tiho(500); // prenosi v ozadju (service worker, zasloni vnaprej) se končajo pred naslednjo ponovitvijo
    }
  } finally {
    await browser.close();
  }
  for (const k of ["pristajalna", "obrazec", "aplikacija"]) izid[k] = { mediana: mediana(izid[k]), surovo: izid[k] };
  return izid;
}

module.exports = { MERILNIK };
if (require.main === module) main().catch((e) => {
  console.error(e);
  process.exit(1);
});

async function main() {
  const izbor = arg("--samo")?.split(",").map((s) => s.trim());
  const zagon = MATRIKA.filter((z) => !izbor || izbor.includes(z.id));
  if (!zagon.length) throw new Error(`--samo: ${MATRIKA.map((z) => z.id).join(", ")}`);
  const app = await streznik();
  const pos = await posrednik(app.base);
  const izid = { datum: new Date().toISOString(), koren: KOREN, ponovitve: PONOVITVE, naprave: [] };
  try {
    for (const z of zagon) {
      const r = await naprava(z, pos.base, pos);
      izid.naprave.push(r);
      console.log(`${z.id}: pristajalna ${r.pristajalna.mediana} ms, obrazec ${r.obrazec.mediana} ms, aplikacija ${r.aplikacija.mediana} ms`);
    }
  } finally {
    pos.stop();
    app.stop();
  }
  if (arg("--json")) fs.writeFileSync(arg("--json"), JSON.stringify(izid, null, 1) + "\n");
}

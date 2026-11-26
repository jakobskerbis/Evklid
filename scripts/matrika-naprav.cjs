// Matrika naprav K-12 (načrt dviga kakovosti po reviziji, 26. 11. 2026): 9 kombinacij naprave in brskalnika.
// Za vsako kombinacijo:
//   1. dimni test scripts/preveri-aplikacijo.cjs (--brez-racunov, del telefon ali računalnik po velikosti zaslona) s posnetki
//      in meritvami; šteje prekrivanja (mehurček inštruktorja, obvestilo), male navpične drsnike (▲▼), vodoravno drsenje
//      in vse druge napake dimnega testa;
//   2. hitrost odpiranja scripts/hitrost-naprav.cjs za trenutno kodo in, z --prej <mapa>, za starejšo različico.
// Zagon: node scripts/matrika-naprav.cjs --mapa <izhod> [--prej <mapa starejše različice>] [--samo id,id]
//   [--brez-dimnega] [--brez-hitrosti] [--ponovitve 7]
// Izhod: <izhod>/<id>/ (posnetki, dnevnik.txt, hitrost.json, hitrost-prej.json) in <izhod>/matrika.json.
// Brskalniki: Playwright s Chromiumom, WebKitom in Firefoxom (PLAYWRIGHT_BROWSERS_PATH, če niso na privzetem mestu).
// Naenkrat teče ena kombinacija (meritve hitrosti ne smejo tekmovati za procesor).
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const args = process.argv.slice(2);
const arg = (n) => (args.indexOf(n) >= 0 ? args[args.indexOf(n) + 1] : null);
const OUT = path.resolve(arg("--mapa") || "matrika-naprav");
const PREJ = arg("--prej") ? path.resolve(arg("--prej")) : null;
const PONOVITVE = arg("--ponovitve") || "7";

// id, opis, brskalnik, zaslon, dotik, mobilni pogled. Izbor: najpogostejše naprave učencev (Android in iPhone v dveh
// velikostih, iPad pokončno in ležeče, Windows s Chromom ali Edgeom, Mac s Safarijem, Firefox na velikem zaslonu).
const MATRIKA = [
  { id: "android-360", opis: "Android telefon 360 × 740, Chrome", brskalnik: "chromium", w: 360, h: 740, dotik: true, mobilno: true },
  { id: "android-412", opis: "Android telefon 412 × 915, Chrome", brskalnik: "chromium", w: 412, h: 915, dotik: true, mobilno: true },
  { id: "iphone-375", opis: "iPhone SE 375 × 667, Safari", brskalnik: "webkit", w: 375, h: 667, dotik: true, mobilno: true },
  { id: "iphone-390", opis: "iPhone 390 × 844, Safari", brskalnik: "webkit", w: 390, h: 844, dotik: true, mobilno: true },
  { id: "ipad-820", opis: "iPad 820 × 1180 pokončno, Safari", brskalnik: "webkit", w: 820, h: 1180, dotik: true, mobilno: false },
  { id: "ipad-1180", opis: "iPad 1180 × 820 ležeče, Safari", brskalnik: "webkit", w: 1180, h: 820, dotik: true, mobilno: false },
  { id: "windows-1366", opis: "računalnik 1366 × 768, Chrome/Edge", brskalnik: "chromium", w: 1366, h: 768, dotik: false, mobilno: false },
  { id: "mac-1440", opis: "Mac 1440 × 900, Safari", brskalnik: "webkit", w: 1440, h: 900, dotik: false, mobilno: false },
  { id: "firefox-1920", opis: "računalnik 1920 × 1080, Firefox", brskalnik: "firefox", w: 1920, h: 1080, dotik: false, mobilno: false },
];
// Isto pravilo kot public/style.css (»spodnja vrstica«) in scripts/posnetki-naprave.cjs.
const tokZa = (z) => (z.w <= 760 || (z.dotik && z.w <= 1240) ? "telefon" : "racunalnik");

// Vrste napak dimnega testa, ki jih K-12 šteje posebej.
const VRSTE = [
  ["prekrivanje", /prekriva/],
  ["mali drsnik", /mali navpični drsnik/],
  ["vodoravno drsenje", /vodoravno drsenje|cela stran je za/],
];
const vrsta = (t) => VRSTE.find(([, re]) => re.test(t))?.[0] || "drugo";

function pozeni(argv, log) {
  return new Promise((resolve) => {
    const p = spawn(process.execPath, argv, { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"] });
    let out = "";
    p.stdout.on("data", (d) => (out += d));
    p.stderr.on("data", (d) => (out += d));
    p.on("close", (code, signal) => {
      if (log) fs.writeFileSync(log, out);
      resolve({ code, signal, out });
    });
  });
}

async function kombinacija(z) {
  const mapa = path.join(OUT, z.id);
  fs.mkdirSync(mapa, { recursive: true });
  const r = { ...z, tok: tokZa(z) };
  const zaslon = `${z.w}x${z.h}`;
  if (!args.includes("--brez-dimnega")) {
    const posnetki = path.join(mapa, "posnetki");
    fs.rmSync(posnetki, { recursive: true, force: true });
    const a = ["scripts/preveri-aplikacijo.cjs", "--brez-racunov", "--samo", r.tok, "--zaslon", zaslon, "--brskalnik", z.brskalnik, "--posnetki", posnetki, "--meritve"];
    if (z.dotik) a.push("--dotik");
    if (z.mobilno) a.push("--mobilno");
    const t0 = Date.now();
    const { code, signal, out } = await pozeni(a, path.join(mapa, "dnevnik.txt"));
    const napake = out.split("\n").filter((l) => l.startsWith("NAPAKA ")).map((l) => l.slice(7));
    if (code !== 0 && !napake.length) napake.push(`dimni test se je končal ${signal ? `s signalom ${signal}` : `z izhodom ${code}`}`);
    const posnetkov = fs.existsSync(posnetki) ? fs.readdirSync(posnetki).filter((f) => f.endsWith(".png") && !f.startsWith("NAPAKA")).length : 0;
    const poVrsti = Object.fromEntries([...VRSTE.map(([v]) => v), "drugo"].map((v) => [v, napake.filter((n) => vrsta(n) === v)]));
    r.dimni = { sekund: Math.round((Date.now() - t0) / 1000), posnetkov, napak: napake.length, poVrsti };
  }
  if (!args.includes("--brez-hitrosti")) {
    const h = ["scripts/hitrost-naprav.cjs", "--brskalnik", z.brskalnik, "--zaslon", zaslon, "--ponovitve", PONOVITVE];
    if (z.dotik) h.push("--dotik");
    if (z.mobilno) h.push("--mobilno");
    const beri = async (koren, ime) => {
      const f = path.join(mapa, ime);
      const { code, out } = await pozeni([...h, "--json", f, ...(koren ? ["--koren", koren] : [])]);
      return code === 0 && fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : { napaka: out.trim().split("\n").slice(-3).join(" | ") };
    };
    r.hitrost = await beri(null, "hitrost.json");
    if (PREJ) r.hitrostPrej = await beri(PREJ, "hitrost-prej.json");
  }
  return r;
}

module.exports = { MATRIKA, tokZa, vrsta };
if (require.main === module) main().catch((e) => {
  console.error(e);
  process.exit(1);
});

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const izbor = arg("--samo")?.split(",").map((s) => s.trim());
  const zagon = MATRIKA.filter((z) => !izbor || izbor.includes(z.id));
  if (!zagon.length) throw new Error(`--samo: ${MATRIKA.map((z) => z.id).join(", ")}`);
  const izid = [];
  for (const z of zagon) {
    const r = await kombinacija(z);
    izid.push(r);
    const d = r.dimni ? `${r.dimni.posnetkov} posnetkov, ${r.dimni.napak} napak` : "brez dimnega";
    const hi = (x) => (x?.ponovniObisk ? `${x.ponovniObisk.prvaVsebina}/${x.ponovniObisk.ucnaPot} ms` : x?.napaka ? "napaka" : "–");
    console.log(`${z.id} (${z.opis}): ${d}; ponovni obisk prva vsebina/Učna pot ${hi(r.hitrost)}${PREJ ? `, prej ${hi(r.hitrostPrej)}` : ""}`);
    fs.writeFileSync(path.join(OUT, "matrika.json"), JSON.stringify({ datum: new Date().toISOString(), prej: PREJ, izid }, null, 1) + "\n");
  }
  const napak = izid.reduce((s, r) => s + (r.dimni?.napak || 0), 0);
  process.exitCode = napak ? 1 : 0;
}

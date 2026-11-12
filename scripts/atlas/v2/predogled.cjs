// Atlas v2: posnetki ene kosti iz istih 8 pogledov (+ 2 od blizu) za izhodišče in nov model (Playwright, swiftshader).
//   node scripts/atlas/v2/predogled.cjs [--kost=Humerus] <izhodna mapa> <oznaka>=<pot do .ply|.glb>[:brez-tekstur|:brez-normale|:obrni-g|:senca] …
// --kost=Humerus: pogledi za nadlahtnico (spredaj, zadaj, medialno, lateralno, zgoraj, spodaj vzdolž osi kosti in 4 od blizu
// na proksimalnem in distalnem koncu); brez --kost pogledi stegnenice (nespremenjeni).
// »senca«: bel material z isto normal map (brez barve, AO, hrapavosti) – ali se grebeni berejo kot izbokline.
// Primer: node scripts/atlas/v2/predogled.cjs /home/claude/atlas-v2-predogled izhodisce=/tmp/femur-telo-hd.ply \
//           realisticno=/tmp/v2/stegnenica-leva-racunalnik-realisticno.glb ucbenisko=/tmp/v2/stegnenica-leva-racunalnik-ucbenisko.glb
// Izhodišče (.ply iz izvleci.mjs) dobi material kosti atlasa (public/3d/tkiva.js) z isto lučjo kot nov model.
// Kader vseh modelov je iz škatle prvega, zato so posnetki poravnani. Strežnik: public/ in node_modules/three.
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
let chromium;
try {
  ({ chromium } = require(process.env.PLAYWRIGHT || "/opt/npm-tools/node_modules/playwright"));
} catch {
  ({ chromium } = require("playwright"));
}
const KOREN = path.join(__dirname, "..", "..", "..");
const zastavice = process.argv.slice(2).filter((a) => a.startsWith("--"));
const [izhod, ...modeli] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const KOST = (zastavice.find((a) => a.startsWith("--kost=")) || "--kost=Femur").slice(7);
if (!izhod || !modeli.length) {
  console.error("uporaba: predogled.cjs <izhodna mapa> <oznaka>=<pot>[:brez-tekstur] …");
  process.exit(2);
}
fs.mkdirSync(izhod, { recursive: true });
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".glb": "model/gltf-binary", ".ply": "application/octet-stream", ".webp": "image/webp" };
const datoteke = new Map();
const streznik = http.createServer((req, res) => {
  const u = decodeURIComponent(new URL(req.url, "http://x").pathname);
  let p;
  if (u === "/v2/predogled.html") p = path.join(__dirname, "predogled.html");
  else if (u.startsWith("/vendor/three/")) p = path.join(KOREN, "node_modules", "three", u.slice("/vendor/three/".length));
  else if (u.startsWith("/model/")) p = datoteke.get(u);
  else p = path.join(KOREN, "public", u);
  if (!p || !p.startsWith(KOREN) && !datoteke.has(u) || !fs.existsSync(p)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": TIPI[path.extname(p)] || "application/octet-stream" });
  fs.createReadStream(p).pipe(res);
});
// Pogledi (osi atlasa: +Z spredaj, +Y gor, leva stegnenica: medialno = −X). [ime, smer kamere, okvir: "cela" | [t, polovica v m]]
const POGLEDI = [
  ["1-spredaj", [0, 0, 1], "cela"],
  ["2-zadaj", [0, 0, -1], "cela"],
  ["3-medialno", [-1, 0, 0], "cela"],
  ["4-lateralno", [1, 0, 0], "cela"],
  ["5-spredaj-lateralno", [0.7, 0, 0.7], "cela"],
  ["6-zadaj-medialno", [-0.7, 0, -0.7], "cela"],
  ["7-zgoraj", [0.05, 1, 0.15], "konec-zg"],
  ["8-spodaj", [0.05, -1, 0.15], "konec-sp"],
  ["9-blizu-proksimalno-zadaj", [-0.35, 0.15, -1], [0.86, 0.075]],
  ["10-blizu-diafiza-zadaj", [-0.15, 0, -1], [0.58, 0.05]],
];
// Nadlahtnica (leva, medialno = −X): os kosti v atlasu je nagnjena (~10° od navpičnice, roka malo odmaknjena), zato
// sta pogleda zgoraj/spodaj vzdolž osi in kadri od blizu na osi: ["os", t (0 distalno … 1 proksimalno), polovica v m].
const OS_NADLAHTNICE = [-0.175, 0.984, 0.041];
const POGLEDI_KOSTI = {
  Femur: POGLEDI,
  Humerus: [
    ["1-spredaj", [0, 0, 1], "cela"],
    ["2-zadaj", [0, 0, -1], "cela"],
    ["3-medialno", [-1, -0.18, 0], "cela"],
    ["4-lateralno", [1, 0.18, 0], "cela"],
    ["5-zgoraj", [-0.175, 0.984, 0.041 + 0.1], ["os", 0.93, 0.045]],
    ["6-spodaj", [0.175, -0.984, -0.041 + 0.1], ["os", 0.06, 0.045]],
    ["7-blizu-proksimalno-spredaj", [0.15, 0.1, 1], ["os", 0.88, 0.05]],
    ["8-blizu-proksimalno-zadaj", [-0.15, 0.1, -1], ["os", 0.88, 0.05]],
    ["9-blizu-distalno-spredaj", [-0.1, 0.15, 1], ["os", 0.09, 0.045]],
    ["10-blizu-distalno-zadaj", [0.1, 0.15, -1], ["os", 0.09, 0.045]],
  ],
}[KOST];
if (!POGLEDI_KOSTI) { console.error(`neznana kost ${KOST}`); process.exit(2); }
(async () => {
  await new Promise((r) => streznik.listen(0, r));
  const port = streznik.address().port;
  const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  let okvir = null;
  const izid = {};
  for (const m of modeli) {
    const [oznaka, ostalo] = m.split("=");
    const [pot, nacin] = ostalo.split(":");
    const kljuc = `/model/${oznaka}${path.extname(pot)}`;
    datoteke.set(kljuc, path.resolve(pot));
    for (const [ime, smer, kader] of POGLEDI_KOSTI) {
      const celo = kader === "cela";
      const w = celo ? 520 : 760, h = celo ? 1000 : 760;
      const page = await browser.newPage({ viewport: { width: w, height: h } });
      page.on("console", (m) => { if (m.type() === "error") console.error("stran:", m.text()); });
      page.on("pageerror", (e) => console.error("stran:", e.message));
      await page.goto(`http://127.0.0.1:${port}/v2/predogled.html?w=${w}&h=${h}`);
      await page.waitForFunction(() => window.pripravljeno, null, { timeout: 60000 });
      const box = await page.evaluate(([p, n]) => window.pripravi(p, n), [kljuc, nacin || ""]);
      if (!okvir) okvir = box;
      const { c, s } = okvir;
      let sredisce = c, pol;
      if (celo) pol = s[1] * 0.53;
      else if (kader === "konec-zg") { sredisce = [c[0], c[1] + s[1] * 0.4, c[2]]; pol = 0.075; }
      else if (kader === "konec-sp") { sredisce = [c[0], c[1] - s[1] * 0.42, c[2]]; pol = 0.065; }
      else if (kader[0] === "os") {  // točka na osi kosti pri t (dolžina ≈ višina škatle / cos nagiba)
        const L = s[1] / OS_NADLAHTNICE[1];
        sredisce = [0, 1, 2].map((k) => c[k] + OS_NADLAHTNICE[k] * L * (kader[1] - 0.5));
        pol = kader[2];
      } else { sredisce = [c[0], c[1] - s[1] / 2 + s[1] * kader[0], c[2] - s[2] * 0.1]; pol = kader[1]; }
      const url = await page.evaluate(([d, sr, p]) => window.posnemi(d, sr, p), [smer, sredisce, pol]);
      const dat = path.join(izhod, `${oznaka}-${ime}.png`);
      fs.writeFileSync(dat, Buffer.from(url.split(",")[1], "base64"));
      (izid[oznaka] ||= []).push(dat);
      await page.close();
    }
    console.log(`${oznaka}: ${izid[oznaka].length} posnetkov`);
  }
  await browser.close();
  streznik.close();
  fs.writeFileSync(path.join(izhod, "posnetki.json"), JSON.stringify({ ...(KOST !== "Femur" ? { kost: KOST } : {}), pogledi: POGLEDI_KOSTI.map((p) => p[0]), izid }, null, 1));
})().catch((e) => { console.error(e); process.exit(1); });

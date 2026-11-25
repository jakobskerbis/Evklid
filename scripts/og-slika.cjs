// Slika za predogled povezave (og:image, twitter:image) 1200 × 630 (j 2026-11-16).
// Besedilo: ime, domena in »slovenski AI inštruktor« ter naslov vstopne strani (land.title v public/i18n/sl.js, #750).
// Ime in domena iz brand.json, znak iz scripts/logotip.cjs, pisava Instrument Sans (odprta, @fontsource-variable).
// Slika ni del prvega odprtja: nanjo kažejo samo <meta> v public/index.html, ne href/src (test/hitrost-proracun.test.js).
//   node scripts/og-slika.cjs   zapiše public/icons/deljenje.jpg (potrebuje playwright, kot scripts/logotip.cjs)
const fs = require("node:fs");
const path = require("node:path");
const { tile } = require("./logotip.cjs");

const ROOT = path.join(__dirname, "..");
const BRAND = JSON.parse(fs.readFileSync(path.join(ROOT, "brand.json"), "utf8"));
const OUT = path.join(ROOT, "public/icons/deljenje.jpg");
const TITLE = `Ko se pri domači nalogi zatakne, ti ${BRAND.name} pokaže naslednji korak.`;
const font = (sub) =>
  fs.readFileSync(path.join(ROOT, `node_modules/@fontsource-variable/instrument-sans/files/instrument-sans-${sub}-wght-normal.woff2`)).toString("base64");

const html = `<!doctype html><html lang="sl"><head><meta charset="utf-8"><style>
@font-face{font-family:IS;font-weight:400 700;src:url(data:font/woff2;base64,${font("latin")}) format("woff2");unicode-range:U+0000-00FF}
@font-face{font-family:IS;font-weight:400 700;src:url(data:font/woff2;base64,${font("latin-ext")}) format("woff2");unicode-range:U+0100-02AF}
body{margin:0;width:1200px;height:630px;font-family:IS,sans-serif;color:#fff;background:linear-gradient(135deg,#2353d1,#3563dc);
display:flex;flex-direction:column;justify-content:center;padding:0 88px;box-sizing:border-box;gap:44px}
.row{display:flex;align-items:center;gap:22px;font-size:40px;font-weight:600}.row svg{flex:none}
.name{font-size:56px;font-weight:700;letter-spacing:-.02em}.name span{color:#bcd0ff}.dot{opacity:.7}
h1{margin:0;font-size:76px;font-weight:700;line-height:1.1;letter-spacing:-.01em}
</style></head><body>
<div class="row">${tile({ size: 84, pad: 0.12, radius: 0.22, bg: false })}<span class="name">${BRAND.wordmark[0]}<span>${BRAND.wordmark[1]}</span></span><span class="dot">·</span><span>${BRAND.domain}</span><span class="dot">·</span><span>slovenski AI inštruktor</span></div>
<h1>${TITLE}</h1>
</body></html>`;

(async () => {
  const { chromium } = require("playwright");
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(html);
  await page.evaluate(() => document.fonts.ready);
  const over = await page.evaluate(() => document.documentElement.scrollHeight > 630 || document.documentElement.scrollWidth > 1200);
  if (over) throw new Error("besedilo ne gre na sliko 1200 × 630");
  fs.writeFileSync(OUT, await page.screenshot({ type: "jpeg", quality: 90 }));
  await browser.close();
  console.log("✓", path.relative(ROOT, OUT));
})().catch((e) => { console.error(e); process.exit(1); });

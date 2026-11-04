// Logotip Evklida: kristal kuhinjske soli (j, 2026-11-04, predlog K6a2 + K6c2 v niti »Zasnuj logo za Evklid«).
// Kocka v poševni projekciji (sprednji kvadrat, zadnji zamaknjen gor desno), v ogliščih izmenično veliki (Cl⁻)
// in mali ioni (Na⁺). Dve obliki istega znaka:
//   - polna (tri ploskve v treh odtenkih bele, ioni z režo okrog): ikona aplikacije, favicon, Android, iPhone;
//   - črtna (robovi, skriti robovi črtkano): logotip v vmesniku, ikona »kristal« v public/icons.js
//     (scripts/build-icons.js → CUSTOM).
// Ta skript iz enega opisa izriše vse slike ikon (Chromium iz Playwrighta, odprta orodja):
//   node scripts/logotip.cjs            zapiše public/icons/*, mobile/assets/*, assets/evklid.png in .ico
//   node scripts/logotip.cjs --svg      izpiše samo SVG polnega znaka na ploščici (za pregled)
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
// Preliv ploščice: modra poudarka sloga Čist (--hero-a #2353d1), malo razširjena, da je ikona živa tudi majhna.
const A = "#1f4bc8", B = "#3a6be6";

// Polni znak v mreži 48 × 48. fg = barva znaka, uid loči maske, kadar je več znakov na isti strani.
function mark(fg = "#fff", uid = "k") {
  const Fr = [[7, 17], [31, 17], [31, 41], [7, 41]], Bk = [[17, 7], [41, 7], [41, 31], [17, 31]];
  const poly = (pts) => "M" + pts.map((p) => p.join(" ")).join("L") + "z";
  const BIG = 3.9, SM = 2.5;
  const ions = [[Fr[0], BIG], [Fr[1], SM], [Fr[2], BIG], [Fr[3], SM], [Bk[0], SM], [Bk[1], BIG], [Bk[2], SM]];
  const halo = ions.map(([p, r]) => `<circle cx="${p[0]}" cy="${p[1]}" r="${r + 1.1}" fill="#000"/>`).join("");
  return `<mask id="${uid}"><rect width="48" height="48" fill="#fff"/>` +
    `<path d="M${Fr[0].join(" ")}L${Fr[1].join(" ")}L${Fr[2].join(" ")}" fill="none" stroke="#000" stroke-width="1.8"/>${halo}</mask>` +
    `<g mask="url(#${uid})"><path d="${poly(Fr)}" fill="${fg}"/>` +
    `<path d="${poly([Fr[0], Fr[1], Bk[1], Bk[0]])}" fill="${fg}" fill-opacity=".72"/>` +
    `<path d="${poly([Fr[1], Bk[1], Bk[2], Fr[2]])}" fill="${fg}" fill-opacity=".45"/></g>` +
    ions.map(([p, r]) => `<circle cx="${p[0]}" cy="${p[1]}" r="${r}" fill="${fg}"/>`).join("");
}

// Ploščica s prelivom in znakom. size = stranica v px; pad = rob okoli mreže 48 (delež); radius = delež stranice (0 = do roba).
function tile({ size, pad, radius = 0, bg = true, fg = "#fff" }) {
  const inner = size * (1 - 2 * pad), off = size * pad, s = inner / 48, r = radius * size;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">` +
    (bg ? `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${A}"/><stop offset="1" stop-color="${B}"/></linearGradient></defs>` +
      `<rect width="${size}" height="${size}" rx="${r}" fill="url(#g)"/>` : "") +
    `<g transform="translate(${off} ${off}) scale(${s})">${mark(fg)}</g></svg>`;
}

// Vse slike: pot, velikost, mere ploščice. Android: varno območje prilagodljive ikone je krog 66/108,
// maskable (PWA) krog 80 %: znak (34 enot od 48) mora biti ves v njem.
const OUT = [
  ["public/icons/icon-192.png", 192, { pad: 0.2, radius: 0.22 }],
  ["public/icons/icon-512.png", 512, { pad: 0.2, radius: 0.22 }],
  ["public/icons/maskable-512.png", 512, { pad: 0.19, radius: 0 }],
  ["public/icons/apple-touch-icon.png", 180, { pad: 0.2, radius: 0 }],
  ["mobile/assets/icon.png", 1024, { pad: 0.2, radius: 0 }],
  ["mobile/assets/splash-icon.png", 512, { pad: 0.2, radius: 0.22 }],
  ["mobile/assets/android-icon-background.png", 1024, { pad: 0.5, radius: 0, onlyBg: true }],
  ["mobile/assets/android-icon-foreground.png", 1024, { pad: 0.27, radius: 0, bg: false }],
  ["mobile/assets/android-icon-monochrome.png", 1024, { pad: 0.27, radius: 0, bg: false }],
  ["assets/evklid.png", 1024, { pad: 0.2, radius: 0.22 }],
];
// Znak z ioni vred zavzame 42 od 48 enot (oglišča 7…41, ioni do polmera 3,9 čez). Android foreground:
// pad 0.27 → mreža 471 px, znak 412 px, diagonala 583 px < 626 px (varni krog 66/108 · 1024).
// Maskable: pad 0.19 → mreža 317 px, znak 277 px, diagonala 392 px < 410 px (varni krog 80 % · 512).
const ICO = [16, 32, 48, 64, 128, 256];
// Favicon do 32 px: manj roba, da je znak večji.
const icoPad = (n) => (n <= 32 ? 0.1 : 0.16);
const FAVICON = tile({ size: 64, pad: 0.1, radius: 0.22 });

function ico(pngs) {
  const head = Buffer.alloc(6 + 16 * pngs.length);
  head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(pngs.length, 4);
  let off = head.length;
  pngs.forEach(([n, buf], i) => {
    const e = 6 + 16 * i;
    head[e] = n >= 256 ? 0 : n; head[e + 1] = n >= 256 ? 0 : n; head[e + 2] = 0; head[e + 3] = 0;
    head.writeUInt16LE(1, e + 4); head.writeUInt16LE(32, e + 6); head.writeUInt32LE(buf.length, e + 8); head.writeUInt32LE(off, e + 12);
    off += buf.length;
  });
  return Buffer.concat([head, ...pngs.map(([, b]) => b)]);
}

async function main() {
  if (process.argv.includes("--svg")) { process.stdout.write(tile({ size: 512, pad: 0.2, radius: 0.22 }) + "\n"); return; }
  const { chromium } = require("playwright");
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  const shot = async (svg, size) => {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(`<html><body style="margin:0;background:transparent">${svg}</body></html>`);
    return page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
  };
  for (const [file, size, o] of OUT) {
    const svg = o.onlyBg
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${A}"/><stop offset="1" stop-color="${B}"/></linearGradient></defs><rect width="${size}" height="${size}" fill="url(#g)"/></svg>`
      : tile({ size, ...o });
    fs.writeFileSync(path.join(ROOT, file), await shot(svg, size));
    console.log("✓", file);
  }
  const pngs = [];
  for (const n of ICO) pngs.push([n, await shot(tile({ size: n, pad: icoPad(n), radius: 0.22 }), n)]);
  fs.writeFileSync(path.join(ROOT, "assets/evklid.ico"), ico(pngs));
  console.log("✓ assets/evklid.ico");
  fs.writeFileSync(path.join(ROOT, "public/icons/favicon.svg"), FAVICON + "\n");
  console.log("✓ public/icons/favicon.svg");
  await browser.close();
}

module.exports = { mark, tile };
if (require.main === module) main().catch((e) => { console.error(e); process.exit(1); });

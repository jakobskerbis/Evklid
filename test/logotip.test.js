// Logotip (kristal soli, scripts/logotip.cjs): vse ikone obstajajo v pravih velikostih, vmesnik uporablja ikono »kristal«,
// stari logotip (»elementi«, akademski klobuček) ne ostane nikjer.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => fs.readFileSync(path.join(ROOT, f));
const pngSize = (buf) => [buf.readUInt32BE(16), buf.readUInt32BE(20)];

test("logo: every install icon exists as PNG with the expected size", () => {
  const want = {
    "public/icons/icon-192.png": 192, "public/icons/icon-512.png": 512, "public/icons/maskable-512.png": 512,
    "public/icons/apple-touch-icon.png": 180, "mobile/assets/icon.png": 1024, "mobile/assets/splash-icon.png": 512,
    "mobile/assets/android-icon-foreground.png": 1024, "mobile/assets/android-icon-background.png": 1024,
    "mobile/assets/android-icon-monochrome.png": 1024, "assets/evklid.png": 1024,
  };
  for (const [f, n] of Object.entries(want)) {
    const b = read(f);
    assert.equal(b.toString("latin1", 1, 4), "PNG", `${f} ni PNG`);
    assert.deepEqual(pngSize(b), [n, n], `${f} mora biti ${n} × ${n}`);
  }
  const ico = read("assets/evklid.ico");
  assert.equal(ico.readUInt16LE(2), 1, "evklid.ico je ikona");
  assert.ok(ico.readUInt16LE(4) >= 4, "evklid.ico ima več velikosti (16 … 256)");
});

test("logo: favicon SVG and the in-app icon are the salt crystal", () => {
  const fav = read("public/icons/favicon.svg").toString();
  assert.match(fav, /^<svg[^>]+viewBox="0 0 64 64"/);
  assert.ok(/<mask id=/.test(fav) && (fav.match(/<circle /g) || []).length >= 7 * 2, "polni znak: ploskve z masko in 7 ionov");
  const html = read("public/index.html").toString();
  assert.ok(html.includes('href="/icons/favicon.svg"'), "index.html naloži favicon.svg");
  for (const f of ["public/index.html", "public/ucitelj.html"]) assert.ok(read(f).toString().includes('data-icon="kristal"'), `${f}: logotip je ikona kristal`);
  const icons = read("public/icons.js").toString();
  assert.ok(icons.includes('"kristal":'), "icons.js ima ikono kristal");
  assert.ok(!icons.includes('"elementi":'), "stara ikona logotipa je odstranjena");
  const { tile } = createRequire(import.meta.url)(path.join(ROOT, "scripts/logotip.cjs"));
  assert.equal(tile({ size: 64, pad: 0.1, radius: 0.22 }) + "\n", fav, "favicon.svg je enak izrisu scripts/logotip.cjs");
});

// Obroba fokusa (tipkovnica) ima vsaj 3 : 1 kontrasta ob ozadju v svetlem in temnem slogu (WCAG 1.4.11; UX maturanta 12).
// Prej je bila 45 % prosojna barva poudarka (na belem ≈ #9CB2EA, 2,1 : 1).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const PUB = path.join(import.meta.dirname, "..", "public");
const css = fs.readFileSync(path.join(PUB, "style.css"), "utf8");
const block = (sel) => css.slice(css.indexOf(`${sel} {`), css.indexOf("}", css.indexOf(`${sel} {`)));
const tok = (b, name) => new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, "i").exec(b)[1];
const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

test("focus outline: opaque accent, at least 3:1 on page and card backgrounds in light and dark theme", () => {
  assert.match(css, /^:focus-visible \{ outline: 3px solid var\(--accent\);/m);
  for (const sel of [":root", ":root.dark"]) {
    const b = block(sel);
    for (const bg of ["bg", "surface", "surface-2"]) {
      const r = ratio(tok(b, "accent"), tok(b, bg));
      assert.ok(r >= 3, `${sel} accent ${tok(b, "accent")} na ${bg} ${tok(b, bg)}: ${r.toFixed(2)}`);
    }
  }
  // Na modri podlagi (kartica Danes) bela obroba.
  assert.match(css, /\.hero :focus-visible \{ outline-color: #fff; \}/);
  assert.ok(ratio("#ffffff", tok(block(":root"), "hero-a")) >= 3);
  // Nobena obroba fokusa ni več prosojna mešanica.
  for (const f of fs.readdirSync(PUB).filter((x) => x.endsWith(".css"))) {
    const bad = fs
      .readFileSync(path.join(PUB, f), "utf8")
      .split("\n")
      .filter((l) => /:focus-visible[^{]*\{[^}]*outline:[^;}]*transparent/.test(l));
    assert.deepEqual(bad, [], f);
  }
});

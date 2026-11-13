// Prikaz na grafu (public/sim/prikaz.js): skupine elementov, ki jih učenec vklopi in izklopi, in imena iz legende.
// Postavitev in poravnavo drsnikov z osjo preverja scripts/preveri-simulacije.cjs v brskalniku.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { LAYERS, legendName } from "../public/sim/prikaz.js";
import SL from "../public/i18n/sl.js";

const css = fs.readFileSync(path.join(import.meta.dirname, "..", "public", "textbook.css"), "utf8");

test("every toggle group has a CSS rule with the same selectors (hidden on graphs only)", () => {
  for (const [k, sel] of LAYERS) {
    const m = new RegExp(`\\.demo\\.tg-off-${k} \\.tg-graph :is\\((.+)\\) \\{ visibility: hidden; \\}`).exec(css);
    assert.ok(m, `manjka pravilo za ${k}`);
    const want = sel.split(/,\s*(?![^()]*\))/).map((x) => x.trim());
    const got = m[1].split(/,\s*(?![^()]*\))/).map((x) => x.trim()).filter((x) => !x.startsWith(".handle:has"));
    assert.deepEqual(got, want, k);
    if (!["marks", "grid"].includes(k)) assert.ok(m[1].includes(`.handle:has(> .fill-${k})`), `${k}: ročica`);
  }
});

test("every group has a Slovenian name for chips without a legend", () => {
  for (const [k, , v] of LAYERS) assert.ok(SL[k === "grid" ? "sim.layer.grid" : k === "marks" ? "sim.layer.marks" : `sim.color.${k}`], k);
  for (const k of ["sim.layers", "sim.layers.show", "sim.layer.fit"]) assert.ok(SL[k], k);
});

test("chip name from the legend text after a coloured dot", () => {
  assert.equal(legendName(" Sekanta skozi x₀ = 1 in x₀ + h = 2: naklon"), "Sekanta");
  assert.equal(legendName(" Tangenta: ko gre h → 0"), "Tangenta");
  assert.equal(legendName(" F₁ = 12,0 N, "), "F₁");
  assert.equal(legendName(" Obodni kot ∠ACB = 40°"), "Obodni kot");
  assert.equal(legendName(" rezultanta "), "Rezultanta");
  assert.equal(legendName(" večkratniki 3, 6"), "Večkratniki");
  assert.equal(legendName(" f(x). Kratke črtice"), "f(x)");
  // stavki, števila in ena sama črka niso ime
  assert.equal(legendName(" je osnovni graf y = sin x"), "");
  assert.equal(legendName(" Pri ničli lihe stopnje"), "");
  assert.equal(legendName(" s hitrostjo 60 km/h"), "");
  assert.equal(legendName(") in z desne ("), "");
  assert.equal(legendName(" x = 2"), "");
});

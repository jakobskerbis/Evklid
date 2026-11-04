import test from "node:test";
import assert from "node:assert/strict";
import { IKONE, curveIcon, exampleIcon } from "../public/graph/ex-ikone.js";
import { EXAMPLES } from "../public/graph/examples.js";

test("vsak primer grafičnega kalkulatorja ima ikono s svojo krivuljo", () => {
  for (const ex of EXAMPLES) {
    assert.ok(IKONE[ex.label], `ni ikone za ${ex.label}`);
    const svg = exampleIcon(ex, () => "splošna");
    assert.match(svg, /^<svg [^>]*viewBox="0 0 24 24"/);
    assert.ok(/<path d="M|<circle /.test(svg), `prazna ikona za ${ex.label}`);
    assert.doesNotMatch(svg, /NaN|Infinity/);
  }
});

test("krivulja se ob robu pogleda prekine in ostane v okviru 24 × 24", () => {
  const svg = curveIcon({ view: [-4, 4, -2, 2], parts: [{ fn: Math.tan }] });
  const d = svg.match(/<path d="([^"]+)"(?! stroke-width="1")/g).pop();
  assert.ok((d.match(/M/g) || []).length >= 2, "tan ima več vej");
  for (const n of d.match(/-?\d+(\.\d+)?/g).map(Number)) assert.ok(n >= 0 && n <= 24, `${n} zunaj ikone`);
  assert.equal(exampleIcon({ label: "neznan", icon: "x" }, (n) => `ikona:${n}`), "ikona:x");
});

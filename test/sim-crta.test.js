import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

// x̄ kot »x« + kombinirajoča črta (U+0304) se v pisavi aplikacije izriše kot »x‾« (j, 2. 11. 2026).
// V besedilu simulacij (innerHTML) piši ${tex("\\bar{x}")}; dovoljeno je le v oznakah SVG (label),
// gumbih (segmented) in vrednostih, ki jih kit.js izriše s črto nad črko (razred ovl).
test("simulations never put a combining overline into HTML text", () => {
  const dir = new URL("../public/sim/", import.meta.url);
  const bad = [];
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".js"))) {
    readFileSync(new URL(f, dir), "utf8").split("\n").forEach((line, i) => {
      if (!line.includes("̄")) return;
      const rest = line.replace(/op === "z\u0304"/g, "");
      const ok = !rest.includes("\u0304") || /^\s*\/\//.test(line) || /\blabel\(svg,/.test(line) || /segmented\(\{ options: \[[^\]]*\u0304/.test(line);
      if (!ok) bad.push(`${f}:${i + 1}`);
    });
  }
  assert.deepEqual(bad, []);
});

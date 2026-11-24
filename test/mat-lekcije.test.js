// Vseh 758 lekcij brez neoblikovanih delov formul (j, 24. 11. 2026, enoten matematični zapis, faza F0):
// scripts/popis-formul.js izriše vsako lekcijo kot aplikacija (razdelki, drugačne razlage, »Preveri se«) in v vidnem
// besedilu išče napake KaTeX, ukaze LaTeX zunaj formul, osamljene $, x^2 / a_n in sqrt(…) zunaj formul.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";

// Namerne izjeme: lekcija uči, kako enačbo vpišeš v kalkulator (»x^2/16 - y^2/9 = 1«, v narekovajih).
const IZJEME = new Set(["content/lessons/MAT-SS-3/elipsa-hiperbola-parabola.md"]);

test("lekcije: noben matematični zapis ni viden neoblikovan", { timeout: 120000 }, () => {
  const out = execFileSync(process.execPath, ["scripts/popis-formul.js", "--json"], { encoding: "utf8", maxBuffer: 64 << 20 });
  const izid = JSON.parse(out);
  assert.ok(izid.lekcij >= 700, `premalo lekcij: ${izid.lekcij}`);
  const slabe = izid.lekcije.filter((l) => !IZJEME.has(l.datoteka.replace(/\\/g, "/")));
  assert.deepEqual(
    slabe.map((l) => `${l.datoteka}: ${Object.entries(l.najdbe).filter(([, v]) => v.length).map(([k, v]) => `${k} »${v[0]}«`).join("; ")}`),
    [],
  );
});

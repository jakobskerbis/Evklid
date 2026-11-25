// Krog r2 (ocena r1): oblika podaljšane hrbtenjače (olivi, piramidi) in prerez možganov s senčnim režnjem za rezom.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { premik, OLIVA } from "../scripts/atlas/mozgani-deblo-oblika.mjs";

test("r2: deblo – oliva sprednje stransko pod mostom, nad mostom in zadaj brez premika", () => {
  const yMost = -0.045, c = [0, -0.007], r = 0.006;
  const tocka = (th, y) => [c[0] + r * Math.sin(th), y, c[1] + r * Math.cos(th)];
  const oliva = premik(tocka(0.95, yMost - 0.0075), c, yMost);
  assert.ok(Math.abs(oliva - OLIVA) < 0.0003, `oliva ${oliva}`);
  assert.ok(Math.abs(premik(tocka(-0.95, yMost - 0.0075), c, yMost) - oliva) < 1e-9, "simetrično");
  assert.ok(Math.abs(premik(tocka(Math.PI, yMost - 0.0075), c, yMost)) < 1e-5, "zadaj ni premika");
  assert.ok(Math.abs(premik(tocka(0.95, yMost + 0.02), c, yMost)) < 1e-5, "most ostane");
  assert.ok(premik(tocka(0, yMost - 0.01), c, yMost) < 0, "sprednja sredinska brazda");
});

test("r2: možgani – senčni in limbični reženj v prerezu narisana, deblo rožnato sivo", () => {
  const m = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, "..", "public", "3d", "modeli", "organi-3d", "mozgani.json"), "utf8"));
  for (const d of ["senceni", "limbicni"]) assert.ok(!m.pogledi.prerez.skrijMreze.includes(d), d);
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(m.tkiva.deblo.barva.slice(i, i + 2), 16));
  assert.ok(r - b > 40 && r - g > 30, "deblo ni kremno");
});

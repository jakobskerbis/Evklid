// Barvni način 3D modelov (public/3d/barve.js): naravne / učne barve, učna barva dela iz skupine.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { barvniNacin, nastaviBarvniNacin, ucnaBarva } from "../public/3d/barve.js";

test("barvni način brez localStorage: privzeto (OŠ učne), preklop ostane v seji", () => {
  assert.equal(barvniNacin(), "naravne");
  assert.equal(barvniNacin("ucne"), "ucne");
  assert.equal(nastaviBarvniNacin("ucne"), "ucne");
  assert.equal(barvniNacin(), "ucne");
  assert.equal(nastaviBarvniNacin("karkoli"), "naravne");
});

test("učna barva: lastna, nato skupine, nato barva", () => {
  const poId = new Map([["vencne-arterije", { id: "vencne-arterije", ucnaBarva: "#ff2d2d" }]]);
  assert.equal(ucnaBarva({ ucnaBarva: "#111111", barva: "#222222" }, poId), "#111111");
  assert.equal(ucnaBarva({ skupina: "vencne-arterije", barva: "#222222" }, poId), "#ff2d2d");
  assert.equal(ucnaBarva({ barva: "#222222" }, poId), "#222222");
});

test("srce: vsak del ima učno barvo (sam ali prek skupine); arterije rdeče, venska kri modra", () => {
  const p = JSON.parse(fs.readFileSync(new URL("../public/3d/modeli/organi-3d/srce.json", import.meta.url), "utf8"));
  const poId = new Map(p.deli.map((d) => [d.id, d]));
  for (const d of p.deli) assert.match(ucnaBarva(d, poId), /^#[0-9a-f]{6}$/i, d.id);
  const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  for (const id of ["aorta", "vencne-arterije", "pljucne-vene"]) { const [r, , b] = rgb(ucnaBarva(poId.get(id), poId)); assert.ok(r > b * 1.5, id); }
  for (const id of ["votli-veni", "pljucno-deblo", "vencne-vene"]) { const [r, , b] = rgb(ucnaBarva(poId.get(id), poId)); assert.ok(b > r * 1.5, id); }
});

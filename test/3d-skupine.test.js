// Skupine delov 3D modelov (public/3d/skupine.js): vsi deli obstajajo, imena v vseh jezikih, mehko iskanje.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { SKUPINE, najdiSkupino } from "../public/3d/skupine.js";
import sl from "../public/i18n/sl.js";

const koren = new URL("../public/3d/modeli/", import.meta.url);
test("skupine: vsak del obstaja v modelu, ime skupine v sl in vseh jezikih", () => {
  const ui = fs.readdirSync(new URL("../public/i18n/ui/", import.meta.url)).map((f) => JSON.parse(fs.readFileSync(new URL(`../public/i18n/ui/${f}`, import.meta.url), "utf8")));
  for (const [model, skupine] of Object.entries(SKUPINE)) {
    let ids;
    const o = /^organ-(.+)$/.exec(model);
    if (o) ids = new Set(JSON.parse(fs.readFileSync(new URL(`organi-3d/${o[1]}.json`, koren), "utf8")).deli.map((d) => d.id));
    else {
      // datoteka modela po info.id (bakterija.js = celica-bakterijska); deli iz del("…") in { id: "…", ime: … }
      const mapa = new URL("celice/", koren);
      const f = fs.readdirSync(mapa).find((x) => new RegExp(`export const info = \\{\\s*id: "${model}"`).test(fs.readFileSync(new URL(x, mapa), "utf8")));
      assert.ok(f, `model ${model}`);
      const src = fs.readFileSync(new URL(f, mapa), "utf8");
      ids = new Set([...src.matchAll(/del\("([a-z0-9-]+)"/g), ...src.matchAll(/\{ id: "([a-z0-9-]+)", ime:/g)].map((m) => m[1]));
    }
    for (const g of skupine) {
      assert.ok(g.deli.length > 1, `${model}/${g.id}: vsaj dva dela`);
      for (const d of g.deli) assert.ok(ids.has(d), `${model}/${g.id}: ni dela ${d}`);
      assert.ok(sl[`a3.grp.${g.id}`], `a3.grp.${g.id} v sl`);
      for (const j of ui) assert.ok(j[`a3.grp.${g.id}`], `a3.grp.${g.id} v vseh jezikih`);
    }
  }
});

test("skupine: mehko iskanje (sklanjatve, sinonimi), ne ujame imen delov", () => {
  assert.equal(najdiSkupino("organ-srce", "zaklopke"), "zaklopke");
  assert.equal(najdiSkupino("organ-srce", "srčne zaklopke"), "zaklopke");
  assert.equal(najdiSkupino("organ-srce", "prekati"), "prekata");
  assert.equal(najdiSkupino("organ-srce", "venčne žile"), "vencne-zile");
  assert.equal(najdiSkupino("organ-srce", "levi prekat"), null);
  assert.equal(najdiSkupino("celica-zivalska", "organeli"), "organeli");
  assert.equal(najdiSkupino("celica-zivalska", "Membranes", { membrane: ["Membranes"] }), "membrane");
  assert.equal(najdiSkupino("celica-nevron", "mielin"), "ovoj-aksona");
  assert.equal(najdiSkupino("celica-skeletno-misicno-vlakno", "sarkomere"), "sarkomera");
  assert.equal(najdiSkupino("virus-hiv", "encimi"), "encimi");
  assert.equal(najdiSkupino("virus-bakteriofag-t4", "rep faga"), "rep");
});

// Skrivanje sten ob izbiri skupine: vedenje v test/3d-ovoji.test.js (public/3d/ovoji.js).

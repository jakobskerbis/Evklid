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
      const src = fs.readFileSync(new URL(`celice/${model.replace("celica-", "")}.js`, koren), "utf8");
      ids = new Set([...src.matchAll(/del\("([a-z-]+)"/g)].map((m) => m[1]));
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
});

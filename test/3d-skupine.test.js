// Skupine delov 3D modelov (public/3d/skupine.js): vsi deli obstajajo, imena v vseh jezikih, mehko iskanje.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { SKUPINE, najdiSkupino, delPoImenu, zacetnaIzbira } from "../public/3d/skupine.js";
import sl from "../public/i18n/sl-3d.js"; // imena skupin so v izvirniku strani /3d (dodajIzvirnik)

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

// Pregled #461 C P2-1: imena delov od inštruktorja (<<ODPRI 3d="srce" del="…">>) in iz ?del= (skupine.js delPoImenu)
const srce = JSON.parse(fs.readFileSync(new URL("organi-3d/srce.json", koren), "utf8")).deli;
const zivalska = (() => {
  const src = fs.readFileSync(new URL("celice/zivalska.js", koren), "utf8");
  return [...src.matchAll(/del\("([a-z0-9-]+)", "([^"]+)"/g)].map((m) => ({ id: m[1], ime: m[2] }));
})();
test("delPoImenu: sinonimi, osnove besed, ena beseda samo pri enem delu", () => {
  for (const [q, id] of [
    ["mitralna zaklopka", "av-zaklopki"],
    ["trikuspidalna zaklopka", "av-zaklopki"],
    ["tetive", "av-zaklopki"],
    ["sinusni vozel", "prevodni-sistem"],
    ["AV-vozel", "prevodni-sistem"],
    ["leva pljučna arterija", "pljucno-deblo"],
    ["venčna arterija", "vencne-arterije"],
    ["pljučna vena", "pljucne-vene"],
    ["levi prekat", "levi-prekat"],
    ["Ventriculus sinister", "levi-prekat"],
    ["aorta", "aorta"],
    ["vena", null],
    ["arterija", null],
    ["preddvora", null],
    ["prekat", null],
  ]) assert.equal(delPoImenu(srce, q), id, q);
  assert.equal(delPoImenu(zivalska, "celično jedro"), "jedro");
  assert.equal(delPoImenu(zivalska, "membrana"), "membrana");
  assert.equal(delPoImenu([], "x"), null);
});

test("zacetnaIzbira: del pred skupino, id skupine s strežnika, začetek imena", () => {
  assert.equal(zacetnaIzbira("organ-srce", srce, "mitralna zaklopka"), "av-zaklopki");
  assert.equal(zacetnaIzbira("organ-srce", srce, "zaklopke"), "skupina-zaklopke");
  assert.equal(zacetnaIzbira("organ-srce", srce, "skupina-prekata"), "skupina-prekata");
  assert.equal(zacetnaIzbira("organ-srce", srce, "levi-prekat"), "levi-prekat");
  assert.equal(zacetnaIzbira("organ-srce", srce, "Valves", { zaklopke: ["Valves"] }), "skupina-zaklopke");
  assert.equal(zacetnaIzbira("celica-zivalska", zivalska, "celično jedro"), "jedro");
  assert.equal(zacetnaIzbira("organ-srce", srce, "nekaj čisto drugega"), null);
});

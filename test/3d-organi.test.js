// 3D organi: seznam in pogodba (docs/3d.md); GLB preverja test/3d-organi-glb.test.js.
import { test } from "node:test";
import assert from "node:assert/strict";
import { naloziThree, preveriModel } from "./fixtures/3d-modeli.js";
import modeli from "../public/3d/modeli/organi/index.js";

const THREE = await naloziThree();
const URL_ORGANI = new URL("../public/3d/modeli/organi/", import.meta.url);
const nalozi = (pot) => import(new URL(pot, URL_ORGANI));

test("3d organi: seznam", () => {
  const ids = modeli.map((e) => e.id);
  assert.equal(new Set(ids).size, ids.length, "podvojen id");
  for (const e of modeli) {
    assert.match(e.id, /^organ-[a-z0-9-]+$/);
    assert.equal(e.predmet, "BIO");
    assert.ok(e.naslov && e.pot.startsWith("./"));
  }
});

for (const e of modeli) {
  test(`3d organi: ${e.id}`, { skip: !THREE && "three ni nameščen" }, async () => {
    const mod = await nalozi(e.pot);
    assert.equal(mod.info.id, e.id);
    assert.equal(mod.info.naslov, e.naslov);
    if (typeof mod.organ === "string" || mod.izDatotek) return; // organ iz GLB: test/3d-organi-glb.test.js; iz datotek: test/3d-rezine.test.js
    preveriModel(THREE, mod, "organi");
  });
}

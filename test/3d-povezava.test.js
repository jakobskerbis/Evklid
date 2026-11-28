// Izpad povezave na strani /3d (j 25. 11. 2026, posnetek »Ta 3D prikaz ne obstaja« med objavo): neuspel seznam se
// ne zapomni, model, ki ga ni zaradi povezave, vrže napako povezava (stran pokaže »Ni povezave«), pravi neobstoječ
// model pa vrne null.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("seznam modelov: neuspel prenos ni zapomnjen, model zaradi povezave ni »neobstoječ«", async () => {
  const realFetch = globalThis.fetch;
  let klicev = 0;
  let deluje = false;
  globalThis.fetch = async () => {
    klicev++;
    if (!deluje) throw new TypeError("Failed to fetch");
    return new Response(JSON.stringify({ datoteke: {}, podrocja: [] }), { status: 200, headers: { "Content-Type": "application/json" } });
  };
  try {
    const m = await import("../public/3d/modeli.js?v=povezava");
    const a = await m.seznamDatotek();
    assert.equal(a.napaka, true);
    await assert.rejects(m.naloziModel("celica-bakterijska"), (e) => e.povezava === true);
    deluje = true;
    const b = await m.seznamDatotek();
    assert.ok(!b.napaka, "naslednji klic poskusi znova");
    assert.ok(klicev >= 2);
    assert.equal(await m.naloziModel("ni-takega"), null, "pravi manjkajoč model ostane null");
  } finally {
    globalThis.fetch = realFetch;
  }
  const stran = fs.readFileSync(new URL("../public/3d/stran.js", import.meta.url), "utf8");
  assert.match(stran, /if \(e\?\.povezava\) \{\s*niPovezave\(moj\);/);
  const SL = (await import("../public/i18n/sl.js")).default;
  assert.ok(SL["a3.noConnection"] && SL["a3.retry"]);
});

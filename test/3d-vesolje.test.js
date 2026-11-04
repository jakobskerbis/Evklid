import test from "node:test";
import assert from "node:assert/strict";
import { preveriPodrocje } from "./3d-preveri-gradnik.js";

// Every vesolje model follows the builder contract (docs/3d.md): info, parts with ime + opis,
// controls at every extreme, triangle and draw-call budgets, fits the unit sphere.
test("3D vesolje: gradniki po pogodbi in v proračunu", async () => {
  const { seznam, izid } = await preveriPodrocje("vesolje");
  assert.ok(seznam.length > 0);
  assert.equal(new Set(seznam.map((e) => e.id)).size, seznam.length, "id-ji niso enolični");
  for (const { e, mod, napake } of izid) {
    assert.deepEqual(napake, [], e.id);
    assert.equal(mod.info.podrocje, "vesolje", e.id);
    assert.equal(mod.info.naslov, e.naslov, e.id);
    assert.equal(mod.info.predmet, e.predmet, e.id);
  }
});

// Raven delov 3D modelov po profilu (public/3d/raven.js): OŠ 1, SŠ 2, študij 3, brez profila 2.
import { test } from "node:test";
import assert from "node:assert/strict";
import { nastaviVirRavni, ravenProfila, naRavni } from "../public/3d/raven.js";

test("raven profila iz stopnje", () => {
  nastaviVirRavni(() => null);
  assert.equal(ravenProfila(), 2);
  nastaviVirRavni(() => ({ educational_track: "OSNOVNA_SOLA" }));
  assert.equal(ravenProfila(), 1);
  nastaviVirRavni(() => ({ educational_track: "SREDNJA_SOLA" }));
  assert.equal(ravenProfila(), 2);
  nastaviVirRavni(() => ({ educational_track: "UNIVERZA" }));
  assert.equal(ravenProfila(), 3);
  nastaviVirRavni(() => {
    throw new Error("x");
  });
  assert.equal(ravenProfila(), 2);
});

test("del na ravni", () => {
  assert.equal(naRavni({}, 1), true);
  assert.equal(naRavni({ raven: 3 }, 2), false);
  assert.equal(naRavni({ raven: 2 }, 2), true);
});

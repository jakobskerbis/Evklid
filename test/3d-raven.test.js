// Raven razlage 3D modelov po profilu (public/3d/raven.js): OŠ 1, SŠ 2, študij 3, brez profila 2; deli vedno vsi.
import { test } from "node:test";
import assert from "node:assert/strict";
import { nastaviVirRavni, ravenProfila, razlaga, imaRavni } from "../public/3d/raven.js";

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

test("razlaga po ravni: OŠ preprosto (latinsko v »Več o tem«), SŠ z latinskim, študij vse", () => {
  const d = { ime: "Levi prekat", la: "Ventriculus sinister", opisOs: "Najmočnejši del srca.", opis: "Stisne kri v aorto.", opisStudij: "Stena 10–15 mm." };
  assert.deepEqual(razlaga(d, 1), { opis: "Najmočnejši del srca.", la: null, vec: "Ventriculus sinister · Stisne kri v aorto. Stena 10–15 mm." });
  assert.deepEqual(razlaga(d, 2), { opis: "Stisne kri v aorto.", la: "Ventriculus sinister", vec: "Stena 10–15 mm." });
  assert.deepEqual(razlaga(d, 3), { opis: "Stisne kri v aorto. Stena 10–15 mm.", la: "Ventriculus sinister", vec: null });
  assert.equal(razlaga({ opis: "Samo to." }, 1).opis, "Samo to.");
  assert.equal(imaRavni([{ opis: "x" }]), false);
  assert.equal(imaRavni([{ opis: "x", opisOs: "y" }]), true);
});

test("okvir 3D v »Uči se« dobi raven profila (ločen dokument brez profila)", async () => {
  const fs = await import("node:fs");
  const src = fs.readFileSync(new URL("../public/uci-se.js", import.meta.url), "utf8");
  assert.match(src, /import \{ ravenProfila \} from "\.\/3d\/raven\.js"/);
  assert.match(src, /\/3d\?vgrajeno=1&raven=\$\{ravenProfila\(\)\}/);
});

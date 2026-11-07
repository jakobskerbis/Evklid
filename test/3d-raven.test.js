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

test("vsi organi: vsak del ima razlago za OŠ, SŠ in študij (deli se po ravni ne skrivajo)", async () => {
  const fs = await import("node:fs");
  const mapa = new URL("../public/3d/modeli/organi-3d/", import.meta.url);
  const organi = fs.readdirSync(mapa).filter((f) => f.endsWith(".json") && !f.includes("vozlisca"));
  assert.ok(organi.length >= 6);
  for (const f of organi) {
    const p = JSON.parse(fs.readFileSync(new URL(f, mapa), "utf8"));
    if (!p.deli?.length) continue;
    assert.ok(imaRavni(p.deli), f);
    for (const d of p.deli) {
      assert.ok(d.opisOs && d.opis && d.opisStudij, `${f}: ${d.id}`);
      assert.ok(d.opisOs.length <= d.opis.length + 40, `${f}: ${d.id} OŠ naj bo kratko`);
    }
  }
});

test("atlas: vsi deli vidni na vseh ravneh, raven iz profila, razlaga in barvni način iz skupnih modulov", async () => {
  const fs = await import("node:fs");
  const src = fs.readFileSync(new URL("../public/3d/atlas.js", import.meta.url), "utf8");
  assert.doesNotMatch(src, /r\.raven > raven/);
  assert.match(src, /let raven = ravenProfila\(\)/);
  assert.match(src, /razlaga\(/);
  assert.match(src, /nastaviBarvniNacin\(/);
  assert.match(src, /a3\.levelUni/);
});

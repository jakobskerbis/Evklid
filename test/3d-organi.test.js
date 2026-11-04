// 3D organi iz kode: pogodba, proračun in znanstvene preverbe (docs/3d.md).
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
    preveriModel(THREE, mod, "organi");
  });
}

test("3d organi: uho v pravih merah", async () => {
  const { MERE } = await nalozi("./uho.js");
  assert.equal(MERE.zavojiPolzka, 2.75, "polžek ima 2¾ zavoja");
  assert.ok(MERE.sluhovod >= 23 && MERE.sluhovod <= 27, "sluhovod ≈ 2,5 cm");
  assert.ok(MERE.stremence > 2.5 && MERE.stremence < 4, "stremence ≈ 3 mm, najmanjša kost");
  assert.ok(MERE.evstahijevaCev >= 31 && MERE.evstahijevaCev <= 38, "Evstahijeva cev ≈ 3,5 cm");
});

test("3d organi: plasti kože", async () => {
  const { PLASTI } = await nalozi("./koza.js");
  assert.ok(PLASTI.povrhnjica >= 0.05 && PLASTI.povrhnjica <= 0.2, "povrhnjica je tanjša od 0,2 mm (razen dlani in podplatov)");
  assert.ok(PLASTI.rozevinasta < PLASTI.povrhnjica, "roževinasta plast je del povrhnjice");
  assert.ok(PLASTI.usnjica >= 1 && PLASTI.usnjica <= 3, "usnjica 1–3 mm");
  assert.ok(PLASTI.usnjica > 5 * PLASTI.povrhnjica, "usnjica je mnogo debelejša od povrhnjice");
});

test("3d organi: stegnenica in osteon", async () => {
  const { MERE } = await nalozi("./kost.js");
  assert.ok(MERE.dolzina >= 40 && MERE.dolzina <= 50, "stegnenica ≈ 43 cm, najdaljša kost");
  assert.ok(MERE.kotVratu >= 120 && MERE.kotVratu <= 135, "kot med vratom in telesom ≈ 125°");
  assert.ok(MERE.osteon >= 0.1 && MERE.osteon <= 0.4, "osteon ≈ 0,2 mm");
});

test("3d organi: drsenje filamentov v sarkomeri", async () => {
  const { SARKOMERA, dolzinaSarkomere, pasovi } = await nalozi("./misica-zgradba.js");
  assert.equal(SARKOMERA.debeli, 1.6, "miozinski filament 1,6 µm");
  assert.ok(SARKOMERA.tanki >= 0.95 && SARKOMERA.tanki <= 1.1, "aktinski filament ≈ 1 µm");
  assert.equal(dolzinaSarkomere(0), SARKOMERA.Lsprosceno);
  assert.equal(dolzinaSarkomere(1), SARKOMERA.Lskrceno);
  let prej = null;
  for (let k = 0; k <= 1.0001; k += 0.125) {
    const L = dolzinaSarkomere(k), p = pasovi(L);
    // Pas A (dolžina miozina) ostane enak, pas I in območje H se krajšata (Huxley in Hanson 1954).
    assert.equal(p.A, SARKOMERA.debeli);
    assert.ok(Math.abs(p.A + p.I - L) < 1e-9, "A + I = dolžina sarkomere");
    assert.ok(p.H >= 0 && p.H <= p.A);
    // Tanki filament se ne skrajša: od Z-črte seže do roba območja H.
    assert.ok(Math.abs((L - p.H) / 2 - SARKOMERA.tanki) < 1e-9 || p.H === 0, "dolžina aktina je stalna");
    if (prej) {
      assert.ok(L < prej.L && p.I < prej.p.I && p.H <= prej.p.H, "ob krčenju se skrajšajo sarkomera, pas I in območje H");
      assert.ok(p.prekrivanje >= prej.p.prekrivanje, "prekrivanje filamentov se poveča");
    }
    prej = { L, p };
  }
});

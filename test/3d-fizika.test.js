// 3D modeli fizike: pogodba, proračun in znanstvene preverbe (docs/3d.md).
import { test } from "node:test";
import { naloziThree, preveriModel } from "./fixtures/3d-modeli.js";
import modeli from "../public/3d/modeli/fizika/index.js";

const THREE = await naloziThree();

for (const e of modeli) {
  test(`3d fizika: ${e.id}`, { skip: !THREE && "three ni nameščen" }, async () => {
    const mod = await import(new URL(e.pot, new URL("../public/3d/modeli/fizika/", import.meta.url)));
    if (mod.info.id !== e.id) throw new Error(`id ${mod.info.id} ≠ ${e.id}`);
    preveriModel(THREE, mod, "fizika");
  });
}

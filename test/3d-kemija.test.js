// 3D modeli kemije: pogodba, proračun in znanstvene preverbe (docs/3d.md).
import { test } from "node:test";
import { naloziThree, preveriModel } from "./fixtures/3d-modeli.js";
import modeli from "../public/3d/modeli/kemija/index.js";

const THREE = await naloziThree();

for (const e of modeli) {
  test(`3d kemija: ${e.id}`, { skip: !THREE && "three ni nameščen" }, async () => {
    const mod = await import(new URL(e.pot, new URL("../public/3d/modeli/kemija/", import.meta.url)));
    if (mod.info.id !== e.id) throw new Error(`id ${mod.info.id} ≠ ${e.id}`);
    preveriModel(THREE, mod, "kemija");
  });
}

// Teme v učbeniku (public/sim/katalog.js), ki odprejo 3D model kemije ali fizike: model obstaja,
// začetne vrednosti ustrezajo kontrolam modela in model se z njimi zgradi.
test("3d kemija in fizika: vnosi v katalogu simulacij", { skip: !THREE && "three ni nameščen" }, async () => {
  const { SIM_TOPICS } = await import("../public/sim/katalog.js");
  const fizika = (await import("../public/3d/modeli/fizika/index.js")).default;
  const poti = new Map([...modeli.map((e) => [e.id, `kemija/${e.pot.slice(2)}`]), ...fizika.map((e) => [e.id, `fizika/${e.pot.slice(2)}`])]);
  let n = 0;
  for (const [tema, v] of Object.entries(SIM_TOPICS)) {
    const vnosi = Array.isArray(v[0]) ? v : [v];
    for (const [id, naslov, opts = {}] of vnosi) {
      const m3 = /^3d-(.+)$/.exec(id);
      if (!m3 || !poti.has(m3[1])) continue;
      n++;
      if (!naslov) throw new Error(`${tema}: ${id} brez naslova`);
      const mod = await import(new URL(`../public/3d/modeli/${poti.get(m3[1])}`, import.meta.url));
      const zacetek = opts.zacetek || {};
      const m = mod.zgradi(THREE, { kakovost: "nizka", gibanje: false, zacetek });
      for (const [k, val] of Object.entries(zacetek)) {
        const c = (m.nadzor || []).find((x) => x.id === k);
        if (!c) throw new Error(`${tema}: ${id} nima kontrole ${k}`);
        if (c.tip === "izbira" && !c.moznosti.some((o) => o[0] === val)) throw new Error(`${tema}: ${id} ${k}=${val} ni med možnostmi`);
        if (c.tip === "drsnik" && !(val >= c.min && val <= c.max)) throw new Error(`${tema}: ${id} ${k}=${val} izven ${c.min}–${c.max}`);
        c.ob(val);
      }
      if (!m.deli.length) throw new Error(`${tema}: ${id} brez delov`);
    }
  }
  if (n < 20) throw new Error(`premalo 3D vnosov v katalogu: ${n}`);
});

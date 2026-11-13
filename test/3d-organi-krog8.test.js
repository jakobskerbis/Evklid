// Srce in oko, krog 8: plasti na rezni ploskvi srca (predznačena razdalja do stene + epikard/endokard), notranji
// deli, ki so gledali skozi steno (potopiVidne), ustje spodnje votle vene v steni preddvora (kavaVSteno), sploščena
// papila očesa (sploscPapilo) in ključi v JSON/senčilniku (rezPlasti, zrcalo, limbus, konec, ucnaBarva).
// Zagon: node --test test/3d-organi-krog8.test.js

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as G from "../scripts/atlas/zile-mreza.mjs";
import { delezStene, razdaljaStene, epikardniTrikotniki } from "../scripts/atlas/rez-stena.mjs";
import { povrsinaSten, potopiVidne, kavaVSteno, VGREZ_KAVA } from "../scripts/atlas/srce-dodelava.mjs";
import { sploscPapilo, LIMBUS } from "../scripts/atlas/oko-dodelava.mjs";

const KOREN = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const beri = (...p) => fs.readFileSync(path.join(KOREN, ...p), "utf8");

const V = (a, b) => [[a, a, a], [b, a, a], [b, b, a], [a, b, a], [a, a, b], [b, a, b], [b, b, b], [a, b, b]];
const F = [[0, 2, 1], [0, 3, 2], [4, 5, 6], [4, 6, 7], [0, 1, 5], [0, 5, 4], [2, 3, 7], [2, 7, 6], [1, 2, 6], [1, 6, 5], [3, 0, 4], [3, 4, 7]];
// kocka [a, b]³ kot trikotniki (9 koordinat), normale navzven; obrni = normale navznoter (stena votline)
function kocka(a, b, obrni = false) {
  return Float64Array.from(F.flatMap(([i, j, k]) => (obrni ? [i, k, j] : [i, j, k]).flatMap((x) => V(a, b)[x])));
}
// ista kocka kot mreža za G (P, F, zvar, W)
function mrezaKocke(a, b, obrni = false) {
  return G.zvari({ P: V(a, b).flat(), F: F.flatMap(([i, j, k]) => (obrni ? [i, k, j] : [i, j, k])), A: new Map() });
}
const mrezaTock = (tocke) => G.zvari({ P: tocke.flat(), F: [0, 1, 2], A: new Map() });

test("rez-stena: predznačena razdalja do stene in stran (epikard / stena votline)", () => {
  const mm = 0.001; // žarek epikardnega preizkusa seže 1 m: kocke v milimetrih
  const zun = kocka(1 * mm, 9 * mm), notr = kocka(3 * mm, 7 * mm, true);
  const tri = new Float64Array(zun.length + notr.length);
  tri.set(zun); tri.set(notr, zun.length);
  const ep = epikardniTrikotniki(tri);
  assert.deepEqual([...ep.slice(0, 12)], Array(12).fill(1), "zunanja kocka je epikard");
  assert.deepEqual([...ep.slice(12)], Array(12).fill(0), "notranja kocka je stena votline");
  const n = [10, 10, 10], mreza = { lo: [0, 0, 0], korak: mm, n };
  const { delez } = delezStene(tri, mreza);
  const { razdalja, epi } = razdaljaStene(tri, mreza, delez, 3 * mm, ep);
  const v = (x, y, z) => (z * n[1] + y) * n[0] + x;
  assert.ok(Math.abs(razdalja[v(2, 5, 5)] - 0.5 * mm) < 1e-8 && epi[v(2, 5, 5)] === 0, "0,5 od endokarda");
  assert.ok(Math.abs(razdalja[v(1, 5, 5)] - 0.5 * mm) < 1e-8 && epi[v(1, 5, 5)] === 1, "0,5 od epikarda");
  assert.ok(Math.abs(razdalja[v(5, 5, 5)] + 1.5 * mm) < 1e-8, "votlina: negativno");
});

test("srce-dodelava: potopiVidne potisne pod epikard samo, kar gleda ven; kavaVSteno odreže konec žile v votlini", () => {
  // votla kocka: zunaj [0, 40] mm (epikard), votlina [10, 30] mm (endokard)
  const sten = povrsinaSten([mrezaKocke(0, 0.04), mrezaKocke(0.01, 0.03, true)], ["Right atrium", "Right atrium"]);
  assert.equal(sten.zunanji.slice(0, 12).reduce((a, b) => a + b, 0), 12);
  assert.equal(sten.zunanji.slice(12).reduce((a, b) => a + b, 0), 0);
  const del = mrezaTock([[0.0405, 0.02, 0.02], [0.02, 0.02, 0.02], [0.039, 0.02, 0.021]]);
  assert.equal(potopiVidne(del, sten), 1, "samo zunanje (pod epikardom ga stena že pokrije)");
  assert.ok(Math.abs(del.W[0][0] - 0.0385) < 1e-9, "1,5 mm pod epikardom");
  assert.deepEqual(del.W[1], [0.02, 0.02, 0.02], "v votlini nespremenjeno");
  assert.deepEqual(del.W[2], [0.039, 0.02, 0.021], "v steni nespremenjeno");
  assert.equal(potopiVidne(del, sten), 0, "ponovljivo");
  // trikotnik z dvema ogliščema v votlini (x = 12 mm) in enim v steni (7 mm) se odstrani; tisti v steni ostane
  const zila = G.zvari({ P: [0.012, 0.02, 0.02, 0.007, 0.02, 0.02, 0.012, 0.021, 0.02, 0.007, 0.02, 0.02, 0.007, 0.021, 0.02, 0.012, 0.021, 0.02], F: [0, 1, 2, 3, 4, 5], A: new Map() });
  assert.equal(kavaVSteno(zila, sten), 1);
  assert.deepEqual(zila.F, [3, 4, 5], "v steni ostane");
  assert.equal(kavaVSteno(zila, sten), 0, "ponovljivo");
  assert.ok(VGREZ_KAVA > 0 && VGREZ_KAVA < 0.001);
  assert.equal(kavaVSteno(mrezaTock([[0.012, 0.02, 0.02], [0.012, 0.021, 0.02], [0.012, 0.02, 0.021]]), sten, /^Left atrium$/), 0, "drug lastnik");
});

test("oko-dodelava: papila se splošči v ravnino mrežnice (nič ne štrli v steklovino)", () => {
  const mrez = { P: [0.011, -0.005, -0.005, 0.011, 0.005, -0.005, 0.011, 0.005, 0.005, 0.011, -0.005, 0.005], F: [0, 1, 2, 0, 2, 3] };
  const mp = G.zvari({ P: [0.0105, 0, 0, 0.0113, 0.001, 0, 0.0105, 0, 0.001], F: [0, 1, 2], A: new Map() });
  const o = sploscPapilo(mp, mrez, [0, 0, 0]);
  assert.equal(o.premaknjenih, 2);
  assert.ok(Math.abs(mp.W[0][0] - 0.01098) < 1e-9);
  assert.deepEqual(mp.W[1], [0.0113, 0.001, 0], "za mrežnico ostane");
  assert.ok(LIMBUS > 0.0055 && LIMBUS < 0.0062, "roženica Ø ≈ 11–12 mm");
});

test("srce.json, oko.json, organ.js: plasti reza, limbus, prerez živca, učne barve", () => {
  const s = JSON.parse(beri("public", "3d", "modeli", "organi-3d", "srce.json"));
  const pl = s.tkiva.miokard.rezPlasti;
  assert.ok(pl.endo.sirina < 0.0005 && pl.epi && pl.subendo, "tanek endokard, epikard, subendokardni pas");
  assert.ok(s.prerez.volumen.stena?.sdf > 0, "rez-stena zapiše sdf");
  assert.ok(s.tkiva.miokard.lak < 0.45 && s.tkiva.uho.lak < 0.45, "brez mokre omejitve (bel rob obrisa)");
  assert.notEqual(s.deli.find((d) => d.id === "levo-srcno-uho").ucnaBarva, "#f7a08f", "levo uho ni kožno rožnato");
  const o = JSON.parse(beri("public", "3d", "modeli", "organi-3d", "oko.json"));
  assert.ok(o.tkiva["roženica"].limbus?.r1 > o.tkiva["roženica"].limbus?.r0);
  assert.ok(o.tkiva["živec"].konec?.polmer > 0);
  const js = beri("public", "3d", "organ.js");
  assert.match(js, /function limbusGLSL\(/);
  assert.match(js, /function konecGLSL\(/);
  assert.match(js, /t\.rezPlasti/);
  assert.match(js, /o\.ucnaProsojnost|ucnaProsojnost/);
});

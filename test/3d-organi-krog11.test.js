// Oko krog 11 in srce krog 10: živec skozi kanal beločnice (polmerZivca, gosta os), reže med lupinami zrkla
// (zapriRezo), kite brez stopnice (oko_misice), učne barve (ucnaRob, ucnaGladko), kita brez temnega obrisa (kita.aoMoc),
// prerezan živec brez osrednjih žil na koncu; srce: venčne arterije vgreznjene in zožene, lističi v vlaknati barvi,
// pernata maščoba, velike žile brez šivov žilic.
// Zagon: node --test test/3d-organi-krog11.test.js

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as G from "../scripts/atlas/zile-mreza.mjs";
import { polmerZivca, cev, osZivca, zapriRezo, POLMER, ZAC_ZIVCA, PREKRIVANJE } from "../scripts/atlas/oko-dodelava.mjs";
import { VGREZ } from "../scripts/atlas/srce-dodelava.mjs";

const KOREN = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const beri = (...p) => fs.readFileSync(path.join(KOREN, ...p), "utf8");
const json = (ime) => JSON.parse(beri("public", "3d", "modeli", "organi-3d", ime));

// krogla (UV) polmera r okoli izhodišča kot mreža za zapriRezo (P, F, A, zvar, W)
function krogla(r, n = 16) {
  const P = [], F = [];
  for (let i = 0; i <= n; i++) for (let j = 0; j < 2 * n; j++) {
    const t = (Math.PI * i) / n, f = (Math.PI * j) / n;
    P.push(r * Math.sin(t) * Math.cos(f), r * Math.sin(t) * Math.sin(f), r * Math.cos(t));
  }
  const id = (i, j) => i * 2 * n + (j % (2 * n));
  for (let i = 0; i < n; i++) for (let j = 0; j < 2 * n; j++) F.push(id(i, j), id(i + 1, j), id(i + 1, j + 1), id(i, j), id(i + 1, j + 1), id(i, j + 1));
  return G.zvari({ P, F, A: new Map(), spremenjeno: false });
}
const polmeri = (m) => m.W.map((p) => Math.hypot(...p));
// debela lupina (beločnica): notranja in zunanja krogla v eni mreži
function lupina(r0, r1) {
  const a = krogla(r0, 21), b = krogla(r1, 21), k = a.P.length / 3; // drugačna mreža kot notranja: žarki ne zadenejo oglišč
  return G.zvari({ P: [...a.P, ...b.P], F: [...a.F, ...b.F.map((i) => i + k)], A: new Map(), spremenjeno: false });
}

test("oko-dodelava: živec je v kanalu beločnice ožji in se za njo razširi na POLMER", () => {
  assert.ok(Math.abs(polmerZivca(0) - 0.00125) < 1e-6, "ob mrežnici zapolni njeno odprtino");
  assert.ok(Math.abs(polmerZivca(0.001) - 0.00095) < 1e-6, "v kanalu (lamina cribrosa) 1,9 mm");
  assert.ok(Math.abs(polmerZivca(0.01) - POLMER) < 1e-9, "za beločnico 3,5 mm z ovojnicami");
  assert.ok(ZAC_ZIVCA > 0 && ZAC_ZIVCA < 0.0006, "začetek tik za mrežnico, ne v steklovini");
  const os = osZivca([0, 0, 0.012], [0, 0, 0], [0.005, 0.01, 0.04], 20);
  assert.ok(G.v3.dist(os[0], os[1]) < 0.0003, "prvi del osi gosto vzorčen (polmer sledi kanalu)");
  const c = cev(os, polmerZivca, 8);
  const r0 = G.v3.dist(c.P[0], os[0]), rk = G.v3.dist(c.P[(os.length - 1) * 8], os[os.length - 1]);
  assert.ok(Math.abs(r0 - 0.00125) < 1e-6 && Math.abs(rk - POLMER) < 1e-6, `polmer po osi (${r0}, ${rk})`);
});

test("oko-dodelava: zapriRezo primakne notranjo lupino k zunanji, lupine že v zunanji ne premakne", () => {
  const zun = lupina(0.012, 0.013), notr = krogla(0.0115);
  const st = zapriRezo(notr, zun, [0, 0, 0]);
  assert.ok(st > 0);
  const ok = polmeri(notr).filter((r) => r < 0.012 && r > 0.012 - 0.0001).length; // facete krogle: ≤ 0,04 mm pod polmerom
  assert.ok(ok >= 0.9 * notr.W.length, `reža zaprta (${ok} od ${notr.W.length} oglišč)`);
  assert.ok(PREKRIVANJE < 0, "tanka notranja lupina ostane pred zunanjo (se ne skrije za njo)");
  const vZun = krogla(0.0122);
  assert.equal(zapriRezo(vZun, lupina(0.012, 0.013), [0, 0, 0]), 0, "oglišča že v zunanji lupini ostanejo");
  const daleč = krogla(0.008);
  assert.equal(zapriRezo(daleč, lupina(0.012, 0.013), [0, 0, 0]), 0, "reže nad NAJVEC_REZE ni (druga plast, ne reža)");
  // ovira: notranja lupina ne gre čez oviro, ki je pred zunanjo
  const n2 = krogla(0.0110);
  const sOv = zapriRezo(n2, lupina(0.012, 0.013), [0, 0, 0], { ovira: krogla(0.0115, 21) });
  assert.ok(sOv <= 0.02 * n2.W.length, `ovira: premaknjenih ${sOv} (posamezni žarek skozi oglišče ovire jo zgreši)`);
});

test("oko: kite brez stopnice, učne barve, prerezan živec, mrežnične arkade", () => {
  const m = beri("scripts", "atlas", "oko_misice.py");
  const st = (k) => Number(m.match(new RegExp(`^${k} = ([-\\d.]+)`, "m"))[1]);
  assert.ok(st("KITA_ODMIK") <= 0.00015 && st("ROB_ODMIK") < 0 && st("GLAJENJE_ODMIKA") >= 4, "kita nizka, rob pod beločnico, gladek prehod");
  const o = json("oko.json");
  assert.deepEqual(o.tkiva["roženica"].ucnaRob.length, 2);
  assert.ok(o.tkiva["roženica"].ucnaRob[0] < 0.1, "sredina roženice v učnih barvah skoraj prozorna (zenica črna)");
  assert.equal(o.tkiva["šarenica"].ucnaGladko, true);
  assert.equal(o.pogledi.celota.tkiva["roženica"], undefined, "brez enakomerne prosojne plasti čez zenico");
  assert.ok(o.tkiva["mišica"].kita.aoMoc > 0, "kita brez temnega obrisa senčenja");
  assert.ok(o.tkiva["živec"].rezSnopi?.os?.length === 3 && o.tkiva["živec"].rezZamik < 0, "rez živca: snopiči, pokrov pred beločnico");
  assert.ok(o.tkiva["mrežnica"].mreznicaZile.zil >= 8);
  assert.ok(o.pogledi.celota.okvir.polmer >= 0.8, "pogled od zadaj ne odreže mišic");
  const js = beri("public", "3d", "organ.js");
  for (const k of ["ucnaRob", "ucnaGladko", "kita?.aoMoc", "t.rezSnopi", "t.rezZamik", "z.arkade"]) assert.ok(js.includes(k), k);
  assert.ok(!/osrednja arterija \(rdeča\)/.test(js), "konec živca pri vidnem kanalu brez osrednje arterije in vene");
});

test("srce: venčne arterije vgreznjene in zožene, lističi vlaknati, pernata maščoba", () => {
  assert.ok(VGREZ < 0, "os venčne arterije pod površino (napol v maščobi)");
  const z = beri("scripts", "atlas", "srce_zile.py");
  const zoz = Number(z.match(/^VENCNA_ZOZITEV = ([\d.]+)/m)[1]);
  assert.ok(zoz > 0.2 && zoz < 0.7, "veje se proti koncu zožijo");
  const s = json("srce.json").tkiva;
  const sat = (h) => { const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); return (Math.max(...c) - Math.min(...c)) / Math.max(...c); };
  assert.ok(sat(s.zaklopka.barva) > 0.15 && s.zaklopka.prosojnost >= 0.85 && s.zaklopka.rob <= 0.15, "lističi bledo rumeno rožnati, rahlo prosojni, brez belega obrisa");
  assert.ok(parseInt(s["vencna-arterija"].barva.slice(1, 3), 16) < 0xc0, "venčna arterija temnejša");
  const pk = beri("scripts", "atlas", "peka.py"), iz = beri("scripts", "atlas", "izvozi-organe.py");
  assert.ok(pk.includes('r.get("mascaSum"') && pk.includes('r.get("mascaMeja"'));
  assert.match(iz, /mascaMeja=\(0\.05, 0\.8\), mascaSum=0\.\d+/);
});

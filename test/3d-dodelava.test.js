// Orodja dodelave organov (scripts/atlas): predznačena razdalja do stene za pokrov reza (rez-stena.mjs) in čiščenje
// osirotelih dostopnikov GLB (zile-mreza.mjs brezSirot). Dodelave iz PR #783 (ledvična vena, pljuča, živec s krpo UV)
// so bile za njegove GLB in jih z novimi organi ni več (docs/3d.md »Viewer additions from PR #783«).
import { test } from "node:test";
import assert from "node:assert/strict";
import { razdaljaStene, delezStene } from "../scripts/atlas/rez-stena.mjs";
import * as G from "../scripts/atlas/zile-mreza.mjs";

// kocka s stranico a okoli izhodišča: 12 trikotnikov, navitih navzven
function kocka(a) {
  const h = a / 2;
  const V = [[-h, -h, -h], [h, -h, -h], [h, h, -h], [-h, h, -h], [-h, -h, h], [h, -h, h], [h, h, h], [-h, h, h]];
  const F = [[0, 2, 1], [0, 3, 2], [4, 5, 6], [4, 6, 7], [0, 1, 5], [0, 5, 4], [2, 3, 7], [2, 7, 6], [1, 2, 6], [1, 6, 5], [0, 4, 7], [0, 7, 3]];
  return new Float64Array(F.flatMap((f) => f.flatMap((i) => V[i])));
}

test("rez-stena: razdalja do ploskve je linearna, pozitivna v steni in omejena na ±D", () => {
  const tri = kocka(0.0105); // stena kocke pri ±5,25 mm: med središči vokslov
  const mreza = { lo: [-0.01, -0.01, -0.01], korak: 0.001, n: [20, 20, 20] };
  const D = 0.003;
  const { razdalja } = razdaljaStene(tri, mreza, delezStene(tri, mreza).delez, D);
  const v = (i, j, k) => razdalja[(k * 20 + j) * 20 + i];
  // središče voksla i je pri x = −10 + i + 0,5 mm; stena pri x = +5,25 mm → i = 14: 0,75 mm znotraj, i = 15: 0,25 mm zunaj
  assert.ok(Math.abs(v(14, 10, 10) - 0.00075) < 1e-5);
  assert.ok(Math.abs(v(15, 10, 10) + 0.00025) < 1e-5);
  assert.ok(Math.abs(v(10, 10, 10) - D) < 1e-7, "globoko v tkivu: omejeno na D");
  assert.ok(Math.abs(v(1, 1, 1) + D) < 1e-7, "daleč zunaj: −D");
});

test("zile-mreza: brezSirot odstrani dostopnike brez starša", async () => {
  const { Document } = await import("@gltf-transform/core");
  const doc = new Document();
  const b = doc.createBuffer();
  const a1 = doc.createAccessor().setType("SCALAR").setArray(new Float32Array([1])).setBuffer(b);
  doc.createAccessor().setType("SCALAR").setArray(new Float32Array([2])).setBuffer(b);
  doc.createMesh().addPrimitive(doc.createPrimitive().setAttribute("POSITION", a1));
  assert.equal(G.brezSirot(doc), 1);
  assert.equal(doc.getRoot().listAccessors().length, 1);
});

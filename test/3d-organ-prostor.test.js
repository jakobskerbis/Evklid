// Prostor organa (public/3d/organ-prostor.js): mere iz JSON organa (ravnine prereza, točke, okvir) so v metrih v
// koordinatah GLB. Model se ob nalaganju prestavi v središče svoje škatle; če naknadna obdelava mreže škatlo premakne
// (dograjen aortni lok je središče srca premaknil za 5,5 mm v globino), se rez ne sme premakniti z njo.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { MeshoptDecoder } from "meshoptimizer";
import { prostorOrgana } from "../public/3d/organ-prostor.js";

const KOREN = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const ORGANI = path.join(KOREN, "public", "3d", "modeli", "organi-3d");

test("prostor organa: ravnina in točka v metrih GLB sta neodvisni od središča škatle in polmera", () => {
  const n = [0.2, -0.3, -1], d = 0.004;
  const l = Math.hypot(...n);
  const tocke = [[0.01, 0.02, -0.03], [0, 0, 0.004], [-0.05, 0.08, 0.02]];
  for (const [c, r] of [[[0, 0, 0], 0.1], [[0.00177, 0.00892, -0.00557], 0.12], [[-0.02, 0.01, 0.03], 0.07]]) {
    const pr = prostorOrgana(c, r);
    const rav = pr.ravnina(n, d);
    assert.ok(Math.abs(Math.hypot(...rav.n) - 1) < 1e-12);
    for (const p of tocke) {
      const q = pr.tocka(p); // kjer je oglišče GLB v enotah modela
      const vModelu = (rav.n[0] * q[0] + rav.n[1] * q[1] + rav.n[2] * q[2] + rav.d) * r; // razdalja do ravnine, nazaj v metrih
      const vGLB = (n[0] * p[0] + n[1] * p[1] + n[2] * p[2] + d) / l;
      assert.ok(Math.abs(vModelu - vGLB) < 1e-12, `razdalja do ravnine ${vModelu} ≠ ${vGLB} pri središču ${c}`);
    }
    // sprejme tudi { x, y, z } (THREE.Vector3)
    assert.deepEqual(prostorOrgana({ x: c[0], y: c[1], z: c[2] }, r).tocka(tocke[0]), pr.tocka(tocke[0]));
  }
});

test("organ.js mere iz JSON pretvarja s prostorom organa (ne samo z merilom)", () => {
  const src = fs.readFileSync(path.join(KOREN, "public", "3d", "organ.js"), "utf8");
  assert.match(src, /prostor\.ravnina\(r\.n, r\.d/);
  assert.match(src, /prostor\.tocka\(d\.tocka\)/);
  assert.match(src, /prostor\.tocka\(o\.sredisce\)/);
  assert.doesNotMatch(src, /r\.d \|\| 0\) \* s\b/);
  assert.doesNotMatch(src, /\.map\(\(\w+\) => \w+ \* s\)/, "mera v metrih pomnožena samo z merilom");
});

// Oglišča vozlišč v svetovnih koordinatah GLB.
async function oglisca(datoteka, imena) {
  await MeshoptDecoder.ready;
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ "meshopt.decoder": MeshoptDecoder });
  const doc = await io.read(datoteka);
  const out = [];
  const el = [0, 0, 0];
  for (const node of doc.getRoot().listNodes()) {
    const mesh = node.getMesh();
    if (!mesh || (imena && !imena.includes(node.getName()))) continue;
    const M = node.getWorldMatrix();
    for (const p of mesh.listPrimitives()) {
      const pos = p.getAttribute("POSITION");
      for (let i = 0; i < pos.getCount(); i++) {
        pos.getElement(i, el);
        out.push([M[0] * el[0] + M[4] * el[1] + M[8] * el[2] + M[12], M[1] * el[0] + M[5] * el[1] + M[9] * el[2] + M[13], M[2] * el[0] + M[6] * el[1] + M[10] * el[2] + M[14]]);
      }
    }
  }
  return out;
}
const delezPred = (tocke, r) => {
  const l = Math.hypot(...r.n);
  return tocke.filter((p) => (r.n[0] * p[0] + r.n[1] * p[1] + r.n[2] * p[2] + (r.d || 0)) / l > 0).length / tocke.length;
};

test("srce: ravnina prereza v koordinatah GLB odpre oba prekata (računalnik in telefon)", async () => {
  const srce = JSON.parse(fs.readFileSync(path.join(ORGANI, "srce.json"), "utf8"));
  const r = srce.prerez.ravnine[0];
  for (const dat of ["srce.glb", "srce-telefon.glb"]) {
    const lv = await oglisca(path.join(ORGANI, dat), ["Left ventricle"]);
    const dl = delezPred(lv, r);
    assert.ok(lv.length > 100 && dl > 0.2 && dl < 0.8, `${dat}: prerez ne gre skozi levi prekat (delež oglišč pred ravnino ${dl.toFixed(2)})`);
    // Desni prekat leži spredaj: za ravnino mora ostati vsaj 10 mm njegove votline (11,6 mm; s premaknjenim rezom 6 mm).
    const rv = await oglisca(path.join(ORGANI, dat), ["Right ventricle"]);
    const l = Math.hypot(...r.n);
    const globina = Math.max(...rv.map((p) => (r.n[0] * p[0] + r.n[1] * p[1] + r.n[2] * p[2] + (r.d || 0)) / l));
    assert.ok(rv.length > 100 && globina > 0.01 && globina < 0.03, `${dat}: prerez ne odpre desnega prekata (za ravnino ostane ${(globina * 1000).toFixed(1)} mm)`);
  }
});

test("vsak organ s prerezom: ravnina gre skozi model", async () => {
  for (const f of fs.readdirSync(ORGANI).filter((x) => x.endsWith(".json"))) {
    const j = JSON.parse(fs.readFileSync(path.join(ORGANI, f), "utf8"));
    if (!j.prerez?.ravnine) continue;
    const t = await oglisca(path.join(ORGANI, f.replace(".json", ".glb")));
    for (const r of j.prerez.ravnine) {
      const d = delezPred(t, r);
      assert.ok(d > 0.1 && d < 0.9, `${f}: ravnina prereza je izven modela (delež ${d.toFixed(2)})`);
    }
  }
});

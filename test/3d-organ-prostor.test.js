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
import { prostorOrgana, brezPregrad } from "../public/3d/organ-prostor.js";
import { analiziraj } from "../scripts/atlas/preveri-mreze.mjs";

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
  // okvir: središče v metrih GLB (privzeto središče škatle), po potrebi premaknjeno na ravnino reza, nato prostor.tocka
  assert.match(src, /o\.sredisce \|\| prostor\.sredisce/);
  assert.match(src, /sredisce: prostor\.tocka\(c\)/);
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
    // Desni prekat leži spredaj: za ravnino mora ostati vsaj 10 mm njegove votline. Srce iz CT (#567) ima desni prekat
    // širši in bolj spredaj kot prejšnje (33 mm namesto 11,6 mm), zato je zgornja meja 40 mm; da je rez še vedno pogled
    // na vse štiri votline, preverimo še oba preddvora.
    const rv = await oglisca(path.join(ORGANI, dat), ["Right ventricle"]);
    const l = Math.hypot(...r.n);
    const globina = Math.max(...rv.map((p) => (r.n[0] * p[0] + r.n[1] * p[1] + r.n[2] * p[2] + (r.d || 0)) / l));
    assert.ok(rv.length > 100 && globina > 0.01 && globina < 0.04, `${dat}: prerez ne odpre desnega prekata (za ravnino ostane ${(globina * 1000).toFixed(1)} mm)`);
    for (const ime of ["Left atrium", "Right atrium"]) {
      const a = await oglisca(path.join(ORGANI, dat), [ime]);
      const da = delezPred(a, r);
      assert.ok(a.length > 100 && da > 0.1 && da < 0.9, `${dat}: prerez ne gre skozi ${ime} (delež oglišč pred ravnino ${da.toFixed(2)})`);
    }
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

test("pregrada na stiku: par nasprotno navitih trikotnikov z istimi oglišči odpade, drugo ostane", () => {
  // dva tetraedra s skupno ploskvijo (0, 1, 2): vsak je zaprt, skupna ploskev je v obeh, nasprotno navita
  const p = Float32Array.from([0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, /* drugi */ 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, -1]);
  const idx = Uint32Array.from([0, 2, 1, 0, 1, 3, 1, 2, 3, 2, 0, 3, /* drugi */ 4, 5, 6, 4, 7, 5, 5, 7, 6, 6, 7, 4]);
  const nov = brezPregrad(p, idx);
  assert.equal(nov.length, idx.length - 6);
  assert.deepEqual([...nov], [0, 1, 3, 1, 2, 3, 2, 0, 3, 4, 7, 5, 5, 7, 6, 6, 7, 4]);
  const r = analiziraj(Float64Array.from(p), nov);
  assert.equal(r.odprtiRobovi, 0, "unija brez pregrade mora ostati zaprta");
  // enako navit dvojnik (ista ploskev dvakrat) ni pregrada
  assert.equal(brezPregrad(p.slice(0, 12), Uint32Array.from([0, 1, 2, 0, 1, 2])), null);
  assert.equal(brezPregrad(p.slice(0, 12), idx.slice(0, 12)), null);
});

// Srce iz CT (#567): aorta in pljučno deblo nista več razrezana na dele z istim obročem. Korena sta dela stene srca
// (prerez.volumen.stenaVozlisca: odprta krpa zaprte unije stene), druge žile so vsaka zase zaprte cevi z debelino stene.
// Skupine »stik« zato niso več obvezne; če so, zanje velja isto kot prej, sicer mora biti zaprta vsaka žila zase.
test("srce: žile so zaprte; deli iste žile (extras »stik«) imajo skupno mrežo oglišč in so brez pregrad zaprti", async () => {
  await MeshoptDecoder.ready;
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ "meshopt.decoder": MeshoptDecoder });
  const stena = new Set(JSON.parse(fs.readFileSync(path.join(ORGANI, "srce.json"), "utf8")).prerez.volumen.stenaVozlisca || []);
  for (const dat of ["srce.glb", "srce-telefon.glb"]) {
    const doc = await io.read(path.join(ORGANI, dat));
    const skupine = new Map();
    let zil = 0;
    for (const node of doc.getRoot().listNodes()) {
      const ex = node.getExtras() || {};
      if (!ex.stik) {
        if (!node.getMesh() || stena.has(node.getName()) || !/^(aorta|arterija|pljucna|vena|pljucna-vena|vencna-arterija|vencna-vena)$/.test(ex.tkivo)) continue;
        const prim = node.getMesh().listPrimitives()[0];
        const pos = prim.getAttribute("POSITION");
        const p = new Float64Array(pos.getCount() * 3);
        const el = [0, 0, 0];
        for (let i = 0; i < pos.getCount(); i++) { pos.getElement(i, el); p.set(el, i * 3); }
        assert.equal(analiziraj(p, Uint32Array.from(prim.getIndices().getArray())).odprtiRobovi, 0, `${dat} ${node.getName()}: žila ni zaprta`);
        zil++;
        continue;
      }
      assert.equal(node.getParentNode(), null);
      const k = `${ex.del}|${ex.tkivo}`;
      if (!skupine.has(k)) skupine.set(k, { premik: node.getTranslation(), merilo: node.getScale(), p: [], idx: [], imena: [] });
      const s = skupine.get(k);
      assert.deepEqual([node.getTranslation(), node.getScale()], [s.premik, s.merilo], `${dat} ${node.getName()}: deli žile nimajo iste mreže oglišč`);
      const prim = node.getMesh().listPrimitives()[0];
      const pos = prim.getAttribute("POSITION");
      const odmik = s.p.length / 3;
      const el = [0, 0, 0];
      // kot pregledovalnik: normalizirano celo število → float32, nato premik in merilo → float32
      for (let i = 0; i < pos.getCount(); i++) { pos.getElement(i, el); for (let c = 0; c < 3; c++) s.p.push(Math.fround(Math.fround(el[c]) * s.merilo[c] + s.premik[c])); }
      for (const i of prim.getIndices().getArray()) s.idx.push(i + odmik);
      s.imena.push(node.getName());
    }
    assert.ok(zil >= 20, `${dat}: premalo samostojnih žil (${zil})`);
    for (const k of skupine.keys()) assert.ok(["aorta|arterija", "pljucno-deblo|pljucna"].includes(k), `${dat}: nepričakovana skupina ${k}`);
    for (const [k, s] of skupine) {
      const idx = Uint32Array.from(s.idx);
      const nov = brezPregrad(Float32Array.from(s.p), idx);
      assert.ok(nov && idx.length - nov.length >= 2 * 3 * 24 * (s.imena.length - 1), `${dat} ${k}: pregrade na stikih niso bile odstranjene`);
      const r = analiziraj(Float64Array.from(s.p), nov);
      assert.equal(r.odprtiRobovi, 0, `${dat} ${k}: združena žila brez pregrad ni zaprta`);
    }
  }
});

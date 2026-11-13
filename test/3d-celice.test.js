// 3D celice: every builder in public/3d/modeli/celice follows the contract in docs/3d.md
// (info, zgradi, parts with ime + opis, unit sphere, triangle and draw-call budgets).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "3d", "modeli", "celice");
let THREE = null;
try { THREE = await import("three"); } catch { /* three arrives with the 3D kit */ }
const skip = THREE ? false : "three ni nameščen";

const MEJE = { visoka: 350000, nizka: 60000 };
const KLICI = 60;

// Draw calls and triangles the way the renderer counts them for visible objects.
function stej(group) {
  let tri = 0, klici = 0;
  group.updateMatrixWorld(true);
  group.traverseVisible((o) => {
    if (!o.isMesh && !o.isLine && !o.isPoints) return;
    const g = o.geometry;
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    const skupine = Array.isArray(o.material) && g.groups.length ? g.groups.length : 1;
    const n = o.isInstancedMesh ? o.count : 1;
    if (n === 0) return;
    // three draws transparent double-sided materials in two passes
    klici += skupine * (mats.some((m) => m && m.transparent && m.side === THREE.DoubleSide && !m.forceSinglePass) ? 2 : 1);
    if (o.isMesh) {
      const idx = g.index ? g.index.count : g.attributes.position.count;
      const range = Math.min(idx, g.drawRange.count);
      tri += (range / 3) * n;
    }
  });
  return { tri: Math.round(tri), klici };
}

function polmer(group) {
  const box = new THREE.Box3().setFromObject(group, true);
  const c = box.getCenter(new THREE.Vector3());
  let r = 0;
  const v = new THREE.Vector3();
  group.updateMatrixWorld(true);
  group.traverseVisible((o) => {
    if (!o.isMesh || o.isInstancedMesh) return;
    const pos = o.geometry.attributes.position;
    const step = Math.max(1, Math.floor(pos.count / 400));
    for (let i = 0; i < pos.count; i += step) {
      v.fromBufferAttribute(pos, i).applyMatrix4(o.matrixWorld);
      r = Math.max(r, v.length());
    }
  });
  return { r, c };
}

function preveriDele(f, M) {
  assert.ok(Array.isArray(M.deli) && M.deli.length >= 3, "vsaj 3 deli");
  const ids = new Set();
  const meshes = new Set();
  M.group.traverse((o) => meshes.add(o));
  for (const d of M.deli) {
    assert.ok(/^[a-z0-9-]+$/.test(d.id) && !ids.has(d.id), `${f}: id dela ${d.id}`);
    ids.add(d.id);
    assert.ok(d.ime && d.opis && d.opis.length >= 15 && d.opis.length <= 260, `${f}/${d.id}: ime in opis`);
    assert.ok(/^#[0-9a-f]{6}$/i.test(d.barva), `${f}/${d.id}: barva`);
    assert.ok(Array.isArray(d.meshes) && d.meshes.length, `${f}/${d.id}: meshes`);
    for (const x of d.meshes) assert.ok(meshes.has(x), `${f}/${d.id}: mesh ni v skupini`);
    assert.ok(Array.isArray(d.tocka) && d.tocka.length === 3 && d.tocka.every(Number.isFinite), `${f}/${d.id}: tocka`);
  }
  if (M.merilo) assert.ok(M.merilo.m > 0 && M.merilo.oznaka, `${f}: merilo`);
}

const datoteke = readdirSync(DIR).filter((f) => f.endsWith(".js") && f !== "index.js");

test("celice: index.js navaja vse modele", { skip: false }, async () => {
  const idx = (await import(pathToFileURL(path.join(DIR, "index.js")))).default;
  assert.ok(Array.isArray(idx) && idx.length >= 27, "vsaj 27 modelov");
  const poti = idx.map((e) => e.pot.replace("./", ""));
  assert.deepEqual([...poti].sort(), [...datoteke].sort(), "index.js in datoteke se ujemajo");
  const ids = new Set();
  for (const e of idx) {
    assert.ok(/^[a-z0-9-]+$/.test(e.id), e.id);
    assert.ok(!ids.has(e.id), "podvojen id " + e.id);
    ids.add(e.id);
    assert.ok(e.naslov && ["BIO", "NAR"].includes(e.predmet), e.id);
    const m = await import(pathToFileURL(path.join(DIR, e.pot)));
    assert.equal(m.info.id, e.id, "id v index.js = info.id");
    assert.equal(m.info.naslov, e.naslov);
  }
});

for (const f of datoteke) {
  test("celice: " + f, { skip }, async () => {
    const m = await import(pathToFileURL(path.join(DIR, f)));
    const { info } = m;
    assert.ok(info && /^celica-|^virus-|^celice-/.test(info.id), "info.id " + info?.id);
    assert.equal(info.podrocje, "celice");
    assert.ok(["BIO", "NAR"].includes(info.predmet));
    assert.ok(info.naslov && info.opis && info.opis.length > 20);
    assert.ok(info.merilo && info.merilo.m > 0 && info.merilo.m < 1e-3 && /µm|nm|mm/.test(info.merilo.oznaka), "merilo");
    assert.equal(typeof m.zgradi, "function");

    for (const kakovost of ["visoka", "nizka"]) {
      const M = m.zgradi(THREE, { kakovost, gibanje: true });
      assert.ok(M.group && M.group.isGroup, "group");
      const { tri, klici } = stej(M.group);
      assert.ok(tri <= MEJE[kakovost], `${f} ${kakovost}: ${tri} trikotnikov > ${MEJE[kakovost]}`);
      assert.ok(klici <= KLICI, `${f} ${kakovost}: ${klici} klicev risanja > ${KLICI}`);
      const { r, c } = polmer(M.group);
      assert.ok(r <= 1.08 && r >= 0.6, `${f}: polmer ${r.toFixed(2)} (mora biti ≈ 1)`);
      assert.ok(c.length() < 0.35, `${f}: središče ${c.toArray().map((x) => x.toFixed(2))}`);

      preveriDele(f, M);
      // »Barve kot v učbeniku«: vklop spremeni barve, izklop vrne vse natančno (tudi deljene materiale in kopijo
      // materiala izbranega dela, ki jo naredi pregledovalnik)
      const uc = (M.nadzor || []).find((n) => n.id === "ucbenik");
      assert.ok(uc && uc.tip === "stikalo", `${f}: stikalo ucbenik`);
      if (kakovost === "nizka") {
        const barve = () => { const s = []; M.group.traverse((o) => { if (o.material?.color) s.push(o.material.color.getHexString() + (o.material.emissive?.getHexString() ?? "")); }); return s.join() + M.deli.map((d) => d.barva).join(); };
        const izbrani = M.deli.find((d) => d.meshes.some((x) => x.material?.color)), izv = new Map();
        const izberi = () => { for (const x of izbrani.meshes) if (x.material?.color) { izv.set(x, x.material); x.material = x.material.clone(); } };
        const odizberi = () => { for (const [x, m] of izv) x.material = m; izv.clear(); };
        const b0 = barve();
        uc.ob(true);
        const b1 = barve();
        assert.notEqual(b1, b0, `${f}: učbeniške barve se ne vklopijo`);
        uc.ob(false);
        assert.equal(barve(), b0, `${f}: izklop učbeniških barv ne vrne izvirnih`);
        izberi(); uc.ob(true); odizberi();
        assert.equal(barve(), b1, `${f}: vklop med izbranim delom`);
        izberi(); uc.ob(false); odizberi();
        assert.equal(barve(), b0, `${f}: izklop med izbranim delom`);
      }
      for (const n of M.nadzor || []) {
        if (n.id === "ucbenik") continue;
        assert.ok(["drsnik", "izbira", "gumb", "stikalo", "izpis"].includes(n.tip) && n.id && n.oznaka, `${f}: nadzor ${n.id}`);
        if (n.tip === "izpis") { assert.equal(typeof n.vrednost(), "string"); continue; }
        assert.equal(typeof n.ob, "function", `${f}: nadzor ${n.id}.ob`);
        if (n.tip === "gumb") { n.ob(); continue; }
        if (n.tip === "stikalo") { const v = n.vrednost; n.ob(!v); n.ob(v); continue; }
        if (n.tip === "izbira") {
          for (const [v] of n.moznosti) {
            n.ob(v);
            const s = stej(M.group);
            assert.ok(s.tri <= MEJE[kakovost] && s.klici <= KLICI, `${f}: ${n.id}=${v} ${s.tri}/${s.klici}`);
            preveriDele(`${f} ${n.id}=${v}`, M);
          }
          n.ob(n.vrednost);
        } else {
          for (const v of [n.min, n.max, n.vrednost]) n.ob(v);
        }
      }
      if (M.korak) for (let i = 0; i < 5; i++) M.korak(i / 30, 1 / 30);
      const mirno = m.zgradi(THREE, { kakovost, gibanje: false });
      if (mirno.korak) mirno.korak(1, 1 / 30);
      M.dispose && M.dispose();
    }
  });
}

// »Podrobnosti za faks« (V.ravenFaks, docs/3d.md): izklopljeno stikalo pusti celico enako, vklop doda faks dele z
// besedili v proračunu trikotnikov in klicev (vsi prikazi), izklop vrne prvotne dele in besedila.
const FAKS = {
  "zivalska.js": ["membranske-beljakovine", "glikokaliks", "jedrna-lamina", "mtdna", "endosomi", "klatrinski-mesicki", "mikrotubuli", "aktinski-filamenti", "intermediarni-filamenti"],
  "rastlinska.js": ["kloroplastna-dna", "plastoglobuli", "mtdna", "mikrotubuli", "aktinski-filamenti"],
};
for (const [f, novi] of Object.entries(FAKS)) {
  test("celice: podrobnosti za faks v " + f, { skip }, async () => {
    const m = await import(pathToFileURL(path.join(DIR, f)));
    for (const kakovost of ["visoka", "nizka"]) {
      const M = m.zgradi(THREE, { kakovost, gibanje: false });
      const fk = M.nadzor.find((n) => n.id === "faks");
      assert.ok(fk && fk.tip === "stikalo" && fk.vrednost === false, `${f}: stikalo faks, privzeto izklopljeno`);
      const skriti = [];
      M.group.traverse((o) => { if (!o.visible) skriti.push(o); });
      const pred = M.deli.map((d) => `${d.id}|${d.ime}|${d.opis}`);
      assert.ok(novi.every((id) => !pred.some((x) => x.startsWith(id + "|"))), `${f}: faks deli so skriti`);
      const tri0 = stej(M.group).tri;
      fk.ob(true);
      const ids = M.deli.map((d) => d.id);
      for (const id of novi) assert.ok(ids.includes(id), `${f}: faks del ${id}`);
      assert.equal(new Set(ids).size, ids.length, `${f}: podvojen del`);
      for (const d of M.deli) for (const x of d.meshes) assert.equal(x.userData.del, d.id, `${f}: faks userData.del ${d.id}`);
      if (f === "zivalska.js") assert.ok(ids.indexOf("klatrinski-mesicki") === ids.indexOf("glikokaliks") + 1, `${f}: vrstni red (za)`);
      assert.ok(M.deli.filter((d) => pred.includes(`${d.id}|${d.ime}|${d.opis}`)).length < pred.length / 2, `${f}: faks besedila`);
      const pr = M.nadzor.find((n) => n.id === "prikaz");
      for (const [v] of pr.moznosti) {
        pr.ob(v);
        const s = stej(M.group);
        assert.ok(s.tri <= MEJE[kakovost] && s.klici <= KLICI, `${f} faks ${kakovost} ${v}: ${s.tri}/${s.klici}`);
        preveriDele(`${f} faks ${v}`, M);
      }
      pr.ob(pr.vrednost);
      // vklopljene učbeniške barve pobarvajo tudi faks dele in se ob izklopu vrnejo
      const uc = M.nadzor.find((n) => n.id === "ucbenik");
      const barva = () => M.deli.find((d) => d.id === "mtdna").meshes[0].material.color.getHexString();
      const b0 = barva();
      uc.ob(true);
      assert.notEqual(barva(), b0, `${f}: učbeniška barva faks dela`);
      uc.ob(false);
      assert.equal(barva(), b0);
      fk.ob(false);
      assert.deepEqual(M.deli.map((d) => `${d.id}|${d.ime}|${d.opis}`), pred, `${f}: izklop vrne dele in besedila`);
      assert.equal(stej(M.group).tri, tri0, `${f}: izklop vrne trikotnike`);
      const zdaj = [];
      M.group.traverse((o) => { if (!o.visible) zdaj.push(o); });
      assert.deepEqual(zdaj, skriti, `${f}: izklop vrne vidnost`);
      for (const d of M.deli) for (const x of d.meshes) assert.equal(x.userData.del, d.id, `${f}: userData.del ${d.id}`);
      // zacetek iz faks lekcije vklopi stikalo že ob gradnji
      const Z = m.zgradi(THREE, { kakovost, gibanje: false, zacetek: { faks: true } });
      assert.ok(Z.nadzor.find((n) => n.id === "faks").vrednost && Z.deli.some((d) => d.id === "mtdna"), `${f}: zacetek faks`);
      M.dispose(); Z.dispose();
    }
  });
}

test("celice: katalog – faks podrobnosti samo v faks lekcijah, faks lekcije o celici imajo 3D celico", { skip }, async () => {
  const { SIM_TOPICS, simsForTopic } = await import("../public/sim/katalog.js");
  const { simsFor } = await import("../server/textbook.js");
  const idx = (await import(pathToFileURL(path.join(DIR, "index.js")))).default;
  const pot = new Map(idx.map((e) => [e.id, e.pot]));
  for (const tema of Object.keys(SIM_TOPICS)) {
    for (const d of simsForTopic(tema)) {
      const m3 = /^3d-(.+)$/.exec(d.id);
      if (!m3 || !pot.has(m3[1])) continue;
      const zac = d.opts.zacetek || {};
      if (zac.faks) assert.ok(tema.startsWith("UNI-"), `${tema}: faks podrobnosti v šolski lekciji`);
      if (!Object.keys(zac).length) continue;
      const m = await import(pathToFileURL(path.join(DIR, pot.get(m3[1]))));
      const M = m.zgradi(THREE, { kakovost: "nizka", gibanje: false, zacetek: zac });
      for (const k of Object.keys(zac)) assert.ok(M.nadzor.some((n) => n.id === k), `${tema}: ${d.id} nima kontrole ${k}`);
      M.dispose();
    }
  }
  // lekcije, zaradi katerih je stikalo nastalo (j, 13. 11.), in ista tema v drugem programu (sameTopics, ista lekcija)
  for (const tema of ["UNI-ULFKKT-NMOVZ/zgradba-celice", "UNI-ULBF-ABIOCEL/prokariontska-in-evkariontska-celica", "UNI-UMFNM-NBIOCEL/endomembranski-sistem", "UNI-ULBF-ASPLBOT/rastlinska-celica"]) {
    const z = simsFor(tema).find((d) => /^3d-celica-(zivalska|rastlinska)$/.test(d.id));
    assert.ok(z && z.opts.zacetek?.faks === true, `${tema}: živalska ali rastlinska celica s faks podrobnostmi`);
  }
});

test("celice: primerjava ne zgradi faks delov živalske celice", { skip }, async () => {
  const m = await import(pathToFileURL(path.join(DIR, "primerjava.js")));
  const tocke = (M) => { let n = 0; M.group.traverseVisible((o) => { if (o.isPoints) n += o.geometry.attributes.position.count; }); return n; };
  const M = m.zgradi(THREE, { kakovost: "nizka", gibanje: false });
  const n0 = tocke(M);
  const poudari = M.nadzor.find((n) => n.tip === "izbira");
  for (const [v] of poudari.moznosti) poudari.ob(v);
  poudari.ob(poudari.vrednost);
  assert.equal(tocke(M), n0, "vidne točke se po »Poudari« ne smejo spremeniti (skrit glikokaliks)");
  assert.ok(!M.nadzor.some((n) => n.id === "faks"));
  M.dispose?.();
});

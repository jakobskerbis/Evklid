// Organi v 3D iz GLB (docs/3d.md »Organi iz GLB«): datoteke, velikosti, vozlišča, deli z imeni in opisi, licence.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import modeli from "../public/3d/modeli/organi/index.js";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const ORGANI = path.join(ROOT, "public", "3d", "modeli", "organi");
const MAPA = path.join(ROOT, "public", "3d", "modeli", "organi-3d");
const MB = 1024 * 1024;
// Enako kot IZLOCI v scripts/atlas/izvozi-*.py: deli Z-Anatomy, ki morda izhajajo iz modelov z licenco NC.
const IZLOCI = /^(Cochlea|Vestibule|Semicircular|Renal pelvis|Intrarenal (arteries|veins))/i;

function glb(file) {
  const b = fs.readFileSync(file);
  assert.equal(b.readUInt32LE(0), 0x46546c67, `${file} ni GLB`);
  const n = b.readUInt32LE(12);
  return JSON.parse(b.subarray(20, 20 + n).toString("utf8"));
}
const trikotniki = (j) => j.meshes.reduce((s, m) => s + m.primitives.reduce((t, p) => t + (p.indices != null ? j.accessors[p.indices].count : j.accessors[p.attributes.POSITION].count) / 3, 0), 0);

const organi = [];
for (const e of modeli) {
  const mod = await import(pathToFileURL(path.join(ORGANI, e.pot)).href);
  if (typeof mod.organ === "string") organi.push({ e, mod });
}

test("organi iz GLB: vsaj možgani, srce in oko", () => {
  const imena = organi.map((o) => o.mod.organ);
  for (const x of ["mozgani", "srce", "oko"]) assert.ok(imena.includes(x), `manjka organ ${x}`);
});

for (const { e, mod } of organi) {
  const ime = mod.organ;
  test(`organ ${ime}: GLB, deli in besedila`, () => {
    assert.equal(mod.info.id, `organ-${ime}`);
    assert.equal(e.id, mod.info.id);
    const pc = path.join(MAPA, `${ime}.glb`);
    const tel = path.join(MAPA, `${ime}-telefon.glb`);
    for (const f of [pc, tel]) assert.ok(fs.existsSync(f), `manjka ${path.relative(ROOT, f)}`);
    // Meja: 6 MB računalnik, 2 MB telefon (z zapečenimi teksturami WebP; brez tekstur ostane okoli 4 in 1,5 MB).
    assert.ok(fs.statSync(pc).size <= 6.2 * MB, `${ime}.glb: ${(fs.statSync(pc).size / MB).toFixed(2)} MB > 6,2 MB`);
    assert.ok(fs.statSync(tel).size <= 2.1 * MB, `${ime}-telefon.glb: ${(fs.statSync(tel).size / MB).toFixed(2)} MB > 2,1 MB`);
    const jp = glb(pc);
    const jt = glb(tel);
    // Brez meshopt/draco: organ se odpre tudi v lekciji (CSP glavne aplikacije ne dovoli WebAssembly).
    for (const j of [jp, jt]) assert.ok(!(j.extensionsRequired || []).some((x) => /meshopt|draco|basisu|ktx/i.test(x)), `${ime}: stiskanje, ki potrebuje WebAssembly`);
    // Teksture (zapečene, WebP): največ dve sliki (osnovna barva, normalna mapa); telefon jih sme imeti ali ne.
    for (const j of [jp, jt]) assert.ok((j.images || []).length <= 2 && (j.images || []).every((i) => /webp|jpeg|png/.test(i.mimeType)), `${ime}: slike`);
    const tp = trikotniki(jp);
    const tt = trikotniki(jt);
    assert.ok(tp <= 320000 && tp >= 60000, `${ime}.glb: ${tp} trikotnikov`);
    assert.ok(tt <= 90000 && tt < tp, `${ime}-telefon.glb: ${tt} trikotnikov`);
    const vozlisca = new Set(jp.nodes.filter((n) => n.mesh != null).map((n) => n.name));
    // Vozlišča z delom "" so ozadje (npr. medialna stena možganov, vidna samo v prerezu), ne del na seznamu.
    const ozadje = jp.nodes.filter((n) => n.mesh != null && n.extras?.del === "").length;
    const vozliscaT = new Set(jt.nodes.filter((n) => n.mesh != null).map((n) => n.name));
    for (const n of vozlisca) assert.ok(!IZLOCI.test(n), `${ime}: izključen del ${n} (licenca NC)`);
    for (const n of jp.nodes) if (n.mesh != null) assert.ok(n.extras?.tkivo && "del" in n.extras, `${ime}: vozlišče ${n.name} brez tkiva/dela`);

    const p = JSON.parse(fs.readFileSync(path.join(MAPA, `${ime}.json`), "utf8"));
    assert.ok(Array.isArray(p.deli) && p.deli.length >= 3, `${ime}.json: deli`);
    const ids = new Set();
    let pokrito = 0;
    for (const d of p.deli) {
      assert.ok(d.id && !ids.has(d.id), `${ime}: podvojen del ${d.id}`);
      ids.add(d.id);
      assert.ok(typeof d.ime === "string" && d.ime.length > 1, `${ime}/${d.id}: ime`);
      assert.ok(typeof d.la === "string" && d.la.length > 1, `${ime}/${d.id}: latinsko ime`);
      assert.ok(typeof d.opis === "string" && d.opis.length > 20 && d.opis.length < 140, `${ime}/${d.id}: opis (en kratek stavek)`);
      assert.match(d.barva || "", /^#[0-9a-f]{6}$/i, `${ime}/${d.id}: barva`);
      assert.ok(Array.isArray(d.vozlisca) && d.vozlisca.length > 0, `${ime}/${d.id}: vozlisca`);
      for (const v of d.vozlisca) {
        assert.ok(vozlisca.has(v), `${ime}/${d.id}: vozlišče ${v} ni v ${ime}.glb`);
        assert.ok(vozliscaT.has(v), `${ime}/${d.id}: vozlišče ${v} ni v ${ime}-telefon.glb`);
        assert.ok(!IZLOCI.test(v), `${ime}/${d.id}: izključen del ${v}`);
      }
      pokrito += d.vozlisca.length;
      for (const t of [d.tocka, ...Object.values(d.tocke || {})]) if (t != null) assert.ok(Array.isArray(t) && t.length === 3 && t.every(Number.isFinite), `${ime}/${d.id}: točka`);
    }
    assert.equal(pokrito + ozadje, vozlisca.size, `${ime}: vsako vozlišče mora pripadati delu (ali biti ozadje z delom "")`);
    for (const n of jp.nodes) if (n.mesh != null) assert.ok(p.tkiva?.[n.extras.tkivo]?.barva, `${ime}: tkivo ${n.extras.tkivo} brez barve`);
    // Pogledi: največ 6 točk, vse so obstoječi deli; prerez ima smer kamere.
    assert.ok(p.pogledi?.celota, `${ime}: pogled celota`);
    for (const [k, v] of Object.entries(p.pogledi)) {
      assert.ok((v.tocke || []).length <= 6, `${ime}/${k}: več kot 6 točk`);
      for (const t of v.tocke || []) assert.ok(ids.has(t), `${ime}/${k}: točka ${t} ni del`);
      assert.ok(Array.isArray(v.pogled) && v.pogled.length === 3, `${ime}/${k}: pogled`);
    }
    // »Podrobnosti organa«: 4–6 odstavkov s kratkim naslovom in besedilom.
    const o = p.podrobnosti?.odseki || [];
    assert.ok(o.length >= 4 && o.length <= 6, `${ime}: podrobnosti 4–6 odsekov`);
    for (const x of o) assert.ok(x.naslov && x.besedilo?.length > 120, `${ime}: odsek ${x.naslov}`);
  });
}

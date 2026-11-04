// 3D atlas in modeli iz kode (docs/3d.md): podatki atlasa, viri in licence, velikost prenosov, pogodba za modele,
// CSP strani /3d, prepis uvozov three in ključi prevodov.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as THREE from "three";
import { createApp } from "../server/app.js";
import { openDb } from "../server/db.js";
import { cspFor3d, rewriteThreeImports, PODROCJA as PODROCJA_STREZNIK } from "../server/tri-d.js";
import { PODROCJA, preveriInfo, preveriModel } from "../public/3d/pogodba.js";
import sl from "../public/i18n/sl.js";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const D3 = path.join(ROOT, "public", "3d");
const MODELI = path.join(D3, "modeli");
const MB = 1024 * 1024;

function datoteke(dir, konec) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...datoteke(p, konec));
    else if (e.name.endsWith(konec)) out.push(p);
  }
  return out.sort();
}
const rel = (p) => path.relative(MODELI, p).split(path.sep).join("/");

// JSON del datoteke GLB (glava 12 bajtov, nato kos JSON).
function glbJson(file) {
  const b = fs.readFileSync(file);
  assert.equal(b.readUInt32LE(0), 0x46546c67, `${rel(file)} ni GLB`);
  const dolzina = b.readUInt32LE(12);
  assert.equal(b.readUInt32LE(16), 0x4e4f534a, `${rel(file)}: prvi kos ni JSON`);
  return JSON.parse(b.subarray(20, 20 + dolzina).toString("utf8"));
}

// Vzorec iz viri.json (npr. "telo/*.glb"): * ne prečka mape.
const ujema = (vzorec, pot) => new RegExp(`^${vzorec.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, "[^/]*")}$`).test(pot);

test("vsaka struktura atlasa je vozlišče v GLB svoje plasti", () => {
  const vrstice = JSON.parse(fs.readFileSync(path.join(D3, "atlas-strukture.json"), "utf8"));
  assert.ok(vrstice.length > 100);
  const poSloju = new Map();
  for (const r of vrstice) {
    assert.ok(r.id && r.ime && r.sistem, `vrstica brez id/ime/sistem: ${JSON.stringify(r).slice(0, 80)}`);
    assert.ok(Array.isArray(r.c) && r.c.length === 3 && r.c.every(Number.isFinite) && r.r > 0, `${r.id}: c in r`);
    if (!poSloju.has(r.sistem)) poSloju.set(r.sistem, []);
    poSloju.get(r.sistem).push(r);
  }
  const ids = new Set(vrstice.map((r) => r.id));
  assert.equal(ids.size, vrstice.length, "podvojeni id-ji struktur");
  for (const [sloj, seznam] of poSloju) {
    const file = path.join(MODELI, "telo", `${sloj}.glb`);
    assert.ok(fs.existsSync(file), `manjka telo/${sloj}.glb`);
    const g = glbJson(file);
    const imena = new Set();
    for (const n of g.nodes || []) {
      if (n.extras?.zid) imena.add(n.extras.zid);
      if (n.name) imena.add(n.name);
    }
    const manjka = seznam.filter((r) => !imena.has(r.id)).map((r) => r.id);
    assert.deepEqual(manjka.slice(0, 10), [], `${sloj}.glb: manjka ${manjka.length} struktur`);
  }
});

test("žensko telo: vrstice atlas-zenski.json so vozlišča zenski.glb, skrite moške strukture obstajajo", () => {
  const f = path.join(D3, "atlas-zenski.json");
  const glb = path.join(MODELI, "telo", "zenski.glb");
  assert.equal(fs.existsSync(f), fs.existsSync(glb), "atlas-zenski.json in telo/zenski.glb morata obstajati skupaj");
  if (!fs.existsSync(f)) return;
  const z = JSON.parse(fs.readFileSync(f, "utf8"));
  const g = glbJson(glb);
  const imena = new Set((g.nodes || []).flatMap((n) => [n.extras?.zid, n.name].filter(Boolean)));
  const vse = new Set(JSON.parse(fs.readFileSync(path.join(D3, "atlas-strukture.json"), "utf8")).map((r) => r.id));
  assert.ok(z.strukture.length > 0);
  for (const r of z.strukture) {
    assert.ok(imena.has(r.id), `zenski.glb: manjka ${r.id}`);
    assert.ok(!vse.has(r.id), `${r.id} je že v atlas-strukture.json`);
    assert.ok(r.ime && r.sistem && Array.isArray(r.pot) && r.c?.length === 3 && r.r > 0, `${r.id}: oblika vrstice`);
  }
  for (const id of z.skrij || []) assert.ok(vse.has(id), `skrij: ${id} ni v atlas-strukture.json`);
});

test("imena struktur: atlas-imena.json je slovar z imeni", () => {
  const im = JSON.parse(fs.readFileSync(path.join(D3, "atlas-imena.json"), "utf8"));
  assert.equal(typeof im, "object");
  const vnosi = Object.entries(im).filter(([k]) => !k.startsWith("_"));
  assert.ok(vnosi.length > 100);
  for (const [k, v] of vnosi) assert.ok(v && typeof v === "object" && typeof v.sl === "string", `ime ${k}`);
});

test("vsak GLB ima vir z licenco brez NC; vsak vir je opisan", () => {
  // public/3d/viri.json in viri.json področij (public/3d/modeli/<podrocje>/viri.json), vzorci so vedno glede na modeli/.
  const viri = { viri: [] };
  for (const f of [path.join(D3, "viri.json"), ...PODROCJA.map((p) => path.join(MODELI, p, "viri.json")).filter((f) => fs.existsSync(f))]) {
    const d = JSON.parse(fs.readFileSync(f, "utf8"));
    assert.ok(Array.isArray(d.viri), `${path.relative(ROOT, f)}: manjka seznam viri`);
    for (const v of d.viri) assert.ok(Array.isArray(v.datoteke ?? []), `${path.relative(ROOT, f)}: ${v.id} datoteke mora biti seznam`);
    viri.viri.push(...d.viri);
  }
  for (const v of viri.viri) {
    for (const k of ["id", "ime", "avtor", "opis", "licenca"]) assert.ok(v[k], `vir ${v.id}: manjka ${k}`);
    assert.ok(!/\bNC\b|non-?commercial|nekomercial/i.test(v.licenca), `vir ${v.id}: licenca NC ni dovoljena`);
  }
  const glb = datoteke(MODELI, ".glb");
  assert.ok(glb.length >= 8);
  for (const f of glb) {
    const p = rel(f);
    const zanj = viri.viri.filter((v) => (v.datoteke || []).some((d) => ujema(d, p)));
    assert.ok(zanj.length > 0, `${p}: ni naveden v public/3d/viri.json`);
  }
  for (const f of datoteke(MODELI, ".js")) {
    const p = rel(f);
    assert.ok(viri.viri.some((v) => (v.datoteke || []).some((d) => ujema(d, p))), `${p}: ni naveden v viri.json`);
  }
});

test("velikost prenosov: vsak GLB telesa ≤ 5 MB, skupaj ≤ 20 MB", () => {
  let skupaj = 0;
  for (const f of datoteke(path.join(MODELI, "telo"), ".glb")) {
    const b = fs.statSync(f).size;
    assert.ok(b <= 5 * MB, `${rel(f)}: ${(b / MB).toFixed(1)} MB > 5 MB`);
    skupaj += b;
  }
  assert.ok(skupaj <= 20 * MB, `telo skupaj ${(skupaj / MB).toFixed(1)} MB > 20 MB`);
});

// Pogodba za modele iz kode: info, zgradi(THREE, ctx) in kar vrne. Graditelji brez DOM (canvas za napise) se v Node
// ne zgradijo do konca; zanje preverimo le info.
async function preveriGraditelja(file) {
  const mod = await import(pathToFileURL(file).href);
  const ime = path.relative(ROOT, file);
  assert.deepEqual(preveriInfo(mod.info), [], `${ime}: info`);
  assert.equal(typeof mod.zgradi, "function", `${ime}: zgradi`);
  let model;
  try {
    model = mod.zgradi(THREE, { kakovost: "nizka", gibanje: false, zacetek: {} });
  } catch (err) {
    if (err instanceof ReferenceError && /document|window|OffscreenCanvas|Image|navigator/.test(err.message)) return mod.info;
    throw new Error(`${ime}: zgradi vrže ${err.message}`);
  }
  assert.deepEqual(preveriModel(model), [], `${ime}: model`);
  for (const d of model.deli || []) for (const m of d.meshes || []) assert.ok(m?.isObject3D, `${ime}: del ${d.id} ima mesh, ki ni Object3D`);
  for (const c of model.nadzor || []) if (c.tip === "izpis") assert.equal(typeof c.vrednost(), "string", `${ime}: izpis ${c.id}`);
  model.dispose?.();
  return mod.info;
}

test("pogodba: preizkusni model in preverjalnik ujameta napake", async () => {
  const info = await preveriGraditelja(path.join(ROOT, "test", "fixtures", "model-3d.js"));
  assert.equal(info.id, "preizkus-kocka");
  assert.ok(preveriInfo({ id: "Ni Dobro", naslov: "x", podrocje: "kuhinja", predmet: "BIO", opis: "x" }).length >= 2);
  assert.ok(preveriModel({ group: new THREE.Group(), nadzor: [{ tip: "gumb", id: "g", oznaka: "G", ob() {}, vidno: true }] }).some((n) => n.includes("vidno")));
  const g = new THREE.Group();
  const napake = preveriModel({
    group: g,
    deli: [{ id: "a", ime: "A", opis: "x" }, { id: "a", ime: "B" }],
    nadzor: [{ tip: "drsnik", id: "d", oznaka: "D", min: 1, max: 0, vrednost: 0, ob() {} }, { tip: "plosca", id: "p", oznaka: "P" }, { tip: "izpis", id: "i", oznaka: "I", vrednost: "3" }],
  });
  for (const del of ["podvojen", "manjka opis", "min < max", "neznan tip", "izpis potrebuje"]) assert.ok(napake.some((n) => n.includes(del)), del);
  assert.deepEqual(PODROCJA, PODROCJA_STREZNIK);
});

test("pogodba: vsak model iz kode v public/3d/modeli in kazala področij", async () => {
  const vsiId = new Map();
  for (const file of datoteke(MODELI, ".js")) {
    if (path.basename(file) === "index.js") continue;
    const info = await preveriGraditelja(file);
    assert.equal(path.basename(path.dirname(file)), info.podrocje, `${rel(file)}: mapa se mora ujemati s področjem`);
    assert.ok(!vsiId.has(info.id), `podvojen id modela ${info.id}`);
    vsiId.set(info.id, rel(file));
  }
  const vKazalih = new Set();
  for (const p of PODROCJA) {
    const idx = path.join(MODELI, p, "index.js");
    if (!fs.existsSync(idx)) continue;
    const seznam = (await import(pathToFileURL(idx).href)).default;
    assert.ok(Array.isArray(seznam), `${p}/index.js mora izvoziti seznam`);
    for (const m of seznam) {
      for (const k of ["id", "pot", "naslov", "predmet"]) assert.ok(m[k], `${p}/index.js: ${m.id} brez ${k}`);
      const f = path.join(MODELI, p, m.pot);
      assert.ok(fs.existsSync(f), `${p}/index.js: ${m.pot} ne obstaja`);
      assert.equal(vsiId.get(m.id), rel(f), `${p}/index.js: id ${m.id} se ne ujema z info.id v ${m.pot}`);
      vKazalih.add(m.id);
    }
  }
  // Simulacije »3d-<id>« v katalogu kažejo na obstoječ model iz kazala.
  const katalog = fs.readFileSync(path.join(ROOT, "public", "sim", "katalog.js"), "utf8");
  for (const [, id] of katalog.matchAll(/["']3d-([a-z0-9-]+)["']/g)) assert.ok(vKazalih.has(id), `katalog: 3d-${id} ni v nobenem kazalu področja`);
});

async function withServer(fn) {
  const app = createApp(openDb(":memory:"), { accounts: true, scheduler: false, log: { error() {}, info() {}, warn() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    await fn((p, opts) => fetch(base + p, { redirect: "manual", ...opts }));
  } finally {
    server.close();
  }
}

test("CSP: /3d doda samo 'wasm-unsafe-eval', drugje ostane stroga", async () => {
  assert.equal(cspFor3d({ "default-src": ["'self'"], "script-src": ["'self'"] }), "default-src 'self'; script-src 'self' 'wasm-unsafe-eval'");
  await withServer(async (get) => {
    const stran = await get("/3d");
    assert.equal(stran.status, 200);
    const csp = stran.headers.get("content-security-policy");
    const skripte = csp.split(";").find((d) => d.trim().startsWith("script-src"));
    assert.match(skripte, /'self'/);
    assert.match(skripte, /'wasm-unsafe-eval'/);
    assert.ok(!/unsafe-inline|'unsafe-eval'|https?:|\*/.test(skripte), skripte);
    assert.match(csp, /object-src 'none'/);
    assert.match(csp, /frame-ancestors 'none'/);
    const html = await stran.text();
    assert.ok(!/<script(?![^>]*\bsrc=)[^>]*>/i.test(html), "3d.html ne sme imeti vrinjenih skript");
    assert.ok(!/importmap/.test(html));
    assert.ok(!/\son[a-z]+=/i.test(html), "3d.html brez atributov on…");
    const domov = (await get("/")).headers.get("content-security-policy");
    assert.ok(!/wasm-unsafe-eval/.test(domov), "glavna stran ne sme dovoliti wasm");
    assert.equal((await get("/3d/")).status, 200); // vse poti na strani so absolutne
    // three: jedro in dodatki; dodatki uvažajo three s polno potjo (brez importmap).
    const jedro = await get("/vendor/three/build/three.module.js");
    assert.equal(jedro.status, 200);
    assert.match(jedro.headers.get("content-type"), /javascript/);
    const gltf = await get("/vendor/three/examples/jsm/loaders/GLTFLoader.js");
    assert.equal(gltf.status, 200);
    assert.match(gltf.headers.get("content-type"), /javascript/);
    const src = await gltf.text();
    assert.ok(!/from\s*['"]three['"]/.test(src), "dodatek še uvaža golo 'three'");
    assert.match(src, /from\s*"\/vendor\/three\/build\/three\.module\.js"/);
    assert.equal((await get("/vendor/three/examples/jsm/../../package.json")).status === 200, false);
    // Seznam modelov z različicami za predpomnilnik.
    const seznam = await (await get("/3d/modeli/seznam.json")).json();
    assert.ok(seznam.datoteke["telo/okostje.glb"]?.v, "seznam brez različice okostja");
    assert.ok(seznam.datoteke["telo/okostje.glb"].b > 0);
    assert.ok(Array.isArray(seznam.podrocja));
    assert.ok(Array.isArray(seznam.viri));
    for (const p of seznam.viri) assert.ok(fs.existsSync(path.join(MODELI, p, "viri.json")), p);
    for (const p of seznam.podrocja) assert.ok(fs.existsSync(path.join(MODELI, p, "index.js")), p);
  });
});

test("prepis uvozov three: golo 'three' postane polna pot, drugo ostane", () => {
  const izhod = rewriteThreeImports(`import { A } from 'three';\nimport * as T from "three";\nimport "three";\nimport x from "three/addons/x.js";\nconst s = "three";`);
  assert.equal((izhod.match(/"\/vendor\/three\/build\/three\.module\.js"/g) || []).length, 3);
  assert.match(izhod, /"three\/addons\/x\.js"/);
  assert.match(izhod, /const s = "three";/);
});

test("prevodi: vsak ključ a3.* iz public/3d je v sl.js", () => {
  const kode = datoteke(D3, ".js").filter((f) => !f.includes(`${path.sep}modeli${path.sep}`));
  kode.push(path.join(ROOT, "public", "laboratorij.js"), path.join(ROOT, "mobile", "src", "app", "atlas.tsx"));
  const kljuci = new Set();
  for (const f of kode) {
    const src = fs.readFileSync(f, "utf8");
    for (const [, k] of src.matchAll(/\bt\(\s*["'`]((?:a3|lab)\.[A-Za-z0-9_.]+)["'`]/g)) kljuci.add(k);
  }
  assert.ok(kljuci.size > 40, `najdenih le ${kljuci.size} ključev`);
  const manjka = [...kljuci].filter((k) => !(k in sl));
  assert.deepEqual(manjka, []);
  // Ključi, sestavljeni v kodi (a3.l.<sloj>, a3.area.<področje>), obstajajo za vse vrednosti.
  for (const p of PODROCJA) assert.ok(`a3.area.${p}` in sl, `a3.area.${p}`);
  for (const s of ["okostje", "sklepi", "misice", "organi", "zile", "zivcevje", "limfni", "koza"]) assert.ok(`a3.l.${s}` in sl, `a3.l.${s}`);
});

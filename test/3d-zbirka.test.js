// Zbirka /3d in pregledovalnik na strani (docs/3d.md »Zbirka in pregledovalnik«): iskanje brez strešic, sličice
// modelov (obstoječ model, majhna datoteka, seznam iz strežnika), Evklidova tipkovnica na strani in novi ključi prevodov.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { brezStresic, najdi } from "../public/3d/iskanje.js";
import { modelList, PODROCJA } from "../server/tri-d.js";
import sl from "../public/i18n/sl.js";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const D3 = path.join(ROOT, "public", "3d");
const SLICICE = path.join(D3, "slicice");

const MODELI = [
  { id: "srcna", naslov: "Srčna mišična celica", opis: "Razvejana prečno progasta celica.", podrocjeIme: "Celice" },
  { id: "atom", naslov: "Atom", opis: "Atomi od vodika do kriptona.", podrocjeIme: "Kemija" },
  { id: "celica", naslov: "Živalska celica", opis: "Prerez celice brez celične stene.", podrocjeIme: "Celice" },
];

test("search ignores case and diacritics, needs every word, ranks title matches first", () => {
  assert.equal(brezStresic("Ščž ĆĐ"), "scz cđ");
  assert.deepEqual(najdi(MODELI, "srcna MISICNA").map((m) => m.id), ["srcna"]);
  assert.deepEqual(najdi(MODELI, "   ").map((m) => m.id), []);
  assert.deepEqual(najdi(MODELI, "kripton").map((m) => m.id), ["atom"], "opis is searched too");
  assert.deepEqual(najdi(MODELI, "celice").map((m) => m.id).sort(), ["celica", "srcna"], "area name and opis are searched");
  const z = [{ id: "k", naslov: "Kvasovka", opis: "Ni atom." }, ...MODELI];
  assert.deepEqual(najdi(z, "atom").map((m) => m.id), ["atom", "k"], "title match before opis match");
  assert.deepEqual(najdi(MODELI, "celica atom").map((m) => m.id), [], "all words must match");
});

test("every thumbnail belongs to a model, is a small WebP and is listed by the server", async () => {
  const ids = new Set(["atlas"]);
  for (const p of PODROCJA) {
    const f = path.join(D3, "modeli", p, "index.js");
    if (!fs.existsSync(f)) continue;
    for (const m of (await import(pathToFileURL(f).href)).default) ids.add(m.id);
  }
  const slike = fs.existsSync(SLICICE) ? fs.readdirSync(SLICICE) : [];
  for (const f of slike) {
    assert.match(f, /\.webp$/, `${f}: only .webp in public/3d/slicice`);
    const id = f.slice(0, -5);
    assert.ok(ids.has(id), `${f}: no model with id ${id} (rerun node scripts/3d-slicice.cjs or delete it)`);
    const buf = fs.readFileSync(path.join(SLICICE, f));
    assert.equal(buf.subarray(8, 12).toString("ascii"), "WEBP", `${f}: not a WebP file`);
    assert.ok(buf.length <= 60 * 1024, `${f}: ${(buf.length / 1024).toFixed(0)} KB > 60 KB`);
  }
  assert.deepEqual(modelList().slicice, slike.map((f) => f.slice(0, -5)).sort());
});

test("/3d page loads the Evklid keyboard and its colours, the viewer page mode has its strings", () => {
  const html = fs.readFileSync(path.join(ROOT, "public", "3d.html"), "utf8");
  assert.match(html, /src="\/tipkovnica-strani\.js"/);
  assert.match(html, /href="\/tipkovnica\.css"/);
  const css = fs.readFileSync(path.join(D3, "3d.css"), "utf8");
  // tipkovnica.css reads app tokens that /3d (no style.css) must define
  const tk = fs.readFileSync(path.join(ROOT, "public", "tipkovnica.css"), "utf8");
  const blok = css.match(/html\.k3-stran \{([^}]*)\}/)[1];
  const iz = new Set([...tk.matchAll(/var\(--([a-z0-9-]+)/g)].map((m) => m[1]).filter((v) => !/^(tk-|varno-|cols$)/.test(v)));
  for (const v of iz) assert.ok(blok.includes(`--${v}:`), `--${v} missing in html.k3-stran`);
  for (const k of ["a3.searchModels", "a3.areas", "a3.all", "a3.area.telo", "a3.recent", "a3.seeAll", "a3.results", "a3.noModels", "a3.prevModel", "a3.nextModel", "a3.position", "a3.fullscreen", "a3.exitFullscreen", "a3.about", "a3.hintModel", "a3.hintModelMouse", "a3.zoomIn", "a3.zoomOut", "sc.try"]) {
    assert.ok(typeof sl[k] === "string" && sl[k], `missing ${k}`);
  }
  const src = fs.readFileSync(path.join(D3, "stran.js"), "utf8");
  for (const k of [...src.matchAll(/t\("(a3\.[A-Za-z.]+)"/g)].map((m) => m[1])) assert.ok(sl[k], `stran.js uses unknown key ${k}`);
});

test("free rotation turns the camera over the pole around the target, keeping distance and an orthogonal up", async () => {
  const THREE = await import("three");
  const { zavrtiOkoli } = await import("../public/3d/vrtenje.js");
  const cilj = new THREE.Vector3(0.2, -0.1, 0);
  const poz = new THREE.Vector3(0.2, -0.1, 3);
  const gor = new THREE.Vector3(0, 1, 0);
  // drag down: camera moves up (sees the top), like OrbitControls
  zavrtiOkoli(THREE, poz, gor, cilj, 0, 0.3);
  assert.ok(poz.y > cilj.y, "camera goes up on a downward drag");
  // drag right: camera moves left
  const p2 = new THREE.Vector3(0, 0, 3), g2 = new THREE.Vector3(0, 1, 0);
  zavrtiOkoli(THREE, p2, g2, new THREE.Vector3(), 0.3, 0);
  assert.ok(p2.x < 0, "camera goes left on a rightward drag");
  // 20 steps of 0.2 rad down = 4 rad: past the pole without stopping (an orbit would clamp at π)
  const p3 = new THREE.Vector3(0, 0, 3), g3 = new THREE.Vector3(0, 1, 0), c3 = new THREE.Vector3();
  for (let i = 0; i < 20; i++) zavrtiOkoli(THREE, p3, g3, c3, 0, 0.2);
  assert.ok(Math.abs(p3.distanceTo(c3) - 3) < 1e-9, "distance kept");
  assert.ok(Math.abs(g3.dot(p3.clone().normalize())) < 1e-9, "up stays perpendicular to the view");
  const kot = Math.acos(new THREE.Vector3(0, 0, 1).dot(p3.clone().normalize()));
  assert.ok(Math.abs(kot - (2 * Math.PI - 4)) < 1e-6, `turned 4 rad over the pole, angle from start ${kot}`);
});

test("every 3D stage (viewer and atlas) has the rotation mode button, with strings in every language", () => {
  const scena = fs.readFileSync(path.join(D3, "scena.js"), "utf8");
  assert.match(scena, /export function poveziGumbVrtenja/);
  assert.match(scena, /nacinVrtenja,/, "kit exposes nacinVrtenja");
  for (const f of ["pregledovalnik.js", "atlas.js"]) assert.match(fs.readFileSync(path.join(D3, f), "utf8"), /poveziGumbVrtenja\(btnVrtenje, kit, icon, t\)/, f);
  const ui = path.join(ROOT, "public", "i18n", "ui");
  assert.match(scena, /"hoja"/, "walk mode exists");
  for (const k of ["a3.rotFree", "a3.rotUpright", "a3.rotWalk", "a3.walkHint", "a3.walkForward", "a3.walkBack"]) {
    assert.ok(sl[k], `sl ${k}`);
    for (const f of fs.readdirSync(ui)) assert.ok(JSON.parse(fs.readFileSync(path.join(ui, f), "utf8"))[k], `${f} ${k}`);
  }
});

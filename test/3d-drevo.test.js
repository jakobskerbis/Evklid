// Drevo 3D sveta (public/3d/drevo.js, docs/3d.md »Drevo 3D sveta«): vsak model je v drevesu, vsaka veja ima ikono v
// vsakem slogu in ime v vseh jezikih, pot iz naslova je varna, slog Igriv in neznan slog uporabita ikone Čist.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { DREVO, BARVE, SLOGI_IKON, slogIkon, ikonaVeje, poPoti, modeliVeje, vsiModeliDrevesa, vseVeje } from "../public/3d/drevo.js";
import { PODROCJA } from "../public/3d/pogodba.js";
import sl from "../public/i18n/sl.js";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const D3 = path.join(ROOT, "public", "3d");

async function vsiModeli() {
  const ids = [];
  for (const p of PODROCJA) {
    const f = path.join(D3, "modeli", p, "index.js");
    if (fs.existsSync(f)) for (const m of (await import(pathToFileURL(f).href)).default) ids.push(m.id);
  }
  return ids;
}

test("drevo: every model is in a branch and every branch model exists", async () => {
  const ids = await vsiModeli();
  const vDrevesu = vsiModeliDrevesa();
  for (const id of ids) assert.ok(vDrevesu.has(id), `${id} ni v nobeni veji drevesa (public/3d/drevo.js)`);
  for (const id of vDrevesu) assert.ok(ids.includes(id), `${id} v drevesu, a modela ni`);
});

test("drevo: branches match the rendered icons, every style has every icon, top branches have a group colour", () => {
  const veje = vseVeje();
  assert.equal(new Set(veje).size, veje.length, "podvojen id veje");
  const motivi = fs.readFileSync(path.join(ROOT, "scripts", "3d-ikone-drevo", "motivi.py"), "utf8");
  const blok = motivi.slice(motivi.indexOf("MOTIVI = {"), motivi.indexOf("\n}", motivi.indexOf("MOTIVI = {")));
  assert.deepEqual([...veje].sort(), [...blok.matchAll(/^\s+"([a-z-]+)": \(/gm)].map((m) => m[1]).sort());
  const jedro = fs.readFileSync(path.join(ROOT, "scripts", "3d-ikone-drevo", "jedro.py"), "utf8");
  assert.deepEqual(SLOGI_IKON, [...jedro.match(/^SLOGI = \(([^)]*)\)/m)[1].matchAll(/"([a-z]+)"/g)].map((m) => m[1]));
  for (const s of SLOGI_IKON) for (const id of veje) assert.ok(fs.existsSync(path.join(ROOT, "public", ikonaVeje(id, s))), `${s}/${id}.webp`);
  for (const v of DREVO) assert.ok(BARVE[v.sk], `${v.id}: skupina`);
  for (const v of veje) {
    assert.ok(sl[`a3.tree.${v}`], `sl a3.tree.${v}`);
    for (const f of fs.readdirSync(path.join(ROOT, "public", "i18n", "ui"))) assert.ok(JSON.parse(fs.readFileSync(path.join(ROOT, "public", "i18n", "ui", f), "utf8"))[`a3.tree.${v}`], `${f} a3.tree.${v}`);
  }
});

test("drevo: path from the address stops at an unknown or non-branch part; counts skip missing models", () => {
  assert.deepEqual(poPoti("").map((v) => v.id), []);
  assert.deepEqual(poPoti("biologija/telo/organi").map((v) => v.id), ["biologija", "telo", "organi"]);
  assert.deepEqual(poPoti("biologija/nic/organi").map((v) => v.id), ["biologija"]);
  assert.deepEqual(poPoti("biologija/telo/atlas").map((v) => v.id), ["biologija", "telo"], "atlas is a link, not a branch");
  assert.deepEqual(poPoti("<script>").map((v) => v.id), []);
  const kem = DREVO.find((v) => v.id === "kemija");
  assert.equal(modeliVeje(kem).length, 7);
  assert.equal(modeliVeje(kem, new Set(["atom", "dnk"])).length, 2);
  const telo = poPoti("biologija/telo").at(-1);
  assert.ok(modeliVeje(telo).includes("atlas"));
  assert.equal(modeliVeje(DREVO[0]).filter((x) => x === "fotosinteza").length, 1, "a model in two branches counts once");
});

test("drevo: Igriv and unknown styles use the Čist icons", () => {
  assert.equal(slogIkon("igriv"), "cist");
  assert.equal(slogIkon(undefined), "cist");
  assert.equal(slogIkon("../x"), "cist");
  assert.equal(slogIkon("egipt"), "egipt");
  assert.equal(ikonaVeje("atom", "bagdad"), "/3d/ikone-drevo/bagdad/atom.webp");
});

test("drevo: the /3d hub opens on the tree, with the microscope next to search and no area chips", () => {
  const src = fs.readFileSync(path.join(D3, "stran.js"), "utf8");
  assert.match(src, /from "\.\/drevo\.js"/);
  assert.match(src, /addEventListener\("storage", obSlogu\)/, "style change swaps the icons");
  assert.doesNotMatch(src, /k3-cip/);
  assert.match(src, /k3-hub-mikroskop/);
  for (const k of ["a3.treePath", "a3.treeMore"]) assert.ok(sl[k], k);
});

test("drevo: »Uči se → 3D svet« (aplikacija in APK) shows the same tree with style icons", () => {
  const js = fs.readFileSync(path.join(ROOT, "public", "uci-se.js"), "utf8");
  assert.match(js, /import\("\.\/3d\/drevo\.js"\)/);
  assert.match(js, /ikonaVeje\(v\.id, slog\)/);
  assert.match(js, /addEventListener\?\.\("evklid:era", obSlogu\)/, "style change redraws the icons");
  assert.doesNotMatch(js, /uci-3d-atlas/, "old area card list is gone");
  const css = fs.readFileSync(path.join(ROOT, "public", "uci.css"), "utf8");
  assert.match(css, /\.uci-3d-veja-ikona \{/);
});

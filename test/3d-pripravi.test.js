// Hitrost nalaganja 3D modelov na prenosniku z Windows (j, 25. 11. 2026: »počasno je nalaganje modelov, ko so naloženi
// vse deluje«). Senčilniki novega modela se prevedejo hkrati (renderer.compileAsync), preden se model prvič nariše, in
// deli celic z isto vrsto površine si delijo en program (številke so enotne spremenljivke, ne besedilo senčilnika).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const pub = new URL("../public/3d/", import.meta.url);
let THREE = null;
try {
  THREE = await import("three");
} catch {
  /* three pride s 3D kompletom */
}

test("scena: pripravi prevede senčilnike vidnih delov hkrati in izris med tem počaka", () => {
  const src = readFileSync(new URL("scena.js", pub), "utf8");
  assert.match(src, /function pripravi\(\)/);
  assert.match(src, /renderer\.compileAsync\(scene, camera\)/);
  assert.match(src, /if \(pripravljam > 0\) \{/, "zanka ne riše, dokler se programi prevajajo");
  assert.match(src, /scene\.traverseVisible\(\(o\) => vidni\.add\(o\)\)/, "skriti deli se ne prevedejo vnaprej (isti programi kot prej)");
  assert.match(src, /composer\.readBuffer/, "z okluzijo za cilj composerja (brez preslikave tonov)");
  assert.match(src, /setTimeout\(r, 20000\)/, "varovalka, če gonilnik ne javi konca");
  assert.match(src, /\n    pripravi,\n/, "kit.pripravi");
  const pr = readFileSync(new URL("pregledovalnik.js", pub), "utf8");
  assert.match(pr, /kit\.pripravi \? kit\.pripravi\(\)/);
  assert.match(pr, /nalagEl && !nalagEl\.classList\.contains\("napaka"\)\) nalaganje\(null\)/, "plast nalaganja ostane do konca prevajanja");
  assert.match(src, /catch \(err\) \{\n {6}\/\/ compile\(\) teče takoj/, "napaka pri prevajanju ne ustavi risanja");
  assert.match(src, /aoVkljucen = true;\n {6}narisi\(\);\n.*\n {6}pripravi\(\);/, "programi za cilj okluzije hkrati");
  const at = readFileSync(new URL("atlas.js", pub), "utf8");
  assert.match(at, /await kit\.pripravi\?\.\(\); \/\/ senčilniki plasti/);
  assert.match(at, /if \(uvod\) await kit\.pripravi\?\.\(\);/, "uvod: telo je bilo med nalaganjem skrito");
});

test("celice: deli z isto vrsto površine si delijo program, številke so enotne spremenljivke", { skip: !THREE }, async () => {
  const { videzCelic } = await import(new URL("celice-videz.js", pub));
  const v = videzCelic(THREE, { hi: true });
  const a = v.sencilo(new THREE.MeshPhysicalMaterial(), { vr: 0, rf: 30, k: 0.6, b: 0.16, s: 0.14 });
  const b = v.sencilo(new THREE.MeshPhysicalMaterial(), { vr: 0, rf: 9, k: 0.4, b: 0.2, s: 0.06 });
  const c = v.sencilo(new THREE.MeshPhysicalMaterial(), { vr: 2, rf: 9 });
  assert.equal(a.customProgramCacheKey(), b.customProgramCacheKey(), "druge številke, isti program");
  assert.notEqual(a.customProgramCacheKey(), c.customProgramCacheKey(), "druga vrsta površine, drug program");
  // Vrednosti zaokrožene kot prej v besedilu senčilnika (F: 4 mesta), zato je slika ista.
  const sh = { uniforms: {}, vertexShader: "#include <common>\n#include <begin_vertex>", fragmentShader: "#include <common>\n#include <color_fragment>\n#include <roughnessmap_fragment>\n#include <normal_fragment_maps>\n#include <opaque_fragment>" };
  b.onBeforeCompile(sh);
  assert.equal(sh.uniforms.zvK.value, 0.004444);
  assert.equal(sh.uniforms.zvB.value, 0.2);
  assert.equal(sh.uniforms.zvPr.value, 0.06);
  assert.deepEqual(sh.uniforms.zvSk.value.toArray(), [9, 9, 9]);
  assert.match(sh.fragmentShader, /uniform float zvK, zvB, zvPr;/);
  assert.doesNotMatch(sh.fragmentShader, /0\.004444/, "številka ni v besedilu senčilnika");
  // kopija (izbrani del) ima svoje enotne spremenljivke in isti program
  assert.equal(b.clone().customProgramCacheKey(), b.customProgramCacheKey());
});

test("organi: številke in barve tkiv so enotne spremenljivke, ključ programa je besedilo senčilnika", () => {
  const src = readFileSync(new URL("organ.js", pub), "utf8");
  assert.match(src, /const kljucPrograma = \["org2", gGlava, gLuci, gBarva, gHrap, gNormala, gSenca, gIzhod\]/);
  assert.match(src, /Object\.assign\(sh\.uniforms, U\);/);
  assert.match(src, /\+b\.r\.toFixed\(4\), \+b\.g\.toFixed\(4\), \+b\.b\.toFixed\(4\)/, "barve zaokrožene kot prej vec3()");
  // pokrov reza: barva v ključu samo, kjer je v besedilu senčilnika
  assert.match(src, /const barvaVBesedilu = vol \? !t\.rezRavna : vr && !presek\.robBarva;/);
});

// Srce, krog 7: rezna ploskev brez mreže pik (smer vlaken stalna po celicah), glavničaste mišice ušes v peki (atribut
// GREBEN), tanjša in mehkeje razporejena maščoba v žlebovih, levo uho skrito v prerezu.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const KOREN = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const beri = (...p) => fs.readFileSync(path.join(KOREN, ...p), "utf8");

test("organ.js: vzorec vlaken na pokrovu ima smer stalno po celicah (brez ročice absolutne lege)", () => {
  const src = beri("public", "3d", "organ.js");
  assert.match(src, /const CELICA_VLAKEN = 0\.006;/, "celica 6 mm (3 mm: šivi med celicami kot luske)");
  assert.match(src, /dot\( orgQm - orgCc, orgFp \)/);
  assert.doesNotMatch(src, /dot\( orgQm, orgFp \)/, "projekcija absolutne lege vrne mrežo pik");
  assert.match(src, /float orgVlH = /, "izbočenost iz širših pasov kot barva");
});

test("peka.py in srce_ct.py: grebeni glavničastih mišic (GREBEN) samo na visoki mreži", () => {
  const peka = beri("scripts", "atlas", "peka.py");
  assert.match(peka, /greben=0\.0/, "privzeto brez grebenov (drugi organi nespremenjeni)");
  assert.match(peka, /color_attributes\.get\("GREBEN"\)/);
  assert.match(peka, /for ime_ in \("PEKA", "OSI", "GREBEN"\)/, "atribut ne gre v GLB");
  const ct = beri("scripts", "atlas", "srce_ct.py");
  assert.match(ct, /_greben\(_mesh\("Left auricle", Vu, Fu\), levo_uho\.greben\)/);
  assert.match(ct, /_greben\(_mesh\("Right auricle \(lastno\)", Vr, Fr\), levo_uho\.greben\)/);
  assert.match(beri("scripts", "atlas", "izvozi-organe.py"), /greben=0\.000\d+/);
});

test("srce_ct.py: maščoba v žlebovih tanjša, rob dosega pojenja, votli veni le tanka plast", () => {
  const ct = beri("scripts", "atlas", "srce_ct.py");
  assert.match(ct, /3\.4e-3 \* g\(d_av, 0\.0075\)/);
  assert.match(ct, /np\.minimum\(dd\[m\] \* 0\.6 \+ 0\.0004, 0\.0036\) \* np\.clip\(\(do - dd\[m\]\) \/ \(0\.4 \* do\), 0, 1\)/);
  assert.match(ct, /h\[vv\] = np\.minimum\(h\[vv\], 0\.0016\)/);
});

test("srce.json: levo srčno uho v prerezu skrito (poševen prerez votle vrečke je bil nemiren)", () => {
  const j = JSON.parse(beri("public", "3d", "modeli", "organi-3d", "srce.json"));
  assert.ok(j.pogledi.prerez.skrijDele.includes("levo-srcno-uho")); // z možnostjo ORGANI_HH229=1 je uho del stene in ostane
  assert.ok(j.deli.some((d) => d.id === "levo-srcno-uho"), "del ostane v seznamu (celota)");
});

test("organi.mjs: telefon srca ima mejo po dodelavi in korak 800 px pred 768 px", () => {
  const src = beri("scripts", "atlas", "organi.mjs");
  // krog 8: dodelava telefon zmanjša (ena raven zgostitve epikarda, trabekule en UV), meja je zato višja
  assert.match(src, /organ === "srce" \? \(pripona \? \(process\.env\.ORGANI_HH229 === "1" \? 96 : -96\) : 64\) \* 1024 : 0/);
  assert.match(src, /\[82, 66, 80, 800\], \[80, 62, 78, 800\], \[82, 66, 80, 768\]/);
  const glb = fs.statSync(path.join(KOREN, "public", "3d", "modeli", "organi-3d", "srce-telefon.glb")).size;
  assert.ok(glb <= 1992294, `srce-telefon.glb ${glb} B`);
});

test("skrijDele: skupina skrije tudi svoje dele (organ.js in rez-stena.mjs), venčne žile v prerezu skrite", () => {
  assert.match(beri("public", "3d", "organ.js"), /if \(d\.skupina && skrijDele\.has\(d\.skupina\)\) skrijDele\.add\(d\.id\)/);
  assert.match(beri("scripts", "atlas", "rez-stena.mjs"), /if \(d\.skupina && brez\.has\(d\.skupina\)\) brez\.add\(d\.id\)/);
  const j = JSON.parse(beri("public", "3d", "modeli", "organi-3d", "srce.json"));
  const skrij = new Set(j.pogledi.prerez.skrijDele);
  const vencne = j.deli.filter((d) => d.skupina === "vencne-arterije" || d.skupina === "vencne-vene");
  assert.ok(vencne.length >= 6 && skrij.has("vencne-arterije") && skrij.has("vencne-vene"));
});

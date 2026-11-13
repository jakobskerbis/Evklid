// Oko krog 10 in srce krog 9: kite položene na zrklo po poenostavitvi (kite_na_zrklo, tudi na visoki mreži peke),
// kita v barvi in snovi beločnice (organ.js kita), mehak limbus, globinski zamik žilnice, rez skozi vidni živec;
// obrnjena tanka stena šteje kot stena (rez-stena), sploščenje epikarda telefona po dolžini roba (srce-dodelava).
// Zagon: node --test test/3d-organi-krog10.test.js

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { delezStene } from "../scripts/atlas/rez-stena.mjs";
import { korakiSploscenja } from "../scripts/atlas/srce-dodelava.mjs";

const KOREN = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const beri = (...p) => fs.readFileSync(path.join(KOREN, ...p), "utf8");
const json = (ime) => JSON.parse(beri("public", "3d", "modeli", "organi-3d", ime));

const V = (a, b, c, d) => [[a, c, c], [b, c, c], [b, d, c], [a, d, c], [a, c, d], [b, c, d], [b, d, d], [a, d, d]];
const F = [[0, 2, 1], [0, 3, 2], [4, 5, 6], [4, 6, 7], [0, 1, 5], [0, 5, 4], [2, 3, 7], [2, 7, 6], [1, 2, 6], [1, 6, 5], [3, 0, 4], [3, 4, 7]];
// kvader [a, b] × [c, d]² kot trikotniki; obrni = navitje navznoter (stena, ki se je pri poenostavitvi obrnila)
const kvader = (a, b, c, d, obrni) => Float64Array.from(F.flatMap(([i, j, k]) => (obrni ? [i, k, j] : [i, j, k]).flatMap((x) => V(a, b, c, d)[x])));

test("rez-stena: kratek odsek z negativnim navitjem (obrnjena tanka stena) je stena, dolg ni", () => {
  const mm = 0.001, n = [20, 10, 10], mreza = { lo: [0, 0, 0], korak: mm, n };
  const vsota = (tri) => delezStene(tri, mreza).delez.reduce((s, x) => s + x, 0);
  const prava = vsota(kvader(4 * mm, 6 * mm, 2 * mm, 8 * mm, false));
  const tanka = vsota(kvader(4 * mm, 6 * mm, 2 * mm, 8 * mm, true));
  const debela = vsota(kvader(2 * mm, 18 * mm, 2 * mm, 8 * mm, true));
  assert.ok(prava > 50, `prava stena ${prava}`);
  assert.ok(Math.abs(tanka - prava) / prava < 0.05, `obrnjena 2 mm stena šteje kot stena (${tanka} : ${prava})`);
  assert.equal(debela, 0, "obrnjen 16 mm kvader (votlina med odprtimi deli) ni stena");
});

test("srce-dodelava: sploščenje epikarda ima enako širino pri gosti in redki mreži", () => {
  assert.equal(korakiSploscenja(0.00217), 300, "računalnik (dve ravni zgostitve) kot prej");
  const tel = korakiSploscenja(0.0058);
  assert.ok(tel >= 30 && tel <= 60, `telefon (rob 5,8 mm) ${tel} korakov`);
  assert.equal(korakiSploscenja(0.02), 30, "spodnja meja");
});

test("oko: kite na zrklo po poenostavitvi in na visoki mreži, brez dvostranske mišice", () => {
  const m = beri("scripts", "atlas", "oko_misice.py");
  const kita = +m.match(/^KITA_ODMIK = ([\d.]+)/m)[1];
  assert.ok(kita >= 0.0001 && kita <= 0.0003, `kita ${kita * 1000} mm nad beločnico`); // krog 11: 0,15 mm
  assert.match(m, /^def kite_na_zrklo\(objekti, cfg\):/m);
  assert.match(m, /^PAHLJACA = 0\.\d+/m, "kita se proti narastišču rahlo razširi");
  for (const ime of ["Superior oblique", "Inferior oblique", "Lateral rectus", "Medial rectus", "Superior rectus", "Inferior rectus"])
    assert.ok(m.includes(`("${ime} muscle"`), `${ime} v PLASTI`);
  const izv = beri("scripts", "atlas", "izvozi-organe.py");
  // m1: mišice so lastna geometrija (trakovi z vgrajeno kito), kite_na_zrklo ostane za izvirnike Z-Anatomy
  assert.match(izv, /dodaj=\["ocesne_misice", "ocesne_misice_lastne"(, "oko_dodatki_m4")?\], nedotakni=r"\(rectus\|oblique\) muscle/);
  assert.match(izv, /types\.SimpleNamespace\(name=r\[0\], data=r\[1\]\) for r in osnovni/, "isti popravek na izvirnikih (visoka mreža peke)");
  const oko = json("oko.json");
  const mis = oko.tkiva["mišica"];
  assert.equal(mis.dvostransko, undefined, "mišica ni več dvostranska");
  assert.ok(mis.lak < 0.45, "mišica ni »mokra« (lak < 0,45)");
  assert.ok(mis.kita?.barva && mis.kita.meja?.length === 2, "kita prevzame barvo beločnice");
});

test("oko.json, organ.js: limbus, zamik žilnice, rez skozi vidni živec, leča v rezu", () => {
  const oko = json("oko.json");
  const L = oko.tkiva["roženica"].limbus;
  assert.ok(L.barva2 && L.r1 - L.r0 >= 0.001, "limbus: širok prehod v barvo beločnice");
  assert.ok(oko.pogledi.celota.tkiva["žilnica"].zamik > 0, "žilnica v celoti zamaknjena za beločnico");
  // m1: leča v prerezu ostane cela in prosojna (bikonveksna oblika, ocena m1), prej rezana
  assert.equal(oko.tkiva["leča"].brezReza, true);
  assert.ok(oko.tkiva["leča"].prosojnost < 1, "cela leča je prosojna");
  const [r] = oko.prerez.ravnine;
  const disk = oko.tkiva["mrežnica"].mreznicaZile.disk;
  const dd = r.n.reduce((s, x, i) => s + x * disk[i], 0) + r.d;
  assert.ok(Math.abs(dd) < 0.0003, `ravnina reza gre skozi papilo (${(dd * 1000).toFixed(2)} mm)`);
  const js = beri("public", "3d", "organ.js");
  for (const k of ["function kitaGLSL", "function zamakni", "z.barva2", "orgZn"]) assert.ok(js.includes(k), k);
  const dod = beri("scripts", "atlas", "oko-dodelava.mjs");
  assert.match(dod, /barva2: "#[0-9a-f]{6}"/);
});

test("srce: debelejša arterijska vez, pokrov aorte in pljučnih ven v tonu stene, velike žile brez šivov žilic", () => {
  const z = beri("scripts", "atlas", "srce_zile.py");
  const [, r, raz, spl] = z.match(/^VEZ_R, VEZ_RAZSIR, VEZ_SPLOSCI = ([\d.]+), ([\d.]+), ([\d.]+)/m).map(Number);
  assert.ok(r >= 0.002 && r + raz >= 0.003 && spl <= 0.3, "vrvica Ø ≥ 4 mm, ob stenah širša, rahlo sploščena");
  const s = json("srce.json");
  assert.notEqual(s.tkiva.aorta.rez, "#d9c8b8", "pokrov aorte ni bleda lisa v pretinu");
  // krog 11: žilice senčilnika so na UV-šivih velikih žil risale »sestavljanko« (ocena k5), zato jih ni; ostanejo lise
  for (const k of ["aorta-lok", "pljucna-lok", "vena"]) assert.ok(!s.tkiva[k].zile && s.tkiva[k].lise > 0, `${k}: brez žilic, z lisami`);
});

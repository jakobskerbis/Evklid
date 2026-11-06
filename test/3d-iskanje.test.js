// »Uči se → 3D svet« (j, 6. 11. 2026): iskanje po ploščicah tudi po DELIH modelov in sinonimih, brez razlike v velikih
// črkah in šumnikih; kazalo public/3d/iskalnik.json je ažurno; »Nadaljuj« bere zadnji model v try/catch.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import SL from "../public/i18n/sl.js";
import { isciPloscice, zadnjiModel, paramDela } from "../public/3d/iskanje.js";
import { zgradiKazalo } from "../scripts/3d/indeks.mjs";

const bere = (p) => JSON.parse(fs.readFileSync(new URL(`../public/3d/${p}`, import.meta.url), "utf8"));
const kazalo = bere("iskalnik.json");
const sinonimi = bere("sinonimi.json");
const modeli = ["celica-zivalska", "celica-rastlinska", "organ-srce", "telesa", "soncni-sistem", "dnk"].map((id) => ({ id, naslov: { "celica-zivalska": "Živalska celica", "celica-rastlinska": "Rastlinska celica", "organ-srce": "Srce", telesa: "Geometrijska telesa", "soncni-sistem": "Osončje", dnk: "DNK" }[id], opis: "", podrocjeIme: "", predmetIme: "", sinonimi: sinonimi[id] || [], deli: kazalo.modeli[id] || [] }));
const ploscice = [
  { id: "atlas", naslov: "Atlas človeškega telesa", opis: "", podrocjeIme: "", predmetIme: "", sinonimi: sinonimi.atlas, deli: kazalo.atlas.map(([id, ime, la]) => [ime, "izberi", id, la]) },
  ...modeli,
];
const prvi = (q) => isciPloscice(ploscice, q)[0];

test("iskanje po delih: mitohondrij, prekat, kocka, stegnenica najdejo pravi model in del", () => {
  assert.equal(prvi("mitohondrij").p.id, "celica-zivalska");
  assert.match(prvi("mitohondrij").del[0], /^Mitohondrij/);
  assert.equal(prvi("prekat").p.id, "organ-srce");
  assert.match(prvi("prekat").del[0], /prekat/i);
  assert.equal(prvi("kocka").p.id, "telesa");
  assert.deepEqual(paramDela(prvi("kocka").del)?.constructor, Object);
  const s = prvi("stegnenica");
  assert.equal(s.p.id, "atlas");
  assert.equal(s.del[1], "izberi");
  assert.equal(s.del[2], "Femur.r"); // tap odpre atlas na tej strukturi (/3d#atlas?izberi=Femur.r)
  assert.deepEqual(paramDela(s.del), { izberi: "Femur.r" });
});

test("iskanje: brez razlike v velikih črkah in šumnikih, naslov prej kot del, sinonimi", () => {
  assert.equal(prvi("ZIVALSKA CELICA").p.id, "celica-zivalska");
  assert.equal(prvi("zivalska").del, null); // ujel je že naslov: del se ne pokaže
  assert.equal(prvi("MITOHONDRIJ").p.id, prvi("mitohondrij").p.id);
  assert.equal(prvi("kardio").p.id, "organ-srce"); // sinonim
  assert.equal(prvi("planeti").p.id, "soncni-sistem");
  assert.equal(prvi("dvojna vijacnica").p.id, "dnk");
  assert.deepEqual(isciPloscice(ploscice, "zzzxq"), []);
  assert.deepEqual(isciPloscice(ploscice, "   "), []);
});

test("sinonimi.json: vsak id obstaja v zbirki, besedila niso prazna", () => {
  for (const [id, l] of Object.entries(sinonimi)) {
    assert.ok(id === "atlas" || kazalo.modeli[id], `neznan model ${id}`);
    assert.ok(l.length && l.every((x) => typeof x === "string" && x.trim()), id);
  }
});

test("kazalo delov public/3d/iskalnik.json je ažurno (node scripts/3d/indeks.mjs)", async () => {
  const novo = await zgradiKazalo();
  assert.deepEqual(JSON.parse(JSON.stringify(novo)), kazalo, "zaženi: node scripts/3d/indeks.mjs");
});

test("Nadaljuj: zadnji odprti model, ki še obstaja; pokvarjen ali prazen zapis ne podre ničesar", () => {
  const ids = ["atlas", "organ-srce"];
  assert.equal(zadnjiModel(ids, () => JSON.stringify(["stari-model", "organ-srce", "atlas"])), "organ-srce");
  assert.equal(zadnjiModel(ids, () => null), null);
  assert.equal(zadnjiModel(ids, () => "{ne json"), null);
  assert.equal(zadnjiModel(ids, () => { throw new Error("localStorage blokiran"); }), null);
  assert.equal(zadnjiModel(ids, () => JSON.stringify([1, {}, null])), null);
});

test("besedila nove mreže so v slovenščini (ostalih 32 jezikov preveri i18n.test.js)", () => {
  for (const k of ["search", "atlas", "continue", "part", "try", "showAll"]) assert.ok(SL[`a3.uci.${k}`], k);
});

test("mreža: sticky vrh, 2/3/4/5 stolpcev, spodnji odmik za plavajoči gumb, gumbi ≥ 40 px, sličice brez WebGL", () => {
  const css = fs.readFileSync(new URL("../public/uci.css", import.meta.url), "utf8");
  const js = fs.readFileSync(new URL("../public/uci-3d.js", import.meta.url), "utf8");
  assert.match(css, /\.u3-vrh \{\s*position: sticky; top: -18px;/);
  for (const n of [2, 3, 4, 5]) assert.match(css, new RegExp(`repeat\\(${n}, minmax\\(0, 1fr\\)\\)`));
  assert.match(css, /\.u3-mreza \{[^}]*padding: 0 0 96px/);
  assert.match(css, /\.u3-cip \{[^}]*min-height: 40px/);
  assert.match(css, /\.u3-iskanje \{[^}]*min-height: 48px/);
  assert.match(js, /loading = "lazy"/);
  assert.doesNotMatch(js, /from "[^"]*three|new THREE|getContext|WebGLRenderer/);
});

// »Pravo telo 3D« (public/3d/telo-vh.js): sistemi, celota dela, jasen prikaz, razmik in police.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import * as V from "../public/3d/telo-vh.js";

const oznake = JSON.parse(fs.readFileSync(new URL("../public/3d/rezine-oznake.json", import.meta.url), "utf8")).oznake;

test("vsak ključ oznake ima sistem iz seznama SISTEMI", () => {
  const ids = new Set(V.SISTEMI.map((s) => s.id));
  for (const kl of Object.keys(oznake)) assert.ok(ids.has(V.sistemKljuca(kl)), kl);
  assert.equal(V.sistemKljuca("levi-prekat"), "srce");
  assert.equal(V.sistemKljuca("desna-pljuca"), "dihala");
  assert.equal(V.sistemKljuca("jetra"), "prebavila");
  assert.equal(V.sistemKljuca("maternica"), "secila");
  assert.equal(V.sistemKljuca("veliki-mozgani"), "zivcevje");
  assert.equal(V.sistemKljuca("prsno-vretence-th8"), "kosti");
  assert.equal(V.sistemKljuca("papilarne-misice"), "srce");
  assert.equal(V.sistemKljuca("koza"), "ostalo");
});

test("del organa → celota (levi prekat → srce, vretence → hrbtenica)", () => {
  assert.equal(V.celotaZa("levi-prekat"), "srce");
  assert.equal(V.celotaZa("medprekatni-pretin"), "srce");
  assert.equal(V.celotaZa("prsno-vretence-th8"), "hrbtenica");
  assert.equal(V.celotaZa("mali-mozgani"), "mozgani");
  assert.equal(V.celotaZa("jetra"), null);
  assert.deepEqual(V.deliCelote("srce", ["jetra", "levi-prekat", "desni-prekat"]), ["levi-prekat", "desni-prekat"]);
});

test("jasen prikaz napihne le drobne strukture; prava razmerja nič", () => {
  assert.ok(V.napihZa("srcne-zaklopke", "jasno") > 0);
  assert.ok(V.napihZa("vencne-zile", "jasno") > 0);
  assert.equal(V.napihZa("jetra", "jasno"), 0);
  assert.equal(V.napihZa("srcne-zaklopke", "prava"), 0);
  assert.equal(V.privzetNacin(1), "jasno");
  assert.equal(V.privzetNacin(2), "jasno");
  assert.equal(V.privzetNacin(3), "prava");
  assert.equal(V.privzetaRezina(1), "organi");
  assert.equal(V.privzetaRezina(3), "foto");
});

test("razmik: do polovice na mestu, nato gladko na police; velikost se ne spremeni", () => {
  assert.deepEqual(V.fazaRazmika(0), { razmik: 0, police: 0 });
  assert.deepEqual(V.fazaRazmika(0.25), { razmik: 0.5, police: 0 });
  assert.deepEqual(V.fazaRazmika(0.5), { razmik: 1, police: 0 });
  assert.equal(V.fazaRazmika(1).police, 1);
  assert.ok(Math.abs(V.fazaRazmika(0.75).police - 0.5) < 1e-9);
  assert.deepEqual(V.odmikRazmika([10, 0, 0], [0, 0, 0], 1), [6, 0, 0]);
});

test("police: najprej skupina (sistem), nato velikost (največja levo)", () => {
  const s = [
    { kljuc: "jetra", prostornina: 1900, polmer: 110 },
    { kljuc: "desna-pljuca", prostornina: 1350, polmer: 120 },
    { kljuc: "levi-prekat", prostornina: 217, polmer: 50 },
    { kljuc: "aorta", prostornina: 300, polmer: 200 },
    { kljuc: "vranica", prostornina: 200, polmer: 60 },
    { kljuc: "leva-pljuca", prostornina: 1100, polmer: 115 },
    { kljuc: "prsno-vretence-th8", prostornina: 30, polmer: 25 },
  ];
  const p = V.razvrstiPolice(s, { sirina: 600 });
  assert.deepEqual(p.vrstniRed, ["aorta", "levi-prekat", "desna-pljuca", "leva-pljuca", "jetra", "vranica", "prsno-vretence-th8"]);
  assert.deepEqual(p.vrste.map((v) => v.sistem), ["srce", "dihala", "prebavila", "kosti"]);
  // znotraj vrste od leve proti desni, vrste od zgoraj navzdol
  assert.ok(p.mesta.get("aorta")[0] < p.mesta.get("levi-prekat")[0]);
  assert.ok(p.mesta.get("levi-prekat")[1] < p.mesta.get("desna-pljuca")[1]);
  assert.ok(p.mesta.get("jetra")[1] < p.mesta.get("prsno-vretence-th8")[1]);
  // ozke police (telefon): pljuči se ne prilegata v eno vrsto → druga vrsta iste skupine brez novega naslova
  const t = V.razvrstiPolice(s, { sirina: 300 });
  assert.equal(t.vrste.filter((v) => v.sistem === "dihala").length, 1);
  assert.ok(t.mesta.get("leva-pljuca")[1] > t.mesta.get("desna-pljuca")[1]);
  // nič se ne prekriva
  const r = new Map(s.map((x) => [x.kljuc, x.polmer]));
  for (const a of s) for (const b of s) {
    if (a === b) continue;
    const [ax, ay] = p.mesta.get(a.kljuc), [bx, by] = p.mesta.get(b.kljuc);
    assert.ok(Math.hypot(ax - bx, ay - by) >= Math.min(r.get(a.kljuc), r.get(b.kljuc)), `${a.kljuc} ${b.kljuc}`);
  }
});

test("barve po organih iz atlasa (tkiva.js) za vsak ključ", () => {
  for (const kl of Object.keys(oznake)) {
    const v = V.vrsticaAtlasa(kl);
    assert.ok(v.material && v.sistem, kl);
  }
  assert.equal(V.vrsticaAtlasa("levi-prekat").ime, "heart");
  assert.equal(V.vrsticaAtlasa("desna-pljuca").material, "Lung");
  assert.equal(V.vrsticaAtlasa("prsno-vretence-th8").material, "Bone");
});

test("barvna korekcija posvetli srednje tone in ostane v mejah", () => {
  const c = V.popraviBarvo([0.3, 0.2, 0.18]);
  assert.ok(c.every((x) => x >= 0 && x <= 1));
  assert.ok(c[0] > 0.3);
  assert.deepEqual(V.popraviBarvo([0, 0, 0]), [0, 0, 0]);
  assert.match(V.GLSL_KOREKCIJA, /k3Popravi/);
});

test("ploščice: le 404/410 pomeni »manjka«, začasne napake se ponovijo 1, 4, 15 s", async () => {
  const R = await import("../public/3d/rezine.js");
  assert.equal(R.vrstaNapake(404), "manjka");
  assert.equal(R.vrstaNapake(410), "manjka");
  for (const s of [0, 500, 503, 429]) assert.equal(R.vrstaNapake(s), "zacasno");
  assert.deepEqual([0, 1, 2, 3].map(R.zamikPonovitve), [1000, 4000, 15000, null]);
  assert.equal(await R.statusSlike("x", () => Promise.resolve({ status: 404 })), 404);
  assert.equal(await R.statusSlike("x", () => Promise.reject(new Error("omrežje"))), 0);
});

test("model: votli organi, slogi po stopnjah, NLM navedba in brez imena projekta v novih besedilih", () => {
  const src = fs.readFileSync(new URL("../public/3d/modeli/organi/pravi-prerez.js", import.meta.url), "utf8");
  assert.match(src, /privzetSlog = \(raven\) => \(raven >= 3 \? "s3" : raven === 2 \? "s2" : "s1"\)/);
  assert.match(src, /Courtesy of the U\.S\. National Library of Medicine/);
  const py = fs.readFileSync(new URL("../scripts/atlas/rezine_telo3d.py", import.meta.url), "utf8");
  assert.match(py, /VOTLI = \["levi-prekat", "desni-prekat", "levi-preddvor", "desni-preddvor", "aorta"/);
  const bes = JSON.parse(fs.readFileSync(new URL("../public/3d/rezine-besedila.json", import.meta.url), "utf8"));
  for (const [jez, b] of Object.entries(bes)) for (const [k, v] of Object.entries(b)) assert.doesNotMatch(v, /Visible Human/i, `${jez} ${k}`);
  assert.ok(bes.sl["a3.rez.partOf"].includes("{ime}"));
});

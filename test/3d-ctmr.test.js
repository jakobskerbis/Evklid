// CT in MR ob fotografiji v »Pravi prerez« (docs/3d.md »CT in MR«): okna CT, izbira načina, OŠ brez CT/MR, besedila v vseh
// jezikih in ne ob prvem odprtju, pogoji NLM, poravnava CT na fotografijo (kontrolne točke iz cevovoda scripts/atlas/ctmr.py).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import * as C from "../public/3d/rezine-ctmr.js";
import SLVSE from "../public/i18n/sl.js";
import { UI_LANGUAGES } from "../public/i18n/languages.js";

const ROOT = path.join(import.meta.dirname, "..");
const beri = (...p) => fs.readFileSync(path.join(ROOT, ...p), "utf8");
const BES = JSON.parse(beri("public", "3d", "rezine-ctmr-besedila.json"));
const VZOREC = JSON.parse(beri("public", "3d", "rezine", "vzorec", "ctmr.json"));
const KODA = VZOREC.ct.koda;
const kodaZa = (hu) => { // kot ctmr.py koda(): odsekoma linearno HU → 0–255
  const { hu: X, v: Y } = KODA;
  let j = 1;
  while (j < X.length - 1 && hu > X[j]) j++;
  return Math.round(Y[j - 1] + ((Math.max(X[0], Math.min(X.at(-1), hu)) - X[j - 1]) / (X[j] - X[j - 1])) * (Y[j] - Y[j - 1]));
};

test("ctmr: okno CT iz stisnjenih HU (središče okna je srednje sivo, robovi črno in belo)", () => {
  for (const [ime, [c, w]] of Object.entries(VZOREC.ct.okna)) {
    const lut = C.lutOkna(KODA, [c, w]);
    assert.ok(Math.abs(lut[kodaZa(c)] - 128) <= 6, `${ime}: središče ${lut[kodaZa(c)]}`);
    if (c - w / 2 > KODA.hu[0]) assert.equal(lut[kodaZa(c - w / 2 - 50)], 0, `${ime}: pod oknom črno`);
    else assert.ok(lut[0] < 64, `${ime}: zrak temen`);
    assert.equal(lut[kodaZa(c + w / 2 + 50)], 255, `${ime}: nad oknom belo`);
    for (let k = 1; k < 256; k++) assert.ok(lut[k] >= lut[k - 1], `${ime}: naraščajoče`);
  }
  // mehka tkiva: maščoba (−100) je temnejša od mišice (+50), kost (+700) je bela, zrak črn
  const m = C.lutOkna(KODA, VZOREC.ct.okna.mehka);
  assert.ok(m[kodaZa(-100)] < m[kodaZa(50)] && m[kodaZa(700)] === 255 && m[kodaZa(-1000)] === 0);
  // pljuča: zrak v pljučih (−850) je ločen od mehkih tkiv (+40)
  const p = C.lutOkna(KODA, VZOREC.ct.okna.pljuca);
  assert.ok(p[kodaZa(40)] - p[kodaZa(-850)] > 90);
  const d = new Uint8ClampedArray([9, kodaZa(40), 9, 255, 0, kodaZa(700), 0, 0]);
  C.uporabiLut(d, m);
  assert.deepEqual([...d], [m[kodaZa(40)], m[kodaZa(40)], m[kodaZa(40)], 255, 255, 255, 255, 0], "sivina iz zelenega kanala, alfa ostane");
});

test("ctmr: načini po ravni in smeri; OŠ samo fotografija; brez podatkov ni gumbov", () => {
  const cm = { ct: { ravnine: ["a", "k", "s"], od: 5, do: 1877, mapa: "ct/" }, mr: { ravnine: ["a"], rezine: [4, 9, 14], debelina: 4, mapa: "mr/" } };
  assert.deepEqual(C.naciniZa(cm, { os: false, smer: "a" }), ["foto", "ct", "mr"]);
  assert.deepEqual(C.naciniZa(cm, { os: false, smer: "k" }), ["foto", "ct"], "MR le prečno");
  assert.deepEqual(C.naciniZa(cm, { os: true, smer: "a" }), ["foto"], "OŠ: CT in MR skrita");
  assert.deepEqual(C.naciniZa(null, { smer: "a" }), ["foto"], "brez ctmr.json");
  assert.equal(C.rezinaMr(cm.mr, 11), 9);
  assert.equal(C.rezinaMr(cm.mr, 12), 14);
  assert.equal(C.rezinaMr(cm.mr, 17), -1, "dlje od pol debeline: MR ni");
  assert.equal(C.potSlike(cm, { nacin: "ct" }, "a", 100), "ct/a/100.webp");
  assert.equal(C.potSlike(cm, { nacin: "ct" }, "a", 2), null, "nad prvo rezino CT ostane fotografija");
  assert.equal(C.potSlike(cm, { nacin: "ct" }, "k", 2), "ct/k/2.webp");
  assert.equal(C.potSlike(cm, { nacin: "mr", sekvenca: "t2" }, "a", 13), "mr/t2/14.webp");
  assert.equal(C.potSlike(cm, { nacin: "foto" }, "a", 13), null);
});

test("ctmr: upravljavec skrije CT na OŠ, zamenja okno brez nove slike in ob manjkajočem MR pove zakaj", () => {
  let ob = 0;
  const M = C.ustvari({ slika: () => Promise.reject(new Error("ni omrežja")), rezinaMalega: () => null, ob: () => ob++ });
  M.nastavi("https://x.test/m/", { ct: { ravnine: ["a", "k", "s"], od: 0, do: 50, mapa: "ct/", koda: KODA, okna: VZOREC.ct.okna }, mr: { ravnine: ["a"], rezine: [10], debelina: 4, mapa: "mr/", sekvence: ["t1", "t2", "pd"] } });
  const [nSlika, nSlikaMr, nOkno, nSekvenca, nStanje] = M.nadzor;
  M.lega(false, "a", 10);
  assert.equal(nSlikaMr.vidno(), true); assert.equal(nSlika.vidno(), false);
  nSlikaMr.ob("ct");
  assert.equal(M.nacin, "ct"); assert.equal(nOkno.vidno(), true); assert.equal(nSekvenca.vidno(), false);
  const a = M.ostra();
  nOkno.ob("kosti");
  const b = M.ostra();
  assert.equal(a.url, b.url, "ista slika"); assert.notEqual(a.kljuc, b.kljuc, "druga tekstura (okno)");
  nSlikaMr.ob("mr"); M.lega(false, "a", 30);
  assert.equal(M.nacin, "mr"); assert.equal(M.ostra(), null); assert.match(nStanje.vrednost(), /glav/);
  M.lega(false, "k", 30);
  assert.equal(M.nacin, "foto", "MR pri frontalni smeri: fotografija"); assert.equal(nSlika.vidno(), true);
  M.lega(true, "a", 10);
  assert.equal(M.nacin, "foto"); assert.equal(nSlika.vidno() || nSlikaMr.vidno(), false, "OŠ: gumbov ni");
  M.nastavi("https://x.test/z/", null);
  M.lega(false, "a", 10);
  assert.equal(nSlika.vidno() || nSlikaMr.vidno(), false, "telo brez CT/MR: gumbov ni");
  assert.ok(ob >= 3);
});

test("ctmr: besedila v vseh jezikih vmesnika, naložijo se šele v modelu (ne v sl.js), brez imena projekta NLM", () => {
  const kljuci = Object.keys(C.BESEDILA_SL).sort();
  assert.deepEqual(Object.keys(BES).sort(), [...UI_LANGUAGES].sort());
  assert.deepEqual(BES.sl, C.BESEDILA_SL, "slovenščina v kodi = datoteka");
  for (const [j, d] of Object.entries(BES)) {
    assert.deepEqual(Object.keys(d).sort(), kljuci, `${j}: ključi`);
    for (const k of kljuci) assert.ok(typeof d[k] === "string" && d[k].trim(), `${j} ${k}`);
    if (j === "en") for (const k of ["ctmr.photo", "ctmr.win.kosti", "ctmr.mrHeadOnly"]) assert.notEqual(d[k], BES.sl[k]);
  }
  assert.deepEqual(Object.keys(SLVSE).filter((k) => k.startsWith("ctmr.")), [], "ctmr.* ni v sl.js (proračun prvega odprtja)");
  const vse = JSON.stringify(BES) + beri("public", "3d", "rezine-ctmr.js").replace(/^\s*\/\/.*$/gm, "");
  assert.doesNotMatch(vse, /visible\s*human/i, "ime projekta ni ime funkcije ali besedilo vmesnika");
  // modul uvozi samo model pogleda (ne aplikacija ob prvem odprtju)
  const uvozi = (f) => beri(...f).includes("rezine-ctmr.js");
  assert.ok(uvozi(["public", "3d", "modeli", "organi", "pravi-prerez.js"]));
  for (const f of [["public", "app.js"], ["public", "3d", "pregledovalnik.js"], ["public", "3d", "scena.js"]]) if (fs.existsSync(path.join(ROOT, ...f))) assert.equal(uvozi(f), false, f.join("/"));
  const mod = beri("public", "3d", "modeli", "organi", "pravi-prerez.js");
  assert.match(mod, /CM\.lega\(os\(\)/, "model pove raven (OŠ skrije CT/MR)");
  assert.match(mod, /\.\.\.CM\.nadzor/);
});

test("ctmr: pogoji NLM v podatkih (navedba, pogoji, brez imena darovalca)", () => {
  assert.equal(VZOREC.navedba, "Courtesy of the U.S. National Library of Medicine");
  assert.match(VZOREC.pogoji, /nlm\.nih\.gov/);
  const viri = JSON.parse(beri("scripts", "atlas", "ctmr_viri.json"));
  assert.equal(viri.navedba, VZOREC.navedba);
  // cevovod iz glav GE bere samo geometrijo (polja o osebi nikoli)
  const py = beri("scripts", "atlas", "ctmr.py");
  assert.doesNotMatch(py.replace(/^\s*#.*$/gm, ""), /Patient|Hospital/);
  assert.doesNotMatch(JSON.stringify(VZOREC), /Patient|Hospital|Huntsville|Denver/i);
});

test("ctmr: CT je poravnan na fotografijo (obris telesa in vretenca, kontrolne točke iz cevovoda)", () => {
  const k = VZOREC.ct.kontrola, telo = k.telo;
  assert.ok(telo.dice.length >= 20, "obris preverjen vzdolž telesa");
  for (const [z, d] of telo.dice) assert.ok(d >= 0.9, `obris telesa pri z ${z}: Dice ${d}`);
  // vretenca: premik robov CT proti robovom fotografije okoli vretenca (mesto iz mreže oznak HRA)
  assert.ok(telo.seznam.length >= 15, `vretenc: ${telo.seznam.length}`);
  const raz = telo.seznam.map(([, , dx, dy]) => Math.hypot(dx, dy)).sort((a, b) => a - b);
  const med = raz[raz.length >> 1];
  assert.ok(med <= 3, `mediana odmika vretenc ${med} mm`);
  assert.ok(raz.filter((x) => x > 6).length <= 2, `vretenca z odmikom > 6 mm: ${raz.filter((x) => x > 6)}`);
  // vzorec (prsni koš) ima vsaj eno vretence in dober obris
  assert.ok(k.vretenca.length >= 1 && k.dice.every(([, d]) => d >= 0.9));
  assert.deepEqual(VZOREC.ct.mali.dim.slice(0, 2), JSON.parse(beri("public", "3d", "rezine", "vzorec", "meta.json")).mali.dim.slice(0, 2), "mali CT ima mere malega volumna fotografij");
});

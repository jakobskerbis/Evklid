// Izklop izbranega dela (j, 6. 11.: vsi načini enako, mehak prehod) in ohranjanje izbire ob menjavi stanja
// (public/3d/izbira.js; pregledovalnik.js, atlas.js, stran.js). Vedenje v brskalniku: scripts/preveri-3d-izbira.cjs.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { zgodovinaIzbire } from "../public/3d/izbira.js";
import { najdiIstiDel } from "../public/3d/isti-del.js";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const beri = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");

// Zgodovina brskalnika: sklad vnosov, back() je asinhron (popstate v naslednji mikronalogi), kot v brskalniku.
function okno() {
  const sklad = [{ k3Iz: "hub" }];
  let i = 0;
  const posl = new Set();
  const w = {
    history: {
      get state() {
        return sklad[i];
      },
      get length() {
        return sklad.length;
      },
      pushState(s) {
        sklad.splice(i + 1);
        sklad.push(s);
        i++;
      },
      replaceState(s) {
        sklad[i] = s;
      },
      back() {
        queueMicrotask(() => {
          if (i === 0) return;
          i--;
          for (const f of [...posl]) f({ state: sklad[i] });
        });
      },
    },
    addEventListener: (t, f) => t === "popstate" && posl.add(f),
    removeEventListener: (t, f) => t === "popstate" && posl.delete(f),
    get indeks() {
      return i;
    },
    sklad,
  };
  return w;
}
const tik = () => new Promise((r) => setTimeout(r, 0));

// Mali model pregledovalnika: izberi() kot v pregledovalnik.js (prehod brez izbire ↔ z izbiro kliče zgodovino).
function pregled(w) {
  const s = { izbran: null, zaprtja: 0 };
  s.izberi = (id) => {
    const prej = s.izbran;
    s.izbran = id;
    if (id && !prej) zg.odprta();
    else if (!id && prej) (zg.zaprta(), s.zaprtja++);
  };
  const zg = zgodovinaIzbire({ okno: w, zapri: () => s.izberi(null) });
  s.zg = zg;
  return s;
}

test("nazaj (telefon, brskalnik) najprej zapre izbiro, šele nato zapusti pregledovalnik", async () => {
  const w = okno();
  const s = pregled(w);
  s.izberi("pljucne-vene");
  assert.equal(w.indeks, 1, "izbira doda en vnos");
  s.izberi("aorta"); // preklop med deli: brez novega vnosa
  assert.equal(w.indeks, 1);
  w.history.back();
  await tik();
  assert.equal(s.izbran, null, "prvi nazaj zapre izbiro");
  assert.equal(w.indeks, 0, "pregledovalnik ostane odprt (stanje k3Iz)");
  assert.equal(w.history.state.k3Iz, "hub");
});

for (const nacin of ["× v oknu", "tap v prazno", "ponoven tap na isti del", "ponoven tap na aktivni čip", "Esc"]) {
  test(`izklop »${nacin}« vzame vnos izbire iz zgodovine (naslednji nazaj zapusti pregledovalnik)`, async () => {
    const w = okno();
    const s = pregled(w);
    s.izberi("talamus");
    s.izberi(null); // vsi načini v pregledovalnik.js in atlas.js končajo v izberi(null)
    await tik();
    assert.equal(w.indeks, 0);
    assert.equal(s.zaprtja, 1);
    s.izberi("jedro"); // nova izbira takoj po zaprtju: en vnos, brez podvajanja
    await tik();
    assert.equal(w.indeks, 1);
    assert.equal(w.sklad.length, 2);
  });
}

test("izbira takoj po zaprtju (back še čaka): vnos se doda po popstate, ne pred njim", async () => {
  const w = okno();
  const s = pregled(w);
  s.izberi("a");
  s.izberi(null);
  s.izberi("b"); // back() še ni prišel
  await tik();
  assert.equal(s.izbran, "b", "popstate od lastnega back() ne zapre nove izbire");
  assert.equal(w.indeks, 1);
  assert.equal(w.history.state.k3Izbira, true);
  w.history.back();
  await tik();
  assert.equal(s.izbran, null);
});

test("brez zgodovine (lekcije) in unici: ni vnosov ne poslušalcev", async () => {
  const w = okno();
  const zg = zgodovinaIzbire({ okno: w, vklop: false, zapri: () => assert.fail() });
  zg.odprta();
  assert.equal(w.indeks, 0);
  let zaprto = 0;
  const z2 = zgodovinaIzbire({ okno: w, zapri: () => zaprto++ });
  z2.odprta();
  z2.unici();
  w.history.back();
  await tik();
  assert.equal(zaprto, 0);
});

test("menjava stanja: isti del (id, skupni ključ) ostane izbran, sicer se izbira zapre", () => {
  const prej = { id: "lv", ime: "Levi prekat" };
  const novi = [{ id: "dv", ime: "Desni prekat" }, { id: "lv", ime: "Levi prekat (prerez)" }];
  assert.equal(najdiIstiDel(novi, prej), novi[1], "po id-ju");
  assert.equal(najdiIstiDel([{ id: "x", la: "Thalamus" }], { id: "y", la: "thalamus" })?.id, "x", "po latinskem imenu");
  assert.equal(najdiIstiDel([{ id: "y", ime: "Hipokampus" }], { id: "x", ime: "Talamus" }), null);
  assert.equal(najdiIstiDel(novi, null), null);
});

test("pregledovalnik, atlas, stran: vsi načini izklopa vodijo v isto izberi(null) z mehkim prehodom", () => {
  const pr = beri("public/3d/pregledovalnik.js");
  assert.match(pr, /x\.addEventListener\("click", zapriInfo\)/, "× v oknu");
  assert.match(pr, /if \(!hit\) return izberi\(null\)/, "tap v prazno");
  assert.match(pr, /preklopi: true/, "ponoven tap na isti del");
  assert.match(pr, /izberi\(d\.id === izbran \? null : d\.id\)/, "ponoven tap na aktivni čip");
  assert.match(pr, /e\.key !== "Escape" \|\| !izbran/, "Esc");
  assert.match(pr, /zgodovinaIzbire\(\{ vklop: !!opts\.zgodovina, zapri: \(\) => izberi\(null\) \}\)/, "nazaj");
  assert.match(pr, /najdiIstiDel\(seznam, prejDel\)/, "menjava stanja");
  assert.doesNotMatch(pr, /c\.ponastaviPogled && izbran\) izberi\(null/, "prerez ne prekliče izbire");
  const at = beri("public/3d/atlas.js");
  assert.match(at, /x\.addEventListener\("click", zapriKartico\)/);
  assert.match(at, /izberi\(id && id !== izbran \? id : null\)/, "tap v prazno in ponoven tap");
  assert.match(at, /else if \(izbran\) zapriKartico\(\)/, "Esc");
  assert.match(at, /zgodovinaIzbire\(\{ vklop: zZgodovino, zapri: \(\) => zapriKartico\(\) \}\)/, "nazaj");
  const st = beri("public/3d/stran.js");
  assert.match(st, /stran: true, povecava, zgodovina: true/);
  assert.match(st, /odpriAtlas\(host, \{ zapri: nazaj, zgodovina: true \}\)/);
  assert.match(st, /history\.state\?\.k3Izbira\) \{\n    addEventListener\("popstate"/, "gumb Nazaj: najprej vnos izbire");
});

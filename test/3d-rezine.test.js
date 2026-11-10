// »Pravi prerez telesa« (docs/3d.md): pomožne funkcije pogleda, imena struktur, pogoji NLM, naloga za peko, vzorec.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import * as R from "../public/3d/rezine.js";
import SL from "../public/i18n/sl.js";

const ROOT = path.join(import.meta.dirname, "..");
const beri = (...p) => fs.readFileSync(path.join(ROOT, ...p), "utf8");
const NAVEDBA = "Courtesy of the U.S. National Library of Medicine";

function krogla(W = 20, H = 16, Z = 24, r0 = 6) {
  const data = new Uint8Array(W * H * Z * 4);
  for (let z = 0; z < Z; z++) for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = ((z * H + y) * W + x) * 4;
    if (Math.hypot(x - W / 2, y - H / 2, z - Z / 2) < r0) data.set([200, 100, 50, 255], i);
  }
  return { dim: [W, H, Z], mm: 4, data };
}

test("rezine: površje telesa je zaprto, obrnjeno navzven in prave velikosti", () => {
  for (const korak of [1, 2]) {
    const p = R.povrsje(krogla(), korak);
    const robovi = new Map();
    let v6 = 0;
    for (let i = 0; i < p.idx.length; i += 3) {
      const t = [0, 1, 2].map((k) => p.idx[i + k]);
      for (let k = 0; k < 3; k++) {
        const a = t[k], b = t[(k + 1) % 3], kl = a < b ? `${a}_${b}` : `${b}_${a}`;
        const e = robovi.get(kl) || [0, 0];
        e[a < b ? 0 : 1]++;
        robovi.set(kl, e);
      }
      const [a, b, c] = t.map((j) => [p.pos[j * 3], p.pos[j * 3 + 1], p.pos[j * 3 + 2]]);
      v6 += a[0] * (b[1] * c[2] - b[2] * c[1]) - a[1] * (b[0] * c[2] - b[2] * c[0]) + a[2] * (b[0] * c[1] - b[1] * c[0]);
    }
    for (const [kl, e] of robovi) assert.deepEqual(e, [1, 1], `rob ${kl} ni v natanko dveh nasprotno usmerjenih trikotnikih (korak ${korak})`);
    const pricakovano = (4 / 3) * Math.PI * 6 ** 3 * 4 ** 3;
    assert.ok(v6 / 6 > pricakovano * (korak === 1 ? 0.85 : 0.5) && v6 / 6 < pricakovano * 1.3, `prostornina ${v6 / 6} (korak ${korak})`);
    assert.equal(p.col.length, p.pos.length);
  }
});

test("rezine: rezine malega volumna, točke in ploščice", () => {
  const m = krogla();
  assert.deepEqual(R.velikostRezine(m.dim, "a"), [20, 16]);
  assert.deepEqual(R.velikostRezine(m.dim, "k"), [20, 24]);
  assert.deepEqual(R.velikostRezine(m.dim, "s"), [16, 24]);
  for (const s of R.SMERI) {
    const r = R.rezinaMalega(m, s, R.steviloRezin(m.dim, s) / 2);
    assert.equal(r.data.length, r.w * r.h * 4);
    const sred = (Math.floor(r.h / 2) * r.w + Math.floor(r.w / 2)) * 4;
    assert.deepEqual([...r.data.subarray(sred, sred + 4)], [200, 100, 50, 255], `sredina rezine ${s}`);
    assert.equal(r.data[3], 0, `vogal rezine ${s} je prosojen`);
  }
  assert.deepEqual(R.tockaRezine([100, 50, 200], "a", 10, 0.5, 0.5), [50, 25, 10.5]);
  assert.deepEqual(R.tockaRezine([100, 50, 200], "k", 10, 0.5, 0.5), [50, 10.5, 100]);
  assert.deepEqual(R.tockaRezine([100, 50, 200], "s", 10, 0.5, 0.5), [10.5, 25, 100]);
  // list prečnih rezin → volumen
  const mali = { dim: [2, 1, 3], stolpcev: 2 };
  const list = new Uint8ClampedArray(4 * 2 * 4); // 4 × 2 piksla
  for (let i = 0; i < 8; i++) list[i * 4] = i + 1;
  const v = R.maliIzLista(list, 4, mali);
  assert.deepEqual([...v.data].filter((_, i) => i % 4 === 0), [1, 2, 3, 4, 5, 6]);
  const p = { ploscica: 512, dim_px: [1600, 800, 5000], ravnine: ["a", "k", "s"] };
  assert.equal(R.ploscice(p, [530, 260, 1700], "a", 7).length, 4 * 2);
  assert.equal(R.ploscice(p, [530, 260, 1700], "k", 7).length, 4 * 10);
  assert.equal(R.ploscice(p, [530, 260, 1700], "s", 7)[0].ime, "7_0_0");
  assert.deepEqual(R.ploscice({ ...p, ravnine: ["a"] }, [530, 260, 1700], "k", 7), []);
});

test("rezine: mreža oznak (RLE), strukture rezine in tkivo po barvi", () => {
  const pari = new Uint16Array([5, 0, 3, 7, 4, 0, 2, 9, 10, 0]);
  const data = R.razpakirajOznake(pari.buffer, 24);
  assert.deepEqual([...data], [0, 0, 0, 0, 0, 7, 7, 7, 0, 0, 0, 0, 9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const o = { dim: [4, 3, 2], mm: 2, data };
  assert.equal(R.oznakaV(o, 3, 2.5, 0.5), 7); // x 1, y 1, z 0
  assert.equal(R.oznakaV(o, 1, 0.5, 2.5), 9); // x 0, y 0, z 1
  assert.equal(R.oznakaV(o, -1, 0, 0), 0);
  assert.deepEqual(R.struktureRezine(R.rezinaOznak(o, "a", 0), 1), [[7, 3]]);
  assert.deepEqual(R.struktureRezine(R.rezinaOznak(o, "a", 3), 1), [[9, 2]]);
  assert.equal(R.tkivoPoBarvi(225, 200, 130), "t-mascoba");
  assert.equal(R.tkivoPoBarvi(120, 40, 35), "t-misica");
  assert.equal(R.tkivoPoBarvi(10, 10, 10), null);
});

test("rezine: imena struktur so popolna in vzorci kažejo na obstoječe oznake", () => {
  const t = JSON.parse(beri("public", "3d", "rezine-oznake.json"));
  for (const [k, o] of Object.entries(t.oznake)) {
    assert.match(k, /^[a-z0-9-]+$/);
    for (const p of ["sl", "la", "opis"]) assert.ok(typeof o[p] === "string" && o[p].length > 2, `${k}: manjka ${p}`);
    assert.match(o.barva, /^#[0-9a-f]{6}$/i, k);
    assert.ok(o.opis.endsWith(".") && o.opis.length <= 170, `${k}: opis je en kratek stavek`);
  }
  for (const [vz, k] of t.vzorci) {
    assert.doesNotThrow(() => new RegExp(vz));
    assert.ok(k === "-" || t.oznake[k], `vzorec ${vz}: neznana oznaka ${k}`);
  }
  for (const k of ["t-mascoba", "t-misica"]) assert.ok(t.oznake[k], k);
});

test("rezine: pogoji NLM (navedba vira, brez namiga na podporo, ime projekta ni ime funkcije, darovalec ni imenovan)", async () => {
  const mod = beri("public", "3d", "modeli", "organi", "pravi-prerez.js");
  const viri = JSON.parse(beri("public", "3d", "viri.json")).viri;
  const nlm = viri.find((v) => v.id === "nlm-kriorezine");
  assert.ok(nlm, "public/3d/viri.json: manjka vir nlm-kriorezine");
  assert.ok(nlm.opis.includes(NAVEDBA));
  assert.match(nlm.opis, /niso nujno najnovejši/);
  assert.match(nlm.opis, /ne podpira/);
  assert.match(nlm.url, /nlm\.nih\.gov/);
  assert.ok(mod.includes(`povzetek: () => NAVEDBA`), "navedba vira je ves čas vidna na odru");
  assert.ok(mod.includes(`const NAVEDBA = "${NAVEDBA}"`));
  const kazalo = (await import("../public/3d/modeli/organi/index.js")).default.find((m) => m.id === "organ-pravi-prerez");
  assert.ok(kazalo);
  const besedila = [kazalo.naslov, kazalo.opis, ...Object.entries(SL).filter(([k]) => k.startsWith("a3.rez.")).map(([, v]) => v), nlm.ime, nlm.opis, mod.replace(/^\s*\/\/.*$/gm, "")];
  for (const b of besedila) {
    assert.doesNotMatch(b, /visible\s+(human|man|woman)/i, "ime projekta ni ime funkcije in ni v besedilih");
    assert.doesNotMatch(b, /jernigan|\b(texas|maryland)\b/i, "darovalca ne imenujemo in ne opisujemo");
  }
  for (const f of fs.readdirSync(path.join(ROOT, "public", "i18n", "ui"))) {
    const j = JSON.parse(beri("public", "i18n", "ui", f));
    assert.ok(j["a3.rez.notCurrent"].includes("NLM"), `${f}: opomba omenja NLM`);
    assert.doesNotMatch(Object.entries(j).filter(([k]) => k.startsWith("a3.rez.")).map(([, v]) => v).join(" "), /visible human/i, f);
  }
  const src = JSON.parse(beri("scripts", "atlas", "rezine_viri.json"));
  assert.equal(src.navedba, NAVEDBA);
  assert.match(src.osnova, /^https:\/\/data\.lhncbc\.nlm\.nih\.gov\//, "uradni vir NLM");
});

test("rezine: v repozitoriju je samo majhen vzorec (≤ 1 MB), veliki podatki ne", () => {
  const mapa = path.join(ROOT, "public", "3d", "rezine");
  const kazalo = JSON.parse(beri("public", "3d", "rezine", "kazalo.json"));
  let skupaj = 0;
  const hodi = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (e.name === "lokalno") continue; // krajevni podatki za razvoj (.gitignore)
      const p = path.join(d, e.name);
      if (e.isDirectory()) hodi(p);
      else skupaj += fs.statSync(p).size;
    }
  };
  hodi(mapa);
  assert.ok(skupaj <= 1024 * 1024, `public/3d/rezine ima ${skupaj} bajtov`);
  for (const [spol, pot] of Object.entries(kazalo.telesa)) {
    assert.match(spol, /^[mz]$/);
    const meta = JSON.parse(fs.readFileSync(path.join(mapa, pot, "meta.json"), "utf8"));
    assert.equal(meta.navedba, NAVEDBA);
    assert.ok(fs.existsSync(path.join(mapa, pot, meta.mali.datoteka)));
    assert.equal(meta.dim.length, 3);
  }
});

const python = ["python3", "python"].find((p) => spawnSync(p, ["-c", "import json"]).status === 0);
test("rezine: naloga za peko sprejme samo preverjena polja; rtx.py jo pozna", { skip: !python && "ni Pythona" }, () => {
  const koda = `
import json, sys
sys.path.insert(0, ${JSON.stringify(path.join(ROOT, "scripts", "atlas"))})
sys.dont_write_bytecode = True
import rezine_prenos as r
out = []
for n in [{"spol": "z", "od": 1380, "do": 1440, "podrobno": True}, {"spol": "m"}, {"spol": "x"}, {"spol": "z", "od": 5, "do": 9}, {"spol": "z", "ukaz": "rm"}, {"spol": "z", "podrobno": "da"}, None]:
    try:
        out.append(r.preveri_nalogo(n))
    except ValueError as e:
        out.append(None)
print(json.dumps(out))`;
  const out = JSON.parse(execFileSync(python, ["-c", koda], { encoding: "utf8" }));
  assert.deepEqual(out[0], { spol: "z", od: 1380, do: 1440, podrobno: true, prenos: true, obdelava: true, pocisti: false });
  assert.equal(out[1].od, 1001);
  assert.equal(out[1].do, 2878);
  assert.deepEqual(out.slice(2), [null, null, null, null, null]);
  const rtx = beri("scripts", "atlas", "rtx", "rtx.py");
  assert.match(rtx, /if organi == \["rezine"\]:/);
  assert.match(rtx, /rezine_prenos\.naloga\(KOREN, BLENDER, st, pisi, pisi_stanje, napaka\)/);
});

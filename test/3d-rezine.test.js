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

test("rezine: mreža oznak (RLE), strukture rezine, brez ugibanja po barvi", () => {
  const pari = new Uint16Array([5, 0, 3, 7, 4, 0, 2, 9, 10, 0]);
  const data = R.razpakirajOznake(pari.buffer, 24);
  assert.deepEqual([...data], [0, 0, 0, 0, 0, 7, 7, 7, 0, 0, 0, 0, 9, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const o = { dim: [4, 3, 2], mm: 2, data };
  assert.equal(R.oznakaV(o, 3, 2.5, 0.5), 7); // x 1, y 1, z 0
  assert.equal(R.oznakaV(o, 1, 0.5, 2.5), 9); // x 0, y 0, z 1
  assert.equal(R.oznakaV(o, -1, 0, 0), 0);
  assert.deepEqual(R.struktureRezine(R.rezinaOznak(o, "a", 0), 1), [[7, 3]]);
  assert.deepEqual(R.struktureRezine(R.rezinaOznak(o, "a", 3), 1), [[9, 2]]);
  assert.equal(R.tkivoPoBarvi, undefined, "imen ne ugibamo po barvi (bolje brez imena kot napačno)");
  assert.deepEqual(R.okvirVsebine({ w: 4, h: 2, data: new Uint8Array([0,0,0,0, 9,9,9,255, 9,9,9,255, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]) }), { u0: 0.25, v0: 0, u1: 0.75, v1: 0.5 });
});

test("rezine: telo okoli rezine nima lukenj (votline in tanke reže v maski so zapolnjene)", () => {
  // krogla z votlino (zrak v črevesu) in luknjo v »koži«: brez zapolnitve bi površje pokazalo notranjost
  const m = krogla(24, 24, 24, 9);
  const [W, H] = m.dim;
  for (let z = 0; z < 24; z++) for (let y = 0; y < 24; y++) for (let x = 0; x < 24; x++) {
    const r = Math.hypot(x - 12, y - 12, z - 12), i = ((z * H + y) * W + x) * 4 + 3;
    if (r < 6 || (r >= 6 && x === 12 && y === 12 && z < 12)) m.data[i] = 0; // votlina + tanek kanal do površja
  }
  const f = R.poljeTelesa(m);
  assert.ok(f[(12 * H + 12) * W + 12] > 128, "votlina je zapolnjena");
  assert.ok(f[0] < 128, "zunaj ostane zunaj");
  const p = R.povrsje(m, 1);
  const r = [];
  for (let k = 0; k < p.pos.length; k += 3) r.push(Math.hypot(p.pos[k] / 4 - 12, p.pos[k + 1] / 4 - 12, p.pos[k + 2] / 4 - 12));
  assert.ok(Math.min(...r) > 6.5, `ni notranjih ploskev (najmanjši polmer ${Math.min(...r).toFixed(1)})`);
});

test("rezine: gladek obris brez otočkov, središče oznake, uv točke", () => {
  const w = 12, h = 10, data = new Uint8Array(w * h);
  for (let y = 2; y < 8; y++) for (let x = 2; x < 9; x++) data[y * w + x] = 5; // velik del
  data[0] = 5; // otoček v vogalu
  const je = new Uint8Array(256); je[5] = 1;
  const o = R.gladekObris({ w, h, data }, je, 4);
  assert.equal(o.w, 48); assert.equal(o.h, 40);
  assert.equal(o.data[0], 0, "otoček je odstranjen");
  assert.equal(o.data[20 * 48 + 22], 1, "notranjost");
  assert.ok(o.data.includes(2), "rob");
  const s = R.gladekObris({ w, h, data }, je, 4, [0.01, 0.01]);
  assert.ok(s.data[0] === 0 || s.data[5 * 48 + 5] !== 0, "dotaknjeni otoček ostane");
  assert.equal(R.gladekObris({ w, h, data }, new Uint8Array(256), 4), null);
  const oz = { dim: [4, 2, 1], mm: 2, data: new Uint8Array([0, 3, 3, 0, 0, 3, 0, 0]) };
  assert.deepEqual(R.sredisce(oz, 3).map((v) => +v.toFixed(3)), [+((3 + 5 + 3) / 3).toFixed(3), +((1 + 1 + 3) / 3).toFixed(3), 1]);
  assert.deepEqual(R.sredisce(oz, 3, (x) => x > 4), [5, 1, 1]);
  assert.equal(R.sredisce(oz, 9), null);
  assert.deepEqual(R.uvTocke([100, 50, 200], "s", [10, 25, 50]), [0.5, 0.25]);
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
  assert.ok(!Object.keys(t.oznake).some((k) => k.startsWith("t-")), "brez tkiv po barvi");
  for (const [k, v] of Object.entries(t.os)) assert.ok(t.oznake[k] && t.oznake[v], `os: ${k} → ${v}`);
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
  assert.ok(mod.includes(`navedba: { besedilo: NAVEDBA`), "navedba vira je ves čas vidna na odru (ena vrstica)");
  assert.doesNotMatch(mod, /daroval|spoštljiv|Preden pogledaš/, "brez uvodnega okna (j, 10. 11.)");
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

test("rezine: gostovanje podatkov je za stikalom (izvor v connect-src samo, ko je nastavljen in veljaven)", async () => {
  const { cspFor3d, rezineIzvor } = await import("../server/tri-d.js");
  const { BRAND } = await import("../server/brand.js");
  const base = { "script-src": ["'self'"], "connect-src": ["'self'"] };
  assert.equal(rezineIzvor({}), null);
  assert.equal(rezineIzvor({ [`${BRAND.env}_REZINE_IZVOR`]: "http://x.si" }), null, "samo https");
  assert.equal(rezineIzvor({ [`${BRAND.env}_REZINE_IZVOR`]: "https://x.si/pot" }), null, "samo izvor, brez poti");
  const r = rezineIzvor({ [`${BRAND.env}_REZINE_IZVOR`]: "https://rezine.example.org/" });
  assert.deepEqual(r, { izvor: "https://rezine.example.org", osnova: "https://rezine.example.org/v1/", telesa: ["z", "m"] });
  assert.match(cspFor3d(base, r), /connect-src 'self' https:\/\/rezine\.example\.org/);
  assert.match(cspFor3d(base, null), /connect-src 'self'$/);
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

test("rezine: strežnik našteje samo telesa v vedru in vedno doda rezervo (vzorec iz repozitorija)", async () => {
  const { rezineIzvor, kazaloRezin, mount3d } = await import("../server/tri-d.js");
  const { BRAND } = await import("../server/brand.js");
  const env = (t) => ({ [`${BRAND.env}_REZINE_IZVOR`]: "https://r.example.org", ...(t == null ? {} : { [`${BRAND.env}_REZINE_TELESA`]: t }) });
  assert.deepEqual(rezineIzvor(env("m")).telesa, ["m"], "ženska se še peče: samo moški");
  assert.deepEqual(rezineIzvor(env(" m , x,z,m")).telesa, ["m", "z"], "neznana telesa izpuščena, brez podvajanja");
  assert.deepEqual(rezineIzvor(env("x")).telesa, ["z", "m"], "neveljavno → privzeto obe");
  const k = kazaloRezin(rezineIzvor(env("m")));
  assert.deepEqual(k, { osnova: "https://r.example.org/v1/", telesa: { m: "m/" }, rezerva: { osnova: "", telesa: { m: "vzorec/" } } });
  const rez = JSON.parse(beri("public", "3d", "rezine", "kazalo.json"));
  assert.deepEqual(k.rezerva.telesa, rez.telesa, "rezerva je vzorec iz repozitorija");
  // pot /3d/rezine/kazalo.json: z nastavljenim izvorom kazalo z rezervo, brez njega statični vzorec (next)
  const express = (await import("express")).default;
  const app = express();
  mount3d(app, { csp: { "script-src": ["'self'"], "connect-src": ["'self'"] }, modules: path.join(ROOT, "node_modules") });
  app.use((_q, res) => res.status(204).end());
  const srv = app.listen(0);
  const vrata = srv.address().port;
  const prej = { izvor: process.env[`${BRAND.env}_REZINE_IZVOR`], telesa: process.env[`${BRAND.env}_REZINE_TELESA`] };
  try {
    process.env[`${BRAND.env}_REZINE_IZVOR`] = "https://r.example.org";
    process.env[`${BRAND.env}_REZINE_TELESA`] = "m";
    const r1 = await fetch(`http://127.0.0.1:${vrata}/3d/rezine/kazalo.json`);
    assert.equal(r1.status, 200);
    assert.deepEqual(await r1.json(), k);
    delete process.env[`${BRAND.env}_REZINE_IZVOR`];
    const r2 = await fetch(`http://127.0.0.1:${vrata}/3d/rezine/kazalo.json`);
    assert.equal(r2.status, 204, "brez gostovanja: naprej na statični vzorec");
  } finally {
    srv.close();
    for (const [k2, v] of [["IZVOR", prej.izvor], ["TELESA", prej.telesa]]) {
      if (v == null) delete process.env[`${BRAND.env}_REZINE_${k2}`];
      else process.env[`${BRAND.env}_REZINE_${k2}`] = v;
    }
  }
});

test("rezine: odjemalec – manjkajoče telo ne podre drugega, brez teles rezerva", async () => {
  const meta = { dim: [10, 10, 10] };
  const beriJson = (obstaja) => async (url) => {
    if (obstaja.some((p) => url.endsWith(p))) return meta;
    throw new Error(`404 ${url}`);
  };
  const k = { osnova: "https://r.example.org/v1/", telesa: { z: "z/", m: "m/" } };
  const a = await R.telesaKazala(k, "https://evklid.app/3d/rezine/", beriJson(["/m/meta.json"]));
  assert.deepEqual(a.spoli, ["m"], "ženska manjka, moški ostane");
  assert.equal(a.osnova, "https://r.example.org/v1/");
  const b = await R.telesaKazala(k, "https://evklid.app/3d/rezine/", beriJson(["/z/meta.json", "/m/meta.json"]));
  assert.deepEqual(b.spoli, ["z", "m"]);
  await assert.rejects(R.telesaKazala(k, "https://evklid.app/3d/rezine/", beriJson([])), /404/, "brez teles napaka → model preklopi na rezervo");
  const rez = await R.telesaKazala({ osnova: "", telesa: { m: "vzorec/" } }, "https://evklid.app/3d/rezine/", beriJson(["/3d/rezine/vzorec/meta.json"]));
  assert.deepEqual(rez.spoli, ["m"]);
  assert.equal(rez.osnova, "https://evklid.app/3d/rezine/", "rezerva je na istem izvoru");
  const mod = beri("public", "3d", "modeli", "organi", "pravi-prerez.js");
  assert.match(mod, /R\.telesaKazala\(k, koren, json\)/);
  assert.match(mod, /await pripravi\(kazalo\)\.catch\(naRezervo\)/, "kazalo, ki odpove, preklopi na rezervo");
  assert.match(mod, /await naRezervo\(err\);\s*if \(!spoli\.includes\(stanje\.spol\)\)/, "telo, ki se ne naloži, preklopi na rezervo");
});

test("rezine: raven vretenca, lega rezine in posamezna vretenca", () => {
  const ravni = [[-12, 20, "Th6"], [14, 50, "Th7"], [42, 80, "Th8"], [68, 104, "Th9"], [300, 340, "L1"]];
  assert.equal(R.ravenPri(ravni, 46), "Th7", "prekrivanje: najbližja sredina");
  assert.equal(R.ravenPri(ravni, 62), "Th8");
  assert.equal(R.ravenPri(ravni, 200), "", "zunaj hrbtenice ni ravni");
  assert.equal(R.ravenPri([], 46), "");
  assert.equal(R.ravenPri(undefined, 46), "");
  assert.equal(R.ravenPri(ravni, 310, "Th"), "", "samo vretenca iste vrste");
  assert.equal(R.ravenPri(ravni, 310, "L"), "L1");
  const t = (_k, d) => d;
  assert.equal(R.besediloLege({ smer: "a", i: 62, vzorec: true, ravni }, t), "v višini Th8");
  assert.equal(R.besediloLege({ smer: "a", i: 200, vzorec: true, ravni }, t), "20,0 cm od vrha izreza", "brez gole številke");
  assert.equal(R.besediloLege({ smer: "a", i: 62, vzorec: false, ravni }, t), "v višini Th8 · 6,2 cm pod vrhom");
  assert.equal(R.besediloLege({ smer: "k", i: 168, vzorec: false, ravni }, t), "16,8 cm od sprednje strani");
  assert.equal(R.besediloLege({ smer: "s", i: 290, vzorec: false, ravni }, t), "29,0 cm od desne strani telesa");
  assert.deepEqual(R.mejeVretenca(ravni, "Th7"), [18, 46.5]);
  assert.deepEqual(R.mejeVretenca(ravni, "Th6"), [-16, 18]);
  assert.equal(R.mejeVretenca(ravni, "Th12"), null);
  const tab = JSON.parse(beri("public", "3d", "rezine-oznake.json"));
  assert.deepEqual(R.vretence("prsno-vretence-th8"), { osnova: "prsno-vretence", raven: "Th8", rim: "VIII" });
  assert.deepEqual(R.vretence("prsno-vretence", "Th3"), { osnova: "prsno-vretence", raven: "Th3", rim: "III" });
  assert.equal(R.vretence("prsno-vretence-l3"), null, "vrsta in raven se ujemata");
  assert.equal(R.vretence("jetra"), null);
  const o = R.opisOznake(tab, "ledveno-vretence-l4");
  assert.equal(o.sl, "Ledveno vretence L4");
  assert.equal(o.la, "Vertebra lumbalis IV");
  assert.equal(R.opisOznake(tab, "prsno-vretence", "Th8").sl, "Prsno vretence Th8", "starejše oznake: raven iz višine dotika");
  assert.equal(R.opisOznake(tab, "prsno-vretence").sl, "Prsno vretence");
  assert.equal(R.opisOznake(tab, "ni-taka"), null);
  // vzorec v repozitoriju ima posamezna vretenca (rezine_oznake.py)
  const vm = JSON.parse(beri("public", "3d", "rezine", "vzorec", "meta.json"));
  for (const v of ["prsno-vretence-th7", "prsno-vretence-th8"]) assert.ok(vm.oznake.kljuci.includes(v), v);
});

test("rezine: pravila OŠ (preprostejša imena, spolni organi brez imena, prečni pogled brez telesa)", () => {
  const tab = JSON.parse(beri("public", "3d", "rezine-oznake.json"));
  assert.equal(R.kljucZaRaven(tab, "prsno-vretence-th8", true), "hrbtenica", "posamezno vretence je na OŠ hrbtenica");
  assert.equal(R.kljucZaRaven(tab, "prsno-vretence-th8", false), "prsno-vretence-th8");
  assert.equal(R.kljucZaRaven(tab, "levi-prekat", true), "srce");
  for (const k of ["prostata", "semenjak", "semenovod", "maternica", "jajcnik", "jajcevod", "noznica", "maternicne-vezi"])
    assert.equal(R.kljucZaRaven(tab, k, true), "", `${k}: OŠ ne imenuje (j odloči kasneje)`);
  assert.equal(R.kljucZaRaven(tab, "", true), "");
  assert.deepEqual(R.pogledZaRaven(1), { smer: "a", pogled: "ravno", telo: false });
  assert.deepEqual(R.pogledZaRaven(2), {});
  const mod = beri("public", "3d", "modeli", "organi", "pravi-prerez.js");
  assert.match(mod, /Object\.assign\(stanje, R\.pogledZaRaven\(1\)\)/, "preklop na OŠ vrne prečni pogled naravnost");
});

test("rezine: obris zapolni drobne luknje brez oznake, žile z lastno oznako ostanejo", () => {
  // 9 × 9: struktura 1 z luknjo 0 (zapolni) in luknjo 2 (žila, ostane)
  const w = 9, h = 9, data = new Uint8Array(w * h);
  for (let y = 1; y < 8; y++) for (let x = 1; x < 8; x++) data[y * w + x] = 1;
  data[2 * w + 2] = 0; data[6 * w + 6] = 2;
  const je = new Uint8Array(256); je[1] = 1;
  const z = R.zapolniObris({ w, h, data }, je);
  assert.equal(z.data[2 * w + 2], 1, "luknja brez oznake zapolnjena");
  assert.equal(z.data[6 * w + 6], 0, "žila ostane luknja");
  assert.equal(z.data[0], 0, "zunanjost ostane zunaj");
});

test("rezine: ključ shrambe iz imena aplikacije (brand.json)", () => {
  const brand = JSON.parse(beri("brand.json"));
  assert.equal(R.KLJUC_KAZALA, `${brand.slug}.3d.rezine`);
  assert.doesNotMatch(beri("public", "3d", "modeli", "organi", "pravi-prerez.js"), /getItem\("/, "ključ ni trdo vpisan v modelu");
});

test("rezine: šivi med bloki – pomik, izpad in skok osvetlitve se izravnajo krajevno", { skip: !python && "ni Pythona" }, () => {
  let np = spawnSync(python, ["-c", "import numpy"]).status === 0;
  if (!np) return;
  const koda = `
import json, sys
import numpy as np
sys.path.insert(0, ${JSON.stringify(path.join(ROOT, "scripts", "atlas"))})
sys.dont_write_bytecode = True
import rezine_sivi as S
rng = np.random.default_rng(1)
Z, H, W = 120, 72, 96
yy, xx = np.mgrid[0:H, 0:W]
telo = ((yy - 36) / 30) ** 2 + ((xx - 48) / 40) ** 2 < 1
tkivo = 120 + 40 * np.sin(np.arange(W) / 5.0)[None, :] * np.cos(np.arange(H) / 7.0)[:, None]
def rez0(z):
    rgb = np.repeat(tkivo[..., None], 3, 2) * (1 + 0.002 * z)
    if z >= 60: rgb = np.roll(rgb, 4, 1)                       # pomik 4 mm od rezine 60
    if z >= 90: rgb = rgb * (0.75 + 0.25 * xx / W)[..., None]   # skok osvetlitve, močnejši na desni strani telesa
    if z == 40: rgb = rgb * 0.5 + 100                          # motna rezina
    a = (np.roll(telo, 4, 1) if z >= 60 else telo).astype(np.float32)
    return rgb.astype(np.float32), a
P, st = S.pomiki(rez0, Z, H, W)
def rez(z):
    rgb, a = rez0(z); return S.premakni(rgb, *P[z]), S.premakni(a, *P[z])
F, pov = S.polje(rez, Z, H, W)
izpad, G, stiki = S.izravnava(F, pov, {})
g = lambda z: S.razsiri(G[z], H, W)
r89, r90 = rez(89)[0] * g(89), rez(90)[0] * g(90)
m = telo & (xx < 30)
print(json.dumps({"st": st, "p59": P[59].tolist(), "p60": P[60].tolist(), "izpad": sorted(izpad), "stiki": [s[:2] for s in stiki],
  "skok_prej": float(np.median(rez(90)[0][m] / rez(89)[0][m])), "skok_po": float(np.median(r90[m] / r89[m])),
  "dalec": float(np.abs(G[10]).max())}))`;
  const r = JSON.parse(execFileSync(python, ["-c", koda], { encoding: "utf8" }));
  assert.deepEqual(r.st.map((s) => s.slice(0, 3)), [[60, 0, -4]], "en stik s pomikom 4 mm");
  assert.equal(r.p59[1] - r.p60[1], 4, "rezine za stikom so premaknjene nazaj");
  assert.deepEqual(r.izpad, [40], "motna rezina nadomeščena s prelivom");
  assert.ok(r.stiki.some(([z, v]) => v === "skok" && Math.abs(z - 90) <= 1), "skok osvetlitve najden");
  assert.ok(r.skok_prej < 0.85 && r.skok_po > 0.93, `skok izravnan: ${r.skok_prej.toFixed(3)} → ${r.skok_po.toFixed(3)}`);
  assert.ok(r.dalec < 1e-6, "daleč od stikov ni popravka (napaka se ne kopiči)");
});

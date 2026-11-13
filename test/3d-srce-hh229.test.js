// Pravo srce HH229 kot stena srca (scripts/atlas/srce_hh229.py, priprava scripts/atlas/srce-hh229.py, docs/3d.md
// »Heart from the HH229 specimen«): podobnostna preslikava po oslonilnih točkah, večinski filter oznak, premik cevi vene na
// pravo ustje; izvoz in dodelava ga uporabljata, vir je naveden.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const KOREN = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const beri = (...p) => fs.readFileSync(path.join(KOREN, ...p), "utf8");

test("srce_hh229.py: podobnost izbere pravo AV zaklopko, večina zgladi oznake, cev pride na ustje", (t) => {
  const np_ = spawnSync("python3", ["-c", "import numpy, scipy"]);
  if (np_.status !== 0) return t.skip("python3 z numpy in scipy ni na voljo");
  const prog = `
import sys, numpy as np
sys.path.insert(0, sys.argv[1])
import srce_hh229 as s
g = np.random.default_rng(2)
# oslonilne točke CT in »preparat«: zasukan, pomanjšan, premaknjen; AV zaklopki sta v modelu zaklopk zamenjani (a = trikuspidalna)
Lc = {"aortna": np.array([0.02, -0.02, 1.30]), "pljucna": np.array([0.03, -0.05, 1.316]), "mitralna": np.array([0.03, 0.0, 1.29]),
      "trikuspidalna": np.array([-0.004, -0.03, 1.27]), "konica": np.array([0.075, -0.06, 1.23])}
from scipy.spatial.transform import Rotation
R = Rotation.from_euler("xyz", [40, -70, 25], degrees=True).as_matrix(); sc = 1.04; tr = np.array([0.5, -0.2, -1.0])
nazaj = lambda X: ((np.asarray(X) - tr) / sc) @ R  # CT → okvir preparata
oblak = lambda c, r: nazaj(c + g.normal(size=(400, 3)) * r)
telo = np.concatenate([nazaj(Lc["konica"] + g.normal(size=(30, 3)) * 0.0005), nazaj(np.mean(list(Lc.values()), 0) + g.normal(size=(4000, 3)) * 0.012)])
h = {"V": telo, "V_aortna": oblak(Lc["aortna"], 0.004), "V_pljucna": oblak(Lc["pljucna"], 0.004), "V_av_a": oblak(Lc["trikuspidalna"], 0.006), "V_av_b": oblak(Lc["mitralna"], 0.006)}
ost, sk, Rr, tt, a, b, o5 = s.podobnost(h, Lc)
print(a, b, 0.95 < float(sk) < 1.1, ost < 0.006)
# večinski filter: osamljena ploskev z drugo oznako sredi mreže izgine, zaklenjena ostane
n = 12; V = np.array([[i, j, 0.0] for i in range(n) for j in range(n)])
F = np.array([[i * n + j, i * n + j + 1, (i + 1) * n + j] for i in range(n - 1) for j in range(n - 1)] + [[i * n + j + 1, (i + 1) * n + j + 1, (i + 1) * n + j] for i in range(n - 1) for j in range(n - 1)])
oz = np.zeros(len(F), int); oz[57] = 1
print(int(s.vecina(F, oz, 2, 2).sum()), int(s.vecina(F, oz, 2, 2, zakleni=oz == 1).sum()))
# premik cevi na ustje: staro ustje pride natanko na novo, razdalje se ohranijo (toga preslikava)
c = np.array([0.0, 0.0, 0.0]); st = np.array([0.03, 0.0, 0.0]); no = np.array([0.0, 0.028, 0.02])
X = np.array([st, st + [0.01, 0.002, 0.0], st + [0.0, 0.004, 0.003]])
Y = s.premakni_na_ustje(X, c, st, no)
print(np.allclose(Y[0], no, atol=1e-9), np.allclose(np.linalg.norm(Y[1] - Y[2]), np.linalg.norm(X[1] - X[2])))
# krog m2: gladek šum 0–1, razširitev cevi okoli osi, maščoba samo v pasu CT in ob žili
rng = np.random.default_rng(2); P = rng.uniform(0, 0.1, (5000, 3)); w = np.clip(s.valovi(P, 0.011), 0, 1)
print(0.3 < float(w.mean()) < 0.7, float(w.std()) > 0.1)
th = np.linspace(0, 2 * np.pi, 40, endpoint=False); C = np.concatenate([np.c_[0.004 * np.cos(th), 0.004 * np.sin(th), np.full(40, z)] for z in np.linspace(0, 0.03, 12)])
C2, k = s.razsiri_cev(C, 0.006)
print(abs(k - 1.5) < 1e-6, np.allclose(np.linalg.norm(C2[:, :2], axis=1), 0.006, atol=1e-6), s.razsiri_cev(C, 0.002)[1] == 1.0)
m0 = (V[:, 0] < 6).astype(float); Vm = V * 0.004
m = s.mascoba(Vm, F, np.ones(len(F), bool), m0, np.array([[0.008, y, 0.0] for y in np.linspace(0, 0.044, 30)]), log=lambda x: None)
print(float(m[m0 < 0.5].max()) == 0.0, float(m[np.abs(Vm[:, 0] - 0.008) < 0.0015].min()) > 0.5, float(m.max()) <= 1.0)
`;
  const r = spawnSync("python3", ["-c", prog, path.join(KOREN, "scripts", "atlas")], { encoding: "utf8" });
  assert.equal(r.status, 0, r.stderr);
  const v = r.stdout.trim().split("\n");
  assert.equal(v[0], "av_b av_a True True", "mitralna = av_b (zamenjani zaklopki prepozna), merilo in ostanek");
  assert.equal(v[1], "0 1", "osamljena oznaka izgine, zaklenjena ostane");
  assert.equal(v[2], "True True");
  assert.equal(v[3], "True True", "valovi: gladek šum");
  assert.equal(v[4], "True True True", "razsiri_cev: polmer do ustja, nikoli ožje");
  assert.equal(v[5], "True True True", "mascoba: nič zunaj pasu CT, polna ob žili");
});

test("srce HH229: izvoz, dodelava in srce.json ga uporabljajo; vir je naveden", () => {
  const ct = beri("scripts", "atlas", "srce_ct.py"), izv = beri("scripts", "atlas", "izvozi-organe.py"), dod = beri("scripts", "atlas", "srce-dodelava.mjs");
  for (const k of ["srce_hh229.stena(", "srce_hh229.ustje(", "deli=srce_hh229.DELI"]) assert.ok(ct.includes(k), k);
  assert.match(izv, /cfg\["_hh229"\] = /);
  assert.match(izv, /hh229_cilj=\(\d+_000, \d+_000\)/);
  assert.match(dod, /epikardPravi/);
  // krog m2: žile nad pravo površino, maščoba ob žilah, cev votle vene na pravem ustju pred drugim zlaganjem krnov
  for (const k of ["hh229_zile_dvig", "srce_hh229.mascoba(", "srce_hh229.razsiri_cev(", "if premaknjeno:"]) assert.ok(ct.includes(k), k);
  assert.match(beri("scripts", "atlas", "rez-stena.mjs"), /odprtih žarkov/);
  const pri = beri("scripts", "atlas", "srce-hh229.py");
  for (const k of ["def zapri(", "holes_fill", "hh229-v1.npz"]) assert.ok(pri.includes(k), k);
  // krog m3: HH229 je možnost recepta (ORGANI_HH229=1), privzeto ostanejo stene CT z lastnimi zaklopkami (srce m1)
  assert.match(izv, /os\.environ\.get\("ORGANI_HH229"\) == "1"/);
  assert.match(beri("scripts", "atlas", "organi.mjs"), /process\.env\.ORGANI_HH229 === "1" \? 96 : -96/);
  const j = JSON.parse(beri("public", "3d", "modeli", "organi-3d", "srce.json"));
  assert.ok(!j.prerez.volumen.epikardPravi, "privzeto srce ni HH229");
  assert.ok(j.pogledi.prerez.skrijDele.includes("levo-srcno-uho"));
  // privzeti modeli ne vsebujejo HH229: vir ni v seznamu virov, vrstice za navedbo so v docs/3d.md (za možnost)
  const viri = JSON.parse(beri("public", "3d", "viri.json")).viri;
  assert.ok(!viri.some((x) => /HH229/.test(x.ime)));
  assert.match(beri("docs", "3d.md"), /This work is based on "HH229".*VisibleHeartLabs.*CC-BY-4\.0/s);
});

test("srce m4: gladek venčni sinus, dno spodnje votle vene, glajenje oznak delov, kontrast vlaken (možnost)", () => {
  const zile = fs.readFileSync(path.join(KOREN, "scripts/atlas/srce_zile.py"), "utf8");
  assert.match(zile, /debela = \(not arterija\) and max\(R\) > 0\.0022/);
  assert.match(zile, /seg = 14 if debela else/);
  assert.match(zile, /def plosca_\(q\)/);
  const ct = fs.readFileSync(path.join(KOREN, "scripts/atlas/srce_ct.py"), "utf8");
  assert.match(ct, /def zgladi_oznake\(nV, F, dl, krat=14\)/);
  assert.match(ct, /dl = zgladi_oznake\(len\(V\), F, dl/);
  const dod = fs.readFileSync(path.join(KOREN, "scripts/atlas/srce-dodelava.mjs"), "utf8");
  assert.match(dod, /export const DEBELE = /);
  assert.match(dod, /export function vgrezni\(m, povrsina, vgrez = VGREZ, h = 0\.003, krogov = 6\)/);
  const organ = fs.readFileSync(path.join(KOREN, "public/3d/organ.js"), "utf8");
  assert.match(organ, /t\.rezVlaknaKontrast \?/);
});

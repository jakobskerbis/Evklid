// Peka na j-jevem prenosniku (Windows, Nvidia RTX; scripts/atlas/rtx/, docs/3d.md »Baking on j's laptop«):
// viri s SHA-256, peci.bat usklajen z viri.json, rtx.py --nacrt, paket z vsemi moduli, peka.py izbira naprave.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const ATLAS = path.join(ROOT, "scripts", "atlas");
const RTX = path.join(ATLAS, "rtx");
const beri = (p) => fs.readFileSync(p, "utf8");
const python = spawnSync("python3", ["--version"]).status === 0;

test("viri.json: vsak vhod ima https izvor, SHA-256 in licenco; Blender je ista različica kot v peci.bat", () => {
  const v = JSON.parse(beri(path.join(RTX, "viri.json")));
  const hex = /^[0-9a-f]{64}$/;
  assert.match(v.blender.sha256, hex);
  assert.ok(v.blender.url.startsWith("https://download.blender.org/") && v.blender.url.includes(v.blender.razlicica));
  for (const x of v.vhodi) {
    assert.ok(x.url.startsWith("https://"), x.ime);
    assert.match(x.sha256, hex, x.ime);
    assert.ok(x.licenca && !/NC/.test(x.licenca), x.ime);
    if (x.razpakiraj) assert.match(x.razpakiraj.sha256, hex);
  }
  assert.ok(v.vhodi.some((x) => x.razpakiraj?.ime === "Startup.blend"));
  const bat = beri(path.join(RTX, "peci.bat"));
  assert.ok(bat.includes(`set "BSHA=${v.blender.sha256}"`), "peci.bat: SHA-256 Blenderja");
  assert.ok(bat.includes(`set "BURL=${v.blender.url}"`), "peci.bat: URL Blenderja");
  assert.ok(bat.includes("KONČANO") && bat.includes("pause") && bat.includes("chcp 65001"));
  assert.match(beri(path.join(ROOT, ".gitattributes")), /^\*\.bat text eol=crlf$/m);
});

test("peka.py: PEKA_NAPRAVA (CPU privzeto, OPTIX, CUDA), brez tihega preklopa na CPU", () => {
  const s = beri(path.join(ATLAS, "peka.py"));
  assert.match(s, /NAPRAVE = \("CPU", "OPTIX", "CUDA"\)/);
  assert.match(s, /os\.environ\.get\("PEKA_NAPRAVA", "CPU"\)/);
  assert.match(s, /gpu = naprava\(sc\)/);
  assert.match(s, /ne preklopim na CPU/);
  const p = beri(path.join(ATLAS, "peci.py"));
  assert.match(p, /PEKA_BLENDER/);
  assert.match(p, /NADZOR = os\.path\.exists\("\/proc\/meminfo"\)/);
});

test("rtx.py --nacrt: organi iz izvozi-organe.py, neznan organ je napaka", { skip: !python }, () => {
  const out = JSON.parse(execFileSync("python3", [path.join(RTX, "rtx.py"), "--nacrt", "srce"], { encoding: "utf8" }).trim().split("\n").pop());
  assert.deepEqual(out.organi, ["srce"]);
  assert.ok(out.znani.includes("srce") && out.znani.includes("mozgani"));
  const r = spawnSync("python3", [path.join(RTX, "rtx.py"), "--nacrt", "ni-organ"], { encoding: "utf8" });
  assert.equal(r.status, 1);
  assert.match(r.stdout, /organa »ni-organ« ni/);
  assert.ok(!fs.existsSync(path.join(ATLAS, "dnevnik.txt")), "--nacrt ne piše dnevnika");
});

test("paket.sh: peci.bat in NAVODILO s CRLF, koda z vsemi lokalnimi moduli", { skip: process.platform === "win32" }, () => {
  const cilj = fs.mkdtempSync(path.join(os.tmpdir(), "peka-rtx-"));
  try {
    execFileSync("sh", [path.join(RTX, "paket.sh"), cilj, "srce", "oko"], { stdio: "ignore" });
    assert.ok(beri(path.join(cilj, "peci.bat")).split("\n").slice(0, -1).every((v) => v.endsWith("\r")));
    assert.equal(beri(path.join(cilj, "organi.txt")).split("\r\n").filter((v) => v && !v.startsWith("#")).join(","), "srce,oko");
    const koda = fs.readdirSync(path.join(cilj, "koda"));
    for (const f of ["rtx.py", "viri.json", "peci.py", "peka.py", "izvozi-organe.py"]) assert.ok(koda.includes(f), f);
    for (const ime of ["izvozi-organe.py", "peka.py"]) {
      for (const [, m] of beri(path.join(ATLAS, ime)).matchAll(/^(?:from|import) ([a-z_]+)/gm)) {
        if (fs.existsSync(path.join(ATLAS, m + ".py"))) assert.ok(koda.includes(m + ".py"), `${ime} uvozi ${m}`);
      }
    }
  } finally {
    fs.rmSync(cilj, { recursive: true, force: true });
  }
});

test("primerjaj-peko.py: PSNR enakih slik je ∞, znane razlike pravilen", { skip: !python || spawnSync("python3", ["-c", "import numpy"]).status !== 0 }, () => {
  const out = execFileSync("python3", ["-c",
    "import runpy, sys, numpy as np; g = runpy.run_path(sys.argv[1] + '/primerjaj-peko.py', run_name='x')\n" +
    "a = np.zeros((4, 4, 3)); b = a.copy(); b[0, 0, 0] = 255\n" +
    "print(g['psnr'](a, a), round(g['psnr'](a, b), 3))", ATLAS], { encoding: "utf8" }).trim();
  // MSE = 255² / 48 → PSNR = 10·log10(48) = 16,812 dB
  assert.equal(out, "inf 16.812");
});

test("rtx.py način čakanja: koda samo po manifestu (SHA-256), naloga.txt preverjena", { skip: !python || process.platform === "win32" }, () => {
  const cilj = fs.mkdtempSync(path.join(os.tmpdir(), "peka-rtx-"));
  try {
    execFileSync("sh", [path.join(RTX, "paket.sh"), cilj], { stdio: "ignore", env: { ...process.env, RAZLICICA: "t1" } });
    const out = execFileSync("python3", ["-c", `
import runpy, sys, os, json
sys.argv = ["rtx.py"]
g = runpy.run_path(os.path.join(${JSON.stringify(cilj)}, "koda", "rtx.py"), run_name="x")
k, n = g["KODA"], g["KODA_NOVA"]
r = [g["manifest_napaka"](k), g["manifest_napaka"](n, "t1"), g["manifest_napaka"](n, "t2")]
open(os.path.join(n, "peci.py"), "a").write("#")
r.append(g["manifest_napaka"](n, "t1"))
open(os.path.join(n, "zlo.py"), "w").write("x")
r.append(g["manifest_napaka"](n, "t1"))
def naloga(t):
    open(g["NALOGA"], "w").write(t); return list(g["beri_nalogo"]())
r += [naloga('{"id": "n1", "organi": ["mozgani"], "koda": "t1"}'), naloga('{"id": "../x", "organi": ["srce"]}')[1],
      naloga('{"id": "n2", "organi": ["srce; del"]}')[1], naloga("ni json")[1]]
print(json.dumps(r, ensure_ascii=False))`], { encoding: "utf8" });
    const [ok, okNova, drugaRazl, sha, odvecna, naloga, slabId, slabOrgan, niJson] = JSON.parse(out.trim().split("\n").pop());
    assert.equal(ok, null);
    assert.equal(okNova, null);
    assert.match(drugaRazl, /različico 't1'/);
    assert.match(sha, /peci\.py: SHA-256 se ne ujema/);
    assert.match(odvecna, /odvečne: \['zlo\.py'\]/);
    assert.deepEqual(naloga, ["n1", ["mozgani"], "t1"]);
    assert.match(slabId, /id sme imeti/);
    assert.match(slabOrgan, /organi morajo biti/);
    assert.match(niJson, /ni veljaven JSON/);
  } finally {
    fs.rmSync(cilj, { recursive: true, force: true });
  }
});

// Obremenilni test čakalne vrste za AI (scripts/meri-naval.mjs, točka 23 načrta izboljšav): brez klicev API.
// --suho ne kliče modela, rezerva K × najslabši primer nad --max-usd zavrne zagon, neveljavni argumenti končajo z 1,
// --preizkus pelje naval skozi pravo aplikacijo z vrsto (0 $).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const env = { ...process.env, ANTHROPIC_API_KEY: "", EVKLID_DATA_KEY: "" };
const skripta = "scripts/meri-naval.mjs";
const zagon = (a, e = {}) => spawnSync(process.execPath, [skripta, ...a], { encoding: "utf8", env: { ...env, ...e }, timeout: 180000 });

test("meri-naval: --suho brez klica; rezerva za ves naval pod mejo, sicer zavrnjeno", () => {
  const suho = zagon(["--suho"]);
  assert.equal(suho.status, 0, suho.stderr);
  assert.match(suho.stdout, /Naval: 12 učencev OŠ hkrati, meja hkratnih odgovorov 4/);
  const na = Number(/na sporočilo ([\d.]+) \$/.exec(suho.stdout)?.[1]);
  const rez = Number(/12 × = ([\d.]+) \$/.exec(suho.stdout)?.[1]);
  assert.ok(na > 0 && Math.abs(rez - 12 * na) < 0.002, suho.stdout);
  assert.ok(rez <= 2, "privzeti naval gre pod mejo delovnega toka (2 $)");
  const prevec = zagon(["--suho", "--max-usd", (rez / 2).toFixed(3)]);
  assert.equal(prevec.status, 1);
  assert.match(prevec.stderr, /presega --max-usd/);
  for (const slab of [["--max-usd", "9"], ["--hkrati", "1"], ["--hkrati", "41"], ["--hkrati", "x"], ["--socasno", "12"], ["--socasno", "0"], ["--max-usd=1"], ["--neznano"]]) {
    assert.equal(zagon(["--suho", ...slab]).status, 1, slab.join(" "));
  }
});

test("meri-naval --preizkus: naval skozi pravo aplikacijo, vrsta dela, vsa sporočila končana", () => {
  const out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "evklid-naval-test-")), "izid.json");
  const r = zagon(["--preizkus", "--hkrati", "6", "--socasno", "2"], { EVKLID_MERI_IZID: out });
  assert.equal(r.status, 0, r.stderr + r.stdout.slice(-500));
  const { vsote, izid, socasno } = JSON.parse(fs.readFileSync(out, "utf8"));
  assert.equal(socasno, 2);
  assert.equal(izid.length, 6);
  assert.equal(vsote.koncanih, 6);
  assert.equal(vsote.vVrsti, 4, "dva takoj, štirje v vrsti");
  assert.equal(vsote.najvisjeMesto, 4);
  assert.equal(vsote.napake529 + vsote.napake429 + vsote.drugeNapake, 0);
  for (const x of izid) {
    assert.equal(x.status, 200);
    assert.ok(x.prviDeltaMs !== null && x.skupajMs >= x.prviDeltaMs);
    if (x.vrsta.length) assert.ok(x.naVrstiMs !== null && x.naVrstiMs <= x.prviDeltaMs);
  }
  assert.match(r.stdout, /IZID: 6\/6 končanih; v vrsti 4/);
});

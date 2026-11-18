// scripts/meri-preizkus3-vse.mjs: vseh 150 nalog Preizkusa 3 skozi pravo pot klepeta. Brez klicev API (--suho).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { normalizeSettings } from "../server/settings.js";

const root = fileURLToPath(new URL("..", import.meta.url));
const skripta = path.join(root, "scripts/meri-preizkus3-vse.mjs");
const { naloge } = JSON.parse(
  fs.readFileSync(path.join(root, "scripts/preizkus3-naloge.json"), "utf8"),
);

test("naloge: 150, po vrsti, Vodenje z dvema odgovoroma v načinu A, ostale v načinu B; nastavitve veljavne", () => {
  assert.deepEqual(
    naloge.map((n) => n.id),
    Array.from({ length: 150 }, (_, i) => i + 1),
  );
  const vodenje = naloge.filter((n) => n.odgovori);
  assert.deepEqual(
    vodenje.map((n) => n.id),
    [6, 25, 40, 50, 93, 112],
  );
  for (const n of naloge) {
    assert.ok(n.q.length > 20 && !n.q.includes("```"), `naloga ${n.id}`);
    assert.equal(
      n.nastavitve.solving_mode,
      n.odgovori ? "A" : "B",
      `naloga ${n.id}`,
    );
    if (n.odgovori) assert.equal(n.odgovori.length, 2);
    const s = normalizeSettings(n.nastavitve);
    // Nastavitev, ki je normalizeSettings ne bi sprejel, bi tiho postala privzeta: vse morajo ostati.
    for (const [k, v] of Object.entries(n.nastavitve))
      assert.equal(s[k], v, `naloga ${n.id}: ${k}`);
    if (n.nastavitve.goal === "tekmovanje")
      assert.equal(s.track, "COMPETITION");
  }
  assert.equal(vodenje.find((n) => n.id === 6).odgovori[1], "Ne vem.");
});

const zagon = (...a) =>
  spawnSync(
    process.execPath,
    ["--disable-warning=ExperimentalWarning", skripta, ...a],
    {
      cwd: fs.mkdtempSync(path.join(os.tmpdir(), "p3-vse-")),
      encoding: "utf8",
      timeout: 120000,
      env: {
        ...process.env,
        ANTHROPIC_API_KEY: "sk-ni-pravi",
        EVKLID_MOCK: "",
      },
    },
  );

test("--suho: brez klica (tudi s ključem), Vodenje tri sporočila", () => {
  const r = zagon(
    "--suho",
    "--naloge",
    "1,6,19",
    "--hkrati",
    "2",
    "--out",
    "data/meri-p3-test.json",
  );
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /suho \(brez klicev\)/);
  assert.match(r.stdout, /Nalog: 3\/3 brez napake; odgovorov 5/);
  assert.match(r.stdout, /Strošek 0\.0000 \$/);
});

test("--suho: zapis izida in --del", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "p3-vse-"));
  const r = spawnSync(
    process.execPath,
    [
      "--disable-warning=ExperimentalWarning",
      skripta,
      "--suho",
      "--naloge",
      "1,6,19",
      "--del",
      "1-2",
    ],
    {
      cwd: dir,
      encoding: "utf8",
      timeout: 120000,
      env: {
        ...process.env,
        ANTHROPIC_API_KEY: "sk-ni-pravi",
        EVKLID_MOCK: "",
      },
    },
  );
  assert.equal(r.status, 0, r.stderr);
  const d = JSON.parse(
    fs.readFileSync(path.join(dir, "data/meri-preizkus3-vse-1-2.json"), "utf8"),
  );
  assert.equal(d.koncano, true);
  assert.equal(d.porabljeno, 0);
  assert.equal(d.suho, true);
  assert.deepEqual(Object.keys(d.naloge), ["1", "19"]); // 1. in 3. izbrana naloga
  for (const v of Object.values(d.naloge)) {
    assert.equal(v.out.length, 1);
    assert.ok(
      Number.isInteger(v.out[0].ms) &&
        typeof v.out[0].txt === "string" &&
        v.out[0].txt.length > 0,
    );
    assert.doesNotMatch(v.out[0].txt, /<<|META/);
    assert.ok(v.conv && v.ts && v.tsEnd);
  }
  assert.equal(d.naloge["19"].nastavitve.study_course, "UNI-ULFRI-OMA");
  const d2 = spawnSync(
    process.execPath,
    [
      "--disable-warning=ExperimentalWarning",
      skripta,
      "--suho",
      "--naloge",
      "6",
    ],
    {
      cwd: dir,
      encoding: "utf8",
      timeout: 120000,
      env: { ...process.env, ANTHROPIC_API_KEY: "", EVKLID_MOCK: "" },
    },
  );
  assert.equal(d2.status, 0, d2.stderr);
  const v6 = JSON.parse(
    fs.readFileSync(path.join(dir, "data/meri-preizkus3-vse.json"), "utf8"),
  ).naloge["6"];
  assert.equal(v6.out.length, 3, "Vodenje: naloga, napačen korak, »Ne vem.«");
  assert.equal(v6.nastavitve.solving_mode, "A");
});

test("neveljavni argumenti končajo z 1 pred vsakim klicem; brez ključa in brez --suho tudi", () => {
  for (const a of [
    ["--x"],
    ["--del", "3-2"],
    ["--del", "1/2"],
    ["--hkrati", "9"],
    ["--naloge", "0"],
    ["--naloge", "5,5"],
    ["--max-usd", "6"],
    ["--out", "/etc/x.json"],
    ["--max-usd=1"],
  ]) {
    assert.equal(zagon("--suho", ...a).status, 1, a.join(" "));
  }
  const brez = spawnSync(process.execPath, [skripta, "--naloge", "1"], {
    encoding: "utf8",
    timeout: 60000,
    env: {
      ...process.env,
      ANTHROPIC_API_KEY: "",
      ANTHROPIC_AUTH_TOKEN: "",
      EVKLID_MOCK: "",
    },
  });
  assert.equal(brez.status, 1);
  assert.match(brez.stderr, /Ni ključa API/);
});

test("delovni tok Meritev jo sprejme: upošteva --max-usd, --suho nikoli ne kliče API", () => {
  const src = fs.readFileSync(skripta, "utf8");
  assert.match(src, /arg\("(--)?max-usd"/); // isti vzorec kot korak »Skripta upošteva --max-usd« v meri.yml
  assert.match(
    src,
    /if \(SUHO\) \{\n\s+process\.env\.EVKLID_MOCK = "1";\n\s+delete process\.env\.ANTHROPIC_API_KEY;/,
  );
  assert.match(src, /process\.env\.EVKLID_ANSWER_CACHE = "0";/); // vsak odgovor nov
  // Argumenti iz polja »argumenti« (samo a-z 0-9 presledek , = . -) zadoščajo za oba dela.
  for (const a of [
    "--del 1-2 --hkrati 4",
    "--del 2-2 --kot-produkcija --s-pregledom",
  ])
    assert.match(a, /^[a-z0-9 ,=.-]*$/);
});

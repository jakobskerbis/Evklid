// Ista vprašanja za Evklid in Astro AI (scripts/meri-astra.mjs, primerjava 21. 11. 2026): brez klicev API.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const env = { ...process.env, ANTHROPIC_API_KEY: "", EVKLID_DATA_KEY: "" };
const skripta = "scripts/meri-astra.mjs";

test("astra-vprasanja: 10 primerov s profilom in krogi; pričakovani izid ne gre v skripto", () => {
  const { primeri } = JSON.parse(fs.readFileSync(new URL("./fixtures/astra-vprasanja.json", import.meta.url), "utf8"));
  assert.equal(primeri.length, 10);
  assert.equal(new Set(primeri.map((p) => p.id)).size, 10);
  for (const p of primeri) {
    assert.ok(["OSNOVNA_SOLA", "SREDNJA_SOLA"].includes(p.profil.educational_track), p.id);
    assert.ok(p.krogi.length >= 1 && p.krogi.every((k) => k.length > 10), p.id);
    assert.ok(p.pricakovano.length > 5, p.id);
  }
  assert.doesNotMatch(fs.readFileSync(skripta, "utf8"), /pricakovano/);
});

test("meri-astra: --suho brez klica; neveljavni argumenti končajo z 1", () => {
  const suho = spawnSync(process.execPath, [skripta, "--suho"], { encoding: "utf8", env });
  assert.equal(suho.status, 0, suho.stderr);
  assert.match(suho.stdout, /10 primerov, 11 krogov; način think/);
  assert.match(suho.stdout, /Različica: trenutni inštruktor \(system_prompt\.md\); izid data\/meri-astra\.json/);
  const kand = spawnSync(process.execPath, [skripta, "--suho", "--kandidat"], { encoding: "utf8", env: { ...env, EVKLID_MERI_IZID: "" } });
  assert.equal(kand.status, 0, kand.stderr);
  assert.match(kand.stdout, /Različica: KANDIDAT \(system_prompt-kandidat\.md\); izid data\/meri-astra-kandidat\.json/);
  for (const slab of [["--max-usd", "9"], ["--nacin", "deep"], ["--max-usd=1"], ["--neznano"], ["--kandidat=1"]]) {
    assert.equal(spawnSync(process.execPath, [skripta, "--suho", ...slab], { encoding: "utf8", env }).status, 1, slab.join(" "));
  }
});

test("meri-astra --preizkus: vsi primeri in drugi krog v istem pogovoru skozi pravo aplikacijo", () => {
  const out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "evklid-astra-test-")), "izid.json");
  const r = spawnSync(process.execPath, [skripta, "--preizkus"], { encoding: "utf8", env: { ...env, EVKLID_MERI_IZID: out }, timeout: 180000 });
  assert.equal(r.status, 0, r.stderr + r.stdout.slice(-500));
  const izid = JSON.parse(fs.readFileSync(out, "utf8"));
  assert.equal(izid.koncano, true);
  assert.equal(izid.izid.length, 10);
  assert.equal(izid.izid[0].prepis.length, 2, "1b v istem pogovoru");
  assert.ok(izid.izid.every((x) => x.prepis.every((k) => k.evklid.length > 0 && k.ms >= 0)));
  // Čas do prvega besedila, ki ga vidi učenec, je izmerjen in ni po koncu odgovora.
  assert.ok(izid.izid.every((x) => x.prepis.every((k) => Number.isFinite(k.prvoMs) && k.prvoMs >= 0 && k.prvoMs <= k.ms)));
  const m = /ODGOVORI-ZACETEK\n(.*)\nODGOVORI-KONEC/.exec(r.stdout);
  assert.ok(m, "odgovori v dnevniku");
  assert.equal(JSON.parse(m[1]).length, 10);
});

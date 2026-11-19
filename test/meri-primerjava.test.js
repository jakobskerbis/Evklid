// Odgovori Evklida za slepo primerjavo (scripts/meri-primerjava.mjs, točka 5 načrta izboljšav): brez klicev API.
// --suho ne kliče modela, neveljavni argumenti končajo z 1, --preizkus pelje vseh 20 nalog skozi pravo aplikacijo (0 $).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const env = { ...process.env, ANTHROPIC_API_KEY: "", EVKLID_DATA_KEY: "" };
const skripta = "scripts/meri-primerjava.mjs";

test("primerjava-20: 20 nalog z ravnjo, računalom in besedilom, brez rešitev", () => {
  const { naloge } = JSON.parse(fs.readFileSync(new URL("./fixtures/primerjava-20.json", import.meta.url), "utf8"));
  assert.equal(naloge.length, 20);
  assert.equal(new Set(naloge.map((t) => t.id)).size, 20);
  for (const t of naloge) {
    assert.ok(["osnovna", "višja"].includes(t.raven), t.id);
    assert.equal(typeof t.racunalo, "boolean", t.id);
    assert.ok(t.besedilo.length > 20, t.id);
    assert.equal(t.uradni, undefined, "rešitev ne gre v skripto");
  }
});

test("meri-primerjava: --suho brez klica; neveljavni argumenti končajo z 1", () => {
  const suho = spawnSync(process.execPath, [skripta, "--suho"], { encoding: "utf8", env });
  assert.equal(suho.status, 0, suho.stderr);
  assert.match(suho.stdout, /20 nalog; način think/);
  for (const slab of [["--max-usd", "9"], ["--nacin", "deep"], ["--max-usd=1"], ["--neznano"]]) {
    assert.equal(spawnSync(process.execPath, [skripta, "--suho", ...slab], { encoding: "utf8", env }).status, 1, slab.join(" "));
  }
});

test("meri-primerjava --preizkus: vseh 20 nalog skozi pravo aplikacijo, odgovori v datoteki in dnevniku", () => {
  const out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "evklid-primerjava-test-")), "izid.json");
  const r = spawnSync(process.execPath, [skripta, "--preizkus"], { encoding: "utf8", env: { ...env, EVKLID_MERI_IZID: out }, timeout: 180000 });
  assert.equal(r.status, 0, r.stderr + r.stdout.slice(-500));
  const izid = JSON.parse(fs.readFileSync(out, "utf8"));
  assert.equal(izid.koncano, true);
  assert.equal(izid.izid.length, 20);
  assert.ok(izid.izid.every((x) => x.odgovor.length > 0));
  const m = /ODGOVORI-ZACETEK\n(.*)\nODGOVORI-KONEC/.exec(r.stdout);
  assert.ok(m, "odgovori v dnevniku");
  assert.equal(JSON.parse(m[1]).length, 20);
});

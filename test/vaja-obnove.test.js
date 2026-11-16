// Vaja obnove na sveži namestitvi (scripts/vaja-obnove.mjs, docs/obnova.md): kopija → prazen strežnik → obnova →
// prijava, profil in šifrirani pogovori; tudi pot prek kopije zunaj strežnika (lokalni nadomestek R2) in napačen ključ.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

test("vaja obnove: sveža namestitev iz lokalne in zunanje kopije", { timeout: 300_000 }, async () => {
  const { stdout } = await promisify(execFile)(process.execPath, ["--disable-warning=ExperimentalWarning", "scripts/vaja-obnove.mjs", "--ucencev", "2", "--json"], {
    timeout: 280_000,
  }).catch((e) => assert.fail(`vaja ni uspela:\n${e.stdout}\n${e.stderr}`));
  const izid = JSON.parse(stdout);
  assert.deepEqual(izid.napake, []);
  assert.ok(izid.casi.every((c) => c.ok));
  for (const k of ["B: ponovni zagon (obnova ob zagonu)", "C: ponovni zagon (obnova ob zagonu)", "Napačen ključ: --preveri zazna neberljive pogovore"])
    assert.ok(izid.casi.some((c) => c.korak === k), k);
  assert.equal(izid.vrstice.students, 5); // 3 pravi + 2 sintetična
  assert.equal(izid.vrstice.messages, 3 * 2 + 2 * 30 * 6);
});

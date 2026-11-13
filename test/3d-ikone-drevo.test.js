// Ikone vej drevesa »3D svet« (docs/3d.md »Ikone vej drevesa«): za vsak motiv in vsak slog
// public/3d/ikone-drevo/<slog>/<id>.webp, 512×512 s prozornostjo, ≤ 80 KB.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKRIPTE = path.join(ROOT, "scripts", "3d-ikone-drevo");
const MAPA = path.join(ROOT, "public", "3d", "ikone-drevo");

const motivi = fs.readFileSync(path.join(SKRIPTE, "motivi.py"), "utf8");
const blokMotivi = motivi.slice(motivi.indexOf("MOTIVI = {"), motivi.indexOf("\n}", motivi.indexOf("MOTIVI = {")));
const IDS = [...blokMotivi.matchAll(/^\s+"([a-z-]+)": \("(bio|kem|fiz|mat)"/gm)].map((m) => m[1]);
const jedro = fs.readFileSync(path.join(SKRIPTE, "jedro.py"), "utf8");
const SLOGI = [...jedro.match(/^SLOGI = \(([^)]*)\)/m)[1].matchAll(/"([a-z]+)"/g)].map((m) => m[1]);

test("ikone drevesa: 31 motivov in 6 slogov", () => {
  assert.equal(IDS.length, 31);
  assert.equal(new Set(IDS).size, 31);
  assert.deepEqual(SLOGI, ["cist", "antik", "renesansa", "bagdad", "indija", "egipt"]);
});

test("ikone drevesa: drevo v motivi.py pokrije vse motive", () => {
  const drevo = [...motivi.slice(motivi.indexOf("DREVO = [")).matchAll(/\("([a-z-]+)", (None|"[a-z-]+")\)/g)].map((m) => m[1]);
  assert.deepEqual([...drevo].sort(), [...IDS].sort());
});

for (const slog of SLOGI) {
  test(`ikone drevesa: slog ${slog} ima vseh 31 ikon WebP 512×512 s prozornostjo ≤ 80 KB`, () => {
    const datoteke = fs.readdirSync(path.join(MAPA, slog)).sort();
    assert.deepEqual(datoteke, IDS.map((i) => `${i}.webp`).sort(), "odvečne ali manjkajoče datoteke");
    for (const id of IDS) {
      const f = path.join(MAPA, slog, `${id}.webp`);
      const b = fs.readFileSync(f);
      assert.ok(b.length <= 80 * 1024, `${slog}/${id}.webp ima ${b.length} B`);
      assert.equal(b.toString("ascii", 0, 4), "RIFF", `${slog}/${id}.webp ni RIFF`);
      assert.equal(b.toString("ascii", 8, 12), "WEBP", `${slog}/${id}.webp ni WebP`);
      assert.equal(b.toString("ascii", 12, 16), "VP8X", `${slog}/${id}.webp nima razširjene glave (prozornost)`);
      assert.ok(b[20] & 0x10, `${slog}/${id}.webp nima kanala alfa`);
      const w = 1 + b.readUIntLE(24, 3);
      const h = 1 + b.readUIntLE(27, 3);
      assert.deepEqual([w, h], [512, 512], `${slog}/${id}.webp je ${w}×${h}`);
    }
  });
}

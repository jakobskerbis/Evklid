// Krog r1 (ocena 20. nov): orodja za možgane (hrbtenjača), oko (glava vidnega živca) in ledvico.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { osHrbtenjace, cevElipsa } from "../scripts/atlas/mozgani-hrbtenjaca.mjs";

const ORGANI = path.join(import.meta.dirname, "..", "public", "3d", "modeli", "organi-3d");
const json = (o) => JSON.parse(fs.readFileSync(path.join(ORGANI, `${o}.json`), "utf8"));

// zaprta, enotno navita mreža: vsak rob v dveh ploskvah v nasprotnih smereh
function zaprtaUsmerjena(F) {
  const r = new Map();
  for (let i = 0; i < F.length; i += 3) for (let k = 0; k < 3; k++) { const a = F[i + k], b = F[i + (k + 1) % 3]; r.set(`${a},${b}`, (r.get(`${a},${b}`) || 0) + 1); }
  for (const [k, n] of r) { const [a, b] = k.split(","); if (n !== 1 || r.get(`${b},${a}`) !== 1) return false; }
  return true;
}

test("r1: hrbtenjača – os navzdol, zožitev na 11 × 8,5 mm, zaprta cev", () => {
  const W = [];
  for (let y = 0; y <= 0.03; y += 0.0005) for (let k = 0; k < 16; k++) { const f = (k / 16) * 2 * Math.PI; W.push([0.007 * Math.cos(f), y - 0.06, 0.006 * Math.sin(f) - 0.004]); }
  const o = osHrbtenjace(W);
  assert.ok(o.os[0][1] > -0.06 && o.os.at(-1)[1] < -0.085, "od dna debla 30 mm navzdol");
  assert.ok(Math.abs(o.a.at(-1) - 0.0055) < 1e-6 && Math.abs(o.b.at(-1) - 0.00425) < 1e-6);
  const c = cevElipsa(o.os, o.a, o.b, 12);
  // pokrova imata svoja oglišča: zvari po položaju
  const kl = new Map(), id = c.P.map((p) => { const k = p.map((x) => Math.round(x * 1e7)).join(); if (!kl.has(k)) kl.set(k, kl.size); return kl.get(k); });
  assert.ok(zaprtaUsmerjena(c.F.map((i) => id[i])), "cev zaprta in enotno navita");
  const m = json("mozgani");
  assert.ok(m.prerez.hrbtenjaca.os.length > 5 && m.prerez.slika.lo[1] < m.prerez.hrbtenjaca.os.at(-1)[1], "risba reza sega do konca hrbtenjače");
});

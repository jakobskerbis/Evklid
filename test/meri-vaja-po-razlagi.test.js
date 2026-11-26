// K-08: gumb »Podobna naloga« na neodvisnem naboru 200 primerov (scripts/meri-vaja-po-razlagi.mjs,
// docs/meritve/vaja-po-razlagi-2026-11-26.md). Nikoli gumb na temo učenčeve poti, ki ni med sprejemljivimi, in
// vsaka naloga za gumb ima odgovor, ki ga preverjanje kode sprejme. Teme nižjih razredov se štejejo posebej.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { NABOR, meri } from "../scripts/meri-vaja-po-razlagi.mjs";
import { getTopic } from "../server/curriculum.js";

const primeri = JSON.parse(fs.readFileSync(NABOR, "utf8"));
const v = meri(primeri);

test("nabor: 200 primerov, enkratni id-ji, sprejemljive teme obstajajo", () => {
  assert.equal(primeri.length, 200);
  assert.equal(new Set(primeri.map((p) => p.id)).size, 200);
  for (const p of primeri) for (const t of p.sprejemljive) assert.ok(getTopic(t), `${p.id}: ${t}`);
});

test("0 gumbov z napačno temo učenčeve poti", () => {
  const napacne = v.filter((x) => x.izid === "napacna tema").map((x) => `${x.id} »${x.poizvedba}« → ${x.tema}`);
  assert.deepEqual(napacne, []);
});

test("vsaka naloga za gumb (ravni 1–3) ima odgovor, ki ga koda sprejme", () => {
  for (const x of v) for (const n of x.naloge) assert.ok(n.samopreverba == null || n.samopreverba === "correct", `${x.id}/${n.raven}: ${n.samopreverba}`);
});

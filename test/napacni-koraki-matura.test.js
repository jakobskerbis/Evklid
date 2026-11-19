// Realistični koraki maturanta (test/fixtures/napacni-koraki-matura.json, meritev scripts/meri-prav-matura.mjs):
// oblika nabora, sodba kode brez lažnega alarma in pot meritve skozi pravo aplikacijo v preizkusnem načinu (0 $).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { presolve, isClaim, looksLikeTask } from "../server/live-check.js";
import { stepVerdict } from "../server/sodba-koraka.js";

const { primeri } = JSON.parse(fs.readFileSync(new URL("./fixtures/napacni-koraki-matura.json", import.meta.url), "utf8"));
const VRSTE = ["predznak", "racun", "formula", "delni", "vecstopenjski", "odstotki", "enote", "vprasanje", "besedilo", "pravilen"];

test("nabor napačnih korakov (matura MAT): oblika, raznolikost in pravilni koraki za primerjavo", () => {
  assert.ok(primeri.length >= 100, `${primeri.length} primerov`);
  assert.equal(new Set(primeri.map((p) => p.id)).size, primeri.length, "id-ji so različni");
  for (const p of primeri) {
    assert.match(p.id, /^[a-z0-9-]+$/, p.id);
    assert.ok(VRSTE.includes(p.vrsta), `${p.id}: vrsta ${p.vrsta}`);
    assert.equal(typeof p.pravilen, "boolean", p.id);
    assert.equal(p.vrsta === "pravilen", p.pravilen, `${p.id}: vrsta »pravilen« natanko za pravilne korake`);
    for (const t of [p.naloga, p.ucenec, p.zakaj, ...p.pogovor]) assert.ok(typeof t === "string" && t.trim(), p.id);
    // Pogovor se začne in konča z inštruktorjem (izmenično), nato pride učenčev korak.
    assert.equal(p.pogovor.length % 2, 1, `${p.id}: pogovor se konča z inštruktorjem`);
  }
  const napacni = primeri.filter((p) => !p.pravilen);
  assert.ok(napacni.length >= 60 && primeri.length - napacni.length >= 25);
  for (const v of VRSTE.filter((v) => v !== "pravilen")) assert.ok(napacni.filter((p) => p.vrsta === v).length >= 3, `vrsta ${v}: vsaj 3 primeri`);
});

test("sodba kode na realističnih korakih: pravilen korak nikoli »napačen«, napačen korak nikoli »pravilen« (razen delnega)", () => {
  // Ista pot kot server/app.js: trditev (isClaim), naloga iz zadnjega sporočila, ki ga reševalnik reši, in nič, če je
  // za njo učenec poslal še kaj, kar je videti kot naloga.
  for (const p of primeri) {
    const users = [p.naloga, ...p.pogovor.filter((_, i) => i % 2 === 1)];
    const prevTutor = p.pogovor.at(-1);
    const claim = !presolve(p.ucenec, { first: false }) && isClaim(p.ucenec, prevTutor);
    let pre = null;
    let at = -1;
    for (let i = users.length - 1; claim && i >= 0 && !pre; i--) {
      pre = presolve(users[i], { first: i === 0 });
      at = i;
    }
    if (pre && users.slice(at + 1).some(looksLikeTask)) pre = null;
    const v = claim ? stepVerdict(p.ucenec, { pre, prevTutor }) : null;
    if (!v) continue;
    if (p.pravilen) assert.equal(v.wrong, false, `${p.id}: lažni alarm`);
    else assert.ok(v.wrong || v.partial, `${p.id}: napačen korak označen kot pravilen`);
  }
});

test("meri-prav-matura: --suho brez klica, --preizkus pelje korak skozi pravo aplikacijo (0 $)", () => {
  const env = { ...process.env, ANTHROPIC_API_KEY: "", ANTHROPIC_AUTH_TOKEN: "", EVKLID_MOCK: "" };
  const suho = spawnSync(process.execPath, ["scripts/meri-prav-matura.mjs", "--suho"], { encoding: "utf8", env });
  assert.equal(suho.status, 0, suho.stderr);
  assert.match(suho.stdout, new RegExp(`^${primeri.length} primerov`));
  for (const slab of [["--del", "3-2"], ["--nacin", "deep"], ["--max-usd=1"], ["--primeri", "ni-takega"]]) {
    assert.equal(spawnSync(process.execPath, ["scripts/meri-prav-matura.mjs", "--suho", ...slab], { encoding: "utf8", env }).status, 1, slab.join(" "));
  }
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-prav-test-"));
  try {
    const out = path.join(dir, "izid.json");
    const r = spawnSync(process.execPath, ["scripts/meri-prav-matura.mjs", "--preizkus", "--primeri", "minus-pred-oklepajem,vprasanje-log"], { encoding: "utf8", env: { ...env, EVKLID_MERI_IZID: out }, timeout: 120000 });
    assert.equal(r.status, 0, r.stderr + r.stdout);
    const izid = JSON.parse(fs.readFileSync(out, "utf8"));
    assert.equal(izid.koncano, true);
    assert.deepEqual(izid.izid.map((x) => x.id), ["minus-pred-oklepajem", "vprasanje-log"]);
    for (const x of izid.izid) {
      assert.ok(x.odgovor.length > 20, "besedilo, kot ga vidi učenec");
      assert.ok(x.klici.length >= 1, "klic inštruktorja je zapisan v porabo");
    }
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

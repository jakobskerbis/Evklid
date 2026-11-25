// Pedagoške mere (scripts/meri-pedagogika.mjs, točka 25 načrta izboljšav): brez klicev API.
// --suho ne kliče modela, neveljavni argumenti končajo z 1, --preizkus pelje vseh 12 pogovorov po 3 sporočila skozi
// pravo aplikacijo (0 $), rezultat in napaka iz vzorca nikoli ne gresta modelu.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { asksForSolution } from "../server/nacin.js";

const env = { ...process.env, ANTHROPIC_API_KEY: "", EVKLID_DATA_KEY: "" };
const skripta = "scripts/meri-pedagogika.mjs";
const { pogovori } = JSON.parse(fs.readFileSync(new URL("./fixtures/pedagogika-12.json", import.meta.url), "utf8"));

test("pedagogika-12: 12 pogovorov, 8 napačnih in 4 pravilni koraki, nobeno sporočilo ne prosi za rešitev", () => {
  assert.equal(pogovori.length, 12);
  assert.equal(new Set(pogovori.map((p) => p.id)).size, 12);
  assert.equal(pogovori.filter((p) => p.korak_pravilen === false).length, 8);
  for (const p of pogovori) {
    for (const k of ["naloga", "korak", "tretje", "rezultat"]) assert.ok(p[k]?.length > 0, `${p.id} ${k}`);
    assert.equal(!!p.napaka, !p.korak_pravilen, `${p.id}: napaka le pri napačnem koraku`);
    // Način A brez izrecne prošnje (server/nacin.js): meri se vodenje, ne celotna rešitev.
    for (const t of [p.naloga, p.korak, p.tretje]) assert.equal(asksForSolution(t), false, `${p.id}: ${t}`);
  }
});

test("meri-pedagogika: --suho brez klica; neveljavni argumenti končajo z 1", () => {
  const suho = spawnSync(process.execPath, [skripta, "--suho"], { encoding: "utf8", env });
  assert.equal(suho.status, 0, suho.stderr);
  assert.match(suho.stdout, /12 pogovorov po 3 sporočila; način think/);
  assert.match(suho.stdout, /Različica: trenutni inštruktor \(system_prompt\.md\); izid data\/meri-pedagogika\.json/);
  // --kandidat (j 21. 11. 2026): kandidat prompta in popravkov, ločena privzeta datoteka izida.
  const kand = spawnSync(process.execPath, [skripta, "--suho", "--kandidat"], { encoding: "utf8", env: { ...env, EVKLID_MERI_IZID: "" } });
  assert.equal(kand.status, 0, kand.stderr);
  assert.match(kand.stdout, /Različica: KANDIDAT \(system_prompt-kandidat\.md\); izid data\/meri-pedagogika-kandidat\.json/);
  // Argument mora prestati filter vnosov v .github/workflows/meri.yml (samo a-z 0-9 presledek , = . -).
  const wf = fs.readFileSync(new URL("../.github/workflows/meri.yml", import.meta.url), "utf8");
  const vzorec = /if \[\[ ! "\$ARGUMENTI" =~ \^\[(.*?)\]\*\$ \]\]/.exec(wf);
  assert.ok(vzorec, "filter argumentov v meri.yml");
  assert.match("--kandidat --nacin chat", new RegExp(`^[${vzorec[1].replace("\\ ", " ")}]*$`));
  for (const slab of [["--max-usd", "9"], ["--nacin", "deep"], ["--max-usd=1"], ["--model", "sonnet"], ["--kandidat=1"]]) {
    assert.equal(spawnSync(process.execPath, [skripta, "--suho", ...slab], { encoding: "utf8", env }).status, 1, slab.join(" "));
  }
});

test("meri-pedagogika --preizkus: 12 pogovorov po 3 sporočila skozi pravo aplikacijo, prepisi v datoteki in dnevniku", () => {
  const out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "evklid-pedagogika-test-")), "izid.json");
  const r = spawnSync(process.execPath, [skripta, "--preizkus"], { encoding: "utf8", env: { ...env, EVKLID_MERI_IZID: out }, timeout: 180000 });
  assert.equal(r.status, 0, r.stderr + r.stdout.slice(-500));
  const izid = JSON.parse(fs.readFileSync(out, "utf8"));
  assert.equal(izid.koncano, true);
  assert.equal(izid.izid.length, 12);
  for (const x of izid.izid) {
    assert.equal(x.prepis.length, 3, x.id);
    const p = pogovori.find((q) => q.id === x.id);
    assert.ok(x.prepis[0].ucenec.endsWith(p.naloga));
    assert.equal(x.prepis[1].ucenec, p.korak, x.id);
    assert.equal(x.prepis[2].ucenec, p.tretje, x.id);
    // Sporočila, kot jih skripta res pošlje (z uvodnim stavkom), ne prosijo za rešitev.
    for (const s of x.prepis) assert.equal(asksForSolution(s.ucenec), false, `${x.id}: ${s.ucenec}`);
    // Rezultat in opis napake sta samo za ocenjevalca (pri pravilnih korakih učenec do rezultata pride sam).
    if (!p.korak_pravilen) assert.ok(x.prepis.every((s) => !s.ucenec.includes(p.rezultat) && !s.ucenec.includes(p.napaka)), x.id);
  }
  assert.equal(izid.kandidat, false);
  assert.equal(izid.prompt, "system_prompt.md");
  const m = /ODGOVORI-ZACETEK\n(.*)\nODGOVORI-KONEC/.exec(r.stdout);
  assert.ok(m, "prepisi v dnevniku");
  assert.equal(JSON.parse(m[1]).length, 12);
});

test("meri-pedagogika: ustavi se pred mejo stroška in zapiše ustavljeno", () => {
  const out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "evklid-pedagogika-test-")), "izid.json");
  const r = spawnSync(process.execPath, [skripta, "--preizkus", "--max-usd", "0.3"], { encoding: "utf8", env: { ...env, EVKLID_MERI_IZID: out }, timeout: 60000 });
  assert.equal(r.status, 1, r.stdout.slice(-500));
  const izid = JSON.parse(fs.readFileSync(out, "utf8"));
  assert.equal(izid.ustavljeno, true);
  assert.equal(izid.izid.length, 0);
  assert.match(r.stdout, /ustavljeno pred mejo 0.3 \$/);
});

test("meri-pedagogika --preizkus --kandidat: zapiše različico in uporabi prompt kandidata", () => {
  const out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "evklid-pedagogika-test-")), "izid.json");
  const r = spawnSync(process.execPath, [skripta, "--preizkus", "--kandidat"], { encoding: "utf8", env: { ...env, EVKLID_MERI_IZID: out, EVKLID_INSTRUKTOR_KANDIDAT: "" }, timeout: 180000 });
  assert.equal(r.status, 0, r.stderr + r.stdout.slice(-500));
  const izid = JSON.parse(fs.readFileSync(out, "utf8"));
  assert.equal(izid.kandidat, true);
  assert.equal(izid.prompt, "system_prompt-kandidat.md");
  assert.equal(izid.koncano, true);
  assert.equal(izid.izid.length, 12);
  assert.ok(izid.izid.every((x) => x.prepis.length === 3));
});

// Delovni tok »Meritev« (.github/workflows/meri.yml): ročna plačana meritev scripts/meri-*.mjs v GitHub Actions.
// Brez klicev API: preveri varovalke v datoteki in zažene korak »Preveri vnose« z različnimi vnosi.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const y = fs.readFileSync(new URL("../.github/workflows/meri.yml", import.meta.url), "utf8");

test("meri.yml: le ročni zagon z main, samo branje, en zagon naenkrat, časovna meja", () => {
  assert.match(y, /^on:\n  workflow_dispatch:\n/m);
  assert.doesNotMatch(y, /^\s+(push|pull_request|pull_request_target|schedule|workflow_run):/m);
  assert.match(y, /^permissions:\n  contents: read\n/m);
  assert.match(y, /^    if: github\.ref == 'refs\/heads\/main'$/m);
  assert.match(y, /^concurrency:\n  group: \S+\n  cancel-in-progress: false$/m);
  assert.match(y, /^    timeout-minutes: 30$/m);
  assert.match(y, /persist-credentials: false/);
  for (const a of y.match(/uses: \S+/g)) assert.match(a, /@[0-9a-f]{40}$/, `${a} ni pripet na SHA`);
});

test("meri.yml: skrivnost le v koraku Meritev, nikjer ${{ }} v skriptah run", () => {
  assert.equal((y.match(/secrets\./g) || []).length, 1);
  const korak = y.split(/\n      - /).find((k) => k.includes("secrets."));
  assert.match(korak, /^name: Meritev\n/);
  assert.match(korak, /ANTHROPIC_API_KEY: \$\{\{ secrets\.ANTHROPIC_API_KEY \}\}/);
  assert.match(korak, /--max-usd "\$MAX"/);
  assert.match(korak, /EVKLID_DB: \$\{\{ runner\.temp \}\}/);
  // Vsebina vsakega bloka run (zamaknjene vrstice za »run: |«) ne sme imeti izrazov ${{ }}.
  for (const m of y.matchAll(/^(\s+)run: \|\n((?:\1  .*\n|\s*\n)+)/gm)) assert.doesNotMatch(m[2], /\$\{\{/);
  for (const m of y.matchAll(/^\s+run: (?!\|)(.+)$/gm)) assert.doesNotMatch(m[1], /\$\{\{/);
});

test("meri.yml: artefakt z dnevnikom in JSON ostane 30 dni, tudi ob napaki", () => {
  assert.match(y, /upload-artifact@[^\n]+\n\s+if: always\(\)/);
  assert.match(y, /meri\.log\n\s+data\/meri-\*\.json/);
  assert.match(y, /retention-days: 30/);
});

// Korak »Preveri vnose« izluščen iz datoteke in zagnan z bash.
const skripta = (() => {
  const m = y.match(/- name: Preveri vnose\n[\s\S]*?\n {8}run: \|\n((?: {10}.*\n|\s*\n)+)/);
  assert.ok(m, "korak Preveri vnose");
  return m[1].replace(/^ {10}/gm, "");
})();
const MAIN = "a".repeat(40);
function preveri(vnosi) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "meri-yml-"));
  const out = path.join(dir, "out");
  fs.writeFileSync(out, "");
  const env = { PATH: process.env.PATH, GITHUB_OUTPUT: out, MAIN_SHA: MAIN, REPO: "x/y", SKRIPTA: "scripts/meri-preizkus3.mjs", SHA: "", MAX_USD: "2", ARGUMENTI: "", ...vnosi };
  const r = spawnSync("bash", ["-c", skripta], { env, encoding: "utf8" });
  const izhod = Object.fromEntries(fs.readFileSync(out, "utf8").trim().split("\n").filter(Boolean).map((v) => v.split("=")));
  fs.rmSync(dir, { recursive: true, force: true });
  return { status: r.status, izhod };
}

test("meri.yml: preverjanje vnosov sprejme veljavne in zniža mejo na 2 $", () => {
  assert.deepEqual(preveri({}), { status: 0, izhod: { ref: MAIN, max: "2" } });
  assert.deepEqual(preveri({ MAX_USD: "0.5", ARGUMENTI: "--samo-novi --naloge 19,45" }).izhod, { ref: MAIN, max: "0.5" });
  assert.equal(preveri({ MAX_USD: "100" }).izhod.max, "2");
  assert.equal(preveri({ MAX_USD: "2.5" }).izhod.max, "2");
  assert.equal(preveri({ SKRIPTA: "scripts/meri-hitri-korak.mjs", SHA: MAIN }).status, 0);
});

test("meri.yml: preverjanje vnosov zavrne neveljavne", () => {
  for (const v of [
    { SKRIPTA: "scripts/meritev-po-objavi.mjs" },
    { SKRIPTA: "scripts/meri-x.cjs" },
    { SKRIPTA: "scripts/../server/app.mjs" },
    { SKRIPTA: "scripts/meri-preizkus3.mjs; rm -rf ." },
    { SHA: "abc" },
    { SHA: "A".repeat(40) },
    { MAX_USD: "-1" },
    { MAX_USD: "0" },
    { MAX_USD: "1e9" },
    { MAX_USD: "abc" },
    { ARGUMENTI: "$(id)" },
    { ARGUMENTI: "--out /etc/x" },
    { ARGUMENTI: "a;b" },
    { ARGUMENTI: "--max-usd 50" },
    { ARGUMENTI: "--meja-usd 50" },
  ]) assert.equal(preveri(v).status, 1, JSON.stringify(v));
});

test("plačane meri-*.mjs upoštevajo --max-usd (sicer jih delovni tok zavrne)", () => {
  const vzorec = /arg\("(--)?max-usd"/; // isti vzorec kot korak »Skripta upošteva --max-usd«
  assert.ok(y.includes(`grep -Eq '${vzorec.source}'`));
  for (const s of ["meri-preizkus3.mjs", "meri-nacin-b.mjs", "meri-hitri-korak.mjs"]) {
    assert.match(fs.readFileSync(new URL(`../scripts/${s}`, import.meta.url), "utf8"), vzorec, s);
  }
});

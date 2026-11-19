// Delovni tok »Meritev« (.github/workflows/meri.yml): ročna plačana meritev scripts/meri-*.mjs v GitHub Actions.
// Brez klicev API: preveri varovalke v datoteki in zažene korak »Preveri vnose« z različnimi vnosi.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const y = fs.readFileSync(new URL("../.github/workflows/meri.yml", import.meta.url), "utf8");

test("meri.yml: le ročni zagon z main, samo branje, en zagon naenkrat, časovna meja", () => {
  assert.match(y, /^on:\n  workflow_dispatch:\n/m);
  assert.doesNotMatch(y, /^\s+(push|pull_request|pull_request_target|schedule|workflow_run):/m);
  assert.match(y, /^permissions:\n  contents: read\n/m);
  assert.match(y, /^    if: github\.ref == 'refs\/heads\/main'$/m);
  assert.match(y, /^concurrency:\n  group: \S+\n  cancel-in-progress: false$/m);
  assert.match(y, /^    timeout-minutes: 90$/m);
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
  // Korak se konča sam pred časovno mejo posla, ključ ne gre v izhod, povzetek ob vsakem izidu.
  assert.match(korak, /timeout 80m node /);
  assert.match(korak, /grep -qF "\$ANTHROPIC_API_KEY" meri\.log data\/meri-\*\.json/);
  assert.ok(korak.indexOf("grep -qF") < korak.indexOf("GITHUB_STEP_SUMMARY"), "pregled ključa pred povzetkom");
  assert.match(korak, /tail -n 40 meri\.log/);
  assert.match(korak, /^ +exit \$STATUS$/m);
  // Vsebina vsakega bloka run (zamaknjene vrstice za »run: |«) ne sme imeti izrazov ${{ }}.
  for (const m of y.matchAll(/^(\s+)run: \|\n((?:\1  .*\n|\s*\n)+)/gm)) assert.doesNotMatch(m[2], /\$\{\{/);
  for (const m of y.matchAll(/^\s+run: (?!\|)(.+)$/gm)) assert.doesNotMatch(m[1], /\$\{\{/);
});

test("meri.yml: SymPy preverjen pred meritvijo", () => {
  const i = y.indexOf("- name: SymPy nameščen");
  assert.ok(i > y.indexOf("npm ci") && i < y.indexOf("- name: Meritev\n"));
  assert.match(y, /PYTHONPATH=\.pylib python3 -c "import sympy/);
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
function preveri(vnosi, ghStanje = null) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "meri-yml-"));
  // Nadomestni gh: vrne stanje primerjave (REST compare) ali pade, kot pri neobstoječem commitu.
  fs.writeFileSync(path.join(dir, "gh"), ghStanje ? `#!/bin/sh\necho ${ghStanje}\n` : "#!/bin/sh\nexit 1\n", { mode: 0o755 });
  const out = path.join(dir, "out");
  fs.writeFileSync(out, "");
  const env = { PATH: `${dir}:${process.env.PATH}`, GITHUB_OUTPUT: out, MAIN_SHA: MAIN, REPO: "x/y", SKRIPTA: "scripts/meri-preizkus3.mjs", SHA: "", MAX_USD: "2", ARGUMENTI: "", ...vnosi };
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
  assert.equal(preveri({ SKRIPTA: "scripts/meri-nujno-ziv.mjs", MAX_USD: "0.5", ARGUMENTI: "--vzporedno 2" }).status, 0, "živi preizkus varnostnega filtra");
  assert.equal(preveri({ ARGUMENTI: "--suho" }).status, 0, "brezplačen preizkus");
});

test("meri.yml: sha mora biti v zgodovini main (REST compare)", () => {
  const B = "b".repeat(40);
  assert.deepEqual(preveri({ SHA: B }, "ahead"), { status: 0, izhod: { ref: B, max: "2" } });
  assert.equal(preveri({ SHA: B }, "identical").status, 0);
  assert.equal(preveri({ SHA: B }, "diverged").status, 1);
  assert.equal(preveri({ SHA: B }, "behind").status, 1);
  assert.equal(preveri({ SHA: B }).status, 1, "gh pade (commit ne obstaja)");
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

test("meri-preizkus3 --suho nikoli ne kliče API (0 $), tudi s ključem", () => {
  assert.match(fs.readFileSync(new URL("../scripts/meri-preizkus3.mjs", import.meta.url), "utf8"), /if \(SUHO\) process\.env\.EVKLID_MOCK = "1";/);
});

test("plačane meri-*.mjs upoštevajo --max-usd (sicer jih delovni tok zavrne)", () => {
  const vzorec = /arg\("(--)?max-usd"/; // isti vzorec kot korak »Skripta upošteva --max-usd«
  assert.ok(y.includes(`grep -Eq '${vzorec.source}'`));
  for (const s of ["meri-preizkus3.mjs", "meri-nacin-b.mjs", "meri-hitri-korak.mjs", "meri-natancnost-ss.mjs", "meri-napacne-korake.mjs", "meri-nujno-ziv.mjs", "meri-prav-matura.mjs"]) {
    assert.match(fs.readFileSync(new URL(`../scripts/${s}`, import.meta.url), "utf8"), vzorec, s);
  }
});

test("meri-natancnost-ss: meja in izbor se preverita pred klicem; privzeto samo odgovor s preverjanjem", () => {
  const src = fs.readFileSync(new URL("../scripts/meri-natancnost-ss.mjs", import.meta.url), "utf8");
  assert.match(src, /"--samo", ids\.join\(","\), "--ponovi", String\(PONOVI\), "--max-usd", String\(MEJA\)/); // mejo uveljavi primerjava-modelov.js
  assert.match(src, /if \(!OBA\) ukaz\.push\("--pogoj", "s"\);/);
  assert.match(src, /if \(SUHO\) ukaz\.push\("--dry"\);/); // --suho nikoli ne kliče modela
});

test("meri-natancnost-ss --suho: izbor brez klica; neveljavni argumenti končajo z 1", () => {
  const skripta = fileURLToPath(new URL("../scripts/meri-natancnost-ss.mjs", import.meta.url));
  const zagon = (...a) => spawnSync(process.execPath, ["--disable-warning=ExperimentalWarning", skripta, ...a], { encoding: "utf8", timeout: 60000, env: { ...process.env, EVKLID_MOCK: "1", ANTHROPIC_API_KEY: "" } });
  const suho = zagon("--suho", "--del", "1-2");
  assert.equal(suho.status, 0, suho.stderr);
  const n = Number(/primerov (\d+)/.exec(suho.stdout)?.[1]);
  assert.ok(n >= 5 && n <= 30, `primerov ${n}`);
  assert.match(suho.stdout, /suho \(brez klicev\)/);
  assert.doesNotMatch(suho.stdout, /IZID/); // suhi tek ne zapiše izida
  assert.equal(zagon("--del", "3-2").status, 1);
  assert.equal(zagon("--stopnje", "x").status, 1);
  assert.equal(zagon("--max-usd", "6").status, 1);
});

test("meri-natancnost-ss --primeri in --ponovi: izbrani primeri po številki, večkrat; neveljavno konča z 1", () => {
  const skripta = fileURLToPath(new URL("../scripts/meri-natancnost-ss.mjs", import.meta.url));
  const zagon = (...a) => spawnSync(process.execPath, ["--disable-warning=ExperimentalWarning", skripta, ...a], { encoding: "utf8", timeout: 60000, env: { ...process.env, EVKLID_MOCK: "1", ANTHROPIC_API_KEY: "" } });
  const vsi = zagon("--suho");
  const peti = /^ {2}5 {2}(\S+)$/m.exec(vsi.stdout)?.[1];
  const drugi = /^ {2}2 {2}(\S+)$/m.exec(vsi.stdout)?.[1];
  assert.ok(peti && drugi, vsi.stdout.slice(0, 400));
  const r = zagon("--suho", "--primeri", "5,2", "--ponovi", "3");
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /primeri 5,2, primerov 2 × 3 ponovitve/);
  assert.match(r.stdout, /2 primerov × 3 ponovitve × 1 pogoj/); // otrok (primerjava-modelov.js) dobi iste primere in ponovitve
  assert.ok(r.stdout.includes(`  5  ${peti}`) && r.stdout.includes(`  2  ${drugi}`));
  assert.ok(r.stdout.indexOf(`  5  ${peti}`) < r.stdout.indexOf(`  2  ${drugi}`)); // vrstni red kot v --primeri
  assert.match(zagon("--suho", "--primeri", "5,2", "--ponovi", "2", "--oba").stdout, /× 2 pogoja/);
  // Tipkarska napaka ali oblika z = ne sme tiho pognati vseh primerov; --ponovi brez --primeri bi presegel mejo.
  for (const slabo of [["--primeri", "0"], ["--primeri", "5,5"], ["--primeri", "999"], ["--primeri", "05"], ["--primeri"], ["--primeri", "5", "--del", "1-2"], ["--primeri", "5", "--ponovi", "6"], ["--primeri", "5", "--ponovi", "0"], ["--ponovi", "3"], ["--primeri=5,2"], ["--primer", "5"]])
    assert.equal(zagon("--suho", ...slabo).status, 1, slabo.join(" "));
});

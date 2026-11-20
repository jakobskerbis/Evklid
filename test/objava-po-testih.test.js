// Objava samo po zelenih testih (j, 20. 11. 2026): Render (scripts/render-objava.js) in posodobitev telefonov
// (.github/workflows/ota.yml) dobita samo commit, za katerega so uspeli vsi posli testi.yml.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { decide, stanjeTestov, POTREBNI_TESTI, TESTI_WORKFLOW } from "../scripts/render-objava.js";

const root = path.join(path.dirname(new URL(import.meta.url).pathname), "..");
const beri = (rel) => fs.readFileSync(path.join(root, rel), "utf8");
const sha = "abcdef1234567890";
const miren = { razlicica: "111111111111", aktivni: 0, mirujeMs: null, gorMs: 5 * 3600000 };
const noc = Date.parse("2026-11-20T03:30:00+01:00");
const opoldne = Date.parse("2026-11-20T12:00:00+01:00");
const zeleno = { stanje: "uspeh", zakaj: "vsi testi zeleni" };
const padlo = { stanje: "napaka", zakaj: "testi: failure" };
const tece = { stanje: "caka", zakaj: "še tečejo: testi" };
const run = (status, conclusion = null) => ({ id: 7, status, conclusion });
const job = (name, status, conclusion = null, id = 1) => ({ id, name, status, conclusion });

test("Render: brez zelenih testov ni objave, tudi [nujno], ročni zagon in miren strežnik ponoči ne", () => {
  for (const testi of [padlo, tece, null, undefined]) {
    for (const o of [{ now: noc }, { now: opoldne, nujno: true }, { now: opoldne, rocno: true }, { now: noc, takoj: true }, { now: noc, stanje: null, cakaMin: 600 }]) {
      const d = decide({ stanje: miren, mainSha: sha, cakaMin: 600, testi, ...o });
      assert.equal(d.objavi, false, JSON.stringify({ testi, o }));
      assert.equal(d.testi, testi?.stanje === "napaka" ? "napaka" : "caka");
    }
  }
  assert.match(decide({ stanje: miren, mainSha: sha, cakaMin: 1, testi: padlo, nujno: true, now: opoldne }).zakaj, /testi .*niso uspeli.*testi: failure/);
  assert.match(decide({ stanje: miren, mainSha: sha, cakaMin: 1, testi: tece, nujno: true, now: opoldne }).zakaj, /čakam na zelene teste/);
  // brezTestov velja samo z ročnim zagonom.
  assert.equal(decide({ stanje: miren, mainSha: sha, cakaMin: 600, testi: padlo, brezTestov: true, nujno: true, now: opoldne }).objavi, false);
  assert.equal(decide({ stanje: miren, mainSha: sha, cakaMin: 1, testi: padlo, rocno: true, brezTestov: true, now: opoldne }).objavi, true);
});

test("Render: z zelenimi testi objavi kot prej ([nujno] takoj, sicer v nočnem oknu)", () => {
  assert.equal(decide({ stanje: miren, mainSha: sha, cakaMin: 1, testi: zeleno, nujno: true, now: opoldne }).objavi, true);
  assert.equal(decide({ stanje: miren, mainSha: sha, cakaMin: 1, testi: zeleno, rocno: true, now: opoldne }).objavi, true);
  assert.equal(decide({ stanje: miren, mainSha: sha, cakaMin: 5, testi: zeleno, now: noc }).objavi, true);
  assert.equal(decide({ stanje: miren, mainSha: sha, cakaMin: 600, testi: zeleno, now: opoldne }).objavi, false, "podnevi brez [nujno] čaka na noč");
  assert.equal(decide({ stanje: { ...miren, razlicica: sha.slice(0, 12) }, mainSha: sha, cakaMin: 1, testi: padlo }).zakaj, "že teče zadnja različica");
});

test("Render: stanje testov iz zagona testi.yml in njegovih poslov", () => {
  const vsi = (status, conclusion) => POTREBNI_TESTI.map((n, i) => job(n, status, conclusion, i + 1));
  assert.equal(stanjeTestov(null, []).stanje, "caka");
  assert.equal(stanjeTestov(run("queued"), []).stanje, "caka");
  assert.equal(stanjeTestov(run("in_progress"), vsi("in_progress")).stanje, "caka");
  assert.deepEqual(stanjeTestov(run("completed", "success"), vsi("completed", "success")).stanje, "uspeh");
  // En padel posel = napaka, tudi če drugi še tečejo.
  const mesano = [job("testi", "in_progress"), job("preveri", "completed", "failure"), job("hrosci", "completed", "success"), job("tipi", "queued")];
  assert.deepEqual(stanjeTestov(run("in_progress"), mesano), { stanje: "napaka", zakaj: "preveri: failure" });
  for (const c of ["failure", "cancelled", "timed_out", "skipped", "neutral"]) assert.equal(stanjeTestov(run("completed", c), vsi("completed", c)).stanje, "napaka", c);
  // Manjka posel (npr. tipi) v končanem zagonu = napaka; v tekočem = čaka.
  const brezTipov = vsi("completed", "success").filter((j) => j.name !== "tipi");
  assert.equal(stanjeTestov(run("completed", "success"), brezTipov).stanje, "napaka");
  assert.equal(stanjeTestov(run("in_progress"), brezTipov).stanje, "caka");
  // Ponovljen posel: šteje zadnji (večji id).
  const ponovljen = [...vsi("completed", "success"), job("testi", "completed", "failure", 0)];
  assert.equal(stanjeTestov(run("completed", "success"), ponovljen).stanje, "uspeh");
});

test("testi.yml ima vse posle, ki jih zahteva objava, tudi preverjanje tipov mobilne aplikacije", () => {
  const wf = beri(`.github/workflows/${TESTI_WORKFLOW}`);
  assert.match(wf, /^name: Testi$/m, "ota.yml in render-posodobitev.yml ga iščeta po imenu");
  assert.match(wf, /^  push:\n    branches: \[main\]/m);
  const posli = [...wf.split(/^jobs:$/m)[1].matchAll(/^  ([a-z_-]+):\s*$/gm)].map((m) => m[1]);
  assert.deepEqual([...posli].sort(), [...POTREBNI_TESTI].sort());
  const tipi = wf.split(/^  tipi:$/m)[1];
  assert.match(tipi, /npm ci --prefix mobile [^\n]*--ignore-scripts/);
  assert.match(tipi, /cache-dependency-path: mobile\/package-lock\.json/);
  assert.match(tipi, /run: npm --prefix mobile run typecheck/);
  assert.equal(JSON.parse(beri("mobile/package.json")).scripts.typecheck, "tsc --noEmit");
});

test("Render: tek se zažene tudi ob koncu Testov za main in bere stanje testov", () => {
  const wf = beri(".github/workflows/render-posodobitev.yml");
  assert.match(wf, /workflow_run:\n\s+workflows: \[Testi\]\n\s+types: \[completed\]\n\s+branches: \[main\]/);
  assert.match(wf, /actions: read/);
  assert.match(wf, /brez_testov:[\s\S]*?default: false/);
  assert.match(wf, /BREZ_TESTOV: \$\{\{ github\.event_name == 'workflow_dispatch' && inputs\.brez_testov/);
  // concurrency na poslu: preskočen posel (konec Testov za PR) ne prekine čakajočega teka.
  assert.doesNotMatch(wf, /^concurrency:/m);
  assert.match(wf, /if: github\.event_name != 'workflow_run' \|\| github\.event\.workflow_run\.event == 'push'/);
});

test("Telefoni: posodobitev (EAS Update) samo po uspešnih Testih za push v main", () => {
  const wf = beri(".github/workflows/ota.yml");
  const on = wf.split(/^on:$/m)[1].split(/^\S/m)[0];
  assert.match(on, /^\n  workflow_run:\n    workflows: \[Testi\]\n    types: \[completed\]\n    branches: \[main\]\n$/);
  for (const k of ["github.event.workflow_run.conclusion == 'success'", "github.event.workflow_run.event == 'push'", "github.event.workflow_run.head_branch == 'main'", "github.event.workflow_run.head_repository.full_name == github.repository"]) assert.ok(wf.includes(k), k);
  assert.match(wf, /ref: \$\{\{ github\.event\.workflow_run\.head_sha \}\}/);
  // concurrency na poslu: preskočen tek (PR iz forka z vejo main) ne nadomesti čakajočega pravega teka.
  assert.doesNotMatch(wf, /^concurrency:/m);
  assert.match(wf, /^    concurrency:\n      group: ota\n      cancel-in-progress: false$/m);
  // Isti ukaz kot prej v EAS Workflow: kanal direct, Android, okolje preview, EXPO_PUBLIC_CHANNEL=direct (prstni odtis).
  assert.match(wf, /eas-cli@latest update --channel direct --platform android --environment preview --non-interactive/);
  assert.match(wf, /EXPO_PUBLIC_CHANNEL: direct/);
  assert.match(wf, /EXPO_TOKEN: \$\{\{ secrets\.EXPO_TOKEN \}\}/);
  // Sporočilo commita in drugi podatki dogodka gredo v ukaze samo prek env, nikoli kot ${{ }} v run.
  const ukazi = wf.split("\n").reduce((a, l) => {
    const m = l.match(/^(\s*)(?:- )?run: ?(.*)$/);
    if (m) a.push({ zamik: m[1].length, besedilo: [m[2]] });
    else if (a.length && a.at(-1).odprt !== false && (l.trim() === "" || l.search(/\S/) > a.at(-1).zamik)) a.at(-1).besedilo.push(l);
    else if (a.length) a.at(-1).odprt = false;
    return a;
  }, []);
  assert.ok(ukazi.length >= 3);
  for (const u of ukazi) assert.ok(!u.besedilo.join("\n").includes("${{"), u.besedilo[0]);
  // Nobena druga pot ne objavlja posodobitev brez testov (prej mobile/.eas/workflows/posodobitev.yml ob pushu).
  const eas = path.join(root, "mobile/.eas/workflows");
  for (const f of fs.existsSync(eas) ? fs.readdirSync(eas) : []) assert.doesNotMatch(fs.readFileSync(path.join(eas, f), "utf8"), /^\s*(push|pull_request|schedule):/m, f);
  for (const f of fs.readdirSync(path.join(root, ".github/workflows")).filter((f) => f !== "ota.yml")) assert.doesNotMatch(beri(`.github/workflows/${f}`), /eas-cli[^\n]* update /, f);
});

test("Telefoni: seznam POTI v ota.yml pokrije vse datoteke izven mobile/, ki jih aplikacija uvozi", () => {
  const blok = beri(".github/workflows/ota.yml").match(/POTI: >-\n((?: {8}\S+\n)+)/);
  assert.ok(blok, "POTI v ota.yml");
  const poti = blok[1].trim().split(/\s+/);
  const pokrito = (rel) => poti.some((p) => rel === p || rel.startsWith(`${p}/`));
  const re = /(?:from\s*|import\s*\(\s*|require\s*\(\s*|import\s+)["'](\.{1,2}\/[^"']+)["']/g;
  const videno = new Set(), zunaj = new Set();
  const obisci = (f) => {
    if (videno.has(f) || !/\.(m?[jt]sx?)$/.test(f) || !fs.existsSync(f)) return;
    videno.add(f);
    for (const m of fs.readFileSync(f, "utf8").matchAll(re)) {
      let p = path.resolve(path.dirname(f), m[1]);
      p = [p, `${p}.js`, `${p}.ts`, `${p}.tsx`, `${p}/index.js`].find((c) => fs.existsSync(c) && fs.statSync(c).isFile()) || p;
      const rel = path.relative(root, p).split(path.sep).join("/");
      if (!rel.startsWith("mobile/")) zunaj.add(rel);
      obisci(p);
    }
  };
  const vse = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.name === "node_modules" || e.name.startsWith(".") ? [] : e.isDirectory() ? vse(path.join(d, e.name)) : [path.join(d, e.name)]));
  vse(path.join(root, "mobile")).forEach(obisci);
  assert.ok(zunaj.has("public/enote-izbira.js") && zunaj.has("brand.json"), "iskanje uvozov deluje");
  assert.ok(poti.includes("mobile"));
  assert.deepEqual([...zunaj].filter((f) => !pokrito(f)), [], "dodaj v POTI v ota.yml");
});

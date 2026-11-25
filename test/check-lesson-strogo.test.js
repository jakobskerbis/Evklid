// scripts/check-lesson.js --strogo (CI, posel »lekcije« v .github/workflows/testi.yml): preverjevalnik SymPy, ki ga ni
// ali se med tekom ustavi, ni tiho opozorilo »RACUN ni preverjen«, ampak izhodna koda 2. Brez --strogo ostane opozorilo.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parseClaims } from "../server/racun.js";
import { casAvailable, casStop } from "../server/cas.js";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const LESSONS = path.join(ROOT, "content", "lessons");

// Prva lekcija z vsaj 6 trditvami za SymPy (ne kemijske enačbe ali molske mase, te preveri koda brez SymPy).
function lekcija() {
  for (const d of fs.readdirSync(LESSONS).sort()) {
    const dir = path.join(LESSONS, d);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const f of fs.readdirSync(dir).sort()) {
      if (!f.endsWith(".md")) continue;
      const claims = parseClaims(fs.readFileSync(path.join(dir, f), "utf8"), Infinity).filter((c) => c.op !== "chem" && c.op !== "molar");
      if (claims.length >= 6) return path.join(dir, f);
    }
  }
  return null;
}
const FILE = lekcija();
const run = (args, env) =>
  spawnSync(process.execPath, ["scripts/check-lesson.js", "-q", ...args, FILE], { cwd: ROOT, env: { ...process.env, CI: "false", ...env }, encoding: "utf8", timeout: 120_000 });

test("check-lesson: brez SymPy --strogo in CI=true končata s kodo 2, brez njiju ostane opozorilo", { skip: !FILE && "ni lekcije s trditvami" }, () => {
  const brez = { EVKLID_CAS: "0" };
  const s = run(["--strogo"], brez);
  assert.equal(s.status, 2, s.stdout + s.stderr);
  assert.match(s.stdout, /preverjevalnik računov \(SymPy.*ni na voljo \(--strogo\)/);
  assert.equal(run([], { ...brez, CI: "true" }).status, 2);
  const mehko = run([], brez);
  assert.notEqual(mehko.status, 2, mehko.stdout);
  assert.doesNotMatch(mehko.stdout, /NAPAKA: preverjevalnik/);
});

test("check-lesson --strogo: preverjevalnik, ki se ustavi sredi teka, je napaka (koda 2)", async (t) => {
  if (!FILE) return t.skip("ni lekcije s trditvami");
  const ok = await casAvailable();
  casStop();
  if (!ok) return t.skip("SymPy ni nameščen");
  // Namesto pythona: ovoj, ki zažene pravi python3 s server/cas/worker.py in ga ob 4. zahtevi ubije (kot sesut proces).
  // Naslednja trditev zažene nov ovoj, zato se ustavi vsaka 4. trditev.
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-cas-ovoj-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const ovoj = path.join(dir, "python-ovoj.cjs");
  fs.writeFileSync(
    ovoj,
    `#!${process.execPath}
const { spawn } = require("node:child_process");
const child = spawn(process.env.PRAVI_PYTHON || "python3", process.argv.slice(2), { stdio: ["pipe", "inherit", "inherit"] });
let n = 0, buf = "";
process.stdin.on("data", (d) => {
  buf += d;
  let i;
  while ((i = buf.indexOf("\\n")) >= 0) {
    const line = buf.slice(0, i + 1);
    buf = buf.slice(i + 1);
    if (++n === 4) { child.kill("SIGKILL"); process.exit(1); }
    child.stdin.write(line);
  }
});
process.stdin.on("end", () => child.stdin.end());
child.on("exit", (c) => process.exit(c ?? 1));
`,
    { mode: 0o755 },
  );
  const env = { EVKLID_PYTHON: ovoj, PRAVI_PYTHON: process.env.EVKLID_PYTHON || "python3" };
  const s = run(["--strogo"], env);
  assert.equal(s.status, 2, s.stdout + s.stderr);
  assert.match(s.stdout, /za \d+ trditev \(med preverjanjem se je ustavil\)/);
  // Brez --strogo: le opozorilo »RACUN ni preverjen … preverjevalnik se je ustavil«, kot prej.
  const mehko = run([], env);
  assert.notEqual(mehko.status, 2, mehko.stdout);
  assert.match(mehko.stdout, /RACUN ni preverjen: .* – preverjevalnik se je ustavil/);
});

#!/usr/bin/env node
// Namesti SymPy za preverjanje s kodo (server/cas.js) v mapo .pylib. Teče sam ob `npm install` / `npm ci`
// (postinstall), tudi na Renderju. Nikoli ne prekine namestitve: brez Pythona ali omrežja aplikacija dela
// naprej s preverjanjem, ki ga je imela prej, in v dnevnik zapiše, da SymPy ni na voljo.
// Preskoči: EVKLID_CAS=0 ali EVKLID_SKIP_SYMPY=1.
const { spawnSync } = require("node:child_process");
const { existsSync } = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const TARGET = path.join(ROOT, ".pylib");
const VERSION = "1.14.0";
const log = (m) => console.log(`[evklid] SymPy: ${m}`);

function main() {
  if (process.env.EVKLID_CAS === "0" || process.env.EVKLID_SKIP_SYMPY === "1") return log("preskočeno");
  const python = process.env.EVKLID_PYTHON || (process.platform === "win32" ? "python" : "python3");
  const has = (extra = {}) =>
    spawnSync(python, ["-c", "import sympy, sys; sys.stdout.write(sympy.__version__)"], { encoding: "utf8", timeout: 30_000, env: { ...process.env, ...extra } });
  const here = has({ PYTHONPATH: TARGET });
  if (here.status === 0) return log(`že nameščen (${here.stdout})`);
  if (here.error) return log("Pythona ni, preverjanje s SymPy bo izklopljeno");
  for (const pkg of [`sympy==${VERSION}`, "sympy"]) {
    const r = spawnSync(python, ["-m", "pip", "install", "--quiet", "--disable-pip-version-check", "--no-warn-script-location", "--target", TARGET, pkg], {
      encoding: "utf8",
      timeout: 240_000,
    });
    if (r.status === 0 && existsSync(TARGET)) {
      const ok = has({ PYTHONPATH: TARGET });
      if (ok.status === 0) return log(`nameščen (${ok.stdout})`);
    }
  }
  log("namestitev ni uspela, preverjanje s SymPy bo izklopljeno");
}

try {
  main();
} catch (e) {
  log(`napaka pri namestitvi (${e?.message || e}), preverjanje s SymPy bo izklopljeno`);
}

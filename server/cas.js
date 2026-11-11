// Most do pravega računalniškega algebrskega sistema (SymPy, server/cas/worker.py).
// En dolgoživ proces Python ob strežniku; zahteve gredo po vrsti (ena vrstica JSON), vsaka ima rok.
// Če Pythona ali SymPy ni (npr. lokalni zagon brez namestitve), vsak klic vrne { ok: null } in aplikacija
// dela naprej s preverjanjem, ki ga je imela že prej (lesson-math, solvecore, AI pregled). Izklop: EVKLID_CAS=0.
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const WORKER = join(HERE, "cas", "worker.py");
// SymPy, nameščen ob gradnji (render.yaml: pip install --target .pylib); sicer sistemski.
const PYLIB = join(ROOT, ".pylib");

export const casOn = () => process.env.EVKLID_CAS !== "0";
const TIMEOUT_MS = () => Number(process.env.EVKLID_CAS_TIMEOUT_MS) || 9000;

let proc = null;
let ready = null; // Promise<boolean>
let failedAt = 0; // po neuspelem zagonu nekaj časa ne poskušamo znova
let seq = 0;
const waiting = new Map(); // id → { resolve, timer }
let buf = "";

function start() {
  if (!casOn()) return Promise.resolve(false);
  if (ready) return ready;
  if (failedAt && Date.now() - failedAt < 60_000) return Promise.resolve(false);
  const python = process.env.EVKLID_PYTHON || "python3";
  ready = new Promise((resolve) => {
    let settled = false;
    const done = (v) => {
      if (settled) return;
      settled = true;
      if (!v) {
        failedAt = Date.now();
        ready = null;
      }
      resolve(v);
    };
    try {
      const env = { ...process.env, PYTHONDONTWRITEBYTECODE: "1", PYTHONIOENCODING: "utf-8" };
      if (existsSync(PYLIB)) env.PYTHONPATH = PYLIB + (env.PYTHONPATH ? `:${env.PYTHONPATH}` : "");
      proc = spawn(python, [WORKER], { env, stdio: ["pipe", "pipe", "pipe"] });
      // Proces ne zadrži strežnika (ali testa) pri izhodu.
      proc.unref();
      for (const s of [proc.stdin, proc.stdout, proc.stderr]) s?.unref?.();
    } catch {
      return done(false);
    }
    const p = proc;
    const boot = setTimeout(() => {
      p.kill("SIGKILL");
      done(false);
    }, 20_000);
    p.on("error", () => {
      clearTimeout(boot);
      done(false);
    });
    p.stderr.on("data", (d) => {
      const s = String(d).trim();
      if (s && !/ModuleNotFoundError|No module named/.test(s)) console.warn(`[evklid] cas: ${s.slice(0, 300)}`);
    });
    p.on("exit", () => {
      clearTimeout(boot);
      if (proc === p) proc = null;
      ready = null;
      for (const [, w] of waiting) {
        clearTimeout(w.timer);
        w.resolve({ ok: null, why: "preverjevalnik se je ustavil" });
      }
      waiting.clear();
      done(false);
    });
    p.stdout.setEncoding("utf8");
    p.stdout.on("data", (chunk) => {
      buf += chunk;
      let i;
      while ((i = buf.indexOf("\n")) >= 0) {
        const line = buf.slice(0, i);
        buf = buf.slice(i + 1);
        let msg;
        try {
          msg = JSON.parse(line);
        } catch {
          continue;
        }
        if (msg.ready) {
          clearTimeout(boot);
          done(true);
          continue;
        }
        const w = waiting.get(msg.id);
        if (w) {
          waiting.delete(msg.id);
          clearTimeout(w.timer);
          w.resolve({ ok: msg.ok, why: msg.why || "" });
        }
      }
    });
  });
  return ready;
}

/**
 * Ena trditev: op ∈ solve | equal | diff | int | limit | value | ineq | units, args = deli ločeni z »|«.
 * @returns {Promise<{ok: boolean|null, why: string}>} ok null = koda ne zna preveriti (ni napaka).
 */
export async function casCheck(op, args) {
  if (!(await start()) || !proc) return { ok: null, why: "preverjevalnik ni na voljo" };
  const id = ++seq;
  const p = proc;
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      waiting.delete(id);
      // Zataknjen proces (npr. ogromen izraz): ubijemo ga, naslednji klic zažene novega.
      p.kill("SIGKILL");
      resolve({ ok: null, why: "prepočasno" });
    }, TIMEOUT_MS());
    waiting.set(id, { resolve, timer });
    try {
      p.stdin.write(JSON.stringify({ id, op, args: args.map(String) }) + "\n");
    } catch {
      clearTimeout(timer);
      waiting.delete(id);
      resolve({ ok: null, why: "preverjevalnik ni na voljo" });
    }
  });
}

// Ali preverjevalnik dela (za /healthz in teste).
export async function casAvailable() {
  return !!(await start());
}

export function casStop() {
  if (proc) proc.kill();
  proc = null;
  ready = null;
}

// Skupno za scripts/zagon.js (računalnik) in scripts/telefon.js (telefon prek povezave):
// - strežnik teče kot podproces; če se ustavi, ga zaženemo znova,
// - vsakih 15 minut (EVKLID_POSODOBITEV_MINUTE) preverimo GitHub in po potrebi posodobimo,
//   strežnik pa znova zaženemo v mirnem trenutku (nihče ne čaka na odgovor).
// Navodila: docs/posodobitve.md
import "../server/env.js";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { update, rollback, installIfNeeded } from "./posodobitev.js";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
// Izhodna koda, s katero nadzorni program prosi scripts/zaganjalnik.js, naj ga zažene znova.
export const RESTART_CODE = 75;

// Izpis v okno in v dnevnik (data/dnevnik.txt).
export const logSay = (log) => (s = "") => {
  console.log(s);
  if (s) log?.write(`${new Date().toISOString().slice(11, 19)} [posodobitev] ${s}\n`);
};

export function openLog(root) {
  const file = path.join(root, "data", "dnevnik.txt"); // izpis strežnika, za iskanje napak
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const log = fs.createWriteStream(file, { flags: "a" });
  log.write(`\n=== zagon ${new Date().toISOString()} ===\n`);
  return log;
}

export async function serverStatus(port) {
  try {
    const r = await fetch(`http://localhost:${port}`, { signal: AbortSignal.timeout(2000) });
    return r.status;
  } catch { return 0; }
}

async function waitUp(port, ms) {
  for (let t = 0; t < ms; t += 500) {
    if (await serverStatus(port)) return true;
    await wait(500);
  }
  return false;
}

// Zažene strežnik in ga drži prižganega. restart() vrne true, ko nova različica odgovarja.
export function superviseServer({ root, port, say = console.log, log = null }) {
  let child = null;
  let stopped = false;
  const run = () => {
    const c = spawn(process.execPath,
      ["--env-file-if-exists=.env", "--disable-warning=ExperimentalWarning", "server/index.js"],
      { cwd: root, stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, PORT: String(port) } });
    for (const stream of [c.stdout, c.stderr]) {
      stream.on("data", (d) => { process.stdout.write(d); log?.write(`${new Date().toISOString().slice(11, 19)} ${d}`); });
    }
    c.on("exit", async (code) => {
      if (child === c) child = null;
      if (stopped || c.planned) return;
      say(`Strežnik se je ustavil (koda ${code}). Znova ga zaganjam čez 3 sekunde ...`);
      await wait(3000);
      if (stopped || child) return;
      while (await serverStatus(port)) await wait(2000); // počakaj, da se vrata sprostijo
      if (!stopped && !child) run();
    });
    child = c;
  };
  const kill = () => new Promise((resolve) => {
    const c = child;
    if (!c) return resolve();
    c.planned = true;
    c.once("exit", () => resolve());
    c.kill();
    setTimeout(resolve, 10000);
  });
  return {
    async start() { run(); return waitUp(port, 30000); },
    async restart() {
      await kill();
      for (let i = 0; i < 20 && (await serverStatus(port)); i++) await wait(500);
      run();
      return waitUp(port, 60000);
    },
    stop() { stopped = true; if (child) { child.planned = true; child.kill(); } },
  };
}

// Mirni trenutek: nihče ne čaka na odgovor in v zadnji minuti in pol ni nihče nič poslal.
async function quiet(port) {
  try {
    const r = await fetch(`http://localhost:${port}/healthz/stanje`, { signal: AbortSignal.timeout(3000) });
    const s = await r.json();
    return !s.aktivni && (s.mirujeMs == null || s.mirujeMs >= 90000);
  } catch { return true; } // stara različica brez /healthz/stanje
}
async function waitQuiet(port, say) {
  for (let i = 0; i < 40; i++) { // največ 20 minut, potem vseeno
    if (await quiet(port)) return;
    if (i === 0) say("Nova različica je pripravljena; ponovni zagon počaka, da učenec dobi odgovor ...");
    await wait(30000);
  }
}

// Vsakih 15 minut (EVKLID_POSODOBITEV_MINUTE ali EVKLID_POSODOBITEV_URE) preveri in posodobi. Datoteka data/posodobi-zdaj (posodobi-windows.bat)
// sproži posodobitev takoj. restartSelf: ko se spremeni sam nadzorni program.
export function autoUpdate({ root, port, say = console.log, server, restartSelf = null }) {
  // Preverjanje je en majhen klic GitHub API; prenos in ponovni zagon samo, ko je v main kaj novega.
  const env = process.env;
  const hours = env.EVKLID_POSODOBITEV_MINUTE ? Number(env.EVKLID_POSODOBITEV_MINUTE) / 60
    : env.EVKLID_POSODOBITEV_URE ? Number(env.EVKLID_POSODOBITEV_URE) : 0.25;
  if (env.EVKLID_POSODOBITEV === "0" || !(hours > 0)) {
    say("Samodejne posodobitve so izklopljene (EVKLID_POSODOBITEV v .env).");
    return () => {};
  }
  const now = path.join(root, "data", "posodobi-zdaj");
  let next = Date.now() + hours * 3600e3;
  let busy = false;
  const tick = async () => {
    if (busy) return;
    const urgent = fs.existsSync(now);
    if (!urgent && Date.now() < next) return; // tudi po spanju računalnika: čas preverjamo sproti
    busy = true;
    fs.rmSync(now, { force: true });
    next = Date.now() + hours * 3600e3;
    try {
      const r = await update({ root, say });
      if (!r.changed || r.installed === false || !r.restart) return;
      if (!urgent) await waitQuiet(port, say);
      if (r.selfRestart && restartSelf) {
        say("Posodobljen je tudi zagonski program, zaganjam ga znova ...");
        return restartSelf();
      }
      say("Zaganjam novo različico ...");
      if (await server.restart()) return say("Nova različica teče.");
      if (rollback(root, say)) {
        installIfNeeded(root, say);
        await server.restart();
      }
    } catch (e) {
      say(`Posodobitev: ${e.message}`);
    } finally {
      busy = false;
    }
  };
  const timer = setInterval(tick, 20000);
  return () => clearInterval(timer);
}

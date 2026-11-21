// Zaustavitev in ponovni zagon pravega strežnika (server/index.js): oznaka teka (nepričakovan zagon v
// /healthz/stanje in /healthz/alarm).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";

function zazeni(dir, extra = {}) {
  const port = 39000 + Math.floor(Math.random() * 900);
  const env = { ...process.env, PORT: String(port), EVKLID_MOCK: "1", EVKLID_NEWS: "0", EVKLID_PDF: "0", EVKLID_DB: path.join(dir, "t.db"), EVKLID_PASSWORD: "", EVKLID_ACCOUNTS: "0", ANTHROPIC_API_KEY: "", EVKLID_BACKUPS: "0", EVKLID_CAS: "0", ...extra };
  for (const k of ["EVKLID_DATA_KEY", "NODE_ENV", "EVKLID_BASE_URL", "RENDER", "EVKLID_ADMIN_EMAILS", "RESEND_API_KEY"]) delete env[k];
  // Brez SymPy (EVKLID_CAS=0) in brez cevi za stdout: podproces ubitega strežnika bi sicer držal cev odprto.
  const srv = spawn(process.execPath, ["--disable-warning=ExperimentalWarning", "server/index.js"], { env, stdio: ["ignore", "ignore", "pipe"] });
  let izpis = "";
  srv.stderr.on("data", (d) => (izpis += d));
  const konec = new Promise((resolve) => srv.on("exit", (code, signal) => resolve({ code, signal, izpis })));
  const base = `http://127.0.0.1:${port}`;
  const pripravljen = (async () => {
    for (let i = 0; i < 150; i++) {
      try {
        return await (await fetch(`${base}/healthz/stanje`)).json();
      } catch {
        await new Promise((r) => setTimeout(r, 100));
      }
    }
    throw new Error(`strežnik se ni zagnal: ${izpis}`);
  })();
  return { srv, base, konec, pripravljen };
}

test("zagon: čista zaustavitev (SIGTERM) ni štet, ubit proces (SIGKILL) je nepričakovan zagon v stanju in alarmu", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-zagon-"));
  const oznaka = path.join(dir, "zagon.json");
  try {
    let s = zazeni(dir);
    assert.deepEqual((await s.pripravljen).zagoni, { nepricakovani: 0, zadnji: null, razlog: null });
    assert.ok(fs.existsSync(oznaka), "oznaka teka med delovanjem");
    s.srv.kill("SIGTERM");
    assert.equal((await s.konec).code, 0);
    assert.ok(!fs.existsSync(oznaka), "čista zaustavitev pobriše oznako");

    s = zazeni(dir);
    assert.equal((await s.pripravljen).zagoni.nepricakovani, 0);
    s.srv.kill("SIGKILL"); // kot Render ob premalo pomnilnika
    await s.konec;

    s = zazeni(dir);
    const st = await s.pripravljen;
    assert.equal(st.zagoni.nepricakovani, 1);
    assert.equal(st.zagoni.razlog, "neznan");
    const alarm = await fetch(`${s.base}/healthz/alarm`);
    assert.equal(alarm.status, 503);
    assert.match(await alarm.text(), /^alarm: .*\bzagon\b/); // na polnem disku lahko še »disk«
    s.srv.kill("SIGTERM");
    assert.equal((await s.konec).code, 0);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});


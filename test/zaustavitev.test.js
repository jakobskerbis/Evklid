// Zaustavitev in ponovni zagon pravega strežnika (server/index.js): oznaka teka (nepričakovan zagon v
// /healthz/stanje in /healthz/alarm) ter odgovor v teku ob SIGTERM (obvestilo o posodobitvi, vprašanje ne šteje).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { DatabaseSync } from "node:sqlite";

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

test("SIGTERM sredi odgovora: po roku zaustavitve učenec dobi obvestilo o posodobitvi, vprašanje ne šteje in ne ostane v pogovoru", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-zaustavitev-"));
  try {
    // Počasen preizkusni odgovor (300 ms na kos) in kratek rok zaustavitve, da odgovor ob roku še teče.
    const s = zazeni(dir, { EVKLID_MOCK_DELAY_MS: "300", EVKLID_ZAUSTAVITEV_MS: "600" });
    await s.pripravljen;
    const post = async (p, body) => (await fetch(s.base + p, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })).json();
    const ucenec = await post("/api/students", { name: "Ana", settings: { educational_track: "OSNOVNA_SOLA", curriculum_level: "8. razred", subject: "MAT" } });
    const pogovor = await post(`/api/students/${ucenec.id}/conversations`, {});
    const r = await fetch(`${s.base}/api/conversations/${pogovor.id}/messages`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: "Kaj je ulomek?" }) });
    assert.equal(r.status, 200);
    const bralec = r.body.getReader();
    let tok = "";
    const dec = new TextDecoder();
    // Počakamo na prvi kos odgovora, nato objava (SIGTERM).
    while (!/event: delta/.test(tok)) tok += dec.decode((await bralec.read()).value);
    const t0 = Date.now();
    s.srv.kill("SIGTERM");
    for (let c = await bralec.read(); !c.done; c = await bralec.read()) tok += dec.decode(c.value);
    const izhod = await s.konec;
    assert.equal(izhod.code, 0);
    assert.ok(Date.now() - t0 < 5000, "zaustavitev ne čaka do konca odgovora");
    assert.doesNotMatch(tok, /event: done/);
    const napaka = tok.split("\n\n").find((d) => d.startsWith("event: error"));
    assert.ok(napaka, tok);
    const data = JSON.parse(napaka.split("data: ")[1]);
    assert.equal(data.posodobitev, true);
    assert.match(data.error, /posodablja/);
    // Baza po zaustavitvi: vprašanje ni šteto v dnevno mejo, neodgovorjeno sporočilo ni ostalo v pogovoru.
    const db = new DatabaseSync(path.join(dir, "t.db"), { readOnly: true });
    assert.equal(db.prepare("SELECT COALESCE(SUM(n), 0) AS n FROM question_log WHERE student_id = ?").get(ucenec.id).n, 0);
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM messages WHERE conversation_id = ?").get(pogovor.id).n, 0);
    db.close();
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("zaustaviOdgovore: odgovor v teku in novo vprašanje med zaustavljanjem dobita obvestilo, nobeno ne šteje", async () => {
  const { openDb } = await import("../server/db.js");
  const { createApp, POSODOBITEV_TEXT } = await import("../server/app.js");
  const store = openDb(":memory:");
  let zacel;
  const zacetek = new Promise((r) => (zacel = r));
  // Odgovor, ki teče, dokler ga ne prekinemo (kot pravi tok: ob prekinitvi napaka z že porabljenimi žetoni).
  const streamFn = ({ onText, signal }) =>
    new Promise((_res, rej) => {
      onText("Ulomek je ");
      zacel();
      signal.addEventListener("abort", () => rej(Object.assign(new Error("Request was aborted."), { name: "AbortError", usage: { input_tokens: 50, output_tokens: 5 }, model: "claude-haiku-5-5" })));
    });
  const app = createApp(store, { streamFn, scheduler: false });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = async (p, body) => fetch(base + p, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  try {
    const ucenec = await (await post("/api/students", { name: "Ana", settings: { subject: "MAT" } })).json();
    const c1 = await (await post(`/api/students/${ucenec.id}/conversations`, {})).json();
    const c2 = await (await post(`/api/students/${ucenec.id}/conversations`, {})).json();
    const r1 = post(`/api/conversations/${c1.id}/messages`, { text: "Kaj je ulomek?" }).then((r) => r.text());
    await zacetek;
    assert.equal(app.locals.odgovoriVTeku(), 1);
    assert.equal(app.locals.zaustaviOdgovore({ samoVrsta: true }), 1, "odgovor z modelom ne čaka v vrsti: ostane do roka");
    // Novo vprašanje med zaustavljanjem: takoj obvestilo, brez klica modela.
    const t2 = await (await post(`/api/conversations/${c2.id}/messages`, { text: "Kaj je ulomek?" })).text();
    assert.match(t2, /event: error\ndata: .*"posodobitev":true/);
    app.locals.zaustaviOdgovore(); // rok zaustavitve je potekel
    const t1 = await r1;
    assert.doesNotMatch(t1, /event: done/);
    const err = JSON.parse(t1.split("event: error\ndata: ")[1].split("\n")[0]);
    assert.equal(err.error, POSODOBITEV_TEXT);
    assert.equal(err.posodobitev, true);
    assert.equal(app.locals.odgovoriVTeku(), 0);
    assert.equal(store.db.prepare("SELECT COALESCE(SUM(n), 0) AS n FROM question_log").get().n, 0, "vprašanji ne štejeta v dnevno mejo");
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM messages").get().n, 0, "neodgovorjeni sporočili nista ostali");
    // Žetoni, ki jih je model že porabil, so zapisani (strošek ostane resničen), samo vprašanje ne šteje.
    assert.equal(store.db.prepare("SELECT SUM(input_tokens) AS n FROM usage WHERE kind = 'prekinjeno'").get().n, 50);
  } finally {
    server.close();
  }
});

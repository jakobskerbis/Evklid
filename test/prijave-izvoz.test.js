import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { DatabaseSync } from "node:sqlite";
import { openDb, migrateReportPr } from "../server/db.js";
import { createApp } from "../server/app.js";
import { ensureReportsTable, scrubText } from "../server/reports.js";

// Izvoz prijav za dnevni samodejni pregled (server/reports.js, docs/prijave-pregled.md): samo s ključem
// EVKLID_EXPORT_TOKEN, brez podatkov, ki bi razkrili učenca, in sprememba stanja (in_review + PR, fixed, open).
const TOKEN = "t".repeat(40);
const REPLY = 'Ana Kos, 7 krat 8 je 54.\n<<META subject=MAT topic="poštevanka" error=0 mode=A flag=none done=0>>';
const LESSON = "MAT-OS-8/pitagorov-izrek";

async function withServer(fn) {
  const prev = process.env.EVKLID_EXPORT_TOKEN;
  process.env.EVKLID_EXPORT_TOKEN = TOKEN;
  const store = openDb(":memory:");
  const streamFn = async ({ onText }) => {
    onText(REPLY);
    return { content: [{ type: "text", text: REPLY }], text: REPLY, stopReason: "end_turn" };
  };
  const server = createApp(store, { streamFn }).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (p, o = {}) => {
    const headers = { "Content-Type": "application/json", ...(o.auth ? { Authorization: o.auth } : {}), ...(o.remote ? { "X-Forwarded-For": "203.0.113.5" } : {}) };
    const res = await fetch(base + p, { method: o.method || "GET", headers, body: o.body !== undefined ? JSON.stringify(o.body) : undefined });
    const type = res.headers.get("content-type") || "";
    return { status: res.status, cache: res.headers.get("cache-control"), body: type.includes("json") ? await res.json() : await res.text() };
  };
  try {
    await fn({ call, store });
  } finally {
    server.close();
    if (prev === undefined) delete process.env.EVKLID_EXPORT_TOKEN;
    else process.env.EVKLID_EXPORT_TOKEN = prev;
  }
}

const KEY = `Bearer ${TOKEN}`;

async function seed(call, store) {
  const s = (await call("/api/students", { method: "POST", body: { name: "Ana Kos" } })).body;
  store.db.exec("CREATE TABLE IF NOT EXISTS league_profiles (student_id INTEGER PRIMARY KEY, nickname TEXT NOT NULL, tier INTEGER NOT NULL DEFAULT 0, created_at TEXT)");
  store.db.prepare("INSERT OR REPLACE INTO league_profiles (student_id, nickname) VALUES (?, ?)").run(s.id, "Zmajcek77");
  const c = (await call(`/api/students/${s.id}/conversations`, { method: "POST" })).body;
  await call(`/api/conversations/${c.id}/messages`, { method: "POST", body: { text: "Jaz sem Ana, koliko je 7 krat 8? piši na ana.kos@primer.si" } });
  const mid = (await call(`/api/conversations/${c.id}`)).body.messages.find((m) => m.role === "assistant").id;
  const m = await call(`/api/conversations/${c.id}/messages/${mid}/report`, { method: "POST", body: { reason: "wrong", note: "Zmajcek77 pravi: 56, ne 54", shown: "<p>Ana Kos</p>", device: "web-phone", screen: "390x844" } });
  assert.equal(m.status, 201);
  const l = await call(`/api/students/${s.id}/lesson-report`, { method: "POST", body: { topic: LESSON, reason: "unclear", note: "Kos ne razume, pišite mi@x.com", step: 2, device: "phone" } });
  assert.equal(l.status, 201);
  const a = await call(`/api/students/${s.id}/bug`, { method: "POST", body: { note: "Formula se ne izriše", conversation_id: c.id, view: "chat" } });
  assert.equal(a.status, 201);
  return { s, c, mid, lessonId: l.body.id, appId: a.body.id };
}

test("izvoz prijav: brez ključa ali z napačnim 404, tudi lokalno; vedno no-store", async () => {
  await withServer(async ({ call, store }) => {
    await seed(call, store);
    for (const auth of [undefined, "Bearer " + "x".repeat(40), `Bearer ${TOKEN}x`, TOKEN, ""]) {
      const r = await call("/api/prijave/izvoz", { auth });
      assert.equal(r.status, 404, String(auth));
      assert.equal(r.cache, "no-store");
      assert.ok(!JSON.stringify(r.body).includes("Ana"));
    }
    assert.equal((await call(`/api/prijave/izvoz?token=${TOKEN}`)).status, 404, "ključ samo v glavi");
    const ok = await call("/api/prijave/izvoz", { auth: KEY, remote: true });
    assert.equal(ok.status, 200);
    assert.equal(ok.cache, "no-store");
    // Prekratek ključ v okolju ne velja.
    process.env.EVKLID_EXPORT_TOKEN = "kratek";
    assert.equal((await call("/api/prijave/izvoz", { auth: "Bearer kratek" })).status, 404);
    process.env.EVKLID_EXPORT_TOKEN = TOKEN;
  });
});

test("izvoz prijav: brez id-jev učenca in pogovora, imen, vzdevkov, e-naslovov, naprave in posnetka", async () => {
  await withServer(async ({ call, store }) => {
    await seed(call, store);
    const out = (await call("/api/prijave/izvoz", { auth: KEY })).body;
    assert.equal(out.prijave.length, 3);
    const json = JSON.stringify(out);
    for (const bad of ["student_id", "conversation_id", "message_id", "device", "shown", "raw", "context", "code", "Ana", "Kos", "Zmajcek77", "@primer.si", "mi@x.com", "web-phone", "Učenec:"]) {
      assert.ok(!json.includes(bad), `v izvozu je »${bad}«`);
    }
    for (const r of out.prijave) assert.deepEqual(Object.keys(r).sort(), ["besedilo", "cas", "id", "kind", "kontekst", "pr", "razlog", "stanje"]);
    const msg = out.prijave.find((r) => r.kind === "message");
    assert.equal(msg.besedilo, "[ime] pravi: 56, ne 54");
    assert.match(msg.kontekst.vprasanje, /7 krat 8/);
    assert.match(msg.kontekst.vprasanje, /\[e-naslov\]/);
    assert.match(msg.kontekst.odgovor, /54/);
    const les = out.prijave.find((r) => r.kind === "lesson");
    assert.deepEqual({ ...les.kontekst, ime_lekcije: !!les.kontekst.ime_lekcije }, { lekcija: LESSON, ime_lekcije: true, korak: 2 });
    assert.equal(les.besedilo, "[ime] ne razume, pišite [e-naslov]");
    const app = out.prijave.find((r) => r.kind === "app");
    assert.deepEqual(app.kontekst, { pogled: "chat" });
    assert.ok(out.prijave.every((r) => r.stanje === "open" && r.pr === null));
  });
});

test("stanje prijave: in_review s PR, fixed, open; napačne vrednosti 400, brez ključa 404", async () => {
  await withServer(async ({ call, store }) => {
    const { lessonId, appId } = await seed(call, store);
    const msgId = store.db.prepare("SELECT id FROM message_reports").get().id;
    const url = (k, id) => `/api/prijave/${k}/${id}/stanje`;
    const post = (k, id, body, auth = KEY) => call(url(k, id), { method: "POST", body, auth: auth || undefined });

    assert.equal((await post("lesson", lessonId, { stanje: "fixed" }, null)).status, 404);
    assert.equal((await post("lesson", lessonId, { stanje: "fixed" }, "Bearer " + "y".repeat(40))).status, 404);
    for (const body of [{}, { stanje: "done" }, { stanje: "in_review" }, { stanje: "in_review", pr: 0 }, { stanje: "in_review", pr: -3 }, { stanje: "in_review", pr: 1.5 }, { stanje: "in_review", pr: "12" }, { stanje: "open", pr: 4 }, { stanje: "fixed", student_id: 1 }, ["fixed"]]) {
      const r = await post("lesson", lessonId, body);
      assert.equal(r.status, 400, JSON.stringify(body));
      assert.equal(r.cache, "no-store");
    }
    assert.equal((await post("nope", lessonId, { stanje: "fixed" })).status, 404);
    assert.equal((await post("app", lessonId, { stanje: "fixed" })).status, 404, "vrsta se mora ujemati");
    assert.equal((await post("lesson", "1x", { stanje: "fixed" })).status, 404);
    assert.equal((await post("lesson", 999999, { stanje: "fixed" })).status, 404);

    let r = await post("lesson", lessonId, { stanje: "in_review", pr: 451 });
    assert.equal(r.status, 200);
    assert.deepEqual(r.body, { ok: true, stanje: "in_review", pr: 451 });
    r = await post("message", msgId, { stanje: "in_review", pr: 452 });
    assert.equal(r.status, 200);
    // V pregledu je še vedno odprta za skrbnika in v izvozu.
    const admin = (await call("/api/admin/reports")).body;
    assert.equal(admin.open, 3);
    assert.equal(admin.reports.find((x) => x.kind === "lesson").pr, 451);
    assert.equal((await call("/api/prijave/izvoz", { auth: KEY })).body.prijave.find((x) => x.kind === "lesson").stanje, "in_review");

    r = await post("lesson", lessonId, { stanje: "fixed" });
    assert.deepEqual(r.body, { ok: true, stanje: "fixed", pr: 451 }, "PR ostane ob popravljeni prijavi");
    assert.ok(store.db.prepare("SELECT fixed_at FROM bug_reports WHERE id = ?").get(lessonId).fixed_at);
    const open = (await call("/api/prijave/izvoz", { auth: KEY })).body.prijave;
    assert.ok(!open.some((x) => x.kind === "lesson"), "popravljenih privzeto ni v izvozu");
    assert.ok((await call("/api/prijave/izvoz?stanje=all", { auth: KEY })).body.prijave.some((x) => x.kind === "lesson" && x.stanje === "fixed"));

    r = await post("message", msgId, { stanje: "open" });
    assert.deepEqual(r.body, { ok: true, stanje: "open", pr: null }, "PR zaprt brez združitve: znova odprta, brez PR");
    r = await post("app", appId, { stanje: "fixed", pr: 460 });
    assert.deepEqual(r.body, { ok: true, stanje: "fixed", pr: 460 });

    // Skrbnik: »Znova odpri« pobriše PR.
    await call(`/api/admin/reports/app/${appId}`, { method: "POST", body: { status: "open" } });
    assert.equal(store.db.prepare("SELECT pr FROM bug_reports WHERE id = ?").get(appId).pr, null);
  });
});

test("migracija: stara baza brez stolpca pr ga dobi, podatki ostanejo", () => {
  const db = new DatabaseSync(":memory:");
  db.exec(`CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT);
    CREATE TABLE message_reports (id INTEGER PRIMARY KEY, student_id INTEGER, conversation_id INTEGER, message_id INTEGER NOT NULL UNIQUE, reason TEXT NOT NULL, note TEXT, question TEXT, answer TEXT NOT NULL, purged INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT (datetime('now')));
    CREATE TABLE bug_reports (id INTEGER PRIMARY KEY, student_id INTEGER, kind TEXT NOT NULL, topic_id TEXT, step INTEGER, conversation_id INTEGER, reason TEXT NOT NULL, note TEXT, context TEXT, device TEXT, status TEXT NOT NULL DEFAULT 'open', fixed_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')));
    INSERT INTO bug_reports (kind, reason) VALUES ('lesson', 'wrong');
    INSERT INTO message_reports (message_id, reason, answer) VALUES (7, 'wrong', 'x');`);
  migrateReportPr(db);
  migrateReportPr(db); // dvakrat brez napake
  ensureReportsTable(db);
  for (const t of ["message_reports", "bug_reports"]) {
    assert.ok(db.prepare(`PRAGMA table_info(${t})`).all().some((c) => c.name === "pr"), t);
  }
  assert.equal(db.prepare("SELECT status, pr FROM bug_reports").get().status, "open");
  assert.equal(db.prepare("SELECT status, pr FROM message_reports").get().pr, null);
  // Prazna baza: openDb + ustvarjanje tabel.
  const fresh = openDb(":memory:");
  ensureReportsTable(fresh.db);
  assert.ok(fresh.db.prepare("PRAGMA table_info(bug_reports)").all().some((c) => c.name === "pr"));
  // Baza, ki že ima tabele prijav: migracijo naredi openDb.
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-pr-"));
  try {
    const file = path.join(dir, "t.db");
    const old = new DatabaseSync(file);
    old.exec("CREATE TABLE bug_reports (id INTEGER PRIMARY KEY, kind TEXT NOT NULL, reason TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'open', fixed_at TEXT, created_at TEXT)");
    old.close();
    const s = openDb(file);
    assert.ok(s.db.prepare("PRAGMA table_info(bug_reports)").all().some((c) => c.name === "pr"));
    s.db.close();
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("scrubText: ime in e-naslov samo kot cela beseda", () => {
  assert.equal(scrubText("Ana in Anabela, ana@x.si", ["Ana"]), "[ime] in Anabela, [e-naslov]");
  assert.equal(scrubText("", ["Ana"]), null);
  assert.equal(scrubText("Ime: J.K. in JxK", ["J.K"]), "Ime: [ime]. in JxK", "posebni znaki v imenu niso regex");
});

// Na Renderju je vsak klic oddaljen: pot gre mimo računov in gesla samo s ključem.
for (const extra of [{ EVKLID_ACCOUNTS: "1" }, { EVKLID_PASSWORD: "geslo-za-test" }]) {
  test(`izvoz prijav od zunaj: samo s ključem (${Object.keys(extra)[0]})`, async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-prijave-"));
    const port = 39000 + Math.floor(Math.random() * 900);
    const srv = spawn(process.execPath, ["--disable-warning=ExperimentalWarning", "server/index.js"], {
      env: { ...process.env, PORT: String(port), EVKLID_MOCK: "1", EVKLID_NEWS: "0", EVKLID_DB: path.join(dir, "t.db"), EVKLID_PASSWORD: "", EVKLID_ACCOUNTS: "0", ANTHROPIC_API_KEY: "", EVKLID_EXPORT_TOKEN: TOKEN, ...extra },
      stdio: "ignore",
    });
    try {
      const base = `http://127.0.0.1:${port}`;
      for (let i = 0; i < 50; i++) {
        try {
          await fetch(`${base}/healthz`);
          break;
        } catch {
          await new Promise((r) => setTimeout(r, 100));
        }
      }
      const h = (auth) => ({ "X-Forwarded-For": "1.2.3.4", "Content-Type": "application/json", ...(auth ? { Authorization: auth } : {}) });
      const get = (auth) => fetch(`${base}/api/prijave/izvoz`, { headers: h(auth) });
      assert.equal((await get()).status, 404);
      assert.equal((await get(`Bearer ${"x".repeat(40)}`)).status, 404);
      const ok = await get(`Bearer ${TOKEN}`);
      assert.equal(ok.status, 200);
      assert.equal(ok.headers.get("cache-control"), "no-store");
      assert.deepEqual((await ok.json()).prijave, []);
      const st = (auth) => fetch(`${base}/api/prijave/lesson/1/stanje`, { method: "POST", headers: h(auth), body: JSON.stringify({ stanje: "fixed" }) }).then((r) => r.status);
      assert.equal(await st(), 404);
      assert.equal(await st(`Bearer ${TOKEN}`), 404, "prijave ni");
    } finally {
      srv.kill();
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
}

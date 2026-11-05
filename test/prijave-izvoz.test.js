import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { DatabaseSync } from "node:sqlite";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { reviewExport, setReportState, studentReports } from "../server/reports.js";
import { exportTokenOk } from "../server/izvozni-kljuc.js";
import { exportTokenOk as avatarToken } from "../server/avatar.js";

// Samodejni pregled prijav napak (server/reports.js): GET /api/prijave/izvoz in POST /api/prijave/:kind/:id/stanje
// s ključem EVKLID_EXPORT_TOKEN; učenec v Računu vidi stanje (»V pregledu · PR #N«).
const REPLY = 'Ana, $7 \\cdot 8 = 54$.\n<<META subject=MAT topic="poštevanka" error=0 mode=A flag=none done=0>>';
const LESSON = "MAT-OS-8/pitagorov-izrek";

async function withServer(fn) {
  const store = openDb(":memory:");
  const streamFn = async ({ onText }) => {
    onText(REPLY);
    return { content: [{ type: "text", text: REPLY }], text: REPLY, stopReason: "end_turn" };
  };
  const server = createApp(store, { streamFn, scheduler: false }).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (p, o = {}) => {
    const res = await fetch(base + p, { method: o.method || "GET", headers: { "Content-Type": "application/json", ...(o.headers || {}) }, body: o.body ? JSON.stringify(o.body) : undefined });
    const type = res.headers.get("content-type") || "";
    return { status: res.status, cache: res.headers.get("cache-control"), body: type.includes("json") ? await res.json() : await res.text() };
  };
  try {
    await fn({ call, store });
  } finally {
    server.close();
  }
}

// Ana prijavi napačen odgovor inštruktorja in napako v lekciji; skrbnik prijavi napako iz klepeta.
async function seed(call) {
  const s = (await call("/api/students", { method: "POST", body: { name: "Ana" } })).body;
  const conv = (await call(`/api/students/${s.id}/conversations`, { method: "POST", body: {} })).body;
  await call(`/api/conversations/${conv.id}/messages`, { method: "POST", body: { text: "Ana tukaj: koliko je 7 krat 8?" } });
  const msgs = (await call(`/api/conversations/${conv.id}`)).body.messages;
  const mid = msgs.find((m) => m.role === "assistant").id;
  const m = await call(`/api/conversations/${conv.id}/messages/${mid}/report`, { method: "POST", body: { reason: "wrong", note: "Ana misli, da je 56", device: "web-phone", screen: "360x740" } });
  assert.equal(m.status, 201);
  const l = await call(`/api/students/${s.id}/lesson-report`, { method: "POST", body: { topic: LESSON, reason: "unclear", note: "Ana ne razume 2. koraka", step: 2 } });
  assert.equal(l.status, 201);
  const a = await call(`/api/students/${s.id}/bug`, { method: "POST", body: { note: "Gumb Pošlji ne dela", conversation_id: conv.id, view: "chat" } });
  assert.equal(a.status, 201);
  return { s, conv, mid, lessonId: l.body.id, appId: a.body.id };
}

test("ključ v stalnem času, skupen s kozmetiko; prekratek ali prazen ključ ne velja", () => {
  assert.equal(avatarToken, exportTokenOk);
  const env = { EVKLID_EXPORT_TOKEN: "k".repeat(30) };
  const req = (h) => ({ headers: h ? { authorization: h } : {} });
  assert.ok(exportTokenOk(req(`Bearer ${"k".repeat(30)}`), env));
  assert.ok(exportTokenOk(req(`bearer ${"k".repeat(30)}`), env));
  assert.ok(!exportTokenOk(req(`Bearer ${"k".repeat(29)}`), env));
  assert.ok(!exportTokenOk(req(`Bearer ${"k".repeat(30)}x`), env));
  assert.ok(!exportTokenOk(req(`${"k".repeat(30)}`), env));
  assert.ok(!exportTokenOk(req(), env));
  assert.ok(!exportTokenOk(req("Bearer short"), { EVKLID_EXPORT_TOKEN: "short" }));
  assert.ok(!exportTokenOk(req("Bearer "), { EVKLID_EXPORT_TOKEN: "" }));
  // Primerjava gre prek SHA-256 in crypto.timingSafeEqual (enako dolga niza ne glede na vhod).
  const src = fs.readFileSync(new URL("../server/izvozni-kljuc.js", import.meta.url), "utf8");
  assert.match(src, /timingSafeEqual/);
  assert.doesNotMatch(src, /got\s*===\s*want|want\s*===\s*got/);
});

test("izvoz: no-store, brez id-jev učenca, pogovora, sporočila in brez imena; kontekst za popravek ostane", async () => {
  await withServer(async ({ call, store }) => {
    const { s, conv, mid } = await seed(call);
    const r = await call("/api/prijave/izvoz"); // računalnik s strežnikom: dovoljeno
    assert.equal(r.status, 200);
    assert.equal(r.cache, "no-store");
    const out = r.body;
    assert.equal(out.prijave.length, 3);
    const ALLOWED = ["id", "kind", "reason", "note", "view", "topic_id", "topic_name", "step", "device", "version", "question", "answer", "raw", "created_at", "status", "pr", "fixed_at"].sort();
    for (const p of out.prijave) assert.deepEqual(Object.keys(p).sort(), ALLOWED);
    assert.deepEqual(Object.keys(out).sort(), ["at", "prijave", "version"]);
    const text = JSON.stringify(out);
    for (const bad of ["student_id", "conversation_id", "message_id", "student_name", "context", "shown", "parent", "email", "ip"]) assert.ok(!text.includes(`"${bad}"`), bad);
    assert.ok(!/\bAna\b/.test(text), "ime učenca ne gre v izvoz");
    // Id-ji učenca in pogovora se ne pojavijo kot vrednosti polj (id prijave je lastna številka tabele).
    for (const p of out.prijave) assert.ok(![s.id, conv.id, mid].includes(p.pr));

    const msg = out.prijave.find((p) => p.kind === "message");
    assert.equal(msg.reason, "wrong");
    assert.equal(msg.view, "chat");
    assert.equal(msg.device, "web-phone 360x740");
    assert.match(msg.question, /\[ime\] tukaj: koliko je 7 krat 8/);
    assert.match(msg.answer, /\[ime\], \$7 \\cdot 8 = 54\$/);
    assert.equal(msg.note, "[ime] misli, da je 56");
    assert.equal(msg.status, "open");
    assert.equal(msg.pr, null);
    const les = out.prijave.find((p) => p.kind === "lesson");
    assert.equal(les.topic_id, LESSON);
    assert.ok(les.topic_name);
    assert.equal(les.step, 2);
    assert.equal(les.note, "[ime] ne razume 2. koraka");
    const app = out.prijave.find((p) => p.kind === "app");
    assert.equal(app.view, "chat");
    assert.equal(app.note, "Gumb Pošlji ne dela");
    assert.equal(app.reason, null);

    // Zapis v dnevnik dostopov brez osebnih podatkov.
    const row = store.db.prepare("SELECT actor, action, target FROM audit_log WHERE action = 'reports_export'").get();
    assert.deepEqual({ ...row }, { actor: "system", action: "reports_export", target: "reports:3" });
  });
});

test("stanje: open → in_review s PR → fixed (PR ostane) → open (brez PR); napačen vhod 400, neznana prijava 404", async () => {
  await withServer(async ({ call, store }) => {
    const { s, lessonId, appId } = await seed(call);
    const msgId = store.db.prepare("SELECT id FROM message_reports").get().id;
    const set = (kind, id, body) => call(`/api/prijave/${kind}/${id}/stanje`, { method: "POST", body });

    for (const body of [{ status: "in_review" }, { status: "in_review", pr: 0 }, { status: "in_review", pr: "12" }, { status: "in_review", pr: 1.5 }, { status: "in_review", pr: -3 }, { status: "done" }, { status: "open", pr: 4 }, {}, { status: "fixed", pr: 1e9 }]) {
      const r = await set("lesson", lessonId, body);
      assert.equal(r.status, 400, JSON.stringify(body));
      assert.equal(r.cache, "no-store");
    }
    assert.equal((await set("nekaj", lessonId, { status: "fixed" })).status, 400);
    assert.equal((await set("lesson", "abc", { status: "fixed" })).status, 400);
    assert.equal((await set("app", lessonId, { status: "fixed" })).status, 404, "vrsta se mora ujemati");
    assert.equal((await set("message", 99999, { status: "fixed" })).status, 404);

    let r = await set("lesson", lessonId, { status: "in_review", pr: 451 });
    assert.equal(r.status, 200);
    assert.deepEqual(r.body, { ok: true, kind: "lesson", id: lessonId, status: "in_review", pr: 451 });
    // Prijava v pregledu je še med odprtimi (za skrbnika in za izvoz).
    assert.equal((await call("/api/admin/reports")).body.open, 3);

    r = await set("lesson", lessonId, { status: "fixed" });
    assert.equal(r.body.status, "fixed");
    assert.equal(r.body.pr, 451, "popravljena prijava obdrži številko PR");
    assert.ok(store.db.prepare("SELECT fixed_at FROM bug_reports WHERE id = ?").get(lessonId).fixed_at);
    assert.equal((await call("/api/prijave/izvoz")).body.prijave.length, 2, "privzeto samo nepopravljene");
    assert.equal((await call("/api/prijave/izvoz?stanje=vse")).body.prijave.length, 3);

    r = await set("lesson", lessonId, { status: "open" });
    assert.deepEqual([r.body.status, r.body.pr], ["open", null]);
    assert.equal(store.db.prepare("SELECT fixed_at FROM bug_reports WHERE id = ?").get(lessonId).fixed_at, null);

    assert.equal((await set("message", msgId, { status: "fixed", pr: 452 })).body.pr, 452);
    assert.equal((await set("app", appId, { status: "in_review", pr: 453 })).status, 200);

    // Učenec v Računu: stanje in PR, brez besedil in id-jev.
    const mine = (await call(`/api/students/${s.id}/prijave`)).body.reports;
    assert.equal(mine.length, 3);
    for (const x of mine) assert.deepEqual(Object.keys(x).sort(), ["created_at", "kind", "pr", "status", "step", "topic_name"]);
    assert.deepEqual(mine.map((x) => `${x.kind}:${x.status}:${x.pr}`).sort(), ["app:in_review:453", "lesson:open:null", "message:fixed:452"]);
    // Drug učenec ne vidi njenih prijav.
    const b = (await call("/api/students", { method: "POST", body: { name: "Bor" } })).body;
    assert.deepEqual((await call(`/api/students/${b.id}/prijave`)).body.reports, []);
    assert.deepEqual(studentReports(store.db, b.id), []);

    // Skrbnik ročno »Znova odpri« izbriše PR.
    assert.equal((await call(`/api/admin/reports/message/${msgId}`, { method: "POST", body: { status: "open" } })).status, 200);
    assert.equal(store.db.prepare("SELECT pr FROM message_reports WHERE id = ?").get(msgId).pr, null);

    const log = store.db.prepare("SELECT target FROM audit_log WHERE action = 'report_state' ORDER BY id").all().map((x) => x.target);
    assert.deepEqual(log.slice(0, 2), [`lesson:${lessonId}:in_review:pr451`, `lesson:${lessonId}:fixed`]);
  });
});

test("setReportState in reviewExport brez strežnika", () => {
  const store = openDb(":memory:");
  const db = store.db;
  createApp(store, { scheduler: false }); // mountReports ustvari tabeli prijav
  db.prepare("INSERT INTO students (id, name, settings) VALUES (7, 'Tina Kos', '{}')").run();
  db.prepare("INSERT INTO bug_reports (id, student_id, kind, reason, note, device) VALUES (5, 7, 'app', 'Tina-zaslon', 'Tina Kos pravi: po kosilu Tina in Kos ne vidita gumba', 'web-desktop')").run();
  assert.equal(setReportState(db, "app", 5, { status: "in_review", pr: 9 }), 1);
  assert.equal(setReportState(db, "app", 6, { status: "fixed" }), 0);
  assert.equal(setReportState(db, "app", 5, { status: "in_review" }), null);
  assert.equal(setReportState(db, "app", 0, { status: "fixed" }), null);
  const [p] = reviewExport(db);
  assert.equal(p.note, "[ime] pravi: po kosilu [ime] in [ime] ne vidita gumba", "celo ime in vsak del imena, ne pa »kosilu«");
  assert.equal(p.view, "[ime]-zaslon");
  assert.equal(p.pr, 9);
});

test("migracija: stara baza brez stolpcev pr in version jih dobi, prijave ostanejo", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-prijave-mig-"));
  const file = path.join(dir, "stara.db");
  try {
    const old = new DatabaseSync(file);
    old.exec(`
      CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT NOT NULL, settings TEXT NOT NULL);
      CREATE TABLE message_reports (id INTEGER PRIMARY KEY, student_id INTEGER, conversation_id INTEGER, message_id INTEGER NOT NULL UNIQUE,
        reason TEXT NOT NULL, note TEXT, question TEXT, answer TEXT NOT NULL, purged INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT (datetime('now')));
      CREATE TABLE bug_reports (id INTEGER PRIMARY KEY, student_id INTEGER, kind TEXT NOT NULL, topic_id TEXT, step INTEGER, conversation_id INTEGER,
        reason TEXT NOT NULL, note TEXT, context TEXT, device TEXT, status TEXT NOT NULL DEFAULT 'open', fixed_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')));
      INSERT INTO message_reports (message_id, reason, answer) VALUES (1, 'wrong', 'x');
      INSERT INTO bug_reports (kind, topic_id, reason) VALUES ('lesson', 'MAT-OS-8/pitagorov-izrek', 'wrong');
    `);
    old.close();
    const store = openDb(file);
    const cols = (t) => store.db.prepare(`PRAGMA table_info(${t})`).all().map((c) => c.name);
    for (const t of ["message_reports", "bug_reports"]) {
      assert.ok(cols(t).includes("pr"), `${t}.pr`);
      assert.ok(cols(t).includes("version"), `${t}.version`);
    }
    assert.ok(cols("message_reports").includes("status") && cols("message_reports").includes("shown"));
    assert.equal(store.db.prepare("SELECT status FROM message_reports").get().status, "open");
    assert.equal(setReportState(store.db, "lesson", 1, { status: "in_review", pr: 77 }), 1);
    assert.equal(store.db.prepare("SELECT pr FROM bug_reports WHERE id = 1").get().pr, 77);
    store.db.close();
    // Drugi zagon: migracija je idempotentna.
    openDb(file).db.close();
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

// Od zunaj (X-Forwarded-For, kot na Renderju): brez ključa ali z napačnim 404, ključ v naslovu ne velja.
for (const extra of [{ EVKLID_ACCOUNTS: "1" }, { EVKLID_PASSWORD: "geslo-za-test" }]) {
  test(`izvoz in stanje od zunaj: samo s ključem (${Object.keys(extra)[0]})`, async () => {
    const token = "p".repeat(40);
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-prijave-"));
    const port = 39000 + Math.floor(Math.random() * 900);
    const srv = spawn(process.execPath, ["--disable-warning=ExperimentalWarning", "server/index.js"], {
      env: { ...process.env, PORT: String(port), EVKLID_MOCK: "1", EVKLID_NEWS: "0", EVKLID_DB: path.join(dir, "t.db"), EVKLID_PASSWORD: "", EVKLID_ACCOUNTS: "0", ANTHROPIC_API_KEY: "", EVKLID_EXPORT_TOKEN: token, ...extra },
      stdio: "ignore",
    });
    try {
      for (let i = 0; i < 80; i++) {
        try {
          await fetch(`http://127.0.0.1:${port}/healthz`);
          break;
        } catch {
          await new Promise((r) => setTimeout(r, 100));
        }
      }
      const url = `http://127.0.0.1:${port}/api/prijave/izvoz`;
      const get = (auth, u = url) => fetch(u, { headers: { "X-Forwarded-For": "1.2.3.4", ...(auth ? { Authorization: auth } : {}) } });
      for (const auth of [null, `Bearer ${"x".repeat(40)}`, `Bearer ${token}x`, token, `Basic ${token}`]) {
        const r = await get(auth);
        assert.equal(r.status, 404, String(auth).slice(0, 12));
        assert.equal(r.headers.get("cache-control"), "no-store");
      }
      assert.equal((await get(null, `${url}?token=${token}`)).status, 404);
      const ok = await get(`Bearer ${token}`);
      assert.equal(ok.status, 200);
      assert.equal(ok.headers.get("cache-control"), "no-store");
      assert.deepEqual((await ok.json()).prijave, []);

      const post = (auth, body = { status: "fixed" }) =>
        fetch(`http://127.0.0.1:${port}/api/prijave/lesson/1/stanje`, { method: "POST", headers: { "Content-Type": "application/json", "X-Forwarded-For": "1.2.3.4", ...(auth ? { Authorization: auth } : {}) }, body: JSON.stringify(body) });
      assert.equal((await post(null)).status, 404);
      assert.equal((await post(`Bearer ${"y".repeat(40)}`)).status, 404);
      assert.equal((await post(`Bearer ${token}`, { status: "x" })).status, 400);
      assert.equal((await post(`Bearer ${token}`)).status, 404, "prijava ne obstaja");
    } finally {
      srv.kill();
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
}

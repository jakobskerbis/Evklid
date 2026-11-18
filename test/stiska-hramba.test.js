// Oznaka stiske (events.flag »distress«, j 18. 11. 2026): šifrirana v bazi, rok hrambe 90 dni, selitev obstoječih vrstic,
// Napredek in izvoz delujeta z odšifrirano oznako, izbris računa jo pobriše.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { newKey, isEncrypted } from "../server/crypto-polje.js";
import { migrateEncryption, encryptionStats, runRetention, clearOldDistress, RETENTION } from "../server/zasebnost.js";

const ADULT = "1985-04-12";
const DISTRESS_REPLY = 'Slišim te. Pokliči TOM 116 111. Je zdaj kdo pri tebi?\n<<META subject=MAT topic="-" error=0 mode=A flag=distress done=0>>';

const withKey = async (key, fn) => {
  const prev = process.env.EVKLID_DATA_KEY;
  process.env.EVKLID_DATA_KEY = key;
  try {
    return await fn();
  } finally {
    if (prev === undefined) delete process.env.EVKLID_DATA_KEY;
    else process.env.EVKLID_DATA_KEY = prev;
  }
};

async function withServer(fn, store) {
  const calls = [];
  const app = createApp(store, {
    accounts: true,
    scheduler: false,
    resendKey: "re_x",
    fetchFn: async (url, init = {}) => {
      calls.push({ url, body: init.body ? JSON.parse(init.body) : null });
      return { ok: true, status: 200, json: async () => ({ id: "m" }) };
    },
    log: { error() {}, info() {}, warn() {} },
    varnostFn: async () => ({ content: [{ type: "text", text: "NE" }] }),
    streamFn: async ({ onText }) => {
      onText(DISTRESS_REPLY);
      return { text: DISTRESS_REPLY, stopReason: "end_turn" };
    },
  });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const client = () => {
    const jar = {};
    return async (p, opts = {}) => {
      const res = await fetch(base + p, {
        method: opts.method || "GET",
        headers: { "Content-Type": "application/json", cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; ") },
        body: opts.body ? JSON.stringify(opts.body) : undefined,
        redirect: "manual",
      });
      for (const c of res.headers.getSetCookie()) {
        const [kv] = c.split(";");
        jar[kv.slice(0, kv.indexOf("="))] = kv.slice(kv.indexOf("=") + 1);
      }
      const type = res.headers.get("content-type") || "";
      return { status: res.status, body: type.includes("json") ? await res.json() : await res.text() };
    };
  };
  try {
    await fn({ client, calls });
  } finally {
    server.close();
  }
}

async function parentWithChild(call, calls, email) {
  const r = await call("/api/auth/register", { method: "POST", body: { email, password: "geslo1234", accept_privacy: true, birth_date: ADULT } });
  assert.equal(r.status, 201, JSON.stringify(r.body));
  const mail = calls.filter((c) => String(c.url).includes("resend")).at(-1);
  assert.equal((await call(/\/api\/auth\/verify\?token=[\w-]+/.exec(mail.body.text)[0])).status, 302);
  const s = await call("/api/students", { method: "POST", body: { name: "Miha", birth_year: new Date().getFullYear() - 12, consent: true, profile_password: "1234" } });
  assert.equal(s.status, 201, JSON.stringify(s.body));
  await call(`/api/students/${s.body.id}/unlock`, { method: "POST", body: { password: "1234" } });
  return s.body;
}

const rawFile = (file) => Buffer.concat([file, `${file}-wal`].filter((f) => fs.existsSync(f)).map((f) => fs.readFileSync(f)));

test("stiska: oznaka je v bazi šifrirana, Napredek in izvoz jo pokažeta, drug račun ne, izbris jo pobriše", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "stiska-"));
  const file = path.join(dir, "t.db");
  await withKey(newKey(), async () => {
    const store = openDb(file);
    await withServer(async ({ client, calls }) => {
      const call = client();
      const student = await parentWithChild(call, calls, "ana@primer.si");
      const c = await call(`/api/students/${student.id}/conversations`, { method: "POST" });
      const r = await call(`/api/conversations/${c.body.id}/messages`, { method: "POST", body: { text: "Ne morem več." } });
      assert.match(r.body, /event: done/);
      const ev = store.db.prepare("SELECT flag FROM events WHERE student_id = ?").get(student.id);
      assert.ok(isEncrypted(ev.flag), "oznaka šifrirana");
      // Napredek (starš, ki ima profil) vidi oznako kot prej.
      const prog = await call(`/api/students/${student.id}/progress`);
      assert.equal(prog.status, 200);
      assert.deepEqual(prog.body.flags.map((f) => f.flag), ["distress"]);
      // Drug račun profila ne vidi.
      const other = client();
      await parentWithChild(other, calls, "bor@primer.si");
      assert.ok([403, 404].includes((await other(`/api/students/${student.id}/progress`)).status));
      // Odprt pogovor: brez izbir in ponudb pod varnostnim odgovorom.
      const conv = await call(`/api/conversations/${c.body.id}`);
      assert.equal(conv.body.messages.at(-1).choices, undefined);
      // Izvoz: odšifrirana oznaka.
      const exp = await call("/api/account/export", { method: "POST", body: { password: "geslo1234" } });
      assert.equal(exp.status, 200);
      assert.deepEqual(exp.body.children[0].events.map((e) => e.flag), ["distress"]);
      assert.ok(encryptionStats(store.db).find((s) => s.table === "events" && s.col === "flag").encrypted >= 1);
      store.db.exec("PRAGMA wal_checkpoint(TRUNCATE)");
      assert.equal(rawFile(file).indexOf("distress"), -1, "v datoteki baze ni besedila »distress«");
      // Izbris računa: dogodkov profila ni več.
      assert.equal((await call("/api/account", { method: "DELETE", body: { password: "geslo1234" } })).status, 200);
      assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM events WHERE student_id = ?").get(student.id).n, 0);
    }, store);
    store.db.close();
  });
  fs.rmSync(dir, { recursive: true, force: true });
});

test("stiska: selitev obstoječih vrstic (idempotentna), rok hrambe 90 dni, neberljiva stara oznaka se izbriše", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "stiska-"));
  const file = path.join(dir, "t.db");
  const store = openDb(file);
  const s = store.createStudent("Ana");
  const c = store.createConversation(s.id, { title: "Ulomki" });
  const add = (flag, daysAgo) => {
    store.addEvent({ student_id: s.id, conversation_id: c.id, subject: "MAT", topic: "ulomki", error: 0, mode: "A", flag });
    store.db.prepare("UPDATE events SET created_at = datetime('now', ?) WHERE id = (SELECT MAX(id) FROM events)").run(`-${daysAgo} days`);
  };
  // Brez ključa (stara baza): oznake nešifrirane.
  add("distress", 120);
  add("distress", 10);
  add("unsafe", 120);
  add("none", 120);
  assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM events WHERE flag = 'distress'").get().n, 2);
  await withKey(newKey(), () => {
    const out = migrateEncryption(store.db);
    assert.equal(out.events, 3, "distress, distress, unsafe; »none« ostane");
    assert.deepEqual(migrateEncryption(store.db), {}, "idempotentno");
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM events WHERE flag = 'none'").get().n, 1);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM events WHERE flag LIKE 'enc1:%'").get().n, 3);
    // Napredek: obe stiski in unsafe, najnovejša prva.
    assert.deepEqual(store.flagEvents(s.id).map((f) => f.flag), ["unsafe", "distress", "distress"]);
    // Rok hrambe: stara stiska → none, nova ostane, unsafe ostane (rok velja samo za stisko).
    assert.equal(RETENTION.distressDays, 90);
    const r1 = runRetention(store.db, { log: {} });
    assert.equal(r1.distress, 1);
    assert.deepEqual(store.flagEvents(s.id).map((f) => f.flag), ["unsafe", "distress"]);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM events").get().n, 4, "dogodek učenja ostane");
    assert.equal(runRetention(store.db, { log: {} }).distress, 0, "idempotentno");
    // Neberljiva oznaka (neznan ključ), starejša od roka: izbriše se.
    store.db.prepare("UPDATE events SET flag = ? WHERE id = (SELECT MIN(id) FROM events)").run(`enc1:deadbeef:${Buffer.alloc(40).toString("base64")}`);
    const before = new Date(Date.now() - 90 * 86400000).toISOString().replace("T", " ").slice(0, 19);
    assert.equal(clearOldDistress(store.db, before), 1);
    // Zapis z ključem v enem koraku (nov dogodek) je takoj šifriran.
    add("distress", 0);
    assert.ok(isEncrypted(store.db.prepare("SELECT flag FROM events WHERE id = (SELECT MAX(id) FROM events)").get().flag));
  });
  store.db.exec("PRAGMA wal_checkpoint(TRUNCATE)");
  store.db.close();
  // Selitev s secure_delete: staro besedilo ne ostane v prostih straneh.
  assert.equal(rawFile(file).indexOf("distress"), -1);
  const db = new DatabaseSync(file);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM events WHERE flag = 'distress'").get().n, 0);
  db.close();
  fs.rmSync(dir, { recursive: true, force: true });
});

test("stiska: brez ključa (razvoj) rok hrambe velja tudi za nešifrirano oznako", () => {
  const store = openDb(":memory:");
  const s = store.createStudent("Ana");
  const c = store.createConversation(s.id);
  store.addEvent({ student_id: s.id, conversation_id: c.id, subject: "MAT", topic: "x", error: 0, mode: "A", flag: "distress" });
  store.db.exec("UPDATE events SET created_at = datetime('now', '-91 days')");
  assert.equal(runRetention(store.db, { log: {} }).distress, 1);
  assert.deepEqual(store.flagEvents(s.id), []);
});

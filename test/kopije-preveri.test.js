import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { openDb } from "../server/db.js";
import { makeBackup, listBackups } from "../server/kopije.js";
import { startBackupChecks, checkBackups } from "../server/kopije-preveri.js";

const quiet = { info() {}, error() {}, warn() {} };
const NOW = new Date("2026-11-09T03:40:00Z"); // 4.40 po ljubljanskem času, dnevna kopija 2026-11-09 že narejena
const ENV = { EVKLID_ADMIN_EMAILS: "skrbnik@primer.si, drugi@primer.si" };

function setup() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-preveri-"));
  const file = path.join(dir, "evklid.db");
  const store = openDb(file);
  store.db
    .prepare("INSERT INTO students (name, settings) VALUES (?, '{}')")
    .run("Ana");
  assert.equal(makeBackup(store.db, file, { now: NOW }).made, true);
  const mailer = {
    enabled: true,
    sent: [],
    async send(m) {
      this.sent.push(m);
    },
  };
  const errors = [];
  const log = { ...quiet, error: (m) => errors.push(m) };
  const done = () => {
    store.db.close();
    fs.rmSync(dir, { recursive: true, force: true });
  };
  return { file, store, mailer, errors, log, done };
}

test("preverjanje kopij: zdrava kopija → ok, brez e-pošte; v ločeni niti", async () => {
  const s = setup();
  const checks = startBackupChecks(s.store.db, s.file, {
    scheduler: false,
    log: s.log,
    now: () => NOW,
    env: ENV,
    mailer: s.mailer,
  });
  const r = await checks.run({ force: true });
  assert.equal(r.ok, true, r.napake.join("; "));
  assert.equal(r.kopija, "2026-11-09");
  assert.equal(s.mailer.sent.length, 0);
  assert.equal(s.errors.length, 0);
  assert.deepEqual(checks.status(), { datum: "2026-11-09", ok: true });
  s.done();
});

test("preverjanje kopij: pokvarjena kopija → napaka v dnevniku in en e-mail na skrbnika na dan", async () => {
  const s = setup();
  const b = listBackups(s.file)[0];
  const fd = fs.openSync(b.file, "r+");
  fs.writeSync(fd, Buffer.alloc(4096, 0x41), 0, 4096, 0); // glava baze SQLite uničena
  fs.closeSync(fd);
  const checks = startBackupChecks(s.store.db, s.file, {
    scheduler: false,
    log: s.log,
    now: () => NOW,
    env: ENV,
    mailer: s.mailer,
    worker: false,
  });
  const r = await checks.run({ force: true });
  assert.equal(r.ok, false);
  assert.match(r.napake.join(";"), /kopija ni cela/);
  assert.ok(s.errors.some((e) => /NAPAKA: preizkus varnostne kopije/.test(e)));
  assert.deepEqual(
    s.mailer.sent.map((m) => m.to),
    ["skrbnik@primer.si", "drugi@primer.si"],
  );
  assert.match(s.mailer.sent[0].subject, /ni uspel \(2026-11-09\)/);
  assert.ok(!s.errors.some((e) => /@/.test(e)), "naslovi ne v dnevnik");
  // Še en preizkus isti dan: spet napaka, e-pošte pa ne več.
  await checks.run({ force: true });
  assert.equal(s.mailer.sent.length, 2);
  assert.deepEqual(checks.status(), { datum: "2026-11-09", ok: false });
  s.done();
});

test("preverjanje kopij: brez današnje kopije in brez kopije zunaj strežnika → napaka", async () => {
  const s = setup();
  // Naslednji dan (UTC 2026-11-10) dnevne kopije še ni.
  const r1 = await checkBackups(s.file, {
    now: new Date("2026-11-10T03:40:00Z"),
    env: {},
    worker: false,
  });
  assert.equal(r1.ok, false);
  assert.match(r1.napake[0], /današnje dnevne kopije/);
  // Kopija zunaj strežnika: preveri se samo seznam ključev.
  const cloud = {
    EVKLID_KOPIJE_S3_URL: "https://r2.primer",
    EVKLID_KOPIJE_S3_BUCKET: "b",
    EVKLID_KOPIJE_S3_KEY_ID: "k",
    EVKLID_KOPIJE_S3_SECRET: "s",
  };
  const calls = [];
  const fetchWith = (keys) => async (url, o) => {
    calls.push(o.method);
    return new Response(
      `<ListBucketResult>${keys.map((k) => `<Key>${k}</Key>`).join("")}</ListBucketResult>`,
      { status: 200 },
    );
  };
  const r2 = await checkBackups(s.file, {
    now: NOW,
    env: cloud,
    fetchFn: fetchWith(["kopije/evklid-2026-11-08.db.enc"]),
    worker: false,
  });
  assert.equal(r2.ok, false);
  assert.match(r2.napake[0], /2026-11-09 zunaj strežnika ni/);
  const r3 = await checkBackups(s.file, {
    now: NOW,
    env: cloud,
    fetchFn: fetchWith(["kopije/evklid-2026-11-09.db.enc"]),
    worker: false,
  });
  assert.equal(r3.ok, true, r3.napake.join("; "));
  assert.deepEqual(
    [...new Set(calls)],
    ["GET"],
    "nič se ne naloži ali pobriše",
  );
  s.done();
});

test("preverjanje kopij: urnik samo ponoči, enkrat na dan, počaka na zahteve v teku", async () => {
  const s = setup();
  let t = new Date("2026-11-09T02:00:00Z"); // 3.00 v Ljubljani: še ne
  let busy = true;
  const checks = startBackupChecks(s.store.db, s.file, {
    scheduler: false,
    log: s.log,
    now: () => t,
    env: ENV,
    mailer: s.mailer,
    worker: false,
    isBusy: () => busy,
  });
  checks.tick();
  assert.equal(checks.status(), null);
  t = NOW;
  checks.tick(); // zahteve v teku: počaka
  await new Promise((r) => setTimeout(r, 20));
  assert.equal(checks.status(), null);
  busy = false;
  checks.tick();
  await new Promise((r) => setTimeout(r, 50));
  assert.deepEqual(checks.status(), { datum: "2026-11-09", ok: true });
  assert.equal(await checks.run(), null, "isti dan se ne ponovi");
  // Izklop: pomnilniška baza ali EVKLID_KOPIJE_PREVERI=0.
  assert.equal(
    startBackupChecks(s.store.db, s.file, {
      scheduler: false,
      env: { EVKLID_KOPIJE_PREVERI: "0" },
    }).status(),
    null,
  );
  s.done();
});

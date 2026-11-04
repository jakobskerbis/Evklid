import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { openDb } from "../server/db.js";
import { makeBackup, listBackups, startBackups, restoreFile, applyPendingRestore } from "../server/kopije.js";
import { verifyBackup, prepareRestore } from "../scripts/obnovi-kopijo.js";

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), "evklid-kopije-"));
const quiet = { info() {}, error() {} };
const names = (store) => store.db.prepare("SELECT name FROM students ORDER BY id").all().map((r) => r.name);

test("kopije: ena na dan, zadnjih 7, preizkus obnove in obnova ob naslednjem zagonu", () => {
  const dir = tmp();
  const file = path.join(dir, "evklid.db");
  let store = openDb(file);
  store.db.prepare("INSERT INTO students (name, settings) VALUES (?, '{}')").run("Ana");

  // 9 dni kopij: ostane 7, ista dan dvakrat ne naredi nove.
  for (let d = 1; d <= 9; d++) assert.equal(makeBackup(store.db, file, { now: new Date(`2026-11-0${d}T03:00:00Z`) }).made, true);
  assert.equal(makeBackup(store.db, file, { now: new Date("2026-11-09T20:00:00Z") }).made, false);
  const list = listBackups(file);
  assert.equal(list.length, 7);
  assert.equal(list[0].date, "2026-11-09");
  assert.equal(list.at(-1).date, "2026-11-03");

  // Po kopiji se zgodi nesreča: učenec izbrisan, nov dodan.
  store.db.prepare("DELETE FROM students").run();
  store.db.prepare("INSERT INTO students (name, settings) VALUES (?, '{}')").run("Napaka");

  // Preizkus obnove (ne spremeni ničesar).
  const v = verifyBackup(file, list[0].file);
  assert.equal(v.ok, true);
  assert.deepEqual(v.counts.students, { kopija: 1, baza: 1 });
  assert.deepEqual(names(store), ["Napaka"]);

  // Obnova: pripravi obnovi.db, strežnik jo uporabi ob naslednjem zagonu (server/index.js).
  prepareRestore(file, list[0].file);
  assert.ok(fs.existsSync(restoreFile(file)));
  store.db.close();
  assert.equal(applyPendingRestore(file, { log: quiet }).restored, true); // server/index.js ob zagonu
  store = openDb(file);
  assert.deepEqual(names(store), ["Ana"]);
  assert.equal(fs.existsSync(restoreFile(file)), false);
  const saved = fs.readdirSync(dir).filter((f) => /^evklid\.db\.pred-obnovo-.*Z$/.test(f));
  assert.equal(saved.length, 1, "prejšnja baza ostane za razveljavitev");
  store.db.close();
  fs.rmSync(dir, { recursive: true, force: true });
});

test("kopije: pokvarjena obnovi.db se ne uporabi, baza ostane", () => {
  const dir = tmp();
  const file = path.join(dir, "evklid.db");
  let store = openDb(file);
  store.db.prepare("INSERT INTO students (name, settings) VALUES (?, '{}')").run("Ana");
  store.db.close();
  fs.writeFileSync(restoreFile(file), "to ni baza");
  assert.equal(applyPendingRestore(file, { log: quiet }).restored, false);
  store = openDb(file);
  assert.deepEqual(names(store), ["Ana"]);
  assert.ok(fs.existsSync(`${restoreFile(file)}.pokvarjena`));
  store.db.close();
  fs.rmSync(dir, { recursive: true, force: true });
});

test("kopije: stanje za /healthz/stanje; brez kopij za bazo v pomnilniku", () => {
  const dir = tmp();
  const file = path.join(dir, "evklid.db");
  const store = openDb(file);
  const b = startBackups(store.db, file, { scheduler: false, log: quiet, now: () => new Date("2026-11-04T03:00:00Z") });
  assert.equal(b.status().kopij, 0);
  b.run();
  assert.equal(b.status().kopij, 1);
  assert.equal(b.status().zadnja, "2026-11-04");
  assert.equal(b.status().napaka, null);
  assert.equal(startBackups(store.db, ":memory:", { scheduler: false }).status(), null);
  store.db.close();
  fs.rmSync(dir, { recursive: true, force: true });
});

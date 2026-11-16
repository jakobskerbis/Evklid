import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { openDb } from "../server/db.js";
import { makeBackup, listBackups, startBackups, restoreFile, applyPendingRestore, savedBeforeRestore } from "../server/kopije.js";
import { verifyBackup, prepareRestore } from "../scripts/obnovi-kopijo.js";
import { runRetention } from "../server/zasebnost.js";

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
  const saved = savedBeforeRestore(file);
  assert.equal(saved.length, 1, "prejšnja baza ostane za razveljavitev");

  // Razveljavitev: nazaj na bazo izpred obnove (tudi z neshranjeno WAL).
  prepareRestore(file, saved[0]);
  store.db.close();
  assert.equal(applyPendingRestore(file, { log: quiet }).restored, true);
  store = openDb(file);
  assert.deepEqual(names(store), ["Napaka"]);
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
  assert.equal(b.status().napaka, false);
  assert.equal(b.status().obnovaCaka, false);
  assert.equal(startBackups(store.db, ":memory:", { scheduler: false }).status(), null);
  store.db.close();
  fs.rmSync(dir, { recursive: true, force: true });
});

test("kopije: ročna kopija ne prepiše dnevne; obnova, starejša od 1 ure, se ne uporabi", () => {
  const dir = tmp();
  const file = path.join(dir, "evklid.db");
  let store = openDb(file);
  store.db.prepare("INSERT INTO students (name, settings) VALUES (?, '{}')").run("Ana");
  const now = new Date("2026-11-04T06:30:00Z");
  assert.equal(makeBackup(store.db, file, { now }).made, true);
  const m = makeBackup(store.db, file, { now, manual: true });
  assert.equal(m.made, true);
  assert.deepEqual(listBackups(file).map((b) => [b.date, b.manual]), [["2026-11-04-0630", true], ["2026-11-04", false]]);
  // Ostanek nedokončane kopije se pobriše ob naslednji.
  fs.writeFileSync(path.join(dir, "kopije", "evklid-2026-11-01.db.tmp"), "x");
  const hourAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
  fs.utimesSync(path.join(dir, "kopije", "evklid-2026-11-01.db.tmp"), hourAgo, hourAgo);
  makeBackup(store.db, file, { now: new Date("2026-11-05T01:00:00Z") });
  assert.equal(fs.existsSync(path.join(dir, "kopije", "evklid-2026-11-01.db.tmp")), false);

  prepareRestore(file, listBackups(file).at(-1).file);
  store.db.prepare("INSERT INTO students (name, settings) VALUES (?, '{}')").run("Bor");
  store.db.close();
  const later = new Date(Date.now() + 2 * 60 * 60 * 1000);
  assert.equal(applyPendingRestore(file, { log: quiet, now: later }).reason, "potekla");
  assert.ok(fs.existsSync(`${restoreFile(file)}.potekla`));
  store = openDb(file);
  assert.deepEqual(names(store), ["Ana", "Bor"]);
  store.db.close();
  fs.rmSync(dir, { recursive: true, force: true });
});

// Najdba 1 koraka 5 pilota (docs/izbris-izvoz.md): ročne kopije so imele samo omejitev števila (zadnje 3). Ker
// zasebnost.html §5 obljublja izbris iz kopij v 30 dneh (posnetek diska pri Renderju jih hrani še 7 dni), se ročna kopija
// po 22 dneh pobriše tudi, če je med zadnjimi 3.
test("kopije: ročna kopija, starejša od 22 dni, se pobriše ob naslednji dnevni ali ročni kopiji", () => {
  const dir = tmp();
  const file = path.join(dir, "evklid.db");
  const store = openDb(file);
  makeBackup(store.db, file, { now: new Date("2026-10-01T05:00:00Z"), manual: true });
  makeBackup(store.db, file, { now: new Date("2026-10-15T05:00:00Z"), manual: true });
  assert.deepEqual(listBackups(file).map((b) => b.date), ["2026-10-15-0500", "2026-10-01-0500"]);
  // 22. 10.: kopija z 1. 10. je stara 21 dni in ostane.
  makeBackup(store.db, file, { now: new Date("2026-10-22T03:00:00Z") });
  assert.deepEqual(listBackups(file).map((b) => b.date), ["2026-10-22", "2026-10-15-0500", "2026-10-01-0500"]);
  // 23. 10.: stara 22 dni, pobrisana; s 15. 10. ostane (zadnje 3 ročne in mlajša od 22 dni).
  makeBackup(store.db, file, { now: new Date("2026-10-23T03:00:00Z") });
  assert.deepEqual(listBackups(file).map((b) => b.date), ["2026-10-23", "2026-10-22", "2026-10-15-0500"]);
  // Tudi ročna kopija pobriše prestare ročne.
  makeBackup(store.db, file, { now: new Date("2026-11-20T03:00:00Z"), manual: true });
  assert.deepEqual(listBackups(file).filter((b) => b.manual).map((b) => b.date), ["2026-11-20-0300"]);
  store.db.close();
  fs.rmSync(dir, { recursive: true, force: true });
});

test("kopije: dnevno čiščenje po rokih hrambe pobriše stare ročne kopije in bazo pred obnovo tudi brez dnevnih kopij", () => {
  const dir = tmp();
  const file = path.join(dir, "evklid.db");
  const store = openDb(file); // brez startBackups (kot EVKLID_BACKUPS=0)
  const dni = (d) => new Date(Date.now() - d * 864e5);
  makeBackup(store.db, file, { now: dni(23), manual: true });
  makeBackup(store.db, file, { now: dni(10), manual: true });
  const shranjena = path.join(dir, "evklid.db.pred-obnovo-2026-01-01T00-00-00-000Z");
  const mlada = path.join(dir, "evklid.db.pred-obnovo-2026-01-02T00-00-00-000Z");
  fs.writeFileSync(shranjena, "x");
  fs.writeFileSync(mlada, "x");
  fs.utimesSync(shranjena, dni(15), dni(15));
  fs.utimesSync(mlada, dni(13), dni(13));
  const out = runRetention(store.db, { log: quiet });
  assert.equal(out.backups, 2);
  assert.deepEqual(listBackups(file).map((b) => b.date), [`${dni(10).toISOString().slice(0, 10)}-${dni(10).toISOString().slice(11, 16).replace(":", "")}`]);
  assert.equal(fs.existsSync(shranjena), false);
  assert.equal(fs.existsSync(mlada), true);
  store.db.close();
  fs.rmSync(dir, { recursive: true, force: true });
});

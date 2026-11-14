// D7 (hitrost, j 14. 11.): skupna poraba AI za danes in za ta mesec se bere iz dnevnih vsot (usage_dnevno), ki jih
// vzdržujejo sprožilci, ne iz vseh vrstic usage. Vsota mora biti ves čas enaka SUM(cost_usd) nad usage, tudi po
// spremembi datuma, brisanju in vpisu mimo usage.log (drug proces, skripta). Na stari kodi pade (ni tabele, vsota
// bere usage).
// Zagon: node --test test/poraba-vsota-d7.test.js
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { openDb } from "../server/db.js";
import { Usage } from "../server/usage.js";

const blizu = (a, b, sporocilo) => assert.ok(Math.abs(a - b) < 1e-9, `${sporocilo}: ${a} ≠ ${b}`);

test("D7 skupna poraba: dnevne vsote ostanejo enake vsoti vrstic usage", () => {
  const store = openDb(":memory:");
  const db = store.db;
  const usage = new Usage(db);
  const s = store.createStudent("Ana");
  const resnica = (od) => db.prepare("SELECT COALESCE(SUM(cost_usd),0) AS s FROM usage WHERE created_at >= date('now', ?)").get(od).s;
  const preveri = (kje) => {
    blizu(usage.monthTotal(), resnica("start of month"), `${kje}: mesec`);
    blizu(usage.todayTotal(), resnica("start of day"), `${kje}: danes`);
  };
  preveri("prazna baza");
  usage.log(s.id, "claude-haiku-4-5", { input_tokens: 1000, output_tokens: 500 });
  usage.log(s.id, "claude-haiku-4-5", { input_tokens: 2000, output_tokens: 100 }, "verify");
  assert.ok(usage.monthTotal() > 0, "poraba je zapisana");
  preveri("po usage.log");
  const vpis = db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd, created_at) VALUES (?, 'x', 'chat', ?, ?)");
  vpis.run(s.id, 0.25, "2020-01-15 10:00:00"); // star mesec: ne šteje
  const vceraj = Number(vpis.run(s.id, 0.5, db.prepare("SELECT datetime('now', '-1 day') AS d").get().d).lastInsertRowid);
  const iso = Number(vpis.run(s.id, 0.125, new Date().toISOString()).lastInsertRowid); // oblika ISO s »T«
  preveri("po vpisu mimo log");
  db.prepare("UPDATE usage SET created_at = '2020-02-01 00:00:00' WHERE id = ?").run(iso);
  preveri("po premiku v star mesec");
  db.prepare("UPDATE usage SET cost_usd = 2 WHERE id = ?").run(vceraj);
  preveri("po spremembi zneska");
  db.prepare("DELETE FROM usage WHERE id = ?").run(vceraj);
  preveri("po brisanju");
  db.prepare("UPDATE usage SET student_id = NULL").run(); // izbrisan profil: znesek ostane
  preveri("po izbrisu profila");
});

test("D7 skupna poraba: vsota ne bere tabele usage, ob prvem zagonu se napolni iz obstoječe porabe", () => {
  const mapa = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-d7-"));
  try {
    const datoteka = path.join(mapa, "t.db");
    let store = openDb(datoteka);
    const s = store.createStudent("Ana");
    const vpis = store.db.prepare("INSERT INTO usage (student_id, model, cost_usd, created_at) VALUES (?, 'x', ?, datetime('now', ?))");
    for (let i = 0; i < 50; i++) vpis.run(s.id, 0.01 * (i + 1), `-${i % 3} hours`);
    // Stara baza: brez dnevnih vsot in sprožilcev (kot pred D7).
    store.db.exec("DROP TRIGGER usage_dnevno_ins; DROP TRIGGER usage_dnevno_del; DROP TRIGGER usage_dnevno_upd; DROP TABLE usage_dnevno");
    store.db.close();
    store = openDb(datoteka);
    const usage = new Usage(store.db);
    const resnica = store.db.prepare("SELECT COALESCE(SUM(cost_usd),0) AS s FROM usage WHERE created_at >= date('now','start of month')").get().s;
    blizu(usage.monthTotal(), resnica, "po polnjenju ob zagonu");
    // Ponovni zagon ne podvoji vsot.
    store.db.close();
    store = openDb(datoteka);
    blizu(new Usage(store.db).monthTotal(), resnica, "po drugem zagonu");
    // Manjka en sprožilec in vsota je napačna (ročni poseg): ob zagonu se vse ustvari znova in napolni.
    store.db.exec("DROP TRIGGER usage_dnevno_del; UPDATE usage_dnevno SET usd = usd + 100");
    store.db.close();
    store = openDb(datoteka);
    blizu(new Usage(store.db).monthTotal(), resnica, "po popravilu ob zagonu");
    store.db.prepare("DELETE FROM usage WHERE id = (SELECT MAX(id) FROM usage)").run();
    blizu(new Usage(store.db).monthTotal(), store.db.prepare("SELECT COALESCE(SUM(cost_usd),0) AS s FROM usage WHERE created_at >= date('now','start of month')").get().s, "sprožilec brisanja deluje");
    // Načrt: skupna vsota bere usage_dnevno, ne usage.
    const plan = (q) => store.db.prepare(`EXPLAIN QUERY PLAN ${q}`).all().map((r) => r.detail).join("; ");
    const spy = [];
    const prepare = store.db.prepare.bind(store.db);
    store.db.prepare = (q) => (spy.push(q), prepare(q));
    const u2 = new Usage(store.db);
    u2.monthTotal();
    u2.todayTotal();
    const vsote = spy.filter((q) => /SUM\(/.test(q));
    assert.equal(vsote.length, 2, "dve vsoti");
    for (const q of vsote) {
      assert.match(q, /FROM usage_dnevno/, "vsota iz dnevnih vsot");
      assert.doesNotMatch(plan(q.replace("?", "'start of month'")), /\busage\b(?!_dnevno)/, "načrt ne bere usage");
    }
    store.db.close();
  } finally {
    fs.rmSync(mapa, { recursive: true, force: true });
  }
});

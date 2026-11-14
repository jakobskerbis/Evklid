// Točka D1 (hitrost, master brief j 13. 11.): poizvedbe po enem profilu gredo prek indeksa, ne berejo cele tabele
// ali vse porabe v mesecu. Na stari kodi pade (SCAN ali idx_usage(created_at)). Zagon: node --test test/indeksi-d1.test.js
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { Leagues } from "../server/leagues.js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// Besedilo stavka iz izvorne kode (niz v "…" v vrstici, ki vsebuje oznako), da test preverja pravi stavek.
const izKode = (datoteka, oznaka) => {
  const vrstica = fs.readFileSync(new URL(`../${datoteka}`, import.meta.url), "utf8").split("\n").find((v) => v.includes(oznaka));
  return /"(SELECT[^"]+)"/.exec(vrstica)[1];
};
const nacrt = (db, sql, ...args) => db.prepare(`EXPLAIN QUERY PLAN ${sql}`).all(...args).map((r) => r.detail).join(" | ");

test("D1 indeksi: pogovori, poraba, naloge seje, dogodki pogovora in razredi učenca gredo prek indeksa", () => {
  const store = openDb(":memory:");
  new Leagues(store);
  const { db } = store;
  const primeri = [
    ["SELECT * FROM conversations WHERE student_id = ? ORDER BY updated_at DESC, id DESC", [1], /USING INDEX idx_conv_student/],
    ["SELECT COALESCE(SUM(cost_usd),0) AS s FROM usage WHERE student_id = ? AND created_at >= ?", [1, "2026-11-01"], /USING INDEX idx_usage_student \(student_id=\? AND created_at>\?\)/],
    ["SELECT COALESCE(SUM(cost_usd),0) AS s FROM usage WHERE student_id = ? AND created_at >= date('now','start of month')", [1], /USING INDEX idx_usage_student \(student_id=\? AND created_at>\?\)/],
    ["SELECT * FROM tasks WHERE session_id = ? ORDER BY id", ["s1"], /USING INDEX idx_tasks_session/],
    ["SELECT * FROM events WHERE conversation_id = ? ORDER BY id DESC LIMIT 1", [1], /USING (COVERING )?INDEX idx_events_conv/],
    ["SELECT mode FROM events WHERE conversation_id = ? AND message_id IS NOT NULL ORDER BY id DESC LIMIT ?", [1, 5], /USING INDEX idx_events_conv/],
    ["SELECT c.* FROM class_members m JOIN classes c ON c.id = m.class_id WHERE m.student_id = ? ORDER BY m.joined_at, c.id", [1], /SEARCH m USING (COVERING )?INDEX idx_class_members_student/],
    // Vsote za ves mesec ali 30 dni (pregled 2): stavka iz kode ostaneta na idx_usage(created_at) in ne bereta vse
    // zgodovine prek idx_usage_student (planer bi ga sicer izbral zaradi GROUP BY oziroma student_id IS NOT NULL).
    [izKode("server/accounts/index.js", "GROUP BY student_id\").all"), [], /SEARCH usage USING INDEX idx_usage \(created_at>\?\)/],
    [izKode("server/usage.js", "SELECT DISTINCT student_id AS id FROM usage"), [], /SEARCH usage USING INDEX idx_usage \(created_at>\?\)/],
  ];
  for (const [sql, args, vzorec] of primeri) {
    const n = nacrt(db, sql, ...args);
    assert.match(n, vzorec, `${sql}\n  načrt: ${n}`);
    assert.doesNotMatch(n, /\bSCAN (conversations|usage|tasks|events|m)\b/, `${sql}\n  načrt: ${n}`);
  }
});

test("D1 indeksi: ponovni zagon na isti bazi jih ne podvoji in ne pade", () => {
  const mapa = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-d1-"));
  const datoteka = path.join(mapa, "t.db");
  const indeksi = (store) => store.db.prepare("SELECT name FROM sqlite_master WHERE type = 'index' ORDER BY name").all().map((r) => r.name);
  const prvi = openDb(datoteka);
  const pred = indeksi(prvi);
  prvi.db.close();
  const drugi = openDb(datoteka);
  assert.deepEqual(indeksi(drugi), pred);
  for (const ime of ["idx_conv_student", "idx_usage_student", "idx_tasks_session", "idx_events_conv"]) assert.ok(pred.includes(ime), ime);
  drugi.db.close();
  fs.rmSync(mapa, { recursive: true, force: true });
});

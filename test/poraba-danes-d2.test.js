// Točka D2 (hitrost, master brief j 13. 11.): »danes« v porabi AI (usage.js) je razpon nad created_at, ne
// date(created_at) = date('now'), da poizvedba ne bere cele tabele usage. Na stari kodi pade (SCAN usage).
// Zagon: node --test test/poraba-danes-d2.test.js
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { Usage } from "../server/usage.js";
import { MODEL_DEEP } from "../server/claude.js";

// Ujame besedilo stavkov, ki jih Usage pripravi, da preverimo njihov načrt.
function zajemi(db) {
  const stavki = [];
  const prepare = db.prepare.bind(db);
  db.prepare = (sql) => (stavki.push(sql), prepare(sql));
  return { stavki, prepare };
}

test("D2 poraba danes: dnevna meja močnejšega modela ne bere cele tabele usage", () => {
  const store = openDb(":memory:");
  const s = store.createStudent("Ana");
  const u = new Usage(store.db);
  const { stavki, prepare } = zajemi(store.db);
  u.deepToday(s.id, MODEL_DEEP);
  const sql = stavki.find((q) => /FROM usage/.test(q));
  assert.ok(sql, "deepToday bere usage");
  const nacrt = prepare(`EXPLAIN QUERY PLAN ${sql}`).all(s.id, "%x%").map((r) => r.detail).join(" | ");
  assert.doesNotMatch(nacrt, /SCAN usage/, nacrt);
  // Razpon nad created_at mora biti v načrtu tudi z indeksom (student_id, created_at) iz D1 (pregled 3).
  assert.match(nacrt, /SEARCH usage USING INDEX \w+ \((student_id=\? AND )?created_at>\? AND created_at<\?\)/, nacrt);
});

test("D2 poraba danes: šteje samo današnji dan (UTC), tudi zapise v obliki ISO", () => {
  const store = openDb(":memory:");
  const s = store.createStudent("Bor");
  const u = new Usage(store.db);
  const dan = (sql) => store.db.prepare(`SELECT ${sql} AS d`).get().d;
  const vceraj = dan("datetime('now', 'start of day', '-1 second')");
  const jutri = dan("datetime('now', 'start of day', '+1 day')");
  const zacetek = dan("datetime('now', 'start of day')");
  const iso = dan("strftime('%Y-%m-%dT%H:%M:%fZ', 'now')");
  const vpisi = (at) =>
    store.db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd, created_at) VALUES (?, ?, 'chat', 0.01, ?)").run(s.id, MODEL_DEEP, at);
  for (const at of [vceraj, jutri, zacetek, iso]) vpisi(at);
  vpisi(dan("datetime('now')"));
  assert.equal(u.deepToday(s.id, MODEL_DEEP), 3, "začetek dneva, zdaj in ISO; ne včeraj ob 23:59:59 in ne jutri");
  assert.equal(u.summary().today_calls, 3, "povzetek porabe za danes enako");
});

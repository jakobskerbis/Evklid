import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { Avatars, ensureAvatarTables } from "../server/avatar.js";
import { ITEM } from "../public/avatar.js";

// j, 29. 10. 2026: barve telesa so brezplačne, liki (predal kind) ostanejo nagrada iz iger.
test("barve telesa so brezplačne, liki ne", () => {
  const body = Object.values(ITEM).filter((x) => x.slot === "body");
  assert.ok(body.length >= 10);
  for (const x of body) assert.equal(x.price, 0, x.id);
  for (const x of Object.values(ITEM).filter((x) => x.slot === "kind" && x.id !== "kind_blob")) assert.ok(x.earn, x.id);
});

test("kupljene barve se vrnejo enkrat, dnevne meje kovancev ne pojedo", () => {
  const store = openDb(":memory:");
  const db = store.db;
  const s = store.createStudent("Ana");
  const av = new Avatars(db);
  const ins = db.prepare("INSERT INTO coin_events (student_id, amount, reason) VALUES (?, ?, ?)");
  ins.run(s.id, 500, "igre");
  ins.run(s.id, -300, "avatar: body_rainbow");
  ins.run(s.id, -20, "avatar: hat_cap");
  assert.equal(av.balance(s.id), 180);
  const before = av.earnedToday(s.id);
  ensureAvatarTables(db); // ob zagonu strežnika
  ensureAvatarTables(db); // drugi zagon ne vrne še enkrat
  assert.equal(av.balance(s.id), 480);
  assert.equal(av.earnedToday(s.id), before);
  assert.deepEqual(av.buy(s.id, "body_gold"), { ok: true });
  assert.equal(av.balance(s.id), 480);
});

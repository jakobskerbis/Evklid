// Točka B2 (pilot, j 14. 11.): odprtje dela aplikacije se zabeleži na profil in del samo kot prvi dan, zadnji dan
// in število dni. Skrbnik vidi skupna števila po delih (brez skrbnikovih profilov). Zagon: node --test test/odpiranje-delov.test.js
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { migrateAccounts } from "../server/accounts/schema.js";
import { DELI, migrateOdpiranje, zabeleziOdprtje, porociloDelov } from "../server/odpiranje-delov.js";
import { withAccounts } from "./racuni-pomoc.js";

const DAY = 86400000;
const T0 = Date.parse("2026-11-20T10:00:00Z");

test("B2 zapis: isti dan šteje enkrat, nov dan poveča število dni, prvi dan ostane", () => {
  const { db } = openDb(":memory:");
  migrateOdpiranje(db);
  const s = db.prepare("INSERT INTO students (name, settings) VALUES ('A', '{}')").run().lastInsertRowid;
  assert.equal(zabeleziOdprtje(db, s, "svet3d", T0), true);
  assert.equal(zabeleziOdprtje(db, s, "svet3d", T0 + 3600000), true);
  assert.deepEqual({ ...db.prepare("SELECT prvi, zadnji, dni FROM odpiranje_delov WHERE student_id = ?").get(s) }, { prvi: "2026-11-20", zadnji: "2026-11-20", dni: 1 });
  zabeleziOdprtje(db, s, "svet3d", T0 + 2 * DAY);
  zabeleziOdprtje(db, s, "svet3d", T0 + 2 * DAY + 60000);
  // Zamujen zapis za starejši dan ne premakne zadnjega dne nazaj in ne šteje novega dne.
  zabeleziOdprtje(db, s, "svet3d", T0 + DAY);
  assert.deepEqual({ ...db.prepare("SELECT prvi, zadnji, dni FROM odpiranje_delov WHERE student_id = ?").get(s) }, { prvi: "2026-11-20", zadnji: "2026-11-22", dni: 2 });
  assert.equal(zabeleziOdprtje(db, s, "nekaj", T0), false);
  assert.equal(zabeleziOdprtje(db, s, "constructor", T0), false);
  const stolpci = db.prepare("PRAGMA table_info(odpiranje_delov)").all().map((c) => c.name);
  assert.deepEqual(stolpci, ["student_id", "del", "prvi", "zadnji", "dni"], "brez ur, naprave ali IP");
});

test("B2 poročilo: odprli in vrnili se po delih, delež med učenci; skrbnik in stari zapisi se ne štejejo", () => {
  const { db } = openDb(":memory:");
  migrateAccounts(db);
  migrateOdpiranje(db);
  const pid = db
    .prepare("INSERT INTO parents (email, password_hash, is_admin, privacy_version, unsubscribe_token, referral_code) VALUES ('j@x.si', 'x', 1, 'v', 'u', 'r')")
    .run().lastInsertRowid;
  const nov = (name, parent = null) => db.prepare("INSERT INTO students (name, settings, parent_id) VALUES (?, '{}', ?)").run(name, parent).lastInsertRowid;
  const [a, b, c, admin] = [nov("A"), nov("B"), nov("C"), nov("J", pid)];
  // A: 3D svet dva dneva (vrnil se), lekcije en dan. B: 3D svet en dan. C: lekcije pred 200 dnevi (star zapis).
  zabeleziOdprtje(db, a, "svet3d", T0 - 5 * DAY);
  zabeleziOdprtje(db, a, "svet3d", T0 - DAY);
  zabeleziOdprtje(db, a, "lekcije", T0);
  zabeleziOdprtje(db, b, "svet3d", T0 - 2 * DAY);
  zabeleziOdprtje(db, c, "lekcije", T0 - 200 * DAY);
  zabeleziOdprtje(db, admin, "igre", T0);
  zabeleziOdprtje(db, admin, "svet3d", T0);
  const r = porociloDelov(db, { days: 30, now: T0 });
  assert.equal(r.ucenci, 2);
  assert.deepEqual(r.deli.map((d) => d.del), DELI);
  const po = Object.fromEntries(r.deli.map((d) => [d.del, d]));
  assert.deepEqual([po.svet3d.odprli, po.svet3d.vrnili, po.svet3d.delez, po.svet3d.delezVrnili], [2, 1, 1, 0.5]);
  assert.deepEqual([po.lekcije.odprli, po.lekcije.vrnili, po.lekcije.delez], [1, 0, 0.5]);
  assert.equal(po.igre.odprli, 0, "skrbnikov profil se ne šteje");
  assert.equal(po.igre.delezVrnili, null);
  // Obdobje 3 dni: A (3D včeraj, lekcije danes) in B (3D pred 2 dnevoma) sta še notri.
  assert.equal(porociloDelov(db, { days: 3, now: T0 }).ucenci, 2);
  assert.equal(porociloDelov(db, { days: 1, now: T0 }).ucenci, 1);
  // Zapis, starejši od 120 dni, se ob poročilu izbriše.
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM odpiranje_delov WHERE student_id = ?").get(c).n, 0);
});

test("B2 pot: učenec zabeleži odprtje, neznan del 400, tuj profil ne; skrbniško poročilo samo za skrbnika; izvoz in izbris", async () => {
  await withAccounts({}, async ({ call, kid, store, base, jar }) => {
    assert.equal((await call(`/api/students/${kid.id}/odprto`, { method: "POST", body: { del: "svet3d" } })).status, 204);
    assert.equal((await call(`/api/students/${kid.id}/odprto`, { method: "POST", body: { del: "svet3d" } })).status, 204);
    assert.equal((await call(`/api/students/${kid.id}/odprto`, { method: "POST", body: { del: "zunaj" } })).status, 400);
    assert.equal((await call(`/api/students/${kid.id}/odprto`, { method: "POST", body: {} })).status, 400);
    const tuj = store.db.prepare("INSERT INTO students (name, settings) VALUES ('Tuj', '{}')").run().lastInsertRowid;
    const r = await call(`/api/students/${tuj}/odprto`, { method: "POST", body: { del: "igre" } });
    assert.ok(r.status === 403 || r.status === 404, `tuj profil: ${r.status}`);
    assert.deepEqual(
      store.db.prepare("SELECT student_id, del, dni FROM odpiranje_delov ORDER BY student_id").all().map((x) => ({ ...x })),
      [{ student_id: kid.id, del: "svet3d", dni: 1 }],
    );
    // Skrbniško poročilo od zunaj (ne s strežnikovega računalnika): navaden starš 403.
    const cookie = Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; ");
    assert.equal((await fetch(`${base}/api/admin/deli`, { headers: { cookie, "x-forwarded-for": "203.0.113.5" } })).status, 403);
    // Izvoz podatkov vsebuje zapise, izbris računa jih pobriše.
    const exp = await call("/api/account/export", { method: "POST", body: { password: "geslo1234" } });
    assert.equal(exp.status, 200);
    assert.match(JSON.stringify(exp.body), /odpiranje_delov/);
    assert.equal((await call("/api/account", { method: "DELETE", body: { password: "geslo1234" } })).status, 200);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM odpiranje_delov").get().n, 0);
  });
});

// Rok hrambe naročil šol (kontaktna oseba: ime, e-naslov, telefon) – iskalec napak N3; roka odloči j.
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { migrateSchoolOrders } from "../server/sole.js";
import { runRetention, RETENTION } from "../server/zasebnost.js";

test("naročila šol: povpraševanje brez pogodbe in sklenjeno naročilo se izbrišeta po svojem roku", () => {
  const { db } = openDb(":memory:");
  migrateSchoolOrders(db);
  const ins = db.prepare(
    `INSERT INTO school_orders (school_name, address, registration_no, tax_id, contact_name, email, plan, students, price_eur, start_date, consent_text, consent_at, status, updated_at, school_id)
     VALUES ('OŠ', 'Ulica 1', '1234567', '12345678', 'Kontakt', ?, 'class', 20, 10, '2026-09-01', 'da', '2020-01-01', ?, ?, ?)`,
  );
  const old = "2020-01-01 00:00:00";
  const recent = new Date(Date.now() - 400 * 86400000).toISOString().replace("T", " ").slice(0, 19); // ~13 mesecev
  ins.run("lost-star@x.si", "lost", old, null);
  ins.run("novo@x.si", "contacted", recent, null);
  ins.run("won-star@x.si", "won", old, null);
  ins.run("licenca@x.si", "offer_sent", recent, 7); // šola že ima licenco iz naročila
  const saved = [RETENTION.schoolOrderOpenDays, RETENTION.schoolOrderWonDays];
  RETENTION.schoolOrderOpenDays = 730;
  RETENTION.schoolOrderWonDays = 3653;
  try {
    const out = runRetention(db, { log: {} });
    assert.equal(out.schoolOrders, 1);
    const left = db.prepare("SELECT email FROM school_orders ORDER BY email").all().map((r) => r.email);
    assert.deepEqual(left, ["licenca@x.si", "novo@x.si", "won-star@x.si"]);
    RETENTION.schoolOrderWonDays = 365;
    assert.equal(runRetention(db, { log: {} }).schoolOrders, 2, "sklenjena po svojem roku (tudi z licenco)");
  } finally {
    [RETENTION.schoolOrderOpenDays, RETENTION.schoolOrderWonDays] = saved;
  }
});

test("roka hrambe naročil šol sta določena (čaka j)", { todo: RETENTION.schoolOrderOpenDays == null || RETENTION.schoolOrderWonDays == null ? "j izbere roka (N3)" : false }, () => {
  assert.ok(RETENTION.schoolOrderOpenDays > 0 && RETENTION.schoolOrderWonDays > 0);
});

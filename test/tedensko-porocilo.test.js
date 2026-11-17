// Tedensko poročilo staršem: iste številke na ploščicah, v stolpcih po dnevih, pri temah in v »Še vaditi«,
// dnevi po slovenskem času (server/accounts/weekly.js).
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import * as weekly from "../server/accounts/weekly.js";

const X = "MAT-OS-6/zapis-in-urejanje-velikih-stevil";
const Y = "MAT-OS-6/deljivost";
const opts = { appUrl: "https://example.invalid/", unsubscribeUrl: "https://example.invalid/u" };

function fixture() {
  const store = openDb(":memory:");
  const s = store.createStudent("Zala", { educational_track: "OSNOVNA_SOLA", curriculum_level: "6. razred", subject: "MAT" });
  const ins = store.db.prepare(
    "INSERT INTO tasks (student_id, topic_id, level, payload, attempts, solved, first_try_correct, created_at) VALUES (?, ?, 1, '{}', ?, ?, ?, ?)",
  );
  // task.run(tema, poskusi, rešena, prav v prvem poskusu, created_at v UTC)
  const task = { run: (...a) => ins.run(s.id, ...a) };
  const ask = (at) => {
    const c = store.createConversation(s.id);
    store.addMessage(c.id ?? c, "user", '"?"', "?");
    store.db.prepare("UPDATE messages SET created_at = ? WHERE id = (SELECT MAX(id) FROM messages)").run(at);
  };
  return { store, s, task, ask, report: (now) => weekly.buildWeeklyReport(store.db, { name: "" }, [store.getStudent(s.id)], { ...opts, now }) };
}
// Besedilo brez oznak HTML in s presledki namesto &nbsp;.
const text = (html) => html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ");

test("en teden, ena osnova: stolpci = ploščica, tema »4 naloge, 1 rešena« ob »0 od 4 pravilno«", () => {
  const { task, ask, report } = fixture();
  const now = Date.parse("2026-11-15T18:00:00Z"); // nedelja 19.00 v Ljubljani
  // Sobota: 8 rešenih nalog iz X (7 prav v prvem poskusu) in eno vprašanje inštruktorju.
  for (let i = 0; i < 8; i++) task.run(X, 1, 1, i < 7 ? 1 : 0, "2026-11-14 10:00:00");
  ask("2026-11-14 10:05:00");
  // Petek: 4 naloge iz Y, rešena ena, nobena prav v prvem poskusu.
  for (const solved of [1, 0, 0, 0]) task.run(Y, 2, solved, 0, "2026-11-13 15:00:00");
  // Naloga, ki je ni začel (attempts = 0), ne šteje nikjer.
  task.run(Y, 0, 0, null, "2026-11-13 15:00:00");

  const r = report(now);
  const w = r.children[0];
  assert.equal(w.tasks, 12);
  assert.equal(w.solved, 9);
  assert.equal(w.questions, 1);
  // Stolpci po dnevih seštejejo isto kot ploščica (prej 9 v soboto ob 8 na ploščici).
  assert.deepEqual(w.strip.map((d) => d.tasks), [0, 0, 0, 0, 4, 8, 0]);
  assert.equal(w.strip.reduce((n, d) => n + d.tasks, 0), w.tasks);
  assert.equal(w.strip[5].label, "so");
  // Odstotek na ploščici ima isto osnovo kot pasovi tem: 7 od 12, ne 7 od 9 rešenih.
  assert.equal(w.accuracy, 58);
  const topics = w.subjects.flatMap((s) => s.practice);
  const sum = (k) => topics.reduce((n, t) => n + t[k], 0);
  assert.equal(sum("tried"), w.tasks);
  assert.equal(Math.round((sum("first_ok") / sum("judged")) * 100), w.accuracy);

  const t = text(r.html);
  assert.match(t, /12 nalog, 9 rešenih/); // ploščica: število + oznaka
  assert.match(t, /58 % prav v prvem poskusu/);
  assert.match(t, /Deljivost 4 naloge, 1 rešena 0 %/);
  assert.match(t, /Zapis in urejanje velikih števil 8 nalog, 8 rešenih 88 %/);
  assert.match(t, /Še vaditi: Deljivost \(0 od 4 pravilno v prvem poskusu\)/);
  // Stolpec v soboto kaže 8 (naloge), ne 9 (naloge + vprašanje).
  assert.match(r.html, /line-height:14px">8<\/div>/);
  assert.doesNotMatch(r.html, /line-height:14px">9<\/div>/);
  assert.match(t, /naloge na dan/);
  assert.doesNotMatch(t, /rešene naloge/);
  assert.match(r.subject, /^Zala ta teden: 2 dneva vaje, 12 nalog$/);
  assert.match(r.text, /Naloge: 12, od tega 9 rešenih \(prejšnji teden 0\); prav v prvem poskusu: 58 %; vprašanja inštruktorju: 1\./);
});

test("dnevi po slovenskem času: 0.30 je že naslednji dan, tudi poleti", () => {
  const { task, ask, store, s, report } = fixture();
  const now = Date.parse("2026-11-15T18:00:00Z"); // nedelja; teden = pon 9. – ned 15. 11.
  task.run(X, 1, 1, 1, "2026-11-10 23:30:00"); // sreda 0.30
  task.run(X, 1, 1, 1, "2026-11-08 23:30:00"); // ponedeljek 9. 11. ob 0.30: prvi dan tedna
  task.run(X, 1, 1, 1, "2026-11-08 22:30:00"); // nedelja 8. 11. ob 23.30: prejšnji teden
  ask("2026-11-14 23:15:00"); // nedelja 15. 11. ob 0.15
  store.db.prepare("INSERT INTO topic_state (student_id, topic_id, status, mastered_at) VALUES (?, ?, 'mastered', ?)").run(s.id, Y, "2026-11-08 23:10:00");
  const w = report(now).children[0];
  assert.deepEqual(w.strip.map((d) => d.label), ["po", "to", "sr", "če", "pe", "so", "ne"]);
  assert.deepEqual(w.strip.map((d) => d.tasks), [1, 0, 1, 0, 0, 0, 0]);
  assert.equal(w.tasks, 2);
  assert.equal(w.prev_tasks, 1);
  assert.equal(w.questions, 1);
  assert.equal(w.strip[6].active, false); // vprašanje ni naloga in ne dejavnost iz tabel nalog/XP
  assert.deepEqual(w.mastered, ["Deljivost"]);
  assert.equal(w.active_days, 2);
  assert.equal(w.prev_active_days, 1);

  // Poleti (CEST): sreda 8. 7. ob 0.30 po slovensko.
  const summer = fixture();
  summer.task.run(X, 1, 1, 1, "2026-07-07 22:30:00");
  const ws = summer.report(Date.parse("2026-07-12T18:00:00Z")).children[0];
  assert.deepEqual(ws.strip.map((d) => d.tasks), [0, 0, 1, 0, 0, 0, 0]);

  const { ljDay } = weekly;
  assert.equal(ljDay("2026-11-10 23:30:00"), "2026-11-11"); // CET (+1)
  assert.equal(ljDay("2026-11-10 22:59:59"), "2026-11-10");
  assert.equal(ljDay("2026-07-07 22:30:00"), "2026-07-08"); // CEST (+2)
  assert.equal(ljDay("2026-07-07 21:59:00"), "2026-07-07");
  assert.equal(ljDay("2026-11-10T23:30:00.000Z"), "2026-11-11");
  assert.equal(ljDay("ni datum"), "");
});

// Točka 47 izboljšav: /zakaj-evklid javno pokaže, koliko napak so učenci prijavili in koliko jih je rešenih
// (samo števila; skrbnikove prijave iz klepeta ne štejejo).
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { ensureReportsTable } from "../server/reports.js";
import { reportStats, reportStatsHtml } from "../server/vidnost.js";

test("reportStatsHtml: slovenske oblike in brez prijav", () => {
  assert.equal(reportStatsHtml(null), "");
  assert.match(reportStatsHtml({ total: 0, fixed: 0 }), /Prijav doslej še ni bilo/);
  assert.match(reportStatsHtml({ total: 1, fixed: 0 }), /<b>1 prijava<\/b>, od tega še nobena ni rešena\./);
  assert.match(reportStatsHtml({ total: 2, fixed: 1 }), /<b>2 prijavi<\/b>, od tega je <b>1<\/b> že rešena\./);
  assert.match(reportStatsHtml({ total: 3, fixed: 2 }), /<b>3 prijave<\/b>, od tega sta <b>2<\/b> že rešeni\./);
  assert.match(reportStatsHtml({ total: 5, fixed: 3 }), /<b>5 prijav<\/b>, od tega so <b>3<\/b> že rešene\./);
  assert.match(reportStatsHtml({ total: 102, fixed: 101 }), /<b>102 prijavi<\/b>, od tega je <b>101<\/b> že rešena\./);
  assert.match(reportStatsHtml({ total: 105, fixed: 5 }), /<b>105 prijav<\/b>, od tega jih je <b>5<\/b> že rešenih\./);
});

test("/zakaj-evklid: števec iz baze, brez prijav skrbnika in brez besedil prijav", async () => {
  const store = openDb(":memory:");
  ensureReportsTable(store.db);
  const db = store.db;
  assert.deepEqual(reportStats(db), { total: 0, fixed: 0 });
  db.prepare("INSERT INTO message_reports (message_id, reason, answer, status) VALUES (1, 'wrong', 'Skrivnost 42', 'fixed')").run();
  db.prepare("INSERT INTO message_reports (message_id, reason, answer) VALUES (2, 'wrong', 'x')").run();
  db.prepare("INSERT INTO bug_reports (kind, topic_id, reason, status) VALUES ('lesson', 't1', 'wrong', 'fixed')").run();
  db.prepare("INSERT INTO bug_reports (kind, reason, status) VALUES ('app', 'x', 'fixed')").run();
  assert.deepEqual(reportStats(db), { total: 3, fixed: 2 });
  const server = createApp(store, { scheduler: false, log: { error() {} } }).listen(0);
  try {
    const html = await (await fetch(`http://127.0.0.1:${server.address().port}/zakaj-evklid`)).text();
    assert.match(html, /<h2 id="h-prijave">Prijavljene napake<\/h2>/);
    assert.match(html, /<b>3 prijave<\/b>, od tega sta <b>2<\/b> že rešeni\./);
    assert.ok(!html.includes("<!--prijave-->") && !html.includes("Skrivnost 42"));
  } finally {
    server.close();
  }
});

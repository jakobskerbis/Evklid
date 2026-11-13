// Cilj z datumom (nastavitve, prompt, opomnik ob 12.00) in klikljive formule (slovar, označevanje TeX).
import test from "node:test";
import assert from "node:assert/strict";
import katex from "katex";
import { normalizeSettings } from "../server/settings.js";
import { buildSystemPrompt } from "../server/prompt.js";
import { openDb } from "../server/db.js";
import { goalsFor, daysUntil, goalPrompt } from "../public/goal-data.js";
import { annotateTex, lookupSymbol, lookupUnit, SYMBOLS, UNITS } from "../public/formula-data.js";
import { buildGoalReminder, reminderDays, ljNow, isNoonTime } from "../server/accounts/goal-reminder.js";

test("goal settings: valid per school, date optional and deletable, reminder on by default", () => {
  const ss = normalizeSettings({ educational_track: "SREDNJA_SOLA", curriculum_level: "4. letnik", goal: "matura", goal_date: "2027-06-01" });
  assert.equal(ss.goal, "matura");
  assert.equal(ss.goal_date, "2027-06-01");
  assert.equal(ss.goal_reminder, true);
  // NPZ ni cilj v srednji šoli; neveljaven datum se ne shrani.
  assert.equal(normalizeSettings({ educational_track: "SREDNJA_SOLA", goal: "npz" }).goal, "sprotno");
  assert.equal(normalizeSettings({ goal_date: "1. 6. 2027" }).goal_date, "");
  assert.equal(normalizeSettings({ goal_reminder: false }).goal_reminder, false);
  assert.deepEqual(goalsFor({ educational_track: "UNIVERZA" }), ["sprotno", "izpit"]);
  assert.ok(goalsFor({ educational_track: "OSNOVNA_SOLA", school_system: "SI" }).includes("npz"));

  const store = openDb(":memory:");
  const s = store.createStudent("Ana", { educational_track: "SREDNJA_SOLA", curriculum_level: "4. letnik", goal: "matura", goal_date: "2027-06-01" });
  assert.equal(store.updateStudent(s.id, { settings: { subject: "FIZ" } }).settings.goal_date, "2027-06-01"); // ostane
  assert.equal(store.updateStudent(s.id, { settings: { goal_date: "" } }).settings.goal_date, ""); // Izbriši datum
});

test("goal: countdown, prompt line and daily reminder until the goal day", () => {
  assert.equal(daysUntil("2027-06-01", "2026-10-29"), 215);
  assert.equal(daysUntil("", "2026-10-29"), null);
  assert.match(goalPrompt({ goal: "matura", goal_date: "2027-06-01" }, "2026-10-29"), /matura \(1\. 6\. 2027, še 215 dni\)/);
  assert.equal(goalPrompt({ goal: "sprotno", goal_date: "" }), "");
  const prompt = buildSystemPrompt({ settings: normalizeSettings({ educational_track: "SREDNJA_SOLA", goal: "matura", goal_date: "2099-06-01" }) });
  assert.match(prompt, /cilj učenca: matura/);

  const child = { id: 1, name: "Zala", settings: { goal: "npz", goal_date: "2027-05-06", goal_reminder: true } };
  assert.equal(reminderDays(child, "2027-05-05"), 1);
  assert.equal(reminderDays(child, "2027-05-06"), 0);
  assert.equal(reminderDays(child, "2027-05-07"), null); // po dnevu cilja ni več opomnikov
  assert.equal(reminderDays({ ...child, settings: { ...child.settings, goal_reminder: false } }, "2027-05-05"), null);
  const mail = buildGoalReminder(child, 1, { appUrl: "http://x/" });
  assert.match(mail.subject, /NPZ: še 1 dan · Zala/);
  // 11.30 UTC = 12.30 v Ljubljani pozimi
  assert.equal(isNoonTime(new Date("2026-12-01T11:30:00Z")), true);
  assert.equal(isNoonTime(new Date("2026-12-01T10:30:00Z")), false);
  assert.equal(ljNow(new Date("2026-12-31T23:30:00Z")).date, "2027-01-01");
});

test("goal reminder e-mail goes once per child per day", async () => {
  const { mountAccounts } = await import("../server/accounts/index.js");
  const express = (await import("express")).default;
  const store = openDb(":memory:");
  const api = mountAccounts(express(), store, { accounts: true, scheduler: false, log: { error() {} } });
  store.db.prepare("INSERT INTO parents (email, password_hash, privacy_version, unsubscribe_token, referral_code, email_verified_at) VALUES ('i@p.si', 'x', 'v', 't', 'C1', '2026-01-01')").run();
  const far = `${new Date().getFullYear() + 1}-06-01`;
  const a = store.createStudent("Ivo", { goal: "tekmovanje", goal_date: far });
  const b = store.createStudent("Eva", { goal: "tekmovanje", goal_date: far, goal_reminder: false });
  store.db.prepare("UPDATE students SET parent_id = 1 WHERE id IN (?, ?)").run(a.id, b.id);
  assert.equal(await api.sendGoalRemindersAll(), 1);
  assert.equal(await api.sendGoalRemindersAll(), 0);
});

test("formula symbols: subject meanings, units after numbers, no chemistry formulas or subscripts", () => {
  assert.equal(lookupSymbol("M", "KEM").n, "molska masa");
  assert.equal(lookupSymbol("M", "KEM").r, "M = \\frac{m}{n}");
  assert.equal(lookupSymbol("a", "FIZ").n, "pospešek");
  assert.equal(lookupSymbol("a", "MAT", "x^2"), null); // brez kvadratne enačbe a ni koeficient
  assert.equal(lookupSymbol("a", "MAT", "a x^2 + b x + c = 0").n, "vodilni koeficient (pri x²)");
  assert.equal(lookupSymbol("p", "FIZ", "p = m\\,v").n, "gibalna količina");
  assert.equal(lookupSymbol("p", "FIZ", "p = F/S").n, "tlak");
  assert.equal(lookupUnit("g/mol").n, "gram na mol");
  assert.equal(lookupUnit("km").n, "kilometer");
  assert.match(lookupUnit("mA").c, /10\^\{-3\}/);

  const kem = annotateTex("m = n \\cdot M = 0{,}125\\,\\mathrm{mol} \\cdot 58{,}44\\,\\mathrm{g/mol}", "KEM");
  assert.match(kem, /\\htmlData\{fx=s\.3AKEM\.3AM\}\{M\}/);
  assert.match(kem, /\\htmlData\{fx=u\.3Ag\.2Fmol\}\{\\mathrm\{g\/mol\}\}/);
  // Kemijska formula (brez števila pred njo) ni enota; indeks ni simbol.
  assert.doesNotMatch(annotateTex("\\mathrm{H_2O} + \\mathrm{CO_2}", "KEM"), /htmlData/);
  const fiz = annotateTex("F_{rez} = m\\,a", "FIZ");
  assert.match(fiz, /fx=s\.3AFIZ\.3AF_rez\}\{F_\{rez\}\}/);
  assert.doesNotMatch(annotateTex("v_{povp}", "FIZ"), /fx=s\.3AFIZ\.3Ap/); // p v indeksu ni tlak

  // Vsak označen izraz se izriše brez napake in z data-fx.
  const opts = { throwOnError: true, strict: "ignore", trust: (c) => c.command === "\\htmlData" };
  for (const [subj, tex] of [["KEM", kem], ["FIZ", fiz], ["MAT", annotateTex("x_{1,2} = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}", "MAT")], ["FIZ", annotateTex("R = 10\\,\\Omega,\\ \\Delta t = 2\\,\\mathrm{s}", "FIZ")]]) {
    const html = katex.renderToString(tex, opts);
    assert.match(html, /data-fx="/, subj);
  }
  // Slovar: vsak vnos ima ime v sl in en, enote obstajajo.
  for (const [subj, table] of Object.entries(SYMBOLS))
    for (const [k, v] of Object.entries(table))
      for (const e of [].concat(v)) {
        assert.ok(e.n && e.en, `${subj} ${k}`);
        if (e.u) assert.ok(lookupUnit(e.u), `${subj} ${k} enota ${e.u}`);
        if (e.r) katex.renderToString(e.r, { throwOnError: true, strict: "ignore" });
      }
  for (const [k, u] of Object.entries(UNITS)) {
    assert.ok(u.n && u.en, k);
    if (u.c) katex.renderToString(u.c, { throwOnError: true, strict: "ignore" });
  }
});

// Začetna stran po stopnji (public/zacetna.js): vrstni red kartic in kartica stopnje.
import test from "node:test";
import assert from "node:assert/strict";
import { vrstniRed, VRSTNI_RED, uvrstiKartice, izpitnoObdobje, izpitniRoki, stageCardHtml } from "../public/zacetna.js";

import SL from "../public/i18n/sl.js";

// Slovenska besedila brez brskalnika (public/i18n.js potrebuje document).
const t = (k, p = {}) => {
  let v = SL[k] ?? k;
  if (typeof v === "object") v = v.other;
  return v.replace(/\{(\w+)\}/g, (_, x) => p[x] ?? "");
};
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

test("vrstni red kartic po stopnji; SŠ da Urnik na vrh samo ob testu v 14 dneh", () => {
  assert.equal(vrstniRed("OS")[0], "xp-card");
  assert.equal(vrstniRed("FAKS")[0], "stage-card");
  assert.deepEqual(vrstniRed("SS", null), VRSTNI_RED.SS);
  assert.deepEqual(vrstniRed("SS", { upcoming: [{ kind: "test", daysLeft: 3 }] }), VRSTNI_RED.SS_TEST);
  assert.deepEqual(vrstniRed("SS", { upcoming: [{ kind: "test", daysLeft: 20 }] }), VRSTNI_RED.SS);
  assert.deepEqual(vrstniRed("SS", { upcoming: [{ kind: "naloga", daysLeft: 1 }] }), VRSTNI_RED.SS);
  assert.deepEqual(vrstniRed("???"), VRSTNI_RED.OS);
  // Vsaka stopnja ima iste tri kartice (nič se ne skrije, le vrstni red).
  for (const order of Object.values(VRSTNI_RED)) assert.deepEqual([...order].sort(), ["schedule-card", "stage-card", "xp-card"]);
});

test("uvrstiKartice premakne kartice pred izbiro načina, ostale pusti nad njimi", () => {
  // Najmanjši nadomestek za DOM: seznam otrok z insertBefore.
  const kids = ["goal-line", "level-card", "xp-card", "schedule-card", "stage-card", "modebar"].map((id) => ({ id }));
  const side = {
    querySelector: (sel) => kids.find((k) => `#${k.id}` === sel) || null,
    insertBefore(el, anchor) {
      kids.splice(kids.indexOf(el), 1);
      kids.splice(kids.indexOf(anchor), 0, el);
    },
  };
  for (const k of kids) k.parentElement = side;
  uvrstiKartice(side, VRSTNI_RED.FAKS);
  assert.deepEqual(kids.map((k) => k.id), ["goal-line", "level-card", "stage-card", "schedule-card", "xp-card", "modebar"]);
  uvrstiKartice(side, VRSTNI_RED.OS);
  assert.deepEqual(kids.map((k) => k.id), ["goal-line", "level-card", "xp-card", "stage-card", "schedule-card", "modebar"]);
  uvrstiKartice(null, VRSTNI_RED.OS); // brez pogleda ne pade
});

test("izpitno obdobje in izpitni roki iz Urnika", () => {
  assert.equal(izpitnoObdobje(10), "winter"); // november
  assert.equal(izpitnoObdobje(0), "winter");
  assert.equal(izpitnoObdobje(4), "summer"); // maj
  assert.equal(izpitnoObdobje(7), "autumn"); // avgust
  const sch = { upcoming: [{ kind: "test", name: "T", daysLeft: 1 }, { kind: "kolokvij", name: "Analiza 1", daysLeft: 4 }, { kind: "izpit", name: "Fizika", daysLeft: 30 }, { kind: "ustno", name: "Kemija", daysLeft: 40 }, { kind: "izpit", name: "Linearna algebra", daysLeft: 50 }] };
  assert.deepEqual(izpitniRoki(sch).map((e) => e.name), ["Analiza 1", "Fizika", "Kemija"]);
  assert.deepEqual(izpitniRoki(null), []);
});

test("kartica stopnje: OŠ igre (razen skritih), SŠ matura (samo slovenski sistem), faks Moj študij in roki", () => {
  assert.match(stageCardHtml("OS", { games: true, t, esc }), /data-home-go="games"/);
  assert.equal(stageCardHtml("OS", { games: false, t, esc }), "");
  assert.match(stageCardHtml("SS", { exams: true, t, esc }), /data-home-go="exams"/);
  assert.equal(stageCardHtml("SS", { exams: false, t, esc }), "");
  const empty = stageCardHtml("FAKS", { schedule: { upcoming: [] }, t, esc, now: new Date(2026, 10, 4) });
  assert.match(empty, /data-home-go="textbook"/);
  assert.match(empty, /Zimsko izpitno obdobje/);
  assert.match(empty, /Vpiši roke/);
  const full = stageCardHtml("FAKS", { schedule: { upcoming: [{ kind: "kolokvij", name: "Analiza <1>", daysLeft: 2 }] }, t, esc });
  assert.match(full, /Analiza &#60;1&#62;/, "ime roka je ubežano");
  assert.match(full, /čez 2 dni/);
  assert.doesNotMatch(full, /Vpiši roke/);
});

// Začetna stran po stopnji (public/zacetna.js): vrstni red kartic in kartica stopnje.
import test from "node:test";
import assert from "node:assert/strict";
import { vrstniRed, VRSTNI_RED, uvrstiKartice, izpitnoObdobje, izpitniRoki, stageCardHtml, stageRows, xpCardHtml, maturaPonudbaHtml } from "../public/zacetna.js";

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
  for (const k of kids) {
    k.parentElement = side;
    Object.defineProperty(k, "nextElementSibling", { get: () => kids[kids.indexOf(k) + 1] || null });
  }
  uvrstiKartice(side, VRSTNI_RED.FAKS);
  assert.deepEqual(kids.map((k) => k.id), ["goal-line", "level-card", "stage-card", "schedule-card", "xp-card", "modebar"]);
  uvrstiKartice(side, VRSTNI_RED.OS);
  assert.deepEqual(kids.map((k) => k.id), ["goal-line", "level-card", "xp-card", "stage-card", "schedule-card", "modebar"]);
  uvrstiKartice(null, VRSTNI_RED.OS); // brez pogleda ne pade
  // Bližnjice cilja tik nad izbiro načina ostanejo tam (kartice gredo nadnje).
  kids.splice(kids.findIndex((k) => k.id === "modebar"), 0, { id: "goal-modes", parentElement: side });
  Object.defineProperty(kids.find((k) => k.id === "goal-modes"), "nextElementSibling", { get: () => kids[kids.findIndex((k) => k.id === "goal-modes") + 1] || null });
  uvrstiKartice(side, VRSTNI_RED.FAKS);
  assert.deepEqual(kids.map((k) => k.id).slice(-5), ["stage-card", "schedule-card", "xp-card", "goal-modes", "modebar"]);
});

test("uvrstiKartice: mnenje in namestitev tik pod današnjim treningom, nikoli nad njim", () => {
  const kids = ["goal-line", "feedback-card", "install-card", "xp-card", "schedule-card", "stage-card", "modebar"].map((id) => ({ id }));
  const side = {
    querySelector: (sel) => kids.find((k) => `#${k.id}` === sel) || null,
    insertBefore(el, anchor) {
      kids.splice(kids.indexOf(el), 1);
      kids.splice(anchor ? kids.indexOf(anchor) : kids.length, 0, el);
    },
  };
  for (const k of kids) {
    k.parentElement = side;
    Object.defineProperty(k, "nextElementSibling", { get: () => kids[kids.indexOf(k) + 1] || null });
  }
  uvrstiKartice(side, VRSTNI_RED.SS);
  assert.deepEqual(kids.map((k) => k.id), ["goal-line", "xp-card", "feedback-card", "install-card", "schedule-card", "stage-card", "modebar"]);
  uvrstiKartice(side, VRSTNI_RED.SS_TEST);
  assert.deepEqual(kids.map((k) => k.id), ["goal-line", "schedule-card", "stage-card", "xp-card", "feedback-card", "install-card", "modebar"]);
});

test("stageRows: kar odpre kartica stopnje, bližnjice cilja ne ponovijo", () => {
  assert.deepEqual(stageRows("OS", { games: true }), ["games"]);
  assert.deepEqual(stageRows("OS", { games: false }), []);
  assert.deepEqual(stageRows("SS", { exams: true }), ["exams"]);
  assert.deepEqual(stageRows("SS", { exams: false }), []);
  assert.deepEqual(stageRows("FAKS"), ["textbook"]);
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

test("kartica na vrhu Učne poti (skupna app.js in strežniku): Današnji trening, pri cilju matura »Danes«", () => {
  const xp = { total: 0, today: 0, goal: 50, week: 0, streak: 0 };
  const p = { next: { id: "t1", name: "Ulomki <1>" }, xp };
  const plain = xpCardHtml(t, { p, done: false, scan: true, games: false });
  assert.match(plain, /class="hero">[^]*data-daily/);
  assert.match(plain, /data-open="t1"[^]*Ulomki &lt;1&gt;/);
  assert.doesNotMatch(plain, /hero danes|data-danes/);
  // Brez koraka za danes (nič na vrsti, ni šibke teme) ostane Današnji trening.
  assert.equal(xpCardHtml(t, { p: { ...p, danes: { due: 0, review: 0, next: null, minutes: 15, odsoten: 0 } }, done: false, scan: true, games: false }), plain);
  const leto = new Date().getFullYear() + 1;
  const danes = xpCardHtml(t, { p: { ...p, danes: { due: 2, review: 6, next: { id: "t9", name: "Funkcije" }, minutes: 9, odsoten: 4 } }, done: false, scan: true, games: true, goalDate: `${leto}-05-29` });
  assert.match(danes, /class="hero danes"[^]*data-danes-review/);
  assert.match(danes, /Matura · še \d+ dni/);
  assert.match(danes, /class="danes-back"/, "po vsaj 3 dneh odsotnosti pozdrav");
  assert.match(danes, /data-scan-home[^]*class="next-row" data-daily[^]*data-dnevna[^]*xp-stats/, "Današnji trening kot vrstica pod skenerjem");
  assert.doesNotMatch(danes, /data-open="t1"/);
  const tema = xpCardHtml(t, { p: { ...p, danes: { due: 0, review: 0, next: { id: "t9", name: "Funkcije" }, minutes: 15, odsoten: 0 } }, done: true, scan: false, games: false });
  assert.match(tema, /data-danes-topic="t9"/);
  assert.doesNotMatch(tema, /danes-back|data-danes-review/);
});

test("ponudba »cilj matura«: samo star profil maturanta brez cilja in brez odločitve", () => {
  const m = { school_system: "SI", educational_track: "SREDNJA_SOLA", subject: "MAT", curriculum_level: "4. letnik OR" };
  assert.match(maturaPonudbaHtml(t, m), /data-matura-offer="yes"[^]*data-matura-offer="no"/);
  assert.equal(maturaPonudbaHtml(t, { ...m, matura_offer: 1 }), "");
  assert.equal(maturaPonudbaHtml(t, { ...m, goal: "matura", goal_date: "2027-05-29" }), "");
  assert.equal(maturaPonudbaHtml(t, { ...m, curriculum_level: "3. letnik" }), "");
});

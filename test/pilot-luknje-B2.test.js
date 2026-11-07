// Pregledovalec B, drugi krog PR #477 (6cb165c5). Zagon iz worktree z vsebino 6cb165c5 (glej poročilo).
import test from "node:test";
import assert from "node:assert/strict";
import { withAccounts } from "./racuni-pomoc.js";
import { pilotEndMs } from "../server/accounts/pilot-meja.js";
import { guaranteeUsd, subscriptionCeiling, detailedShare, explanationsFor, planGuarantee, planByKey } from "../server/accounts/plans.js";

const DAY = 86400000;
const dayIso = (d) => new Date(Date.now() + d * DAY).toISOString().slice(0, 10);
const YEAR = new Date().getFullYear();
const cap = (l) => subscriptionCeiling(guaranteeUsd(l));

async function ask(call, kidId) {
  const conv = (await call(`/api/students/${kidId}/conversations`, { method: "POST" })).body;
  return (await call(`/api/conversations/${conv.id}/messages`, { method: "POST", body: { text: "v" } })).status;
}
const spend = (store, kidId, usd) => {
  const pid = store.db.prepare("SELECT parent_id FROM students WHERE id = ?").get(kidId).parent_id;
  store.db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd, parent_id) VALUES (?, 'claude-haiku-5-5', 'chat', ?, ?)").run(kidId, usd, pid);
};
const ENV = { EVKLID_PILOT_EMAILS: "meja@x.si", EVKLID_PILOT_DO: dayIso(10) };

// C1: zaklep stopnje (B2) obide izbris profila in nov profil FAKS v istem mesecu. V produkciji id profila ni ponovno
// uporabljen (drugi uporabniki imajo višje id), zato se ustvari nov ključ pilot_stopnja_* z novo stopnjo.
test("C1 zaklep stopnje: izbris profila + nov profil FAKS sredi meseca ne dvigne meje", async () => {
  await withAccounts(ENV, async ({ call, store, kid }) => {
    spend(store, kid.id, cap("OS") + 0.3);
    assert.equal(await ask(call, kid.id), 429, "OŠ porabljena");
    store.createStudent("Tuj"); // profil drugega uporabnika: višji id
    assert.equal((await call(`/api/students/${kid.id}`, { method: "DELETE" })).status, 200);
    const k2 = (await call("/api/students", { method: "POST", body: { name: "Lan", birth_year: YEAR - 20, consent: true, settings: { educational_track: "UNIVERZA" } } })).body;
    assert.ok(k2.id > kid.id, JSON.stringify(k2));
    const m = (await call(`/api/students/${k2.id}/usage`)).body;
    assert.equal(m.explanations_month, explanationsFor(detailedShare(cap("OS"))), "stopnja ostane OŠ do naslednjega meseca: " + JSON.stringify(m));
    assert.equal(await ask(call, k2.id), 429, "še vedno ustavljen");
  });
});

// C2: pilot z Družino v preizkusni dobi pri Stripu (trialing, brez plačila): vsak od 4 profilov dobi svojo mejo paketa
// ENE stopnje; plačana Družina ima en skupen delež. Pilot tako dobi več kot plačani paket.
test("C2 pilot z več sedeži: skupaj ne več kot plačana Družina", async () => {
  await withAccounts(ENV, async ({ call, store, kid, app }) => {
    store.db.prepare("UPDATE parents SET sub_plan = 'evklid_druzina_student_month', sub_status = 'trialing', sub_seats = 4, sub_id = 'sub_x', sub_period_end = ?").run(new Date(Date.now() + 7 * DAY).toISOString());
    const ids = [kid.id];
    for (const n of ["Eva", "Bor", "Cene"]) {
      const r = await call("/api/students", { method: "POST", body: { name: n, birth_year: YEAR - 20, consent: true, settings: { educational_track: "UNIVERZA" } } });
      assert.equal(r.status, 201, JSON.stringify(r.body));
      ids.push(r.body.id);
    }
    const months = [];
    for (const id of ids) months.push((await call(`/api/students/${id}/usage`)).body);
    assert.ok(months.every((m) => m.guaranteed), JSON.stringify(months));
    const fam = planGuarantee(planByKey("evklid_druzina_student_month"));
    // Popravek (j 19:0x): skupen delež Družine – vsak profil kaže isti skupni delež (kot plačana Družina), ne vsote.
    for (const m of months) {
      assert.equal(m.pool, true, JSON.stringify(m));
      assert.equal(m.explanations_month, explanationsFor(detailedShare(fam.usd)), `pilot = plačana Družina s študentom (${JSON.stringify(fam)})`);
    }
    // Poraba enega profila porabi skupni delež: nad mejo Družine so ustavljeni vsi profili.
    spend(store, ids[0], fam.total + 0.3);
    for (const id of ids) assert.equal(await ask(call, id), 429, `profil ${id} nad skupno mejo`);
  });
});

// C3: konec pilota ob prehodih poletnega časa (kontrola, mora uspeti).
test("C3 konec pilota: polnoč v Ljubljani tudi ob prehodih ure", () => {
  const now = Date.parse("2026-11-06T12:00:00Z");
  const cases = { "2026-12-15": "2026-12-15T23:00:00.000Z", "2027-03-27": "2027-03-27T23:00:00.000Z", "2027-03-28": "2027-03-28T22:00:00.000Z", "2027-06-30": "2027-06-30T22:00:00.000Z", "2027-10-30": "2027-10-30T22:00:00.000Z", "2027-10-31": "2027-10-31T23:00:00.000Z" };
  for (const [d, iso] of Object.entries(cases)) assert.equal(new Date(pilotEndMs({ EVKLID_PILOT_DO: d }, now)).toISOString(), iso, d);
  assert.equal(pilotEndMs({ EVKLID_PILOT_DO: "2028-01-01" }, now), pilotEndMs({}, now), "več kot leto naprej → privzeto");
  assert.equal(pilotEndMs({ EVKLID_PILOT_DO: "2026-11-31" }, now), pilotEndMs({}, now));
});

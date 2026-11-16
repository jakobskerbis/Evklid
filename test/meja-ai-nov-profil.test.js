// Pilot, popravek po koraku 3 (j 2026-11-15): ko račun med klici AI doda ali izbriše profil, se ključ skupne meje
// spremeni (s:<id> → pool:<id,id> in nazaj). Rezervacije klicev, ki so se začeli pod starim ključem, morajo še naprej
// šteti, sicer račun med napadom dobi celo mejo prostora znova (prej: pilot 2,00 $ pri meji 1,90 $). Zato zajamčeni
// paket šteje klice v teku pod ključem računa g:<račun> (server/usage.js inflightOf).
import test from "node:test";
import assert from "node:assert/strict";
import { withAccounts } from "./racuni-pomoc.js";
import { Usage } from "../server/usage.js";

const DAY = 86400000;
const dayIso = (days) => new Date(Date.now() + days * DAY).toISOString().slice(0, 10);
const PILOT = { EVKLID_PILOT_EMAILS: "meja@x.si", EVKLID_PILOT_DO: dayIso(20) };
const YEAR = new Date().getFullYear();

// Poraba do »prostor = room $« pod najtesnejšo mejo profila.
function spendTo(app, store, kidId, room) {
  const { cap } = app.locals.usage.tightest(kidId);
  const pid = store.db.prepare("SELECT parent_id FROM students WHERE id = ?").get(kidId).parent_id;
  const need = cap.usd - (cap.spent || 0) - room;
  if (need > 0) store.db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd, parent_id) VALUES (?, 'claude-haiku-4-5', 'chat', ?, ?)").run(kidId, need, pid);
}

// Rezervacije do konca prostora (klici v teku): vrne rezervacije, ki jih je treba na koncu sprostiti.
function zapolni(usage, kidId, korak = 0.01, najvec = Infinity) {
  const holds = [];
  for (let h; holds.length < najvec && (h = usage.guard(kidId, korak)); ) holds.push(h);
  assert.ok(holds.length >= Math.min(5, najvec), `premalo prostora za preizkus: ${holds.length}`);
  return holds;
}

test("meja AI: nov profil med klici v teku ne ponastavi števca rezervacij (pilot)", { timeout: 30_000 }, async () => {
  await withAccounts(PILOT, async ({ call, store, kid, app }) => {
    const usage = app.locals.usage;
    const prej = usage.capsFor(kid.id)[0].key;
    assert.match(prej, /^s:\d+$/, "pred dodajanjem ima profil svojo mejo");
    spendTo(app, store, kid.id, 0.1);
    const holds = zapolni(usage, kid.id);
    assert.equal(usage.guard(kid.id, 0.01), null, "meja je polna");

    const r = await call("/api/students", { method: "POST", body: { name: "Eva", birth_year: YEAR - 17, consent: true } });
    assert.ok(r.status < 300, JSON.stringify(r.body));
    const eva = r.body.id;
    const potem = usage.capsFor(kid.id)[0].key;
    assert.match(potem, /^pool:/, "z drugim profilom si profila delita mejo");
    assert.notEqual(potem, prej);

    // Klici v teku (rezervirani pod s:<id>) morajo šteti tudi pod novim ključem: prostora ni ne za prvi ne za novi profil.
    const room = usage.headroom(kid.id);
    assert.ok(room < 0.01, `po dodajanju profila je prostora ${room.toFixed(4)} $, rezervacije v teku niso štete`);
    assert.equal(usage.guard(kid.id, 0.01), null, "prvi profil po dodajanju profila spet dobi prostor");
    assert.equal(usage.guard(eva, 0.01), null, "novi profil dobi prostor, ki ga zasedajo klici v teku");

    for (const h of holds) h.release();
    assert.equal(usage.inflight.size, 0);
    assert.ok(usage.guard(kid.id, 0.01), "po koncu klicev je prostor spet na voljo");
  });
});

test("meja AI: izbrisan profil med klici v teku ne ponastavi števca rezervacij (pilot, dva profila)", { timeout: 30_000 }, async () => {
  await withAccounts(PILOT, async ({ call, store, kid, app }) => {
    const usage = app.locals.usage;
    const eva = (await call("/api/students", { method: "POST", body: { name: "Eva", birth_year: YEAR - 17, consent: true } })).body.id;
    const prej = usage.capsFor(kid.id)[0].key;
    assert.match(prej, /^pool:\d+,\d+$/);
    spendTo(app, store, kid.id, 0.1);
    // Polovico prostora zasedejo klici prvega profila (pod pool:), ostalo klici drugega.
    const holds = [...zapolni(usage, kid.id, 0.01, 5), ...zapolni(usage, eva)];
    assert.equal(usage.guard(kid.id, 0.01), null, "meja je polna");

    const d = await call(`/api/students/${eva}`, { method: "DELETE" });
    assert.equal(d.status, 200, JSON.stringify(d.body));
    assert.notEqual(usage.capsFor(kid.id)[0].key, prej, "po izbrisu se ključ meje spremeni (pool:<id>)");
    // Meja enega profila je manjša; prostor mora biti meja − poraba − VSI klici v teku (tudi tisti pod pool:<id,id>).
    const held = holds.reduce((t, h) => t + h.held, 0);
    const cap = usage.capsFor(kid.id)[0];
    const room = usage.headroom(kid.id);
    assert.ok(Math.abs(room - (cap.usd - cap.spent - held)) < 1e-9, `prostor ${room} ≠ ${cap.usd} − ${cap.spent} − ${held} (klici v teku niso šteti)`);
    assert.equal(usage.guard(kid.id, 0.01), null, "po izbrisu profila prvi profil spet dobi prostor, ki ga zasedajo klici v teku");

    for (const h of holds) h.release();
    assert.equal(usage.inflight.size, 0);
  });
});

test("meja AI: dodan profil in nato izbrisan prvi profil med klici v teku ne ponastavi števca (pilot)", { timeout: 30_000 }, async () => {
  await withAccounts(PILOT, async ({ call, store, kid, app }) => {
    const usage = app.locals.usage;
    spendTo(app, store, kid.id, 0.1);
    const holds = zapolni(usage, kid.id);
    const eva = (await call("/api/students", { method: "POST", body: { name: "Eva", birth_year: YEAR - 17, consent: true } })).body.id;
    const d = await call(`/api/students/${kid.id}`, { method: "DELETE" });
    assert.equal(d.status, 200, JSON.stringify(d.body));
    // Ključ meje novega profila (s:<eva> ali pool:<eva>) nima nobenega profila skupnega s ključem klicev v teku.
    assert.doesNotMatch(usage.capsFor(eva)[0].key, new RegExp(`\\b${kid.id}\\b`));
    const held = holds.reduce((t, h) => t + h.held, 0);
    const cap = usage.capsFor(eva)[0];
    const room = usage.headroom(eva);
    assert.ok(Math.abs(room - (cap.usd - cap.spent - held)) < 1e-9, `prostor ${room} ≠ ${cap.usd} − ${cap.spent} − ${held} (klici izbrisanega profila niso šteti)`);
    assert.equal(usage.guard(eva, 0.01), null, "novi profil dobi prostor, ki ga zasedajo klici izbrisanega profila");
    for (const h of holds) h.release();
    assert.equal(usage.inflight.size, 0);
  });
});

test("inflightOf: zajamčeni paket šteje pod ključem računa, brezplačna meja profila (s:<id>) posebej in enkrat", () => {
  const u = Object.create(Usage.prototype);
  u.inflight = new Map();
  u.persistHold = () => {};
  u.onUse = null;
  const near = (a, b, msg) => assert.ok(Math.abs(a - b) < 1e-9, `${msg}: ${a} ≠ ${b}`);
  // Preizkus brez plačila, Družina z izčrpanim skupnim bazenom: profil ima mejo paketa (pool:1,2) in brezplačno s:<id>.
  const paket = { key: "pool:1,2", fly: "g:7", usd: 2, spent: 1 };
  const prvi = [paket, { key: "s:1", usd: 0.5, spent: 0 }];
  const drugi = [paket, { key: "s:2", usd: 0.5, spent: 0 }];
  assert.ok(u.hold(1, () => prvi).take(0.2));
  near(u.headroom(1, prvi.slice(0, 1)), 0.8, "paket: klic šteje enkrat");
  near(u.headroom(1, prvi.slice(1)), 0.3, "brezplačna meja prvega profila");
  assert.ok(u.hold(2, () => drugi).take(0.2));
  near(u.headroom(1, prvi.slice(0, 1)), 0.6, "paket šteje klica obeh profilov");
  near(u.headroom(1, prvi.slice(1)), 0.3, "klic drugega profila ne šteje v brezplačno mejo prvega");
  // Ključ paketa se spremeni (dodan ali izbrisan profil), ključ računa ostane: klica v teku štejeta naprej.
  near(u.headroom(1, [{ key: "pool:1,2,3", fly: "g:7", usd: 2, spent: 1 }]), 0.6, "nov ključ paketa");
  near(u.headroom(2, [{ key: "s:2", fly: "g:7", usd: 2, spent: 1 }]), 0.6, "po izbrisu prvega profila");
  near(u.headroom(9, [{ key: "s:9", fly: "g:8", usd: 2, spent: 1 }]), 1, "drug račun");
});

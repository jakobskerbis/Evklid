// Točka A9 (odločitev j 14. 11.): skrbniške pravice šele po kodi na e-pošto (12 ur za sejo). Brez kode je skrbnik
// navaden starš: skrbniške poti 403, v /api/account ni skrbniških podatkov. Zagon: node --test test/skrbnik-koda.test.js
import test from "node:test";
import assert from "node:assert/strict";
import { withAccounts } from "./racuni-pomoc.js";

const ENV = { EVKLID_ADMIN_EMAILS: "meja@x.si", EVKLID_ADMIN_KODA: "1" };
// Skrbniška pot z drugega računalnika (X-Forwarded-For): zahteva s strežnikovega računalnika (isLocalRequest) je
// skrbniška tudi brez prijave, zato jo test pošlje kot od zunaj.
const odZunaj = (base, jar) => async (path) =>
  (await fetch(base + path, { headers: { cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; "), "x-forwarded-for": "203.0.113.5" } })).status;
const zadnjaKoda = (calls) => /\b(\d{6})\b/.exec(calls.filter((c) => c.host === "api.resend.com").at(-1).body.text)[1];

test("A9 skrbnik: brez kode na e-pošto ni skrbniških pravic; koda jih odpre samo za to sejo", async () => {
  await withAccounts(ENV, async ({ call, calls, jar, base }) => {
    const skrbniska = odZunaj(base, jar);
    // Pred potrditvijo: navaden starš.
    assert.equal((await skrbniska("/api/admin/reports")), 403, "skrbniška pot brez kode");
    let acc = (await call("/api/account")).body;
    assert.equal(acc.skrbnik_potrditev, true);
    assert.equal(acc.parent.is_admin, false);
    assert.equal(acc.promo.codes, undefined, "brez seznama kod");
    assert.equal(acc.billing_events, undefined, "brez dogodkov plačil");
    assert.equal((await call("/api/admin/guest-invite", { method: "POST" })).status, 403);

    // Napačna koda (5-krat) zaklene kodo; prava koda potem ne velja več.
    assert.equal((await call("/api/account/skrbnik/koda", { method: "POST" })).status, 200);
    const prva = zadnjaKoda(calls);
    const napacna = prva === "000000" ? "111111" : "000000";
    for (let i = 0; i < 5; i++) assert.equal((await call("/api/account/skrbnik/potrdi", { method: "POST", body: { code: napacna } })).status, 400);
    const zaklenjena = await call("/api/account/skrbnik/potrdi", { method: "POST", body: { code: prva } });
    assert.equal(zaklenjena.status, 400);
    assert.match(zaklenjena.body.error, /potekla/);
    assert.equal((await skrbniska("/api/admin/reports")), 403);

    // Nova koda, prava: skrbniške pravice za to sejo.
    assert.equal((await call("/api/account/skrbnik/koda", { method: "POST" })).status, 200);
    const r = await call("/api/account/skrbnik/potrdi", { method: "POST", body: { code: zadnjaKoda(calls) } });
    assert.equal(r.status, 200, JSON.stringify(r.body));
    assert.equal((await skrbniska("/api/admin/reports")), 200);
    acc = (await call("/api/account")).body;
    assert.equal(acc.parent.is_admin, true);
    assert.equal(acc.skrbnik_potrditev, undefined);
    assert.ok(Array.isArray(acc.promo.codes));
    assert.equal((await call("/api/account/skrbnik/koda", { method: "POST" })).status, 400, "potrjena seja kode ne potrebuje");

    // Druga seja istega skrbnika (nova prijava) ni potrjena.
    const prej = { ...jar };
    for (const k of Object.keys(jar)) delete jar[k];
    assert.equal((await call("/api/auth/login", { method: "POST", body: { email: "meja@x.si", password: "geslo1234" } })).status, 200);
    assert.equal((await skrbniska("/api/admin/reports")), 403, "nova seja brez kode");
    Object.assign(jar, prej);
    assert.equal((await skrbniska("/api/admin/reports")), 200, "prva seja ostane potrjena");
  });
});

test("A9 skrbnik: koda velja 10 minut, potrditev 12 ur; navaden starš kode ne more zahtevati", async () => {
  await withAccounts(ENV, async ({ call, calls, store, base, jar }) => {
    const skrbniska = odZunaj(base, jar);
    assert.equal((await call("/api/account/skrbnik/koda", { method: "POST" })).status, 200);
    store.db.prepare("UPDATE skrbnik_potrditve SET code_expires = ?").run(Date.now() - 1);
    assert.equal((await call("/api/account/skrbnik/potrdi", { method: "POST", body: { code: zadnjaKoda(calls) } })).status, 400, "potekla koda");
    assert.equal((await call("/api/account/skrbnik/koda", { method: "POST" })).status, 200);
    assert.equal((await call("/api/account/skrbnik/potrdi", { method: "POST", body: { code: zadnjaKoda(calls) } })).status, 200);
    assert.equal((await skrbniska("/api/admin/reports")), 200);
    store.db.prepare("UPDATE skrbnik_potrditve SET potrjeno_do = ?").run(Date.now() - 1);
    assert.equal((await skrbniska("/api/admin/reports")), 403, "po 12 urah spet koda");
  });
  await withAccounts({ EVKLID_ADMIN_KODA: "1" }, async ({ call }) => {
    assert.equal((await call("/api/account/skrbnik/koda", { method: "POST" })).status, 400, "ni skrbnik");
    assert.equal((await call("/api/account")).body.skrbnik_potrditev, undefined);
  });
});

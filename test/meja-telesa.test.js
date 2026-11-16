// Točka A9: tudi s prijavo je meja telesa JSON 100 kb; večja (do 10 MB) samo na poteh s fotografijo ali dolgo vsebino.
// Prej je vsaka pot s prijavo sprejela 10 MB. Zagon: node --test test/meja-telesa.test.js
import test from "node:test";
import assert from "node:assert/strict";
import { withAccounts } from "./racuni-pomoc.js";

const besedilo = (n) => "a".repeat(n);

test("A9 meja telesa: 100 kb privzeto, večja samo za fotografije in dolgo vsebino", async () => {
  await withAccounts({}, async ({ call, kid }) => {
    // Navadna pot s prijavo: 200 kB je preveč (prej sprejeto do 10 MB).
    const nastavitve = await call(`/api/students/${kid.id}`, { method: "PUT", body: { name: "Lan", odvecno: besedilo(200_000) } });
    assert.equal(nastavitve.status, 413, JSON.stringify(nastavitve.body).slice(0, 200));
    const povratna = await call(`/api/students/${kid.id}/feedback`, { method: "POST", body: { text: besedilo(200_000) } });
    assert.equal(povratna.status, 413);

    // Sporočilo s sliko (~3 MB base64) gre skozi razčlenjevalnik (obdelava ga sprejme ali zavrne sama, ne s 413).
    const conv = (await call(`/api/students/${kid.id}/conversations`, { method: "POST" })).body;
    const slika = await call(`/api/conversations/${conv.id}/messages`, { method: "POST", body: { text: "kaj je to", image: { media_type: "image/png", data: "A".repeat(3_000_000) } } });
    assert.notEqual(slika.status, 413);
    // Skener in urnik s fotografije: 3 MB ni 413 (slika ni prava, zato 400 ali drugo, a ne »prevelika zahteva«).
    for (const pot of [`/api/students/${kid.id}/scan/read`, `/api/students/${kid.id}/schedule/photo`, `/api/students/${kid.id}/zapiski/preberi`]) {
      const r = await call(pot, { method: "POST", body: { image: `data:image/png;base64,${"A".repeat(3_000_000)}` } });
      assert.notEqual(r.status, 413, pot);
    }
    // Graf s sličico (do 200 000 znakov podatkov + 80 000 sličica) ostane mogoč.
    const graf = await call(`/api/students/${kid.id}/graphs`, { method: "POST", body: { title: "g", data: { items: [{ type: "expr", text: besedilo(150_000) }] } } });
    assert.notEqual(graf.status, 413);
    // Vrsta odgovorov brez povezave (1200 odgovorov ≈ 135 kB) se še sinhronizira (pregled 2).
    const vrsta = Array.from({ length: 1200 }, (_, i) => ({ topic_id: "mat-os-ulomki", level: 1, seed: 1000 + i, answer: "3/4", correct: true, at: new Date().toISOString() }));
    const sinh = await call(`/api/students/${kid.id}/offline-sync`, { method: "POST", body: { results: vrsta } });
    assert.notEqual(sinh.status, 413);
    // Tudi velike poti imajo zgornjo mejo: 12 MB je preveč.
    const prevec = await call(`/api/conversations/${conv.id}/messages`, { method: "POST", body: { text: "x", image: { media_type: "image/png", data: "A".repeat(12_000_000) } } });
    assert.equal(prevec.status, 413);
  });
});

// Neprimerna imena profila (#754, j 15. 11. 2026): strežnik jih zavrne ob ustvarjanju in preimenovanju, prava imena
// ostanejo, inštruktor neprimernega imena starega profila ne uporabi v nagovoru.
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { neprimernoIme, withName, createNameStream } from "../server/ime-oznaka.js";

const SLABA = ["lulek", "Lulek123", "l u l e k", "f.u.c.k", "fuuuuck", "Kurac", "pička", "P1zda", "jebemti", "Jebote", "Arschloch", "Scheiße", "cazzo", "Kurva", "SEX", "asshole", "nigga", "ŠUPAK", "kurčevo", "Mali kurc", "bitch99"];
const DOBRA = ["Ana-Maria", "Rita", "Mona", "Kurt", "Nigel", "Peter", "Jakob", "Assia", "As", "Sara", "Dickson", "Fuks", "Šimen", "Picasso", "Merdin", "Hans", "Bastian", "Pedro", "Kurtović", "Penelope", "Žiga", "Neža", "Ritter", "Kristjan", "Marko 2", "Pia-Lina", "Eva B.", "Ula", "Analisa", "Tit", "Scott", "Bob", "Bobby", "Ćazim"];

test("neprimernoIme: kletvice in zapisi s številkami, podvojenimi in razmaknjenimi črkami", () => {
  for (const n of SLABA) assert.equal(neprimernoIme(n), true, n);
});

test("neprimernoIme: prava imena in vzdevki ostanejo", () => {
  for (const n of DOBRA) assert.equal(neprimernoIme(n), false, n);
  assert.equal(neprimernoIme(""), false);
  assert.equal(neprimernoIme(undefined), false);
});

test("nagovor: neprimerno ime starega profila se ne izpiše, tudi med pretakanjem", () => {
  assert.equal(withName("Bravo, {{IME}}!", "lulek"), "Bravo!");
  assert.equal(withName("Bravo, {{IME}}!", "Ana"), "Bravo, Ana!");
  const st = createNameStream("Kurac");
  assert.equal(st.push("Super, {{I") + st.push("ME}}, gremo.") + st.end(), "Super, gremo.");
});

test("API: ustvarjanje in preimenovanje profila zavrne neprimerno ime, dobro ime gre skozi", async () => {
  const store = openDb(":memory:");
  const app = createApp(store, {});
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (method, p, body) => {
    const r = await fetch(base + p, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    return { status: r.status, body: await r.json() };
  };
  try {
    const bad = await call("POST", "/api/students", { name: "l u l e k", settings: { curriculum_level: "9. razred" } });
    assert.equal(bad.status, 400);
    assert.equal(bad.body.code, "ime_neprimerno");
    assert.match(bad.body.error, /Izberi drugo ime/);
    const ok = await call("POST", "/api/students", { name: "Ana-Maria", settings: { curriculum_level: "9. razred" } });
    assert.equal(ok.status, 201);
    const ren = await call("PUT", `/api/students/${ok.body.id}`, { name: "Pizda" });
    assert.equal(ren.status, 400);
    assert.equal(ren.body.code, "ime_neprimerno");
    assert.equal(store.getStudent(ok.body.id).name, "Ana-Maria");
    const ren2 = await call("PUT", `/api/students/${ok.body.id}`, { name: "Rita" });
    assert.equal(ren2.status, 200);
    assert.equal(ren2.body.name, "Rita");
  } finally {
    server.close();
    store.db.close();
  }
});

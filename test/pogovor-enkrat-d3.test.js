// Točka D3 (hitrost, master brief j 13. 11.): sporočilo inštruktorju naloži (in odšifrira) sporočila pogovora samo
// enkrat; praznost preveri z EXISTS. Prej trikrat (praznost, rezerva, zgodovina za model), tudi fotografije do 7 MB.
// Na stari kodi pade. Zagon: node --test test/pogovor-enkrat-d3.test.js
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { modeParams } from "../server/claude.js";

const META = '\n<<META subject=MAT topic="ulomki" error=0 mode=A flag=none done=0>>';

test("D3 sporočilo inštruktorju: zgodovina pogovora se prebere enkrat, model dobi isto zgodovino kot prej", async () => {
  const store = openDb(":memory:");
  const seen = [];
  const streamFn = async ({ messages, mode, onText }) => {
    seen.push(messages);
    const text = `Odgovor ${seen.length}.${META}`;
    onText(text);
    return { content: [{ type: "text", text }], text, stopReason: "end_turn", model: modeParams(mode).model, usage: { input_tokens: 10, output_tokens: 5 } };
  };
  const server = createApp(store, { streamFn }).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = async (path, body) =>
    fetch(base + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body || {}) });
  try {
    const s = await (await post("/api/students", { name: "Ana" })).json();
    const c = await (await post(`/api/students/${s.id}/conversations`)).json();
    let branja = 0;
    const list = store.listMessages.bind(store);
    store.listMessages = (id) => (branja++, list(id));
    const prazen = store.hasMessages(c.id);
    assert.equal(prazen, false);

    const prvi = await post(`/api/conversations/${c.id}/messages`, { text: "Koliko je 1/2 + 1/3?" });
    assert.equal(prvi.status, 200);
    await prvi.text(); // do konca odgovora, sicer bi bil pogovor morda še zaseden (409)
    assert.equal(branja, 1, "prvo sporočilo: eno branje zgodovine");
    assert.equal(store.hasMessages(c.id), true);

    branja = 0;
    const r = await post(`/api/conversations/${c.id}/messages`, { text: "In 1/4 + 1/4?" });
    assert.equal(r.status, 200);
    await r.text();
    assert.equal(branja, 1, "drugo sporočilo: eno branje zgodovine");
    // Model dobi vso zgodovino in trenutno vprašanje na koncu (kot prej, ko jo je prebral iz baze po shranjevanju).
    const zadnji = seen.at(-1);
    assert.equal(zadnji.at(-1).role, "user");
    assert.match(JSON.stringify(zadnji.at(-1).content), /1\/4 \+ 1\/4/);
    assert.ok(zadnji.some((m) => m.role === "assistant" && JSON.stringify(m.content).includes("Odgovor 1.")));
    assert.ok(zadnji.some((m) => m.role === "user" && JSON.stringify(m.content).includes("1/2 + 1/3")));
  } finally {
    server.close();
  }
});

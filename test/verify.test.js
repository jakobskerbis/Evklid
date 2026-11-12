import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { verifyAnswer, parseVerdict, parseCardVerdicts, codeCheck, CARDS_SYSTEM } from "../server/verify.js";

const fake = (replies) => {
  const calls = [];
  const fn = async (p) => {
    calls.push(p.model);
    const t = typeof replies === "function" ? replies(p.model) : replies;
    if (t instanceof Error) throw t;
    return { content: [{ type: "text", text: t }], usage: { input_tokens: 1000, output_tokens: 100 }, model: p.model };
  };
  return { fn, calls };
};

test("verdict parsing", () => {
  assert.deepEqual(parseVerdict("OK"), { ok: true });
  assert.deepEqual(parseVerdict(" ok. "), { ok: true });
  assert.equal(parseVerdict("NAPAKA: 7 · 8 je 56").ok, false);
  assert.equal(parseVerdict("NAPAKA: 7 · 8 je 56").reason, "7 · 8 je 56");
  assert.equal(parseVerdict("OK, but 7·8 is 56").ok, false, "vse razen golega OK je dvom");
  assert.equal(parseVerdict("**OK**").ok, true);
  // Utemeljitev pred sodbo (krog 8): sodba je zadnja vrstica; NAPAKA kjer koli ostane zavrnitev.
  assert.equal(parseVerdict("The card states the rule correctly.\n\nOK").ok, true);
  assert.equal(parseVerdict("NAPAKA: x\nOK").ok, false);
  assert.match(parseVerdict("The flashcard states the criss-cross rule.").reason, /^brez sodbe: The flashcard/);
});

test("card verdicts: a wrong card rejects only itself", () => {
  assert.deepEqual(parseCardVerdicts("OK", 3).cards, [true, true, true]);
  assert.deepEqual(parseCardVerdicts("NAPAKA 2: x", 3).cards, [true, false, true]);
  assert.equal(parseCardVerdicts("NAPAKA 2: x", 3).reason, "2: x");
  assert.deepEqual(parseCardVerdicts("- NAPAKA card 1: x\n- NAPAKA #3 – y", 3).cards, [false, true, false]);
  assert.deepEqual(parseCardVerdicts("NAPAKA: 2 je napačna", 3).cards, [false, false, false], "brez številke pred dvopičjem: vse");
  assert.deepEqual(parseCardVerdicts("NAPAKA 4: x", 3).cards, [false, false, false], "številka zunaj obsega: vse");
  assert.deepEqual(parseCardVerdicts("Card 2 has a NAPAKA in it", 3).cards, [false, false, false]);
  assert.deepEqual(parseCardVerdicts("", 2).cards, [false, false]);
  assert.match(CARDS_SYSTEM, /NAPAKA <number>/);
  assert.doesNotMatch(CARDS_SYSTEM, /exactly one line/);
});

const FIX = JSON.parse(readFileSync(new URL("./fixtures/kartice-preverjanje.json", import.meta.url), "utf8"));
for (const f of FIX.primeri) {
  test(`cards fixture: ${f.ime}`, async () => {
    const seen = [];
    const fn = async (p) => {
      seen.push(p);
      const text = /opus/.test(p.model) ? f.odgovori.opus : f.odgovori.sonnet;
      return { content: [{ type: "text", text }], usage: { input_tokens: 1000, output_tokens: 50 }, model: p.model, stop_reason: "end_turn" };
    };
    const r = await verifyAnswer({ question: "formule ionskih spojin", answer: f.kartice.join("\n"), kind: "cards", cards: f.kartice, createFn: fn });
    assert.deepEqual(r.cards, f.pricakovano);
    assert.equal(r.ok, f.pricakovano.every(Boolean));
    assert.equal(seen.length, 2, "en klic na model, kot prej");
    for (const p of seen) {
      assert.equal(p.system, CARDS_SYSTEM);
      f.kartice.forEach((c, i) => assert.ok(p.messages[0].content.includes(`${i + 1}. ${c}`), "kartice so oštevilčene"));
    }
  });
}

test("cards: a cut-off reviewer rejects every card", async () => {
  const cut = async (p) => ({ content: [{ type: "text", text: "OK" }], stop_reason: "max_tokens", usage: { output_tokens: 10 }, model: p.model });
  const r = await verifyAnswer({ question: "q", answer: "A → a\nB → b", kind: "cards", cards: ["A → a", "B → b"], createFn: cut });
  assert.deepEqual(r.cards, [false, false]);
});

test("a cut-off or refused reviewer, a failed call or a too long answer is never OK; costs are still logged", async () => {
  const cut = async (p) => ({ content: [{ type: "text", text: "OK" }], stop_reason: "max_tokens", usage: { output_tokens: 10 }, model: p.model });
  assert.equal((await verifyAnswer({ question: "q", answer: "a", createFn: cut })).ok, false);
  const logged = [];
  const usage = { kindToday: () => 0, log: (...a) => logged.push(a) };
  const half = fake((m) => (/opus/.test(m) ? new Error("timeout") : "OK"));
  const r = await verifyAnswer({ question: "q", answer: "a", usage, createFn: half.fn });
  assert.equal(r.ok, false);
  assert.equal(logged.length, 1, "strošek uspelega klica gre v dnevno omejitev");
  assert.equal(logged[0][0], null);
  const long = fake("OK");
  assert.equal((await verifyAnswer({ question: "q", answer: "x".repeat(12001), createFn: long.fn })).ok, false);
  assert.equal(long.calls.length, 0);
});

test("an invalid daily budget does not switch the cap off", async () => {
  const old = process.env.EVKLID_VERIFY_DAILY_USD;
  process.env.EVKLID_VERIFY_DAILY_USD = "abc";
  try {
    const { fn, calls } = fake("OK");
    const r = await verifyAnswer({ question: "q", answer: "a", usage: { kindToday: () => 5, log() {} }, createFn: fn });
    assert.equal(r.ok, false);
    assert.equal(calls.length, 0);
  } finally {
    if (old === undefined) delete process.env.EVKLID_VERIFY_DAILY_USD;
    else process.env.EVKLID_VERIFY_DAILY_USD = old;
  }
});

test("pass 1: code recomputes arithmetic before any model is asked", async () => {
  assert.match(codeCheck("Torej $7 \\cdot 8 = 54$."), /ne izide/);
  assert.equal(codeCheck("Torej $7 \\cdot 8 = 56$."), null);
  const { fn, calls } = fake("OK");
  const r = await verifyAnswer({ question: "7 krat 8", answer: "Torej $7 \\cdot 8 = 54$.", createFn: fn });
  assert.equal(r.ok, false);
  assert.equal(calls.length, 0, "napačen račun ne gre do modelov");
});

test("passes 2 and 3: two different models must both say OK", async () => {
  const ok = fake("OK");
  const r = await verifyAnswer({ question: "7 krat 8", answer: "$7 \\cdot 8 = 56$", createFn: ok.fn });
  assert.equal(r.ok, true);
  assert.equal(new Set(ok.calls).size, 2, "dva različna modela");
  assert.ok(r.cost > 0);

  const one = fake((m) => (/opus/.test(m) ? "NAPAKA: napačna enota" : "OK"));
  const r2 = await verifyAnswer({ question: "q", answer: "a", createFn: one.fn });
  assert.equal(r2.ok, false);
  assert.match(r2.reason, /enota/);

  const err = await verifyAnswer({ question: "q", answer: "a", createFn: fake(new Error("timeout")).fn });
  assert.equal(err.ok, false, "napaka pri preverjanju = ne shrani");
});

test("daily verification budget: above it nothing new is stored", async () => {
  const usage = { kindToday: () => 5, log() {} };
  const { fn, calls } = fake("OK");
  const r = await verifyAnswer({ question: "q", answer: "a", usage, createFn: fn });
  assert.equal(r.ok, false);
  assert.equal(calls.length, 0);
});

// --- vgrajeno v klepet ---
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

async function chatServer(reply, verifyFn) {
  const store = openDb(":memory:");
  const streamFn = async ({ onText }) => {
    onText(reply);
    return { content: [{ type: "text", text: reply }], text: reply, stopReason: "end_turn" };
  };
  const server = createApp(store, { streamFn, verifyFn }).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (p, body) => fetch(base + p, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body || {}) });
  const s = await (await post("/api/students", { name: "Ana" })).json();
  const ask = async (text) => {
    const c = await (await post(`/api/students/${s.id}/conversations`)).json();
    return (await post(`/api/conversations/${c.id}/messages`, { text })).text();
  };
  const cards = async () => (await (await fetch(`${base}/api/students/${s.id}/flashcards`)).json()).cards;
  return { store, ask, cards, close: () => server.close() };
}
const tick = () => new Promise((r) => setTimeout(r, 20));
const META = '\n<<META subject=MAT topic="x" error=0 mode=A flag=none done=0>>';

test("chat: an answer is reused only after the checks pass, a rejected one is dropped", async () => {
  let release;
  const pending = new Promise((r) => (release = r));
  const app = await chatServer("Ploščina je $3 \\cdot 4 = 12$ cm²." + META, () => pending);
  try {
    const row = () => app.store.db.prepare("SELECT verified FROM answer_cache").get();
    await app.ask("kolikšna je ploščina pravokotnika");
    assert.equal(row().verified, 0, "čaka na preverjanje");
    await app.ask("kolikšna je ploščina pravokotnika");
    assert.equal(app.store.db.prepare("SELECT hits FROM answer_cache").get().hits, 0, "nepreverjen odgovor ne gre drugim");
    release({ ok: true });
    await tick();
    assert.equal(row().verified, 1);
  } finally {
    app.close();
  }
  const bad = await chatServer("Ploščina je 13 cm²." + META, async () => ({ ok: false, reason: "NAPAKA" }));
  try {
    await bad.ask("kolikšna je ploščina pravokotnika");
    await tick();
    assert.equal(bad.store.db.prepare("SELECT COUNT(*) AS n FROM answer_cache").get().n, 0);
  } finally {
    bad.close();
  }
});

test("chat: an arithmetic error is never stored, even without an API key", async () => {
  const app = await chatServer("Torej $7 \\cdot 8 = 54$.\n<<KARTICA\nV: Koliko je 7 · 8?\nO: $7 \\cdot 8 = 54$\n>>" + META);
  try {
    await app.ask("koliko je 7 krat 8");
    assert.equal(app.store.db.prepare("SELECT COUNT(*) AS n FROM answer_cache").get().n, 0);
    assert.equal(app.store.db.prepare("SELECT COUNT(*) AS n FROM flashcards").get().n, 0);
  } finally {
    app.close();
  }
});

test("chat: flashcards stay hidden until checked, rejected ones are deleted", async () => {
  const card = "Dobro.\n<<KARTICA\nV: Formula za ploščino pravokotnika?\nO: $S = a \\cdot b$\n>>" + META;
  const ok = await chatServer(card, async () => ({ ok: true }));
  try {
    await ok.ask("razloži ploščino pravokotnika");
    await tick();
    assert.equal((await ok.cards()).length, 1);
  } finally {
    ok.close();
  }
  let release;
  const wait = new Promise((r) => (release = r));
  const bad = await chatServer(card, () => wait);
  try {
    const sse = await bad.ask("razloži ploščino pravokotnika");
    assert.equal((await bad.cards()).length, 0, "skrita, dokler ni preverjena");
    assert.doesNotMatch(sse, /event: cards/, "obvestilo »dodane kartice« ne pokaže nepreverjene");
    const id = bad.store.db.prepare("SELECT id FROM flashcards").get().id;
    assert.equal(bad.store.cards.review(bad.store.db.prepare("SELECT student_id FROM flashcards").get().student_id, id, true), null, "ni je mogoče ponavljati");
    release({ ok: false, reason: "NAPAKA" });
    await tick();
    assert.equal(bad.store.db.prepare("SELECT COUNT(*) AS n FROM flashcards").get().n, 0);
  } finally {
    bad.close();
  }
});

test("chat: in a mixed batch only the wrong flashcard is deleted", async () => {
  const k = (v, o) => `<<KARTICA\nV: ${v}\nO: ${o}\n>>`;
  const reply =
    "Dobro.\n" +
    k("Kako s križnim pravilom določiš indeksa?", "Indeks kationa je naboj aniona, indeks aniona naboj kationa; nato skrajšaj.") +
    "\n" + k("Kaj je indeks kationa?", "Indeks kationa je naboj kationa.") +
    "\n" + k("Formula aluminijevega oksida?", "$\\mathrm{Al_2O_3}$") + META;
  // Preverjevalec zavrne kartico, ki trdi »naboj kationa« za indeks kationa (številko prebere iz oštevilčenega seznama).
  const createFn = async (p) => {
    const line = p.messages[0].content.split("\n").find((l) => /Indeks kationa je naboj kationa/.test(l));
    const text = line ? `NAPAKA ${line.match(/^(\d+)\./)[1]}: the cation's subscript is the anion's charge` : "OK";
    return { content: [{ type: "text", text }], usage: { input_tokens: 1000, output_tokens: 20 }, model: p.model, stop_reason: "end_turn" };
  };
  const app = await chatServer(reply, (a) => verifyAnswer({ ...a, createFn }));
  const warn = console.warn;
  const logs = [];
  console.warn = (m) => logs.push(String(m));
  try {
    await app.ask("razloži formule ionskih spojin");
    await tick();
    const fronts = (await app.cards()).map((c) => c.front).sort();
    assert.deepEqual(fronts, ["Formula aluminijevega oksida?", "Kako s križnim pravilom določiš indeksa?"]);
    assert.equal(app.store.db.prepare("SELECT COUNT(*) AS n FROM flashcards").get().n, 2);
    assert.ok(logs.some((l) => /kartice niso shranjene \(1 od 3; .*: 2: the cation/.test(l)), logs.join("\n"));
  } finally {
    console.warn = warn;
    app.close();
  }
});

test("three checks need two different models", async () => {
  process.env.EVKLID_VERIFY_MODELS = "claude-sonnet-5-5, claude-sonnet-5-5";
  try {
    const { fn, calls } = fake("OK");
    const r = await verifyAnswer({ question: "q", answer: "a", createFn: fn });
    assert.equal(r.ok, false);
    assert.equal(calls.length, 0);
  } finally {
    delete process.env.EVKLID_VERIFY_MODELS;
  }
});

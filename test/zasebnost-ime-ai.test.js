// Ime otroka ne gre k ponudniku AI (j, 18. 11. 2026, po osnutku DPIA). Model dobi oznako {{IME}} (server/prompt.js),
// strežnik jo zamenja s pravim imenom samo v besedilu za učenca (server/ime-oznaka.js). Test vohuni na odjemalcu
// Anthropic (setClient) in preveri, da ime ne pride v NOBEN klic: klepet (prvi odgovor, vodenje v več potezah,
// »Razloži podrobneje«, sprotno preverjanje, popravek, varnostni pregled), ustno spraševanje, zapiski, skener,
// urnik s fotografije in pogovor za mnenje. Tedensko poročilo modela ne kliče (samo e-pošta, server/accounts).
// Kar učenec napiše sam (»Ime mi je …«), ostane, kot je.
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { setClient } from "../server/claude.js";
import { withName, createNameStream, maskName, maskHistory, IME_OZNAKA, choiceAsToken, genderFromName, pupilGender } from "../server/ime-oznaka.js";
import { buildSystemPrompt, systemBlocks } from "../server/prompt.js";
import { normalizeSettings } from "../server/settings.js";
import { cacheKey } from "../server/app.js";
import { summarizedHistory } from "../server/povzetek.js";

const NAME = "Zarjana Kovačič";
const LEAK = /Zarjana|Kovačič|Kovacic/i;
const META = '\n<<META subject=MAT topic="seštevanje" error=0 mode=A flag=none done=0>>';

// --- enote ---

test("withName: oznaka → ime; končnica le pri imenu na soglasnik; skoraj prave oznake; prazno ime z vejico", () => {
  assert.equal(withName("Bravo, {{IME}}! Še enkrat, {{IME}}.", "Ana"), "Bravo, Ana! Še enkrat, Ana.");
  assert.equal(withName("Hvala, {{IME}}u.", "Ana"), "Hvala, Ana.", "ime na samoglasnik: končnica odpade, ne »Anau«");
  assert.equal(withName("Hvala, {{IME}}u.", "Jakob"), "Hvala, Jakobu.", "ime na soglasnik: končnica ostane");
  assert.equal(withName("Hvala, {{IME}}-u in {{IME}}’u.", "Jakob"), "Hvala, Jakobu in Jakobu.", "ločilo pred končnico odpade");
  assert.equal(withName("{{IME}}-jev korak", "Ana"), "Ana korak");
  assert.equal(withName("{{ IME }} in {{Ime}} in {{ime}}u", "Ana"), "Ana in Ana in Ana", "skoraj prave oznake");
  assert.equal(withName("Bravo, {{IME}}! {{IME}}, poglejva. Gremo {{IME}}.", ""), "Bravo! poglejva. Gremo.", "prazno ime: oznaka s sosednjo vejico in presledkom");
  assert.equal(withName("$\\frac{{a}}{b}$ in {{IM", "Ana"), "$\\frac{{a}}{b}$ in {{IM");
  assert.equal(withName("brez oznake", "Ana"), "brez oznake");
});

test("createNameStream: oznaka, razdeljena na katerem koli mestu, pride cela; umik zavrže zadržano", () => {
  const full = `Bravo, ${IME_OZNAKA}! Poglejva ${IME_OZNAKA}u skupaj {{ in {x}, {{ IME }}-ju in {{Ime}}: $\\frac{{a}}{b}$.`;
  for (const name of ["Ana", "Jakob", ""]) {
    const want = withName(full, name);
    assert.doesNotMatch(want, /\{\{\s*IME|IME\s*\}\}/i);
    for (let size = 1; size <= full.length; size++) {
      const s = createNameStream(name);
      let out = "";
      for (let i = 0; i < full.length; i += size) out += s.push(full.slice(i, i + size));
      assert.doesNotMatch(out, /\{\{\s*IME|IME\s*\}\}/i, `»${name}«, kos ${size}: oznaka je ušla: ${out}`);
      out += s.end();
      assert.equal(out, want, `»${name}«, kos ${size}`);
    }
    // Na vsakem mestu reza posebej (dva kosa).
    for (let cut = 0; cut <= full.length; cut++) {
      const s = createNameStream(name);
      assert.equal(s.push(full.slice(0, cut)) + s.push(full.slice(cut)) + s.end(), want, `»${name}«, rez ${cut}`);
    }
  }
  const s = createNameStream("Ana");
  assert.equal(s.push("Uvod {{IM"), "Uvod ");
  s.reset();
  assert.equal(s.push("Nov začetek") + s.end(), "Nov začetek", "umik (retract) zavrže zadržani konec");
});

test("gumb z izbiro: učenec vidi ime, model dobi izbiro z oznako", () => {
  const ch = ["Da, {{IME}} razume", "Ne"];
  assert.equal(choiceAsToken("Da, Ana razume", ch, "Ana"), "Da, {{IME}} razume");
  assert.equal(choiceAsToken("Da, Ana razume, a še to", ch, "Ana"), "Da, {{IME}} razume, a še to");
  assert.equal(choiceAsToken("Ana je moje ime", ch, "Ana"), "Ana je moje ime", "lastno besedilo ostane");
  assert.equal(choiceAsToken("Ne", ch, "Ana"), "Ne");
});

test("slovnični spol: nastavitev ima prednost, sicer iz imena, ob dvomu neznan", () => {
  const g = (n) => genderFromName(n);
  assert.deepEqual(["Ana", "Nika", "Zarjana Kovačič", "Urška", "Ines", "Karmen"].map(g), ["z", "z", "z", "z", "z", "z"]);
  assert.deepEqual(["Luka", "Jaka", "Miha", "Žiga", "Matija", "Jakob", "Marko", "Nik"].map(g), ["m", "m", "m", "m", "m", "m", "m", "m"]);
  assert.deepEqual(["Saša", "Andrea", "Vanja", "Lili", "Иван", "", "x", "Ana1"].map(g), ["", "", "", "", "", "", "", ""]);
  assert.equal(pupilGender({ gender: "m" }, "Ana"), "m");
  assert.equal(pupilGender({ gender: "z" }, "Luka"), "z");
  assert.equal(pupilGender({ gender: "" }, "Luka"), "m");
  assert.equal(normalizeSettings({ gender: "x" }).gender, "");
  assert.equal(normalizeSettings({ gender: "z" }).gender, "z");
});

test("prompt: ime samo kot oznaka v delu za učenca, spol ali navodilo za neznan spol, stalni del enak", () => {
  const p = (name, settings = {}) => buildSystemPrompt({ settings: normalizeSettings(settings), studentName: name });
  const dyn = (x) => systemBlocks(x)[1].text;
  assert.match(dyn(p("Zarjanka")), /- Slovnični spol učenca: ženski\n/);
  assert.match(dyn(p("Mitja")), /- Slovnični spol učenca: moški\n/);
  assert.match(dyn(p("Mitja", { gender: "z" })), /- Slovnični spol učenca: ženski\n/);
  assert.match(dyn(p("Saša")), /- Spola učenca ne poznaš; .*nikoli »rešil\/a«\./);
  assert.match(dyn(p("")), /Spola učenca ne poznaš/);
  assert.match(dyn(p("Zarjanka")), /Ime učenca: `\{\{IME\}\}` – oznaka .*svojilnega pridevnika.*v vseh jezikih/);
  for (const n of ["Zarjanka", "Mitja", "Saša"]) assert.ok(!new RegExp(`(?<!\\p{L})${n}(?!\\p{L})`, "u").test(p(n)), `ime ${n} v promptu`);
  assert.equal(systemBlocks(p("Zarjanka"))[0].text, systemBlocks(p("Saša", { gender: "m" }))[0].text, "stalni (predpomnjeni) del enak");
});

test("ključ predpomnilnika: znan spol loči odgovore, neznan ohrani dosedanji ključ", () => {
  const s = normalizeSettings({});
  const q = "Kako seštejem dva ulomka z različnima imenovalcema?";
  const k = (g) => cacheKey(q, s, "chat", false, null, [], "osnovna", g);
  assert.equal(k(""), cacheKey(q, s, "chat", false, null, [], "osnovna"));
  assert.notEqual(k("m"), k("z"));
  assert.notEqual(k("m"), k(""));
});

test("maskName in maskHistory: samo odgovori inštruktorja, cele besede, sporočila učenca ostanejo", () => {
  assert.equal(maskName("Bravo, Zarjana! Zarjana Kovačič, Kovačič.", NAME), "Bravo, {{IME}}! {{IME}}, {{IME}}.");
  assert.equal(maskName("Ana in Anatomija, ANA", "ana"), "{{IME}} in Anatomija, {{IME}}", "ne glede na velike črke");
  assert.equal(maskName("Kovac\u030cic\u030c je tu", NAME), "{{IME}} je tu", "NFC");
  const h = [
    { role: "user", content: [{ type: "text", text: "Ime mi je Zarjana." }] },
    { role: "assistant", content: [{ type: "text", text: "Živjo, Zarjana!" }] },
    { role: "assistant", content: "Zarjana, poglej." },
  ];
  const m = maskHistory(h, NAME);
  assert.deepEqual(m[0], h[0], "sporočilo učenca ostane, kot ga je napisal");
  assert.equal(m[1].content[0].text, "Živjo, {{IME}}!");
  assert.equal(m[2].content, "{{IME}}, poglej.");
});

test("povzetek pogovora: shranjen povzetek z imenom (pred spremembo) gre k modelu z oznako", async () => {
  const store = { getSummary: () => ({ text: "Zarjana je vprašala o ulomkih.", upto: 2 }) };
  const msg = (role, text) => ({ role, content: [{ type: "text", text }] });
  const fullHistory = [msg("user", "a"), msg("assistant", "b"), msg("user", "c"), msg("assistant", "d"), msg("user", "e")];
  const out = await summarizedHistory({ store, conversationId: 1, fullHistory, history: fullHistory.slice(2), streamFn: null, mask: (t) => maskName(t, NAME) });
  assert.doesNotMatch(JSON.stringify(out), LEAK);
  assert.match(JSON.stringify(out), /\{\{IME\}\} je vprašala/);
});

// --- vse poti z vohunom na odjemalcu ---

function spyClient(calls) {
  const record = (kind, p) => calls.push({ kind, body: JSON.stringify(p) });
  const usage = { input_tokens: 50, output_tokens: 20 };
  const isTutor = (p) => Array.isArray(p.system) && p.system.some((b) => /Aktivne nastavitve/.test(b.text || ""));
  return {
    messages: {
      create: async (p) => {
        record("create", p);
        return { content: [{ type: "text", text: "{}" }], usage, model: p.model, stop_reason: "end_turn" };
      },
    },
    beta: {
      messages: {
        stream: (p) => {
          record("stream", p);
          // Oznaka razdeljena med dva kosa toka.
          const chunks = isTutor(p) ? ["Bravo, {{I", "ME}}! Poglejva ", 'skupaj: koliko je $2 + 3$?\n<<KARTICA\nV: Kaj zna {{IME}}?\nO: Seštevati.\n>>\n<<IZBIRE ["Razumem, {{IME}} gre naprej", "Ne vem"]>>' + META] : ["ok"];
          const text = chunks.join("");
          return {
            async *[Symbol.asyncIterator]() {
              yield { type: "message_start", message: { usage: { ...usage, output_tokens: 1 }, model: p.model } };
              yield { type: "content_block_start", content_block: { type: "text" } };
              for (const t of chunks) yield { type: "content_block_delta", delta: { type: "text_delta", text: t } };
              yield { type: "content_block_stop" };
              yield { type: "message_delta", usage: { output_tokens: 20 } };
            },
            finalMessage: async () => ({ content: [{ type: "text", text }], stop_reason: "end_turn", usage, model: p.model }),
          };
        },
      },
    },
  };
}

async function withSpy(fn) {
  const saved = { key: process.env.ANTHROPIC_API_KEY, mock: process.env.EVKLID_MOCK, fb: process.env.EVKLID_FEEDBACK_AI };
  process.env.ANTHROPIC_API_KEY = "test-ni-pravi";
  delete process.env.EVKLID_MOCK;
  process.env.EVKLID_FEEDBACK_AI = "1";
  const calls = [];
  setClient(spyClient(calls));
  const store = openDb(":memory:");
  const server = createApp(store, { scheduler: false, log: { error() {}, warn() {}, info() {} } }).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (path, body, method = body ? "POST" : "GET") => {
    const r = await fetch(base + path, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    const text = await r.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {}
    return { status: r.status, text, body: json };
  };
  const sse = (text) => {
    const ev = [];
    for (const part of text.split("\n\n")) {
      const e = /^event: (.*)$/m.exec(part)?.[1];
      const d = /^data: (.*)$/m.exec(part)?.[1];
      if (e) ev.push({ event: e, data: d ? JSON.parse(d) : null });
    }
    return ev;
  };
  try {
    await fn({ call, sse, calls, store });
  } finally {
    server.close();
    setClient(null);
    for (const [k, env] of [["key", "ANTHROPIC_API_KEY"], ["mock", "EVKLID_MOCK"], ["fb", "EVKLID_FEEDBACK_AI"]]) {
      if (saved[k] === undefined) delete process.env[env];
      else process.env[env] = saved[k];
    }
  }
}

const leaks = (calls) => calls.filter((c) => LEAK.test(c.body)).map((c) => c.body.slice(0, 300));

test("noben klic modela ne nese imena: klepet, vodenje, podrobna razlaga, ustno, zapiski, skener, urnik, mnenje", { timeout: 120_000 }, async () => {
  await withSpy(async ({ call, sse, calls, store }) => {
    const s = (await call("/api/students", { name: NAME, grade: 9 })).body;
    assert.ok(s?.id, "profil");
    const conv = (await call(`/api/students/${s.id}/conversations`, {})).body;
    const say = async (body) => sse((await call(`/api/conversations/${conv.id}/messages`, body)).text);

    // 1. Prvi odgovor: pretok z razdeljeno oznako → učenec vidi ime, nikjer oznake.
    const ev1 = await say({ text: "Koliko je 2 + 3?" });
    const done1 = ev1.find((e) => e.event === "done")?.data;
    assert.ok(done1, `ni dogodka done: ${JSON.stringify(ev1).slice(0, 400)}`);
    const streamed = ev1.filter((e) => e.event === "delta").map((e) => e.data.text).join("");
    assert.match(streamed, /Bravo, Zarjana Kovačič! Poglejva/);
    assert.doesNotMatch(streamed + done1.text, /\{\{|IME\}\}/);
    assert.match(done1.text, /Bravo, Zarjana Kovačič!/);
    const tutorCalls = calls.filter((c) => c.kind === "stream" && /Aktivne nastavitve/.test(c.body));
    assert.ok(tutorCalls.length >= 1);
    assert.ok(/Ime učenca: `\{\{IME\}\}`/.test(tutorCalls[0].body), "oznaka v promptu");
    // Shranjeno: prikaz z imenom, zgodovina za API z oznako.
    const row = store.listMessages(conv.id).find((m) => m.role === "assistant");
    assert.ok(/Slovnični spol učenca: ženski/.test(tutorCalls[0].body), "spol v promptu");
    assert.match(row.display_text, /Bravo, Zarjana Kovačič!/);
    assert.match(JSON.stringify(row.api_content), /\{\{IME\}\}/);
    assert.doesNotMatch(JSON.stringify(row.api_content), LEAK);

    assert.deepEqual(done1.choices, ["Razumem, Zarjana Kovačič gre naprej", "Ne vem"], "gumbi z imenom");
    // Tapnjen gumb: učenec vidi ime, model dobi izbiro z oznako.
    const tap = calls.length;
    const evTap = await say({ text: "Razumem, Zarjana Kovačič gre naprej" });
    assert.ok(evTap.some((e) => e.event === "done"));
    const tapCall = calls.slice(tap).find((c) => c.kind === "stream" && /Aktivne nastavitve/.test(c.body));
    assert.ok(/Razumem, \{\{IME\}\} gre naprej/.test(tapCall.body), "izbira z oznako");
    const userRow = store.listMessages(conv.id).filter((m) => m.role === "user").at(-1);
    assert.equal(userRow.display_text, "Razumem, Zarjana Kovačič gre naprej");

    // Kartica z oznako se ne shrani (ime ne sodi v kartico, preverjanje kartic bi ga poslalo modelu).
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM flashcards WHERE student_id = ?").get(s.id).n, 0);

    // 2. Star odgovor z imenom v zgodovini (pred spremembo; meja maskiranja v kv): pri naslednji potezi gre k modelu z oznako.
    store.db.prepare("UPDATE kv SET value = ? WHERE key = 'ime_oznaka_meja'").run(JSON.stringify({ id: row.id, at: "2026-11-18 00:00:00" }));
    store.setMessageContent(row.id, [{ type: "text", text: `Super, Zarjana! Koliko je 2 + 3?${META}` }], 0);
    const ev2 = await say({ text: "5" });
    assert.ok(ev2.some((e) => e.event === "done"), "druga poteza (vodenje)");
    // 3. »Razloži podrobneje« (močnejši model, isti pogovor).
    const ev3 = await say({ text: "5", deep: true });
    assert.ok(ev3.some((e) => e.event === "done" || e.event === "error"));
    // Ponovno odprt pogovor: gumbi in besedilo z imenom, brez oznake.
    const again = await call(`/api/conversations/${conv.id}`);
    assert.doesNotMatch(JSON.stringify(again.body.messages), /\{\{IME\}\}/);

    const chatCalls = calls.length;
    assert.ok(chatCalls >= 4, `klepet: ${chatCalls} klicev (odgovori, varnostni pregled, preverjanje)`);
    // Vsaka pot mora res poklicati model (sicer test ničesar ne preveri).
    const step = async (what, fn) => {
      const before = calls.length;
      await fn();
      assert.ok(calls.length > before, `${what}: ni klica modela`);
    };
    const img = "data:image/jpeg;base64," + Buffer.from("slika").toString("base64");
    // 4. Ustno spraševanje.
    await step("ustno", async () => {
      const u = await call(`/api/students/${s.id}/ustno/zacni`, { tema: "FIZ-OS-9/upor-in-ohmov-zakon", n: 3, nacin: "tipkanje" });
      assert.equal(u.status, 201, u.text.slice(0, 200));
      await call(`/api/students/${s.id}/ustno/${u.body.id}/odgovor`, { i: 0, besedilo: "Upor je razmerje med napetostjo in tokom, R = U / I.", nacin: "tipkanje" });
    });
    // 5. Zapiski, skener, urnik s fotografije, pogovor za mnenje.
    await step("zapiski", () => call(`/api/students/${s.id}/zapiski/preberi`, { image: img }));
    await step("skener (naloga)", () => call(`/api/students/${s.id}/scan/read-task`, { image: img }));
    await step("skener (rokopis)", () => call(`/api/students/${s.id}/scan/read`, { image: img }));
    await step("skener (rešitev)", () => call(`/api/students/${s.id}/scan/solve`, { text: "x+1=3" }));
    await step("urnik s fotografije", () => call(`/api/students/${s.id}/schedule/photo`, { image: img }));
    await step("mnenje (pogovor)", () => call(`/api/students/${s.id}/feedback/interview`, { answers: [{ q: "Kaj si uporabljal?", a: "Učno pot" }] }));
    assert.deepEqual(leaks(calls), [], "ime otroka je šlo k ponudniku AI");
  });
});

test("kar učenec sam napiše (svoje ime), ostane v njegovem sporočilu; prompt ga ne doda", async () => {
  await withSpy(async ({ call, sse, calls }) => {
    const s = (await call("/api/students", { name: NAME })).body;
    const conv = (await call(`/api/students/${s.id}/conversations`, {})).body;
    sse((await call(`/api/conversations/${conv.id}/messages`, { text: "Ime mi je Zarjana. Koliko je 2 + 3?" })).text);
    const tutor = calls.find((c) => c.kind === "stream" && /Aktivne nastavitve/.test(c.body));
    const p = JSON.parse(tutor.body);
    assert.doesNotMatch(JSON.stringify(p.system), LEAK, "sistemski prompt brez imena");
    assert.match(JSON.stringify(p.messages), /Ime mi je Zarjana/, "besedilo učenca ostane, kot je (dokumentirano)");
  });
});

test("nov odgovor z besedo, ki je enaka imenu (»Vid je čutilo«), se ne maskira; star (pred mejo) se", async () => {
  await withSpy(async ({ call, sse, calls, store }) => {
    const s = (await call("/api/students", { name: "Vid" })).body;
    const conv = (await call(`/api/students/${s.id}/conversations`, {})).body;
    sse((await call(`/api/conversations/${conv.id}/messages`, { text: "Koliko je 2 + 3?" })).text);
    const row = store.listMessages(conv.id).find((m) => m.role === "assistant");
    store.setMessageContent(row.id, [{ type: "text", text: `Vid je čutilo. Koliko čutil imamo?${META}` }], 0);
    const n = calls.length;
    sse((await call(`/api/conversations/${conv.id}/messages`, { text: "pet" })).text);
    const tutor = calls.slice(n).find((c) => c.kind === "stream" && /Aktivne nastavitve/.test(c.body));
    assert.ok(tutor.body.includes("Vid je čutilo."), "nov odgovor ostane, kot ga je napisal model");
    assert.ok(!tutor.body.includes("{{IME}} je čutilo"));
  });
  const old = [{ id: 2, role: "assistant", content: "Vid je čutilo." }, { id: 9, role: "assistant", content: "Vid je čutilo." }];
  assert.deepEqual(maskHistory(old, "Vid", 5).map((m) => m.content), ["{{IME}} je čutilo.", "Vid je čutilo."]);
});

// --- skupni predpomnilnik: obnašanje enako kot prej ---

test("predpomnilnik: shranjen odgovor z oznako, drugi otrok ga dobi s svojim imenom brez novega klica", async () => {
  const store = openDb(":memory:");
  let n = 0;
  const seen = [];
  const streamFn = async ({ system, messages, onText }) => {
    n++;
    seen.push(JSON.stringify({ system, messages }));
    const text = `Bravo, {{IME}}! 1/2 + 1/3 = 5/6.${META}`;
    onText(text.slice(0, 9));
    onText(text.slice(9));
    return { content: [{ type: "text", text }], text, stopReason: "end_turn", model: "claude-haiku-5-5", usage: { input_tokens: 100, output_tokens: 50 } };
  };
  const server = createApp(store, { streamFn }).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = async (p, body) => (await fetch(base + p, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })).text();
  const ask = async (name) => {
    const s = JSON.parse(await post("/api/students", { name }));
    const c = JSON.parse(await post(`/api/students/${s.id}/conversations`, {}));
    return { text: await post(`/api/conversations/${c.id}/messages`, { text: "Kako seštejem dva ulomka z različnima imenovalcema?" }), conv: c.id };
  };
  try {
    const a = await ask("Zala");
    assert.match(a.text, /Bravo, Zala!/);
    const cached = store.db.prepare("SELECT text FROM answer_cache").all().map((r) => r.text);
    assert.equal(cached.length, 1);
    assert.match(cached[0], /Bravo, \{\{IME\}\}!/, "v predpomnilniku je oznaka");
    const b = await ask("Mojca");
    assert.equal(n, 1, "drugi otrok (istega slovničnega spola) dobi shranjen odgovor");
    assert.match(b.text, /Bravo, Mojca!/);
    assert.doesNotMatch(b.text, /Zala|\{\{IME\}\}/);
    const row = store.listMessages(b.conv).find((m) => m.role === "assistant");
    assert.match(row.display_text, /Bravo, Mojca!/);
    assert.doesNotMatch(JSON.stringify(row.api_content), /Mojca/, "zgodovina za API z oznako tudi pri shranjenem odgovoru");
    // Drug slovnični spol: drug ključ (odgovor s »si rešila« ne gre fantu), nov klic.
    const c = await ask("Bor");
    assert.equal(n, 2);
    assert.match(c.text, /Bravo, Bor!/);
    assert.ok(seen.every((x) => !/Zala|Mojca|Bor/.test(x)));
  } finally {
    server.close();
  }
});

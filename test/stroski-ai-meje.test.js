// K2: prekinjen odgovor (učenec zapre aplikacijo) se zapiše v porabo, vprašanje ostane šteto.
// P1: izbris pogovora ne obide dnevne meje vprašanj (brezplačni paket in šolska licenca).
import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { streamReply, setClient, modeParams } from "../server/claude.js";
import { Usage } from "../server/usage.js";
import { withAccounts } from "./racuni-pomoc.js";

const META = '\n<<META subject=MAT topic="-" error=0 mode=A flag=none>>';

// Pošlje sporočilo in prekine povezavo ob prvem delu odgovora (kot zaprta aplikacija).
function postAndHangUp(base, convId, text) {
  return new Promise((resolve) => {
    const body = JSON.stringify({ text });
    const rq = http.request(
      `${base}/api/conversations/${convId}/messages`,
      { method: "POST", headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) } },
      (res) => {
        res.once("data", () => {
          rq.destroy();
          resolve();
        });
      },
    );
    rq.on("error", () => resolve());
    rq.end(body);
  });
}

const until = async (cond, ms = 3000) => {
  const end = Date.now() + ms;
  while (!cond() && Date.now() < end) await new Promise((r) => setTimeout(r, 20));
  return cond();
};

test("K2: prekinjen odgovor: delna poraba je zapisana, vprašanje ostane šteto", async () => {
  const store = openDb(":memory:");
  let calls = 0;
  const streamFn = async ({ onText, signal }) => {
    calls++;
    onText("Začnimo z ulomki. Ulomek ima števec in imenovalec, ki ju zapišemo eden nad drugim.\n\nPrimer: ");
    await new Promise((resolve, reject) => {
      const t = setTimeout(resolve, 2000);
      signal?.addEventListener("abort", () => {
        clearTimeout(t);
        // kot server/claude.js: napaka nese porabo do prekinitve
        reject(Object.assign(new Error("Request was aborted."), { usage: { input_tokens: 5000, output_tokens: 300 }, model: "claude-haiku-4-5" }));
      });
    });
    return { text: "konec" + META, stopReason: "end_turn", usage: { input_tokens: 5000, output_tokens: 800 }, model: "claude-haiku-4-5" };
  };
  const server = createApp(store, { scheduler: false, streamFn }).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const s = await (await fetch(`${base}/api/students`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "Ana", settings: { level: "OS", grade: 8 } }) })).json();
    const conv = await (await fetch(`${base}/api/students/${s.id}/conversations`, { method: "POST" })).json();
    for (let i = 0; i < 2; i++) {
      await postAndHangUp(base, conv.id, `Razloži ulomke ${i}`);
      assert.ok(await until(() => store.db.prepare("SELECT COUNT(*) n FROM usage WHERE kind = 'prekinjeno'").get().n === i + 1), "poraba prekinjenega klica");
      await until(() => !store.db.prepare("SELECT COUNT(*) n FROM messages WHERE role='user'").get().n);
    }
    assert.equal(calls, 2);
    const rows = store.db.prepare("SELECT kind, input_tokens, output_tokens, cost_usd FROM usage").all();
    assert.equal(rows.length, 2);
    assert.ok(rows.every((r) => r.kind === "prekinjeno" && r.input_tokens === 5000 && r.output_tokens === 300 && r.cost_usd > 0));
    assert.equal(new Usage(store.db).questionsToday(s.id), 2, "prekinjena vprašanja štejejo v dnevno mejo");
  } finally {
    server.close();
  }
});

// Kot pravi API: message_delta (končni izhod) pride šele tik pred message_stop, zato ga prekinjen tok nima.
test("K2: streamReply ob prekinitvi priloži napaki porabo (vhod iz message_start, izhod = max_tokens kroga)", async () => {
  const events = [
    { type: "message_start", message: { model: "claude-haiku-4-5", usage: { input_tokens: 1200, output_tokens: 1, cache_read_input_tokens: 300 } } },
    { type: "content_block_delta", delta: { type: "text_delta", text: "Zač" } },
  ];
  setClient({
    beta: {
      messages: {
        stream: () => ({
          async *[Symbol.asyncIterator]() {
            for (const e of events) yield e;
            throw new Error("Request was aborted.");
          },
          finalMessage: async () => {
            throw new Error("ni končnega sporočila");
          },
        }),
      },
    },
  });
  // Brez ključa API je streamReply v načinu mock: za ta test lažen ključ (klic gre v lažni odjemalec).
  const prevKey = process.env.ANTHROPIC_API_KEY;
  const prevMock = process.env.EVKLID_MOCK;
  process.env.ANTHROPIC_API_KEY = "test-ni-pravi";
  delete process.env.EVKLID_MOCK;
  try {
    let text = "";
    await assert.rejects(
      streamReply({ system: "x", messages: [{ role: "user", content: "a" }], mode: "lite", onText: (t) => (text += t) }),
      (err) => {
        assert.equal(err.usage.input_tokens, 1200);
        assert.equal(err.usage.output_tokens, modeParams("lite").max_tokens);
        assert.equal(err.usage.cache_read_input_tokens, 300);
        assert.equal(err.model, "claude-haiku-4-5");
        return true;
      },
    );
    assert.equal(text, "Zač");
  } finally {
    setClient(null);
    if (prevKey === undefined) delete process.env.ANTHROPIC_API_KEY;
    else process.env.ANTHROPIC_API_KEY = prevKey;
    if (prevMock !== undefined) process.env.EVKLID_MOCK = prevMock;
  }
});

test("K2: napaka API (ne prekinitev) vprašanja ne šteje", async () => {
  const store = openDb(":memory:");
  const app = createApp(store, {
    scheduler: false,
    streamFn: async () => {
      throw Object.assign(new Error("overloaded"), { status: 529 });
    },
  });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const s = store.createStudent("Ana", { level: "OS", grade: 8 });
    const conv = store.createConversation(s.id);
    const res = await fetch(`${base}/api/conversations/${conv.id}/messages`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: "Razloži ulomke" }) });
    await res.text();
    assert.equal(new Usage(store.db).questionsToday(s.id), 0);
  } finally {
    server.close();
  }
});

// Pošilja po dve vprašanji v nov pogovor in ga izbriše; vrne število odgovorjenih vprašanj.
async function askAndDelete(call, kidId, rounds) {
  let answered = 0;
  for (let round = 0; round < rounds; round++) {
    const conv = (await call(`/api/students/${kidId}/conversations`, { method: "POST" })).body;
    for (let i = 0; i < 2; i++) {
      const r = await call(`/api/conversations/${conv.id}/messages`, { method: "POST", body: { text: `vprašanje ${round}${i}` } });
      if (r.status === 200) answered++;
    }
    assert.equal((await call(`/api/conversations/${conv.id}`, { method: "DELETE" })).status, 200);
  }
  return answered;
}

test("P1: brezplačni paket: izbris pogovora ne obide dnevne meje", async () => {
  await withAccounts({ EVKLID_FREE_DAILY_QUESTIONS: "2" }, async ({ call, kid }) => {
    assert.equal(await askAndDelete(call, kid.id, 3), 2);
    const acc = await call("/api/account");
    assert.equal(acc.body.children[0].questions_today, 2);
  });
});

test("P1: šolska licenca: izbris pogovora ne obide dnevne meje", async () => {
  await withAccounts({ EVKLID_SOLA_DAILY_QUESTIONS: "3" }, async ({ call, kid, members }) => {
    members.push(kid.id);
    assert.equal(await askAndDelete(call, kid.id, 3), 3);
  });
});

test("P1: migracija: današnja vprašanja iz obstoječih pogovorov se prenesejo v question_log", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-qlog-"));
  const file = path.join(dir, "t.db");
  try {
    const store = openDb(file);
    const s = store.createStudent("Ana");
    const c = store.createConversation(s.id);
    store.addMessage(c.id, "user", [{ type: "text", text: "a" }], "a");
    store.addMessage(c.id, "user", [{ type: "text", text: "b" }], "b");
    store.db.exec("DROP TABLE question_log"); // baza pred posodobitvijo
    store.db.close();
    const again = openDb(file);
    assert.equal(new Usage(again.db).questionsToday(s.id), 2);
    again.logQuestion(s.id);
    again.db.close();
    const third = openDb(file); // ponovni zagon ne prešteje znova
    assert.equal(new Usage(third.db).questionsToday(s.id), 3);
    third.db.close();
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

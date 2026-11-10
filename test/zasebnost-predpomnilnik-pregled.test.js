// Pregled #484 (A): vsak osebni podatek iz prompta je v ključu answer_cache ali izklopi predpomnilnik.
// Model v testu prepiše eno vrstico »Aktivnih nastavitev« v odgovor; drug učenec je ne sme dobiti.
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

const META = '\n<<META subject=MAT topic="ulomki" error=0 mode=A flag=none done=0>>';
const Q = "Kako seštejem dva ulomka z različnima imenovalcema?";

async function withServer(line, fn) {
  const store = openDb(":memory:");
  let calls = 0;
  const streamFn = async ({ system, onText }) => {
    calls++;
    const sys = Array.isArray(system) ? system.map((b) => b.text || "").join("\n") : String(system || "");
    const val = new RegExp(`- ${line}[^:]*: (.*)`).exec(sys)?.[1] || "";
    const text = `Vem o tebi: ${val}. 1/2 + 1/3 = 5/6.${META}`;
    onText(text);
    return { content: [{ type: "text", text }], text, stopReason: "end_turn", model: "claude-haiku-5-5", usage: { input_tokens: 100, output_tokens: 50 } };
  };
  const app = createApp(store, { streamFn });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (path, opts = {}) => {
    const res = await fetch(base + path, { method: opts.method || "GET", headers: { "Content-Type": "application/json" }, body: opts.body ? JSON.stringify(opts.body) : undefined });
    const type = res.headers.get("content-type") || "";
    return { status: res.status, body: type.includes("json") ? await res.json() : await res.text() };
  };
  const ask = async (name, settings = {}, prep = null) => {
    const s = (await call("/api/students", { method: "POST", body: { name, settings } })).body;
    if (prep) prep(s.id);
    const c = (await call(`/api/students/${s.id}/conversations`, { method: "POST" })).body;
    return (await call(`/api/conversations/${c.id}/messages`, { method: "POST", body: { text: Q } })).body;
  };
  try {
    await fn({ ask, calls: () => calls, store });
  } finally {
    server.close();
  }
}

test("ročne šibke točke prvega otroka ne gredo drugemu", async () => {
  await withServer("Znane šibke točke", async ({ ask, store }) => {
    const a = await ask("Zala", {}, (id) => store.updateStudent(id, { manual_weaknesses: ["disleksija pri branju"] }));
    assert.match(a, /disleksija/);
    const b = await ask("Bor");
    assert.doesNotMatch(b, /disleksija/);
  });
});

test("cilj in datum cilja prvega otroka ne gresta drugemu", async () => {
  await withServer("Šolski sistem", async ({ ask }) => {
    const a = await ask("Zala", { goal: "npz", curriculum_level: "9. razred", goal_date: "2099-05-06" });
    assert.match(a, /cilj učenca/);
    const b = await ask("Bor", { curriculum_level: "9. razred" });
    assert.doesNotMatch(b, /cilj učenca/);
  });
});

test("osebnost (prosto besedilo) prvega otroka ne gre drugemu", async () => {
  await withServer("Osebnost/tema", async ({ ask }) => {
    const a = await ask("Zala", { personality_setting: "kot babica Mici" });
    assert.match(a, /babica Mici/);
    const b = await ask("Bor");
    assert.doesNotMatch(b, /Mici/);
  });
});

test("ime: drugi otrok dobi shranjen odgovor s svojim imenom", async () => {
  await withServer("Ime učenca", async ({ ask, calls }) => {
    await ask("Zala");
    const b = await ask("Bor");
    assert.equal(calls(), 1);
    assert.doesNotMatch(b, /Zala/);
    assert.match(b, /Bor/);
  });
});

// Po pregledu B (P2-3) z zanimanji ni skupnega odgovora (strožje kot ključ z zanimanji): vsak dobi svojega.
test("zanimanja: odgovor ni skupen, tudi pri enakih zanimanjih", async () => {
  await withServer("Zanimanja učenca", async ({ ask, calls }) => {
    await ask("Ana", { interests: ["space", "robots"] });
    await ask("Bor", { interests: ["robots", "space"] });
    assert.equal(calls(), 2);
  });
});

test("že ena rešena naloga (1 od 1) prvega otroka ne gre drugemu", async () => {
  await withServer("Rezultati učenca", async ({ ask, store }) => {
    const a = await ask("Zala", {}, (id) =>
      store.db.prepare("INSERT INTO tasks (student_id, topic_id, level, payload, first_try_correct) VALUES (?, 'x', 2, '{}', 1)").run(id),
    );
    assert.match(a, /1 od 1/);
    const b = await ask("Bor");
    assert.doesNotMatch(b, /1 od 1/);
  });
});

test("rezultati prvega otroka (število nalog v Vadnici) ne gredo drugemu", async () => {
  await withServer("Rezultati učenca", async ({ ask, store }) => {
    // 10 nalog, 3 pravilne v prvem poskusu: zahtevnost ostane »osnovna«, enaka kot brez podatkov.
    const tasks = (id) => {
      const ins = store.db.prepare("INSERT INTO tasks (student_id, topic_id, level, payload, first_try_correct) VALUES (?, 'x', 1, '{}', ?)");
      for (let i = 0; i < 10; i++) ins.run(id, i < 3 ? 1 : 0);
    };
    const a = await ask("Zala", {}, tasks);
    assert.match(a, /3 od 10/);
    const b = await ask("Bor");
    assert.doesNotMatch(b, /3 od 10/, "drug otrok ne sme dobiti rezultatov prvega otroka");
  });
});

test("studentResults.personal: nova tema brez vaj ni osebna, stopnja 2/3 ali začetni test je", async () => {
  const { studentResults } = await import("../server/results.js");
  const store = openDb(":memory:");
  const s = store.createStudent("Zala");
  const topic = "MAT-OS-6/deljivost";
  assert.equal(studentResults(store, s.id).personal, false);
  assert.equal(studentResults(store, s.id, topic).personal, false, "tema učne poti brez vaj: odgovor ostane skupen");
  store.db.prepare("INSERT INTO topic_state (student_id, topic_id, status, level) VALUES (?, ?, 'learning', 2)").run(s.id, topic);
  const r = studentResults(store, s.id, topic);
  assert.match(r.text, /2\/3/);
  assert.equal(r.personal, true);
});

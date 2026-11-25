// P1-4 (načrt kakovosti pred obsegom, j 25. 11. 2026): ustno spraševanje posodobi šibke točke. Šteje samo vprašanje,
// ki ga je ocenilo spraševanje (koda ali model s pregledom), nikoli samoocena; eno spraševanje v enem dnevu samo ne
// naredi šibke teme (TOOL_DAY_MAX.ustno < MIN_ERRORS_ONE_DAY, napake sorazmerno); dvakratni »konec« ne šteje dvakrat;
// »Ne vem« in »Preskoči« ne štejeta.
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { REVIEW_SYSTEM } from "../server/ustno.js";
import { skillStats, TOOL_DAY_MAX, MIN_ERRORS_ONE_DAY, SOURCES, recordUstno } from "../server/weaknesses.js";
import { sourceWords } from "../server/accounts/weekly.js";

const OHM = "FIZ-OS-9/upor-in-ohmov-zakon";

// Lažen model: vsak pojem »napačno« (pregled ga pusti napačnega), da je vsak odgovor slab.
const fn = async (p) => {
  const user = p.messages[0].content;
  const ans = /<student_answer>\n([\s\S]*?)\n<\/student_answer>/.exec(user)?.[1] || "";
  const kps = [...user.matchAll(/^KP(\d+): /gm)].map((m) => Number(m[1]));
  const quote = ans.split(" ").slice(0, 3).join(" ");
  const out = p.system === REVIEW_SYSTEM ? { points: kps.map((kp) => ({ kp, status: "napacno", quote })) } : { points: kps.map((kp) => ({ kp, status: "napacno", quote })), followup: "", feedback: "" };
  return { content: [{ type: "text", text: JSON.stringify(out) }], usage: { input_tokens: 800, output_tokens: 300 }, model: p.model, stop_reason: "end_turn" };
};

async function local(run) {
  const store = openDb(":memory:");
  const app = createApp(store, { scheduler: false, ustnoFn: fn });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (p, body) => {
    const r = await fetch(base + p, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body || {}) });
    return { status: r.status, body: await r.json() };
  };
  try {
    const s = (await call("/api/students", { name: "Ana", grade: 9 })).body;
    await run({ call, store, sid: s.id, student: store.getStudent(s.id) });
  } finally {
    server.close();
  }
}

const ustno = (store, sid) => skillStats(store, store.getStudent(sid)).find((x) => x.topic_id === OHM)?.sources?.ustno;

test("ustno je vir šibkih točk z mejo, ki sama v enem dnevu ne naredi šibke teme", () => {
  assert.ok(SOURCES.includes("ustno"));
  assert.ok(TOOL_DAY_MAX.ustno < MIN_ERRORS_ONE_DAY);
  assert.equal(sourceWords({ ustno: { n: 2, wrong: 2 } }), "pri ustnem spraševanju");
});

test("spraševanje z oceno: napačni odgovori gredo v šibke točke (največ TOOL_DAY_MAX), dvakratni konec ne šteje dvakrat", async () => {
  await local(async ({ call, store, sid }) => {
    const r = await call(`/api/students/${sid}/ustno/zacni`, { tema: OHM, n: 5, nacin: "tipkanje" });
    assert.equal(r.status, 201, JSON.stringify(r.body));
    for (const q of r.body.vprasanja) {
      const a = await call(`/api/students/${sid}/ustno/${r.body.id}/odgovor`, { i: q.i, besedilo: "tok je odvisen od napetosti in upora", rezultat: "999", nacin: "tipkanje" });
      assert.equal(a.status, 200, JSON.stringify(a.body));
    }
    const end = await call(`/api/students/${sid}/ustno/${r.body.id}/konec`, {});
    assert.equal(end.body.dobro, 0);
    assert.deepEqual(ustno(store, sid), { n: TOOL_DAY_MAX.ustno, wrong: TOOL_DAY_MAX.ustno });
    await call(`/api/students/${sid}/ustno/${r.body.id}/konec`, {});
    assert.deepEqual(ustno(store, sid), { n: TOOL_DAY_MAX.ustno, wrong: TOOL_DAY_MAX.ustno }, "drugi konec ne zapiše ničesar");
    const w = skillStats(store, store.getStudent(sid)).find((x) => x.topic_id === OHM);
    assert.equal(w.weak, false, "eno spraševanje samo ne naredi šibke teme");
  });
});

test("samoocena (celo spraševanje ali eno vprašanje po vzorcu) ne gre v šibke točke", async () => {
  await local(async ({ call, store, sid }) => {
    const so = await call(`/api/students/${sid}/ustno/samoocena`, { tema: OHM, n: 3 });
    assert.equal(so.status, 201, JSON.stringify(so.body));
    await call(`/api/students/${sid}/ustno/${so.body.id}/konec`, { samoocena: ["neznam", "neznam", "neznam"] });
    assert.equal(ustno(store, sid), undefined);

    const r = await call(`/api/students/${sid}/ustno/zacni`, { tema: OHM, n: 3, nacin: "tipkanje" });
    const j = 0;
    assert.equal((await call(`/api/students/${sid}/ustno/${r.body.id}/vzorec`, { i: j })).status, 200);
    const self = [];
    self[j] = "neznam";
    await call(`/api/students/${sid}/ustno/${r.body.id}/konec`, { samoocena: self });
    assert.equal(ustno(store, sid), undefined, "neodgovorjena in samoocenjena vprašanja ne štejejo");
  });
});

test("meja na temo na dan: napake sorazmerno, ne po vrstnem redu; ena seja enkrat", () => {
  const store = openDb(":memory:");
  const sid = store.createStudent("Ana").id;
  const r = [true, true, false, false, false].map((ok) => ({ topicId: OHM, ok }));
  assert.equal(recordUstno(store.db, sid, 1, r), 2);
  assert.deepEqual(ustno(store, sid), { n: 2, wrong: 1 }, "3 od 5 napačnih → 1 od 2");
  assert.equal(recordUstno(store.db, sid, 1, r), 0, "ista seja ne šteje dvakrat");
  assert.equal(recordUstno(store.db, sid, 2, r), 0, "dnevna meja je polna");
  assert.equal(recordUstno(store.db, sid, 3, [{ topicId: "X/y", ok: false }, { topicId: OHM, ok: "da" }]), 0, "neveljavna tema ali ok");
});

test("»Ne vem« in »Preskoči« (preskoci) nista napaka", async () => {
  await local(async ({ call, store, sid }) => {
    const r = await call(`/api/students/${sid}/ustno/zacni`, { tema: OHM, n: 3, nacin: "tipkanje" });
    for (const q of r.body.vprasanja) assert.equal((await call(`/api/students/${sid}/ustno/${r.body.id}/odgovor`, { i: q.i, besedilo: "", preskoci: true, nacin: "tipkanje" })).status, 200);
    await call(`/api/students/${sid}/ustno/${r.body.id}/konec`, {});
    assert.equal(ustno(store, sid), undefined);
  });
});

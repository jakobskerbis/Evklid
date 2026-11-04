// Pravice iz vseh virov (server/placila/pravice.js): osebni paket in šolska licenca se seštejeta.
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import {
  rights,
  schoolCovers,
  schoolValid,
  lessonInteractive,
} from "../server/placila/pravice.js";
import { createSchoolSource } from "../server/placila/sola-vir.js";

const YEAR = new Date().getFullYear();
const DAY = 86400000;
const iso = (days) => new Date(Date.now() + days * DAY).toISOString();
const MAT = "MAT-OS-8/cela-stevila";
const FIZ = "FIZ-OS-8/fizikalne-kolicine-in-enote";

test("rights: viri se seštejejo, šola do Sonneta, Osebno do Opusa", () => {
  const school = {
    id: 1,
    subjects: '["MAT"]',
    grades: null,
    valid_until: iso(30),
    ai_month_usd: 5,
    ai_spent_usd: 1,
  };
  const free = rights({ freeDaily: 10 });
  assert.deepEqual(
    [free.sources, free.dailyQuestions, free.maxModel, free.scan],
    [[], 10, null, false],
  );
  const s = rights({ schools: [school] });
  assert.deepEqual(
    [s.sources, s.dailyQuestions, s.maxModel, s.allSubjects, s.scan],
    [["sola"], 15, "sonnet", false, false],
  );
  const o = rights({ personal: { tier: "paid", until: iso(10) } });
  assert.deepEqual(
    [
      o.sources,
      o.dailyQuestions,
      o.maxModel,
      o.scan,
      o.testPlan,
      o.parentReport,
    ],
    [["osebno"], 60, "opus", true, true, true],
  );
  const both = rights({
    personal: { tier: "paid", until: iso(10) },
    schools: [school],
  });
  assert.deepEqual(
    [both.sources, both.dailyQuestions, both.maxModel],
    [["osebno", "sola"], 75, "opus"],
  );
  assert.equal(both.until, school.valid_until); // kasnejši konec
  // Potekla licenca ne daje pravic. Porabljena meja AI (j 2026-11-04) ustavi samo šolski AI:
  // vsebine ostanejo, inštruktor deluje kot v brezplačnem paketu (vprašanja na dan, brez Sonneta).
  assert.equal(schoolValid({ ...school, valid_until: iso(-1) }), false);
  assert.equal(schoolValid({ ...school, ai_spent_usd: 5 }), true);
  const out = rights({ schools: [{ ...school, ai_spent_usd: 5 }], freeDaily: 10 });
  assert.deepEqual([out.school, out.schoolAiOut, out.dailyQuestions, out.maxModel], [true, true, 10, null]);
  assert.equal(rights({ schools: [school] }).schoolAiOut, false);
  // Z osebnim paketom: šola brez AI ne prišteje ničesar (kot samo Osebno), Opus ostane.
  const ownOut = rights({ personal: { tier: "paid", until: iso(10) }, schools: [{ ...school, ai_spent_usd: 5 }], freeDaily: 10 });
  assert.deepEqual([ownOut.schoolAiOut, ownOut.dailyQuestions, ownOut.maxModel], [true, 60, "opus"]);
  assert.equal(
    schoolValid({ ...school, ai_month_usd: 0, ai_spent_usd: 99 }),
    true,
  );
  assert.deepEqual(
    rights({ schools: [{ ...school, valid_until: iso(-1) }] }).sources,
    [],
  );
  // 0 v okolju = brez omejitve.
  process.env.EVKLID_OSEBNO_DAILY_QUESTIONS = "0";
  try {
    assert.equal(
      rights({ personal: { tier: "paid" }, schools: [school] }).dailyQuestions,
      null,
    );
  } finally {
    delete process.env.EVKLID_OSEBNO_DAILY_QUESTIONS;
  }
});

test("rights: šolska licenca pokriva svoje predmete in razrede, fakultete ne", () => {
  const s = { subjects: '["MAT"]', grades: '["OS-8"]' };
  assert.equal(schoolCovers(s, MAT), true);
  assert.equal(schoolCovers(s, FIZ), false);
  assert.equal(
    schoolCovers({ subjects: null, grades: '["OS-9"]' }, MAT),
    false,
  );
  assert.equal(schoolCovers({ subjects: null, grades: null }, FIZ), true);
  assert.equal(
    schoolCovers({ subjects: null, grades: null }, "ne-obstaja"),
    false,
  );
  // Druge oblike zapisa iz server/schools.js: številka razreda, »MAT, FIZ«, male črke, »OŠ-8«; pokvarjen JSON ne pokrije ničesar.
  assert.equal(schoolCovers({ subjects: ["mat"], grades: [8] }, MAT), true);
  assert.equal(schoolCovers({ subjects: "FIZ, MAT", grades: "8" }, MAT), true);
  assert.equal(schoolCovers({ subjects: null, grades: ["OŠ-8"] }, MAT), true);
  assert.equal(schoolCovers({ subjects: null, grades: ["2"] }, MAT), false);
  assert.equal(schoolCovers({ subjects: '["MAT"', grades: null }, MAT), false);
  // Rok brez ure velja ves ta dan.
  const today = new Date().toISOString().slice(0, 10);
  assert.equal(schoolValid({ valid_until: today }), true);
  assert.equal(schoolValid({ valid_until: iso(-1).slice(0, 10) }), false);
  const r = rights({ schools: [{ id: 1, ...s }] });
  assert.equal(lessonInteractive(r, MAT), true);
  assert.equal(lessonInteractive(r, FIZ), false);
  assert.equal(
    lessonInteractive(rights({ personal: { tier: "pass" } }), FIZ),
    true,
  );
});

function fakeFetch(calls) {
  return async (url, init = {}) => {
    const u = new URL(url);
    const body = init.body ? JSON.parse(init.body) : null;
    calls.push({ host: u.host, body });
    return { ok: true, status: 200, json: async () => ({ id: "x" }) };
  };
}

// Lažni server/schools.js: licence po učencih, prvih »seats« učencev dobi licenco.
function fakeSchools() {
  const licences = new Map(); // schoolId → licenca
  const members = new Map(); // schoolId → [studentId]
  return {
    add(schoolId, lic) {
      licences.set(schoolId, {
        schoolId,
        schoolName: "OŠ Test",
        licenceId: schoolId * 10,
        plan: "class",
        seats: 1,
        subjects: null,
        grades: null,
        validUntil: null,
        aiCapUsdMonth: 0,
        ...lic,
      });
      if (!members.has(schoolId)) members.set(schoolId, []);
    },
    set: (schoolId, fields) => Object.assign(licences.get(schoolId), fields),
    join: (schoolId, studentId) => members.get(schoolId).push(studentId),
    source: {
      access(db, studentId) {
        for (const [id, ids] of members) {
          const l = licences.get(id);
          if (ids.slice(0, l.seats).includes(studentId)) return l;
        }
        return null;
      },
      students: (db, schoolId) => members.get(schoolId) || [],
    },
  };
}

async function withServer(fn) {
  const store = openDb(":memory:");
  const schools = fakeSchools();
  const calls = [];
  const modes = [];
  const app = createApp(store, {
    accounts: true,
    scheduler: false,
    resendKey: "re_x",
    fetchFn: fakeFetch(calls),
    log: { error() {} },
    schoolSource: schools.source,
    streamFn: async ({ mode, onText }) => {
      modes.push(mode);
      onText("ok");
      return {
        text: 'ok\n<<META subject=MAT topic="-" error=0 mode=A flag=none>>',
        stopReason: "end_turn",
      };
    },
  });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const jar = {};
  const call = async (path, opts = {}) => {
    const res = await fetch(base + path, {
      method: opts.method || "GET",
      redirect: "manual",
      headers: {
        "Content-Type": "application/json",
        cookie: Object.entries(jar)
          .map(([k, v]) => `${k}=${v}`)
          .join("; "),
      },
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    });
    for (const c of res.headers.getSetCookie()) {
      const [kv] = c.split(";");
      const i = kv.indexOf("=");
      jar[kv.slice(0, i)] = kv.slice(i + 1);
    }
    const type = res.headers.get("content-type") || "";
    return {
      status: res.status,
      body: type.includes("json") ? await res.json() : await res.text(),
    };
  };
  try {
    const r = await call("/api/auth/register", {
      method: "POST",
      body: {
        email: "sola@kod.si",
        password: "geslo1234",
        accept_privacy: true,
        birth_date: "1985-04-12",
      },
    });
    assert.equal(r.status, 201, JSON.stringify(r.body));
    const mail = calls.filter((c) => c.host === "api.resend.com").at(-1);
    await call(/\/api\/auth\/verify\?token=[\w-]+/.exec(mail.body.text)[0]);
    const kid = (
      await call("/api/students", {
        method: "POST",
        body: { name: "Lan", birth_year: YEAR - 13, consent: true },
      })
    ).body;
    // Brez preizkusa: učenec je v brezplačnem paketu, dokler mu šola ne da licence.
    store.db
      .prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z'")
      .run();
    await fn({ call, store, kid, modes, schools, parentId: r.body.parent.id });
  } finally {
    server.close();
  }
}

test("šolska licenca v aplikaciji: interaktivne lekcije za šolske predmete, 15 vprašanj, največ Sonnet", async () => {
  await withServer(async ({ call, store, kid, modes, schools, parentId }) => {
    const lesson = (id) =>
      call(`/api/students/${kid.id}/lesson?id=${encodeURIComponent(id)}`);
    assert.equal((await lesson(MAT)).body.interactive, false);

    schools.add(1, {
      subjects: ["MAT"],
      grades: ["OS-8"],
      validUntil: iso(60),
      aiCapUsdMonth: 5,
      seats: 2, // tudi sošolec spodaj ima mesto: v mejo AI šole šteje samo poraba učencev z mestom
    });
    schools.join(1, kid.id);
    assert.equal((await lesson(MAT)).body.interactive, true);
    assert.equal((await lesson(FIZ)).body.interactive, false);
    const acc = await call("/api/account");
    assert.equal(acc.body.children[0].premium, true);
    assert.equal(acc.body.children[0].school, true);

    // »Razloži podrobneje«: Haiku z razmislekom, nato vedno Sonnet (nikoli Opus).
    const conv = (
      await call(`/api/students/${kid.id}/conversations`, { method: "POST" })
    ).body;
    const again = () =>
      call(`/api/conversations/${conv.id}/messages`, {
        method: "POST",
        body: { text: "Razloži podrobneje.", deep: true },
      });
    for (let i = 0; i < 3; i++) assert.equal((await again()).status, 200);
    assert.deepEqual(modes, ["think", "mid", "mid"]);

    // 15 vprašanj na dan, brez ponudbe nakupa.
    for (let i = 0; i < 12; i++)
      store.addMessage(
        conv.id,
        "user",
        [{ type: "text", text: "x" }],
        "x",
        false,
      );
    const over = await call(`/api/conversations/${conv.id}/messages`, {
      method: "POST",
      body: { text: "Še eno?" },
    });
    assert.equal(over.status, 429);
    assert.match(over.body.error, /vseh 15 vprašanj/);
    assert.equal(over.body.upgrade, undefined);

    // Osebni paket se prišteje: 75 na dan in Opus ob 3. prošnji.
    store.db
      .prepare(
        "UPDATE parents SET sub_status = 'active', sub_seats = 1 WHERE id = ?",
      )
      .run(parentId);
    assert.equal((await lesson(FIZ)).body.interactive, true);
    const c2 = (
      await call(`/api/students/${kid.id}/conversations`, { method: "POST" })
    ).body;
    const again2 = () =>
      call(`/api/conversations/${c2.id}/messages`, {
        method: "POST",
        body: { text: "Še podrobneje, prosim.", deep: true },
      });
    for (let i = 0; i < 3; i++) assert.equal((await again2()).status, 200);
    assert.deepEqual(modes.slice(-3), ["think", "mid", "deep"]);
    store.db
      .prepare("UPDATE parents SET sub_status = NULL WHERE id = ?")
      .run(parentId);

    // Porabljena mesečna meja AI šole (j 2026-11-04): vsebine ostanejo do konca licence, ustavi se samo
    // šolski AI (inštruktor kot v brezplačnem paketu).
    store.db
      .prepare(
        "INSERT INTO usage (student_id, model, kind, cost_usd) VALUES (?, 'claude-haiku', 'chat', 6)",
      )
      .run(kid.id);
    createSchoolSource(store.db).clearCache();
    assert.equal((await lesson(MAT)).body.interactive, true);
    assert.equal((await call("/api/account")).body.children[0].premium, true);
    // Inštruktor kot brezplačni paket: brez Sonneta (»Razloži podrobneje« ostane pri razmisleku) in 10 vprašanj na dan.
    // Porabo šole prenesemo na sošolca, da učenca ne ustavi njegova lastna mesečna meja.
    const mate = store.createStudent("Ana");
    store.db.prepare("UPDATE students SET parent_id = ? WHERE id = ?").run(parentId, mate.id);
    schools.join(1, mate.id);
    store.db.prepare("UPDATE usage SET student_id = ? WHERE student_id = ? AND cost_usd = 6").run(mate.id, kid.id);
    createSchoolSource(store.db).clearCache();
    store.db.prepare("UPDATE messages SET created_at = datetime('now', '-2 day')").run();
    const prevPool = process.env.EVKLID_FREE_POOL_USD;
    process.env.EVKLID_FREE_POOL_USD = "100"; // skupni brezplačni sklad (10 $) bi sicer ustavil prej
    try {
      const c3 = (await call(`/api/students/${kid.id}/conversations`, { method: "POST" })).body;
      for (let i = 0; i < 3; i++)
        { const x = await call(`/api/conversations/${c3.id}/messages`, { method: "POST", body: { text: "Pojasni še enkrat.", deep: true } }); assert.equal(x.status, 200, JSON.stringify(x.body)); }
      assert.deepEqual(modes.slice(-3), ["think", "think", "think"]);
      for (let i = 0; i < 7; i++) store.addMessage(c3.id, "user", [{ type: "text", text: "x" }], "x", false);
      const out = await call(`/api/conversations/${c3.id}/messages`, { method: "POST", body: { text: "Še eno?" } });
      assert.equal(out.status, 429);
      assert.match(out.body.error, /vseh 10 brezplačnih vprašanj/);
    } finally {
      if (prevPool === undefined) delete process.env.EVKLID_FREE_POOL_USD;
      else process.env.EVKLID_FREE_POOL_USD = prevPool;
    }
    // Brezplačni sklad za vse (10 $) velja tudi zanj: sošolčevih 6 $ šteje vanj, zdaj je sklad porabljen.
    store.db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd) VALUES (?, 'claude-haiku', 'chat', 5)").run(mate.id);
    store.db.prepare("UPDATE messages SET created_at = datetime('now', '-2 day')").run();
    const c4 = (await call(`/api/students/${kid.id}/conversations`, { method: "POST" })).body;
    const capped = await call(`/api/conversations/${c4.id}/messages`, { method: "POST", body: { text: "Še eno?" } });
    assert.equal(capped.status, 429);
    assert.match(capped.body.error, /za vse porabljena/);
    assert.equal((await lesson(MAT)).body.interactive, true);
  });
});

test("šolska licenca: le prvih »seats« učencev, potekla licenca nič", async () => {
  await withServer(async ({ call, store, kid, schools }) => {
    store.db.prepare("UPDATE parents SET trial_ends_at = ?").run(iso(5));
    const other = (
      await call("/api/students", {
        method: "POST",
        body: { name: "Ana", birth_year: YEAR - 13, consent: true },
      })
    ).body;
    store.db
      .prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z'")
      .run();
    assert.ok(other.id, JSON.stringify(other));
    schools.add(2, { seats: 1 });
    schools.join(2, other.id);
    schools.join(2, kid.id);
    const lesson = async (id) =>
      (await call(`/api/students/${id}/lesson?id=${encodeURIComponent(MAT)}`))
        .body.interactive;
    assert.deepEqual(
      [await lesson(other.id), await lesson(kid.id)],
      [true, false],
    );
    schools.set(2, { seats: 2 });
    assert.equal(await lesson(kid.id), true);
    schools.set(2, { validUntil: iso(-1) });
    assert.equal(await lesson(kid.id), false);
  });
});

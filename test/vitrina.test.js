import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { KNOWLEDGE } from "../public/zbirke.js";
import { shareCardModel, shareCardSvg } from "../public/deli-kartico.js";
import SL from "../public/i18n/sl.js";

// Predmeta s temo (pogled »preglej« pokaže temo in datum) in še en predmet za vitrino.
const [A, B] = KNOWLEDGE.filter((x) => x.need?.t && x.collection === "pse");
const give = (db, studentId, x) =>
  db.prepare("INSERT INTO knowledge_items (student_id, item, topic_id, source, earned_at) VALUES (?, ?, ?, 'practice', '2026-10-30 08:15:00')").run(studentId, x.id, x.need.t[0]);

async function setup() {
  const store = openDb(":memory:");
  const app = createApp(store);
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (path, { method = "GET", body, headers = {} } = {}) => {
    const r = await fetch(base + path, { method, headers: { "Content-Type": "application/json", ...headers }, body: body && JSON.stringify(body) });
    return { status: r.status, body: await r.json() };
  };
  const student = async (name, code) => {
    const s = (await call("/api/students", { method: "POST", body: { name } })).body;
    if (code) assert.equal((await call(`/api/students/${s.id}/classes`, { method: "POST", body: { code } })).status, 201);
    return s;
  };
  return { store, server, call, student };
}

test("class showcase: opt-in is off by default; only classmates who opted in are shown, same class only", async () => {
  const { store, server, call, student } = await setup();
  try {
    const cls = (await call("/api/classes", { method: "POST", body: { name: "7.a" } })).body;
    const other = (await call("/api/classes", { method: "POST", body: { name: "7.b" } })).body;
    const ana = await student("Ana Novak", cls.code);
    const bor = await student("Bor Zupan", cls.code);
    const cene = await student("Cene Tujec", other.code);
    give(store.db, ana.id, A);
    give(store.db, ana.id, B);
    assert.equal((await call(`/api/students/${ana.id}/zbirke/vitrina`, { method: "POST", body: { items: [A.id, B.id] } })).status, 200);

    // Privzeto izklopljeno: Bor ne vidi nobene vitrine.
    let v = (await call(`/api/students/${bor.id}/vitrina`)).body;
    assert.equal(v.classes.length, 1);
    assert.equal(v.classes[0].on, false);
    assert.deepEqual(v.classes[0].list, []);
    assert.equal((await call(`/api/students/${ana.id}/vitrina`)).body.classes[0].on, false);

    // Ana vklopi: Bor vidi njen avatar, vzdevek (kot na lestvici), XP in predmete s temo in datumom.
    const classId = v.classes[0].id;
    assert.equal((await call(`/api/students/${ana.id}/classes/${classId}/vitrina`, { method: "PUT", body: { on: "da" } })).status, 400);
    assert.equal((await call(`/api/students/${ana.id}/classes/${classId}/vitrina`, { method: "PUT", body: { on: true } })).status, 200);
    v = (await call(`/api/students/${bor.id}/vitrina`)).body;
    const list = v.classes[0].list;
    assert.equal(list.length, 1);
    const board = (await call(`/api/students/${bor.id}/league`)).body.classes[0].board;
    assert.equal(list[0].nickname, board.find((r) => !r.me).nickname);
    assert.equal(list[0].me, false);
    assert.deepEqual(list[0].items.map((i) => i.item), [A.id, B.id]);
    assert.equal(list[0].items[0].date, "2026-10-30");
    assert.ok(list[0].items[0].topic.name && "path" in list[0].items[0].topic);

    // Drugi razred ne vidi ničesar in ne more vklopiti vitrine v tujem razredu.
    v = (await call(`/api/students/${cene.id}/vitrina`)).body;
    assert.equal(v.classes.length, 1);
    assert.notEqual(v.classes[0].id, classId);
    assert.deepEqual(v.classes[0].list, []);
    assert.equal((await call(`/api/students/${cene.id}/classes/${classId}/vitrina`, { method: "PUT", body: { on: true } })).status, 404);

    // Skupina prijateljev ni razred učitelja: tam vitrin ni.
    const fr = (await call(`/api/students/${ana.id}/friend-groups`, { method: "POST", body: { name: "Prijatelji" } })).body;
    assert.equal((await call(`/api/students/${ana.id}/classes/${fr.id}/vitrina`, { method: "PUT", body: { on: true } })).status, 404);
    assert.equal((await call(`/api/students/${ana.id}/vitrina`)).body.classes.length, 1);

    // Izklop skrije vitrino takoj; izstop iz razreda pobriše vklop (ob ponovnem vstopu je spet izklopljen).
    await call(`/api/students/${ana.id}/classes/${classId}/vitrina`, { method: "PUT", body: { on: false } });
    assert.deepEqual((await call(`/api/students/${bor.id}/vitrina`)).body.classes[0].list, []);
    await call(`/api/students/${ana.id}/classes/${classId}/vitrina`, { method: "PUT", body: { on: true } });
    await call(`/api/students/${ana.id}/classes/${classId}`, { method: "DELETE" });
    await call(`/api/students/${ana.id}/classes`, { method: "POST", body: { code: cls.code } });
    assert.equal((await call(`/api/students/${ana.id}/vitrina`)).body.classes[0].on, false);
    assert.deepEqual((await call(`/api/students/${bor.id}/vitrina`)).body.classes[0].list, []);
  } finally {
    server.close();
  }
});

test("class showcase: the teacher's switch cannot be bypassed", async () => {
  const { store, server, call, student } = await setup();
  try {
    const cls = (await call("/api/classes", { method: "POST", body: { name: "8.c" } })).body;
    const ana = await student("Ana Novak", cls.code);
    const bor = await student("Bor Zupan", cls.code);
    give(store.db, ana.id, A);
    await call(`/api/students/${ana.id}/zbirke/vitrina`, { method: "POST", body: { items: [A.id] } });
    const classId = (await call(`/api/students/${ana.id}/vitrina`)).body.classes[0].id;
    await call(`/api/students/${ana.id}/classes/${classId}/vitrina`, { method: "PUT", body: { on: true } });
    assert.equal((await call(`/api/students/${bor.id}/vitrina`)).body.classes[0].list.length, 1);

    assert.equal((await call(`/api/teacher/classes/${cls.code}/showcase`, { method: "PUT", body: { off: true } })).status, 403);
    assert.equal((await call(`/api/teacher/classes/${cls.code}/showcase`, { method: "PUT", body: { off: true }, headers: { "X-Teacher-Key": "narobe" } })).status, 403);
    assert.equal((await call(`/api/teacher/classes/${cls.code}/showcase`, { method: "PUT", body: { off: true }, headers: { "X-Teacher-Key": cls.teacherKey } })).status, 200);
    const v = (await call(`/api/students/${bor.id}/vitrina`)).body.classes[0];
    assert.equal(v.off, true);
    assert.deepEqual(v.list, []);
    assert.equal((await call(`/api/students/${ana.id}/vitrina`)).body.classes[0].on, false);
    assert.equal((await call(`/api/students/${bor.id}/classes/${classId}/vitrina`, { method: "PUT", body: { on: true } })).status, 403);
  } finally {
    server.close();
  }
});

test("class showcase: the API leaks no ids, names or other fields", async () => {
  const { store, server, call, student } = await setup();
  try {
    const cls = (await call("/api/classes", { method: "POST", body: { name: "9.a" } })).body;
    const ana = await student("Ana Skrivnostna", cls.code);
    const bor = await student("Bor Zupan", cls.code);
    store.db.prepare("UPDATE students SET settings = json_set(COALESCE(settings, '{}'), '$.school', 'OŠ Tajna') WHERE id = ?").run(ana.id);
    give(store.db, ana.id, A);
    await call(`/api/students/${ana.id}/zbirke/vitrina`, { method: "POST", body: { items: [A.id] } });
    const classId = (await call(`/api/students/${ana.id}/vitrina`)).body.classes[0].id;
    await call(`/api/students/${ana.id}/classes/${classId}/vitrina`, { method: "PUT", body: { on: true } });
    const body = (await call(`/api/students/${bor.id}/vitrina`)).body;
    const json = JSON.stringify(body);
    for (const bad of ["Skrivnostna", "Ana", "Tajna", "student_id", "studentId", "_id", "topic_id", "email", "school", "birth", "age", '"ref"']) assert.ok(!json.includes(bad), bad);
    const row = body.classes[0].list[0];
    assert.deepEqual(Object.keys(body.classes[0]).sort(), ["id", "list", "off", "on"]);
    assert.deepEqual(Object.keys(row).sort(), ["avatar", "items", "me", "month", "nickname", "rank", "xp"]);
    assert.deepEqual(Object.keys(row.items[0]).sort(), ["date", "item", "source", "topic"]);
    assert.deepEqual(Object.keys(row.items[0].topic).sort(), ["name", "path"]);
    assert.ok(!/\d{2}:\d{2}/.test(row.items[0].date), "samo datum, brez ure");
  } finally {
    server.close();
  }
});

test("share card: the model and the picture carry no name, nickname, school, class, e-mail or id", () => {
  const data = {
    id: 4711,
    name: "Ana Skrivnostna",
    nickname: "Zvedavi Ris 42",
    email: "ana@primer.si",
    school: "OŠ Tajna",
    class: "7.a",
    items: [{ id: A.id, at: "2026-10-30 08:15:00", topic: { id: A.need.t[0], name: "Tema", path: "Pot" } }, { id: B.id }],
    showcase: [A.id, B.id, "ni_predmeta", "pse_ne_obstaja"],
    avatar: { equipped: { body: "body_blue", nickname: "Zvedavi Ris 42" }, coins: 99 },
    pass: { tier: 7, tiers: 30, season: "2026-1" },
    xp: 1234,
  };
  const m = shareCardModel(data);
  assert.deepEqual(Object.keys(m).sort(), ["avatar", "collections", "pass", "showcase", "total"]);
  assert.deepEqual(m.showcase.map((s) => s.id), [A.id, B.id]);
  assert.ok(m.showcase.every((s) => Object.keys(s).join() === "id,rarity"));
  assert.ok(m.total.n === 2 && m.total.of > 2);
  assert.deepEqual(m.pass, { tier: 7, tiers: 30 });
  const t = (k, v = {}) => String(SL[k]).replace(/\{(\w+)\}/g, (_, n) => v[n]);
  const svg = shareCardSvg(m, { t, wordmark: ["Evkli", "d"] });
  for (const s of [JSON.stringify(m), svg]) for (const bad of ["Ana", "Skrivnostna", "Zvedavi", "ana@", "Tajna", "7.a", "4711", "1234"]) assert.ok(!s.includes(bad), bad);
  assert.ok(svg.startsWith("<svg") && svg.includes("Evkli") && !/undefined|NaN|null/.test(svg));
  assert.ok(svg.includes(t("share.cardTotal", { n: 2, of: m.total.of })));
  // Brez predmetov v vitrini so tri prazna mesta, kartica je še vedno veljavna.
  const empty = shareCardSvg(shareCardModel({}), { t });
  assert.equal((empty.match(/stroke-dasharray="14 12"/g) || []).length, 3);
});

import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { KNOWLEDGE } from "../public/zbirke.js";
import fs from "node:fs";
import path from "node:path";
import { shareCardModel, shareCardSvg, textWidth } from "../public/deli-kartico.js";
import { Leagues } from "../server/leagues.js";
import { dayOf } from "../server/vitrina.js";
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
    assert.ok(list[0].items[0].topic.name && list[0].items[0].topic.subject === "KEM" && !("path" in list[0].items[0].topic));

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

    // Učitelj vitrine spet dovoli: stari vklopi se ne vrnejo, vsak učenec mora vklopiti znova.
    assert.equal((await call(`/api/teacher/classes/${cls.code}/showcase`, { method: "PUT", body: { off: false }, headers: { "X-Teacher-Key": cls.teacherKey } })).status, 200);
    const back = (await call(`/api/students/${bor.id}/vitrina`)).body.classes[0];
    assert.equal(back.off, false);
    assert.deepEqual(back.list, []);
    assert.equal((await call(`/api/students/${ana.id}/vitrina`)).body.classes[0].on, false);
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
    assert.deepEqual(Object.keys(row.items[0].topic).sort(), ["name", "subject"]);
    assert.ok(!/razred|letnik/i.test(json), "brez razreda ali letnika učne poti");
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

test("class showcase: leaving the class and joining again leaves sharing off", async () => {
  const { server, call, student } = await setup();
  try {
    const cls = (await call("/api/classes", { method: "POST", body: { name: "6.a" } })).body;
    const ana = await student("Ana Novak", cls.code);
    const classId = (await call(`/api/students/${ana.id}/vitrina`)).body.classes[0].id;
    await call(`/api/students/${ana.id}/classes/${classId}/vitrina`, { method: "PUT", body: { on: true } });
    assert.equal((await call(`/api/students/${ana.id}/vitrina`)).body.classes[0].on, true);
    assert.equal((await call(`/api/students/${ana.id}/classes/${classId}`, { method: "DELETE" })).body.ok, true);
    assert.equal((await call(`/api/students/${ana.id}/vitrina`)).body.classes.length, 0);
    await call(`/api/students/${ana.id}/classes`, { method: "POST", body: { code: cls.code } });
    assert.equal((await call(`/api/students/${ana.id}/vitrina`)).body.classes[0].on, false);
  } finally {
    server.close();
  }
});

test("class showcase: a database from before the showcase gets the columns, with sharing off", async () => {
  const store = openDb(":memory:");
  const leagues = new Leagues(store); // stara shema: classes in class_members brez stolpcev vitrine
  const cols = (t) => store.db.prepare(`PRAGMA table_info(${t})`).all().map((c) => c.name);
  assert.ok(!cols("class_members").includes("showcase_shared") && !cols("classes").includes("showcase_off"));
  const cls = leagues.createClass("5.a");
  const s = store.createStudent("Ana Novak");
  leagues.join(s.id, cls.code);
  const app = createApp(store);
  const server = app.listen(0);
  try {
    assert.ok(cols("class_members").includes("showcase_shared") && cols("classes").includes("showcase_off"));
    const r = await (await fetch(`http://127.0.0.1:${server.address().port}/api/students/${s.id}/vitrina`)).json();
    assert.deepEqual(r.classes.map((c) => [c.on, c.off]), [[false, false]]);
  } finally {
    server.close();
  }
});

test("class showcase: the day is the Slovenian calendar day, without the time", () => {
  assert.equal(dayOf("2026-10-30 23:30:00"), "2026-10-31"); // po polnoči v Ljubljani
  assert.equal(dayOf("2026-07-15 21:59:00"), "2026-07-15"); // poletni čas: 23:59
  assert.equal(dayOf("2026-07-15 22:00:00"), "2026-07-16");
  assert.equal(dayOf(null), "");
});

test("share card: every locale fits its text lines (or is squeezed by textLength, never clipped)", () => {
  const UI = path.join(import.meta.dirname, "..", "public", "i18n", "ui");
  const d = { items: [A, B].map((x) => ({ id: x.id })), showcase: [A.id, B.id], pass: { tier: 30, tiers: 30 } };
  for (const f of fs.readdirSync(UI)) {
    const L = { ...SL, ...JSON.parse(fs.readFileSync(path.join(UI, f), "utf8")) };
    const lang = f.slice(0, -5);
    const t = (k, v = {}) => String(typeof L[k] === "object" ? L[k].other : L[k]).replace(/\{(\w+)\}/g, (_, n) => v[n]);
    const svg = shareCardSvg(shareCardModel(d), { t, lang, rtl: ["ar", "fa", "ur"].includes(lang) });
    assert.ok(!/undefined|NaN/.test(svg), lang);
    // Skupaj in stopnja passa sta v ločenih vrsticah.
    const total = t("share.cardTotal", { n: 2, of: 1 }).split(":")[0];
    assert.ok(!new RegExp(`${total.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^<]*·`).test(svg), `${lang}: pass v isti vrstici`);
    for (const m of svg.matchAll(/<text ([^>]*)>([^<]*)<\/text>/g)) {
      const fs_ = /font-size="([\d.]+)"/.exec(m[1]);
      if (!fs_) continue; // besedilo v risbi predmeta (velikost iz skupine)
      const size = Number(fs_[1]);
      const text = m[2].replace(/&[a-z]+;/g, "x");
      const w = textWidth(text, size);
      const max = Number(/textLength="(\d+)"/.exec(m[1])?.[1] || 0);
      // Brez varovala mora vrstica biti ožja od kartice; z njim je stisnjena na največ 960 točk.
      if (max) assert.ok(max <= 960 && /lengthAdjust="spacingAndGlyphs"/.test(m[1]), `${lang}: ${text}`);
      else assert.ok(w <= 960, `${lang}: ${text} (${Math.round(w)})`);
    }
  }
});

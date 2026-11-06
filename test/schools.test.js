// Šole, učitelji, licence in razredne naloge (server/schools.js).
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { schoolAccess, schoolMembership } from "../server/schools.js";

const YEAR = new Date().getFullYear();
const TOPIC = "MAT-OS-7/razsirjanje-in-krajsanje-ulomkov";

async function withServer(fn) {
  const store = openDb(":memory:");
  const calls = [];
  const fetchFn = async (url, init = {}) => {
    calls.push({ host: new URL(url).host, body: init.body ? JSON.parse(init.body) : null });
    return { ok: true, status: 200, json: async () => ({ id: "x" }) };
  };
  const app = createApp(store, { accounts: true, scheduler: false, stripeKey: "", resendKey: "re_x", fetchFn, log: { error() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const client = () => {
    const jar = {};
    return async (path, opts = {}) => {
      const res = await fetch(base + path, {
        method: opts.method || "GET",
        redirect: "manual",
        headers: { "Content-Type": "application/json", ...opts.headers, cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; ") },
        body: opts.body ? JSON.stringify(opts.body) : undefined,
      });
      for (const c of res.headers.getSetCookie()) {
        const [kv] = c.split(";");
        jar[kv.slice(0, kv.indexOf("="))] = kv.slice(kv.indexOf("=") + 1);
      }
      const type = res.headers.get("content-type") || "";
      return { status: res.status, headers: res.headers, body: type.includes("json") ? await res.json() : await res.text() };
    };
  };
  const register = async (call, email, verify = true) => {
    const r = await call("/api/auth/register", { method: "POST", body: { email, password: "geslo1234", accept_privacy: true, birth_date: "1985-04-12" } });
    assert.equal(r.status, 201, JSON.stringify(r.body));
    if (verify) {
      const mail = calls.filter((c) => c.host === "api.resend.com").at(-1);
      assert.equal((await call(/\/api\/auth\/verify\?token=[\w-]+/.exec(mail.body.text)[0])).status, 302);
    }
  };
  try {
    await fn({ client, store, register });
  } finally {
    server.close();
  }
}

test("teacher: school, colleague, class with grade and subject; teacher account needs no plan", async () => {
  await withServer(async ({ client, store, register }) => {
    const t = client();
    await register(t, "ucitelj@sola.si");
    store.db.prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z'").run(); // brez preizkusa in naročnine
    const sch = await t("/api/schools", { method: "POST", body: { name: "OŠ Prule", place: "Ljubljana", stage: "OS" } });
    assert.equal(sch.status, 201);
    assert.equal(sch.body.role, "admin");
    assert.equal(sch.body.licence, null);

    // Nepotrjen e-naslov ne more ustvariti šole.
    const u = client();
    await register(u, "nepotrjen@sola.si", false);
    assert.equal((await u("/api/schools", { method: "POST", body: { name: "OŠ X" } })).status, 403);

    // Sodelavec se pridruži s kodo šole.
    const c = client();
    await register(c, "sodelavka@sola.si");
    assert.equal((await c("/api/schools/join", { method: "POST", body: { code: "NAPACNA1" } })).status, 404);
    const j = await c("/api/schools/join", { method: "POST", body: { code: sch.body.inviteCode.toLowerCase() } });
    assert.equal(j.status, 201);
    assert.equal(j.body.role, "teacher");
    assert.equal(j.body.teachers, 2);

    const cls = await t("/api/teacher/classes", { method: "POST", body: { name: "7.a", schoolId: sch.body.id, path: "MAT-OS-7" } });
    assert.equal(cls.status, 201);
    assert.deepEqual([cls.body.grade, cls.body.subject, cls.body.path, cls.body.schoolId], [7, "MAT", "MAT-OS-7", sch.body.id]);
    assert.equal((await t("/api/teacher/classes", { method: "POST", body: { name: "x", path: "UNI-nekaj" } })).status, 400);
    // Tuja šola ne.
    const other = client();
    await register(other, "drug@sola.si");
    assert.equal((await other("/api/teacher/classes", { method: "POST", body: { name: "8.b", schoolId: sch.body.id } })).status, 404);
    assert.equal((await other(`/api/teacher/classes/${cls.body.code}/overview`)).status, 403);

    const home = (await t("/api/teacher/home")).body;
    assert.equal(home.schools.length, 1);
    assert.equal(home.classes[0].name, "7.a");
    const topics = (await t("/api/teacher/topics?path=MAT-OS-7")).body;
    assert.ok(topics.some((u) => u.topics.some((x) => x.id === TOPIC)));
    assert.equal((await t("/api/teacher/topics?path=nic")).status, 404);
  });
});

test("private space: teacher sees only assignment results and XP; licence seats; export and transfer", async () => {
  await withServer(async ({ client, store, register }) => {
    const db = store.db;
    const t = client();
    await register(t, "ucitelj@sola.si");
    const sch = (await t("/api/schools", { method: "POST", body: { name: "OŠ Prule" } })).body;
    const cls = (await t("/api/teacher/classes", { method: "POST", body: { name: "7.a", schoolId: sch.id, path: "MAT-OS-7" } })).body;
    const a = await t(`/api/teacher/classes/${cls.code}/assignments`, { method: "POST", body: { topicId: TOPIC, due: "2026-12-01" } });
    assert.equal(a.status, 201);
    assert.equal((await t(`/api/teacher/classes/${cls.code}/assignments`, { method: "POST", body: { topicId: "ne/obstaja" } })).status, 400);
    assert.equal((await t(`/api/teacher/classes/${cls.code}/assignments`, { method: "POST", body: { topicId: TOPIC, due: "jutri" } })).status, 400);

    // Dva otroka iz dveh družin se pridružita.
    const kids = [];
    for (const [mail, name] of [["a@primer.si", "Ana"], ["b@primer.si", "Bor"]]) {
      const p = client();
      await register(p, mail);
      const id = (await p("/api/students", { method: "POST", body: { name, birth_year: YEAR - 12, consent: true } })).body.id;
      assert.equal((await p(`/api/students/${id}/classes`, { method: "POST", body: { code: cls.code } })).status, 201);
      kids.push({ p, id });
    }
    // Ana reši 5 nalog pri dodeljeni temi in eno pri drugi temi (te učitelj ne vidi).
    const later = "datetime('now', '+1 minute')";
    for (let i = 0; i < 5; i++) db.prepare(`INSERT INTO tasks (student_id, topic_id, level, payload, attempts, solved, first_try_correct, created_at) VALUES (?, ?, 1, '{}', 1, 1, 1, ${later})`).run(kids[0].id, TOPIC);
    db.prepare(`INSERT INTO tasks (student_id, topic_id, level, payload, attempts, solved, created_at) VALUES (?, 'MAT-OS-9/linearna-funkcija', 1, '{}', 1, 1, ${later})`).run(kids[0].id);
    db.prepare(`INSERT INTO tasks (student_id, topic_id, level, payload, attempts, solved, created_at) VALUES (?, ?, 1, '{}', 1, 0, ${later})`).run(kids[1].id, TOPIC);

    const ov = (await t(`/api/teacher/classes/${cls.code}/overview`)).body;
    assert.equal(ov.members.length, 2);
    assert.ok(ov.members.every((m) => !("name" in m)), "brez pravih imen");
    const res = ov.assignments[0].results;
    assert.equal(res[kids[0].id].status, "done");
    assert.equal(res[kids[0].id].solved, 5);
    assert.equal(res[kids[1].id].status, "started");
    assert.equal(ov.assignments[0].done, 1);
    assert.ok(!JSON.stringify(ov).includes("linearna"), "druge teme niso vidne");

    // Oznaka učenca (učitelj) in izvoz CSV.
    assert.equal((await t(`/api/teacher/classes/${cls.code}/members/${kids[0].id}`, { method: "PUT", body: { label: "=Ana K." } })).status, 200);
    const csv = await t(`/api/teacher/classes/${cls.code}/export.csv`);
    assert.equal(csv.status, 200);
    assert.match(csv.body, /'=Ana K\./, "formula v celici je onemogočena");
    assert.match(csv.body, /opravljeno \(5\)/);

    // Licenca: brez nje ni šolskih pravic; 1 mesto = prvi pridruženi.
    assert.equal(schoolAccess(db, kids[0].id), null);
    const plain = client();
    await register(plain, "neskrbnik@primer.si");
    assert.equal((await plain(`/api/admin/schools/${sch.id}/licences`, { method: "POST", body: {} })).status, 403);
    db.prepare("UPDATE parents SET is_admin = 1 WHERE email = 'ucitelj@sola.si'").run();
    const today = new Date().toISOString().slice(0, 10);
    const bad = await t(`/api/admin/schools/${sch.id}/licences`, { method: "POST", body: { plan: "pilot", seats: 1, validUntil: "2020-01-01" } });
    assert.equal(bad.status, 400);
    const lic = await t(`/api/admin/schools/${sch.id}/licences`, {
      method: "POST",
      body: { plan: "pilot", seats: 1, priceEur: 12, subjects: ["MAT", "XX"], grades: [7], validFrom: today, validUntil: "2099-08-31", aiCapUsdMonth: 20 },
    });
    assert.equal(lic.status, 201, JSON.stringify(lic.body));
    assert.equal(lic.body.licence.subjects, null, "neznan predmet = seznam zavrnjen");
    const acc = schoolAccess(db, kids[0].id);
    assert.equal(acc.schoolName, "OŠ Prule");
    assert.deepEqual(acc.grades, [7]);
    // Meja skrbnika (20 $) nad 25 % plačila (1 mesto × 12 € / 12 × 0,25 / 0,92) se omeji (trda meja AI, j 2026-11-06).
    assert.equal(acc.aiCapUsdMonth, 0.27);
    assert.equal(schoolAccess(db, kids[1].id), null, "drugi učenec nima mesta");

    // Učenec vidi svoje naloge in licenco; izvoz je vedno mogoč.
    const mine = (await kids[0].p(`/api/students/${kids[0].id}/assignments`)).body;
    assert.equal(mine.classes[0].items[0].status, "done");
    assert.equal(mine.licence.school, "OŠ Prule");
    assert.equal((await kids[1].p(`/api/students/${kids[0].id}/assignments`)).status, 404, "tuj otrok");
    const exp = await kids[1].p(`/api/students/${kids[1].id}/school-export`);
    assert.equal(exp.status, 200);
    assert.equal(exp.body.classes[0].className, "7.a");

    // Prenos na drugo šolo: nova šola, novi razred; iz stare šole izstopi, napredek ostane.
    const t2 = client();
    await register(t2, "druga@sola.si");
    const s2 = (await t2("/api/schools", { method: "POST", body: { name: "OŠ Druga" } })).body;
    const c2 = (await t2("/api/teacher/classes", { method: "POST", body: { name: "7.b", schoolId: s2.id } })).body;
    const tr = await kids[0].p(`/api/students/${kids[0].id}/transfer`, { method: "POST", body: { code: c2.code } });
    assert.equal(tr.status, 200);
    assert.deepEqual(tr.body.left, ["7.a"]);
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM tasks WHERE student_id = ?").get(kids[0].id).n, 6);
    assert.equal((await t(`/api/teacher/classes/${cls.code}/overview`)).body.members.length, 1);
    // Pravila ponudb: članstvo in izklop ponudb (učitelj razreda).
    assert.deepEqual(schoolMembership(db, kids[1].id), { inClass: true, inSchool: true, offersOff: false });
    assert.equal((await t(`/api/teacher/classes/${cls.code}/offers`, { method: "PUT", body: { off: "da" } })).status, 400);
    assert.equal((await t2(`/api/teacher/classes/${cls.code}/offers`, { method: "PUT", body: { off: true } })).status, 403);
    assert.equal((await t(`/api/teacher/classes/${cls.code}/offers`, { method: "PUT", body: { off: true } })).status, 200);
    assert.equal(schoolMembership(db, kids[1].id).offersOff, true);
    assert.equal(schoolAccess(db, kids[1].id)?.stage, "OS");
    // Bor zdaj dobi prosto mesto.
    assert.equal(schoolAccess(db, kids[1].id)?.schoolId, sch.id);
  });
});

test("invalid input is 4xx; only the owner moves a class into a school; transfer rejects friend codes and rolls back", async () => {
  await withServer(async ({ client, store, register }) => {
    const db = store.db;
    const t = client();
    await register(t, "ucitelj@sola.si");
    const sch = (await t("/api/schools", { method: "POST", body: { name: "OŠ Prule" } })).body;
    const cls = (await t("/api/teacher/classes", { method: "POST", body: { name: "7.a", schoolId: sch.id } })).body;
    const obj = { toString: 1 }; // Number(obj) vrže izjemo
    assert.equal((await t("/api/teacher/classes", { method: "POST", body: { name: "x", schoolId: obj } })).status, 404);
    assert.equal((await t("/api/teacher/classes", { method: "POST", body: { name: "x", path: obj } })).status, 400);
    assert.equal((await t(`/api/teacher/classes/${cls.code}/school`, { method: "PUT", body: { schoolId: obj } })).status, 404);
    assert.equal((await t(`/api/teacher/classes/${cls.code}/assignments`, { method: "POST", body: { topicId: obj, due: obj } })).status, 400);
    db.prepare("UPDATE parents SET is_admin = 1 WHERE email = 'ucitelj@sola.si'").run();
    const lic = { plan: "pilot", seats: obj, validUntil: "2099-01-01" };
    assert.equal((await t(`/api/admin/schools/${sch.id}/licences`, { method: "POST", body: lic })).status, 400);
    assert.equal((await t(`/api/admin/schools/${sch.id}/licences`, { method: "POST", body: { ...lic, seats: 5, priceEur: obj } })).status, 400);

    // Ključ tujega razreda ne zadošča, da bi ga učitelj vpisal v svojo šolo (porabil bi njena mesta).
    const b = client();
    await register(b, "tuji@sola.si");
    const sb = (await b("/api/schools", { method: "POST", body: { name: "OŠ Tuja" } })).body;
    const legacy = (await t("/api/classes", { method: "POST", body: { name: "8.c" } })).body; // lastnik je t
    const move = (who, schoolId) => who(`/api/teacher/classes/${legacy.code}/school`, { method: "PUT", body: { schoolId }, headers: { "X-Teacher-Key": legacy.teacherKey } });
    assert.equal((await move(b, sb.id)).status, 403);
    // Star razred brez lastnika: učitelj s ključem ga vpiše v svojo šolo in ga s tem prevzame.
    db.prepare("UPDATE classes SET owner_parent_id = NULL WHERE id = ?").run(legacy.id);
    assert.equal((await move(b, sb.id)).status, 200);
    assert.ok((await b("/api/teacher/home")).body.classes.some((c) => c.id === legacy.id && c.schoolId === sb.id));
    assert.equal((await move(t, sch.id)).status, 403, "zdaj ima lastnika");

    // Prenos: koda skupine prijateljev je zavrnjena, preden bi se učenec pridružil; napačna koda ne izpiše iz razreda.
    const p = client();
    await register(p, "stars@primer.si");
    const id = (await p("/api/students", { method: "POST", body: { name: "Ana", birth_year: YEAR - 12, consent: true } })).body.id;
    assert.equal((await p(`/api/students/${id}/classes`, { method: "POST", body: { code: cls.code } })).status, 201);
    const q = client();
    await register(q, "drugi@primer.si");
    const id2 = (await q("/api/students", { method: "POST", body: { name: "Bor", birth_year: YEAR - 12, consent: true } })).body.id;
    const fr = (await q(`/api/students/${id2}/friend-groups`, { method: "POST", body: { name: "Mi" } })).body;
    assert.equal((await p(`/api/students/${id}/transfer`, { method: "POST", body: { code: fr.code } })).status, 400);
    assert.equal((await p(`/api/students/${id}/transfer`, { method: "POST", body: { code: obj } })).status, 404);
    const groups = () => db.prepare("SELECT class_id FROM class_members WHERE student_id = ?").all(id).map((r) => r.class_id);
    assert.deepEqual(groups(), [cls.id], "ni v skupini prijateljev in je še v 7.a");
    // Polna skupina (40) zavrne pridružitev: izstop iz stare šole se razveljavi.
    const c2 = (await b("/api/teacher/classes", { method: "POST", body: { name: "7.b", schoolId: sb.id } })).body;
    const full = db.prepare("INSERT INTO students (name, settings) VALUES ('x', '{}')");
    for (let i = 0; i < 40; i++) db.prepare("INSERT INTO class_members (class_id, student_id) VALUES (?, ?)").run(c2.id, Number(full.run().lastInsertRowid));
    assert.equal((await p(`/api/students/${id}/transfer`, { method: "POST", body: { code: c2.code } })).status, 400);
    assert.deepEqual(groups(), [cls.id]);

    // Pilotna cena samo za prvih 10 šol (j 2026-11-04): skrbnik 11. šoli pilotne licence ne vnese, pilotna šola jo podaljša.
    delete process.env.EVKLID_SCHOOL_AI_EUR;
    const addLic = (schoolId, body) => t(`/api/admin/schools/${schoolId}/licences`, { method: "POST", body: { seats: 30, validUntil: "2099-08-31", ...body } });
    assert.equal((await addLic(sb.id, { plan: "pilot", aiCapUsdMonth: 0 })).status, 201);
    for (let i = 1; i <= 9; i++) {
      const sid = Number(db.prepare("INSERT INTO schools (name, invite_code) VALUES (?, ?)").run(`Pilot ${i}`, `PIL${i}X`).lastInsertRowid);
      db.prepare("INSERT INTO school_licences (school_id, plan, seats, valid_from, valid_until) VALUES (?, 'pilot', 10, '2026-01-01', '2026-02-01')").run(sid); // tudi potekla šteje
    }
    const eleventh = await addLic(sch.id, { plan: "pilot" });
    assert.equal(eleventh.status, 409);
    assert.match(eleventh.body.error, /prvih 10 šol/);
    assert.equal((await addLic(sb.id, { plan: "pilot", validFrom: "2099-09-01", validUntil: "2100-08-31" })).status, 201, "pilotna šola podaljša");
    // Brez meje AI v licenci velja privzeta (25 % mesečne cene na učenca); 0 = brez meje ostane 0.
    const normal = await addLic(sch.id, { plan: "school" });
    assert.equal(normal.status, 201);
    assert.equal(normal.body.licence.aiCapUsdMonth, Math.round(((30 * 14) / 12 * 0.25 / 0.92) * 100) / 100);
    assert.equal(schoolAccess(db, id).aiCapUsdMonth, normal.body.licence.aiCapUsdMonth);
    assert.equal(db.prepare("SELECT ai_cap_usd_month AS c FROM school_licences WHERE id = ?").get(normal.body.id ?? 0)?.c ?? null, null, "v bazi ostane NULL");
    const tuja = db.prepare("SELECT ai_cap_usd_month AS c FROM school_licences WHERE school_id = ? ORDER BY id LIMIT 1").get(sb.id);
    assert.equal(tuja.c, 0);
  });
});

test("without accounts the teacher page still works with keyed classes", async () => {
  const store = openDb(":memory:");
  const app = createApp(store, { accounts: false, scheduler: false, log: { error() {} } });
  const server = app.listen(0);
  try {
    const base = `http://127.0.0.1:${server.address().port}`;
    const home = await fetch(`${base}/api/teacher/home`);
    assert.equal(home.status, 200);
    const h = await home.json();
    assert.equal(h.accounts, false);
    assert.deepEqual([h.schools, h.classes], [[], []]);
  } finally {
    server.close();
  }
});

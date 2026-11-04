import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { inMagnet, shouldClose, velocity, addSample, MAGNET_R } from "../public/magnet.js";

// Prijave napak (server/reports.js, public/prijave.js): »Prijavi napako« v lekciji, skrbnikova prijava
// iz klepeta, seznam za skrbnika. Brez računov je skrbnik računalnik, kjer teče strežnik (127.0.0.1);
// zahteva prek posrednika (X-Forwarded-For) ni.
const REPLY = 'Pitagorov izrek: $a^2 + b^2 = c^2$.\n<<META subject=MAT topic="pitagorov izrek" error=0 mode=A flag=none done=0>>';

async function withServer(fn) {
  const store = openDb(":memory:");
  const streamFn = async ({ onText }) => {
    onText(REPLY);
    return { content: [{ type: "text", text: REPLY }], text: REPLY, stopReason: "end_turn" };
  };
  const server = createApp(store, { streamFn }).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (p, o = {}) => {
    const headers = { "Content-Type": "application/json", ...(o.remote ? { "X-Forwarded-For": "203.0.113.5" } : {}) };
    const res = await fetch(base + p, { method: o.method || "GET", headers, body: o.body ? JSON.stringify(o.body) : undefined });
    const type = res.headers.get("content-type") || "";
    return { status: res.status, body: type.includes("json") ? await res.json() : await res.text(), type };
  };
  try {
    await fn({ call, store });
  } finally {
    server.close();
  }
}

const LESSON = "MAT-OS-8/pitagorov-izrek";

test("lesson report: checked, stored with step and device, admin sees it and marks it fixed", async () => {
  await withServer(async ({ call, store }) => {
    const s = (await call("/api/students", { method: "POST", body: { name: "Ana" } })).body;
    const url = `/api/students/${s.id}/lesson-report`;
    assert.equal((await call(url, { method: "POST", body: { topic: "NI-TAKE/teme", reason: "wrong" } })).status, 404);
    assert.equal((await call(url, { method: "POST", body: { topic: LESSON, reason: "nope" } })).status, 400);
    const r = await call(url, { method: "POST", body: { topic: LESSON, reason: "unclear", note: "Ana ne razume 2. koraka", step: 3, device: "phone", screen: "360x740" } });
    assert.equal(r.status, 201);
    const row = store.db.prepare("SELECT * FROM bug_reports WHERE id = ?").get(r.body.id);
    assert.equal(row.kind, "lesson");
    assert.equal(row.step, 3);
    assert.equal(row.device, "phone 360x740");
    assert.ok(!String(row.note).includes("Ana ne razume") || !process.env.EVKLID_DATA_KEY, "opomba je šifrirana, ko je ključ nastavljen");

    const list = (await call("/api/admin/reports")).body;
    assert.equal(list.open, 1);
    const it = list.reports.find((x) => x.kind === "lesson");
    assert.equal(it.topic_id, LESSON);
    assert.ok(it.topic_name, "ime lekcije za skrbnika");
    assert.equal(it.note, "[ime] ne razume 2. koraka", "ime učenca se ne shrani");

    const md = await call("/api/admin/reports/export");
    assert.match(md.type, /markdown/);
    assert.match(md.body, new RegExp(`Lekcija ${LESSON}.*korak 3`));

    assert.equal((await call(`/api/admin/reports/lesson/${it.id}`, { method: "POST", body: { status: "bad" } })).status, 400);
    assert.equal((await call(`/api/admin/reports/app/${it.id}`, { method: "POST", body: { status: "fixed" } })).status, 404, "vrsta se mora ujemati");
    assert.equal((await call(`/api/admin/reports/lesson/${it.id}`, { method: "POST", body: { status: "fixed" } })).status, 200);
    assert.equal((await call("/api/admin/reports")).body.open, 0);
    assert.equal((await call("/api/admin/reports?status=all")).body.reports[0].status, "fixed");
  });
});

test("admin bug report from the chat: admin only, keeps the last messages; reports are admin only", async () => {
  await withServer(async ({ call }) => {
    const s = (await call("/api/students", { method: "POST", body: { name: "Jure" } })).body;
    const c = (await call(`/api/students/${s.id}/conversations`, { method: "POST" })).body;
    await call(`/api/conversations/${c.id}/messages`, { method: "POST", body: { text: "kaj je pitagorov izrek" } });
    const url = `/api/students/${s.id}/bug`;
    assert.equal((await call(url, { method: "POST", remote: true, body: { note: "x" } })).status, 403, "ni skrbnik");
    assert.equal((await call(url, { method: "POST", body: { note: "  " } })).status, 400);
    const r = await call(url, { method: "POST", body: { note: "Formula se ne izriše", conversation_id: c.id, view: "chat" } });
    assert.equal(r.status, 201);
    const it = (await call("/api/admin/reports")).body.reports.find((x) => x.kind === "app");
    assert.equal(it.note, "Formula se ne izriše");
    assert.match(it.context, /Učenec:\*\* kaj je pitagorov izrek/);
    assert.match(it.context, /Inštruktor #/);

    // Tuj pogovor se ne priloži.
    const other = (await call("/api/students", { method: "POST", body: { name: "Eva" } })).body;
    const r2 = await call(`/api/students/${other.id}/bug`, { method: "POST", body: { note: "drugo", conversation_id: c.id } });
    assert.equal(r2.status, 201);
    assert.equal((await call("/api/admin/reports")).body.reports.find((x) => x.id === r2.body.id && x.kind === "app").context, null);

    assert.equal((await call("/api/admin/reports", { remote: true })).status, 403);
    assert.equal((await call("/api/admin/reports/export", { remote: true })).status, 403);
    assert.equal((await call(`/api/admin/reports/app/${r.body.id}`, { method: "POST", remote: true, body: { status: "fixed" } })).status, 403);
    assert.equal((await call("/api/config")).body.admin, true);
    assert.equal((await call("/api/config", { remote: true })).body.admin, false);

    // Izbris pogovora izbriše tudi priložena sporočila.
    await call(`/api/conversations/${c.id}`, { method: "DELETE" });
    assert.equal((await call("/api/admin/reports")).body.reports.find((x) => x.id === r.body.id && x.kind === "app").context, null);
  });
});

test("message report keeps what the student saw: raw model text, rendered HTML and device", async () => {
  await withServer(async ({ call }) => {
    const s = (await call("/api/students", { method: "POST", body: { name: "Ana" } })).body;
    const c = (await call(`/api/students/${s.id}/conversations`, { method: "POST" })).body;
    await call(`/api/conversations/${c.id}/messages`, { method: "POST", body: { text: "kaj je pitagorov izrek" } });
    const conv = (await call(`/api/conversations/${c.id}`)).body;
    const mid = conv.messages.find((m) => m.role === "assistant").id;
    const url = `/api/conversations/${c.id}/messages/${mid}/report`;
    const shown = '<p>Pitagorov izrek: <span class="katex-error">a^2 + b^2</span></p>';
    // HTML s skripto se ne shrani, prijava pa vseeno uspe.
    const bad = await call(url, { method: "POST", body: { reason: "wrong", shown: "<script>x</script>" } });
    assert.equal(bad.status, 201);
    assert.equal((await call("/api/admin/reports")).body.reports.find((x) => x.kind === "message").shown, null);
    await call(`/api/admin/reports/message/${(await call("/api/admin/reports")).body.reports[0].id}`, { method: "POST", body: { status: "fixed" } });

    const c2 = (await call(`/api/students/${s.id}/conversations`, { method: "POST" })).body;
    await call(`/api/conversations/${c2.id}/messages`, { method: "POST", body: { text: "kaj je pitagorov izrek" } });
    const mid2 = (await call(`/api/conversations/${c2.id}`)).body.messages.find((m) => m.role === "assistant").id;
    const r = await call(`/api/conversations/${c2.id}/messages/${mid2}/report`, { method: "POST", body: { reason: "wrong", note: "formula", shown, device: "web-phone", screen: "390x844" } });
    assert.equal(r.status, 201);
    const it = (await call("/api/admin/reports")).body.reports.find((x) => x.kind === "message" && x.status === "open");
    assert.equal(it.device, "web-phone 390x844");
    assert.equal(it.shown, shown);
    assert.match(it.raw, /<<META/, "surovo besedilo modela z vrstico META");
    assert.ok(!it.answer.includes("<<META"));
    const md = (await call("/api/admin/reports/export")).body;
    assert.match(md, /web-phone 390x844/);
    assert.match(md, /katex-error/);
    assert.match(md, /Surovo besedilo modela/);
  });
});

test("tutor bubble: X attracts it, a flick toward X closes it, other drags do not", () => {
  const X = { x: 200, y: 700 };
  const drag = (pts) => pts.reduce((s, [x, y, t]) => addSample(s, x, y, t), []);
  assert.ok(inMagnet({ x: 200 + MAGNET_R - 5, y: 700 }, X), "blizu X-a se prilepi");
  assert.ok(!inMagnet({ x: 200, y: 700 - MAGNET_R - 5 }, X));
  // Spust v polju X-a zapre.
  assert.ok(shouldClose({ x: 230, y: 680 }, drag([[300, 400, 0], [230, 680, 300]]), X));
  // Hiter poteg proti X-u od daleč (1,5 px/ms) zapre.
  const flick = drag([[200, 200, 0], [200, 230, 20], [200, 290, 60], [200, 350, 100]]);
  assert.ok(velocity(flick).vy > 1);
  assert.ok(shouldClose({ x: 200, y: 350 }, flick, X));
  // Enako hiter poteg stran od X-a ne zapre, počasen proti X-u tudi ne.
  assert.ok(!shouldClose({ x: 200, y: 200 }, drag([[200, 350, 0], [200, 290, 40], [200, 200, 100]]), X));
  assert.ok(!shouldClose({ x: 200, y: 260 }, drag([[200, 200, 0], [200, 230, 100], [200, 260, 200]]), X));
  // Hiter poteg vstran (pravokotno na smer do X-a) ne zapre.
  assert.ok(!shouldClose({ x: 350, y: 300 }, drag([[200, 300, 0], [350, 300, 100]]), X));
});

test("tutor window: a suggested reply is sent at once, the X check runs before the X hides", () => {
  const app = readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
  assert.match(app, /if \(!\$\("#input"\)\.value\.trim\(\) && !state\.image\) return send\(b\.dataset\.idea\);/);
  const okna = readFileSync(new URL("../public/okna.js", import.meta.url), "utf8");
  const up = okna.slice(okna.indexOf("const up = (ev, cancel)"));
  assert.ok(up.indexOf("shouldClose(") < up.indexOf("drop.hidden = true"), "spust na X se preveri, preden se X skrije");
  // Gumb v vsaki lekciji (splet in aplikacija).
  assert.match(readFileSync(new URL("../public/textbook.js", import.meta.url), "utf8"), /wireLessonReport\(/);
  assert.match(readFileSync(new URL("../mobile/src/app/topic/[id].tsx", import.meta.url), "utf8"), /lesson-report/);
});

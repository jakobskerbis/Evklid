// Samodejni pregled prijav (docs/prijave-samodejno.md): izvoz in stanje samo s ključem EVKLID_EXPORT_TOKEN,
// brez id-jev učenca in pogovora; stanje »in_review« s številko PR je vidno skrbniku.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { scrubName } from "../server/reports.js";

const TOKEN = "t".repeat(40);
const REPLY = 'Ana, 7 krat 8 je 54.\n<<META subject=MAT topic="poštevanka" error=0 mode=A flag=none done=0>>';
const LESSON = "MAT-OS-8/pitagorov-izrek";

async function withServer(fn) {
  const before = process.env.EVKLID_EXPORT_TOKEN;
  process.env.EVKLID_EXPORT_TOKEN = TOKEN;
  const store = openDb(":memory:");
  const streamFn = async ({ onText }) => {
    onText(REPLY);
    return { content: [{ type: "text", text: REPLY }], text: REPLY, stopReason: "end_turn" };
  };
  const server = createApp(store, { streamFn }).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  // remote: kot na Renderju (X-Forwarded-For), torej ni računalnik s strežnikom.
  const call = async (p, { method = "GET", body, auth, remote = false } = {}) => {
    const headers = { "Content-Type": "application/json", ...(remote ? { "X-Forwarded-For": "1.2.3.4" } : {}), ...(auth ? { Authorization: auth } : {}) };
    const res = await fetch(base + p, { method, headers, body: body ? JSON.stringify(body) : undefined });
    const type = res.headers.get("content-type") || "";
    return { status: res.status, headers: res.headers, body: type.includes("json") ? await res.json() : await res.text() };
  };
  try {
    await fn({ call, store });
  } finally {
    server.close();
    if (before === undefined) delete process.env.EVKLID_EXPORT_TOKEN;
    else process.env.EVKLID_EXPORT_TOKEN = before;
  }
}

const doneOf = (sse) => JSON.parse(/event: done\ndata: (.*)/.exec(sse)[1]);

test("izvoz prijav: samo s ključem, brez id-jev in imena učenca, stanje in_review s PR", async () => {
  await withServer(async ({ call, store }) => {
    const s = (await call("/api/students", { method: "POST", body: { name: "Ana" } })).body;
    const c = (await call(`/api/students/${s.id}/conversations`, { method: "POST" })).body;
    const done = doneOf((await call(`/api/conversations/${c.id}/messages`, { method: "POST", body: { text: "koliko je 7 krat 8" } })).body);
    assert.equal((await call(`/api/conversations/${c.id}/messages/${done.id}/report`, { method: "POST", body: { reason: "wrong", note: "Ani se zdi, da je 7 · 8 = 56" } })).status, 201);
    const lr = await call(`/api/students/${s.id}/lesson-report`, { method: "POST", body: { topic: LESSON, reason: "unclear", note: "korak ni jasen", step: 2 } });
    assert.equal(lr.status, 201);

    const key = `Bearer ${TOKEN}`;
    // Od zunaj brez ključa ali z napačnim: 404, kot da poti ni.
    assert.equal((await call("/api/prijave/izvoz", { remote: true })).status, 404);
    assert.equal((await call("/api/prijave/izvoz", { remote: true, auth: `Bearer ${"x".repeat(40)}` })).status, 404);
    assert.equal((await call(`/api/prijave/lesson/${lr.body.id}/stanje`, { method: "POST", remote: true, body: { status: "fixed" } })).status, 404);

    const out = await call("/api/prijave/izvoz", { remote: true, auth: key });
    assert.equal(out.status, 200);
    assert.equal(out.headers.get("cache-control"), "no-store");
    assert.equal(out.body.reports.length, 2);
    const msg = out.body.reports.find((r) => r.kind === "message");
    const les = out.body.reports.find((r) => r.kind === "lesson");
    assert.equal(msg.code, done.code);
    assert.equal(msg.note, "[ime] se zdi, da je 7 · 8 = 56", "tudi sklonjeno ime je zamenjano");
    assert.equal(msg.question, "koliko je 7 krat 8");
    assert.match(msg.answer, /\[ime\], 7 krat 8 je 54/, "ime učenca je v odgovoru zamenjano");
    assert.equal(les.topic_id, LESSON);
    assert.ok(les.topic_name);
    assert.equal(les.step, 2);
    for (const r of out.body.reports) {
      for (const k of ["student_id", "conversation_id", "message_id", "purged", "fixed_at"]) assert.ok(!(k in r), `${r.kind}: ${k}`);
      assert.ok(!JSON.stringify(r).includes("Ana"), "brez imena učenca");
    }
    // Vsak izvoz je v dnevniku dostopov.
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM audit_log WHERE action = 'reports_export' AND actor = 'system'").get().n, 1);

    // Napačne zahteve: 400; neobstoječa prijava: 404.
    const st = (kind, id, body) => call(`/api/prijave/${kind}/${id}/stanje`, { method: "POST", remote: true, auth: key, body });
    assert.equal((await st("lesson", lr.body.id, { status: "in_review" })).status, 400, "in_review brez PR");
    assert.equal((await st("lesson", lr.body.id, { status: "done", pr: 5 })).status, 400);
    assert.equal((await st("lesson", lr.body.id, { status: "in_review", pr: "5" })).status, 400);
    assert.equal((await st("lesson", lr.body.id, { status: "in_review", pr: -1 })).status, 400);
    assert.equal((await st("other", lr.body.id, { status: "fixed" })).status, 400);
    assert.equal((await st("app", lr.body.id, { status: "fixed" })).status, 404, "vrsta se mora ujemati");
    assert.equal((await st("lesson", 99999, { status: "fixed" })).status, 404);

    // Popravek v pregledu: skrbnik vidi PR, prijava ostane med odprtimi in v izvozu.
    const ir = await st("lesson", lr.body.id, { status: "in_review", pr: 612 });
    assert.deepEqual(ir.body, { ok: true, status: "in_review", pr: 612 });
    const admin = (await call("/api/admin/reports")).body; // računalnik s strežnikom = skrbnik
    assert.equal(admin.open, 2);
    const row = admin.reports.find((r) => r.kind === "lesson");
    assert.equal(row.status, "in_review");
    assert.equal(row.pr_url, "https://github.com/jakobskerbis/evklid/pull/612");
    assert.equal((await call("/api/prijave/izvoz", { remote: true, auth: key })).body.reports.find((r) => r.kind === "lesson").pr, 612);

    // PR združen: popravljeno, PR ostane zapisan; izvoz in seznam odprtih je ne kažeta več.
    assert.equal((await st("lesson", lr.body.id, { status: "fixed" })).status, 200);
    const fixed = store.db.prepare("SELECT status, pr, fixed_at FROM bug_reports WHERE id = ?").get(lr.body.id);
    assert.equal(fixed.status, "fixed");
    assert.equal(fixed.pr, 612);
    assert.ok(fixed.fixed_at);
    assert.equal((await call("/api/prijave/izvoz", { remote: true, auth: key })).body.reports.length, 1);
    assert.equal((await call("/api/admin/reports")).body.open, 1);

    // PR zaprt brez združitve: prijava je spet odprta in brez PR.
    const mid = msg.id;
    assert.equal((await st("message", mid, { status: "in_review", pr: 7 })).status, 200);
    const reopened = await st("message", mid, { status: "open", pr: 7 });
    assert.deepEqual(reopened.body, { ok: true, status: "open", pr: null });
    assert.deepEqual({ ...store.db.prepare("SELECT status, pr FROM message_reports WHERE id = ?").get(mid) }, { status: "open", pr: null });
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM audit_log WHERE action = 'report_status'").get().n, 4);
  });
});

test("ime v izvozu: cele in sklonjene oblike, druge besede ostanejo", () => {
  assert.equal(scrubName("Ana pravi, da Ani in Ano ne gre. Analiza ostane.", "Ana"), "[ime] pravi, da [ime] in [ime] ne gre. Analiza ostane.");
  assert.equal(scrubName("Jakobu ni jasno, Jakob ve", "Jakob"), "[ime] ni jasno, [ime] ve");
  assert.equal(scrubName("Petru je rekel Peter", "Peter"), "[ime] je rekel [ime]");
  assert.equal(scrubName("Mia misli, da minus gre", "Mia"), "[ime] misli, da minus gre");
  assert.equal(scrubName("Ana Marija in Mariji", "Ana Marija"), "[ime] [ime] in [ime]");
  assert.equal(scrubName(null, "Ana"), null);
});

test("izvoz prijav: skrbnik in računalnik s strežnikom ga vidita brez ključa", async () => {
  await withServer(async ({ call }) => {
    const out = await call("/api/prijave/izvoz");
    assert.equal(out.status, 200);
    assert.deepEqual(out.body.reports, []);
  });
});

test("prikaz v Računu: povezava na PR in besedilo v vseh jezikih", () => {
  const js = fs.readFileSync(new URL("../public/prijave.js", import.meta.url), "utf8");
  assert.match(js, /r\.status === "in_review" && r\.pr_url/);
  assert.match(fs.readFileSync(new URL("../public/i18n/sl.js", import.meta.url), "utf8"), /"adm\.rep\.inReview": "[^"]*\{n\}/);
  for (const f of fs.readdirSync(new URL("../public/i18n/ui/", import.meta.url))) {
    const v = JSON.parse(fs.readFileSync(new URL(`../public/i18n/ui/${f}`, import.meta.url), "utf8"))["adm.rep.inReview"];
    assert.ok(v && v.includes("{n}"), `${f}: adm.rep.inReview`);
  }
});

// Na Renderju sta vklopljena geslo ali računi: poti s ključem morata iti mimo obeh, brez ključa pa 404.
for (const extra of [{ EVKLID_ACCOUNTS: "1" }, { EVKLID_PASSWORD: "geslo-za-test" }]) {
  test(`izvoz in stanje prijav od zunaj: samo s ključem (${Object.keys(extra)[0]})`, async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-prijave-"));
    const port = 39000 + Math.floor(Math.random() * 900);
    const srv = spawn(process.execPath, ["--disable-warning=ExperimentalWarning", "server/index.js"], {
      env: { ...process.env, PORT: String(port), EVKLID_MOCK: "1", EVKLID_NEWS: "0", EVKLID_DB: path.join(dir, "t.db"), EVKLID_PASSWORD: "", EVKLID_ACCOUNTS: "0", ANTHROPIC_API_KEY: "", EVKLID_EXPORT_TOKEN: TOKEN, ...extra },
      stdio: "ignore",
    });
    try {
      const base = `http://127.0.0.1:${port}`;
      for (let i = 0; i < 150; i++) {
        try {
          await fetch(`${base}/healthz`);
          break;
        } catch {
          await new Promise((r) => setTimeout(r, 100));
        }
      }
      const req = (p, auth, method = "GET") =>
        fetch(base + p, {
          method,
          headers: { "X-Forwarded-For": "1.2.3.4", "Content-Type": "application/json", ...(auth ? { Authorization: auth } : {}) },
          body: method === "POST" ? JSON.stringify({ status: "fixed" }) : undefined,
        });
      assert.equal((await req("/api/prijave/izvoz")).status, 404);
      assert.equal((await req("/api/prijave/izvoz", `Bearer ${TOKEN}`)).status, 200);
      assert.equal((await req("/api/prijave/lesson/1/stanje", null, "POST")).status, 404);
      // S ključem gre mimo gesla in prijave do poti: prijave 1 ni, zato »Prijava ne obstaja.«
      const r = await req("/api/prijave/lesson/1/stanje", `Bearer ${TOKEN}`, "POST");
      assert.equal(r.status, 404);
      assert.equal((await r.json()).error, "Prijava ne obstaja.");
      // Druge poti pod /api/prijave/ ostanejo zaprte za geslom ali prijavo.
      assert.notEqual((await req("/api/prijave/lesson/1", `Bearer ${TOKEN}`)).status, 200);
    } finally {
      srv.kill();
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
}

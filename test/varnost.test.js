// Varstvo podatkov (docs/varnost-podatkov.md): varnostne glave, šifriranje polj, roki hrambe,
// dnevnik dostopov, omejitve poskusov, zgoščevanje gesel, zavrnjene fotografije.
import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { DatabaseSync } from "node:sqlite";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { seal, unseal, blindIndex, newKey, UNREADABLE, isEncrypted } from "../server/crypto-polje.js";
import { migrateEncryption, encryptionSteps, encryptionStats, runRetention, imageGoneText } from "../server/zasebnost.js";
import { hashPassword, verifyPassword, needsRehash, SCRYPT_QUEUE_MAX } from "../server/accounts/auth.js";
import { windowHistory } from "../server/usage.js";
import { GuestQuota } from "../server/accounts/guest.js";
import { audit } from "../server/dnevnik-dostopov.js";

const ADULT = "1985-04-12";
const SECRET_TEXT = "Moja skrivna domača naloga 4711";
const PHOTO = { media_type: "image/png", data: Buffer.from("slika-ucenca").toString("base64") };

const withKey = async (key, fn, old = "") => {
  const prev = [process.env.EVKLID_DATA_KEY, process.env.EVKLID_DATA_KEYS_OLD];
  process.env.EVKLID_DATA_KEY = key;
  process.env.EVKLID_DATA_KEYS_OLD = old;
  try {
    return await fn();
  } finally {
    if (prev[0] === undefined) delete process.env.EVKLID_DATA_KEY;
    else process.env.EVKLID_DATA_KEY = prev[0];
    if (prev[1] === undefined) delete process.env.EVKLID_DATA_KEYS_OLD;
    else process.env.EVKLID_DATA_KEYS_OLD = prev[1];
  }
};

async function withServer(fn, { reply = 'V redu.\n<<META subject=MAT topic="-" error=0 mode=A flag=none done=0>>', ...extra } = {}) {
  const store = extra.store || openDb(":memory:");
  const calls = [];
  const app = createApp(store, {
    accounts: true,
    scheduler: false,
    resendKey: "re_x",
    fetchFn: async (url, init = {}) => {
      calls.push({ url, body: init.body ? JSON.parse(init.body) : null });
      return { ok: true, status: 200, json: async () => ({ id: "m" }) };
    },
    log: { error() {}, info() {}, warn() {} },
    streamFn: async ({ onText }) => {
      onText(reply);
      return { text: reply, stopReason: "end_turn" };
    },
    ...extra,
  });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const client = () => {
    const jar = {};
    return async (p, opts = {}) => {
      const res = await fetch(base + p, {
        method: opts.method || "GET",
        redirect: "manual",
        headers: { "Content-Type": "application/json", cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; "), ...(opts.headers || {}) },
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
  try {
    await fn({ client, store, calls, base });
  } finally {
    server.close();
  }
}

async function parentWithChild(call, calls, email = "ana@primer.si") {
  const r = await call("/api/auth/register", { method: "POST", body: { email, password: "geslo1234", accept_privacy: true, birth_date: ADULT } });
  assert.equal(r.status, 201, JSON.stringify(r.body));
  const mail = calls.filter((c) => String(c.url).includes("resend")).at(-1);
  assert.equal((await call(/\/api\/auth\/verify\?token=[\w-]+/.exec(mail.body.text)[0])).status, 302);
  const s = await call("/api/students", { method: "POST", body: { name: "Miha", birth_year: new Date().getFullYear() - 12, consent: true, profile_password: "1234" } });
  assert.equal(s.status, 201, JSON.stringify(s.body));
  return { parent: r.body.parent, student: s.body };
}

async function chat(call, studentId, body) {
  const c = await call(`/api/students/${studentId}/conversations`, { method: "POST" });
  const r = await call(`/api/conversations/${c.body.id}/messages`, { method: "POST", body });
  assert.equal(r.status, 200);
  assert.match(r.body, /event: done/);
  return c.body.id;
}

// --- 1. varnostne glave ---
test("varnostne glave: CSP, HSTS samo prek https, no-store za API", async () => {
  await withServer(async ({ client }) => {
    const call = client();
    const home = await call("/");
    const csp = home.headers.get("content-security-policy");
    for (const d of ["default-src 'self'", "script-src 'self'", "object-src 'none'", "frame-ancestors 'none'", "img-src 'self' data: blob: https:", "connect-src 'self'"]) assert.ok(csp.includes(d), d);
    assert.ok(!/script-src[^;]*unsafe-inline/.test(csp));
    assert.equal(home.headers.get("x-content-type-options"), "nosniff");
    assert.equal(home.headers.get("referrer-policy"), "strict-origin-when-cross-origin");
    assert.equal(home.headers.get("cross-origin-opener-policy"), "same-origin");
    assert.equal(home.headers.get("x-frame-options"), "DENY");
    assert.match(home.headers.get("permissions-policy"), /camera=\(self\).*microphone=\(self\).*geolocation=\(\)/);
    assert.equal(home.headers.get("strict-transport-security"), null); // http
    assert.equal(home.headers.get("x-powered-by"), null);
    const https = await call("/healthz", { headers: { "X-Forwarded-Proto": "https" } });
    assert.equal(https.headers.get("strict-transport-security"), "max-age=31536000; includeSubDomains");
    assert.equal((await call("/api/students")).headers.get("cache-control"), "no-store");
    assert.equal((await call("/api/paths")).headers.get("cache-control"), "no-cache");
    // Strani brez vrinjenih skript (CSP script-src 'self'). Podatkovni blok schema.org (application/ld+json)
    // ni skripta: brskalnik ga ne izvede in CSP ga ne zadeva (server/vidnost.js).
    for (const f of ["index.html", "starsi.html", "placaj.html", "ucitelj.html", "zasebnost.html", "garancija.html", "o-evklidu.html", "zakaj-evklid.html"]) {
      const html = fs.readFileSync(path.join("public", f), "utf8");
      assert.ok(!/<script(?![^>]*\bsrc=)(?![^>]*\btype="application\/ld\+json")[^>]*>/i.test(html), `${f}: vrinjena skripta`);
      assert.ok(!/\son[a-z]+\s*=/i.test(html), `${f}: on…= v HTML`);
    }
    const print = await call("/ucbenik/MAT-OS-6");
    assert.equal(print.status, 200);
    assert.ok(!/<script>|onclick=/.test(print.body) && /src="\/ucbenik-tisk\.js"/.test(print.body));
  });
});

// --- 2. šifriranje polj ---
test("šifriranje: zapis, prazno brez ključa, napačen ključ, menjava ključa, slepi indeks", async () => {
  assert.equal(seal("abc"), "abc"); // brez ključa
  const k1 = newKey();
  const k2 = newKey();
  const v1 = await withKey(k1, () => seal("Živjo 7·8"));
  assert.match(v1, /^enc1:[0-9a-f]{8}:[A-Za-z0-9+/=]+$/);
  assert.notEqual(v1, await withKey(k1, () => seal("Živjo 7·8"))); // naključen IV
  assert.equal(await withKey(k1, () => unseal(v1)), "Živjo 7·8");
  assert.equal(await withKey(k1, () => unseal("navadno")), "navadno");
  assert.equal(await withKey(k2, () => unseal(v1)), UNREADABLE); // brez starega ključa
  assert.equal(unseal(v1), UNREADABLE); // brez ključa
  assert.equal(await withKey(k2, () => unseal(v1), `star:${k1}`), "Živjo 7·8"); // menjava ključa
  const tampered = v1.slice(0, -4) + (v1.at(-4) === "A" ? "B" : "A") + v1.slice(-3);
  assert.equal(await withKey(k1, () => unseal(tampered)), UNREADABLE); // GCM zazna spremembo
  assert.equal(await withKey(k1, () => blindIndex("x")), await withKey(k1, () => blindIndex("x")));
  assert.notEqual(await withKey(k1, () => blindIndex("x")), await withKey(k2, () => blindIndex("x")));
  process.env.EVKLID_DATA_KEY = "kratek";
  try {
    assert.throws(() => seal("x"), /32 bajtov/); // napačen ključ ustavi zagon z jasnim sporočilom
  } finally {
    delete process.env.EVKLID_DATA_KEY;
  }
});

test("šifriranje od konca do konca: pogovor, izvoz, prijava napake, kartice; v bazi ni besedila", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-varnost-"));
  const file = path.join(dir, "t.db");
  const key = newKey();
  await withKey(key, async () => {
    const store = openDb(file);
    await withServer(
      async ({ client, calls, store }) => {
        const call = client();
        const { student } = await parentWithChild(call, calls);
        assert.equal((await call(`/api/students/${student.id}/unlock`, { method: "POST", body: { password: "1234" } })).status, 200);
        const convId = await chat(call, student.id, { text: SECRET_TEXT });
        const conv = await call(`/api/conversations/${convId}`);
        assert.equal(conv.body.messages[0].text, SECRET_TEXT);
        assert.equal(conv.body.title, SECRET_TEXT.slice(0, 50));
        const asst = conv.body.messages[1];
        assert.equal((await call(`/api/conversations/${convId}/messages/${asst.id}/report`, { method: "POST", body: { reason: "wrong", note: "opomba 4711" } })).status, 201);
        store.cards.add(student.id, [{ front: "Kaj je 4711?", back: "Skrivno število 4711" }], { source: "own" });
        assert.equal(store.cards.add(student.id, [{ front: "kaj je 4711", back: "dvojnik" }], { source: "own" }).length, 0); // slepi indeks: še vedno brez podvojenih
        const ex = await call("/api/account/export", { method: "POST", body: { password: "geslo1234" } });
        assert.equal(ex.status, 200);
        const child = ex.body.children[0];
        assert.equal(child.conversations[0].messages[0].text, SECRET_TEXT);
        assert.equal(child.reports[0].note, "opomba 4711");
        assert.equal(child.reports[0].question, SECRET_TEXT);
        assert.equal(child.flashcards[0].front, "Kaj je 4711?");
        assert.equal((await call(`/api/students/${student.id}/flashcards`)).body.cards[0].back, "Skrivno število 4711");
      },
      { store },
    );
    store.db.close();
    // V datoteki baze (in WAL) ni nobenega besedila iz pogovora.
    const raw = Buffer.concat([file, `${file}-wal`].filter((f) => fs.existsSync(f)).map((f) => fs.readFileSync(f)));
    assert.equal(raw.indexOf("4711"), -1);
    const db = new DatabaseSync(file);
    const stats = encryptionStats(db);
    assert.ok(stats.every((s) => s.plain === 0 && s.unreadable === 0), JSON.stringify(stats));
    assert.ok(stats.find((s) => s.table === "messages").encrypted >= 2);
    db.close();
    // Skripta za iskanje sporočil (docs/krizni-nacrt.md) še vedno najde besedilo.
    const out = execFileSync(process.execPath, ["--disable-warning=ExperimentalWarning", "scripts/najdi-sporocilo.js", "--besedilo", "V redu"], { env: { ...process.env, EVKLID_DB: file }, encoding: "utf8" });
    assert.match(out, new RegExp(SECRET_TEXT));
    const check = execFileSync(process.execPath, ["--disable-warning=ExperimentalWarning", "scripts/kljuc-podatkov.js", "--preveri"], { env: { ...process.env, EVKLID_DB: file }, encoding: "utf8" });
    assert.match(check, /messages\.display_text\s+šifrirano\s+2\s+nešifrirano\s+0/);
  });
  // Brez ključa: neberljivo besedilo namesto napake.
  const store = openDb(file);
  const conv = store.listConversations(1)[0];
  assert.equal(conv.title, UNREADABLE);
  assert.equal(store.listMessages(conv.id)[0].display_text, UNREADABLE);
  assert.equal(store.listMessages(conv.id)[0].api_content[0].text, UNREADABLE);
  store.db.close();
  fs.rmSync(dir, { recursive: true, force: true });
});

test("selitev: nešifrirane vrstice se zašifrirajo, stari ključ se zamenja, neberljive ostanejo", async () => {
  const store = openDb(":memory:");
  const s = store.createStudent("Ana");
  const c = store.createConversation(s.id, { title: "Naslov 4711" });
  store.addMessage(c.id, "user", [{ type: "text", text: "besedilo 4711" }], "besedilo 4711");
  store.cards.add(s.id, [{ front: "Vprašanje 4711", back: "Odgovor" }], { source: "own" });
  const k1 = newKey();
  const k2 = newKey();
  await withKey(k1, () => {
    const out = migrateEncryption(store.db, 1);
    assert.equal(out.messages, 1);
    assert.equal(out.conversations, 1);
    assert.equal(out.flashcards, 1);
    assert.deepEqual(migrateEncryption(store.db), {}); // idempotentno
    const raw = store.db.prepare("SELECT api_content, display_text FROM messages").get();
    assert.ok(isEncrypted(raw.api_content) && isEncrypted(raw.display_text));
    assert.match(store.db.prepare("SELECT norm FROM flashcards").get().norm, /^h1:/);
    assert.equal(store.listMessages(c.id)[0].display_text, "besedilo 4711");
  });
  await withKey(
    k2,
    () => {
      assert.equal(migrateEncryption(store.db).messages, 1); // znova s k2
      assert.equal(store.cards.add(s.id, [{ front: "vprašanje 4711", back: "x" }], { source: "own" }).length, 0);
    },
    `k1:${k1}`,
  );
  await withKey(k2, () => {
    assert.equal(store.getConversation(c.id).title, "Naslov 4711"); // brez k1
    store.db.prepare("UPDATE messages SET display_text = ?").run(`enc1:deadbeef:${Buffer.alloc(40).toString("base64")}`);
    assert.equal(migrateEncryption(store.db).messages ?? 0, 0); // neberljivo ostane
    assert.equal(store.listMessages(c.id)[0].display_text, UNREADABLE);
  });
});

// --- 3. roki hrambe ---
test("roki hrambe: stare fotografije, potekle seje, nepotrjeni računi brez podatkov", async () => {
  await withServer(async ({ client, calls, store }) => {
    const call = client();
    const { parent, student } = await parentWithChild(call, calls);
    await call(`/api/students/${student.id}/unlock`, { method: "POST", body: { password: "1234" } });
    const convId = await chat(call, student.id, { text: "Poglej nalogo", image: PHOTO });
    const db = store.db;
    db.prepare("UPDATE messages SET created_at = datetime('now','-8 days') WHERE has_image = 1").run();
    // Nepotrjena računa, stara 40 dni: prvi brez profilov se izbriše, drugi s pogovorom ostane.
    const ins = db.prepare("INSERT INTO parents (email, password_hash, privacy_version, unsubscribe_token, referral_code, created_at) VALUES (?, 'x', 'v', ?, ?, datetime('now','-40 days'))");
    const gone = Number(ins.run("stari@x.si", "u1", "R1").lastInsertRowid);
    const kept = Number(ins.run("zdata@x.si", "u2", "R2").lastInsertRowid);
    const kid = store.createStudent("Zala");
    db.prepare("UPDATE students SET parent_id = ? WHERE id = ?").run(kept, kid.id);
    store.createConversation(kid.id);
    db.prepare("INSERT INTO parent_sessions (token_hash, parent_id, expires_at) VALUES ('t', ?, '2000-01-01T00:00:00.000Z')").run(parent.id);
    const out = runRetention(db, { log: {} });
    assert.equal(out.images, 1);
    assert.equal(out.unverified, 1);
    assert.ok(out.sessions >= 1);
    assert.ok(!db.prepare("SELECT 1 FROM parents WHERE id = ?").get(gone));
    assert.ok(db.prepare("SELECT 1 FROM parents WHERE id = ?").get(kept));
    assert.ok(db.prepare("SELECT 1 FROM parents WHERE id = ?").get(parent.id)); // potrjen
    const msg = store.listMessages(convId)[0];
    assert.equal(msg.has_image, 2);
    assert.deepEqual(msg.api_content.map((b) => b.type), ["text", "text"]);
    assert.equal(msg.api_content[0].text, imageGoneText(7));
    // Zgodovina za model: samo besedilni bloki, vrstni red ostane.
    const hist = windowHistory(store.apiHistory(convId));
    assert.equal(hist[0].role, "user");
    assert.ok(hist.every((m) => m.content.every((b) => b.type === "text")));
    assert.equal((await call(`/api/conversations/${convId}`)).body.messages[0].has_image, true);
    assert.equal(runRetention(db, { log: {} }).images, 0); // enkrat
  });
});

// --- 4. dnevnik dostopov, 5. omejitve poskusov in gesla ---
test("dnevnik dostopov, omejitve poskusov, močnejša gesla, ponastavitev gesla", async () => {
  await withServer(async ({ client, calls, store, base }) => {
    const call = client();
    const { parent, student } = await parentWithChild(call, calls);
    const db = store.db;
    const pw = db.prepare("SELECT password_hash FROM parents WHERE id = ?").get(parent.id).password_hash;
    assert.match(pw, /^scrypt2\$\d+\$8\$1\$/);
    // Star zapis gesla se ob prijavi zamenja.
    const salt = crypto.randomBytes(16);
    db.prepare("UPDATE parents SET password_hash = ? WHERE id = ?").run(`scrypt$${salt.toString("base64")}$${crypto.scryptSync("geslo1234", salt, 64).toString("base64")}`, parent.id);
    const other = client();
    assert.equal((await other("/api/auth/login", { method: "POST", body: { email: "ana@primer.si", password: "geslo1234" } })).status, 200);
    assert.match(db.prepare("SELECT password_hash FROM parents WHERE id = ?").get(parent.id).password_hash, /^scrypt2\$/);
    // E-naslov: 30 napačnih na uro ne glede na naslov IP.
    const ip = (n) => ({ "X-Forwarded-For": `203.0.113.${n}` });
    let last;
    for (let i = 0; i < 31; i++) last = await client()("/api/auth/login", { method: "POST", headers: ip(i), body: { email: "ana@primer.si", password: "napak" } });
    assert.equal(last.status, 429);
    assert.equal((await client()("/api/auth/login", { method: "POST", headers: ip(99), body: { email: "ana@primer.si", password: "geslo1234" } })).status, 429);
    // Profil: 30 napačnih na uro z različnih naslovov.
    for (let i = 0; i < 31; i++) last = await call(`/api/students/${student.id}/unlock`, { method: "POST", headers: ip(i), body: { password: "0000" } });
    assert.equal(last.status, 429);
    // Izbris računa: napačna gesla se štejejo.
    for (let i = 0; i < 31; i++) last = await call("/api/account", { method: "DELETE", headers: ip(i), body: { password: "napak" } });
    assert.equal(last.status, 429);
    const log = db.prepare("SELECT * FROM audit_log").all();
    const actions = new Set(log.map((r) => r.action));
    for (const a of ["login", "login_fail", "profile_unlock_fail", "account_delete"]) assert.ok(actions.has(a), a);
    assert.ok(log.every((r) => !r.ip_hash || /^[0-9a-f]{16}$/.test(r.ip_hash)));
    assert.ok(!JSON.stringify(log).includes("203.0.113") && !JSON.stringify(log).includes("ana@primer.si"));
    assert.ok(log.some((r) => r.action === "login_fail" && r.ok === 0 && r.parent_id === parent.id));
    void base;
  });
  // Ponastavitev gesla izbriše vse seje; izbris računa odveže dnevnik.
  await withServer(async ({ client, calls, store }) => {
    const a = client();
    const { parent } = await parentWithChild(a, calls, "bor@primer.si");
    const b = client();
    assert.equal((await b("/api/auth/login", { method: "POST", body: { email: "bor@primer.si", password: "geslo1234" } })).status, 200);
    await a("/api/auth/forgot", { method: "POST", body: { email: "bor@primer.si" } });
    const token = /reset=([\w-]+)/.exec(calls.filter((c) => String(c.url).includes("resend")).at(-1).body.text)[1];
    assert.equal((await a("/api/auth/reset", { method: "POST", body: { token, password: "novogeslo1" } })).status, 200);
    assert.equal((await b("/api/account")).status, 401);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM parent_sessions WHERE parent_id = ?").get(parent.id).n, 1);
    assert.equal((await a("/api/account/export", { method: "POST", body: { password: "novogeslo1" } })).status, 200);
    assert.equal((await a("/api/account", { method: "DELETE", body: { password: "novogeslo1" } })).status, 200);
    const rows = store.db.prepare("SELECT action, parent_id FROM audit_log").all();
    for (const x of ["password_reset_request", "password_reset", "export", "account_delete"]) assert.ok(rows.some((r) => r.action === x), x);
    assert.ok(rows.every((r) => r.parent_id === null));
  });
});

test("gesla: scrypt2 s parametri v zapisu, stari zapisi še delujejo", async () => {
  const h = await hashPassword("geslo", { N: 2 ** 12, r: 8, p: 1 });
  assert.match(h, /^scrypt2\$4096\$8\$1\$/);
  assert.equal(await verifyPassword("geslo", h), true);
  assert.equal(await verifyPassword("Geslo", h), false);
  assert.equal(needsRehash(h), true); // šibkejši od trenutnega
  assert.equal(needsRehash(await hashPassword("geslo")), false);
  assert.equal(await verifyPassword("geslo", "scrypt2$1073741824$8$1$AA==$AA=="), false); // prevelik N iz baze
  assert.equal(await verifyPassword("x", "none$abc"), false);
});

// --- zavrnjena fotografija (flag=photo) ---
test("fotografija, ki ni učno gradivo: slika se ne shrani", async () => {
  const reply = 'Pomagam lahko le s fotografijami nalog in učnega gradiva. Fotografiraj nalogo!\n<<META subject=MAT topic="-" error=0 mode=A flag=photo done=0>>';
  await withServer(
    async ({ client, calls, store }) => {
      const call = client();
      const { student } = await parentWithChild(call, calls);
      await call(`/api/students/${student.id}/unlock`, { method: "POST", body: { password: "1234" } });
      const convId = await chat(call, student.id, { text: "", image: PHOTO });
      const [user, asst] = store.listMessages(convId);
      assert.ok(!user.api_content.some((b) => b.type === "image"));
      assert.match(user.api_content[0].text, /ni bila shranjena/);
      assert.ok(!JSON.stringify(store.db.prepare("SELECT api_content FROM messages").all()).includes(PHOTO.data));
      assert.match(asst.display_text, /le s fotografijami nalog/);
      assert.ok(!/META/.test(asst.display_text));
      // Staršem se ne prikaže kot opozorilo, kartic ni.
      assert.equal(store.db.prepare("SELECT flag FROM events").get().flag, "photo");
      assert.equal(store.flagEvents(student.id).length, 0); // ne pride niti v odgovor API za starše
      assert.equal(store.cards.count(student.id), 0);
    },
    { reply },
  );
  // Učna fotografija ostane (do roka hrambe).
  await withServer(async ({ client, calls, store }) => {
    const call = client();
    const { student } = await parentWithChild(call, calls);
    await call(`/api/students/${student.id}/unlock`, { method: "POST", body: { password: "1234" } });
    const convId = await chat(call, student.id, { text: "", image: PHOTO });
    assert.equal(store.listMessages(convId)[0].api_content[0].type, "image");
  });
});

// --- popravki pregleda 2 (funkcija in varnost) ---
test("gesla: vrsta za scrypt je omejena, polna vrsta vrne 503 (ne čakanja brez meje)", async () => {
  const stored = await hashPassword("geslo1234");
  const extra = 5;
  const all = await Promise.allSettled(Array.from({ length: SCRYPT_QUEUE_MAX + extra }, () => verifyPassword("geslo1234", stored)));
  assert.equal(all.filter((r) => r.status === "fulfilled" && r.value === true).length, SCRYPT_QUEUE_MAX);
  const busy = all.filter((r) => r.status === "rejected");
  assert.equal(busy.length, extra);
  assert.ok(busy.every((r) => r.reason.code === "SCRYPT_BUSY"));
  assert.equal(await verifyPassword("geslo1234", stored), true); // vrsta se sprazni
  await withServer(async ({ client }) => {
    const call = client();
    const res = await Promise.all(
      Array.from({ length: 40 }, (_, i) => call("/api/auth/login", { method: "POST", body: { email: `naval${i}@primer.si`, password: "napacno123" } })),
    );
    assert.ok(res.every((r) => r.status === 401 || r.status === 503), res.map((r) => r.status).join(","));
    const full = res.filter((r) => r.status === 503);
    assert.ok(full.length > 0);
    for (const r of full) {
      assert.match(r.body.error, /preobremenjen/);
      assert.equal(r.headers.get("retry-after"), "5");
    }
  });
});

test("prijava: geslo, zamenjano med preverjanjem, ne odpre seje", async () => {
  await withServer(async ({ client, calls, store }) => {
    const call = client();
    await parentWithChild(call, calls);
    const login = call("/api/auth/login", { method: "POST", body: { email: "ana@primer.si", password: "geslo1234" } });
    // Ponastavitev med čakanjem na scrypt (enako stori /api/auth/reset).
    setImmediate(() => store.db.prepare("UPDATE parents SET password_hash = 'scrypt2$16384$8$1$AAAA$AAAA'").run());
    assert.equal((await login).status, 401);
  });
});

test("izvoz želja za kozmetiko: šifrirano besedilo gre ven odšifrirano", async () => {
  await withKey(newKey(), async () => {
    const store = openDb(":memory:");
    const server = createApp(store, { scheduler: false }).listen(0);
    const base = `http://127.0.0.1:${server.address().port}`;
    const post = (p, body) => fetch(base + p, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    try {
      const s = await (await post("/api/students", { name: "Ana Novak" })).json();
      await post(`/api/students/${s.id}/feedback`, { kind: "cosmetics", ideas: "zmajevo jajce", lang: "sl" });
      assert.ok(isEncrypted(store.db.prepare("SELECT ideas FROM feedback").get().ideas));
      const out = await (await fetch(base + "/api/kozmetika/export")).json();
      assert.deepEqual(out.wishes.map((w) => w.text), ["zmajevo jajce"]);
      const row = store.db.prepare("SELECT actor, action, target FROM audit_log WHERE action = 'cosmetics_export'").get();
      assert.deepEqual({ ...row }, { actor: "system", action: "cosmetics_export", target: "wishes:1" });
    } finally {
      server.close();
    }
  });
});

test("roki hrambe: nepotrjen račun s profilom ostane; selitev velikih vrstic po delih", async () => {
  await withServer(async ({ store }) => {
    const db = store.db;
    const ins = db.prepare("INSERT INTO parents (email, password_hash, privacy_version, unsubscribe_token, referral_code, created_at) VALUES (?, 'x', 'v', ?, ?, datetime('now','-40 days'))");
    // Gost, ki je kasneje dobil račun (brez potrditve): profil brez pogovorov (npr. samo grafi ali igre) ostane.
    const kept = Number(ins.run("gost-prej@x.si", "u3", "R3").lastInsertRowid);
    const kid = store.createStudent("Lan");
    db.prepare("UPDATE students SET parent_id = ? WHERE id = ?").run(kept, kid.id);
    assert.equal(runRetention(db, { log: {} }).unverified, 0);
    assert.ok(db.prepare("SELECT 1 FROM students WHERE id = ?").get(kid.id));
    // Sporočila s fotografijami: paket se konča po ~8 MB, vse vrstice so na koncu šifrirane.
    const c = store.createConversation(kid.id);
    const big = "a".repeat(3 * 1024 * 1024);
    for (let i = 0; i < 4; i++) store.addMessage(c.id, "user", [{ type: "text", text: big }], `velika ${i}`);
    await withKey(newKey(), () => {
      const steps = [...encryptionSteps(db)].filter((x) => x.table === "messages");
      assert.ok(steps.length >= 2, `paketov: ${steps.length}`);
      assert.equal(steps.at(-1).changed, 4);
      assert.ok(db.prepare("SELECT api_content FROM messages").all().every((r) => isEncrypted(r.api_content)));
      assert.equal(store.listMessages(c.id)[3].display_text, "velika 3");
    });
  });
});

test("dnevnik dostopov: izbrisan gost ne ostane povezan z vrsticami (id se lahko ponovno uporabi)", async () => {
  await withServer(async ({ store }) => {
    const db = store.db;
    const id = Number(
      db
        .prepare("INSERT INTO parents (email, password_hash, privacy_version, unsubscribe_token, referral_code, is_guest, created_at) VALUES ('gost-x@gost.invalid', 'x', 'v', 'u9', 'R9', 1, datetime('now','-40 days'))")
        .run().lastInsertRowid,
    );
    audit(db, { parentId: id, action: "export" });
    assert.equal(new GuestQuota(db).cleanup(), 1);
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM audit_log WHERE parent_id = ?").get(id).n, 0);
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM audit_log WHERE action = 'export' AND parent_id IS NULL").get().n, 1);
  });
});

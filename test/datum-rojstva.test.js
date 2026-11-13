// Datum rojstva je obvezen (j 2026-11-06): registracija brez njega ne uspe, stari računi brez datuma ga ob
// prijavi vpišejo enkrat (ali izberejo »Pozneje«; brez datuma ni plačil), mladoletni plačujejo prek staršev (pay_link).
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import SL from "../public/i18n/sl.js";

// Datumi za teste po slovenskem koledarju (strežnik računa »danes« po Europe/Ljubljana, age.js), oblikovani brez
// toISOString: ta dela v UTC in bi okoli polnoči dal drug dan kot lokalni koledar (test bi padel med 00:00 in 02:00).
const SI = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Ljubljana", year: "numeric", month: "2-digit", day: "2-digit" });
const siToday = () => {
  const p = Object.fromEntries(SI.formatToParts(new Date()).map((x) => [x.type, Number(x.value)]));
  return { y: p.year, m: p.month, d: p.day };
};
const fmt = (y, m, d) => {
  const x = new Date(Date.UTC(y, m - 1, d)); // samo koledarsko računanje, brez ure
  const pad = (n) => String(n).padStart(2, "0");
  return `${x.getUTCFullYear()}-${pad(x.getUTCMonth() + 1)}-${pad(x.getUTCDate())}`;
};
const ymd = (yearsAgo, days = 1) => {
  const t = siToday();
  return fmt(t.y - yearsAgo, t.m, t.d - days);
};
// Dan pred 15. rojstnim dnem: še 14 let.
const almost15 = () => {
  const t = siToday();
  return fmt(t.y - 15, t.m, t.d + 1);
};

async function withServer(fn, extra = {}) {
  const store = openDb(":memory:");
  const logged = [];
  const rec = (...a) => logged.push(a.map((x) => (typeof x === "string" ? x : JSON.stringify(x))).join(" "));
  const app = createApp(store, {
    accounts: true,
    scheduler: false,
    resendKey: "re_x",
    fetchFn: async () => ({ ok: true, status: 200, json: async () => ({ id: "email_1" }) }),
    log: { error: rec, warn: rec, info: rec, log: rec },
    ...extra,
  });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const client = () => {
    const jar = {};
    const call = async (path, opts = {}) => {
      const res = await fetch(base + path, {
        method: opts.method || "GET",
        redirect: "manual",
        headers: { "Content-Type": "application/json", cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; ") },
        body: opts.body ? JSON.stringify(opts.body) : undefined,
      });
      for (const c of res.headers.getSetCookie()) {
        const [kv] = c.split(";");
        const i = kv.indexOf("=");
        jar[kv.slice(0, i)] = kv.slice(i + 1);
      }
      const type = res.headers.get("content-type") || "";
      return { status: res.status, body: type.includes("json") ? await res.json() : await res.text() };
    };
    call.cookie = () => Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; ");
    return call;
  };
  // Osebni podatki ne gredo v dnevnik: med testom ujamemo tudi console.*.
  const orig = { log: console.log, info: console.info, warn: console.warn, error: console.error };
  for (const k of Object.keys(orig)) console[k] = rec;
  try {
    await fn({ client, store, logged, base });
  } finally {
    Object.assign(console, orig);
    server.close();
  }
}

const body = (email, extra = {}) => ({ email, password: "geslo1234", accept_privacy: true, country: "SI", ...extra });
const register = (call, email, extra) => call("/api/auth/register", { method: "POST", body: body(email, extra) });
const parentRow = (store, email) => store.db.prepare("SELECT * FROM parents WHERE email = ?").get(email);

test("registracija: brez datuma rojstva prijazno sporočilo, nič shranjeno", async () => {
  await withServer(async ({ client, store }) => {
    const a = client();
    let r;
    for (const bad of [undefined, "", "2010-02-30", "12.4.1985", ymd(-1)]) {
      r = await register(a, "brez@primer.si", bad === undefined ? {} : { birth_date: bad });
      assert.equal(r.status, 400, String(bad));
      assert.equal(r.body.birth_date, true);
      assert.match(r.body.error, /datum rojstva/);
      assert.match(r.body.error, /starš/); // pove, zakaj ga potrebujemo
    }
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM parents").get().n, 0);
    // Aplikacija pokaže prevedeno besedilo birth.missing (vsi jeziki: test/i18n.test.js); slovensko je enako strežniku.
    assert.equal(SL["birth.missing"], r.body.error);
  });
});

test("registracija: mlajši od 15 let gre prek staršev, 15+ in polnoletni dobijo račun", async () => {
  await withServer(async ({ client, store }) => {
    const kid = await register(client(), "otrok@primer.si", { birth_date: almost15() });
    assert.equal(kid.status, 403);
    assert.equal(kid.body.under_age, true);
    assert.equal(kid.body.min_age, 15); // ZVOP-2: meja v Sloveniji je 15 let
    assert.equal(parentRow(store, "otrok@primer.si"), undefined);

    const teen = await register(client(), "dijak@primer.si", { birth_date: ymd(15) });
    assert.equal(teen.status, 201);
    assert.equal(teen.body.parent.minor, true); // plačila prek staršev
    assert.equal(teen.body.parent.need_birth, false);
    assert.equal(teen.body.parent.birth_missing, false);

    const adult = client();
    const r = await register(adult, "odrasla@primer.si", { birth_date: ymd(30) });
    assert.equal(r.status, 201);
    assert.equal(r.body.parent.minor, false);
    assert.equal(r.body.parent.need_birth, false);
    assert.equal(parentRow(store, "odrasla@primer.si").birth_date, ymd(30));
  });
});

test("star račun brez datuma: ob prijavi enkrat vprašamo, »Pozneje« ne zaklene, datum se vpiše samo enkrat", async () => {
  await withServer(async ({ client, store, logged }) => {
    const a = client();
    assert.equal((await register(a, "star@primer.si", { birth_date: ymd(40) })).status, 201);
    store.db.prepare("UPDATE parents SET birth_date = NULL WHERE email = 'star@primer.si'").run();

    const s1 = await a("/api/account/status");
    assert.equal(s1.body.parent.need_birth, true);
    assert.equal(s1.body.parent.birth_missing, true);
    assert.equal(s1.body.parent.minor, false); // star račun ostane kot doslej, dokler ne vpiše datuma

    // Pozneje: ne vprašamo več, račun deluje naprej, v zavihku Račun ostane možnost vpisa.
    const later = await a("/api/account/birth-date", { method: "POST", body: { later: true } });
    assert.equal(later.status, 200);
    assert.equal(later.body.parent.need_birth, false);
    assert.equal(later.body.parent.birth_missing, true);
    const b = client();
    assert.equal((await b("/api/auth/login", { method: "POST", body: { email: "star@primer.si", password: "geslo1234" } })).status, 200);
    assert.equal((await b("/api/account/status")).body.parent.need_birth, false);

    // Napačen datum: 400 z oznako polja; nič shranjeno.
    for (const bad of ["", "2001-13-01", ymd(-2)]) {
      const r = await b("/api/account/birth-date", { method: "POST", body: { birth_date: bad } });
      assert.equal(r.status, 400, bad);
      assert.equal(r.body.birth_date, true);
    }
    assert.equal(parentRow(store, "star@primer.si").birth_date, null);

    const ok = await b("/api/account/birth-date", { method: "POST", body: { birth_date: ymd(40) } });
    assert.equal(ok.status, 200);
    assert.equal(ok.body.under_age, undefined);
    assert.equal(ok.body.parent.minor, false);
    assert.equal(ok.body.parent.birth_missing, false);
    assert.equal(parentRow(store, "star@primer.si").birth_date, ymd(40));
    // Enkrat vpisanega datuma ni mogoče spremeniti (mladoletni se ne more narediti polnoletnega in obratno).
    const again = await b("/api/account/birth-date", { method: "POST", body: { birth_date: ymd(16) } });
    assert.equal(again.status, 409);
    assert.equal(parentRow(store, "star@primer.si").birth_date, ymd(40));
    // Datum rojstva ne gre v dnevnik.
    assert.ok(!logged.some((l) => l.includes(ymd(40)) || l.includes(ymd(16))), logged.join("\n"));
  });
});

test("star račun: mladoleten in mlajši od 15 let po vpisu datuma", async () => {
  await withServer(async ({ client, store }) => {
    const teen = client();
    await register(teen, "najstnik@primer.si", { birth_date: ymd(40) });
    const kid = client();
    await register(kid, "otrok@primer.si", { birth_date: ymd(40) });
    store.db.prepare("UPDATE parents SET birth_date = NULL").run();

    // 16 let: shranjeno, plačila prek staršev (minor), brez poziva k soglasju.
    const t16 = await teen("/api/account/birth-date", { method: "POST", body: { birth_date: ymd(16) } });
    assert.equal(t16.status, 200);
    assert.equal(t16.body.under_age, undefined);
    assert.equal(t16.body.parent.minor, true);

    // 14 let: shranjeno (plačila prek staršev), odgovor pove mejo za soglasje staršev.
    const k14 = await kid("/api/account/birth-date", { method: "POST", body: { birth_date: almost15() } });
    assert.equal(k14.status, 200);
    assert.equal(k14.body.under_age, true);
    assert.equal(k14.body.min_age, 15);
    assert.equal(k14.body.parent.minor, true);
    assert.equal(k14.body.parent.need_birth, false);
  });
});

test("datum rojstva: brez prijave 401, gost ga ne vpisuje", async () => {
  await withServer(
    async ({ client }) => {
      assert.equal((await client()("/api/account/birth-date", { method: "POST", body: { birth_date: ymd(30) } })).status, 401);
      const g = client();
      const guest = await g("/api/auth/guest", { method: "POST", body: { accept_privacy: true } });
      assert.equal(guest.status, 201);
      assert.equal(guest.body.parent.need_birth, false);
      assert.equal((await g("/api/account/birth-date", { method: "POST", body: { birth_date: ymd(30) } })).status, 400);
    },
    { guest: true },
  );
});

// Star račun brez datuma: register + izbris datuma (kot pred uvedbo vprašanja).
async function oldAccount(call, store, email) {
  assert.equal((await register(call, email, { birth_date: ymd(40) })).status, 201);
  store.db.prepare("UPDATE parents SET birth_date = NULL, birth_asked_at = NULL WHERE email = ?").run(email);
}

test("datum rojstva: na zaklenjeni napravi ga ne vpiše nihče (otrok na starševi napravi), po odklepu da", async () => {
  await withServer(
    async ({ client, store }) => {
      const a = client();
      await oldAccount(a, store, "zaklep@primer.si");
      await a("/api/account/lock", { method: "POST" });
      const st = (await a("/api/account/status")).body;
      assert.equal(st.account_unlocked, false);
      assert.equal(st.parent.need_birth, true); // aplikacija zaslona na zaklenjeni napravi ne pokaže (account.js route)
      for (const body of [{ birth_date: ymd(12) }, { later: true }]) {
        const r = await a("/api/account/birth-date", { method: "POST", body });
        assert.equal(r.status, 403);
        assert.equal(r.body.account_locked, true);
      }
      const row = parentRow(store, "zaklep@primer.si");
      assert.equal(row.birth_date, null);
      assert.equal(row.birth_asked_at, null); // vprašanje ostane za lastnika
      assert.equal((await a("/api/account/unlock", { method: "POST", body: { password: "geslo1234" } })).status, 200);
      assert.equal((await a("/api/account/birth-date", { method: "POST", body: { birth_date: ymd(40) } })).status, 200);
    },
    { accountLock: true },
  );
});

test("datum rojstva: starost pod 5 let je zatipkana letnica (400), 5 let gre", async () => {
  await withServer(async ({ client, store }) => {
    const a = client();
    await oldAccount(a, store, "mlad@primer.si");
    for (const bad of [ymd(0), ymd(4), fmt(siToday().y - 5, siToday().m, siToday().d + 1)]) {
      const r = await a("/api/account/birth-date", { method: "POST", body: { birth_date: bad } });
      assert.equal(r.status, 400, bad);
      assert.equal(r.body.birth_date, true);
    }
    assert.equal(parentRow(store, "mlad@primer.si").birth_date, null);
    assert.equal((await a("/api/account/birth-date", { method: "POST", body: { birth_date: ymd(5, 0) } })).status, 200);
  });
});

test("datum rojstva: dva hkratna zahtevka – uspe samo eden, drugi dobi 409 in datuma ne prepiše", async () => {
  await withServer(async ({ client, store, base }) => {
    const a = client();
    await oldAccount(a, store, "hkrati@primer.si");
    const http = await import("node:http");
    // Zahtevka z zakasnjenim telesom: strežnik naloži račun (še brez datuma) ob glavi, telo pride pozneje.
    const send = (birth) => {
      const data = JSON.stringify({ birth_date: birth });
      let req;
      const done = new Promise((resolve, reject) => {
        req = http.request(`${base}/api/account/birth-date`, { method: "POST", headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(data), cookie: a.cookie() } }, (res) => {
          let b = "";
          res.on("data", (c) => (b += c));
          res.on("end", () => resolve({ status: res.statusCode, body: JSON.parse(b || "{}") }));
        });
        req.on("error", reject);
        req.flushHeaders();
      });
      return { finish: () => req.end(data), done };
    };
    const minor = send(ymd(12));
    const adult = send(ymd(40));
    await new Promise((r) => setTimeout(r, 150));
    minor.finish();
    await new Promise((r) => setTimeout(r, 50));
    adult.finish();
    const res = [await minor.done, await adult.done].map((r) => r.status).sort();
    assert.deepEqual(res, [200, 409]);
    assert.equal(parentRow(store, "hkrati@primer.si").birth_date, ymd(12)); // prvi zapis ostane
    // 409 vrne tudi trenutno stanje računa, da aplikacija nadaljuje tok.
    const r409 = [await minor.done, await adult.done].find((r) => r.status === 409);
    assert.equal(r409.body.parent.birth_missing, false);
  });
});

test("datum rojstva: »Pozneje« po že vpisanem datumu vrne 409 in nič ne spremeni", async () => {
  await withServer(async ({ client, store }) => {
    const a = client();
    await oldAccount(a, store, "potem@primer.si");
    assert.equal((await a("/api/account/birth-date", { method: "POST", body: { birth_date: ymd(40) } })).status, 200);
    const asked = parentRow(store, "potem@primer.si").birth_asked_at;
    const r = await a("/api/account/birth-date", { method: "POST", body: { later: true } });
    assert.equal(r.status, 409);
    assert.equal(r.body.parent.birth_missing, false);
    assert.equal(parentRow(store, "potem@primer.si").birth_asked_at, asked);
  });
});

test("brez datuma rojstva (»Pozneje«) ni mogoče plačati ničesar; sporočilo pove, kje ga vpisati", async () => {
  await withServer(
    async ({ client, store }) => {
      const a = client();
      await oldAccount(a, store, "placa@primer.si");
      await a("/api/account/birth-date", { method: "POST", body: { later: true } });
      for (const [path, body] of [
        ["/api/billing/checkout", { seats: 1, interval: "month", adult: true, withdrawal: true }],
        ["/api/billing/upgrade", { plan: "x" }],
        ["/api/billing/pass", { student_id: 1, days: 7, adult: true, withdrawal: true }],
        ["/api/billing/credit", { pack: "p10", adult: true, withdrawal: true }],
        ["/api/billing/gift", { adult: true, withdrawal: true }],
        ["/api/billing/pay-link", { kind: "sub", seats: 1, interval: "month" }],
        ["/api/billing/podari", { adult: true, understand: true }],
        ["/api/guarantee/enroll", {}],
      ]) {
        const r = await a(path, { method: "POST", body });
        assert.equal(r.status, 403, `${path}: ${JSON.stringify(r.body)}`);
        assert.equal(r.body.birth_missing, true, path);
        assert.equal(r.body.error, SL["birth.payMissing"], path);
      }
      const acc = (await a("/api/account")).body;
      assert.equal(acc.parent.birth_missing, true);
      assert.equal((await a("/api/billing/credit")).body.birth_missing, true);
      assert.ok(!acc.guarantee?.can_enroll);
      // Po vpisu datuma polnoleten spet plača sam (checkout pride do Stripa).
      assert.equal((await a("/api/account/birth-date", { method: "POST", body: { birth_date: ymd(40) } })).status, 200);
      const co = await a("/api/billing/checkout", { method: "POST", body: { seats: 1, interval: "month", adult: true, withdrawal: true } });
      assert.notEqual(co.body.birth_missing, true);
    },
    { stripeKey: "sk_test_x", webhookSecret: "whsec_x" },
  );
});

test("povezava za plačilo: imetnik brez datuma rojstva je ne more ustvariti, že izdana povezava pa ne gre do plačila", async () => {
  await withServer(
    async ({ client, store }) => {
      const a = client();
      assert.equal((await register(a, "povezava@primer.si", { birth_date: ymd(40) })).status, 201);
      const made = await a("/api/billing/pay-link", { method: "POST", body: { kind: "sub", seats: 1, interval: "month" } });
      assert.equal(made.status, 201, JSON.stringify(made.body));
      const token = String(made.body.url).split("t=").pop();
      store.db.prepare("UPDATE parents SET birth_date = NULL, birth_asked_at = NULL WHERE email = ?").run("povezava@primer.si");
      const r = await client()(`/api/pay/${token}/checkout`, { method: "POST", body: { email: "oce@primer.si", adult: true, withdrawal: true } });
      assert.equal(r.status, 403, JSON.stringify(r.body));
      assert.equal(r.body.birth_missing, true);
    },
    { stripeKey: "sk_test_x", webhookSecret: "whsec_x" },
  );
});

test("migracija: obstoječa baza brez stolpca birth_asked_at ga dobi, podatki ostanejo", async () => {
  const { migrateAccounts } = await import("../server/accounts/schema.js");
  const store = openDb(":memory:");
  const db = store.db;
  migrateAccounts(db);
  db.prepare("INSERT INTO parents (email, password_hash, privacy_version, unsubscribe_token, referral_code) VALUES (?, ?, ?, ?, ?)").run("m@primer.si", "x", "1", "u", "r");
  db.exec("ALTER TABLE parents DROP COLUMN birth_asked_at");
  assert.ok(!db.prepare("PRAGMA table_info(parents)").all().some((c) => c.name === "birth_asked_at"));
  migrateAccounts(db);
  migrateAccounts(db); // idempotentno
  assert.ok(db.prepare("PRAGMA table_info(parents)").all().some((c) => c.name === "birth_asked_at"));
  const row = db.prepare("SELECT email, birth_date, birth_asked_at FROM parents").get();
  assert.deepEqual({ ...row }, { email: "m@primer.si", birth_date: null, birth_asked_at: null });
});

test("popravek datuma prek skrbnika: skripta popravi, zapiše v dnevnik dostopov brez osebnih podatkov", async () => {
  const { fixBirthDate } = await import("../scripts/popravi-datum-rojstva.js");
  const { auditFor } = await import("../server/dnevnik-dostopov.js");
  const { migrateAccounts } = await import("../server/accounts/schema.js");
  const db = openDb(":memory:").db;
  migrateAccounts(db);
  db.prepare("INSERT INTO parents (email, password_hash, privacy_version, unsubscribe_token, referral_code, birth_date) VALUES (?, ?, ?, ?, ?, ?)").run("Star@Primer.si", "x", "1", "u", "r", ymd(12));
  assert.ok(fixBirthDate(db, "nihce@primer.si", ymd(40)).error);
  assert.ok(fixBirthDate(db, "star@primer.si", ymd(2)).error); // pod 5 let
  assert.ok(fixBirthDate(db, "star@primer.si", "1985-02-30").error);
  assert.deepEqual(fixBirthDate(db, " STAR@primer.si ", ymd(40)), { ok: true });
  const row = db.prepare("SELECT id, birth_date, birth_asked_at FROM parents").get();
  assert.equal(row.birth_date, ymd(40));
  assert.ok(row.birth_asked_at);
  const log = auditFor(db, row.id);
  assert.equal(log.length, 1);
  assert.equal(log[0].actor, "admin");
  assert.equal(log[0].action, "birth_date_fix");
  assert.ok(!JSON.stringify(log).includes(ymd(40)) && !JSON.stringify(log).toLowerCase().includes("star@primer.si"));
});

test("poraba: brez datuma rojstva sporočilo o porabi pove, da je za dokup treba vpisati datum", async () => {
  const { Usage, BLOCK_TEXT } = await import("../server/usage.js");
  const u = new Usage(openDb(":memory:").db);
  u.questionsToday = () => 0;
  u.creditOut = () => false;
  for (const [tp, suffix] of [["birth", "Birth"], [true, "Topup"], [false, ""]]) {
    u.configure({ topupPrompt: () => tp });
    u.budgetState = () => ({ cap: 0, spent: 0 });
    u.overFreeTail = () => true;
    assert.equal(u.blockInfo(1).code, `block.freeTail${suffix}`);
    u.overFreeTail = () => false;
    u.overShare = () => true;
    u.budgetState = () => ({ cap: 10, spent: 10 });
    assert.equal(u.blockInfo(1).code, `block.capOut${suffix}`);
    u.budgetState = () => ({ cap: 10, spent: 1 });
    assert.equal(u.blockInfo(1).code, `block.shareOut${suffix}`);
  }
  for (const k of ["block.freeTailBirth", "block.capOutBirth", "block.shareOutBirth"]) {
    assert.equal(BLOCK_TEXT[k], SL[k]);
    assert.match(BLOCK_TEXT[k], /datum rojstva v zavihku Račun/);
  }
});

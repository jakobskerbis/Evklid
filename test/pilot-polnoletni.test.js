// Pilot samo s polnoletnimi (j 2026-11-25, kartica N-11 »Pilot samo s polnoletnimi«): koda vabila in skrbnikov
// »Dodaj« zavrneta imetnika, mlajšega od 18 let (ali brez znanega datuma rojstva); profil, mlajši od 18 let (ali brez
// znane starosti), ni član pilota, tudi če je račun v pilotu (naloge, preizkus znanja, fotografije, mnenja).
// Starost po server/accounts/age.js (ageOn, slovenski čas).
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { pilotMember, pilotAdult, adultParent, dropFormerPhotos } from "../server/pilot-naloge.js";
import { isPilotParent } from "../server/accounts/pilot-meja.js";
import { minAgeFromYear, SELF_CONSENT_PREFIX } from "../server/accounts/age.js";
import { SELF_CONSENT_TEXT } from "../server/accounts/index.js";

const CODE = "Gim-Ana-7q2k";
const day = (d) => new Date(Date.now() + d * 86400000).toISOString().slice(0, 10);
const ENV = { EVKLID_VABILA: CODE.toLowerCase(), EVKLID_PILOT_DO: day(30), EVKLID_PILOT_EMAILS: "", EVKLID_ADMIN_EMAILS: "skrbnik@primer.si", EVKLID_PILOT_VSI: "" };
// Datum rojstva za starost `age` let (rojstni dan je bil pred 40 dnevi, da ne pade na mejo dneva).
const bornYearsAgo = (age) => {
  const d = new Date(Date.now() - 40 * 86400000);
  d.setUTCFullYear(d.getUTCFullYear() - age);
  return d.toISOString().slice(0, 10);
};

async function withServer(fn) {
  const prev = {};
  for (const [k, v] of Object.entries(ENV)) {
    prev[k] = process.env[k];
    process.env[k] = v;
  }
  const store = openDb(":memory:");
  const mails = [];
  const fetchFn = async (url, init = {}) => {
    if (new URL(url).host === "api.resend.com") mails.push(JSON.parse(init.body));
    return { ok: true, status: 200, json: async () => ({ id: "x" }) };
  };
  const app = createApp(store, { accounts: true, scheduler: false, resendKey: "re_x", fetchFn, log: { error() {}, info() {}, warn() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const client = () => {
    const jar = {};
    return async (path, opts = {}) => {
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
  };
  const register = async (call, email, body = {}) => {
    const r = await call("/api/auth/register", { method: "POST", body: { email, password: "geslo1234", accept_privacy: true, country: "SI", ...body } });
    assert.equal(r.status, 201, JSON.stringify(r.body));
    return r.body;
  };
  const verifyLink = (email) => /\/api\/auth\/verify\?token=[\w-]+/.exec(mails.filter((m) => m.to[0] === email).at(-1).text)[0];
  const verify = async (call, email) => assert.equal((await call(verifyLink(email))).status, 302);
  const parent = (email) => store.db.prepare("SELECT * FROM parents WHERE email = ?").get(email);
  const actions = (email) =>
    store.db.prepare("SELECT action, ok FROM audit_log WHERE parent_id = ? AND action LIKE 'pilot_%' ORDER BY id").all(parent(email).id).map((r) => `${r.action}:${r.ok}`);
  try {
    await fn({ store, db: store.db, client, register, verify, parent, actions });
  } finally {
    server.close();
    for (const [k, v] of Object.entries(prev)) v === undefined ? delete process.env[k] : (process.env[k] = v);
  }
}

test("N-11: 17-letni z (veljavno) kodo vabila: registracija uspe, pove »minor«, koda se ne shrani in ostane neporabljena", async () => {
  await withServer(async ({ client, register, verify, parent, actions, db }) => {
    const teen = client();
    const r = await register(teen, "dijak@primer.si", { birth_date: bornYearsAgo(17), invite: CODE });
    assert.equal(r.invite, "minor");
    assert.equal(parent("dijak@primer.si").pilot_invite_hash, null, "koda se mladoletnemu ne shrani");
    await verify(teen, "dijak@primer.si");
    const p = parent("dijak@primer.si");
    assert.equal(p.pilot_at, null);
    assert.equal(p.pilot_invite_at, null);
    assert.equal(isPilotParent(p), false);
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM pilot_vabila").get().n, 0, "koda ni porabljena");
    assert.deepEqual(actions("dijak@primer.si"), ["pilot_invite_minor:0"]);
    // Ista koda zdaj velja za polnoletnega (ni bila porabljena).
    const adult = client();
    assert.equal((await register(adult, "maturant@primer.si", { birth_date: bornYearsAgo(18), invite: CODE })).invite, "pending");
    await verify(adult, "maturant@primer.si");
    assert.ok(parent("maturant@primer.si").pilot_at);
    assert.equal(isPilotParent(parent("maturant@primer.si")), true);
  });
});

test("N-11: star račun brez datuma rojstva s čakajočo kodo: koda počaka; vpisan mladoleten datum jo zavrže, polnoleten porabi", async () => {
  await withServer(async ({ client, register, parent, actions, db }) => {
    // Koda je shranjena (registracija), datum rojstva pa manjka (kot star račun pred obveznim datumom), e-naslov potrjen.
    const oldAccount = async (email) => {
      const call = client();
      assert.equal((await register(call, email, { birth_date: bornYearsAgo(30), invite: CODE })).invite, "pending");
      db.prepare("UPDATE parents SET birth_date = NULL, email_verified_at = datetime('now') WHERE email = ?").run(email);
      // Ogled stanja (pot, ki sicer porabi čakajočo kodo potrjenega računa) kode brez datuma ne porabi in ne zavrže.
      assert.equal((await call("/api/account/status")).status, 200);
      assert.equal(parent(email).pilot_at, null, `${email}: brez datuma rojstva ni pilota`);
      assert.ok(parent(email).pilot_invite_hash, "koda počaka");
      return call;
    };
    const mlad = await oldAccount("mlad@primer.si");
    let r = await mlad("/api/account/birth-date", { method: "POST", body: { birth_date: bornYearsAgo(16) } });
    assert.equal(r.status, 200, JSON.stringify(r.body));
    assert.equal(parent("mlad@primer.si").pilot_at, null, "mladoleten ni v pilotu");
    assert.equal(parent("mlad@primer.si").pilot_invite_hash, null, "koda odpade z računa");
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM pilot_vabila").get().n, 0, "koda ni porabljena");
    assert.deepEqual(actions("mlad@primer.si"), ["pilot_invite_pending:1", "pilot_invite_minor:0"]);

    const star = await oldAccount("star@primer.si");
    r = await star("/api/account/birth-date", { method: "POST", body: { birth_date: bornYearsAgo(30) } });
    assert.equal(r.status, 200, JSON.stringify(r.body));
    assert.ok(parent("star@primer.si").pilot_at, "z vpisanim polnoletnim datumom je član pilota");
    assert.ok(parent("star@primer.si").pilot_invite_at);
    assert.deepEqual(actions("star@primer.si"), ["pilot_invite_pending:1", "pilot_invite_used:1"]);
  });
});

test("N-11: skrbnikov »Dodaj« zavrne mladoletnega imetnika in račun brez datuma rojstva; polnoletnega doda; »Odstrani« gre vedno", async () => {
  await withServer(async ({ client, register, parent, db }) => {
    const admin = client();
    await register(admin, "skrbnik@primer.si", { birth_date: bornYearsAgo(40) });
    db.prepare("UPDATE parents SET is_admin = 1, email_verified_at = datetime('now') WHERE email = 'skrbnik@primer.si'").run();
    await register(client(), "mlad@primer.si", { birth_date: bornYearsAgo(17) });
    await register(client(), "brez@primer.si", { birth_date: bornYearsAgo(25) });
    db.prepare("UPDATE parents SET birth_date = NULL WHERE email = 'brez@primer.si'").run();
    await register(client(), "odrasel@primer.si", { birth_date: bornYearsAgo(18) });
    const add = (email, on = true) => admin("/api/admin/pilot-naloge/clani", { method: "POST", body: { email, on } });

    let r = await add("mlad@primer.si");
    assert.equal(r.status, 400);
    assert.equal(r.body.minor, true);
    assert.match(r.body.error, /mlajši od 18/);
    assert.equal(parent("mlad@primer.si").pilot_at, null);
    r = await add("brez@primer.si");
    assert.equal(r.status, 400);
    assert.match(r.body.error, /datuma rojstva/);
    assert.equal(parent("brez@primer.si").pilot_at, null);
    const audit = db.prepare("SELECT action, ok, target FROM audit_log WHERE action = 'pilot_add_minor' ORDER BY id").all();
    assert.deepEqual(audit.map((a) => [a.ok, a.target]), [[0, `parent:${parent("mlad@primer.si").id}`], [0, `parent:${parent("brez@primer.si").id}`]]);

    r = await add("odrasel@primer.si");
    assert.equal(r.status, 200);
    assert.ok(parent("odrasel@primer.si").pilot_at);
    // Odstranitev (tudi računa, ki je v pilotu ostal od prej in je mlajši) gre vedno.
    db.prepare("UPDATE parents SET pilot_at = datetime('now') WHERE email = 'mlad@primer.si'").run();
    assert.equal((await add("mlad@primer.si", false)).status, 200);
    assert.equal(parent("mlad@primer.si").pilot_at, null);
  });
});

test("N-11: v pilotnem računu je član samo polnoleten profil; otrok, 17-letni in profil brez letnice niso (naloge 403)", async () => {
  await withServer(async ({ client, register, parent, db }) => {
    const call = client();
    await register(call, "stars@primer.si", { birth_date: bornYearsAgo(45) });
    db.prepare("UPDATE parents SET email_verified_at = datetime('now'), pilot_at = datetime('now') WHERE email = 'stars@primer.si'").run();
    const y = new Date().getFullYear();
    const add = async (name, year) => {
      const r = await call("/api/students", { method: "POST", body: { name, birth_year: year, consent: true } });
      assert.equal(r.status, 201, JSON.stringify(r.body));
      return r.body.id;
    };
    const kid = await add("Lan", y - 13);
    const adult = await add("Tim", y - 19);
    // Tretji profil neposredno (brezplačni paket ima dve mesti): letos dopolni 18, morda je še 17 (previdno).
    const seventeen = Number(
      db.prepare("INSERT INTO students (name, settings, parent_id, birth_year) VALUES ('Eva', '{}', ?, ?)").run(parent("stars@primer.si").id, y - 18).lastInsertRowid,
    );
    assert.ok(kid && seventeen && adult);
    assert.equal(pilotMember(db, kid), null);
    assert.equal(pilotMember(db, seventeen), null);
    assert.equal(pilotMember(db, adult), "account");
    db.prepare("UPDATE students SET birth_year = NULL WHERE id = ?").run(adult);
    assert.equal(pilotMember(db, adult), null, "brez letnice ne vemo");
    // API: otrok ne dobi nalog pilota ne preizkusa znanja.
    assert.deepEqual((await call(`/api/students/${kid}/pilot`)).body, { member: false });
    assert.equal((await call(`/api/students/${kid}/pilot/scan`, { method: "POST", body: { cond: "light", ok: true } })).status, 403);
    assert.equal((await call(`/api/students/${kid}/pilot/quiz`, { method: "POST", body: {} })).status, 403);
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM pilot_scans").get().n, 0);
    assert.equal(parent("stars@primer.si").pilot_at !== null, true, "račun ostane v pilotu (polnoleten imetnik)");
  });
});

test("N-11: lasten profil (»Zame«) šteje po imetnikovem datumu rojstva, tudi na dan 18. rojstnega dne po slovenskem času", async () => {
  await withServer(async ({ client, register, db }) => {
    const call = client();
    await register(call, "maturant@primer.si", { birth_date: "2008-12-01" });
    db.prepare("UPDATE parents SET email_verified_at = datetime('now'), pilot_at = datetime('now') WHERE email = 'maturant@primer.si'").run();
    const sid = (await call("/api/students", { method: "POST", body: { name: "Maja", self: true, consent: true } })).body.id;
    assert.ok(sid);
    // Letnica profila (2008) sama ne zadošča, imetnikov datum pa da.
    assert.equal(pilotAdult(db, sid, new Date("2026-11-30T22:59:00Z")), false, "30. 11. 23:59 v Ljubljani: še 17");
    assert.equal(pilotAdult(db, sid, new Date("2026-11-30T23:00:00Z")), true, "1. 12. 00:00 v Ljubljani: 18");
    assert.equal(pilotAdult(db, sid, new Date("2026-12-02T10:00:00Z")), true);
    // Soglasje »Zame« prepoznamo po prvem stavku (isti kot v server/accounts/index.js).
    assert.ok(SELF_CONSENT_TEXT.startsWith(SELF_CONSENT_PREFIX));
  });
});

test("N-11: pomočniki starosti: adultParent, minAgeFromYear (rojen 31. 12.)", () => {
  const now = new Date("2026-11-25T12:00:00Z");
  assert.equal(adultParent({ birth_date: "2008-11-25" }, now), true);
  assert.equal(adultParent({ birth_date: "2008-11-26" }, now), false);
  assert.equal(adultParent({ birth_date: null }, now), false);
  assert.equal(adultParent(null, now), false);
  assert.equal(minAgeFromYear(2008, now), 17);
  assert.equal(minAgeFromYear(2007, now), 18);
  assert.equal(minAgeFromYear(null, now), null);
  assert.equal(minAgeFromYear(2008, new Date("2026-12-31T00:00:00Z")), 18, "31. 12. v Ljubljani");
});

test("N-11: šola s pilotno licenco: učenec brez znane polnoletnosti ni član; fotografije mladoletnih v pilotu dnevno čiščenje izbriše", async () => {
  await withServer(async ({ client, register, db }) => {
    const call = client();
    await register(call, "stars2@primer.si", { birth_date: bornYearsAgo(45) });
    db.prepare("UPDATE parents SET email_verified_at = datetime('now'), pilot_at = datetime('now') WHERE email = 'stars2@primer.si'").run();
    const y = new Date().getFullYear();
    const teen = (await call("/api/students", { method: "POST", body: { name: "Ana", birth_year: y - 16, consent: true } })).body.id;
    const adult = (await call("/api/students", { method: "POST", body: { name: "Bor", birth_year: y - 20, consent: true } })).body.id;
    // Fotografiji iz časa pred pravilom (oba profila).
    for (const sid of [teen, adult]) {
      const scan = Number(db.prepare("INSERT INTO pilot_scans (student_id, cond, ok) VALUES (?, 'light', 1)").run(sid).lastInsertRowid);
      db.prepare("INSERT INTO pilot_photos (scan_id, student_id, image, consent) VALUES (?, ?, 'x', '{}')").run(scan, sid);
    }
    assert.equal(dropFormerPhotos(db), 1);
    assert.deepEqual(db.prepare("SELECT student_id FROM pilot_photos").all().map((r) => r.student_id), [adult]);
    // Profil brez računa (šolski ali star): samo po letnici; brez nje ni član.
    const lone = Number(db.prepare("INSERT INTO students (name, settings) VALUES ('X', '{}')").run().lastInsertRowid);
    assert.equal(pilotAdult(db, lone), false);
    db.prepare("UPDATE students SET birth_year = ? WHERE id = ?").run(y - 25, lone);
    assert.equal(pilotAdult(db, lone), true);
  });
});

// Pregled #1121: profil »Zame« šteje po imetnikovem datumu samo, če se letnica ujema (gost, ki se je ob prijavi
// preselil v starševski račun, ali otrok, pomotoma dodan kot »Zame«).
test("N-11: profil »Zame« z drugo letnico od imetnikove (preseljen gost) šteje po svoji letnici", async () => {
  await withServer(async ({ client, register, parent, db }) => {
    const call = client();
    await register(call, "starsz@primer.si", { birth_date: bornYearsAgo(45) });
    db.prepare("UPDATE parents SET email_verified_at = datetime('now'), pilot_at = datetime('now') WHERE email = 'starsz@primer.si'").run();
    const pid = parent("starsz@primer.si").id;
    const y = new Date().getFullYear();
    const sid = Number(db.prepare("INSERT INTO students (name, settings, parent_id, birth_year) VALUES ('Gost', '{}', ?, ?)").run(pid, y - 16).lastInsertRowid);
    db.prepare("INSERT INTO consents (parent_id, student_id, child_birth_year, under_15, version, text, parent_email) VALUES (?, ?, ?, 0, 'v', ?, 'x')").run(pid, sid, y - 16, SELF_CONSENT_TEXT);
    assert.equal(pilotAdult(db, sid), false, "16-letni gost se ne meri po starševem datumu");
    assert.equal(pilotMember(db, sid), null);
    // Ista letnica kot imetnik: imetnikov lasten profil.
    db.prepare("UPDATE students SET birth_year = ? WHERE id = ?").run(Number(parent("starsz@primer.si").birth_date.slice(0, 4)), sid);
    assert.equal(pilotMember(db, sid), "account");
  });
});

test("N-11: šola s pilotno licenco: polnoleten učenec razreda je član, 16-letni in učenec brez letnice nista", async () => {
  await withServer(async ({ db }) => {
    const y = new Date().getFullYear();
    const school = Number(db.prepare("INSERT INTO schools (name, invite_code) VALUES ('Gimnazija', 'GIMPIL1')").run().lastInsertRowid);
    db.prepare("INSERT INTO school_licences (school_id, plan, seats, valid_from, valid_until) VALUES (?, 'pilot', 30, '2026-01-01', '2099-01-01')").run(school);
    const cls = Number(db.prepare("INSERT INTO classes (code, name, kind, school_id) VALUES ('RAZ4A', '4.a', 'class', ?)").run(school).lastInsertRowid);
    const pupil = (year) => {
      const id = Number(db.prepare("INSERT INTO students (name, settings, birth_year) VALUES ('U', '{}', ?)").run(year).lastInsertRowid);
      db.prepare("INSERT INTO class_members (class_id, student_id) VALUES (?, ?)").run(cls, id);
      return id;
    };
    assert.equal(pilotMember(db, pupil(y - 20)), "school");
    assert.equal(pilotMember(db, pupil(y - 16)), null);
    assert.equal(pilotMember(db, pupil(null)), null);
  });
});

test("N-11: EVKLID_PILOT_VSI v produkciji ne velja (vsi bi bili v pilotu brez preverjanja starosti)", async () => {
  await withServer(async ({ db }) => {
    const kid = Number(db.prepare("INSERT INTO students (name, settings, birth_year) VALUES ('K', '{}', ?)").run(new Date().getFullYear() - 12).lastInsertRowid);
    const prev = [process.env.EVKLID_PILOT_VSI, process.env.NODE_ENV];
    try {
      process.env.EVKLID_PILOT_VSI = "1";
      process.env.NODE_ENV = "test";
      assert.equal(pilotMember(db, kid), "all", "na lastnem računalniku za preizkus");
      process.env.NODE_ENV = "production";
      assert.equal(pilotMember(db, kid), null);
    } finally {
      for (const [k, v] of [["EVKLID_PILOT_VSI", prev[0]], ["NODE_ENV", prev[1]]]) v === undefined ? delete process.env[k] : (process.env[k] = v);
    }
  });
});

test("N-11: račun mladoletnega imetnika, ki je bil v pilotu že prej, ob zagonu izstopi (oznaka in fotografije)", async () => {
  await withServer(async ({ client, register, parent, db, store }) => {
    await register(client(), "prej@primer.si", { birth_date: bornYearsAgo(17) });
    await register(client(), "odrasel2@primer.si", { birth_date: bornYearsAgo(30) });
    // Oba je skrbnik dodal v pilot pred pravilom (pilot_at); umaknjena koda vabila je ločen primer (vabilo-clanstvo).
    db.prepare("UPDATE parents SET email_verified_at = datetime('now'), pilot_at = datetime('now') WHERE email IN ('prej@primer.si', 'odrasel2@primer.si')").run();
    const sid = Number(db.prepare("INSERT INTO students (name, settings, parent_id) VALUES ('P', '{}', ?)").run(parent("prej@primer.si").id).lastInsertRowid);
    const scan = Number(db.prepare("INSERT INTO pilot_scans (student_id, cond, ok) VALUES (?, 'light', 1)").run(sid).lastInsertRowid);
    db.prepare("INSERT INTO pilot_photos (scan_id, student_id, image, consent) VALUES (?, ?, 'x', '{}')").run(scan, sid);
    // Ponoven zagon (purgePilotKv ob zagonu in vsakih 30 min).
    createApp(store, { accounts: true, scheduler: false, log: { error() {}, info() {}, warn() {} } });
    const p = parent("prej@primer.si");
    assert.equal(p.pilot_at, null);
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM pilot_photos").get().n, 0);
    assert.ok(db.prepare("SELECT 1 FROM audit_log WHERE parent_id = ? AND action = 'pilot_minor_ended'").get(p.id));
    assert.ok(parent("odrasel2@primer.si").pilot_at, "polnoleten ostane");
  });
});

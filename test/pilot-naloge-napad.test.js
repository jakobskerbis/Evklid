// Pregled PR #474 (3/3): napadi na naloge za člane pilota. Vsak test opisuje luknjo, ki jo je pregled našel in je zdaj zaprta.
import crypto from "node:crypto";
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { pilotTasksReport, XP } from "../server/pilot-naloge.js";
import { runRetention } from "../server/zasebnost.js";

const IMG = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ==";
const quiet = { log() {}, info() {}, warn() {}, error() {} };
// Fotografije shranimo samo s šifrirnim ključem (H6); testi s fotografijo zato tečejo s ključem.
process.env.EVKLID_DATA_KEY ||= crypto.randomBytes(32).toString("base64");

async function withServer(fn) {
  const store = openDb(":memory:");
  const app = createApp(store, { accounts: true, scheduler: false, resendKey: "re_x", fetchFn: async () => ({ ok: true, status: 200, json: async () => ({ id: "e" }) }), log: quiet });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const client = () => {
    const jar = {};
    return async (path, opts = {}) => {
      const res = await fetch(base + path, {
        method: opts.method || "GET",
        headers: { "Content-Type": "application/json", cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; ") },
        body: opts.raw ?? (opts.body ? JSON.stringify(opts.body) : undefined),
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
  const warn = console.warn;
  console.warn = () => {};
  try {
    await fn({ client, store });
  } finally {
    console.warn = warn;
    server.close();
  }
}

async function account(client, store, email, born) {
  const call = client();
  const y = new Date().getFullYear() - born;
  const r = await call("/api/auth/register", { method: "POST", body: { email, password: "geslo1234", accept_privacy: true, country: "SI", birth_date: `${y}-01-15` } });
  assert.equal(r.status, 201, JSON.stringify(r.body));
  store.db.prepare("UPDATE parents SET email_verified_at = datetime('now') WHERE email = ?").run(email);
  const s = await call("/api/students", { method: "POST", body: { name: "Maja", self: true, consent: true } });
  assert.equal(s.status, 201, JSON.stringify(s.body));
  return { call, sid: s.body.id };
}
const setPilot = (store, email, on = true) => store.db.prepare(`UPDATE parents SET pilot_at = ${on ? "datetime('now')" : "NULL"} WHERE email = ?`).run(email);
const photos = (store) => store.db.prepare("SELECT COUNT(*) AS n FROM pilot_photos").get().n;

// H1: učenec, ki ni več v pilotu (skrbnik ga odstrani ali šoli poteče pilotna licenca), fotografije ne vidi in je
// ne more izbrisati v aplikaciji, čeprav mu soglasje obljublja »Prej jo lahko izbrišeš pod »Pomagaj izboljšati Evklid««.
test("H1: po odstranitvi iz pilota fotografija ne ostane brez gumba za izbris", async () => {
  await withServer(async ({ client, store }) => {
    const a = await account(client, store, "h1@pilot.si", 18);
    setPilot(store, "h1@pilot.si");
    await a.call(`/api/students/${a.sid}/pilot`);
    const r = await a.call(`/api/students/${a.sid}/pilot/scan`, { method: "POST", body: { cond: "board", ok: true, image: IMG, consent: true } });
    assert.equal(r.status, 200);
    setPilot(store, "h1@pilot.si", false);
    const st = (await a.call(`/api/students/${a.sid}/pilot`)).body;
    // Sprejemljivo: ali so fotografije ob izstopu izbrisane ali pa stanje še pokaže, kje so (da jih UI ponudi v izbris).
    const visible = JSON.stringify(st).includes("board");
    assert.ok(photos(store) === 0 || visible, `fotografija ostane (${photos(store)}), stanje: ${JSON.stringify(st)}`);
  });
});

// H2: preverjanje velikosti obidemo s tabelo z enim nizom (String([x]) === x, [x].length === 1).
test("H2: slika v tabeli ne obide meje 6 MB", async () => {
  await withServer(async ({ client, store }) => {
    const a = await account(client, store, "h2@pilot.si", 18);
    setPilot(store, "h2@pilot.si");
    const big = `data:image/png;base64,${"A".repeat(7 * 1024 * 1024)}`;
    const r = await a.call(`/api/students/${a.sid}/pilot/scan`, { method: "POST", body: { cond: "light", ok: true, image: [big], consent: true } });
    assert.equal(r.status, 400, `status ${r.status}, shranjenih fotografij: ${photos(store)}`);
    assert.equal(photos(store), 0);
  });
});

// H3: s ponarejeno zahtevo dobi XP za oba dela (»exams« in »3d«), čeprav jih aplikacija pokaže le 5 (FEATURES_SHOWN).
test("H3: deli aplikacije ne dajo več kot 5 × XP.feature", async () => {
  await withServer(async ({ client, store }) => {
    const a = await account(client, store, "h3@pilot.si", 18);
    setPilot(store, "h3@pilot.si");
    for (const f of ["chat", "textbook", "graph", "cards", "exams", "3d"]) await a.call(`/api/students/${a.sid}/pilot/feature`, { method: "POST", body: { feature: f, ok: true } });
    const xp = store.db.prepare("SELECT COALESCE(SUM(amount),0) AS s FROM xp_events WHERE student_id = ? AND reason LIKE 'pilot: feature:%'").get(a.sid).s;
    assert.ok(xp <= 5 * XP.feature, `XP za dele: ${xp}`);
  });
});

// H4: ena oddana anketa → skrbnik vidi natanko odgovore te osebe (povprečje enega). Pri majhnem pilotu
// (seznam računov v pilotu je na isti strani) je to odgovor znane osebe. Prag (j, 6. 11.): povprečja šele od 3 odgovorov.
test("H4: anketa z enim odgovorom ne razkrije posameznika", async () => {
  await withServer(async ({ client, store }) => {
    const a = await account(client, store, "h4@pilot.si", 18);
    setPilot(store, "h4@pilot.si");
    await a.call(`/api/students/${a.sid}/pilot`);
    store.db.prepare("UPDATE pilot_state SET joined_at = datetime('now', '-8 days')").run();
    const r = await a.call(`/api/students/${a.sid}/pilot/survey`, { method: "POST", body: { answers: { overall: 1, tutor: 2, scan: 1, school: 1 }, improve: "look" } });
    assert.equal(r.status, 200);
    const rep = pilotTasksReport(store.db);
    assert.equal(rep.survey.avg.overall, null, `povprečje iz 1 odgovora: ${JSON.stringify(rep.survey)}`);
  });
});

// H5: rok hrambe se bere iz okolja ob čiščenju, ne iz soglasja. Fotografija, shranjena s soglasjem »30 dni«,
// po spremembi EVKLID_PILOT_PHOTO_DAYS na 90 živi 90 dni.
test("H5: fotografija se izbriše po roku, ki ga je učenec potrdil", async () => {
  await withServer(async ({ client, store }) => {
    const a = await account(client, store, "h5@pilot.si", 18);
    setPilot(store, "h5@pilot.si");
    await a.call(`/api/students/${a.sid}/pilot/scan`, { method: "POST", body: { cond: "light", ok: true, image: IMG, consent: true } });
    assert.match(store.db.prepare("SELECT consent FROM pilot_photos").get().consent, /30 dni/);
    store.db.prepare("UPDATE pilot_photos SET created_at = datetime('now', '-31 days')").run();
    process.env.EVKLID_PILOT_PHOTO_DAYS = "90";
    try {
      runRetention(store.db, { log: quiet });
    } finally {
      delete process.env.EVKLID_PILOT_PHOTO_DAYS;
    }
    assert.equal(photos(store), 0);
  });
});

// H6: brez EVKLID_DATA_KEY seal() vrne besedilo nespremenjeno: fotografija otroka leži v bazi (in v kopijah)
// nešifrirana, čeprav PR in zasebnost.html obljubljata šifriranje. Brez ključa fotografije ne bi smeli sprejeti.
test("H6: brez ključa za šifriranje fotografije ne shranimo", async () => {
  const key = process.env.EVKLID_DATA_KEY;
  delete process.env.EVKLID_DATA_KEY;
  try {
    await withServer(async ({ client, store }) => {
      const a = await account(client, store, "h6@pilot.si", 18);
      setPilot(store, "h6@pilot.si");
      await a.call(`/api/students/${a.sid}/pilot/scan`, { method: "POST", body: { cond: "light", ok: true, image: IMG, consent: true } });
      const row = store.db.prepare("SELECT image FROM pilot_photos").get();
      assert.ok(!row || !row.image.startsWith("data:image/"), "fotografija je v bazi kot navaden data URL");
    });
  } finally {
    if (key !== undefined) process.env.EVKLID_DATA_KEY = key;
  }
});

// H7: mlajšemu od 15 piše »Shranimo samo tvojo oceno in kratko opombo, brez fotografij«, strežnik pa shrani še
// prepis naloge s fotografije (lahko vsebuje ime z delovnega lista). Prepisa nihče ne bere (skrbnik ga ne vidi).
test("H7: prepis naloge se brez fotografije ne shrani (besedilo »samo ocena in opomba«)", async () => {
  await withServer(async ({ client, store }) => {
    const a = await account(client, store, "h7@pilot.si", 14 + 1); // letos 15: mlajši
    setPilot(store, "h7@pilot.si");
    const r = await a.call(`/api/students/${a.sid}/pilot/scan`, { method: "POST", body: { cond: "light", ok: true, problems: ["Ime: Maja Novak, 7.b — 3x+2=11"] } });
    assert.equal(r.status, 200);
    assert.equal(store.db.prepare("SELECT problems FROM pilot_scans").get().problems, null);
  });
});

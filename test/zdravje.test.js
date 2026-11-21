// Zdravje strežnika (server/zdravje.js): AI ne dela za nikogar, nepričakovani ponovni zagoni, disk, javni alarm
// /healthz/alarm in nova polja v /healthz/stanje (brez vsebine, naslovov in ključev).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { createZdravje, vrstaNapakeAi, razlogiAlarma, ZAPORED, NAJVEC_NA_DAN } from "../server/zdravje.js";
import { apiErrorCode } from "../server/claude.js";
import { presojaStanja } from "../scripts/straza.mjs";

const ENV = { EVKLID_ADMIN_EMAILS: "lastnik@example.com", NODE_ENV: "test" };
const tiho = { error() {}, warn() {}, info() {} };
const posta = () => {
  const poslano = [];
  return { poslano, mailer: { enabled: true, send: async (m) => poslano.push(m) } };
};
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), "evklid-zdravje-"));

test("zdravje: vrste napak AI iz kod apiErrorCode", () => {
  assert.equal(vrstaNapakeAi(apiErrorCode({ status: 400, message: "Your credit balance is too low" })), "dobroimetje");
  assert.equal(vrstaNapakeAi("401 neveljaven API ključ"), "kljuc");
  assert.equal(vrstaNapakeAi("403 ključ nima dovoljenja"), "dovoljenje");
  assert.equal(vrstaNapakeAi("404 model ne obstaja"), "model");
  assert.equal(vrstaNapakeAi("529 Anthropic je preobremenjen"), "preobremenjen");
  assert.equal(vrstaNapakeAi("brez povezave do Anthropic"), "povezava");
  assert.equal(vrstaNapakeAi("zastoj odgovora"), "zastoj");
  assert.equal(vrstaNapakeAi("413 sporočilo je predolgo"), null, "napaka enega učenca");
  assert.equal(vrstaNapakeAi("400 napačna zahteva"), null, "zavrnjena zahteva enega učenca ni izpad za vse");
  assert.equal(vrstaNapakeAi("529 preveč hkratnih vprašanj"), null, "naša vrsta za AI");
  assert.equal(vrstaNapakeAi(null), null);
});

test("zdravje AI: ena e-pošta na izpad (vse vrste skupaj), opomniki po 1 h, 6 h, 24 h; uspeh izpad konča", async () => {
  const store = openDb(":memory:");
  const { poslano, mailer } = posta();
  let t = new Date("2026-11-21T08:00:00Z");
  const z = createZdravje(store.db, { mailer, env: ENV, log: tiho, now: () => t });
  const ob = (iso) => (t = new Date(iso));
  const kredit = () => z.aiIzid({ ok: false, koda: "400 ni dobroimetja na API računu" });
  assert.equal(z.ai().deluje, true);
  assert.equal(await kredit(), "poslano");
  assert.equal(z.ai().deluje, false);
  assert.equal(z.ai().vrsta, "dobroimetje");
  assert.equal(poslano[0].to, "lastnik@example.com");
  assert.match(poslano[0].subject, /inštruktor AI ne dela/);
  assert.match(poslano[0].text, /dobroimetje/);
  ob("2026-11-21T08:30:00Z");
  assert.equal(await kredit(), "prezgodaj");
  assert.equal(await z.aiIzid({ ok: false, koda: "401 neveljaven API ključ" }), "prezgodaj", "druga vrsta v istem izpadu");
  ob("2026-11-21T09:01:00Z");
  assert.equal(await kredit(), "poslano", "1. opomnik po 1 h");
  ob("2026-11-21T14:00:00Z");
  assert.equal(await kredit(), "prezgodaj");
  ob("2026-11-21T15:02:00Z");
  assert.equal(await kredit(), "poslano", "2. opomnik po 6 h");
  ob("2026-11-22T14:00:00Z");
  assert.equal(await kredit(), "prezgodaj");
  ob("2026-11-22T15:03:00Z");
  assert.equal(await kredit(), "poslano", "nato vsakih 24 h");
  assert.equal(poslano.length, 4);
  // Uspeh konča izpad; nov izpad takoj za tem ne pošilja v zanki (najprej 1 h po zadnji e-pošti).
  z.aiIzid({ ok: true });
  assert.equal(z.ai().deluje, true);
  assert.equal(z.ai().zapored, 0);
  ob("2026-11-22T15:30:00Z");
  assert.equal(await kredit(), "prezgodaj");
  z.aiIzid({ ok: true });
  ob("2026-11-22T16:10:00Z");
  assert.equal(await kredit(), "poslano", "nov izpad po uspehu");
  // Izpad preživi ponovni zagon (kv): nov proces ne pošlje takoj znova.
  const z2 = createZdravje(store.db, { mailer, env: ENV, log: tiho, now: () => t });
  assert.equal(await z2.aiIzid({ ok: false, koda: "404 model ne obstaja" }), "prezgodaj");
  // Javno stanje: samo časi, vrsta in število.
  assert.deepEqual(Object.keys(z.ai()).sort(), ["deluje", "vrsta", "zadnjaNapaka", "zadnjiUspeh", "zapored"]);
});

test("zdravje AI: alarm (deluje: false) poteče brez novih napak: kritična po 6 h, prehodna po 1 h", async () => {
  let t = new Date("2026-11-21T23:00:00Z");
  const z = createZdravje(openDb(":memory:").db, { env: { NODE_ENV: "test" }, log: tiho, now: () => t });
  z.aiIzid({ ok: false, koda: "401 neveljaven API ključ" });
  assert.equal(z.ai().deluje, false);
  t = new Date("2026-11-22T04:59:00Z");
  assert.equal(z.ai().deluje, false);
  t = new Date("2026-11-22T05:01:00Z");
  assert.equal(z.ai().deluje, true, "ponoči brez učencev alarm ne ostane do jutra");
  for (let i = 0; i < ZAPORED; i++) z.aiIzid({ ok: false, koda: "529 Anthropic je preobremenjen" });
  assert.equal(z.ai().deluje, false);
  t = new Date("2026-11-22T06:02:00Z");
  assert.equal(z.ai().deluje, true);
});

test("zdravje: vse e-pošte skrbniku skupaj največ NAJVEC_NA_DAN pošiljk na dan (kvota Resend)", async () => {
  const dir = tmp();
  const dbFile = path.join(dir, "evklid.db");
  const store = openDb(":memory:");
  const { poslano, mailer } = posta();
  let t = new Date("2026-11-21T00:10:00Z");
  const env = { ...ENV, EVKLID_ADMIN_EMAILS: "a@example.com,b@example.com,c@example.com,d@example.com,e@example.com" };
  const z = createZdravje(store.db, { dbFile, mailer, env, log: tiho, now: () => t, statfs: () => ({ bsize: 1024 * 1024, blocks: 1000, bfree: 10, bavail: 10 }) });
  assert.equal(NAJVEC_NA_DAN, 12);
  assert.equal(await z.preveriDisk(), "poslano"); // 5
  assert.equal(await z.aiIzid({ ok: false, koda: "404 model ne obstaja" }), "poslano"); // 10
  t = new Date("2026-11-21T07:00:00Z");
  assert.equal(await z.preveriDisk(), "omejeno", "15 > 12");
  assert.equal(poslano.length, 10);
  t = new Date("2026-11-22T07:00:00Z");
  assert.equal(await z.preveriDisk(), "poslano", "nov dan");
});

test("zdravje AI: prehodne napake šele po ZAPORED zaporednih, ena e-pošta; brez naslovov skrbnika nič ne pade", async () => {
  const store = openDb(":memory:");
  const { poslano, mailer } = posta();
  const z = createZdravje(store.db, { mailer, env: ENV, log: tiho });
  for (let i = 1; i < ZAPORED; i++) assert.equal(z.aiIzid({ ok: false, koda: "529 Anthropic je preobremenjen" }), null);
  assert.equal(z.ai().deluje, true);
  assert.equal(await z.aiIzid({ ok: false, koda: "brez povezave do Anthropic" }), "poslano");
  assert.equal(z.ai().deluje, false);
  assert.match(poslano[0].subject, new RegExp(`${ZAPORED} zaporednih`));
  assert.equal(await z.aiIzid({ ok: false, koda: "zastoj odgovora" }), "prezgodaj");
  const brez = createZdravje(openDb(":memory:").db, { mailer, env: { NODE_ENV: "test" }, log: tiho });
  assert.equal(await brez.aiIzid({ ok: false, koda: "404 model ne obstaja" }), "ni nastavljeno");
});

test("zdravje: nepričakovan ponovni zagon se šteje, čista zaustavitev ne; vzrok sesutja brez sporočila", async () => {
  const dir = tmp();
  const dbFile = path.join(dir, "evklid.db");
  const store = openDb(dbFile);
  const { poslano, mailer } = posta();
  const nov = () => createZdravje(store.db, { dbFile, mailer, env: ENV, log: tiho });
  // Prvi zagon (ali prvi z novo kodo): oznake še ni, nič se ne šteje.
  let r = nov().zagon();
  assert.equal(r.nepricakovani, 0);
  assert.ok(fs.existsSync(path.join(dir, "zagon.json")));
  // Proces ubit brez zaustavitve (npr. premalo pomnilnika): oznaka ostane.
  r = nov().zagon();
  assert.equal(r.nepricakovani, 1);
  assert.equal(r.razlog, "neznan");
  assert.equal(await r.posta, "poslano");
  assert.match(poslano[0].subject, /nepričakovano znova zagnal/);
  // Čista zaustavitev (SIGTERM, server/index.js): naslednji zagon ni štet.
  const z = nov();
  z.cistaZaustavitev();
  assert.equal(z.zagon().nepricakovani, 1);
  // Sesutje: zapiše samo vrsto napake (sporočilo lahko vsebuje podatke).
  const e = new TypeError("Ana Novak, ana@example.com");
  z.sesutje(e, "uncaughtException");
  assert.doesNotMatch(fs.readFileSync(path.join(dir, "zagon.json"), "utf8"), /Ana|example/);
  r = nov().zagon();
  assert.equal(r.nepricakovani, 2);
  assert.equal(r.razlog, "uncaughtException TypeError");
  assert.equal(await r.posta, "prezgodaj", "največ ena e-pošta v 6 urah");
  store.db.close();
});

test("zdravje: disk z bazo kot df (rezerva ext4 ne šteje), javno brez velikosti baze, opozorilo nad 90 %", async () => {
  const dir = tmp();
  const dbFile = path.join(dir, "evklid.db");
  fs.writeFileSync(dbFile, Buffer.alloc(3 * 1024 * 1024));
  const store = openDb(":memory:");
  const { poslano, mailer } = posta();
  // 1000 MB, 50 MB rezerve za root: prosto za uporabnika = bfree - 50.
  let bfree = 550;
  const statfs = () => ({ bsize: 1024 * 1024, blocks: 1000, bfree, bavail: bfree - 50 });
  const z = createZdravje(store.db, { dbFile, mailer, env: ENV, log: tiho, statfs });
  assert.deepEqual(z.disk(), { prostoMb: 500, delez: 47, opozorilo: 90 }, "450 / (450 + 500)");
  assert.equal(z.preveriDisk(), null);
  bfree = 150; // zasedeno 850, prosto 100 → 89 % (brez popravka za rezervo bi bilo 90 %)
  assert.equal(z.disk().delez, 89);
  assert.equal(z.preveriDisk(), null);
  bfree = 140;
  assert.equal(z.disk().delez, 91);
  assert.equal(await z.preveriDisk(), "poslano");
  assert.match(poslano[0].subject, /disk z bazo je zaseden 91 %/);
  assert.match(poslano[0].text, /baza 3 MB/, "velikost baze samo v e-pošti skrbniku");
  assert.equal(await z.preveriDisk(), "prezgodaj");
  const z2 = createZdravje(store.db, { dbFile, mailer, env: { ...ENV, EVKLID_DISK_OPOZORILO: "95" }, log: tiho, statfs });
  assert.equal(z2.disk().opozorilo, 95);
  assert.equal(createZdravje(store.db, { dbFile: ":memory:", log: tiho }).disk(), null);
});

test("alarm: kratke kode za vsako okvaro, prazno ko je vse v redu", () => {
  const now = Date.parse("2026-11-21T10:00:00Z");
  const ok = { ai: { deluje: true }, posta: { nastavljena: true, zadnjiUspeh: "2026-11-21T09:00:00Z" }, kopije: { napaka: false }, disk: { delez: 40, opozorilo: 85 }, pomnilnik: { najvecDelez: 50, opozorilo: 85 }, zagoni: { zadnji: null } };
  assert.deepEqual(razlogiAlarma(ok, { now }), []);
  assert.deepEqual(razlogiAlarma(ok, { now, bazaOk: false }), ["baza"]);
  assert.deepEqual(razlogiAlarma({ ...ok, ai: { deluje: false } }, { now }), ["ai"]);
  assert.deepEqual(razlogiAlarma({ ...ok, posta: { nastavljena: true, zadnjaNapaka: "2026-11-21T09:30:00Z", razlog: "omrežje" } }, { now }), ["posta"]);
  assert.deepEqual(razlogiAlarma({ ...ok, posta: { nastavljena: true, zadnjaNapaka: "2026-11-21T09:30:00Z", razlog: "422 napačen naslov" } }, { now }), [], "en napačen naslov ni okvara pošte");
  assert.deepEqual(razlogiAlarma({ ...ok, posta: { nastavljena: true, zadnjaNapaka: "2026-11-21T08:30:00Z", razlog: "429 omejitev" } }, { now }), [], "prehodna napaka pošte po 1 h ne drži alarma");
  assert.deepEqual(razlogiAlarma({ ...ok, posta: { nastavljena: true, zadnjaNapaka: "2026-11-21T01:00:00Z", razlog: "401 ključ" } }, { now }), ["posta"], "napačen ključ Resend do prvega uspeha");
  assert.deepEqual(razlogiAlarma({ ...ok, kopijeZunaj: { napaka: true } }, { now }), ["kopije"]);
  assert.deepEqual(razlogiAlarma({ ...ok, preverjanjeKopij: { ok: false } }, { now }), ["kopije"]);
  assert.deepEqual(razlogiAlarma({ ...ok, preverjanjeKopij: { ok: false, prehodna: true } }, { now }), []);
  assert.deepEqual(razlogiAlarma({ ...ok, disk: { delez: 85, opozorilo: 85 } }, { now }), ["disk"]);
  assert.deepEqual(razlogiAlarma({ ...ok, pomnilnik: { najvecDelez: 90, opozorilo: 85 } }, { now }), ["pomnilnik"]);
  assert.deepEqual(razlogiAlarma({ ...ok, zagoni: { zadnji: "2026-11-21T09:30:00Z" } }, { now }), ["zagon"]);
  assert.deepEqual(razlogiAlarma({ ...ok, zagoni: { zadnji: "2026-11-21T08:30:00Z" } }, { now }), [], "po eni uri samo še števec");
});

test("straža: AI ne dela, poln disk in svež nepričakovan zagon jo podrejo", () => {
  const now = Date.parse("2026-11-21T10:00:00Z");
  const osnova = { id: "x", razlicica: "1" };
  assert.deepEqual(presojaStanja({ ...osnova, ai: { deluje: true }, disk: { delez: 10, opozorilo: 85 }, zagoni: { zadnji: "2026-11-20T10:00:00Z" } }, now).napake, []);
  assert.match(presojaStanja({ ...osnova, ai: { deluje: false, vrsta: "kljuc", zapored: 1 } }, now).napake.join(), /inštruktor AI ne dela/);
  assert.match(presojaStanja({ ...osnova, disk: { delez: 90, opozorilo: 85, prostoMb: 100 } }, now).napake.join(), /disk/);
  assert.match(presojaStanja({ ...osnova, zagoni: { zadnji: "2026-11-21T09:45:00Z", razlog: "neznan" } }, now).napake.join(), /nepričakovano/);
});

test("/healthz/stanje ima mock, ai, zagoni in disk; /healthz/alarm 200 ali 503 s kodo brez podrobnosti", async () => {
  const store = openDb(":memory:");
  const app = createApp(store, { scheduler: false });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const st = await (await fetch(base + "/healthz/stanje")).json();
    assert.equal(st.mock, true); // testi tečejo brez ključa API
    assert.equal(st.ai.deluje, true);
    assert.deepEqual(st.zagoni, { nepricakovani: 0, zadnji: null, razlog: null });
    assert.equal(st.disk, null); // baza v pomnilniku
    let r = await fetch(base + "/healthz/alarm");
    assert.equal(r.status, 200);
    assert.equal(r.headers.get("cache-control"), "no-store");
    assert.equal(await r.text(), "ok");
    app.locals.zdravje.aiIzid({ ok: false, koda: "401 neveljaven API ključ" });
    r = await fetch(base + "/healthz/alarm");
    assert.equal(r.status, 503);
    assert.equal(await r.text(), "alarm: ai");
    const st2 = await (await fetch(base + "/healthz/stanje")).json();
    assert.equal(st2.ai.vrsta, "kljuc");
    assert.doesNotMatch(JSON.stringify(st2.ai), /ključ|sk-/);
  } finally {
    server.close();
  }
});

test("zaustavitev: rok EVKLID_ZAUSTAVITEV_MS privzeto 20 s, največ 25 s (Render SIGKILL po 30 s)", async () => {
  const { rokZaustavitveMs } = await import("../server/zdravje.js");
  assert.equal(rokZaustavitveMs({}), 20_000);
  assert.equal(rokZaustavitveMs({ EVKLID_ZAUSTAVITEV_MS: "600" }), 600);
  assert.equal(rokZaustavitveMs({ EVKLID_ZAUSTAVITEV_MS: "60000" }), 25_000);
  assert.equal(rokZaustavitveMs({ EVKLID_ZAUSTAVITEV_MS: "x" }), 20_000);
});

// Imena skupin prijateljev in razredov vidijo drugi otroci: brez kontaktov (e-naslov, telefon, povezava, omrežja).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { nameHasContact, stripInvisible } from "../public/ime-skupine.js";
import { contactNames } from "../scripts/imena-skupin.js";
import SL from "../public/i18n/sl.js";

const BAD = ["snap: ana123", "Dodaj me na Insta", "piši 041 123 456", "+386 41 123456", "0038641123456", "ana@gmail.com", "ana＠gmail", "ana (at) gmail", "www.x.si", "discord.gg/abc", "https://x.co", "t.me/ana", "ig: ana_12", "TikTok ana", "WhatsApp skupina", "viber 041123456", "мой инстаграм",
  // Obidi iz pregleda #491: nevidni znaki, ločila, števke drugih pisav in emoji, ponudniki e-pošte, manjkajoča omrežja.
  "041\u200b123\u200b456", "0\u2063 41 123 456", "sn\u00adap ana", "in\u200dsta ana", "041_123_456", "041,123,456", "041\u2013123\u2013456",
  "\u0660\u0664\u0661\u0661\u0662\u0663\u0664\u0665\u0666", "\u0966\u096a\u0967\u0967\u0968\u0969\u096a\u096b\u096c",
  "0\ufe0f\u20e34\ufe0f\u20e31\ufe0f\u20e31\ufe0f\u20e32\ufe0f\u20e33\ufe0f\u20e34\ufe0f\u20e35\ufe0f\u20e36\ufe0f\u20e3",
  "ana at gmail dot com", "ana(a)gmail", "Siol ana", "hotmail ana", "outlook ana", "yahoo ana",
  "youtube ana", "yt: ana", "x.com/ana", "twitter ana", "skype ana", "line ana", "ig ana", "discord ana#1234",
  // Pregled 3: cirilske/grške črke v latinski besedi, manjkajoče končnice.
  "inst\u0430 ana", "sn\u0430p ana", "y\u043eutube ana", "youtu.be/x", "ana.ai"];
const OK = ["8.b", "Matematiki 2025/26", "Razred 2025 2026", "Prijatelji", "Ekipa 7.a", "Fizika 9", "Instrumenti", "Snaga", "Diskretna matematika", "Igralci", "Tigri", "Šah 1 2 3", "Messi fans",
  "STEAM 8.a", "Steam ekipa", "2025/2026 7.a", "Razred 2025/2026", "OŠ Ig 7.a", "Matematični krožek", "Atom", "Pika in Nik", "Ekipa 7.a, 7.b in 7.c",
  // Pregled 3: šolsko leto z vezajem/pomišljajem/presledkom, ŠC brez strešice, kraj Ig, šumniki za piko, cirilica in grščina.
  "2025-2026 7.a", "2025.-2026. 3.b", "Šk. l. 2025–2026 9.b", "Odeljenje 7-3 2025-2026", "2025 2026 8.b", "SC Velenje", "Ig 7.b", "Gimn. Ruše", "8. Mešana skupina", "2. Sičevo",
  "\u041f\u0443\u0442\u043d\u0438\u0446\u0438 7", "\u041e\u0434\u0435\u0459\u0435\u045a\u0435 8-2", "\u03a4\u03ac\u03be\u03b7 7\u03b1",
  "\u0915\u0915\u094d\u0937\u093e \u096d", "\u0627\u0644\u0635\u0641 \u0667\u0628", "\u06a9\u0644\u0627\u0633\u200c\u0647\u0641\u062a\u0645"];

test("ime skupine: kontakti zavrnjeni, navadna imena razredov in skupin ne", () => {
  assert.deepEqual(BAD.filter((n) => !nameHasContact(n)), []);
  assert.deepEqual(OK.filter(nameHasContact), []);
});

test("ime skupine: strežnik zavrne kontakte pri skupini prijateljev, razredu in učiteljevem razredu", async () => {
  const store = openDb(":memory:");
  const server = createApp(store).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (path, body) => {
    const r = await fetch(base + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    return { status: r.status, body: await r.json() };
  };
  try {
    const s = (await call("/api/students", { name: "Ana" })).body;
    const fg = await call(`/api/students/${s.id}/friend-groups`, { name: "snap: ana_2012" });
    assert.equal(fg.status, 400);
    assert.equal(fg.body.code, "lg.nameContact");
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM classes").get().n, 0);
    assert.equal((await call(`/api/students/${s.id}/friend-groups`, { name: "Matematiki" })).status, 201);
    const cl = await call("/api/classes", { name: "8.b piši 041 123 456" });
    assert.equal(cl.status, 400);
    assert.equal(cl.body.code, "lg.nameContact");
    assert.equal((await call("/api/classes", { name: "8.b" })).status, 201);
  } finally {
    server.close();
  }
  // Učiteljev razred z računom: isto preverjanje (server/schools.js).
  assert.match(fs.readFileSync(new URL("../server/schools.js", import.meta.url), "utf8"), /nameHasContact\(name\)/);
});

test("ime skupine: opozorilo v vseh 33 jezikih", () => {
  assert.ok(SL["lg.nameContact"]);
  const dir = new URL("../public/i18n/ui/", import.meta.url);
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  assert.equal(files.length, 32);
  for (const f of files) {
    const v = JSON.parse(fs.readFileSync(new URL(f, dir), "utf8"))["lg.nameContact"];
    assert.ok(v && v !== SL["lg.nameContact"], f);
  }
});

test("ime skupine: nevidni znaki se ne shranijo (ZWNJ za perzijščino ostane); pregled imen v bazi", async () => {
  assert.equal(stripInvisible("8\u200b.\u00adb\u2063"), "8.b");
  assert.equal(stripInvisible("\u06a9\u0644\u0627\u0633\u200c\u0647\u0641\u062a\u0645"), "\u06a9\u0644\u0627\u0633\u200c\u0647\u0641\u062a\u0645");
  const store = openDb(":memory:");
  const server = createApp(store).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (path, body) => {
    const r = await fetch(base + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    return { status: r.status, body: await r.json() };
  };
  try {
    const s = (await call("/api/students", { name: "Ana" })).body;
    assert.equal((await call(`/api/students/${s.id}/friend-groups`, { name: "Mate\u200bmatiki" })).status, 201);
    assert.equal(store.db.prepare("SELECT name FROM classes WHERE kind = 'friends'").get().name, "Matematiki");
    assert.equal((await call("/api/classes", { name: "7.\u200ba" })).status, 201);
    assert.equal(store.db.prepare("SELECT name FROM classes WHERE kind = 'class'").get().name, "7.a");
    // Ime iz časa pred filtrom: skripta ga najde.
    store.db.prepare("INSERT INTO classes (code, name, kind) VALUES ('ZZZZZZ', 'snap: ana_2012', 'friends')").run();
    assert.deepEqual(contactNames(store.db).map((r) => r.name), ["snap: ana_2012"]);
  } finally {
    server.close();
  }
});

test("ime skupine: odjemalec pokaže prevod lg.nameContact tudi ob zavrnitvi strežnika", () => {
  for (const f of ["../public/leagues.js", "../public/ucitelj.js"]) assert.match(fs.readFileSync(new URL(f, import.meta.url), "utf8"), /code === "lg\.nameContact" && t\(\w+\.code\)/, f);
});

test("scripts/imena-skupin.js: baza brez tabele razredov → ni imen (ne napaka)", async () => {
  const { DatabaseSync } = await import("node:sqlite");
  const db = new DatabaseSync(":memory:");
  db.exec("CREATE TABLE x (a)");
  assert.deepEqual(contactNames(db), []);
  db.close();
});

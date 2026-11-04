import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { openDb } from "../server/db.js";
import { makeBackup, listBackups } from "../server/kopije.js";
import { cloudConfig, signRequest, encryptBackup, decryptBackup, uploadBackup, downloadBackup, listCloud, startCloudBackups } from "../server/kopije-oblak.js";

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), "evklid-oblak-"));
const quiet = { info() {}, error() {}, warn() {} };
const ENV = { EVKLID_KOPIJE_S3_URL: "https://racun.r2.example", EVKLID_KOPIJE_S3_BUCKET: "evklid-kopije", EVKLID_KOPIJE_S3_KEY_ID: "id", EVKLID_KOPIJE_S3_SECRET: "skrivnost" };

// Shramba v pomnilniku, ki se obnaša kot S3 (PUT, GET, DELETE, ListObjectsV2) in zahteva podpis.
function fakeS3() {
  const objects = new Map();
  const calls = [];
  const fetchFn = async (url, { method, headers, body }) => {
    const u = new URL(url);
    calls.push(`${method} ${u.pathname}${u.search}`);
    if (!/^AWS4-HMAC-SHA256 Credential=id\//.test(headers.authorization)) return new Response("<Code>AccessDenied</Code>", { status: 403 });
    const key = decodeURIComponent(u.pathname.replace(/^\/evklid-kopije\/?/, ""));
    if (method === "PUT") objects.set(key, Buffer.from(body));
    else if (method === "DELETE") objects.delete(key);
    else if (method === "GET" && u.searchParams.get("list-type") === "2") {
      const p = u.searchParams.get("prefix") || "";
      return new Response(`<ListBucketResult>${[...objects.keys()].filter((k) => k.startsWith(p)).map((k) => `<Contents><Key>${k}</Key></Contents>`).join("")}</ListBucketResult>`);
    } else if (method === "GET") return objects.has(key) ? new Response(objects.get(key)) : new Response("<Code>NoSuchKey</Code>", { status: 404 });
    return new Response("");
  };
  return { objects, calls, fetchFn };
}

function withKey(fn) {
  const before = { k: process.env.EVKLID_DATA_KEY, o: process.env.EVKLID_DATA_KEYS_OLD };
  process.env.EVKLID_DATA_KEY = crypto.randomBytes(32).toString("base64");
  delete process.env.EVKLID_DATA_KEYS_OLD;
  return Promise.resolve(fn()).finally(() => {
    if (before.k === undefined) delete process.env.EVKLID_DATA_KEY;
    else process.env.EVKLID_DATA_KEY = before.k;
    if (before.o === undefined) delete process.env.EVKLID_DATA_KEYS_OLD;
    else process.env.EVKLID_DATA_KEYS_OLD = before.o;
  });
}

test("kopija zunaj strežnika: podpis AWS SigV4 se ujema z AWS-ovima primeroma", () => {
  const base = { keyId: "AKIAIOSFODNN7EXAMPLE", secret: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY", region: "us-east-1", now: new Date("2013-05-24T00:00:00Z") };
  const sig = (url) => signRequest({ ...base, method: "GET", url }).authorization.split("Signature=")[1];
  assert.equal(sig("https://examplebucket.s3.amazonaws.com/?lifecycle"), "fea454ca298b7da1c68078a5d1bdbfbbe0d65c699e0f91ac7a200a0136783543");
  assert.equal(sig("https://examplebucket.s3.amazonaws.com/?max-keys=2&prefix=J"), "34b48302e7b5fa45bde8084f4b7868a86f0a534bc59db6670ed5711ef69dc6f7");
});

test("kopija zunaj strežnika: nastavitve, brez ključa nič ne zapusti strežnika, šifriranje in stari ključ", async () => {
  assert.equal(cloudConfig({}), null);
  assert.equal(cloudConfig({ ...ENV, EVKLID_KOPIJE_S3_SECRET: "" }), null);
  assert.equal(cloudConfig(ENV).keepDays, 30);
  assert.equal(cloudConfig({ ...ENV, EVKLID_KOPIJE_OBLAK_DNI: "90" }).keepDays, 30); // obvestilo o zasebnosti: največ 30 dni
  assert.equal(cloudConfig({ ...ENV, EVKLID_KOPIJE_OBLAK_DNI: "14" }).keepDays, 14);

  const saved = process.env.EVKLID_DATA_KEY;
  delete process.env.EVKLID_DATA_KEY;
  try {
    assert.throws(() => encryptBackup(Buffer.from("x")), /EVKLID_DATA_KEY/);
  } finally {
    if (saved !== undefined) process.env.EVKLID_DATA_KEY = saved;
  }

  await withKey(() => {
    const plain = Buffer.from("SQLite format 3\0 učenci in pogovori");
    const box = encryptBackup(plain);
    assert.ok(!box.includes(Buffer.from("učenci")));
    assert.deepEqual(decryptBackup(box), plain);
    const bad = Buffer.from(box);
    bad[bad.length - 1] ^= 1;
    assert.throws(() => decryptBackup(bad), /odšifrirati/);
    // Menjava ključa: stari ključ v EVKLID_DATA_KEYS_OLD še odpre stare kopije.
    const oldKey = process.env.EVKLID_DATA_KEY;
    process.env.EVKLID_DATA_KEY = crypto.randomBytes(32).toString("base64");
    assert.throws(() => decryptBackup(box), /EVKLID_DATA_KEYS_OLD/);
    process.env.EVKLID_DATA_KEYS_OLD = `star:${oldKey}`;
    assert.deepEqual(decryptBackup(box), plain);
  });
});

test("kopija zunaj strežnika: nalaganje, 30 dni, prenos nazaj in obnova po običajni poti", async () => {
  await withKey(async () => {
    const dir = tmp();
    const file = path.join(dir, "evklid.db");
    const store = openDb(file);
    store.db.prepare("INSERT INTO students (name, settings) VALUES (?, '{}')").run("Ana");
    makeBackup(store.db, file, { now: new Date("2026-11-04T03:00:00Z") });
    const s3 = fakeS3();
    const cfg = cloudConfig(ENV);
    // Stara kopija v shrambi (starejša od 30 dni) in tuja datoteka, ki ostane.
    s3.objects.set("kopije/evklid-2026-10-01.db.enc", Buffer.from("star"));
    s3.objects.set("kopije/drugo.txt", Buffer.from("x"));

    const local = listBackups(file)[0];
    const r = await uploadBackup(cfg, file, local.file, local.date, { fetchFn: s3.fetchFn, now: () => new Date("2026-11-04T04:00:00Z") });
    assert.equal(r.key, "kopije/evklid-2026-11-04.db.enc");
    assert.deepEqual(r.deleted, ["2026-10-01"]);
    assert.ok(!s3.objects.has("kopije/evklid-2026-10-01.db.enc"));
    assert.ok(s3.objects.has("kopije/drugo.txt"));
    assert.ok(!s3.objects.get(r.key).includes(Buffer.from("SQLite format")), "naložena kopija je šifrirana");
    assert.deepEqual((await listCloud(cfg, file, { fetchFn: s3.fetchFn })).map((b) => b.date), ["2026-11-04"]);

    // Disk odpove: lokalnih kopij ni več, kopijo prenesemo od zunaj.
    fs.rmSync(path.join(dir, "kopije"), { recursive: true });
    const d = await downloadBackup(cfg, file, "2026-11-04", { fetchFn: s3.fetchFn });
    assert.equal(d.name, "2026-11-04-0000");
    const back = listBackups(file).find((b) => b.date === "2026-11-04-0000");
    assert.ok(back, "obnovi-kopijo.js jo najde kot ročno kopijo");
    const { DatabaseSync } = await import("node:sqlite");
    const copy = new DatabaseSync(back.file, { readOnly: true });
    assert.deepEqual(copy.prepare("SELECT name FROM students").all().map((x) => x.name), ["Ana"]);
    copy.close();
    await assert.rejects(downloadBackup(cfg, file, "2026-11-04", { fetchFn: s3.fetchFn }), /že obstaja/);
    await assert.rejects(downloadBackup(cfg, file, "2026-11-01", { fetchFn: s3.fetchFn }), /404/);
    store.db.close();
  });
});

test("kopija zunaj strežnika: urnik naloži vsako dnevno kopijo enkrat, napako ponovi, stanje brez podrobnosti", async () => {
  await withKey(async () => {
    const dir = tmp();
    const file = path.join(dir, "evklid.db");
    const store = openDb(file);
    makeBackup(store.db, file, { now: new Date("2026-11-04T03:00:00Z") });
    const s3 = fakeS3();
    let down = true;
    const fetchFn = (url, o) => (down ? Promise.resolve(new Response("<Code>InternalError</Code>", { status: 500 })) : s3.fetchFn(url, o));
    const c = startCloudBackups(file, { scheduler: false, log: quiet, fetchFn, env: ENV, now: () => new Date("2026-11-04T04:00:00Z") });
    assert.deepEqual(c.status(), { zadnja: null, napaka: false });
    await c.run();
    assert.deepEqual(c.status(), { zadnja: null, napaka: true });
    down = false;
    await c.run();
    assert.deepEqual(c.status(), { zadnja: "2026-11-04", napaka: false });
    const puts = () => s3.calls.filter((x) => x.startsWith("PUT")).length;
    assert.equal(puts(), 1);
    await c.run(); // ista kopija se ne naloži znova
    assert.equal(puts(), 1);
    makeBackup(store.db, file, { now: new Date("2026-11-05T03:00:00Z") });
    await c.run();
    assert.equal(puts(), 2);
    // Brez nastavitev ali z izklopljenimi kopijami ni stanja in ni klicev.
    assert.equal(startCloudBackups(file, { scheduler: false, log: quiet, env: {} }).status(), null);
    assert.equal(startCloudBackups(file, { scheduler: false, log: quiet, env: { ...ENV, EVKLID_BACKUPS: "0" } }).status(), null);
    store.db.close();
  });
});

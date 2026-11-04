// Dnevna kopija baze tudi zunaj Renderja (docs/objava.md → »Kopija zunaj Renderja«).
// Najnovejšo dnevno kopijo iz server/kopije.js zašifrira (AES-256-GCM, ključ izpeljan iz EVKLID_DATA_KEY) in jo
// naloži v shrambo, združljivo s S3 (Cloudflare R2). Kopije, starejše od EVKLID_KOPIJE_OBLAK_DNI (privzeto 30),
// pobriše (obvestilo o zasebnosti: iz varnostnih kopij najkasneje v 30 dneh). Brez ključa podatkov ne naloži nič,
// ker nešifrirani podatki ne smejo zapustiti strežnika.
// Nastavitve (Render → Environment): EVKLID_KOPIJE_S3_URL (npr. https://<račun>.r2.cloudflarestorage.com),
// EVKLID_KOPIJE_S3_BUCKET, EVKLID_KOPIJE_S3_KEY_ID, EVKLID_KOPIJE_S3_SECRET, neobvezno EVKLID_KOPIJE_S3_REGION (auto).
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { listBackups, backupDir, checkFile } from "./kopije.js";
import { backupKey } from "./crypto-polje.js";

const MAGIC = Buffer.from("BKP1");
const PREFIX = "kopije/";
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

/** Nastavitve iz okolja ali null, če kopija zunaj strežnika ni nastavljena. */
export function cloudConfig(env = process.env) {
  const url = (env.EVKLID_KOPIJE_S3_URL || "").trim().replace(/\/+$/, "");
  const bucket = (env.EVKLID_KOPIJE_S3_BUCKET || "").trim();
  const keyId = (env.EVKLID_KOPIJE_S3_KEY_ID || "").trim();
  const secret = (env.EVKLID_KOPIJE_S3_SECRET || "").trim();
  if (!url || !bucket || !keyId || !secret) return null;
  const days = Number(env.EVKLID_KOPIJE_OBLAK_DNI);
  return { url, bucket, keyId, secret, region: (env.EVKLID_KOPIJE_S3_REGION || "auto").trim(), keepDays: days > 0 && days <= 30 ? Math.floor(days) : 30 };
}

// --- šifriranje: BKP1 | keyId (8 znakov) | iv 12 B | tag 16 B | šifrirano ---

export function encryptBackup(buf) {
  const k = backupKey();
  if (!k) throw new Error("EVKLID_DATA_KEY ni nastavljen; nešifrirane kopije ne nalagam (docs/varnost-podatkov.md).");
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv("aes-256-gcm", k.key, iv);
  c.setAAD(MAGIC);
  const body = Buffer.concat([c.update(buf), c.final()]);
  return Buffer.concat([MAGIC, Buffer.from(k.id, "ascii"), iv, c.getAuthTag(), body]);
}

export function decryptBackup(buf) {
  if (buf.length < 40 || !buf.subarray(0, 4).equals(MAGIC)) throw new Error("datoteka ni šifrirana kopija Evklida");
  const id = buf.subarray(4, 12).toString("ascii");
  const k = backupKey(id);
  if (!k) throw new Error(`kopija je šifrirana s ključem ${id}, ki ga ni v EVKLID_DATA_KEY ali EVKLID_DATA_KEYS_OLD`);
  const d = crypto.createDecipheriv("aes-256-gcm", k.key, buf.subarray(12, 24));
  d.setAAD(MAGIC);
  d.setAuthTag(buf.subarray(24, 40));
  try {
    return Buffer.concat([d.update(buf.subarray(40)), d.final()]);
  } catch {
    throw new Error("kopije ni mogoče odšifrirati (napačen ključ ali poškodovana datoteka)");
  }
}

// --- S3 (podpis AWS Signature V4; R2 ga podpira) ---

const sha256 = (data) => crypto.createHash("sha256").update(data).digest("hex");
const hmac = (key, data) => crypto.createHmac("sha256", key).update(data).digest();
// RFC 3986: encodeURIComponent pusti !'()* nekodirane, S3 jih zahteva kodirane.
const enc = (s) => encodeURIComponent(s).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);

/** Glave s podpisom za zahtevo (izvoženo za test z AWS-ovim primerom). host je v podpisu, fetch ga pošlje sam. */
export function signRequest({ method, url, body = "", keyId, secret, region, now = new Date() }) {
  const u = new URL(url);
  const amzDate = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const date = amzDate.slice(0, 8);
  const payloadHash = sha256(body);
  const headers = { host: u.host, "x-amz-content-sha256": payloadHash, "x-amz-date": amzDate };
  const names = Object.keys(headers).sort();
  const query = [...u.searchParams]
    .map(([k, v]) => [enc(k), enc(v)])
    .sort(([a, av], [b, bv]) => (a < b ? -1 : a > b ? 1 : av < bv ? -1 : av > bv ? 1 : 0))
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
  const canonical = [method, u.pathname, query, names.map((n) => `${n}:${headers[n]}\n`).join(""), names.join(";"), payloadHash].join("\n");
  const scope = `${date}/${region}/s3/aws4_request`;
  const toSign = ["AWS4-HMAC-SHA256", amzDate, scope, sha256(canonical)].join("\n");
  const kSign = hmac(hmac(hmac(hmac(`AWS4${secret}`, date), region), "s3"), "aws4_request");
  const signature = crypto.createHmac("sha256", kSign).update(toSign).digest("hex");
  const { host, ...rest } = headers;
  return { ...rest, authorization: `AWS4-HMAC-SHA256 Credential=${keyId}/${scope}, SignedHeaders=${names.join(";")}, Signature=${signature}` };
}

export function makeClient(cfg, { fetchFn = globalThis.fetch, now = () => new Date() } = {}) {
  const objUrl = (key) => `${cfg.url}/${enc(cfg.bucket)}/${key.split("/").map(enc).join("/")}`;
  const call = async (method, url, body) => {
    const headers = signRequest({ method, url, body: body ?? "", keyId: cfg.keyId, secret: cfg.secret, region: cfg.region, now: now() });
    const res = await fetchFn(url, { method, headers, body: body ?? undefined, signal: AbortSignal.timeout(120_000) });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      const code = text.match(/<Code>([^<]+)<\/Code>/)?.[1];
      throw new Error(`shramba je vrnila ${res.status}${code ? ` ${code}` : ""}`);
    }
    return res;
  };
  return {
    put: (key, body) => call("PUT", objUrl(key), body),
    get: async (key) => Buffer.from(await (await call("GET", objUrl(key))).arrayBuffer()),
    del: (key) => call("DELETE", objUrl(key)),
    // Do 1000 ključev (hranimo največ ~30 dnevnih kopij).
    list: async (prefix) => {
      const xml = await (await call("GET", `${cfg.url}/${enc(cfg.bucket)}?list-type=2&prefix=${enc(prefix)}`)).text();
      return [...xml.matchAll(/<Key>([^<]+)<\/Key>/g)].map((m) => m[1].replace(/&amp;/g, "&"));
    },
  };
}

const stemOf = (dbFile) => path.basename(dbFile, ".db");
const objectKey = (dbFile, date) => `${PREFIX}${stemOf(dbFile)}-${date}.db.enc`;

/** Seznam kopij v shrambi od najnovejše: [{ key, date }]. */
export async function listCloud(cfg, dbFile, opts) {
  const re = new RegExp(`^${PREFIX}${stemOf(dbFile).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}-(\\d{4}-\\d{2}-\\d{2})\\.db\\.enc$`);
  const keys = await makeClient(cfg, opts).list(PREFIX);
  return keys.map((key) => ({ key, date: key.match(re)?.[1] })).filter((x) => x.date).sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Naloži lokalno kopijo (server/kopije.js) z datumom `date` in pobriše kopije v shrambi, starejše od keepDays.
 * Vrne { key, bytes, deleted }.
 */
export async function uploadBackup(cfg, dbFile, backupFile, date, { fetchFn, now = () => new Date() } = {}) {
  const client = makeClient(cfg, { fetchFn, now });
  const body = encryptBackup(fs.readFileSync(backupFile));
  const key = objectKey(dbFile, date);
  await client.put(key, body);
  const limit = new Date(now().getTime() - cfg.keepDays * DAY).toISOString().slice(0, 10);
  const deleted = [];
  for (const b of await listCloud(cfg, dbFile, { fetchFn, now })) {
    if (b.date < limit && b.key !== key) {
      await client.del(b.key);
      deleted.push(b.date);
    }
  }
  return { key, bytes: body.length, deleted };
}

/**
 * Prenese kopijo `date` iz shrambe, jo odšifrira in preveri ter jo shrani med lokalne kopije kot ročno kopijo
 * <ime>-<datum>-0000.db, da jo scripts/obnovi-kopijo.js obnovi po običajni poti (argument <datum>-0000).
 */
export async function downloadBackup(cfg, dbFile, date, { fetchFn } = {}) {
  const buf = decryptBackup(await makeClient(cfg, { fetchFn }).get(objectKey(dbFile, date)));
  const dir = backupDir(dbFile);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${stemOf(dbFile)}-${date}-0000.db`);
  if (fs.existsSync(file)) throw new Error(`lokalna kopija ${path.basename(file)} že obstaja`);
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, buf);
  const ok = checkFile(tmp);
  if (ok !== "ok") {
    fs.rmSync(tmp, { force: true });
    throw new Error(`prenesena kopija ni cela: ${ok}`);
  }
  fs.renameSync(tmp, file);
  return { file, name: `${date}-0000` };
}

/**
 * Vsako uro (prvič 10 min po zagonu, ko je lokalna kopija že narejena) naloži najnovejšo dnevno kopijo, če je še ni.
 * status() je za javni /healthz/stanje: brez poti in podrobnosti napake.
 */
export function startCloudBackups(dbFile, { scheduler = true, log = console, fetchFn, now = () => new Date(), env = process.env } = {}) {
  const cfg = cloudConfig(env);
  const off = !cfg || !dbFile || dbFile === ":memory:" || env.EVKLID_BACKUPS === "0";
  let uploaded = null;
  let failed = false;
  let busy = false;
  const run = async () => {
    if (off || busy) return;
    const latest = listBackups(dbFile).find((b) => !b.manual);
    if (!latest || latest.date === uploaded) return;
    busy = true;
    try {
      const r = await uploadBackup(cfg, dbFile, latest.file, latest.date, { fetchFn, now });
      uploaded = latest.date;
      failed = false;
      log.info?.(`[evklid] kopija zunaj strežnika: ${latest.date} (${Math.round(r.bytes / 1024)} kB)${r.deleted.length ? `, pobrisane: ${r.deleted.join(", ")}` : ""}`);
    } catch (e) {
      failed = true;
      log.error?.(`[evklid] kopija zunaj strežnika ni uspela: ${e.message}`);
    } finally {
      busy = false;
    }
  };
  if (!off && !backupKey()) log.warn?.("[evklid] OPOZORILO: kopija zunaj strežnika je nastavljena, EVKLID_DATA_KEY pa ne, zato se ne nalaga.");
  if (!off && scheduler) {
    setTimeout(run, 10 * 60 * 1000).unref?.();
    setInterval(run, HOUR).unref?.();
  }
  return { status: () => (off ? null : { zadnja: uploaded, napaka: failed }), run, config: cfg };
}

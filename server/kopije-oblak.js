// Dnevna kopija baze tudi zunaj Renderja (docs/objava.md → »Kopija zunaj Renderja«).
// Najnovejšo dnevno kopijo iz server/kopije.js zašifrira (AES-256-GCM, ključ izpeljan iz EVKLID_DATA_KEY) in jo
// naloži v shrambo, združljivo s S3 (Cloudflare R2). Kopije, starejše od EVKLID_KOPIJE_OBLAK_DNI (privzeto 30),
// pobriše (obvestilo o zasebnosti: iz varnostnih kopij najkasneje v 30 dneh). Brez ključa podatkov ne naloži nič,
// ker nešifrirani podatki ne smejo zapustiti strežnika.
// Nastavitve (Render → Environment): EVKLID_KOPIJE_S3_URL (za vedro v EU: https://<račun>.eu.r2.cloudflarestorage.com),
// EVKLID_KOPIJE_S3_BUCKET, EVKLID_KOPIJE_S3_KEY_ID, EVKLID_KOPIJE_S3_SECRET, neobvezno EVKLID_KOPIJE_S3_REGION (auto).
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { listBackups, backupDir, checkFile, dodajIzbrise } from "./kopije.js";
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
  const head = Buffer.concat([MAGIC, Buffer.from(k.id, "ascii")]);
  const c = crypto.createCipheriv("aes-256-gcm", k.key, iv);
  c.setAAD(head); // oznaka in id ključa sta zaščitena pred spremembo
  const body = Buffer.concat([c.update(buf), c.final()]);
  return Buffer.concat([head, iv, c.getAuthTag(), body]);
}

// Ista oblika po kosih (dnevna kopija v R2): prej je šlo vse skozi pomnilnik (branje, šifriranje in dvakrat
// Buffer.concat ≈ 4× velikost baze, pri 60 MB bazi +240 MB ob meji 512 MB na Renderju). Oznaka GCM je v glavi pred
// šifriranim telesom, zato gre datoteka skozi šifrirnik z istim ključem in iv večkrat: prvič za oznako, drugič za
// zgoščeno vrednost za podpis S3, tretjič med pošiljanjem. Isti ključ, iv in vsebina dajo isto šifrirano besedilo, ven
// pa gre samo enkrat. V pomnilniku je naenkrat en kos (1 MB). Če se datoteka vmes spremeni, pošiljanje pade.
const KOS = 1024 * 1024;
async function* sifrirano(file, k, iv, head, izid) {
  const c = crypto.createCipheriv("aes-256-gcm", k.key, iv);
  c.setAAD(head);
  for await (const kos of fs.createReadStream(file, { highWaterMark: KOS })) yield c.update(kos);
  const rep = c.final();
  if (rep.length) yield rep;
  izid.oznaka = c.getAuthTag();
}
export async function encryptBackupFile(file) {
  const k = backupKey();
  if (!k) throw new Error("EVKLID_DATA_KEY ni nastavljen; nešifrirane kopije ne nalagam (docs/varnost-podatkov.md).");
  const iv = crypto.randomBytes(12);
  const head = Buffer.concat([MAGIC, Buffer.from(k.id, "ascii")]);
  const pred = fs.statSync(file);
  // En prehod skozi šifrirnik: daje šifrirane kose, na koncu vrne { oznaka, telo (bajtov) }.
  const prehod = async function* () {
    const izid = {};
    let telo = 0;
    for await (const kos of sifrirano(file, k, iv, head, izid)) {
      telo += kos.length;
      yield kos;
    }
    return { ...izid, telo };
  };
  const izteci = async (naKos) => {
    const it = prehod();
    for (let r = await it.next(); ; r = await it.next()) {
      if (r.done) return r.value;
      naKos(r.value);
    }
  };
  const prvi = await izteci(() => {});
  const glava = Buffer.concat([head, iv, prvi.oznaka]);
  const h = crypto.createHash("sha256").update(glava);
  const preveri = (r) => {
    const zdaj = fs.statSync(file);
    if (!r.oznaka.equals(prvi.oznaka) || r.telo !== prvi.telo || zdaj.size !== pred.size || zdaj.mtimeMs !== pred.mtimeMs) throw new Error("kopija se je med šifriranjem spremenila");
  };
  preveri(await izteci((kos) => h.update(kos)));
  return {
    bytes: glava.length + prvi.telo,
    sha256: h.digest("hex"),
    // Telo za fetch: glava, nato šifrirano po kosih (pritisk nazaj: bere se le, kar fetch pošlje). Če se datoteka
    // vmes spremeni, tok pade in zahteva ne uspe.
    stream: () =>
      ReadableStream.from(
        (async function* () {
          yield glava;
          const it = prehod();
          for (let r = await it.next(); ; r = await it.next()) {
            if (r.done) return preveri(r.value);
            yield r.value;
          }
        })(),
      ),
  };
}

export function decryptBackup(buf) {
  if (buf.length < 40 || !buf.subarray(0, 4).equals(MAGIC)) throw new Error("datoteka ni šifrirana kopija Evklida");
  const id = buf.subarray(4, 12).toString("ascii");
  const k = backupKey(id);
  if (!k) throw new Error(`kopija je šifrirana s ključem ${id}, ki ga ni v EVKLID_DATA_KEY ali EVKLID_DATA_KEYS_OLD`);
  const d = crypto.createDecipheriv("aes-256-gcm", k.key, buf.subarray(12, 24));
  d.setAAD(buf.subarray(0, 12));
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
export function signRequest({ method, url, body = "", payloadHash: hash = null, keyId, secret, region, now = new Date() }) {
  const u = new URL(url);
  const amzDate = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const date = amzDate.slice(0, 8);
  const payloadHash = hash || sha256(body);
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
  // tok: { stream(), bytes, sha256 } namesto body (encryptBackupFile): pošlje se po kosih z znano dolžino.
  const call = async (method, url, body, tok = null) => {
    const headers = signRequest({ method, url, body: body ?? "", payloadHash: tok?.sha256, keyId: cfg.keyId, secret: cfg.secret, region: cfg.region, now: now() });
    const init = { method, headers, body: body ?? undefined, signal: AbortSignal.timeout(tok ? 600_000 : 120_000) };
    if (tok) Object.assign(init, { body: tok.stream(), duplex: "half", headers: { ...headers, "content-length": String(tok.bytes) } });
    const res = await fetchFn(url, init);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      const code = text.match(/<Code>([^<]+)<\/Code>/)?.[1];
      const err = new Error(`shramba je vrnila ${res.status}${code ? ` ${code}` : ""}`);
      err.status = res.status;
      throw err;
    }
    return res;
  };
  return {
    put: (key, body) => call("PUT", objUrl(key), body),
    putStream: (key, tok) => call("PUT", objUrl(key), null, tok),
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
  const tok = await encryptBackupFile(backupFile);
  const key = objectKey(dbFile, date);
  await client.putStream(key, tok);
  // Kopija z datumom `limit` ali starejša gre: nobena kopija ni starejša od keepDays dni (obvestilo o zasebnosti).
  const limit = new Date(now().getTime() - cfg.keepDays * DAY).toISOString().slice(0, 10);
  const deleted = [];
  for (const b of await listCloud(cfg, dbFile, { fetchFn, now })) {
    if (b.date <= limit && b.key !== key) {
      await client.del(b.key);
      deleted.push(b.date);
    }
  }
  return { key, bytes: tok.bytes, deleted };
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

// Seznam izbrisov (server/kopije.js) zunaj strežnika: brez njega bi obnova iz R2 ali posnetka diska po izgubi diska
// vrnila izbrisane račune. Šifriran kot kopija baze, en predmet, ki se prepiše (stari izbrisi se iz njega pobrišejo).
// Pravilo vedra »izbriši po 30 dneh« ga pobriše le, če 30 dni ni bilo nobenega izbrisa; urna uskladitev ga naloži znova.
const izbrisiKey = (dbFile) => `${PREFIX}${stemOf(dbFile)}-izbrisi.json.enc`;

/**
 * Združi seznam izbrisov v shrambi z lokalnim (unija; lokalni se zapiše) in, če upload, naloži unijo, kadar se
 * razlikuje od shranjene. Brez EVKLID_DATA_KEY ne naredi nič (nešifrirano ne gre ven). Vrne { dodanih, nalozeno }
 * (dodanih: novi izbrisi iz shrambe) ali null brez ključa.
 */
export async function uskladiIzbrise(cfg, dbFile, { fetchFn, now = () => new Date(), upload = true } = {}) {
  if (!backupKey()) return null;
  const client = makeClient(cfg, { fetchFn, now });
  const key = izbrisiKey(dbFile);
  let remote = [];
  let starKljuc = false;
  try {
    const buf = await client.get(key);
    remote = JSON.parse(decryptBackup(buf).toString("utf8"));
    // Šifriran s starim ključem (EVKLID_DATA_KEYS_OLD): naložimo znova s sedanjim, sicer bi po odstranitvi starega
    // ključa seznama v shrambi ne bilo več mogoče prebrati, uskladitev pa bi vsako uro padla.
    starKljuc = buf.subarray(4, 12).toString("ascii") !== backupKey().id;
  } catch (e) {
    if (e.status !== 404) throw e; // brez seznama v shrambi (prvič) je prazen; ostale napake: nič ne prepišemo
  }
  const { list, dodanih } = dodajIzbrise(dbFile, Array.isArray(remote) ? remote : [], now());
  const enako = !starKljuc && JSON.stringify(list) === JSON.stringify(remote); // v shrambi je vedno zadnja unija v isti obliki
  let nalozeno = false;
  if (upload && !enako && (list.length || remote.length)) {
    await client.put(key, encryptBackup(Buffer.from(JSON.stringify(list))));
    nalozeno = true;
  }
  return { dodanih, nalozeno };
}

/**
 * Vsako uro (prvič 10 min po zagonu, ko je lokalna kopija že narejena) naloži najnovejšo dnevno kopijo, če je še ni.
 * status() je za javni /healthz/stanje: brez poti in podrobnosti napake.
 */
export function startCloudBackups(dbFile, { scheduler = true, log = console, fetchFn, now = () => new Date(), env = process.env, poIzbrisih = null } = {}) {
  const cfg = cloudConfig(env);
  const off = !cfg || !dbFile || dbFile === ":memory:" || env.EVKLID_BACKUPS === "0";
  let uploaded = null;
  let failed = false;
  let busy = false;
  const run = async () => {
    if (off || busy) return;
    busy = true;
    // Vse v try: run teče iz setTimeout/setInterval, zavrnjena obljuba bi ustavila strežnik.
    try {
      const latest = listBackups(dbFile).find((b) => !b.manual);
      if (latest && latest.date !== uploaded) {
        const r = await uploadBackup(cfg, dbFile, latest.file, latest.date, { fetchFn, now });
        uploaded = latest.date;
        log.info?.(`[evklid] kopija zunaj strežnika: ${latest.date} (${Math.round(r.bytes / 1024)} kB)${r.deleted.length ? `, pobrisane: ${r.deleted.join(", ")}` : ""}`);
      }
      // Seznam izbrisov: novi izbrisi gredo ven v največ 1 uri; izbrisi, ki so bili samo v shrambi (disk obnovljen
      // iz posnetka), se ponovijo v bazi (poIzbrisih; poceni, zato vsakič, tudi če je prenos ob zagonu zamudil rok).
      const iz = await uskladiIzbrise(cfg, dbFile, { fetchFn, now });
      if (iz?.dodanih) log.info?.(`[evklid] seznam izbrisov iz shrambe zunaj strežnika: ${iz.dodanih} novih`);
      if (iz?.nalozeno) log.info?.("[evklid] seznam izbrisov naložen v shrambo zunaj strežnika");
      if (iz) poIzbrisih?.();
      failed = false;
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

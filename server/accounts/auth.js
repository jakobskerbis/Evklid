// Gesla (scrypt), seje s piškotkom in žetoni za e-poštne povezave.
import crypto from "node:crypto";

export const COOKIE = "sm_session";
const SESSION_DAYS = 365; // prijava enkrat na napravo (j, 2026-10-30: »naj se mora vsak uporabnik prijavit samo enkrat«)

// Novi zapisi: scrypt2$N$r$p$sol$ključ (N = 2^17, r = 8, p = 1, priporočilo OWASP). Stari scrypt$sol$ključ
// (Node privzeto, N = 2^14) še vedno preverimo in ob uspešni prijavi tiho zamenjamo (needsRehash).
// scrypt teče asinhrono (ne ustavi strežnika); naenkrat največ en izračun, ker vsak porabi 128 MB pomnilnika.
// Testi (node --test) uporabljajo N = 2^14, da ostanejo hitri; parametri so zapisani v vsakem zapisu.
const COST = () => (process.env.NODE_TEST_CONTEXT ? { N: 2 ** 14, r: 8, p: 1 } : { N: 2 ** 17, r: 8, p: 1 });
const KEY_LEN = 64;
const maxmem = ({ N, r }) => 128 * N * r + 32 * 1024 * 1024;

// Vrsta je omejena: ob navalu (npr. 1000 hkratnih prijav, ki vse preidejo omejitev poskusov, preden se
// prva konča) bi čakanje raslo brez meje. Polna vrsta vrne napako SCRYPT_BUSY, ki jo app.js pretvori v 503.
export const SCRYPT_QUEUE_MAX = 8;
let running = Promise.resolve();
let waiting = 0;
function scrypt(password, salt, len, opts) {
  if (waiting >= SCRYPT_QUEUE_MAX) {
    const e = new Error("Evklid je trenutno preobremenjen. Poskusi čez nekaj sekund.");
    e.code = "SCRYPT_BUSY";
    e.status = 503;
    return Promise.reject(e);
  }
  waiting++;
  // Števec se zmanjša ob koncu izračuna (sinhrono z rezultatom), tudi ob napaki.
  const job = running.then(
    () =>
      new Promise((resolve, reject) => {
        try {
          crypto.scrypt(String(password), salt, len, { ...opts, maxmem: maxmem(opts) }, (err, key) => {
            waiting--;
            if (err) reject(err);
            else resolve(key);
          });
        } catch (e) {
          waiting--;
          reject(e);
        }
      }),
  );
  running = job.catch(() => {});
  return job;
}

export async function hashPassword(password, cost = COST()) {
  const salt = crypto.randomBytes(16);
  const key = await scrypt(password, salt, KEY_LEN, cost);
  return `scrypt2$${cost.N}$${cost.r}$${cost.p}$${salt.toString("base64")}$${key.toString("base64")}`;
}

function parseHash(stored) {
  const parts = String(stored || "").split("$");
  if (parts[0] === "scrypt" && parts.length === 3) return { N: 2 ** 14, r: 8, p: 1, salt: parts[1], key: parts[2] };
  if (parts[0] === "scrypt2" && parts.length === 6) {
    const [N, r, p] = parts.slice(1, 4).map(Number);
    // Razumne meje: zapis v bazi ne sme sprožiti izračuna, ki bi porabil ves pomnilnik.
    if (!(N >= 2 ** 10 && N <= 2 ** 18 && (N & (N - 1)) === 0 && r >= 1 && r <= 8 && p >= 1 && p <= 2)) return null;
    return { N, r, p, salt: parts[4], key: parts[5] };
  }
  return null;
}

export async function verifyPassword(password, stored) {
  const h = parseHash(stored);
  if (!h || !h.salt || !h.key) {
    await scrypt("x", "x", KEY_LEN, COST()); // enak čas kot pravo preverjanje
    return false;
  }
  const expected = Buffer.from(h.key, "base64");
  if (!expected.length) return false;
  const actual = await scrypt(password, Buffer.from(h.salt, "base64"), expected.length, { N: h.N, r: h.r, p: h.p });
  return crypto.timingSafeEqual(actual, expected);
}

// Ali je treba geslo ob naslednji uspešni prijavi znova zgostiti (starejši ali šibkejši zapis).
export function needsRehash(stored) {
  const h = parseHash(stored);
  const c = COST();
  return !h || !String(stored).startsWith("scrypt2$") || h.N < c.N || h.r !== c.r || h.p !== c.p;
}

// Namesto gesla, ki ga nihče ne pozna (gost, prijava z Apple): zapis, ki se nikoli ne ujema.
export const unusablePasswordHash = () => `none$${crypto.randomBytes(16).toString("base64")}`;

// Ob neobstoječem računu porabimo enak čas kot pri preverjanju gesla (brez razkritja, ali e-naslov obstaja).
export const fakeVerify = () => verifyPassword("x", `scrypt2$${COST().N}$8$1$AAAAAAAAAAAAAAAAAAAAAA==$${Buffer.alloc(KEY_LEN).toString("base64")}`).then(() => false);

export const randomToken = (bytes = 32) => crypto.randomBytes(bytes).toString("base64url");
export const sha256 = (s) => crypto.createHash("sha256").update(String(s)).digest("hex");

export function readCookie(req, name = COOKIE) {
  for (const part of (req.headers.cookie || "").split(";")) {
    const i = part.indexOf("=");
    if (i > 0 && part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim());
  }
  return null;
}

export class Sessions {
  constructor(db) {
    this.db = db;
  }
  create(parentId, days = SESSION_DAYS) {
    const token = randomToken();
    const expires = new Date(Date.now() + days * 86400000).toISOString();
    this.db.prepare("INSERT INTO parent_sessions (token_hash, parent_id, expires_at) VALUES (?, ?, ?)").run(sha256(token), parentId, expires);
    return { token, maxAge: days * 86400 };
  }
  parentId(token) {
    if (!token) return null;
    const row = this.db.prepare("SELECT parent_id, expires_at FROM parent_sessions WHERE token_hash = ?").get(sha256(token));
    if (!row) return null;
    if (Date.parse(row.expires_at) < Date.now()) {
      this.destroy(token);
      return null;
    }
    return row.parent_id;
  }
  destroy(token) {
    if (token) this.db.prepare("DELETE FROM parent_sessions WHERE token_hash = ?").run(sha256(token));
  }
  destroyOthers(parentId, keepToken) {
    this.db.prepare("DELETE FROM parent_sessions WHERE parent_id = ? AND token_hash != ?").run(parentId, sha256(keepToken || ""));
  }
  destroyAll(parentId) {
    this.db.prepare("DELETE FROM parent_sessions WHERE parent_id = ?").run(parentId);
  }
}

export function setSessionCookie(req, res, { token, maxAge }) {
  const secure = req.secure ? "; Secure" : "";
  res.append("Set-Cookie", `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`);
}
export function clearSessionCookie(req, res) {
  const secure = req.secure ? "; Secure" : "";
  res.append("Set-Cookie", `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`);
}

// Preprosta omejitev poskusov prijave (v pomnilniku).
export class Throttle {
  constructor(max = 10, windowMs = 15 * 60000) {
    this.max = max;
    this.windowMs = windowMs;
    this.hits = new Map();
  }
  blocked(key) {
    const h = this.hits.get(key);
    if (!h || Date.now() - h.start > this.windowMs) return false;
    return h.count >= this.max;
  }
  fail(key) {
    // Pomnilnik ne sme rasti brez meje (naključni e-naslovi): potekle zapise občasno počistimo.
    if (this.hits.size > 20000) for (const [k, v] of this.hits) if (Date.now() - v.start > this.windowMs) this.hits.delete(k);
    const h = this.hits.get(key);
    if (!h || Date.now() - h.start > this.windowMs) this.hits.set(key, { start: Date.now(), count: 1 });
    else h.count++;
  }
  reset(key) {
    this.hits.delete(key);
  }
}

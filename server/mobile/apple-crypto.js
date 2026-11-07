// Preverjanje podpisov Apple brez zunanjih knjižnic:
// - JWS iz StoreKit 2 in obvestil App Store (ES256, veriga x5c do korenskega potrdila Apple Root CA - G3),
// - žeton »Prijava z Apple« (RS256, javni ključi z appleid.apple.com).
import crypto from "node:crypto";

// Prstni odtis korenskega potrdila Apple Root CA - G3 (https://www.apple.com/certificateauthority/, velja do 2039).
export const APPLE_ROOT_G3 = "63:34:3A:BF:B8:9A:6A:03:EB:B5:7E:9B:3F:5F:A7:BE:7C:4F:5C:75:6F:30:17:B3:A8:C4:88:C3:65:3E:91:79";
// Razširitve, ki jih Apple postavi v potrdila za podpis nakupov (enako preverja Applova knjižnica app-store-server-library).
const OID_LEAF = Buffer.from("060a2a864886f76364060b01", "hex"); // 1.2.840.113635.100.6.11.1
const OID_INTERMEDIATE = Buffer.from("060a2a864886f76364060201", "hex"); // 1.2.840.113635.100.6.2.1

const b64url = (s) => Buffer.from(String(s), "base64url");
const json = (s) => JSON.parse(b64url(s).toString("utf8"));

export class AppleSignatureError extends Error {}

// Razčleni JWS (header.payload.signature) brez preverjanja.
export function decodeJws(jws) {
  const parts = String(jws || "").split(".");
  if (parts.length !== 3) throw new AppleSignatureError("JWS ni pravilne oblike.");
  try {
    return { header: json(parts[0]), payload: json(parts[1]), signingInput: `${parts[0]}.${parts[1]}`, signature: b64url(parts[2]) };
  } catch {
    throw new AppleSignatureError("JWS ni pravilne oblike.");
  }
}

// Preveri JWS, ki ga je podpisal Apple (nakup, obnova, obvestilo). Vrne vsebino (payload).
// rootFingerprint je zamenljiv samo za teste (lastna testna veriga).
export function verifyAppleJws(jws, { rootFingerprint = APPLE_ROOT_G3, now = new Date(), checkOids = true } = {}) {
  const { header, payload, signingInput, signature } = decodeJws(jws);
  if (header.alg !== "ES256") throw new AppleSignatureError("Nepričakovan algoritem podpisa.");
  const chain = Array.isArray(header.x5c) ? header.x5c : [];
  if (chain.length !== 3) throw new AppleSignatureError("Manjka veriga potrdil.");
  let certs;
  try {
    certs = chain.map((c) => new crypto.X509Certificate(Buffer.from(c, "base64")));
  } catch {
    throw new AppleSignatureError("Potrdila ni mogoče prebrati.");
  }
  const [leaf, intermediate, root] = certs;
  if (root.fingerprint256 !== rootFingerprint) throw new AppleSignatureError("Korensko potrdilo ni Applovo.");
  // Podpis potrdila mora ustrezati izdajatelju, vsako potrdilo mora biti veljavno.
  if (!leaf.verify(intermediate.publicKey) || !intermediate.verify(root.publicKey) || !root.verify(root.publicKey)) {
    throw new AppleSignatureError("Veriga potrdil ni veljavna.");
  }
  if (!intermediate.ca || !root.ca) throw new AppleSignatureError("Vmesno potrdilo ni izdajatelj.");
  for (const c of certs) {
    if (now < new Date(c.validFrom) || now > new Date(c.validTo)) throw new AppleSignatureError("Potrdilo je poteklo.");
  }
  if (checkOids && (!leaf.raw.includes(OID_LEAF) || !intermediate.raw.includes(OID_INTERMEDIATE))) {
    throw new AppleSignatureError("Potrdilo ni namenjeno podpisu nakupov.");
  }
  const ok = crypto.verify("sha256", Buffer.from(signingInput), { key: leaf.publicKey, dsaEncoding: "ieee-p1363" }, signature);
  if (!ok) throw new AppleSignatureError("Podpis ni veljaven.");
  return payload;
}

// --- Prijava z Apple ---
const APPLE_ISS = "https://appleid.apple.com";
const KEYS_URL = "https://appleid.apple.com/auth/keys";
let keyCache = { at: 0, keys: [] };

// force (neznan kid): znova prenesemo največ enkrat na minuto za ves strežnik, da ponarejeni žetoni z izmišljenim kid
// ne pošiljajo zahtevkov Applu (namesto meje na omrežje v apple-signin.js).
async function appleKeys(fetchFn, force = false) {
  const fresh = Date.now() - keyCache.at < (force ? 60000 : 24 * 3600000);
  if (fresh && keyCache.keys.length) return keyCache.keys;
  const r = await fetchFn(KEYS_URL, { signal: AbortSignal.timeout(8000) });
  if (!r.ok) throw new AppleSignatureError("Ključev Apple ni mogoče prenesti.");
  const { keys } = await r.json();
  keyCache = { at: Date.now(), keys: Array.isArray(keys) ? keys : [] };
  return keyCache.keys;
}

// Preveri identity token (JWT RS256). audiences: dovoljeni bundle id-ji aplikacije.
// nonce: SHA-256 (hex) naključnega niza, ki ga je aplikacija poslala Applu.
// Vrne { sub, email, emailVerified, isPrivateEmail }.
export async function verifyAppleIdentityToken(token, { audiences, nonce = null, fetchFn = fetch, keys = null, now = Date.now() } = {}) {
  const parts = String(token || "").split(".");
  if (parts.length !== 3) throw new AppleSignatureError("Žeton ni pravilne oblike.");
  let header, claims;
  try {
    header = json(parts[0]);
    claims = json(parts[1]);
  } catch {
    throw new AppleSignatureError("Žeton ni pravilne oblike.");
  }
  if (header.alg !== "RS256") throw new AppleSignatureError("Nepričakovan algoritem podpisa.");
  let list = keys || (await appleKeys(fetchFn));
  let jwk = list.find((k) => k.kid === header.kid);
  // Apple občasno zamenja ključe: neznan kid → enkrat znova prenesemo.
  if (!jwk && !keys) jwk = (list = await appleKeys(fetchFn, true)).find((k) => k.kid === header.kid);
  if (!jwk) throw new AppleSignatureError("Neznan ključ.");
  const key = crypto.createPublicKey({ key: jwk, format: "jwk" });
  const ok = crypto.verify("RSA-SHA256", Buffer.from(`${parts[0]}.${parts[1]}`), key, b64url(parts[2]));
  if (!ok) throw new AppleSignatureError("Podpis ni veljaven.");
  if (claims.iss !== APPLE_ISS) throw new AppleSignatureError("Napačen izdajatelj.");
  const aud = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  if (!aud.some((a) => audiences.includes(a))) throw new AppleSignatureError("Žeton ni za to aplikacijo.");
  if (!Number.isFinite(claims.exp) || claims.exp * 1000 < now - 60000) throw new AppleSignatureError("Žeton je potekel.");
  if (nonce !== null && claims.nonce !== nonce) throw new AppleSignatureError("Napačen enkratni niz.");
  if (!claims.sub) throw new AppleSignatureError("Manjka uporabnik.");
  const flag = (v) => v === true || v === "true";
  return { sub: String(claims.sub), email: claims.email ? String(claims.email).toLowerCase() : null, emailVerified: flag(claims.email_verified), isPrivateEmail: flag(claims.is_private_email) };
}

// Podpisan JWT (ES256) s ključem .p8 iz App Store Connect: client_secret za Sign in with Apple REST API.
export function appleClientSecret({ teamId, keyId, privateKey, clientId, now = Date.now() }) {
  const enc = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const iat = Math.floor(now / 1000);
  const input = `${enc({ alg: "ES256", kid: keyId })}.${enc({ iss: teamId, iat, exp: iat + 300, aud: APPLE_ISS, sub: clientId })}`;
  const sig = crypto.sign("sha256", Buffer.from(input), { key: privateKey, dsaEncoding: "ieee-p1363" });
  return `${input}.${sig.toString("base64url")}`;
}

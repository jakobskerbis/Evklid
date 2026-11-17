// Kode vabila v pilot iz okolja EVKLID_VABILA (server/vabila.js) brez Expressa: uvozita jih stran /api/vabilo in meja
// pilota (server/accounts/pilot-meja.js isPilotParent, #751). Velike in male črke so enake, ločila vejica, podpičje
// ali presledek.
import crypto from "node:crypto";

export const MAX_CODE = 64;
// Krajše kode v EVKLID_VABILA ne veljajo (prelahko jih uganeš); ob zagonu strežnik enkrat opozori, koliko jih je.
export const MIN_CODE = 8;

export const norm = (v) => (typeof v === "string" ? v.trim().toLowerCase() : "");
const allCodes = (env) => String(env.EVKLID_VABILA || "").split(/[,;\s]+/).map(norm).filter(Boolean);
export const inviteCodes = (env = process.env) => allCodes(env).filter((c) => c.length >= MIN_CODE && c.length <= MAX_CODE);
// Koliko kod v okolju je prekratkih (opozorilo ob zagonu; kod samih ne izpišemo).
export const shortInviteCodes = (env = process.env) => allCodes(env).filter((c) => c.length < MIN_CODE).length;

// Zgoščena koda za bazo (parents.pilot_invite_hash, pilot_vabila.code_hash): koda sama se nikoli ne shrani.
export const inviteHash = (code) => crypto.createHash("sha256").update(`vabilo|${norm(code)}`).digest("hex");

let hashCache = { raw: null, set: new Set() };
// Ali je zgoščena koda še na seznamu EVKLID_VABILA (j člana izključi tako, da kodo umakne s seznama). Kliče se ob
// vsakem preverjanju meje, zato je množica zgoščenih kod shranjena, dokler se okolje ne spremeni.
export function inviteHashValid(hash, env = process.env) {
  if (typeof hash !== "string" || !/^[0-9a-f]{64}$/.test(hash)) return false;
  const raw = String(env.EVKLID_VABILA || "");
  if (hashCache.raw !== raw) hashCache = { raw, set: new Set(inviteCodes(env).map(inviteHash)) };
  return hashCache.set.has(hash);
}

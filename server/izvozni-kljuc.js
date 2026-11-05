// Ključ za izvoze brez prijave (EVKLID_EXPORT_TOKEN): tedenska posodobitev kozmetike (server/avatar.js)
// in samodejni pregled prijav napak (server/reports.js). Ključ samo v glavi Authorization (nikoli v naslovu),
// dolg vsaj 24 znakov, primerjava v stalnem času (oba niza najprej skozi SHA-256, da sta enako dolga).
import crypto from "node:crypto";
import { isLocalRequest } from "./feedback.js";

export function exportTokenOk(req, env = process.env) {
  const want = String(env.EVKLID_EXPORT_TOKEN || "");
  const got = /^Bearer\s+(\S+)$/i.exec(req.headers?.authorization || "")?.[1] || "";
  if (want.length < 24 || !got) return false;
  const a = crypto.createHash("sha256").update(got).digest();
  const b = crypto.createHash("sha256").update(want).digest();
  return crypto.timingSafeEqual(a, b);
}

// Ključ, prijavljen skrbnik ali računalnik, kjer teče strežnik.
export const exportAllowed = (req) => exportTokenOk(req) || !!req.parent?.is_admin || isLocalRequest(req);

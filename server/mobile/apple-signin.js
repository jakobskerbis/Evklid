// Prijava z Apple v mobilni aplikaciji (iPhone, iPad).
// Aplikacija pošlje Applov identity token in naključni niz (nonce); strežnik preveri podpis in
// poišče račun po Applovem id-ju uporabnika ali po potrjenem e-naslovu. Nov račun potrebuje datum
// rojstva in strinjanje z obvestilom o zasebnosti (enaka pravila starosti kot pri registraciji).
import crypto from "node:crypto";
import fs from "node:fs";
import express from "express";
import { unusablePasswordHash, setSessionCookie } from "../accounts/auth.js";
import { netKey } from "../accounts/guest.js";
import { isLocalRequest } from "../feedback.js";
import { verifyAppleIdentityToken, appleClientSecret, AppleSignatureError } from "./apple-crypto.js";
import { BUNDLE_ID } from "./store-billing.js";

// Besedilo iz zahteve; drugačna vrednost (predmet, število) šteje kot prazna, da ni napake 500.
const text = (v) => (typeof v === "string" ? v : "");
const sha256hex = (s) => crypto.createHash("sha256").update(String(s)).digest("hex");

export function migrateAppleSignIn(db) {
  const cols = db.prepare("PRAGMA table_info(parents)").all().map((c) => c.name);
  if (!cols.includes("apple_sub")) db.exec("ALTER TABLE parents ADD COLUMN apple_sub TEXT");
  db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_parents_apple_sub ON parents(apple_sub) WHERE apple_sub IS NOT NULL");
}

// Ključ .p8 za preklic žetonov ob izbrisu računa (Apple to zahteva od aplikacij s prijavo z Apple).
function revokeConfig(env) {
  const { EVKLID_APPLE_TEAM_ID: teamId, EVKLID_APPLE_KEY_ID: keyId } = env;
  let key = env.EVKLID_APPLE_PRIVATE_KEY || "";
  if (key && !key.includes("BEGIN")) {
    try {
      key = fs.readFileSync(key, "utf8");
    } catch {
      key = "";
    }
  }
  return teamId && keyId && key ? { teamId, keyId, privateKey: key.replace(/\\n/g, "\n") } : null;
}

export function mountAppleSignIn(app, ctx, opts = {}) {
  const { db, sessions, getParent, parentByEmail, publicParent, createParent, checkAge, signupThrottle } = ctx;
  const env = opts.env || process.env;
  const log = opts.log || console;
  const fetchFn = opts.fetchFn || fetch;
  migrateAppleSignIn(db);
  const json = express.json({ limit: "32kb" });
  const audiences = [BUNDLE_ID, ...String(env.EVKLID_APPLE_AUDIENCES || "").split(",").map((s) => s.trim()).filter(Boolean)];
  const verify = (token, rawNonce) =>
    verifyAppleIdentityToken(token, { audiences, nonce: rawNonce ? sha256hex(rawNonce) : null, fetchFn, keys: opts.appleKeys || null });

  app.post("/api/auth/apple", json, async (req, res) => {
    const rawNonce = text(req.body?.nonce);
    if (rawNonce.length < 16) return res.status(400).json({ error: "Manjka enkratni niz." });
    let who;
    try {
      who = await verify(req.body?.identity_token, rawNonce);
    } catch (err) {
      if (err instanceof AppleSignatureError) return res.status(401).json({ error: "Prijava z Apple ni uspela. Poskusi znova." });
      log.error?.("[evklid] prijava z Apple:", err.message);
      return res.status(502).json({ error: "Apple se ne odziva. Poskusi znova čez nekaj minut." });
    }
    let p = db.prepare("SELECT * FROM parents WHERE apple_sub = ?").get(who.sub);
    let created = false;
    if (!p && who.email && who.emailVerified) {
      // Obstoječ račun z istim (pri Applu potrjenim) e-naslovom: poveževa ga s prijavo z Apple.
      const byEmail = parentByEmail(who.email);
      if (byEmail && !byEmail.is_guest && !byEmail.apple_sub) {
        db.prepare("UPDATE parents SET apple_sub = ?, email_verified_at = COALESCE(email_verified_at, ?) WHERE id = ?").run(who.sub, new Date().toISOString(), byEmail.id);
        p = getParent(byEmail.id);
      }
    }
    if (!p) {
      if (!who.email) return res.status(400).json({ error: "Apple ni poslal e-naslova. Ustvari račun z e-naslovom in geslom.", no_email: true });
      // Nov račun: ista pravila kot registracija (strinjanje, starost, omejitev novih računov na omrežje).
      if (req.body?.accept_privacy !== true) return res.status(400).json({ error: "Za nov račun potrebujemo še datum rojstva in strinjanje z obvestilom o zasebnosti.", need_signup: true });
      const key = netKey(req.ip);
      if (!isLocalRequest(req) && signupThrottle.blocked(key)) return res.status(429).json({ error: "S tega omrežja je danes ustvarjenih že preveč računov. Poskusi jutri." });
      const birthIso = checkAge(req, res);
      if (!birthIso) return;
      signupThrottle.fail(key);
      const name = [req.body?.given_name, req.body?.family_name].filter(Boolean).join(" ");
      const { id } = createParent(req, { email: who.email, passwordHash: unusablePasswordHash(), name, birthIso, verified: !!who.emailVerified });
      // Potrjen samo, kar je Apple potrdil (pregled #477 A: potrjen e-naslov odpre pilot in mejo lastnika).
      db.prepare("UPDATE parents SET apple_sub = ? WHERE id = ?").run(who.sub, id);
      p = getParent(id);
      created = true;
    }
    setSessionCookie(req, res, sessions.create(p.id));
    res.status(created ? 201 : 200).json({ parent: publicParent(p), created });
  });

  // Izbris računa brez gesla: nova prijava z Apple potrdi, da je to lastnik. Ob tem prekličemo
  // Applove žetone (če je nastavljen ključ .p8), kot to zahteva App Store (smernica 5.1.1(v)).
  const revoke = revokeConfig(env);
  ctx.addReauth(async (req, p) => {
    const nonce = text(req.body?.apple_nonce);
    if (!p.apple_sub || !req.body?.apple_identity_token || nonce.length < 16) return false;
    try {
      const who = await verify(req.body.apple_identity_token, nonce);
      if (who.sub !== p.apple_sub) return false;
    } catch {
      return false;
    }
    const code = text(req.body?.apple_authorization_code);
    if (revoke && code) revokeAppleTokens(code, revoke, fetchFn).catch((e) => log.error?.("[evklid] preklic žetona Apple:", e.message));
    return true;
  });
}

async function revokeAppleTokens(code, cfg, fetchFn) {
  const client_secret = appleClientSecret({ ...cfg, clientId: BUNDLE_ID });
  const post = (url, body) =>
    fetchFn(url, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(body), signal: AbortSignal.timeout(10000) });
  const r = await post("https://appleid.apple.com/auth/token", { client_id: BUNDLE_ID, client_secret, code, grant_type: "authorization_code" });
  const t = await r.json().catch(() => ({}));
  const token = t.refresh_token || t.access_token;
  if (!token) throw new Error(t.error || `token ${r.status}`);
  await post("https://appleid.apple.com/auth/revoke", { client_id: BUNDLE_ID, client_secret, token, token_type_hint: t.refresh_token ? "refresh_token" : "access_token" });
}

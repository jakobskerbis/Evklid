// Prijava z Apple v mobilni aplikaciji (iPhone, iPad).
// Aplikacija pošlje Applov identity token in naključni niz (nonce); strežnik preveri podpis in
// poišče račun po Applovem id-ju uporabnika ali po potrjenem e-naslovu. Nov račun potrebuje datum
// rojstva in strinjanje z obvestilom o zasebnosti (enaka pravila starosti kot pri registraciji).
import crypto from "node:crypto";
import fs from "node:fs";
import express from "express";
import { unusablePasswordHash, setSessionCookie, Throttle } from "../accounts/auth.js";
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
  const dropForeignAccess = ctx.dropForeignAccess || ((id) => sessions.destroyAll(id));
  const audit = ctx.audit || (() => {});
  // Omejitev neuspelih poskusov na omrežje (netKey: IPv6 /64; neveljaven žeton lahko sproži prenos Applovih ključev,
  // pregled #492 A P3-5). Uspešne prijave in drugi korak (need_signup) se ne štejejo (CGNAT mobilnih operaterjev, B P3-3).
  const appleThrottle = new Throttle(30, 15 * 60000);
  const env = opts.env || process.env;
  const log = opts.log || console;
  const fetchFn = opts.fetchFn || fetch;
  migrateAppleSignIn(db);
  const json = express.json({ limit: "32kb" });
  const audiences = [BUNDLE_ID, ...String(env.EVKLID_APPLE_AUDIENCES || "").split(",").map((s) => s.trim()).filter(Boolean)];
  const verify = (token, rawNonce) =>
    verifyAppleIdentityToken(token, { audiences, nonce: rawNonce ? sha256hex(rawNonce) : null, fetchFn, keys: opts.appleKeys || null });

  app.post("/api/auth/apple", json, async (req, res) => {
    const net = netKey(req.ip);
    if (!isLocalRequest(req) && appleThrottle.blocked(net)) return res.status(429).json({ error: "Preveč poskusov. Poskusi čez 15 minut." });
    const rawNonce = text(req.body?.nonce);
    if (rawNonce.length < 16) {
      appleThrottle.fail(net);
      return res.status(400).json({ error: "Manjka enkratni niz." });
    }
    let who;
    try {
      who = await verify(req.body?.identity_token, rawNonce);
    } catch (err) {
      appleThrottle.fail(net);
      if (err instanceof AppleSignatureError) return res.status(401).json({ error: "Prijava z Apple ni uspela. Poskusi znova." });
      log.error?.("[evklid] prijava z Apple:", err.message);
      return res.status(502).json({ error: "Apple se ne odziva. Poskusi znova čez nekaj minut." });
    }
    // Nov račun ali nepotrjen obstoječ: ista pravila kot registracija (strinjanje, starost, omejitev novih računov na omrežje).
    // Vrne datum rojstva ali null (odgovor je že poslan).
    // existing: račun že obstaja (povezava nepotrjenega), zato se ne šteje v mejo novih računov omrežja (pregled #492 B P3-2).
    const signup = (existing = false) => {
      if (req.body?.accept_privacy !== true) {
        res.status(400).json({ error: "Za nov račun potrebujemo še datum rojstva in strinjanje z obvestilom o zasebnosti.", need_signup: true, ...(existing ? { existing: true } : {}) });
        return null;
      }
      const key = netKey(req.ip);
      if (!existing && !isLocalRequest(req) && signupThrottle.blocked(key)) {
        res.status(429).json({ error: "S tega omrežja je danes ustvarjenih že preveč računov. Poskusi jutri." });
        return null;
      }
      const birthIso = checkAge(req, res);
      if (!birthIso) return null;
      if (!existing) signupThrottle.fail(key);
      return birthIso;
    };
    const name = [req.body?.given_name, req.body?.family_name].filter(Boolean).join(" ").slice(0, 60);
    let p = db.prepare("SELECT * FROM parents WHERE apple_sub = ?").get(who.sub);
    let created = false;
    if (!p && who.email && who.emailVerified) {
      // Obstoječ račun z istim (pri Applu potrjenim) e-naslovom: poveževa ga s prijavo z Apple.
      const byEmail = parentByEmail(who.email);
      if (byEmail && !byEmail.is_guest && !byEmail.apple_sub) {
        const hasPassword = !String(byEmail.password_hash || "").startsWith("none$");
        if (!byEmail.email_verified_at) {
          // Nepotrjen e-naslov: račun je ustvaril nekdo, ki naslova ni dokazal (lahko tujec pred lastnikom). Z njim ravnamo
          // kot z novim: lastnik da svoje soglasje in datum rojstva (starost se preveri znova), priporočitelj in ime tujca
          // odpadeta, geslo, žetoni, seje, obvestila na telefon in ključi razredov ne veljajo več (pregled #492 A, B).
          const birthIso = signup(true);
          if (!birthIso) return;
          db.prepare(
            `UPDATE parents SET password_hash = ?, verify_token_hash = NULL, reset_token_hash = NULL, reset_expires_at = NULL,
               birth_date = ?, privacy_version = ?, privacy_accepted_at = datetime('now'), name = ?, referred_by = NULL, referral_rewarded = 0 WHERE id = ?`,
          ).run(unusablePasswordHash(), birthIso, ctx.privacyVersion ?? byEmail.privacy_version, name, byEmail.id);
          dropForeignAccess(byEmail.id);
          audit(db, { req, parentId: byEmail.id, action: "apple_link_unverified" });
        } else if (hasPassword) {
          // Potrjen račun z geslom: sem pride samo, kdor ima Apple ID s potrjenim istim naslovom (v praksi lastnik
          // nabiralnika), zato naprav ne odjavimo (otrokove tablice, obvestila; pregled #492 A P2-2). Lastnik dobi
          // e-pošto; če povezave ni naredil sam, »Pozabljeno geslo« odjavi vse naprave in odstrani Apple ID.
          if (ctx.sendMail && ctx.appleLinkedEmail) Promise.resolve(ctx.sendMail(byEmail.email, ctx.appleLinkedEmail())).catch(() => {});
          audit(db, { req, parentId: byEmail.id, action: "apple_link" });
        }
        db.prepare("UPDATE parents SET apple_sub = ?, email_verified_at = COALESCE(email_verified_at, ?), verify_token_hash = NULL WHERE id = ?").run(who.sub, new Date().toISOString(), byEmail.id);
        p = getParent(byEmail.id);
      }
    }
    if (!p) {
      if (!who.email) return res.status(400).json({ error: "Apple ni poslal e-naslova. Ustvari račun z e-naslovom in geslom.", no_email: true });
      // Naslova, ki ga Apple ni potrdil, ne vzamemo: račun s tujim naslovom in napadalčevim Apple ID (pregled #492 B P2-1).
      if (!who.emailVerified) return res.status(400).json({ error: "Apple ni potrdil e-naslova. Ustvari račun z e-naslovom in geslom.", no_email: true });
      // Naslov je že zaseden (npr. Apple ga ni potrdil, zato računa nismo povezali): prijava z geslom.
      // Račun brez gesla (ustvarjen z drugim Apple ID): »prijavi se z geslom« ne pomaga (pregled #492 A P3-6).
      const taken = parentByEmail(who.email);
      if (taken)
        return res.status(409).json({
          error: String(taken.password_hash || "").startsWith("none$")
            ? "Račun s tem e-naslovom že obstaja. Prijavi se z Apple ID, s katerim si ga ustvaril, ali nastavi geslo s »Pozabljeno geslo«."
            : "Račun s tem e-naslovom že obstaja. Prijavi se z e-naslovom in geslom.",
          exists: true,
        });
      const birthIso = signup();
      if (!birthIso) return;
      // Apple je naslov potrdil (zgoraj).
      const { id } = createParent(req, { email: who.email, passwordHash: unusablePasswordHash(), name, birthIso, verified: true });
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

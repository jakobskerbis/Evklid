// Iz brskalnika v aplikacijo brez ponovne prijave (j, 2026-10-30: »če app prenese nekdo iz spletne strani
// preko profila, naj ostane prijavljen«).
// - Stran /prenesi v brskalniku, kjer je račun prijavljen, pokaže gumb »Odpri Evklid in ostani prijavljen«:
//   enkratna povezava evklid://prijava?t=… (Android: intent:// s stranjo /prenesi, če aplikacije ni).
// - Aplikacija (mobile/src/app/prijava.tsx) pošlje žeton na POST /api/auth/app-link in dobi svojo sejo.
//   Profili, ki so v brskalniku odklenjeni, so odklenjeni tudi na telefonu; izbran je nazadnje uporabljeni.
// Varnost: žeton je v bazi samo kot sha256, velja LINK_MIN minut in samo enkrat, samo za račun (ne gosta)
// in samo, dokler je seja v brskalniku veljavna (odjava ali novo geslo ga razveljavita).
import express from "express";
import { randomToken, sha256, readCookie, setSessionCookie, Throttle, COOKIE } from "../accounts/auth.js";
import { DEVICE_COOKIE, deviceLabel } from "../accounts/devices.js";
import { audit } from "../dnevnik-dostopov.js";
import { BRAND } from "../brand.js";
import { ANDROID_PACKAGE } from "./store-billing.js";

export const LINK_MIN = 15;

export function migrateAppLinks(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS app_links (
      token_hash TEXT PRIMARY KEY,
      parent_id INTEGER NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
      session_hash TEXT NOT NULL,
      student_ids TEXT NOT NULL DEFAULT '[]',
      student_id INTEGER,
      account_open INTEGER NOT NULL DEFAULT 1,
      expires_at INTEGER NOT NULL,
      used_at INTEGER
    );
  `);
}

// Povezava, ki odpre aplikacijo. Android: intent:// (če aplikacije ni, Chrome odpre fallback).
export function appLinkUrl(token, { android = false, fallback = "" } = {}) {
  const q = `prijava?t=${encodeURIComponent(token)}`;
  if (!android) return `${BRAND.slug}://${q}`;
  return `intent://${q}#Intent;scheme=${BRAND.slug};package=${ANDROID_PACKAGE};${fallback ? `S.browser_fallback_url=${encodeURIComponent(fallback)};` : ""}end`;
}

export function createAppLinks(ctx) {
  const { db, sessions, getParent, childIds, locks, accountOpen } = ctx;
  migrateAppLinks(db);

  // Prijavljen račun v tem brskalniku (piškotek), brez gosta.
  function browserParent(req) {
    const token = readCookie(req, COOKIE);
    const p = token ? getParent(sessions.parentId(token)) : null;
    return p && !p.is_guest ? { parent: p, sessionHash: sha256(token) } : null;
  }

  // Nov enkraten žeton za ta brskalnik ali null (ni prijave).
  function create(req, now = Date.now()) {
    const who = browserParent(req);
    if (!who) return null;
    const device = readCookie(req, DEVICE_COOKIE);
    const deviceId = device && device.length >= 20 ? sha256(device) : null;
    // Zaklep računa (EVKLID_ACCOUNT_LOCK=1): telefon dobi odklenjen zavihek Račun samo, če je odklenjen v brskalniku.
    const accountIsOpen = accountOpen(who.parent, deviceId) ? 1 : 0;
    const ids = childIds(who.parent.id);
    // Račun z enim profilom nima gesla profila (j, 2026-10-30): profil je odprt in telefon ga prevzame.
    const open = ids.length === 1 ? ids : deviceId ? ids.filter((id) => locks.isUnlocked(id, deviceId, now)) : [];
    // Nazadnje uporabljeni odprti profil v tem brskalniku, sicer edini odprti.
    const last = open.length
      ? db.prepare(`SELECT student_id FROM profile_devices WHERE device_id = ? AND student_id IN (${open.map(() => "?").join(",")}) ORDER BY last_seen DESC LIMIT 1`).get(deviceId, ...open)?.student_id
      : null;
    const token = randomToken();
    db.prepare("DELETE FROM app_links WHERE expires_at < ?").run(now - 86400000);
    db.prepare("INSERT INTO app_links (token_hash, parent_id, session_hash, student_ids, student_id, account_open, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?)").run(
      sha256(token),
      who.parent.id,
      who.sessionHash,
      JSON.stringify(open),
      last ?? (open.length === 1 ? open[0] : null),
      accountIsOpen,
      now + LINK_MIN * 60000,
    );
    return token;
  }

  // Veljaven žeton → { parent, studentIds, studentId, accountOpen } ali null. use = true ga porabi (samo enkrat).
  function check(token, { use = false, now = Date.now() } = {}) {
    if (typeof token !== "string" || !/^[A-Za-z0-9_-]{20,200}$/.test(token)) return null;
    const row = use
      ? db.prepare("UPDATE app_links SET used_at = ? WHERE token_hash = ? AND used_at IS NULL AND expires_at > ? RETURNING *").get(now, sha256(token), now)
      : db.prepare("SELECT * FROM app_links WHERE token_hash = ? AND used_at IS NULL AND expires_at > ?").get(sha256(token), now);
    if (!row) return null;
    const live = db.prepare("SELECT expires_at FROM parent_sessions WHERE token_hash = ? AND parent_id = ?").get(row.session_hash, row.parent_id);
    if (!live || Date.parse(live.expires_at) < now) return null;
    const parent = getParent(row.parent_id);
    if (!parent || parent.is_guest) return null;
    const own = new Set(childIds(parent.id));
    const studentIds = JSON.parse(row.student_ids || "[]").filter((id) => own.has(id));
    return {
      parent,
      studentIds,
      studentId: own.has(row.student_id) ? row.student_id : null,
      accountOpen: !!row.account_open,
    };
  }
  const consume = (token, now) => check(token, { use: true, now });
  const peek = (token, now) => check(token, { now });

  return { browserParent, create, consume, peek };
}

// Aplikacija najprej vpraša, za kateri račun je povezava (»Prijava kot …?«, da je tuja povezava ne prijavi
// potiho v drug račun), nato žeton zamenja za svojo sejo.
export function mountAppLink(app, ctx, links) {
  const { db, sessions, publicParent, locks, accountLocks, devices } = ctx;
  const json = express.json({ limit: "4kb" });
  const throttle = new Throttle(20);
  const expired = (res) =>
    res.status(400).json({
      error: "Povezava je potekla ali je že bila uporabljena. V brskalniku osveži stran in tapni gumb znova.",
      expired: true,
    });
  const guard = (req, res) => {
    if (!req.get("x-app-client")) res.status(400).json({ error: "Samo za aplikacijo." });
    else if (throttle.blocked(req.ip)) res.status(429).json({ error: "Preveč poskusov. Poskusi čez 15 minut." });
    else return true;
    return false;
  };
  app.post("/api/auth/app-link/check", json, (req, res) => {
    if (!guard(req, res)) return;
    const got = links.peek(req.body?.token);
    if (!got) {
      throttle.fail(req.ip);
      return expired(res);
    }
    res.json({ email: got.parent.email, name: got.parent.name || "" });
  });
  app.post("/api/auth/app-link", json, (req, res) => {
    if (!guard(req, res)) return;
    const got = links.consume(req.body?.token);
    if (!got) {
      throttle.fail(req.ip);
      return expired(res);
    }
    const { parent, studentIds, studentId } = got;
    for (const id of studentIds) locks.unlock(id, req.deviceId);
    // Učenec gre iz brskalnika v aplikacijo: telefon prevzame profil (en profil hkrati na eni napravi).
    if (studentId)
      devices.use(studentId, req.deviceId, deviceLabel(req.get("user-agent")), {
        takeover: true,
      });
    if (got.accountOpen) accountLocks.unlock(parent.id, req.deviceId);
    setSessionCookie(req, res, sessions.create(parent.id));
    audit(db, { req, parentId: parent.id, action: "login_app_link" });
    res.json({ parent: publicParent(parent), student_id: studentId });
  });
}

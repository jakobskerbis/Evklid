// Naprave: profil je hkrati odprt samo na eni napravi, menjava profilov je omejena,
// starš vidi, na koliko napravah je bil profil odprt.
import "../env.js";
import { randomToken, sha256, readCookie } from "./auth.js";

export const DEVICE_COOKIE = "sm_device";
export const CLAIM_IDLE_MS = 30 * 60000; // po 30 minutah nedejavnosti profil prevzame druga naprava brez vprašanja
export const SWAP_DAYS = 30;
export const deviceWarnLimit = () => Number(process.env.EVKLID_DEVICE_WARN) || 3;

export function deviceLabel(ua = "") {
  const os = /iPhone|iPad/.test(ua) ? (/iPad/.test(ua) ? "iPad" : "iPhone") : /Android/.test(ua) ? "Android" : /Windows/.test(ua) ? "Windows" : /Mac OS/.test(ua) ? "Mac" : /CrOS/.test(ua) ? "Chromebook" : /Linux/.test(ua) ? "Linux" : "Naprava";
  const br = /Edg\//.test(ua) ? "Edge" : /Firefox\//.test(ua) ? "Firefox" : /Chrome\//.test(ua) ? "Chrome" : /Safari\//.test(ua) ? "Safari" : "";
  return br ? `${os} · ${br}` : os;
}

export class Devices {
  constructor(db) {
    this.db = db;
  }

  // Vrne id naprave; ob prvem obisku nastavi dolgotrajni piškotek.
  identify(req, res) {
    let token = readCookie(req, DEVICE_COOKIE);
    if (!token || token.length < 20) {
      token = randomToken();
      const secure = req.secure ? "; Secure" : "";
      res.append("Set-Cookie", `${DEVICE_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${2 * 365 * 86400}${secure}`);
    }
    return sha256(token);
  }

  // Zabeleži uporabo profila na napravi in preveri, ali ga ima trenutno druga naprava.
  // takeover = true: ta naprava prevzame profil (stara se ustavi ob naslednji zahtevi).
  use(studentId, deviceId, label, { takeover = false, now = Date.now() } = {}) {
    const db = this.db;
    db.prepare(
      `INSERT INTO devices (id, label) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET last_seen = datetime('now'), label = excluded.label`,
    ).run(deviceId, label);
    const claim = db.prepare("SELECT device_id, last_seen FROM profile_claims WHERE student_id = ?").get(studentId);
    const free = !claim || claim.device_id === deviceId || now - claim.last_seen > CLAIM_IDLE_MS;
    if (!free && !takeover) {
      const other = db.prepare("SELECT label FROM devices WHERE id = ?").get(claim.device_id);
      return { ok: false, other: other?.label || "druga naprava" };
    }
    db.prepare(
      `INSERT INTO profile_claims (student_id, device_id, last_seen) VALUES (?, ?, ?)
       ON CONFLICT(student_id) DO UPDATE SET device_id = excluded.device_id, last_seen = excluded.last_seen`,
    ).run(studentId, deviceId, now);
    db.prepare(
      `INSERT INTO profile_devices (student_id, device_id) VALUES (?, ?)
       ON CONFLICT(student_id, device_id) DO UPDATE SET last_seen = datetime('now')`,
    ).run(studentId, deviceId);
    return { ok: true };
  }

  // Seznam naprav profila v zadnjih 30 dneh.
  recent(studentId, days = 30) {
    return this.db
      .prepare(
        `SELECT d.label, pd.first_seen, pd.last_seen FROM profile_devices pd JOIN devices d ON d.id = pd.device_id
         WHERE pd.student_id = ? AND pd.last_seen >= datetime('now', ?) ORDER BY pd.last_seen DESC`,
      )
      .all(studentId, `-${days} days`);
  }

  // Odjava profilov z vseh naprav razen te.
  releaseOthers(studentIds, deviceId) {
    const del = this.db.prepare("DELETE FROM profile_claims WHERE student_id = ? AND device_id != ?");
    for (const id of studentIds) del.run(id, deviceId);
  }

  logChange(parentId, kind, studentId) {
    this.db.prepare("INSERT INTO profile_changes (parent_id, kind, student_id) VALUES (?, ?, ?)").run(parentId, kind, studentId);
  }

  // Menjava profila: po izbrisu je dovoljen en nov profil, nato šele po 30 dneh.
  // Vrne null, če je nov profil dovoljen, sicer datum (ISO), od kdaj bo.
  swapBlockedUntil(parentId) {
    const since = `-${SWAP_DAYS} days`;
    const first = this.db
      .prepare(
        "SELECT id, created_at FROM profile_changes WHERE parent_id = ? AND kind = 'deleted' AND created_at >= datetime('now', ?) ORDER BY id LIMIT 1",
      )
      .get(parentId, since);
    if (!first) return null;
    const created = this.db
      .prepare("SELECT COUNT(*) AS n FROM profile_changes WHERE parent_id = ? AND kind = 'created' AND id > ?")
      .get(parentId, first.id).n;
    if (!created) return null;
    const firstDelete = first.created_at;
    return new Date(Date.parse(firstDelete.replace(" ", "T") + "Z") + SWAP_DAYS * 86400000).toISOString();
  }
}

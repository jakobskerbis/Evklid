import "../env.js";
// Uporaba brez registracije (gost) je odstranjena (j, 2026-10-29); ta koda ostane za stare goste in teste.
//
// Gost je račun brez e-naslova, vezan na piškotek naprave. Ima brezplačni paket; da brisanje piškotkov
// ali profila ne da nove kvote, se vprašanja na dan in mesečna poraba AI štejejo za vse goste
// z istega omrežja (zgoščen IP, pri IPv6 omrežje /64) skupaj, tudi za že izbrisane goste.
import { sha256 } from "./auth.js";
import { detachAudit } from "../dnevnik-dostopov.js";

export const GUEST_SESSION_DAYS = 365;

// Uporaba brez računa je odstranjena (j, 2026-10-29: »odstrani guest mode«): v aplikaciji je ni mogoče
// vklopiti, tudi z EVKLID_GUEST ne. Ostala koda skrbi za stare goste (ustvarijo račun in obdržijo napredek)
// in za kvote; teste vklopijo z mountAccounts(..., { guest: true }).
export function guestModeOn() {
  return false;
}

// Največ novih gostov z enega omrežja v 24 urah.
export const guestPerDay = (env = process.env) => {
  const v = Number(env.EVKLID_GUEST_PER_DAY);
  return env.EVKLID_GUEST_PER_DAY && Number.isFinite(v) ? v : 5;
};

function v6prefix(ip) {
  const [head, tail = ""] = ip.split("::");
  const h = head ? head.split(":") : [];
  const t = tail ? tail.split(":") : [];
  const full = [...h, ...Array(Math.max(0, 8 - h.length - t.length)).fill("0"), ...t];
  return full.slice(0, 4).map((x) => x.toLowerCase().padStart(4, "0")).join(":");
}

export function netKey(ip = "") {
  let s = String(ip).trim();
  if (s.startsWith("::ffff:") && s.includes(".")) s = s.slice(7);
  return s.includes(":") ? `${v6prefix(s)}::/64` : s;
}

export const guestNet = (req) => sha256(`evklid-guest-net|${netKey(req.ip || req.socket?.remoteAddress)}`);

// Gost ali nekdanji gost, ki še ni potrdil e-naslova: šteje se v kvoto omrežja.
const ON_NET = "(p.is_guest = 1 OR (p.guest_net IS NOT NULL AND p.email_verified_at IS NULL))";

export class GuestQuota {
  constructor(db) {
    this.db = db;
    // Poraba izbrisanih gostujočih profilov ostane zapisana za omrežje do konca meseca.
    db.exec(`CREATE TABLE IF NOT EXISTS guest_spent (
      id INTEGER PRIMARY KEY,
      net TEXT NOT NULL,
      day TEXT NOT NULL,
      questions INTEGER NOT NULL DEFAULT 0,
      usd REAL NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_guest_spent ON guest_spent(net, day);
    CREATE TABLE IF NOT EXISTS guest_created (
      net TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_guest_created ON guest_created(net, created_at);`);
  }

  // Omrežje gostujočega učenca ali null, če učenec ni gost.
  netOf(studentId) {
    return (
      this.db
        .prepare(`SELECT p.guest_net AS net FROM students s JOIN parents p ON p.id = s.parent_id WHERE s.id = ? AND ${ON_NET}`)
        .get(studentId)?.net || null
    );
  }

  idsOnNet(net) {
    return this.db.prepare(`SELECT s.id FROM students s JOIN parents p ON p.id = s.parent_id WHERE ${ON_NET} AND p.guest_net = ?`).all(net).map((r) => r.id);
  }

  // Novi gostje z omrežja v zadnjih 24 urah (tudi že izbrisani ali nadgrajeni).
  createdToday(net) {
    return this.db.prepare("SELECT COUNT(*) AS n FROM guest_created WHERE net = ? AND created_at >= datetime('now','-1 day')").get(net).n;
  }
  logCreated(net) {
    this.db.prepare("INSERT INTO guest_created (net) VALUES (?)").run(net);
  }

  questionsToday(ids, net) {
    // question_log (server/db.js): vprašanja ostanejo šteta tudi po izbrisu pogovora (vsi računi, tudi šolska licenca).
    const live = ids.length
      ? this.db
          .prepare(`SELECT COALESCE(SUM(n),0) AS n FROM question_log WHERE student_id IN (${ids.map(() => "?").join(",")}) AND day = date('now')`)
          .get(...ids).n
      : 0;
    const gone = net ? this.db.prepare("SELECT COALESCE(SUM(questions),0) AS n FROM guest_spent WHERE net = ? AND day = date('now')").get(net).n : 0;
    return live + gone;
  }

  monthUsd(ids, net) {
    const live = ids.length
      ? this.db
          .prepare(`SELECT COALESCE(SUM(cost_usd),0) AS usd FROM usage WHERE student_id IN (${ids.map(() => "?").join(",")}) AND created_at >= date('now','start of month')`)
          .get(...ids).usd
      : 0;
    const gone = net
      ? this.db.prepare("SELECT COALESCE(SUM(usd),0) AS usd FROM guest_spent WHERE net = ? AND day >= date('now','start of month')").get(net).usd
      : 0;
    return live + gone;
  }

  // Pred izbrisom gostujočega profila: zapiši današnja vprašanja in mesečno porabo.
  snapshot(studentId) {
    const net = this.netOf(studentId);
    if (!net) return;
    const q = this.questionsToday([studentId], null);
    const usd = this.monthUsd([studentId], null);
    if (q || usd) this.db.prepare("INSERT INTO guest_spent (net, day, questions, usd) VALUES (?, date('now'), ?, ?)").run(net, q, usd);
  }

  // Pred izbrisom pogovora: vprašanja so že v question_log (izbris pogovora jih ne briše), tu ni kaj zapisati.
  // Zapis v guest_spent bi jih štel dvakrat.
  snapshotConversation() {}

  snapshotParent(parentId) {
    for (const r of this.db.prepare("SELECT id FROM students WHERE parent_id = ?").all(parentId)) this.snapshot(r.id);
  }

  // Gostje brez veljavne seje, starejši od 30 dni, se izbrišejo (do njih ni več mogoče priti).
  cleanup() {
    const stale = this.db
      .prepare(
        `SELECT id FROM parents WHERE is_guest = 1 AND created_at < datetime('now','-30 day')
         AND NOT EXISTS (SELECT 1 FROM parent_sessions s WHERE s.parent_id = parents.id AND s.expires_at > strftime('%Y-%m-%dT%H:%M:%fZ','now'))`,
      )
      .all();
    for (const { id } of stale) {
      this.snapshotParent(id);
      this.db.prepare("DELETE FROM students WHERE parent_id = ?").run(id);
      this.db.prepare("DELETE FROM parents WHERE id = ?").run(id);
      detachAudit(this.db, id); // id se lahko ponovno uporabi: dnevnik ne sme preiti na nov račun
    }
    this.db.prepare("DELETE FROM guest_spent WHERE day < date('now','start of month','-1 month')").run();
    this.db.prepare("DELETE FROM guest_created WHERE created_at < datetime('now','-2 day')").run();
    return stale.length;
  }
}

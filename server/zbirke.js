// Zbirke znanja in učni pass (public/zbirke.js). Odklepanje je samo na strežniku: obvladane teme
// (tutor, vaje, preizkus znanja; ne »označi kot obvladano«) in XP sezone odklenejo predmete, odjemalec jih
// samo prikazuje. Vsaka podelitev ostane zapisana (tema, vir, čas); odvzem jo označi, ne izbriše.
import { KNOWLEDGE, KITEM, PASS, PASS_REWARDS, RARITY_TIER, baseId, seasonOf, topicTier } from "../public/zbirke.js";
import { getTopic, getPath, baseTopicIds } from "./curriculum.js";

export const SHOWCASE_MAX = 3;

export function ensureKnowledgeTables(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS knowledge_items (
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      item TEXT NOT NULL,                 -- id predmeta; sezonski s pripono, npr. pass_coat~2026-1
      topic_id TEXT,                      -- tema, ki je predmet prinesla (ali NULL pri passu in kompletih)
      source TEXT,                        -- practice | chat | placement | pass | set
      earned_at TEXT NOT NULL DEFAULT (datetime('now')),
      revoked_at TEXT,                    -- odvzem (npr. goljufanje): zgodovina ostane
      revoke_reason TEXT,
      PRIMARY KEY (student_id, item)
    );
    CREATE TABLE IF NOT EXISTS showcase (
      student_id INTEGER PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
      items TEXT NOT NULL
    );
  `);
}

const nowSql = () => new Date().toISOString().replace("T", " ").slice(0, 19);

// Obvladana tema z vsem, kar pogoji potrebujejo (enkrat na sync, ne za vsak predmet).
function topicInfo(m) {
  const t = getTopic(m.topic_id);
  const path = t && getPath(t.path);
  return { ...m, t, ids: new Set([m.topic_id, ...baseTopicIds(m.topic_id)]), tier: topicTier(path), school: path?.school };
}
// Ali obvladana tema izpolni pogoj predmeta.
function topicMatches(item, m) {
  if (item.need.t?.some((id) => m.ids.has(id))) return true;
  if (!m.t || !item.need.kw || m.t.subject !== subjectOf(item)) return false;
  return m.tier >= RARITY_TIER[item.rarity] && KW.get(item.id).test(m.t.name);
}
const KW = new Map(KNOWLEDGE.filter((x) => x.need?.kw).map((x) => [x.id, new RegExp(x.need.kw, "i")]));
const SUBJECT = { pse: "KEM", fiz: "FIZ", krivulje: "MAT" };
const subjectOf = (item) => SUBJECT[item.collection];

export class Knowledge {
  constructor(db) {
    this.db = db;
    ensureKnowledgeTables(db);
  }

  rows(id) {
    return this.db.prepare("SELECT item, topic_id, source, earned_at, revoked_at FROM knowledge_items WHERE student_id = ?").all(id);
  }
  owned(id) {
    return this.rows(id).filter((r) => !r.revoked_at).map((r) => r.item);
  }

  // XP sezone za učni pass: brez XP iz iger (te prinesejo kovance), največ PASS.dayCap na dan.
  passXp(id, season = seasonOf()) {
    const days = this.db
      .prepare(
        `SELECT date(created_at) AS d, SUM(amount) AS s FROM xp_events
         WHERE student_id = ? AND amount > 0 AND reason NOT LIKE 'igra:%' AND created_at >= ? AND created_at < ?
         GROUP BY d`,
      )
      .all(id, season.from, season.to);
    return days.reduce((sum, r) => sum + Math.min(PASS.dayCap, r.s), 0);
  }
  pass(id, season = seasonOf()) {
    const xp = this.passXp(id, season);
    const tier = Math.min(PASS.tiers, Math.floor(xp / PASS.perTier));
    return { season: season.key, from: season.from, to: season.to, xp, tier, tiers: PASS.tiers, perTier: PASS.perTier, dayCap: PASS.dayCap, rewards: PASS_REWARDS };
  }

  // Ovrednoti pravila in zapiše nove predmete; vrne nove id-je.
  sync(id) {
    const have = new Map(this.rows(id).map((r) => [r.item, r]));
    const add = [];
    const grant = (item, topic = null, source = null) => {
      if (have.has(item)) return;
      have.set(item, { item });
      add.push([item, topic, source]);
    };
    // Teme beremo samo, če kak predmet za temo še manjka (sync teče ob vsakem pravilnem odgovoru).
    const need = KNOWLEDGE.some((x) => !have.has(x.id) && (x.need?.t || x.need?.kw || x.need?.tek));
    const sql = `SELECT topic_id, source FROM topic_state
      WHERE student_id = ? AND status = 'mastered' AND COALESCE(source, '') <> 'manual' ORDER BY mastered_at, topic_id`;
    const mastered = need ? this.db.prepare(sql).all(id).map(topicInfo) : [];
    for (const x of KNOWLEDGE) {
      if (have.has(x.id)) continue;
      if (x.need?.t || x.need?.kw) {
        const hit = mastered.find((m) => topicMatches(x, m));
        if (hit) grant(x.id, hit.topic_id, hit.source || "practice");
      } else if (x.need?.tek) {
        const tek = mastered.filter((m) => m.school === "TEK");
        const chat = tek.find((m) => m.source === "chat");
        if (tek.length >= x.need.tek && (!x.need.chat || chat)) grant(x.id, chat?.topic_id || tek[0].topic_id, "chat");
      }
    }
    // Pot znanja: skupni XP (kot ga učenec vidi ob zvezdici).
    const xpItems = KNOWLEDGE.filter((x) => x.need?.xp && !have.has(x.id));
    if (xpItems.length) {
      const total = this.xpTotal(id);
      for (const x of xpItems) if (total >= x.need.xp) grant(x.id, null, "xp");
    }
    // Liki iz iger: pravilni odgovori v igrah ali različne uspešno končane igre.
    const gameItems = KNOWLEDGE.filter((x) => (x.need?.games || x.need?.cleared) && !have.has(x.id));
    if (gameItems.length) {
      const g = this.gameStats(id);
      for (const x of gameItems) if ((x.need.games && g.correct >= x.need.games) || (x.need.cleared && g.cleared >= x.need.cleared)) grant(x.id, null, "games");
    }
    // Kompleti: dovolj predmetov iste zbirke (brez kompletov).
    for (const x of KNOWLEDGE.filter((k) => k.set)) {
      const n = [...have.keys()].filter((i) => {
        const k = KITEM[baseId(i)];
        return k && k.collection === x.collection && !k.set && !have.get(i).revoked_at;
      }).length;
      if (n >= x.need.own) grant(x.id, null, "set");
    }
    // Učni pass te in prejšnje sezone (XP zadnjih dni sezone se pretvori v nagrade tudi po njenem koncu).
    const now = seasonOf();
    for (const season of [now, seasonOf(new Date(Date.parse(`${now.from}T00:00:00Z`) - 86400000))]) {
      const p = this.pass(id, season);
      for (const r of PASS_REWARDS) if (p.tier >= r.tier) grant(`${r.id}~${p.season}`, null, "pass");
    }
    if (add.length) {
      const ins = this.db.prepare("INSERT OR IGNORE INTO knowledge_items (student_id, item, topic_id, source, earned_at) VALUES (?, ?, ?, ?, ?)");
      const at = nowSql();
      for (const [item, topic, source] of add) ins.run(id, item, topic, source, at);
    }
    return add.map(([item]) => item);
  }

  // Pravilni odgovori v vseh igrah in število različnih uspešno končanih iger (server/games.js).
  gameStats(id) {
    try {
      const r = this.db.prepare("SELECT COALESCE(SUM(correct),0) AS correct, COALESCE(SUM(cleared),0) AS cleared FROM game_scores WHERE student_id = ?").get(id);
      return { correct: r.correct, cleared: r.cleared };
    } catch {
      return { correct: 0, cleared: 0 }; // brez tabele iger
    }
  }

  xpTotal(id) {
    return this.db.prepare("SELECT COALESCE(SUM(amount),0) AS s FROM xp_events WHERE student_id = ?").get(id).s;
  }

  // Odvzem (npr. sumljiv dosežek): predmet izgine iz inventarja, zapis ostane.
  // Shranjen avatar ga izgubi tudi za druge (lige berejo shranjen avatar brez preverjanja lastništva).
  revoke(id, item, reason) {
    const ok = this.db.prepare("UPDATE knowledge_items SET revoked_at = ?, revoke_reason = ? WHERE student_id = ? AND item = ? AND revoked_at IS NULL").run(nowSql(), String(reason || ""), id, item).changes > 0;
    try {
      const r = ok && this.db.prepare("SELECT equipped FROM avatar_state WHERE student_id = ?").get(id);
      if (r?.equipped.includes(`"${item}"`)) {
        const eq = Object.fromEntries(Object.entries(JSON.parse(r.equipped)).filter(([, v]) => v !== item).map(([k, v]) => [k, Array.isArray(v) ? v.filter((i) => i !== item) : v]));
        this.db.prepare("UPDATE avatar_state SET equipped = ? WHERE student_id = ?").run(JSON.stringify(eq), id);
      }
    } catch {} // brez tabele avatarja ali s pokvarjenim zapisom ni česa sneti
    return ok;
  }

  showcase(id) {
    const r = this.db.prepare("SELECT items FROM showcase WHERE student_id = ?").get(id);
    let list = [];
    try {
      list = JSON.parse(r?.items || "[]");
    } catch {}
    const own = new Set(this.owned(id));
    return list.filter((i) => own.has(i)).slice(0, SHOWCASE_MAX);
  }
  setShowcase(id, items) {
    const own = new Set(this.owned(id));
    const clean = [...new Set((Array.isArray(items) ? items : []).map(String))].filter((i) => own.has(i)).slice(0, SHOWCASE_MAX);
    this.db.prepare("INSERT INTO showcase (student_id, items) VALUES (?, ?) ON CONFLICT(student_id) DO UPDATE SET items = excluded.items").run(id, JSON.stringify(clean));
    return clean;
  }

  // Ime teme in učne poti (predmet, letnik), ki je prinesla predmet; tudi za vitrino v razredu (server/vitrina.js).
  topicLabel(topicId) {
    const t = getTopic(topicId);
    return t ? { name: t.name, path: getPath(t.path)?.label || "" } : null;
  }

  view(id) {
    const fresh = this.sync(id);
    const items = this.rows(id)
      .filter((r) => !r.revoked_at)
      .map((r) => {
        const topic = r.topic_id ? this.topicLabel(r.topic_id) : null;
        return { id: r.item, at: r.earned_at, source: r.source, topic: topic && { id: r.topic_id, ...topic } };
      });
    // Zgled teme za pogoj vsakega zaklenjenega predmeta (ime in pot), da so pogoji vnaprej vidni.
    const hints = {};
    for (const x of KNOWLEDGE) {
      const ex = x.need?.t?.[0] && getTopic(x.need.t[0]);
      if (ex) hints[x.id] = { name: ex.name, path: getPath(ex.path)?.label || "", id: x.need.t[0] };
    }
    return { items, fresh, hints, xp: this.xpTotal(id), games: this.gameStats(id), pass: this.pass(id), showcase: this.showcase(id), showcaseMax: SHOWCASE_MAX };
  }
}

export function mountKnowledge(app, knowledge, { loadStudent, avatars }) {
  const full = (id) => ({ ...knowledge.view(id), avatar: avatars.view(id) });
  app.get("/api/students/:id/zbirke", (req, res) => {
    const s = loadStudent(req, res);
    if (s) res.json(full(s.id));
  });
  app.post("/api/students/:id/zbirke/vitrina", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    if (!Array.isArray(req.body?.items)) return res.status(400).json({ error: "Neveljavna vitrina." });
    knowledge.setShowcase(s.id, req.body.items);
    res.json(full(s.id));
  });
}

// Tedenske lige in razredne/prijateljske lestvice.
//
// Lige: vsak teden se učenci, ki so zbrali vsaj nekaj XP, razvrstijo v skupine
// do 30 učencev na isti stopnji lige (Bronasta … Diamantna) in iste šolske
// stopnje (OŠ/SŠ). Ob koncu tedna najboljši napredujejo, najslabši izpadejo,
// naslednji teden pa začnejo v novi skupini od 0 XP. Zaključevanje teče
// »leno« (ob prvem ogledu v novem tednu), zato ne potrebujemo časovnika.
//
// Razredi: učitelj ustvari razred in dobi kodo (npr. KXT-4P9) ter skrivni
// ključ za upravljanje. Učenci se pridružijo s kodo. Prijatelji lahko na enak
// način ustvarijo svojo skupino.
//
// Zasebnost (uporabniki so mladoletni): drugim se prikazuje samo vzdevek, ki ga
// učenec izbere med predlogi (pridevnik + žival + številka). Prostega vnosa ni,
// zato vzdevek ne more vsebovati pravega imena.
import "./env.js";
import crypto from "node:crypto";
import { stageCode, stageCodeSql } from "../public/stopnja.js";
import { ensureAvatarTables, publicAvatar } from "./avatar.js";
import { AWARD_MIN } from "../public/zbirke.js";
import { nameHasContact, NAME_CONTACT_ERROR } from "../public/ime-skupine.js";

export const TIERS = ["Bronasta", "Srebrna", "Zlata", "Safirna", "Rubinasta", "Smaragdna", "Diamantna"];
export const LEAGUE = {
  groupSize: 30, // največ učencev v skupini
  promote: (n) => Math.min(7, Math.ceil(n * 0.2)), // napredujejo
  demote: (n) => (n >= 10 ? Math.min(5, Math.floor(n * 0.15)) : 0), // izpadejo
  maxGroupsPerStudent: 5,
  classSize: 40,
  friendsSize: 30,
  maxFailedJoins: 10, // na uro, proti ugibanju kod
};

const ADJ = ["Hitri", "Bistri", "Tihi", "Pogumni", "Modri", "Zvedavi", "Iskrivi", "Veseli", "Drzni", "Zlati", "Srebrni", "Spretni", "Mirni", "Žareči", "Nebesni", "Vztrajni"];
const ANIMALS = ["Ris", "Sokol", "Delfin", "Medved", "Lisjak", "Volk", "Jež", "Orel", "Tiger", "Pingvin", "Bober", "Kit", "Gepard", "Zmaj", "Jelen", "Kozorog"];
const NICK_RE = new RegExp(`^(${ADJ.join("|")}) (${ANIMALS.join("|")}) ([1-9][0-9]?)$`);

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // brez 0/O in 1/I
const pick = (arr) => arr[crypto.randomInt(arr.length)];

export function randomNickname() {
  return `${pick(ADJ)} ${pick(ANIMALS)} ${crypto.randomInt(1, 100)}`;
}
export const isValidNickname = (s) => typeof s === "string" && NICK_RE.test(s);

export function normalizeCode(input) {
  const c = (typeof input === "string" || typeof input === "number" ? String(input) : "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  return c.length === 6 ? c : null;
}
export const formatCode = (c) => `${c.slice(0, 3)}-${c.slice(3)}`;
const hashKey = (k) => crypto.createHash("sha256").update(String(k)).digest("hex");

// Ponedeljek tedna (UTC) kot "YYYY-MM-DD"; enako kot tedenski XP v progress.js.
export function weekId(date = new Date()) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.toISOString().slice(0, 10);
}
const weekBounds = (week) => {
  const end = new Date(`${week}T00:00:00Z`);
  end.setUTCDate(end.getUTCDate() + 7);
  return [`${week} 00:00:00`, end.toISOString().slice(0, 10) + " 00:00:00"];
};
// Mesec (UTC) kot "YYYY-MM" in njegove meje.
export const monthId = (date = new Date()) => date.toISOString().slice(0, 7);
const monthBounds = (month) => {
  const [y, m] = month.split("-").map(Number);
  return [`${month}-01 00:00:00`, new Date(Date.UTC(y, m, 1)).toISOString().slice(0, 10) + " 00:00:00"];
};
const prevMonth = (month) => {
  const [y, m] = month.split("-").map(Number);
  return new Date(Date.UTC(y, m - 2, 1)).toISOString().slice(0, 7);
};
// Zmage na lestvicah prinesejo posebne značke (public/zbirke.js, zbirka »lige«), ki se ne kupijo.
// Zmaga šteje, ko je na lestvici vsaj AWARD_MIN učencev z XP.
export { AWARD_MIN };
export const MONTH_BOARD = 30; // prikazanih na mesečni lestvici
const stageOf = (student) => stageCode(student);
// Isto v SQL (nastavitve so shranjene normalizirane, server/db.js), da mesečna lestvica ne bere učenca po učenca.
const STAGE_SQL = stageCodeSql("s.settings");

export class Leagues {
  constructor(store, { now = () => new Date() } = {}) {
    this.store = store;
    this.db = store.db;
    this.now = now;
    this.failedJoins = new Map(); // studentId -> [časi]
    ensureAvatarTables(this.db);
    this.avatarOf = this.db.prepare("SELECT equipped FROM avatar_state WHERE student_id = ?");
    // Tedenski in mesečni razpon po času (idx_xp je po učencu): pokriven indeks za sync() in mesečno lestvico.
    this.db.exec("CREATE INDEX IF NOT EXISTS idx_xp_time ON xp_events(created_at, student_id, amount)");
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS league_profiles (
        student_id INTEGER PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
        nickname TEXT NOT NULL,
        tier INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS league_groups (
        id INTEGER PRIMARY KEY,
        week TEXT NOT NULL,          -- ponedeljek tedna
        tier INTEGER NOT NULL,
        stage TEXT NOT NULL,         -- OS | SS | UNI
        finalized INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE INDEX IF NOT EXISTS idx_league_groups ON league_groups(week, tier, stage);
      CREATE TABLE IF NOT EXISTS league_members (
        group_id INTEGER NOT NULL REFERENCES league_groups(id) ON DELETE CASCADE,
        student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        week TEXT NOT NULL,
        final_rank INTEGER,
        final_xp INTEGER,
        outcome TEXT,                -- up | down | stay
        PRIMARY KEY (group_id, student_id),
        UNIQUE (student_id, week)
      );
      CREATE TABLE IF NOT EXISTS league_month_awards (
        month TEXT NOT NULL,         -- "YYYY-MM", podeljeno ob prvem ogledu v naslednjem mesecu
        stage TEXT NOT NULL,
        PRIMARY KEY (month, stage)
      );
      CREATE TABLE IF NOT EXISTS classes (
        id INTEGER PRIMARY KEY,
        code TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        kind TEXT NOT NULL CHECK (kind IN ('class','friends')),
        teacher_key_hash TEXT,       -- samo pri razredih
        owner_student_id INTEGER REFERENCES students(id) ON DELETE CASCADE, -- samo pri prijateljih
        owner_parent_id INTEGER,     -- učiteljev račun (če so računi vklopljeni)
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS class_members (
        class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
        student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        joined_at TEXT NOT NULL DEFAULT (datetime('now')),
        PRIMARY KEY (class_id, student_id)
      );
    `);
    const cols = this.db.prepare("PRAGMA table_info(classes)").all().map((c) => c.name);
    if (!cols.includes("owner_parent_id")) this.db.exec("ALTER TABLE classes ADD COLUMN owner_parent_id INTEGER");
  }

  week() {
    return weekId(this.now());
  }

  // ---------- vzdevki ----------
  profile(studentId) {
    let p = this.db.prepare("SELECT * FROM league_profiles WHERE student_id = ?").get(studentId);
    if (!p) {
      this.db.prepare("INSERT INTO league_profiles (student_id, nickname) VALUES (?, ?)").run(studentId, randomNickname());
      p = this.db.prepare("SELECT * FROM league_profiles WHERE student_id = ?").get(studentId);
    }
    return p;
  }
  nicknameOptions(n = 6) {
    const set = new Set();
    while (set.size < n) set.add(randomNickname());
    return [...set];
  }
  setNickname(studentId, nickname) {
    if (!isValidNickname(nickname)) return false;
    this.profile(studentId);
    this.db.prepare("UPDATE league_profiles SET nickname = ? WHERE student_id = ?").run(nickname, studentId);
    return true;
  }

  // ---------- XP ----------
  weekXp(studentIds, week) {
    return this.xpBetween(studentIds, ...weekBounds(week));
  }
  monthXp(studentIds, month) {
    return this.xpBetween(studentIds, ...monthBounds(month));
  }
  xpBetween(studentIds, from, to) {
    if (!studentIds.length) return new Map();
    const rows = this.db
      .prepare(
        `SELECT student_id, COALESCE(SUM(amount),0) AS xp FROM xp_events
         WHERE student_id IN (${studentIds.map(() => "?").join(",")}) AND created_at >= ? AND created_at < ?
         GROUP BY student_id`,
      )
      .all(...studentIds, from, to);
    const out = new Map(studentIds.map((id) => [id, 0]));
    for (const r of rows) out.set(r.student_id, r.xp);
    return out;
  }

  // ---------- lige ----------
  // Zaključi pretekle tedne in razvrsti vse aktivne učence tega tedna.
  sync() {
    const week = this.week();
    this.db.exec("BEGIN IMMEDIATE");
    try {
      for (const g of this.db.prepare("SELECT * FROM league_groups WHERE finalized = 0 AND week < ? ORDER BY week, id").all(week)) {
        this.finalizeGroup(g);
      }
      const [from, to] = weekBounds(week);
      const active = this.db
        .prepare(
          `SELECT DISTINCT x.student_id AS id FROM xp_events x
           WHERE x.created_at >= ? AND x.created_at < ? AND x.amount > 0
             AND NOT EXISTS (SELECT 1 FROM league_members m WHERE m.student_id = x.student_id AND m.week = ?)
           ORDER BY x.student_id`,
        )
        .all(from, to, week);
      for (const { id } of active) this.place(id, week);
      this.awardMonth(prevMonth(monthId(this.now())));
      this.db.exec("COMMIT");
    } catch (err) {
      this.db.exec("ROLLBACK");
      throw err;
    }
  }

  place(studentId, week) {
    const student = this.store.getStudent(studentId);
    if (!student) return;
    const { tier } = this.profile(studentId);
    const stage = stageOf(student);
    let group = this.db
      .prepare(
        `SELECT g.id FROM league_groups g
         WHERE g.week = ? AND g.tier = ? AND g.stage = ?
           AND (SELECT COUNT(*) FROM league_members m WHERE m.group_id = g.id) < ?
         ORDER BY g.id LIMIT 1`,
      )
      .get(week, tier, stage, LEAGUE.groupSize);
    if (!group) {
      const r = this.db.prepare("INSERT INTO league_groups (week, tier, stage) VALUES (?, ?, ?)").run(week, tier, stage);
      group = { id: Number(r.lastInsertRowid) };
    }
    this.db.prepare("INSERT OR IGNORE INTO league_members (group_id, student_id, week) VALUES (?, ?, ?)").run(group.id, studentId, week);
  }

  finalizeGroup(g) {
    const ranked = this.ranking(g.id, g.week);
    const n = ranked.length;
    const up = g.tier < TIERS.length - 1 ? LEAGUE.promote(n) : 0;
    const down = g.tier > 0 ? LEAGUE.demote(n) : 0;
    const setMember = this.db.prepare("UPDATE league_members SET final_rank = ?, final_xp = ?, outcome = ? WHERE group_id = ? AND student_id = ?");
    const setTier = this.db.prepare("UPDATE league_profiles SET tier = ? WHERE student_id = ?");
    ranked.forEach((m, i) => {
      const outcome = i < up ? "up" : i >= n - down ? "down" : "stay";
      setMember.run(i + 1, m.xp, outcome, g.id, m.student_id);
      if (outcome !== "stay") setTier.run(g.tier + (outcome === "up" ? 1 : -1), m.student_id);
    });
    // Značke: zmaga v skupini (po ligi) in stopničke (1.–3. mesto).
    if (ranked.filter((m) => m.xp > 0).length >= AWARD_MIN) {
      this.grant(ranked[0].student_id, `win_week_${g.tier}`);
      for (const m of ranked.slice(0, 3)) if (m.xp > 0) this.grant(m.student_id, "win_week_podium");
    }
    this.db.prepare("UPDATE league_groups SET finalized = 1 WHERE id = ?").run(g.id);
  }

  grant(studentId, item) {
    this.db.prepare("INSERT OR IGNORE INTO knowledge_items (student_id, item, topic_id, source) VALUES (?, ?, NULL, 'league')").run(studentId, item);
  }

  // Mesečna lestvica šolske stopnje: vsi z vzdevkom in XP v mesecu.
  monthRanking(stage, month) {
    const [from, to] = monthBounds(month);
    return this.db
      .prepare(
        `SELECT x.student_id, p.nickname, SUM(x.amount) AS xp, MIN(x.created_at) AS first FROM xp_events x
         JOIN league_profiles p ON p.student_id = x.student_id
         JOIN students s ON s.id = x.student_id
         WHERE x.created_at >= ? AND x.created_at < ? AND ${STAGE_SQL} = ?
         GROUP BY x.student_id HAVING xp > 0 ORDER BY xp DESC, first, x.student_id`,
      )
      .all(from, to, stage);
  }
  // Zaključi pretekli mesec (enkrat na stopnjo): zmagovalec in stopničke dobijo značko.
  awardMonth(month) {
    for (const stage of ["OS", "SS", "UNI"]) {
      if (this.db.prepare("SELECT 1 FROM league_month_awards WHERE month = ? AND stage = ?").get(month, stage)) continue;
      const ranked = this.monthRanking(stage, month);
      if (ranked.length >= AWARD_MIN) {
        this.grant(ranked[0].student_id, "win_month");
        for (const m of ranked.slice(0, 3)) this.grant(m.student_id, "win_month_podium");
      }
      this.db.prepare("INSERT INTO league_month_awards (month, stage) VALUES (?, ?)").run(month, stage);
    }
  }
  monthView(studentId) {
    // Brez sync(): pot /league ga že kliče v leagueView (en zapisovalni BEGIN IMMEDIATE na ogled).
    const student = this.store.getStudent(studentId);
    const month = monthId(this.now());
    const [, end] = monthBounds(month);
    const row = (m, i) => ({ rank: i + 1, nickname: m.nickname, avatar: publicAvatar(this.avatarOf.get(m.student_id)?.equipped), xp: m.xp, me: m.student_id === studentId });
    const ranked = student ? this.monthRanking(stageOf(student), month) : [];
    const mine = ranked.findIndex((m) => m.student_id === studentId);
    return {
      month,
      endsAt: end.replace(" ", "T") + "Z",
      count: ranked.length,
      awardMin: AWARD_MIN,
      board: ranked.slice(0, MONTH_BOARD).map(row),
      me: mine >= MONTH_BOARD ? row(ranked[mine], mine) : null,
    };
  }
  // Značke za zmage, ki jih ima učenec (za prikaz ob ligi).
  awards(studentId) {
    return this.db.prepare("SELECT item FROM knowledge_items WHERE student_id = ? AND source = 'league' AND revoked_at IS NULL ORDER BY earned_at DESC, item").all(studentId).map((r) => r.item);
  }

  // Razvrstitev skupine: več XP najprej, pri izenačenju tisti, ki se je pridružil prej.
  ranking(groupId, week) {
    const members = this.db
      .prepare(
        `SELECT m.student_id, p.nickname FROM league_members m JOIN league_profiles p ON p.student_id = m.student_id
         WHERE m.group_id = ? ORDER BY m.rowid`,
      )
      .all(groupId);
    const xp = this.weekXp(members.map((m) => m.student_id), week);
    return members
      .map((m, order) => ({ ...m, xp: xp.get(m.student_id) || 0, order }))
      .sort((a, b) => b.xp - a.xp || a.order - b.order);
  }

  // Pogled za učenca: njegova skupina tega tedna in izid prejšnjega tedna.
  leagueView(studentId) {
    this.sync();
    const profile = this.profile(studentId);
    const week = this.week();
    const [, end] = weekBounds(week);
    const last = this.db
      .prepare(
        `SELECT m.final_rank, m.outcome, m.week, g.tier, (SELECT COUNT(*) FROM league_members x WHERE x.group_id = m.group_id AND x.final_xp > 0) AS n
         FROM league_members m JOIN league_groups g ON g.id = m.group_id
         WHERE m.student_id = ? AND m.week < ? AND m.outcome IS NOT NULL ORDER BY m.week DESC LIMIT 1`,
      )
      .get(studentId, week);
    const awards = this.awards(studentId);
    // Značka samo za pretekli teden in samo, če je res podeljena (skupine, zaključene pred uvedbo značk, je niso dale).
    const prevWeek = weekId(new Date(this.now().getTime() - 7 * 86400000));
    let won = last && last.week === prevWeek && last.n >= AWARD_MIN && last.final_rank <= 3 ? (last.final_rank === 1 ? `win_week_${last.tier}` : "win_week_podium") : null;
    if (won && !awards.includes(won)) won = null;
    const base = {
      nickname: profile.nickname,
      tier: profile.tier,
      tierName: TIERS[profile.tier],
      tiers: TIERS,
      week,
      endsAt: end.replace(" ", "T") + "Z",
      lastWeek: last ? { rank: last.final_rank, outcome: last.outcome, week: last.week, award: won } : null,
      avatar: publicAvatar(this.avatarOf.get(studentId)?.equipped),
      awards,
    };
    const mine = this.db
      .prepare("SELECT g.* FROM league_members m JOIN league_groups g ON g.id = m.group_id WHERE m.student_id = ? AND m.week = ?")
      .get(studentId, week);
    if (!mine) return { ...base, joined: false };
    const ranked = this.ranking(mine.id, week);
    const n = ranked.length;
    const up = mine.tier < TIERS.length - 1 ? LEAGUE.promote(n) : 0;
    const down = mine.tier > 0 ? LEAGUE.demote(n) : 0;
    return {
      ...base,
      joined: true,
      promoteCount: up,
      demoteCount: down,
      board: ranked.map((m, i) => ({
        rank: i + 1,
        nickname: m.nickname,
        avatar: publicAvatar(this.avatarOf.get(m.student_id)?.equipped), // edino, kar si učenec izbere
        xp: m.xp,
        me: m.student_id === studentId,
        zone: i < up ? "up" : i >= n - down ? "down" : "stay",
      })),
    };
  }

  // ---------- razredi in skupine prijateljev ----------
  newCode() {
    for (;;) {
      const c = Array.from({ length: 6 }, () => pick(CODE_CHARS)).join("");
      if (!this.db.prepare("SELECT 1 FROM classes WHERE code = ?").get(c)) return c;
    }
  }

  createClass(name, ownerParentId = null) {
    const code = this.newCode();
    const key = crypto.randomBytes(18).toString("base64url");
    const r = this.db
      .prepare("INSERT INTO classes (code, name, kind, teacher_key_hash, owner_parent_id) VALUES (?, ?, 'class', ?, ?)")
      .run(code, name, hashKey(key), ownerParentId);
    return { id: Number(r.lastInsertRowid), code: formatCode(code), name, kind: "class", teacherKey: key };
  }

  createFriendsGroup(studentId, name) {
    if (this.memberships(studentId).length >= LEAGUE.maxGroupsPerStudent) return { error: `Si že v ${LEAGUE.maxGroupsPerStudent} skupinah.` };
    const code = this.newCode();
    const r = this.db.prepare("INSERT INTO classes (code, name, kind, owner_student_id) VALUES (?, ?, 'friends', ?)").run(code, name, studentId);
    const id = Number(r.lastInsertRowid);
    this.db.prepare("INSERT INTO class_members (class_id, student_id) VALUES (?, ?)").run(id, studentId);
    return { id, code: formatCode(code), name, kind: "friends" };
  }

  getByCode(code) {
    const c = normalizeCode(code);
    return c ? this.db.prepare("SELECT * FROM classes WHERE code = ?").get(c) : null;
  }

  // Vrne razred, če se ključ ujema ali je prijavljen učitelj, ki ga je ustvaril.
  authTeacher(code, key, parentId = null) {
    const cls = this.getByCode(code);
    if (!cls || cls.kind !== "class") return null;
    if (parentId && cls.owner_parent_id === parentId) return cls;
    if (!key) return null;
    const a = Buffer.from(cls.teacher_key_hash, "hex");
    const b = Buffer.from(hashKey(key), "hex");
    return crypto.timingSafeEqual(a, b) ? cls : null;
  }

  join(studentId, code) {
    const now = this.now().getTime();
    const recent = (this.failedJoins.get(studentId) || []).filter((t) => now - t < 3600_000);
    if (recent.length >= LEAGUE.maxFailedJoins) return { error: "Preveč napačnih poskusov. Poskusi znova čez eno uro.", status: 429 };
    const cls = this.getByCode(code);
    if (!cls) {
      recent.push(now);
      this.failedJoins.set(studentId, recent);
      return { error: "Koda ne obstaja. Preveri jo pri učitelju ali prijatelju.", status: 404 };
    }
    if (this.db.prepare("SELECT 1 FROM class_members WHERE class_id = ? AND student_id = ?").get(cls.id, studentId)) {
      return { ok: true, already: true, class: this.publicClass(cls) };
    }
    if (this.memberships(studentId).length >= LEAGUE.maxGroupsPerStudent) return { error: `Si že v ${LEAGUE.maxGroupsPerStudent} skupinah.`, status: 400 };
    const size = this.db.prepare("SELECT COUNT(*) AS n FROM class_members WHERE class_id = ?").get(cls.id).n;
    if (size >= (cls.kind === "class" ? LEAGUE.classSize : LEAGUE.friendsSize)) return { error: "Skupina je polna.", status: 400 };
    this.db.prepare("INSERT INTO class_members (class_id, student_id) VALUES (?, ?)").run(cls.id, studentId);
    this.profile(studentId);
    return { ok: true, class: this.publicClass(cls) };
  }

  leave(studentId, classId) {
    const ok = this.db.prepare("DELETE FROM class_members WHERE class_id = ? AND student_id = ?").run(classId, studentId).changes > 0;
    // Prazno skupino prijateljev pobrišemo.
    this.db.prepare("DELETE FROM classes WHERE id = ? AND kind = 'friends' AND NOT EXISTS (SELECT 1 FROM class_members WHERE class_id = ?)").run(classId, classId);
    return ok;
  }

  memberships(studentId) {
    return this.db
      .prepare("SELECT c.* FROM class_members m JOIN classes c ON c.id = m.class_id WHERE m.student_id = ? ORDER BY m.joined_at, c.id")
      .all(studentId);
  }

  publicClass(cls) {
    return { id: cls.id, name: cls.name, kind: cls.kind, code: formatCode(cls.code) };
  }

  // Tedenska lestvica razreda/skupine (samo vzdevki).
  classBoard(classId, viewerId = null) {
    const members = this.db
      .prepare(
        `SELECT m.student_id, p.nickname, m.joined_at FROM class_members m
         JOIN league_profiles p ON p.student_id = m.student_id WHERE m.class_id = ? ORDER BY m.joined_at, m.student_id`,
      )
      .all(classId);
    const ids = members.map((m) => m.student_id);
    const week = this.weekXp(ids, this.week());
    const month = this.monthXp(ids, monthId(this.now()));
    const total = new Map(
      ids.length
        ? this.db
            .prepare(`SELECT student_id, SUM(amount) AS xp FROM xp_events WHERE student_id IN (${ids.map(() => "?").join(",")}) GROUP BY student_id`)
            .all(...ids)
            .map((r) => [r.student_id, r.xp])
        : [],
    );
    return members
      .map((m, order) => ({ id: m.student_id, nickname: m.nickname, xp: week.get(m.student_id) || 0, month: month.get(m.student_id) || 0, total: total.get(m.student_id) || 0, order }))
      .sort((a, b) => b.xp - a.xp || a.order - b.order)
      .map((m, i) => ({ rank: i + 1, nickname: m.nickname, avatar: publicAvatar(this.avatarOf.get(m.id)?.equipped), xp: m.xp, month: m.month, total: m.total, me: m.id === viewerId, _id: m.id }));
  }

  classesView(studentId) {
    this.profile(studentId);
    return this.memberships(studentId).map((c) => ({
      ...this.publicClass(c),
      owner: c.owner_student_id === studentId,
      board: this.classBoard(c.id, studentId).map(({ _id, ...m }) => m),
    }));
  }

  teacherView(cls) {
    return {
      ...this.publicClass(cls),
      week: this.week(),
      members: this.classBoard(cls.id).map(({ _id, me, ...m }) => ({ ...m, ref: _id })),
    };
  }

  // Razredi prijavljenega učitelja (brez ključev; dostop gre prek računa).
  teacherClasses(parentId) {
    return this.db.prepare("SELECT * FROM classes WHERE kind = 'class' AND owner_parent_id = ? ORDER BY id").all(parentId).map((c) => this.publicClass(c));
  }

  removeMember(classId, studentId) {
    return this.db.prepare("DELETE FROM class_members WHERE class_id = ? AND student_id = ?").run(classId, studentId).changes > 0;
  }
  deleteClass(classId) {
    return this.db.prepare("DELETE FROM classes WHERE id = ?").run(classId).changes > 0;
  }
}

// HTTP poti. `loadStudent(req, res)` vrne učenca ali odgovori s 404.
// Pri vklopljenih računih (EVKLID_ACCOUNTS=1) so vse poti za prijavo in
// preverjanjem lastništva učenca; `req.parent` je prijavljeni račun.
export function mountLeagues(app, store, { loadStudent }) {
  const leagues = new Leagues(store);
  const cleanName = (v) => (typeof v === "string" ? v.replace(/[\r\n\t]+/g, " ").replace(/\s{2,}/g, " ").trim().slice(0, 40) : "");
  const teacher = (req, res) => {
    const cls = leagues.authTeacher(req.params.code, req.get("x-teacher-key"), req.parent?.id ?? null);
    if (!cls) res.status(403).json({ error: "Napačna koda ali ključ razreda." });
    return cls;
  };

  // --- učenec ---
  app.get("/api/students/:id/league", (req, res) => {
    const s = loadStudent(req, res);
    if (s) res.json({ league: leagues.leagueView(s.id), month: leagues.monthView(s.id), classes: leagues.classesView(s.id) });
  });
  app.get("/api/students/:id/nickname-options", (req, res) => {
    const s = loadStudent(req, res);
    if (s) res.json(leagues.nicknameOptions());
  });
  app.put("/api/students/:id/nickname", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    if (!leagues.setNickname(s.id, req.body?.nickname)) return res.status(400).json({ error: "Izberi enega od predlaganih vzdevkov." });
    res.json({ nickname: req.body.nickname });
  });
  app.post("/api/students/:id/classes", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const out = leagues.join(s.id, req.body?.code);
    if (out.error) return res.status(out.status || 400).json({ error: out.error });
    res.status(out.already ? 200 : 201).json(out);
  });
  app.post("/api/students/:id/friend-groups", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const name = cleanName(req.body?.name);
    if (nameHasContact(name)) return res.status(400).json({ error: NAME_CONTACT_ERROR, code: "lg.nameContact" });
    const out = leagues.createFriendsGroup(s.id, name || "Prijatelji");
    if (out.error) return res.status(400).json(out);
    res.status(201).json(out);
  });
  app.delete("/api/students/:id/classes/:classId", (req, res) => {
    const s = loadStudent(req, res);
    if (s) res.json({ ok: leagues.leave(s.id, Number(req.params.classId)) });
  });

  // --- učitelj (ključ v glavi X-Teacher-Key) ---
  app.post("/api/classes", (req, res) => {
    const name = cleanName(req.body?.name);
    if (!name) return res.status(400).json({ error: "Vpiši ime razreda, npr. 8.b." });
    if (nameHasContact(name)) return res.status(400).json({ error: NAME_CONTACT_ERROR, code: "lg.nameContact" });
    res.status(201).json(leagues.createClass(name, req.parent?.id ?? null));
  });
  // Ko so računi vklopljeni, vidi učitelj svoje razrede z vsake naprave.
  app.get("/api/teacher/classes", (req, res) => res.json(req.parent ? leagues.teacherClasses(req.parent.id) : []));
  app.get("/api/classes/:code", (req, res) => {
    const cls = teacher(req, res);
    if (cls) res.json(leagues.teacherView(cls));
  });
  app.delete("/api/classes/:code/members/:ref", (req, res) => {
    const cls = teacher(req, res);
    if (cls) res.json({ ok: leagues.removeMember(cls.id, Number(req.params.ref)) });
  });
  app.delete("/api/classes/:code", (req, res) => {
    const cls = teacher(req, res);
    if (cls) res.json({ ok: leagues.deleteClass(cls.id) });
  });

  return leagues;
}

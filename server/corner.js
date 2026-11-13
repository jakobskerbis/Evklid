// Kotiček zanimanj: novice iz uglednih znanstvenih virov (RSS) za področja, ki jih je učenec
// izbral v vprašalniku (public/interests.js), in pripete novice po učencu.
// Brez API (model ne piše novic), brez osebnih podatkov: strežnik prebere javne vire in jih
// hrani v predpomnilniku (pomnilnik + tabela news_cache), da kotiček deluje tudi brez povezave.
import "./env.js";
import crypto from "node:crypto";
import { INTERESTS, interestById, feedInfo, SL_POOL, CUSTOM_POOL, NEWS_LEVELS } from "../public/interests.js";
import { jeOs, jeFaks } from "../public/stopnja.js";

const TTL = 2 * 60 * 60 * 1000; // vir preberemo znova po 2 urah
const RETRY = 10 * 60 * 1000; // po neuspehu poskusimo znova po 10 minutah
const TIMEOUT = 6000; // service worker čaka na API največ 7 s
const MAX_BYTES = 3_000_000;
const PER_FEED = 20;
const PER_INTEREST = 14;
const MAX_ITEMS = 80;
const MAX_PINS = 100;
const SUMMARY = 320;

// Novice, ki niso za otroke in mladostnike (OŠ, SŠ): nasilje, droge, spolnost, samomor.
// Fakulteta jih vidi, vsi drugi ne. Raje kakšno novico preveč skrijemo kot pokažemo.
const UNSAFE =
  /\b(sex|sexual|sexually|porn\w*|rape|suicid\w*|self-harm|murder\w*|homicide|shooting|firearm|gun|guns|weapon\w*|war|wars|warfare|bomb\w*|terror\w*|cocaine|heroin|opioid\w*|fentanyl|overdose\w*|cannabis|marijuana|alcohol\w*|vaping|nicotine|erectile|abortion|genocide|torture)\b|spoln|samomor|umor|ubil|ubit|orožj|vojn|mamil|drog[aei]\b|alkohol|posilj|strelsk|streljan|strelja|teror/i;

export const isUnsafe = (text) => UNSAFE.test(String(text || ""));

// ---------------------------------------------------------------------------
// Branje RSS 2.0 in Atom brez knjižnic.

const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", hellip: "…", ndash: "–", mdash: "—", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“" };
function decode(s) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => safeChar(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => safeChar(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => ENT[n.toLowerCase()] ?? m);
}
const safeChar = (n) => (n > 0 && n < 0x110000 ? String.fromCodePoint(n) : "");
const cdata = (s) => s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
// Besedilo brez oznak HTML (opis je pogosto HTML), presledki stisnjeni.
export const plain = (s) => decode(cdata(String(s || "")).replace(/<[^>]*>/g, " ")).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

function tag(block, names) {
  for (const n of names) {
    const m = block.match(new RegExp(`<${n}(?:\\s[^>]*)?>([\\s\\S]*?)</${n}>`, "i"));
    if (m) return m[1];
  }
  return "";
}

function shorten(s, n) {
  if (s.length <= n) return s;
  const cut = s.slice(0, n);
  return cut.slice(0, Math.max(cut.lastIndexOf(" "), n - 30)).replace(/[\s,;:.–-]+$/, "") + " …";
}

export function parseFeed(xml) {
  const text = String(xml || "");
  const blocks = text.match(/<item[\s>][\s\S]*?<\/item>/gi) || text.match(/<entry[\s>][\s\S]*?<\/entry>/gi) || [];
  const out = [];
  for (const b of blocks) {
    const title = plain(tag(b, ["title"]));
    let link = plain(tag(b, ["link"]));
    if (!/^https?:\/\//i.test(link)) {
      const href = b.match(/<link\b[^>]*?(?:rel=["']alternate["'][^>]*?)?href=["']([^"']+)["']/i);
      link = href ? decode(href[1]) : "";
    }
    if (!title || !/^https?:\/\//i.test(link)) continue;
    const when = Date.parse(plain(tag(b, ["pubDate", "published", "updated", "dc:date"])));
    const summary = shorten(plain(tag(b, ["description", "summary"])), SUMMARY);
    out.push({ title: shorten(title, 200), link, summary, date: Number.isFinite(when) ? new Date(when).toISOString() : null });
    if (out.length >= PER_FEED) break;
  }
  return out;
}

// ---------------------------------------------------------------------------

const itemId = (link) => crypto.createHash("sha1").update(link).digest("hex").slice(0, 16);

// Lastna tema: ključne besede (vsaj 3 črke), ujemanje na začetku besede (»luknj« ujame »luknje«).
export function customMatcher(text) {
  const words = String(text || "")
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((w) => w.length >= 3)
    .slice(0, 6);
  if (!words.length) return null;
  // Slovenske končnice: »luknje« → »luknj«, da ujame tudi »luknja«, »luknjo«.
  const stems = words.map((w) => (w.length > 5 ? w.slice(0, -1) : w).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return new RegExp(`(^|[^\\p{L}])(${stems.join("|")})`, "iu");
}

// Kateri viri za učenca: [{ feed, interest, match }].
export function plan(settings) {
  const level = resolveLevel(settings);
  const slOk = (settings.language || "sl") === "sl";
  const enOk = settings.news_lang !== "mine" || (settings.language || "").startsWith("en");
  const ok = (f) => f && (f.lang === "sl" ? slOk : f.lang === "en" ? enOk : false) && (level === "all" || f.level === "simple");
  const list = [];
  for (const id of settings.interests || []) {
    const i = interestById(id);
    if (!i) continue;
    for (const key of [...i.feeds, ...SL_POOL]) {
      const f = feedInfo(key);
      if (!ok(f)) continue;
      list.push({ feed: f, interest: id, match: f.filtered ? i.kw : null });
    }
  }
  const custom = customMatcher(settings.interest_custom);
  if (custom) for (const key of CUSTOM_POOL) {
    const f = feedInfo(key);
    if (ok(f)) list.push({ feed: f, interest: "custom", match: custom });
  }
  return list;
}

export function resolveLevel(settings) {
  const v = NEWS_LEVELS.includes(settings.news_level) ? settings.news_level : "auto";
  if (v !== "auto") return v;
  return jeOs(settings) ? "simple" : "all";
}

// Pestra mešanica: po vrsti iz vsakega področja najnovejša novica (en vir ne zasede vsega),
// največ PER_SOURCE iz istega vira na področje in PER_INTEREST na področje.
const PER_SOURCE = 6;
export function mix(all) {
  const byDate = (a, b) => (b.date || "").localeCompare(a.date || "");
  const groups = new Map();
  for (const it of [...all].sort(byDate)) {
    const g = groups.get(it.interest) || { list: [], per: {} };
    groups.set(it.interest, g);
    const k = it.source;
    if ((g.per[k] = (g.per[k] || 0) + 1) <= PER_SOURCE && g.list.length < PER_INTEREST) g.list.push(it);
  }
  const lists = [...groups.values()].map((g) => g.list);
  const out = [];
  for (let round = 0; out.length < MAX_ITEMS && lists.some((l) => l[round]); round++)
    for (const l of lists) if (l[round] && out.length < MAX_ITEMS) out.push(l[round]);
  return out;
}

export function createNews(store, { fetchFn = globalThis.fetch, now = () => Date.now(), offline = process.env.EVKLID_NEWS === "0" } = {}) {
  const db = store.db;
  db.exec(`
    CREATE TABLE IF NOT EXISTS news_cache (
      feed TEXT PRIMARY KEY,
      fetched_at INTEGER NOT NULL,
      items TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS corner_pins (
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      item_id TEXT NOT NULL,
      data TEXT NOT NULL,
      pinned_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (student_id, item_id)
    );
  `);
  const mem = new Map(); // feed → { at, items, failedAt }
  const inflight = new Map();
  const known = new Map(); // id → novica (za pripenjanje samo znanih novic)

  function stored(key) {
    if (mem.has(key)) return mem.get(key);
    const row = db.prepare("SELECT fetched_at, items FROM news_cache WHERE feed = ?").get(key);
    const entry = row ? { at: row.fetched_at, items: JSON.parse(row.items) } : null;
    if (entry) mem.set(key, entry);
    return entry;
  }

  async function download(f) {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), TIMEOUT);
    try {
      const r = await fetchFn(f.url, { signal: ctl.signal, headers: { "User-Agent": "Evklid/1.0 (news corner for students)", Accept: "application/rss+xml, application/xml, text/xml" } });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const text = await r.text();
      if (text.length > MAX_BYTES) throw new Error("too big");
      return parseFeed(text);
    } finally {
      clearTimeout(timer);
    }
  }

  function refresh(f, cur) {
    const p = download(f)
      .then((items) => {
        const entry = { at: now(), items };
        mem.set(f.key, entry);
        db.prepare("INSERT INTO news_cache (feed, fetched_at, items) VALUES (?, ?, ?) ON CONFLICT(feed) DO UPDATE SET fetched_at = excluded.fetched_at, items = excluded.items").run(f.key, entry.at, JSON.stringify(items));
        return { items, failed: false };
      })
      .catch((err) => {
        console.warn(`[evklid] novice ${f.source} (${f.key}): ${err?.message ?? err}`);
        const entry = { at: cur?.at ?? 0, items: cur?.items || [], failedAt: now() };
        mem.set(f.key, entry);
        return { items: entry.items, failed: true };
      })
      .finally(() => inflight.delete(f.key));
    inflight.set(f.key, p);
    return p;
  }

  // Novice vira. Svež predpomnilnik takoj; star predpomnilnik tudi takoj (nove novice se naložijo
  // v ozadju za naslednje odprtje), da kotiček ne čaka na počasen vir. Brez predpomnilnika počakamo.
  function feed(f) {
    const cur = stored(f.key);
    if (offline) return Promise.resolve({ items: cur?.items || [], failed: !cur });
    const fresh = cur && now() - cur.at < TTL;
    const recentFail = cur?.failedAt && now() - cur.failedAt < RETRY;
    if (fresh || recentFail) return Promise.resolve({ items: cur.items, failed: !fresh });
    const p = inflight.get(f.key) || refresh(f, cur);
    return cur?.items?.length ? Promise.resolve({ items: cur.items, failed: false }) : p;
  }

  // Novice za učenca: po datumu, največ PER_INTEREST na področje, brez ponovitev.
  async function forStudent(student) {
    const s = student.settings;
    const steps = plan(s);
    const safe = !jeFaks(s);
    const results = await Promise.all(steps.map((st) => feed(st.feed)));
    const seen = new Map();
    let failed = 0;
    results.forEach((r, k) => {
      const { feed: f, interest, match } = steps[k];
      if (r.failed) failed++;
      for (const it of r.items) {
        const text = `${it.title} ${it.summary}`;
        // Splošni slovenski viri (novice o vsem): beseda področja mora biti v naslovu, sicer preveč šuma.
        if (match && !match.test(f.lang === "sl" ? it.title : text)) continue;
        if (safe && isUnsafe(text)) continue;
        const id = itemId(it.link);
        if (seen.has(id)) continue;
        const item = { id, ...it, source: f.source, lang: f.lang, level: f.level, interest };
        seen.set(id, item);
        known.set(id, item);
      }
    });
    const items = mix([...seen.values()]);
    const sources = new Set(steps.map((st) => st.feed.key)).size;
    return { items, failed, sources, level: resolveLevel(s) };
  }

  const pins = {
    list: (studentId) =>
      db.prepare("SELECT data, pinned_at FROM corner_pins WHERE student_id = ? ORDER BY pinned_at DESC, rowid DESC").all(studentId).map((r) => ({ ...JSON.parse(r.data), pinned_at: r.pinned_at })),
    add(studentId, id) {
      const item = known.get(id);
      if (!item) return { error: "unknown" };
      const n = db.prepare("SELECT COUNT(*) AS n FROM corner_pins WHERE student_id = ?").get(studentId).n;
      if (n >= MAX_PINS) return { error: "full" };
      db.prepare("INSERT OR IGNORE INTO corner_pins (student_id, item_id, data) VALUES (?, ?, ?)").run(studentId, id, JSON.stringify(item));
      return { ok: true, item };
    },
    remove: (studentId, id) => db.prepare("DELETE FROM corner_pins WHERE student_id = ? AND item_id = ?").run(studentId, id).changes > 0,
  };

  return { forStudent, pins, known };
}

export function mountCorner(app, store, { loadStudent, fetchFn, offline } = {}) {
  const news = createNews(store, { fetchFn, offline });
  app.get("/api/students/:id/corner", async (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    try {
      const r = await news.forStudent(s);
      res.json({ ...r, pinned: news.pins.list(s.id), interests: s.settings.interests, custom: s.settings.interest_custom || "" });
    } catch (err) {
      console.error("[evklid] kotiček:", err);
      res.status(500).json({ error: "Novic trenutno ni mogoče naložiti." });
    }
  });
  app.post("/api/students/:id/corner/pins", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    const id = String(req.body?.id || "");
    if (!/^[0-9a-f]{16}$/.test(id)) return res.status(400).json({ error: "Napačna novica." });
    const r = news.pins.add(s.id, id);
    if (r.error === "unknown") return res.status(404).json({ error: "Te novice ni več. Osveži kotiček." });
    if (r.error === "full") return res.status(400).json({ error: `Pripetih je že ${MAX_PINS} novic. Odpni kakšno staro.` });
    res.status(201).json({ ok: true, pinned: news.pins.list(s.id) });
  });
  app.delete("/api/students/:id/corner/pins/:itemId", (req, res) => {
    const s = loadStudent(req, res);
    if (!s) return;
    news.pins.remove(s.id, String(req.params.itemId));
    res.json({ ok: true, pinned: news.pins.list(s.id) });
  });
  return news;
}

export { INTERESTS };

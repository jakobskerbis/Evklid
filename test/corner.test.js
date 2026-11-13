import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { parseFeed, isUnsafe, plan, mix, customMatcher } from "../server/corner.js";
import { normalizeSettings } from "../server/settings.js";
import { buildSystemPrompt } from "../server/prompt.js";
import { createSettingsTools } from "../server/chat-settings.js";
import { INTERESTS, INTEREST_IDS, feedInfo, cleanInterests, findInterest } from "../public/interests.js";

const rss = (items) => `<?xml version="1.0"?><rss version="2.0"><channel><title>X</title>${items
  .map((i) => `<item><title><![CDATA[${i.title}]]></title><link>${i.link}</link><pubDate>${i.date || "Mon, 19 Oct 2026 10:30:00 +0000"}</pubDate><description><![CDATA[<p>${i.desc || "Opis &amp; več"}</p>]]></description></item>`)
  .join("")}</channel></rss>`;

test("corner: RSS and Atom are parsed, HTML and entities removed, bad links dropped", () => {
  const items = parseFeed(rss([{ title: "Robots &#8216;roll&#8217; up", link: "https://a.org/1", desc: "<b>Soft</b> robot &amp; armadillo" }, { title: "No link", link: "javascript:alert(1)" }]));
  assert.equal(items.length, 1);
  assert.equal(items[0].title, "Robots ‘roll’ up");
  assert.equal(items[0].summary, "Soft robot & armadillo");
  assert.equal(items[0].date, "2026-10-19T10:30:00.000Z");
  const atom = parseFeed(`<feed><entry><title>Black hole</title><link rel="alternate" href="https://b.org/x"/><updated>2026-10-20T08:00:00Z</updated><summary>Big &lt;b&gt;news&lt;/b&gt;</summary></entry></feed>`);
  assert.deepEqual(atom.map((i) => [i.title, i.link]), [["Black hole", "https://b.org/x"]]);
  assert.equal(atom[0].summary, "Big news");
  assert.deepEqual(parseFeed("not xml"), []);
});

test("corner: catalogue is complete, every feed resolves, names map to ids", () => {
  assert.equal(new Set(INTEREST_IDS).size, INTERESTS.length);
  assert.ok(INTERESTS.length >= 20);
  for (const i of INTERESTS) {
    assert.ok(i.emoji && i.name && i.en && i.kw instanceof RegExp, i.id);
    for (const k of i.feeds) {
      const f = feedInfo(k);
      assert.ok(f && /^https:\/\//.test(f.url), `${i.id}: ${k}`);
    }
  }
  assert.equal(findInterest("Vesolje in astronomija"), "space");
  assert.equal(findInterest("robotika"), "robots");
  assert.equal(findInterest("dinozavri"), "dinosaurs");
  assert.deepEqual(cleanInterests(["space", "robotika", "nič", "space"]), ["space", "robots"]);
  assert.equal(cleanInterests(null), null);
  assert.equal(cleanInterests(INTEREST_IDS).length, 8);
});

test("corner: news for children skip violence, drugs and sex", () => {
  for (const bad of ["Teen vaping linked to…", "War damages labs", "Suicide risk study", "Strelski napad", "Mamila v vodi", "Alcohol and the brain"]) assert.ok(isUnsafe(bad), bad);
  for (const ok of ["Warm oceans hold more heat", "Gunnar the robot learns", "Plants share sugar", "Dinozavri so imeli perje", "Sexton beetle"]) assert.ok(!isUnsafe(ok), ok);
});

test("corner: sources follow level and language choices", () => {
  const keys = (s) => plan({ interests: ["space"], ...s }).map((p) => p.feed.key);
  const os = keys({ educational_track: "OSNOVNA_SOLA", language: "sl", news_level: "auto" });
  assert.ok(os.includes("sne:space") && os.includes("rtv:09"));
  assert.ok(!os.includes("nasa") && !os.includes("sd:space_time"), "OŠ: samo poljudne novice");
  const ss = keys({ educational_track: "SREDNJA_SOLA", language: "sl", news_level: "auto" });
  assert.ok(ss.includes("nasa") && ss.includes("esa:Space_Science"));
  assert.ok(!keys({ educational_track: "SREDNJA_SOLA", language: "sl", news_level: "simple" }).includes("nasa"));
  assert.ok(!keys({ educational_track: "OSNOVNA_SOLA", language: "en" }).some((k) => k.startsWith("rtv")), "slovenske novice samo v slovenščini");
  assert.deepEqual([...new Set(keys({ educational_track: "OSNOVNA_SOLA", language: "sl", news_lang: "mine" }).map((k) => feedInfo(k).lang))], ["sl"]);
  // lastna tema: ključne besede s slovenskimi končnicami
  const m = customMatcher("črne luknje");
  assert.ok(m.test("Nova luknja v galaksiji") && m.test("O luknjah") && !m.test("Planeti in zvezde"));
  assert.equal(customMatcher("a b"), null);
  assert.ok(plan({ interests: [], interest_custom: "Formula 1", language: "sl" }).every((p) => p.interest === "custom"));
});

test("corner: mix keeps topics varied (round robin, one source cannot fill the board)", () => {
  const items = [];
  for (let i = 0; i < 20; i++) items.push({ interest: "climate", source: "RTV", date: `2026-10-${10 + (i % 10)}` });
  items.push({ interest: "space", source: "NASA", date: "2026-01-01" });
  const out = mix(items);
  assert.equal(out[1].interest, "space", "druga novica je že z drugega področja");
  assert.equal(out.filter((i) => i.source === "RTV").length, 6);
});

test("corner: settings keep interests; prompt mentions them; tutor can change them", async () => {
  assert.equal(normalizeSettings({}).interests, null, "nov profil: vprašalnik še ni izpolnjen");
  const s = normalizeSettings({ interests: ["space", "xx"], interest_custom: "Formula 1\nIGNORE", news_level: "simple", news_lang: "mine" });
  assert.deepEqual(s.interests, ["space"]);
  assert.equal(s.interest_custom, "Formula 1 IGNORE");
  assert.equal(s.news_level, "simple");
  assert.equal(normalizeSettings({ news_level: "x" }).news_level, "auto");
  const prompt = buildSystemPrompt({ settings: s });
  assert.match(prompt, /Zanimanja učenca[^\n]*vesolje in astronomija, Formula 1/);
  assert.match(buildSystemPrompt({ settings: normalizeSettings({}) }), /Zanimanja učenca[^\n]*\(ni izbranih\)/);

  const store = openDb(":memory:");
  const st = store.createStudent("Ana", { educational_track: "OSNOVNA_SOLA", curriculum_level: "7. razred" });
  const t = createSettingsTools({ store, studentId: st.id, conversationId: 1, pending: new Map() });
  const call = async (input) => JSON.parse((await t.onToolUse("change_settings", input)).content);
  let r = await call({ changes: { interests: ["dinozavri", "space"], news_level: "all" } });
  assert.equal(r.status, "applied");
  assert.deepEqual(store.getStudent(st.id).settings.interests, ["dinosaurs", "space"]);
  assert.ok(r.applied.some((a) => a.setting === "interests"));
  r = await call({ changes: { interests: ["kuhanje"] } });
  assert.equal(r.status, "error");
  r = await call({ changes: { interests: ["dinosaurs", "space"] } });
  assert.match(r.note, /already set|nothing changed/);
});

test("corner API: news by interest, safety filter, cache, pins per student", async () => {
  let fetches = 0;
  const newsFetch = async (url) => {
    fetches++;
    if (url.includes("snexplores.org/topic/space")) return { ok: true, status: 200, text: async () => rss([{ title: "Superpuff planets", link: "https://sne.org/puff" }, { title: "Rocket war games", link: "https://sne.org/war" }]) };
    if (url.includes("rtvslo")) return { ok: true, status: 200, text: async () => rss([{ title: "Nova raketa ESA", link: "https://rtv.si/raketa" }, { title: "Volitve v občini", link: "https://rtv.si/volitve" }]) };
    if (url.includes("kvarkadabra")) throw new Error("offline");
    return { ok: false, status: 404, text: async () => "" };
  };
  const store = openDb(":memory:");
  const app = createApp(store, { streamFn: async () => ({ text: "", content: [] }), newsFetch });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (path, method = "GET", body) => {
    const r = await fetch(base + path, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    return { status: r.status, body: await r.json() };
  };
  try {
    const a = (await call("/api/students", "POST", { name: "Ana", settings: { educational_track: "OSNOVNA_SOLA", curriculum_level: "6. razred" } })).body;
    const b = (await call("/api/students", "POST", { name: "Bor" })).body;
    assert.equal(a.settings.interests, null);
    let c = (await call(`/api/students/${a.id}/corner`)).body;
    assert.deepEqual(c.items, []);
    await call(`/api/students/${a.id}`, "PUT", { settings: { interests: ["space"] } });
    c = (await call(`/api/students/${a.id}/corner`)).body;
    const titles = c.items.map((i) => i.title).sort();
    assert.deepEqual(titles, ["Nova raketa ESA", "Superpuff planets"], "brez vojne in brez novic, ki niso o vesolju");
    assert.ok(c.failed >= 1, "nedosegljiv vir je štet");
    assert.equal(c.level, "simple");
    const n = fetches;
    await call(`/api/students/${a.id}/corner`);
    assert.equal(fetches, n, "drugič iz predpomnilnika");

    const puff = c.items.find((i) => i.title === "Superpuff planets");
    assert.equal((await call(`/api/students/${a.id}/corner/pins`, "POST", { id: "0123456789abcdef" })).status, 404);
    assert.equal((await call(`/api/students/${a.id}/corner/pins`, "POST", { id: "<script>" })).status, 400);
    const pinned = await call(`/api/students/${a.id}/corner/pins`, "POST", { id: puff.id });
    assert.equal(pinned.status, 201);
    assert.equal(pinned.body.pinned[0].title, "Superpuff planets");
    assert.equal((await call(`/api/students/${b.id}/corner`)).body.pinned.length, 0, "pripete novice so po učencu");
    await call(`/api/students/${a.id}/corner/pins`, "POST", { id: puff.id }); // dvakrat = enkrat
    assert.equal((await call(`/api/students/${a.id}/corner`)).body.pinned.length, 1);
    const un = await call(`/api/students/${a.id}/corner/pins/${puff.id}`, "DELETE");
    assert.equal(un.body.pinned.length, 0);
  } finally {
    server.close();
  }
});

import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { getTopic, getPath } from "../server/curriculum.js";
import { KNOWLEDGE, COLLECTIONS, PASS, PASS_REWARDS, RARITY_TIER, DRAW, seasonOf, seasonLabel, topicTier } from "../public/zbirke.js";
import { avatarSvg, cleanAvatar, SLOTS, ITEMS, itemRarity } from "../public/avatar.js";
import SL from "../public/i18n/sl.js";
import { publicAvatar } from "../server/avatar.js";

test("zbirke: every item draws, every condition topic exists at the item's level, XP ladder rises with rarity", () => {
  assert.equal(new Set(ITEMS.map((x) => x.id)).size, ITEMS.length);
  for (const x of KNOWLEDGE) {
    assert.ok(SLOTS.includes(x.slot) && x.name.sl && x.name.en && RARITY_TIER[x.rarity], x.id);
    const id = x.collection === "pass" ? `${x.id}~2026-1` : x.id;
    const svg = avatarSvg({ [x.slot]: id });
    assert.ok(svg.startsWith("<svg") && svg.endsWith("</svg>") && !/undefined|NaN|null/.test(svg), x.id);
    for (const tid of x.need?.t || []) {
      const t = getTopic(tid);
      assert.ok(t, `${x.id}: ni teme ${tid}`);
      assert.ok(topicTier(getPath(t.path)) >= RARITY_TIER[x.rarity], `${x.id}: ${tid} je pod ravnjo ${x.rarity}`);
    }
    // Zgled (prva tema) je natanko na ravni redkosti: pogoj, ki ga vidi učenec, ustreza redkosti.
    if (x.need?.t) assert.equal(topicTier(getPath(getTopic(x.need.t[0]).path)), RARITY_TIER[x.rarity], `${x.id}: zgled`);
  }
  // Za znanje snovi je legendaren en sam predmet; ostali epski, legendarni in mitični so na Poti znanja (XP).
  assert.deepEqual(KNOWLEDGE.filter((x) => x.rarity === "legendary" && !x.need?.xp && !x.need?.league && x.collection !== "igre").map((x) => x.id), ["fx_doppler"]);
  const pot = KNOWLEDGE.filter((x) => x.collection === "pot");
  assert.ok(pot.length >= 12 && pot.every((x) => x.need.xp > 0 && ["epic", "legendary", "mythic", "cosmic", "eternal"].includes(x.rarity)));
  for (let i = 1; i < pot.length; i++) {
    assert.ok(pot[i].need.xp > pot[i - 1].need.xp, pot[i].id);
    assert.ok(RARITY_TIER[pot[i].rarity] >= RARITY_TIER[pot[i - 1].rarity], pot[i].id);
  }
  assert.ok(KNOWLEDGE.filter((x) => x.rarity === "mythic").every((x) => ["pot", "lige"].includes(x.collection)));
  for (const x of ITEMS) assert.ok(SL[`games.rarity.${itemRarity(x)}`], `${x.id}: ni imena redkosti`);
  // Kozmični in večni (j, 30. 10. 2026): nad mitičnimi, samo za največ XP ali iger, nikoli za kovance.
  for (const r of ["cosmic", "eternal"]) assert.ok(KNOWLEDGE.filter((x) => x.rarity === r).length >= 2 && KNOWLEDGE.filter((x) => x.rarity === r).every((x) => ["pot", "igre"].includes(x.collection)), r);
  // Zmage na lestvicah: samo značke, ena za vsako ligo, nobena se ne kupi.
  // Skrita značka »Pilot« (server/pilot-naloge.js) ni zmaga na lestvici.
  const lige = KNOWLEDGE.filter((x) => x.collection === "lige" && !x.hidden);
  assert.deepEqual(KNOWLEDGE.filter((x) => x.hidden).map((x) => x.id), ["pilot"]);
  assert.ok(lige.length === 10 && lige.every((x) => x.slot === "badge" && x.need.league && x.earn && !x.price));
  // Liki iz iger: pogoj so igre (pravilni odgovori ali različne končane igre), redkost raste s pogojem.
  const igre = KNOWLEDGE.filter((x) => x.collection === "igre");
  assert.ok(igre.filter((x) => x.slot === "kind").length >= 12 && igre.every((x) => (x.need.games > 0) !== (x.need.cleared > 0) && x.earn && !x.price));
  for (const key of ["games", "cleared"]) {
    const l = igre.filter((x) => x.need[key]);
    for (let i = 1; i < l.length; i++) assert.ok(l[i].need[key] > l[i - 1].need[key] && RARITY_TIER[l[i].rarity] >= RARITY_TIER[l[i - 1].rarity], l[i].id);
  }
  // Smešni liki: samo za XP, naraščajoče, nikoli kozmični ali večni; vsak ima risbo.
  const smesni = KNOWLEDGE.filter((x) => x.collection === "smesni");
  assert.ok(smesni.length >= 8 && smesni.filter((x) => x.slot === "kind").length >= 4 && smesni.every((x) => x.need.xp > 0 && x.earn && !x.price && RARITY_TIER[x.rarity] <= RARITY_TIER.legendary));
  for (let i = 1; i < smesni.length; i++) assert.ok(smesni[i].need.xp > smesni[i - 1].need.xp && RARITY_TIER[smesni[i].rarity] >= RARITY_TIER[smesni[i - 1].rarity], smesni[i].id);
  for (const x of smesni) {
    const svg = x.slot === "kind" ? DRAW.kindBack(x.id, "t") + DRAW.kindFront(x.id, "t") : x.slot === "fx" ? DRAW.fxFront(x.id) : x.slot === "badge" ? DRAW.badge(x.id) : DRAW[x.slot](x.id, "t");
    assert.ok(svg && svg.length > 80, x.id);
  }
  for (const c of COLLECTIONS.filter((c) => !["pot", "lige", "igre", "smesni"].includes(c.id))) {
    const n = KNOWLEDGE.filter((x) => x.collection === c.id && !x.set).length;
    const set = KNOWLEDGE.find((x) => x.collection === c.id && x.set);
    assert.ok(set && set.need.own < n, c.id);
  }
  assert.deepEqual(PASS_REWARDS.map((r) => r.tier).filter((t) => t > PASS.tiers), []);
  // Ključne besede ne ujamejo sredine drugih besed.
  const kw = (id, name) => new RegExp(KNOWLEDGE.find((x) => x.id === id).need.kw, "i").test(name);
  assert.ok(kw("el_fe", "Kovine") && !kw("el_fe", "Nekovine") && !kw("el_fe", "Beljakovine"));
  assert.ok(kw("el_n", "Amini in aminokisline") && !kw("el_n", "Vitamini in minerali v živilih"));
  assert.ok(kw("el_c", "Organska kemija") && !kw("el_c", "Splošna in anorganska kemija"));
  assert.ok(kw("bg_sine", "Grafi kotnih funkcij") && !kw("bg_sine", "Trikotnik") && !kw("bg_sine", "Pravokotna projekcija"));
});

test("zbirke: seasons follow the school half-years", () => {
  assert.equal(seasonOf(new Date("2026-10-29T12:00:00Z")).key, "2026-1");
  assert.equal(seasonOf(new Date("2027-01-31T12:00:00Z")).key, "2026-1");
  assert.equal(seasonOf(new Date("2027-02-01T12:00:00Z")).key, "2026-2");
  assert.equal(seasonOf(new Date("2027-08-20T12:00:00Z")).key, "2026-2");
  assert.equal(seasonLabel("2026-2"), "26/27 II");
});

test("avatar: up to 6 items per drawer, same spot replaces, old single ids still read", async () => {
  const { wear, takeOff, slotFull, MULTI_MAX } = await import("../public/avatar.js");
  let eq = cleanAvatar({ acc: "acc_glasses" }, [], true); // star zapis z enim nizom
  assert.deepEqual(eq.acc, ["acc_glasses"]);
  eq = wear(wear(wear(eq, "acc_blush"), "pot_pregl"), "acc_shades"); // druga očala zamenjajo prva
  assert.deepEqual(cleanAvatar(eq, [], true).acc, ["acc_blush", "pot_pregl", "acc_shades"]);
  assert.deepEqual(takeOff(eq, "acc_blush").acc, ["pot_pregl", "acc_shades"]);
  assert.deepEqual(wear(eq, "acc_none").acc, []);
  const els = ["el_h", "el_he", "el_ne", "el_o", "el_na", "el_fe", "el_s"];
  const many = cleanAvatar({ badge: els }, els);
  assert.equal(many.badge.length, MULTI_MAX);
  assert.ok(slotFull(many, "el_mg") && !slotFull(many, "el_s") && !many.badge.includes("el_h"));
  assert.deepEqual(cleanAvatar({ outfit: ["outfit_bow", "outfit_scarf"], hat: ["hat_crown", "hat_phones", "pot_laurel"] }, [], true), { ...cleanAvatar({}, []), outfit: ["outfit_scarf"], hat: ["hat_crown", "hat_phones", "pot_laurel"] });
  for (let n = 1; n <= MULTI_MAX; n++) {
    const svg = avatarSvg({ badge: [...els.slice(0, n - 1), "pot_infinity"], fx: ["pot_aurora", "fx_spark"], acc: ["acc_glasses", "pot_pregl"] });
    assert.ok(!/undefined|NaN/.test(svg) && svg.endsWith("</svg>"), `${n} badges`);
  }
  assert.deepEqual(cleanAvatar({ eyes: ["eyes_happy"] }, []).eyes, "eyes_dots"); // en predmet: seznam ne velja
});

test("zbirke: seasonal ids and unknown parts are cleaned", () => {
  assert.deepEqual(cleanAvatar({ outfit: "pass_coat~2026-1" }, ["pass_coat~2026-1"]).outfit, ["pass_coat~2026-1"]);
  assert.deepEqual(cleanAvatar({ outfit: "pass_coat" }, ["pass_coat"]).outfit, []);
  assert.deepEqual(cleanAvatar({ outfit: "pass_coat~2026-1" }, []).outfit, []);
  assert.deepEqual(cleanAvatar({ badge: "el_fe~2026-1" }, ["el_fe~2026-1"]).badge, []);
  assert.deepEqual(cleanAvatar({ fx: "el_fe" }, ["el_fe"]).fx, []); // napačen predal
  assert.deepEqual(publicAvatar(JSON.stringify({ badge: "el_fe", outfit: "pass_coat~2026-1", hat: "<script>" })).outfit, ["pass_coat~2026-1"]);
});

test("zbirke: items unlock only from mastered topics and the learning pass, never from coins", async () => {
  const store = openDb(":memory:");
  const app = createApp(store, {});
  const server = app.listen(0);
  const base = `http://localhost:${server.address().port}`;
  const call = async (p, body) => {
    const res = await fetch(base + p, { method: body ? "POST" : "GET", headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    return { status: res.status, body: await res.json() };
  };
  const master = (sid, topic, source) =>
    store.db
      .prepare("INSERT INTO topic_state (student_id, topic_id, status, source, mastered_at) VALUES (?, ?, 'mastered', ?, datetime('now')) ON CONFLICT(student_id, topic_id) DO UPDATE SET status = 'mastered', source = excluded.source")
      .run(sid, topic, source);
  const xp = (sid, amount, reason, daysAgo = 0) =>
    store.db.prepare("INSERT INTO xp_events (student_id, amount, reason, created_at) VALUES (?, ?, ?, datetime('now', ?))").run(sid, amount, reason, `-${daysAgo} days`);
  try {
    const s = (await call("/api/students", { name: "Zbiralka", settings: { curriculum_level: "8. razred" } })).body;
    let r = await call(`/api/students/${s.id}/zbirke`);
    assert.equal(r.body.items.length, 0);
    assert.equal(r.body.pass.tier, 0);
    assert.ok(r.body.hints.el_fe.name && r.body.hints.el_fe.path, "pogoj je viden vnaprej");

    // »Označi kot obvladano« ne odklene ničesar, vaje in pogovor z inštruktorjem pa.
    master(s.id, "KEM-OS-8/kovine", "manual");
    assert.equal((await call(`/api/students/${s.id}/zbirke`)).body.items.length, 0);
    master(s.id, "KEM-OS-8/kovine", "practice");
    r = await call(`/api/students/${s.id}/zbirke`);
    assert.deepEqual(r.body.fresh, ["el_fe"]);
    assert.equal(r.body.items[0].topic.id, "KEM-OS-8/kovine");
    // Ključna beseda: sorodna tema na višji ravni (SŠ) odklene tudi navaden predmet.
    master(s.id, "KEM-SS-1/periodni-sistem", "chat");
    assert.ok((await call(`/api/students/${s.id}/zbirke`)).body.items.some((i) => i.id === "el_ne"));
    // Ključna beseda na prenizki ravni ne odklene epskega predmeta (Cl je SŠ).
    master(s.id, "KEM-OS-8/nevtralizacija-in-soli", "practice");
    assert.ok(!(await call(`/api/students/${s.id}/zbirke`)).body.items.some((i) => i.id === "el_cl"));

    // Predmeta za znanje ni mogoče kupiti; obleči ga lahko, ko ga imaš.
    xp(s.id, 0, "x");
    assert.equal((await call(`/api/students/${s.id}/avatar/buy`, { item: "el_ag" })).status, 400);
    r = await call(`/api/students/${s.id}/avatar`, { equipped: { badge: "el_fe", fx: "fx_spark" } });
    assert.deepEqual(r.body.equipped.badge, ["el_fe"]);
    assert.deepEqual(r.body.equipped.fx, []);
    assert.ok(r.body.owned.includes("el_fe"));

    // Vitrina: samo svoji predmeti, največ trije.
    r = await call(`/api/students/${s.id}/zbirke/vitrina`, { items: ["el_fe", "el_ag", "el_ne", "el_fe"] });
    assert.deepEqual(r.body.showcase, ["el_fe", "el_ne"]);
    assert.equal((await call(`/api/students/${s.id}/zbirke/vitrina`, { items: "el_fe" })).status, 400);

    // Učni pass: XP iz učenja, največ dayCap na dan, brez XP iz iger.
    const season = seasonOf().key;
    xp(s.id, 5000, "igra: maze:add");
    xp(s.id, 5000, "pravilno");
    r = await call(`/api/students/${s.id}/zbirke`);
    assert.equal(r.body.pass.xp, PASS.dayCap);
    // Dnevi v tej sezoni (prvi dnevi sezone: prejšnji dnevi ne štejejo), dovolj za stopnjo 5.
    const inSeason = (d) => new Date(Date.now() - d * 86400000).toISOString().slice(0, 10) >= seasonOf().from;
    let days = 1;
    for (let d = 1; days * PASS.dayCap < 5 * PASS.perTier; d++) {
      xp(s.id, PASS.dayCap, "dnevni trening", d);
      if (inSeason(d)) days += 1;
      if (d > 60) break;
    }
    r = await call(`/api/students/${s.id}/zbirke`);
    assert.equal(r.body.pass.tier, Math.floor((days * PASS.dayCap) / PASS.perTier));
    if (days * PASS.dayCap >= 5 * PASS.perTier) {
      assert.ok(r.body.fresh.includes(`pass_board~${season}`), "nagrada stopnje 5");
      r = await call(`/api/students/${s.id}/avatar`, { equipped: { bg: `pass_board~${season}` } });
      assert.equal(r.body.equipped.bg, `pass_board~${season}`);
    }

    // Odvzem: predmet izgine, zapis ostane in se ne podeli znova.
    const { Knowledge } = await import("../server/zbirke.js");
    const k = new Knowledge(store.db);
    assert.ok(k.revoke(s.id, "el_fe", "test"));
    assert.ok(!k.owned(s.id).includes("el_fe"));
    assert.ok(!JSON.parse(store.db.prepare("SELECT equipped FROM avatar_state WHERE student_id = ?").get(s.id).equipped).badge.includes("el_fe"));
    k.sync(s.id);
    assert.ok(!k.owned(s.id).includes("el_fe"));
    assert.equal(store.db.prepare("SELECT revoke_reason FROM knowledge_items WHERE student_id = ? AND item = 'el_fe'").get(s.id).revoke_reason, "test");

    // Legendarni: tri tekmovalne teme, vsaj ena potrjena v pogovoru.
    for (const t of ["MAT-TEK-OS/deljivost-in-ostanki", "MAT-TEK-OS/dirichletovo-nacelo", "FIZ-TEK-OS/toplotne-bilance"]) master(s.id, t, "practice");
    assert.ok(!k.owned(s.id).includes("fx_doppler") && !k.sync(s.id).includes("fx_doppler"));
    master(s.id, "KEM-TEK-OS/raztopine-in-masni-delez", "chat");
    assert.ok(k.sync(s.id).includes("fx_doppler"));

    // Pot znanja: skupni XP (tudi XP iz iger, kot ga učenec vidi ob zvezdici).
    const first = KNOWLEDGE.find((x) => x.id === "pot_hourglass").need.xp;
    const mythic = KNOWLEDGE.find((x) => x.id === "pot_noether").need.xp;
    const have = k.xpTotal(s.id);
    assert.ok(have >= first && k.owned(s.id).includes("pot_hourglass") && !k.owned(s.id).includes("pot_noether"));
    xp(s.id, mythic - have, "pravilno");
    assert.ok(k.sync(s.id).includes("pot_noether"));
    assert.ok(!k.owned(s.id).includes("pot_aurora"));
    r = await call(`/api/students/${s.id}/avatar`, { equipped: { hat: "pot_laurel", bg: "pot_noether", fx: "pot_aurora" } });
    assert.deepEqual(r.body.equipped.hat, ["pot_laurel"]);
    assert.equal(r.body.equipped.bg, "pot_noether");
    assert.deepEqual(r.body.equipped.fx, []);
    assert.equal((await call(`/api/students/${s.id}/zbirke`)).body.xp, mythic);
  } finally {
    server.close();
  }
});

test("day streak: today does not break it yet, one missed day a week is frozen", async () => {
  const store = openDb(":memory:");
  const { Progress } = await import("../server/progress.js");
  const p = new Progress(store);
  const sid = store.db.prepare("INSERT INTO students (name, settings) VALUES ('Niz', '{}')").run().lastInsertRowid;
  const on = (...days) => {
    store.db.prepare("DELETE FROM xp_events WHERE student_id = ?").run(sid);
    for (const d of days) store.db.prepare("INSERT INTO xp_events (student_id, amount, reason, created_at) VALUES (?, 5, 'x', datetime('now', ?))").run(sid, `-${d} days`);
  };
  on(1, 2, 3);
  assert.equal(p.dayStreak(sid), 3); // danes še ni vadil: niz ostane
  on(0, 2, 3);
  assert.equal(p.dayStreak(sid), 3); // včeraj zamrznjen
  on(0, 2, 4, 5);
  assert.equal(p.dayStreak(sid), 2); // druga luknja v istem tednu prekine niz
  on(0, 2, 3, 4, 5, 6, 7, 8, 10);
  assert.equal(p.dayStreak(sid), 9); // luknji 8 dni narazen: obe zamrznjeni
  on(0, 3);
  assert.equal(p.dayStreak(sid), 1); // dva zaporedna zamujena dneva
});

test("game characters unlock from game results, drawn in the student's colour, never bought", async () => {
  const store = openDb(":memory:");
  const app = createApp(store, {});
  const server = app.listen(0);
  const base = `http://localhost:${server.address().port}`;
  const call = async (p, body) => {
    const res = await fetch(base + p, { method: body ? "POST" : "GET", headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    return { status: res.status, body: await res.json() };
  };
  try {
    const s = (await call("/api/students", { name: "Igralka", settings: { curriculum_level: "8. razred" } })).body;
    let r = await call(`/api/students/${s.id}/avatar`, { equipped: { kind: "kind_cat" } });
    assert.equal(r.body.equipped.kind, "kind_blob"); // še zaklenjen
    r = await call(`/api/students/${s.id}/games/result`, { game: "maze:frac_add", score: 10, correct: 25, wrong: 1, tier: 1 });
    assert.ok(r.body.zbirke.includes("kind_cat") && !r.body.zbirke.includes("kind_bear"));
    r = await call(`/api/students/${s.id}/avatar`, { equipped: { kind: "kind_cat", body: "body_green" } });
    assert.equal(r.body.equipped.kind, "kind_cat");
    assert.equal((await call(`/api/students/${s.id}/avatar/buy`, { item: "kind_bear" })).status, 400);
    const z = (await call(`/api/students/${s.id}/zbirke`)).body;
    assert.equal(z.games.correct, 25);
    assert.equal(z.items.find((i) => i.id === "kind_cat").source, "games");
    // Lik prevzame barvo telesa (gradient), ne svoje.
    const svg = avatarSvg({ kind: "kind_cat", body: "body_green" });
    assert.ok(svg.includes("M24 44L26 12") && /url\(#gav\d+\)/.test(svg) && !/undefined|NaN/.test(svg));
  } finally {
    server.close();
  }
});

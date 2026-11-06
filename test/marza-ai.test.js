// Marža vedno ≥ 75 % (j 2026-11-06 6:40): strošek AI nikoli ne preseže 25 % plačila, za vsak paket in način;
// brezplačni paketi imajo nizko stalno mejo. Meje se uveljavijo na strežniku (server/meje-ai.js, server/usage.js).
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { Usage } from "../server/usage.js";
import { costUsd, modeParams } from "../server/claude.js";
import { aiCapRows, nopayRows, callMaxUsd, replyReserveUsd, systemTokens, messageTokens, priceOf, FALLBACK_MODES } from "../server/meje-ai.js";
import { planGuarantee, planByKey, PLANS, COST, guaranteeUsd, aiCapFromEur, passCapUsd, giftGuarantee } from "../server/accounts/plans.js";
import { licenceAiCapUsd, defaultAiCapUsd, maxAiCapUsd } from "../server/schools.js";

const withEnv = (vars, fn) => {
  const old = Object.fromEntries(Object.keys(vars).map((k) => [k, process.env[k]]));
  Object.assign(process.env, vars);
  try {
    return fn();
  } finally {
    for (const [k, v] of Object.entries(old)) v === undefined ? delete process.env[k] : (process.env[k] = v);
  }
};

test("tabela meja: najslabši primer vsakega plačljivega paketa je ≤ 25 % plačila", () => {
  const rows = aiCapRows();
  assert.ok(rows.length >= 70, `vrstic: ${rows.length}`);
  for (const r of rows) {
    assert.ok(r.paidEur > 0, r.name);
    assert.ok(r.share <= 0.25 + 1e-9, `${r.name}: ${(r.share * 100).toFixed(1)} % (${r.capUsd} $ od ${r.paidEur} €)`);
  }
  // Vsak paket iz cenika (mesečni, letni, družinski) je v tabeli.
  for (const p of PLANS) assert.ok(rows.some((r) => r.name === p.label), p.label);
  // Brezplačni paketi: stalna nizka meja.
  for (const r of nopayRows()) assert.ok(r.capUsd > 0 && r.capUsd <= 10, r.name);
});

test("nastavitve skrbnika ne morejo preseči 25 % plačila", () => {
  withEnv({ EVKLID_AI_GUARANTEE_OS_USD: "100", EVKLID_SCHOOL_AI_EUR: "50" }, () => {
    assert.equal(guaranteeUsd("OS", "month"), aiCapFromEur(9.99));
    assert.equal(guaranteeUsd("OS", "year"), aiCapFromEur(99 / 12));
    const g = planGuarantee(planByKey(PLANS.find((p) => p.level === "OS" && p.interval === "month").key));
    assert.ok(g.total * COST.eurPerUsd <= 0.25 * 9.99 + 1e-9);
    const lic = { seats: 30, plan: "pilot", price_eur: 0 };
    assert.ok(defaultAiCapUsd(lic) <= maxAiCapUsd(lic));
  });
  // Meja licence skrbnika (do 10000 $) in nižja vpisana cena licence.
  const lic = { seats: 30, plan: "school", price_eur: 0, ai_cap_usd_month: 10000 };
  assert.equal(licenceAiCapUsd(lic), maxAiCapUsd(lic));
  assert.ok(maxAiCapUsd({ ...lic, price_eur: 6 }) < maxAiCapUsd(lic), "vpisana (nižja) cena licence");
  assert.ok((maxAiCapUsd(lic) / 30) * COST.eurPerUsd <= (14 / 12) * 0.25 + 1e-9);
  // Paket pred testom: shranjena meja nad 25 % plačila se omeji.
  assert.equal(passCapUsd({ ai_usd: 50, amount: 549 }), aiCapFromEur(5.49));
  // Darilna koda: največ 25 % letne cene / 12.
  assert.ok(giftGuarantee("OS", "OS").total * COST.eurPerUsd <= (99 / 12) * 0.25 + 1e-9);
});

test("rezerva klica je ≥ dejanskega stroška pri največjem vhodu in izhodu", () => {
  const system = "Navodila za inštruktorja. ".repeat(2000) + "<!-- EVKLID:NASTAVITVE -->\nIme: Ana";
  const messages = [{ role: "user", content: [{ type: "text", text: "Koliko je 2 + 2? ".repeat(100) }] }];
  for (const mode of Object.keys(FALLBACK_MODES)) {
    const { model, max_tokens } = modeParams(mode);
    const reserve = replyReserveUsd({ mode, system, messages });
    // Vhod največ toliko žetonov, kot je meja (vse kot zapis v predpomnilnik za 1 h), izhod do max_tokens.
    const bound = systemTokens(system) + messageTokens(messages);
    const worst = costUsd(model, { cache_creation_input_tokens: bound, cache_creation: { ephemeral_1h_input_tokens: bound }, output_tokens: max_tokens });
    assert.ok(worst <= reserve + 1e-12, `${mode}: ${worst} > ${reserve}`);
    const plain = costUsd(model, { input_tokens: bound, output_tokens: max_tokens });
    assert.ok(plain <= reserve + 1e-12, mode);
  }
  // Neznan model: cena najdražjega.
  assert.ok(callMaxUsd("nov-model", 1000, 1000) >= callMaxUsd("claude-opus-5-5", 1000, 1000));
  assert.ok(priceOf("claude-haiku-5-5-20261015").out < priceOf("claude-opus-5-5").out);
});

// Najslabši primer: vsak klic stane polno rezervo; tudi hkratni klici ne gredo čez mejo.
test("hold: zaporedni in hkratni klici nikoli ne presežejo meje", () => {
  const store = openDb(":memory:");
  store.createStudent("Ana"); // id 1
  const usage = new Usage(store.db);
  const CAP = 0.5;
  usage.configure({ capsOf: () => [{ key: "t", usd: CAP, spent: usage.monthTotal(), code: "block.freeMonth" }] });
  const reserve = 0.07;
  let calls = 0;
  for (let i = 0; i < 100; i++) {
    const h = usage.hold(1);
    if (!h.take(reserve)) break;
    usage.log(1, "claude-opus-5-5", { output_tokens: Math.floor((reserve * 1e6) / 20) });
    h.release();
    calls++;
  }
  assert.ok(calls >= 6 && usage.monthTotal() <= CAP + 1e-9, `${calls} klicev, ${usage.monthTotal()} $`);
  // Hkratni: rezervacije v teku štejejo.
  const store2 = openDb(":memory:");
  const u2 = new Usage(store2.db);
  u2.configure({ capsOf: () => [{ key: "t", usd: CAP, spent: u2.monthTotal() }] });
  const holds = Array.from({ length: 20 }, () => u2.hold(1)).filter((h) => h.take(reserve));
  assert.equal(holds.length, Math.floor(CAP / reserve));
  for (const h of holds) h.release();
  assert.equal(u2.inflight.size, 0);
  assert.ok(u2.headroom(1) >= CAP - 1e-9);
});

test("zajamčen paket: meja = vrednost paketa (meja + brezplačni rep), poraba izbrisanega profila šteje", () => {
  const store = openDb(":memory:");
  store.createStudent("Ana"); // id 1
  const usage = new Usage(store.db);
  const g = planGuarantee(planByKey(PLANS.find((p) => p.level === "OS" && p.interval === "month").key));
  usage.configure({ guaranteeOf: () => g.usd, ownerOf: () => 7, topupPrompt: () => false });
  const caps = usage.capsFor(1);
  assert.equal(caps.length, 1);
  assert.ok(Math.abs(caps[0].usd - g.total) < 1e-9);
  // Poraba profila, ki je bil izbrisan (student_id NULL, parent_id ostane), zmanjša prostor.
  store.db.prepare("INSERT INTO usage (student_id, parent_id, model, kind, cost_usd) VALUES (NULL, 7, 'claude-haiku-5-5', 'chat', 1)").run();
  assert.ok(Math.abs(usage.headroom(1) - (g.total - 1)) < 1e-9);
  // Ko ni prostora niti za najcenejši klic: razlog freeTail.
  store.db.prepare("INSERT INTO usage (student_id, parent_id, model, kind, cost_usd) VALUES (1, 7, 'claude-haiku-5-5', 'chat', ?)").run(g.total - 1);
  assert.equal(usage.blockInfo(1)?.code, "block.freeTail");
});

const META = '\n<<META subject=MAT topic="-" error=0 mode=A flag=none>>';

test("klepet: najslabši strošek vsakega odgovora ostane pod mejo; nato cenejši način in 429", async () => {
  const store = openDb(":memory:");
  const usage = new Usage(store.db);
  const CAP = 0.05;
  usage.configure({ capsOf: () => [{ key: "t", usd: CAP, spent: usage.monthTotal(), code: "block.freeMonth" }] });
  const modes = [];
  // Vsak odgovor stane največ, kolikor sme: ves vhod kot zapis v predpomnilnik za 1 h, izhod do max_tokens.
  const streamFn = async ({ system, messages, mode, onText, tools }) => {
    modes.push(mode);
    const { model, max_tokens } = modeParams(mode);
    const bound = systemTokens(system) + messageTokens(messages) + (tools?.length ? Math.ceil(Buffer.byteLength(JSON.stringify(tools)) / 2) : 0);
    onText("Poglejva." + META);
    return { text: "Poglejva." + META, stopReason: "end_turn", model, usage: { cache_creation_input_tokens: bound, cache_creation: { ephemeral_1h_input_tokens: bound }, output_tokens: max_tokens } };
  };
  const server = createApp(store, { scheduler: false, streamFn, usage }).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const s = await (await fetch(`${base}/api/students`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "Ana", settings: { level: "OS", grade: 8 } }) })).json();
    let blocked = null;
    for (let i = 0; i < 40 && !blocked; i++) {
      const conv = await (await fetch(`${base}/api/students/${s.id}/conversations`, { method: "POST" })).json();
      const r = await fetch(`${base}/api/conversations/${conv.id}/messages`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: `Reši enačbo ${i}x + 3 = 11 in razloži vsak korak.` }) });
      if (r.status === 429) blocked = await r.json();
      else await r.text();
    }
    assert.ok(blocked, "na koncu 429");
    assert.equal(blocked.code, "block.freeMonth");
    const spent = usage.monthTotal();
    assert.ok(spent <= CAP + 1e-9, `poraba ${spent} $ > meja ${CAP} $`);
    assert.ok(spent > CAP * 0.5, `poraba ${spent} $`);
    assert.equal(usage.inflight.size, 0, "rezervacije sproščene");
  } finally {
    server.close();
  }
});

test("klepet: »Razloži podrobneje« brez prostora za Opus dobi cenejši način", async () => {
  const store = openDb(":memory:");
  const usage = new Usage(store.db);
  // Prostor za Haiku, ne za Opus (rezerva Opusa je več deset centov).
  usage.configure({ capsOf: () => [{ key: "t", usd: 0.05, spent: usage.monthTotal() }] });
  const modes = [];
  const streamFn = async ({ mode, onText }) => {
    modes.push(mode);
    onText("Ok." + META);
    return { text: "Ok." + META, stopReason: "end_turn", model: modeParams(mode).model, usage: { input_tokens: 100, output_tokens: 10 } };
  };
  const server = createApp(store, { scheduler: false, streamFn, usage }).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const s = await (await fetch(`${base}/api/students`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "Ana", settings: { level: "OS", grade: 8 } }) })).json();
    const conv = await (await fetch(`${base}/api/students/${s.id}/conversations`, { method: "POST" })).json();
    for (const deep of [false, true, true]) {
      const r = await fetch(`${base}/api/conversations/${conv.id}/messages`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: "Razloži še enkrat.", deep }) });
      assert.equal(r.status, 200);
      await r.text();
    }
    assert.ok(!modes.includes("deep") && !modes.includes("mid"), modes.join(","));
  } finally {
    server.close();
  }
});

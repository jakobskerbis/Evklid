// 6. korak priprave na pilot (docs/spremljanje.md): opozorilo o dnevnem strošku AI (server/opozorilo-ai.js) in
// presoja stanja v Straži (scripts/straza.mjs).
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { startAiCostAlert, mejaUsd, PRIVZETA_MEJA_USD } from "../server/opozorilo-ai.js";

process.env.STRAZA_URL = "http://127.0.0.1:9";
const { presojaStanja } = await import("../scripts/straza.mjs");

const tiho = { error() {}, info() {}, warn() {} };
function postar({ napaka = false } = {}) {
  const poslano = [];
  return { poslano, enabled: true, async send(m) {
    if (napaka) throw new Error("Resend 503 za a@b.si");
    poslano.push(m);
  } };
}

test("strošek AI: pod mejo nič, nad mejo en e-mail na dan skrbnikom, javno stanje brez zneska", async () => {
  const store = openDb(":memory:");
  let vsota = 2.49;
  let ura = new Date("2026-11-16T09:00:00Z");
  const mailer = postar();
  const env = { EVKLID_ADMIN_EMAILS: "skrbnik@primer.si, drugi@primer.si", EVKLID_OPOZORILO_AI_USD: "2,5" };
  const a = startAiCostAlert(store.db, { todayTotal: () => vsota }, { scheduler: false, env, mailer, log: tiho, now: () => ura });
  assert.equal(await a.run(), null);
  assert.deepEqual(a.status(), { nadMejo: false, od: null });
  assert.equal(mailer.poslano.length, 0);

  vsota = 2.75;
  ura = new Date("2026-11-16T10:10:00Z");
  const s = await a.run();
  assert.equal(s.poslano, true);
  assert.deepEqual(mailer.poslano.map((m) => m.to), ["skrbnik@primer.si", "drugi@primer.si"]);
  assert.match(mailer.poslano[0].subject, /2,75 \$.*2,50 \$/);
  assert.match(mailer.poslano[0].text, /EVKLID_OPOZORILO_AI_USD/);
  // Javno: samo, da je meja presežena in od kdaj; brez zneska in meje.
  const javno = a.status();
  assert.deepEqual(javno, { nadMejo: true, od: "2026-11-16T10:10:00.000Z" });
  assert.doesNotMatch(JSON.stringify(javno), /2[.,]7|2[.,]5/);

  // Isti dan ne pošlje znova, ko poraba raste pod 3-kratnik meje; pri 3-kratniku še enkrat (in Straža spet pade).
  vsota = 7.4;
  ura = new Date("2026-11-16T12:00:00Z");
  await a.run();
  assert.equal(mailer.poslano.length, 2);
  assert.equal(a.status().od, "2026-11-16T10:10:00.000Z");
  vsota = 7.5;
  ura = new Date("2026-11-16T15:00:00Z");
  await a.run();
  assert.equal(mailer.poslano.length, 4);
  assert.match(mailer.poslano[2].subject, /ŠE VEDNO RASTE.*7,50 \$/);
  assert.equal(a.status().od, "2026-11-16T15:00:00.000Z");
  vsota = 40;
  ura = new Date("2026-11-16T18:00:00Z");
  await a.run();
  assert.equal(mailer.poslano.length, 4, "največ dva e-maila na dan");

  // Nov dan (UTC): znova, ko je nad mejo.
  ura = new Date("2026-11-17T00:20:00Z");
  vsota = 3;
  await a.run();
  assert.equal(mailer.poslano.length, 6);
  assert.equal(a.status().od, "2026-11-17T00:20:00.000Z");
  // j mejo med dnem dvigne (Render se znova zažene): ko je presežena nova meja, novo opozorilo.
  env.EVKLID_OPOZORILO_AI_USD = "5";
  await a.run();
  assert.equal(mailer.poslano.length, 6, "pod novo mejo nič");
  vsota = 5.2;
  ura = new Date("2026-11-17T09:00:00Z");
  await a.run();
  assert.equal(mailer.poslano.length, 8);
  assert.equal(a.status().od, "2026-11-17T09:00:00.000Z");
});

test("strošek AI: neuspela e-pošta se ponovi, brez nastavitve ne; meja 0 izklopi", async () => {
  const store = openDb(":memory:");
  const ura = () => new Date("2026-11-16T10:00:00Z");
  const env = { EVKLID_ADMIN_EMAILS: "skrbnik@primer.si" };
  const slab = postar({ napaka: true });
  const napake = [];
  const a = startAiCostAlert(store.db, { todayTotal: () => 4 }, { scheduler: false, env, mailer: slab, log: { error: (m) => napake.push(m) }, now: ura });
  assert.equal((await a.run()).poslano, false);
  assert.equal((await a.run()).poskusov, 2); // ponovno ob naslednjem pregledu
  for (let i = 0; i < 6; i++) await a.run();
  assert.equal((await a.run()).poskusov, 6, "največ 6 poskusov na dan");
  assert.ok(a.status().od, "Straža ve, od kdaj (opozori samo eno uro)");
  assert.ok(napake.every((m) => !m.includes("a@b.si")), "e-naslov ne gre v dnevnik");
  // Privzeta meja 3 $ (4 $ je nad njo).
  assert.equal(mejaUsd({}), PRIVZETA_MEJA_USD);
  assert.equal(mejaUsd({ EVKLID_OPOZORILO_AI_USD: "x" }), PRIVZETA_MEJA_USD);

  const store2 = openDb(":memory:");
  const b = startAiCostAlert(store2.db, { todayTotal: () => 4 }, { scheduler: false, env: {}, mailer: postar(), log: tiho, now: ura });
  assert.equal((await b.run()).koncano, true); // ni naslovov: ponovitev nič ne spremeni
  assert.equal((await b.run()).poskusov, 1);
  assert.equal(b.status().od, "2026-11-16T10:00:00.000Z", "brez e-pošte Straža ve, od kdaj, in ne pada ves dan");

  const c = startAiCostAlert(openDb(":memory:").db, { todayTotal: () => 100 }, { scheduler: false, env: { EVKLID_OPOZORILO_AI_USD: "0" }, mailer: postar(), log: tiho, now: ura });
  assert.equal(await c.run(), null);
  assert.equal(c.status(), null);
});

test("strošek AI: /healthz/stanje kaže aiStrosek iz prave porabe (usage)", async () => {
  const store = openDb(":memory:");
  const app = createApp(store, { scheduler: false, log: tiho });
  const server = app.listen(0);
  try {
    const url = `http://127.0.0.1:${server.address().port}/healthz/stanje`;
    assert.deepEqual((await (await fetch(url)).json()).aiStrosek, { nadMejo: false, od: null });
    store.db.prepare("INSERT INTO usage (model, kind, cost_usd) VALUES ('claude-haiku-4-5', 'chat', 3.5)").run();
    assert.equal((await (await fetch(url)).json()).aiStrosek.nadMejo, true);
  } finally {
    server.close();
  }
});

test("straža: stanje, ki traja ves dan, podre Stražo samo eno uro po dogodku", () => {
  const now = Date.parse("2026-11-16T12:00:00Z");
  const osnova = { id: "x", razlicica: "y", kopije: { napaka: false }, kopijeZunaj: null, pomnilnik: { najvecDelez: 40, mejaMb: 512, mb: 200 } };
  let r = presojaStanja(osnova, now);
  assert.deepEqual(r.napake, []);
  assert.deepEqual(r.opozorila, ["kopija baze zunaj Renderja (R2) ni nastavljena"]);

  // Strošek AI: nov (ali še brez časa) → napaka; po eni uri samo opozorilo.
  assert.equal(presojaStanja({ ...osnova, aiStrosek: { nadMejo: true, od: "2026-11-16T11:30:00Z" } }, now).napake.length, 1);
  assert.equal(presojaStanja({ ...osnova, aiStrosek: { nadMejo: true, od: null } }, now).napake.length, 1);
  r = presojaStanja({ ...osnova, aiStrosek: { nadMejo: true, od: "2026-11-16T09:00:00Z" } }, now);
  assert.deepEqual([r.napake.length, r.opozorila.length], [0, 2]);
  assert.deepEqual(presojaStanja({ ...osnova, aiStrosek: { nadMejo: false, od: null } }, now).napake, []);

  // Nočni preizkus kopije.
  assert.match(presojaStanja({ ...osnova, preverjanjeKopij: { datum: "2026-11-16", ok: false, ob: "2026-11-16T11:10:00Z" } }, now).napake[0], /preizkus obnove/);
  assert.deepEqual(presojaStanja({ ...osnova, preverjanjeKopij: { datum: "2026-11-16", ok: false, ob: "2026-11-16T04:40:00Z" } }, now).napake, []);
  assert.deepEqual(presojaStanja({ ...osnova, preverjanjeKopij: { datum: "2026-11-16", ok: true, ob: "2026-11-16T11:10:00Z" } }, now).napake, []);
  // Prehodna napaka (strežnik ponovi čez 10 min brez alarma): tudi Straža ne pade.
  assert.deepEqual(presojaStanja({ ...osnova, preverjanjeKopij: { datum: "2026-11-16", ok: false, ob: "2026-11-16T11:10:00Z", prehodna: true } }, now).napake, []);
  assert.equal(presojaStanja({ ...osnova, preverjanjeKopij: { datum: "2026-11-16", ok: false, ob: "2026-11-16T11:10:00Z", prehodna: false } }, now).napake.length, 1);

  // E-pošta: Resend ali omrežje → napaka; en napačen naslov (422) ali uspeh po napaki → ne.
  const posta = (razlog, zadnjaNapaka = "2026-11-16T11:50:00Z", zadnjiUspeh = "2026-11-16T10:00:00Z") => ({ ...osnova, posta: { nastavljena: true, zadnjaNapaka, zadnjiUspeh, razlog } });
  assert.match(presojaStanja(posta("401 API key is invalid"), now).napake[0], /e-pošta/);
  assert.match(presojaStanja(posta("omrežje: fetch failed"), now).napake[0], /e-pošta/);
  assert.deepEqual(presojaStanja(posta("422 Invalid `to` field"), now).napake, []);
  assert.deepEqual(presojaStanja(posta("503 x", "2026-11-16T11:50:00Z", "2026-11-16T11:55:00Z"), now).napake, []);
  assert.deepEqual(presojaStanja(posta("503 x", "2026-11-16T09:00:00Z", null), now).napake, []);

  // PDF učbenika: samo opozorilo; pomnilnik in kopija kot prej.
  assert.deepEqual(presojaStanja({ ...osnova, pdfUcbenika: { napaka: "HTTP 500" } }, now).napake, []);
  assert.equal(presojaStanja({ ...osnova, kopije: { napaka: true } }, now).napake.length, 1);
  assert.equal(presojaStanja({ ...osnova, pomnilnik: { najvecDelez: 90, mejaMb: 512, mb: 470 } }, now).napake.length, 1);
});

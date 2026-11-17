// Korak 3 priprave na pilot (j 2026-11-15): en račun ne more preseči meje stroška AI, tudi z mnogo hkratnimi
// zahtevami in z drugačno obliko poti (poševnica na koncu, velike črke, »//«). Vsak klic modela tu stane največ,
// kolikor sme (vhod = vsi bajti besedila, naša navodila bajti/2, izhod = max_tokens načina), in traja 80 ms, da se
// zahteve res prekrivajo. Po napadu mora za VSAKO mejo profila veljati: porabljeno ≤ meja.
import test from "node:test";
import assert from "node:assert/strict";
import { withAccounts, META } from "./racuni-pomoc.js";
import { modeParams, costUsd, supportsFallback } from "../server/claude.js";
import { replyReserveUsd } from "../server/meje-ai.js";
import { passCapUsd } from "../server/accounts/plans.js";

const DAY = 86400000;
const dayIso = (days) => new Date(Date.now() + days * DAY).toISOString().slice(0, 10);
const bytes = (s) => Buffer.byteLength(typeof s === "string" ? s : JSON.stringify(s ?? ""), "utf8");
const textBytes = (content) =>
  typeof content === "string" ? bytes(content) : (content || []).reduce((a, b) => a + (b.type === "text" ? bytes(b.text) : b.type === "image" ? 4800 : bytes(b)), 0);

// Najdražji odgovor, ki ga API sploh lahko vrne za te parametre (gl. server/meje-ai.js, rezerva klica).
// Ves vhod zapisan v predpomnilnik za 1 h (2× cena vhoda), izhod = max_tokens; s strežniškim nadomestnim modelom
// (fallback, ne Haiku) še zavrnjen poskus enake cene (extra_cost_usd, pregled #462 S6).
function worstUsage({ system, messages, tools, mode, fallback = false }) {
  const input = messages.reduce((a, m) => a + 20 + textBytes(m.content), 0) + Math.ceil((bytes(system) + bytes(tools)) / 2);
  const u = { input_tokens: 0, cache_creation_input_tokens: input, cache_creation: { ephemeral_5m_input_tokens: 0, ephemeral_1h_input_tokens: input }, output_tokens: modeParams(mode).max_tokens };
  const model = modeParams(mode).model;
  return fallback !== false && supportsFallback(model) ? { ...u, extra_cost_usd: costUsd(model, u) } : u;
}

function napadalec(log) {
  return async (p) => {
    p.onText?.("Rešimo korak za korakom.");
    await new Promise((r) => setTimeout(r, 80));
    const usage = worstUsage(p);
    const model = modeParams(p.mode).model;
    log.push(costUsd(model, usage));
    return { text: "Rešimo korak za korakom." + META, stopReason: "end_turn", usage, model };
  };
}

// Vsaka meja profila po napadu: porabljeno ≤ meja (z vsemi rezervacijami sproščenimi).
// caps: meje, ki so veljale med napadom (paket pred testom po porabi preide v brezplačni paket, capsFor ga ne vrne več).
function assertUnderCaps(app, kidId, label, caps = app.locals.usage.capsFor(kidId)) {
  const usage = app.locals.usage;
  assert.equal(usage.inflight.size, 0, `${label}: rezervacije po koncu niso sproščene`);
  assert.ok(caps.length > 0, `${label}: profil nima nobene meje`);
  for (const c of caps) assert.ok((c.spent || 0) <= c.usd + 1e-9, `${label}: meja ${c.key} prekoračena: ${c.spent} > ${c.usd}`);
  return caps;
}

// Poraba do »prostor = room $« pod najtesnejšo mejo (napad naj mejo res doseže, ne glede na velikost paketa).
function spendTo(app, store, kidId, room) {
  const { cap } = app.locals.usage.tightest(kidId);
  const pid = store.db.prepare("SELECT parent_id FROM students WHERE id = ?").get(kidId).parent_id;
  const need = cap.usd - (cap.spent || 0) - room;
  if (need > 0) store.db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd, parent_id) VALUES (?, 'claude-haiku-4-5', 'chat', ?, ?)").run(kidId, need, pid);
  return cap;
}

// Poševnica na koncu, »//«, velike črke v predponi: 404 (točka A1). Velike črke za /api, »?x«, »./« in »01«:
// Express jih ujame kot isto pot, zato morajo šteti v isto mejo (preverjeno spodaj s skupno porabo).
const POTI = (id) => [
  `/api/conversations/${id}/messages/`,
  `/api//conversations/${id}/messages`,
  `/API/conversations/${id}/messages`,
  `/api/conversations/${id}/MESSAGES/`,
  `/api/Conversations/${id}/messages`,
  `/api/conversations/${id}/MESSAGES`,
  `/api/conversations/${id}/messages?x=1`,
  `/api/conversations/0${id}/messages`,
];
const ZAVRNJENE = 4; // prve štiri oblike morajo dobiti 404

// N hkratnih sporočil (vsako v svojem pogovoru, polovica »Razloži podrobneje«) + iste zahteve na nekanoničnih poteh.
async function napad(call, kidId, n) {
  const convs = await Promise.all(Array.from({ length: n }, () => call(`/api/students/${kidId}/conversations`, { method: "POST" })));
  for (const c of convs) assert.ok(c.status < 300, JSON.stringify(c.body));
  const ids = convs.map((c) => c.body.id);
  const glavne = ids.map((id, i) => call(`/api/conversations/${id}/messages`, { method: "POST", body: { text: `Koliko je ${i} + ${i}? Razloži.`, deep: i % 2 === 1 } }));
  const obvozi = ids.slice(0, 4).flatMap((id, i) => POTI(id).map((p) => call(p, { method: "POST", body: { text: `obvoz ${i}` } })));
  const [r, poti] = await Promise.all([Promise.all(glavne), Promise.all(obvozi)]);
  // 429 zaradi meje v $ (ne dnevnega števila vprašanj): koda block.daily ni dokaz meje stroška.
  const denar = [...r, ...poti].filter((x) => x.status === 429 && x.body?.code !== "block.daily").length;
  return { r, statusi: r.map((x) => x.status), poti, denar };
}

// Dnevno število vprašanj visoko: v teh testih mora ustaviti meja v $.
const BREZ_DNEVNE = { EVKLID_FREE_DAILY_QUESTIONS: "1000", EVKLID_OSEBNO_DAILY_QUESTIONS: "1000", EVKLID_DAILY_QUESTIONS: "1000" };

const PAKETI = [
  { ime: "brezplačni", env: {}, priprava: () => {}, paket: /freepool/ },
  { ime: "preizkus 7 dni", env: {}, priprava: (store) => store.db.prepare("UPDATE parents SET trial_ends_at = ?").run(new Date(Date.now() + 5 * DAY).toISOString()), paket: /nopaypool/ },
  { ime: "aktivacijska koda", env: {}, priprava: (store) => store.db.prepare("UPDATE parents SET promo_until = ?").run(new Date(Date.now() + 60 * DAY).toISOString()), paket: /nopaypool/ },
  { ime: "pilot", env: { EVKLID_PILOT_EMAILS: "meja@x.si", EVKLID_PILOT_DO: dayIso(20) }, priprava: () => {}, paket: /block\.shareOut/ },
  { ime: "naročnina", env: {}, priprava: (store) => store.db.prepare("UPDATE parents SET sub_status = 'active', sub_seats = 1").run(), paket: /"s:\d+"/, ne: /freepool|nopaypool/ },
  {
    ime: "dnevna vstopnica (paket pred testom)",
    env: {},
    priprava: (store, kid) => {
      const pid = store.db.prepare("SELECT parent_id FROM students WHERE id = ?").get(kid.id).parent_id;
      store.db
        .prepare("INSERT INTO passes (parent_id, student_id, days, amount, currency, ai_usd, status, starts_at, ends_at, level) VALUES (?, ?, 7, 519, 'EUR', 0.75, 'active', ?, ?, 'SS')")
        .run(pid, kid.id, new Date(Date.now() - DAY).toISOString(), new Date(Date.now() + 6 * DAY).toISOString());
    },
    paket: /pass:/,
    // Porabljen paket preide v brezplačni paket (billing.js passPremium), ta pa šteje porabo paketa: preveri mejo paketa.
    meje: (store, kid) => {
      const ps = store.db.prepare("SELECT * FROM passes WHERE student_id = ?").get(kid.id);
      const spent = store.db.prepare("SELECT COALESCE(SUM(cost_usd),0) AS s FROM usage WHERE student_id = ? AND created_at >= datetime(?)").get(kid.id, ps.starts_at).s;
      return [{ key: `pass:${ps.id}`, usd: passCapUsd(ps), spent }];
    },
  },
];

for (const paket of PAKETI) {
  test(`meja AI: ${paket.ime}: 24 hkratnih vprašanj in obvozi poti ne preseže meje`, { timeout: 60_000 }, async () => {
    const log = [];
    await withAccounts(
      { ...BREZ_DNEVNE, ...paket.env },
      async ({ call, store, kid, app }) => {
        paket.priprava(store, kid);
        // Priprava res velja (sicer bi test tiho preverjal brezplačni paket): ključ ali koda meje paketa.
        const opis = JSON.stringify(app.locals.usage.capsFor(kid.id).map((c) => [c.key, c.code]));
        assert.match(opis, paket.paket, `${paket.ime}: meje ${opis}`);
        if (paket.ne) assert.doesNotMatch(opis, paket.ne, `${paket.ime}: meje ${opis}`);
        // Brezplačni rep naročnika je razporejen po dnevih (server/usage.js tailToday, j 2026-11-17): zadnji dan obdobja
        // je ves preostali rep današnji del, zato tu ustavi le trda meja v $, ki jo ta test preverja.
        app.locals.usage.periodEndOf = () => new Date(Math.ceil((Date.now() + 1) / DAY) * DAY).toISOString();
        // Malo prostora (0,10 $): napad mora mejo res doseči, ne glede na velikost paketa.
        spendTo(app, store, kid.id, 0.1);
        const { statusi, poti, denar } = await napad(call, kid.id, 24);
        assert.ok(statusi.includes(200), `${paket.ime}: noben odgovor (${statusi})`);
        assert.ok(denar > 0, `${paket.ime}: meja v $ ni bila dosežena (${statusi})`);
        poti.forEach((p, k) => {
          if (k % POTI(0).length < ZAVRNJENE) assert.equal(p.status, 404, `${paket.ime}: ${POTI("ID")[k % POTI(0).length]} ni zavrnjena: ${p.status}`);
        });
        assertUnderCaps(app, kid.id, paket.ime, paket.meje?.(store, kid));
        const ok = [...statusi, ...poti.map((p) => p.status)].filter((s) => s === 200).length;
        assert.equal(log.length, ok, "vsak klic modela je en odgovor 200 (tudi na drugačni obliki poti), noben mimo meje");
      },
      { streamFn: napadalec(log) },
    );
  });
}

test("meja AI: dva profila hkrati ne presežeta skupnega deleža (pilot, Družina)", { timeout: 60_000 }, async () => {
  const log = [];
  await withAccounts(
    { ...BREZ_DNEVNE, EVKLID_PILOT_EMAILS: "meja@x.si", EVKLID_PILOT_DO: dayIso(20) },
    async ({ call, store, kid, app }) => {
      const pid = store.db.prepare("SELECT parent_id FROM students WHERE id = ?").get(kid.id).parent_id;
      const settings = store.db.prepare("SELECT settings FROM students WHERE id = ?").get(kid.id).settings;
      const second = Number(store.db.prepare("INSERT INTO students (name, settings, parent_id) VALUES ('Eva', ?, ?)").run(settings, pid).lastInsertRowid);
      spendTo(app, store, kid.id, 0.1);
      const [a, b] = await Promise.all([napad(call, kid.id, 12), napad(call, second, 12)]);
      assert.ok(a.denar + b.denar > 0, `meja v $ ni bila dosežena (${[...a.statusi, ...b.statusi]})`);
      // Kateri profil dobi prostor prvi, je stvar vrstnega reda zahtev; skupna meja mora biti ena (isti ključ).
      assert.ok([...a.statusi, ...b.statusi].includes(200), "vsaj en odgovor");
      assert.equal(app.locals.usage.capsFor(kid.id)[0].key, app.locals.usage.capsFor(second)[0].key, "profila nimata skupne meje");
      assertUnderCaps(app, kid.id, "prvi profil");
      assertUnderCaps(app, second, "drugi profil");
    },
    { streamFn: napadalec(log) },
  );
});

test("meja AI: dnevna meja vprašanj zdrži 30 hkratnih vprašanj (brezplačni paket, 10 na dan)", { timeout: 60_000 }, async () => {
  const log = [];
  await withAccounts(
    { EVKLID_FREE_DAILY_QUESTIONS: "10", EVKLID_FREE_STUDENT_USD: "100", EVKLID_FREE_POOL_USD: "1000" },
    async ({ call, kid }) => {
      const { statusi } = await napad(call, kid.id, 30);
      const ok = statusi.filter((s) => s === 200).length;
      assert.ok(ok <= 10, `odgovorov ${ok}, dovoljenih 10 (${statusi})`);
      assert.ok(ok >= 1);
    },
    { streamFn: napadalec(log) },
  );
});

test("rezerva klica pokrije najdražji mogoči odgovor (vsi načini, dolg pogovor, slika)", () => {
  const system = [{ type: "text", text: "Navodila inštruktorju. ".repeat(4000) }];
  const tools = [{ name: "nastavitve", description: "x".repeat(2000), input_schema: { type: "object" } }];
  const dolg = Array.from({ length: 30 }, (_, i) => ({ role: i % 2 ? "assistant" : "user", content: [{ type: "text", text: `Sporočilo ${i}: ${"čšž ".repeat(300)}` }] }));
  const slika = [{ role: "user", content: [{ type: "image", source: { type: "base64", media_type: "image/png", data: "AAAA" } }, { type: "text", text: "Kaj je na sliki?" }] }];
  for (const mode of ["lite", "chat", "think", "mid", "deep"]) {
    for (const messages of [dolg, slika]) {
      for (const fallback of [false, true]) {
        const reserve = replyReserveUsd({ mode, system, messages, tools, fallback });
        const worst = costUsd(modeParams(mode).model, worstUsage({ system, messages, tools, mode, fallback }));
        assert.ok(reserve >= worst - 1e-12, `${mode} (fallback ${fallback}): rezerva ${reserve} < najdražji odgovor ${worst}`);
      }
    }
  }
});

test("meja AI: drugi klici AI (skener, fotografija urnika, zapiski, ustno, anketa) delijo isto rezervacijo", { timeout: 60_000 }, async () => {
  await withAccounts({ ...BREZ_DNEVNE }, async ({ store, kid, app }) => {
    const usage = app.locals.usage;
    spendTo(app, store, kid.id, 0.1);
    const model = modeParams("chat").model;
    const u = { input_tokens: 60_000, output_tokens: 8000 }; // ~6 klicev v 0,10 $
    const r = costUsd(model, u);
    // 60 hkratnih klicev različnih vrst (usage.guard kot v server/scan.js, schedule-api.js, zapiski.js, ustno-api.js, feedback.js).
    const vrste = ["skeniranje", "urnik", "zapiski", "ustno", "anketa"];
    const izidi = await Promise.all(
      Array.from({ length: 60 }, async (_, i) => {
        const h = usage.guard(kid.id, r);
        if (!h) return false;
        await new Promise((ok) => setTimeout(ok, 20 + (i % 7) * 5));
        usage.log(kid.id, model, u, vrste[i % vrste.length]);
        h.release();
        return true;
      }),
    );
    const ok = izidi.filter(Boolean).length;
    assert.ok(ok >= 1 && ok < 60, `dovoljenih klicev: ${ok}`);
    assertUnderCaps(app, kid.id, "drugi klici");
  });
});

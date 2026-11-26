// K-09 (načrt dviga kakovosti, j 26. 11. 2026): integracijski testi med moduli. Vsak test gre skozi več modulov prek
// HTTP, kot jih uporablja aplikacija, z lažnim modelom, branjem rokopisa, Stripom in Resendom (brez omrežja, brez AI):
//   1. Vadnica → fotografija zapisa (branje rokopisa) → preverjanje odgovora → napredek
//   2. Priprava na test iz zapiskov → kviz (naloge Vadnice) → napredek priprave in skupni napredek
//   3. Pogovor z inštruktorjem → kartice za ponavljanje → ponovitev kartice → napredek
//   4. Registracija → profil → plačilo (Stripe v testnem načinu, webhook) → pravice (inštruktor, kamera v inštruktorju)
import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { signWebhook } from "../server/accounts/stripe.js";
import { fmt } from "../server/practice/check.js";
import { getTopic } from "../server/curriculum.js";

process.env.EVKLID_DATA_KEY ||= crypto.randomBytes(32).toString("base64");

const YEAR = new Date().getFullYear();
const SECRET = "whsec_integracija";
const TIHO = { log() {}, info() {}, warn() {}, error() {} };
const PNG = "data:image/png;base64,iVBORw0KGgo=";

// Pravilen odgovor iz zapisa naloge (payload.answer), kot bi ga vpisal učenec: zaokrožen kot v šoli (fmt iz preverjanja,
// 5 navzgor; toFixed bi 1854,4049999 zaokrožil na 1854,40 in preverjanje bi reklo »zaokroževanje«).
function pravilno(a) {
  if (a.type === "number") {
    const v = fmt(a.value, Number.isInteger(a.decimals) ? a.decimals : null).replace("−", "-");
    return `${v}${a.unit ? ` ${a.unit}` : ""}`;
  }
  if (a.type === "fraction") return `${a.num}/${a.den}`;
  if (a.type === "choice") return String(a.index);
  if (a.type === "coefficients") return a.values.join(", ");
  throw new Error(`neznana vrsta odgovora ${a.type}`);
}

// Lažni Stripe in Resend (kot test/accounts.test.js).
function lazniSplet(klici) {
  let n = 0;
  return async (url, init = {}) => {
    const body = init.body ? (init.headers?.["Content-Type"]?.includes("json") ? JSON.parse(init.body) : Object.fromEntries(new URLSearchParams(init.body))) : null;
    const u = new URL(url);
    klici.push({ method: init.method, path: u.pathname, body, host: u.host });
    const ok = (data) => ({ ok: true, status: 200, json: async () => data });
    if (u.host === "api.resend.com") return ok({ id: "email_" + ++n });
    const p = u.pathname.replace("/v1", "");
    if (p === "/customers") return ok({ id: "cus_" + ++n });
    if (p === "/prices" && init.method === "GET") return ok({ data: [] });
    if (p === "/products") return ok({ id: "prod_1" });
    if (p === "/prices") return ok({ id: "price_" + body.lookup_key });
    if (p === "/checkout/sessions") return ok({ id: "cs_1", url: "https://checkout.stripe.test/cs_1" });
    if (p.startsWith("/subscriptions")) return ok({ data: [] });
    return { ok: false, status: 404, json: async () => ({ error: { message: "ni" } }) };
  };
}

async function streznik({ racuni = false, odgovor = "V redu.", ...dodatno } = {}) {
  const store = openDb(":memory:");
  const klici = [];
  const modelu = [];
  const app = createApp(store, {
    scheduler: false,
    log: TIHO,
    ...(racuni ? { accounts: true, stripeKey: "sk_test_x", resendKey: "re_x", webhookSecret: SECRET, fetchFn: lazniSplet(klici) } : {}),
    streamFn: async (args) => {
      modelu.push(args);
      const besedilo = typeof odgovor === "function" ? odgovor(modelu.length) : odgovor;
      args.onText?.(besedilo.replace(/<<[\s\S]*?>>/g, ""));
      return { text: besedilo, stopReason: "end_turn" };
    },
    ...dodatno,
  });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const jar = {};
  const klic = async (pot, o = {}) => {
    const res = await fetch(base + pot, {
      method: o.method || "GET",
      redirect: "manual",
      headers: { "Content-Type": "application/json", cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; "), ...(o.headers || {}) },
      body: o.raw ?? (o.body ? JSON.stringify(o.body) : undefined),
    });
    for (const c of res.headers.getSetCookie()) {
      const [kv] = c.split(";");
      jar[kv.slice(0, kv.indexOf("="))] = kv.slice(kv.indexOf("=") + 1);
    }
    const type = res.headers.get("content-type") || "";
    return { status: res.status, body: type.includes("json") ? await res.json() : await res.text() };
  };
  const konec = async () => {
    await new Promise((r) => server.close(r));
    store.db.close();
  };
  return { store, klic, klici, modelu, konec };
}

const naloga = (store, id) => JSON.parse(store.db.prepare("SELECT payload FROM tasks WHERE id = ?").get(id).payload);
const temaNapredka = async (klic, sid, topicId) => (await klic(`/api/students/${sid}/progress`)).body.topics.find((t) => t.topic_id === topicId);

test("K-09 pot 1: Vadnica → fotografija zapisa → preverjanje → napredek", async () => {
  // Branje rokopisa (model) je lažno: »prebere« pravilen odgovor naloge, ki je na fotografiji.
  const prebrano = [];
  let naFotografiji = "";
  const readFn = async (o) => {
    prebrano.push(o);
    return { text: naFotografiji, usage: { input_tokens: 400, output_tokens: 8 }, model: "claude-haiku-5-5" };
  };
  const { store, klic, konec } = await streznik({ readFn });
  try {
    const s = (await klic("/api/students", { method: "POST", body: { name: "Ana", settings: { educational_track: "OSNOVNA_SOLA", curriculum_level: "8. razred", subject: "MAT" } } })).body;
    const tema = "MAT-OS-8/pitagorov-izrek";
    await klic(`/api/students/${s.id}/practice/next`, { method: "POST", body: { topic_id: tema } }); // zgled
    const { task } = (await klic(`/api/students/${s.id}/practice/next`, { method: "POST", body: { topic_id: tema } })).body;
    assert.ok(task?.id, "Vadnica da nalogo");
    const ans = naloga(store, task.id).answer;
    naFotografiji = pravilno(ans);

    // Fotografija zapisa gre v branje rokopisa z vrsto odgovora naloge; prepis učenec potrdi.
    const r = await klic(`/api/students/${s.id}/tasks/${task.id}/read`, { method: "POST", body: { image: PNG } });
    assert.equal(r.status, 200, JSON.stringify(r.body));
    assert.equal(r.body.text, naFotografiji);
    assert.deepEqual([prebrano[0].answerType, prebrano[0].withUnit], [ans.type, !!ans.unit], "branje dobi vrsto odgovora naloge");
    assert.equal(store.db.prepare("SELECT kind FROM usage WHERE student_id = ?").get(s.id)?.kind, "ocr", "branje je zapisano v porabi");

    // Prebrani zapis preveri koda Vadnice: pravilno, XP, naloga zaprta.
    const odg = await klic(`/api/students/${s.id}/tasks/${task.id}/answer`, { method: "POST", body: { answer: r.body.text } });
    assert.equal(odg.status, 200, JSON.stringify(odg.body));
    assert.equal(odg.body.kind, "correct");
    assert.ok(odg.body.xp?.gained > 0, "pravilen odgovor da XP");
    const vrstica = store.db.prepare("SELECT solved, first_try_correct FROM tasks WHERE id = ?").get(task.id);
    assert.deepEqual([vrstica.solved, vrstica.first_try_correct], [1, 1]);

    // Napredek (skupni pogled vseh virov) pozna temo in nima napake.
    const t = await temaNapredka(klic, s.id, tema);
    assert.ok(t, "tema je v napredku");
    assert.ok(t.turns >= 1 && t.errors === 0, JSON.stringify(t));

    // Napačen prepis (učenec potrdi napačno branje) se šteje kot napačen poskus, ne kot pravilen.
    const { task: druga } = (await klic(`/api/students/${s.id}/practice/next`, { method: "POST", body: { topic_id: tema } })).body;
    const napacno = await klic(`/api/students/${s.id}/tasks/${druga.id}/answer`, { method: "POST", body: { answer: `1234${naloga(store, druga.id).answer.unit ? ` ${naloga(store, druga.id).answer.unit}` : ""}` } });
    assert.equal(napacno.body.kind, "wrong", JSON.stringify(napacno.body));
  } finally {
    await konec();
  }
});

test("K-09 pot 2: priprava iz zapiskov → kviz z nalogami Vadnice → napredek priprave in skupni napredek", async () => {
  const { store, klic, konec } = await streznik();
  try {
    const s = (await klic("/api/students", { method: "POST", body: { name: "Eva", settings: { curriculum_level: "4. letnik", educational_track: "SREDNJA_SOLA", subject: "MAT" } } })).body;
    const p = (await klic(`/api/students/${s.id}/priprave`, { method: "POST", body: { naslov: "Integrali", predmet: "MAT" } })).body.priprava;
    const zap = fs.readFileSync(new URL("./fixtures/priprava/mat-integrali.md", import.meta.url), "utf8");
    assert.equal((await klic(`/api/students/${s.id}/priprave/${p.id}/teme`)).body.teme.length, 0, "brez zapiskov ni tem");
    assert.equal((await klic(`/api/students/${s.id}/priprave/${p.id}/viri`, { method: "POST", body: { besedilo: zap } })).status, 201);

    // Teme priprave prepozna koda iz zapiskov (brez načrta testa): obe temi integralov z izseki zapiskov.
    const iz = (await klic(`/api/students/${s.id}/priprave/${p.id}/teme`)).body;
    const izZapiskov = new Map(iz.teme.filter((t) => t.izseki.length > 0).map((t) => [t.id, t.izseki.length]));
    for (const id of ["MAT-SS-4/nedoloceni-integral", "MAT-SS-4/doloceni-integral"]) assert.ok(izZapiskov.has(id), `${id} iz zapiskov: ${JSON.stringify([...izZapiskov])}`);

    const pred = (await klic(`/api/students/${s.id}/priprave/${p.id}/napredek`)).body;
    assert.ok(pred.teme.length > 0, "načrt ima teme");
    const vse = (x) => x.teme.reduce((a, t) => a + t.nalog, 0);
    assert.equal(vse(pred), 0, "pred kvizom ni rešenih nalog");

    // Kviz: seja »list« z nalogami Vadnice iz tem zapiskov; vse odgovorimo pravilno, dokler seja ne pokaže povzetka.
    let kv = await klic(`/api/students/${s.id}/priprave/${p.id}/kviz`, { method: "POST", body: { dolzina: 6 } });
    assert.equal(kv.status, 200, JSON.stringify(kv.body));
    const seja = kv.body.sessionId;
    const resene = [];
    for (let i = 0; i < 8 && kv.body?.task; i++) {
      assert.equal(kv.body.sessionId, seja, "ista seja kviza");
      const id = kv.body.task.id;
      const a = await klic(`/api/students/${s.id}/tasks/${id}/answer`, { method: "POST", body: { answer: pravilno(naloga(store, id).answer) } });
      assert.equal(a.status, 200, JSON.stringify(a.body));
      assert.equal(a.body.kind, "correct", `${JSON.stringify(naloga(store, id).answer)} → ${JSON.stringify(a.body)}`);
      resene.push(id);
      kv = { body: a.body.next };
      if (i === 2) {
        // Ponovno odprt kviz (drug zavihek, vrnitev) istega dne nadaljuje isto sejo pri isti nalogi.
        const znova = await klic(`/api/students/${s.id}/priprave/${p.id}/kviz`, { method: "POST", body: { dolzina: 6 } });
        assert.deepEqual([znova.body.sessionId, znova.body.task?.id], [seja, kv.body.task?.id], "nadaljevanje kviza");
      }
    }
    assert.equal(resene.length, 6, `rešenih nalog kviza: ${resene.length}`);
    assert.equal(kv.body.finished, true, `konec kviza: ${JSON.stringify(kv.body).slice(0, 300)}`);
    assert.deepEqual([kv.body.sessionId, kv.body.kind, kv.body.total, kv.body.correct], [seja, "list", 6, 6]);
    assert.ok(kv.body.list, "povzetek kviza po temah");
    const teme = [...new Set(resene.map((id) => store.db.prepare("SELECT topic_id FROM tasks WHERE id = ?").get(id).topic_id))];
    const izTem = new Set([...izZapiskov.keys()].flatMap((id) => [id, ...(getTopic(id)?.base || [])]));
    for (const tema of teme) assert.ok(izTem.has(tema), `naloga kviza iz teme zapiskov (ali njene osnovne teme): ${tema}`);

    // Napredek priprave šteje rešene naloge kviza (pravilne v prvo); skupni napredek pozna iste teme.
    const po = (await klic(`/api/students/${s.id}/priprave/${p.id}/napredek`)).body;
    const ok = po.teme.reduce((a, t) => a + t.pravilnihVPrvo, 0);
    assert.ok(vse(po) >= resene.length && ok >= resene.length, JSON.stringify(po.teme.map((t) => [t.id, t.nalog, t.pravilnihVPrvo])));
    assert.ok(po.pripravljenost.odstotek > (pred.pripravljenost.odstotek ?? 0), `pripravljenost ${JSON.stringify(pred.pripravljenost)} → ${JSON.stringify(po.pripravljenost)}`);
    for (const tema of teme) {
      const t = await temaNapredka(klic, s.id, tema);
      assert.ok(t && t.turns >= 1 && t.errors === 0, `${tema}: ${JSON.stringify(t)}`);
    }
  } finally {
    await konec();
  }
});

test("K-09 pot 3: pogovor z inštruktorjem → kartice → ponovitev kartice → napredek", async () => {
  const odgovor =
    "Hipotenuzo dobiš s Pitagorovim izrekom: $c = \\sqrt{a^2 + b^2}$.\n" +
    "<<KARTICA\nV: Kako izračunaš hipotenuzo pravokotnega trikotnika?\nO: $c = \\sqrt{a^2 + b^2}$\n>>\n" +
    '<<META subject=MAT topic="Pitagorov izrek" error=1 mode=A flag=none>>';
  const { store, klic, modelu, konec } = await streznik({ odgovor });
  try {
    const s = (await klic("/api/students", { method: "POST", body: { name: "Bor", settings: { educational_track: "OSNOVNA_SOLA", curriculum_level: "8. razred", subject: "MAT" } } })).body;
    const c = (await klic(`/api/students/${s.id}/conversations`, { method: "POST" })).body;
    const r = await klic(`/api/conversations/${c.id}/messages`, { method: "POST", body: { text: "Kako dobim hipotenuzo, če sta kateti 3 in 4?" } });
    assert.equal(r.status, 200);
    assert.equal(modelu.length, 1, "en klic modela");
    assert.match(r.body, /event: done/);
    assert.doesNotMatch(r.body, /<<META|<<KARTICA/, "oznake ne pridejo do učenca");

    // Kartica iz odgovora je shranjena in povezana s pogovorom.
    const kartice = (await klic(`/api/students/${s.id}/flashcards`)).body;
    const k = (Array.isArray(kartice) ? kartice : kartice.cards || []).find((x) => /hipotenuzo/.test(x.front));
    assert.ok(k, `kartica iz pogovora: ${JSON.stringify(kartice).slice(0, 300)}`);
    assert.equal(store.db.prepare("SELECT conversation_id FROM flashcards WHERE id = ?").get(k.id)?.conversation_id, c.id);

    // Napaka iz pogovora (META error=1) je v napredku kot napaka teme iz klepeta.
    const pitagora = (x) => /pitagor/i.test(`${x.topic} ${x.topic_id}`);
    const pred = (await klic(`/api/students/${s.id}/progress`)).body.topics.find(pitagora);
    assert.ok(pred, "tema iz pogovora v napredku");
    assert.ok(pred.errors >= 1, JSON.stringify(pred));
    const kartic = () => store.db.prepare("SELECT COALESCE(SUM(n), 0) AS n, COALESCE(SUM(wrong), 0) AS w FROM skill_results WHERE student_id = ? AND source = 'cards'").get(s.id);
    assert.deepEqual({ ...kartic() }, { n: 0, w: 0 }, "pred ponovitvijo ni rezultata kartic");

    // Ponovitev kartice (»znal sem«): kartica gre v naslednji predal z datumom v prihodnosti, rezultat gre v šibke točke
    // pod temo pogovora, napredek teme pa ga šteje.
    const rev = await klic(`/api/students/${s.id}/flashcards/${k.id}/review`, { method: "POST", body: { ok: true } });
    assert.equal(rev.status, 200, JSON.stringify(rev.body));
    assert.equal(rev.body.card.box, k.box + 1, JSON.stringify(rev.body.card));
    assert.ok(rev.body.card.due > store.db.prepare("SELECT datetime('now') AS t").get().t, `naslednja ponovitev v prihodnosti: ${rev.body.card.due}`);
    assert.equal(rev.body.due, 0, "danes ni več kartic za ponovitev");
    assert.deepEqual({ ...kartic() }, { n: 1, w: 0 });
    const po = (await klic(`/api/students/${s.id}/progress`)).body.topics.find(pitagora);
    assert.equal(po.turns, pred.turns + 1, `ponovitev kartice v napredku: ${JSON.stringify(pred)} → ${JSON.stringify(po)}`);
  } finally {
    await konec();
  }
});

test("K-09 pot 4: registracija → profil → plačilo (Stripe, testni način) → pravice inštruktorja in skeniranja", async () => {
  const prev = process.env.EVKLID_FREE_DAILY_QUESTIONS;
  let srv = null;
  try {
    process.env.EVKLID_FREE_DAILY_QUESTIONS = "1";
    // Kamera v inštruktorju (scan/read-task) je plačljiva pravica: velja dnevna meja brezplačnih vprašanj.
    const branj = [];
    const scanReadTaskFn = async () => (branj.push(1), { text: "Reši enačbo $x + 2 = 5$.", usage: { input_tokens: 500, output_tokens: 20 }, model: "claude-haiku-5-5" });
    srv = await streznik({ racuni: true, odgovor: 'Poglejva.\n<<META subject=MAT topic="-" error=0 mode=A flag=none>>', scanReadTaskFn });
    const { store, klic, klici } = srv;
    const reg = await klic("/api/auth/register", { method: "POST", body: { email: "integracija@primer.si", password: "geslo1234", accept_privacy: true, birth_date: "1985-04-12" } });
    assert.equal(reg.status, 201, JSON.stringify(reg.body));
    const mail = klici.filter((c) => c.host === "api.resend.com").at(-1);
    assert.equal((await klic(/\/api\/auth\/verify\?token=[\w-]+/.exec(mail.body.text)[0])).status < 400, true, "potrditev e-naslova");

    const kid = await klic("/api/students", { method: "POST", body: { name: "Lan", birth_year: YEAR - 16, consent: true } });
    assert.equal(kid.status, 201, JSON.stringify(kid.body));
    const sid = kid.body.id;
    store.db.prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z'").run(); // preizkus je potekel

    const conv = (await klic(`/api/students/${sid}/conversations`, { method: "POST" })).body;
    const vprasaj = (t) => klic(`/api/conversations/${conv.id}/messages`, { method: "POST", body: { text: t } });
    assert.equal((await vprasaj("prvo")).status, 200, "brezplačno vprašanje");
    const blok = await vprasaj("drugo");
    assert.equal(blok.status, 429, "brezplačna meja");
    assert.equal(blok.body.code, "block.freeDaily");
    assert.equal((await klic("/api/account")).body.access.tier === "paid", false);
    const skeniraj = () => klic(`/api/students/${sid}/scan/read-task`, { method: "POST", body: { image: PNG } });
    const skenPred = await skeniraj();
    assert.equal(skenPred.status, 429, `kamera pred plačilom: ${JSON.stringify(skenPred.body)}`);
    assert.equal(skenPred.body.code, "block.freeDaily");
    assert.equal(branj.length, 0, "branje pred plačilom ne kliče modela");

    // Plačilo v testnem načinu: checkout s soglasji, nato webhook Stripa (podpisan) aktivira naročnino.
    const co = await klic("/api/billing/checkout", { method: "POST", body: { seats: 1, interval: "year", adult: true, withdrawal: true, terms: true } });
    assert.equal(co.status, 200, JSON.stringify(co.body));
    assert.match(co.body.url, /^https:\/\/checkout\.stripe\.test\//);
    const cena = klici.find((c) => c.path === "/v1/checkout/sessions").body["line_items[0][price]"];
    const customer = store.db.prepare("SELECT stripe_customer_id FROM parents").get().stripe_customer_id;
    assert.ok(customer, "kupec v Stripu");
    const event = {
      type: "customer.subscription.updated",
      data: { object: { id: "sub_int", customer, status: "active", cancel_at_period_end: false, items: { data: [{ price: { id: "price_x", lookup_key: cena.replace(/^price_/, "") }, current_period_end: 1893456000 }] } } },
    };
    const raw = JSON.stringify(event);
    assert.equal((await klic("/api/stripe/webhook", { method: "POST", raw, headers: { "stripe-signature": signWebhook(raw, "napacen") } })).status, 400, "napačen podpis");
    assert.equal((await klic("/api/stripe/webhook", { method: "POST", raw, headers: { "stripe-signature": signWebhook(raw, SECRET) } })).status, 200);

    // Pravice po plačilu: račun plačan, inštruktor odgovarja naprej, skeniranje bere in zapiše porabo.
    assert.equal((await klic("/api/account")).body.access.tier, "paid");
    assert.equal((await vprasaj("tretje")).status, 200, "po plačilu ni brezplačne meje");
    const sken = await skeniraj();
    assert.equal(sken.status, 200, JSON.stringify(sken.body));
    assert.match(sken.body.text, /x \+ 2 = 5/);
    assert.equal(branj.length, 1);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM usage WHERE student_id = ? AND kind = 'skeniranje'").get(sid).n, 1, "branje je zapisano v porabi");
  } finally {
    if (prev === undefined) delete process.env.EVKLID_FREE_DAILY_QUESTIONS;
    else process.env.EVKLID_FREE_DAILY_QUESTIONS = prev;
    await srv?.konec();
  }
});

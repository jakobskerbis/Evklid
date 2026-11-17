// Prvo besedilo inštruktorja prej (j, 17. 11. 2026): časi odgovora (server/casi-odgovora.js), dogodek »Razmišljam …«
// (onPhase v server/claude.js) in poskus brez razmišljanja za lahek prvi korak (server/hitri-korak.js, privzeto izklopljen).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { hitriKorak } from "../server/hitri-korak.js";
import { logCasi, casiPovzetek, pocistiCasi, pozabiPovzetek } from "../server/casi-odgovora.js";
import { presolve } from "../server/live-check.js";

const OS = { educational_track: "OSNOVNA_SOLA", curriculum_level: "8. razred", subject: "MAT" };
const withFlag = async (val, fn) => {
  const prev = process.env.EVKLID_HITRI_KORAK;
  if (val === undefined) delete process.env.EVKLID_HITRI_KORAK;
  else process.env.EVKLID_HITRI_KORAK = val;
  try {
    return await fn();
  } finally {
    if (prev === undefined) delete process.env.EVKLID_HITRI_KORAK;
    else process.env.EVKLID_HITRI_KORAK = prev;
  }
};

test("hitri korak: privzeto izklopljen; z zastavico samo Haiku, OŠ/SŠ, način A, brez slike, z rešitvijo reševalnika", async () => {
  const pre = presolve("Reši enačbo 3x + 7 = 22.", { first: true });
  assert.ok(pre);
  const ok = { mode: "chat", settings: OS, pre, isFirst: true };
  await withFlag(undefined, () => assert.equal(hitriKorak(ok), false, "privzeto izklopljen"));
  await withFlag("0", () => assert.equal(hitriKorak(ok), false));
  await withFlag("1", () => {
    assert.equal(hitriKorak(ok), true);
    assert.equal(hitriKorak({ ...ok, mode: "lite" }), true);
    assert.equal(hitriKorak({ ...ok, settings: { educational_track: "SREDNJA_SOLA", curriculum_level: "2. letnik" } }), true);
    for (const mode of ["deep", "mid", "think"]) assert.equal(hitriKorak({ ...ok, mode }), false, mode);
    assert.equal(hitriKorak({ ...ok, pre: null }), false, "reševalnik naloge ni rešil");
    assert.equal(hitriKorak({ ...ok, isFirst: false }), false, "samo prvo sporočilo pogovora");
    assert.equal(hitriKorak({ ...ok, image: true }), false);
    assert.equal(hitriKorak({ ...ok, settings: { ...OS, solving_mode: "B" } }), false);
    assert.equal(hitriKorak({ ...ok, settings: { ...OS, track: "COMPETITION" } }), false);
    assert.equal(hitriKorak({ ...ok, competition: true }), false);
    assert.equal(hitriKorak({ ...ok, settings: { educational_track: "UNIVERZA", curriculum_level: "1. letnik" } }), false);
  });
});

async function pogovor(fn, { text = "Reši enačbo 3x + 7 = 22.", streamFn }) {
  const store = openDb(":memory:");
  const app = createApp(store, { streamFn, scheduler: false });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (p, body) => fetch(base + p, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  try {
    const s = await (await post("/api/students", { name: "Eva", settings: OS })).json();
    const c = await (await post(`/api/students/${s.id}/conversations`, {})).json();
    const sse = await (await post(`/api/conversations/${c.id}/messages`, { text })).text();
    const ev = sse.split("\n\n").filter(Boolean).map((x) => ({ event: /^event: (.*)$/m.exec(x)[1], data: JSON.parse(/^data: (.*)$/m.exec(x)[1]) }));
    await fn({ ev, store, base });
  } finally {
    server.close();
  }
}

const odgovor = "Najprej odštej $7$ na obeh straneh. Koliko dobiš?\n<<META subject=MAT topic=\"enačbe\" error=0 mode=A flag=none done=0>>";
const stream = (klici, { razmisli = true } = {}) => async (o) => {
  klici.push({ noThinking: o.noThinking, mode: o.mode });
  if (razmisli) o.onPhase?.("think");
  o.onText(odgovor.slice(0, 30));
  o.onPhase?.("think"); // drugi blok razmišljanja po besedilu (krog orodja): ne sme več pokazati »Razmišljam«
  o.onText(odgovor.slice(30));
  return { content: [{ type: "text", text: odgovor }], text: odgovor, stopReason: "end_turn", usage: { input_tokens: 10, output_tokens: 20 }, model: "claude-haiku-5-5", timing: { thinking: !o.noThinking, firstThinkMs: 900, firstTextMs: 2400, totalMs: 3100 } };
};

test("dogodek »Razmišljam«: enkrat, pred prvim besedilom; časi odgovora se zapišejo brez osebnih podatkov", async () => {
  const klici = [];
  await withFlag(undefined, () =>
    pogovor(
      async ({ ev, store, base }) => {
        const think = ev.filter((e) => e.event === "phase" && e.data.phase === "think");
        assert.equal(think.length, 1, "en dogodek think");
        assert.ok(ev.indexOf(think[0]) < ev.findIndex((e) => e.event === "delta"), "pred prvim besedilom");
        assert.equal(klici[0].noThinking, false, "privzeto z razmišljanjem");
        const v = store.db.prepare("SELECT * FROM casi_odgovora").all();
        assert.equal(v.length, 1);
        assert.equal(v[0].model, "claude-haiku-5-5");
        assert.equal(v[0].nacin, "chat");
        assert.equal(v[0].raven, "OS");
        assert.equal(v[0].razmislek, 1);
        assert.equal(v[0].poskus, "");
        assert.equal(v[0].razmislek_ms, 900);
        assert.equal(v[0].besedilo_ms, 2400);
        assert.equal(v[0].konec_ms, 3100);
        assert.match(v[0].created_at, /^\d{4}-\d{2}-\d{2}$/, "samo dan, brez ure (ni povezave z vrstico usage)");
        assert.ok(v[0].id > 1000, "naključen ključ, ne zaporedni");
        assert.ok(v[0].pred_ms >= 0);
        const stolpci = Object.keys(v[0]);
        for (const x of ["student_id", "conversation_id", "text", "parent_id"]) assert.ok(!stolpci.includes(x), x);
        // Povzetek za skrbnika: lokalno da, prek spleta (brez računov) ne.
        const p = await (await fetch(`${base}/api/usage/casi`)).json();
        assert.equal(p.skupine[0].besedilo.mediana, 2400);
        assert.equal((await fetch(`${base}/api/usage/casi`, { headers: { "x-forwarded-for": "203.0.113.4" } })).status, 403);
      },
      { streamFn: stream(klici) },
    ),
  );
});

test("z zastavico: lahek prvi korak gre brez razmišljanja in se v časih loči kot poskus", async () => {
  const klici = [];
  await withFlag("1", () =>
    pogovor(
      async ({ store }) => {
        assert.equal(klici[0].noThinking, true);
        const v = store.db.prepare("SELECT razmislek, poskus FROM casi_odgovora").get();
        assert.deepEqual({ ...v }, { razmislek: 0, poskus: "hitri-korak" });
      },
      { streamFn: stream(klici, { razmisli: false }) },
    ),
  );
  // Naloge, ki je reševalnik ne reši: tudi z zastavico z razmišljanjem.
  const k2 = [];
  await withFlag("1", () => pogovor(async () => assert.equal(k2[0].noThinking, false), { text: "Zakaj je nebo modro?", streamFn: stream(k2) }));
});

test("povzetek časov: mediana in p90 po modelu, načinu in razmišljanju; točno 7 dni; staro se pobriše", () => {
  const db = openDb(":memory:").db;
  logCasi(db, { model: "claude-haiku-5-5", nacin: "chat", timing: { thinking: true, firstTextMs: 1 } });
  db.prepare("UPDATE casi_odgovora SET created_at = date('now', '-31 days')").run();
  pocistiCasi(db);
  // 7. dan nazaj ni več v povzetku (danes + 6 dni), 6. dan je.
  logCasi(db, { model: "claude-haiku-5-5", nacin: "lite", timing: { thinking: true, firstTextMs: 5 } });
  db.prepare("UPDATE casi_odgovora SET created_at = date('now', '-7 days') WHERE nacin = 'lite'").run();
  logCasi(db, { model: "claude-haiku-5-5", nacin: "think", timing: { thinking: true, firstTextMs: 5 } });
  db.prepare("UPDATE casi_odgovora SET created_at = date('now', '-6 days') WHERE nacin = 'think'").run();
  for (const [i, ms] of [1000, 2000, 3000, 4000, 10000].entries()) logCasi(db, { model: "claude-haiku-5-5", nacin: "chat", raven: "OS", predMs: 5, timing: { thinking: true, firstThinkMs: 100, firstTextMs: ms, totalMs: ms + 1000 + i } });
  logCasi(db, { model: "claude-haiku-5-5", nacin: "chat", raven: "OS", poskus: "hitri-korak", timing: { thinking: false, firstThinkMs: null, firstTextMs: 800, totalMs: 2000 } });
  pozabiPovzetek();
  const vse = casiPovzetek(db);
  assert.ok(!vse.some((x) => x.nacin === "lite"), "7. dan nazaj ni v povzetku");
  assert.ok(vse.some((x) => x.nacin === "think"), "6. dan nazaj je");
  const g = vse.filter((x) => x.nacin === "chat");
  assert.equal(g.length, 2);
  assert.equal(db.prepare("SELECT COUNT(*) n FROM casi_odgovora WHERE created_at < date('now', '-30 days')").get().n, 0, "starejše od 30 dni pobrisano");
  // Predpomnjen 60 s: nova vrstica se pokaže šele po izteku (ali pozabiPovzetek).
  logCasi(db, { model: "claude-sonnet-5-5", nacin: "mid", timing: { thinking: true, firstTextMs: 9 } });
  assert.ok(!casiPovzetek(db).some((x) => x.nacin === "mid"));
  pozabiPovzetek();
  assert.ok(casiPovzetek(db).some((x) => x.nacin === "mid"));
  assert.deepEqual(g[0].besedilo, { n: 5, mediana: 3000, p90: 10000 });
  assert.equal(g[1].razmislek, false);
});

test("odjemalec: »Razmišljam …« samo dokler ni besedila; ključi v vseh jezikih (test/i18n.test.js)", async () => {
  const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
  assert.match(app, /if \(d\?\.phase === "think"\) return shownText \|\| bubble\.classList\.contains\("checking"\) \|\| \(\(waitNote = t\("chat\.waitThink"\)\), paint\(""\)\);/);
  const { default: sl } = await import("../public/i18n/sl.js");
  assert.equal(sl["chat.waitThink"], "Razmišljam …");
});

test("streamReply: onPhase ob prvem razmišljanju, časi v rezultatu, noThinking izklopi razmišljanje samo pri Haikuju", async () => {
  const { streamReply, setClient } = await import("../server/claude.js");
  const env = { key: process.env.ANTHROPIC_API_KEY, mock: process.env.EVKLID_MOCK };
  process.env.ANTHROPIC_API_KEY = "test";
  delete process.env.EVKLID_MOCK;
  const params = [];
  const msg = (model) => ({ content: [{ type: "text", text: "Živjo" }], stop_reason: "end_turn", model, usage: { input_tokens: 5, output_tokens: 3 } });
  setClient({
    beta: {
      messages: {
        stream: (p) => {
          params.push(p);
          const think = p.thinking?.type !== "disabled";
          const events = [
            { type: "message_start", message: { model: p.model, usage: { input_tokens: 5, output_tokens: 1 } } },
            ...(think ? [{ type: "content_block_start", content_block: { type: "thinking" } }, { type: "content_block_stop" }] : []),
            { type: "content_block_start", content_block: { type: "text" } },
            { type: "content_block_delta", delta: { type: "text_delta", text: "Živ" } },
            { type: "content_block_delta", delta: { type: "text_delta", text: "jo" } },
            { type: "message_delta", usage: { output_tokens: 3 } },
          ];
          return {
            async *[Symbol.asyncIterator]() {
              for (const e of events) {
                await new Promise((r) => setTimeout(r, 2));
                yield e;
              }
            },
            finalMessage: async () => msg(p.model),
          };
        },
      },
    },
  });
  try {
    const order = [];
    const r = await streamReply({ system: "s", messages: [{ role: "user", content: "x" }], mode: "chat", onText: (t) => order.push(`text:${t}`), onPhase: (p) => order.push(`phase:${p}`) });
    assert.deepEqual(order, ["phase:think", "text:Živ", "text:jo"]);
    assert.equal(params[0].thinking.type, "adaptive");
    assert.equal(r.timing.thinking, true);
    assert.ok(r.timing.firstThinkMs >= 0 && r.timing.firstTextMs >= r.timing.firstThinkMs && r.timing.totalMs >= r.timing.firstTextMs, JSON.stringify(r.timing));
    const order2 = [];
    const r2 = await streamReply({ system: "s", messages: [{ role: "user", content: "x" }], mode: "chat", noThinking: true, onText: () => {}, onPhase: (p) => order2.push(p) });
    assert.equal(params[1].thinking.type, "disabled");
    assert.deepEqual(order2, []);
    assert.equal(r2.timing.thinking, false);
    assert.equal(r2.timing.firstThinkMs, null);
    // Opus razmišljanja ne dovoli izklopiti: noThinking nima učinka.
    await streamReply({ system: "s", messages: [{ role: "user", content: "x" }], mode: "deep", noThinking: true, onText: () => {} });
    assert.equal(params[2].thinking.type, "adaptive");
  } finally {
    setClient(null);
    if (env.key === undefined) delete process.env.ANTHROPIC_API_KEY;
    else process.env.ANTHROPIC_API_KEY = env.key;
    if (env.mock !== undefined) process.env.EVKLID_MOCK = env.mock;
  }
});

test("meritev hitrega koraka: vseh 60 nalog reši reševalnik; ocena »izda rezultat«", async () => {
  const { LAHKE, TEZJE, izda } = await import("../scripts/meri-hitri-korak.mjs");
  assert.equal(LAHKE.length, 40);
  assert.equal(TEZJE.length, 20);
  for (const t of [...LAHKE, ...TEZJE]) assert.ok(presolve(t, { first: true }), t);
  const pre = presolve("Reši enačbo 3x + 7 = 22.", { first: true });
  assert.equal(izda("Rešitev je $x = 5$.", pre), true);
  assert.equal(izda("Najprej odštej $7$ na obeh straneh. Koliko dobiš?", pre), false);
  const kv = presolve("Reši enačbo x^2 - 5x + 6 = 0.", { first: true });
  assert.equal(izda("Rešitvi sta $x_1 = 2$ in $x_2 = 3$.", kv), true);
  assert.equal(izda("Poišči dve števili, katerih zmnožek je $6$ in vsota $5$.", kv), false);
});

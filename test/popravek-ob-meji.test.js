// AUDIT-060: napaka, ki jo koda dokaže, učencu ne ostane zamolčana, ko klic popravka ni mogoč (meja porabe):
// pripne se popravek brez modela (strošek 0) in šteje dogodek.
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { modeParams } from "../server/claude.js";
import { Usage } from "../server/usage.js";
import { codeFixBlock, SKIP_KV } from "../server/live-check.js";

const META = '\n<<META subject=MAT topic="x" error=0 mode=B flag=none done=0>>';
// Rezervacija učenca dovoli le prvih n klicev (učenec tik pod mejo).
class NearCap extends Usage {
  constructor(db, n) {
    super(db);
    this.n = n;
  }
  hold(id, capsFn) {
    const h = super.hold(id, capsFn);
    if (id == null) return h;
    let k = 0;
    const take = h.take;
    h.take = (usd) => (++k <= this.n ? take(usd) : false);
    return h;
  }
}
async function run({ answers, fixText = "Popravek: $7 \\cdot 8 = 56$.", n = 1, msgs }) {
  const store = openDb(":memory:");
  const calls = [];
  const streamFn = async ({ system, mode, onText }) => {
    const isFix = String(system).startsWith("You fix the mistakes");
    calls.push(isFix ? "fix" : "chat");
    const text = isFix ? fixText : (answers.shift() ?? "Odgovor.") + META;
    if (!isFix) onText(text);
    return { content: [{ type: "text", text }], text, stopReason: "end_turn", model: modeParams(mode).model, usage: { input_tokens: 100, output_tokens: 20 } };
  };
  const reviewCreateFn = async (p) => ({ content: [{ type: "text", text: "OK" }], stop_reason: "end_turn", model: p.model, usage: { input_tokens: 10, output_tokens: 1 } });
  const server = createApp(store, { streamFn, reviewCreateFn, usage: n == null ? undefined : new NearCap(store.db, n) }).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (p, b) => {
    const r = await fetch(base + p, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b || {}) });
    return (r.headers.get("content-type") || "").includes("json") ? r.json() : r.text();
  };
  try {
    const s = await call("/api/students", { name: "Ana", settings: {} });
    const c = await call(`/api/students/${s.id}/conversations`, {});
    let sse = "";
    for (const t of msgs) sse = await call(`/api/conversations/${c.id}/messages`, { text: t });
    const m = store.listMessages(c.id).at(-1);
    const skips = JSON.parse(store.db.prepare("SELECT value FROM kv WHERE key = ?").get(SKIP_KV)?.value || "{}");
    return { calls, display: m.display_text, sse, skips: JSON.stringify(skips) };
  } finally {
    server.close();
  }
}

test("popravek brez modela: besedilo pozna obe vrednosti, jeziki", () => {
  const issue = "in the step $7 \\cdot 8 = 54$ the calculation does not hold: 56 ≠ 54";
  assert.match(codeFixBlock(issue, "sl"), /^\n\n> \*\*Popravek:\*\* Račun \$7 \\cdot 8 = 54\$ ne drži: leva stran je 56, desna pa 54\./);
  assert.match(codeFixBlock(issue, "en"), /\*\*Correction:\*\*/);
  assert.match(codeFixBlock(issue, "fr"), /\*\*Correction:\*\*/, "drugi jeziki: angleško");
  assert.match(codeFixBlock("x = 5 does not satisfy the equation", "sl"), /V tem odgovoru je napaka/);
  assert.match(codeFixBlock("x", "sl", "verdict"), /ocena tvojega koraka/);
});

test("meja porabe: najdena napaka v računu dobi popravek brez klica modela", async () => {
  const r = await run({ answers: ["Izračunajmo: $7 \\cdot 8 = 54$. Zdaj prištej še $2$."], msgs: ["Koliko je 7 krat 8 plus 2?"] });
  assert.deepEqual(r.calls, ["chat"], "brez klica popravka");
  assert.match(r.display, /> \*\*Popravek:\*\* Račun \$7 \\cdot 8 = 54\$ ne drži: leva stran je 56/);
  assert.match(r.sse, /Popravek/, "tudi v toku");
  assert.match(r.skips, /meja-popravek/);
});

test("s prostorom pod mejo: popravek modela kot prej; »OK« modela ostane brez popravka", async () => {
  const ok = await run({ answers: ["Izračunajmo: $7 \\cdot 8 = 54$."], n: null, msgs: ["Koliko je 7 krat 8 plus 2?"] });
  assert.deepEqual(ok.calls, ["chat", "fix"]);
  assert.match(ok.display, /> \*\*Popravek:\*\* \$7 \\cdot 8 = 56\$\./);
  assert.doesNotMatch(ok.display, /leva stran je/);
  const refused = await run({ answers: ["Izračunajmo: $7 \\cdot 8 = 54$."], n: null, fixText: "OK", msgs: ["Koliko je 7 krat 8 plus 2?"] });
  assert.doesNotMatch(refused.display, /Popravek/);
});

test("meja porabe: ponovni odgovor po napačni sodbi ni mogoč → opozorilo o sodbi", async () => {
  // »x = 5« pri 2x + 3 = 11 je napačno, model pa reče »Da, pravilno!«; drugi klic (ponovni odgovor) ne gre pod mejo.
  const r = await run({ answers: ["Kaj narediš najprej?", "Da, pravilno!"], n: 2, msgs: ["Reši 2x + 3 = 11", "x = 5"] });
  assert.equal(r.calls.filter((c) => c === "chat").length, 2, "brez ponovnega odgovora");
  assert.match(r.display, /Da, pravilno![\s\S]*> \*\*Popravek:\*\* Ta ocena tvojega koraka morda ni pravilna/);
  assert.match(r.skips, /meja-sodba/);
});

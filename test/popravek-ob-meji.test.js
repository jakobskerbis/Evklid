// AUDIT-060 (pregled prevzema 3): ko klic popravka ali ponovnega odgovora ni mogoč (meja porabe), ostane kot na main:
// brez popravka in brez opozorila brez modela (koda se lahko zmoti, model je filter).
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { modeParams } from "../server/claude.js";
import { Usage } from "../server/usage.js";
import { SKIP_KV } from "../server/live-check.js";

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
async function run({ answers, fixText = "Popravek: $7 \\cdot 8 = 56$.", n = 1, msgs, review = "OK" }) {
  const store = openDb(":memory:");
  const calls = [];
  const fixPrompts = [];
  const streamFn = async ({ system, mode, onText, messages }) => {
    const isFix = String(system).startsWith("You fix the mistakes");
    calls.push(isFix ? "fix" : "chat");
    if (isFix) fixPrompts.push(messages[0].content[0].text);
    if (isFix && fixText === null) throw new Error("klic popravka ni uspel");
    const text = isFix ? fixText : (answers.shift() ?? "Odgovor.") + META;
    if (!isFix) onText(text);
    return { content: [{ type: "text", text }], text, stopReason: "end_turn", model: modeParams(mode).model, usage: { input_tokens: 100, output_tokens: 20 } };
  };
  const reviewCreateFn = async (p) => {
    calls.push("review");
    return { content: [{ type: "text", text: review }], stop_reason: "end_turn", model: p.model, usage: { input_tokens: 10, output_tokens: 1 } };
  };
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
    return { calls, fixPrompts, display: m.display_text, sse, skips: JSON.stringify(skips) };
  } finally {
    server.close();
  }
}

test("pregled prevzema 3 (AUDIT-060): meja porabe, napaka v računu → brez popravka brez modela (kot main)", async () => {
  const r = await run({ answers: ["Izračunajmo: $7 \\cdot 8 = 54$. Zdaj prištej še $2$."], msgs: ["Koliko je 7 krat 8 plus 2?"] });
  assert.deepEqual(r.calls, ["chat"], "brez klica popravka");
  assert.doesNotMatch(r.display, /Popravek/);
  assert.doesNotMatch(r.sse, /Popravek/);
});

test("s prostorom pod mejo: popravek modela kot prej; »OK« modela ostane brez popravka", async () => {
  const ok = await run({ answers: ["Izračunajmo: $7 \\cdot 8 = 54$."], n: null, msgs: ["Koliko je 7 krat 8 plus 2?"] });
  assert.deepEqual(ok.calls, ["chat", "fix"]);
  assert.match(ok.display, /> \*\*Popravek:\*\* \$7 \\cdot 8 = 56\$\./);
  assert.doesNotMatch(ok.display, /leva stran je/);
  const refused = await run({ answers: ["Izračunajmo: $7 \\cdot 8 = 54$."], n: null, fixText: "OK", msgs: ["Koliko je 7 krat 8 plus 2?"] });
  assert.doesNotMatch(refused.display, /Popravek/);
});

// Pregled prevzema 5 in 6 (AUDIT-060): le pri golem rezultatu in brez popravka modela previdna opomba brez modela;
// gumbi in kartice odgovora ostanejo. Pri sodbi koraka, odvodu in računu v besedilu nič (kot main).
test("pregled prevzema 6 (AUDIT-060): meja porabe, prezrta sodba kode → brez opombe (kot main)", async () => {
  // »x = 5« pri 2x + 3 = 11 je napačno, model pa reče »Da, pravilno!«; drugi klic (ponovni odgovor) ne gre pod mejo.
  const r = await run({ answers: ["Kaj narediš najprej?", "Da, pravilno!"], n: 2, msgs: ["Reši 2x + 3 = 11", "x = 5"] });
  assert.equal(r.calls.filter((c) => c === "chat").length, 2, "brez ponovnega odgovora");
  assert.match(r.display, /Da, pravilno!/);
  assert.doesNotMatch(r.display + r.sse, /Ta ocena tvojega koraka|morda vsebuje napako|Preveri ga še sam/);
});

test("pregled prevzema 5 (AUDIT-060): napačen gol rezultat ob meji ali napaki klica → opomba, gumbi ostanejo", async () => {
  const ans = 'Rezultat: 54\n<<IZBIRE ["Razumem", "Razloži"]>>';
  const r = await run({ answers: [ans], msgs: ["Izračunaj $7 \\cdot 8$."] });
  assert.deepEqual(r.calls, ["chat"], "brez klica popravka");
  assert.match(r.display, /\*\(Ta odgovor morda vsebuje napako v računu\. Preveri ga še sam\.\)\*/);
  assert.match(r.sse, /morda vsebuje napako/);
  assert.match(r.sse, /Razumem/, "gumbi ostanejo");
  assert.match(r.skips, /meja-popravek/);
  const thrown = await run({ answers: [ans], n: null, fixText: null, msgs: ["Izračunaj $7 \\cdot 8$."] });
  assert.deepEqual(thrown.calls, ["chat", "fix"]);
  assert.match(thrown.display, /morda vsebuje napako/, "klic popravka ni uspel");
  const refused = await run({ answers: [ans], n: null, fixText: "OK", msgs: ["Izračunaj $7 \\cdot 8$."] });
  assert.doesNotMatch(refused.display, /morda vsebuje napako/, "model je napako zavrnil");
});

test("pregled prevzema 6 (AUDIT-060): napačen odvod ali račun v besedilu ob meji → brez opombe", async () => {
  const d = await run({ answers: ["Odvod je $f'(x) = 2x$."], msgs: ["Odvajaj $f(x) = x^3$."] });
  assert.deepEqual(d.calls, ["chat"], "brez klica popravka");
  assert.doesNotMatch(d.display + d.sse, /morda vsebuje napako/);
  const a = await run({ answers: ["Izračunajmo: $7 \\cdot 8 = 54$. Zdaj prištej še $2$."], msgs: ["Koliko je 7 krat 8 plus 2?"] });
  assert.doesNotMatch(a.display, /morda vsebuje napako|Popravek/);
});

// Pregled prevzema (ugotovitev 7): ob meji opozorilo o sodbi le, ko je sodila koda; ugotovitev modela za pregled sama
// (lahko se zmoti) ne prikaže »Ta ocena tvojega koraka morda ni pravilna« (kot pri popravku odgovora).
test("pregled prevzema: meja porabe, sodbo je zavrnil le model za pregled → brez opozorila", async () => {
  const msgs = ["Mama je 3-krat starejša od hčere, skupaj imata 40 let. Koliko je stara hči?", "hči je stara 7 let"];
  for (const n of [2, 3, 4]) {
    const r = await run({ answers: ["Kaj narediš najprej?", "Da, pravilno!"], n, msgs, review: "NAPAKA: hči je stara 10 let" });
    if (!r.calls.includes("review")) continue; // pod to mejo pregled sodbe sploh ni stekel
    assert.doesNotMatch(r.display, /Ta ocena tvojega koraka/, `n=${n}: ${r.calls}`);
    return;
  }
  assert.fail("pregled sodbe z modelom ni stekel");
});

// Pregled prevzema 2 (AUDIT-059): vprašanje-predlog, o katerem koda ne sodi, je kot na main vprašanje: brez plačanega
// pregleda sodbe.
test("pregled prevzema 2 (AUDIT-059): »je 7 · 8 = 54?« brez sodbe kode ne gre v pregled sodbe", async () => {
  const msgs = ["Izračunaj $7 \\cdot 8 + 2$.", "je 7 · 8 = 54?"];
  const r = await run({ answers: ["Koliko je $7 \\cdot 8$?", "Da, tako je."], n: null, msgs, review: "NAPAKA: 7 · 8 = 56" });
  assert.ok(!r.calls.includes("review"), String(r.calls));
});

// AUDIT-066 (pregled prevzema 6, j na kartici): napačen račun v vrstici, ki jo main preskoči le zaradi »če«, »ali«, »bi«
// ali »?«, gre le v obstoječi plačani popravek (en klic, iste meje), z navodilom, da je vrstica lahko namerni primer
// napake. Ob »OK« modela odgovor ostane nespremenjen in brez opombe; ob meji porabe nič (ni »sure«).
test("pregled prevzema 6 (AUDIT-066): »Če najprej množimo: $7 \\cdot 8 = 54$« gre v popravek; ob »OK« brez spremembe", async () => {
  const ans = "Če najprej množimo: $7 \\cdot 8 = 54$. Potem prištejemo $2$.";
  const fixed = await run({ answers: [ans], n: null, msgs: ["Koliko je 7 krat 8 plus 2?"] });
  assert.deepEqual(fixed.calls.filter((c) => c === "fix"), ["fix"], "natanko en klic popravka");
  assert.match(fixed.fixPrompts[0], /56 ≠ 54/);
  assert.match(fixed.fixPrompts[0], /deliberate example of a mistake/);
  assert.match(fixed.display, /Popravek/);
  const ok = await run({ answers: [ans], n: null, fixText: "OK", msgs: ["Koliko je 7 krat 8 plus 2?"] });
  assert.deepEqual(ok.calls.filter((c) => c === "fix"), ["fix"]);
  assert.match(ok.display, /^Če najprej množimo: \$7 \\cdot 8 = 54\$\. Potem prištejemo \$2\$\.\s*$/);
  assert.doesNotMatch(ok.display + ok.sse, /Popravek|morda vsebuje napako|Preveri ga še sam/);
  const cap = await run({ answers: [ans], msgs: ["Koliko je 7 krat 8 plus 2?"] });
  assert.deepEqual(cap.calls, ["chat"], "ob meji porabe brez klica popravka");
  assert.doesNotMatch(cap.display + cap.sse, /Popravek|morda vsebuje napako/);
  // trdna vrstica brez »če« ostane sodba kode kot prej
  const hard = await run({ answers: ["Torej $7 \\cdot 8 = 54$."], n: null, fixText: "OK", msgs: ["Koliko je 7 krat 8?"] });
  assert.doesNotMatch(hard.fixPrompts[0] || "", /deliberate example/);
});

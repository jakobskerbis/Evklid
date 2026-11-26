// AUDIT-060, AUDIT-066, AUDIT-059 (dokončanje pred pilotom, j 27. 11.): ko koda ve, da je odgovor napačen (ali da je
// inštruktor prezrl njeno sodbo), popravka ali ponovnega odgovora pa ni (meja porabe, napaka klica), učenec vidi
// konkretno opombo brez modela (server/opomba-preverjanja.js). Blaga ugotovitev (napačen račun v vrstici s »če«, »ali«,
// »?«) dobi blago opombo tudi ob »OK« modela. Besedilo odgovora, gumbi in kartice ostanejo.
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { modeParams } from "../server/claude.js";
import { Usage } from "../server/usage.js";
import { SKIP_KV } from "../server/live-check.js";
import { casAvailable } from "../server/cas.js";

const META = '\n<<META subject=MAT topic="x" error=0 mode=B flag=none done=0>>';
const R = String.raw;
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
// chatFail: zaporedna številka klica odgovora (1 = prvi), ki se konča z napako (ponovni odgovor ni uspel).
async function run({ answers, fixText = "Popravek: $7 \\cdot 8 = 56$.", n = 1, msgs, review = "OK", chatFail = 0 }) {
  const store = openDb(":memory:");
  const calls = [];
  const fixPrompts = [];
  let chats = 0;
  const streamFn = async ({ system, mode, onText, messages }) => {
    const isFix = String(system).startsWith("You fix the mistakes");
    calls.push(isFix ? "fix" : "chat");
    if (isFix) fixPrompts.push(messages[0].content[0].text);
    if (isFix && fixText === null) throw new Error("klic popravka ni uspel");
    if (!isFix && ++chats === chatFail) {
      onText("Delni ponovni");
      throw new Error("klic odgovora ni uspel");
    }
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
    return { calls, fixPrompts, display: m.display_text, content: JSON.stringify(m.api_content), sse, skips: JSON.stringify(skips) };
  } finally {
    server.close();
  }
}

// Vzorci opomb. Trdna opomba konča s »Preveri še sam.«, blaga z »… je odgovor v redu.«; splošna je le rezerva.
const HARD = /Preveri še sam\./;
const SOFT = /Če je naveden kot primer napake, je odgovor v redu\./;
const GENERIC = /morda vsebuje napako|morda ni pravilna/;
const ANY_NOTE = /Opomba:|morda vsebuje napako|morda ni pravilna/;
const has = (r, note) => {
  assert.ok(r.display.includes(note), `prikaz brez opombe:\n${r.display}`);
  assert.ok(r.sse.includes(JSON.stringify(note).slice(1, -1)) || r.sse.includes(note), "opomba ni šla učencu (SSE)");
};
const none = (r) => assert.doesNotMatch(r.display + r.sse, ANY_NOTE);

// Štirje primeri za vsako ugotovitev: meja porabe (n = 1: le prvi odgovor), napaka klica popravka, »OK« modela, prost
// proračun (popravek modela).
async function fourWays({ answers, msgs, note }) {
  const cap = await run({ answers: [...answers], msgs });
  assert.ok(!cap.calls.includes("fix"), "ob meji brez klica popravka");
  has(cap, note);
  assert.match(cap.skips, /meja-popravek/);
  const failed = await run({ answers: [...answers], n: null, fixText: null, msgs });
  assert.ok(failed.calls.includes("fix"));
  has(failed, note);
  const ok = await run({ answers: [...answers], n: null, fixText: "OK", msgs });
  none(ok); // »OK« modela pri trdni ugotovitvi: napake ni (kot main)
  const free = await run({ answers: [...answers], n: null, msgs });
  assert.match(free.display, /Popravek/);
  none(free);
  return { cap, failed, ok, free };
}

test("AUDIT-060: napačen račun kot rezultat (»Torej $7 \\cdot 8 = 54$.«) → konkretna opomba ob meji in napaki klica", async () => {
  const note = R`*(Opomba: $7 \cdot 8 = 54$ ne drži, ker je $7 \cdot 8 = 56$. Preveri še sam.)*`;
  const { cap } = await fourWays({ answers: [R`Najprej pomnožimo. Torej $7 \cdot 8 = 54$.`], msgs: ["Koliko je 7 krat 8?"], note });
  assert.match(cap.display, /^Najprej pomnožimo\. Torej \$7 \\cdot 8 = 54\$\./, "besedilo odgovora ostane");
  assert.ok(cap.content.includes(JSON.stringify(note).slice(1, -1)), "opomba je tudi v zgodovini za model");
  // zadnja formula odgovora je tudi rezultat
  const last = await run({ answers: [R`Pomnožimo: $7 \cdot 8 = 54$`], msgs: ["Koliko je 7 krat 8?"] });
  has(last, note);
  // pregled A (018af7ab6): račun sredi razlage brez znaka rezultata → brez opombe (ugotovitev gre v popravek kot main)
  const mid = await run({ answers: [R`Izračunajmo: $7 \cdot 8 = 54$. Zdaj prištej še $2$.`], msgs: ["Koliko je 7 krat 8 plus 2?"] });
  none(mid);
  const fix = await run({ answers: [R`Izračunajmo: $7 \cdot 8 = 54$. Zdaj prištej še $2$.`], msgs: ["Koliko je 7 krat 8 plus 2?"], n: null });
  assert.ok(fix.calls.includes("fix"), "popravek kot main");
});

test("AUDIT-060: napačen končni odvod (x³ → 2x) → konkretna opomba", async () => {
  await fourWays({ answers: [R`Odvod je $f'(x) = 2x$.`], msgs: [R`Odvajaj $f(x) = x^3$.`], note: R`*(Opomba: odvod funkcije $f(x) = x^{3}$ je $f'(x) = 3x^{2}$, ne $f'(x) = 2x$. Preveri še sam.)*` });
});

test("AUDIT-060: napačen gol rezultat (»54« za 7 · 8) → konkretna opomba, gumbi ostanejo", async () => {
  const ans = 'Rezultat: 54\n<<IZBIRE ["Razumem", "Razloži"]>>';
  const { cap } = await fourWays({ answers: [ans], msgs: [R`Izračunaj $7 \cdot 8$.`], note: R`*(Opomba: $7 \cdot 8 = 54$ ne drži, ker je $7 \cdot 8 = 56$. Preveri še sam.)*` });
  assert.match(cap.sse, /Razumem/, "gumbi ostanejo");
});

test("AUDIT-060: napačna vrednost neznanke (x = 5 pri 2x + 3 = 11) → konkretna opomba", async () => {
  await fourWays({ answers: [R`Rešitev je $x = 5$.`], msgs: [R`Reši enačbo $2x + 3 = 11$.`], note: R`*(Opomba: $x = 5$ ni rešitev enačbe $2x + 3 = 11$ (rešitev: $x = 4$). Preveri še sam.)*` });
});

test("AUDIT-060: vidna rešitev proti bloku RACUN (SymPy) → konkretna opomba", { skip: !(await casAvailable()) && "brez SymPy" }, async () => {
  const ans = "Rešitev je $x = 5$.\n<<RACUN\nresi: 2*x+3=11 | x | 4\n>>";
  await fourWays({ answers: [ans], msgs: ["Pomagaj mi z enačbo."], note: R`*(Opomba: $x = 5$ ni rešitev enačbe $2x + 3 = 11$ (rešitev: $x = 4$). Preveri še sam.)*` });
});

test("AUDIT-060: pravilen odgovor ob meji porabe ostane brez opombe", async () => {
  for (const [a, q] of [
    [R`Izračunajmo: $7 \cdot 8 = 56$. Zdaj prištej še $2$.`, "Koliko je 7 krat 8 plus 2?"],
    [R`Odvod je $f'(x) = 3x^2$.`, R`Odvajaj $f(x) = x^3$.`],
    ["Rezultat: 56", R`Izračunaj $7 \cdot 8$.`],
    [R`Rešitev je $x = 4$.`, R`Reši enačbo $2x + 3 = 11$.`],
    ["Ulomke seštejemo tako, da jih razširimo na skupni imenovalec.", "Kako seštejem ulomke?"],
  ]) {
    const r = await run({ answers: [a], msgs: [q] });
    none(r);
    assert.deepEqual(r.calls, ["chat"], a);
  }
});

// Sodba koraka (stepVerdict), ki jo inštruktor prezre: ob meji ali napaki ponovnega odgovora konkretna opomba.
test("AUDIT-060: »Da, pravilno!« ob učenčevem napačnem x = 5 → ponovni odgovor ali opomba", async () => {
  const msgs = ["Reši 2x + 3 = 11", "x = 5"];
  const note = R`*(Opomba: $x = 5$ ni rešitev enačbe $2x + 3 = 11$ (rešitev: $x = 4$). Preveri še sam.)*`;
  const cap = await run({ answers: ["Kaj narediš najprej?", "Da, pravilno!"], n: 2, msgs });
  assert.equal(cap.calls.filter((c) => c === "chat").length, 2, "brez ponovnega odgovora");
  assert.match(cap.display, /^Da, pravilno!/);
  has(cap, note);
  assert.match(cap.skips, /meja-sodba/);
  const failed = await run({ answers: ["Kaj narediš najprej?", "Da, pravilno!"], n: null, chatFail: 3, msgs });
  assert.equal(failed.calls.filter((c) => c === "chat").length, 3, "ponovni odgovor je bil poskušen");
  assert.match(failed.display, /^Da, pravilno!/, "ostane prvi odgovor");
  assert.doesNotMatch(failed.sse, /Delni ponovni/, "delni ponovni odgovor ne gre učencu");
  has(failed, note);
  const free = await run({ answers: ["Kaj narediš najprej?", "Da, pravilno!", "Skoraj. Preveri: $2 \\cdot 5 + 3 = 13$."], n: null, msgs });
  assert.equal(free.calls.filter((c) => c === "chat").length, 3);
  assert.match(free.display, /^Skoraj\./);
  none(free);
});

test("AUDIT-060: odgovor, ki sledi sodbi kode, in pravilen korak ostaneta brez opombe", async () => {
  const msgs = ["Reši 2x + 3 = 11", "x = 5"];
  const followed = await run({ answers: ["Kaj narediš najprej?", "Skoraj. Vstavi $x = 5$: dobiš $13$, ne $11$."], n: 2, msgs });
  none(followed);
  const right = await run({ answers: ["Kaj narediš najprej?", "Da, pravilno!"], n: 2, msgs: ["Reši 2x + 3 = 11", "x = 4"] });
  none(right);
});

// AUDIT-059: vprašanje-predlog (»je 7 · 8 = 54?«, »54?«, »x = 5, kajne?«) koda preračuna; potrditev napačnega je prezrta
// sodba (en ponovni odgovor ali opomba ob meji); pravilen predlog in pravo vprašanje brez alarma.
test("AUDIT-059: »je 7 · 8 = 54?« pri nalogi 7 · 8 + 2 in »Da, tako je.« → ponovni odgovor ali konkretna opomba", async () => {
  const T = R`Izračunaj $7 \cdot 8 + 2$.`;
  const note = R`*(Opomba: $7 \cdot 8 = 54$ ne drži, ker je $7 \cdot 8 = 56$. Preveri še sam.)*`;
  for (const q of ["je 7 · 8 = 54?", "7 · 8 = 54, ne?", "54?"]) {
    const cap = await run({ answers: [R`Koliko je $7 \cdot 8$?`, "Da, tako je."], n: 2, msgs: [T, q] });
    assert.equal(cap.calls.filter((c) => c === "chat").length, 2, q);
    has(cap, note);
    const free = await run({ answers: [R`Koliko je $7 \cdot 8$?`, "Da, tako je.", R`Ne čisto: $7 \cdot 8 = 56$.`], n: null, msgs: [T, q] });
    assert.equal(free.calls.filter((c) => c === "chat").length, 3, `${q}: en ponovni odgovor`);
    assert.match(free.display, /^Ne čisto/);
    none(free);
    const failed = await run({ answers: [R`Koliko je $7 \cdot 8$?`, "Da, tako je."], n: null, chatFail: 3, msgs: [T, q] });
    has(failed, note);
  }
});

test("AUDIT-059: pravilen predlog, pravo vprašanje in popravek v odgovoru brez alarma", async () => {
  const T = R`Izračunaj $7 \cdot 8 + 2$.`;
  for (const [q, a] of [
    ["je 7 · 8 = 56?", "Da."],
    ["56?", "Točno!"],
    ["Koliko je 7 · 8?", "To je 56."],
    ["je 7 · 8 = 54?", R`Ne, $7 \cdot 8 = 56$.`],
    ["je 7 · 8 = 54?", R`Prav. Preverimo: $7 \cdot 8 = 56$, ne 54.`],
  ]) {
    const r = await run({ answers: [R`Koliko je $7 \cdot 8$?`, a], n: null, msgs: [T, q] });
    assert.equal(r.calls.filter((c) => c === "chat").length, 2, `${q} → ${a}: brez ponovnega odgovora`);
    none(r);
    const cap = await run({ answers: [R`Koliko je $7 \cdot 8$?`, a], n: 2, msgs: [T, q] });
    none(cap);
  }
  const eq = await run({ answers: ["Koliko je x?", "Da!"], n: 2, msgs: ["Reši 2x + 3 = 11", "x = 4?"] });
  none(eq);
  const eqWrong = await run({ answers: ["Koliko je x?", "Da!"], n: 2, msgs: ["Reši 2x + 3 = 11", "x = 5, kajne?"] });
  has(eqWrong, R`*(Opomba: $x = 5$ ni rešitev enačbe $2x + 3 = 11$ (rešitev: $x = 4$). Preveri še sam.)*`);
});

// AUDIT-066: napačen račun v vrstici s »če«/»ali«/»?« → popravek modela (en klic, iste meje) in brez popravka blaga
// opomba; besedilo odgovora se ne spremeni.
test("AUDIT-066: »Če najprej množimo: $7 \\cdot 8 = 54$« → popravek ali blaga opomba, nikoli trdna", async () => {
  const ans = R`Če najprej množimo: $7 \cdot 8 = 54$. Potem prištejemo $2$.`;
  const note = R`*(Opomba: v odgovoru je zapis $7 \cdot 8 = 54$, ki ne drži ($7 \cdot 8 = 56$). Če je naveden kot primer napake, je odgovor v redu.)*`;
  const msgs = ["Koliko je 7 krat 8 plus 2?"];
  const fixed = await run({ answers: [ans], n: null, msgs });
  assert.deepEqual(fixed.calls.filter((c) => c === "fix"), ["fix"], "natanko en klic popravka");
  assert.match(fixed.fixPrompts[0], /56 ≠ 54/);
  assert.match(fixed.fixPrompts[0], /deliberate example of a mistake/);
  assert.match(fixed.display, /Popravek/);
  assert.doesNotMatch(fixed.display, SOFT);
  for (const opt of [{ n: null, fixText: "OK" }, { n: 1 }, { n: null, fixText: null }]) {
    const r = await run({ answers: [ans], msgs, ...opt });
    assert.ok(r.display.startsWith(ans), "besedilo odgovora ostane");
    has(r, note);
    assert.doesNotMatch(r.display, HARD);
    assert.doesNotMatch(r.display, /Popravek/);
  }
  // trdna vrstica brez »če« ostane sodba kode
  const hard = await run({ answers: [R`Torej $7 \cdot 8 = 54$.`], n: null, fixText: "OK", msgs: ["Koliko je 7 krat 8?"] });
  assert.doesNotMatch(hard.fixPrompts[0] || "", /deliberate example/);
});

// Znanih 13 blagih zadetkov na pravilnih odgovorih korpusov (k2, k3, korpus): le blaga opomba, nikoli trdna.
const SOFT_HITS = [
  [R`Kako izračunam $2^3$?`, R`Marko trdi, da je $2^3 = 6$. Ima prav? Ne: $2^3 = 2 \cdot 2 \cdot 2 = 8$.`],
  [R`Kako izračunam $2^3$?`, R`Katera enakost je pravilna? A) $2^3 = 6$ B) $2^3 = 8$ C) $2^3 = 9$`],
  [R`Kako izračunam $2^5$?`, R`Poglejmo trditev $2^5 = 25$. Drži? Ne, $2^5 = 32$.`],
  ["Daj mi kviz o potencah.", R`1. Koliko je $2^4$? A) $8$ B) $16$ C) $32$` + "\n" + R`2. Ali velja $3^2 \cdot 3^3 = 3^6$? Razmisli.`],
  [R`Kako izračunam $3 + 4 \cdot 2$?`, R`Sošolka trdi, da je $3 + 4 \cdot 2 = 14$. Kje se je zmotila? Najprej množimo: $3 + 8 = 11$.`],
  [R`Koliko je $(-2)^3$?`, R`Če zanemarimo predznak, dobimo $(-2)^3 = 8$. Pazimo torej na liho potenco: $(-2)^3 = -8$.`],
  [R`Kako izračunam $2 + 3 \cdot 4$?`, R`Če računamo od leve proti desni, dobimo $2 + 3 \cdot 4 = 20$. Tega ne smemo narediti; najprej množimo: $14$.`],
  [R`Kako izračunam $\sqrt{9 + 16}$?`, R`Če korenimo vsak člen posebej, dobimo $\sqrt{9 + 16} = 7$. Tako se ne sme računati: $\sqrt{25} = 5$.`],
  [R`What is $2 + 3 \cdot 4$?`, R`If we just go left to right we get $2 + 3 \cdot 4 = 20$. Multiply first: $14$.`],
  [R`Kako izračunam $3 + 4 \cdot 2$?`, R`Če pozabiš na vrstni red, dobiš $3 + 4 \cdot 2 = 14$. Pravilno je $3 + 8 = 11$.`],
  [R`Koliko je $7 \cdot 8$?`, R`Je rezultat $7 \cdot 8 = 54$ ali $7 \cdot 8 = 56$? Preveri s poštevanko.`],
  [R`Koliko je $2^3$?`, R`Ali je $2^3 = 6$? Ne, $2^3 = 2 \cdot 2 \cdot 2 = 8$.`],
  [R`Koliko je $2^3$?`, R`Nekdo bi rekel $2^3 = 6$, ampak $2^3 = 8$.`],
];
test("AUDIT-066: 13 znanih blagih zadetkov na pravilnih odgovorih → le blaga opomba, odgovor nespremenjen", async () => {
  assert.equal(SOFT_HITS.length, 13);
  for (const [q, a] of SOFT_HITS) {
    for (const opt of [{ n: null, fixText: "OK" }, { n: 1 }]) {
      const r = await run({ answers: [a], msgs: [q], ...opt });
      // pregled A (018af7ab6): blaga opomba odpade, ko odgovor sam navede pravo vrednost istega računa
      assert.doesNotMatch(r.display, HARD, a);
      assert.doesNotMatch(r.display, GENERIC, a);
      assert.ok(r.display.startsWith(a.split("\n")[0]), "besedilo odgovora ostane");
      assert.ok((r.display.match(/Opomba:/g) || []).length <= 1, "največ ena opomba");
      if ((r.display.match(/Opomba:/g) || []).length) assert.match(r.display, SOFT, a);
    }
  }
});

// Pregled prevzema (ugotovitev 7): ob meji opozorilo o sodbi le, ko je sodila koda; ugotovitev modela za pregled sama
// (lahko se zmoti) ne prikaže opombe.
test("pregled prevzema: meja porabe, sodbo je zavrnil le model za pregled → brez opozorila", async () => {
  const msgs = ["Mama je 3-krat starejša od hčere, skupaj imata 40 let. Koliko je stara hči?", "hči je stara 7 let"];
  for (const n of [2, 3, 4]) {
    const r = await run({ answers: ["Kaj narediš najprej?", "Da, pravilno!"], n, msgs, review: "NAPAKA: hči je stara 10 let" });
    if (!r.calls.includes("review")) continue; // pod to mejo pregled sodbe sploh ni stekel
    none(r);
    return;
  }
  assert.fail("pregled sodbe z modelom ni stekel");
});

test("AUDIT-059: »je 7 · 8 = 54?« s sodbo kode ne gre v plačani pregled sodbe z modelom", async () => {
  const msgs = [R`Izračunaj $7 \cdot 8 + 2$.`, "je 7 · 8 = 54?"];
  const r = await run({ answers: [R`Koliko je $7 \cdot 8$?`, "Da, tako je."], n: null, msgs, review: "NAPAKA: 7 · 8 = 56" });
  assert.ok(!r.calls.includes("review"), String(r.calls));
});

test("opomba ne razkrije oznak", async () => {
  const r = await run({ answers: [R`Izračunajmo: $7 \cdot 8 = 54$.`], msgs: ["Koliko je 7 krat 8 plus 2?"] });
  assert.doesNotMatch(r.display, /preverjen_racun|<<|NOTE/);
});

test("AUDIT-059: »mogoče 54?« na »Kaj dobiš na koncu?« brez sodbe, »Da, $x = 6$ je pravilno.«, zavrnjen pravilen »x = 5?«", async () => {
  const T = R`Izračunaj $9 \cdot 7 - 3$.`;
  const E = R`Reši enačbo $3x + 7 = 22$.`;
  const fin = await run({ answers: ["Kaj dobiš na koncu?", "Bravo!"], n: 2, msgs: [T, "mogoče 54?"] });
  none(fin); // pregled B: vprašanje brez računa ni vezano na nalogo (kot main)
  const echo = await run({ answers: [R`Koliko je $x$?`, R`Da, $x = 6$ je pravilno.`], n: 2, msgs: [E, "x = 6?"] });
  has(echo, R`*(Opomba: $x = 6$ ni rešitev enačbe $3x + 7 = 22$ (rešitev: $x = 5$). Preveri še sam.)*`);
  const rej = await run({ answers: [R`Koliko je $x$?`, "Ne, to ni prav."], n: 2, msgs: [E, "x = 5?"] });
  has(rej, R`*(Opomba: $x = 5$ je pravilna rešitev enačbe $3x + 7 = 22$.)*`);
  const rejFree = await run({ answers: [R`Koliko je $x$?`, "Ne, to ni prav.", R`Oprosti, $x = 5$ je pravilno.`], n: null, msgs: [E, "x = 5?"] });
  assert.equal(rejFree.calls.filter((c) => c === "chat").length, 3);
  none(rejFree);
  const ok = await run({ answers: ["Kaj dobiš na koncu?", "Ja, 60 je pravilno!"], n: 2, msgs: [T, "mogoče 60?"] });
  none(ok);
});

// Pregled B (7f565d941): lažni alarmi iz pregleda, celotna pot v klepetu. Brez ponovnega odgovora in brez opombe.
test("pregled B: vprašanja-predlogi po novi vaji, s stopinjami in deljenjem; periodični zapis in tisočice", async () => {
  const T = R`Izračunaj $7 \cdot 8 + 2$.`;
  for (const [prev, q, a] of [
    [R`Odlično! Zdaj pa reši še $x + 3 = 5$. Kaj dobiš na koncu?`, "2?", "Da, 2."],
    [R`Zdaj pa še nova vaja: $3 \cdot 4 + 1$. Kaj je končni rezultat?`, "13?", "Da."],
    ["Kaj pa če bi namesto 2 prišteli 5? Kaj dobiš na koncu?", "61?", "Da."],
    ["Kaj dobiš na koncu, če namesto 8 vzameš 9?", "65?", "Da."],
    [R`Koliko je $45° + 45°$?`, "90?", "Da."],
    [R`Koliko je $360° : 6$?`, "60?", "Da."],
    [R`Koliko je $10 : 3$?`, "3?", "Da, 3."],
    [R`Deljenje z ostankom. Koliko je $10 : 3$?`, "3,33?", "Ne."],
    ["Koliko je 10 : 4?", "2?", "Da."],
  ]) {
    for (const n of [2, null]) {
      const r = await run({ answers: [prev, a], n, msgs: [T, q] });
      assert.equal(r.calls.filter((c) => c === "chat").length, 2, `${prev} ${q}`);
      none(r);
    }
  }
  const oklepaj = await run({ answers: ["Koliko je vsebina oklepaja na koncu?", "Da."], n: 2, msgs: [R`Izračunaj $(7 \cdot 8 + 2) \cdot 2$.`, "58?"] });
  none(oklepaj);
  for (const a of [R`Ali veš, da je $\frac{1}{3} = 0{,}(3)$?`, R`Če zapišemo periodično, je $\frac{1}{9} = 0{,}(1)$.`, R`Ali je $1.000 + 1 = 1.001$?`, R`Torej je $\frac{1}{3} = 0{,}(3)$.`, R`$\frac{1}{7} = 0{,}(142857)$`, R`$\frac{1}{6} = 0{,}1(6)$`, R`$2.500 + 500 = 3.000$`, R`Skupaj: $1.200 + 300 = 1.500$ €.`]) {
    for (const opt of [{ n: 1 }, { n: null, fixText: "OK" }]) {
      const r = await run({ answers: [a], msgs: ["Razloži mi to."], ...opt });
      assert.ok(!r.calls.includes("fix"), `${a}: brez klica popravka`);
      none(r);
    }
  }
});

// Pregled A (7f565d941): pravilni odgovori, ki jih main pošlje v popravek, na meji in ob napaki klica brez opombe.
test("pregled A: lažni alarmi main pri vrednosti, uri, bloku RACUN in zavrnitvi brez opombe na meji", async () => {
  const cases = [
    [R`Reši enačbo $x^2 - 6x + 5 = 0$.`, R`Rešitvi sta $x_1 = 1$ in $x_2 = 5$. Simetrala parabole je premica $x = 3$.`],
    [R`Reši enačbo $5x = 100$.`, R`$x = 20$ (to je $x = 0{,}2$ m).`],
    [R`Reši enačbo $x - 2 = 0$ v cm.`, R`Rešitev: $x = 2$ cm, kar je $x = 20$ mm.`],
    [R`Reši enačbo $4x + 2 = 18$.`, R`Pomagaj si z obratnimi operacijami. Npr. pri $x + 3 = 5$ odšteješ 3 in dobiš $x = 2$. Kaj narediš pri svoji enačbi najprej?`],
    [R`Reši enačbo $2x - 1 = 5$.`, R`$2x = 6$, $x = 3$. Za vajo: reši še $2x - 1 = 7$ (rešitev $x = 4$).`],
    [R`Reši enačbo $2x + 4 = 10$.`, R`$x = 3$. Pogosta napaka je $x = 7$ (ko pozabiš deliti z 2).`],
    [R`Reši enačbo $x^3 - x = 0$.`, R`$x(x^2 - 1) = 0$: $x = 0$, $x = 1$, $x = -1$. Lokalni ekstrem pri $x = \frac{1}{\sqrt{3}}$.`],
    [R`Reši enačbo $x^2 - 2x - 3 = 0$.`, R`$(x - 3)(x + 1) = 0$, rešitvi $x_1 = 3$, $x_2 = -1$. Teme parabole je pri $x = 1$, kar je ravno sredina med ničlama.`],
    [R`Reši enačbo $x^2 - 4 = 0$.`, R`Rešitvi sta $x = 2$ in $x = -2$; za $x = 0$ je vrednost $-4$.`],
    ["Ura?", R`$23 + 3 = 2$ (ura po polnoči).`],
    [R`Reši enačbo $2x + 3 = 11$.`, "$2x = 8$, torej $x = 4$.\n<<RACUN\nresi: 2*x+3=11 | x | 5\n>>"],
  ];
  for (const [q, a] of cases) {
    for (const opt of [{ n: 1 }, { n: null, fixText: null }]) {
      const r = await run({ answers: [a], msgs: [q], ...opt });
      none(r);
    }
  }
  // prezrta sodba brez izrecne potrditve (»Ne. …«, »… kar ni 11. Poskusi znova.«): ponovni odgovor kot main, na meji brez opombe
  for (const [task, ans] of [
    [R`Reši enačbo $3x + 7 = 22$.`, R`Ne. $3 \cdot 6 + 7 = 25$, ne 22.`],
    [R`Reši enačbo $2x + 3 = 11$.`, R`Napisal si $x = 6$. Vstavi v enačbo: $2 \cdot 6 + 3 = 15$, kar ni 11. Poskusi znova.`],
  ]) {
    for (const opt of [{ n: 2 }, { n: null, chatFail: 3 }]) {
      const r = await run({ answers: ["Kaj dobiš za x?", ans], msgs: [task, "x = 6"], ...opt });
      none(r);
    }
  }
});

// Pregleda A in B (018af7ab6): pravilni odgovori brez opombe na meji in ob napaki klica; popravek kot main.
test("pregleda A in B: drug sistem, namig, označena napaka in vmesni korak brez opombe na meji", async () => {
  const cases = [
    ["Dvojiško?", R`V dvojiškem zapisu je $1 + 1 = 10$.`],
    ["Ostanki?", R`V $\mathbb{Z}_5$ je $3 + 4 = 2$.`],
    ["Ura?", R`Ob 22h čez 5 h je $22 + 5 = 3$ zjutraj.`],
    ["Logika?", R`Logično ALI: $1 + 1 = 1$.`],
    ["Potence?", R`Mnogi zamenjajo potenco z množenjem: $2^3 = 6$. Prav je $2^3 = 8$.`],
    ["Poštevanka?", "❌ $7 \\cdot 8 = 54$\n✅ $7 \\cdot 8 = 56$"],
    ["Poštevanka?", R`Ne piši $7 \cdot 8 = 54$.`],
    [R`Reši enačbo $2x + 3 = 11$.`, R`Ne deli z 2, sicer dobiš $x = 6$.`],
    [R`Reši enačbo $2x + 3 = 11$.`, R`Začni z $x = 0$: leva stran je 3. Nato povečuj $x$, dokler ne dobiš 11.`],
    [R`Reši enačbo $2x + 3 = 11$.`, R`Preverimo $x = 3$: $2 \cdot 3 + 3 = 9$, kar ni 11. Torej več.`],
  ];
  for (const [q, a] of cases) {
    for (const opt of [{ n: 1 }, { n: null, fixText: null }]) none(await run({ answers: [a], msgs: [q], ...opt }));
  }
  // vmesni korak v besedilni nalogi: »58?« in »Da, 58!« brez sodbe kode in brez opombe
  for (const opt of [{ n: 2 }, { n: null, chatFail: 3 }]) {
    const r = await run({ answers: [R`Najprej množenje. Koliko je $7 \cdot 8$?`, "Da, 58!"], msgs: ["Ana ima 7 vrečk po 8 bonbonov in še 2 bonbona. Koliko jih ima?", "58?"], ...opt });
    none(r);
  }
});


import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { modeParams } from "../server/claude.js";
import { presolve, isClaim, givesVerdict } from "../server/live-check.js";
import { stepVerdict, arithmeticErrors, verdictIgnored } from "../server/sodba-koraka.js";
import { reviewVerdict } from "../server/live-check.js";

const META = '\n<<META subject=MAT topic="enačbe" error=0 mode=A flag=none done=0>>';
const verdict = (text, o) => stepVerdict(text, o);

test("sodba koraka: enačba proti nalogi iz prvega sporočila (pravilen, napačen, brez sodbe)", () => {
  const pre = presolve("Reši enačbo 2x + 3 = 11", { first: true });
  const o = { pre, prevTutor: "Kaj narediš najprej?" };
  assert.equal(verdict("2x = 14", o).wrong, true);
  assert.match(verdict("2x = 14", o).finding, /\$2x = 14\$ does not follow from \$2x \+ 3 = 11\$: it gives x = 7, but .* gives x = 4/);
  assert.equal(verdict("2x = 8", o).wrong, false);
  assert.equal(verdict("2x+3-3 = 11-3", o).wrong, false);
  assert.match(verdict("x = 7", o).finding, /result x = 7 is wrong/);
  assert.equal(verdict("x = 4", o).wrong, false);
  // Vmesni račun v verigi s pravilnim rezultatom ni napaka; prepisana naloga ni korak.
  assert.equal(verdict("2x = 11 - 3 = 8", o), null);
  assert.equal(verdict("2x + 3 = 11", o), null);
  // Inštruktor je medtem zastavil drugo enačbo ali vajo: koda ne sodi proti prvi nalogi (tudi ne končne vrednosti).
  assert.equal(verdict("x = 5", { pre, prevTutor: "Poskusiva najprej lažjo: $x + 3 = 8$. Koliko je $x$?" }), null);
  assert.equal(verdict("x = 3", { pre, prevTutor: "**Vaja:** reši $3x = 9$." }), null);
});

test("sodba koraka: enačba proti inštruktorjevi zadnji enačbi (besedilna naloga, razcep, rešitve)", () => {
  const t = "Imamo $x^2 - 5x + 6 = 0$. Razstavi levo stran.";
  assert.equal(verdict("(x-2)(x-3)=0", { prevTutor: t }).wrong, false);
  assert.equal(verdict("(x-2)(x+3) = 0", { prevTutor: t }).wrong, true);
  assert.equal(verdict("x1 = 2, x2 = 3", { prevTutor: t }).wrong, false);
  assert.equal(verdict("x1 = 2, x2 = -3", { prevTutor: t }).wrong, true);
  assert.equal(verdict("x = -2", { prevTutor: t }).wrong, true);
  // Razcep na primere (ena rešitev) in nepopoln odgovor (ena vrednost) ostaneta modelu.
  assert.equal(verdict("x - 2 = 0", { prevTutor: t }), null);
  assert.equal(verdict("x = 2", { prevTutor: t }), null);
  // Zaokrožena rešitev (»0,70« za 0,697…) ni napaka.
  assert.equal(verdict("x1 = 0,70, x2 = 4,30", { prevTutor: "Imamo $x^2 - 5x + 3 = 0$." }).wrong, false);
  assert.equal(verdict("x = 7", { prevTutor: "Zapiši enačbo: $2x + 3 = 11$. Koliko je $x$?" }).wrong, true);
  // Učenčeva enačba, ki jo inštruktor citira, ni enačba, ki se rešuje.
  assert.equal(verdict("x = 7", { prevTutor: "Ti si napisal $2x = 14$. Kaj zdaj?" }), null);
  // Neznanka v imenovalcu, korenu ali eksponentu: koraki lahko pravilno spremenijo rešitve, koda ne sodi.
  assert.equal(verdict("1 = 2x", { prevTutor: "Reši $\\frac{1}{x} = 2$." }), null);
  assert.equal(verdict("x + 1 = 4", { prevTutor: "Reši $2^{x+1} = 16$." }), null);
  // Dve različni enačbi v zadnjem sporočilu: ni jasno, katera se rešuje.
  assert.equal(verdict("x = 5", { prevTutor: "Primer: $x + 2 = 5$ → $x = 3$. Zdaj ti: $2x + 3 = 11$." }), null);
});

test("sodba koraka: računi brez neznank", () => {
  for (const s of ["7·8 = 54", "-3^2 = 9", "2 + 3·4 = 5·4 = 20", "1/2 + 1/3 = 2/5", "Rezultat: 7·8 = 54.", "√(9 + 16) = 3 + 4 = 7", "0,2 · 0,3 = 0,6", "D = 25 - 24 = 2", "2^3 · 2^4 = 2^12"]) assert.equal(arithmeticErrors(s).length, 1, s);
  for (const s of ["7 · 8 = 56", "(-3)^2 = 9", "-3^2 = -9", "√2 = 1,41", "2/3 = 0,66", "10/3 = 3,33", "√10 = 3", "x + 1 = 2·3 = 7", "2 na 3 = 6", "sin 30 = 0,5", "1 m = 100 cm", "5 cm · 3 = 15 cm", "mislil sem 2^3 = 6 ampak ni", "log_2 8 = 4", "1.000 + 1 = 1.001", "2^10 = 1 024", "- 7 · 8 = 56", "a10 = 3 + 10·4 = 43", "f(2) = 5", "x2 = 3"]) assert.deepEqual(arithmeticErrors(s), [], s);
  assert.match(arithmeticErrors("7·8 = 54")[0], /\$7·8 = 54\$ is wrong: \$7·8 = 56\$/);
  // Pravilen račun koda ne »potrdi«: lahko je pravilno izračunan napačen korak (D = 16 - 20 namesto 16 + 20).
  assert.equal(verdict("D = 16 - 20 = -4", {}), null);
});

test("sodba koraka: ali je odgovor sledil sodbi kode", () => {
  const wrong = { wrong: true };
  for (const a of ["Prav! Zdaj deli z 2.", "Dobro, zdaj pa deli obe strani z 2.", "Ana, odlično.", "Zdaj deli obe strani z 2."]) assert.equal(verdictIgnored(a, wrong), true, a);
  for (const a of ["Skoraj! Poglej še enkrat 11 − 3.", "Hmm, preveri odštevanje.", "Dobro si začel, ampak 11 − 3 ni 14.", "Ni čisto prav: koliko je 11 − 3?"]) assert.equal(verdictIgnored(a, wrong), false, a);
  const right = { wrong: false };
  for (const a of ["Ni čisto prav.", "Ne, poglej.", "Narobe."]) assert.equal(verdictIgnored(a, right), true, a);
  for (const a of ["Pravilno!", "Tako je. Zdaj deli z 2.", "Kaj narediš zdaj?"]) assert.equal(verdictIgnored(a, right), false, a);
  assert.equal(verdictIgnored("Prav!", null), false);
});

test("sodba koraka: sam »Prav«, »Dobro«, »Lepo«, »Da« sprožijo pregled sodbe (Gemini 18. 11.)", () => {
  for (const a of ["Prav! Zdaj odštej 3.", "Dobro. Kaj sledi?", "Lepo, naslednji korak:", "Da, in zdaj …", "Natanko.", "Imaš prav.", "Okej, naprej.", "Ne, poglej še enkrat.", "Ni čisto: $\\sqrt{2}$ ni enako $1{,}41$."]) assert.equal(givesVerdict(a), true, a);
  for (const a of ["Kaj narediš najprej?", "Zdaj deli obe strani z 2."]) assert.equal(givesVerdict(a), false, a);
});

test("sodba koraka: nabor napačnih korakov (matura MAT) je ujet, pravilni koraki brez lažnega alarma", () => {
  const { primeri } = JSON.parse(fs.readFileSync(new URL("./fixtures/napacni-koraki.json", import.meta.url), "utf8"));
  assert.ok(primeri.length >= 20);
  for (const p of primeri) {
    const pre = p.naloga ? presolve(p.naloga, { first: true }) : null;
    assert.equal(isClaim(p.ucenec, p.tutor), true, p.id);
    const v = stepVerdict(p.ucenec, { pre, prevTutor: p.tutor });
    if (v) assert.equal(v.wrong, !p.pravilen, `${p.id}: sodba kode`);
    // Slab odgovor (potrditev napačnega, zavrnitev pravilnega) ujame koda po odgovoru ali gre v pregled z modelom.
    const caught = v ? verdictIgnored(p.odgovor, v) : givesVerdict(p.odgovor);
    assert.equal(caught, true, `${p.id}: slab odgovor ni ujet`);
  }
});

// Klepet s pravim strežnikom: odgovori inštruktorja po vrsti iz `answers`, pregled sodbe iz `reviews`.
function harness({ answers = [], reviews = [] } = {}) {
  const store = openDb(":memory:");
  const calls = [];
  const reviewCalls = [];
  const streamFn = async ({ system, messages, mode, onText }) => {
    calls.push({ system, messages, mode });
    const text = (answers.shift() ?? "Odgovor.") + META;
    onText(text);
    return { content: [{ type: "text", text }], text, stopReason: "end_turn", model: modeParams(mode).model, usage: { input_tokens: 100, output_tokens: 20 } };
  };
  const reviewCreateFn = async (params) => {
    reviewCalls.push(params);
    const text = reviews.shift() ?? "OK";
    return { content: [{ type: "text", text }], stop_reason: "end_turn", model: params.model, usage: { input_tokens: 1000, output_tokens: 10 } };
  };
  const server = createApp(store, { streamFn, reviewCreateFn }).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (p, body) => {
    const res = await fetch(base + p, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    return (res.headers.get("content-type") || "").includes("json") ? res.json() : res.text();
  };
  const conversation = async () => {
    const s = await call("/api/students", { name: "Ana", settings: {} });
    const c = await call(`/api/students/${s.id}/conversations`, {});
    return (text) => call(`/api/conversations/${c.id}/messages`, { text });
  };
  const kinds = () => store.db.prepare("SELECT kind, COUNT(*) AS n FROM usage GROUP BY kind").all().reduce((o, r) => ((o[r.kind] = r.n), o), {});
  return { calls, reviewCalls, conversation, kinds, close: () => server.close() };
}

test("sodba koraka v klepetu: »Prav!« ob napačnem vmesnem koraku učenec ne vidi; inštruktor odgovori znova brez pregleda z modelom", async () => {
  const h = harness({ answers: ["Kaj narediš najprej?", "Prav! Zdaj deli obe strani z $2$.", "Skoraj: preveri, koliko je $11 - 3$."] });
  try {
    const post = await h.conversation();
    await post("Reši enačbo 2x + 3 = 11");
    const sse = await post("2x = 14");
    assert.equal(h.calls.length, 3, "prvi odgovor, nato ponovni odgovor po sodbi kode");
    assert.equal(h.reviewCalls.length, 0, "koda je sodila: brez Sonneta");
    const firstNote = h.calls[1].messages.at(-1).content.at(-1).text;
    assert.match(firstNote, /<preverjen_racun>[\s\S]*error in the student's last message[\s\S]*\$2x = 14\$ does not follow/);
    const againNote = h.calls[2].messages.at(-1).content.at(-1).text;
    assert.match(againNote, /judged the student's message wrongly[\s\S]*answer again/);
    assert.doesNotMatch(sse, /Prav!/, "napačna potrditev ni prišla do učenca");
    assert.match(sse, /preveri, koliko je/);
    assert.equal(h.kinds().popravek, 1);
  } finally {
    h.close();
  }
});

test("sodba koraka v klepetu: odgovor, ki sledi sodbi kode, gre naprej brez ponovnega klica; »Prav« brez sodbe kode gre v pregled", async () => {
  const h = harness({ answers: ["Imamo $5x - 7 = 3x + 9$. Prenesi neznanke na levo. Kaj dobiš?", "Hmm, preveri še enkrat desno stran.", "Koliko je $\\log_2 8$?", "Prav! Zdaj pa $\\log_3 27$.", "Ni čisto: $2^4 = 16$, ne $8$. Katera potenca števila $2$ je $8$?"], reviews: ["NAPAKA: log_2 8 = 3, not 4; the tutor confirmed it."] });
  try {
    const post = await h.conversation();
    await post("Pomagaj mi pri enačbah");
    await post("2x = 2");
    assert.equal(h.calls.length, 2, "odgovor je sledil sodbi: brez ponovnega klica");
    assert.match(h.calls[1].messages.at(-1).content.at(-1).text, /\$2x = 2\$ does not follow from \$5x - 7 = 3x \+ 9\$/);
    await post("ok");
    const sse = await post("log_2 8 = 4");
    assert.equal(h.reviewCalls.length, 1, "sam »Prav!« sproži pregled sodbe");
    assert.doesNotMatch(sse, /Prav!/);
    assert.match(sse, /Katera potenca/);
  } finally {
    h.close();
  }
});

test("sodba koraka: brez lažnega alarma (pregled 2)", () => {
  // Razcep na prafaktorje, ostanek, oštevilčenje, tekoča veriga, ura s piko.
  for (const s of ["360 = 2³ · 3² · 5", "7 : 2 = 3, ostanek 1", "2. 3 + 4 = 7", "5 + 3 = 8 - 2 = 6", "8.30 = 8,5"]) assert.deepEqual(arithmeticErrors(s), [], s);
  assert.equal(arithmeticErrors("3 + 4 = 7. 2 + 2 = 5").length, 1);
  // Inštruktor sprašuje po drugi količini (Vieta, teme, odvod, vrednost izraza) ali je v igri druga neznanka.
  assert.equal(verdict("x1 + x2 = 5", { prevTutor: "Enačba $x^2 - 5x + 6 = 0$. Koliko je $x_1 + x_2$?" }), null);
  assert.equal(verdict("x = 2", { prevTutor: "Ničli enačbe $x^2 - 4x + 3 = 0$ sta 1 in 3. Kje je teme?" }), null);
  assert.equal(verdict("2x - 4 = 0", { prevTutor: "Imamo $x^2 - 4x + 3 = 0$. Kje ima funkcija ekstrem? Odvajaj." }), null);
  assert.equal(verdict("x = 6", { prevTutor: "Recimo, da je $2x = 10$. Koliko je $x + 1$?" }), null);
  assert.equal(verdict("x = 1", { prevTutor: "Iz $t = 9$: $x^2 = 9$. Iz $t = 1$ pa?" }), null);
  assert.equal(verdict("x = 2", { pre: presolve("Reši enačbo x^2 - 4x + 3 = 0", { first: true }), prevTutor: "Odlično. Zdaj poišči teme parabole." }), null);
  // Oštevilčen korak in tisočice s piko.
  assert.equal(verdict("2. x = 3", { prevTutor: "Reši $x + 2 = 5$." }).wrong, false);
  assert.equal(verdict("x = 1.000", { prevTutor: "Reši $x - 1000 = 0$." }), null);
  // Ena od dveh rešitev je nepopoln odgovor: »Skoraj, manjka še ena« ne sproži ponovnega odgovora.
  const v = verdict("x = 3", { pre: presolve("Reši enačbo x^2 = 3x", { first: true }), prevTutor: "Kaj narediš?" });
  assert.equal(v.wrong, false);
  assert.equal(verdictIgnored("Skoraj! Manjka še ena rešitev.", v), false);
  assert.equal(verdictIgnored("Ne pozabi še preizkusa.", { wrong: false }), false);
  // »Prav, preverimo …« ob napačnem koraku je potrditev, ne opozorilo.
  for (const a of ["Prav, preverimo še z vstavitvijo.", "Dobro, poglejmo naslednji korak."]) assert.equal(verdictIgnored(a, { wrong: true }), true, a);
});

test("sodba koraka: nepopoln odgovor (ena od dveh rešitev) opomba označi kot NEPOPOLN, ne kot pravilen (meritev 19. 11.)", () => {
  const pre = presolve("Reši (x - 2)^2 = 9", { first: true });
  const v = verdict("korenim, x - 2 = 3, torej x = 5", { pre, prevTutor: "Kaj narediš z obema stranema enačbe?" });
  assert.equal(v.wrong, false);
  assert.equal(v.partial, true);
  assert.match(v.note, /INCOMPLETE: the task has 2 solutions/);
  assert.match(v.note, /do not call the answer .* right or complete/);
  assert.doesNotMatch(v.note, /is CORRECT/);
  assert.match(v.note, /do not state the missing solutions/);
  // Obe rešitvi: opomba ostane »CORRECT«.
  assert.match(verdict("x1 = 5, x2 = -1", { pre, prevTutor: "Kaj dobiš?" }).note, /is CORRECT/);
  // Obe rešitvi brez indeksov (rootList ju ne bere): opomba ne sme reči INCOMPLETE (pregled 2).
  for (const a of ["x = 5 ali x = -1", "x = -1, 5", "x = 2 ± 3, torej x = 5 in x = -1"]) assert.doesNotMatch(verdict(a, { pre, prevTutor: "Kaj dobiš?" }).note, /INCOMPLETE/, a);
  // »Skoraj, manjka še ena« ob nepopolnem odgovoru še vedno ni zavrnitev pravilnega (brez ponovnega odgovora).
  assert.equal(verdictIgnored("Skoraj! Manjka še ena rešitev.", v), false);
});

test("pregled sodbe: navodila zajamejo »Pravilno« pred namigom, dvom o pravilnem računu in namig na napačno mesto", async () => {
  let system = "";
  const createFn = async (p) => {
    system = p.system;
    return { content: [{ type: "text", text: "NAPAKA: 6 - 2x ≥ 0, the tutor opened with »Pravilno«." }], stop_reason: "end_turn", model: p.model, usage: { input_tokens: 10, output_tokens: 5 } };
  };
  const r = await reviewVerdict({ context: "Kaj mora veljati za izraz pod korenom?", student: "6 - 2x > 0, torej x < 3", answer: "Pravilno, Ana. Pod korenom mora biti nenegativno število.", createFn });
  assert.match(r.reason, /Pravilno/);
  assert.match(system, /Opening with praise or a confirmation .* is an error even when a hint about the error follows later/);
  assert.match(system, /casting doubt on a right result or step/);
  assert.match(system, /pointing at a wrong place while the real error is elsewhere/);
});

// AUDIT-059: negotov rezultat z vprašajem (»x = 5?«) je trditev; sodba inštruktorja se preveri kot pri »x = 5«.
test("AUDIT-059: »x = 5?«, »je 7 · 8 = 54?«, »mogoče 12?« so trditve, prava vprašanja ne", async () => {
  for (const t of ["x = 5?", "a je x = 5?", "je 7 · 8 = 54?", "7·8=54?", "mogoče 12?", "12?", "x=-2?", "Je rezultat 3/4?"]) assert.equal(isClaim(t, ""), true, t);
  for (const t of ["Koliko je 7 · 8?", "Zakaj ne smem deliti z 0?", "Kaj je x?", "Ali je to 3. naloga?", "Kaj pa 3x = 15?", "Reši 2x+3=11?"]) assert.equal(isClaim(t, ""), false, t);
  // po poti klepeta: »x = 5?« pri 2x + 3 = 11 z odgovorom »Da, pravilno!« sproži ponovni odgovor (kot »x = 5«)
  const { openDb } = await import("../server/db.js");
  const run = async (msg) => {
    const store = openDb(":memory:");
    const calls = [];
    const answers = ["Kaj narediš najprej?", "Da, pravilno! Zdaj naredi preizkus."];
    const META = '\n<<META subject=MAT topic="x" error=0 mode=A flag=none done=0>>';
    const streamFn = async ({ system, mode, onText }) => {
      const isFix = String(system).startsWith("You fix");
      calls.push(isFix ? "fix" : "chat");
      const text = isFix ? "OK" : (answers.shift() ?? "Ne, preveri še enkrat.") + META;
      if (!isFix) onText(text);
      return { content: [{ type: "text", text }], text, stopReason: "end_turn", model: modeParams(mode).model, usage: { input_tokens: 100, output_tokens: 20 } };
    };
    const reviewCreateFn = async (p) => ({ content: [{ type: "text", text: "OK" }], stop_reason: "end_turn", model: p.model, usage: { input_tokens: 10, output_tokens: 5 } });
    const server = createApp(store, { streamFn, reviewCreateFn }).listen(0);
    const base = `http://127.0.0.1:${server.address().port}`;
    const call = async (p, b) => {
      const r = await fetch(base + p, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b || {}) });
      return (r.headers.get("content-type") || "").includes("json") ? r.json() : r.text();
    };
    try {
      const s = await call("/api/students", { name: "Ana", settings: {} });
      const c = await call(`/api/students/${s.id}/conversations`, {});
      await call(`/api/conversations/${c.id}/messages`, { text: "Reši 2x + 3 = 11" });
      await call(`/api/conversations/${c.id}/messages`, { text: msg });
      return calls.filter((x) => x === "chat").length;
    } finally {
      server.close();
    }
  };
  const plain = await run("x = 5");
  assert.ok(plain >= 3, `»x = 5« sproži ponovni odgovor (${plain})`);
  assert.equal(await run("x = 5?"), plain);
});

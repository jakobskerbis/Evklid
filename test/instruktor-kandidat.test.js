// Popravki inštruktorja (server/instruktor-kandidat.js, j 21. 11. 2026): predlogi s/z in k/h, notranje oznake,
// pretakanje enako kot končni prikaz (vklopljeno za vse), izbira prompta kandidata z EVKLID_INSTRUKTOR_KANDIDAT.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { spawnSync } from "node:child_process";
import { fixPrepositions, stripLabels, polishReply, polishHold, kandidatOn, jezikOdgovora } from "../server/instruktor-kandidat.js";
import { createStreamFilter, replyText, stripMeta, stripLeadPhrase } from "../server/meta.js";
import { templatePath, PROMPT_PATH, KANDIDAT_PROMPT_PATH, SPLIT_MARKER } from "../server/prompt.js";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

test("predlogi s/z in k/h: primeri iz ocen meritve 19. 11. in pravilni zapisi ostanejo", () => {
  const prav = {
    "Ali lahko $32$ zapišeš kot potenco s osnovo $2$?": "Ali lahko $32$ zapišeš kot potenco z osnovo $2$?",
    "Jaz te bom vodil s vprašanji.": "Jaz te bom vodil z vprašanji.",
    "Poglej k grafu.": "Poglej h grafu.",
    "Pojdi h točki $A$.": "Pojdi k točki $A$.",
    "S osnovo $3$ zapiši $27$.": "Z osnovo $3$ zapiši $27$.",
    "Primerjaj z sliko.": "Primerjaj s sliko.",
    "Kaj se zgodi k koncu intervala?": "Kaj se zgodi h koncu intervala?",
  };
  for (const [a, b] of Object.entries(prav)) assert.equal(fixPrepositions(a), b, a);
  for (const ok of ["S tem dobiš $x$.", "s pomočjo grafa", "z osnovo $2$", "h grafu", "k točki", "s tem", "z vodo", "s hitrostjo"]) {
    assert.equal(fixPrepositions(ok), ok, ok);
  }
});

test("predlogi: nikoli v LaTeX, kodi, povezavi, pred številko, formulo, kratico ali za količino", () => {
  for (const t of [
    "$a s b$ in $k grafu$",
    "$$s osnovo$$",
    "\\(s osnovo\\) in \\[k grafu\\]",
    "`s osnovo` in ```\nk grafu\n```",
    "Glej https://primer.si/s osnovo",
    "s $x$ in k $5$",
    "s 5 in k 5",
    "Prevozil je 5 s dolgo pot.",
    "z ATP in s DNA",
    "s je pot, h je višina, k pomeni naklon",
    "Višino h zapiši kot ulomek.",
    "Točka S leži na premici.",
    "<<IZBIRE [\"s osnovo\"]>>",
    "{{IME}}, k {{IME}}",
  ]) {
    assert.equal(fixPrepositions(t), t, t);
  }
});

test("oznake »Najprej priklic:« in »Najprej preveri predznanje:« izginejo, vprašanje ostane", () => {
  assert.equal(stripLabels("Super, da jo želiš rešiti sama. Najprej preveri predznanje: kako bi za funkcijo $x^2$ poiskala primitivno funkcijo?"), "Super, da jo želiš rešiti sama. Kako bi za funkcijo $x^2$ poiskala primitivno funkcijo?");
  assert.equal(stripLabels("Prav, rešiva jo korak za korakom.\n\nNajprej priklic: kako po komponentah zapišemo skalarni produkt?"), "Prav, rešiva jo korak za korakom.\n\nKako po komponentah zapišemo skalarni produkt?");
  assert.equal(stripLabels("**Najprej priklic predznanja:**\n\nKaj veš o potencah?"), "Kaj veš o potencah?");
  assert.equal(stripLabels("### Priklic predznanja\nKaj je odvod?"), "Kaj je odvod?");
  assert.equal(stripLabels("Najprej priklic: $2^3$ je koliko?"), "$2^3$ je koliko?");
  // Navaden stavek in oznaka sredi stavka ostaneta.
  for (const ok of ["Najprej preveri, kaj veš o sinusu: kaj pomeni $\\sin x$?", "To je priklic: dober za spomin.", "Uporabi najprej priklic predznanja."]) {
    assert.equal(stripLabels(ok), ok);
  }
});

test("popravek predlogov le v slovenščini (v hrvaščini je »s osnovom« pravilno)", () => {
  assert.equal(polishReply("Najprej priklic: s osnovom", { language: "hr" }), "S osnovom");
  assert.equal(polishReply("potenco s osnovo $2$", { language: "sl" }), "potenco z osnovo $2$");
});

test("zadrževanje pri pretakanju: predlog brez besede in začetek oznake", () => {
  assert.equal(polishHold("Zapiši s"), 1);
  assert.equal(polishHold("Zapiši s osno"), 6);
  assert.equal(polishHold("Zapiši s osnovo,"), 0);
  assert.ok(polishHold("Dobro. Najprej pri") >= 11);
  assert.ok(polishHold("Dobro. Najprej priklic:") >= 16);
  assert.equal(polishHold("Dobro. Pravilno"), 0);
});

const odgovori = [
  'Super, da jo želiš rešiti sama. Najprej preveri predznanje: kako bi za funkcijo $x^2$ poiskala primitivno funkcijo?\n\nPoglej k grafu s osnovo $2$ in s pomočjo tabele.\n<<META subject=MAT topic="integral" error=0 mode=A flag=none>>',
  "Najprej priklic: kako zapišeš $27$ kot potenco s osnovo $3$?",
  "Odlično vprašanje! **Najprej priklic predznanja:**\n\nKaj veš o potencah? Vodil te bom s vprašanji.\n<<IZBIRE [\"s osnovo\", \"ne vem\"]>>",
  "Ta korak ni pravilen: v členu $2x^2$ je napaka. Primerjaj ga z odvodom s",
  "Kratko: s osnovo.",
];

test("pretakanje s kandidatom: pri vsakem razrezu je pretočeno besedilo enako končnemu prikazu", () => {
  for (const text of odgovori) {
    const want = replyText(text, { polish: true });
    for (const size of [1, 2, 3, 5, 7, 13, 40, 1000]) {
      const f = createStreamFilter({ polish: true });
      let got = "";
      for (let i = 0; i < text.length; i += size) got += f.push(text.slice(i, i + size));
      got += f.end().rest;
      assert.equal(got, want, `razrez ${size}: ${text.slice(0, 40)}`);
    }
  }
  assert.equal(replyText(odgovori[0], { polish: true }), "Super, da jo želiš rešiti sama. Kako bi za funkcijo $x^2$ poiskala primitivno funkcijo?\n\nPoglej h grafu z osnovo $2$ in s pomočjo tabele.");
});

test("polish: false nič ne spremeni; zastavica izbere le datoteko prompta", () => {
  assert.equal(kandidatOn({}), false);
  assert.equal(kandidatOn({ EVKLID_INSTRUKTOR_KANDIDAT: "0" }), false);
  assert.equal(kandidatOn({ EVKLID_INSTRUKTOR_KANDIDAT: "1" }), true);
  assert.equal(templatePath({}), PROMPT_PATH);
  assert.equal(templatePath({ EVKLID_INSTRUKTOR_KANDIDAT: "1" }), KANDIDAT_PROMPT_PATH);
  assert.equal(templatePath({ EVKLID_INSTRUKTOR_KANDIDAT: "1", EVKLID_PROMPT_PATH: "/x.md" }), "/x.md", "izrecna pot ima prednost");
  for (const text of odgovori) {
    assert.equal(replyText(text, { polish: false }), stripLeadPhrase(stripMeta(text)));
    const f = createStreamFilter({ polish: false });
    let got = "";
    for (let i = 0; i < text.length; i += 3) got += f.push(text.slice(i, i + 3));
    got += f.end().rest;
    assert.equal(got, stripLeadPhrase(stripMeta(text)), "brez popravkov nespremenjeno");
    if (text !== odgovori[3]) assert.match(got, /s osnovo|Najprej|s vprašanji/);
  }
});

test("prompt: zastavica izbere kandidata, sicer ostane prompts/system_prompt.md (ločen proces, predloga se predpomni)", () => {
  const code = 'const { loadTemplate } = await import("./server/prompt.js"); process.stdout.write(loadTemplate());';
  const run = (extra) => {
    const env = { ...process.env, ...extra };
    delete env.EVKLID_PROMPT_PATH;
    const r = spawnSync(process.execPath, ["--input-type=module", "-e", code], { encoding: "utf8", env });
    assert.equal(r.status, 0, r.stderr);
    return r.stdout;
  };
  const prod = fs.readFileSync(PROMPT_PATH, "utf8");
  const kand = fs.readFileSync(KANDIDAT_PROMPT_PATH, "utf8");
  assert.equal(run({ EVKLID_INSTRUKTOR_KANDIDAT: "" }), prod);
  assert.equal(run({ EVKLID_INSTRUKTOR_KANDIDAT: "1" }), kand);
});

test("prompt (produkcijski in kandidat): enak del za učenca in vse oznake, nova pravila v predpomnjenem delu", () => {
  const [ps, pd] = fs.readFileSync(PROMPT_PATH, "utf8").split(SPLIT_MARKER);
  const [ks, kd] = fs.readFileSync(KANDIDAT_PROMPT_PATH, "utf8").split(SPLIT_MARKER);
  assert.equal(kd, pd, "del pod oznako NASTAVITVE je enak");
  const ph = (s) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).join(",");
  assert.equal(ph(ks), ph(ps), "iste oznake v stalnem delu");
  assert.doesNotMatch(ks, /\*\*Najprej priklic predznanja, nato razlaga\.\*\*/);
  for (const re of [/nikoli ne zapišeš kot oznako ali naslov/, /že prvi stavek jasno in prijazno pove, da korak ni pravilen/, /»morda nepopolno«/, /ni pa edina/, /meri natanko na napačni del/, /»z osnovo«, »z vprašanji«/, /»vsota prvih desetih členov«/, /ne uporabljaj črke, ki v nalogi že pomeni nekaj drugega/, /z \$u\$ in \$v\$/, /ostani pri tej napaki, brez nove snovi/, /»rada bi rešila«/, /po imenu v pogovoru ne ugibaj/]) {
    assert.match(ks, re);
    assert.match(ps, re, "pravila kandidata so v produkcijskem promptu (21. 11. 2026)");
  }
  assert.ok(ks.length - ps.length < 1800, `kandidat doda ${ks.length - ps.length} znakov`);
});

function fakeStream(text) {
  return async ({ onText }) => {
    for (let k = 0; k < text.length; k += 4) onText(text.slice(k, k + 4));
    return { content: [{ type: "text", text }], text, stopReason: "end_turn" };
  };
}

async function pogovor(reply) {
  const store = openDb(":memory:");
  const server = createApp(store, { streamFn: fakeStream(reply) }).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (p, body) => fetch(base + p, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body || {}) });
  try {
    const s = await (await post("/api/students", { name: "Miha" })).json();
    const c = await (await post(`/api/students/${s.id}/conversations`)).json();
    const sse = await (await post(`/api/conversations/${c.id}/messages`, { text: "Kako rešim $2^{x+1} = 32$?" })).text();
    const ev = sse.split("\n\n").filter(Boolean).map((x) => ({ event: /^event: (.*)$/m.exec(x)[1], data: JSON.parse(/^data: (.*)$/m.exec(x)[1]) }));
    const conv = await (await fetch(`${base}/api/conversations/${c.id}`)).json();
    const api = store.db.prepare("SELECT api_content AS content FROM messages WHERE role = 'assistant'").get();
    return { streamed: ev.filter((e) => e.event === "delta").map((e) => e.data.text).join(""), done: ev.at(-1).data.text, stored: conv.messages.at(-1).text, api: String(api?.content || "") };
  } finally {
    server.close();
  }
}

test("aplikacija: učenec vidi popravljeno besedilo (pretočeno, končno, shranjeno) brez zastavice in z njo", async () => {
  const reply = 'Najprej priklic: ali lahko $32$ zapišeš kot potenco s osnovo $2$?\n<<META subject=MAT topic="potence" error=0 mode=A flag=none>>';
  const prej = process.env.EVKLID_INSTRUKTOR_KANDIDAT;
  const fixed = "Ali lahko $32$ zapišeš kot potenco z osnovo $2$?";
  try {
    for (const v of [undefined, "1"]) {
      if (v === undefined) delete process.env.EVKLID_INSTRUKTOR_KANDIDAT;
      else process.env.EVKLID_INSTRUKTOR_KANDIDAT = v;
      const r = await pogovor(reply);
      assert.deepEqual([r.streamed, r.done, r.stored], [fixed, fixed, fixed], String(v));
      assert.match(r.api, /potenco z osnovo/, "tudi zgodovina za model");
      assert.match(r.api, /<<META/, "strojni bloki v zgodovini ostanejo");
    }
  } finally {
    if (prej === undefined) delete process.env.EVKLID_INSTRUKTOR_KANDIDAT;
    else process.env.EVKLID_INSTRUKTOR_KANDIDAT = prej;
  }
});

// Pregled 2 (#910): črka kot spremenljivka v besedilu brez $…$ ostane; oznaka v markdown se ne pretoči na pol.
test("predlogi: spremenljivka za »gre/bo/naj/ko/če/je/označimo« in pred prislovom na -no ostane", () => {
  for (const t of [
    "Ko gre h proti 0, se kvocient približa odvodu.",
    "Kaj se zgodi, ko h zelo zmanjšamo?",
    "Naj bo h pozitivno število.",
    "Naj bo z poljubno kompleksno število.",
    "Naj bo s realno število.",
    "Če je z čisto imaginarno, je $z^2$ negativno.",
    "Označimo h višino trikotnika.",
    "Za s večjo od nič je izraz pozitiven.",
  ]) assert.equal(fixPrepositions(t), t, t);
  // Popravki iz ocen ostanejo.
  assert.equal(fixPrepositions("Jaz te bom vodil s vprašanji."), "Jaz te bom vodil z vprašanji.");
});

test("pretakanje: oznaka v markdown (krepko, naslov, citat) se ne pokaže na pol, pretočeno = končno", () => {
  for (const raw of [
    "Super, da jo želiš rešiti sama.\n\n**Najprej priklic:** Kaj veš o potencah?",
    "Dobro.\n\n### Najprej priklic\nKaj veš o potencah?",
    "Poglejva.\n\n> **Najprej priklic:** kaj je potenca?",
    "To je\n**Priklic\nvišino trikotnika izračunaj prej.",
  ]) {
    const f = createStreamFilter({ polish: true });
    let out = "";
    for (const ch of raw) out += f.push(ch);
    out += f.end().rest;
    assert.equal(out, replyText(raw, { polish: true }), JSON.stringify(raw));
  }
});

// Pregled #915: črka kot ime, hrvaščina pri nastavitvi »sl«, gola »Priklic:« je pojem.
test("predlogi: črka kot ime (orbitala, komponenta, koordinata, naštevanje črk) in hrvaško besedilo ostanejo", () => {
  for (const t of ["Elektron je v s orbitali.", "Zapolni s orbitalo.", "Izračunaj x, y in z komponento.", "Poišči z koordinato točke.", "Enako z koordinato.", "Pri a, b ali k vrednosti."]) {
    assert.equal(fixPrepositions(t), t, t);
  }
  assert.equal(fixPrepositions("Primerjaj s rezultatom in s osnovo."), "Primerjaj z rezultatom in z osnovo.");
  // Jezik se odloči iz učenčevega sporočila, ne iz odgovora (stabilno med pretakanjem).
  assert.equal(jezikOdgovora("sl", "Ne razumijem ovaj zadatak"), "hr");
  assert.equal(jezikOdgovora("sl", "Ne razumem te naloge, treba je deliti?"), "sl");
  assert.equal(jezikOdgovora("en", "koji"), "en");
  assert.equal(polishReply("Rješavamo s brojem pet.", { language: jezikOdgovora("sl", "Pomozi mi molim te") }), "Rješavamo s brojem pet.");
  assert.equal(stripLabels("- Priklic: dostop do shranjene informacije"), "- Priklic: dostop do shranjene informacije");
  assert.equal(stripLabels("**Priklic predznanja:** kaj je potenca?"), "Kaj je potenca?");
});

// Živi preizkus varnostnega filtra (scripts/nujno-ziv-preizkus.js): oblika nabora, brez ključa ni klica API,
// s ključem gre vsak primer skozi pravo funkcijo iz server/nujno.js. Pravi API se tu nikoli ne kliče.
import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { beriNabor, enPrimer, pozeni, povzemi, izpis, VRSTE } from "../scripts/nujno-ziv-preizkus.js";
import { NAVODILO, MODEL_VARNOST, MAX_TOKENS } from "../server/nujno.js";

const SKRIPTA = fileURLToPath(new URL("../scripts/nujno-ziv-preizkus.js", import.meta.url));
const primeri = beriNabor();

test("nabor: oblika, velikost in pokritost", () => {
  const obicajni = primeri.filter((p) => p.vrsta === null);
  const nujni = primeri.filter((p) => p.vrsta !== null);
  assert.equal(new Set(primeri.map((p) => p.id)).size, primeri.length, "id-ji so enolični");
  assert.equal(new Set(primeri.map((p) => p.text)).size, primeri.length, "besedila se ne ponavljajo");
  for (const p of primeri) {
    assert.match(p.id, /^[on]\d+$/, p.id);
    assert.ok(typeof p.text === "string" && p.text.trim().length >= 8 && p.text.length <= 300, `${p.id}: besedilo`);
    assert.ok(typeof p.jezik === "string" && p.jezik, `${p.id}: jezik`);
    assert.ok(p.vrsta === null || VRSTE.includes(p.vrsta), `${p.id}: vrsta`);
    if (p.vrsta === null) assert.ok(p.skupina, `${p.id}: običajno sporočilo ima skupino`);
    else assert.equal(typeof p.jasno, "boolean", `${p.id}: nujni primer ima jasno true/false`);
    for (const v of p.tudi || []) assert.ok(VRSTE.includes(v) && v !== p.vrsta, `${p.id}: tudi`);
  }
  assert.ok(obicajni.length >= 130 && nujni.length >= 55, `običajnih ${obicajni.length}, nujnih ${nujni.length}`);
  for (const v of VRSTE) {
    const vrste = nujni.filter((p) => p.vrsta === v);
    assert.ok(vrste.length >= 12, `${v}: ${vrste.length}`);
    assert.ok(vrste.some((p) => !p.jasno) && vrste.filter((p) => p.jasno).length >= 8, `${v}: jasni in manj jasni`);
    for (const j of ["sl-narecje", "en", "de", "hr", "sr", "bs", "uk", "sq"]) assert.ok(vrste.some((p) => p.jezik === j), `${v}: ${j}`);
  }
  for (const s of ["naloga", "frustracija", "trema", "zalost", "sala", "tuji"]) assert.ok(obicajni.some((p) => p.skupina === s), s);
  for (const j of ["en", "de", "hr", "sr", "bs", "uk", "sq"]) assert.ok(obicajni.some((p) => p.jezik === j), `običajni: ${j}`);
  for (const b of ["ogenj", "plin", "strup", "kri", "smrt", "eksploz", "tablet"]) {
    assert.ok(obicajni.some((p) => p.skupina === "naloga" && p.text.toLowerCase().includes(b)), `naloga z besedo ${b}`);
  }
  // Zasebnost: izmišljena sporočila brez osebnih podatkov (e-naslov, telefonska številka, povezava).
  for (const p of primeri) assert.doesNotMatch(p.text, /@|https?:|\d{6,}/, p.id);
});

const odgovor = (text, stop_reason = "end_turn") => ({ model: MODEL_VARNOST, stop_reason, content: text == null ? [] : [{ type: "text", text }], usage: { input_tokens: 250, output_tokens: 3 } });
const BESEDA = { zdravje: "ZDRAVJE", stiska: "STISKA", nasilje: "NASILJE", nevarnost: "NEVARNOST" };

test("vsak primer gre skozi pravo funkcijo: model, navodilo in max_tokens iz server/nujno.js", async () => {
  const telesa = [];
  const z = await enPrimer(primeri.find((p) => p.vrsta === "stiska"), { create: async (body) => (telesa.push(body), odgovor("STISKA")) });
  assert.equal(telesa.length, 1);
  assert.equal(telesa[0].model, MODEL_VARNOST);
  assert.equal(telesa[0].max_tokens, MAX_TOKENS);
  assert.equal(telesa[0].system, NAVODILO);
  assert.deepEqual({ dobljeno: z.dobljeno, oblika: z.oblika, stop: z.stop, napaka: z.napaka }, { dobljeno: "stiska", oblika: true, stop: "end_turn", napaka: null });
  assert.ok(z.usd > 0 && z.usd < 0.001 && z.ms >= 0);
});

test("povzetek: popoln filter doseže prag, izpis ne vsebuje besedil sporočil", async () => {
  const poBesedilu = new Map(primeri.map((p) => [p.text, p]));
  const create = async (body) => odgovor(BESEDA[poBesedilu.get(body.messages[0].content).vrsta] || "NE");
  const { izidi } = await pozeni(primeri, { create });
  const s = povzemi(primeri, izidi);
  assert.equal(izidi.length, primeri.length);
  assert.deepEqual([s.koda, s.lazni.length, s.zgreseni.length, s.napacnaVrsta.length, s.neznanaOblika.length], [0, 0, 0, 0, 0]);
  const besedilo = izpis(s);
  assert.match(besedilo, /PRAG DOSEŽEN/);
  for (const p of primeri) assert.ok(!besedilo.includes(p.text), p.id);
});

test("povzetek: zgrešen jasen primer, lažni alarmi, zavrnitev, neznana oblika in napake klica", async () => {
  const jasen = primeri.find((p) => p.vrsta === "nasilje" && p.jasno);
  const nejasen = primeri.find((p) => p.vrsta === "zdravje" && !p.jasno);
  const obicajni = primeri.filter((p) => p.vrsta === null);
  const po = new Map(primeri.map((p) => [p.text, p]));
  const posebni = new Map([
    [jasen.id, () => odgovor(null, "refusal")], // zavrnitev brez besedila = zgrešeno
    [nejasen.id, () => odgovor("NE")],
    [obicajni[0].id, () => odgovor("STISKA")],
    [obicajni[1].id, () => odgovor("Mislim, da gre za nalogo.", "max_tokens")], // neznana oblika šteje kot alarm
    [obicajni[2].id, () => Promise.reject(Object.assign(new Error("Request timed out."), { name: "APIConnectionTimeoutError" }))],
  ]);
  let omejitev = 0;
  const create = async (body) => {
    const p = po.get(body.messages[0].content);
    if (p.id === obicajni[3].id && omejitev++ === 0) throw Object.assign(new Error("rate limit"), { status: 429 });
    return posebni.get(p.id)?.() ?? odgovor(BESEDA[p.vrsta] || "NE");
  };
  const warn = console.warn;
  console.warn = () => {};
  const { izidi } = await pozeni(primeri, { create, premor: 1 }).finally(() => (console.warn = warn));
  const s = povzemi(primeri, izidi);
  assert.deepEqual(s.zgreseniJasni.map((z) => z.id), [jasen.id]);
  assert.deepEqual(s.zgreseni.map((z) => z.id).sort(), [jasen.id, nejasen.id].sort());
  assert.deepEqual(s.lazni.map((z) => z.id).sort(), [obicajni[0].id, obicajni[1].id].sort());
  assert.deepEqual(s.zavrnitve.map((z) => z.id), [jasen.id]);
  assert.deepEqual(s.neznanaOblika.map((z) => z.id).sort(), [jasen.id, obicajni[1].id].sort());
  assert.deepEqual(s.napake.map((z) => [z.id, z.napaka]), [[obicajni[2].id, "rok"]]);
  assert.equal(s.ponovitev, 1);
  assert.equal(s.poVrstah.nasilje.zgresenihJasnih, 1);
  assert.deepEqual([s.pragZgreseni, s.pragLazni, s.koda], [false, true, 1]);
  assert.match(izpis(s), /PRAG NI DOSEŽEN/);
  // 3 lažni alarmi od 142 so že nad 2 %.
  const trije = povzemi(primeri, izidi.map((z) => (z.id === obicajni[4].id ? { ...z, dobljeno: "zdravje" } : z.id === jasen.id ? { ...z, dobljeno: "nasilje" } : z)));
  assert.deepEqual([trije.pragZgreseni, trije.pragLazni, trije.koda], [true, false, 1]);
  // Preveč neuspelih klicev: preizkus ni veljaven.
  assert.equal(povzemi(primeri, izidi.map((z, i) => (i % 5 === 0 ? { ...z, napaka: "rok", dobljeno: null } : z))).koda, 2);
});

test("napačen ključ ustavi preizkus po prvem klicu", async () => {
  let klicev = 0;
  const warn = console.warn;
  console.warn = () => {};
  const r = await pozeni(primeri, { create: async () => (klicev++, Promise.reject(Object.assign(new Error("invalid x-api-key"), { status: 401 }))) }).finally(() => (console.warn = warn));
  assert.deepEqual([klicev, r.ustavljeno, r.izidi.length], [1, "HTTP 401", 1]);
});

// Skripta kot ločen proces; API je lažni lokalni strežnik, ki šteje zahteve.
async function zazeni(env, odgovori) {
  const zahteve = [];
  const streznik = http.createServer((req, res) => {
    let telo = "";
    req.on("data", (d) => (telo += d));
    req.on("end", () => {
      const body = JSON.parse(telo || "{}");
      zahteve.push(body);
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ id: "msg_test", type: "message", role: "assistant", ...odgovori(body) }));
    });
  });
  await new Promise((r) => streznik.listen(0, "127.0.0.1", r));
  const cisto = Object.fromEntries(Object.entries(process.env).filter(([k]) => !/^(ANTHROPIC_|EVKLID_|CLAUDE_)|proxy/i.test(k)));
  const otrok = spawn(process.execPath, ["--disable-warning=ExperimentalWarning", SKRIPTA], {
    env: { ...cisto, ANTHROPIC_BASE_URL: `http://127.0.0.1:${streznik.address().port}`, ...env },
  });
  let out = "";
  otrok.stdout.on("data", (d) => (out += d));
  otrok.stderr.on("data", (d) => (out += d));
  const koda = await new Promise((r) => otrok.on("close", r));
  await new Promise((r) => streznik.close(r));
  return { koda, out, zahteve };
}

test("skripta brez ključa: obvestilo, izhodna koda 0, nobenega klica API", async () => {
  const r = await zazeni({}, () => odgovor("NE"));
  assert.equal(r.koda, 0, r.out);
  assert.equal(r.zahteve.length, 0);
  assert.match(r.out, /NI zagnal/);
  const mock = await zazeni({ ANTHROPIC_API_KEY: "test", EVKLID_MOCK: "1" }, () => odgovor("NE"));
  assert.deepEqual([mock.koda, mock.zahteve.length], [0, 0]);
});

test("skripta s ključem: vsako sporočilo en klic s pravim navodilom; filter, ki vedno reče NE, ne doseže praga", async () => {
  const r = await zazeni({ ANTHROPIC_API_KEY: "test" }, () => odgovor("NE"));
  assert.equal(r.koda, 1, r.out);
  assert.equal(r.zahteve.length, primeri.length);
  assert.ok(r.zahteve.every((b) => b.model === MODEL_VARNOST && b.max_tokens === MAX_TOKENS && b.system === NAVODILO));
  assert.deepEqual(r.zahteve.map((b) => b.messages[0].content).sort(), primeri.map((p) => p.text).sort());
  assert.match(r.out, /PRAG NI DOSEŽEN/);
  for (const p of primeri) assert.ok(!r.out.includes(p.text), p.id);
});

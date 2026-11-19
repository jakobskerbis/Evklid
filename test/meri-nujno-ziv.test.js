// Živi preizkus varnostnega filtra z mejo stroška (scripts/meri-nujno-ziv.mjs, delovni tok Meritev).
// Pravi API se tu nikoli ne kliče: klic je lažen ali lažni lokalni strežnik.
import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { beriNabor, pozeni, povzemi } from "../scripts/nujno-ziv-preizkus.js";
import { zMejo, plasti, tabelaPlasti, vrsticaIzid, zapis, NA_KLIC_NAJVEC } from "../scripts/meri-nujno-ziv.mjs";
import { MODEL_VARNOST, MAX_TOKENS, NAVODILO, ovij } from "../server/nujno.js";

const SKRIPTA = fileURLToPath(new URL("../scripts/meri-nujno-ziv.mjs", import.meta.url));
const primeri = beriNabor();
const BESEDA = { zdravje: "ZDRAVJE", stiska: "STISKA", nasilje: "NASILJE", nevarnost: "NEVARNOST" };
const odgovor = (text, { stop_reason = "end_turn", usage = { input_tokens: 250, output_tokens: 3 } } = {}) => ({ model: MODEL_VARNOST, stop_reason, content: text == null ? [] : [{ type: "text", text }], ...(usage ? { usage } : {}) });
const poBesedilu = new Map(primeri.map((p) => [ovij(p.text), p]));
const pravilno = (body) => odgovor(BESEDA[poBesedilu.get(body.messages[0].content).vrsta] || "NE");
const tiho = async (fn) => {
  const warn = console.warn;
  console.warn = () => {};
  try {
    return await fn();
  } finally {
    console.warn = warn;
  }
};

test("meja: nov primer se ne začne, če bi najslabši klic presegel mejo (tudi z vzporednimi klici)", async () => {
  // Odgovor brez podatka o porabi šteje kot najslabši klic: meja 3,5 klica dovoli natanko 3 primere.
  let klicev = 0;
  const { create, ustavi, stanje } = zMejo(3.5 * NA_KLIC_NAJVEC, async (body) => (klicev++, await new Promise((r) => setTimeout(r, 2)), odgovor("NE", { usage: null })));
  const { izidi } = await pozeni(primeri, { create, ustavi, vzporedno: 4 });
  assert.deepEqual([izidi.length, klicev, stanje.ustavljeno, stanje.rezervirano], [3, 3, true, 0]);
  assert.ok(stanje.porabljeno <= 3.5 * NA_KLIC_NAJVEC);
  // S pravo porabo (Haiku, ~0,00003 $ na klic) gre ob isti meji več primerov, a nikoli čez mejo.
  const m = zMejo(5 * NA_KLIC_NAJVEC, async (body) => (await new Promise((r) => setTimeout(r, 1)), pravilno(body)));
  const r = await pozeni(primeri, { create: m.create, ustavi: m.ustavi, vzporedno: 4 });
  assert.ok(r.izidi.length > 5 && r.izidi.length < primeri.length && m.stanje.ustavljeno, `${r.izidi.length}`);
  assert.ok(m.stanje.porabljeno + NA_KLIC_NAJVEC <= 5 * NA_KLIC_NAJVEC + 1e-12);
  // Dovolj velika meja: vsi primeri, brez ustavitve.
  const v = zMejo(0.5, async (body) => pravilno(body));
  const vsi = await pozeni(primeri, { create: v.create, ustavi: v.ustavi });
  assert.deepEqual([vsi.izidi.length, v.stanje.ustavljeno], [primeri.length, false]);
  assert.ok(v.stanje.porabljeno > 0 && v.stanje.porabljeno < 0.02, `${v.stanje.porabljeno}`);
  // Meja manjša od enega klica: nič.
  const nic = zMejo(NA_KLIC_NAJVEC / 2, async () => assert.fail("klic"));
  assert.equal((await pozeni(primeri, { create: nic.create, ustavi: nic.ustavi })).izidi.length, 0);
});

test("meja: 429 se ne šteje (ni plačan), druga napaka šteje kot najslabši klic", async () => {
  const a = zMejo(1, async () => Promise.reject(Object.assign(new Error("rate"), { status: 429 })));
  await assert.rejects(a.create({ model: MODEL_VARNOST }));
  const b = zMejo(1, async () => Promise.reject(Object.assign(new Error("Request timed out."), { name: "APIConnectionTimeoutError" })));
  await assert.rejects(b.create({ model: MODEL_VARNOST }));
  assert.deepEqual([a.stanje.porabljeno, b.stanje.porabljeno, a.stanje.rezervirano, b.stanje.rezervirano], [0, NA_KLIC_NAJVEC, 0, 0]);
});

test("plasti: lokalni zaznavalnik, oba načina modela in skupaj; neznan odgovor odpre okno samo čez mejo", async () => {
  const jasen = primeri.find((p) => p.vrsta === "zdravje" && p.jasno);
  const obicajen = primeri.find((p) => p.vrsta === null);
  const create = async (body) => {
    const p = poBesedilu.get(body.messages[0].content);
    if (p.id === jasen.id || p.id === obicajen.id) return odgovor("Mislim, da gre za nalogo.", { stop_reason: "max_tokens" });
    return pravilno(body);
  };
  const { izidi } = await tiho(() => pozeni(primeri, { create, premor: 1 }));
  const pl = Object.fromEntries(plasti(primeri, izidi).map((r) => [r.plast, r]));
  const vsako = pl["model: pregled vsakega sporočila"];
  const pred = pl["model: pregled pred zavrnitvijo (čez mejo)"];
  const nujni = primeri.filter((p) => p.vrsta);
  assert.deepEqual([vsako.jasni.zgreseni, vsako.lazni.stevilo], [[jasen.id], 0]);
  assert.deepEqual([pred.jasni.zgreseni, pred.lazni.ids], [[], [obicajen.id]]);
  assert.equal(vsako.jasni.vseh + vsako.manjJasni.vseh, nujni.length);
  assert.equal(vsako.stiska.vseh, nujni.filter((p) => p.vrsta === "stiska").length);
  const lok = pl["lokalni zaznavalnik (brez AI)"];
  const skupaj = pl["skupaj pod mejo (lokalni + vsako sporočilo)"];
  assert.ok(skupaj.jasni.ujetih >= Math.max(lok.jasni.ujetih, vsako.jasni.ujetih));
  assert.ok(skupaj.lazni.stevilo >= lok.lazni.stevilo);
  const t = tabelaPlasti(plasti(primeri, izidi));
  assert.equal(t.split("\n").length, 7);
  assert.match(t, /\| model: pregled vsakega sporočila \| \d+ od \d+ \|/);
});

test("IZID in JSON: števila in id-ji, brez besedil sporočil", async () => {
  const m = zMejo(0.5, async (body) => pravilno(body));
  const { izidi } = await pozeni(primeri, { create: m.create, ustavi: m.ustavi });
  const s = povzemi(primeri, izidi);
  const izid = vrsticaIzid(s, { primerov: primeri.length, porabljeno: m.stanje.porabljeno, meja: 0.5, ustavljeno: false });
  assert.match(izid, /^IZID: 271 od 271 sporočil, .*zgrešenih jasnih 0, v vrsti stiska 0, manj jasnih 0 od 13; lažnih alarmov 0 od 154 \(0,0 %\).* PRAG DOSEŽEN$/);
  assert.match(vrsticaIzid(s, { primerov: primeri.length, porabljeno: 0.1, meja: 0.5, ustavljeno: true }), /NI POPOLN/);
  const j = JSON.stringify(zapis({ primeri, izidi, stanje: m.stanje, meja: 0.5, koncano: true }));
  for (const p of primeri) assert.ok(!j.includes(JSON.stringify(p.text).slice(1, -1)), p.id);
  const o = JSON.parse(j);
  assert.deepEqual([o.koncano, o.povzetek.koda, o.izidi.length, o.plasti.length], [true, 0, primeri.length, 5]);
  assert.equal(zapis({ primeri, izidi, stanje: m.stanje, meja: 0.5, koncano: false }).povzetek, null, "vmesni zapis brez povzetka");
});

// Skripta kot ločen proces; API je lažni lokalni strežnik, ki šteje zahteve.
async function zazeni(env, odgovori, args = []) {
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
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "meri-nujno-"));
  const json = path.join(dir, "meri-nujno-ziv.json");
  const cisto = Object.fromEntries(Object.entries(process.env).filter(([k]) => !/^(ANTHROPIC_|EVKLID_|CLAUDE_)|proxy/i.test(k)));
  const otrok = spawn(process.execPath, ["--disable-warning=ExperimentalWarning", SKRIPTA, "--json", json, ...args], {
    env: { ...cisto, ANTHROPIC_BASE_URL: `http://127.0.0.1:${streznik.address().port}`, ...env },
  });
  let out = "";
  otrok.stdout.on("data", (d) => (out += d));
  otrok.stderr.on("data", (d) => (out += d));
  const koda = await new Promise((r) => otrok.on("close", r));
  await new Promise((r) => streznik.close(r));
  const zapisano = fs.existsSync(json) ? fs.readFileSync(json, "utf8") : null;
  fs.rmSync(dir, { recursive: true, force: true });
  return { koda, out, zahteve, zapisano };
}

test("skripta brez ključa ali z neveljavno mejo: koda 2, nobenega klica API", async () => {
  const brez = await zazeni({}, () => odgovor("NE"));
  assert.deepEqual([brez.koda, brez.zahteve.length], [2, 0], brez.out);
  assert.match(brez.out, /IZID: preizkus se ni zagnal, ni ključa API/);
  const meja = await zazeni({ ANTHROPIC_API_KEY: "test" }, () => odgovor("NE"), ["--max-usd", "0"]);
  assert.deepEqual([meja.koda, meja.zahteve.length], [2, 0], meja.out);
});

test("skripta s ključem: vsako sporočilo en klic s pravim navodilom; tabela, IZID in JSON brez besedil", async () => {
  const r = await zazeni({ ANTHROPIC_API_KEY: "test-kljuc-123" }, pravilno, ["--max-usd", "0.5", "--vzporedno", "2"]);
  assert.equal(r.koda, 0, r.out);
  assert.equal(r.zahteve.length, primeri.length);
  assert.ok(r.zahteve.every((b) => b.model === MODEL_VARNOST && b.max_tokens === MAX_TOKENS && b.system === NAVODILO));
  assert.match(r.out, /\| plast \| jasni nujni ujeti/);
  assert.match(r.out.trim().split("\n").at(-1), /^IZID: 271 od 271 sporočil.*PRAG DOSEŽEN$/);
  assert.ok(!r.out.includes("test-kljuc-123") && !r.zapisano.includes("test-kljuc-123"), "ključ");
  for (const p of primeri) assert.ok(!r.out.includes(p.text) && !r.zapisano.includes(JSON.stringify(p.text).slice(1, -1)), p.id);
  const o = JSON.parse(r.zapisano);
  assert.deepEqual([o.koncano, o.ustavljeno, o.izidi.length, o.povzetek.koda], [true, false, primeri.length, 0]);
});

test("skripta: majhna meja ustavi preizkus pred mejo (koda 2, NI POPOLN), plačani izidi ostanejo v JSON", async () => {
  const r = await zazeni({ ANTHROPIC_API_KEY: "test" }, pravilno, ["--max-usd", "0.004"]);
  assert.equal(r.koda, 2, r.out);
  assert.ok(r.zahteve.length > 0 && r.zahteve.length < primeri.length, `${r.zahteve.length}`);
  assert.match(r.out, /NI POPOLN \(ustavljeno pred mejo stroška\)/);
  const o = JSON.parse(r.zapisano);
  assert.deepEqual([o.ustavljeno, o.izidi.length, o.povzetek.koda], [true, r.zahteve.length, 2]);
  assert.ok(o.porabljeno <= 0.004);
});

// K-10 (načrt dviga kakovosti, j 26. 11. 2026): Evklidova stran primerjave priprave na test z Astra AI na istih 10
// kompletih zapiskov (test/fixtures/priprava/k10/, pričakovanja v pricakovano.json, napisana pred zagonom).
// Vsak komplet gre skozi PRAVO aplikacijo (server/app.js v istem procesu, začasna baza), kot bi ga učenec: profil na ravni
// kompleta, test (pot, sklopi, datum) ali priprava brez poti, prilepljeni zapiski, teme, prvi kviz (6 nalog), razlaga iz
// zapiskov za največ --razlage tem in načrt do testa. Zapiše, kaj učenec vidi, in čas sistema do prve dejavnosti.
// Ocene tu ni: izhod (data/k10/evklid.json in data/k10/evklid-<komplet>.md) slepo oceni ločen ocenjevalec skupaj z Astrinim
// (scripts/k10-slepo.mjs). Ne piše v pravo bazo. Plačljivi so samo klici razlage; ustavi se, preden bi strošek presegel
// --max-usd (ostale razlage zapiše kot »izpuščeno: meja«).
//   node scripts/meri-k10-priprava.mjs [--max-usd 2] [--razlage 2] [--samo 01-mat-integral,06-fiz-elektrika] [--suho] [--preizkus]
//   --suho      samo izpiše načrt in najslabši strošek, nič ne zažene
//   --preizkus  brez ključa API (preizkusni način): vse razen razlage, za preverjanje skripte
// Zagon s ključem: GitHub Actions > Meritev, skripta scripts/meri-k10-priprava.mjs (artefakt »meritev«).
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";

const arg = (name, d) => {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : d;
};
const ZNANI = { "--max-usd": 1, "--razlage": 1, "--samo": 1, "--suho": 0, "--preizkus": 0 };
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (!(a in ZNANI)) {
    console.error(`Neznan argument »${a}« (dovoljeni: ${Object.keys(ZNANI).join(", ")}). Nič ni bilo poklicano.`);
    process.exit(1);
  }
  i += ZNANI[a];
}
const MAX_USD = Number(arg("--max-usd", 2));
const RAZLAGE = Number(arg("--razlage", 2));
const SUHO = process.argv.includes("--suho");
const PREIZKUS = process.argv.includes("--preizkus");
const SAMO = arg("--samo", "") ? new Set(arg("--samo", "").split(",")) : null;
if (!(MAX_USD > 0) || MAX_USD > 5) {
  console.error("--max-usd mora biti večji od 0 in največ 5. Nič ni bilo poklicano.");
  process.exit(1);
}
if (!Number.isInteger(RAZLAGE) || RAZLAGE < 0 || RAZLAGE > 6) {
  console.error("--razlage mora biti celo število od 0 do 6. Nič ni bilo poklicano.");
  process.exit(1);
}

const ROOT = path.join(import.meta.dirname, "..");
const DIR = path.join(ROOT, "test/fixtures/priprava/k10");
const { kompleti: vsi } = JSON.parse(fs.readFileSync(path.join(DIR, "pricakovano.json"), "utf8"));
const kompleti = vsi.filter((k) => !SAMO || SAMO.has(k.id));
const OUT = process.env.EVKLID_MERI_IZID || path.join(ROOT, "data/k10/evklid.json");

// Okolje pred uvozom aplikacije: začasna baza (nikoli prava), svoj ključ za šifriranje zapiskov.
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-k10-"));
process.env.EVKLID_DB = path.join(tmp, "meritev.db");
process.env.EVKLID_DATA_KEY = crypto.randomBytes(32).toString("base64");
process.env.EVKLID_MONTHLY_BUDGET_USD = "0";
process.env.EVKLID_VERIFY_DAILY_USD = "0";
const { openDb } = await import("../server/db.js");
const { createApp } = await import("../server/app.js");
const { isMockMode } = await import("../server/claude.js");
const { callMaxUsd } = await import("../server/meje-ai.js");
const { RAZLAGA_MODEL } = await import("../server/priprava/postavke.js");

// Najslabši klic razlage: največ 12 izsekov in 9000 znakov zapiskov (postavke.js) + navodilo, odgovor do 4000 žetonov.
const klicUsd = callMaxUsd(RAZLAGA_MODEL(), Math.ceil(9000 / 3) + 3000, 4000);
console.log(`${kompleti.length} kompletov; razlage ${RAZLAGE} na komplet (${RAZLAGA_MODEL()}), najslabši klic ${klicUsd.toFixed(4)} $, najslabše skupaj ${(klicUsd * RAZLAGE * kompleti.length).toFixed(3)} $; meja ${MAX_USD} $.`);
if (SUHO) process.exit(0);
if (PREIZKUS !== isMockMode()) {
  console.error(PREIZKUS ? "--preizkus deluje samo brez ključa API. Nič ni bilo poklicano." : "Ni ključa API (preizkusni način; GitHub Actions: manjka skrivnost ANTHROPIC_API_KEY).");
  process.exit(1);
}

const store = openDb(process.env.EVKLID_DB);
const server = createApp(store, { scheduler: false, log: { log() {}, info() {}, warn() {}, error() {} } }).listen(0, "127.0.0.1");
await new Promise((r) => server.once("listening", r));
const base = `http://127.0.0.1:${server.address().port}`;
const porabljeno = () => store.db.prepare("SELECT COALESCE(SUM(cost_usd), 0) AS s FROM usage").get().s;
const req = async (method, p, body) => {
  const r = await fetch(base + p, { method, headers: { "Content-Type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body) });
  const txt = await r.text();
  let json = null;
  try {
    json = JSON.parse(txt);
  } catch {}
  return { status: r.status, body: json ?? { besedilo: txt } };
};
const datumCez = (d) => new Date(Date.now() + d * 86400000).toISOString().slice(0, 10);
const nastavitve = (k) => {
  const m = /^(OŠ|SŠ)\s*(\d)?/.exec(k.raven) || [];
  const ss = m[1] !== "OŠ";
  return {
    educational_track: ss ? "SREDNJA_SOLA" : "OSNOVNA_SOLA",
    curriculum_level: ss ? `${m[2] || 1}. letnik` : `${m[2]}. razred`,
    subject: k.predmet,
    first_task: 1,
  };
};
// Pravilen odgovor naloge iz baze (isti zapis kot v scripts/preveri-pripravo.cjs): z njim gre kviz do konca in zapiše vse
// naloge, ki jih učenec dobi. Kviz meri vprašanja, ne učenca.
function odgovor(id) {
  const t = store.db.prepare("SELECT payload FROM tasks WHERE id = ?").get(Number(id));
  const a = JSON.parse(t?.payload || "{}").answer || {};
  if (a.type === "choice") return String(a.index);
  if (a.type === "number") {
    const d = Number.isInteger(a.decimals) ? a.decimals : null;
    const v = d === null ? String(a.value) : (Math.sign(a.value) * Math.round(Math.abs(a.value) * 10 ** d + 1e-9) / 10 ** d).toFixed(d);
    return v.replace(".", ",") + (a.unit ? ` ${a.unit}` : "");
  }
  if (a.type === "fraction") return `${a.num}/${a.den}`;
  if (a.type === "coefficients") return a.values.join(", ");
  return a.text ?? "";
}
function nalogaVen(task) {
  const row = store.db.prepare("SELECT topic_id, payload FROM tasks WHERE id = ?").get(Number(task.id));
  const p = JSON.parse(row?.payload || "{}");
  return { tema: row?.topic_id, besedilo: task.text ?? task.prompt ?? p.text ?? p.prompt ?? "", izbire: task.choices ?? p.choices ?? null, odgovor: odgovor(task.id) };
}

const izidi = [];
for (const k of kompleti) {
  const zapiski = fs.readFileSync(path.join(DIR, `${k.id}.md`), "utf8");
  const izid = { id: k.id, predmet: k.predmet, raven: k.raven, napake: [] };
  const s = (await req("POST", "/api/students", { name: "Učenec", settings: nastavitve(k) })).body;
  const t0 = Date.now();
  let pid;
  if (k.pot) {
    const r = await req("POST", `/api/students/${s.id}/test-plan`, { path: k.pot, units: k.sklopi, date: datumCez(k.datum_cez_dni) });
    if (r.status !== 200) izid.napake.push(`test-plan ${r.status}: ${r.body.error}`);
    pid = r.body.plan?.pripravaId;
  }
  if (!pid) {
    const r = await req("POST", `/api/students/${s.id}/priprave`, { naslov: `Test ${k.predmet}`, predmet: k.predmet, datum_testa: datumCez(k.datum_cez_dni) });
    pid = r.body.priprava?.id;
  }
  const P = `/api/students/${s.id}/priprave/${pid}`;
  const vir = await req("POST", `${P}/viri`, { besedilo: zapiski });
  if (vir.status !== 201) izid.napake.push(`vir ${vir.status}: ${vir.body.error}`);
  const vid = vir.body.vir?.id;
  if (vid && vir.body.vir.stanje === "caka") await req("POST", `${P}/viri/${vid}/obdelaj`);
  const teme = (await req("GET", `${P}/teme`)).body;
  izid.teme = (teme.teme || []).map((t) => ({ id: t.id, ime: t.ime, izsekov: t.izseki?.length || 0, vObsegu: t.vObsegu }));
  izid.obseg = teme.obseg ? teme.obseg.map((t) => ({ id: t.id, ime: t.ime, izsekov: t.izsekov })) : null;
  izid.pokritost = teme.pokritost ?? null;
  izid.samoVZapiskih = teme.samoVZapiskih?.length || 0;
  izid.predznanje = (teme.predznanje || []).map((t) => t.ime);
  // Prvi kviz: 6 nalog, vse do konca (pravilni odgovori), da je zapisana vsaka naloga.
  const kviz = await req("POST", `${P}/kviz`, { dolzina: 6 });
  izid.casDoPrveDejavnostiMs = Date.now() - t0;
  izid.kviz = [];
  if (kviz.status === 200 && kviz.body.task) {
    let task = kviz.body.task;
    for (let i = 0; i < 8 && task; i++) {
      izid.kviz.push(nalogaVen(task));
      const r = await req("POST", `/api/students/${s.id}/tasks/${task.id}/answer`, { answer: odgovor(task.id) });
      task = r.body.next && !r.body.next.finished ? r.body.next.task : null;
    }
  } else izid.kvizNi = kviz.body.code || kviz.body.error || String(kviz.status);
  // Razlaga iz zapiskov: teme z največ izseki najprej.
  izid.razlage = [];
  const zRazlago = (teme.teme || []).filter((t) => t.izseki?.length).sort((a, b) => b.izseki.length - a.izseki.length).slice(0, RAZLAGE);
  for (const t of zRazlago) {
    if (PREIZKUS) {
      izid.razlage.push({ tema: t.ime, izpusceno: "preizkus" });
      continue;
    }
    if (porabljeno() + klicUsd > MAX_USD) {
      izid.razlage.push({ tema: t.ime, izpusceno: "meja" });
      continue;
    }
    const r = await req("POST", `${P}/razlaga`, { tema_id: t.id });
    if (r.status !== 200) izid.razlage.push({ tema: t.ime, napaka: r.body.code || r.status });
    else
      izid.razlage.push({
        tema: t.ime,
        odstavki: r.body.odstavki.map((o) => ({ besedilo: o.besedilo, navedek: o.navedek, negotovo: !!o.negotovo, viri: (o.viri || []).length })),
        zavrnjenih: r.body.zavrnjenih || 0,
      });
  }
  // Načrt do testa (po kvizu, kot ga vidi učenec).
  const n = (await req("GET", `${P}/nacrt`)).body;
  izid.nacrt = {
    dni: n.dnevi?.length || 0,
    poskusniTest: !!n.dnevi?.some((d) => d.naloge.some((x) => x.vrsta === "poskusni_test")),
    stisnjeno: !!n.stisnjeno,
    pripravljenost: n.pripravljenost?.odstotek ?? null,
    dnevi: (n.dnevi || []).slice(0, 7).map((d) => ({ datum: d.datum, enote: d.naloge.map((x) => `${x.vrsta}${x.tema ? `: ${x.tema.ime}` : ""}`) })),
  };
  izidi.push(izid);
  console.log(`${k.id}: tem ${izid.teme.length}, kviz ${izid.kviz.length || izid.kvizNi}, razlag ${izid.razlage.filter((r) => r.odstavki).length}, ${izid.casDoPrveDejavnostiMs} ms`);
}

const usd = porabljeno();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify({ kdaj: new Date().toISOString(), preizkus: PREIZKUS, model: RAZLAGA_MODEL(), usd, izidi }, null, 2));
// Kar učenec vidi, kot besedilo za slepo oceno (brez imena sistema).
for (const z of izidi) {
  const md = [
    `## Teme`,
    ...(z.teme.length ? z.teme.map((t) => `- ${t.ime}${t.izsekov ? ` (v zapiskih: ${t.izsekov})` : " (ni v zapiskih)"}`) : ["(nobene teme)"]),
    z.pokritost ? `Zapiski pokrivajo ${z.pokritost.pokrite} od ${z.pokritost.vseh} tem testa.` : "",
    `## Vprašanja prvega kviza`,
    ...(z.kviz.length ? z.kviz.map((q, i) => `${i + 1}. ${q.besedilo}${q.izbire ? `\n   Izbire: ${q.izbire.join(" | ")}` : ""}\n   Ključ: ${q.odgovor}`) : [`(kviza ni: ${z.kvizNi})`]),
    `## Razlage iz zapiskov`,
    ...z.razlage.map((r) => `### ${r.tema}\n${r.odstavki ? r.odstavki.map((o) => `${o.besedilo}${o.navedek ? `\n> »${o.navedek}«` : ""}`).join("\n\n") : `(${r.izpusceno || r.napaka})`}`),
    `## Načrt`,
    ...z.nacrt.dnevi.map((d) => `- ${d.datum}: ${d.enote.join("; ") || "prosto"}`),
    z.nacrt.poskusniTest ? "Pred testom je poskusni test." : "",
  ].filter((x) => x !== "");
  fs.writeFileSync(path.join(path.dirname(OUT), `evklid-${z.id}.md`), md.join("\n") + "\n");
}
console.log(`Skupaj ${usd.toFixed(4)} $ (meja ${MAX_USD} $). Izid: ${OUT}`);
server.close();
store.db.close();
fs.rmSync(tmp, { recursive: true, force: true });

// Faza 0 – izhodiščne meritve zmogljivosti (docs/meritve/zmogljivost-2026-11-13.md).
// Ista skripta da številke »prej« in »potem« za vsak PR, ki spreminja hitrost ali pomnilnik.
//
// Deli (--samo zagon,poti,sql,prvo,instruktor,velika,obremenitev; privzeto vsi razen obremenitev):
//   zagon      0.1 čas do prvega /healthz 200 in RSS/kopica po uvozih, createApp, warmStatic, tiskPredgrej
//   poti       0.2 p50/p95/p99 in zamik zanke dogodkov pri 1, 10 in 50 hkratnih uporabnikih
//   sql        0.3 EXPLAIN QUERY PLAN za vsak stavek SQL na teh poteh (SCAN brez indeksa)
//   prvo       0.4 prvo odprtje v brskalniku (zahteve, bajti, globina uvozov, LCP, INP, CLS, dolge naloge)
//   instruktor 0.5 inštruktor v preizkusnem načinu: čas do prvega bajta SSE in do konca po načinih
//   velika     0.6 poti in sql še na sintetični bazi (5000 profilov, 200 000 sporočil, 1 000 000 vrstic porabe)
//   obremenitev D6 obremenitveni test z omejitvijo kot Render starter (cgroup v1: --pomnilnik 512 MB, --cpu 0,5):
//              c sočasnih učencev (--stopnje, tu privzeto 20,40,60,80) --trajanje s (privzeto 120) sprašuje inštruktorja
//              in pošilja fotografije; po stopnjah statusi, latence, največji pomnilnik, OOM, zamik zanke dogodkov.
//              Samo z --samo obremenitev (traja ~10 min, potrebuje koren za /sys/fs/cgroup; podrobnosti pri
//              merjenjeObremenitve). Zastavice: --pomnilnik 512, --cpu 0.5, --trajanje 120, --premor 0 (ms med dejanji
//              učenca), --mock-zamik 15 (EVKLID_MOCK_DELAY_MS), --stopnje 20,40,60,80; --hitro skrajša stopnjo na 20 s.
// Zastavice: --json <datoteka> (vsi rezultati), --md <datoteka> (povzetek v Markdown), --brskalnik chromium,webkit,
//   --stopnje 1,10,50, --uporabniki 50, --brez-taskset, --hitro (manj ponovitev, za preizkus skripte),
//   --obdrzi (začasna mapa z bazami ostane, npr. za scripts/meritev-produkcija.mjs na sintetični bazi).
//
// Strežnik teče v svojem procesu (server/index.js), z računi (EVKLID_ACCOUNTS=1), v preizkusnem načinu (EVKLID_MOCK=1,
// brez ključa API: pravega modela ne kliče nikoli), z zavrženo bazo v začasni mapi in zavrženim ključem šifriranja.
// Pripet je na eno jedro (taskset -c 0), da je bližje Renderju (0,5 CPU); merilnik in brskalnik tečeta na ostalih.
// V strežnik se naloži majhen predhodni modul (--import, samo za meritev): zamik zanke dogodkov
// (perf_hooks.monitorEventLoopDelay) in zajem stavkov SQL (ovoj DatabaseSync.prototype.prepare); poroča prek IPC.
// Aplikacija se ne spremeni in ne dobi nove poti.
//
// Zagon (težko delo, glej docs/pregled.md): flock /tmp/evklid-tezko.lock node scripts/meritev-zmogljivosti.mjs --json m.json --md m.md
import { spawn, spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { performance } from "node:perf_hooks";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BRAND = JSON.parse(fs.readFileSync(path.join(ROOT, "brand.json"), "utf8"));
const hitrost = require("./meri-hitrost.cjs"); // DEVICES, SLOW_4G, cdpSetup, freePort, PAGE_MERI

const args = process.argv.slice(2);
const arg = (n) => (args.indexOf(n) >= 0 ? args[args.indexOf(n) + 1] : null);
const DELI = ["zagon", "poti", "sql", "prvo", "instruktor", "velika", "obremenitev"];
const SAMO = new Set(
  (arg("--samo") || DELI.filter((d) => d !== "obremenitev").join(","))
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
);
for (const d of SAMO) if (!DELI.includes(d)) throw new Error(`neznan del »${d}« (možni: ${DELI.join(", ")})`);
const HITRO = args.includes("--hitro");
const STOPNJE = (arg("--stopnje") || "1,10,50").split(",").map(Number);
const N_UPORABNIKOV = Math.max(Number(arg("--uporabniki")) || 50, ...STOPNJE);
// Obremenitev (D6): stopnje sočasnih učencev, trajanje stopnje, meje cgroup, premor med dejanji učenca, zamik kosov
// preizkusnega odgovora (server/claude.js mockReply: 6 znakov na kos).
const O_STOPNJE = (arg("--stopnje") || "20,40,60,80").split(",").map(Number);
const O_TRAJANJE_S = Number(arg("--trajanje")) || (HITRO ? 20 : 120);
const O_POMNILNIK_MB = Number(arg("--pomnilnik")) || 512;
const O_CPU = Number(arg("--cpu")) || 0.5;
const O_PREMOR_MS = Number(arg("--premor")) || 0;
const O_MOCK_ZAMIK = arg("--mock-zamik") ?? "15";
const BRSKALNIKI = (arg("--brskalnik") || "chromium").split(",");
const TASKSET = !args.includes("--brez-taskset") && spawnSync("taskset", ["-c", "0", "true"]).status === 0;
const JEDRA = os.cpus().length;

// Merilnik (ta proces in brskalnik) na jedrih 1…n, strežnik sam na jedru 0.
if (TASKSET && JEDRA > 1 && !process.env.MERITEV_ZMOGLJIVOSTI_OTROK) {
  const r = spawnSync(
    "taskset",
    ["-c", `1-${JEDRA - 1}`, process.execPath, "--disable-warning=ExperimentalWarning", ...process.execArgv, ...process.argv.slice(1)],
    {
      stdio: "inherit",
      env: { ...process.env, MERITEV_ZMOGLJIVOSTI_OTROK: "1" },
    },
  );
  process.exit(r.status ?? 1);
}

const TMP = fs.mkdtempSync(path.join(os.tmpdir(), `${BRAND.slug}-meritev-`));
const KLJUC = crypto.randomBytes(32).toString("base64"); // zavržen ključ šifriranja polj (server/crypto-polje.js)
process.env.EVKLID_DATA_KEY = KLJUC; // seal() pri polnjenju baze uporabi isti ključ kot strežnik
const GESLO = "geslo-meritve-1234";
const LEKCIJA = "MAT-OS-8/algebrski-izrazi";
const SLIKA_PNG = fs.readFileSync(path.join(ROOT, "assets", `${BRAND.slug}.png`)); // 342 KB, kot fotografija naloge
const SLIKA = `data:image/png;base64,${SLIKA_PNG.toString("base64")}`;
const log = (...a) => console.error(`[meritev ${new Date().toISOString().slice(11, 19)}]`, ...a);

// Okolje strežnika: brez ključev in brez nastavitev iz lupine (tudi s predpono starega imena, brand.json → legacy).
const PREDPONE = [BRAND.env, ...(BRAND.legacy || []).map((l) => l.env)].map((p) => `${p}_`);
const cistoOkolje = Object.fromEntries(
  Object.entries(process.env).filter(([k]) => !PREDPONE.some((p) => k.startsWith(p)) && !/^(ANTHROPIC|STRIPE|RESEND)_|^NODE_ENV$|^MERITEV_/.test(k)),
);
const OKOLJE = {
  ...cistoOkolje,
  EVKLID_MOCK: "1",
  EVKLID_MOCK_DELAY_MS: "0", // brez umetnega čakanja med kosi odgovora: merimo samo čas strežnika
  EVKLID_ACCOUNTS: "1",
  EVKLID_NEWS: "0",
  EVKLID_PASSWORD: "",
  EVKLID_DATA_KEY: KLJUC,
  EVKLID_BACKUPS: "0", // varnostna kopija po 2 min bi padla sredi meritve
  EVKLID_CAS: "0", // SymPy je ločen proces Python; ni del pomnilnika procesa Node
  EVKLID_PDF: "0",
  ANTHROPIC_API_KEY: "",
  STRIPE_SECRET_KEY: "",
  RESEND_API_KEY: "",
};

// ---------------------------------------------------------------------------------------------------------------
// Predhodni modul v strežniku (samo za meritev): zamik zanke dogodkov in zajem SQL; ukazi prek IPC.
const PREDLOG = `
import { monitorEventLoopDelay } from "node:perf_hooks";
import { DatabaseSync, StatementSync } from "node:sqlite";
const LOCLJIVOST = 10;
const eld = monitorEventLoopDelay({ resolution: LOCLJIVOST });
eld.enable();
const sqls = new Map();
let oznaka = null;
let priprav = 0;
let zadnjaBaza = null;
const vnos = (sql, db) => {
  let e = sqls.get(sql);
  if (!e) sqls.set(sql, (e = { n: 0, poti: {}, ms: 0, max: 0, klicev: 0, db }));
  return e;
};
const prepare = DatabaseSync.prototype.prepare;
DatabaseSync.prototype.prepare = function (sql, ...rest) {
  priprav++;
  zadnjaBaza = this;
  if (oznaka !== null && typeof sql === "string") {
    const e = vnos(sql, this);
    e.n++;
    e.poti[oznaka] = (e.poti[oznaka] || 0) + 1;
  }
  return prepare.call(this, sql, ...rest);
};
// Čas izvajanja stavkov (all/get/run; iterate je len in ni štet), samo med zajemom.
for (const m of ["all", "get", "run"]) {
  const f = StatementSync.prototype[m];
  StatementSync.prototype[m] = function (...a) {
    if (oznaka === null) return f.apply(this, a);
    const t = process.hrtime.bigint();
    try {
      return f.apply(this, a);
    } finally {
      const d = Number(process.hrtime.bigint() - t) / 1e6;
      const e = vnos(this.sourceSQL, zadnjaBaza);
      e.ms += d;
      e.klicev++;
      if (d > e.max) e.max = d;
    }
  };
}
// Histogram šteje cel interval (LOCLJIVOST ms) in zamik; poročamo samo zamik.
const ms = (ns) => Math.max(0, Math.round((ns / 1e6 - LOCLJIVOST) * 100) / 100);
process.on("message", (m) => {
  if (!m || typeof m !== "object" || !m.meritev) return;
  const odg = { id: m.id };
  if (m.meritev === "ponastavi") {
    eld.reset();
    priprav = 0;
  } else if (m.meritev === "porocilo") {
    odg.eld = { p50: ms(eld.percentile(50)), p95: ms(eld.percentile(95)), p99: ms(eld.percentile(99)), max: ms(eld.max), povp: ms(eld.mean) };
    odg.priprav = priprav;
    odg.mem = process.memoryUsage();
  } else if (m.meritev === "sql") {
    oznaka = m.oznaka ?? null;
  } else if (m.meritev === "razlozi") {
    oznaka = null;
    odg.sql = [...sqls].map(([sql, e]) => {
      let plan;
      try {
        plan = prepare.call(e.db || zadnjaBaza, "EXPLAIN QUERY PLAN " + sql).all().map((r) => r.detail);
      } catch (err) {
        plan = ["napaka: " + err.message];
      }
      return { sql, n: e.n, poti: e.poti, ms: Math.round(e.ms * 100) / 100, max: Math.round(e.max * 100) / 100, klicev: e.klicev, plan };
    });
    sqls.clear();
  }
  process.send(odg);
});
process.channel?.unref?.();
`;
const PREDLOG_DAT = path.join(TMP, "predlog.mjs");
fs.writeFileSync(PREDLOG_DAT, PREDLOG);

// Zagon po fazah (0.1): kot server/index.js, a z meritvijo pomnilnika med koraki in s čakanjem na oba predgretja.
const FAZE = `
const root = process.env.MERITEV_ROOT;
const u = (p) => new URL(p, "file://" + root + "/").href;
const mem = (extra = {}) => {
  const m = process.memoryUsage();
  return { t: Math.round(performance.now()), rss: m.rss, heapUsed: m.heapUsed, heapTotal: m.heapTotal, external: m.external, arrayBuffers: m.arrayBuffers, ...extra };
};
const faze = { zacetek: mem() };
await import(u("server/env.js"));
const path = await import("node:path");
const { openDb } = await import(u("server/db.js"));
await import(u("server/brand.js"));
await import(u("server/kopije.js"));
const { createApp } = await import(u("server/app.js"));
await import(u("server/claude.js"));
await import(u("server/cas.js"));
await import(u("server/meritev-po-objavi.js"));
faze.uvozi = mem();
const store = openDb();
const feedbackFile = path.resolve(path.dirname(process.env.EVKLID_DB), "povratne-informacije.json");
const trendsFile = path.resolve(path.dirname(feedbackFile), "kozmetika-trendi.json");
const app = createApp(store, { feedbackFile, trendsFile });
faze.createApp = mem();
const server = await new Promise((r) => { const s = app.listen(0, () => r(s)); });
const res = await fetch("http://127.0.0.1:" + server.address().port + "/healthz");
faze.healthz = mem({ status: res.status });
let t = performance.now();
const n = await app.locals.warmStatic();
faze.warmStatic = mem({ datotek: n, ms: Math.round(performance.now() - t) });
t = performance.now();
const strani = await app.locals.tiskPredgrej();
faze.tiskPredgrej = mem({ strani, ms: Math.round(performance.now() - t) });
globalThis.gc?.();
faze.poGC = mem();
console.log("MERITEV_FAZE " + JSON.stringify(faze));
process.exit(0);
`;
const FAZE_DAT = path.join(TMP, "faze.mjs");
fs.writeFileSync(FAZE_DAT, FAZE);

// ---------------------------------------------------------------------------------------------------------------
// Pomožno
const kvantil = (arr, p) => {
  if (!arr.length) return null;
  const s = [...arr].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.max(0, Math.ceil((p / 100) * s.length) - 1))];
};
const r1 = (x) => (x == null ? null : Math.round(x * 10) / 10);
const MB = (b) => (b == null ? null : Math.round((b / 1048576) * 10) / 10);
const KB = (b) => (b == null ? null : Math.round(b / 1024));
const pocakaj = (ms) => new Promise((r) => setTimeout(r, ms));
const vmRss = (pid) => {
  try {
    return Number(/VmRSS:\s+(\d+)/.exec(fs.readFileSync(`/proc/${pid}/status`, "utf8"))[1]) * 1024;
  } catch {
    return null;
  }
};

function ukazNode(nodeArgs) {
  return TASKSET ? ["taskset", ["-c", "0", process.execPath, ...nodeArgs]] : [process.execPath, nodeArgs];
}

// Strežnik (server/index.js) v svojem procesu; vrne sejo z ukazi IPC.
// cgroup: seznam datotek cgroup.procs; lupina vanje zapiše svoj pid in se nato zamenja s strežnikom (exec), zato
// meje veljajo od prvega bajta procesa Node.
async function zazeniStreznik(dbFile, { predlog = true, okolje = {}, cgroup = null } = {}) {
  const port = await hitrost.freePort();
  const nodeArgs = ["--disable-warning=ExperimentalWarning", ...(predlog ? ["--import", pathToFileURL(PREDLOG_DAT).href] : []), "server/index.js"];
  let [cmd, argv] = ukazNode(nodeArgs);
  if (cgroup?.length) {
    const vpis = cgroup.map((f) => `echo $$ > '${f}'`).join(" && ");
    [cmd, argv] = ["sh", ["-c", `${vpis} && exec "$@"`, "sh", cmd, ...argv]];
  }
  const t0 = performance.now();
  const srv = spawn(cmd, argv, { cwd: ROOT, env: { ...OKOLJE, PORT: String(port), EVKLID_DB: dbFile, ...okolje }, stdio: ["ignore", "pipe", "pipe", "ipc"] });
  const izpis = [];
  const vrstice = [];
  const ob = (d) => {
    const s = String(d);
    izpis.push(s);
    for (const l of s.split("\n")) if (l.trim()) vrstice.push({ t: performance.now() - t0, l });
  };
  srv.stdout.on("data", ob);
  srv.stderr.on("data", ob);
  let konec = null;
  let signal = null;
  srv.on("exit", (code, sig) => {
    konec = code ?? sig ?? "?";
    signal = sig;
  });
  const base = `http://127.0.0.1:${port}`;
  let tHealthz = null;
  while (performance.now() - t0 < 120_000 && konec === null) {
    const ok = await new Promise((res) => {
      const rq = http.get(base + "/healthz", (r) => {
        r.resume();
        res(r.statusCode === 200);
      });
      rq.on("error", () => res(false));
      rq.setTimeout(1000, () => rq.destroy());
    });
    if (ok) {
      tHealthz = performance.now() - t0;
      break;
    }
    await pocakaj(10);
  }
  if (tHealthz === null) {
    srv.kill("SIGKILL");
    throw new Error(`strežnik se ni zagnal:\n${izpis.join("").slice(-3000)}`);
  }
  let n = 0;
  const cakajo = new Map();
  srv.on("message", (m) => {
    const f = cakajo.get(m?.id);
    if (f) {
      cakajo.delete(m.id);
      f(m);
    }
  });
  const ukaz = (m) =>
    predlog
      ? new Promise((res, rej) => {
          const id = ++n;
          cakajo.set(id, res);
          srv.send({ ...m, id }, (e) => e && rej(e));
        })
      : Promise.resolve({});
  const ustavi = async () => {
    if (konec !== null) return;
    srv.kill("SIGTERM");
    for (let i = 0; i < 100 && konec === null; i++) await pocakaj(100);
    if (konec === null) srv.kill("SIGKILL");
  };
  const stanje = () => ({ konec, signal });
  return { base, srv, pid: srv.pid, t0, tHealthz, izpis, vrstice, ukaz, ustavi, dbFile, stanje };
}

// Odjemalec s piškotki (en na uporabnika), kot v testih (test/accounts.test.js).
class Odjemalec {
  constructor(base) {
    this.base = base;
    this.jar = {};
  }
  glave() {
    return {
      "Content-Type": "application/json",
      cookie: Object.entries(this.jar)
        .map(([k, v]) => `${k}=${v}`)
        .join("; "),
    };
  }
  piskotki(res) {
    for (const c of res.headers.getSetCookie()) {
      const [kv] = c.split(";");
      const i = kv.indexOf("=");
      this.jar[kv.slice(0, i)] = kv.slice(i + 1);
    }
  }
  async z(pot, { method = "GET", body, signal } = {}) {
    const res = await fetch(this.base + pot, {
      method,
      signal,
      redirect: "manual",
      headers: this.glave(),
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    this.piskotki(res);
    const buf = Buffer.from(await res.arrayBuffer());
    return { status: res.status, bytes: buf.length, text: () => buf.toString("utf8"), json: () => JSON.parse(buf.toString("utf8")) };
  }
  // Pogovor z inštruktorjem (Server-Sent Events): čas do glav, prvega bajta telesa, prvega »delta«, »done« in konca.
  async tok(pot, body, { signal } = {}) {
    const t0 = performance.now();
    const res = await fetch(this.base + pot, { method: "POST", signal, headers: this.glave(), body: JSON.stringify(body) });
    const glave = performance.now() - t0;
    let prvi = null;
    let delta = null;
    let done = null;
    let buf = "";
    if (res.body) {
      const rd = res.body.getReader();
      const dec = new TextDecoder();
      for (;;) {
        const { done: d, value } = await rd.read();
        if (d) break;
        const t = performance.now() - t0;
        if (prvi === null) prvi = t;
        buf += dec.decode(value, { stream: true });
        if (delta === null && buf.includes("event: delta")) delta = t;
        if (done === null && buf.includes("event: done")) done = t;
      }
    }
    const napaka = buf.includes("event: error") || res.status !== 200;
    return {
      status: res.status,
      glave,
      prvi,
      delta,
      done,
      konec: performance.now() - t0,
      napaka,
      opis: napaka ? `${res.status} ${(/"code":"([^"]+)"/.exec(buf) || /"error":"([^"]{0,80})/.exec(buf) || [])[1] || ""}` : null,
      bytes: buf.length,
    };
  }
}

// ---------------------------------------------------------------------------------------------------------------
// Uporabniki za meritev: registracija, potrditev (povezava v odgovoru, samo lokalno brez e-pošte), naročnina
// v bazi (kot testi), profil, 10 pogovorov po 20 šifriranih sporočil in en prazen pogovor za klepet.
async function pripraviUporabnike(seja, n) {
  const { seal, sealJson } = await import(pathToFileURL(path.join(ROOT, "server", "crypto-polje.js")).href);
  const db = new DatabaseSync(seja.dbFile);
  db.exec("PRAGMA busy_timeout = 10000");
  const uporabniki = [];
  const ena = async (i) => {
    const u = new Odjemalec(seja.base);
    u.email = `meritev${i}@meritev.test`;
    const r = await u.z("/api/auth/register", { method: "POST", body: { email: u.email, password: GESLO, accept_privacy: true, birth_date: "1985-04-12" } });
    if (r.status !== 201) throw new Error(`registracija ${r.status}: ${r.text().slice(0, 200)}`);
    const link = r.json().dev_verify_url;
    if (link) await u.z(new URL(link).pathname + new URL(link).search);
    db.prepare("UPDATE parents SET email_verified_at = COALESCE(email_verified_at, datetime('now')), sub_status = 'active', sub_seats = 1 WHERE email = ?").run(
      u.email,
    );
    const s = await u.z("/api/students", { method: "POST", body: { name: `Meritev ${i}`, birth_year: 2012, consent: true } });
    if (s.status !== 201) throw new Error(`profil ${s.status}: ${s.text().slice(0, 200)}`);
    u.sid = s.json().id;
    const k = await u.z(`/api/students/${u.sid}/conversations`, { method: "POST", body: {} });
    u.klepet = k.json().id;
    uporabniki[i] = u;
  };
  for (let i = 0; i < n; i += 5) await Promise.all(Array.from({ length: Math.min(5, n - i) }, (_, j) => ena(i + j)));
  const conv = db.prepare("INSERT INTO conversations (student_id, title, created_at, updated_at) VALUES (?, ?, datetime('now', ?), datetime('now', ?))");
  const msg = db.prepare("INSERT INTO messages (conversation_id, role, api_content, display_text, created_at) VALUES (?, ?, ?, ?, datetime('now', ?))");
  db.exec("BEGIN");
  for (const u of uporabniki) {
    for (let c = 0; c < 10; c++) {
      const id = Number(conv.run(u.sid, seal(`Naloga ${c}: koliko je ${c} + ${c}?`), `-${c + 1} days`, `-${c + 1} days`).lastInsertRowid);
      if (c === 0) u.odpri = id;
      for (let m = 0; m < 20; m++) {
        const role = m % 2 ? "assistant" : "user";
        const text =
          role === "user"
            ? `Vprašanje ${m}: kako rešim enačbo ${m}x + 3 = ${2 * m + 3}?`
            : `Odgovor ${m}: ${"Najprej odštejemo 3 na obeh straneh, nato delimo. ".repeat(6)}\n<<META subject=MAT topic="-" error=0 mode=A flag=none>>`;
        msg.run(id, role, sealJson([{ type: "text", text }]), seal(text.replace(/<<META[^>]*>>/, "")), `-${c + 1} days`);
      }
    }
  }
  db.exec("COMMIT");
  db.close();
  return uporabniki;
}

// Poti 0.2 (u = uporabnik); vrnejo { status }.
let stevec = 0;
const POTI = {
  prijava: (u) => u.z("/api/auth/login", { method: "POST", body: { email: u.email, password: GESLO } }),
  pogovori: (u) => u.z(`/api/students/${u.sid}/conversations`),
  pogovor: (u) => u.z(`/api/conversations/${u.odpri}`),
  sporocilo: (u) => {
    const a = ++stevec;
    return u.tok(`/api/conversations/${u.klepet}/messages`, { text: `Koliko je ${a} + ${a + 7}?` });
  },
  lekcija: (u) => u.z(`/api/students/${u.sid}/lesson?id=${encodeURIComponent(LEKCIJA)}`),
  lestvica: (u) => u.z(`/api/students/${u.sid}/league`),
  fotografija: (u) => u.z(`/api/students/${u.sid}/scan/read`, { method: "POST", body: { image: SLIKA } }),
};
const IME_POTI = {
  prijava: "Prijava (POST /api/auth/login)",
  pogovori: "Seznam pogovorov (GET /api/students/:id/conversations)",
  pogovor: "Odpri pogovor, 20 sporočil (GET /api/conversations/:id)",
  sporocilo: "Sporočilo inštruktorju, SSE do konca (POST /api/conversations/:id/messages)",
  lekcija: "Lekcija (GET /api/students/:id/lesson)",
  lestvica: "Lestvica (GET /api/students/:id/league)",
  fotografija: "Fotografija 342 KB (POST /api/students/:id/scan/read)",
};
const steviloZahtev = (pot, c) => {
  const f = HITRO ? 0.2 : 1;
  const n = pot === "prijava" ? ({ 1: 20, 10: 60, 50: 150 }[c] ?? c * 3) : ({ 1: 50, 10: 200, 50: 500 }[c] ?? c * 10);
  return Math.max(c, Math.round(n * f));
};

const ROK_MS = HITRO ? 10_000 : 30_000; // ena meritev (pot × hkratnost) izda nove zahteve največ toliko časa
async function obremeni(seja, pot, c, n) {
  const fn = POTI[pot];
  await seja.ukaz({ meritev: "ponastavi" });
  const casi = [];
  const statusi = {};
  const vzorci = {}; // koda napake po statusu (npr. 429 block.longChat), brez vsebine
  let izdanih = 0;
  const t0 = performance.now();
  let maxRss = 0;
  const vzorec = setInterval(() => (maxRss = Math.max(maxRss, vmRss(seja.pid) || 0)), 100);
  // Vrsta prostih uporabnikov (FIFO): en uporabnik nikoli v dveh zahtevah hkrati, obremenitev enakomerno po vseh
  // (dnevna meja vprašanj inštruktorju na profil bi sicer ustavila enega samega uporabnika).
  const prosti = [...seja.uporabniki];
  const casiOk = [];
  await Promise.all(
    Array.from({ length: c }, async () => {
      while (izdanih < n && performance.now() - t0 < ROK_MS) {
        izdanih++;
        const u = prosti.shift();
        const z = performance.now();
        let st;
        try {
          const r = await fn(u);
          st = r.napaka && r.status === 200 ? "200+napaka" : r.status;
          if ((r.napaka || r.status >= 400) && !vzorci[st])
            vzorci[st] = r.opis || (/"code":"([^"]+)"/.exec(r.text()) || /"error":"([^"]{0,80})/.exec(r.text()) || [])[1] || "";
        } catch (e) {
          st = `izjema ${e.cause?.code || e.code || e.message}`.slice(0, 40);
        }
        prosti.push(u);
        casi.push(performance.now() - z);
        if (st === 200) casiOk.push(performance.now() - z);
        statusi[st] = (statusi[st] || 0) + 1;
      }
    }),
  );
  clearInterval(vzorec);
  const trajanje = performance.now() - t0;
  const p = await seja.ukaz({ meritev: "porocilo" });
  n = casi.length;
  return {
    pot,
    c,
    n,
    statusi,
    vzorci,
    p50: r1(kvantil(casi, 50)),
    p95: r1(kvantil(casi, 95)),
    p99: r1(kvantil(casi, 99)),
    max: r1(Math.max(...casi)),
    ok:
      casiOk.length < casi.length ? { n: casiOk.length, p50: r1(kvantil(casiOk, 50)), p95: r1(kvantil(casiOk, 95)), p99: r1(kvantil(casiOk, 99)) } : undefined,
    zahtevNaS: r1(n / (trajanje / 1000)),
    eld: p.eld,
    pripravNaZahtevo: p.priprav == null ? null : r1(p.priprav / n),
    rssMB: MB(p.mem?.rss),
    maxRssMB: MB(maxRss),
  };
}

async function merjenjePoti(seja) {
  const out = [];
  for (const pot of Object.keys(POTI)) {
    for (let i = 0; i < 3; i++) await POTI[pot](seja.uporabniki[i]); // ogrevanje (JIT, predpomnilniki)
    let p50Ena = null;
    for (const c of STOPNJE) {
      // Počasna pot (velika baza): en krog c zahtev na enem jedru bi trajal ≈ c × p50 pri 1 uporabniku.
      if (p50Ena != null && c > 1 && c * p50Ena > 30_000) {
        out.push({ pot, c, preskoceno: `${c} × p50 pri 1 uporabniku (${Math.round(p50Ena)} ms) > 30 s` });
        log(`${pot} c=${c}: preskočeno (${c} × ${Math.round(p50Ena)} ms > 30 s)`);
        continue;
      }
      const r = await obremeni(seja, pot, c, steviloZahtev(pot, c));
      if (c === 1) p50Ena = r.p50;
      log(`${pot} c=${c}: p50 ${r.p50} p95 ${r.p95} p99 ${r.p99} ms, zanka p99 ${r.eld?.p99} ms, ${JSON.stringify(r.statusi)}`);
      out.push(r);
    }
  }
  return out;
}

// 0.5: načini inštruktorja (vsak v svojem pogovoru); podrobneje = »Razloži podrobneje« (deep: true) po navadnem,
// podrobneje2 = druga zaporedna prošnja (močnejši model). Pravi model ni klican: to je samo čas strežnika.
const NACINI = {
  navaden: [{ text: "Koliko je 12 + 30?" }],
  lahki: [{ text: "Koliko je 12 + 31?", lite: true }],
  podrobneje: [{ text: "Reši 2x + 3 = 11." }, { text: "Tega ne razumem dobro. Razloži podrobneje, korak za korakom.", deep: true }],
  podrobneje2: [
    { text: "Reši 3x + 3 = 12." },
    { text: "Tega ne razumem dobro. Razloži podrobneje, korak za korakom.", deep: true },
    { text: "Tega ne razumem dobro. Razloži podrobneje, korak za korakom.", deep: true },
  ],
  slika: [{ text: "Kako rešim to nalogo?", image: { media_type: "image/png", data: SLIKA_PNG.toString("base64") } }],
};
async function merjenjeInstruktorja(seja, oznaci = false) {
  const out = {};
  const n = HITRO ? 4 : 15; // (2 ogrevanji + 15) × največ 3 sporočila < dnevna meja vprašanj na profil
  for (const [i0, [nacin, koraki]] of Object.entries(NACINI).entries()) {
    const u = oznaci ? seja.posebni.sql : seja.posebni.instruktor[i0];
    const k = await u.z(`/api/students/${u.sid}/conversations`, { method: "POST", body: {} });
    const conv = k.json().id;
    const meritve = [];
    for (let i = oznaci ? 0 : -2; i < n; i++) {
      for (let j = 0; j < koraki.length; j++) {
        const zadnji = j === koraki.length - 1;
        if (oznaci && zadnji) await seja.ukaz({ meritev: "sql", oznaka: `instruktor:${nacin}` });
        const r = await u.tok(`/api/conversations/${conv}/messages`, { ...koraki[j], text: `${koraki[j].text} (${i})` });
        if (oznaci && zadnji) await seja.ukaz({ meritev: "sql", oznaka: null });
        if (zadnji && i >= 0) meritve.push(r);
      }
      if (oznaci && i >= 0) break;
    }
    const st = (k2) => {
      const a = meritve.map((m) => m[k2]).filter((x) => x != null);
      return { p50: r1(kvantil(a, 50)), p95: r1(kvantil(a, 95)), max: r1(a.length ? Math.max(...a) : null) };
    };
    out[nacin] = {
      n: meritve.length,
      napak: meritve.filter((m) => m.napaka).length,
      opisNapak: [...new Set(meritve.filter((m) => m.napaka).map((m) => m.opis))],
      glave: st("glave"),
      prviBajt: st("prvi"),
      prviDelta: st("delta"),
      done: st("done"),
      konec: st("konec"),
    };
    if (!oznaci)
      log(
        `inštruktor ${nacin}: prvi bajt p50 ${out[nacin].prviBajt.p50} ms, konec p50 ${out[nacin].konec.p50} ms, napak ${out[nacin].napak} ${out[nacin].opisNapak.join(", ")}`,
      );
  }
  return out;
}

// 0.3: zajem SQL (vsaka pot 3×, c = 1) in EXPLAIN QUERY PLAN v strežniku.
async function merjenjeSql(seja) {
  for (const pot of Object.keys(POTI)) {
    await seja.ukaz({ meritev: "sql", oznaka: pot });
    for (let i = 0; i < 3; i++) await POTI[pot](seja.posebni.sql);
    await seja.ukaz({ meritev: "sql", oznaka: null });
  }
  await merjenjeInstruktorja(seja, true);
  const { sql } = await seja.ukaz({ meritev: "razlozi" });
  const db = new DatabaseSync(seja.dbFile, { readOnly: true });
  const tabele = new Set(
    db
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table'")
      .all()
      .map((r) => r.name),
  );
  const vrstic = {};
  for (const t of tabele) vrstic[t] = db.prepare(`SELECT COUNT(*) AS n FROM "${t}"`).get().n;
  db.close();
  for (const s of sql) {
    // vzdevki (FROM usage u) → tabela
    const vzd = new Map();
    for (const m of s.sql.matchAll(/\b(?:FROM|JOIN)\s+"?(\w+)"?(?:\s+(?:AS\s+)?(\w+))?/gi)) {
      vzd.set(m[1], m[1]);
      if (m[2] && !/^(WHERE|ON|JOIN|LEFT|INNER|CROSS|GROUP|ORDER|LIMIT|SET|USING|VALUES|WHERE|AND|UNION)$/i.test(m[2])) vzd.set(m[2], m[1]);
    }
    s.scan = [];
    s.polniIndeks = [];
    s.zacasnoDrevo = s.plan.filter((d) => /TEMP B-TREE/.test(d));
    for (const d of s.plan) {
      const m = /^SCAN (\w+)(.*)$/.exec(d);
      if (!m || m[1] === "CONSTANT") continue;
      const tabela = vzd.get(m[1]) || m[1];
      if (!tabele.has(tabela)) continue; // CTE ali podpoizvedba
      if (/USING (COVERING )?INDEX|USING INTEGER PRIMARY KEY/.test(m[2])) s.polniIndeks.push({ tabela, detail: d, vrstic: vrstic[tabela] });
      else s.scan.push({ tabela, detail: d, vrstic: vrstic[tabela] });
    }
  }
  return { stavkov: sql.length, vrstic, sql };
}

// ---------------------------------------------------------------------------------------------------------------
// 0.1 Zagon
async function merjenjeZagona(dbFile) {
  const out = { ponovitve: [] };
  // (a) pravi server/index.js: čas od zagona procesa do prvega /healthz 200, RSS skozi čas, vrstice dnevnika
  for (let i = 0; i < (HITRO ? 1 : 3); i++) {
    const seja = await zazeniStreznik(dbFile, { predlog: false });
    const rssHealthz = vmRss(seja.pid);
    const casovnica = [];
    let warm = null;
    let tisk = null;
    const meja = performance.now() + (HITRO ? 40_000 : 120_000);
    while (performance.now() < meja) {
      casovnica.push([Math.round(performance.now() - seja.t0), MB(vmRss(seja.pid))]);
      for (const v of seja.vrstice) {
        if (!warm && /pripravljenih (\d+) stisnjenih datotek v (\d+) ms/.test(v.l)) {
          const m = /pripravljenih (\d+) stisnjenih datotek v (\d+) ms/.exec(v.l);
          warm = { datotek: +m[1], ms: +m[2], t: Math.round(v.t), rssMB: MB(vmRss(seja.pid)) };
        }
        if (!tisk && /tisk: (\d+) strani v predpomnilniku v (\d+) ms/.test(v.l)) {
          const m = /tisk: (\d+) strani v predpomnilniku v (\d+) ms/.exec(v.l);
          tisk = { strani: +m[1], ms: +m[2], t: Math.round(v.t), rssMB: MB(vmRss(seja.pid)) };
        }
      }
      if (warm && tisk) break;
      await pocakaj(250);
    }
    await pocakaj(1000);
    const rssKonec = vmRss(seja.pid);
    const maxRss = Math.max(...casovnica.map((x) => x[1] || 0));
    await seja.ustavi();
    out.ponovitve.push({
      healthzMs: Math.round(seja.tHealthz),
      rssHealthzMB: MB(rssHealthz),
      warm,
      tisk,
      rssKonecMB: MB(rssKonec),
      maxRssMB: maxRss,
      casovnica: casovnica.filter((_, j) => j % 4 === 0),
    });
    log(`zagon ${i + 1}: /healthz po ${Math.round(seja.tHealthz)} ms, RSS ${MB(rssHealthz)} MB, warm ${JSON.stringify(warm)}, tisk ${JSON.stringify(tisk)}`);
  }
  out.healthzMs = kvantil(
    out.ponovitve.map((p) => p.healthzMs),
    50,
  );
  // (b) po fazah v enem procesu (enako zaporedje kot server/index.js, predgretja zaporedno)
  const [cmd, argv] = ukazNode(["--disable-warning=ExperimentalWarning", "--expose-gc", FAZE_DAT]);
  const r = spawnSync(cmd, argv, {
    cwd: ROOT,
    env: { ...OKOLJE, MERITEV_ROOT: ROOT, EVKLID_DB: dbFile },
    encoding: "utf8",
    timeout: 600_000,
    maxBuffer: 64 << 20,
  });
  const vr = (r.stdout || "").split("\n").find((l) => l.startsWith("MERITEV_FAZE "));
  out.faze = vr ? JSON.parse(vr.slice("MERITEV_FAZE ".length)) : { napaka: (r.stderr || "").slice(-2000) };
  if (vr) for (const [k, v] of Object.entries(out.faze)) log(`faza ${k}: t=${v.t} ms RSS ${MB(v.rss)} MB, kopica ${MB(v.heapUsed)} MB`);
  return out;
}

// ---------------------------------------------------------------------------------------------------------------
// 0.4 Prvo odprtje: statično (datoteke prvega odprtja, kot jih strežnik postreže) in v brskalniku.
const IMPORT = /(?:^|[;\n}])\s*(?:import\s+(?:[\w*{}\s,$]+?\s+from\s+)?|export\s+(?:\*(?:\s+as\s+\w+)?|\{[^}]*\})\s+from\s+)["']([^"']+)["']/g;
function globinaUvozov(publicDir, vhodi) {
  const nivo = new Map();
  let vrsta = vhodi.map((v) => path.join(publicDir, v));
  for (const v of vrsta) nivo.set(v, 1);
  let max = 1;
  let najdaljsa = null;
  const starsi = new Map();
  while (vrsta.length) {
    const naslednja = [];
    for (const abs of vrsta) {
      let src = "";
      try {
        src = fs.readFileSync(abs, "utf8");
      } catch {
        continue;
      }
      for (const m of src.matchAll(IMPORT)) {
        const spec = m[1];
        const otrok = spec.startsWith("/") ? path.join(publicDir, spec) : spec.startsWith(".") ? path.resolve(path.dirname(abs), spec) : null;
        if (!otrok || nivo.has(otrok) || !otrok.startsWith(publicDir)) continue;
        nivo.set(otrok, nivo.get(abs) + 1);
        starsi.set(otrok, abs);
        if (nivo.get(otrok) > max) {
          max = nivo.get(otrok);
          najdaljsa = otrok;
        }
        naslednja.push(otrok);
      }
    }
    vrsta = naslednja;
  }
  const veriga = [];
  for (let x = najdaljsa; x; x = starsi.get(x)) veriga.unshift("/" + path.relative(publicDir, x));
  // Najdaljša veriga statičnih uvozov (brez krogov): brez modulepreload bi bila to globina slapa v najslabšem primeru.
  const otroci = (abs) => {
    let src = "";
    try {
      src = fs.readFileSync(abs, "utf8");
    } catch {
      return [];
    }
    return [...src.matchAll(IMPORT)]
      .map((m) => m[1])
      .map((spec) => (spec.startsWith("/") ? path.join(publicDir, spec) : spec.startsWith(".") ? path.resolve(path.dirname(abs), spec) : null))
      .filter((x) => x && x.startsWith(publicDir));
  };
  const memo = new Map();
  const naSkladu = new Set();
  const najdlje = (abs) => {
    if (memo.has(abs)) return memo.get(abs);
    if (naSkladu.has(abs)) return [];
    naSkladu.add(abs);
    let best = [];
    for (const o of otroci(abs)) {
      const p = najdlje(o);
      if (p.length > best.length) best = p;
    }
    naSkladu.delete(abs);
    const r = [abs, ...best];
    memo.set(abs, r);
    return r;
  };
  let pot = [];
  for (const v of vhodi) {
    const p = najdlje(path.join(publicDir, v));
    if (p.length > pot.length) pot = p;
  }
  return { globina: max, modulov: nivo.size, veriga, najdaljsaPot: pot.map((x) => "/" + path.relative(publicDir, x)) };
}

function prenesi(url, encoding) {
  return new Promise((res) => {
    http
      .get(url, { headers: { "accept-encoding": encoding } }, (r) => {
        let n = 0;
        r.on("data", (d) => (n += d.length));
        r.on("end", () => res({ status: r.statusCode, bytes: n, enc: r.headers["content-encoding"] || null, body: null }));
      })
      .on("error", () => res({ status: 0, bytes: 0 }));
  });
}

async function staticnoPrvo(seja) {
  const { startupFiles } = await import(pathToFileURL(path.join(ROOT, "server", "startup-files.js")).href);
  const publicDir = path.join(ROOT, "public");
  const datoteke = startupFiles(publicDir, "index.html");
  const vrsta = (u) => (u === "/" ? "html" : /\.m?js$/.test(u) ? "js" : /\.css$/.test(u) ? "css" : /\.(woff2?|ttf|otf)$/.test(u) ? "pisava" : "drugo");
  const sk = {};
  for (const u of datoteke) {
    const [surovo, br] = await Promise.all([prenesi(seja.base + u, "identity"), prenesi(seja.base + u, "br")]);
    const v = vrsta(u);
    const knj = u.startsWith("/vendor/") ? "knjiznice" : "aplikacija";
    for (const kljuc of [`${knj}:${v}`, `${knj}:skupaj`, "vse:skupaj"]) {
      const s = (sk[kljuc] ||= { datotek: 0, surovo: 0, br: 0, brezStiskanja: 0 });
      s.datotek++;
      s.surovo += surovo.bytes;
      s.br += br.bytes;
      if (!br.enc) s.brezStiskanja++;
    }
  }
  const html = await (await fetch(seja.base + "/", { headers: { cookie: "" } })).text();
  const html2 = fs.readFileSync(path.join(publicDir, "index.html"), "utf8");
  const vhodi = [...html2.matchAll(/<script[^>]*\bsrc="\.?\/?([^"?#]+\.js)/g)].map((m) => m[1]);
  for (const m of html2.matchAll(/\bdata-moduli="([^"]*)"/g))
    vhodi.push(
      ...m[1]
        .split(/\s+/)
        .filter(Boolean)
        .map((x) => x.replace(/^\.?\//, "")),
    );
  const g = globinaUvozov(
    publicDir,
    [...new Set(vhodi)].filter((v) => fs.existsSync(path.join(publicDir, v))),
  );
  const out = {
    datotekPrvegaOdprtja: datoteke.length,
    sestava: Object.fromEntries(Object.entries(sk).map(([k, s]) => [k, { ...s, surovoKB: KB(s.surovo), brKB: KB(s.br) }])),
    modulepreload: (html.match(/rel="modulepreload"/g) || []).length,
    vhodniModuli: [...new Set(vhodi)],
    globinaUvozov: g.globina, // nivoji odkrivanja (prvi uvoznik): slap brez modulepreload
    najdaljsaVeriga: g.veriga,
    najdaljsaPotUvozov: g.najdaljsaPot.length, // najdaljša veriga uvozov sploh
    najdaljsaPot: g.najdaljsaPot,
    modulepreloadVDatoteki: (html2.match(/rel="modulepreload"/g) || []).length,
    staticnihModulov: g.modulov,
  };
  log(
    `prvo (statično): ${out.datotekPrvegaOdprtja} datotek, aplikacija ${out.sestava["aplikacija:skupaj"]?.surovoKB} KB surovo / ${out.sestava["aplikacija:skupaj"]?.brKB} KB br, globina ${g.globina} (najdaljša pot ${g.najdaljsaPot.length}), modulepreload ${out.modulepreload}`,
  );
  return out;
}

// Spletni kazalniki v strani (LCP, CLS, INP iz Event Timing, dolge naloge, FCP).
function VITALI() {
  const v = (window.__vitali = { lcp: null, lcpEl: null, cls: 0, dolge: [], interakcije: [], fcp: null, podprto: {} });
  const po = (type, fn, extra = {}) => {
    try {
      new PerformanceObserver((l) => l.getEntries().forEach(fn)).observe({ type, buffered: true, ...extra });
      v.podprto[type] = true;
    } catch {
      v.podprto[type] = false;
    }
  };
  po("largest-contentful-paint", (e) => {
    v.lcp = e.startTime;
    const el = e.element;
    v.lcpEl = el
      ? el.tagName.toLowerCase() +
        (el.id ? "#" + el.id : "") +
        (typeof el.className === "string" && el.className ? "." + el.className.trim().split(/\s+/)[0] : "")
      : null;
  });
  po("layout-shift", (e) => {
    if (!e.hadRecentInput) v.cls += e.value;
  });
  po("longtask", (e) => v.dolge.push([Math.round(e.startTime), Math.round(e.duration)]));
  po("event", (e) => e.interactionId && v.interakcije.push([e.name, Math.round(e.duration), Math.round(e.startTime)]), { durationThreshold: 16 });
  po("paint", (e) => {
    if (e.name === "first-contentful-paint") v.fcp = e.startTime;
  });
}

// Taps za INP (telefon: spodnja vrstica zavihkov, sicer zgornja).
const TAPI = ["uci", "me", "path"];
async function odpriVBrskalniku(seja, ime, u) {
  const pw = require("playwright");
  let browser;
  try {
    browser = await pw[ime].launch();
  } catch (e) {
    return { napaka: `${ime} ni nameščen (${String(e.message).split("\n")[0].slice(0, 120)}) – izmeri v GitHubu (.github/workflows/meritev-zmogljivosti.yml)` };
  }
  const dev = hitrost.DEVICES.telefon;
  const out = { brskalnik: ime, razlicica: browser.version(), omejitve: ime === "chromium" ? "CPU 4×, Slow 4G (CDP)" : "brez omejitev (CDP ni na voljo)" };
  try {
    for (const scen of ["anonimno", "prijavljen"]) {
      const ctx = await browser.newContext({
        viewport: dev.viewport,
        hasTouch: dev.hasTouch,
        isMobile: ime === "firefox" ? undefined : dev.isMobile,
        deviceScaleFactor: 2,
        locale: "sl-SI",
        timezoneId: "Europe/Ljubljana",
        serviceWorkers: "block", // prvo odprtje brez predpomnjenja SW v ozadju (SW bi dodal ~vse datoteke še enkrat)
      });
      await ctx.addInitScript(VITALI);
      // Prijavljen: piškotka seje in naprave uporabnika (ista naprava, sicer »Profil je odprt drugje«).
      if (scen === "prijavljen") await ctx.addCookies(Object.entries(u.jar).map(([name, value]) => ({ name, value, url: seja.base })));
      const page = await ctx.newPage();
      const napake = [];
      page.on("pageerror", (e) => napake.push(String(e.message).slice(0, 160)));
      const zahteve = [];
      page.on("requestfinished", (req) => {
        zahteve.push(
          (async () => {
            const sizes = await req.sizes().catch(() => null);
            const res = await req.response().catch(() => null);
            const body = res ? await res.body().catch(() => null) : null;
            return {
              url: req.url().replace(seja.base, ""),
              vrsta: req.resourceType(),
              prenos: sizes ? sizes.responseBodySize + sizes.responseHeadersSize : null,
              telo: sizes?.responseBodySize ?? null,
              surovo: body ? body.length : null,
              enc: res ? (await res.allHeaders().catch(() => ({})))["content-encoding"] || null : null,
            };
          })(),
        );
      });
      if (ime === "chromium") await hitrost.cdpSetup(page, dev);
      const t0 = Date.now();
      await page.goto(seja.base + "/", { waitUntil: "load", timeout: 180_000 });
      const tLoad = Date.now() - t0;
      let tPripravljeno = null;
      const pripravljeno = scen === "prijavljen" ? "#view-path #xp-card .hero" : null;
      if (pripravljeno) {
        await page.waitForSelector(pripravljeno, { timeout: 180_000 }).catch(() => napake.push(`ni ${pripravljeno}`));
        tPripravljeno = Date.now() - t0;
      }
      await page.waitForLoadState("networkidle", { timeout: 60_000 }).catch(() => {});
      await page.waitForTimeout(2000);
      const prejInterakcij = zahteve.length;
      const pred = await page.evaluate(() => ({ cls: window.__vitali.cls, dolgih: window.__vitali.dolge.length }));
      if (scen === "prijavljen") {
        // Nov uporabnik: najprej vprašalnik zanimanj in ogled (kot v scripts/meri-hitrost.cjs); tudi to so interakcije za INP.
        for (const sel of [".iq-wrap [data-iq=skip]", '#tour [data-tour="skip"]']) {
          if (
            await page
              .locator(sel)
              .first()
              .isVisible()
              .catch(() => false)
          ) {
            await page
              .locator(sel)
              .first()
              .tap({ timeout: 10_000 })
              .catch((e) => napake.push(`tap ${sel}: ${String(e.message).split("\n")[0]}`));
            await page.waitForTimeout(2500);
          }
        }
        for (const view of TAPI) {
          const sel = (await page
            .locator(`#tabbar .tab[data-view="${view}"]`)
            .isVisible()
            .catch(() => false))
            ? `#tabbar .tab[data-view="${view}"]`
            : `.topbar .tab[data-view="${view}"]`;
          await page
            .locator(sel)
            .first()
            .tap({ timeout: 10_000 })
            .catch((e) =>
              napake.push(
                `tap ${view}: ${String(e.message).split("\n")[0]} ${(/\S+ (?:from .*)?intercepts pointer events/.exec(String(e.message)) || [""])[0]}`,
              ),
            );
          await page.waitForTimeout(2500);
        }
      }
      const v = await page.evaluate(() => window.__vitali);
      const z = await Promise.all(zahteve.slice(0, prejInterakcij));
      const sest = {};
      for (const r of z) {
        const knj = r.url.startsWith("/vendor/") ? "knjiznice" : "aplikacija";
        for (const k of [`${knj}:${r.vrsta}`, "vse:skupaj", `${knj}:skupaj`]) {
          const s = (sest[k] ||= { zahtev: 0, prenosKB: 0, suroviKB: 0 });
          s.zahtev++;
          s.prenosKB += (r.prenos || 0) / 1024;
          s.suroviKB += (r.surovo || 0) / 1024;
        }
      }
      for (const s of Object.values(sest)) {
        s.prenosKB = Math.round(s.prenosKB);
        s.suroviKB = Math.round(s.suroviKB);
      }
      const inp = v.interakcije.length ? Math.max(...v.interakcije.map((x) => x[1])) : null;
      const dolge = v.dolge;
      out[scen] = {
        loadMs: tLoad,
        pripravljenoMs: tPripravljeno,
        fcpMs: r1(v.fcp),
        lcpMs: r1(v.lcp),
        lcpElement: v.lcpEl,
        cls: Math.round(v.cls * 1000) / 1000, // do konca (tudi premiki po tapih, ki niso v 500 ms po vnosu)
        clsDoInterakcij: Math.round(pred.cls * 1000) / 1000,
        dolgihDoInterakcij: pred.dolgih,
        inpMs: inp,
        interakcije: v.interakcije,
        dolgih: dolge.length,
        dolgeSkupajMs: dolge.reduce((a, x) => a + x[1], 0),
        najdaljsaMs: dolge.length ? Math.max(...dolge.map((x) => x[1])) : 0,
        zahteve: sest,
        podprto: v.podprto,
        napake: [...new Set(napake)].slice(0, 5),
      };
      log(
        `prvo ${ime} ${scen}: load ${tLoad} ms, pripravljeno ${tPripravljeno} ms, LCP ${r1(v.lcp)}, CLS ${out[scen].cls}, INP ${inp}, dolgih ${dolge.length}, zahtev ${sest["vse:skupaj"]?.zahtev}, prenos ${sest["vse:skupaj"]?.prenosKB} KB`,
      );
      await ctx.close();
    }
  } finally {
    await browser.close();
  }
  return out;
}

// ---------------------------------------------------------------------------------------------------------------
// 0.6 Sintetična baza: shema iz pravega strežnika (prazen zagon), nato vrstice v transakcijah.
async function napolniVelikoBazo(dbFile) {
  const s0 = await zazeniStreznik(dbFile, { predlog: false }); // ustvari shemo in migracije (tudi računov)
  await s0.ustavi();
  const { seal, sealJson } = await import(pathToFileURL(path.join(ROOT, "server", "crypto-polje.js")).href);
  const db = new DatabaseSync(dbFile);
  db.exec("PRAGMA journal_mode = WAL; PRAGMA synchronous = OFF; PRAGMA foreign_keys = OFF;");
  const t0 = performance.now();
  const PROFILOV = 5000;
  const SPOROCIL = 200_000;
  const PORABE = 1_000_000;
  const XP = 100_000;
  const zdaj = Date.now();
  const cas = (maxDni) => new Date(zdaj - Math.random() * maxDni * 86400_000).toISOString().replace("T", " ").slice(0, 19);
  const rnd = (n) => Math.floor(Math.random() * n);
  const tx = (fn) => {
    db.exec("BEGIN");
    fn();
    db.exec("COMMIT");
  };
  const parent = db.prepare(
    "INSERT INTO parents (email, password_hash, privacy_version, unsubscribe_token, referral_code, email_verified_at, sub_status, sub_seats, created_at) VALUES (?, 'none$meritev', 'meritev', ?, ?, ?, ?, 1, ?)",
  );
  const student = db.prepare("INSERT INTO students (name, settings, parent_id, birth_year, created_at) VALUES (?, '{}', ?, ?, ?)");
  const ids = [];
  tx(() => {
    for (let i = 0; i < PROFILOV; i++) {
      const c = cas(365);
      const pid = Number(
        parent.run(`sint${i}@meritev.test`, crypto.randomBytes(12).toString("hex"), `SINT${i}`, c, i % 3 ? "active" : null, c).lastInsertRowid,
      );
      ids.push([Number(student.run(`Sintetični ${i}`, pid, 2008 + (i % 10), c).lastInsertRowid), pid]);
    }
  });
  const conv = db.prepare("INSERT INTO conversations (student_id, title, created_at, updated_at) VALUES (?, ?, ?, ?)");
  const msg = db.prepare("INSERT INTO messages (conversation_id, role, api_content, display_text, created_at) VALUES (?, ?, ?, ?, ?)");
  const NA_POGOVOR = 20;
  for (let k = 0; k < SPOROCIL / NA_POGOVOR; k += 1000) {
    tx(() => {
      for (let j = k; j < Math.min(k + 1000, SPOROCIL / NA_POGOVOR); j++) {
        const [sid] = ids[j % PROFILOV];
        const c = cas(180);
        const id = Number(conv.run(sid, seal(`Naloga ${j}`), c, c).lastInsertRowid);
        for (let m = 0; m < NA_POGOVOR; m++) {
          const role = m % 2 ? "assistant" : "user";
          const text =
            role === "user" ? `Vprašanje ${j}/${m}: koliko je ${m} · ${j % 97}?` : `Odgovor ${m}: ${"Pomnožimo in preverimo z obratno operacijo. ".repeat(8)}`;
          msg.run(id, role, sealJson([{ type: "text", text }]), seal(text), c);
        }
      }
    });
  }
  const usage = db.prepare(
    "INSERT INTO usage (student_id, parent_id, model, kind, input_tokens, output_tokens, cache_read_tokens, cache_write_tokens, cost_usd, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
  );
  const MODELI = ["claude-haiku-4-5", "claude-haiku-4-5", "claude-haiku-4-5", "claude-sonnet-4-5", "claude-opus-4-1"];
  const VRSTE = ["chat", "chat", "chat", "chat", "verify", "ocr", "skeniranje", "povzetek", "varnost"];
  for (let k = 0; k < PORABE; k += 50_000) {
    tx(() => {
      for (let j = k; j < k + 50_000; j++) {
        const [sid, pid] = ids[rnd(PROFILOV)];
        const inp = 200 + rnd(3000);
        usage.run(
          sid,
          pid,
          MODELI[rnd(MODELI.length)],
          VRSTE[rnd(VRSTE.length)],
          inp,
          50 + rnd(800),
          rnd(2) ? 4000 + rnd(2000) : 0,
          rnd(10) ? 0 : 4000,
          Math.random() * 0.01,
          cas(90),
        );
      }
    });
  }
  const xp = db.prepare("INSERT INTO xp_events (student_id, amount, reason, created_at) VALUES (?, ?, 'naloga', ?)");
  tx(() => {
    for (let j = 0; j < XP; j++) xp.run(ids[rnd(PROFILOV)][0], 5 + rnd(20), cas(60));
  });
  const ac = db.prepare("INSERT OR IGNORE INTO answer_cache (key, text, hits, created_at) VALUES (?, ?, ?, ?)");
  tx(() => {
    for (let j = 0; j < 2000; j++) ac.run(`meritev${j}`, seal("Odgovor."), rnd(30), cas(60));
  });
  db.exec("PRAGMA wal_checkpoint(TRUNCATE)");
  db.close();
  const vel = fs.statSync(dbFile).size;
  log(
    `sintetična baza: ${PROFILOV} profilov, ${SPOROCIL} sporočil, ${PORABE} vrstic porabe, ${XP} XP v ${Math.round((performance.now() - t0) / 1000)} s, ${MB(vel)} MB`,
  );
  return {
    profilov: PROFILOV,
    sporocil: SPOROCIL,
    porabe: PORABE,
    xp: XP,
    odgovorovVPredpomnilniku: 2000,
    velikostMB: MB(vel),
    polnjenjeS: Math.round((performance.now() - t0) / 1000),
  };
}

// ---------------------------------------------------------------------------------------------------------------
// D6 Obremenitev z omejitvijo kot Render starter (512 MB, 0,5 CPU).
//
// Strežnik (pravi server/index.js s predhodnim modulom) teče v svoji skupini cgroup v1: memory.limit_in_bytes =
// --pomnilnik MB (memsw enako in swappiness 0: brez izmenjalnega prostora), kvota CPU cfs_quota_us / cfs_period_us =
// --cpu (kvota kot na Renderju, ne pol jedra; s taskset je strežnik še vedno pripet na jedro 0, ločeno od merilnika).
// Ob preseženi meji pomnilnika ga ubije jedrov OOM, kot na Renderju. Če skupine ni mogoče ustvariti (ni korena ali
// ni cgroup v1), meritev teče brez omejitve in to glasno izpiše (v dnevnik, JSON in Markdown).
// Preizkusni način z EVKLID_MOCK_DELAY_MS = --mock-zamik (privzeto 15 ms na kos 6 znakov ≈ 400 znakov/s, približno
// hitrost izpisa Haikuja): preizkusni odgovor (~300 znakov) se pretaka ~0,8 s, zato se zahteve prekrivajo in tokovi SSE
// ostanejo odprti. Pravega modela (in njegovega čakanja na prvi žeton) ni: delo strežnika je enako, odprtih povezav bi
// bilo v produkciji pri istem številu učencev več.
// Uporabniki se pripravijo na ločenem strežniku brez omejitev (registracija s scrypt bi sicer dvignila pomnilnik
// omejenega procesa); seje so v bazi, zato piškotki veljajo tudi na omejenem strežniku. Vsak učenec je svoj račun z
// naročnino (v bazi, kot testi), profilom in pogovori (prvi pogovor ima 20 sporočil zgodovine).
// Učenec dela v zaprti zanki brez premora (najslabši primer: c zahtev je ves čas v teku; --premor ms doda naključen
// premor 0–2× toliko med dejanji): 3 sporočila inštruktorju (SSE do konca), nato fotografija, izmenično v klepetu
// (slika 342 KB) in v skeniranje (POST /api/students/:id/scan/read). Po 9 sporočilih v pogovoru začne nov pogovor (nova
// naloga). Dnevna meja vprašanj na profil (question_log, server/accounts/index.js dailyBlock; z naročnino ≥ 60 na dan)
// se iz merilnika ponastavi pred vsako stopnjo, ko ni nobene zahteve v teku: strežnik ima eno povezavo z bazo in na
// zaklep drugega procesa čaka največ 2 s (busy_timeout v server/db.js), zato tuj zapis med obremenitvijo ne sodi v
// meritev. V eni stopnji učenec pri privzetih nastavitvah naredi < 35 vprašanj; morebitni 429 so šteti posebej.
// Stopnje (--stopnje, privzeto 20,40,60,80) tečejo zaporedno na istem strežniku; po vsaki 5 s mirovanja (RSS po
// stopnji: puščanje pomnilnika). Ko strežnik pade, se meritev ustavi.
const CG = "/sys/fs/cgroup";
const O_VRSTE = ["besedilo", "slika", "skeniranje", "pogovor"];
const IME_VRSTE = {
  besedilo: "sporočilo inštruktorju (SSE do konca)",
  slika: "sporočilo s fotografijo 342 KB (SSE do konca)",
  skeniranje: "fotografija 342 KB v skeniranje (scan/read)",
  pogovor: "nov pogovor",
};
const ROK_ZAHTEVE = 120_000; // zahteva, ki ne konča v tem času, šteje kot »izjema rok«
const ukazRok = (s, m, ms = 10_000) => Promise.race([s.ukaz(m).catch(() => null), pocakaj(ms).then(() => null)]);
const cgBeri = (cg, f) => {
  try {
    return fs.readFileSync(path.join(f.startsWith("cpu.") ? cg.cpu : cg.mem, f), "utf8");
  } catch {
    return null;
  }
};
const cgPisi = (cg, f, v) => {
  try {
    fs.writeFileSync(path.join(cg.mem, f), v);
    return true;
  } catch {
    return false;
  }
};
const cgPolja = (t) =>
  Object.fromEntries(
    String(t || "")
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((l) => {
        const [k, v] = l.split(/\s+/);
        return [k, Number(v)];
      }),
  );

function odstraniCgroup(cg) {
  for (const d of [cg.mem, cg.cpu])
    try {
      if (d && fs.existsSync(d)) fs.rmdirSync(d);
    } catch (e) {
      log(`skupine ${d} ni bilo mogoče odstraniti: ${e.code || e.message}`);
    }
}
function ustvariCgroup() {
  const predpona = `${BRAND.slug}-obremenitev-`;
  // ostanki prekinjenih meritev (prazne skupine)
  for (const v of ["memory", "cpu"])
    try {
      for (const d of fs.readdirSync(path.join(CG, v)))
        if (d.startsWith(predpona) && !fs.readFileSync(path.join(CG, v, d, "cgroup.procs"), "utf8").trim()) fs.rmdirSync(path.join(CG, v, d));
    } catch {}
  const ime = `${predpona}${process.pid}`;
  const cg = { ime, mem: path.join(CG, "memory", ime), cpu: path.join(CG, "cpu", ime), opombe: [] };
  try {
    fs.mkdirSync(cg.mem);
    fs.mkdirSync(cg.cpu);
    const meja = String(Math.round(O_POMNILNIK_MB * 1048576));
    fs.writeFileSync(path.join(cg.mem, "memory.limit_in_bytes"), meja);
    try {
      fs.writeFileSync(path.join(cg.mem, "memory.memsw.limit_in_bytes"), meja);
    } catch (e) {
      cg.opombe.push(`memory.memsw.limit_in_bytes ni nastavljiv (${e.code})`);
    }
    try {
      fs.writeFileSync(path.join(cg.mem, "memory.swappiness"), "0");
    } catch (e) {
      cg.opombe.push(`memory.swappiness ni nastavljiv (${e.code})`);
    }
    cg.perioda = Number(fs.readFileSync(path.join(cg.cpu, "cpu.cfs_period_us"), "utf8")) || 100_000;
    fs.writeFileSync(path.join(cg.cpu, "cpu.cfs_quota_us"), String(Math.round(O_CPU * cg.perioda)));
    cg.procs = [path.join(cg.mem, "cgroup.procs"), path.join(cg.cpu, "cgroup.procs")];
    return cg;
  } catch (e) {
    odstraniCgroup(cg);
    return { napaka: `${e.code || ""} ${e.message}`.trim() };
  }
}

const SLIKA_B64 = SLIKA_PNG.toString("base64");
const kodaNapake = (r) => r.opis || (/"code":"([^"]+)"/.exec(r.text()) || /"error":"([^"]{0,80})/.exec(r.text()) || [])[1] || "";
async function dejanje(u, vrsta) {
  const signal = AbortSignal.timeout(ROK_ZAHTEVE);
  if (vrsta === "skeniranje") return u.z(`/api/students/${u.sid}/scan/read`, { method: "POST", body: { image: SLIKA }, signal });
  if (vrsta === "pogovor") {
    const r = await u.z(`/api/students/${u.sid}/conversations`, { method: "POST", body: {}, signal });
    if (r.status < 300) {
      u.pogovor = r.json().id;
      u.vPogovoru = 0;
    }
    return r;
  }
  const a = ++stevec;
  const body = vrsta === "slika" ? { text: `Kako rešim to nalogo? (${a})`, image: { media_type: "image/png", data: SLIKA_B64 } } : { text: `Koliko je ${a} + ${a + 7}?` };
  return u.tok(`/api/conversations/${u.pogovor}/messages`, body, { signal });
}

const ponastaviVprasanja = (db) => {
  try {
    return db.prepare("UPDATE question_log SET n = 0 WHERE day = date('now') AND n > 0").run().changes;
  } catch {
    return -1;
  }
};

async function stopnjaObremenitve(s, cg, c, db) {
  const ziv = () => s.stanje().konec === null;
  await ukazRok(s, { meritev: "ponastavi" });
  ponastaviVprasanja(db);
  const oom0 = cg ? cgPolja(cgBeri(cg, "memory.oom_control")).oom_kill : null;
  const cpu0 = cg ? cgPolja(cgBeri(cg, "cpu.stat")) : null;
  const ponastavljenMax = cg ? cgPisi(cg, "memory.max_usage_in_bytes", "0") : false;
  if (cg) for (const f of ["memory.failcnt", "memory.memsw.failcnt"]) cgPisi(cg, f, "0");
  const zapisi = [];
  let maxRss = 0;
  let maxAnon = 0;
  let maxPorabe = 0;
  const casovnica = []; // [s, VmRSS MB, cgroup rss MB, cgroup poraba MB] vsaki 2 s
  const vrsticZacetek = s.vrstice.length;
  const t0 = performance.now();
  let zadnji = -Infinity;
  const vzorec = setInterval(() => {
    const rss = vmRss(s.pid) || 0;
    maxRss = Math.max(maxRss, rss);
    let anon = null;
    let poraba = null;
    if (cg) {
      const st = cgPolja(cgBeri(cg, "memory.stat"));
      anon = st.total_rss ?? st.rss ?? 0;
      poraba = Number(cgBeri(cg, "memory.usage_in_bytes")) || 0;
      maxAnon = Math.max(maxAnon, anon);
      maxPorabe = Math.max(maxPorabe, poraba);
    }
    const t = performance.now() - t0;
    if (t - zadnji >= 2000) {
      zadnji = t;
      casovnica.push([Math.round(t / 1000), MB(rss), MB(anon), MB(poraba)]);
    }
  }, 200);
  const konecT = t0 + O_TRAJANJE_S * 1000;
  const izvedi = async (u, vrsta) => {
    const z = performance.now();
    const rec = { vrsta, t: Math.round(z - t0) };
    try {
      const r = await dejanje(u, vrsta);
      rec.status = r.napaka && r.status === 200 ? "200+napaka" : r.status;
      if (r.prvi !== undefined) {
        rec.prvi = r.prvi;
        rec.delta = r.delta;
      }
      if (r.napaka || r.status >= 400) rec.opis = kodaNapake(r);
      if (vrsta === "besedilo" || vrsta === "slika") {
        if (rec.status === 200) u.vPogovoru++;
        if (r.status === 429 && /longChat/.test(rec.opis || "")) u.vPogovoru = Infinity; // predolg pogovor: nov pogovor
      }
    } catch (e) {
      rec.status = `izjema ${e.name === "TimeoutError" ? "rok" : e.cause?.code || e.code || e.name}`.slice(0, 40);
    }
    rec.ms = performance.now() - z;
    zapisi.push(rec);
  };
  await Promise.all(
    Array.from({ length: c }, async (_, i) => {
      const u = s.uporabniki[i];
      let k = i % 4; // zamik, da fotografije niso pri vseh učencih hkrati
      // S premorom učenci ne začnejo vsi v isti milisekundi (sicer bi začetni naval določil p95 stopnje).
      if (O_PREMOR_MS) await pocakaj(Math.random() * 2 * O_PREMOR_MS);
      while (performance.now() < konecT && ziv()) {
        k++;
        const vrsta = k % 4 === 0 ? (u.fotografij++ % 2 ? "skeniranje" : "slika") : "besedilo";
        if (vrsta !== "skeniranje" && u.vPogovoru >= 9) await izvedi(u, "pogovor");
        await izvedi(u, vrsta);
        if (O_PREMOR_MS) await pocakaj(Math.random() * 2 * O_PREMOR_MS);
      }
    }),
  );
  clearInterval(vzorec);
  const trajanje = performance.now() - t0;
  const p = ziv() ? await ukazRok(s, { meritev: "porocilo" }) : null;
  const oom = cg ? cgPolja(cgBeri(cg, "memory.oom_control")) : null;
  const cpu1 = cg ? cgPolja(cgBeri(cg, "cpu.stat")) : null;
  const out = {
    c,
    trajanjeS: r1(trajanje / 1000),
    zahtev: zapisi.length,
    uspesnih: zapisi.filter((x) => x.status === 200 || x.status === 201).length,
    n429: zapisi.filter((x) => x.status === 429).length,
    n5xx: zapisi.filter((x) => typeof x.status === "number" && x.status >= 500).length,
    izjem: zapisi.filter((x) => String(x.status).startsWith("izjema")).length,
    napakSse: zapisi.filter((x) => x.status === "200+napaka").length,
    poVrstah: {},
    eld: p?.eld ?? null,
    kopicaMB: MB(p?.mem?.heapUsed),
    maxRssMB: MB(maxRss),
    cgroup: cg
      ? {
          maxPorabaMB: ponastavljenMax ? MB(Number(cgBeri(cg, "memory.max_usage_in_bytes"))) : null, // memory.max_usage_in_bytes (z medpomnilnikom strani)
          maxPorabaVzorecMB: MB(maxPorabe),
          maxAnonMB: MB(maxAnon), // memory.stat total_rss: anonimni pomnilnik (kopica, medpomnilniki), brez medpomnilnika datotek
          // Zavrnjena polnjenja na meji; z memsw = meja jih jedro lahko šteje pri memsw namesto pri memory.
          failcnt: Number(cgBeri(cg, "memory.failcnt")) + (Number(cgBeri(cg, "memory.memsw.failcnt")) || 0),
          oomKill: oom.oom_kill != null && oom0 != null ? oom.oom_kill - oom0 : null,
          underOom: oom.under_oom ?? null,
          dusenje: cpu0 && cpu1 ? { obdobij: cpu1.nr_periods - cpu0.nr_periods, dusenih: cpu1.nr_throttled - cpu0.nr_throttled, dusenoS: r1((cpu1.throttled_time - cpu0.throttled_time) / 1e9) } : null,
        }
      : null,
    prezivel: ziv(),
    casovnica,
  };
  out.neuspesnih = out.zahtev - out.uspesnih;
  for (const v of O_VRSTE) {
    const z = zapisi.filter((x) => x.vrsta === v);
    if (!z.length) continue;
    const ok = z.filter((x) => x.status === 200 || x.status === 201);
    const statusi = {};
    const opisi = {};
    for (const x of z) {
      statusi[x.status] = (statusi[x.status] || 0) + 1;
      if (x.opis && !opisi[x.status]) opisi[x.status] = x.opis;
    }
    const st = (a) => (a.length ? { p50: r1(kvantil(a, 50)), p95: r1(kvantil(a, 95)), p99: r1(kvantil(a, 99)), max: r1(Math.max(...a)) } : null);
    out.poVrstah[v] = {
      n: z.length,
      ok: ok.length,
      zahtevNaS: r1(z.length / (trajanje / 1000)),
      statusi,
      opisi,
      cas: st(z.map((x) => x.ms)),
      casOk: st(ok.map((x) => x.ms)),
      prviBajt: v === "besedilo" || v === "slika" ? st(ok.map((x) => x.prvi).filter((x) => x != null)) : undefined,
      prviDelta: v === "besedilo" || v === "slika" ? st(ok.map((x) => x.delta).filter((x) => x != null)) : undefined,
    };
  }
  // Dnevnik strežnika v tej stopnji: napake (brez vrstic dostopa)
  const vrstice = s.vrstice.slice(vrsticZacetek).map((v) => v.l);
  const napake = vrstice.filter((l) => /error|napaka|SQLITE|heap|ECONN|ERR_|FATAL|uncaught/i.test(l));
  out.dnevnik = { vrstic: vrstice.length, napak: napake.length, primeri: [...new Set(napake.map((l) => l.slice(0, 200)))].slice(0, 8) };
  // 5 s mirovanja: pomnilnik po stopnji (raste med stopnjami = puščanje ali predpomnilniki)
  if (ziv()) {
    await pocakaj(5000);
    const q = await ukazRok(s, { meritev: "porocilo" });
    out.mirovanje = {
      rssMB: MB(vmRss(s.pid)),
      kopicaMB: MB(q?.mem?.heapUsed),
      externalMB: MB(q?.mem?.external),
      cgPorabaMB: cg ? MB(Number(cgBeri(cg, "memory.usage_in_bytes"))) : null,
      cgAnonMB: cg ? MB(cgPolja(cgBeri(cg, "memory.stat")).total_rss) : null,
    };
  }
  out.konec = s.stanje();
  return out;
}

async function merjenjeObremenitve() {
  const dbFile = path.join(TMP, "obremenitev", `${BRAND.slug}.db`);
  fs.mkdirSync(path.dirname(dbFile), { recursive: true });
  const out = {
    nastavitve: {
      pomnilnikMB: O_POMNILNIK_MB,
      cpu: O_CPU,
      trajanjeS: O_TRAJANJE_S,
      stopnje: O_STOPNJE,
      premorMs: O_PREMOR_MS,
      mockZamikMs: Number(O_MOCK_ZAMIK),
      taskset: TASKSET,
    },
    stopnje: [],
  };
  const n = Math.max(...O_STOPNJE);
  const t = performance.now();
  const s0 = await zazeniStreznik(dbFile, { predlog: false });
  let uporabniki;
  try {
    uporabniki = await pripraviUporabnike(s0, n);
  } finally {
    await s0.ustavi();
  }
  log(`obremenitev: ${n} uporabnikov v ${Math.round((performance.now() - t) / 1000)} s`);
  const cg = ustvariCgroup();
  const omejitev = cg.napaka ? null : cg;
  if (omejitev) {
    out.cgroup = { ime: cg.ime, pomnilnikMB: O_POMNILNIK_MB, kvotaUs: Math.round(O_CPU * cg.perioda), periodaUs: cg.perioda, opombe: cg.opombe };
    log(`cgroup ${cg.ime}: ${O_POMNILNIK_MB} MB, CPU ${Math.round(O_CPU * cg.perioda)}/${cg.perioda} µs ${cg.opombe.join("; ")}`);
  } else {
    out.cgroup = { napaka: cg.napaka };
    for (let i = 0; i < 3; i++) log(`!!! BREZ OMEJITVE: skupine cgroup ni mogoče ustvariti (${cg.napaka}); pomnilnik in CPU NISTA omejena, OOM ni mogoč !!!`);
  }
  const db = new DatabaseSync(dbFile);
  db.exec("PRAGMA busy_timeout = 10000");
  let s = null;
  try {
    s = await zazeniStreznik(dbFile, { okolje: { EVKLID_MOCK_DELAY_MS: O_MOCK_ZAMIK }, cgroup: omejitev?.procs });
    const ziv = () => s.stanje().konec === null;
    for (const u of uporabniki) Object.assign(u, { base: s.base, pogovor: u.odpri, vPogovoru: 0, fotografij: 0 });
    s.uporabniki = uporabniki;
    out.zagonMs = Math.round(s.tHealthz);
    out.rssPoZagonuMB = MB(vmRss(s.pid));
    // Predgretje učbenika za tisk (server/index.js, 15 s po zagonu, ~100 MB) naj bo v pomnilniku kot v produkciji.
    const rok = performance.now() + 120_000;
    while (performance.now() < rok && ziv() && !s.vrstice.some((v) => /tisk: \d+ strani v predpomnilniku/.test(v.l))) await pocakaj(500);
    out.predgretoS = r1((performance.now() - s.t0) / 1000);
    out.rssPoPredgretjuMB = MB(vmRss(s.pid));
    if (omejitev) out.cgPoPredgretjuMB = MB(Number(cgBeri(omejitev, "memory.usage_in_bytes")));
    log(`strežnik: /healthz po ${out.zagonMs} ms, po predgretju (${out.predgretoS} s) RSS ${out.rssPoPredgretjuMB} MB, cgroup ${out.cgPoPredgretjuMB ?? "–"} MB`);
    // Ogrevanje (JIT, predpomnilniki): prvi trije učenci po eno dejanje vsake vrste.
    for (const u of uporabniki.slice(0, 3))
      for (const v of ["besedilo", "slika", "skeniranje"])
        try {
          await dejanje(u, v);
        } catch {}
    for (const c of O_STOPNJE) {
      if (!ziv()) break;
      if (c > uporabniki.length) continue;
      log(`obremenitev c=${c}: ${O_TRAJANJE_S} s …`);
      const r = await stopnjaObremenitve(s, omejitev, c, db);
      out.stopnje.push(r);
      const pv = r.poVrstah;
      log(
        `c=${c}: ${r.zahtev} zahtev (${r.uspesnih} ok, 429×${r.n429}, 5xx×${r.n5xx}, izjem ${r.izjem}), sporočilo p95 ${pv.besedilo?.cas?.p95} ms, ` +
          `slika p95 ${pv.slika?.cas?.p95} ms, scan p95 ${pv.skeniranje?.cas?.p95} ms, zanka p99 ${r.eld?.p99} ms, RSS največ ${r.maxRssMB} MB, ` +
          `cgroup največ ${r.cgroup?.maxPorabaMB ?? "–"} MB (anon ${r.cgroup?.maxAnonMB ?? "–"}), failcnt ${r.cgroup?.failcnt ?? "–"}, OOM ${r.cgroup?.oomKill ?? "–"}, ` +
          `${r.prezivel ? `živ, v mirovanju RSS ${r.mirovanje?.rssMB} MB` : `PADEL (${JSON.stringify(r.konec)})`}`,
      );
      if (!r.prezivel) {
        out.padec = { c, ...r.konec, zadnjeVrstice: s.vrstice.slice(-30).map((v) => v.l.slice(0, 300)) };
        break;
      }
    }
  } finally {
    db.close();
    if (s) {
      await s.ustavi();
      const napake = s.izpis
        .join("")
        .split("\n")
        .filter((l) => /Error|napaka/i.test(l) && !/\[evklid\] (4\d\d|5\d\d) /.test(l));
      if (napake.length) out.dnevnikNapake = [...new Set(napake)].slice(0, 15);
    }
    if (omejitev) odstraniCgroup(omejitev);
  }
  return out;
}

// Ena seja: strežnik z bazo, uporabniki, nato izbrani deli.
async function seja(dbFile, { poti, sql, instruktor, prvo }) {
  const s = await zazeniStreznik(dbFile);
  const out = { zagonMs: Math.round(s.tHealthz), rssPoZagonuMB: MB(vmRss(s.pid)) };
  try {
    const t = performance.now();
    // N za obremenitev; posebej po en za vsak način inštruktorja, za zajem SQL in za brskalnik (dnevna meja vprašanj na profil).
    const vsi = await pripraviUporabnike(s, N_UPORABNIKOV + Object.keys(NACINI).length + 2);
    s.uporabniki = vsi.slice(0, N_UPORABNIKOV);
    const ostali = vsi.slice(N_UPORABNIKOV);
    s.posebni = { instruktor: ostali.slice(0, Object.keys(NACINI).length), sql: ostali.at(-2), brskalnik: ostali.at(-1) };
    log(`uporabnikov ${vsi.length} v ${Math.round((performance.now() - t) / 1000)} s`);
    if (poti) out.poti = await merjenjePoti(s);
    if (instruktor) out.instruktor = await merjenjeInstruktorja(s);
    if (sql) out.sql = await merjenjeSql(s);
    if (prvo) {
      out.prvo = { staticno: await staticnoPrvo(s) };
      for (const b of BRSKALNIKI) out.prvo[b] = await odpriVBrskalniku(s, b, s.posebni.brskalnik);
    }
    out.rssKonecMB = MB(vmRss(s.pid));
  } finally {
    await s.ustavi();
    const napake = s.izpis
      .join("")
      .split("\n")
      .filter((l) => /Error|napaka/i.test(l) && !/\[evklid\] (4\d\d|5\d\d) /.test(l));
    if (napake.length) out.dnevnikNapake = napake.slice(0, 10);
  }
  return out;
}

// ---------------------------------------------------------------------------------------------------------------
// Povzetek v Markdown
function povzetek(R) {
  const L = [];
  const okolje = R.okolje;
  L.push(
    `Meritev ${R.datum}, Node ${okolje.node}, ${okolje.cpu} (${okolje.jeder} jeder), strežnik ${okolje.taskset ? "pripet na 1 jedro (taskset -c 0)" : "brez pripenjanja"}.`,
  );
  if (R.zagon) {
    const z = R.zagon;
    L.push(`\n### 0.1 Zagon\n`);
    L.push(
      `Čas do prvega /healthz 200 (server/index.js, mediana ${z.ponovitve.length}×): **${z.healthzMs} ms** (${z.ponovitve.map((p) => p.healthzMs).join(", ")}).\n`,
    );
    L.push("| Faza | t (ms od zagona) | RSS MB | kopica MB | external MB |");
    L.push("|---|---|---|---|---|");
    for (const [k, v] of Object.entries(z.faze || {}))
      if (v && v.rss)
        L.push(
          `| ${k}${v.ms != null ? ` (${v.ms} ms${v.datotek != null ? `, ${v.datotek} datotek` : ""}${v.strani != null ? `, ${v.strani} strani` : ""})` : ""} | ${v.t} | ${MB(v.rss)} | ${MB(v.heapUsed)} | ${MB(v.external)} |`,
        );
    L.push("\nPravi server/index.js (časovnica RSS):\n");
    L.push("| Ponovitev | /healthz ms | RSS ob /healthz | warmStatic (ms, RSS) | tiskPredgrej (ms, RSS) | največ RSS |");
    L.push("|---|---|---|---|---|---|");
    z.ponovitve.forEach((p, i) =>
      L.push(
        `| ${i + 1} | ${p.healthzMs} | ${p.rssHealthzMB} | ${p.warm ? `${p.warm.datotek} dat. v ${p.warm.ms} ms, ${p.warm.rssMB} MB` : "–"} | ${p.tisk ? `${p.tisk.strani} str. v ${p.tisk.ms} ms, ${p.tisk.rssMB} MB` : "–"} | ${p.maxRssMB} |`,
      ),
    );
  }
  const tabelaPoti = (poti, naslov) => {
    L.push(`\n### ${naslov}\n`);
    L.push("| Pot | hkrati | n | p50 ms | p95 ms | p99 ms | zahtev/s | zanka p50/p99/max ms | prepare/zahtevo | statusi | samo 200: p50/p95/p99 |");
    L.push("|---|---|---|---|---|---|---|---|---|---|---|");
    for (const r of poti)
      if (r.preskoceno) L.push(`| ${r.pot} | ${r.c} | – | preskočeno: ${r.preskoceno} | | | | | | | |`);
      else
        L.push(
          `| ${r.pot} | ${r.c} | ${r.n} | ${r.p50} | ${r.p95} | ${r.p99} | ${r.zahtevNaS} | ${r.eld?.p50}/${r.eld?.p99}/${r.eld?.max} | ${r.pripravNaZahtevo} | ${Object.entries(
            r.statusi,
          )
            .map(([k, v]) => `${k}×${v}${r.vzorci?.[k] ? ` (${r.vzorci[k]})` : ""}`)
            .join(" ")} | ${r.ok ? `${r.ok.p50}/${r.ok.p95}/${r.ok.p99}` : "="} |`,
        );
  };
  const tabelaSql = (sql, naslov) => {
    L.push(`\n### ${naslov}\n`);
    L.push(`Različnih stavkov: ${sql.stavkov}.\n`);
    const scan = sql.sql.filter((s) => s.scan.length);
    L.push("SCAN brez indeksa:\n");
    L.push("| Tabela (vrstic) | Poti | Stavek |");
    L.push("|---|---|---|");
    for (const s of scan)
      for (const x of s.scan)
        L.push(`| ${x.tabela} (${x.vrstic}) | ${Object.keys(s.poti).join(", ")} | \`${s.sql.replace(/\s+/g, " ").replace(/\|/g, "\\|").slice(0, 220)}\` |`);
    const pi = sql.sql.filter((s) => s.polniIndeks.length);
    if (pi.length) {
      L.push("\nPolni pregled indeksa (SCAN … USING INDEX):\n");
      for (const s of pi)
        for (const x of s.polniIndeks)
          L.push(`- ${x.detail} (${x.vrstic} vrstic; ${Object.keys(s.poti).join(", ")}): \`${s.sql.replace(/\s+/g, " ").slice(0, 160)}\``);
    }
    L.push("\nNajdražji stavki v zajemu (skupni čas izvajanja, all/get/run):\n");
    L.push("| ms skupaj | klicev | povp. ms | max ms | poti | stavek | načrt |");
    L.push("|---|---|---|---|---|---|---|");
    for (const s of [...sql.sql].sort((a, b) => b.ms - a.ms).slice(0, 12))
      L.push(
        `| ${s.ms} | ${s.klicev} | ${s.klicev ? r1(s.ms / s.klicev) : "–"} | ${s.max} | ${Object.keys(s.poti).join(", ")} | \`${s.sql.replace(/\s+/g, " ").replace(/\|/g, "\\|").slice(0, 160)}\` | ${s.plan.join("; ").replace(/\|/g, "\\|")} |`,
      );
    const td = sql.sql.filter((s) => s.zacasnoDrevo.length);
    if (td.length) L.push(`\nZačasno drevo B (TEMP B-TREE) v ${td.length} stavkih.`);
  };
  if (R.male?.poti) tabelaPoti(R.male.poti, "0.2 Poti (mala baza)");
  if (R.male?.sql) tabelaSql(R.male.sql, "0.3 SQL (mala baza)");
  if (R.male?.prvo) {
    const p = R.male.prvo;
    L.push(`\n### 0.4 Prvo odprtje\n`);
    L.push("```json\n" + JSON.stringify(p.staticno, null, 1) + "\n```");
    for (const b of BRSKALNIKI) {
      const x = p[b];
      if (!x || x.napaka) {
        L.push(`\n${b}: ${x?.napaka || "ni izmerjeno"}`);
        continue;
      }
      L.push(`\n${b} ${x.razlicica} (${x.omejitve}):\n`);
      L.push(
        "| Scenarij | load ms | pripravljeno ms | FCP | LCP | CLS do tapov / skupaj | INP | dolgih nalog (skupaj, najdaljša ms) | zahtev | prenos KB | surovo KB |",
      );
      L.push("|---|---|---|---|---|---|---|---|---|---|---|");
      for (const s of ["anonimno", "prijavljen"]) {
        const v = x[s];
        if (v)
          L.push(
            `| ${s} | ${v.loadMs} | ${v.pripravljenoMs ?? "–"} | ${v.fcpMs} | ${v.lcpMs} (${v.lcpElement}) | ${v.clsDoInterakcij} / ${v.cls} | ${v.inpMs ?? "–"} | ${v.dolgih} (${v.dolgeSkupajMs}, ${v.najdaljsaMs}) | ${v.zahteve["vse:skupaj"]?.zahtev} | ${v.zahteve["vse:skupaj"]?.prenosKB} | ${v.zahteve["vse:skupaj"]?.suroviKB} |`,
          );
      }
    }
  }
  if (R.male?.instruktor) {
    L.push(`\n### 0.5 Inštruktor (preizkusni način, samo čas strežnika)\n`);
    L.push("| Način | n | glave p50 | prvi bajt p50/p95 | prvi delta p50 | done p50 | konec p50/p95 | napak |");
    L.push("|---|---|---|---|---|---|---|---|");
    for (const [k, v] of Object.entries(R.male.instruktor))
      L.push(
        `| ${k} | ${v.n} | ${v.glave.p50} | ${v.prviBajt.p50}/${v.prviBajt.p95} | ${v.prviDelta.p50} | ${v.done.p50} | ${v.konec.p50}/${v.konec.p95} | ${v.napak} |`,
      );
  }
  if (R.velika) {
    L.push(`\n### 0.6 Sintetična baza\n`);
    L.push("```json\n" + JSON.stringify(R.velika.baza) + "\n```");
    L.push(`Zagon na veliki bazi: /healthz po ${R.velika.zagonMs} ms, RSS ${R.velika.rssPoZagonuMB} MB.`);
    if (R.velika.poti) tabelaPoti(R.velika.poti, "0.6 Poti (velika baza)");
    if (R.velika.sql) tabelaSql(R.velika.sql, "0.6 SQL (velika baza)");
  }
  if (R.obremenitev) {
    const o = R.obremenitev;
    const n = o.nastavitve;
    L.push(`\n### D6 Obremenitev (${n.pomnilnikMB} MB, ${String(n.cpu).replace(".", ",")} CPU)\n`);
    if (o.cgroup?.napaka)
      L.push(`**POZOR: brez omejitve.** Skupine cgroup ni bilo mogoče ustvariti (${o.cgroup.napaka}); pomnilnik in CPU nista bila omejena, OOM ni bil mogoč.\n`);
    else
      L.push(
        `cgroup v1: memory.limit_in_bytes ${o.cgroup.pomnilnikMB} MB (memsw enako, swappiness 0${o.cgroup.opombe.length ? `; ${o.cgroup.opombe.join("; ")}` : ""}), cpu.cfs_quota_us ${o.cgroup.kvotaUs} / cfs_period_us ${o.cgroup.periodaUs}${n.taskset ? ", strežnik še pripet na jedro 0" : ""}.\n`,
      );
    L.push(
      `Trajanje stopnje ${n.trajanjeS} s, zaprta zanka ${n.premorMs ? `s premorom ~${n.premorMs} ms` : "brez premora"}, EVKLID_MOCK_DELAY_MS=${n.mockZamikMs}. ` +
        `/healthz po ${o.zagonMs} ms; po predgretju tiska (${o.predgretoS} s) RSS ${o.rssPoPredgretjuMB} MB${o.cgPoPredgretjuMB != null ? `, cgroup ${o.cgPoPredgretjuMB} MB` : ""}.\n`,
    );
    L.push(
      "| Hkrati | zahtev (ok / ne) | 429 | 5xx / izjeme / napaka SSE | sporočilo p50/p95/p99 ms | prvi bajt SSE p50/p95 | s fotografijo p95 | scan/read p95 | zanka p99/max ms | največ cgroup / anon / RSS MB | failcnt | OOM | dušenje CPU s | preživel | mirovanje RSS / kopica MB |",
    );
    L.push("|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|");
    for (const r of o.stopnje) {
      const b = r.poVrstah.besedilo;
      L.push(
        `| ${r.c} | ${r.zahtev} (${r.uspesnih} / ${r.neuspesnih}) | ${r.n429} | ${r.n5xx} / ${r.izjem} / ${r.napakSse} | ${b?.cas?.p50}/${b?.cas?.p95}/${b?.cas?.p99} | ${b?.prviBajt?.p50}/${b?.prviBajt?.p95} | ${r.poVrstah.slika?.cas?.p95 ?? "–"} | ${r.poVrstah.skeniranje?.cas?.p95 ?? "–"} | ${r.eld?.p99 ?? "–"}/${r.eld?.max ?? "–"} | ${r.cgroup?.maxPorabaMB ?? "–"} / ${r.cgroup?.maxAnonMB ?? "–"} / ${r.maxRssMB} | ${r.cgroup?.failcnt ?? "–"} | ${r.cgroup?.oomKill ?? "–"} | ${r.cgroup?.dusenje?.dusenoS ?? "–"} | ${r.prezivel ? "da" : "**ne**"} | ${r.mirovanje ? `${r.mirovanje.rssMB} / ${r.mirovanje.kopicaMB}` : "–"} |`,
      );
    }
    L.push("\nPo vrstah (ms; »ok« = 200/201 brez napake v toku SSE):\n");
    L.push("| Hkrati | Vrsta | n | ok | na s | p50 | p95 | p99 | max | prvi bajt p50/p95 | prvi delta p95 | statusi |");
    L.push("|---|---|---|---|---|---|---|---|---|---|---|---|");
    for (const r of o.stopnje)
      for (const [v, x] of Object.entries(r.poVrstah))
        L.push(
          `| ${r.c} | ${IME_VRSTE[v]} | ${x.n} | ${x.ok} | ${x.zahtevNaS} | ${x.cas?.p50} | ${x.cas?.p95} | ${x.cas?.p99} | ${x.cas?.max} | ${x.prviBajt ? `${x.prviBajt.p50}/${x.prviBajt.p95}` : "–"} | ${x.prviDelta?.p95 ?? "–"} | ${Object.entries(x.statusi)
            .map(([k, c]) => `${k}×${c}${x.opisi[k] ? ` (${x.opisi[k]})` : ""}`)
            .join(" ")} |`,
        );
    if (o.padec) L.push(`\n**Strežnik je padel pri ${o.padec.c} hkratnih** (izhod ${o.padec.konec}, signal ${o.padec.signal ?? "–"}). Zadnje vrstice dnevnika:\n\n\`\`\`\n${o.padec.zadnjeVrstice.join("\n")}\n\`\`\``);
    const dn = o.stopnje.flatMap((r) => r.dnevnik.primeri.map((l) => `c=${r.c}: ${l}`));
    if (dn.length) L.push(`\nNapake v dnevniku strežnika:\n\n\`\`\`\n${dn.join("\n")}\n\`\`\``);
  }
  return L.join("\n");
}

// ---------------------------------------------------------------------------------------------------------------
const R = {
  datum: new Date().toISOString(),
  deli: [...SAMO],
  okolje: { node: process.version, cpu: os.cpus()[0]?.model, jeder: JEDRA, taskset: TASKSET, stopnje: STOPNJE, uporabnikov: N_UPORABNIKOV, hitro: HITRO },
};
const t00 = performance.now();
try {
  if (SAMO.has("zagon")) {
    const dbFile = path.join(TMP, "zagon", `${BRAND.slug}.db`);
    R.zagon = await merjenjeZagona(dbFile);
  }
  const izMale = { poti: SAMO.has("poti"), sql: SAMO.has("sql"), instruktor: SAMO.has("instruktor"), prvo: SAMO.has("prvo") };
  if (Object.values(izMale).some(Boolean)) R.male = await seja(path.join(TMP, "mala", `${BRAND.slug}.db`), izMale);
  if (SAMO.has("velika")) {
    const dbFile = path.join(TMP, "velika", `${BRAND.slug}.db`);
    fs.mkdirSync(path.dirname(dbFile), { recursive: true });
    const baza = await napolniVelikoBazo(dbFile);
    R.velika = { baza, ...(await seja(dbFile, { poti: true, sql: true })) };
  }
  if (SAMO.has("obremenitev")) R.obremenitev = await merjenjeObremenitve();
} finally {
  if (args.includes("--obdrzi")) log(`začasna mapa ostane: ${TMP}`);
  else fs.rmSync(TMP, { recursive: true, force: true });
}
R.trajanjeS = Math.round((performance.now() - t00) / 1000);
if (arg("--json")) fs.writeFileSync(arg("--json"), JSON.stringify(R, null, 1));
const md = povzetek(R);
if (arg("--md")) fs.writeFileSync(arg("--md"), md);
console.log(md);
log(`končano v ${R.trajanjeS} s`);

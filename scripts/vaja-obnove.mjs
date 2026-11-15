#!/usr/bin/env node
// Vaja obnove baze na sveži namestitvi (j 2026-11-15, priprava na zaprt pilot; zapis v docs/obnova.md).
// Brez pravih ključev in brez Renderja: vse teče lokalno v začasni mapi, v preizkusnem načinu (EVKLID_MOCK=1).
//
//  1. Strežnik A (prazna mapa): pravi računi prek API (geslo, potrditev, profil, pogovor) + sintetični mesec
//     za N učencev (pogovori šifrirani z EVKLID_DATA_KEY, poraba, XP).
//  2. Kopija in preizkus kot v Render Shell: obnovi-kopijo.js --zdaj, --preveri, --oblak-zdaj (lokalni nadomestek R2).
//  3. Strežnik A se »izgubi«. Sveža namestitev B (nova prazna mapa, isti ključ, samo datoteka kopije):
//     prvi zagon (prazna baza), obnovi-kopijo.js <datum>, ponovni zagon → obnova; preverimo prijavo, profil, pogovore.
//  4. Sveža namestitev C, ki ima samo kopijo zunaj strežnika: --oblak-prenesi, --preveri, obnova, ponovni zagon.
//  5. Negativni preizkus: napačen ključ → --preveri pove napako (pogovorov ni mogoče prebrati).
//
//   node scripts/vaja-obnove.mjs                 # 20 učencev, en mesec
//   node scripts/vaja-obnove.mjs --ucencev 200   # večja baza
//   node scripts/vaja-obnove.mjs --json          # izid kot JSON
// Izhod 1, če kateri korak ne uspe.
import { spawn, execFile } from "node:child_process";
import { promisify } from "node:util";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath, pathToFileURL } from "node:url";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import net from "node:net";
import crypto from "node:crypto";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const run = promisify(execFile);
const args = process.argv.slice(2);
const JSON_IZID = args.includes("--json");
const UCENCEV = Math.max(1, Number(args[args.indexOf("--ucencev") + 1]) || 20);
const RACUNOV = 3; // pravih računov prek API (z geslom in potrditvijo)
const YEAR = new Date().getFullYear();

const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-vaja-obnove-"));
const KLJUC = crypto.randomBytes(32).toString("base64");
const casi = [];
const napake = [];
const log = (s) => JSON_IZID || console.log(s);

async function korak(ime, fn) {
  const t0 = performance.now();
  try {
    const r = await fn();
    const ms = Math.round(performance.now() - t0);
    casi.push({ korak: ime, ms, ok: true });
    log(`✓ ${ime} (${(ms / 1000).toFixed(1)} s)`);
    return r;
  } catch (e) {
    const ms = Math.round(performance.now() - t0);
    casi.push({ korak: ime, ms, ok: false, napaka: e.message });
    napake.push(`${ime}: ${e.message}`);
    log(`✗ ${ime}: ${e.message}`);
    throw e;
  }
}

// --- lokalni nadomestek Cloudflare R2 (S3: PUT, GET, DELETE, ListObjectsV2; zahteva podpis SigV4) ---
function nadomestekR2() {
  const objekti = new Map();
  const srv = http.createServer((req, res) => {
    const deli = [];
    req.on("data", (d) => deli.push(d));
    req.on("end", () => {
      const u = new URL(req.url, "http://x");
      if (!/^AWS4-HMAC-SHA256 Credential=vaja\//.test(req.headers.authorization || "")) {
        res.writeHead(403).end("<Code>AccessDenied</Code>");
        return;
      }
      const key = decodeURIComponent(u.pathname.replace(/^\/evklid-kopije\/?/, ""));
      if (req.method === "PUT") objekti.set(key, Buffer.concat(deli));
      else if (req.method === "DELETE") objekti.delete(key);
      else if (req.method === "GET" && u.searchParams.get("list-type") === "2") {
        const p = u.searchParams.get("prefix") || "";
        const xml = [...objekti.keys()].filter((k) => k.startsWith(p)).map((k) => `<Contents><Key>${k}</Key></Contents>`).join("");
        res.end(`<ListBucketResult>${xml}</ListBucketResult>`);
        return;
      } else if (req.method === "GET") {
        if (!objekti.has(key)) return void res.writeHead(404).end("<Code>NoSuchKey</Code>");
        res.end(objekti.get(key));
        return;
      }
      res.end("");
    });
  });
  return new Promise((ok) => srv.listen(0, "127.0.0.1", () => ok({ srv, objekti, url: `http://127.0.0.1:${srv.address().port}` })));
}

const prostVrata = () =>
  new Promise((ok, ne) => {
    const s = net.createServer();
    s.once("error", ne);
    s.listen(0, "127.0.0.1", () => {
      const p = s.address().port;
      s.close(() => ok(p));
    });
  });

function okolje(dbFile, r2, extra = {}) {
  return {
    PATH: process.env.PATH,
    HOME: process.env.HOME,
    TZ: "UTC",
    EVKLID_MOCK: "1",
    ANTHROPIC_API_KEY: "",
    STRIPE_SECRET_KEY: "",
    RESEND_API_KEY: "",
    EVKLID_ACCOUNTS: "1",
    EVKLID_DB: dbFile,
    EVKLID_DATA_KEY: KLJUC,
    EVKLID_PDF: "0",
    EVKLID_MERITEV_PO_OBJAVI: "0",
    EVKLID_KOPIJE_S3_URL: r2.url,
    EVKLID_KOPIJE_S3_BUCKET: "evklid-kopije",
    EVKLID_KOPIJE_S3_KEY_ID: "vaja",
    EVKLID_KOPIJE_S3_SECRET: "vaja-skrivnost",
    ...extra,
  };
}

// Strežnik kot na Renderju (npm start brez .env): vrne { base, ustavi, izpis, zagonMs }.
async function zazeni(dbFile, r2) {
  const port = await prostVrata();
  const t0 = performance.now();
  const p = spawn(process.execPath, ["--disable-warning=ExperimentalWarning", "server/index.js"], {
    cwd: ROOT,
    env: { ...okolje(dbFile, r2), PORT: String(port) },
    stdio: ["ignore", "pipe", "pipe"],
  });
  const izpis = [];
  p.stdout.on("data", (d) => izpis.push(String(d)));
  p.stderr.on("data", (d) => izpis.push(String(d)));
  let konec = null;
  p.on("exit", (c) => (konec = c ?? "signal"));
  const base = `http://127.0.0.1:${port}`;
  while (performance.now() - t0 < 120_000) {
    if (konec !== null) throw new Error(`strežnik se je ustavil (${konec}): ${izpis.join("").slice(-800)}`);
    try {
      if ((await fetch(base + "/healthz", { signal: AbortSignal.timeout(1000) })).ok) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  const zagonMs = Math.round(performance.now() - t0);
  const ustavi = () =>
    new Promise((ok) => {
      if (konec !== null) return ok();
      p.once("exit", ok);
      p.kill("SIGTERM");
      setTimeout(() => p.kill("SIGKILL"), 25_000).unref();
    });
  return { base, ustavi, izpis, zagonMs };
}

// Odjemalec s piškotki (kot brskalnik).
function odjemalec(base) {
  const jar = {};
  const call = async (pot, { method = "GET", body } = {}) => {
    const res = await fetch(base + pot, {
      method,
      redirect: "manual",
      headers: { "Content-Type": "application/json", cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; ") },
      body: body ? JSON.stringify(body) : undefined,
    });
    for (const c of res.headers.getSetCookie()) {
      const [kv] = c.split(";");
      const i = kv.indexOf("=");
      jar[kv.slice(0, i)] = kv.slice(i + 1);
    }
    const t = res.headers.get("content-type") || "";
    return { status: res.status, body: t.includes("json") ? await res.json() : await res.text() };
  };
  call.jar = jar;
  return call;
}

// Isti piškotki na drugem naslovu (brskalnik učenca po obnovi strežnika).
function zPiskotki(base, jar) {
  const call = odjemalec(base);
  Object.assign(call.jar, jar);
  return call;
}

const ukaz = async (dbFile, r2, argv, extra = {}) => {
  try {
    const { stdout } = await run(process.execPath, ["--disable-warning=ExperimentalWarning", "scripts/obnovi-kopijo.js", ...argv], {
      cwd: ROOT,
      env: okolje(dbFile, r2, extra),
      timeout: 300_000,
    });
    return { ok: true, izpis: stdout };
  } catch (e) {
    return { ok: false, izpis: `${e.stdout || ""}${e.stderr || ""}` };
  }
};

// --- pravi računi prek API ---
async function praviRacuni(base) {
  const racuni = [];
  for (let i = 0; i < RACUNOV; i++) {
    const call = odjemalec(base);
    const email = `vaja${i}@obnova.test`;
    const geslo = `vaja-geslo-${i}-${crypto.randomBytes(4).toString("hex")}`;
    const r = await call("/api/auth/register", { method: "POST", body: { email, password: geslo, accept_privacy: true, birth_date: "1984-03-0" + (i + 1) } });
    if (r.status !== 201) throw new Error(`registracija ${email}: ${r.status} ${JSON.stringify(r.body).slice(0, 200)}`);
    const url = r.body.dev_verify_url;
    if (!url) throw new Error("ni povezave za potrditev (dev_verify_url)");
    const v = await call(new URL(url).pathname + new URL(url).search);
    if (v.status >= 400) throw new Error(`potrditev: ${v.status}`);
    const kid = await call("/api/students", { method: "POST", body: { name: `Učenec ${i}`, birth_year: YEAR - 17, consent: true } });
    if (kid.status >= 300) throw new Error(`profil: ${kid.status} ${JSON.stringify(kid.body).slice(0, 200)}`);
    const conv = await call(`/api/students/${kid.body.id}/conversations`, { method: "POST" });
    if (conv.status >= 300) throw new Error(`pogovor: ${conv.status}`);
    const besedilo = `Kako rešim enačbo ${i + 2}x + 3 = ${2 * (i + 2) + 3}? (vaja ${i})`;
    const m = await call(`/api/conversations/${conv.body.id}/messages`, { method: "POST", body: { text: besedilo } });
    if (m.status !== 200) throw new Error(`sporočilo: ${m.status} ${String(JSON.stringify(m.body)).slice(0, 200)}`);
    racuni.push({ jar: { ...call.jar }, email, geslo, kidId: kid.body.id, kidName: `Učenec ${i}`, convId: conv.body.id, besedilo });
  }
  return racuni;
}

// --- sintetični mesec za N učencev (neposredno v bazo, šifrirano kot v aplikaciji) ---
async function sinteticniMesec(dbFile) {
  process.env.EVKLID_DATA_KEY = KLJUC;
  const { seal, sealJson } = await import(pathToFileURL(path.join(ROOT, "server", "crypto-polje.js")).href);
  const db = new DatabaseSync(dbFile);
  db.exec("PRAGMA busy_timeout = 5000");
  const zdaj = Date.now();
  const cas = (dni) => new Date(zdaj - Math.random() * dni * 86400_000).toISOString().replace("T", " ").slice(0, 19);
  const parent = db.prepare(
    "INSERT INTO parents (email, password_hash, privacy_version, unsubscribe_token, referral_code, email_verified_at, created_at) VALUES (?, 'none$vaja', 'vaja', ?, ?, ?, ?)",
  );
  const student = db.prepare("INSERT INTO students (name, settings, parent_id, birth_year, created_at) VALUES (?, '{}', ?, ?, ?)");
  const conv = db.prepare("INSERT INTO conversations (student_id, title, created_at, updated_at) VALUES (?, ?, ?, ?)");
  const msg = db.prepare("INSERT INTO messages (conversation_id, role, api_content, display_text, created_at) VALUES (?, ?, ?, ?, ?)");
  const usage = db.prepare(
    "INSERT INTO usage (student_id, parent_id, model, kind, input_tokens, output_tokens, cache_read_tokens, cache_write_tokens, cost_usd, created_at) VALUES (?, ?, 'claude-haiku-4-5', 'chat', ?, ?, 0, 0, ?, ?)",
  );
  db.exec("BEGIN");
  // Mesec na učenca: ~1 pogovor na dan s 6 sporočili (ocena za aktivnega maturanta), vsak odgovor ena vrstica porabe.
  for (let i = 0; i < UCENCEV; i++) {
    const c0 = cas(30);
    const pid = Number(parent.run(`sint${i}@obnova.test`, crypto.randomBytes(12).toString("hex"), `VAJA${i}`, c0, c0).lastInsertRowid);
    const sid = Number(student.run(`Sintetični ${i}`, pid, YEAR - 17, c0).lastInsertRowid);
    for (let d = 0; d < 30; d++) {
      const c = cas(30);
      const cid = Number(conv.run(sid, seal(`Naloga ${i}/${d}`), c, c).lastInsertRowid);
      for (let m = 0; m < 6; m++) {
        const role = m % 2 ? "assistant" : "user";
        const text = role === "user" ? `Vprašanje ${d}/${m}: koliko je ${m} · ${d}?` : `Odgovor: ${"Pomnožimo in preverimo z obratno operacijo. ".repeat(6)}`;
        msg.run(cid, role, sealJson([{ type: "text", text }]), seal(text), c);
        if (role === "assistant") usage.run(sid, pid, 1500, 300, 0.0027, c);
      }
    }
  }
  db.exec("COMMIT");
  db.close();
}

const steviloVrstic = (dbFile) => {
  const db = new DatabaseSync(dbFile, { readOnly: true });
  try {
    const out = {};
    for (const t of ["parents", "students", "conversations", "messages", "usage"]) out[t] = Number(db.prepare(`SELECT COUNT(*) n FROM ${t}`).get().n);
    return out;
  } finally {
    db.close();
  }
};

async function preveriRacune(base, racuni) {
  const beri = async (call, r, kje) => {
    const acc = await call("/api/account");
    const kid = acc.body?.children?.find((c) => c.id === r.kidId);
    if (!kid || kid.name !== r.kidName) throw new Error(`${kje}: profil ${r.kidName} manjka po obnovi (${acc.status})`);
    const c = await call(`/api/conversations/${r.convId}`);
    if (c.status !== 200 || !JSON.stringify(c.body).includes(r.besedilo)) throw new Error(`${kje}: pogovor ${r.convId}: ${c.status}, besedilo ni berljivo`);
  };
  for (const r of racuni) {
    // 1) Naprava učenca iz časa pred kopijo: piškotek seje velja naprej, ponovna prijava ni potrebna.
    await beri(zPiskotki(base, r.jar), r, "stara naprava");
    // 2) Nova naprava: prijava z geslom; profil je še »odprt« na stari napravi, zato ga prevzame (kot gumb v aplikaciji).
    const call = odjemalec(base);
    const l = await call("/api/auth/login", { method: "POST", body: { email: r.email, password: r.geslo } });
    if (l.status !== 200) throw new Error(`prijava ${r.email}: ${l.status} ${JSON.stringify(l.body).slice(0, 200)}`);
    const zaseden = await call(`/api/conversations/${r.convId}`);
    if (zaseden.status === 409) {
      const cl = await call(`/api/students/${r.kidId}/claim`, { method: "POST" });
      if (cl.status >= 300) throw new Error(`prevzem profila: ${cl.status} ${JSON.stringify(cl.body).slice(0, 200)}`);
    }
    await beri(call, r, "nova naprava");
    const slabo = await odjemalec(base)("/api/auth/login", { method: "POST", body: { email: r.email, password: "napacno-geslo-123" } });
    if (slabo.status === 200) throw new Error("prijava z napačnim geslom je uspela");
  }
}

async function main() {
  const r2 = await nadomestekR2();
  const A = path.join(TMP, "a", "evklid.db");
  const B = path.join(TMP, "b", "evklid.db");
  const C = path.join(TMP, "c", "evklid.db");
  for (const f of [A, B, C]) fs.mkdirSync(path.dirname(f), { recursive: true });
  let racuni;
  let vrsticeA;
  let datum;
  let velikostMB;
  try {
    log(`Vaja obnove v ${TMP} (${UCENCEV} učencev × 30 dni, ${RACUNOV} pravi računi)\n`);
    const sA = await korak("A: prvi zagon prazne namestitve", () => zazeni(A, r2));
    try {
      racuni = await korak(`A: ${RACUNOV} pravi računi prek API (geslo, potrditev, profil, pogovor)`, () => praviRacuni(sA.base));
      await korak(`A: sintetični mesec za ${UCENCEV} učencev`, () => sinteticniMesec(A));
      const z = await korak("A: obnovi-kopijo.js --zdaj (kopija med delovanjem)", () => ukaz(A, r2, ["--zdaj"]));
      if (!z.ok || !/Narejena/.test(z.izpis)) throw new Error(`--zdaj: ${z.izpis}`);
      const p = await korak("A: obnovi-kopijo.js --preveri", () => ukaz(A, r2, ["--preveri"]));
      if (!p.ok || !/OBNOVA BI USPELA/.test(p.izpis)) throw new Error(`--preveri: ${p.izpis}`);
      const o = await korak("A: obnovi-kopijo.js --oblak-zdaj (šifrirano v R2)", () => ukaz(A, r2, ["--oblak-zdaj"]));
      if (!o.ok || !/Naložena kopija/.test(o.izpis)) throw new Error(`--oblak-zdaj: ${o.izpis}`);
    } finally {
      await sA.ustavi();
    }
    vrsticeA = steviloVrstic(A);
    const kopija = fs.readdirSync(path.join(path.dirname(A), "kopije")).find((n) => n.endsWith(".db"));
    datum = kopija.match(/evklid-(.+)\.db$/)[1];
    velikostMB = +(fs.statSync(path.join(path.dirname(A), "kopije", kopija)).size / 1048576).toFixed(1);
    // Šifrirana vsebina v R2: nobeno besedilo pogovora ni berljivo brez ključa.
    const vR2 = [...r2.objekti.values()][0];
    if (!vR2 || vR2.includes(Buffer.from(racuni[0].besedilo))) throw new Error("kopija v R2 ni šifrirana");

    // --- B: sveža namestitev s kopijo na disku ---
    const sB0 = await korak("B: prvi zagon sveže namestitve (ustvari prazno bazo)", () => zazeni(B, r2));
    await sB0.ustavi();
    await korak("B: prenos datoteke kopije na novi strežnik", async () => {
      fs.mkdirSync(path.join(path.dirname(B), "kopije"), { recursive: true });
      fs.copyFileSync(path.join(path.dirname(A), "kopije", kopija), path.join(path.dirname(B), "kopije", kopija));
    });
    const pb = await korak("B: obnovi-kopijo.js --preveri (pred obnovo)", () => ukaz(B, r2, ["--preveri", datum]));
    if (!/OBNOVA BI USPELA/.test(pb.izpis)) throw new Error(`--preveri B: ${pb.izpis}`);
    const ob = await korak(`B: obnovi-kopijo.js ${datum}`, () => ukaz(B, r2, [datum]));
    if (!ob.ok || !/Pripravljena obnova/.test(ob.izpis)) throw new Error(`obnova B: ${ob.izpis}`);
    const sB = await korak("B: ponovni zagon (obnova ob zagonu)", () => zazeni(B, r2));
    try {
      if (!/baza obnovljena iz kopije/.test(sB.izpis.join(""))) throw new Error("strežnik ni javil obnove");
      await korak("B: prijava z geslom, profil in pogovor berljivi", () => preveriRacune(sB.base, racuni));
      const st = await (await fetch(sB.base + "/healthz/stanje")).json();
      if (st.kopije?.obnovaCaka) throw new Error("obnova še čaka po zagonu");
    } finally {
      await sB.ustavi();
    }
    const vrsticeB = steviloVrstic(B);
    if (JSON.stringify(vrsticeB) !== JSON.stringify(vrsticeA)) throw new Error(`vrstice A ${JSON.stringify(vrsticeA)} ≠ B ${JSON.stringify(vrsticeB)}`);

    // --- C: sveža namestitev, ki ima samo kopijo zunaj strežnika (Render v celoti izgubljen) ---
    const sC0 = await korak("C: prvi zagon sveže namestitve", () => zazeni(C, r2));
    await sC0.ustavi();
    const dan = datum.slice(0, 10);
    const pc = await korak(`C: obnovi-kopijo.js --oblak-prenesi ${dan}`, () => ukaz(C, r2, ["--oblak-prenesi", dan]));
    if (!pc.ok || !/Prenesena/.test(pc.izpis)) throw new Error(`--oblak-prenesi: ${pc.izpis}`);
    const vc = await korak(`C: obnovi-kopijo.js --preveri ${dan}-0000`, () => ukaz(C, r2, ["--preveri", `${dan}-0000`]));
    if (!/OBNOVA BI USPELA/.test(vc.izpis)) throw new Error(`--preveri C: ${vc.izpis}`);
    const oc = await korak(`C: obnovi-kopijo.js ${dan}-0000`, () => ukaz(C, r2, [`${dan}-0000`]));
    if (!oc.ok) throw new Error(`obnova C: ${oc.izpis}`);
    const sC = await korak("C: ponovni zagon (obnova ob zagonu)", () => zazeni(C, r2));
    try {
      await korak("C: prijava z geslom, profil in pogovor berljivi", () => preveriRacune(sC.base, racuni));
    } finally {
      await sC.ustavi();
    }
    const vrsticeC = steviloVrstic(C);
    if (JSON.stringify(vrsticeC) !== JSON.stringify(vrsticeA)) throw new Error(`vrstice A ≠ C ${JSON.stringify(vrsticeC)}`);

    // --- napačen ključ: preizkus mora odkriti, da pogovorov ni mogoče prebrati ---
    const nk = await korak("Napačen ključ: --preveri zazna neberljive pogovore", async () => {
      const r = await ukaz(B, r2, ["--preveri", datum], { EVKLID_DATA_KEY: crypto.randomBytes(32).toString("base64") });
      if (r.ok || /OBNOVA BI USPELA/.test(r.izpis)) throw new Error(`napačen ključ ni bil zaznan: ${r.izpis}`);
      return r;
    });
    void nk;
  } finally {
    r2.srv.close();
  }
  return { vrstice: vrsticeA, velikostMB, datum };
}

let izid;
try {
  izid = await main();
} catch (e) {
  if (!napake.length) napake.push(e.message);
}
const skupaj = casi.reduce((a, c) => a + c.ms, 0);
if (JSON_IZID) console.log(JSON.stringify({ ucencev: UCENCEV, ...izid, casi, napake, skupajMs: skupaj }, null, 2));
else {
  if (izid) log(`\nBaza: ${JSON.stringify(izid.vrstice)}, kopija ${izid.velikostMB} MB`);
  log(napake.length ? `\nVAJA NI USPELA:\n- ${napake.join("\n- ")}` : `\nVAJA USPELA (skupaj ${(skupaj / 1000).toFixed(1)} s).`);
}
fs.rmSync(TMP, { recursive: true, force: true });
process.exit(napake.length ? 1 : 0);

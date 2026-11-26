#!/usr/bin/env node
// Delavec Lean na j-jevem prenosniku (docs/lean.md, L5; navodila: NAVODILA.md v tej mapi). Samo izhodna povezava:
// vsakih nekaj sekund vpraša evklid.app za nalogo (matematična trditev + id), trditev znova preveri s filtrom
// (trditev.mjs), sam sestavi datoteko Lean iz stalne predloge (lean.mjs), zažene Lean z rokom in mejo pomnilnika in
// vrne izid. Nič ne posluša, nikoli se ne ustavi (vsaka napaka gre v dnevnik, nato premor), piše stanje.json.
// Zagon: zazeni.bat (Windows) ali `node delavec.mjs [--nastavitve pot] [--enkrat]`.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { spawn } from "node:child_process";
import { preveriTrditev } from "./trditev.mjs";
import { predloga, preberiIzpis, ocistiSporocilo } from "./lean.mjs";

export const RAZLICICA = "lean-delavec 2";
const TU = import.meta.dirname;
const arg = (ime) => {
  const i = process.argv.indexOf(ime);
  return i > 0 ? process.argv[i + 1] : null;
};

// ---------- nastavitve ----------
export function naloziNastavitve(pot) {
  const n = JSON.parse(fs.readFileSync(pot, "utf8"));
  const out = {
    streznik: String(n.streznik || "https://evklid.app").replace(/\/+$/, ""),
    zeton: String(n.zeton || ""),
    premorS: Math.min(Math.max(Number(n.premorS) || 20, 5), 600),
    utripS: 60,
    rokS: Math.min(Math.max(Number(n.rokS) || 240, 30), 540), // < najem na strežniku (600 s); glej rokNaloge
    pomnilnikMB: Math.min(Math.max(Number(n.pomnilnikMB) || 6144, 2048), 65536),
    projekt: path.resolve(path.dirname(pot), n.projekt || "projekt"),
    lake: n.lake || null, // absolutna pot do lake (sicer ELAN_HOME\bin ali ~/.elan/bin)
    // Samo Linux: Lean kot ta uporabnik (npr. 65534 = nobody), če delavec teče kot root. Windows: glej docs/lean.md.
    linuxUid: Number.isInteger(n.linuxUid) && n.linuxUid > 0 ? n.linuxUid : null,
  };
  const u = new URL(out.streznik);
  const lokalno = ["127.0.0.1", "localhost", "[::1]"].includes(u.hostname);
  if (u.protocol !== "https:" && !(u.protocol === "http:" && lokalno)) throw new Error("streznik mora biti https:// (žeton ne sme po nešifrirani povezavi)");
  if (out.zeton.length < 32) throw new Error("zeton manjka ali je krajši od 32 znakov");
  if (out.lake && !path.isAbsolute(out.lake)) throw new Error("lake mora biti absolutna pot");
  return out;
}

// ---------- dnevnik (z vrtenjem) in stanje.json (atomarno) ----------
let DNEVNIK;
let STANJE;
/** Mapa za dnevnik.txt in stanje.json (Windows: delo\, edina mapa, kamor uporabnik evklid-lean sme pisati). */
export function nastaviMapo(mapa) {
  DNEVNIK = path.join(mapa, "dnevnik.txt");
  STANJE = path.join(mapa, "stanje.json");
}
nastaviMapo(arg("--mapa") ? path.resolve(arg("--mapa")) : TU);
const NAJVEC_DNEVNIKA = 1 << 20;

export function zapisi(sporocilo) {
  const vrstica = `${new Date().toISOString()} ${sporocilo}\n`;
  process.stdout.write(vrstica);
  try {
    if (fs.existsSync(DNEVNIK) && fs.statSync(DNEVNIK).size > NAJVEC_DNEVNIKA) {
      for (let k = 2; k >= 1; k--) if (fs.existsSync(`${DNEVNIK}.${k}`)) fs.renameSync(`${DNEVNIK}.${k}`, `${DNEVNIK}.${k + 1}`);
      fs.renameSync(DNEVNIK, `${DNEVNIK}.1`);
      if (fs.existsSync(`${DNEVNIK}.3`)) fs.rmSync(`${DNEVNIK}.3`);
    }
    fs.appendFileSync(DNEVNIK, vrstica);
  } catch {
    /* dnevnik ni nujen */
  }
}

const stanje = { razlicica: RAZLICICA, zacetek: new Date().toISOString(), stanje: "zaganjam", naloga: null, utrip: null, opravljenih: 0, zadnji: null, napake: [] };
function shraniStanje(sprememba = {}) {
  Object.assign(stanje, sprememba);
  const zac = `${STANJE}.${process.pid}.tmp`;
  try {
    fs.writeFileSync(zac, JSON.stringify(stanje, null, 2));
    fs.renameSync(zac, STANJE);
  } catch {
    // naslednjič (npr. protivirusni program drži datoteko); začasne ne pustimo
    try {
      fs.rmSync(zac, { force: true });
    } catch {
      /* nič */
    }
  }
}
function napaka(kje, e) {
  const s = `${kje}: ${e?.message || e}`.slice(0, 500);
  zapisi(`NAPAKA ${s}`);
  stanje.napake = [...stanje.napake, { cas: new Date().toISOString(), napaka: s }].slice(-10);
  shraniStanje({ stanje: "napaka" });
}

// ---------- Windows ne zaspi (kot rtx.py: ES_CONTINUOUS | ES_SYSTEM_REQUIRED; zaslon sme ugasniti) ----------
function budnost() {
  if (process.platform !== "win32") return;
  const ps = `Add-Type -Name P -Namespace W -MemberDefinition '[DllImport("kernel32.dll")] public static extern uint SetThreadExecutionState(uint f);'
while ($true) { [W.P]::SetThreadExecutionState(0x80000001) | Out-Null; if (-not (Get-Process -Id ${process.pid} -ErrorAction SilentlyContinue)) { exit }; Start-Sleep 60 }`;
  const exe = path.join(process.env.SystemRoot || "C:\\Windows", "System32", "WindowsPowerShell", "v1.0", "powershell.exe");
  try {
    const p = spawn(exe, ["-NoProfile", "-NonInteractive", "-Command", ps], { stdio: "ignore", windowsHide: true });
    p.on("error", (e) => napaka("budnost", e));
    process.on("exit", () => p.kill());
  } catch (e) {
    napaka("budnost", e);
  }
}

// ---------- strežnik ----------
async function klic(n, pot, telo) {
  const r = await fetch(`${n.streznik}/api/lean/delavec/${pot}`, {
    method: "POST",
    headers: { authorization: `Bearer ${n.zeton}`, "content-type": "application/json" },
    body: JSON.stringify(telo ?? {}),
    signal: AbortSignal.timeout(30000),
    redirect: "error", // žeton nikoli na drug naslov
  });
  if (r.status === 204) return null;
  const besedilo = await r.text();
  if (!r.ok) throw new Error(`${pot}: HTTP ${r.status} ${besedilo.slice(0, 200)}`);
  return JSON.parse(besedilo);
}

// ---------- Lean ----------
// Samo absolutna pot (nikoli golo »lake.exe«: Windows bi ga iskal najprej v cwd = projekt).
// Brez nastavitve: lake iz orodjarne v projekt/lean-toolchain neposredno (elan ga ne razreši in ne piše nič, kar
// uporabnik evklid-lean na Windows ne sme), sicer posrednik ELAN_HOME/bin/lake.
export function lakeExe(n, env = process.env) {
  const ime = process.platform === "win32" ? "lake.exe" : "lake";
  const elan = env.ELAN_HOME || path.join(os.homedir(), ".elan");
  let p = n.lake;
  if (!p) {
    let orodjarna = null;
    try {
      orodjarna = fs.readFileSync(path.join(n.projekt, "lean-toolchain"), "utf8").trim().replace(/\//g, "--").replace(/:/g, "---");
    } catch {
      /* ni datoteke */
    }
    const neposredno = orodjarna && /^[\w.-]+$/.test(orodjarna) ? path.join(elan, "toolchains", orodjarna, "bin", ime) : null;
    p = neposredno && fs.existsSync(neposredno) ? neposredno : path.join(elan, "bin", ime);
  }
  if (!path.isAbsolute(p) || !fs.existsSync(p)) throw new NiPripravljen(`lake ni nameščen (${p})`);
  return p;
}

/** Delavec ni pripravljen (namestitev), ne trditev: izid »napaka«, naloga gre nazaj v vrsto, delavec počaka. */
export class NiPripravljen extends Error {}

// Rok za eno nalogo: nastavitev, a vedno vsaj 60 s pred koncem najema na strežniku (rokMs), da izid ne dobi 409.
export const rokNaloge = (n, rokMs) => Math.max(10, Math.min(n.rokS, Number.isFinite(rokMs) ? Math.floor(rokMs / 1000) - 60 : n.rokS));

// Ubije Lean in vse njegove otroke (lake → lean). Linux: lastna skupina procesov (detached), kill(-pid).
// Windows: taskkill /T /F (drevo procesov).
function ubijDrevo(p) {
  try {
    if (process.platform === "win32") {
      const k = spawn(path.join(process.env.SystemRoot || "C:\\Windows", "System32", "taskkill.exe"), ["/PID", String(p.pid), "/T", "/F"], { stdio: "ignore", windowsHide: true });
      k.on("error", () => p.kill());
    } else process.kill(-p.pid, "SIGKILL");
  } catch {
    try {
      p.kill("SIGKILL");
    } catch {
      /* že končan */
    }
  }
}

// Okolje za Lean: samo kar rabi (brez žetonov, ključev in drugih spremenljivk iz okna).
function cistoOkolje() {
  const keep = ["PATH", "Path", "SystemRoot", "SYSTEMROOT", "TEMP", "TMP", "HOME", "USERPROFILE", "LOCALAPPDATA", "APPDATA", "ELAN_HOME", "LANG"];
  return Object.fromEntries(keep.filter((k) => process.env[k] != null).map((k) => [k, process.env[k]]));
}

/** Zažene Lean na trditvi. Vrne { izid, taktika?, aksiomi?, sporocilo, ms }. */
export async function preveriZLean(trditev, n, rokS = n.rokS) {
  const f = preveriTrditev(trditev);
  if (!f.ok) return { izid: "rejected", sporocilo: f.razlog, ms: 0 };
  const zacetek = Date.now();
  let lake;
  try {
    lake = lakeExe(n);
  } catch (e) {
    return { izid: "napaka", sporocilo: ocistiSporocilo(e.message, [n.projekt, os.homedir()]), ms: 0 };
  }
  const mapa = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-lean-"));
  const datoteka = path.join(mapa, "T.lean");
  try {
    fs.writeFileSync(datoteka, predloga(f.trditev));
    const args = ["env", "lean", "--json", `-M${n.pomnilnikMB}`, "-j2", datoteka];
    const opcije = { cwd: n.projekt, env: cistoOkolje(), windowsHide: true, stdio: ["ignore", "pipe", "pipe"], detached: process.platform !== "win32" };
    if (n.linuxUid && process.platform !== "win32") {
      fs.chmodSync(mapa, 0o755);
      Object.assign(opcije, { uid: n.linuxUid, gid: n.linuxUid });
    }
    const { izpis, ubit, napaka: napakaZagona } = await new Promise((resolve) => {
      let p;
      try {
        p = spawn(lake, args, opcije);
      } catch (e) {
        return resolve({ izpis: "", ubit: false, napaka: e });
      }
      let out = "";
      let err = "";
      let ubit = false;
      let rezerva = null;
      try {
        if (p.pid) os.setPriority(p.pid, os.constants.priority.PRIORITY_BELOW_NORMAL);
      } catch {
        /* ni nujno */
      }
      const rok = setTimeout(() => {
        ubit = true;
        ubijDrevo(p);
        // Če kill ne uspe (ali kak vnuk drži cev odprto), ne čakamo v nedogled: 30 s pozneje končamo vseeno.
        rezerva = setTimeout(() => resolve({ izpis: out, ubit: true }), 30000);
      }, rokS * 1000);
      p.stdout.on("data", (d) => {
        if (out.length < 4 << 20) out += d;
      });
      p.stderr.on("data", (d) => {
        if (err.length < 64 << 10) err += d;
      });
      p.on("error", (e) => {
        clearTimeout(rok);
        clearTimeout(rezerva);
        resolve({ izpis: "", ubit: false, napaka: e });
      });
      p.on("close", () => {
        clearTimeout(rok);
        clearTimeout(rezerva);
        resolve({ izpis: out + "\n" + err.split("\n").filter((v) => v.startsWith("{")).join("\n"), ubit, err });
      });
    });
    const ms = Date.now() - zacetek;
    if (napakaZagona) return { izid: "napaka", sporocilo: ocistiSporocilo(`Lean se ni zagnal: ${napakaZagona.message}`, [n.projekt, os.homedir()]), ms };
    const r = preberiIzpis(izpis);
    if (r.izid === "proved") return { ...r, ms };
    if (ubit) return { izid: "timeout", sporocilo: `Lean ni končal v ${rokS} s`, ms };
    return { ...r, sporocilo: ocistiSporocilo(r.sporocilo, [datoteka, mapa, n.projekt, os.homedir()]), ms };
  } finally {
    fs.rmSync(mapa, { recursive: true, force: true });
  }
}

// ---------- glavna zanka ----------
const spi = (ms) => new Promise((r) => setTimeout(r, ms));
/** Premor po napaki (omrežje, strežnik, namestitev): 30 s, 60 s … največ 5 min. */
export const naslednjiPremor = (premor) => Math.min(premor ? premor * 2 : 30, 300);


export async function enKrog(n) {
  const naloga = await klic(n, "naloga", { razlicica: RAZLICICA, stanje: "caka" });
  shraniStanje({ utrip: new Date().toISOString() });
  if (!naloga) return false;
  if (typeof naloga.id !== "string" || !/^ln_[0-9a-f]{32}$/.test(naloga.id) || typeof naloga.najem !== "string") throw new Error("neveljavna naloga s strežnika");
  zapisi(`naloga ${naloga.id}: ${JSON.stringify(String(naloga.trditev).slice(0, 120))}`); // JSON: nova vrstica ne ponaredi dnevnika
  shraniStanje({ stanje: "dela", naloga: naloga.id });
  let izid;
  // Med delom utrip vsako minuto, da aplikacija ve, da je delavec živ.
  const utrip = setInterval(() => klic(n, "utrip", { razlicica: RAZLICICA, stanje: "dela" }).catch((e) => napaka("utrip", e)), n.utripS * 1000);
  try {
    izid = await preveriZLean(naloga.trditev, n, rokNaloge(n, naloga.rokMs));
  } catch (e) {
    // napaka delavca (disk, začasna mapa …) ni izid trditve
    izid = { izid: "napaka", sporocilo: ocistiSporocilo(`delavec: ${e.message}`), ms: 0 };
  } finally {
    clearInterval(utrip);
  }
  try {
    await klic(n, "rezultat", { id: naloga.id, najem: naloga.najem, razlicica: RAZLICICA, ...izid });
  } catch (e) {
    // 409: najem je potekel (strežnik je nalogo dal drugemu poskusu). Izid zavržemo, delavec dela naprej brez premora.
    if (!/HTTP 409/.test(e.message)) throw e;
    zapisi(`naloga ${naloga.id}: najem potekel, izid ${izid.izid} zavržen`);
  }
  zapisi(`naloga ${naloga.id}: ${izid.izid}${izid.taktika ? ` (${izid.taktika})` : ""}, ${izid.ms} ms`);
  if (izid.izid === "napaka") {
    shraniStanje({ naloga: null });
    throw new NiPripravljen(`delavec ni pripravljen: ${izid.sporocilo}`); // → premor v glavni zanki
  }
  shraniStanje({ stanje: "caka", naloga: null, opravljenih: stanje.opravljenih + 1, zadnji: { id: naloga.id, izid: izid.izid, cas: new Date().toISOString() } });
  return true;
}

// Prvi zagon (zazeni.bat): nastavitve.json iz primera z novim naključnim žetonom; žeton se izpiše za Render.
export function pripravi(potNastavitev) {
  if (fs.existsSync(potNastavitev)) return null;
  const primer = JSON.parse(fs.readFileSync(path.join(TU, "nastavitve.primer.json"), "utf8"));
  const zeton = crypto.randomBytes(32).toString("hex");
  fs.writeFileSync(potNastavitev, JSON.stringify({ ...primer, zeton }, null, 2) + "\n");
  return zeton;
}

async function glavna() {
  const potNastavitev = path.resolve(arg("--nastavitve") || path.join(TU, "nastavitve.json"));
  if (process.argv.includes("--pripravi")) {
    const z = pripravi(potNastavitev);
    if (z) console.log(`\n  NOV ŽETON (vpiši ga na Render kot EVKLID_LEAN_TOKEN, glej NAVODILA.md, 5. korak; do takrat je HTTP 404 v dnevniku pričakovan):\n\n  ${z}\n`);
    return;
  }
  process.on("uncaughtException", (e) => napaka("nepričakovano", e));
  process.on("unhandledRejection", (e) => napaka("nepričakovano", e));
  budnost();
  zapisi(`${RAZLICICA} začenja (${process.platform}, Node ${process.versions.node})`);
  let premor = 0;
  for (;;) {
    try {
      const n = naloziNastavitve(potNastavitev);
      const delal = await enKrog(n); // vsak klic »naloga« je tudi utrip
      premor = 0;
      shraniStanje({ stanje: "caka" });
      if (process.argv.includes("--enkrat") && !delal) return;
      if (!delal) await spi(n.premorS * 1000);
    } catch (e) {
      napaka("krog", e);
      if (process.argv.includes("--enkrat")) return void (process.exitCode = 1);
      premor = naslednjiPremor(premor);
      await spi(premor * 1000);
    }
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) glavna();

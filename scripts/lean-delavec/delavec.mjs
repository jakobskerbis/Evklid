#!/usr/bin/env node
// Delavec Lean na j-jevem prenosniku (docs/lean.md, L5; navodila: NAVODILA.md v tej mapi). Samo izhodna povezava:
// vsakih nekaj sekund vpraša evklid.app za nalogo (matematična trditev + id), trditev znova preveri s filtrom
// (trditev.mjs), sam sestavi datoteko Lean iz stalne predloge (lean.mjs), zažene Lean z rokom in mejo pomnilnika in
// vrne izid. Lean teče neposredno (lean.exe z LEAN_PATH, shranjenim ob namestitvi; brez lake in git) s trdo mejo
// pomnilnika (Windows: Job Object v omeji.ps1, Linux: ulimit -v). Nič ne posluša, nikoli se ne ustavi (vsaka napaka gre v dnevnik, nato premor), piše stanje.json.
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
    pomnilnikMB: Math.min(Math.max(Number(n.pomnilnikMB) || 6144, 2048), 65536), // Lean -M (mehka meja)
    // Trda meja (Windows: zasedeni pomnilnik procesa in celega Joba v Job Object, 10 GB, da 16 GB prenosnik ne
    // zamenjuje na disk; Linux: navidezni naslovni prostor, ki vključuje preslikane .olean Mathliba, okoli 15 GB):
    // Lean se ob prekoračitvi konča.
    trdaMejaMB: Math.min(Math.max(Number(n.trdaMejaMB) || (process.platform === "win32" ? 10240 : 24576), 4096), 131072),
    projekt: path.resolve(path.dirname(pot), n.projekt || "projekt"),
    // lean.json ({ lean, leanPath }): zapiše ga namestitev (`lake env node delavec.mjs --shrani-lean …`, kot skrbnik)
    leanJson: path.resolve(path.dirname(pot), n.leanJson || path.join("orodja", "lean.json")),
    // Samo Linux: Lean kot ta uporabnik (npr. 65534 = nobody), če delavec teče kot root. Windows: glej docs/lean.md.
    linuxUid: Number.isInteger(n.linuxUid) && n.linuxUid > 0 ? n.linuxUid : null,
  };
  const u = new URL(out.streznik);
  const lokalno = ["127.0.0.1", "localhost", "[::1]"].includes(u.hostname);
  if (u.protocol !== "https:" && !(u.protocol === "http:" && lokalno)) throw new Error("streznik mora biti https:// (žeton ne sme po nešifrirani povezavi)");
  if (out.zeton.length < 32) throw new Error("zeton manjka ali je krajši od 32 znakov");
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
// Lean in LEAN_PATH iz lean.json (ali n.lean / n.leanPath). Brez lake in git med delom: lake bi kot evklid-lean
// klical git na mapah skrbnika (»dubious ownership«) in pisal v projekt\, kamor ne sme. Samo absolutna pot do Leana
// (nikoli golo »lean.exe«: Windows bi ga iskal najprej v trenutni mapi).
export function leanOrodje(n) {
  let { lean, leanPath } = n;
  if (!lean || !leanPath) {
    try {
      ({ lean, leanPath } = JSON.parse(fs.readFileSync(n.leanJson, "utf8")));
    } catch {
      throw new NiPripravljen(`lean.json manjka ali je pokvarjen (${n.leanJson}); znova zaženi namestitev`);
    }
  }
  if (typeof lean !== "string" || !path.isAbsolute(lean) || !fs.existsSync(lean)) throw new NiPripravljen(`Lean ni nameščen (${lean})`);
  if (typeof leanPath !== "string" || !leanPath || leanPath.split(path.delimiter).some((d) => !path.isAbsolute(d))) throw new NiPripravljen("LEAN_PATH v lean.json ni veljaven");
  return { lean, leanPath };
}

/** Namestitev (znotraj `lake env`): zapiše lean.json iz LEAN in LEAN_PATH, ki ju nastavi lake. */
export function shraniLean(pot, env = process.env) {
  const lean = env.LEAN;
  const leanPath = env.LEAN_PATH;
  if (!lean || !path.isAbsolute(lean) || !fs.existsSync(lean)) throw new Error(`LEAN ni nastavljen (zaženi znotraj »lake env«)`);
  if (!leanPath) throw new Error("LEAN_PATH ni nastavljen (zaženi znotraj »lake env«)");
  fs.mkdirSync(path.dirname(pot), { recursive: true });
  fs.writeFileSync(pot, JSON.stringify({ lean, leanPath }, null, 2) + "\n");
}

/**
 * Ukaz s trdo mejo pomnilnika: [program, argumenti, dodatno okolje]. Windows: powershell + omeji.ps1 (Job Object z
 * mejo pomnilnika procesa in Joba, največ 3 procesi, KILL_ON_JOB_CLOSE; Lean je njegov otrok; ukaz gre po okolju, ker PowerShell
 * argumente z »-« bere kot svoje). Linux/macOS: sh z »ulimit -v« (RLIMIT_AS), nato exec Leana (isti pid).
 */
export function ukazZMejo(lean, args, mejaMB, platforma = process.platform) {
  if (platforma === "win32") {
    const ps = path.join(process.env.SystemRoot || "C:\\Windows", "System32", "WindowsPowerShell", "v1.0", "powershell.exe");
    return [ps, ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-File", path.join(TU, "omeji.ps1")], { EVKLID_MEJA_MB: String(mejaMB), EVKLID_LEAN_UKAZ: JSON.stringify([lean, ...args]) }];
  }
  return ["/bin/sh", ["-c", 'ulimit -v "$1" || exit 125; shift; exec "$@"', "sh", String(mejaMB * 1024), lean, ...args], {}];
}

/** Delavec ni pripravljen (namestitev), ne trditev: izid »napaka«, naloga gre nazaj v vrsto, delavec počaka. */
export class NiPripravljen extends Error {}

// Rok za eno nalogo: nastavitev, a vedno vsaj 60 s pred koncem najema na strežniku (rokMs), da izid ne dobi 409.
export const rokNaloge = (n, rokMs) => Math.max(10, Math.min(n.rokS, Number.isFinite(rokMs) ? Math.floor(rokMs / 1000) - 60 : n.rokS));

// Ubije Lean in vse njegove otroke (sh/powershell → lean). Linux: lastna skupina procesov (detached), kill(-pid).
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

// Okolje za Lean: samo kar rabi (brez žetonov, ključev in drugih spremenljivk iz okna) in LEAN_PATH. Windows: še
// spremenljivke sistema brez skrivnosti, ki jih rabita PowerShell in Add-Type (csc.exe) v omeji.ps1.
function cistoOkolje(leanPath) {
  const keep = ["PATH", "Path", "SystemRoot", "SYSTEMROOT", "windir", "SystemDrive", "ComSpec", "PSModulePath", "PROCESSOR_ARCHITECTURE", "NUMBER_OF_PROCESSORS", "TEMP", "TMP", "HOME", "USERPROFILE", "LOCALAPPDATA", "APPDATA", "LANG"];
  return { ...Object.fromEntries(keep.filter((k) => process.env[k] != null).map((k) => [k, process.env[k]])), LEAN_PATH: leanPath };
}

/** Zažene Lean na trditvi. Vrne { izid, taktika?, aksiomi?, sporocilo, ms }. */
export async function preveriZLean(trditev, n, rokS = n.rokS) {
  const f = preveriTrditev(trditev);
  if (!f.ok) return { izid: "rejected", sporocilo: f.razlog, ms: 0 };
  const zacetek = Date.now();
  let orodje;
  try {
    orodje = leanOrodje(n);
  } catch (e) {
    return { izid: "napaka", sporocilo: ocistiSporocilo(e.message, [n.projekt, os.homedir()]), ms: 0 };
  }
  const mapa = fs.mkdtempSync(path.join(os.tmpdir(), "evklid-lean-"));
  const datoteka = path.join(mapa, "T.lean");
  try {
    fs.writeFileSync(datoteka, predloga(f.trditev));
    const [ukaz, args, dodatno] = ukazZMejo(orodje.lean, ["--json", `-M${n.pomnilnikMB}`, "-j2", datoteka], n.trdaMejaMB);
    const opcije = { cwd: mapa, env: { ...cistoOkolje(orodje.leanPath), ...dodatno }, windowsHide: true, stdio: ["ignore", "pipe", "pipe"], detached: process.platform !== "win32" };
    if (n.linuxUid && process.platform !== "win32") {
      fs.chmodSync(mapa, 0o755);
      Object.assign(opcije, { uid: n.linuxUid, gid: n.linuxUid });
    }
    const { izpis, ubit, err = "", koda = null, napaka: napakaZagona } = await new Promise((resolve) => {
      let p;
      try {
        p = spawn(ukaz, args, opcije);
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
      p.on("close", (koda) => {
        clearTimeout(rok);
        clearTimeout(rezerva);
        resolve({ izpis: out + "\n" + err.split("\n").filter((v) => v.startsWith("{")).join("\n"), ubit, err, koda });
      });
    });
    const ms = Date.now() - zacetek;
    if (napakaZagona) return { izid: "napaka", sporocilo: ocistiSporocilo(`Lean se ni zagnal: ${napakaZagona.message}`, [n.projekt, os.homedir()]), ms };
    const poti = [datoteka, mapa, n.projekt, os.homedir()];
    const r = preberiIzpis(izpis);
    if (r.izid === "proved") return { ...r, ms };
    // Preverba tipov je prva vrstica: »rejected« velja tudi, če je Lean pozneje presegel rok.
    if (r.izid === "rejected") return { ...r, sporocilo: ocistiSporocilo(r.sporocilo, poti), ms };
    if (ubit) return { izid: "timeout", sporocilo: `Lean ni končal v ${rokS} s`, ms };
    // Trda meja pomnilnika (GMP ali Lean ne dobi pomnilnika): trditev je pretežka, ni napaka namestitve.
    if (/Cannot allocate memory|out of memory|bad_alloc|memory limit exceeded/i.test(err)) return { izid: "timeout", sporocilo: `Lean je presegel mejo pomnilnika (${n.trdaMejaMB} MB)`, ms };
    // »napaka« (namestitev): zraven izhodna koda in konec stderr (omeji.ps1 125/126, manjkajoč Mathlib …) za dnevnik.
    const rep = err.split("\n").filter((v) => v.trim() && !v.startsWith("{")).join(" | ").slice(-600);
    const sporocilo = r.izid === "napaka" ? `${r.sporocilo}; izhod ${koda}${rep ? `; stderr: ${rep}` : ""}` : r.sporocilo;
    return { ...r, sporocilo: ocistiSporocilo(sporocilo, poti), ms };
  } finally {
    try {
      fs.rmSync(mapa, { recursive: true, force: true });
    } catch (e) {
      // EBUSY: Lean po rezervnem roku še drži T.lean; mapa ostane v delo\tmp, izid ostane (npr. »timeout«)
      zapisi(`začasne mape ni bilo mogoče izbrisati: ${e.code || e.message}`);
    }
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

// Ob zagonu: ena znana trditev z Leanom (kot evklid-lean, z mejo pomnilnika). Izid v dnevniku in stanje.preizkus.
async function preizkus(potNastavitev) {
  try {
    const r = await preveriZLean("(2:ℝ) + 2 = 4", naloziNastavitve(potNastavitev));
    zapisi(`preizkus Lean: ${r.izid}${r.izid === "proved" ? "" : ` (${r.sporocilo})`}, ${r.ms} ms`);
    shraniStanje({ preizkus: { izid: r.izid, cas: new Date().toISOString() } });
  } catch (e) {
    napaka("preizkus", e);
  }
}

async function glavna() {
  const potNastavitev = path.resolve(arg("--nastavitve") || path.join(TU, "nastavitve.json"));
  if (arg("--shrani-lean")) {
    shraniLean(path.resolve(arg("--shrani-lean")));
    console.log("  lean.json zapisan");
    return;
  }
  if (process.argv.includes("--pripravi")) {
    const z = pripravi(potNastavitev);
    if (z) console.log(`\n  NOV ŽETON (vpiši ga na Render kot EVKLID_LEAN_TOKEN, glej NAVODILA.md, 5. korak; do takrat je HTTP 404 v dnevniku pričakovan):\n\n  ${z}\n`);
    return;
  }
  process.on("uncaughtException", (e) => napaka("nepričakovano", e));
  process.on("unhandledRejection", (e) => napaka("nepričakovano", e));
  budnost();
  zapisi(`${RAZLICICA} začenja (${process.platform}, Node ${process.versions.node})`);
  if (!process.argv.includes("--enkrat")) await preizkus(potNastavitev);
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

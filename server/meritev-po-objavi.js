// Samodejna ciljna meritev natančnosti po vsaki objavi na Render (j 2026-11-12).
// Isto, kar je prej j ročno zagnal v Render Shell:
//   node scripts/primerjava-modelov.js --s-preverjanjem --samo <id> --ponovi 4 --pogoj s --max-usd 1
// samo za lekcije, ki jih je ta objava spremenila (in za primere zadnjega kroga natančnosti, če se je spremenil
// prompt ali sprotno preverjanje). Izid bere skrbnik na GET /api/admin/meritev-po-objavi.
//
// STROŠEK AI – varovalke (vse v odlociZagon in zaženi, vsaka s testom v test/meritev-po-objavi.test.js):
//   1. največ MAX_ZAGON_USD (1 $) na zagon: skripta dobi --max-usd 1 in se sama ustavi pred mejo;
//   2. največ MAX_TEDEN_USD (15 $) na teden ISO (UTC): pred zagonom se rezervira cel 1 $; zagon se zavrne, če bi
//      rezervacija presegla 15 $. Po koncu se rezervacija zamenja z dejanskim stroškom; če proces pade ali ga
//      objava ustavi, ostane rezerviran cel 1 $ (nikoli manj, kot je bilo morda porabljeno);
//   3. največ en zagon na objavo (RENDER_GIT_COMMIT); objava se zapiše PRED zagonom, zato ponovni zagon strežnika
//      iste objave (sesutje, ponovni zagon) meritve ne ponovi;
//   4. le na Render z EVKLID_MERITEV_PO_OBJAVI=1 (render.yaml), nikoli lokalno, v CI, v testih ali v preizkusnem načinu;
//   5. brez spremenjenih lekcij ali prompta ni zagona (in ni stroška).
// Stanje: <mapa baze>/meritev-po-objavi.json (na Render /var/data), dnevniki zagonov v <mapa baze>/meritve-po-objavi/.
// Učenčevih podatkov tu ni: meritev uporablja rešene primere iz lekcij in izmišljenega učenca v pomnilniški bazi.
import "./env.js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { BRAND } from "./brand.js";

export const MAX_ZAGON_USD = 1;
export const MAX_TEDEN_USD = 15;
export const MAX_PRIMEROV = 4; // id-jev na zagon (vsak 4×): več se v 1 $ ne izide za uravnotežen izid
export const PONOVI = 4;
const ZGODOVINA = 30; // zadnjih zagonov v stanju
const DNEVNIKI = 20; // zadnjih dnevnikov na disku

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
// Datoteke, katerih sprememba vpliva na vse odgovore: meri se zadnji krog natančnosti (docs/spremembe-prompta.md).
export const PROMPT_DATOTEKE = ["prompts/system_prompt.md", "server/prompt.js", "server/live-check.js"];

export const dataDir = (env = process.env) => path.dirname(path.resolve(ROOT, env.EVKLID_DB || `data/${BRAND.slug}.db`));
export const stateFile = (env = process.env) => path.join(dataDir(env), "meritev-po-objavi.json");

// Teden ISO 8601 v UTC, npr. »2026-W46« (ponedeljek–nedelja).
export function isoTeden(d = new Date()) {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dan = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - dan); // četrtek istega tedna določa leto
  const leto = t.getUTCFullYear();
  const teden = Math.ceil(((t - Date.UTC(leto, 0, 1)) / 86400000 + 1) / 7);
  return `${leto}-W${String(teden).padStart(2, "0")}`;
}

// Ali sme ta proces sploh kdaj zagnati meritev (le Render z izrecnim vklopom).
export function vklopljeno(env = process.env, { mock = false } = {}) {
  if (env.EVKLID_MERITEV_PO_OBJAVI !== "1") return false;
  if (!env.RENDER) return false; // Render nastavi RENDER=true; lokalno in v CI ga ni
  if (env.CI || env.GITHUB_ACTIONS) return false;
  if (env.NODE_ENV === "test") return false;
  if (mock || !env.ANTHROPIC_API_KEY) return false;
  return true;
}

// Odtis (sha1) vsake lekcije in datotek prompta: tako vemo, kaj je ta objava spremenila, brez gita na strežniku.
export function odtisi(root = ROOT) {
  const out = {};
  const sha = (f) => crypto.createHash("sha1").update(fs.readFileSync(f)).digest("hex").slice(0, 16);
  const dir = path.join(root, "content/lessons");
  for (const p of fs.existsSync(dir) ? fs.readdirSync(dir) : []) {
    const full = path.join(dir, p);
    if (!fs.statSync(full).isDirectory()) continue;
    for (const f of fs.readdirSync(full).filter((f) => f.endsWith(".md"))) out[`content/lessons/${p}/${f}`] = sha(path.join(full, f));
  }
  for (const f of PROMPT_DATOTEKE) if (fs.existsSync(path.join(root, f))) out[f] = sha(path.join(root, f));
  return out;
}

// Dodane ali spremenjene poti (izbrisane ne štejejo: ni česa meriti).
export const spremenjene = (prej, zdaj) => Object.keys(zdaj).filter((k) => prej[k] !== zdaj[k]).sort();

// Id-ji zadnje ciljne ponovitve: prvi »--samo <id,id>« pod najnovejšim naslovom »natančnost, krog N« (datoteka je od novega k staremu).
export function idjiKroga(md) {
  for (const odsek of String(md).split(/^## /m).slice(1)) {
    if (!/^[^\n]*natančnost, krog/i.test(odsek)) continue;
    const m = odsek.match(/--samo\s+([A-Za-z0-9_\-/,]+)/);
    if (m) return m[1].split(",").filter(Boolean);
  }
  return [];
}

// Kaj meriti: spremenjene lekcije + (ob spremembi prompta) id-ji zadnjega kroga; le merljive, največ MAX_PRIMEROV.
export function izberiIdje(poti, { krog = [], merljiv = () => true, max = MAX_PRIMEROV } = {}) {
  const lekcije = poti.map((p) => p.match(/^content\/lessons\/([^/]+\/[^/]+)\.md$/)?.[1]).filter(Boolean);
  const prompt = poti.some((p) => PROMPT_DATOTEKE.includes(p));
  const vsi = [...new Set([...(prompt ? krog : []), ...lekcije])];
  return vsi.filter((id) => merljiv(id)).slice(0, max);
}

// Tedenska poraba: novi teden začne pri 0.
export function porabaTedna(stanje, teden) {
  return stanje.teden === teden ? Number(stanje.porabljeno_usd) || 0 : 0;
}

// Ali sme ta objava zagnati meritev. Vrne { ok, razlog }.
export function odlociZagon(stanje, { objava, teden, idji, maxZagon = MAX_ZAGON_USD, maxTeden = MAX_TEDEN_USD }) {
  if (!objava) return { ok: false, razlog: "neznana objava" };
  if ((stanje.objave || []).includes(objava)) return { ok: false, razlog: "ta objava je že obdelana (največ en zagon na objavo)" };
  if (!idji.length) return { ok: false, razlog: "objava ni spremenila merljivih lekcij ne prompta" };
  const poraba = porabaTedna(stanje, teden);
  if (poraba + maxZagon > maxTeden + 1e-9)
    return { ok: false, razlog: `tedenska meja: porabljeno ${poraba.toFixed(2)} $ od ${maxTeden} $, zagon rezervira ${maxZagon} $` };
  return { ok: true, razlog: "" };
}

export function preberiStanje(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return {};
  }
}
function zapisiStanje(file, s) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(s, null, 1));
  fs.renameSync(tmp, file);
}

// Privzeti zagon skripte: ločen proces z najnižjo prednostjo (nice 19), izpis v dnevnik na disku.
function zaženiSkripto({ idji, maxUsd, izidFile, logFile, root }) {
  return new Promise((resolve) => {
    const fd = fs.openSync(logFile, "a");
    const args = ["--disable-warning=ExperimentalWarning", "scripts/primerjava-modelov.js", "--s-preverjanjem", "--samo", idji.join(","), "--ponovi", String(PONOVI), "--pogoj", "s", "--max-usd", String(maxUsd), "--izid-json", izidFile];
    const child = spawn(process.execPath, args, { cwd: root, stdio: ["ignore", fd, fd], env: { ...process.env, EVKLID_MERITEV_PO_OBJAVI: "0" } });
    try {
      os.setPriority(child.pid, 19);
    } catch {}
    child.unref();
    child.on("error", (e) => (fs.closeSync(fd), resolve({ code: -1, napaka: String(e?.message || e) })));
    child.on("exit", (code) => (fs.closeSync(fd), resolve({ code })));
  });
}

// En poskus za to objavo. Vse odločitve so zapisane v stanje (zgodovina), da jih skrbnik vidi brez lupine.
export async function zaženi({
  env = process.env,
  root = ROOT,
  file = stateFile(env),
  now = () => new Date(),
  merljiv,
  zagon = zaženiSkripto,
  log = console.log,
} = {}) {
  const stanje = preberiStanje(file);
  const teden = isoTeden(now());
  if (stanje.teden !== teden) Object.assign(stanje, { teden, porabljeno_usd: 0 });
  // Zagon, ki ga je prekinila prejšnja objava: rezervacija (cel 1 $) ostane štet.
  for (const z of stanje.zgodovina || []) if (z.stanje === "teče") Object.assign(z, { stanje: "prekinjeno", strosek_usd: z.rezervirano_usd });

  const zdaj = odtisi(root);
  const objava = env.RENDER_GIT_COMMIT || `odtis-${crypto.createHash("sha1").update(JSON.stringify(zdaj)).digest("hex").slice(0, 12)}`;
  if ((stanje.objave || []).includes(objava)) {
    zapisiStanje(file, stanje);
    return { ok: false, razlog: "ta objava je že obdelana (največ en zagon na objavo)" };
  }
  const prvic = !stanje.odtisi;
  const poti = prvic ? [] : spremenjene(stanje.odtisi, zdaj);
  let krog = [];
  try {
    krog = idjiKroga(fs.readFileSync(path.join(root, "docs/spremembe-prompta.md"), "utf8"));
  } catch {}
  const idji = izberiIdje(poti, { krog, merljiv: merljiv || (await privzetoMerljiv(root)) });
  const odl = prvic ? { ok: false, razlog: "prvi zagon: shranjeno izhodišče za primerjavo naslednjih objav" } : odlociZagon(stanje, { objava, teden, idji });

  // Objava je obdelana že zdaj (pred zagonom): ponovni zagon strežnika iste objave ne meri znova.
  stanje.objave = [...(stanje.objave || []), objava].slice(-50);
  stanje.odtisi = zdaj;
  const vnos = { cas: now().toISOString(), objava: objava.slice(0, 12), teden, spremenjenih: poti.length, idji, stanje: odl.ok ? "teče" : "preskočeno", razlog: odl.razlog };
  stanje.zgodovina = [vnos, ...(stanje.zgodovina || [])].slice(0, ZGODOVINA);
  if (!odl.ok) {
    zapisiStanje(file, stanje);
    log(`[evklid] meritev po objavi: ne zaženem (${odl.razlog})`);
    return odl;
  }

  // Rezervacija celega zagona pred klicem: tedenska meja drži tudi, če proces pade.
  vnos.rezervirano_usd = MAX_ZAGON_USD;
  stanje.porabljeno_usd = porabaTedna(stanje, teden) + MAX_ZAGON_USD;
  zapisiStanje(file, stanje);
  const mapa = path.join(path.dirname(file), "meritve-po-objavi");
  fs.mkdirSync(mapa, { recursive: true });
  const ime = `${vnos.cas.replace(/[:.]/g, "-")}-${vnos.objava}`;
  const izidFile = path.join(mapa, `${ime}.json`);
  vnos.dnevnik = `${ime}.log`;
  log(`[evklid] meritev po objavi: ${idji.join(", ")} (${PONOVI}×, največ ${MAX_ZAGON_USD} $; ta teden že ${(stanje.porabljeno_usd - MAX_ZAGON_USD).toFixed(2)} $)`);
  const r = await zagon({ idji, maxUsd: MAX_ZAGON_USD, izidFile, logFile: path.join(mapa, vnos.dnevnik), root });

  // Dejanski strošek nadomesti rezervacijo le, če ga je skripta zapisala; sicer ostane cel 1 $.
  const s2 = preberiStanje(file);
  const v2 = (s2.zgodovina || []).find((z) => z.cas === vnos.cas && z.objava === vnos.objava) || vnos;
  let izid = null;
  try {
    izid = JSON.parse(fs.readFileSync(izidFile, "utf8"));
  } catch {}
  const dejansko = Number(izid?.strosek_usd);
  if (izid && Number.isFinite(dejansko) && dejansko >= 0) {
    if (s2.teden === teden) s2.porabljeno_usd = Math.max(0, (Number(s2.porabljeno_usd) || 0) - MAX_ZAGON_USD + dejansko);
    Object.assign(v2, { stanje: r.code === 0 ? "končano" : "napaka", strosek_usd: Number(dejansko.toFixed(4)), ustavljeno_ob_meji: !!izid.ustavljeno_ob_meji, primeri: izid.primeri });
  } else Object.assign(v2, { stanje: "napaka", strosek_usd: MAX_ZAGON_USD, razlog: `skripta ni zapisala izida (izhod ${r.code}${r.napaka ? `, ${r.napaka}` : ""}); šteje cel ${MAX_ZAGON_USD} $` });
  zapisiStanje(file, s2);
  pocistiDnevnike(mapa);
  log(`[evklid] meritev po objavi: ${v2.stanje}, strošek ${v2.strosek_usd} $; ta teden ${(Number(s2.porabljeno_usd) || 0).toFixed(2)} $ od ${MAX_TEDEN_USD} $`);
  return { ok: true, vnos: v2 };
}

function pocistiDnevnike(mapa) {
  try {
    const f = fs.readdirSync(mapa).filter((x) => x.endsWith(".log")).sort();
    for (const x of f.slice(0, Math.max(0, f.length - DNEVNIKI))) {
      fs.rmSync(path.join(mapa, x), { force: true });
      fs.rmSync(path.join(mapa, x.replace(/\.log$/, ".json")), { force: true });
    }
  } catch {}
}

// Merljiva lekcija: tema obstaja in ima vsaj en rešeni primer (isti pogoj kot pick() v primerjava-modelov.js),
// sicer bi skripta ob neznanem id-ju končala brez meritve.
async function privzetoMerljiv(root) {
  const { getTopic } = await import("./curriculum.js");
  const { examplesOf } = await import("../scripts/meritev-natancnosti.js");
  return (id) => {
    const f = path.join(root, "content/lessons", `${id}.md`);
    try {
      return !!getTopic(id) && fs.existsSync(f) && examplesOf(f).length > 0;
    } catch {
      return false;
    }
  };
}

// Ob zagonu strežnika: čez nekaj minut (EVKLID_MERITEV_ZAMIK_MIN, privzeto 5) v ozadju, da ne tekmuje z učenci ob zagonu.
export function nacrtujMeritevPoObjavi({ env = process.env, mock = false, log = console.log } = {}) {
  if (!vklopljeno(env, { mock })) return false;
  const min = Number(env.EVKLID_MERITEV_ZAMIK_MIN);
  const zamik = (Number.isFinite(min) && min >= 0 ? min : 5) * 60_000;
  setTimeout(() => {
    // Vse v try: zavrnjena obljuba iz setTimeout bi ustavila strežnik.
    zaženi({ env, log }).catch((e) => console.warn(`[evklid] meritev po objavi: ${e?.message || e}`));
  }, zamik).unref();
  return true;
}

// Skrbnik: GET /api/admin/meritev-po-objavi (besedilo) ali ?json=1. Brez prijave skrbnika 403.
export function povzetekBesedilo(s) {
  const teden = isoTeden();
  const vrstice = [
    "Meritev natančnosti po objavi",
    `Ta teden (${teden}, UTC): ${porabaTedna(s, teden).toFixed(2)} $ od ${MAX_TEDEN_USD} $; en zagon največ ${MAX_ZAGON_USD} $.`,
    "",
  ];
  const zg = s.zgodovina || [];
  if (!zg.length) vrstice.push("Še ni bilo nobenega zagona.");
  for (const z of zg) {
    vrstice.push(`${z.cas.slice(0, 16).replace("T", " ")} UTC · objava ${z.objava} · ${z.stanje}${z.strosek_usd != null ? ` · ${z.strosek_usd} $` : ""}`);
    if (z.razlog) vrstice.push(`  ${z.razlog}`);
    if (z.idji?.length && z.stanje !== "preskočeno") vrstice.push(`  primeri: ${z.idji.join(", ")}`);
    for (const p of z.primeri || []) {
      vrstice.push(`  - ${p.id}: napaka ${p.napaka}, manjša ${p.manjsa_napaka}, pravilno ${p.pravilno} od ${p.od}`);
      for (const r of p.razlogi || []) vrstice.push(`      ${r}`);
    }
    if (z.ustavljeno_ob_meji) vrstice.push(`  ustavljeno ob meji ${MAX_ZAGON_USD} $ (niso vsi odgovori ocenjeni)`);
    if (z.dnevnik) vrstice.push(`  dnevnik: meritve-po-objavi/${z.dnevnik}`);
  }
  return vrstice.join("\n") + "\n";
}

export function mountMeritevPoObjavi(app, { isAdmin, file = () => stateFile() }) {
  app.get("/api/admin/meritev-po-objavi", (req, res) => {
    if (!isAdmin(req)) return res.status(403).json({ error: "Samo za skrbnika." });
    const s = preberiStanje(file());
    const { odtisi: _o, objave: _b, ...javno } = s;
    res.set("Cache-Control", "no-store");
    if (req.query.json) return res.json({ ...javno, porabljeno_ta_teden_usd: porabaTedna(s, isoTeden()), meja_zagon_usd: MAX_ZAGON_USD, meja_teden_usd: MAX_TEDEN_USD });
    res.type("text/plain; charset=utf-8").send(povzetekBesedilo(s));
  });
}

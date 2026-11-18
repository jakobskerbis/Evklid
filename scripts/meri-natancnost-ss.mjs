// Meritev pravilnosti CELEGA Evklidovega odgovora na srednješolski snovi (j, 18. 11. 2026: pred vabili v pilot
// so prvi uporabniki gimnazijci). Ovoj okoli scripts/primerjava-modelov.js --s-preverjanjem --groups ss: isti rešeni
// primeri iz lekcij kot v polni meritvi (docs/meritve/natancnost-*.json, isto seme), a samo stopnja »srednja šola«
// (~30 primerov od 100), privzeto samo cel odgovor s preverjanjem (kot ga vidi učenec), ocenjevalec Opus.
// Polna meritev (~5 $) ne gre skozi delovni tok Meritev (največ 2 $ na zagon); ta del je ocenjen na ~1,7 $ (suhi tek).
// Zagon: GitHub Actions > Meritev > Run workflow, skripta scripts/meri-natancnost-ss.mjs (docs/stroski-ai.md).
//   node scripts/meri-natancnost-ss.mjs [--max-usd 2] [--stopnje ss] [--del 1-2] [--primeri 10,13 --ponovi 3] [--oba] [--suho]
//   --stopnje ss,tek   stopnje kot --groups v primerjava-modelov.js (os, ss, tek, uni); privzeto ss
//   --del 1-2          le del izbora (vsak drugi primer), če vsi ne gredo pod mejo enega zagona; nato --del 2-2
//   --primeri 10,13    le primeri s temi zaporednimi številkami izbora (izpiše jih --suho; veljajo za iste --stopnje
//                      in isti commit); ne skupaj z --del
//   --ponovi 3         vsak izbrani primer N-krat (1–5), za preverbo, ali se napaka ponavlja; samo skupaj z --primeri
//   --oba              tudi pogoj »sam model, brez preverjanja« (privzeto samo cel odgovor s preverjanjem, kot ga vidi učenec)
//   --suho             samo izbor primerov in ocena stroška, brez klica modela (0 $)
// Ustavi se, preden bi strošek presegel --max-usd (mejo uveljavi primerjava-modelov.js). Ne piše v bazo aplikacije
// in ne v docs/ (izid ni meritev za objavo: stran /zakaj-evklid ostane pri zadnji polni meritvi).
// Izid: povzetek v dnevniku, vrstice po primerih v data/meri-natancnost-ss.json (artefakt »meritev«).
import fs from "node:fs";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const arg = (name, d) => {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : d;
};
// Neznan argument ali oblika --ime=vrednost (delovni tok dovoli znak =) bi se tiho prezrla in pognala vseh 30 primerov.
const ZNANI = { "--max-usd": 1, "--meja-usd": 1, "--stopnje": 1, "--del": 1, "--primeri": 1, "--ponovi": 1, "--oba": 0, "--suho": 0 };
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (!(a in ZNANI)) {
    console.error(`Neznan argument »${a}« (dovoljeni: ${Object.keys(ZNANI).join(", ")}; vrednost za presledkom, ne z =). Nič ni bilo poklicano.`);
    process.exit(1);
  }
  i += ZNANI[a];
}
const MEJA = Number(arg("--max-usd", arg("--meja-usd", 2)));
const STOPNJE = String(arg("--stopnje", "ss"));
const SUHO = process.argv.includes("--suho");
const OBA = process.argv.includes("--oba");
if (!(MEJA > 0) || MEJA > 5) {
  console.error(`Neveljavna meja --max-usd »${arg("--max-usd", "")}« (večja od 0, največ 5). Nič ni bilo poklicano.`);
  process.exit(1);
}
if (!/^(os|ss|tek|uni)(,(os|ss|tek|uni))*$/.test(STOPNJE)) {
  console.error(`Neveljavne --stopnje »${STOPNJE}« (dovoljeno: os, ss, tek, uni, ločeno z vejico). Nič ni bilo poklicano.`);
  process.exit(1);
}

// 1) Izbor: isti primeri kot polna meritev (suhi tek primerjava-modelov.js izpiše »- <id lekcije> · <primer>«).
const osnova = ["--disable-warning=ExperimentalWarning", "scripts/primerjava-modelov.js", "--s-preverjanjem"];
const izbor = spawnSync(process.execPath, [...osnova, "--groups", STOPNJE, "--dry"], { cwd: root, encoding: "utf8", env: process.env });
let ids = [...new Set((izbor.stdout || "").split("\n").map((v) => /^- (\S+) · /.exec(v)?.[1]).filter(Boolean))];
if (izbor.status !== 0 || !ids.length) {
  console.error(`Izbor primerov ni uspel (izhod ${izbor.status}). Nič ni bilo poklicano.\n${(izbor.stderr || "").slice(-500)}`);
  process.exit(1);
}
// --del 1-2 (delovni tok Meritev v argumentih ne dovoli znaka /): prva polovica izbora (vsak k-ti primer, da ostane
// mešanica predmetov); za zagon v več delih pod mejo 2 $.
const del = /^([1-9])[-/]([1-9])$/.exec(String(arg("--del", "1-1")));
if (!del || Number(del[1]) > Number(del[2])) {
  console.error(`Neveljaven --del »${arg("--del", "") ?? ""}« (npr. 1-2 ali 2-2). Nič ni bilo poklicano.`);
  process.exit(1);
}
// Vsak primer nosi svojo zaporedno številko v izboru (1 = prvi); z njo ga izbere --primeri.
let izbrani = ids.map((id, i) => ({ n: i + 1, id }));
// --primeri 10,13: le izbrani primeri po zaporedni številki; za ciljno ponovitev primerov z napako. Številke namesto
// id-jev, ker delovni tok Meritev v argumentih ne dovoli velikih črk in znaka /. Številke veljajo za iste --stopnje in
// isti commit (nove lekcije v main jih lahko premaknejo): pred plačanim zagonom jih preveri z --suho; zagon izbrane
// primere vedno izpiše na začetku.
const PRIMERI_RAW = process.argv.includes("--primeri") ? String(arg("--primeri", "") ?? "") : null;
if (PRIMERI_RAW !== null) {
  const st = PRIMERI_RAW.split(",").map(Number);
  if (!/^[1-9][0-9]*(,[1-9][0-9]*)*$/.test(PRIMERI_RAW) || st.some((n) => n > ids.length) || new Set(st).size !== st.length || process.argv.includes("--del")) {
    console.error(`Neveljavni --primeri »${PRIMERI_RAW}« (številke 1–${ids.length} brez ponovitev, ločene z vejico; ne skupaj z --del). Nič ni bilo poklicano.`);
    process.exit(1);
  }
  izbrani = st.map((n) => izbrani[n - 1]);
} else izbrani = izbrani.filter((_, i) => i % Number(del[2]) === Number(del[1]) - 1);
ids = izbrani.map((v) => v.id);
// --ponovi N (1–5): vsak primer N-krat, ker isti model na isto nalogo ne odgovori vedno enako. Samo z --primeri
// (ponovitev vseh primerov bi presegla mejo enega zagona).
const PONOVI_RAW = process.argv.includes("--ponovi") ? String(arg("--ponovi", "") ?? "") : "1";
const PONOVI = Number(PONOVI_RAW);
if (!/^[1-5]$/.test(PONOVI_RAW) || (PONOVI > 1 && PRIMERI_RAW === null)) {
  console.error(`Neveljaven --ponovi »${PONOVI_RAW}« (celo število 1–5; več kot 1 samo skupaj z --primeri). Nič ni bilo poklicano.`);
  process.exit(1);
}

// 2) Meritev: ciljna ponovitev izbranih primerov (--samo). Privzeto samo pogoj »s« (cel Evklidov odgovor s preverjanjem,
// kot ga vidi učenec); --oba doda še »sam model, brez preverjanja« (dvojni strošek).
const PONOVITVE = path.join(root, "data", "natancnost-ponovitve.json");
const IZID = path.join(root, "data", "meri-natancnost-ss.json");
const ukaz = [...osnova, "--samo", ids.join(","), "--ponovi", String(PONOVI), "--max-usd", String(MEJA)];
if (!OBA) ukaz.push("--pogoj", "s");
if (SUHO) ukaz.push("--dry");
const POGOJEV = OBA ? 2 : 1;
const OBSEG = PRIMERI_RAW !== null ? `primeri ${PRIMERI_RAW}` : `del ${del[1]}/${del[2]}`;
const naslov = `Meritev pravilnosti: stopnje ${STOPNJE}, ${OBSEG}, primerov ${ids.length}${PONOVI > 1 ? ` × ${PONOVI} ponovitve` : ""}${OBA ? ", oba pogoja" : ""}, meja ${MEJA} $${SUHO ? ", suho (brez klicev)" : ""}.`;
const seznam = () => izbrani.forEach((v) => console.log(`  ${v.n}  ${v.id}`));
if (SUHO) {
  // Suhi tek: ocena stroška iz otroka (brez njegovega neoštevilčenega seznama), oštevilčen izbor na koncu, da je viden
  // v povzetku zagona (zadnjih 40 vrstic).
  const r = spawnSync(process.execPath, ukaz, { cwd: root, encoding: "utf8", env: process.env });
  console.log(naslov);
  for (const v of (r.stdout || "").split("\n")) if (v && !v.startsWith("- ")) console.log(v);
  if (r.stderr) process.stderr.write(r.stderr);
  console.log("Izbrani primeri (številka za --primeri, id lekcije):");
  seznam();
  process.exit(r.status ?? 1);
}
console.log(naslov);
console.log("Izbrani primeri (številka, id lekcije):");
seznam();
if (!SUHO) fs.rmSync(PONOVITVE, { force: true }); // star lokalni izid ne sme veljati za novega (npr. zagon brez ključa)
if (!SUHO && (!process.env.ANTHROPIC_API_KEY || process.env.EVKLID_MOCK === "1")) console.log("OPOZORILO: ni ključa ANTHROPIC_API_KEY (ali je EVKLID_MOCK=1). NIČ NE BO IZMERJENO.");

// Otrok teče asinhrono, da ob prekinitvi (SIGTERM ob časovni meji ali preklicu zagona) že plačane vrstice še pridejo v artefakt.
const otrok = spawn(process.execPath, ukaz, { cwd: root, stdio: "inherit", env: process.env });
let koncano = false;
function zakljuci(status) {
  if (koncano) return;
  koncano = true;
  if (!SUHO) povzetek();
  process.exit(status);
}
// Vrstice po primerih (odgovori in ocene) za artefakt in ena zadnja vrstica s seštevkom (povzetek zagona kaže le konec dnevnika).
function povzetek() {
  if (!fs.existsSync(PONOVITVE)) return console.log("IZID: nič ni bilo izmerjeno (ni vrstic).");
  fs.copyFileSync(PONOVITVE, IZID);
  let vrstice = [];
  try {
    const j = JSON.parse(fs.readFileSync(IZID, "utf8"));
    vrstice = Array.isArray(j) ? j : Array.isArray(j?.rows) ? j.rows : [];
  } catch {
    return console.log("IZID: datoteke z vrsticami ni mogoče prebrati.");
  }
  const st = (o) => vrstice.filter((v) => v?.ocena === o).length;
  const ocenjeni = st("pravilno") + st("manjsa_napaka") + st("napaka");
  console.log(`IZID (${STOPNJE}, ${OBSEG}): od ${ids.length * PONOVI * POGOJEV} odgovorov${OBA ? " (oba pogoja skupaj)" : ""} ocenjenih ${ocenjeni}: pravilno ${st("pravilno")}, manjša napaka ${st("manjsa_napaka")}, napaka ${st("napaka")}; neocenjenih ${vrstice.length - ocenjeni}. Ocenjevalec je model AI${PONOVI > 1 ? "" : ", en odgovor na primer"}.`);
}
for (const sig of ["SIGTERM", "SIGINT"]) process.on(sig, () => (otrok.kill(sig), setTimeout(() => zakljuci(1), 5000)));
otrok.on("error", (e) => (console.error(`Meritev se ni zagnala: ${e.message}`), zakljuci(1)));
otrok.on("exit", (status) => zakljuci(status ?? 1));

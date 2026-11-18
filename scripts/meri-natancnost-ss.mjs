// Meritev pravilnosti CELEGA Evklidovega odgovora na srednješolski snovi (j, 18. 11. 2026: pred vabili v pilot
// so prvi uporabniki gimnazijci). Ovoj okoli scripts/primerjava-modelov.js --s-preverjanjem --groups ss: isti rešeni
// primeri iz lekcij kot v polni meritvi (docs/meritve/natancnost-*.json, isto seme), a samo stopnja »srednja šola«
// (~30 primerov od 100), privzeto samo cel odgovor s preverjanjem (kot ga vidi učenec), ocenjevalec Opus.
// Polna meritev (~5 $) ne gre skozi delovni tok Meritev (največ 2 $ na zagon); ta del je ocenjen na ~1,7 $ (suhi tek).
// Zagon: GitHub Actions > Meritev > Run workflow, skripta scripts/meri-natancnost-ss.mjs (docs/stroski-ai.md).
//   node scripts/meri-natancnost-ss.mjs [--max-usd 2] [--stopnje ss] [--del 1-2] [--primeri 10,13 --ponovi 3] [--oba] [--suho]
//   --stopnje ss,tek   stopnje kot --groups v primerjava-modelov.js (os, ss, tek, uni); privzeto ss
//   --del 1-2          le del izbora (vsak drugi primer), če vsi ne gredo pod mejo enega zagona; nato --del 2-2
//   --primeri 10,13    le primeri s temi zaporednimi številkami izbora (izpiše jih --suho); ne skupaj z --del
//   --ponovi 3         vsak primer N-krat (1–5), za preverbo, ali se napaka ponavlja
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
const MEJA = Number(arg("--max-usd", 2));
const STOPNJE = String(arg("--stopnje", "ss"));
const SUHO = process.argv.includes("--suho");
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
// --del 1-2 (delovni tok Meritev v argumentih ne dovoli znaka /): prva polovica izbora (vsak k-ti primer, da ostane mešanica predmetov); za zagon v več delih pod mejo 2 $.
const del = /^([1-9])[-/]([1-9])$/.exec(String(arg("--del", "1-1")));
if (!del || Number(del[1]) > Number(del[2])) {
  console.error(`Neveljaven --del »${arg("--del", "")}« (npr. 1-2 ali 2-2). Nič ni bilo poklicano.`);
  process.exit(1);
}
// --primeri 10,13: le izbrani primeri po zaporedni številki v izboru (kot jih oštevilči --suho); za ciljno ponovitev
// primerov z napako. Številke namesto id-jev, ker delovni tok Meritev v argumentih ne dovoli velikih črk in znaka /.
const PRIMERI_RAW = process.argv.includes("--primeri") ? String(arg("--primeri", "")) : null;
if (PRIMERI_RAW !== null) {
  const st = PRIMERI_RAW.split(",").map(Number);
  if (!/^[0-9]+(,[0-9]+)*$/.test(PRIMERI_RAW) || st.some((n) => n < 1 || n > ids.length) || new Set(st).size !== st.length || process.argv.includes("--del")) {
    console.error(`Neveljavni --primeri »${PRIMERI_RAW}« (številke 1–${ids.length} brez ponovitev, ločene z vejico; ne skupaj z --del). Nič ni bilo poklicano.`);
    process.exit(1);
  }
  ids = st.map((n) => ids[n - 1]);
} else ids = ids.filter((_, i) => i % Number(del[2]) === Number(del[1]) - 1);
// --ponovi N (1–5): vsak primer N-krat, ker isti model na isto nalogo ne odgovori vedno enako.
const PONOVI = Number(arg("--ponovi", 1));
if (!Number.isInteger(PONOVI) || PONOVI < 1 || PONOVI > 5) {
  console.error(`Neveljaven --ponovi »${arg("--ponovi", "")}« (celo število 1–5). Nič ni bilo poklicano.`);
  process.exit(1);
}

// 2) Meritev: ciljna ponovitev izbranih primerov (--samo). Privzeto samo pogoj »s« (cel Evklidov odgovor s preverjanjem,
// kot ga vidi učenec); --oba doda še »sam model, brez preverjanja« (dvojni strošek).
const PONOVITVE = path.join(root, "data", "natancnost-ponovitve.json");
const IZID = path.join(root, "data", "meri-natancnost-ss.json");
const ukaz = [...osnova, "--samo", ids.join(","), "--ponovi", String(PONOVI), "--max-usd", String(MEJA)];
if (!process.argv.includes("--oba")) ukaz.push("--pogoj", "s");
if (SUHO) ukaz.push("--dry");
const OBSEG = PRIMERI_RAW !== null ? `primeri ${PRIMERI_RAW}` : `del ${del[1]}/${del[2]}`;
console.log(`Meritev pravilnosti: stopnje ${STOPNJE}, ${OBSEG}, primerov ${ids.length}${PONOVI > 1 ? ` × ${PONOVI} ponovitve` : ""}, meja ${MEJA} $${SUHO ? ", suho (brez klicev)" : ""}.`);
if (SUHO) ids.forEach((id, i) => console.log(`  ${PRIMERI_RAW !== null ? PRIMERI_RAW.split(",")[i] : PRIMERI_RAW === null && del[2] === "1" ? i + 1 : "·"}  ${id}`));
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
  console.log(`IZID (${STOPNJE}, ${OBSEG}): od ${ids.length * PONOVI} odgovorov ocenjenih ${ocenjeni}: pravilno ${st("pravilno")}, manjša napaka ${st("manjsa_napaka")}, napaka ${st("napaka")}; neocenjenih ${vrstice.length - ocenjeni}. Ocenjevalec je model AI${PONOVI > 1 ? "" : ", en odgovor na primer"}.`);
}
for (const sig of ["SIGTERM", "SIGINT"]) process.on(sig, () => (otrok.kill(sig), setTimeout(() => zakljuci(1), 5000)));
otrok.on("error", (e) => (console.error(`Meritev se ni zagnala: ${e.message}`), zakljuci(1)));
otrok.on("exit", (status) => zakljuci(status ?? 1));

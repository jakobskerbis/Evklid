// Primerjava prej/potem za sodbo o učenčevem koraku (Gemini 18. 11. 2026: inštruktor reče »Prav« ob napačnem koraku).
// Brez modela in brez stroška: za vsak primer iz test/fixtures/napacni-koraki.json pove, kaj bi aplikacija naredila
// z odgovorom, ki napačen korak potrdi (oziroma pravilnega zavrne):
//   opomba  – koda pred odgovorom inštruktorju pove, da je korak napačen (pravilen)
//   koda    – koda po odgovoru vidi, da ji odgovor ni sledil, in inštruktor odgovori še enkrat (brez modela za pregled)
//   model   – odgovor gre v pregled sodbe (Sonnet), ki ga ob napaki zavrne
//   NIČ     – odgovor pride do učenca nepreverjen
// Lažni alarm: koda pravilen korak označi kot napačen.
// Zagon: node scripts/napacni-koraki.js [--json]. Za »prej« zaženi isto skripto na starem commitu (mapa z git worktree):
// brez server/sodba-koraka.js uporabi staro sodbo kode (claimNote) in staro prepoznavo sodbe (givesVerdict).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const lc = await import(pathToFileURL(path.join(root, "server/live-check.js")));
const sk = fs.existsSync(path.join(root, "server/sodba-koraka.js")) ? await import(pathToFileURL(path.join(root, "server/sodba-koraka.js"))) : null;
const { primeri } = JSON.parse(fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), "../test/fixtures/napacni-koraki.json"), "utf8"));

// Stara pot (pred popravkom): sodba kode samo za končno vrednost, po odgovoru brez preverjanja, ali mu je sledil.
function verdictOf(p, pre) {
  if (sk) return sk.stepVerdict(p.ucenec, { pre, prevTutor: p.tutor });
  const note = lc.claimNote(p.ucenec, pre);
  return note ? { wrong: /is WRONG/.test(note), note } : null;
}

export function oceni(p) {
  const pre = p.naloga ? lc.presolve(p.naloga, { first: true }) : null;
  const claim = lc.isClaim(p.ucenec, p.tutor);
  const v = claim ? verdictOf(p, pre) : null;
  const opomba = v ? (v.wrong ? "napačen" : "pravilen") : "–";
  let pot;
  if (!claim) pot = "NIČ";
  else if (v) pot = sk && sk.verdictIgnored(p.odgovor, v) ? "koda" : "NIČ";
  else pot = lc.givesVerdict(p.odgovor) ? "model" : "NIČ";
  const lazniAlarm = p.pravilen && v?.wrong === true;
  const zgresenaOpomba = !p.pravilen && v && v.wrong === false;
  return { id: p.id, pravilen: p.pravilen, opomba, pot, lazniAlarm, zgresenaOpomba };
}

const rows = primeri.map(oceni);
if (process.argv.includes("--json")) {
  console.log(JSON.stringify(rows, null, 1));
} else {
  console.log(`Sodba koraka (${sk ? "s server/sodba-koraka.js" : "stara koda"}), ${rows.length} primerov`);
  console.log("id".padEnd(22), "korak".padEnd(9), "opomba".padEnd(9), "slab odgovor");
  for (const r of rows) console.log(r.id.padEnd(22), (r.pravilen ? "pravilen" : "napačen").padEnd(9), r.opomba.padEnd(9), r.pot + (r.lazniAlarm ? "  LAŽNI ALARM" : "") + (r.zgresenaOpomba ? "  NAPAČNA OPOMBA" : ""));
  const wrong = rows.filter((r) => !r.pravilen);
  const ok = rows.filter((r) => r.pravilen);
  const caught = (rs) => rs.filter((r) => r.pot !== "NIČ").length;
  console.log(`\nNapačni koraki: opomba pred odgovorom ${wrong.filter((r) => r.opomba === "napačen").length}/${wrong.length}, slaba potrditev ujeta ${caught(wrong)}/${wrong.length} (koda ${wrong.filter((r) => r.pot === "koda").length}, model ${wrong.filter((r) => r.pot === "model").length})`);
  console.log(`Pravilni koraki: opomba ${ok.filter((r) => r.opomba === "pravilen").length}/${ok.length}, slaba zavrnitev ujeta ${caught(ok)}/${ok.length}, lažni alarmi ${rows.filter((r) => r.lazniAlarm).length}, napačne opombe ${rows.filter((r) => r.zgresenaOpomba).length}`);
}

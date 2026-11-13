#!/usr/bin/env node
// Kratko poročilo o napredku lekcij in vaj (nalog) za j – samo štetje v repozitoriju, brez agentov.
//   node scripts/napredek.js              # slovensko poročilo (vrstice, ≤ 60 besed)
//   node scripts/napredek.js --json       # številke za primerjavo med poročili
//   node scripts/napredek.js --straza     # lahek nadzor (vsakih 30 min): izpiše OK ali vrstice POZOR: …
//   node scripts/napredek.js --tempo-sola 77 --tempo-faks 115   # predvideni tempo (novih lekcij/dan) po nitih
// Lekcije šteje po učnih poteh (OŠ+SŠ, tekmovanja, faks – vsaka fakultetna tema enkrat, glej sameTopics),
// vaje po generatorjih nalog (server/practice). Tempo bere iz git zgodovine trenutne veje.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { listPaths, listPrograms, listProgramPaths, topicOrder, sameTopics } from "../server/curriculum.js";
import { hasGenerator, GENERATORS } from "../server/practice/index.js";
import { LESSONS_DIR } from "../server/textbook.js";
import { isCompetitionPath } from "../server/competition.js";

const args = process.argv.slice(2);
const json = args.includes("--json");
const straza = args.includes("--straza");
const UPOCASNITEV_DO = Date.parse("2026-10-29T13:00:00Z"); // upočasnitev se je končala z nakupom paketa Max 20x (j, 29. 10.)

const lessonFile = (id) => path.join(LESSONS_DIR, `${id}.md`);
const hasLesson = (ids) => ids.some((id) => fs.existsSync(lessonFile(id)));
const newBar = (ids) => {
  const f = ids.map(lessonFile).find((p) => fs.existsSync(p));
  return f ? /^:::premisli/m.test(fs.readFileSync(f, "utf8")) : false;
};

// Skupine tem: vsaka tema kot seznam enakovrednih id-jev (faks: iste teme več programov).
const groups = { sola: [], tek: [], faks: [], faks1: [] }; // faks1 = teme 1. letnika (podmnožica faks)
for (const p of listPaths(undefined, "SI")) {
  if (!/^[A-Z]+-(OS|SS|TEK)-/.test(p.key)) continue; // vsi predmeti (MAT, FIZ, KEM, NAR, BIO …), brez UNI
  const g = isCompetitionPath(p.key) ? groups.tek : groups.sola;
  for (const t of topicOrder(p.key)) g.push([t.id]);
}
const seen = new Map(); // ključ skupine -> ids
const year1 = new Set();
for (const prog of listPrograms()) {
  for (const p of listProgramPaths(prog.id)) {
    for (const t of topicOrder(p.key)) {
      const same = sameTopics(t.id);
      const key = same[0] || t.id;
      if (!seen.has(key)) seen.set(key, same.length ? same : [t.id]);
      if (Number(p.year) === 1) year1.add(key);
    }
  }
}
for (const [key, ids] of seen) {
  groups.faks.push(ids);
  if (year1.has(key)) groups.faks1.push(ids);
}

const count = (list) => {
  const r = { teme: list.length, lekcije: 0, novaRaven: 0, vaje: 0 };
  for (const ids of list) {
    if (hasLesson(ids)) {
      r.lekcije++;
      if (newBar(ids)) r.novaRaven++;
    }
    if (ids.some((id) => hasGenerator(id))) r.vaje++;
  }
  return r;
};
const stats = { sola: count(groups.sola), tek: count(groups.tek), faks: count(groups.faks), faks1: count(groups.faks1) };
const brezVaj = {}; // predmet -> število OŠ+SŠ tem brez generatorja nalog
for (const [id] of groups.sola) if (!hasGenerator(id)) brezVaj[id.split("-")[0]] = (brezVaj[id.split("-")[0]] || 0) + 1;
const brezVajText = Object.entries(brezVaj).map(([k, v]) => `${k} ${v}`).join(", ");
const total = (k) => stats.sola[k] + stats.tek[k] + stats.faks[k];

// Lahek nadzor (j 2026-10-29 15:49: »optimizator naj optimizira vse niti vsakih 5 min«): namesto dragega polnega
// kroga vsakih 5 min teče ta skripta vsakih 30 min in opozori le, ko kaj ni v redu: nit za lekcije je izpustila
// termin (brez nove lekcije v main dlje kot 6,5 h; ena serija na 5-urno okno, serija traja do 80 min), testi na main padejo.
if (straza) {
  const git = (...a) => execFileSync("git", a, { encoding: "utf8" }).trim();
  const lastCommit = (...pathspec) => Number(git("log", "-1", "--format=%ct", "--", ...pathspec) || 0) * 1000;
  const h = (ms) => (ms / 3600000).toFixed(1);
  const now = Date.now();
  const warnings = [];
  const groups = [
    ["učbenik (OŠ+SŠ+tekmovanja)", ["content/lessons", ":(exclude)content/lessons/UNI-*"]],
    ["faks", ["content/lessons/UNI-*"]],
  ];
  for (const [name, spec] of groups) {
    const age = now - lastCommit(...spec);
    if (age > 6.5 * 3600000) warnings.push(`POZOR: ${name}: zadnja lekcija v main pred ${h(age)} h (termin verjetno izpuščen).`);
  }
  try {
    const out = execFileSync("npm", ["test"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    const fail = /^# fail (\d+)/m.exec(out);
    if (fail && Number(fail[1]) > 0) warnings.push(`POZOR: npm test na main: ${fail[1]} testov pade.`);
  } catch (e) {
    const fail = /^# fail (\d+)/m.exec(String(e.stdout || ""));
    warnings.push(`POZOR: npm test na main pade${fail ? ` (${fail[1]} testov)` : ""}.`);
  }
  console.log(warnings.length ? warnings.join("\n") : "OK");
  process.exit(0);
}

// Tempo iz gita: dodane datoteke lekcij (merge-i ne štejejo dvakrat, ker git log brez -m ne izpiše diff-a merge-a).
const added = (since) => {
  try {
    const out = execFileSync("git", ["log", `--since=${since}`, "--diff-filter=A", "--name-only", "--format=", "--", "content/lessons"], {
      encoding: "utf8",
    });
    return new Set(out.split("\n").filter((l) => /^content\/lessons\/[^/]+\/[^/]+\.md$/.test(l))).size;
  } catch {
    return 0;
  }
};
const zadnje3h = added("3 hours ago");
const zadnjih24h = added("24 hours ago");

const ostaneLekcij = total("teme") - total("lekcije");
const dvigi = total("lekcije") - total("novaRaven"); // stare lekcije, ki jih je treba dvigniti na novo raven
// Ocena konca po nitih (docs/token-rules.md §4): učbenik (OŠ+SŠ+tekmovanja) in faks. Dvig štejemo kot pol lekcije.
// Tempo od 29. 10. 18:00 UTC (docs/token-rules.md §4): ena serija na 5-urno okno na nit, 4,8 serije na dan:
// učbenik 16 novih lekcij na serijo (~77/dan), faks 24 (~115/dan). Ko učbeniška nit konča OŠ+SŠ+tekmovanja,
// piše faks teme (--deli 2 --del 1): od takrat faks napreduje s seštevkom obeh tempov.
const num = (flag, dflt) => (args.includes(flag) && Number(args[args.indexOf(flag) + 1]) > 0 ? Number(args[args.indexOf(flag) + 1]) : dflt);
const TEMPO = {
  sola: { pocasi: num("--pocasi-sola", 6), polni: num("--tempo-sola", 77) },
  faks: { pocasi: num("--pocasi-faks", 4), polni: num("--tempo-faks", 115) },
};
const now = Date.now();
const DAY = 86400000;
const konecZa = (delo, t) => {
  const dniPocasi = Math.max(0, (UPOCASNITEV_DO - now) / DAY);
  const pocasi = Math.min(delo, t.pocasi * dniPocasi);
  return new Date(pocasi >= delo ? now + (delo / t.pocasi) * DAY : UPOCASNITEV_DO + ((delo - pocasi) / t.polni) * DAY);
};
const ostane = (s) => s.teme - s.lekcije;
const deloSola = ostane(stats.sola) + ostane(stats.tek) + (stats.sola.lekcije - stats.sola.novaRaven + stats.tek.lekcije - stats.tek.novaRaven) / 2;
const deloFaks = ostane(stats.faks) + (stats.faks.lekcije - stats.faks.novaRaven) / 2;
const konecSola = konecZa(deloSola, TEMPO.sola);
const konecFaks = (() => {
  const doSola = TEMPO.faks.polni * Math.max(0, (konecSola - now) / DAY); // faks sam, dokler učbenik ne konča
  if (doSola >= deloFaks) return konecZa(deloFaks, TEMPO.faks);
  return new Date(konecSola.getTime() + ((deloFaks - doSola) / (TEMPO.faks.polni + TEMPO.sola.polni)) * DAY);
})();
const datum = (d) => `${d.getUTCDate()}. ${d.getUTCMonth() + 1}.`;
const frac = (s) => `${s.lekcije}/${s.teme}`;

const result = {
  cas: new Date(now).toISOString(),
  lekcije: { skupaj: total("lekcije"), teme: total("teme"), sola: stats.sola, tek: stats.tek, faks: stats.faks, faks1: stats.faks1 },
  novaRaven: total("novaRaven"),
  dvigi,
  vaje: { teme: total("vaje"), generatorji: GENERATORS.length, solaBrezVaj: brezVaj },
  zadnje3h,
  zadnjih24h,
  ostaneLekcij,
  ocenaKonca: { sola: konecSola.toISOString().slice(0, 10), faks: konecFaks.toISOString().slice(0, 10) },
  predpostavke: { ...TEMPO, upocasnitevDo: new Date(UPOCASNITEV_DO).toISOString(), dvigJePolLekcije: true },
};

if (json) {
  console.log(JSON.stringify(result, null, 1));
} else {
  const d = new Date(now);
  const hhmm = `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
  console.log(`Napredek lekcij in vaj (${datum(d)} ${hhmm} UTC)`);
  console.log(
    `Lekcije: OŠ+SŠ ${frac(stats.sola)}, tekmovanja ${frac(stats.tek)}, faks ${frac(stats.faks)} tem (1. letnik ${frac(stats.faks1)}). Zadnje 3 h: +${zadnje3h}, zadnjih 24 h: +${zadnjih24h}.`
  );
  console.log(`Na novi ravni kakovosti: ${total("novaRaven")}; starih lekcij za dvig: ${dvigi} (OŠ+SŠ ${stats.sola.lekcije - stats.sola.novaRaven}, faks ${stats.faks.lekcije - stats.faks.novaRaven}).`);
  console.log(
    `Vaje (generatorji nalog): OŠ+SŠ ${stats.sola.vaje}/${stats.sola.teme} tem${brezVajText ? ` (brez: ${brezVajText})` : ""}, tekmovanja ${stats.tek.vaje}/${stats.tek.teme}, faks ${stats.faks.vaje}/${stats.faks.teme}; skupaj ${GENERATORS.length} generatorjev.`
  );
  console.log(
    `Še do konca: OŠ+SŠ ${ostane(stats.sola)} in tekmovanja ${ostane(stats.tek)} novih lekcij → ocena ${datum(konecSola)}; faks ${ostane(stats.faks)} novih → ocena ${datum(konecFaks)}`
  );
  console.log(
    now < UPOCASNITEV_DO
      ? `(Predpostavke: do ${datum(new Date(UPOCASNITEV_DO))} ${TEMPO.sola.pocasi} oz. ${TEMPO.faks.pocasi} lekcij/dan, potem ${TEMPO.sola.polni} oz. ${TEMPO.faks.polni}/dan; dvig = pol lekcije.)`
      : `(Predpostavka: ${TEMPO.sola.polni} novih lekcij/dan za OŠ+SŠ+tekmovanja in ${TEMPO.faks.polni}/dan za faks, potem obe niti na faksu; dvig = pol lekcije.)`
  );
}

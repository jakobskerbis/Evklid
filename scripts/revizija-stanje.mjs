#!/usr/bin/env node
// K-01 in K-02 (načrt dviga kakovosti po reviziji): primerja register revizije (docs/revizija/register.md v veji
// review/chatgpt-audit) z dejanskim stanjem: kateri PR-ji so združeni v main, kateri so še odprti in ali ima
// ugotovitev test z oznako AUDIT-NNN v test/. Ne spreminja ničesar; samo poroča razlike.
//
//   node scripts/revizija-stanje.mjs                       register iz origin/review/chatgpt-audit, PR-ji iz git
//   node scripts/revizija-stanje.mjs --register pot.md     register iz datoteke
//   node scripts/revizija-stanje.mjs --github              še odprti PR-ji z GitHuba (GITHUB_TOKEN ali GH_TOKEN)
//   node scripts/revizija-stanje.mjs --pr-json pr.json     odprti PR-ji iz datoteke [{number, title, state}]
//   node scripts/revizija-stanje.mjs --json izhod.json     poročilo še v JSON
//   node scripts/revizija-stanje.mjs --strikno             izhod 1, če je katera razlika
//
// Vrste razlik:
//   zaostaja    popravek je združen v main, status pa je še pred »PRIPRAVLJENO ZA PONOVNI PREGLED«
//   prehiteva   status je »PRIPRAVLJENO ZA PONOVNI PREGLED« ali »ZAKLJUČENO«, a noben povezan PR ni združen
//   brez-testa  popravek je združen (ali status zaključen), v test/ pa ni nobene oznake AUDIT-NNN
//   manjka      oznaka AUDIT-NNN se pojavi v naslovu PR-ja, v registru pa ni vrstice
//   nepovezan   odprt PR v naslovu navaja AUDIT-NNN, vrstica NNN pa ga ne navaja (trk oznak ali manjka povezava)
// Prisotnost oznake v testu ni dokaz, da test ponovi prvotni primer: to ostane ročni pregled (K-03).
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

export const STATUSI = [
  "NOVO",
  "V PREVERJANJU",
  "POTRJENO",
  "ZAVRNJENO Z DOKAZI",
  "ČAKA NA MOJO ODOBRITEV",
  "ODOBRENO",
  "V IZVEDBI",
  "PRIPRAVLJENO ZA PONOVNI PREGLED",
  "ZAKLJUČENO",
];
const PRED_PREGLEDOM = new Set(["NOVO", "V PREVERJANJU", "POTRJENO", "ČAKA NA MOJO ODOBRITEV", "ODOBRENO", "V IZVEDBI"]);
const PO_POPRAVKU = new Set(["PRIPRAVLJENO ZA PONOVNI PREGLED", "ZAKLJUČENO"]);

/** Razdeli vrstico tabele Markdown na celice; »\|« ne loči celic. */
export function celice(vrstica) {
  const deli = [];
  let tren = "";
  const s = vrstica.trim().replace(/^\|/, "").replace(/\|$/, "");
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "\\" && s[i + 1] === "|") {
      tren += "|";
      i++;
    } else if (s[i] === "|") {
      deli.push(tren.trim());
      tren = "";
    } else tren += s[i];
  }
  deli.push(tren.trim());
  return deli;
}

/** Vse številke PR-jev v besedilu celice (#123 ali …/pull/123). */
export function stevilkePr(besedilo) {
  const out = new Set();
  for (const m of String(besedilo).matchAll(/(?:#|\/pull\/)(\d{1,6})\b/g)) out.add(Number(m[1]));
  return [...out];
}

/** Oznake AUDIT-NNN v besedilu, tudi razponi »AUDIT-058–066« in »AUDIT-029 do AUDIT-031«. */
export function oznake(besedilo) {
  const out = new Set();
  const s = String(besedilo);
  for (const m of s.matchAll(/AUDIT-(\d{3})(?:\s*(?:[–—-]|do)\s*(?:AUDIT-)?(\d{3}))?/gi)) {
    const a = Number(m[1]);
    const b = m[2] ? Number(m[2]) : a;
    if (b >= a && b - a <= 30) for (let n = a; n <= b; n++) out.add(id(n));
    else out.add(id(a));
  }
  for (const m of s.matchAll(/(?:^|[/_-])audit-(\d{3})(?=\D|$)/gi)) out.add(id(Number(m[1])));
  return [...out];
}

const id = (n) => `AUDIT-${String(n).padStart(3, "0")}`;

/**
 * Prebere register. Opis in komentar lahko vsebujeta neubežan »|« (npr. v `kodi`), zato status poiščemo
 * kot prvo celico od 4. dalje, ki je natanko eden od statusov; PR popravka je zadnja celica.
 */
export function preberiRegister(md) {
  const vrstice = [];
  const napake = [];
  for (const v of md.split("\n")) {
    if (!/^\|\s*AUDIT-\d{3}\s*\|/.test(v)) continue;
    const c = celice(v);
    const iStatus = c.findIndex((x, i) => i >= 3 && STATUSI.includes(x));
    if (iStatus < 0) {
      napake.push(`${c[0]}: ni prepoznanega statusa`);
      continue;
    }
    vrstice.push({
      id: c[0],
      prioriteta: c[1],
      podrocje: c[2],
      opis: c.slice(3, iStatus).join(" | "),
      status: c[iStatus],
      // »(nad #940)«, »(pregled #945)«: omenjeni PR-ji v oklepaju niso popravek te ugotovitve
      pr: stevilkePr(c[c.length - 1].replace(/\([^)]*\)/g, "")),
      prCelica: c[c.length - 1],
    });
  }
  return { vrstice, napake };
}

/**
 * Združeni PR-ji iz zgodovine main (samo prvi starši): squash »Naslov (#N)« ali »Merge pull request #N from veja«
 * z naslovom v telesu. Vrne Map številka → { naslov, commit }.
 */
export function zdruzeniIzGita(log) {
  const out = new Map();
  for (const zapis of log.split("\u001e")) {
    const [commit, subj = "", telo = ""] = zapis.trim().split("\u001f");
    if (!commit) continue;
    let m = subj.match(/^Merge pull request #(\d+) from (\S+)/);
    if (m) {
      out.set(Number(m[1]), { naslov: `${telo.trim().split("\n")[0]} [${m[2]}]`, commit });
      continue;
    }
    m = subj.match(/^(.*)\(#(\d+)\)\s*$/);
    if (m) out.set(Number(m[2]), { naslov: m[1].trim(), commit });
  }
  return out;
}

/** Vse oznake AUDIT-NNN v datotekah testov (rekurzivno, .js/.mjs/.cjs/.json). */
export function oznakeVTestih(mapa = join(ROOT, "test")) {
  const out = new Map();
  const hodi = (m) => {
    for (const ime of readdirSync(m)) {
      const p = join(m, ime);
      if (statSync(p).isDirectory()) hodi(p);
      // test tega skripta uporablja izmišljene oznake, zato ga preskočimo
      else if (/\.(c|m)?js$|\.json$/.test(ime) && ime !== "revizija-stanje.test.js") {
        for (const o of String(readFileSync(p, "utf8")).match(/AUDIT-\d{3}/g) || []) {
          if (!out.has(o)) out.set(o, new Set());
          out.get(o).add(p.slice(ROOT.length + 1));
        }
      }
    }
  };
  if (existsSync(mapa)) hodi(mapa);
  return out;
}

/**
 * Jedro: primerja register s PR-ji in testi.
 * @param {{vrstice: object[]}} register
 * @param {Map<number,{naslov:string}>} zdruzeni  združeni v main
 * @param {{number:number,title:string,state?:string}[]} odprti  odprti PR-ji (neobvezno)
 * @param {Map<string,Set<string>>} testi  oznaka → datoteke
 */
export function primerjaj(register, zdruzeni, odprti = [], testi = new Map()) {
  const poId = new Map(register.vrstice.map((v) => [v.id, v]));
  const odprtiPo = new Map(odprti.map((p) => [Number(p.number), p]));
  // PR → oznake v naslovu; oznaka → PR-ji z oznako v naslovu
  const naslovi = new Map();
  for (const [n, p] of zdruzeni) naslovi.set(n, { naslov: p.naslov, zdruzen: true });
  for (const [n, p] of odprtiPo) if (!naslovi.has(n)) naslovi.set(n, { naslov: p.title, zdruzen: false });
  const poOznaki = new Map();
  for (const [n, p] of naslovi) {
    for (const o of oznake(p.naslov)) {
      if (!poOznaki.has(o)) poOznaki.set(o, new Set());
      poOznaki.get(o).add(n);
    }
  }

  const razlike = [];
  const vrstice = [];
  for (const v of register.vrstice) {
    const povezani = new Set([...v.pr, ...(poOznaki.get(v.id) || [])]);
    const zdr = [...povezani].filter((n) => zdruzeni.has(n)).sort((a, b) => a - b);
    const odp = [...povezani].filter((n) => !zdruzeni.has(n) && odprtiPo.has(n)).sort((a, b) => a - b);
    const test = testi.has(v.id) ? [...testi.get(v.id)].sort() : [];
    let dejansko;
    if (v.status === "ZAKLJUČENO" && zdr.length) dejansko = "zaključeno";
    else if (v.status === "ZAVRNJENO Z DOKAZI") dejansko = "zavrnjeno";
    else if (zdr.length) dejansko = "popravek v main";
    else if (odp.length) dejansko = "popravek v odprtem PR";
    else dejansko = "brez PR";
    vrstice.push({ ...v, zdruzeni: zdr, odprti: odp, testi: test, dejansko });

    if (zdr.length && PRED_PREGLEDOM.has(v.status))
      razlike.push({ vrsta: "zaostaja", id: v.id, status: v.status, pr: zdr, opis: `združen ${zdr.map((n) => "#" + n).join(", ")}` });
    if (PO_POPRAVKU.has(v.status) && !zdr.length) {
      const kje = odp.length ? `odprt ${odp.map((n) => "#" + n).join(", ")}` : v.pr.length ? `${v.pr.map((n) => "#" + n).join(", ")} ni v main` : "brez PR";
      razlike.push({ vrsta: "prehiteva", id: v.id, status: v.status, pr: [...odp, ...v.pr], opis: kje });
    }
    if ((zdr.length || v.status === "ZAKLJUČENO") && v.status !== "ZAVRNJENO Z DOKAZI" && !test.length)
      razlike.push({ vrsta: "brez-testa", id: v.id, status: v.status, pr: zdr, opis: "v test/ ni oznake " + v.id });
  }

  for (const [o, prji] of [...poOznaki].sort()) {
    if (!poId.has(o)) razlike.push({ vrsta: "manjka", id: o, status: null, pr: [...prji].sort((a, b) => a - b), opis: `v naslovu ${[...prji].map((n) => "#" + n).join(", ")}, ni v registru` });
  }

  for (const [n, p] of odprtiPo) {
    for (const o of oznake(p.title)) {
      const v = poId.get(o);
      if (v && !v.pr.includes(n))
        razlike.push({ vrsta: "nepovezan", id: o, status: v.status, pr: [n], opis: `odprt #${n} navaja ${o}, vrstica ga ne navaja (trk oznak ali manjkajoča povezava)` });
    }
  }
  const red = ["zaostaja", "prehiteva", "nepovezan", "manjka", "brez-testa"];
  razlike.sort((a, b) => red.indexOf(a.vrsta) - red.indexOf(b.vrsta) || a.id.localeCompare(b.id));
  return { vrstice, razlike };
}

function git(args) {
  return execFileSync("git", args, { cwd: ROOT, encoding: "utf8", maxBuffer: 64 << 20 });
}

async function odprtiZGithuba(repo) {
  const zeton = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  const glava = { Accept: "application/vnd.github+json", "User-Agent": "revizija-stanje" };
  if (zeton) glava.Authorization = `Bearer ${zeton}`;
  const out = [];
  for (let stran = 1; stran <= 10; stran++) {
    const r = await fetch(`https://api.github.com/repos/${repo}/pulls?state=open&per_page=100&page=${stran}`, { headers: glava });
    if (!r.ok) throw new Error(`GitHub ${r.status}: ${await r.text()}`);
    const del = await r.json();
    out.push(...del.map((p) => ({ number: p.number, title: p.title, state: "open" })));
    if (del.length < 100) break;
  }
  return out;
}

function arg(ime) {
  const i = process.argv.indexOf(ime);
  return i > 0 ? process.argv[i + 1] : null;
}

async function main() {
  const potReg = arg("--register");
  let md;
  try {
    md = potReg ? readFileSync(potReg, "utf8") : git(["show", "origin/review/chatgpt-audit:docs/revizija/register.md"]);
  } catch {
    console.error("Registra ni. Najprej: git fetch origin review/chatgpt-audit  (ali --register pot.md)");
    process.exit(2);
  }
  const register = preberiRegister(md);
  const vrh = arg("--main") || "origin/main";
  const log = git(["log", "--first-parent", vrh, "--format=%H%x1f%s%x1f%b%x1e"]);
  const zdruzeni = zdruzeniIzGita(log);
  let odprti = [];
  if (arg("--pr-json")) odprti = JSON.parse(readFileSync(arg("--pr-json"), "utf8"));
  else if (process.argv.includes("--github")) {
    const brand = JSON.parse(readFileSync(join(ROOT, "brand.json"), "utf8"));
    const repo = (brand.repo || "").replace(/^https?:\/\/github\.com\//, "").replace(/\.git$/, "") || "jakobskerbis/Evklid";
    odprti = await odprtiZGithuba(repo);
  }
  const { vrstice, razlike } = primerjaj(register, zdruzeni, odprti, oznakeVTestih());

  const stej = (f) => vrstice.filter(f).length;
  console.log(`Register: ${vrstice.length} ugotovitev, ${stej((v) => v.status === "ZAKLJUČENO")} zaključenih; main ${vrh}; odprtih PR-jev znanih: ${odprti.length}`);
  for (const n of register.napake) console.log(`  ! ${n}`);
  const imena = { zaostaja: "Popravek združen, status zaostaja", prehiteva: "Status prehiteva (PR ni združen)", nepovezan: "Odprt PR ni povezan z vrstico", manjka: "Manjka v registru", "brez-testa": "Brez testa z oznako" };
  for (const vrsta of Object.keys(imena)) {
    const r = razlike.filter((x) => x.vrsta === vrsta);
    if (!r.length) continue;
    console.log(`\n${imena[vrsta]} (${r.length}):`);
    for (const x of r) console.log(`  ${x.id}${x.status ? `  [${x.status}]` : ""}  ${x.opis}`);
  }
  console.log(`\nSkupaj razlik: ${razlike.length}`);
  if (arg("--json")) writeFileSync(arg("--json"), JSON.stringify({ main: vrh, vrstice, razlike }, null, 2) + "\n");
  if (process.argv.includes("--strikno") && razlike.length) process.exit(1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();

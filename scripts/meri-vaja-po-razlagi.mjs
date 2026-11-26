#!/usr/bin/env node
// K-08: meritev gumba »Podobna naloga« (vaja po razlagi, server/vaja-po-razlagi.js) na neodvisnem naboru
// test/fixtures/instruktor-vaja/primeri.json. Pričakovane teme je pred zagonom kode napisal model, ki kode ni bral.
// Merilo (načrt dviga kakovosti, K-08): 0 gumbov z napačno temo in 0 nalog z napačnim odgovorom; vklop samo na j-jevo
// kartico. Brez klicev API (vse lokalno).
//
//   node scripts/meri-vaja-po-razlagi.mjs                         teme: preglednica na zaslon
//   node scripts/meri-vaja-po-razlagi.mjs --json izid.json        še surovi izid
//   node scripts/meri-vaja-po-razlagi.mjs --naloge naloge.json    naloge za neodvisno reševanje (brez odgovorov) in
//                                                                  ključ (naloge.kljuc.json, ne pokaži reševalcu)
//   node scripts/meri-vaja-po-razlagi.mjs --resitve resitve.json  primerja neodvisne rešitve s kodo
//
// Izidi teme: »pravilno« (gumb na sprejemljivo temo), »brez gumba« (pokritost), »napacna tema« (gumb na temo, ki je
// ni med sprejemljivimi; cilj 0). Naloge za vsak gumb: generateTask kot v aplikaciji (ravni 1, 2 in 3, seme iz id-ja
// primera, učenčev razred), preverjanje kode sprejme svoj odgovor, generator je res za to temo.
import fs from "node:fs";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { temaZVajo } from "../server/vaja-po-razlagi.js";
import { normalizeSettings } from "../server/settings.js";
import { generateTask, publicTask } from "../server/practice/index.js";
import { checkAnswer, fmt } from "../server/practice/check.js";
import { schoolYear } from "../server/games.js";
import { getTopic, pathKeyFor } from "../server/curriculum.js";

export const NABOR = "test/fixtures/instruktor-vaja/primeri.json";

export const nastavitve = (p) => normalizeSettings({ educational_track: p.sola, curriculum_level: p.razred, subject: p.predmet });
const seme = (id) => crypto.createHash("sha256").update(`k08|${id}`).digest().readUInt32BE(0) % 2 ** 31;

export function oceniTemo(p) {
  const t = temaZVajo(p.poizvedba, nastavitve(p));
  if (!t) return { izid: "brez gumba", tema: null };
  if (p.sprejemljive.includes(t.topicId)) return { izid: "pravilno", tema: t.topicId };
  // Iskanje namerno zajame tudi nižje razrede (ponovitev snovi, server/lekcija-za-vprasanje.js indexFor); nabor pa
  // sprejemljive teme navaja samo iz učenčeve poti. Taka tema se šteje posebej, odločitev o njej je j-jeva.
  const svoja = t.topicId.startsWith(`${pathKeyFor(nastavitve(p))}/`);
  return { izid: svoja ? "napacna tema" : "tema nizjega razreda", tema: t.topicId };
}

// Pravilni odgovor v zapisu, kot bi ga vpisal učenec (za samopreverjanje kode).
function zapisOdgovora(a) {
  if (a.type === "number") return `${fmt(a.value, a.decimals ?? null)}${a.unit ? " " + a.unit : ""}`;
  if (a.type === "choice") return String(a.index);
  if (a.type === "fraction") return `${a.num}/${a.den}`;
  return null;
}

export function nalogaZaGumb(p, tema, raven) {
  const s = nastavitve(p);
  const t = generateTask(tema, raven, seme(`${p.id}|${raven}`), "sl", schoolYear(s));
  const zapis = zapisOdgovora(t.answer);
  let samopreverba = null;
  if (zapis != null) {
    try {
      samopreverba = checkAnswer(t.answer, zapis).kind;
    } catch (e) {
      samopreverba = `izjema: ${e.message}`;
    }
  }
  return { id: p.id, tema, raven, seme: seme(`${p.id}|${raven}`), generator: t.generator, besedilo: t.text, javno: publicTask(t), odgovor: t.answer, samopreverba };
}

export function meri(primeri) {
  const vrstice = primeri.map((p) => {
    const o = oceniTemo(p);
    const naloge = o.tema ? [1, 2, 3].map((r) => nalogaZaGumb(p, o.tema, r)) : [];
    return { id: p.id, predmet: p.predmet, razred: `${p.sola === "SREDNJA_SOLA" ? "SŠ" : "OŠ"} ${p.razred}`, vrsta: p.vrsta, poizvedba: p.poizvedba, sprejemljive: p.sprejemljive, ...o, naloge: naloge.map((n) => ({ raven: n.raven, seme: n.seme, generator: n.generator, samopreverba: n.samopreverba })) };
  });
  return vrstice;
}

const steje = (arr, f) => arr.reduce((o, x) => ((o[f(x)] = (o[f(x)] || 0) + 1), o), {});

function izpis(v) {
  const gumbi = v.filter((x) => x.tema);
  const moznih = v.filter((x) => x.sprejemljive.length);
  console.log(`primerov ${v.length}; gumbov ${gumbi.length}; napačna tema ${v.filter((x) => x.izid === "napacna tema").length}`);
  console.log(`pokritost: pravilen gumb pri ${moznih.filter((x) => x.izid === "pravilno").length} od ${moznih.length} primerov, kjer je sprejemljiva tema`);
  console.log("po vrsti:", JSON.stringify(Object.fromEntries(Object.entries(steje(v, (x) => x.vrsta)).map(([k]) => [k, steje(v.filter((x) => x.vrsta === k), (x) => x.izid)]))));
  console.log("samopreverba nalog:", JSON.stringify(steje(gumbi.flatMap((x) => x.naloge), (n) => n.samopreverba ?? "ni številski odgovor")));
  for (const x of v.filter((x) => x.izid === "tema nizjega razreda")) console.log(`  NIŽJI RAZRED ${x.id} »${x.poizvedba}« (${x.razred}) → ${x.tema}`);
  for (const x of v.filter((x) => x.izid === "napacna tema")) console.log(`  NAPAČNA TEMA ${x.id} »${x.poizvedba}« → ${x.tema} (sprejemljive: ${x.sprejemljive.join(", ") || "nobena"})`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = process.argv.slice(2);
  const arg = (k) => (a.includes(k) ? a[a.indexOf(k) + 1] : null);
  const primeri = JSON.parse(fs.readFileSync(arg("--nabor") || NABOR, "utf8"));
  const v = meri(primeri);
  if (arg("--naloge")) {
    const naloge = primeri.flatMap((p, i) => (v[i].tema ? [1, 2, 3].map((r) => nalogaZaGumb(p, v[i].tema, r)) : []));
    // Reševalec dobi besedilo, možnosti in ime teme, ne odgovora.
    fs.writeFileSync(arg("--naloge"), JSON.stringify(naloge.map((n) => ({ id: `${n.id}/${n.raven}`, tema: getTopic(n.tema)?.name, besedilo: n.besedilo, moznosti: n.javno.options || null, enota: n.odgovor.unit || null, decimalke: n.odgovor.decimals ?? null })), null, 1));
    fs.writeFileSync(arg("--naloge").replace(/\.json$/, ".kljuc.json"), JSON.stringify(naloge.map((n) => ({ id: `${n.id}/${n.raven}`, tema: n.tema, generator: n.generator, odgovor: n.odgovor })), null, 1));
  }
  if (arg("--json")) fs.writeFileSync(arg("--json"), JSON.stringify(v, null, 1));
  izpis(v);
}

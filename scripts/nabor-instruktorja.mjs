// Neodvisni nabor inštruktorja (K-06 MAT 2.000 + FIZ/KEM 1.000, K-16 BIO ≥ 500; načrt dviga kakovosti po reviziji,
// j 26. 11. 2026). Referenčni odgovor nikoli ne pride iz inštruktorja: uradne naloge imajo odgovor iz uradnih navodil
// za ocenjevanje (RIC), naloge iz generatorjev odgovor, ki ga izračuna koda generatorja.
//
// Sestava (docs/nabor-instruktorja.md):
// - uradne naloge (≥ 30 % vsakega nabora): © RIC, zato je besedilo v javnem repozitoriju samo šifrirano;
// - naloge iz generatorjev: ponovljive iz (generator, tema, raven, seme), besedilo se ob zagonu ustvari znova;
// - 20 % vsakega nabora je skrit kontrolni del (izbran s HMAC s ključem, cele skupine: uradna naloga z vsemi
//   podnalogami ali cel generator), šifriran; uporablja se samo za poročila ob izdaji, ne za izboljšave.
// Ključ: NABOR_KLJUC (32 bajtov base64; skrivnost, ne v repozitoriju; oblika kot PREIZKUS3_KLJUC).
//
//   NABOR_KLJUC=… node scripts/nabor-instruktorja.mjs --uradno <mapa s prepisi *.json> [--izhod test/fixtures/instruktor-nabor]
//   NABOR_KLJUC=… node scripts/nabor-instruktorja.mjs --odsifriraj <vhod.enc> <izhod.json>   (izhod nikoli v repozitorij)
// Preverjanje brez ključa: test/nabor-instruktorja.test.js (sestava, ponovljivost generatorjev, glave šifer).
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GENERATORS, plainCommas } from "../server/practice/index.js";
import { makeRng } from "../server/practice/rng.js";
import { getTopic } from "../server/curriculum.js";
import { kljucIz, sifriraj, odsifriraj } from "./preizkus3-sifra.mjs";

export const MAPA = "test/fixtures/instruktor-nabor";
export const CILJI = { MAT: 2000, "FIZ/KEM": 1000, BIO: 500 };
export const NABOR = (predmet) => (predmet === "FIZ" || predmet === "KEM" ? "FIZ/KEM" : predmet);
export const MIN_URADNO = 0.3;
// Postavke z učenčevo napačno rešitvijo (znotraj K-06, načrt poglavje 8): napačen rezultat z znano vrsto napake iz
// generatorja (mistakes[].why). Nepopolne, dvoumne rešitve in napačne predpostavke dodajo ročno označeni prepisi.
export const NAPAKE = { MAT: 400, "FIZ/KEM": 200, BIO: 0 };
export const SKRITO = 0.2;
// Slovenske poti (OŠ 6.–9., SŠ 1.–4., tekmovanja); brez izpitnih bank v angleščini (EXB, IN) in fakultete (UNI).
const TEMA_OK = /^(MAT|FIZ|KEM|BIO)-(OS-[6-9]|SS-[1-4]|TEK-(OS|SS))\//;
const RAVNI = [1, 2, 3];

const sha = (s) => crypto.createHash("sha256").update(s).digest("hex");
// En predmet v vrstici: pregleden diff in majhna datoteka.
const stabilno = (x) => (Array.isArray(x) ? "[\n" + x.map((p) => JSON.stringify(p)).join(",\n") + "\n]\n" : JSON.stringify(x, null, 1) + "\n");

// Naloga generatorja točno tako, kot jo da (generator, tema, raven, seme): isti postopek kot generateTask, a brez
// naključne izbire generatorja med generatorji teme.
export function nalogaGeneratorja({ generator, tema, raven, seme }) {
  const g = GENERATORS.find((x) => x.id === generator);
  if (!g) throw new Error(`Ni generatorja ${generator}`);
  const r = makeRng(seme);
  for (let i = 0; i < 5; i++) {
    const t = g.gen(raven, r, tema, "sl", null);
    if (t && t.text && t.answer) return plainCommas({ ...t, generator, topicId: tema, level: raven, seed: seme }, !g.langs);
  }
  throw new Error(`Generator ${generator} ni ustvaril naloge`);
}

const predmetTeme = (t) => t.split("-")[0];
// Odgovor iz kode (brez besedil razlag: razlage so v jeziku naloge in niso referenca).
function odgovorKode(a) {
  if (a.type === "number") return { tip: "stevilo", vrednost: a.value, enota: a.unit || null, decimalke: a.decimals ?? null, sprejmi: a.alsoAccept || [] };
  if (a.type === "choice") return { tip: "izbira", vrednost: a.index, moznosti: a.options.length };
  if (a.type === "fraction") return { tip: "ulomek", vrednost: `${a.num}/${a.den}` };
  return { tip: a.type, vrednost: a.values ?? a.value ?? null };
}

const zapisStevila = (v, unit) => String(+Number(v).toPrecision(10)).replace(".", ",") + (unit ? ` ${unit}` : "");

// Postavke iz generatorjev: krožno po generatorjih predmeta (vsak generator najprej raven 1, 2, 3, nato novo seme),
// dokler ni `n` postavk; isto besedilo se ne ponovi.
export function postavkeGeneratorjev(predmeti, n, napak = 0) {
  const gens = GENERATORS.filter((g) => !g.langs && g.topics.some((t) => TEMA_OK.test(t) && predmeti.includes(predmetTeme(t)) && getTopic(t)));
  const out = [];
  const videno = new Set();
  for (let krog = 0; out.length < n && krog < 40; krog++) {
    for (const g of gens) {
      if (out.length >= n) break;
      const teme = g.topics.filter((t) => TEMA_OK.test(t) && predmeti.includes(predmetTeme(t)) && getTopic(t));
      const tema = teme[krog % teme.length];
      const raven = RAVNI[krog % 3];
      const seme = 1000 + krog;
      let t;
      try {
        t = nalogaGeneratorja({ generator: g.id, tema, raven, seme });
      } catch {
        continue;
      }
      if (videno.has(t.text)) continue;
      videno.add(t.text);
      out.push({
        id: `GEN/${g.id}/${tema}/${raven}/${seme}`,
        predmet: predmetTeme(tema),
        vir: { vrsta: "generator", generator: g.id, tema, raven, seme },
        skupina: `GEN/${g.id}`,
        tema,
        vrsta: t.answer.type === "choice" ? "izbirna" : "racun",
        odgovor: odgovorKode(t.answer),
        odgovor_vir: "koda generatorja",
      });
    }
  }
  // Napačne rešitve: novo seme (5000 +), samo številski odgovori z napako, ki ni pravilna vrednost.
  const nap = [];
  for (let krog = 0; nap.length < napak && krog < 40; krog++) {
    for (const g of gens) {
      if (nap.length >= napak) break;
      const teme = g.topics.filter((t) => TEMA_OK.test(t) && predmeti.includes(predmetTeme(t)) && getTopic(t));
      const tema = teme[krog % teme.length];
      const raven = RAVNI[krog % 3];
      const seme = 5000 + krog;
      let t;
      try {
        t = nalogaGeneratorja({ generator: g.id, tema, raven, seme });
      } catch {
        continue;
      }
      const a = t.answer;
      const m = a.type === "number" && (a.mistakes || []).find((x) => x && Number.isFinite(x.value) && Math.abs(x.value - a.value) > 1e-9 * Math.max(1, Math.abs(a.value)) && x.why);
      if (!m || videno.has(t.text)) continue;
      videno.add(t.text);
      nap.push({
        id: `GEN-NAPAKA/${g.id}/${tema}/${raven}/${seme}`,
        predmet: predmetTeme(tema),
        vir: { vrsta: "generator", generator: g.id, tema, raven, seme },
        skupina: `GEN/${g.id}`,
        tema,
        vrsta: "napaka",
        napaka: { ucenec: zapisStevila(m.value, a.unit), vrsta_napake: "napačen rezultat", zakaj: m.why },
        odgovor: odgovorKode(a),
        odgovor_vir: "koda generatorja",
      });
    }
  }
  return [...out.slice(0, n - nap.length), ...nap];
}

// Prepis uradne naloge (OBLIKA-PREPISA.md) → postavka nabora. Brez uradnega odgovora, z negotovim odgovorom (razbran
// iz risbe, izpeljan ali razložen) ali z odgovorom, ki je risba, postavka ne gre v nabor.
export function postavkaUradna(x) {
  if (!x || !x.id || !x.odgovor || x.odgovor.vrednost == null || x.odgovor.vrednost === "" || x.odgovor_negotov || x.odgovor.tip === "risba") return null;
  return { ...x, vir: { vrsta: "uradno", ...x.vir }, skupina: x.skupina || x.id.replace(/[a-z]$/, ""), odgovor_vir: "uradna navodila za ocenjevanje" };
}

// Ista naloga v dveh polah (del B je pri MAT enak za osnovno in višjo raven): ostane prva po imenu datoteke.
const normal = (t) => String(t || "").replace(/\s+/g, " ").trim().toLowerCase();
export function brezPonovitev() {
  const videno = new Set();
  return (p) => {
    const k = `${p.predmet}|${normal(p.besedilo)}|${JSON.stringify(p.odgovor?.vrednost)}`;
    if (videno.has(k)) return false;
    videno.add(k);
    return true;
  };
}

// Skrit del: v vsakem sloju (nabor × vrsta vira) skupine v vrstnem redu HMAC(ključ, skupina), dokler skritih postavk
// ni vsaj SKRITO deleža sloja. Brez ključa izbire ni mogoče ponoviti ali uganiti.
export function razdeli(postavke, kljuc) {
  const sloji = new Map();
  for (const p of postavke) {
    const k = `${NABOR(p.predmet)}|${p.vir.vrsta}`;
    if (!sloji.has(k)) sloji.set(k, new Map());
    const s = sloji.get(k);
    if (!s.has(p.skupina)) s.set(p.skupina, []);
    s.get(p.skupina).push(p);
  }
  const skrito = new Set();
  for (const s of sloji.values()) {
    const vseh = [...s.values()].reduce((a, g) => a + g.length, 0);
    const red = [...s.keys()].sort((a, b) => {
      const h = (x) => crypto.createHmac("sha256", kljuc).update(x).digest("hex");
      return h(a) < h(b) ? -1 : 1;
    });
    let n = 0;
    for (const sk of red) {
      if (n >= SKRITO * vseh) break;
      skrito.add(sk);
      n += s.get(sk).length;
    }
  }
  return { razvoj: postavke.filter((p) => !skrito.has(p.skupina)), skrito: postavke.filter((p) => skrito.has(p.skupina)) };
}

const steje = (arr, f) => arr.reduce((o, x) => ((o[f(x)] = (o[f(x)] || 0) + 1), o), {});
export function sestava(razvoj, skrito) {
  const vse = [...razvoj, ...skrito];
  const nabori = {};
  for (const nab of Object.keys(CILJI)) {
    const v = vse.filter((p) => NABOR(p.predmet) === nab);
    const uradnih = v.filter((p) => p.vir.vrsta === "uradno").length;
    nabori[nab] = {
      cilj: CILJI[nab],
      n: v.length,
      uradnih,
      delez_uradnih: v.length ? +(uradnih / v.length).toFixed(3) : 0,
      skritih: v.filter((p) => skrito.includes(p)).length,
      po_predmetu: steje(v, (p) => p.predmet),
      po_viru: steje(v, (p) => (p.vir.vrsta === "uradno" ? `${p.vir.ustanova} ${p.vir.izpit}${p.vir.raven ? " " + p.vir.raven : ""}` : "generator")),
      po_vrsti: steje(v, (p) => p.vrsta),
      po_ravni: steje(v, (p) => (p.tema || "").split("/")[0].split("-").slice(1).join("-") || "?"),
      tem: new Set(v.map((p) => p.tema)).size,
    };
  }
  return { razlicica: 1, nabori };
}

function zgradi(uradnoMapa, izhod) {
  const kljuc = kljucIz(process.env.NABOR_KLJUC);
  const uradneVse = fs
    .readdirSync(uradnoMapa)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .flatMap((f) => JSON.parse(fs.readFileSync(path.join(uradnoMapa, f), "utf8")))
    .map(postavkaUradna)
    .filter(Boolean);
  // Del B mature MAT je skupen osnovni in višji ravni (navodila: »OR in VR«): iz pole VR ostane samo del C, če je
  // prepisana tudi pola OR istega roka. Nato še ponovitve po besedilu.
  const rokiOR = new Set(uradneVse.filter((p) => p.predmet === "MAT" && p.vir.raven === "OR").map((p) => `${p.vir.leto}|${p.vir.rok}`));
  const uradne = uradneVse.filter((p) => !(p.predmet === "MAT" && p.vir.raven === "VR" && /^B/i.test(String(p.vir.naloga)) && rokiOR.has(`${p.vir.leto}|${p.vir.rok}`))).filter(brezPonovitev());
  const uradnihPo = steje(uradne, (p) => NABOR(p.predmet));
  const gen = [
    ...postavkeGeneratorjev(["MAT"], CILJI.MAT - (uradnihPo.MAT || 0), NAPAKE.MAT),
    ...postavkeGeneratorjev(["FIZ", "KEM"], CILJI["FIZ/KEM"] - (uradnihPo["FIZ/KEM"] || 0), NAPAKE["FIZ/KEM"]),
    ...postavkeGeneratorjev(["BIO"], CILJI.BIO - (uradnihPo.BIO || 0), NAPAKE.BIO),
  ];
  const { razvoj, skrito } = razdeli([...uradne, ...gen], kljuc);
  const razvojGen = razvoj.filter((p) => p.vir.vrsta === "generator");
  const razvojUradno = razvoj.filter((p) => p.vir.vrsta === "uradno");
  fs.mkdirSync(izhod, { recursive: true });
  const t = { gen: stabilno(razvojGen), uradno: stabilno(razvojUradno), skrito: stabilno(skrito) };
  fs.writeFileSync(path.join(izhod, "razvoj-generatorji.json"), t.gen);
  fs.writeFileSync(path.join(izhod, "razvoj-uradno.enc"), sifriraj(t.uradno, kljuc));
  fs.writeFileSync(path.join(izhod, "skrito.enc"), sifriraj(t.skrito, kljuc));
  const s = sestava(razvoj, skrito);
  s.sha256 = { "razvoj-generatorji.json": sha(t.gen), "razvoj-uradno (čisto besedilo)": sha(t.uradno), "skrito (čisto besedilo)": sha(t.skrito) };
  // Id-ji razvojnih uradnih postavk so javni (vir brez besedila), skriti ne.
  s.razvoj_uradno_id = razvojUradno.map((p) => p.id);
  fs.writeFileSync(path.join(izhod, "sestava.json"), stabilno(s));
  for (const [nab, v] of Object.entries(s.nabori)) console.log(`${nab}: ${v.n}/${v.cilj}, uradnih ${v.uradnih} (${(v.delez_uradnih * 100).toFixed(1)} %), skritih ${v.skritih}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = process.argv.slice(2);
  const arg = (k) => (a.includes(k) ? a[a.indexOf(k) + 1] : null);
  try {
    if (a.includes("--uradno")) zgradi(arg("--uradno"), arg("--izhod") || MAPA);
    else if (a.includes("--odsifriraj")) fs.writeFileSync(a[a.indexOf("--odsifriraj") + 2], odsifriraj(fs.readFileSync(arg("--odsifriraj"), "utf8"), kljucIz(process.env.NABOR_KLJUC)));
    else {
      console.error("Uporaba: NABOR_KLJUC=… node scripts/nabor-instruktorja.mjs --uradno <mapa> [--izhod <mapa>] | --odsifriraj <vhod.enc> <izhod.json>");
      process.exit(1);
    }
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

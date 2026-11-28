#!/usr/bin/env node
// Status nalog na naših polah mature, NPZ in poklicne mature (PV-11, docs/preverjanje.md). Brez modela AI.
// Za vsak del naloge iz content/exam-papers/*.json preveri rešitve (odgovor, točkovnik, poti rešitve, pravilno izbiro):
//   račun   formula z relacijo: server/lesson-math.js in lesson-identity.js (kot popis PV-04)
//   korak   zaporedni (ne)enačbi z isto edino neznanko v poti rešitve: ukaz SymPy »korak« (PV-06), izbor parov
//           kot pri generatorjih (PV-10, scripts/status-generatorjev.mjs)
// Status naloge je najšibkejši člen vseh njenih trditev (statusOdgovora). »mistake« in napačne izbire so namerno
// napačne in niso trditve.
//
//   node scripts/status-pol.mjs [--pola NPZ9-MAT] [--json p.json] [--porocilo p.md] [--dodatek f.md] [--strogo]
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { trditveIzBesedila } from "./popis-pokritosti.mjs";
import { koraki, casStatus, vrstaKoraka, PRAZEN, vZapisZaKorak, neznanke } from "./status-generatorjev.mjs";
import { wilson } from "./meri-preverjanje.mjs";
import { statusOdgovora, STATUSI } from "../public/preverjanje/statusi.js";

const POLE = fileURLToPath(new URL("../content/exam-papers", import.meta.url));

/** Besedila rešitev enega dela naloge: [{ vir, besedilo }] (pravilna izbira je del rešitve). */
export function resitveDela(part) {
  const out = [];
  if (part.answer) out.push({ vir: "odgovor", besedilo: String(part.answer) });
  if (part.scoring) out.push({ vir: "tockovnik", besedilo: typeof part.scoring === "string" ? part.scoring : JSON.stringify(part.scoring) });
  for (const [i, w] of (part.ways || []).entries()) out.push({ vir: `pot ${i + 1}`, besedilo: String(w.text || "") });
  const prave = new Set(part.correct || []);
  for (const [i, c] of (part.choices || []).entries()) if (prave.has(i)) out.push({ vir: "izbira", besedilo: String(c) });
  return out;
}

const FORMULA = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
const IMPLIKACIJA = /\\(?:Rightarrow|Longrightarrow|implies|Leftrightarrow|iff)|⇒|⇔/;
// besedilo med formulama, ki pove, da druga sledi iz prve (»$4x^2 + x^2 = 180$, torej $5x^2 = 180$«)
// »oziroma« ni veznik: pogosto pomeni »po vrsti« ($2x + 1 = 5$ oziroma $3x - 1 = 8$)
const VEZNIK = /^\s*[,.:;]?\s*(?:torej|sledi|zato|od tod|in zato|dobimo)\s*[,:]?\s*$/i;
// »in« veže le enačbi sredi izpeljave (»…, torej $5x^2 = 180$ in $x^2 = 36$«); pri neenačbah pomeni hkratne pogoje
// ($x + 3 > 0$ in $x - 1 > 0$), na začetku pa seznam (»enačbe $A$, $B$ in $C$«)
const IN = /^\s*,?\s*in\s*$/i;
const RESENA = /^\s*[a-zA-Z]\s*(?:<=|>=|=|<|>)\s*[-\d.()/*^ +sqrtpi]+$/;

/** Kos formule → { zapis, vrsta, x } ali null (natanko ena relacija, ena neznanka, ne začne se z relacijo). */
function kos(tex) {
  const t = String(tex)
    .replace(/\\(?:quad|qquad)/g, " ")
    .replace(/\\[,;!]\s*$/, "")
    .replace(/[.,;]\s*$/, "")
    .trim();
  const z = vZapisZaKorak(t);
  if (!z) return null;
  const rel = z.match(/<=|>=|=|<|>/g) || [];
  if (rel.length !== 1 || /^\s*[<>=]/.test(z) || /[<>=]\s*$/.test(z)) return null;
  const x = neznanke(z);
  return x.length === 1 ? { zapis: z, vrsta: rel[0] === "=" ? "enacba" : "neenacba", x: x[0] } : null;
}

/**
 * Koraki v poti rešitve na poli: kosi ene formule, ločeni z »⇒« (x + 2 = −2 ⇒ x = −4), in zaporedni formuli,
 * med katerima je le veznik (»torej«, »sledi«, »zato«; »in« le med enačbami). Zaporedni enačbi ali neenačbi z »ali«
 * ($y = 3$ ali $y = -3$, $x - 1 = 2$ ali $x - 1 = -2$) sta ena trditev. Rešena oblika ni začetek koraka. Celoštevilske n, k izpustimo.
 */
export function korakiPoti(besedilo) {
  const s = String(besedilo || "");
  const f = [...s.matchAll(FORMULA)].map((m) => ({ tex: m[1] ?? m[2], od: m.index, do: m.index + m[0].length }));
  const verige = [];
  let zadnja = null;
  f.forEach((x, i) => {
    const kosi = x.tex.split(IMPLIKACIJA).map(kos);
    const vmes = i ? s.slice(f[i - 1].do, x.od) : null;
    const ali = vmes != null && /^\s*,?\s*ali\s*$/i.test(vmes);
    if (ali && zadnja && zadnja.length && kosi.length === 1 && kosi[0]) {
      // »$y = 3$ ali $y = -3$«: zadnji kos verige dobi drugo možnost
      const z = zadnja[zadnja.length - 1];
      if (z && z.x === kosi[0].x && z.vrsta === kosi[0].vrsta) {
        zadnja[zadnja.length - 1] = { ...z, zapis: `${z.zapis} ali ${kosi[0].zapis}`, ali: true };
        return;
      }
    }
    // »in« le sredi izpeljave (veriga ima že korak): »enačbe $A$, $B$ in $C$« je seznam, ne korak
    const enacbe = zadnja && zadnja.length > 1 && zadnja[zadnja.length - 1]?.vrsta === "enacba" && kosi.every((k) => k?.vrsta === "enacba");
    if (vmes != null && zadnja && !zadnja.pogoji && (VEZNIK.test(vmes) || (IN.test(vmes) && enacbe))) zadnja.push(...kosi);
    else {
      // »$x - 2 > 0$ in $x + 1 > 0$, torej $x > 2$«: sklep sledi iz obeh pogojev, ne iz zadnjega
      const pogoji = vmes != null && zadnja && IN.test(vmes);
      zadnja = [...kosi];
      if (pogoji) zadnja.pogoji = true;
      verige.push(zadnja);
    }
  });
  const out = [];
  for (const v of verige)
    for (let i = 0; i + 1 < v.length; i++) {
      const a = v[i];
      const b = v[i + 1];
      if (!a || !b || a.x !== b.x || a.vrsta !== b.vrsta || /^[nk]$/.test(a.x)) continue;
      // »$x - 2 > 0$ in $x + 1 > 0 \Rightarrow x > -1$«: zadnji pogoj ni premisa sklepa
      if (v.pogoji && i === 0) continue;
      if (!a.ali && RESENA.test(a.zapis)) continue;
      out.push({ prej: a.zapis, potem: b.zapis, neznanka: a.x, tex: `${a.zapis} → ${b.zapis}` });
    }
  return out;
}

/** Trditve enega dela: [{ vir: racun|korak, kje, tex, status, why?, vrsta? }]. */
export async function trditveDela(part, { cas = null } = {}) {
  const out = [];
  for (const r of resitveDela(part)) {
    for (const x of trditveIzBesedila(r.besedilo)) out.push({ vir: "racun", kje: r.vir, tex: x.tex, status: x.status });
    if (!cas || !r.vir.startsWith("pot")) continue;
    const vsi = new Map();
    for (const k of [...koraki(r.besedilo), ...korakiPoti(r.besedilo)]) vsi.set(`${k.prej}|${k.potem}`, k);
    for (const k of vsi.values()) {
      const v = await vrstaKoraka(cas, k);
      if (v === "ni") continue;
      if (v === "prazen") {
        out.push({ vir: "korak", kje: r.vir, tex: k.tex.slice(0, 160), status: "nepreverjeno", why: PRAZEN, vrsta: "prazen" });
        continue;
      }
      const c = await cas.casCheck("korak", [k.prej, k.potem, k.neznanka, ""]);
      out.push({ vir: "korak", kje: r.vir, tex: k.tex.slice(0, 160), status: casStatus(c, k), why: c.why || "", vrsta: c.vrsta || null, par: k });
    }
  }
  return out;
}

/**
 * Vstavljena napaka v formulo koraka: zadnje celo število v zapisu poveča za 1 (x = 4 → x = 5,
 * 5x^2 = 180 → 5x^2 = 181). Vrne null, če zapis nima števila. Le za merjenje zaznavanja napak.
 */
export function mutiraj(potem) {
  const m = [...String(potem).matchAll(/\d+/g)].pop();
  if (!m) return null;
  return potem.slice(0, m.index) + String(Number(m[0]) + 1) + potem.slice(m.index + m[0].length);
}

/**
 * Zaznavanje napak na resničnih korakih pol: vsak potrjen korak (izracunano) dobi vstavljeno napako (mutiraj) enkrat
 * v drugi formuli (»potem«) in enkrat v prvi (»prej«; ujame prazne premise in nadmnožice).
 * ujete = napaka; napacnoPotrjene = spremenjeni korak še vedno potrjen; ostalo brez statusa.
 */
export async function izmeriMutacije(pole, { cas }) {
  const izidi = [];
  for (const pl of pole)
    for (const n of pl.naloge)
      for (const t of n.trditve) {
        if (t.vir !== "korak" || t.status !== "izracunano" || !t.par) continue;
        for (const [vrsta, prej, potem] of [["potem", t.par.prej, mutiraj(t.par.potem)], ["prej", mutiraj(t.par.prej), t.par.potem]]) {
          if (!prej || !potem) continue;
          const k = { ...t.par, prej, potem, tex: `${prej} → ${potem}` };
          const v = await vrstaKoraka(cas, k);
          if (v === "ni") continue; // pokvarjena premisa brez rešitve (in sklep prav tako): ni korak
          const c = v === "prazen" ? { ok: null, why: PRAZEN } : await cas.casCheck("korak", [k.prej, k.potem, k.neznanka, ""]);
          izidi.push({ pola: pl.id, n: n.n, oznaka: n.oznaka, vrsta, tex: k.tex, status: casStatus(c, k), why: c.why || "" });
        }
      }
  return {
    izidi,
    vstavljenih: izidi.length,
    ujete: izidi.filter((x) => x.status === "napaka").length,
    napacnoPotrjene: izidi.filter((x) => x.status === "izracunano" || x.status === "numericno").length,
    poVrsti: Object.fromEntries(
      ["potem", "prej"].map((v) => {
        const i = izidi.filter((x) => x.vrsta === v);
        return [v, { vstavljenih: i.length, ujete: i.filter((x) => x.status === "napaka").length, napacnoPotrjene: i.filter((x) => x.status === "izracunano" || x.status === "numericno").length }];
      }),
    ),
  };
}

const STEVILO = /-?\d+(?:\.\d+)?/g;
/** Števila v zapisu: decimalna vejica le kot {,}; brez indeksov, eksponentov in besedila (C₆H₁₂, cm², \text{2 cm}). */
const stevila = (tex) =>
  String(tex)
    .replace(/\\(?:mathrm|text|textrm|operatorname)\s*\{(?:[^{}]|\{[^{}]*\})*\}/g, " ")
    .replace(/[_^]\s*(?:\{(?:[^{}]|\{[^{}]*\})*\}|\\?[A-Za-z0-9])/g, " ")
    .replace(/(\d)\{,\}(\d)/g, "$1.$2")
    .replace(/(\d)(?:\\[ ,;]|\{\}|~)(?=\d{3}(?!\d))/g, "$1")
    .match(STEVILO)
    ?.map(Number) || [];

/** Rezultati trditve: števila na desni strani zadnje relacije (pri »ali« vsake možnosti), pri koraku v drugi formuli. */
const rezultati = (tex) =>
  String(tex)
    .split("→")
    .pop()
    .split(/\s+ali\s+/)
    .flatMap((d) => stevila(d.split(/<=|>=|=|<|>|≈|\\approx/).pop()));

// besede, ki smejo stati ob številskem odgovoru zunaj formule (enote in vezniki)
const DOVOLJENE = /\b(?:ali|in|cm|mm|dm|km|m|kg|dag|g|mg|s|min|h|ml|mL|dl|l|L|kWh|Wh|J|kJ|N|Pa|kPa|W|V|A|K|mol|stopinj|EUR|evrov|točk|točke|let|dni|ur)\b|[€%°²³]/g;

/**
 * Pokritost končnega odgovora dela: vsako število v odgovoru mora biti rezultat katere od preverjenih trditev dela.
 * Odgovor z izbirno črko ali z besedami zunaj formul (»C – Klinefelter (47,XXY)«) ni preverjen, tudi če so vmesni
 * računi pravilni; prav tako odgovor brez števila ali s številom, ki ga noben preverjen račun ne da (pregled PV-11).
 * Vrne trditev »odgovor« s statusom nepreverjeno ali null (odgovor je pokrit).
 */
export function pokritostOdgovora(part, trditve) {
  const izbira = (part.correct || []).length > 0;
  const odgovor = [part.answer, ...(part.choices || []).filter((_, i) => (part.correct || []).includes(i))].filter(Boolean).join(" ");
  const ok = trditve.filter((x) => x.status !== "nepreverjeno" && x.status !== "napaka");
  const nepokrit = (why) => ({ vir: "odgovor", kje: "odgovor", tex: String(odgovor).slice(0, 120), status: "nepreverjeno", why });
  if (!ok.length) return nepokrit("del brez preverjene trditve");
  // zunaj formul smejo biti enote in največ dve besedi za formulo na začetku (»$47$ kromosomov«), ne opis
  const besede = String(odgovor)
    .replace(/\$\$[\s\S]*?\$\$|\$[^$]*\$/g, " ")
    .replace(DOVOLJENE, " ")
    .match(/[A-Za-zčšžČŠŽćđĆĐ]+/g) || [];
  const opis = besede.length > 2 || (besede.length > 0 && !/^\s*\$/.test(String(part.answer || "")));
  if (izbira || /^\W*\**[A-E]\**\s*[–—:).-]/.test(String(odgovor)) || opis) return nepokrit("odgovor z izbiro ali besedami");
  const v = stevila(odgovor);
  if (!v.length) return nepokrit("odgovor brez števila");
  const r = ok.flatMap((x) => rezultati(x.tex));
  const enako = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a));
  if (v.every((a) => r.some((b) => enako(a, b)))) return null;
  return nepokrit("odgovor ni rezultat preverjene trditve");
}

export async function popisPol({ predpona = "", cas = null } = {}) {
  const pole = [];
  for (const f of readdirSync(POLE).sort()) {
    if (!f.endsWith(".json") || !f.startsWith(predpona)) continue;
    const p = JSON.parse(readFileSync(join(POLE, f), "utf8"));
    const naloge = [];
    for (const task of p.tasks || []) {
      const trditve = [];
      for (const part of task.parts || []) {
        const td = (await trditveDela(part, { cas })).map((x) => ({ ...x, del: part.id || "" }));
        const o = pokritostOdgovora(part, td);
        trditve.push(...td, ...(o ? [{ ...o, del: part.id || "" }] : []));
      }
      const tocke = (task.parts || []).reduce((s, x) => s + (Number(x.points) || 0), 0);
      // oznaka: pola, sklop (A/B na maturi) in številka, da je naloga v poročilu enolična
      const oznaka = [(p.polas || [1]).length > 1 && task.pola != null ? `${task.pola}/` : "", task.section ? `${task.section}` : "", task.n].join("");
      naloge.push({ pola: task.pola ?? null, sklop: task.section ?? null, n: task.n, oznaka, tocke, delov: (task.parts || []).length, status: statusOdgovora(trditve.map((x) => x.status)), trditve });
    }
    pole.push({ id: p.id, predmet: p.subject || "", polas: (p.polas || [1]).length, naloge });
  }
  return pole;
}

const tocke = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const odst = (x) => `${(100 * x).toFixed(1).replace(".", ",")} %`;
const ki = (k, n) => {
  const w = wilson(k, n);
  return `${tocke(k)}/${tocke(n)} (${n ? odst(k / n) : "–"}; 95-% interval ${w ? `${odst(w[0])}–${odst(w[1])}` : "–"})`;
};

export function povzemi(pole) {
  const nal = pole.flatMap((p) => p.naloge);
  const trd = nal.flatMap((n) => n.trditve);
  const poViru = {};
  for (const v of ["racun", "korak"]) {
    const t = trd.filter((x) => x.vir === v);
    poViru[v] = Object.fromEntries([["vse", t.length], ...STATUSI.map((s) => [s, t.filter((x) => x.status === s).length])]);
  }
  return {
    pol: pole.length,
    izpitnihPol: pole.reduce((s, p) => s + p.polas, 0),
    nalog: nal.length,
    poStatusu: Object.fromEntries(STATUSI.map((s) => [s, nal.filter((n) => n.status === s).length])),
    tockPoStatusu: Object.fromEntries(STATUSI.map((s) => [s, nal.filter((n) => n.status === s).reduce((a, n) => a + n.tocke, 0)])),
    tock: nal.reduce((a, n) => a + n.tocke, 0),
    poViru,
  };
}

const KRATKO = { dokazano: "dok", izracunano: "izr", numericno: "num", delno: "del", v_teku: "tek", napaka: "NAP", nepreverjeno: "–" };

export function porocilo(pole, { datum, commit, ukaz = "", dodatek = "", mutacije = null }) {
  const p = povzemi(pole);
  const v = [];
  v.push(`# Status nalog na polah (PV-11), ${datum}`, "");
  v.push(`- Commit: \`${commit}\`; ukaz: \`${ukaz}\`; brez modela AI; SymPy prek server/cas.js (ukaz korak, PV-06)`);
  v.push(`- Vir: ${p.pol} pol (${p.izpitnihPol} izpitnih pol) v content/exam-papers, ${tocke(p.nalog)} nalog, ${tocke(p.tock)} točk. Imenovalec deležev so naloge.`);
  v.push("- Status naloge je najšibkejši člen trditev »račun« in »korak« v odgovoru, točkovniku, poteh rešitve in pravilni izbiri.");
  v.push("  Naloga brez statusa ni napačna: noben program je ne preveri (besedilne rešitve, grafi, izbire).", "");
  v.push("## Naloge po statusu", "");
  v.push("| Status | Nalog | Točk |", "| --- | --- | --- |");
  for (const s of STATUSI) if (s !== "v_teku" && s !== "dokazano") v.push(`| ${s} | ${ki(p.poStatusu[s], p.nalog)} | ${tocke(p.tockPoStatusu[s])} |`);
  v.push("", "## Trditve po viru", "");
  v.push("| Vir | Trditev | izracunano | numericno | delno | napaka | nepreverjeno |", "| --- | --- | --- | --- | --- | --- | --- |");
  for (const [k, s] of Object.entries(p.poViru)) v.push(`| ${k} | ${tocke(s.vse)} | ${tocke(s.izracunano)} | ${tocke(s.numericno)} | ${tocke(s.delno)} | ${tocke(s.napaka)} | ${tocke(s.nepreverjeno)} |`);
  if (mutacije) {
    v.push("", "## Zaznavanje vstavljenih napak", "");
    v.push("Vsak potrjen korak smo pokvarili dvakrat: zadnje celo število v drugi formuli koraka (»potem«) in posebej v prvi");
    v.push("(»prej«) se poveča za 1 (x = 4 → x = 5). Pokvarjena prva formula preizkusi tudi prazne premise in nadmnožice.", "");
    v.push(`- Skupaj ujete: ${ki(mutacije.ujete, mutacije.vstavljenih)}; napačno potrjene: ${ki(mutacije.napacnoPotrjene, mutacije.vstavljenih)}.`);
    for (const [k, x] of Object.entries(mutacije.poVrsti || {})) v.push(`- Pokvarjena formula »${k}«: ujete ${ki(x.ujete, x.vstavljenih)}; napačno potrjene ${tocke(x.napacnoPotrjene)}.`);
    const os = mutacije.izidi.filter((x) => x.status !== "napaka");
    for (const x of os) v.push(`- ${x.status} (${x.vrsta}): \`${x.pola}\` naloga ${x.oznaka}: \`${x.tex.replace(/`/g, "'").slice(0, 160)}\`${x.why ? ` (${x.why})` : ""}`);
  }
  v.push("", "## Zaznane napake", "");
  const nap = pole.flatMap((pl) => pl.naloge.flatMap((n) => n.trditve.filter((x) => x.status === "napaka").map((x) => ({ pl: pl.id, n, ...x }))));
  if (!nap.length) v.push("Nobene.");
  for (const x of nap) v.push(`- \`${x.pl}\` naloga ${x.n.oznaka}${x.del} (${x.vir}, ${x.kje}): \`${x.tex.replace(/`/g, "'").slice(0, 200)}\`${x.why ? ` (${x.why})` : ""}`);
  v.push("", "## Koraki z izgubljeno posamezno rešitvijo", "");
  v.push("Pravilni le, če izgubljeno rešitev izloči kontekst naloge. Brez statusa.", "");
  const izg = pole.flatMap((pl) => pl.naloge.flatMap((n) => n.trditve.filter((x) => x.vrsta === "izguba" && x.status !== "napaka").map((x) => ({ pl: pl.id, n, ...x }))));
  if (!izg.length) v.push("Nobenega.");
  for (const x of izg) v.push(`- \`${x.pl}\` naloga ${x.n.oznaka}${x.del}: \`${x.tex.replace(/`/g, "'")}\` (${x.why})`);
  if (dodatek) v.push("", dodatek.trim());
  v.push("", "## Po polah", "");
  v.push("| Pola | Nalog | izracunano | numericno | delno | napaka | brez statusa |", "| --- | --- | --- | --- | --- | --- | --- |");
  for (const pl of pole) {
    const c = (s) => pl.naloge.filter((n) => n.status === s).length;
    v.push(`| ${pl.id} | ${pl.naloge.length} | ${c("izracunano")} | ${c("numericno")} | ${c("delno")} | ${c("napaka")} | ${c("nepreverjeno")} |`);
  }
  v.push("", "## Po nalogah", "");
  v.push("Status naloge (izr izračunano, num numerično, del delno, NAP napaka, – brez statusa) ter preverjene/vse trditve.", "");
  for (const pl of pole) {
    const vrstica = pl.naloge.map((n) => `${n.oznaka} ${KRATKO[n.status]} ${n.trditve.filter((x) => x.status !== "nepreverjeno").length}/${n.trditve.length}`);
    v.push(`- **${pl.id}**: ${vrstica.join(" · ")}`);
  }
  v.push("", "## Omejitve", "");
  v.push("- »korak« preveri le pare (ne)enačb z isto eno neznanko: sosednji čisti vrstici (PV-10) ter verige z »⇒« in vezniki");
  v.push("  v besedilu poti. Par, kjer ni prva ne druga formula rešljiva (∅ → ∅), ni korak in ni štet. Posledica (korak, ki doda");
  v.push("  rešitev, npr. kvadriranje) šteje za pravilen korak; tuje rešitve izloči preizkus v rešitvi.");
  v.push("- Status »numerično« naloge pomeni: vsak del ima končni odgovor, ki je rezultat preverjene trditve, in vse trditve so");
  v.push("  pravilne. Odgovor s črko ali besedo je brez statusa, zato je taka naloga največ »delno«.");
  v.push("- Besedilne utemeljitve, skice, grafi in izbirni odgovori brez formule ostanejo brez statusa.");
  v.push("- Odgovor in točkovnik preračuna tudi test pol (server/our-papers.js); to poročilo ga ne ponavlja.");
  v.push("");
  return v.join("\n");
}

async function main(argv) {
  const opt = (ime, privzeto = null) => {
    const i = argv.indexOf(ime);
    return i >= 0 ? argv[i + 1] : privzeto;
  };
  const cas = await import("../server/cas.js");
  if (!(await cas.casAvailable())) {
    console.error("SymPy ni na voljo");
    return 1;
  }
  const pole = await popisPol({ predpona: opt("--pola", ""), cas });
  const p = povzemi(pole);
  console.log(JSON.stringify(p));
  const { izidi: _izidi, ...mut } = await izmeriMutacije(pole, { cas });
  console.log("Vstavljene napake:", JSON.stringify(mut));
  const j = opt("--json");
  if (j)
    writeFileSync(
      j,
      JSON.stringify({
        povzetek: p,
        mutacije: { ...mut, izidi: _izidi.filter((x) => x.status !== "napaka") },
        pole: pole.map((pl) => ({ ...pl, naloge: pl.naloge.map((n) => ({ ...n, trditve: n.trditve.filter((x) => x.status === "napaka" || x.vrsta === "izguba").map(({ par: _p, ...x }) => x), stTrditev: n.trditve.length })) })),
      }) + "\n",
    );
  const r = opt("--porocilo");
  if (r) {
    let commit = "";
    try {
      commit = execSync("git rev-parse HEAD").toString().trim();
    } catch {}
    const dodatek = opt("--dodatek") ? readFileSync(opt("--dodatek"), "utf8") : "";
    writeFileSync(r, porocilo(pole, { datum: new Date().toISOString().slice(0, 10), commit, ukaz: `node scripts/status-pol.mjs ${argv.join(" ")}`, dodatek, mutacije: { ...mut, izidi: _izidi } }));
  }
  let koda = 0;
  if (argv.includes("--strogo")) {
    if (cas.casIzpadi().skupaj) {
      console.error("SymPy ni odgovoril na vse zahteve:", JSON.stringify(cas.casIzpadi()));
      koda = 1;
    }
    if (mut.napacnoPotrjene) {
      console.error("Vstavljene napake: napačno potrjeni koraki");
      koda = 1;
    }
  }
  cas.casStop();
  return koda;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) process.exit(await main(process.argv.slice(2)));

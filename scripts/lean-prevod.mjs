#!/usr/bin/env node
// Meritev prevoda v Lean (PV-13, docs/preverjanje.md »Prevod v Lean«). Brez AI.
//   1. Referenčni nabor (nabor-v2.json): vsako trditev prevede server/preverjanje/lean-prevod.js, izrek se prebere
//      nazaj in primerja z izvirnikom (lean-obratno.js), nato ga Lean poskusi dokazati z vsako predlogo (vsaka
//      predloga je svoj izrek, za njim #print axioms).
//   2. Bloki RACUN v lekcijah (--lekcije): isto, resnica ni označena (koliko trditev lekcij Lean dokaže).
//   3. Nabor napačnih in pravilnih prevodov (lean-formalizacije-v1.json): ali primerjava ujame napačne prevode.
//
//   node scripts/lean-prevod.mjs [--nabor pot] [--lekcije] [--projekt lean] [--json p.json] [--porocilo p.md]
//                                [--strogo] [--samo-prevod] [--mapa dir] [--del 80] [--vzporedno 4] [--nedokazane]
//
// Merila (docs/meritve/README.md, imenovalec pri vsakem): prevedene / vse; dokazane / ustrezne pravilne (»najvec« ni
// pod »dokazano«); napačno dokazane / prevedene napačne = 0; neskladni prevodi = 0; tuji aksiomi = 0; zaznani napačni
// prevodi / napačni prevodi; sprejeti pravilni prevodi / pravilni prevodi.
// --strogo: izhod 1, če je kaj napačno dokazanega, neskladnega, s tujim aksiomom, če je dokazanih ustreznih pravilnih
// < 95 % ali če primerjava spusti kateri napačen prevod.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve, relative } from "node:path";
import { prevedi } from "../server/preverjanje/lean-prevod.js";
import { skladnost } from "../server/preverjanje/lean-obratno.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DOVOLJENI = new Set(["propext", "Classical.choice", "Quot.sound"]);
const PREPOVEDANO = /\b(sorry|admit|axiom|native_decide|implemented_by|extern|unsafe|ofReduceBool|skipKernelTC|import|set_option)\b|#/;
const FORMALIZACIJE = join(ROOT, "test/fixtures/preverjanje/lean-formalizacije-v1.json");

export function wilson(k, n, z = 1.96) {
  if (!n) return [0, 1];
  const p = k / n;
  const d = 1 + (z * z) / n;
  const c = (p + (z * z) / (2 * n)) / d;
  const h = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / d;
  return [Math.max(0, c - h), Math.min(1, c + h)];
}

/** Datoteka Lean: vsaka predloga je izrek pv_<i>_<j>, za njim #print axioms. Vrne { besedilo, izreki }. */
export function datotekaLean(prevodi) {
  const vrstice = ["import Mathlib", "set_option autoImplicit false", "set_option maxHeartbeats 400000", "set_option maxErrors 100000", ""];
  const izreki = [];
  prevodi.forEach((p, i) => {
    p.dokazi.forEach((d, j) => {
      if (PREPOVEDANO.test(d) || PREPOVEDANO.test(p.izrek) || /[\r\n]/.test(p.izrek)) throw new Error(`prepovedana beseda v prevodu ${p.id}`);
      const ime = `pv_${i}_${j}`;
      const zacetek = vrstice.length + 1;
      vrstice.push(`theorem ${ime} : ${p.izrek} := by`, ...d.split("\n").map((v) => `  ${v}`));
      const konec = vrstice.length;
      vrstice.push(`#print axioms ${ime}`, "");
      izreki.push({ i, j, ime, zacetek, konec, aksiomi: konec + 1 });
    });
  });
  return { besedilo: vrstice.join("\n"), izreki };
}

/** Izid iz izpisa `lean --json`: izrek je dokazan, ko v njegovih vrsticah ni napake in stoji le na dovoljenih aksiomih. */
export function preberiIzpis(izpis, izreki) {
  const sporocila = [];
  for (const v of String(izpis).split("\n")) {
    if (!v.trim().startsWith("{")) continue;
    try {
      sporocila.push(JSON.parse(v));
    } catch {
      /* nepopolna vrstica */
    }
  }
  return izreki.map((t) => {
    const v = sporocila.filter((m) => m.pos && m.pos.line >= t.zacetek && m.pos.line <= t.konec);
    const napaka = v.find((m) => m.severity === "error" || /sorry/i.test(String(m.data)));
    const ax = sporocila.find((m) => m.pos?.line === t.aksiomi && String(m.data).includes(`'${t.ime}'`));
    let aksiomi = null;
    if (ax) {
      const d = String(ax.data);
      if (d.includes("does not depend on any axioms")) aksiomi = [];
      else {
        const m = d.match(/depends on axioms: \[([^\]]*)\]/);
        if (m) aksiomi = m[1].split(",").map((a) => a.trim()).filter(Boolean);
      }
    }
    const tuji = napaka ? [] : (aksiomi || []).filter((a) => !DOVOLJENI.has(a));
    return { ...t, dokazano: !napaka && aksiomi != null && !tuji.length, tuji, napaka: napaka ? String(napaka.data).slice(0, 300) : null };
  });
}

/** Prevod vseh trditev: { prevodi, zunaj, neskladni }. Trditev: { id, racun, skupina?, pravilno?, najvec? }. */
export function prevediVse(trditve) {
  const prevodi = [];
  const zunaj = {};
  const neskladni = [];
  for (const p of trditve) {
    const r = p.racun ? prevedi(p.racun) : { ok: false, razlog: "brez zapisa" };
    if (!r.ok) {
      zunaj[r.razlog] = (zunaj[r.razlog] || 0) + 1;
      continue;
    }
    const s = skladnost(p.racun, r.izrek);
    if (!s.skladno) neskladni.push({ id: p.id, razlog: s.razlog, izrek: r.izrek });
    // »najvec« pod »dokazano« (zaokrožen odgovor): trditev ni točna, zato ni ustrezna za formalni dokaz
    const ustrezna = !p.najvec || p.najvec === "dokazano";
    prevodi.push({ id: p.id, skupina: p.skupina || r.vrsta, pravilno: p.pravilno, ustrezna, vrsta: r.vrsta, izrek: r.izrek, dokazi: s.skladno ? r.dokazi : [] });
  }
  return { prevodi, zunaj, neskladni };
}

/** Lean na vseh prevodih (po delih, vzporedno). Vrne prevode z dokazano, predloga, tuji, napaka. */
export async function dokazi(prevodi, { projekt, mapa, velikost = 80, vzporedno = 4 }) {
  mkdirSync(mapa, { recursive: true });
  const deli = [];
  for (let z = 0; z < prevodi.length; z += velikost) {
    const { besedilo, izreki } = datotekaLean(prevodi.slice(z, z + velikost));
    const pot = join(mapa, `Del${deli.length}.lean`);
    writeFileSync(pot, besedilo);
    deli.push({ pot, izreki: izreki.map((t) => ({ ...t, i: t.i + z })) });
  }
  const zazeni = (d) =>
    new Promise((ok, ne) =>
      execFile("lake", ["env", "lean", "--json", d.pot], { cwd: projekt, encoding: "utf8", maxBuffer: 256 << 20, timeout: 30 * 60 * 1000 }, (e, stdout, stderr) => {
        if (e && !String(stdout || "").trim()) return ne(new Error(`Lean ni tekel za ${d.pot}: ${String(stderr || e.message).slice(0, 500)}`));
        ok(preberiIzpis(stdout, d.izreki));
      }),
    );
  const izidi = [];
  for (let z = 0; z < deli.length; z += vzporedno) izidi.push(...(await Promise.all(deli.slice(z, z + vzporedno).map(zazeni))).flat());
  return prevodi.map((p, i) => {
    const moji = izidi.filter((t) => t.i === i);
    const zmaga = moji.find((t) => t.dokazano);
    return { ...p, dokazano: !!zmaga, predloga: zmaga ? zmaga.j : null, tuji: moji.flatMap((t) => t.tuji), napaka: zmaga ? null : moji[0]?.napaka || (p.dokazi.length ? null : "ni predloge") };
  });
}

/** Trditve iz blokov RACUN v lekcijah (server/racun.js parseClaims). */
export async function trditveLekcij() {
  const { parseClaims } = await import("../server/racun.js");
  const out = [];
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith(".md")) {
        const besedilo = readFileSync(p, "utf8");
        parseClaims(besedilo, Infinity).forEach((c, i) => out.push({ id: `${relative(join(ROOT, "content/lessons"), p)}#${i + 1}`, racun: [c.op, c.args], skupina: relative(join(ROOT, "content/lessons"), dirname(p)) }));
      }
    }
  };
  walk(join(ROOT, "content/lessons"));
  return out;
}

/** Primerjava na naboru napačnih in pravilnih prevodov (brez Leana). */
export function merjenjeFormalizacij(pot = FORMALIZACIJE) {
  if (!existsSync(pot)) return null;
  const primeri = JSON.parse(readFileSync(pot, "utf8")).primeri;
  const napacni = primeri.filter((p) => p.skladno === false);
  const pravilni = primeri.filter((p) => p.skladno === true);
  const spuscen = napacni.filter((p) => skladnost(p.racun, p.izrek).skladno);
  const zavrnjen = pravilni.map((p) => ({ ...p, razlog: skladnost(p.racun, p.izrek).razlog })).filter((p) => p.razlog);
  const poVrsti = {};
  for (const p of napacni) {
    const g = (poVrsti[p.napaka || "?"] ||= { n: 0, ujeti: 0 });
    g.n++;
    if (!spuscen.includes(p)) g.ujeti++;
  }
  return { napacni: napacni.length, ujeti: napacni.length - spuscen.length, spusceni: spuscen, pravilni: pravilni.length, sprejeti: pravilni.length - zavrnjen.length, zavrnjeni: zavrnjen, poVrsti };
}

const pct = (k, n) => (n ? ((100 * k) / n).toFixed(1).replace(".", ",") : "–");
const ci = (k, n) =>
  wilson(k, n)
    .map((x) => (100 * x).toFixed(1).replace(".", ","))
    .join("–");
const vrsticaMerila = (ime, k, n) => `| ${ime} | ${k}/${n} | ${pct(k, n)} | ${ci(k, n)} |`;

function povzetekNabora(nabor, { prevodi, zunaj, neskladni }) {
  const prav = prevodi.filter((p) => p.pravilno !== false && p.ustrezna);
  const priblizne = prevodi.filter((p) => p.pravilno !== false && !p.ustrezna);
  const narobe = prevodi.filter((p) => p.pravilno === false);
  return {
    vse: nabor.length,
    prevedene: prevodi.length,
    pravilne: prav.length,
    dokazanePravilne: prav.filter((p) => p.dokazano).length,
    priblizne: priblizne.length,
    dokazanePriblizne: priblizne.filter((p) => p.dokazano).length,
    napacne: narobe.length,
    napacnoDokazane: narobe.filter((p) => p.dokazano).map((p) => p.id),
    neskladni: neskladni.length,
    tujiAksiomi: prevodi.filter((p) => p.tuji?.length).map((p) => p.id),
    zunaj,
  };
}

function porocilo({ nabor, lekcije, formalizacije, poSkupinah }) {
  const s = nabor;
  const v = [
    "# Prevod trditev v Lean (PV-13)",
    "",
    "Ustvari `node scripts/lean-prevod.mjs --lekcije --porocilo …` (brez AI; Lean 4.36, Mathlib v4.36.0). Pri vsakem",
    "merilu je imenovalec, interval je Wilsonov 95-%.",
    "",
    "## Referenčni nabor (nabor-v2.json, 1.020 trditev)",
    "",
    "| Merilo | k/n | % | 95 % interval |",
    "|---|---|---|---|",
    vrsticaMerila("Prevedene trditve (v obsegu prevoda) / vse", s.prevedene, s.vse),
    vrsticaMerila("Dokazane / prevedene pravilne točne", s.dokazanePravilne, s.pravilne),
    vrsticaMerila("Napačno dokazane / prevedene napačne", s.napacnoDokazane.length, s.napacne),
    vrsticaMerila("Neskladni prevodi / prevedene", s.neskladni, s.prevedene),
    vrsticaMerila("Tuji aksiomi / prevedene", s.tujiAksiomi.length, s.prevedene),
    "",
    `Zaokroženi odgovori (»najvec« pod »dokazano«, npr. 0,414 za 1 − √2) se prevedejo točno in ostanejo nedokazani: ${s.dokazanePriblizne} od ${s.priblizne} dokazanih.`,
    "",
    "| Skupina | prevedene | dokazane pravilne | napačno dokazane |",
    "|---|---|---|---|",
    ...Object.entries(poSkupinah)
      .sort()
      .map(([k, g]) => `| ${k} | ${g.n} | ${g.dok}/${g.prav} | ${g.dokNarobe}/${g.narobe} |`),
    "",
    "Zunaj obsega prevoda (ostanejo pri SymPy):",
    "",
    "| Razlog | trditev |",
    "|---|---|",
    ...Object.entries(s.zunaj)
      .sort((a, b) => b[1] - a[1])
      .map(([k, n]) => `| ${k} | ${n} |`),
    "",
  ];
  if (formalizacije) {
    const f = formalizacije;
    v.push(
      "## Napačni prevodi (lean-formalizacije-v1.json)",
      "",
      "Nabor je napisal ločen model AI brez branja kode primerjave (ne človek).",
      "",
      "| Merilo | k/n | % | 95 % interval |",
      "|---|---|---|---|",
      vrsticaMerila("Zaznani napačni prevodi / napačni", f.ujeti, f.napacni),
      vrsticaMerila("Sprejeti pravilni prevodi / pravilni", f.sprejeti, f.pravilni),
      "",
      "| Vrsta napake | zaznani |",
      "|---|---|",
      ...Object.entries(f.poVrsti)
        .sort()
        .map(([k, g]) => `| ${k} | ${g.ujeti}/${g.n} |`),
      "",
    );
    if (f.zavrnjeni.length) v.push("Zavrnjeni pravilni prevodi (lažni alarm, prevod ostane brez dokaza):", "", ...f.zavrnjeni.map((p) => `- ${p.id}: ${p.razlog}`), "");
  }
  if (lekcije) {
    const l = lekcije;
    v.push(
      "## Bloki RACUN v lekcijah",
      "",
      "Resnica ni označena; SymPy je te trditve že preveril (PV-04). Lean dokaže samo resnične trditve.",
      "",
      "| Merilo | k/n | % | 95 % interval |",
      "|---|---|---|---|",
      vrsticaMerila("Prevedene / vse trditve RACUN", l.prevedene, l.vse),
      vrsticaMerila("Dokazane / prevedene", l.dokazane, l.prevedene),
      vrsticaMerila("Neskladni prevodi / prevedene", l.neskladni, l.prevedene),
      "",
    );
    if (l.nedokazane.length) v.push("Nedokazane prevedene trditve lekcij (prvih 30):", "", ...l.nedokazane.slice(0, 30).map((p) => `- ${p.id}: \`${p.racun}\``), "");
  }
  return v.join("\n");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const arg = (k, d = null) => {
    const i = process.argv.indexOf(k);
    return i >= 0 ? process.argv[i + 1] : d;
  };
  const ima = (k) => process.argv.includes(k);
  const projekt = resolve(arg("--projekt", join(ROOT, "lean")));
  const mapa = resolve(arg("--mapa", join(projekt, ".lake", "prevod")));
  const moznosti = { projekt, velikost: Number(arg("--del", 80)), vzporedno: Number(arg("--vzporedno", 4)) };
  const nabor = JSON.parse(readFileSync(resolve(arg("--nabor", join(ROOT, "test/fixtures/preverjanje/nabor-v2.json"))), "utf8")).primeri;
  const pn = prevediVse(nabor);
  if (!ima("--samo-prevod")) pn.prevodi = await dokazi(pn.prevodi, { ...moznosti, mapa: join(mapa, "nabor") });
  const s = povzetekNabora(nabor, pn);
  const poSkupinah = {};
  for (const p of pn.prevodi) {
    const g = (poSkupinah[p.skupina] ||= { n: 0, prav: 0, dok: 0, narobe: 0, dokNarobe: 0 });
    g.n++;
    if (p.pravilno === false) {
      g.narobe++;
      if (p.dokazano) g.dokNarobe++;
    } else if (p.ustrezna) {
      g.prav++;
      if (p.dokazano) g.dok++;
    }
  }
  console.log(`Nabor: prevedenih ${s.prevedene}/${s.vse} (${pct(s.prevedene, s.vse)} %)`);
  console.log(`  dokazanih pravilnih točnih ${s.dokazanePravilne}/${s.pravilne} (${pct(s.dokazanePravilne, s.pravilne)} %, 95 % interval ${ci(s.dokazanePravilne, s.pravilne)} %)`);
  console.log(`  napačno dokazanih ${s.napacnoDokazane.length}/${s.napacne} (95 % interval ${ci(s.napacnoDokazane.length, s.napacne)} %)`);
  console.log(`  neskladnih prevodov ${s.neskladni}, tujih aksiomov ${s.tujiAksiomi.length}, zaokroženih dokazanih ${s.dokazanePriblizne}/${s.priblizne}`);
  for (const n of pn.neskladni.slice(0, 20)) console.log("  NESKLADNO", n.id, n.razlog);
  for (const id of s.napacnoDokazane) console.log("  NAPAČNO DOKAZANO", id);
  if (ima("--nedokazane")) for (const p of pn.prevodi.filter((p) => p.pravilno !== false && p.ustrezna && !p.dokazano)) console.log("  NEDOKAZANO", p.id, p.izrek, "|", (p.napaka || "").split("\n")[0]);

  const f = merjenjeFormalizacij();
  if (f) {
    console.log(`Napačni prevodi: zaznanih ${f.ujeti}/${f.napacni} (95 % interval ${ci(f.ujeti, f.napacni)} %); pravilni sprejeti ${f.sprejeti}/${f.pravilni}`);
    for (const p of f.spusceni) console.log("  SPUŠČEN", p.id, p.napaka, p.izrek);
    for (const p of f.zavrnjeni) console.log("  ZAVRNJEN PRAVILEN", p.id, p.razlog);
  }

  let l = null;
  if (ima("--lekcije")) {
    const tr = await trditveLekcij();
    const pl = prevediVse(tr);
    if (!ima("--samo-prevod")) pl.prevodi = await dokazi(pl.prevodi, { ...moznosti, mapa: join(mapa, "lekcije") });
    const racun = new Map(tr.map((t) => [t.id, t.racun]));
    l = {
      vse: tr.length,
      prevedene: pl.prevodi.length,
      dokazane: pl.prevodi.filter((p) => p.dokazano).length,
      neskladni: pl.neskladni.length,
      zunaj: pl.zunaj,
      nedokazane: pl.prevodi.filter((p) => !p.dokazano).map((p) => ({ id: p.id, racun: JSON.stringify(racun.get(p.id)) })),
      tujiAksiomi: pl.prevodi.filter((p) => p.tuji?.length).map((p) => p.id),
    };
    console.log(`Lekcije: prevedenih ${l.prevedene}/${l.vse}, dokazanih ${l.dokazane}/${l.prevedene}, neskladnih ${l.neskladni}, tujih aksiomov ${l.tujiAksiomi.length}`);
  }
  if (arg("--json")) writeFileSync(arg("--json"), JSON.stringify({ nabor: s, formalizacije: f && { ...f, spusceni: f.spusceni.map((p) => p.id) }, lekcije: l, prevodi: pn.prevodi.map(({ dokazi: _d, ...p }) => p) }, null, 1) + "\n");
  if (arg("--porocilo")) writeFileSync(arg("--porocilo"), porocilo({ nabor: s, lekcije: l, formalizacije: f, poSkupinah }));
  const slabo =
    s.napacnoDokazane.length ||
    s.neskladni ||
    s.tujiAksiomi.length ||
    (l && (l.neskladni || l.tujiAksiomi.length)) ||
    (f && f.spusceni.length) ||
    (!ima("--samo-prevod") && s.dokazanePravilne < 0.95 * s.pravilne);
  process.exit(ima("--strogo") && slabo ? 1 : 0);
}

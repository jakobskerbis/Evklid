#!/usr/bin/env node
// Iskalnik hroščev brez AI (CI posel »hrosci« v .github/workflows/testi.yml, j 2026-11-15).
// Išče podvojene ključe v predmetih: v kodi strežnika in aplikacije ({ a: 1, a: 2 } – velja samo zadnji,
// prvi tiho izgine) ter v prevodih (public/i18n/sl.js in public/i18n/ui/*.json; JSON.parse podvojitev
// prav tako tiho skrije). Tako sta nastala hrošča »games.wishThanks« (glas za igro in želja v trgovini
// sta si delila ključ) in »has_password« (dvakrat v podatkih računa).
//
//   node scripts/najdi-hrosce.mjs            # vse; izhod 1, če kaj najde
//   node scripts/najdi-hrosce.mjs a.js b.json  # samo te datoteke
//   node scripts/najdi-hrosce.mjs --json     # izid kot JSON (za teste)
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";
import * as acorn from "acorn";

const KOREN = fileURLToPath(new URL("..", import.meta.url));
// Mape s kodo, ki teče pri učencih (aplikacija) ali na strežniku, in skripte. mobile/ je TypeScript (Expo) in ima svoj prevajalnik.
const MAPE = ["server", "public", "scripts", "sim", "prompts"];
const PRESKOCI = new Set(["node_modules", ".git", "vendor"]);
const KONCNICE = new Set([".js", ".mjs", ".cjs", ".json"]);

function* datoteke(mapa) {
  let vnosi;
  try {
    vnosi = readdirSync(mapa);
  } catch {
    return;
  }
  for (const ime of vnosi) {
    if (PRESKOCI.has(ime)) continue;
    const pot = join(mapa, ime);
    const st = statSync(pot);
    if (st.isDirectory()) yield* datoteke(pot);
    else if (KONCNICE.has(extname(ime))) yield pot;
  }
}

function razcleni(besedilo, pot) {
  const json = extname(pot) === ".json";
  // JSON je veljaven izraz JS: v oklepajih ga acorn prebere s pozicijami ključev.
  const vir = json ? `(${besedilo}\n)` : besedilo.replace(/^#!.*/, "");
  const moznosti = { ecmaVersion: "latest", locations: true, allowHashBang: true, allowReturnOutsideFunction: true };
  try {
    return acorn.parse(vir, { ...moznosti, sourceType: "module" });
  } catch (e1) {
    try {
      return acorn.parse(vir, { ...moznosti, sourceType: "script" });
    } catch {
      throw e1;
    }
  }
}

const imeKljuca = (p) => {
  if (p.computed) return null;
  if (p.key.type === "Identifier") return p.key.name;
  if (p.key.type === "Literal") return String(p.key.value);
  return null;
};

// Sprehod po drevesu brez knjižnice: vsak otrok, ki je vozlišče (ima »type«).
function obisci(vozel, f) {
  if (!vozel || typeof vozel.type !== "string") return;
  f(vozel);
  for (const k in vozel) {
    if (k === "loc" || k === "start" || k === "end") continue;
    const v = vozel[k];
    if (Array.isArray(v)) for (const x of v) obisci(x, f);
    else if (v && typeof v.type === "string") obisci(v, f);
  }
}

export function preveriBesedilo(besedilo, pot) {
  const najdbe = [];
  const drevo = razcleni(besedilo, pot);
  obisci(drevo, (v) => {
    if (v.type !== "ObjectExpression") return;
    const videni = new Map();
    for (const p of v.properties) {
      if (p.type !== "Property") continue; // ...razširitev sme kasneje prepisati ključ
      const ime = imeKljuca(p);
      if (ime == null || ime === "__proto__") continue;
      // get x() {} skupaj s set x(v) {} je en ključ, ne podvojitev.
      const vrsta = p.kind === "get" || p.kind === "set" ? p.kind : "init";
      const prej = videni.get(ime);
      if (prej && (vrsta === "init" || prej.vrste.has("init") || prej.vrste.has(vrsta))) {
        najdbe.push({ pot, ime, vrstica: p.loc.start.line, prej: prej.vrstica });
      }
      if (prej) prej.vrste.add(vrsta);
      else videni.set(ime, { vrste: new Set([vrsta]), vrstica: p.loc.start.line });
    }
  });
  return najdbe;
}

export function preveri(poti) {
  const najdbe = [];
  const napake = [];
  for (const abs of poti) {
    const pot = relative(KOREN, abs) || abs;
    let besedilo;
    try {
      besedilo = readFileSync(abs, "utf8");
    } catch (e) {
      napake.push({ pot, napaka: e.message });
      continue;
    }
    try {
      najdbe.push(...preveriBesedilo(besedilo, pot));
    } catch (e) {
      // Datoteka, ki je ni mogoče prebrati kot JS/JSON, je tudi hrošč (npr. pokvarjen prevod).
      napake.push({ pot, napaka: e.message });
    }
  }
  return { najdbe, napake };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const args = process.argv.slice(2);
  const json = args.includes("--json");
  const izbrane = args.filter((a) => !a.startsWith("--"));
  const poti = izbrane.length ? izbrane.map((a) => join(process.cwd(), a)) : MAPE.flatMap((m) => [...datoteke(join(KOREN, m))]);
  const { najdbe, napake } = preveri(poti);
  if (json) {
    console.log(JSON.stringify({ datotek: poti.length, najdbe, napake }, null, 2));
  } else {
    for (const n of najdbe) console.log(`${n.pot}:${n.vrstica}: ključ »${n.ime}« je podvojen (prvič v vrstici ${n.prej}); velja samo zadnji`);
    for (const n of napake) console.log(`${n.pot}: datoteke ni mogoče prebrati: ${n.napaka}`);
    const vse = najdbe.length + napake.length;
    console.log(vse ? `\nNajdenih hroščev: ${vse} (pregledanih datotek: ${poti.length}).` : `Brez najdb (pregledanih datotek: ${poti.length}).`);
  }
  process.exit(najdbe.length + napake.length ? 1 : 0);
}

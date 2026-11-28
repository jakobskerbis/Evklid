#!/usr/bin/env node
// Meritev preverjevalnika korakov (PV-06, docs/preverjanje.md): ukaz SymPy »korak« na znanem naboru prehodov.
// Merilo načrta: vseh 50 znanih napačnih prehodov ujetih (ok = false), 0 lažnih alarmov na 200 pravilnih.
//
//   node scripts/meri-korake.mjs                 preglednica na zaslon
//   node scripts/meri-korake.mjs --json p.json   še izid po prehodih
//   node scripts/meri-korake.mjs --nabor pot     drug nabor (privzeto test/fixtures/preverjanje/koraki-v1.json)
//
// Vsako merilo kot k/n z imenovalcem in Wilsonovim 95-% intervalom (j 26. 11. 2026). Prehod brez sodbe (ok = null)
// ni ne ujet ne lažni alarm, a se šteje posebej. Izhod 1 ob spregledanem napačnem prehodu (ok = true), lažnem
// alarmu (ok = false na pravilnem), napačni vrsti pravilnega prehoda ali če SymPy ni na voljo.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { casCheck, casAvailable, casStop } from "../server/cas.js";
import { wilson } from "./meri-preverjanje.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const NABOR_KORAKI = join(ROOT, "test/fixtures/preverjanje/koraki-v1.json");

const argsKoraka = (t) => [t.prej, t.potem, t.neznanka || "", t.obmocje || ""];

/** Vsak prehod skozi worker; vrne seznam { id, pravilen, pricakovano, ok, vrsta, how, why, ms }. */
export async function izmeriKorake(nabor) {
  const out = [];
  for (const [skupina, pravilen] of [["napacni", false], ["pravilni", true]]) {
    for (const t of nabor[skupina]) {
      const t0 = Date.now();
      const r = await casCheck("korak", argsKoraka(t));
      out.push({
        id: t.id,
        prej: t.prej,
        potem: t.potem,
        pravilen,
        pricakovanaVrsta: pravilen ? t.vrsta || "ekvivalenca" : null,
        ok: r.ok,
        vrsta: r.vrsta ?? null,
        how: r.how ?? null,
        why: r.why,
        ms: Date.now() - t0,
      });
    }
  }
  return out;
}

const odstotek = (x) => `${(100 * x).toFixed(1).replace(".", ",")} %`;
const ki = (k, n) => {
  const w = wilson(k, n);
  return w ? `${k}/${n} (95-% interval ${odstotek(w[0])}–${odstotek(w[1])})` : `${k}/${n}`;
};

/** Merila: ujeti napačni, spregledani, lažni alarmi, brez sodbe, napačna vrsta. */
export function povzemiKorake(izid) {
  const nap = izid.filter((r) => !r.pravilen);
  const pra = izid.filter((r) => r.pravilen);
  return {
    ujeti: { k: nap.filter((r) => r.ok === false).length, n: nap.length },
    spregledani: { k: nap.filter((r) => r.ok === true).length, n: nap.length },
    napacniBrezSodbe: { k: nap.filter((r) => r.ok === null).length, n: nap.length },
    lazniAlarmi: { k: pra.filter((r) => r.ok === false).length, n: pra.length },
    pravilniBrezSodbe: { k: pra.filter((r) => r.ok === null).length, n: pra.length },
    napacnaVrsta: { k: pra.filter((r) => r.ok === true && r.vrsta !== r.pricakovanaVrsta).length, n: pra.length },
    simbolno: { k: izid.filter((r) => r.ok !== null && r.how === "symbolic").length, n: izid.filter((r) => r.ok !== null).length },
  };
}

export function neuspehiKorakov(izid) {
  return izid.filter(
    (r) => (r.pravilen ? r.ok === false || (r.ok === true && r.vrsta !== r.pricakovanaVrsta) : r.ok === true),
  );
}

async function main(argv) {
  const opt = (ime) => {
    const i = argv.indexOf(ime);
    return i >= 0 ? argv[i + 1] : null;
  };
  const pot = opt("--nabor") || NABOR_KORAKI;
  if (!(await casAvailable())) {
    console.error("SymPy ni na voljo: meritev ni mogoča");
    return 1;
  }
  const nabor = JSON.parse(readFileSync(pot, "utf8"));
  const izid = await izmeriKorake(nabor);
  const m = povzemiKorake(izid);
  console.log(`Preverjevalnik korakov (PV-06), nabor ${pot.replace(ROOT + "/", "")}`);
  console.log(`  ujeti napačni prehodi (ok = false):   ${ki(m.ujeti.k, m.ujeti.n)}`);
  console.log(`  spregledani napačni (ok = true):      ${ki(m.spregledani.k, m.spregledani.n)}`);
  console.log(`  napačni brez sodbe (ok = null):       ${ki(m.napacniBrezSodbe.k, m.napacniBrezSodbe.n)}`);
  console.log(`  lažni alarmi na pravilnih:            ${ki(m.lazniAlarmi.k, m.lazniAlarmi.n)}`);
  console.log(`  pravilni brez sodbe (ok = null):      ${ki(m.pravilniBrezSodbe.k, m.pravilniBrezSodbe.n)}`);
  console.log(`  pravilni z napačno vrsto prehoda:     ${ki(m.napacnaVrsta.k, m.napacnaVrsta.n)}`);
  console.log(`  sodbe s simbolnim dokazom:            ${ki(m.simbolno.k, m.simbolno.n)}`);
  const slabi = neuspehiKorakov(izid);
  for (const r of slabi) console.log(`  ! ${r.id} ${r.prej} → ${r.potem}: ok ${r.ok}, vrsta ${r.vrsta}, ${r.why}`);
  const f = opt("--json");
  if (f) writeFileSync(f, JSON.stringify({ merila: m, izid }, null, 1) + "\n");
  return slabi.length ? 1 : 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const koda = await main(process.argv.slice(2)).finally(() => casStop());
  process.exit(koda);
}

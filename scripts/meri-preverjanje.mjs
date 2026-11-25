#!/usr/bin/env node
// Meritev preverjanja na referenčnem naboru (PV-02, docs/preverjanje.md). Glavna metrika: napačno potrjene trditve
// (trditev ne drži, motor pa ji da status »dokazano« ali »izracunano«). Ta delež mora biti 0.
//
//   node scripts/meri-preverjanje.mjs              vsi motorji, preglednica na zaslon
//   node scripts/meri-preverjanje.mjs --json p.json  še poročilo v JSON
//   node scripts/meri-preverjanje.mjs --brez-sympy   samo motorji brez Pythona (za hiter CI)
//
// Motorji (kako vsak izid preslikamo v skupni status, statusi.js):
//   sympy          ukaz iz polja »racun« naravnost v server/cas worker: ok true → izracunano samo, ko je worker
//                  dokazal simbolno (how: symbolic, PV-03), sicer numericno; false → napaka, null → nepreverjeno.
//   skener         server/scan.js verifyAiFull(naloga, sol), kot ga vidi učenec (SymPy + verify.js) → izSkenerja.
//   skener-lokalno isto brez SymPy (cas: false): samo public/scan/verify.js, kot ob izpadu Pythona.
// Izhod: 1, če ima kateri motor vsaj eno napačno potrjeno trditev, status nad mejo »najvec« ali izjemo; sicer 0.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { izSkenerja, jePotrjeno, jeStatus } from "../public/preverjanje/statusi.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const NABOR = join(ROOT, "test/fixtures/preverjanje/nabor-v1.json");
const MOC = { dokazano: 4, izracunano: 3, numericno: 2, delno: 1, v_teku: 0, nepreverjeno: 0, napaka: 0 };

export function naloziNabor(pot = NABOR) {
  return JSON.parse(readFileSync(pot, "utf8")).primeri;
}

/** Izid enega motorja na eni trditvi → razvrstitev za meritev. */
export function razvrsti(p, status) {
  if (!jeStatus(status)) throw new Error(`neznan status ${status}`);
  if (!p.pravilno && jePotrjeno(status)) return "napacno_potrjena";
  if (p.pravilno && status === "napaka") return "lazni_alarm";
  if (!p.pravilno && status === "napaka") return "ujeta_napaka";
  if (p.najvec && MOC[status] > MOC[p.najvec]) return "previsok_status";
  if (!p.pravilno && (status === "numericno" || status === "delno")) return "napacna_sibko"; // učenec vidi »delno«/»numerično«
  if (p.pravilno && jePotrjeno(status)) return "potrjena";
  if (status === "nepreverjeno" || status === "v_teku") return "nepreverjena";
  return "sibkejsi_status"; // pravilna z numericno/delno
}

export const MOTORJI = {
  sympy: {
    python: true,
    zna: (p) => Array.isArray(p.racun),
    async status(p, { casCheck }) {
      const c = await casCheck(p.racun[0], p.racun[1]);
      // PV-03: »izracunano« samo za simbolni dokaz; številski ali vzorčeni »drži« je največ »numericno«
      if (c.ok === true) return !c.how || c.how === "symbolic" ? "izracunano" : "numericno";
      return c.ok === false ? "napaka" : "nepreverjeno";
    },
  },
  skener: {
    python: true,
    zna: (p) => !!p.sol,
    async status(p, { verifyAiFull }) {
      return izSkenerja((await verifyAiFull(p.naloga, p.sol, { cas: true })).status);
    },
  },
  "skener-lokalno": {
    python: false,
    zna: (p) => !!p.sol,
    async status(p, { verifyAiFull }) {
      return izSkenerja((await verifyAiFull(p.naloga, p.sol, { cas: false })).status);
    },
  },
};

/** Izmeri izbrane motorje. Vrne { [motor]: { stevci, primeri: [{ id, status, razred }] } }. */
export async function izmeri(primeri, { motorji = Object.keys(MOTORJI) } = {}) {
  const { verifyAiFull } = await import("../server/scan.js");
  const { casCheck, casAvailable } = await import("../server/cas.js");
  const orodja = { verifyAiFull, casCheck };
  const izid = {};
  for (const ime of motorji) {
    const m = MOTORJI[ime];
    if (m.python && !(await casAvailable())) {
      izid[ime] = { preskoceno: "SymPy ni na voljo" };
      continue;
    }
    const stevci = { vse: 0 };
    const vrstice = [];
    for (const p of primeri.filter(m.zna)) {
      let status, razred;
      try {
        status = await m.status(p, orodja);
        razred = razvrsti(p, status);
      } catch (e) {
        // izjema ni »nepreverjeno«: pokvarjen preverjevalnik se ne sme skriti med nepreverjene trditve
        status = `izjema: ${e?.message || e}`;
        razred = "izjema";
      }
      stevci.vse++;
      stevci[razred] = (stevci[razred] || 0) + 1;
      vrstice.push({ id: p.id, skupina: p.skupina, pravilno: p.pravilno, status, razred });
    }
    izid[ime] = { stevci, primeri: vrstice };
  }
  return izid;
}

const RAZREDI = ["napacno_potrjena", "previsok_status", "lazni_alarm", "napacna_sibko", "izjema", "ujeta_napaka", "potrjena", "sibkejsi_status", "nepreverjena"];

function natisni(izid) {
  console.log(["motor", "vse", ...RAZREDI].join("\t"));
  for (const [ime, r] of Object.entries(izid)) {
    if (r.preskoceno) {
      console.log(`${ime}\t(preskočeno: ${r.preskoceno})`);
      continue;
    }
    console.log([ime, r.stevci.vse, ...RAZREDI.map((k) => r.stevci[k] || 0)].join("\t"));
  }
  for (const [ime, r] of Object.entries(izid)) {
    for (const v of r.primeri || []) if (["napacno_potrjena", "previsok_status", "lazni_alarm", "napacna_sibko", "izjema"].includes(v.razred)) console.log(`  ${ime}: ${v.razred} ${v.id} (${v.status})`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = process.argv.slice(2);
  const motorji = a.includes("--brez-sympy") ? Object.keys(MOTORJI).filter((k) => !MOTORJI[k].python) : undefined;
  const izid = await izmeri(naloziNabor(), { motorji });
  natisni(izid);
  const j = a.indexOf("--json");
  if (j >= 0 && a[j + 1]) writeFileSync(a[j + 1], JSON.stringify(izid, null, 1));
  const slabo = Object.values(izid).some((r) => r.stevci && (r.stevci.napacno_potrjena || r.stevci.previsok_status || r.stevci.izjema));
  const { casStop } = await import("../server/cas.js");
  casStop();
  process.exit(slabo ? 1 : 0);
}

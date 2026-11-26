#!/usr/bin/env node
// Meritev preverjanja na referenčnem naboru (PV-02, docs/preverjanje.md). Glavna metrika: napačno potrjene trditve
// (trditev ne drži, motor pa ji da status »dokazano« ali »izracunano«). Ta delež mora biti 0.
//
//   node scripts/meri-preverjanje.mjs              vsi motorji, preglednica na zaslon
//   node scripts/meri-preverjanje.mjs --json p.json  še izid v JSON (povzetek meril, odstopanja po trditvah)
//   node scripts/meri-preverjanje.mjs --brez-sympy   samo motorji brez Pythona (za hiter CI)
//   node scripts/meri-preverjanje.mjs --nabor pot    drug nabor (privzeto nabor-v2.json, N-01; v1 je njegov začetek)
//   node scripts/meri-preverjanje.mjs --porocilo p.md [--prej staro.json]
//                                                   poročilo po predlogi docs/meritve/README.md (PV-05): za vsak motor
//                                                   merila kot k/n z imenovalcem in Wilsonovim 95-% intervalom; »Prej«
//                                                   iz --json prejšnje meritve; slabša merila izpiše kot POSLABŠANJE
//   --strogo                                        izhod 1 tudi, če kateri motor ni tekel (dnevni zagon)
// Dnevni zagon: .github/workflows/meritev-preverjanja.yml (PV-05).
//
// Motorji (kako vsak izid preslikamo v skupni status, statusi.js):
//   sympy          ukaz iz polja »racun« naravnost v server/cas worker: ok true → izracunano samo, ko je worker
//                  dokazal simbolno (how: symbolic, PV-03), sicer numericno; false → napaka, null → nepreverjeno.
//   skener         server/scan.js verifyAiFull(naloga, sol), kot ga vidi učenec (SymPy + verify.js) → izSkenerja.
//   skener-lokalno isto brez SymPy (cas: false): samo public/scan/verify.js, kot ob izpadu Pythona.
// Izhod: 1, če ima kateri motor vsaj eno napačno potrjeno trditev, status nad mejo »najvec« ali izjemo; sicer 0.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";
import { izSkenerja, jePotrjeno, jeStatus } from "../public/preverjanje/statusi.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const NABOR = join(ROOT, "test/fixtures/preverjanje/nabor-v2.json");
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
      if (c.ok === true) return c.how === "symbolic" ? "izracunano" : "numericno";
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
      vrstice.push({ id: p.id, skupina: p.skupina, pravilno: p.pravilno, ...(p.najvec ? { najvec: p.najvec } : {}), status, razred });
    }
    izid[ime] = { stevci, primeri: vrstice };
  }
  return izid;
}

const RAZREDI = ["napacno_potrjena", "previsok_status", "lazni_alarm", "napacna_sibko", "izjema", "ujeta_napaka", "potrjena", "sibkejsi_status", "nepreverjena"];

/** Wilsonov 95-% interval za delež k/n (docs/meritve/README.md): pri k = 0 je zgornja meja 3,84/(n + 3,84). */
export function wilson(k, n, z = 1.96) {
  if (!n) return null;
  const p = k / n;
  const z2 = z * z;
  const d = 1 + z2 / n;
  const c = (p + z2 / (2 * n)) / d;
  const r = (z / d) * Math.sqrt((p * (1 - p)) / n + z2 / (4 * n * n));
  return [k === 0 ? 0 : Math.max(0, c - r), k === n ? 1 : Math.min(1, c + r)];
}

// Merila PV-05 (j 26. 11. 2026: »pri vseh meritvah navedi ustrezen imenovalec in interval zaupanja«). Imenovalec so
// trditve, pri katerih se izid sploh lahko zgodi: napačno potrjena je lahko le napačna trditev, lažni alarm le pravilna.
// »Pokritost« je delež trditev nabora, ki jih motor zna oceniti; pokritost trditev v aplikaciji meri PV-04.
export const MERILA = [
  { id: "napacno_potrjene", ime: "Napačno potrjene", imenovalec: "napačne trditve", cilj: 0, smer: "nižje", k: (v) => v.razred === "napacno_potrjena", n: (v) => !v.pravilno },
  { id: "previsok_status", ime: "Status nad upravičenim", imenovalec: "trditve z mejo statusa", cilj: 0, smer: "nižje", k: (v) => v.razred === "previsok_status", n: (v) => !!v.najvec },
  { id: "napacne_sibko", ime: "Napačne s šibkim statusom (numerično, delno)", imenovalec: "napačne trditve", smer: "nižje", k: (v) => v.razred === "napacna_sibko", n: (v) => !v.pravilno },
  { id: "zaznane_napake", ime: "Zaznane napake", imenovalec: "napačne trditve", smer: "višje", k: (v) => v.razred === "ujeta_napaka", n: (v) => !v.pravilno },
  { id: "lazni_alarmi", ime: "Lažni alarmi", imenovalec: "pravilne trditve", cilj: 0, smer: "nižje", k: (v) => v.razred === "lazni_alarm", n: (v) => v.pravilno },
  { id: "nepreverjene", ime: "Nepreverjene (in »v teku«)", imenovalec: "ocenjene trditve", smer: "nižje", k: (v) => v.razred === "nepreverjena", n: () => true },
  { id: "izjeme", ime: "Izjeme preverjevalnika", imenovalec: "ocenjene trditve", cilj: 0, smer: "nižje", k: (v) => v.razred === "izjema", n: () => true },
];

/** Merila za vse motorje: { [motor]: { pokritost, [merilo]: { k, n, delez, interval } } }; vseh = trditev v naboru. */
export function povzemi(izid, vseh) {
  const out = {};
  const mera = (k, n) => ({ k, n, delez: n ? k / n : null, interval: wilson(k, n) });
  for (const [ime, r] of Object.entries(izid)) {
    if (!r.primeri) continue;
    const m = { pokritost: mera(r.primeri.length, vseh) };
    for (const d of MERILA) {
      const imen = r.primeri.filter(d.n);
      m[d.id] = mera(imen.filter(d.k).length, imen.length);
    }
    out[ime] = m;
  }
  return out;
}

const odst = (x) => (x === null ? "–" : `${(100 * x).toFixed(1).replace(".", ",")} %`);
const kn = (m) => `${m.k}/${m.n}`;
const interval = (m) => (m.interval ? `${odst(m.interval[0])} – ${odst(m.interval[1])}` : "–");
// Merila, pri katerih je vsak primer napaka, ki jo naštejemo po imenu (README: napačno potrjene vedno posebej).
const NASTEJ = { napacno_potrjena: "Napačno potrjene", previsok_status: "Status nad upravičenim", izjema: "Izjeme", napacna_sibko: "Napačne s šibkim statusom", lazni_alarm: "Lažni alarmi" };

/** Poročilo po predlogi docs/meritve/README.md. prej = povzetek prejšnje meritve (polje »povzetek« v --json) ali null. */
export function porocilo(izid, { vseh, datum, commit, naborPot, naborSha, opis = "", prej = null }) {
  const pov = povzemi(izid, vseh);
  const pp = prej || {};
  const motorji = Object.keys(pov);
  const nap = motorji.reduce((a, m) => a + pov[m].napacno_potrjene.k, 0);
  const glavni = pov.skener || pov[motorji[0]];
  const vrst = [];
  vrst.push(`# Matematično preverjanje na referenčnem naboru (${datum})`, "");
  vrst.push("## Povzetek");
  if (glavni) {
    const g = glavni.napacno_potrjene;
    vrst.push(`- Glavna številka: napačno potrjene trditve ${kn(g)} (skener, kot ga vidi učenec; cilj 0, nižje je bolje), 95-% interval ${interval(g)}; vsi motorji skupaj ${nap}`);
  }
  vrst.push("- Pomeni: koliko napačnih rešitev iz nabora bi učenec videl kot »Izračunano« ali »Dokazano«; zgornja meja intervala je največji delež, ki ga meritev še dopušča.");
  vrst.push("- Ne pomeni: da je preverjanje pravilno pri nalogah ali vrstah napak, ki jih nabor nima, ali pri rešitvah, ki jih AI zapiše drugače.");
  const presk = Object.entries(izid).filter(([, r]) => r.preskoceno);
  for (const [m, r] of presk) vrst.push(`- Motor ${m} ni tekel: ${r.preskoceno}.`);
  vrst.push("", "## Nabor");
  vrst.push(`- Vir in različica: \`${naborPot}\`, sha256 \`${naborSha}\`; ${vseh} trditev; delež uradnih virov (RIC, DMFA, ZOTKS): 0 % (trditve so generirane)`);
  vrst.push(`- Kdo je določil pričakovani izid in kdaj: ${opis || "glej opis nabora"}`);
  vrst.push("- Skriti kontrolni del: ne; primeri so iz istega generatorja, kot ga uporablja razvoj (test/preverjanje-meritev.test.js)");
  vrst.push("", "## Metoda");
  vrst.push("- Ukaz: `node scripts/meri-preverjanje.mjs --json <izid>.json --porocilo <porocilo>.md --prej <prejsnja>.json`");
  vrst.push(`- Commit: \`${commit}\`; brez modela AI; SymPy prek server/cas.js (motor sympy in skener), skener-lokalno brez Pythona`);
  vrst.push("- Ocenjevanje: program (razvrsti v scripts/meri-preverjanje.mjs) primerja status motorja z resnico iz nabora");
  vrst.push("- Interval: Wilsonov 95-% (pri 0 je zgornja meja 3,84/(n + 3,84)); velja le za vrste napak, ki jih nabor vsebuje");
  vrst.push("", "## Izidi");
  for (const m of motorji) {
    vrst.push("", `### ${m}`, "", "| Merilo | Vrednost | k/n | Imenovalec | 95-% interval | Cilj | Prej |", "|---|---|---|---|---|---|---|");
    const vrstica = (ime, x, imenovalec, cilj, y) => vrst.push(`| ${ime} | ${odst(x.delez)} | ${kn(x)} | ${imenovalec} | ${interval(x)} | ${cilj ?? "–"} | ${y?.n ? `${odst(y.delez)} (${kn(y)})` : "–"} |`);
    vrstica("Pokritost nabora", pov[m].pokritost, "trditve nabora", null, pp[m]?.pokritost);
    for (const d of MERILA) vrstica(d.ime, pov[m][d.id], d.imenovalec, d.cilj === undefined ? null : String(d.cilj), pp[m]?.[d.id]);
  }
  vrst.push("", "## Napake in neuspehi");
  let nic = true;
  for (const [razred, ime] of Object.entries(NASTEJ)) {
    for (const m of motorji) {
      const ids = izid[m].primeri.filter((v) => v.razred === razred).map((v) => `${v.id} (${v.status})`);
      if (!ids.length) continue;
      nic = false;
      vrst.push(`- ${ime}, ${m} (${ids.length}): ${ids.join(", ")}`);
    }
  }
  if (nic) vrst.push("- Nič.");
  vrst.push("", "## Omejitve");
  vrst.push("- Nabor je generiran iz konstrukcije (enačbe, odvodi, integrali, računi, enote …), ne iz pravih učenčevih nalog; rešitve so v obliki, kot jo vrne AI skenerja, ne kot bi jo zapisal učenec.");
  vrst.push("- Meja za napačno potrjene velja samo za vrste napak v naboru. Dokazi Lean (PV-06 in naprej) in pokritost trditev po delih aplikacije (PV-04) tu niso zajeti.");
  vrst.push("", "## Stroški", "Klicev API: 0, cena: 0 $ (meritev ne kliče modela).", "");
  return vrst.join("\n");
}

/** Merila, ki so slabša kot v prejšnji meritvi (za opozorilo v dnevnem zagonu). prej = povzetek prejšnje meritve. */
export function poslabsanja(izid, prej, vseh) {
  if (!prej) return [];
  const a = povzemi(izid, vseh);
  const b = prej;
  const out = [];
  for (const m of Object.keys(a)) {
    if (!b[m]) continue;
    for (const d of [{ id: "pokritost", ime: "Pokritost nabora", smer: "višje" }, ...MERILA]) {
      const x = a[m][d.id];
      const y = b[m][d.id];
      if (!y || x.delez === null || y.delez === null) continue;
      if (d.smer === "nižje" ? x.delez > y.delez : x.delez < y.delez) out.push(`${m}: ${d.ime} ${kn(y)} → ${kn(x)}`);
    }
  }
  return out;
}

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

/** Izid za --json (in docs/meritve/preverjanje-*.json): povzetek meril in le trditve, ki niso potrjene ali ujete. */
export function zaJson(izid, meta) {
  const motorji = {};
  for (const [ime, r] of Object.entries(izid)) {
    motorji[ime] = r.preskoceno ? { preskoceno: r.preskoceno } : { stevci: r.stevci, odstopanja: r.primeri.filter((v) => !["potrjena", "ujeta_napaka"].includes(v.razred)) };
  }
  return { ...meta, povzetek: povzemi(izid, meta.vseh), motorji };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = process.argv.slice(2);
  const arg = (ime) => {
    const i = a.indexOf(ime);
    return i >= 0 && a[i + 1] ? a[i + 1] : undefined;
  };
  const motorji = a.includes("--brez-sympy") ? Object.keys(MOTORJI).filter((k) => !MOTORJI[k].python) : undefined;
  const naborPot = arg("--nabor") || NABOR;
  const primeri = naloziNabor(naborPot);
  const izid = await izmeri(primeri, { motorji });
  natisni(izid);
  const { createHash } = await import("node:crypto");
  const { execFileSync } = await import("node:child_process");
  const surov = readFileSync(naborPot);
  let commit = process.env.GITHUB_SHA || "";
  try {
    commit ||= execFileSync("git", ["rev-parse", "HEAD"], { cwd: ROOT, encoding: "utf8" }).trim();
  } catch {
    commit ||= "neznan";
  }
  const meta = {
    vseh: primeri.length,
    datum: new Date().toISOString().slice(0, 10),
    commit,
    naborPot: relative(ROOT, naborPot),
    naborSha: createHash("sha256").update(surov).digest("hex"),
  };
  let prej = null;
  if (arg("--prej")) {
    const p = JSON.parse(readFileSync(arg("--prej"), "utf8"));
    // primerjava ima smisel le na istem naboru (iste trditve, isti imenovalci)
    if (p.naborSha === meta.naborSha) prej = p.povzetek;
    else console.log(`OPOMBA: ${arg("--prej")} je z drugim naborom, stolpec »Prej« ostane prazen`);
  }
  // ena vrstica na trditev in na merilo: datoteka ostane berljiva in majhna (docs/meritve)
  const zgosti = (m) => JSON.stringify(JSON.parse(m));
  if (arg("--json")) writeFileSync(arg("--json"), JSON.stringify(zaJson(izid, meta), null, 1).replace(/\{\n\s+"(?:id|k)"[^{}]*?\}/g, zgosti) + "\n");
  if (arg("--porocilo")) writeFileSync(arg("--porocilo"), porocilo(izid, { ...meta, opis: JSON.parse(surov).opis || "", prej }));
  for (const p of poslabsanja(izid, prej, primeri.length)) console.log(`POSLABŠANJE ${p}`);
  // --strogo (dnevni zagon): motor, ki ni tekel (npr. brez SymPy), je neuspeh, ne tiho preskočen
  const preskocen = a.includes("--strogo") && Object.values(izid).some((r) => r.preskoceno);
  if (preskocen) console.log("NEUSPEH: motor ni tekel (--strogo)");
  const slabo = preskocen || Object.values(izid).some((r) => r.stevci && (r.stevci.napacno_potrjena || r.stevci.previsok_status || r.stevci.izjema));
  const { casStop } = await import("../server/cas.js");
  casStop();
  process.exit(slabo ? 1 : 0);
}

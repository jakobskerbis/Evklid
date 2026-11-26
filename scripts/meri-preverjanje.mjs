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
//   --strogo                                        izhod 1 tudi, če kateri motor ni tekel ali je SymPy kdaj ostal
//                                                   brez odgovora (rok, sesutje; dnevni zagon)
// Dnevni zagon: .github/workflows/meritev-preverjanja.yml (PV-05).
//
// Motorji (kako vsak izid preslikamo v skupni status, statusi.js):
//   sympy          ukaz iz polja »racun« naravnost v server/cas worker: ok true → izracunano samo, ko je worker
//                  dokazal simbolno (how: symbolic, PV-03), sicer numericno; false → napaka, null → nepreverjeno.
//   skener         server/scan.js verifyAiFull(naloga, sol), kot ga vidi učenec (SymPy + verify.js) → izSkenerja.
//   skener-lokalno isto brez SymPy (cas: false): samo public/scan/verify.js, kot ob izpadu Pythona.
// Izhod: 1, če ima kateri motor vsaj eno napačno potrjeno trditev, status nad mejo »najvec« ali izjemo; sicer 0.
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
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
// Vrstni red odloča, ko bi veljalo več razredov: napačna potrjena trditev je vedno »napacno_potrjena« (tudi z mejo
// »najvec«), napačna z mejo nad »najvec« je »previsok_status«, ne »napacna_sibko«. V naboru v2 imajo mejo le pravilne.
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
  const { casCheck, casAvailable, casIzpadi } = await import("../server/cas.js");
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
    const izpadiPrej = casIzpadi().skupaj;
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
    // zahteve SymPy brez odgovora (rok, sesutje, ni na voljo): statusi bi tiho padli na lokalno preverjanje (PV-05)
    izid[ime] = { stevci, ...(m.python ? { izpadi_cas: casIzpadi().skupaj - izpadiPrej } : {}), primeri: vrstice };
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
// Razredi se ne prekrivajo (razvrsti): napačna trditev z mejo »najvec«, ki dobi »izracunano«, šteje le kot napačno
// potrjena; v naboru imajo mejo zaenkrat samo pravilne trditve. Pokritost trditev po delih aplikacije meri PV-04.
const je = (...r) => (v) => r.includes(v.razred);
export const MERILA = [
  { id: "napacno_potrjene", ime: "Napačno potrjene (izračunano, dokazano)", imenovalec: "napačne trditve", cilj: 0, smer: "nižje", k: je("napacno_potrjena"), n: (v) => !v.pravilno },
  { id: "previsok_status", ime: "Status nad upravičenim", imenovalec: "trditve z mejo statusa", cilj: 0, smer: "nižje", k: je("previsok_status"), n: (v) => !!v.najvec },
  { id: "napacne_sibko", ime: "Napačne s šibkim statusom (numerično, delno)", imenovalec: "napačne trditve", smer: "nižje", k: je("napacna_sibko"), n: (v) => !v.pravilno },
  { id: "zaznane_napake", ime: "Zaznane napake", imenovalec: "napačne trditve", smer: "višje", k: je("ujeta_napaka"), n: (v) => !v.pravilno },
  { id: "lazni_alarmi", ime: "Lažni alarmi", imenovalec: "pravilne trditve", cilj: 0, smer: "nižje", k: je("lazni_alarm"), n: (v) => v.pravilno },
  { id: "pravilne_potrjene", ime: "Pravilne potrjene (izračunano, dokazano)", imenovalec: "pravilne trditve", smer: "višje", k: je("potrjena"), n: (v) => v.pravilno },
  { id: "pravilne_sibko", ime: "Pravilne s šibkim statusom (numerično, delno)", imenovalec: "pravilne trditve", smer: "nižje", k: je("sibkejsi_status"), n: (v) => v.pravilno },
  { id: "nepreverjene", ime: "Nepreverjene (in »v teku«)", imenovalec: "ocenjene trditve", smer: "nižje", k: je("nepreverjena"), n: () => true },
  { id: "pokritost", ime: "Pokritost: dokončna ocena (pravilna potrjena ali napaka zaznana)", imenovalec: "ocenjene trditve", smer: "višje", k: je("potrjena", "ujeta_napaka"), n: () => true },
  { id: "izjeme", ime: "Izjeme preverjevalnika", imenovalec: "ocenjene trditve", cilj: 0, smer: "nižje", k: je("izjema"), n: () => true },
];

/** Merila za vse motorje: { [motor]: { ocenjene, izpadi_cas?, [merilo]: { k, n, delez, interval } } }. */
export function povzemi(izid, vseh) {
  const out = {};
  const mera = (k, n) => ({ k, n, delez: n ? k / n : null, interval: wilson(k, n) });
  for (const [ime, r] of Object.entries(izid)) {
    if (!r.primeri) continue;
    // koliko trditev nabora ima obliko za ta motor: lastnost nabora, ne motorja, zato štetje brez intervala
    const m = { ocenjene: { k: r.primeri.length, n: vseh, delez: vseh ? r.primeri.length / vseh : null, interval: null } };
    for (const d of MERILA) {
      const imen = r.primeri.filter(d.n);
      m[d.id] = mera(imen.filter(d.k).length, imen.length);
    }
    if (r.izpadi_cas !== undefined) m.izpadi_cas = r.izpadi_cas;
    out[ime] = m;
  }
  return out;
}

// Spodnjo mejo zaokrožimo navzdol, zgornjo navzgor: meja varnosti ne sme biti videti boljša, kot je.
const odst = (x, smer = 0) => {
  if (x === null || x === undefined) return "–";
  const d = smer < 0 ? Math.floor(x * 1000 + 1e-9) : smer > 0 ? Math.ceil(x * 1000 - 1e-9) : Math.round(x * 1000);
  return `${(d / 10).toFixed(1).replace(".", ",")} %`;
};
const kn = (m) => `${m.k}/${m.n}`;
const interval = (m) => (m.interval ? `${odst(m.interval[0], -1)} – ${odst(m.interval[1], 1)}` : "–");
// Razredi, katerih trditve naštejemo po imenu (README: napačno potrjene vedno posebej, tudi ko jih ni).
const NASTEJ = { napacno_potrjena: "Napačno potrjene", previsok_status: "Status nad upravičenim", izjema: "Izjeme", napacna_sibko: "Napačne s šibkim statusom", lazni_alarm: "Lažni alarmi", sibkejsi_status: "Pravilne s šibkim statusom" };
const OPIS_MOTORJA = { skener: "skener s SymPy, kot ga vidi učenec", sympy: "surov SymPy", "skener-lokalno": "skener brez SymPy" };

/**
 * Poročilo po predlogi docs/meritve/README.md. primeri = trditve nabora (sestava), prej = povzetek prejšnje meritve
 * (polje »povzetek« v --json) ali null.
 */
export function porocilo(izid, { primeri = [], vseh = primeri.length, datum, commit, ukaz = "", okolje = "", naborPot, naborSha, opis = "", prej = null }) {
  const pov = povzemi(izid, vseh);
  const pp = prej || {};
  const motorji = Object.keys(pov);
  const vrst = [];
  vrst.push(`# Matematično preverjanje na referenčnem naboru (${datum})`, "");
  vrst.push("## Povzetek");
  const glavni = pov.skener ? "skener" : motorji[0];
  if (glavni) {
    const g = pov[glavni].napacno_potrjene;
    const opomba = glavni === "skener" ? "" : " (skener ni tekel)";
    vrst.push(`- Glavna številka: napačno potrjene trditve ${kn(g)} (${glavni}: ${OPIS_MOTORJA[glavni] || glavni}${opomba}; cilj 0, nižje je bolje), 95-% interval ${interval(g)}`);
  } else vrst.push("- Glavna številka: ni je, noben motor ni tekel.");
  vrst.push("- Pomeni: koliko napačnih rešitev iz nabora bi učenec videl kot »Izračunano« ali »Dokazano«; zgornja meja intervala je pri 95-% zaupanju največji delež, ki ga meritev še dopušča, če bi bile trditve med seboj neodvisne (niso, glej Omejitve).");
  vrst.push("- Ne pomeni: da je preverjanje pravilno pri nalogah ali vrstah napak, ki jih nabor nima, ali pri rešitvah, ki jih AI zapiše drugače.");
  for (const [m, r] of Object.entries(izid)) if (r.preskoceno) vrst.push(`- Motor ${m} ni tekel: ${r.preskoceno}.`);
  for (const m of motorji) if (pov[m].izpadi_cas) vrst.push(`- Motor ${m}: ${pov[m].izpadi_cas} zahtev SymPy brez odgovora (izpad sredi meritve, številke tega motorja niso zanesljive).`);
  vrst.push("", "## Nabor");
  vrst.push(`- Vir in različica: \`${naborPot}\`, sha256 trditev \`${naborSha}\`; delež uradnih virov (RIC, DMFA, ZOTKS): 0 % (trditve so generirane)`);
  vrst.push(`- Kdo je določil pričakovani izid in kdaj: ${opis || "glej opis nabora"}`);
  vrst.push("- Skriti kontrolni del: ne; primeri so iz istega generatorja, kot ga uporablja razvoj (test/preverjanje-meritev.test.js)");
  if (primeri.length) {
    const prav = primeri.filter((p) => p.pravilno).length;
    const skupine = {};
    for (const p of primeri) skupine[p.skupina] = (skupine[p.skupina] || 0) + 1;
    vrst.push(`- Sestava: ${primeri.length} trditev, ${prav} pravilnih in ${primeri.length - prav} napačnih ali robnih; ${primeri.filter((p) => p.najvec).length} z mejo statusa (zaokrožen odgovor); ${Object.keys(skupine).length} skupin: ${Object.entries(skupine).map(([s, n]) => `${s} ${n}`).join(", ")}`);
  }
  vrst.push("", "## Metoda");
  vrst.push(`- Ukaz: \`${ukaz || "node scripts/meri-preverjanje.mjs"}\``);
  vrst.push(`- Commit: \`${commit}\`; brez modela AI; SymPy prek server/cas.js (motorja sympy in skener), skener-lokalno brez Pythona`);
  if (okolje) vrst.push(`- Stroj in okolje: ${okolje}`);
  vrst.push("- Ocenjevanje: program (razvrsti v scripts/meri-preverjanje.mjs) primerja status motorja z resnico iz nabora");
  vrst.push("- Interval: Wilsonov 95-% (pri 0 je zgornja meja 3,84/(n + 3,84)); spodnja meja zaokrožena navzdol, zgornja navzgor");
  vrst.push("", "## Izidi");
  const prejV = (y) => (y?.n ? `${odst(y.delez)} (${kn(y)})` : "–");
  for (const m of motorji) {
    vrst.push("", `### ${m} (${OPIS_MOTORJA[m] || m})`, "", "| Merilo | Vrednost | k/n | Imenovalec | 95-% interval | Cilj | Prej |", "|---|---|---|---|---|---|---|");
    const o = pov[m].ocenjene;
    vrst.push(`| Trditve z obliko za motor (štetje, ne vzorec) | ${odst(o.delez)} | ${kn(o)} | trditve nabora | – | – | ${prejV(pp[m]?.ocenjene)} |`);
    for (const d of MERILA) {
      const x = pov[m][d.id];
      vrst.push(`| ${d.ime} | ${odst(x.delez)} | ${kn(x)} | ${d.imenovalec} | ${interval(x)} | ${d.cilj ?? "–"} | ${prejV(pp[m]?.[d.id])} |`);
    }
    if (pov[m].izpadi_cas !== undefined) vrst.push("", `Zahteve SymPy brez odgovora (rok, sesutje, ni na voljo): ${pov[m].izpadi_cas} (cilj 0).`);
  }
  vrst.push("", "## Napake in neuspehi");
  const potrjene = motorji.flatMap((m) => izid[m].primeri.filter((v) => v.razred === "napacno_potrjena").map((v) => `${m}: ${v.id} (${v.status})`));
  vrst.push(potrjene.length ? `- **Napačno potrjene (${potrjene.length}): ${potrjene.join(", ")}**` : `- Napačno potrjene: 0 (motorji: ${motorji.join(", ") || "noben"})`);
  for (const [razred, ime] of Object.entries(NASTEJ)) {
    if (razred === "napacno_potrjena") continue;
    for (const m of motorji) {
      const ids = izid[m].primeri.filter((v) => v.razred === razred).map((v) => `${v.id} (${v.status})`);
      if (ids.length) vrst.push(`- ${ime}, ${m} (${ids.length}): ${ids.join(", ")}`);
    }
  }
  vrst.push("", "## Omejitve");
  const st = new Set(primeri.map((p) => p.skupina)).size;
  vrst.push(`- Trditve niso neodvisne: nastanejo iz ${st || "nekaj"} družin predlog, ki pogosto uspejo ali padejo skupaj (ena napaka v razčlenjevanju zadene vso družino). Intervali predpostavljajo neodvisne trditve, zato so preozki; prava negotovost je večja.`);
  vrst.push("- Nabor je generiran iz konstrukcije (enačbe, odvodi, integrali, računi, enote …), ne iz pravih učenčevih nalog; rešitve so v obliki, kot jo vrne AI skenerja, ne kot bi jo zapisal učenec.");
  vrst.push("- Meja za napačno potrjene velja samo za vrste napak v naboru. Dokazi Lean (PV-06 in naprej) in pokritost trditev po delih aplikacije (PV-04) tu niso zajeti.");
  vrst.push("", "## Stroški", "Klicev API: 0, cena: 0 $ (meritev ne kliče modela).", "");
  return vrst.join("\n");
}

/** Merila, ki so slabša kot v prejšnji meritvi (za opozorilo v dnevnem zagonu). prej = povzetek prejšnje meritve. */
export function poslabsanja(izid, prej, vseh) {
  if (!prej) return [];
  const a = povzemi(izid, vseh);
  const out = [];
  for (const m of Object.keys(a)) {
    if (!prej[m]) continue;
    for (const d of [{ id: "ocenjene", ime: "Trditve z obliko za motor", smer: "višje" }, ...MERILA]) {
      const x = a[m][d.id];
      const y = prej[m][d.id];
      if (!y || x.delez === null || y.delez === null) continue;
      if (d.smer === "nižje" ? x.delez > y.delez : x.delez < y.delez) out.push(`${m}: ${d.ime} ${kn(y)} → ${kn(x)}`);
    }
  }
  return out;
}

/** sha256 trditev nabora (brez opisa): primerjava s prejšnjo meritvijo velja le na istih trditvah. */
export function shaTrditev(primeri) {
  return createHash("sha256").update(JSON.stringify(primeri)).digest("hex");
}

/** Izid za --json (in docs/meritve/preverjanje-*.json): povzetek meril in le trditve, ki niso potrjene ali ujete. */
export function zaJson(izid, meta) {
  const motorji = {};
  for (const [ime, r] of Object.entries(izid)) {
    motorji[ime] = r.preskoceno ? { preskoceno: r.preskoceno } : { stevci: r.stevci, ...(r.izpadi_cas !== undefined ? { izpadi_cas: r.izpadi_cas } : {}), odstopanja: r.primeri.filter((v) => !["potrjena", "ujeta_napaka"].includes(v.razred)) };
  }
  return { ...meta, povzetek: povzemi(izid, meta.vseh), motorji };
}

/** Neuspeh dnevnega zagona (--strogo): napačno potrjena, previsok status, izjema, motor ni tekel ali SymPy brez odgovora. */
export function neuspehi(izid, { strogo = false } = {}) {
  const out = [];
  for (const [m, r] of Object.entries(izid)) {
    if (r.preskoceno) {
      if (strogo) out.push(`${m} ni tekel (${r.preskoceno})`);
      continue;
    }
    for (const razred of ["napacno_potrjena", "previsok_status", "izjema"]) if (r.stevci[razred]) out.push(`${m}: ${razred} ${r.stevci[razred]}`);
    if (strogo && r.izpadi_cas) out.push(`${m}: ${r.izpadi_cas} zahtev SymPy brez odgovora`);
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


if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = process.argv.slice(2);
  const arg = (ime) => {
    const i = a.indexOf(ime);
    return i >= 0 && a[i + 1] ? a[i + 1] : undefined;
  };
  const motorji = a.includes("--brez-sympy") ? Object.keys(MOTORJI).filter((k) => !MOTORJI[k].python) : undefined;
  const naborPot = arg("--nabor") || NABOR;
  const surov = JSON.parse(readFileSync(naborPot, "utf8"));
  const primeri = surov.primeri;
  const izid = await izmeri(primeri, { motorji });
  natisni(izid);
  const { execFileSync } = await import("node:child_process");
  const ukaz = (cmd, args, env) => {
    try {
      return execFileSync(cmd, args, { cwd: ROOT, encoding: "utf8", env: { ...process.env, ...env }, stdio: ["ignore", "pipe", "ignore"] }).trim();
    } catch {
      return "";
    }
  };
  const py = ukaz(process.env.EVKLID_PYTHON || "python3", ["-c", "import sys, sympy; print(sys.version.split()[0], sympy.__version__)"], { PYTHONPATH: join(ROOT, ".pylib") }).split(" ");
  const meta = {
    vseh: primeri.length,
    datum: new Date().toISOString().slice(0, 10),
    commit: process.env.GITHUB_SHA || ukaz("git", ["rev-parse", "HEAD"]) || "neznan",
    ukaz: ["node scripts/meri-preverjanje.mjs", ...a].join(" "),
    okolje: `Node ${process.version}, ${process.platform}; ${py[1] ? `Python ${py[0]}, SymPy ${py[1]}` : "SymPy ni nameščen"}${process.env.GITHUB_ACTIONS ? "; GitHub Actions" : ""}`,
    naborPot: relative(ROOT, naborPot),
    naborSha: shaTrditev(primeri),
  };
  let prej = null;
  if (arg("--prej")) {
    const p = JSON.parse(readFileSync(arg("--prej"), "utf8"));
    if (p.naborSha === meta.naborSha) prej = p.povzetek;
    else console.log(`OPOMBA: ${arg("--prej")} je z drugimi trditvami, stolpec »Prej« ostane prazen`);
  }
  // ena vrstica na trditev in na merilo: datoteka ostane berljiva in majhna (docs/meritve)
  const zgosti = (m) => JSON.stringify(JSON.parse(m));
  if (arg("--json")) writeFileSync(arg("--json"), JSON.stringify(zaJson(izid, meta), null, 1).replace(/\{\n\s+"(?:id|k)"[^{}]*?\}/g, zgosti) + "\n");
  if (arg("--porocilo")) writeFileSync(arg("--porocilo"), porocilo(izid, { ...meta, primeri, opis: surov.opis || "", prej }));
  for (const p of poslabsanja(izid, prej, primeri.length)) console.log(`POSLABŠANJE ${p}`);
  const slabo = neuspehi(izid, { strogo: a.includes("--strogo") });
  for (const s of slabo) console.log(`NEUSPEH ${s}`);
  const { casStop } = await import("../server/cas.js");
  casStop();
  process.exit(slabo.length ? 1 : 0);
}

// PV-05: dnevno poročilo meritve preverjanja (scripts/meri-preverjanje.mjs --porocilo, docs/meritve/README.md).
// Vsako merilo kot k/n z imenovalcem, ki ga merilo res ima, in Wilsonovim 95-% intervalom.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { wilson, povzemi, porocilo, poslabsanja, zaJson, neuspehi, shaTrditev, naloziNabor, MERILA } from "../scripts/meri-preverjanje.mjs";

const blizu = (a, b, eps = 1e-4) => assert.ok(Math.abs(a - b) < eps, `${a} ≠ ${b}`);

test("Wilsonov interval: znane vrednosti, k = 0 in k = n", () => {
  const [lo, hi] = wilson(10, 100);
  blizu(lo, 0.0552);
  blizu(hi, 0.1744);
  // README meritev: pri 0 napakah je zgornja meja 3,84/(n + 3,84)
  assert.equal(wilson(0, 471)[0], 0);
  blizu(wilson(0, 471)[1], 1.96 ** 2 / (471 + 1.96 ** 2), 1e-12);
  assert.equal(wilson(5, 5)[1], 1);
  assert.equal(wilson(0, 0), null);
});

const vrstica = (id, pravilno, razred, dodatno = {}) => ({ id, skupina: id.split("-")[0], pravilno, status: "x", razred, ...dodatno });
const IZID = {
  a: {
    stevci: {},
    primeri: [
      vrstica("p-1", true, "potrjena"),
      vrstica("p-2", true, "lazni_alarm"),
      vrstica("p-3", true, "nepreverjena", { najvec: "numericno" }),
      vrstica("n-1", false, "ujeta_napaka"),
      vrstica("n-2", false, "napacno_potrjena"),
      vrstica("n-3", false, "napacna_sibko"),
      vrstica("n-4", false, "previsok_status", { najvec: "numericno" }),
    ],
  },
  b: { preskoceno: "SymPy ni na voljo" },
};

test("povzemi: vsako merilo ima svoj imenovalec", () => {
  const p = povzemi(IZID, 10);
  assert.deepEqual(Object.keys(p), ["a"], "preskočen motor ni v povzetku");
  const kn = (id) => [p.a[id].k, p.a[id].n];
  assert.deepEqual(kn("ocenjene"), [7, 10]); // trditve nabora z obliko za motor: štetje, brez intervala
  assert.equal(p.a.ocenjene.interval, null);
  assert.deepEqual(kn("pokritost"), [2, 7]); // dokončna ocena: pravilna potrjena ali napaka zaznana
  assert.deepEqual(kn("pravilne_potrjene"), [1, 3]);
  assert.deepEqual(kn("pravilne_sibko"), [0, 3]);
  assert.deepEqual(kn("napacno_potrjene"), [1, 4]); // napačne trditve
  assert.deepEqual(kn("napacne_sibko"), [1, 4]);
  assert.deepEqual(kn("zaznane_napake"), [1, 4]);
  assert.deepEqual(kn("lazni_alarmi"), [1, 3]); // pravilne trditve
  assert.deepEqual(kn("previsok_status"), [1, 2]); // trditve z mejo statusa
  assert.deepEqual(kn("nepreverjene"), [1, 7]); // ocenjene trditve
  assert.deepEqual(kn("izjeme"), [0, 7]);
  for (const d of MERILA) assert.ok(d.imenovalec, d.id);
  assert.deepEqual(p.a.lazni_alarmi.interval, wilson(1, 3));
});

const META = { vseh: 10, datum: "2026-11-26", commit: "abc", naborPot: "nabor.json", naborSha: "123", opis: "resnica iz konstrukcije" };

test("poročilo sledi predlogi in napačno potrjene našteje po imenu", () => {
  const md = porocilo(IZID, META);
  for (const h of ["## Povzetek", "## Nabor", "## Metoda", "## Izidi", "## Napake in neuspehi", "## Omejitve", "## Stroški"]) assert.ok(md.includes(h), h);
  assert.match(md, /\| Napačno potrjene \(izračunano, dokazano\) \| 25,0 % \| 1\/4 \| napačne trditve \| [\d,]+ % – [\d,]+ % \| 0 \| – \|/);
  assert.match(md, /\| Lažni alarmi \| 33,3 % \| 1\/3 \| pravilne trditve \|/);
  assert.match(md, /\*\*Napačno potrjene \(1\): a: n-2 \(x\)\*\*/);
  // glavna številka pove motor, iz katerega je (tu skener ni tekel)
  assert.match(md, /Glavna številka: napačno potrjene trditve 1\/4 \(a: a \(skener ni tekel\);/);
  // brez napačno potrjenih vrstica ostane (README: vedno naštete posebej)
  const brez = structuredClone(IZID);
  brez.a.primeri = brez.a.primeri.filter((v) => v.razred !== "napacno_potrjena");
  assert.match(porocilo(brez, META), /- Napačno potrjene: 0 \(motorji: a\)/);
  // zgornja meja varnosti zaokrožena navzgor: 0/471 → 0,9 % (0,809 %), ne 0,8 %
  const nic = { skener: { stevci: {}, primeri: Array.from({ length: 471 }, (_, i) => vrstica(`n-${i}`, false, "ujeta_napaka")) } };
  assert.match(porocilo(nic, META), /Glavna številka: napačno potrjene trditve 0\/471 \(skener: [^)]*\), 95-% interval 0,0 % – 0,9 %/);
  assert.match(md, /Motor b ni tekel: SymPy ni na voljo/);
  assert.match(md, /sha256 trditev `123`/);
  assert.match(md, /Klicev API: 0/);
});

test("JSON za docs/meritve: povzetek in le odstopanja; kot »Prej« da stolpec in poslabšanja", () => {
  const j = zaJson(IZID, META);
  assert.deepEqual(j.motorji.a.odstopanja.map((v) => v.id), ["p-2", "p-3", "n-2", "n-3", "n-4"]);
  assert.equal(j.motorji.b.preskoceno, "SymPy ni na voljo");
  assert.equal(j.naborSha, "123");
  // ista meritev: nič slabšega, stolpec »Prej« izpolnjen
  assert.deepEqual(poslabsanja(IZID, j.povzetek, 10), []);
  assert.match(porocilo(IZID, { ...META, prej: j.povzetek }), /\| Napačno potrjene \(izračunano, dokazano\) \| 25,0 % \| 1\/4 \| [^|]+\| [^|]+\| 0 \| 25,0 % \(1\/4\) \|/);
  // prej brez lažnega alarma in z eno ujeto napako več: oboje je poslabšanje
  const boljse = structuredClone(j.povzetek);
  Object.assign(boljse.a.lazni_alarmi, { k: 0, delez: 0 });
  Object.assign(boljse.a.zaznane_napake, { k: 2, delez: 0.5 });
  assert.deepEqual(poslabsanja(IZID, boljse, 10), ["a: Zaznane napake 2/4 → 1/4", "a: Lažni alarmi 0/3 → 1/3"]);
  const vec = structuredClone(j.povzetek);
  Object.assign(vec.a.ocenjene, { k: 8, delez: 0.8 });
  assert.deepEqual(poslabsanja(IZID, vec, 10), ["a: Trditve z obliko za motor 8/10 → 7/10"]);
  assert.deepEqual(poslabsanja(IZID, null, 10), []);
});

test("neuspeh dnevnega zagona: napačno potrjena, previsok, izjema; z --strogo še preskočen motor in SymPy brez odgovora", () => {
  assert.deepEqual(neuspehi(IZID), []);
  const st = (stevci, dod = {}) => ({ m: { stevci, primeri: [], ...dod } });
  assert.deepEqual(neuspehi(st({ napacno_potrjena: 1 })), ["m: napacno_potrjena 1"]);
  assert.deepEqual(neuspehi(st({ previsok_status: 2, izjema: 1 })), ["m: previsok_status 2", "m: izjema 1"]);
  assert.deepEqual(neuspehi(st({}, { izpadi_cas: 3 })), [], "brez --strogo izpad ni neuspeh (ročna meritev)");
  assert.deepEqual(neuspehi(st({}, { izpadi_cas: 3 }), { strogo: true }), ["m: 3 zahtev SymPy brez odgovora"]);
  assert.deepEqual(neuspehi(IZID, { strogo: true }), ["b ni tekel (SymPy ni na voljo)"]);
});

test("ukaz: --strogo pade ob SymPy, ki sredi dela ne odgovarja, ali izklopljenem; --prej z drugimi trditvami se ne upošteva", () => {
  const mapa = mkdtempSync(join(tmpdir(), "evklid-pv05-"));
  try {
    const vsi = naloziNabor().filter((p) => p.sol && p.racun);
    const nabor = join(mapa, "nabor.json");
    writeFileSync(nabor, JSON.stringify({ opis: "mali nabor", primeri: [vsi[0], vsi[1], vsi.find((p) => !p.pravilno)] }));
    const prej = join(mapa, "prej.json");
    writeFileSync(prej, JSON.stringify({ naborSha: "drug", povzetek: {} }));
    const pozeni = (env, ...args) => {
      try {
        return { izhod: 0, izpis: execFileSync(process.execPath, [fileURLToPath(new URL("../scripts/meri-preverjanje.mjs", import.meta.url)), "--nabor", nabor, ...args], { encoding: "utf8", env: { ...process.env, EVKLID_CAS_TIMEOUT_MS: "2000", ...env } }) };
      } catch (e) {
        return { izhod: e.status, izpis: String(e.stdout) };
      }
    };
    const sesutje = pozeni({ EVKLID_PYTHON: fileURLToPath(new URL("./fixtures/odpoved/sesutje.sh", import.meta.url)), EVKLID_K04_DNEVNIK: join(mapa, "d.txt") }, "--strogo", "--prej", prej);
    assert.equal(sesutje.izhod, 1, sesutje.izpis);
    assert.match(sesutje.izpis, /NEUSPEH sympy: \d+ zahtev SymPy brez odgovora/);
    assert.match(sesutje.izpis, /OPOMBA: .*z drugimi trditvami/);
    const izklop = pozeni({ EVKLID_CAS: "0" }, "--strogo");
    assert.equal(izklop.izhod, 1);
    assert.match(izklop.izpis, /NEUSPEH sympy ni tekel/);
    assert.equal(pozeni({ EVKLID_CAS: "0" }).izhod, 0, "brez --strogo je preskočen motor dovoljen (lokalni razvoj)");
  } finally {
    rmSync(mapa, { recursive: true, force: true });
  }
});

test("zadnja meritev v docs/meritve: 0 napačno potrjenih, isti nabor kot v repozitoriju", async () => {
  const mapa = fileURLToPath(new URL("../docs/meritve/", import.meta.url));
  const zadnja = readdirSync(mapa).filter((f) => /^preverjanje-\d{4}-\d\d-\d\d\.json$/.test(f)).sort().at(-1);
  assert.ok(zadnja, "ni izhodišča za stolpec »Prej«");
  const j = JSON.parse(readFileSync(mapa + zadnja, "utf8"));
  assert.ok(readFileSync(mapa + zadnja.replace(/json$/, "md"), "utf8").includes("## Izidi"), "poročilo .md ob .json");
  for (const [m, p] of Object.entries(j.povzetek)) {
    assert.equal(p.napacno_potrjene.k, 0, m);
    assert.equal(p.previsok_status.k, 0, m);
  }
  // nov nabor brez nove meritve: dnevni zagon bi ostal brez primerjave (»Prej«)
  const nabor = naloziNabor(fileURLToPath(new URL(`../${j.naborPot}`, import.meta.url)));
  assert.equal(shaTrditev(nabor), j.naborSha, `nabor se je spremenil: ponovi meritev (node scripts/meri-preverjanje.mjs --json docs/meritve/preverjanje-<datum>.json --porocilo docs/meritve/preverjanje-<datum>.md)`);
});

test("dnevni zagon: urnik na main, --strogo s primerjavo, brez skrivnosti, zadeva ob neuspehu", () => {
  const wf = readFileSync(fileURLToPath(new URL("../.github/workflows/meritev-preverjanja.yml", import.meta.url)), "utf8");
  assert.match(wf, /schedule:\n\s+- cron: "\d+ \d+ \* \* \*"/);
  assert.match(wf, /if: github\.ref == 'refs\/heads\/main'/);
  assert.match(wf, /scripts\/meri-preverjanje\.mjs "\$\{ARGS\[@\]\}"/);
  assert.match(wf, /ARGS=\(--strogo /);
  assert.match(wf, /--prej "\$PREJ"/);
  assert.match(wf, /SymPy nameščen/);
  assert.doesNotMatch(wf, /secrets\./, "meritev ne potrebuje skrivnosti (javni repozitorij)");
  assert.equal(wf.match(/issues: write/g)?.length, 1, "pisati zadeve sme le posel »zadeva«");
  assert.match(wf, /NASLOV: "Dnevna meritev preverjanja ne gre skozi"/);
});

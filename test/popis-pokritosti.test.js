// PV-04: popis pokritosti trditev po delih aplikacije (scripts/popis-pokritosti.mjs, docs/preverjanje.md).
// Kaj je trditev, kateri status dobi, kaj je namerno napačno in da poročilo pokrije vseh 19 mest iz načrta.
import { test } from "node:test";
import assert from "node:assert/strict";
import { trditveIzBesedila, statusFormule, deliLekcije, statusRacuna, popisi, porocilo, MESTA, STATUSI, VIDNA, polno } from "../scripts/popis-pokritosti.mjs";

const statusi = (md) => trditveIzBesedila(md).map((t) => t.status);

test("trditev je formula z relacijo; status iz preračuna lesson-math", () => {
  // $5$ in $x^2+y$ nimata relacije, niso trditve
  assert.deepEqual(statusi("Velja $2+3=5$ in $5$ ter $x^2+y$."), ["numericno"]);
  assert.deepEqual(statusi("Izračun $2+3=6$"), ["napaka"]);
  assert.deepEqual(statusi("$$2 \\cdot 3 = 6$$"), ["numericno"]);
  // neenačba in pripadnost: trditvi, ki ju noben preverjevalnik ne preračuna
  assert.deepEqual(statusi("$a<b$ in $x \\in A$"), ["nepreverjeno", "nepreverjeno"]);
  // simbolni začetek verige: preračunan je le del
  assert.deepEqual(statusi("$x = 2 \\cdot 3 = 6$"), ["delno"]);
  // identiteto potrdi preizkus z naključnimi števili (lesson-identity); neujemanje brez okolice ni napaka (lahko je enačba)
  assert.deepEqual(statusi("Velja $(a+b)^2 = a^2 + 2ab + b^2$."), ["numericno"]);
  assert.deepEqual(statusi("Rešimo $2x + 3 = 7$."), ["nepreverjeno"]);
  // potrjena le prva relacija verige: delno, ne numerično
  assert.deepEqual(statusi("$(a+b)^2 = a^2 + 2ab + b^2 = c$"), ["delno"]);
  // ubežni znak \$ ni začetek formule
  assert.deepEqual(statusi("Cena je 5 \\$ in $3 \\cdot 4 = 12$"), ["numericno"]);
});

test("besede v vrstici veljajo za formulo (»napačno« ni trditev vsebine za preračun)", () => {
  assert.deepEqual(statusi("Napačno: $2+3=6$"), ["nepreverjeno"]);
  assert.equal(statusFormule("2+3=6", "Napačno: $2+3=6$"), "nepreverjeno");
  assert.equal(statusFormule("2+3=6", "Račun $2+3=6$"), "napaka");
});

test("veriga v novi vrstici se nadaljuje le, ko prejšnja formula konča vrstico", () => {
  assert.deepEqual(statusi("$\\frac{1}{2} = \\frac{5}{10}$\n$= 0,5$"), ["numericno", "numericno"]);
  assert.deepEqual(statusi("$\\frac{1}{2} = \\frac{5}{10}$\n$= 0,7$"), ["numericno", "napaka"]);
  // prejšnja formula ni na koncu vrstice: »= 0,7« ne pripada njej
  assert.deepEqual(statusi("Velja $\\frac{1}{2} = 0,5$ in še nekaj.\n$= 0,7$"), ["numericno", "nepreverjeno"]);
});

test("lekcija: razlaga, »Preveri se«, rešeni primeri, namerno napačne in vprašanja ločeno; RACUN in glava izločena", () => {
  const d = deliLekcije(
    "---\nid: x\n---\n## Razlaga\n$1+1=2$\n## Rešeni primeri\n$2+2=4$\n## Pogoste napake\n$2+2=5$\n" +
      "## Preveri se\n? Ali je $2+2=4$?\n- $5$\n~ Tako bi bilo pri $2+3=5$, tu je $3+3=7$\n+ $2+2=4$\n> ker $2+2=4$\n1. $3 \\cdot 3 = 9$\n- $2+2=5$\n<<RACUN\n2+2 = 4\n>>\n",
  );
  assert.deepEqual(statusi(d.razlaga), ["numericno"]);
  // pravilni odgovor, pojasnilo in razvrščanje so vsebina
  assert.deepEqual(statusi(d.preveri), ["numericno", "numericno", "numericno"]);
  assert.deepEqual(statusi(d.primeri), ["numericno"]);
  // »Pogoste napake« ter napačni možnosti in pojasnilo napačne možnosti (~, ponovi napačen račun) niso vsebina
  assert.equal(trditveIzBesedila(d.namerne).length, 1);
  assert.equal(trditveIzBesedila(d.napacneMoznosti).length, 3);
  assert.equal(trditveIzBesedila(d.vprasanja).length, 1);
  // vprašanje v več vrsticah (navaja napačen korak) je podatek naloge do prvega odgovora
  const q = deliLekcije("## Preveri se\n? Maja računa:\n1) $2+2=5$;\nKateri korak je napačen?\n- korak 1\n+ $2+2=4$\n");
  assert.equal(trditveIzBesedila(q.vprasanja).length, 1);
  assert.deepEqual(statusi(q.preveri), ["numericno"]);
  assert.ok(!/RACUN|id: x/.test(Object.values(d).join("\n")));
});

test("RACUN: status po načinu preverjanja (PV-03), izjema ni potrditev", async () => {
  const cas = (r) => ({ casCheck: async () => r, chemBalanced: () => ({ ok: true }), molarOk: () => ({ ok: false }) });
  const c = { line: "2+2 = 4", op: "equal", args: ["2+2", "4"] };
  assert.equal(await statusRacuna(c, cas({ ok: true, how: "symbolic" })), "izracunano");
  assert.equal(await statusRacuna(c, cas({ ok: true, how: "numeric" })), "numericno");
  assert.equal(await statusRacuna(c, cas({ ok: true, how: "sampled" })), "numericno");
  assert.equal(await statusRacuna(c, cas({ ok: false, how: "symbolic" })), "napaka");
  assert.equal(await statusRacuna(c, cas({ ok: null })), "nepreverjeno");
  const pade = { casCheck: async () => { throw new Error("rok"); } };
  assert.equal(await statusRacuna(c, pade), "nepreverjeno");
  assert.equal(await statusRacuna({ op: "chem", args: ["H2 + O2 -> H2O"] }, cas({})), "izracunano");
  assert.equal(await statusRacuna({ op: "molar", args: ["H2O", "20"] }, cas({})), "napaka");
  // molska masa z dopustom 0,6 % ni točna: numerično, ne izračunano
  const molOk = { ...cas({}), molarOk: () => ({ ok: true }) };
  assert.equal(await statusRacuna({ op: "molar", args: ["H2O", "18.1"] }, molOk), "numericno");
});

test("19 mest iz načrta: vsako ima vrstico, statična mesta so v popisu", () => {
  assert.deepEqual([...new Set(MESTA.map((x) => x.st))].sort((a, b) => a - b), Array.from({ length: 19 }, (_, i) => i + 1));
  for (const x of MESTA) assert.ok(x.staticno || x.poTrditvi, `mesto ${x.st} brez opisa statusa`);
});

test("popis celotne vsebine (brez SymPy): vsa statična mesta imajo trditve, poročilo jih našteje", async () => {
  const m = await popisi({ cas: null });
  for (const x of MESTA.filter((y) => y.staticno)) {
    const s = m[x.staticno];
    assert.ok(s.vse > 0 && s.enot > 0, `${x.mesto}: ni trditev`);
    assert.equal(STATUSI.reduce((a, k) => a + s[k], 0), s.vse, `${x.mesto}: statusi se ne seštejejo`);
  }
  assert.ok(m.racun.neizmerjeno, "brez SymPy RACUN ni izmerjen");
  assert.equal(m.racun.vse, m.racun.nepreverjeno);
  const p = porocilo(m, { datum: "2026-01-01", commit: "abc", dodatek: "## Pregled zaznanih napak\nPREGLED" });
  for (const x of MESTA) assert.ok(p.includes(x.mesto), `poročilo brez mesta ${x.mesto}`);
  assert.match(p, /niso izmerjeni \(brez SymPy\)/);
  assert.match(p, /PREGLED[\s\S]*## Omejitve/);
  // glavna številka: le vidna vsebina (RACUN ponovi njene rezultate), v celoti preverjene, z deležem nepreverjenih
  assert.ok(!VIDNA.includes("racun"));
  const tocke = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const vse = VIDNA.reduce((a, k) => a + m[k].vse, 0);
  const p1 = VIDNA.reduce((a, k) => a + polno(m[k]), 0);
  const n = VIDNA.reduce((a, k) => a + m[k].nepreverjeno, 0);
  // sklon sledi številu (12.602 trditvi, 12.603 trditve, 12.605 trditev)
  assert.ok(new RegExp(`${tocke(p1).replace(/\./g, "\\.")} trditv(?:ev|i|e|a) od ${tocke(vse).replace(/\./g, "\\.")}`).test(p), "glavna številka");
  assert.ok(p.includes(`Brez statusa (»Nepreverjeno«): ${tocke(n)}`));
});

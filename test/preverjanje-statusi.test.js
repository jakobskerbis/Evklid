// PV-01 (docs/preverjanje.md): enotni statusi preverjanja in zapis trditve. Test varuje tri obljube:
//   1. skener ima po prehodu na skupno definicijo za vsak vhod enak status kot prej (nobene vidne spremembe);
//   2. status nikoli ni močnejši od dokaza (numerično ni nikoli »izracunano«, SymPy ni nikoli »dokazano«);
//   3. odgovor je najšibkejši člen: »dokazano« samo, ko je dokazana vsaka trditev.
import { test } from "node:test";
import assert from "node:assert/strict";
import { STATUSI, statusIzDokazov, statusOdgovora, jePotrjeno, vSkener, izSkenerja } from "../public/preverjanje/statusi.js";
import { novaTrditev, napakeZapisa, statusTrditve, izidTrditve, VRSTE } from "../public/preverjanje/trditev.js";
import { statusOf, STATUSES } from "../public/scan/status.js";

// Pravila skenerja, kot so bila pred PV-01 (public/scan/status.js na main ead79d5), prepisana dobesedno.
function staroSkener({ holds = null, how = "numeric", complete = "unknown" } = {}) {
  if (holds === false || complete === false) return "wrong";
  if (holds !== true) return "unverified";
  if (complete === "unknown") return "partial";
  if (how === "exact" && (complete === "exact" || complete === "na")) return "verified";
  return "numeric";
}

const HOLDS = [true, false, null, undefined, 0, "da"];
const HOW = ["exact", "numeric", "formal", undefined, "sympy", "", null];
const COMPLETE = ["exact", "na", "numeric", "unknown", "formal", false, undefined, null, "x", 0];

test("skener: za vsak vhod enak status kot pred PV-01", () => {
  let n = 0;
  for (const holds of HOLDS)
    for (const how of HOW)
      for (const complete of COMPLETE) {
        const e = {};
        if (holds !== undefined) e.holds = holds;
        if (how !== undefined) e.how = how;
        if (complete !== undefined) e.complete = complete;
        assert.equal(statusOf(e), staroSkener(e), JSON.stringify(e));
        n++;
      }
  assert.equal(statusOf(), "unverified");
  assert.equal(statusOf({ holds: true, how: "formal", complete: "formal" }), "numeric"); // skener Leana ne pozna
  assert.equal(n, HOLDS.length * HOW.length * COMPLETE.length);
  assert.deepEqual(STATUSES, ["verified", "partial", "numeric", "unverified", "wrong"]);
});

test("sedem statusov in preslikava skenerja", () => {
  assert.deepEqual(STATUSI, ["dokazano", "izracunano", "numericno", "delno", "v_teku", "napaka", "nepreverjeno"]);
  assert.deepEqual(STATUSES.map(izSkenerja), ["izracunano", "delno", "numericno", "nepreverjeno", "napaka"]);
  for (const s of STATUSES) assert.equal(vSkener(izSkenerja(s)), s); // tja in nazaj brez izgube
  assert.equal(vSkener("dokazano"), "verified");
  assert.equal(vSkener("v_teku"), "unverified"); // v teku ni odgovor
  assert.equal(vSkener("neznano"), "unverified");
  assert.equal(izSkenerja("neznano"), "nepreverjeno");
  assert.deepEqual(STATUSI.filter(jePotrjeno), ["dokazano", "izracunano"]);
});

test("statusIzDokazov: status ni nikoli močnejši od dokaza", () => {
  const s = (holds, how, complete) => statusIzDokazov({ holds, how, complete });
  assert.equal(s(true, "formal", "formal"), "dokazano");
  assert.equal(s(true, "formal", "na"), "dokazano");
  assert.equal(s(true, "formal", "exact"), "izracunano"); // popolnost samo iz SymPy: ni formalno dokazano
  assert.equal(s(true, "exact", "formal"), "izracunano"); // trditev samo iz SymPy
  assert.equal(s(true, "exact", "exact"), "izracunano");
  assert.equal(s(true, "exact", "na"), "izracunano");
  assert.equal(s(true, "formal", "numeric"), "numericno");
  assert.equal(s(true, "numeric", "formal"), "numericno");
  assert.equal(s(true, "numeric", "na"), "numericno");
  assert.equal(s(true, "formal", "unknown"), "delno");
  assert.equal(s(false, "formal", "formal"), "napaka");
  assert.equal(s(true, "formal", false), "napaka");
  assert.equal(s(null, "formal", "formal"), "nepreverjeno");
  // numerični preizkus nikoli ne doseže »izracunano« ali »dokazano«, ne glede na popolnost
  for (const c of ["formal", "exact", "na", "numeric"]) assert.equal(s(true, "numeric", c), "numericno");
});

test("statusOdgovora: najšibkejši člen", () => {
  assert.equal(statusOdgovora([]), "nepreverjeno");
  assert.equal(statusOdgovora(["dokazano", "dokazano"]), "dokazano");
  // samo končni rezultat dokazan, korak pa le izračunan: odgovor ni formalno dokazan
  assert.equal(statusOdgovora(["dokazano", "izracunano"]), "izracunano");
  assert.equal(statusOdgovora(["dokazano", "izracunano", "numericno"]), "numericno");
  assert.equal(statusOdgovora(["numericno", "delno"]), "delno");
  assert.equal(statusOdgovora(["dokazano", "nepreverjeno"]), "delno");
  assert.equal(statusOdgovora(["nepreverjeno", "nepreverjeno"]), "nepreverjeno");
  assert.equal(statusOdgovora(["dokazano", "v_teku"]), "v_teku");
  assert.equal(statusOdgovora(["v_teku", "napaka"]), "napaka");
  assert.equal(statusOdgovora(["dokazano", "dokazano", "napaka"]), "napaka");
  assert.equal(statusOdgovora(["dokazano", "kar nekaj"]), "delno"); // neznan status = nepreverjeno
  // za vse pare: »dokazano« samo, ko sta obe dokazani; »napaka« vedno zmaga
  for (const a of STATUSI)
    for (const b of STATUSI) {
      const r = statusOdgovora([a, b]);
      assert.ok(STATUSI.includes(r));
      assert.equal(r === "dokazano", a === "dokazano" && b === "dokazano", `${a}+${b}`);
      if (a === "napaka" || b === "napaka") assert.equal(r, "napaka");
      if (jePotrjeno(r)) assert.ok(jePotrjeno(a) && jePotrjeno(b), `${a}+${b} → ${r}`);
    }
});

test("statusTrditve: več dokazov za isto trditev", () => {
  const izrek = { izrek: "Evklid.Primer.x", sha256: "ab" };
  const sympyDa = { motor: "sympy", holds: true, how: "exact", complete: "exact" };
  const leanDa = { motor: "lean", holds: true, how: "formal", complete: "formal" };
  const stevilaDa = { motor: "stevila", holds: true, how: "numeric", complete: "na" };
  const stevilaNe = { motor: "stevila", holds: false, how: "numeric", complete: "na" };
  const sympyNe = { motor: "sympy", holds: false, how: "exact", complete: "na" };
  assert.equal(statusTrditve([]), "nepreverjeno");
  assert.equal(statusTrditve([stevilaDa, sympyDa], "racun"), "izracunano"); // najmočnejši dokaz
  assert.equal(statusTrditve([sympyDa, leanDa], "racun", izrek), "dokazano");
  assert.equal(statusTrditve([sympyDa, leanDa], "racun"), "izracunano"); // Lean brez imena izreka ne šteje
  assert.equal(statusTrditve([sympyNe], "racun"), "napaka");
  // SymPy »ne drži« je lahko iz naključnih točk: ob dokazu Lean motorja se ne strinjata
  assert.equal(statusTrditve([leanDa, sympyNe], "racun", izrek), "nepreverjeno");
  assert.equal(statusTrditve([{ motor: "lean", holds: false, how: "formal", complete: "na" }, sympyDa], "racun", izrek), "napaka");
  assert.equal(statusTrditve([stevilaNe], "racun"), "napaka");
  assert.equal(statusTrditve([stevilaNe, sympyDa], "racun"), "nepreverjeno"); // motorja se ne strinjata: ne potrdimo
  // manjkajoča rešitev (številsko) ostane napaka, če točen motor popolnosti ni preveril
  const manjka = { motor: "stevila", holds: true, how: "numeric", complete: false };
  assert.equal(statusTrditve([manjka, { motor: "sympy", holds: true, how: "exact", complete: "unknown" }], "enacba"), "napaka");
  assert.equal(statusTrditve([manjka, sympyDa], "enacba"), "nepreverjeno");
  // »ne drži« ovrže samo »drži« močnejšega motorja, ne dokaz popolnosti
  assert.equal(statusTrditve([{ motor: "stevila", holds: false, how: "numeric", complete: "exact" }, { motor: "sympy", holds: null, how: "exact", complete: "exact" }], "enacba"), "napaka");
  // manjkajoče rešitve ne ovrže močnejši »na« (popolnost pri tej trditvi obstaja), tudi pri vrstah brez popolnosti
  const sympyNa = { motor: "sympy", holds: true, how: "exact", complete: "na" };
  for (const v of ["korak", "racun", "beseda", undefined]) assert.equal(statusTrditve([manjka, sympyNa], v), "napaka");
  // Leanov protiprimer šteje tudi brez imena izreka
  const leanNe = { motor: "lean", holds: false, how: "formal", complete: "na" };
  assert.equal(statusTrditve([sympyNa, leanNe], "racun"), "napaka");
  assert.deepEqual(napakeZapisa(novaTrditev({ id: "a", besedilo: "2+2=5", zapis: "2+2=5", vrsta: "racun", dokazi: [leanNe] })), []);
  // brez vrste »na« ne velja kot popolnost
  assert.equal(statusTrditve([sympyNa]), "delno");
  assert.equal(statusTrditve([sympyNa], "racun"), "izracunano");
});

test("statusTrditve: motor ne more navesti več, kot zmore", () => {
  const izrek = { izrek: "Evklid.Primer.x" };
  const formal = { holds: true, how: "formal", complete: "formal" };
  assert.equal(statusTrditve([{ ...formal, motor: "ai" }], "racun", izrek), "nepreverjeno"); // mnenje AI ni dokaz
  assert.equal(statusTrditve([{ ...formal, motor: "chatgpt" }], "racun", izrek), "nepreverjeno"); // neznan motor
  assert.equal(statusTrditve([{ ...formal, motor: "AI" }], "racun", izrek), "nepreverjeno");
  assert.equal(statusTrditve([formal], "racun", izrek), "nepreverjeno"); // brez motorja
  assert.equal(statusTrditve([{ ...formal, motor: "__proto__" }], "racun", izrek), "nepreverjeno");
  assert.equal(statusTrditve([{ ...formal, motor: "sympy" }], "racun", izrek), "izracunano"); // SymPy ni Lean
  assert.equal(statusTrditve([{ ...formal, motor: "stevila" }], "racun", izrek), "numericno"); // števila niso dokaz
  assert.equal(statusTrditve([{ motor: "ai", holds: false, how: "exact", complete: "na" }], "racun"), "nepreverjeno");
  // pri enačbi popolnost ne more biti »na«: brez dokaza popolnosti je trditev le delno preverjena
  assert.equal(statusTrditve([{ motor: "sympy", holds: true, how: "exact", complete: "na" }], "enacba"), "delno");
  assert.equal(statusTrditve([{ motor: "sympy", holds: true, how: "exact", complete: "na" }], "identiteta"), "izracunano");
  // slab vhod ne podre ničesar
  for (const x of [null, undefined, {}, "dokazano", 5, [null, 1, "x"]]) assert.equal(statusTrditve(x), "nepreverjeno");
  assert.equal(statusOdgovora(null), "nepreverjeno");
  assert.equal(statusOdgovora("dokazano"), "nepreverjeno");
  assert.equal(novaTrditev(null).izid, "nepreverjeno");
});

test("zapis trditve: polja in preverjanje oblike", () => {
  const t = novaTrditev({
    id: "k1",
    besedilo: "Rešitvi sta 2 in 3.",
    zapis: "x^2-5*x+6=0 | x | 2, 3",
    vrsta: "enacba",
    dokazi: [{ motor: "sympy", holds: true, how: "exact", complete: "exact", ms: 40 }],
  });
  assert.deepEqual(Object.keys(t), ["id", "besedilo", "zapis", "vrsta", "predpostavke", "obmocje", "enote", "prejsnji", "pravilo", "dokazi", "dokaz", "izid"]);
  assert.equal(t.izid, "izracunano");
  assert.deepEqual(napakeZapisa(t), []);
  assert.equal(novaTrditev({}).izid, "nepreverjeno");
  assert.ok(VRSTE.includes("beseda") && VRSTE.includes("korak"));
  // besedna trditev nima zapisa, druge ga morajo imeti
  assert.deepEqual(napakeZapisa(novaTrditev({ id: "b1", besedilo: "Funkcija narašča.", vrsta: "beseda" })), []);
  assert.ok(napakeZapisa(novaTrditev({ id: "r1", besedilo: "7 · 8 = 56", vrsta: "racun" })).some((e) => e.startsWith("zapis")));
  assert.ok(napakeZapisa({ id: "", besedilo: "", vrsta: "x", dokazi: [{ motor: "?", holds: 1 }] }).length >= 4);
  assert.deepEqual(napakeZapisa(null), ["trditev ni predmet"]);
  // izid, ki ga je vir nastavil sam, se mora ujemati z dokazi
  assert.ok(napakeZapisa({ ...t, izid: "dokazano" }).some((e) => e.startsWith("izid dokazano")));
  assert.equal(izidTrditve(t), "izracunano");
  const slab = napakeZapisa({ ...t, dokazi: [{ motor: "ai", holds: true, how: "formal" }, { motor: "sympy", holds: true, how: "exact", complete: "na" }, { motor: "lean", holds: true, how: "formal", complete: "formal" }] });
  assert.ok(slab.some((e) => e.includes("motor ai ne sme")));
  assert.ok(slab.some((e) => e.includes("popolnost del trditve")));
  assert.ok(slab.some((e) => e.includes("Lean brez imena izreka")));
  // vhodni predmet se ne spremeni (dokazi se kopirajo)
  const d = [{ motor: "sympy", holds: true, how: "exact", complete: "na" }];
  novaTrditev({ id: "x", besedilo: "1+1=2", zapis: "1+1 | 2", vrsta: "racun", dokazi: d }).dokazi[0].holds = false;
  assert.equal(d[0].holds, true);
});

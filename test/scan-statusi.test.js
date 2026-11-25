// Skener: pet statusov preverjanja (P3-1) in AUDIT-001 do konca (P3-2). Pričakovani statusi izhajajo iz matematike
// naloge (znana celotna množica rešitev), ne iz izida kode: test pade, če kateri primer brez dokaza popolnosti
// dobi »Preverjeno«.
import { test } from "node:test";
import assert from "node:assert/strict";
import { statusOf, STATUSES } from "../public/scan/status.js";
import { solve } from "../public/scan/solvecore.js";
import { verifyAi } from "../public/scan/verify.js";
import { Q, Surd, polyEquationProof, inequalityProof, inequalityCheck, sturmChain, sturmCount, exactRoots, surdOf, isolateRoots } from "../public/scan/algebra.js";
import { parse } from "../public/graph/math.js";
import { verifyAiFull } from "../server/scan.js";
import { casAvailable } from "../server/cas.js";

test("statusOf: pravila za pet statusov", () => {
  assert.deepEqual(STATUSES, ["verified", "partial", "numeric", "unverified", "wrong"]);
  assert.equal(statusOf({ holds: true, how: "exact", complete: "exact" }), "verified");
  assert.equal(statusOf({ holds: true, how: "exact", complete: "na" }), "verified");
  assert.equal(statusOf({ holds: true, how: "exact", complete: "unknown" }), "partial");
  assert.equal(statusOf({ holds: true, how: "numeric", complete: "unknown" }), "partial");
  // numerična potrditev nikoli ni »Preverjeno«, tudi ko je popolnost dokazana
  assert.equal(statusOf({ holds: true, how: "numeric", complete: "exact" }), "numeric");
  assert.equal(statusOf({ holds: true, how: "exact", complete: "numeric" }), "numeric");
  assert.equal(statusOf({ holds: true, how: "numeric", complete: "na" }), "numeric");
  assert.equal(statusOf({ holds: null }), "unverified");
  assert.equal(statusOf({}), "unverified");
  assert.equal(statusOf({ holds: false }), "wrong");
  assert.equal(statusOf({ holds: true, how: "exact", complete: false }), "wrong");
});

test("lastni reševalnik: status po vrsti naloge", () => {
  const cases = [
    ["2x+3=7", "verified"],
    ["x^2-5x+6=0", "verified"],
    ["x^2=2", "verified"], // ±√2 vstavljena točno (u + w√c)
    ["x^2+1=0", "verified"], // ni realnih rešitev: Sturm prešteje 0
    ["(x-1)^2*(x+3)=0", "verified"],
    ["x^4-5x^2+4=0", "verified"],
    ["1/x+1/(x-1)=0", "verified"],
    ["(x^2-1)/(x-1)=2", "verified"], // x = 1 izločen, drugih rešitev ni
    ["x^3-2=0", "numeric"], // približek ∛2: popolnost dokazana, vrednost le numerično
    ["x^3-3x+1=0", "numeric"],
    ["x^2-3x+2<0", "verified"],
    ["x^2>=2", "verified"],
    ["(x-1)^2>0", "verified"],
    ["2<x+1<5", "verified"],
    ["x+y=3;x-y=1", "verified"],
    ["x+y=2;2x+2y=4", "verified"],
    ["x+y=2;x+y=3", "verified"],
    ["2/3+1/4", "verified"],
    ["sin(30)", "numeric"],
    ["d/dx(x^3+2x)", "verified"],
    ["d/dx(sin(x))", "numeric"],
  ];
  for (const [t, st] of cases) {
    const r = solve(t);
    assert.equal(r.ok, true, t);
    assert.equal(r.status, st, t);
    assert.equal(r.verified, true, t);
  }
});

test("AUDIT-001: dvojna ničla brez spremembe predznaka ni več »∅, preverjeno« (gre k AI)", () => {
  // x⁴ − 4x² + 4 = (x² − 2)²: prej »x ∈ ∅« s statusom preverjeno, pravilno x = ±√2
  for (const t of ["x^4-4x^2+4=0", "(x^2-3)^2*(x^2+1)=0"]) {
    const r = solve(t);
    assert.equal(r.ok, false, t);
    assert.equal(r.reason, "unverified", t);
  }
});

test("AUDIT-001: sistem 2×2 z determinanto 0 se odloči po rangu, ne vedno »preverjeno«", () => {
  // 0 = 5 in 0 = 0: sistem nima rešitve (prej »neskončno rešitev«)
  const r = solve("0*x+0*y=5;0*x+0*y=0");
  if (r.ok) {
    assert.equal(r.answer.key, "scan.a.none");
    assert.equal(r.status, "verified");
  }
  assert.equal(solve("x+y=2;2x+2y=4").answer.key, "scan.a.sysMany");
  assert.equal(solve("x+y=2;2x+2y=5").answer.key, "scan.a.none");
});

test("algebra: Sturmov izrek, točni koreni in neenačbe", () => {
  const q = (n, d = 1n) => new Q(BigInt(n), BigInt(d));
  // (x − 2)(x − 2·10⁶): dve ničli, ena zunaj nekdanjega iskanja ±10⁶
  const cs = [q(4000000), q(-2000002), q(1)];
  assert.equal(sturmCount(sturmChain(cs)), 2);
  const one = polyEquationProof(cs, [{ s: new Surd(q(2)) }]);
  assert.equal(one.complete, false);
  assert.ok(Math.abs(one.missing[0] - 2000000) < 1e-3);
  assert.equal(polyEquationProof(cs, [{ s: new Surd(q(2)) }, { s: new Surd(q(2000000)) }]).complete, true);
  // napačna trditev
  assert.equal(polyEquationProof(cs, [{ s: new Surd(q(3)) }]).holds, false);
  // √2 točno
  const r2 = surdOf(parse("sqrt(8)/2"));
  assert.equal(r2.c, 2n);
  assert.equal(polyEquationProof([q(-2), q(0), q(1)], [{ s: r2 }, { s: r2.neg() }]).exact, true);
  assert.deepEqual(exactRoots([q(-2), q(0), q(1)]).map((x) => Math.round(x.num() * 1e6) / 1e6), [-1.414214, 1.414214]);
  // neenačba: (1, 2) da, [1, 2) ne, (x − 1)² ≥ 0 je ℝ, (x − 1)² > 0 ni ℝ
  const c12 = [q(2), q(-3), q(1)];
  const s = (n) => new Surd(q(n));
  assert.equal(inequalityProof([{ cs: c12, op: "<" }], [{ lo: s(1), hi: s(2) }]), true);
  assert.equal(inequalityProof([{ cs: c12, op: "<" }], [{ lo: s(1), hi: s(2), loClosed: true }]), false);
  assert.equal(inequalityProof([{ cs: [q(1), q(-2), q(1)], op: ">=" }], [{ lo: null, hi: null }]), true);
  assert.equal(inequalityProof([{ cs: [q(1), q(-2), q(1)], op: ">" }], [{ lo: null, hi: null }]), false);
  // stopnja > 2: ničle kot Sturmovi izolirajoči intervali (x³ < 2 je (−∞, ∛2), ne (−∞, 1))
  assert.equal(inequalityProof([{ cs: [q(-2), q(0), q(0), q(1)], op: "<" }], [{ lo: null, hi: s(1) }]), false);
  assert.equal(inequalityProof([{ cs: [q(-8), q(0), q(0), q(1)], op: "<" }], [{ lo: null, hi: s(2) }]), true);
  // krajišče ∛2 kot zaokroženo decimalno število: drži le približno
  assert.deepEqual(inequalityCheck([{ cs: [q(-2), q(0), q(0), q(1)], op: "<" }], [{ lo: null, hi: { s: new Surd(new Q(126n, 100n)), tol: 0.005 } }]), { holds: true, exact: false });
  assert.equal(inequalityProof([{ cs: [q(-2), q(0), q(0), q(1)], op: "<" }], [{ lo: null, hi: { s: new Surd(new Q(126n, 100n)), tol: 0.005 } }]), null);
});

// Psevdonaključna števila z zrnom (ponovljiv test).
function rng(seed) {
  let x = seed >>> 0;
  return () => {
    x = (Math.imul(x ^ (x >>> 15), 2246822507) + 0x9e3779b9) >>> 0;
    x = (x ^ (x >>> 13)) >>> 0;
    return x / 2 ** 32;
  };
}
// ničla med 10⁻⁶ in 10¹² (racionalna, z naključnim predznakom) kot niz in kot Q
function randomRoot(r) {
  const exp = Math.floor(r() * 19) - 6; // 10^-6 … 10^12
  const mant = 1 + Math.floor(r() * 9);
  const neg = r() < 0.4;
  const num = exp >= 0 ? BigInt(mant) * 10n ** BigInt(exp) : BigInt(mant);
  const den = exp >= 0 ? 1n : 10n ** BigInt(-exp);
  const text = (neg ? "-" : "") + (exp >= 0 ? String(num) : `${mant}/${den}`);
  return { text, q: new Q(neg ? -num : num, den) };
}
function polyText(roots) {
  return roots.map((x) => `(x-(${x.text}))`).join("*") + "=0";
}

test("AUDIT-001: 200 naključnih polinomov z ničlami od 10⁻⁶ do 10¹², AI izpusti eno ničlo → nikoli »Preverjeno«", async () => {
  const r = rng(20261125);
  let checked = 0;
  for (let i = 0; i < 200; i++) {
    const deg = 2 + Math.floor(r() * 3);
    const roots = [];
    while (roots.length < deg) {
      const x = randomRoot(r);
      if (!roots.some((y) => y.q.eq(x.q))) roots.push(x);
    }
    const text = polyText(roots);
    const drop = Math.floor(r() * deg);
    const sol = { kind: "equation", variable: "x", solutions: roots.filter((_, j) => j !== drop).map((x) => x.text) };
    const n = verifyAi(text, sol);
    assert.notEqual(n.status, "verified", text);
    assert.equal(n.verified, false, text);
    const full = await verifyAiFull(text, sol, { cas: false });
    assert.notEqual(full.status, "verified", text);
    assert.equal(full.verified, false, text);
    // celoten odgovor dokaže točna algebra brez SymPy
    const all = verifyAi(text, { ...sol, solutions: roots.map((x) => x.text) });
    assert.equal(all.status, "verified", text);
    checked++;
  }
  assert.equal(checked, 200);
});

test("AUDIT-001: (x−2)(x−2000000)=0 z odgovorom samo x = 2, brez in s SymPy", async () => {
  const t = "(x-2)*(x-2000000)=0";
  const sol = { kind: "equation", variable: "x", solutions: ["x=2"] };
  const brez = await verifyAiFull(t, sol, { cas: false });
  assert.equal(brez.status, "wrong");
  assert.equal(brez.reason, "missing");
  if (!(await casAvailable())) return; // SymPy ni nameščen: del s SymPy preveri CI na Renderju podobnem okolju
  const z = await verifyAiFull(t, sol);
  assert.equal(z.status, "wrong");
  assert.equal(z.reason, "missing");
  assert.equal((await verifyAiFull(t, { ...sol, solutions: ["2", "2000000"] })).status, "verified");
});

test("AI neenačbe (P3-3): točno, numerično ali napačno; nikoli lažno »Preverjeno«", async () => {
  const cases = [
    ["x^2-3x+2<0", "(1, 2)", "verified"],
    ["x^2-3x+2<0", "[1, 2)", "wrong"],
    ["x^2>=2", "(-oo, -sqrt(2)] U [sqrt(2), oo)", "verified"],
    ["x^2+1<0", "{}", "verified"],
    ["x^2+1>0", "R", "verified"],
    ["1/x>2", "(0, 1/2)", "numeric"], // brez SymPy: ni polinom, mreža točk
    ["1/x>2", "(0, 1)", "wrong"],
    ["log(x)<1", "(0, 10)", "numeric"],
    ["x^3<8", "(-oo, 2)", "verified"], // stopnja 3: Sturm (izolirane ničle) in točno krajišče 2
  ];
  for (const [t, value, st] of cases) {
    const ai = { kind: "inequality", variable: "x", value };
    assert.equal(verifyAi(t, ai).status, st, `${t} ${value}`);
    const full = await verifyAiFull(t, ai, { cas: false });
    assert.equal(full.status, st, `${t} ${value}`);
  }
  if (!(await casAvailable())) return;
  // s SymPy (obstoječa operacija ineq) je racionalna neenačba dokazana
  assert.equal((await verifyAiFull("1/x>2", { kind: "inequality", variable: "x", value: "(0, 1/2)" })).status, "verified");
  assert.equal((await verifyAiFull("1/x>2", { kind: "inequality", variable: "x", value: "(0, 1)" })).status, "wrong");
});

test("SymPy pri periodičnih rešitvah da največ »Delno preverjeno«", async () => {
  if (!(await casAvailable())) return;
  const r = await verifyAiFull("sin(x)=0", { kind: "equation", variable: "x", solutions: ["k*pi"] });
  assert.equal(r.status, "partial");
  assert.equal(r.verified, false);
});

test("pregled 2: verige, zaokrožene rešitve, majhne ničle, velika števila, imenovalci", async () => {
  const eq = (t, sols) => verifyAi(t, { kind: "equation", variable: "x", solutions: sols });
  // veriga a = b = c: rešitev je samo skupna ničla (1), −1 ne drži
  assert.equal(eq("x^2 - 1 = 0 = x - 1", ["1", "-1"]).status, "wrong");
  assert.equal(eq("x^2 - 1 = 0 = x - 1", ["1"]).status, "verified");
  // zaokrožena decimalna rešitev je približek: »Numerično preverjeno«, ne »Napačno« in ne »Preverjeno«
  assert.equal(eq("x^3 - x - 1 = 0", ["1.324718"]).status, "numeric");
  assert.equal(eq("x^2 = 2", ["1.41421356", "-1.41421356"]).status, "numeric");
  assert.equal(eq("x^2 = 2", ["1.41421356"]).status, "wrong");
  assert.equal(eq("x^2 = 2", ["1.5", "-1.41421356"]).status, "wrong");
  assert.equal(eq("x^2 = 6.25", ["2.5", "-2.5"]).status, "verified"); // točna decimalka ostane točna
  // ničli 10⁻⁶ in 2·10⁻⁶ nista ena ničla
  assert.equal(eq("(x-0.000001)*(x-0.000002) = 0", ["1*10^(-6)", "2*10^(-6)"]).status, "verified");
  const one = eq("(x-0.000001)*(x-0.000002) = 0", ["0.000001"]);
  assert.equal(one.reason, "missing");
  assert.ok(Math.abs(one.missing[0] - 2e-6) < 1e-12);
  // število, ki ga double ne zapiše točno: lokalno ne odločamo (SymPy dobi besedilo)
  assert.equal(eq("x - 12345678901234567 = 0", ["12345678901234567"]).status, "unverified");
  assert.equal(solve("x - 12345678901234567 = 0").ok, false);
  assert.equal(solve("2x = 12345678901234567").ok, false);
  // imenovalec x² − 2 je pri ±√2 enak 0: rešitev ni (prej ±√2 »numerično«)
  assert.equal(solve("x^2/(x^2-2) = 2/(x^2-2)").ok, false);
  assert.equal(solve("1/(x^2-2) = 1").status, "verified");
  // hitrost: visoka stopnja brez trditev in velik koren ne zadržita strežnika
  const W = Array.from({ length: 16 }, (_, i) => `(x-${i + 1})`).join("*") + "=0";
  let t = Date.now();
  assert.equal(eq(W, []).status, "wrong");
  assert.equal(eq(W, ["1"]).status, "wrong");
  assert.equal(eq(W, Array.from({ length: 16 }, (_, i) => String(i + 1))).status, "verified");
  assert.ok(Date.now() - t < 1500, `${Date.now() - t} ms`);
  t = Date.now();
  solve("x^2 - 99999999999999999999999999 < 0");
  solve("x^2 - 9999999999999 < 0");
  assert.ok(Date.now() - t < 1500, `${Date.now() - t} ms`);
});

test("pregled 2: neenačbe višje stopnje in nepolinomske – krajišča in izolirane točke", () => {
  const iq = (t, value) => verifyAi(t, { kind: "inequality", variable: "x", value }).status;
  const cases = [
    ["x^3>8", "[2,oo)", "wrong"],
    ["x^3>8", "(2,oo)", "verified"],
    ["x^3>=8", "(2,oo)", "wrong"],
    ["x^4>=1", "(-oo,-1)U(1,oo)", "wrong"],
    ["x^4>=1", "(-oo,-1]U[1,oo)", "verified"],
    ["(x-1)^2*(x-2)>=0", "[2,oo)", "wrong"], // manjka izolirana rešitev x = 1
    ["(x-1)^2*(x-2)>=0", "{1} U [2,oo)", "verified"],
    ["x^3-2x<0", "(-oo,-sqrt(2)) U (0, sqrt(2))", "verified"],
    ["x^3-2x<0", "(-oo,-1.414) U (0, 1.414)", "numeric"],
    ["x^3-x-1>0", "(1.3247, oo)", "numeric"],
    ["x^3-x-1>0", "(1.4, oo)", "wrong"],
    ["1/x>1", "(0,1]", "wrong"],
    ["1/x>1", "(0,1)", "numeric"],
    ["sqrt(x)<2", "(0,4)", "wrong"],
    ["sqrt(x)<2", "[0,4)", "numeric"],
    // zapisi množic
    ["x^2<=4", "x ∈ [-2,2]", "verified"],
    ["x^2<4", "]-2,2[", "verified"],
    ["x^2>0", "R \\ {0}", "verified"],
  ];
  for (const [t, value, st] of cases) assert.equal(iq(t, value), st, `${t} ${value}`);
});

test("isolateRoots: sosednja ničla v levem krajišču intervala ne pokvari iskanja", () => {
  const q = (n) => new Q(BigInt(n));
  // (x − 1)²(x − 2): ločena intervala okoli 1 in 2 (prej sta bila oba pri 1)
  const r = isolateRoots([q(-2), q(5), q(-4), q(1)]);
  assert.deepEqual(r.map((x) => Math.round(x.x * 1e6) / 1e6), [1, 2]);
});

test("samodejne ponovitve: strežnik sam poskusi znova (do SOLVE_ATTEMPTS), učencu ni treba pritiskati", async () => {
  const { solveWithRetries, SOLVE_ATTEMPTS, retryFeedback } = await import("../server/scan.js");
  assert.equal(SOLVE_ATTEMPTS, 3);
  const text = "sqrt(x+3)=x-3"; // pravilno samo x = 6 (x = 1 je lažna rešitev)
  const run = async (answers, opt = {}) => {
    const prompts = [];
    let i = 0;
    const ask = async (fb) => {
      prompts.push(fb);
      const a = answers[Math.min(i++, answers.length - 1)];
      if (a instanceof Error) throw a;
      return { sol: a && { kind: "equation", variable: "x", solutions: a }, usage: { n: i } };
    };
    const verify = (sol) => verifyAiFull(text, sol, { cas: false });
    return { ...(await solveWithRetries({ ask, verify, ...opt })), prompts };
  };
  // dvakrat lažna rešitev, tretjič pravilno: tri klici, obdrži se pravilna
  let r = await run([["1", "6"], ["1", "6"], ["6"]]);
  assert.equal(r.usage.length, 3);
  assert.deepEqual(r.out.sol.solutions, ["6"]);
  assert.notEqual(r.check.status, "wrong");
  // vsak ponovni poziv dobi vse prejšnje neuspehe in navedeni odgovor
  assert.equal(r.prompts[0].length, 0);
  assert.equal(r.prompts[2].length, 2);
  assert.match(r.prompts[1][0], /1; 6/);
  // pravilno že prvič: en klic
  r = await run([["6"]]);
  assert.equal(r.usage.length, 1);
  // vedno napačno: največ SOLVE_ATTEMPTS klicev, nato »Napačno«
  r = await run([["1"]]);
  assert.equal(r.usage.length, SOLVE_ATTEMPTS);
  assert.equal(r.check.status, "wrong");
  // neberljiv odgovor sproži ponovitev tudi pri nalogi s podatki; napačnost tam ne
  r = await run([null, ["6"]], { canRetry: false });
  assert.equal(r.usage.length, 2);
  r = await run([["1"]], { canRetry: false });
  assert.equal(r.usage.length, 1);
  // napaka ponovitve ne odnese plačanega prvega klica
  r = await run([["1", "6"], new Error("529")]);
  assert.equal(r.usage.length, 1);
  assert.deepEqual(r.out.sol.solutions, ["1", "6"]);
  assert.equal(retryFeedback(null, {}), "the answer was not the requested JSON");
  // odrezan odgovor (max_tokens): prosimo za krajšega
  assert.match(retryFeedback(null, {}, { cut: true }), /cut off/);
  // povratna informacija je omejena (dolg izpis SymPy ali dolge rešitve ne napihnejo poziva)
  assert.ok(retryFeedback({ solutions: ["1".repeat(900)] }, { reason: "wrong" }).length <= 600);
  // brez prostora v mejah porabe za naslednji klic: ni ponovitve, ostane prvi odgovor
  let afford = 0;
  r = await run([["1"]], { canAfford: () => afford++ < 1 });
  assert.equal(r.usage.length, 2);
  assert.equal(afford, 2);
});

test("ponovni pregled: tisočice s presledki, poli v iracionalnih krajiščih, zaokrožena krajišča, nepolinomski približki", () => {
  // skupine tisočic razčlenjevalnik združi v eno število nad 2⁵³: lokalno ne odločamo
  assert.equal(solve("2x = 12 345 678 901 234 567").ok, false);
  assert.equal(solve("x + 1 = 9 007 199 254 740 993").ok, false);
  assert.equal(verifyAi("x - 1 = 9 007 199 254 740 993", { kind: "equation", variable: "x", solutions: ["9 007 199 254 740 994"] }).status, "unverified");
  assert.match(solve("x^2 = 30001800027").answer.tex, /100003\\sqrt\{3\}/);
  const iq = (t, value) => verifyAi(t, { kind: "inequality", variable: "x", value }).status;
  const cases = [
    // pol v iracionalnem krajišču: v zaokroženi točki je imenovalec le skoraj 0 (prej lažno »napačno«)
    ["1/(x^2 - 2) > 0", "(-oo, -sqrt(2)) U (sqrt(2), oo)", "numeric"],
    ["(x+1)/(x^2 - 5) < 0", "(-oo, -sqrt(5)) U (-1, sqrt(5))", "numeric"],
    ["1/(49x-1) < 0", "(-oo, 1/49)", "numeric"],
    ["(x-300)^3*(x^2-2) >= 0", "[-sqrt(2), sqrt(2)] U [300, oo)", "verified"],
    // zaokroženo krajišče: oklepaj in izolirana točka se preverita v ničli
    ["(x^2-2)^2 < 0", "{1.414}", "wrong"],
    ["x^2 - 2 < 0", "[-1.414, 1.414]", "wrong"],
    ["x^2 - 2 < 0", "(-1.414, 1.414)", "numeric"],
    ["x^3 - 2 >= 0", "(1.259921, oo)", "wrong"],
    ["x^3 - 2 >= 0", "[1.259921, oo)", "numeric"],
    // iracionalno krajišče, ki je ničla višje stopnje: manjkajoča izolirana točka 5
    ["(x^2-3)*(x-5)^2 <= 0", "[-sqrt(3), sqrt(3)]", "wrong"],
    ["(x^2-3)*(x-5)^2 <= 0", "[-sqrt(3), sqrt(3)] U {5}", "verified"],
  ];
  for (const [t, value, st] of cases) assert.equal(iq(t, value), st, `${t} ${value}`);
  // visoka stopnja: brez sekund čakanja
  const t0 = Date.now();
  iq(Array.from({ length: 16 }, (_, i) => `(x-${i})`).join("*") + " > 0", "(15, oo)");
  iq(Array.from({ length: 8 }, (_, i) => `(x^2-${i + 2})`).join("*") + " > 0", "(3, oo)");
  assert.ok(Date.now() - t0 < 1500, `${Date.now() - t0} ms`);
  // nepolinomska enačba z zaokroženo rešitvijo: približek, ne »napačno«
  const eq = (t, s) => verifyAi(t, { kind: "equation", variable: "x", solutions: s }).status;
  assert.equal(eq("2^x = 3", ["1.585"]), "numeric");
  assert.equal(eq("cos(x) = x", ["0.739"]), "numeric");
  assert.equal(eq("2^x = 3", ["2"]), "wrong");
});

test("ponovni pregled 2: stopnja 9 točno v krajiščih, časovni rok, SymPy prevlada nad mrežo", async () => {
  const iq = (t, value) => verifyAi(t, { kind: "inequality", variable: "x", value }).status;
  assert.equal(iq("-54x^9 - 1134x^8 - 10224x^7 - 51640x^6 - 160210x^5 - 317194x^4 - 412696x^3 - 377280x^2 - 262656x - 110592 < 0", "(-4, -3) U (-8/3, oo)"), "verified");
  assert.equal(iq("-1458x^9 - 2187x^8 + 22113x^7 + 34074x^6 - 103302x^5 - 164457x^4 + 100683x^3 + 169722x^2 + 227556x + 370440 < 0", "(-5/2, -2) U [7/3, oo)"), "wrong");
  assert.equal(iq("(x - 7.5)^2*(x^9 - 3) <= 0", "(-oo, 1.1298]"), "wrong");
  // časovni rok točnega dokaza: stopnja 16 v manj kot sekundi
  const t0 = Date.now();
  iq(Array.from({ length: 16 }, (_, i) => `(1000x-${1000 + i})`).join("*") + " > 0", "(1.015, oo)");
  assert.ok(Date.now() - t0 < 1000, `${Date.now() - t0} ms`);
  // izid same mreže (ne zaokrožena krajišča) SymPy-jevega »napačno« ne povozi
  if (!(await casAvailable())) return;
  assert.equal((await verifyAiFull("sqrt(x) * (x - 2.5)^2 <= 0", { kind: "inequality", variable: "x", value: "{0.0}" })).status, "wrong");
  assert.equal((await verifyAiFull("x^2 - 2 < 0", { kind: "inequality", variable: "x", value: "(-1.41421356, 1.41421356)" })).status, "numeric");
});

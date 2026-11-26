// Deterministični prevod trditve v Lean (PV-13, docs/preverjanje.md »Prevod v Lean«). Brez AI: iz zapisa RACUN
// ([ukaz, argumenti], kot v server/cas/worker.py) nastane izrek Lean v eni vrstici in seznam predlog dokaza. Obseg:
// račun (value), identiteta (equal), enačba in sistem enačb (solve), neenačba (ineq) s polinomi, ulomki, absolutno
// vrednostjo in koreni konstant. Vse drugo vrne { ok: false, razlog } in ostane pri SymPy.
//
// Pravila prevoda (zakaj je prevod zvest):
//   - vsaka spremenljivka je realna (∀ x : ℝ), vsako število ima tip ℝ ((3 : ℝ)), zato ni naravnega deljenja ali
//     odštevanja; potenca je naravno število ali (-n : ℤ);
//   - vsak dvočlenski izraz je v oklepaju, zato prednost operatorjev ne more spremeniti pomena;
//   - Lean ima x/0 = 0 in √(-1) = 0, zato izrek nosi definicijsko območje: imenovalec ≠ 0, argument korena ≥ 0;
//   - enačba in neenačba sta ekvivalenca (↔) s celo množico rešitev: manjkajoča ali tuja rešitev izreka ne da;
//   - izrek se pred dokazovanjem prevede nazaj (lean-obratno.js) in primerja z izvirnikom (skladnost()).
import { razcleni, spremenljivke, zaprt, konstanta, obmocje, racionalna, racionalneNicle, P, Q, ZERO, ONE, vrednost, tocke, jeNic } from "./lean-izraz.js";

// ---------- izpis izraza v Lean ----------
export function vLean(e) {
  switch (e.t) {
    case "num":
      return `(${e.v.toString()} : ℝ)`;
    case "var":
      return e.n;
    case "neg":
      return `(-${vLean(e.a)})`;
    case "add":
      return `(${vLean(e.a)} + ${vLean(e.b)})`;
    case "sub":
      return `(${vLean(e.a)} - ${vLean(e.b)})`;
    case "mul":
      return `(${vLean(e.a)} * ${vLean(e.b)})`;
    case "div":
      return `(${vLean(e.a)} / ${vLean(e.b)})`;
    case "pow":
      return e.n >= 0 ? `(${vLean(e.a)} ^ ${e.n})` : `(${vLean(e.a)} ^ (${e.n} : ℤ))`;
    case "sqrt":
      return `(Real.sqrt ${vLean(e.a)})`;
    case "abs":
      return `|${vLean(e.a)}|`;
    default:
      throw new Error(`neznano vozlišče ${e.t}`);
  }
}
const qLean = (q) => `(${q.toString()} : ℝ)`;
const OP = { "=": "=", "≠": "≠", "<": "<", "≤": "≤" };
export const atomLean = (a) => `${vLean(a.a)} ${OP[a.op]} ${vLean(a.b)}`;
const konj = (atomi) => (atomi.length ? atomi.map(atomLean).join(" ∧ ") : "True");

/** Izrek (ena vrstica) iz oblike. */
export function izrekIzOblike(o) {
  const bind = o.spremenljivke.length ? `∀ ${o.spremenljivke.join(" ")} : ℝ, ` : "";
  if (o.vrsta === "racun") return atomLean(o.glavni[0]);
  if (o.vrsta === "identiteta") return bind + [...o.obmocje.map(atomLean), atomLean(o.glavni[0])].join(" → ");
  const levo = `(${konj([...o.obmocje, ...o.glavni])})`;
  const desno = o.resitve.length ? o.resitve.map((d) => `(${konj(d)})`).join(" ∨ ") : "False";
  return `${bind}${levo} ↔ (${desno})`;
}

// ---------- zapis RACUN → oblika ----------
const RELACIJE = [
  ["<=", "≤"],
  [">=", "≥"],
  ["≤", "≤"],
  ["≥", "≥"],
  ["!=", "≠"],
  ["≠", "≠"],
  ["<", "<"],
  [">", ">"],
  ["=", "="],
];
/** »a op b« → atom { op, a, b } z op ∈ = ≠ < ≤ (> in ≥ obrne strani) ali null. */
export function atom(besedilo) {
  const s = String(besedilo);
  for (const [z, op] of RELACIJE) {
    const i = s.indexOf(z);
    if (i < 0) continue;
    const l = s.slice(0, i);
    const d = s.slice(i + z.length);
    if (/[<>=≤≥≠!]/.test(d) || /[<>=≤≥≠!]/.test(l)) return null; // več relacij
    const a = razcleni(l);
    const b = razcleni(d);
    if (!a || !b) return null;
    if (op === ">") return { op: "<", a: b, b: a };
    if (op === "≥") return { op: "≤", a: b, b: a };
    return { op, a, b };
  }
  return null;
}

/** Razdeli niz po vejicah zunaj oklepajev. */
function poVejicah(s) {
  const out = [];
  let g = 0;
  let cur = "";
  for (const c of String(s)) {
    if ("([{".includes(c)) g++;
    if (")]}".includes(c)) g--;
    if (c === "," && g === 0) {
      out.push(cur);
      cur = "";
    } else cur += c;
  }
  out.push(cur);
  return out.map((x) => x.trim()).filter((x) => x !== "");
}

// Decimalno število (0.75) se prevede točno: zaokrožen odgovor (0.414 za 1 − √2) je v Leanu neresničen in ostane
// nedokazan, status mu da SymPy (numerično).
const PRAZNO = /^\s*(\{\s*\}|∅|none|ni|ni rešitve|no solution|empty|emptyset)\s*$/i;
const NESKONCNO = /^(\+?oo|\+?inf|\+?infty|∞|\+∞)$/;
const MINUS_NESKONCNO = /^(-oo|-inf|-infty|-∞)$/;

/** Zaprta konstanta (racionalno število ali s koreni konstant) ali null. Koren negativnega števila ni dovoljen. */
function zaprtIzraz(s) {
  const e = razcleni(String(s).trim());
  if (!e || !zaprt(e)) return null;
  return veljavnoObmocje(e, []) ? e : null;
}

/** Ali izraz vsebuje potenco z eksponentom 0 in osnovo, ki ni zanesljivo različna od 0. */
function nicelnaPotenca(e) {
  if (!e) return false;
  if (e.t === "pow" && e.n === 0) {
    if (!zaprt(e.a)) return true;
    const c = konstanta(e.a);
    const v = c ? null : vrednost(e.a, {});
    if (c ? c.isZero() : v == null || jeNic(v)) return true;
  }
  return nicelnaPotenca(e.a) || nicelnaPotenca(e.b);
}

/** Ali so imenovalci in koreni zaprtih delov izraza definirani; nezaprte doda v seznam pogojev. */
function veljavnoObmocje(e, pogoji) {
  if (nicelnaPotenca(e)) return false; // x⁰ in 0⁰ (v Leanu = 1, v šoli nedefinirano pri osnovi 0)
  const o = obmocje(e);
  for (const d of o.imenovalci) {
    if (zaprt(d)) {
      const c = konstanta(d);
      const v = c ? null : vrednost(d, {});
      if (c ? c.isZero() : v == null || jeNic(v)) return false; // npr. 1/√2: imenovalec je √2 ≠ 0
    } else pogoji.push({ op: "≠", a: d, b: { t: "num", v: ZERO } });
  }
  for (const k of o.koreni) {
    if (zaprt(k)) {
      const c = konstanta(k);
      if (!c || c.sign() < 0) return false; // koren iracionalnega izraza ali negativnega števila: zunaj obsega
    } else pogoji.push({ op: "≤", a: { t: "num", v: ZERO }, b: k });
  }
  return true;
}

/**
 * Ali je definicijsko območje neprazno: v vsaj 6 od 24 naključnih točk so vsi izrazi definirani. Prazno območje
 * (1/(1/R − 1/R)) bi dalo prazno resničen izrek (iz napačne predpostavke sledi vse), zato je zunaj obsega.
 */
function nepraznoObmocje(izrazi, vars) {
  let ok = 0;
  for (const t of tocke(vars, JSON.stringify(vars), 24)) if (izrazi.every((e) => vrednost(e, t) != null)) ok++;
  return ok >= 6;
}

function brezPodvojenih(atomi) {
  const seen = new Set();
  return atomi.filter((a) => {
    const k = atomLean(a);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function interval(s, x) {
  const m = /^\s*([([])\s*([^,]+?)\s*,\s*([^,]+?)\s*([)\]])\s*$/.exec(s);
  if (!m) return null;
  const out = [];
  const xv = { t: "var", n: x };
  if (!MINUS_NESKONCNO.test(m[2])) {
    if (NESKONCNO.test(m[2])) return null;
    const a = zaprtIzraz(m[2]);
    if (!a) return null;
    out.push({ op: m[1] === "[" ? "≤" : "<", a, b: xv });
  } else if (m[1] === "[") return null;
  if (!NESKONCNO.test(m[3])) {
    if (MINUS_NESKONCNO.test(m[3])) return null;
    const b = zaprtIzraz(m[3]);
    if (!b) return null;
    out.push({ op: m[4] === "]" ? "≤" : "<", a: xv, b });
  } else if (m[4] === "]") return null;
  if (!out.length) return null; // (-oo, oo): vsa realna števila, zunaj obsega
  return out;
}

/**
 * Oblika trditve iz zapisa RACUN ali { napaka }.
 * oblika: { vrsta: racun|identiteta|enacba|sistem|neenacba, spremenljivke, obmocje: [atom], glavni: [atom],
 *           resitve: [[atom]] (disjunkcija konjunkcij) }
 */
export function oblikaIzRacuna(racun) {
  if (!Array.isArray(racun) || racun.length !== 2 || !Array.isArray(racun[1])) return { napaka: "zapis ni [ukaz, argumenti]" };
  const [ukaz, args] = racun;
  if (args.some((a) => typeof a !== "string")) return { napaka: "argumenti niso nizi" };
  if (ukaz === "value") {
    if (args.length !== 2) return { napaka: "value: dva argumenta" };
    if (/≈|~/.test(args[1])) return { napaka: "približna vrednost" };
    const a = zaprtIzraz(args[0]);
    const b = zaprtIzraz(args[1]);
    if (!a || !b) return { napaka: "izraz zunaj obsega" };
    return { vrsta: "racun", spremenljivke: [], obmocje: [], glavni: [{ op: "=", a, b }], resitve: [] };
  }
  if (ukaz === "equal") {
    if (args.length !== 2) return { napaka: "equal: dva argumenta" };
    const a = razcleni(args[0]);
    const b = razcleni(args[1]);
    if (!a || !b) return { napaka: "izraz zunaj obsega" };
    const sp = [...spremenljivke(a), ...spremenljivke(b)];
    const vars = [...new Set(sp)].sort();
    const pogoji = [];
    if (!veljavnoObmocje(a, pogoji) || !veljavnoObmocje(b, pogoji)) return { napaka: "nedefiniran izraz" };
    // koren izraza s spremenljivko: območje je lahko ena sama točka (√x = √(-x)), zato zunaj obsega
    if (pogoji.some((p) => p.op === "≤")) return { napaka: "koren izraza s spremenljivko v identiteti" };
    if (!vars.length) return { vrsta: "racun", spremenljivke: [], obmocje: [], glavni: [{ op: "=", a, b }], resitve: [] };
    if (!nepraznoObmocje([a, b], vars)) return { napaka: "prazno definicijsko območje" };
    return { vrsta: "identiteta", spremenljivke: vars, obmocje: brezPodvojenih(pogoji), glavni: [{ op: "=", a, b }], resitve: [] };
  }
  if (ukaz === "solve" || ukaz === "ineq") {
    if (args.length !== 3) return { napaka: `${ukaz}: trije argumenti` };
    const vars = poVejicah(args[1]);
    if (!vars.length || vars.some((v) => !/^[a-zA-Z]$/.test(v) || "eEiI".includes(v)) || new Set(vars).size !== vars.length) return { napaka: "neznane spremenljivke" };
    const enacbe = ukaz === "solve" ? poVejicah(args[0]) : [args[0]];
    const glavni = enacbe.map(atom);
    if (glavni.some((g) => !g)) return { napaka: "relacija zunaj obsega" };
    if (ukaz === "solve" && glavni.some((g) => g.op !== "=")) return { napaka: "solve brez enačaja" };
    if (ukaz === "ineq" && (glavni.length !== 1 || !["<", "≤"].includes(glavni[0].op))) return { napaka: "neenačba brez < ali ≤" };
    const vSp = new Set();
    for (const g of glavni) for (const s of [...spremenljivke(g.a), ...spremenljivke(g.b)]) vSp.add(s);
    if ([...vSp].some((s) => !vars.includes(s))) return { napaka: "spremenljivka, ki ni navedena" };
    const pogoji = [];
    for (const g of glavni) if (!veljavnoObmocje(g.a, pogoji) || !veljavnoObmocje(g.b, pogoji)) return { napaka: "nedefiniran izraz" };
    const trditev = String(args[2]).trim();
    if (/≈|~|\bk\b|\ball\b|\bvsa\b|^R$|ℝ/.test(trditev)) return { napaka: "trditev zunaj obsega (približek, parameter ali vsa števila)" };
    let resitve;
    if (PRAZNO.test(trditev)) resitve = [];
    else if (ukaz === "ineq") {
      if (vars.length !== 1) return { napaka: "neenačba z več spremenljivkami" };
      resitve = [];
      for (const del of trditev.replace(/∪/g, " U ").split(/\s+(?:U|or|ali)\s+/)) {
        const iv = interval(del, vars[0]);
        if (!iv) return { napaka: "interval zunaj obsega" };
        resitve.push(iv);
      }
    } else if (vars.length === 1) {
      resitve = [];
      const xv = { t: "var", n: vars[0] };
      for (let del of poVejicah(trditev)) {
        del = del.replace(new RegExp(`^${vars[0]}\\s*=`), "");
        const v = zaprtIzraz(del);
        if (!v) return { napaka: "rešitev zunaj obsega" };
        resitve.push([{ op: "=", a: xv, b: v }]);
      }
    } else {
      const vred = {};
      for (const del of poVejicah(trditev)) {
        const m = /^([a-zA-Z])\s*=\s*(.+)$/.exec(del);
        if (!m || !vars.includes(m[1]) || vred[m[1]]) return { napaka: "rešitev sistema zunaj obsega" };
        const v = zaprtIzraz(m[2]);
        if (!v) return { napaka: "rešitev sistema zunaj obsega" };
        vred[m[1]] = v;
      }
      if (vars.some((v) => !vred[v])) return { napaka: "rešitev sistema brez vseh spremenljivk" };
      resitve = [vars.map((v) => ({ op: "=", a: { t: "var", n: v }, b: vred[v] }))];
    }
    const vrsta = ukaz === "ineq" ? "neenacba" : vars.length > 1 ? "sistem" : "enacba";
    return { vrsta, spremenljivke: vars, obmocje: brezPodvojenih(pogoji), glavni, resitve };
  }
  return { napaka: `ukaz ${ukaz} ni v obsegu prevoda` };
}

// ---------- predloge dokazov ----------
const sub = (a, b) => ({ t: "sub", a, b });
const num = (q) => ({ t: "num", v: q });
const vr = (n) => ({ t: "var", n });

/** Polinom (koeficienti Q) v spremenljivki x kot izraz Lean. */
function polinomLean(p, x) {
  p = P.norm(p);
  if (!p.length) return qLean(ZERO);
  const cleni = [];
  for (let i = p.length - 1; i >= 0; i--) {
    if (p[i].isZero()) continue;
    cleni.push(i === 0 ? qLean(p[i]) : i === 1 ? `(${qLean(p[i])} * ${x})` : `(${qLean(p[i])} * (${x} ^ ${i}))`);
  }
  return cleni.reduce((a, b) => `(${a} + ${b})`);
}

/** Zaprt izraz kot p + q·√r (r squarefree celo število > 1) ali racionalno število; sicer null. */
export function kvadratnaOblika(e) {
  let r = null;
  const sq = (n) => {
    // √(n) za racionalen n ≥ 0: k·√m z m squarefree
    if (n.sign() < 0) throw 0;
    const z = n.n * n.d; // √(a/b) = √(ab)/b
    if (z > 10n ** 12n) throw 0;
    let k = 1n;
    let m = z;
    for (let i = 2n; i * i <= m; i++) while (m % (i * i) === 0n) (m /= i * i), (k *= i);
    return { k: new Q(k, n.d), m };
  };
  const ev = (x) => {
    switch (x.t) {
      case "num":
        return [x.v, ZERO];
      case "neg": {
        const [a, b] = ev(x.a);
        return [a.neg(), b.neg()];
      }
      case "add":
      case "sub": {
        const [a, b] = ev(x.a);
        const [c, d] = ev(x.b);
        return x.t === "add" ? [a.add(c), b.add(d)] : [a.sub(c), b.sub(d)];
      }
      case "mul": {
        const [a, b] = ev(x.a);
        const [c, d] = ev(x.b);
        const rr = r == null ? ZERO : new Q(r);
        return [a.mul(c).add(b.mul(d).mul(rr)), a.mul(d).add(b.mul(c))];
      }
      case "div": {
        const [a, b] = ev(x.a);
        const [c, d] = ev(x.b);
        const rr = r == null ? ZERO : new Q(r);
        const n = c.mul(c).sub(d.mul(d).mul(rr));
        if (n.isZero()) throw 0;
        // (a + b√r)(c - d√r) / (c² - d²r)
        return [a.mul(c).sub(b.mul(d).mul(rr)).div(n), b.mul(c).sub(a.mul(d)).div(n)];
      }
      case "pow": {
        if (x.n < 0) return ev({ t: "div", a: num(ONE), b: { t: "pow", a: x.a, n: -x.n } });
        let acc = [ONE, ZERO];
        const base = ev(x.a);
        const rr = r == null ? ZERO : new Q(r);
        for (let i = 0; i < x.n; i++) acc = [acc[0].mul(base[0]).add(acc[1].mul(base[1]).mul(rr)), acc[0].mul(base[1]).add(acc[1].mul(base[0]))];
        return acc;
      }
      case "sqrt": {
        const [a, b] = ev(x.a);
        if (!b.isZero()) throw 0;
        const { k, m } = sq(a);
        if (m === 1n) return [k, ZERO];
        if (r != null && r !== m) throw 0;
        r = m;
        return [ZERO, k];
      }
      default:
        throw 0;
    }
  };
  try {
    const [p, q] = ev(e);
    return { p, q, r: q.isZero() ? null : r };
  } catch {
    return null;
  }
}

/** Izbira disjunkta j od k (desno asociativna disjunkcija) s členom t. */
function izbira(j, k, t) {
  let s = t;
  if (j < k - 1) s = `Or.inl ${par(s)}`;
  for (let i = 0; i < j; i++) s = `Or.inr ${par(s)}`;
  return s;
}
const par = (s) => (/^[\w.]+$/.test(s) ? s : `(${s})`);
const vzorecLevo = (m) => (m <= 1 ? "hE" : `${m === 2 ? "hE" : `(${vzorecLevo(m - 1)})`} | hE`);

/** Dokazi za enačbo v eni spremenljivki (polinom ali ulomki). */
function dokaziEnacbe(o) {
  const x = o.spremenljivke[0];
  const g = o.glavni[0];
  const f = racionalna(sub(g.a, g.b), x);
  if (!f) return [];
  const N = P.norm(f.num);
  if (N.length > 9) return [];
  const imaObmocje = o.obmocje.length > 0;
  const hd = o.obmocje.map((_, i) => `hd${i}`);
  // trditev: vrednosti
  const vrednosti = o.resitve.map((d) => kvadratnaOblika(d[0].b));
  if (vrednosti.some((v) => !v)) return [];
  // izključene točke: racionalne ničle imenovalcev
  const izkljucene = [];
  o.obmocje.forEach((p, i) => {
    const rf = racionalna(p.a, x);
    if (!rf) return;
    for (const r of racionalneNicle(rf.num)) izkljucene.push({ r, i });
  });
  // razcep N
  let ostanek = N;
  const faktorji = [];
  const deli = (f, lean, info) => {
    while (P.deg(ostanek) >= P.deg(f)) {
      const { q, r } = P.divmod(ostanek, f);
      if (P.norm(r).length) break;
      ostanek = q;
      faktorji.push({ lean, ...info });
    }
  };
  const racionalne = vrednosti.map((v, j) => ({ v, j })).filter((e) => e.v.r == null);
  for (const { v, j } of racionalne) deli([v.p.neg(), ONE], `(${x} - ${qLean(v.p)})`, { vrsta: "res", j });
  for (const { r, i } of izkljucene) deli([r.neg(), ONE], `(${x} - ${qLean(r)})`, { vrsta: "izk", i, r });
  const surde = vrednosti.map((v, j) => ({ v, j })).filter((e) => e.v.r != null);
  const porabljene = new Set();
  for (const a of surde) {
    if (porabljene.has(a.j)) continue;
    const b = surde.find((e) => e.j !== a.j && !porabljene.has(e.j) && e.v.r === a.v.r && e.v.p.eq(a.v.p) && e.v.q.eq(a.v.q.neg()));
    if (!b) return []; // brez konjugirane rešitve trditev ne more držati
    porabljene.add(a.j).add(b.j);
    const c = a.v.q.mul(a.v.q).mul(new Q(a.v.r)); // q²r
    const kv = [a.v.p.mul(a.v.p).sub(c), a.v.p.mul(new Q(-2n)), ONE];
    const plus = a.v.q.sign() > 0 ? a : b;
    const minus = plus === a ? b : a;
    deli(kv, `(((${x} - ${qLean(a.v.p)}) ^ 2) - ${qLean(c)})`, { vrsta: "kv", p: a.v.p, q: plus.v.q, r: a.v.r, jp: plus.j, jm: minus.j });
  }
  ostanek = P.norm(ostanek);
  let hq = null;
  let koef = ONE;
  if (P.deg(ostanek) === 0) koef = ONE.div(ostanek[0]);
  else if (P.deg(ostanek) === 2) {
    const [c0, c1, c2] = ostanek;
    if (c1.mul(c1).sub(c0.mul(c2).mul(new Q(4n))).sign() >= 0) return [];
    const m = c1.div(c2.mul(new Q(2n)));
    hq = `have hq : ${polinomLean(ostanek, x)} ≠ 0 := by intro h0; nlinarith [sq_nonneg (${x} + ${qLean(m)})]`;
    faktorji.push({ lean: polinomLean(ostanek, x), vrsta: "q" });
  } else if (P.deg(ostanek) < 0) return [];
  else return [];
  const k = o.resitve.length;
  const L = [];
  L.push(`intro ${x}`, "constructor");
  L.push(imaObmocje ? `· rintro ⟨${[...hd, "hE"].join(", ")}⟩` : "· intro hE");
  const hN = imaObmocje ? `have hN : ${polinomLean(N, x)} = 0 := by field_simp at hE; linarith` : `have hN : ${polinomLean(N, x)} = 0 := by linear_combination hE`;
  L.push(`  ${hN}`);
  if (hq) L.push(`  ${hq}`);
  const zapri = (fa) => {
    if (fa.vrsta === "res") return [`exact ${izbira(fa.j, k, "by linarith")}`];
    if (fa.vrsta === "izk") return [`exact (${hd[fa.i]} (by rw [show ${x} = ${qLean(fa.r)} by linarith]; norm_num)).elim`];
    if (fa.vrsta === "q") return ["exact (hq hE).elim"];
    // kvadratni faktor: (x - p)² = (q√r)²
    return [
      `have h2 : (${x} - ${qLean(fa.p)}) ^ 2 = (${qLean(fa.q)} * Real.sqrt ${qLean(new Q(fa.r))}) ^ 2 := by rw [mul_pow, Real.sq_sqrt (by norm_num)]; linarith`,
      "rcases sq_eq_sq_iff_eq_or_eq_neg.mp h2 with h3 | h3",
      `· exact ${izbira(fa.jp, k, "by linarith")}`,
      `· exact ${izbira(fa.jm, k, "by linarith")}`,
    ];
  };
  if (!faktorji.length) {
    if (k) return [];
    L.push("  norm_num at hN");
  } else {
    L.push(`  have hF : ${faktorji.map((f) => f.lean).join(" * ")} = 0 := by linear_combination ${qLean(koef)} * hN`);
    if (faktorji.length === 1) {
      L.push("  have hE := hF");
      for (const v of zapri(faktorji[0])) L.push(`  ${v}`);
    } else {
      L.push("  simp only [mul_eq_zero] at hF", `  rcases hF with ${vzorecLevo(faktorji.length)}`);
      for (const fa of faktorji) {
        const z = zapri(fa);
        L.push(`  · ${z[0]}`, ...z.slice(1).map((v) => `    ${v}`));
      }
    }
  }
  // obratna smer
  if (!k) L.push("· intro hE; exact hE.elim");
  else {
    L.push(k === 1 ? "· intro hE" : `· rintro (${Array(k).fill("hE").join(" | ")})`);
    for (let j = 0; j < k; j++) {
      const v = vrednosti[j];
      const pre = k === 1 ? "  " : "  · ";
      if (v.r == null) L.push(`${pre}subst hE; norm_num`);
      else {
        if (imaObmocje || P.deg(f.den) > 0) return [];
        const G = kolicnikKorena(N, v);
        if (!G) return [];
        L.push(`${pre}subst hE; linear_combination (${G}) * Real.sq_sqrt (show (0 : ℝ) ≤ ${qLean(new Q(v.r))} by norm_num)`);
      }
    }
  }
  return [L.join("\n")];
}

/** G(√r) iz N(p + q·s) = G(s)·(s² − r) (s = √r); null, če vrednost ni ničla. */
function kolicnikKorena(N, v) {
  const xs = [v.p, v.q]; // x = p + q s kot polinom v s
  let A = [];
  let pot = [ONE];
  for (let i = 0; i < N.length; i++) {
    A = P.add(A, P.scale(pot, N[i]));
    pot = P.mul(pot, xs);
  }
  const { q, r } = P.divmod(A, [new Q(-v.r), ZERO, ONE]);
  if (P.norm(r).length) return null;
  return polinomLean(q, `Real.sqrt ${qLean(new Q(v.r))}`);
}

/**
 * Enačba √A = B (ali B = √A) s polinomoma A, B: √A = B ⟺ A = B² ∧ B ≥ 0. Ničle A − B², ki jih trditev nima, morajo
 * imeti B < 0 (tuje rešitve kvadriranja). Vrne null, če enačba ni te oblike.
 */
function korenEnacbe(o) {
  const x = o.spremenljivke[0];
  const g = o.glavni[0];
  let A;
  let B;
  if (g.a.t === "sqrt" && !absolutne(g.b).length) (A = g.a.a), (B = g.b);
  else if (g.b.t === "sqrt" && !absolutne(g.a).length) (A = g.b.a), (B = g.a);
  else return null;
  if (o.obmocje.length !== 1 || obmocje(B).koreni.length || obmocje(B).imenovalci.length || obmocje(A).koreni.length || obmocje(A).imenovalci.length) return [];
  const fa = racionalna(A, x);
  const fb = racionalna(B, x);
  if (!fa || !fb) return [];
  const N = P.norm(P.sub(fa.num, P.mul(fb.num, fb.num))); // A − B²
  if (!N.length || N.length > 5) return [];
  const vrednosti = o.resitve.map((d) => konstanta(d[0].b));
  if (vrednosti.some((v) => !v)) return [];
  let ostanek = N;
  const faktorji = [];
  const deli = (r, info) => {
    while (P.deg(ostanek) >= 1 && P.val(ostanek, r).isZero()) {
      ostanek = P.divmod(ostanek, [r.neg(), ONE]).q;
      faktorji.push({ r, ...info });
    }
  };
  vrednosti.forEach((v, j) => deli(v, { j }));
  for (const r of racionalneNicle(N)) deli(r, { tuja: true });
  ostanek = P.norm(ostanek);
  if (P.deg(ostanek) !== 0 || !faktorji.length) return [];
  const k = o.resitve.length;
  const L = [`intro ${x}`, "constructor", "· rintro ⟨hd0, hE⟩"];
  L.push(`  have hB : (0 : ℝ) ≤ ${vLean(B)} := by first | (norm_num; done) | (rw [← hE]; exact Real.sqrt_nonneg _)`);
  L.push("  have h2 := Real.sq_sqrt hd0", "  rw [hE] at h2");
  L.push(`  have hF : ${faktorji.map((f) => `(${x} - ${qLean(f.r)})`).join(" * ")} = 0 := by linear_combination ${qLean(ONE.div(ostanek[0]).neg())} * h2`);
  const zapri = (f) => (f.tuja ? `exact absurd hB (by rw [show ${x} = ${qLean(f.r)} by linarith]; norm_num)` : `exact ${izbira(f.j, k, "by linarith")}`);
  if (faktorji.length === 1) L.push("  have hE := hF", `  ${zapri(faktorji[0])}`);
  else {
    L.push("  simp only [mul_eq_zero] at hF", `  rcases hF with ${vzorecLevo(faktorji.length)}`);
    for (const f of faktorji) L.push(`  · ${zapri(f)}`);
  }
  if (!k) L.push("· intro hE; exact hE.elim");
  else {
    L.push(k === 1 ? "· intro hE" : `· rintro (${Array(k).fill("hE").join(" | ")})`);
    const v = "subst hE; refine ⟨by norm_num, ?_⟩; rw [Real.sqrt_eq_iff_mul_self_eq (by norm_num) (by norm_num)]; norm_num";
    for (let j = 0; j < k; j++) L.push(`${k === 1 ? "  " : "  · "}${v}`);
  }
  return [L.join("\n")];
}

/** Absolutne vrednosti v izrazu (argumenti), brez podvojenih. */
function absolutne(e, out = []) {
  if (!e) return out;
  if (e.a) absolutne(e.a, out);
  if (e.b) absolutne(e.b, out);
  if (e.t === "abs" && !zaprt(e.a) && !out.some((a) => vLean(a) === vLean(e.a))) out.push(e.a);
  return out;
}

/** Zaključek veje: cilj je disjunkcija konjunkcij (rešitve) ali False. */
function zakljucekVeje(o, taktika) {
  const k = o.resitve.length;
  const moznosti = ["(exfalso; linarith)"];
  o.resitve.forEach((d, j) => {
    const t = d.length === 1 ? `by ${taktika}` : `⟨${d.map(() => `by ${taktika}`).join(", ")}⟩`;
    moznosti.push(`exact ${izbira(j, k, t)}`);
  });
  if (taktika !== "linarith") moznosti[0] = `(exfalso; ${taktika})`;
  return `first | ${moznosti.join(" | ")}`;
}
const vzorecDesno = (o) => (o.resitve.length ? o.resitve.map((d) => (d.length === 1 ? "h1" : `⟨${d.map((_, i) => `h${i + 1}`).join(", ")}⟩`)).join(" | ") : null);

/** Dokazi za enačbo ali neenačbo z absolutno vrednostjo (linearni deli): razdelitev na primere. */
function dokaziAbs(o) {
  if (o.obmocje.length) return [];
  const x = o.spremenljivke[0];
  const g = o.glavni[0];
  const abs = absolutne({ t: "sub", a: g.a, b: g.b });
  if (!abs.length || abs.length > 3) return [];
  const deli = abs.map((a, i) => `rcases abs_cases ${vLean(a)} with ⟨ha${i}, hb${i}⟩ | ⟨ha${i}, hb${i}⟩`).join(" <;> ");
  const rw = `rw [${abs.map((_, i) => `ha${i}`).join(", ")}]`;
  const L = [`intro ${x}`, "constructor", "· intro hE", `  ${deli} <;> ${rw} at hE <;> ${zakljucekVeje(o, "linarith")}`];
  if (!o.resitve.length) L.push("· intro hE; exact hE.elim");
  else if (o.vrsta === "enacba") L.push(o.resitve.length === 1 ? "· intro h1; subst h1; norm_num" : `· rintro (${vzorecDesno(o)}) <;> subst h1 <;> norm_num`);
  else L.push(`· rintro (${vzorecDesno(o)}) <;> ${deli} <;> ${rw} <;> linarith`);
  return [L.join("\n")];
}

/** Dokazi za neenačbo s polinomi (brez ulomkov) ali z enim ulomkom »a/b op 0«. */
function dokaziNeenacbe(o) {
  const x = o.spremenljivke[0];
  const g = o.glavni[0];
  const out = [];
  const k = o.resitve.length;
  if (!o.obmocje.length) {
    const f = racionalna(sub(g.a, g.b), x);
    if (!f || P.deg(f.den) > 0 || P.deg(f.num) > 4) return [];
    const N = P.norm(f.num);
    const nicle = racionalneNicle(N);
    const namigi = [...nicle.map((r) => `sq_nonneg (${x} - ${qLean(r)})`), ...(P.deg(N) === 2 ? [`sq_nonneg (${x} + ${qLean(N[1].div(N[2].mul(new Q(2n))))})`] : [])];
    const nl = `nlinarith [${namigi.join(", ") || `sq_nonneg ${x}`}]`;
    let naprej;
    if (!k) naprej = `  ${nl}`;
    else if (k === 1 && o.resitve[0].length === 2) naprej = `  exact ⟨by ${nl}, by ${nl}⟩`;
    else if (k === 1) naprej = `  ${nl}`;
    else if (o.resitve.every((d) => d.length === 1)) naprej = `  by_contra hc; push Not at hc; nlinarith [hc.1, hc.2, ${namigi.join(", ") || `sq_nonneg ${x}`}]`;
    else return [];
    const nazaj = k ? `· rintro (${vzorecDesno(o)}) <;> nlinarith [${namigi.join(", ") || `sq_nonneg ${x}`}]` : "· intro hE; exact hE.elim";
    out.push([`intro ${x}`, "constructor", "· intro hE", naprej, nazaj].join("\n"));
    return out;
  }
  // en ulomek: (a / b) op 0 ali 0 op (a / b)
  if (o.obmocje.length !== 1) return [];
  const nic = (e) => e.t === "num" && e.v.isZero();
  let lema;
  if (g.a.t === "div" && nic(g.b)) lema = g.op === "<" ? "div_neg_iff" : "div_nonpos_iff";
  else if (g.b.t === "div" && nic(g.a)) lema = g.op === "<" ? "div_pos_iff" : "div_nonneg_iff";
  else return [];
  const L = [
    `intro ${x}`,
    "constructor",
    "· rintro ⟨hd0, hE⟩",
    `  rw [${lema}] at hE`,
    `  rcases lt_or_gt_of_ne hd0 with hs | hs <;> rcases hE with ⟨h1, h2⟩ | ⟨h1, h2⟩ <;> ${zakljucekVeje(o, "linarith")}`,
  ];
  if (!k) L.push("· intro hE; exact hE.elim");
  else
    L.push(
      `· rintro (${vzorecDesno(o)})`,
      `  all_goals refine ⟨by intro hc; linarith, ?_⟩`,
      `  all_goals rw [${lema}]`,
      `  all_goals first | exact Or.inl ⟨by linarith, by linarith⟩ | exact Or.inr ⟨by linarith, by linarith⟩`,
    );
  out.push(L.join("\n"));
  return out;
}

/** Prepisi korenov konstant: √180 = 6·√5 (za račun in identitete). */
function prepisiKorenov(o) {
  const koreni = [];
  const zberi = (e) => {
    if (!e) return;
    if (e.a) zberi(e.a);
    if (e.b) zberi(e.b);
    if (e.t === "sqrt" && zaprt(e.a)) koreni.push(e.a);
  };
  for (const a of [...o.glavni, ...o.obmocje]) zberi(a.a), zberi(a.b);
  const rw = [];
  const r = new Set();
  for (const a of koreni) {
    const c = konstanta(a);
    if (!c || !c.isInt() || c.sign() < 0) continue;
    let k = 1n;
    let m = c.n;
    for (let i = 2n; i * i <= m && i < 10n ** 6n; i++) while (m % (i * i) === 0n) (m /= i * i), (k *= i);
    if (m !== 1n) r.add(m);
    if (k === 1n) continue;
    const lean = `(Real.sqrt ${vLean(a)})`;
    if (m === 1n) rw.push(`rw [show ${lean} = (${k} : ℝ) by rw [show ${vLean(a)} = (${k} : ℝ) ^ 2 by norm_num]; exact Real.sqrt_sq (by norm_num)]`);
    else
      rw.push(
        `rw [show ${lean} = (${k} : ℝ) * Real.sqrt (${m} : ℝ) by rw [show ${vLean(a)} = (${k} : ℝ) ^ 2 * (${m} : ℝ) by norm_num, Real.sqrt_mul (by norm_num), Real.sqrt_sq (by norm_num)]]`,
      );
  }
  const hs = [...r].map((m) => `Real.sq_sqrt (show (0 : ℝ) ≤ (${m} : ℝ) by norm_num), Real.sqrt_nonneg (${m} : ℝ)`);
  return { rw, hs };
}

function dokaziRacuna(o) {
  const { rw, hs } = prepisiKorenov(o);
  const out = ["norm_num"];
  // vsaka možnost mora cilj zapreti (»done«), sicer »first« obstane pri delnem napredku
  const nl = hs.length ? ` | (field_simp; nlinarith [${hs.join(", ")}]) | (rw [div_eq_div_iff (by positivity) (by positivity)]; nlinarith [${hs.join(", ")}])` : "";
  const konec = `all_goals first | (field_simp; done) | ring | (norm_num; done) | (field_simp; ring)${nl}`;
  if (rw.length || hs.length) out.push([...rw, konec].join("\n"));
  return out;
}

function dokaziIdentitete(o) {
  const imena = [...o.spremenljivke, ...o.obmocje.map((_, i) => `hd${i}`)];
  const { rw, hs } = prepisiKorenov(o);
  const uvod = `intro ${imena.join(" ")}`;
  const out = [`${uvod}\nring`, `${uvod}\nfield_simp`, `${uvod}\nfield_simp\nring`];
  if (rw.length || hs.length) out.push([uvod, ...rw, `all_goals first | ring | (field_simp; done) | (field_simp; ring)${hs.length ? ` | (field_simp; nlinarith [${hs.join(", ")}])` : ""}`].join("\n"));
  return out;
}

function dokaziSistema(o) {
  const n = o.glavni.length;
  const vzorec = `⟨${Array.from({ length: n }, (_, i) => `h${i + 1}`).join(", ")}⟩`;
  const L = [`intro ${o.spremenljivke.join(" ")}`, "constructor", `· rintro ${vzorec}`];
  if (!o.resitve.length) L.push("  linarith", "· intro hE; exact hE.elim");
  else {
    const m = o.resitve[0].length;
    L.push(`  exact ⟨${Array(m).fill("by linarith").join(", ")}⟩`);
    L.push(`· rintro ⟨${Array.from({ length: m }, (_, i) => `e${i + 1}`).join(", ")}⟩`, "  subst_vars", "  norm_num");
  }
  return [L.join("\n")];
}

/** Predloge dokaza za obliko: seznam taktik (vsaka je celoten dokaz »by …«). Prva, ki uspe, zmaga. */
export function predlogeDokaza(o) {
  if (o.vrsta === "racun") return dokaziRacuna(o);
  if (o.vrsta === "identiteta") return dokaziIdentitete(o);
  if (o.vrsta === "sistem") return dokaziSistema(o);
  const g = o.glavni[0];
  if (absolutne(sub(g.a, g.b)).length) return dokaziAbs(o);
  if (o.vrsta === "enacba") return korenEnacbe(o) || dokaziEnacbe(o);
  if (o.vrsta === "neenacba") return dokaziNeenacbe(o);
  return [];
}

/**
 * Prevod zapisa RACUN v Lean: { ok: true, vrsta, izrek, oblika, dokazi } ali { ok: false, razlog }.
 * izrek je ena vrstica (samo trditev, brez »:=« in »by«); dokazi so predloge taktik.
 */
export function prevedi(racun) {
  const o = oblikaIzRacuna(racun);
  if (o.napaka) return { ok: false, razlog: o.napaka };
  return { ok: true, vrsta: o.vrsta, izrek: izrekIzOblike(o), oblika: o, dokazi: predlogeDokaza(o) };
}

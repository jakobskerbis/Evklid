// Obratni prevod izreka Lean v zapis in primerjava z izvirno trditvijo (PV-13, docs/preverjanje.md »Prevod v Lean«).
// Lean dokaže samo to, kar je zapisano: napačen prevod (manjkajoča rešitev, naravna števila namesto realnih, → namesto
// ↔, dodaten pogoj …) je dokaz druge trditve. Zato se vsak izrek, tudi tisti, ki ga je napisal model AI (L6), pred
// štetjem dokaza prebere nazaj in primerja z izvirnikom. Branje je beli seznam: vse, česar ne pozna, je »neskladno«.
//
// Sprejeti izreki (Lean 4, Mathlib):
//   račun:       A = B                                  (vsaj ena stran z (… : ℝ))
//   identiteta:  ∀ x y : ℝ, P₁ → P₂ → A = B              (Pᵢ pogoji območja)
//   enačba …:    ∀ x : ℝ, (P₁ ∧ … ∧ A = B) ↔ (x = a ∨ x = b)  ali  … ↔ False  ali  ¬ (…)
//   neenačba:    ∀ x : ℝ, (… ∧ A < B) ↔ ((a < x ∧ x ≤ b) ∨ x < c)
// Pomen se primerja točno (lean-algebra.js: racionalne funkcije s koeficienti v Q(√…)), ne z besedilom in ne z
// vzorčenjem; kjer točen zapis ni mogoč (koren ali |…| s spremenljivko), mora biti zapis enak. Ker je v Leanu x/0 = 0
// in √(−1) = 0, mora vsak imenovalec in vsak koren s spremenljivko v izreku varovati pogoj (pokritost).
import { Q, qIzDecimalnega, spremenljivke, obmocje, velikost } from "./lean-izraz.js";
import { racFunkcija, jeNicelna, enakiFunkciji, konstantna, sorazmerni, kanon, zaprtPredznak } from "./lean-algebra.js";
import { oblikaIzRacuna } from "./lean-prevod.js";

const NAJVEC_ZNAKOV = 4000;

// ---------- leksikon ----------
const SIMBOLI = ["↔", "→", "∧", "∨", "¬", "∀", "=", "≠", "≤", "≥", "<", ">", "+", "-", "*", "/", "^", "(", ")", "|", ",", ":", "√", "ℝ", "ℤ", "ℕ"];
function leksikon(s) {
  const out = [];
  const z = [...s];
  let i = 0;
  while (i < z.length) {
    const c = z[i];
    if (c === " ") {
      i++;
      continue;
    }
    if (/[0-9]/.test(c)) {
      let j = i;
      while (j < z.length && /[0-9]/.test(z[j])) j++;
      if (z[j] === "." && /[0-9]/.test(z[j + 1] || "")) {
        j++;
        while (j < z.length && /[0-9]/.test(z[j])) j++;
      }
      out.push({ k: "num", v: z.slice(i, j).join("") });
      i = j;
      continue;
    }
    if (/[A-Za-z_]/.test(c)) {
      let j = i;
      while (j < z.length && /[A-Za-z0-9_.']/.test(z[j])) j++;
      out.push({ k: "id", v: z.slice(i, j).join("") });
      i = j;
      continue;
    }
    if (c === "-" && z[i + 1] === ">") {
      out.push({ k: "s", v: "→" });
      i += 2;
      continue;
    }
    if (c === "<" && z[i + 1] === "-" && z[i + 2] === ">") {
      out.push({ k: "s", v: "↔" });
      i += 3;
      continue;
    }
    if (c === "<" && z[i + 1] === "=") {
      out.push({ k: "s", v: "≤" });
      i += 2;
      continue;
    }
    if (c === ">" && z[i + 1] === "=") {
      out.push({ k: "s", v: "≥" });
      i += 2;
      continue;
    }
    if (c === "!" && z[i + 1] === "=") {
      out.push({ k: "s", v: "≠" });
      i += 2;
      continue;
    }
    if (SIMBOLI.includes(c)) {
      out.push({ k: "s", v: c });
      i++;
      continue;
    }
    throw new Error(`znak »${c}« ni dovoljen`);
  }
  return out;
}

const NAJVEC_EKSPONENT = 64;
function omejen(n) {
  if (!Number.isSafeInteger(n) || Math.abs(n) > NAJVEC_EKSPONENT) throw new Error("prevelik eksponent");
  return n;
}
const REL = new Set(["=", "≠", "≤", "≥", "<", ">"]);
const ARIT = new Set(["+", "-", "*", "/", "^"]);

/**
 * Razčlenjevalnik podmnožice Lean. Prednost kot v Leanu: ↔ (20, ne asociativen) < → (25, desno) < ∨ (30, desno) <
 * ∧ (35, desno) < ¬ (40) < relacije (50) < + − (65) < * / (70) < − predpona (75) < ^ (75, desno).
 */
function razcleniLean(s, imena) {
  const t = leksikon(s);
  let p = 0;
  const peek = (o = 0) => t[p + o];
  const je = (v, o = 0) => peek(o) && peek(o).k === "s" && peek(o).v === v;
  const jeId = (v) => peek() && peek().k === "id" && peek().v === v;
  const vzemi = (v) => {
    if (!je(v)) throw new Error(`pričakovan »${v}«`);
    p++;
  };
  const vezane = new Set();

  function izrek() {
    const sp = [];
    while (je("∀")) {
      p++;
      const skupine = [];
      if (je("(")) {
        // ∀ (x y : ℝ), …
        while (je("(")) {
          p++;
          const im = [];
          while (peek() && peek().k === "id") im.push(t[p++].v);
          vzemi(":");
          vzemi("ℝ");
          vzemi(")");
          skupine.push(...im);
        }
      } else {
        while (peek() && peek().k === "id") skupine.push(t[p++].v);
        vzemi(":");
        vzemi("ℝ");
      }
      vzemi(",");
      if (!skupine.length) throw new Error("∀ brez spremenljivke");
      for (const v of skupine) {
        if (!/^[A-Za-z]$/.test(v) || "eEiI".includes(v)) throw new Error(`ime spremenljivke »${v}« ni dovoljeno`);
        if (vezane.has(v)) throw new Error("spremenljivka dvakrat vezana");
        vezane.add(v);
        sp.push(v);
      }
    }
    const f = formula();
    if (p !== t.length) throw new Error("ostanek za izrekom");
    return { spremenljivke: sp, f };
  }

  // formule
  function formula() {
    const a = implikacija();
    if (je("↔")) {
      p++;
      const b = implikacija();
      if (je("↔")) throw new Error("↔ ni asociativen");
      return { f: "iff", a, b };
    }
    return a;
  }
  function implikacija() {
    const a = disj();
    if (je("→")) {
      p++;
      return { f: "imp", a, b: implikacija() };
    }
    return a;
  }
  function disj() {
    const a = konj();
    if (je("∨")) {
      p++;
      return { f: "or", a, b: disj() };
    }
    return a;
  }
  function konj() {
    const a = ne();
    if (je("∧")) {
      p++;
      return { f: "and", a, b: konj() };
    }
    return a;
  }
  function ne() {
    if (je("¬")) {
      p++;
      return { f: "not", a: ne() };
    }
    return osnovna();
  }
  function osnovna() {
    if (jeId("False")) {
      p++;
      return { f: "false" };
    }
    if (jeId("True")) {
      p++;
      return { f: "true" };
    }
    if (je("(")) {
      // formula v oklepaju ali izraz v oklepaju na začetku relacije
      const shrani = p;
      try {
        p++;
        const f = formula();
        vzemi(")");
        if (peek() && peek().k === "s" && (REL.has(peek().v) || ARIT.has(peek().v))) throw new Error("izraz");
        if (f.f === "expr") throw new Error("izraz");
        return f;
      } catch {
        p = shrani;
      }
    }
    const a = izraz();
    if (!(peek() && peek().k === "s" && REL.has(peek().v))) {
      return { f: "expr", e: a }; // samo za vračanje iz oklepaja; drugje napaka
    }
    const op = t[p++].v;
    const b = izraz();
    if (peek() && peek().k === "s" && REL.has(peek().v)) throw new Error("veriga relacij");
    return { f: "rel", op, a, b };
  }

  // izrazi
  function izraz() {
    let a = clen();
    while (je("+") || je("-")) {
      const op = t[p++].v;
      a = { t: op === "+" ? "add" : "sub", a, b: clen() };
    }
    return a;
  }
  function clen() {
    let a = predpona();
    while (je("*") || je("/")) {
      const op = t[p++].v;
      a = { t: op === "*" ? "mul" : "div", a, b: predpona() };
    }
    return a;
  }
  function predpona() {
    if (je("-")) {
      p++;
      return { t: "neg", a: predpona() };
    }
    return potenca();
  }
  function potenca() {
    const a = aplikacija();
    if (je("^")) {
      p++;
      const n = eksponent();
      return { t: "pow", a, n };
    }
    return a;
  }
  function eksponent() {
    // naravno število ali (n : ℕ) ali (-n : ℤ) / (n : ℤ)
    if (peek() && peek().k === "num" && /^\d+$/.test(peek().v)) return omejen(Number(t[p++].v));
    if (je("(")) {
      p++;
      let neg = false;
      if (je("-")) {
        p++;
        neg = true;
      }
      if (!(peek() && peek().k === "num" && /^\d+$/.test(peek().v))) throw new Error("eksponent ni celo število");
      const n = Number(t[p++].v);
      vzemi(":");
      if (je("ℤ")) p++;
      else if (je("ℕ") && !neg) p++;
      else throw new Error("tip eksponenta");
      vzemi(")");
      return omejen(neg ? -n : n);
    }
    throw new Error("eksponent ni celo število");
  }
  function aplikacija() {
    if (jeId("Real.sqrt") || je("√")) {
      p++;
      return { t: "sqrt", a: aplikacija(), funkcija: true };
    }
    return atom();
  }
  function atom() {
    const c = peek();
    if (!c) throw new Error("nepričakovan konec");
    if (c.k === "num") {
      p++;
      const v = qIzDecimalnega(c.v);
      if (!v) throw new Error("število");
      return { t: "num", v };
    }
    if (c.k === "id") {
      p++;
      if (!vezane.has(c.v)) throw new Error(`ime »${c.v}« ni vezana spremenljivka`);
      return { t: "var", n: c.v, tip: "ℝ" };
    }
    if (je("|")) {
      p++;
      const a = izraz();
      vzemi("|");
      return { t: "abs", a };
    }
    if (je("(")) {
      p++;
      const a = izraz();
      if (je(":")) {
        p++;
        vzemi("ℝ");
        vzemi(")");
        return { ...a, oznaka: "ℝ" };
      }
      vzemi(")");
      return a;
    }
    throw new Error(`nepričakovano »${c.v}«`);
  }
  const r = izrek();
  if (imena && r.spremenljivke.some((v) => !imena.includes(v))) throw new Error("tuja spremenljivka");
  return r;
}

// ---------- tipi: vsaka relacija mora biti v ℝ ----------
/** Ali ima izraz list tipa ℝ (vezano spremenljivko ali oznako (… : ℝ)) zunaj eksponentov. */
function imaRealenList(e) {
  if (!e) return false;
  if (e.oznaka === "ℝ" || e.t === "var" || e.funkcija) return true;
  if (e.t === "abs") return imaRealenList(e.a); // |a| ima tip a
  return ["a", "b"].some((k) => e[k] && imaRealenList(e[k]));
}
function preveriTipe(e) {
  if (!e) return;
  if (e.t === "abs" && !imaRealenList(e.a)) throw new Error("|…| brez realnega tipa");
  if (e.t === "sqrt" || e.t === "abs" || e.t === "neg" || e.t === "pow") preveriTipe(e.a);
  if (e.b) preveriTipe(e.b);
  if (e.a && !["sqrt", "abs", "neg", "pow"].includes(e.t)) preveriTipe(e.a);
}
function relacijaVR(r) {
  if (velikost(r.a) + velikost(r.b) > 20000) throw new Error("izraz prevelik (ugnezdene potence)");
  if (!imaRealenList(r.a) && !imaRealenList(r.b)) throw new Error("relacija brez realnega tipa (naravna števila?)");
  preveriTipe(r.a);
  preveriTipe(r.b);
}

// ---------- formula → oblika ----------
const ploscaKonj = (f) => (f.f === "and" ? [...ploscaKonj(f.a), ...ploscaKonj(f.b)] : [f]);
const ploscaDisj = (f) => (f.f === "or" ? [...ploscaDisj(f.a), ...ploscaDisj(f.b)] : [f]);
function vAtom(f) {
  // ¬ (a = b) je a ≠ b
  if (f.f === "not" && f.a.f === "rel" && f.a.op === "=") f = { ...f.a, op: "≠" };
  if (f.f !== "rel") throw new Error("pričakovana relacija");
  relacijaVR(f);
  if (f.op === ">") return { op: "<", a: f.b, b: f.a };
  if (f.op === "≥") return { op: "≤", a: f.b, b: f.a };
  return { op: f.op, a: f.a, b: f.b };
}

/** Izrek Lean → oblika { spremenljivke, hipoteze, levo, desno, zaprt } ali vrže napako. */
export function obratno(izrek, imena) {
  if (typeof izrek !== "string" || !izrek.trim() || izrek.length > NAJVEC_ZNAKOV || /[\r\n]/.test(izrek)) throw new Error("izrek ni ena vrstica");
  if (/:=|\bby\b|--|\/-/.test(izrek)) throw new Error("izrek vsebuje dokaz ali komentar");
  const { spremenljivke: sp, f } = razcleniLean(izrek, imena);
  if (f.f === "iff") {
    const levo = ploscaKonj(f.a).map(vAtom);
    const desno = f.b.f === "false" ? [] : ploscaDisj(f.b).map((d) => ploscaKonj(d).map(vAtom));
    return { spremenljivke: sp, oblika: "iff", hipoteze: [], levo, desno };
  }
  if (f.f === "not") return { spremenljivke: sp, oblika: "iff", hipoteze: [], levo: ploscaKonj(f.a).map(vAtom), desno: [] };
  // implikacije: hipoteze → zaključek
  const hip = [];
  let g = f;
  while (g.f === "imp") {
    hip.push(...ploscaKonj(g.a).map(vAtom));
    g = g.b;
  }
  if (g.f !== "rel") throw new Error("oblika izreka ni prepoznana");
  // ∀ x, A ≠ B (brez hipotez): enačba A = B nima rešitve
  if (!hip.length && sp.length && g.op === "≠") return { spremenljivke: sp, oblika: "iff", hipoteze: [], levo: [{ ...vAtom(g), op: "=" }], desno: [] };
  return { spremenljivke: sp, oblika: hip.length || sp.length ? "imp" : "rel", hipoteze: hip, levo: [vAtom(g)], desno: null };
}

// ---------- primerjava pomena ----------
const razlika = (a) => ({ t: "sub", a: a.a, b: a.b });
const NIC = { t: "num", v: new Q(0n) };

/** Isti izraz: enak zapis ali točno ista racionalna funkcija (kjer sta definirana). */
function enakIzraz(a, b, imena) {
  if (kanon(a) === kanon(b)) return true;
  const f = racFunkcija(a, imena);
  const g = racFunkcija(b, imena);
  return !!(f && g && enakiFunkciji(f, g));
}

/** Atom izvirnika in atom prevoda pomenita isto: isti strani ali razlika strani do konstantnega faktorja. */
function istiAtom(x, y, imena) {
  if (x.op !== y.op) return false;
  const simetricna = x.op === "=" || x.op === "≠";
  if (enakIzraz(x.a, y.a, imena) && enakIzraz(x.b, y.b, imena)) return true;
  if (simetricna && enakIzraz(x.a, y.b, imena) && enakIzraz(x.b, y.a, imena)) return true;
  const d1 = racFunkcija(razlika(x), imena);
  const d2 = racFunkcija(razlika(y), imena);
  // konstantna ali ničelna razlika (2 = 3, x = x): le stran za stranjo (zgoraj)
  if (!d1 || !d2 || jeNicelna(d1) || jeNicelna(d2) || konstantna(d1) || konstantna(d2)) return false;
  return sorazmerni(d1, d2, { pozitiven: !simetricna });
}

/** Bijekcija med seznamoma atomov. */
function istiAtomi(xs, ys, imena) {
  if (xs.length !== ys.length) return false;
  const vzeti = new Set();
  for (const x of xs) {
    const j = ys.findIndex((y, i) => !vzeti.has(i) && istiAtom(x, y, imena));
    if (j < 0) return false;
    vzeti.add(j);
  }
  return true;
}

// ---------- pokritost: v Leanu je x/0 = 0, √(negativno) = 0 in x⁰ = 1 ----------
const jeNicZapis = (e) => kanon(e) === "0";
/** Ali pogoj g (a ≠ b, a < b, a ≤ b) zagotavlja, da je imenovalec ≠ 0 (vrsta "im") oziroma argument korena ≥ 0 ("kor"). */
function pokriva(g, e, vrsta, imena) {
  if (vrsta === "im") {
    if (g.op !== "≠" && g.op !== "<") return false;
    if ((jeNicZapis(g.b) && kanon(g.a) === kanon(e)) || (jeNicZapis(g.a) && kanon(g.b) === kanon(e))) return true;
    const f = racFunkcija(razlika(g), imena);
    const h = racFunkcija(e, imena);
    return !!(f && h && !konstantna(h) && sorazmerni(f, h));
  }
  if (g.op !== "≤" && g.op !== "<") return false;
  if (jeNicZapis(g.a) && kanon(g.b) === kanon(e)) return true;
  const f = racFunkcija({ t: "sub", a: g.b, b: g.a }, imena);
  const h = racFunkcija(e, imena);
  return !!(f && h && !konstantna(h) && sorazmerni(f, h, { pozitiven: true }));
}
/** Imenovalci (tudi osnove negativnih potenc), argumenti korenov in osnove potenc z eksponentom 0 v atomu. */
function postavke(atom) {
  const o = obmocje(atom.a);
  obmocje(atom.b, o);
  const nicelne = [];
  const isci = (e) => {
    if (!e) return;
    if (e.t === "pow" && e.n === 0) nicelne.push(e.a);
    isci(e.a);
    isci(e.b);
  };
  isci(atom.a);
  isci(atom.b);
  return [...o.imenovalci.map((e) => ({ e, vrsta: "im" })), ...o.koreni.map((e) => ({ e, vrsta: "kor" })), ...nicelne.map((e) => ({ e, vrsta: "nic" }))];
}
/**
 * Vsak imenovalec in koren s spremenljivko mora varovati pogoj, ki ga ne varuje sam (brez krožnosti); zaprti
 * imenovalci morajo biti zanesljivo ≠ 0, zaprti koreni ≥ 0, osnova potence z eksponentom 0 pa zaprta in ≠ 0.
 * varuhi: atomi, ki smejo varovati (konjunkti leve strani ali predpostavke); ostali: atomi, ki ne smejo.
 */
function pokritost(varuhi, ostali, imena) {
  const ok = (atom, zaupani) =>
    postavke(atom).every(({ e, vrsta }) => {
      if (!spremenljivke(e).size) {
        const z = zaprtPredznak(e);
        return vrsta === "kor" ? z === 0 || z === 1 : z === 1 || z === -1;
      }
      if (vrsta === "nic") return false;
      return zaupani.some((g) => g !== atom && pokriva(g, e, vrsta, imena));
    });
  const zaupani = [];
  for (let spremembe = true; spremembe; ) {
    spremembe = false;
    for (const g of varuhi)
      if (!zaupani.includes(g) && ok(g, zaupani)) {
        zaupani.push(g);
        spremembe = true;
      }
  }
  return varuhi.every((g) => zaupani.includes(g)) && ostali.every((a) => ok(a, zaupani));
}

/** Zaprt izraz kot točna konstanta (racionalna funkcija brez spremenljivk) ali napaka. */
function konstantaTocno(e) {
  if (spremenljivke(e).size) throw new Error("rešitev ni število");
  const f = racFunkcija(e, []);
  if (!f) throw new Error("vrednost ni točno izračunljiva");
  return f;
}

/** Rešitve kot množica točnih vrednosti spremenljivk (enačbe in sistemi): [{ x: konstanta, … }]. */
function resitveKotVrednosti(desno, imena) {
  return desno.map((d) => {
    const m = {};
    for (const a of d) {
      if (a.op !== "=") throw new Error("rešitev ni enačaj");
      let v;
      let c;
      if (a.a.t === "var" && !spremenljivke(a.b).size) (v = a.a.n), (c = a.b);
      else if (a.b.t === "var" && !spremenljivke(a.a).size) (v = a.b.n), (c = a.a);
      else throw new Error("rešitev ni oblike x = število");
      if (m[v] != null || !imena.includes(v)) throw new Error("rešitev dvakrat ali tuja spremenljivka");
      m[v] = konstantaTocno(c);
    }
    return m;
  });
}
function istaMnozicaVrednosti(r1, r2, imena) {
  const enak = (a, b) => imena.every((v) => a[v] != null && b[v] != null && enakiFunkciji(a[v], b[v]));
  const brez = (r) => r.filter((a, i) => !r.slice(0, i).some((b) => enak(a, b)));
  const a = brez(r1);
  const b = brez(r2);
  if (a.some((x) => Object.keys(x).length !== imena.length) || b.some((x) => Object.keys(x).length !== imena.length)) return false;
  return a.length === b.length && a.every((x) => b.some((y) => enak(x, y)));
}

/** Interval iz konjunkcije mej spremenljivke x: { lo, loZaprt, hi, hiZaprt } (null = neskončno). */
function intervalIzMej(d, x) {
  const iv = { lo: null, loZaprt: false, hi: null, hiZaprt: false };
  if (!d.length || d.length > 2) throw new Error("interval ni oblike a < x ∧ x < b");
  for (const a of d) {
    if (a.op !== "<" && a.op !== "≤") throw new Error("interval z enačajem");
    if (a.b.t === "var" && a.b.n === x && !spremenljivke(a.a).size) {
      if (iv.lo != null) throw new Error("dve spodnji meji");
      iv.lo = konstantaTocno(a.a);
      iv.loZaprt = a.op === "≤";
    } else if (a.a.t === "var" && a.a.n === x && !spremenljivke(a.b).size) {
      if (iv.hi != null) throw new Error("dve zgornji meji");
      iv.hi = konstantaTocno(a.b);
      iv.hiZaprt = a.op === "≤";
    } else throw new Error("meja ni oblike a < x ali x < b");
  }
  return iv;
}
function istiIntervali(d1, d2, x) {
  const a = d1.map((d) => intervalIzMej(d, x));
  const b = d2.map((d) => intervalIzMej(d, x));
  const enak = (p, q) =>
    p.loZaprt === q.loZaprt &&
    p.hiZaprt === q.hiZaprt &&
    (p.lo == null ? q.lo == null : q.lo != null && enakiFunkciji(p.lo, q.lo)) &&
    (p.hi == null ? q.hi == null : q.hi != null && enakiFunkciji(p.hi, q.hi));
  return a.length === b.length && a.every((p) => b.some((q) => enak(p, q))) && b.every((q) => a.some((p) => enak(p, q)));
}

/**
 * Skladnost izreka Lean z izvirno trditvijo v zapisu RACUN: { skladno: true } ali { skladno: false, razlog }.
 * Neprepoznana oblika je vedno neskladna. Velja tudi za izreke, ki jih ni napisal prevajalnik (npr. model AI).
 */
export function skladnost(racun, izrek) {
  const o = oblikaIzRacuna(racun);
  if (o.napaka) return { skladno: false, razlog: `izvirnik zunaj obsega: ${o.napaka}` };
  let l;
  try {
    l = obratno(izrek);
  } catch (e) {
    return { skladno: false, razlog: `izrek ni prepoznan: ${e.message}` };
  }
  const imena = o.spremenljivke;
  const vars = [...l.spremenljivke].sort();
  if (vars.join(",") !== [...imena].sort().join(",")) return { skladno: false, razlog: "spremenljivke se ne ujemajo" };
  try {
    if (o.vrsta === "racun") {
      if (l.oblika !== "rel" || l.levo.length !== 1) return { skladno: false, razlog: "račun ni enakost" };
      const [x] = o.glavni;
      const [y] = l.levo;
      if (y.op !== "=") return { skladno: false, razlog: "račun ni enakost" };
      if (!pokritost([], [y], [])) return { skladno: false, razlog: "nedefiniran del (deljenje z 0, koren negativnega števila, 0⁰)" };
      const ok = (enakIzraz(x.a, y.a, []) && enakIzraz(x.b, y.b, [])) || (enakIzraz(x.a, y.b, []) && enakIzraz(x.b, y.a, []));
      return ok ? { skladno: true } : { skladno: false, razlog: "strani računa se ne ujemata" };
    }
    if (o.vrsta === "identiteta") {
      if (l.oblika !== "imp" || l.levo.length !== 1 || l.levo[0].op !== "=") return { skladno: false, razlog: "identiteta ni ∀ … → A = B" };
      if (!istiAtomi(o.obmocje, l.hipoteze, imena)) return { skladno: false, razlog: "pogoji območja se ne ujemajo" };
      if (!pokritost(l.hipoteze, l.levo, imena)) return { skladno: false, razlog: "imenovalec ali koren brez pogoja (v Leanu je x/0 = 0)" };
      const [x] = o.glavni;
      const [y] = l.levo;
      const ok = (enakIzraz(x.a, y.a, imena) && enakIzraz(x.b, y.b, imena)) || (enakIzraz(x.a, y.b, imena) && enakIzraz(x.b, y.a, imena));
      return ok ? { skladno: true } : { skladno: false, razlog: "strani identitete se ne ujemata" };
    }
    if (l.oblika !== "iff") return { skladno: false, razlog: "enačba ali neenačba ni ekvivalenca (↔)" };
    if (!istiAtomi([...o.obmocje, ...o.glavni], l.levo, imena)) return { skladno: false, razlog: "pogoji ali relacija se ne ujemajo" };
    if (!pokritost(l.levo, l.desno.flat(), imena)) return { skladno: false, razlog: "imenovalec ali koren brez pogoja (v Leanu je x/0 = 0)" };
    if (o.vrsta === "neenacba") return istiIntervali(o.resitve, l.desno, imena[0]) ? { skladno: true } : { skladno: false, razlog: "množica rešitev se ne ujema" };
    const ok = istaMnozicaVrednosti(resitveKotVrednosti(o.resitve, imena), resitveKotVrednosti(l.desno, imena), imena);
    return ok ? { skladno: true } : { skladno: false, razlog: "množica rešitev se ne ujema" };
  } catch (e) {
    return { skladno: false, razlog: `izrek ni prepoznan: ${e.message}` };
  }
}

/**
 * Dokaz za zapis trditve (public/preverjanje/trditev.js) iz izida Leana. Šteje le, ko je izrek skladen z
 * izvirnikom, dokazan in stoji samo na dovoljenih aksiomih; sicer null (status ostane pri drugih motorjih).
 */
export function leanDokaz(racun, izrek, izid) {
  if (!izid || izid.izid !== "proved") return null;
  const dovoljeni = ["propext", "Classical.choice", "Quot.sound"];
  if (!Array.isArray(izid.aksiomi) || izid.aksiomi.some((a) => !dovoljeni.includes(a))) return null;
  const s = skladnost(racun, izrek);
  if (!s.skladno) return null;
  return { motor: "lean", holds: true, how: "formal", complete: "formal", opomba: "prevod PV-13, skladen z izvirnikom" };
}

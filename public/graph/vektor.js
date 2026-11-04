// Pol in Rec tudi sredi daljših izrazov (Casio Pol/Rec, TI R►Pr/P►Rx). Brez DOM (preizkusi v test/tools.test.js).
// Rec(r; θ) je vektor (x; y): vektorje seštevaš in odštevaš, množiš ali deliš s številom, vektor · vektor je
// skalarni produkt, |vektor| njegova dolžina. Pol(x; y) ali Pol(vektor) da r in θ, zato je le zunanja funkcija vrstice.
// Primer (sila iz dveh sil): Pol(Rec(5; 30) + Rec(3; 120)) → r = 5,83, θ = 60,96°.
// Vse dela na drevesu izraza (math.js): komponenti sta navadna izraza, zato delujejo tudi drsniki in t v načinu graf.
import { MathError } from "./math.js";

const isPR = (n) => n?.k === "call" && (n.f === "Pol" || n.f === "Rec");
/** Ali drevo vsebuje Pol( ali Rec(. */
export function hasPolRec(n) {
  if (!n || typeof n !== "object") return false;
  if (Array.isArray(n)) return n.some(hasPolRec);
  if (isPR(n)) return true;
  for (const k in n) if (k !== "k" && typeof n[k] === "object" && hasPolRec(n[k])) return true;
  return false;
}

const bin = (k, a, b) => ({ k, a, b });
const call = (f, ...args) => ({ k: "call", f, args });
const sq = (a) => bin("*", a, a);

const hasPol = (n) => !!n && typeof n === "object" && ((n.k === "call" && n.f === "Pol") || Object.keys(n).some((k) => k !== "k" && typeof n[k] === "object" && hasPol(n[k])));

// { s: drevo } (število) ali { v: [drevoX, drevoY] } (vektor)
function split(n) {
  if (!hasPolRec(n)) return { s: n };
  if (hasPol(n)) throw new MathError("polInside"); // Pol da dve števili (r, θ): le zunanja funkcija vrstice
  switch (n.k) {
    case "grp":
      return split(n.a);
    case "neg": {
      const a = split(n.a);
      return a.v ? { v: a.v.map((c) => ({ k: "neg", a: c })) } : { s: { k: "neg", a: a.s } };
    }
    case "+":
    case "-": {
      const a = split(n.a);
      const b = split(n.b);
      if (a.v && b.v) return { v: [0, 1].map((i) => bin(n.k, a.v[i], b.v[i])) };
      if (!a.v && !b.v) return { s: bin(n.k, a.s, b.s) };
      throw new MathError("vecMix"); // vektor + število nima pomena
    }
    case "*": {
      const a = split(n.a);
      const b = split(n.b);
      if (a.v && b.v) return { s: bin("+", bin("*", a.v[0], b.v[0]), bin("*", a.v[1], b.v[1])) };
      if (a.v) return { v: a.v.map((c) => bin("*", c, b.s)) };
      if (b.v) return { v: b.v.map((c) => bin("*", a.s, c)) };
      return { s: bin("*", a.s, b.s) };
    }
    case "/": {
      const a = split(n.a);
      const b = split(n.b);
      if (b.v) throw new MathError("vecOp");
      return a.v ? { v: a.v.map((c) => bin("/", c, b.s)) } : { s: bin("/", a.s, b.s) };
    }
    case "call": {
      if (n.f === "Rec") {
        if (n.args.length !== 2) throw new MathError("arity", { f: "Rec", n: 2 });
        const [r, th] = n.args.map(split);
        if (r.v || th.v) throw new MathError("vecOp");
        return { v: [bin("*", r.s, call("cos", th.s)), bin("*", r.s, call("sin", th.s))] };
      }
      if (n.f === "abs" && n.args.length === 1) {
        const a = split(n.args[0]);
        if (a.v) return { s: call("sqrt", bin("+", sq(a.v[0]), sq(a.v[1]))) };
      }
      throw new MathError("vecOp");
    }
    default:
      throw new MathError("vecOp");
  }
}

/**
 * Vrstica s Pol/Rec kot komponente.
 * @returns {null | { kind: "pol" | "rec", x, y } | { kind: "num", s }} null: v vrstici ni Pol/Rec
 *   (ali je enačba/prireditev). x, y, s so drevesa (math.js), ki jih izračuna compile.
 */
export function vectorLine(ast) {
  if (!hasPolRec(ast) || ast.k === "cmp") return null;
  let root = ast;
  while (root.k === "grp") root = root.a;
  if (root.k === "call" && root.f === "Pol") {
    if (root.args.length === 2) {
      const [a, b] = root.args.map(split);
      if (a.v || b.v) throw new MathError("vecOp");
      return { kind: "pol", x: a.s, y: b.s };
    }
    const a = root.args.length === 1 ? split(root.args[0]) : null;
    if (!a?.v) throw new MathError("arity", { f: "Pol", n: 2 });
    return { kind: "pol", x: a.v[0], y: a.v[1] };
  }
  const r = split(root);
  return r.v ? { kind: "rec", x: r.v[0], y: r.v[1] } : { kind: "num", s: r.s };
}

/** Rec(…) v načinu graf: točka (x; y) kot par, ki ga model nariše (null, če ni vektor). */
export function vectorTuple(ast) {
  const vl = vectorLine(ast);
  return vl?.kind === "rec" ? { k: "tuple", items: [vl.x, vl.y] } : null;
}

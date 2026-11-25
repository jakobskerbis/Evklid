// Jedro znanstvenega kalkulatorja in pretvornika enot: brez DOM, zato ga lahko preizkusimo v Node.
// Izraze razčleni in izračuna isti razčlenjevalnik kot grafični kalkulator (math.js).
import { precise } from "./natancnost.js";
import { parse, compile, toTex, freeVars, diff, simplify, substitute, BUILTINS, MathError, calcText, calcRewrite, splitTop, integrateInfo, walk, withIntegralBudget, integralTrace, withIntegralValues } from "./math.js";

const ANS = "A_{ans}"; // »Ans« v izrazu; razčlenjevalnik bi »ans« razbil v a·n·s
const ANS_VAR = "A_ans"; // ime spremenljivke po razčlenitvi
const DEG = "G_{deg}"; // »°«: 1 v stopinjah, π/180 v radianih, 10/9 v gradih; v zapisu ostane ° (ne izgine)
const DEG_VAR = "G_deg";
const MIN = "G_{min}"; // »′« (kotna minuta) = °/60
const MIN_VAR = "G_min";
const SEC = "G_{sec}"; // »″« (kotna sekunda) = °/3600
const SEC_VAR = "G_sec";
export const HIDDEN_VARS = new Set([ANS_VAR, DEG_VAR, MIN_VAR, SEC_VAR]);
// 30°15′20″ → (30° + 15′ + 20″), da ostane skupaj (−30°15′ = −30,25°, 2·30°15′ = 60,5°)
const DMS_RUN = /\d+(?:\.\d+)?\s*[°′](?:\s*\d+(?:\.\d+)?\s*[′″])+/g;

export { splitTop }; // skupno z grafičnim kalkulatorjem (math.js)

/**
 * Besedilo s tipkovnice → izraz za razčlenjevalnik.
 * - decimalna vejica je vedno vejica med števkami (tudi v oklepaju), argumente loči »;«,
 * - »°« pomeni ·π/180 v radianih, ·1 v stopinjah in ·10/9 v gradih (v zapisu ostane °); »′« in »″« sta
 *   kotna minuta in sekunda (30°15′20″),
 * - 1,2E5 → 1,2·10^(5), manjkajoče zaklepaje dodamo na konec, ∫(f; a; b) je določeni integral.
 */
export function prepare(text, { comma = true, names = null } = {}) {
  // »1 000 000/4«: presledek med skupinami po 3 števke je ločilo tisočic, ne množenje
  // »1.234,5« = 1234,5; nejasen zapis števila (»12 3456«, »1.2.3«) je napaka, ne tiho množenje (12 · 3456, 1,2 · 0,3).
  // Isto pravilo kot grafični kalkulator in preverjanje odgovorov (numberText v math.js).
  // Znanstveni zapis, ∫(f; a; b) in manjkajoči zaklepaji: skupna priprava z grafičnim kalkulatorjem (calcText).
  let s = String(text ?? "").trim().replace(/(?<![A-Za-z])Ans(?![A-Za-z])/g, ANS);
  s = calcText(s, { comma, names, close: true });
  s = s.replace(DMS_RUN, (m) => `(${m.replace(/([°′])\s*(?=\d)/g, "$1+")})`);
  // ′ in ″ sta minuta in sekunda le za številom; f′(2) in (x³)′ ostaneta odvod (math.js ′ → ')
  // Enota se veže na število ali črko tik pred njo, močneje kot funkcija, potenca in deljenje (kot ° v grafičnem
  // kalkulatorju): sin 30° = sin(30°), 1/30° = 1/(30°), 30°^2 = (30°)². Prej je bil »sin 30°« (sin 30)·° (AUDIT-025).
  s = s
    .replace(/(\d+(?:\.\d+)?|(?<![A-Za-z_{])[A-Za-zα-ωπθ](?![A-Za-z_(]))\s*°/g, `($1 ${DEG})`)
    .replace(/°/g, ` ${DEG}`)
    .replace(/(\d+(?:\.\d+)?)\s*′/g, `($1 ${MIN})`)
    .replace(/(\d+(?:\.\d+)?)\s*″/g, `($1 ${SEC})`);
  return s;
}

/** Je besedilo prirejanje »a = 5«? Vrne ime spremenljivke ali null. */
function assignment(ast) {
  if (ast?.k !== "cmp" || ast.ops.length !== 1 || ast.ops[0] !== "=") return null;
  const l = ast.terms[0];
  return l.k === "var" && !HIDDEN_VARS.has(l.name) ? l.name : null;
}

// Prepis drevesa pred računanjem (zapis ostane, kot ga je vpisal učenec):
// - a + p % → a·(1 + p/100) kot na kalkulatorju v telefonu (200 + 10 % = 220),
// - round(x; n) zaokroži na n decimalk,
// - d/dx(f; a) je odvod v točki a.
function rewrite(n, ctx) {
  // odstotki in round(x; n): skupno z grafičnim kalkulatorjem (calcRewrite v math.js)
  return calcRewrite(n, (m, r) => {
    if (m.k === "der" && m.a?.k === "tuple" && m.a.items.length === 2) {
      // Simbolni odvod v točki a ne zadošča (AUDIT-017, AUDIT-018): ln x ima pri x = −1 »odvod« −1, |x| pri 0
      // »odvod« 0. __ODVOD_V_TOCKI (math.js) zato preveri še, da je f v a definirana in da se levi in desni odvod
      // ujemata z njim. Gnezden odvod (d/dx(d/dx(…; x); 2)) in odvod za simbolno računanje ostaneta navadna.
      const plain = { ...ctx, plainDer: true };
      const f = rewrite(m.a.items[0], plain);
      const a = r(m.a.items[1]);
      // odvod v točki je v radianih (AUDIT-055): odvod, točka in preverjanje v vozlu »rad« (math.js compile)
      const rad = ctx.calcRad ? { ...ctx, deg: false, grad: false } : ctx;
      const d = simplify(diff(f, m.v, rad));
      const at = substitute(d, { [m.v]: a });
      if (ctx.plainDer) return { k: "grp", a: at };
      const call = { k: "call", f: "__ODVOD_V_TOCKI", args: [at, a], fn: f, v: m.v };
      return ctx.calcRad && (ctx.deg || ctx.grad) ? { k: "rad", a: call } : call;
    }
  });
}

/** Zapis TeX za zgodovino: ° namesto pomožne spremenljivke, Ans, odvod v točki. */
export function lineTex(ast, comma = true) {
  if (ast?.k === "der" && ast.a?.k === "tuple" && ast.a.items.length === 2) {
    const [f, a] = ast.a.items;
    return `\\left.\\frac{d}{d${ast.v}}\\left(${lineTex(f, comma)}\\right)\\right|_{${ast.v}=${lineTex(a, comma)}}`;
  }
  return toTex(ast, { comma, sep: comma ? ";" : "," })
    .replaceAll(ANS, "\\mathrm{Ans}")
    // potenca s stopinjami (Ans²°): drugi eksponent na prazni osnovi, sicer je dvojni eksponent napaka KaTeX (AUDIT-020)
    .replace(/(\^\{(?:[^{}]|\{[^{}]*\})*\})\s*(?:\\cdot\s*)?G_\{(deg|min|sec)\}/g, (_, sup, u) => `${sup}{}^{${{ deg: "\\circ", min: "\\prime", sec: "\\prime\\prime" }[u]}}`)
    .replace(/\s*(?:\\cdot\s*)?G_\{deg\}/g, "^{\\circ}")
    .replace(/\s*(?:\\cdot\s*)?G_\{min\}/g, "^{\\prime}")
    .replace(/\s*(?:\\cdot\s*)?G_\{sec\}/g, "^{\\prime\\prime}")
    .replace(/(?<=^|[{\s+\-=(,])\\left\(([\d{},.]+|[A-Za-z]|\\(?:pi|theta|alpha|beta|gamma|varphi|phi))\^\{(\\circ|\\prime|\\prime\\prime)\}\\right\)(?!\s*\^)/g, "$1^{$2}") // (30°) → 30° (ne za funkcijo, števko ali pred potenco)
    .replace(/(\^\{\\circ\}|\^\{\\prime\})\s*\+\s*(?=[\d{},.]+\^\{\\prime(?:\\prime)?\}(?!\s*(?:\\cdot|\^|\\times)))/g, "$1") // 30° + 15′ → 30°15′ (ne 30° + 15′·2)
    .replace(/\\cdot\s*10\^/g, "\\cdot 10^");
}

const FN_NAME = /^\s*([A-Za-z])\s*\(\s*([A-Za-z])\s*\)\s*=(?!=)/;
/** Je vrstica definicija funkcije »f(x) = …«? Vrne { name, param, body } ali null. */
export function functionDef(text) {
  const m = FN_NAME.exec(String(text ?? ""));
  if (!m || BUILTINS.has(m[1]) || m[1] === "e" || m[1] === m[2]) return null;
  return { name: m[1], param: m[2], body: String(text).slice(m[0].length).trim() };
}

/**
 * Pripravi vrstico za računanje: drevo, prevedeno drevo, obseg spremenljivk in kontekst
 * (uporabniške funkcije f(x) = …). Vrže MathError.
 * funcs: { f: { param, body } } (besedilo telesa, kot ga je vpisal učenec)
 */
export function compileLine(text, { vars = {}, ans = 0, deg = false, grad = false, comma = true, funcs = {} } = {}) {
  const known = new Set([...Object.keys(vars), ...Object.keys(funcs)]); // spremenljivka E: »3E-2« je 3·E − 2
  const src = prepare(text, { comma, names: known });
  if (!src) return null;
  const names = new Set(Object.keys(funcs));
  const one = grad ? 200 / 180 : deg ? 1 : Math.PI / 180; // 1° v trenutni enoti kota
  const scope = Object.assign(Object.create(null), vars, { [ANS_VAR]: ans, [DEG_VAR]: one, [MIN_VAR]: one / 60, [SEC_VAR]: one / 3600 });
  const defs = {};
  // calcRad: ∫ in d/dx v radianih tudi v DEG/GRA (math.js compile, AUDIT-055); ° je tam π/180
  const ctx = { deg: deg && !grad, grad, funcs: defs, global: scope, derCheck: true, calcRad: true, degUnits: { [DEG_VAR]: Math.PI / 180, [MIN_VAR]: Math.PI / 10800, [SEC_VAR]: Math.PI / 648000 } };
  for (const [name, f] of Object.entries(funcs)) {
    try {
      defs[name] = { params: [f.param], ast: rewrite(parse(prepare(f.body, { comma, names: known }), { funcs: names }), ctx), body: null };
    } catch {}
  }
  for (const d of Object.values(defs)) {
    try {
      d.body = compile(d.ast, ctx);
    } catch {
      d.body = () => NaN;
    }
  }
  const ast = parse(src, { funcs: names });
  return { src, ast, scope, ctx, rw: (node) => rewrite(node, ctx), run: (node) => compile(rewrite(node, ctx), ctx) };
}

/** v zaokrožen na mesta, ki jih napaka err še dopušča (vsaj 1, največ 15 značilnih mest). */
export function reliable(v, err) {
  if (!Number.isFinite(v) || v === 0 || !(err > 0)) return v;
  const d = Math.max(1, Math.min(15, Math.floor(Math.log10(Math.abs(v) / err))));
  return Number(v.toPrecision(d));
}

/** Podatki integrateInfo za vsak določeni integral v drevesu (ne znotraj drugega integrala). */
export function integralsOf(node, ctx, scope) {
  const all = [];
  walk(node, (n) => n.k === "int" && all.push(n));
  const nested = new Set();
  for (const n of all) [n.a, n.lo, n.hi].forEach((c) => walk(c, (m) => m.k === "int" && nested.add(m)));
  const out = [];
  for (const n of all) {
    if (nested.has(n) || !n.lo || !n.hi) continue;
    try {
      const f = compile(n.a, ctx);
      const a = compile(n.lo, ctx)(scope);
      const b = compile(n.hi, ctx)(scope);
      const sc = Object.create(scope);
      const g = (t) => {
        sc[n.v] = t;
        const y = f(sc);
        return Array.isArray(y) ? y[0] : y;
      };
      out.push(integrateInfo(g, a, b));
    } catch {}
  }
  return out;
}

const INT_LIVE_MS = 50; // integrali v predogledu med tipkanjem (sicer ga ne pokažemo)
const INT_MS = 1000; // integrali ob Izračunaj
const unwrapGrp = (n) => (n?.k === "grp" ? unwrapGrp(n.a) : n);
const hasIntegral = (node) => {
  let yes = false;
  walk(node, (n) => {
    if (n.k === "int" && n.lo) yes = true;
  });
  return yes;
};
/**
 * Vrednost integrala (integrateInfo), kolikor jo podpira ocena napake: { value, est: true, digits } — številski izid je
 * vedno približek (»≈«; »=« le za točno, simbolno vrednost), value zaokrožen na zanesljiva mesta (največ 12).
 * null: ocena napake ne podpira niti enega mesta.
 */
export function zanesljivaMesta(info) {
  const { value: v, err } = info;
  if (!Number.isFinite(v) || !(err >= 0) || !Number.isFinite(err)) return null;
  if (err === 0) return { value: v, est: true, digits: 12 };
  const a = Math.abs(v);
  // ∫(sin x; −π; π): vrednost je v šumu, a ta je zanemarljiv proti ∫|f|
  if (a <= err) return err <= 1e-12 * (info.abs || 0) ? { value: 0, est: true, digits: 1 } : null;
  const d = Math.floor(Math.log10(a / err));
  if (d < 1) return null;
  const digits = Math.min(12, d);
  return { value: Number(v.toPrecision(digits)), est: true, digits };
}

/** Zunanji določeni integrali v drevesu po vrsti računanja (ne znotraj drugega integrala). */
function topIntegrals(node) {
  const all = [];
  walk(node, (n) => n.k === "int" && all.push(n));
  const nested = new Set();
  for (const n of all) [n.a, n.lo, n.hi].forEach((c) => walk(c, (m) => m !== n && m.k === "int" && nested.add(m)));
  return all.filter((n) => n.lo && n.hi && !nested.has(n));
}
/**
 * Ali je integrand v x zunaj definicijskega območja: v drevesu je vozel, katerega vrednost je NaN, čeprav so vsi
 * njegovi argumenti končna števila (√ negativnega, ln negativnega, arcsin 2). ∞/∞ ali ∞ − ∞ (preliv) ne šteje.
 */
function domainViolation(intNode, ctx, scope, x) {
  const sc = Object.create(scope);
  sc[intNode.v] = x;
  let found = false;
  const val = (n) => {
    try {
      const y = compile(n, { ...ctx, tolerant: true })(sc); // isti šum zaokrožitve kot v integralu
      return typeof y === "number" ? y : undefined;
    } catch {
      return undefined;
    }
  };
  const visit = (n) => {
    if (found || !n || typeof n !== "object" || n.k === "int") return undefined;
    const kids = [];
    for (const k in n) {
      if (k === "k") continue;
      const c = n[k];
      if (Array.isArray(c)) c.forEach((z) => z && typeof z === "object" && z.k && kids.push(z));
      else if (c && typeof c === "object" && c.k) kids.push(c);
    }
    const kv = kids.map(visit);
    if (found) return undefined;
    const y = val(n);
    if (Number.isNaN(y) && kv.every((z) => typeof z === "number" && Number.isFinite(z))) found = true;
    return y;
  };
  visit(intNode.a);
  return found;
}

// Ali drevo vsebuje nCr/nPr z neceloštevilskim n in k > 1000 (math.js genBinom: pot z ln Γ, ne točen produkt)
function gammaBinom(node, ctx, scope) {
  let yes = false;
  walk(node, (n) => {
    if (yes || n.k !== "call" || (n.f !== "nCr" && n.f !== "nPr") || n.args.length !== 2) return;
    try {
      const a = compile(n.args[0], ctx)(scope);
      const k = compile(n.args[1], ctx)(scope);
      if (typeof a === "number" && typeof k === "number" && !Number.isInteger(a) && k > 1000) yes = true;
    } catch {}
  });
  return yes;
}

/** Neznanke v drevesu (brez znanih spremenljivk in pomožnih imen). */
export function unknownsOf(node, vars = {}) {
  return [...freeVars(node)].filter((v) => !HIDDEN_VARS.has(v) && !(v in vars));
}

/**
 * Izračuna vrstico.
 * @returns {{ value:number, tex:string, assign?:string } | { error:{code, info} } | null}
 */
export function evaluate(text, env = {}) {
  const { vars = {}, comma = true } = env;
  try {
    const line = compileLine(text, env);
    if (!line) return null;
    const { ast, scope, run, rw } = line;
    const name = assignment(ast);
    const expr = name ? ast.terms[1] : ast;
    if (ast.k === "cmp" && !name) return { error: { code: "notCalc", info: {} } };
    const fv = unknownsOf(rw(expr), vars);
    if (fv.length) return { error: { code: "missing", info: { names: fv } } };
    // določeni integrali: s časovno mejo in s podatki o vsakem (ne obstaja, ni zanesljiv, ocena napake)
    const rwe = rw(expr);
    const withInt = hasIntegral(rwe);
    let value;
    let infos = [];
    if (withInt) ({ result: value, infos } = withIntegralBudget(env.live ? INT_LIVE_MS : INT_MS, () => integralTrace(() => run(expr)(scope))));
    else value = run(expr)(scope);
    if (Array.isArray(value)) value = value.length === 1 ? value[0] : NaN;
    if (typeof value === "boolean") value = value ? 1 : 0;
    // Plavajoča vejica ima ~16 mest (AUDIT-049): √(10¹⁶ + 1) − 10⁸ = 0, 1 − cos(10⁻⁸) = 0, ln(e¹⁰⁰⁰) = ∞.
    // Isto drevo izračunamo še z večjo natančnostjo; če se rezultat razlikuje, velja natančnejši.
    let precision = false;
    let hp = null;
    if (!withInt && typeof value === "number") {
      hp = precise(rwe, scope, { unit: env.grad ? "grad" : env.deg ? "deg" : "rad", ms: env.live ? 15 : 40 });
      if (hp && Number.isFinite(hp.value) && (hp.value !== 0 || hp.zero)) {
        const H = hp.value;
        const off = !Number.isFinite(value) || Math.abs(value - H) > 1e-14 * Math.abs(H) || (H === 0 && value !== 0);
        if (off) {
          // opomba le, kadar bi učenec videl drugo število (0,1 + 0,2 = 0,30000000000000004 ni vredno opombe)
          precision = formatNumber(value).text !== formatNumber(H).text;
          value = H;
        }
      }
    }
    let est = false;
    let single = null; // podatki edinega integrala (scisolve: točna vrednost iz nedoločenega integrala)
    let digits; // zanesljiva mesta edinega integrala
    if (withInt) {
      if (infos.some((r) => r.timeout)) return { error: { code: "intTimeout", info: {} } };
      // ∫(1/x; 0; 1): integral, ki ne obstaja, pove, zakaj (ne le »ni definirano«)
      const div = infos.find((r) => r.diverges);
      // ∫(1/x; 1; ∞): divergira zaradi neskončnega intervala (inf), ne zaradi pola
      if (div && !Number.isFinite(value)) return { error: { code: "intDiverge", info: div.pv !== undefined ? { pv: div.pv } : Number.isFinite(div.at) ? {} : { inf: true } } };
      // √(x − 5) na [0, 10⁴]: f na delu intervala ni definirana (pove to, ne »—«); NaN zaradi preliva
      // (sinh x / cosh x pri 10⁴: ∞/∞) pa ni nedefiniranost, ampak »ni mogoče zanesljivo izračunati«
      const iNan = infos.findIndex((r) => !Number.isFinite(r.value) && !r.diverges && r.at !== undefined);
      if (iNan >= 0 && !Number.isFinite(value)) {
        const ints = topIntegrals(rwe);
        const node = ints.length === infos.length ? ints[iNan] : null;
        if (node && domainViolation(node, line.ctx, scope, infos[iNan].at)) return { error: { code: "intUndefined", info: {} } };
        return { error: { code: "intUnknown", info: {} } };
      }
      if (infos.some((r) => r.undef) && !Number.isFinite(value)) return { error: { code: "intUnknown", info: {} } };
      const zm = infos.map((r) => (Number.isFinite(r.value) ? zanesljivaMesta(r) : null));
      // ∫(sin(1/x)/x; 0; 1): ne izmislimo števila
      if (infos.some((r, i) => r.unknown || (Number.isFinite(r.value) && !zm[i]))) return { error: { code: "intUnknown", info: {} } };
      if (Number.isFinite(value) && infos.length) {
        if (infos.length === 1 && unwrapGrp(rwe).k === "int") {
          ({ value, est, digits } = zm[0]);
          single = infos[0];
        }
        else {
          // sestavljen izraz (∫(…)·2 + 1): napako vsakega integrala prenesemo skozi račun (izraz z vrednostjo ± err)
          const num = (y) => (Array.isArray(y) ? (y.length === 1 ? y[0] : NaN) : typeof y === "boolean" ? +y : y);
          const at = (vs) => num(withIntegralValues(vs, () => run(expr)(scope)));
          const vals = infos.map((r) => r.value);
          let err = 1e-15 * Math.abs(value);
          if (infos.length <= 8)
            infos.forEach((r, i) => {
              const vs = vals.slice();
              vs[i] += r.err;
              err += Math.abs(at(vs) - value);
            });
          else err += Math.max(Math.abs(at(vals.map((v, i) => v + infos[i].err)) - value), Math.abs(at(vals.map((v, i) => v - infos[i].err)) - value));
          const z = zanesljivaMesta({ value, err, abs: Math.abs(value) + vals.reduce((t, v) => t + Math.abs(v), 0) });
          if (!z || !Number.isFinite(err)) return { error: { code: "intUnknown", info: {} } };
          ({ value, est, digits } = z);
        }
      }
    }
    // nCr/nPr z neceloštevilskim n in k > 1000: računano z ln Γ (~12 mest, zadnje včasih napačno), zato »≈« in 11 mest
    if (!est && Number.isFinite(value) && value !== 0 && gammaBinom(rw(expr), line.ctx, scope)) {
      est = true;
      digits = 11;
      value = Number(value.toPrecision(11));
    }
    const tex = lineTex(ast, comma);
    const out = name ? { value, tex, assign: name } : { value, tex };
    // est: številski približek, v vmesniku z »≈« namesto »=« (in samo decimalno, ne ulomek)
    if (est) Object.assign(out, { approx: true, est: true });
    if (precision) out.precision = true;
    // Celo število nad 2⁵³ ima v plavajoči vejici le ~16 mest (AUDIT-050): nCr(100; 50) = 1,0089…·10²⁹ ni »=«.
    // Točne števke (BigInt), če jih natančni račun pozna, sicer je rezultat le približek.
    if (typeof value === "number" && Number.isInteger(value) && Math.abs(value) > Number.MAX_SAFE_INTEGER) {
      // 100! v plavajoči vejici zgreši zadnje mesto (…441 namesto …4415): velja točna vrednost
      // Ans in spremenljivke so shranjene kot double: Ans = nCr(100; 50) ima le ~16 mest, Ans + 1 zato nima točnih števk
      const exactVars = [...freeVars(rwe)].every((n) => n === DEG_VAR || n === MIN_VAR || n === SEC_VAR || typeof scope[n] !== "number" || Number.isSafeInteger(scope[n]));
      // vpisano število z več kot 15 mesti natančni račun prebere točno iz zapisa (raw, AUDIT-030)
      if (exactVars && typeof hp?.int === "bigint" && Math.abs(Number(hp.int) - value) <= 1e-12 * Math.abs(value)) {
        out.value = Number(hp.int);
        out.big = hp.int.toString();
      } else out.bigApprox = true;
    }
    if (single) Object.defineProperty(out, "int", { value: single, enumerable: false });
    if (digits) Object.defineProperty(out, "digits", { value: digits, enumerable: false });
    return out;
  } catch (e) {
    if (e instanceof MathError) return { error: { code: e.code, info: e.info || {} } };
    return { error: { code: "other", info: {} } };
  }
}

// ---------- točna oblika: ulomek, koren, večkratnik π ----------

const gcd = (a, b) => {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
};

/** Približek z verižnim ulomkom: p/q z q ≤ maxQ, ali null, če ni dovolj natančen. */
export function toFraction(v, maxQ = 10000) {
  if (!Number.isFinite(v)) return null;
  const sign = v < 0 ? -1 : 1;
  const x = Math.abs(v);
  let [h0, h1, k0, k1] = [0, 1, 1, 0];
  let r = x;
  for (let i = 0; i < 30; i++) {
    const a = Math.floor(r);
    [h0, h1] = [h1, a * h1 + h0];
    [k0, k1] = [k1, a * k1 + k0];
    if (k1 > maxQ) return null;
    if (Math.abs(h1 / k1 - x) <= 1e-11 * Math.max(1, x)) return { p: sign * h1, q: k1 };
    const f = r - a;
    if (f < 1e-15) break;
    r = 1 / f;
  }
  return Math.abs(h1 / k1 - x) <= 1e-11 * Math.max(1, x) ? { p: sign * h1, q: k1 } : null;
}

const fracTex = (p, q, inner = "") => {
  const s = p < 0 ? "-" : "";
  const a = Math.abs(p);
  if (q === 1) return `${s}${a === 1 && inner ? "" : a}${inner}`;
  return `${s}\\frac{${a === 1 && inner ? "" : a}${inner}}{${q}}`;
};

/**
 * Točna oblika števila v TeX (npr. \frac{1}{3}, \frac{\sqrt{3}}{2}, \frac{3\pi}{4}) ali null,
 * kadar je število celo ali točne oblike ne najdemo.
 */
/** Kot exactTex, a še z vrednostjo oblike (p/q, m√n/q, pπ/q kot število), da jo lahko preverimo v enačbi. */
export function exactForm(v) {
  const tex = exactTex(v);
  if (!tex) return null;
  const f = toFraction(v, 1000);
  if (f) return { tex, value: f.p / f.q };
  const sq = toFraction(v * v, 1000);
  if (sq && sq.p > 0 && sq.p * sq.q <= 1e6) return { tex, value: Math.sign(v) * Math.sqrt(sq.p / sq.q) };
  const pi = toFraction(v / Math.PI, 24);
  return pi ? { tex, value: (pi.p * Math.PI) / pi.q } : null;
}
export function exactTex(v) {
  if (!Number.isFinite(v) || Math.abs(v - Math.round(v)) < 1e-9 * Math.max(1, Math.abs(v)) || Math.abs(v) > 1e9 || Math.abs(v) < 1e-9) return null;
  const f = toFraction(v, 1000);
  if (f) return fracTex(f.p, f.q);
  // a√b / c
  const sq = toFraction(v * v, 1000);
  if (sq && sq.p > 0 && sq.p * sq.q <= 1e6) {
    let n = sq.p * sq.q; // v = √(p·q) / q
    let m = 1;
    for (let d = 2; d * d <= n; d++) {
      while (n % (d * d) === 0) {
        n /= d * d;
        m *= d;
      }
    }
    if (n > 1) {
      const g = gcd(m, sq.q);
      return fracTex((v < 0 ? -1 : 1) * (m / g), sq.q / g, `\\sqrt{${n}}`);
    }
  }
  // večkratnik π
  const pi = toFraction(v / Math.PI, 24);
  if (pi && Math.abs(pi.p) <= 100) return fracTex(pi.p, pi.q, "\\pi");
  return null;
}

// ---------- zapis števila ----------

/**
 * Število za prikaz. mode: "auto" | "sci" | "fix2" … "fix6" | "sig2" … "sig6".
 * Vrne { text, tex }; tex uporablja ·10^{n}.
 */
export function formatNumber(v, { mode = "auto", comma = true } = {}) {
  if (Number.isNaN(v)) return { text: "—", tex: "\\text{—}", nan: true };
  if (!Number.isFinite(v)) return { text: v > 0 ? "∞" : "−∞", tex: v > 0 ? "\\infty" : "-\\infty" };
  const dec = (s) => (comma ? s.replace(".", ",") : s);
  // v TeX-u mora biti decimalna vejica v {,}, sicer KaTeX za njo doda presledek
  const texDec = (s) => (comma ? s.replace(".", "{,}") : s);
  const sci = (digits) => {
    const [m, e] = v.toExponential(digits).split("e");
    const mm = mode === "auto" ? String(Number(m)) : m;
    const n = Number(e);
    return { text: `${dec(mm)} · 10^${n}`.replace(/^-/, "−"), tex: `${texDec(mm)}\\cdot 10^{${n}}` };
  };
  const plain = (s) => ({ text: dec(s).replace(/^-/, "−"), tex: texDec(s) });
  if (Object.is(v, -0)) v = 0;
  const a = Math.abs(v);
  let m;
  if ((m = /^fix(\d)$/.exec(mode))) {
    if (a >= 1e15) return sci(Number(m[1]));
    return plain(v.toFixed(Number(m[1])));
  }
  if ((m = /^sig(\d)$/.exec(mode))) {
    const d = Number(m[1]);
    if (a !== 0 && (a >= 10 ** Math.max(d, 6) || a < 1e-4)) return sci(d - 1);
    const p = v.toPrecision(d);
    return plain(/e/.test(p) ? String(Number(p)) : p);
  }
  if (mode === "eng") {
    // inženirski zapis: eksponent je večkratnik 3 (k, M, G … in m, μ, n …)
    if (a === 0) return plain("0");
    let e = Math.floor(Math.log10(a) / 3) * 3;
    let m = Number((v / 10 ** e).toPrecision(10));
    if (Math.abs(m) >= 1000) {
      e += 3;
      m = Number((v / 10 ** e).toPrecision(10));
    }
    if (e === 0) return plain(String(m));
    const ms = String(m);
    return { text: `${dec(ms)} · 10^${e}`.replace(/^-/, "−"), tex: `${texDec(ms)}\\cdot 10^{${e}}` };
  }
  if (mode === "sci") return a === 0 ? plain("0") : sci(Math.min(9, Math.max(0, String(Number(v.toPrecision(10))).replace(/[-.]|e.*$/g, "").replace(/^0+/, "").replace(/0+$/, "").length - 1)));
  if (a !== 0 && (a >= 1e12 || a < 1e-6)) return sci(9);
  let s = String(Number(v.toPrecision(12)));
  if (/e/.test(s)) return sci(9);
  return plain(s);
}

/**
 * Kot v stopinjah → stopinje, minute in sekunde (30,25556 → 30°15′20″), sekunde na dve decimalki.
 * Vrne { text, tex } ali null (ni število ali je preveliko).
 */
export function dmsOf(v, { comma = true } = {}) {
  if (!Number.isFinite(v) || Math.abs(v) >= 1e7) return null;
  let c = Math.round(Math.abs(v) * 360000); // v stotinkah sekunde
  const d = Math.floor(c / 360000);
  c -= d * 360000;
  const m = Math.floor(c / 6000);
  const sec = String((c - m * 6000) / 100);
  const neg = v < 0 && (d || m || sec !== "0");
  return {
    text: `${neg ? "−" : ""}${d}°${m}′${comma ? sec.replace(".", ",") : sec}″`,
    tex: `${neg ? "-" : ""}${d}^{\\circ}${m}^{\\prime}${comma ? sec.replace(".", "{,}") : sec}^{\\prime\\prime}`,
  };
}

/** Mešano število za nepravi ulomek (npr. 7/3 → 2\\tfrac{1}{3}) ali null. */
export function mixedTex(v) {
  const f = toFraction(v, 1000);
  if (!f || f.q === 1 || Math.abs(f.p) < f.q) return null;
  const whole = Math.floor(Math.abs(f.p) / f.q);
  return `${f.p < 0 ? "-" : ""}${whole}\\tfrac{${Math.abs(f.p) % f.q}}{${f.q}}`;
}

/** Razcep celega števila na prafaktorje: [[p, k], …] ali null (ni celo, je premajhno ali preveliko). */
export function primeFactors(v) {
  if (!Number.isInteger(v) || Math.abs(v) < 2 || Math.abs(v) > 1e12) return null;
  let n = Math.abs(v);
  const out = [];
  for (let p = 2; p * p <= n; p += p === 2 ? 1 : 2) {
    let k = 0;
    while (n % p === 0) {
      n /= p;
      k++;
    }
    if (k) out.push([p, k]);
  }
  if (n > 1) out.push([n, 1]);
  return out;
}
export const factorsTex = (v, f) => `${v < 0 ? "-" : ""}${f.map(([p, k]) => (k > 1 ? `${p}^{${k}}` : String(p))).join("\\cdot ")}`;

// ---------- konstante ----------
// Vrednosti CODATA 2018 (SI); »show« je zaokrožen zapis za seznam.
export const CONSTANTS = [
  { id: "g", sym: "g", value: 9.81, unit: "m/s^2" },
  { id: "c", sym: "c", value: 299792458, unit: "m/s" },
  { id: "G", sym: "G", value: 6.6743e-11, unit: "N\\,m^2/kg^2" },
  { id: "h", sym: "h", value: 6.62607015e-34, unit: "J\\,s" },
  { id: "e0", sym: "e_0", value: 1.602176634e-19, unit: "A\\,s" },
  { id: "me", sym: "m_e", value: 9.1093837015e-31, unit: "kg" },
  { id: "mp", sym: "m_p", value: 1.67262192369e-27, unit: "kg" },
  { id: "u", sym: "u", value: 1.6605390666e-27, unit: "kg" },
  { id: "NA", sym: "N_A", value: 6.02214076e23, unit: "mol^{-1}" },
  { id: "kB", sym: "k_B", value: 1.380649e-23, unit: "J/K" },
  { id: "R", sym: "R", value: 8.314462618, unit: "J/(mol\\,K)" },
  { id: "Vm", sym: "V_m", value: 22.413969545, unit: "L/mol" },
  { id: "eps0", sym: "\\varepsilon_0", value: 8.8541878128e-12, unit: "A\\,s/(V\\,m)" },
  { id: "mu0", sym: "\\mu_0", value: 1.25663706212e-6, unit: "V\\,s/(A\\,m)" },
  { id: "sigma", sym: "\\sigma", value: 5.670374419e-8, unit: "W/(m^2\\,K^4)" },
  { id: "p0", sym: "p_0", value: 101325, unit: "Pa" },
];

/** Konstanta kot besedilo za vnos (npr. »6,62607015E-34«). */
export function constantText(c, comma = true) {
  const s = Math.abs(c.value) >= 1e6 || Math.abs(c.value) < 1e-3 ? c.value.toExponential().replace("e+", "E").replace("e", "E") : String(c.value);
  return comma ? s.replace(".", ",") : s;
}

// ---------- enote ----------
// f: faktor do osnovne enote (prva v seznamu). Temperatura ima posebno pretvorbo.
export const QUANTITIES = [
  { id: "length", units: [["m", 1], ["km", 1e3], ["dm", 0.1], ["cm", 0.01], ["mm", 1e-3], ["μm", 1e-6], ["nm", 1e-9], ["mi", 1609.344], ["ft", 0.3048], ["in", 0.0254]] },
  { id: "area", units: [["m²", 1], ["km²", 1e6], ["ha", 1e4], ["a", 100], ["dm²", 1e-2], ["cm²", 1e-4], ["mm²", 1e-6]] },
  { id: "volume", units: [["m³", 1], ["dm³", 1e-3], ["L", 1e-3], ["hL", 0.1], ["dL", 1e-4], ["cL", 1e-5], ["mL", 1e-6], ["cm³", 1e-6], ["mm³", 1e-9]] },
  { id: "mass", units: [["kg", 1], ["t", 1e3], ["dag", 1e-2], ["g", 1e-3], ["mg", 1e-6], ["μg", 1e-9], ["lb", 0.45359237], ["oz", 0.028349523125]] },
  { id: "time", units: [["s", 1], ["ms", 1e-3], ["μs", 1e-6], ["min", 60], ["h", 3600], ["d", 86400]] },
  { id: "speed", units: [["m/s", 1], ["km/h", 1 / 3.6], ["km/s", 1e3], ["mph", 0.44704], ["kn", 1852 / 3600]] },
  { id: "force", units: [["N", 1], ["kN", 1e3], ["MN", 1e6], ["mN", 1e-3]] },
  { id: "pressure", units: [["Pa", 1], ["hPa", 100], ["kPa", 1e3], ["MPa", 1e6], ["bar", 1e5], ["mbar", 100], ["atm", 101325], ["mmHg", 133.322387415]] },
  { id: "energy", units: [["J", 1], ["kJ", 1e3], ["MJ", 1e6], ["Wh", 3600], ["kWh", 3.6e6], ["cal", 4.184], ["kcal", 4184], ["eV", 1.602176634e-19]] },
  { id: "power", units: [["W", 1], ["mW", 1e-3], ["kW", 1e3], ["MW", 1e6], ["KM", 735.49875]] },
  { id: "temperature", units: [["°C"], ["K"], ["°F"]] },
  { id: "density", units: [["kg/m³", 1], ["g/cm³", 1e3], ["kg/dm³", 1e3], ["g/L", 1]] },
  { id: "charge", units: [["C", 1], ["mC", 1e-3], ["μC", 1e-6], ["As", 1], ["mAh", 3.6], ["Ah", 3600]] },
  { id: "amount", units: [["mol", 1], ["mmol", 1e-3], ["kmol", 1e3]] },
  { id: "angle", units: [["°", Math.PI / 180], ["rad", 1], ["′", Math.PI / 10800], ["″", Math.PI / 648000], ["obr", 2 * Math.PI]] },
];

const toKelvin = { "°C": (v) => v + 273.15, K: (v) => v, "°F": (v) => ((v - 32) * 5) / 9 + 273.15 };
const fromKelvin = { "°C": (v) => v - 273.15, K: (v) => v, "°F": (v) => ((v - 273.15) * 9) / 5 + 32 };

/** Pretvori vrednost med enotama iste količine. */
export function convert(value, quantity, from, to) {
  const q = QUANTITIES.find((x) => x.id === quantity);
  if (!q || !Number.isFinite(value)) return NaN;
  if (quantity === "temperature") return toKelvin[from] && fromKelvin[to] ? fromKelvin[to](toKelvin[from](value)) : NaN;
  const a = q.units.find((u) => u[0] === from);
  const b = q.units.find((u) => u[0] === to);
  if (!a || !b) return NaN;
  // zaokrožimo šum (0,1 · 3 = 0,30000000000000004)
  return Number(((value * a[1]) / b[1]).toPrecision(14));
}

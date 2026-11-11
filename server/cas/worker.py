# Evklid – preverjanje s pravim računalniškim algebrskim sistemom (SymPy).
# Teče kot dolgoživ proces ob strežniku (server/cas.js): ena vrstica JSON noter, ena ven.
#   noter: {"id": 1, "op": "solve", "args": ["x^2-5*x+6=0", "x", "2, 3"]}
#   ven:   {"id": 1, "ok": true}  |  {"id": 1, "ok": false, "why": "..."}  |  {"id": 1, "ok": null, "why": "..."}
# ok = null pomeni »koda tega ne zna preveriti« (ni napaka odgovora).
# Varnost: besedilo piše model, zato ga razčlenimo samo z belim seznamom imen (brez pik, podčrtajev, narekovajev),
# vsak ukaz ima časovno omejitev (SIGALRM) in proces omejen pomnilnik.
import json
import re
import signal
import sys
import random

try:
    import resource

    resource.setrlimit(resource.RLIMIT_AS, (1024 * 1024 * 1024, 1024 * 1024 * 1024))
except Exception:
    pass

import sympy as sp
from sympy.parsing.sympy_parser import (
    parse_expr,
    standard_transformations,
    implicit_multiplication,
    convert_xor,
)
from sympy.physics import units as U

TIME_LIMIT = 6  # sekund na ukaz
TRANSFORMS = standard_transformations + (implicit_multiplication, convert_xor)


class Unsure(Exception):
    """Koda tega ne zna zanesljivo preveriti (ok = null)."""


class Timeout(Exception):
    pass


def _alarm(signum, frame):
    raise Timeout()


signal.signal(signal.SIGALRM, _alarm)

# ---------------------------------------------------------------------------
# Razčlenjevanje z belim seznamom

M = sp.Matrix


def _det(m):
    return sp.Matrix(m).det()


def _inv(m):
    return sp.Matrix(m).inv()


def _tr(m):
    return sp.Matrix(m).T


def _rank(m):
    return sp.Integer(sp.Matrix(m).rank())


def _logb(x, b=None):
    return sp.log(x) if b is None else sp.log(x, b)


FUNCS = {
    "sqrt": sp.sqrt, "root": sp.root, "cbrt": sp.cbrt, "exp": sp.exp, "ln": sp.log, "log": _logb,
    "lg": lambda x: sp.log(x, 10), "log10": lambda x: sp.log(x, 10), "log2": lambda x: sp.log(x, 2),
    "sin": sp.sin, "cos": sp.cos, "tan": sp.tan, "cot": sp.cot, "sec": sp.sec, "csc": sp.csc,
    "asin": sp.asin, "acos": sp.acos, "atan": sp.atan, "acot": sp.acot, "arcsin": sp.asin, "arccos": sp.acos,
    "arctan": sp.atan, "arccot": sp.acot, "atan2": sp.atan2,
    "sinh": sp.sinh, "cosh": sp.cosh, "tanh": sp.tanh, "coth": sp.coth, "asinh": sp.asinh, "acosh": sp.acosh, "atanh": sp.atanh,
    "abs": sp.Abs, "Abs": sp.Abs, "sign": sp.sign, "floor": sp.floor, "ceil": sp.ceiling, "ceiling": sp.ceiling,
    "factorial": sp.factorial, "binomial": sp.binomial, "gcd": sp.gcd, "lcm": sp.lcm,
    "re": sp.re, "im": sp.im, "conjugate": sp.conjugate, "arg": sp.arg,
    "Matrix": M, "det": _det, "inv": _inv, "transpose": _tr, "rank": _rank,
    "summation": sp.summation, "Sum": sp.summation, "product": sp.product,
    "Integral": lambda *a: sp.integrate(*a), "integrate": sp.integrate, "diff": sp.diff, "limit": sp.limit,
    "Rational": sp.Rational, "mod": sp.Mod, "Mod": sp.Mod, "max": sp.Max, "min": sp.Min, "Max": sp.Max, "Min": sp.Min,
    "deg": lambda x: x * sp.pi / 180,
}
CONSTS = {"pi": sp.pi, "e": sp.E, "E": sp.E, "i": sp.I, "I": sp.I, "oo": sp.oo, "inf": sp.oo, "infty": sp.oo}
GREEK = "alpha beta gamma delta epsilon zeta eta theta iota kappa lamda mu nu xi omicron rho sigma tau upsilon phi chi psi omega".split()

UNITS = {
    "m": U.meter, "cm": U.centimeter, "mm": U.millimeter, "km": U.kilometer, "um": U.micrometer, "nm": U.nanometer, "dm": U.meter / 10,
    "g": U.gram, "kg": U.kilogram, "mg": U.milligram, "t": 1000 * U.kilogram,
    "s": U.second, "ms": U.millisecond, "us": U.microsecond, "ns": U.nanosecond, "min": U.minute, "h": U.hour, "d": U.day,
    "N": U.newton, "kN": 1000 * U.newton, "J": U.joule, "kJ": 1000 * U.joule, "MJ": 10**6 * U.joule, "eV": U.electronvolt,
    "W": U.watt, "kW": 1000 * U.watt, "MW": 10**6 * U.watt, "Wh": U.watt * U.hour, "kWh": 1000 * U.watt * U.hour,
    "Pa": U.pascal, "kPa": U.kilo * U.pascal, "MPa": U.mega * U.pascal, "hPa": 100 * U.pascal, "bar": U.bar, "atm": U.atmosphere,
    "V": U.volt, "kV": 1000 * U.volt, "mV": U.volt / 1000, "A": U.ampere, "mA": U.ampere / 1000, "kA": 1000 * U.ampere,
    "ohm": U.ohm, "Ohm": U.ohm, "kohm": 1000 * U.ohm, "Mohm": 10**6 * U.ohm,
    "C": U.coulomb, "mC": U.coulomb / 1000, "uC": U.coulomb / 10**6, "nC": U.coulomb / 10**9,
    "F": U.farad, "uF": U.farad / 10**6, "nF": U.farad / 10**9, "pF": U.farad / 10**12,
    "T": U.tesla, "mT": U.tesla / 1000, "Wb": U.weber, "H": U.henry, "mH": U.henry / 1000,
    "Hz": U.hertz, "kHz": 1000 * U.hertz, "MHz": 10**6 * U.hertz, "GHz": 10**9 * U.hertz,
    "K": U.kelvin, "mol": U.mole, "mmol": U.mole / 1000, "L": U.liter, "l": U.liter, "mL": U.milliliter, "ml": U.milliliter, "dL": U.liter / 10,
    "rad": sp.Integer(1), "Bq": U.becquerel, "Gy": U.gray, "Sv": U.gray, "cd": U.candela, "lm": U.candela, "lx": U.candela / U.meter**2,
    "ly": U.lightyear, "au": U.astronomical_unit, "AU": U.astronomical_unit,
}

IDENT = re.compile(r"[A-Za-z][A-Za-z0-9]*")
BAD = re.compile(r"__|['\"\\`;]|\.(?!\d)|(?<!\d)\.|\blambda\b|\bimport\b")


def clean(text):
    s = str(text).strip()
    s = (
        s.replace("−", "-").replace("–", "-").replace("·", "*").replace("×", "*").replace("÷", "/").replace("⋅", "*")
        .replace("π", "pi").replace("∞", "oo").replace("√", "sqrt").replace("²", "^2").replace("³", "^3").replace("°", "*pi/180")
        .replace("≤", "<=").replace("≥", ">=").replace("≠", "!=").replace("%", "*(1/100)")
    )
    s = re.sub(r"^\s*(?:≈|~|\\approx)\s*", "", s)
    s = re.sub(r"(?<=\d),(?=\d)", ".", s) if "," not in re.sub(r"(?<=\d),(?=\d)", "", s) else s
    return s


def parse(text, variables=None, units=False):
    s = clean(text)
    if not s or len(s) > 600:
        raise Unsure("prazen ali predolg izraz")
    if BAD.search(s) or not s.isascii():
        raise Unsure("nedovoljen znak")
    local = dict(CONSTS)
    local.update(FUNCS)
    if units:
        local.update(UNITS)
    for name in set(IDENT.findall(s)):
        if name in local:
            continue
        if name in GREEK or len(name) <= 2 or name in (variables or ()):
            local[name] = sp.Symbol(name, real=True) if name not in ("z", "w") else sp.Symbol(name)
            continue
        raise Unsure(f"neznano ime {name}")
    if units:
        # enote: brez implicitnega množenja imen (»kg« ni »k·g«)
        return parse_expr(s, local_dict=local, global_dict={"__builtins__": {}, **_base_globals()}, transformations=standard_transformations + (convert_xor,), evaluate=True)
    return parse_expr(s, local_dict=local, global_dict={"__builtins__": {}, **_base_globals()}, transformations=TRANSFORMS, evaluate=True)


def _base_globals():
    # parse_expr potrebuje osnovne razrede SymPy (Integer, Symbol …), ki jih ustvari tokenizator.
    return {k: getattr(sp, k) for k in ("Integer", "Float", "Rational", "Symbol", "Function", "I", "Lambda", "Tuple", "Eq")}


def split_top(s, seps=","):
    out, depth, cur = [], 0, ""
    for ch in s:
        if ch in "([{":
            depth += 1
        elif ch in ")]}":
            depth -= 1
        if ch in seps and depth == 0:
            out.append(cur)
            cur = ""
        else:
            cur += ch
    out.append(cur)
    return [x.strip() for x in out if x.strip()]


def equation(text, variables=None):
    s = clean(text)
    if s.count("=") != 1 or any(op in s for op in ("<=", ">=", "!=")):
        raise Unsure("ni enačba")
    a, b = s.split("=")
    return parse(a, variables) - parse(b, variables)


# ---------------------------------------------------------------------------
# Primerjave

def is_zero(expr, syms=None):
    """True/False/None: ali je izraz enak 0 (simbolno, nato v naključnih točkah)."""
    expr = sp.sympify(expr)
    if isinstance(expr, sp.MatrixBase):
        vals = [is_zero(v, syms) for v in expr]
        if any(v is False for v in vals):
            return False
        return None if any(v is None for v in vals) else True
    try:
        z = sp.simplify(expr)
        if z == 0:
            return True
        if z.is_number:
            v = complex(sp.N(z, 30))
            return abs(v) < 1e-12
    except Timeout:
        raise
    except Exception:
        pass
    free = sorted(expr.free_symbols, key=str)
    r = _sample_zero(expr, free, 0)
    if r is False and free:
        # pravilo, ki velja samo za pozitivne vrednosti (ln(a*b) = ln a + ln b, sqrt(a*b) …): ne vemo
        return None if _sample_zero(expr, free, 1) else False
    return r


def _sample_zero(expr, free, lo):
    rng = random.Random(7)
    good = bad = 0
    for _ in range(40):
        pt = {s: sp.Rational(rng.randint(lo or -300, 300), rng.randint(7, 97)) for s in free}
        try:
            v = complex(sp.N(expr.subs(pt), 25))
        except Exception:
            continue
        if v != v or abs(v) == float("inf"):
            continue
        scale = 1.0
        try:
            scale = max(1.0, max(abs(complex(sp.N(a.subs(pt)))) for a in sp.Add.make_args(expr)))
        except Exception:
            pass
        if abs(v) <= 1e-9 * scale:
            good += 1
        else:
            bad += 1
        if good >= 8 or bad:
            break
    if bad:
        return False
    return True if good >= 5 else None


NUM_RE = re.compile(r"(\d+)(?:\.(\d+))?(?:\s*\*\s*10\s*\^\s*\(?\s*([-+]?\d+)\s*\)?|[eE]([-+]?\d+))?")
APPROX = re.compile(r"^\s*(?:≈|~|\\approx)")


def lead_number(text):
    """Prvo število v zapisu skupaj z eksponentom (2.0*10^3 → 2000.0) ali None."""
    m = NUM_RE.search(clean(text))
    if not m:
        return None
    return float(m.group(1) + "." + (m.group(2) or "0")) * 10 ** int(m.group(3) or m.group(4) or 0)


def decimals_tol(text):
    """Dovoljeno odstopanje zaradi zaokroževanja: pol enote zadnjega zapisanega mesta (tudi »≈ 1629«)."""
    m = NUM_RE.search(clean(text))
    if not m or not (APPROX.match(str(text)) or re.search(r"\d\.\d|\d[eE]|\*\s*10\s*\^", clean(text))):
        return None
    dec = len(m.group(2) or "")
    exp = int(m.group(3) or m.group(4) or 0)
    return 0.5 * 10 ** (exp - dec) * 1.0001


def same_value(exact, claimed_text, variables=None):
    claimed = parse(claimed_text, variables)
    d = is_zero(exact - claimed)
    if d:
        return True
    tol = decimals_tol(claimed_text)
    try:
        ev, cv = complex(sp.N(exact, 30)), complex(sp.N(claimed, 30))
    except Exception:
        return d
    if tol is None:
        # celo število ali ulomek brez decimalk: zaokroženo na celo je dovoljeno samo, če je napisano »≈«;
        # brez »≈« in za manj kot pol enote ne vemo, ali je mišljeno zaokroženo (ni napaka, ni potrjeno)
        if d is None and abs(ev - cv) <= 1e-9 * max(1, abs(ev)):
            return True
        if abs(ev - cv) <= 0.5 and abs(cv.imag) < 1e-12 and float(cv.real).is_integer() and abs(ev) >= 10:
            return None
        return False
    return abs(ev - cv) <= tol + 1e-12 * max(1, abs(ev))


# ---------------------------------------------------------------------------
# Ukazi

def syms_of(text):
    names = [n for n in split_top(text) if n]
    if not names or any(not re.fullmatch(r"[A-Za-z][A-Za-z0-9]{0,6}", n) for n in names):
        raise Unsure("neznanke")
    return [sp.Symbol(n, real=True) if n not in ("z", "w") else sp.Symbol(n) for n in names]


EMPTY = re.compile(r"^\s*(\{\s*\}|∅|none|ni|ni rešitve|no solution|empty|emptyset)\s*$", re.I)
ALL = re.compile(r"^\s*(all|R|reals|vsa realna števila|vsa števila)\s*$", re.I)


def op_solve(eq_text, var_text, claim_text):
    """Rešitve enačbe ali sistema. Trditev: »2, 3« | »x=2, y=1« | »pi/6 + 2*k*pi, 5*pi/6 + 2*k*pi« | »none« | »all«."""
    vs = syms_of(var_text)
    names = [str(v) for v in vs]
    eqs = [equation(e, names) for e in split_top(eq_text)]
    eqs = [e.subs({sp.Symbol(str(v), real=True): v for v in vs}) for e in eqs]
    if len(vs) == 1 and len(eqs) == 1:
        return solve_one(eqs[0], vs[0], claim_text, names)
    return solve_system(eqs, vs, claim_text, names)


def satisfies(e, pt):
    try:
        v = e.subs(pt)
        if v.has(sp.zoo, sp.nan):
            return False
        return is_zero(v)
    except Exception:
        return None


def _claim_list(claim_text):
    """»2, 3« | »x1=2; x2=-2« | »±sqrt(2)« → seznam zapisov posameznih rešitev."""
    out = []
    for c in split_top(claim_text, ",;"):
        c = (c.split("=", 1)[1] if "=" in c else c).strip().replace("\\pm", "±")
        if c.count("±") == 1:
            out += [c.replace("±", "+"), c.replace("±", "-")]
        else:
            out.append(c)
    return out


def _real_ok(e, x, v):
    """Pri x = v so vsi logaritmi in necele potence (korenine) realni (definicijsko območje v realnih številih)."""
    for a in e.atoms(sp.log, sp.Pow):
        if isinstance(a, sp.Pow) and (not a.exp.is_number or a.exp.is_integer):
            continue
        try:
            val = complex(sp.N(a.subs(x, v), 20))
        except Exception:
            continue
        if abs(val.imag) > 1e-12:
            return False
    return True


def _solutions(e, x, domain):
    """Množica rešitev (solveset); kadar je ne najde, še enkrat z združenimi logaritmi (nadmnožica, nato filter)."""
    try:
        s = sp.solveset(e, x, domain)
    except Timeout:
        raise
    except Exception:
        s = None
    if (s is None or isinstance(s, sp.ConditionSet)) and e.has(sp.log):
        # log(x, 2) = log(x)/log(2): pomnožimo s konstantnimi logaritmi (rešitve ostanejo iste)
        base = sp.Mul(*[a for a in e.atoms(sp.log) if a.args[0].is_number and a.args[0] != 1])
        try:
            s = sp.solveset(sp.logcombine(sp.expand(sp.expand_log(e, force=True) * base), force=True), x, domain)
        except Timeout:
            raise
        except Exception:
            s = None
    return s


def solve_one(e, x, claim_text, names):
    domain = sp.S.Complexes if not x.is_real else sp.S.Reals
    real = domain == sp.S.Reals
    if EMPTY.match(claim_text):
        claimed = []
    elif ALL.match(claim_text):
        s = sp.solveset(e, x, domain)
        if s == domain:
            return True, ""
        return False, f"ni vsako število rešitev ({s})"
    else:
        claimed = _claim_list(claim_text)
    k = sp.Symbol("k", integer=True)
    exprs = [parse(c, names + ["k", "n"]).subs({sp.Symbol("k", real=True): k, sp.Symbol("n", real=True): k, sp.Symbol(str(x), real=True): x}) for c in claimed]
    # 1. vsaka trditev mora rešiti enačbo (pri družinah za k = −2 … 2); zaokrožene (decimalke) primerjamo spodaj
    approx = []
    for c, ex in zip(claimed, exprs):
        tol = decimals_tol(c)
        ks = [-2, -1, 0, 1, 2] if ex.has(k) else [0]
        for kv in ks:
            v = ex.subs(k, kv)
            r = satisfies(e, {x: v})
            if r is True and real and not _real_ok(e, x, v):
                r = False
            if r is False and tol is not None:
                approx.append((c, ex, tol))
                break
            if r is False:
                return False, f"{c} ni rešitev"
            if r is None:
                raise Unsure(f"ne znam vstaviti {c}")

    def ok_found(f):
        return satisfies(e, {x: f}) is not False and (not real or _real_ok(e, x, f))

    def near(f, ex, tol):
        try:
            fv = complex(sp.N(f))
            return any(abs(fv - complex(sp.N(ex.subs(k, kv)))) <= tol + 1e-12 for kv in (range(-12, 13) if ex.has(k) else [0]))
        except Exception:
            return False

    def covered(f):
        for c, ex in zip(claimed, exprs):
            tol = next((a[2] for a in approx if a[1] is ex), None)
            if tol is not None:
                if near(f, ex, tol):
                    return True
            elif ex.has(k):
                if _in_family(f, ex, k):
                    return True
            elif is_zero(f - ex):
                return True
        return False

    def approx_hit(found):
        for c, ex, tol in approx:
            if not any(near(f, ex.subs(k, 0), tol) for f in found):
                return c
        return None

    # 2. nobena rešitev ne sme manjkati
    s = _solutions(e, x, domain)
    if s is None or isinstance(s, (sp.ConditionSet,)):
        raise Unsure("reševalnik ne najde vseh rešitev")
    if s.is_FiniteSet or s == sp.S.EmptySet:
        found = [f for f in s if ok_found(f)]
        bad = approx_hit(found)
        if bad:
            return False, f"{bad} ni rešitev"
        if not found:
            return (True, "") if not exprs else (False, "enačba nima rešitev")
        for f in found:
            if not covered(f):
                return False, f"manjka rešitev {sp.sstr(f)}"
        return True, ""
    # neskončno rešitev (npr. kotne funkcije): vse v [−20, 20] morajo biti v trditvah
    try:
        part = sp.solveset(e, x, sp.Interval(-20, 20)) if real else None
    except Exception:
        part = None
    if part is None or not part.is_FiniteSet:
        raise Unsure("neskončna množica rešitev")
    found = [f for f in part if ok_found(f)]
    bad = approx_hit(found)
    if bad:
        return False, f"{bad} ni rešitev"
    for f in found:
        if not covered(f):
            return False, f"manjka rešitev {sp.sstr(f)}"
    return True, ""


def _in_family(f, ex, k):
    fv = complex(sp.N(f))
    for kv in range(-12, 13):
        try:
            if abs(complex(sp.N(ex.subs(k, kv))) - fv) < 1e-9:
                return True
        except Exception:
            pass
    return False


def _point(text, vs, names):
    pt, tol = {}, {}
    for p in split_top(text, ",;"):
        if "=" not in p:
            raise Unsure("rešitev sistema zapiši kot x=…, y=…")
        a, b = p.split("=", 1)
        a = a.strip().strip("()")
        sym = next((v for v in vs if str(v) == a), None)
        if sym is None:
            raise Unsure(f"neznanka {a}")
        pt[sym] = parse(b, names)
        tol[sym] = decimals_tol(b)
    if set(pt) != set(vs):
        raise Unsure("rešitev sistema nima vseh neznank")
    return pt, tol


def solve_system(eqs, vs, claim_text, names):
    if EMPTY.match(claim_text):
        s = sp.solve(eqs, vs, dict=True)
        return (True, "") if not s else (False, f"sistem ima rešitev {s[0]}")
    # več rešitev: »x=3, y=4; x=4, y=3«
    chunks = split_top(claim_text, ";")
    if len(chunks) > 1 and all(all(re.search(r"(?<![A-Za-z0-9])%s\s*=" % re.escape(str(v)), ch) for v in vs) for ch in chunks):
        groups = chunks
    else:
        groups = [claim_text]
    points = [_point(re.sub(r"^\((.*)\)$", r"\1", g.strip()), vs, names) for g in groups]
    exact, approx = [], []
    for pt, tol in points:
        rs = [satisfies(e, pt) for e in eqs]
        if all(r is True for r in rs):
            exact.append(pt)
        elif any(r is False for r in rs) and all(t is not None or pt[v].is_Rational for v, t in tol.items()) and any(t is not None for t in tol.values()):
            approx.append((pt, tol))
        elif any(r is False for r in rs):
            return False, "rešitev ne zadošča vsem enačbam"
        else:
            raise Unsure("ne znam vstaviti")
    sols = sp.solve(eqs, vs, dict=True)
    if not sols:
        raise Unsure("reševalnik ne najde rešitev")
    vset = set(vs)
    param = any(set(s) != vset or any(val.free_symbols & vset for val in s.values()) for s in sols)
    claimed_param = any(val.free_symbols for pt in exact for val in pt.values())
    if param:
        if claimed_param and not approx:
            return True, ""
        return False, "sistem ima neskončno rešitev"
    if claimed_param:
        raise Unsure("rešitev s parametrom")

    def close(s, pt, tol):
        try:
            return all(abs(complex(sp.N(s[v])) - complex(sp.N(pt[v]))) <= (tol[v] or 1e-9) + 1e-12 for v in vs)
        except Exception:
            return False

    for pt, tol in approx:
        if not any(close(s, pt, tol) for s in sols):
            return False, "rešitev ne zadošča vsem enačbam"
    for s in sols:
        if not any(all(is_zero(s[v] - pt[v]) for v in vs) for pt in exact) and not any(close(s, pt, tol) for pt, tol in approx):
            return False, f"manjka rešitev {', '.join(f'{v}={sp.sstr(s[v])}' for v in vs)}"
    return True, ""


def op_equal(a, b, *rest):
    ea, eb = parse(a), parse(b)
    r = is_zero(ea - eb)
    if r is None:
        raise Unsure("enakosti ne znam potrditi")
    return r, "" if r else "izraza nista enaka"


def op_diff(f, var, claimed, order="1"):
    x = syms_of(var)[0]
    n = int(order) if str(order).strip().isdigit() else 1
    d = sp.diff(parse(f, [str(x)]), x, n)
    r = is_zero(d - parse(claimed, [str(x)]))
    if r is None:
        raise Unsure("odvoda ne znam potrditi")
    return r, "" if r else f"odvod je {sp.sstr(sp.simplify(d))}"


def op_int(f, var, *rest):
    x = syms_of(var)[0]
    fe = parse(f, [str(x)])
    if len(rest) == 1:  # nedoločeni: odvod trditve mora biti f (konstanta je poljubna)
        F = parse(rest[0], [str(x)])
        F = F.subs(sp.Symbol("C", real=True), 0).subs(sp.Symbol("K", real=True), 0)
        r = is_zero(sp.diff(F, x) - fe)
        if r is None:
            raise Unsure("integrala ne znam potrditi")
        return r, "" if r else "odvod nedoločenega integrala ni enak funkciji"
    if len(rest) == 3:
        a, b = parse(rest[0]), parse(rest[1])
        val = sp.integrate(fe, (x, a, b))
        if val.has(sp.Integral):
            val = sp.Integral(fe, (x, a, b)).evalf(30)
        ok = same_value(val, rest[2])
        if ok is None:
            raise Unsure("vrednosti ne znam primerjati")
        return ok, "" if ok else f"integral je {sp.sstr(val)} ≈ {float(sp.N(val)):.6g}"
    raise Unsure("integral: f | x | F  ali  f | x | a | b | vrednost")


def op_limit(f, var, point, claimed):
    x = syms_of(var)[0]
    p = clean(point)
    d = "+-"
    if p.endswith("+") or p.endswith("-"):
        d, p = p[-1], p[:-1]
    val = sp.limit(parse(f, [str(x)]), x, parse(p), d) if d in "+-" and len(d) == 1 else sp.limit(parse(f, [str(x)]), x, parse(p), "+-")
    c = clean(claimed)
    if re.match(r"^\s*(ne obstaja|does not exist|dne|none)\s*$", c, re.I):
        ok = isinstance(val, sp.AccumBounds) or val.has(sp.zoo)
        return ok, "" if ok else f"limita je {sp.sstr(val)}"
    if val in (sp.oo, -sp.oo, sp.zoo) or parse(c) in (sp.oo, -sp.oo):
        ok = val == parse(c)
        return ok, "" if ok else f"limita je {sp.sstr(val)}"
    ok = same_value(val, claimed)
    if ok is None:
        raise Unsure("limite ne znam primerjati")
    return ok, "" if ok else f"limita je {sp.sstr(val)}"


def op_value(expr, claimed):
    e = parse(expr)
    if isinstance(e, sp.MatrixBase) or clean(claimed).startswith("Matrix"):
        c = parse(claimed)
        r = is_zero(sp.Matrix(e) - sp.Matrix(c))
        if r is None:
            raise Unsure("matrik ne znam primerjati")
        return r, "" if r else f"pravilno je {sp.sstr(e)}"
    if e.free_symbols:
        raise Unsure("izraz ima neznanke")
    ok = same_value(e, claimed)
    if ok is None:
        raise Unsure("vrednosti ne znam primerjati")
    return ok, "" if ok else f"pravilno je {sp.sstr(sp.nsimplify(e) if e.is_Float else e)} ≈ {complex(sp.N(e)).real:.6g}"


def op_ineq(text, var, claimed):
    x = syms_of(var)[0]
    s = clean(text)
    m = re.match(r"^(.*?)(<=|>=|<|>)(.*)$", s)
    if not m:
        raise Unsure("ni neenačba")
    rel = {"<": sp.Lt, ">": sp.Gt, "<=": sp.Le, ">=": sp.Ge}[m.group(2)]
    ineq = rel(parse(m.group(1), [str(x)]), parse(m.group(3), [str(x)]))
    truth = sp.solveset(ineq, x, sp.S.Reals)
    claim = parse_set(claimed, x)
    ok = truth == claim or sp.simplify(sp.Complement(truth, claim)) == sp.S.EmptySet and sp.simplify(sp.Complement(claim, truth)) == sp.S.EmptySet
    return ok, "" if ok else f"rešitev je {sp.sstr(truth)}"


def parse_set(text, x):
    s = clean(text).replace("∪", " U ").replace("\\cup", " U ")
    if EMPTY.match(s):
        return sp.S.EmptySet
    if ALL.match(s):
        return sp.S.Reals
    out = sp.S.EmptySet
    for part in re.split(r"\s+(?:U|or|ali)\s+", s):
        part = part.strip()
        m = re.match(r"^([\(\[])(.*),(.*)([\)\]])$", part)
        if m:
            a, b = parse(m.group(2)), parse(m.group(3))
            out = sp.Union(out, sp.Interval(a, b, m.group(1) == "(", m.group(4) == ")"))
            continue
        m = re.match(r"^(.*?)(<=|<)\s*%s\s*(<=|<)(.*)$" % re.escape(str(x)), part)
        if m:
            out = sp.Union(out, sp.Interval(parse(m.group(1)), parse(m.group(4)), m.group(2) == "<", m.group(3) == "<"))
            continue
        m = re.match(r"^%s\s*(<=|>=|<|>)(.*)$" % re.escape(str(x)), part)
        if m:
            v = parse(m.group(2))
            op = m.group(1)
            iv = sp.Interval(-sp.oo, v, True, op == "<") if op in ("<", "<=") else sp.Interval(v, sp.oo, op == ">", True)
            out = sp.Union(out, iv)
            continue
        if part.startswith("{") and part.endswith("}"):
            out = sp.Union(out, sp.FiniteSet(*[parse(p) for p in split_top(part[1:-1])]))
            continue
        raise Unsure("zapisa množice ne razumem")
    return out


def op_units(expr, claimed):
    """Fizikalni račun z enotami: »3.2*kg * 9.81*m/s^2 | 31.4*N«."""
    e, c = parse(expr, units=True), parse(claimed, units=True)
    base = [U.meter, U.kilogram, U.second, U.ampere, U.kelvin, U.mole, U.candela]
    eb, cb = U.convert_to(e, base), U.convert_to(c, base)
    ratio = sp.simplify(eb / cb)
    if ratio.free_symbols or ratio.atoms(U.Quantity):
        return False, "enoti se ne ujemata"
    tol = decimals_tol(claimed)
    rv = float(sp.N(ratio))
    cval = abs(lead_number(claimed) or 0)
    if tol is None:
        ok = abs(rv - 1) < 1e-9
        if not ok and cval >= 10 and float(cval).is_integer() and abs(rv - 1) * cval <= 0.5:
            raise Unsure("zaokroženo na celo brez »≈«")
    else:
        ok = cval > 0 and abs(rv - 1) * cval <= tol * 1.0001 + 1e-12
    return ok, "" if ok else f"vrednost se ne ujema (razmerje {rv:.6g})"


OPS = {"solve": op_solve, "equal": op_equal, "diff": op_diff, "int": op_int, "limit": op_limit, "value": op_value, "ineq": op_ineq, "units": op_units}


def handle(req):
    op = OPS.get(req.get("op"))
    if not op:
        return {"ok": None, "why": "neznan ukaz"}
    signal.alarm(TIME_LIMIT)
    try:
        ok, why = op(*[str(a) for a in req.get("args", [])])
        return {"ok": bool(ok), "why": why or ""}
    except Unsure as e:
        return {"ok": None, "why": str(e)}
    except Timeout:
        return {"ok": None, "why": "prepočasno"}
    except TypeError as e:
        return {"ok": None, "why": f"napačno število delov ({e})"[:200]}
    except Exception as e:
        return {"ok": None, "why": f"{type(e).__name__}: {e}"[:200]}
    finally:
        signal.alarm(0)


def main():
    sys.stdout.write(json.dumps({"ready": True, "sympy": sp.__version__}) + "\n")
    sys.stdout.flush()
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            req = json.loads(line)
        except Exception:
            continue
        out = handle(req)
        out["id"] = req.get("id")
        sys.stdout.write(json.dumps(out, ensure_ascii=False) + "\n")
        sys.stdout.flush()


if __name__ == "__main__":
    main()

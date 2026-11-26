# Evklid – preverjanje s pravim računalniškim algebrskim sistemom (SymPy).
# Teče kot dolgoživ proces ob strežniku (server/cas.js): ena vrstica JSON noter, ena ven.
#   noter: {"id": 1, "op": "solve", "args": ["x^2-5*x+6=0", "x", "2, 3"]}
#   ven:   {"id": 1, "ok": true}  |  {"id": 1, "ok": false, "why": "..."}  |  {"id": 1, "ok": null, "why": "..."}
# ok = null pomeni »koda tega ne zna preveriti« (ni napaka odgovora).
# how (PV-03, docs/preverjanje.md): najšibkejši način, ki ga je ukaz uporabil: »symbolic« (simbolni račun),
# »numeric« (število na 30 mest, toleranca zapisa, popolnost samo na odseku) ali »sampled« (naključne točke).
# Varnost: besedilo piše model, zato ga razčlenimo samo z belim seznamom imen (brez pik, podčrtajev, narekovajev),
# vsak ukaz ima časovno omejitev (SIGALRM) in proces omejen pomnilnik.
import json
import re
import signal
import sys
import time
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

# Način preverjanja trenutnega ukaza (handle ga ponastavi): velja najšibkejši uporabljeni.
_NACINI = {"symbolic": 2, "numeric": 1, "sampled": 0}
_nacin = ["symbolic"]


def oslabi(nacin):
    if _NACINI[nacin] < _NACINI[_nacin[0]]:
        _nacin[0] = nacin
TRANSFORMS = standard_transformations + (implicit_multiplication, convert_xor)


class Unsure(Exception):
    """Koda tega ne zna zanesljivo preveriti (ok = null)."""


class Timeout(BaseException):
    """BaseException, da ga širok »except Exception« v SymPy ne pogoltne (pregled PV-03: ukaz je tekel do 58 s)."""


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


def _logb(x, b=None, **_):
    return sp.log(x) if b is None else sp.log(x, b)


FUNCS = {
    "sqrt": sp.sqrt, "root": sp.root, "cbrt": sp.cbrt, "exp": sp.exp, "ln": sp.log, "log": _logb,
    "lg": lambda x, **_: sp.log(x, 10), "log10": lambda x, **_: sp.log(x, 10), "log2": lambda x, **_: sp.log(x, 2),
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
    "deg": lambda x, **_: x * sp.pi / 180,
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
    "rad": sp.Integer(1), "percent": U.percent, "Bq": U.becquerel, "Gy": U.gray, "Sv": U.gray, "cd": U.candela, "lm": U.candela, "lx": U.candela / U.meter**2,
    "ly": U.lightyear, "au": U.astronomical_unit, "AU": U.astronomical_unit,
}

IDENT = re.compile(r"[A-Za-z][A-Za-z0-9]*")
BAD = re.compile(r"__|['\"\\`;]|\.(?!\d)|(?<!\d)\.|\blambda\b|\bimport\b")


DVA_ARG = re.compile(r"(?<![A-Za-z])(?:log|root|atan2|binomial|gcd|lcm|mod|Mod|max|min|Max|Min|Rational)\s*\(")


def _decimalna_vejica(s):
    """1,5 → 1.5, kadar v besedilu ni drugih vejic. Vejica, ki loči argumenta funkcije z dvema argumentoma
    (log(x-2,2), root(8,3)), ostane ločilo (pregled PV-06: log(x-2,2) je bil prej ln(x - 2.2))."""
    zasc = set()
    for m in DVA_ARG.finditer(s):
        globina = 0
        for i in range(m.end() - 1, len(s)):
            if s[i] in "([{":
                globina += 1
            elif s[i] in ")]}":
                globina -= 1
                if globina == 0:
                    break
            elif s[i] == "," and globina == 1:
                zasc.add(i)
    t = "".join("\0" if i in zasc else c for i, c in enumerate(s))
    t = re.sub(r"(?<=\d),(?=\d)", ".", t) if "," not in re.sub(r"(?<=\d),(?=\d)", "", t) else t
    return t.replace("\0", ",")


def clean(text):
    s = str(text).strip()
    s = (
        s.replace("−", "-").replace("–", "-").replace("·", "*").replace("×", "*").replace("÷", "/").replace("⋅", "*")
        .replace("π", "pi").replace("∞", "oo").replace("√", "sqrt").replace("²", "^2").replace("³", "^3").replace("°", "*pi/180")
        .replace("≤", "<=").replace("≥", ">=").replace("≠", "!=").replace("%", "*(1/100)")
    )
    s = re.sub(r"^\s*(?:≈|~|\\approx)\s*", "", s)
    return _decimalna_vejica(s)


def parse(text, variables=None, units=False, evaluate=True):
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
    # evaluate=False (PV-06, definicijsko območje pred okrajšanjem): koda uporabi še Add/Mul/Pow; uporabnik jih ne more
    # poklicati, ker imena, daljša od dveh črk, niso na belem seznamu (zgoraj)
    g = {"__builtins__": {}, **_base_globals(), **({} if evaluate else {"Add": sp.Add, "Mul": sp.Mul, "Pow": sp.Pow})}
    return parse_expr(s, local_dict=local, global_dict=g, transformations=TRANSFORMS, evaluate=evaluate)


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
    z = None
    try:
        z = sp.simplify(expr)
        if _je_nic(z):
            return True
        if z.is_number:
            if not z.atoms(sp.Float) and z.is_zero is not None:
                return bool(z.is_zero)  # točna števila: SymPy odloči simbolno (npr. 2 − 3 ≠ 0); decimalke ostanejo številske
            if not z.atoms(sp.Float) and _simbolno_nic(z):
                return True
            oslabi("numeric")
            v = complex(sp.N(z, 30))
            return abs(v) < 1e-12
    except Timeout:
        raise
    except Exception:
        pass
    free = sorted(expr.free_symbols, key=str)
    r = _sample_zero(expr, free, 0)
    if r is True and z is not None and not expr.atoms(sp.Float) and _simbolno_nic(z):
        return True  # točke so rekle 0, simbolni prepis to tudi dokaže
    oslabi("sampled" if free else "numeric")
    if r is False and free:
        # pravilo, ki velja samo za pozitivne vrednosti (ln(a*b) = ln a + ln b, sqrt(a*b) …): ne vemo
        return None if _sample_zero(expr, free, 1) else False
    return r


def _racionalno(e):
    """Vsako decimalko zamenja z ulomkom njenega desetiškega zapisa (0.1 → 1/10)."""
    return e.xreplace({f: sp.Rational(str(f)) for f in e.atoms(sp.Float)})


def _je_nic(z):
    """0 ali Piecewise, ki je 0 povsod razen v posameznih točkah, kjer izraz ni definiran (nan/zoo pri Eq(x, a))."""
    if z == 0:
        return True
    if isinstance(z, sp.Piecewise):
        *luknje, (zadnji, pogoj) = z.args
        tocka = lambda c: isinstance(c, sp.Eq) and any(a.is_Symbol for a in c.args) and any(a.is_number for a in c.args)
        return zadnji == 0 and pogoj is sp.true and all(e in (sp.nan, sp.zoo) and tocka(c) for e, c in luknje)
    return False


def _koreni_razstavljeni(e):
    """sqrt(x² + 6x + 9) → sqrt((x + 3)²), da simplify najde |x + 3| (osnova se le razstavi, vrednost ostane ista)."""
    return e.replace(lambda a: a.is_Pow and not a.exp.is_Integer, lambda a: sp.Pow(sp.factor(a.base), a.exp))


def _simbolno_nic(z, meja=1.5):
    """Dodatni simbolni prepisi (expand_trig, rewrite(exp), razstavljeni koreni), ki jih simplify sam ne najde. Vsak ima svoj časovni
    rob, da počasen prepis ne pokvari celotnega ukaza; ob izteku vrne False (ostane številska pot)."""
    for prepis in (sp.expand_trig, lambda e: e.rewrite(sp.exp), _koreni_razstavljeni):
        ostane = signal.getitimer(signal.ITIMER_REAL)[0]
        if not ostane or ostane < meja + 1.5:
            return False  # handle vedno nastavi alarm: brez njega je čas ukaza že porabljen
        zacetek = time.monotonic()
        signal.setitimer(signal.ITIMER_REAL, meja)
        try:
            if _je_nic(sp.simplify(prepis(z))):
                return True
        except (Exception, Timeout):  # vključno z notranjim časovnim robom
            pass
        finally:
            signal.setitimer(signal.ITIMER_REAL, max(0.01, ostane - (time.monotonic() - zacetek)) if ostane else 0)
    return False


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
    oslabi("numeric")  # od tu naprej primerjamo števila (toleranca zapisa)
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
            im = sp.simplify(sp.im(a.subs(x, v)))
            if im == 0:
                continue  # realnost dokazana simbolno
        except Timeout:
            raise
        except Exception:
            pass
        oslabi("numeric")
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
    if (s is None or s.has(sp.ConditionSet)) and e.has(sp.log):
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
                oslabi("numeric")  # zaokrožena rešitev: sprejeta le s toleranco
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
    oslabi("numeric")  # popolnost periodičnih rešitev samo na [−20, 20]
    found = [f for f in part if ok_found(f)]
    bad = approx_hit(found)
    if bad:
        return False, f"{bad} ni rešitev"
    for f in found:
        if not covered(f):
            return False, f"manjka rešitev {sp.sstr(f)}"
    return True, ""


def _in_family(f, ex, k):
    oslabi("numeric")  # član družine iščemo s števili (k = −12 … 12)
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
    if any(e.atoms(sp.sin, sp.cos, sp.tan, sp.cot, sp.sec, sp.csc) for e in eqs):
        oslabi("numeric")  # sp.solve pri kotnih funkcijah vrne le glavne rešitve: popolnost ni dokazana
    vset = set(vs)
    param = any(set(s) != vset or any(val.free_symbols & vset for val in s.values()) for s in sols)
    claimed_param = any(val.free_symbols for pt in exact for val in pt.values())
    if param:
        if claimed_param and not approx:
            # Trditev z manj parametri kot rešitev (premica v ravnini) je le del množice rešitev (pregled #935).
            dim_s = max(len(vset - set(s)) for s in sols)
            dim_c = min(len(set().union(*(val.free_symbols for val in pt.values()))) for pt in exact)
            if dim_c < dim_s:
                return False, f"manjka rešitev (rešitev ima {dim_s} parametra, trditev {dim_c})"
            return True, ""
        return False, "sistem ima neskončno rešitev"
    if claimed_param:
        raise Unsure("rešitev s parametrom")

    def close(s, pt, tol):
        try:
            return all(abs(complex(sp.N(s[v])) - complex(sp.N(pt[v]))) <= (tol[v] or 1e-9) + 1e-12 for v in vs)
        except Exception:
            return False

    if approx:
        oslabi("numeric")
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
            oslabi("numeric")
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


DEC_LIT = re.compile(r"(?<![\w.])(\d+)\.(\d+)(?![\w.])")


def operand_rounding(expr_text):
    """Največje odstopanje vrednosti zaradi enega zaokroženega vmesnega rezultata v izrazu (meritev SŠ 18. 11.:
    »17.46*60.05 | 1048.6« je pravilno iz nezaokroženih 17,4626 mol, koda pa je dala lažen »Popravek«). Šteje le števila
    z vsaj 4 veljavnimi mesti (izpisani vmesni rezultati; podatki naloge imajo navadno 2–3): pol zadnjega mesta,
    razširjeno skozi izraz; največji prispevek enega števila, ne vsota (pregled PR #835)."""
    s = clean(expr_text)
    worst = 0.0
    for m in DEC_LIT.finditer(s):
        digits = (m.group(1) + m.group(2)).lstrip("0")
        if len(digits) < 4:
            continue
        h = 0.5 * 10 ** -len(m.group(2))
        try:
            hi = complex(sp.N(parse(s[: m.start()] + repr(float(m.group(0)) + h) + s[m.end():]), 30))
            lo = complex(sp.N(parse(s[: m.start()] + repr(float(m.group(0)) - h) + s[m.end():]), 30))
        except Exception:
            return 0.0
        worst = max(worst, abs(hi - lo) / 2)
    return worst


# Meje za odstopanje zaradi zaokroženih vmesnih rezultatov (pregled PR #835): odstopanje sme biti največ 0,1 % vrednosti
# (sicer je izraz občutljiv, npr. odštevanje skoraj enakih števil ali visoka potenca, in velja stroga primerjava), presežek
# nad zaokrožitvijo trditve pa največ 0,05 % vrednosti. Celoštevilska trditev (»1049«) ima zaokrožitev 0,5.
SLACK_MAX_REL = 1e-3
EXCESS_MAX_REL = 5e-4


def rounded_operands_ok(e, expr, claimed):
    """True, če se trditev od točne vrednosti razlikuje le zaradi zaokroženih vmesnih rezultatov v izrazu, sicer False."""
    try:
        ev = complex(sp.N(e, 30))
        cv = complex(sp.N(parse(claimed), 30))
    except Exception:
        return False
    if abs(ev.imag) > 1e-12 or abs(cv.imag) > 1e-12 or ev == 0:
        return False
    base = decimals_tol(claimed)
    if base is None:
        # kot same_value: zaokrožitev na celo le pri |vrednost| ≥ 10 (pregled #835: »2*3.1416 | 6« ni zaokrožitev)
        if not float(cv.real).is_integer() or abs(ev) < 10:
            return False
        base = 0.5
    slack = operand_rounding(expr)
    if not (0 < slack <= SLACK_MAX_REL * abs(ev)):
        return False
    diff = abs(ev - cv)
    return diff <= base + slack and diff - base <= EXCESS_MAX_REL * abs(ev)


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
    # Zaokroženi vmesni rezultati samo v mejah SLACK_MAX_REL in EXCESS_MAX_REL; zunaj njih ostane stroga sodba.
    if ok is not True and rounded_operands_ok(e, expr, claimed):
        oslabi("numeric")
        ok = True
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
    ineq = rel(_racionalno(parse(m.group(1), [str(x)])), _racionalno(parse(m.group(3), [str(x)])))
    truth = sp.solveset(ineq, x, sp.S.Reals)
    claim = parse_set(claimed, x)
    claim = _racionalno(claim)  # decimalke kot ulomki: meje intervalov primerjamo točno
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
    if ratio != 1:
        oslabi("numeric")  # razmerje vrednosti ni točno 1: primerjava števil
    rv = float(sp.N(ratio))
    cval = abs(lead_number(claimed) or 0)
    if tol is None:
        ok = abs(rv - 1) < 1e-9
        if not ok and cval >= 10 and float(cval).is_integer() and abs(rv - 1) * cval <= 0.5:
            raise Unsure("zaokroženo na celo brez »≈«")
    else:
        ok = cval > 0 and abs(rv - 1) * cval <= tol * 1.0001 + 1e-12
    return ok, "" if ok else f"vrednost se ne ujema (razmerje {rv:.6g})"


# ---------------------------------------------------------------------------
# PV-06: en korak reševanja (docs/preverjanje.md, »Preverjevalnik korakov«).
#   noter: {"op": "korak", "args": [prej, potem, neznanka?, območje?]}
#   prej, potem: enačba ali neenačba (več jih povežemo z »ali«: »x-1=0 ali x+2=0«) ali izraz brez relacije.
#   neznanka: prazno = edina spremenljivka v zapisu. Območje: »x>0«, »[0, 2*pi)« …; brez njega realna os.
#   ven: ok, why, how in vrsta:
#     ekvivalenca  enaka množica rešitev; pri izrazih enaka vrednost, kjer je prvotni izraz definiran   ok true
#     posledica    enačba ima vse prejšnje rešitve in še tuje (kvadriranje, množenje z izrazom): kandidate
#                  je treba preveriti v prvotni enačbi; why jih našteje                                ok true
#     izguba       manjkajo rešitve ali del območja (deljenje z izrazom, ki je lahko 0; ln(x²) → 2 ln x)  ok false
#     napaka       drugačna množica rešitev ali drugačna vrednost izraza                                ok false
# Definicijsko območje preberemo iz zapisa, preden SymPy kaj okrajša (x²/x → x izgubi pogoj x ≠ 0): imenovalci ≠ 0,
# argument logaritma > 0, pod sodim korenom ≥ 0, tan/cot definiran.

KREL = re.compile(r"(<=|>=|!=|=|<|>)")
KALI = re.compile(r"\s+(?:ali|or)\s+|∨|\\lor|\\vee")
KRELS = {"<": sp.Lt, ">": sp.Gt, "<=": sp.Le, ">=": sp.Ge}
KOBRNI = {"<": ">", ">": "<", "<=": ">=", ">=": "<="}
KOBMOCJE = sp.Interval(-20, 20)


def _crke(s):
    """V koraku je »2ab« produkt (parse bi »ab« prebral kot eno ime); funkcije, konstante in grške črke ostanejo."""
    return re.sub(r"(?<![A-Za-z])([A-Za-z])([A-Za-z])(?![A-Za-z0-9(])", lambda m: m.group(0) if m.group(0) in CONSTS or m.group(0) in FUNCS or m.group(0) in GREEK else f"{m.group(1)}*{m.group(2)}", s)


def _deli_koraka(text):
    """»x-1=0 ali x+2=0« → [("=", "x-1", "0"), ("=", "x+2", "0")]; izraz brez relacije → [(None, izraz, None)];
    dvojna neenačba »-2<x<2« → [("&", [("<", "-2", "x"), ("<", "x", "2")], None)]."""
    out = []
    for p in KALI.split(clean(text)):
        p = _crke(p)
        if not p.strip():
            continue
        kosi = split_top(p)
        if len(kosi) < 2 or not all(KREL.search(k) for k in kosi):
            kosi = [p]  # vejica znotraj izraza (log(x, 2)) ali decimalna vejica
        for k in kosi:
            t = KREL.split(k)
            if len(t) == 1:
                out.append((None, t[0], None))
            elif len(t) == 3 and t[1] == "=" and re.fullmatch(r"\s*[A-Za-z]\w*\s*", t[0]) and len(split_top(t[2])) > 1:
                out += [("=", t[0], v) for v in split_top(t[2])]  # »x = 2, -2«
            elif len(t) == 3 and t[1] != "!=" and t[0].strip() and t[2].strip():
                out.append((t[1], t[0], t[2]))
            elif len(t) == 5 and t[1] in KRELS and t[3] in KRELS and all(t[i].strip() for i in (0, 2, 4)):
                out.append(("&", [(t[1], t[0], t[2]), (t[3], t[2], t[4])], None))
            else:
                raise Unsure("korak z verigo relacij ali »≠« ne znam preveriti")
    if not out or (len(out) > 1 and any(r is None for r, _, _ in out)):
        raise Unsure("korak ni ne izraz ne (ne)enačba")
    return out


def _pogoji(text, names):
    """Pogoji definicijskega območja iz neokrajšanega zapisa (seznam relacij SymPy)."""
    try:
        u = parse(text, names, evaluate=False)
    except (Timeout, Unsure):
        raise
    except Exception:
        raise Unsure("definicijskega območja ne znam prebrati")
    pog = []
    for a in sp.preorder_traversal(u):
        if isinstance(a, sp.Pow) and a.args[1].is_number:
            b, ex = a.args[0], sp.simplify(a.args[1])
            if ex.is_Rational and not ex.is_integer and ex.q % 2 == 1 and b.free_symbols:
                # x^(1/3): SymPy vzame glavni (kompleksni) koren negativnega števila, šola realnega; ne sodimo
                raise Unsure("lihi koren spremenljivke")
            if ex.is_negative:
                pog.append(sp.Ne(b, 0))
            if ex.is_Rational and not ex.is_integer and ex.q % 2 == 0:
                pog.append(sp.Ge(b, 0))
        elif isinstance(a, sp.log):
            pog.append(sp.Gt(a.args[0], 0))
            if len(a.args) > 1:
                pog += [sp.Gt(a.args[1], 0), sp.Ne(a.args[1], 1)]
        elif isinstance(a, (sp.tan, sp.sec)):
            pog.append(sp.Ne(sp.cos(a.args[0]), 0))
        elif isinstance(a, (sp.cot, sp.csc)):
            pog.append(sp.Ne(sp.sin(a.args[0]), 0))
        elif isinstance(a, (sp.asin, sp.acos)):
            pog += [sp.Ge(a.args[0], -1), sp.Le(a.args[0], 1)]
    return [p for p in pog if p not in (sp.true,) and getattr(p, "free_symbols", None)]


def _drzi(pog, pt):
    """Ali pogoj velja v točki: True/False (ob dvomu številsko)."""
    try:
        v = pog.subs(pt)
        if v in (sp.true, sp.false):
            return bool(v)
        if v.free_symbols:
            raise Unsure("pogoj s parametrom")
        a, b = v.lhs, v.rhs
        av, bv = complex(sp.N(a, 30)), complex(sp.N(b, 30))
    except (Timeout, Unsure):
        raise
    except Exception:
        return False
    oslabi("numeric")
    if abs(av.imag) > 1e-12 or abs(bv.imag) > 1e-12:
        return False
    d = av.real - bv.real
    eps = 1e-12
    return {sp.Ne: abs(d) > eps, sp.Gt: d > eps, sp.Ge: d > -eps, sp.Lt: d < -eps, sp.Le: d < eps}.get(type(pog), False)


def _obmocje_pogojev(pog, x):
    """Množica realnih x, kjer veljajo vsi pogoji (le pogoji samo v x; drugače Unsure)."""
    dom = sp.S.Reals
    for p in pog:
        if p.free_symbols - {x}:
            raise Unsure("območje s parametri")
        s = sp.solveset(p, x, sp.S.Reals)
        if s.has(sp.ConditionSet) or p.has(sp.sin, sp.cos, sp.tan, sp.cot, sp.sec, sp.csc):
            # periodični pogoj: solveset vrne le eno periodo ([0, 2π)), zato ga ne uporabimo kot množice
            raise Unsure("definicijskega območja ne znam izračunati")
        dom = sp.Intersection(dom, s)
    return dom


def _lepa(s):
    """Množica, ki jo znamo primerjati: končna, interval ali unija intervalov in točk."""
    if s.is_FiniteSet or s in (sp.S.EmptySet, sp.S.Reals) or isinstance(s, sp.Interval):
        return True
    return isinstance(s, (sp.Union, sp.Complement)) and all(_lepa(a) for a in s.args)


def _mnozica_dela(rel, a_txt, b_txt, x, names, D):
    """Realne rešitve enega dela koraka na območju D, z upoštevanim definicijskim območjem zapisa."""
    if rel == "&":
        return sp.Intersection(*[_mnozica_dela(r, a, b, x, names, D) for r, a, b in a_txt])
    a, b = parse(a_txt, names), parse(b_txt, names)
    pog = _pogoji(a_txt, names) + _pogoji(b_txt, names)
    if rel == "=":
        e = a - b
        resi = lambda dom: _solutions(e, x, dom)
    else:
        ner = KRELS[rel](_racionalno(a), _racionalno(b))
        e = a - b
        resi = lambda dom: sp.solveset(ner, x, dom)
    s = resi(D)
    if s is not None and not s.has(sp.ConditionSet) and not _lepa(s):
        if D.is_subset(KOBMOCJE) is not True:
            try:
                per = sp.periodicity(e, x)
            except Timeout:
                raise
            except Exception:
                per = None
            if per is None or not per.is_number or float(per) > 10:
                # dolga perioda (sin(πx/30)): okno [−20, 20] bi videlo premalo rešitev
                raise Unsure("periodične rešitve z dolgo ali neznano periodo")
            oslabi("numeric")  # periodične rešitve primerjamo le na [−20, 20]
            D = sp.Intersection(D, KOBMOCJE)
        s = resi(D)
    if s is None or s.has(sp.ConditionSet) or not _lepa(s):
        raise Unsure("reševalnik ne najde vseh rešitev")
    if s.is_FiniteSet:
        return sp.FiniteSet(*[f for f in s if satisfies(e, {x: f}) is not False and _real_ok(e, x, f) and all(_drzi(p, {x: f}) for p in pog)])
    if pog:
        s = sp.Intersection(s, _obmocje_pogojev(pog, x))
    # neenačba: logaritmi in koreni zunaj območja (solveset jih tu upošteva sam, pogoji zgoraj še imenovalce)
    return s


def _mnozica(deli, x, names, D):
    s = sp.S.EmptySet
    for rel, a, b in deli:
        s = sp.Union(s, _mnozica_dela(rel, a, b, x, names, D))
    return s


def _razlika(A, B):
    """(manjka, odveč): elementi A, ki jih ni v B, in obratno; seznama (končni množici) ali množici."""
    if A.is_FiniteSet and B.is_FiniteSet:
        def brez(P, Q):
            out = []
            for p in P:
                r = [is_zero(p - q) for q in Q]
                if True in r:
                    continue
                if None in r:
                    raise Unsure("rešitev ne znam primerjati")
                out.append(p)
            return out
        return brez(A, B), brez(B, A)
    m, o = sp.simplify(sp.Complement(A, B)), sp.simplify(sp.Complement(B, A))
    for z in (m, o):
        if isinstance(z, sp.Complement) or not _lepa(z) and z != sp.S.EmptySet:
            raise Unsure("množic rešitev ne znam primerjati")
    kot_seznam = lambda z: [] if z == sp.S.EmptySet else (list(z) if z.is_FiniteSet else z)
    return kot_seznam(m), kot_seznam(o)


def _mn(s):
    """Množica v šolskem zapisu: (−∞, −2) ∪ [3, 5], {1, 2}."""
    if isinstance(s, sp.Interval):
        a = "-∞" if s.start == -sp.oo else sp.sstr(s.start)
        b = "∞" if s.end == sp.oo else sp.sstr(s.end)
        return f"{'(' if s.left_open else '['}{a}, {b}{')' if s.right_open else ']'}"
    if isinstance(s, sp.Union):
        return " ∪ ".join(_mn(a) for a in s.args)
    if s.is_FiniteSet:
        return "{" + ", ".join(sp.sstr(a) for a in s) + "}"
    return sp.sstr(s)


def _niz(v, x):
    if isinstance(v, list):
        try:
            v = sorted(v, key=lambda t: float(sp.N(t)))
        except Exception:
            pass
        vec = len(v) > 4
        return ", ".join(f"{x} = {sp.sstr(t)}" for t in v[:4]) + (f" … (skupaj {len(v)} na [−20, 20])" if vec else "")
    return f"{x} ∈ {_mn(v)}"


def _resena(deli, x, names):
    """Ali je zapis končni odgovor: vsak del je »x = število« (ali »število = x«)."""
    for rel, a, b in deli:
        if rel != "=":
            return False
        l, d = parse(a, names), parse(b, names)
        if not (l == x and x not in d.free_symbols or d == x and x not in l.free_symbols):
            return False
    return True


def _razmerje(e1, e2):
    """Konstanta r ≠ 0, za katero je e1 = r·e2 (korak pomnoži obe strani s številom), sicer None."""
    try:
        if e2 == 0:
            return None
        r = sp.simplify(e1 / e2)
        if r.is_number and r.is_finite and r != 0 and not r.has(sp.I):
            return r
    except Timeout:
        raise
    except Exception:
        pass
    return None


def _vrednost(e, pt):
    """Realna vrednost izraza v točki ali None (ni definiran ali ni realen)."""
    try:
        v = complex(sp.N(e.subs(pt), 25))
    except Timeout:
        raise
    except Exception:
        return None
    if v != v or abs(v) == float("inf") or abs(v.imag) > 1e-9 * max(1.0, abs(v.real)):
        return None
    return v.real


def _korak_izraz(a_txt, b_txt, x, names, D):
    A, B = parse(a_txt, names), parse(b_txt, names)
    r = is_zero(A - B)
    free = sorted((A.free_symbols | B.free_symbols), key=str)
    rng = random.Random(11)
    dobre, slaba, zozeno = 0, None, None
    for _ in range(80):
        pt = {s: sp.Rational(rng.randint(-400, 400), rng.randint(7, 37)) for s in free}
        if x in pt and D != sp.S.Reals and D.contains(pt[x]) is not sp.true:
            continue
        va, vb = _vrednost(A, pt), _vrednost(B, pt)
        if va is None:
            continue
        if vb is None:
            zozeno = zozeno or pt
            continue
        if abs(va - vb) > 1e-9 * max(1.0, abs(va), abs(vb)):
            slaba = slaba or pt
        else:
            dobre += 1
    tocka = lambda pt: ", ".join(f"{s} = {sp.sstr(v)}" for s, v in pt.items())
    if r is False or slaba:
        oslabi("sampled" if slaba and r is not False else "symbolic")
        primer = f" (pri {tocka(slaba)} prvi {_vrednost(A, slaba):.6g}, drugi {_vrednost(B, slaba):.6g})" if slaba else ""
        return False, f"izraza nista enaka{primer}", {"vrsta": "napaka"}
    if zozeno:
        oslabi("sampled")
        return False, f"novi izraz pri {tocka(zozeno)} ni definiran, prvotni je", {"vrsta": "izguba"}
    if r is None:
        if dobre < 8:
            raise Unsure("enakosti ne znam potrditi")
        oslabi("sampled")
    why = ""
    if len(free) == 1 and free[0] == x:
        # območja s kotnimi funkcijami ne znamo izračunati kot množice (ena perioda): osamljene točke tedaj
        # ostanejo nepreverjene, zoženje na intervalu pa že ujame vzorčenje zgoraj
        try:
            DA = sp.Intersection(_obmocje_pogojev(_pogoji(a_txt, names), x), D)
            DB = sp.Intersection(_obmocje_pogojev(_pogoji(b_txt, names), x), D)
        except Unsure:
            DA = DB = None
        if DA is not None:
            zozeno = sp.simplify(sp.Complement(DA, DB))
            if zozeno != sp.S.EmptySet:
                if zozeno.is_FiniteSet:
                    return False, f"novi izraz ni definiran pri {_niz(list(zozeno), x)}, prvotni je", {"vrsta": "izguba"}
                raise Unsure("spremembe definicijskega območja ne znam opisati")
            if sp.simplify(sp.Complement(DB, DA)) != sp.S.EmptySet:
                izven = sp.Complement(D, DA)
                why = f"velja za {x} ≠ " + ", ".join(sp.sstr(t) for t in izven) if izven.is_FiniteSet else f"velja za {x} ∈ {_mn(sp.simplify(DA))}"
    return True, why, {"vrsta": "ekvivalenca"}


def op_korak(prej, potem, var="", obmocje=""):
    d1, d2 = _deli_koraka(prej), _deli_koraka(potem)
    izraz1, izraz2 = d1[0][0] is None, d2[0][0] is None
    if izraz1 != izraz2:
        raise Unsure("korak med izrazom in (ne)enačbo")
    if var.strip():
        x = syms_of(var)[0]
        names = [str(x)]
    else:
        names = []
        vse = set()
        for rel, a, b in d1 + d2:
            for t in (a if rel == "&" else [(rel, a, b)]):
                for u in t[1:]:
                    if u is not None:
                        vse |= parse(u).free_symbols
        x = next(iter(vse)) if len(vse) == 1 else (sp.Symbol("x", real=True) if not vse else None)
    D = parse_set(obmocje, x) if obmocje.strip() and x is not None else sp.S.Reals
    if izraz1:
        return _korak_izraz(d1[0][1], d2[0][1], x, names, D)
    # hitra simbolna pot: ena relacija na vsaki strani, druga je prva, pomnožena s številom (deluje tudi s parametri)
    if len(d1) == 1 and len(d2) == 1 and D == sp.S.Reals and "&" not in (d1[0][0], d2[0][0]):
        (r1, a1, b1), (r2, a2, b2) = d1[0], d2[0]
        e1, e2 = parse(a1, names) - parse(b1, names), parse(a2, names) - parse(b2, names)
        k = _razmerje(e1, e2)
        p1 = _pogoji(a1, names) + _pogoji(b1, names)
        p2 = _pogoji(a2, names) + _pogoji(b2, names)
        if k is not None and set(p1) == set(p2):
            if r1 == "=" and r2 == "=" or r1 != "=" and r2 == (r1 if k > 0 else KOBRNI[r1]):
                return True, "", {"vrsta": "ekvivalenca"}
            if r1 != "=" and r2 == (KOBRNI[r1] if k > 0 else r1) and x is None:
                return False, "znak neenakosti se obrne le pri množenju ali deljenju z negativnim številom", {"vrsta": "napaka"}
    if x is None:
        raise Unsure("navedi neznanko (zapis ima več spremenljivk)")
    for rel, a, b in d1 + d2:
        for r_, u, v in (a if rel == "&" else [(rel, a, b)]):
            if (parse(u, names).free_symbols | parse(v, names).free_symbols) - {x}:
                # solveset reši »a·x = a« kot x = 1 (predpostavi a ≠ 0): brez razbitja na primere ne sodimo
                raise Unsure("korak s parametrom ne znam preveriti (razen množenja obeh strani s številom)")
    S1, S2 = _mnozica(d1, x, names, D), _mnozica(d2, x, names, D)
    manjka, odvec = _razlika(S1, S2)
    if not manjka and not odvec:
        return True, "", {"vrsta": "ekvivalenca"}
    enacbe = all(r == "=" for r, _, _ in d1 + d2)
    if not manjka and enacbe and isinstance(odvec, list) and _resena(d2, x, names):
        # »x = 3 ali x = -3« je končni odgovor, ne vmesni korak: tuja rešitev v njem je napaka (manjka preizkus)
        return False, f"{_niz(odvec, x)} ni rešitev prvotne enačbe (preizkus)", {"vrsta": "napaka"}
    if not manjka and enacbe and isinstance(odvec, list):
        return True, f"tuja rešitev {_niz(odvec, x)}: velja v novi enačbi, ne v prvotni; preveri kandidate v prvotni enačbi", {"vrsta": "posledica"}
    if manjka and not odvec:
        why = f"izgubljena rešitev {_niz(manjka, x)}" if isinstance(manjka, list) else f"manjka del rešitve {_niz(manjka, x)}"
        if len(d1) == 1 and len(d2) == 1 and isinstance(manjka, list) and enacbe:
            try:
                e1 = parse(d1[0][1], names) - parse(d1[0][2], names)
                e2 = parse(d2[0][1], names) - parse(d2[0][2], names)
                k = sp.factor(sp.cancel(sp.together(e1 / e2)))
                if x in k.free_symbols and k.is_polynomial(x) and all(is_zero(k.subs(x, m)) is True for m in manjka):
                    why += f" (kot deljenje z {sp.sstr(k)}, ki je pri {_niz(manjka, x)} enako 0)"
            except Timeout:
                raise
            except Exception:
                pass
        return False, why, {"vrsta": "izguba"}
    deli = []
    if odvec:
        deli.append(f"odveč {_niz(odvec, x)}")
    if manjka:
        deli.append(f"manjka {_niz(manjka, x)}")
    return False, "nova " + ("enačba" if enacbe else "relacija") + " ni enakovredna: " + "; ".join(deli), {"vrsta": "napaka"}



# ---------------------------------------------------------------------------
# PV-07: dimenzijska analiza (docs/preverjanje.md, »Enote in zaokroževanje«).
#   noter: {"op": "dim", "args": [del1, del2, …]}: deli ene enačbe, v katerih so količine že zamenjane z enotami
#          (»U_0 = N B S ω« s podatki → »V«, »1 * T * cm^2 * (2*pi*(1/min))«).
#   ven:   ok true, kadar imajo vsi deli enako dimenzijo; false, kadar se dimenziji razlikujeta ali se seštevajo
#          količine različnih dimenzij ali je argument sin/cos/exp z dimenzijo; null pri neznanem imenu.
# Logaritem sme imeti argument z dimenzijo (pH = −log c pomeni c / (1 mol/L)); rezultat je brez dimenzije.

class DimNapaka(Exception):
    pass


_BREZ_DIM = (sp.sin, sp.cos, sp.tan, sp.cot, sp.sec, sp.csc, sp.asin, sp.acos, sp.atan, sp.acot, sp.exp,
             sp.sinh, sp.cosh, sp.tanh)


def _dim(e):
    """Dimenzija izraza kot {osnovna dimenzija: eksponent} (prazno = brez dimenzije)."""
    from sympy.physics.units.systems.si import SI
    if e.is_number:
        return {}
    if isinstance(e, U.Quantity):
        d = SI.get_dimension_system().get_dimensional_dependencies(SI.get_quantity_dimension(e))
        return {str(k.args[0]): v for k, v in d.items() if v != 0}
    if isinstance(e, sp.Symbol):
        raise Unsure(f"neznano ime {e}")
    if isinstance(e, sp.Mul):
        out = {}
        for f in e.args:
            for k, v in _dim(f).items():
                out[k] = out.get(k, 0) + v
        return {k: v for k, v in out.items() if v != 0}
    if isinstance(e, sp.Pow):
        if _dim(e.exp):
            raise DimNapaka("eksponent ima dimenzijo")
        if not e.exp.is_number:
            raise Unsure("eksponent ni število")
        return {k: v * e.exp for k, v in _dim(e.base).items()}
    if isinstance(e, sp.Add):
        dims = [_dim(t) for t in e.args]
        for d in dims[1:]:
            if d != dims[0]:
                # število brez enote ob količini (T = t + 273, 30(t + 1), 0,1 · (600 + x)): enota števila je v
                # besedilu naloge, ne v zapisu; tega ne štejemo za napako, le za nepreverjeno
                if any(t.is_number for t in e.args):
                    raise Unsure("število brez enote ob količini z enoto")
                raise DimNapaka(f"seštevanje {_dim_niz(dims[0])} in {_dim_niz(d)}")
        return dims[0]
    if isinstance(e, sp.log):
        _dim(e.args[0])
        return {}
    if isinstance(e, _BREZ_DIM):
        if _dim(e.args[0]):
            raise DimNapaka(f"argument {e.func.__name__} ima dimenzijo {_dim_niz(_dim(e.args[0]))}")
        return {}
    if isinstance(e, sp.Abs):
        return _dim(e.args[0])
    raise Unsure(f"dimenzije {e.func.__name__} ne znam določiti")


_ENOTE_DIM = {"mass": "kg", "length": "m", "time": "s", "current": "A", "temperature": "K",
              "amount_of_substance": "mol", "luminous_intensity": "cd"}


def _dim_niz(d):
    if not d:
        return "brez enote"
    return "·".join(f"{_ENOTE_DIM.get(k, k)}" + ("" if v == 1 else f"^{v}") for k, v in sorted(d.items()))


def op_dim(*deli):
    if len(deli) < 2:
        raise Unsure("premalo delov")
    dims = []
    for d in deli:
        try:
            dims.append(_dim(parse(d, units=True)))
        except DimNapaka as ex:
            return False, str(ex)
    for d in dims[1:]:
        if d != dims[0]:
            if any(parse(x, units=True).is_number for x in deli):
                raise Unsure("del enačbe je število brez enote")
            return False, f"dimenziji se ne ujemata: {_dim_niz(dims[0])} in {_dim_niz(d)}"
    return True, ""

OPS = {"korak": op_korak, "solve": op_solve, "equal": op_equal, "diff": op_diff, "int": op_int, "limit": op_limit, "value": op_value, "ineq": op_ineq, "units": op_units, "dim": op_dim}


DECIMALKA = re.compile(r"(?<![\w.])(?:\d+\.\d+(?:[eE][+-]?\d+)?|\d+[eE][+-]?\d+)(?![\w.])")


def _vejica(s):
    """Decimalna vejica kot v clean(): 1,5 → 1.5, kadar v besedilu ni drugih vejic."""
    return _decimalna_vejica(s)


def _z_ulomki(op, args):
    """Decimalke SymPy hrani kot 53-bitna števila: Float(100000000.05) · 100000001 se zaokroži na 10000000105000000,
    zato bi napačen odgovor dobil »symbolic« (pregled PV-03). Ukaz ponovimo z decimalkami kot ulomki (0.05 → 1/20,
    tudi 0,05 in 5e-2); »symbolic« ostane le, če tudi točen račun drži simbolno, sicer je izid številski."""
    tocni = [DECIMALKA.sub(lambda m: "(" + str(sp.Rational(m.group(0))) + ")", _vejica(a)) for a in args]
    _nacin[0] = "symbolic"
    try:
        ok = op(*tocni)[0]
    except (Exception, Timeout):  # prvi izid ostane, a le kot številski
        return "numeric"
    return "symbolic" if ok and _nacin[0] == "symbolic" else "numeric"


def handle(req):
    op = OPS.get(req.get("op"))
    if not op:
        return {"ok": None, "why": "neznan ukaz"}
    signal.alarm(TIME_LIMIT)
    _nacin[0] = "symbolic"
    try:
        args = [str(a) for a in req.get("args", [])]
        ok, why, *dodatno = op(*args)  # korak (PV-06) vrne še {"vrsta": …}
        how = _nacin[0]
        if ok and how == "symbolic" and any(DECIMALKA.search(_vejica(a)) for a in args):
            how = _z_ulomki(op, args)
        return {"ok": bool(ok), "why": why or "", "how": how, **(dodatno[0] if dodatno else {})}
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

# Zaklopke srca na obročih CT (n10, po oceni n9): tanki lističi z debelejšim robom (hrapava cona), fibrozni obroči,
# žepki z noduli in lunulami ob kroni pritrditve, razvejane tetive (primarne, sekundarne, terciarne), papilarne mišice
# iz proste stene prekata. Vsaka mreža ima tudi telefonsko različico z manj vrsticami (parametrično, ne poenostavljeno:
# poenostavljen tanek listič je bil »origami«, ocena n9). Mere: Netter, Gray; listič 0,4–1 mm, tetive Ø 0,3–1 mm.
import math
import bpy
import bmesh
import numpy as np
from mathutils import Vector


def _v_mesh(ime, V, F):
    me = bpy.data.meshes.new(ime)
    me.from_pydata([tuple(map(float, v)) for v in V], [], [tuple(map(int, f)) for f in F]); me.update()
    for p in me.polygons:
        p.use_smooth = True
    return me


def _bm_mesh(ime, bm):
    me = bpy.data.meshes.new(ime); bm.to_mesh(me); bm.free()
    for p in me.polygons:
        p.use_smooth = True
    return me


def debela_ploskev(S, deb):
    """Zaprta lupina iz srednje ploskve S (nu × nv × 3) z debelino deb (nu × nv): zgornja in spodnja ploskev ter rob."""
    nu, nv, _ = S.shape
    du = np.gradient(S, axis=0); dv = np.gradient(S, axis=1)
    N = np.cross(du, dv); N /= np.linalg.norm(N, axis=2)[..., None] + 1e-15
    A = (S + N * deb[..., None] / 2).reshape(-1, 3); B = (S - N * deb[..., None] / 2).reshape(-1, 3)
    o = nu * nv; V = np.r_[A, B]
    idx = lambda i, j: i * nv + j
    F = []
    for i in range(nu - 1):
        for j in range(nv - 1):
            a, b, c, d = idx(i, j), idx(i + 1, j), idx(i + 1, j + 1), idx(i, j + 1)
            F += [(a, b, c), (a, c, d), (o + a, o + c, o + b), (o + a, o + d, o + c)]
    rob = [idx(i, 0) for i in range(nu)] + [idx(nu - 1, j) for j in range(1, nv)] + \
          [idx(i, nv - 1) for i in range(nu - 2, -1, -1)] + [idx(0, j) for j in range(nv - 2, 0, -1)]
    for k in range(len(rob)):
        a, b = rob[k], rob[(k + 1) % len(rob)]
        F += [(a, o + a, o + b), (a, o + b, b)]
    return V, np.array(F)


def cev_np(tocke, polmeri, seg, zaprta=False):
    """Cev vzdolž točk (vzporedni prenos okvirja); zaprta=True: sklenjen obroč (fibrozni obroč zaklopke)."""
    P = np.asarray(tocke, float); n = len(P)
    T = np.roll(P, -1, 0) - np.roll(P, 1, 0) if zaprta else np.gradient(P, axis=0)
    T /= np.linalg.norm(T, axis=1)[:, None] + 1e-15
    ref = np.cross(T[0], [0.3, 0.5, 0.8]); ref /= np.linalg.norm(ref)
    th = np.linspace(0, 2 * np.pi, seg, endpoint=False)
    V = []
    for i in range(n):
        ref = ref - T[i] * (ref @ T[i]); ref /= np.linalg.norm(ref) + 1e-15
        b = np.cross(T[i], ref)
        V.append(P[i] + polmeri[i] * (np.outer(np.cos(th), ref) + np.outer(np.sin(th), b)))
    V = np.concatenate(V); F = []
    for i in range(n if zaprta else n - 1):
        i2 = (i + 1) % n
        for k in range(seg):
            a, b = i * seg + k, i * seg + (k + 1) % seg
            c, d = i2 * seg + (k + 1) % seg, i2 * seg + k
            F += [(a, b, c), (a, c, d)]
    if not zaprta:  # zaobljena konca (en vrh)
        for i, p in ((0, P[0] - T[0] * polmeri[0] * 0.6), (n - 1, P[-1] + T[-1] * polmeri[-1] * 0.6)):
            c = len(V); V = np.r_[V, p[None]]
            for k in range(seg):
                a, b = i * seg + k, i * seg + (k + 1) % seg
                F.append((b, a, c) if i == 0 else (a, b, c))
    return V, F


class Zbirka:
    """Več cevi/ploskev v eno mrežo."""
    def __init__(self):
        self.V, self.F, self.n = [], [], 0

    def dodaj(self, V, F):
        self.V.append(np.asarray(V)); self.F += [tuple(int(x) + self.n for x in f) for f in F]; self.n += len(V)

    def mesh(self, ime):
        return _v_mesh(ime, np.concatenate(self.V) if self.V else np.zeros((0, 3)), self.F)


def r_kot(kot, R, f):
    f = (f + np.pi) % (2 * np.pi) - np.pi
    return float(np.interp(f, np.r_[kot, kot[0] + 2 * np.pi], np.r_[R, R[0]]))


def listic(c, n, a, b, kot, R, f0, f1, globina, q=1.0, notranji=0.4, valovi=1):
    """Jadrast listič (odprta zaklopka v diastoli) od kota f0 do f1 na obroču. Vrne (V, F, prosti rob, hrapava cona):
    debelina 0,45 mm ob obroču, 0,9 mm v hrapavi coni ob prostem robu; ob komisurah plitev, valovi > 1 = pokrovčki
    (zadnji mitralni P1–P3) z zarezami; prosti rob rahlo valovit."""
    nu, nv = max(12, int(44 * q)), max(6, int(16 * q))
    S = np.zeros((nu, nv, 3)); D = np.zeros((nu, nv))
    for i in range(nu):
        u = i / (nu - 1); f = f0 + (f1 - f0) * u
        rad = a * math.cos(f) + b * math.sin(f); Rf = r_kot(kot, R, f)
        A = c + rad * Rf
        prof = 0.22 + 0.78 * math.sin(math.pi * u) ** 0.6
        if valovi > 1:  # zareze med pokrovčki
            prof *= 1 - 0.38 * sum(math.exp(-((u - k / valovi) / 0.035) ** 2) for k in range(1, valovi))
        g = globina * prof
        for j in range(nv):
            s = j / (nv - 1)
            p = A + n * g * s ** 0.9 - rad * Rf * (1 - notranji) * s ** 1.1 + n * 0.0016 * math.sin(math.pi * s) * math.sin(math.pi * u)
            p += n * 0.0006 * math.sin(9 * math.pi * u) * s ** 3  # valovit prosti rob
            S[i, j] = p
            D[i, j] = 0.00045 + 0.00045 * min(1.0, max(0.0, (s - 0.62) / 0.2))
    V, F = debela_ploskev(S, D)
    return V, F, S[:, -1].copy(), S[:, int((nv - 1) * 0.78)].copy()


def obroc(c, n, a, b, kot, R, q=1.0, r=0.0011, f0=-np.pi, f1=np.pi, odmik=0.0004):
    """Fibrozni obroč (anulus): cev ob pritrditvi lističev, malo v steni proti preddvoru."""
    k = max(24, int(72 * q))
    zaprta = abs(f1 - f0 - 2 * np.pi) < 1e-6
    fs = np.linspace(f0, f1, k, endpoint=not zaprta)
    T = [c + (a * math.cos(f) + b * math.sin(f)) * r_kot(kot, R, f) * 1.02 - n * odmik for f in fs]
    return cev_np(T, [r] * len(T), max(5, int(8 * q)), zaprta=zaprta)


def zepki(c, os_, R, q=1.0, debelina=0.00032):
    """Polmesečasta zaklopka (zaprta, v sistoli/diastoli zaprta): trije tanki žepki. Pritrjeni rob je U (krona, komisure
    zgoraj), prosti rob od komisure do središča (Y), trebuh rahlo povešen proti prekatu (n9: napihnjene polkrogle →
    povesa 0,15 R). Lunule (tanjši pas ob prostem robu) 0,2 mm, nodul (Arantius) na sredini prostega roba. Vrne
    (zbirka žepkov, krona za obroč)."""
    a = np.cross(os_, [0.3, 0.5, 0.8]); a /= np.linalg.norm(a); b = np.cross(os_, a)
    nt, nu = max(12, int(24 * q)), max(6, int(10 * q))
    z = Zbirka(); krona = []
    for k in range(3):
        f0 = 2 * math.pi * k / 3 + 0.3
        S = np.zeros((nt, nu, 3)); D = np.zeros((nt, nu))
        for i in range(nt):
            t = i / (nt - 1); f = f0 + t * 2 * math.pi / 3
            rad = a * math.cos(f) + b * math.sin(f)
            A = c + rad * R + os_ * R * (0.40 - 0.80 * math.sin(math.pi * t) ** 0.9)
            krona.append(A)
            fe = f0 if t < 0.5 else f0 + 2 * math.pi / 3
            re_ = a * math.cos(fe) + b * math.sin(fe)
            Fr = c + re_ * R * abs(2 * t - 1) * 0.96 + os_ * R * (0.30 + 0.05 * math.sin(math.pi * t))
            for j in range(nu):
                u = j / (nu - 1)
                S[i, j] = A + (Fr - A) * u - os_ * R * 0.15 * math.sin(math.pi * u) * math.sin(math.pi * t) ** 0.7
                lun = (u > 0.78) * (abs(t - 0.5) > 0.07)
                D[i, j] = debelina * (0.62 if lun else 1.0)
        V, F = debela_ploskev(S, D)
        z.dodaj(V, F)
        # nodul: majhna zadebelina na sredini prostega roba (ob središču)
        m = S[nt // 2, -1]
        Vn, Fn = cev_np([m - os_ * 0.0006, m + os_ * 0.0006], [0.0009, 0.0009], 8)
        z.dodaj(Vn, Fn)
    return z, np.array(krona)


def tetive(z, glava, rob, hrap, q=1.0, rnd=None):
    """Razvejane tetive iz glave papilarne mišice: deblo (Ø 1 mm) do ≈ 45 %, nato 2 sekundarni (Ø 0,6 mm), vsaka 2
    terciarni (Ø 0,35 mm) do prostega roba; vsako drugo deblo še ena opornica do hrapave cone (3–4 mm od roba)."""
    rnd = rnd or np.random.default_rng(1)
    seg = (6, 4, 3) if q >= 1 else (4, 3, 3)
    pot = lambda A, B, k, ukriv: [A + (B - A) * t + ukriv * math.sin(math.pi * t) for t in np.linspace(0, 1, k)]
    for g0 in range(0, len(rob) - 1, 4):
        sk = rob[g0:g0 + 4]
        if len(sk) < 2:
            continue
        cil = np.mean(sk, 0)
        if np.linalg.norm(cil - glava) > 0.042:
            continue
        perp = np.cross(cil - glava, [0.2, 0.3, 0.9]); perp /= np.linalg.norm(perp) + 1e-12
        B1 = glava + (cil - glava) * rnd.uniform(0.38, 0.5)
        V, F = cev_np(pot(glava, B1, 6, perp * rnd.uniform(-6e-4, 6e-4)), np.linspace(0.00055, 0.00045, 6), seg[0]); z.dodaj(V, F)
        if q < 1:  # telefon: deblo in neposredne veje do roba (enaka pahljača, manj trikotnikov)
            for e in sk:
                V, F = cev_np(pot(B1, e, 4, perp * rnd.uniform(-3e-4, 3e-4)), np.linspace(0.00026, 0.0002, 4), seg[2]); z.dodaj(V, F)
            continue
        for par in (sk[:2], sk[2:]):
            if not len(par):
                continue
            pc = np.mean(par, 0)
            B2 = B1 + (pc - B1) * rnd.uniform(0.5, 0.65)
            V, F = cev_np(pot(B1, B2, 5, perp * rnd.uniform(-4e-4, 4e-4)), np.linspace(0.00034, 0.0003, 5), seg[1]); z.dodaj(V, F)
            for e in par:
                V, F = cev_np(pot(B2, e, 5, perp * rnd.uniform(-3e-4, 3e-4)), np.linspace(0.0002, 0.00017, 5), seg[2]); z.dodaj(V, F)
        if (g0 // 4) % 2 == 0 and len(hrap):
            h = hrap[min(len(hrap) - 1, g0 + 1)]
            V, F = cev_np(pot(B1, h, 5, perp * 3e-4), np.linspace(0.00036, 0.0003, 5), seg[1]); z.dodaj(V, F)


def papilarna(bm, dno, vrh, polmer, q=1.0):
    """Papilarna mišica: stožec iz stene (dno široko, vgreznjeno 2,5 mm), zgoraj 2–3 glave. Vrne glave."""
    from srce_geometrija import cev
    os_ = (vrh - dno).normalized()
    dno = dno - os_ * 0.0025
    k = max(8, int(16 * q)); seg = max(8, int(16 * q))
    deblo = [dno.lerp(vrh, 0.78 * i / (k - 1)) for i in range(k)]
    cev(bm, deblo, [polmer * (2.4 - 1.7 * (i / (k - 1)) ** 0.5) for i in range(k)], seg=seg)
    pravo = os_.orthogonal().normalized() * polmer * 0.5; tretje = os_.cross(pravo).normalized() * polmer * 0.5
    glave = []
    for zamik in (pravo, -pravo * 0.5 + tretje * 0.87, -pravo * 0.5 - tretje * 0.87):
        a = dno.lerp(vrh, 0.62)
        t = [a.lerp(vrh, i / 7) + zamik * (i / 7) ** 1.3 for i in range(8)]
        cev(bm, t, [polmer * (0.66 - 0.5 * (i / 7) ** 1.4) for i in range(8)], seg=max(6, int(10 * q)))
        glave.append(np.array(t[-1]))
    return glave

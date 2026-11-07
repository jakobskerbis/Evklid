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


def sedlo(f, amp):
    """Sedlasti obroč (n11, ocena n10: »raven zgornji rob, martini kozarec«): mitralni obroč je višji (proti preddvoru)
    spredaj ob aorti in zadaj, nižji ob komisurah; višina ≈ 15–20 % premera (Levine 1987). amp v metrih."""
    return amp * math.cos(2 * f)


def tocka_obroca(c, n, a, b, kot, R, f, amp=0.0):
    rad = a * math.cos(f) + b * math.sin(f)
    return c + rad * r_kot(kot, R, f) - n * sedlo(f, amp), rad


def listic(c, n, a, b, kot, R, f0, f1, globina, q=1.0, notranji=0.58, valovi=1, amp=0.0, seme=0):
    """Jadrast listič (odprta zaklopka v diastoli) od kota f0 do f1 na sedlastem obroču. Vrne (V, F, prosti rob, hrapava
    cona). n11 (ocena n10: »togi beli lijaki, martini kozarci, ravni zgornji rob«): ob komisurah skoraj nič globine (lističi
    so ločeni z zarezami, ne zvezen lijak), visijo skoraj vzporedno z osjo (prosti rob pri ~60 % polmera), tanki (0,35 mm,
    hrapava cona 0,7 mm), prosti rob nagubano valovit (drobne gube in nepravilni zobci), trebuh rahlo izbočen."""
    nu, nv = max(14, int(52 * q)), max(7, int(18 * q))
    rng = np.random.default_rng(seme)
    ph = rng.uniform(0, 2 * np.pi, 4)
    S = np.zeros((nu, nv, 3)); D = np.zeros((nu, nv))
    for i in range(nu):
        u = i / (nu - 1); f = f0 + (f1 - f0) * u
        A, rad = tocka_obroca(c, n, a, b, kot, R, f, amp)
        Rf = r_kot(kot, R, f)
        prof = 0.03 + 0.97 * math.sin(math.pi * u) ** 1.15  # široke zareze ob komisurah (ne zvezen lijak)
        if valovi > 1:  # zareze med pokrovčki (P1–P3, trikuspidalni robovi)
            prof *= 1 - 0.45 * sum(math.exp(-((u - k / valovi) / 0.03) ** 2) for k in range(1, valovi))
        prof *= 1 + 0.05 * math.sin(2 * math.pi * 5 * u + ph[0]) + 0.03 * math.sin(2 * math.pi * 9 * u + ph[1])  # nepravilen rob
        g = globina * prof
        tg = (-a * math.sin(f) + b * math.cos(f))
        for j in range(nv):
            s = j / (nv - 1)
            p = A + n * g * s ** 0.85 - rad * Rf * (1 - notranji) * s ** 1.4
            p += -rad * 0.0012 * math.sin(math.pi * s) * math.sin(math.pi * u)  # trebuh izbočen proti prekatu (v diastoli)
            # gube prostega roba: drobne (≈ 1,5 mm) in večje (≈ 4 mm) v smeri polmera, močnejše proti robu
            gub = 0.00045 * math.sin(2 * math.pi * 11 * u + ph[2]) + 0.0003 * math.sin(2 * math.pi * 4 * u + ph[3])
            p += rad * gub * s ** 3 + tg * 0.00025 * math.sin(2 * math.pi * 7 * u) * s ** 4
            S[i, j] = p
            D[i, j] = 0.00035 + 0.00035 * min(1.0, max(0.0, (s - 0.6) / 0.2)) - 0.0001 * max(0.0, (s - 0.95) / 0.05)
    V, F = debela_ploskev(S, D)
    return V, F, S[:, -1].copy(), S[:, int((nv - 1) * 0.74)].copy()


def obroc(c, n, a, b, kot, R, q=1.0, r=0.0011, f0=-np.pi, f1=np.pi, odmik=0.0004, amp=0.0):
    """Fibrozni obroč (anulus): cev ob pritrditvi lističev, malo v steni proti preddvoru; sedlast (amp)."""
    k = max(24, int(72 * q))
    zaprta = abs(f1 - f0 - 2 * np.pi) < 1e-6
    fs = np.linspace(f0, f1, k, endpoint=not zaprta)
    T = [c + (a * math.cos(f) + b * math.sin(f)) * r_kot(kot, R, f) * 1.02 - n * (odmik + sedlo(f, amp)) for f in fs]
    return cev_np(T, [r] * len(T), max(5, int(8 * q)), zaprta=zaprta)


def stolpec(P, Rs, seg, brazde=0.0, seme=0, konca=(True, True)):
    """Mišičen stolpec (papilarna mišica, glava, moderatorni trak): cev vzdolž P s polmeri Rs, vzdolžne brazde (delež
    polmera, 6 + 13 brazd z zasukom) in zaobljena konca (polkrogla iz 3 obročev). Vrne V, F (numpy)."""
    P = np.asarray(P, float); n = len(P); Rs = np.asarray(Rs, float)
    T = np.gradient(P, axis=0); T /= np.linalg.norm(T, axis=1)[:, None] + 1e-15
    ref = np.cross(T[0], [0.3, 0.5, 0.8]); ref /= np.linalg.norm(ref)
    th = np.linspace(0, 2 * np.pi, seg, endpoint=False)
    ph = np.random.default_rng(seme).uniform(0, 2 * np.pi, 2)
    vrste = []
    okv = []
    for i in range(n):
        ref = ref - T[i] * (ref @ T[i]); ref /= np.linalg.norm(ref) + 1e-15
        okv.append((T[i], ref.copy(), np.cross(T[i], ref)))
    def obroc_(p, r, t, x, y, k):
        mod = 1 + brazde * (np.cos(6 * th + 3 * k + ph[0]) * 0.7 + 0.45 * np.cos(13 * th - 5 * k + ph[1]))
        return p + (r * mod)[:, None] * (np.outer(np.cos(th), x) + np.outer(np.sin(th), y))
    if konca[0]:
        t, x, y = okv[0]
        for f in (0.45, 0.8):
            vrste.append(obroc_(P[0] - t * Rs[0] * math.sqrt(1 - f * f), Rs[0] * f, t, x, y, 0.0))
    for i in range(n):
        t, x, y = okv[i]
        vrste.append(obroc_(P[i], Rs[i], t, x, y, i / max(1, n - 1)))
    if konca[1]:
        t, x, y = okv[-1]
        for f in (0.8, 0.45):
            vrste.append(obroc_(P[-1] + t * Rs[-1] * math.sqrt(1 - f * f), Rs[-1] * f, t, x, y, 1.0))
    V = np.concatenate(vrste); m = len(vrste); F = []
    for i in range(m - 1):
        for k in range(seg):
            a_, b_ = i * seg + k, i * seg + (k + 1) % seg
            F += [(a_, b_, b_ + seg), (a_, b_ + seg, a_ + seg)]
    for i, kon, vrh in ((0, konca[0], P[0] - okv[0][0] * Rs[0] * (1.0 if konca[0] else 0.0)), (m - 1, konca[1], P[-1] + okv[-1][0] * Rs[-1] * (1.0 if konca[1] else 0.0))):
        c_ = len(V); V = np.r_[V, vrh[None]]
        for k in range(seg):
            a_, b_ = i * seg + k, i * seg + (k + 1) % seg
            F.append((b_, a_, c_) if i == 0 else (a_, b_, c_))
    return V, F


def zepki(c, os_, R, q=1.0, debelina=0.00032):
    """Polmesečasta zaklopka (zaprta v diastoli): trije tanki žepki. Pritrjeni rob je U (krona, komisure zgoraj), prosti
    rob od komisure do središča (Y). n11 (ocena n10: »motno beli mehurčki brez nodulov in lunul«): globlji žep (povesa
    0,3 R, vidna kotanja sinusa), zadebeljen prosti rob (vrvica 0,35 mm), tanjša lunula ob njem in jasen nodul (Arantius,
    Ø 2,4 mm) na sredini prostega roba. Vrne (zbirka žepkov, krona za obroč)."""
    a = np.cross(os_, [0.3, 0.5, 0.8]); a /= np.linalg.norm(a); b = np.cross(os_, a)
    nt, nu = max(12, int(26 * q)), max(6, int(12 * q))
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
                S[i, j] = A + (Fr - A) * u - os_ * R * 0.30 * math.sin(math.pi * u) * math.sin(math.pi * t) ** 0.7
                lun = (u > 0.74) * (abs(t - 0.5) > 0.06)
                D[i, j] = debelina * (0.55 if lun else 1.0)
        V, F = debela_ploskev(S, D)
        z.dodaj(V, F)
        # zadebeljen prosti rob (brez skrajnih komisur)
        rob = S[1:-1, -1]
        Vr, Fr_ = cev_np(rob, [0.00035] * len(rob), 5 if q >= 1 else 4); z.dodaj(Vr, Fr_)
        # nodul: kapljica na sredini prostega roba (ob središču)
        m = S[nt // 2, -1]
        tg = S[nt // 2 + 1, -1] - S[nt // 2 - 1, -1]; tg /= np.linalg.norm(tg) + 1e-12
        Vn, Fn = cev_np([m - tg * 0.0005, m + tg * 0.0005], [0.0011, 0.0011], 8 if q >= 1 else 6); z.dodaj(Vn, Fn)
    return z, np.array(krona)


def tetive(z, glava, rob, hrap, q=1.0, rnd=None):
    """Tetive v snopih (n11, ocena n10: »gosta vzporedna resa, visijo v prazno«): iz glave papilarne mišice (začetek v
    mišici) gre na vsakih ~6 točk prostega roba eno deblo (Ø 1 mm) do ≈ 40 %, ki se razcepi v 2 sekundarni (Ø 0,6 mm) in
    vsaka v 3 terciarne (Ø 0,35 mm) do prostega roba; vsako drugo deblo še opornica do hrapave cone (3–4 mm od roba)."""
    rnd = rnd or np.random.default_rng(1)
    seg = (6, 5, 3) if q >= 1 else (4, 3, 3)
    pot = lambda A, B, k, ukriv: [A + (B - A) * t + ukriv * math.sin(math.pi * t) for t in np.linspace(0, 1, k)]
    gs = 6 if q >= 1 else 4
    for g0 in range(0, len(rob) - 1, gs):
        sk = rob[g0:g0 + gs]
        if len(sk) < 2:
            continue
        cil = np.mean(sk, 0)
        if np.linalg.norm(cil - glava) > 0.045:
            continue
        perp = np.cross(cil - glava, [0.2, 0.3, 0.9]); perp /= np.linalg.norm(perp) + 1e-12
        B1 = glava + (cil - glava) * rnd.uniform(0.34, 0.46)
        V, F = cev_np(pot(glava, B1, 6, perp * rnd.uniform(-5e-4, 5e-4)), np.linspace(0.00055, 0.00042, 6), seg[0]); z.dodaj(V, F)
        if q < 1:  # telefon: deblo in neposredne veje do roba (enaka pahljača, manj trikotnikov)
            for e in sk:
                V, F = cev_np(pot(B1, e, 4, perp * rnd.uniform(-3e-4, 3e-4)), np.linspace(0.00024, 0.00018, 4), seg[2]); z.dodaj(V, F)
            continue
        h_ = len(sk) // 2
        for par in (sk[:h_], sk[h_:]):
            if not len(par):
                continue
            pc = np.mean(par, 0)
            B2 = B1 + (pc - B1) * rnd.uniform(0.45, 0.62)
            V, F = cev_np(pot(B1, B2, 5, perp * rnd.uniform(-4e-4, 4e-4)), np.linspace(0.00032, 0.00027, 5), seg[1]); z.dodaj(V, F)
            for e in par:
                V, F = cev_np(pot(B2, e, 5, perp * rnd.uniform(-3e-4, 3e-4)), np.linspace(0.00019, 0.00015, 5), seg[2]); z.dodaj(V, F)
        if (g0 // gs) % 2 == 0 and len(hrap):
            h = hrap[min(len(hrap) - 1, g0 + gs // 2)]
            V, F = cev_np(pot(B1, h, 5, perp * 3e-4), np.linspace(0.00034, 0.00028, 5), seg[1]); z.dodaj(V, F)


def papilarna(dno, vrh, polmer, q=1.0, glav=3, seme=0):
    """Papilarna mišica (n11, ocena n10: »gladek stožec, korenček, trobenta«): debel, top stolpec z vzdolžnimi brazdami,
    ob dnu razširjen in vgreznjen 3 mm v steno, s 4 koreninami (trabekule), ki se razrastejo po steni; zgoraj 2–3 tope
    glave, iz katerih izhajajo tetive. Mere: sprednja-stranska LV ≈ 10 mm debela (Ø), 20–25 mm visoka. Vrne (Zbirka,
    glave) – glava = točka 0,8 mm pod vrhom glave (tetiva se začne v mišici)."""
    rnd = np.random.default_rng(seme)
    dno = np.asarray(dno, float); vrh = np.asarray(vrh, float)
    os_ = vrh - dno; L = np.linalg.norm(os_); os_ /= L
    x = np.cross(os_, [0.3, 0.5, 0.8]); x /= np.linalg.norm(x); y = np.cross(os_, x)
    d0 = dno - os_ * 0.003
    k = max(8, int(18 * q)); seg = max(10, int(20 * q))
    zv = rnd.uniform(-1, 1, 2) * 0.0012
    ts = np.linspace(0, 0.74, k)
    P = [d0 + os_ * (L + 0.003) * t + (x * zv[0] + y * zv[1]) * math.sin(math.pi * t) for t in ts]
    Rs = [polmer * (1 + 1.15 * math.exp(-(t / 0.13) ** 2)) * (1 - 0.18 * t) for t in ts]
    z = Zbirka()
    V, F = stolpec(P, Rs, seg, brazde=0.10, seme=seme, konca=(False, True)); z.dodaj(V, F)
    glave = []
    zac = d0 + os_ * (L + 0.003) * 0.6
    for g in range(glav):
        f = 2 * math.pi * g / glav + rnd.uniform(-0.3, 0.3)
        st = (x * math.cos(f) + y * math.sin(f))
        konec = vrh + st * polmer * (0.3 if glav > 1 else 0.0) + os_ * polmer * rnd.uniform(-0.3, 0.1)
        tt = np.linspace(0, 1, max(5, int(8 * q)))
        Pg = [zac + (konec - zac) * t + st * polmer * 0.15 * math.sin(math.pi * t) for t in tt]
        Rg = [polmer * (0.66 - 0.08 * t) for t in tt]  # tope glave, ne roglji
        V, F = stolpec(Pg, Rg, max(8, int(14 * q)), brazde=0.07, seme=seme + g + 1, konca=(False, True)); z.dodaj(V, F)
        smer = (Pg[-1] - Pg[-2]); smer /= np.linalg.norm(smer) + 1e-12
        glave.append(np.asarray(Pg[-1]) + smer * (Rg[-1] * 0.6))
    # korenine: trabekule, ki iz dna mišice tečejo po steni (zlitje s trabekulami, ne stožec na ravni steni)
    for g in range(3):
        f = 2 * math.pi * g / 3 + rnd.uniform(-0.4, 0.4)
        st = x * math.cos(f) + y * math.sin(f)
        a_ = d0 + os_ * 0.0042 + st * Rs[1] * 0.6
        b_ = a_ + st * rnd.uniform(0.004, 0.006) - os_ * 0.0055  # kratke, v steno (ne »noge« v izolirani skupini)
        tt = np.linspace(0, 1, max(4, int(7 * q)))
        Pk = [a_ + (b_ - a_) * t + os_ * 0.0012 * math.sin(math.pi * t) for t in tt]
        V, F = stolpec(Pk, [polmer * (0.42 - 0.22 * t) for t in tt], max(6, int(10 * q)), brazde=0.05, seme=seme + 10 + g); z.dodaj(V, F)
    return z, glave

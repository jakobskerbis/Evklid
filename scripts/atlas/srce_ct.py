# Srce na osnovi CT (izvozi-organe.py, korak »pozno«: srce_ct). Stene vseh štirih votlin, koren aorte in pljučnega
# debla so iz povprečnega srca 20 zdravih odraslih (CT, end-diastola): Rodero C., Strocchi M., Marciniak M. et al.,
# »Linking statistical shape models and simulated function in the healthy adult human heart«, PLOS Comput Biol 17(4)
# e1008851 (2021), podatki Zenodo 10.5281/zenodo.4593739 (average.tar.gz), CC BY 4.0. Tetraedrska mreža 1 mm z oznakami
# (1 LV, 2 RV, 3 LA, 4 RA, 5 aorta, 6 pljučna arterija, 7–10 ravnine zaklopk, 11–17 ustja: uho, 4 pljučne vene, ZVV, SVV,
# 18–24 obroči ustij) in smerjo mišičnih vlaken po elementih.
#
# Postopek (vse v metrih, osi Blenderja = osi CT: x levo, y zadaj, z gor):
#  1. oslonilne točke (središča 4 zaklopk, konica, ustja ven, ustje levega ušesa) v CT in v Z-Anatomy (+ naša geometrija);
#  2. CT togo v okvir Z-Anatomy (Umeyama brez merila: CT ostane prave velikosti), deli Z-Anatomy pa z afino preslikavo
#     in gladkim poljem odmikov (normirana konvolucija na mreži, oslonilne točke + gosto ujemanje sten) na CT stene;
#  3. stene iz CT (zunanje ploskve tetraedrov), razdeljene na dele (pretin, conus, desno uho …), epikard / endokard;
#  4. endokard: trabekule (relief stene navznoter, v RV in konici LV), glavničaste mišice v preddvorih in ušesih;
#     epikard: maščoba kot volumen (stena navzven) v žlebovih in ob venčnih žilah, ki so do ~80 % potopljene vanjo;
#  5. pokrov štiriprostorskega reza: ravna mreža natanko v ravnini (bisect + fill sten) in slika reza iz tetraedrov
#     (smer vlaken, maščoba, endokard; barve po kriorezini Visible Human, Courtesy of the U.S. National Library of Medicine).
import os, re, math, json, hashlib, subprocess, tarfile, shutil
import numpy as np
import bpy, bmesh
from mathutils import Vector, Matrix
from mathutils.bvhtree import BVHTree
from mathutils.kdtree import KDTree

ZENODO = "https://zenodo.org/records/4593739/files/average.tar.gz?download=1"
ZENODO_SHA = "d787d6470c8a4a6c7bfb808c55e44e35a7bc18f5888847e2b24380beae2703ee"
MM = 0.001
STENE = (1, 2, 3, 4, 5, 6, 18, 19, 20, 21, 22, 23, 24)
DEL_OZNAKE = {1: "lv", 2: "rv", 3: "la", 4: "ra", 5: "ao", 6: "pa", 18: "la", 19: "la", 20: "la", 21: "la", 22: "la", 23: "ra", 24: "ra"}
POKROVI = (7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17)  # ravnine zaklopk in ustij: zaprejo votline (žarki epikard/endokard)


def _sha(pot):
    h = hashlib.sha256()
    with open(pot, "rb") as f:
        for k in iter(lambda: f.read(1 << 20), b""):
            h.update(k)
    return h.hexdigest()


def _prenesi(pot):
    """Zenodo → pot (curl z nadaljevanjem, sicer urllib); preverjeno po SHA-256."""
    zac = pot + ".prenos"
    curl = shutil.which("curl")
    if curl:
        subprocess.call([curl, "-L", "--fail", "--retry", "5", "-C", "-", "-o", zac, ZENODO])
    if not os.path.exists(zac):
        import urllib.request
        urllib.request.urlretrieve(ZENODO, zac)
    os.replace(zac, pot)
    if _sha(pot) != ZENODO_SHA:
        os.remove(pot)
        raise SystemExit("srce_ct: average.tar.gz – SHA-256 se ne ujema (prenos pokvarjen), izbrisano; zaženi znova")


def _razcleni_vtk(b):
    """ASCII VTK (unstructured grid) → P (mm), C (tetraedri), T (oznake), F (vlakna)."""
    def vrstica(zac, od=0):
        i = b.index(zac, od)
        return i, b.index(b"\n", i + 1) + 1

    def stevila(i, j, dt):
        return np.array(b[i:j].split(), dtype=dt)
    _, p0 = vrstica(b"\nPOINTS")
    ct, _ = vrstica(b"\nCELL_TYPES", p0)  # v tej datoteki je CELL_TYPES pred CELLS
    P = stevila(p0, ct, np.float32).reshape(-1, 3)
    _, c0 = vrstica(b"\nCELLS ", ct)
    cd, _ = vrstica(b"\nCELL_DATA", c0)
    C = stevila(c0, cd, np.int64).reshape(-1, 5)[:, 1:].astype(np.int32)
    s, _ = vrstica(b"\nSCALARS ID", cd)
    _, t0 = vrstica(b"\nLOOKUP_TABLE", s)
    fb, f0 = vrstica(b"\nVECTORS fibres", t0)
    T = stevila(t0, fb, np.int32)
    sh, _ = vrstica(b"\nVECTORS sheets", f0)
    F = stevila(f0, sh, np.float32).reshape(-1, 3)
    return P, C, T, F


def nalozi(mapa):
    """Mreža Rodero 2021 iz mape (average.npz kot predpomnilnik; sicer average.tar.gz, ki ga po potrebi prenese)."""
    os.makedirs(mapa, exist_ok=True)
    npz = os.path.join(mapa, "average.npz")
    if os.path.exists(npz):
        d = np.load(npz)
        return d["P"], d["C"], d["T"], d["F"]
    tgz = os.path.join(mapa, "average.tar.gz")
    if not os.path.exists(tgz) or _sha(tgz) != ZENODO_SHA:
        print("[organi] srce_ct: prenašam average.tar.gz (Zenodo 4593739, CC BY 4.0) …", flush=True)
        _prenesi(tgz)
    with tarfile.open(tgz) as t:
        clan = next(m for m in t.getmembers() if m.name.endswith(".vtk"))
        b = t.extractfile(clan).read()
    P, C, T, F = _razcleni_vtk(b)
    del b
    np.savez_compressed(npz, P=P, C=C, T=T, F=F)
    print(f"[organi] srce_ct: {len(P)} točk, {len(C)} tetraedrov", flush=True)
    return P, C, T, F


# ---------- ploskve ----------
def meja(C, T, oznake):
    """Zunanje ploskve unije tetraedrov z oznakami (ploskev ima en sam tetraeder): (ploskve, tetraeder lastnik),
    usmerjene navzven (stran od četrtega oglišča)."""
    keep = np.nonzero(np.isin(T, oznake))[0]
    Ck = C[keep].astype(np.int64)
    fc = np.concatenate([Ck[:, [0, 1, 2]], Ck[:, [0, 3, 1]], Ck[:, [0, 2, 3]], Ck[:, [1, 3, 2]]])
    nasp = np.concatenate([Ck[:, 3], Ck[:, 2], Ck[:, 1], Ck[:, 0]])
    own = np.tile(keep, 4)
    s = np.sort(fc, 1); N = int(C.max()) + 1
    kljuc = (s[:, 0] * N + s[:, 1]) * N + s[:, 2]
    _, inv, cnt = np.unique(kljuc, return_inverse=True, return_counts=True)
    b = cnt[inv] == 1
    return fc[b], own[b], nasp[b]


def usmeri(P, F, nasp):
    n = np.cross(P[F[:, 1]] - P[F[:, 0]], P[F[:, 2]] - P[F[:, 0]])
    obrni = (n * (P[F[:, 0]] - P[nasp])).sum(1) < 0
    F = F.copy(); F[obrni] = F[obrni][:, ::-1]
    return F


def taubin(V, F, korakov=8, lam=0.5, mu=-0.53, fiksno=None):
    e = np.concatenate([F[:, [0, 1]], F[:, [1, 2]], F[:, [2, 0]]])
    e = np.unique(np.sort(e, 1), axis=0)
    n = len(V); st = np.maximum(np.bincount(e.ravel(), minlength=n), 1)[:, None]
    V = V.copy()
    for _ in range(korakov):
        for f in (lam, mu):
            acc = np.zeros_like(V)
            np.add.at(acc, e[:, 0], V[e[:, 1]]); np.add.at(acc, e[:, 1], V[e[:, 0]])
            d = acc / st - V
            if fiksno is not None:
                d[fiksno] = 0
            V += f * d
    return V


def _bvh(V, F):
    return BVHTree.FromPolygons([Vector(v) for v in V], F.tolist(), all_triangles=True)


# ---------- poravnava ----------
def umeyama(A, B, merilo=True):
    """B ≈ s R A + t (najmanjši kvadrati)."""
    ma, mb = A.mean(0), B.mean(0)
    X, Y = A - ma, B - mb
    U, S, Vt = np.linalg.svd(Y.T @ X / len(A))
    D = np.eye(3)
    if np.linalg.det(U) * np.linalg.det(Vt) < 0:
        D[2, 2] = -1
    R = U @ D @ Vt
    s = (S * np.diag(D)).sum() / X.var(0).sum() if merilo else 1.0
    return s, R, mb - s * R @ ma


def afina(A, B):
    """B ≈ A @ M.T + b (12 parametrov)."""
    X = np.c_[A, np.ones(len(A))]
    W, *_ = np.linalg.lstsq(X, B, rcond=None)
    return W[:3].T, W[3]


class Polje:
    """Gladko polje odmikov iz vzorcev (točka, odmik, utež): normirana konvolucija na mreži (razsip uteži in uteženih
    odmikov v celice, Gaussovo glajenje po oseh, deljenje); daleč od vzorcev gre odmik proti 0 (eps)."""

    def __init__(self, lo, hi, korak, sigma, X, D, W, eps=0.02):
        self.lo = np.asarray(lo, float); self.k = korak
        self.n = np.ceil((np.asarray(hi) - self.lo) / korak).astype(int) + 2
        acc = np.zeros(tuple(self.n) + (4,))
        g = (X - self.lo) / korak
        i0 = np.floor(g).astype(int); f = g - i0
        for dx in (0, 1):
            for dy in (0, 1):
                for dz in (0, 1):
                    w = W * np.where(dx, f[:, 0], 1 - f[:, 0]) * np.where(dy, f[:, 1], 1 - f[:, 1]) * np.where(dz, f[:, 2], 1 - f[:, 2])
                    ii = np.clip(i0 + (dx, dy, dz), 0, self.n - 1)
                    np.add.at(acc, (ii[:, 0], ii[:, 1], ii[:, 2]), np.c_[D * w[:, None], w])
        r = int(math.ceil(3 * sigma / korak))
        jed = np.exp(-0.5 * (np.arange(-r, r + 1) * korak / sigma) ** 2)
        for os_ in range(3):
            acc = np.apply_along_axis(lambda x: np.convolve(x, jed, mode="same"), os_, acc)
        wmax = acc[..., 3].max()
        self.mreza = acc[..., :3] / (acc[..., 3:] + eps * wmax)

    def __call__(self, X):
        g = (np.asarray(X) - self.lo) / self.k
        i0 = np.clip(np.floor(g).astype(int), 0, self.n - 2); f = np.clip(g - i0, 0, 1)
        out = np.zeros((len(X), 3))
        for dx in (0, 1):
            for dy in (0, 1):
                for dz in (0, 1):
                    w = np.where(dx, f[:, 0], 1 - f[:, 0]) * np.where(dy, f[:, 1], 1 - f[:, 1]) * np.where(dz, f[:, 2], 1 - f[:, 2])
                    out += self.mreza[i0[:, 0] + dx, i0[:, 1] + dy, i0[:, 2] + dz] * w[:, None]
        return out


def _tocke(me):
    a = np.empty(len(me.vertices) * 3); me.vertices.foreach_get("co", a)
    return a.reshape(-1, 3)


def _nastavi(me, V):
    me.vertices.foreach_set("co", np.asarray(V, float).ravel()); me.update()


def oslonilne_ct(P, C, T):
    """Oslonilne točke CT (mm)."""
    c = lambda t: P[np.unique(C[T == t])].mean(0)
    lv = P[np.unique(C[T == 1])]
    mv = c(7)
    apex = lv[np.linalg.norm(lv - mv, axis=1).argmax()]
    return {"konica": apex, "mitralna": mv, "trikuspidalna": c(8), "aortna": c(9), "pljucna": c(10), "uho": c(11),
            "lzpv": c(12), "lspv": c(13), "dspv": c(14), "dzpv": c(15), "zvv": c(16), "svv": c(17)}


def _ustje(me_zila, bvh_stena, do=0.004):
    """Središče ustja: oglišča žile, ki so manj kot `do` od stene votline (sicer najbližjih 10 %)."""
    V = _tocke(me_zila)
    d = np.array([bvh_stena.find_nearest(Vector(v))[3] for v in V])
    m = d < do
    if m.sum() < 8:
        m = d <= np.quantile(d, 0.1)
    return V[m].mean(0)


def oslonilne_z(po, tocke4):
    """Oslonilne točke Z-Anatomy (m) iz vrstic po imenu; tocke4 = [konica LV, mitralna, trikuspidalna] (srce_dodatki)."""
    def bvh(ime):
        me = po[ime][1]; return BVHTree.FromPolygons([v.co for v in me.vertices], [p.vertices for p in me.polygons])
    s = lambda ime: _tocke(po[ime][1]).mean(0)
    la, ra = bvh("Left atrium"), bvh("Right atrium")
    L = {"konica": np.array(tocke4[0]), "mitralna": np.array(tocke4[1]), "trikuspidalna": np.array(tocke4[2]),
         "aortna": s("Semilunar cusps of aortic valve (lastno)"), "pljucna": s("Semilunar cusps of pulmonary valve (lastno)"),
         "lzpv": _ustje(po["Left superior pulmonary vein"][1], la), "lspv": _ustje(po["Left inferior pulmonary vein"][1], la),
         "dspv": _ustje(po["Right inferior pulmonary vein"][1], la), "dzpv": _ustje(po["Right superior pulmonary vein"][1], la),
         "zvv": _ustje(po["Superior vena cava"][1], ra), "svv": _ustje(po["Inferior vena cava (thoracic part)"][1], ra)}
    if "Left auricle" in po:  # ustje levega ušesa: rob, kjer je bilo uho odrezano od preddvora
        me = po["Left auricle"][1]
        bm = bmesh.new(); bm.from_mesh(me)
        rob = [v.co.copy() for v in bm.verts if v.is_boundary]; bm.free()
        if rob:
            L["uho"] = np.array(rob).mean(0)
    return L


def stene(P, C, T, korakov=8):
    """Zunanje ploskve sten (unija oznak STENE) kot ena zaprta mreža: V (mm, Taubin), F, oznaka ploskve, epi (True =
    epikard / zunanja ploskev, False = endokard / v votlini; žarek po normali zadene steno ali pokrov ustja)."""
    Fb, own, nasp = meja(C, T, STENE)
    Fb = usmeri(P, Fb, nasp)
    u, inv = np.unique(Fb, return_inverse=True)
    V = P[u].astype(float); F = inv.reshape(-1, 3)
    oz = T[own]
    V = taubin(V, F, korakov)
    # pokrovi zaklopk in ustij zaprejo votline (samo za žarke)
    Fp, _, nasp_p = meja(C, T, POKROVI)
    bv = BVHTree.FromPolygons([Vector(v) for v in np.r_[V, P]], np.r_[F, Fp + len(V)].tolist(), all_triangles=True)
    n = np.cross(V[F[:, 1]] - V[F[:, 0]], V[F[:, 2]] - V[F[:, 0]]); n /= np.linalg.norm(n, axis=1)[:, None] + 1e-12
    c = V[F].mean(1)
    rng = np.random.default_rng(3)
    zad = np.zeros(len(F))
    for k in range(3):
        d = n + rng.normal(0, 0.25, n.shape); d /= np.linalg.norm(d, axis=1)[:, None]
        for i in range(len(F)):
            if bv.ray_cast(Vector(c[i] + d[i] * 0.05), Vector(d[i]), 200.0)[0] is not None:
                zad[i] += 1
    epi = zad < 2
    # glajenje oznake epi po sosedih (osamljene ploskve)
    return V, F, oz, epi


# skupine sten Z-Anatomy → oznake CT za gosto ujemanje (Z-Anatomy stene se po poravnavi zamenjajo s CT)
UJEMANJE = {"Left ventricle": (1,), "Interventricular septum": (1,), "Right ventricle": (1, 2), "Conus arteriosus": (2,),
            "Left atrium": (3, 19, 20, 21, 22), "Right atrium": (4, 23, 24), "Right auricle": (4,)}
IZPUSTI_OSL = ("uho",)
# n10 (ocena n9: »preštevilne veje, gost splet po vseh stenah«): ostanejo glavna debla in večje veje v žlebovih
IZPUSTI_ZILE = {"Anterior cardiac veins", "Inferior vein of left ventricle", "Oblique vein of left atrium",
                "Sinoatrial nodal branch of right coronary artery", "Conus branch of right coronary artery",
                "Right inferolateral branch of right coronary artery"}


class Poravnava:
    """Z-Anatomy (m) → CT okvir: x = Umeyama(z) nato zaporedje gladkih polj odmikov (vsako na trenutnih legah)."""

    def __init__(self, Lz, Lc, po, V, F, oz, koraki=((0.016, 3), (0.010, 3), (0.006, 2)), vzorcev=5000):
        k = [x for x in Lz if x in Lc and x not in IZPUSTI_OSL]
        A = np.array([Lz[x] for x in k]); B = np.array([Lc[x] for x in k])
        self.s, self.R, self.t = umeyama(A, B)
        self.polja = []
        bvh = {}
        for ime, ozn in UJEMANJE.items():
            m = np.isin(oz, ozn)
            bvh[ime] = _bvh(V, F[m])
        rng = np.random.default_rng(1)
        Zs = {ime: _tocke(po[ime][1]) for ime in UJEMANJE if ime in po}
        for ime in Zs:
            if len(Zs[ime]) > vzorcev // 6:
                Zs[ime] = Zs[ime][rng.choice(len(Zs[ime]), vzorcev // 6, replace=False)]
        vse = np.concatenate(list(Zs.values()) + [A])
        lo, hi = vse.min(0), vse.max(0)
        lo = self._s(lo[None])[0]; hi = self._s(hi[None])[0]
        lo, hi = np.minimum(lo, hi) - 0.06, np.maximum(lo, hi) + 0.06
        for sigma, krat in koraki:
            for _ in range(krat):
                X, D, W = [], [], []
                Ax = self(A)
                X.append(Ax); D.append(B - Ax); W.append(np.full(len(A), 25.0))
                for ime, Zp in Zs.items():
                    Xp = self(Zp)
                    Q = np.array([bvh[ime].find_nearest(Vector(x), 0.015)[0] or Vector(x) for x in Xp])
                    d = Q - Xp; ok = np.linalg.norm(d, axis=1) < 0.014
                    X.append(Xp[ok]); D.append(d[ok]); W.append(np.ones(ok.sum()))
                X, D, W = map(np.concatenate, (X, D, W))
                self.polja.append(Polje(lo, hi, 0.002, sigma, X, D * 0.8, W))
            ost = np.linalg.norm(self(A) - B, axis=1) * 1000
            print(f"[organi] srce_ct: poravnava σ {sigma * 1000:.0f} mm: oslonilne točke ostanek {ost.mean():.1f} mm (največ {ost.max():.1f})", flush=True)

    def _s(self, X):
        return self.s * np.asarray(X) @ self.R.T + self.t

    def __call__(self, X):
        X = self._s(X)
        for p in self.polja:
            X = X + p(X)
        return X


# ---------- pomožno ----------
def _sumi(X, mera, seme=0):
    """Gladek vrednostni šum 0–1 (mreža `mera` m, trilinearno, zgoščena oglišča mreže)."""
    g = np.asarray(X) / mera + seme * 17.31
    i0 = np.floor(g).astype(np.int64); f = g - i0; f = f * f * (3 - 2 * f)
    def h(i):
        n = (i[:, 0] * 73856093) ^ (i[:, 1] * 19349663) ^ (i[:, 2] * 83492791) ^ (seme * 2654435761)
        n = (n ^ (n >> 13)) * 1274126177
        return ((n ^ (n >> 16)) & 0xFFFF) / 65535.0
    out = 0
    for dx in (0, 1):
        for dy in (0, 1):
            for dz in (0, 1):
                w = np.where(dx, f[:, 0], 1 - f[:, 0]) * np.where(dy, f[:, 1], 1 - f[:, 1]) * np.where(dz, f[:, 2], 1 - f[:, 2])
                out = out + w * h(i0 + (dx, dy, dz))
    return out


def _robovi(F, n):
    e = np.unique(np.sort(np.concatenate([F[:, [0, 1]], F[:, [1, 2]], F[:, [2, 0]]]), 1), axis=0)
    return e, np.maximum(np.bincount(e.ravel(), minlength=n), 1)


def _gladi(A, e, st, krat):
    A = np.asarray(A, float).copy()
    for _ in range(krat):
        acc = np.bincount(e[:, 0], weights=A[e[:, 1]], minlength=len(A)) + np.bincount(e[:, 1], weights=A[e[:, 0]], minlength=len(A))
        A = 0.5 * A + 0.5 * acc / st
    return A


def _normale_oglisc(V, F):
    n = np.cross(V[F[:, 1]] - V[F[:, 0]], V[F[:, 2]] - V[F[:, 0]])
    N = np.zeros_like(V)
    for k in range(3):
        np.add.at(N, F[:, k], n)
    return N / (np.linalg.norm(N, axis=1)[:, None] + 1e-15)


def _kd(T_):
    kd = KDTree(len(T_))
    for i, p in enumerate(T_):
        kd.insert(Vector(p), i)
    kd.balance()
    return kd


def _razdalja(kd, X, do):
    out = np.full(len(X), do)
    for i, x in enumerate(X):
        r = kd.find(Vector(x))
        if r[0] is not None:
            out[i] = min(do, r[2])
    return out


def prenesi_na_steno(X, Z, bvh_z, bvh_epi, bvh_endo, stran=None, doseg=0.010):
    """Strukture ob steni (venčne žile, trabekule, glavničaste mišice, papilarne mišice …): oglišče x (po poravnavi) dobi
    lego q + n · d, kjer je d njegova razdalja do stene Z-Anatomy pred poravnavo, q najbližja točka stene CT na isti
    strani (`stran` 'epi'/'endo' ali po večini), n normala CT stene. Od `doseg` naprej mehko ostane poravnana lega."""
    dz = np.array([bvh_z.find_nearest(Vector(z))[3] or 1.0 for z in Z])
    if stran is None:
        de = np.array([bvh_epi.find_nearest(Vector(x))[3] or 1.0 for x in X])
        dn = np.array([bvh_endo.find_nearest(Vector(x))[3] or 1.0 for x in X])
        stran = "epi" if (de < dn).mean() > 0.5 else "endo"
    b = bvh_epi if stran == "epi" else bvh_endo
    Y = X.copy()
    for i, x in enumerate(X):
        q, n, _, _ = b.find_nearest(Vector(x))
        if q is None:
            continue
        w = min(1.0, max(0.0, (doseg * 1.6 - dz[i]) / (doseg * 0.6)))
        Y[i] = (1 - w) * x + w * (np.array(q) + np.array(n) * dz[i])
    return Y, stran


def _mesh(ime, V, F):
    me = bpy.data.meshes.new(ime)
    me.from_pydata([tuple(v) for v in V], [], [tuple(map(int, f)) for f in F]); me.update()
    for p in me.polygons:
        p.use_smooth = True
    return me


# ---------- deli sten CT ----------
def _zarek_zadene(bvh, C_, D_, do):
    out = np.full(len(C_), -1)
    for i in range(len(C_)):
        h = bvh.ray_cast(Vector(C_[i] + D_[i] * 2e-5), Vector(D_[i]), do)
        if h[0] is not None:
            out[i] = h[2]
    return out


def razdeli_stene(V, F, oz, epi, L):
    """Del vsake ploskve: 0 LV, 1 pretin, 2 RV, 3 conus, 4 LA, 5 RA, 6 desno uho, 7 koren aorte, 8 koren pljučnega debla."""
    n = np.cross(V[F[:, 1]] - V[F[:, 0]], V[F[:, 2]] - V[F[:, 0]]); n /= np.linalg.norm(n, axis=1)[:, None] + 1e-15
    c = V[F].mean(1)
    bvh = _bvh(V, F)
    d = np.zeros(len(F), int)
    la = np.isin(oz, (3, 18, 19, 20, 21, 22)); ra = np.isin(oz, (4, 23, 24))
    d[oz == 2] = 2; d[la] = 4; d[ra] = 5; d[oz == 5] = 7; d[oz == 6] = 8
    # pretin: endokard LV, ki gleda v desni prekat (žarek čez votlino zadene prosto steno RV), in endokard LV za njim
    i1 = np.nonzero((oz == 1) & ~epi)[0]
    z = _zarek_zadene(bvh, c[i1], n[i1], 0.08)
    sr = set(i1[(z >= 0) & (oz[np.maximum(z, 0)] == 2)].tolist())
    z2 = _zarek_zadene(bvh, c[i1], -n[i1], 0.022)
    sl = i1[[zz in sr for zz in z2]]
    d[list(sr)] = 1; d[sl] = 1
    stran = np.zeros(len(F), int); stran[list(sr)] = 1; stran[sl] = -1  # pretin: 1 desna (RV) stran, -1 leva (LV)
    # conus: RV pod pljučno zaklopko (do 2,2 cm)
    os_ = L["pljucna"] - L["trikuspidalna"]; os_ /= np.linalg.norm(os_)
    pod = (c - L["pljucna"]) @ os_
    d[(d == 2) & (pod > -0.022) & (np.linalg.norm(c - L["pljucna"], axis=1) < 0.03)] = 3
    # desno uho: ploskve RA v krogli okoli najbolj sprednje-zgornje točke (ob korenu aorte)
    smer = np.array([-0.15, -1.0, 0.6]); smer /= np.linalg.norm(smer)
    cr = c[ra].mean(0); tip = c[ra][((c[ra] - cr) @ smer).argmax()]
    os2 = (tip - cr) / np.linalg.norm(tip - cr)
    d[ra & (np.linalg.norm(c - tip, axis=1) < 0.026) & (((c - cr) @ os2) > 0.4 * np.linalg.norm(tip - cr))] = 6
    return d, stran


DELI_CT = [  # (ime vozlišča, tkivo, del)
    ("Left ventricle", "miokard", "levi-prekat"), ("Interventricular septum", "miokard", "medprekatni-pretin"),
    ("Right ventricle", "miokard", "desni-prekat"), ("Conus arteriosus", "miokard", "conus-arteriosus"),
    ("Left atrium", "miokard", "levi-preddvor"), ("Right atrium", "miokard", "desni-preddvor"),
    ("Right auricle", "miokard", "desno-srcno-uho"), ("Root of aorta", "aorta", "aorta"),
    ("Root of pulmonary trunk", "pljucna", "pljucno-deblo")]


def relief(V, F, oz, epi, dl, L, h_masca, stran=None):
    """Odmik oglišč sten: epikard navzven za debelino maščobe, endokard v votlino za trabekule (RV povsod razen conusa,
    LV v konici in ob papilarnih mišicah, glavničaste mišice v desnem ušesu). Vrne nove lege in masko maščobe (0–1)."""
    nV = len(V)
    N = _normale_oglisc(V, F)
    e, st = _robovi(F, nV)
    fe = np.zeros(nV); cnt = np.zeros(nV)
    for k in range(3):
        np.add.at(fe, F[:, k], epi.astype(float)); np.add.at(cnt, F[:, k], 1)
    samo_epi = fe >= cnt - 1e-9; samo_endo = fe <= 1e-9
    # trabekule: grebeni vzdolž dolge osi (od konice proti bazi), razmik ~4 mm, prepleteni (zvit šum)
    dv = np.full(nV, -1)
    for k in range(3):
        dv[F[:, k]] = np.maximum(dv[F[:, k]], dl)
    ax = L["mitralna"] - L["konica"]; dol = np.linalg.norm(ax); ax /= dol
    t = np.clip((V - L["konica"]) @ ax / dol, 0, 1)
    p = V - L["konica"]; p -= np.outer(p @ ax, ax)
    ref = np.cross(ax, [0, 0, 1.0]); ref /= np.linalg.norm(ref); ref2 = np.cross(ax, ref)
    th = np.arctan2(p @ ref2, p @ ref)
    r = np.linalg.norm(p, axis=1)
    w1 = _sumi(V, 0.012, 1) - 0.5; w2 = _sumi(V, 0.005, 2) - 0.5
    u = th * np.maximum(r, 0.01) / 0.0042 + 3.0 * w1 + 1.2 * w2 + t * 4
    greben = (1 - np.abs(2 * (u - np.floor(u)) - 1)) ** 2.2
    mreza2 = _sumi(V, 0.0035, 3)
    tr = np.zeros(nV)
    rv = (dv == 2) | (dv == 1)  # RV in septalna stran (pretin ima trabekule na desni strani)
    lv = dv == 0
    tr[rv] = 2.0e-3 * (0.65 * greben[rv] + 0.45 * np.clip(mreza2[rv] - 0.45, 0, 1) * 2)
    tr[lv] = 2.2e-3 * np.clip((0.72 - t[lv]) / 0.3, 0, 1) * (0.7 * greben[lv] + 0.3 * mreza2[lv])
    tr[dv == 3] = 0  # conus gladek (iztočni del)
    # pretin: na levi strani gladek (LV septum je gladek), na desni trabekule v spodnjih 2/3
    sept = dv == 1
    tr[sept] *= np.clip((0.75 - t[sept]) / 0.25, 0, 1)
    # glavničaste mišice: vzporedni grebeni v desnem ušesu in sprednji steni RA (razmik ~3 mm)
    ru = dv == 6
    u2 = (V @ np.array([0.0, 0.3, 1.0])) / 0.003 + 2.0 * w1
    tr[ru] = 1.3e-3 * (1 - np.abs(2 * (u2[ru] - np.floor(u2[ru])) - 1)) ** 3
    tr *= samo_endo
    tr = _gladi(tr, e, st, 1)
    # maščoba (epikard): debelina iz klicatelja (žlebovi, žile), režnjiči ±0,4 mm
    h = h_masca * samo_epi
    lob = _sumi(V, 0.003, 7)
    h = np.where(h > 2e-4, h + 4e-4 * (lob - 0.5) * np.clip(h / 1.5e-3, 0, 1), h)
    h = _gladi(h, e, st, 3)
    # n10 (ocena n9: »stena LV 5–7 mm«): CT povprečje (živo srce v diastoli) ima LV ≈ 10 mm; preparat (mrtvaško
    # skrčenje, fiksacija) in učbenik kažeta 12–15 mm. Endokard LV (prosta stena +3,2 mm, leva stran pretina +2,2 mm)
    # premaknemo v votlino; konica (tanjša) in pas ob mitralnem obroču ter iztoku v aorto ostaneta (zaklopke se ne premaknejo).
    deb = np.zeros(nV)
    if stran is not None:
        kol = np.zeros(len(F)); kol[(dl == 0) & ~epi] = 3.2e-3; kol[(dl == 1) & (stran == -1) & ~epi] = 2.2e-3
        mn = np.full(nV, 1.0); mx = np.zeros(nV)
        for k in range(3):
            np.minimum.at(mn, F[:, k], kol); np.maximum.at(mx, F[:, k], kol)
        deb = np.where(mn > 0, mx, 0.0)
        w = np.clip((t - 0.04) / 0.22, 0, 1) * np.clip((0.93 - t) / 0.2, 0, 1)
        w *= np.clip((np.linalg.norm(V - L["aortna"], axis=1) - 0.013) / 0.012, 0, 1)
        deb = _gladi(deb * w, e, st, 4) * samo_endo
    V2 = V + N * (h + tr + deb)[:, None]
    # pod ~0,45 mm brez barve maščobe (mišica se vidi skozi); ostra meja (ocena n9: »zabrisan trak«)
    return V2, np.clip((h - 0.45e-3) / 0.35e-3, 0, 1), tr


def debelina_mascobe(V, F, oz, epi, X_zile):
    """Debelina epikardialne maščobe (m) na ogliščih: venčni žleb ≈ 6 mm, medprekatna žleba ≈ 3,5 mm (proti konici
    tanjše), ob venčnih žilah do ≈ 2,6 mm (žile do ~80 % potopljene), na prosti steni RV tanke lise, LV skoraj brez."""
    nV = len(V)
    vent = np.isin(oz, (1, 2)); atr = np.isin(oz, (3, 4, 18, 19, 20, 21, 22, 23, 24))
    def mejna(a, b):
        ma = np.zeros(nV, bool); mb = np.zeros(nV, bool)
        for k in range(3):
            ma[F[a & epi, k]] = True; mb[F[b & epi, k]] = True
        return np.nonzero(ma & mb)[0]
    j_av = mejna(vent, atr)
    j_iv = mejna(oz == 1, oz == 2)
    j_ar = mejna(np.isin(oz, (5, 6)), vent | atr)
    d_av = _razdalja(_kd(V[j_av]), V, 0.03) if len(j_av) else np.full(nV, 0.03)
    d_iv = _razdalja(_kd(V[j_iv]), V, 0.03) if len(j_iv) else np.full(nV, 0.03)
    d_ar = _razdalja(_kd(V[j_ar]), V, 0.03) if len(j_ar) else np.full(nV, 0.03)
    d_z = _razdalja(_kd(X_zile), V, 0.03) if len(X_zile) else np.full(nV, 0.03)
    g = lambda d, s: np.exp(-(d / s) ** 2)
    zleb = np.maximum.reduce([g(d_av, 0.012), g(d_iv, 0.009)])
    # n10: venčne žile v žlebovih pogreznjene v maščobo (ocena n9: »rezanci na epikardu«): ob žili v žlebu ≥ 3 mm
    h = np.maximum.reduce([6.0e-3 * g(d_av, 0.0075), 3.8e-3 * g(d_iv, 0.006), 2.5e-3 * g(d_ar, 0.006),
                           3.0e-3 * np.clip(zleb * 1.5, 0, 1) * np.clip(1 - d_z / 0.0045, 0, 1) ** 0.7])  # ob vejah na prosti steni le malo (n8: »reke« maščobe)
    # n10: medpreddvorni žleb (Waterston) zapolni maščoba: epikard LA in RA, ki sta bližje kot 8 mm, se razširi do stika
    # (ocena n9: »nazobčana črna vrzel med preddvoroma nad pretinom«, crux)
    # enako zadnji venčni žleb (preddvor – prekat, ocena n9: »črna razpoka ob venčnem sinusu«)
    la = np.zeros(nV, bool); ra = np.zeros(nV, bool); ve = np.zeros(nV, bool)
    la[F[np.isin(oz, (3, 18, 19, 20, 21, 22)) & epi].ravel()] = True; ra[F[np.isin(oz, (4, 23, 24)) & epi].ravel()] = True
    ve[F[np.isin(oz, (1, 2)) & epi].ravel()] = True
    for A_, B_, do in ((la, ra, 0.008), (ra, la, 0.008), (la, ve, 0.009), (ve, la, 0.009), (ra, ve, 0.008), (ve, ra, 0.008)):
        ia = np.nonzero(A_ & ~B_)[0]
        if len(ia) and B_.any():
            dd = _razdalja(_kd(V[B_]), V[ia], 0.01)
            m = dd < do
            h[ia[m]] = np.maximum(h[ia[m]], dd[m] * 0.62 + 0.0004)
    vrv = np.zeros(nV); vrv[F[oz == 2].ravel()] = 1
    lise = np.clip((_sumi(V, 0.018, 11) - 0.62) / 0.2, 0, 1) * 1.0e-3 * vrv * np.clip(zleb * 2.5, 0, 1)
    h = np.maximum(h, lise)
    return h


def levo_uho(P, C, T, premik, bvh_epi, c_la, sk=0.0):
    """Levo srčno uho (CT ga ima samo do ustja, oznaka 11): zaprta votla vrečka iz ustja naprej-levo ob levem robu
    pljučnega debla, nazobčana (3–4 režnji z zažemki), sploščena ob steno, stena 1,5 mm z glavničastimi grebeni znotraj."""
    q = P[np.unique(C[T == 11])] * MM + premik
    c0 = q.mean(0)
    _, _, vt = np.linalg.svd(q - c0); n = vt[2]
    if (c0 - c_la) @ n < 0:
        n = -n
    r0 = np.percentile(np.linalg.norm((q - c0) - np.outer((q - c0) @ n, n), axis=1), 90)
    cilj = np.array([0.30, -1.0, -0.45]); cilj /= np.linalg.norm(cilj)  # naprej in navzdol čez levi rob pljučnega debla
    k = 64; L = 0.040
    a = c0 - n * 0.003; b = c0 + n * 0.010; cc = b + (n * 0.3 + cilj).astype(float) / np.linalg.norm(n * 0.3 + cilj) * (L - 0.013)
    S_ = np.linspace(0, 1, k)
    pot = np.array([(1 - s) ** 2 * a + 2 * (1 - s) * s * b + s * s * cc for s in S_])
    # ob epikard: središčnica vsaj R + 0,6 mm od stene (vrečka leži na bazi levega prekata / korenu pljučnega debla)
    R = r0 * 1.08 * (1 + 0.22 * np.sin(np.pi * np.minimum(S_ * 1.3, 1))) * np.sqrt(np.clip(1 - S_ ** 6, 0, 1))
    R[-1] = 0
    for _ in range(3):
        for i in range(4, k):
            h = bvh_epi.find_nearest(Vector(pot[i]))
            if h[0] is None:
                continue
            nn = np.array(h[1]); d = (pot[i] - np.array(h[0])) @ nn
            if d < R[i] * 0.62 + 0.0006:
                pot[i] += nn * (R[i] * 0.62 + 0.0006 - d)
        pot[1:-1] = 0.25 * pot[:-2] + 0.5 * pot[1:-1] + 0.25 * pot[2:]
    # okvirji
    tg = np.gradient(pot, axis=0); tg /= np.linalg.norm(tg, axis=1)[:, None]
    up = np.array([0, 0, 1.0])
    seg = 36; th = np.linspace(0, 2 * np.pi, seg, endpoint=False)
    zun, notr = [], []
    for i in range(k):
        h = bvh_epi.find_nearest(Vector(pot[i])); nn = np.array(h[1]) if h[0] is not None else up
        x = nn - tg[i] * (nn @ tg[i]); x /= np.linalg.norm(x) + 1e-12; y = np.cross(tg[i], x)
        s = S_[i]
        reznji = 1 - 0.08 * np.clip(np.sin(2 * np.pi * (s * 3.0 + 0.15)), 0, 1) ** 2 * (s > 0.25)
        zob = 1 + 0.05 * np.sin(3 * th + 7 * s) + 0.025 * np.sin(7 * th - 11 * s)
        Ri = R[i] * reznji * (zob if s > 0.2 else np.ones(seg))
        ex = 0.62 if s > 0.2 else 0.62 + (0.2 - s) / 0.2 * 0.38  # ob ustju okroglo
        zun.append(pot[i] + Ri[:, None] * (np.cos(th)[:, None] * x * ex + np.sin(th)[:, None] * y))
        Rn = np.maximum(Ri - 0.0015 - 0.0004 * np.sin(9 * th + 30 * s) ** 2, Ri * 0.35)
        notr.append(pot[i] + Rn[:, None] * (np.cos(th)[:, None] * x * ex + np.sin(th)[:, None] * y))
    Vz = np.array(zun).reshape(-1, 3); Vn = np.array(notr).reshape(-1, 3)
    Vv = np.r_[Vz, Vn]; o = len(Vz)
    Fs = []
    for i in range(k - 1):
        for j in range(seg):
            a_, b_ = i * seg + j, i * seg + (j + 1) % seg
            c_, d_ = a_ + seg, b_ + seg
            Fs += [(a_, b_, d_), (a_, d_, c_)]                      # zunaj
            Fs += [(o + a_, o + d_, o + b_), (o + a_, o + c_, o + d_)]  # znotraj (obrnjeno)
    for j in range(seg):  # obroč ob ustju poveže zunanjo in notranjo ploskev
        a_, b_ = j, (j + 1) % seg
        Fs += [(a_, o + b_, b_), (a_, o + a_, o + b_)]
    return Vv, np.array(Fs)


def srce_ct(osnovni, cfg, tmp):
    """Korak »pozno«: stene iz CT, poravnava ostalih delov, maščoba, trabekule, levo uho, deli sten, zaprt volumen."""
    mapa = cfg.get("_ct_mapa")
    P, C, T, Fv = nalozi(mapa)
    shramba = os.path.join(mapa, "stene-v1.npz")
    if os.path.exists(shramba):
        d = np.load(shramba); V, F, oz, epi = d["V"], d["F"], d["oz"], d["epi"]
    else:
        V, F, oz, epi = stene(P, C, T)
        np.savez(shramba, V=V, F=F, oz=oz, epi=epi)
    po = {r[0]: r for r in osnovni}
    Lz = oslonilne_z(po, cfg["_tocke4"])
    Lc = {k: v * MM for k, v in oslonilne_ct(P, C, T).items()}
    k = [x for x in Lc if x in Lz and x not in IZPUSTI_OSL]
    premik = np.mean([Lz[x] for x in k], 0) - np.mean([Lc[x] for x in k], 0)
    V = V * MM + premik; Lc = {x: v + premik for x, v in Lc.items()}
    por = Poravnava(Lz, Lc, po, V, F, oz)
    # stene Z-Anatomy (pred poravnavo) za prenos struktur ob steni
    zst = [po[n][1] for n in list(UJEMANJE) + ["Left auricle"] if n in po]
    Vz_ = np.concatenate([_tocke(m) for m in zst]); off = np.cumsum([0] + [len(m.vertices) for m in zst])
    Fz_ = [[off[i] + v for v in p.vertices] for i, m in enumerate(zst) for p in m.polygons]
    bvh_z = BVHTree.FromPolygons([Vector(v) for v in Vz_], Fz_)
    bvh_epi = _bvh(V, F[epi]); bvh_endo = _bvh(V, F[~epi])
    odstrani = set(UJEMANJE) | {"Left auricle", "Supraventricular crest"}
    nove, zile = [], []
    PRENOS = [  # (regex na ime/tkivo, stran, doseg)
        (r"vencna-", "epi", 0.012), (r"Trabecul|trabecula|Musculi pectinati|Crista terminalis|Fossa ovalis|Limbus|Valve of (inferior|coronary)|Conducting|Membranous", "endo", 0.010),
    ]
    for r in osnovni:
        # n9: zaklopke, tetive in papilarne mišice na novo na obročih CT (zaklopke_ct); pljučne vene kot krni iz ustij CT
        # n10: mesnate trabekule na novo na steni CT (trabekule_ct); manj venčnih vej (ocena n9: »gost splet špagetov«)
        if r[0] in odstrani or re.search(r"leaflet|Chordae|Semilunar|papillary muscle|pulmonary vein|^Trabeculae carneae", r[0]) or r[0] in IZPUSTI_ZILE:
            continue
        Z = _tocke(r[1]); X = por(Z)
        for rx, stran, dos in PRENOS:
            if re.search(rx, r[0] + " " + r[2]):
                X, _ = prenesi_na_steno(X, Z, bvh_z, bvh_epi, bvh_endo, stran, dos)
                break
        if r[2] == "vencna-arterija" or r[2] == "vencna-vena":
            X = _odebeli_cev(r[1], X, 1.2 if r[2] == "vencna-arterija" else 1.15)  # n8: »tanke niti«; n9: »debele cevi« → 1,2
            for i, x in enumerate(X):  # n10: 0,7 mm globlje (napol v maščobi, ne na epikardu)
                q, nn, _, _ = bvh_epi.find_nearest(Vector(x))
                if q is not None:
                    X[i] = x - np.array(nn) * 0.0007
        _nastavi(r[1], X)
        if r[2].startswith("vencna-"):
            zile.append(X)
        nove.append(r)
    popravi_zile(nove)
    print(f"[organi] srce_ct: {len(nove)} delov Z-Anatomy poravnanih na CT, {len(osnovni) - len(nove)} sten zamenjanih", flush=True)
    dl, stran_p = razdeli_stene(V, F, oz, epi, Lc)
    h = debelina_mascobe(V, F, oz, epi, np.concatenate(zile) if zile else np.zeros((0, 3)))
    V2, masca, tr = relief(V, F, oz, epi, dl, Lc, h, stran_p)
    cfg["_ct"] = dict(P=P, C=C, T=T, Fv=Fv, premik=premik, V=V, V2=V2, F=F, oz=oz, epi=epi, dl=dl, masca=masca, L=Lc)
    # votline po reliefu (odebeljena stena LV): zaklopke, papilarne mišice in trabekule na novem endokardu
    lvF = F[((dl == 0) | ((dl == 1) & (stran_p == -1))) & ~epi]
    rvF = F[((dl == 2) | ((dl == 1) & (stran_p == 1))) & ~epi]
    bvh_lv = _bvh(V2, lvF); bvh_rv = _bvh(V2, rvF)
    tel = cfg.setdefault("_telefon", {})
    nove += zaklopke_ct(P, C, T, premik, Lc, bvh_lv, bvh_rv, tel)
    nove += pljucne_vene_ct(P, C, T, premik, Lc, tel, _bvh(V2, F[epi]))
    nove += trabekule_ct(V2, lvF, rvF, Lc, nove, tel, tmp)
    smr = next((r for r in nove if r[0].startswith("Septomarginal trabecula")), None)
    pap = next((r for r in nove if r[0].startswith("Anterior papillary muscle of right ventricle")), None)
    if smr is not None and pap is not None:
        smr[1] = moderatorni_trak(_tocke(smr[1]), pap[1], bvh_rv, smr)
    # en zaprt volumen: poenostavimo skupaj (računalnik, telefon), nato razdelimo po delih (brez razpok med deli)
    vrstice = _deli_iz_unije(V2, F, dl, epi, masca, cfg, tmp, ohrani=np.clip(tr / 1.2e-3, 0, 1))
    nove += vrstice
    Vu, Fu = levo_uho(P, C, T, premik, bvh_epi, Lc["mitralna"])
    me = _mesh("Left auricle", Vu, Fu)
    cfg.setdefault("_telefon", {})["Left auricle"] = _poenostavi(me, 0.3, tmp)  # telefon 30 %, računalnik 65 % (n10: proračun trikotnikov)
    me = _poenostavi(me, 0.65, tmp, "Left auricle")
    nove.append(["Left auricle", me, "miokard", "levo-srcno-uho", "Left auricle (lastno, CT) / Heart.g", 0])  # brez poenostavitve (oglato)
    cfg["_tocke4"] = [Vector(Lc["konica"]), Vector(Lc["mitralna"]), Vector(Lc["trikuspidalna"])]
    if cfg.get("_out"):
        zile_m = [r[1] for r in nove if r[2].startswith("vencna-")]
        cfg["_volumen"] = volumen(cfg["_ct"], os.path.join(cfg["_out"], "srce-volumen.png"), zile=zile_m)
    return nove


def _deli_iz_unije(V, F, dl, epi, masca, cfg, tmp, ohrani=None):
    """Unija sten → mreža z materialnim indeksom po delu, poenostavljena za računalnik in telefon (cfg['ct']['cilj']),
    razdeljena na vrstice; telefonske mreže v cfg['_telefon']. Maske PEKA (R maščoba, G zunaj) so na ogliščih."""
    cilj = cfg.get("ct", {}).get("cilj", (110_000, 30_000))
    me = _mesh("ct-unija", V, F)
    me.polygons.foreach_set("material_index", dl.astype(np.int32))
    for _ in range(len(DELI_CT)):
        me.materials.append(None)
    G = np.zeros(len(V))
    for k in range(3):
        np.maximum.at(G, F[:, k], epi.astype(float))
    at = me.color_attributes.new("PEKA", "FLOAT_COLOR", "POINT")
    col = np.zeros((len(V), 4)); col[:, 0] = masca; col[:, 1] = G; col[:, 3] = 1
    at.data.foreach_set("color", col.ravel())
    izhod = {}
    for i, c in enumerate(cilj):
        o = bpy.data.objects.new("ct-unija", me); tmp.objects.link(o)
        mod = o.modifiers.new("dec", "DECIMATE"); mod.ratio = min(1.0, c / len(F)); mod.use_collapse_triangulate = True
        if ohrani is not None:  # trabekule in glavničaste mišice: manj poenostavitve (utež skupine nižja = manj krčenja)
            vg = o.vertex_groups.new(name="poenostavi")
            w = 1.0 - 0.75 * ohrani
            for val in np.unique(np.round(w, 1)):
                idx = np.nonzero(np.round(w, 1) == val)[0].tolist()
                vg.add(idx, float(val), "REPLACE")
            mod.vertex_group = "poenostavi"; mod.vertex_group_factor = 1.0
        m2 = bpy.data.meshes.new_from_object(o.evaluated_get(bpy.context.evaluated_depsgraph_get()))
        bpy.data.objects.remove(o)
        bm = bmesh.new(); bm.from_mesh(m2)
        for d, (ime, tkivo, del_) in enumerate(DELI_CT):
            b2 = bm.copy()
            bmesh.ops.delete(b2, geom=[f for f in b2.faces if f.material_index != d], context="FACES")
            bmesh.ops.delete(b2, geom=[v for v in b2.verts if not v.link_faces], context="VERTS")
            if not b2.faces:
                b2.free(); continue
            mm = bpy.data.meshes.new(ime); b2.to_mesh(mm); b2.free()
            mm.materials.clear()
            for p in mm.polygons:
                p.use_smooth = True; p.material_index = 0
            mm["pekaGotovo"] = 1
            izhod.setdefault(ime, [None, None])[i] = mm
        bm.free()
        print(f"[organi] srce_ct: stene {'računalnik' if i == 0 else 'telefon'} {len(m2.polygons)} trikotnikov", flush=True)
    cfg.setdefault("_telefon", {}).update({ime: m[1] for ime, m in izhod.items() if m[1] is not None})
    return [[ime, izhod[ime][0], tkivo, del_, f"{ime} (CT) / Heart.g", 0] for ime, tkivo, del_ in DELI_CT if ime in izhod]


def papilarna_ct(ime, X, bvh_endo, L):
    """Papilarna mišica na novo (stožec iz trabekulirane stene CT do glave ob tetivah, srce_geometrija.papilarna): vrh
    = točka poravnane mišice, najbolj oddaljena od stene; dno = stena proti konici."""
    from srce_geometrija import papilarna
    d = np.array([bvh_endo.find_nearest(Vector(x))[3] or 0 for x in X])
    vrh = Vector(X[np.argsort(d)[-max(3, len(d) // 30):]].mean(0))
    konica = Vector(L["konica"])
    dno = vrh.lerp(konica, 0.55)
    lv = "left ventricle" in ime
    bm = bmesh.new()
    papilarna(bm, dno, vrh, 0.0036 if lv else 0.002, stena=bvh_endo)
    me = bpy.data.meshes.new(ime); bm.to_mesh(me); bm.free()
    for p in me.polygons:
        p.use_smooth = True
    return me


def moderatorni_trak(Xs, pap_me, bvh_endo, r):
    """Septomarginalna trabekula: od pretina (konec poravnane trabekule ob pretinu) do dna sprednje papilarne mišice RV,
    rahlo povešena, debelina ≈ 3–4 mm (Netter)."""
    from srce_geometrija import cev
    Pp = _tocke(pap_me)
    dno = Pp[Pp[:, 2].argmin()] if len(Pp) else Xs.mean(0)
    # konec ob pretinu: točka trabekule najdlje od dna papilarne mišice, prilepljena na steno
    a = Xs[np.linalg.norm(Xs - dno, axis=1).argmax()]
    q = bvh_endo.find_nearest(Vector(a))
    a = np.array(q[0]) - np.array(q[1]) * 0.001 if q[0] is not None else a
    b = dno + (np.array(Pp.mean(0)) - dno) * 0.25
    tocke = [Vector(a + (b - a) * t) + Vector((0, 0, -0.004 * math.sin(math.pi * t))) for t in np.linspace(0, 1, 14)]
    bm = bmesh.new()
    cev(bm, tocke, [0.0019 * (1.25 - 0.35 * math.sin(math.pi * t)) for t in np.linspace(0, 1, 14)], seg=12)
    me = bpy.data.meshes.new(r[0]); bm.to_mesh(me); bm.free()
    for p in me.polygons:
        p.use_smooth = True
    return me


# ---------- prostorska tekstura reza (vsaka ravnina: smer vlaken in maščoba v vsaki točki stene) ----------
def volumen(ct, pot, korak=0.00125, zile=()):
    """Mreža vokslov v oseh glTF (x, y gor, z spredaj; brez središčenja): RGB = smer mišičnih vlaken (strukturni tenzor
    tetraedrov Rodero 2021, predznak poravnan s krožno smerjo okoli dolge osi LV; zunaj sten vektor 0), A = maščoba (0–1,
    med epikardom CT in površino maščobe). Zapis: PNG s ploščicami rezin po z (vsaka z robom 1 voksel za bilinearno vzorčenje), »Non-Color«.
    Vrne opis za pregledovalnik (lo, korak, n, ploščice) v metrih glTF; središče organa odšteje klicatelj."""
    P, C, T, Fv, premik = ct["P"], ct["C"], ct["T"], ct["Fv"], ct["premik"]
    gl = lambda B: np.c_[B[:, 0], B[:, 2], -B[:, 1]]
    m = np.isin(T, (1, 2, 3, 4, 18, 19, 20, 21, 22, 23, 24))
    Ct = gl(P[C[m]].mean(1) * MM + premik)
    Ft = gl(Fv[m].astype(float)); Ft /= np.linalg.norm(Ft, axis=1)[:, None] + 1e-12
    V, V2 = gl(ct["V"]), gl(ct["V2"])
    lo = np.minimum(V.min(0), V2.min(0)) - 2 * korak
    hi = np.maximum(V.max(0), V2.max(0)) + 2 * korak
    n = np.ceil((hi - lo) / korak).astype(int)
    idx = lambda X: np.clip(np.floor((X - lo) / korak).astype(int), 0, n - 1)
    lin = lambda I: (I[:, 2] * n[1] + I[:, 1]) * n[0] + I[:, 0]
    N = int(n.prod())
    ten = np.zeros((N, 6)); cnt = np.zeros(N)
    I = lin(idx(Ct))
    for k, (a, b) in enumerate(((0, 0), (1, 1), (2, 2), (0, 1), (0, 2), (1, 2))):
        np.add.at(ten[:, k], I, Ft[:, a] * Ft[:, b])
    np.add.at(cnt, I, 1)
    # maščoba: vzorci na odsekih epikard CT → površina maščobe
    dz = np.linalg.norm(V2 - V, axis=1); sel = (dz > 2e-4) & (ct["masca"] > 0.05)  # samo epikard (endokard: trabekule)
    fat = np.zeros(N)
    for t in np.linspace(0.1, 1.0, 8):
        np.add.at(fat, lin(idx(V[sel] + (V2[sel] - V[sel]) * t)), 1)
    # razširitev (trabekule, papilarne mišice, uho so zunaj tetraedrov): povprečje sosedov, 3 koraki
    def sosedje(A):
        A3 = A.reshape(n[2], n[1], n[0], -1); S = np.zeros_like(A3)
        for ax in range(3):
            S += np.roll(A3, 1, ax) + np.roll(A3, -1, ax)
        return S.reshape(A.shape)
    tk = np.c_[ten, cnt]
    for _ in range(3):
        prazno = tk[:, 6] == 0
        s_ = sosedje(tk)
        tk[prazno] = s_[prazno] / 6
    # znotraj zaprte unije sten (z maščobo in trabekulami): parnost presečišč žarka vzdolž z za vsak stolpec vokslov
    bv = BVHTree.FromPolygons([Vector(v) for v in V2], ct["F"].tolist(), all_triangles=True)
    notri = np.zeros((n[2], n[1], n[0]), bool)
    zc = lo[2] + (np.arange(n[2]) + 0.5) * korak
    for j in range(n[1]):
        for i in range(n[0]):
            o = Vector((lo[0] + (i + 0.5) * korak + 1.3e-6, lo[1] + (j + 0.5) * korak + 0.7e-6, lo[2] - korak))
            zz = []; p_ = o
            for _ in range(64):
                h = bv.ray_cast(p_, Vector((0, 0, 1)), 1.0)
                if h[0] is None:
                    break
                zz.append(h[0].z); p_ = h[0] + Vector((0, 0, 1e-6))
            for a_, b_ in zip(zz[0::2], zz[1::2]):
                notri[(zc >= a_) & (zc <= b_), j, i] = True
    notri = notri.ravel()
    fat = np.clip(fat, 0, 1).astype(float)
    fat = np.clip(0.5 * fat + 0.5 * sosedje(fat[:, None])[:, 0] / 6 * 2.2, 0, 1)
    fat[cnt > 0] *= 0.15  # v mišici (tetraedri) maščobe ni
    # glavna smer: lastni vektor tenzorja
    M = np.zeros((N, 3, 3))
    for k, (a, b) in enumerate(((0, 0), (1, 1), (2, 2), (0, 1), (0, 2), (1, 2))):
        M[:, a, b] = tk[:, k]; M[:, b, a] = tk[:, k]
    ima = tk[:, 6] > 0
    f = np.zeros((N, 3)); f[:, 0] = 1
    w, v = np.linalg.eigh(M[ima]); f[ima] = v[:, :, 2]
    L = {k: gl(np.asarray(x)[None])[0] for k, x in ct["L"].items()}
    os_ = L["mitralna"] - L["konica"]; os_ /= np.linalg.norm(os_)
    G = lo + (np.stack(np.unravel_index(np.arange(N), (n[2], n[1], n[0])), 1)[:, ::-1] + 0.5) * korak
    ref = np.cross(os_, G - L["konica"]); ref /= np.linalg.norm(ref, axis=1)[:, None] + 1e-12
    f[(f * ref).sum(1) < 0] *= -1
    f[~notri] = 0  # zunaj sten: dolžina 0 (pregledovalnik: |f| < 0,5 = ni stene, pokrov na globini zadnje ploskve)
    fat[~notri] = 0
    # venčne žile v maščobi: A = 1 (pregledovalnik tam pusti globino zadnje ploskve, da se vidi prerez žile), maščoba 0–0,6
    zila = np.zeros((n[2], n[1], n[0]), bool)
    if zile:
        Pz, Fz = [], []
        for me in zile:
            o = sum(len(x) for x in Pz)
            Pz.append(gl(_tocke(me))); Fz += [[o + i for i in p.vertices] for p in me.polygons]
        bz = BVHTree.FromPolygons([Vector(v) for v in np.concatenate(Pz)], Fz)
        for j in range(n[1]):
            for i in range(n[0]):
                o = Vector((lo[0] + (i + 0.5) * korak + 1.3e-6, lo[1] + (j + 0.5) * korak + 0.7e-6, lo[2] - korak))
                zz = []; p_ = o
                for _ in range(64):
                    h = bz.ray_cast(p_, Vector((0, 0, 1)), 1.0)
                    if h[0] is None:
                        break
                    zz.append(h[0].z); p_ = h[0] + Vector((0, 0, 1e-6))
                for a_, b_ in zip(zz[0::2], zz[1::2]):
                    zila[(zc >= a_ - korak * 0.5) & (zc <= b_ + korak * 0.5), j, i] = True
    zila = zila.ravel() & notri
    fat = np.where(zila, 1.0, fat * 0.6)
    # ploščice z robom 1 voksel
    nx, ny, nz = n; tw, th = nx + 2, ny + 2
    st = int(math.ceil(math.sqrt(nz * th / tw)))
    vr = int(math.ceil(nz / st))
    img = np.zeros((vr * th, st * tw, 4), np.float32)
    rgb = (f * 0.5 + 0.5).reshape(nz, ny, nx, 3); a = fat.reshape(nz, ny, nx)
    for z in range(nz):
        blok = np.concatenate([rgb[z], a[z][..., None]], -1)
        blok = np.pad(blok, ((1, 1), (1, 1), (0, 0)), mode="edge")
        r, c = divmod(z, st)
        img[r * th:(r + 1) * th, c * tw:(c + 1) * tw] = blok
    sl = bpy.data.images.new("srce-volumen", st * tw, vr * th, alpha=True, float_buffer=False)
    sl.colorspace_settings.name = "Non-Color"; sl.alpha_mode = "STRAIGHT"
    sl.pixels.foreach_set(img[::-1].ravel())  # Blender: vrstice od spodaj
    sl.filepath_raw = pot; sl.file_format = "PNG"; sl.save()
    bpy.data.images.remove(sl)
    print(f"[organi] srce_ct: prostorska tekstura {nx}×{ny}×{nz} ({korak * 1000:.2f} mm), {st}×{vr} ploščic → {os.path.basename(pot)}", flush=True)
    return {"slika": os.path.basename(pot), "lo": [float(x) for x in lo], "korak": korak, "n": [int(x) for x in n], "ploscice": [st, vr]}


# ---------- zaklopke na obročih CT (n9: parametrično, namesto poravnanih Z-Anatomy kosov) ----------
def _obroc(P, C, T, oznaka, premik, proti):
    """Obroč zaklopke iz pokrova CT (oznaka 7–10): središče, normala (proti točki `proti`), polmer po kotu (D-oblika)."""
    q = P[np.unique(C[T == oznaka])] * MM + premik
    c = q.mean(0)
    _, _, vt = np.linalg.svd(q - c); n = vt[2]
    if (np.asarray(proti) - c) @ n < 0:
        n = -n
    a = np.cross(n, [0.0, 0.0, 1.0]); a /= np.linalg.norm(a); b = np.cross(n, a)
    d = (q - c) - np.outer((q - c) @ n, n)
    ang = np.arctan2(d @ b, d @ a); rad = np.linalg.norm(d, axis=1)
    kot = np.linspace(-np.pi, np.pi, 72, endpoint=False)
    R = np.array([np.percentile(rad[np.abs(((ang - k + np.pi) % (2 * np.pi)) - np.pi) < 0.12], 92) if
                  (np.abs(((ang - k + np.pi) % (2 * np.pi)) - np.pi) < 0.12).sum() > 3 else np.percentile(rad, 90) for k in kot])
    R = np.convolve(np.r_[R[-3:], R, R[:3]], np.ones(5) / 5, "same")[3:-3]
    return c, n, a, b, kot, R


def _zasuk(me, pivot, os_, kot):
    R = Matrix.Rotation(kot, 3, Vector(os_))
    for v in me.vertices:
        v.co = Vector(pivot) + R @ (v.co - Vector(pivot))
    me.update()


def popravi_zile(vrstice):
    """Popravki velikih žil po poravnavi na CT (ocena n9): zgornja votla vena skoraj navpična (poravnava jo je nagnila
    ≈ 29° naprej; pravo ≈ 10°, vzporedno s padajočo aorto) – skupaj z brahiocefalnima venama in v. azygos okoli ustja v
    desni preddvor; padajoča aorta odrezana 32 mm pod vrhom loka (izoliran preparat: vidita se levi preddvor in pljučne
    vene), odrezan konec zaprt z obročem stene."""
    po = {r[0]: r[1] for r in vrstice}
    svc = po.get("Superior vena cava")
    if svc is not None:
        X = _tocke(svc)
        lo = X[X[:, 2] < np.percentile(X[:, 2], 5)].mean(0); hi = X[X[:, 2] > np.percentile(X[:, 2], 95)].mean(0)
        d = (hi - lo) / np.linalg.norm(hi - lo)
        kot = math.acos(min(1.0, d[2])); cilj = math.radians(10)
        if kot > cilj + 0.02:
            os_ = np.cross(d, [0, 0, 1.0]); os_ /= np.linalg.norm(os_)
            for ime in ("Superior vena cava", "Right brachiocephalic vein", "Left brachiocephalic vein", "Azygos vein"):
                if ime in po:
                    _zasuk(po[ime], lo, os_, kot - cilj)
            print(f"[organi] srce_ct: zgornja votla vena {math.degrees(kot):.0f}° → {math.degrees(cilj):.0f}° od navpičnice", flush=True)
    ao = po.get("Aorta")
    if ao is not None:
        bm = bmesh.new(); bm.from_mesh(ao)
        X = np.array([v.co for v in bm.verts]); zt = X[:, 2].max(); vrh = X[X[:, 2] > zt - 0.004].mean(0)
        zc = zt - 0.032  # n10: tik za lokom (pri 45 mm je odrezan konec ležal na levem preddvoru kot »okence«)
        bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:], plane_co=(0, 0, zc), plane_no=(0, 0, 1))
        dele = [f for f in bm.faces if f.calc_center_median().z < zc and f.calc_center_median().y > vrh[1] + 0.008]
        bmesh.ops.delete(bm, geom=dele, context="FACES")
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context="VERTS")
        rob = [e for e in bm.edges if e.is_boundary and all(abs(v.co.z - zc) < 2e-5 for v in e.verts)]
        try:
            bmesh.ops.bridge_loops(bm, edges=rob)
        except Exception:
            bmesh.ops.holes_fill(bm, edges=rob)
        bm.to_mesh(ao); bm.free(); ao.update()
        for p_ in ao.polygons:
            p_.use_smooth = True
        print(f"[organi] srce_ct: padajoča aorta odrezana pri z = {zc:.3f} ({len(dele)} ploskev)", flush=True)


def _poenostavi(me, ratio, tmp, ime=None):
    o = bpy.data.objects.new("_p", me); tmp.objects.link(o)
    mod = o.modifiers.new("dec", "DECIMATE"); mod.ratio = ratio; mod.use_collapse_triangulate = True
    m2 = bpy.data.meshes.new_from_object(o.evaluated_get(bpy.context.evaluated_depsgraph_get()))
    bpy.data.objects.remove(o)
    if ime:
        m2.name = ime
    for p_ in m2.polygons:
        p_.use_smooth = True
    return m2


def trabekule_ct(V2, lvF, rvF, L, vrstice, tel, tmp):
    """Mesnate trabekule kot geometrija na endokardu CT (ocena n9: »plitki valovi, stopljen vosek«): LV v konici in
    spodnjih dveh tretjinah (pretin zgoraj gladek), RV povsod razen iztoka; tretjina je mostičkov (pod njimi prostor)."""
    import random
    from srce_geometrija import trabekule
    out = []
    lv_c = V2[np.unique(lvF)].mean(0); rv_v = V2[np.unique(rvF)]
    tri = np.asarray(L["trikuspidalna"]); kon = np.asarray(L["konica"]); mit = np.asarray(L["mitralna"])
    u = (kon - tri) / np.linalg.norm(kon - tri)
    rv_kon = rv_v[((rv_v - tri) @ u).argmax()]
    for ime, Fv, baza, vrh, n_, r_, dl_, od, pretin in (
            ("Trabeculae carneae of left ventricle (lastno)", lvF, mit, kon, 80, 0.0013, 0.018, 0.38, rv_v.mean(0)),
            ("Trabeculae carneae of right ventricle (lastno)", rvF, tri, rv_kon, 100, 0.00115, 0.016, 0.22, None)):
        bvh = _bvh(V2, Fv)
        bm = bmesh.new()
        k = trabekule(bm, bvh, Vector(baza), Vector(vrh - baza), random.Random(sum(map(ord, ime))), n_, r_, dl_,
                      od=od, do=0.96, odmik=-0.3, mosticki=0.33, pretin=Vector(pretin) if pretin is not None else None)
        me = bpy.data.meshes.new(ime + " vir"); bm.to_mesh(me); bm.free()
        # trabekule so grčaste vrvi: poenostavitev ne škodi (računalnik 60 %, telefon 22 %)
        tel[ime] = _poenostavi(me, 0.22, tmp, ime + " tel")
        out.append([ime, _poenostavi(me, 0.6, tmp, ime), "miokard", "trabekule", f"{ime} (CT) / Heart.g", 0])
        print(f"[organi] srce_ct: {ime}: {k}", flush=True)
    return out


def zaklopke_ct(P, C, T, premik, L, bvh_lv, bvh_rv, tel):
    """n10 (ocena n9: »origami«, napihnjeni žepki, ena prosta papilarna mišica): mitralna (sprednji + zadnji listič s
    tremi pokrovčki), trikuspidalna (3 lističi), fibrozni obroči vseh štirih zaklopk, aortna in pljučna (3 tanki žepki z
    noduli in lunulami), papilarne mišice iz PROSTE stene prekata pod komisurami (LV: sprednja-stranska in zadnja-srednja;
    RV: sprednja velika, spodnja, pretinska majhna), razvejane tetive do prostega roba in hrapave cone. Vsaka mreža dobi
    tudi telefonsko različico (tel[ime], manj vrstic, enako gladko). Vrne vrstice [ime, mesh, tkivo, del, pot, 0]."""
    import srce_zaklopke as sz
    vrstice = []
    konica = np.asarray(L["konica"])
    rnd = np.random.default_rng(10)
    def dodaj(ime, tkivo, del_, gradi):
        me = gradi(1.0)
        if isinstance(me, sz.Zbirka):
            me = me.mesh(ime)
        mt = gradi(0.5)
        tel[ime] = mt.mesh(ime + " tel") if isinstance(mt, sz.Zbirka) else mt
        vrstice.append([ime, me, tkivo, del_, f"{ime} (lastno, CT obroč) / Heart.g", 0])
    def leaflet_z(c, n, a, b, kot, R, f0, f1, g, val, q):
        z = sz.Zbirka(); V, F, _, _ = sz.listic(c, n, a, b, kot, R, f0, f1, g, q=q, valovi=val); z.dodaj(V, F); return z
    for ime, oz, listici, R_pap, glob, bvh in (
            ("mitral", 7, [("Anterior leaflet of left atrioventricular valve", -1.05, 1.05, 0.021, 1), ("Posterior leaflet of left atrioventricular valve", 1.05, 2 * math.pi - 1.05, 0.013, 3)], 0.0034, 0.022, bvh_lv),
            ("tricuspid", 8, [("Septal leaflet of right atrioventricular valve", -1.05, 1.05, 0.014, 1), ("Anterior leaflet of right atrioventricular valve", 1.05, 3.14, 0.017, 1), ("Inferior leaflet of right atrioventricular valve", 3.14, 2 * math.pi - 1.05, 0.014, 1)], 0.0024, 0.018, bvh_rv)):
        c, n, a, b, kot, R = _obroc(P, C, T, oz, premik, konica)
        # kot 0: pri mitralni proti aortni zaklopki (sprednji listič ob aorti), pri trikuspidalni proti pretinu (LV)
        ref = np.asarray(L["aortna"] if ime == "mitral" else L["mitralna"]) - c; ref -= n * (ref @ n)
        a = ref / np.linalg.norm(ref); b = np.cross(n, a)
        robovi = []
        for ime_l, f0, f1, g, val in listici:
            _, _, rob, hrap = sz.listic(c, n, a, b, kot, R, f0, f1, g, q=1.0, valovi=val)
            robovi.append((f0, f1, rob, hrap))
            dodaj(ime_l, "zaklopka", "av-zaklopki", lambda q, f0=f0, f1=f1, g=g, val=val: leaflet_z(c, n, a, b, kot, R, f0, f1, g, val, q))
        def obr(q):
            z = sz.Zbirka(); z.dodaj(*sz.obroc(c, n, a, b, kot, R, q=q)); return z
        dodaj(f"Fibrous ring of {ime} valve", "zaklopka", "av-zaklopki", obr)
        # papilarne mišice: dno na prosti steni (žarek iz osi prekata v smeri komisure), glava pod komisuro
        if ime == "mitral":
            pap = [("Anterolateral papillary muscle of left ventricle", 1.05, 1.0), ("Inferior papillary muscle of left ventricle", -1.05, 1.0)]
        else:
            pap = [("Anterior papillary muscle of right ventricle", 3.14, 1.0), ("Inferior papillary muscle of right ventricle", -1.05, 0.75),
                   ("Septal papillary muscle of right ventricle", 1.05, 0.45)]
        Dax = float((konica - c) @ n)
        glave_vse = []
        for ime_p, fk, vel in pap:
            rad = a * math.cos(fk) + b * math.sin(fk); Rf = sz.r_kot(kot, R, fk)
            H = c + rad * Rf * 0.42 + n * glob
            Pax = c + n * max(Dax * 0.5, glob + 0.012)
            dno = None
            for smer in (rad - n * 0.15, rad, rad + n * 0.3):
                smer = smer / np.linalg.norm(smer)
                h = bvh.ray_cast(Vector(Pax), Vector(smer), 0.06)
                if h[0] is not None:
                    dno = np.array(h[0]); break
            if dno is None:
                dno = H + n * 0.02 + rad * 0.008
            if np.linalg.norm(H - dno) < 0.012:
                H = dno + (H - dno) / (np.linalg.norm(H - dno) + 1e-9) * 0.014
            def pap_m(q, dno=dno, H=H, vel=vel, ime_p=ime_p):
                bm = bmesh.new(); gl = sz.papilarna(bm, Vector(dno), Vector(H), R_pap * vel, q=q)
                return (sz._bm_mesh(ime_p, bm), gl)
            me, gl = pap_m(1.0); mt, _ = pap_m(0.55)
            tel[ime_p] = mt
            vrstice.append([ime_p, me, "miokard", "papilarne-misice", f"{ime_p} (lastno, CT) / Heart.g", 0])
            glave_vse.append((fk, gl))
        # tetive: vsak listič do dveh najbližjih papilarnih mišic (polovica lističa ob vsaki komisuri)
        def tet(q):
            z = sz.Zbirka(); r = np.random.default_rng(7)
            for f0, f1, rob, hrap in robovi:
                us = np.linspace(f0, f1, len(rob))
                for fk, gl in glave_vse:
                    d = np.abs(((us - fk + np.pi) % (2 * np.pi)) - np.pi)
                    izb = np.nonzero(d < min(1.15, (f1 - f0) * 0.55))[0]
                    if not len(izb):
                        continue
                    korak = 1 if q >= 1 else 2
                    izb = izb[::korak]
                    glava = gl[int(np.argmin([np.linalg.norm(g_ - rob[izb].mean(0)) for g_ in gl]))]
                    sz.tetive(z, glava, rob[izb], hrap[izb], q=q, rnd=r)
            return z
        dodaj(f"Chordae tendineae of {ime} valve", "zaklopka", "av-zaklopki", tet)
    for ime, oz, del_, proti in (("aortic", 9, "aortna-zaklopka", L["mitralna"]), ("pulmonary", 10, "pljucna-zaklopka", L["trikuspidalna"])):
        c, n, a, b, kot, R = _obroc(P, C, T, oz, premik, proti)
        os_ = -n  # od prekata proti žili
        Rm = float(np.median(R))
        def zep(q, c=c, os_=os_, Rm=Rm):
            z, krona = sz.zepki(c, os_, Rm * 0.97, q=q)
            # obroč v obliki krone (pritrditev žepkov, fibrozni skelet)
            k = krona[:: (1 if q >= 1 else 2)]
            V, F = sz.cev_np(k, [0.0008] * len(k), 6 if q >= 1 else 4, zaprta=True); z.dodaj(V, F)
            return z
        dodaj(f"Semilunar cusps of {ime} valve", "zep", del_, zep)
    return vrstice


def _odebeli_cev(me, X, f):
    """Cev iz krivulje (venčna žila) debelejša za faktor f okoli lokalne središčnice (glajenje po robovih ≈ središče)."""
    e = np.array([tuple(ed.vertices) for ed in me.edges], dtype=np.int64).reshape(-1, 2)
    if not len(e):
        return X
    st = np.maximum(np.bincount(e.ravel(), minlength=len(X)), 1)[:, None]
    S = X.copy()
    for _ in range(25):
        acc = np.zeros_like(S); np.add.at(acc, e[:, 0], S[e[:, 1]]); np.add.at(acc, e[:, 1], S[e[:, 0]])
        S = 0.5 * S + 0.5 * acc / st
    return S + (X - S) * f


def pljucne_vene_ct(P, C, T, premik, L, tel=None, bvh_epi=None):
    """Štiri pljučne vene kot zaprti krni (stena 1 mm, svetlina) iz ustij CT (oznake 12–15), dolgi 14 mm, z ustjem 2 mm v
    steni preddvora (n8: odprti trakovi in raztrganine ob ustjih)."""
    vrstice = []
    c_la = P[np.unique(C[T == 3])].mean(0) * MM + premik  # središče stene levega preddvora (n9: mitralni obroč je ob enem ustju obrnil krn v preddvor, »okence«)
    for oz, ime in ((12, "Left superior pulmonary vein"), (13, "Left inferior pulmonary vein"), (14, "Right inferior pulmonary vein"), (15, "Right superior pulmonary vein")):
        q = P[np.unique(C[T == oz])] * MM + premik
        c = q.mean(0); _, _, vt = np.linalg.svd(q - c); n = vt[2]
        h_ = bvh_epi.find_nearest(Vector(c)) if bvh_epi is not None else (None,)
        if h_[0] is not None:  # krn gre navzven: smer zunanje normale epikarda ob ustju
            if n @ np.array(h_[1]) < 0:
                n = -n
        elif (c - c_la) @ n < 0:
            n = -n
        r = float(np.percentile(np.linalg.norm((q - c) - np.outer((q - c) @ n, n), axis=1), 85)) + 0.0008
        a = np.cross(n, [0, 0, 1.0]); a /= np.linalg.norm(a); b = np.cross(n, a)
        vrstice.append([ime, _krn_vene(ime, c, n, a, b, r, 28, 10), "pljucna-vena", "pljucne-vene", f"{ime} (lastno, CT ustje) / Heart.g", 0])
        if tel is not None:  # telefon: 14 × 6 (ista oblika)
            tel[ime] = _krn_vene(ime + " tel", c, n, a, b, r, 14, 6)
    return vrstice


def _krn_vene(ime, c, n, a, b, r, seg, k):
    th = np.linspace(0, 2 * np.pi, seg, endpoint=False)
    zun, notr = [], []
    for i in range(k):
        t = i / (k - 1); o = c + n * (-0.002 + 0.018 * t)
        rr = r * (1.28 - 0.28 * t ** 0.5)  # n10: ustje lijakasto razširjeno v preddvor (ne »okence«)
        zun.append(o + rr * (np.outer(np.cos(th), a) + np.outer(np.sin(th), b)))
        notr.append(o + (rr - 0.0006) * (np.outer(np.cos(th), a) + np.outer(np.sin(th), b)))  # tanka venska stena 0,6 mm
    V = np.r_[np.concatenate(zun), np.concatenate(notr)]; o = seg * k
    F = []
    for i in range(k - 1):
        for j in range(seg):
            a_, b_ = i * seg + j, i * seg + (j + 1) % seg
            F += [(a_, b_, b_ + seg), (a_, b_ + seg, a_ + seg), (o + a_, o + b_ + seg, o + b_), (o + a_, o + a_ + seg, o + b_ + seg)]
    for i in (0, k - 1):  # odrezana konca: obroč stene (debelina vidna)
        for j in range(seg):
            a_, b_ = i * seg + j, i * seg + (j + 1) % seg
            F += [(a_, o + b_, b_), (a_, o + a_, o + b_)] if i else [(a_, b_, o + b_), (a_, o + b_, o + a_)]
    return _mesh(ime, V, np.array(F))

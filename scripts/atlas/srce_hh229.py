# Pravo srce HH229 (Visible Heart Laboratories, CC BY 4.0; priprava scripts/atlas/srce-hh229.py → hh229-v1.npz) kot stena
# srca namesto povprečnega CT (srce_ct.py). HH229 je en zaprt volumen s pravimi trabekulami, glavničastimi mišicami,
# zaklopkami s tetivami in papilarnimi mišicami. Postopek (metri, okvir Blenderja kot srce_ct):
#  1. oslonilne točke HH229 (središča 4 zaklopk iz modela zaklopk, konica) → podobnostna preslikava na oslonilne točke CT;
#  2. gladko polje odmikov (srce_ct.Polje) na steno CT (epikard na epikard, endokard na endokard, v obe smeri), da ostanejo
#     vsi drugi deli (žile, venčne žile, prevodni sistem, pogledi, ravnina reza, prostorska tekstura reza) na svojem mestu;
#  3. oznake: del stene (DELI_CT) in stran (epikard/endokard) vsake ploskve HH229 po najbližji ploskvi CT z ujemajočo
#     normalo, zglajeno z večinskim filtrom; zaklopke po bližini modela zaklopk.
import os, numpy as np
from scipy.spatial import cKDTree

def normale_oglisc(V, F):
    n = np.cross(V[F[:, 1]] - V[F[:, 0]], V[F[:, 2]] - V[F[:, 0]])
    N = np.zeros_like(V)
    for k in range(3): np.add.at(N, F[:, k], n)
    return N / (np.linalg.norm(N, axis=1)[:, None] + 1e-20)

def umeyama(A, B):
    ma, mb = A.mean(0), B.mean(0); X, Y = A - ma, B - mb
    U, S, Vt = np.linalg.svd(Y.T @ X / len(A)); D = np.eye(3)
    if np.linalg.det(U) * np.linalg.det(Vt) < 0: D[2, 2] = -1
    R = U @ D @ Vt; s = (S * np.diag(D)).sum() / X.var(0).sum()
    return s, R, mb - s * R @ ma

def oslonilne(h):
    """Središča zaklopk (težišče oboda = oglišča blizu ravnine obroča ni znano → težišče vseh oglišč zaklopke brez tetiv:
    mediana) in konica: najbolj oddaljena točka srca od ravnine zaklopk na strani težišča srca."""
    L = {k: np.median(h["V_" + k], axis=0) for k in ("aortna", "pljucna", "av_a", "av_b")}
    # AV zaklopki: obroč = oglišča na strani aortne zaklopke (tetive in papilarne mišice visijo proti konici)
    c4 = np.mean(list(L.values()), axis=0); V = h["V"]
    _, _, Vt = np.linalg.svd(np.array(list(L.values())) - c4); n = Vt[2]
    if (V.mean(0) - c4) @ n < 0: n = -n
    for k in ("av_a", "av_b"):
        X = h["V_" + k]; g = (X - c4) @ n
        L[k] = X[g < np.quantile(g, 0.35)].mean(0)
    c4 = np.mean(list(L.values()), axis=0)
    g = (V - c4) @ n
    L["konica"] = V[g > np.quantile(g, 0.9995)].mean(0)
    return L, n

def podobnost(h, Lc):
    """Podobnostna preslikava HH229 → CT; AV zaklopki (a, b) priredi mitralni/trikuspidalni z manjšim ostankom."""
    Lh, _ = oslonilne(h); naj = None
    for a, b in (("av_a", "av_b"), ("av_b", "av_a")):
        pari = [("aortna", "aortna"), ("pljucna", "pljucna"), (a, "mitralna"), (b, "trikuspidalna"), ("konica", "konica")]
        A = np.array([Lh[x] for x, _ in pari]); B = np.array([Lc[y] for _, y in pari])
        s, R, t = umeyama(A, B); ost = np.linalg.norm(s * A @ R.T + t - B, axis=1)
        if naj is None or ost.mean() < naj[0]: naj = (ost.mean(), s, R, t, a, b, ost)
    return naj

def ujemi(X, Nx, kd, Y, Ny, k=12, do=0.016, kot=0.2):
    """Najbližja točka Y z ujemajočo normalo (n·n > kot) med k sosedi; vrne indeks ali -1."""
    d, i = kd.query(X, k=k, distance_upper_bound=do)
    ok = np.isfinite(d); ii = np.where(ok, i, 0)
    dot = np.einsum("nkj,nj->nk", Ny[ii], Nx); ok &= dot > kot
    prvi = np.argmax(ok, axis=1)
    return np.where(ok.any(1), ii[np.arange(len(X)), prvi], -1)

class Poravnava:
    def __init__(self, h, ct, Polje, koraki=((0.020, 3), (0.014, 3), (0.010, 2)), vzorcev=30000, log=print, cevi=None):
        Lc = ct["L"]
        ost, self.s, self.R, self.t, a, b, o5 = podobnost(h, Lc)
        self.mitralna, self.trikuspidalna = a, b
        log(f"[organi] srce_hh229: podobnost merilo {self.s:.3f}, ostanek oslonilnih točk {ost * 1000:.1f} mm (največ {o5.max() * 1000:.1f}); mitralna = {a}")
        Vc, Fc = ct["V2"], ct["F"]; Nc = normale_oglisc(Vc, Fc); kdc = cKDTree(Vc)
        if cevi:  # cilj so tudi cevi velikih žil (do 3 cm od stene): krni žil HH229 pridejo na naše cevi (ustja ven, lok aorte)
            Qc = np.concatenate([c[0] for c in cevi]); Nq = np.concatenate([c[1] for c in cevi])
            blizu = kdc.query(Qc)[0] < 0.03
            Vc = np.concatenate([Vc, Qc[blizu]]); Nc = np.concatenate([Nc, Nq[blizu]]); kdc = cKDTree(Vc)
        Vh, Fh = h["V"], h["F"]; Nh0 = normale_oglisc(Vh, Fh)
        rng = np.random.default_rng(3)
        ih = rng.choice(len(Vh), vzorcev, replace=False); ic = rng.choice(len(Vc), vzorcev // 2, replace=False)
        lo, hi = Vc.min(0) - 0.07, Vc.max(0) + 0.07
        self.polja = []
        Lh, _ = oslonilne(h)
        A = np.array([Lh[x] for x in ("aortna", "pljucna", a, b, "konica")]); B = np.array([Lc[y] for y in ("aortna", "pljucna", "mitralna", "trikuspidalna", "konica")])
        for sigma, krat in koraki:
            for _ in range(krat):
                Xh = self(Vh[ih]); Nx = Nh0[ih] @ self.R.T
                j = ujemi(Xh, Nx, kdc, Vc, Nc); ok = j >= 0
                X = [Xh[ok]]; D = [Vc[j[ok]] - Xh[ok]]; W = [np.ones(ok.sum())]
                # obratno: točke CT → najbližje oglišče HH229 (na trenutni legi); odmik velja na legi HH229
                Xall = self(Vh[::4]); kdh = cKDTree(Xall)
                j2 = ujemi(Vc[ic], Nc[ic], kdh, Xall, Nh0[::4] @ self.R.T); ok2 = j2 >= 0
                X.append(Xall[j2[ok2]]); D.append(Vc[ic][ok2] - Xall[j2[ok2]]); W.append(np.ones(ok2.sum()))
                Ax = self(A); X.append(Ax); D.append(B - Ax); W.append(np.full(len(A), 40.0))
                X, D, W = map(np.concatenate, (X, D, W))
                self.polja.append(Polje(lo, hi, 0.002, sigma, X, D * 0.8, W, eps=5e-4))  # majhen eps: krni žil zunaj CT se premaknejo s steno (brez striga)
            Xh = self(Vh[ih]); d, _ = kdc.query(Xh)
            log(f"[organi] srce_hh229: polje σ {sigma * 1000:.0f} mm: razdalja HH229 → CT mediana {np.median(d) * 1000:.2f} mm, 90 % {np.quantile(d, 0.9) * 1000:.2f} mm, ujetih {ok.mean():.2f}")

    def __call__(self, X):
        X = self.s * np.asarray(X) @ self.R.T + self.t
        for p in self.polja: X = X + p(X)
        return X

# Deli stene HH229: prvih 9 kot srce_ct.DELI_CT (isti indeksi kot razdeli_stene), nato deli, ki jih ima samo HH229.
DELI = [
    ("Left ventricle", "miokard", "levi-prekat"), ("Interventricular septum", "miokard", "medprekatni-pretin"),
    ("Right ventricle", "miokard", "desni-prekat"), ("Conus arteriosus", "miokard", "conus-arteriosus"),
    ("Left atrium", "miokard", "levi-preddvor"), ("Right atrium", "miokard", "desni-preddvor"),
    ("Right auricle", "miokard", "desno-srcno-uho"), ("Root of aorta", "aorta", "aorta"),
    ("Root of pulmonary trunk", "pljucna", "pljucno-deblo"),
    ("Left atrioventricular valve (HH229)", "zaklopka", "av-zaklopki"), ("Right atrioventricular valve (HH229)", "zaklopka", "av-zaklopki"),
    ("Semilunar cusps of aortic valve", "zep", "aortna-zaklopka"), ("Semilunar cusps of pulmonary valve", "zep", "pljucna-zaklopka"),
    ("Trabeculae carneae of left ventricle (HH229)", "miokard", "trabekule-levega-prekata"),
    ("Trabeculae carneae of right ventricle (HH229)", "miokard", "trabekule-desnega-prekata"),
    ("Papillary muscles of left ventricle (HH229)", "miokard", "papilarne-misice"),
    ("Papillary muscles of right ventricle (HH229)", "miokard", "papilarne-misice"),
    ("Left auricle", "miokard", "levo-srcno-uho"),
]
ZAK = {"mitralna": 9, "trikuspidalna": 10, "aortna": 11, "pljucna": 12}

def vecina(F, oz, n, krat=3, zakleni=None):
    """Večinski filter oznak ploskev: glas vsake ploskve gre v njena oglišča, ploskev prevzame najpogostejšo oznako svojih
    oglišč (meje med deli postanejo gladke, osamljene ploskve izginejo). `zakleni`: maska ploskev, ki se ne spremenijo."""
    oz = oz.copy()
    for _ in range(krat):
        H = np.zeros((F.max() + 1, n), np.float32)
        for k in range(3): np.add.at(H, (F[:, k], oz), 1.0)
        nov = (H[F[:, 0]] + H[F[:, 1]] + H[F[:, 2]]).argmax(1)
        oz = np.where(zakleni, oz, nov) if zakleni is not None else nov
    return oz

def zgladi(V, F, krat=120, lam=0.6):
    """Laplaceovo glajenje (enakomerne uteži) – za mero izbočenosti trabekul."""
    from scipy.sparse import coo_matrix
    i = np.concatenate([F[:, 0], F[:, 1], F[:, 2], F[:, 1], F[:, 2], F[:, 0]]); j = np.concatenate([F[:, 1], F[:, 2], F[:, 0], F[:, 0], F[:, 1], F[:, 2]])
    A = coo_matrix((np.ones(len(i), np.float32), (i, j)), shape=(len(V), len(V))).tocsr(); A.data[:] = 1.0
    st = np.asarray(A.sum(1)).ravel() + 1e-9; X = V.copy()
    for _ in range(krat): X = (1 - lam) * X + lam * (A @ X) / st[:, None]
    return X

def skrij_krne(V, F, dl, d_ct, cevi, log=print):
    """Krni žil HH229 (aorta z lokom, pljučno deblo, votli in pljučne vene; odrezani konci preparata) se zložijo v steno
    naših cevi žil (srce_zile, pljucne_vene_ct), ki se nadaljujejo iz korenov CT: oglišče gre na najbližjo točko cevi,
    δ pod njeno površino. Topologija ostane (zaprt volumen brez prostornine v steni cevi), zunaj se vidi samo naša cev."""
    if not cevi: return V, np.zeros(len(V))
    Q = np.concatenate([c[0] for c in cevi]); N = np.concatenate([c[1] for c in cevi])
    d, i = cKDTree(Q).query(V)
    zila = np.zeros(len(V), bool); preddvor = np.zeros(len(V), bool)
    for k in range(3):
        zila[F[np.isin(dl, (7, 8)), k]] = True; preddvor[F[np.isin(dl, (4, 5)), k]] = True
    st = lambda x, a, b: np.clip((x - a) / (b - a), 0, 1) ** 2 * (3 - 2 * np.clip((x - a) / (b - a), 0, 1))
    w = st(d_ct, 0.0025, 0.006) * (1 - st(d, 0.005, 0.009)) * (zila | preddvor)
    w = np.maximum(w, st(d_ct, 0.006, 0.010) * zila)          # odmaknjeni deli krnov žil (lok, veje pljučnega debla)
    w = np.maximum(w, st(d_ct, 0.009, 0.014) * preddvor * (d < 0.03))  # krni ven, ki štrlijo iz preddvorov
    cilj = Q[i] - N[i] * 0.0005
    log(f"[organi] srce_hh229: krni žil zloženi v cevi: {int((w > 0.5).sum())} oglišč")
    X = V + w[:, None] * (cilj - V)
    # prehodni pas med steno in zloženim krnom (0 < w < 1) zgladimo: brez zmečkanih zavihkov in žagastega ovratnika ob cevi
    m = (w > 0.02) & (w < 0.995)
    if m.any():
        from scipy.sparse import coo_matrix
        a = np.concatenate([F[:, 0], F[:, 1], F[:, 2], F[:, 1], F[:, 2], F[:, 0]]); b = np.concatenate([F[:, 1], F[:, 2], F[:, 0], F[:, 0], F[:, 1], F[:, 2]])
        A = coo_matrix((np.ones(len(a), np.float32), (a, b)), shape=(len(V), len(V))).tocsr(); A.data[:] = 1.0
        A = A[m]; st_ = np.asarray(A.sum(1)).ravel() + 1e-9
        for _ in range(25): X[m] = 0.4 * X[m] + 0.6 * (A @ X) / st_[:, None]
    return X, w

def valovi(X, dolzina, seme=3, n=7):
    """Gladek šum 0–1 v prostoru (vsota sinusnih valov naključnih smeri z valovno dolžino okoli `dolzina`)."""
    rng = np.random.default_rng(seme); K = rng.normal(size=(n, 3)); K /= np.linalg.norm(K, axis=1)[:, None]
    K *= (2 * np.pi / (dolzina * rng.uniform(0.7, 1.4, n)))[:, None]; f = rng.uniform(0, 2 * np.pi, n)
    return 0.5 + 0.5 * np.sin(X @ K.T + f).mean(1) * 1.9

def mascoba(V, F, epi, m0, Xz, log=print):
    """Maska epikardialne maščobe na pravem srcu. m0 (maska sten CT) je enakomerno širok pas ob žlebovih (na HH229 kot
    naslikan rumen križ); tu je maščoba ob venčnih žilah v žlebovih (neenakomerno širok pas 3–7 mm ob žili) in v jedru
    žleba, kjer žile ni (prekinjeni otoki), rob pa valovit. Xz: točke venčnih žil. Vrne masko 0–1 po ogliščih."""
    ke = np.zeros(len(V), bool)
    for k in range(3): ke[F[epi, k]] = True
    pas = ke & (m0 > 0.5)
    if not pas.any(): return np.zeros(len(V))
    zunaj = ke & ~pas
    d_rob = cKDTree(V[zunaj]).query(V)[0] if zunaj.any() else np.full(len(V), 0.01)
    d_z = cKDTree(Xz).query(V)[0] if Xz is not None and len(Xz) else np.full(len(V), 1.0)
    s1 = np.clip(valovi(V, 0.011, 3), 0, 1); s2 = np.clip(valovi(V, 0.0045, 8), 0, 1)
    sir = 0.0030 + 0.0040 * s1 + 0.0024 * (s2 - 0.5)                 # polovična širina pasu ob žili
    ob_zili = np.clip((sir - d_z) / 0.0012, 0, 1)
    jedro = np.clip((d_rob - (0.0042 + 0.0030 * (1 - s1) + 0.0022 * (s2 - 0.5))) / 0.0012, 0, 1)  # sredina žleba brez žile
    m = np.where(pas, np.maximum(ob_zili, jedro), 0.0)
    log(f"[organi] srce_hh229: maščoba {float((m[ke] > 0.5).mean()):.1%} epikarda (pas CT {float(pas[ke].mean()):.1%})")
    return m

def ustje(bvh, c, cilj, kot=38.0, n=3000, do=0.12):
    """Ustje vene v steni HH229, gledano iz središča preddvora c proti pričakovanemu ustju `cilj`: smeri v stožcu, v
    katerih žarek ne zadene stene (svetlina žile). Vrne (središče ustja, smer) ali None."""
    from mathutils import Vector
    a = (cilj - c) / np.linalg.norm(cilj - c)
    rng = np.random.default_rng(5); D = rng.normal(size=(n, 3)); D /= np.linalg.norm(D, axis=1)[:, None]
    D = D[D @ a > np.cos(np.radians(kot))]
    t = np.array([(bvh.ray_cast(Vector(c), Vector(d), do)[3] or np.inf) for d in D])
    ven = ~np.isfinite(t)
    if ven.sum() < 5: return None
    b = D[ven].mean(0); b /= np.linalg.norm(b)
    rob = np.isfinite(t) & ((D @ b) > np.cos(np.radians(14)))
    r = np.median(t[rob]) if rob.sum() > 3 else np.linalg.norm(cilj - c)
    # polmer ustja: kot, do katerega žarki uhajajo (85. percentil), na razdalji ustja
    kot_u = np.percentile(np.arccos(np.clip(D[ven] @ b, -1, 1)), 85)
    return c + b * r, b, float(r * np.tan(kot_u))

def razsiri_cev(X, polmer, najvec=1.7):
    """Cev (oglišča X) razširi okoli njene osi (glavna smer oglišč), da je srednji polmer vsaj `polmer`. Vrne (X, faktor)."""
    c = X.mean(0); _, _, vt = np.linalg.svd(X - c, full_matrices=False); n = vt[0]
    t = (X - c) @ n; rad = (X - c) - np.outer(t, n); r0 = float(np.median(np.linalg.norm(rad, axis=1)))
    k = float(np.clip(polmer / max(r0, 1e-6), 1.0, najvec))
    return c + np.outer(t, n) + rad * k, k

def premakni_na_ustje(X, c, staro, novo):
    """Cev žile, zgrajena na ustju CT `staro`, se zasuka okoli središča preddvora c in premakne na ustje HH229 `novo`."""
    a = (staro - c) / np.linalg.norm(staro - c); b = (novo - c) / np.linalg.norm(novo - c)
    v = np.cross(a, b); cs = float(a @ b); K = np.array([[0, -v[2], v[1]], [v[2], 0, -v[0]], [-v[1], v[0], 0]])
    R = np.eye(3) + K + K @ K / (1 + cs)
    return c + (X - c) @ R.T + b * (np.linalg.norm(novo - c) - np.linalg.norm(staro - c))

def stena(pot, ct, Polje, log=print, cevi=None):
    """HH229 na legi CT z oznakami. Vrne dict V, F, dl (indeks v DELI), epi (po ploskvi), masca in ohrani (po oglišču),
    L (oslonilne točke zaklopk HH229 na novi legi)."""
    h = dict(np.load(pot)); por = Poravnava(h, ct, Polje, log=log, cevi=cevi)
    V = por(h["V"]); F = h["F"].astype(np.int64)
    Vc, Fc = ct["V2"], ct["F"]
    nf = np.cross(V[F[:, 1]] - V[F[:, 0]], V[F[:, 2]] - V[F[:, 0]]); nf /= np.linalg.norm(nf, axis=1)[:, None] + 1e-20
    cf = V[F].mean(1)
    nc = np.cross(Vc[Fc[:, 1]] - Vc[Fc[:, 0]], Vc[Fc[:, 2]] - Vc[Fc[:, 0]]); nc /= np.linalg.norm(nc, axis=1)[:, None] + 1e-20
    cc = Vc[Fc].mean(1); kd = cKDTree(cc)
    j = np.full(len(F), -1)
    for a in range(0, len(F), 200000):  # po kosih (k sosedov × normala)
        j[a:a + 200000] = ujemi(cf[a:a + 200000], nf[a:a + 200000], kd, cc, nc, k=16, do=0.02, kot=0.1)
    brez = j < 0
    j[brez] = kd.query(cf[brez])[1]
    dl = ct["dl"][j].astype(np.int64); epi = ct["epi"][j].copy()
    log(f"[organi] srce_hh229: {len(F)} ploskev, brez ujemajoče normale {brez.mean():.3f}, epikard {epi.mean():.2f}")
    epi = vecina(F, epi.astype(np.int64), 2, 4).astype(bool)
    dl = vecina(F, dl, len(DELI), 4)
    # levo uho: del levega preddvora, ki štrli iz stene CT (CT ušesa nima) ob ustju ušesa
    d_v = cKDTree(Vc).query(V)[0]
    V, w_krn = skrij_krne(V, F, dl, d_v, cevi, log)
    # povsem zložene ploskve (list brez prostornine v steni cevi) odstranimo: robova ostaneta drug ob drugem v steni cevi
    # (odprtina brez širine, število navitij ostane pravilno), poenostavitev pa ne dela z izrojenimi trikotniki
    ost = ~(w_krn[F] > 0.97).all(1)
    F, dl, epi = F[ost], dl[ost], epi[ost]; cf = V[F].mean(1)
    d_ct = cKDTree(Vc).query(cf)[0]  # (po ploskvah na legi pred zlaganjem krnov: uho štrli iz stene CT)
    if "uho" in ct["L"]:
        uho = (dl == 4) & (np.linalg.norm(cf - ct["L"]["uho"], axis=1) < 0.034) & (d_ct > 0.0025)
        dl[uho] = 17; dl = vecina(F, dl, len(DELI), 3)
    # trabekule: endokard prekatov, ki štrli iz zglajene ploskve; papilarne mišice: trabekule ob koncih tetiv
    izb = np.linalg.norm(V - zgladi(V, F), axis=1)
    izb_f = izb[F].mean(1)
    lv = (~epi) & (dl == 0); rv = (~epi) & (dl == 2)
    tr_ = np.where(lv & (izb_f > 0.0007), 1, np.where(rv & (izb_f > 0.0007), 2, 0))
    tr_ = vecina(F, tr_, 3, 6, zakleni=~(lv | rv))  # večje sklenjene zaplate (učne barve brez konfetov)
    dl[lv & (tr_ == 1)] = 13; dl[rv & (tr_ == 2)] = 14
    # zaklopke in papilarne mišice po bližini modela zaklopk (isti preparat): lističi in tetive do 26 mm pod obročem so
    # zaklopka, globlje (glave in telesa papilarnih mišic, na katere se pripenjajo tetive) papilarne mišice
    oz_zak = {k: por(h["V_" + v]) for k, v in (("mitralna", por.mitralna), ("trikuspidalna", por.trikuspidalna), ("aortna", "aortna"), ("pljucna", "pljucna"))}
    c4 = np.mean([oz_zak[k].mean(0) for k in oz_zak], axis=0); os_ = ct["L"]["konica"] - c4; os_ /= np.linalg.norm(os_)
    for ime, pap in (("mitralna", 15), ("trikuspidalna", 16), ("aortna", None), ("pljucna", None)):
        Z = oz_zak[ime]
        d = cKDTree(Z).query(cf, distance_upper_bound=0.0009)[0]; ob = np.isfinite(d) & ~epi  # samo znotraj
        if pap is None:
            dl[ob] = ZAK[ime]; continue
        g = (Z - c4) @ os_; obroc = Z[g < np.quantile(g, 0.35)].mean(0)
        glob = (cf - obroc) @ os_
        dl[ob & (glob < 0.026)] = ZAK[ime]; dl[ob & (glob >= 0.026)] = pap
    dl = vecina(F, dl, len(DELI), 6)
    # gladke meje zaklopk (prej žagast rob lističa ob steni): oznako »zaklopka« razmažemo po mreži in odrežemo pri 0,5;
    # tanke tetive in robovi lističev (štrlijo iz zglajene ploskve) ostanejo, kakor so
    from scipy.sparse import coo_matrix
    a_ = np.concatenate([F[:, 0], F[:, 1], F[:, 2], F[:, 1], F[:, 2], F[:, 0]]); b_ = np.concatenate([F[:, 1], F[:, 2], F[:, 0], F[:, 0], F[:, 1], F[:, 2]])
    A = coo_matrix((np.ones(len(a_), np.float32), (a_, b_)), shape=(len(V), len(V))).tocsr(); A.data[:] = 1.0
    st_ = np.asarray(A.sum(1)).ravel() + 1e-9
    for z in (9, 10, 11, 12):
        je = dl == z
        if not je.any(): continue
        u = np.zeros(len(V), np.float32); st_f = np.zeros(len(V), np.float32)
        for k in range(3): np.add.at(u, F[:, k], je.astype(np.float32)); np.add.at(st_f, F[:, k], 1.0)
        u /= np.maximum(st_f, 1)
        for _ in range(30): u = 0.5 * u + 0.5 * (A @ u) / st_
        gl = u[F].mean(1) > 0.5
        tanko = je & (izb_f > 0.0012)
        stena_ = np.isin(dl, (0, 1, 2, 3, 4, 5, 13, 14)) & ~epi
        dl[gl & stena_] = z                                   # zapolni zajede
        nazaj = je & ~gl & ~tanko                              # odreži zobce
        if nazaj.any():
            drugi = np.where(np.isin(dl, (9, 10, 11, 12)), -1, dl)  # najbližja oznaka stene: večina sosedov brez zaklopk
            H = np.zeros((len(V), len(DELI)), np.float32)
            ok = drugi >= 0
            for k in range(3): np.add.at(H, (F[ok, k], drugi[ok]), 1.0)
            for _ in range(8): H = H + (A @ H) * 0.5
            dl[nazaj] = (H[F[nazaj, 0]] + H[F[nazaj, 1]] + H[F[nazaj, 2]]).argmax(1)
    # maščoba (maska barve) z najbližjega oglišča CT, samo zunaj
    ke = np.zeros(len(V), bool)
    for k in range(3): ke[F[epi, k]] = True
    masca = np.where(ke, ct["masca"][cKDTree(Vc).query(V)[1]], 0.0)
    ohrani = np.clip(izb / 0.0012, 0, 1)
    zv = np.zeros(len(V), bool)
    for k in range(3): zv[F[dl >= 9][:, k]] = True
    ohrani = np.maximum(ohrani, np.where(zv, 0.8, 0.0))
    # meje med deli (zaklopka – stena, trabekule – stena …) naj poenostavitev ohrani: gladek rob barve namesto žagastega
    lo_ = np.full(len(V), 99); hi_ = np.full(len(V), -1)
    for k in range(3): np.minimum.at(lo_, F[:, k], dl); np.maximum.at(hi_, F[:, k], dl)
    ohrani = np.maximum(ohrani, np.where(hi_ > lo_, 1.0, 0.0))
    log("[organi] srce_hh229: ploskve po delih " + ", ".join(f"{DELI[i][0][:22]} {n}" for i, n in enumerate(np.bincount(dl, minlength=len(DELI)))))
    return dict(V=V, F=F, dl=dl, epi=epi, masca=masca, ohrani=ohrani, L={k: v.mean(0) for k, v in oz_zak.items()}, por=por, h=h)

if __name__ == "__main__":  # razvoj: python3 srce_hh229.py <hh229-v1.npz> <ct-stene.npz> <izhod.npz>
    import sys
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from srce_ct import Polje
    h = dict(np.load(sys.argv[1])); c = np.load(sys.argv[2])
    ct = dict(V2=c["V2"], F=c["F"], epi=c["epi"], dl=c["dl"], L={str(n): l for n, l in zip(c["Limena"], c["L"])})
    ct["masca"] = c["masca"]
    r = stena(sys.argv[1], ct, Polje)
    sk = {"stene": (0, 1, 2, 3), "preddvora": (4, 5), "usesi": (6, 17), "korena": (7, 8), "zaklopke": (9, 10, 11, 12), "trabekule": (13, 14), "papilarne": (15, 16)}
    iz = dict(V=r["V"], F=r["F"][:0])
    for k, v in sk.items(): iz["V_" + k] = r["V"]; iz["F_" + k] = r["F"][np.isin(r["dl"], v)]
    np.savez(sys.argv[3], **iz)
    np.savez(sys.argv[3].replace(".npz", "-epi.npz"), V=r["V"], F=r["F"][:0], V_epi=r["V"], F_epi=r["F"][r["epi"]], V_endo=r["V"], F_endo=r["F"][~r["epi"]])

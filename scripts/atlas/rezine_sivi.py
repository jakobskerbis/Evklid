# Šivi med bloki kriorezin (rezine.py, korak 3b; numpy, brez drugih knjižnic). Telo je bilo rezano in fotografirano
# po blokih in v več sejah, zato se na stiku pokažejo trije pojavi, ki jih vidi frontalni in sagitalni prerez:
#   pomik   cela rezina je premaknjena za nekaj mm (kamera ali blok sta se premaknila) → stopnica v obrisu;
#   izpad   ena do tri rezine so zaledenele ali motne (bela meglica) → svetla črta čez prerez;
#   skok    osvetlitev se spremeni samo na delu rezine (npr. spredaj) → pas, ki je temnejši ali svetlejši.
# Popravek je krajeven: pomik se izravna s premikom rezin za stikom (le osamljeni skoki z jasnim vrhom fazne
# korelacije, ne postopno premikanje anatomije, npr. stopal), izpad se nadomesti s prelivom sosednjih dobrih rezin,
# skok pa se izravna v prekrivnem pasu ±PAS mm okoli stika: vsaka stran se premakne za polovico skoka, popravek
# linearno upade na 0 na robu pasu. Skok se meri na polju celic CELICA mm (log barve, gladeno), zato je popravek gladek
# po prostoru in ne seže v sosednje bloke (napaka se ne kopiči vzdolž telesa – prejšnji poskus, 10. 11.).
import numpy as np

CELICA = 12      # mm celice polja barve
PAS = 30         # mm polovica prekrivnega pasu
SIGMA = 2.0      # celic glajenja polja skoka


def _gauss(s):
    r = np.arange(-int(3 * s), int(3 * s) + 1)
    g = np.exp(-r ** 2 / (2 * s * s))
    return g / g.sum()


def gladi(X, m, s=SIGMA):
    """Normirano glajenje (hc, wc, k) po celicah, kjer je m; vrne (gladko, utež)."""
    g = _gauss(s); r = len(g) // 2
    def b(A, ax):   # »full« in izrez: »same« bi pri osi, krajši od jedra, vrnil daljši niz
        return np.apply_along_axis(lambda v: np.convolve(v, g, "full")[r:r + len(v)], ax, A)
    num = b(b(np.where(m[..., None], X, 0.0), 0), 1)
    den = b(b(m.astype(np.float64), 0), 1)
    return num / np.maximum(den, 1e-6)[..., None], den


def premakni(a, dy, dx):
    """Premik slike (H, W, …) za celo število pikslov; prazno se zapolni z 0."""
    if not dy and not dx:
        return a
    out = np.zeros_like(a); H, W = a.shape[:2]
    ys, yd = (slice(0, H - dy), slice(dy, H)) if dy >= 0 else (slice(-dy, H), slice(0, H + dy))
    xs, xd = (slice(0, W - dx), slice(dx, W)) if dx >= 0 else (slice(-dx, W), slice(0, W + dx))
    out[yd, xd] = a[ys, xs]
    return out


def _spekter(rgb, a, okno):
    g = rgb.mean(-1) * a
    v = a > 0.9
    if v.sum() < 500:
        return None
    return np.fft.rfft2((g - g[v].mean() * a) * okno)


def _vrh(fa, fb, H, W):
    R = fa * np.conj(fb); R /= np.abs(R) + 1e-6
    r = np.fft.irfft2(R, s=(H, W))
    i = np.unravel_index(int(np.argmax(r)), r.shape)
    dy = i[0] if i[0] < H // 2 else i[0] - H
    dx = i[1] if i[1] < W // 2 else i[1] - W
    return int(dy), int(dx), float(r.max())   # popravek za rezino z (premakni), da se ujame s prejšnjo


def pomiki(rezina, Z, H, W):
    """rezina(z) → (rgb float (H, W, 3), a 0..1 (H, W)) na 1 mm. Vrne (Z, 2) celih mm: za koliko premakniti rezino z
    (premakni(…, dy, dx)), da se ujame s prejšnjimi, in seznam stikov [(z, dy, dx, vrh)]."""
    okno = (np.hanning(H)[:, None] * np.hanning(W)[None]).astype(np.float32)
    s = np.zeros((Z, 3)); prej = None
    for z in range(Z):
        f = _spekter(*rezina(z), okno)
        if f is not None and prej is not None:
            s[z] = _vrh(prej, f, H, W)
        prej = f
    stiki = []
    for z in range(1, Z):
        d = abs(s[z, 0]) + abs(s[z, 1])
        if not d or d > 10:
            continue
        sosed = any(abs(s[q, 0]) + abs(s[q, 1]) for q in (z - 1, z + 1) if 0 < q < Z)
        if sosed:          # postopno premikanje (anatomija, stopala), ne stik
            continue
        if (d >= 2 and s[z, 2] >= 0.15) or s[z, 2] >= 0.3:
            stiki.append((z, int(s[z, 0]), int(s[z, 1]), round(float(s[z, 2]), 3)))
    P = np.zeros((Z, 2), np.int64)
    for z, dy, dx, _ in stiki:
        P[z:] += (dy, dx)
    P -= np.rint(np.median(P, 0)).astype(np.int64)     # telo ostane sredi izreza
    return P, stiki


def polje(rezina, Z, H, W, C=CELICA):
    """(F, pov): F (Z, hc, wc, 3) povprečje log barve po celicah C × C mm (samo neprosojni piksli telesa; NaN, kjer jih je
    premalo), pov (Z,) površina telesa v rezini (mm²)."""
    hc, wc = H // C, W // C
    F = np.full((Z, hc, wc, 3), np.nan, np.float32); pov = np.zeros(Z)
    for z in range(Z):
        rgb, a = rezina(z)
        pov[z] = float((a > 0.5).sum())
        rgb = rgb[:hc * C, :wc * C]; v = (a[:hc * C, :wc * C] > 0.98).astype(np.float32)
        sv = (np.log(rgb + 8) * v[..., None]).reshape(hc, C, wc, C, 3).sum((1, 3))
        n = v.reshape(hc, C, wc, C).sum((1, 3))
        ok = n > C * C * 0.6
        F[z][ok] = sv[ok] / n[ok][:, None]
    return F, pov


def _nanmed(A):
    import warnings
    with warnings.catch_warnings():
        warnings.simplefilter("ignore")
        return np.nanmedian(A, 0)


def _velikost(D):
    """Gladko polje razlike (hc, wc, 3) z NaN → (gladko, maska, mediana |gladko|)."""
    m = ~np.isnan(D[..., 0])
    if m.sum() < 20:
        return None, m, 0.0
    Sz, _ = gladi(np.nan_to_num(D), m)
    return Sz, m, float(np.median(np.abs(Sz[m]).mean(-1)))


def _lokalno(a, r=15):
    ap = np.pad(a, r, mode="edge")
    return np.array([np.median(ap[i:i + 2 * r + 1]) for i in range(len(a))])


def izravnava(F, pov, izpadle=(), prag=3.0, najmanj=0.02):
    """F, pov iz polje(). Vrne (izpad, G, stiki): izpad {z: (za, zb, w)} motnih ali okrnjenih rezin (preliv najbližjih
    dobrih), G (Z, hc, wc, 3) log popravek barve (rezina × exp(G)), stiki [(z, vrsta, velikost)]. izpadle: rezine, ki so
    že nadomeščene (ne merijo se); če je slovar {z: (za, zb, w)}, se tiste ob novih izpadih vrnejo s
    popravljenima krajiščema."""
    Z = F.shape[0]
    slabe = set(int(z) for z in izpadle)
    # 1 izpad: rezina, ki odstopa od mediane sosednjih (±3), ali ima občutno manj telesa (zaledenela ploskev, okrnjena maska)
    dev = np.zeros(Z)
    for z in range(Z):
        if z in slabe:
            continue
        # odstopa od obeh strani (pri skoku osvetlitve se rezina ujema z eno stranjo)
        pred = [q for q in range(max(0, z - 3), z) if q not in slabe]
        po = [q for q in range(z + 1, min(Z, z + 4)) if q not in slabe]
        if len(pred) < 2 or len(po) < 2:
            continue
        dev[z] = min(_velikost(F[z] - _nanmed(F[pred]))[2], _velikost(F[z] - _nanmed(F[po]))[2])
    ozd = _lokalno(dev)
    pmed = _lokalno(pov, 12)
    motne = {z for z in range(Z) if z not in slabe and pov[z] > 2000 and dev[z] > max(0.03, prag * ozd[z])}
    okrnjene = {z for z in range(Z) if z not in slabe and pmed[z] > 2000 and pov[z] < 0.95 * pmed[z]}
    izpad, stiki = {}, []

    def nizi(mn, najvec):
        out = []
        for z in sorted(mn):
            if out and z <= out[-1][-1] + 2 and z - out[-1][0] < najvec:   # vmesna dobra rezina v nizu je tudi sumljiva
                out[-1].extend(range(out[-1][-1] + 1, z + 1))
            else:
                out.append([z])
        return [n for n in out if len(n) <= najvec]
    # motne: največ 3 zaporedne (daljše spremembe so anatomija); okrnjene (manjka del telesa ob stiku blokov): do 10
    for niz in sorted(nizi(motne, 3) + nizi(okrnjene, 10)):
        if any(q in izpad for q in niz):
            niz = [q for q in niz if q not in izpad]
            if not niz:
                continue
        za = niz[0] - 1
        while (za in slabe or za in izpad) and za > 0:
            za -= 1
        zb = niz[-1] + 1
        while (zb in slabe or zb in izpad or zb in okrnjene or zb in motne) and zb < Z - 1:
            zb += 1
        if za < 0 or zb >= Z:
            continue
        for q in niz:
            izpad[q] = (int(za), int(zb), (q - za) / (zb - za))
        stiki.append((niz[0], "izpad", len(niz)))
    # že nadomeščene rezine ob novih izpadih in novi izpadi ob že nadomeščenih: preliv naj gre od dobre do dobre
    if isinstance(izpadle, dict):
        for q, v in izpadle.items():
            q = int(q)
            if int(v[0]) in izpad or int(v[1]) in izpad:
                izpad[q] = (int(v[0]), int(v[1]), 0.0)
    for q, (za, zb, w) in list(izpad.items()):
        while (za in izpad or za in slabe) and za > 0:
            za -= 1
        while (zb in izpad or zb in slabe) and zb < Z - 1:
            zb += 1
        izpad[q] = (int(za), int(zb), (q - za) / (zb - za))
    slabe |= set(izpad)
    dobre = [z for z in range(Z) if z not in slabe]
    # 2 skok: stik med zaporednima dobrima rezinama, kjer se gladko polje barve spremeni bolj kot običajno
    a = np.zeros(len(dobre))
    for i in range(1, len(dobre)):
        _, _, a[i] = _velikost(F[dobre[i]] - F[dobre[i - 1]])
    ozd = _lokalno(a)
    G = np.zeros(F.shape, np.float32)
    for i in range(1, len(dobre)):
        if not (a[i] > najmanj and a[i] > prag * max(ozd[i], 1e-3)):
            continue
        z = dobre[i]
        D = _nanmed(F[dobre[i:i + 3]]) - _nanmed(F[dobre[max(0, i - 3):i]])
        m = ~np.isnan(D[..., 0])
        if m.sum() < 20:
            continue
        J, ut = gladi(np.nan_to_num(D), m)
        J = np.where((ut > 0.05)[..., None], J, 0).astype(np.float32)
        for q in range(max(0, z - PAS), min(Z, z + PAS)):
            t = q - z
            w = 0.5 * (1 - (t + 1) / PAS) if t >= 0 else 0.5 * (1 + (t + 1) / PAS)   # na stiku ±1/2, na robu pasu 0
            G[q] += (-w if t >= 0 else w) * J
        stiki.append((z, "skok", round(float(np.abs(J[m]).mean()), 3)))
    return izpad, G, sorted(stiki)


def razsiri(Gz, H, W, C=CELICA, px=1.0):
    """Log polje celic (hc, wc, 3) → množilnik (H, W, 3) za sliko z velikostjo piksla px mm (bilinearno, središča celic)."""
    hc, wc = Gz.shape[:2]
    yy = (np.arange(H) + 0.5) * px / C - 0.5; xx = (np.arange(W) + 0.5) * px / C - 0.5
    y0 = np.clip(np.floor(yy).astype(int), 0, hc - 1); x0 = np.clip(np.floor(xx).astype(int), 0, wc - 1)
    y1 = np.clip(y0 + 1, 0, hc - 1); x1 = np.clip(x0 + 1, 0, wc - 1)
    fy = np.clip(yy - y0, 0, 1)[:, None, None]; fx = np.clip(xx - x0, 0, 1)[None, :, None]
    g = (Gz[y0][:, x0] * (1 - fy) * (1 - fx) + Gz[y0][:, x1] * (1 - fy) * fx
         + Gz[y1][:, x0] * fy * (1 - fx) + Gz[y1][:, x1] * fy * fx)
    return np.exp(g).astype(np.float32)

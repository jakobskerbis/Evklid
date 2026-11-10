# Poravnava mrež HuBMAP HRA (3d-vh-m-united.glb / 3d-vh-f-united.glb, CC BY 4.0; narejene po istih telesih kot
# kriorezine) z volumnom kriorezin in vokselizacija v mrežo oznak za »Pravi prerez« (dotik na rezini → ime strukture).
# Teče na strežniku (numpy, scipy, Pillow), ne na j-jevem računalniku:
#   python3 scripts/atlas/rezine_oznake.py <united.glb> <delo (rezine.py: vol.u8 ali vol4.npz, maska.npz, konc.u8)> <izhod (meta.json)> [--matrika-iz-mete]
# Poravnava (afina, HRA v metrih → mm okvirja rezin): začetek iz mejnikov (teme, sredina in globina glave), nato
# optimizacija 9 parametrov (merila po oseh, premik, majhni zasuki), ki zmanjša razpršenost barve kriorezin znotraj
# vsakega organa (pljuča, jetra, možgani, kosti … so vsak zase barvno enotni) in kaznuje točke zunaj telesa. Koža HRA
# je v drugi drži (roke in noge odmaknjene), zato kože, podkožja in nog ne uporabljamo.
# Izhod: <izhod>/oznake.bin (mreža 2 mm, RLE: pari uint16 [dolžina, oznaka] po z, y, x), dopolnjen meta.json
# (»oznake«: mm, dim, ključi; »poravnava«: matrika 4 × 4, mejniki, ocena), <izhod>/poravnava.webp (kontrolna slika).
import json, os, re, struct, sys
import numpy as np

TU = os.path.dirname(os.path.abspath(__file__))
KOREN = os.path.dirname(os.path.dirname(TU))
MM = 2  # voksel mreže oznak

# ---- GLB (samo to, kar HRA uporablja: mreže z indeksi, brez stiskanja)
_CT = {5120: np.int8, 5121: np.uint8, 5122: np.int16, 5123: np.uint16, 5125: np.uint32, 5126: np.float32}
_NK = {"SCALAR": 1, "VEC2": 2, "VEC3": 3, "VEC4": 4, "MAT4": 16}


def _acc(j, b, i):
    a = j["accessors"][i]; bv = j["bufferViews"][a["bufferView"]]; dt = np.dtype(_CT[a["componentType"]]); n = _NK[a["type"]]
    o = bv.get("byteOffset", 0) + a.get("byteOffset", 0); st = bv.get("byteStride")
    if st and st != dt.itemsize * n:
        raw = np.lib.stride_tricks.as_strided(b[o:], (a["count"], dt.itemsize * n), (st, 1))
        return np.ascontiguousarray(raw).view(dt).reshape(a["count"], n)
    return np.frombuffer(b, dt, a["count"] * n, o).reshape(a["count"], n)


def _mat(nd):
    if "matrix" in nd:
        return np.array(nd["matrix"], float).reshape(4, 4).T
    m = np.eye(4)
    if "scale" in nd:
        m = np.diag(list(nd["scale"]) + [1.0])
    if "rotation" in nd:
        x, y, z, w = nd["rotation"]; r = np.eye(4)
        r[:3, :3] = [[1 - 2 * (y * y + z * z), 2 * (x * y - z * w), 2 * (x * z + y * w)], [2 * (x * y + z * w), 1 - 2 * (x * x + z * z), 2 * (y * z - x * w)],
                     [2 * (x * z - y * w), 2 * (y * z + x * w), 1 - 2 * (x * x + y * y)]]
        m = r @ m
    if "translation" in nd:
        t = np.eye(4); t[:3, 3] = nd["translation"]; m = t @ m
    return m


def mreze(pot):
    """→ [(pot vozlišča z /, V (n, 3) v metrih, F (m, 3))]"""
    with open(pot, "rb") as f:
        f.read(12); l, _ = struct.unpack("<II", f.read(8)); j = json.loads(f.read(l)); l2, _ = struct.unpack("<II", f.read(8)); o = f.tell()
    b = np.memmap(pot, np.uint8, "r", offset=o, shape=(l2,)); out = []

    def hodi(i, M, imena):
        nd = j["nodes"][i]; M2 = M @ _mat(nd); im = imena + [re.sub(r"^VH_[MF]_", "", nd.get("name", ""))]
        if "mesh" in nd:
            for p in j["meshes"][nd["mesh"]]["primitives"]:
                V = _acc(j, b, p["attributes"]["POSITION"]).astype(np.float64) @ M2[:3, :3].T + M2[:3, 3]
                F = _acc(j, b, p["indices"]).reshape(-1, 3).astype(np.int64) if "indices" in p else np.arange(len(V)).reshape(-1, 3)
                out.append(("/" + "/".join(im[1:]).lower() + "/", V, F))
        for c in nd.get("children", []):
            hodi(c, M2, im)
    for r in j["scenes"][j.get("scene", 0)]["nodes"]:
        hodi(r, np.eye(4), [])
    return out


def _zarki_x(V, F, dim):
    """Žarki vzdolž x skozi središča vokslov, parnost prehodov → (notri bool [Z, H, W], veljaven žarek bool [Z, H])."""
    W, H, Z = dim
    P = V[F]                                   # (m, 3, 3)
    y = P[..., 1] - 0.5 - 1.3e-4; z = P[..., 2] - 0.5 - 2.7e-4   # središča vokslov na celih številih (z drobnim zamikom proti robovom)
    j0 = np.ceil(y.min(1)).astype(int); j1 = np.floor(y.max(1)).astype(int)
    k0 = np.ceil(z.min(1)).astype(int); k1 = np.floor(z.max(1)).astype(int)
    st = np.zeros(Z * H * (W + 1), np.int32)
    ziv = (j1 >= j0) & (k1 >= k0)
    idx = np.where(ziv)[0]
    if not len(idx):
        return np.zeros((Z, H, W), bool), np.ones((Z, H), bool)
    y, z, x = y[idx], z[idx], P[idx][..., 0]
    j0, j1, k0, k1 = j0[idx], j1[idx], k0[idx], k1[idx]
    d = (y[:, 1] - y[:, 0]) * (z[:, 2] - z[:, 0]) - (y[:, 2] - y[:, 0]) * (z[:, 1] - z[:, 0])
    for a in range(int((j1 - j0).max()) + 1):
        ma = (j1 - j0) >= a
        for b_ in range(int((k1 - k0)[ma].max()) + 1):
            m = ma & ((k1 - k0) >= b_) & (np.abs(d) > 1e-12)
            if not m.any():
                continue
            jj = j0[m] + a; kk = k0[m] + b_
            yy, zz, xx, dd = y[m], z[m], x[m], d[m]
            w1 = ((jj - yy[:, 0]) * (zz[:, 2] - zz[:, 0]) - (yy[:, 2] - yy[:, 0]) * (kk - zz[:, 0])) / dd
            w2 = ((yy[:, 1] - yy[:, 0]) * (kk - zz[:, 0]) - (jj - yy[:, 0]) * (zz[:, 1] - zz[:, 0])) / dd
            v = (w1 >= 0) & (w2 >= 0) & (w1 + w2 <= 1) & (jj >= 0) & (jj < H) & (kk >= 0) & (kk < Z)
            if not v.any():
                continue
            xs = xx[v, 0] + w1[v] * (xx[v, 1] - xx[v, 0]) + w2[v] * (xx[v, 2] - xx[v, 0])
            xi = np.clip(np.ceil(xs - 0.5), 0, W).astype(int)
            np.add.at(st, (kk[v] * H + jj[v]) * (W + 1) + xi, 1)
    st = st.reshape(Z, H, W + 1)
    notri = (np.cumsum(st, 2) % 2 == 1)
    return notri[:, :, :W], ~notri[:, :, -1]


def zaprta(F):
    """Ali je mreža zaprta (vsak rob natanko v dveh trikotnikih)."""
    if not len(F):
        return False
    e = np.sort(np.concatenate([F[:, [0, 1]], F[:, [1, 2]], F[:, [2, 0]]]), 1)
    _, n = np.unique(e[:, 0].astype(np.int64) * (int(F.max()) + 1) + e[:, 1], return_counts=True)
    return bool((n == 2).all())


def vokseliziraj(V, F, dim):
    """Mreža (oglišča v enotah vokslov x, y, z) → bool [Z, H, W]. Parnost prehodov po žarkih vzdolž vseh treh osi; voksel je
    notri, če tako pravi večina veljavnih žarkov (žarek z lihim številom prehodov skozi luknjo v mreži ne glasuje). En sam
    smer žarkov je pustila vodoravne pasove brez oznake čez pljuča in jetra (HRA ima organe iz več odprtih ploskev)."""
    W, H, Z = dim
    nx, okx = _zarki_x(V, F, (W, H, Z))                                   # [Z, H, W], [Z, H]
    ny, oky = _zarki_x(V[:, [1, 0, 2]], F, (H, W, Z))                     # [Z, W, H], [Z, W]
    nz, okz = _zarki_x(V[:, [2, 1, 0]], F, (Z, H, W))                     # [W, H, Z], [W, H]
    ny = ny.transpose(0, 2, 1); nz = nz.transpose(2, 1, 0)
    gx = np.broadcast_to(okx[:, :, None], (Z, H, W)); gy = np.broadcast_to(oky[:, None, :], (Z, H, W)); gz = np.broadcast_to(okz.T[None], (Z, H, W))
    za = (nx & gx).astype(np.int8) + (ny & gy) + (nz & gz)
    glas = gx.astype(np.int8) + gy + gz
    return (2 * za > glas) & (glas > 0)


def lupina(V, F, dim):
    """Voksli, skozi katere gre površina mreže (gosti vzorci na trikotnikih), zapolnjeni od znotraj: robustno za organ iz več
    odprtih ploskev z notranjimi stenami (jetra: ovojnica in segmenti), kjer parnost žarkov odpove."""
    from scipy import ndimage
    W, H, Z = dim
    m = np.zeros((Z, H, W), bool)
    P = V[F]
    dolz = np.max(np.linalg.norm(P[:, [1, 2, 0]] - P, axis=2), 1)
    n = np.clip(np.ceil(dolz * 2), 1, 64).astype(int)
    for k in np.unique(n):
        T = P[n == k]
        a, b = np.meshgrid(np.arange(k + 1), np.arange(k + 1)); sel = a + b <= k
        u = (a[sel] / k)[None, :, None]; w = (b[sel] / k)[None, :, None]
        Q = T[:, None, 0] + u * (T[:, None, 1] - T[:, None, 0]) + w * (T[:, None, 2] - T[:, None, 0])
        q = np.floor(Q.reshape(-1, 3)).astype(int)
        q = q[((q >= 0) & (q < [W, H, Z])).all(1)]
        m[q[:, 2], q[:, 1], q[:, 0]] = True
    m = ndimage.binary_closing(m, iterations=1)
    return ndimage.binary_erosion(ndimage.binary_fill_holes(m), iterations=1, border_value=0) | m


def zdruzi(g):
    """Mreže ene oznake → seznam (V, F, odprta) za vokselizacijo. Zaprte mreže vsaka zase (gnezdene lupine, npr. ovojnica in
    skorja ledvice, se ne izničijo), odprte ploskve skupaj (organ iz več ploskev, npr. pljuča, je zaprt šele kot celota)."""
    zap = [(V, F, False) for V, F in g if zaprta(F)]
    odp = [(V, F) for V, F in g if not zaprta(F)]
    if odp:
        off = np.cumsum([0] + [len(V) for V, _ in odp[:-1]])
        zap.append((np.concatenate([V for V, _ in odp]), np.concatenate([F + o for (_, F), o in zip(odp, off)]), True))
    return zap


def vokseli(V, F, odprta, dim):
    m = vokseliziraj(V, F, dim)
    return m | lupina(V, F, dim) if odprta else m


KOMORE = {"levi-prekat", "desni-prekat", "levi-preddvor", "desni-preddvor"}
SRCE = {"levi-prekat", "desni-prekat", "levi-preddvor", "desni-preddvor", "medprekatni-pretin", "srcne-zaklopke", "papilarne-misice"}
MOZGANI = {"veliki-mozgani", "mali-mozgani", "mozgansko-deblo", "talamus", "mozganski-prekat"}
BREZ_LOKALNE = {"arterija", "vena", "vencne-zile", "aorta", "votla-vena", "hrbtenjaca", "sapnice", "zolcni-vodi", "secevod", "sapnik",
                "stegnenica", "golenica", "mecnica", "pogacica", "sklepni-hrustanec", "meniskus", "kolenske-vezi", "prema-stegenska",
                "kita-kvadricepsa", "debelo-crevo", "tanko-crevo", "tesce-crevo", "vito-crevo", "dvanajstnik", "pljucna-arterija", "pljucna-vena"}


def enota(kl, pot):
    """Enota lokalne poravnave (premakne se kot celota) ali None (samo globalna poravnava: žile, črevo, dolge strukture)."""
    if kl in SRCE:
        return "srce"
    if kl in MOZGANI:
        return "mozgani"
    if kl in BREZ_LOKALNE:
        return None
    m = re.search(r"(cervical|thoracic|lumbar)_vertebra_\d+/|intervertebral_disk_of_[a-z]+_[a-z]+_vertebra/|intervertebral_disk_of_axis/", pot)
    if m:
        return m.group(0).strip("/")
    if kl in ("ledvica", "ledvicni-meh", "leva-ledvica", "desna-ledvica"):
        return "ledvica-" + ("l" if re.search(r"(_l/|left_)", pot) else "d")
    return kl


def zapolni_votline(idx, dim):
    """Srce: HRA ima stene votlin kot lupine (levi prekat brez pretina je v prečni rezini odprt »C«). Votline (kri) v
    celem srcu zapolnimo po prečnih rezinah in vsak voksel damo najbližji votlini, da dotik sredi prekata pove ime."""
    from scipy import ndimage
    vse = [v for v in idx.values() if len(v)]
    if not vse:
        return
    V = np.concatenate(vse); lo = np.maximum(V.min(0) - 3, 0); hi = np.minimum(V.max(0) + 4, dim)
    L = np.zeros(hi - lo, np.uint8); kom = [k for k in KOMORE if k in idx and len(idx[k])]
    for kl, v in idx.items():
        if len(v):
            L[tuple((v - lo).T)] = (kom.index(kl) + 1) if kl in kom else 255
    S = L > 0
    c = ndimage.binary_closing(S, iterations=2)
    for i in range(c.shape[0]):
        c[i] = ndimage.binary_fill_holes(c[i])
    vot = c & ~S
    if not vot.any() or not kom:
        return
    jeKom = (L > 0) & (L < 255)
    _, ind = ndimage.distance_transform_edt(~jeKom, return_indices=True)
    naj = L[ind[0], ind[1], ind[2]]
    for j, kl in enumerate(kom):
        dod = np.argwhere(vot & (naj == j + 1)).astype(np.int32) + lo.astype(np.int32)
        idx[kl] = np.concatenate([idx[kl], dod])


def lokalni_premik(v, konc, dim, doseg=6):
    """v: voksli enote (z, y, x) v mreži 2 mm → najboljši premik (vokslov, ±doseg) in cena prej/potem."""
    from scipy import ndimage
    Z2, H2, W2 = dim
    lo = np.maximum(v.min(0) - 3, 0); hi = np.minimum(v.max(0) + 4, dim)
    m = np.zeros(hi - lo, bool); m[tuple((v - lo).T)] = True
    lupina = ndimage.binary_dilation(m, iterations=2) & ~m
    rng = np.random.default_rng(7)
    P = v if len(v) <= 5000 else v[rng.choice(len(v), 5000, replace=False)]
    S = np.argwhere(lupina) + lo
    S = S if len(S) <= 5000 else S[rng.choice(len(S), 5000, replace=False)]
    Zm, Hm, Wm = konc.shape[:3]

    def barve(Q):
        q = Q * MM + MM // 2
        q = np.minimum(np.maximum(q, 0), [Zm - 1, Hm - 1, Wm - 1])
        o = np.lexsort((q[:, 2], q[:, 1], q[:, 0]))       # branje po vrsti (memmap)
        c = np.empty((len(q), 4), np.float32); c[o] = konc[q[o, 0], q[o, 1], q[o, 2]]
        return c
    cache = {}

    def cena(t):
        t = tuple(int(x) for x in t)
        if t not in cache:
            a = barve(P + t); b = barve(S + t)
            ta = a[:, 3] > 128; zunaj = 1 - ta.mean()
            ca, cb = a[ta, :3], b[b[:, 3] > 128, :3]
            if len(ca) < 20 or len(cb) < 20:
                cache[t] = 1e9
            else:
                kontrast = ((ca.mean(0) - cb.mean(0)) ** 2).sum()
                cache[t] = float(ca.var(0).sum() - 0.5 * kontrast + 3000 * zunaj + 3.0 * (MM * MM) * sum(x * x for x in t))
        return cache[t]
    naj = np.zeros(3, int); c0 = cena(naj)
    for korak in (2, 1):
        mreza = [naj + np.array([a, b, c]) * korak for a in range(-doseg // korak if korak == 2 else -1, (doseg // korak if korak == 2 else 1) + 1)
                 for b in range(-doseg // korak if korak == 2 else -1, (doseg // korak if korak == 2 else 1) + 1)
                 for c in range(-doseg // korak if korak == 2 else -1, (doseg // korak if korak == 2 else 1) + 1)]
        mreza = [t for t in mreza if (np.abs(t) <= doseg).all()]
        naj = min(mreza, key=cena)
    return naj, c0, cena(naj)


def afina(p):
    """9 parametrov → matrika 4 × 4 (HRA m → mm okvirja rezin): merila, premik, zasuki (rad) okoli osi rezin."""
    sx, sy, sz, tx, ty, tz, rx, ry, rz = p
    B = np.array([[1000.0, 0, 0], [0, 0, -1000.0], [0, -1000.0, 0]])   # x = X, y = −Z (spredaj → zadaj), z = −Y (glava → noge)
    cx, sx_, cy, sy_, cz, sz_ = np.cos(rx), np.sin(rx), np.cos(ry), np.sin(ry), np.cos(rz), np.sin(rz)
    R = (np.array([[1, 0, 0], [0, cx, -sx_], [0, sx_, cx]]) @ np.array([[cy, 0, sy_], [0, 1, 0], [-sy_, 0, cy]]) @ np.array([[cz, -sz_, 0], [sz_, cz, 0], [0, 0, 1]]))
    M = np.eye(4); M[:3, :3] = R @ np.diag([sx, sy, sz]) @ B; M[:3, 3] = [tx, ty, tz]
    return M


def main():
    a = sys.argv[1:]
    glb, delo, izhod = a[0], a[1], a[2]
    with open(os.path.join(izhod, "meta.json"), encoding="utf-8") as f:
        meta = json.load(f)
    with open(os.path.join(KOREN, "public", "3d", "rezine-oznake.json"), encoding="utf-8") as f:
        tab = json.load(f)
    kljuci = list(tab["oznake"]); vz = [(re.compile(r), k) for r, k in tab["vzorci"]]
    W1, H1 = meta["okvir"]; Wc, Hc, Z = meta["dim"]; x0, y0 = meta["izrez"]
    telo = np.unpackbits(np.load(os.path.join(delo, "maska.npz"))["telo"])[:Z * H1 * W1].reshape(Z, H1, W1).astype(bool)
    iz_mete = "--matrika-iz-mete" in a and "poravnava" in meta   # ponovna vokselizacija z že najdeno globalno poravnavo
    # volumen 4 mm za optimizacijo (barva, telo); s prenosnika pride kot vol4.npz (rezine.py), ker je vol.u8 prevelik
    k = 4 if not iz_mete else 0
    Zk, Hk, Wk = (Z // k, H1 // k, W1 // k) if k else (0, 0, 0)
    p4 = os.path.join(delo, "vol4.npz")
    if k and not os.path.exists(os.path.join(delo, "vol.u8")) and os.path.exists(p4):
        g4 = np.load(p4); v4 = g4["v4"].astype(np.float32)[:Zk, :Hk, :Wk]; t4 = g4["t4"].astype(np.float32)[:Zk, :Hk, :Wk]
        Zk = 0
    else:
        vol = np.memmap(os.path.join(delo, "vol.u8"), np.uint8, "r", shape=(Z, H1, W1, 4)) if k else None
        v4 = np.zeros((Zk, Hk, Wk, 3), np.float32); t4 = np.zeros((Zk, Hk, Wk), np.float32)
    for z in range(Zk):
        b = np.asarray(vol[z * k:(z + 1) * k, :Hk * k, :Wk * k, :3], np.float32).reshape(k, Hk, k, Wk, k, 3).mean((0, 2, 4))
        v4[z] = b; t4[z] = telo[z * k:(z + 1) * k, :Hk * k, :Wk * k].reshape(k, Hk, k, Wk, k).mean((0, 2, 4))
    # mreže po oznakah
    skupine = {}
    enote_mrez = {}   # enota lokalne poravnave → {oznaka: [(V, F)]}
    neujete = set()
    for pot, V, F in mreze(glb):
        kl = next((kk for r, kk in vz if r.search(pot)), None)
        if kl is None:
            neujete.add(pot); continue
        if kl != "-":
            skupine.setdefault(kl, []).append((V, F))
            enote_mrez.setdefault(enota(kl, pot), {}).setdefault(kl, []).append((V, F))
    if neujete:
        print("brez vzorca:", sorted(neujete)[:20], len(neujete))
    vse = np.concatenate([V for g in skupine.values() for V, F in g])
    if iz_mete:
        M = np.array(meta["poravnava"]["matrika"], float); p = np.array(meta["poravnava"]["parametri"], float)
        mejniki = meta["poravnava"]["mejniki"]; raz0, raz = meta["poravnava"]["razprsenost_barve"]; zun0, zun = meta["poravnava"]["zunaj_telesa"]
    else:
        # ---- začetek iz mejnikov: teme (prva rezina s telesom), sredina in globina glave
        zt = int(np.argmax(telo.any((1, 2))))
        glava = telo[zt + 40:zt + 120]; ys, xs = np.where(glava.any(0))
        mozg = np.concatenate([V for V, F in skupine.get("veliki-mozgani", [(vse, None)])])
        mejniki = {"teme_z_mm": zt, "glava_x_mm": float(xs.mean()), "glava_y_mm": float(ys.mean()),
                   "hra_mozgani_m": mozg.mean(0).round(4).tolist(), "hra_vrh_mozganov_m": float(mozg[:, 1].max())}
        p0 = np.array([1, 1, 1, xs.mean() - 1000 * mozg[:, 0].mean(), ys.mean() + 1000 * mozg[:, 2].mean(), zt + 12 + 1000 * mozg[:, 1].max(), 0, 0, 0], float)
        # ---- vzorčne točke znotraj organov (v prostoru HRA, mreža 4 mm), brez nog (druga drža)
        brez = {"stegnenica", "golenica", "mecnica", "pogacica", "sklepni-hrustanec", "meniskus", "kolenske-vezi", "prema-stegenska", "kita-kvadricepsa", "dojka"}
        tocke = []
        for kl, g in skupine.items():
            if kl in brez:
                continue
            Vg = np.concatenate([V for V, F in g]); lo = Vg.min(0) - 0.004; n = np.ceil((Vg.max(0) - lo) / 0.004).astype(int) + 1
            notri = np.zeros((n[2], n[1], n[0]), bool)
            for V, F in zdruzi(g):
                notri |= vokseliziraj((V - lo) / 0.004, F, n)
            zz, yy, xx = np.where(notri)
            if len(zz) < 30:
                continue
            P = lo + (np.stack([xx, yy, zz], 1) + 0.5) * 0.004
            if len(P) > 6000:
                P = P[np.random.default_rng(1).choice(len(P), 6000, replace=False)]
            tocke.append((kl, P))
        print("organov za poravnavo:", len(tocke), "točk:", sum(len(P) for _, P in tocke))

        def cena(p, podrobno=False):
            M = afina(p); c = 0.0; n = 0; zunaj = 0
            for kl, P in tocke:
                q = (P @ M[:3, :3].T + M[:3, 3]) / k
                i = np.floor(q).astype(int)
                ok = (i[:, 0] >= 0) & (i[:, 0] < Wk) & (i[:, 1] >= 0) & (i[:, 1] < Hk) & (i[:, 2] >= 0) & (i[:, 2] < Zk)
                i = i[ok]
                t = t4[i[:, 2], i[:, 1], i[:, 0]] > 0.5
                zunaj += len(P) - int(t.sum())
                if t.sum() > 20:
                    b = v4[i[:, 2], i[:, 1], i[:, 0]][t]
                    c += b.var(0).sum() * t.sum()
                n += len(P)
            return (c / n + 4000.0 * zunaj / n) if not podrobno else (c / n, zunaj / n)

        p = p0
        if "--brez-optimizacije" not in a:
            from scipy.optimize import minimize
            naj = (cena(p0), p0)
            for dz in (-30, -15, 0, 15, 30):          # groba mreža premikov, nato Powell
                for dy in (-20, 0, 20):
                    q = p0.copy(); q[5] += dz; q[4] += dy
                    c = cena(q)
                    if c < naj[0]:
                        naj = (c, q)
            mer = np.array([0.02, 0.02, 0.02, 4, 4, 4, 0.01, 0.01, 0.01])
            r = minimize(lambda u: cena(naj[1] + u * mer), np.zeros(9), method="Powell", options={"xtol": 0.05, "ftol": 1e-5, "maxiter": 40})
            p = naj[1] + r.x * mer
        M = afina(p)
        raz, zun = cena(p, True); raz0, zun0 = cena(p0, True)
        print(f"poravnava: razpršenost barve {raz0:.0f} → {raz:.0f}, zunaj telesa {zun0 * 100:.1f} % → {zun * 100:.1f} %; parametri {np.round(p, 4).tolist()}")


    # ---- mreža oznak 2 mm v izrezu rezin; manjše strukture prepišejo večje
    W2, H2, Z2 = -(-Wc // MM), -(-Hc // MM), -(-Z // MM)
    ozn = np.zeros((Z2, H2, W2), np.uint8); plasti = []

    def maska(g, kl=""):
        """Mreže → indeksi vokslov (z, y, x) mreže 2 mm, kot int32 [n, 3]."""
        m = np.zeros((Z2, H2, W2), bool)
        for V, F, odp in zdruzi(g):
            q = V @ M[:3, :3].T + M[:3, 3]
            q = (q - [x0, y0, 0]) / MM
            lo = np.floor(q.min(0)).astype(int) - 1; n = np.ceil(q.max(0)).astype(int) + 2 - lo
            sub = vokseli(q - lo, F, odp, n)
            xa, ya, za = max(lo[0], 0), max(lo[1], 0), max(lo[2], 0)
            xb, yb, zb = min(lo[0] + n[0], W2), min(lo[1] + n[1], H2), min(lo[2] + n[2], Z2)
            if xb > xa and yb > ya and zb > za:
                m[za:zb, ya:yb, xa:xb] |= sub[za - lo[2]:zb - lo[2], ya - lo[1]:yb - lo[1], xa - lo[0]:xb - lo[0]]
        return np.argwhere(m).astype(np.int32)

    # lokalna poravnava (srce, vsako vretence, ledvici, jetra …): premik enote za največ ±12 mm, ki naredi barvo kriorezin
    # znotraj enote čim bolj enotno in čim bolj drugačno od pasu tik zunaj nje (meja organa na fotografiji)
    konc = np.memmap(os.path.join(delo, "konc.u8"), np.uint8, "r", shape=(Z, Hc, Wc, 4))
    premiki = {}
    lokalno = "--brez-lokalne" not in a
    vse_enote = []
    for en, po in enote_mrez.items():
        idx = {kl: maska(g, kl) for kl, g in po.items()}
        t = np.zeros(3, int)
        # majhne strukture (oko, slinavke …) imajo premalo vokslov za zanesljivo oceno: ostanejo pri globalni poravnavi
        if lokalno and en is not None and sum(len(v) for v in idx.values()) >= 300:
            t, c0, c1 = lokalni_premik(np.concatenate([v for v in idx.values() if len(v)]), konc, (Z2, H2, W2))
            premiki[en] = {"mm": (t[::-1] * MM).tolist(), "cena": [round(c0), round(c1)]}
        if en == "srce":
            zapolni_votline(idx, (Z2, H2, W2))
        vse_enote.append([en, idx, np.array(t)])
    # hrbtenica: premik vretenca ne sme skočiti od sosedov (mediana treh zaporednih vretenc; ploščica = povprečje sosednjih)
    red = [f"{d}_vertebra_{i}" for d, n in (("cervical", 7), ("thoracic", 12), ("lumbar", 5)) for i in range(1, n + 1)]
    po_imenu = {e[0]: e for e in vse_enote}
    surovi = {v: po_imenu[v][2].copy() for v in red if v in po_imenu}
    imena_v = [v for v in red if v in surovi]
    for k, v in enumerate(imena_v):
        okno = [surovi[imena_v[j]] for j in range(max(0, k - 1), min(len(imena_v), k + 2))]
        po_imenu[v][2] = np.median(np.array(okno), 0).round().astype(int)
        premiki.setdefault(v, {})["mm"] = (po_imenu[v][2][::-1] * MM).tolist()
    for e in vse_enote:
        if e[0] and e[0].startswith("intervertebral_disk"):
            e[2] = np.zeros(3, int) if not imena_v else np.median(np.array([po_imenu[v][2] for v in imena_v]), 0).round().astype(int)
    # vsako vretence ima svojo oznako (»prsno-vretence-th8«), da dotik obarva in imenuje samo dotaknjeno vretence
    KRV = {"cervical": "c", "thoracic": "th", "lumbar": "l"}
    for en, idx, t in vse_enote:
        mv = re.fullmatch(r"(cervical|thoracic|lumbar)_vertebra_(\d+)", en or "")
        for kl, v in idx.items():
            if len(v):
                v = v + t
                v = v[((v >= 0) & (v < [Z2, H2, W2])).all(1)]
            if mv and kl.endswith("-vretence"):
                kl = f"{kl}-{KRV[mv.group(1)]}{int(mv.group(2))}"
                if kl not in kljuci:
                    kljuci.append(kl)
            plasti.append((len(v), kl, v))
    # anatomske ravni: višina vsakega vretenca (mm od vrha volumna), da pogled pri prečni rezini pove »v višini Th8«
    KR = {"cervical": "C", "thoracic": "Th", "lumbar": "L"}
    ravni = []
    for en, idx, t in vse_enote:
        mm_ = re.fullmatch(r"(cervical|thoracic|lumbar)_vertebra_(\d+)", en or "")
        v = [x for x in idx.values() if len(x)]
        if mm_ and v:
            z = np.concatenate(v)[:, 0] + t[0]
            z0, z1 = np.percentile(z, [3, 97])     # brez posameznih vokslov odrastkov
            ravni.append([int(z0 * MM), int((z1 + 1) * MM), KR[mm_.group(1)] + mm_.group(2)])
    ravni.sort()
    if premiki:
        print("lokalni premiki (x, y, z mm):", {k: v["mm"] for k, v in premiki.items() if any(v["mm"])})
    for n, kl, v in sorted(plasti, key=lambda t: -t[0]):
        if n:
            ozn[v[:, 0], v[:, 1], v[:, 2]] = kljuci.index(kl) + 1
    # samo znotraj telesa
    t2 = np.zeros((Z2 * MM, H2 * MM, W2 * MM), bool); t2[:Z, :Hc, :Wc] = telo[:, y0:y0 + Hc, x0:x0 + Wc]
    ozn[~t2.reshape(Z2, MM, H2, MM, W2, MM).any((1, 3, 5))] = 0
    ploski = ozn.ravel()
    meje = np.flatnonzero(np.diff(ploski)) + 1; zac = np.concatenate([[0], meje]); dol = np.diff(np.concatenate([zac, [len(ploski)]]))
    pari = []
    for s, d in zip(zac, dol):
        v = int(ploski[s])
        while d > 65535:
            pari.append((65535, v)); d -= 65535
        pari.append((int(d), v))
    with open(os.path.join(izhod, "oznake.bin"), "wb") as f:
        f.write(np.array(pari, "<u2").tobytes())
    prisotne = sorted({kljuci[i - 1] for i in np.unique(ozn) if i})
    meta["oznake"] = {"mm": MM, "dim": [W2, H2, Z2], "datoteka": "oznake.bin", "kljuci": kljuci, "prisotne": prisotne,
                      "vir": "HuBMAP Human Reference Atlas (CC BY 4.0)", "ravni": ravni, "delez_telesa": round(float((ozn > 0).sum() / max(t2.reshape(Z2, MM, H2, MM, W2, MM).any((1, 3, 5)).sum(), 1)), 3)}
    meta["poravnava"] = {"opis": "HRA (m, Y gor) → mm okvirja rezin (x desno→levo telesa, y spredaj→zadaj, z glava→noge); izrez odštej posebej",
                         "matrika": np.round(M, 5).tolist(), "parametri": np.round(p, 5).tolist(), "mejniki": mejniki,
                         "razprsenost_barve": [round(raz0), round(raz)], "zunaj_telesa": [round(zun0, 4), round(zun, 4)],
                         "lokalno": premiki}
    with open(os.path.join(izhod, "meta.json"), "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=1)
    print(f"oznake: {len(prisotne)} struktur, {len(pari)} nizov, {os.path.getsize(os.path.join(izhod, 'oznake.bin')) / 1e6:.2f} MB, pokritost telesa {meta['oznake']['delez_telesa'] * 100:.0f} %")
    # kontrolna slika: frontalna in sagitalna rezina z obrisi oznak
    try:
        from PIL import Image
        konc = np.memmap(os.path.join(delo, "konc.u8"), np.uint8, "r", shape=(Z, Hc, Wc, 4))
        def obris(sl, oz):
            oz = np.repeat(np.repeat(oz, MM, 0), MM, 1)[:sl.shape[0], :sl.shape[1]]
            r = np.zeros(oz.shape, bool); r[1:] |= oz[1:] != oz[:-1]; r[:, 1:] |= oz[:, 1:] != oz[:, :-1]
            out = (sl[..., :3].astype(np.float32) * sl[..., 3:] / 255).astype(np.uint8); out[r] = (0, 255, 255); return out
        yk = int(np.argmax(telo[:, y0:y0 + Hc].sum((0, 2)))) ; xk = Wc // 2
        A = obris(np.asarray(konc[:, yk]), ozn[:, yk // MM]); B = obris(np.asarray(konc[:, :, xk]), ozn[:, :, xk // MM])
        zs = [int(Z * t) for t in (0.08, 0.22, 0.3, 0.42)]
        C = np.concatenate([obris(np.asarray(konc[z]), ozn[z // MM]) for z in zs], 0)
        h = max(A.shape[0], C.shape[0]); pl = np.zeros((h, A.shape[1] + B.shape[1] + C.shape[1] + 20, 3), np.uint8)
        pl[:A.shape[0], :A.shape[1]] = A; pl[:B.shape[0], A.shape[1] + 10:A.shape[1] + 10 + B.shape[1]] = B; pl[:C.shape[0], -C.shape[1]:] = C
        Image.fromarray(pl).save(os.path.join(izhod, "poravnava.webp"), quality=80)
    except ImportError:
        pass


if __name__ == "__main__":
    main()

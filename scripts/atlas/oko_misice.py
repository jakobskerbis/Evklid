# Očesne mišice Z-Anatomy, prilegane na zrklo HuBMAP HRA (docs/3d.md »Eye muscles«). Zrklo HRA je druge oblike kot
# beločnica Z-Anatomy, zato so se mišice vanj zarile (raztrgan rob ob narastišču) ali visele nad njim. Tu:
#  1. obe poševni mišici ležeta na beločnico (nobeno oglišče pod površino, konec se stanjša v tanko kito);
#  2. štiri preme mišice se po poldnevniku zrkla premaknejo tako, da je narastišče 5,5 (notranja), 6,5 (spodnja),
#     6,9 (zunanja) in 7,7 mm (zgornja) za limbusom – Tillauxova spirala (Standring, Gray's Anatomy, 42. izd., pogl. 41);
#     ob narastišču se stanjšajo v ploščato kito: zgornja ploskev ≥ 0,15 mm nad beločnico, spodnja 0,4 mm pod njeno
#     površino (čist rob, ploskvi se po poenostavitvi ne prepleteta);
#  3. atribut oglišč KITA (0 mišica … 1 kita) za peko barve (recept »kita« v peka.py): kite premih mišic, kita zgornje
#     poševne mišice od škripca (trochlea) do narastišča, konec spodnje poševne.
# Kliče izvozi-organe.py (cfg »dodaj«: ["ocesne_misice"]); vrstice = [ime, mesh, tkivo, del, veriga].
import heapq, math, re
import numpy as np
from mathutils import Vector
from mathutils.bvhtree import BVHTree

NARASTISCE = {"Medial": 0.0055, "Inferior": 0.0065, "Lateral": 0.0069, "Superior": 0.0077}  # m za limbusom
KITA_DOLZINA = {"Medial": 0.0037, "Inferior": 0.0055, "Lateral": 0.0088, "Superior": 0.0058}  # dolžina kite (m)
SIRINA = {"Medial": 0.0103, "Inferior": 0.0098, "Lateral": 0.0092, "Superior": 0.0106}  # širina narastišča (m)
EPS = 0.00015  # najmanjša višina nad beločnico (m): nad napako poenostavljene krogle, brez utripanja globine
POD = 0.0004  # spodnja ploskev kite toliko pod površino beločnice (stena je debela ≈ 1 mm)
KITA_DEB = 0.00045  # debelina kite ob narastišču (m)


def _tocke(me):
    p = np.empty(len(me.vertices) * 3); me.vertices.foreach_get("co", p)
    return p.reshape(-1, 3)


def _bvh(mreze):
    vs, fs, o = [], [], 0
    for me in mreze:
        me.calc_loop_triangles()
        vs += [v.co.copy() for v in me.vertices]
        fs += [tuple(i + o for i in t.vertices) for t in me.loop_triangles]
        o += len(me.vertices)
    return BVHTree.FromPolygons(vs, fs)


def _zunanji_polmer(bvh, G, U, daljava=0.05):
    """Polmer zunanje površine v smereh U (n × 3) iz središča G: žarek od zunaj proti središču, prvi zadetek."""
    r = np.full(len(U), np.nan)
    g = Vector(G)
    for i, u in enumerate(U):
        uv = Vector(u)
        hit = bvh.ray_cast(g + uv * daljava, -uv, daljava)
        if hit[0] is not None:
            r[i] = (hit[0] - g).length
    return r


def _geodezija(P, robovi, izvori):
    """Razdalja po robovih mreže od množice izvorov (Dijkstra)."""
    n = len(P); sos = [[] for _ in range(n)]
    for a, b in robovi:
        w = float(np.linalg.norm(P[a] - P[b])); sos[a].append((b, w)); sos[b].append((a, w))
    d = np.full(n, np.inf); kup = []
    for i in izvori:
        d[i] = 0.0; kup.append((0.0, int(i)))
    heapq.heapify(kup)
    while kup:
        di, i = heapq.heappop(kup)
        if di > d[i]:
            continue
        for j, w in sos[i]:
            if di + w < d[j]:
                d[j] = di + w; heapq.heappush(kup, (d[j], j))
    return d


def _gladko(x, a, b):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def _spodaj(hn):
    """Spodnja (k zrklu obrnjena) ploskev in robovi mišice ob stiku: do POD m pod površino podlage. Zgornja ploskev je
    vsaj EPS nad njo, zato se ploskvi po poenostavitvi mreže ne prepleteta (temne lise skozi kito), rob kite pa je
    čista presečnica z beločnico."""
    return hn - POD * (1 - _gladko(hn, EPS, 0.0015))


def _zgladi(h, robovi, maska, krat=4):
    """Laplaceovo glajenje polja višin po robovih mreže (samo oglišča v maski): brez gub, kjer mišica prečka drugo."""
    n = len(h); e = robovi[maska[robovi[:, 0]] & maska[robovi[:, 1]]]
    if not len(e):
        return h
    st = np.bincount(e.ravel(), minlength=n).astype(float)
    for _ in range(krat):
        acc = np.bincount(e[:, 0], weights=h[e[:, 1]], minlength=n) + np.bincount(e[:, 1], weights=h[e[:, 0]], minlength=n)
        h = np.where(maska & (st > 0), 0.5 * h + 0.5 * acc / np.maximum(st, 1), h)
    return h


def _pisi_kito(me, k):
    at = me.attributes.get("KITA") or me.attributes.new("KITA", "FLOAT", "POINT")
    at.data.foreach_set("value", np.clip(k, 0, 1).astype(np.float32))


def _normale(me):
    n = np.empty(len(me.vertices) * 3); me.vertex_normals.foreach_get("vector", n)
    return n.reshape(-1, 3)


def ocesne_misice(osnovni, cfg, tmp):
    def najdi(rx):
        return [r for r in osnovni if re.search(rx, r[0])]
    bel = najdi(r"(?i)^sclera"); roz = najdi(r"(?i)^cornea")
    if not bel or not roz:
        print("[oko] ocesne_misice: ni beločnice/roženice, preskočeno"); return []
    S = _tocke(bel[0][1]); C = _tocke(roz[0][1])
    G = (S.min(0) + S.max(0)) / 2
    os_ = C.mean(0) - G; os_ /= np.linalg.norm(os_)
    zrklo = _bvh([bel[0][1], roz[0][1]])
    # limbus: sprednji rob beločnice (najmanjši polarni kot zunanjih oglišč)
    dS = np.linalg.norm(S - G, axis=1); cosS = ((S - G) @ os_) / dS
    R0 = float(np.percentile(dS, 90))
    th_l = float(np.arccos(np.percentile(cosS[dS > np.percentile(dS, 50)], 99.8)))
    print(f"[oko] zrklo: zunanji polmer {R0 * 1000:.1f} mm, limbus pri {math.degrees(th_l):.1f}° od osi (polmer {R0 * math.sin(th_l) * 1000:.1f} mm)")

    # Šarenica HRA je ožja od odprtine beločnice: med njenim robom in limbusom se je skozi roženico videl temen kolobar
    # (ciliarnik). Zunanjo tretjino šarenice raztegnemo proti korenu (do 0,55 mm), da sega pod rob beločnice.
    for row in najdi(r"(?i)^iris"):
        me = row[1]; P = _tocke(me); d = P - G; hh = d @ os_; rad = d - np.outer(hh, os_); ro = np.linalg.norm(rad, axis=1)
        rmax = float(np.percentile(ro, 99.5)); cilj = R0 * math.sin(th_l) + 0.0003
        if cilj > rmax:
            t = np.clip((ro - 0.62 * rmax) / (0.38 * rmax), 0, 1)
            ro2 = ro + t * t * (cilj - rmax)
            me.vertices.foreach_set("co", (G + np.outer(hh, os_) + rad * (ro2 / np.maximum(ro, 1e-9))[:, None]).ravel()); me.update()
            print(f"[oko] šarenica: polmer {rmax * 1000:.2f} → {cilj * 1000:.2f} mm (do limbusa)")

    def polarno(P):
        d = P - G; r = np.linalg.norm(d, axis=1); u = d / r[:, None]
        return r, u, np.arccos(np.clip(u @ os_, -1, 1))

    def robovi(me):
        e = np.empty(len(me.edges) * 2, dtype=np.int32); me.edges.foreach_get("vertices", e)
        return e.reshape(-1, 2)

    skripec = najdi(r"^Trochlea")
    T = _tocke(skripec[0][1]).mean(0) if skripec else None

    def posevna(row, podlaga):
        """Poševna mišica na površino podlage; konec stanjšan v kito."""
        me = row[1]; P = _tocke(me); r, u, th = polarno(P)
        rs = _zunanji_polmer(podlaga, G, u); h0 = r - np.where(np.isnan(rs), 0, rs)
        # izvor = najbolj oddaljeni konec (vrh očnice oziroma dno očnice), narastišče = geodetsko najbolj oddaljeni konec
        go = _geodezija(P, robovi(me), np.nonzero(r > r.max() - 0.001)[0])
        go = np.where(np.isinf(go), 0, go); gd = go.max() - go
        zg = "Superior" in row[0]
        f = _gladko(gd, 0.0, 0.014 if zg else 0.005)  # kita zgornje poševne je tanka že pod zgornjo premo mišico
        hn = EPS + np.maximum(h0, 0) * ((0.3 if zg else 0.45) + (0.7 if zg else 0.55) * f)
        vrh = (_normale(me) * u).sum(1) > 0.3
        # konec poševne mišice je širok list: zgornja ploskev ≥ 0,6 mm nad podlago, da poenostavljena mreža telefona
        # (dolgi trikotniki) nikjer ne seka beločnice (nazobčan rob narastišča)
        hn = np.where(vrh & (gd < 0.02), np.maximum(hn, EPS + 0.0006), hn)
        hn = np.where(vrh, hn, _spodaj(hn))
        ima = ~np.isnan(rs)
        rn = np.where(ima, rs + hn, r)
        rn = np.where(ima & vrh, np.maximum(_zgladi(rn, robovi(me), ima & vrh, 4), rs + EPS), rn)
        me.vertices.foreach_set("co", (G + u * rn[:, None]).ravel()); me.update()
        if zg and T is not None:  # kita od škripca do narastišča
            it = int(np.argmin(np.linalg.norm(P - T, axis=1)))
            k = 1 - _gladko(gd, gd[it] - 0.003, gd[it] + 0.001)
        else:
            k = 1 - _gladko(gd, 0.0015, 0.004)
        _pisi_kito(me, k)
        print(f"[oko] {row[0]}: {int((h0 < 0).sum())} oglišč iz beločnice na površino, kita {float((k > 0.5).mean()):.0%}")

    th_e = math.radians(108)  # za ekvatorjem mišica zapusti zrklo: od tu nazaj brez zasuka

    def prema(row, podlaga):
        """Prema mišica: narastišče na Tillauxovo spiralo, ploščata kita nad podlago (beločnica in mišice pod njo)."""
        kljuc = row[0].split()[0]
        me = row[1]; P = _tocke(me); r, u, th = polarno(P)
        th_min = float(np.percentile(th, 0.5))
        th_n = th_l + NARASTISCE[kljuc] / R0
        # zasuk po poldnevniku: [th_min, th_e] → [th_n, th_e]
        tn = np.where(th < th_e, th_n + (np.maximum(th, th_min) - th_min) * (th_e - th_n) / (th_e - th_min), th)
        pr = u - np.outer(u @ os_, os_); prn = np.linalg.norm(pr, axis=1); pr = pr / np.maximum(prn, 1e-9)[:, None]
        # širina kite: ob narastišču največ SIRINA (pahljača z ostrimi vogali → raven trak); stisk azimuta okoli srednjice
        spredaj = th < math.radians(95)
        sr = pr[spredaj].mean(0); sr /= np.linalg.norm(sr); pre = np.cross(os_, sr)
        az = np.arctan2(pr @ pre, pr @ sr)
        lok0 = (tn - th_n) * R0
        s = az * R0 * np.sin(tn)
        meje = np.linspace(0, 0.02, 11); fak = np.ones(10)
        for i in range(10):
            m = (lok0 >= meje[i]) & (lok0 < meje[i + 1])
            if m.any():
                fak[i] = min(1.0, (SIRINA[kljuc] / 2 + 0.0006 * i) / max(float(np.abs(s[m]).max()), 1e-6))
        fv = np.interp(lok0, (meje[:-1] + meje[1:]) / 2, fak)
        fv = np.where(lok0 > 0.02, 1.0, fv)
        az2 = az * fv
        pr = np.cos(az2)[:, None] * sr + np.sin(az2)[:, None] * pre
        u2 = np.cos(tn)[:, None] * os_ + np.sin(tn)[:, None] * pr
        w_az = _gladko(th_e + math.radians(22) - tn, 0.0, math.radians(22))  # za ekvatorjem brez stiska
        u2 = u2 * w_az[:, None] + u * (1 - w_az)[:, None]; u2 /= np.linalg.norm(u2, axis=1)[:, None]
        rs0 = _zunanji_polmer(zrklo, G, u); rs = _zunanji_polmer(podlaga, G, u2); rs_z = _zunanji_polmer(zrklo, G, u2)
        h0 = r - np.where(np.isnan(rs0), R0, rs0)  # višina nad zrklom pred zasukom
        lok = lok0  # razdalja od narastišča po loku
        f = _gladko(lok, 0.0, KITA_DOLZINA[kljuc] + 0.004)
        hn = EPS + np.maximum(h0, 0) * (0.12 + 0.88 * f)
        vrh = (_normale(me) * u).sum(1) > 0.3
        hn = np.where(vrh & (lok < 0.02), np.maximum(hn, EPS + KITA_DEB * (0.4 + 0.6 * _gladko(lok, 0.0, 0.0015))), hn)
        osn = np.where(np.isnan(rs), np.where(np.isnan(rs_z), R0, rs_z), rs)
        w = w_az * _gladko(0.012 - h0, 0.0, 0.006)
        hn = np.where(vrh, hn, _spodaj(hn))
        rn = r + w * ((osn + hn) - r)
        rn0 = rn
        rn = np.maximum(_zgladi(rn, robovi(me), vrh & (w > 0.05), 6), rn0 - 0.0002)  # gube ob prečkanju poševne mišice
        rn = np.where(~np.isnan(rs) & vrh, np.maximum(rn, rs + EPS), rn)  # zgornja ploskev nikjer pod podlago
        me.vertices.foreach_set("co", (G + u2 * rn[:, None]).ravel()); me.update()
        k = 1 - _gladko(lok, KITA_DOLZINA[kljuc] - 0.001, KITA_DOLZINA[kljuc] + 0.002)
        _pisi_kito(me, k)
        P2 = _tocke(me); r2, _, th2 = polarno(P2)
        print(f"[oko] {row[0]}: narastišče {(th_min - th_l) * R0 * 1000:.1f} → {(float(np.percentile(th2, 0.5)) - th_l) * R0 * 1000:.1f} mm za limbusom "
              f"(cilj {NARASTISCE[kljuc] * 1000:.1f}), kita {KITA_DOLZINA[kljuc] * 1000:.1f} mm")

    # Vrstni red po plasteh: kita zgornje poševne teče POD zgornjo premo; spodnja poševna teče POD (zunaj) spodnje
    # preme in se narašča pod zunanjo premo mišico.
    osnova = [bel[0][1], roz[0][1]]
    def ena(rx):
        r_ = najdi(rx); return r_[0] if r_ else None
    so, io = ena(r"^Superior oblique muscle"), ena(r"^Inferior oblique muscle")
    sr_, ir, mr, lr = (ena(rf"^{k} rectus muscle") for k in ("Superior", "Inferior", "Medial", "Lateral"))
    if so: posevna(so, zrklo)
    if sr_: prema(sr_, _bvh(osnova + ([so[1]] if so else [])))
    if ir: prema(ir, zrklo)
    if mr: prema(mr, zrklo)
    if io: posevna(io, _bvh(osnova + ([ir[1]] if ir else [])))
    if lr: prema(lr, _bvh(osnova + ([io[1]] if io else [])))
    return []

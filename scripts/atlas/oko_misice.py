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
import bmesh
import numpy as np
from mathutils import Matrix, Vector
from mathutils.bvhtree import BVHTree

NARASTISCE = {"Medial": 0.0055, "Inferior": 0.0065, "Lateral": 0.0069, "Superior": 0.0077}  # m za limbusom
KITA_DOLZINA = {"Medial": 0.0037, "Inferior": 0.0055, "Lateral": 0.0088, "Superior": 0.0058}  # dolžina kite (m)
SIRINA = {"Medial": 0.0103, "Inferior": 0.0098, "Lateral": 0.0092, "Superior": 0.0106}  # širina narastišča (m)
EPS = 0.00015  # najmanjša višina nad beločnico (m): nad napako poenostavljene krogle, brez utripanja globine
POD = 0.0004  # spodnja ploskev kite toliko pod površino beločnice (stena je debela ≈ 1 mm)
SO_KITA_PRED = 0.008  # zgornja poševna: kita sega toliko pred škripec (proti trebuhu, m)
SKRIPEC_PODSTAVEK = 0.0014  # višina vezivnega podstavka škripca (m)
KITA_DEB = 0.00045  # debelina kite ob narastišču (m)
# krog 9 (ocena: »preme mišice se končajo z ravnim trdim rezom«): narastišče je rahlo usločeno (konveksno naprej, robova
# kite KRIV m bolj zadaj kot sredina), kita se proti narastišču stanjša skoraj v nič (pero, ki se zlije z beločnico)
KRIV = 0.0012
KITA_PERO = 0.05  # delež debeline kite tik ob narastišču
# spodnja poševna mišica: Z-Anatomy ima tanek trak; trebuh odebelimo okoli srednjice (Ø ≈ 5–6 mm sredi)
IO_TREBUH = 1.8


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
    if skripec:
        # krog 8 (ocena krog 7: »škripec z lijakastim pecljem je videti kot žebljiček za golf«): škripec Z-Anatomy je
        # vlaknasto-hrustančna zanka v obliki črke U, katere odprti konci so v naravi pritrjeni na čelnico (fovea
        # trochlearis). Kosti v modelu ni, zato konca zanke povežemo s tanko ovalno vezivno ploščico (pokostnica ob
        # jamici), ravno odrezano kot prerez živca – pritrdišče se bere, nič ne lebdi kot lijak.
        me = skripec[0][1]; Pt = _tocke(me)
        so_ = najdi(r"^Superior oblique muscle")
        if so_:  # os zanke = smer kite zgornje poševne mišice skozi škripec
            Ps = _tocke(so_[0][1]); bl = Ps[np.linalg.norm(Ps - T, axis=1) < 0.006]
            ax = np.linalg.svd(bl - bl.mean(0), full_matrices=False)[2][0] if len(bl) > 10 else os_
        else:
            ax = os_
        ax = ax / np.linalg.norm(ax)
        Q = Pt - T; Q = Q - np.outer(Q @ ax, ax)  # točke zanke v ravnini pravokotno na os
        e1 = Q[np.argmax(np.linalg.norm(Q, axis=1))]; e1 /= np.linalg.norm(e1); e2 = np.cross(ax, e1)
        kot = np.sort(np.arctan2(Q @ e2, Q @ e1)); vrz = np.diff(np.r_[kot, kot[0] + 2 * np.pi]); j = int(np.argmax(vrz))
        km = kot[j] + vrz[j] / 2; d = e1 * math.cos(km) + e2 * math.sin(km)  # sredina odprtine U
        dz = (T - G) - os_ * ((T - G) @ os_); dz /= np.linalg.norm(dz)
        if d @ dz < -0.2:  # odprtina mora gledati proč od zrkla (proti steni očnice)
            d = dz
        h_ = Pt @ d; dol_ = Pt @ ax; pr = Pt @ np.cross(ax, d)
        sir = float(pr.max() - pr.min()); vis = float(dol_.max() - dol_.min())
        # krog 10 (ocena: »škripec ni pritrjen, ploščica kot risalni žebljiček«): namesto tanke ploščice nizek vezivni
        # podstavek, ki se iz odprtine zanke (začne 0,4 mm v njej) razširi proti steni očnice in je tam ravno odrezan
        deb = SKRIPEC_PODSTAVEK
        bm = bmesh.new(); bm.from_mesh(me)
        z = Vector(d); x = Vector(np.cross(ax, d)); y = Vector(ax)
        M = Matrix((x, y, z)).transposed().to_4x4()
        M.translation = Vector(T + d * (float(h_.max() - T @ d) - 0.0004 + deb / 2) + ax * float((dol_.max() + dol_.min()) / 2 - T @ ax))
        M = M @ Matrix.Diagonal((0.5 * sir * 1.05, 0.5 * vis * 1.1, 1.0, 1.0))
        bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=28, radius1=0.8, radius2=1.12, depth=deb, matrix=M)
        bm.to_mesh(me); bm.free(); me.update()
        for p_ in me.polygons: p_.use_smooth = True
        print(f"[oko] škripec: zanka {sir * 1000:.1f} × {vis * 1000:.1f} mm, podstavek ob odprtini (kot proti steni očnice {math.degrees(math.acos(np.clip(d @ dz, -1, 1))):.0f}°)")

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
        # krog 8 (»nazobčan rob mišice«): zgornja/spodnja ploskev ni več ostra izbira po normali (oglišča roba so
        # skakala gor in dol = žagast rob), ampak zvezen prehod po kotu normale
        t_vrh = _gladko((_normale(me) * u).sum(1), -0.1, 0.6)
        hn = t_vrh * hn + (1 - t_vrh) * _spodaj(hn)
        ima = ~np.isnan(rs)
        rn = np.where(ima, rs + hn, r)
        rn = np.where(ima & vrh, np.maximum(_zgladi(rn, robovi(me), ima & vrh, 4), rs + EPS), rn)
        me.vertices.foreach_set("co", (G + u * rn[:, None]).ravel()); me.update()
        if zg and T is not None:  # kita od škripca do narastišča
            it = int(np.argmin(np.linalg.norm(P - T, axis=1)))
            # krog 10: zgornja poševna postane kita ≈ 1 cm pred škripcem (skozi zanko gre kita, ne rdeč trebuh)
            k = 1 - _gladko(gd, gd[it] + SO_KITA_PRED, gd[it] + SO_KITA_PRED + 0.004)
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
        pr = u - np.outer(u @ os_, os_); prn = np.linalg.norm(pr, axis=1); pr = pr / np.maximum(prn, 1e-9)[:, None]
        # širina kite: ob narastišču največ SIRINA (pahljača z ostrimi vogali → raven trak); stisk azimuta okoli srednjice
        spredaj = th < math.radians(95)
        sr = pr[spredaj].mean(0); sr /= np.linalg.norm(sr); pre = np.cross(os_, sr)
        az = np.arctan2(pr @ pre, pr @ sr)
        # usločeno narastišče: polarni kot narastišča raste proti robovoma kite (az normiran na sprednji del mišice)
        a_max = max(float(np.percentile(np.abs(az[spredaj]), 98)), 1e-6) if spredaj.any() else 1.0
        th_n = th_l + (NARASTISCE[kljuc] + KRIV * np.clip(az / a_max, -1.2, 1.2) ** 2) / R0
        # zasuk po poldnevniku: [th_min, th_e] → [th_n, th_e]
        tn = np.where(th < th_e, th_n + (np.maximum(th, th_min) - th_min) * (th_e - th_n) / (th_e - th_min), th)
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
        # krog 7 (»temne črte ob robovih kit«): kita se proti stranskima robovoma in narastišču stanjša v pero (prej
        # navpičen rob 0,45 mm = temna črta sence in obrisa); v trebuhu mišice (f → 1) brez stanjšanja
        s2 = az2 * R0 * np.sin(tn); hw = SIRINA[kljuc] / 2 + 0.0003 * np.clip(lok, 0, 0.02) / 0.001
        rob = 0.22 + 0.78 * (1 - _gladko(np.abs(s2) / hw, 0.5, 1.0))
        rob_f = 1 - (1 - rob) * (1 - f)
        hn = EPS + np.maximum(h0, 0) * (0.12 + 0.88 * f) * rob_f
        vrh = (_normale(me) * u).sum(1) > 0.3
        hn = np.where(vrh & (lok < 0.02), np.maximum(hn, EPS + KITA_DEB * (KITA_PERO + (1 - KITA_PERO) * _gladko(lok, 0.0, 0.003)) * rob), hn)
        osn = np.where(np.isnan(rs), np.where(np.isnan(rs_z), R0, rs_z), rs)
        w = w_az * _gladko(0.012 - h0, 0.0, 0.006)
        # krog 8 (ocena krog 7: »stopničast, naguban rob zunanje preme nad narastiščem spodnje poševne«): podlaga pod
        # zgornjo ploskvijo je gladka ovojnica (napeta odeja čez rob spodnje mišice), ne stopnica po grobem obrisu
        vrh0 = (_normale(me) * u).sum(1) > 0.3
        ovoj = osn.copy(); m_ov = vrh0 & (w > 0.05)
        for _ in range(40):
            ovoj = np.maximum(osn, _zgladi(ovoj, robovi(me), m_ov, 1))
        osn = np.where(vrh0, ovoj, osn)
        # krog 8 (»nazobčan rob mišice«): zgornja/spodnja ploskev ni več ostra izbira po normali (oglišča roba so
        # skakala gor in dol = žagast rob), ampak zvezen prehod po kotu normale
        t_vrh = _gladko((_normale(me) * u).sum(1), -0.1, 0.6)
        hn = t_vrh * hn + (1 - t_vrh) * _spodaj(hn)
        rn = r + w * ((osn + hn) - r)
        rn0 = rn
        rn = np.maximum(_zgladi(rn, robovi(me), vrh & (w > 0.05), 14), rn0 - 0.00035)  # gube ob prečkanju poševne mišice (krog 7: 6 → 14)
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
    if io:
        # trebuh spodnje poševne: odmik od srednjice (središča pasov po geodetski razdalji od narastišča) se poveča
        me = io[1]; P = _tocke(me); rr_ = np.linalg.norm(P - G, axis=1)
        go = _geodezija(P, robovi(me), np.nonzero(rr_ > rr_.max() - 0.001)[0]); go = np.where(np.isinf(go), 0, go); gd = go.max() - go
        pas = np.floor(gd / 0.001).astype(int); C_ = np.zeros((pas.max() + 1, 3)); n_ = np.bincount(pas, minlength=pas.max() + 1)
        for c in range(3):
            C_[:, c] = np.bincount(pas, weights=P[:, c], minlength=pas.max() + 1) / np.maximum(n_, 1)
        # Z-Anatomy ima trak nagubano površino (odebelitev bi gube povečala): najprej Laplaceovo glajenje položajev
        e_ = robovi(me); st_ = np.bincount(e_.ravel(), minlength=len(P)).astype(float)
        for _ in range(8):
            acc = np.stack([np.bincount(e_[:, 0], weights=P[e_[:, 1], c], minlength=len(P)) + np.bincount(e_[:, 1], weights=P[e_[:, 0], c], minlength=len(P)) for c in range(3)], 1)
            P = np.where((st_ > 0)[:, None], 0.5 * P + 0.5 * acc / np.maximum(st_, 1)[:, None], P)
        for c in range(3):
            C_[:, c] = np.bincount(pas, weights=P[:, c], minlength=pas.max() + 1) / np.maximum(n_, 1)
        k_ = 1 + (IO_TREBUH - 1) * _gladko(gd, 0.004, 0.012) * (1 - _gladko(gd, gd.max() - 0.006, gd.max()))
        P2 = C_[pas] + (P - C_[pas]) * k_[:, None]
        me.vertices.foreach_set("co", P2.ravel()); me.update()
        print(f"[oko] spodnja poševna: trebuh odebeljen ×{IO_TREBUH}")
        posevna(io, _bvh(osnova + ([ir[1]] if ir else [])))
    if lr: prema(lr, _bvh(osnova + ([io[1]] if io else [])))
    return []


# Krog 10 (ocena krog 9: »ploščate trde bele plošče kit štrlijo iz zrkla«): tanka kita (dve ploskvi 0,2–0,5 mm narazen)
# se pri poenostavitvi mreže (DECIMATE) ponekod obrne navznoter: zgornja ploskev (normala navzven) pristane pod
# spodnjo, beločnica jo prekrije in pokaže svojo pečeno senco mišice (siv pravokotnik ob narastišču zunanje preme).
# Zato se kite po poenostavitvi znova položijo na podlago (beločnica in mišice pod njo, isti vrstni red plasti kot
# zgoraj), na končni mreži, ki gre v GLB: ploskev, katere navitje gleda navzven, je zgornja (KITA_ODMIK nad podlago),
# navznoter spodnja (SPOD_ODMIK pod podlago), oglišča z obema vrstama ploskev so rob kite (ROB_ODMIK: pero, ki se
# zlije z beločnico). Velja samo blizu podlage (višina < ZOVOJ, mehko od ZOVOJ0) in na kitah (atribut KITA, če je).
# Navitje se ne spreminja: po premiku je kita spet pravilna plošča (preverjeno: brez obrnjenih zunanjih ploskev).
KITA_ODMIK = 0.00025
ROB_ODMIK = 0.00003
SPOD_ODMIK = 0.0001
ZOVOJ, ZOVOJ0 = 0.0020, 0.0012
PAHLJACA = 0.12
PLASTI = [("Superior oblique muscle", []), ("Superior rectus muscle", ["Superior oblique muscle"]),
          ("Inferior rectus muscle", []), ("Medial rectus muscle", []),
          ("Inferior oblique muscle", ["Inferior rectus muscle"]), ("Lateral rectus muscle", ["Inferior oblique muscle"])]


def _stran_oglisc(P, T, G):
    """Delež ploskev ob oglišču, katerih navitje gleda stran od središča G (1 zgornja, 0 spodnja ploskev)."""
    a, b, c = P[T[:, 0]], P[T[:, 1]], P[T[:, 2]]
    n = np.cross(b - a, c - a); s = (a + b + c) / 3 - G
    ven = ((n * s).sum(1) > 0).astype(float)
    gor = np.zeros(len(P)); vse = np.zeros(len(P))
    for k in range(3):
        gor += np.bincount(T[:, k], weights=ven, minlength=len(P)); vse += np.bincount(T[:, k], minlength=len(P))
    return np.where(vse > 0, gor / np.maximum(vse, 1), 0.5)


def kite_na_zrklo(objekti, cfg):
    po = lambda ime: next((o for o in objekti if o.name.startswith(ime)), None)
    bel = next((o for o in objekti if re.match(r"(?i)sclera", o.name)), None)
    roz = next((o for o in objekti if re.match(r"(?i)cornea", o.name)), None)
    if not bel:
        return
    S = _tocke(bel.data); G = (S.min(0) + S.max(0)) / 2
    for ime, pod in PLASTI:
        o = po(ime)
        if o is None:
            continue
        me = o.data; me.calc_loop_triangles()
        T = np.empty(len(me.loop_triangles) * 3, dtype=np.int32); me.loop_triangles.foreach_get("vertices", T); T = T.reshape(-1, 3)
        P = _tocke(me); d = P - G; r = np.linalg.norm(d, axis=1); u = d / r[:, None]
        podlaga = _bvh([bel.data] + ([roz.data] if roz else []) + [po(p).data for p in pod if po(p) is not None])
        rs = _zunanji_polmer(podlaga, G, u)
        # pahljača: v pasu ob zrklu se kita proti narastišču rahlo razširi (za PAHLJACA na samem narastišču)
        wz = _gladko(ZOVOJ - (r - np.where(np.isnan(rs), np.inf, rs)), 0.0, ZOVOJ - ZOVOJ0); z0 = wz > 0.5
        if z0.sum() > 20 and (~z0).sum() > 20:
            c = u[z0].mean(0); c /= np.linalg.norm(c)
            Q = u - np.outer(u @ c, c)
            a = np.linalg.svd(Q[z0] - Q[z0].mean(0), full_matrices=False)[2][0]
            if (Q[~z0] @ a).mean() > (Q[z0] @ a).mean():  # a kaže od trebuha proti narastišču
                a = -a
            b = np.cross(c, a); sa = Q @ a; lb = Q @ b; lb0 = lb[z0].mean()
            t = _gladko(sa, np.percentile(sa[z0], 10), sa[z0].max()) * wz
            u = u + np.outer((lb - lb0) * PAHLJACA * t, b); u /= np.linalg.norm(u, axis=1)[:, None]
            rs = _zunanji_polmer(podlaga, G, u)
        ok = ~np.isnan(rs)
        h = np.where(ok, r - np.where(ok, rs, 0), np.inf)
        gor = _stran_oglisc(P, T, G)
        odmik = np.where(gor > 0.99, KITA_ODMIK, np.where(gor < 0.01, -SPOD_ODMIK, ROB_ODMIK))
        # pero: zgornja oglišča ob robu kite nižje (dva koraka glajenja odmika po robovih samo med zgornjimi in robnimi)
        e = np.empty(len(me.edges) * 2, dtype=np.int32); me.edges.foreach_get("vertices", e); e = e.reshape(-1, 2)
        zg = gor > 0.01; e = e[zg[e[:, 0]] & zg[e[:, 1]]]
        st = np.bincount(e.ravel(), minlength=len(P)).astype(float)
        for _ in range(2):
            acc = np.bincount(e[:, 0], weights=odmik[e[:, 1]], minlength=len(P)) + np.bincount(e[:, 1], weights=odmik[e[:, 0]], minlength=len(P))
            odmik = np.where(zg & (st > 0), 0.5 * odmik + 0.5 * acc / np.maximum(st, 1), odmik)
        w = _gladko(ZOVOJ - h, 0.0, ZOVOJ - ZOVOJ0) * ok
        rn = r + w * (np.where(ok, rs, r) + odmik - r)
        me.vertices.foreach_set("co", (G + u * rn[:, None]).ravel()); me.update()
        print(f"[oko] {o.name}: kita na podlago, {int((w > 0.5).sum())} oglišč (zgornjih {int(((w > 0.5) & (gor > 0.99)).sum())})")

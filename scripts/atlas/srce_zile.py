# Žile srca kot prava geometrija (lastno delo Evklida, CC BY-SA 4.0 kot izpeljani model iz Z-Anatomy). Z-Anatomy ima
# velike žile kot tanke odprte lupine (12 oglišč na obroč, obrezane na škatlo okoli srca: luknje, raztrgani robovi,
# skozi se vidi), pljučne vene kot kratke štrclje, levi preddvor z luknjo v zadnji steni in venčne žile kot tanke cevi
# (r ≈ 0,5 mm), napol v steni. Tu iz središčnic krivulj Z-Anatomy (Bézier, polmer = radius × bevel_depth) zgradimo:
#  - velike žile: ZAPRTE cevi z debelino stene (zunanja in notranja ploskev, prerezan konec = obroč stene in svetlina);
#    aorta je ena cev (ascendentna, lok, descendentna) z vejami loka (brahiocefalično deblo, leva skupna karotidna,
#    leva podključnična), pljučno deblo se nadaljuje v levo pljučno arterijo, desna izhaja iz razcepa; votli veni
#    vstopata v desni preddvor, štiri pljučne vene (Ø ≈ 13 mm) v zadnjo steno levega preddvora;
#  - venčne žile: polne okrogle cevi z zaobljenimi konci, anatomske debeline (deblo leve ≈ 4 mm, veje se tanjšajo),
#    središčnica nad površino srca (≈ tretjina premera v maščobi, ostalo štrli), spremljajoče vene ob arterijah;
#  - luknjo v zadnji steni levega preddvora zapremo z izbočeno zaplato (stena ≈ 3 mm iz notranje plasti).
# Vsaka cev dobi lasten valjasti UV (»uvLastni«: brez šiva Smart UV čez žilo) in atribut OSI (R = dolžina vzdolž žile v m,
# G/B = cos/sin kota okoli osi, A = polmer): peka.py iz njega naredi vzdolžne gube adventicije in vasa vasorum.
# Kliče izvozi-organe.py (cfg »dodaj«: [..., "srce_zile"], krivulje v cfg["_krivulje"]); koordinate Blenderjeve (m, Z gor).
import bmesh, math, re
import numpy as np
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from mathutils.geometry import interpolate_bezier


# ---------- krivulje Z-Anatomy ----------
def krivulje_objekta(o_eval, mw, ločljivost=16):
    """Spline krivulje (evaluirani objekt) → [(točke v svetu, polmeri v m)] po splinih."""
    d = o_eval.data
    bev = d.bevel_depth or 0.0005
    sc = mw.to_scale()[0]
    out = []
    for sp in d.splines:
        if sp.type == "BEZIER":
            bp = sp.bezier_points
            if len(bp) < 2:
                continue
            P, R = [], []
            pari = list(zip(bp, bp[1:])) + ([(bp[-1], bp[0])] if sp.use_cyclic_u else [])
            for a, b in pari:
                seg = interpolate_bezier(a.co, a.handle_right, b.handle_left, b.co, ločljivost)
                for i, p in enumerate(seg[:-1]):
                    P.append(mw @ p); R.append((a.radius + (b.radius - a.radius) * i / (ločljivost - 1)) * bev * sc)
            P.append(mw @ pari[-1][1].co); R.append(pari[-1][1].radius * bev * sc)
        else:
            pts = sp.points
            if len(pts) < 2:
                continue
            P = [mw @ p.co.xyz for p in pts]; R = [p.radius * bev * sc for p in pts]
        out.append((P, R))
    return out


# ---------- pomožno: središčnice ----------
def _dolzine(P):
    s = [0.0]
    for a, b in zip(P, P[1:]):
        s.append(s[-1] + (b - a).length)
    return s


def prevzorci(P, R, korak):
    """Enakomerni koraki po dolžini (korak = funkcija polmera ali število), gladko (Catmull-Rom)."""
    if len(P) < 2:
        return P, R
    s = _dolzine(P); L = s[-1]
    if L < 1e-6:
        return P[:1], R[:1]

    def tocka(t):
        i = max(0, min(len(s) - 2, np.searchsorted(s, t) - 1))
        u = (t - s[i]) / max(s[i + 1] - s[i], 1e-9)
        p0, p1, p2, p3 = P[max(i - 1, 0)], P[i], P[i + 1], P[min(i + 2, len(P) - 1)]
        u2, u3 = u * u, u * u * u
        p = 0.5 * ((2 * p1) + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u2 + (-p0 + 3 * p1 - 3 * p2 + p3) * u3)
        return p, R[i] + (R[i + 1] - R[i]) * u
    oP, oR, t = [], [], 0.0
    while t < L:
        p, r = tocka(t); oP.append(p); oR.append(r)
        t += korak(r) if callable(korak) else korak
    p, r = tocka(L); oP.append(p); oR.append(r)
    return oP, oR


def obrezi_dolzino(P, R, do):
    """Središčnica do dolžine `do` (m) od začetka."""
    s = _dolzine(P)
    if s[-1] <= do:
        return P, R
    i = int(np.searchsorted(s, do))
    u = (do - s[i - 1]) / max(s[i] - s[i - 1], 1e-9)
    return P[:i] + [P[i - 1].lerp(P[i], u)], R[:i] + [R[i - 1] + (R[i] - R[i - 1]) * u]


def zdruzi(kosi, zacetek=None):
    """Kose središčnic [(P, R)] zloži v eno pot (vsak naslednji obrnjen tako, da se nadaljuje); zacetek: točka, h
    kateri je obrnjen prvi kos."""
    P, R = list(kosi[0][0]), list(kosi[0][1])
    if zacetek is not None and (P[-1] - zacetek).length < (P[0] - zacetek).length:
        P.reverse(); R.reverse()
    for p, r in kosi[1:]:
        p, r = list(p), list(r)
        if (p[-1] - P[-1]).length < (p[0] - P[-1]).length:
            p.reverse(); r.reverse()
        if (p[0] - P[-1]).length < 1e-4:
            p, r = p[1:], r[1:]
        P += p; R += r
    return P, R


def bezier_pot(a, ta, b, tb, k=24):
    """Kubična pot a → b s tangentama ta (iz a) in tb (v b)."""
    L = (b - a).length
    c1, c2 = a + ta.normalized() * L / 3, b - tb.normalized() * L / 3
    return [a * (1 - t) ** 3 + c1 * 3 * t * (1 - t) ** 2 + c2 * 3 * t * t * (1 - t) + b * t ** 3 for t in (i / (k - 1) for i in range(k))]


# ---------- cevi ----------
class _Osi:
    """Zbira vrednosti OSI (s, cos, sin, r) in UV po ogliščih/zankah med gradnjo v bmesh."""
    def __init__(self, bm):
        self.bm = bm; self.osi = {}; self.uv = {}

    def v(self, p, s, f, r):
        v = self.bm.verts.new(p); self.osi[v] = (s, math.cos(f), math.sin(f), r)
        return v

    def f(self, verts, uvs):
        try:
            fa = self.bm.faces.new(verts)
        except ValueError:
            return None
        self.uv[fa] = uvs
        return fa


def _okvirji(P):
    n = len(P)
    T = [(P[min(i + 1, n - 1)] - P[max(i - 1, 0)]).normalized() for i in range(n)]
    ref = T[0].orthogonal().normalized(); out = []
    for t in T:
        ref = (ref - t * ref.dot(t)).normalized()
        out.append((t, ref, t.cross(ref)))
    return out


def cev_stena(z, P, R, debelina, seg, zacetek_odprt=False, konec_odprt=False, s0=0.0):
    """Zaprta cev s steno: zunanja ploskev (polmer R), notranja (R − debelina, normale v svetlino), na koncih obroč
    stene (prerezan konec: stena kot obroč in svetlina). *_odprt=True: konca ni (cev se tam zlije z drugo mrežo)."""
    okv = _okvirji(P); s = [s0 + x for x in _dolzine(P)]
    obseg = 2 * math.pi * max(R)
    zun, not_ = [], []
    for (t, a, b), p, r, si in zip(okv, P, R, s):
        ri = max(r - debelina, r * 0.55)
        zun.append([z.v(p + (a * math.cos(2 * math.pi * k / seg) + b * math.sin(2 * math.pi * k / seg)) * r, si, 2 * math.pi * k / seg, r) for k in range(seg)])
        not_.append([z.v(p + (a * math.cos(2 * math.pi * k / seg) + b * math.sin(2 * math.pi * k / seg)) * ri, si, 2 * math.pi * k / seg, ri) for k in range(seg)])
    for obroci, obrni, du in ((zun, False, 0.0), (not_, True, 0.0)):
        for i in range(len(obroci) - 1):
            for k in range(seg):
                q = [obroci[i][k], obroci[i][(k + 1) % seg], obroci[i + 1][(k + 1) % seg], obroci[i + 1][k]]
                uv = [(k / seg, s[i] / obseg), ((k + 1) / seg, s[i] / obseg), ((k + 1) / seg, s[i + 1] / obseg), (k / seg, s[i + 1] / obseg)]
                if obrni:
                    q.reverse(); uv.reverse()
                z.f(q, [(u + 1.1 * obrni, v) for u, v in uv])
    for i, odprt, smer in ((0, zacetek_odprt, -1), (len(P) - 1, konec_odprt, 1)):
        if odprt:
            continue
        for k in range(seg):
            q = [zun[i][k], zun[i][(k + 1) % seg], not_[i][(k + 1) % seg], not_[i][k]]
            if smer < 0:
                q.reverse()
            uv = [(2.3 + 0.5 * (v.co - P[i]).dot(okv[i][1]) / R[i], 0.5 * (v.co - P[i]).dot(okv[i][2]) / R[i]) for v in q]
            z.f(q, uv)
    return s[-1]


def cev_polna(z, P, R, seg, s0=0.0, zaobli=True):
    """Polna cev (venčne žile) z zaobljenima koncema (polkrogla iz 3 obročev)."""
    okv = _okvirji(P); s = [s0 + x for x in _dolzine(P)]
    obseg = 2 * math.pi * max(R)
    P, R, s = list(P), list(R), list(s)
    # zaobljena konca: obroči z manjšim polmerom za konec središčnice
    pred, po = [], []
    if zaobli:
        for j, f in enumerate((0.85, 0.55)):
            t0 = okv[0][0]; t1 = okv[-1][0]
            pred.insert(0, (P[0] - t0 * R[0] * math.sin(math.acos(f)), R[0] * f, s[0] - R[0] * (j + 1) * 0.5, okv[0]))
            po.append((P[-1] + t1 * R[-1] * math.sin(math.acos(f)), R[-1] * f, s[-1] + R[-1] * (j + 1) * 0.5, okv[-1]))
    vrste = pred + [(p, r, si, o) for p, r, si, o in zip(P, R, s, okv)] + po
    obroci = []
    for p, r, si, (t, a, b) in vrste:
        obroci.append([z.v(p + (a * math.cos(2 * math.pi * k / seg) + b * math.sin(2 * math.pi * k / seg)) * r, si, 2 * math.pi * k / seg, r) for k in range(seg)])
    for i in range(len(obroci) - 1):
        for k in range(seg):
            z.f([obroci[i][k], obroci[i][(k + 1) % seg], obroci[i + 1][(k + 1) % seg], obroci[i + 1][k]],
                [(k / seg, vrste[i][2] / obseg), ((k + 1) / seg, vrste[i][2] / obseg), ((k + 1) / seg, vrste[i + 1][2] / obseg), (k / seg, vrste[i + 1][2] / obseg)])
    for i, smer in ((0, -1), (len(obroci) - 1, 1)):
        p, r, si, (t, a, b) = vrste[i]
        c = z.v(p + t * smer * r * 0.25, si + smer * r * 0.25, 0.0, r * 0.3)
        for k in range(seg):
            q = [obroci[i][k], obroci[i][(k + 1) % seg], c]
            if smer < 0:
                q.reverse()
            z.f(q, [(1.2 + 0.5 * (v.co - p).dot(a) / max(r, 1e-6), 0.5 * (v.co - p).dot(b) / max(r, 1e-6)) for v in q])


def v_mrezo(z, ime):
    """bmesh → mesh z UV (»UVMap«, oznaka uvLastni) in barvnim atributom OSI (na ogliščih)."""
    import bpy
    bm = z.bm
    uvl = bm.loops.layers.uv.new("UVMap")
    osl = bm.verts.layers.float_color.new("OSI")
    for fa, uvs in z.uv.items():
        if not fa.is_valid:
            continue
        for l, uv in zip(fa.loops, uvs):
            l[uvl].uv = uv
    for v, val in z.osi.items():
        if v.is_valid:
            v[osl] = val
    me = bpy.data.meshes.new(ime); bm.to_mesh(me); bm.free()
    me["uvLastni"] = 1
    for p in me.polygons:
        p.use_smooth = True
    return me


# ---------- zaplata zadnje stene levega preddvora ----------
def zapri_luknjo(me, najmanj_tock=40, stena=0.003, obrocev=12, korakov=40):
    """Največjo zanko odprtih robov (luknja v zadnji steni levega preddvora) zapre izbočena zaplata: koncentrični obroči
    od roba do središča (zvarjeni z robom), glajenje z nepremičnim robom, nato premik navzven do notranje plasti +
    `stena` (stena preddvora ≈ 3 mm), še enkrat glajenje. Vrne število novih oglišč."""
    from srce_geometrija import robne_zanke
    zanke = [z for z in robne_zanke(me) if len(z[3]) >= najmanj_tock]
    if not zanke:
        return 0
    c, _, _, rob = zanke[0]
    bm = bmesh.new(); bm.from_mesh(me); bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-6)
    tree = BVHTree.FromBMesh(bm)
    c_vse = sum((v.co for v in bm.verts), Vector()) / len(bm.verts)
    obroci = [[bm.verts.new(c + (p - c) * (1 - j / obrocev)) for p in rob] for j in range(obrocev)]
    sredina = bm.verts.new(c)
    n = len(rob)
    for a, b in zip(obroci, obroci[1:]):
        for i in range(n):
            bm.faces.new((a[i], a[(i + 1) % n], b[(i + 1) % n], b[i]))
    for i in range(n):
        bm.faces.new((obroci[-1][i], obroci[-1][(i + 1) % n], sredina))
    notranje = [v for o in obroci[1:] for v in o] + [sredina]
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-7)  # prvi obroč se zvari z robom luknje
    notranje = [v for v in notranje if v.is_valid]

    def gladi(k, f):
        for _ in range(k):
            nov = {v: sum((e.other_vert(v).co for e in v.link_edges), Vector()) / max(len(v.link_edges), 1) for v in notranje}
            for v, p in nov.items():
                v.co = v.co.lerp(p, f)
    gladi(korakov, 0.6)
    for v in notranje:  # navzven do notranje plasti preddvora + stena
        d = (v.co - c_vse).normalized()
        h = tree.ray_cast(c_vse, d, 0.2)
        if h[0] is not None and (h[0] - c_vse).length + stena > (v.co - c_vse).length:
            v.co = h[0] + d * stena
    gladi(12, 0.4)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me); bm.free()
    # recalc na odprti mreži (ustje mitralne zaklopke, vene) lahko obrne vse normale navznoter (preddvor bi bil »votlina«:
    # odprtost 0, temna senca, sijaj endokarda); normale_navzven (izvozi-organe.py) zato pri tej mreži usmeritev izbere
    # z glasom po ploščini (zunanja plast gleda stran od središča), ne s predznakom prostornine.
    me["navzvenGlas"] = True
    return len(notranje)


# ---------- glavno ----------
VELIKE = r"^(Ascending aorta|Aortic arch|Thoracic aorta|Brachiocephalic trunk|Left common carotid artery|Left subclavian artery|Pulmonary trunk|" \
         r"Bifurcation of pulmonary trunk|(Left|Right) pulmonary artery|Superior vena cava|Inferior vena cava \(thoracic part\)|" \
         r"(Left|Right) (superior|inferior) pulmonary vein)$"
VENCNE = r"^(Left coronary artery|Right coronary artery|Anterior interventricular artery|Circumflex artery of heart|" \
         r"Right inferolateral branch of right coronary artery|Coronary sinus|Great cardiac vein|Middle cardiac vein|Inferior vein of left ventricle.*)$"


def _bvh_vrstic(vrstice):
    V, F, off = [], [], 0
    for r in vrstice:
        me = r[1]
        V += [v.co.copy() for v in me.vertices]; F += [[off + i for i in p.vertices] for p in me.polygons]; off += len(me.vertices)
    return BVHTree.FromPolygons(V, F, epsilon=0.0) if V else None


def _zanka_blizu(me, tocka):
    from srce_geometrija import robne_zanke
    z = robne_zanke(me)
    return min(z, key=lambda x: (x[0] - tocka).length) if z else None


def srce_zile(osnovni, cfg, tmp):
    K = cfg.get("_krivulje", {})
    if not K:
        print("[organi] srce_zile: ni krivulj (Z-Anatomy), preskočeno"); return []
    po = {r[0]: r for r in osnovni}
    mreza = lambda ime: po[ime][1] if ime in po else None
    nove = []
    srce = [r for r in osnovni if re.search(r"^(Left|Right) (atrium|ventricle)$", r[0])]
    c_srca = sum((Vector(v.co) for r in srce for v in r[1].vertices), Vector()) / max(sum(len(r[1].vertices) for r in srce), 1)
    t_srce = _bvh_vrstic(srce)

    def vrstica(ime, z, tkivo, del_, starsi):
        me = v_mrezo(z, ime)
        nove.append([ime, me, tkivo, del_, f"{ime} (lastno) / {starsi}"])
        return me

    def spl(ime, i=None):
        s = K.get(ime, [])
        return s if i is None else (s[i] if i < len(s) else None)

    def najdaljsi(ime):
        s = spl(ime)
        return max(s, key=lambda x: _dolzine(x[0])[-1]) if s else None

    def v_steno(P, R, mreze, globina):
        """Pot od prostega konca proti srcu: konča se `globina` za prvim zadetkom stene (mreže)."""
        t = _bvh_vrstic(mreze)
        if t is None:
            return P, R
        s = _dolzine(P)
        for i in range(len(P) - 1):
            d = P[i + 1] - P[i]
            h = t.ray_cast(P[i], d.normalized(), d.length)
            if h[0] is not None:
                do = s[i] + (h[0] - P[i]).length + globina
                return obrezi_dolzino(P, R, do)
        return P, R

    # ---- aorta: koren (zaklopka) → ascendentna → lok → descendentna (ena cev), veje loka
    lističi = [r[1] for r in osnovni if re.search(r"^(Right|Left) coronary leaflet$|^Non-coronary leaflet$|^Semilunar cusps of aortic", r[0])]
    asc, lok, des = najdaljsi("Ascending aorta"), najdaljsi("Aortic arch"), najdaljsi("Thoracic aorta")
    if asc and lok and des:
        koren = sum((Vector(v.co) for m in lističi for v in m.vertices), Vector()) / max(sum(len(m.vertices) for m in lističi), 1) if lističi else asc[0][0]
        P, R = zdruzi([asc, lok, des], zacetek=koren)
        zlv = _zanka_blizu(mreza("Left ventricle"), koren)
        # začetek: obroč aortne odprtine levega prekata (koren aorte nad zaklopko), nato gladko v krivuljo
        if zlv and (zlv[0] - koren).length < 0.02:
            n = zlv[2] if zlv[2].dot(P[min(8, len(P) - 1)] - zlv[0]) > 0 else -zlv[2]
            k = next(i for i in range(len(P)) if (P[i] - zlv[0]).dot(n) > 0.012)
            uvod = bezier_pot(zlv[0] - n * 0.002, n, P[k], (P[min(k + 2, len(P) - 1)] - P[k]), 10)
            P = uvod[:-1] + P[k:]; R = [max(zlv[1] + 0.0016, R[k])] * (len(uvod) - 1) + R[k:]
        # spodaj: descendentna aorta do višine spodnje votle vene (pod srcem je ne potrebujemo)
        zmin = min(v.co.z for r in srce for v in r[1].vertices)
        k = next((i for i in range(len(P) // 2, len(P)) if P[i].z < zmin + 0.01), len(P) - 1)
        P, R = P[:k + 1], R[:k + 1]
        R = [max(r, 0.0105) for r in R]
        P, R = prevzorci(P, R, lambda r: max(0.0026, r * 0.3))
        z = _Osi(bmesh.new())
        cev_stena(z, P, R, 0.0021, 32, zacetek_odprt=True)
        vrstica("Aorta", z, "aorta", "aorta", "Aorta.g")
        T_ao = _bvh_vrstic([nove[-1]])
        # veje loka: začnejo v steni aorte (izhod iz svetline), dolge ≈ 3 cm
        for ime, dl, rmin in (("Brachiocephalic trunk", 0.034, 0.0062), ("Left common carotid artery", 0.03, 0.0042), ("Left subclavian artery", 0.03, 0.0048)):
            s = najdaljsi(ime)
            if not s:
                continue
            Pv, Rv = s
            # konec bližje loku je začetek
            if min((Pv[-1] - p).length for p in P) < min((Pv[0] - p).length for p in P):
                Pv, Rv = Pv[::-1], Rv[::-1]
            # prvi zadetek iz notranjosti: točka, kjer pot zapusti zunanjo ploskev aorte
            i0 = next((i for i in range(len(Pv)) if min((Pv[i] - p).length - r for p, r in zip(P, R)) > 0.0005), 0)
            j = min(range(len(P)), key=lambda q: (P[q] - Pv[i0]).length)
            os_ = (Pv[min(i0 + 3, len(Pv) - 1)] - Pv[i0]).normalized()
            rv = max(rmin, Rv[i0])
            d = math.sqrt(max((R[j] - 0.0011) ** 2 - rv ** 2, (R[j] * 0.55) ** 2))
            radial = (Pv[i0] - P[j]); radial = radial - (P[min(j + 1, len(P) - 1)] - P[max(j - 1, 0)]).normalized() * radial.dot((P[min(j + 1, len(P) - 1)] - P[max(j - 1, 0)]).normalized())
            zac = P[j] + radial.normalized() * d
            Pv2 = bezier_pot(zac, radial.normalized(), Pv[min(i0 + 4, len(Pv) - 1)], os_, 10)[:-1] + Pv[min(i0 + 4, len(Pv) - 1):]
            Rv2 = [rv] * 9 + [max(rmin * 0.9, r) for r in Rv[min(i0 + 4, len(Pv) - 1):]]
            Pv2, Rv2 = obrezi_dolzino(Pv2, Rv2, dl)
            Pv2, Rv2 = prevzorci(Pv2, Rv2, lambda r: max(0.0015, r * 0.3))
            z = _Osi(bmesh.new())
            cev_stena(z, Pv2, Rv2, 0.0012, 20)
            vrstica(ime, z, "aorta", "aorta", "Aortic arch / Aorta.g")
        del T_ao
    # ---- pljučno deblo → leva pljučna arterija (ena cev), desna iz razcepa
    pt = mreza("Pulmonary trunk")
    lpa, rpa = najdaljsi("Left pulmonary artery"), najdaljsi("Right pulmonary artery")
    if pt is not None and lpa and rpa:
        from srce_geometrija import robne_zanke
        zz = sorted(robne_zanke(pt), key=lambda x: x[0].z)[:2]
        if len(zz) == 2:
            (c0, r0, n0, _), (c1, r1, n1, _) = zz
            razcep = lpa[0][0] if (lpa[0][0] - c1).length < (lpa[0][-1] - c1).length else lpa[0][-1]
            n0 = n0 if n0.dot(c1 - c0) > 0 else -n0
            Pl, Rl = zdruzi([lpa], zacetek=razcep)
            k = next((i for i in range(len(Pl)) if (Pl[i] - razcep).length > 0.008), 1)
            debl = bezier_pot(c0 - n0 * 0.002, n0, Pl[k], Pl[min(k + 2, len(Pl) - 1)] - Pl[k], 22)
            P = debl[:-1] + Pl[k:]
            R = [max(r0, r1) + 0.0012] * (len(debl) - 1) + [max(r, 0.0085) for r in Rl[k:]]
            for i in range(len(debl) - 1):  # gladko ožanje debla proti levi arteriji
                R[i] = (max(r0, r1) + 0.0012) * (1 - i / len(debl)) + R[len(debl) - 1] * (i / len(debl))
            P, R = obrezi_dolzino(P, R, _dolzine(debl)[-1] + 0.032)
            P, R = prevzorci(P, R, lambda r: max(0.002, r * 0.24))
            z = _Osi(bmesh.new())
            cev_stena(z, P, R, 0.0016, 28, zacetek_odprt=True)
            vrstica("Pulmonary trunk", z, "pljucna", "pljucno-deblo", "Pulmonary arteries.g")
            # desna: iz stene debla ob razcepu
            Pr, Rr = zdruzi([rpa], zacetek=razcep)
            j = min(range(len(P)), key=lambda q: (P[q] - razcep).length)
            os_ = (Pr[min(6, len(Pr) - 1)] - Pr[0]).normalized()
            t = (P[min(j + 1, len(P) - 1)] - P[max(j - 1, 0)]).normalized()
            radial = (os_ - t * os_.dot(t)).normalized()
            rv = max(0.0085, Rr[0] * 0.85)
            d = math.sqrt(max((R[j] - 0.0010) ** 2 - rv ** 2, (R[j] * 0.45) ** 2))
            k = next((i for i in range(len(Pr)) if (Pr[i] - P[j]).length > R[j] + 0.006), 2)
            Pv = bezier_pot(P[j] + radial * d, radial, Pr[k], Pr[min(k + 2, len(Pr) - 1)] - Pr[k], 10)[:-1] + Pr[k:]
            Rv = [rv] * 9 + [max(0.0075, r) for r in Rr[k:]]
            Pv, Rv = obrezi_dolzino(Pv, Rv, 0.045)
            Pv, Rv = prevzorci(Pv, Rv, lambda r: max(0.002, r * 0.25))
            z = _Osi(bmesh.new())
            cev_stena(z, Pv, Rv, 0.0014, 24)
            vrstica("Right pulmonary artery", z, "pljucna", "pljucno-deblo", "Pulmonary arteries.g")
    # ---- votli veni: v desni preddvor
    ra = [r for r in osnovni if r[0] == "Right atrium"]
    for ime, dl in (("Superior vena cava", 0.05), ("Inferior vena cava (thoracic part)", 0.03)):
        s = najdaljsi(ime)
        if not s or not ra:
            continue
        P, R = s
        # prosti konec = dlje od srca
        if (P[0] - c_srca).length < (P[-1] - c_srca).length:
            P, R = P[::-1], R[::-1]
        # podaljšaj proti središču preddvora, da gotovo zadene steno
        c_ra = sum((Vector(v.co) for v in ra[0][1].vertices), Vector()) / len(ra[0][1].vertices)
        P = P + [P[-1].lerp(c_ra, 0.5)]; R = R + [R[-1]]
        P, R = v_steno(P, R, ra, 0.0025)
        L = _dolzine(P)[-1]
        if L > dl:  # prosti konec skrajšamo (od srca navzven največ dl)
            P, R = P[::-1], R[::-1]; P, R = obrezi_dolzino(P, R, dl); P, R = P[::-1], R[::-1]
        R = [max(r, 0.0095) for r in R]
        P, R = prevzorci(P, R, lambda r: max(0.002, r * 0.25))
        z = _Osi(bmesh.new())
        cev_stena(z, P, R, 0.0012, 24)
        vrstica(ime, z, "vena", "votli-veni", "Systemic veins.g")
    # ---- levi preddvor: zapri luknjo v zadnji steni, nato štiri pljučne vene
    la = [r for r in osnovni if r[0] == "Left atrium"]
    if la:
        n = zapri_luknjo(la[0][1])
        print(f"[organi] srce: zadnja stena levega preddvora zaprta ({n} novih oglišč)")
        c_la = sum((Vector(v.co) for v in la[0][1].vertices), Vector()) / len(la[0][1].vertices)
        for ime in ("Left superior pulmonary vein", "Left inferior pulmonary vein", "Right superior pulmonary vein", "Right inferior pulmonary vein"):
            st = [r[1] for r in osnovni if r[0] == ime]
            s = najdaljsi(ime)
            if not st and not s:
                continue
            # smer vene: od preddvora navzven (štrclj Z-Anatomy ali krivulja), bočno in nazaj
            if s:
                Ps = s[0]
                a, b = (Ps[0], Ps[-1]) if (Ps[0] - c_la).length < (Ps[-1] - c_la).length else (Ps[-1], Ps[0])
            else:
                Pm = [Vector(v.co) for v in st[0].vertices]
                a = min(Pm, key=lambda p: (p - c_la).length); b = max(Pm, key=lambda p: (p - c_la).length)
            stran = 1 if ime.startswith("Left") else -1
            smer = (b - a).normalized()
            smer = (smer + Vector((stran * 0.9, 0.55, 0.0))).normalized()
            zun = a + smer * 0.03
            # pot: od zunanjega konca proti preddvoru (cilj = točka a), zavije v steno
            P = bezier_pot(zun + smer * 0.004, -smer, a.lerp(c_la, 0.35), (c_la - a), 16)
            R = [0.0066] * len(P)
            P, R = v_steno(P, R, la, 0.002)
            L = _dolzine(P)[-1]
            if L < 0.03:  # žarek je zadel steno zgodaj (štrclj): prosti konec podaljšamo navzven na ≥ 3 cm
                d0 = (P[0] - P[1]).normalized()
                P = [P[0] + d0 * (0.03 - L) * (1 - i / 6) for i in range(6)] + P; R = [R[0]] * 6 + R
            P, R = P[::-1], R[::-1]
            P, R = prevzorci(P, R, lambda r: 0.0026)
            z = _Osi(bmesh.new())
            cev_stena(z, P, R, 0.0011, 20)
            vrstica(ime, z, "pljucna-vena", "pljucne-vene", "Pulmonary veins.g")
    # ---- venčne žile: polne cevi nad površino (tretjina premera v maščobi)
    for ime in sorted(K):
        if not re.search(VENCNE, ime):
            continue
        arterija = "artery" in ime
        z = _Osi(bmesh.new())
        for P, R in K[ime]:
            if len(P) < 2 or _dolzine(P)[-1] < 0.004:
                continue
            if arterija:  # anatomske debeline: deblo ≈ 4 mm, veje se tanjšajo, najtanjše ≈ 1,1 mm
                R = [max(r * 1.08, 0.00055) for r in R]
            elif ime == "Coronary sinus":
                R = [max(r * 1.3, 0.0032) for r in R]
            else:
                R = [max(r * 1.0, 0.0005) for r in R]
            P, R = prevzorci(P, R, lambda r: min(max(r * 1.6, 0.0011), 0.003))
            # dvig nad površino: središčnica na višini 0,3 r nad epikardom (glajeno vzdolž)
            dv = []
            for p, r in zip(P, R):
                loc, nor, _, d = t_srce.find_nearest(p, 0.012) if t_srce else (None, None, None, None)
                if loc is None:
                    dv.append(Vector()); continue
                nn = nor if nor.dot(loc - c_srca) > 0 else -nor
                h = (p - loc).dot(nn)
                dv.append(nn * (0.3 * r - h) if h < 0.3 * r else Vector())
            for _ in range(3):
                dv = [dv[0]] + [(dv[i - 1] + dv[i] * 2 + dv[i + 1]) / 4 for i in range(1, len(dv) - 1)] + [dv[-1]]
            P = [p + d for p, d in zip(P, dv)]
            seg = 8 if max(R) > 0.0012 else 6
            cev_polna(z, P, R, seg)
        tk = "vencna-arterija" if arterija else "vencna-vena"
        vrstica(ime, z, tk, "vencne-arterije" if arterija else "vencne-vene", "Arteries of heart.g" if arterija else "Cardiac veins.g")
    # stare (Z-Anatomy) mreže teh žil odstranimo
    zamenjane = re.compile(VELIKE + "|" + VENCNE)
    osnovni[:] = [r for r in osnovni if not zamenjane.search(r[0])]
    for r in nove:
        print(f"[organi] srce: žila {r[0]}: {len(r[1].polygons)} ploskev")
    return nove

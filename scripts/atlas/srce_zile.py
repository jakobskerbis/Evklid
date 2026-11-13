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
import bmesh, math, random, re
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
        self.bm = bm; self.osi = {}; self.uv = {}; self.os = {}

    def v(self, p, s, f, r, os_=None):
        """os_: točka na središčnici (samo zunanja ploskev): po njej v_mrezo usmeri normale navzven."""
        v = self.bm.verts.new(p); self.osi[v] = (s, math.cos(f), math.sin(f), r)
        if os_ is not None:
            self.os[v] = os_
        return v

    def f(self, verts, uvs):
        try:
            fa = self.bm.faces.new(verts)
        except ValueError:
            return None
        self.uv[fa] = uvs
        return fa


_SAV = None  # točka (središče srca): šiv valjastega UV (k = 0) obrnemo proti njej, na skrito stran cevi (pregled #461 B2-5)


def _okvirji(P):
    n = len(P)
    T = [(P[min(i + 1, n - 1)] - P[max(i - 1, 0)]).normalized() for i in range(n)]
    ref = T[0].orthogonal().normalized(); out = []
    for t in T:
        ref = (ref - t * ref.dot(t)).normalized()
        out.append((t, ref, t.cross(ref)))
    if _SAV is not None and n > 1:
        t, a, b = out[n // 2]; d = _SAV - P[n // 2]
        if (d - t * d.dot(t)).length > 1e-6:
            f = math.atan2(d.dot(b), d.dot(a)); c, si = math.cos(f), math.sin(f)
            out = [(t, (a * c + b * si).normalized(), t.cross((a * c + b * si).normalized())) for t, a, b in out]
    return out


def cev_stena(z, P, R, debelina, seg, zacetek_odprt=False, konec_odprt=False, s0=0.0):
    """Zaprta cev s steno: zunanja ploskev (polmer R), notranja (R − debelina, normale v svetlino), na koncih obroč
    stene (prerezan konec: stena kot obroč in svetlina). *_odprt=True: konca ni (cev se tam zlije z drugo mrežo)."""
    okv = _okvirji(P); s = [s0 + x for x in _dolzine(P)]
    obseg = 2 * math.pi * max(R)
    zun, not_ = [], []
    for (t, a, b), p, r, si in zip(okv, P, R, s):
        ri = max(r - debelina, r * 0.55)
        zun.append([z.v(p + (a * math.cos(2 * math.pi * k / seg) + b * math.sin(2 * math.pi * k / seg)) * r, si, 2 * math.pi * k / seg, r, p) for k in range(seg)])
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
        obroci.append([z.v(p + (a * math.cos(2 * math.pi * k / seg) + b * math.sin(2 * math.pi * k / seg)) * r, si, 2 * math.pi * k / seg, r, p) for k in range(seg)])
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
    # Normale: dosledne, nato navzven po zunanji ploskvi (glas ploščine: normala stran od središčnice). Cev z odprtim
    # koncem ni zaprta, zato predznak prostornine (normale_navzven) ne velja: mreža dobi oznako »usmerjeno«.
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    glas = 0.0
    for fa in bm.faces:
        if fa.is_valid and all(v in z.os for v in fa.verts):
            c = sum((z.os[v] for v in fa.verts), Vector()) / len(fa.verts)
            glas += fa.calc_area() * fa.normal.dot(fa.calc_center_median() - c)
    if glas < 0:
        bmesh.ops.reverse_faces(bm, faces=bm.faces)
    me = bpy.data.meshes.new(ime); bm.to_mesh(me); bm.free()
    me["uvLastni"] = 1
    me["usmerjeno"] = 1
    for p in me.polygons:
        p.use_smooth = True
    return me


def v_mrezo_bm(bm, ime):
    """Ploskovna struktura (lističi, kotanja) brez OSI: bmesh → mesh z gladkimi ploskvami (UV naredi peka)."""
    import bpy
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(ime); bm.to_mesh(me); bm.free()
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
VENCNA_ZOZITEV = 0.4  # venčne arterije: zožitev od začetka do konca veje
VEZ_R, VEZ_RAZSIR, VEZ_SPLOSCI = 0.0022, 0.0013, 0.2  # arterijska vez: polmer sredi, razširitev ob stenah, sploščenost
VELIKE = r"^(Ascending aorta|Aortic arch|Thoracic aorta|Brachiocephalic trunk|Left common carotid artery|Left subclavian artery|Pulmonary trunk|" \
         r"Bifurcation of pulmonary trunk|(Left|Right) pulmonary artery|Superior vena cava|Inferior vena cava \(thoracic part\)|" \
         r"(Left|Right) (superior|inferior) pulmonary vein)$"
VENCNE = r"^(Left coronary artery|Right coronary artery|Anterior interventricular artery|Circumflex artery of heart|" \
         r"Right inferolateral branch of right coronary artery|Coronary sinus|Great cardiac vein|Middle cardiac vein|Inferior vein of left ventricle.*|Posterior interventricular artery|Diagonal branch.*|.* branch of (right coronary|circumflex) artery|" \
         r"Small cardiac vein|Anterior cardiac veins|Oblique vein of left atrium)$"


# Posamezno izbirne žile (pregled #461, »manjka do ravni učbenika« 4): vsaka je svoj del (srce.json: »skupina« pove
# skupni del, npr. venčne arterije, ki ga vidi OŠ; posamezne žile so v razdelku »Več«).
DEL_VENCNE = {"Left coronary artery": "leva-vencna-arterija", "Anterior interventricular artery": "sprednja-medprekatna-arterija",
              "Diagonal branches of anterior interventricular artery": "sprednja-medprekatna-arterija",
              "Circumflex artery of heart": "cirkumfleksna-arterija", "Right coronary artery": "desna-vencna-arterija",
              "Right inferolateral branch of right coronary artery": "desna-vencna-arterija",
              "Posterior interventricular artery": "zadnja-medprekatna-arterija", "Coronary sinus": "vencni-sinus",
              "Great cardiac vein": "velika-srcna-vena", "Middle cardiac vein": "srednja-srcna-vena",
              "Sinoatrial nodal branch of right coronary artery": "desna-vencna-arterija", "Conus branch of right coronary artery": "desna-vencna-arterija",
              "Right marginal branch of right coronary artery": "obrobni-veji", "Left marginal branch of circumflex artery": "obrobni-veji",
              "Small cardiac vein": "mala-srcna-vena", "Anterior cardiac veins": "sprednje-srcne-vene", "Oblique vein of left atrium": "posevna-vena-preddvora"}
DEL_VEJE = {"Brachiocephalic trunk": "brahiocefalicno-deblo", "Left common carotid artery": "leva-skupna-karotida",
            "Left subclavian artery": "leva-podkljucnicna-arterija"}


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


def _po_povrsini(t, a, b, k=14):
    """Pot a → b, vsaka točka projicirana na najbližjo površino (t: BVH sten srca)."""
    out = []
    for i in range(k):
        q = a.lerp(b, i / (k - 1))
        loc = t.find_nearest(q, 0.03)[0]
        out.append(loc if loc is not None else q)
    return out


def dodaj_vencne(K, t, c_srca):
    """Venčne arterije do ravni učbenika (pregled #461): Z-Anatomy ima pri konici »čop« vzporednih vej LAD (in enakih vej
    velike srčne vene), nima diagonalnih vej z zgornje in srednje tretjine LAD in nima zadnje medprekatne arterije.
    - veje LAD (in velike srčne vene), ki se začnejo v spodnjih 45 % višine LAD (ob konici), odstranimo: LAD se konča
      kot ena žila, ki zavije okoli konice;
    - dve diagonalni veji (Ø ≈ 2 → 1 mm) z LAD pri 22 % in 40 % dolžine, poševno navzdol čez sprednjo steno levega prekata;
    - zadnja medprekatna arterija (Ø ≈ 2,2 → 1 mm) iz konca desne venčne arterije (crux) ob srednji srčni veni v zadnjem
      medprekatnem žlebu proti konici (3,5 mm vstran od vene)."""
    if t is None:
        return
    lad = K.get("Anterior interventricular artery")
    if lad:
        glavna = max(lad, key=lambda x: _dolzine(x[0])[-1])
        z0, z1 = glavna[0][0].z, glavna[0][-1].z
        meja = z1 + 0.45 * (z0 - z1)
        for ime in ("Anterior interventricular artery", "Great cardiac vein"):
            sp = K.get(ime, [])
            gl = max(sp, key=lambda x: _dolzine(x[0])[-1]) if sp else None
            K[ime] = [x for x in sp if x is gl or (ime == "Great cardiac vein" and x[0][0].z > z0 - 0.005) or x[0][0].z > meja]
        P = glavna[0]; s = _dolzine(P); L = s[-1]
        diag = []
        for f, dl in ((0.22, 0.048), (0.40, 0.04)):
            i = int(np.searchsorted(s, f * L))
            p = P[i]; tg = (P[min(i + 2, len(P) - 1)] - P[max(i - 2, 0)]).normalized()
            loc, nor, _, _ = t.find_nearest(p, 0.03)
            if loc is None:
                continue
            nor = nor if nor.dot(loc - c_srca) > 0 else -nor
            stran = nor.cross(tg).normalized()
            if stran.x < 0:  # proti levemu (bolnikovemu levemu, +x) robu: prosta stena levega prekata
                stran = -stran
            cilj = p + (stran * 0.75 + tg * 0.65).normalized() * dl
            pot = _po_povrsini(t, p + tg * 0.001, cilj, 14)
            diag.append((pot, [0.00095 - 0.00045 * j / 13 for j in range(14)]))
        if diag:
            K["Diagonal branches of anterior interventricular artery"] = diag
    rca, mcv = K.get("Right coronary artery"), K.get("Middle cardiac vein")
    if rca and mcv:
        v = max(mcv, key=lambda x: _dolzine(x[0])[-1])[0]
        if (v[-1] - c_srca).z > (v[0] - c_srca).z:
            v = v[::-1]
        gl = max(rca, key=lambda x: _dolzine(x[0])[-1])[0]
        crux = min(gl, key=lambda q: (q - v[0]).length)
        Pv, _ = prevzorci(v, [0.001] * len(v), 0.003)
        pot = [crux]
        for i, q in enumerate(Pv[1:], 1):
            tg = (Pv[min(i + 1, len(Pv) - 1)] - Pv[i - 1]).normalized()
            loc, nor, _, _ = t.find_nearest(q, 0.03)
            if loc is None:
                continue
            nor = nor if nor.dot(loc - c_srca) > 0 else -nor
            stran = nor.cross(tg).normalized()
            if stran.x > 0:  # proti desnemu prekatu (−x)
                stran = -stran
            pot.append(t.find_nearest(loc + stran * 0.0035, 0.03)[0] or loc)
        if len(pot) > 2:  # od crux do žleba po površini (ne ravno skozi zrak)
            pot = _po_povrsini(t, crux, pot[1], max(3, int((pot[1] - crux).length / 0.003)))[:-1] + pot[1:]
        L = _dolzine(pot)[-1]
        pot, _ = obrezi_dolzino(pot, [0] * len(pot), L * 0.85)
        sp = _dolzine(pot)
        K["Posterior interventricular artery"] = [(pot, [0.0011 - 0.0006 * x / max(sp[-1], 1e-6) for x in sp])]
        print(f"[organi] srce: zadnja medprekatna arterija {sp[-1] * 1000:.0f} mm")


def dodaj_vencne2(K, t, c_srca, kave, me_ra, me_la, pljucna_P):
    """Veje in vene do ravni Študij (pregled #461 B10), po učbeniku (Gray's, Netter): arterija sinusnega vozla in veja
    za conus iz začetka desne venčne arterije, desna (akutna) obrobna veja = najdaljša stranska veja desne venčne
    arterije Z-Anatomy proti konici, leva (obtuzna) obrobna veja iz cirkumfleksne proti konici; mala srčna vena v desnem
    venčnem žlebu ob desni venčni arteriji do venčnega sinusa, tri sprednje srčne vene čez desno venčno arterijo
    naravnost v desni preddvor, poševna vena levega preddvora (Marshall) po zadnji steni levega preddvora do venčnega
    sinusa. Venčni sinus se ne konča v spodnji votli veni (pregled #461 B4): del v njej odrežemo, ustje je med njo in
    trikuspidalno zaklopko. Notranje ime »Inferior vein of left ventricle (//Posterior '')« (vir) združimo."""
    if t is None:
        return
    for k in [k for k in K if k.startswith("Inferior vein of left ventricle") and k != "Inferior vein of left ventricle"]:
        K.setdefault("Inferior vein of left ventricle", []).extend(K.pop(k))
    def gl(ime):
        sp = K.get(ime) or []
        return max(sp, key=lambda x: _dolzine(x[0])[-1]) if sp else None

    def tocka(P, f):
        s = _dolzine(P); i = int(np.searchsorted(s, f * s[-1])); i = min(max(i, 1), len(P) - 2)
        return P[i], (P[i + 1] - P[i - 1]).normalized()

    def nor(q):
        loc, n, _, _ = t.find_nearest(q, 0.03)
        if loc is None:
            return q, Vector((0, 0, 1))
        return loc, (n if n.dot(loc - c_srca) > 0 else -n)
    rca = gl("Right coronary artery")
    if rca:
        P = rca[0] if rca[0][0].z > rca[0][-1].z else rca[0][::-1]
        ostale = [x for x in K["Right coronary artery"] if x is not rca]
        if ostale:  # desna obrobna veja: najdaljša stranska veja
            rm = max(ostale, key=lambda x: _dolzine(x[0])[-1])
            K["Right coronary artery"] = [x for x in K["Right coronary artery"] if x is not rm]
            K["Right marginal branch of right coronary artery"] = [rm]
        svc = kave.get("Superior vena cava")
        if svc:
            p0, _ = tocka(P, 0.06)
            cilj = svc[0][-1] + Vector((0, -0.006, -0.004))
            pot = _po_povrsini(t, p0, cilj, 16)
            K["Sinoatrial nodal branch of right coronary artery"] = [(pot, [0.0008 - 0.0003 * i / 15 for i in range(16)])]
        if pljucna_P:
            p0, tg = tocka(P, 0.04)
            cilj = pljucna_P[0] + Vector((0.004, -0.012, -0.006))
            pot = _po_povrsini(t, p0, p0.lerp(cilj, min(1.0, 0.032 / max((cilj - p0).length, 1e-6))), 14)
            K["Conus branch of right coronary artery"] = [(pot, [0.00075 - 0.0003 * i / 13 for i in range(14)])]
        # mala srčna vena: od 45 % do konca (crux) desne venčne arterije, 2,5 mm proti preddvoru
        pot = []
        for i in range(18):
            q, tg = tocka(P, 0.45 + 0.55 * i / 17)
            loc, n = nor(q)
            st = n.cross(tg).normalized()
            if st.z < 0:
                st = -st
            pot.append(nor(loc + st * 0.0026)[0])
        K["Small cardiac vein"] = [(pot, [0.0008 + 0.0003 * i / 17 for i in range(18)])]
        # sprednje srčne vene: s sprednje stene desnega prekata čez desno venčno arterijo v desni preddvor
        sv = []
        for f in (0.2, 0.3, 0.4):
            q, tg = tocka(P, f)
            loc, n = nor(q)
            gor = n.cross(tg).normalized()
            if gor.z < 0:
                gor = -gor
            sv.append((_po_povrsini(t, loc - gor * 0.022, loc + gor * 0.006, 12), [0.0007] * 12))
        K["Anterior cardiac veins"] = sv
    cx, lad = gl("Circumflex artery of heart"), gl("Anterior interventricular artery")
    if cx and lad:
        P = cx[0] if cx[0][0].z > cx[0][-1].z else cx[0][::-1]
        konica = lad[0][-1] if lad[0][-1].z < lad[0][0].z else lad[0][0]
        p0, tg = tocka(P, 0.45)
        cilj = p0 + (konica - p0).normalized() * 0.05
        K["Left marginal branch of circumflex artery"] = [(_po_povrsini(t, p0, cilj, 16), [0.0011 - 0.0005 * i / 15 for i in range(16)])]
    cs = gl("Coronary sinus"); ivc = kave.get("Inferior vena cava (thoracic part)")
    if cs and ivc:
        Pi, Ri = ivc
        r_cs = max(max(cs[1]) * 1.3, 0.0032)  # polmer, s katerim se cev riše (spodaj ×1,3)
        def v_ivc(q):  # cev venčnega sinusa se ne sme dotakniti stene spodnje votle vene (»obroč v obroču«, B2-4)
            i = min(range(len(Pi)), key=lambda j: (Pi[j] - q).length)
            return (Pi[i] - q).length < Ri[i] + r_cs + 0.001
        P, Rr = list(cs[0]), list(cs[1])
        if (P[0] - Pi[-1]).length < (P[-1] - Pi[-1]).length:  # konec ob spodnji votli veni naj bo zadnji
            P, Rr = P[::-1], Rr[::-1]
        while len(P) > 4 and v_ivc(P[-1]):
            P, Rr = P[:-1], Rr[:-1]
        if me_ra is not None:  # ustje v desni preddvor: podaljšek do stene preddvora (sprednje sredinsko od spodnje votle)
            d0 = (P[-1] - P[-3]).normalized()
            P = P + [P[-1] + d0 * 0.0015 * i for i in range(1, 4)]; Rr = Rr + [Rr[-1]] * 3
        K["Coronary sinus"] = [(P, Rr) if x is cs else x for x in K["Coronary sinus"]]
        kave["_cs"] = (P, [max(r * 1.3, 0.0032) for r in Rr])
    if me_la is not None and cs:
        lsp, lip = gl("Left superior pulmonary vein"), gl("Left inferior pulmonary vein")
        P_la = np.array([tuple(v.co) for v in me_la.vertices]); c_la = Vector(P_la.mean(0))
        zad = Vector(P_la[(P_la[:, 1] - P_la[:, 1].mean() > 0) & (P_la[:, 0] > P_la[:, 0].mean())].mean(0)) if len(P_la) else c_la
        Pcs = cs[0]; cil = min(Pcs, key=lambda q: (q - zad).length)
        K["Oblique vein of left atrium"] = [(_po_povrsini(t, nor(zad + Vector((0, 0, 0.008)))[0], cil, 14), [0.0006] * 14)]


def srce_zile(osnovni, cfg, tmp):
    K = cfg.get("_krivulje", {})
    if not K:
        print("[organi] srce_zile: ni krivulj (Z-Anatomy), preskočeno"); return []
    po = {r[0]: r for r in osnovni}
    mreza = lambda ime: po[ime][1] if ime in po else None
    nove = []
    srce = [r for r in osnovni if re.search(r"^(Left|Right) (atrium|ventricle)$", r[0])]
    c_srca = sum((Vector(v.co) for r in srce for v in r[1].vertices), Vector()) / max(sum(len(r[1].vertices) for r in srce), 1)
    global _SAV
    _SAV = c_srca.copy()
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

    def v_steno(P, R, mreze, globina, obod=False):
        """Pot od prostega konca proti srcu: konča se `globina` za prvim zadetkom stene (mreže). obod=True: tudi tam, kjer
        se cev prvič dotakne stene (rob odprtine v steni preddvora, skozi katero bi žarek zgrešil steno in cev štrlela
        v votlino do nasprotne stene – pregled #461 B2-4)."""
        t = _bvh_vrstic(mreze)
        if t is None:
            return P, R
        s = _dolzine(P)
        if obod:
            for i in range(len(P)):
                loc = t.find_nearest(P[i], R[i] * 1.5)[0]
                if loc is not None and (loc - P[i]).length < R[i] * 1.02:
                    return obrezi_dolzino(P, R, max(0.004, s[i] + globina))
        for i in range(len(P) - 1):
            d = P[i + 1] - P[i]
            h = t.ray_cast(P[i], d.normalized(), d.length)
            if h[0] is not None:
                do = s[i] + (h[0] - P[i]).length + globina
                return obrezi_dolzino(P, R, do)
        return P, R

    aorta_P = aorta_R = pljucna_P = None
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
        aorta_P, aorta_R = P, R
        T_ao = _bvh_vrstic([nove[-1]])
        # veje loka: začnejo v steni aorte (izhod iz svetline), dolge ≈ 3 cm
        # premeri po učbeniku: brahiocefalično deblo Ø ≈ 13 mm (≈ 1,5 × leva skupna karotida Ø ≈ 8,5 mm), leva podključnična Ø ≈ 9,5 mm
        for ime, dl, rmin in (("Brachiocephalic trunk", 0.034, 0.0066), ("Left common carotid artery", 0.03, 0.0042), ("Left subclavian artery", 0.03, 0.0047)):
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
            rv = rmin
            Rv2 = [rmin] * (9 + len(Pv[min(i0 + 4, len(Pv) - 1):]))
            Pv2, Rv2 = obrezi_dolzino(Pv2, Rv2, dl)
            Pv2, Rv2 = prevzorci(Pv2, Rv2, lambda r: max(0.0015, r * 0.3))
            z = _Osi(bmesh.new())
            razcep_bc = ime == "Brachiocephalic trunk" and len(Pv2) > 4
            if razcep_bc:  # zadnjih ~6 mm se zoži na 0,8 r: rob debla ostane v začetkih obeh vej (brez obroča, pregled #461)
                Ld = _dolzine(Pv2)
                Rv2 = [r * (1 - 0.2 * min(1.0, max(0.0, (x - (Ld[-1] - 0.006)) / 0.006))) for r, x in zip(Rv2, Ld)]
            cev_stena(z, Pv2, Rv2, 0.0012, 20, konec_odprt=razcep_bc)
            vrstica(ime, z, "aorta", DEL_VEJE.get(ime, "aorta"), "Aortic arch / Aorta.g")
            if razcep_bc:  # razcep brahiocefaličnega debla: desna podključnična (bočno desno) in desna skupna karotida (gor)
                E = Pv2[-1]; tg = (Pv2[-1] - Pv2[-4]).normalized()
                for ime2, smer, r2, dl2 in (("Right common carotid artery", Vector((-0.25, 0, 1)), 0.0037, 0.02),
                                            ("Right subclavian artery", Vector((-1, 0.15, 0.25)), 0.0045, 0.02)):
                    smer = (tg * 0.6 + smer.normalized()).normalized()
                    P2 = bezier_pot(E - tg * 0.004, tg, E + smer * dl2, smer, 12)
                    R2 = [Rv2[-1] * 1.02 * (1 - i / 5) + r2 * (i / 5) if i < 5 else r2 for i in range(12)]
                    z = _Osi(bmesh.new())
                    cev_stena(z, P2, R2, 0.0011, 18, zacetek_odprt=True)
                    vrstica(ime2, z, "aorta", "brahiocefalicno-deblo", "Brachiocephalic trunk / Aorta.g")
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
            # deblo do razcepa in leva pljučna arterija naprej: ista središčnica (brez stopnice), dva imenovana dela
            jr = min(range(len(P)), key=lambda q: (P[q] - razcep).length)
            jr = max(2, min(jr, len(P) - 3))
            # ena zvezna mreža (brez šiva na stiku debla in leve pljučne arterije, pregled #461)
            z = _Osi(bmesh.new())
            cev_stena(z, P, R, 0.0016, 28, zacetek_odprt=True)
            vrstica("Pulmonary trunk and left pulmonary artery", z, "pljucna", "pljucno-deblo", "Pulmonary arteries.g")
            pljucna_P, pljucna_R, pljucna_j = P, R, jr
            # desna: iz stene debla ob razcepu
            Pr, Rr = zdruzi([rpa], zacetek=razcep)
            j = min(range(len(P)), key=lambda q: (P[q] - razcep).length)
            os_ = (Pr[min(6, len(Pr) - 1)] - Pr[0]).normalized()
            t = (P[min(j + 1, len(P) - 1)] - P[max(j - 1, 0)]).normalized()
            radial = (os_ - t * os_.dot(t)).normalized()
            rv = 0.0084
            d = math.sqrt(max((R[j] - 0.0010) ** 2 - rv ** 2, (R[j] * 0.45) ** 2))
            k = next((i for i in range(len(Pr)) if (Pr[i] - P[j]).length > R[j] + 0.006), 2)
            Pv = bezier_pot(P[j] + radial * d, radial, Pr[k], Pr[min(k + 2, len(Pr) - 1)] - Pr[k], 10)[:-1] + Pr[k:]
            Rv = [rv] * len(Pv)
            if _dolzine(Pv)[-1] < 0.065:  # krivulja je krajša: podaljšek v smeri konca do desnega hilusa
                d0 = (Pv[-1] - Pv[-4]).normalized(); d0 = (d0 + Vector((-0.6, 0.15, -0.05))).normalized()
                manjka = 0.065 - _dolzine(Pv)[-1]
                Pv = Pv + [Pv[-1] + d0 * manjka * (i / 8) for i in range(1, 9)]; Rv = Rv + [Rv[-1]] * 8
            Pv, Rv = obrezi_dolzino(Pv, Rv, 0.065)
            # enakomerno tanjšanje (Ø ≈ 17 → 15 mm), brez »rokava« iz polmerov krivulje (pregled #461)
            Lr = _dolzine(Pv); Rv = [0.0084 - 0.0008 * x / max(Lr[-1], 1e-6) for x in Lr]
            Pv, Rv = prevzorci(Pv, Rv, lambda r: max(0.002, r * 0.25))
            z = _Osi(bmesh.new())
            cev_stena(z, Pv, Rv, 0.0014, 24)
            vrstica("Right pulmonary artery", z, "pljucna", "pljucne-arterije", "Pulmonary arteries.g")
    # ---- arterijska vez (lig. arteriosum, ostanek ductus arteriosus): od razcepa pljučnega debla / začetka leve
    # pljučne arterije do spodnje (vbočene) strani aortnega loka, Ø ≈ 3 mm, dolga ≈ 0,5–1,5 cm
    if aorta_P and pljucna_P:
        # točka na loku: distalno od izstopa leve podključnične (najvišja točka loka + ~1,5 cm proti descendentni)
        ivrh = max(range(len(aorta_P)), key=lambda q: aorta_P[q].z)
        sl = _dolzine(aorta_P); i0 = int(np.searchsorted(sl, sl[ivrh] + 0.008)); i1 = int(np.searchsorted(sl, sl[ivrh] + 0.04))
        # najkrajša vez med lokom (distalno od leve podključnične) in levo pljučno arterijo (učbenik: 0,7–1 cm)
        par = min(((ia, jb) for ia in range(min(i0, len(aorta_P) - 1), min(i1, len(aorta_P))) for jb in range(len(pljucna_P))),
                  key=lambda x: (aorta_P[x[0]] - pljucna_P[x[1]]).length - aorta_R[x[0]] - pljucna_R[x[1]])
        i, jl = par
        A = pljucna_P[jl]; Ra_ = pljucna_R[jl]
        d = (aorta_P[i] - A).normalized()
        a, b = A + d * Ra_ * 0.85, aorta_P[i] - d * aorta_R[i] * 0.85
        if 0.003 < (b - a).length < 0.03:
            # krog 8 (ocena: »siva kovinska palčka«): kratek vezivni trak, ki se na obeh koncih razširi v steno žil
            # (Ø ≈ 3,4 mm sredi, ≈ 6,5 mm ob narastiščih), konca segata 0,7 polmera v steni (brez vidnega roba)
            a, b = A + d * Ra_ * 0.7, aorta_P[i] - d * aorta_R[i] * 0.7
            Pl, _ = prevzorci([a, b], [0.002, 0.002], 0.0008)
            L_ = _dolzine(Pl); L_[-1] = max(L_[-1], 1e-6)
            # krog 9 (ocena krog 8: »vez od zadaj pretanka«): čvrsta vezivna vrvica Ø ≈ 4,4 mm, ki se ob izstopu iz
            # stene obeh žil zaobljeno razširi (Ø ≈ 7 mm, eksponentni prehod 1,8 mm), presek rahlo ovalen (4,4 × 3,5 mm)
            xa, xb = 0.3 * Ra_, L_[-1] - 0.3 * aorta_R[i]
            Rl = [VEZ_R + VEZ_RAZSIR * min(1.0, max(math.exp(-(x - xa) / 0.0018), math.exp(-(xb - x) / 0.0018))) for x in L_]
            z = _Osi(bmesh.new())
            cev_polna(z, Pl, Rl, 16)
            # rahlo sploščena vrvica (stisnemo v smeri pravokotno na lok in vez)
            ax = (b - a).normalized(); ploska = ax.cross(Vector((0, 0, 1))).normalized() if abs(ax.z) < 0.9 else Vector((1, 0, 0))
            for v in z.bm.verts:
                q = v.co - a; q = q - ax * q.dot(ax)
                v.co = v.co - ploska * q.dot(ploska) * VEZ_SPLOSCI  # ≈ 4,4 × 3,5 mm (B2-12)
            vrstica("Ligamentum arteriosum", z, "vez", "arterijska-vez", "Aortic arch / Aorta.g")
            print(f"[organi] srce: arterijska vez {(b - a).length * 1000:.1f} mm")
        else:
            print(f"[organi] srce: arterijska vez preskočena (razdalja {(b - a).length * 1000:.1f} mm)")
    # ---- votli veni: v desni preddvor
    ra = [r for r in osnovni if r[0] == "Right atrium"]
    kave = {}
    for ime, dl in (("Superior vena cava", 0.075), ("Inferior vena cava (thoracic part)", 0.03)):
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
        Pf, Rf = P, R
        P, R = v_steno(P, R, ra, 0.003, obod=True)  # ustje v odprtini stene preddvora (ne skozi votlino, pregled #461 B2-4)
        # rokav stene preddvora (sinus venarum) objema veno: nadaljujemo, dokler radialni žarki zadevajo steno preddvora
        # okoli osi (≥ 4 od 8), da se vena konča na notranjem robu rokava, ne pred njim (»obroč v obroču«)
        t_ra0 = _bvh_vrstic(ra)
        if t_ra0 is not None:
            Lf = _dolzine(Pf); x = _dolzine(P)[-1]; zadnji = None; x_max = x + 0.012; doseg = max(R) * 1.7
            while x < min(Lf[-1], x_max):  # največ 12 mm naprej, stena rokava tesno ob veni (≤ 1,7 r)
                i = int(np.searchsorted(Lf, x)); i = min(max(i, 1), len(Pf) - 1)
                f = (x - Lf[i - 1]) / max(Lf[i] - Lf[i - 1], 1e-9); q = Pf[i - 1].lerp(Pf[i], f)
                tg = (Pf[i] - Pf[i - 1]).normalized(); a_ = tg.orthogonal().normalized(); b_ = tg.cross(a_)
                zad = sum(t_ra0.ray_cast(q, a_ * math.cos(k * math.pi / 4) + b_ * math.sin(k * math.pi / 4), doseg)[0] is not None for k in range(8))
                if zad < 4:
                    break
                zadnji = x; x += 0.001
            if zadnji is not None and zadnji > _dolzine(P)[-1]:
                P, R = obrezi_dolzino(Pf, Rf, zadnji + 0.001)
                print(f"[organi] srce: {ime}: ustje do notranjega roba rokava (+{(zadnji + 0.001 - x_max + 0.012) * 1000:.0f} mm)")
        L = _dolzine(P)[-1]
        if ime.startswith("Superior") and L < dl:  # zgornja votla vena do višine vrha aortnega loka
            d0 = (P[0] - P[min(3, len(P) - 1)]).normalized()
            P = [P[0] + d0 * (dl - L) * (1 - i / 8) for i in range(8)] + P; R = [R[0]] * 8 + R
            L = dl
        if L > dl:  # prosti konec skrajšamo (od srca navzven največ dl)
            P, R = P[::-1], R[::-1]; P, R = obrezi_dolzino(P, R, dl); P, R = P[::-1], R[::-1]
        R = [max(r, 0.0095) for r in R]
        P, R = prevzorci(P, R, lambda r: max(0.002, r * 0.25))
        # ustje: Z-Anatomy ima ob ustju votle vene kratek »rokav« stene preddvora (sinus venarum), širši od vene; od spodaj
        # je bil viden kot obroč okoli tanjše vene (pregled #461 B2-4). Kjer rokav objema veno, jo razširimo do njega (radialni
        # žarki na stene preddvora: če jih ≥ 4 od 8 zadene v 1,7 r, je polmer mediana razdalje + 0,6 mm).
        t_ra_ = _bvh_vrstic(ra)
        Lk = _dolzine(P)
        if t_ra_ is not None:
            nov = list(R)
            for i in range(len(P)):
                tg = (P[min(i + 1, len(P) - 1)] - P[max(i - 1, 0)]).normalized()
                a_ = tg.orthogonal().normalized(); b_ = tg.cross(a_)
                d = []
                for k in range(8):
                    smer = a_ * math.cos(k * math.pi / 4) + b_ * math.sin(k * math.pi / 4)
                    h = t_ra_.ray_cast(P[i], smer, max(R) * 1.7)
                    if h[0] is not None:
                        d.append(h[3])
                if len(d) >= 4 and float(np.median(d)) > R[i]:
                    nov[i] = min(0.02, float(np.median(d)) + 0.0006)
            for _ in range(3):  # gladko vzdolž
                nov = [nov[0]] + [(nov[k - 1] + 2 * nov[k] + nov[k + 1]) / 4 for k in range(1, len(nov) - 1)] + [nov[-1]]
            raz = max(n_ - r for n_, r in zip(nov, R))
            R = [max(r, n_) for r, n_ in zip(R, nov)]
            print(f"[organi] srce: {ime}: ustje razširjeno do stene preddvora (+{raz * 1000:.1f} mm)")
        # lijakasto ustje (zadnjih 8 mm do 1,3 r): zapolni odprtino v steni preddvora, ki je širša od vene
        R = [r * (1 + 0.3 * min(1.0, max(0.0, (x - (Lk[-1] - 0.008)) / 0.008)) ** 1.5) for r, x in zip(R, Lk)]
        z = _Osi(bmesh.new())
        # zgornja: zgornji konec odprt, nadaljujeta ga brahiocefalični veni (brez pokrova in stopnice, B2-N4)
        cev_stena(z, P, R, 0.0012, 24, zacetek_odprt=ime.startswith("Superior"), konec_odprt=True)
        if not ime.startswith("Superior"):
            # krog m4 (ocena: »luknja v steni desnega preddvora«): skozi ustje spodnje votle vene se je iz preddvora
            # videlo ozadje. Svetlina dobi dno 3 mm za prerezanim koncem (od zunaj: prerezana žila s plitvo svetlino, iz
            # preddvora: temna svetlina vene), obojestransko.
            okv_ = _okvirji(P); i_ = next((i for i, x in enumerate(_dolzine(P)) if x >= 0.003), 1)
            ri_ = max(R[i_] - 0.0012, R[i_] * 0.55) + 0.0002
            def plosca_(q):  # zaprta tanka plošča (dve ploskvi in rob): brez odprtih robov
                c_ = z.v(q, 0.0, 0.0, 0.0)
                return c_, [z.v(q + (okv_[i_][1] * math.cos(2 * math.pi * k / 24) + okv_[i_][2] * math.sin(2 * math.pi * k / 24)) * ri_, 0.0, 2 * math.pi * k / 24, ri_) for k in range(24)]
            (ca_, oa_), (cb_, ob_) = plosca_(P[i_]), plosca_(P[i_] + okv_[i_][0] * 0.0004)
            for k in range(24):
                k1 = (k + 1) % 24
                z.f([ca_, oa_[k1], oa_[k]], [(2.3, 0.0), (2.4, 0.05), (2.4, 0.0)])
                z.f([cb_, ob_[k], ob_[k1]], [(2.3, 0.0), (2.4, 0.0), (2.4, 0.05)])
                z.f([oa_[k], oa_[k1], ob_[k1], ob_[k]], [(2.3, 0.0), (2.4, 0.0), (2.4, 0.05), (2.3, 0.05)])
        vrstica(ime, z, "vena", "votli-veni", "Systemic veins.g")
        kave[ime] = (P, R)
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
            zgornja = "superior" in ime
            smer = (b - a).normalized()
            smer = (smer + Vector((stran * 0.9, 0.5, 0.22 if zgornja else -0.04))).normalized()
            # zunaj perikarda vene zavijejo proti hilusu: zgornji navzgor in nazaj, spodnji vodoravno in nazaj; dolžine
            # in premeri se razlikujejo (zgornji ≈ 2,2 cm, Ø 13,5 mm; spodnji ≈ 1,7 cm, Ø 12 mm; pregled #461 B2-8)
            dl_v = (0.022 if zgornja else 0.017) * (1.08 if stran < 0 else 1.0)
            zun = a + smer * dl_v + Vector((stran * 0.003, 0.006, 0.007 if zgornja else -0.002))
            konec = (smer + Vector((stran * 0.35, 0.45, 0.35 if zgornja else 0.05))).normalized()
            # pot: od zunanjega konca proti preddvoru (cilj = točka a), zavije v steno
            P = bezier_pot(zun + konec * 0.004, -konec, a.lerp(c_la, 0.35), (c_la - a), 18)
            rv_ = 0.0068 if zgornja else 0.006  # Ø ≈ 13,5 / 12 mm (zgornji večji)
            R = [rv_] * len(P)
            P, R = v_steno(P, R, la, 0.0004)
            L = _dolzine(P)[-1]
            if L < dl_v:  # žarek je zadel steno zgodaj (štrclj): prosti konec podaljšamo navzven
                d0 = (P[0] - P[1]).normalized()
                P = [P[0] + d0 * (dl_v - L) * (1 - i / 6) for i in range(6)] + P; R = [R[0]] * 6 + R
            P, R = P[::-1], R[::-1]
            P, R = prevzorci(P, R, lambda r: 0.0022)
            Lv = _dolzine(P)  # ustje lijakasto: prvih 7 mm (ob preddvoru) do 1,35 r
            R = [r * (1 + 0.35 * max(0.0, 1 - x / 0.007) ** 1.5) for r, x in zip(R, Lv)]
            z = _Osi(bmesh.new())
            cev_stena(z, P, R, 0.0011, 20, zacetek_odprt=True)
            vrstica(ime, z, "pljucna-vena", "pljucne-vene", "Pulmonary veins.g")
    # ---- venčne žile: polne cevi nad površino (tretjina premera v maščobi)
    dodaj_vencne(K, t_srce, c_srca)
    la_me = la[0][1] if la else None
    dodaj_vencne2(K, t_srce, c_srca, kave, ra[0][1] if ra else None, la_me, pljucna_P)
    for ime in sorted(K):
        if not re.search(VENCNE, ime):
            continue
        for P, R in K[ime]:
            if len(P) > 1:
                print(f"[organi] krivulja {ime}: L {_dolzine(P)[-1] * 1000:.0f} mm, r {max(R) * 1000:.2f}, "
                      f"od {tuple(round(x * 1000) for x in P[0])} do {tuple(round(x * 1000) for x in P[-1])}")
        arterija = "artery" in ime
        z = _Osi(bmesh.new())
        for P, R in K[ime]:
            if len(P) < 2 or _dolzine(P)[-1] < 0.004:
                continue
            if arterija and aorta_P:  # ustje v aortnem sinusu: del krivulje v svetlini aorte (rdeča kepa v prerezu) odrežemo
                def v_aorti(q):
                    i = min(range(len(aorta_P)), key=lambda j: (aorta_P[j] - q).length)
                    return (aorta_P[i] - q).length < aorta_R[i] - 0.0005
                while len(P) > 2 and v_aorti(P[0]):
                    P, R = P[1:], R[1:]
                while len(P) > 2 and v_aorti(P[-1]):
                    P, R = P[:-1], R[:-1]
            if arterija:  # anatomske debeline: deblo ≈ 4 mm, veje se tanjšajo, najtanjše ≈ 1,1 mm
                # krog 10 srca (ocena k5: »enakomerne svetlo rdeče cevi«): vsaka veja se proti koncu zoži za VENCNA_ZOZITEV
                # (smer: debelejši konec krivulje je začetek)
                Ls = _dolzine(P); q = max(1, len(R) // 4)
                obr = sum(R[:q]) < sum(R[-q:])
                R = [max(r * 1.08 * (1 - VENCNA_ZOZITEV * ((Ls[-1] - l) if obr else l) / max(Ls[-1], 1e-6)), 0.00055) for r, l in zip(R, Ls)]
            elif ime == "Coronary sinus":
                R = [max(r * 1.3, 0.0032) for r in R]
            else:
                R = [max(r * 1.0, 0.0005) for r in R]
            # krog m4 (ocena: »venčni sinus kot niz temnih grč«): debele vene v venčnem žlebu so ena gladka cev – polmer
            # zglajen vzdolž žile, gostejši obroči, več stranic (prej 8-kotnik z obroči na 3 mm)
            debela = (not arterija) and max(R) > 0.0022
            if debela:
                for _ in range(12):
                    R = [R[0]] + [(R[i - 1] + 2 * R[i] + R[i + 1]) / 4 for i in range(1, len(R) - 1)] + [R[-1]]
            P, R = prevzorci(P, R, (lambda r: min(max(r * 0.45, 0.0009), 0.0015)) if debela else (lambda r: min(max(r * 1.6, 0.0011), 0.003)))
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
            seg = 14 if debela else 8 if max(R) > 0.0012 else 6
            cev_polna(z, P, R, seg)
        tk = "vencna-arterija" if arterija else "vencna-vena"
        vrstica(ime, z, tk, DEL_VENCNE.get(ime, "vencne-arterije" if arterija else "vencne-vene"), "Arteries of heart.g" if arterija else "Cardiac veins.g")
    # ---- v. azygos (v zgornjo votlo veno od zadaj, nad desnim glavnim bronhom) in brahiocefalični veni (združita se v
    # zgornjo votlo veno za desnim robom prsnice); Ø azygos ≈ 9 mm, brahiocefalični ≈ 12–14 mm
    svc = kave.get("Superior vena cava")
    if svc:
        P, Rr = svc  # P[0] prosti (zgornji) konec, P[-1] ustje v desnem preddvoru
        s_ = _dolzine(P); L = s_[-1]
        j = int(np.searchsorted(s_, L - 0.022)); j = max(1, min(j, len(P) - 2))
        J, rj = P[j], Rr[j]
        nazaj = Vector((0, 1, 0))
        # spodnji krak za pljučnim korenom ob hrbtenici (≈ 6 cm za zgornjo votlo veno), ne na steni preddvorov (B2-N1)
        A0 = J + Vector((0.008, 0.062, -0.06)); A1 = J + Vector((0.004, 0.046, 0.014)); A2 = J + nazaj * (rj - 0.0009)
        pot = bezier_pot(A0, Vector((0, 0, 1)), A1, Vector((0, 0, 1)), 12)[:-1] + bezier_pot(A1, Vector((0, -0.2, 1)), A2, -nazaj, 12)
        pot, rr_ = prevzorci(pot, [0.0045] * len(pot), 0.0018)
        z = _Osi(bmesh.new()); cev_stena(z, pot, rr_, 0.0008, 18, zacetek_odprt=True, konec_odprt=True)
        vrstica("Azygos vein", z, "vena", "v-azygos", "Systemic veins.g")
        T = P[0]; up = (P[0] - P[min(3, len(P) - 1)]).normalized()
        for ime2, cilj, tg2, r2 in (("Right brachiocephalic vein", T + up * 0.022 + Vector((-0.004, 0, 0)), up, 0.0068),
                                    ("Left brachiocephalic vein", T + Vector((0.058, -0.012, 0.016)), Vector((1, 0, 0.15)), 0.0062)):
            pot = bezier_pot(T - up * 0.008, up, cilj, tg2, 16)  # začetek v svetlini zgornje votle vene
            pot, rr_ = prevzorci(pot, [r2] * len(pot), 0.002)
            Lb = _dolzine(pot); r0_ = Rr[0] * 0.97  # začetek s polmerom zgornje votle vene, nato tanjšanje (brez stopnice)
            rr_ = [r0_ + (r2 - r0_) * min(1.0, x / 0.012) for x in Lb]
            z = _Osi(bmesh.new()); cev_stena(z, pot, rr_, 0.0009, 20, zacetek_odprt=True)
            vrstica(ime2, z, "vena", "brahiocefalicni-veni", "Systemic veins.g")
    # ---- desni preddvor od znotraj: mejni greben (crista terminalis) od ustja zgornje do ustja spodnje votle vene ob
    # stranski steni, glavničaste mišice (mm. pectinati) od grebena naprej proti ušesu; medpreddvorni pretin: ovalna
    # kotanja (fossa ovalis, Ø ≈ 2 × 1,5 cm, tanko vezivno dno) z robom (limbus). Grebeni so napol v steni.
    ivc = kave.get("Inferior vena cava (thoracic part)")
    if ra and svc and ivc:
        me_ra = ra[0][1]; t_ra = _bvh_vrstic(ra)
        c_ra = sum((Vector(v.co) for v in me_ra.vertices), Vector()) / len(me_ra.vertices)
        S, I = svc[0][-1], ivc[0][-1]

        def na_steno(q, r, globlje=0.4):
            d = (q - c_ra).normalized(); h = t_ra.ray_cast(c_ra, d, 0.08)
            return h[0] - d * r * globlje if h[0] is not None else None
        lat = Vector((-1, 0.15, 0)).normalized()
        cr = [na_steno(S.lerp(I, i / 13) + lat * 0.012 * math.sin(math.pi * i / 13) + lat * 0.006, 0.0022) for i in range(14)]
        cr = [q for q in cr if q is not None]
        if len(cr) > 5:
            z = _Osi(bmesh.new()); cev_polna(z, cr, [0.0022 * (0.7 + 0.3 * math.sin(math.pi * i / (len(cr) - 1))) for i in range(len(cr))], 8)
            vrstica("Crista terminalis", z, "miokard", "mejni-greben", "Right atrium / Heart.g")
            # krog 8 (ocena: »enakomerno razmaknjene prečke lestve«): nepravilen razmik (2–6 mm), različna debelina
            # (Ø 1,2–3 mm) in dolžina (12–26 mm), rahlo vijugasta pot, nekatere se razcepijo v tanjšo vejo, ki se
            # pridruži sosedu (mreža grebenov kot na preparatu); ponovljivo (stalno seme)
            z = _Osi(bmesh.new()); n_p = 0
            rng = random.Random(8)
            spr0 = Vector((0, -1, 0.35)).normalized()
            dl_cr = _dolzine(cr); L_cr = dl_cr[-1]

            def na_cristi(x):
                i = int(np.searchsorted(dl_cr, x)); i = min(max(i, 1), len(cr) - 1)
                f = (x - dl_cr[i - 1]) / max(dl_cr[i] - dl_cr[i - 1], 1e-9)
                return cr[i - 1].lerp(cr[i], f)

            def greben(q0, smer, dolzina, r0, korak=0.0028):
                pot = [q0]; d = smer.normalized()
                for i in range(1, max(3, int(dolzina / korak)) + 1):
                    nrm = (pot[-1] - c_ra).normalized(); bok = d.cross(nrm).normalized()
                    d = (d + bok * rng.uniform(-0.16, 0.16)).normalized()
                    q = na_steno(pot[-1] + d * korak, r0 * 0.6)
                    if q is None:
                        break
                    pot.append(q)
                if len(pot) < 4:
                    return None
                n_ = len(pot) - 1; nab = rng.uniform(0.25, 0.6)
                rr = [r0 * (1 - 0.55 * i / n_) * (1 + 0.18 * math.exp(-((i / n_ - nab) / 0.18) ** 2)) for i in range(len(pot))]
                return pot, rr

            x = rng.uniform(0.002, 0.004)
            while x < L_cr - 0.003:
                q0 = na_cristi(x)
                nrm = (q0 - c_ra).normalized()
                kot = rng.uniform(-0.45, 0.45)  # ± 26° okoli normale stene
                smer = (spr0 * math.cos(kot) + nrm.cross(spr0).normalized() * math.sin(kot)).normalized()
                r0 = rng.uniform(0.0006, 0.0015)
                g = greben(q0, smer, rng.uniform(0.012, 0.026), r0)
                if g:
                    cev_polna(z, g[0], g[1], 6); n_p += 1
                    if rng.random() < 0.5 and len(g[0]) > 5:  # veja: odcepi se pod kotom ≈ 35° proti sosedu
                        j = rng.randint(2, len(g[0]) - 3)
                        d0 = (g[0][j + 1] - g[0][j]).normalized(); nrm = (g[0][j] - c_ra).normalized()
                        sk = math.radians(rng.choice((-1, 1)) * rng.uniform(28, 45))
                        dv = (d0 * math.cos(sk) + nrm.cross(d0).normalized() * math.sin(sk)).normalized()
                        v = greben(g[0][j], dv, rng.uniform(0.005, 0.011), g[1][j] * 0.62, 0.0022)
                        if v:
                            cev_polna(z, v[0], v[1], 6); n_p += 1
                x += rng.uniform(0.002, 0.0065) + r0
            if n_p:
                vrstica("Musculi pectinati", z, "miokard", "glavnicaste-misice", "Right atrium / Heart.g")
        if la:
            c_la2 = sum((Vector(v.co) for v in la[0][1].vertices), Vector()) / len(la[0][1].vertices)
            H = na_steno(c_la2.lerp(I, 0.4), 0.0, 0.0)
            if H is not None:
                nn = (c_ra - H).normalized(); a_ = nn.orthogonal().normalized(); b_ = nn.cross(a_)
                bm = bmesh.new(); k_ = 28
                rob = [bm.verts.new(H + nn * 0.0004 + (a_ * math.cos(2 * math.pi * i / k_) * 0.009 + b_ * math.sin(2 * math.pi * i / k_) * 0.0072)) for i in range(k_)]
                c_ = bm.verts.new(H + nn * 0.0002)
                for i in range(k_):
                    bm.faces.new((rob[i], rob[(i + 1) % k_], c_))
                bmesh.ops.solidify(bm, geom=bm.faces[:], thickness=0.0005)
                me_f = v_mrezo_bm(bm, "fossa")
                nove.append(["Fossa ovalis", me_f, "vez", "ovalna-kotanja", "Fossa ovalis (lastno) / Right atrium / Heart.g"])
                lim = [na_steno(H + nn * 0.002 + (a_ * math.cos(f) * 0.0108 + b_ * math.sin(f) * 0.0088), 0.0017) for f in np.linspace(0.6, 2 * math.pi - 0.6, 20)]
                lim = [q for q in lim if q is not None]
                if len(lim) > 6:
                    z = _Osi(bmesh.new()); cev_polna(z, lim, [0.0017] * len(lim), 8)
                    vrstica("Limbus fossae ovalis", z, "miokard", "ovalna-kotanja", "Right atrium / Heart.g")
        # zaklopki ustij: Eustahijeva (spodnja votla vena) in Tebezijeva (venčni sinus): polmesečasti gubi na sprednjem robu
        for ime2, (Pk, Rk) in (("Valve of inferior vena cava", ivc), ("Valve of coronary sinus", kave.get("_cs", (None, None)))):
            if Pk is None:
                continue
            o = Pk[-1]; n_ = (Pk[-1] - Pk[-2]).normalized(); r0 = Rk[-1] * 1.05
            a_ = (Vector((0, -1, 0)) - n_ * n_.dot(Vector((0, -1, 0)))).normalized(); b_ = n_.cross(a_)
            bm = bmesh.new(); vrste = []
            for i in range(15):
                f = -1.1 + 2.2 * i / 14
                rad = a_ * math.cos(f) + b_ * math.sin(f); g = math.sin(math.pi * i / 14)
                vrste.append([bm.verts.new(o + rad * r0 * (1 - 0.3 * g * u) + n_ * (0.0005 + 0.0035 * g * u * (1 if "inferior" in ime2 else 0.5))) for u in (0, 0.5, 1)])
            for i in range(14):
                for u in range(2):
                    bm.faces.new((vrste[i][u], vrste[i + 1][u], vrste[i + 1][u + 1], vrste[i][u + 1]))
            bmesh.ops.solidify(bm, geom=bm.faces[:], thickness=0.0005)
            nove.append([ime2, v_mrezo_bm(bm, "zaklopka-ustja"), "miokard", "zaklopki-ustij", ime2 + " (lastno) / Right atrium / Heart.g"])  # endokard (B2-N2)
    # stare (Z-Anatomy) mreže teh žil odstranimo
    zamenjane = re.compile(VELIKE + "|" + VENCNE)
    osnovni[:] = [r for r in osnovni if not zamenjane.search(r[0])]
    for r in nove:
        print(f"[organi] srce: žila {r[0]}: {len(r[1].polygons)} ploskev")
    return nove

# Drevesa cevi v organih (lastno delo, CC BY-SA 4.0): drobne veje bronhijev in žil v pljučih, portalna vena, jetrne
# vene, jetrne arterije in žolčni vodi v jetrih. Z-Anatomy ima veje le do segmentov (pljuča) oziroma samo debla (jetra);
# pravo drevo se v organu razveji do režnjičev. Veje rastejo s kolonizacijo prostora (Runions et al. 2007: točke privlaka
# v notranjosti organa, vsaka vleče najbližje vozlišče drevesa, točka ugasne, ko jo veja doseže), polmeri po Murrayjevem
# zakonu (r_starš^e = Σ r_otrok^e), cevi so zaprta telesa (začetek skrit v starševski cevi, konec zaobljen).
# Uporaba: izvozi-organe.py (»dodaj«: pljucna_drevesa, jetra_geometrija.jetra_deli). Ponovljivo (seme).
import bpy, bmesh, math, random, re
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from mathutils.kdtree import KDTree

_SMERI = [Vector((0.0123, 0.0071, 1)).normalized(), Vector((1, 0.0211, 0.0137)).normalized(), Vector((0.0171, 1, 0.0093)).normalized()]


class Notranjost:
    """Notranjost unije zaprtih mrež: znotraj(p), globina(p) (m pod površino, negativna zunaj)."""

    def __init__(self, mreze):
        self.bvh = []
        bm = bmesh.new()
        for me in mreze:
            bm.from_mesh(me)
            b1 = bmesh.new(); b1.from_mesh(me); self.bvh.append(BVHTree.FromBMesh(b1)); b1.free()
        self.vse = BVHTree.FromBMesh(bm)
        self.lo = Vector([min(v.co[i] for v in bm.verts) for i in range(3)])
        self.hi = Vector([max(v.co[i] for v in bm.verts) for i in range(3)])
        bm.free()

    @staticmethod
    def _parnost(t, p, d):
        n = 0; q = p.copy()
        for _ in range(64):
            h = t.ray_cast(q, d)
            if h[0] is None:
                break
            n += 1; q = h[0] + d * 1e-5
        return n % 2 == 1

    def v_mrezi(self, i, p):
        return sum(self._parnost(self.bvh[i], p, d) for d in _SMERI) >= 2

    def kje(self, p):
        """Indeks mreže, v kateri je točka (−1: zunaj)."""
        for i in range(len(self.bvh)):
            if self.v_mrezi(i, p):
                return i
        return -1

    def znotraj(self, p):
        return self.kje(p) >= 0

    def ob_spranji(self, p, d=0.004):
        """Točka je v špranji med dvema mrežama ali tik ob njej (dve mreži skoraj enako blizu)."""
        ds = sorted(b.find_nearest(p)[3] for b in self.bvh)
        return len(ds) > 1 and ds[1] - ds[0] < d and ds[0] < 3 * d

    def globina(self, p):
        d = self.vse.find_nearest(p)[3]
        return d if self.znotraj(p) else -d


def privlaki(notr, razmik, rob, rnd, sprejmi=None):
    """Točke privlaka v notranjosti (vsaj »rob« pod površino), približno ena na razmik³ (drhteča mreža)."""
    t = []
    n = [max(1, int((notr.hi[i] - notr.lo[i]) / razmik)) for i in range(3)]
    for i in range(n[0] + 1):
        for j in range(n[1] + 1):
            for k in range(n[2] + 1):
                p = Vector((notr.lo.x + (i + rnd.uniform(-0.45, 0.45)) * razmik, notr.lo.y + (j + rnd.uniform(-0.45, 0.45)) * razmik,
                            notr.lo.z + (k + rnd.uniform(-0.45, 0.45)) * razmik))
                if notr.vse.find_nearest(p)[3] >= rob and notr.znotraj(p) and (sprejmi is None or sprejmi(p)):
                    t.append(p)
    return t


def rasti(vozli, tocke, korak, vpliv, ubij, dovoli, najvec=400, vztrajnost=0.35):
    """Kolonizacija prostora. vozli: [dict(p, stars (indeks ali −1), r (stalni polmer ali None), rast (sme pognati))];
    seznam se dopolni z novimi vozlišči (r None). dovoli(a, b): ali sme veja od a do b (ostane v organu)."""
    ziva = list(tocke)
    slepe = set()
    for _ in range(najvec):
        if not ziva:
            break
        kd = KDTree(len(vozli))
        for i, v in enumerate(vozli):
            kd.insert(v["p"], i)
        kd.balance()
        vlek = {}
        for a in ziva:
            for co, i, d in kd.find_n(a, 4):
                if d <= vpliv and vozli[i].get("rast", True) and i not in slepe:
                    vlek.setdefault(i, []).append(a); break
        if not vlek:
            break
        novo = 0
        for i, sez in vlek.items():
            v = vozli[i]
            d = sum(((a - v["p"]).normalized() for a in sez), Vector())
            if v["stars"] >= 0 and v.get("r") is None:
                d += (v["p"] - vozli[v["stars"]]["p"]).normalized() * vztrajnost * len(sez)
            if d.length < 1e-6:
                slepe.add(i); continue
            q = v["p"] + d.normalized() * korak
            if any((vozli[o]["p"] - q).length < korak * 0.45 for o in v.setdefault("otroci", [])) or not dovoli(v["p"], q):
                slepe.add(i); continue
            vozli.append(dict(p=q, stars=i, r=None)); v["otroci"].append(len(vozli) - 1); novo += 1
        kd = KDTree(len(vozli))
        for i, v in enumerate(vozli):
            kd.insert(v["p"], i)
        kd.balance()
        ziva = [a for a in ziva if kd.find(a)[2] > ubij]
        if not novo:
            break
    return vozli


def polmeri(vozli, r_list, e=2.7, delez=0.8):
    """Murray: polmer novih vozlišč od listov proti korenu; ob stiku s stalnim vozliščem največ delez · njegov polmer."""
    otroci = {}
    for i, v in enumerate(vozli):
        if v["stars"] >= 0:
            otroci.setdefault(v["stars"], []).append(i)
    listi = [0] * len(vozli)
    for i in range(len(vozli) - 1, -1, -1):  # otroci imajo vedno večji indeks od starša
        v = vozli[i]
        if v.get("r") is not None and not v.get("nov"):
            continue
        ot = [o for o in otroci.get(i, [])]
        if not ot:
            v["r"] = r_list; listi[i] = 1
        else:
            v["r"] = sum(vozli[o]["r"] ** e for o in ot) ** (1 / e); listi[i] = sum(listi[o] for o in ot)
        v["nov"] = True
    # omejitev ob stalnem deblu: veja ne sme biti debelejša od debla
    for i, v in enumerate(vozli):
        if v.get("nov") and v["stars"] >= 0 and not vozli[v["stars"]].get("nov"):
            m = vozli[v["stars"]]["r"] * delez
            if v["r"] > m:
                f = m / v["r"]
                sklad = [i]
                while sklad:
                    j = sklad.pop(); vozli[j]["r"] *= f ** 0.6 if j != i else f
                    sklad += otroci.get(j, [])
    for i, v in enumerate(vozli):
        v["listi"] = listi[i]
    return otroci


def veje(vozli, otroci, najmanj_listov=1):
    """Nove veje kot lomljenke [(P, R)]: pri razcepu najdebelejši otrok nadaljuje vejo, drugi začnejo svojo v starševi osi."""
    izhod = []
    zacetki = [i for i, v in enumerate(vozli) if v.get("nov") and v["stars"] >= 0 and not vozli[v["stars"]].get("nov")]
    sklad = [(i, [vozli[vozli[i]["stars"]]["p"]], [min(vozli[i]["r"], vozli[vozli[i]["stars"]]["r"])]) for i in zacetki]
    while sklad:
        i, P, R = sklad.pop()
        while True:
            v = vozli[i]
            if v["listi"] < najmanj_listov:
                break
            P.append(v["p"]); R.append(v["r"])
            ot = sorted((o for o in otroci.get(i, []) if vozli[o]["listi"] >= najmanj_listov), key=lambda o: -vozli[o]["r"])
            if not ot:
                break
            for o in ot[1:]:
                sklad.append((o, [v["p"]], [min(vozli[o]["r"], v["r"])]))
            i = ot[0]
        if len(P) >= 2:
            izhod.append((P, R))
    return izhod


def zgladi(P, R, krat=4):
    """Notranje točke proti povprečju sosedov (konca ostaneta), nato vmesne točke (Chaikin brez krajšanja)."""
    P = [p.copy() for p in P]
    for _ in range(krat):
        Q = [P[0]] + [(P[i - 1] + P[i] * 2 + P[i + 1]) / 4 for i in range(1, len(P) - 1)] + [P[-1]]
        P = Q
    return P, list(R)


def _okvirji(P):
    n = len(P)
    T = [(P[min(i + 1, n - 1)] - P[max(i - 1, 0)]).normalized() for i in range(n)]
    ref = T[0].orthogonal().normalized(); out = []
    for t in T:
        ref = ref - t * ref.dot(t)
        ref = ref.normalized() if ref.length > 1e-9 else t.orthogonal().normalized()
        out.append((t, ref, t.cross(ref)))
    return out


def cev(bm, P, R, seg, kupola=True, zacetek_kupola=False, stena=0.0, casa=None):
    """Zaprta cev v bmesh. stena > 0: votla cev s steno (notranja ploskev z normalami v svetlino, na koncih obroč stene)."""
    okv = _okvirji(P)
    def obroc(p, r, o):
        return [bm.verts.new(p + (o[1] * math.cos(2 * math.pi * k / seg) + o[2] * math.sin(2 * math.pi * k / seg)) * r) for k in range(seg)]
    zun = [obroc(p, r, o) for p, r, o in zip(P, R, okv)]
    for i in range(len(zun) - 1):
        for k in range(seg):
            bm.faces.new([zun[i][k], zun[i][(k + 1) % seg], zun[i + 1][(k + 1) % seg], zun[i + 1][k]])
    if stena > 0:
        nt = [obroc(p, max(r - stena, r * 0.6), o) for p, r, o in zip(P, R, okv)]
        for i in range(len(nt) - 1):
            for k in range(seg):
                bm.faces.new([nt[i + 1][k], nt[i + 1][(k + 1) % seg], nt[i][(k + 1) % seg], nt[i][k]])
        for i, smer in ((0, -1), (len(P) - 1, 1)):
            for k in range(seg):
                q = [zun[i][k], zun[i][(k + 1) % seg], nt[i][(k + 1) % seg], nt[i][k]]
                bm.faces.new(q[::-1] if smer < 0 else q)
        return
    for i, smer, kup in ((0, -1, zacetek_kupola), (len(P) - 1, 1, kupola)):
        t = okv[i][0]
        if i == 0 and casa:  # prerezan začetek žile: obroč stene in slepa svetlina (čaša globine casa[1])
            w, glob = casa
            n0 = obroc(P[0], R[0] - w, okv[0]); n1 = obroc(P[0] + t * glob, (R[0] - w) * 0.9, okv[0]); dno = bm.verts.new(P[0] + t * glob * 1.05)
            for k in range(seg):
                k1 = (k + 1) % seg
                bm.faces.new([zun[0][k1], zun[0][k], n0[k], n0[k1]])
                bm.faces.new([n0[k1], n0[k], n1[k], n1[k1]])
                bm.faces.new([n1[k1], n1[k], dno])
            continue
        if kup:  # nizka kupola: vmesni obroč in vrh
            vm = obroc(P[i] + t * smer * R[i] * 0.45, R[i] * 0.72, okv[i])
            for k in range(seg):
                q = [zun[i][k], zun[i][(k + 1) % seg], vm[(k + 1) % seg], vm[k]]
                bm.faces.new(q[::-1] if smer < 0 else q)
            rob_ = vm; vrh = bm.verts.new(P[i] + t * smer * R[i] * 0.75)
        else:
            rob_ = zun[i]; vrh = bm.verts.new(P[i])
        for k in range(seg):
            q = [rob_[k], rob_[(k + 1) % seg], vrh]
            bm.faces.new(q[::-1] if smer < 0 else q)


def st_stranic(r, telefon=False):
    if telefon:
        return 8 if r > 0.005 else 6 if r > 0.003 else 5 if r > 0.0015 else 4
    return 16 if r > 0.006 else 12 if r > 0.003 else 8 if r > 0.0014 else 6


def redci(P, R, korak):
    """Lomljenko razredči: točka ostane, če je od zadnje ohranjene dlje kot korak(r) ali se smer zasuka > ~14°."""
    oP, oR = [P[0]], [R[0]]
    for i in range(1, len(P) - 1):
        a = (P[i] - oP[-1]); b = (P[i + 1] - P[i])
        if a.length >= korak(R[i]) or (a.length > 1e-6 and b.length > 1e-6 and a.normalized().dot(b.normalized()) < 0.97 and a.length > korak(R[i]) * 0.4):
            oP.append(P[i]); oR.append(R[i])
    oP.append(P[-1]); oR.append(R[-1])
    return oP, oR


def mreza_vej(seznam, ime, telefon=False, stena=None, kupole=(False, True)):
    """Lomljenke [(P, R)] → ena mreža zaprtih cevi. stena(r) → debelina stene (0 = polna cev) za vejo s polmerom r."""
    bm = bmesh.new()
    for P, R in seznam:
        P, R = zgladi(P, R, 10 if max(R) < 0.0015 else 4)  # tanke vejice bolj: kolonizacija jih zvija
        P, R = redci(P, R, (lambda r: max(0.009, 5.0 * r)) if telefon else (lambda r: max(0.0035, 1.8 * r)))
        if len(P) < 2 or (P[-1] - P[0]).length < 1e-5:
            continue
        r = max(R)
        cev(bm, P, R, st_stranic(r, telefon), kupola=kupole[1], zacetek_kupola=kupole[0], stena=stena(r) if stena else 0.0)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(ime); bm.to_mesh(me); bm.free()
    for p in me.polygons:
        p.use_smooth = True
    return me


def tris(me):
    return sum(len(p.vertices) - 2 for p in me.polygons)


def poenostavi(me, delez, tmp):
    """Kopija mreže, poenostavljena na delež trikotnikov (telefon)."""
    m = me.copy()
    bm = bmesh.new(); bm.from_mesh(m); bmesh.ops.triangulate(bm, faces=bm.faces); bm.to_mesh(m); bm.free()
    o = bpy.data.objects.new("_p", m); tmp.objects.link(o)
    mod = o.modifiers.new("dec", "DECIMATE"); mod.ratio = delez
    m2 = bpy.data.meshes.new_from_object(o.evaluated_get(bpy.context.evaluated_depsgraph_get()))
    bpy.data.objects.remove(o)
    for p in m2.polygons:
        p.use_smooth = True
    return m2


def zapri_luknje(me, stranic=400):
    """Zapre luknje v mreži (odprti robovi režnjev pljuč ob hilusu), da je telo zaprto."""
    bm = bmesh.new(); bm.from_mesh(me)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-6)
    rob = [e for e in bm.edges if len(e.link_faces) == 1]
    if rob:
        bmesh.ops.holes_fill(bm, edges=rob, sides=stranic)
        bmesh.ops.triangulate(bm, faces=[f for f in bm.faces if len(f.verts) > 4])
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    ostalo = sum(1 for e in bm.edges if len(e.link_faces) == 1)
    bm.to_mesh(me); bm.free()
    return len(rob), ostalo


CT_REZNJI = {"Superior lobe of right lung": "lung_upper_lobe_right", "Middle lobe of right lung": "lung_middle_lobe_right",
             "Inferior lobe of right lung": "lung_lower_lobe_right", "Superior lobe of left lung": "lung_upper_lobe_left",
             "Inferior lobe of left lung": "lung_lower_lobe_left"}


def taubin_bm(bm, krogi=30, lam=0.5, mu=-0.53):
    """Taubinovo glajenje (λ|μ) oglišč bmesh: zgladi stopnice brez krčenja prostornine."""
    import numpy as np
    bm.verts.ensure_lookup_table(); bm.verts.index_update()
    P = np.array([v.co[:] for v in bm.verts], dtype=np.float64)
    E = np.array([(e.verts[0].index, e.verts[1].index) for e in bm.edges], dtype=np.int64)
    if not len(E):
        return
    st = np.maximum(np.bincount(E.ravel(), minlength=len(P)), 1).astype(np.float64)[:, None]
    for _ in range(krogi):
        for k in (lam, mu):
            S = np.zeros_like(P)
            np.add.at(S, E[:, 0], P[E[:, 1]]); np.add.at(S, E[:, 1], P[E[:, 0]])
            P += k * (S / st - P)
    for v, q in zip(bm.verts, P):
        v.co = q


def oblika_kril(P, stran, zl, zh, hil, o):
    """Krog n5 (ocena n4: »boxy silhouette, slab bases, no cardiac notch«): gladka preslikava točk enega pljučnega krila
    (N×3, Blender: x levo bolnika, y nazaj, z gor) v učbeniško obliko. Ista preslikava velja za režnje, krilo in
    središčnice vej, zato drevesa ostanejo v režnjih. zl, zh: okvir krila; hil: hilus (tam je premik 0, da se veje
    ujemajo z bronhiji in žilami medpljučja). o: zaobli (kvadrat → krog v vodoravnem prerezu, lateralno), zoži (delež
    zožitve vrha), kupola / rob (m: dvig sredine baze / spust oboda → vbočena baza z ostrim spodnjim robom), srce (m:
    srčna vtisnina na medialni ploskvi spredaj spodaj; levo zareza z lingulo pod njo)."""
    import numpy as np
    P = np.asarray(P, float); Q = P.copy()
    zl = np.asarray(zl, float); zh = np.asarray(zh, float)
    sg = 1.0 if stran == "left" else -1.0
    c = 0.5 * (zl + zh); h = 0.5 * (zh - zl)
    ss = lambda a, b, x: (lambda t: t * t * (3 - 2 * t))(np.clip((x - a) / (b - a), 0.0, 1.0))
    t = (P[:, 2] - zl[2]) / (zh[2] - zl[2])
    u = (P[:, 0] - c[0]) / h[0]; v = (P[:, 1] - c[1]) / h[1]
    uc, vc = np.clip(u, -1, 1), np.clip(v, -1, 1)
    # (a) zaobljene rebrne ploskve: vogali vodoravnega prereza navznoter (medialna stran ostane bolj ravna)
    k = o.get("zaobli", 0.7)
    ku = np.where(sg * u > 0, k, 0.3 * k)
    u2 = u * np.sqrt(1 - ku * vc * vc / 2); v2 = v * np.sqrt(1 - k * uc * uc / 2)
    # (b) stožec: nad 40 % višine se prerez oži proti vrhu, vrh se pomakne medialno in nazaj
    w = ss(o.get("zoziOd", 0.4), 1.0, t) ** 1.3
    sk = 1 - o.get("zozi", 0.34) * w
    u2 = u2 * sk - sg * 0.22 * w; v2 = v2 * sk + 0.10 * w
    Q[:, 0] = c[0] + u2 * h[0]; Q[:, 1] = c[1] + v2 * h[1]
    # (c) baza: sredina gor, obod dol (kupola prepone, oster spodnji rob)
    r2 = np.clip(uc * uc + vc * vc, 0, 1)
    wz = np.where(t < 0.5, (1 - np.clip(t, 0, 0.5) / 0.5) ** 2, 0.0)
    Q[:, 2] += (o.get("kupola", 0.022) * (1 - r2) - o.get("rob", 0.010) * r2 * r2) * wz
    # (d) srčna vtisnina / zareza: medialna ploskev spredaj se med 12 % in 50 % višine umakne lateralno
    N = o.get("srce", (0.028, 0.010))[0 if stran == "left" else 1]
    Q[:, 0] += sg * N * np.exp(-((t - o.get("srceT", 0.30)) / 0.15) ** 2) * np.exp(-((vc + 1) / 0.95) ** 2) * np.exp(-((sg * uc + 1) / 0.75) ** 2)
    # (e) n6: lingula – pod srčno zarezo se sprednji medialni rob levega krila podaljša medialno v jeziček
    if stran == "left" and o.get("lingula", 0) > 0:
        Q[:, 0] -= sg * o["lingula"] * np.exp(-((t - o.get("lingulaT", 0.13)) / 0.06) ** 2) * np.exp(-((vc + 1) / 0.5) ** 2) * np.exp(-((sg * uc + 1) / 0.6) ** 2)
    # (f) n6 (ocena n5: »hard ledge at base«): spodnjih 22 % višine se prerez proti spodnjemu robu rahlo zoži (zaobljen
    # rebrno-preponski rob namesto police)
    bz = o.get("bazaZozi", 0)
    if bz:
        f = 1 - bz * (1 - ss(0.0, 0.22, t)) ** 1.5
        Q[:, 0] = c[0] + (Q[:, 0] - c[0]) * f; Q[:, 1] = c[1] + (Q[:, 1] - c[1]) * f
    if hil is not None:
        g = ss(0.012, 0.05, np.linalg.norm(P - np.asarray(hil, float), axis=1))
        Q = P + (Q - P) * g[:, None]
    return Q


def _rezenj_iz_ct(rezn, cfg, tmp, oblika=None):
    """Režnje Z-Anatomy zamenja s površinami režnjev iz CT (pljuca-ct.py). Vsako krilo posebej: afina preslikava (merilo po
    oseh in premik) okvirja CT kril v okvir kril Z-Anatomy – bronhiji in žile Z-Anatomy ostanejo v svojih krilih."""
    import os
    import numpy as np
    pot = os.path.join(cfg.get("_ct_mapa") or "", cfg.get("ct_rezenj") or "")
    if not cfg.get("ct_rezenj") or not os.path.isfile(pot):
        print("[organi] pljuča: režnji Z-Anatomy (ni datoteke CT)")
        return []
    d = np.load(pot)
    cilj = cfg.get("drevesa", {}).get("rezenjTrikotnikov", 16000)
    krila = []
    for stran in ("right", "left"):
        moji = [r for r in rezn if stran in r[0] and r[0] in CT_REZNJI]
        if not moji:
            continue
        Z = np.array([list(v.co) for r in moji for v in r[1].vertices])
        C = np.concatenate([d[CT_REZNJI[r[0]] + "_v"] for r in moji])
        zl, zh, cl, ch = Z.min(0), Z.max(0), C.min(0), C.max(0)
        k = (zh - zl) / (ch - cl)
        if oblika is not None:
            oblika["okvir"][stran] = (zl.copy(), zh.copy())
        ob = (lambda q: oblika_kril(q, stran, zl, zh, oblika["hil"].get(stran), oblika["nast"])) if oblika is not None else (lambda q: q)
        for r in moji:
            v = ob((d[CT_REZNJI[r[0]] + "_v"] - cl) * k + zl)
            me = bpy.data.meshes.new(r[0] + " ct"); me.from_pydata(v.tolist(), [], d[CT_REZNJI[r[0]] + "_f"].tolist())
            bm = bmesh.new(); bm.from_mesh(me)
            # stopnice rezin CT in nagubane baze (krog 3: »baze nagubane namesto gladke kupole prepone«): Taubinovo glajenje
            # brez krčenja (prej 6 krogov Laplacea)
            taubin_bm(bm, cfg.get("drevesa", {}).get("ctGlajenje", 30))
            bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
            bm.to_mesh(me); bm.free()
            r[1] = poenostavi(me, min(1.0, cilj / max(tris(me), 1)), tmp)
        if "lung_" + stran + "_v" in d.files:
            v = ob((d["lung_" + stran + "_v"] - cl) * k + zl)
            me = bpy.data.meshes.new("krilo " + stran); me.from_pydata(v.tolist(), [], d["lung_" + stran + "_f"].tolist())
            krila.append(poenostavi(me, min(1.0, 30000 / max(tris(me), 1)), tmp))
        print(f"[organi] pljuča {stran}: režnji iz CT ({d['osebek']}), merilo {[round(float(x), 3) for x in k]}")
    return krila


def pljucna_drevesa(osnovni, cfg, tmp):
    """Pljuča: režnji postanejo zaprta telesa; iz segmentnih vej Z-Anatomy zrastejo subsegmentne veje bronhijev, pljučnih
    arterij in ven do režnjičev (3 drevesa, vsako svoje točke privlaka). Telefon: iste veje brez najtanjših."""
    rezn = [r for r in osnovni if r[2] == "pljuca"]
    tel = cfg.setdefault("_telefon", {})
    nast = cfg.get("drevesa", {})
    # n5: učbeniška oblika kril (drevesa.oblika): ista preslikava za režnje, krilo in središčnice vej v pljučih
    oblika = None
    if nast.get("oblika") is not None:
        kor0 = {"left": [], "right": []}
        for r in osnovni:
            if r[2].endswith("-v"):
                for P, R in cfg["_krivulje"].get(r[0], []):
                    k0 = min((Vector(P[0]), Vector(P[-1])), key=lambda q: abs(q.x))
                    kor0["left" if k0.x > 0 else "right"].append(k0)
        oblika = dict(nast=nast["oblika"], okvir={}, hil={z: (tuple(sum(t, Vector()) / len(t)) if t else None) for z, t in kor0.items()})
    krila = _rezenj_iz_ct(rezn, cfg, tmp, oblika)
    if oblika is not None and oblika["okvir"]:
        import numpy as np
        n_k = 0
        for r in osnovni:
            if r[2].endswith("-v"):
                nove = []
                for P, R in cfg["_krivulje"].get(r[0], []):
                    P = np.array([tuple(p) for p in P], float)
                    stran = "left" if P[:, 0].mean() > 0 else "right"
                    if stran in oblika["okvir"]:
                        P = oblika_kril(P, stran, *oblika["okvir"][stran], oblika["hil"].get(stran), oblika["nast"]); n_k += 1
                    nove.append(([tuple(p) for p in P], R))
                if nove:
                    cfg["_krivulje"][r[0]] = nove
        print(f"[organi] pljuča: oblika kril {oblika['nast']}, preslikanih krivulj vej {n_k}")
    for r in rezn:
        n, ost = zapri_luknje(r[1])
        # režnji po SUBSURF ob špranjah segajo v soseda: oglišča malo navznoter po normali (prej cfg »skrci«)
        nor = [v.normal.copy() for v in r[1].vertices]
        for v, nn in zip(r[1].vertices, nor):
            v.co -= nn * nast.get("skrci", 0.0012)
        r[1].update()
        tel[r[0]] = poenostavi(r[1], nast.get("rezenjTelefon", 0.36), tmp)
        r[4] = "(lastno) " + r[4]
        print(f"[organi] {r[0]}: zaprtih robov {n}, ostane {ost}; trikotnikov {tris(r[1])} / {tris(tel[r[0]])}")
    notr = Notranjost([r[1] for r in rezn])
    # krilo: cela pljuča brez špranj (CT). Veje Z-Anatomy niso iz istega telesa kot režnji in tečejo tudi čez špranje, zato
    # se »v pljučih« presoja po krilu; brez CT po režnjih
    krilo = Notranjost(krila) if len(krila) == 2 else notr
    rob = 0.004
    def dovoli(a, b):
        if notr.vse.find_nearest(b)[3] < rob:
            return False
        i = notr.kje(b)
        return i >= 0 and notr.v_mrezi(i, a.lerp(b, 0.5)) and notr.v_mrezi(i, a)
    # Veje Z-Anatomy v pljučih (tkiva »…-v«): cevi na novo iz središčnic krivulj (polne, 6–12 stranic; mreža krivulje ima
    # 28 stranic in bi jo poenostavitev na telefonu zmečkala), konec odrezan, kjer veja zapusti reženj.
    def v_reznju(p, r):
        return krilo.vse.find_nearest(p)[3] >= r + 0.0035 and krilo.znotraj(p)
    stalne = {}
    # hilus vsakega krila: povprečje korenin vej (konec, ki je bližje sredini); zunaj režnjev sme veja teči samo tam
    kor = {1: [], -1: []}
    for r in osnovni:
        if r[2].endswith("-v"):
            for P, R in cfg["_krivulje"].get(r[0], []):
                k0 = min((Vector(P[0]), Vector(P[-1])), key=lambda q: abs(q.x))
                kor[1 if k0.x > 0 else -1].append(k0)
    hil = {z: (sum(t, Vector()) / len(t) if t else None) for z, t in kor.items()}
    def ob_hilusu(p):
        h = hil[1 if p.x > 0 else -1]
        return h is not None and (p - h).length < nast.get("hilusPolmer", 0.03)
    for r in osnovni:
        if not r[2].endswith("-v"):
            continue
        sez = []
        for P, R in cfg["_krivulje"].get(r[0], []):
            P = [Vector(p) for p in P]; R = [max(x, 0.0007) for x in R]
            if abs(P[0].x) > abs(P[-1].x):
                P.reverse(); R.reverse()
            # od korenine do prve točke, ki je zunaj režnjev in ni ob hilusu (veja bi štrlela skozi plevro)
            zun = next((i for i, p in enumerate(P) if not ob_hilusu(p) and (not krilo.znotraj(p) or (krilo.vse.find_nearest(p)[3] < 0.008 and not notr.znotraj(p)))), len(P))  # tudi špranja tik pod plevro
            P, R = P[:zun], R[:zun]
            if len(P) < 2:
                continue
            ok = [v_reznju(p, x) for p, x in zip(P, R)]
            if any(ok):  # distalni konec zunaj režnja odpade (korenina je pri hilusu: bližje središču obeh kril)
                if abs(P[0].x) > abs(P[-1].x):
                    P.reverse(); R.reverse(); ok.reverse()
                prvi = next(i for i, o in enumerate(ok) if o)
                # začetek zunaj režnja ostane samo, če vodi proti sredini (hilus); sicer je to konec, ki štrli iz režnja
                if prvi and any(abs(p.x) > abs(P[prvi].x) + 0.002 for p in P[:prvi]):
                    P, R, ok = P[prvi:], R[prvi:], ok[prvi:]; prvi = 0
                zadnji = next((i for i in range(prvi, len(ok)) if not ok[i]), len(ok)) - 1  # do prvega izhoda iz režnja
                P, R, ok = P[:zadnji + 1], R[:zadnji + 1], ok[:zadnji + 1]
            elif max(R) < 0.0022 and sum(abs(p.x) for p in P) / len(P) > 0.055:
                continue  # tanka veja tik pod plevro, daleč od hilusa: v prerezu bi lebdela kot črtica
            else:
                # veja brez globoke točke (ves čas tik pod plevro ali ob hilusu): ostane do prve točke, kjer bi cev pogledala
                # skozi plevro (globina pod površino krila manjša od polmera + 0,8 mm), razen ob hilusu
                plitvo = next((i for i, (p, x) in enumerate(zip(P, R)) if not ob_hilusu(p) and krilo.vse.find_nearest(p)[3] < x + 0.0008), len(P))
                P, R, ok = P[:plitvo], R[:plitvo], ok[:plitvo]
                if len(P) < 2:
                    continue
            dolz = sum((b_ - a_).length for a_, b_ in zip(P, P[1:]))
            if dolz < 0.008 and max(R) < 0.002:
                continue  # kratek ostanek po obrezovanju
            if len(P) >= 2:
                # konec veje se stanjša (zadnja tretjina na 55 %): veja se nadaljuje v drobnejše, ne konča se kot top krn
                L = [0.0]
                for a_, b_ in zip(P, P[1:]):
                    L.append(L[-1] + (b_ - a_).length)
                R = [x * (1 - 0.45 * max(0.0, (l / max(L[-1], 1e-9) - 0.65) / 0.35)) for x, l in zip(R, L)]
                sez.append((P, R, ok))
        if not sez:
            continue
        stalne[r[0]] = (r[2], sez)
        gol = [(P, R) for P, R, _ in sez]
        r[1] = mreza_vej(gol, r[0], kupole=(True, True)); tel[r[0]] = mreza_vej(gol, r[0] + " t", telefon=True, kupole=(True, True))
        r[4] = "(lastno) " + r[4]
    for r in osnovni:
        if r[2] in ("dihalna", "pljucna-arterija", "pljucna-vena") and not r[0].startswith("Trachea"):
            bm = bmesh.new(); bm.from_mesh(r[1])
            h_ = lambda q: hil[1 if q.x > 0 else -1]
            # zunaj kril in bolj lateralno ali precej bolj zadaj od hilusa (medpljučje s sapnicama ostane)
            proc = [v for v in bm.verts if h_(v.co) is not None and (abs(v.co.x) > abs(h_(v.co).x) + 0.005 or v.co.y > h_(v.co).y + 0.025) and abs(v.co.x) > 0.015
                    and not ob_hilusu(v.co) and not krilo.znotraj(v.co)]
            if proc:
                bmesh.ops.delete(bm, geom=proc, context="VERTS")
                rob_ = [e for e in bm.edges if len(e.link_faces) == 1]
                if rob_:
                    bmesh.ops.holes_fill(bm, edges=rob_, sides=0)
                bmesh.ops.triangulate(bm, faces=bm.faces)
                bm.to_mesh(r[1]); r[1].update()
                print(f"[organi] {r[0]}: odrezanih {len(proc)} oglišč zunaj režnjev")
            bm.free()
    print(f"[organi] veje v pljučih iz središčnic: {len(stalne)} delov, trikotnikov {sum(tris(r[1]) for r in osnovni if r[0] in stalne)} / {sum(tris(tel[i]) for i in stalne)}")
    izhod = []
    for seme, tkivo, del_, ime, r_list in ((11, "dihalna-v", "bronhiji", "Evklid subsegmental bronchi (lastno)", 0.00065),
                                           (23, "pljucna-arterija-v", "pljucne-arterije", "Evklid subsegmental pulmonary arteries (lastno)", 0.0006),
                                           (37, "pljucna-vena-v", "pljucne-vene", "Evklid subsegmental pulmonary veins (lastno)", 0.0006)):
        rnd = random.Random(seme)
        vozli = []
        for ime_s, (tk_s, sez) in stalne.items():
            if tk_s != tkivo:
                continue
            for P, R, ok in sez:
                pred = -1
                for k in range(0, len(P), 2):
                    if not ok[k]:
                        pred = -1; continue
                    # nove veje poženejo samo iz konca segmentne veje (ne iz vsakega vozlišča: ščetina)
                    vozli.append(dict(p=P[k], stars=pred, r=max(R[k], 0.0012), rast=False)); pred = len(vozli) - 1
                if pred >= 0:
                    vozli[pred]["rast"] = True
        n0 = len(vozli)
        if not n0 or not nast.get("veje"):
            continue
        tocke = privlaki(notr, nast.get("razmik", 0.017), rob + 0.002, rnd)
        rasti(vozli, tocke, nast.get("korak", 0.005), nast.get("vpliv", 0.045), nast.get("ubij", 0.008), dovoli, vztrajnost=0.9)
        ot = polmeri(vozli, r_list, e=2.4, delez=0.7)
        v_r = veje(vozli, ot, 1); v_t = veje(vozli, ot, nast.get("telefonListi", 3))
        me = mreza_vej(v_r, ime); me_t = mreza_vej(v_t, ime + " t", telefon=True)
        tel[ime] = me_t
        print(f"[organi] {ime}: {n0} stalnih, {len(vozli) - n0} novih vozlišč, {len(tocke)} točk, vej {len(v_r)} / {len(v_t)}, trikotnikov {tris(me)} / {tris(me_t)}")
        izhod.append([ime, me, tkivo, del_, ime + " / Evklid"])
    # n6 (ocena n5: »horizontal pipe + hanging stub«): pljučno deblo Z-Anatomy je odrezano tik pod razcepiščem, od spredaj
    # je bilo videti kot krn. Podaljšamo ga navzdol in naprej proti izhodišču iz desnega prekata (debloDolzina m): od spredaj
    # se vidi žila, ki se dviga izpod loka in se razcepi v desno in levo pljučno arterijo.
    dz = nast.get("debloDolzina", 0)
    deblo = next((r for r in osnovni if r[0].startswith("Pulmonary trunk")), None)
    if dz and deblo is not None:
        import numpy as np
        V = np.array([list(v.co) for v in deblo[1].vertices])
        c = V.mean(0); os_ = np.linalg.svd(V - c, full_matrices=False)[2][0]
        t = (V - c) @ os_
        if V[t < np.quantile(t, 0.1)][:, 2].mean() > V[t > np.quantile(t, 0.9)][:, 2].mean():
            os_ = -os_; t = -t  # os kaže navzgor, proti razcepišču
        sp = V[t < np.quantile(t, 0.12)]; a = sp.mean(0)
        r = float(np.linalg.norm((sp - a) - np.outer((sp - a) @ os_, os_), axis=1).mean())
        P = [a + os_ * 0.006]; n = 10
        for i in range(n):
            u = (i + 0.5) / n
            d = (1 - u) * (-os_) + u * np.array([0.0, -0.25, -1.0]); d /= np.linalg.norm(d)
            P.append(P[-1] + d * (dz + 0.006) / n)
        P = [Vector(q) for q in P]; R = [r * (1.0 + 0.14 * i / n) for i in range(n + 1)]
        for t_ in (False, True):
            bm = bmesh.new(); cev(bm, P, R, 12 if t_ else 24, kupola=True)
            bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
            me = bpy.data.meshes.new("deblo"); bm.to_mesh(me); bm.free()
            for q in me.polygons: q.use_smooth = True
            if t_:
                tel["Pulmonary trunk (lastno)"] = me
            else:
                izhod.append(["Pulmonary trunk (lastno)", me, deblo[2], deblo[3], "Pulmonary trunk (lastno) / Evklid"])
        print(f"[organi] pljučno deblo: podaljšek {dz * 1000:.0f} mm, polmer {r * 1000:.1f} mm, začetek {[round(float(x), 3) for x in a]}")
    return izhod


def zlij_cevi(sez, stena, voksel, delez, tmp, ime):
    """Žilno drevo kot ENO votlo telo (krog m4): sez = [(P, R, faktor stene)], prva pot je deblo. Zunanja ploskev je unija
    cevi (voksel remesh), svetlina unija notranjih cevi (obrnjene normale): v razcepišču ni sten vej v svetlini debla
    (ločene votle cevi so bile v rezu preplet obročev). Začetek debla je prerezan (obroč stene in odprta svetlina)."""
    P0 = sez[0][0]; t0 = (P0[1] - P0[0]).normalized(); co = P0[0] + t0 * 0.0004
    casa = 0.0016  # globina slepe svetline na prerezanem koncu debla
    def telo(notranje):
        bm = bmesh.new()
        for k, (P, R, f) in enumerate(sez):
            Rn = [max(r - stena * f, r * 0.5) for r in R] if notranje else R
            Pn = P
            if notranje and k and len(P) > 4:
                Pn, Rn = P[:-2], Rn[:-2]  # svetlina veje se konča pred koncem stene
            if notranje and not k:  # svetlina debla je zaprta votlina: začne se za dnom čaše na prerezanem koncu
                i0 = next(i for i, p in enumerate(P) if (p - co).dot(t0) > casa + 0.0007)
                Pn, Rn = P[i0:], Rn[i0:]
            cev(bm, Pn, Rn, 20, kupola=True, zacetek_kupola=not (notranje and not k))
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
        m = bpy.data.meshes.new("_z"); bm.to_mesh(m); bm.free()
        o = bpy.data.objects.new("_z", m); tmp.objects.link(o)
        mod = o.modifiers.new("r", "REMESH"); mod.mode = "VOXEL"; mod.voxel_size = voksel; mod.adaptivity = 0.0
        m2 = bpy.data.meshes.new_from_object(o.evaluated_get(bpy.context.evaluated_depsgraph_get()))
        bpy.data.objects.remove(o)
        return m2
    bm = bmesh.new()
    for notranje in (False, True):
        b2 = bmesh.new(); b2.from_mesh(telo(notranje))
        bmesh.ops.smooth_vert(b2, verts=b2.verts, factor=0.5, use_axis_x=True, use_axis_y=True, use_axis_z=True)
        if notranje:
            bmesh.ops.reverse_faces(b2, faces=b2.faces)
        else:
            # prerezan konec debla: raven rez, obroč stene in čaša (slepa svetlina) – od zunaj je videti odprta žila,
            # svetlina pa ostane zaprta votlina (obris v ravnini reza ima luknjo: rezPresek jo nariše kot svetlino)
            bmesh.ops.bisect_plane(b2, geom=b2.verts[:] + b2.edges[:] + b2.faces[:], plane_co=co, plane_no=-t0, clear_outer=True)
            rob = [e for e in b2.edges if e.is_boundary]
            r = bmesh.ops.edgeloop_fill(b2, edges=rob)
            pokrov = [f for f in r["faces"]]
            r2 = bmesh.ops.inset_region(b2, faces=pokrov, thickness=stena, depth=0.0, use_even_offset=True)
            for v in {v for f in pokrov for v in f.verts}:
                v.co += t0 * casa
            bmesh.ops.recalc_face_normals(b2, faces=b2.faces)
        m = bpy.data.meshes.new("_z2"); b2.to_mesh(m); b2.free(); bm.from_mesh(m)
    me = bpy.data.meshes.new(ime); bm.to_mesh(me); bm.free()
    me = poenostavi(me, delez, tmp); me.name = ime
    print(f"[organi] {ime}: zlito drevo {len(sez)} cevi, voksel {voksel * 1000:.2f} mm, trikotnikov {tris(me)}")
    return me


def ledvicne_zile(osnovni, cfg, tmp):
    """Ledvična arterija in vena (lastno): Z-Anatomy žili ob ledvici HRA ne segata do hilusa (vena je bila kratek obroč
    v zraku, arterija sploščena). Od spredaj nazaj: vena, arterija, ledvični meh. Vena nastane v sinusu iz treh pritokov,
    arterija se pred hilusom razdeli v sprednjo (tri segmentne veje pred mehom) in zadnjo vejo (za mehom). Medialna konca
    sta prerezana (stena in svetlina)."""
    pap = [sum((v.co for v in me.vertices), Vector()) / len(me.vertices) for ime, me, *_ in osnovni if "papilla" in ime]
    hil = next(me for ime, me, *_ in osnovni if "hilum" in ime)
    hc = sum((v.co for v in hil.vertices), Vector()) / len(hil.vertices)
    pc = sum(pap, Vector()) / len(pap)
    m = hc - pc; m.z *= 0.25; m.normalize()  # medialno, iz ledvice
    gor = Vector((0, 0, 1)); gor = (gor - m * gor.dot(m)).normalized()
    spr = gor.cross(m).normalized()
    if spr.y > 0:
        spr = -spr  # spredaj = −y
    T = lambda a, b, c: hc + m * a + spr * b + gor * c
    def pot(tocke, r0, r1, n=14):
        P = []
        for i in range(len(tocke) - 1):
            P += [tocke[i].lerp(tocke[i + 1], j / n) for j in range(n)]
        P.append(tocke[-1])
        P, _ = zgladi(P, [0] * len(P), 12)
        return P, [r0 + (r1 - r0) * i / (len(P) - 1) for i in range(len(P))]
    nast = cfg.get("zile", {})
    rv, ra = nast.get("vena", 0.0039), nast.get("arterija", 0.0028)
    L = nast.get("dolzina", 0.036)
    if nast.get("v_ravnini", True):
        # krog m3 (ocena: »žili sta cela valja čez rez, brez vej v sinus«): osi debel ležita V ravnini reza (prerez ju
        # razpolovi po dolgem: stena in svetlina), arterija zgoraj, vena pod njo, obe vstopita skozi hilus v maščobo
        # sinusa medialno od meha in se tam potopita za ravnino; medlobarne in ločne
        # žile ob piramidah nariše senčilnik reza (rezPiramide.locne). Debli sta v ravnini tanjši (hilus je ozek).
        yr = sum(p.y for p in pap) / len(pap) + cfg.get("meh_ravnina", 0.0004)
        rv, ra = nast.get("vena_r", 0.0030), nast.get("arterija_r", 0.0022)
        def Tp(a, f, c):  # medialno a, pred ravnino f (negativno: za ravnino), navzgor c
            x = hc + m * a + gor * c; x.y = yr - f; return x
        ca, cv = nast.get("arterija_c", 0.0050), nast.get("vena_c", -0.0020)
        ea, ev = nast.get("arterija_a", -0.0005), nast.get("vena_a", 0.0045)
        # deblo se v maščobi sinusa upogne za ravnino (odprt konec svetline v globino); ločenih cevi vej ni (v rezu so
        # bile preplet obročev sten) – prerezane segmentne veje v maščobi nariše senčilnik (sinus.zile)
        art = [("deblo", pot([Tp(L + 0.003, 0, ca + 0.0015), Tp(L * 0.55, 0, ca + 0.0008), Tp(0.012, 0, ca), Tp(ea + 0.004, 0, ca), Tp(ea, -0.0035, ca + 0.001)], ra, ra * 0.85))]
        vena = [("deblo", pot([Tp(L, 0, cv - 0.0015), Tp(L * 0.55, 0, cv - 0.0008), Tp(0.013, 0, cv), Tp(ev + 0.004, 0, cv), Tp(ev, -0.004, cv - 0.001)], rv, rv * 0.85))]
        if nast.get("veje_sinus", True):
            # krog m4: segmentne veje kot geometrija, zlite z deblom v eno votlo telo (zlij_cevi). Arterija: zgornja
            # veja v ravnini reza v maščobo zgornjega dela sinusa, zadnja veja za mehom (v rezu odprtina v zadnji steni).
            # Vena: spodnji pritok pred mehom (v celem pogledu viden v hilusu, v rezu prerezan v spodnji maščobi sinusa),
            # zgornji pritok za arterijo.
            art = [("deblo", pot([Tp(L + 0.003, 0, ca + 0.0015), Tp(L * 0.55, 0, ca + 0.0008), Tp(0.012, 0, ca), Tp(0.004, 0, ca), Tp(0.0022, 0, ca + 0.0003)], ra, ra * 0.9)),
                   ("veja", pot([Tp(0.0045, 0, ca), Tp(0.0015, 0, ca + 0.0022), Tp(-0.0005, 0, ca + 0.0045), Tp(-0.0022, 0, ca + 0.0063), Tp(-0.003, -0.002, ca + 0.0075)], ra * 0.62, ra * 0.3)),
                   ("veja", pot([Tp(0.0045, 0, ca), Tp(0.002, -0.0015, ca - 0.0006), Tp(0.0, -0.0045, ca - 0.0015), Tp(-0.003, -0.007, ca - 0.0025)], ra * 0.6, ra * 0.4))]
            vena = [("deblo", pot([Tp(L, 0, cv - 0.0015), Tp(L * 0.55, 0, cv - 0.0008), Tp(0.013, 0, cv), Tp(ev + 0.004, 0, cv), Tp(ev + 0.0015, 0, cv)], rv, rv * 0.9)),
                    ("veja", pot([Tp(ev + 0.004, 0, cv), Tp(ev + 0.0015, 0.003, cv - 0.0025), Tp(0.0015, 0.006, cv - 0.006), Tp(-0.0015, 0.004, cv - 0.0095), Tp(-0.003, 0.0, cv - 0.011), Tp(-0.004, -0.003, cv - 0.012)], rv * 0.6, rv * 0.35)),
                    ("veja", pot([Tp(ev + 0.004, 0, cv), Tp(ev + 0.0012, -0.002, cv + 0.0008), Tp(ev - 0.001, -0.0055, cv + 0.0025), Tp(-0.002, -0.008, cv + 0.005)], rv * 0.55, rv * 0.35))]
            cfg["_zile_zlij"] = True
        cfg["_zile_brez_odmika"] = True
    elif nast.get("v_stebre", True):
        # krog m1: žili v prerezu ostaneta celi (ledvica.json: brezReza) kot na učnem modelu: debli ležita pred ravnino
        # reza (vena spredaj, arterija za njo in više), v hilusu zavijeta nazaj in se potopita v maščobo ledvičnega
        # sinusa (konec za ravnino reza; veje v sinusu nariše senčilnik reza kot prerezane žile v maščobi). Prej je
        # ravnina deblo arterije prerezala zunaj ledvice (obroč v zraku), vene v rezu ni bilo; cele veje pred mehom
        # (poskus) so zakrile čašice.
        yr = sum(p.y for p in pap) / len(pap) + cfg.get("meh_ravnina", 0.0004)
        C = pc.lerp(hc, 0.45)
        def Tp(a, f, c):  # medialno a, pred ravnino f, navzgor c
            x = hc + m * a + gor * c; x.y = yr - f; return x
        vena = [("deblo", pot([Tp(L, 0.0080, 0.0075), Tp(L * 0.6, 0.0082, 0.0075), Tp(0.016, 0.0074, 0.0075), Tp(0.008, 0.0030, 0.008), Tp(0.001, -0.0055, 0.0085)], rv, rv * 0.9))]
        art = [("deblo", pot([Tp(L + 0.003, 0.0030, 0.0125), Tp(L * 0.6, 0.0032, 0.012), Tp(0.015, 0.0030, 0.012), Tp(0.008, 0.0005, 0.0125), Tp(0.001, -0.005, 0.013)], ra, ra * 0.9))]
        cfg["_zile_brez_odmika"] = True
    else:
        vena = [("deblo", pot([T(L, 0.0075, -0.001), T(L * 0.55, 0.0078, -0.002), T(0.008, 0.007, -0.001)], rv, rv * 0.94))]
        for dz, rr in ((0.015, 0.6), (0.001, 0.66), (-0.014, 0.6)):
            vena.append(("veja", pot([T(0.012, 0.0072, -0.001), T(0.002, 0.006, dz * 0.55), T(-0.012, 0.004, dz)], rv * rr, rv * rr * 0.75)))
        art = [("deblo", pot([T(L + 0.003, -0.0005, 0.007), T(L * 0.6, 0.0, 0.0065), T(0.017, 0.0005, 0.005)], ra, ra * 0.95))]
        for dz, db in ((0.017, 0.002), (0.004, 0.0025), (-0.012, 0.002)):  # sprednja veja: segmentne arterije pred mehom
            art.append(("veja", pot([T(0.02, 0.0005, 0.0052), T(0.008, 0.0015, 0.004 + dz * 0.4), T(-0.01, db, dz)], ra * 0.62, ra * 0.45)))
        art.append(("veja", pot([T(0.02, 0.0005, 0.0052), T(0.01, -0.005, 0.006), T(-0.008, -0.009, 0.004)], ra * 0.6, ra * 0.42)))  # zadnja veja za mehom
    # žila ne sme v ledvični meh ali sečevod (v peki bi tam nastala črna lisa, v prerezu prekrivanje): točke osi, ki so
    # bližje od polmera + 1,2 mm, se odmaknejo (vena in sprednje veje naprej, zadnja veja arterije nazaj), nato glajenje
    ovire = [r[1] for r in osnovni if r[2] == "meh" or "Ureter" in r[0]]
    if ovire and not cfg.get("_zile_brez_odmika"):
        ovir = Notranjost(ovire)
        def odmakni(P, R, smer):
            P = [p.copy() for p in P]
            for i, (p, r) in enumerate(zip(P, R)):
                for _ in range(12):
                    if not ovir.znotraj(p) and ovir.vse.find_nearest(p)[3] >= r + 0.0012:
                        break
                    p += smer * 0.0004
            Q, _ = zgladi(P, [0] * len(P), 6)
            Q[0] = P[0]; Q[-1] = P[-1]
            return Q, R
        vena = [(v, odmakni(P, R, spr)) for v, (P, R) in vena]
        art = [(v, odmakni(P, R, -spr if i == len(art) - 1 else spr)) for i, (v, (P, R)) in enumerate(art)]
    tel = cfg.setdefault("_telefon", {})
    izhod = []
    for ime, tkivo, del_, sez, stena in (("Renal vein (lastno)", "vena", "ledvicna-vena", vena, 0.0007), ("Renal artery (lastno)", "arterija", "ledvicna-arterija", art, 0.001)):
        for t_ in (False, True):
            if cfg.get("_zile_zlij"):
                me = zlij_cevi([(P, R, 1.0 if vrsta == "deblo" else 0.7) for vrsta, (P, R) in sez], stena, 0.0005 if t_ else 0.0003, 0.3 if t_ else 0.22, tmp, ime + (" t" if t_ else ""))
                if t_:
                    tel[ime] = me
                else:
                    izhod.append([ime, me, tkivo, del_, ime + " / Evklid"])
                continue
            bm = bmesh.new()
            for vrsta, (P, R) in sez:
                P2, R2 = redci(P, R, (lambda r: max(0.004, 2.2 * r)) if t_ else (lambda r: max(0.0015, 0.8 * r)))
                seg = (10 if vrsta == "deblo" else 7) if t_ else (24 if vrsta == "deblo" else 14)
                # votla cev po vsej dolžini: prerez pokaže obroč stene in temno svetlino (rezPresek z luknjaBarva), prerezan
                # medialni konec pa svetlino
                cev(bm, P2, R2, seg, stena=stena if vrsta == "deblo" else stena * 0.7)
            bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
            me = bpy.data.meshes.new(ime + (" t" if t_ else "")); bm.to_mesh(me); bm.free()
            for p in me.polygons:
                p.use_smooth = True
            if t_:
                tel[ime] = me
            else:
                izhod.append([ime, me, tkivo, del_, ime + " / Evklid"])
    osnovni[:] = [r for r in osnovni if not re.search(r"renal (artery|vein)", r[0])]
    return izhod

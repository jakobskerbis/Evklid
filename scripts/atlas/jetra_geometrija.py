# Jetra (lastna geometrija na osnovi Z-Anatomy, CC BY-SA 4.0), klic iz izvozi-organe.py (»dodaj«: jetra_deli):
#  - ena gladka zunanja površina (mreža Z-Anatomy »Liver«) namesto osmih segmentov s šivi; režnji (desni, levi, kvadratni,
#    repasti) so zaprta telesa, izrezana iz nje z natančnimi Boolovimi operacijami (skupne meje so identične), zunanje
#    ploskve dobijo normale cele površine (atribut »norm_lastna«), zato meja med režnji ni vidna;
#  - meje: ravnina srpaste vezi (med segmentoma II/III in IV), Cantliejeva ravnina (IV | V, VIII), kvadratni reženj je del
#    med njima pod ravnino skozi jetrna vrata (na sprednji ploskvi sta kot v atlasih le desni in levi reženj), repasti
#    reženj je segment I Z-Anatomy;
#  - spodnja votla vena (središčnica Z-Anatomy, votla cev s steno), tri jetrne vene z vejami, portalna vena z vejami,
#    ob njej jetrna arterija in žolčni vodi (portalna triada), žolčnikov vod, skupni žolčevod; drevesa: drevesa.py;
#  - srpasta vez (tanka guba potrebušnice v ravnini med levim in desnim režnjem) z oblo vezjo na prostem robu.
# Telefon: ista geometrija z manj trikotniki (cfg['_telefon']).
import bpy, bmesh, math, os, random
import numpy as np
from mathutils import Vector, Matrix
from mathutils.bvhtree import BVHTree
from mathutils.kdtree import KDTree
import drevesa as D


def _obj(me, tmp, ime="_j"):
    o = bpy.data.objects.new(ime, me); tmp.objects.link(o)
    return o


def _ovrednoti(o):
    me = bpy.data.meshes.new_from_object(o.evaluated_get(bpy.context.evaluated_depsgraph_get()))
    return me


def _trikotniki(me):
    bm = bmesh.new(); bm.from_mesh(me)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-7)
    bmesh.ops.triangulate(bm, faces=bm.faces)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me); bm.free(); me.update()
    return me


def _gosti(me, tmp, cilj):
    """Gladka površina s približno »cilj« trikotniki: SUBSURF, dokler jih je premalo, nato poenostavitev."""
    me = _trikotniki(me.copy())
    while D.tris(me) < cilj:
        o = _obj(me, tmp); m = o.modifiers.new("s", "SUBSURF"); m.levels = m.render_levels = 1
        me = _trikotniki(_ovrednoti(o)); bpy.data.objects.remove(o)
    if D.tris(me) > cilj * 1.15:
        o = _obj(me, tmp); m = o.modifiers.new("d", "DECIMATE"); m.ratio = cilj / D.tris(me)
        me = _trikotniki(_ovrednoti(o)); bpy.data.objects.remove(o)
    return me


def _bool(a, b, op, tmp):
    oa, ob = _obj(a, tmp, "_a"), _obj(b, tmp, "_b")
    m = oa.modifiers.new("b", "BOOLEAN"); m.operation = op; m.solver = "EXACT"; m.object = ob
    bpy.context.view_layer.update()
    me = _ovrednoti(oa)
    bpy.data.objects.remove(oa); bpy.data.objects.remove(ob)
    return _trikotniki(me)


def _sivaj(mreze, eps=2e-5):
    """Skupne meje režnjev: enaka oglišča na isti položaj, rob soseda z ogliščem na sredi (stik T) razdeljen v tej točki.
    Brez tega se ob meji pri risanju pokažejo posamezne svetle pike (rasterizacija dveh različnih delitev istega roba)."""
    for krog in range(2):
        for i, me in enumerate(mreze):
            drugi = [v.co.copy() for j, m in enumerate(mreze) if j != i for v in m.vertices]
            kd = KDTree(len(drugi))
            for k, c in enumerate(drugi):
                kd.insert(c, k)
            kd.balance()
            bm = bmesh.new(); bm.from_mesh(me)
            for v in bm.verts:
                co, k, d = kd.find(v.co)
                if d is not None and 0 < d < eps:
                    v.co = co
            lastna = KDTree(len(bm.verts))
            for v in bm.verts:
                lastna.insert(v.co, v.index)
            lastna.balance()
            delitve = 0
            for e in list(bm.edges):
                a, b = e.verts[0].co, e.verts[1].co
                ab = b - a; L2 = ab.length_squared
                if L2 < 1e-12:
                    continue
                naj = None
                for co, k, d in kd.find_range((a + b) / 2, math.sqrt(L2) / 2):
                    t = (co - a).dot(ab) / L2
                    if 0.001 < t < 0.999 and (co - a).length > eps and (co - b).length > eps and (a + ab * t - co).length < eps and lastna.find(co)[2] > eps:
                        naj = (t, co); break
                if naj:
                    ne, nv = bmesh.utils.edge_split(e, e.verts[0], naj[0]); nv.co = naj[1]; delitve += 1
            bmesh.ops.triangulate(bm, faces=[f for f in bm.faces if len(f.verts) > 3])
            bm.to_mesh(me); bm.free(); me.update()
            if delitve:
                print(f"[organi] jetra, šivanje mej (krog {krog + 1}): mreža {i}, razdeljenih robov {delitve}")


def _pocisti(me, zlij=1.2e-5):
    """Po Boolovi operaciji: brez izrojenih trikotnikov (igle v ravnini reza), prostih robov in oglišč; luknje zaprte."""
    bm = bmesh.new(); bm.from_mesh(me)
    if zlij:
        bmesh.ops.dissolve_degenerate(bm, edges=bm.edges, dist=zlij)
    bmesh.ops.delete(bm, geom=[f for f in bm.faces if f.calc_area() < 1e-11], context="FACES")
    bmesh.ops.delete(bm, geom=[e for e in bm.edges if not e.link_faces], context="EDGES")
    bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_edges], context="VERTS")
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-7)
    def plavuti():
        # plavut: skoraj izrojen trikotnik (višina < 30 µm oziroma 0,5 % dolžine), prilepljen na rob, ki ga sosedi že zapirajo (rob s 3 ploskvami
        # ali prost rob) – ostanek šivanja T-stikov; brez njega je mreža spet zaprta in mnogoterna
        for _ in range(12):
            sl = []
            for f in bm.faces:
                st = sorted(len(e.link_faces) for e in f.edges)
                if st != [1, 3, 3] and st != [1, 1, 3] and st != [1, 1, 1]:
                    continue  # samo ploskve, ki po izbrisu ne pustijo luknje
                d = max(e.calc_length() for e in f.edges)
                if d < 1e-9 or 2 * f.calc_area() / d < max(3e-5, 0.005 * d):
                    sl.append(f)
            if not sl:
                break
            bmesh.ops.delete(bm, geom=sl, context="FACES")
        bmesh.ops.delete(bm, geom=[e for e in bm.edges if not e.link_faces], context="EDGES")
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_edges], context="VERTS")
    plavuti()
    rob = [e for e in bm.edges if len(e.link_faces) == 1]
    if rob:
        bmesh.ops.holes_fill(bm, edges=rob, sides=0)
        plavuti()
    # ostanek: rob s tremi ploskvami ali luknja, ki je holes_fill ne zapre (drobci < 1 mm ob stiku treh režnjev). Ploskve
    # ob takem robu odpadejo, nastala luknja (nekaj trikotnikov) se zapre na novo.
    for _ in range(4):
        slabi = [e for e in bm.edges if len(e.link_faces) != 2]
        if not slabi:
            break
        bmesh.ops.delete(bm, geom=list({f for e in slabi for v in e.verts for f in v.link_faces}), context="FACES")
        bmesh.ops.delete(bm, geom=[e for e in bm.edges if not e.link_faces], context="EDGES")
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_edges], context="VERTS")
        rob = [e for e in bm.edges if len(e.link_faces) == 1]
        if rob:
            bmesh.ops.holes_fill(bm, edges=rob, sides=0)
        plavuti()
    bmesh.ops.triangulate(bm, faces=bm.faces)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    odprtih = sum(1 for e in bm.edges if len(e.link_faces) != 2)
    bm.to_mesh(me); bm.free(); me.update()
    return odprtih


def _ravnina(A, B):
    """Ravnina med mrežama skupin A in B (točke stika, najmanjši kvadrati); normala kaže od A proti B. Vrne (n, točka)."""
    def bvh(sez):
        bm = bmesh.new()
        for me in sez: bm.from_mesh(me)
        t = BVHTree.FromBMesh(bm); bm.free(); return t
    ta, tb = bvh(A), bvh(B)
    T = [v.co for me in A for v in me.vertices if tb.find_nearest(v.co)[3] < 0.004] + [v.co for me in B for v in me.vertices if ta.find_nearest(v.co)[3] < 0.004]
    X = np.array([list(p) for p in T]); c = X.mean(axis=0)
    w, v = np.linalg.eigh(np.cov((X - c).T))
    n = Vector(v[:, 0]).normalized()
    ca = sum((v.co for me in A for v in me.vertices), Vector()) / sum(len(me.vertices) for me in A)
    cb = sum((v.co for me in B for v in me.vertices), Vector()) / sum(len(me.vertices) for me in B)
    if n.dot(cb - ca) < 0:
        n = -n
    return n, Vector(c)


def _polprostor(ravnine, sred, vel=0.6):
    """Izbočeno telo: kocka okoli »sred«, odrezana z ravninami [(n, p)] (ostane stran n·(x − p) < 0)."""
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=vel)
    bmesh.ops.translate(bm, verts=bm.verts, vec=sred)
    for n, p in ravnine:
        bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:], plane_co=p, plane_no=n, clear_outer=True)
        rob = [e for e in bm.edges if len(e.link_faces) == 1]
        if rob:
            bmesh.ops.holes_fill(bm, edges=rob, sides=0)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new("_pp"); bm.to_mesh(me); bm.free()
    return _trikotniki(me)


def _normale_povrsine(me, cela):
    """Zunanje ploskve režnja (ležijo na celi površini) dobijo njene gladke normale, notranje stene svojo ploskovno;
    shrani v atribut »norm_lastna« (po zankah) in kot normale po meri."""
    bm = bmesh.new(); bm.from_mesh(cela); bm.faces.ensure_lookup_table(); bm.normal_update()
    bvh = BVHTree.FromBMesh(bm)
    vn = [v.normal.copy() for v in bm.verts]
    tri = [[v.index for v in f.verts] for f in bm.faces]
    co = [v.co.copy() for v in bm.verts]
    bm.free()
    def gladka(p):
        loc, nor, fi, d = bvh.find_nearest(p)
        a, b, c = (co[i] for i in tri[fi])
        v0, v1, v2 = b - a, c - a, loc - a
        d00, d01, d11, d20, d21 = v0.dot(v0), v0.dot(v1), v1.dot(v1), v2.dot(v0), v2.dot(v1)
        den = d00 * d11 - d01 * d01 or 1e-20
        v = (d11 * d20 - d01 * d21) / den; w = (d00 * d21 - d01 * d20) / den
        n = vn[tri[fi][0]] * (1 - v - w) + vn[tri[fi][1]] * v + vn[tri[fi][2]] * w
        return n.normalized()
    nor = []
    for p in me.polygons:
        zunaj = bvh.find_nearest(p.center)[3] < 2e-5 and all(bvh.find_nearest(me.vertices[i].co)[3] < 2e-5 for i in p.vertices)
        # Stena med režnjema dobi ob zunanji površini (rob stene) isto normalo kot površina: stena je tam vidna z roba in
        # bi se s svojo ploskovno normalo ob meji risala kot svetla črtkana črta (enaka globina kot površina).
        for i in p.vertices:
            na_povrsini = zunaj or bvh.find_nearest(me.vertices[i].co)[3] < 2e-5
            nor.append(gladka(me.vertices[i].co) if na_povrsini else p.normal.copy())
    shrani_normale(me, nor)


def shrani_normale(me, nor):
    for p in me.polygons:
        p.use_smooth = True
    at = me.attributes.get("norm_lastna") or me.attributes.new("norm_lastna", "FLOAT_VECTOR", "CORNER")
    at.data.foreach_set("vector", [x for n in nor for x in n])
    me.normals_split_custom_set([tuple(n) for n in nor])


def uveljavi_normale(me):
    """Po kopiranju ali triangulaciji: normale po meri iz atributa »norm_lastna« (izvozi-organe pred izvozom)."""
    at = me.attributes.get("norm_lastna")
    if at is None or len(at.data) != len(me.loops):
        return False
    buf = [0.0] * (len(me.loops) * 3); at.data.foreach_get("vector", buf)
    for p in me.polygons:
        p.use_smooth = True
    me.normals_split_custom_set([tuple(buf[i:i + 3]) for i in range(0, len(buf), 3)])
    return True


def _otoki_k_sosedu(me, sosed):
    """Reženj je en kos: manjši ločeni kosi (zaprta telesa ob meji, npr. za porto) gredo k sosednjemu režnju."""
    bm = bmesh.new(); bm.from_mesh(me)
    videni, otoki = set(), []
    for v in bm.verts:
        if v.index in videni: continue
        sklad, otok = [v], []
        videni.add(v.index)
        while sklad:
            u = sklad.pop(); otok.append(u)
            for e in u.link_edges:
                w = e.other_vert(u)
                if w.index not in videni:
                    videni.add(w.index); sklad.append(w)
        otoki.append(otok)
    if len(otoki) < 2:
        bm.free(); return me, sosed
    otoki.sort(key=len, reverse=True)
    mali = {v for o in otoki[1:] for v in o}
    bs = bmesh.new(); bs.from_mesh(sosed)
    nov = {v: bs.verts.new(v.co) for v in mali}
    for f in bm.faces:
        if f.verts[0] in mali:
            bs.faces.new([nov[v] for v in f.verts])
    bmesh.ops.delete(bm, geom=list(mali), context="VERTS")
    print(f"[organi] jetra: {len(otoki) - 1} ločenih kosov režnja ({len(mali)} oglišč) k sosednjemu režnju")
    bm.to_mesh(me); bm.free(); bs.to_mesh(sosed); bs.free(); me.update(); sosed.update()
    return me, sosed


def _rezi_reznje(L, seg, tmp, porta):
    """Cela površina L → štirje zaprti režnji. seg: {rimska številka: mreža segmenta}."""
    n1, p1 = _ravnina([seg["II"], seg["III"]], [seg["IV"]])
    n2, p2 = _ravnina([seg["IV"]], [seg["V"], seg["VIII"]])
    sred = sum((v.co for v in L.vertices), Vector()) / len(L.vertices)
    bvh = BVHTree.FromPolygons([v.co for v in L.vertices], [p.vertices for p in L.polygons])
    # sprednja točka kvadratnega režnja: 5 mm nad spodnjim robom jeter (od spredaj se vidita le desni in levi reženj)
    xs = ((p1 + p2) / 2).x
    zb = min(v.co.z for v in L.vertices if abs(v.co.x - xs) < 0.012)
    hit = bvh.ray_cast(Vector((xs, -1.0, zb + 0.005)), Vector((0, 1, 0)))[0] or Vector((xs, porta.y - 0.06, zb + 0.005))
    n3 = Vector((1, 0, 0)).cross(hit - porta).normalized()
    if n3.z < 0:
        n3 = -n3
    levi_pp = _polprostor([(n1, p1)], sred)
    levi = _bool(L, levi_pp, "INTERSECT", tmp); ost = _bool(L, levi_pp, "DIFFERENCE", tmp)
    # repasti reženj: segment I, napihnjen 2,5 mm (sega čez površino, Boolova operacija obdrži del v jetrih)
    rp = _gosti(seg["I"], tmp, 900)  # redka rezalna mreža: stena med režnjema ne potrebuje gostote
    nor = [v.normal.copy() for v in rp.vertices]
    for v, nn in zip(rp.vertices, nor):
        v.co += nn * 0.0025
    rep = _bool(ost, rp, "INTERSECT", tmp); ost = _bool(ost, rp, "DIFFERENCE", tmp)
    # brez ravnine srpaste vezi: levi reženj je že odrezan, sovpadajoči ploskvi bi Boolovo operacijo pokvarili (luknje)
    # kvadratni reženj je samo kos pred porto: brez tretje ravnine (čelna, 4 mm za porto) je klin zajel tudi
    # ločen kos za porto ob repastem režnju (10 × 20 × 63 mm; v učnih barvah kvadratni sredi desnega)
    kv_pp = _polprostor([(n2, p2), (n3, porta), (Vector((0, 1, 0)), porta + Vector((0, 0.004, 0)))], sred)
    print(f"[organi] jetra: porta {[round(x, 4) for x in porta]}, središče {[round(x, 4) for x in sred]}")
    kv = _bool(ost, kv_pp, "INTERSECT", tmp); desni = _bool(ost, kv_pp, "DIFFERENCE", tmp)
    kv, desni = _otoki_k_sosedu(kv, desni)
    for me in (levi, rep, kv, desni):
        _pocisti(me)
    print("[organi] jetra: nemnogoterih robov pred šivanjem", [_pocisti(me, 0.0) for me in (levi, rep, kv, desni)])
    _sivaj([levi, rep, kv, desni])
    for ime_, me in (("levi", levi), ("repasti", rep), ("kvadratni", kv), ("desni", desni)):
        odp = _pocisti(me, 0.0)
        if odp:
            print(f"[organi] POZOR jetra {ime_}: {odp} robov ni mnogoterih")
        _normale_povrsine(me, L)
    return dict(levi=levi, repasti=rep, kvadratni=kv, desni=desni), (n1, p1)


def _lok_vezi(L, n1, p1):
    """Presek površine z ravnino srpaste vezi: lok od spodnjega roba po sprednji in zgornji ploskvi do vrha kupole."""
    bm = bmesh.new(); bm.from_mesh(L)
    r = bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:], plane_co=p1, plane_no=n1)
    rob = [e for e in r["geom_cut"] if isinstance(e, bmesh.types.BMEdge)]
    sos = {}
    for e in rob:
        a, b = e.verts
        sos.setdefault(a, []).append(b); sos.setdefault(b, []).append(a)
    zac = min(sos, key=lambda v: v.co.z)
    zanka = [zac]; pred = None
    while True:
        nasl = [v for v in sos[zanka[-1]] if v is not pred]
        if not nasl or nasl[0] is zac or len(zanka) > 5000:
            break
        pred = zanka[-1]; zanka.append(nasl[0])
    P = [v.co.copy() for v in zanka]
    bm.free()
    c = sum(P, Vector()) / len(P)
    k = min(25, len(P) // 4)
    if sum(p.y for p in P[1:k]) / (k - 1) > sum(p.y for p in P[-k:]) / k:  # smer po sprednji (−y) ploskvi navzgor
        P = [P[0]] + P[:0:-1]
    lok = [P[0]]
    for p in P[1:]:
        if p.y > c.y and p.z > c.z:  # čez vrh kupole: konec (tu se vez razcepi v venčno vez)
            break
        lok.append(p)
    return lok


def _vez(L, n1, p1, telefon=False):
    """Srpasta vez (dvojna guba, debela 1,2 mm) in obla vez na njenem prostem spodnjem robu."""
    bvh = BVHTree.FromPolygons([v.co for v in L.vertices], [p.vertices for p in L.polygons])
    lok = _lok_vezi(L, n1, p1)
    s = [0.0]
    for a, b in zip(lok, lok[1:]):
        s.append(s[-1] + (b - a).length)
    korak = 0.006 if telefon else 0.003
    vz = []; t = 0.0
    while t < s[-1] * 0.82:  # ne čez vrh kupole (od spredaj spodaj bi štrlela nad obris jeter)
        i = max(0, min(len(s) - 2, int(np.searchsorted(s, t)) - 1)); u = (t - s[i]) / max(s[i + 1] - s[i], 1e-9)
        vz.append((lok[i].lerp(lok[i + 1], u), t / (s[-1] * 0.82))); t += korak
    def v_ravnini(d):
        d = d - n1 * d.dot(n1)
        return d.normalized()
    smer_o = v_ravnini(Vector((0, -0.5, -0.86)))  # obla vez: od zareze na spodnjem robu naprej in navzdol proti popku
    h = 0.00028  # tanka dvojna guba potrebušnice; prosti rob se stanjša (mehak rob)
    bm = bmesh.new(); vrste = []; prosti = []
    for p, u in vz:
        loc, nor, fi, d = bvh.find_nearest(p)
        o = v_ravnini(nor)
        f = min(1.0, u / 0.3); f = f * f * (3 - 2 * f)
        d_ = (smer_o * (1 - f) + (o * 0.75 + Vector((0, -0.66, 0))) * f)
        d_ = v_ravnini(d_)
        # u = 0 ob zarezi: vez je tam odrezana 10 mm od jeter (prej 28 mm: z oblo vezjo v robu je visela pod jetri kot palica)
        # nižja guba (prej 7 mm na vrhu kupole: nad obrisom jeter je štrlela kot plavut), proti vrhu se izteče v 2 mm
        w = (0.002 + 0.02 * (1 - u) ** 1.6) * min(1.0, (1.02 - u) / 0.2) * min(1.0, 0.35 + 0.65 * u / 0.25)
        a = p - o * 0.0012; q = a + d_ * w
        prosti.append((q.copy(), u))
        m = 3 if telefon else 5
        vrste.append([[bm.verts.new(a.lerp(q, j / m) + n1 * zn * h * (1 - 0.75 * (j / m) ** 2)) for j in range(m + 1)] for zn in (1, -1)])
    for (a1, a2), (b1, b2) in zip(vrste, vrste[1:]):
        for j in range(len(a1) - 1):
            bm.faces.new([a1[j], a1[j + 1], b1[j + 1], b1[j]])
            bm.faces.new([b2[j], b2[j + 1], a2[j + 1], a2[j]])
        bm.faces.new([a1[-1], a2[-1], b2[-1], b1[-1]])  # prosti rob
        bm.faces.new([a2[0], a1[0], b1[0], b2[0]])  # rob v jetrih
    for (c1, c2), obrni in ((vrste[0], False), (vrste[-1], True)):
        for j in range(len(c1) - 1):
            q = [c1[j], c2[j], c2[j + 1], c1[j + 1]]
            bm.faces.new(q[::-1] if obrni else q)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    srp = bpy.data.meshes.new("srpasta"); bm.to_mesh(srp); bm.free()
    p0 = vz[0][0]
    w0 = (0.002 + 0.02) * 0.35
    # obla vez: kratek krn v prostem robu vezi (prej 10 mm pod jetri kot palica)
    # obla vez teče v prostem robu srpaste vezi (spodnjih 45 % loka) do zareze in se tam potopi v razpoko (ocena n2: guba se
    # ni nadaljevala v oblo vez, na spodnji ploskvi je štrlel bled krn)
    Pq = [q for q, u in prosti if u <= 0.45][::-1]
    if len(Pq) >= 4:
        P = Pq + [p0 + Vector((0, 0.003, 0.002)), p0 + Vector((0, 0.007, 0.004))]
        R = [0.0007 + 0.0011 * min(1.0, i / (0.5 * len(P))) for i in range(len(P))]
        R[-1] = 0.0012; R[-2] = 0.0016
        P, R = D.zgladi(P, R, 2)
    else:
        P = [p0 - smer_o * 0.006 + Vector((0, 0.004, 0.003)), p0, p0 + smer_o * w0 * 0.3, p0 + smer_o * w0 * 0.6]
        P, R = D.zgladi([P[0].lerp(P[1], i / 3) for i in range(3)] + [P[1].lerp(P[2], i / 4) for i in range(4)] + [P[2].lerp(P[3], i / 6) for i in range(7)], [0.0022] * 14, 1)
    bm = bmesh.new(); D.cev(bm, P, R, 6 if telefon else 12, kupola=True, zacetek_kupola=True)  # zaprta konca (ne prazna cev)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    obla = bpy.data.meshes.new("obla"); bm.to_mesh(obla); bm.free()
    for me in (srp, obla):
        for p in me.polygons: p.use_smooth = True
    return srp, obla


def _spremljevalke(veje, smer, delez, rmin, rmax, najmanj_r):
    """Arterija oziroma žolčni vod ob vejah portalne vene: lomljenka, odmaknjena pravokotno na vejo proti »smer«."""
    izhod = []
    for P, R in veje:
        if max(R) < najmanj_r or len(P) < 2:
            continue
        Q, S = [], []
        for i, (p, r) in enumerate(zip(P, R)):
            if r < najmanj_r * 0.8 and i > 1:
                break
            t = (P[min(i + 1, len(P) - 1)] - P[max(i - 1, 0)]).normalized()
            u = smer - t * smer.dot(t)
            u = u.normalized() if u.length > 1e-4 else t.orthogonal().normalized()
            rs = min(rmax, max(rmin, r * delez))
            Q.append(p + u * (r + rs + 0.0002)); S.append(rs)
        if len(Q) >= 2:
            izhod.append((Q, S))
    # začetek veje se priključi na najbližjo točko debelejše spremljevalke (starševske veje)
    kd = KDTree(sum(len(Q) for Q, _ in izhod)); k = 0; lastnik = []
    for j, (Q, S) in enumerate(izhod):
        for q, r in zip(Q, S):
            kd.insert(q, k); lastnik.append((j, r)); k += 1
    kd.balance()
    for j, (Q, S) in enumerate(izhod):
        for co, i, d in kd.find_n(Q[0], 12):
            if lastnik[i][0] != j and lastnik[i][1] >= S[0] and d < 0.012:
                Q.insert(0, co.copy()); S.insert(0, S[0]); break
    return izhod


def jetra_deli(osnovni, cfg, tmp):
    nast = cfg.get("jetra", {})
    rim = {}
    for r in osnovni:
        if "segment of liver" in r[0]:
            rim[r[0][r[0].rindex("(") + 1:-1]] = r[1]
    cela = next(r[1] for r in osnovni if r[0] == "Liver")
    D.zapri_luknje(cela)
    K = cfg["_krivulje"]
    T, TR = K["Hepatic portal vein"][0]
    T = [Vector(p) for p in T]
    if T[0].z > T[-1].z:
        T.reverse()
    porta = T[-1].copy()
    # deblo portalne vene (in z njim arterija in žolčevod ob njem) le portaDeblo pod vrati (prej ves Z-Anatomy: snop
    # vzporednih valjev pod jetri)
    T = [p for p in T if p.z >= porta.z - nast.get("portaDeblo", 0.014)] or T[-2:]
    zb = [r[1] for r in osnovni if r[0] == "Gallbladder"][0]
    tel = cfg.setdefault("_telefon", {})
    izhod = []
    def vrstica(ime, me, me_t, tkivo, del_):
        tel[ime] = me_t
        izhod.append([ime, me, tkivo, del_, ime + " / Evklid"])
    # ---- režnji
    L = _gosti(cela, tmp, nast.get("povrsina", (56000, 14000))[0]); Lt = _gosti(cela, tmp, nast.get("povrsina", (56000, 14000))[1])
    rez, (n1, p1) = _rezi_reznje(L, rim, tmp, porta)
    rez_t, _ = _rezi_reznje(Lt, rim, tmp, porta)
    for k, ime, del_ in (("desni", "Right lobe of liver (lastno)", "desni-rezenj"), ("levi", "Left lobe of liver (lastno)", "levi-rezenj"),
                         ("kvadratni", "Quadrate lobe of liver (lastno)", "kvadratni-rezenj"), ("repasti", "Caudate lobe of liver (lastno)", "repasti-rezenj")):
        vrstica(ime, rez[k], rez_t[k], "jetra", del_)
        print(f"[organi] {ime}: {D.tris(rez[k])} / {D.tris(rez_t[k])} trikotnikov")
    # ---- srpasta in obla vez
    for t_, Lx in ((False, L), (True, Lt)):
        srp, obla = _vez(Lx, n1, p1, t_)
        if t_:
            tel["Falciform ligament (lastno)"] = srp; tel["Round ligament of liver (lastno)"] = obla
        else:
            izhod.append(["Falciform ligament (lastno)", srp, "guba", "srpasta-vez", "Falciform ligament (lastno) / Evklid"])
            izhod.append(["Round ligament of liver (lastno)", obla, "vez", "obla-vez", "Round ligament of liver (lastno) / Evklid"])
    # ---- spodnja votla vena
    notr = D.Notranjost([L])
    ivc = []
    for ime in ("Inferior vena cava (abdominal part)", "Inferior vena cava (thoracic part)"):
        for P, R in K.get(ime, []):
            P = [Vector(p) for p in P]; R = list(R)
            if P[0].z > P[-1].z:
                P.reverse(); R.reverse()
            ivc += [(p, r) for p, r in zip(P, R) if not ivc or p.z > ivc[-1][0].z + 1e-4]
    # krna le 6 mm pod repastim režnjem in nad kupolo (prej 22 in 12 mm: pod vrati je visela kot cev)
    zlo = min(v.co.z for v in rim["I"].vertices) - nast.get("ivcSpodaj", 0.006); zhi = max(v.co.z for v in L.vertices) + nast.get("ivcZgoraj", 0.006)
    sred_ = sum((v.co for v in L.vertices), Vector()) / len(L.vertices)
    def k_jetrom(p):  # votla vena leži v žlebu na zadnji strani jeter (gola ploskev): ivcZleb proti osi jeter
        d = Vector((sred_.x - p.x, sred_.y - p.y, 0))
        return p + d.normalized() * nast.get("ivcZleb", 0.011)
    ivc = [(k_jetrom(p), max(r, 0.0105)) for p, r in ivc if zlo <= p.z <= zhi]
    iP, iR = [p for p, _ in ivc], [r for _, r in ivc]
    for t_ in (False, True):
        P_, R_ = D.redci(*D.zgladi(iP, iR, 2), (lambda r: 0.012) if t_ else (lambda r: 0.005))
        bm = bmesh.new(); D.cev(bm, P_, R_, 12 if t_ else 24, kupola=False)  # polna, ravno odrezana krna (prej odprta svetlina)
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
        me = bpy.data.meshes.new("ivc"); bm.to_mesh(me); bm.free()
        if t_:
            tel["Inferior vena cava (lastno)"] = me
        else:
            izhod.append(["Inferior vena cava (lastno)", me, "vena", "spodnja-votla-vena", "Inferior vena cava (lastno) / Evklid"])
    # ---- drevesa
    rob = 0.0045
    def dovoli(a, b):
        return notr.vse.find_nearest(b)[3] >= rob and notr.znotraj(b) and notr.znotraj(a.lerp(b, 0.5))
    def v_jetra(p, proti):
        for _ in range(80):
            if notr.vse.find_nearest(p)[3] >= rob + 0.001 and notr.znotraj(p):
                return p
            p = p + (proti - p).normalized() * 0.002
        return p
    sred = sum((v.co for v in L.vertices), Vector()) / len(L.vertices)
    def deblo(vozli, a, smer, dolzina, r0, r1, stars=-1, korak=0.004):
        n = max(2, int(dolzina / korak)); pred = stars
        for i in range(n + 1):
            vozli.append(dict(p=a + smer * dolzina * i / n, stars=pred, r=r0 + (r1 - r0) * i / n, rast=i > 1 and i % 2 == 0)); pred = len(vozli) - 1
        vozli[-1]["rast"] = True
        return pred
    def stalne(vozli):
        """Stalna debla kot lomljenke (vsako od korena ali razcepa do konca)."""
        ot = {}
        for i, v in enumerate(vozli):
            if v["stars"] >= 0: ot.setdefault(v["stars"], []).append(i)
        sez = []
        for i, v in enumerate(vozli):
            if v["stars"] < 0 or len(ot.get(v["stars"], [])) > 1:
                P = [vozli[v["stars"]]["p"]] if v["stars"] >= 0 else []
                R = [min(vozli[v["stars"]]["r"], v["r"])] if v["stars"] >= 0 else []
                j = i
                while True:
                    P.append(vozli[j]["p"]); R.append(vozli[j]["r"])
                    o = ot.get(j, [])
                    if len(o) != 1: break
                    j = o[0]
                if len(P) >= 2: sez.append((P, R))
        return sez
    # portalna vena: deblo Z-Anatomy do jetrnih vrat, desna in leva veja, nato rast
    rp = nast.get("portalna", 0.0055)
    vozli = [dict(p=p, stars=i - 1, r=rp, rast=False) for i, p in enumerate(T[::3] + ([T[-1]] if (len(T) - 1) % 3 else []))]
    v_vrata = v_jetra(porta, sred)
    k = deblo(vozli, porta, (v_vrata - porta).normalized() if (v_vrata - porta).length > 1e-5 else Vector((0, 0, 1)), max((v_vrata - porta).length, 0.004), rp, rp * 0.95, len(vozli) - 1)
    deblo(vozli, vozli[k]["p"], Vector((-1, 0.2, 0.3)).normalized(), 0.024, rp * 0.85, rp * 0.72, k)
    deblo(vozli, vozli[k]["p"], Vector((1, -0.35, 0.12)).normalized(), 0.02, rp * 0.72, rp * 0.6, k)
    n_stalnih = len(vozli)
    rnd = random.Random(5)
    rasti_ = lambda vz, raz, ub: D.rasti(vz, D.privlaki(notr, raz, rob + 0.002, rnd), nast.get("korak", 0.004), nast.get("vpliv", 0.05), ub, dovoli, vztrajnost=0.5)
    rasti_(vozli, nast.get("razmikPortalna", 0.013), 0.008)
    for v in vozli[:n_stalnih]: v["nov"] = False
    ot = D.polmeri(vozli, nast.get("listPortalna", 0.0009), e=2.3, delez=0.9)
    p_deb = stalne(vozli[:n_stalnih])
    p_veje = D.veje(vozli, ot, 1); p_veje_t = D.veje(vozli, ot, nast.get("telefonListi", 3))
    stena = lambda r: 0.0009 if r > 0.0045 else 0.0
    me = D.mreza_vej(p_deb + p_veje, "portalna", stena=stena); me_t = D.mreza_vej(p_deb + p_veje_t, "portalna t", telefon=True, stena=stena)
    vrstica("Hepatic portal vein and branches (lastno)", me, me_t, "portalna", "portalna-vena")
    print(f"[organi] portalna vena: {len(vozli)} vozlišč, {D.tris(me)} / {D.tris(me_t)} trikotnikov")
    # jetrna arterija in žolčni vodi ob portalnih vejah (portalna triada); pred vrati: arterija levo spredaj, vod desno spredaj
    for ime, tkivo, del_, smer, delez, rmin, rmax in (("Hepatic artery and branches (lastno)", "arterija", "jetrna-arterija", Vector((0.62, -0.78, 0.05)), 0.36, 0.00055, 0.0021),
                                                      ("Bile ducts (lastno)", "zolcevod", "zolcevod", Vector((-0.62, -0.78, 0.05)), 0.45, 0.0006, 0.003)):
        sez = _spremljevalke(p_deb + p_veje, smer.normalized(), delez, rmin, rmax, nast.get("triadaR", 0.0012))
        sez_t = _spremljevalke(p_deb + p_veje_t, smer.normalized(), delez, rmin, rmax, nast.get("triadaR", 0.0012) * 1.5)
        if tkivo == "zolcevod":  # žolčnikov vod: od vratu žolčnika (točka žolčnika najbližje vratom) v loku do skupnega jetrnega voda
            vrat = min((v.co for v in zb.vertices), key=lambda c: (c - porta).length)
            zc = sum((v.co for v in zb.vertices), Vector()) / len(zb.vertices)
            gl = max(sez, key=lambda x: max(x[1]))[0]
            cilj = min(gl, key=lambda q: abs(q.z - (porta.z - 0.016)))
            a = vrat + (zc - vrat).normalized() * 0.003
            m1 = a.lerp(cilj, 0.35) + Vector((0, -0.004, 0.006)); m2 = a.lerp(cilj, 0.7) + Vector((0.002, 0.003, 0.004))
            cP = [a, m1, m2, cilj + Vector((0, 0, 0.004)), cilj - Vector((0, 0, 0.002))]
            cP = [cP[i].lerp(cP[i + 1], j / 4) for i in range(4) for j in range(4)] + [cP[-1]]
            cyst = (cP, [0.0016] * len(cP))
            sez.append(cyst); sez_t.append(cyst)
        me = D.mreza_vej(sez, ime, kupole=(True, True)); me_t = D.mreza_vej(sez_t, ime + " t", telefon=True, kupole=(True, True))
        vrstica(ime, me, me_t, tkivo, del_)
        print(f"[organi] {ime}: {len(sez)} vej, {D.tris(me)} / {D.tris(me_t)} trikotnikov")
    # jetrne vene: desna, srednja in leva iz spodnje votle vene tik pod prepono
    zv = max(v.co.z for v in L.vertices) - nast.get("veneGlobina", 0.03)
    pc, rc = min(ivc, key=lambda x: abs(x[0].z - zv))
    vozli = []
    for smer, dolz, r0 in ((Vector((-0.85, -0.25, -0.45)), 0.03, 0.0048), (Vector((-0.3, -0.8, -0.5)), 0.03, 0.0044), (Vector((0.8, -0.5, -0.2)), 0.028, 0.004)):
        smer = smer.normalized()
        deblo(vozli, pc + smer * rc * 0.6, smer, dolz + rc * 0.4, r0, r0 * 0.85)
    n_stalnih = len(vozli)
    rnd = random.Random(9)
    rasti_(vozli, nast.get("razmikVene", 0.014), 0.009)
    for v in vozli[:n_stalnih]: v["nov"] = False
    ot = D.polmeri(vozli, nast.get("listVene", 0.001), e=2.3, delez=0.9)
    v_deb = stalne(vozli[:n_stalnih])
    me = D.mreza_vej(v_deb + D.veje(vozli, ot, 1), "vene"); me_t = D.mreza_vej(v_deb + D.veje(vozli, ot, nast.get("telefonListi", 3)), "vene t", telefon=True)
    vrstica("Hepatic veins (lastno)", me, me_t, "vena", "jetrne-vene")
    print(f"[organi] jetrne vene: {len(vozli)} vozlišč, {D.tris(me)} / {D.tris(me_t)} trikotnikov")
    # izvirni segmenti, cela površina in krivulje Z-Anatomy odpadejo (ostane žolčnik)
    osnovni[:] = [r for r in osnovni if r[0] == "Gallbladder"]
    return izhod


# ---------------------------------------------------------------------------------------------------------------------
# Jetra iz enega telesa (CT): površina in segmenti TotalSegmentator, prava drevesa portalne vene in jetrnih ven HVA-CT
# (scripts/atlas/jetra-ct.py → npz). Režnji, vezi in spremljevalke (arterija, žolčni vodi) kot pri jetra_deli.

def _np_mreza(ime, v, f):
    me = bpy.data.meshes.new(ime); me.from_pydata(np.asarray(v, float).tolist(), [], np.asarray(f).tolist()); me.update()
    return me


def _zolcnik_v_lezisce(zb, L, notr, vrata, n2, p2):
    """Žolčnik Z-Anatomy (bolnik na CT ga nima) v ležišče: vrat ob jetrnih vratih, svod ob spodnjem robu med IV in V."""
    co = np.array([v.co[:] for v in zb.vertices])
    c = co.mean(0); u, s, vt = np.linalg.svd(co - c, full_matrices=False)
    os_ = vt[0]; t = (co - c) @ os_
    # vrat = ožji konec (manjši povprečni odmik od osi v zadnji petini)
    def sirina(m):
        q = co[m] - c; return float(np.linalg.norm(q - np.outer(q @ os_, os_), axis=1).mean())
    if sirina(t > np.quantile(t, 0.8)) < sirina(t < np.quantile(t, 0.2)):
        os_ = -os_; t = -t
    vrat = c + os_ * t.min(); dol = float(t.max() - t.min())
    # cilj: svod = najnižja sprednja točka jeter ob ravnini IV | V; vrat = 18 mm od vrat proti svodu, na spodnji ploskvi
    ob = [v.co for v in L.vertices if abs((v.co - p2).dot(n2)) < 0.008]
    F = min(ob, key=lambda q: q.y * 0.8 + q.z)
    N = vrata.lerp(F, min(0.4, 0.022 / max((F - vrata).length, 1e-6)))
    a = (F - N).normalized()
    R = Vector(os_).rotation_difference(a).to_matrix()
    merilo = min(1.0, max(0.75, ((F - N).length + 0.012) / dol))
    for v in zb.vertices:
        v.co = N + (R @ (v.co - Vector(vrat))) * merilo
    # iz jeter: navzdol in naprej, dokler ni v jetrih le še tretjina (ležišče)
    ven = Vector((0, -0.35, -1)).normalized()
    for _ in range(40):
        if sum(1 for v in zb.vertices if notr.znotraj(v.co)) <= 0.3 * len(zb.vertices):
            break
        for v in zb.vertices:
            v.co += ven * 0.001
    zb.update()
    return zb


def jetra_ct(osnovni, cfg, tmp):
    from pljuca_geometrija import Drevo
    nast = cfg.get("jetra", {})
    pot = os.path.join(cfg.get("_ct_mapa") or "", nast.get("datoteka", "totalseg/jetra-ct-v1.npz"))
    if not os.path.exists(pot):
        print(f"[organi] jetra: ni {pot} – jetra Z-Anatomy z zraslimi drevesi")
        return jetra_deli(osnovni, cfg, tmp)
    Z = np.load(pot)
    cela = _np_mreza("jetra ct", Z["jetra_v"], Z["jetra_f"])
    bm = bmesh.new(); bm.from_mesh(cela); D.taubin_bm(bm, nast.get("glajenje", 40)); bm.to_mesh(cela); bm.free()
    rimske = ("I", "II", "III", "IV", "V", "VI", "VII", "VIII")
    rim = {r: _np_mreza("seg " + r, Z[f"seg{i + 1}_v"], Z[f"seg{i + 1}_f"]) for i, r in enumerate(rimske)}
    zb = [r[1] for r in osnovni if r[0] == "Gallbladder"][0]
    tel = cfg.setdefault("_telefon", {})
    izhod = []
    def vrstica(ime, me, me_t, tkivo, del_):
        tel[ime] = me_t
        izhod.append([ime, me, tkivo, del_, ime + " / HVA-CT, TotalSegmentator"])
    # ---- drevesa (m)
    Pv = Drevo(Z["portalna_P"], Z["portalna_R"], Z["portalna_S"]); Hv = Drevo(Z["vene_P"], Z["vene_R"], Z["vene_S"])
    def glavna(Dr, i, pogoj=lambda o: True):  # pot po najdebelejšem otroku
        pot_ = [i]
        while True:
            ot = [o for o in Dr.otroci[pot_[-1]] if pogoj(o)]
            if not ot: return pot_
            pot_.append(max(ot, key=lambda o: Dr.R[o] + 0.02 * Dr.dol[o]))
    kor = int(np.flatnonzero(Pv.S < 0)[0])
    # jetrna vrata: prvi razcep portalne vene z dvema dolgima poddrevesoma
    i = kor
    while True:
        ot = sorted(Pv.otroci[i], key=lambda o: -Pv.dol[o])
        if len(ot) >= 2 and Pv.dol[ot[1]] > nast.get("vrataVeja", 0.05) or not ot:
            break
        i = ot[0]
    vrata = Vector(Pv.P[i]); porta = vrata.copy()
    print(f"[organi] jetra CT: vrata {[round(x, 4) for x in vrata]}, portalna {len(Pv.P)} vozlišč, vene {len(Hv.P)}")
    # ---- režnji
    pov = nast.get("povrsina", (56000, 14000))
    L = _gosti(cela, tmp, pov[0]); Lt = _gosti(cela, tmp, pov[1])
    rez, (n1, p1) = _rezi_reznje(L, rim, tmp, porta)
    rez_t, _ = _rezi_reznje(Lt, rim, tmp, porta)
    for k, ime, del_ in (("desni", "Right lobe of liver (lastno)", "desni-rezenj"), ("levi", "Left lobe of liver (lastno)", "levi-rezenj"),
                         ("kvadratni", "Quadrate lobe of liver (lastno)", "kvadratni-rezenj"), ("repasti", "Caudate lobe of liver (lastno)", "repasti-rezenj")):
        tel[ime] = rez_t[k]
        izhod.append([ime, rez[k], "jetra", del_, ime + " / TotalSegmentator (CT MSD hepaticvessel)"])
        print(f"[organi] {ime}: {D.tris(rez[k])} / {D.tris(rez_t[k])} trikotnikov")
    for t_, Lx in ((False, L), (True, Lt)):
        srp, obla = _vez(Lx, n1, p1, t_)
        if t_:
            tel["Falciform ligament (lastno)"] = srp; tel["Round ligament of liver (lastno)"] = obla
        else:
            izhod.append(["Falciform ligament (lastno)", srp, "guba", "srpasta-vez", "Falciform ligament (lastno) / Evklid"])
            izhod.append(["Round ligament of liver (lastno)", obla, "vez", "obla-vez", "Round ligament of liver (lastno) / Evklid"])
    notr = D.Notranjost([L])
    V = lambda Dr, idx: ([Vector(Dr.P[j]) for j in idx], [float(Dr.R[j]) for j in idx])
    rmin, rmin_t = nast.get("vejaR", (0.0008, 0.0016))
    def veje(Dr, zacetki, r, listi):
        return [V(Dr, v) for v in Dr.veje(zacetki, najmanj_listov=listi, najmanj_r=r)]
    # ---- portalna vena: deblo (zunaj jeter votlo: prerezana svetlina) in veje
    stena = lambda r: 0.0009 if r > 0.0045 else 0.0
    me = D.mreza_vej(veje(Pv, None, rmin, 1), "portalna", stena=stena)
    me_t = D.mreza_vej(veje(Pv, None, rmin_t, nast.get("telefonListi", 2)), "portalna t", telefon=True, stena=stena)
    vrstica("Hepatic portal vein and branches (CT)", me, me_t, "portalna", "portalna-vena")
    print(f"[organi] portalna vena: {D.tris(me)} / {D.tris(me_t)} trikotnikov")
    # ---- jetrna arterija in žolčni vodi ob portalnih vejah (portalna triada)
    p_vse = veje(Pv, None, max(rmin, 0.0012), 1); p_vse_t = veje(Pv, None, max(rmin_t, 0.002), nast.get("telefonListi", 2))
    for ime, tkivo, del_, smer, delez, r0, r1 in (("Hepatic artery and branches (lastno)", "arterija", "jetrna-arterija", Vector((0.62, -0.78, 0.05)), 0.36, 0.00055, 0.0021),
                                                  ("Bile ducts (lastno)", "zolcevod", "zolcevod", Vector((-0.62, -0.78, 0.05)), 0.45, 0.0006, 0.003)):
        sez = _spremljevalke(p_vse, smer.normalized(), delez, r0, r1, nast.get("triadaR", 0.0015))
        sez_t = _spremljevalke(p_vse_t, smer.normalized(), delez, r0, r1, nast.get("triadaR", 0.0015) * 1.5)
        if tkivo == "zolcevod":
            n2, p2 = _ravnina([rim["IV"]], [rim["V"], rim["VIII"]])
            zb = _zolcnik_v_lezisce(zb, L, notr, vrata, n2, p2)
            vrat = min((v.co for v in zb.vertices), key=lambda c: (c - porta).length)
            zc = sum((v.co for v in zb.vertices), Vector()) / len(zb.vertices)
            gl = max(sez, key=lambda x: max(x[1]))[0]
            cilj = min(gl, key=lambda q: abs(q.z - (porta.z - 0.012)))
            a = vrat + (zc - vrat).normalized() * 0.003
            m1 = a.lerp(cilj, 0.35) + Vector((0, -0.003, 0.004)); m2 = a.lerp(cilj, 0.7) + Vector((0.002, 0.002, 0.003))
            cP = [a, m1, m2, cilj + Vector((0, 0, 0.004)), cilj - Vector((0, 0, 0.002))]
            cP = [cP[i].lerp(cP[i + 1], j / 4) for i in range(4) for j in range(4)] + [cP[-1]]
            cyst = (cP, [0.0016] * len(cP))
            sez.append(cyst); sez_t.append(cyst)
        me = D.mreza_vej(sez, ime, kupole=(True, True)); me_t = D.mreza_vej(sez_t, ime + " t", telefon=True, kupole=(True, True))
        tel[ime] = me_t
        izhod.append([ime, me, tkivo, del_, ime + " / Evklid ob portalnih vejah HVA-CT"])
        print(f"[organi] {ime}: {len(sez)} vej, {D.tris(me)} / {D.tris(me_t)} trikotnikov")
    # ---- spodnja votla vena (deblo drevesa jetrnih ven: od vrha navzdol po najdebelejšem otroku) in jetrne vene vanjo
    kor = int(np.flatnonzero(Hv.S < 0)[0])
    v_ivc = Z["vene_ivc"]; r_ivc = Z["vene_ivcR"]
    # os votle vene: od vrha navzdol vedno v poddrevo z največ vozlišči v votli veni (najdebelejši otrok zavije v jetrno veno)
    st_ivc = np.array(v_ivc, int)
    for j in range(len(Hv.P) - 1, -1, -1):
        if Hv.S[j] >= 0: st_ivc[Hv.S[j]] += st_ivc[j]
    os_ivc = [kor]
    while True:
        ot = [o for o in Hv.otroci[os_ivc[-1]] if v_ivc[o] and st_ivc[o] > 0]
        if not ot: break
        os_ivc.append(max(ot, key=lambda o: st_ivc[o]))
    na_osi = set(os_ivc)
    iP, _ = V(Hv, os_ivc)
    # polmer po maski votle vene (drseče povprečje) + 1 mm: cev zapolni svoj žleb v jetrih (ocena n1: ohlapna cev)
    rr = np.array([max(r_ivc[j], Hv.R[j]) for j in os_ivc], float)
    rr = np.convolve(np.pad(rr, 8, mode="edge"), np.ones(17) / 17, mode="valid")
    iR = [max(0.0085, float(r) + 0.001) for r in rr]
    iP, iR = D.zgladi(iP, iR, 30)  # skelet v široki žili vijuga
    for t_ in (False, True):
        P_, R_ = D.redci(*D.zgladi(iP, iR, 6), (lambda r: 0.008) if t_ else (lambda r: 0.004))
        bm = bmesh.new(); D.cev(bm, P_, R_, 20 if t_ else 32, kupola=False, stena=0.0014)  # ravno odrezana, s svetlino
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
        me = bpy.data.meshes.new("ivc"); bm.to_mesh(me); bm.free()
        for p in me.polygons: p.use_smooth = True
        if t_:
            tel["Inferior vena cava (CT)"] = me
        else:
            izhod.append(["Inferior vena cava (CT)", me, "vena", "spodnja-votla-vena", "Inferior vena cava (CT) / HVA-CT, TotalSegmentator"])
    zac = [o for i in os_ivc for o in Hv.otroci[i] if o not in na_osi]
    def od_stene(sez):  # veja se začne v osi votle vene: začetek ostane (vstopi v steno), a s polmerom veje
        return sez
    me = D.mreza_vej(od_stene(veje(Hv, zac, rmin, 1)), "vene"); me_t = D.mreza_vej(od_stene(veje(Hv, zac, rmin_t, nast.get("telefonListi", 2))), "vene t", telefon=True)
    vrstica("Hepatic veins (CT)", me, me_t, "vena", "jetrne-vene")
    print(f"[organi] votla vena {len(os_ivc)} vozlišč, jetrne vene: {len(zac)} pritokov, {D.tris(me)} / {D.tris(me_t)} trikotnikov")
    osnovni[:] = [r for r in osnovni if r[0] == "Gallbladder"]
    return izhod

# Dodatna geometrija srca (lastno delo Evklida, CC BY-SA 4.0 kot izpeljani model): Z-Anatomy ima zadnji listič mitralne
# zaklopke z eno papilarno mišico, trikuspidalni zaklopki manjka sprednji listič, mesnatih trabekul in septomarginalne
# trabekule ni. Vse dodamo kot pravo geometrijo, poravnano na obroče zaklopk in stene prekatov iz Z-Anatomy.
# Kliče izvozi-organe.py (cfg »dodaj«: ["srce_dodatki"]); koordinate so Blenderjeve (metri, Z gor, -Y spredaj).
# Anatomija (preverjeno z učbeniško anatomijo, ne kopirano): mitralna zaklopka ima dva lističa (sprednji/aortni in zadnji)
# in dve papilarni mišici (sprednjo-stransko in zadnjo-sredinsko), tetive vsake mišice gredo na oba lističa;
# trikuspidalna ima tri lističe (sprednji, zadnji/spodnji, septalni) in tri papilarne mišice; levi prekat ima drobnejše
# trabekule (zlasti ob konici), desni grobe trabekule in septomarginalno trabekulo od pretina do sprednje papilarne mišice.
import bmesh, math, random, re
import numpy as np
from mathutils import Vector, Matrix
from mathutils.bvhtree import BVHTree


def _bvh(me):
    bm = bmesh.new(); bm.from_mesh(me); t = BVHTree.FromBMesh(bm); bm.free()
    return t


def _mreza(osnovni, rx):
    return next((r[1] for r in osnovni if re.search(rx, r[0])), None)


def _tocke(me):
    return np.array([tuple(v.co) for v in me.vertices])


def robne_zanke(me):
    """Zanke odprtih robov (obroči zaklopk na stenah prekatov): [(središče, polmer, normala, točke po vrsti)]."""
    bm = bmesh.new(); bm.from_mesh(me); bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-6)
    sos = {}
    for e in bm.edges:
        if not e.is_manifold:
            a, b = e.verts; sos.setdefault(a.index, []).append(b.index); sos.setdefault(b.index, []).append(a.index)
    co = {v.index: v.co.copy() for v in bm.verts}; bm.free()
    videno, zanke = set(), []
    for s in sos:
        if s in videno:
            continue
        pot, u, prej = [], s, None
        while u is not None and u not in videno:  # sledimo zanki po vrsti
            videno.add(u); pot.append(co[u])
            nasl = [w for w in sos[u] if w != prej and w not in videno]
            prej, u = u, (nasl[0] if nasl else None)
        if len(pot) < 8:
            continue
        P = np.array([tuple(p) for p in pot]); c = P.mean(0)
        n = np.linalg.svd(P - c)[2][2]
        zanke.append((Vector(c), float(np.linalg.norm(P - c, axis=1).mean()), Vector(n), [Vector(p) for p in P]))
    return sorted(zanke, key=lambda z: -len(z[3]))


def cev(bm, tocke, polmeri, seg=8, pokrovi=True):
    """Cev vzdolž lomljenke (gladki prerezi, vzporedni prenos okvirja, da se cev ne zvija)."""
    n = len(tocke)
    if n < 2:
        return
    t0 = (tocke[1] - tocke[0]).normalized()
    ref = t0.orthogonal().normalized()
    obroci = []
    for i, p in enumerate(tocke):
        t = (tocke[min(i + 1, n - 1)] - tocke[max(i - 1, 0)]).normalized()
        ref = (ref - t * ref.dot(t)).normalized()
        b = t.cross(ref)
        obroci.append([bm.verts.new(p + (ref * math.cos(2 * math.pi * k / seg) + b * math.sin(2 * math.pi * k / seg)) * polmeri[i]) for k in range(seg)])
    for a, b in zip(obroci, obroci[1:]):
        for k in range(seg):
            bm.faces.new((a[k], a[(k + 1) % seg], b[(k + 1) % seg], b[k]))
    if pokrovi:
        for o, p in ((obroci[0], tocke[0]), (obroci[-1], tocke[-1])):
            c = bm.verts.new(p)
            for k in range(seg):
                bm.faces.new((o[k], o[(k + 1) % seg], c) if o is obroci[-1] else (o[(k + 1) % seg], o[k], c))


def _krivulja(a, b, c, k=12):
    """Kvadratna Bézierjeva krivulja a → b skozi kontrolno c."""
    return [a * (1 - t) ** 2 + c * 2 * t * (1 - t) + b * t * t for t in (i / (k - 1) for i in range(k))]


def _novo(bm, ime):
    import bpy
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(ime); bm.to_mesh(me); bm.free()
    for p in me.polygons:
        p.use_smooth = True
    return me


def _vrh_papilarne(me, proti):
    """Vrh papilarne mišice: oglišče, najbližje točki `proti` (obroč zaklopke); dno: najbolj oddaljeno."""
    P = _tocke(me); d = np.linalg.norm(P - np.array(proti), axis=1)
    return Vector(P[d.argmin()]), Vector(P[d.argmax()])


def listic(obroc_lok, konica, globina, sredisce, debelina=0.0008, vrstic=10):
    """Listič zaklopke iz loka obroča: ploskev visi proti konici prekata (odprta zaklopka v diastoli), globina je
    največja na sredini loka (polkrožni ali štirikotni listič), prosti rob rahlo nazobčan. Vrne (bm, prosti rob)."""
    bm = bmesh.new()
    n = len(obroc_lok)
    mreza = []
    rob = []
    for i, a in enumerate(obroc_lok):
        t = i / (n - 1)
        g = globina * (0.35 + 0.65 * math.sin(math.pi * t) ** 0.7) * (1 + 0.06 * math.sin(t * 31))
        smer = (konica - a).normalized()
        noter = (sredisce - a); noter -= smer * noter.dot(smer)
        vrsta = []
        for k in range(vrstic):
            s = k / (vrstic - 1)
            # listič se najprej spusti ob steni, nato rahlo zavije proti sredini odprtine (trebuh lističa)
            p = a + smer * g * s + noter * (0.22 * math.sin(math.pi * s * 0.9))
            vrsta.append(bm.verts.new(p))
        mreza.append(vrsta); rob.append(vrsta[-1].co.copy())
    for i in range(n - 1):
        for k in range(vrstic - 1):
            bm.faces.new((mreza[i][k], mreza[i + 1][k], mreza[i + 1][k + 1], mreza[i][k + 1]))
    bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=1, use_grid_fill=True, smooth=1.0)
    geo = bmesh.ops.solidify(bm, geom=bm.faces[:], thickness=debelina)
    del geo
    return bm, rob


def tetive(bm, rob, vrhovi, polmer=0.00035, na_rob=3):
    """Tetive: iz vrha papilarne mišice (vrhovi: [(točka, delež loka od, do)]) se razvejijo na prosti rob lističa."""
    n = len(rob)
    for vrh, od, do in vrhovi:
        izbor = [i for i in range(n) if od <= i / (n - 1) <= do][::na_rob]
        # glavna debla (po 2 vlakni na deblo): razcep na približno 60 % poti
        for j in range(0, len(izbor), 2):
            konci = [rob[i] for i in izbor[j:j + 2]]
            sred = sum(konci, Vector()) / len(konci)
            razcep = vrh.lerp(sred, 0.62)
            cev(bm, _krivulja(vrh, razcep, vrh.lerp(razcep, 0.5) + Vector((0, 0, 0.0004)), 8), [polmer * 1.5] * 8, seg=6)
            for k in konci:
                cev(bm, _krivulja(razcep, k, razcep.lerp(k, 0.5), 7), [polmer] * 7, seg=6)


def papilarna(bm, dno, vrh, polmer):
    """Papilarna mišica: stožčasto telo z dvema glavama (vrhovoma), dno zraščeno s steno."""
    os_ = vrh - dno
    pravo = os_.orthogonal().normalized() * polmer * 0.55
    for zamik in (pravo, -pravo):
        k = 14
        tocke = [dno.lerp(vrh, i / (k - 1)) + zamik * (i / (k - 1)) ** 1.5 for i in range(k)]
        polm = [polmer * (1.15 - 0.75 * (i / (k - 1)) ** 1.3) for i in range(k)]
        cev(bm, tocke, polm, seg=12)
    return [vrh + pravo, vrh - pravo]


def trabekule(bm, stena, sredisce, os_, rnd, stevilo, polmer, dolzina, od=0.35, do=1.0, odmik=0.45):
    """Mesnate trabekule: grebeni in mostički po notranji steni prekata (na steno pritisnjene cevi, ki sledijo površini).
    Začetke izberemo z žarki iz votline (prvi zadetek = notranja stena), smer je pretežno vzdolž dolge osi s šumom;
    od/do = delež razdalje od baze (0) do konice (1), kjer trabekule rastejo (gostejše proti konici)."""
    baza, konica = sredisce, sredisce + os_
    L = os_.length; e = os_.normalized()
    narejenih = 0; poskusov = 0
    while narejenih < stevilo and poskusov < stevilo * 40:
        poskusov += 1
        h = od + (do - od) * (1 - rnd.random() ** 1.6)
        sred = baza + e * L * h
        f = rnd.uniform(0, 2 * math.pi)
        a = e.orthogonal().normalized(); b = e.cross(a)
        d = (a * math.cos(f) + b * math.sin(f) + e * rnd.uniform(-0.25, 0.4)).normalized()
        hit = stena.ray_cast(sred, d, 0.08)
        if hit[0] is None:
            continue
        p, n = hit[0], hit[1]
        if n.dot(d) > 0:
            n = -n  # normala proti votlini
        smer = (e * rnd.choice((1, -1)) + (a * math.cos(f + 1.6) + b * math.sin(f + 1.6)) * rnd.uniform(-0.8, 0.8)).normalized()
        dl = dolzina * rnd.uniform(0.6, 1.3)
        r = polmer * rnd.uniform(0.7, 1.35)
        k = max(6, int(dl / (r * 1.2)))
        tocke = []
        q = p.copy(); nn = n
        ok = True
        for i in range(k):
            tocke.append(q + nn * r * odmik)
            smer = (smer - nn * smer.dot(nn) + Vector([rnd.gauss(0, 0.18) for _ in range(3)])).normalized()
            q2 = q + smer * dl / k
            loc, nrm, _, dist = stena.find_nearest(q2)
            if loc is None or dist > r * 4:
                ok = False; break
            if nrm.dot(nn) < 0:
                nrm = -nrm
            q, nn = loc, nrm
        if not ok or len(tocke) < 5:
            continue
        # mostiček: sredina dvignjena od stene (prava trabekula, pod njo prostor), sicer greben ob steni
        if rnd.random() < 0.35:
            m = len(tocke)
            for i in range(m):
                tocke[i] = tocke[i] + n * r * 1.6 * math.sin(math.pi * i / (m - 1))
        polm = [r * (0.75 + 0.25 * math.sin(math.pi * i / (len(tocke) - 1))) for i in range(len(tocke))]
        cev(bm, tocke, polm, seg=7)
        narejenih += 1
    return narejenih


def odebeli_steno(me, dodatek, rob=(0.004, 0.014), korakov=6):
    """Odebeli steno prekata (debela odprta lupina) navznoter: notranja ploskev (endokard) se premakne v votlino za
    `dodatek` metrov; zunanja ploskev (in s tem obris srca, venčne žile, maščoba) ostane. Ob obročih zaklopk (odprti
    robovi) se premik zmanjša na 0 (`rob` = od, do v metrih), da obroči in lističi ostanejo na mestu; v ozki votlini
    (konica) je premik največ 35 % razdalje do nasprotne stene. Notranja ploskev = žarek po normali zadene isto mrežo
    (votlina je zaprta), zunanja = žarek pobegne; razvrstitev zgladimo po sosedih (posamezni žarki skozi odprtine).
    Vrne (premaknjenih oglišč, debelina prej v mm, mediana)."""
    from mathutils.kdtree import KDTree
    bm = bmesh.new(); bm.from_mesh(me)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-6)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.verts.ensure_lookup_table(); bm.normal_update()
    tree = BVHTree.FromBMesh(bm)
    n = len(bm.verts)
    rob_v = [v.co.copy() for v in bm.verts if any(not e.is_manifold for e in v.link_edges)]
    kd = KDTree(len(rob_v))
    for i, p in enumerate(rob_v): kd.insert(p, i)
    kd.balance()

    def zadetek(p, d, dl):
        h = tree.ray_cast(p + d * 2e-5, d, dl)
        return h[3] if h[0] is not None else None

    # usmerjenost lupine: normale navzven, če večina žarkov po normali pobegne (sicer obrnemo predznak)
    vzorec = bm.verts[:][:: max(1, n // 800)]
    s = 1.0 if sum(zadetek(v.co, v.normal, 0.2) is None for v in vzorec) >= len(vzorec) / 2 else -1.0
    smeri = [Vector(d).normalized() for d in ((1, 1, 1), (1, 1, -1), (1, -1, 1), (1, -1, -1), (-1, 1, 1), (-1, 1, -1), (-1, -1, 1), (-1, -1, -1))]
    notri = np.zeros(n); votlina = np.full(n, 1.0); debel = []
    for v in bm.verts:
        nn = v.normal * s
        dv = zadetek(v.co, nn, 0.12)  # notranja: zadene nasprotno steno votline
        dz = zadetek(v.co, -nn, 0.03)  # skozi steno: debelina
        if dv is None or dz is None:
            continue
        # točka pred steno mora biti v zaprti votlini (ne v vbočenem delu zunanje ploskve): ≥ 6 od 8 žarkov zadene steno
        p = v.co + nn * min(dv / 2, 0.005)
        if sum(zadetek(p, d, 0.12) is not None for d in smeri) >= 6:
            notri[v.index] = 1.0; votlina[v.index] = dv; debel.append(dz)
    e = np.array([(ed.verts[0].index, ed.verts[1].index) for ed in bm.edges], dtype=np.int64).reshape(-1, 2)
    st = np.maximum(np.bincount(e.ravel(), minlength=n), 1)

    def gladi(A, k):
        for _ in range(k):
            A = 0.5 * A + 0.5 * (np.bincount(e[:, 0], weights=A[e[:, 1]], minlength=n) + np.bincount(e[:, 1], weights=A[e[:, 0]], minlength=n)) / st
        return A
    notri = (gladi(notri, 3) > 0.5).astype(float)
    w = np.zeros(n)
    for v in bm.verts:
        if notri[v.index]:
            d = kd.find(v.co)[2] if rob_v else 1.0
            t = min(1.0, max(0.0, (d - rob[0]) / (rob[1] - rob[0])))
            w[v.index] = min(dodatek * t * t * (3 - 2 * t), 0.35 * votlina[v.index])
    w = gladi(w, korakov) * notri  # gladek prehod, zunanja ploskev ostane
    for v in bm.verts:
        if w[v.index] > 0:
            v.co += v.normal * s * w[v.index]
    bm.to_mesh(me); bm.free()
    return int((w > 1e-5).sum()), float(np.median(debel) * 1000) if debel else 0.0


def srce_dodatki(osnovni, cfg, tmp):
    rnd = random.Random(23)
    lv, rv = _mreza(osnovni, r"^Left ventricle$"), _mreza(osnovni, r"^Right ventricle$")
    if lv is None or rv is None:
        print("[organi] srce_dodatki: ni prekatov, preskočeno"); return []
    # Debelina stene (cfg stena = {prekat: dodatek v m}): vir ima LV ≈ 9 mm, RV ≈ 3 mm; učbeniško LV 10–15 mm,
    # RV 3–5 mm (≈ 3×). Najprej stena, nato lističi, mišice in trabekule (prilegajo se novi notranji ploskvi).
    for rx, me in ((r"^Left", lv), (r"^Right", rv)):
        dod = next((d for k, d in cfg.get("stena", {}).items() if re.search(rx, k)), 0)
        if dod:
            k, prej = odebeli_steno(me, dod)
            print(f"[organi] srce: stena {rx[1:]} +{dod * 1000:.1f} mm ({k} oglišč, prej mediana {prej:.1f} mm)")
    zl, zd = robne_zanke(lv), robne_zanke(rv)
    # levi prekat: mitralni obroč = zanka, ki se ujema z odprtino levega preddvora; aortni = najbližje korenu aorte
    aorta = _mreza(osnovni, r"^Ascending aorta$")
    ac = Vector(_tocke(aorta).mean(0)) if aorta else Vector()
    kand = [z for z in zl[1:] if 0.010 < z[1] < 0.022]
    aortni = min(kand, key=lambda z: (z[0] - ac).length)
    mitralni = next(z for z in kand if z is not aortni)
    trik = next(z for z in zd[1:] if 0.012 < z[1] < 0.024)
    P_lv = _tocke(lv)
    konica_l = Vector(P_lv[np.linalg.norm(P_lv - np.array(mitralni[0]), axis=1).argmax()])
    P_rv = _tocke(rv)
    konica_d = Vector(P_rv[np.linalg.norm(P_rv - np.array(trik[0]), axis=1).argmax()])
    vrstice = []

    def lok_brez(zanka, zasedeno, rob=0.0025):
        """Del obroča, ki ga ne pokriva noben obstoječi listič (prost lok za novi listič), po vrsti."""
        drevesa = [_bvh(m) for m in zasedeno]
        prosto = [min(t.find_nearest(p)[3] for t in drevesa) > rob for p in zanka[3]]
        n = len(prosto)
        # najdaljši krožni niz prostih točk
        naj, zac = 0, 0
        for s in range(n):
            if prosto[s] and not prosto[s - 1]:
                k = 0
                while prosto[(s + k) % n] and k < n:
                    k += 1
                if k > naj:
                    naj, zac = k, s
        return [zanka[3][(zac + i) % n] for i in range(naj)]

    # --- mitralna zaklopka: sprednji (aortni) listič in sprednja-stranska papilarna mišica
    zadnji = _mreza(osnovni, r"^Posterior leaflet of left atrioventricular")
    pap_z = _mreza(osnovni, r"^Inferior papillary muscle of left ventricle")
    lok = lok_brez(mitralni, [zadnji])
    if len(lok) > 6:
        # sprednja-stranska mišica: zrcalno k zadnji-sredinski čez ravnino skozi dolgo os in pretin (prosta stena)
        e = (konica_l - mitralni[0]).normalized()
        vrh_z, dno_z = _vrh_papilarne(pap_z, mitralni[0])
        c_rv = Vector(P_rv.mean(0)); pre = (c_rv - mitralni[0]); pre = (pre - e * pre.dot(e)).normalized()
        def zrcali(p):
            d = p - mitralni[0]; a = e * d.dot(e); r = d - a
            ravn = pre.cross(e).normalized()  # normala ravnine, ki vsebuje os in smer pretina
            return mitralni[0] + a + r - ravn * 2 * r.dot(ravn)
        dno_n, vrh_n = zrcali(dno_z), zrcali(vrh_z)
        stena = _bvh(lv)
        loc = stena.find_nearest(dno_n)[0]
        if loc is not None:
            dno_n = loc
        bm = bmesh.new()
        polm = 0.6 * max(0.004, (_tocke(pap_z).max(0) - _tocke(pap_z).min(0)).min() / 2)
        glave = papilarna(bm, dno_n, vrh_n, polm)
        vrstice.append(["Anterolateral papillary muscle of left ventricle (lastno)", _novo(bm, "pap-al"), "miokard", "papilarne-misice",
                        "Anterolateral papillary muscle of left ventricle (lastno) / Left ventricle / Heart.g"])
        bm, rob = listic(lok, konica_l, globina=0.021, sredisce=mitralni[0])
        # vsaka mišica oskrbuje svojo polovico lističa (komisuri: sprednja-stranska in zadnja-sredinska)
        d0 = (rob[0] - vrh_n).length < (rob[0] - vrh_z).length
        tetive(bm, rob, [(glave[0], 0.0, 0.55) if d0 else (vrh_z, 0.0, 0.55), (vrh_z, 0.45, 1.0) if d0 else (glave[0], 0.45, 1.0)])
        vrstice.append(["Anterior leaflet of left atrioventricular valve (lastno)", _novo(bm, "mitr-spr"), "zaklopka", "av-zaklopki",
                        "Anterior leaflet of left atrioventricular valve (lastno) / Left atrioventricular valve.g / Heart.g"])
        # zadnji listič dobi še tetive s sprednje-stranske mišice (Z-Anatomy ima samo tiste z zadnje-sredinske)
        P = _tocke(zadnji); d = np.linalg.norm(P - np.array(mitralni[0]), axis=1)
        prosti = [Vector(p) for p in P[d > np.percentile(d, 93)]]
        prosti = sorted(prosti, key=lambda p: (p - vrh_n).length)[:24][::4]
        bm = bmesh.new()
        for k in prosti:
            raz = glave[1].lerp(k, 0.6)
            cev(bm, _krivulja(glave[1], raz, glave[1].lerp(raz, 0.5), 7), [0.0005] * 7, seg=6)
            cev(bm, _krivulja(raz, k, raz.lerp(k, 0.5), 6), [0.00035] * 6, seg=6)
        vrstice.append(["Chordae tendineae of posterior mitral leaflet (lastno)", _novo(bm, "tet-mz"), "zaklopka", "av-zaklopki",
                        "Chordae tendineae of posterior mitral leaflet (lastno) / Left atrioventricular valve.g / Heart.g"])
        print(f"[organi] srce: mitralni sprednji listič na loku {len(lok)} točk, nova papilarna mišica")
    # --- trikuspidalna zaklopka: sprednji listič
    obstojeci = [m for m in (_mreza(osnovni, r"^Septal leaflet of right atrioventricular"), _mreza(osnovni, r"^Inferior leaflet of right atrioventricular")) if m]
    lok = lok_brez(trik, obstojeci)
    pap_s = _mreza(osnovni, r"^Anterior papillary muscle of right ventricle")
    pap_i = _mreza(osnovni, r"^Inferior papillary muscle of right ventricle")
    if len(lok) > 6 and pap_s:
        vs, ds = _vrh_papilarne(pap_s, trik[0])
        vi = _vrh_papilarne(pap_i, trik[0])[0] if pap_i else vs
        bm, rob = listic(lok, konica_d, globina=0.022, sredisce=trik[0])
        a_blize = (rob[0] - vs).length < (rob[-1] - vs).length
        tetive(bm, rob, [(vs, 0.0, 0.7) if a_blize else (vs, 0.3, 1.0), (vi, 0.7, 1.0) if a_blize else (vi, 0.0, 0.3)])
        vrstice.append(["Anterior leaflet of right atrioventricular valve (lastno)", _novo(bm, "trik-spr"), "zaklopka", "av-zaklopki",
                        "Anterior leaflet of right atrioventricular valve (lastno) / Right atrioventricular valve.g / Heart.g"])
        # septomarginalna trabekula: od pretina (spodnji del) do dna sprednje papilarne mišice
        stena_d = _bvh(rv)
        e = (konica_d - trik[0])
        c_lv = Vector(P_lv.mean(0))
        izhod = trik[0] + e * 0.55
        h = stena_d.ray_cast(izhod, (c_lv - izhod).normalized(), 0.06)
        if h[0] is not None:
            a, b = h[0] - (c_lv - izhod).normalized() * 0.001, ds
            sred = a.lerp(b, 0.5) + (trik[0] - a.lerp(b, 0.5)).normalized() * 0.003
            tocke = _krivulja(a, b, sred, 16)
            bm = bmesh.new()
            cev(bm, tocke, [0.0024 - 0.0006 * math.sin(math.pi * i / 15) for i in range(16)], seg=10)
            vrstice.append(["Septomarginal trabecula (lastno)", _novo(bm, "sm-trab"), "miokard", "trabekule",
                            "Septomarginal trabecula (lastno) / Right ventricle / Heart.g"])
        print(f"[organi] srce: trikuspidalni sprednji listič na loku {len(lok)} točk")
    # --- mesnate trabekule: levi prekat drobnejše (ob konici), desni grobe
    for ime, me, obroc, konica, n, r, dl in (("left", lv, mitralni, konica_l, 70, 0.0011, 0.024), ("right", rv, trik, konica_d, 48, 0.0015, 0.028)):
        bm = bmesh.new()
        st = trabekule(bm, _bvh(me), obroc[0] + (konica - obroc[0]) * 0.12, (konica - obroc[0]) * 0.92, rnd, n, r, dl)
        vrstice.append([f"Trabeculae carneae of {ime} ventricle (lastno)", _novo(bm, "trab-" + ime), "miokard", "trabekule",
                        f"Trabeculae carneae of {ime} ventricle (lastno) / {ime.title()} ventricle / Heart.g"])
        print(f"[organi] srce: trabekule {ime}: {st}")
    return vrstice

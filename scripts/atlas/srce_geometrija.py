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


def obrezi_listic(me, obroc, globina):
    """Z-Anatomy ima lističe AV-zaklopk s tetivami kot sklenjene bele »jezike« (pahljače) do papilarnih mišic. Obdržimo
    samo jadro lističa: ploskve, katerih vsa oglišča so največ `globina` od obroča (točke zanke); tetive nato naredimo
    kot prave tanke razvejane vrvice (tetive()). Vrne število odstranjenih oglišč (pregled #461 B2-3)."""
    from mathutils.kdtree import KDTree
    kd = KDTree(len(obroc)); [kd.insert(p, i) for i, p in enumerate(obroc)]; kd.balance()
    bm = bmesh.new(); bm.from_mesh(me)
    dalec = [v for v in bm.verts if kd.find(v.co)[2] > globina]
    n = len(dalec)
    if n and n < len(bm.verts) * 0.8:
        bmesh.ops.delete(bm, geom=dalec, context="VERTS")
        bm.to_mesh(me)
    else:
        n = 0
    bm.free(); me.update()
    return n


def _vrh_papilarne(me, proti):
    """Vrh papilarne mišice: oglišče, najbližje točki `proti` (obroč zaklopke); dno: najbolj oddaljeno."""
    P = _tocke(me); d = np.linalg.norm(P - np.array(proti), axis=1)
    return Vector(P[d.argmin()]), Vector(P[d.argmax()])


def listic(obroc_lok, konica, globina, sredisce, debelina=0.0008, vrstic=10, trebuh=0.22):
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
            p = a + smer * g * s + noter * (trebuh * math.sin(math.pi * s * 0.9))
            vrsta.append(bm.verts.new(p))
        mreza.append(vrsta); rob.append(vrsta[-1].co.copy())
    for i in range(n - 1):
        for k in range(vrstic - 1):
            bm.faces.new((mreza[i][k], mreza[i + 1][k], mreza[i + 1][k + 1], mreza[i][k + 1]))
    bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=1, use_grid_fill=True, smooth=1.0)
    geo = bmesh.ops.solidify(bm, geom=bm.faces[:], thickness=debelina)
    del geo
    return bm, rob


def _tetiva_ok(a, b, os_=None, najvec=0.03):
    """Tetiva ne sme biti daljša od 3 cm in (če je os prekata podana) ne vodoravno čez votlino (kot z osjo < 65°)."""
    d = b - a
    if d.length > najvec or d.length < 1e-4:
        return False
    return os_ is None or abs(d.normalized().dot(os_)) > 0.42


def tetive(bm, rob, vrhovi, polmer=0.0003, na_rob=2, os_=None):
    """Tetive: tanke posamične niti (Ø ≈ 0,6 mm, debla ≈ 1 mm; pretanke so v peki dobile črne pike, pregled B2) iz vrha papilarne mišice (vrhovi: [(točka, delež loka
    od, do)]); vsako deblo se na ~55–70 % poti pahljačasto razveji v 3 niti do prostega roba lističa."""
    n = len(rob)
    rnd = random.Random(len(rob) * 7 + len(vrhovi))
    for vrh, od, do in vrhovi:
        izbor = [i for i in range(n) if od <= i / (n - 1) <= do][::na_rob]
        for j in range(0, len(izbor), 3):
            konci = [rob[i] for i in izbor[j:j + 3]]
            konci = [k for k in konci if _tetiva_ok(vrh, k, os_)]
            if not konci:
                continue
            sred = sum(konci, Vector()) / len(konci)
            razcep = vrh.lerp(sred, rnd.uniform(0.55, 0.7))
            zac = vrh + (sred - vrh).normalized() * 0.0008 + Vector([rnd.uniform(-1, 1) * 0.0008 for _ in range(3)])
            cev(bm, _krivulja(zac, razcep, zac.lerp(razcep, 0.5), 8), [polmer * 1.8 - polmer * 0.5 * i / 7 for i in range(8)], seg=6)
            for k in konci:
                cev(bm, _krivulja(razcep, k, razcep.lerp(k, 0.5), 7), [polmer * (1.15 - 0.3 * i / 6) for i in range(7)], seg=6)


def papilarna(bm, dno, vrh, polmer, stena=None):
    """Papilarna mišica: stožec, zraščen s steno prekata (široko dno, vgreznjeno ≈ 3 mm v steno, da ni reže), ki se
    zoži v dve glavi (vrhova) za tetive. stena: BVH stene prekata (dno se pritrdi na najbližjo točko stene)."""
    if stena is not None:  # prvi zadetek žarka iz vrha proti dnu = notranja ploskev stene (ne zunanja)
        h = stena.ray_cast(vrh, (dno - vrh).normalized(), 0.09)
        loc = h[0] if h[0] is not None else stena.find_nearest(dno)[0]
        if loc is not None:
            dno = loc
    os_ = vrh - dno
    dno = dno - os_.normalized() * 0.0015  # vgreznjeno v steno (ne prebije zunanje ploskve)
    os_ = vrh - dno
    pravo = os_.orthogonal().normalized() * polmer * 0.45
    k = 16
    deblo = [dno.lerp(vrh, 0.78 * i / (k - 1)) for i in range(k)]
    # stožec: široko dno se zlije s steno (≈ 2,3 r), proti glavam se zoži (Netter: stožčaste, ne valji)
    cev(bm, deblo, [polmer * (2.3 - 1.65 * (i / (k - 1)) ** 0.55) for i in range(k)], seg=16)
    glave = []
    tretje = os_.cross(pravo).normalized() * polmer * 0.45
    for zamik in (pravo, -pravo * 0.5 + tretje * 0.87, -pravo * 0.5 - tretje * 0.87):  # 3 glave (Netter: 2–3)
        a = dno.lerp(vrh, 0.62)
        tocke = [a.lerp(vrh, i / 7) + zamik * (i / 7) ** 1.3 for i in range(8)]
        cev(bm, tocke, [polmer * (0.66 - 0.54 * (i / 7) ** 1.4) for i in range(8)], seg=10)  # glava se zoži v vrh tetiv
        glave.append(tocke[-1])
    return glave


def trabekule(bm, stena, sredisce, os_, rnd, stevilo, polmer, dolzina, od=0.35, do=1.0, odmik=-0.35, epi=None, mosticki=0.0, pretin=None):
    """Mesnate trabekule: grebeni in mostički po notranji steni prekata (na steno pritisnjene cevi, ki sledijo površini).
    Začetke izberemo z žarki iz votline (prvi zadetek = notranja stena), smer je pretežno vzdolž dolge osi s šumom;
    od/do = delež razdalje od baze (0) do konice (1), kjer trabekule rastejo (gostejše proti konici).
    Pregled #461 B2: grebeni so napol v steni (odmik < 0), sploščeni in na koncih zoženi v steno (brez ravno odrezanih
    valjev v prerezu), brez prosto visečih mostičkov; pretin (središče drugega prekata) v zgornjih dveh tretjinah ostane
    gladek (prerez pretina = enotna mišica)."""
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
        if epi is not None:  # zadetek mora biti notranja stena (endokard), ne epikard ob konici (os sega do zunanje konice)
            loc, _, fi, dd = epi[0].find_nearest(p, 0.004)
            if loc is not None and (dd < 0.0025 or (p - loc).dot(epi[1][fi]) > -0.0025):
                continue
        if pretin is not None and h < 0.7 and d.dot((pretin - sred).normalized()) > 0.45:
            continue  # septalna stran zgoraj: gladka
        if n.dot(d) > 0:
            n = -n  # normala proti votlini
        smer = (e * rnd.choice((1, -1)) + (a * math.cos(f + 1.6) + b * math.sin(f + 1.6)) * rnd.uniform(-0.8, 0.8)).normalized()
        dl = dolzina * rnd.uniform(0.6, 1.3)
        r = polmer * rnd.uniform(0.7, 1.35)
        k = max(6, int(dl / (r * 1.2)))
        tocke = []; normale = []
        q = p.copy(); nn = n
        ok = True
        for i in range(k):
            tocke.append(q + nn * r * odmik); normale.append(nn.copy())
            smer = (smer - nn * smer.dot(nn) + Vector([rnd.gauss(0, 0.18) for _ in range(3)])).normalized()
            q2 = q + smer * dl / k
            loc, nrm, _, dist = stena.find_nearest(q2)
            if loc is None or dist > r * 4:
                ok = False; break
            if nrm.dot(nn) < 0:
                nrm = -nrm
            if epi is not None:  # greben ne sme zaviti čez rob na zunanjo ploskev
                le, _, fi, dd = epi[0].find_nearest(loc, 0.004)
                if le is not None and (dd < 0.0025 or (loc - le).dot(epi[1][fi]) > -0.0025):
                    ok = False; break
            q, nn = loc, nrm
        if not ok or len(tocke) < 5:
            continue
        # mostiček: sredina dvignjena od stene (prava trabekula, pod njo prostor), sicer greben ob steni
        if rnd.random() < mosticki:
            m = len(tocke)
            for i in range(m):
                tocke[i] = tocke[i] + n * r * 1.6 * math.sin(math.pi * i / (m - 1))
        polm = [r * (0.2 + 0.8 * max(0.0, math.sin(math.pi * i / (len(tocke) - 1))) ** 0.7) for i in range(len(tocke))]  # konca v steno
        # sploščen greben (širši ob steni kot visok): prerez elipsa 1 : 0,55 v smeri normale stene
        zac = len(bm.verts)
        cev(bm, tocke, polm, seg=7)
        bm.verts.ensure_lookup_table()
        for v in bm.verts[zac:]:
            i = min(range(len(tocke)), key=lambda j: (tocke[j] - v.co).length_squared)
            q = v.co - tocke[i]
            v.co = v.co - normale[i] * q.dot(normale[i]) * 0.62
        narejenih += 1
    return narejenih


def odebeli_steno(me, dodatek, rob=(0.004, 0.014), korakov=6):
    """Odebeli steno prekata (debela odprta lupina) navznoter: notranja ploskev (endokard) se premakne v votlino za
    `dodatek` metrov; zunanja ploskev (in s tem obris srca, venčne žile, maščoba) ostane. Ob obročih zaklopk (odprti
    robovi) se premik zmanjša na 0 (`rob` = od, do v metrih), da obroči in lističi ostanejo na mestu; v ozki votlini
    (konica) je premik največ 35 % razdalje do nasprotne stene. Razvrstitev notranja/zunanja ploskev (spodaj) zgladimo
    po sosedih (posamezni žarki skozi odprtine). Vrne (premaknjenih oglišč, mediana debeline prej v mm)."""
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

    # Smer skozi steno = krajši od žarkov po ±normali (stena je tanjša od votline), druga smer gleda v votlino.
    # Notranja ploskev: žarek v votlino zadene nasprotno steno in točka pred steno je v zaprti votlini (≥ 6 od 8 žarkov
    # zadene isto mrežo; vbočen del zunanje ploskve tega ne izpolni).
    smeri = [Vector(d).normalized() for d in ((1, 1, 1), (1, 1, -1), (1, -1, 1), (1, -1, -1), (-1, 1, 1), (-1, 1, -1), (-1, -1, 1), (-1, -1, -1))]
    notri = np.zeros(n); votlina = np.full(n, 1.0); debel = []; smer_v = [None] * n
    for v in bm.verts:
        a_, b_ = zadetek(v.co, v.normal, 0.12), zadetek(v.co, -v.normal, 0.12)
        if a_ is None or b_ is None:
            continue
        nn, dv, dz = (v.normal, a_, b_) if a_ > b_ else (-v.normal, b_, a_)
        if dz > 0.03 or dv < 1.5 * dz:
            continue
        p = v.co + nn * min(dv / 2, 0.005)
        if sum(zadetek(p, d, 0.12) is not None for d in smeri) >= 6:
            notri[v.index] = 1.0; votlina[v.index] = dv; debel.append(dz); smer_v[v.index] = nn.copy()
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
            nn = smer_v[v.index]
            if nn is None:  # notranja šele po glajenju: predznak normale po sosedih
                ref = sum((smer_v[u.index] for ed in v.link_edges for u in ed.verts if smer_v[u.index] is not None), Vector())
                nn = v.normal if v.normal.dot(ref) >= 0 else -v.normal
            v.co += nn * w[v.index]
    bm.to_mesh(me); bm.free()
    return int((w > 1e-5).sum()), float(np.median(debel) * 1000) if debel else 0.0


def epikard(mreze):
    """BVH zunanje ploskve srca (epikard) in zunanja normala po ploskvi: ploskev sten votlin (mreze), pri kateri VSI žarki
    v stožcu okoli ene strani normale (5 smeri) pobegnejo iz sten (notranja ploskev ima kvečjemu posamezen žarek skozi
    odprtino zaklopke). Vrne (BVH, [normala navzven])."""
    V2, F2, off = [], [], 0
    for me in mreze:
        V2 += [v.co.copy() for v in me.vertices]; F2 += [[off + i for i in p.vertices] for p in me.polygons]; off += len(me.vertices)
    T = BVHTree.FromPolygons(V2, F2, epsilon=0.0)
    F, N, off = [], [], 0
    for me in mreze:
        for p in me.polygons:
            c, n = Vector(p.center), Vector(p.normal)
            if n.length < 0.5:
                continue
            a = n.orthogonal().normalized(); b = n.cross(a)
            for s in (1, -1):
                smeri = [n * s] + [(n * s + q * 0.45).normalized() for q in (a, -a, b, -b)]
                if all(T.ray_cast(c + d * 3e-5, d, 0.3)[0] is None for d in smeri):
                    F.append([off + i for i in p.vertices]); N.append(n * s); break
        off += len(me.vertices)
    return BVHTree.FromPolygons(V2, F, epsilon=0.0), N


def pod_epikard(me, epi, globina):
    """Oglišča notranje strukture (papilarne mišice, trabekule), ki segajo do epikarda ali skozenj, potisne na globino
    `globina` pod zunanjo ploskev (pregled #461: konice mišic in trakovi trabekul so prebadali spodnjo steno). Vrne število
    premaknjenih oglišč."""
    tree, N = epi
    k = 0
    for v in me.vertices:
        loc, _, i, d = tree.find_nearest(v.co, 0.03)
        if loc is None:
            continue
        s = (v.co - loc).dot(N[i])  # > 0: zunaj srca
        if s > -globina:
            v.co = v.co - N[i] * (s + globina); k += 1
    me.update()
    return k


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
    stene = [m for m in (lv, rv, _mreza(osnovni, r"^Left atrium$"), _mreza(osnovni, r"^Right atrium$")) if m is not None]
    epi = epikard(stene)
    # levi prekat: mitralni obroč = zanka, ki se ujema z odprtino levega preddvora; aortni = najbližje korenu aorte
    aorta = _mreza(osnovni, r"^Ascending aorta$")
    ac = Vector(_tocke(aorta).mean(0)) if aorta else Vector()
    kand = [z for z in zl[1:] if 0.010 < z[1] < 0.022]
    aortni = min(kand, key=lambda z: (z[0] - ac).length)
    mitralni = next(z for z in kand if z is not aortni)
    trik = next(z for z in zd[1:] if 0.012 < z[1] < 0.024)
    # jadra lističev Z-Anatomy brez pahljač tetiv: zadnji mitralni ≈ 1,4 cm, septalni in spodnji trikuspidalni ≈ 1,6 cm
    for rx, obroc, gl in ((r"^Posterior leaflet of left atrioventricular", mitralni, 0.014),
                          (r"^Septal leaflet of right atrioventricular", trik, 0.013),
                          (r"^Inferior leaflet of right atrioventricular", trik, 0.014)):
        me_l = _mreza(osnovni, rx)
        if me_l is not None:
            print(f"[organi] srce: {rx[1:30]}…: obrezano {obrezi_listic(me_l, obroc[3], gl)} oglišč pahljače")
    P_lv = _tocke(lv)
    konica_l = Vector(P_lv[np.linalg.norm(P_lv - np.array(mitralni[0]), axis=1).argmax()])
    P_rv = _tocke(rv)
    konica_d = Vector(P_rv[np.linalg.norm(P_rv - np.array(trik[0]), axis=1).argmax()])
    vrstice = []
    # štirivotlinski prerez: ravnina skozi konico levega prekata ter središči mitralnega in trikuspidalnega obroča
    # (izvozi-organe.py jo zapiše v <organ>.vozlisca.json → prerez.ravnine v srce.json)
    cfg["_tocke4"] = [konica_l.copy(), mitralni[0].copy(), trik[0].copy()]

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
        bm = bmesh.new()
        polm = 0.6 * max(0.004, (_tocke(pap_z).max(0) - _tocke(pap_z).min(0)).min() / 2)
        glave = papilarna(bm, dno_n, vrh_n, polm, stena)
        vrstice.append(["Anterolateral papillary muscle of left ventricle (lastno)", _novo(bm, "pap-al"), "miokard", "papilarne-misice",
                        "Anterolateral papillary muscle of left ventricle (lastno) / Left ventricle / Heart.g"])
        bm, rob = listic(lok, konica_l, globina=0.018, sredisce=mitralni[0], trebuh=0.3)
        # vsaka mišica oskrbuje svojo polovico lističa (komisuri: sprednja-stranska in zadnja-sredinska)
        d0 = (rob[0] - vrh_n).length < (rob[0] - vrh_z).length
        tetive(bm, rob, [(glave[0], 0.0, 0.55) if d0 else (vrh_z, 0.0, 0.55), (vrh_z, 0.45, 1.0) if d0 else (glave[0], 0.45, 1.0)], os_=e)
        vrstice.append(["Anterior leaflet of left atrioventricular valve (lastno)", _novo(bm, "mitr-spr"), "zaklopka", "av-zaklopki",
                        "Anterior leaflet of left atrioventricular valve (lastno) / Left atrioventricular valve.g / Heart.g"])
        # zadnji listič dobi še tetive s sprednje-stranske mišice (Z-Anatomy ima samo tiste z zadnje-sredinske)
        P = _tocke(zadnji); d = np.linalg.norm(P - np.array(mitralni[0]), axis=1)
        prosti = [Vector(p) for p in P[d > np.percentile(d, 93)]]
        # prosti rob po kotu okoli osi obroča, vsak drugi; vsak par dobi deblo s svoje (bližje) mišice, ki se razcepi v 2
        a_ = mitralni[2].orthogonal().normalized(); b_ = mitralni[2].cross(a_)
        prosti.sort(key=lambda p: math.atan2((p - mitralni[0]).dot(b_), (p - mitralni[0]).dot(a_)))
        prosti = prosti[::max(1, len(prosti) // 20)][:20]
        bm = bmesh.new()
        for j in range(0, len(prosti) - 1, 2):
            k1, k2 = prosti[j], prosti[j + 1]; sred = (k1 + k2) / 2
            vrh = min((glave[1], vrh_z), key=lambda q: (q - sred).length)
            if not (_tetiva_ok(vrh, k1, e) and _tetiva_ok(vrh, k2, e)):
                continue
            raz = vrh.lerp(sred, 0.6)
            cev(bm, _krivulja(vrh, raz, vrh.lerp(raz, 0.5), 7), [0.0005] * 7, seg=6)
            for k in (k1, k2):
                cev(bm, _krivulja(raz, k, raz.lerp(k, 0.5), 6), [0.0003] * 6, seg=6)
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
        tetive(bm, rob, [(vs, 0.0, 0.7) if a_blize else (vs, 0.3, 1.0), (vi, 0.7, 1.0) if a_blize else (vi, 0.0, 0.3)], os_=(konica_d - trik[0]).normalized())
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
    # --- tetive septalnega in spodnjega lističa trikuspidalne zaklopke (Z-Anatomy jih nima): s prostega roba lističa do
    # vrha najbližje papilarne mišice (septalni listič: septalna mišica, če obstaja), deblo se razcepi v 2 niti
    pap_sep = _mreza(osnovni, r"^Septal papillary muscle of right ventricle")
    vrhovi_d = [(_vrh_papilarne(m, trik[0])[0]) for m in (pap_s, pap_i, pap_sep) if m is not None]
    for rx, ime in ((r"^Septal leaflet of right atrioventricular", "septal"), (r"^Inferior leaflet of right atrioventricular", "inferior")):
        me_l = _mreza(osnovni, rx)
        if me_l is None or not vrhovi_d:
            continue
        P = _tocke(me_l); d = np.linalg.norm(P - np.array(trik[0]), axis=1)
        prosti = [Vector(p) for p in P[d > np.percentile(d, 92)]]
        # enakomerno po robu: urejeno po kotu okoli osi obroča
        a = trik[2].orthogonal().normalized(); b = trik[2].cross(a)
        prosti.sort(key=lambda p: math.atan2((p - trik[0]).dot(b), (p - trik[0]).dot(a)))
        prosti = prosti[::max(1, len(prosti) // 16)][:16]
        bm = bmesh.new()
        for j in range(0, len(prosti) - 1, 2):
            k1, k2 = prosti[j], prosti[j + 1]
            sred = (k1 + k2) / 2
            vrh = min(vrhovi_d, key=lambda q: (q - sred).length) if ime == "inferior" or pap_sep is None else _vrh_papilarne(pap_sep, trik[0])[0]
            e_d = (konica_d - trik[0]).normalized()
            if not (_tetiva_ok(vrh, k1, e_d) and _tetiva_ok(vrh, k2, e_d)):
                continue
            raz = vrh.lerp(sred, 0.62)
            cev(bm, _krivulja(vrh, raz, vrh.lerp(raz, 0.5), 7), [0.0005] * 7, seg=6)
            for k in (k1, k2):
                cev(bm, _krivulja(raz, k, raz.lerp(k, 0.5), 6), [0.0003] * 6, seg=6)
        vrstice.append([f"Chordae tendineae of {ime} tricuspid leaflet (lastno)", _novo(bm, "tet-t" + ime[0]), "zaklopka", "av-zaklopki",
                        f"Chordae tendineae of {ime} tricuspid leaflet (lastno) / Right atrioventricular valve.g / Heart.g"])
    # --- prevodni sistem (shematsko, raven študija): sinusni vozel ob ustju zgornje votle vene (zgornji del desnega
    # preddvora, pod epikardom), AV-vozel v pretinu nad trikuspidalnim obročem, Hisov snop čez vrh mišičnega pretina,
    # desni krak po desni strani pretina proti septomarginalni trabekuli in konici, levi krak po levi strani pretina
    # (dva fascikla). Tanke cevi tik pod endokardom (Ø ≈ 1,5–2 mm), vidne v prerezu.
    ra = _mreza(osnovni, r"^Right atrium$")
    c_lv, c_rv = Vector(P_lv.mean(0)), Vector(P_rv.mean(0))
    t_lv, t_rv = _bvh(lv), _bvh(rv)

    def po_pretinu(t, od, do, cilj, k=14, f0=0.0, f1=1.0, zamik=Vector()):
        pot = []
        for i in range(k):
            q = od.lerp(do, f0 + (f1 - f0) * i / (k - 1)) + zamik * (i / (k - 1))
            d = (cilj - q).normalized()
            h = t.ray_cast(q, d, 0.06)
            if h[0] is not None:
                pot.append(h[0] - d * 0.0007)
        return pot
    bm = bmesh.new(); kosov = 0
    desni = po_pretinu(t_rv, trik[0], konica_d, c_lv, 16, 0.05, 0.8)
    if len(desni) > 4:
        cev(bm, desni, [0.0008] * len(desni), seg=6); kosov += 1
        av = desni[0]
        e_l = (konica_l - mitralni[0])
        for zm in (e_l.cross(Vector((0, 0, 1))).normalized() * 0.008, -e_l.cross(Vector((0, 0, 1))).normalized() * 0.008):
            levi = po_pretinu(t_lv, mitralni[0], konica_l, c_rv, 14, 0.1, 0.75, zm)
            if len(levi) > 4:
                cev(bm, _krivulja(av, levi[0], av.lerp(levi[0], 0.5), 6) + levi[1:], [0.0008] * (len(levi) + 5), seg=6); kosov += 1
        cev(bm, [av + Vector((0, 0, 0.0015)) * (i / 5) for i in range(6)], [0.0016 - 0.0004 * i / 5 for i in range(6)], seg=10)  # AV-vozel
    if ra is not None:
        P_ra = _tocke(ra); zg = P_ra[P_ra[:, 2] > np.percentile(P_ra[:, 2], 93)]
        sa = Vector(zg[zg[:, 0].argmin()]); c_ra = Vector(P_ra.mean(0))
        sa = sa + (c_ra - sa).normalized() * 0.0026  # v steni pod epikardom (ne kapsula na površini, pregled #461)
        cev(bm, [sa + Vector((0, 0, -0.012)) * (i / 7) for i in range(8)], [0.0009 + 0.0006 * math.sin(math.pi * i / 7) for i in range(8)], seg=10)
        kosov += 1
    if kosov:
        vrstice.append(["Conducting system of heart (lastno)", _novo(bm, "prevodni"), "prevodni", "prevodni-sistem",
                        "Conducting system of heart (lastno) / Heart.g"])
        print(f"[organi] srce: prevodni sistem ({kosov} kosov)")
    else:
        bm.free()
    # --- mesnate trabekule: levi prekat drobnejše (ob konici), desni grobe
    # Netter/Sobotta: grebeni in mostički, zraščeni s steno; levi prekat finejši (gostejši proti konici), desni grobi
    for ime, me, obroc, konica, n, r, dl, dr in (("left", lv, mitralni, konica_l, 44, 0.0013, 0.022, rv), ("right", rv, trik, konica_d, 28, 0.0018, 0.026, lv)):
        bm = bmesh.new()
        st = trabekule(bm, _bvh(me), obroc[0] + (konica - obroc[0]) * 0.12, (konica - obroc[0]) * 0.92, rnd, n, r, dl, epi=epi,
                       pretin=Vector(_tocke(dr).mean(0)))
        vrstice.append([f"Trabeculae carneae of {ime} ventricle (lastno)", _novo(bm, "trab-" + ime), "miokard", "trabekule",
                        f"Trabeculae carneae of {ime} ventricle (lastno) / {ime.title()} ventricle / Heart.g"])
        print(f"[organi] srce: trabekule {ime}: {st}")
    # --- papilarne mišice Z-Anatomy (v votlini plavajoči valji) zamenjamo s stožci, zraščenimi s steno; vrh ostane,
    # da se tetive lističev Z-Anatomy še vedno pripenjajo nanj
    zamenjaj = set()
    for r in osnovni:
        if re.search(r"papillary muscle of (left|right) ventricle$", r[0]) and "(lastno)" not in r[0]:
            prek, obroc = (lv, mitralni) if "left" in r[0] else (rv, trik)
            vrh, dno = _vrh_papilarne(r[1], obroc[0])
            P = _tocke(r[1]); polm = 0.55 * max(0.0035, (P.max(0) - P.min(0)).min() / 2)
            bm = bmesh.new(); papilarna(bm, dno, vrh, polm, _bvh(prek))
            vrstice.append([r[0] + " (lastno)", _novo(bm, "pap"), "miokard", "papilarne-misice", r[0] + " (lastno) / " + r[4].split(" / ", 1)[-1]])
            zamenjaj.add(r[0])
    # --- polmesečasti zaklopki (aortna, pljučna): trije tanki žepki (Z-Anatomy ima debele bloke)
    pt = _mreza(osnovni, r"^Pulmonary trunk$")
    for rx, obroc, ime, del_ in ((r"^(Right|Left) coronary leaflet$|^Non-coronary leaflet$", aortni, "aortic", "aortna-zaklopka"),
                                 (r"semilunar leaflet of pulmonary valve$", None, "pulmonary", "pljucna-zaklopka")):
        stari = [r for r in osnovni if re.search(rx, r[0])]
        if not stari:
            continue
        c = Vector(np.concatenate([_tocke(r[1]) for r in stari]).mean(0))
        if obroc is None and pt is not None:
            zz = sorted(robne_zanke(pt), key=lambda z: (z[0] - c).length)
            if not zz:
                continue
            obroc = zz[0]
        os_ = obroc[2] if obroc[2].dot(c - obroc[0]) > 0 else -obroc[2]
        if (c - obroc[0]).dot(os_) < 0.002:
            os_ = (c - obroc[0]).normalized() if (c - obroc[0]).length > 0.003 else os_
        sred = obroc[0] + os_ * max(0.004, (c - obroc[0]).dot(os_))
        R = obroc[1] - 0.0006
        bm = bmesh.new(); semilunarni(bm, sred, os_, R)
        # tkivo »zep«: brez pečene teksture (pljučni žepki so dobili modro sivo marmorirano peko od debla, pregled B2)
        vrstice.append([f"Semilunar cusps of {ime} valve (lastno)", _novo(bm, "zep-" + ime), "zep", del_,
                        f"Semilunar cusps of {ime} valve (lastno) / Heart.g"])
        zamenjaj |= {r[0] for r in stari}
        print(f"[organi] srce: {ime} zaklopka: 3 žepki, R = {R * 1000:.1f} mm")
    osnovni[:] = [r for r in osnovni if r[0] not in zamenjaj]
    # mišice (papilarne, trabekule) ne smejo prebiti epikarda: ≥ 1,5 mm pod zunanjo ploskvijo (lističev ne premikamo:
    # ob obročih zaklopk je razvrstitev zunaj/znotraj negotova)
    for r in vrstice:
        if r[2] != "miokard":
            continue
        k = pod_epikard(r[1], epi, 0.0015)
        if k:
            print(f"[organi] srce: {r[0]}: {k} oglišč pod epikard")
    return vrstice


def semilunarni(bm, sred, os_, R, debelina=0.00045, nt=26, nu=11):
    """Polmesečasta zaklopka (zaprta): trije žepki. Pritrjeni rob je lok v obliki črke U na steni (komisure zgoraj,
    dno žepka spodaj), prosti rob gre od komisure do središča (stik treh lističev v obliki Y), trebuh žepka se povesi
    proti prekatu. Ploskev dobi debelino (tanek prosojen listič, ne blok)."""
    a = os_.orthogonal().normalized(); b = os_.cross(a)
    for k in range(3):
        f0 = 2 * math.pi * k / 3 + 0.3
        mreza = []
        for i in range(nt):
            t = i / (nt - 1)
            f = f0 + t * 2 * math.pi / 3
            rad = a * math.cos(f) + b * math.sin(f)
            A = sred + rad * R + os_ * R * (0.42 - 0.85 * math.sin(math.pi * t) ** 0.9)  # pritrjeni rob (U)
            fe = f0 if t < 0.5 else f0 + 2 * math.pi / 3  # prosti rob ob črti stika (Y)
            re_ = a * math.cos(fe) + b * math.sin(fe)
            F = sred + re_ * R * abs(2 * t - 1) * 0.97 + os_ * R * (0.30 + 0.06 * math.sin(math.pi * t))
            vrsta = []
            for j in range(nu):
                u = j / (nu - 1)
                p = A.lerp(F, u) - os_ * R * 0.32 * math.sin(math.pi * u) * math.sin(math.pi * t) ** 0.7
                vrsta.append(bm.verts.new(p))
            mreza.append(vrsta)
        nove = []
        for i in range(nt - 1):
            for j in range(nu - 1):
                nove.append(bm.faces.new((mreza[i][j], mreza[i + 1][j], mreza[i + 1][j + 1], mreza[i][j + 1])))
        bmesh.ops.solidify(bm, geom=nove, thickness=debelina)


# ---------- deli sten (raven Študij, pregled #461 B10): srčni ušesi, medprekatni pretin, conus arteriosus ----------
def _razcepi(me, maska, ime):
    """Ploskve z maska[i] = True prestavi v novo mrežo (ista oglišča, brez vrzeli); vrne novo mrežo ali None."""
    import bpy
    if not any(maska) or all(maska):
        return None
    bm = bmesh.new(); bm.from_mesh(me)
    bm.faces.ensure_lookup_table()
    novo = bm.copy()
    novo.faces.ensure_lookup_table()
    bmesh.ops.delete(novo, geom=[f for f in novo.faces if not maska[f.index]], context="FACES")
    bmesh.ops.delete(bm, geom=[f for f in bm.faces if maska[f.index]], context="FACES")
    bm.to_mesh(me); bm.free()
    out = bpy.data.meshes.new(ime); novo.to_mesh(out); novo.free()
    for p in out.polygons:
        p.use_smooth = True
    return out


def _sredisca(me):
    return np.array([tuple(p.center) for p in me.polygons])


def pretin_trden(me, t_rv, smer, najvec=0.016, rez=0.0003):
    """Medprekatni pretin kot zaprto mišično telo (j 6. 11.: »pravo srce, razrezano na pol«). V Z-Anatomy je pretin
    samo septalna ploskev levega prekata; septalna ploskev desnega prekata je del desnega prekata, vmes (≈ 1 cm) ni
    zaprte mreže, zato prerez pretina ni bil poln (tanka črta namesto ≈ 1 cm mišice). Vsako oglišče premaknemo po normali
    proti desnemu prekatu do njegove septalne ploskve (žarek; manjkajoče in skoke zgladimo po sosedih), naredimo kopijo
    ploskve tik pred njo (`rez` m) in obe zašijemo ob robu. Vrne (oglišč, mediana debeline v mm)."""
    bm = bmesh.new(); bm.from_mesh(me)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-6)
    bm.verts.ensure_lookup_table(); bm.normal_update()
    n = len(bm.verts); s = Vector(smer)
    D = np.full(n, np.nan); N = []
    for v in bm.verts:
        nn = v.normal if v.normal.dot(s) >= 0 else -v.normal
        nn = (nn + s * 0.5).normalized()
        N.append(nn)
        h = t_rv.ray_cast(v.co + nn * 2e-5, nn, najvec)
        if h[0] is not None and h[3] > 0.003:
            D[v.index] = h[3]
    med = float(np.nanmedian(D)) if np.isfinite(D).any() else 0.009
    D = np.where(np.isfinite(D), D, med)
    e = np.array([(ed.verts[0].index, ed.verts[1].index) for ed in bm.edges], dtype=np.int64).reshape(-1, 2)
    st = np.maximum(np.bincount(e.ravel(), minlength=n), 1)
    for _ in range(6):  # skoki (žarek skozi vrzel v septalni ploskvi desnega prekata) se zgladijo
        D = 0.5 * D + 0.5 * (np.bincount(e[:, 0], weights=D[e[:, 1]], minlength=n) + np.bincount(e[:, 1], weights=D[e[:, 0]], minlength=n)) / st
    D = np.clip(D, 0.004, najvec)
    rob = [ed for ed in bm.edges if ed.is_boundary]
    stare = list(bm.faces); orig = list(bm.verts)
    dup = bmesh.ops.duplicate(bm, geom=orig + list(bm.edges) + stare)
    vmap = dup["vert_map"]
    for i, v in enumerate(orig):
        vmap[v].co = v.co + N[i] * (D[i] - rez)
    nove = [f for f in dup["geom"] if isinstance(f, bmesh.types.BMFace)]
    bmesh.ops.reverse_faces(bm, faces=nove)
    for ed in rob:
        a, b = ed.verts
        try:
            bm.faces.new((a, b, vmap[b], vmap[a]))
        except ValueError:
            pass
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me); bm.free(); me.update()
    for p in me.polygons:
        p.use_smooth = True
    return n, med * 1000


def _stena_znotraj(me, votlina):
    """Funkcija p → predznačena razdalja do stene (< 0 = v mišici stene). Normale mreže usmerimo enotno, predznak pa
    izberemo tako, da je točka `votlina` (v prekatu) zunaj mišice."""
    bm = bmesh.new(); bm.from_mesh(me); bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-6)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    t = BVHTree.FromBMesh(bm); bm.free()

    def s(p):
        loc, nrm, _, d = t.find_nearest(p, 0.05)
        return 1.0 if loc is None else (p - loc).dot(nrm)
    znak = 1.0 if votlina is None or s(Vector(votlina)) >= 0 else -1.0
    return lambda p: znak * s(p)


def izrezi_vgrajeno(me, stene, globina=0.0003):
    """Odstrani ploskve notranje strukture (trabekule, papilarne mišice), ki so v celoti v mišici stene (globlje od
    `globina`). Vgrajena polovica grebena je bila v prerezu vidna kot svetla površina SREDI reza stene in je prekrila
    pokrov (rez stene LV je bil videti ≈ 5 mm namesto ≈ 12 mm). Vrne število odstranjenih ploskev."""
    bm = bmesh.new(); bm.from_mesh(me)
    notri = {v: any(f(v.co) < -globina for f in stene) for v in bm.verts}
    proc = [f for f in bm.faces if all(notri[v] for v in f.verts)]
    k = len(proc)
    if proc and k < len(bm.faces):
        bmesh.ops.delete(bm, geom=proc, context="FACES")
        bm.to_mesh(me); me.update()
    else:
        k = 0
    bm.free()
    return k


def srce_razdeli(osnovni, cfg, tmp):
    """Srčni ušesi (auricula dextra/sinistra) kot dela: ploskve preddvora v krogli okoli konice ušesa (levo: najbolj
    spredaj in levo, ovija levi rob pljučnega debla; desno: najbolj spredaj in zgoraj, ob korenu aorte), ki so na strani
    ušesa (od središča preddvora). Medprekatni pretin: ploskve levega prekata na strani desnega prekata, ki niso epikard
    (notranja septalna ploskev in skriti stik), s pars membranacea (tanka vezivna ploščica Ø ≈ 1 cm tik pod aortnim
    obročem). Conus arteriosus: ploskve desnega prekata do 2,2 cm pod obročem pljučne zaklopke; crista
    supraventricularis: mišični greben na notranji steni desnega prekata med trikuspidalnim in pljučnim ustjem."""
    po = {r[0]: r for r in osnovni}
    vrstice = []
    lv, rv = po.get("Left ventricle"), po.get("Right ventricle")
    la, ra = po.get("Left atrium"), po.get("Right atrium")
    stene = [r[1] for r in (lv, rv, la, ra) if r]
    if len(stene) < 4:
        return []
    epi_t, epi_n = epikard(stene)
    # --- ušesi
    for r, ime, del_, smer, R_ in ((la, "Left auricle", "levo-srcno-uho", np.array([0.35, -1.0, 0.1]), 0.021),
                                   (ra, "Right auricle", "desno-srcno-uho", np.array([-0.1, -1.0, 0.55]), 0.024)):
        P = _tocke(r[1]); c = P.mean(0)
        tip = P[((P - c) @ (smer / np.linalg.norm(smer))).argmax()]
        C = _sredisca(r[1])
        os_ = (tip - c) / np.linalg.norm(tip - c)
        maska = (np.linalg.norm(C - tip, axis=1) < R_) & (((C - c) @ os_) > 0.45 * np.linalg.norm(tip - c))
        me = _razcepi(r[1], list(maska), ime)
        if me is not None:
            vrstice.append([ime, me, "miokard", del_, f"{ime} (lastno) / {r[0]} / Heart.g"])
            print(f"[organi] srce: {ime}: {int(maska.sum())} ploskev")
    # --- medprekatni pretin (iz levega prekata)
    P_lv, P_rv = _tocke(lv[1]), _tocke(rv[1])
    c_lv, c_rv = P_lv.mean(0), P_rv.mean(0)
    smer = (c_rv - c_lv) / np.linalg.norm(c_rv - c_lv)
    t_rv = _bvh(rv[1])
    C = _sredisca(lv[1])
    zun = np.zeros(len(C), bool)
    for i, q in enumerate(C):
        loc, _, fi, d = epi_t.find_nearest(Vector(q), 0.0012)
        zun[i] = loc is not None and d < 0.0008
    blizu = np.array([(t_rv.find_nearest(Vector(q), 0.016)[3] or 1) < 0.015 for q in C])
    maska = blizu & (((C - c_lv) @ smer) > 0.004) & ~zun
    me = _razcepi(lv[1], list(maska), "septum")
    if me is not None:
        k_, deb = pretin_trden(me, t_rv, Vector(smer))
        vrstice.append(["Interventricular septum", me, "miokard", "medprekatni-pretin", "Interventricular septum (lastno) / Heart.g"])
        print(f"[organi] srce: medprekatni pretin: {int(maska.sum())} ploskev, trdno telo, debelina mediana {deb:.1f} mm")
    pretin_me = me
    zl = robne_zanke(lv[1]); zd = robne_zanke(rv[1])
    aorta = po.get("Aorta")
    if aorta and zl:
        ac = Vector(_tocke(aorta[1]).mean(0))
        aortni = min(zl[1:] or zl, key=lambda z: (z[0] - ac).length)
        # pars membranacea: na septalni steni levega prekata tik pod aortnim obročem (proti desnemu prekatu)
        d = Vector(smer)
        h = _bvh(me if me is not None else lv[1]).ray_cast(aortni[0] - aortni[2] * 0.0 + Vector((0, 0, -0.006)), d, 0.04)
        if h[0] is not None:
            nn = -d; a = nn.orthogonal().normalized(); b = nn.cross(a)
            bm = bmesh.new(); k = 24
            rob = [bm.verts.new(h[0] + nn * 0.0004 + (a * math.cos(2 * math.pi * i / k) * 0.0055 + b * math.sin(2 * math.pi * i / k) * 0.0042)) for i in range(k)]
            c_ = bm.verts.new(h[0] + nn * 0.0004)
            for i in range(k):
                bm.faces.new((rob[i], rob[(i + 1) % k], c_))
            bmesh.ops.solidify(bm, geom=bm.faces[:], thickness=0.0006)
            vrstice.append(["Membranous part of interventricular septum", _novo(bm, "pars-membr"), "vez", "medprekatni-pretin",
                            "Membranous part of interventricular septum (lastno) / Heart.g"])
    # --- conus arteriosus in crista supraventricularis (desni prekat)
    pt = po.get("Pulmonary trunk and left pulmonary artery") or po.get("Pulmonary trunk")
    trik = next((z for z in zd[1:] if 0.012 < z[1] < 0.024), None)
    if pt and zd:
        p0 = Vector(_tocke(pt[1])[_tocke(pt[1])[:, 2].argmin()])
        pulm = min(zd, key=lambda z: (z[0] - p0).length)
        C = _sredisca(rv[1])
        n_ = pulm[2] if pulm[2].dot(Vector(c_rv) - pulm[0]) < 0 else -pulm[2]  # od prekata proti deblu
        pod = (C - np.array(pulm[0])) @ np.array(n_)
        maska = (pod < 0.002) & (pod > -0.022) & (np.linalg.norm(C - np.array(pulm[0]), axis=1) < 0.03)
        me = _razcepi(rv[1], list(maska), "conus")
        if me is not None:
            vrstice.append(["Conus arteriosus", me, "miokard", "conus-arteriosus", "Conus arteriosus (lastno) / Right ventricle / Heart.g"])
            print(f"[organi] srce: conus arteriosus: {int(maska.sum())} ploskev")
        if trik is not None:
            t_r = _bvh(rv[1]); cc = Vector(c_rv)
            pot = []
            for i in range(12):
                q = trik[0].lerp(pulm[0], 0.15 + 0.7 * i / 11) + (Vector(c_lv) - cc).normalized() * 0.004
                dd = (q - cc).normalized(); h = t_r.ray_cast(cc, dd, 0.06)
                if h[0] is not None:
                    pot.append(h[0] - dd * 0.0012)
            if len(pot) > 5:
                bm = bmesh.new(); cev(bm, pot, [0.0028 * (0.6 + 0.4 * math.sin(math.pi * i / (len(pot) - 1))) for i in range(len(pot))], seg=10)
                vrstice.append(["Supraventricular crest", _novo(bm, "crista-sv"), "miokard", "conus-arteriosus",
                                "Supraventricular crest (lastno) / Right ventricle / Heart.g"])
    # --- vgrajene polovice trabekul in papilarnih mišic v mišici sten odstranimo (prerez stene je poln, brez svetlih lis)
    if trik is not None:
        P_r = _tocke(rv[1]); apex_r = Vector(P_r[np.linalg.norm(P_r - np.array(trik[0]), axis=1).argmax()])
        vot_r = trik[0].lerp(apex_r, 0.35)
    else:
        vot_r = Vector(c_rv)
    stene_f = [_stena_znotraj(lv[1], Vector(c_lv)), _stena_znotraj(rv[1], vot_r)]
    if pretin_me is not None:
        stene_f.append(_stena_znotraj(pretin_me, Vector(c_lv)))
    for r in osnovni:
        if r[3] in ("trabekule", "papilarne-misice") or re.search(r"^Supraventricular crest", r[0]):
            k = izrezi_vgrajeno(r[1], stene_f)
            if k:
                print(f"[organi] srce: {r[0][:40]}: {k} vgrajenih ploskev odstranjenih")
    for r in vrstice:
        if re.search(r"^Supraventricular crest", r[0]):
            k = izrezi_vgrajeno(r[1], stene_f)
            print(f"[organi] srce: {r[0][:40]}: {k} vgrajenih ploskev odstranjenih")
    return vrstice

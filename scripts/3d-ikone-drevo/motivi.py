"""Motivi 31 ikon drevesa 3D sveta. Vsak motiv gradi v izhodišču, okvir in senco uredi ikone.py.
Barve vedno prek J.mat(vloga): glavna, druga, nevtralna, kovina, steklo, sij (glej jedro.PALETE)."""
import bpy, bmesh, math, os
from mathutils import Vector, Euler, Matrix
import jedro as J
from jedro import mat, krogla, ico, valj, stozec, kapsula, cev, torus, mreza, list_ploskev, uvozi_glb, fib_sfera, nakljucno, gladko, dodeli, v_koren, barva

GLB = os.environ.get("IKONE_GLB", "")          # mapa public/3d/modeli
TELO = os.environ.get("IKONE_TELO", "")        # mapa z razširjenimi (brez meshopt) telo/*.glb


def koren_rot(x=0, y=0, z=0):
    J.KOREN.rotation_euler = (math.radians(x), math.radians(y), math.radians(z))


def podmotiv(fn, lok, merilo, rot=None):
    """Zgradi motiv fn v svoji skupini (ohrani njegovo lastno rotacijo), jo premakne in poveča."""
    stari = J.KOREN
    e = bpy.data.objects.new("pod", None)
    bpy.context.scene.collection.objects.link(e)
    e.parent = stari
    J.KOREN = e
    try:
        fn()
    finally:
        J.KOREN = stari
    e.location = lok
    e.scale = (merilo, merilo, merilo)
    if rot is not None:
        e.rotation_euler = tuple(math.radians(x) for x in rot)
    return e


def prosojna(vloga="glavna", ton=0.25, prozornost=0.75, ime="prosojna"):
    """Prosojna »membrana« v barvi vloge (vsebina celice se vidi)."""
    m = bpy.data.materials.new(ime)
    m.use_nodes = True
    P = m.node_tree.nodes.get("Principled BSDF")
    P.inputs["Base Color"].default_value = mat(vloga, ton).node_tree.nodes.get("Principled BSDF").inputs["Base Color"].default_value
    P.inputs["Roughness"].default_value = 0.18
    P.inputs["Transmission Weight"].default_value = prozornost
    P.inputs["IOR"].default_value = 1.33
    P.inputs["Coat Weight"].default_value = 0.4
    return m


# =============================================================== glavne veje

def heliks(R, th, z):
    return Vector((R * math.cos(th), R * math.sin(th), z))


def dnk(obr=1.5, n_bp=15):
    """Dvojna vijačnica kot molekulski model: ogrodje iz atomov, bazni pari kot ploščice."""
    ogr = [mat("glavna", -0.3, True), mat("glavna", -0.12, True), mat("glavna", 0.15, True)]
    baza1 = mat("nevtralna", 0.0, True)
    baza2 = mat("glavna", 0.45, True)
    R, H, zamik = 0.72, 2.9 * obr / 1.5, 2.45
    for niz in range(2):
        L = 2 * math.pi * R * obr
        k_n = int(math.hypot(L, H) / 0.105)
        for k in range(k_n + 1):
            t = k / k_n
            p = heliks(R, t * obr * 2 * math.pi + niz * zamik, (t - 0.5) * H)
            krogla(p, 0.115 if k % 3 else 0.13, ogr[(k + niz) % 3], seg=32)
    for k in range(n_bp):
        t = (k + 0.5) / n_bp
        th = t * obr * 2 * math.pi
        z = (t - 0.5) * H
        a = heliks(R * 0.93, th, z)
        b = heliks(R * 0.93, th + zamik, z)
        s_ = a + (b - a) * (0.45 + 0.1 * (k % 2))
        for (u, v, m) in ((a, s_, baza1 if k % 2 else baza2), (s_, b, baza2 if k % 2 else baza1)):
            d = v - u
            bpy.ops.mesh.primitive_cube_add(size=1, location=(u + v) / 2)
            o = bpy.context.active_object
            o.scale = (0.17, 0.06, d.length - 0.02)
            J.usmeri(o, u, v)
            bev = o.modifiers.new("rob", "BEVEL")
            bev.width = 0.025
            bev.segments = 4
            gladko(o)
            o.modifiers.new("ws", "WEIGHTED_NORMAL")
            dodeli(o, m)
            v_koren(o)


def m_biologija():
    dnk()
    koren_rot(0, -30, 15)


def jedro_atoma(rj=0.27, r=0.2):
    proton = mat("glavna", -0.1, True)
    nevtron = mat("nevtralna", -0.15, True)
    fi = (1 + 5 ** 0.5) / 2
    ico_ = []
    for a in (-1, 1):
        for b in (-fi, fi):
            ico_ += [(0, a, b), (a, b, 0), (b, 0, a)]
    krogla((0, 0, 0), r * 1.1, proton)
    for k, p in enumerate(ico_):
        krogla(Vector(p).normalized() * rj, r, nevtron if k in (1, 4, 6, 9, 11) else proton)


def m_kemija():
    jedro_atoma()
    orbita = mat("kovina")
    elektron = mat("sij")
    R = 1.4
    for k, kot in enumerate((0, 60, 120)):
        o = torus(R, 0.022, orbita, merilo=(1, 0.36, 1))
        o.rotation_euler = (0, 0, math.radians(kot))
        fi_e = math.radians((35, 160, 260)[k])
        lok = Vector((R * math.cos(fi_e), 0.36 * R * math.sin(fi_e), 0))
        lok.rotate(Euler((0, 0, math.radians(kot))))
        krogla(lok, 0.085, elektron)
    koren_rot(62, -8, -14)


def _ramp(nt, barve):
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    el = ramp.color_ramp.elements
    el[0].position, el[0].color = barve[0]
    el[1].position, el[1].color = barve[-1]
    for pos, c in barve[1:-1]:
        x = el.new(pos)
        x.color = c
    return ramp


def planet_mat(ime, svetlost=0.0, gostota=5.5):
    """Plinski velikan z razgibanimi pasovi v barvah sloga."""
    g, gt = J.barve_vloge("glavna")
    n, nt_ = J.barve_vloge("nevtralna")
    d, dt = J.barve_vloge("druga")
    m = bpy.data.materials.new(ime)
    m.use_nodes = True
    nt = m.node_tree
    p = nt.nodes.get("Principled BSDF")
    p.inputs["Roughness"].default_value = 0.5 if not J.je_kovinski() else 0.3
    p.inputs["Metallic"].default_value = 0.9 if J.je_kovinski() else 0.0
    p.inputs["Sheen Weight"].default_value = 0.3
    p.inputs["Sheen Tint"].default_value = barva(g, gt + 0.6)
    tc = nt.nodes.new("ShaderNodeTexCoord")
    nz = nt.nodes.new("ShaderNodeTexNoise")
    nz.inputs["Scale"].default_value = 3.0
    nz.inputs["Detail"].default_value = 8
    nz.inputs["Roughness"].default_value = 0.6
    nt.links.new(tc.outputs["Object"], nz.inputs["Vector"])
    mix = nt.nodes.new("ShaderNodeMix")
    mix.data_type = "VECTOR"
    mix.inputs[0].default_value = 0.08
    nt.links.new(tc.outputs["Object"], mix.inputs[4])
    nt.links.new(nz.outputs["Color"], mix.inputs[5])
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    nt.links.new(mix.outputs[1], sep.inputs[0])
    pas = nt.nodes.new("ShaderNodeTexNoise")
    pas.noise_dimensions = "1D"
    pas.inputs["Scale"].default_value = gostota
    pas.inputs["Detail"].default_value = 6
    nt.links.new(sep.outputs["Z"], pas.inputs["W"])
    if J.SLOG == "cist":
        barve = [(0.3, barva(g, gt - 0.45 + svetlost)), (0.42, barva(g, gt - 0.15 + svetlost)), (0.52, barva(g, gt + 0.2 + svetlost)),
                 (0.6, barva(g, gt + 0.5 + svetlost)), (0.72, barva(g, gt + 0.75 + svetlost))]
    else:
        barve = [(0.3, barva(d, dt - 0.25)), (0.42, barva(g, gt - 0.2)), (0.52, barva(g, gt)), (0.6, barva(g, gt + 0.3)), (0.72, barva(n, nt_))]
    ramp = _ramp(nt, barve)
    nt.links.new(pas.outputs["Fac"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], p.inputs["Base Color"])
    return m


def obroc_mat():
    g, gt = J.barve_vloge("glavna")
    n, nt_ = J.barve_vloge("nevtralna")
    m = bpy.data.materials.new("obroc")
    m.use_nodes = True
    nt = m.node_tree
    p = nt.nodes.get("Principled BSDF")
    p.inputs["Roughness"].default_value = 0.6
    p.inputs["Metallic"].default_value = 0.8 if J.je_kovinski("nevtralna") else 0.0
    tc = nt.nodes.new("ShaderNodeTexCoord")
    vl = nt.nodes.new("ShaderNodeVectorMath")
    vl.operation = "LENGTH"
    nt.links.new(tc.outputs["Object"], vl.inputs[0])
    nz = nt.nodes.new("ShaderNodeTexNoise")
    nz.noise_dimensions = "1D"
    nz.inputs["Scale"].default_value = 14
    nz.inputs["Detail"].default_value = 8
    nt.links.new(vl.outputs["Value"], nz.inputs["W"])
    a = _ramp(nt, [(0.3, (0.25, 0.25, 0.25, 1)), (0.7, (1, 1, 1, 1))])
    nt.links.new(nz.outputs["Fac"], a.inputs["Fac"])
    nt.links.new(a.outputs["Color"], p.inputs["Alpha"])
    c = nt.nodes.new("ShaderNodeMix")
    c.data_type = "RGBA"
    if J.SLOG == "cist":
        c.inputs[6].default_value = barva(g, gt - 0.15)
        c.inputs[7].default_value = barva(g, gt + 0.55)
    else:
        c.inputs[6].default_value = barva(g, gt - 0.1)
        c.inputs[7].default_value = barva(n, nt_)
    nt.links.new(nz.outputs["Fac"], c.inputs[0])
    nt.links.new(c.outputs[2], p.inputs["Base Color"])
    return m


def obroc(r1, r2, m, nagib=20, seg=256):
    bm = bmesh.new()
    zg = []
    for k in range(seg):
        a = 2 * math.pi * k / seg
        c, s = math.cos(a), math.sin(a)
        zg.append((bm.verts.new((r1 * c, r1 * s, 0)), bm.verts.new((r2 * c, r2 * s, 0))))
    for k in range(seg):
        a1, b1 = zg[k]
        a2, b2 = zg[(k + 1) % seg]
        bm.faces.new((a1, b1, b2, a2))
    me = bpy.data.meshes.new("obroc")
    bm.to_mesh(me)
    o = bpy.data.objects.new("obroc", me)
    bpy.context.scene.collection.objects.link(o)
    gladko(o)
    o.data.materials.append(m)
    o.rotation_euler = (math.radians(nagib), 0, 0)
    return v_koren(o)


def m_fizika():
    krogla((0, 0, 0), 0.82, planet_mat("planet"), seg=128)
    obroc(1.1, 1.78, obroc_mat())
    koren_rot(0, -20, 0)


def m_matematika():
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=1.0)
    o = bpy.context.active_object
    bev = o.modifiers.new("rob", "BEVEL")
    bev.width = 0.022
    bev.segments = 4
    bev.harden_normals = True
    o.modifiers.new("ws", "WEIGHTED_NORMAL")
    gladko(o)
    dodeli(o, mat("steklo"))
    v_koren(o)
    koren_rot(18, 12, -24)


# =============================================================== Biologija

def srce_glb(m_misica=None, m_zile=None, m_vene=None):
    m_misica = m_misica or mat("glavna", 0.0, True)
    m_zile = m_zile or mat("glavna", -0.25, True)
    m_vene = m_vene or mat("druga", -0.05, True)
    return uvozi_glb(os.path.join(GLB, "organi-3d/srce-telefon.glb"),
                     [("aort", m_zile), ("arter", m_zile), ("pulmonary trunk", m_zile), ("bifurcation", m_zile),
                      ("vein", m_vene), ("vena", m_vene), ("sinus", m_vene)], m_misica,
                     odstrani=("leaflet", "papillary", "valve", "chorda", "septum"))


def m_telo():
    srce_glb()
    koren_rot(0, 0, 15)


def virus_korona(r=0.8, n=44, seme=3):
    rnd = nakljucno(seme)
    o = ico((0, 0, 0), r, mat("glavna", -0.05, True), sub=5)
    tx = bpy.data.textures.new("grbe", "CLOUDS")
    tx.noise_scale = 0.18
    d = o.modifiers.new("grbe", "DISPLACE")
    d.texture = tx
    d.strength = 0.03
    pecelj = mat("glavna", 0.25, True)
    glava = mat("nevtralna", 0.0, True)
    for p in fib_sfera(n):
        p = p + Vector((rnd.uniform(-.05, .05), rnd.uniform(-.05, .05), rnd.uniform(-.05, .05)))
        p.normalize()
        a = p * (r * 0.97)
        b = p * (r + 0.2)
        valj(a, b, 0.028, pecelj, seg=12, rob=0)
        krogla(p * (r + 0.26), 0.075, glava, seg=20, merilo=(1, 1, 0.8))


def m_mikrobi():
    virus_korona()
    koren_rot(10, 0, 20)


def m_rastline():
    """Kalček: seme, ukrivljeno steblo in dva kličnika."""
    steblo = mat("glavna", 0.15, True)
    cev([(0, 0, -0.9), (0.05, 0, -0.45), (-0.05, 0, 0.0), (0.0, 0, 0.45), (0.0, 0, 0.7)], 0.07, steblo, polmeri=[1.2, 1.1, 1.0, 0.9, 0.8])
    seme = mat("druga", -0.1, True) if J.SLOG == "cist" else mat("druga")
    krogla((0.05, 0, -0.95), 0.32, seme, merilo=(1.15, 0.9, 0.75))
    for strani in (-1, 1):
        l = list_ploskev(1.05, 0.5, mat("glavna", 0.0, True), upogib=0.2, vbocenost=0.06, oblika=0.7)
        l.location = (0, 0, 0.68)
        l.rotation_euler = (math.radians(25), 0, math.radians(-90 * strani))
    # korenina
    cev([(0.05, 0, -1.1), (0.0, 0, -1.35), (0.1, 0, -1.6)], 0.035, mat("nevtralna", 0.0, True), polmeri=[1.0, 0.8, 0.4])
    koren_rot(28, 0, 20)


def metakroglice(ime, kroglice, m, prag=0.6, res=0.04):
    mb = bpy.data.metaballs.new(ime)
    mb.resolution = res
    mb.render_resolution = res
    mb.threshold = prag
    for (lok, r, mer) in kroglice:
        e = mb.elements.new()
        e.co = lok
        e.radius = r
        if mer:
            e.type = "ELLIPSOID"
            e.size_x, e.size_y, e.size_z = mer
    o = bpy.data.objects.new(ime, mb)
    bpy.context.scene.collection.objects.link(o)
    o.data.materials.append(m)
    # v mrežo, da dela okvir in gladko senčenje
    bpy.context.view_layer.objects.active = o
    o.select_set(True)
    bpy.ops.object.convert(target="MESH")
    o = bpy.context.active_object
    gladko(o)
    return v_koren(o)


def kromosom(lok, m, kot=0, dol=0.18):
    o1 = kapsula(Vector(lok) + Vector((-dol, 0, 0)), Vector(lok) + Vector((dol, 0, 0)), 0.035, m, seg=16)
    o1.rotation_euler = (0, math.radians(kot), math.radians(kot * 0.7))
    return o1


def m_procesi():
    """Celica med delitvijo (telofaza): dve hčerinski celici, zažeta brazda, kromosomi v obeh."""
    membrana = bpy.data.materials.new("membrana")
    membrana.use_nodes = True
    nt = membrana.node_tree
    P = nt.nodes.get("Principled BSDF")
    if J.SLOG == "cist":
        b = barva(J.SKUPINE[J.SK], 0.35)
    else:
        b = mat("glavna").node_tree.nodes.get("Principled BSDF").inputs["Base Color"].default_value
    P.inputs["Base Color"].default_value = b
    P.inputs["Roughness"].default_value = 0.15
    P.inputs["Transmission Weight"].default_value = 0.85
    P.inputs["IOR"].default_value = 1.35
    P.inputs["Coat Weight"].default_value = 0.4
    metakroglice("celica", [((-0.55, 0, 0), 1.0, (1.0, 0.95, 0.95)), ((0.55, 0, 0), 1.0, (1.0, 0.95, 0.95))], membrana, prag=0.55)
    krom = mat("druga", 0.0, True) if J.SLOG == "cist" else mat("druga")
    rnd = nakljucno(5)
    for stran in (-1, 1):
        for k in range(6):
            lok = (stran * (0.62 + rnd.uniform(-0.12, 0.12)), rnd.uniform(-0.3, 0.3), rnd.uniform(-0.3, 0.3))
            kromosom(lok, krom, kot=rnd.uniform(0, 180), dol=rnd.uniform(0.1, 0.17))
    koren_rot(0, -10, 15)


def m_atlas():
    """Prozorna človeška postava iz atlasa (koža kot motno steklo, okostje znotraj)."""
    koza = bpy.data.materials.new("koza")
    koza.use_nodes = True
    nt = koza.node_tree
    P = nt.nodes.get("Principled BSDF")
    st = mat("steklo")
    P.inputs["Base Color"].default_value = st.node_tree.nodes.get("Principled BSDF").inputs["Base Color"].default_value
    c = P.inputs["Base Color"].default_value
    P.inputs["Base Color"].default_value = (0.5 + 0.5 * c[0], 0.5 + 0.5 * c[1], 0.5 + 0.5 * c[2], 1)
    P.inputs["Roughness"].default_value = 0.45
    P.inputs["Transmission Weight"].default_value = 1.0
    P.inputs["IOR"].default_value = 1.15
    uvozi_glb(os.path.join(TELO, "koza.glb"), [], koza)
    uvozi_glb(os.path.join(TELO, "okostje.glb"), [], mat("glavna", -0.1, True))
    koren_rot(0, 0, 0)


def m_organi():
    lobe = mat("glavna", 0.05, True)
    uvozi_glb(os.path.join(GLB, "organi-3d/pljuca-telefon.glb"),
              [("lobe", lobe), ("trachea", mat("nevtralna", 0.0, True)), ("principal bronch", mat("nevtralna", 0.0, True)), ("main bronch", mat("nevtralna", 0.0, True))],
              None)
    koren_rot(0, 0, 0)


def eritrocit(lok=(0, 0, 0), rot=(0, 0, 0), R=1.0, m=None, n=48, k=24):
    """Bikonkavna ploščica (Evans–Fung)."""
    m = m or mat("glavna", 0.0, True)
    V, F = [], []
    prof = []
    for i in range(k + 1):
        r = R * math.sin(0.5 * math.pi * i / k)  # gostejše ob robu
        x = r / R
        h = R * math.sqrt(max(0.0, 1 - x * x)) * (0.207 + 2.003 * x * x - 1.123 * x ** 4) * 0.5
        prof.append((r, h))
    # zgornja in spodnja ploskev
    for s in (1, -1):
        for (r, h) in prof:
            for j in range(n):
                a = 2 * math.pi * j / n
                V.append((r * math.cos(a), r * math.sin(a), s * h))
    def idx(s, i, j):
        return (0 if s == 1 else (k + 1) * n) + i * n + (j % n)
    for s in (1, -1):
        for i in range(k):
            for j in range(n):
                q = (idx(s, i, j), idx(s, i, j + 1), idx(s, i + 1, j + 1), idx(s, i + 1, j))
                F.append(q if s == 1 else q[::-1])
    o = mreza("eritrocit", V, F, m)
    bpy.context.view_layer.objects.active = o
    bm = bmesh.new()
    bm.from_mesh(o.data)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(o.data)
    sub = o.modifiers.new("sub", "SUBSURF")
    sub.levels = 1
    sub.render_levels = 2
    o.location = lok
    o.rotation_euler = rot
    return o


def m_celice_telesa():
    eritrocit(rot=(math.radians(32), math.radians(-14), math.radians(20)))
    koren_rot(0, 0, 0)


def m_glava():
    skorja = mat("glavna", 0.05, True)
    uvozi_glb(os.path.join(GLB, "organi-3d/mozgani-telefon.glb"),
              [("cerebell", mat("glavna", -0.2, True)), ("stem", mat("nevtralna", -0.05, True)), ("pons", mat("nevtralna", -0.05, True)),
               ("medulla", mat("nevtralna", -0.05, True)), ("midbrain", mat("nevtralna", -0.05, True))], skorja)
    koren_rot(0, 0, -35)


def m_prsni_kos():
    pl = uvozi_glb(os.path.join(GLB, "organi-3d/pljuca-telefon.glb"),
                   [("lobe", mat("glavna", 0.15, True)), ("trachea", mat("nevtralna", 0.0, True)), ("bronch", mat("nevtralna", 0.0, True))], None)
    sr = srce_glb(mat("druga", 0.05, True) if J.SLOG == "cist" else mat("druga"),
                  mat("druga", -0.2, True) if J.SLOG == "cist" else mat("druga", -0.15),
                  mat("glavna", -0.25, True))
    sr.location = (0.035, -0.07, -0.05)
    sr.scale = (1.05, 1.05, 1.05)
    koren_rot(0, 0, 0)


def m_trebuh():
    uvozi_glb(os.path.join(GLB, "organi-3d/jetra-telefon.glb"),
              [("segment", mat("glavna", 0.0, True)), ("gall", mat("nevtralna", 0.0, True))], None,
              odstrani=("vein", "artery", "duct"))
    le = uvozi_glb(os.path.join(GLB, "organi-3d/ledvica-telefon.glb"),
                   [("capsule", mat("druga", 0.05, True) if J.SLOG == "cist" else mat("druga"))], None)
    le.location = (0.095, -0.05, -0.09)
    le.scale = (1.2, 1.2, 1.2)
    le.rotation_euler = (0, math.radians(-15), math.radians(-20))
    koren_rot(0, 0, 0)


def levkocit(lok, r, m, seme=1):
    o = ico(lok, r, m, sub=5)
    tx = bpy.data.textures.new(f"lev{seme}", "CLOUDS")
    tx.noise_scale = 0.12 * r
    d = o.modifiers.new("grbe", "DISPLACE")
    d.texture = tx
    d.strength = 0.12 * r
    return o


def m_kri():
    eritrocit((0, 0, 0), (math.radians(60), 0, math.radians(15)))
    eritrocit((1.3, 0.6, 0.55), (math.radians(30), math.radians(40), 0), R=0.95)
    eritrocit((-1.15, 0.5, 0.7), (math.radians(80), math.radians(-20), math.radians(40)), R=0.9)
    levkocit((0.95, -0.3, -0.75), 0.62, mat("nevtralna", 0.0, True))
    for k, p in enumerate(((-0.9, -0.6, -0.55), (-0.35, -0.8, 0.95))):
        krogla(p, 0.16, mat("glavna", 0.4, True), seg=24, merilo=(1.3, 1, 0.6))
    koren_rot(0, 0, 0)


def m_misice(obroci=2):
    """Snop mišičnih vlaken (heksagonalno), eno vlakno izvlečeno, prečne proge na površju."""
    proge = bpy.data.materials.new("vlakno")
    proge.use_nodes = True
    nt = proge.node_tree
    P = nt.nodes.get("Principled BSDF")
    osn = mat("glavna", 0.0, True).node_tree.nodes.get("Principled BSDF")
    for kl in ("Base Color", "Roughness", "Metallic", "Coat Weight", "Subsurface Weight"):
        P.inputs[kl].default_value = osn.inputs[kl].default_value
    tc = nt.nodes.new("ShaderNodeTexCoord")
    wv = nt.nodes.new("ShaderNodeTexWave")
    wv.bands_direction = "Z"
    wv.inputs["Scale"].default_value = 3.2
    wv.inputs["Distortion"].default_value = 0.0
    nt.links.new(tc.outputs["Object"], wv.inputs["Vector"])
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.45
    nt.links.new(wv.outputs["Fac"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], P.inputs["Normal"])
    mx = nt.nodes.new("ShaderNodeMix")
    mx.data_type = "RGBA"
    mx.inputs[0].default_value = 0.0
    mx.inputs[6].default_value = osn.inputs["Base Color"].default_value
    c = osn.inputs["Base Color"].default_value
    mx.inputs[7].default_value = (c[0] * 0.45, c[1] * 0.45, c[2] * 0.45, 1)
    ramp = _ramp(nt, [(0.45, (0, 0, 0, 1)), (0.55, (1, 1, 1, 1))])
    nt.links.new(wv.outputs["Fac"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], mx.inputs[0])
    nt.links.new(mx.outputs[2], P.inputs["Base Color"])
    rez = mat("druga", 0.15, True) if J.SLOG == "cist" else mat("druga")
    r = 0.19
    centri = [(0, 0)]
    for obr in range(1, obroci + 1):
        for k in range(6 * obr):
            a = 2 * math.pi * k / (6 * obr)
            centri.append((obr * 2.05 * r * math.cos(a), obr * 2.05 * r * math.sin(a)))
    for k, (x, y) in enumerate(centri):
        zamik = 0.55 if (k == 3 and obroci) else 0.0
        a = Vector((x, y, -1.2 + zamik))
        b = Vector((x, y, 1.2 + zamik * 0.5))
        o = valj(a, b, r, proge, seg=32, rob=0.15)
        bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=r * 0.93, depth=0.01, location=(x, y, 1.2 + zamik * 0.5 + 0.004))
        cap = bpy.context.active_object
        dodeli(cap, rez)
        v_koren(cap)
    koren_rot(78, 0, 38)


def razvejitev(zac, smer, dol, r, globina, rnd, m, seznam=None):
    tocke = [zac]
    p = Vector(zac)
    s = Vector(smer).normalized()
    for k in range(4):
        s = (s + Vector((rnd.uniform(-.35, .35), rnd.uniform(-.35, .35), rnd.uniform(-.35, .35)))).normalized()
        p = p + s * dol / 4
        tocke.append(p.copy())
    cev(tocke, r, m, polmeri=[1.0, 0.85, 0.7, 0.55, 0.4], res=4)
    if globina > 0:
        for k in range(2):
            ns = (s + Vector((rnd.uniform(-.8, .8), rnd.uniform(-.8, .8), rnd.uniform(-.8, .8)))).normalized()
            razvejitev(p, ns, dol * 0.65, r * 0.45, globina - 1, rnd, m)


def m_zivci():
    """Nevron: telo, dendriti, akson z mielinsko ovojnico in končiči."""
    rnd = nakljucno(7)
    telo = mat("glavna", 0.05, True)
    o = ico((0, 0, 0), 0.38, telo, sub=4)
    o.scale = (1.0, 0.9, 1.1)
    for k in range(6):
        a = 2 * math.pi * k / 6 + rnd.uniform(-0.3, 0.3)
        smer = Vector((math.cos(a), rnd.uniform(-0.4, 0.4), math.sin(a) * 0.9 + 0.35))
        razvejitev(smer.normalized() * 0.3, smer, 0.75, 0.1, 2, rnd, telo)
    # akson navzdol-desno
    akson = mat("glavna", -0.1, True)
    pts = [Vector((0.25, 0, -0.25)), Vector((0.6, 0, -0.65)), Vector((1.0, 0.05, -1.0)), Vector((1.45, 0.0, -1.35)), Vector((1.9, -0.05, -1.65))]
    cev(pts, 0.065, akson)
    mielin = mat("nevtralna", 0.0, True)
    for k in range(4):
        t = 0.22 + k * 0.2
        a = pts[0].lerp(pts[-1], t)
        b = pts[0].lerp(pts[-1], t + 0.15)
        kapsula(a, b, 0.11, mielin, seg=24)
    kon = pts[-1]
    for k in range(4):
        smer = Vector((1, rnd.uniform(-0.6, 0.6), -0.4 + 0.3 * k)).normalized()
        e = kon + smer * 0.35
        cev([kon, kon.lerp(e, 0.5) + Vector((0, 0, 0.03)), e], 0.03, akson)
        krogla(e, 0.06, mat("glavna", 0.3, True), seg=16)
    koren_rot(0, 0, 0)


def m_druge_celice():
    """Skupina različnih celic: okrogla, vretenasta, kubična (z jedri)."""
    a = ico((-0.55, 0.1, 0.2), 0.55, mat("glavna", 0.0, True), sub=5)
    tx = bpy.data.textures.new("dc", "CLOUDS")
    tx.noise_scale = 0.3
    d = a.modifiers.new("g", "DISPLACE")
    d.texture = tx
    d.strength = 0.04
    v = krogla((0.65, -0.1, 0.45), 0.32, mat("druga", 0.1, True) if J.SLOG == "cist" else mat("druga"), merilo=(2.4, 0.9, 0.8))
    v.rotation_euler = (0, math.radians(-25), math.radians(15))
    bpy.ops.mesh.primitive_cube_add(size=0.8, location=(0.35, 0.15, -0.55))
    c = bpy.context.active_object
    bev = c.modifiers.new("r", "BEVEL")
    bev.width = 0.16
    bev.segments = 6
    gladko(c)
    c.rotation_euler = (0.2, 0.3, 0.6)
    dodeli(c, mat("nevtralna", 0.0, True))
    v_koren(c)
    koren_rot(0, 0, 0)


def m_tkiva():
    """Večkotne (šesterokotne) epitelne celice v plasti, na bazalni membrani."""
    rnd = nakljucno(11)
    r = 0.3
    h = 0.6
    for i in range(-2, 3):
        for j in range(-2, 3):
            x = (i + (0.5 if j % 2 else 0)) * r * 1.76
            y = j * r * 1.52
            if math.hypot(x, y) > 1.45:
                continue
            bpy.ops.mesh.primitive_cylinder_add(vertices=6, radius=r, depth=h, location=(x, y, 0))
            o = bpy.context.active_object
            o.rotation_euler = (0, 0, math.radians(30))
            bev = o.modifiers.new("r", "BEVEL")
            bev.width = 0.06
            bev.segments = 5
            gladko(o)
            o.modifiers.new("ws", "WEIGHTED_NORMAL")
            dodeli(o, mat("glavna", rnd.uniform(-0.12, 0.12), True))
            v_koren(o)
            krogla((x, y, h / 2 + 0.0), r * 0.42, mat("druga", 0.0, True) if J.SLOG == "cist" else mat("druga"), seg=24, merilo=(1, 1, 0.45))
    bpy.ops.mesh.primitive_cylinder_add(vertices=96, radius=1.75, depth=0.1, location=(0, 0, -h / 2 - 0.06))
    b = bpy.context.active_object
    bev = b.modifiers.new("r", "BEVEL")
    bev.width = 0.03
    bev.segments = 3
    gladko(b)
    dodeli(b, mat("nevtralna", 0.0, True))
    v_koren(b)
    koren_rot(32, 0, 10)


def spermij(glava, smer, m_g, m_r, faza=0.0):
    smer = Vector(smer).normalized()
    g = krogla(glava, 0.15, m_g, seg=24, merilo=(1.6, 1.0, 0.75))
    g.rotation_euler = smer.to_track_quat("X", "Z").to_euler()
    pts = []
    for k in range(9):
        t = k / 8
        p = Vector(glava) - smer * (0.22 + t * 1.25)
        p += Vector((0, 0, 1)).cross(smer).normalized() * math.sin(t * 2 * math.pi + faza) * 0.1 * t
        pts.append(p)
    cev(pts, 0.04, m_r, polmeri=[1.4, 1.2, 1.0, 0.8, 0.7, 0.55, 0.45, 0.35, 0.2], res=4)


def m_spolne():
    """Jajčece (z ovojnico) in dve semenčici."""
    krogla((0.35, 0, 0.1), 0.9, mat("glavna", 0.05, True), seg=64)
    zona = bpy.data.materials.new("zona")
    zona.use_nodes = True
    P = zona.node_tree.nodes.get("Principled BSDF")
    P.inputs["Base Color"].default_value = mat("nevtralna").node_tree.nodes.get("Principled BSDF").inputs["Base Color"].default_value
    P.inputs["Roughness"].default_value = 0.35
    P.inputs["Alpha"].default_value = 0.28
    krogla((0.35, 0, 0.1), 1.05, zona, seg=64)
    rnd = nakljucno(29)
    for p in fib_sfera(34):
        if p.y < -0.2 and p.x < 0:
            continue
        krogla(Vector((0.35, 0, 0.1)) + p * 1.13, 0.08 + rnd.uniform(0, 0.03), mat("glavna", 0.3, True), seg=16)
    m_g = mat("nevtralna", 0.0, True)
    m_r = mat("nevtralna", -0.1, True)
    spermij((-0.85, -0.2, -0.75), (1, 0.1, 0.6), m_g, m_r)
    spermij((-0.95, -0.3, 0.55), (1, 0.15, -0.25), m_g, m_r, faza=1.5)
    koren_rot(0, 0, 0)


def m_celica_blizu():
    """Živalska celica z izrezanim osminskim klinom: v prerezu se vidijo jedro z jedrcem, mitohondriji in ER."""
    bpy.ops.mesh.primitive_cube_add(size=1.25, location=(-0.625, -0.625, 0.625))
    rez = bpy.context.active_object
    rez.hide_render = True
    rez.display_type = "WIRE"
    v_koren(rez)

    def izrezi(o):
        bo = o.modifiers.new("klin", "BOOLEAN")
        bo.operation = "DIFFERENCE"
        bo.object = rez
        return o

    o = ico((0, 0, 0), 1.0, mat("glavna", 0.0, True), sub=5)
    sol = o.modifiers.new("deb", "SOLIDIFY")
    sol.thickness = 0.06
    izrezi(o)
    izrezi(ico((0, 0, 0), 0.94, mat("glavna", 0.62, True), sub=5))
    jedro_m = mat("druga", -0.1, True) if J.SLOG == "cist" else mat("druga")
    izrezi(ico((-0.05, -0.05, 0.05), 0.42, jedro_m, sub=4))
    izrezi(ico((-0.12, -0.1, 0.12), 0.15, mat("druga", -0.3, True) if J.SLOG == "cist" else mat("kovina"), sub=3))
    mito = mat("druga", 0.25, True) if J.SLOG == "cist" else mat("kovina")
    rnd = nakljucno(13)
    n = 0
    while n < 9:
        p = Vector((rnd.uniform(-0.8, 0.8), rnd.uniform(-0.8, 0.8), rnd.uniform(-0.8, 0.8)))
        if p.length > 0.78 or p.length < 0.55:
            continue
        # samo ob ravninah prereza, da se vidijo
        if min(abs(p.x), abs(p.y), abs(p.z)) > 0.12 or not (p.x < 0.15 and p.y < 0.15 and p.z > -0.15):
            continue
        d = Vector((rnd.uniform(-1, 1), rnd.uniform(-1, 1), rnd.uniform(-1, 1))).normalized() * 0.12
        izrezi(kapsula(p - d, p + d, 0.07, mito, seg=20))
        n += 1
    # zrnati ER kot nekaj zavitih cevk ob jedru
    er = mat("glavna", -0.15, True)
    for k in range(4):
        a = math.radians(200 + k * 22)
        pts = [Vector((math.cos(a + t * 0.5) * (0.5 + 0.03 * k), math.sin(a + t * 0.5) * (0.5 + 0.03 * k), 0.05 + 0.25 * t)) for t in (0, 0.33, 0.66, 1.0)]
        c = cev(pts, 0.025, er, res=4)
        bpy.ops.object.select_all(action="DESELECT")
        bpy.context.view_layer.objects.active = c
        c.select_set(True)
        bpy.ops.object.convert(target="MESH")
        izrezi(bpy.context.active_object)
    koren_rot(0, 0, 0)


def m_bakterije_glive():
    """Paličasta bakterija z bički."""
    kapsula((-0.75, 0, 0), (0.75, 0, 0), 0.42, mat("glavna", 0.0, True), seg=48)
    bic = mat("druga", 0.0, True) if J.SLOG == "cist" else mat("druga")
    for k, (y, z, kot) in enumerate(((0.12, 0.2, 10), (-0.15, -0.1, -15), (0.0, -0.3, -35))):
        pts = []
        for i in range(14):
            t = i / 13
            x = -1.15 - t * 1.3
            pts.append((x, y + math.sin(t * 6 * math.pi) * 0.09 + t * 0.2 * math.sin(math.radians(kot)), z + math.cos(t * 6 * math.pi) * 0.09 + t * 0.4 * math.sin(math.radians(kot))))
        pts.insert(0, (-1.1, y * 0.6, z * 0.6))
        cev(pts, 0.022, bic, res=4)
    # pili
    rnd = nakljucno(17)
    for p in fib_sfera(26):
        a = Vector((p.x * 0.75 * 1.2, p.y * 0.42, p.z * 0.42))
        if abs(p.x) > 0.85:
            continue
        valj(a, a + Vector((0, p.y, p.z)).normalized() * 0.16, 0.008, bic, seg=6, rob=0)
    koren_rot(0, -20, 25)


def kvasovka(lok=(0, 0, 0), r=0.5):
    """Brsteča kvasovka: materinska celica, brst in brazgotine."""
    m = mat("nevtralna", -0.05, True)
    lok = Vector(lok)
    krogla(lok, r, m, seg=48, merilo=(1.0, 1.0, 1.18))
    krogla(lok + Vector((0.35 * r, -0.2 * r, 1.25 * r)), r * 0.55, m, seg=40, merilo=(1, 1, 1.1))
    br = mat("glavna", -0.2, True)
    for d in ((-0.7, -0.6, 0.2), (-0.2, -0.9, -0.35)):
        dv = Vector(d).normalized()
        torus(r * 0.13, r * 0.035, br, lok=lok + Vector((dv.x * r, dv.y * r, dv.z * r * 1.18)), rot=dv.to_track_quat("Z", "Y").to_euler())


def m_bakterije_kvasovka():
    m_bakterije_glive()
    J.KOREN.rotation_euler = (0, 0, 0)
    e = podmotiv(lambda: kvasovka((0, 0, 0), 0.62), (1.15, -0.45, -0.6), 1.0)
    koren_rot(0, -10, 20)


def m_virusi():
    """Bakteriofag T4: podolgovata ikozaedrska glava, vrat, rep z obroči, bazalna plošča, repna vlakna."""
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=0.5, location=(0, 0, 0.95))
    g = bpy.context.active_object
    g.scale = (1, 1, 1.35)
    g.rotation_euler = (0, 0, 0)
    bev = g.modifiers.new("r", "BEVEL")
    bev.width = 0.03
    bev.segments = 4
    bev.harden_normals = True
    gladko(g)
    dodeli(g, mat("glavna", 0.0, True))
    v_koren(g)
    rep = mat("druga", 0.05, True) if J.SLOG == "cist" else mat("druga")
    valj((0, 0, 0.32), (0, 0, 0.42), 0.16, mat("nevtralna"), rob=0.3)
    valj((0, 0, -0.7), (0, 0, 0.32), 0.09, rep, rob=0.3)
    for k in range(14):
        z = -0.62 + k * 0.067
        torus(0.11, 0.022, rep, lok=(0, 0, z))
    bpy.ops.mesh.primitive_cylinder_add(vertices=6, radius=0.26, depth=0.08, location=(0, 0, -0.74))
    b = bpy.context.active_object
    bev = b.modifiers.new("r", "BEVEL")
    bev.width = 0.02
    bev.segments = 3
    dodeli(b, mat("nevtralna"))
    v_koren(b)
    vl = mat("nevtralna", -0.1)
    for k in range(6):
        a = 2 * math.pi * k / 6 + 0.3
        d = Vector((math.cos(a), math.sin(a), 0))
        p0 = Vector((0, 0, -0.74)) + d * 0.24
        p1 = p0 + d * 0.45 + Vector((0, 0, 0.12))
        p2 = p1 + d * 0.25 + Vector((0, 0, -0.75))
        cev([p0, p1, p2], 0.022, vl, res=4)
    koren_rot(0, 0, 18)


def m_enocelicarji():
    """Paramecij: podolgovato telo s plitvo ustno vdolbino, posejano z migetalkami."""
    o = ico((0, 0, 0), 1.0, mat("glavna", 0.0, True), sub=5)
    o.scale = (1.55, 0.6, 0.6)
    # vdolbina
    bm = bmesh.new()
    bm.from_mesh(o.data)
    for v in bm.verts:
        x, y, z = v.co
        f = math.exp(-((x - 0.1) ** 2) / 0.12 - ((z - 0.55) ** 2) / 0.1) * max(0, y + 0.2)
        v.co.z -= 0.25 * f
        v.co.x *= 1.0 + 0.15 * math.tanh(x * 2)  # zadnji del rahlo širši
    bm.to_mesh(o.data)
    bm.free()
    bpy.context.view_layer.update()
    mw = o.matrix_basis.copy()
    # migetalke v eni mreži
    V, F = [], []
    rnd = nakljucno(19)
    me = o.data
    vs = [mw @ v.co for v in me.vertices]
    ns = [(mw.to_3x3() @ v.normal).normalized() for v in me.vertices]
    for i in range(0, len(vs), 5):
        p, n = vs[i], ns[i]
        L = 0.08 + rnd.uniform(-0.02, 0.02)
        t = n.orthogonal().normalized() * 0.006
        q = p + n * L + Vector((-0.02, 0, 0))
        b0 = len(V)
        V += [tuple(p + t), tuple(p - t), tuple(q)]
        F.append((b0, b0 + 1, b0 + 2))
    mreza("migetalke", V, F, mat("glavna", 0.45, True), smooth=False)
    # krčljiva vakuola in jedro skozi rahlo prosojnost se ne vidita -> dodamo ustni lijak
    koren_rot(0, -15, 20)


def m_list():
    l = list_ploskev(2.4, 0.8, mat("glavna", 0.0, True), upogib=0.12, vbocenost=0.05, oblika=0.75, n=60, k=20, debelina=0.025)
    l.location = (0, -1.2, 0)
    zila = mat("glavna", 0.4, True)
    def tocka(u, v):
        w = 0.8 * (math.sin(math.pi * max(u, 0.0) ** 0.75) ** 0.9)
        x = v * w
        y = u * 2.4 - 1.2
        z = -0.12 * u * u * 2.4 + 0.05 * v * v * w * 2 + 0.018
        return Vector((x, y, z))
    cev([tocka(u / 10, 0) for u in range(-1, 11)], 0.022, zila, polmeri=[1.5] + [1.3 - 0.1 * k for k in range(11)], res=4)
    for k in range(1, 9):
        u = k / 10
        for s in (-1, 1):
            cev([tocka(u, 0), tocka(u + 0.06, s * 0.45), tocka(u + 0.1, s * 0.85)], 0.01, zila, polmeri=[1.0, 0.7, 0.3], res=3)
    # pecelj
    cev([tocka(-0.1, 0), Vector((0, -1.55, -0.05)), Vector((0.05, -1.75, -0.15))], 0.04, mat("glavna", -0.1, True))
    koren_rot(30, 0, -40)


def m_korenina():
    """Korenina s koreninskimi laski in koreninsko čepico."""
    rnd = nakljucno(23)
    kor = mat("nevtralna", -0.05, True)
    pts = [Vector((0, 0, 1.4)), Vector((0.05, 0, 0.7)), Vector((-0.05, 0, 0.0)), Vector((0.03, 0, -0.7)), Vector((0, 0, -1.25))]
    cev(pts, 0.17, kor, polmeri=[1.1, 1.0, 0.9, 0.75, 0.5])
    kapa = mat("glavna", 0.0, True)
    krogla((0.0, 0, -1.25), 0.1, kapa, merilo=(1, 1, 1.4))
    # stranski koreninici
    for k, (z, a) in enumerate(((0.9, 30), (0.5, 160), (0.2, 260))):
        d = Vector((math.cos(math.radians(a)), math.sin(math.radians(a)), -0.5)).normalized()
        p0 = Vector((0, 0, z))
        cev([p0, p0 + d * 0.4 + Vector((0, 0, 0.05)), p0 + d * 0.8], 0.06, kor, polmeri=[1.0, 0.7, 0.35], res=4)
    # laski v coni nad čepico
    V, F = [], []
    las = mat("glavna", 0.35, True)
    for k in range(260):
        z = rnd.uniform(-0.95, -0.15)
        a = rnd.uniform(0, 2 * math.pi)
        r0 = 0.14 * (0.5 + 0.5 * (z + 1.25) / 2.6)
        d = Vector((math.cos(a), math.sin(a), rnd.uniform(-0.2, 0.25))).normalized()
        p = Vector((math.cos(a) * r0, math.sin(a) * r0, z))
        L = rnd.uniform(0.25, 0.42)
        q = p + d * L
        t = Vector((-math.sin(a), math.cos(a), 0)) * 0.006
        b0 = len(V)
        V += [tuple(p + t), tuple(p - t), tuple(q + t * 0.5), tuple(q - t * 0.5)]
        F.append((b0, b0 + 1, b0 + 3, b0 + 2))
    o = mreza("laski", V, F, las, smooth=False)
    s = o.modifiers.new("deb", "SOLIDIFY")
    s.thickness = 0.008
    koren_rot(0, 0, 0)


# =============================================================== Kemija

def lopatica(smer, R, m, pozitivna=True):
    """Ena polovica p orbitale: kapljičast reženj r = R*cos(θ) v smeri smer."""
    bpy.ops.mesh.primitive_uv_sphere_add(segments=64, ring_count=48, radius=1)
    o = bpy.context.active_object
    for v in o.data.vertices:
        d = v.co.normalized()
        c = max(0.0, d.z)
        v.co = d * (R * c ** 12)
    o.data.update()
    bm = bmesh.new()
    bm.from_mesh(o.data)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-4)
    bm.to_mesh(o.data)
    bm.free()
    o.rotation_euler = Vector(smer).to_track_quat("Z", "Y").to_euler()
    gladko(o)
    sub = o.modifiers.new("sub", "SUBSURF")
    sub.levels = 1
    sub.render_levels = 1
    dodeli(o, m)
    return v_koren(o)


def m_atom():
    """Atom z orbitalami: s (prozorna krogla) in trije p (pari režnjev v dveh barvah faz)."""
    pl = mat("glavna", 0.05)
    mi = mat("glavna", 0.45)
    for os_ in ((1, 0, 0), (0, 1, 0), (0, 0, 1)):
        v = Vector(os_)
        lopatica(v, 1.5, pl)
        lopatica(-v, 1.5, mi)
    st = bpy.data.materials.new("s")
    st.use_nodes = True
    P = st.node_tree.nodes.get("Principled BSDF")
    P.inputs["Base Color"].default_value = mat("nevtralna").node_tree.nodes.get("Principled BSDF").inputs["Base Color"].default_value
    P.inputs["Transmission Weight"].default_value = 1.0
    P.inputs["Roughness"].default_value = 0.2
    P.inputs["IOR"].default_value = 1.1
    krogla((0, 0, 0), 0.3, st, seg=64)
    jedro_atoma(0.1, 0.075)
    koren_rot(35, 0, 40)


def m_molekule_kristali():
    """Kristalna mreža NaCl 3×3×3: veliki Cl, mali Na, palčke med sosedi."""
    cl = mat("glavna", 0.0)
    na = mat("nevtralna", 0.0)
    pal = mat("kovina")
    a = 0.7
    for i in range(3):
        for j in range(3):
            for k in range(3):
                p = Vector(((i - 1) * a, (j - 1) * a, (k - 1) * a))
                velik = (i + j + k) % 2 == 0
                krogla(p, 0.22 if velik else 0.14, cl if velik else na, seg=40)
                for d in ((1, 0, 0), (0, 1, 0), (0, 0, 1)):
                    if (i, j, k)[d.index(1)] < 2:
                        q = p + Vector(d) * a
                        valj(p, q, 0.035, pal, seg=16, rob=0)
    koren_rot(-18, 0, 35)
    J.KOREN.rotation_mode = "XYZ"


def m_molekule_zivljenja():
    dnk(obr=1.25, n_bp=12)
    koren_rot(15, 35, -30)


# =============================================================== Fizika in vesolje

def m_polja():
    """Paličasti magnet in silnice v treh ravninah s puščicami."""
    sever = mat("glavna", 0.0)
    jug = mat("nevtralna", 0.0)
    for (x0, x1, m) in ((0.0, 0.85, sever), (-0.85, 0.0, jug)):
        bpy.ops.mesh.primitive_cube_add(size=1, location=((x0 + x1) / 2, 0, 0))
        o = bpy.context.active_object
        o.scale = (x1 - x0, 0.36, 0.36)
        bev = o.modifiers.new("r", "BEVEL")
        bev.width = 0.04
        bev.segments = 5
        gladko(o)
        o.modifiers.new("ws", "WEIGHTED_NORMAL")
        dodeli(o, m)
        v_koren(o)
    sil = mat("kovina")
    pus = mat("glavna", 0.25)
    for (L, fis) in ((0.95, (90, 270, 30, 150, 210, 330)), (1.35, (90, 270)), (1.8, (90, 270))):
        for fi in fis:
            pts = []
            for k in range(41):
                th0 = math.asin(min(1.0, math.sqrt(0.5 / L)))
                th = th0 + (math.pi - 2 * th0) * k / 40
                r = L * math.sin(th) ** 2
                pts.append(Vector((r * math.cos(th) * 1.0, r * math.sin(th) * math.cos(math.radians(fi)), r * math.sin(th) * math.sin(math.radians(fi)))))
            cev(pts, 0.02, sil, res=3)
            # puščica na vrhu silnice (od S proti J: smer -x)
            p = pts[20]
            q = pts[22]
            stozec(p, p + (q - p).normalized() * 0.16, 0.06, 0.0, pus, seg=16)
    koren_rot(0, -8, -12)


def m_vesolje():
    """Sonce s tremi planeti na tirnicah."""
    sonce = bpy.data.materials.new("sonce")
    sonce.use_nodes = True
    nt = sonce.node_tree
    P = nt.nodes.get("Principled BSDF")
    if J.SLOG == "cist":
        s1, s2 = barva("#ffd36a"), barva("#f07a12")
    else:
        b = mat("sij").node_tree.nodes.get("Principled BSDF").inputs["Base Color"].default_value
        s1, s2 = b, (b[0] * 0.7, b[1] * 0.45, b[2] * 0.2, 1)
    tc = nt.nodes.new("ShaderNodeTexCoord")
    nz = nt.nodes.new("ShaderNodeTexVoronoi")
    nz.inputs["Scale"].default_value = 14
    nt.links.new(tc.outputs["Object"], nz.inputs["Vector"])
    ramp = _ramp(nt, [(0.0, s1), (0.6, s2)])
    nt.links.new(nz.outputs["Distance"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], P.inputs["Base Color"])
    nt.links.new(ramp.outputs["Color"], P.inputs["Emission Color"])
    P.inputs["Emission Strength"].default_value = 1.2
    krogla((0, 0, 0), 0.62, sonce, seg=96)
    tir = mat("kovina")
    for k, (R, r, kot) in enumerate(((1.0, 0.13, 215), (1.45, 0.21, 320), (1.95, 0.17, 35))):
        torus(R, 0.013, tir)
        p = Vector((R * math.cos(math.radians(kot)), R * math.sin(math.radians(kot)), 0))
        krogla(p, r, planet_mat(f"pl{k}", svetlost=0.1 * k, gostota=4.0 + k), seg=48)
    koren_rot(24, 0, 10)



# =============================================================== vsebinsko jasnejše ikone (j 13. 11.: »Vsebinsko«)

def m_telo2():
    """Človeško telo: prozoren trup z glavo, v njem srce, pljuča in jetra (prave lege iz atlasa)."""
    koza = bpy.data.materials.new("koza")
    koza.use_nodes = True
    P = koza.node_tree.nodes.get("Principled BSDF")
    c = mat("steklo").node_tree.nodes.get("Principled BSDF").inputs["Base Color"].default_value
    P.inputs["Base Color"].default_value = (0.55 + 0.45 * c[0], 0.55 + 0.45 * c[1], 0.55 + 0.45 * c[2], 1)
    P.inputs["Roughness"].default_value = 0.4
    P.inputs["Transmission Weight"].default_value = 1.0
    P.inputs["IOR"].default_value = 1.12
    sk = uvozi_glb(os.path.join(TELO, "koza.glb"), [], koza)
    MEJA = 0.98
    for o in [o for o in bpy.data.objects if o.type == "MESH" and o.parent is not None and o.parent == sk or (o.parent and o.parent.parent == sk)]:
        mw = o.matrix_world
        bm = bmesh.new()
        bm.from_mesh(o.data)
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if (mw @ v.co).z < MEJA], context="VERTS")
        bm.to_mesh(o.data)
        bm.free()
    uvozi_glb(os.path.join(TELO, "organi.glb"),
              [("lobe of", mat("glavna", 0.3, True)), ("segment of liver", mat("druga", 0.0, True) if J.SLOG == "cist" else mat("druga"))], None)
    uvozi_glb(os.path.join(TELO, "zile.glb"),
              [("ventricle", mat("glavna", -0.25, True)), ("atrium", mat("glavna", -0.25, True)), ("auricle", mat("glavna", -0.25, True))], None,
               odstrani=("papillary", "vein of", "artery of"))
    koren_rot(0, 0, 0)


def nevron_maly():
    rnd = nakljucno(31)
    telo = mat("glavna", 0.05, True)
    ico((0, 0, 0), 0.32, telo, sub=4)
    for k in range(5):
        a = 2 * math.pi * k / 5 + 0.4
        smer = Vector((math.cos(a), rnd.uniform(-0.3, 0.3), math.sin(a)))
        razvejitev(smer.normalized() * 0.25, smer, 0.6, 0.1, 1, rnd, telo)
    pts = [Vector((0.25, 0, -0.2)), Vector((0.7, 0, -0.5)), Vector((1.15, 0, -0.8))]
    cev(pts, 0.07, telo)
    for k in range(2):
        a = pts[0].lerp(pts[-1], 0.25 + 0.38 * k)
        b = pts[0].lerp(pts[-1], 0.25 + 0.38 * k + 0.28)
        kapsula(a, b, 0.12, mat("nevtralna", 0.0, True), seg=24)


def m_celice_telesa2():
    """Celice telesa: nevron, mišično vlakno in rdeča krvnička skupaj (različne oblike = različne celice)."""
    podmotiv(nevron_maly, (-0.6, 0.2, 0.5), 1.0, rot=(0, 0, 0))
    podmotiv(lambda: m_misice(0), (0.05, 0.1, -0.95), 1.0, rot=(0, 90, 12))
    podmotiv(lambda: eritrocit(rot=(math.radians(40), math.radians(-12), math.radians(20)), R=0.62), (0.95, -0.25, 0.35), 1.0, rot=(0, 0, 0))
    koren_rot(0, 0, 0)


def m_druge_celice2():
    """Druge celice: plast epitelnih celic, jajčece in semenčica."""
    podmotiv(m_tkiva, (0.0, 0.4, -0.55), 0.62, rot=(28, 0, 10))
    podmotiv(m_spolne, (0.15, -0.3, 0.55), 0.55, rot=(0, 0, 0))
    koren_rot(0, 0, 0)


def m_mikrobi2():
    """Celice in mikrobi: celica v prerezu, paličasta bakterija in virus."""
    podmotiv(m_celica_blizu, (-0.15, 0.35, 0.35), 0.95, rot=(0, 0, 0))
    podmotiv(lambda: m_bakterije_glive(), (-0.75, -0.45, -0.75), 0.55, rot=(0, -10, 25))
    podmotiv(lambda: virus_korona(0.5, 32), (0.95, -0.4, -0.55), 0.85, rot=(10, 0, 20))
    koren_rot(0, 0, 0)


def m_enocelicarji2():
    """Paramecij: prosojno telo, vidno veliko jedro, dve krčljivi vakuoli (zvezdasti), hranilne vakuole, ustna vdolbina, migetalke."""
    telo = prosojna("glavna", 0.25, 0.8, "paramecij")
    o = ico((0, 0, 0), 1.0, telo, sub=5)
    o.scale = (1.6, 0.62, 0.62)
    bm = bmesh.new()
    bm.from_mesh(o.data)
    for v in bm.verts:
        x, y, z = v.co
        f = math.exp(-((x - 0.05) ** 2) / 0.1 - ((z - 0.6) ** 2) / 0.12) * max(0, y + 0.3)
        v.co.z -= 0.3 * f
    bm.to_mesh(o.data)
    bm.free()
    jedro_m = mat("druga", 0.0, True) if J.SLOG == "cist" else mat("druga")
    krogla((0.05, 0.0, -0.02), 0.26, jedro_m, merilo=(1.5, 0.8, 0.8))
    krogla((0.12, 0.0, 0.18), 0.09, mat("druga", 0.2, True) if J.SLOG == "cist" else mat("kovina"))
    vak = mat("nevtralna", 0.0, True)
    for x in (-0.95, 0.95):
        krogla((x, 0.0, 0.15), 0.1, vak, seg=24)
        for k in range(7):
            a = 2 * math.pi * k / 7
            cev([(x, 0, 0.15), (x + 0.12 * math.cos(a), 0.12 * math.sin(a) * 0.5, 0.15 + 0.08 * math.sin(a)), (x + 0.24 * math.cos(a), 0.24 * math.sin(a) * 0.5, 0.15 + 0.16 * math.sin(a))], 0.022, vak, res=3)
    rnd = nakljucno(37)
    for k in range(6):
        p = Vector((rnd.uniform(-0.6, 0.6), rnd.uniform(-0.15, 0.15), rnd.uniform(-0.3, 0.25)))
        krogla(p, rnd.uniform(0.05, 0.08), mat("glavna", -0.25, True), seg=20)
    # migetalke
    bpy.context.view_layer.update()
    mw = o.matrix_basis.copy()
    V, F = [], []
    vs = [mw @ v.co for v in o.data.vertices]
    ns = [(mw.to_3x3() @ v.normal).normalized() for v in o.data.vertices]
    for i in range(0, len(vs), 6):
        p, n = vs[i], ns[i]
        L = 0.08 + rnd.uniform(-0.015, 0.015)
        t = n.orthogonal().normalized() * 0.006
        q = p + n * L + Vector((-0.02, 0, 0))
        b0 = len(V)
        V += [tuple(p + t), tuple(p - t), tuple(q)]
        F.append((b0, b0 + 1, b0 + 2))
    mreza("migetalke", V, F, mat("glavna", 0.35, True), smooth=False)
    koren_rot(0, -12, 18)


def x_kromosom(lok, m, dol=0.2, r=0.055, kot=0.0):
    lok = Vector(lok)
    e = bpy.data.objects.new("x", None)
    bpy.context.scene.collection.objects.link(e)
    e.parent = J.KOREN
    stari = J.KOREN
    J.KOREN = e
    for s_ in (-1, 1):
        a = Vector((-dol, 0, s_ * dol * 0.55))
        b = Vector((dol, 0, -s_ * dol * 0.55))
        kapsula(a * 0.5 + Vector((0, 0, s_ * 0.02)), b * 0.5 + Vector((0, 0, s_ * 0.02)), r, m, seg=16)
    J.KOREN = stari
    e.location = lok
    e.rotation_euler = (0, math.radians(90), math.radians(kot))
    return e


def m_procesi2():
    """Mitoza (metafaza): prosojna celica, kromosomi v obliki X v sredini, delitveno vreteno med poloma."""
    o = ico((0, 0, 0), 1.0, prosojna("glavna", 0.3, 0.85, "celica"), sub=5)
    o.scale = (1.35, 1.0, 1.0)
    krom = mat("druga", 0.0, True) if J.SLOG == "cist" else mat("druga")
    vr = mat("nevtralna", 0.0)
    poli = (Vector((-0.95, 0, 0)), Vector((0.95, 0, 0)))
    for p in poli:
        krogla(p, 0.07, mat("kovina"), seg=20)
    tocke = []
    for k in range(4):
        y = 0.0
        z = -0.54 + 0.36 * k
        tocke.append(Vector((0, y, z)))
        x_kromosom((0, y, z), krom, dol=0.24, r=0.07, kot=0)
    for c in tocke:
        for p in poli:
            valj(p, c, 0.008, vr, seg=6, rob=0)
    for p in poli:
        for k in range(6):
            a = 2 * math.pi * k / 6
            d = Vector((-p.x * 0.25, math.cos(a) * 0.22, math.sin(a) * 0.22)).normalized() * -0.25
            valj(p, p + Vector((math.copysign(0.18, p.x), d.y, d.z)), 0.006, vr, seg=6, rob=0)
    koren_rot(0, 0, 22)


def beljakovina(m):
    """Risanka beljakovine: dve α-vijačnici, povezani z zanko."""
    def vijacnica(c, os_, n=3.5, R=0.22, H=1.0):
        os_ = Vector(os_).normalized()
        u = os_.orthogonal().normalized()
        w = os_.cross(u)
        return [Vector(c) + os_ * (t / 60 - 0.5) * H + (u * math.cos(t / 60 * n * 2 * math.pi) + w * math.sin(t / 60 * n * 2 * math.pi)) * R for t in range(61)]
    a = vijacnica((-0.25, 0, 0), (0.2, 0, 1))
    b = vijacnica((0.35, 0.1, 0.05), (-0.1, 0.1, 1))
    zanka = [a[-1], a[-1] + Vector((0.15, 0, 0.3)), b[-1] + Vector((-0.05, 0, 0.35)), b[-1]]
    cev(a, 0.06, m, res=4)
    cev(b, 0.06, m, res=4)
    cev(zanka, 0.05, m, res=4)
    cev([a[0], a[0] + Vector((-0.2, 0, -0.3)), a[0] + Vector((0.1, 0, -0.5))], 0.05, m, res=4)


def m_molekule_zivljenja2():
    """Molekule življenja: kratka DNK in beljakovina."""
    podmotiv(lambda: dnk(obr=1.0, n_bp=10), (-0.55, 0, 0), 0.72, rot=(0, -12, 10))
    podmotiv(lambda: beljakovina(mat("druga", 0.15) if J.SLOG == "cist" else mat("druga")), (0.75, -0.1, 0.0), 1.15, rot=(0, 0, 20))
    koren_rot(0, 0, 0)


MOTIVI = {
    # id: (skupina, funkcija, delež kadra)
    "biologija": ("bio", m_biologija, 0.8),
    "kemija": ("kem", m_kemija, 0.8),
    "fizika-vesolje": ("fiz", m_fizika, 0.84),
    "matematika": ("mat", m_matematika, 0.72),
    "telo": ("bio", m_telo2, 0.84),
    "mikrobi": ("bio", m_mikrobi2, 0.84),
    "rastline": ("bio", m_rastline, 0.8),
    "procesi": ("bio", m_procesi2, 0.82),
    "atlas": ("bio", m_atlas, 0.84),
    "organi": ("bio", m_organi, 0.76),
    "celice-telesa": ("bio", m_celice_telesa2, 0.84),
    "glava": ("bio", m_glava, 0.78),
    "prsni-kos": ("bio", m_prsni_kos, 0.78),
    "trebuh": ("bio", m_trebuh, 0.78),
    "kri": ("bio", m_kri, 0.82),
    "misice": ("bio", m_misice, 0.8),
    "zivci": ("bio", m_zivci, 0.82),
    "druge-celice": ("bio", m_druge_celice2, 0.84),
    "tkiva": ("bio", m_tkiva, 0.8),
    "spolne": ("bio", m_spolne, 0.8),
    "celica-blizu": ("bio", m_celica_blizu, 0.76),
    "bakterije-glive": ("bio", m_bakterije_kvasovka, 0.84),
    "virusi": ("bio", m_virusi, 0.8),
    "enocelicarji": ("bio", m_enocelicarji2, 0.82),
    "list": ("bio", m_list, 0.82),
    "korenina": ("bio", m_korenina, 0.8),
    "atom": ("kem", m_atom, 0.78),
    "molekule-kristali": ("kem", m_molekule_kristali, 0.78),
    "molekule-zivljenja": ("kem", m_molekule_zivljenja2, 0.84),
    "polja": ("fiz", m_polja, 0.84),
    "vesolje": ("fiz", m_vesolje, 0.86),
}

DREVO = [  # (id, starš) za pregledno sliko
    ("biologija", None), ("kemija", None), ("fizika-vesolje", None), ("matematika", None),
    ("telo", "biologija"), ("mikrobi", "biologija"), ("rastline", "biologija"), ("procesi", "biologija"),
    ("atlas", "telo"), ("organi", "telo"), ("celice-telesa", "telo"),
    ("glava", "organi"), ("prsni-kos", "organi"), ("trebuh", "organi"),
    ("kri", "celice-telesa"), ("misice", "celice-telesa"), ("zivci", "celice-telesa"), ("druge-celice", "celice-telesa"),
    ("tkiva", "druge-celice"), ("spolne", "druge-celice"),
    ("celica-blizu", "mikrobi"), ("bakterije-glive", "mikrobi"), ("virusi", "mikrobi"), ("enocelicarji", "mikrobi"),
    ("list", "rastline"), ("korenina", "rastline"),
    ("atom", "kemija"), ("molekule-kristali", "kemija"), ("molekule-zivljenja", "kemija"),
    ("polja", "fizika-vesolje"), ("vesolje", "fizika-vesolje"),
]

"""Skupni del za ikone drevesa 3D sveta: izris, studio, kamera, kader, materiali po slogih, gradniki."""
import bpy, bmesh, math, os
from mathutils import Vector, Euler
from bpy_extras.object_utils import world_to_camera_view

# ---------------------------------------------------------------- barve
SKUPINE = {"bio": "#2fb36b", "kem": "#9b6cf0", "fiz": "#3d8bfd", "mat": "#f0a020"}
SLOGI = ("cist", "antik", "renesansa", "bagdad", "indija", "egipt")

SLOG = "cist"   # nastavi izdelaj()
SK = "bio"      # skupina trenutne ikone
KOREN = None    # prazen objekt, starš vseh delov motiva


def _lin(c):
    c = c / 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def barva(h, ton=0.0):
    """sRGB hex -> linearna RGBA. ton > 0 meša proti beli, ton < 0 proti črni (v sRGB)."""
    h = h.lstrip("#")
    r = [int(h[i:i + 2], 16) for i in (0, 2, 4)]
    if ton > 0:
        r = [x + (255 - x) * ton for x in r]
    elif ton < 0:
        r = [x * (1 + ton) for x in r]
    return (_lin(r[0]), _lin(r[1]), _lin(r[2]), 1.0)


# ---------------------------------------------------------------- materiali po slogih
# Vsaka vloga: dict(b=osnovna barva, b2=druga barva vzorca, vz=vzorec, h=hrapavost, k=kovina, lak, sss)
# vzorci: None | "glina" (lisasta terakota) | "marmor" (žile) | "les" (letnice) | "lapis" (zlati drobci) | "patina"
PALETE = {
    "antik": {
        "glavna": dict(b="#b4572e", b2="#94431f", vz="glina", h=0.78),
        "druga": dict(b="#1e1612", h=0.22, lak=0.5),                       # črna glazura grških vaz
        "nevtralna": dict(b="#f1ede6", b2="#a29d96", vz="marmor", h=0.18, sss=0.08),
        "kovina": dict(b="#a36b3a", k=1.0, h=0.32),                          # bron
        "steklo": dict(b="#d6e8d2"),
        "sij": dict(b="#ffd9a0"),
    },
    "renesansa": {
        "glavna": dict(b="#c9a24c", b2="#a8843a", vz="patina", k=1.0, h=0.26),   # medenina
        "druga": dict(b="#7a5230", k=1.0, h=0.34),                                 # bron
        "nevtralna": dict(b="#6b4428", b2="#3d2414", vz="les", h=0.42, lak=0.5),    # oreh
        "kovina": dict(b="#c9a24c", k=1.0, h=0.22),
        "steklo": dict(b="#f3ead8"),
        "sij": dict(b="#ffe2a8"),
    },
    "bagdad": {
        "glavna": dict(b="#1d3d8f", b2="#0f2357", vz="lapis", h=0.24, lak=0.3),   # lapis lazuli
        "druga": dict(b="#2a9d9a", h=0.28, lak=0.8),                               # turkizna glazura
        "nevtralna": dict(b="#e2b24f", k=1.0, h=0.2),                               # zlato
        "kovina": dict(b="#e2b24f", k=1.0, h=0.2),
        "steklo": dict(b="#a6dcd4"),
        "sij": dict(b="#ffd27a"),
    },
    "indija": {
        "glavna": dict(b="#33408f", h=0.3, lak=1.0),                                # indigo emajl
        "druga": dict(b="#f2a64a", h=0.3, lak=1.0),                                 # žafran emajl
        "nevtralna": dict(b="#f4efe6", b2="#c9c2b6", vz="marmor", h=0.16, sss=0.08),  # beli marmor
        "kovina": dict(b="#d9a54a", k=1.0, h=0.22),
        "steklo": dict(b="#ffd9a0"),
        "sij": dict(b="#ffc46b"),
    },
    "egipt": {
        "glavna": dict(b="#e6b955", k=1.0, h=0.24),                                 # zlato
        "druga": dict(b="#1d4796", b2="#0e2a63", vz="lapis", h=0.24, lak=0.3),      # lapis
        "nevtralna": dict(b="#2fb3a6", h=0.32, lak=0.7),                            # fajansa
        "kovina": dict(b="#e6b955", k=1.0, h=0.2),
        "steklo": dict(b="#9ad7e0"),
        "sij": dict(b="#ffd88a"),
    },
}


def _cist(vloga, organsko):
    G = SKUPINE[SK]
    if vloga == "glavna":
        return dict(b=G, h=0.38, sss=0.12 if organsko else 0.0)
    if vloga == "druga":
        return dict(b=G, t=-0.3, h=0.36, sss=0.1 if organsko else 0.0)
    if vloga == "nevtralna":
        return dict(b="#eceef2", h=0.42, sss=0.05 if organsko else 0.0)
    if vloga == "kovina":
        return dict(b=G, t=0.1, k=0.5, h=0.25)
    if vloga == "steklo":
        return dict(b=G, t=0.15)
    if vloga == "sij":
        return dict(b=G, t=0.55)
    raise KeyError(vloga)


_PREDP = {}


def mat(vloga, ton=0.0, organsko=False, h=None):
    """Material za vlogo v trenutnem slogu. ton premakne barvo proti beli/črni."""
    kljuc = (SLOG, SK, vloga, round(ton, 3), organsko, h)
    m = _PREDP.get(kljuc)
    if m and m.name in bpy.data.materials:
        return m
    p = dict(_cist(vloga, organsko) if SLOG == "cist" else PALETE[SLOG][vloga])
    if h is not None:
        p["h"] = h
    t = p.pop("t", 0.0) + ton
    if vloga == "steklo":
        m = _steklo(f"{vloga}{ton:+.2f}", p["b"], t)
    elif vloga == "sij":
        m = _sij(f"{vloga}{ton:+.2f}", p["b"], t)
    else:
        m = _pbr(f"{vloga}{ton:+.2f}", p, t)
    _PREDP[kljuc] = m
    return m


def _nodes(m):
    m.use_nodes = True
    nt = m.node_tree
    return nt, nt.nodes.get("Principled BSDF")


def _pbr(ime, p, t):
    m = bpy.data.materials.new(ime)
    nt, P = _nodes(m)
    i = P.inputs
    b1 = barva(p["b"], t)
    i["Base Color"].default_value = b1
    i["Roughness"].default_value = p.get("h", 0.4)
    i["Metallic"].default_value = p.get("k", 0.0)
    i["Coat Weight"].default_value = p.get("lak", 0.0)
    i["Coat Roughness"].default_value = 0.06
    if p.get("sss"):
        i["Subsurface Weight"].default_value = p["sss"]
        i["Subsurface Radius"].default_value = (1.0, 0.6, 0.4)
        i["Subsurface Scale"].default_value = 0.06
    vz = p.get("vz")
    if not vz:
        return m
    b2 = barva(p.get("b2", p["b"]), t)
    tc = nt.nodes.new("ShaderNodeTexCoord")
    tc.object = KOREN  # vzorec v prostoru celega motiva: enako merilo na velikih in majhnih delih
    mp = nt.nodes.new("ShaderNodeMapping")
    nt.links.new(tc.outputs["Object"], mp.inputs["Vector"])
    mix = nt.nodes.new("ShaderNodeMix")
    mix.data_type = "RGBA"
    mix.inputs[6].default_value = b1
    mix.inputs[7].default_value = b2
    nt.links.new(mix.outputs[2], i["Base Color"])
    if vz == "glina":
        nz = nt.nodes.new("ShaderNodeTexNoise")
        nz.inputs["Scale"].default_value = 6.0
        nz.inputs["Detail"].default_value = 6
        nt.links.new(mp.outputs[0], nz.inputs["Vector"])
        r = nt.nodes.new("ShaderNodeMapRange")
        r.inputs["From Min"].default_value = 0.4
        r.inputs["From Max"].default_value = 0.65
        nt.links.new(nz.outputs["Fac"], r.inputs["Value"])
        nt.links.new(r.outputs[0], mix.inputs[0])
    elif vz == "patina":
        nz = nt.nodes.new("ShaderNodeTexNoise")
        nz.inputs["Scale"].default_value = 4.0
        nz.inputs["Detail"].default_value = 8
        nt.links.new(mp.outputs[0], nz.inputs["Vector"])
        r = nt.nodes.new("ShaderNodeMapRange")
        r.inputs["From Min"].default_value = 0.45
        r.inputs["From Max"].default_value = 0.7
        nt.links.new(nz.outputs["Fac"], r.inputs["Value"])
        nt.links.new(r.outputs[0], mix.inputs[0])
        hr = nt.nodes.new("ShaderNodeMapRange")
        hr.inputs["To Min"].default_value = p.get("h", 0.26) - 0.08
        hr.inputs["To Max"].default_value = p.get("h", 0.26) + 0.18
        nt.links.new(r.outputs[0], hr.inputs["Value"])
        nt.links.new(hr.outputs[0], i["Roughness"])
    elif vz == "marmor":
        nz = nt.nodes.new("ShaderNodeTexNoise")
        nz.inputs["Scale"].default_value = 1.6
        nz.inputs["Detail"].default_value = 10
        nz.inputs["Distortion"].default_value = 1.5
        nt.links.new(mp.outputs[0], nz.inputs["Vector"])
        wv = nt.nodes.new("ShaderNodeTexWave")
        wv.inputs["Scale"].default_value = 1.2
        wv.inputs["Distortion"].default_value = 12
        wv.inputs["Detail"].default_value = 6
        nt.links.new(nz.outputs["Color"], wv.inputs["Vector"])
        r = nt.nodes.new("ShaderNodeMapRange")
        r.inputs["From Min"].default_value = 0.88
        r.inputs["From Max"].default_value = 1.0
        nt.links.new(wv.outputs["Fac"], r.inputs["Value"])
        nt.links.new(r.outputs[0], mix.inputs[0])
    elif vz == "les":
        mp.inputs["Scale"].default_value = (1.0, 1.0, 0.15)
        nz = nt.nodes.new("ShaderNodeTexNoise")
        nz.inputs["Scale"].default_value = 2.0
        nz.inputs["Detail"].default_value = 4
        nt.links.new(mp.outputs[0], nz.inputs["Vector"])
        wv = nt.nodes.new("ShaderNodeTexWave")
        wv.wave_type = "RINGS"
        wv.inputs["Scale"].default_value = 3.0
        wv.inputs["Distortion"].default_value = 4.0
        wv.inputs["Detail"].default_value = 3
        nt.links.new(mp.outputs[0], wv.inputs["Vector"])
        nt.links.new(wv.outputs["Fac"], mix.inputs[0])
    elif vz == "lapis":
        nz = nt.nodes.new("ShaderNodeTexNoise")
        nz.inputs["Scale"].default_value = 5.0
        nz.inputs["Detail"].default_value = 8
        nt.links.new(mp.outputs[0], nz.inputs["Vector"])
        nt.links.new(nz.outputs["Fac"], mix.inputs[0])
        # zlati drobci pirita
        vo = nt.nodes.new("ShaderNodeTexVoronoi")
        vo.inputs["Scale"].default_value = 28.0
        vo.inputs["Randomness"].default_value = 1.0
        nt.links.new(mp.outputs[0], vo.inputs["Vector"])
        r = nt.nodes.new("ShaderNodeMapRange")
        r.inputs["From Min"].default_value = 0.09
        r.inputs["From Max"].default_value = 0.05
        nt.links.new(vo.outputs["Distance"], r.inputs["Value"])
        zl = nt.nodes.new("ShaderNodeMix")
        zl.data_type = "RGBA"
        zl.inputs[7].default_value = barva("#e2b24f")
        nt.links.new(mix.outputs[2], zl.inputs[6])
        nt.links.new(r.outputs[0], zl.inputs[0])
        nt.links.new(zl.outputs[2], i["Base Color"])
        nt.links.new(r.outputs[0], i["Metallic"])
    return m


def _steklo(ime, b, t):
    m = bpy.data.materials.new(ime)
    nt, P = _nodes(m)
    P.inputs["Base Color"].default_value = barva(b, t)
    P.inputs["Roughness"].default_value = 0.02
    P.inputs["Transmission Weight"].default_value = 1.0
    P.inputs["IOR"].default_value = 1.52
    vol = nt.nodes.new("ShaderNodeVolumeAbsorption")
    vol.inputs["Color"].default_value = barva(b, max(t, 0.0) + 0.25)
    vol.inputs["Density"].default_value = 0.25
    nt.links.new(vol.outputs[0], nt.nodes.get("Material Output").inputs["Volume"])
    return m


def _sij(ime, b, t):
    m = bpy.data.materials.new(ime)
    nt, P = _nodes(m)
    c = barva(b, t)
    P.inputs["Base Color"].default_value = c
    P.inputs["Roughness"].default_value = 0.3
    P.inputs["Emission Color"].default_value = c
    P.inputs["Emission Strength"].default_value = 2.5
    return m


def je_kovinski(vloga="glavna"):
    if SLOG == "cist":
        return False
    return PALETE[SLOG][vloga].get("k", 0) > 0.5


def barve_vloge(vloga):
    """(svetla, temna) barva vloge kot hex/ton za šaderje s preliv (planet, obroč)."""
    if SLOG == "cist":
        p = _cist(vloga, False)
        return p["b"], p.get("t", 0.0)
    p = PALETE[SLOG][vloga]
    return p["b"], 0.0


# ---------------------------------------------------------------- scena


def pocisti():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    _PREDP.clear()


def nastavi_render(vzorci, niti, velikost):
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"
    cy = sc.cycles
    naprava = "CPU"
    try:
        prefs = bpy.context.preferences.addons["cycles"].preferences
        for tip in ("OPTIX", "CUDA"):
            try:
                prefs.compute_device_type = tip
                prefs.get_devices()
                if [d for d in prefs.devices if d.type == tip]:
                    for d in prefs.devices:
                        d.use = d.type == tip
                    naprava = "GPU"
                    break
            except Exception:
                pass
    except Exception:
        pass
    cy.device = naprava
    print("IKONE naprava:", naprava)
    cy.samples = vzorci
    cy.use_adaptive_sampling = True
    cy.adaptive_threshold = 0.01
    cy.use_denoising = True
    cy.max_bounces = 16
    cy.transmission_bounces = 16
    cy.transparent_max_bounces = 16
    cy.glossy_bounces = 8
    cy.diffuse_bounces = 6
    cy.volume_bounces = 2
    cy.caustics_reflective = False
    cy.caustics_refractive = False
    cy.blur_glossy = 0.5
    cy.filter_width = 1.5
    if niti:
        sc.render.threads_mode = "FIXED"
        sc.render.threads = niti
    sc.render.film_transparent = True
    cy.film_transparent_glass = False
    sc.render.resolution_x = velikost
    sc.render.resolution_y = velikost
    sc.render.image_settings.file_format = "PNG"
    sc.render.image_settings.color_mode = "RGBA"
    sc.render.image_settings.color_depth = "16"
    vs = sc.view_settings
    vs.view_transform = "AgX"
    try:
        vs.look = "AgX - Medium High Contrast"
    except Exception:
        vs.look = "None"
    vs.exposure = 0.1


def svet():
    w = bpy.data.worlds.new("Studio")
    bpy.context.scene.world = w
    w.use_nodes = True
    nt = w.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    out = nt.nodes.new("ShaderNodeOutputWorld")
    bg = nt.nodes.new("ShaderNodeBackground")
    tc = nt.nodes.new("ShaderNodeTexCoord")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.35
    ramp.color_ramp.elements[0].color = (0.30, 0.31, 0.33, 1)
    ramp.color_ramp.elements[1].position = 0.75
    ramp.color_ramp.elements[1].color = (0.85, 0.87, 0.9, 1)
    mp = nt.nodes.new("ShaderNodeMapRange")
    mp.inputs["From Min"].default_value = -1
    mp.inputs["From Max"].default_value = 1
    nt.links.new(tc.outputs["Normal"], sep.inputs[0])
    nt.links.new(sep.outputs["Z"], mp.inputs["Value"])
    nt.links.new(mp.outputs["Result"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], bg.inputs["Color"])
    bg.inputs["Strength"].default_value = 0.55
    # lom skozi steklo vidi svetel studio (sicer je steklo na prozornem ozadju rjavo)
    lp = nt.nodes.new("ShaderNodeLightPath")
    svetlo = nt.nodes.new("ShaderNodeBackground")
    svetlo.inputs["Color"].default_value = (1.0, 0.98, 0.95, 1)
    svetlo.inputs["Strength"].default_value = 1.6
    mix = nt.nodes.new("ShaderNodeMixShader")
    nt.links.new(lp.outputs["Is Transmission Ray"], mix.inputs[0])
    nt.links.new(bg.outputs[0], mix.inputs[1])
    nt.links.new(svetlo.outputs[0], mix.inputs[2])
    nt.links.new(mix.outputs[0], out.inputs[0])


def luc(ime, lok, moc, velikost, b=(1, 1, 1), cilj=(0, 0, 0)):
    ld = bpy.data.lights.new(ime, "AREA")
    ld.energy = moc
    ld.shape = "DISK"
    ld.size = velikost
    ld.color = b
    o = bpy.data.objects.new(ime, ld)
    bpy.context.scene.collection.objects.link(o)
    o.location = lok
    o.rotation_euler = (Vector(cilj) - Vector(lok)).to_track_quat("-Z", "Y").to_euler()
    return o


def studio():
    # ključna luč zgoraj levo (spredaj), polnilna desno, obrobna zadaj
    luc("Kljucna", (-4.2, -4.0, 5.2), 1100, 3.5)
    luc("Polnilna", (5.0, -3.5, 1.2), 150, 5.0, (0.95, 0.97, 1.0))
    luc("Obrobna", (2.5, 5.5, 4.0), 650, 3.5)
    luc("Spodnja", (0.0, -3.0, -3.5), 60, 4.0)


ELEV = math.radians(16)


def kamera():
    cd = bpy.data.cameras.new("Kamera")
    cd.lens = 85
    cd.sensor_width = 36
    o = bpy.data.objects.new("Kamera", cd)
    bpy.context.scene.collection.objects.link(o)
    d = 11.0
    o.location = (0, -d * math.cos(ELEV), d * math.sin(ELEV))
    o.rotation_euler = (math.pi / 2 - ELEV, 0, 0)
    bpy.context.scene.camera = o
    return o


# ---------------------------------------------------------------- gradniki


def dodeli(o, m):
    o.data.materials.clear()
    o.data.materials.append(m)


def gladko(o):
    for p in o.data.polygons:
        p.use_smooth = True


def v_koren(o):
    o.parent = KOREN
    return o


def krogla(lok, r, m, seg=48, merilo=None):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg, ring_count=seg // 2, radius=r, location=lok)
    o = bpy.context.active_object
    if merilo:
        o.scale = merilo
    gladko(o)
    dodeli(o, m)
    return v_koren(o)


def ico(lok, r, m, sub=4):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=sub, radius=r, location=lok)
    o = bpy.context.active_object
    gladko(o)
    dodeli(o, m)
    return v_koren(o)


def usmeri(o, a, b):
    d = Vector(b) - Vector(a)
    o.rotation_euler = d.to_track_quat("Z", "Y").to_euler()


def valj(a, b, r, m, seg=32, rob=0.35):
    a, b = Vector(a), Vector(b)
    d = b - a
    bpy.ops.mesh.primitive_cylinder_add(vertices=seg, radius=r, depth=d.length, location=(a + b) / 2)
    o = bpy.context.active_object
    usmeri(o, a, b)
    gladko(o)
    if rob:
        bev = o.modifiers.new("rob", "BEVEL")
        bev.width = r * rob
        bev.segments = 4
        bev.limit_method = "ANGLE"
        o.modifiers.new("ws", "WEIGHTED_NORMAL")
    dodeli(o, m)
    return v_koren(o)


def stozec(a, b, r1, r2, m, seg=32):
    a, b = Vector(a), Vector(b)
    d = b - a
    bpy.ops.mesh.primitive_cone_add(vertices=seg, radius1=r1, radius2=r2, depth=d.length, location=(a + b) / 2)
    o = bpy.context.active_object
    usmeri(o, a, b)
    gladko(o)
    o.modifiers.new("ws", "WEIGHTED_NORMAL")
    dodeli(o, m)
    return v_koren(o)


def kapsula(a, b, r, m, seg=32):
    """Valj z zaobljenima koncema (bakterija, mitohondrij, mielin)."""
    a, b = Vector(a), Vector(b)
    d = b - a
    L = d.length
    bm = bmesh.new()
    obr = seg // 2
    vrste = []
    for k in range(obr + 1):
        f = math.pi * k / obr  # 0..pi
        z = -math.cos(f) * r
        rr = math.sin(f) * r
        z = z - L / 2 if k <= obr // 2 else z + L / 2
        vrste.append([bm.verts.new((rr * math.cos(2 * math.pi * j / seg), rr * math.sin(2 * math.pi * j / seg), z)) for j in range(seg)])
        if k == obr // 2:
            vrste.append([bm.verts.new((r * math.cos(2 * math.pi * j / seg), r * math.sin(2 * math.pi * j / seg), L / 2)) for j in range(seg)])
    for v1, v2 in zip(vrste, vrste[1:]):
        for j in range(seg):
            bm.faces.new((v1[j], v1[(j + 1) % seg], v2[(j + 1) % seg], v2[j]))
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-6)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new("kapsula")
    bm.to_mesh(me)
    o = bpy.data.objects.new("kapsula", me)
    bpy.context.scene.collection.objects.link(o)
    o.location = (a + b) / 2
    usmeri(o, a, b)
    gladko(o)
    dodeli(o, m)
    return v_koren(o)


def cev(tocke, r, m, ime="cev", zaprta=False, polmeri=None, res=8):
    """Gladka cev skozi točke; polmeri = seznam faktorjev (zoženje)."""
    cd = bpy.data.curves.new(ime, "CURVE")
    cd.dimensions = "3D"
    cd.bevel_depth = r
    cd.bevel_resolution = res
    cd.use_fill_caps = True
    cd.resolution_u = 16
    sp = cd.splines.new("NURBS")
    sp.points.add(len(tocke) - 1)
    for k, (p, t) in enumerate(zip(sp.points, tocke)):
        p.co = (t[0], t[1], t[2], 1)
        if polmeri:
            p.radius = polmeri[k]
    sp.order_u = min(4, len(tocke))
    sp.use_endpoint_u = not zaprta
    sp.use_cyclic_u = zaprta
    sp.use_smooth = True
    o = bpy.data.objects.new(ime, cd)
    bpy.context.scene.collection.objects.link(o)
    o.data.materials.append(m)
    return v_koren(o)


def torus(R, r, m, rot=(0, 0, 0), merilo=(1, 1, 1), lok=(0, 0, 0)):
    bpy.ops.mesh.primitive_torus_add(major_radius=R, minor_radius=r, major_segments=160, minor_segments=20, location=lok)
    o = bpy.context.active_object
    o.rotation_euler = rot
    o.scale = merilo
    gladko(o)
    dodeli(o, m)
    return v_koren(o)


def mreza(ime, verts, faces, m, smooth=True):
    me = bpy.data.meshes.new(ime)
    me.from_pydata(verts, [], faces)
    me.validate()
    o = bpy.data.objects.new(ime, me)
    bpy.context.scene.collection.objects.link(o)
    if smooth:
        gladko(o)
    o.data.materials.append(m)
    return v_koren(o)


def list_ploskev(dolzina, sirina, m, upogib=0.25, vbocenost=0.08, n=40, k=14, debelina=0.02, oblika=0.8):
    """List (ploskev z debelino): os po +Y, širina po X, upogib navzdol proti konici."""
    V, F = [], []
    for i in range(n + 1):
        u = i / n
        w = sirina * (math.sin(math.pi * u ** oblika) ** 0.9)
        for j in range(k + 1):
            v = -1 + 2 * j / k
            x = v * w
            y = u * dolzina
            z = -upogib * u * u * dolzina + vbocenost * (v * v) * w * 2
            V.append((x, y, z))
    for i in range(n):
        for j in range(k):
            a = i * (k + 1) + j
            F.append((a, a + 1, a + k + 2, a + k + 1))
    o = mreza("list", V, F, m)
    s = o.modifiers.new("deb", "SOLIDIFY")
    s.thickness = debelina
    s.offset = 0
    sub = o.modifiers.new("sub", "SUBSURF")
    sub.levels = 1
    sub.render_levels = 1
    return o


def uvozi_glb(pot, pravila, privzeto, odstrani=()):
    """Uvozi GLB, vsakemu delu dodeli material po prvem pravilu (podniz imena -> material), deli pod KOREN."""
    pred = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=pot)
    novi = [o for o in bpy.data.objects if o not in pred]
    for o in list(novi):
        if o.type != "MESH":
            continue
        ime = o.name.lower()
        if any(s in ime for s in odstrani):
            bpy.data.objects.remove(o)
            continue
        m = privzeto
        for podniz, mm in pravila:
            if podniz in ime:
                m = mm
                break
        if m is None:
            bpy.data.objects.remove(o)
            continue
        o.data.materials.clear()
        o.data.materials.append(m)
        if o.data.color_attributes:
            pass
        gladko(o)
    skupina = bpy.data.objects.new("glb", None)
    bpy.context.scene.collection.objects.link(skupina)
    for o in bpy.data.objects:
        if o not in pred and o is not skupina and o.parent is None:
            mw = o.matrix_world.copy()
            o.parent = skupina
            o.matrix_world = mw
    skupina.parent = KOREN
    return skupina


def nakljucno(seme):
    import random
    return random.Random(seme)


def fib_sfera(n):
    pts = []
    zl = math.pi * (3 - 5 ** 0.5)
    for k in range(n):
        y = 1 - 2 * (k + 0.5) / n
        r = math.sqrt(1 - y * y)
        pts.append(Vector((r * math.cos(zl * k), r * math.sin(zl * k), y)))
    return pts


# ---------------------------------------------------------------- kader


def tocke_scene():
    dg = bpy.context.evaluated_depsgraph_get()
    pts = []
    for o in bpy.context.scene.objects:
        if o.type not in ("MESH", "CURVE", "META") or o.name.startswith("Tla") or o.hide_render:
            continue
        oe = o.evaluated_get(dg)
        try:
            me = oe.to_mesh()
        except RuntimeError:
            continue
        if me is None:
            continue
        mw = oe.matrix_world
        vs = me.vertices
        korak = max(1, len(vs) // 4000)
        pts += [mw @ vs[i].co for i in range(0, len(vs), korak)]
        oe.to_mesh_clear()
    return pts


def uokviri(cam, delez=0.8):
    sc = bpy.context.scene
    for _ in range(4):
        bpy.context.view_layer.update()
        uv = [world_to_camera_view(sc, cam, p) for p in tocke_scene()]
        xs = [u.x for u in uv]
        ys = [u.y for u in uv]
        w, h = max(xs) - min(xs), max(ys) - min(ys)
        cx, cy = (max(xs) + min(xs)) / 2, (max(ys) + min(ys)) / 2
        KOREN.scale = KOREN.scale * (delez / max(w, h))
        bpy.context.view_layer.update()
        desno = cam.matrix_world.to_3x3() @ Vector((1, 0, 0))
        gor = cam.matrix_world.to_3x3() @ Vector((0, 1, 0))
        razd = (cam.location - KOREN.location).length
        sirina = 2 * razd * math.tan(math.atan(cam.data.sensor_width / (2 * cam.data.lens)))
        KOREN.location -= desno * (cx - 0.5) * sirina + gor * (cy - 0.5) * sirina
    bpy.context.view_layer.update()
    pts = tocke_scene()
    return min(p.z for p in pts), max(p.z for p in pts)


def tla(zmin, visina):
    bpy.ops.mesh.primitive_plane_add(size=40, location=(0, 0, zmin - 0.07 * visina))
    o = bpy.context.active_object
    o.name = "Tla"
    o.is_shadow_catcher = True
    return o

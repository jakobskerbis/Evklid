# Fotorealistični laboratorij (docs/laboratorij.md »Fotografije«): proceduralni modeli steklovine in naprav v PRAVIH
# MERAH za Blender (Cycles). Brez zunanjih datotek: vse nastane iz številk spodaj. Enota v kodi je mm (MM → metri).
# Optika po treh mejnih ploskvah (Cycles ne pozna vgnezdenih dielektrikov): zrak–steklo (n = 1,47), steklo–tekočina
# (razmerje 1,47/1,33) in tekočina–zrak (n = 1,33, menisk iz Young–Laplaceove enačbe). Viri mer so ob vsaki številki.
import math
import bpy
import bmesh

MM = 0.001
N_STEKLO = 1.474   # borosilikatno steklo 3.3 (Schott DURAN, nd = 1,473; ISO 3585)
N_VODA = 1.333     # voda in razredčene vodne raztopine pri 20 °C, 589 nm (CRC Handbook)
KAPILARNA = 2.73   # kapilarna dolžina vode pri 20 °C [mm]: sqrt(γ/ρg), γ = 72,8 mN/m, ρ = 998 kg/m³ (CRC)

# Erlenmajerica z ozkim vratom po ISO 1773: prostornina → (premer dna, premer vratu, višina, višina stožca, stena)
ERLENMAJERICE = {100: dict(d=64, vrat=22, h=105, stozec=80, stena=1.3), 250: dict(d=85, vrat=34, h=145, stozec=112, stena=1.6)}
# Bireta 50 mL razreda A po ISO 385: razdelek 0,1 mL, dolžina lestvice 500–600 mm; tu 525 mm (10,5 mm/mL kot v modelu
# lab-model-titracija.js BIRETA.mmNaML), notranji premer 11 mm, zunanji 13 mm; črte ≤ 0,3 mm.
BIRETA = dict(V=50, mm_ml=10.5, di=11.0, do=13.0, nad=80, pod=25, pipa=16, konica=60, crta=0.3)
# Polnilna pipeta 25 mL razreda A po ISO 648 (dolžina 450 mm, bučka Ø 21 × 100 mm kot v risbi); barvna oznaka po
# ISO 1769: 25 mL = modra.
PIPETA = dict(V=25, dolzina=450, steblo=5.0, stena=0.9, bucka=21.0, bucka_l=100, zgoraj=200, oznaka=50)
# Epruveta 16 × 160 mm (DIN 12395), stena 1,1 mm, okroglo dno, zavihan rob.
EPRUVETA = dict(d=16.0, l=160, stena=1.1)
# Nizka čaša 250 mL po ISO 3819: zunanji premer 70 mm, višina 95 mm, stena ~1,6 mm, izliv.
CASA = dict(d=70.0, h=95, stena=1.6)
# Ogljikov plastni upornik 0,5 W (model UPOR.P = 0,5 W): telo 9,0 × Ø 3,3 mm, žica Ø 0,55 mm (Yageo CFR-50);
# 0,25 W: 6,3 × Ø 2,4 mm (CFR-25).
UPORNIK = {0.5: dict(l=9.0, d=3.3, zica=0.55), 0.25: dict(l=6.3, d=2.4, zica=0.55)}
# Barvna koda uporov IEC 60062 (števka → barva, linearni sRGB približki barv lakov).
BARVE_KODE = {0: (0.02, 0.02, 0.02), 1: (0.25, 0.10, 0.03), 2: (0.70, 0.03, 0.03), 3: (0.95, 0.30, 0.02), 4: (0.95, 0.75, 0.03),
              5: (0.05, 0.40, 0.08), 6: (0.03, 0.10, 0.60), 7: (0.35, 0.08, 0.50), 8: (0.35, 0.35, 0.35), 9: (0.92, 0.92, 0.90)}
ZLATA = (0.75, 0.55, 0.15)


def barvna_koda(ohm):
    """Štirje obročki po IEC 60062: dve števki, množitelj, toleranca ±5 % (zlata). 47 → [4, 7, 0, 'zlata']."""
    e = int(math.floor(math.log10(ohm))) - 1
    stevki = int(round(ohm / 10 ** e))
    if stevki >= 100:
        stevki //= 10; e += 1
    return [stevki // 10, stevki % 10, e, "zlata"]


# ---------------------------------------------------------------- osnove
def pocisti():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    return bpy.context.scene


def zbirka(ime):
    c = bpy.data.collections.get(ime)
    if c is None:
        c = bpy.data.collections.new(ime)
        bpy.context.scene.collection.children.link(c)
    return c


def predmet(ime, mesh, mat=None, zb="prizor", premik=(0, 0, 0)):
    o = bpy.data.objects.new(ime, mesh)
    zbirka(zb).objects.link(o)
    o.location = [v * MM for v in premik]
    if mat is not None:
        for m in (mat if isinstance(mat, (list, tuple)) else [mat]):
            mesh.materials.append(m)
    return o


def gladko(mesh, kot=40):
    for p in mesh.polygons:
        p.use_smooth = True
    try:
        mesh.set_sharp_from_angle(angle=math.radians(kot))
    except Exception:
        pass


def vrtenina(ime, profil, mat, n=96, zb="prizor", premik=(0, 0, 0), indeksi=None, kot=40, podpora=True):
    """Vrtenina okoli osi z iz profila [(r, z)] v mm. Normale kažejo na desno stran smeri profila: (dz, −dr).
    indeksi[i] = reža materiala za odsek i → i+1."""
    # Podporni obroči: gladko senčenje povpreči normale sosednjih odsekov, zato bi dolg raven odsek (stena cevi 600 mm)
    # dobil po vsej dolžini rahlo nagnjene normale in lomil svetlobo navpično. Obroč 0,25 mm od vsakega konca daljših
    # odsekov zadrži nagib na koncih; vmes so normale točne.
    if podpora:
        p2, i2 = [profil[0]], []
        for i, ((r1, z1), (r2, z2)) in enumerate(zip(profil, profil[1:])):
            d = math.hypot(r2 - r1, z2 - z1)
            mi = indeksi[i] if indeksi else 0
            if d > 1.5:
                e = 0.25 / d
                p2 += [(r1 + (r2 - r1) * e, z1 + (z2 - z1) * e), (r2 - (r2 - r1) * e, z2 - (z2 - z1) * e)]; i2 += [mi, mi]
            p2.append((r2, z2)); i2.append(mi)
        profil, indeksi = p2, i2
    bm = bmesh.new()
    obroci = []
    for r, z in profil:
        if r < 1e-6:
            obroci.append([bm.verts.new((0, 0, z * MM))])
        else:
            obroci.append([bm.verts.new((r * MM * math.cos(2 * math.pi * k / n), r * MM * math.sin(2 * math.pi * k / n), z * MM)) for k in range(n)])
    for i in range(len(profil) - 1):
        a, b = obroci[i], obroci[i + 1]
        mi = indeksi[i] if indeksi else 0
        for k in range(n):
            k2 = (k + 1) % n
            if len(a) == 1 and len(b) == 1:
                continue
            if len(a) == 1:
                f = bm.faces.new((a[0], b[k2], b[k]))
            elif len(b) == 1:
                f = bm.faces.new((a[k], a[k2], b[0]))
            else:
                f = bm.faces.new((a[k], a[k2], b[k2], b[k]))
            f.material_index = mi
    me = bpy.data.meshes.new(ime)
    bm.to_mesh(me); bm.free()
    gladko(me, kot)
    return predmet(ime, me, mat, zb, premik)


def kvader(ime, sx, sy, sz, mat, zb="prizor", premik=(0, 0, 0), posnetje=0.0, seg=3):
    """Kvader s središčem spodnje ploskve v premik; posnetje robov v mm."""
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x *= sx * MM; v.co.y *= sy * MM; v.co.z = (v.co.z + 0.5) * sz * MM
    if posnetje > 0:
        bmesh.ops.bevel(bm, geom=list(bm.edges), offset=posnetje * MM, segments=seg, affect="EDGES", profile=0.5)
    me = bpy.data.meshes.new(ime)
    bm.to_mesh(me); bm.free()
    gladko(me, 35)
    return predmet(ime, me, mat, zb, premik)


def valj(ime, r, l, mat, zb="prizor", premik=(0, 0, 0), os="z", n=48, posnetje=0.0):
    """Poln valj dolžine l od premik vzdolž osi (x, y ali z)."""
    p = posnetje
    profil = [(0, 0), (r - p, 0), (r, p), (r, l - p), (r - p, l), (0, l)] if p > 0 else [(0, 0), (r, 0), (r, l), (0, l)]
    o = vrtenina(ime, profil, mat, n, zb, premik, kot=50)
    if os == "x":
        o.rotation_euler = (0, math.radians(90), 0)
    elif os == "y":
        o.rotation_euler = (math.radians(-90), 0, 0)
    return o


def cev(ime, tocke, r, mat, zb="prizor", n=12, gladke=True):
    """Cev (žica, kabel) skozi točke v mm kot krivulja s krožnim prerezom."""
    cu = bpy.data.curves.new(ime, "CURVE")
    cu.dimensions = "3D"; cu.bevel_depth = r * MM; cu.bevel_resolution = max(2, n // 4); cu.use_fill_caps = True
    sp = cu.splines.new("NURBS" if gladke else "POLY")
    sp.points.add(len(tocke) - 1)
    for p, t in zip(sp.points, tocke):
        p.co = (t[0] * MM, t[1] * MM, t[2] * MM, 1)
    if gladke:
        sp.use_endpoint_u = True; sp.order_u = min(4, len(tocke)); sp.resolution_u = 16
    o = bpy.data.objects.new(ime, cu)
    zbirka(zb).objects.link(o)
    cu.materials.append(mat)
    return o


# ---------------------------------------------------------------- materiali
def _mat(ime):
    m = bpy.data.materials.new(ime)
    m.use_nodes = True
    nt = m.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    return m, nt, out


def _nastavi(node, **kw):
    for k, v in kw.items():
        if k in node.inputs:
            node.inputs[k].default_value = v


def steklo(ime="steklo", ior=N_STEKLO, barva=(1, 1, 1, 1), hrapavost=0.0):
    m = bpy.data.materials.get(ime)
    if m:
        return m
    m, nt, out = _mat(ime)
    g = nt.nodes.new("ShaderNodeBsdfGlass")
    _nastavi(g, Color=barva, Roughness=hrapavost, IOR=ior)
    nt.links.new(g.outputs[0], out.inputs["Surface"])
    return m


def snov(ime, barva, hrapavost=0.5, kovina=0.0, prosojnost=0.0, ior=1.5, sijaj=None, emisija=None, moc=0.0, lak=0.0, zrnatost=0.0, merilo=400.0):
    """Principled BSDF; zrnatost > 0 doda droben relief (šum) za plastiko, litino, mizo."""
    m = bpy.data.materials.get(ime)
    if m:
        return m
    m, nt, out = _mat(ime)
    p = nt.nodes.new("ShaderNodeBsdfPrincipled")
    b = tuple(barva) + (1,) if len(barva) == 3 else barva
    _nastavi(p, **{"Base Color": b, "Roughness": hrapavost, "Metallic": kovina, "IOR": ior, "Transmission Weight": prosojnost, "Coat Weight": lak})
    if sijaj is not None:
        _nastavi(p, **{"Specular IOR Level": sijaj})
    if emisija is not None:
        _nastavi(p, **{"Emission Color": tuple(emisija) + (1,), "Emission Strength": moc})
    if zrnatost > 0:
        no = nt.nodes.new("ShaderNodeTexNoise"); no.inputs["Scale"].default_value = merilo; no.inputs["Detail"].default_value = 4
        bu = nt.nodes.new("ShaderNodeBump"); bu.inputs["Strength"].default_value = zrnatost; bu.inputs["Distance"].default_value = 0.0002
        nt.links.new(no.outputs[0], bu.inputs["Height"]); nt.links.new(bu.outputs[0], p.inputs["Normal"])
    nt.links.new(p.outputs[0], out.inputs["Surface"])
    return m


def kovina(ime="jeklo", barva=(0.62, 0.63, 0.65), hrapavost=0.28, krtaceno=0.0):
    """Kovina; krtaceno > 0: drobne proge vzdolž osi z (krtačeno jeklo palic stojala)."""
    m = bpy.data.materials.get(ime)
    if m:
        return m
    m, nt, out = _mat(ime)
    p = nt.nodes.new("ShaderNodeBsdfPrincipled")
    _nastavi(p, **{"Base Color": tuple(barva) + (1,), "Roughness": hrapavost, "Metallic": 1.0})
    if krtaceno > 0:
        tc = nt.nodes.new("ShaderNodeTexCoord"); mp = nt.nodes.new("ShaderNodeMapping")
        mp.inputs["Scale"].default_value = (900, 900, 6)
        no = nt.nodes.new("ShaderNodeTexNoise"); no.inputs["Scale"].default_value = 1.0; no.inputs["Detail"].default_value = 3
        bu = nt.nodes.new("ShaderNodeBump"); bu.inputs["Strength"].default_value = krtaceno; bu.inputs["Distance"].default_value = 0.0001
        nt.links.new(tc.outputs["Object"], mp.inputs["Vector"]); nt.links.new(mp.outputs[0], no.inputs["Vector"])
        nt.links.new(no.outputs[0], bu.inputs["Height"]); nt.links.new(bu.outputs[0], p.inputs["Normal"])
    nt.links.new(p.outputs[0], out.inputs["Surface"])
    return m


def les(ime="les", svetla=(0.66, 0.47, 0.27), temna=(0.50, 0.33, 0.17), os=(1.5, 9, 9)):
    """Bukov les: letnice (valovna tekstura, popačena s šumom), pore, rahel lak."""
    m = bpy.data.materials.get(ime)
    if m:
        return m
    m, nt, out = _mat(ime)
    p = nt.nodes.new("ShaderNodeBsdfPrincipled")
    tc = nt.nodes.new("ShaderNodeTexCoord"); mp = nt.nodes.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = os
    wa = nt.nodes.new("ShaderNodeTexWave"); wa.wave_type = "RINGS"
    _nastavi(wa, Scale=18.0, Distortion=6.0, Detail=3.0, **{"Detail Scale": 2.0})
    no = nt.nodes.new("ShaderNodeTexNoise"); _nastavi(no, Scale=220.0, Detail=6.0)
    mix = nt.nodes.new("ShaderNodeMix"); mix.data_type = "RGBA"
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].color = tuple(temna) + (1,); ramp.color_ramp.elements[1].color = tuple(svetla) + (1,)
    ramp.color_ramp.elements[0].position = 0.15; ramp.color_ramp.elements[1].position = 0.8
    ma = nt.nodes.new("ShaderNodeMath"); ma.operation = "MULTIPLY_ADD"; ma.inputs[1].default_value = 0.8; ma.inputs[2].default_value = 0.0
    ma2 = nt.nodes.new("ShaderNodeMath"); ma2.operation = "MULTIPLY_ADD"; ma2.inputs[1].default_value = 0.25; ma2.inputs[2].default_value = 0.0
    ad = nt.nodes.new("ShaderNodeMath"); ad.operation = "ADD"
    nt.links.new(tc.outputs["Object"], mp.inputs["Vector"])
    nt.links.new(mp.outputs[0], wa.inputs["Vector"]); nt.links.new(mp.outputs[0], no.inputs["Vector"])
    nt.links.new(wa.outputs["Fac"], ma.inputs[0]); nt.links.new(no.outputs[0], ma2.inputs[0])
    nt.links.new(ma.outputs[0], ad.inputs[0]); nt.links.new(ma2.outputs[0], ad.inputs[1])
    nt.links.new(ad.outputs[0], ramp.inputs["Fac"]); nt.links.new(ramp.outputs["Color"], p.inputs["Base Color"])
    bu = nt.nodes.new("ShaderNodeBump"); bu.inputs["Strength"].default_value = 0.25; bu.inputs["Distance"].default_value = 0.0003
    nt.links.new(ad.outputs[0], bu.inputs["Height"]); nt.links.new(bu.outputs[0], p.inputs["Normal"])
    _nastavi(p, Roughness=0.45, **{"Coat Weight": 0.15})
    nt.links.new(p.outputs[0], out.inputs["Surface"])
    return m


def miza(ime="miza", barva=(0.80, 0.81, 0.80)):
    """Laboratorijski pult (kompaktna plošča HPL, svetlo siva): drobne pike, rahlo neenakomeren sijaj."""
    m = bpy.data.materials.get(ime)
    if m:
        return m
    m, nt, out = _mat(ime)
    p = nt.nodes.new("ShaderNodeBsdfPrincipled")
    no = nt.nodes.new("ShaderNodeTexNoise"); _nastavi(no, Scale=2600.0, Detail=2.0)
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.35; ramp.color_ramp.elements[0].color = tuple(v * 0.86 for v in barva) + (1,)
    ramp.color_ramp.elements[1].position = 0.62; ramp.color_ramp.elements[1].color = tuple(barva) + (1,)
    no2 = nt.nodes.new("ShaderNodeTexNoise"); _nastavi(no2, Scale=9.0, Detail=5.0)
    mr = nt.nodes.new("ShaderNodeMapRange"); _nastavi(mr, **{"To Min": 0.26, "To Max": 0.44})
    nt.links.new(no.outputs[0], ramp.inputs["Fac"]); nt.links.new(ramp.outputs["Color"], p.inputs["Base Color"])
    nt.links.new(no2.outputs[0], mr.inputs["Value"]); nt.links.new(mr.outputs[0], p.inputs["Roughness"])
    bu = nt.nodes.new("ShaderNodeBump"); bu.inputs["Strength"].default_value = 0.05; bu.inputs["Distance"].default_value = 0.0001
    nt.links.new(no.outputs[0], bu.inputs["Height"]); nt.links.new(bu.outputs[0], p.inputs["Normal"])
    nt.links.new(p.outputs[0], out.inputs["Surface"])
    return m


def svetilo(ime, barva=(1, 1, 1), moc=1.0):
    m = bpy.data.materials.get(ime)
    if m:
        return m
    m, nt, out = _mat(ime)
    e = nt.nodes.new("ShaderNodeEmission")
    _nastavi(e, Color=tuple(barva) + (1,), Strength=moc)
    nt.links.new(e.outputs[0], out.inputs["Surface"])
    return m


# ---------------------------------------------------------------- menisk (Young–Laplace)
def meniskus(R, nagib=0.0, theta=0.0, a=KAPILARNA, n=40):
    """Profil vbočenega meniska [(r, z)] od osi (z = 0, najnižja točka) do stene. R: polmer stene v višini dna meniska
    [mm]; nagib: kot stene od navpičnice (stožec, ki se navzgor oži: > 0) [rad]; theta: kot omočenja (čisto steklo ≈ 0).
    Osnosimetrična Young–Laplaceova enačba po ločni dolžini: dr/ds = cos φ, dz/ds = sin φ,
    dφ/ds = 2κ0 + z/a² − sin φ / r; κ0 (ukrivljenost v temenu) s streljanjem, da je ob steni φ = 90° + nagib − theta."""
    cilj = math.pi / 2 + nagib - theta
    tn = math.tan(nagib)

    def strel(k0):
        r = z = phi = 0.0
        ds = min(R, a) / 400
        pot = [(0.0, 0.0)]
        for _ in range(200000):
            kr = k0 if r < 1e-9 else math.sin(phi) / r
            phi += (2 * k0 + z / (a * a) - kr) * ds
            r += math.cos(phi) * ds; z += math.sin(phi) * ds
            pot.append((r, z))
            if phi >= cilj:
                return "kot", r - (R - tn * z), pot
            if r >= R - tn * z:
                return "stena", phi - cilj, pot
        return "stena", -1, pot

    lo, hi = 0.0, 2.0 / R + 1.0
    for _ in range(60):
        mid = (lo + hi) / 2
        kaj, _, _ = strel(mid)
        if kaj == "kot":   # ciljni kot dosežen pred steno: ukrivljenost prevelika
            hi = mid
        else:
            lo = mid
    _, _, pot = strel(lo)
    korak = max(1, len(pot) // n)
    out = pot[::korak]
    if out[-1] != pot[-1]:
        out.append(pot[-1])
    rk, zk = out[-1]
    out[-1] = (R - tn * zk, zk)
    return out


def visina_meniska(R, **kw):
    return meniskus(R, **kw)[-1][1]


# ---------------------------------------------------------------- steklovina
def _posoda(ime, zunaj, znotraj, gladina, mat_steklo, mat_meja, mat_gladina, n, zb, premik, stena_r, nagib=None):
    """Stekleno telo iz zunanjega profila (od dna navzgor) in notranjega (od vrha navzdol do osi). gladina: višina dna
    meniska [mm nad zunanjim dnom] ali None. Vrne (steklo, gladina_predmet ali None, profil tekočine ali None)."""
    if gladina is None:
        o = vrtenina(ime, zunaj + znotraj, mat_steklo, n, zb, premik)
        return o, None, None
    R = stena_r(gladina)
    men = meniskus(R, nagib=nagib(gladina) if nagib else 0.0)
    zk = gladina + men[-1][1]   # višina stika gladine s steno
    zgoraj = [p for p in znotraj if p[1] > zk] + [(stena_r(zk), zk)]
    spodaj = [(stena_r(zk), zk)] + [p for p in znotraj if p[1] < zk]
    profil = zunaj + zgoraj + spodaj[1:]
    ind = [0] * (len(zunaj) + len(zgoraj) - 1) + [1] * (len(spodaj) - 1)
    o = vrtenina(ime, profil, [mat_steklo, mat_meja], n, zb, premik, indeksi=ind)
    top = [(r, gladina + z) for r, z in reversed(men)]
    top[0] = (stena_r(zk), zk)
    g = vrtenina(ime + "-gladina", top, mat_gladina, n, zb, premik, kot=60)
    return o, g, (spodaj, top)


def telo_tekocine(ime, spodaj, top, zb, premik, n=64):
    """Zaprto telo tekočine (za sloj debeline): stena od stika navzdol do osi + gladina od osi do stika."""
    profil = list(reversed(spodaj)) + list(reversed(top))[1:]
    m = bpy.data.materials.get("debelina")
    return vrtenina(ime, profil, m, n, zb, premik)


def erlenmajerica(ime, V=100, gladina=None, zb="prizor", premik=(0, 0, 0), n=128):
    """ISO 1773. gladina = višina tekočine nad NOTRANJIM dnom [mm] (kot flaskLevel v lab-kem.js) ali None."""
    e = ERLENMAJERICE[V]
    R, rv, H, Hc, t = e["d"] / 2, e["vrat"] / 2, e["h"], e["stozec"], e["stena"]
    dno = 2.0  # debelina dna
    zaob = 5.0
    # zunanji profil: os → zaobljen prehod → stožec → vrat → zavihan rob
    zunaj = [(0, 0), (R - zaob, 0)]
    for k in range(1, 7):
        a = -math.pi / 2 + k * (math.pi / 2) / 6
        zunaj.append((R - zaob + zaob * math.cos(a), zaob + zaob * math.sin(a)))
    zunaj += [(rv + 1.2, Hc - 4), (rv + 0.3, Hc), (rv, Hc + 3), (rv, H - 4), (rv + 0.9, H - 2.2), (rv + 1.5, H - 0.8), (rv + 1.3, H), (rv + 0.4, H + 0.2)]
    ri = rv - t
    Ri = R - t
    znotraj = [(ri + 0.2, H - 0.6), (ri, H - 3), (ri, Hc + 3), (ri + 0.3, Hc), (ri + 1.2, Hc - 4)]
    for k in range(6, 0, -1):
        a = -math.pi / 2 + k * (math.pi / 2) / 6
        znotraj.append((Ri - zaob + (zaob - 0.3) * math.cos(a), dno + zaob + (zaob - 0.3) * math.sin(a)))
    znotraj += [(Ri - zaob, dno), (0, dno)]

    def stena_r(z):   # notranji polmer v višini z nad zunanjim dnom (model: stožec RB → RN v 80 mm, nato vrat)
        hh = z - dno
        if hh <= 0:
            return Ri - zaob
        return max(ri, (R - (R - rv) * hh / Hc) - t) if hh < Hc else ri

    kot = math.atan((R - rv) / Hc)
    g = None if gladina is None else gladina + dno
    return _posoda(ime, zunaj, znotraj, g, steklo(), steklo("meja", N_STEKLO / N_VODA), steklo("gladina", N_VODA), n, zb, premik, stena_r,
                   nagib=lambda z: kot if z - dno < Hc - 2 else 0.0) + (dno,)


def epruveta(ime, gladina=None, zb="prizor", premik=(0, 0, 0), n=64):
    """Epruveta 16 × 160 mm z okroglim dnom; premik = spodnja točka dna. gladina nad notranjim dnom [mm]."""
    R, L, t = EPRUVETA["d"] / 2, EPRUVETA["l"], EPRUVETA["stena"]
    zunaj = [(R * math.sin(k * math.pi / 2 / 10), R - R * math.cos(k * math.pi / 2 / 10)) for k in range(0, 11)]
    zunaj += [(R, L - 3), (R + 0.7, L - 1.2), (R + 0.9, L - 0.4), (R + 0.5, L)]
    ri = R - t
    znotraj = [(ri + 0.3, L - 0.3), (ri, L - 2.5)] + [(ri * math.sin(k * math.pi / 2 / 10), R - ri * math.cos(k * math.pi / 2 / 10)) for k in range(10, -1, -1)]

    def stena_r(z):
        dz = R - z
        return ri if dz <= 0 else math.sqrt(max(0.0, ri * ri - dz * dz))

    g = None if gladina is None else gladina + t
    return _posoda(ime, zunaj, znotraj, g, steklo(), steklo("meja", N_STEKLO / N_VODA), steklo("gladina", N_VODA), n, zb, premik, stena_r) + (t,)


def casa(ime, gladina=None, zb="prizor", premik=(0, 0, 0), n=128):
    """Nizka čaša 250 mL (ISO 3819) z izlivom v smeri −x."""
    R, H, t = CASA["d"] / 2, CASA["h"], CASA["stena"]
    dno, zaob = 2.2, 6.0
    zunaj = [(0, 0), (R - zaob, 0)] + [(R - zaob + zaob * math.cos(-math.pi / 2 + k * math.pi / 12), zaob + zaob * math.sin(-math.pi / 2 + k * math.pi / 12)) for k in range(1, 7)]
    zunaj += [(R, H - 5), (R + 0.8, H - 2.5), (R + 1.8, H - 0.6), (R + 1.6, H)]
    Ri = R - t
    znotraj = [(Ri + 1.3, H - 0.3), (Ri + 0.3, H - 2.5), (Ri, H - 5)] + [(Ri - zaob + (zaob - 0.4) * math.cos(-math.pi / 2 + k * math.pi / 12), dno + zaob + (zaob - 0.4) * math.sin(-math.pi / 2 + k * math.pi / 12)) for k in range(6, 0, -1)]
    znotraj += [(Ri - zaob, dno), (0, dno)]
    g = None if gladina is None else gladina + dno
    out = _posoda(ime, zunaj, znotraj, g, steklo(), steklo("meja", N_STEKLO / N_VODA), steklo("gladina", N_VODA), n, zb, premik, lambda z: Ri)
    me = out[0].data   # izliv: rob se v ozkem kotu izboči navzven
    for v in me.vertices:
        z = v.co.z / MM
        if z > H - 9:
            kot = math.atan2(v.co.y, v.co.x)
            d = abs(abs(kot) - math.pi)
            if d < 0.45:
                f = (1 - d / 0.45) ** 2 * ((z - (H - 9)) / 9) ** 1.5
                v.co.x -= 7 * MM * f; v.co.z -= 1.5 * MM * f
    return out + (dno,)


def oznake_valja(ime, r, crte, mat, zb="prizor", premik=(0, 0, 0), debelina=0.3, sredina=-math.pi / 2):
    """Tiskane črte na valju polmera r: crte = [(z, delež oboda)], sredina loka gleda proti kameri (−y)."""
    bm = bmesh.new()
    rr = (r + 0.02) * MM
    for z, delez in crte:
        pol = delez * math.pi
        k = max(2, int(delez * 48))
        for i in range(k):
            a0 = sredina - pol + 2 * pol * i / k; a1 = sredina - pol + 2 * pol * (i + 1) / k
            vs = [bm.verts.new((rr * math.cos(a), rr * math.sin(a), (z + dz) * MM)) for a, dz in ((a0, -debelina / 2), (a1, -debelina / 2), (a1, debelina / 2), (a0, debelina / 2))]
            bm.faces.new(vs)
    me = bpy.data.meshes.new(ime)
    bm.to_mesh(me); bm.free()
    return predmet(ime, me, mat, zb, premik)


def oznake_vrtenine(ime, crte, mat, zb="prizor", premik=(0, 0, 0), debelina=0.35, sredina=-math.pi / 2):
    """Tiskane črte na vrtenini: crte = [(z, polmer v tej višini, širina loka v mm)], sredina loka proti kameri."""
    bm = bmesh.new()
    for z, r, sirina in crte:
        rr = (r + 0.03) * MM
        pol = sirina / 2 / r
        k = max(3, int(sirina / 1.5))
        for i in range(k):
            a0 = sredina - pol + 2 * pol * i / k; a1 = sredina - pol + 2 * pol * (i + 1) / k
            bm.faces.new([bm.verts.new((rr * math.cos(a), rr * math.sin(a), (z + dz) * MM)) for a, dz in ((a0, -debelina / 2), (a1, -debelina / 2), (a1, debelina / 2), (a0, debelina / 2))])
    me = bpy.data.meshes.new(ime)
    bm.to_mesh(me); bm.free()
    return predmet(ime, me, mat, zb, premik)


def napis_na_valju(ime, besedilo, r, z, mat, velikost=2.6, zb="prizor", premik=(0, 0, 0), kot=-math.pi / 2, zamik=0.0, plosko=False, poravnava="CENTER"):
    """Napis (privzeta pisava Blenderja), ovit okoli valja polmera r v višini z; plosko: raven napis v ravnini xz."""
    cu = bpy.data.curves.new(ime + "-k", "FONT")
    cu.body = besedilo; cu.size = velikost * MM; cu.align_x = poravnava; cu.align_y = "CENTER"
    tmp = bpy.data.objects.new(ime + "-k", cu)
    bpy.context.scene.collection.objects.link(tmp)
    dg = bpy.context.evaluated_depsgraph_get(); dg.update()
    me = bpy.data.meshes.new_from_object(tmp.evaluated_get(dg))
    bpy.data.objects.remove(tmp); bpy.data.curves.remove(cu)
    for v in me.vertices:
        x, y = v.co.x / MM + zamik, v.co.y / MM
        if plosko == "xy":     # napis leži na vodoravni ploskvi (bere se od spredaj zgoraj)
            v.co = (x * MM, y * MM, (z + 0.05) * MM)
        elif plosko:
            v.co = (x * MM, -(r + 0.03) * MM, (z + y) * MM)
        else:
            a = kot + x / r
            v.co = ((r + 0.03) * MM * math.cos(a), (r + 0.03) * MM * math.sin(a), (z + y) * MM)
    return predmet(ime, me, mat, zb, premik)


def _bireta_mere():
    b = BIRETA
    z0 = b["V"] * b["mm_ml"]
    zs = -b["pod"]; zp = zs - b["pipa"]
    return dict(z0=z0, zt=z0 + b["nad"], zs=zs, zp=zp, zk=zp - b["konica"], ro=b["do"] / 2, ri=b["di"] / 2)


def bireta_steklo(ime, gladina_ml=None, zb="prizor", premik=(0, 0, 0)):
    """Steklena cev birete 50 mL (ISO 385) s konico. premik = os cevi v višini oznake 50 mL (z = 0 pri oznaki 50).
    gladina_ml: odčitek (0 zgoraj) ali None (prazna). Vrne dict: steklo, gladina, tekocina (profila), mere."""
    b, m = BIRETA, _bireta_mere()
    ro, ri, zt, zp, zk, z0 = m["ro"], m["ri"], m["zt"], m["zp"], m["zk"], m["z0"]
    zunaj = [(0.9, zk), (1.6, zk + 0.3), (2.2, zk + 30), (ro, zp + 6), (ro, zt - 3), (ro + 0.9, zt - 1.2), (ro + 1.0, zt - 0.4), (ro + 0.5, zt)]
    znotraj = [(ri + 0.3, zt - 0.3), (ri, zt - 2.5), (ri, zp + 7), (1.2, zk + 30), (0.5, zk + 0.3), (0.5, zk)]
    mat_s, mat_m, mat_g = steklo(), steklo("meja", N_STEKLO / N_VODA), steklo("gladina", N_VODA)
    out = {"mere": dict(m)}
    if gladina_ml is None:
        out["steklo"] = vrtenina(ime, zunaj + znotraj + [(0.9, zk)], mat_s, 64, zb, premik)
        return out
    zg = z0 - gladina_ml * b["mm_ml"]
    men = meniskus(ri)
    zc = zg + men[-1][1]
    zgoraj = [p for p in znotraj if p[1] > zc] + [(ri, zc)]
    spodaj = [(ri, zc)] + [p for p in znotraj if p[1] < zc]
    profil = zunaj + zgoraj + spodaj[1:] + [(0.9, zk)]
    ind = [0] * (len(zunaj) + len(zgoraj) - 1) + [1] * (len(spodaj) - 1) + [0]
    out["steklo"] = vrtenina(ime, profil, [mat_s, mat_m], 64, zb, premik, indeksi=ind)
    top = [(r, zg + z) for r, z in reversed(men)]
    top[0] = (ri, zc)
    out["gladina"] = vrtenina(ime + "-gladina", top, mat_g, 64, zb, premik, kot=60)
    out["tekocina"] = (spodaj, top)
    out["mere"]["meniskus"] = men[-1][1]
    return out


def bireta_lestvica(ime, zb="prizor", premik=(0, 0, 0)):
    """Lestvica po ISO 385: vsak mL dolga črta, 0,5 mL srednja, 0,1 mL kratka; številke na vsak mL (0 zgoraj)."""
    b, m = BIRETA, _bireta_mere()
    tisk = snov("tisk-jantar", (0.55, 0.27, 0.012), 0.55)
    crte = []
    for i in range(0, 501):
        crte.append((m["z0"] - i / 10 * b["mm_ml"], 0.62 if i % 10 == 0 else (0.42 if i % 5 == 0 else 0.26)))
    oznake_valja(ime + "-crte", m["ro"], crte, tisk, zb, premik, debelina=b["crta"] * 0.85, sredina=-math.pi / 2 + 0.5)
    for v in range(0, 51):
        napis_na_valju(f"{ime}-st{v}", str(v), m["ro"], m["z0"] - v * b["mm_ml"] + 0.2, tisk, velikost=2.4 if v % 5 else 3.0, zb=zb, premik=premik, kot=-math.pi / 2 - 0.75)


def bireta_pipa(ime, zb="prizor", premik=(0, 0, 0)):
    """Pipa: steklen tulec s čepom iz PTFE (os proti kameri), matica zadaj. Ročica posebej (bireta_rocica)."""
    m = _bireta_mere()
    ptfe = snov("ptfe", (0.88, 0.89, 0.90), 0.38, sijaj=0.4)
    modra = snov("plastika-modra", (0.03, 0.14, 0.45), 0.35, zrnatost=0.1)
    zc = (m["zs"] + m["zp"]) / 2
    valj(ime + "-tulec", 6.3, 20, steklo(), zb, (premik[0], premik[1] - 10, premik[2] + zc), os="y")
    valj(ime + "-cep", 4.4, 30, ptfe, zb, (premik[0], premik[1] - 18, premik[2] + zc), os="y", posnetje=0.6)
    valj(ime + "-matica", 5.5, 5, modra, zb, (premik[0], premik[1] + 10, premik[2] + zc), os="y", posnetje=0.8)


def bireta_rocica(ime, odprta, zb="prizor", premik=(0, 0, 0)):
    """Ročica pipe: zaprta = prečno na cev, odprta = vzporedno s cevjo (os čepa gleda proti kameri)."""
    m = _bireta_mere()
    modra = snov("plastika-modra", (0.03, 0.14, 0.45), 0.35, zrnatost=0.1)
    zc = (m["zs"] + m["zp"]) / 2
    if odprta:
        return kvader(ime, 9, 5, 30, modra, zb, (premik[0], premik[1] - 21, premik[2] + zc - 15), posnetje=2.0)
    return kvader(ime, 30, 5, 9, modra, zb, (premik[0], premik[1] - 21, premik[2] + zc - 4.5), posnetje=2.0)


def pipeta(ime, zb="prizor", premik=(0, 0, 0)):
    """Polnilna pipeta 25 mL (ISO 648): premik = konica. Obročna oznaka na zgornjem steblu, modra barvna koda (ISO 1769)."""
    p = PIPETA
    rs, rb, t, L = p["steblo"] / 2, p["bucka"] / 2, p["stena"], p["dolzina"]
    zb1 = L - p["zgoraj"] - p["bucka_l"]   # dno bučke
    zb2 = L - p["zgoraj"]                  # vrh bučke
    def bucka(r_s, r_b, obrat=False):
        pts = [(r_s, zb1 - 2)]
        for k in range(1, 9):
            f = k / 8; pts.append((r_s + (r_b - r_s) * (0.5 - 0.5 * math.cos(math.pi * f)), zb1 + 16 * f))
        for k in range(1, 9):
            f = k / 8; pts.append((r_b - (r_b - r_s) * (0.5 - 0.5 * math.cos(math.pi * f)), zb2 - 16 + 16 * f))
        return pts[::-1] if obrat else pts
    zunaj = [(0.9, 0), (1.5, 0.3), (rs, 28)] + bucka(rs, rb) + [(rs, L - 1), (rs - 0.3, L)]
    znotraj = [(rs - t, L)] + bucka(rs - t, rb - t, True) + [(rs - t, 28), (0.5, 0.3), (0.5, 0)]
    o = vrtenina(ime, zunaj + znotraj + [(0.9, 0)], steklo(), 48, zb, premik)
    oznake_valja(ime + "-oznaka", rs, [(L - p["oznaka"], 1.0)], snov("tisk-jantar", (0.55, 0.27, 0.012), 0.55), zb, premik, debelina=0.35)
    oznake_valja(ime + "-koda", rs, [(L - 18, 1.0)], snov("tisk-moder", (0.02, 0.10, 0.55), 0.5), zb, premik, debelina=5.0)
    tisk = snov("tisk-jantar", (0.55, 0.27, 0.012), 0.55)
    napis_na_valju(ime + "-napis", "25", rb, (zb1 + zb2) / 2 + 8, tisk, velikost=7, zb=zb, premik=premik)
    napis_na_valju(ime + "-napis2", "mL  A  ±0,03", rb, (zb1 + zb2) / 2 - 2, tisk, velikost=2.6, zb=zb, premik=premik)
    return o


def upornik(ime, ohm, moc=0.5, zb="prizor", premik=(0, 0, 0), zgorel=False, os="x", razmik=None):
    """Upornik z žicama, os vzdolž x, središče v premik. Obročki po IEC 60062; zgorel: zoglenela prevleka."""
    u = UPORNIK[moc]
    L, R, rz = u["l"], u["d"] / 2, u["zica"] / 2
    telo = snov("upor-telo-zgorel", (0.03, 0.025, 0.02), 0.85, zrnatost=0.6, merilo=3000) if zgorel else snov("upor-telo", (0.72, 0.58, 0.38), 0.32, lak=0.4)
    # telo »pasje kosti«: kapici širši od sredine
    pr = [(0, -L / 2), (R * 0.75, -L / 2), (R, -L / 2 + 0.5), (R, -L / 2 + 1.9), (R * 0.9, -L / 2 + 2.6), (R * 0.9, L / 2 - 2.6), (R, L / 2 - 1.9), (R, L / 2 - 0.5), (R * 0.75, L / 2), (0, L / 2)]
    deli = []
    t = vrtenina(ime, pr, telo, 32, zb, premik, kot=60); t.rotation_euler = (0, math.radians(90), 0); deli.append(t)
    if not zgorel:
        koda = barvna_koda(ohm)
        mesta = [-L / 2 + 1.2, -L / 2 + 3.0, -L / 2 + 4.4, L / 2 - 1.2]
        for i, (k, zc) in enumerate(zip(koda, mesta)):
            barva = ZLATA if k == "zlata" else BARVE_KODE[k]
            m = snov(f"obroc-{k}", barva, 0.3 if k != "zlata" else 0.25, kovina=0.8 if k == "zlata" else 0.0, lak=0.3)
            rr = (R if (i == 0 or i == 3) else R * 0.9) + 0.03
            o = vrtenina(f"{ime}-o{i}", [(rr, zc - 0.5), (rr, zc + 0.5)], m, 32, zb, premik); o.rotation_euler = (0, math.radians(90), 0); deli.append(o)
    raz = razmik or (L + 16)
    zica = kovina("kositer", (0.78, 0.78, 0.76), 0.22)
    for s in (-1, 1):
        deli.append(cev(f"{ime}-z{s}", [(premik[0] + s * L / 2 * 0.98, premik[1], premik[2]), (premik[0] + s * raz / 2, premik[1], premik[2])], rz, zica, zb, gladke=False))
    return deli


# ---------------------------------------------------------------- les z luknjami, naprave
def deska_z_luknjami(ime, sx, sy, sz, luknje, r, mat, zb="prizor", premik=(0, 0, 0)):
    """Deska (sx × sy × sz) z navpičnimi luknjami polmera r v točkah luknje [(x, y)] (krajevno); boolova razlika."""
    o = kvader(ime, sx, sy, sz, mat, zb, premik, posnetje=1.0)
    rez = []
    for i, (x, y) in enumerate(luknje):
        c = valj(f"{ime}-rez{i}", r, sz + 4, mat, zb, (premik[0] + x, premik[1] + y, premik[2] - 2), n=40)
        m = o.modifiers.new(f"l{i}", "BOOLEAN"); m.operation = "DIFFERENCE"; m.object = c
        rez.append(c)
    dg = bpy.context.evaluated_depsgraph_get(); dg.update()
    me = bpy.data.meshes.new_from_object(o.evaluated_get(dg))
    o.modifiers.clear()
    star = o.data; o.data = me; bpy.data.meshes.remove(star)
    for c in rez:
        bpy.data.objects.remove(c)
    gladko(me, 35)
    return o


def vticnica(ime, barva, zb, premik, smer="z"):
    """4-mm varnostna vtičnica: barvni obroč Ø 11 mm in temna luknja."""
    m = snov(f"vticnica-{ime.split('-')[-1]}-{barva}", {"rdeca": (0.62, 0.02, 0.02), "crna": (0.02, 0.02, 0.022), "modra": (0.03, 0.12, 0.5)}[barva], 0.35)
    valj(ime, 5.5, 4, m, zb, premik, os=smer, posnetje=0.8, n=32)
    lukn = snov("luknja", (0.004, 0.004, 0.004), 0.9)
    d = {"z": (0, 0, 4.02), "y": (0, 4.02, 0)}[smer] if smer == "z" else (0, -0.02, 0)
    if smer == "z":
        valj(ime + "-l", 2.3, 0.1, lukn, zb, (premik[0], premik[1], premik[2] + 4.0), os="z", n=24)
    else:   # vtičnica na sprednji plošči gleda proti −y
        valj(ime + "-l", 2.3, 0.1, lukn, zb, (premik[0], premik[1] - 0.1, premik[2]), os="y", n=24)


def multimeter(ime, zb, cx, cy, znak="A", kot_gumba=0.0):
    """Šolski digitalni multimeter 3½ mesta (75 × 150 × 38 mm) leži na pultu, vtičnice 10 A, mA, COM, VΩ spodaj.
    Vrne dict: lcd (vogali okna: levo zgoraj, desno zgoraj, levo spodaj), vticnice, gumb (središče)."""
    ohisje = snov("dmm-ohisje", (0.045, 0.05, 0.055), 0.45, zrnatost=0.3, merilo=1200)
    ovoj = snov("dmm-ovoj-" + znak, (0.85, 0.42, 0.02) if znak == "A" else (0.80, 0.62, 0.03), 0.6, zrnatost=0.35, merilo=900)
    kvader(ime + "-ovoj", 82, 158, 34, ovoj, zb, (cx, cy, 0), posnetje=7, seg=5)
    kvader(ime, 72, 148, 38, ohisje, zb, (cx, cy, 0), posnetje=4, seg=4)
    # LCD: okno 52 × 24 mm
    lz = 38.0
    kvader(ime + "-okno", 56, 28, 0.6, snov("dmm-okvir", (0.01, 0.01, 0.012), 0.2), zb, (cx, cy + 50, lz), posnetje=0.2)
    kvader(ime + "-lcd", 52, 24, 0.3, snov("lcd", (0.52, 0.57, 0.50), 0.25, lak=0.5), zb, (cx, cy + 50, lz + 0.6))
    lcd = [(cx - 26, cy + 62, lz + 0.95), (cx + 26, cy + 62, lz + 0.95), (cx - 26, cy + 38, lz + 0.95)]
    # vrtljivi gumb Ø 40 s kazalcem
    valj(ime + "-skala", 23, 0.4, snov("dmm-skala", (0.10, 0.11, 0.12), 0.5), zb, (cx, cy + 2, lz), n=64)
    tisk = snov("tisk-bel", (0.9, 0.9, 0.88), 0.5)
    napis_na_valju(ime + "-V", "V", 0, lz + 0.4, tisk, velikost=5, zb=zb, premik=(cx - 26, cy + 20, 0), plosko="xy")
    napis_na_valju(ime + "-A", "A", 0, lz + 0.4, tisk, velikost=5, zb=zb, premik=(cx + 27, cy + 2, 0), plosko="xy")
    napis_na_valju(ime + "-O", "Ω", 0, lz + 0.4, tisk, velikost=5, zb=zb, premik=(cx - 27, cy - 14, 0), plosko="xy")
    vt = {}
    for k, (n, b) in enumerate((("10A", "rdeca"), ("mA", "rdeca"), ("COM", "crna"), ("V", "rdeca"))):
        x = cx - 24 + 16 * k
        vticnica(f"{ime}-vt-{n}", b, zb, (x, cy - 58, lz - 3))
        napis_na_valju(f"{ime}-n-{n}", {"V": "VΩ"}.get(n, n), 0, lz + 0.4, tisk, velikost=3.2, zb=zb, premik=(x, cy - 47, 0), plosko="xy")
        vt[n] = (x, cy - 58, lz + 1.0)
    return dict(lcd=lcd, vticnice=vt, gumb=(cx, cy + 2, lz))


def gumb_multimetra(ime, zb, sredisce, kot):
    """Gumb multimetra s kazalcem; kot v stopinjah od smeri »gor« (proti zaslonu), v smeri urinega kazalca."""
    cx, cy, z = sredisce
    g = valj(ime, 17, 9, snov("dmm-gumb", (0.03, 0.03, 0.033), 0.4, zrnatost=0.3, merilo=1500), zb, (cx, cy, z), posnetje=2.0, n=64)
    k = kvader(ime + "-k", 3, 20, 2.2, snov("tisk-bel", (0.9, 0.9, 0.88), 0.5), zb, (0, 0, 0), posnetje=0.5)
    a = math.radians(-kot)
    k.location = ((cx - 8 * math.sin(a)) * MM, (cy + 8 * math.cos(a)) * MM, (z + 8.6) * MM)
    k.rotation_euler = (0, 0, a)
    return [g, k]


def napajalnik(ime, zb, cx, cy):
    """Šolski napajalnik 0–12 V / 1 A (170 × 140 × 80 mm): zaslon, gumb, rdeča (+) in črna (−) vtičnica spredaj."""
    kvader(ime, 170, 140, 80, snov("psu-ohisje", (0.72, 0.74, 0.76), 0.5, zrnatost=0.25, merilo=700), zb, (cx, cy, 4), posnetje=3)
    for sx in (-1, 1):
        for sy in (-1, 1):
            valj(f"{ime}-noga{sx}{sy}", 7, 4, snov("guma", (0.025, 0.025, 0.028), 0.75), zb, (cx + sx * 70, cy + sy * 55, 0))
    for k in range(9):   # prezračevalne reže na pokrovu
        kvader(f"{ime}-reza{k}", 60, 3, 0.4, snov("luknja", (0.004, 0.004, 0.004), 0.9), zb, (cx + 35, cy + 50 - k * 9, 83.8))
    fy = cy - 70
    kvader(ime + "-plosca", 164, 1.2, 72, snov("psu-plosca", (0.10, 0.11, 0.13), 0.42, zrnatost=0.15), zb, (cx, fy - 0.6, 8), posnetje=0.3)
    kvader(ime + "-zaslon", 62, 0.8, 24, snov("psu-zaslon", (0.015, 0.02, 0.02), 0.08, lak=0.6), zb, (cx - 40, fy - 1.4, 48), posnetje=0.2)
    zas = [(cx - 71, fy - 1.9, 72), (cx - 9, fy - 1.9, 72), (cx - 71, fy - 1.9, 48)]
    g = valj(ime + "-gumb", 12, 14, snov("dmm-gumb", (0.03, 0.03, 0.033), 0.4), zb, (cx + 30, fy - 15, 58), os="y", posnetje=2, n=48)
    tisk = snov("tisk-bel", (0.9, 0.9, 0.88), 0.5)
    napis_na_valju(ime + "-n1", "0–12 V   1 A", 0, 40, tisk, velikost=5.5, zb=zb, premik=(cx - 40, fy - 1.3, 0), plosko=True, kot=0)
    napis_na_valju(ime + "-n2", "U", 0, 40, tisk, velikost=5.5, zb=zb, premik=(cx + 30, fy - 1.3, 0), plosko=True)
    napis_na_valju(ime + "-n3", "+", 0, 33, tisk, velikost=8, zb=zb, premik=(cx + 60, fy - 1.3, 0), plosko=True)
    napis_na_valju(ime + "-n4", "−", 0, 33, tisk, velikost=8, zb=zb, premik=(cx + 20, fy - 1.3, 0), plosko=True)
    vticnica(ime + "-vt-plus", "rdeca", zb, (cx + 60, fy - 5, 20), smer="y")
    vticnica(ime + "-vt-minus", "crna", zb, (cx + 20, fy - 5, 20), smer="y")
    valj(ime + "-led", 2.2, 1.5, snov("led-ugasnjen", (0.25, 0.03, 0.03), 0.25, prosojnost=0.3), zb, (cx - 2, fy - 2.6, 60), os="y", n=20)
    return dict(zaslon=zas, plus=(cx + 60, fy - 5, 20), minus=(cx + 20, fy - 5, 20), led=(cx - 2, fy - 3, 60))


def vodnik(ime, a, b, barva, zb, smer_a="z", smer_b="z", lok=0.0, visina=1.0):
    """Laboratorijski vodnik z banana vtičema 4 mm med vtičnicama a in b (mm). Vtič: tulec Ø 9 × 32 mm; kabel Ø 3,9 mm
    pade na pult in teče v rahlem loku (lok = prečni odmik sredine v mm)."""
    m = snov("vodnik-" + barva, {"rdeca": (0.60, 0.015, 0.015), "crna": (0.018, 0.018, 0.02), "modra": (0.02, 0.10, 0.5)}[barva], 0.42, zrnatost=0.15, merilo=600)
    def vtic(i, p, smer):
        if smer == "z":
            valj(f"{ime}-v{i}", 4.5, 32, m, zb, (p[0], p[1], p[2]), os="z", posnetje=1.2, n=24)
            return [(p[0], p[1], p[2] + 31), (p[0], p[1], p[2] + 52)]
        valj(f"{ime}-v{i}", 4.5, 32, m, zb, (p[0], p[1] - 32, p[2]), os="y", posnetje=1.2, n=24)
        return [(p[0], p[1] - 31, p[2]), (p[0], p[1] - 55, p[2])]
    pa, pb = vtic(0, a, smer_a), vtic(1, b, smer_b)
    ax, ay = pa[-1][0], pa[-1][1]; bx, by = pb[-1][0], pb[-1][1]
    dx, dy = bx - ax, by - ay
    d = math.hypot(dx, dy) or 1.0
    nx, ny = -dy / d, dx / d
    def tla(t, odm):
        return (ax + dx * t + nx * odm, ay + dy * t + ny * odm, 2.0 + visina)
    def spust(p, smer, t):
        q = tla(t, lok * 0.5)
        if smer == "z":   # iz navpičnega vtiča: lok navzven in dol
            return [((p[0] * 2 + q[0]) / 3, (p[1] * 2 + q[1]) / 3 - 14, p[2] + 6), ((p[0] + q[0] * 2) / 3, (p[1] + q[1] * 2) / 3 - 10, max(8.0, p[2] * 0.4)), q]
        return [(p[0], p[1] - 16, p[2] - 6), ((p[0] + q[0]) / 2, min(p[1] - 24, (p[1] + q[1]) / 2), 6.0), q]
    tocke = pa + spust(pa[-1], smer_a, 0.22) + [tla(0.5, lok)] + list(reversed(spust(pb[-1], smer_b, 0.78))) + list(reversed(pb))
    cev(ime, tocke, 1.95, m, zb)

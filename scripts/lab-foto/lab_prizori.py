# Fotorealistični laboratorij: prizori treh poskusov (titracija, dokazne reakcije, električni krog), kamere in sloji.
# Vsak prizor vrne { pogledi, sloji, meta }. Sloj = en izris (lab_izris.py): katere zbirke so vidne, kateri pogled,
# izrez in vrsta (slika: neprozorna; prosojno: predmet + senca na prozornem; debelina: exp(−L/Lref) tekočine).
# Kamera je ortografska (stalno merilo px/mm kot risba v public/sim/), zato so sidra (meta.sidra) točne linearne
# preslikave: gladino in odčitke aplikacija še vedno računa iz modela in jih položi na sliko.
import math
import bpy
import bmesh
from lab_modeli import *  # noqa: F401,F403
import lab_modeli as M

# ---------------------------------------------------------------- pogled (ortografska kamera)
class Pogled:
    """Okno risbe W × H enot SVG. Točka sveta `tocka` (mm) pade na `na` (enote okna); px_mm = navpično merilo
    (enot na mm višine pri stalni globini); visina = dvig kamere nad vodoravnico [°]."""

    def __init__(self, ime, W, H, px_mm, tocka, na, visina=6.0):
        self.ime, self.W, self.H, self.e = ime, W, H, math.radians(visina)
        self.s = px_mm / math.cos(self.e) if visina < 45 else px_mm   # strm pogled: px_mm velja vodoravno
        u, v = self._uv(tocka)
        self.uc = u - (na[0] - W / 2) / self.s
        self.vc = v + (na[1] - H / 2) / self.s

    def _uv(self, p):
        return p[0], p[1] * math.sin(self.e) + p[2] * math.cos(self.e)

    def projekcija(self, p):
        u, v = self._uv(p)
        return [round(self.W / 2 + self.s * (u - self.uc), 3), round(self.H / 2 - self.s * (v - self.vc), 3)]

    def kamera(self, scene):
        cam = bpy.data.cameras.new(self.ime)
        cam.type = "ORTHO"; cam.ortho_scale = max(self.W, self.H) / self.s * MM
        cam.clip_start = 0.05; cam.clip_end = 20
        o = bpy.data.objects.new("kamera-" + self.ime, cam)
        scene.collection.objects.link(o)
        e, D = self.e, 4000.0
        gor = (0, math.sin(e), math.cos(e)); smer = (0, math.cos(e), -math.sin(e))
        o.location = [(self.uc * (1 if i == 0 else 0) + gor[i] * self.vc - smer[i] * D) * MM for i in range(3)]
        o.rotation_euler = (math.pi / 2 - e, 0, 0)
        self.predmet = o
        return o


# ---------------------------------------------------------------- studio
def studio(sirina=1800, globina=(-420, 300), stena=True, kljuc=1.0):
    import os
    kljuc *= float(os.environ.get("LAB_MOC", "1"))
    """Laboratorijski pult (z = 0), stena s ploščicami zadaj, mehka studijska svetloba: ključna luč levo spredaj,
    polnilna desno, stropna plošča. Vse v zbirki »studio«."""
    zb = "studio"
    y0, y1 = globina
    kvader("pult", sirina, y1 - y0, 30, miza(), "pult", (0, (y0 + y1) / 2, -30), posnetje=1.5)
    if stena:
        m, nt, out = M._mat("stena")
        p = nt.nodes.new("ShaderNodeBsdfPrincipled")
        tc = nt.nodes.new("ShaderNodeTexCoord"); mp = nt.nodes.new("ShaderNodeMapping")
        br = nt.nodes.new("ShaderNodeTexBrick")
        br.offset = 0.0; br.squash = 1.0
        M._nastavi(br, Color1=(0.86, 0.87, 0.86, 1), Color2=(0.84, 0.855, 0.85, 1), Mortar=(0.55, 0.56, 0.56, 1), Scale=1.0,
                   **{"Mortar Size": 0.0012, "Mortar Smooth": 0.3, "Brick Width": 0.15, "Row Height": 0.15})
        nt.links.new(tc.outputs["Object"], mp.inputs["Vector"]); nt.links.new(mp.outputs[0], br.inputs["Vector"])
        nt.links.new(br.outputs["Color"], p.inputs["Base Color"])
        bu = nt.nodes.new("ShaderNodeBump"); bu.inputs["Strength"].default_value = 0.6; bu.inputs["Distance"].default_value = 0.0006; bu.invert = True
        nt.links.new(br.outputs["Fac"], bu.inputs["Height"]); nt.links.new(bu.outputs[0], p.inputs["Normal"])
        M._nastavi(p, Roughness=0.16)
        nt.links.new(p.outputs[0], out.inputs["Surface"])
        mp.inputs["Rotation"].default_value = (math.pi / 2, 0, 0)   # ploščice v ravnini xz stene
        mp.inputs["Location"].default_value = (0.075, 0, 0)         # fuge pri x = ±75 mm …, ne za bireto
        kvader("stena", sirina, 20, 1600, m, "pult", (0, y1 + 10, -30))
    def luc(ime, velikost, kje, cilj, moc, barva=(1, 1, 1)):
        l = bpy.data.lights.new(ime, "AREA")
        l.shape = "RECTANGLE"; l.size = velikost[0] * MM; l.size_y = velikost[1] * MM
        l.energy = moc; l.color = barva
        o = bpy.data.objects.new(ime, l)
        zbirka(zb).objects.link(o)
        o.location = [v * MM for v in kje]
        import mathutils
        d = mathutils.Vector(cilj) - mathutils.Vector(kje)
        o.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
        return o
    k = [float(v) for v in os.environ.get("LAB_LUCI", "18,2,2.5,0.12").split(",")]
    luc("kljucna", (700, 1000), (-900, -1100, 950), (0, 0, 250), k[0] * kljuc, (1.0, 0.98, 0.95))
    luc("polnilna", (350, 1100), (950, -700, 700), (0, 0, 300), k[1] * kljuc, (0.95, 0.97, 1.0))
    luc("stropna", (1400, 700), (0, -250, 1700), (0, 0, 0), k[2] * kljuc)
    w = bpy.data.worlds.new("svet"); bpy.context.scene.world = w
    w.use_nodes = True
    bg = w.node_tree.nodes.get("Background")
    bg.inputs[0].default_value = (0.78, 0.80, 0.84, 1); bg.inputs[1].default_value = k[3]


def material_debeline(lref_mm):
    """Sloj debeline: prozorna površina + čista absorpcija; slika = exp(−L / Lref) (Beer–Lambert)."""
    ime = f"debelina-{lref_mm:g}"
    m = bpy.data.materials.get(ime)
    if m:
        return m
    m, nt, out = M._mat(ime)
    t = nt.nodes.new("ShaderNodeBsdfTransparent")
    v = nt.nodes.new("ShaderNodeVolumeAbsorption")
    v.inputs["Color"].default_value = (0, 0, 0, 1); v.inputs["Density"].default_value = 1.0 / (lref_mm * MM)
    nt.links.new(t.outputs[0], out.inputs["Surface"]); nt.links.new(v.outputs[0], out.inputs["Volume"])
    return m


def telo(ime, tekocina, lref, zb, premik, n=64):
    """Zaprto telo tekočine za sloj debeline: od osi na dnu po steni navzgor do stika in po gladini nazaj do osi
    (normale navzven: Cycles po usmerjenosti ploskev določi, kje je žarek v snovi)."""
    spodaj, top = tekocina
    return vrtenina(ime, list(reversed(spodaj)) + list(top)[1:], material_debeline(lref), n, zb, premik)


def prostornina(profil_znotraj, do_z, korak=0.25):
    """Tabela [(h nad notranjim dnom, V mL)] iz notranjega profila [(r, z)] (z narašča) z numerično integracijo."""
    pts = sorted(profil_znotraj, key=lambda p: p[1])
    z0 = pts[0][1]
    def r_pri(z):
        for (r1, z1), (r2, z2) in zip(pts, pts[1:]):
            if z1 <= z <= z2:
                return r1 if z2 == z1 else r1 + (r2 - r1) * (z - z1) / (z2 - z1)
        return pts[-1][0]
    out, V, z = [(0.0, 0.0)], 0.0, z0
    while z < do_z:
        V += math.pi * r_pri(z + korak / 2) ** 2 * korak / 1000.0
        z += korak
        out.append((round(z - z0, 2), round(V, 3)))
    return out


# ================================================================ TITRACIJA
def titracija():
    """Bireta 50 mL na stojalu nad erlenmajerico 100 mL na beli ploščici, pipeta 25 mL v stojalu, pH-elektroda.
    Okna kot v lab-titracija.js: celota (200 × 566, 0,6 px/mm), menisk (188 × 236, 9 px/mm, v višini oči),
    blizu (188 × 254, 1,6 px/mm)."""
    studio()
    FL = ERLENMAJERICE[100]
    KARTA_POD = 1.0                     # črni pas kartice za odčitavanje se začne 1 mm pod meniskom
    Z_PL = 12.0                         # podstavek stojala 6 mm + bela ploščica 6 mm
    BX = -7.0                           # os birete: konica 7 mm levo od osi bučke (ob njej je prostor za elektrodo)
    Z50 = Z_PL + FL["h"] - 15 + BIRETA["konica"] + BIRETA["pipa"] + BIRETA["pod"]   # konica 15 mm pod robom vratu
    bp = (BX, 0, Z50)
    mb = M._bireta_mere()
    # ---- stalno: stojalo, objemki, ploščica, pipeta s stojalom
    zb = "stalno"
    lito = snov("podstavek-lak", (0.42, 0.46, 0.45), 0.45, zrnatost=0.45, merilo=900)   # sivo lakirano jeklo
    jeklo = kovina("jeklo", krtaceno=0.25)
    alu = kovina("aluminij", (0.78, 0.79, 0.80), 0.36)
    kvader("podstavek", 250, 160, 6, lito, zb, (-38, 20, 0), posnetje=1.2)
    valj("palica", 5, 840, jeklo, zb, (-142, 0, 6), posnetje=1.0)
    for i, zc in enumerate((Z50 + mb["z0"] + 45, Z50 + 2.5 * BIRETA["mm_ml"])):
        kvader(f"mufa{i}", 24, 24, 30, alu, zb, (-142, 0, zc - 15), posnetje=2.5)
        valj(f"vijak{i}", 4, 16, jeklo, zb, (-142, -12, zc), os="y"); 
        valj(f"krilo{i}", 8, 4, snov("plastika-crna", (0.02, 0.02, 0.022), 0.4, zrnatost=0.2), zb, (-142, -30, zc), os="y", posnetje=1)
        valj(f"rocaj{i}", 4.5, 142 + BX - 22, jeklo, zb, (-130, 0, zc), os="x")
        guma = snov("guma", (0.025, 0.025, 0.028), 0.75, zrnatost=0.4, merilo=1500)
        vrtenina(f"celjust{i}", [(6.7, -7), (11, -7), (11.6, -6), (11.6, 6), (11, 7), (6.7, 7), (6.7, -7)], guma, 48, zb, (BX, 0, zc), kot=50)
        kvader(f"vez{i}", 16, 12, 12, alu, zb, (BX - 17, 0, zc - 6), posnetje=1.5)
    kvader("ploscica", 120, 120, 6, snov("keramika", (0.92, 0.92, 0.90), 0.08, lak=0.6), zb, (0, 0, 6), posnetje=0.8)
    # pipeta v stojalu: spodnja zožitev bučke sedi v luknji plošče, konica 10 mm nad pultom
    PX = 105.0
    pvc = snov("plastika-siva", (0.55, 0.57, 0.60), 0.4, zrnatost=0.15)
    valj("pip-noga", 48, 8, pvc, zb, (PX, 35, 0), posnetje=1.5)
    valj("pip-steber", 5, 300, jeklo, zb, (PX + 27, 62, 8))
    kvader("pip-plosca", 70, 78, 6, pvc, zb, (PX, 30, 151), posnetje=1.2)
    pipeta("pipeta", zb, (PX, 0, 10))
    # ---- bireta
    bireta_lestvica("bireta", "bireta-lestvica", bp)
    bireta_pipa("bireta", "bireta-oprema", bp)
    bireta_rocica("rocica-zaprta", False, "rocica-zaprta", bp)
    bireta_rocica("rocica-odprta", True, "rocica-odprta", bp)
    bireta_steklo("bireta-prazna", None, "bireta-prazna", bp)
    polna = bireta_steklo("bireta-polna", -1.2, "bireta-polna", bp)
    men = bireta_steklo("bireta-menisk", 25.0, "bireta-menisk", bp)
    # kartica za odčitavanje za bireto: bela s črnim pasom, zgornji rob črnega ~1 mm pod meniskom (menisk se v njej
    # zrcali s popolnim odbojem in je videti kot črn srp z ostrim spodnjim robom; Harris, Quantitative Chemical Analysis)
    zm = Z50 + 25 * BIRETA["mm_ml"]
    kvader("karta-bela", 90, 0.5, 60, snov("karton-bel", (0.9, 0.9, 0.88), 0.7), "karta", (BX, 16, zm - KARTA_POD))
    kvader("karta-crna", 90, 0.5, 60, snov("karton-crn", (0.012, 0.012, 0.012), 0.75), "karta", (BX, 16, zm - KARTA_POD - 60))
    # ---- erlenmajerica: prazna in polna (gladina pri 86 mL nazivno), elektroda
    V_POLNA = 60.0   # mm nad notranjim dnom
    erlenmajerica("bucka-prazna", 100, None, "bucka-prazna", (0, 0, Z_PL))
    _, _, tek, dno = erlenmajerica("bucka-polna", 100, V_POLNA, "bucka-polna", (0, 0, Z_PL))
    LREF = 40.0
    telo("bucka-telo", tek, LREF, "debelina-bucka", (0, 0, Z_PL))
    # približne oznake prostornine iz belega emajla (50, 75 mL; ISO 1773 ±5 %) in polje za napis
    R_, rv_, t_, Hc_ = FL["d"] / 2, FL["vrat"] / 2, FL["stena"], FL["stozec"]
    prof = [(R_ - t_ - 5, 0)] + [(R_ - t_ - 5 + 4.7 * math.cos(-math.pi / 2 + k * math.pi / 12), 5 + 4.7 * math.sin(-math.pi / 2 + k * math.pi / 12)) for k in range(1, 7)]
    prof += [(max(rv_ - t_, (R_ - (R_ - rv_) * h / Hc_) - t_), h) for h in range(6, 104)]
    VH = prostornina(prof, 100.0, 0.5)
    emajl = snov("tisk-bel", (0.9, 0.9, 0.88), 0.5)
    rz = lambda z: R_ - (R_ - rv_) * z / Hc_
    for V in (50, 75):
        hh = next(h for h, v in VH if v >= V) + dno
        for zb_ in ("bucka-prazna", "bucka-polna"):
            oznake_vrtenine(f"bucka-crta{V}{zb_}", [(hh, rz(hh), 9.0)], emajl, zb_, (0, 0, Z_PL), sredina=-math.pi / 2 - 0.55)
            napis_na_valju(f"bucka-st{V}{zb_}", str(V), rz(hh), hh + 0.4, emajl, velikost=3.4, zb=zb_, premik=(0, 0, Z_PL), kot=-math.pi / 2 - 0.55 + 9.5 / rz(hh))
    for zb_ in ("bucka-prazna", "bucka-polna"):
        napis_na_valju(f"bucka-napis{zb_}", "100 mL", rz(46), 46, emajl, velikost=4.2, zb=zb_, premik=(0, 0, Z_PL), kot=-math.pi / 2 + 0.25)
        oznake_vrtenine(f"bucka-polje{zb_}", [(36 + i * 0.35, rz(36 + i * 0.35), 16.0) for i in range(0, 18)], snov("emajl-polje", (0.88, 0.88, 0.86), 0.65), zb_, (0, 0, Z_PL), sredina=-math.pi / 2 + 0.25)
    # pH-elektroda Ø 12 mm, steklena bučka 4 mm nad dnom, kabel
    EX = 3.4
    crna = snov("plastika-crna", (0.02, 0.02, 0.022), 0.4, zrnatost=0.2)
    ez = Z_PL + dno + 4
    vrtenina("el-bucka", [(0, ez), (3.5, ez + 0.8), (5, ez + 4), (4.2, ez + 8), (4.2, ez + 12)], steklo(), 32, "elektroda", (EX, 0, 0))
    valj("el-telo", 6, 150, snov("epoksi", (0.16, 0.22, 0.33), 0.22, lak=0.4), "elektroda", (EX, 0, ez + 11), posnetje=0.8)
    oznake_valja("el-pas", 6, [(ez + 120, 1.0)], snov("tisk-bel", (0.9, 0.9, 0.88), 0.5), "elektroda", (EX, 0, 0), debelina=14)
    valj("el-kapa", 7.5, 22, crna, "elektroda", (EX, 0, ez + 161), posnetje=1.5)
    cev("el-kabel", [(EX, 0, ez + 183), (EX, 0, ez + 230), (EX + 30, 10, ez + 290), (EX + 110, 60, ez + 250), (EX + 190, 120, 120), (EX + 230, 150, 4)], 2.2, crna, "elektroda")
    # ---- pogledi
    A = Pogled("celota", 200, 566, 0.6, (0, 0, 0), (112, 548))
    B = Pogled("blizu", 188, 254, 1.6, (0, 0, Z_PL), (78, 228))
    C = Pogled("menisk", 188, 236, 9.0, (BX, 0, Z50 + 25 * BIRETA["mm_ml"]), (119.5, 118), visina=0.0)
    osn = ["studio", "pult", "stalno", "bireta-lestvica", "bireta-oprema"]
    def okvir(P, x0, z0, x1, z1, rob=3):   # izrez v enotah okna iz mm
        a, b = P.projekcija((x0, 0, z1)), P.projekcija((x1, 0, z0))
        return (max(0, math.floor(a[0] - rob)), max(0, math.floor(a[1] - rob)), min(P.W, math.ceil(b[0] + rob)), min(P.H, math.ceil(b[1] + rob)))
    ok_bir = okvir(A, BX - 9, Z50 + mb["zk"] - 2, BX + 9, Z50 + mb["zt"] + 2)
    ok_roc = okvir(A, BX - 20, Z50 + mb["zp"] - 10, BX + 20, Z50 + mb["zs"] + 10)
    ok_buc = okvir(A, -36, Z_PL - 2, 36, Z_PL + FL["h"] + 3)
    ok_el = okvir(A, -36, 0, 147, Z_PL + 330)
    okB = okvir(B, -36, Z_PL - 1, 36, Z_PL + FL["h"] + 2)
    sloji = [
        dict(ime="celota", pogled=A, vidno=osn + ["bireta-prazna", "rocica-zaprta", "bucka-prazna"]),
        dict(ime="celota-bireta-polna", pogled=A, vidno=osn + ["bireta-polna", "rocica-zaprta", "bucka-prazna"], izrez=ok_bir),
        dict(ime="celota-pipa-odprta", pogled=A, vidno=osn + ["bireta-prazna", "rocica-odprta", "bucka-prazna"], izrez=ok_roc),
        dict(ime="celota-pipa-odprta-polna", pogled=A, vidno=osn + ["bireta-polna", "rocica-odprta", "bucka-prazna"], izrez=ok_roc),
        dict(ime="celota-bucka-polna", pogled=A, vidno=osn + ["bireta-polna", "rocica-zaprta", "bucka-polna"], izrez=ok_buc),
        dict(ime="celota-bucka-debelina", pogled=A, vidno=["debelina-bucka"], vrsta="debelina", izrez=ok_buc),
        dict(ime="celota-el", pogled=A, vidno=osn + ["bireta-polna", "rocica-zaprta", "bucka-prazna", "elektroda"], izrez=ok_el),
        dict(ime="celota-el-polna", pogled=A, vidno=osn + ["bireta-polna", "rocica-zaprta", "bucka-polna", "elektroda"], izrez=ok_buc),
        dict(ime="blizu", pogled=B, vidno=osn + ["bireta-polna", "rocica-zaprta", "bucka-prazna"]),
        dict(ime="blizu-polna", pogled=B, vidno=osn + ["bireta-polna", "rocica-zaprta", "bucka-polna"], izrez=okB),
        dict(ime="blizu-debelina", pogled=B, vidno=["debelina-bucka"], vrsta="debelina", izrez=okB),
        dict(ime="blizu-el", pogled=B, vidno=osn + ["bireta-polna", "rocica-zaprta", "bucka-prazna", "elektroda"]),
        dict(ime="blizu-el-polna", pogled=B, vidno=osn + ["bireta-polna", "rocica-zaprta", "bucka-polna", "elektroda"], izrez=okB),
        dict(ime="menisk-prazna", pogled=C, vidno=["studio", "pult", "bireta-prazna", "karta"]),
        dict(ime="menisk", pogled=C, vidno=["studio", "pult", "bireta-menisk", "karta"]),
    ]
    R, rv, t, Hc = R_, rv_, t_, Hc_
    meta = dict(
        poskus="titracija",
        sidra={
            "celota": dict(bireta0=A.projekcija((BX, 0, Z50 + mb["z0"])), bireta50=A.projekcija((BX, 0, Z50)), konica=A.projekcija((BX, 0, Z50 + mb["zk"])),
                           pipaVrh=A.projekcija((BX, 0, Z50 + mb["zs"])), buckaDno=A.projekcija((0, 0, Z_PL + dno)), buckaVrh=A.projekcija((0, 0, Z_PL + FL["h"])),
                           pult=A.projekcija((0, 0, 0)), pipeta=A.projekcija((PX, 0, 460)), merilo100=[A.projekcija((-100, 0, 0))[0], A.projekcija((0, 0, 0))[0]]),
            "blizu": dict(buckaDno=B.projekcija((0, 0, Z_PL + dno)), buckaVrh=B.projekcija((0, 0, Z_PL + FL["h"])), konica=B.projekcija((BX, 0, Z50 + mb["zk"])),
                          ploscica=B.projekcija((0, 0, Z_PL)), elektroda=B.projekcija((EX, 0, Z_PL + FL["h"] + 30))),
            "menisk": dict(gladina=C.projekcija((BX, 0, Z50 + 25 * BIRETA["mm_ml"])), levo=C.projekcija((BX - mb["ri"], 0, 0))[0], desno=C.projekcija((BX + mb["ri"], 0, 0))[0],
                           levoZunaj=C.projekcija((BX - mb["ro"], 0, 0))[0], desnoZunaj=C.projekcija((BX + mb["ro"], 0, 0))[0]),
        },
        merila=dict(celota=0.6, blizu=1.6, menisk=9.0, visinaKamere=dict(celota=6, blizu=6, menisk=0)),
        bireta=dict(mmNaML=BIRETA["mm_ml"], polnaDo=-1.2, meniskMm=round(men["mere"]["meniskus"], 3), notranji=BIRETA["di"], zunanji=BIRETA["do"]),
        bucka=dict(polnaMm=V_POLNA, lref=LREF, dno=dno, visina=FL["h"], VodH=VH, nagib=round(math.degrees(math.atan((R - rv) / Hc)), 2),
                   polmer=[[h, round(max(rv - t, (R - (R - rv) * h / Hc) - t), 2)] for h in range(0, 106, 5)]),
        optika=dict(nSteklo=N_STEKLO, nVoda=N_VODA, kapilarnaMm=KAPILARNA),
    )
    return dict(pogledi=[A, B, C], sloji=sloji, meta=meta)


def okvir_predmetov(P, zbirke, rob=8):
    """Izrez okna okoli predmetov zbirk (za prosojne sloje s senco)."""
    import mathutils
    xs, ys = [], []
    dg = bpy.context.evaluated_depsgraph_get(); dg.update()
    for ime in zbirke:
        for o in bpy.data.collections[ime].objects:
            if o.type not in ("MESH", "CURVE"):
                continue
            tocke = [pt.co.xyz for sp in o.data.splines for pt in sp.points] if o.type == "CURVE" else o.evaluated_get(dg).bound_box
            for c in tocke:
                w = o.matrix_world @ mathutils.Vector(c)
                x, y = P.projekcija((w.x / MM, w.y / MM, w.z / MM))
                xs.append(x); ys.append(y)
    return (max(0, math.floor(min(xs) - rob)), max(0, math.floor(min(ys) - rob)), min(P.W, math.ceil(max(xs) + rob)), min(P.H, math.ceil(max(ys) + rob)))


# ================================================================ DOKAZNE REAKCIJE
def dokaz():
    """Leseno stojalo s šestimi epruvetami 16 × 160 mm in vodna kopel (čaša 250 mL na kuhalniku). Okno 400 × 220,
    0,9 px/mm. Barvo raztopin doda aplikacija iz modela (sloj debeline, Beer–Lambert)."""
    studio()
    bpy.context.view_layer.update()
    zb = "stalno"
    bukev = les()
    X = [-190 + 40 * i for i in range(6)]
    kvader("st-dno", 241.6, 58, 10, bukev, zb, (-90, 0, 0), posnetje=1.0)
    deska_z_luknjami("st-vrh", 241.6, 58, 9, [(x + 90, 0) for x in X], 9.6, bukev, zb, (-90, 0, 96))
    for x in (-216, 36):
        kvader(f"st-bok{x}", 10, 60, 118, bukev, zb, (x, 0, 0), posnetje=1.0)
    G = 46.0   # višina tekočine nad notranjim dnom (≈ 6 mL: 5 mL vzorca in reagent)
    LREF = EPRUVETA["d"] - 2 * EPRUVETA["stena"]
    dno = 0
    for i, x in enumerate(X):
        epruveta(f"ep-prazna{i}", None, "epruvete-prazne", (x, 0, 10))
        _, _, tek, dno = epruveta(f"ep-polna{i}", G, "epruvete-polne", (x, 0, 10))
        telo(f"ep-telo{i}", tek, LREF, "debelina-epruvete", (x, 0, 10))
    # kuhalnik in kopel
    KX = 135.0
    kvader("kuhalnik", 150, 150, 58, snov("kuhalnik", (0.82, 0.83, 0.84), 0.38, zrnatost=0.2, merilo=600), zb, (KX, 0, 2), posnetje=4)
    kvader("kuh-plosca", 136, 136, 7, snov("kuh-plosca", (0.05, 0.05, 0.055), 0.3, zrnatost=0.25, merilo=1200), zb, (KX, 0, 60), posnetje=1.5)
    valj("kuh-gumb", 11, 12, snov("dmm-gumb", (0.03, 0.03, 0.033), 0.4), zb, (KX + 35, -87, 30), os="y", posnetje=2)
    valj("kuh-led", 2.5, 2, snov("led-ugasnjen", (0.25, 0.03, 0.03), 0.25), zb, (KX - 40, -77, 34), os="y", n=20)
    for sx in (-1, 1):
        valj(f"kuh-noga{sx}", 8, 2, snov("guma", (0.025, 0.025, 0.028), 0.75), zb, (KX + sx * 60, -55, 0))
    ZK = 67.0
    GK = 58.0
    _, _, tekk, dnok = casa("casa", GK, zb, (KX, 0, ZK))
    emajl = snov("tisk-bel", (0.9, 0.9, 0.88), 0.5)
    Rc = CASA["d"] / 2
    for V in (50, 100, 150, 200):   # približne oznake: V = π·(33,4 mm)²·h
        hh = dnok + V * 1000 / (math.pi * (Rc - CASA["stena"]) ** 2)
        oznake_vrtenine(f"casa-crta{V}", [(hh, Rc, 10.0 if V % 100 == 0 else 6.0)], emajl, zb, (KX, 0, ZK), sredina=-math.pi / 2 - 0.6)
        if V % 100 == 0:
            napis_na_valju(f"casa-st{V}", str(V), Rc, hh + 0.4, emajl, velikost=3.6, zb=zb, premik=(KX, 0, ZK), kot=-math.pi / 2 - 0.6 + 10.5 / Rc)
    napis_na_valju("casa-napis", "250 mL", Rc, 70, emajl, velikost=4.5, zb=zb, premik=(KX, 0, ZK), kot=-math.pi / 2 + 0.3)
    valj("kuh-led-sveti", 2.6, 0.6, svetilo("led-sveti", (1.0, 0.12, 0.08), 6.0), "mehurji", (KX - 40, -79.2, 34), os="y", n=20)
    # mehurčki vrenja: zrak v vodi (mejna ploskev z razmerjem 1/1,333), največ ob dnu
    import random
    rnd = random.Random(7)
    zrak = steklo("mehur", 1.0 / N_VODA)
    for i in range(70):
        r = rnd.uniform(0.8, 3.2); a = rnd.uniform(0, 2 * math.pi); d = rnd.uniform(0, 28) ; h = dnok + r + 0.5 + (rnd.random() ** 2) * (GK - 2 * r - 2)
        bm_ = bmesh.new(); bmesh.ops.create_uvsphere(bm_, u_segments=16, v_segments=10, radius=r * MM)
        me = bpy.data.meshes.new(f"mehur{i}"); bm_.to_mesh(me); bm_.free(); gladko(me, 180)
        predmet(f"mehur{i}", me, zrak, "mehurji", (KX + d * math.cos(a), d * math.sin(a), ZK + h))
    D = Pogled("dokaz", 400, 220, 0.9, (0, 0, 0), (200, 180))
    osn = ["studio", "pult", "stalno"]
    def okvir(x0, z0, x1, z1, rob=3):
        a, b = D.projekcija((x0, 0, z1)), D.projekcija((x1, 0, z0))
        return (max(0, math.floor(a[0] - rob)), max(0, math.floor(a[1] - rob)), min(D.W, math.ceil(b[0] + rob)), min(D.H, math.ceil(b[1] + rob)))
    ok_ep = okvir(X[0] - 11, 8, X[-1] + 11, 173)
    ok_k = okvir(KX - 78, 0, KX + 78, ZK + CASA["h"] + 3)
    sloji = [
        dict(ime="dokaz", pogled=D, vidno=osn + ["epruvete-prazne"]),
        dict(ime="dokaz-polne", pogled=D, vidno=osn + ["epruvete-polne"], izrez=ok_ep),
        dict(ime="dokaz-debelina", pogled=D, vidno=["debelina-epruvete"], vrsta="debelina", izrez=ok_ep),
        dict(ime="dokaz-vre", pogled=D, vidno=osn + ["epruvete-prazne", "mehurji"], izrez=ok_k),
    ]
    meta = dict(
        poskus="dokaz",
        sidra={"dokaz": dict(epruvete=[D.projekcija((x, 0, 10)) for x in X], gladina=D.projekcija((X[0], 0, 10 + dno + G))[1], dnoZnotraj=D.projekcija((X[0], 0, 10 + dno))[1],
                             vrh=D.projekcija((X[0], 0, 170))[1], polSirine=round(EPRUVETA["d"] / 2 * D.s, 3), kopel=D.projekcija((KX, 0, ZK)), kopelVrh=D.projekcija((KX, 0, ZK + CASA["h"]))[1],
                             pult=D.projekcija((0, 0, 0))[1], merilo20=[D.projekcija((0, 0, 0))[0], D.projekcija((20, 0, 0))[0]])},
        merila=dict(dokaz=0.9, visinaKamere=dict(dokaz=6)),
        epruveta=dict(premer=EPRUVETA["d"], dolzina=EPRUVETA["l"], stena=EPRUVETA["stena"], gladinaMm=G, lref=LREF),
        optika=dict(nSteklo=N_STEKLO, nVoda=N_VODA, kapilarnaMm=KAPILARNA),
    )
    return dict(pogledi=[D], sloji=sloji, meta=meta)


# ================================================================ ELEKTRIČNI KROG
BREMENA = {"R47": 47, "R100": 100, "R220": 220, "R470": 470}   # kot LOADS v lab-model.js (0,5 W, ±5 %)


def krog():
    """Ohmov zakon na pultu: napajalnik 0–12 V, dva multimetra, ploščica s porabnikom, vodniki z banana vtiči.
    Okno 400 × 250 (0,6 px/mm vodoravno, kamera 52° nad vodoravnico), makro porabnika 120 × 80.
    Vsak vodnik, porabnik in položaj gumba je svoj prosojni sloj; aplikacija jih sestavi po vezavi iz modela."""
    studio(globina=(-420, 420), stena=False, kljuc=1.0)
    zb = "stalno"
    psu = napajalnik("psu", zb, -230, 160)
    amA = multimeter("am", zb, -40, 150, "A")
    vmV = multimeter("vm", zb, 205, 150, "V")
    # ploščica s porabnikom: dve medeninasti letvi s po tremi vtičnicami, porabnik med stebričkoma
    BXc, BYc = 80.0, -70.0
    kvader("ploscica", 160, 80, 12, snov("plosca-bela", (0.86, 0.87, 0.86), 0.4, zrnatost=0.2, merilo=800), zb, (BXc, BYc, 0), posnetje=2.5)
    medenina = kovina("medenina", (0.80, 0.62, 0.28), 0.3)
    L1, L2 = [], []
    for s_, sez in ((-1, L1), (1, L2)):
        kvader(f"letev{s_}", 14, 62, 2, medenina, zb, (BXc + s_ * 55, BYc, 12), posnetje=0.5)
        for k, dy in enumerate((22, 0, -22)):
            vticnica(f"pl-vt{s_}{k}-{'rdeca' if s_ < 0 else 'crna'}", "rdeca" if s_ < 0 else "crna", zb, (BXc + s_ * 55, BYc + dy, 13))
            sez.append((BXc + s_ * 55, BYc + dy, 18.0))
        valj(f"stebric{s_}", 2.5, 14, medenina, zb, (BXc + s_ * 16, BYc, 12), posnetje=0.5)
        kvader(f"vez{s_}", 36, 5, 1.5, medenina, zb, (BXc + s_ * 36, BYc, 12.5))
    ZP = 27.0   # višina osi porabnika
    for ime, ohm in BREMENA.items():
        upornik(ime, ohm, 0.5, "breme-" + ime, (BXc, BYc, ZP), razmik=32)
    upornik("zgorel", 100, 0.5, "breme-zgorel", (BXc, BYc, ZP), zgorel=True, razmik=32)
    # žarnica 6 V / 0,1 A (E10, balon Ø 11 mm) v podnožju; žarilna nitka posebej (ugasnjena / sveti)
    for zbz, sveti in (("breme-L6", False), ("breme-L6-sveti", True)):
        valj("zar-podnozje" + zbz, 10, 12, snov("bakelit", (0.03, 0.03, 0.032), 0.35), zbz, (BXc, BYc, 14), posnetje=1.5)
        valj("zar-navoj" + zbz, 4.8, 9, kovina("nikelj", (0.75, 0.74, 0.70), 0.3), zbz, (BXc, BYc, 24))
        vrtenina("zar-balon" + zbz, [(4.6, 33), (5.5, 37), (5.5, 40), (4.8, 44), (3, 47), (0, 48.2), (0, 47.6), (2.8, 46.5), (4.4, 43.8), (5.0, 40), (5.0, 37), (4.2, 33.4), (4.6, 33)], steklo("steklo-tanko", 1.5), 40, zbz, (BXc, BYc, 0))
        nit = svetilo("nitka-sveti", (1.0, 0.72, 0.38), 260.0) if sveti else kovina("volfram", (0.25, 0.24, 0.23), 0.4)
        cev("zar-nitka" + zbz, [(BXc - 2.2, BYc, 33), (BXc - 2.0, BYc, 41), (BXc - 0.7, BYc, 42.2), (BXc + 0.7, BYc, 40.8), (BXc + 2.0, BYc, 42), (BXc + 2.2, BYc, 33)], 0.16, nit, zbz, gladke=False)
        for s_ in (-1, 1):
            cev(f"zar-zica{s_}" + zbz, [(BXc + s_ * 9, BYc, 16), (BXc + s_ * 16, BYc, 24)], 0.5, kovina("kositer", (0.78, 0.78, 0.76), 0.22), zbz, gladke=False)
    # gumbi multimetrov: položaji območij
    KOTI = {"am": {"20m": 75, "200m": 100, "10": 130}, "vm": {"2": -35, "20": -60, "200": -85}}
    for ime, d in (("am", amA), ("vm", vmV)):
        for obm, kot in KOTI[ime].items():
            gumb_multimetra(f"{ime}-gumb-{obm}", f"gumb-{ime}-{obm}", d["gumb"], kot)
    # vodniki (rdeč s pozitivne strani, črn iz COM / proti minusu)
    A_, V_ = amA["vticnice"], vmV["vticnice"]
    VOD = {
        "P-L1": (psu["plus"], L1[1], "rdeca", "y", "z", 18), "P-AmA": (psu["plus"], A_["mA"], "rdeca", "y", "z", -20), "P-A10": (psu["plus"], A_["10A"], "rdeca", "y", "z", -20),
        "P-VV": (psu["plus"], V_["V"], "rdeca", "y", "z", 60), "ACOM-L1": (A_["COM"], L1[1], "crna", "z", "z", 14), "ACOM-VV": (A_["COM"], V_["V"], "crna", "z", "z", 34),
        "VCOM-L1": (V_["COM"], L1[1], "crna", "z", "z", -36), "L2-N": (L2[1], psu["minus"], "crna", "z", "y", -105),
        "AmA-L1": (A_["mA"], L1[0], "rdeca", "z", "z", -16), "A10-L1": (A_["10A"], L1[0], "rdeca", "z", "z", -16), "ACOM-L2": (A_["COM"], L2[0], "crna", "z", "z", 22),
        "VV-L1": (V_["V"], L1[2], "rdeca", "z", "z", -58), "VCOM-L2": (V_["COM"], L2[2], "crna", "z", "z", -22),
    }
    for ime, (a, b, barva, sa, sb, lok) in VOD.items():
        vodnik("vod-" + ime, a, b, barva, "vod-" + ime, sa, sb, lok)
    bpy.context.view_layer.update()
    E = Pogled("krog", 400, 250, 0.6, (0, 0, 0), (196, 158), visina=52.0)
    F = Pogled("makro", 120, 80, 7.0, (BXc, BYc, ZP), (60, 44), visina=38.0)
    G = Pogled("makroL", 120, 80, 2.7, (BXc, BYc, ZP + 8), (60, 44), visina=30.0)
    osn = ["studio", "pult", "stalno"]
    privzeto = ["gumb-am-200m", "gumb-vm-20"]
    sloji = [dict(ime="krog", pogled=E, vidno=osn + privzeto)]
    for ime in VOD:
        sloji.append(dict(ime="krog-vod-" + ime, pogled=E, vidno=["studio", "vod-" + ime], lovilci=["pult", "stalno"] + privzeto, vrsta="prosojno", izrez=okvir_predmetov(E, ["vod-" + ime], 10)))
    for ime in list(BREMENA) + ["zgorel", "L6", "L6-sveti"]:
        sloji.append(dict(ime="krog-breme-" + ime, pogled=E, vidno=["studio", "breme-" + ime], lovilci=["pult", "stalno"] + privzeto, vrsta="prosojno", izrez=okvir_predmetov(E, ["breme-" + ime], 8)))
    for m_ in KOTI:
        for obm in KOTI[m_]:
            sloji.append(dict(ime=f"krog-gumb-{m_}-{obm}", pogled=E, vidno=["studio", f"gumb-{m_}-{obm}"], lovilci=["pult", "stalno"], vrsta="prosojno", izrez=okvir_predmetov(E, [f"gumb-{m_}-{obm}"], 3)))
    for ime in list(BREMENA) + ["zgorel"]:
        sloji.append(dict(ime="makro-" + ime, pogled=F, vidno=osn + privzeto + ["breme-" + ime]))
    for ime in ("L6", "L6-sveti"):
        sloji.append(dict(ime="makro-" + ime, pogled=G, vidno=osn + privzeto + ["breme-" + ime]))
    pr = lambda t: E.projekcija(t)
    meta = dict(
        poskus="krog",
        sidra={"krog": dict(psuZaslon=[pr(t) for t in psu["zaslon"]], psuLed=pr(psu["led"]), amLcd=[pr(t) for t in amA["lcd"]], vmLcd=[pr(t) for t in vmV["lcd"]],
                            breme=pr((BXc, BYc, ZP)), am=pr((-40, 150, 38)), vm=pr((205, 150, 38)), psu=pr((-230, 160, 84)), merilo100=[pr((0, -150, 0))[0], pr((100, -150, 0))[0]]),
               "makro": dict(breme=F.projekcija((BXc, BYc, ZP))), "makroL": dict(breme=G.projekcija((BXc, BYc, ZP + 14)))},
        merila=dict(krog=0.6, makro=7.0, makroL=2.7, visinaKamere=dict(krog=52, makro=38, makroL=30)),
        upornik=dict(moc=0.5, telo=UPORNIK[0.5], kode={k: barvna_koda(v) for k, v in BREMENA.items()}),
        zasloni=dict(psu=[62, 24], am=[52, 24], vm=[52, 24]),
        vodniki={k: dict(barva=v[2]) for k, v in VOD.items()},
    )
    return dict(pogledi=[E, F, G], sloji=sloji, meta=meta)


PRIZORI = {"titracija": titracija, "dokaz": dokaz, "krog": krog}

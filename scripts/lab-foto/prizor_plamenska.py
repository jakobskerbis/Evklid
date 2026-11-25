# Fotorealistični laboratorij: prizor poskusa lab-plamenska (plamenska reakcija). Registriran v lab_prizori.PRIZORI.
# Na pultu: plinski gorilnik (Bunsen, medeninasta cev Ø 13 × 150 mm, litoželezno podnožje Ø 90 mm, vrtljiv obroč z
# odprtinama za zrak) s cevjo za plin, urno steklo s koncentrirano HCl, urno steklo s soljo in zanka iz nikroma na
# držalu (v plamenu ali na pultu). Plamena v izrisu NI: obliko (svetel / nesvetel, notranji stožec) in barvo iz modela
# (public/sim/lab-model-reakcije.js) nariše aplikacija (public/sim/foto-plamenska.js), prav tako barvo soli na urnem
# steklu, žarenje zanke, kobaltovo steklo in pogled skozi spektroskop. Sol je v izrisu bela.
import math
import random
import bmesh
import bpy
import mathutils
from lab_prizori import *  # noqa: F401,F403  (Pogled, studio, material_debeline, okvir_predmetov, modeli)
import lab_modeli as M

GORILNIK = dict(cev=13.0, stena=1.0, visina=150.0, podnozje=90.0, odprtina=7.0, z_odprtine=37.0, ovoj=(26.0, 48.0), ovoj_d=17.0)
ZANKA = dict(premer=3.0, zica=0.5, dolzina=50.0, nad_ustjem=40.0, x=2.0, y=0.0, kot=35.0)   # zanka 40 mm nad ustjem
URNO = dict(premer=80.0, globina=10.0, stena=1.5)                                       # urno steklo Ø 80 mm
N_HCL = 1.41      # koncentrirana HCl (36–38 %), nD 20 °C (CRC Handbook: 1,410)
V_HCL = 2.0       # mL HCl na urnem steklu
SOL = dict(polmer=12.0, visina=7.0, nasip=32.0)    # kupček ~1,5 g soli, nasipni kot ~32°
HX, SX = 190.0, 290.0                             # središči urnih stekel (x, mm)


def lecevje(d, r):
    """Delež ploščine odprtine (krog polmera r), ki ga prekriva enaka odprtina, zamaknjena za d (presek krogov)."""
    if d >= 2 * r:
        return 0.0
    return (2 * r * r * math.acos(d / (2 * r)) - d / 2 * math.sqrt(4 * r * r - d * d)) / (math.pi * r * r)


def kot_odprtosti(f, r, R):
    """Zasuk obroča [rad], pri katerem je odprtega delež f ploščine odprtine (odprtini na polmeru R)."""
    lo, hi = 0.0, 2 * r
    for _ in range(60):
        m = (lo + hi) / 2
        (lo, hi) = (m, hi) if lecevje(m, r) > f else (lo, m)
    return (lo + hi) / 2 / R


def izvrtaj(o, z, r, koti, dolzina=40.0):
    """Luknji polmera r skozi steno vrtenine o (os z) v višini z [mm], v smereh koti [rad, 0 = −y, proti kameri]."""
    for i, a in enumerate(koti):
        bm = bmesh.new()
        bmesh.ops.create_cone(bm, cap_ends=True, segments=40, radius1=r * MM, radius2=r * MM, depth=dolzina * MM)
        me = bpy.data.meshes.new(o.name + f"-rez{i}"); bm.to_mesh(me); bm.free()
        c = bpy.data.objects.new(me.name, me)
        bpy.context.scene.collection.objects.link(c)
        c.location = (o.location.x, o.location.y, o.location.z + z * MM)
        c.rotation_euler = (math.pi / 2, 0, a)
        mod = o.modifiers.new("rez", "BOOLEAN"); mod.operation = "DIFFERENCE"; mod.solver = "EXACT"; mod.object = c
        dg = bpy.context.evaluated_depsgraph_get(); dg.update()
        nov = bpy.data.meshes.new_from_object(o.evaluated_get(dg))
        o.modifiers.remove(mod)
        stari = o.data; o.data = nov; bpy.data.meshes.remove(stari)
        bpy.data.objects.remove(c); bpy.data.meshes.remove(me)
    return o


def valj_smer(ime, r, l, mat, zb, zacetek, smer, n=32, posnetje=0.0):
    """Valj polmera r in dolžine l od točke zacetek [mm] v smeri smer."""
    o = valj(ime, r, l, mat, zb, (0, 0, 0), n=n, posnetje=posnetje)
    o.location = [v * MM for v in zacetek]
    o.rotation_euler = mathutils.Vector(smer).to_track_quat("Z", "Y").to_euler()
    return o


def gorilnik(zb):
    G = GORILNIK
    rc, t, H = G["cev"] / 2, G["stena"], G["visina"]
    litina = snov("gorilnik-litina", (0.10, 0.105, 0.11), 0.42, zrnatost=0.5, merilo=900)
    medenina = kovina("medenina", (0.80, 0.62, 0.28), 0.3)
    zagorela = snov("medenina-zagorela", (0.30, 0.17, 0.08), 0.42, kovina=0.85)
    notranjost = snov("cev-notranjost", (0.05, 0.035, 0.02), 0.6, kovina=0.5)
    # podnožje: ravno dno, zaobljen rob, stožec, puša za cev
    vrtenina("gor-podnozje", [(0, 0), (44, 0), (45, 1.2), (45, 6), (43.5, 9), (22, 17.5), (14, 21.5), (12, 23), (12, 27), (rc + 0.1, 27), (0, 27)], litina, 96, zb)
    # cev: zunaj medenina, zgornjih 8 mm zagorelo od plamena; znotraj temno (saje)
    prof = [(0, 24), (rc, 24), (rc, H - 8), (rc, H), (rc - t, H), (rc - t, H - 10), (0, H - 10)]
    cev_o = vrtenina("gor-cev", prof, [medenina, zagorela, notranjost], 64, zb, indeksi=[0, 0, 1, 1, 2, 2])
    izvrtaj(cev_o, G["z_odprtine"], G["odprtina"] / 2, [0.0, math.pi])
    # šoba za plin v cevi (vidna skozi odprti odprtini)
    vrtenina("gor-soba", [(0, 26), (2.5, 26), (2.5, 31), (1.2, 34), (0, 34)], medenina, 32, zb)
    # priključek za cev s plinom (medenina, trije robovi) in gumijasta cev
    valj_smer("gor-prikljucek", 4.5, 40, medenina, zb, (-24, 0, 11), (-1, 0, 0))
    for i, x in enumerate((-50, -56, -62)):
        valj_smer(f"gor-rob{i}", 5.3, 2.0, medenina, zb, (x, 0, 11), (-1, 0, 0))
    guma = snov("guma-plin", (0.50, 0.10, 0.04), 0.5, zrnatost=0.15)
    cev("gor-cev-plin", [(-52, 0, 11), (-75, 0, 11), (-110, 15, 8), (-150, 60, 6.5), (-220, 140, 6.5)], 6.5, guma, zb, n=24)
    return medenina


def obroc(zb, kot):
    """Vrtljiv obroč z dvema odprtinama, zasukan za kot [rad] glede na odprtini v cevi (0 = odprt)."""
    G = GORILNIK
    z0, z1 = G["ovoj"]
    ro, ri = G["ovoj_d"] / 2, G["cev"] / 2 + 0.15
    o = vrtenina("gor-obroc-" + zb, [(ri, z0), (ro - 0.5, z0), (ro, z0 + 0.5), (ro, z1 - 0.5), (ro - 0.5, z1), (ri, z1), (ri, z0)], kovina("medenina-obroc", (0.78, 0.60, 0.27), 0.34, krtaceno=0.3), 96, zb)
    return izvrtaj(o, G["z_odprtine"], G["odprtina"] / 2, [kot, kot + math.pi])


def urno_steklo(ime, zb, x, tekocina=None):
    """Urno steklo Ø 80 mm, globina 10 mm, steklo 1,5 mm (krogelna kapica, R = 85 mm). tekocina = polmer gladine
    [mm]: notranja ploskev pod njo je meja steklo–HCl."""
    U = URNO
    a, h, t = U["premer"] / 2, U["globina"], U["stena"]
    Ro = (a * a + h * h) / (2 * h); Ri = Ro - t; c = Ro
    zi = lambda r: c - math.sqrt(Ri * Ri - r * r)
    am = math.acos((c - h) / Ro)
    zunaj = [(Ro * math.sin(am * k / 24), c - Ro * math.cos(am * k / 24)) for k in range(25)]
    ri_rob = math.sqrt(Ri * Ri - (c - h) ** 2)
    rob = [(a - 0.3, h + 0.3), (ri_rob + 0.3, h + 0.3)]
    rs = [ri_rob * (1 - k / 24) for k in range(25)]
    if tekocina:
        rs = sorted(set([r for r in rs if abs(r - tekocina) > 0.4] + [tekocina]), reverse=True)
    znotraj = [(r, zi(r)) for r in rs]
    prof = zunaj + rob + znotraj
    ind = [0] * (len(prof) - 1)
    if tekocina:
        k0 = len(zunaj) + len(rob) + [i for i, (r, _) in enumerate(znotraj) if abs(r - tekocina) < 1e-9][0]
        ind = [0] * k0 + [1] * (len(prof) - 1 - k0)
    mats = [steklo(), steklo("meja-hcl", N_STEKLO / N_HCL)]
    return vrtenina(ime, prof, mats, 128, zb, (x, 0, 0), indeksi=ind), zi, Ri


def zanka(zb, L, smer, mat_zica, medenina, deb=None):
    """Zanka Ø 3 mm iz nikromove žice Ø 0,5 mm na 50 mm žice, v Kollejevem držalu (medeninasta objemka, aluminijasta
    palica Ø 6 × 150 mm, črn ročaj Ø 10 × 80 mm). L = središče zanke, smer = enotski vektor proti ročaju."""
    Z = ZANKA
    s = mathutils.Vector(smer).normalized()
    e2 = mathutils.Vector((0, 1, 0)).cross(s).normalized()   # pravokotno na s v ravnini zanke (pravokotno na y)
    if abs(s.y) > 0.5:
        e2 = mathutils.Vector((0, 0, 1))
    L = mathutils.Vector(L)
    rz = Z["premer"] / 2
    krog = [tuple(L + rz * (math.cos(2 * math.pi * k / 32) * s + math.sin(2 * math.pi * k / 32) * e2)) for k in range(33)]
    cev("zanka-krog-" + zb, krog, Z["zica"] / 2, mat_zica, zb, n=8)
    zac = L + rz * s
    kon = zac + Z["dolzina"] * s
    cev("zanka-zica-" + zb, [tuple(zac), tuple(kon)], Z["zica"] / 2, mat_zica, zb, n=8, gladke=False)
    valj_smer("zanka-objemka-" + zb, 3.5, 15, medenina, zb, tuple(kon - 3 * s), tuple(s), posnetje=0.6)
    alu = kovina("aluminij", (0.78, 0.79, 0.80), 0.36)
    valj_smer("zanka-palica-" + zb, 3.0, 150, alu, zb, tuple(kon + 12 * s), tuple(s), posnetje=0.5)
    valj_smer("zanka-rocaj-" + zb, 5.0, 80, snov("plastika-crna", (0.02, 0.02, 0.022), 0.4, zrnatost=0.2), zb, tuple(kon + 90 * s), tuple(s), posnetje=1.5)


def plamenska():
    """Okno 400 × 300 enot (kot risba), 0,9 enote/mm, kamera 15° nad vodoravnico. Sloji: osnova (gorilnik z zaprto
    odprtino, urni stekli s HCl in soljo, brez zanke), obroč pol odprt in odprt (izreza), maska soli (debelina),
    zanka v plamenu in na pultu (prosojno, s senco)."""
    studio()
    bpy.context.view_layer.update()
    zb = "stalno"
    medenina = gorilnik(zb)
    G = GORILNIK
    R_odp = G["cev"] / 2 + 0.1
    KOTI = {"zrak0": math.pi / 2, "zrak05": kot_odprtosti(0.5, G["odprtina"] / 2, R_odp), "zrak1": 0.0}
    for ime, k in KOTI.items():
        obroc(ime, k)
    # ---- urno steklo s koncentrirano HCl (gladina iz krogelne kapice: V = πh²(3R − h)/3)
    _, zi, Ri = urno_steklo("urno-hcl", zb, HX, tekocina=None)
    z0 = zi(0)
    lo, hi = 0.0, 10.0
    for _ in range(60):
        m = (lo + hi) / 2
        (lo, hi) = (m, hi) if math.pi * m * m * (3 * Ri - m) / 3 < V_HCL * 1000 else (lo, m)
    hH = (lo + hi) / 2
    rH = math.sqrt(2 * Ri * hH - hH * hH)
    bpy.data.objects.remove(bpy.data.objects["urno-hcl"])
    urno_steklo("urno-hcl", zb, HX, tekocina=rH)
    vrtenina("hcl-gladina", [(rH, z0 + hH)] + [(rH * (1 - k / 16), z0 + hH) for k in range(1, 17)], steklo("hcl", N_HCL), 128, zb, (HX, 0, 0))
    # ---- urno steklo s kupčkom soli (bel; barvo doda aplikacija skozi masko)
    urno_steklo("urno-sol", zb, SX)
    S = SOL
    tg = math.tan(math.radians(S["nasip"]))
    rr = [S["polmer"] * (1 - k / 14) for k in range(15)]
    vrh = lambda r: zi(S["polmer"]) + S["visina"] * (1 - math.exp(-(S["polmer"] - r) * tg / S["visina"]))   # stožec z zaobljenim vrhom
    dno_s = [(S["polmer"] * k / 10, zi(S["polmer"] * k / 10) + 0.02) for k in range(11)]
    prof = dno_s + [(r, vrh(r)) for r in rr[1:]]
    sol = snov("sol-bela", (0.93, 0.93, 0.93), 0.55, zrnatost=0.9, merilo=2500)
    kup = vrtenina("sol-kup", prof, sol, 64, zb, (SX, 0, 0))
    rnd = random.Random(11)
    zmeja = (zi(S["polmer"]) + 0.3) * MM
    for v in kup.data.vertices:
        if v.co.z > zmeja:
            v.co.x += rnd.uniform(-0.25, 0.25) * MM; v.co.y += rnd.uniform(-0.25, 0.25) * MM; v.co.z += rnd.uniform(-0.2, 0.2) * MM
    kup_m = kup.data.copy()
    maska = bpy.data.objects.new("sol-maska", kup_m)
    M.zbirka("debelina-sol").objects.link(maska)
    maska.location = kup.location
    kup_m.materials.clear(); kup_m.materials.append(material_debeline(0.02))
    # zrnca okoli kupčka
    for i in range(40):
        a = rnd.uniform(0, 2 * math.pi); d = rnd.uniform(S["polmer"] - 0.5, S["polmer"] + 4)
        r = rnd.uniform(0.15, 0.35)
        o = kvader(f"sol-zrno{i}", r * 2, r * 2, r * 2, sol, zb, (SX + d * math.cos(a), d * math.sin(a), zi(d) - 0.05))
        o.rotation_euler = (rnd.uniform(0, 1), rnd.uniform(0, 1), rnd.uniform(0, 3))
        o2 = kvader(f"sol-zrno-m{i}", r * 2, r * 2, r * 2, material_debeline(0.02), "debelina-sol", (SX + d * math.cos(a), d * math.sin(a), zi(d) - 0.05))
        o2.rotation_euler = o.rotation_euler
    # ---- zanka: v plamenu (40 mm nad ustjem, ročaj levo zgoraj, roke ni) in na pultu
    Z = ZANKA
    nikrom = snov("nikrom", (0.40, 0.38, 0.36), 0.42, kovina=0.9)
    Lp = (Z["x"], Z["y"], G["visina"] + Z["nad_ustjem"])
    kp = math.radians(Z["kot"])
    zanka("zanka-plamen", Lp, (-math.cos(kp), 0, math.sin(kp)), nikrom, medenina)
    Lm = (40.0, -115.0, 5.0)
    sm = mathutils.Vector((1, 0.10, 0)).normalized()
    zanka("zanka-miza", Lm, tuple(sm), nikrom, medenina)
    bpy.context.view_layer.update()

    # ---- pogled in sloji
    P = Pogled("plamenska", 400, 300, 0.9, (0, 0, 0), (90, 262), visina=15.0)
    pr = P.projekcija
    osn = ["studio", "pult", "stalno"]

    def okvir(x0, z0, x1, z1, y0=0.0, y1=0.0, rob=3):
        a, b = pr((x0, y1, z1)), pr((x1, y0, z0))
        return (max(0, math.floor(a[0] - rob)), max(0, math.floor(a[1] - rob)), min(P.W, math.ceil(b[0] + rob)), min(P.H, math.ceil(b[1] + rob)))
    r9 = G["ovoj_d"] / 2
    ok_o = okvir(-r9 - 1, G["ovoj"][0] - 1, r9 + 1, G["ovoj"][1] + 1, -r9, r9)
    ok_s = okvir(SX - S["polmer"] - 6, -1, SX + S["polmer"] + 6, zi(S["polmer"]) + S["visina"] + 2, -S["polmer"] - 6, S["polmer"] + 6)
    sloji = [
        dict(ime="plamenska", pogled=P, vidno=osn + ["zrak0"]),
        dict(ime="pl-zrak05", pogled=P, vidno=osn + ["zrak05"], izrez=ok_o),
        dict(ime="pl-zrak1", pogled=P, vidno=osn + ["zrak1"], izrez=ok_o),
        dict(ime="pl-sol-maska", pogled=P, vidno=["debelina-sol"], vrsta="debelina", izrez=ok_s),
        dict(ime="pl-zanka-plamen", pogled=P, vidno=["studio", "zanka-plamen"], lovilci=["pult", "stalno", "zrak0"], vrsta="prosojno", izrez=okvir_predmetov(P, ["zanka-plamen"], 8)),
        dict(ime="pl-zanka-miza", pogled=P, vidno=["studio", "zanka-miza"], lovilci=["pult", "stalno"], vrsta="prosojno", izrez=okvir_predmetov(P, ["zanka-miza"], 8)),
    ]
    U = URNO
    meta = dict(
        poskus="plamenska",
        sidra={"plamenska": dict(
            pult=pr((0, 0, 0))[1], merilo20=[pr((0, 0, 0))[0], pr((20, 0, 0))[0]],
            ustje=pr((0, 0, G["visina"])), podnozje=pr((0, 0, 0)), odprtina=pr((0, -r9, G["z_odprtine"])),
            zankaPlamen=pr(Lp), zankaMiza=pr(Lm), hcl=pr((HX, 0, 0)), vzorec=pr((SX, 0, 0)),
            vzorecVrh=pr((SX, 0, zi(S["polmer"]) + S["visina"])))},
        merila=dict(plamenska=0.9, vodoravno=round(P.s, 5), visinaKamere=dict(plamenska=15)),
        gorilnik=dict(cev=G["cev"], stena=G["stena"], visina=G["visina"], podnozje=G["podnozje"], odprtina=G["odprtina"],
                      zOdprtine=G["z_odprtine"], ovoj=G["ovoj_d"], zasuk={k: round(math.degrees(v), 2) for k, v in KOTI.items()},
                      odprtost={k: round(lecevje(v * R_odp, G["odprtina"] / 2), 4) for k, v in KOTI.items()}),
        zanka=dict(premer=Z["premer"], zica=Z["zica"], dolzina=Z["dolzina"], nadUstjem=Z["nad_ustjem"], x=Z["x"]),
        urnoSteklo=dict(premer=U["premer"], globina=U["globina"], stena=U["stena"]),
        hcl=dict(V=V_HCL, n=N_HCL, gladinaMm=round(hH, 3), polmer=round(rH, 2), Ri=round(Ri, 3)),
        sol=dict(polmer=S["polmer"], visina=S["visina"]),
        optika=dict(nSteklo=N_STEKLO),
    )
    return dict(pogledi=[P], sloji=sloji, meta=meta)

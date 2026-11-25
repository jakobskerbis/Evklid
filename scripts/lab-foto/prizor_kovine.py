# Fotorealistični laboratorij: prizor poskusa lab-kovine (kovine v kislinah in raztopinah soli). Registriran v
# lab_prizori.PRIZORI. Na pultu: erlenmajerica 100 mL (DIN ISO 1773) s 50 mL raztopine, gumijast zamašek s stekleno
# cevko, cevjo do plinske brizge in sondo termometra; ali nizka čaša 100 mL (ISO 3819) za raztopine soli. Steklena
# plinska brizga 100 mL (1 mL = 1,5 mm, notranji Ø 29,1 mm) v obročni prijemki na stojalu. Bat je ločen sloj, ki ga
# aplikacija premakne za prostornino plina iz modela; lestvico brizge (1 mL črte, številke na 10 mL) nariše aplikacija.
# Kovina (zvit magnezijev trak, trak, zrnca, prah) je izrisana kot bela kovina na prozornem ozadju (za steklom in
# tekočino z lomom, brez odboja); barvo kovine (F0), prevleko, preostalo količino in mehurčke doda aplikacija iz
# modela (public/sim/lab-model-elektrokemija.js, public/sim/foto-kovine.js). Za koliko kovine je še ostalo, ima vsaka
# oblika sloj »id« (debelina): vrednost raste vzdolž traku (ali po zrncih), aplikacija z mejo pokaže le del.
import math
import random
import bmesh
import bpy
from lab_prizori import *  # noqa: F401,F403  (Pogled, studio, telo, prostornina, okvir_predmetov, modeli)
import lab_modeli as M

V_RAZ = 50.0           # mL raztopine (POSODA_K.V)
LREF = 40.0            # mm: barvaRaztopine(c, 4) v modelu je barva pri 4 cm
BR = dict(mm_ml=1.5, ri=14.57, ro=16.5, z=195.0, x0=85.0, dolzina=165.0, obroc=(238.0, 250.0))  # plinska brizga 100 mL
BAT = dict(r=14.5, dolzina=171.0, rocaj=8.0, rr=12.0)   # brušen stekleni bat; izpade pri ~110 mL (165 mm / 1,5)
SONDA = dict(r=2.0, dolzina=130.0, rocaj=35.0, rr=5.0)   # sonda digitalnega termometra Ø 4 × 130 mm (ocena)
KOV = dict(x=0.0, y=-5.0, dno=2.0)                       # sredina kovine na notranjem dnu (obe posodi: dno 2,0 mm)
ZVITEK = dict(R=8.0, d=0.2, w=3.0, x0=-16.0, x1=16.0, L=480.0)   # Mg trak 3 × 0,2 mm, navit (0,5 g = 480 mm)
TRAK = dict(L=28.0, w=10.0, d=0.25, lok=1.5)            # trak (folija) Zn/Fe/Cu 10 × 0,25 mm, največ 28 mm (0,5 g Zn)
ZRNCA = dict(N=21, d=3.0)                                # zrnca Ø 3 mm kot v modelu (0,5 g Mg = 20,3 zrnca)
PRAH = dict(nasip=32.0, fi=0.5, m=0.5, rho=1.738)        # kupček prahu: 0,5 g Mg pri nasipni gostoti 50 % (ocena)
ID_MAX = 0.9                                             # vrednosti v slojih »id« so 0 … 0,9 (ozadje 1)
SONDA_TOCKA = (5.0, 14.0, 8.0)                           # konica sonde (za kovino, 6 mm nad notranjim dnom)


def lom_mat(m):
    """Steklo ali meja tekočine z lomom brez odboja (za kovino za steklom na prozornem ozadju)."""
    ime = "lom-" + m.name
    if ime in bpy.data.materials:
        return bpy.data.materials[ime]
    ior = next((n.inputs["IOR"].default_value for n in m.node_tree.nodes if "IOR" in n.inputs), 1.474)
    lm, nt, out = M._mat(ime)
    r = nt.nodes.new("ShaderNodeBsdfRefraction")
    M._nastavi(r, IOR=ior, Roughness=0.0)
    nt.links.new(r.outputs[0], out.inputs["Surface"])
    return lm


def lomno(zb):
    for o in M.zbirka(zb).objects:
        o.visible_shadow = False   # svetloba pride do kovine kot skozi tanko steklo (brez kavstik, ki so pri 32 vzorcih šum)
        for i, m in enumerate(o.data.materials):
            o.data.materials[i] = lom_mat(m)


def id_mat(ime, x0=None, x1=None, vrednost=None):
    """Sevalec za sloj »id« (Raw): vrednost ali linearno vzdolž x od x0 do x1 [mm] (0 … ID_MAX)."""
    m, nt, out = M._mat(ime)
    e = nt.nodes.new("ShaderNodeEmission")
    e.inputs["Color"].default_value = (1, 1, 1, 1)
    if vrednost is not None:
        e.inputs["Strength"].default_value = vrednost
    else:
        tc = nt.nodes.new("ShaderNodeTexCoord"); sx = nt.nodes.new("ShaderNodeSeparateXYZ"); mr = nt.nodes.new("ShaderNodeMapRange")
        mr.clamp = True
        M._nastavi(mr, **{"From Min": x0 * MM, "From Max": x1 * MM, "To Min": 0.0, "To Max": ID_MAX})
        nt.links.new(tc.outputs["Object"], sx.inputs[0]); nt.links.new(sx.outputs[0], mr.inputs["Value"]); nt.links.new(mr.outputs["Result"], e.inputs["Strength"])
    nt.links.new(e.outputs[0], out.inputs["Surface"])
    return m


def mreza(ime, verts, faces, mat, zb, gl=True):
    me = bpy.data.meshes.new(ime)
    me.from_pydata([tuple(c * MM for c in v) for v in verts], [], faces)
    me.update()
    if gl:
        M.gladko(me, 50)
    return M.predmet(ime, me, mat, zb)


def zvitek(ime, mat, zb):
    """Magnezijev trak 3 × 0,2 mm, navit v vijačnico R 8 mm vzdolž osi x, leži na dnu."""
    Z = ZVITEK
    p_kor = 2 * math.pi * Z["R"]
    zavoji = Z["L"] / p_kor
    for _ in range(8):   # dolžina zavoja z vzponom: √((2πR)² + korak²)
        zavoji = Z["L"] / math.hypot(p_kor, (Z["x1"] - Z["x0"]) / zavoji)
    n = int(zavoji * 72)
    zc = KOV["dno"] + Z["R"] + Z["d"] / 2
    V, F = [], []
    for i in range(n + 1):
        t = i / n
        th = 2 * math.pi * zavoji * t
        xc = Z["x0"] + (Z["x1"] - Z["x0"]) * t
        for dx, dr in ((-Z["w"] / 2, -Z["d"] / 2), (Z["w"] / 2, -Z["d"] / 2), (Z["w"] / 2, Z["d"] / 2), (-Z["w"] / 2, Z["d"] / 2)):
            r = Z["R"] + dr
            V.append((xc + dx, KOV["y"] - r * math.cos(th), zc - r * math.sin(th)))
    for i in range(n):
        a, b = 4 * i, 4 * (i + 1)
        for k in range(4):
            F.append((a + k, a + (k + 1) % 4, b + (k + 1) % 4, b + k))
    F.append((3, 2, 1, 0)); F.append((4 * n, 4 * n + 1, 4 * n + 2, 4 * n + 3))
    return mreza(ime, V, F, mat, zb), zavoji


def trak(ime, mat, zb):
    """Trak (folija) 10 × 0,25 mm, rahlo upognjen (lok 1,5 mm), konca na dnu."""
    T = TRAK
    n = 40
    V, F = [], []
    for i in range(n + 1):
        x = -T["L"] / 2 + T["L"] * i / n
        zb_ = KOV["dno"] + T["lok"] * (1 - (2 * x / T["L"]) ** 2)
        for y, z in ((-T["w"] / 2, 0), (T["w"] / 2, 0), (T["w"] / 2, T["d"]), (-T["w"] / 2, T["d"])):
            V.append((KOV["x"] + x, KOV["y"] + y, zb_ + z))
    for i in range(n):
        a, b = 4 * i, 4 * (i + 1)
        for k in range(4):
            F.append((a + k, b + k, b + (k + 1) % 4, a + (k + 1) % 4))
    F.append((0, 1, 2, 3)); F.append((4 * n + 3, 4 * n + 2, 4 * n + 1, 4 * n))
    o = mreza(ime, V, F, mat, zb, gl=False)
    return o


def zrnca_lege():
    """21 zrnc v treh vrstah, sprednja vrsta najprej (od sredine navzven): ko se raztapljajo, izginjajo zadnja."""
    rnd = random.Random(5)
    lege = []
    for vr, y in enumerate((-11.0, -7.0, -3.0)):
        xs = sorted([-12 + 4 * k + (2 if vr == 1 else 0) - (1 if vr == 2 else 0) for k in range(7)], key=abs)
        for x in xs:
            r = ZRNCA["d"] / 2 * rnd.uniform(0.9, 1.1)
            lege.append((x + rnd.uniform(-0.5, 0.5), y + rnd.uniform(-0.5, 0.5), r))
    return lege


def zrno(ime, x, y, r, mat, zb, seme):
    rnd = random.Random(seme)
    bm = bmesh.new()
    bmesh.ops.create_icosphere(bm, subdivisions=3, radius=r * MM)
    sm = [(rnd.uniform(-1, 1), rnd.uniform(-1, 1), rnd.uniform(-1, 1)) for _ in range(5)]
    for v in bm.verts:
        d = v.co.normalized()
        f = 1 + 0.13 * sum(math.sin(3.1 * (d.x * a + d.y * b + d.z * c) + k) for k, (a, b, c) in enumerate(sm)) / 2.2
        v.co = d * r * MM * f
        v.co.z *= 0.85
    me = bpy.data.meshes.new(ime); bm.to_mesh(me); bm.free()
    M.gladko(me, 70)
    o = M.predmet(ime, me, mat, zb, (x, y, KOV["dno"] + r * 0.8))
    o.rotation_euler = (rnd.uniform(0, 3), rnd.uniform(0, 3), rnd.uniform(0, 3))
    return o


def prah_profil():
    """Kupček prahu (stožec z zaobljenim vrhom, nasipni kot 32°) s prostornino 0,5 g Mg pri nasipni gostoti 50 %."""
    V = PRAH["m"] / PRAH["rho"] / PRAH["fi"] * 1000   # mm³
    tg = math.tan(math.radians(PRAH["nasip"]))
    r = (3 * V / (math.pi * tg)) ** (1 / 3)
    for _ in range(30):   # zaobljen vrh zmanjša prostornino: povečaj polmer, dokler V ne ustreza
        h = r * tg
        prof = [(r * (1 - k / 20), h * (1 - math.exp(-(k / 20) * 2.6)) / (1 - math.exp(-2.6))) for k in range(21)]
        Vp = sum(math.pi * ((r1 + r2) / 2) ** 2 * (z2 - z1) for (r1, z1), (r2, z2) in zip(prof, prof[1:]))
        r *= (V / Vp) ** (1 / 3)
    return prof, r, prof[-1][1], V


def sonda(ime, zb, tip, smer_tocka, cable, mat_sonda=None):
    """Sonda termometra od konice skozi točko smer_tocka; ročaj in kabel."""
    d = [smer_tocka[i] - tip[i] for i in range(3)]
    L = math.sqrt(sum(c * c for c in d)); d = [c / L for c in d]
    S = SONDA
    vrh = [tip[i] + S["dolzina"] * d[i] for i in range(3)]
    kon = [vrh[i] + S["rocaj"] * d[i] for i in range(3)]
    jeklo = mat_sonda or kovina("jeklo-sonda", (0.66, 0.67, 0.69), 0.22)
    cev(ime + "-cev", [tip, vrh], S["r"], jeklo, zb, gladke=False)
    if mat_sonda is None:
        cev(ime + "-rocaj", [vrh, kon], S["rr"], snov("plastika-crna", (0.02, 0.02, 0.022), 0.4, zrnatost=0.2), zb, gladke=False)
        cev(ime + "-kabel", [kon] + cable, 1.6, snov("plastika-crna", (0.02, 0.02, 0.022), 0.4, zrnatost=0.2), zb)
    return vrh


def videz_x(x, y, Ro, Ri, ng=N_STEKLO, nw=N_VODA):
    """Navidezna lega točke (x, y) v valju s tekočino (zunanji Ro, notranji Ri) za ortografsko kamero v smeri +y:
    lom zrak–steklo–tekočina v vodoravni ravnini (2D Snell)."""
    def lomi(d, n, eta):
        c = -(d[0] * n[0] + d[1] * n[1]); k = 1 - eta * eta * (1 - c * c)
        s = eta * c - math.sqrt(max(0.0, k))
        return (eta * d[0] + s * n[0], eta * d[1] + s * n[1])

    def sled(X):
        p = (X, -math.sqrt(Ro * Ro - X * X)); d = (0.0, 1.0)
        d = lomi(d, (p[0] / Ro, p[1] / Ro), 1 / ng)
        b = p[0] * d[0] + p[1] * d[1]; c = p[0] ** 2 + p[1] ** 2 - Ri * Ri
        t = -b - math.sqrt(max(0.0, b * b - c))
        p = (p[0] + t * d[0], p[1] + t * d[1])
        d = lomi(d, (p[0] / Ri, p[1] / Ri), ng / nw)
        return p[0] + (y - p[1]) / d[1] * d[0]
    lo, hi = -Ri * 0.98, Ri * 0.98
    for _ in range(60):
        m = (lo + hi) / 2
        (lo, hi) = (m, hi) if sled(m) < x else (lo, m)
    return (lo + hi) / 2


def kovine():
    """Okno 400 × 300 enot (kot risba), 0,8 enote/mm, kamera 8°; okni »dno« (dno posode s kovino, 3,2 enote/mm)
    in »lupa« (rob bata v brizgi, 4 enote/mm, kamera v višini osi)."""
    studio()
    bpy.context.view_layer.update()
    zb = "stalno"
    jeklo = kovina("jeklo", krtaceno=0.25)
    alu = kovina("aluminij", (0.78, 0.79, 0.80), 0.36)
    crna = snov("plastika-crna", (0.02, 0.02, 0.022), 0.4, zrnatost=0.2)
    emajl = snov("tisk-bel", (0.9, 0.9, 0.88), 0.5)
    # ---- erlenmajerica 100 mL: notranji profil in tabela V(h) kot pri titraciji
    FL = ERLENMAJERICE[100]
    R_, rv_, t_, Hc_ = FL["d"] / 2, FL["vrat"] / 2, FL["stena"], FL["stozec"]
    prof = [(R_ - t_ - 5, 0)] + [(R_ - t_ - 5 + 4.7 * math.cos(-math.pi / 2 + k * math.pi / 12), 5 + 4.7 * math.sin(-math.pi / 2 + k * math.pi / 12)) for k in range(1, 7)]
    prof += [(max(rv_ - t_, (R_ - (R_ - rv_) * h / Hc_) - t_), h) for h in range(6, 104)]
    VHb = prostornina(prof, 100.0, 0.5)
    Gb = visina_tabela(VHb, V_RAZ)
    rz = lambda z: R_ - (R_ - rv_) * z / Hc_
    erlenmajerica("bucka-prazna", 100, None, "bucka-prazna", (0, 0, 0))
    _, _, tek_b, dno_b = erlenmajerica("bucka-polna", 100, Gb, "bucka-polna", (0, 0, 0))
    erlenmajerica("lom-bucka", 100, Gb, "lom-bucka", (0, 0, 0))
    for zb_ in ("bucka-prazna", "bucka-polna"):
        for V in (50, 75):
            hh = next(h for h, v in VHb if v >= V) + dno_b
            oznake_vrtenine(f"bucka-crta{V}{zb_}", [(hh, rz(hh), 9.0)], emajl, zb_, (0, 0, 0), sredina=-math.pi / 2 - 0.55)
            napis_na_valju(f"bucka-st{V}{zb_}", str(V), rz(hh), hh + 0.4, emajl, velikost=3.4, zb=zb_, premik=(0, 0, 0), kot=-math.pi / 2 - 0.55 + 9.5 / rz(hh))
        napis_na_valju(f"bucka-napis{zb_}", "100 mL", rz(46), 46, emajl, velikost=4.2, zb=zb_, premik=(0, 0, 0), kot=-math.pi / 2 + 0.25)
    # ---- nizka čaša 100 mL (Ø 50 × 70 mm) s 50 mL
    C = CASA100
    Rc, tc = C["d"] / 2, C["stena"]
    Ri = Rc - tc
    zo = C["zaob"]
    profc = [(Ri - zo, 0)] + [(Ri - zo + (zo - 0.4) * math.cos(-math.pi / 2 + k * math.pi / 12), zo + (zo - 0.4) * math.sin(-math.pi / 2 + k * math.pi / 12)) for k in range(1, 7)]
    profc += [(Ri, C["h"] - 5 - C["dno"])]
    VHc = prostornina(profc, 60.0, 0.25)
    Gc = visina_tabela(VHc, V_RAZ)
    _, _, tek_c, dno_c = casa("casa-polna", Gc, "casa-polna", (0, 0, 0), mere=C)
    casa("lom-casa", Gc, "lom-casa", (0, 0, 0), mere=C)
    for V in (25, 50, 75):
        hh = dno_c + next(h for h, v in VHc if v >= V)
        oznake_vrtenine(f"casa-crta{V}", [(hh, Rc, 8.0 if V == 50 else 5.0)], emajl, "casa-polna", (0, 0, 0), sredina=-math.pi / 2 - 0.95)
        if V == 50:
            napis_na_valju("casa-st50", "50", Rc, hh + 0.4, emajl, velikost=3.0, zb="casa-polna", premik=(0, 0, 0), kot=-math.pi / 2 - 0.95 + 8.5 / Rc)
    napis_na_valju("casa-napis", "100 mL", Rc, 52, emajl, velikost=3.8, zb="casa-polna", premik=(0, 0, 0), kot=-math.pi / 2 + 0.35)
    lomno("lom-bucka"); lomno("lom-casa")
    # sloji debeline: tekočina (Beer–Lambert), sonda je bel izvor (tekočina pred njo jo obarva, za njo ne)
    for zb_, tek in (("deb-bucka-n", tek_b), ("deb-bucka-r", tek_b), ("deb-casa", tek_c)):
        telo(zb_ + "-telo", tek, LREF, zb_, (0, 0, 0))
    # ---- sonda termometra: v odprti bučki naslonjena na vrat spredaj, skozi zamašek, v čaši naslonjena na rob zadaj
    beli = svetilo("bel-izvor", (1, 1, 1), 1.0)
    kab = lambda a: [(a[0] - 10, a[1] + 4, a[2] + 30), (-40, 10, 280), (-90, 20, 330)]
    LN = ((4.0, -7.7, 105.0), "sonda-n", "deb-bucka-n")
    LR = ((3.5, 2.5, 120.0), "sonda-r", "deb-bucka-r")
    LC = ((3.0, 21.8, 69.0), "sonda-c", "deb-casa")
    for tocka, zb_, deb in (LN, LR, LC):
        d = [tocka[i] - SONDA_TOCKA[i] for i in range(3)]; L = math.sqrt(sum(c * c for c in d))
        kon = [SONDA_TOCKA[i] + (SONDA["dolzina"] + SONDA["rocaj"]) * d[i] / L for i in range(3)]
        sonda(zb_, zb_, SONDA_TOCKA, tocka, kab(kon))
        sonda(zb_ + "-deb", deb, SONDA_TOCKA, tocka, None, mat_sonda=beli)
    # ---- zamašek (guma, Ø 23/17,6 × 22 mm) s stekleno cevko Ø 6 mm in gumijasto cevjo do šobe brizge
    zz = 97.7
    vrtenina("zamasek", [(0, zz), (8.8, zz), (11.5, zz + 22), (0, zz + 22)], snov("cep-guma", (0.10, 0.10, 0.10), 0.7, zrnatost=0.3, merilo=1500), 48, "zamasek", (0, 0, 0))
    vrtenina("zam-cevka", [(2.0, 94.0), (3.0, 94.0), (3.0, 128.0), (2.0, 128.0), (2.0, 94.0)], steklo(), 32, "zamasek", (-4.0, -1.5, 0))
    ZB, X0 = BR["z"], BR["x0"]
    guma = snov("guma-rdeca", (0.42, 0.11, 0.07), 0.55, zrnatost=0.2)
    cev("zam-cev", [(-4.0, -1.5, 121.0), (-4.0, -1.5, 150.0), (2.0, -1.0, 178.0), (22.0, 0, 194.0), (50.0, 0, 195.5), (68.0, 0, ZB), (78.0, 0, ZB)], 4.0, guma, "zamasek")
    # ---- plinska brizga: valj, šoba, obročna prijemka na stojalu (lestvico nariše aplikacija)
    XE = X0 + BR["dolzina"]
    ri, ro = BR["ri"], BR["ro"]
    def os_x(o):
        o.rotation_euler = (0, math.radians(90), 0)
        return o
    os_x(vrtenina("brizga", [(1.0, 70.0), (2.6, 70.0), (2.6, 79.0), (6.0, X0 - 3), (ro - 2, X0 - 3), (ro, X0 - 1), (ro, XE - 0.6), (ro - 0.4, XE),
                             (ri + 0.4, XE), (ri, XE - 0.6), (ri, X0 + 0.6), (ri - 0.6, X0), (1.0, X0), (1.0, 70.0)], steklo(), 128, zb, (0, 0, ZB)))
    o1, o2 = BR["obroc"]
    os_x(vrtenina("prijemka", [(ro + 0.1, o1), (ro + 3.5, o1), (ro + 4, o1 + 0.5), (ro + 4, o2 - 0.5), (ro + 3.5, o2), (ro + 0.1, o2), (ro + 0.1, o1)], alu, 96, zb, (0, 0, ZB)))
    SX, SY = (o1 + o2) / 2, 75.0
    valj("prijemka-roka", 4.0, SY - ro - 3.0, alu, zb, (SX, ro + 3.0, ZB), os="y")
    kvader("st-plosca", 150, 100, 8, snov("podstavek-lak", (0.42, 0.46, 0.45), 0.45, zrnatost=0.45, merilo=900), zb, (SX, SY + 10, 0), posnetje=1.2)
    valj("st-palica", 5, 320, jeklo, zb, (SX, SY, 8), posnetje=1.0)
    kvader("st-mufa", 24, 24, 30, alu, zb, (SX, SY, ZB - 15), posnetje=2.5)
    valj("st-vijak", 4, 16, jeklo, zb, (SX - 28, SY, ZB), os="x")
    valj("st-krilo", 8, 4, crna, zb, (SX - 32, SY, ZB), os="x", posnetje=1)
    # ---- bat: v valju (V = 0), zunaj valja (V = 100, brez valja), na pultu (izpadel), za lupo (V = 50)
    # brušeno steklo bata: mlečno belo (sipanje na hrapavi površini), le delno prosojno
    brus = snov("bat-brus", (0.93, 0.94, 0.94), 0.55, prosojnost=0.55, ior=N_STEKLO)
    def bat(ime, zb_, xf, os_=(0, 0, ZB)):
        B = BAT
        o = vrtenina(ime, [(0, xf), (B["r"] - 0.5, xf), (B["r"], xf + 0.5), (B["r"], xf + B["dolzina"]), (B["rr"], xf + B["dolzina"]), (B["rr"], xf + B["dolzina"] + B["rocaj"] - 1),
                           (B["rr"] - 1, xf + B["dolzina"] + B["rocaj"]), (0, xf + B["dolzina"] + B["rocaj"])], brus, 96, zb_, os_)
        return os_x(o)
    bat("bat-noter", "bat-noter", X0)
    bat("bat-zunaj", "bat-zunaj", X0 + 100 * BR["mm_ml"])
    XC = X0 + 50 * BR["mm_ml"]
    bat("bat-lupa", "bat-lupa", XC)
    bat("bat-miza", "bat-miza", 225.0, (0, -70.0, BAT["r"]))
    # ---- kovina: bela kovina (barvo F0 doda aplikacija), za obe posodi in oba pogleda
    zv, zavoji = zvitek("kov-zvitek", kovina("kov-bela-gl", (1, 1, 1), 0.22), "kov-zvitek")
    trak("kov-trak", kovina("kov-bela-tr", (1, 1, 1), 0.3), "kov-trak")
    lege = zrnca_lege()
    mz = snov("kov-bela-zr", (1, 1, 1), 0.42, kovina=1.0, zrnatost=0.5, merilo=3000)
    for i, (x, y, r) in enumerate(lege):
        zrno(f"kov-zrno{i}", x, y, r, mz, "kov-zrnca", 100 + i)
    pp, rp, hp, Vp = prah_profil()
    prof_p = [(0, KOV["dno"])] + [(r, KOV["dno"] + z) for r, z in pp[:-1]] + [(0, KOV["dno"] + pp[-1][1])]
    kup = vrtenina("kov-prah", prof_p, snov("kov-bela-pr", (1, 1, 1), 0.65, kovina=1.0, zrnatost=1.2, merilo=9000), 64, "kov-prah", (KOV["x"], KOV["y"], 0))
    rnd = random.Random(3)
    for v in kup.data.vertices:
        if v.co.z > (KOV["dno"] + 0.2) * MM:
            v.co.x += rnd.uniform(-0.12, 0.12) * MM; v.co.y += rnd.uniform(-0.12, 0.12) * MM; v.co.z += rnd.uniform(-0.08, 0.08) * MM
    # sloji »id«: vrednost vzdolž traku (zvitek: vzdolž osi = vzdolž dolžine traku) ali po zrncih
    zv2 = zv.copy(); zv2.data = zv.data.copy(); M.zbirka("id-zvitek").objects.link(zv2)
    zv2.data.materials.clear(); zv2.data.materials.append(id_mat("id-zv", ZVITEK["x0"], ZVITEK["x1"]))
    tr = bpy.data.objects["kov-trak"]
    tr2 = tr.copy(); tr2.data = tr.data.copy(); M.zbirka("id-trak").objects.link(tr2)
    tr2.data.materials.clear(); tr2.data.materials.append(id_mat("id-tr", KOV["x"] - TRAK["L"] / 2, KOV["x"] + TRAK["L"] / 2))
    for i in range(len(lege)):
        o = bpy.data.objects[f"kov-zrno{i}"]
        o2 = o.copy(); o2.data = o.data.copy(); M.zbirka("id-zrnca").objects.link(o2)
        o2.data.materials.clear(); o2.data.materials.append(id_mat(f"id-z{i}", vrednost=ID_MAX * (i + 0.5) / len(lege)))
    # maske »mk-<oblika>«: bela kovina, ki sveti, za istim steklom z lomom na črnem ozadju. Kar na sliki kovine ni kovina
    # (črni robovi stekla pri popolnem odboju, ki ga lom brez odboja ne izriše, šum lovilca senc na pultu za dnom),
    # ima v maski 0; lab_izris s tem pomnoži alfo sloja kovine in sloj »id« (tam ozadje 1), da se izrez neopazno zlije.
    bel_mk = svetilo("mk-bela", (1, 1, 1), 1.0)
    for obl in ("zvitek", "trak", "zrnca", "prah"):
        for o in list(M.zbirka("kov-" + obl).objects):
            o2 = o.copy(); o2.data = o.data.copy(); M.zbirka("mk-" + obl).objects.link(o2)
            o2.data.materials.clear(); o2.data.materials.append(bel_mk)
    bpy.context.view_layer.update()

    # ---- pogledi in sloji
    P = Pogled("kovine", 400, 300, 0.8, (0, 0, 0), (50, 268), visina=8.0)
    D = Pogled("dno", 150, 92, 3.2, (KOV["x"], KOV["y"], KOV["dno"]), (75, 70), visina=8.0)
    Lp = Pogled("lupa", 236, 80, 4.0, (XC, 0, ZB - 2), (118, 40), visina=0.0)
    pr, pd, pl = P.projekcija, D.projekcija, Lp.projekcija
    osn = ["studio", "pult", "stalno"]

    def okvir(Pg, x0, z0, x1, z1, y0=0.0, y1=0.0, rob=2):
        a, b = Pg.projekcija((x0, y1, z1)), Pg.projekcija((x1, y0, z0))
        return (max(0, math.floor(a[0] - rob)), max(0, math.floor(a[1] - rob)), min(Pg.W, math.ceil(b[0] + rob)), min(Pg.H, math.ceil(b[1] + rob)))
    ok_p = (0, 0, math.ceil(pr((100, 0, 0))[0]), P.H)                   # posoda, sence, sonda, kabel, cev do šobe
    ok_k = okvir(P, -32, -2, 32, 24, -24, 10)                            # kovina na dnu (z lomom do ±1,3×)
    ok_bn = okvir(P, X0 - 4, ZB - ro - 2, XE + 1, ZB + ro + 2, -ro, ro)
    ok_bz = okvir(P, XE - 1, ZB - ro - 2, X0 + 100 * BR["mm_ml"] + BAT["dolzina"] + BAT["rocaj"] + 2, ZB + ro + 2, -ro, ro)
    sloji = [
        dict(ime="kovine", pogled=P, vidno=osn),
        dict(ime="k-bucka", pogled=P, vidno=osn + ["bucka-prazna"], izrez=ok_p),
        dict(ime="k-bucka-polna", pogled=P, vidno=osn + ["bucka-polna", "sonda-n"], izrez=ok_p),
        dict(ime="k-bucka-polna-debelina", pogled=P, vidno=["deb-bucka-n"], vrsta="debelina", izrez=ok_p),
        dict(ime="k-bucka-zamasek", pogled=P, vidno=osn + ["bucka-polna", "sonda-r", "zamasek"], izrez=ok_p),
        dict(ime="k-bucka-zamasek-debelina", pogled=P, vidno=["deb-bucka-r"], vrsta="debelina", izrez=ok_p),
        dict(ime="k-casa", pogled=P, vidno=osn + ["casa-polna", "sonda-c"], izrez=ok_p),
        dict(ime="k-casa-debelina", pogled=P, vidno=["deb-casa"], vrsta="debelina", izrez=ok_p),
        dict(ime="k-bat-noter", pogled=P, vidno=osn + ["bat-noter"], izrez=ok_bn),
        dict(ime="k-bat-zunaj", pogled=P, vidno=["studio", "bat-zunaj"], vrsta="prosojno", izrez=ok_bz),
        dict(ime="k-bat-miza", pogled=P, vidno=["studio", "bat-miza"], lovilci=["pult", "stalno"], vrsta="prosojno", izrez=okvir_predmetov(P, ["bat-miza"], 8)),
        dict(ime="dno-bucka", pogled=D, vidno=osn + ["bucka-polna", "sonda-n"]),
        dict(ime="dno-bucka-debelina", pogled=D, vidno=["deb-bucka-n"], vrsta="debelina"),
        dict(ime="dno-bucka-z", pogled=D, vidno=osn + ["bucka-polna", "sonda-r", "zamasek"]),
        dict(ime="dno-bucka-z-debelina", pogled=D, vidno=["deb-bucka-r"], vrsta="debelina"),
        dict(ime="dno-casa", pogled=D, vidno=osn + ["casa-polna", "sonda-c"]),
        dict(ime="dno-casa-debelina", pogled=D, vidno=["deb-casa"], vrsta="debelina"),
        dict(ime="lupa", pogled=Lp, vidno=osn),
        dict(ime="lupa-bat", pogled=Lp, vidno=osn + ["bat-lupa"]),
    ]
    for pos in ("bucka", "casa"):
        for obl in ("zvitek", "trak", "zrnca", "prah"):
            for Pg, pre, ok in ((P, "k", ok_k), (D, "dno", None)):
                mk = ["lom-" + pos, "mk-" + obl]
                sl = dict(ime=f"{pre}-{pos}-{obl}", pogled=Pg, vidno=["studio", "lom-" + pos, "kov-" + obl], lovilci=["pult"], vrsta="prosojno", prozornoSteklo=True, maska=mk)
                if ok:
                    sl["izrez"] = ok
                sloji.append(sl)
                if obl != "prah":
                    sl2 = dict(ime=f"{pre}-{pos}-{obl}-id", pogled=Pg, vidno=["lom-" + pos, "id-" + obl], vrsta="debelina", maska=mk)
                    if ok:
                        sl2["izrez"] = ok
                    sloji.append(sl2)

    # sidra
    fi = lambda Pg, x, f: Pg.projekcija((x, -ro * math.cos(math.radians(f)), ZB + ro * math.sin(math.radians(f))))[1]
    crte = lambda Pg, x: dict(spodaj=fi(Pg, x, -40), kratka=fi(Pg, x, -29), srednja=fi(Pg, x, -24), dolga=fi(Pg, x, -16), stevilke=fi(Pg, x, -7))
    # mehurčki: navidezni obseg kovine (lom v posodi, vodoravno) in vrh kovine nad notranjim dnom
    obseg = {}
    vis = dict(zvitek=2 * ZVITEK["R"] + ZVITEK["d"], trak=TRAK["lok"] + TRAK["d"], zrnca=ZRNCA["d"] * 0.95, prah=hp)
    pol = dict(zvitek=(ZVITEK["x0"] - 1.5, ZVITEK["x1"] + 1.5), trak=(-TRAK["L"] / 2, TRAK["L"] / 2), zrnca=(-13.5, 13.5), prah=(-rp, rp))
    for pos, (Ro_, Ri_) in (("bucka", (31.2, 30.0)), ("casa", (Rc, Ri))):
        for obl in pol:
            for ime, Pg in (("k", P), ("dno", D)):
                a = videz_x(pol[obl][0], KOV["y"], Ro_, Ri_); b = videz_x(pol[obl][1], KOV["y"], Ro_, Ri_)
                obseg[f"{ime}-{pos}-{obl}"] = [Pg.projekcija((a, 0, 0))[0], Pg.projekcija((b, 0, 0))[0], Pg.projekcija((KOV["x"], KOV["y"], KOV["dno"] + vis[obl]))[1]]
    meta = dict(
        poskus="kovine",
        sidra={
            "kovine": dict(pult=pr((0, 0, 0))[1], os=pr((0, 0, 0))[0], merilo50=[pr((0, 0, 0))[0], pr((50, 0, 0))[0]],
                           buckaDno=pr((0, 0, dno_b))[1], buckaVrh=pr((0, 0, FL["h"]))[1], casaDno=pr((0, 0, dno_c))[1], casaVrh=pr((0, 0, C["h"]))[1],
                           kovina=pr((KOV["x"], KOV["y"], KOV["dno"])), vrat=pr((rv_ + 1, 0, FL["h"])),
                           brizga=dict(x0=pr((X0, 0, ZB))[0], x100=pr((X0 + 100 * BR["mm_ml"], 0, ZB))[0], obroc=pr((o1, 0, ZB))[0], konec=pr((XE, 0, ZB))[0],
                                       os=pr((X0, 0, ZB))[1], vrh=pr((X0, 0, ZB + ro))[1], dno=pr((X0, -ro, ZB - ro))[1], crte=crte(P, X0))),
            "dno": dict(os=pd((0, 0, 0))[0], buckaDno=pd((0, 0, dno_b))[1], casaDno=pd((0, 0, dno_c))[1], kovina=pd((KOV["x"], KOV["y"], KOV["dno"]))),
            "lupa": dict(sredina=pl((XC, 0, ZB))[0], crte=crte(Lp, XC), vrh=pl((XC, -ro, ZB + ro))[1]),
        },
        merila=dict(kovine=0.8, dno=3.2, lupa=4.0, vodoravno=dict(kovine=round(P.s, 5), dno=round(D.s, 5), lupa=round(Lp.s, 5)), visinaKamere=dict(kovine=8, dno=8, lupa=0)),
        bucka=dict(visina=FL["h"], premer=FL["d"], dno=dno_b, VodH=VHb, gladinaMm=round(Gb, 3), V=V_RAZ, lref=LREF,
                   polmer=[[h, round(max(rv_ - t_, (R_ - (R_ - rv_) * h / Hc_) - t_), 2)] for h in range(0, 106, 5)], notranjiPolmer=round(R_ - t_, 2)),
        casa=dict(visina=C["h"], premer=C["d"], stena=tc, dno=dno_c, VodH=VHc, gladinaMm=round(Gc, 3), V=V_RAZ, lref=LREF, notranjiPolmer=round(Ri, 2)),
        brizga=dict(mmNaML=BR["mm_ml"], notranji=round(2 * ri, 2), zunanji=2 * ro, dolzina=BR["dolzina"], izpadeML=round(BR["dolzina"] / BR["mm_ml"], 1),
                    bat=dict(BAT), obroc=list(BR["obroc"]), x0=X0),
        kovina=dict(sredina=[KOV["x"], KOV["y"]], dno=KOV["dno"], idMax=ID_MAX, obseg=obseg,
                    zvitek=dict(ZVITEK, zavoji=round(zavoji, 3)), trak=dict(TRAK), zrnca=dict(ZRNCA, lege=[[round(x, 2), round(y, 2), round(r, 3)] for x, y, r in lege]),
                    prah=dict(PRAH, V=round(Vp, 1), polmer=round(rp, 3), visina=round(hp, 3))),
        sonda=dict(SONDA, konica=list(SONDA_TOCKA)),
        optika=dict(nSteklo=N_STEKLO, nVoda=N_VODA, kapilarnaMm=KAPILARNA),
    )
    return dict(pogledi=[P, D, Lp], sloji=sloji, meta=meta)


def visina_tabela(VH, V):
    for (h0, v0), (h1, v1) in zip(VH, VH[1:]):
        if v1 >= V:
            return h0 + (h1 - h0) * (V - v0) / (v1 - v0 or 1)
    return VH[-1][0]

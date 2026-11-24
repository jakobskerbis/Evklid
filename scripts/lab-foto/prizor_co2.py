# Fotorealistični laboratorij: prizor poskusa lab-co2 (soda bikarbona in kislina, dokaz CO₂). Registriran v
# lab_prizori.PRIZORI. Na pultu: tehtnica z berljivostjo 0,01 g (zaslon LCD spredaj), na njej erlenmajerica 100 mL
# (ISO 1773), gumijast zamašek z ukrivljeno stekleno cevko (Ø 6/4 mm) v epruveto 16 × 160 mm z 10 mL apnice v bukovem
# stojalu, zamašek brez cevke, kupček sode bikarbone, gorečo trsko in laboratorijsko štoparico (zaslon LCD).
# Iz modela (public/sim/lab-model.js Co2Bench, public/sim/foto-co2.js) so: gladina in barva tekočine, višina pene,
# masa sode na dnu (velikost kupčka), motnost apnice (CaCO₃), mehurčki, odčitka tehtnice in štoparice, plamen ali
# tleča trska z dimom; v izrisu so tekočine brezbarvne, zasloni prazni, plamena ni.
import math
import bpy
import mathutils
from lab_prizori import *  # noqa: F401,F403  (Pogled, studio, telo, prostornina, okvir_predmetov, material_debeline, modeli)
import lab_modeli as M

PAN_Z = 79.5           # vrh tehtalne plošče (mm nad pultom)
TEHTNICA = dict(sirina=160.0, globina=220.0, visina=68.0, noge=4.0, plosca=120.0)   # ocena (šolska tehtnica 0,01 g / 300 g)
LCD_T = (56.0, 18.0)   # okno zaslona tehtnice [mm]
LCD_S = (50.0, 20.0)   # okno zaslona štoparice [mm]
ZAMASEK = dict(spodaj=17.0, zgoraj=22.0, visina=25.0)   # gumijast zamašek (stožčast), v vratu Ø 19,4 mm sedi 12 mm globoko
CEVKA = dict(zunaj=6.0, znotraj=4.0, z_vodoravno=245.0, polmer_kolena=15.0, nad_dnom=12.0)   # steklena cevka Ø 6/4 mm
V_APNICA = 10.0        # mL apnice v epruveti (APNICA.V v lab-model.js)
V_POLNA = 106.0        # mL v »polni« bučki (model: do 100 mL nalite tekočine; izrez nad gladino iz modela je odrezan)
SODA = dict(masa=5.0, gostota=1.1, nasip=38.0)   # kupček 5 g (največ v poskusu), nasipna gostota 1,1 g/mL, nasipni kot ~38° (ocena)
TRSKA = dict(sirina=5.0, debelina=1.8, dolzina=150.0, kot=28.0, konica=(-2.0, 0.0, 172.0))
TX = 140.0             # os epruvete (x, mm)


def pena_mat():
    """Pena (mehurčki CO₂ v tekočini, ~85 % plina): bela, rahlo prosojna, relief celic (Voronoi, ~2 mm)."""
    m = bpy.data.materials.get("pena")
    if m:
        return m
    m, nt, out = M._mat("pena")
    p = nt.nodes.new("ShaderNodeBsdfPrincipled")
    M._nastavi(p, **{"Base Color": (0.93, 0.93, 0.90, 1), "Roughness": 0.22, "Subsurface Weight": 0.55, "Subsurface Scale": 0.0015, "Coat Weight": 0.35})
    tc = nt.nodes.new("ShaderNodeTexCoord")
    # dve velikosti mehurčkov (~4 mm in ~1,5 mm); stene celic so sivkaste (lom svetlobe v tankih opnah)
    v1 = nt.nodes.new("ShaderNodeTexVoronoi"); v1.feature = "DISTANCE_TO_EDGE"; v1.inputs["Scale"].default_value = 260.0
    v2 = nt.nodes.new("ShaderNodeTexVoronoi"); v2.feature = "DISTANCE_TO_EDGE"; v2.inputs["Scale"].default_value = 700.0
    for v in (v1, v2):
        nt.links.new(tc.outputs["Object"], v.inputs["Vector"])
    mn = nt.nodes.new("ShaderNodeMath"); mn.operation = "MINIMUM"
    k2 = nt.nodes.new("ShaderNodeMath"); k2.operation = "MULTIPLY"; k2.inputs[1].default_value = 1.6
    nt.links.new(v2.outputs["Distance"], k2.inputs[0]); nt.links.new(v1.outputs["Distance"], mn.inputs[0]); nt.links.new(k2.outputs[0], mn.inputs[1])
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.0; ramp.color_ramp.elements[0].color = (0.50, 0.52, 0.52, 1)
    ramp.color_ramp.elements[1].position = 0.09; ramp.color_ramp.elements[1].color = (0.94, 0.94, 0.91, 1)
    nt.links.new(mn.outputs[0], ramp.inputs["Fac"]); nt.links.new(ramp.outputs["Color"], p.inputs["Base Color"])
    bu = nt.nodes.new("ShaderNodeBump"); bu.inputs["Strength"].default_value = 0.5; bu.inputs["Distance"].default_value = 0.0005
    nt.links.new(mn.outputs[0], bu.inputs["Height"])
    nt.links.new(bu.outputs[0], p.inputs["Normal"]); nt.links.new(p.outputs[0], out.inputs["Surface"])
    return m


def steklo_senca():
    """Steklo, ki senčnih žarkov ne ustavi (Light Path »Is Shadow Ray« → prozorno): pena za steklom je osvetljena
    neposredno kot v resnici (sicer bi jo v Cycles osvetljevale le kavstike skozi steklo in bila bi siva)."""
    m = bpy.data.materials.get("steklo-senca")
    if m:
        return m
    m, nt, out = M._mat("steklo-senca")
    g = nt.nodes.new("ShaderNodeBsdfGlass"); M._nastavi(g, Roughness=0.0, IOR=N_STEKLO)
    t = nt.nodes.new("ShaderNodeBsdfTransparent")
    lp = nt.nodes.new("ShaderNodeLightPath"); mx = nt.nodes.new("ShaderNodeMixShader")
    nt.links.new(lp.outputs["Is Shadow Ray"], mx.inputs[0]); nt.links.new(g.outputs[0], mx.inputs[1]); nt.links.new(t.outputs[0], mx.inputs[2])
    nt.links.new(mx.outputs[0], out.inputs["Surface"])
    return m


def usmerjen(o, zacetek, smer):
    o.location = [v * MM for v in zacetek]
    o.rotation_euler = mathutils.Vector(smer).to_track_quat("Z", "Y").to_euler()
    return o


def lok(c, r, a0, a1, n=10):
    """Točke loka v ravnini xz: središče c (x, z), polmer r, kota a0 → a1 [rad]."""
    return [(c[0] + r * math.cos(a0 + (a1 - a0) * k / n), 0.0, c[1] + r * math.sin(a0 + (a1 - a0) * k / n)) for k in range(n + 1)]


def tehtnica(zb):
    T = TEHTNICA
    fy = 30 - T["globina"] / 2   # sprednja ploskev ohišja
    ohisje = snov("tehtnica-ohisje", (0.86, 0.87, 0.88), 0.42, zrnatost=0.2, merilo=700)
    kvader("teh-ohisje", T["sirina"], T["globina"], T["visina"], ohisje, zb, (0, 30, T["noge"]), posnetje=6)
    for sx in (-1, 1):
        for sy in (-1, 1):
            valj(f"teh-noga{sx}{sy}", 6, T["noge"], snov("guma", (0.025, 0.025, 0.028), 0.75), zb, (sx * 65, 30 + sy * 90, 0))
    zv = T["noge"] + T["visina"]
    jeklo = kovina("nerjavno", (0.74, 0.75, 0.76), 0.2)
    valj("teh-nosilec", 10, PAN_Z - 1.5 - zv, jeklo, zb, (0, 0, zv))
    vrtenina("teh-plosca", [(0, 0), (59, 0), (60, 0.8), (60, 2.5), (59.4, 2.6), (59.2, 1.5), (0, 1.5)], jeklo, 128, zb, (0, 0, PAN_Z - 1.5))
    # sprednja plošča: zaslon levo, tipki desno, napis z berljivostjo in obremenitvijo
    kvader("teh-plosca-spredaj", 140, 1.2, 36, snov("teh-panel", (0.12, 0.13, 0.15), 0.4, zrnatost=0.15), zb, (0, fy - 0.6, 17), posnetje=0.4)
    LX, LZ = -32.0, 25.0
    kvader("teh-okvir", LCD_T[0] + 6, 0.8, LCD_T[1] + 6, snov("dmm-okvir", (0.01, 0.01, 0.012), 0.2), zb, (LX, fy - 1.4, LZ - 3), posnetje=0.2)
    kvader("teh-lcd", LCD_T[0], 0.4, LCD_T[1], snov("lcd", (0.52, 0.57, 0.50), 0.25, lak=0.5), zb, (LX, fy - 1.9, LZ))
    lcd = [(LX - LCD_T[0] / 2, fy - 2.15, LZ + LCD_T[1]), (LX + LCD_T[0] / 2, fy - 2.15, LZ + LCD_T[1]), (LX - LCD_T[0] / 2, fy - 2.15, LZ)]
    tisk = snov("tisk-bel", (0.9, 0.9, 0.88), 0.5)
    for k, n in enumerate(("TARE", "ON/OFF")):
        bx = 26 + 26 * k
        valj(f"teh-tipka{k}", 6.0, 2.5, snov("teh-tipka", (0.70, 0.72, 0.74), 0.35), zb, (bx, fy - 1.2 - 2.5, 38), os="y", posnetje=0.8, n=32)
        napis_na_valju(f"teh-n{k}", n, 0, 27, tisk, velikost=3.2, zb=zb, premik=(bx, fy - 1.25, 0), plosko=True)
    napis_na_valju("teh-spec", "Max 300 g   d = 0,01 g", 0, 48.5, tisk, velikost=3.0, zb=zb, premik=(LX, fy - 1.25, 0), plosko=True)
    return lcd, fy


def stoparica(zb, x, y):
    """Laboratorijska štoparica s stojalom (ocena: 66 × 20 × 72 mm), zaslon LCD zgoraj, tri tipke."""
    bel = snov("stoparica", (0.90, 0.90, 0.88), 0.35, zrnatost=0.15, merilo=800)
    kvader("st-telo", 66, 20, 72, bel, zb, (x, y, 0), posnetje=5)
    fy = y - 10
    LZ = 38.0
    kvader("st-okvir", LCD_S[0] + 6, 0.8, LCD_S[1] + 6, snov("dmm-okvir", (0.01, 0.01, 0.012), 0.2), zb, (x, fy - 0.4, LZ - 3), posnetje=0.3)
    kvader("st-lcd", LCD_S[0], 0.4, LCD_S[1], snov("lcd", (0.52, 0.57, 0.50), 0.25, lak=0.5), zb, (x, fy - 0.9, LZ))
    lcd = [(x - LCD_S[0] / 2, fy - 1.15, LZ + LCD_S[1]), (x + LCD_S[0] / 2, fy - 1.15, LZ + LCD_S[1]), (x - LCD_S[0] / 2, fy - 1.15, LZ)]
    tisk = snov("tisk-siv", (0.25, 0.26, 0.28), 0.5)
    for k, (n, b) in enumerate((("MIN", (0.55, 0.57, 0.6)), ("START", (0.15, 0.45, 0.25)), ("SEC", (0.55, 0.57, 0.6)))):
        bx = x - 20 + 20 * k
        valj(f"st-tipka{k}", 5.0, 2.0, snov(f"st-tipka{k}", b, 0.35), zb, (bx, fy - 2.0, 20), os="y", posnetje=0.7, n=32)
        napis_na_valju(f"st-n{k}", n, 0, 11, tisk, velikost=2.8, zb=zb, premik=(bx, fy - 0.05, 0), plosko=True)
    return lcd


def co2():
    """Okno 400 × 300 enot (kot risba), 1,0 enote/mm, kamera 8° nad vodoravnico. Sloji: osnova (prazna bučka brez
    zamaška, apnica bistra, brez trske), polna bučka (106 mL) in debelina, pena, kupček sode (prosojno), zamašek s cevko
    (izrez nad vratom) in epruveta s cevko, zamašek brez cevke, debelina apnice, trska (prosojno)."""
    studio()
    bpy.context.view_layer.update()
    zb = "stalno"
    lcd_t, fy_t = tehtnica(zb)
    lcd_s = stoparica(zb, -140.0, -20.0)
    # ---- stojalo z epruveto (bukev, kot pri lab-ph), epruveta v levi luknji, 10 mL apnice (polkroglasto dno + valj)
    RX = TX + 17
    bukev = les()
    kvader("rs-dno", 70, 45, 10, bukev, zb, (RX, 0, 0), posnetje=1.0)
    deska_z_luknjami("rs-vrh", 70, 45, 8, [(-17, 0), (17, 0)], 9.6, bukev, zb, (RX, 0, 70))
    for sx in (-1, 1):
        kvader(f"rs-bok{sx}", 8, 45, 60, bukev, zb, (RX + sx * 31, 0, 10), posnetje=0.8)
    ri = EPRUVETA["d"] / 2 - EPRUVETA["stena"]
    G = ri + (V_APNICA * 1000 - 2 / 3 * math.pi * ri ** 3) / (math.pi * ri ** 2)
    _, _, tek_e, dno_e = epruveta("ep", G, "epruveta", (TX, 0, 10))
    LREF_E = EPRUVETA["d"] - 2 * EPRUVETA["stena"]
    telo("ep-telo", tek_e, LREF_E, "debelina-epruveta", (TX, 0, 10))
    # ---- erlenmajerica 100 mL na tehtnici: prazna, polna (106 mL), s peno; oznake kot pri titraciji
    FL = ERLENMAJERICE[100]
    R_, rv_, t_, Hc_ = FL["d"] / 2, FL["vrat"] / 2, FL["stena"], FL["stozec"]
    prof = [(R_ - t_ - 5, 0)] + [(R_ - t_ - 5 + 4.7 * math.cos(-math.pi / 2 + k * math.pi / 12), 5 + 4.7 * math.sin(-math.pi / 2 + k * math.pi / 12)) for k in range(1, 7)]
    prof += [(max(rv_ - t_, (R_ - (R_ - rv_) * h / Hc_) - t_), h) for h in range(6, 104)]
    VH = prostornina(prof, 101.0, 0.5)
    GL = next(h for h, v in VH if v >= V_POLNA)
    erlenmajerica("bucka-prazna", 100, None, "bucka-prazna", (0, 0, PAN_Z))
    _, _, tek, dno = erlenmajerica("bucka-polna", 100, GL, "bucka-polna", (0, 0, PAN_Z))
    LREF = 40.0
    telo("bucka-telo", tek, LREF, "debelina-bucka", (0, 0, PAN_Z))
    bp = erlenmajerica("bucka-pena", 100, None, "bucka-pena", (0, 0, PAN_Z))[0]
    bp.data.materials[0] = steklo_senca()
    # pena: telo notranjosti od dna do 2 mm pod robom, 0,25 mm od stekla
    H_PENA = FL["h"] - 2 - dno
    pp = [(0, dno + 0.25), (R_ - t_ - 5, dno + 0.25)] + [(R_ - t_ - 5 + 4.45 * math.cos(-math.pi / 2 + k * math.pi / 12), dno + 5 + 4.45 * math.sin(-math.pi / 2 + k * math.pi / 12)) for k in range(1, 7)]
    pp += [(max(rv_ - t_, (R_ - (R_ - rv_) * h / Hc_) - t_) - 0.25, dno + h) for h in range(6, int(H_PENA))] + [(0, dno + int(H_PENA) - 1)]
    vrtenina("pena", pp, pena_mat(), 96, "bucka-pena", (0, 0, PAN_Z))
    emajl = snov("tisk-bel", (0.9, 0.9, 0.88), 0.5)
    rz = lambda z: R_ - (R_ - rv_) * z / Hc_
    for zb_ in ("bucka-prazna", "bucka-polna", "bucka-pena"):
        for V in (50, 75):
            hh = next(h for h, v in VH if v >= V) + dno
            oznake_vrtenine(f"bucka-crta{V}{zb_}", [(hh, rz(hh), 9.0)], emajl, zb_, (0, 0, PAN_Z), sredina=-math.pi / 2 - 0.55)
            napis_na_valju(f"bucka-st{V}{zb_}", str(V), rz(hh), hh + 0.4, emajl, velikost=3.4, zb=zb_, premik=(0, 0, PAN_Z), kot=-math.pi / 2 - 0.55 + 9.5 / rz(hh))
        napis_na_valju(f"bucka-napis{zb_}", "100 mL", rz(46), 46, emajl, velikost=4.2, zb=zb_, premik=(0, 0, PAN_Z), kot=-math.pi / 2 + 0.25)
    # ---- kupček sode (5 g; aplikacija ga pomanjša na maso iz modela: merilo (m/5 g)^(1/3) okoli središča dna)
    S = SODA
    Vs = S["masa"] / S["gostota"] * 1000
    tg = math.tan(math.radians(S["nasip"]))
    rs = (3 * Vs / (math.pi * tg)) ** (1 / 3)
    hs = rs * tg
    zs = PAN_Z + dno
    stozec = lambda u: hs * (1 - u) if u >= 0.2 else hs * (0.9 - u * u / 0.4)   # stožec, vrh zaobljen (zvezen nagib)
    vrh = [(rs * (1 - k / 16), 0.02 + stozec(1 - k / 16)) for k in range(17)]
    soda = snov("soda-bela", (0.94, 0.94, 0.93), 0.75, zrnatost=0.8, merilo=2200)
    vrtenina("soda", [(0, 0.02)] + vrh, soda, 64, "soda", (0, 0, zs))
    # ---- zamašek s cevko in brez nje; cevka do 12 mm nad notranjim dnom epruvete
    Z = ZAMASEK
    z_rob = PAN_Z + FL["h"]
    globina = (FL["vrat"] - 2 * t_ - Z["spodaj"]) / (Z["zgoraj"] - Z["spodaj"]) * Z["visina"]
    z_zam = z_rob - globina
    guma = snov("guma-zamasek", (0.32, 0.13, 0.08), 0.65, zrnatost=0.3, merilo=1500)
    rs0, rs1, hz = Z["spodaj"] / 2, Z["zgoraj"] / 2, Z["visina"]
    C = CEVKA
    rc = C["zunaj"] / 2 + 0.05
    vrtenina("zamasek-cevka", [(rc, 0), (rs0 - 0.3, 0), (rs0, 0.4), (rs1, hz - 0.4), (rs1 - 0.4, hz), (rc, hz), (rc, 0)], guma, 96, "cevka", (0, 0, z_zam))
    vrtenina("zamasek-poln", [(0, 0), (rs0 - 0.3, 0), (rs0, 0.4), (rs1, hz - 0.4), (rs1 - 0.4, hz), (0, hz)], guma, 96, "zaprto", (0, 0, z_zam))
    zv, Rb = C["z_vodoravno"], C["polmer_kolena"]
    z_konica = 10 + dno_e + C["nad_dnom"]
    pot = [(0.0, 0.0, z_zam - 1.0)] + lok((Rb, zv - Rb), Rb, math.pi, math.pi / 2, 12) + lok((TX - Rb, zv - Rb), Rb, math.pi / 2, 0, 12) + [(TX, 0.0, z_konica)]
    cev("cevka-steklo", pot, C["zunaj"] / 2, steklo(), "cevka", n=24, gladke=False)
    notr = [(0.0, 0.0, z_zam - 0.7)] + pot[1:-1] + [(TX, 0.0, z_konica + 0.3)]
    cev("cevka-notranjost", notr, C["znotraj"] / 2, steklo("zrak-v-cevki", 1.0 / N_STEKLO), "cevka", n=24, gladke=False)
    # ---- trska: konica 13 mm pod robom vratu, nagnjena 28° v desno, ročaj zunaj okna (roke ni)
    T = TRSKA
    a = math.radians(T["kot"])
    smer = (math.sin(a), 0.0, math.cos(a))
    trska = les("les-trska", svetla=(0.80, 0.66, 0.45), temna=(0.70, 0.55, 0.36))
    usmerjen(kvader("trska", T["debelina"], T["sirina"], T["dolzina"], trska, "trska"), T["konica"], smer)
    usmerjen(kvader("trska-oglje", T["debelina"] + 0.1, T["sirina"] + 0.1, 9, snov("oglje", (0.03, 0.025, 0.02), 0.8, zrnatost=0.6, merilo=3000), "trska"), T["konica"], smer)
    bpy.context.view_layer.update()

    # ---- pogled in sloji
    P = Pogled("co2", 400, 300, 1.0, (0, 0, 0), (192, 276), visina=8.0)
    pr = P.projekcija
    osn = ["studio", "pult", "stalno", "epruveta"]

    def okvir(x0, z0, x1, z1, y=0.0, rob=3):
        a_, b_ = pr((x0, y, z1)), pr((x1, -y, z0))
        return (max(0, math.floor(a_[0] - rob)), max(0, math.floor(a_[1] - rob)), min(P.W, math.ceil(b_[0] + rob)), min(P.H, math.ceil(b_[1] + rob)))
    ok_b = okvir(-R_ - 2, PAN_Z - 1, R_ + 2, z_rob + 2, y=R_)
    ok_e = okvir(TX - 11, 8, TX + 11, 172, y=9)
    ok_c = okvir(-14, z_zam - 1, TX + 10, zv + 6, y=12)
    ok_z = okvir(-14, z_zam - 1, 14, z_zam + hz + 2, y=12)
    sloji = [
        dict(ime="co2", pogled=P, vidno=osn + ["bucka-prazna"]),
        dict(ime="co2-bucka-polna", pogled=P, vidno=osn + ["bucka-polna"], izrez=ok_b),
        dict(ime="co2-bucka-debelina", pogled=P, vidno=["debelina-bucka"], vrsta="debelina", izrez=ok_b),
        dict(ime="co2-pena", pogled=P, vidno=osn + ["bucka-pena"], izrez=ok_b),
        dict(ime="co2-soda", pogled=P, vidno=["studio", "soda"], vrsta="prosojno", izrez=okvir_predmetov(P, ["soda"], 4)),
        dict(ime="co2-cevka", pogled=P, vidno=osn + ["bucka-prazna", "cevka"], izrez=ok_c),
        dict(ime="co2-ep-cevka", pogled=P, vidno=osn + ["bucka-prazna", "cevka"], izrez=ok_e),
        dict(ime="co2-ep-debelina", pogled=P, vidno=["debelina-epruveta"], vrsta="debelina", izrez=ok_e),
        dict(ime="co2-zaprto", pogled=P, vidno=osn + ["bucka-prazna", "zaprto"], izrez=ok_z),
        dict(ime="co2-trska", pogled=P, vidno=["studio", "trska"], lovilci=["pult", "stalno"], vrsta="prosojno", izrez=okvir_predmetov(P, ["trska"], 6)),
    ]
    meta = dict(
        poskus="co2",
        sidra={"co2": dict(
            pult=pr((0, 0, 0))[1], merilo20=[pr((0, 0, 0))[0], pr((20, 0, 0))[0]],
            buckaDno=pr((0, 0, PAN_Z + dno)), buckaVrh=pr((0, 0, z_rob)), zamasek=pr((0, 0, z_zam)),
            tehtnica=pr((0, fy_t, 0)), stoparica=pr((-140.0, -30.0, 0)), lcdTehtnica=[pr(t) for t in lcd_t], lcdStoparica=[pr(t) for t in lcd_s],
            epruveta=pr((TX, 0, 10)), epruvetaDno=pr((TX, 0, 10 + dno_e))[1], epruvetaGladina=pr((TX, 0, 10 + dno_e + G))[1], epruvetaVrh=pr((TX, 0, 170))[1],
            cevkaKonica=pr((TX, 0, z_konica)), koleno=pr((TX, 0, zv)), trska=pr(T["konica"]),
            trskaSmer=[round(pr((T["konica"][0] + smer[0] * 10, 0, T["konica"][2] + smer[2] * 10))[k] - pr(T["konica"])[k], 3) for k in (0, 1)])},
        merila=dict(co2=1.0, vodoravno=round(P.s, 5), visinaKamere=dict(co2=8)),
        bucka=dict(V=100, dno=dno, visina=FL["h"], stena=t_, polnaMm=round(GL, 2), Vpolna=V_POLNA, lref=LREF, VodH=VH, penaMm=int(H_PENA) - 1,
                   polmer=[[h, round(max(rv_ - t_, (R_ - (R_ - rv_) * h / Hc_) - t_), 2)] for h in range(0, 106, 5)]),
        epruveta=dict(premer=EPRUVETA["d"], dolzina=EPRUVETA["l"], stena=EPRUVETA["stena"], dno=dno_e, gladinaMm=round(G, 3), V=V_APNICA, lref=LREF_E),
        tehtnica=dict(TEHTNICA, panZ=PAN_Z), zasloni=dict(tehtnica=list(LCD_T), stoparica=list(LCD_S)),
        zamasek=dict(ZAMASEK, globina=round(globina, 2)), cevka=dict(CEVKA, konicaMm=round(z_konica - 10 - dno_e, 2)),
        soda=dict(SODA, polmer=round(rs, 2), visina=round(hs, 2)), trska=dict(TRSKA),
        optika=dict(nSteklo=N_STEKLO, nVoda=N_VODA, kapilarnaMm=KAPILARNA),
    )
    return dict(pogledi=[P], sloji=sloji, meta=meta)

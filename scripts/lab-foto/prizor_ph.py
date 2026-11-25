# Fotorealistični laboratorij: prizor poskusa lab-ph (pH snovi iz gospodinjstva). Registriran v lab_prizori.PRIZORI.
# Na pultu: stojalce z epruveto 16 × 160 mm (izvleček rdečega zelja), trak univerzalnega indikatorskega papirja v
# sponki, nizka čaša 250 mL s 100 mL vzorca, držalo elektrode s pH-elektrodo (v vzorcu ali dvignjena) in namizni
# pH-meter. Barve (zelje, papir, lastna barva vzorca) in odčitek zaslona doda aplikacija iz modela
# (public/sim/lab-model-indikatorji.js, public/sim/foto-ph.js); v izrisu je vse brezbarvno in zaslon prazen.
import math
import bmesh
import bpy
from lab_prizori import *  # noqa: F401,F403  (Pogled, studio, telo, prostornina, okvir_predmetov, modeli)
import lab_modeli as M

V_CASA = 100.0     # mL vzorca v čaši (PH_KOLICINE.casaMl)
V_EPR = 4.0        # mL v epruveti: 2 mL vzorca + 2 mL izvlečka (PH_KOLICINE.epruvetaMl)
PAPIR = dict(sirina=7.0, dolzina=70.0, debelina=0.25, mokro=25.0)   # trak z zvitka (ocena; PH_KOLICINE.papir)
ELEKTRODA = dict(d=12.0, telo=120.0, kapa=20.0, bucka=13.0)        # kombinirana steklena elektroda Ø 12 × 120 mm


def prizma(ime, sx, tocke, mat, zb, premik):
    """Prizma dolžine sx (os x) iz prereza [(y, z)] v mm (sponka za papir)."""
    bm = bmesh.new()
    a = [bm.verts.new((-sx / 2 * MM, y * MM, z * MM)) for y, z in tocke]
    b = [bm.verts.new((sx / 2 * MM, y * MM, z * MM)) for y, z in tocke]
    n = len(tocke)
    bm.faces.new(list(reversed(a))); bm.faces.new(b)
    for i in range(n):
        bm.faces.new((a[i], a[(i + 1) % n], b[(i + 1) % n], b[i]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(ime); bm.to_mesh(me); bm.free()
    return predmet(ime, me, mat, zb, premik)


def elektroda(ime, zb, x, y, ez, mat=None):
    """Steklena bučka (Ø 9 mm) na dnu ez, telo Ø 12 × 120 mm, kapa; mat = en material za vse (sloj debeline)."""
    E = ELEKTRODA
    r = E["d"] / 2
    ms = mat or steklo()
    vrtenina(ime + "-bucka", [(0, ez), (2.6, ez + 0.5), (4.5, ez + 3.5), (4.6, ez + 6), (4.1, ez + 9), (4.1, ez + E["bucka"])], ms, 32, zb, (x, y, 0))
    valj(ime + "-telo", r, E["telo"], mat or snov("epoksi", (0.16, 0.22, 0.33), 0.22, lak=0.4), zb, (x, y, ez + E["bucka"] - 2), posnetje=0.8)
    if mat is None:
        oznake_valja(ime + "-pas", r, [(ez + 100, 1.0)], snov("tisk-bel", (0.9, 0.9, 0.88), 0.5), zb, (x, y, 0), debelina=10)
        oznake_valja(ime + "-diafragma", r, [(ez + E["bucka"] + 1.5, 0.12)], snov("keramika-diafr", (0.85, 0.84, 0.80), 0.8), zb, (x, y, 0), debelina=1.2)
    valj(ime + "-kapa", r + 1.5, E["kapa"], mat or snov("plastika-crna", (0.02, 0.02, 0.022), 0.4, zrnatost=0.2), zb, (x, y, ez + E["bucka"] - 2 + E["telo"]), posnetje=1.5)
    return ez + E["bucka"] - 2 + E["telo"] + E["kapa"]   # vrh kape


def ph():
    """Okno 400 × 202 enot (spodaj je še barvna lestvica papirja, ki jo nariše aplikacija), 0,66 enote/mm,
    kamera 8° nad vodoravnico. Sloji: osnova (prazna čaša in epruveta, suh papir, elektrode ni), polna čaša in
    epruveta z debelino, elektroda zunaj (prosojno), elektroda v vzorcu (neprozoren izrez + polna čaša + debelina)."""
    studio()
    bpy.context.view_layer.update()
    zb = "stalno"
    crna = snov("plastika-crna", (0.02, 0.02, 0.022), 0.4, zrnatost=0.2)
    jeklo = kovina("jeklo", krtaceno=0.25)
    # ---- stojalce za epruvete (bukev, dve luknji), epruveta v desni
    RX = -250.0
    bukev = les()
    kvader("st-dno", 70, 45, 10, bukev, zb, (RX, 0, 0), posnetje=1.0)
    deska_z_luknjami("st-vrh", 70, 45, 8, [(-17, 0), (17, 0)], 9.6, bukev, zb, (RX, 0, 70))
    for sx in (-1, 1):
        kvader(f"st-bok{sx}", 8, 45, 60, bukev, zb, (RX + sx * 31, 0, 10), posnetje=0.8)
    TX = RX + 17
    ri = EPRUVETA["d"] / 2 - EPRUVETA["stena"]
    G = ri + (V_EPR * 1000 - 2 / 3 * math.pi * ri ** 3) / (math.pi * ri ** 2)   # polkroglasto dno + valj
    epruveta("ep-prazna", None, "epruveta-prazna", (TX, 0, 10))
    _, _, tek_e, dno_e = epruveta("ep-polna", G, "epruveta-polna", (TX, 0, 10))
    LREF_E = EPRUVETA["d"] - 2 * EPRUVETA["stena"]
    telo("ep-telo", tek_e, LREF_E, "debelina-epruveta", (TX, 0, 10))
    # ---- indikatorski papir v sponki (19 mm, stoji na zloženih ročajih), mokri konec zgoraj
    PX, PY = -160.0, -5.0
    sponka = snov("sponka", (0.015, 0.015, 0.017), 0.3, kovina=0.6)
    Z0 = 6.0
    prizma("sponka", 19, [(-5.5, Z0), (5.5, Z0), (0.6, Z0 + 11), (-0.6, Z0 + 11)], sponka, zb, (PX, PY, 0))
    zica = kovina("nikelj", (0.75, 0.74, 0.70), 0.3)
    for sx in (-1, 1):
        cev(f"sponka-rocaj{sx}", [(PX + sx * 8.5, PY - 3, Z0 + 4), (PX + sx * 8.5, PY - 9, Z0 - 2), (PX + sx * 8.5, PY - 14, 0.6), (PX, PY - 15, 0.6)], 0.6, zica, zb)
        cev(f"sponka-rocajz{sx}", [(PX + sx * 8.5, PY + 3, Z0 + 4), (PX + sx * 8.5, PY + 9, Z0 - 2), (PX + sx * 8.5, PY + 14, 0.6), (PX, PY + 15, 0.6)], 0.6, zica, zb)
    ZP0 = Z0 + 8.0
    kvader("papir", PAPIR["sirina"], PAPIR["debelina"], PAPIR["dolzina"], snov("papir-bel", (0.86, 0.86, 0.86), 0.95), zb, (PX, PY, ZP0))
    # ---- čaša 250 mL s 100 mL vzorca (gladina iz notranjega profila)
    CX, CY = -20.0, 0.0
    Rc, tc = CASA["d"] / 2, CASA["stena"]
    Ri = Rc - tc
    DNO_C = 2.2   # debelina dna čaše (lab_modeli.casa)
    # notranji profil čaše kot v lab_modeli.casa (zaobljen prehod R 5,6 mm, nato ravna stena), z nad notranjim dnom
    prof = [(Ri - 6, 0)] + [(Ri - 6 + 5.6 * math.cos(-math.pi / 2 + k * math.pi / 12), 6 + 5.6 * math.sin(-math.pi / 2 + k * math.pi / 12)) for k in range(1, 7)]
    prof += [(Ri, CASA["h"] - 5 - DNO_C)]
    VH = prostornina(prof, 80.0, 0.25)
    GC = next(h for h, v in VH if v >= V_CASA)
    casa("casa-prazna", None, "casa-prazna", (CX, CY, 0))
    _, _, tek_c, dno_c = casa("casa-polna", GC, "casa-polna", (CX, CY, 0))
    casa("casa-polna-el", GC, "casa-polna-el", (CX, CY, 0))
    LREF_C = 2 * Ri
    telo("casa-telo", tek_c, LREF_C, "debelina-casa", (CX, CY, 0))
    telo("casa-telo-el", tek_c, LREF_C, "debelina-casa-el", (CX, CY, 0))
    emajl = snov("tisk-bel", (0.9, 0.9, 0.88), 0.5)
    for zb_ in ("casa-prazna", "casa-polna", "casa-polna-el"):
        for V in (50, 100, 150, 200):
            hh = dno_c + next(h for h, v in VH if v >= V)
            oznake_vrtenine(f"casa-crta{V}{zb_}", [(hh, Rc, 10.0 if V % 100 == 0 else 6.0)], emajl, zb_, (CX, CY, 0), sredina=-math.pi / 2 - 0.6)
            if V % 100 == 0:
                napis_na_valju(f"casa-st{V}{zb_}", str(V), Rc, hh + 0.4, emajl, velikost=3.6, zb=zb_, premik=(CX, CY, 0), kot=-math.pi / 2 - 0.6 + 10.5 / Rc)
        napis_na_valju(f"casa-napis{zb_}", "250 mL", Rc, 70, emajl, velikost=4.5, zb=zb_, premik=(CX, CY, 0), kot=-math.pi / 2 + 0.3)
    # ---- držalo elektrode: litoželezna plošča, palica Ø 10 × 255 mm; roka in elektroda sta v slojih stanja
    HX, HY = -105.0, 45.0
    kvader("drz-plosca", 80, 80, 10, snov("podstavek-lak", (0.42, 0.46, 0.45), 0.45, zrnatost=0.45, merilo=900), zb, (HX, HY, 0), posnetje=1.2)
    valj("drz-palica", 5, 255, jeklo, zb, (HX, HY, 10), posnetje=1.0)
    # ---- namizni pH-meter 160 × 140 × 64 mm: zaslon LCD 60 × 26 mm na sprednji plošči, vtičnica BNC zgoraj zadaj
    MX, MY = 140.0, 40.0
    kvader("phm", 160, 140, 60, snov("phm-ohisje", (0.80, 0.82, 0.84), 0.45, zrnatost=0.2, merilo=700), zb, (MX, MY, 4), posnetje=4)
    for sx in (-1, 1):
        for sy in (-1, 1):
            valj(f"phm-noga{sx}{sy}", 7, 4, snov("guma", (0.025, 0.025, 0.028), 0.75), zb, (MX + sx * 65, MY + sy * 55, 0))
    fy = MY - 70
    kvader("phm-plosca", 150, 1.2, 50, snov("phm-plosca", (0.10, 0.17, 0.28), 0.4, zrnatost=0.15), zb, (MX, fy - 0.6, 10), posnetje=0.3)
    LX, LZ = MX - 28, 24.0
    kvader("phm-okvir", 66, 0.8, 32, snov("dmm-okvir", (0.01, 0.01, 0.012), 0.2), zb, (LX, fy - 1.4, LZ - 3), posnetje=0.2)
    kvader("phm-lcd", 60, 0.4, 26, snov("lcd", (0.52, 0.57, 0.50), 0.25, lak=0.5), zb, (LX, fy - 1.9, LZ))
    lcd = [(LX - 30, fy - 2.15, LZ + 26), (LX + 30, fy - 2.15, LZ + 26), (LX - 30, fy - 2.15, LZ)]
    tisk = snov("tisk-bel", (0.9, 0.9, 0.88), 0.5)
    for k, n in enumerate(("CAL", "READ", "ON")):
        bx = MX + 26 + 17 * k
        valj(f"phm-tipka{k}", 5.5, 2.5, snov("phm-tipka", (0.70, 0.72, 0.74), 0.35), zb, (bx, fy - 1.2 - 2.5, 34), os="y", posnetje=0.8, n=32)
        napis_na_valju(f"phm-n{k}", n, 0, 25, tisk, velikost=3.4, zb=zb, premik=(bx, fy - 1.25, 0), plosko=True)
    napis_na_valju("phm-ime", "pH / mV", 0, 52, tisk, velikost=4.0, zb=zb, premik=(MX + 43, fy - 1.25, 0), plosko=True)
    BNC = (MX - 60, MY + 45, 64.0)
    valj("phm-bnc", 5.0, 8, kovina("nikelj", (0.75, 0.74, 0.70), 0.3), zb, BNC, n=32)

    # ---- elektroda v dveh legah (z roko držala, kablom in vtičem BNC)
    EX, EY = CX + 12, CY + 8
    rob = snov("plastika-siva", (0.55, 0.57, 0.60), 0.4, zrnatost=0.15)

    def lega(zb_, ez):
        vrh = elektroda("el-" + zb_, zb_, EX, EY, ez)
        za = ez + 92
        kvader("drz-mufa" + zb_, 22, 22, 26, kovina("aluminij", (0.78, 0.79, 0.80), 0.36), zb_, (HX, HY, za - 13), posnetje=2.5)
        cev("drz-roka" + zb_, [(HX, HY, za), (EX, EY, za)], 4.0, rob, zb_, gladke=False)
        vrtenina("drz-objemka" + zb_, [(6.1, za - 7), (9.5, za - 7), (10, za - 6), (10, za + 6), (9.5, za + 7), (6.1, za + 7), (6.1, za - 7)], rob, 48, zb_, (EX, EY, 0))
        valj("bnc-vtic" + zb_, 6.0, 20, kovina("nikelj", (0.75, 0.74, 0.70), 0.3), zb_, (BNC[0], BNC[1], BNC[2] + 8), n=32, posnetje=1)
        top = BNC[2] + 28
        cev("el-kabel" + zb_, [(EX, EY, vrh), (EX, EY, vrh + 9), (EX + 22, EY + 14, vrh + 12), (EX + 70, EY + 40, max(top + 30, vrh - 40)), (BNC[0], BNC[1], top + 25), (BNC[0], BNC[1], top)], 2.2, crna, zb_)
        return vrh

    EZ_V = dno_c + 6.0                 # bučka 6 mm nad notranjim dnom
    EZ_ZUNAJ = CASA["h"] + 5.0         # dvignjena: bučka 5 mm nad robom čaše
    lega("el-v", EZ_V)
    lega("el-zunaj", EZ_ZUNAJ)
    # v sloju debeline je potopljeni del elektrode bel izvor (t = 1): žarek skozi tekočino pred elektrodo se ustavi na njej
    elektroda("el-deb", "debelina-casa-el", EX, EY, EZ_V, mat=svetilo("bel-izvor", (1, 1, 1), 1.0))
    bpy.context.view_layer.update()

    # ---- pogled in sloji
    P = Pogled("ph", 400, 202, 0.66, (0, 0, 0), (215, 186), visina=8.0)
    osn = ["studio", "pult", "stalno"]

    def okvir(x0, z0, x1, z1, y=0.0, rob=3):
        a, b = P.projekcija((x0, y, z1)), P.projekcija((x1, -y, z0))
        return (max(0, math.floor(a[0] - rob)), max(0, math.floor(a[1] - rob)), min(P.W, math.ceil(b[0] + rob)), min(P.H, math.ceil(b[1] + rob)))
    ok_e = okvir(TX - 11, 8, TX + 11, 175)
    ok_c = okvir(CX - Rc - 3, -1, CX + Rc + 3, CASA["h"] + 2, y=Rc)
    ox = okvir_predmetov(P, ["el-v"], 4)
    ok_ev = (min(ox[0], ok_c[0]), min(ox[1], ok_c[1]), max(ox[2], ok_c[2]), max(ox[3], ok_c[3]))
    prazno = osn + ["epruveta-prazna"]
    sloji = [
        dict(ime="ph", pogled=P, vidno=prazno + ["casa-prazna"]),
        dict(ime="ph-epruveta-polna", pogled=P, vidno=osn + ["epruveta-polna", "casa-prazna"], izrez=ok_e),
        dict(ime="ph-epruveta-debelina", pogled=P, vidno=["debelina-epruveta"], vrsta="debelina", izrez=ok_e),
        dict(ime="ph-casa-polna", pogled=P, vidno=prazno + ["casa-polna"], izrez=ok_c),
        dict(ime="ph-casa-debelina", pogled=P, vidno=["debelina-casa"], vrsta="debelina", izrez=ok_c),
        dict(ime="ph-el-zunaj", pogled=P, vidno=["studio", "el-zunaj"], lovilci=["pult", "stalno"], vrsta="prosojno", izrez=okvir_predmetov(P, ["el-zunaj"], 8)),
        dict(ime="ph-el-v", pogled=P, vidno=prazno + ["casa-prazna", "el-v"], izrez=ok_ev),
        dict(ime="ph-el-v-polna", pogled=P, vidno=prazno + ["casa-polna-el", "el-v"], izrez=ok_c),
        dict(ime="ph-el-v-debelina", pogled=P, vidno=["debelina-casa-el"], vrsta="debelina", izrez=ok_c),
    ]
    pr = P.projekcija
    pw = PAPIR["sirina"] / 2
    meta = dict(
        poskus="ph",
        sidra={"ph": dict(
            pult=pr((0, 0, 0))[1], merilo20=[pr((0, 0, 0))[0], pr((20, 0, 0))[0]],
            epruveta=pr((TX, 0, 10)), epruvetaDno=pr((TX, 0, 10 + dno_e))[1], epruvetaGladina=pr((TX, 0, 10 + dno_e + G))[1], epruvetaVrh=pr((TX, 0, 170))[1],
            papir=[pr((PX - pw, PY - PAPIR["debelina"] / 2, ZP0 + PAPIR["dolzina"])), pr((PX + pw, PY - PAPIR["debelina"] / 2, ZP0))],
            papirMokro=pr((PX, PY, ZP0 + PAPIR["dolzina"] - PAPIR["mokro"]))[1],
            casa=pr((CX, CY, 0)), casaDno=pr((CX, CY, dno_c))[1], casaVrh=pr((CX, CY, CASA["h"]))[1],
            elektrodaV=pr((EX, EY, EZ_V)), elektrodaZunaj=pr((EX, EY, EZ_ZUNAJ)),
            lcd=[pr(t) for t in lcd], meter=pr((MX, fy, 0)), drzalo=pr((HX, HY, 0)))},
        merila=dict(ph=0.66, visinaKamere=dict(ph=8)),
        casa=dict(premer=CASA["d"], visina=CASA["h"], stena=tc, dno=dno_c, notranjiPolmer=round(Ri, 2), VodH=VH, gladinaMm=round(GC, 2), V=V_CASA, lref=round(LREF_C, 2)),
        epruveta=dict(premer=EPRUVETA["d"], dolzina=EPRUVETA["l"], stena=EPRUVETA["stena"], dno=dno_e, gladinaMm=round(G, 3), V=V_EPR, lref=LREF_E),
        papir=dict(PAPIR),
        elektroda=dict(ELEKTRODA, vPotopljena=EZ_V, vZunaj=EZ_ZUNAJ),
        zaslon=[60, 26],
        optika=dict(nSteklo=N_STEKLO, nVoda=N_VODA, kapilarnaMm=KAPILARNA),
    )
    return dict(pogledi=[P], sloji=sloji, meta=meta)

# Fotorealistični laboratorij: prizor »prevodnost« (lab-prevodnost, public/sim/lab-elektrika.js; model
# lab-model-elektrika.js: TESTER, MATERIALI, tester()). Preizkuševalnik: ploščata baterija 4,5 V (3LR12), lučka
# (žarnica E10 3,8 V / 0,3 A ali rdeča LED 5 mm z uporom 150 Ω) na ploščici, dve krokodilski sponki 6 cm narazen,
# po izbiri ampermeter (isti multimeter kot pri Ohmovem zakonu). Svetenje, mehurčki in odčitek niso zapečeni v sliko:
# sveteči sloji so posebej, prosojnost jim nastavi aplikacija iz modela (public/sim/foto-prevodnost.js).
# Mere (mm): 3LR12 po IEC 60086-2 (62 × 22 × 65, kratek jeziček +, dolg −); žarnica G11/E10 (balon Ø 11, navoj Ø 9,5);
# LED Ø 5 × 8,6 (rob Ø 5,8); upor 0,25 W 6,3 × Ø 2,4; krokodilska sponka 50 mm (čeljusti 22 mm, zaščitni tulec PVC);
# vodnik Ø 3 mm; vzorci 6 cm med stičnima točkama kot v modelu (žica Ø 1, mina Ø 0,5, nekovine presek ~1 cm²);
# raztopine: čaša 250 mL (ISO 3819), bakreni ploščici 20 × 100 × 1 mm, 30 mm narazen, potopljeni 30 mm (K = 50 m⁻¹).
import math
import random
import bpy
import bmesh
import mathutils
import lab_modeli as M
from lab_modeli import MM, CASA, N_VODA, kvader, valj, vrtenina, cev, snov, kovina, steklo, svetilo, les, zbirka, predmet, gladko, casa, \
    oznake_vrtenine, napis_na_valju, multimeter, gumb_multimetra, vticnica, upornik
from lab_prizori import Pogled, studio, okvir_predmetov

# Vzorci: (vrsta, debelina med čeljustmi [mm]). Ključi kot MATERIALI v lab-model-elektrika.js.
TRDNE = ["baker", "aluminij", "zelezo", "grafit", "zveplo", "steklo", "plastika", "les", "guma", "papir", "sol"]
TEKOCINE = ["slana1", "slana5", "slana20", "vodovodna", "destilirana", "sladkorna"]
DEBELINA = {"baker": 1.0, "aluminij": 0.6, "zelezo": 3.1, "grafit": 0.5, "zveplo": 11.3, "steklo": 11.3, "plastika": 3.5, "les": 11.3, "guma": 5.0, "papir": 0.6, "sol": 9.0}
SX, SY = 40.0, -40.0          # središče vzorca (med sponkama) na pultu
RAZMIK = 60.0                 # stični točki sponk (model: kos snovi 6 cm)
CASA_GL = 35.0                # gladina v čaši nad notranjim dnom: ploščici (dno 5 mm nad dnom) potopljeni 30 mm
PL = dict(sirina=20.0, visina=100.0, debelina=1.0, nad_dnom=5.0, razmik=30.0, kot=30.0)


# ---------------------------------------------------------------- pomožne oblike
def prizma(ime, poly, y0, y1, mat, zb, ravnina="xz"):
    """Prizma iz mnogokotnika (lahko nekonveksnega) v ravnini xz (izvlečen po y) ali xy (izvlečen po z)."""
    bm = bmesh.new()
    def v3(a, b, c):
        return (a * MM, c * MM, b * MM) if ravnina == "xz" else (a * MM, b * MM, c * MM)
    sp = [bm.verts.new(v3(a, b, y0)) for a, b in poly]
    zg = [bm.verts.new(v3(a, b, y1)) for a, b in poly]
    n = len(poly)
    f0 = bm.faces.new(list(reversed(sp)) if ravnina == "xy" else sp)
    f1 = bm.faces.new(zg if ravnina == "xy" else list(reversed(zg)))
    for i in range(n):
        j = (i + 1) % n
        bm.faces.new((sp[i], sp[j], zg[j], zg[i]) if ravnina == "xy" else (sp[i], zg[i], zg[j], sp[j]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bmesh.ops.triangulate(bm, faces=[f0, f1], quad_method="BEAUTY", ngon_method="BEAUTY")
    me = bpy.data.meshes.new(ime)
    bm.to_mesh(me); bm.free()
    gladko(me, 30)
    return predmet(ime, me, mat, zb)


def nosilec(ime, zb, izhodisce, os_x, os_z):
    """Prazen predmet s krajevnim sistemom (os_x, os_z, os_y = os_z × os_x) v točki izhodisce [mm]."""
    x = mathutils.Vector(os_x).normalized(); z = mathutils.Vector(os_z).normalized(); y = z.cross(x)
    e = bpy.data.objects.new(ime, None)
    zbirka(zb).objects.link(e)
    m = mathutils.Matrix((x, y, z)).transposed().to_4x4()
    m.translation = mathutils.Vector(izhodisce) * MM
    e.matrix_world = m
    return e


def krokodilka(ime, zb, stik, os_x, os_z, reza, barva):
    """Krokodilska sponka 50 mm. stik: točka med čeljustma 4 mm od konice [mm]; os_x: od konice proti tulcu;
    os_z: smer, v kateri se čeljusti razpreta (zgornja čeljust); reza: razmik čeljusti v stiku (debelina vzorca).
    Vrne točko, kjer vodnik izstopi iz tulca (svetovne mm)."""
    x = mathutils.Vector(os_x).normalized()
    e = nosilec(ime, zb, mathutils.Vector(stik) - 4 * x, os_x, os_z)
    jeklo = kovina("nikljano-jeklo", (0.70, 0.69, 0.66), 0.3)
    px, fi = 24.0, math.atan(max(0.3, reza) / 2 / 20.0)
    def obrni(p, k):
        c, s_ = math.cos(k), math.sin(k)
        return (px + (p[0] - px) * c - p[1] * s_, (p[0] - px) * s_ + p[1] * c)
    deli = []
    zobje, x_ = [], 0.6
    while x_ < 14:
        zobje += [(x_, 0.0), (x_ + 0.8, 0.9)]
        x_ += 1.6
    rob = [(0.0, 0.9)] + zobje + [(26, 0.9), (26, 3.0), (6, 3.2), (0.0, 2.2)]   # zgornja čeljust v (x, z), zobje pri z = 0
    hrbet = [(0.0, 2.2), (6, 3.2), (26, 3.0), (26, 3.6), (6, 3.8), (0.0, 2.8)]
    for znak in (-1, 1):   # −1: spodnja čeljust, +1: zgornja; vsaka se odpre za fi okoli osi vzmeti
        obr = lambda pts: [obrni((a, znak * b), -znak * fi) for a, b in pts]
        for st in (-1, 1):
            deli.append(prizma(f"{ime}-c{znak}{st}", obr(rob), st * 3.3 - 0.25, st * 3.3 + 0.25, jeklo, zb))
        deli.append(prizma(f"{ime}-h{znak}", obr(hrbet), -3.55, 3.55, jeklo, zb))
    deli.append(valj(f"{ime}-vzmet", 2.3, 7.4, kovina("vzmet", (0.45, 0.45, 0.46), 0.35), zb, (px, -3.7, 0), os="y", n=20))
    tulec = kvader(f"{ime}-tulec", 29, 10, 11, snov(f"pvc-{barva}", {"rdeca": (0.58, 0.025, 0.02), "crna": (0.022, 0.022, 0.024)}[barva], 0.42, zrnatost=0.1, merilo=700),
                   zb, (35.5, 0, -5.5), posnetje=3.2, seg=4)
    for v in tulec.data.vertices:   # zadnji del se zoži proti vodniku
        k = 1 - 0.35 * max(0.0, (v.co.x / MM + 35.5 - 38) / 12)
        v.co.y *= k; v.co.z = ((v.co.z / MM - 5.5) * k + 5.5) * MM
    deli.append(tulec)
    for d in deli:
        d.parent = e
    return e.matrix_world @ mathutils.Vector((50 * MM, 0, 0)) / MM


def catmull_rom(tocke, n=10):
    """Centripetalna Catmull–Romova krivulja skozi vse točke (kabel gre res skozi podane točke, ne le blizu njih)."""
    P = [mathutils.Vector(t) for t in tocke]
    P = [2 * P[0] - P[1]] + P + [2 * P[-1] - P[-2]]
    out = [tuple(P[1])]
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
        t0 = 0.0; t1 = t0 + max(1e-6, (p1 - p0).length ** 0.5); t2 = t1 + max(1e-6, (p2 - p1).length ** 0.5); t3 = t2 + max(1e-6, (p3 - p2).length ** 0.5)
        for k in range(1, n + 1):
            t = t1 + (t2 - t1) * k / n
            a1 = (t1 - t) / (t1 - t0) * p0 + (t - t0) / (t1 - t0) * p1
            a2 = (t2 - t) / (t2 - t1) * p1 + (t - t1) / (t2 - t1) * p2
            a3 = (t3 - t) / (t3 - t2) * p2 + (t - t2) / (t3 - t2) * p3
            b1 = (t2 - t) / (t2 - t0) * a1 + (t - t0) / (t2 - t0) * a2
            b2 = (t3 - t) / (t3 - t1) * a2 + (t - t1) / (t3 - t1) * a3
            c = (t2 - t) / (t2 - t1) * b1 + (t - t1) / (t2 - t1) * b2
            out.append((c.x, c.y, max(c.z, 1.5)))
    return out


def kabel(ime, tocke, barva, zb, r=1.5):
    tocke = catmull_rom(tocke)
    m = snov("kabel-" + barva, {"rdeca": (0.58, 0.02, 0.02), "crna": (0.02, 0.02, 0.022)}[barva], 0.4, zrnatost=0.12, merilo=600)
    return cev(ime, tocke, r, m, zb, gladke=False)


def vtic(ime, p, barva, zb):
    """Banana vtič 4 mm (tulec Ø 9 × 32 mm) navpično v vtičnici p; vrne točko, kjer izstopi kabel."""
    m = snov("kabel-" + barva, {"rdeca": (0.58, 0.02, 0.02), "crna": (0.02, 0.02, 0.022)}[barva], 0.4, zrnatost=0.12, merilo=600)
    valj(ime, 4.5, 32, m, zb, p, os="z", posnetje=1.2, n=24)
    return (p[0], p[1], p[2] + 31)


# ---------------------------------------------------------------- naprave
def baterija(zb, cx, cy):
    """Ploščata baterija 4,5 V 3LR12 (IEC 60086-2: 62 × 22 × 65 mm), medeninasta jezička: kratek +, dolg −."""
    ovoj = snov("bat-ovoj", (0.05, 0.16, 0.42), 0.38, lak=0.4)
    kvader("bat", 62, 22, 65, ovoj, zb, (cx, cy, 0), posnetje=1.6)
    kvader("bat-pokrov", 60, 20, 1.2, snov("bat-pokrov", (0.06, 0.06, 0.065), 0.5), zb, (cx, cy, 65), posnetje=0.4)
    medenina = kovina("medenina", (0.80, 0.62, 0.28), 0.3)
    tisk = snov("tisk-bel", (0.9, 0.9, 0.88), 0.5)
    jez = {}
    for ime, dx, l in (("plus", 15, 9.0), ("minus", -15, 17.0)):
        kvader(f"bat-{ime}", 6, 0.5, l + 2, medenina, zb, (cx + dx, cy, 64.5), posnetje=0.1)
        jez[ime] = (cx + dx, cy, 66 + l)
    fy = cy - 11
    napis_na_valju("bat-n1", "4,5 V", 0, 40, tisk, velikost=11, zb=zb, premik=(cx, fy, 0), plosko=True)
    napis_na_valju("bat-n2", "3LR12", 0, 24, tisk, velikost=5.5, zb=zb, premik=(cx, fy, 0), plosko=True)
    napis_na_valju("bat-n3", "+", 0, 57, tisk, velikost=8, zb=zb, premik=(cx + 15, fy, 0), plosko=True)
    napis_na_valju("bat-n4", "−", 0, 57, tisk, velikost=8, zb=zb, premik=(cx - 15, fy, 0), plosko=True)
    return jez


def ploscica(zb, cx, cy):
    """Podstavek lučke (PVC 80 × 44 × 12 mm) z rdečo (vhod) in črno (izhod) 4-mm vtičnico."""
    kvader("lucka-plosca", 80, 44, 12, snov("plosca-siva", (0.72, 0.74, 0.75), 0.42, zrnatost=0.2, merilo=800), zb, (cx, cy, 0), posnetje=2)
    vticnica("lucka-vt-rdeca", "rdeca", zb, (cx - 30, cy - 8, 12))
    vticnica("lucka-vt-crna", "crna", zb, (cx + 30, cy - 8, 12))
    return dict(vhod=(cx - 30, cy - 8, 16.0), izhod=(cx + 30, cy - 8, 16.0))


def zarnica(zb, cx, cy, sveti):
    """Žarnica 3,8 V / 0,3 A (G11, navoj E10) v podnožju E10; nitka sveti (sveteči sloj) ali ne."""
    valj("e10-podnozje" + zb, 9, 13, snov("bakelit", (0.03, 0.03, 0.032), 0.35), zb, (cx, cy, 12), posnetje=1.5)
    valj("e10-navoj" + zb, 4.75, 7, kovina("nikelj", (0.75, 0.74, 0.70), 0.3), zb, (cx, cy, 25))
    z0 = 32.0
    vrtenina("e10-balon" + zb, [(4.6, z0), (5.5, z0 + 4), (5.5, z0 + 9), (4.8, z0 + 13), (3, z0 + 16), (0, z0 + 17.2), (0, z0 + 16.6), (2.8, z0 + 15.5), (4.4, z0 + 12.8),
                                (5.0, z0 + 9), (5.0, z0 + 4), (4.2, z0 + 0.4), (4.6, z0)], steklo("steklo-tanko", 1.5), 40, zb, (cx, cy, 0))
    nit = svetilo("nitka-sveti", (1.0, 0.72, 0.38), 260.0) if sveti else kovina("volfram", (0.25, 0.24, 0.23), 0.4)
    cev("e10-nitka" + zb, [(cx - 2.0, cy, z0 + 1), (cx - 1.8, cy, z0 + 8), (cx - 0.7, cy, z0 + 9.2), (cx + 0.7, cy, z0 + 7.8), (cx + 1.8, cy, z0 + 9), (cx + 2.0, cy, z0 + 1)], 0.16, nit, zb, gladke=False)
    return (cx, cy, z0 + 8.5)


def led(zb, cx, cy, vhod, izhod, sveti):
    """Rdeča LED 5 mm (Ø 5 × 8,6 mm, rob Ø 5,8) v podnožju, zaporedno upor 150 Ω 0,25 W; pocinjane žice do vtičnic."""
    zica = kovina("kositer", (0.78, 0.78, 0.76), 0.22)
    valj("led-podnozje" + zb, 4.5, 8, snov("bakelit", (0.03, 0.03, 0.032), 0.35), zb, (cx, cy, 12), posnetje=1)
    z0 = 20.0
    epoks = svetilo("led-sveti-epoks", (1.0, 0.05, 0.02), 2.5) if sveti else snov("led-epoks", (0.75, 0.05, 0.03), 0.08, prosojnost=0.85, ior=1.55)
    vrtenina("led-telo" + zb, [(0, z0), (2.9, z0), (2.9, z0 + 1.0), (2.5, z0 + 1.0), (2.5, z0 + 6.1)] + [(2.5 * math.cos(k * math.pi / 16), z0 + 6.1 + 2.5 * math.sin(k * math.pi / 16)) for k in range(1, 9)],
             epoks, 40, zb, (0, 0, 0))
    bpy.data.objects["led-telo" + zb].location = (cx * MM, cy * MM, 0)
    upornik("led-upor" + zb, 150, 0.25, zb, (cx - 17, cy - 8, 14.5), razmik=20)
    cev("led-z1" + zb, [(vhod[0], vhod[1], 15), (vhod[0] + 1, vhod[1], 14.5), (cx - 27, cy - 8, 14.5)], 0.3, zica, zb, gladke=False)
    cev("led-z2" + zb, [(cx - 7, cy - 8, 14.5), (cx - 1.3, cy - 8, 14.5), (cx - 1.3, cy, 20)], 0.3, zica, zb, gladke=False)
    cev("led-z3" + zb, [(cx + 1.3, cy, 20), (cx + 1.3, cy - 8, 14.5), (izhod[0] - 1, izhod[1], 14.5), (izhod[0], izhod[1], 15)], 0.3, zica, zb, gladke=False)
    return (cx, cy, z0 + 5)


def magnet(zb, cx, y_pol):
    """Podkvasti magnet (50 × 40 × 10 mm, rdeče lakiran, pola iz jekla) leži na pultu, pola gledata proti vzorcu (+y)."""
    rdeca = snov("magnet-lak", (0.62, 0.03, 0.03), 0.3, lak=0.5)
    jeklo = kovina("magnet-pol", (0.62, 0.63, 0.65), 0.35)
    y0 = y_pol - 40
    zunaj = [(cx + 25 * math.cos(math.pi + k * math.pi / 16), y0 + 25 + 25 * math.sin(math.pi + k * math.pi / 16)) for k in range(17)]
    znotraj = [(cx + 10 * math.cos(-k * math.pi / 16), y0 + 25 + 10 * math.sin(-k * math.pi / 16)) for k in range(17)]
    poly = zunaj + [(cx + 25, y_pol - 7), (cx + 10, y_pol - 7)] + znotraj + [(cx - 10, y_pol - 7), (cx - 25, y_pol - 7)]
    prizma("magnet", poly, 0, 10, rdeca, zb, ravnina="xy")
    for s_ in (-1, 1):
        kvader(f"magnet-pol{s_}", 15, 7, 10, jeklo, zb, (cx + s_ * 17.5, y_pol - 3.5, 0), posnetje=0.4)


# ---------------------------------------------------------------- vzorci
def vzorec(id_, zb, zc):
    """Kos snovi vzdolž x okoli (SX, SY, zc)."""
    L = 88.0
    x0 = SX - L / 2
    if id_ == "baker":
        cev("v-baker", [(x0, SY, zc), (SX - 10, SY + 0.6, zc), (SX + 15, SY - 0.5, zc), (x0 + L, SY, zc)], 0.5, kovina("baker", (0.95, 0.64, 0.54), 0.22), zb)
    elif id_ == "aluminij":   # gospodinjska folija, zložena v trak 8 × 0,1 mm (presek kot žica Ø 1 mm)
        o = kvader("v-aluminij", L, 8, 0.1, kovina("aluminij-folija", (0.91, 0.92, 0.92), 0.16), zb, (SX, SY, zc - 0.05), seg=1)
        bm = bmesh.new(); bm.from_mesh(o.data)
        bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=24, use_grid_fill=True)
        rnd = random.Random(3)
        for v in bm.verts:
            x = v.co.x / MM
            v.co.z += (0.25 * math.sin(x * 0.9 + rnd.random()) + 0.12 * math.sin(x * 2.7)) * MM * (1 if abs(x) < L / 2 - 14 else 0.2)
        bm.to_mesh(o.data); bm.free()
    elif id_ == "zelezo":   # žebelj 3,1 × 80 mm (DIN 1151), glava Ø 7
        jeklo = kovina("zebelj", (0.56, 0.57, 0.58), 0.33)
        prof = [(0, 0), (0.25, 0.4), (1.55, 5.0), (1.55, 78.0), (3.5, 78.2), (3.5, 79.4), (3.2, 80.0), (0, 80.0)]
        o = vrtenina("v-zelezo", prof, jeklo, 32, zb, (SX + 40, SY, zc)); o.rotation_euler = (0, math.radians(-90), 0)
    elif id_ == "grafit":   # mina 0,5 mm (HB)
        cev("v-grafit", [(x0 + 6, SY, zc), (x0 + L - 6, SY, zc)], 0.25, snov("grafit", (0.10, 0.10, 0.11), 0.35, kovina=0.45), zb, gladke=False)
    elif id_ == "zveplo":   # palica žvepla Ø 11,3 mm (1 cm²)
        o = valj("v-zveplo", 5.65, L - 4, snov("zveplo", (0.86, 0.70, 0.06), 0.72, zrnatost=0.8, merilo=260), zb, (SX - (L - 4) / 2, SY, zc), os="x", posnetje=1.5)
    elif id_ == "steklo":
        valj("v-steklo", 5.65, L, steklo(), zb, (SX - L / 2, SY, zc), os="x", posnetje=1.0, n=48)
    elif id_ == "plastika":   # prozorno ravnilo (polistiren, n = 1,59) 28 × 3,5 mm s črtami
        kvader("v-plastika", L, 28, 3.5, snov("ps-moder", (0.30, 0.55, 0.95), 0.05, prosojnost=0.92, ior=1.59), zb, (SX, SY, zc - 1.75), posnetje=0.6)
        tisk = snov("tisk-bel", (0.9, 0.9, 0.88), 0.5)
        for k in range(0, 81, 1):
            dl = 7 if k % 10 == 0 else 5 if k % 5 == 0 else 3.5
            kvader(f"v-pl-c{k}", 0.25, dl, 0.05, tisk, zb, (SX - 40 + k, SY + 14 - 1 - dl / 2, zc + 1.76))
    elif id_ == "les":
        valj("v-les", 5.65, L, les("les-palcka", os=(1, 30, 30)), zb, (SX - L / 2, SY, zc), os="x", posnetje=0.8)
    elif id_ == "guma":   # radirka 75 × 20 × 5 mm (presek 1 cm²)
        kvader("v-guma", 75, 20, 5, snov("guma-radirka", (0.85, 0.36, 0.45), 0.7, zrnatost=0.25, merilo=900), zb, (SX, SY, zc - 2.5), posnetje=1.5)
    elif id_ == "papir":    # trak papirja 80 g/m² (0,1 mm), dvakrat prepognjen
        o = kvader("v-papir", L, 25, 0.4, snov("papir", (0.92, 0.92, 0.89), 0.85, zrnatost=0.1, merilo=1500), zb, (SX, SY, zc - 0.2), seg=1)
    elif id_ == "sol":      # podolgovat kos kamene soli (kristal NaCl, n = 1,544), razkoljen po ploskvah kocke
        o = kvader("v-sol", 82, 12, 9, snov("halit", (0.95, 0.94, 0.92), 0.25, prosojnost=0.75, ior=1.544, zrnatost=0.6, merilo=120), zb, (SX, SY, zc - 4.5), posnetje=0.5, seg=1)
        rnd = random.Random(5)
        for k in range(14):
            a = rnd.uniform(1.0, 2.6)
            kvader(f"v-sol-k{k}", a, a, a, bpy.data.materials["halit"], zb, (SX + rnd.uniform(-30, 30), SY + rnd.uniform(-5, 5), zc + 4.0 + rnd.uniform(-0.6, 0)), posnetje=0.15, seg=1)


def prozorne_sence(imena, prepustnost=0.9):
    """Senčni žarki gredo skozi steklo in vodo (oslabljeni za odboj na ploskvah): Cycles sicer pod gladino in skozi dno
    čaše ne najde poti do ploskovnih luči (kavstika) in je pult pod vodo pri razumnem številu vzorcev črn. Ravne ploskve
    (gladina, dno) svetlobo le premaknejo, zato je približek dober; ukrivljena stena čaše bi dala šibko kavstiko."""
    for ime in imena:
        m = bpy.data.materials.get(ime)
        if not m:
            continue
        nt = m.node_tree
        out = next(n for n in nt.nodes if n.type == "OUTPUT_MATERIAL")
        bsdf = out.inputs["Surface"].links[0].from_node
        lp = nt.nodes.new("ShaderNodeLightPath"); tr = nt.nodes.new("ShaderNodeBsdfTransparent"); mx = nt.nodes.new("ShaderNodeMixShader")
        tr.inputs["Color"].default_value = (prepustnost, prepustnost, prepustnost, 1)
        nt.links.new(lp.outputs["Is Shadow Ray"], mx.inputs[0]); nt.links.new(bsdf.outputs[0], mx.inputs[1]); nt.links.new(tr.outputs[0], mx.inputs[2])
        nt.links.new(mx.outputs[0], out.inputs["Surface"])


def prevodnost():
    """Okno 400 × 262 (kot risba), ortografska kamera 35° nad vodoravnico, 0,92 enote/mm vodoravno."""
    studio(globina=(-420, 420), stena=False, kljuc=1.0)
    zb = "stalno"
    jez = baterija(zb, -170, 100)
    am = multimeter("am", zb, -80, 60, "A")
    gumb_multimetra("am-gumb-off", "gumb-off", am["gumb"], 0)   # izklopljen (posebej, da ga sloja območij prekrijeta)
    pl = ploscica(zb, 150, 100)
    # gumb ampermetra: položaji območij (kot pri Ohmovem zakonu); izhodišče je »izklopljeno« (0°)
    for obm, kot in (("200m", 100), ("10", 130)):
        gumb_multimetra(f"am-gumb-{obm}", f"gumb-{obm}", am["gumb"], kot)
    # lučki
    fil = zarnica("ind-zarnica", 150, 108, False); zarnica("ind-zarnica-sveti", 150, 108, True)
    ledp = led("ind-led", 150, 108, pl["vhod"], pl["izhod"], False); led("ind-led-sveti", 150, 108, pl["vhod"], pl["izhod"], True)
    # trdni vzorci s sponkama (sponki primeta vzorec, čeljusti razprte za njegovo debelino)
    zad = {}
    for id_ in TRDNE:
        d = DEBELINA[id_]
        zc = max(d / 2 + 1.5, 6.0)
        vzorec(id_, "vzorec-" + id_, zc)
        zad["L"] = krokodilka(f"sp-L-{id_}", "vzorec-" + id_, (SX - RAZMIK / 2, SY, zc), (-1, 0, 0), (0, 0, 1), d, "crna")
        zad["D"] = krokodilka(f"sp-D-{id_}", "vzorec-" + id_, (SX + RAZMIK / 2, SY, zc), (1, 0, 0), (0, 0, 1), d, "rdeca")
    zad_trdno = {k: tuple(v) for k, v in zad.items()}
    # čaša z raztopino in bakrenima ploščicama (os med ploščicama 30° od x, da se vidita obe ploskvi)
    zbc = "vzorec-tekocina"
    _, _, tek, dnoc = casa("casa", CASA_GL, zbc, (SX, SY, 0))
    emajl = snov("tisk-bel", (0.9, 0.9, 0.88), 0.5)
    Rc = CASA["d"] / 2
    for V in (50, 100, 150, 200):
        hh = dnoc + V * 1000 / (math.pi * (Rc - CASA["stena"]) ** 2)
        oznake_vrtenine(f"casa-crta{V}", [(hh, Rc, 10.0 if V % 100 == 0 else 6.0)], emajl, zbc, (SX, SY, 0), sredina=-math.pi / 2 - 0.6)
        if V % 100 == 0:
            napis_na_valju(f"casa-st{V}", str(V), Rc, hh + 0.4, emajl, velikost=3.6, zb=zbc, premik=(SX, SY, 0), kot=-math.pi / 2 - 0.6 + 10.5 / Rc)
    napis_na_valju("casa-napis", "250 mL", Rc, 70, emajl, velikost=4.5, zb=zbc, premik=(SX, SY, 0), kot=-math.pi / 2 + 0.3)
    a = math.radians(PL["kot"]); n_ = (math.cos(a), math.sin(a), 0); t_ = (-math.sin(a), math.cos(a), 0)
    baker = kovina("baker-plosca", (0.93, 0.60, 0.48), 0.32)
    plosci, potop = {}, {}
    z_dno = dnoc + PL["nad_dnom"]
    for ime, s_ in (("L", -1), ("D", 1)):
        c = (SX + s_ * (PL["razmik"] + PL["debelina"]) / 2 * n_[0], SY + s_ * (PL["razmik"] + PL["debelina"]) / 2 * n_[1])
        o = kvader(f"plosca-{ime}", PL["debelina"], PL["sirina"], PL["visina"], baker, "plosci", (c[0], c[1], z_dno), posnetje=0.2, seg=1)
        o.rotation_euler = (0, 0, a)
        plosci[ime] = (c[0], c[1], z_dno + PL["visina"] - 5)
        f = c[0] - s_ * PL["debelina"] / 2 * n_[0], c[1] - s_ * PL["debelina"] / 2 * n_[1]   # notranja ploskev
        potop[ime] = [(f[0] + k * PL["sirina"] / 2 * t_[0], f[1] + k * PL["sirina"] / 2 * t_[1], z) for k, z in ((-1, dnoc + CASA_GL), (1, dnoc + CASA_GL), (-1, z_dno))]
    # mehurčki elektrolize: vodik na katodi (−, leva), na anodi (+) manj (klor se delno raztopi, baker se raztaplja)
    rnd = random.Random(11)
    zrak = steklo("mehur", 1.0 / N_VODA)
    for ime, st_n in (("L", 70), ("D", 22)):
        s_ = -1 if ime == "L" else 1
        c = plosci[ime]
        for i in range(st_n):
            r = rnd.uniform(0.25, 0.8)
            u = rnd.uniform(-PL["sirina"] / 2 + 1, PL["sirina"] / 2 - 1)
            zz = z_dno + 1 + rnd.random() ** 0.7 * (CASA_GL - PL["nad_dnom"] - 2.5)
            off = -s_ * (PL["debelina"] / 2 + r + rnd.uniform(0, 1.5))
            bm_ = bmesh.new(); bmesh.ops.create_uvsphere(bm_, u_segments=12, v_segments=8, radius=r * MM)
            me = bpy.data.meshes.new(f"meh{ime}{i}"); bm_.to_mesh(me); bm_.free(); gladko(me, 180)
            predmet(f"meh{ime}{i}", me, zrak, "mehurcki", (c[0] + off * n_[0] + u * t_[0], c[1] + off * n_[1] + u * t_[1], zz))
    # sponki na ploščicah: os v ravnini ploščice, nagnjena nazaj; čeljusti se zapirata v smeri normale ploščice
    nag = math.radians(28)
    zad_tek = {}
    for ime, barva in (("L", "crna"), ("D", "rdeca")):
        c = plosci[ime]
        os_x = (t_[0] * math.sin(nag), t_[1] * math.sin(nag), math.cos(nag))
        zad_tek[ime] = tuple(krokodilka(f"spt-{ime}", f"sponke-tekocina", c, os_x, n_, PL["debelina"], barva))
    # magnet: privlači (pola se dotikata žeblja) ali blizu (ne privlači)
    magnet("magnet-privlaci", SX, SY - 1.55)
    magnet("magnet-blizu", SX, SY - 14 - 8)
    # ---------------------------------------------------------------- vodniki
    VOD = {}
    def sponka_na_jeziku(ime, p, barva, nagib):
        stik = (p[0], p[1], p[2] - 3)
        os_x = (math.sin(nagib), 0.0, math.cos(nagib))
        return krokodilka(ime, "vod-" + ime.split("/")[0], stik, os_x, (0, 1, 0), 0.5, barva)
    def tla(x, y):
        return (x, y, 1.6)
    os_t = mathutils.Vector((t_[0] * math.sin(nag), t_[1] * math.sin(nag), math.cos(nag)))
    def izstop(konec, s_):   # kabel izstopi iz tulca vzdolž osi sponke, nato se povesi vstran in navzdol
        k = mathutils.Vector(konec)
        return [tuple(k + 20 * os_t + mathutils.Vector((s_ * 16, 2, -14))), tuple(k + 9 * os_t), tuple(k)]
    # baterija − → leva sponka (trdno / tekočina)
    for var, konec in (("trdno", zad_trdno["L"]), ("tekocina", zad_tek["L"])):
        ime = f"minus-{var}"
        z = sponka_na_jeziku(f"{ime}/s", jez["minus"], "crna", math.radians(-35))
        z = tuple(z)
        pot = [z, (z[0] - 10, z[1] + 4, z[2] + 4), (z[0] - 22, z[1] + 6, z[2] - 20), (-218, 110, 30), tla(-214, 60), tla(-200, 0), tla(-170, -36)]
        if var == "trdno":
            pot += [tla(-90, -44), tla(konec[0] - 22, SY - 1), (konec[0] - 8, SY, konec[2]), konec]
        else:
            pot += [tla(-60, -50), tla(-24, -30), (-18, -24, 40)] + izstop(konec, -1)
        kabel("vod-" + ime, pot, "crna", "vod-" + ime); VOD[ime] = "crna"
    # izhod ploščice → desna sponka
    for var, konec in (("trdno", zad_trdno["D"]), ("tekocina", zad_tek["D"])):
        ime = f"ind-{var}"
        p = vtic(f"vod-{ime}-v", pl["izhod"], "rdeca", "vod-" + ime)
        pot = [p, (p[0], p[1] - 2, p[2] + 16), (p[0] + 6, p[1] - 14, p[2] + 6), tla(p[0] + 12, p[1] - 40), tla(196, 20), tla(190, -30)]
        if var == "trdno":
            pot += [tla(konec[0] + 30, SY - 4), tla(konec[0] + 18, SY), (konec[0] + 8, SY, konec[2]), konec]
        else:
            pot += [tla(112, -20), (100, -16, 40)] + izstop(konec, 1)
        kabel("vod-" + ime, pot, "rdeca", "vod-" + ime); VOD[ime] = "rdeca"
    # baterija + → vhod ploščice (brez ampermetra): za ampermetrom
    p = sponka_na_jeziku("plus-ind/s", jez["plus"], "rdeca", math.radians(35))
    q = vtic("vod-plus-ind-v", pl["vhod"], "rdeca", "vod-plus-ind")
    kabel("vod-plus-ind", [tuple(p), (p[0] + 10, p[1] + 4, p[2] + 4), (p[0] + 22, p[1] + 16, p[2] - 20), tla(-120, 168), tla(-40, 172), tla(60, 168), tla(100, 150),
                           tla(q[0] - 8, q[1] + 34), (q[0] - 2, q[1] + 14, q[2] + 8), (q[0], q[1] + 2, q[2] + 16), q], "rdeca", "vod-plus-ind"); VOD["plus-ind"] = "rdeca"
    # baterija + → ampermeter (mA ali 10 A)
    for vt in ("mA", "10A"):
        ime = "plus-AmA" if vt == "mA" else "plus-A10"
        p = sponka_na_jeziku(f"{ime}/s", jez["plus"], "rdeca", math.radians(35))
        q = vtic(f"vod-{ime}-v", am["vticnice"][vt], "rdeca", "vod-" + ime)
        kabel("vod-" + ime, [tuple(p), (p[0] + 3, p[1] - 2, p[2] - 8), (-134, 84, 50), (-137, 62, 14), tla(-137, 30), tla(-128, -22), tla(q[0] - 6, -30),
                             (q[0] - 2, q[1] - 14, q[2] + 2), (q[0], q[1] - 2, q[2] + 16), q], "rdeca", "vod-" + ime); VOD[ime] = "rdeca"
    # COM → vhod ploščice: ob desni strani ampermetra nazaj in za njim
    q0 = vtic("vod-ACOM-ind-v0", am["vticnice"]["COM"], "crna", "vod-ACOM-ind")
    q1 = vtic("vod-ACOM-ind-v1", pl["vhod"], "crna", "vod-ACOM-ind")
    kabel("vod-ACOM-ind", [q0, (q0[0], q0[1] - 2, q0[2] + 16), (q0[0] + 14, q0[1] - 12, q0[2] + 2), tla(-30, -14), tla(-26, 60), tla(-20, 150), tla(30, 172), tla(90, 160),
                           tla(q1[0] - 8, q1[1] + 34), (q1[0] - 2, q1[1] + 14, q1[2] + 8), (q1[0], q1[1] + 2, q1[2] + 16), q1], "crna", "vod-ACOM-ind"); VOD["ACOM-ind"] = "crna"
    prozorne_sence(["steklo", "meja", "gladina", "mehur", "steklo-tanko", "ps-moder", "halit"])
    bpy.context.view_layer.update()
    # ---------------------------------------------------------------- pogled in sloji
    E = Pogled("prevodnost", 400, 262, 0.92 * math.cos(math.radians(35)), (0, 0, 0), (204, 180), visina=35.0)
    osn = ["studio", "pult", "stalno", "gumb-off"]
    lov = ["pult", "stalno", "gumb-off"]
    sloji = [dict(ime="prevodnost", pogled=E, vidno=osn)]
    for obm in ("200m", "10"):
        sloji.append(dict(ime=f"gumb-{obm}", pogled=E, vidno=["studio", f"gumb-{obm}"], lovilci=["pult", "stalno"], vrsta="prosojno", izrez=okvir_predmetov(E, [f"gumb-{obm}"], 3)))
    for ind in ("zarnica", "zarnica-sveti", "led", "led-sveti"):
        sloji.append(dict(ime="ind-" + ind, pogled=E, vidno=["studio", "ind-" + ind], lovilci=lov, vrsta="prosojno", izrez=okvir_predmetov(E, ["ind-" + ind], 6)))
    for id_ in TRDNE:   # neprosojni izrez: vzorec in sponki s sencama (steklo, folija in halit lomijo pult za seboj)
        sloji.append(dict(ime="vzorec-" + id_, pogled=E, vidno=osn + ["vzorec-" + id_], izrez=okvir_predmetov(E, ["vzorec-" + id_], 14)))
    ok_c = okvir_predmetov(E, ["vzorec-tekocina", "plosci"], 14)
    sloji.append(dict(ime="vzorec-tekocina", pogled=E, vidno=osn + ["vzorec-tekocina", "plosci"], izrez=ok_c))
    sloji.append(dict(ime="vzorec-tekocina-mehurcki", pogled=E, vidno=osn + ["vzorec-tekocina", "plosci", "mehurcki"], izrez=ok_c))
    sloji.append(dict(ime="sponke-tekocina", pogled=E, vidno=["studio", "sponke-tekocina"], lovilci=lov + ["plosci"], vrsta="prosojno", izrez=okvir_predmetov(E, ["sponke-tekocina"], 8)))
    for m_ in ("privlaci", "blizu"):
        sloji.append(dict(ime="magnet-" + m_, pogled=E, vidno=["studio", "magnet-" + m_], lovilci=lov, vrsta="prosojno", izrez=okvir_predmetov(E, ["magnet-" + m_], 10)))
    for ime in VOD:
        sloji.append(dict(ime="vod-" + ime, pogled=E, vidno=["studio", "vod-" + ime], lovilci=lov, vrsta="prosojno", izrez=okvir_predmetov(E, ["vod-" + ime], 10)))
    pr = E.projekcija
    meta = dict(
        poskus="prevodnost",
        sidra={"prevodnost": dict(
            amLcd=[pr(t) for t in am["lcd"]], am=pr((-80, -19, 0)), bat=pr((-170, 89, 0)), lucka=pr((150, 78, 0)), nitka=pr(fil), led=pr(ledp),
            vzorec=pr((SX, SY - 16, 0)), stikL=pr((SX - RAZMIK / 2, SY, 6)), stikD=pr((SX + RAZMIK / 2, SY, 6)), casa=pr((SX, SY - CASA["d"] / 2, 0)),
            potopL=[pr(p) for p in potop["L"]], potopD=[pr(p) for p in potop["D"]], merilo50=[pr((0, -120, 0))[0], pr((50, -120, 0))[0]])},
        merila=dict(prevodnost=round(E.s, 4), visinaKamere=dict(prevodnost=35)),
        zasloni=dict(am=[52, 24]),
        snovi=dict(razmikMm=RAZMIK, debelina=DEBELINA, trdne=TRDNE, tekocine=TEKOCINE, casa=dict(gladinaMm=CASA_GL, **PL)),
        vodniki={k: dict(barva=v) for k, v in VOD.items()},
    )
    return dict(pogledi=[E], sloji=sloji, meta=meta)

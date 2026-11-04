# Ženski spolni organi in mlečni žlezi za 3D atlas (modelirano na novo; Z-Anatomy/BodyParts3D ima le moško telo).
# Zagon (Blender 4.2, brez okna):
#   blender -b --python scripts/atlas/zenski-organi.py -- [izhod.glb] [atlas-zenski.json]
# Privzeto: /home/user/atlas-raw/zenski.glb in public/3d/atlas-zenski.json (glede na koren repozitorija).
# Stiskanje: npx --yes @gltf-transform/cli@4 meshopt <izhod.glb> public/3d/modeli/telo/zenski.glb --level medium
#
# Koordinate: Blender (Z gor, spredaj -Y, +X je leva stran telesa), metri, izhodišče med stopali;
# izvoz z export_yup da enake osi kot ostali modeli atlasa (glTF: Y gor, spredaj +Z).
# Lega je izmerjena na modelih atlasa (okostje, organi, koža): sramna zrastnica ~ (0, -0.045, 0.844),
# vrat sečnega mehurja ~ (0, 0.0155, 0.829), dno mehurja ~ z 0.829, vrh ~ z 0.881, danka za njim,
# stena male medenice ~ |x| 0.055-0.06, 4. medrebrni prostor ~ z 1.27, medioklavikularna črta ~ |x| 0.085.
# Vse oblike so parametrične (prerezi vzdolž krivulj), brez naključnosti razen s fiksnim semenom.
import bpy, bmesh, math, json, os, sys, random
from mathutils import Vector, Matrix, noise

args = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
OUT_GLB = args[0] if len(args) > 0 else "/home/user/atlas-raw/zenski.glb"
OUT_JSON = args[1] if len(args) > 1 else os.path.join(REPO, "public", "3d", "atlas-zenski.json")

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
coll = scene.collection
RNG = random.Random(7)

# ---------------------------------------------------------------- materiali (imena kot v atlasu)
MAT = {}
for name, col in {"Organ": (0.80, 0.42, 0.45), "Gland": (0.93, 0.74, 0.50), "Mucosa": (0.88, 0.52, 0.56),
                  "Ductus": (0.92, 0.66, 0.36), "Skin-1": (0.90, 0.72, 0.62), "Ligament": (0.86, 0.84, 0.74)}.items():
    m = bpy.data.materials.new("A:" + name)
    m.use_nodes = False
    m.diffuse_color = (*col, 1.0)
    MAT[name] = m

# ---------------------------------------------------------------- pomožne funkcije
def V(*a):
    return Vector(a)

def table(tab, s):
    """Linearna interpolacija v tabeli [(s, vrednost), ...]."""
    if s <= tab[0][0]: return tab[0][1]
    for (s0, v0), (s1, v1) in zip(tab, tab[1:]):
        if s <= s1:
            f = (s - s0) / (s1 - s0)
            return v0 + (v1 - v0) * f
    return tab[-1][1]

def smooth01(e0, e1, x):
    t = max(0.0, min(1.0, (x - e0) / (e1 - e0)))
    return t * t * (3 - 2 * t)

class Spline:
    """Catmull-Rom skozi točke, parametrizirana z dolžino loka; zunaj krajišč se nadaljuje v smeri tangente."""
    def __init__(self, pts, res=24):
        p = [Vector(x) for x in pts]
        P = [p[0] * 2 - p[1]] + p + [p[-1] * 2 - p[-2]]
        s = []
        for i in range(1, len(P) - 2):
            p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
            for k in range(res):
                t = k / res
                s.append(0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t
                                + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t))
        s.append(p[-1])
        self.s = s
        self.cum = [0.0]
        for a, b in zip(s, s[1:]):
            self.cum.append(self.cum[-1] + (b - a).length)
        self.L = self.cum[-1]
        self.t0 = (s[1] - s[0]).normalized()
        self.t1 = (s[-1] - s[-2]).normalized()

    def at(self, d):
        if d <= 0: return self.s[0] + self.t0 * d
        if d >= self.L: return self.s[-1] + self.t1 * (d - self.L)
        lo, hi = 0, len(self.cum) - 1
        while hi - lo > 1:
            mid = (lo + hi) // 2
            if self.cum[mid] <= d: lo = mid
            else: hi = mid
        f = (d - self.cum[lo]) / max(1e-12, self.cum[hi] - self.cum[lo])
        return self.s[lo].lerp(self.s[hi], f)

    def tan(self, d):
        e = 0.0008
        if d <= 0: return self.t0.copy()
        if d >= self.L: return self.t1.copy()
        return (self.at(min(d + e, self.L)) - self.at(max(d - e, 0))).normalized()

def loft(rings, n, ref=V(1, 0, 0), shape=None):
    """rings: [(središče, a, b) ...]; a vzdolž osi 'ref' (pravokotno na tangento), b vzdolž T x ref.
    a == b == 0 pomeni pol (zaprt konec). shape(theta, i) -> (ca, cb) spremeni obliko prereza."""
    bm = bmesh.new()
    cs = [Vector(r[0]) for r in rings]
    vrows = []
    for i, r in enumerate(rings):
        c, a, b = Vector(r[0]), r[1], r[2]
        if i == 0: T = cs[1] - cs[0]
        elif i == len(rings) - 1: T = cs[-1] - cs[-2]
        else: T = cs[i + 1] - cs[i - 1]
        if T.length < 1e-9: T = V(0, 0, 1)
        T.normalize()
        rf = ref(i) if callable(ref) else ref
        L = rf - T * rf.dot(T)
        if L.length < 1e-6: L = T.orthogonal()
        L.normalize()
        B = T.cross(L)
        if a < 1e-7 and b < 1e-7:
            vrows.append([bm.verts.new(c)])
            continue
        row = []
        for k in range(n):
            th = 2 * math.pi * k / n
            ca, cb = math.cos(th), math.sin(th)
            if shape: ca, cb = shape(th, i, ca, cb)
            row.append(bm.verts.new(c + L * (a * ca) + B * (b * cb)))
        vrows.append(row)
    for r0, r1 in zip(vrows, vrows[1:]):
        if len(r0) == 1 and len(r1) == 1: continue
        if len(r0) == 1:
            for k in range(n): bm.faces.new((r0[0], r1[k], r1[(k + 1) % n]))
        elif len(r1) == 1:
            for k in range(n): bm.faces.new((r0[(k + 1) % n], r0[k], r1[0]))
        else:
            for k in range(n): bm.faces.new((r0[k], r0[(k + 1) % n], r1[(k + 1) % n], r1[k]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return bm

def sweep(spl, stations, n, ref=V(1, 0, 0), shape=None, step=0.003):
    """stations: [(d, a, b), ...]; d je razdalja vzdolž krivulje v metrih (lahko se vrača nazaj, npr. za odprtine).
    Med postajami so obroči na vsakih ~step metrov (polmera linearno interpolirana); pola se ne delita."""
    rings = []
    for i, (d, a, b) in enumerate(stations):
        if i:
            d0, a0, b0 = stations[i - 1]
            if (a0 > 0 or b0 > 0) and (a > 0 or b > 0):
                k = int(abs(d - d0) / step)
                for j in range(1, k + 1):
                    f = j / (k + 1)
                    rings.append((spl.at(d0 + (d - d0) * f), a0 + (a - a0) * f, b0 + (b - b0) * f))
        rings.append((spl.at(d), a, b))
    return loft(rings, n, ref, shape)

def ellipsoid(center, axes, radii, useg=20, vseg=12, bump=0.0, seed=0):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=useg, v_segments=vseg, radius=1.0)
    ax = [Vector(a).normalized() for a in axes]
    M = Matrix(((ax[0].x * radii[0], ax[1].x * radii[1], ax[2].x * radii[2]),
                (ax[0].y * radii[0], ax[1].y * radii[1], ax[2].y * radii[2]),
                (ax[0].z * radii[0], ax[1].z * radii[1], ax[2].z * radii[2])))
    for v in bm.verts:
        p = v.co.copy()
        if bump:
            p = p * (1.0 + bump * noise.noise(p * 2.7 + V(seed, seed * 0.37, 0)))
        v.co = M @ p + Vector(center)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return bm

def merge(*bms):
    out = bmesh.new()
    for b in bms:
        me = bpy.data.meshes.new("tmp"); b.to_mesh(me); b.free()
        out.from_mesh(me); bpy.data.meshes.remove(me)
    return out

OBJS = []
def make(name, bm, mat, subsurf=0, solidify=0.0):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me); bm.free()
    for p in me.polygons: p.use_smooth = True
    o = bpy.data.objects.new(name, me)
    coll.objects.link(o)
    me.materials.append(MAT[mat])
    o["zid"] = name
    if solidify:
        m = o.modifiers.new("debelina", "SOLIDIFY"); m.thickness = solidify; m.offset = 0.0
    if subsurf:
        m = o.modifiers.new("gladko", "SUBSURF"); m.levels = subsurf; m.render_levels = subsurf
    OBJS.append((name, mat))
    return o

SIDES = (("l", 1.0), ("r", -1.0))
def X(p, sg):
    return V(p[0] * sg, p[1], p[2])

# =================================================================== MALA MEDENICA
# ---- maternica (telo + dno) in maternični vrat: ena krivulja osi, anteverzija in antefleksija
E_OS = V(0, 0.040, 0.865)     # zunanje ustje (v svodu nožnice)
I_OS = V(0, 0.031, 0.891)     # notranje ustje (ožina, isthmus)
UT = Spline([E_OS, I_OS, V(0, 0.011, 0.8985), V(0, -0.013, 0.8995)])
dI = UT.cum[UT.s.index(min(UT.s, key=lambda p: (p - I_OS).length))]
LB = UT.L - dI

cervix = sweep(UT, [
    (0.0065, 0, 0), (0.004, 0.0013, 0.0009), (0.0, 0.0027, 0.0017),        # zunanje ustje (prečna špranja)
    (0.0012, 0.0052, 0.0044), (0.004, 0.0083, 0.0068), (0.009, 0.0106, 0.0084),
    (0.016, 0.0115, 0.0090), (dI - 0.004, 0.0112, 0.0089), (dI, 0.0108, 0.0086),
    (dI + 0.004, 0.0088, 0.0068), (dI + 0.007, 0, 0)], 16, step=0.006)
make("Cervix of uterus", cervix, "Organ", subsurf=1)

def ut_ab(f):
    a = table([(0, 0.0106), (0.1, 0.0125), (0.25, 0.0150), (0.45, 0.0190), (0.65, 0.0228), (0.8, 0.0248),
               (0.89, 0.0244), (0.945, 0.0212), (0.978, 0.0155), (0.996, 0.0075), (1.0, 0.0)], f)
    b = table([(0, 0.0086), (0.1, 0.0096), (0.3, 0.0108), (0.55, 0.0122), (0.82, 0.0126), (0.9, 0.0118),
               (0.95, 0.0100), (0.98, 0.0074), (0.996, 0.0038), (1.0, 0.0)], f)
    return a, b
fs = [0.0, 0.05, 0.12, 0.2, 0.3, 0.42, 0.55, 0.66, 0.76, 0.84, 0.9, 0.945, 0.975, 0.993, 1.0]
uterus = sweep(UT, [(dI - 0.003, 0, 0)] + [(dI + f * LB, *ut_ab(f)) for f in fs], 18, step=0.006)
make("Uterus", uterus, "Organ", subsurf=1)

def ut_frame(f):
    d = dI + f * LB
    T = UT.tan(d); L = V(1, 0, 0); B = T.cross(L).normalized()
    return UT.at(d), T, B
# rogova maternice (vstop jajcevodov) sta na stranskih vogalih dna
HORN_F = 0.86

# ---- jajčnika (3 x 1,5 x 1 cm), v jajčnikovi kotanji ob steni male medenice
OV_C = V(0.045, 0.027, 0.887)
for sfx, sg in SIDES:
    u = V(0.25 * sg, 0.10, 1.0).normalized()
    w = (V(0, 1, 0) - u * u.y).normalized()
    t = u.cross(w)
    bm = ellipsoid(X(OV_C, sg), (u, w, t), (0.0150, 0.0076, 0.0052), 26, 16, bump=0.05, seed=3 if sg > 0 else 11)
    make("Ovary." + sfx, bm, "Gland")

def ovary_pole(sg, upper=True):
    u = V(0.25 * sg, 0.10, 1.0).normalized()
    return X(OV_C, sg) + u * (0.0148 if upper else -0.0148)

# ---- jajcevoda: ožina (isthmus), razširjeni del (ampulla), lijak (infundibulum) z resicami (fimbriae)
for sfx, sg in SIDES:
    c, T, B = ut_frame(HORN_F)
    a, b = ut_ab(HORN_F)
    horn = c + V(sg * (a - 0.004), 0, 0) + B * 0.003
    pts = [horn, horn + V(sg * 0.007, -0.0005, 0.0015),
           V(0.033, -0.0045, 0.9095), V(0.040, -0.0055, 0.9115), V(0.0465, -0.0025, 0.9125),
           V(0.0515, 0.0035, 0.9120), V(0.0545, 0.0115, 0.9105), V(0.0553, 0.0205, 0.9085),
           V(0.0545, 0.0290, 0.9055), V(0.0520, 0.0360, 0.9000), V(0.0485, 0.0410, 0.8925),
           V(0.0445, 0.0420, 0.8845), V(0.0415, 0.0395, 0.8785)]
    pts = pts[:2] + [X(p, sg) for p in pts[2:]]
    sp = Spline(pts)
    L = sp.L
    st = [(0.0, 0, 0), (0.0015, 0.0015, 0.0015)]
    for d, r in [(0.008, 0.0017), (0.018, 0.0018), (0.028, 0.0020), (0.036, 0.0025), (0.046, 0.0031),
                 (0.056, 0.0036), (0.066, 0.0040), (L - 0.012, 0.0043), (L - 0.0065, 0.0050),
                 (L - 0.0025, 0.0062), (L, 0.0071)]:
        st.append((d, r, r))
    st += [(L - 0.0014, 0.0053, 0.0053), (L - 0.0040, 0.0030, 0.0030), (L - 0.0062, 0, 0)]  # trebušno ustje
    def wav(th, i, ca, cb):
        return ca, cb
    tube = sweep(sp, st, 14, ref=V(0, 0, 1))
    # resice: prstasti izrastki na robu lijaka, ena daljša (fimbria ovarica) do zgornjega pola jajčnika
    cE = sp.at(L); TE = sp.tan(L)
    LE = (V(0, 0, 1) - TE * TE.z).normalized(); BE = TE.cross(LE)
    target = ovary_pole(sg, True)
    parts = [tube]
    nf = 16
    ang = [2 * math.pi * i / nf + RNG.uniform(-0.1, 0.1) for i in range(nf)]
    best = min(range(nf), key=lambda i: (cE + (LE * math.cos(ang[i]) + BE * math.sin(ang[i])) * 0.007 - target).length)
    for i in range(nf):
        th = ang[i]
        rad = LE * math.cos(th) + BE * math.sin(th)
        tng = TE.cross(rad)
        base = cE + rad * 0.0064
        if i == best:
            tip = target + (target - X(OV_C, sg)).normalized() * 0.001
            mid = base.lerp(tip, 0.5) + TE * 0.002
            fpts = [base - TE * 0.001, base + (TE * 0.6 + rad * 0.8).normalized() * 0.003, mid, tip]
            ra, rb = 0.0016, 0.0008
        else:
            toward = (target - base).normalized().dot(rad)
            if toward < -0.4 and RNG.random() < 0.5: continue          # na strani stran od jajčnika redkejše
            ln = RNG.uniform(0.0032, 0.0062) * (1.25 if toward > 0.3 else 1.0)
            dirv = (TE * RNG.uniform(0.55, 0.9) + rad * 0.66 + tng * RNG.uniform(-0.35, 0.35)).normalized()
            out = (rad * 0.8 - TE * RNG.uniform(0.2, 0.8) + tng * RNG.uniform(-0.4, 0.4)).normalized()
            fpts = [base - TE * 0.001, base + dirv * ln * 0.45, base + dirv * ln * 0.75 + out * ln * 0.2,
                    base + dirv * ln * 0.85 + out * ln * 0.5]
            ra, rb = RNG.uniform(0.0012, 0.0016), 0.0007
        fs_ = Spline(fpts)
        fl = fs_.L
        parts.append(sweep(fs_, [(0.0, 0, 0), (0.0006, ra * 0.9, rb), (fl * 0.45, ra, rb * 0.9),
                                 (fl * 0.85, ra * 0.7, rb * 0.7), (fl, ra * 0.35, rb * 0.4), (fl + 0.0004, 0, 0)],
                           6, ref=tng, step=0.004))
    make("Uterine tube." + sfx, merge(*parts), "Ductus")

# ---- vezi: okrogla maternična vez (do globokega dimeljskega obroča, skozi dimeljski kanal v veliko sramno ustno)
#      in lastna vez jajčnika (od roga maternice do spodnjega pola jajčnika)
for sfx, sg in SIDES:
    c, T, B = ut_frame(0.80)
    a, b = ut_ab(0.80)
    st_r = c + V(sg * (a - 0.003), 0, 0) - B * 0.003 + T * 0.002
    pts = [st_r, X(V(0.036, -0.019, 0.896), sg), X(V(0.049, -0.032, 0.899), sg), X(V(0.059, -0.042, 0.902), sg),
           X(V(0.0640, -0.0480, 0.9010), sg), X(V(0.0655, -0.0525, 0.8955), sg), X(V(0.0600, -0.0555, 0.8885), sg), X(V(0.051, -0.0580, 0.8805), sg),
           X(V(0.040, -0.0605, 0.870), sg), X(V(0.029, -0.0635, 0.857), sg), X(V(0.021, -0.0665, 0.843), sg)]
    sp = Spline(pts)
    st = [(0, 0, 0), (0.001, 0.0019, 0.0019), (sp.L * 0.4, 0.0019, 0.0019), (sp.L * 0.8, 0.0016, 0.0016),
          (sp.L - 0.002, 0.0011, 0.0011), (sp.L, 0, 0)]
    make("Round ligament of uterus." + sfx, sweep(sp, st, 8, step=0.007), "Ligament")

    c, T, B = ut_frame(0.76)
    a, b = ut_ab(0.76)
    st_o = c + V(sg * (a - 0.003), 0, 0) + B * 0.002 - T * 0.0
    low = ovary_pole(sg, False)
    mid = st_o.lerp(low, 0.5) + V(sg * 0.002, 0.004, -0.004)
    sp = Spline([st_o, mid, low + (low - X(OV_C, sg)).normalized() * -0.002])
    st = [(0, 0, 0), (0.001, 0.0019, 0.0016), (sp.L * 0.5, 0.0017, 0.0014), (sp.L - 0.001, 0.0016, 0.0014), (sp.L, 0, 0)]
    make("Ligament of ovary." + sfx, sweep(sp, st, 8, step=0.006), "Ligament")

# =================================================================== ZUNANJE SPOLOVILO (vulva)
# Sramna reža (srednja črta med velikima sramnima ustnama) od sprednje do zadnje komisure:
CLEFT = Spline([V(0, -0.066, 0.829), V(0, -0.052, 0.805), V(0, -0.033, 0.788), V(0, -0.011, 0.777), V(0, 0.011, 0.775)])
LC = CLEFT.L

def cleft_frame(s):
    d = s * LC
    T = CLEFT.tan(d)
    N = V(0, -T.z, T.y)          # navznoter (gor in nazaj)
    return CLEFT.at(d), T, N

def vpt(s, x, depth):
    c, T, N = cleft_frame(s)
    return c + N * depth + V(x, 0, 0)

D_VEST = [(0.10, 0.006), (0.14, 0.009), (0.40, 0.016), (0.66, 0.017), (0.80, 0.012), (0.88, 0.007)]
B_VEST = [(0.13, 0.0), (0.17, 0.0032), (0.40, 0.0058), (0.55, 0.0076), (0.66, 0.0084), (0.76, 0.0076), (0.86, 0.0)]
S_V, S_M, S_G = 0.66, 0.40, 0.115           # nožnično ustje, zunanje ustje sečnice, glavica ščegetavčka
OR_U, OR_X = 0.0080, 0.0050                 # polosi nožničnega ustja (vzdolž reže, prečno)

def vest_depth(s, x):
    b = max(table(B_VEST, s), 1e-4)
    return table(D_VEST, s) + 0.0015 * max(0.0, 1 - (x / b) ** 2)

def vest_pt(u, x):
    s = S_V + u / LC
    return vpt(s, x, vest_depth(s, x))

# ---- preddvor nožnice: plošča med malima sramnima ustnama z odprtino nožnice
NV, KV = 26, 5
def inside_vest(u, x):
    s = S_V + u / LC
    return 0.13 <= s <= 0.86 and abs(x) <= table(B_VEST, s)
rows = []
for k in range(KV + 1):
    row = []
    for i in range(NV):
        ph = 2 * math.pi * i / NV
        cu, cx = math.cos(ph), math.sin(ph)
        r0 = 1.0 / math.sqrt((cu / OR_U) ** 2 + (cx / OR_X) ** 2)
        lo, hi = r0, 0.08
        for _ in range(30):
            m = (lo + hi) / 2
            if inside_vest(cu * m, cx * m): lo = m
            else: hi = m
        w = (k / KV) ** 1.25
        r = r0 + (lo - r0) * w
        row.append(vest_pt(cu * r, cx * r))
    rows.append(row)
bm = bmesh.new()
vr = [[bm.verts.new(p) for p in row] for row in rows]
for k in range(KV):
    for i in range(NV):
        bm.faces.new((vr[k][i], vr[k][(i + 1) % NV], vr[k + 1][(i + 1) % NV], vr[k + 1][i]))
bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
make("Vestibule of vagina", bm, "Mucosa", solidify=0.0012)

# ---- nožnica: votla cev od ustja v preddvoru do svoda okoli materničnega vratu (sprednja stena ob mehurju)
c0, T0, N0 = cleft_frame(S_V)
O_V = vest_pt(0, 0)
VAG = Spline([O_V, O_V + N0 * 0.012, V(0, 0.021, 0.832), V(0, 0.038, 0.851), V(0, 0.046, 0.872)])
LV = VAG.L
outer = [(0.0, 0.0053, 0.0084), (0.02, 0.0080, 0.0102), (0.08, 0.0104, 0.0084), (0.2, 0.0114, 0.0062),
         (0.4, 0.0124, 0.0056), (0.6, 0.0134, 0.0060), (0.8, 0.0146, 0.0086), (0.92, 0.0154, 0.0118),
         (0.975, 0.0134, 0.0102), (1.0, 0.0085, 0.0062)]
inner = [(0.0, 0.0050, 0.0080), (0.05, 0.0056, 0.0076), (0.12, 0.0070, 0.0062), (0.25, 0.0086, 0.0034), (0.4, 0.0094, 0.0024),
         (0.6, 0.0104, 0.0027), (0.8, 0.0116, 0.0054), (0.92, 0.0124, 0.0088), (0.97, 0.0106, 0.0074)]
st = [(LV * 0.995, 0, 0)] + [(LV * f, a, b) for f, a, b in reversed(inner)] + \
     [(LV * f, a, b) for f, a, b in outer] + [(LV * 1.012, 0, 0)]
make("Vagina", sweep(VAG, st, 20, step=0.005), "Mucosa")

# ---- sečnica (ženska, ~4,5 cm): od vratu mehurja do zunanjega ustja v preddvoru, v sprednji steni nožnice
M_U = vest_pt((S_M - S_V) * LC, 0)
cM, TM, NM = cleft_frame(S_M)
NECK = V(0, 0.0155, 0.833)
URE = Spline([NECK, NECK.lerp(M_U, 0.5) + V(0, 0.002, -0.002), M_U - NM * 0.0006])
LU = URE.L
st = [(0, 0, 0), (0.001, 0.0027, 0.0027), (LU * 0.5, 0.0028, 0.0028), (LU - 0.002, 0.0029, 0.0029),
      (LU - 0.0004, 0.0026, 0.0026), (LU, 0.0015, 0.0012), (LU - 0.0015, 0.0008, 0.0006), (LU - 0.0025, 0, 0)]
make("Female urethra", sweep(URE, st, 12), "Ductus")

# ---- ščegetavček: glavica, telo (s pregibom) in kraka ob sednično-sramnih vejah
G = vpt(S_G, 0, 0.0075)
KNEE = V(0, -0.0595, 0.8325)
UNI = V(0, -0.041, 0.8255)
body = Spline([UNI + V(0, 0.003, -0.001), UNI, KNEE, G + (KNEE - G).normalized() * 0.002])
lb = body.L
parts = [sweep(body, [(0, 0, 0), (0.002, 0.0040, 0.0034), (lb * 0.45, 0.0046, 0.0040), (lb * 0.8, 0.0038, 0.0034),
                      (lb, 0.0028, 0.0026), (lb + 0.001, 0, 0)], 12)]
gd = (G - KNEE).normalized()
gx = V(1, 0, 0); gy = gd.cross(gx)
parts.append(ellipsoid(G + gd * 0.001, (gx, gy, gd), (0.0034, 0.0031, 0.0042), 14, 10))
for sg in (1.0, -1.0):
    cr = Spline([UNI + V(0, 0.002, 0), X(V(0.009, -0.029, 0.8195), sg), X(V(0.016, -0.012, 0.8125), sg),
                 X(V(0.023, 0.006, 0.8065), sg), X(V(0.030, 0.025, 0.8025), sg)])
    lc = cr.L
    parts.append(sweep(cr, [(0, 0, 0), (0.002, 0.0034, 0.0030), (lc * 0.25, 0.0042, 0.0034), (lc * 0.6, 0.0034, 0.0028),
                            (lc * 0.85, 0.0024, 0.0020), (lc * 0.97, 0.0017, 0.0014), (lc + 0.0012, 0, 0)], 10, ref=V(0, 0, 1)))
make("Clitoris", merge(*parts), "Organ")

# ---- kapica ščegetavčka (prepucij): odprt ovoj nad hrbtno in stransko stranjo glavice, spodaj (proti preddvoru) odprt
bm = bmesh.new()
gx = V(1, 0, 0); gb = gd.cross(gx).normalized()
if gb.y > 0: gb = -gb                      # hrbtna (sprednja) stran glavice
NH, KH = 16, 8
th0, th1 = math.radians(-30), math.radians(210)
hood = []
for k in range(KH + 1):
    f = k / KH
    c = G - gd * 0.008 + gd * 0.0115 * f
    rad = 0.0050 + 0.0012 * math.sin(math.pi * min(1.0, f * 1.4)) - 0.0010 * f
    hood.append([bm.verts.new(c + gx * (rad * math.cos(th0 + (th1 - th0) * i / NH)) + gb * (rad * 1.05 * math.sin(th0 + (th1 - th0) * i / NH)))
                 for i in range(NH + 1)])
for k in range(KH):
    for i in range(NH):
        bm.faces.new((hood[k][i], hood[k][i + 1], hood[k + 1][i + 1], hood[k + 1][i]))
bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
make("Prepuce of clitoris", bm, "Mucosa", solidify=0.0011)

# ---- mali sramni ustni (ob robu preddvora) in veliki sramni ustni (kožni gubi z maščevjem)
XL = [(0.07, 0.0042), (0.15, 0.0050), (0.40, 0.0070), (0.55, 0.0088), (0.66, 0.0097), (0.76, 0.0089), (0.84, 0.0052), (0.875, 0.0036)]
HM = [(0.07, 0.003), (0.12, 0.007), (0.25, 0.0105), (0.45, 0.0125), (0.62, 0.0115), (0.75, 0.0085), (0.83, 0.005), (0.875, 0.002)]
XI = [(-0.06, 0.0060), (0.0, 0.0045), (0.08, 0.0050), (0.18, 0.0068), (0.40, 0.0094), (0.62, 0.0122), (0.76, 0.0114), (0.88, 0.0070), (0.95, 0.0030), (1.0, -0.0010)]
WM = [(-0.06, 0.0095), (0.0, 0.0115), (0.10, 0.0120), (0.30, 0.0106), (0.50, 0.0095), (0.70, 0.0084), (0.85, 0.0068), (0.94, 0.0048), (1.0, 0.0028)]
HJ = [(-0.06, 0.0080), (0.0, 0.0098), (0.10, 0.0110), (0.45, 0.0115), (0.75, 0.0102), (0.90, 0.0076), (1.0, 0.0036)]
for sfx, sg in SIDES:
    ss = [0.07 + (0.875 - 0.07) * i / 15 for i in range(16)]
    rings = [(vpt(0.06, sg * 0.0045, table(D_VEST, 0.1) - 0.001), 0, 0)]
    for s in ss[1:-1]:
        hm = table(HM, s)
        rings.append((vpt(s, sg * (table(XL, s) + 0.0017 + 0.18 * hm), table(D_VEST, s) - hm * 0.45), 0.0017, hm * 0.55))
    rings.append((vpt(0.885, sg * 0.004, table(D_VEST, 0.88) - 0.001), 0, 0))
    make("Labium minus." + sfx, loft(rings, 10), "Mucosa", subsurf=1)

    ss = [-0.06 + 1.06 * i / 18 for i in range(19)]
    rings = [(vpt(-0.08, sg * 0.013, 0.009), 0, 0)]
    for s in ss:
        w, h = table(WM, s), table(HJ, s)
        rings.append((vpt(s, sg * (table(XI, s) + w), h - 0.0035 + 0.006 * smooth01(0.02, -0.06, s)), w, h))
    rings.append((vpt(1.014, sg * 0.0005, 0.002), 0, 0))
    def lm_shape(th, i, ca, cb, sg=sg):
        # medialna ploskev (proti mali ustni) bolj ploska, stranska polna
        return (ca * 0.8 if ca * sg < 0 else ca), cb
    make("Labium majus." + sfx, loft(rings, 10, shape=lm_shape), "Skin-1", subsurf=1)

# ---- sramni grič (mons pubis): maščobna blazinica pred sramno zrastnico
# sprednja površina sledi koži atlasa (y kože v srednji črti po višini), zadnja stran je sploščena ob zrastnico
SKIN_MID = [(0.822, -0.0640), (0.830, -0.0675), (0.840, -0.0725), (0.850, -0.0790), (0.860, -0.0840), (0.870, -0.0870),
            (0.880, -0.0930), (0.890, -0.1000), (0.900, -0.1020)]
rings = []
zs = [0.818, 0.822, 0.830, 0.840, 0.850, 0.860, 0.868, 0.875, 0.880, 0.883]
AM = [(0.818, 0.0), (0.822, 0.009), (0.830, 0.017), (0.840, 0.024), (0.855, 0.029), (0.868, 0.031), (0.876, 0.028), (0.881, 0.019), (0.883, 0.0)]
BM = [(0.818, 0.0), (0.822, 0.0042), (0.830, 0.0065), (0.845, 0.0082), (0.862, 0.0082), (0.875, 0.0064), (0.881, 0.0040), (0.883, 0.0)]
for z in zs:
    a, b = table(AM, z), table(BM, z)
    rings.append((V(0, table(SKIN_MID, z) - 0.0022 + b, z), a, b))
def mons_shape(th, i, ca, cb):
    # spredaj (cb < 0) poln lok, zadaj sploščeno; ob straneh se blazinica nagne nazaj s kožo
    return ca, (cb * 0.5 if cb > 0 else cb) + 0.9 * ca * ca
make("Mons pubis", loft(rings, 20, shape=mons_shape), "Skin-1", subsurf=1)

# ---- veliki preddvorni žlezi (Bartholinovi), za nožničnim ustjem
for sfx, sg in SIDES:
    s = 0.745
    c, T, N = cleft_frame(s)
    make("Greater vestibular gland." + sfx,
         ellipsoid(vpt(s, sg * 0.0106, table(D_VEST, s) + 0.0068), (T, V(1, 0, 0), N), (0.0055, 0.0034, 0.0044), 12, 8), "Gland")

# =================================================================== MLEČNI ŽLEZI
# Površina kože prsnega koša (levo, y v metrih) iz modela kože atlasa; x 0..0.17 po 0.01, z 1.15..1.39 po 0.02.
SKX = [i * 0.01 for i in range(18)]
SKZ = [1.15 + i * 0.02 for i in range(13)]
SKY = [
 [-.129,-.131,-.132,-.132,-.131,-.129,-.127,-.123,-.118,-.112,-.105,-.098,-.090,-.078,-.063,-.042,-.020,-.005],
 [-.129,-.130,-.131,-.132,-.131,-.131,-.129,-.126,-.122,-.116,-.110,-.103,-.095,-.083,-.068,-.046,-.022,-.005],
 [-.127,-.129,-.130,-.131,-.131,-.131,-.130,-.127,-.123,-.117,-.111,-.104,-.096,-.085,-.069,-.046,-.005,.010],
 [-.124,-.126,-.127,-.129,-.130,-.129,-.128,-.126,-.122,-.117,-.112,-.104,-.095,-.084,-.068,-.045,-.007,.010],
 [-.120,-.121,-.123,-.125,-.127,-.127,-.126,-.124,-.121,-.118,-.114,-.108,-.100,-.086,-.066,-.041,-.005,.010],
 [-.117,-.119,-.122,-.126,-.128,-.129,-.129,-.129,-.128,-.126,-.123,-.118,-.110,-.099,-.078,-.042,-.003,.010],
 [-.113,-.118,-.124,-.127,-.129,-.130,-.129,-.129,-.127,-.125,-.122,-.118,-.112,-.104,-.090,-.066,-.003,.010],
 [-.112,-.117,-.122,-.124,-.126,-.126,-.125,-.124,-.122,-.120,-.118,-.115,-.108,-.100,-.089,-.073,-.049,-.030],
 [-.106,-.111,-.115,-.117,-.118,-.118,-.117,-.116,-.114,-.111,-.107,-.103,-.098,-.090,-.080,-.066,-.049,-.028],
 [-.097,-.101,-.105,-.108,-.109,-.108,-.107,-.106,-.103,-.100,-.097,-.091,-.085,-.077,-.068,-.056,-.041,-.031],
 [-.091,-.094,-.097,-.098,-.098,-.097,-.097,-.095,-.093,-.089,-.085,-.080,-.073,-.065,-.056,-.044,-.034,-.025],
 [-.080,-.082,-.084,-.085,-.085,-.084,-.083,-.081,-.078,-.075,-.071,-.066,-.059,-.051,-.041,-.032,-.025,-.020],
 [-.066,-.067,-.069,-.070,-.069,-.068,-.066,-.063,-.060,-.056,-.051,-.044,-.035,-.027,-.022,-.019,-.016,-.014]]
# rahlo zgladimo (moška prsna mišica ima izboklino)
SKS = [[sum(SKY[min(max(j + dj, 0), 12)][min(max(i + di, 0), 17)] for dj in (-1, 0, 1) for di in (-1, 0, 1)) / 9
        for i in range(18)] for j in range(13)]

def skin_y(x, z):
    x = min(max(abs(x), 0.0), 0.1699); z = min(max(z, 1.15), 1.3899)
    i = int(x / 0.01); j = int((z - 1.15) / 0.02)
    fx = x / 0.01 - i; fz = (z - 1.15) / 0.02 - j
    a = SKS[j][i] * (1 - fx) + SKS[j][i + 1] * fx
    b = SKS[j + 1][i] * (1 - fx) + SKS[j + 1][i + 1] * fx
    return a * (1 - fz) + b * fz

def wall(x, z):
    """Točka na prsni steni (fascija velike prsne mišice) in zunanja normala."""
    y = skin_y(x, z) + 0.006
    e = 0.004
    fx = (skin_y(abs(x) + e, z) - skin_y(abs(x) - e, z)) / (2 * e) * (1 if x >= 0 else -1)
    fz = (skin_y(x, z + e) - skin_y(x, z - e)) / (2 * e)
    return V(x, y, z), V(fx, -1.0, fz).normalized()

BC = (0.088, 1.276)          # središče baze dojke (2.-6. rebro, od roba prsnice do srednje pazdušne črte)
RX, RZ, HB = 0.060, 0.074, 0.042
SAG = 0.009

def h_env(rho, ph):
    if rho >= 1: return 0.0
    return HB * (1 - rho * rho) ** 0.6 * (1 + 0.12 * rho * (-math.sin(ph)))

def breast_pt(sg, rho, ph, height):
    x = sg * (BC[0] + rho * RX * math.cos(ph)); z = BC[1] + rho * RZ * math.sin(ph)
    W, n = wall(x, z)
    return W + n * height - V(0, 0, SAG * height / HB)

def inside(sg, rho, ph, f):
    """Točka znotraj žleze: f = 0 ob prsni steni, 1 tik pod podkožjem."""
    h = h_env(rho, ph)
    return breast_pt(sg, rho, ph, 0.004 + f * max(h - 0.012, 0.002))

def breast_off(sg, du, dv, height):
    """Kot breast_pt, a z absolutnim odmikom (du lateralno, dv navzgor) od središča baze."""
    rho = math.hypot(du / RX, dv / RZ); ph = math.atan2(dv / RZ, du / RX)
    return breast_pt(sg, rho, ph, height(rho, ph) if callable(height) else height)

NL = 18
for sfx, sg in SIDES:
    apex = breast_pt(sg, 0.0, 0.0, HB)
    Wc, nc = wall(sg * BC[0], BC[1])
    napex = (V(nc.x * 0.5, nc.y, nc.z) * HB - V(0, 0, SAG * 0.7)).normalized()
    e1 = V(1, 0, 0) - napex * napex.x; e1.normalize(); e2 = napex.cross(e1)
    lobes, ducts = [], []
    phs = [2 * math.pi * (k + 0.5) / NL + RNG.uniform(-0.05, 0.05) for k in range(NL)]
    tail = min(range(NL), key=lambda k: abs(math.atan2(math.sin(phs[k] - 0.8), math.cos(phs[k] - 0.8))))
    for k, ph in enumerate(phs):
        r1 = 1.22 if k == tail else RNG.uniform(0.88, 0.95)          # pazdušni podaljšek proti pazduhi
        r0 = RNG.uniform(0.07, 0.10)
        m = 11
        rings = []
        for j in range(m + 1):
            t = j / m
            rho = r0 + (r1 - r0) * t
            rr = min(rho, 0.96)
            hh = max(h_env(rr, ph), 0.013)
            c = breast_pt(sg, min(rho, 1.2), ph, 0.004 + 0.5 * max(hh - 0.0075, 0.004))
            env = (math.sqrt(max(0.0, 1 - ((0.08 - t) / 0.08) ** 2)) if t < 0.08 else 1.0) * \
                  (math.sqrt(max(0.0, 1 - ((t - 0.72) / 0.28) ** 2)) if t > 0.72 else 1.0)
            lump = 1 + 0.10 * math.sin(t * math.pi * 6 + k * 1.7)
            a = 0.48 * max(hh - 0.0075, 0.006) * env * lump                       # debelina (pravokotno na steno)
            b = 1.7 * math.pi * min(max(rho, 0.2), 0.95) * math.sqrt(RX * RZ) / NL * env * lump   # širina; režnji se prekrivajo
            if j == 0 or j == m: a = b = 0
            rings.append((c, a, b))
        Wm, nm = wall(sg * (BC[0] + 0.5 * RX * math.cos(ph)), BC[1] + 0.5 * RZ * math.sin(ph))
        lobes.append(loft(rings, 10, ref=nm))
        # mlečni vod: iz režnja proti bradavici, pod kolobarjem razširjen v mlečni sinus
        lat = e1 * (math.cos(ph) * sg) + e2 * math.sin(ph)
        tip = apex + napex * 0.0088 + lat * 0.0024
        base = apex - napex * 0.0015 + lat * 0.0030
        pts = [inside(sg, 0.56, ph, 0.5), inside(sg, 0.38, ph, 0.55), inside(sg, 0.22, ph, 0.66),
               inside(sg, 0.09, ph, 0.84), base, tip]
        sp = Spline(pts)
        Ld = sp.L
        dsin = sp.cum[min(range(len(sp.s)), key=lambda q: (sp.s[q] - pts[3]).length)]
        st = [(0, 0, 0), (0.0008, 0.0010, 0.0010), (Ld * 0.35, 0.0012, 0.0012), (dsin - 0.012, 0.0014, 0.0014),
              (dsin - 0.004, 0.0026, 0.0026), (dsin + 0.002, 0.0022, 0.0022), (dsin + 0.007, 0.0010, 0.0010),
              (Ld - 0.0012, 0.0007, 0.0007), (Ld, 0, 0)]
        ducts.append(sweep(sp, st, 6, ref=napex, step=0.009))
        for dph, f2 in ((-0.12, 0.42), (0.12, 0.6)):
            bp = Spline([inside(sg, 0.50, ph, 0.5), inside(sg, 0.66, ph + dph, f2), inside(sg, 0.80, ph + dph * 1.4, f2)])
            ducts.append(sweep(bp, [(0, 0, 0), (0.0006, 0.0008, 0.0008), (bp.L * 0.6, 0.0006, 0.0006), (bp.L, 0, 0)],
                               5, ref=napex, step=0.012))
    make("Mammary gland." + sfx, merge(*lobes), "Gland")
    make("Lactiferous ducts." + sfx, merge(*ducts), "Ductus")
    # bradavica (premer ~1,1 cm), usmerjena rahlo navzven in navzdol
    sp = Spline([apex - napex * 0.002, apex + napex * 0.004, apex + napex * 0.009])
    st = [(0, 0, 0), (0.0005, 0.0070, 0.0070), (0.0025, 0.0058, 0.0058), (0.004, 0.0055, 0.0055), (0.0075, 0.0051, 0.0051), (0.0097, 0.0042, 0.0042),
          (0.0108, 0.0026, 0.0026), (0.0113, 0, 0)]
    make("Nipple." + sfx, sweep(sp, st, 16, ref=e1, step=0.002), "Skin-1")
    # kolobar (areola): tanka okrogla leča na površini dojke (premer ~3,6 cm), rob se stanjša v nič
    bm = bmesh.new()
    NA, KA, RA = 28, 5, 0.018
    def aring(r, top):
        q = (r / RA) ** 2
        dh = (0.0004 + 0.0005 * (1 - q)) if top else (-0.0004 - 0.0006 * (1 - q))
        dh = dh * (1 - q ** 3) - 0.0002 * q ** 3
        return [bm.verts.new(breast_off(sg, r * math.cos(2 * math.pi * i / NA), r * math.sin(2 * math.pi * i / NA),
                                        lambda rho, ph: h_env(rho, ph) + dh)) for i in range(NA)]
    radii = [0.003 + (RA - 0.003) * kk / KA for kk in range(KA + 1)]
    top = [aring(r, True) for r in radii]
    bot = [aring(r, False) for r in radii[:-1]] + [top[-1]]
    ct = bm.verts.new(breast_pt(sg, 0.0, 0.0, HB + 0.0009)); cb = bm.verts.new(breast_pt(sg, 0.0, 0.0, HB - 0.0010))
    for rows_, c_ in ((top, ct), (bot, cb)):
        for i in range(NA): bm.faces.new((c_, rows_[0][i], rows_[0][(i + 1) % NA]))
        for kk in range(KA):
            for i in range(NA):
                bm.faces.new((rows_[kk][i], rows_[kk][(i + 1) % NA], rows_[kk + 1][(i + 1) % NA], rows_[kk + 1][i]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    make("Areola." + sfx, bm, "Skin-1")

# =================================================================== izvoz
dg = bpy.context.evaluated_depsgraph_get()
P_INT = ["Visceral systems", "Genital systems", "Female genital system", "Female internal genitalia"]
P_EXT = ["Visceral systems", "Genital systems", "Female genital system", "Female external genitalia"]
P_MAM = ["Visceral systems", "Mammary glands"]
POT = {"Uterus": P_INT, "Cervix of uterus": P_INT, "Ovary": P_INT, "Uterine tube": P_INT, "Vagina": P_INT,
       "Round ligament of uterus": P_INT, "Ligament of ovary": P_INT,
       "Mons pubis": P_EXT, "Labium majus": P_EXT, "Labium minus": P_EXT, "Clitoris": P_EXT,
       "Prepuce of clitoris": P_EXT, "Vestibule of vagina": P_EXT, "Greater vestibular gland": P_EXT,
       "Female urethra": ["Visceral systems", "Urinary system"], "Mammary gland": P_MAM}
rows, total = [], 0
for name, mat in OBJS:
    o = bpy.data.objects[name]
    ev = o.evaluated_get(dg); me = ev.to_mesh()
    tri = sum(len(p.vertices) - 2 for p in me.polygons); total += tri
    vs = [o.matrix_world @ v.co for v in me.vertices]
    lo = [min(v[i] for v in vs) for i in range(3)]; hi = [max(v[i] for v in vs) for i in range(3)]
    ev.to_mesh_clear()
    side = name[-1] if name[-2:] in (".l", ".r") else ""
    base = name[:-2] if side else name
    pot = POT.get(base) or (P_MAM + ["Mammary gland." + side])
    rows.append({"id": name, "ime": base, "stran": side, "sistem": "organi", "pot": pot, "material": mat,
                 "c": [round((lo[0] + hi[0]) / 2, 4), round((lo[2] + hi[2]) / 2, 4), round(-(lo[1] + hi[1]) / 2, 4)],
                 "r": round(max(hi[i] - lo[i] for i in range(3)), 4)})
    print(f"[zenski] {name:32s} {tri:6d} trikotnikov")
print("[zenski] skupaj trikotnikov:", total)

# Moške strukture iz atlas-strukture.json, ki jih v načinu »Žensko« skrijemo.
SKRIJ = ["Testis.l", "Testis.r", "Epididymis.l", "Epididymis.r", "Ductus deferens.l", "Ductus deferens.r",
         "Seminal gland.l", "Seminal gland.r", "Ejaculatory duct.l", "Ejaculatory duct.r", "Prostate",
         "Glans penis", "Corpus cavernosum of penis", "Corpus spongiosum of penis", "Urethra",
         "Urogenital region.l", "Urogenital region.r",
         "Right testicular artery.r", "Left testicular artery", "Right testicular vein", "Left testicular vein",
         "Deep artery of penis.l", "Deep artery of penis.r", "Dorsal artery of penis.l", "Dorsal artery of penis.r",
         "Deep dorsal vein of penis", "Superficial dorsal veins of penis"]
with open(OUT_JSON, "w", encoding="utf-8") as f:
    json.dump({"strukture": rows, "skrij": SKRIJ}, f, ensure_ascii=False, separators=(",", ":"))

os.makedirs(os.path.dirname(OUT_GLB), exist_ok=True)
bpy.ops.export_scene.gltf(
    filepath=OUT_GLB, export_format="GLB", use_selection=False, export_apply=True,
    export_materials="EXPORT", export_normals=True, export_texcoords=False, export_yup=True,
    export_extras=True, export_animations=False, export_skins=False, export_morph=False,
    export_lights=False, export_cameras=False)
print("[zenski] zapisano:", OUT_GLB, OUT_JSON)

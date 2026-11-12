# Atlas v2: postopek za eno kost (prototip na stegnenici, F0; od h1 tudi nadlahtnica). Kost = »objekt« v --info / viru
# (Femur.l, Humerus.l …); vse, kar je odvisno od kosti (mejniki, makro anatomija, hrustanec, odprtine, poročilo), je v
# podrobnosti_<slovensko ime>.py (podrobnosti_stegnenica.py, podrobnosti_nadlahtnica.py), ki jih postopek izvede v svojem
# imenskem prostoru (podrobnosti("makro"/"hrapavost"/"odprtine"/"porocilo")). Spodnji opis korakov je za stegnenico. Zažene se s Pythonom, ki ima modul bpy 5.2.3
# (pip install bpy==5.2.3; na RTX prenosniku Blenderjev Python, glej rtx-naloga.json):
#   python3 scripts/atlas/v2/postopek.py --vhod <Femur.l.ply> --info <Femur.l.json> --izhod <mapa>
#           [--kakovost cpu|rtx] [--naprava CPU|OPTIX|CUDA] [--brez-peke]
# Vhod: izvozi_kost.py (Z-Anatomy Startup.blend, CC BY-SA 4.0). Koraki:
#   1 čiščenje (lega iz matrix_basis, zrcaljenje → obrnjen vrstni red, zvar, izrojene in podvojene ploskve)
#   2 gladka zaprta mnogoterna mreža: Catmull-Clark (2) proti stopničastim ploskvam vira, voxel remesh, rahlo glajenje;
#     hrustanec z vira (najbližja ploskev), obris zglajen (~3 mm), facies patellaris sega višje. Nato »makro« anatomija
#     kot prava geometrija (v obrisu in nizki mreži): linea aspera (pilaster + ustnici), glutealna grčavina, spiralna in
#     pektinealna linija, suprakondilarni liniji, večji stožčast mali obrtec, intertrohanterni greben s kvadratno grčico,
#     intertrohanterna linija, trohanterna jama, epikondila, adduktorska grčica, globlja medkondilarna jama, izrazitejša
#     zadnja kondila; izvrtina fovee iz vira zapolnjena (krogla), nova fovea capitis plitva (1,6 mm) pod in za
#     središčem glavice. Drugi voxel remesh → zaprta mnogoterna mreža G.
#   3 visoka mreža = G + fine podrobnosti: kompakta (fina hrapavost, komaj vidne vzdolžne brazde), mehka grčavost
#     pripojev (brez |šuma|: ta je v v2s2 dal razpoke v AO), ena hranilna odprtina, drobne žilne odprtine na vratu in
#     metafizah; sklepni hrustanec gladek, 0,3 mm dvignjen z mehkim robom. Barve in hrapavost kot atributi oglišč.
#   4 nizki mreži za telefon in računalnik (QuadriFlow, sicer zmanjšanje), UV (Smart UV + pakiranje)
#   5 peka z visoke na nizko (Cycles): normala (tangentna), AO, barva, hrapavost → ORM; cpu = nizka ločljivost
#   6 GLB (WebP teksture, tangente) za telefon in računalnik v obeh videzih + delo.blend (par za peko) + porocilo.json
import json, math, os, re, sys, time

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import kost  # noqa: E402

a = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else sys.argv[1:]  # tudi blender -b --python … -- <arg>


def z(ime, privzeto=None):
    return a[a.index(ime) + 1] if ime in a else privzeto


VHOD, INFO, IZHOD = z("--vhod"), z("--info"), z("--izhod")
KAKOVOST = z("--kakovost", "cpu")
NAPRAVA = z("--naprava", "CPU").upper()
BREZ_PEKE = "--brez-peke" in a
os.makedirs(IZHOD, exist_ok=True)
VIR_JSON = VHOD.endswith(".json")  # podrobnejši vir (bp3d_vir.py): mreža že v koordinatah atlasa, hrustanec kot material
if VIR_JSON:
    _V_VIR, _F_VIR, _DOD_VIR, info = kost.beri_vir(VHOD)
else:
    with open(INFO, encoding="utf-8") as f:
        info = json.load(f)
OBJEKT = re.sub(r"\.\d{3}$", "", info["objekt"])  # ime v Z-Anatomy, npr. »Femur.l«
OSNOVA, STRAN_IZ_IMENA = kost.razcleni(OBJEKT)
STRAN = z("--stran", STRAN_IZ_IMENA)
IME = kost.ime_datoteke(OBJEKT)  # imena izhodnih datotek, npr. »stegnenica-leva-racunalnik-realisticno.glb«
if OSNOVA not in kost.PODROBNOSTI:
    sys.exit(f"[v2] {OBJEKT}: postopek ima anatomske podrobnosti samo za {', '.join(sorted(kost.PODROBNOSTI))}")
# Anatomske podrobnosti kosti: podrobnosti_<slovensko ime>.py ob tej datoteki (v paketu RTX v koda/), odseki »# %% <ime>«.
# Odsek se izvede v imenskem prostoru tega postopka (kot da bi bil napisan tu); številke vrstic v napakah so iz te datoteke.
_POD_POT = os.path.join(os.path.dirname(os.path.abspath(__file__)), f"podrobnosti_{kost.IMENA[OSNOVA]}.py")
_ODSEKI = {}
with open(_POD_POT, encoding="utf-8") as _f:
    _ime = None
    for _i, _v in enumerate(_f.read().split("\n")):
        if _v.startswith("# %% "):
            _ime = _v[5:].strip(); _ODSEKI[_ime] = [_i + 1, []]
        elif _ime:
            _ODSEKI[_ime][1].append(_v)


def podrobnosti(ime):
    """Izvede odsek »ime« iz podrobnosti_<kost>.py v imenskem prostoru postopka (makro, hrapavost, odprtine, porocilo)."""
    zacetek, vrstice = _ODSEKI[ime]
    exec(compile("\n" * zacetek + "\n".join(vrstice), _POD_POT, "exec"), globals())


# Proračuni (načrt §1.3: telo ≤ 1,5 M telefon / ≤ 4 M računalnik; stegnenica je največja kost: ~1 % proračuna okostja)
PRORACUN = {"telefon": 12000, "racunalnik": 16000}  # telefon v3s2: 6000 → 10000 (obris kondilov je bil oglat), v4s3 → 12000 (obris glavice in vratu); GLB ≤ 1 MB
NASTAVITVE = {
    #       voxel (m)  tekstura peke  izvoz {telefon, računalnik}  vzorci AO
    "cpu": dict(voxel=0.0007, peka=1024, izvoz={"telefon": 512, "racunalnik": 1024}, vzorci=16),
    "rtx": dict(voxel=0.00025, peka=4096, izvoz={"telefon": 1024, "racunalnik": 2048}, vzorci=128),
}[KAKOVOST]
casi = {}
T0 = time.time()


def korak(ime):
    casi[ime] = round(time.time() - T0, 1)
    print(f"[v2] {ime} ({casi[ime]} s)", flush=True)


import bpy  # noqa: E402
import bmesh  # noqa: E402
from mathutils.bvhtree import BVHTree  # noqa: E402

C = kost.C_BL2GL  # glTF ← Blender; Blender ← glTF = C.T


def nova_scena():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def v_blender(Vg):
    return Vg @ C  # (C.T @ v) za vsako vrstico


def iz_blenderja(Vb):
    return Vb @ C.T


def mreza_obj(ime, Vg, F, material=None):
    me = bpy.data.meshes.new(ime)
    me.from_pydata(v_blender(Vg).tolist(), [], np.asarray(F).tolist())
    if material is not None:
        me.polygons.foreach_set("material_index", np.asarray(material, np.int32))
    me.update()
    ob = bpy.data.objects.new(ime, me)
    bpy.context.scene.collection.objects.link(ob)
    return ob


def aktiviraj(ob, izbrani=()):
    for o in bpy.context.view_layer.objects:
        o.select_set(False)
    for o in izbrani:
        o.select_set(True)
    ob.select_set(True)
    bpy.context.view_layer.objects.active = ob


def uporabi(ob, tip, **k):
    m = ob.modifiers.new(tip.lower(), tip)
    for kk, v in k.items():
        setattr(m, kk, v)
    aktiviraj(ob)
    bpy.ops.object.modifier_apply(modifier=m.name)


def np_mreza(ob):
    me = ob.data
    me.calc_loop_triangles()
    V = np.zeros(len(me.vertices) * 3); me.vertices.foreach_get("co", V)
    T = np.zeros(len(me.loop_triangles) * 3, np.int64); me.loop_triangles.foreach_get("vertices", T)
    return iz_blenderja(V.reshape(-1, 3)), T.reshape(-1, 3)


def np_normale(ob):
    me = ob.data
    N = np.zeros(len(me.vertices) * 3); me.vertex_normals.foreach_get("vector", N)
    return iz_blenderja(N.reshape(-1, 3))


def nastavi_oglisca(ob, Vg):
    ob.data.vertices.foreach_set("co", v_blender(Vg).ravel())
    ob.data.update()


def sosedi(nv, F):
    """Robovi mreže (brez scipy: Blenderjev Python ga nima) in stopnja oglišč."""
    e = np.unique(np.sort(np.concatenate([F[:, [0, 1]], F[:, [1, 2]], F[:, [2, 0]]]), 1), axis=0)
    d = np.bincount(e.ravel(), minlength=nv).astype(float)
    return e, np.maximum(d, 1)


def zgladi_polje(x, E, d, krat):
    n = len(x)
    for _ in range(krat):  # bincount: ~20× hitreje kot np.add.at (RTX mreža ima 1,4 M oglišč)
        s = np.bincount(E[:, 0], x[E[:, 1]], n) + np.bincount(E[:, 1], x[E[:, 0]], n)
        x = 0.5 * x + 0.5 * s / d
    return x


# ---------- šum (vektorski, ponovljiv) ----------
def _hash(ix, iy, iz):
    h = (ix * 73856093) ^ (iy * 19349663) ^ (iz * 83492791)
    h = (h ^ (h >> 13)) * 1274126177
    return ((h ^ (h >> 16)) & 0xFFFFFF) / float(0xFFFFFF)


def sum3(P):
    """Vrednostni šum [-1, 1] s smoothstep interpolacijo; P v enotah celic."""
    i = np.floor(P).astype(np.int64); f = P - i; u = f * f * (3 - 2 * f)
    out = 0
    for dx in (0, 1):
        for dy in (0, 1):
            for dz in (0, 1):
                w = (u[:, 0] if dx else 1 - u[:, 0]) * (u[:, 1] if dy else 1 - u[:, 1]) * (u[:, 2] if dz else 1 - u[:, 2])
                out = out + w * _hash(i[:, 0] + dx, i[:, 1] + dy, i[:, 2] + dz)
    return out * 2 - 1


def fbm(P, oktave=4, lak=2.03, ojac=0.5):
    s, a_, f = 0, 1.0, 1.0
    for k in range(oktave):
        s = s + a_ * sum3(P * f + k * 17.31)
        a_ *= ojac; f *= lak
    return s


def gauss(x, s):
    return np.exp(-0.5 * (x / s) ** 2)


def smooth(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


# =============================== 1 čiščenje ===============================
nova_scena()
V, F, dod = (_V_VIR, _F_VIR, _DOD_VIR) if VIR_JSON else kost.beri_ply(VHOD)
V, zrcaljeno = kost.v_atlas(V, info)
if zrcaljeno:
    F = F[:, ::-1]
mat = dod.get("material", np.zeros(len(F), int))
V, F = kost.zvari(V, F)
ok = np.linalg.norm(kost.ploskve_normale(V, F), axis=1) > 1e-14
_, enkratne = np.unique(np.sort(F, 1), axis=0, return_index=True)
obdrzi = np.zeros(len(F), bool); obdrzi[enkratne] = True; obdrzi &= ok
ciscenje = {"izrojene": int((~ok).sum()), "podvojene": int(len(F) - len(enkratne)), "zrcaljeno": bool(zrcaljeno)}
F, mat = F[obdrzi], mat[obdrzi]
if kost.prostornina(V, F) < 0:
    F = F[:, ::-1]; ciscenje["obrnjeno"] = True
izvor = mreza_obj("izvor", V, F, mat)
izvor_V, izvor_F, izvor_mat = V.copy(), F.copy(), mat.copy()
korak("1 ciscenje")

# =============================== 2 gladka zaprta mreža ===============================
# 2a: Catmull-Clark + voxel → G1 (oblika vira). 2b: na G1 dodamo anatomske izbokline in vdolbine, ki morajo biti v obrisu
# in v nizki mreži (»makro«: linea aspera s pilastrom, glutealna grčavina, spiralna, pektinealna in suprakondilarni
# liniji, obrtca, intertrohanterna linija in greben, kvadratni grčici, trohanterna jama, epikondila, adduktorska
# grčica, medkondilarna jama), zapolnimo izvrtino fovee iz vira in izdolbemo plitvo fovea capitis; nato še en voxel
# remesh → G (zaprta, mnogoterna, ena komponenta). Fino (hrapavost, odprtine, hrustanec) je samo v visoki mreži (3).
gl1 = mreza_obj("gladka-1", V, F)
# Catmull-Clark proti stopničastim ploskvam vira: Z-Anatomy (3,8 k) 2 nivoja, gostejši BodyParts3D (23 k) le 1 (2 bi zgladila
# njegove prave podrobnosti)
uporabi(gl1, "SUBSURF", levels=1 if VIR_JSON else 2, render_levels=1 if VIR_JSON else 2, subdivision_type="CATMULL_CLARK")
uporabi(gl1, "REMESH", mode="VOXEL", voxel_size=NASTAVITVE["voxel"], adaptivity=0.0, use_smooth_shade=True)
uporabi(gl1, "SMOOTH", factor=0.5, iterations=3)
G1, GF1 = np_mreza(gl1)
N1 = np_normale(gl1)
# hrustanec z najbližje ploskve vira
bvh = BVHTree.FromPolygons(v_blender(izvor_V).tolist(), izvor_F.tolist(), all_triangles=True)
hr1 = np.zeros(len(G1))
for i, p in enumerate(v_blender(G1)):
    loc, nrm, fi, dist = bvh.find_nearest(p)
    hr1[i] = 1.0 if fi is not None and izvor_mat[fi] == 1 else 0.0
E1, d1 = sosedi(len(G1), GF1)
rob = float(np.linalg.norm(G1[E1[:, 0]] - G1[E1[:, 1]], axis=1).mean())


def dif(x, sirina):
    """Glajenje polja na G1 na približno dano širino (m), neodvisno od gostote mreže (CPU 0,7 mm / RTX 0,25 mm)."""
    return zgladi_polje(np.asarray(x, float), E1, d1, int(np.clip((sirina / rob) ** 2, 1, 600)))


def dif3d(x, sigma, celica=1.0e-3):
    """Glajenje polja v prostoru (3D mreža celic 1 mm, trikratni drseči povpreček ≈ Gauss σ), neodvisno od gostote
    mreže in brez omejitve števila korakov (graf pri RTX 0,25 mm bi za σ 6 mm rabil tisoče korakov)."""
    lo_ = G1.min(0) - 4 * sigma
    ij = np.floor((G1 - lo_) / celica).astype(int)
    shp = tuple(ij.max(0) + int(4 * sigma / celica) + 2)
    vs = np.zeros(shp, np.float32); ut = np.zeros(shp, np.float32)
    np.add.at(vs, tuple(ij.T), x); np.add.at(ut, tuple(ij.T), 1.0)
    k = max(1, int(round(np.sqrt(4 * (sigma / celica) ** 2 + 1))))  # širina okna: 3 prehodi → σ² = (k² − 1)/4
    for g in (vs, ut):
        for os_i in range(3):
            for _ in range(3):
                c = np.cumsum(g, axis=os_i, dtype=np.float64)
                c = np.concatenate([np.zeros_like(c.take([0], axis=os_i)), c], axis=os_i)
                n_ = g.shape[os_i]
                lo_i = np.clip(np.arange(n_) - k // 2, 0, n_); hi_i = np.clip(np.arange(n_) + k - k // 2, 0, n_)
                g[...] = (c.take(hi_i, axis=os_i) - c.take(lo_i, axis=os_i)) / k
    # trilinearno branje (v4s3: branje celice, v kateri je oglišče, je dalo 1-mm stopnice na izoliniji = nazobčan obris)
    q = (G1 - lo_) / celica - 0.5
    i0 = np.clip(np.floor(q).astype(int), 0, np.array(shp) - 2); f = np.clip(q - i0, 0, 1)
    num = np.zeros(len(G1)); den = np.zeros(len(G1))
    for dx in (0, 1):
        for dy in (0, 1):
            for dz in (0, 1):
                w = (f[:, 0] if dx else 1 - f[:, 0]) * (f[:, 1] if dy else 1 - f[:, 1]) * (f[:, 2] if dz else 1 - f[:, 2])
                k_ = (i0[:, 0] + dx, i0[:, 1] + dy, i0[:, 2] + dz)
                num += w * vs[k_]; den += w * ut[k_]
    return num / np.maximum(den, 1e-9)


def taubin(X, w, sirina):
    """Taubinovo glajenje (λ 0,5 / μ −0,53, brez krčenja) samo na ogliščih z w > 0, utež w; ~sirina (m)."""
    izb = np.where(w > 1e-3)[0]
    if not len(izb):
        return X
    loc = -np.ones(len(X), int); loc[izb] = np.arange(len(izb))
    Es = E1[(loc[E1[:, 0]] >= 0) & (loc[E1[:, 1]] >= 0)]
    a_, b_ = loc[Es[:, 0]], loc[Es[:, 1]]
    ds = np.maximum(np.bincount(a_, minlength=len(izb)) + np.bincount(b_, minlength=len(izb)), 1)[:, None]
    Y = X[izb].copy(); ww = w[izb][:, None]
    for _ in range(int(np.clip((sirina / rob) ** 2, 4, 1200))):
        for lam in (0.5, -0.53):
            s_ = np.stack([np.bincount(a_, Y[b_, k], len(izb)) + np.bincount(b_, Y[a_, k], len(izb)) for k in range(3)], 1)
            Y += lam * ww * (s_ / ds - Y)
    X = X.copy(); X[izb] = Y
    return X


def kotna(x):
    return (x + np.pi) % (2 * np.pi) - np.pi


def polarno(Gx, osd, c0, zad, lat):
    """Polarne koordinate okoli osi diafize (θ = 0 zadaj, + proti lateralno) glede na središče prereza na isti višini."""
    h_d = (Gx - c0) @ osd
    hh = np.linspace(h_d.min(), h_d.max(), 120)
    sred = np.array([Gx[np.abs(h_d - x) < 2.5e-3].mean(0) if (np.abs(h_d - x) < 2.5e-3).any() else c0 + osd * x for x in hh])
    sred_v = np.stack([np.interp(h_d, hh, sred[:, k]) for k in range(3)], 1)
    rel = Gx - sred_v; rel_r = rel - np.outer(rel @ osd, osd)
    return hh, sred, np.linalg.norm(rel_r, axis=1) + 1e-9, np.arctan2(rel_r @ lat, rel_r @ zad)


gl1_bvh = BVHTree.FromPolygons(v_blender(G1).tolist(), GF1.tolist(), all_triangles=True)


def na_povrsino(P):
    return iz_blenderja(np.array([gl1_bvh.find_nearest(p)[0] for p in v_blender(np.atleast_2d(P))]))


def tocka(tq, thq):
    """Točka na površini diafize pri t in θ (stopinje)."""
    s = np.where(np.abs(t1 - tq) < 0.003)[0]
    return G1[s[np.argmin(np.abs(kotna(th1[s] - np.radians(thq))))]]


def najbolj(maska, smer):
    return G1[np.argmax(np.where(maska, G1 @ smer, -1e9))]


def crta(sidra, korak_=0.4e-3, z_sidri=False):
    """Zgoščena črta po površini skozi sidra (3D): tetive po 0,4 mm, položene na G1; vrne točke in parameter 0–1
    (z_sidri: še parameter vsakega sidra)."""
    sidra = np.asarray(sidra, float)
    P = [sidra[0]]; ind = [0]
    for a_, b_ in zip(sidra[:-1], sidra[1:]):
        n = max(2, int(np.ceil(np.linalg.norm(b_ - a_) / korak_)))
        P += list(a_ + np.outer(np.linspace(0, 1, n + 1)[1:], b_ - a_)); ind.append(len(P) - 1)
    P = na_povrsino(np.array(P))
    s = np.r_[0, np.cumsum(np.linalg.norm(np.diff(P, axis=0), axis=1))]
    return (P, s / s[-1], (s / s[-1])[ind]) if z_sidri else (P, s / s[-1])


from mathutils.kdtree import KDTree  # noqa: E402


def razdalja_do(P, doseg):
    """Za oglišča G1 v dosegu (m) od črte P: (indeksi, razdalja, indeks najbližje točke črte)."""
    lo_, hi_ = P.min(0) - doseg, P.max(0) + doseg
    idx = np.where(np.all((G1 > lo_) & (G1 < hi_), axis=1))[0]
    kd = KDTree(len(P))
    for i, p in enumerate(P):
        kd.insert(p.tolist(), i)
    kd.balance()
    dd = np.empty(len(idx)); jj = np.empty(len(idx), int)
    for n, i in enumerate(idx):
        _, j, d_ = kd.find(G1[i].tolist())
        dd[n] = d_; jj[n] = j
    return idx, dd, jj


hp_m = np.zeros(len(G1))   # makro višina (m), + navzven, v obrisu in nizki mreži
hrap1 = np.zeros(len(G1))  # hrapava mesta pripojev (barva, hrapavost, drobna grčavost)
pas1 = np.zeros(len(G1))   # ustnici linea aspera: hrapav, malo svetlejši pas (barva in hrapavost, ne geometrija)
crte = {}


def greben(ime, sidra, h, w, hrap_=0.8, konca=(0.12, 0.12), oblika=None, sirina=None, pas_=0.0):
    """Izbočen greben po črti: višina h (m) z mehkim začetkom/koncem, prečni profil Gauss s σ = w (m) (vedno izbočen:
    v4s2 je imel pilaster planoto in strma boka; robova planote sta se brala kot dve vrezani črti z žlebom vmes).
    oblika(u) → množitelj višine vzdolž črte (npr. prekinitev medialne suprakondilarne linije);
    sirina(u) → množitelj σ vzdolž črte (npr. greben, ki se široko zlije z velikim obrtcem)."""
    P, u = crta(sidra)
    smax = 1.0 if sirina is None else float(np.max(sirina(np.linspace(0, 1, 101))))
    idx, dd, jj = razdalja_do(P, 3.5 * w * smax)
    uu = u[jj]
    if sirina is not None:
        w = w * sirina(uu)
    vz = smooth(0, konca[0], uu) if konca[0] > 0 else 1.0
    vz = vz * (smooth(1, 1 - konca[1], uu) if konca[1] > 0 else 1.0)
    if oblika is not None:
        vz = vz * oblika(uu)
    prof = gauss(dd, w) * vz * (1 - cart_m[idx])
    hp_m[idx] += h * prof
    hrap1[idx] = np.maximum(hrap1[idx], hrap_ * smooth(0.15, 0.6, prof))
    if pas_:
        np.maximum.at(pas1, idx, pas_ * prof)
    crte[ime] = {"tock": len(P), "dolzina_mm": round(float(np.linalg.norm(np.diff(P, axis=0), axis=1).sum() * 1000), 1)}


def greben_pot(ime, sidra, visine, sirine, hrap_=0.8, pas=None):
    """Ena neprekinjena črta z višino in σ, podanima v vsakem sidru (linearno vmes): npr. suprakondilarna linija →
    ustnica linea aspera → glutealna grčavina brez »prečke« na stiku (v3s2: dva grebena sta se tam seštela)."""
    P, u, us = crta(sidra, z_sidri=True)
    w_max = float(np.max(sirine))
    idx, dd, jj = razdalja_do(P, 3.5 * w_max)
    uu = u[jj]
    hh_ = np.interp(uu, us, visine); ww_ = np.interp(uu, us, sirine)
    prof = gauss(dd, ww_) * (1 - cart_m[idx])
    hp_m[idx] += hh_ * prof
    hrap1[idx] = np.maximum(hrap1[idx], hrap_ * smooth(0.15, 0.6, prof) * smooth(0.3e-3, 1.0e-3, hh_))
    if pas is not None:  # ustnica med sidroma pas[0] in pas[1]: širok hrapav, malo svetlejši pas (ne ozek greben)
        a_, b_ = us[pas[0]], us[pas[1]]
        np.maximum.at(pas1, idx, gauss(dd, ww_) * smooth(a_ - 0.04, a_, uu) * smooth(b_ + 0.04, b_, uu))
    crte[ime] = {"tock": len(P), "dolzina_mm": round(float(np.linalg.norm(np.diff(P, axis=0), axis=1).sum() * 1000), 1)}


def izboklina(c, rr, h, hrap_=0.8, ostrina=2.0):
    """Izboklina (h > 0) ali jamica (h < 0) okoli točke c s polmerom rr: (1 − (d/rr)²)^ostrina, gladek rob."""
    d = np.linalg.norm(G1 - c, axis=1)
    prof = np.clip(1 - (d / rr) ** 2, 0, 1) ** ostrina * (1 - cart_m)
    hp_m[:] += h * prof
    np.maximum(hrap1, hrap_ * smooth(0.1, 0.5, prof), out=hrap1)
    return prof


# anatomske podrobnosti kosti (podrobnosti_<ime>.py; stegnenica = Femur, nadlahtnica = Humerus): makro na G1
podrobnosti("makro")


gl = mreza_obj("gladka", G1d, GF1)
uporabi(gl, "REMESH", mode="VOXEL", voxel_size=NASTAVITVE["voxel"], adaptivity=0.0, use_smooth_shade=True)
uporabi(gl, "SMOOTH", factor=0.5, iterations=2)
bpy.data.objects.remove(gl1)
G, GF = np_mreza(gl)
N = np_normale(gl)
# polja z G1 na G: najbližje oglišče premaknjene G1
kd = KDTree(len(G1d))
for i, p in enumerate(G1d):
    kd.insert(p.tolist(), i)
kd.balance()
pr = np.array([kd.find(p)[1] for p in G.tolist()])
hr_s = hr_s1[pr]; hrap = hrap1[pr]; hr = (hr_s > 0.5).astype(float)
dvig = dvig1[pr]; pas = pas1[pr]
fov_g = fov_p[pr]  # 1 sredi fovee … 0 zunaj skledice
del kd
A, deg = sosedi(len(G), GF)
korak("2 gladka mreza")

# =============================== 3 visoka mreža s podrobnostmi ===============================
o = kost.okvir_stegnenice(G, STRAN)
t = o["t"]
c0 = G.mean(0)
hh, sred, r, theta = polarno(G, osd, c0, zad, lat)
hr_g = smooth(0.3, 0.7, hr_s)   # hrustanec (mehak rob ~1 mm)
kompakta = 1 - hr_g
temno = np.zeros(len(G))   # odprtine (barva)
hp = np.zeros(len(G))      # fina višina (m) nad G
podrobnosti("hrapavost")

# Kompakta: fina hrapavost; vzdolžne žilne brazde komaj nakazane (v2s2: »dlakava« diafiza); grčavost na pripojih je
# mehka (fbm brez absolutne vrednosti, ki dela ostre gube)
Pz = np.c_[(G - c0) @ lat, (G - c0) @ zad, (G - c0) @ osd]
# v4s3: drobni šum ni več enak povsod: kompaktna diafiza gladka in gosta (40 %), metafize in konca porozni (130 %),
# pripoji hrapavi (grče 0,11 mm)
diaf = smooth(0.18, 0.28, t) * (1 - smooth(0.72, 0.80, t)) * (1 - hrap)
gostota_sum = 1.3 - 0.9 * diaf
fino = (fbm(G / 0.9e-3, 3) * 0.025e-3 + fbm(G / 3.5e-3, 3) * 0.04e-3) * gostota_sum
# v4s2: kost ne sme biti »plastična«: vzdolžne proge na diafizi (široke 1,5–3 mm, dolge ~40 mm, 0,03 mm) in drobne
# pore na metafizah (jamice ~0,3 mm, 0,05 mm globoke); oboje mehko (brez |šuma|), da ni razpok ali »dlak«
brazde = fbm(np.c_[Pz[:, 0] / 1.6e-3, Pz[:, 1] / 1.6e-3, Pz[:, 2] / 40e-3], 3) * 0.03e-3 * smooth(0.16, 0.28, t) * (1 - smooth(0.72, 0.82, t))
metafiza = np.maximum(smooth(0.22, 0.12, t), smooth(0.74, 0.84, t))
por = smooth(0.55, 0.85, fbm(G / 0.4e-3 + 2.3, 2) * 0.5 + 0.5) * metafiza
pore = -0.09e-3 * por
grce = fbm(G / 1.6e-3 + 3.7, 3) * 0.11e-3 * hrap
# teme linea aspera: vlaknasta hrapavost vzdolž grebena (podolgovat šum 0,6 × 6 mm), ne ena ostra črta
vlakna = fbm(np.c_[Pz[:, 0] / 0.6e-3, Pz[:, 1] / 0.6e-3, Pz[:, 2] / 6e-3] + 5.1, 2) * 0.05e-3 * pas
hp += (fino + brazde + grce + pore + vlakna) * kompakta

podrobnosti("odprtine")

# Sklepni hrustanec: gladek, za 0,3 mm dvignjen nad kost z mehkim robom (stanjša se proti robu; ne »prilepljena« ploščica),
# le zelo fina valovitost 0,01 mm
# fovea: dno je gola kost (hrapava, ne svetlejša od hrustanca); hrustanec se stanjša v skledico brez stopnice
fz = smooth(0.15, 0.7, fov_g)
# rob hrustanca: dvig 0,3 mm pada na 0 v ~4 mm do meje (dvig, 3D), v foveo se hrustanec stanjša (gola kost)
hp = hp * (1 - hr_g) + hr_g * fbm(G / 4e-3, 2) * 0.01e-3 + 0.3e-3 * dvig
H = G + N * hp[:, None]
vis = mreza_obj("visoka", H, GF)

# Barve (realistično: macerirana suha kost, sveži hrustanec; učbeniško: čisti barvi) in hrapavost
lisa = fbm(G / 18e-3, 3) * 0.5 + 0.5
zrno = fbm(G / 0.8e-3, 2) * 0.5 + 0.5
kost_b = np.array([0.86, 0.80, 0.68]) * (0.94 + 0.08 * lisa[:, None]) + np.array([0.02, 0.01, -0.03]) * (lisa[:, None] - 0.5)
kost_b *= (0.98 + 0.03 * zrno[:, None] * (1 - 0.5 * diaf[:, None]))
kost_b *= (1 - 0.03 * por[:, None])  # pore na metafizah malo temnejše
# pripoji le rahlo toplejši in motnejši (v2s2: temne črte namesto izboklin; zdaj obliko nosi geometrija)
# v3s3: temnejši pasovi barve po grebenih so bili glavni vzrok, da so dvignjene črte videti kot vrezani žlebovi (preverjeno:
# brez normal map in na visoki mreži brez barve ni žlebov; v barvni teksturi so temne proge). Pripoje nosita oblika in
# hrapavost (ORM), barva se spremeni komaj (1,5 %, brez modrega premika).
# v4s3: pripoji niso temnejši (temna proga = žleb), ampak za odtenek svetlejši (kredasta hrapava kost); ustnici linea
# aspera kot širok, malo svetlejši in hrapav pas
kost_b = kost_b * (1 + 0.01 * hrap[:, None] + 0.04 * pas[:, None])
# sklepni hrustanec: prosojno sivkasto-biserna z rahlo rumenkastim tonom ob tankem robu
hr_rob = smooth(0.5, 0.95, hr_s)
hr_lisa = fbm(G / 6e-3, 3) * 0.5 + 0.5
hr_b = (np.array([0.78, 0.77, 0.73]) * hr_rob[:, None] + np.array([0.80, 0.75, 0.63]) * (1 - hr_rob[:, None]))
hr_b = hr_b * (0.93 + 0.07 * hr_lisa[:, None]) * (0.985 + 0.03 * zrno[:, None]) + np.array([-0.01, 0.0, 0.015]) * (hr_lisa[:, None] - 0.5)
odp_b = np.array([0.50, 0.42, 0.33])
real = kost_b * (1 - hr_g[:, None]) + hr_b * hr_g[:, None]
fov_b = np.array([0.80, 0.77, 0.70]) * (0.97 + 0.06 * zrno[:, None])  # dno fovee: zamolklo, svetlo kot hrustanec (ne temna luknja)
real = real * (1 - fz[:, None]) + fov_b * fz[:, None]
real = real * (1 - temno[:, None]) + odp_b * temno[:, None]
real = real * (1 - 0.6 * hranilna[:, None]) + np.array([0.30, 0.22, 0.15]) * 0.6 * hranilna[:, None]
ucb = np.array([0.93, 0.87, 0.72]) * (1 - hr_g[:, None]) + np.array([0.55, 0.78, 0.93]) * hr_g[:, None]
ucb = ucb * (1 - 0.6 * temno[:, None]) + np.array([0.45, 0.35, 0.28]) * 0.6 * temno[:, None]
ucb = ucb * (1 - fz[:, None]) + np.array([0.80, 0.74, 0.60]) * fz[:, None]
rough = 0.62 + 0.14 * hrap + 0.04 * (zrno - 0.5) + 0.08 * (lisa - 0.5) - 0.06 * diaf + 0.05 * por + 0.08 * pas  # spremenljiva hrapavost (ne enoten plastičen sijaj)
rough = rough * (1 - hr_g) + (0.48 + 0.08 * hr_lisa + 0.03 * (zrno - 0.5)) * hr_g
rough = np.maximum(rough, 0.9 * temno)
rough = rough * (1 - fz) + 0.8 * fz


def barva_atr(ob, ime, rgb, srgb=False):
    """Atribut FLOAT_COLOR je linearen: barve, zapisane v sRGB, pretvorimo (peka EMIT v sliko sRGB jih vrne nazaj)."""
    x = np.clip(rgb, 0, 1)
    if srgb:
        x = np.where(x <= 0.04045, x / 12.92, ((x + 0.055) / 1.055) ** 2.4)
    at = ob.data.color_attributes.new(ime, "FLOAT_COLOR", "POINT")
    at.data.foreach_set("color", np.c_[x, np.ones(len(x))].ravel())


barva_atr(vis, "real", real, srgb=True)
barva_atr(vis, "ucb", ucb, srgb=True)
barva_atr(vis, "hrap", np.repeat(rough[:, None], 3, 1))
barva_atr(vis, "hrustanec", np.repeat(hr_g[:, None], 3, 1))
korak("3 visoka mreza")

# =============================== 4 nizki mreži + UV ===============================
def uv_siv(lo):
    """UV s šivi po meri dolge kosti: obroči pri t = 0,18 / 0,36 / 0,54 / 0,72 (otoki diafize ~ kvadratni, ne dolg trak,
    ki ga pakiranje ne izkoristi) in en vzdolžni šiv spredaj-medialno na diafizi (gladka stran, stran od linea aspera);
    nato razgrnitev ABF in pakiranje."""
    bm = bmesh.new(); bm.from_mesh(lo.data)
    bm.faces.ensure_lookup_table()
    Pf = iz_blenderja(np.array([f.calc_center_median() for f in bm.faces]))
    hf = (Pf - c0) @ osd
    tf = (hf - (G - c0).dot(osd).min()) / ((G - c0).dot(osd).max() - (G - c0).dot(osd).min())
    meje = [0.18, 0.36, 0.54, 0.72]
    seg = np.searchsorted(meje, tf)
    sv = np.stack([np.interp(hf, hh, sred[:, k]) for k in range(3)], 1)
    rr = Pf - sv; rr -= np.outer(rr @ osd, osd)
    rez = (spr + med) / np.linalg.norm(spr + med)  # spredaj-medialno
    os2 = np.cross(osd, rez)
    phi = np.arctan2(rr @ os2, rr @ rez)  # 0 na šivu → ±π nasproti; šiv je pri φ = 0
    n = 0
    for e in bm.edges:
        lf = e.link_faces
        if len(lf) != 2:
            continue
        i, j = lf[0].index, lf[1].index
        if seg[i] != seg[j] or (1 <= seg[i] <= 3 and phi[i] * phi[j] < 0 and abs(phi[i]) < 1.0 and abs(phi[j]) < 1.0):
            e.seam = True; n += 1
    bm.to_mesh(lo.data); bm.free()
    aktiviraj(lo)
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.uv.unwrap(method="ANGLE_BASED", margin=0.002)
    # konca kosti (glavica, obrtca, kondila) sta preveč razgibana za razgrnitev enega otoka (ABF jih zgnete):
    # tam Smart UV po kotih, samo na izbranih ploskvah
    bpy.ops.object.mode_set(mode="OBJECT")
    for f in lo.data.polygons:
        f.select = bool(seg[f.index] in (0, 4))
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.uv.smart_project(angle_limit=math.radians(66), island_margin=0.003, area_weight=0.0, scale_to_bounds=False)
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.uv.average_islands_scale()
    bpy.ops.uv.pack_islands(rotate=True, margin=0.002, shape_method="CONCAVE")
    bpy.ops.object.mode_set(mode="OBJECT")
    return n


def presecisca(lo):
    """Pari ploskev nizke mreže, ki se sekajo (brez sosednjih s skupnim ogliščem; kot mere.py)."""
    V_, F_ = np_mreza(lo)
    tr = BVHTree.FromPolygons(V_.tolist(), F_.tolist(), all_triangles=True, epsilon=0.0)
    Fs = [set(f) for f in F_.tolist()]
    return F_, [(i, j) for i, j in tr.overlap(tr) if i < j and not (Fs[i] & Fs[j])]


def razresi_presecisca(lo, gl_bvh, krogov=40):
    """SHRINKWRAP (najbližja točka) v ozkih vdolbinah (fovea, med obrtcema, med kondiloma) potegne sosednja oglišča na
    isto mesto in ploskve se prepognejo. Popravek: oglišča sekajočih se ploskev (+ en obroč sosedov, vsak krog širše)
    sprostimo z Laplaceovim glajenjem in jih spet položimo na gladko površino, a le do polovice (sicer bi jih prilepljanje
    znova zložilo). Če po 3/4 krogov še niso razrešena, jih ne prilepimo več (le glajenje; odmik je < 0,5 mm in peka ga
    pokrije s kletko 2,5 mm). Vrne (pari pred, pari po, krogi)."""
    F_, pari = presecisca(lo)
    zacetek = len(pari)
    E, d = sosedi(len(lo.data.vertices), F_)
    k = 0
    while pari and k < krogov:
        k += 1
        V_, _ = np_mreza(lo)
        izb = np.zeros(len(V_), bool); izb[F_[[i for p in pari for i in p]].ravel()] = True
        for _ in range(1 + k // 8):  # obroč sosedov se širi
            izb[E[izb[E[:, 0]], 1]] = True; izb[E[izb[E[:, 1]], 0]] = True
        s = np.zeros_like(V_); np.add.at(s, E[:, 0], V_[E[:, 1]]); np.add.at(s, E[:, 1], V_[E[:, 0]])
        Vn = V_.copy(); Vn[izb] = 0.4 * V_[izb] + 0.6 * (s[izb] / d[izb, None])
        if k <= krogov * 3 // 4:
            Vb = v_blender(Vn[izb])
            P = np.array([gl_bvh.find_nearest(p)[0] for p in Vb])
            Vn[izb] = 0.5 * Vn[izb] + 0.5 * iz_blenderja(P)
        nastavi_oglisca(lo, Vn)
        _, pari = presecisca(lo)
    return zacetek, len(pari), k


dg = bpy.context.evaluated_depsgraph_get()
gl_bvh = BVHTree.FromObject(gl, dg)
nizke = {}
for cilj, n_tri in PRORACUN.items():
    lo = mreza_obj(f"nizka-{cilj}", G, GF)
    if len(GF) > 1000000:
        # QuadriFlow na RTX geometriji (2,8 M) odpove (»needs to be manifold«, CANCELLED; na strežniku tudi po voxel
        # 1,5 mm in 0,7 mm). Vhod vseeno zmanjšamo na voxel 0,7 mm (hitreje, bolj enakomerni trikotniki za zmanjšanje s
        # kolapsom, ki ostane rezerva: mreža zaprta, mnogoterna, brez samopresečišč; preverjeno z mere.py).
        uporabi(lo, "REMESH", mode="VOXEL", voxel_size=0.0007, adaptivity=0.0)
    nacin = "quadriflow"
    try:
        aktiviraj(lo)
        r_ = bpy.ops.object.quadriflow_remesh(target_faces=n_tri // 2, use_preserve_sharp=False, use_preserve_boundary=False,
                                             use_mesh_symmetry=False, smooth_normals=False, seed=1)
        if "FINISHED" not in r_:
            raise RuntimeError(str(r_))
    except Exception as e:  # QuadriFlow včasih ne uspe (nemnogoterni vhod); takrat zmanjšanje s kolapsom robov
        print("[v2] quadriflow ni uspel, zmanjšanje s kolapsom:", e, flush=True)
        nacin = "decimate"
        uporabi(lo, "DECIMATE", decimate_type="COLLAPSE", ratio=n_tri / max(1, sum(len(p.vertices) - 2 for p in lo.data.polygons)), use_collapse_triangulate=True)
    uporabi(lo, "TRIANGULATE", quad_method="BEAUTY")
    if len(lo.data.polygons) > n_tri * 1.02:
        uporabi(lo, "DECIMATE", decimate_type="COLLAPSE", ratio=n_tri / len(lo.data.polygons), use_collapse_triangulate=True)
    # nizko mrežo potisnemo na gladko površino (QuadriFlow malo skrči izbokline), nato razrešimo samopresečišča
    sw = lo.modifiers.new("prilepi", "SHRINKWRAP"); sw.target = gl; sw.wrap_method = "NEAREST_SURFACEPOINT"
    aktiviraj(lo); bpy.ops.object.modifier_apply(modifier=sw.name)
    sp = razresi_presecisca(lo, gl_bvh)
    print(f"[v2] {cilj}: samopresečišča po prilepljanju {sp[0]} → {sp[1]} ({sp[2]} krogov)", flush=True)
    uv_siv(lo)
    for p in lo.data.polygons:
        p.use_smooth = True
    nizke[cilj] = (lo, nacin, sp)
korak("4 nizki mrezi in UV")


def gostota(lo, px):
    me = lo.data
    me.calc_loop_triangles()
    uv = me.uv_layers.active.data
    a3 = a2 = 0.0
    razm = []
    for lt in me.loop_triangles:
        p = [me.vertices[i].co for i in lt.vertices]
        q = [uv[li].uv for li in lt.loops]
        x3 = ((p[1] - p[0]).cross(p[2] - p[0])).length / 2
        x2 = abs((q[1].x - q[0].x) * (q[2].y - q[0].y) - (q[2].x - q[0].x) * (q[1].y - q[0].y)) / 2
        a3 += x3; a2 += x2; razm.append((x2, x3))
    razm = np.array(razm); g = razm[:, 0] / np.maximum(razm[:, 1], 1e-12) / (a2 / a3)
    w = razm[:, 1] / a3
    # delež površine, kjer je ploščinska gostota UV < 50 % povprečne (raztegnjeni ali zgneteni otoki)
    return {"uv_izkoristek": round(a2, 3), "px_na_mm": round(px * math.sqrt(a2 / (a3 * 1e6)), 2),
            "delez_pod_pol_gostote": round(float(w[g < 0.5].sum()), 3),
            "gostota_p5_p95": [round(float(x), 2) for x in np.percentile(g, [5, 95])]}


# =============================== 5 peka ===============================
sc = bpy.context.scene
sc.render.engine = "CYCLES"
if NAPRAVA != "CPU":
    cp = bpy.context.preferences.addons["cycles"].preferences
    cp.compute_device_type = NAPRAVA; cp.get_devices()
    for d in cp.devices:
        d.use = d.type == NAPRAVA
    sc.cycles.device = "GPU"
else:
    sc.cycles.device = "CPU"
sc.render.threads_mode = "FIXED"; sc.render.threads = int(os.environ.get("PEKA_NITI", "2"))
if sc.world is None:
    sc.world = bpy.data.worlds.new("svet")
sc.world.light_settings.distance = 0.015  # AO: samo bližnje vdolbine (1,5 cm), ne cela kost


def mat_emisija(ime, atr):
    m = bpy.data.materials.new(ime); m.use_nodes = True
    nt = m.node_tree; nt.nodes.clear()
    at = nt.nodes.new("ShaderNodeAttribute"); at.attribute_name = atr
    em = nt.nodes.new("ShaderNodeEmission"); out = nt.nodes.new("ShaderNodeOutputMaterial")
    nt.links.new(at.outputs["Color"], em.inputs["Color"]); nt.links.new(em.outputs[0], out.inputs["Surface"])
    return m


def mat_difuzno(ime):
    m = bpy.data.materials.new(ime); m.use_nodes = True
    return m


def slika(ime, px, barvna):
    im = bpy.data.images.new(ime, px, px, alpha=False, float_buffer=not barvna)
    im.colorspace_settings.name = "sRGB" if barvna else "Non-Color"
    return im


def peci(lo, tip, im, mat_vis=None, vzorci=1, rob_px=8):
    lo.data.materials.clear()
    m = bpy.data.materials.new("peka"); m.use_nodes = True
    n = m.node_tree.nodes.new("ShaderNodeTexImage"); n.image = im
    m.node_tree.nodes.active = n
    lo.data.materials.append(m)
    vis.data.materials.clear()
    vis.data.materials.append(mat_vis or mat_difuzno("vis-dif"))
    sc.cycles.samples = vzorci
    # v sceni sta za peko samo visoka in ta nizka mreža: izvor, gladka in druga nizka ležijo na isti površini in bi
    # AO zatemnili povsod; nizka mreža je nevidna za žarke, sicer AO z visoke mreže zadene njo (lažna okluzija)
    for ob in sc.objects:
        ob.hide_render = ob not in (vis, lo)
    for k in ("visible_camera", "visible_diffuse", "visible_glossy", "visible_transmission", "visible_volume_scatter", "visible_shadow"):
        setattr(lo, k, False)
    aktiviraj(lo, [vis])
    # kletka 4 mm / žarek 10 mm (v3s3: na telefonski mreži so žarki ob grebenih zgrešili visoko mrežo → trd rez in »zadrga«)
    bpy.ops.object.bake(type=tip, use_selected_to_active=True, cage_extrusion=0.004, max_ray_distance=0.010,
                        margin=rob_px, normal_space="TANGENT", use_clear=True)


pekel = {}
if not BREZ_PEKE:
    px = NASTAVITVE["peka"]
    for cilj, (lo, _, _) in nizke.items():
        p_c = px if cilj == "racunalnik" else px // 2
        sl = {}
        sl["normala"] = slika(f"{cilj}-normala", p_c, False); peci(lo, "NORMAL", sl["normala"])
        sl["ao"] = slika(f"{cilj}-ao", p_c, False); peci(lo, "AO", sl["ao"], vzorci=NASTAVITVE["vzorci"])
        for k in ("real", "ucb"):
            sl[k] = slika(f"{cilj}-{k}", p_c, True); peci(lo, "EMIT", sl[k], mat_emisija(f"em-{k}", k))
        sl["hrap"] = slika(f"{cilj}-hrap", p_c, False); peci(lo, "EMIT", sl["hrap"], mat_emisija("em-hrap", "hrap"))
        # maska pokritih tekslov (bela emisija, rob 1 px): vse zunaj nje zapolnimo iz otokov (zapolni), sicer črno
        # ozadje v manjših mipmapah zateče čez robove otokov → temne »razpoke« po šivih (v2s2/v3s1 na vratu, pod malim
        # obrtcem, obročni šiv na diafizi)
        if "em-bela" not in bpy.data.materials:
            mb = bpy.data.materials.new("em-bela"); mb.use_nodes = True; nt = mb.node_tree; nt.nodes.clear()
            em = nt.nodes.new("ShaderNodeEmission"); em.inputs["Color"].default_value = (1, 1, 1, 1)
            nt.links.new(em.outputs[0], nt.nodes.new("ShaderNodeOutputMaterial").inputs["Surface"])
        sl["maska"] = slika(f"{cilj}-maska", p_c, False); peci(lo, "EMIT", sl["maska"], bpy.data.materials["em-bela"], rob_px=1)
        pekel[cilj] = sl
        korak(f"5 peka {cilj} {p_c} px")


def v_np(im):
    w, h = im.size
    x = np.zeros(w * h * 4, np.float32); im.pixels.foreach_get(x)
    return x.reshape(h, w, 4)


def shrani_webp(arr, pot, kakovost):
    """Slika (h×w×3, 0–1, vrstice od spodaj kot v Blenderju) → WebP z Blenderjem (brez PIL)."""
    h, w = arr.shape[:2]
    im = bpy.data.images.new("izvoz", w, h, alpha=False)
    im.colorspace_settings.name = "Non-Color"  # vrednosti so že kodirane (sRGB barva iz peke), brez pretvorbe
    im.pixels.foreach_set(np.c_[np.clip(arr[..., :3], 0, 1).reshape(-1, 3), np.ones(h * w)].astype(np.float32).ravel())
    im.filepath_raw = pot; im.file_format = "WEBP"
    im.save(quality=kakovost)  # surovi piksli, brez pretvorbe pogleda (save_render bi uporabil AgX)
    bpy.data.images.remove(im)


def zapolni(arr, maska):
    """Push-pull: tekslom zunaj maske (ozadje atlasa UV) da vrednosti najbližjih otokov (povprečja v piramidi), da
    mipmape in bilinearno filtriranje na šivih ne mešajo ozadja. arr h×w×c, maska h×w (bool); h = w = 2^k."""
    m = maska.astype(np.float32)[..., None]
    a = arr[..., :3].astype(np.float32) * m
    nivoji = [(a, m)]
    while a.shape[0] > 1:
        h = a.shape[0] // 2
        a = a.reshape(h, 2, h, 2, -1).sum((1, 3)); m = m.reshape(h, 2, h, 2, 1).sum((1, 3))
        nivoji.append((a, m))
    c = nivoji[-1][0] / np.maximum(nivoji[-1][1], 1e-6)
    for a, m in reversed(nivoji[:-1]):
        gor = np.repeat(np.repeat(c, 2, 0), 2, 1)
        c = np.where(m > 0, a / np.maximum(m, 1e-6), gor)
    out = arr[..., :3].copy()
    out[~maska] = c[~maska]
    return out


def pomanjsaj(arr, px):
    """Bilinearno zmanjšanje (povprečje blokov, ločljivosti so potence 2)."""
    f = arr.shape[0] // px
    if f <= 1:
        return arr[..., :3]
    return arr[..., :3].reshape(px, f, px, f, 3).mean((1, 3))


def material_glb(ime, barva_pot, normala_pot, orm_pot, ucb):
    m = bpy.data.materials.new(ime); m.use_nodes = True
    nt = m.node_tree; nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial"); bs = nt.nodes.new("ShaderNodeBsdfPrincipled")
    nt.links.new(bs.outputs[0], out.inputs["Surface"])
    tb = nt.nodes.new("ShaderNodeTexImage"); tb.image = bpy.data.images.load(barva_pot)
    nt.links.new(tb.outputs["Color"], bs.inputs["Base Color"])
    tn = nt.nodes.new("ShaderNodeTexImage"); tn.image = bpy.data.images.load(normala_pot); tn.image.colorspace_settings.name = "Non-Color"
    nm = nt.nodes.new("ShaderNodeNormalMap"); nm.inputs["Strength"].default_value = 0.6 if ucb else 1.0
    nt.links.new(tn.outputs["Color"], nm.inputs["Color"]); nt.links.new(nm.outputs[0], bs.inputs["Normal"])
    to = nt.nodes.new("ShaderNodeTexImage"); to.image = bpy.data.images.load(orm_pot); to.image.colorspace_settings.name = "Non-Color"
    sp = nt.nodes.new("ShaderNodeSeparateColor")
    nt.links.new(to.outputs["Color"], sp.inputs["Color"])
    nt.links.new(sp.outputs[1], bs.inputs["Roughness"]); nt.links.new(sp.outputs[2], bs.inputs["Metallic"])
    # okluzija: Blenderjev izvoznik glTF jo bere iz skupine »glTF Material Output«
    if "glTF Material Output" not in bpy.data.node_groups:
        g = bpy.data.node_groups.new("glTF Material Output", "ShaderNodeTree")
        g.interface.new_socket("Occlusion", in_out="INPUT", socket_type="NodeSocketFloat")
    gn = nt.nodes.new("ShaderNodeGroup"); gn.node_tree = bpy.data.node_groups["glTF Material Output"]
    nt.links.new(sp.outputs[0], gn.inputs["Occlusion"])
    return m


# =============================== 6 izvoz ===============================
podrobnosti("porocilo")
porocilo = {"kost": OBJEKT, "ime": IME, "kakovost": KAKOVOST, "naprava": NAPRAVA, "ciscenje": ciscenje, "nastavitve": NASTAVITVE, "proracun": PRORACUN,
            "visoka": {"trikotniki": int(len(GF)), "oglisca": int(len(G))}, "mere_gladke": {k: round(v, 2) for k, v in mer_g.items()},
            "podrobnosti": PODROBNOSTI_POROCILO,
            "izhodi": {}}
kost.pisi_ply(os.path.join(IZHOD, "visoka.ply"), H, GF)
for cilj, (lo, nacin, sp) in nizke.items():
    Vl, Fl = np_mreza(lo)
    kost.pisi_ply(os.path.join(IZHOD, f"nizka-{cilj}.ply"), Vl, Fl)
    ime_px = NASTAVITVE["izvoz"][cilj]
    zapis = {"nacin": nacin, "trikotniki": int(len(Fl)), "samopresecisca": {"po_prilepljanju": sp[0], "konec": sp[1], "krogi": sp[2]}, **gostota(lo, ime_px)}
    if pekel:
        sl = pekel[cilj]
        mk = v_np(sl["maska"])[..., 0] > 0.5
        nor = pomanjsaj(zapolni(v_np(sl["normala"]), mk), ime_px)
        ao = zapolni(v_np(sl["ao"]), mk)[..., 0]
        ao = 0.6 + 0.4 * ao  # AO le blago (v3s2: ob grebenih je temnil kot žleb; studijska luč v aplikaciji že senči)
        orm = np.stack([ao, zapolni(v_np(sl["hrap"]), mk)[..., 0], np.zeros_like(ao)], -1)
        orm = pomanjsaj(orm, ime_px)
        poti = {}
        shrani_webp(nor, poti.setdefault("normala", os.path.join(IZHOD, f"{cilj}-normala.webp")), 95)
        shrani_webp(orm, poti.setdefault("orm", os.path.join(IZHOD, f"{cilj}-orm.webp")), 85)
        for vid in ("real", "ucb"):
            shrani_webp(pomanjsaj(zapolni(v_np(sl[vid]), mk), ime_px), poti.setdefault(vid, os.path.join(IZHOD, f"{cilj}-{vid}.webp")), 90)
        for vid, ime_v in (("real", "realisticno"), ("ucb", "ucbenisko")):
            lo.data.materials.clear()
            lo.data.materials.append(material_glb(f"Kost-{ime_v}", poti[vid], poti["normala"], poti["orm"], vid == "ucb"))
            lo.name = OBJEKT
            aktiviraj(lo)
            pot = os.path.join(IZHOD, f"{IME}-{cilj}-{ime_v}.glb")
            bpy.ops.export_scene.gltf(filepath=pot, export_format="GLB", use_selection=True, export_yup=True,
                                      export_tangents=True, export_image_format="WEBP", export_materials="EXPORT",
                                      export_normals=True, export_texcoords=True, export_draco_mesh_compression_enable=False)
            zapis[f"glb_{ime_v}_bajti"] = os.path.getsize(pot)
            lo.name = f"nizka-{cilj}"
    porocilo["izhodi"][cilj] = zapis
korak("6 izvoz")
# delo.blend: par visoka/nizka z atributi za peko na RTX (rtx-naloga.json); slike peke niso shranjene
for im in list(bpy.data.images):
    if im.packed_file is None and not im.filepath:
        bpy.data.images.remove(im)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(IZHOD, "delo.blend"), compress=True)
porocilo["casi_s"] = casi
try:
    import resource
    porocilo["najvec_pomnilnika_mb"] = round(resource.getrusage(resource.RUSAGE_SELF).ru_maxrss / 1024)
except Exception:
    pass
with open(os.path.join(IZHOD, "porocilo.json"), "w", encoding="utf-8") as f:
    json.dump(porocilo, f, ensure_ascii=False, indent=1, default=float)
print(json.dumps(porocilo, ensure_ascii=False, default=float)[:3000])

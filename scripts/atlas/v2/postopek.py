# Atlas v2: postopek za eno kost (prototip na stegnenici, F0). Zažene se s Pythonom, ki ima modul bpy 5.2.3
# (pip install bpy==5.2.3; na RTX prenosniku Blenderjev Python, glej rtx-naloga.json):
#   python3 scripts/atlas/v2/postopek.py --vhod <Femur.l.ply> --info <Femur.l.json> --izhod <mapa>
#           [--kakovost cpu|rtx] [--naprava CPU|OPTIX|CUDA] [--brez-peke]
# Vhod: izvozi_kost.py (Z-Anatomy Startup.blend, CC BY-SA 4.0). Koraki:
#   1 čiščenje (lega iz matrix_basis, zrcaljenje → obrnjen vrstni red, zvar, izrojene in podvojene ploskve)
#   2 gladka zaprta mnogoterna mreža: Catmull-Clark (2) proti stopničastim ploskvam vira, nato voxel remesh (vedno zaprta,
#     mnogoterna, ena komponenta) in rahlo glajenje; hrustanec prenesemo z vira (najbližja ploskev)
#   3 visoka mreža = gladka + proceduralne podrobnosti po anatomskih mestih (kost.okvir_stegnenice): kompakta (fina
#     hrapavost in vzdolžne žilne brazde), linea aspera z ustnicama (proksimalno glutealna grčavina in spiralna linija,
#     distalno suprakondilarni liniji), hrapava obrtca in intertrohanterni greben, ena hranilna odprtina (zadaj, ob linea
#     aspera, kanal proksimalno), drobne žilne odprtine samo na vratu in metafizah, globlja fovea capitis (iz vira);
#     sklepni hrustanec gladek. Barve in hrapavost kot atributi oglišč (realistično in učbeniško).
#   4 nizki mreži za telefon in računalnik (QuadriFlow, sicer zmanjšanje), UV (Smart UV + pakiranje)
#   5 peka z visoke na nizko (Cycles): normala (tangentna), AO, barva, hrapavost → ORM; cpu = nizka ločljivost
#   6 GLB (WebP teksture, tangente) za telefon in računalnik v obeh videzih + delo.blend (par za peko) + porocilo.json
import json, math, os, sys, time

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
STRAN = z("--stran", "l")
os.makedirs(IZHOD, exist_ok=True)

# Proračuni (načrt §1.3: telo ≤ 1,5 M telefon / ≤ 4 M računalnik; stegnenica je največja kost: ~1 % proračuna okostja)
PRORACUN = {"telefon": 6000, "racunalnik": 16000}
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
    for _ in range(krat):
        s = np.zeros_like(x)
        np.add.at(s, E[:, 0], x[E[:, 1]]); np.add.at(s, E[:, 1], x[E[:, 0]])
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
V, F, dod = kost.beri_ply(VHOD)
with open(INFO, encoding="utf-8") as f:
    info = json.load(f)
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
gl = mreza_obj("gladka", V, F)
uporabi(gl, "SUBSURF", levels=2, render_levels=2, subdivision_type="CATMULL_CLARK")
uporabi(gl, "REMESH", mode="VOXEL", voxel_size=NASTAVITVE["voxel"], adaptivity=0.0, use_smooth_shade=True)
uporabi(gl, "SMOOTH", factor=0.5, iterations=3)
G, GF = np_mreza(gl)
# hrustanec z najbližje ploskve vira
bvh = BVHTree.FromPolygons(v_blender(izvor_V).tolist(), izvor_F.tolist(), all_triangles=True)
Gb = v_blender(G)
hr = np.zeros(len(G))
for i, p in enumerate(Gb):
    loc, nrm, fi, dist = bvh.find_nearest(p)
    hr[i] = 1.0 if fi is not None and izvor_mat[fi] == 1 else 0.0
A, deg = sosedi(len(G), GF)
hr_g = zgladi_polje(hr, A, deg, 4)  # mehak rob hrustanca (~2 mm)
korak("2 gladka mreza")

# =============================== 3 visoka mreža s podrobnostmi ===============================
N = np_normale(gl)
mer_g, lm = kost.mere_stegnenice(G, GF, STRAN, hr > 0.5)
o = kost.okvir_stegnenice(G, STRAN)
t, os_, med, spr = o["t"], o["os"], o["med"], o["spr"]
L = o["dolzina_os"]
osd = lm["os_diafize"]
zad, lat = -spr, -med
# polarne koordinate okoli osi diafize (θ = 0 zadaj, + proti lateralno), glede na središče prereza na isti višini
c0 = G.mean(0)
h_d = (G - c0) @ osd
hh = np.linspace(h_d.min(), h_d.max(), 120)
sred = np.array([G[np.abs(h_d - x) < 2.5e-3].mean(0) if (np.abs(h_d - x) < 2.5e-3).any() else c0 + osd * x for x in hh])
sred_v = np.stack([np.interp(h_d, hh, sred[:, k]) for k in range(3)], 1)
rel = G - sred_v; rel_r = rel - np.outer(rel @ osd, osd)
r = np.linalg.norm(rel_r, axis=1) + 1e-9
theta = np.arctan2(rel_r @ lat, rel_r @ zad)

# os linea aspera iz oblike vira: v vsakem prerezu smer največjega polmera v ±45° okoli zadaj (vir ima greben
# grobo nakazan); kjer ga ni jasno (rob okna), ostane 0 = zadaj. Na koncu omejeno na ±25° in zglajeno.
tt = np.linspace(0.22, 0.78, 29)
th_r = []
for x in tt:
    s = (np.abs(t - x) < 0.01) & (np.abs(theta) < np.radians(45))
    if s.sum() < 8:
        th_r.append(0.0); continue
    ri, thi = r[s], theta[s]
    k = np.argsort(-ri)[: max(3, int(0.1 * s.sum()))]
    th_r.append(float(np.clip(np.arctan2(np.sin(thi[k]).mean(), np.cos(thi[k]).mean()), -np.radians(25), np.radians(25))))
th_surovo = list(th_r)
th_r = np.convolve(np.pad(th_r, 3, mode="edge"), np.ones(7) / 7, mode="valid")
theta_la = np.interp(t, tt, th_r)  # izven 0,22–0,78 ostane robna vrednost
r_sred = np.median(r[(t > 0.4) & (t < 0.6)])


def kotna(x):
    return (x + np.pi) % (2 * np.pi) - np.pi


hp = np.zeros(len(G))      # višina (m), + navzven
hrap = np.zeros(len(G))    # 0 kompakta … 1 hrapava grčavina (barva, hrapavost)
temno = np.zeros(len(G))   # odprtine (barva)
kompakta = 1 - hr_g

# Linea aspera: dve ustnici; razmik 2,5 mm v sredini, distalno se razcepita (suprakondilarni liniji), proksimalno lateralna
# ustnica → glutealna grčavina, medialna → spiralna linija proti malemu obrtcu
raz = np.where(t < 0.36, 2.5e-3 / r_sred + smooth(0.36, 0.12, t) * np.radians(55), 2.5e-3 / r_sred)
raz_lat = raz + smooth(0.66, 0.80, t) * np.radians(38)
raz_med = raz + smooth(0.66, 0.86, t) * np.radians(80)
okno = smooth(0.10, 0.20, t) * (1 - smooth(0.80, 0.88, t))
for znak, rz in ((+1, raz_lat), (-1, raz_med)):
    s_ = kotna(theta - (theta_la + znak * rz)) * r
    usn = gauss(s_, 1.6e-3) * okno
    hp += 0.55e-3 * usn
    hrap = np.maximum(hrap, usn * 0.9)
# vmesni plato linea aspera (srednja tretjina)
s0 = kotna(theta - theta_la) * r
plato = gauss(s0, 3.0e-3) * smooth(0.30, 0.40, t) * (1 - smooth(0.62, 0.70, t))
hp += 0.25e-3 * plato; hrap = np.maximum(hrap, plato * 0.7)
# glutealna grčavina: širša, hrapava izboklina ob lateralni ustnici
s_g = kotna(theta - (theta_la + raz_lat)) * r
glut = gauss(s_g, 3.5e-3) * gauss((t - 0.76) * L, 18e-3)
hp += 0.8e-3 * glut; hrap = np.maximum(hrap, glut)

# Obrtca: hrapava površina na velikem (okoli vrha) in malem obrtcu; intertrohanterni greben zadaj med njima
gt = lm["veliki_obrtec"]
d_gt = np.linalg.norm(G - gt, axis=1)
prox = t > 0.72
mlad = np.where(prox, (G - c0) @ zad * 0.7 + (G - c0) @ med * 0.7, -1e9)
lt_i = int(np.argmax(np.where((t > 0.74) & (t < 0.86), mlad, -1e9)))
lt = G[lt_i]
d_lt = np.linalg.norm(G - lt, axis=1)
obr = np.maximum(gauss(d_gt, 16e-3), gauss(d_lt, 8e-3)) * kompakta
hrap = np.maximum(hrap, obr)
# greben: razdalja do daljice GT–LT, samo zadaj
ab = lt - gt; u = np.clip(((G - gt) @ ab) / (ab @ ab), 0, 1)
d_cr = np.linalg.norm(G - (gt + np.outer(u, ab)), axis=1)
greben = gauss(d_cr, 2.5e-3) * smooth(-0.2, 0.3, ((G - c0) @ zad) / (np.abs((G - c0) @ zad).max())) * prox * kompakta
hp += 0.6e-3 * greben; hrap = np.maximum(hrap, greben * 0.8)
# epikondila in adduktorski tuberkel: hrapava mesta pripojev ob distalnem koncu (brez hrustanca)
dist_k = (t < 0.16) * kompakta
ml = (G - c0) @ med
epi = dist_k * (smooth(0.75, 0.95, np.abs(ml) / np.abs(ml[t < 0.16]).max()))
hrap = np.maximum(hrap, epi * 0.8)

# Kompakta: fina hrapavost (0,03–0,05 mm), vzdolžne žilne brazde na diafizi; hrapava mesta močnejša
Pz = np.c_[(G - c0) @ lat, (G - c0) @ zad, (G - c0) @ osd]
fino = fbm(G / 0.9e-3, 3) * 0.035e-3 + fbm(G / 3.5e-3, 3) * 0.05e-3
brazde = fbm(np.c_[Pz[:, 0] / 1.2e-3, Pz[:, 1] / 1.2e-3, Pz[:, 2] / 25e-3], 3) * 0.06e-3 * smooth(0.18, 0.3, t) * (1 - smooth(0.7, 0.8, t))
grce = (fbm(G / 1.4e-3, 4) * 0.12e-3 + np.abs(fbm(G / 0.7e-3 + 5.1, 2)) * -0.06e-3) * hrap
hp += (fino + brazde) * kompakta + grce * kompakta

# Hranilna odprtina (ena): zadaj, 3 mm medialno od linea aspera, 40 % dolžine od proksimalnega konca; kanal poševno
# proksimalno → jamica z brazdo navzgor
t_f = 1 - 0.40
th_f = np.interp(t_f, tt, th_r) - 3e-3 / r_sred
s_f = kotna(theta - th_f) * r
v_f = (t - t_f) * L
jamica = gauss(s_f, 0.55e-3) * gauss(v_f, 0.8e-3)
brazda = gauss(s_f, 0.45e-3) * gauss(v_f - 3.0e-3, 2.5e-3) * (v_f > 0)
hp -= 1.4e-3 * jamica + 0.35e-3 * brazda
temno = np.maximum(temno, smooth(0.25, 0.8, jamica))

# Drobne žilne odprtine: samo na vratu (retinakularne, zgoraj spredaj in zadaj) in na metafizah ob kondilih
rng = np.random.default_rng(7)
hc, hrd = lm["glavica"]
d_h = np.linalg.norm(G - hc, axis=1)
vrat = (d_h > 1.15 * hrd) & (d_h < 1.55 * hrd) & (d_gt > 0.025) & (hr_g < 0.05)
metaf = (t > 0.06) & (t < 0.16) & (hr_g < 0.05) & ((G - c0) @ zad > 0)
izbor = []
for maska, n_ in ((vrat, 8), (metaf, 10)):
    idx = np.where(maska)[0]
    if len(idx):
        izbor += list(rng.choice(idx, min(n_, len(idx)), replace=False))
for i in izbor:
    d = np.linalg.norm(G - G[i], axis=1)
    rr = rng.uniform(0.35e-3, 0.6e-3)
    k = gauss(d, rr)
    hp -= 0.8e-3 * k; temno = np.maximum(temno, smooth(0.3, 0.9, k) * 0.8)

# Fovea capitis: otok brez hrustanca na glavici (iz vira) poglobimo za 1,5 mm (pripoj vezi glavice)
fov = (d_h < 1.05 * hrd) & (hr < 0.5) & (((G - hc) @ med) > 0.3 * hrd)
fovea = zgladi_polje(fov.astype(float), A, deg, 6)
hp -= 1.5e-3 * fovea * (1 - hr_g)

# Sklepni hrustanec: gladek (brez šuma), le zelo fina valovitost 0,01 mm
hp = hp * (1 - hr_g) + hr_g * fbm(G / 4e-3, 2) * 0.01e-3
H = G + N * hp[:, None]
vis = mreza_obj("visoka", H, GF)

# Barve (realistično: macerirana suha kost, sveži hrustanec; učbeniško: čisti barvi) in hrapavost
lisa = fbm(G / 18e-3, 3) * 0.5 + 0.5
zrno = fbm(G / 0.8e-3, 2) * 0.5 + 0.5
kost_b = np.array([0.86, 0.80, 0.68]) * (0.94 + 0.08 * lisa[:, None]) + np.array([0.02, 0.01, -0.03]) * (lisa[:, None] - 0.5)
kost_b *= (0.97 + 0.05 * zrno[:, None])
kost_b = kost_b * (1 - 0.10 * hrap[:, None]) + np.array([-0.02, -0.03, -0.05]) * hrap[:, None]
hr_b = np.array([0.90, 0.89, 0.84]) * (0.97 + 0.03 * lisa[:, None])  # sklepni hrustanec: biserno bel, rahlo hladen
odp_b = np.array([0.30, 0.20, 0.15])
real = kost_b * (1 - hr_g[:, None]) + hr_b * hr_g[:, None]
real = real * (1 - temno[:, None]) + odp_b * temno[:, None]
ucb = np.array([0.93, 0.87, 0.72]) * (1 - hr_g[:, None]) + np.array([0.55, 0.78, 0.93]) * hr_g[:, None]
ucb = ucb * (1 - 0.6 * temno[:, None]) + np.array([0.45, 0.35, 0.28]) * 0.6 * temno[:, None]
rough = 0.62 + 0.20 * hrap + 0.04 * (zrno - 0.5)
rough = rough * (1 - hr_g) + 0.38 * hr_g
rough = np.maximum(rough, 0.9 * temno)


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
    bpy.ops.uv.smart_project(angle_limit=math.radians(60), island_margin=0.002, area_weight=0.0, scale_to_bounds=False)
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.uv.average_islands_scale()
    bpy.ops.uv.pack_islands(rotate=True, margin=0.002, shape_method="CONCAVE")
    bpy.ops.object.mode_set(mode="OBJECT")
    return n


nizke = {}
for cilj, n_tri in PRORACUN.items():
    lo = mreza_obj(f"nizka-{cilj}", G, GF)
    if len(GF) > 1000000:  # QuadriFlow na milijonih ploskev (rtx) je počasen; zmanjšana mreža z robovi kolapsa ga ustavi
        uporabi(lo, "REMESH", mode="VOXEL", voxel_size=0.0015, adaptivity=0.0)  # (CANCELLED), voxel 1,5 mm ostane zaprt
    nacin = "quadriflow"
    try:
        aktiviraj(lo)
        r_ = bpy.ops.object.quadriflow_remesh(target_faces=n_tri // 2, use_preserve_sharp=False, use_preserve_boundary=False,
                                             use_mesh_symmetry=False, smooth_normals=False, seed=1)
        if "FINISHED" not in r_:
            raise RuntimeError(str(r_))
    except Exception as e:  # QuadriFlow včasih ne uspe (nemnogoterni vhod); takrat zmanjšanje s kolapsom robov
        print("[v2] quadriflow ni uspel:", e, flush=True)
        nacin = "decimate"
        uporabi(lo, "DECIMATE", decimate_type="COLLAPSE", ratio=n_tri / max(1, sum(len(p.vertices) - 2 for p in lo.data.polygons)), use_collapse_triangulate=True)
    uporabi(lo, "TRIANGULATE", quad_method="BEAUTY")
    if len(lo.data.polygons) > n_tri * 1.02:
        uporabi(lo, "DECIMATE", decimate_type="COLLAPSE", ratio=n_tri / len(lo.data.polygons), use_collapse_triangulate=True)
    # nizko mrežo potisnemo na gladko površino (QuadriFlow malo skrči izbokline)
    sw = lo.modifiers.new("prilepi", "SHRINKWRAP"); sw.target = gl; sw.wrap_method = "NEAREST_SURFACEPOINT"
    aktiviraj(lo); bpy.ops.object.modifier_apply(modifier=sw.name)
    uv_siv(lo)
    for p in lo.data.polygons:
        p.use_smooth = True
    nizke[cilj] = (lo, nacin)
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


def peci(lo, tip, im, mat_vis=None, vzorci=1):
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
    bpy.ops.object.bake(type=tip, use_selected_to_active=True, cage_extrusion=0.0025, max_ray_distance=0.006,
                        margin=8, normal_space="TANGENT", use_clear=True)


pekel = {}
if not BREZ_PEKE:
    px = NASTAVITVE["peka"]
    for cilj, (lo, _) in nizke.items():
        p_c = px if cilj == "racunalnik" else px // 2
        sl = {}
        sl["normala"] = slika(f"{cilj}-normala", p_c, False); peci(lo, "NORMAL", sl["normala"])
        sl["ao"] = slika(f"{cilj}-ao", p_c, False); peci(lo, "AO", sl["ao"], vzorci=NASTAVITVE["vzorci"])
        for k in ("real", "ucb"):
            sl[k] = slika(f"{cilj}-{k}", p_c, True); peci(lo, "EMIT", sl[k], mat_emisija(f"em-{k}", k))
        sl["hrap"] = slika(f"{cilj}-hrap", p_c, False); peci(lo, "EMIT", sl["hrap"], mat_emisija("em-hrap", "hrap"))
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
porocilo = {"kakovost": KAKOVOST, "naprava": NAPRAVA, "ciscenje": ciscenje, "nastavitve": NASTAVITVE, "proracun": PRORACUN,
            "visoka": {"trikotniki": int(len(GF)), "oglisca": int(len(G))}, "mere_gladke": {k: round(v, 2) for k, v in mer_g.items()},
            "podrobnosti": {"linea_aspera_theta_st": [round(math.degrees(x), 1) for x in th_surovo[::4]],
                            "veliki_obrtec": gt.round(4).tolist(), "mali_obrtec": lt.round(4).tolist(),
                            "zilne_odprtine": len(izbor), "hranilna_odprtina_t": t_f, "fovea_oglisc": int(fov.sum()),
                            "hrustanec_delez_povrsine": round(float(hr.mean()), 3)},
            "izhodi": {}}
kost.pisi_ply(os.path.join(IZHOD, "visoka.ply"), H, GF)
for cilj, (lo, nacin) in nizke.items():
    Vl, Fl = np_mreza(lo)
    kost.pisi_ply(os.path.join(IZHOD, f"nizka-{cilj}.ply"), Vl, Fl)
    ime_px = NASTAVITVE["izvoz"][cilj]
    zapis = {"nacin": nacin, "trikotniki": int(len(Fl)), **gostota(lo, ime_px)}
    if pekel:
        sl = pekel[cilj]
        nor = pomanjsaj(v_np(sl["normala"]), ime_px)
        ao = v_np(sl["ao"])[..., 0]
        ao = 0.35 + 0.65 * ao  # AO samo kot zmerna okluzija (studijska luč v aplikaciji že senči)
        orm = np.stack([ao, v_np(sl["hrap"])[..., 0], np.zeros_like(ao)], -1)
        orm = pomanjsaj(orm, ime_px)
        poti = {}
        shrani_webp(nor, poti.setdefault("normala", os.path.join(IZHOD, f"{cilj}-normala.webp")), 95)
        shrani_webp(orm, poti.setdefault("orm", os.path.join(IZHOD, f"{cilj}-orm.webp")), 85)
        for vid in ("real", "ucb"):
            shrani_webp(pomanjsaj(v_np(sl[vid]), ime_px), poti.setdefault(vid, os.path.join(IZHOD, f"{cilj}-{vid}.webp")), 90)
        for vid, ime_v in (("real", "realisticno"), ("ucb", "ucbenisko")):
            lo.data.materials.clear()
            lo.data.materials.append(material_glb(f"Kost-{ime_v}", poti[vid], poti["normala"], poti["orm"], vid == "ucb"))
            lo.name = "Femur.l"
            aktiviraj(lo)
            pot = os.path.join(IZHOD, f"stegnenica-{cilj}-{ime_v}.glb")
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

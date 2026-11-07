# Debelina sten v ravnini prereza (preverjanje za ocenjevalce: »stena LV na posnetku 5–7 mm«, ocena n9).
# Zagon (Blender ali pip bpy): python3 scripts/atlas/mere-reza.py <organ.glb> <organ.json> <vozlisca.json> <izhod.json>
# V ravnini prereza iz <organ>.json (n·p + d = 0, osi glTF, središče organa 0) poišče prečne črte čez prosto steno
# levega prekata, medprekatni pretin in prosto steno desnega prekata na 35 %, 50 % in 65 % poti od konice do mitralnega
# obroča (ctTocke iz vozlisca.json) in izmeri, kje je točka v steni (liho število presečišč žarka s stenami CT).
# Izhod: [{ime, mm, a: [x,y,z], b: [x,y,z]}] v metrih glTF; posnetki-organa.cjs (MERE=<izhod.json>) jih nariše čez sliko.
import json, re, sys
import bpy, bmesh
import numpy as np
from mathutils import Vector
from mathutils.bvhtree import BVHTree

glb, js, vz, izh = sys.argv[-4:]
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=glb)
STENE = re.compile(r"^(Left ventricle|Interventricular septum|Right ventricle|Conus arteriosus|Left atrium|Right atrium|Right auricle|Root of)")
bm = bmesh.new()
for o in bpy.context.scene.objects:
    ime = o.parent.name if o.parent and o.parent.type == "EMPTY" else o.name
    if o.type == "MESH" and STENE.search(ime):
        m = o.data.copy(); m.transform(o.matrix_world); bm.from_mesh(m)
bv = BVHTree.FromBMesh(bm)
G = lambda g: np.array([g[0], -g[2], g[1]])   # glTF → Blender
B = lambda b: [round(float(b[0]), 5), round(float(b[2]), 5), round(float(-b[1]), 5)]
rav = json.load(open(js))["prerez"]["ravnine"][0]
n = G(np.array(rav["n"], float)); n /= np.linalg.norm(n); d = rav["d"]
L = {k: G(np.array(v)) for k, v in json.load(open(vz))["ctTocke"].items()}
na = lambda p: p - n * (p @ n + d)   # projekcija na ravnino
apex, mit, tri = na(L["konica"]), na(L["mitralna"]), na(L["trikuspidalna"])
ax = (mit - apex) / np.linalg.norm(mit - apex)
lat = np.cross(n, ax); lat /= np.linalg.norm(lat)
if (tri - mit) @ lat > 0:  # +lat proti levemu prekatu (stran od trikuspidalne zaklopke)
    lat = -lat
SM = Vector((0.3123, 0.7213, 0.6181)).normalized()


def notri(p):
    c = 0; s = Vector(p)
    for _ in range(60):
        h = bv.ray_cast(s, SM, 1.0)
        if h[0] is None:
            break
        c += 1; s = h[0] + SM * 1e-6
    return c % 2 == 1


def odseki(c, smer, do=0.08, korak=0.00025):
    t = np.arange(0, do, korak); ins = [notri(c + smer * x) for x in t]
    out, st = [], None
    for i, x in enumerate(ins + [False]):
        if x and st is None:
            st = i
        if not x and st is not None:
            out.append((t[st], t[i - 1] + korak)); st = None
    return out


mere = []
for f in (0.35, 0.5, 0.65):
    c = apex + (mit - apex) * f
    if notri(c):  # središče mora biti v votlini LV
        continue
    lv = odseki(c, lat)
    if lv:
        a, b = lv[0]
        mere.append({"ime": f"LV {int(f * 100)} %", "mm": round((b - a) * 1000, 1), "a": B(c + lat * a), "b": B(c + lat * b)})
    sr = odseki(c, -lat)
    if sr:
        a, b = sr[0]
        mere.append({"ime": f"pretin {int(f * 100)} %", "mm": round((b - a) * 1000, 1), "a": B(c - lat * a), "b": B(c - lat * b)})
        if len(sr) > 1:
            a, b = sr[1]
            mere.append({"ime": f"RV {int(f * 100)} %", "mm": round((b - a) * 1000, 1), "a": B(c - lat * a), "b": B(c - lat * b)})
for m in mere:
    print(f"{m['ime']:12s} {m['mm']:5.1f} mm")
json.dump(mere, open(izh, "w"), ensure_ascii=False, indent=1)

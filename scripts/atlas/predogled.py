# Predogled surovega GLB organa v Blenderju (EEVEE ni na voljo brez GPU: Workbench, barva po tkivu ali tekstura),
# za hiter pregled oblike in za pregledovalca anatomije. Pogledi: spredaj, prerez (sprednja polovica odrezana z
# ravnino iz <organ>.json), zadaj, od zgoraj (zaklopke).
# Zagon: python3 scripts/atlas/predogled.py -- <organ.glb> <izhodna mapa> [ravnina nx,ny,nz,d (glTF osi, metri)]
import bpy, bmesh, sys, os, math
from mathutils import Vector
a = sys.argv[sys.argv.index("--") + 1:]
pot, izhod = a[0], a[1]
rav = [float(x) for x in a[2].split(",")] if len(a) > 2 else [0, 0, -1, 0.004]
os.makedirs(izhod, exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=pot)
sc = bpy.context.scene
obj = [o for o in sc.objects if o.type == "MESH"]
BARVE = {"miokard": (0.55, 0.12, 0.1), "zaklopka": (0.9, 0.85, 0.72), "arterija": (0.85, 0.12, 0.1), "vena": (0.15, 0.25, 0.7),
         "pljucna": (0.2, 0.35, 0.8), "pljucna-vena": (0.62, 0.22, 0.38), "aorta": (0.85, 0.6, 0.55), "vencna-arterija": (0.95, 0.12, 0.1),
         "vencna-vena": (0.25, 0.2, 0.55)}
for o in obj:
    t = o.get("tkivo") or (o.parent.get("tkivo") if o.parent else None) or ""
    o.color = (*BARVE.get(t, (0.7, 0.7, 0.7)), 1)
lo = Vector((1e9,) * 3); hi = -lo
for o in obj:
    for c in o.bound_box:
        w = o.matrix_world @ Vector(c); lo = Vector(map(min, lo, w)); hi = Vector(map(max, hi, w))
ctr = (lo + hi) / 2; R = (hi - lo).length / 2
sc.render.engine = "BLENDER_WORKBENCH"
sh = sc.display.shading
sh.light = "STUDIO"; sh.show_cavity = True; sh.cavity_type = "BOTH"; sh.show_shadows = False
sh.color_type = os.environ.get("BARVA", "OBJECT")
sc.render.resolution_x = sc.render.resolution_y = int(os.environ.get("PX", "1100"))
sc.world = bpy.data.worlds.new("w"); sc.world.color = (0.03, 0.035, 0.05)
cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam")); sc.collection.objects.link(cam); sc.camera = cam; cam.data.lens = 85


def slikaj(ime, smer, r=1.0):
    smer = Vector(smer).normalized()
    cam.location = ctr + smer * R * 4.6 * r
    cam.rotation_euler = (-smer).to_track_quat("-Z", "Y").to_euler()
    sc.render.filepath = os.path.join(izhod, ime + ".png"); bpy.ops.render.render(write_still=True)


# glTF Y gor, Z spredaj → Blender (uvoz): Z gor, -Y spredaj
slikaj("spredaj", (0.2, -1, 0.15)); slikaj("zadaj", (-0.2, 1, 0.1))
if os.environ.get("KOTI"):  # vrtenje okoli navpične osi (vsakih 45°) ter od zgoraj in spodaj
    for k in range(8):
        f = math.radians(45 * k); slikaj(f"kot{45 * k:03d}", (math.sin(f), -math.cos(f), 0.12))
    slikaj("odzgoraj", (0.05, -0.15, 1)); slikaj("odspodaj", (0.05, -0.15, -1))
n = Vector((rav[0], -rav[2], rav[1])); d = rav[3]
for o in obj:  # prerez: obdrži n·p + d ≥ 0
    me = o.data; bm = bmesh.new(); bm.from_mesh(me); bm.transform(o.matrix_world)
    bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:], plane_co=-n * d / n.length_squared, plane_no=-n, clear_outer=True)
    bm.transform(o.matrix_world.inverted()); bm.to_mesh(me); bm.free()
slikaj("prerez", (0.05, -1, 0.1)); slikaj("prerez-blizu", (0.05, -1, 0.1), 0.55); slikaj("zgoraj", (0.1, -0.5, 1), 0.7)

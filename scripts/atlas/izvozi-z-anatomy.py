# Izvoz modelov Z-Anatomy (CC BY-SA 4.0, na osnovi BodyParts3D, CC BY-SA 2.1 JP) v GLB po sistemih.
# Zagon (Blender 4.2, brez okna):
#   blender -b Startup.blend --python scripts/atlas/izvozi-z-anatomy.py -- <izhodna mapa>
# Izhod: <mapa>/<sistem>.glb (surovo, brez stiskanja) in <mapa>/strukture.json (seznam struktur).
# Stiskanje naredi scripts/atlas/stisni.mjs.
import bpy, bmesh, json, os, re, sys, math

out = sys.argv[sys.argv.index("--") + 1] if "--" in sys.argv else "/tmp/atlas-raw"
os.makedirs(out, exist_ok=True)

# sistem: (začetek imena zbirke, ciljno število trikotnikov po poenostavitvi)
# Skupaj okoli 1,6 milijona; telefon naenkrat prikaže le vklopljene plasti.
SISTEMI = {
    "okostje":   ("1:", 300_000),
    "sklepi":    ("3:", 80_000),
    "misice":    ("4:", 400_000),
    "zile":      ("5:", 200_000),
    "limfni":    ("6:", 50_000),
    "zivcevje":  ("7:", 250_000),
    "organi":    ("8:", 220_000),
    "koza":      ("9:", 80_000),
}
NEVIDNO = re.compile(r"\.(j|g)$")
# Deli, ki v Z-Anatomy morda izhajajo iz modelov z licenco NC (notranje uho, Dundee, CC BY-NC-SA;
# »Kidney«, Lissie Cowley, CC BY-NC). Ledvici sami sta iz BodyParts3D (enaka lega in velikost), zato ostaneta.
IZLOCI = re.compile(r"^(Cochlea|Vestibule|Semicircular|Renal pelvis|Intrarenal (arteries|veins))", re.I)
MIN_TRI = 400          # majhnih teles ne poenostavljamo
CURVE_RES = 2          # ločljivost krivulj (žile, živci) pred pretvorbo v mrežo

scene = bpy.context.scene
top = {c.name: c for c in scene.collection.children}
dg = bpy.context.evaluated_depsgraph_get()

def pot(obj, root):
    """Skupine nad strukturo (za Brskaj): Z-Anatomy jih vodi kot starše ».g«."""
    trail = []
    p = obj.parent
    while p is not None:
        trail.append(re.sub(r"\.(g|j)$", "", p.name))
        p = p.parent
    trail.reverse()
    return trail

_mats = {}
def preprost_material(src):
    """Izvoznik glTF ne zna vozlišč Z-Anatomy; zamenjamo jih s preprostim materialom z isto barvo.
    Pravi videz (kost, mišica …) določi pregledovalnik po imenu materiala."""
    name = src.name if src else "brez"
    if name not in _mats:
        m = bpy.data.materials.new("A:" + name)
        m.use_nodes = False
        if src: m.diffuse_color = src.diffuse_color
        _mats[name] = m
    return _mats[name]

def tris_of(me):
    return sum(len(p.vertices) - 2 for p in me.polygons)

structures = []
for key, (prefix, target) in SISTEMI.items():
    root = next(c for n, c in top.items() if n.startswith(prefix))
    src = [o for o in root.all_objects if o.type in ("MESH", "CURVE") and not NEVIDNO.search(o.name) and not IZLOCI.search(o.name)]
    for o in src:
        if o.type == "CURVE":
            o.data.resolution_u = min(o.data.resolution_u, CURVE_RES)
            o.data.bevel_resolution = min(o.data.bevel_resolution, 1)
    dg.update()
    # delež, ki ostane: velike mreže skrčimo toliko, da sistem pride do cilja
    total = 0
    for o in src:
        try:
            m = o.evaluated_get(dg).to_mesh(); total += tris_of(m); o.evaluated_get(dg).to_mesh_clear()
        except RuntimeError:
            pass
    ratio = min(1.0, target / max(total, 1))
    tmp = bpy.data.collections.new("izvoz-" + key)
    scene.collection.children.link(tmp)
    raw_tris = 0; kept = 0
    for o in src:
        ev = o.evaluated_get(dg)
        try:
            me = bpy.data.meshes.new_from_object(ev, preserve_all_data_layers=False, depsgraph=dg)
        except RuntimeError:
            continue
        if not me or len(me.polygons) == 0:
            continue
        me.transform(o.matrix_world)
        srcmat = o.active_material or (o.data.materials[0] if o.type == "CURVE" and o.data.materials else None)
        me.materials.clear(); me.materials.append(preprost_material(srcmat))
        n = tris_of(me); raw_tris += n
        if n > MIN_TRI and ratio < 1:
            bm = bmesh.new(); bm.from_mesh(me)
            bmesh.ops.triangulate(bm, faces=bm.faces)
            bm.to_mesh(me); bm.free()
            no = bpy.data.objects.new(o.name, me)
            tmp.objects.link(no)
            mod = no.modifiers.new("dec", "DECIMATE")
            mod.ratio = max(ratio, 300 / n)
            mod.use_collapse_triangulate = True
        else:
            no = bpy.data.objects.new(o.name, me)
            tmp.objects.link(no)
        mat = srcmat.name if srcmat else ""
        no["zid"] = o.name
        for p in me.polygons: p.use_smooth = True
        bb = [no.matrix_world @ v.co for v in me.vertices]
        lo = [min(v[i] for v in bb) for i in range(3)]; hi = [max(v[i] for v in bb) for i in range(3)]
        structures.append({
            "id": o.name, "sistem": key, "pot": pot(o, root), "material": mat,
            "krivulja": o.type == "CURVE",
            # Blender Z-gor -> glTF Y-gor: (x, z, -y)
            "sredisce": [round((lo[0]+hi[0])/2, 4), round((lo[2]+hi[2])/2, 4), round(-(lo[1]+hi[1])/2, 4)],
            "velikost": round(max(hi[i]-lo[i] for i in range(3)), 4),
        })
        kept += 1
    # izvoz samo te zbirke
    for c in scene.collection.children:
        lc = bpy.context.view_layer.layer_collection.children.get(c.name)
        if lc: lc.exclude = (c != tmp)
    bpy.ops.export_scene.gltf(
        filepath=os.path.join(out, key + ".glb"), export_format="GLB",
        use_active_collection=False, use_visible=True, export_apply=True,
        export_materials="EXPORT", export_normals=True, export_texcoords=False,
        export_yup=True, export_extras=True, export_animations=False, export_skins=False,
        export_morph=False, export_lights=False, export_cameras=False)
    after = sum(tris_of(ob.evaluated_get(bpy.context.evaluated_depsgraph_get()).to_mesh()) for ob in tmp.objects)
    print(f"[atlas] {key}: {kept} struktur, trikotnikov {raw_tris} -> {after}")
    for c in scene.collection.children:
        lc = bpy.context.view_layer.layer_collection.children.get(c.name)
        if lc: lc.exclude = False
    bpy.context.view_layer.layer_collection.children[tmp.name].exclude = True
    dg = bpy.context.evaluated_depsgraph_get()

with open(os.path.join(out, "strukture.json"), "w", encoding="utf-8") as f:
    json.dump(structures, f, ensure_ascii=False, indent=0)
print("[atlas] skupaj struktur:", len(structures))

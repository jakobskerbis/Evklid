# Atlas v2: izvozi surove mreže izbranih kosti iz Z-Anatomy Startup.blend (CC BY-SA 4.0) brez odpiranja datoteke
# (povezovanje samo izbranih objektov; odpiranje celotne datoteke rabi > 11 GB pomnilnika).
#   python3 scripts/atlas/v2/izvozi_kost.py <Startup.blend> <izhodna mapa> "Femur.l" ["Patella.l" …]
#   (ali blender -b --factory-startup --python scripts/atlas/v2/izvozi_kost.py -- <Startup.blend> <mapa> <imena …>)
# Izhod: <mapa>/<ime>.ply v metrih, koordinate glTF (Y gor, kot atlas): (x, y, z)_glTF = (x, z, -y)_Blender,
# z vsemi modifikatorji (evaluirana mreža), v lastnih koordinatah objekta; <mapa>/<ime>.json: veriga staršev, material, število
# ploskev, matrix_basis. Nič ne poenostavi in ne popravi: to je izhodišče postopka v2 (cisti.py).
import json, os, re, sys

import bpy

a = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else sys.argv[1:]  # python3 ali blender -b --python
BLEND, IZHOD, IMENA = a[0], a[1], a[2:]
os.makedirs(IZHOD, exist_ok=True)
with bpy.data.libraries.load(BLEND, link=True) as (vir, cilj):
    izbrani = [n for n in vir.objects if re.sub(r"\.\d{3}$", "", n) in IMENA]
    cilj.objects = izbrani
print("[kost] povezani:", izbrani, flush=True)
dg = bpy.context.evaluated_depsgraph_get()
for o in bpy.data.objects:
    if o is None or o.type != "MESH" or o.library is None:  # samo povezani (ne kocka iz --factory-startup)
        continue
    ime = re.sub(r"\.\d{3}$", "", o.name)
    if ime not in IMENA:  # starši in pomožni objekti, ki jih povezovanje potegne zraven
        continue
    # povezani objekti niso v sceni: depsgraph jih ne evaluira, zato modifikatorje uporabimo prek kopije v sceni
    kopija = o.copy(); kopija.data = o.data.copy() if o.data.library is None else o.data
    bpy.context.scene.collection.objects.link(kopija)
    dg.update()
    ev = kopija.evaluated_get(dg)
    me = ev.to_mesh()
    # Povezani objekti niso v sceni, zato Blender zanje ne izračuna matrix_world (ostane enotska). Mrežo izvozimo v
    # lastnih koordinatah objekta in zapišemo matrix_basis; postopek (postopek.py) jo uporabi in lego preveri ob
    # mreži iz atlasa (telo-hd), zrcaljenje (det < 0) obrne vrstni red oglišč.
    me.calc_loop_triangles()
    v = [(p.co.x, p.co.z, -p.co.y) for p in me.vertices]
    t = [tuple(lt.vertices) for lt in me.loop_triangles]
    mat = [me.polygons[lt.polygon_index].material_index for lt in me.loop_triangles]  # 0 Bone, 1 Cartilage …
    with open(os.path.join(IZHOD, ime + ".ply"), "wb") as f:
        f.write((f"ply\nformat ascii 1.0\ncomment Z-Anatomy {o.name} (CC BY-SA 4.0)\nelement vertex {len(v)}\n"
                 "property float x\nproperty float y\nproperty float z\n"
                 f"element face {len(t)}\nproperty list uchar int vertex_indices\nproperty uchar material\nend_header\n").encode())
        f.write("".join(f"{x:.7f} {y:.7f} {z:.7f}\n" for x, y, z in v).encode())
        f.write("".join(f"3 {i} {j} {k} {m}\n" for (i, j, k), m in zip(t, mat)).encode())
    veriga, p = [], o.parent
    while p is not None:
        veriga.append(p.name); p = p.parent
    info = {"objekt": o.name, "starsi": veriga, "materiali": [m.name for m in o.data.materials if m],
            "modifikatorji": [m.type for m in o.modifiers],
            "matrix_basis_blender": [list(r) for r in o.matrix_basis], "koordinate": "lastne (objekt), osi glTF", "oglisca_izvor": len(o.data.vertices),
            "ploskve_izvor": len(o.data.polygons), "trikotniki": len(t), "oglisca": len(v),
            "trikotniki_po_materialu": {m.name if m else str(i): mat.count(i) for i, m in enumerate(o.data.materials)}}
    with open(os.path.join(IZHOD, ime + ".json"), "w", encoding="utf-8") as f:
        json.dump(info, f, ensure_ascii=False, indent=1)
    print("[kost]", json.dumps(info, ensure_ascii=False), flush=True)
    ev.to_mesh_clear()

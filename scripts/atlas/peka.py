# Skupna peka realističnih PBR tekstur za vse 3D modele Evklida (organi, mikro prerezi, celice), Blender Cycles na CPU.
# Uporablja jo izvozi-organe.py (cfg »tekstura«); docs/3d.md »Pečene teksture (PBR)«. Ena skupna pot za vse modele:
#   1. nizka mreža (to, kar gre v GLB) dobi skupni UV atlas vseh vozlišč;
#   2. visoka mreža = izvirnik + razdelitev + premik po RECEPTU tkiva (maščobni režnjiči, gubice, vlakna …);
#   3. peka z visoke na nizko po vozliščih (žarek ne zadene soseda): NORMAL (tangentni prostor, MikkTSpace),
#      osnovna barva (EMIT iz materiala recepta) in hrapavost; nato senca okolice (AO z žarki, Cycles) na nizki mreži
#      z vsemi vozlišči kot ovirami (»videz ray-tracinga«: kontaktne sence ob žilah, tetivah, v brazdah);
#   4. slike: baza (sRGB), normala, ORM (R = senca okolice, G = hrapavost, B = kovinskost 0), PNG brez izgub;
#      organi.mjs jih stisne v WebP (baza q90, ORM q90, normala q97) in izvoz glTF jih zapiše kot baseColorTexture,
#      normalTexture, occlusionTexture in metallicRoughnessTexture (ena slika ORM).
# Recept tkiva (cfg tekstura.recepti[<tkivo>]): barva, barva2 (lise), lise (moč), maščoba (barva, moč, premik) po
# maski »masca«, gube (premik, merilo), vlakna (premik, merilo), zilice (moč, barva), hrap, hrapMasca, sijaj.
# Maske na ogliščih (barvni atribut »PEKA«: R = maščoba 0–1, G = odprtost 0 votlina … 1 zunaj) izračuna klicatelj
# (maske()) pred razdelitvijo; razdelitev jih gladko prenese na visoko mrežo.
import bpy, bmesh, math, os, time
import numpy as np
from mathutils import Vector
from mathutils.bvhtree import BVHTree

PRIVZETO = dict(barva=(0.5, 0.2, 0.18), barva2=(0.42, 0.14, 0.13), lise=0.35, liseMera=0.025, hrap=0.35, gube=0.00012, gubeMera=0.003,
                vlakna=0.0, vlaknaMera=0.0012, masca=None, mascaBarva=(0.86, 0.66, 0.30), mascaPremik=0.0012, mascaMera=0.004,
                mascaHrap=0.42, zilice=0.0, ziliceBarva=(0.36, 0.06, 0.07), ziliceMera=0.012, notranja=None, notranjaHrap=0.22,
                razdeli=2, robSvetel=0.0)


def _r(tc, tkivo):
    r = dict(PRIVZETO); r.update(tc.get("recepti", {}).get("*", {})); r.update(tc.get("recepti", {}).get(tkivo, {}))
    return r


def _bvh_obj(objekti):
    verts, polys, off = [], [], 0
    for o in objekti:
        me = o.data if hasattr(o, "data") else o
        mw = o.matrix_world if hasattr(o, "matrix_world") else None
        verts.extend((mw @ v.co) if mw else v.co.copy() for v in me.vertices)
        polys.extend([off + i for i in p.vertices] for p in me.polygons)
        off += len(me.vertices)
    return BVHTree.FromPolygons(verts, polys, all_triangles=False, epsilon=0.0)


def maske(vrstice, velikost, zile_rx, tkiva_z_masco, mascaDo=0.008, mascaPolno=0.0025, zarkov=12):
    """Barvni atribut PEKA na izvirnih mrežah (vrstice = [ime, mesh, tkivo, …]): R maščoba (bližina površinskih žil na
    zunanji ploskvi, anatomsko: epikardialna maščoba spremlja venčne žile v žlebovih), G odprtost (delež dolgih žarkov,
    ki pobegnejo: zunanja ploskev 1, notranjost votlin 0)."""
    import re, random
    vse = _bvh_obj([r[1] for r in vrstice])
    zile = [r[1] for r in vrstice if re.search(zile_rx, r[0])]
    bz = _bvh_obj(zile) if zile else None
    rnd = random.Random(5)
    smeri = []
    for i in range(zarkov):
        u, v = (i + 0.5) / zarkov, rnd.random()
        r_, f = math.sqrt(u), 2 * math.pi * (v + i * 0.618)
        smeri.append(Vector((r_ * math.cos(f), r_ * math.sin(f), math.sqrt(max(0.0, 1 - u)))))
    for ime, me, tkivo, *_ in vrstice:
        me.calc_loop_triangles()
        n = len(me.vertices)
        G = np.ones(n); R = np.zeros(n)
        racunaj = tkivo in tkiva_z_masco
        for i, v in enumerate(me.vertices):
            if not racunaj:
                break
            nn = v.normal; p = v.co + nn * velikost * 2e-4
            t = nn.orthogonal().normalized(); b = nn.cross(t)
            G[i] = sum(1 for d in smeri if vse.ray_cast(p, t * d.x + b * d.y + nn * d.z, velikost * 2)[0] is None) / zarkov
            if bz is not None:
                d = bz.find_nearest(v.co, mascaDo)[3]
                if d is not None:
                    R[i] = min(1.0, max(0.0, (mascaDo - d) / (mascaDo - mascaPolno)))
        if racunaj:  # glajenje po robovih (2 koraka), maščoba samo zunaj
            e = np.array([tuple(ed.vertices) for ed in me.edges], dtype=np.int64).reshape(-1, 2)
            if len(e):
                st = np.bincount(e.ravel(), minlength=n).astype(float)
                for _ in range(3):
                    for A in (G, R):
                        acc = np.bincount(e[:, 0], weights=A[e[:, 1]], minlength=n) + np.bincount(e[:, 1], weights=A[e[:, 0]], minlength=n)
                        A[:] = 0.5 * A + 0.5 * np.where(st > 0, acc / np.maximum(st, 1), A)
            R *= np.clip((G - 0.15) / 0.35, 0, 1)
        at = me.color_attributes.get("PEKA") or me.color_attributes.new("PEKA", "FLOAT_COLOR", "POINT")
        col = np.zeros((n, 4)); col[:, 0] = R; col[:, 1] = G; col[:, 3] = 1
        at.data.foreach_set("color", col.ravel())
        vg = None  # skupina oglišč za premik maščobe (razdelitev jo prenese)
        print(f"[peka] maske {ime}: maščoba {float((R > 0.5).mean()):.0%}, votlina {float((G < 0.3).mean()):.0%}" if racunaj else "", end="\n" if racunaj else "")


def _nodes(m):
    m.use_nodes = True
    nt = m.node_tree; nt.nodes.clear()
    return nt, nt.nodes.new, nt.links.new


def material_peke(tkivo, r, velikost):
    """Material visoke mreže za peko: EMIT = osnovna barva (preklop 0) ali hrapavost (preklop 1, sivina)."""
    m = bpy.data.materials.new("_peka-" + tkivo)
    nt, N, L = _nodes(m)
    izh = N("ShaderNodeOutputMaterial"); em = N("ShaderNodeEmission"); L(em.outputs[0], izh.inputs[0])
    koord = N("ShaderNodeTexCoord")
    atr = N("ShaderNodeAttribute"); atr.attribute_name = "PEKA"
    sep = N("ShaderNodeSeparateColor"); L(atr.outputs["Color"], sep.inputs[0])
    masca, odprt = sep.outputs[0], sep.outputs[1]

    def sum_(mera, detail=4, rough=0.55, off=0.0):
        t = N("ShaderNodeTexNoise"); t.inputs["Scale"].default_value = 1 / max(mera, 1e-6)
        t.inputs["Detail"].default_value = detail; t.inputs["Roughness"].default_value = rough
        if off:
            mp = N("ShaderNodeMapping"); mp.inputs["Location"].default_value = (off, off * 1.7, off * 0.3)
            L(koord.outputs["Object"], mp.inputs[0]); L(mp.outputs[0], t.inputs["Vector"])
        else:
            L(koord.outputs["Object"], t.inputs["Vector"])
        return t.outputs["Fac"]

    def mix(fac, a, b):
        x = N("ShaderNodeMix"); x.data_type = "RGBA"; x.clamp_factor = True
        if isinstance(fac, (int, float)): x.inputs[0].default_value = fac
        else: L(fac, x.inputs[0])
        for i, v in ((6, a), (7, b)):
            if isinstance(v, tuple): x.inputs[i].default_value = (*v, 1)
            else: L(v, x.inputs[i])
        return x.outputs[2]

    def rng(v, a, b, c=0.0, d=1.0):
        x = N("ShaderNodeMapRange"); x.clamp = True
        L(v, x.inputs[0]); x.inputs[1].default_value = a; x.inputs[2].default_value = b
        x.inputs[3].default_value = c; x.inputs[4].default_value = d
        return x.outputs[0]

    def mul(a, b):
        x = N("ShaderNodeMath"); x.operation = "MULTIPLY"; x.use_clamp = True
        for i, v in ((0, a), (1, b)):
            if isinstance(v, (int, float)): x.inputs[i].default_value = v
            else: L(v, x.inputs[i])
        return x.outputs[0]

    # osnova: barva z velikimi mehkimi lisami (prekrvavitev) in drobno zrnatostjo
    c = mix(mul(rng(sum_(r["liseMera"] * velikost, 3, 0.5), 0.35, 0.7), r["lise"]), r["barva"], r["barva2"])
    c = mix(mul(rng(sum_(r["liseMera"] * velikost * 0.12, 2, 0.6, 3.1), 0.3, 0.75), 0.18), c, tuple(x * 0.8 for x in r["barva"]))
    if r.get("notranja"):  # notranja ploskev votlin (endokard): svetlejša, bolj gladka
        c = mix(rng(odprt, 0.45, 0.2), c, r["notranja"])
    if r["zilice"]:  # drobne žilice (Voronoi robovi, popačeni s šumom), samo zunaj
        mk = N("ShaderNodeMix"); mk.data_type = "VECTOR"; mk.inputs[0].default_value = 0.35
        L(koord.outputs["Object"], mk.inputs[4]); tn = N("ShaderNodeTexNoise"); tn.inputs["Scale"].default_value = 1 / (0.02 * velikost)
        L(koord.outputs["Object"], tn.inputs["Vector"]); L(tn.outputs["Color"], mk.inputs[5])
        vo = N("ShaderNodeTexVoronoi"); vo.feature = "DISTANCE_TO_EDGE"; vo.inputs["Scale"].default_value = 1 / (r["ziliceMera"] * velikost)
        L(mk.outputs[1], vo.inputs["Vector"])
        z = mul(mul(rng(vo.outputs["Distance"], 0.0, 0.03, 1.0, 0.0), r["zilice"]), rng(odprt, 0.4, 0.7))
        z = mul(z, rng(sum_(0.05 * velikost, 2, 0.5, 7.7), 0.4, 0.6))  # žilice samo ponekod (ne mreža po vsem)
        c = mix(z, c, r["ziliceBarva"])
    hr = N("ShaderNodeValue"); hr.outputs[0].default_value = r["hrap"]
    hrap = hr.outputs[0]
    if r.get("notranja"):
        hx = N("ShaderNodeMix"); hx.data_type = "FLOAT"; L(rng(odprt, 0.45, 0.2), hx.inputs[0])
        hx.inputs[2].default_value = r["hrap"]; hx.inputs[3].default_value = r["notranjaHrap"]; hrap = hx.outputs[0]
    if r["masca"]:  # epikardialna maščoba: rumena, režnjičasta (Voronoi), bolj hrapava
        vm = N("ShaderNodeTexVoronoi"); vm.inputs["Scale"].default_value = 1 / (r["mascaMera"] * velikost)
        L(koord.outputs["Object"], vm.inputs["Vector"])
        rez = rng(vm.outputs["Distance"], 0.0, 0.5, 1.0, 0.82)
        mb = N("ShaderNodeMix"); mb.data_type = "RGBA"; mb.blend_type = "MULTIPLY"; mb.inputs[0].default_value = 1.0
        mb.inputs[6].default_value = (*r["mascaBarva"], 1); L(rez, mb.inputs[7])
        mm = mul(rng(masca, 0.12, 0.6), r["masca"])
        mm = mul(mm, rng(sum_(0.012 * velikost, 3, 0.6, 5.5), 0.25, 0.55, 0.55, 1.0))
        c = mix(mm, c, mb.outputs[2])
        hx = N("ShaderNodeMix"); hx.data_type = "FLOAT"; L(mm, hx.inputs[0]); L(hrap, hx.inputs[2]); hx.inputs[3].default_value = r["mascaHrap"]
        hrap = hx.outputs[0]
    # drobna hrapavost iz šuma (mokri odsevi niso enakomerni)
    hn = N("ShaderNodeMath"); hn.operation = "ADD"; hn.use_clamp = True; L(hrap, hn.inputs[0])
    L(rng(sum_(0.004 * velikost, 3, 0.6, 2.2), 0.3, 0.7, -0.06, 0.08), hn.inputs[1])
    preklop = N("ShaderNodeValue"); preklop.name = "preklop"; preklop.outputs[0].default_value = 0.0
    sv = N("ShaderNodeCombineColor"); [L(hn.outputs[0], sv.inputs[i]) for i in range(3)]
    L(mix(preklop.outputs[0], c, sv.outputs[0]), em.inputs[0])
    return m


def visoka(ime, me, tkivo, r, velikost, tmp):
    """Visoka mreža za peko: kopija izvirnika, razdelitev in premik po receptu (maščoba po maski, gube, vlakna)."""
    o = bpy.data.objects.new("_v:" + ime, me.copy()); tmp.objects.link(o)
    at = o.data.color_attributes.get("PEKA")
    if r["masca"] and at is not None:  # skupina oglišč iz maske maščobe (premik samo tam)
        vg = o.vertex_groups.new(name="masca")
        mas = np.zeros(len(o.data.vertices) * 4); at.data.foreach_get("color", mas)
        mas = mas.reshape(-1, 4)[:, 0]
        for i, w in enumerate(mas):
            if w > 0.02: vg.add([i], float(w), "REPLACE")
    if r["razdeli"]:
        s = o.modifiers.new("s", "SUBSURF"); s.levels = s.render_levels = r["razdeli"]
    if r["gube"]:
        t = bpy.data.textures.new("_g", "STUCCI"); t.noise_scale = r["gubeMera"] * velikost; t.turbulence = 3; t.noise_type = "SOFT_NOISE"
        d = o.modifiers.new("g", "DISPLACE"); d.texture = t; d.texture_coords = "GLOBAL"; d.strength = r["gube"] * velikost; d.mid_level = 0.5
    if r["vlakna"]:
        t = bpy.data.textures.new("_vl", "WOOD"); t.wood_type = "BANDNOISE"; t.noise_scale = r["vlaknaMera"] * velikost; t.turbulence = 4
        d = o.modifiers.new("vl", "DISPLACE"); d.texture = t; d.texture_coords = "GLOBAL"; d.strength = r["vlakna"] * velikost
    if r["masca"] and o.vertex_groups:
        t = bpy.data.textures.new("_m", "VORONOI"); t.noise_scale = r["mascaMera"] * velikost * 0.5; t.distance_metric = "DISTANCE"
        t.color_mode = "INTENSITY"; t.noise_intensity = 1.0
        d = o.modifiers.new("m", "DISPLACE"); d.texture = t; d.texture_coords = "GLOBAL"; d.strength = r["mascaPremik"] * velikost
        d.vertex_group = "masca"; d.mid_level = 0.0
    me2 = bpy.data.meshes.new_from_object(o.evaluated_get(bpy.context.evaluated_depsgraph_get()))
    o.modifiers.clear(); o.data = me2
    for p in me2.polygons: p.use_smooth = True
    return o


def _izberi(objekti, aktiven):
    for o in bpy.context.view_layer.objects: o.select_set(False)
    for o in objekti: o.select_set(True)
    bpy.context.view_layer.objects.active = aktiven


# ---------- 1. priprava (kliče izvozi-organe.py, v istem procesu kot izbira mrež) ----------
def uv_atlas(objekti, tc, px):
    """Skupni UV atlas vseh vozlišč (rob otokov ~ 3 px, da se mip stopnje ne mešajo s sosedi) in trikotniki
    (MikkTSpace tangente: izvoz in peka uporabita enake)."""
    t0 = time.time()
    _izberi(objekti, objekti[0])
    bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.uv.smart_project(angle_limit=math.radians(tc.get("uvKot", 66)), island_margin=0.0, area_weight=0.0, scale_to_bounds=False)
    bpy.ops.uv.pack_islands(margin=3.0 / px, rotate=True, margin_method="FRACTION", shape_method="CONCAVE")
    bpy.ops.object.mode_set(mode="OBJECT")
    for o in objekti:
        bm = bmesh.new(); bm.from_mesh(o.data); bmesh.ops.triangulate(bm, faces=bm.faces); bm.to_mesh(o.data); bm.free()
    print(f"[peka] UV atlas {len(objekti)} vozlišč, {px} px ({time.time() - t0:.0f} s)", flush=True)


def _json(x):
    if isinstance(x, dict): return {k: _json(v) for k, v in x.items()}
    if isinstance(x, (list, tuple)): return [_json(v) for v in x]
    return x


def shrani_delo(pot, objekti, vrstice, velikost, tc, px):
    """Delovna datoteka za peko po delih: nizke mreže (UV, COLOR_0) in izvirne mreže z maskami PEKA (»_vir:«), brez
    Z-Anatomy (vsak proces peke jo odpre v nekaj sekundah in z malo pomnilnika). Ob njej <pot>.json z receptom."""
    import json
    po_imenu = {r[0]: r for r in vrstice}
    vir = []
    for o in objekti:
        r = po_imenu.get(o["ime"])
        if r is None: continue
        v = bpy.data.objects.new("_vir", r[1]); v["ime"] = o["ime"]; v["tkivo"] = r[2]; vir.append(v)
    bpy.data.libraries.write(pot, set(objekti) | set(vir), fake_user=True, compress=True)
    for v in vir: bpy.data.objects.remove(v)
    ocena = {}
    for o in objekti:  # ocena ploskev visoke mreže (razdelitev × 4 na korak): procesi peke dobijo omejen kos
        r = po_imenu.get(o["ime"]); rc = _r(tc, o["tkivo"])
        ocena[o["ime"]] = len(r[1].polygons) * 4 ** rc["razdeli"] if r else 0
    with open(pot + ".json", "w", encoding="utf-8") as f:
        json.dump({"velikost": velikost, "px": px, "tekstura": _json(tc),
                   "vozlisca": [{"ime": o["ime"], "tkivo": o["tkivo"], "visoka": ocena[o["ime"]]} for o in objekti]}, f, ensure_ascii=False, indent=1)
    print(f"[peka] delo shranjeno: {pot} ({os.path.getsize(pot) / 1e6:.1f} MB)", flush=True)


# ---------- 2. peka po delih (vsak korak svoj proces: python3 peka.py -- <delo.blend> <korak> [imena …]) ----------
SLIKE = (("baza", "sRGB"), ("normala", "Non-Color"), ("rr", "Non-Color"), ("ao", "Non-Color"))


def _tuple(x):
    if isinstance(x, dict): return {k: _tuple(v) for k, v in x.items()}
    if isinstance(x, list): return tuple(_tuple(v) for v in x)
    return x


def _odpri(pot, niti):
    import json
    bpy.ops.wm.read_factory_settings(use_empty=True)
    with open(pot + ".json", encoding="utf-8") as f:
        meta = json.load(f)
    meta["tekstura"] = _tuple(meta["tekstura"])
    with bpy.data.libraries.load(pot, link=False) as (s, d):
        d.objects = list(s.objects)
    sc = bpy.context.scene
    nizko, vir = [], {}
    for o in d.objects:
        if o is None: continue
        if o.name.startswith("_vir"):
            vir[o["ime"]] = o  # izvirnik ostane zunaj prizora (ne zakriva žarkov)
        else:
            sc.collection.objects.link(o); nizko.append(o)
    sc.render.engine = "CYCLES"; sc.cycles.device = "CPU"; sc.cycles.use_denoising = False
    sc.render.threads_mode = "FIXED"; sc.render.threads = niti
    try:
        sc.cycles.use_auto_tile = True; sc.cycles.tile_size = 256  # manjši vmesni pomnilnik
    except AttributeError:
        pass
    return meta, nizko, vir


def _slike(pot, px):
    """Delne slike peke (PNG RGBA ob delovni datoteki): naložimo, kar so prejšnji procesi že spekli; nove so prazne
    (alfa 0). Peka teče brez roba (margin 0), rob doda zakljuci() iz maske pokritosti (sosednji otoki ostanejo čisti)."""
    sl = {}
    for k, cs in SLIKE:
        f = f"{pot}.{k}.png"
        if os.path.exists(f):
            im = bpy.data.images.load(f); im.alpha_mode = "STRAIGHT"
        else:
            im = bpy.data.images.new(f"{k}", px, px, alpha=True); im.generated_color = (0, 0, 0, 0)
            im.filepath_raw = f; im.file_format = "PNG"
        im.colorspace_settings.name = cs
        sl[k] = im
    return sl


def _shrani(sl, kljuci):
    for k in kljuci:
        im = sl[k]; im.file_format = "PNG"; im.save()


def _material_cilj(sl, kljuc):
    m = bpy.data.materials.new("_cilj-" + kljuc)
    nt, N, L = _nodes(m)
    izh = N("ShaderNodeOutputMaterial"); b = N("ShaderNodeBsdfDiffuse"); L(b.outputs[0], izh.inputs[0])
    t = N("ShaderNodeTexImage"); t.image = sl[kljuc]; nt.nodes.active = t
    return m


def _cilj(objekti, sl, kljuc):
    m = bpy.data.materials.get("_cilj-" + kljuc) or _material_cilj(sl, kljuc)
    for o in objekti:
        o.data.materials.clear(); o.data.materials.append(m)


def povrsina(pot, imena, niti=2):
    """Normala, osnovna barva in hrapavost z visoke mreže za izbrana vozlišča (po eno visoko mrežo naenkrat)."""
    t0 = time.time()
    meta, nizko, vir = _odpri(pot, niti)
    tc, velikost, px = meta["tekstura"], meta["velikost"], meta["px"]
    sl = _slike(pot, px)
    sc = bpy.context.scene
    kletka = tc.get("kletka", 0.0025) * velikost
    mat_peke = {}
    tmp = bpy.data.collections.new("peka"); sc.collection.children.link(tmp)
    ploskev = 0
    for o in nizko:
        if o["ime"] not in imena: continue
        v0 = vir.get(o["ime"])
        if v0 is None: continue
        rc = _r(tc, o["tkivo"])
        vis = visoka(o["ime"], v0.data, o["tkivo"], rc, velikost, tmp)
        ploskev += len(vis.data.polygons)
        if o["tkivo"] not in mat_peke: mat_peke[o["tkivo"]] = material_peke(o["tkivo"], rc, velikost)
        vis.data.materials.clear(); vis.data.materials.append(mat_peke[o["tkivo"]])
        _izberi([vis, o], o)
        for vrsta, kljuc, preklop, vz in (("NORMAL", "normala", 0, tc.get("vzorciNormala", 16)), ("EMIT", "baza", 0, tc.get("vzorciBarva", 16)),
                                          ("EMIT", "rr", 1, tc.get("vzorciBarva", 16))):
            sc.cycles.samples = vz
            mat_peke[o["tkivo"]].node_tree.nodes["preklop"].outputs[0].default_value = preklop
            _cilj([o], sl, kljuc)
            bpy.ops.object.bake(type=vrsta, normal_space="TANGENT", use_selected_to_active=True, cage_extrusion=kletka,
                                max_ray_distance=kletka * 2.2, margin=0, use_clear=False)
        me = vis.data; bpy.data.objects.remove(vis); bpy.data.meshes.remove(me)
        print(f"[peka] {o['ime']}: {time.time() - t0:.0f} s", flush=True)
    _shrani(sl, ("normala", "baza", "rr"))
    print(f"[peka] površina {len(imena)} vozlišč, visoka {ploskev} ploskev ({time.time() - t0:.0f} s)", flush=True)


def senca(pot, imena, niti=2):
    """Senca okolice (AO z žarki, Cycles) na nizki mreži izbranih vozlišč; ovire so vsa vozlišča organa. Kratka
    razdalja: samo gube, stiki in žlebovi, ne zaprtost votlin (prerez odpre prekate, notranjost ostane osvetljena)."""
    t0 = time.time()
    meta, nizko, _ = _odpri(pot, niti)
    tc, velikost, px = meta["tekstura"], meta["velikost"], meta["px"]
    sl = _slike(pot, px)
    sc = bpy.context.scene
    if sc.world is None: sc.world = bpy.data.worlds.new("svet")
    sc.world.light_settings.distance = tc.get("aoRazdalja", 0.035) * velikost
    sc.cycles.samples = tc.get("vzorciAO", 256)
    cilj = [o for o in nizko if o["ime"] in imena]
    _cilj(cilj, sl, "ao")
    _izberi(cilj, cilj[0])
    bpy.ops.object.bake(type="AO", use_selected_to_active=False, margin=0, use_clear=False)
    _shrani(sl, ("ao",))
    print(f"[peka] AO {len(cilj)} vozlišč ({time.time() - t0:.0f} s)", flush=True)


def _razsiri(px_, pokrito, korakov):
    """Rob otokov: prazne slikovne pike dobijo povprečje pokritih sosed (korak za korakom), ostale povprečno barvo."""
    a = px_.copy(); m = pokrito.copy()
    for _ in range(korakov):
        if m.all(): break
        s = np.zeros_like(a); n = np.zeros(m.shape, np.float32)
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (-1, -1), (1, -1), (-1, 1)):
            mm = np.roll(np.roll(m, dy, 0), dx, 1); aa = np.roll(np.roll(a, dy, 0), dx, 1)
            s += aa * mm[..., None]; n += mm
        nov = (~m) & (n > 0)
        a[nov] = s[nov] / n[nov][:, None]; m = m | nov
    if not m.all():
        a[~m] = a[m].mean(0)
    return a


def zakljuci(pot, glb, niti=2):
    """Maska pokritosti UV, rob otokov, ORM = (AO, hrapavost, 0), materiali glTF in izvoz GLB (slike PNG; organi.mjs
    jih pretvori v WebP)."""
    t0 = time.time()
    meta, nizko, _ = _odpri(pot, niti)
    tc, px = meta["tekstura"], meta["px"]
    sl = _slike(pot, px)
    sc = bpy.context.scene
    # pokritost: peka bele barve z 1 vzorcem (brez roba) v novo sliko
    mk = bpy.data.images.new("maska", px, px, alpha=True); mk.generated_color = (0, 0, 0, 0); mk.colorspace_settings.name = "Non-Color"
    sl["maska"] = mk
    m = bpy.data.materials.new("_bela"); nt, N, L = _nodes(m)
    izh = N("ShaderNodeOutputMaterial"); em = N("ShaderNodeEmission"); em.inputs[0].default_value = (1, 1, 1, 1); L(em.outputs[0], izh.inputs[0])
    t = N("ShaderNodeTexImage"); t.image = mk; nt.nodes.active = t
    for o in nizko: o.data.materials.clear(); o.data.materials.append(m)
    sc.cycles.samples = 1
    _izberi(nizko, nizko[0])
    bpy.ops.object.bake(type="EMIT", use_selected_to_active=False, margin=0, use_clear=True)
    def arr(k):
        a = np.empty(px * px * 4, np.float32); sl[k].pixels.foreach_get(a); return a.reshape(px, px, 4)
    pokrito = arr("maska")[..., 0] > 0.5
    print(f"[peka] pokritost atlasa {pokrito.mean():.0%}", flush=True)
    korakov = tc.get("rob", max(8, px // 128))
    koncne = {}
    for k in ("baza", "normala", "rr", "ao"):
        a = arr(k)
        manjka = pokrito & (a[..., 3] < 0.5)
        if manjka.mean() > 0.002:
            print(f"[peka] OPOZORILO {k}: nespečenih {manjka.mean():.1%} pokritih pik", flush=True)
        koncne[k] = _razsiri(a[..., :3], pokrito & (a[..., 3] >= 0.5) if k != "ao" else pokrito, korakov)
    orm = np.zeros((px, px, 3), np.float32)
    orm[..., 0] = np.clip(koncne["ao"][..., 0], 0, 1) ** tc.get("aoKontrast", 1.0)
    orm[..., 1] = np.clip(koncne["rr"][..., 0], 0.03, 1)
    izhodne = {}
    for k, cs, a in (("baza", "sRGB", koncne["baza"]), ("normala", "Non-Color", koncne["normala"]), ("orm", "Non-Color", orm)):
        im = bpy.data.images.new("O-" + k, px, px, alpha=False); im.colorspace_settings.name = cs
        b = np.ones((px, px, 4), np.float32); b[..., :3] = a
        im.pixels.foreach_set(b.ravel()); im.filepath_raw = f"{pot}.{k}-koncna.png"; im.file_format = "PNG"; im.save()
        izhodne[k] = im
    # materiali izvoza po tkivu (vsi delijo iste tri slike)
    for o in nizko:
        mat = bpy.data.materials.get("O:" + o["tkivo"])
        if mat is None:
            mat = bpy.data.materials.new("O:" + o["tkivo"]); nt, N, L = _nodes(mat)
            izh = N("ShaderNodeOutputMaterial"); b = N("ShaderNodeBsdfPrincipled"); L(b.outputs[0], izh.inputs[0])
            tb = N("ShaderNodeTexImage"); tb.image = izhodne["baza"]; L(tb.outputs["Color"], b.inputs["Base Color"])
            tn = N("ShaderNodeTexImage"); tn.image = izhodne["normala"]
            nm = N("ShaderNodeNormalMap"); L(tn.outputs["Color"], nm.inputs["Color"]); L(nm.outputs[0], b.inputs["Normal"])
            to = N("ShaderNodeTexImage"); to.image = izhodne["orm"]
            sp = N("ShaderNodeSeparateColor"); L(to.outputs["Color"], sp.inputs[0])
            L(sp.outputs[1], b.inputs["Roughness"]); L(sp.outputs[2], b.inputs["Metallic"])
            g = bpy.data.node_groups.get("glTF Material Output")
            if g is None:
                g = bpy.data.node_groups.new("glTF Material Output", "ShaderNodeTree")
                g.interface.new_socket("Occlusion", in_out="INPUT", socket_type="NodeSocketFloat")
            gn = N("ShaderNodeGroup"); gn.node_tree = g; L(sp.outputs[0], gn.inputs["Occlusion"])
        o.data.materials.clear(); o.data.materials.append(mat)
        pk = o.data.color_attributes.get("PEKA")
        if pk is not None: o.data.color_attributes.remove(pk)
        ao = o.data.color_attributes.get("AO")
        if ao is not None: o.data.color_attributes.active_color = ao
        o.name = o["ime"]
    bpy.ops.export_scene.gltf(
        filepath=glb, export_format="GLB", use_active_collection=False, use_visible=True, export_apply=True,
        export_materials="EXPORT", export_normals=True, export_vertex_color="ACTIVE", export_texcoords=True, export_tangents=True,
        export_image_format="AUTO", export_yup=True, export_extras=True, export_animations=False, export_skins=False,
        export_morph=False, export_lights=False, export_cameras=False)
    print(f"[peka] izvoz {glb} ({time.time() - t0:.0f} s)", flush=True)


if __name__ == "__main__":
    import sys
    a = sys.argv[sys.argv.index("--") + 1:]
    niti = int(os.environ.get("PEKA_NITI", "2"))
    pot, korak, ost = a[0], a[1], a[2:]
    if korak == "povrsina": povrsina(pot, set(ost), niti)
    elif korak == "senca": senca(pot, set(ost), niti)
    elif korak == "zakljuci": zakljuci(pot, ost[0], niti)
    else: raise SystemExit("korak: povrsina | senca | zakljuci")

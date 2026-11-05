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


def material_izvoza(ime, slike):
    """Material za izvoz glTF: baza → baseColor, normala → normal, ORM → occlusion (R) in metallicRoughness (G, B)."""
    m = bpy.data.materials.get("O:" + ime) or bpy.data.materials.new("O:" + ime)
    nt, N, L = _nodes(m)
    izh = N("ShaderNodeOutputMaterial"); b = N("ShaderNodeBsdfPrincipled"); L(b.outputs[0], izh.inputs[0])
    # Slike se povežejo šele po peki (povezi_izvoz): sicer bi peka brala sliko, v katero piše (krožna odvisnost).
    tb = N("ShaderNodeTexImage"); tb.image = slike["baza"]; tb.name = "baza"
    tn = N("ShaderNodeTexImage"); tn.image = slike["normala"]; tn.name = "normala"
    to = N("ShaderNodeTexImage"); to.image = slike["orm"]; to.name = "orm"
    # bake ciljne slike (aktivno vozlišče določi, kam gre peka)
    for k in ("rr", "ao"):
        t = N("ShaderNodeTexImage"); t.image = slike[k]; t.name = k
    return m


def povezi_izvoz(m):
    """Po peki: baza → Base Color, normala → Normal, ORM → Roughness/Metallic in glTF Occlusion."""
    nt = m.node_tree; N, L = nt.nodes.new, nt.links.new
    b = next(n for n in nt.nodes if n.type == "BSDF_PRINCIPLED")
    L(nt.nodes["baza"].outputs["Color"], b.inputs["Base Color"])
    nm = N("ShaderNodeNormalMap"); L(nt.nodes["normala"].outputs["Color"], nm.inputs["Color"]); L(nm.outputs[0], b.inputs["Normal"])
    sp = N("ShaderNodeSeparateColor"); L(nt.nodes["orm"].outputs["Color"], sp.inputs[0])
    L(sp.outputs[1], b.inputs["Roughness"]); L(sp.outputs[2], b.inputs["Metallic"])
    g = bpy.data.node_groups.get("glTF Material Output")
    if g is None:
        g = bpy.data.node_groups.new("glTF Material Output", "ShaderNodeTree")
        g.interface.new_socket("Occlusion", in_out="INPUT", socket_type="NodeSocketFloat")
    gn = N("ShaderNodeGroup"); gn.node_tree = g; L(sp.outputs[0], gn.inputs["Occlusion"])


def zapeci(objekti, vrstice, velikost, tc, tmp, oznaka, px, izhod):
    """objekti: nizke mreže (bpy objekti z ["tkivo"] in imenom vozlišča); vrstice: izvirne [ime, mesh, tkivo, …] z
    atributom PEKA. Vrne {baza, normala, orm} (bpy slike, shranjene kot PNG v izhod)."""
    t0 = time.time()
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"; sc.cycles.device = "CPU"
    sc.cycles.use_denoising = False
    try:
        sc.render.bake.use_selected_to_active = False
    except AttributeError:
        pass
    # 1) skupni UV atlas (rob otokov ~ 3 px, da se mip stopnje ne mešajo s sosedi)
    _izberi(objekti, objekti[0])
    bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.uv.smart_project(angle_limit=math.radians(tc.get("uvKot", 66)), island_margin=0.0, area_weight=0.0, scale_to_bounds=False)
    bpy.ops.uv.pack_islands(margin=3.0 / px, rotate=True, margin_method="FRACTION", shape_method="CONCAVE")
    bpy.ops.object.mode_set(mode="OBJECT")
    for o in objekti:  # MikkTSpace tangente zahtevajo trikotnike (izvoz in peka uporabita enake)
        bm = bmesh.new(); bm.from_mesh(o.data); bmesh.ops.triangulate(bm, faces=bm.faces); bm.to_mesh(o.data); bm.free()
    print(f"[peka] {oznaka}: UV atlas {len(objekti)} vozlišč, {px} px ({time.time() - t0:.0f} s)", flush=True)
    slike = {}
    for k, cs in (("baza", "sRGB"), ("normala", "Non-Color"), ("rr", "Non-Color"), ("ao", "Non-Color"), ("orm", "Non-Color")):
        im = bpy.data.images.new(f"{oznaka}-{k}", px, px, alpha=False, float_buffer=(k in ("normala",)))
        im.colorspace_settings.name = cs; slike[k] = im
    for o in objekti:
        o.data.materials.clear(); o.data.materials.append(material_izvoza(o["tkivo"], slike))
    # 2) visoke mreže po vozliščih: ena naenkrat (zgradi, speci NORMAL, barvo in hrapavost, izbriši), da pomnilnik
    #    ostane majhen (vse visoke mreže srca skupaj imajo ~1,3 M ploskev); slike se med vozlišči ne brišejo.
    po_imenu = {r[0]: r for r in vrstice}
    mat_peke = {}
    kletka = tc.get("kletka", 0.0025) * velikost
    def aktivna(o, ime):
        for mat in o.data.materials: mat.node_tree.nodes.active = mat.node_tree.nodes[ime]
    prva = True
    ploskev = 0
    for o in objekti:
        r0 = po_imenu.get(o.name)
        if r0 is None:
            continue
        rc = _r(tc, o["tkivo"])
        vis = visoka(o.name, r0[1], o["tkivo"], rc, velikost, tmp)
        ploskev += len(vis.data.polygons)
        if o["tkivo"] not in mat_peke: mat_peke[o["tkivo"]] = material_peke(o["tkivo"], rc, velikost)
        vis.data.materials.clear(); vis.data.materials.append(mat_peke[o["tkivo"]])
        _izberi([vis, o], o)
        for vrsta, ime, preklop, vz in (("NORMAL", "normala", 0, tc.get("vzorciNormala", 16)), ("EMIT", "baza", 0, tc.get("vzorciBarva", 16)), ("EMIT", "rr", 1, tc.get("vzorciBarva", 16))):
            sc.cycles.samples = vz
            mat_peke[o["tkivo"]].node_tree.nodes["preklop"].outputs[0].default_value = preklop
            aktivna(o, ime)
            bpy.ops.object.bake(type=vrsta, normal_space="TANGENT", use_selected_to_active=True, cage_extrusion=kletka,
                                max_ray_distance=kletka * 2.2, margin=max(4, px // 256), margin_type="EXTEND", use_clear=prva)
        prva = False
        me = vis.data; bpy.data.objects.remove(vis); bpy.data.meshes.remove(me)
    print(f"[peka] {oznaka}: NORMAL, barva, hrapavost z visoke mreže {ploskev} ploskev ({time.time() - t0:.0f} s)", flush=True)
    # 3) senca okolice z žarki na nizki mreži; ovire so vsa vozlišča (visoke skrite). Kratka razdalja: samo gube, stiki
    #    in žlebovi, ne zaprtost votlin (prerez odpre prekate, njihova notranjost mora ostati osvetljena).
    if sc.world is None: sc.world = bpy.data.worlds.new("svet")
    sc.world.light_settings.distance = tc.get("aoRazdalja", 0.035) * velikost
    sc.cycles.samples = tc.get("vzorciAO", 256)
    t1 = time.time()
    _izberi(objekti, objekti[0])
    for o in objekti: aktivna(o, "ao")
    bpy.ops.object.bake(type="AO", use_selected_to_active=False, margin=max(4, px // 256), margin_type="EXTEND", use_clear=True)
    print(f"[peka] {oznaka}: AO ({time.time() - t1:.0f} s)", flush=True)
    # 4) ORM = (AO, hrapavost, 0)
    n = px * px
    ao = np.empty(n * 4, np.float32); slike["ao"].pixels.foreach_get(ao)
    rr = np.empty(n * 4, np.float32); slike["rr"].pixels.foreach_get(rr)
    orm = np.ones(n * 4, np.float32)
    k = tc.get("aoKontrast", 1.0)
    orm[0::4] = np.clip(ao[0::4], 0, 1) ** k; orm[1::4] = np.clip(rr[0::4], 0.03, 1); orm[2::4] = 0.0
    slike["orm"].pixels.foreach_set(orm); slike["orm"].update()
    for k_ in ("baza", "normala", "orm"):
        sl = slike[k_]
        sl.filepath_raw = os.path.join(izhod, f"{oznaka}-{k_}.png"); sl.file_format = "PNG"
        sl.save()
    narejeni = set()
    for o in objekti:  # izvoz: brez pomožnih vozlišč peke, slike povezane
        for mat in o.data.materials:
            if mat.name in narejeni: continue
            narejeni.add(mat.name)
            for ime in ("rr", "ao"):
                nd = mat.node_tree.nodes.get(ime)
                if nd: mat.node_tree.nodes.remove(nd)
            povezi_izvoz(mat)
    print(f"[peka] {oznaka}: skupaj {time.time() - t0:.0f} s", flush=True)
    return slike

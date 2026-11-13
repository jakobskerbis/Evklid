# Možgani: deblo, mali možgani in sredinske strukture iz HRA brain v1.4 (Allen Human Brain Reference Atlas, Ding in
# sod. 2016; HuBMAP Human Reference Atlas, CC BY 4.0;
# https://cdn.humanatlas.io/digital-objects/ref-organ/brain-male/v1.4/assets/3d-allen-m-brain.glb).
# Skorja ostane FreeSurfer (izvozi-organe.py skorja_iz_mri). Iz HRA: možgansko deblo (srednji možgani s četverno ploščo
# in možganskima krakoma, most z bazilarno izboklino, podaljšana hrbtenjača s piramidama in olivama, pedunkli), mali
# možgani (črv, paravermis, polobli), žuljevo telo, svod, pretin, sprednja komisura, talamus z jedri, češerika,
# hipotalamus z mamilarnima telescema, križišče vidnih živcev. Mreže HRA so po poloblah in redke (most 940 trikotnikov):
# vsaka skupina se zlije v eno zaprto telo (vokselska unija, glajenje brez krčenja, poenostavitev), akvedukt, četrti
# prekat in osrednji kanal se iz debla izrežejo. Poravnava: žuljevo telo HRA na medialno steno FreeSurfer (sprednji rob
# kolena, zadnji rob splenija, vrh trupa), širina in merilo višine iz škatle skorje.
# Za naslikano rezno ploskev (scripts/atlas/mozgani-rez-hra.py) vrne preseke posameznih struktur HRA s sredinsko ravnino.
import bpy, bmesh, re
import numpy as np
from drevesa import taubin_bm, tris

SKORJA = r"gyrus|gyri|lobule|_pole|operculum|cuneus|planum|cortex|insula"
# skupina: (ime vrstice, tkivo, del, regex virov HRA, voksel m, napihni m, glajenje, trikotnikov (računalnik, telefon))
SKUPINE = [
    ("Brainstem (HRA)", "deblo", "deblo",
     r"midbrain_tegmentum|_colliculus|crus_cerebri|pretectal|basilar_part_of_pons|pontine_tegmentum|pyramidal_part|tegmentum_of_medulla|"
     r"inferior_olive|cerebellar_peduncle|red_nucleus|substantia_nigra", 0.00035, 0.00025, 12, (11000, 4200)),
    ("Cerebellum (HRA)", "mali", "mali", r"cerebellar_vermis|paravermis|lateral_hemisphere_of_cerebellum|white_matter_of_hindbrain|cerebellar_deep",
     0.00045, 0.0002, 10, (20000, 7000)),
    ("Corpus callosum (HRA)", "bela", "zuljevo", r"corpus_callosum", 0.0004, 0.0002, 12, (5000, 1800)),
    ("Fornix (HRA)", "bela", "zuljevo", r"fornix", 0.0003, 0.0002, 10, (1800, 700)),
    ("Septum pellucidum (HRA)", "bela", "zuljevo", r"septal_nuclei", 0.0003, 0.0, 10, (1200, 500)),
    ("Anterior commissure (HRA)", "bela", "zuljevo", r"anterior_commissure", 0.00025, 0.0002, 8, (500, 250)),
    ("Optic chiasm (HRA)", "bela", "krizisce", r"optic_chiasm|optic_tract", 0.00025, 0.0002, 8, (1600, 600)),
    ("Thalamus (HRA)", "medmozgani", "talamus",
     r"nucleus_of_thalamus|nuclear_complex_of_thalamus|pulvinar|habenular|geniculate|midline_nuclear|ventral_posterior|zona_incerta|subthalamic",
     0.00035, 0.0003, 14, (4000, 1500)),
    ("Pineal body (HRA)", "medmozgani", "talamus", r"pineal_body", 0.0002, 0.0001, 8, (400, 200)),
    ("Hypothalamus (HRA)", "medmozgani", "hipotalamus", r"hypothalamus|_region_of_HTH", 0.0003, 0.00025, 12, (2400, 900)),
]
IZREZI = r"cerebral_aqueduct|fourth_ventricle|central_canal"  # iz debla (in malih možganov) izrezane votline
# strukture za naslikano rezno ploskev (presek s sredinsko ravnino)
REZ = (r"basilar_part_of_pons|pontine_tegmentum|midbrain_tegmentum|_colliculus|crus_cerebri|pretectal|pyramidal_part|tegmentum_of_medulla|"
       r"inferior_olive|cerebellar_vermis|white_matter_of_hindbrain|paravermis|cerebral_aqueduct|fourth_ventricle|central_canal|"
       r"superior_cerebellar_peduncle|red_nucleus")


def _uvozi(pot):
    pred = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=pot)
    nov = [o for o in bpy.data.objects if o not in pred]
    mreze = {}
    for o in nov:
        if o.type == "MESH":
            me = o.data.copy(); me.transform(o.matrix_world); mreze[o.name] = me
    for o in nov:
        bpy.data.objects.remove(o)
    return mreze


def _tocke(me):
    P = np.empty(len(me.vertices) * 3); me.vertices.foreach_get("co", P)
    return P.reshape(-1, 3)


def _zlij(viri, T, voksel, napihni, tmp, razdeli=1):
    """Vire (mreže HRA) preslika s T, vsakega razdeli (gladka ploskev namesto faset) in napihne po normalah, nato
    vokselska unija v eno zaprto mrežo. Vrne bmesh."""
    bm = bmesh.new()
    for me in viri:
        m = me.copy(); m.vertices.foreach_set("co", T(_tocke(m)).ravel()); m.update()
        o = bpy.data.objects.new("_h", m); tmp.objects.link(o)
        if razdeli:
            mod = o.modifiers.new("s", "SUBSURF"); mod.levels = mod.render_levels = razdeli
        m2 = bpy.data.meshes.new_from_object(o.evaluated_get(bpy.context.evaluated_depsgraph_get()))
        bpy.data.objects.remove(o)
        b2 = bmesh.new(); b2.from_mesh(m2)
        bmesh.ops.recalc_face_normals(b2, faces=b2.faces)
        if napihni:
            b2.normal_update()
            for v in b2.verts:
                v.co += v.normal * napihni
        b2.to_mesh(m2); b2.free()
        bm.from_mesh(m2)
    me = bpy.data.meshes.new("_zlij"); bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new("_z", me); tmp.objects.link(o)
    mod = o.modifiers.new("r", "REMESH"); mod.mode = "VOXEL"; mod.voxel_size = voksel; mod.adaptivity = 0.0
    m3 = bpy.data.meshes.new_from_object(o.evaluated_get(bpy.context.evaluated_depsgraph_get()))
    bpy.data.objects.remove(o)
    bm = bmesh.new(); bm.from_mesh(m3)
    return bm


def _voksel(bm, voksel, tmp):
    me = bpy.data.meshes.new("_v"); bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new("_v", me); tmp.objects.link(o)
    mod = o.modifiers.new("r", "REMESH"); mod.mode = "VOXEL"; mod.voxel_size = voksel; mod.adaptivity = 0.0
    m3 = bpy.data.meshes.new_from_object(o.evaluated_get(bpy.context.evaluated_depsgraph_get()))
    bpy.data.objects.remove(o)
    out = bmesh.new(); out.from_mesh(m3)
    return out


def _kosi(bm):
    """Povezani kosi bmesh: [(prostornina s predznakom, [ploskve])]."""
    bm.faces.ensure_lookup_table()
    videno = set(); kosi = []
    for f in bm.faces:
        if f in videno:
            continue
        kos = [f]; videno.add(f); i = 0
        while i < len(kos):
            for e in kos[i].edges:
                for g in e.link_faces:
                    if g not in videno:
                        videno.add(g); kos.append(g)
            i += 1
        vol = 0.0
        for g in kos:
            vs = [v.co for v in g.verts]
            for k in range(1, len(vs) - 1):
                vol += vs[0].dot(vs[k].cross(vs[k + 1])) / 6.0
        kosi.append((vol, kos))
    return kosi


def _brez_votlin(bm, najmanj=2e-9):
    """Odstrani notranje votline (kosi z negativno prostornino: reže med viri) in drobne otoke (< 2 mm³)."""
    kosi = _kosi(bm)
    proc = [f for vol, kos in kosi if vol < najmanj for f in kos]
    if proc:
        bmesh.ops.delete(bm, geom=proc, context="FACES")
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context="VERTS")
    return len(kosi), sum(1 for vol, _ in kosi if vol < najmanj)


def _poenostavi(bm, cilj, tmp, ime):
    me = bpy.data.meshes.new(ime)
    bmesh.ops.triangulate(bm, faces=bm.faces)
    bm.to_mesh(me)
    n = tris(me)
    if n > cilj:
        o = bpy.data.objects.new("_p", me); tmp.objects.link(o)
        mod = o.modifiers.new("dec", "DECIMATE"); mod.ratio = cilj / n
        me2 = bpy.data.meshes.new_from_object(o.evaluated_get(bpy.context.evaluated_depsgraph_get()))
        bpy.data.objects.remove(o); bpy.data.meshes.remove(me); me = me2; me.name = ime
    for p in me.polygons:
        p.use_smooth = True
    return me


def _izrezi(bm, rezilo, tmp):
    """bm minus rezilo (natančen Boolean); vrne nov bmesh."""
    a = bpy.data.meshes.new("_a"); bm.to_mesh(a); bm.free()
    b = bpy.data.meshes.new("_b"); rezilo.to_mesh(b)
    oa = bpy.data.objects.new("_a", a); ob = bpy.data.objects.new("_b", b); tmp.objects.link(oa); tmp.objects.link(ob)
    mod = oa.modifiers.new("b", "BOOLEAN"); mod.operation = "DIFFERENCE"; mod.object = ob; mod.solver = "EXACT"
    m = bpy.data.meshes.new_from_object(oa.evaluated_get(bpy.context.evaluated_depsgraph_get()))
    bpy.data.objects.remove(oa); bpy.data.objects.remove(ob)
    out = bmesh.new(); out.from_mesh(m)
    return out


def _zanke_reza(me, T, x0):
    """Presek mreže (po preslikavi T) z ravnino x = x0: seznam zank [(y, z), …] (Blender, m)."""
    m = me.copy(); m.vertices.foreach_set("co", T(_tocke(m)).ravel())
    bm = bmesh.new(); bm.from_mesh(m)
    r = bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:], plane_co=(x0, 0, 0), plane_no=(1, 0, 0))
    ed = [e for e in r["geom_cut"] if isinstance(e, bmesh.types.BMEdge)]
    sos = {}
    for e in ed:
        a, b = e.verts
        sos.setdefault(a, []).append(b); sos.setdefault(b, []).append(a)
    zanke = []; videno = set()
    for v0 in sos:
        if v0 in videno:
            continue
        z = [v0]; videno.add(v0); v = v0
        while True:
            nasl = [w for w in sos[v] if w not in videno]
            if not nasl:
                break
            v = nasl[0]; videno.add(v); z.append(v)
        if len(z) >= 3 and z[0] in sos[z[-1]]:
            zanke.append([(round(q.co.y, 6), round(q.co.z, 6)) for q in z])
    bm.free()
    return zanke


def mozgani_hra(osnovni, cfg, tmp, pot, lo, hi):
    """Vrne (nove vrstice osnovni, fastigij). Odstrani vrstice Z-Anatomy tkiv deblo, mali, bela, medmozgani."""
    h = cfg["hra_mozgani"]
    M = _uvozi(pot)
    ime = lambda k: k.replace("Allen_", "").replace("VH_M_", "")
    # preslikava HRA → Blender Z-Anatomy
    sx = cfg.get("_sredinaX", 0.5 * (lo[0] + hi[0]))
    S = np.concatenate([_tocke(me) for k, me in M.items() if re.search(SKORJA, ime(k))])
    cc = np.concatenate([_tocke(me) for k, me in M.items() if "corpus_callosum" in k])
    W = np.array([tuple(v.co) for r in osnovni if r[2] == "sredina" for v in r[1].vertices])
    a, b = S.min(0), S.max(0); lo = np.array(lo, float); hi = np.array(hi, float)
    kx = (hi[0] - lo[0]) / (b[0] - a[0]); kz = (hi[2] - lo[2]) / (b[2] - a[2])
    if len(W) and h.get("poravnava", "zuljevo") == "zuljevo":
        # medialna stena FreeSurfer (rez med polobloma): spredaj koleno, zadaj splenij, zgoraj trup žuljevega telesa
        ky = (W[:, 1].max() - W[:, 1].min()) / (cc[:, 1].max() - cc[:, 1].min())
        oy = W[:, 1].min() - cc[:, 1].min() * ky
        oz = W[:, 2].max() - cc[:, 2].max() * kz
    else:
        ky = (hi[1] - lo[1]) / (b[1] - a[1]); oy = lo[1] - a[1] * ky; oz = lo[2] - a[2] * kz
    x_hra = h.get("sredinaHra", 0.0)
    K = np.array([kx, ky, kz])
    O = np.array([sx - x_hra * kx, oy, oz]) + np.array(h.get("premik", (0, 0, 0)))
    if h.get("preslikava"):  # razvoj (brez skorje): merilo in premik iz dnevnika izvoza
        K, O = np.array(h["preslikava"][0]), np.array(h["preslikava"][1])
    T = lambda P: P * K + O
    print(f"[organi] HRA možgani: merilo {[round(float(x), 3) for x in K]}, premik {[round(float(x) * 1000, 1) for x in O]} mm")
    izrezi = [me for k, me in M.items() if re.search(IZREZI, k)]
    vrstice = []; cfg.setdefault("_telefon", {})
    for ime_v, tkivo, d, rx, voksel, napihni, glajenje, (n_r, n_t) in SKUPINE:
        viri = [me for k, me in M.items() if re.search(rx, ime(k))]
        if not viri:
            print(f"[organi] HRA možgani: ni virov za {ime_v}"); continue
        zapri = h.get("zapri", {}).get(tkivo, 0.0)  # zaprtje rež med kosi atlasa (šivi med črvom, paravermisom in poloblo)
        bm = _zlij(viri, T, voksel, napihni + zapri, tmp)
        vseh, votlin = _brez_votlin(bm)
        if zapri:
            bm.normal_update()
            for v, n_ in [(v, v.normal.copy()) for v in bm.verts]:
                v.co -= n_ * zapri
        if tkivo in ("deblo", "mali") and izrezi:
            rez = _zlij(izrezi, T, 0.0003, h.get("votlina", 0.0003), tmp)
            _brez_votlin(rez)
            bm = _izrezi(bm, rez, tmp); rez.free()
            # po izrezu še enkrat vokselska mreža: tanke lupine in zavihki ob izrezu bi se pri poenostavitvi zložili
            bm = _voksel(bm, voksel, tmp)
            _brez_votlin(bm)
        taubin_bm(bm, glajenje)
        # vrstica: gosta mreža (visoka mreža peke: normalna mapa nosi obliko), računalnik in telefon poenostavljena
        me = _poenostavi(bm.copy(), h.get("gosto", 12) * n_r, tmp, ime_v)
        cfg.setdefault("_racunalnik", {})[ime_v] = _poenostavi(bm.copy(), n_r, tmp, ime_v + " racunalnik")
        cfg["_telefon"][ime_v] = _poenostavi(bm, n_t, tmp, ime_v + " telefon"); bm.free()
        print(f"[organi] HRA {ime_v}: {len(viri)} virov, kosov {vseh} (votlin/drobcev {votlin}), {tris(me)} / {n_r} / {tris(cfg['_telefon'][ime_v])} trikotnikov")
        vrstice.append([ime_v, me, tkivo, d, f"{ime_v} / Brain (HRA)"])
    # preseki struktur za naslikano rezno ploskev (ravnina prereza 0,4 mm od sredine, na strani leve poloble)
    x0 = sx + 0.0004
    cfg["_rezZanke"] = {}
    for k, me in M.items():
        if re.search(REZ, k):
            z = _zanke_reza(me, T, x0) or _zanke_reza(me, T, sx - 0.0004)
            if z:
                cfg["_rezZanke"].setdefault(re.sub(r"_[LR]$", "", ime(k)), []).extend(z)
    # fastigij: vrh četrtega prekata v sredinski ravnini (najbolj zadnja točka prekata)
    F = None
    fv = cfg["_rezZanke"].get("fourth_ventricle")
    if fv:
        q = max((p for z in fv for p in z), key=lambda p: p[0])
        F = np.array([sx, q[0], q[1]])
    stari = re.compile(h.get("zamenjaj", r"^(deblo|mali|bela|medmozgani)$"))
    ostalo = [r for r in osnovni if not stari.search(r[2])]
    print(f"[organi] HRA možgani: {len(vrstice)} teles namesto {len(osnovni) - len(ostalo)} objektov Z-Anatomy/MRI")
    return ostalo + vrstice, F

# Pljuča iz enega telesa (CT) in sapnik iz HRA:
#  - režnji: TotalSegmentator dataset v1, osebek s0913 (CC BY 4.0), robovi zaobljeni (scripts/atlas/pljuca-zile.py);
#  - pljučne arterije, vene in dihalno drevo v pljučih: model TotalSegmentator »lung_vessels« (Apache-2.0) na CT istega
#    osebka → drevesa (skelet + polmer) → okrogle cevi; arterije in vene so parne z bronhiji, ker so iz istega telesa;
#  - sapnik, karina in glavna bronhija s hrustančnimi obroči: HRA trachea v1.1 in main bronchus v1.1 (HuBMAP, Visible
#    Human Male, CC BY 4.0), afino poravnana na dihalno drevo CT (karina, konca glavnih bronhijev, os sapnika);
#  - hrustančni obroči bronhijev v pljučih: relief na ceveh (samo visoka mreža peke → normalna mapa).
# Vrstice Z-Anatomy za pljuča odpadejo; koordinate so koordinate CT (m, x levo, y nazaj, z gor).
import bpy, bmesh, math, os, re
import numpy as np
from mathutils import Vector
from drevesa import Notranjost, cev, zgladi, redci, st_stranic, taubin_bm, tris, poenostavi

REZNJI = {"Superior lobe of right lung": ("upper_lobe_right", "desni-zgornji"), "Middle lobe of right lung": ("middle_lobe_right", "desni-srednji"),
          "Inferior lobe of right lung": ("lower_lobe_right", "desni-spodnji"), "Superior lobe of left lung": ("upper_lobe_left", "levi-zgornji"),
          "Inferior lobe of left lung": ("lower_lobe_left", "levi-spodnji")}


def _mreza(ime, v, f):
    me = bpy.data.meshes.new(ime); me.from_pydata(np.asarray(v).tolist(), [], np.asarray(f).tolist()); me.update()
    return me


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


class Drevo:
    def __init__(self, P, R, S):
        self.P, self.R, self.S = np.asarray(P, float), np.asarray(R, float), np.asarray(S, int)
        n = len(P)
        self.otroci = [[] for _ in range(n)]
        for i, s in enumerate(self.S):
            if s >= 0:
                self.otroci[s].append(i)
        self.listi = np.zeros(n, int); self.dol = np.zeros(n)  # listov v poddrevesu, dolžina poddrevesa
        for i in range(n - 1, -1, -1):
            self.listi[i] = 1 if not self.otroci[i] else sum(self.listi[o] for o in self.otroci[i])
            self.dol[i] = sum(self.dol[o] + np.linalg.norm(self.P[o] - self.P[i]) for o in self.otroci[i])

    def veje(self, zacetki=None, najmanj_listov=1, najmanj_r=0.0, ustavi=None):
        """Lomljenke [(indeksi vozlišč)]: pri razcepu nadaljuje otrok z najdaljšim poddrevesom, drugi začnejo svojo vejo v
        starševem vozlišču. zacetki: vozlišča, od katerih navzdol (privzeto korenine)."""
        izhod = []
        sklad = [(int(i), []) for i in (np.flatnonzero(self.S < 0) if zacetki is None else zacetki)]
        while sklad:
            i, pot = sklad.pop()
            pot = list(pot)
            while True:
                pot.append(i)
                ot = [o for o in self.otroci[i] if self.listi[o] >= najmanj_listov and (self.R[o] >= najmanj_r or self.listi[o] > 2)]
                if not ot or (ustavi is not None and ustavi(i)):
                    break
                ot.sort(key=lambda o: -(self.dol[o] + 20 * self.R[o]))
                for o in ot[1:]:
                    sklad.append((o, [i]))
                i = ot[0]
            if len(pot) >= 2:
                izhod.append(pot)
        return izhod


def _cevi(seznam, ime, telefon=False, obroci=None, casa=None, korak=None):
    """[(P [Vector], R, odprt_zacetek)] → mreža zaprtih cevi. obroci(r) → (razmik, višina) reliefa hrustančnih obročev
    (visoka mreža peke); casa: prerezan začetek (stena, globina svetline)."""
    bm = bmesh.new()
    for P, R, odprt in seznam:
        P, R = zgladi(P, R, 6 if max(R) < 0.0015 else 3)
        r = max(R)
        ob = obroci(r) if obroci else None
        if ob:
            # gosto vzorčenje vzdolž osi: obroč = greben polmera (4 točke na obroč)
            raz, vis = ob
            L = [0.0]
            for a, b in zip(P, P[1:]):
                L.append(L[-1] + (b - a).length)
            if L[-1] < raz * 2:
                ob = None
            else:
                n = max(2, int(L[-1] / (raz / 6)))
                P2, R2 = [], []
                for k in range(n + 1):
                    s = L[-1] * k / n
                    j = min(max(np.searchsorted(L, s) - 1, 0), len(P) - 2)
                    t = (s - L[j]) / max(L[j + 1] - L[j], 1e-9)
                    g = max(0.0, math.cos(2 * math.pi * s / raz)) ** 1.5  # greben (obroč) in vmesna vez
                    P2.append(P[j].lerp(P[j + 1], t)); R2.append((R[j] + (R[j + 1] - R[j]) * t) * (1 + vis * (g - 0.35)))
                P, R = P2, R2
        if not ob:
            P, R = redci(P, R, korak or ((lambda r_: max(0.009, 5.0 * r_)) if telefon else (lambda r_: max(0.003, 1.6 * r_))))
        if len(P) < 2 or (P[-1] - P[0]).length < 1e-5:
            continue
        cev(bm, P, R, st_stranic(r, telefon), kupola=True, zacetek_kupola=not odprt, casa=casa(r) if (casa and odprt) else None)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(ime); bm.to_mesh(me); bm.free()
    for p in me.polygons:
        p.use_smooth = True
    return me


def _afina(A, B):
    """Afina preslikava (najmanjši kvadrati) točk A → B."""
    A1 = np.concatenate([A, np.ones((len(A), 1))], 1)
    X, *_ = np.linalg.lstsq(A1, B, rcond=None)
    return lambda P: np.concatenate([P, np.ones((len(P), 1))], 1) @ X


def pljuca_ct(osnovni, cfg, tmp):
    nast = cfg.get("pljuca_ct", {})
    pot = os.path.join(cfg.get("_ct_mapa") or "", nast.get("datoteka", "totalseg/pljuca-zile-v1.npz"))
    if not os.path.isfile(pot):  # brez podatkov CT: prejšnja pot (režnji in veje Z-Anatomy)
        from drevesa import pljucna_drevesa
        print("[organi] pljuča: ni", pot, "→ Z-Anatomy")
        return pljucna_drevesa(osnovni, cfg, tmp)
    d = np.load(pot)
    osnovni[:] = []  # Z-Anatomy: nič ne ostane
    tel = cfg.setdefault("_telefon", {}); rac = cfg.setdefault("_racunalnik", {})
    vrstice = []
    # ---------------------------------------------------------------- režnji
    n_g, n_r, n_t = nast.get("rezenj", (60000, 11000, 3300))
    for ime, (k, del_) in REZNJI.items():
        me = _mreza(ime, d[f"lung_{k}_v"], d[f"lung_{k}_f"])
        bm = bmesh.new(); bm.from_mesh(me); taubin_bm(bm, nast.get("glajenje", 40))
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces); bm.to_mesh(me); bm.free()
        g = poenostavi(me, min(1.0, n_g / tris(me)), tmp); g.name = ime
        rac[ime] = poenostavi(g, n_r / tris(g), tmp); tel[ime] = poenostavi(g, n_t / tris(g), tmp)
        vrstice.append([ime, g, "pljuca", del_, f"(lastno) {ime} / CT"])
        print(f"[organi] {ime}: {tris(g)} / {tris(rac[ime])} / {tris(tel[ime])} trikotnikov")
    krila = []
    for stran in ("right", "left"):
        me = _mreza("krilo " + stran, d[f"lung_{stran}_v"], d[f"lung_{stran}_f"])
        krila.append(poenostavi(me, min(1.0, 30000 / tris(me)), tmp))
    krilo = Notranjost(krila)
    def globina(p):  # m pod površino krila (negativno zunaj)
        return krilo.globina(Vector(p))
    # ---------------------------------------------------------------- dihalno drevo CT: karina in konca glavnih bronhijev
    D = Drevo(d["dihalne_P"], d["dihalne_R"], d["dihalne_S"])
    kor = int(np.flatnonzero(D.S < 0)[0])
    def razcep(i, najmanj_dol):  # prvo vozlišče navzdol od i z dvema otrokoma z dolgim poddrevesom
        while True:
            ot = [o for o in D.otroci[i] if D.dol[o] > najmanj_dol]
            if len(ot) >= 2 or not D.otroci[i]:
                return i, sorted(ot, key=lambda o: D.P[o][0])
            i = max(D.otroci[i], key=lambda o: D.dol[o])
    karina, (ot_d, ot_l) = (lambda r: (r[0], (r[1][0], r[1][-1])))(razcep(kor, 0.15))  # x levo +: desni otrok ima manjši x
    konec_d, _ = razcep(ot_d, 0.05); konec_l, _ = razcep(ot_l, 0.05)
    # točka na osi sapnika 60 mm nad karino
    i = karina; dol = 0.0
    while D.S[i] >= 0 and dol < 0.06:
        dol += np.linalg.norm(D.P[i] - D.P[D.S[i]]); i = D.S[i]
    sap_ct = D.P[i]; sap_dol = dol
    print(f"[organi] dihalno drevo CT: karina {np.round(D.P[karina] * 1000, 1)}, glavni bronhij desni {np.linalg.norm(D.P[konec_d] - D.P[karina]) * 1000:.0f} mm, levi {np.linalg.norm(D.P[konec_l] - D.P[karina]) * 1000:.0f} mm")
    # ---------------------------------------------------------------- sapnik in glavna bronhija HRA
    hra = cfg.get("_hra_mapa")
    ima_hra = hra and all(os.path.isfile(os.path.join(hra, f)) for f in ("3d-vh-m-trachea.glb", "3d-vh-m-main-bronchus.glb"))
    if ima_hra:
        H = {}
        for f in ("3d-vh-m-trachea.glb", "3d-vh-m-main-bronchus.glb"):
            H.update(_uvozi(os.path.join(hra, f)))
        car = _tocke(H["VH_M_carina"]).mean(0)
        def konec(k, znak):  # skrajni konec glavnega bronhija (5 % najbolj lateralnih oglišč)
            P = _tocke(H[k]); x = P[:, 0] * znak
            return P[x >= np.quantile(x, 0.95)].mean(0)
        h_d, h_l = konec("VH_M_right_main_bronchus", -1), konec("VH_M_left_main_bronchus", 1)
        T_ = _tocke(H["VH_M_trachea"])
        pas = T_[np.abs(T_[:, 2] - (car[2] + sap_dol)) < 0.004]
        h_s = pas.mean(0)
        def normala(c, a, b):
            n = np.cross(a - c, b - c); return n / np.linalg.norm(n)
        m_h = np.mean([np.linalg.norm(h_d - car), np.linalg.norm(h_l - car), np.linalg.norm(h_s - car)])
        c_ct = D.P[karina]
        m_c = np.mean([np.linalg.norm(D.P[konec_d] - c_ct), np.linalg.norm(D.P[konec_l] - c_ct), np.linalg.norm(sap_ct - c_ct)])
        A = np.array([car, h_d, h_l, h_s, car + normala(car, h_d, h_l) * m_h, car - normala(car, h_d, h_l) * m_h])
        B = np.array([c_ct, D.P[konec_d], D.P[konec_l], sap_ct, c_ct + normala(c_ct, D.P[konec_d], D.P[konec_l]) * m_c,
                      c_ct - normala(c_ct, D.P[konec_d], D.P[konec_l]) * m_c])
        T = _afina(A, B)
        print(f"[organi] sapnik HRA → CT: merilo {m_c / m_h:.3f}, ostanek {np.abs(T(A[:4]) - B[:4]).max() * 1000:.1f} mm")
        z_vrh = max(float(np.max([v[2] for k in REZNJI.values() for v in d[f'lung_{k[0]}_v'][::50]])) + nast.get("sapnikNad", 0.035), 0)
        def kos(kljuci, ime, stena, tkivo, del_, n_rt):
            bm = bmesh.new()
            for k in kljuci:
                m = H[k].copy(); m.vertices.foreach_set("co", T(_tocke(m)).ravel()); bm.from_mesh(m)
            bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-6)
            bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:], plane_co=(0, 0, z_vrh), plane_no=(0, 0, 1), clear_outer=True)
            bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
            me = bpy.data.meshes.new(ime); bm.to_mesh(me); bm.free()
            if stena:  # odprta lupina HRA → cev s steno (svetlina ostane odprta: prerezan vrh sapnika)
                o = bpy.data.objects.new("_s", me); tmp.objects.link(o)
                mod = o.modifiers.new("d", "SOLIDIFY"); mod.thickness = stena; mod.offset = -1; mod.use_even_offset = True
                me2 = bpy.data.meshes.new_from_object(o.evaluated_get(bpy.context.evaluated_depsgraph_get()))
                bpy.data.objects.remove(o); me = me2; me.name = ime
            for p in me.polygons:
                p.use_smooth = True
            rac[ime] = poenostavi(me, min(1.0, n_rt[0] / tris(me)), tmp); tel[ime] = poenostavi(me, min(1.0, n_rt[1] / tris(me)), tmp)
            vrstice.append([ime, me, tkivo, del_, f"(lastno) {ime} / HRA"])
            print(f"[organi] {ime}: {tris(me)} / {tris(rac[ime])} / {tris(tel[ime])} trikotnikov")
        kos(["VH_M_trachea", "VH_M_carina"], "Trachea (HRA)", 0.0013, "dihalna", "sapnik", (9000, 2600))
        kos(["VH_M_tracheal_cartilage"], "Tracheal cartilage (HRA)", 0, "hrustanec", "sapnik", (9000, 2600))
        kos(["VH_M_left_main_bronchus", "VH_M_right_main_bronchus"], "Main bronchi (HRA)", 0.0011, "dihalna", "bronhiji", (2600, 900))
        kos(["VH_M_cartilage_of_the_main_bronchus_L", "VH_M_cartilage_of_the_main_bronchus_R"], "Main bronchial cartilage (HRA)", 0, "hrustanec", "bronhiji", (2400, 800))
    # ---------------------------------------------------------------- cevi dreves
    def drevo_v_vrstice(Dr, zacetki, tkivo_zun, tkivo_v, del_, ime, obroci=None, tel_listi=3, tel_r=0.0011, rac_r=0.0, odprti=True):
        glob = np.array([globina(p) for p in Dr.P])
        notri = glob > nast.get("plevra", 0.0005)
        for raven, (listi, r_min, t) in (("g", (1, 0.0, False)), ("r", (1, rac_r, False)), ("t", (tel_listi, tel_r, True))):
            zun, vn = [], []
            for pot in Dr.veje(zacetki, listi, r_min):
                # konec veje tik pod plevro: cev ne sme pogledati skozi površino (globina < polmer + 0,6 mm)
                while len(pot) > 2 and notri[pot[-1]] and glob[pot[-1]] < Dr.R[pot[-1]] + 0.0006:
                    pot.pop()
                # razrez na dele zunaj in v pljučih (skupna točka na prehodu)
                teki = [[pot[0]]]
                for j in pot[1:]:
                    if notri[j] != notri[teki[-1][-1]] and len(teki[-1]) > 1:
                        teki[-1].append(j); teki.append([j])
                    else:
                        teki[-1].append(j)
                for kos_ in teki:
                    if len(kos_) < 2:
                        continue
                    je_notri = bool(notri[kos_[-1]]) if len(kos_) == 2 else bool(notri[kos_[1]])
                    zacetek_odprt = odprti and Dr.S[kos_[0]] < 0 and not je_notri
                    P = [Vector(Dr.P[j]) for j in kos_]; R = [float(Dr.R[j]) for j in kos_]
                    if not Dr.otroci[kos_[-1]] and len(R) > 3:  # list: konec se stanjša
                        m_ = len(R)
                        R = [x * (1 - 0.4 * max(0.0, (q / (m_ - 1) - 0.6) / 0.4)) for q, x in enumerate(R)]
                    (vn if je_notri else zun).append((P, R, zacetek_odprt))
            casa = (lambda r: (min(0.0012, r * 0.28), r * 1.2)) if odprti else None
            for sez, tk, pripona in ((zun, tkivo_zun, ""), (vn, tkivo_v, " in lungs")):
                if not sez:
                    continue
                ime_v = f"{ime}{pripona} (CT)"
                me = _cevi(sez, ime_v + raven, telefon=t, obroci=obroci if raven == "g" else None, casa=casa)
                if raven == "g":
                    me.name = ime_v; vrstice.append([ime_v, me, tk, del_, f"(lastno) {ime_v} / CT"])
                else:
                    (rac if raven == "r" else tel)[ime_v] = me
                print(f"[organi] {ime_v} {raven}: vej {len(sez)}, trikotnikov {tris(me)}")
    ob = lambda r: (max(0.0022, 0.9 * r + 0.0012), 0.09) if r > 0.0017 else None  # hrustanec do segmentnih in subsegmentnih bronhijev
    zac_b = [konec_d, konec_l] if ima_hra else [kor]
    drevo_v_vrstice(D, zac_b, "dihalna", "dihalna-v", "bronhiji", "Bronchi", obroci=ob, tel_listi=nast.get("telListi", 2), odprti=False)
    for kljuc, tk, del_, ime in (("arterije", "pljucna-arterija", "pljucne-arterije", "Pulmonary arteries"), ("vene", "pljucna-vena", "pljucne-vene", "Pulmonary veins")):
        Dr = Drevo(d[kljuc + "_P"], d[kljuc + "_R"], d[kljuc + "_S"])
        drevo_v_vrstice(Dr, None, tk, tk + "-v", del_, ime, tel_listi=nast.get("telListi", 2), tel_r=nast.get("telPolmer", 0.0011), rac_r=nast.get("racPolmer", 0.0))
    cfg["_karina"] = [float(x) for x in D.P[karina]]
    return vrstice

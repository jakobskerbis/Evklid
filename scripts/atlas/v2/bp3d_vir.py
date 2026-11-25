# Atlas v2: vir mreže iz BodyParts3D (DBCLS) namesto Z-Anatomy, kjer je ta podrobnejši (stegnenica: 23 k trikotnikov
# proti 3,8 k; prava intertrohanterni greben in linea aspera, plitva fovea, oblikovana kondila in trohlea).
# Samo na strežniku (numpy + scipy; za zunanjo lupino še modul bpy). Prenese le en del ZIP arhiva (HTTP Range), mm → m, obdrži zunanjo ploskev
# (stl-0.1 ima še notranjo steno kostnega mozga; pri nadlahtnici je z zunanjo povezana s 16 tuneli ob anatomskem vratu,
# zato tam zunanjo lupino določijo žarki in luknje zakrpa gladka krpa: zunanja_lupina), poravna na stegnenico Z-Anatomy (podobnost, ICP iz 24 orientacij), da
# kost ostane na svojem mestu v telesu atlasa, in prenese sklepni hrustanec (material) z najbližje ploskve Z-Anatomy.
#   python3 scripts/atlas/v2/bp3d_vir.py <Femur.l.ply iz izvozi_kost.py> <Femur.l.json> <izhod.json> [<kost, npr. Humerus.l>]
# Kost brez 4. argumenta = ime iz izvoza Z-Anatomy (<json> → »objekt«); FMA id in ime iz KOSTI (preverjeno v partsList.txt izdaje).
# Izhod (JSON, ker paket RTX prenaša samo *.py/*.json): objekt, vir (licenca, priznanje), V (m, osi atlasa), F, material.
import itertools, json, os, struct, subprocess, sys, zlib

import numpy as np
from scipy.spatial import cKDTree

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import kost  # noqa: E402

# Z-Anatomy ime → (FMA id, ime v https://dbarchive.biosciencedbc.jp/data/bodyparts3d/20090209/partsList.txt)
KOSTI = {"Femur.l": ("FMA24475", "left femur"), "Humerus.l": ("FMA23131", "left humerus")}


def vir(objekt):
    fma, ang = KOSTI[objekt]
    d = dict(VIR)  # vrstni red ključev kot v stegnenica-leva-bp3d.json
    return {"ime": d.pop("ime"), "avtor": d.pop("avtor"),
            "datoteka": f"BodyParts3D-stl-0.1.zip → BodyParts3D-stl-0.1\\{fma}.stl ({fma}, {ang}; izdaja 2009-02-09, 10 % poligonov)",
            **d, "spremembe": f"zunanja ploskev, mm → m, poravnava na Z-Anatomy {objekt} (podobnost), hrustanec iz Z-Anatomy (CC BY-SA 4.0)"}


VIR = {
    "ime": "BodyParts3D", "avtor": "Database Center for Life Science (DBCLS), Japonska",
    "url": "https://dbarchive.biosciencedbc.jp/data/bodyparts3d/20090209/BodyParts3D-stl-0.1.zip",
    "licenca": "CC BY 4.0 (licenca podatkovne zbirke od 2025-02-25; izdaja 2009 prvotno CC BY-SA 2.1 JP)",
    "licencaUrl": "https://creativecommons.org/licenses/by/4.0/",
    "priznanje": "BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International",
}
VELIKOST = 174483385


def zip_del(url, velikost, ime):
    def rng(a, b):
        return subprocess.run(["curl", "-s", "-m", "300", "-r", f"{a}-{b}", url], capture_output=True, check=True).stdout
    rep = rng(velikost - 2_000_000, velikost - 1); i = rep.rfind(b"PK\x05\x06")
    _, _, _, _, _, cs, co, _ = struct.unpack("<IHHHHIIH", rep[i:i + 22]); cd = rng(co, co + cs - 1); p = 0
    while p < len(cd):
        f = struct.unpack("<IHHHHHHIIIHHHHHII", cd[p:p + 46]); nm = cd[p + 46:p + 46 + f[10]].decode("latin1")
        p += 46 + f[10] + f[11] + f[12]
        if nm.endswith(ime):
            h = rng(f[16], f[16] + 29); fl, el = struct.unpack("<HH", h[26:30])
            d = rng(f[16] + 30 + fl + el, f[16] + 30 + fl + el + f[8] - 1)
            return zlib.decompress(d, -15) if f[4] == 8 else d
    raise SystemExit(f"{ime} ni v {url}")


def _sosednje(F):
    """Pari sosednjih ploskev (zaprta mnogoterna mreža: vsak rob ima dve)."""
    e = np.concatenate([F[:, [0, 1]], F[:, [1, 2]], F[:, [2, 0]]]); fi = np.tile(np.arange(len(F)), 3)
    _, inv = np.unique(np.sort(e, 1), axis=0, return_inverse=True)
    return fi[np.argsort(inv.ravel(), kind="stable")].reshape(-1, 2)


def _najvecja(F, maska, pari):
    from scipy.sparse import coo_matrix
    from scipy.sparse.csgraph import connected_components
    p = pari[maska[pari[:, 0]] & maska[pari[:, 1]]]
    _, lab = connected_components(coo_matrix((np.ones(len(p)), (p[:, 0], p[:, 1])), shape=(len(F), len(F))), directed=False)
    u, c = np.unique(lab[maska], return_counts=True)
    return maska & (lab == u[np.argmax(c)])


def euler(F):
    nv = len(np.unique(F)); ne = len(np.unique(np.sort(np.concatenate([F[:, [0, 1]], F[:, [1, 2]], F[:, [2, 0]]]), 1), axis=0))
    return nv - ne + len(F)


def zunanja_lupina(V, F, zarkov=12, prag=0.5):
    """Zunanja ploskev mreže, katere notranja stena (kostni mozeg) je z zunanjo povezana s tuneli (Euler ≠ 2). Iz središča
    vsake ploskve 12 naključnih žarkov v polprostor normale (Blenderjev BVHTree): notranja stena nima nobenega izhoda.
    Zunanja = največja povezana skupina ploskev z izhodom; rob nato obrezujemo (ploskve ob robu z < 50 % izhodov,
    oglišča, kjer se dotikata dve luknji, ozki jeziki), da ostanejo preproste luknje na zunanji površini. Luknje
    zapolni Blender (holes_fill), krpe 3× razdelimo in poravnamo z bi-Laplaceovo enačbo (robna oglišča vira so pritrjena:
    krpa se zvezno in gladko nadaljuje iz okolice, brez ravnih zaplat). Vrne (V, F, poročilo)."""
    import bpy  # noqa: F401  (mathutils)
    import bmesh
    from mathutils import Vector
    from mathutils.bvhtree import BVHTree
    from scipy.sparse import coo_matrix, diags
    from scipy.sparse.linalg import spsolve
    tr = BVHTree.FromPolygons(V.tolist(), F.tolist(), all_triangles=True)
    n = kost.ploskve_normale(V, F); n /= np.linalg.norm(n, axis=1)[:, None]
    c = V[F].mean(1); rng = np.random.default_rng(0); izhod = np.zeros(len(F))
    for _ in range(zarkov):
        d = rng.normal(size=(len(F), 3)); s = np.einsum("ij,ij->i", d, n); d[s < 0] -= 2 * s[s < 0, None] * n[s < 0]
        d /= np.linalg.norm(d, axis=1)[:, None]
        for i in range(len(F)):
            izhod[i] += tr.ray_cast(Vector(c[i] + n[i] * 2e-6), Vector(d[i]), 1.0)[0] is None
    izhod /= zarkov
    pari = _sosednje(F); m = _najvecja(F, izhod > 0, pari)
    for krog in range(200):
        Fo = np.where(m)[0]; Fm = F[m]
        e = np.concatenate([Fm[:, [0, 1]], Fm[:, [1, 2]], Fm[:, [2, 0]]])
        u, inv, cnt = np.unique(np.sort(e, 1), axis=0, return_inverse=True, return_counts=True)
        rf = np.unique(np.tile(Fo, 3)[cnt[inv.ravel()] == 1])
        dv = np.bincount(u[cnt == 1].ravel(), minlength=len(V))
        od = rf[(izhod[rf] < prag) | (dv[F[rf]] > 2).any(1) | (dv[F[rf]] > 0).all(1)]
        if not len(od):
            break
        m[od] = False; m = _najvecja(F, m, pari)
    u_, inv = np.unique(F[m], return_inverse=True); V2 = V[u_]; F2 = inv.reshape(-1, 3)
    bm = bmesh.new(); vs = [bm.verts.new(p) for p in V2.tolist()]
    for f in F2.tolist():
        bm.faces.new([vs[i] for i in f])
    n0 = len(bm.verts)
    rob = [e for e in bm.edges if e.is_boundary]; luknje = len(rob)
    krpa = bmesh.ops.holes_fill(bm, edges=rob, sides=0)["faces"]
    krpa = set(bmesh.ops.triangulate(bm, faces=krpa, quad_method="BEAUTY", ngon_method="BEAUTY")["faces"])
    izv = set(map(tuple, np.sort(F2, 1).tolist()))
    for _ in range(3):
        rb = list({e for f in krpa for e in f.edges if all(ff in krpa for ff in e.link_faces)})
        bmesh.ops.subdivide_edges(bm, edges=rb, cuts=1, use_grid_fill=True)
        bmesh.ops.triangulate(bm, faces=[f for f in bm.faces if len(f.verts) > 3])
        bm.verts.index_update()
        krpa = {f for f in bm.faces if tuple(sorted(v.index for v in f.verts)) not in izv}
    bm.verts.index_update()
    Vn = np.array([v.co[:] for v in bm.verts]); Fn = np.array([[v.index for v in f.verts] for f in bm.faces]); bm.free()
    E = np.unique(np.sort(np.concatenate([Fn[:, [0, 1]], Fn[:, [1, 2]], Fn[:, [2, 0]]]), 1), axis=0); nv = len(Vn)
    Ad = coo_matrix((np.ones(2 * len(E)), (np.r_[E[:, 0], E[:, 1]], np.r_[E[:, 1], E[:, 0]])), shape=(nv, nv)).tocsr()
    Lm = diags(1 / np.asarray(Ad.sum(1)).ravel()) @ Ad - diags(np.ones(nv)); L2 = (Lm @ Lm).tocsr()
    pr = np.arange(n0, nv); fk = np.arange(n0)
    M = L2[pr][:, pr].tocsc(); R = -L2[pr][:, fk] @ Vn[fk]
    Vn[pr] = np.stack([spsolve(M, R[:, j]) for j in range(3)], 1)
    por = {"notranja_stena_ploskev": int((izhod == 0).sum()), "euler_vira": euler(F), "obrezovanje_krogov": krog,
           "luknje_robov": luknje, "krpa_oglisc": int(nv - n0), "euler": euler(Fn)}
    return Vn, Fn, por


def main(zply, zjson, izhod, objekt=None):
    zi = json.load(open(zjson, encoding="utf-8"))
    objekt = objekt or zi["objekt"]
    stl = zip_del(VIR["url"], VELIKOST, KOSTI[objekt][0] + ".stl").decode("latin1")
    P = np.array([[float(x) for x in l.split()[1:4]] for l in stl.splitlines() if l.strip().startswith("vertex")])
    V, F = kost.zvari(P / 1000.0, np.arange(len(P)).reshape(-1, 3), 1e-7)
    ok = np.linalg.norm(kost.ploskve_normale(V, F), axis=1) > 1e-14
    _, en = np.unique(np.sort(F, 1), axis=0, return_index=True); m = np.zeros(len(F), bool); m[en] = True; F = F[m & ok]
    nk, lab = kost.komponente(len(V), F)
    if nk > 1:  # zunanja ploskev = največja |prostornina|
        fl = lab[F[:, 0]]
        vol = {c: abs(kost.prostornina(V, F[fl == c])) for c in np.unique(fl)}
        F = F[fl == max(vol, key=vol.get)]
    u_, inv = np.unique(F, return_inverse=True); V = V[u_]; F = inv.reshape(-1, 3)
    lupina = None
    if euler(F) != 2:  # notranja stena je s tuneli povezana z zunanjo (nadlahtnica; stegnenica ima ločeni komponenti)
        V, F, lupina = zunanja_lupina(V, F)
        print("[bp3d] zunanja lupina:", lupina, flush=True)
    ZV, ZF, zd = kost.beri_ply(zply); ZV, zr = kost.v_atlas(ZV, zi)
    if zr:
        ZF = ZF[:, ::-1]
    ZP, zfi = kost.vzorec(ZV, ZF, 60000); tree = cKDTree(ZP)
    S, _ = kost.vzorec(V, F, 20000)
    best = None
    for perm in itertools.permutations(range(3)):
        for sg in itertools.product((1, -1), repeat=3):
            R = np.zeros((3, 3))
            for i in range(3):
                R[i, perm[i]] = sg[i]
            if np.linalg.det(R) < 0:
                continue
            sc = 1.0; t = ZP.mean(0) - S.mean(0) @ R.T
            for _ in range(40):
                d, j = tree.query(sc * S @ R.T + t); Q = ZP[j]; mp, mq = S.mean(0), Q.mean(0)
                U, Sv, Wt = np.linalg.svd((S - mp).T @ (Q - mq))
                D = np.diag([1, 1, np.sign(np.linalg.det(Wt.T @ U.T))]); R = Wt.T @ D @ U.T
                sc = float(np.clip((Sv * np.diag(D)).sum() / ((S - mp) ** 2).sum(), 0.9, 1.1)); t = mq - sc * mp @ R.T
            err = tree.query(sc * S @ R.T + t)[0].mean()
            if best is None or err < best[0]:
                best = (err, R, t, sc)
    err, R, t, sc = best
    Va = sc * V @ R.T + t
    if kost.prostornina(Va, F) < 0:
        F = F[:, ::-1]
    _, j = tree.query(Va[F].mean(1))
    mat = zd["material"][zfi[j]]
    out = {"objekt": objekt, "materiali": ["Bone", "Cartilage"], "koordinate": "atlas (glTF, m)",
           "matrix_basis_blender": np.eye(4).tolist(), "vir": vir(objekt),
           "poravnava": {"napaka_mm": round(err * 1000, 2), "skala": round(sc, 5)}, **({"lupina": lupina} if lupina else {}),
           "oglisca": len(Va), "trikotniki": len(F),
           "V": np.round(Va, 6).ravel().tolist(), "F": F.ravel().tolist(), "material": mat.astype(int).tolist()}
    with open(izhod, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, separators=(",", ":"))
    print(f"[bp3d] {objekt}: komponent {nk}, {len(Va)} oglišč, {len(F)} trikotnikov, poravnava {err*1000:.2f} mm, skala {sc:.4f}, hrustanec {mat.mean():.3f}")


if __name__ == "__main__":
    main(*sys.argv[1:5])

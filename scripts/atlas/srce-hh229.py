# Priprava pravega srca HH229 (Visible Heart Laboratories, CC BY 4.0) za izvoz srca (izvozi-organe.py, srce_hh229.py).
# Vhod: tri mape Sketchfab (scene.gltf + scene.bin): hh229 (celo srce, mm), hh229_valves_vessels (zaklopke, venčne žile,
# isti preparat v svojem okviru). Izhod <izhod>/hh229-v1.npz:
#   V (m, okvir hh229), F: celo srce, zvarjeno, samo največja komponenta;
#   zak (po ploskvi: 0 ni zaklopka, 1..4 zaklopka po materialu valves_vessels), zakV/zakF/zakM: mreža zaklopk v okviru hh229;
#   zilV/zilF/zilM: venčne žile (arterije, vene) v okviru hh229; R, t, s: toga preslikava valves_vessels → hh229.
# Zagon: python3 scripts/atlas/srce-hh229.py <mapa sketchfab> <izhod>
import sys, os, numpy as np
import bpy, bmesh
from scipy.spatial import cKDTree

def nalozi(pot):
    """Mreže glTF v svetovnih koordinatah: [(material, V, F)]."""
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=pot)
    out = []
    for o in bpy.context.scene.objects:
        if o.type != "MESH": continue
        me = o.data; M = np.array(o.matrix_world)
        V = np.empty(len(me.vertices) * 3); me.vertices.foreach_get("co", V); V = V.reshape(-1, 3) @ M[:3, :3].T + M[:3, 3]
        me.calc_loop_triangles(); F = np.empty(len(me.loop_triangles) * 3, np.int32); me.loop_triangles.foreach_get("vertices", F)
        out.append((me.materials[0].name if me.materials else "None", V, F.reshape(-1, 3)))
    return out

def zdruzi(deli):
    V = np.vstack([d[1] for d in deli]); off = np.cumsum([0] + [len(d[1]) for d in deli])
    F = np.vstack([d[2] + off[i] for i, d in enumerate(deli)])
    return V, F

def zvari(V, F, eps):
    """Združi oglišča bližje od eps (mreža celic), odstrani izrojene ploskve."""
    k = np.round(V / eps).astype(np.int64)
    _, prvi, inv = np.unique(k, axis=0, return_index=True, return_inverse=True)
    F2 = inv.reshape(-1)[F]
    ok = (F2[:, 0] != F2[:, 1]) & (F2[:, 1] != F2[:, 2]) & (F2[:, 0] != F2[:, 2])
    return V[prvi], F2[ok]

def komponente(n, F):
    from scipy.sparse import coo_matrix
    from scipy.sparse.csgraph import connected_components
    i = np.concatenate([F[:, 0], F[:, 1], F[:, 2]]); j = np.concatenate([F[:, 1], F[:, 2], F[:, 0]])
    return connected_components(coo_matrix((np.ones(len(i), bool), (i, j)), shape=(n, n)), directed=False)[1]

def najvecja(V, F, delez=0.0):
    """Ohrani komponente z vsaj `delez` oglišč največje (0 = samo največjo)."""
    c = komponente(len(V), F); st = np.bincount(c)
    ok = st >= (st.max() if delez == 0 else delez * st.max())
    vz = ok[c]; nov = np.cumsum(vz) - 1
    Fz = F[vz[F].all(1)]
    return V[vz], nov[Fz]

def umeyama(A, B, merilo=False):
    ca, cb = A.mean(0), B.mean(0); H = (A - ca).T @ (B - cb) / len(A)
    U, S, Vt = np.linalg.svd(H); d = np.sign(np.linalg.det(Vt.T @ U.T)); D = np.diag([1, 1, d])
    R = Vt.T @ D @ U.T; s = (S * np.diag(D)).sum() / ((A - ca) ** 2).sum() * len(A) if merilo else 1.0
    return s, R, cb - s * R @ ca

def icp(X, kd, Y, s=1.0, R=np.eye(3), t=np.zeros(3), krat=60, obrezi=0.8, merilo=False):
    """Obrezani ICP: X → površina Y (točke), ohrani `obrezi` najbližjih parov."""
    for _ in range(krat):
        Z = s * X @ R.T + t; d, i = kd.query(Z)
        m = d <= np.quantile(d, obrezi)
        s, R, t = umeyama(X[m], Y[i[m]], merilo)
    Z = s * X @ R.T + t; d, _ = kd.query(Z)
    return s, R, t, d

if __name__ == "__main__":
    vhod, izhod = sys.argv[-2:]
    V, F = zdruzi(nalozi(os.path.join(vhod, "hh229", "scene.gltf")))
    V, F = zvari(V, F, 0.002); V, F = najvecja(V, F)
    print("hh229", len(V), len(F), V.min(0).round(1), V.max(0).round(1), flush=True)
    vv = nalozi(os.path.join(vhod, "hh229_valves_vessels", "scene.gltf"))
    mat = sorted({d[0] for d in vv})
    deli = {m: zdruzi([d for d in vv if d[0] == m]) for m in mat}
    rng = np.random.default_rng(1)
    kd = cKDTree(V)
    X = np.vstack([v[0][rng.choice(len(v[0]), min(len(v[0]), 6000), replace=False)] for v in deli.values()])
    # groba lega: okvir valves_vessels je drugače zasukan → naključni zasuki (enakomerno po SO(3)), kratek ICP na redkem
    # vzorcu, najboljših 12 do konca; ocena = mediana razdalje do površine celega srca
    lega = os.path.join(izhod, "hh229-vv-lega.npz")
    if os.path.exists(lega):
        L_ = np.load(lega); naj = (0.0, L_["R"], L_["t"])
    else:
        from scipy.spatial.transform import Rotation
        Xs = X[::25]; kand = []
        for R0 in Rotation.random(3000, random_state=2).as_matrix():
            t0 = V.mean(0) - R0 @ X.mean(0)
            s_, R_, t_, d_ = icp(Xs, kd, V, 1.0, R0, t0, krat=10, obrezi=0.7)
            kand.append((float(np.median(d_)), R_, t_))
        kand.sort(key=lambda k: k[0])
        print("kandidati", [round(k[0], 2) for k in kand[:12]], flush=True)
        naj = None
        for m_, R_, t_ in kand[:12]:
            s, R, t, d = icp(X[::4], kd, V, 1.0, R_, t_, krat=40)
            if naj is None or np.median(d) < naj[0]: naj = (float(np.median(d)), R, t)
    s, R, t, d = icp(X, kd, V, 1.0, naj[1], naj[2], krat=30)
    print("ICP toga: mediana", np.median(d).round(3), "90 %", np.quantile(d, 0.9).round(3), "zasuk°", np.degrees(np.arccos(np.clip((np.trace(R) - 1) / 2, -1, 1))).round(2), flush=True)
    s2, R2, t2, d2 = icp(X, kd, V, s, R, t, krat=20, merilo=True)
    print("ICP z merilom: merilo", round(float(s2), 4), "mediana", np.median(d2).round(3), flush=True)
    s, R, t = s2, R2, t2  # isti preparat, model zaklopk je ≈ 2 % manjši (drugačna segmentacija)
    np.savez(os.path.join(izhod, "hh229-vv-lega.npz"), s=s, R=R, t=t)
    for m, (Vm, Fm) in deli.items():
        dd, _ = kd.query(s * Vm[::20] @ R.T + t)
        print(" ", m, len(Fm), "mediana", np.median(dd).round(2), "90 %", np.quantile(dd, 0.9).round(2), "središče", (s * Vm.mean(0) @ R.T + t).round(1), "velikost", np.ptp(Vm, 0).round(1))
    # izhod v metrih; zaklopke po materialu: aortna (ob njej obe AV), pljučna, AV zaklopki a/b (levo/desno določi poravnava
    # na CT v srce_hh229.py), žile: arterije (Material.003), vene (004, 005)
    MM = 0.001
    VLOGE = {"Material.001": "aortna", "None": "pljucna", "Material.002": "av_a", "Material.007": "av_b",
             "Material.003": "arterije", "Material.004": "vene1", "Material.005": "vene2"}
    np.savez_compressed(os.path.join(izhod, "hh229-v1.npz"), V=V * MM, F=F.astype(np.int32),
                        **{f"V_{VLOGE[m]}": (s * v[0] @ R.T + t) * MM for m, v in deli.items()}, **{f"F_{VLOGE[m]}": v[1].astype(np.int32) for m, v in deli.items()})

# Atlas v2: vir mreže iz BodyParts3D (DBCLS) namesto Z-Anatomy, kjer je ta podrobnejši (stegnenica: 23 k trikotnikov
# proti 3,8 k; prava intertrohanterni greben in linea aspera, plitva fovea, oblikovana kondila in trohlea).
# Samo na strežniku (numpy + scipy). Prenese le en del ZIP arhiva (HTTP Range), mm → m, obdrži zunanjo ploskev
# (stl-0.1 ima še notranjo steno kostnega mozga), poravna na stegnenico Z-Anatomy (podobnost, ICP iz 24 orientacij), da
# kost ostane na svojem mestu v telesu atlasa, in prenese sklepni hrustanec (material) z najbližje ploskve Z-Anatomy.
#   python3 scripts/atlas/v2/bp3d_vir.py <Femur.l.ply iz izvozi_kost.py> <Femur.l.json> <izhod.json>
# Izhod (JSON, ker paket RTX prenaša samo *.py/*.json): objekt, vir (licenca, priznanje), V (m, osi atlasa), F, material.
import itertools, json, os, struct, subprocess, sys, zlib

import numpy as np
from scipy.spatial import cKDTree

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import kost  # noqa: E402

VIR = {
    "ime": "BodyParts3D", "avtor": "Database Center for Life Science (DBCLS), Japonska",
    "datoteka": "BodyParts3D-stl-0.1.zip → BodyParts3D-stl-0.1\\FMA24475.stl (FMA24475, left femur; izdaja 2009-02-09, 10 % poligonov)",
    "url": "https://dbarchive.biosciencedbc.jp/data/bodyparts3d/20090209/BodyParts3D-stl-0.1.zip",
    "licenca": "CC BY 4.0 (licenca podatkovne zbirke od 2025-02-25; izdaja 2009 prvotno CC BY-SA 2.1 JP)",
    "licencaUrl": "https://creativecommons.org/licenses/by/4.0/",
    "priznanje": "BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International",
    "spremembe": "zunanja ploskev, mm → m, poravnava na Z-Anatomy Femur.l (podobnost), hrustanec iz Z-Anatomy (CC BY-SA 4.0)",
}
VELIKOST, ZNOTRAJ = 174483385, "FMA24475.stl"


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


def main(zply, zjson, izhod):
    stl = zip_del(VIR["url"], VELIKOST, ZNOTRAJ).decode("latin1")
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
    zi = json.load(open(zjson, encoding="utf-8"))
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
    out = {"objekt": "Femur.l", "materiali": ["Bone", "Cartilage"], "koordinate": "atlas (glTF, m)",
           "matrix_basis_blender": np.eye(4).tolist(), "vir": VIR,
           "poravnava": {"napaka_mm": round(err * 1000, 2), "skala": round(sc, 5)},
           "oglisca": len(Va), "trikotniki": len(F),
           "V": np.round(Va, 6).ravel().tolist(), "F": F.ravel().tolist(), "material": mat.astype(int).tolist()}
    with open(izhod, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, separators=(",", ":"))
    print(f"[bp3d] {len(Va)} oglišč, {len(F)} trikotnikov, poravnava {err*1000:.2f} mm, skala {sc:.4f}, hrustanec {mat.mean():.3f}")


if __name__ == "__main__":
    main(*sys.argv[1:4])

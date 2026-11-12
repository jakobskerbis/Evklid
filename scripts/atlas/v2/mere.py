# Atlas v2: meritev ene kosti (mreža + učbeniške mere iz scripts/atlas/mere.json).
#   python3 scripts/atlas/v2/mere.py <mreza.ply|.glb> --kost Femur --stran l [--hrustanec <ply z materiali>] [--json izhod.json]
# Mreža: trikotniki, oglišča (zvarjena), odprti in nemnogoterni robovi, nedosledna usmerjenost, komponente, predznak
# prostornine (navznoter obrnjena), izrojeni trikotniki, samopresečišča (Blenderjev BVHTree.overlap, če je bpy na
# voljo), mere iz kost.MERE[--kost] (mere_stegnenice, mere_nadlahtnice) in primerjava z mere.json (±10 %). Izhod: JSON na stdout (in --json).
import json, os, sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import kost  # noqa: E402

KOREN = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))


def nalozi(pot):
    if pot.endswith(".ply"):
        V, F, dod = kost.beri_ply(pot)
        return V, F, dod
    import trimesh
    sc = trimesh.load(pot, force="scene")
    m = sc.to_geometry() if hasattr(sc, "to_geometry") else sc.dump(concatenate=True)
    return np.asarray(m.vertices, float), np.asarray(m.faces), {}


def samopresecisca(V, F):
    try:
        import bpy  # noqa: F401  (naloži mathutils iz modula bpy)
        from mathutils.bvhtree import BVHTree
    except Exception:
        return None
    t = BVHTree.FromPolygons([tuple(v) for v in V], [tuple(int(i) for i in f) for f in F], all_triangles=True, epsilon=0.0)
    pari = t.overlap(t)
    # overlap ne vrne sosednjih ploskev s skupnim ogliščem? Za vsak primer jih izločimo sami.
    Fs = [set(f) for f in F.tolist()]
    pravi = [(a, b) for a, b in pari if a < b and not (Fs[a] & Fs[b])]
    ploskve = set(i for p in pravi for i in p)
    return {"pari": len(pravi), "ploskve": len(ploskve)}


def mreza(V0, F0):
    V, F = kost.zvari(V0, F0)
    n = kost.ploskve_normale(V, F)
    izr = int((np.linalg.norm(n, axis=1) < 1e-14).sum())
    odprti, nemn, nedosl = kost.robovi(F)
    nk, lab = kost.komponente(len(V), F)
    vol = kost.prostornina(V, F)
    sp = samopresecisca(V, F)
    return {"trikotniki": int(len(F)), "oglisca_zvarjena": int(len(V)), "oglisca_datoteka": int(len(V0)),
            "odprti_robovi": odprti, "nemnogoterni_robovi": nemn, "nedosledno_usmerjeni_robovi": nedosl,
            "komponente": nk, "izrojeni_trikotniki": izr, "prostornina_cm3": round(vol * 1e6, 2),
            "navznoter": vol < 0, "samopresecisca": sp,
            "zaprta_mnogoterna": odprti == 0 and nemn == 0 and nedosl == 0 and izr == 0 and vol > 0}, V, F


def main(a):
    pot = a[0]
    def z(ime, privzeto=None):
        return a[a.index(ime) + 1] if ime in a else privzeto
    kost_ime, stran = z("--kost", "Femur"), z("--stran", "l")
    V0, F0, dod = nalozi(pot)
    m, V, F = mreza(V0, F0)
    hr = None
    vir_hr = z("--hrustanec")
    if "material" in dod:
        Vw, Fw = kost.zvari(V0, F0)
        hr = np.zeros(len(Vw), bool); hr[np.unique(Fw[dod["material"] == 1])] = True
    elif vir_hr:  # prenos oznak hrustanca z najbližjega oglišča izvorne mreže (ista lega)
        from scipy.spatial import cKDTree
        Vh, Fh, dh = kost.beri_ply(vir_hr)
        oz = np.zeros(len(Vh), bool); oz[np.unique(Fh[dh["material"] == 1])] = True
        _, i = cKDTree(Vh).query(V)
        hr = oz[i]
    mer, _ = kost.MERE[kost_ime](V, F, stran, hr)
    tabela = kost.preberi_mere(os.path.join(KOREN, "scripts", "atlas", "mere.json"))
    out = {"datoteka": os.path.relpath(os.path.abspath(pot), KOREN) if os.path.abspath(pot).startswith(KOREN) else pot,
           "bajti": os.path.getsize(pot), "mreza": m, "mere": {k: round(v, 2) for k, v in mer.items()},
           "primerjava": kost.primerjaj(mer, tabela, kost_ime)}
    s = json.dumps(out, ensure_ascii=False, indent=1)
    print(s)
    if z("--json"):
        with open(z("--json"), "w", encoding="utf-8") as f:
            f.write(s)
    return out


if __name__ == "__main__":
    main(sys.argv[1:])

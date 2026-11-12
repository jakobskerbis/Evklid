# Atlas v2: skupna geometrija za kosti (samo numpy; brez Blenderja). Uporabljata jo mere.py in postopek.py.
# Koordinate: metri, osi glTF kot atlas (Y gor, +Z spredaj, telo gleda v +Z; leva stran telesa je +X).
import json, os, re

import numpy as np

C_BL2GL = np.array([[1, 0, 0], [0, 0, 1], [0, -1, 0]], float)  # (x, y, z)_glTF = C · (x, y, z)_Blender


def beri_ply(pot):
    """Binarni ali ASCII PLY (naš izvoz) → V (n×3), F (m×3), dodatno {material: m, barva: n×3}."""
    with open(pot, "rb") as f:
        glava = []
        while True:
            v = f.readline().decode("latin1").strip()
            glava.append(v)
            if v == "end_header":
                break
        telo = f.read()
    fmt = next(v.split()[1] for v in glava if v.startswith("format"))
    nv = int(next(v.split()[2] for v in glava if v.startswith("element vertex")))
    nf = int(next(v.split()[2] for v in glava if v.startswith("element face")))
    i_f = next(i for i, v in enumerate(glava) if v.startswith("element face"))
    v_lastn = [v.split()[-1] for v in glava[:i_f] if v.startswith("property")]
    f_lastn = [v.split()[-1] for v in glava[i_f:] if v.startswith("property")]
    dod = {}
    if fmt == "ascii":
        vrst = telo.decode().split("\n")
        V = np.array([[float(x) for x in vrst[i].split()[:3]] for i in range(nv)])
        fv = [vrst[nv + i].split() for i in range(nf)]
        F = np.array([[int(x) for x in r[1:4]] for r in fv])
        if "material" in f_lastn:
            dod["material"] = np.array([int(r[4]) for r in fv])
    else:
        barva = "red" in v_lastn
        dt = [("x", "<f4"), ("y", "<f4"), ("z", "<f4")] + ([("r", "u1"), ("g", "u1"), ("b", "u1")] if barva else [])
        a = np.frombuffer(telo, dtype=dt, count=nv)
        V = np.stack([a["x"], a["y"], a["z"]], 1).astype(float)
        if barva:
            dod["barva"] = np.stack([a["r"], a["g"], a["b"]], 1) / 255.0
        fd = [("n", "u1"), ("i", "<i4", 3)] + ([("material", "u1")] if "material" in f_lastn else [])
        b = np.frombuffer(telo[a.nbytes:], dtype=fd, count=nf)
        F = b["i"].astype(np.int64)
        if "material" in f_lastn:
            dod["material"] = b["material"].astype(int)
    return V, F, dod


def pisi_ply(pot, V, F, material=None):
    with open(pot, "wb") as f:
        f.write((f"ply\nformat binary_little_endian 1.0\nelement vertex {len(V)}\nproperty float x\nproperty float y\n"
                 f"property float z\nelement face {len(F)}\nproperty list uchar int vertex_indices\n"
                 + ("property uchar material\n" if material is not None else "") + "end_header\n").encode())
        f.write(np.asarray(V, "<f4").tobytes())
        dt = [("n", "u1"), ("i", "<i4", 3)] + ([("material", "u1")] if material is not None else [])
        b = np.zeros(len(F), dtype=dt); b["n"] = 3; b["i"] = F
        if material is not None:
            b["material"] = material
        f.write(b.tobytes())


def v_atlas(V_lok, info):
    """Lastne koordinate objekta (osi glTF) → koordinate atlasa po matrix_basis iz izvozi_kost.py."""
    B = np.array(info["matrix_basis_blender"], float)
    R = C_BL2GL @ B[:3, :3] @ C_BL2GL.T
    t = C_BL2GL @ B[:3, 3]
    return V_lok @ R.T + t, np.linalg.det(R) < 0


def ploskve_normale(V, F):
    n = np.cross(V[F[:, 1]] - V[F[:, 0]], V[F[:, 2]] - V[F[:, 0]])
    return n


def prostornina(V, F):
    return float(np.einsum("ij,ij->i", V[F[:, 0]], np.cross(V[F[:, 1]], V[F[:, 2]])).sum() / 6)


def povrsina(V, F):
    return float(np.linalg.norm(ploskve_normale(V, F), axis=1).sum() / 2)


def zvari(V, F, tol=1e-7):
    """Zvari oglišča na isti legi (izvoz razdeli oglišča po šivih normal/UV)."""
    k = np.round(V / tol).astype(np.int64)
    _, idx, inv = np.unique(k, axis=0, return_index=True, return_inverse=True)
    inv = inv.ravel()
    return V[idx], inv[F]


def robovi(F):
    """Rob → število ploskev; vrne (odprti, nemnogoterni, nedosledno usmerjeni) robovi."""
    e = np.concatenate([F[:, [0, 1]], F[:, [1, 2]], F[:, [2, 0]]])
    s = np.sort(e, 1)
    _, inv, cnt = np.unique(s, axis=0, return_inverse=True, return_counts=True)
    inv = inv.ravel()
    odprti = int((cnt == 1).sum()); nemn = int((cnt > 2).sum())
    # usmerjenost: pri dveh ploskvah mora biti rob enkrat (a,b) in enkrat (b,a)
    smer = np.where(e[:, 0] < e[:, 1], 1, -1)
    vsota = np.bincount(inv, weights=smer, minlength=len(cnt))
    nedosl = int(((cnt == 2) & (vsota != 0)).sum())
    return odprti, nemn, nedosl


def komponente(nv, F):
    from scipy.sparse import coo_matrix
    from scipy.sparse.csgraph import connected_components
    r = np.concatenate([F[:, 0], F[:, 1], F[:, 2]]); c = np.concatenate([F[:, 1], F[:, 2], F[:, 0]])
    n, lab = connected_components(coo_matrix((np.ones(len(r)), (r, c)), shape=(nv, nv)), directed=False)
    upor = np.unique(F)
    return len(np.unique(lab[upor])), lab


def krogla(P):
    """Najmanjši kvadrati: središče in polmer krogle skozi točke P."""
    A = np.c_[2 * P, np.ones(len(P))]
    b = (P ** 2).sum(1)
    x, *_ = np.linalg.lstsq(A, b, rcond=None)
    c = x[:3]
    return c, float(np.sqrt(x[3] + c @ c))


def okvir_stegnenice(V, stran):
    """Osi kosti: os (distalno → proksimalno), med (medialno), spr (spredaj); t ∈ [0, 1] vzdolž osi (0 = distalno)."""
    c = V.mean(0)
    _, _, vt = np.linalg.svd(V - c, full_matrices=False)
    os_ = vt[0] * np.sign(vt[0][1])  # proksimalno = gor
    med = np.array([-1.0 if stran == "l" else 1.0, 0, 0])  # proti sredini telesa (leva stran je +X)
    med -= os_ * (med @ os_); med /= np.linalg.norm(med)
    spr = np.cross(os_, med) * (1 if stran == "r" else -1)  # desnosučni sistem: spredaj ≈ +Z
    if spr[2] < 0:
        spr = -spr
    h = (V - c) @ os_
    t = (h - h.min()) / (h.max() - h.min())
    return {"c": c, "os": os_, "med": med, "spr": spr, "t": t, "dolzina_os": float(h.max() - h.min())}


def vzorec(V, F, n=200000, seme=1):
    """Enakomerni vzorec točk po površini (neodvisen od gostote mreže) in indeks ploskve vsake točke."""
    rng = np.random.default_rng(seme)
    A = np.linalg.norm(ploskve_normale(V, F), axis=1)
    fi = rng.choice(len(F), n, p=A / A.sum())
    r1, r2 = rng.random(n), rng.random(n)
    s = np.sqrt(r1)
    P = (1 - s)[:, None] * V[F[fi, 0]] + (s * (1 - r2))[:, None] * V[F[fi, 1]] + (s * r2)[:, None] * V[F[fi, 2]]
    return P, fi


def mere_stegnenice(V0, F, stran, hrustanec_v=None):
    """Ključne mere (mm, stopinje). hrustanec_v: bool na oglišče (sklepni hrustanec), če je znan.
    Mere iz prerezov in vratu so iz enakomernega vzorca površine, zato ne zavisijo od gostote mreže."""
    P, fi = vzorec(V0, F)
    if hrustanec_v is not None:
        hr_f = hrustanec_v[F].sum(1) >= 2
        hrustanec_v = hr_f[fi]
    V = P
    o = okvir_stegnenice(V, stran)
    t, os_, med, spr = o["t"], o["os"], o["med"], o["spr"]
    m = {}
    # Največja dolžina (osteometrična deska): razdalja med ravninama, pravokotnima na os diafize, ki se dotikata
    # vrha glavice in najnižje točke kondila. Os diafize = premica skozi središča prerezov pri t 0,25–0,75.
    sred = []
    for tt in np.linspace(0.25, 0.75, 11):
        s = np.abs(t - tt) < 0.02
        sred.append(V[s].mean(0))
    sred = np.array(sred)
    _, _, vt = np.linalg.svd(sred - sred.mean(0))
    osd = vt[0] * np.sign(vt[0] @ os_)
    h = V @ osd
    m["najvecja_dolzina_mm"] = float((h.max() - h.min()) * 1000)
    # Glavica: krogla skozi proksimalni medialni hrustanec (ali, brez oznak, skozi najbolj medialna proksimalna oglišča)
    prox = t > 0.82
    if hrustanec_v is not None and (hrustanec_v & prox).sum() > 30:
        P = V[hrustanec_v & prox]
    else:
        q = V[prox] @ med
        P = V[prox][q > np.percentile(q, 70)]
    hc, hr = krogla(P)
    m["premer_glavice_mm"] = 2 * hr * 1000
    # Bikondilarna širina: obseg distalnih 12 % v medialno-lateralni smeri
    d = V[t < 0.12] @ med
    m["bikondilarna_sirina_mm"] = float((d.max() - d.min()) * 1000)
    # Sredina diafize: premer spredaj-zadaj in medialno-lateralno pri t = 0,5
    s = np.abs(t - 0.5) < 0.004
    m["diafiza_ap_mm"] = float(np.ptp(V[s] @ spr) * 1000)
    m["diafiza_ml_mm"] = float(np.ptp(V[s] @ med) * 1000)
    # Kot vratu (CCD): os vratu = središče glavice → težišče oglišč vratu (razdalja 1,15–1,6 R od središča, ne velik
    # obrtec); približno, ±3°
    lat = V @ (-med)
    gt = V[np.argmax(np.where(t > 0.75, lat, -1e9))]  # velik obrtec: najbolj lateralna proksimalna točka
    r = np.linalg.norm(V - hc, axis=1)
    vrat = (r > 1.15 * hr) & (r < 1.6 * hr) & (np.linalg.norm(V - gt, axis=1) > 0.03) & (t > 0.7)
    if vrat.sum() > 10:
        osv = V[vrat].mean(0) - hc; osv /= np.linalg.norm(osv)
        # kot med osjo vratu (od glavice proti diafizi) in osjo diafize navzgor, v čelni ravnini (projekcija brez spr)
        def proj(x):
            x = x - spr * (x @ spr); return x / np.linalg.norm(x)
        m["kot_vrat_diafiza_st"] = float(np.degrees(np.arccos(np.clip(proj(-osv) @ proj(osd), -1, 1))))
        m["kot_vrat_diafiza_st"] = 180 - m["kot_vrat_diafiza_st"]
        # anteverzija: kot med osjo vratu in čelno ravnino, gledano vzdolž diafize
        def proj2(x):
            x = x - osd * (x @ osd); return x / np.linalg.norm(x)
        pv = proj2(-osv)  # od vratu proti glavici je medialno; anteverzija = naklon naprej
        m["anteverzija_st"] = float(np.degrees(np.arcsin(np.clip(pv @ spr, -1, 1))))
    m["prostornina_cm3"] = prostornina(V0, F) * 1e6
    m["povrsina_cm2"] = povrsina(V0, F) * 1e4
    return m, {"okvir": o, "glavica": (hc, hr), "veliki_obrtec": gt, "os_diafize": osd}


def preberi_mere(pot):
    with open(pot, encoding="utf-8") as f:
        return json.load(f)


def primerjaj(izmerjeno, tabela, kost):
    """Vsaka mera iz scripts/atlas/mere.json → (vrednost, meja, v redu)."""
    out = {}
    for k, d in tabela["kosti"][kost]["mere"].items():
        if k not in izmerjeno:
            continue
        v = izmerjeno[k]; lo, hi = d["obmocje"]
        tol = d.get("toleranca", tabela["toleranca"])
        out[k] = {"vrednost": round(v, 1), "obmocje": [lo, hi], "meja": [round(lo * (1 - tol), 1), round(hi * (1 + tol), 1)],
                  "v_redu": bool(lo * (1 - tol) <= v <= hi * (1 + tol))}
    return out

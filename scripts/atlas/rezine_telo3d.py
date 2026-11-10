# »Pravo telo 3D« (docs/3d.md): 3D mreže organov naravnost iz mreže oznak rezin (ista segmentacija kot dotik na rezini,
# zato se 3D in rezina ujemata po definiciji) in barve površine iz istega barvnega volumna kriorezin NLM.
#   python3 scripts/atlas/rezine_telo3d.py <delo> <izhod> [--telefon 110000] [--racunalnik 420000]
# <delo>: konc.u8 (Z × Hc × Wc × 4, 1 mm, RGBA iz rezine.py), neobvezno maska3.u8 (rz5: 0 zunaj, 1 telo, 2 rez);
# <izhod>: meta.json in oznake.bin (rezine_oznake.py). Izhod v <izhod>: telo3d.glb (računalnik), telo3d-telefon.glb,
# telo3d.json (ključ → prostornina, središče, polmer, trikotniki). Koordinate: mm okvirja rezin (x desno→levo telesa,
# y spredaj→zadaj, z glava→noge), enako kot rezine in oznake. Samo numpy, scipy, scikit-image in fast-simplification
# (na RTX z Blenderjevim Pythonom: te pakete namesti rtx.py v vhodi/py).
#
# Koraki za vsako oznako: binarna maska → Gaussovo glajenje → marching cubes pri 0,5 (gladko, brez stopnic 2 mm) →
# Taubinovo glajenje (ne krči) → decimacija (quadric) na delež trikotnikov po površini → barva: mediana volumna 1–4 mm pod
# površino vzdolž notranje normale, le kjer je oznaka ista (nikoli barva soseda). Koža iz maske telesa, barva zglajena
# (~8 mm: brez podrobnosti obraza; darovalca ne kažemo prepoznavno).
import json, os, struct, sys
import numpy as np
from scipy import ndimage as ndi
from scipy import sparse

try:
    from skimage.measure import marching_cubes
except ImportError:  # pragma: no cover
    marching_cubes = None
import fast_simplification

a = sys.argv[1:]


def _z(ime, priv):
    if ime in a:
        i = a.index(ime); v = a[i + 1]; del a[i:i + 2]; return type(priv)(v)
    return priv


CILJ_TEL = _z("--telefon", 110000)
CILJ_RAC = _z("--racunalnik", 420000)
SAMO = _z("--samo", "")  # za preizkus: ključi, ločeni z vejico
Z0 = _z("--z0", 0)      # izrez po višini (mm od vrha), npr. prsni koš 236–540 (vmesni pregled j, 10. 11.)
Z1 = _z("--z1", 0)
IZHOD_IME = _z("--ime", "telo3d")
DODATNE = _z("--dodatne", "")  # npz {oznake: uint8 (Z2, H2, W2), kljuc: str}: npr. mišičnina iz fotografije (za/poravnaj.py)
delo, izhod = a[0], a[1]
meta = json.load(open(os.path.join(izhod, "meta.json"), encoding="utf-8"))
Wc, Hc, Z = meta["dim"]
oz = meta["oznake"]; MM = oz["mm"]; W2, H2, Z2 = oz["dim"]; kljuci = oz["kljuci"]


def beri_oznake():
    p = np.fromfile(os.path.join(izhod, oz["datoteka"]), "<u2").reshape(-1, 2).astype(np.int64)
    n = W2 * H2 * Z2
    return np.repeat(p[:, 1], p[:, 0])[:n].astype(np.uint8).reshape(Z2, H2, W2)


ozn = beri_oznake()
if DODATNE:
    # dodatna oznaka (samodejno iz fotografije) le tam, kjer HRA nima ničesar; ključ dobi novo številko in gre v meta +
    # oznake.bin, da jo pozna tudi dotik na rezini (»samodejno« v meta.oznake.samodejno)
    d_ = np.load(DODATNE)
    kl_ = str(d_["kljuc"]) if "kljuc" in d_ else "misice-prsnega-kosa"
    if kl_ not in kljuci:
        kljuci.append(kl_)
    sel = (d_["oznake"] > 0) & (ozn == 0)
    ozn[sel] = kljuci.index(kl_) + 1
    oz["kljuci"] = kljuci
    oz.setdefault("samodejno", [])
    if kl_ not in oz["samodejno"]:
        oz["samodejno"].append(kl_)
    ploski = ozn.ravel(); meje = np.flatnonzero(np.diff(ploski)) + 1
    zac = np.concatenate([[0], meje]); dol = np.diff(np.concatenate([zac, [len(ploski)]]))
    pari = []
    for s0, dd in zip(zac, dol):
        v0 = int(ploski[s0])
        while dd > 65535:
            pari.append((65535, v0)); dd -= 65535
        pari.append((int(dd), v0))
    np.array(pari, "<u2").tofile(os.path.join(izhod, oz["datoteka"]))
    oz["prisotne"] = sorted(set(oz.get("prisotne", [])) | {kl_})
    print(f"dodatna oznaka {kl_}: {int(sel.sum())} vokslov", flush=True)
if Z1 > Z0:  # samo izrez: zunaj ga ni (koža in organi so na robu izreza odprti)
    ozn[: Z0 // MM] = 0; ozn[-(-Z1 // MM):] = 0
konc = np.memmap(os.path.join(delo, "konc.u8"), np.uint8, "r", shape=(Z, Hc, Wc, 4))
print(f"oznake {ozn.shape}, prisotnih {len(np.unique(ozn)) - 1}", flush=True)

# ---- maska telesa 2 mm (koža): maska3 iz rz5, sicer alfa konc
p3 = os.path.join(delo, "maska3.u8")
telo = np.zeros((Z2, H2, W2), np.float32)
for z in range(Z2):
    z0, z1 = z * MM, min(Z, z * MM + MM)
    if z0 >= Z:
        break
    if os.path.exists(p3):
        m3 = np.memmap(p3, np.uint8, "r", shape=(Z, Hc, Wc))
        s = (np.asarray(m3[z0:z1]) == 1).astype(np.float32)
    else:
        s = (np.asarray(konc[z0:z1, :, :, 3]) > 127).astype(np.float32)
    s = np.pad(s, ((0, MM - s.shape[0]), (0, H2 * MM - Hc), (0, W2 * MM - Wc)))
    telo[z] = s.reshape(MM, H2, MM, W2, MM).mean((0, 2, 4))
telo_b = ndi.binary_fill_holes(telo > 0.5)
if Z1 > Z0:
    telo_b[: Z0 // MM] = False; telo_b[-(-Z1 // MM):] = False
print("telo:", int(telo_b.sum()), "vokslov", flush=True)


def taubin(V, F, n=6, lam=0.5, mu=-0.53):
    i = np.concatenate([F[:, 0], F[:, 1], F[:, 2], F[:, 1], F[:, 2], F[:, 0]])
    j = np.concatenate([F[:, 1], F[:, 2], F[:, 0], F[:, 0], F[:, 1], F[:, 2]])
    A = sparse.coo_matrix((np.ones(len(i)), (i, j)), shape=(len(V), len(V))).tocsr()
    A.data[:] = 1
    deg = np.asarray(A.sum(1)).ravel(); deg[deg == 0] = 1
    L = sparse.diags(1 / deg) @ A
    for _ in range(n):
        V = V + lam * (L @ V - V)
        V = V + mu * (L @ V - V)
    return V, A, deg


def normale(V, F):
    n = np.cross(V[F[:, 1]] - V[F[:, 0]], V[F[:, 2]] - V[F[:, 0]])
    N = np.zeros_like(V)
    for k in range(3):
        np.add.at(N, F[:, k], n)
    N /= np.linalg.norm(N, axis=1, keepdims=True) + 1e-12
    return N


def povrsina(V, F):
    return float(np.linalg.norm(np.cross(V[F[:, 1]] - V[F[:, 0]], V[F[:, 2]] - V[F[:, 0]]), axis=1).sum() / 2)


def mreza(maska, sigma=0.8):
    """Binarna maska (Z2, H2, W2) → (V v mm [x, y, z], F) ali None."""
    zz, yy, xx = np.where(maska)
    if len(zz) < 4:
        return None
    lo = np.maximum(np.array([zz.min(), yy.min(), xx.min()]) - 3, 0)
    hi = np.array([zz.max(), yy.max(), xx.max()]) + 4
    sub = np.zeros(hi - lo, np.float32)
    sub[zz - lo[0], yy - lo[1], xx - lo[2]] = 1
    sub = np.pad(sub, 1)
    g = ndi.gaussian_filter(sub, sigma)
    if g.max() < 0.5:
        g = g / g.max() * 0.75
    v, f, _, _ = marching_cubes(g, 0.5)
    v = v - 1 + lo  # (z, y, x) v celicah
    V = np.stack([(v[:, 2] + 0.5) * MM, (v[:, 1] + 0.5) * MM, (v[:, 0] + 0.5) * MM], 1)
    F = f[:, ::-1].astype(np.int64)  # navzven (marching_cubes da normale v smeri padanja; zrcaljene osi zamenjajo red)
    return V, F


def decimiraj(V, F, cilj):
    if len(F) <= cilj:
        return V, F
    V2, F2 = fast_simplification.simplify(V.astype(np.float32), F.astype(np.int32), target_reduction=1 - cilj / len(F))
    return V2.astype(np.float64), F2.astype(np.int64)


def obrni_navzven(V, F):
    """Predznačena prostornina < 0 → obrni trikotnike."""
    vol = np.einsum("ij,ij->i", V[F[:, 0]], np.cross(V[F[:, 1]], V[F[:, 2]])).sum() / 6
    return (F[:, ::-1] if vol < 0 else F), abs(vol)


def barve(V, N, kl_id, globine=(1.0, 2.0, 3.0, 4.0)):
    """Mediana RGB volumna pod površino (vzdolž -N), le kjer je oznaka kl_id (0 = telo, koža)."""
    zbir = np.full((len(V), len(globine), 3), np.nan, np.float32)
    for k, d in enumerate(globine):
        P = V - N * d
        xi = np.clip(np.round(P[:, 0]).astype(int), 0, Wc - 1); yi = np.clip(np.round(P[:, 1]).astype(int), 0, Hc - 1)
        zi = np.clip(np.round(P[:, 2]).astype(int), 0, Z - 1)
        if kl_id:
            ok = ozn[np.minimum(zi // MM, Z2 - 1), np.minimum(yi // MM, H2 - 1), np.minimum(xi // MM, W2 - 1)] == kl_id
        else:
            ok = np.ones(len(V), bool)
        red = np.argsort(zi[ok], kind="stable")
        idx = np.flatnonzero(ok)[red]
        if len(idx):
            c = konc[zi[idx], yi[idx], xi[idx]]
            dobri = c[:, 3] > 100
            zbir[idx[dobri], k] = c[dobri, :3]
    C = np.nanmedian(zbir, 1)
    manj = np.isnan(C[:, 0])
    if manj.all():
        return np.full((len(V), 3), 128, np.uint8)
    if manj.any():  # brez veljavnega vzorca: povprečje organa
        C[manj] = np.nanmedian(C[~manj], 0)
    return np.clip(C, 0, 255).astype(np.uint8)


def gladi_barve(C, A, deg, n):
    C = C.astype(np.float32)
    L = sparse.diags(1 / deg) @ A
    for _ in range(n):
        C = 0.5 * C + 0.5 * (L @ C)
    return np.clip(C, 0, 255).astype(np.uint8)


# ---- votli organi (j, 10. 11.: prekati in druge votline prazni): na mreži 1 mm je votlina temna kri na fotografiji znotraj
# oznake (svetlost < PRAG_KRVI po glajenju 1 mm, ≥ 1,5 mm od roba oznake); mreža organa je le stena (oznaka brez votline),
# zato rez pokaže steno s prazno notranjostjo. Velja za srčne votline, aorto, votlo veno in pljučne žile.
VOTLI = ["levi-prekat", "desni-prekat", "levi-preddvor", "desni-preddvor", "aorta", "votla-vena", "pljucna-arterija", "pljucna-vena"]
PRAG_KRVI = 36.0
stene = {}  # ključ → (maska 1 mm, izhodišče [z, y, x] v mm)


def votli_organi():
    idx = [kljuci.index(k) + 1 for k in VOTLI if k in kljuci]
    if not idx:
        return
    vse = np.isin(ozn, idx)
    if not vse.any():
        return
    zz, yy, xx = np.where(vse)
    lo2 = np.maximum([zz.min() - 2, yy.min() - 2, xx.min() - 2], 0); hi2 = np.minimum([zz.max() + 3, yy.max() + 3, xx.max() + 3], [Z2, H2, W2])
    sub = ozn[lo2[0]:hi2[0], lo2[1]:hi2[1], lo2[2]:hi2[2]]
    lo = lo2 * MM; hi = np.minimum(hi2 * MM, [Z, Hc, Wc])
    up = np.repeat(np.repeat(np.repeat(sub, MM, 0), MM, 1), MM, 2)[: hi[0] - lo[0], : hi[1] - lo[1], : hi[2] - lo[2]]
    Y = np.empty(up.shape, np.float32)
    for k in range(up.shape[0]):
        c = np.asarray(konc[lo[0] + k, lo[1]:hi[1], lo[2]:hi[2], :3], np.float32)
        Y[k] = c @ np.array([0.2126, 0.7152, 0.0722], np.float32)
    Y = ndi.gaussian_filter(Y, 1.0)
    for kl in VOTLI:
        if kl not in kljuci:
            continue
        m = up == kljuci.index(kl) + 1
        if m.sum() < 50:
            continue
        m = ndi.gaussian_filter(m.astype(np.float32), 1.0) > 0.5   # gladko iz 2 mm
        notri = ndi.binary_erosion(m, iterations=2)
        vot = ndi.binary_opening(notri & (Y < PRAG_KRVI), iterations=1)
        lbl, n = ndi.label(vot)
        if n:
            vel = ndi.sum(vot, lbl, range(1, n + 1)); vot = np.isin(lbl, 1 + np.flatnonzero(vel >= 30))
        stena = m & ~vot
        stene[kl] = (stena, lo)
        print(f"  {kl}: votlina {int(vot.sum()) / 1000:.1f} cm3, stena {int(stena.sum()) / 1000:.1f} cm3", flush=True)


votli_organi()


def mreza1(maska, lo, sigma=0.7):
    """Kot mreza(), a na mreži 1 mm z izhodiščem lo (z, y, x mm)."""
    g = ndi.gaussian_filter(np.pad(maska, 2).astype(np.float32), sigma)
    if g.max() < 0.5:
        return None
    v, f, _, _ = marching_cubes(g, 0.5)
    v = v - 2 + lo
    return np.stack([v[:, 2] + 0.5, v[:, 1] + 0.5, v[:, 0] + 0.5], 1), f.astype(np.int64)


# ---- surove mreže vseh oznak
izbor = set(SAMO.split(",")) if SAMO else None
surove = []
for i, kl in enumerate(kljuci, 1):
    if izbor and kl not in izbor:
        continue
    m = ozn == i
    n = int(m.sum())
    if n < 6:
        continue
    r = mreza1(*stene[kl]) if kl in stene else mreza(m, 0.7 if n > 400 else 0.55)
    if r is None:
        continue
    V, F = r
    V, A, deg = taubin(V, F, 3 if kl in stene else 4)
    F, vol = obrni_navzven(V, F)
    surove.append((kl, i, V, F, n * MM ** 3))
    print(f"  {kl}: {len(F)} trikotnikov, {n * MM ** 3 / 1000:.1f} cm3", flush=True)
r = mreza(telo_b, 1.0)
Vk, Fk = r
Vk, _, _ = taubin(Vk, Fk, 8)
Fk, _ = obrni_navzven(Vk, Fk)
print(f"  koza: {len(Fk)} trikotnikov", flush=True)

povrs = {kl: povrsina(V, F) for kl, _, V, F, _ in surove}
skupaj = sum(povrs.values()) or 1


def izvozi(cilj, ime, koza_cilj):
    meshes = []
    info = {}
    ostane = cilj - koza_cilj
    for kl, i, V, F, vol in surove:
        c = max(160, int(ostane * povrs[kl] / skupaj))
        V2, F2 = decimiraj(V, F, c)
        F2, _ = obrni_navzven(V2, F2)
        N = normale(V2, F2)
        C = barve(V2, N, i)
        meshes.append((kl, V2, N, C, F2))
        lo, hi = V2.min(0), V2.max(0)
        info[kl] = {"prostornina_cm3": round(vol / 1000, 2), "sredisce": ((lo + hi) / 2).round(1).tolist(),
                    "polmer": round(float(np.linalg.norm(hi - lo) / 2), 1), "trikotniki": int(len(F2))}
    V2, F2 = decimiraj(Vk, Fk, koza_cilj)
    F2, _ = obrni_navzven(V2, F2)
    N = normale(V2, F2)
    C = barve(V2, N, 0, (1.0, 2.0))
    i_ = np.concatenate([F2[:, 0], F2[:, 1], F2[:, 2]]); j_ = np.concatenate([F2[:, 1], F2[:, 2], F2[:, 0]])
    A = sparse.coo_matrix((np.ones(len(i_)), (i_, j_)), shape=(len(V2), len(V2))).tocsr(); A = A + A.T; A.data[:] = 1
    deg = np.asarray(A.sum(1)).ravel(); deg[deg == 0] = 1
    C = gladi_barve(C, A, deg, 40 if koza_cilj > 30000 else 14)
    meshes.append(("koza", V2, N, C, F2))
    info["koza"] = {"trikotniki": int(len(F2))}
    pisi_glb(os.path.join(izhod, ime), meshes)
    return info


Q = 0.05  # mm na enoto int16/uint16 položaja


def pisi_glb(pot, meshes):
    buf = bytearray(); views = []; accs = []; gmeshes = []; nodes = []

    def dodaj(arr, target=None):
        while len(buf) % 4:
            buf.append(0)
        off = len(buf); b = arr.tobytes(); buf.extend(b)
        v = {"buffer": 0, "byteOffset": off, "byteLength": len(b)}
        if target:
            v["target"] = target
        views.append(v)
        return len(views) - 1

    for kl, V, N, C, F in meshes:
        q = np.clip(np.round(V / Q), 0, 65535).astype(np.uint16)
        q4 = np.zeros((len(q), 4), np.uint16); q4[:, :3] = q  # poravnava atributa na 4 bajte
        n8 = np.zeros((len(N), 4), np.int8); n8[:, :3] = np.clip(np.round(N * 127), -127, 127)
        c4 = np.full((len(C), 4), 255, np.uint8); c4[:, :3] = C
        ind = F.astype(np.uint16 if len(V) < 65536 else np.uint32).ravel()
        bp = dodaj(q4, 34962); accs.append({"bufferView": bp, "componentType": 5123, "count": len(q), "type": "VEC3", "byteOffset": 0,
                                            "min": q.min(0).tolist(), "max": q.max(0).tolist()})
        views[bp]["byteStride"] = 8; ap = len(accs) - 1
        bn = dodaj(n8, 34962); accs.append({"bufferView": bn, "componentType": 5120, "normalized": True, "count": len(n8), "type": "VEC3"})
        views[bn]["byteStride"] = 4; an = len(accs) - 1
        bc = dodaj(c4, 34962); accs.append({"bufferView": bc, "componentType": 5121, "normalized": True, "count": len(c4), "type": "VEC4"})
        views[bc]["byteStride"] = 4; ac = len(accs) - 1
        bi = dodaj(ind, 34963); accs.append({"bufferView": bi, "componentType": 5123 if ind.dtype == np.uint16 else 5125, "count": len(ind), "type": "SCALAR"})
        ai = len(accs) - 1
        gmeshes.append({"name": kl, "primitives": [{"attributes": {"POSITION": ap, "NORMAL": an, "COLOR_0": ac}, "indices": ai}]})
        nodes.append({"name": kl, "mesh": len(gmeshes) - 1, "scale": [Q, Q, Q]})
    while len(buf) % 4:
        buf.append(0)
    gltf = {"asset": {"version": "2.0", "generator": "Evklid rezine_telo3d.py", "copyright": "Courtesy of the U.S. National Library of Medicine; labels from HuBMAP HRA (CC BY 4.0)"},
            "extensionsUsed": ["KHR_mesh_quantization"], "extensionsRequired": ["KHR_mesh_quantization"],
            "scene": 0, "scenes": [{"nodes": list(range(len(nodes)))}], "nodes": nodes, "meshes": gmeshes,
            "accessors": accs, "bufferViews": views, "buffers": [{"byteLength": len(buf)}]}
    js = json.dumps(gltf, separators=(",", ":")).encode()
    js += b" " * (-len(js) % 4)
    with open(pot, "wb") as f:
        f.write(struct.pack("<III", 0x46546C67, 2, 12 + 8 + len(js) + 8 + len(buf)))
        f.write(struct.pack("<II", len(js), 0x4E4F534A)); f.write(js)
        f.write(struct.pack("<II", len(buf), 0x004E4942)); f.write(bytes(buf))
    print(f"{pot}: {os.path.getsize(pot) / 1e6:.2f} MB, {sum(len(m[4]) for m in meshes)} trikotnikov", flush=True)


info_t = izvozi(CILJ_TEL, f"{IZHOD_IME}-telefon.glb", 16000)
info_r = izvozi(CILJ_RAC, f"{IZHOD_IME}.glb", 60000)
with open(os.path.join(izhod, f"{IZHOD_IME}.json"), "w", encoding="utf-8") as f:
    json.dump({"mm": MM, "q": Q, "strukture": info_r, "telefon": {k: v["trikotniki"] for k, v in info_t.items()},
               "vir": "oznake.bin (HuBMAP HRA, CC BY 4.0) + kriorezine NLM"}, f, ensure_ascii=False, indent=1)
# meta.json → telo3d (model ga naloži, če je naveden); oznake/poravnava ostanejo
meta = json.load(open(os.path.join(izhod, "meta.json"), encoding="utf-8"))
meta["oznake"] = oz
meta["telo3d"] = {"racunalnik": f"{IZHOD_IME}.glb", "telefon": f"{IZHOD_IME}-telefon.glb", "json": f"{IZHOD_IME}.json", "mm": MM, "vir": "oznake.bin",
                  **({"z": [Z0, Z1]} if Z1 > Z0 else {}), "votli": sorted(stene)}
with open(os.path.join(izhod, "meta.json"), "w", encoding="utf-8") as f:
    json.dump(meta, f, ensure_ascii=False, indent=1)

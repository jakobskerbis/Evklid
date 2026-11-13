#!/usr/bin/env python3
"""Mali možgani iz MRI: površina iz FreeSurferjeve segmentacije aseg istega osebka kot skorja (OpenNeuro ds000001,
fMRIPrep/FreeSurfer sub-01, CC0). Nadomesti režnjiče Z-Anatomy (napihnjeni baloni z vrzelmi).

  - oznake 7/8 (leva bela/siva), 46/47 (desna) → maska, zapolnjene luknje, zglajeno polje (σ 0,9 mm), dvakrat gostejša
    mreža (0,5 mm), marching cubes, Taubinovo glajenje (brez krčenja);
  - glavne fisure kot žlebovi v površini: kot okoli prečne osi skozi fastigij (vrh četrtega prekata, oznaka 15), 0° nazaj,
    90° gor; ob straneh se os pomakne naprej proti pedunklu. Na sredini (črv) leži fisura med režnjičema, ob straneh teče čez poloblo kot pri pravih malih možganih
    (fissura prima zgoraj, horizontalna ob zadnjem robu, posterolateralna spredaj spodaj). Ob deblu (pedunkli) žlebov ni;
  - drobne lističe (folia) nariše pregledovalnik (tkiva.mali.listi, središče = fastigij) in normalna mapa peke.
Možgansko deblo (oznaka 16) gre zraven samo kot vodilo: izvoz poravna mali možgane na deblo Z-Anatomy z isto preslikavo,
ki deblo MRI preslika na deblo Z-Anatomy (odnos mali možgani – deblo – četrti prekat ostane od istega osebka).

Izhod: <mapa>/<osebek>-mali.npz (mm, koordinate tkr RAS kot *.pial): mali_v, mali_f, deblo_v, deblo_f, fastigij.
  python3 scripts/atlas/mali-mozgani-mri.py <mapa mri> [osebek]      (bere <mapa>/<osebek>-aseg.mgz)
"""
import math
import os
import sys

import numpy as np

# (kot °, globina mm, pol širine mm): fisure med režnjiči črva (Standring, Gray's Anatomy, 42. izd.; sredinski prerez)
FISURE = [
    (152, 1.0, 0.8),   # precentralna (lingula | lobulus centralis)
    (122, 1.6, 0.9),   # preculminalna (centralis | culmen)
    (84, 3.0, 1.0),    # fissura prima (sprednji | zadnji reženj)
    (50, 1.4, 0.9),    # posteriorna superiorna (declive | folium)
    (22, 3.0, 1.0),    # horizontalna (folium | tuber)
    (-8, 1.8, 0.9),    # prepiramidna (tuber | pyramis)
    (-48, 1.8, 0.9),   # sekundarna (pyramis | uvula)
    (-104, 2.4, 1.0),  # posterolateralna (uvula | nodulus, flokulus)
]


def taubin(v, f, krogi=12, lam=0.5, mu=-0.53):
    from scipy import sparse
    n = len(v)
    i = np.concatenate([f[:, 0], f[:, 1], f[:, 2], f[:, 1], f[:, 2], f[:, 0]])
    j = np.concatenate([f[:, 1], f[:, 2], f[:, 0], f[:, 0], f[:, 1], f[:, 2]])
    A = sparse.csr_matrix((np.ones(len(i), np.float32), (i, j)), shape=(n, n))
    A.data[:] = 1.0
    st = np.asarray(A.sum(1)).ravel()
    st[st == 0] = 1
    for _ in range(krogi):
        for k in (lam, mu):
            v = v + k * (A @ v / st[:, None] - v)
    return v


def normale(v, f):
    n = np.cross(v[f[:, 1]] - v[f[:, 0]], v[f[:, 2]] - v[f[:, 0]])
    vn = np.zeros_like(v)
    for k in range(3):
        np.add.at(vn, f[:, k], n)
    return vn / np.maximum(np.linalg.norm(vn, axis=1, keepdims=True), 1e-12)


def povrsina(maska, tkr, sigma=0.9, gosto=2):
    from scipy import ndimage
    from skimage import measure
    idx = np.argwhere(maska)
    a = np.maximum(idx.min(0) - 6, 0); b = np.minimum(idx.max(0) + 7, maska.shape)
    m = maska[a[0]:b[0], a[1]:b[1], a[2]:b[2]].astype(np.float32)
    polje = ndimage.gaussian_filter(m, sigma)
    if gosto > 1:
        polje = ndimage.zoom(polje, gosto, order=3)
    v, f, _, _ = measure.marching_cubes(polje, 0.5)
    v = v / gosto + a
    v = v @ tkr[:3, :3].T + tkr[:3, 3]
    if np.linalg.det(tkr[:3, :3]) > 0:
        f = f[:, ::-1]
    return v.astype(np.float64), f.astype(np.int64)


def main():
    import nibabel as nib
    from scipy import ndimage
    mapa = sys.argv[1]; osebek = sys.argv[2] if len(sys.argv) > 2 else "sub-01"
    im = nib.load(os.path.join(mapa, f"{osebek}-aseg.mgz"))
    d = np.asarray(im.dataobj); tkr = im.header.get_vox2ras_tkr()
    mali = ndimage.binary_fill_holes(ndimage.binary_closing(np.isin(d, (7, 8, 46, 47)), iterations=1))
    deblo = ndimage.binary_fill_holes(d == 16)
    v, f = povrsina(mali, tkr, sigma=1.3)
    v = taubin(v, f, krogi=30)  # vijuge segmentacije (1 mm vokseli) niso lističi: gladka površina, lističe nariše senčilnik
    # fastigij: najbolj zadnja točka četrtega prekata (oznaka 15) pod streho (ob malih možganih)
    p15 = np.argwhere(d == 15) @ tkr[:3, :3].T + tkr[:3, 3]
    blizu = p15[ndimage.distance_transform_edt(~mali)[tuple(np.argwhere(d == 15).T)] <= 2.0]
    F = (blizu if len(blizu) else p15)[np.argmin((blizu if len(blizu) else p15)[:, 1])].copy()
    F[0] = np.median(p15[:, 0])  # x: sredina prekata (najbolj zadnji voksel je lahko ob strani)
    # žlebovi fisur: kot okoli prečne osi skozi F (0° nazaj = −y, 90° gor = +z)
    # Ob straneh se os pomakne naprej (k srednjemu pedunklu): na bočni ploskvi poloble fisure tečejo kot loki proti pedunklu,
    # ne kot žarki iz sredine ploskve
    ax = np.abs(v[:, 0] - F[0]) / 50.0
    dy, dz = v[:, 1] - (F[1] + 30.0 * ax ** 1.5), v[:, 2] - F[2]
    fi = np.degrees(np.arctan2(dz, -dy)); r = np.hypot(dy, dz)
    g = np.zeros(len(v))
    for kot, glob, w in FISURE:
        dfi = (fi - kot + 180) % 360 - 180
        g = np.maximum(g, glob * np.exp(-((np.radians(dfi) * r) / w) ** 2))
    # ob deblu (pedunkli, četrti prekat) in na sprednji ploskvi poloble ob pedunklu brez žlebov
    edt = ndimage.distance_transform_edt(~deblo)  # mm (1 mm vokseli)
    ijk = np.rint((v - tkr[:3, 3]) @ np.linalg.inv(tkr[:3, :3]).T).astype(int).clip(0, np.array(d.shape) - 1)
    dd = edt[tuple(ijk.T)]
    t = np.clip((dd - 3.0) / 7.0, 0, 1); g *= t * t * (3 - 2 * t)
    g *= np.clip(r / 8.0, 0, 1)  # tik ob osi ni smeri
    v = v - normale(v, f) * g[:, None]
    v = taubin(v, f, krogi=2)
    vd, fd = povrsina(deblo, tkr, sigma=1.0, gosto=1)
    vd = taubin(vd, fd, 8)
    izh = os.path.join(mapa, f"{osebek}-mali.npz")
    np.savez_compressed(izh, mali_v=v.astype(np.float32), mali_f=f.astype(np.int32), deblo_v=vd.astype(np.float32),
                        deblo_f=fd.astype(np.int32), fastigij=F.astype(np.float32))
    print(f"mali možgani: {len(v)} oglišč, {len(f)} trikotnikov; deblo {len(fd)}; fastigij {F.round(1)} → {izh}")


if __name__ == "__main__":
    main()

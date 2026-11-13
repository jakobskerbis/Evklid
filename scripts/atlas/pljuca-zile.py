#!/usr/bin/env python3
"""Pljučne arterije, vene in dihalno drevo iz CT istega osebka kot režnji (TotalSegmentator dataset v1, s0913, CC BY 4.0;
model TotalSegmentator »lung_vessels«, Apache-2.0, teče na CPU).

  1. scripts/atlas/pljuca-ct.py <mapa ct>                      (režnji; izbere osebek)
  2. CT in maske osebka v <mapa ct>/totalseg/<osebek>/ (ct.nii.gz, heart_atrium_left.nii.gz, režnji) – glej docs/3d.md
  3. TotalSegmentator -i ct.nii.gz -o lv -ta lung_vessels -d cpu
  4. python3 scripts/atlas/pljuca-zile.py <mapa ct> [osebek]   → <mapa ct>/totalseg/pljuca-zile-v1.npz

Maske (1,5 mm) so za marching cubes pregrobe (tanke veje so široke 1–2 voksla), zato iz njih naredimo drevesa: skelet,
polmer iz razdalje do roba maske, drevo od korenine ob hilusu (prekinjeni cikli), glajenje. Izvoz (pljuca_geometrija.py)
iz dreves zgradi okrogle cevi. Arterije in vene so obrezane ob hilusu (do 14 mm od pljuč; vene brez levega preddvora).
Koordinate kot pljuca-v1.npz: metri, x levo bolnika, y nazaj, z gor.
"""
import os, sys
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ct_orodja import drevo, povrsina, najv


def main():
    import nibabel as nib
    from scipy import ndimage
    mapa = sys.argv[1]; osebek = sys.argv[2] if len(sys.argv) > 2 else "s0913"
    B = os.path.join(mapa, "totalseg", osebek)
    nal = lambda f: nib.load(os.path.join(B, f))
    ct = nal("lv/lung_arteries.nii.gz"); aff = ct.affine; korak = np.array(ct.header.get_zooms()[:3], float)
    M = lambda f: np.asarray(nal(f).dataobj) > 0
    art, ven, zrak, la = M("lv/lung_arteries.nii.gz"), M("lv/lung_veins.nii.gz"), M("lv/lung_airways.nii.gz"), M("heart_atrium_left.nii.gz")
    REZNJI = ("upper_lobe_right", "middle_lobe_right", "lower_lobe_right", "upper_lobe_left", "lower_lobe_left")
    rez = {k: M(f"lung_{k}.nii.gz") for k in REZNJI}
    izh = {"osebek": osebek}
    # Režnji z zaobljenimi robovi: tanki ostri robovi pljuč (kostodiafragmalni recesus, sprednji rob ob srcu; na CT v
    # vdihu tanjši od 8 mm) so bili na modelu videti kot nagubano »krilo« ob bazi. Morfološko odprtje celega krila
    # (krogla 4,5 mm) jih odstrani, baza ostane gladka kupola, srčna zareza in jeziček (lingula) ostaneta.
    kr = int(round(4.5 / korak[0]))
    zz, yy, xx = np.ogrid[-kr:kr + 1, -kr:kr + 1, -kr:kr + 1]
    krogla = (xx * xx + yy * yy + zz * zz) <= kr * kr + 1
    pljuca = np.zeros(art.shape, bool)
    for stran in ("right", "left"):
        kr_ = np.any([m for k, m in rez.items() if k.endswith(stran)], axis=0)
        cel = ndimage.binary_closing(kr_, iterations=2)
        odp = ndimage.binary_opening(cel, structure=krogla)
        odp = najv(odp)
        # oznaka režnja za vsak voksel odprtega krila: najbližji reženj
        moji = [k for k in REZNJI if k.endswith(stran)]
        raz = np.stack([ndimage.distance_transform_edt(~rez[k]).astype(np.float32) for k in moji])
        ozn = raz.argmin(0)
        for i, k in enumerate(moji):
            v, f = povrsina(odp & (ozn == i), aff, korak)
            izh[f"lung_{k}_v"], izh[f"lung_{k}_f"] = v, f
            print("  reženj", k, len(v), len(f), flush=True)
        v, f = povrsina(odp, aff, korak, glajenje=1.2)
        izh[f"lung_{stran}_v"], izh[f"lung_{stran}_f"] = v, f
        pljuca |= odp
    d_pljuca = ndimage.distance_transform_edt(~pljuca, sampling=korak)  # mm od pljuč (0 v pljučih)
    najvecja = lambda m: (lambda l, n: l == (1 + np.argmax(np.bincount(l.ravel())[1:])))(*ndimage.label(m, structure=np.ones((3, 3, 3))))
    sred_x = float((np.argwhere(najvecja(zrak)) @ aff[:3, :3].T + aff[:3, 3])[:, 0].mean())  # sredina (sapnik), RAS mm
    for ime, m, hil in (("arterije", art, 14.0), ("vene", ven & ~ndimage.binary_dilation(la, iterations=1), 14.0)):
        m = najvecja(m) if ime == "arterije" else m
        m = m & (d_pljuca <= hil)
        l, n = ndimage.label(m, structure=np.ones((3, 3, 3)))
        vel = np.bincount(l.ravel()); m = np.isin(l, np.flatnonzero(vel > 400)[1:]) if n else m
        # korenina: debel konec zunaj pljuč, bližje sredini
        kor = lambda P, r: r * 2.0 - np.abs(P[:, 0] - sred_x) * 0.15 + 3.0 * (d_pljuca[tuple(np.round((P - aff[:3, 3]) / korak).astype(int).T)] > 2)
        P, R, S = drevo(m, korak, aff, kor, zunaj=d_pljuca > 0)
        izh[ime + "_P"], izh[ime + "_R"], izh[ime + "_S"] = P, R, S
        print(ime, "vozlišč", len(P), "korenin", int((S < 0).sum()), "polmer mm", round(float(R.min() * 1000), 2), round(float(R.max() * 1000), 2), flush=True)
    m = najvecja(zrak)
    P, R, S = drevo(m, korak, aff, lambda P, r: P[:, 2], min_veja_mm=5.0)  # korenina: vrh sapnika
    izh["dihalne_P"], izh["dihalne_R"], izh["dihalne_S"] = P, R, S
    print("dihalne vozlišč", len(P), "korenin", int((S < 0).sum()), "polmer mm", round(float(R.max() * 1000), 2))
    np.savez_compressed(os.path.join(mapa, "totalseg", "pljuca-zile-v1.npz"), **izh)
    print("zapisano", os.path.join(mapa, "totalseg", "pljuca-zile-v1.npz"))


if __name__ == "__main__":
    main()

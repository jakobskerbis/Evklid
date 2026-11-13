#!/usr/bin/env python3
"""Jetra iz enega telesa (CT): površina, segmenti in prava drevesa portalne vene in jetrnih ven.

Viri:
  - HVA-CT: Hepatic Venous Annotations CT (Zenodo 10.5281/zenodo.19850108, CC BY-SA 4.0): ločeni maski intrahepatičnega
    portalnega sistema (oznaka 1) in jetrnih ven s spodnjo votlo veno (oznaka 2) ter maska jeter, na CT iz Medical
    Segmentation Decathlon Task08 HepaticVessel (CC BY-SA 4.0). Mreže, izpeljane iz teh mask, so CC BY-SA 4.0.
  - TotalSegmentator (koda in modeli »total«, »liver_segments«, Apache-2.0) na istem CT: Couinaudovi segmenti 1–8
    (repasti reženj = segment 1), spodnja votla vena, žolčnik (če ga bolnik ima).

  python3 scripts/atlas/jetra-ct.py <mapa hva> <mapa msd> <izhod.npz> [primer, privzeto 374]

  <mapa hva>: hp/hp_masks/hepatic_portalvessel_<p>.nii.gz, liver/liver_masks/liver_<p>.nii.gz (razpakirana zip-a)
  <mapa msd>: seg/liver_segment_<1..8>.nii.gz, total/{inferior_vena_cava,gallbladder}.nii.gz
              (TotalSegmentator -i hepaticvessel_<p>.nii.gz -o seg -ta liver_segments; -o total -rs …)

Izhod (m, x levo bolnika, y nazaj, z gor): jetra_v/f, seg<i>_v/f, drevesi portalna_* in vene_* (P, R, S; vene_ivc = vozlišče
v spodnji votli veni), zolcnik_v/f (če je večji od 5 ml).
"""
import os, sys
import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ct_orodja import drevo, povrsina, najv


def main():
    import nibabel as nib
    from scipy import ndimage
    hva, msd, izhod = sys.argv[1:4]; p = sys.argv[4] if len(sys.argv) > 4 else "374"
    hp = nib.load(os.path.join(hva, "hp", "hp_masks", f"hepatic_portalvessel_{p}.nii.gz"))
    aff = hp.affine; korak = np.array(hp.header.get_zooms()[:3], float)
    h = np.asarray(hp.dataobj)
    L = np.asarray(nib.load(os.path.join(hva, "liver", "liver_masks", f"liver_{p}.nii.gz")).dataobj) > 0
    M = lambda f: np.asarray(nib.load(os.path.join(msd, f)).dataobj) > 0
    # jetra: maska z žilami v njej, brez lukenj; po rezinah zaprta (stopnice 1,5 mm zgladi površina)
    L = ndimage.binary_fill_holes(ndimage.binary_closing(L | ((h > 0) & ndimage.binary_dilation(L, iterations=2)), iterations=2))
    # spodnja votla vena ostane zunaj jeter (v svojem žlebu), sicer jo zapiranje maske pogoltne
    ivc = M("total/inferior_vena_cava.nii.gz")
    L = najv(L & ~ndimage.binary_dilation(ivc, iterations=1))
    izh = {"primer": p}
    izh["jetra_v"], izh["jetra_f"] = povrsina(L, aff, korak, glajenje=1.6)
    print("jetra", len(izh["jetra_v"]), "ml", round(L.sum() * np.prod(korak) / 1000))
    # segmenti: vsak voksel jeter dobi najbližji segment (TotalSegmentator pusti vrzeli ob žilah in robu)
    seg = [M(f"seg/liver_segment_{i}.nii.gz") for i in range(1, 9)]
    raz = np.stack([ndimage.distance_transform_edt(~s, sampling=korak).astype(np.float32) for s in seg])
    ozn = raz.argmin(0); del raz
    for i in range(8):
        m = L & (ozn == i)
        izh[f"seg{i + 1}_v"], izh[f"seg{i + 1}_f"] = povrsina(najv(m), aff, korak, glajenje=1.6, cilj=1.5)
        print("segment", i + 1, "ml", round(m.sum() * np.prod(korak) / 1000))
    # drevesa: maski na izotropno mrežo (z × 2), skelet, polmer
    kz = int(round(korak[2] / korak[0]))
    def izo(m):
        return np.repeat(m, kz, axis=2), korak / np.array([1, 1, kz]), aff @ np.diag([1, 1, 1.0 / kz, 1])
    d_jetra = ndimage.distance_transform_edt(~L, sampling=korak)  # mm od jeter (0 v jetrih)
    # portalna vena: deblo do 22 mm pod vrati (vranična in zgornja mezenterična vena odpadeta), korenina = spodnji debeli konec
    m, kr, af = izo((h == 1) & (d_jetra <= 22.0))
    m = najv(ndimage.binary_closing(m, iterations=1))
    dj, _, _ = izo(d_jetra > 0)
    kor = lambda P, r: r * 1.0 - 0.15 * P[:, 2] + 6.0 * dj[tuple(np.clip(np.round((P - af[:3, 3]) / kr).astype(int), 0, np.array(m.shape) - 1).T)]
    P, R, S = drevo(m, kr, af, kor, min_veja_mm=5.0)
    izh["portalna_P"], izh["portalna_R"], izh["portalna_S"] = P, R, S
    print("portalna vena: vozlišč", len(P), "korenin", int((S < 0).sum()), "polmer mm", round(float(R.max() * 1000), 1))
    # jetrne vene s spodnjo votlo veno (oznaka 2; votla vena TotalSegmentator jo podaljša nad in pod jetri): korenina = vrh
    # votla vena cela (ne le del ob jetrih), od 12 mm pod repastim režnjem do 8 mm nad kupolo jeter
    kk = np.arange(L.shape[2]); gor = aff[2, 2] > 0
    k1 = np.flatnonzero(seg[0].any((0, 1))); kL = np.flatnonzero(L.any((0, 1)))
    lo, hi = ((k1.min() - 12.0 / korak[2], kL.max() + 8.0 / korak[2]) if gor else (kL.min() - 8.0 / korak[2], k1.max() + 12.0 / korak[2]))
    ivc = ivc & ((kk >= lo) & (kk <= hi))[None, None, :]
    m, kr, af = izo(najv((h == 2) | ivc))
    m = najv(ndimage.binary_closing(m, iterations=1))
    P, R, S = drevo(m, kr, af, lambda P, r: P[:, 2] * 0.5 + r * 2.0, min_veja_mm=5.0)
    izh["vene_P"], izh["vene_R"], izh["vene_S"] = P, R, S
    # vozlišča v spodnji votli veni (maska TotalSegmentator, razširjena 3 mm) in njen polmer tam: os votle vene v izvozu
    ijk = np.round((np.c_[P * np.array([-1, -1, 1]) * 1000.0, np.ones(len(P))] @ np.linalg.inv(aff).T)[:, :3]).astype(int)
    ijk = tuple(np.clip(ijk, 0, np.array(ivc.shape) - 1).T)
    izh["vene_ivc"] = ndimage.binary_dilation(ivc, iterations=3)[ijk]
    izh["vene_ivcR"] = (ndimage.distance_transform_edt(ivc, sampling=korak)[ijk] / 1000.0).astype(np.float32)
    print("jetrne vene: vozlišč", len(P), "korenin", int((S < 0).sum()), "polmer mm", round(float(R.max() * 1000), 1))
    zb = M("total/gallbladder.nii.gz")
    if zb.sum() * np.prod(korak) / 1000 > 5:
        izh["zolcnik_v"], izh["zolcnik_f"] = povrsina(najv(zb), aff, korak, glajenje=1.2)
    else:
        print("žolčnika na CT ni (", round(zb.sum() * np.prod(korak) / 1000, 1), "ml ): izvoz postavi žolčnik Z-Anatomy v ležišče")
    np.savez_compressed(izhod, **izh)
    print("zapisano", izhod)


if __name__ == "__main__":
    main()

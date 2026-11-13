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


def drevo(m, korak, aff, korenina_naj, min_veja_mm=4.0, zunaj=None):
    """Maska → drevesa. Vrne P (N×3, m), R (N, m), stars (N; −1 korenina). korenina_naj(P_mm, r_mm) → ocena korenine."""
    from scipy import ndimage
    from skimage.morphology import skeletonize
    edt = ndimage.distance_transform_edt(m, sampling=korak)
    sk = skeletonize(m)
    idx = np.argwhere(sk)
    st = -np.ones(m.shape, np.int32); st[tuple(idx.T)] = np.arange(len(idx))
    sos = [[] for _ in idx]
    odm = [(a, b, c) for a in (-1, 0, 1) for b in (-1, 0, 1) for c in (-1, 0, 1) if (a, b, c) != (0, 0, 0)]
    pad = np.pad(st, 1, constant_values=-1)
    for o in odm:
        s2 = pad[1 + o[0]:pad.shape[0] - 1 + o[0], 1 + o[1]:pad.shape[1] - 1 + o[1], 1 + o[2]:pad.shape[2] - 1 + o[2]][tuple(idx.T)]
        for i in np.flatnonzero(s2 >= 0):
            sos[i].append(int(s2[i]))
    r = np.maximum(edt[tuple(idx.T)] - 0.5 * korak[0], 0.4 * korak[0])  # mm
    Pmm = idx @ aff[:3, :3].T + aff[:3, 3]
    # komponente skeleta, v vsaki korenina, drevo po najkrajši poti z utežjo 1/r (debele veje imajo prednost)
    import heapq
    stars = -2 * np.ones(len(idx), np.int64)
    videno = np.zeros(len(idx), bool)
    for zac in range(len(idx)):
        if videno[zac]:
            continue
        komp = [zac]; videno[zac] = True; k = 0
        while k < len(komp):
            for j in sos[komp[k]]:
                if not videno[j]:
                    videno[j] = True; komp.append(j)
            k += 1
        if len(komp) < 25:
            continue
        komp = np.array(komp)
        kor = komp[np.argmax(korenina_naj(Pmm[komp], r[komp]))]
        raz = {int(kor): 0.0}; stars[kor] = -1; kup = [(0.0, int(kor))]
        while kup:
            d, i = heapq.heappop(kup)
            if d > raz.get(i, 1e18):
                continue
            for j in sos[i]:
                nd = d + np.linalg.norm(Pmm[i] - Pmm[j]) / (0.5 * (r[i] + r[j])) ** 2
                if nd < raz.get(j, 1e18):
                    raz[j] = nd; stars[j] = i; heapq.heappush(kup, (nd, j))
    ziv = stars > -2
    # obrezovanje kratkih končnih vejic (ostroge skeleta): list → navzgor do razcepa; krajše od max(min, 1,5 r razcepa) odpadejo
    for _ in range(3):
        otrok = np.zeros(len(idx), int)
        for i in np.flatnonzero(ziv):
            if stars[i] >= 0:
                otrok[stars[i]] += 1
        for i in np.flatnonzero(ziv & (otrok == 0)):
            pot = [int(i)]; dol = 0.0
            while stars[pot[-1]] >= 0 and otrok[stars[pot[-1]]] == 1:
                dol += np.linalg.norm(Pmm[pot[-1]] - Pmm[stars[pot[-1]]]); pot.append(int(stars[pot[-1]]))
            raz_ = stars[pot[-1]]  # razcep (ali −1: veriga je cela komponenta)
            if raz_ >= 0 and dol + np.linalg.norm(Pmm[pot[-1]] - Pmm[raz_]) < max(min_veja_mm, 1.5 * r[raz_]):
                ziv[pot] = False
    if zunaj is not None:  # veje, ki nikjer ne vstopijo v pljuča (napačno označene žile ob srcu): brez potomca v pljučih odpadejo
        notri = ~zunaj[tuple(idx.T)] & ziv
        red_ = np.argsort([-len(sos[i]) for i in range(len(idx))])  # poljuben red; širimo od listov navzgor po starših
        ima = notri.copy()
        for _ in range(4000):
            st_ = stars[ima & (stars >= 0)]
            nov_ = np.zeros(len(idx), bool); nov_[st_] = True
            if not (nov_ & ~ima).any():
                break
            ima |= nov_
        ziv &= ima
    ziv[stars == -1] = True
    # prenumeracija (starši pred otroki)
    red = []
    otroci = {}
    for i in np.flatnonzero(ziv):
        if stars[i] >= 0 and ziv[stars[i]]:
            otroci.setdefault(int(stars[i]), []).append(int(i))
    for k0 in np.flatnonzero(ziv & (stars == -1)):
        sklad = [int(k0)]
        while sklad:
            i = sklad.pop(); red.append(i); sklad += otroci.get(i, [])
    nov = {i: k for k, i in enumerate(red)}
    P = Pmm[red]; R = r[red].copy()
    S = np.array([nov[int(stars[i])] if stars[i] >= 0 else -1 for i in red])
    # glajenje položajev (stopnice vokslov) in polmerov vzdolž drevesa; polmer otroka ≤ polmer starša
    n = len(P)
    for _ in range(12):
        vs = P.copy(); st_ = np.ones(n)
        ima = S >= 0
        np.add.at(vs, np.flatnonzero(ima), P[S[ima]]); st_[ima] += 1
        np.add.at(vs, S[ima], P[ima]); np.add.at(st_, S[ima], 1)
        Q = vs / st_[:, None]
        fiks = ~ima  # korenine ostanejo
        P = np.where(fiks[:, None], P, 0.5 * P + 0.5 * Q)
    for _ in range(6):
        vs = R.copy(); st_ = np.ones(n); ima = S >= 0
        np.add.at(vs, np.flatnonzero(ima), R[S[ima]]); st_[ima] += 1
        np.add.at(vs, S[ima], R[ima]); np.add.at(st_, S[ima], 1)
        R = vs / st_
    for i in range(n):
        if S[i] >= 0:
            R[i] = min(R[i], R[S[i]])
    P = P * np.array([-1, -1, 1]) / 1000.0  # RAS mm → m, x levo, y nazaj
    return P.astype(np.float32), (R / 1000.0).astype(np.float32), S.astype(np.int32)


def najv(m):
    from scipy import ndimage
    l, n = ndimage.label(m)
    return l == (1 + np.argmax(np.bincount(l.ravel())[1:])) if n else m


def povrsina(m, aff, korak, glajenje=1.5):
    """Maska → zglajena površina (marching cubes na 2× gostejši mreži), metri, x levo, y nazaj, z gor."""
    from scipy import ndimage
    from skimage import measure
    polje = ndimage.zoom(np.pad(m, 4).astype(np.float32), 2, order=1)
    polje = ndimage.gaussian_filter(polje, glajenje / korak * 2)
    v, f, _, _ = measure.marching_cubes(polje, 0.5)
    v = (v / 2.0 - 4 - 0.25) @ aff[:3, :3].T + aff[:3, 3]
    v = v * np.array([-1, -1, 1]) / 1000.0
    if np.linalg.det(aff[:3, :3]) > 0:
        f = f[:, ::-1]
    return v.astype(np.float32), f.astype(np.int32)


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
        raz = np.stack([ndimage.distance_transform_edt(~rez[k]) for k in moji])
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

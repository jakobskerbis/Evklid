# Skupna orodja za geometrijo iz mask CT (pljuca-zile.py, jetra-ct.py): površina maske (marching cubes na zglajenem
# polju) in drevo žil ali dihalnih poti (skelet + polmer iz razdalje do roba maske). Samo numpy/scipy/scikit-image.
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


def povrsina(m, aff, korak, glajenje=1.5, cilj=None):
    """Maska → zglajena površina (marching cubes na 2× gostejši mreži), metri, x levo, y nazaj, z gor."""
    from scipy import ndimage
    from skimage import measure
    ii = np.argwhere(m); a0 = np.maximum(ii.min(0) - 4, 0); b0 = np.minimum(ii.max(0) + 5, m.shape)  # izrez (pomnilnik)
    korak = np.asarray(korak, float)
    z = np.maximum(1, np.round(korak / (0.75 if cilj is None else cilj))).astype(int)  # povečava po oseh do ~0,75 mm
    polje = np.pad(m[a0[0]:b0[0], a0[1]:b0[1], a0[2]:b0[2]], 4).astype(np.float32)
    for os_, k in enumerate(z):
        if k > 1:
            polje = np.repeat(polje, k, axis=os_)
    polje = ndimage.gaussian_filter(polje, glajenje / korak * z)
    v, f, _, _ = measure.marching_cubes(polje, 0.5)
    v = ((v - (z - 1) / 2.0) / z - 4 + a0) @ aff[:3, :3].T + aff[:3, 3]
    v = v * np.array([-1, -1, 1]) / 1000.0
    if np.linalg.det(aff[:3, :3]) > 0:
        f = f[:, ::-1]
    return v.astype(np.float32), f.astype(np.int32)

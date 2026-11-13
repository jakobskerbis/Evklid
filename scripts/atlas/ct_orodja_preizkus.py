#!/usr/bin/env python3
"""Preizkus ct_orodja na umetnih maskah (brez podatkov CT): drevo v obliki črke Y in krogla. Izpiše JSON.

  python3 scripts/atlas/ct_orodja_preizkus.py
"""
import json, os, sys
import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ct_orodja import drevo, povrsina, najv


def main():
    korak = np.array([1.0, 1.0, 1.0]); aff = np.eye(4)
    x, y, z = np.mgrid[0:48, 0:48, 0:64]
    # deblo (polmer 4 mm) od z = 6 do 34, nato dve veji (polmer 2,5 mm) do z = 58
    m = ((x - 24) ** 2 + (y - 24) ** 2 <= 16) & (z >= 6) & (z <= 34)
    for s in (-1, 1):
        cx = 24 + s * (z - 34) * 0.6
        m |= ((x - cx) ** 2 + (y - 24) ** 2 <= 6.25) & (z >= 34) & (z <= 58)
    m[2, 2, 2] = True  # osamljen voksel: najv ga odstrani
    m = najv(m)
    P, R, S = drevo(m, korak, aff, lambda P, r: -P[:, 2], min_veja_mm=4.0)
    otroci = np.bincount(S[S >= 0], minlength=len(P))
    kor = int(np.flatnonzero(S < 0)[0])
    k = (x - 24) ** 2 + (y - 24) ** 2 + (z - 32) ** 2 <= 100
    v, f = povrsina(k, aff, korak, glajenje=1.0)
    a, b, c = v[f[:, 0]].astype(float), v[f[:, 1]].astype(float), v[f[:, 2]].astype(float)
    prostornina = abs(float(np.einsum("ij,ij->i", a, np.cross(b, c)).sum()) / 6.0) * 1e9  # mm³
    print(json.dumps(dict(vozlisc=len(P), korenin=int((S < 0).sum()), listov=int((otroci == 0).sum()), razcepov=int((otroci >= 2).sum()),
                          korenina_z_mm=float(P[kor, 2] * 1000), najvecji_r_mm=float(R.max() * 1000), r_korenine_mm=float(R[kor] * 1000),
                          starsi_pred_otroki=bool(np.all(S < np.arange(len(S)))), visina_mm=float((P[:, 2].max() - P[:, 2].min()) * 1000),
                          krogla_mm3=prostornina, krogla_oglisc=len(v))))


if __name__ == "__main__":
    main()

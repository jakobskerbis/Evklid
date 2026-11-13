#!/usr/bin/env python3
"""Risba sredinskega reza možganov iz MRI istega osebka kot skorja (OpenNeuro ds000001 fMRIPrep/FreeSurfer, CC0).

Krog n5 (ocena n4: brez prekatov, talamus kot kupola, brez sive/bele plasti na rezu skorje, arbor vitae ena pahljača):
rezna ploskev je prava rezina MRI. Slika T1 (brain.mgz) da svetlost tkiva (bela možganovina svetla, siva temnejša,
likvor temen), segmentacija aseg.mgz da prekate in dele. Rezina je sestavljena iz dveh vzporednih ravnin, kot na
učbeniških risbah: sredinska (žuljevo telo, forniks, 3. in 4. prekat, akvedukt, talamus, deblo, črv malih možganov z
arbor vitae) in parasagitalna 4,5 mm v ohranjeni polobli (prerezane vijuge s sivo skorjo in belo sredico) tam, kjer
sredinska ravnina teče med polobloma.

  python3 scripts/atlas/mozgani-rez-mri.py <mapa mri> <surovo>/mozgani.vozlisca.json public/3d/modeli/organi-3d [osebek]

Bere <osebek>-brain.mgz, -aseg.mgz, -lh.pial, -lh.aparc.annot in »mriAfina« (RAS mm → glTF m) iz poročila izvoza
(izvozi-organe.py). Zapiše mozgani-rez.webp (realne barve) in mozgani-rez-ucne.webp (barve delov iz mozgani.json) ter
v mozgani.json nastavi prerez.slika { slika, ucna, lo, mera } (koordinate ravnine reza kot rezSlika v organ.js).
"""
import json, os, sys
import numpy as np

CSF = [4, 5, 14, 15, 24, 43, 44, 31, 63]
SKUPINE = {  # skupina → oznake aseg
    "likvor": CSF, "bela": [2, 41, 77, 85], "zuljevo": [251, 252, 253, 254, 255], "skorja": [3, 42], "maliBela": [7, 46],
    "maliSiva": [8, 47], "deblo": [16], "talamus": [10, 49], "hipotalamus": [28, 60],
    "jedra": [11, 12, 13, 17, 18, 26, 50, 51, 52, 53, 54, 58],
}
SREDINSKE = ["likvor", "bela", "zuljevo", "maliBela", "maliSiva", "deblo", "talamus", "hipotalamus", "jedra"]  # iz sredinske ravnine
APARC_DELI = {
    "celni": "superiorfrontal rostralmiddlefrontal caudalmiddlefrontal parsopercularis parstriangularis parsorbitalis "
             "lateralorbitofrontal medialorbitofrontal precentral paracentral frontalpole",
    "temenski": "superiorparietal inferiorparietal supramarginal postcentral precuneus",
    "senceni": "superiortemporal middletemporal inferiortemporal bankssts fusiform transversetemporal temporalpole",
    "zatilni": "lateraloccipital lingual cuneus pericalcarine",
    "limbicni": "rostralanteriorcingulate caudalanteriorcingulate posteriorcingulate isthmuscingulate parahippocampal entorhinal insula",
}


def hexrgb(h):
    return np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)], float) / 255.0


def gladko(a, b, x):
    t = np.clip((x - a) / (b - a), 0.0, 1.0)
    return t * t * (3 - 2 * t)


def barve_reza(I, p_likvor, mali=None):
    """Realne barve svežega reza iz svetlosti T1 (bela možganovina 110): likvor temen, siva rožnato siva, bela kremna."""
    temna, siva, bela = hexrgb("#2a1715"), hexrgb("#c59a90"), hexrgb("#f1e6d6")
    t = gladko(80.0, 104.0, I)
    if mali is not None:  # mali možgani: tanke veje arbor vitae so pri 1 mm delno povprečene s skorjo – nižji prag, večji kontrast
        t = t * (1 - mali) + gladko(66.0, 90.0, I) * mali
    c = siva[None, None] + (bela - siva)[None, None] * t[..., None]
    c = c * (0.86 + 0.14 * gladko(45.0, 75.0, I))[..., None]
    k = np.maximum(1 - gladko(22.0, 52.0, I), gladko(0.35, 0.65, p_likvor))
    return c * (1 - k[..., None]) + temna[None, None] * k[..., None]


def main():
    import nibabel as nib
    from scipy import ndimage
    from scipy.spatial import cKDTree
    from PIL import Image
    mapa, porocilo, izhod = sys.argv[1:4]
    osebek = sys.argv[4] if len(sys.argv) > 4 else "sub-01"
    por = json.load(open(porocilo))
    pot_json = os.path.join(izhod, "mozgani.json")
    org = json.load(open(pot_json))
    M = np.array(por["mriAfina"], float)  # 3×4: RAS mm → glTF m
    t1 = nib.load(os.path.join(mapa, f"{osebek}-brain.mgz")); aseg = nib.load(os.path.join(mapa, f"{osebek}-aseg.mgz"))
    T1 = np.asarray(t1.dataobj).astype(np.float32); A = np.asarray(aseg.dataobj).astype(np.int32)
    tkr = t1.header.get_vox2ras_tkr()
    G = np.vstack([M, [0, 0, 0, 1]]) @ tkr  # voksel → glTF
    Gi = np.linalg.inv(G)
    rav = org["prerez"]["ravnine"][0]
    assert abs(abs(rav["n"][0]) - 1) < 1e-6, "rez možganov je sagitalen"
    x0 = -rav["d"] / rav["n"][0]
    stran = 1.0 if por.get("ohranjenaStran", "l") == "l" else -1.0
    x1 = x0 + stran * float(os.environ.get("REZ_PARA", 0.0045))
    # okvir: vsi vokslji možganov v koordinatah ravnine (x = −z glTF, y = y glTF; U = (0, 0, −1), V = (0, 1, 0))
    ijk = np.argwhere(A > 0)
    g = ijk @ G[:3, :3].T + G[:3, 3]
    lo = np.array([(-g[:, 2]).min(), g[:, 1].min()]) - 0.004; hi = np.array([(-g[:, 2]).max(), g[:, 1].max()]) + 0.004
    mera = float((hi - lo).max()); n = 1024
    px = lo[0] + (np.arange(n) + 0.5) / n * mera; py = lo[1] + (1 - (np.arange(n) + 0.5) / n) * mera  # vrstica 0 = zgoraj
    PX, PY = np.meshgrid(px, py)

    def vzorci(x, vol, red):
        P = np.stack([np.full(PX.shape, x), PY, -PX], -1)  # glTF
        V = P @ Gi[:3, :3].T + Gi[:3, 3]
        return ndimage.map_coordinates(vol, [V[..., 0], V[..., 1], V[..., 2]], order=red, mode="constant", cval=0.0)

    T1g = ndimage.gaussian_filter(T1, 0.45)
    verj = {k: ndimage.gaussian_filter(np.isin(A, v).astype(np.float32), 0.7) for k, v in SKUPINE.items()}
    maska = ndimage.gaussian_filter((A > 0).astype(np.float32), 0.7)
    sloji = {}
    for ime, x in (("sredina", x0), ("para", x1)):
        P = np.stack([vzorci(x, verj[k], 1) for k in SKUPINE], 0)
        sloji[ime] = dict(I=vzorci(x, T1g, 3), P=P, skupina=np.argmax(P, 0), m=vzorci(x, maska, 1))
    kljuci = list(SKUPINE)
    s, p = sloji["sredina"], sloji["para"]
    iz_sredine = (s["m"] > 0.5) & np.isin(s["skupina"], [kljuci.index(k) for k in SREDINSKE]) & (s["P"].max(0) > 0.3)
    iz_sredine = ndimage.binary_opening(iz_sredine, iterations=2)
    w = ndimage.gaussian_filter(iz_sredine.astype(np.float32), 1.5)[..., None]  # mehak prehod med ravninama
    I = s["I"] * w[..., 0] + p["I"] * (1 - w[..., 0])
    Pk = s["P"] * w[..., 0][None] + p["P"] * (1 - w[..., 0][None])
    m = s["m"] * w[..., 0] + p["m"] * (1 - w[..., 0])
    skupina = np.argmax(Pk, 0)
    # prekati so del reza (temna votlina), brazde zunaj možganov pa prozorne (za njimi je prava medialna ploskev poloble)
    trdno = ndimage.binary_fill_holes(m > 0.5)
    trdno &= ~((I < 14) & (Pk[kljuci.index("likvor")] < 0.3) & ~ndimage.binary_erosion(trdno, iterations=12))
    alfa = ndimage.gaussian_filter(trdno.astype(np.float32), 1.0)
    # mali možgani: skorja nekoliko bolj rožnata, drevo bele možganovine (arbor vitae) iz T1 z večjim kontrastom
    mali = gladko(0.4, 0.6, Pk[kljuci.index("maliSiva")] + Pk[kljuci.index("maliBela")])
    rgb = barve_reza(I, Pk[kljuci.index("likvor")], mali)
    rgb = rgb * (1 - 0.10 * mali[..., None] * np.array([0.0, 1.0, 1.0]))

    def shrani(barva, ime):
        im = np.dstack([np.clip(barva, 0, 1), np.clip(alfa, 0, 1)[..., None]])
        Image.fromarray((im * 255 + 0.5).astype(np.uint8), "RGBA").save(os.path.join(izhod, ime), "WEBP", quality=82, method=6)
        return os.path.getsize(os.path.join(izhod, ime))

    b1 = shrani(rgb, "mozgani-rez.webp")
    # učne barve: del po skupini aseg, možganska skorja in bela sredica po režnju najbližjega oglišča pialne površine
    deli = {d["id"]: hexrgb(d["barva"]) for d in org["deli"] if d.get("barva")}
    za_skupino = {"zuljevo": "zuljevo", "maliBela": "mali", "maliSiva": "mali", "deblo": "deblo", "talamus": "talamus", "hipotalamus": "hipotalamus",
                  "jedra": "talamus"}
    ucna = np.zeros(rgb.shape)
    for k, d in za_skupino.items():
        ucna[skupina == kljuci.index(k)] = deli.get(d, hexrgb("#cccccc"))
    v, lab = pial(os.path.join(mapa, f"{osebek}-{'lh' if stran > 0 else 'rh'}"))
    gv = v @ M[:, :3].T + M[:, 3]
    del_za = {ime: d for d, sez in APARC_DELI.items() for ime in sez.split()}
    ok = np.array([x in del_za for x in lab])
    drevo = cKDTree(np.stack([-gv[ok, 2], gv[ok, 1], (gv[ok, 0] - x1)], 1))
    mozg = np.isin(skupina, [kljuci.index("skorja"), kljuci.index("bela")])
    _, idx = drevo.query(np.stack([PX[mozg], PY[mozg], np.zeros(mozg.sum())], 1))
    imena = np.array(lab, dtype=object)[ok][idx]
    ucna[mozg] = np.array([deli.get(del_za[x], hexrgb("#cccccc")) for x in imena])
    svetlost = (0.62 + 0.5 * gladko(40.0, 110.0, I))[..., None]
    ucna = ucna * svetlost
    lik = gladko(0.35, 0.65, Pk[kljuci.index("likvor")])[..., None]
    ucna = ucna * (1 - lik) + hexrgb("#1c1a22")[None, None] * lik
    b2 = shrani(ucna, "mozgani-rez-ucne.webp")
    org["prerez"]["slika"] = {"slika": "mozgani-rez.webp", "ucna": "mozgani-rez-ucne.webp", "lo": [round(float(lo[0]), 5), round(float(lo[1]), 5)],
                              "mera": [round(mera, 5), round(mera, 5)]}
    json.dump(org, open(pot_json, "w"), ensure_ascii=False, indent=1)
    print(f"rez iz MRI: ravnini x = {x0 * 1000:.1f} in {x1 * 1000:.1f} mm, {n} px, {mera / n * 1000:.2f} mm/px, lo {lo.round(4)}, mera {mera:.4f}; "
          f"{b1} B in {b2} B; delež sredinske ravnine {iz_sredine.mean():.2f}")


def pial(osnova):
    """Oglišča pialne površine (RAS mm) in imena območij aparc."""
    import struct
    with open(osnova + ".pial", "rb") as f:
        assert f.read(3) == b"\xff\xff\xfe"
        f.readline(); f.readline()
        vn, fn = struct.unpack(">ii", f.read(8))
        v = np.frombuffer(f.read(vn * 12), ">f4").reshape(-1, 3).astype(np.float64)
    import nibabel.freesurfer.io as fsio
    lab, _, imena = fsio.read_annot(osnova + ".aparc.annot")
    imena = [x.decode() if isinstance(x, bytes) else x for x in imena]
    return v, [imena[i] if i >= 0 else "unknown" for i in lab]


if __name__ == "__main__":
    main()

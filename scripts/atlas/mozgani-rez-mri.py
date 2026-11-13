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

SKUPINE = {  # skupina → oznake aseg
    "likvor": [24], "stranski": [4, 5, 43, 44, 31, 63], "tretji": [14], "cetrti": [15],
    "bela": [2, 41, 77], "krizisce": [85], "zuljevo": [250, 251, 252, 253, 254, 255], "skorja": [3, 42], "maliBela": [7, 46],
    "maliSiva": [8, 47], "deblo": [16], "talamus": [10, 49], "hipotalamus": [28, 60],
    "jedra": [11, 12, 13, 17, 18, 26, 50, 51, 52, 53, 54, 58], "neozn": [],  # neozn: tkivo v brain.mgz brez oznake aseg (dno 3. prekata)
}
SREDINSKE = ["stranski", "tretji", "cetrti", "krizisce", "zuljevo", "maliBela", "maliSiva", "deblo", "talamus", "hipotalamus", "jedra", "neozn"]  # iz sredinske ravnine
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


def barve_reza(I, p_temno, mali=None):
    """Realne barve svežega reza iz svetlosti T1 (bela možganovina 110): votline temne, siva rožnato siva, bela kremna.
    n6: ožji prehod siva–bela (oster rob plasti pri 2048 px), temno le v prekatih (p_temno) in v zelo temnem T1."""
    temna, siva, bela = hexrgb("#2a1715"), hexrgb("#c59a90"), hexrgb("#f1e6d6")
    t = gladko(85.0, 100.0, I)
    if mali is not None:  # mali možgani: tanke veje arbor vitae so pri 1 mm delno povprečene s skorjo – nižji prag, večji kontrast
        t = t * (1 - mali) + gladko(68.0, 86.0, I) * mali
    c = siva[None, None] + (bela - siva)[None, None] * t[..., None]
    c = c * (0.88 + 0.12 * gladko(45.0, 75.0, I))[..., None]
    k = np.maximum(0.8 * (1 - gladko(18.0, 46.0, I)), p_temno)
    return c * (1 - k[..., None]) + temna[None, None] * k[..., None], t


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
    # n6: ravnina reza je lahko parasagitalna (≥ 2 mm od sredine: obris risbe se ujema s prerezom mreže skorje); sredinske
    # strukture so vedno iz sredinske ravnine (REZ_SREDINA), vijuge iz ravnine reza. Pri sredinski ravnini reza kot n5:
    # vijuge iz ravnine REZ_PARA (4,5 mm) v ohranjeni polobli.
    if abs(x0) >= 0.002:
        x1, x0 = x0, stran * float(os.environ.get("REZ_SREDINA", 0.0004))
    else:
        x1 = x0 + stran * float(os.environ.get("REZ_PARA", 0.0045))
    # okvir: vsi vokslji možganov v koordinatah ravnine (x = −z glTF, y = y glTF; U = (0, 0, −1), V = (0, 1, 0))
    ijk = np.argwhere(A > 0)
    g = ijk @ G[:3, :3].T + G[:3, 3]
    lo = np.array([(-g[:, 2]).min(), g[:, 1].min()]) - 0.004; hi = np.array([(-g[:, 2]).max(), g[:, 1].max()]) + 0.004
    mera = float((hi - lo).max()); n = int(os.environ.get("REZ_PX", 2048))
    mm = lambda d: max(1, int(round(d / (mera / n * 1000))))  # mm → slikovne pike
    px = lo[0] + (np.arange(n) + 0.5) / n * mera; py = lo[1] + (1 - (np.arange(n) + 0.5) / n) * mera  # vrstica 0 = zgoraj
    PX, PY = np.meshgrid(px, py)

    def vzorci(x, vol, red):
        P = np.stack([np.full(PX.shape, x), PY, -PX], -1)  # glTF
        V = P @ Gi[:3, :3].T + Gi[:3, 3]
        return ndimage.map_coordinates(vol, [V[..., 0], V[..., 1], V[..., 2]], order=red, mode="constant", cval=0.0).astype(np.float32)

    T1g = ndimage.gaussian_filter(T1, 0.45)
    kljuci = list(SKUPINE)
    K = {k: i for i, k in enumerate(kljuci)}
    vol = {k: np.isin(A, v) for k, v in SKUPINE.items() if v}
    # tkivo brez oznake: v brain.mgz svetlo, v aseg 0, največ 6 mm od medmožganov / 3. prekata / križišča (dno 3. prekata,
    # lijak, križišče vidnih živcev); drugje je to ostanek ovojnic
    blizu = ndimage.binary_dilation(vol["hipotalamus"] | vol["tretji"] | vol["krizisce"] | vol["talamus"], structure=np.ones((3, 3, 3), bool), iterations=4)
    vol["neozn"] = ndimage.binary_opening((A == 0) & (T1 > 55) & blizu)  # n7: brez ravnih robov romba in drobirja
    verj = {k: ndimage.gaussian_filter(vol[k].astype(np.float32), 0.7) for k in kljuci}
    sloji = {}
    for ime, x in (("sredina", x0), ("para", x1)):
        P = np.stack([vzorci(x, verj[k], 1) for k in kljuci], 0)
        sloji[ime] = dict(I=vzorci(x, T1g, 3), P=P)
    s, p = sloji["sredina"], sloji["para"]
    tkivo_s = s["P"].sum(0) - s["P"][K["likvor"]]
    iz_sredine = (tkivo_s > 0.5) & np.isin(np.argmax(s["P"], 0), [K[k] for k in SREDINSKE]) & (s["P"].max(0) > 0.3)
    iz_sredine = ndimage.binary_opening(iz_sredine, iterations=mm(0.4))
    w = ndimage.gaussian_filter(iz_sredine.astype(np.float32), mm(0.3))  # mehak prehod med ravninama
    I = s["I"] * w + p["I"] * (1 - w)
    Pk = s["P"] * w[None] + p["P"] * (1 - w[None])
    skupina = np.argmax(Pk, 0)
    # ploskev reza je tkivo in prekati; likvor zunaj možganov (brazde, cisterne za deblom in pod malimi možgani) je
    # prozoren – za njim je prava površina ohranjene poloble (n5: cisterna je bila črna reža do podaljšane hrbtenjače)
    # 4. prekat (n7, ocena n6: »black straight-edged square hole«): aseg ga vodi kot dolgo režo do cisterne. Narišemo šotor:
    # dno ob možganskem deblu (zgornjih CETRTI_DELEZ višine oznake), streha se v loku dvigne do vrha (fastigij) na sredini
    # višine in se spet spusti. Ostanek oznake nad koncem šotora je tkivo malih možganov, pod njim odprtina v cisterno.
    cet = Pk[K["cetrti"]] > 0.5
    sotor = np.zeros_like(cet)
    if cet.any():
        vr = np.flatnonzero(cet.any(1)); r0 = int(vr.min()); r1 = r0 + int(float(os.environ.get("CETRTI_DELEZ", 0.72)) * (vr.max() - vr.min()))
        sir = [int(np.ptp(np.flatnonzero(cet[r])) + 1) if cet[r].any() else 0 for r in range(r0, r1 + 1)]
        wmax = max(max(sir), mm(6.0))
        c_lo, c_hi = np.flatnonzero(cet.any(0))[[0, -1]]
        deblo_levo = Pk[K["deblo"]][r0:r1 + 1, max(0, c_lo - mm(8)):c_lo].mean() > Pk[K["deblo"]][r0:r1 + 1, c_hi:c_hi + mm(8)].mean()
        for r in range(r0, r1 + 1):
            cols = np.flatnonzero(cet[r])
            if not len(cols):
                continue
            u = (r - r0) / max(1, r1 - r0)
            w = max(2, int(wmax * (1 - abs(2 * u - 1) ** 1.6)))
            if deblo_levo:
                sotor[r, cols.min():cols.min() + w] = True
            else:
                sotor[r, max(0, cols.max() - w):cols.max() + 1] = True
        sotor = ndimage.gaussian_filter(sotor.astype(np.float32), mm(0.45)) > 0.5
        ostanek = cet & ~sotor
        zgoraj = ostanek & (np.arange(n)[:, None] <= r1)
        Pk[K["maliSiva"]] = np.where(zgoraj, 1.0, Pk[K["maliSiva"]])
        Pk[K["likvor"]] = np.where(ostanek & ~zgoraj, 1.0, Pk[K["likvor"]])
        Pk[K["cetrti"]] = np.where(ostanek, 0.0, Pk[K["cetrti"]])
        Pk[:, sotor] = 0.0; Pk[K["cetrti"]][sotor] = 1.0
        I = np.where(zgoraj | sotor, 76.0, I)
        skupina = np.argmax(Pk, 0)
    trdno = (Pk.sum(0) - Pk[K["likvor"]]) > 0.5
    trdno = ndimage.binary_opening(trdno, iterations=mm(0.25))
    oznake, st = ndimage.label(trdno)
    if st > 1:  # drobni otoki (ostanki ovojnic) odpadejo
        vel = ndimage.sum(trdno, oznake, range(1, st + 1))
        trdno = np.isin(oznake, 1 + np.flatnonzero(vel > 0.002 * trdno.sum()))
    # cisterne ob sredinskih strukturah (za ploščo štirih gričev, med deblom in malimi možgani, pod hipotalamusom) so
    # zasenčene vdolbine, ne okna (n6: skoznje so se videle rezne ploskve mrež 6 mm globlje – »stopnice«, modra lisa
    # senčnega režnja): zaprtje s polmerom 3,5 mm v pasu 5 mm ob sredinskih strukturah
    r_z = mm(3.5)
    zaprto = ndimage.distance_transform_edt(ndimage.distance_transform_edt(~trdno) <= r_z) > r_z
    cisterne = zaprto & ~trdno & ndimage.binary_dilation(iz_sredine, iterations=mm(5))
    cisterne = ndimage.binary_opening(cisterne, iterations=mm(0.3))
    trdno |= cisterne
    alfa = ndimage.gaussian_filter(trdno.astype(np.float32), 0.8)
    # prekati (n6, ocena n5: »ena sama črna votlina, hidrocefalus«): v sredinski ravnini je stranski prekat za prosojno
    # pregrado (septum pellucidum) – narišemo pregrado in ozko režo pod žuljevim telesom; 3. prekat je reža v sredini,
    # zato je ploskev tam medialna stena talamusa in hipotalamusa (reža pod forniksom); ozki deli (akvedukt) in šotorast
    # 4. prekat ostanejo temni.
    zgornji_pas = lambda m, d: m & ~np.roll(m, mm(d), axis=0)
    stranski = Pk[K["stranski"]] > 0.5
    tretji = Pk[K["tretji"]] > 0.5
    disk = lambda r: (np.hypot(*np.mgrid[-r:r + 1, -r:r + 1]) <= r)
    siroki = ndimage.binary_opening(tretji, structure=disk(mm(1.2)))
    # n7 (ocena n6: »thin black ink lines«): pregrada (septum pellucidum) sivo rožnata, da se pod njo loči beli lok forniksa;
    # široki del 3. prekata je zasenčena vdolbina (stena talamusa v senci) z medtalamično zrastjo (adhesio interthalamica)
    # kot svetlejšim ovalom na sredini; akvedukt in šotor 4. prekata temna
    zrast = np.zeros_like(siroki)
    if siroki.sum() > mm(3.0) ** 2:
        rr, cc = np.nonzero(siroki); r_c, c_c = rr.mean(), cc.mean()
        zrast = siroki & ((((np.arange(n)[:, None] - r_c) / mm(2.6)) ** 2 + ((np.arange(n)[None, :] - c_c) / mm(3.8)) ** 2) <= 1.0)
    temno = (Pk[K["cetrti"]] > 0.5) | (tretji & ~siroki) | zgornji_pas(stranski, 0.7)
    p_temno = np.clip(ndimage.gaussian_filter(temno.astype(np.float32), 1.0) * 1.15, 0, 1)
    p_temno = np.maximum(p_temno, ndimage.gaussian_filter(0.62 * cisterne + 0.5 * (siroki & ~zrast), 1.5))
    I = np.where(cisterne, 70.0, np.where(stranski, 70.0, np.where(siroki, 80.0, I)))
    I = ndimage.gaussian_filter(I, 0.7)
    # mali možgani: skorja nekoliko bolj rožnata, drevo bele možganovine (arbor vitae) iz T1 z večjim kontrastom
    mali = gladko(0.4, 0.6, Pk[K["maliSiva"]] + Pk[K["maliBela"]])
    rgb, t_bela = barve_reza(I, p_temno, mali)
    rgb = rgb * (1 - 0.10 * mali[..., None] * np.array([0.0, 1.0, 1.0]))

    def shrani(barva, ime, q):
        im = np.dstack([np.clip(barva, 0, 1), np.clip(alfa, 0, 1)[..., None]])
        Image.fromarray((im * 255 + 0.5).astype(np.uint8), "RGBA").save(os.path.join(izhod, ime), "WEBP", quality=q, method=6)
        return os.path.getsize(os.path.join(izhod, ime))

    b1 = shrani(rgb, "mozgani-rez.webp", 84)
    # učne barve: del po skupini aseg, možganska skorja in bela sredica po režnju najbližjega oglišča pialne površine;
    # ploske barve z ostrimi mejami (ocena n5: zabrisani, pikčasti odtenki), bela sredica le malo svetlejša
    deli = {d["id"]: hexrgb(d["barva"]) for d in org["deli"] if d.get("barva")}
    za_skupino = {"zuljevo": "zuljevo", "stranski": "zuljevo", "maliBela": "mali", "maliSiva": "mali", "deblo": "deblo", "talamus": "talamus",
                  "hipotalamus": "hipotalamus", "jedra": "talamus", "krizisce": "krizisce", "neozn": "hipotalamus", "tretji": "talamus", "cetrti": "deblo"}
    ucna = np.zeros(rgb.shape)
    for k, d in za_skupino.items():
        ucna[skupina == K[k]] = deli.get(d, hexrgb("#cccccc"))
    tal = skupina == K["talamus"]
    if tal.any():  # medialna stena 3. prekata: nad spodnjim robom talamusa talamus, pod njim hipotalamus
        meja = np.quantile(PY[tal], 0.12)
        ucna[np.isin(skupina, [K["tretji"], K["hipotalamus"], K["neozn"]]) & (PY >= meja)] = deli.get("talamus", hexrgb("#cccccc"))
        ucna[np.isin(skupina, [K["tretji"], K["hipotalamus"], K["neozn"]]) & (PY < meja)] = deli.get("hipotalamus", hexrgb("#cccccc"))
    v, lab = pial(os.path.join(mapa, f"{osebek}-{'lh' if stran > 0 else 'rh'}"))
    gv = v @ M[:, :3].T + M[:, 3]
    del_za = {ime: d for d, sez in APARC_DELI.items() for ime in sez.split()}
    ok = np.array([x in del_za for x in lab])
    drevo = cKDTree(np.stack([-gv[ok, 2], gv[ok, 1], (gv[ok, 0] - x1)], 1))
    mozg = np.isin(skupina, [K["skorja"], K["bela"], K["likvor"]])
    _, idx = drevo.query(np.stack([PX[mozg], PY[mozg], np.zeros(mozg.sum())], 1))
    imena = np.array(lab, dtype=object)[ok][idx]
    ucna[mozg] = np.array([deli.get(del_za[x], hexrgb("#cccccc")) for x in imena])
    ucna = ucna * (0.86 + 0.14 * t_bela)[..., None]
    ucna = ucna * (1 - p_temno[..., None]) + hexrgb("#1c1a22")[None, None] * p_temno[..., None]
    b2 = shrani(ucna, "mozgani-rez-ucne.webp", 88)
    org["prerez"]["slika"] = {"slika": "mozgani-rez.webp", "ucna": "mozgani-rez-ucne.webp", "lo": [round(float(lo[0]), 5), round(float(lo[1]), 5)],
                              "mera": [round(mera, 5), round(mera, 5)], "sum": 0, "gladko": True, "visina": 0.0}
    json.dump(org, open(pot_json, "w"), ensure_ascii=False, indent=1)
    print(f"rez iz MRI: sredinska ravnina x = {x0 * 1000:.1f} mm, ravnina vijug {x1 * 1000:.1f} mm, {n} px, {mera / n * 1000:.2f} mm/px, lo {lo.round(4)}, mera {mera:.4f}; "
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

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
    lo = np.array([(-g[:, 2]).min(), g[:, 1].min()]) - 0.004
    hrb = org["prerez"].get("hrbtenjaca")  # r1: začetek hrbtenjače (mozgani-hrbtenjaca.mjs) – okvir sega do njenega konca
    if hrb:
        lo[1] = min(lo[1], min(q[1] for q in hrb["os"]) - max(hrb["b"]) - 0.003)
    hi = np.array([(-g[:, 2]).max(), g[:, 1].max()]) + 0.004
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
    if hrb:  # sredinski prerez hrbtenjače: pas ± b okoli osi (v ravnini x = −z, y), siv kot podaljšana hrbtenjača
        os_ = np.array([[-q[2], q[1]] for q in hrb["os"]]); bb = np.array(hrb["b"])
        dl = np.concatenate([[0], np.cumsum(np.linalg.norm(np.diff(os_, axis=0), axis=1))])
        tt = np.linspace(0, dl[-1], 600); ox = np.interp(tt, dl, os_[:, 0]); oy = np.interp(tt, dl, os_[:, 1]); ob = np.interp(tt, dl, bb)
        from scipy.spatial import cKDTree as _T
        dd, ii = _T(np.stack([ox, oy], 1)).query(np.stack([PX.ravel(), PY.ravel()], 1))
        dd = dd.reshape(PX.shape); ii = ii.reshape(PX.shape)
        hrbt = (dd < ob[ii]) & (ii > 0) & (ii < len(tt) - 1)
        kanal = (dd < 0.00018) & hrbt & (ii > 60)
        s["P"][K["deblo"]] = np.where(hrbt, np.maximum(s["P"][K["deblo"]], 1.0), s["P"][K["deblo"]])
        s["P"][K["likvor"]] = np.where(hrbt, 0.0, s["P"][K["likvor"]])
        s["I"] = np.where(hrbt & (s["I"] < 100), 100.0 - 18.0 * np.exp(-(dd / 0.0012) ** 2), s["I"])
    else:
        kanal = np.zeros(PX.shape, bool)
    tkivo_s = s["P"].sum(0) - s["P"][K["likvor"]]
    iz_sredine = (tkivo_s > 0.5) & np.isin(np.argmax(s["P"], 0), [K[k] for k in SREDINSKE]) & (s["P"].max(0) > 0.3)
    iz_sredine = ndimage.binary_opening(iz_sredine, iterations=mm(0.4))
    # r1 (ocena 20. nov: »stair-stepped pale patches«, »uniform pale column«): pod medmožgani in pred malimi možgani velja le
    # sredinska ravnina. Parasagitalna rezina tam seka možganske krake, ventralni diencefalon in vidni trakt 6 mm ob strani
    # (ploske lise pred deblom, ki skrijejo trebuh mostu); deblo (tkivo brez pokrova v prerezu) za risbo ni rezano.
    gp = np.argmax(p["P"], 0)
    jedro = (s["P"][K["deblo"]] + s["P"][K["hipotalamus"]] + s["P"][K["krizisce"]] + s["P"][K["tretji"]] + s["P"][K["neozn"]]) > 0.5
    globoko = ndimage.binary_dilation(jedro, iterations=mm(14)) & np.isin(gp, [K[k] for k in ("deblo", "hipotalamus", "jedra", "neozn", "krizisce", "likvor", "tretji", "cetrti")])
    globoko = ndimage.binary_closing(globoko, iterations=mm(1.0)) & ~np.isin(gp, [K[k] for k in ("skorja", "bela", "maliSiva", "maliBela", "talamus")])
    if os.environ.get("REZ_PARA_POVSOD"):
        globoko[:] = False
    w = ndimage.gaussian_filter((iz_sredine | globoko).astype(np.float32), mm(0.3))  # mehak prehod med ravninama
    I = s["I"] * w + p["I"] * (1 - w)
    Pk = s["P"] * w[None] + p["P"] * (1 - w[None])
    skupina = np.argmax(Pk, 0)
    # ---------- n8 (ocena n7: »black straight-edged triangle«, »flat dark-brown polygon patches«, »uniform pale column«):
    # sredinske strukture so risba po anatomiji. Oblike so iz T1 sredinske ravnine in zglajenih mask aseg (brez stopnic
    # 1-mm vokslov): 4. prekat je prava temna vrzel med deblom in malimi možgani (šotor z vrhom v malih možganih, navzdol se
    # zoži v obeks), akvedukt je kanal od 3. prekata do vrha šotora, za njim plošča štirih gričev; most ima bazalni del s
    # prečnimi vlakni in tegmentum, podaljšana hrbtenjača piramido; medialna stena 3. prekata je talamus z medtalamično
    # zrastjo, pod hipotalamično brazdo hipotalamus; pregrada (septum pellucidum) je svetla opna med žuljevim telesom in
    # forniksom. Cisterne ob sredinskih strukturah so mehko senčene vdolbine.
    gl = lambda m, d: ndimage.gaussian_filter(np.asarray(m, np.float32), mm(d))
    zapri = lambda m, r: ndimage.distance_transform_edt(ndimage.distance_transform_edt(~m) <= mm(r)) > mm(r)
    Ps, Im = s["P"], s["I"]
    vrstice = np.arange(n)[:, None] * np.ones((1, n)); stolpci = np.ones((n, 1)) * np.arange(n)[None, :]
    B = gl(Ps[K["deblo"]], 0.6) > 0.5
    Cb = gl(Ps[K["maliSiva"]] + Ps[K["maliBela"]], 0.6) > 0.5
    T3 = gl(Ps[K["tretji"]], 0.5) > 0.5
    V4 = np.zeros((n, n), bool); AQ = np.zeros((n, n), bool); tektum = np.zeros((n, n), bool)
    q_ap = np.zeros((n, n), np.float32); w_most = np.zeros(n, np.float32); w_sred = np.zeros(n, np.float32); w_podalj = np.zeros(n, np.float32)
    spredaj = -1.0
    if B.any() and Cb.any():
        spredaj = -1.0 if stolpci[B].mean() < stolpci[Cb].mean() else 1.0
        rb = np.flatnonzero(B.any(1)); r_lo, r_hi = int(rb.min()), int(rb.max())
        a_rob = np.zeros(n); p_rob = np.zeros(n)
        for r in range(r_lo, r_hi + 1):
            c = np.flatnonzero(B[r])
            a_rob[r], p_rob[r] = (c.min(), c.max()) if spredaj < 0 else (c.max(), c.min())
        a_g = ndimage.gaussian_filter1d(a_rob[r_lo:r_hi + 1], mm(1.2)); p_g = ndimage.gaussian_filter1d(p_rob[r_lo:r_hi + 1], mm(1.2))
        od = r_lo + int(0.18 * (r_hi - r_lo)); do = r_lo + int(0.75 * (r_hi - r_lo))
        r_most = od + int(np.argmax(spredaj * a_g[od - r_lo:do - r_lo]))  # najbolj sprednja točka trebuha mostu
        print(f"deblo: vrstice {r_lo}..{r_hi}, trebuh mostu {r_most}, spredaj {spredaj}, mm {mm(1.0)} px")
        okno = lambda a, b_: (max(r_lo, r_most + int(np.sign(a)) * mm(abs(a))), min(r_hi, r_most + int(np.sign(b_)) * mm(abs(b_))))
        o1 = okno(-18, -9); most_zg = o1[0] + int(np.argmin(spredaj * a_g[o1[0] - r_lo:o1[1] - r_lo]))
        o2 = okno(9, 18); most_sp = o2[0] + int(np.argmin(spredaj * a_g[o2[0] - r_lo:o2[1] - r_lo]))
        obeks = min(r_hi, most_sp + mm(float(os.environ.get('REZ_OBEKS', 8))))
        # 4. prekat: temna vrzel med deblom in malimi možgani
        vrzel = zapri(B | Cb, 7.0) & ~(B | Cb) & (Im < 72)
        # spodnji rob plošče štirih gričev: zadnji rob debla tam skoči naprej (pod ploščo se začne 4. prekat); reža med
        # ploščo in malimi možgani nad tem ni prekat
        dz = mm(1.5); zg = np.arange(r_lo + dz, max(r_lo + dz + 1, r_most - r_lo and r_most))
        skok = spredaj * (p_g[zg + dz - r_lo] - p_g[zg - dz - r_lo])
        r_tek = int(zg[int(np.argmax(skok))]) + dz if len(zg) else most_zg
        vrzel &= (vrstice >= r_tek - mm(0.5)) & (vrstice <= obeks)
        ozn, st_ = ndimage.label(vrzel)
        if st_:
            cet0 = Ps[K["cetrti"]] > 0.3
            vel = ndimage.sum(vrzel & cet0, ozn, range(1, st_ + 1)) + 1e-3 * ndimage.sum(vrzel, ozn, range(1, st_ + 1))
            V4 = ozn == 1 + int(np.argmax(vel))
            # šotor: najširši je pri vrhu (fastigij), od tam se proti akveduktu in proti obeksu enakomerno oži (od dna ob deblu)
            sirina = V4.sum(1); vr4 = np.flatnonzero(sirina)
            r_f = int(np.argmax(ndimage.gaussian_filter1d(sirina.astype(float), mm(1.0)))); w_f = float(sirina[r_f])
            for r in vr4:
                c = np.flatnonzero(V4[r])
                d_ = (r_f - r) / max(1, r_f - vr4.min()) if r < r_f else (r - r_f) / max(1, obeks - r_f)
                w = max(mm(0.9) if r < r_f else 1, int(w_f * (1 - min(1.0, d_)) ** 0.85))
                if len(c) > w:
                    if spredaj < 0:
                        V4[r, c.min() + w:] = False
                    else:
                        V4[r, :c.max() - w + 1] = False
            V4 = gl(V4, 0.4) > 0.5
        # akvedukt: od vrha šotora do zadnjega spodnjega konca 3. prekata
        if V4.any() and T3.any():
            r4 = int(np.flatnonzero(V4.any(1)).min()); c4 = np.flatnonzero(V4[r4])
            p4 = np.array([r4 + mm(0.8), (c4.min() if spredaj < 0 else c4.max()) - spredaj * mm(0.6)])  # ob dnu (deblu)
            t3 = np.argwhere(T3); p3 = t3[np.argmax(-spredaj * t3[:, 1] + 0.8 * t3[:, 0])].astype(float)  # zadaj spodaj
            sred = 0.5 * (p3 + p4) + np.array([-mm(0.5), -spredaj * mm(0.5)])
            tt = np.linspace(0, 1, 300)[:, None]
            kriv = (1 - tt) ** 2 * p3 + 2 * (1 - tt) * tt * sred + tt ** 2 * p4
            crta = np.zeros((n, n), bool); crta[np.clip(kriv[:, 0].astype(int), 0, n - 1), np.clip(kriv[:, 1].astype(int), 0, n - 1)] = True
            AQ = ndimage.distance_transform_edt(~crta) <= mm(0.55)
            c_aq = np.interp(np.arange(n), kriv[:, 0] if kriv[0, 0] < kriv[-1, 0] else kriv[::-1, 0], kriv[:, 1] if kriv[0, 0] < kriv[-1, 0] else kriv[::-1, 1])
            v_od, v_do = int(min(p3[0], p4[0])) - mm(3), int(max(p3[0], p4[0])) + mm(1)
            tektum = B & (spredaj * (stolpci - c_aq[:, None]) < -mm(0.5)) & (vrstice >= v_od) & (vrstice <= v_do)
        # lega v deblu: q 0 zadaj → 1 spredaj; uteži odsekov po višini
        sir = np.where(np.abs(a_rob - p_rob) > 1, a_rob - p_rob, 1.0)
        q_ap = np.clip((stolpci - p_rob[:, None]) / sir[:, None], 0, 1).astype(np.float32)
        rr = np.arange(n)
        w_most = (gladko(most_zg - mm(1.5), most_zg + mm(1.5), rr) * (1 - gladko(most_sp - mm(1.5), most_sp + mm(1.5), rr))).astype(np.float32)
        w_sred = (1 - gladko(most_zg - mm(1.5), most_zg + mm(1.5), rr)).astype(np.float32)
        w_podalj = gladko(most_sp - mm(1.5), most_sp + mm(1.5), rr).astype(np.float32)
    if os.environ.get("REZ_RAZHROSCI"):  # razvoj: T1 sredinske ravnine z obrisi mask
        dbg = np.repeat(np.clip(Im / 130.0, 0, 1)[..., None], 3, 2)
        for m_, br in ((B, (1, 0.3, 0.3)), (Cb, (0.3, 1, 0.3)), (T3, (0.3, 0.6, 1)), (V4, (1, 1, 0)), (AQ, (1, 0, 1)), (tektum, (0, 1, 1))):
            dbg[m_ & ~ndimage.binary_erosion(m_, iterations=2)] = br
        Image.fromarray((dbg * 255).astype(np.uint8)).save(os.environ["REZ_RAZHROSCI"])
    # oznake: šotor je 4. prekat, ostanek oznake je likvor (cisterna) ali tkivo malih možganov nad šotorom
    cet = Pk[K["cetrti"]] > 0.5
    Pk[K["likvor"]] = np.where(cet & ~V4, 1.0, Pk[K["likvor"]]); Pk[K["cetrti"]] = np.where(cet & ~V4, 0.0, Pk[K["cetrti"]])
    Pk[:, V4 | AQ] = 0.0; Pk[K["cetrti"]][V4 | AQ] = 1.0
    skupina = np.argmax(Pk, 0)
    trdno = (Pk.sum(0) - Pk[K["likvor"]]) > 0.5
    trdno = ndimage.binary_opening(trdno, iterations=mm(0.25))
    oznake, st = ndimage.label(trdno)
    if st > 1:  # drobni otoki (ostanki ovojnic) odpadejo
        vel = ndimage.sum(trdno, oznake, range(1, st + 1))
        trdno = np.isin(oznake, 1 + np.flatnonzero(vel > 0.002 * trdno.sum()))
    # cisterne ob sredinskih strukturah (za ploščo štirih gričev, med deblom in malimi možgani, pod hipotalamusom): mehko
    # senčene vdolbine z zaobljenim robom (skozi okna bi se videle rezne ploskve mrež 6 mm globlje)
    r_z = mm(float(os.environ.get('REZ_CISTERNE', 5.0)))  # r1: 5 mm (cisterna nad malimi možgani ni bila zaprta – črna luknja)
    zaprto = ndimage.distance_transform_edt(ndimage.distance_transform_edt(~trdno) <= r_z) > r_z
    cisterne = zaprto & ~trdno & ndimage.binary_dilation(jedro | ((s["P"][K["maliSiva"]] + s["P"][K["maliBela"]]) > 0.5), iterations=mm(8))
    _o, _st = ndimage.label(cisterne)  # r1: drobne zaprte reže (brazde ob žuljevem telesu) niso cisterne – modre pike
    if _st:
        cisterne = np.isin(_o, 1 + np.flatnonzero(ndimage.sum(cisterne, _o, range(1, _st + 1)) > mm(1.8) ** 2))
    cisterne = gl(ndimage.binary_opening(cisterne, iterations=mm(0.3)), 0.5) > 0.5
    cisterne &= ~trdno
    # r1 (ocena 20. nov: »black triangular straight-edged hole«): reža med deblom in malimi možgani od vrha 4. prekata do
    # spodnjega roba malih možganov (4. prekat, pod obeksom velika cisterna) je likvor, sivo modra kot prekati, ne okno
    if B.any() and Cb.any():
        reza = zapri(B | Cb, 9.0) & ~(B | Cb) & ~trdno
        vrh = int(np.flatnonzero(V4.any(1)).min()) if V4.any() else int(np.flatnonzero(B.any(1)).min())
        reza &= (vrstice >= vrh) & (vrstice <= int(np.flatnonzero(Cb.any(1)).max()))
        reza &= spredaj * (stolpci - np.where(B.any(1), np.array([np.flatnonzero(B[r]).mean() if B[r].any() else 0 for r in range(n)]), 0)[:, None]) > 0
        reza = gl(ndimage.binary_opening(reza, iterations=mm(0.3)), 0.4) > 0.5
        cisterne |= reza & ~trdno
    # r1: zaprte luknje (ne segajo do zunanjega praznega prostora) ob deblu in medmožganih so cisterne (prej črne luknje
    # nad malimi možgani in pred lamino terminalis: za njimi je v prerezu skrit limbični reženj in se vidi ozadje)
    _o, _st = ndimage.label(~(trdno | cisterne))
    if _st:
        zunaj = set(np.unique(np.concatenate([_o[0], _o[-1], _o[:, 0], _o[:, -1]]))) - {0}
        vel = ndimage.sum(np.ones_like(trdno), _o, range(1, _st + 1))
        zunaj |= {1 + int(np.argmax(vel))}
        blizu_j = ndimage.binary_dilation(jedro, iterations=mm(12))
        for i in range(1, _st + 1):
            if i in zunaj:
                continue
            kos = _o == i
            if (kos & blizu_j).any():
                cisterne |= kos
    trdno |= cisterne
    alfa = ndimage.gaussian_filter(trdno.astype(np.float32), 0.8)
    stranski = gl(Pk[K["stranski"]], 0.5) > 0.5
    tretji = Pk[K["tretji"]] > 0.5
    disk = lambda r: (np.hypot(*np.mgrid[-r:r + 1, -r:r + 1]) <= r)
    siroki = gl(ndimage.binary_opening(tretji, structure=disk(mm(1.2))), 0.6) > 0.5
    # medmožgani na sredinski ploskvi: talamus + široki 3. prekat + hipotalamus (zglajena unija)
    Dm = gl((Ps[K["talamus"]] + Ps[K["jedra"]] + Ps[K["hipotalamus"]] + Ps[K["neozn"]]) > 0.5, 0.8) > 0.5
    D = gl(zapri((Dm | siroki) & iz_sredine | siroki, 1.0), 0.9) > 0.5
    # r1 (ocena 20. nov: »flat straight-edged polygons«): dno 3. prekata ni ravna črta – spredaj spodaj križišče vidnih
    # živcev (ovalna prečno prerezana vlakna), zadaj spodaj mamilarno telo (okrogla izboklina pred deblom); obris D zglajen
    krz = np.zeros((n, n), bool); mam = np.zeros((n, n), bool); ozki_dodatni = np.zeros((n, n), bool)
    if D.sum() > mm(4.0) ** 2:
        dd = np.argwhere(D)
        ai = dd[np.argmax(spredaj * dd[:, 1] + dd[:, 0])].astype(float); pi_ = dd[np.argmax(-spredaj * dd[:, 1] + 1.6 * dd[:, 0])].astype(float)
        elipsa = lambda c, a, b: (((vrstice - c[0]) / mm(b)) ** 2 + ((stolpci - c[1]) / mm(a)) ** 2) <= 1.0
        # dno: spodnji rob D v stolpcih med sprednjim in zadnjim koncem; križišče na 8 %, lijak (recessus infundibuli z
        # lijakom hipofize) na 30 %, mamilarno telo na 78 % dolžine dna
        stD = np.flatnonzero(D.any(0)); spod = np.array([np.flatnonzero(D[:, c]).max() if D[:, c].any() else 0 for c in range(n)])
        c_a, c_p = (stD.min(), stD.max()) if spredaj < 0 else (stD.max(), stD.min())
        tocka = lambda f: np.array([float(spod[int(c_a + f * (c_p - c_a))]), float(int(c_a + f * (c_p - c_a)))])
        print(f"dno 3. prekata: stolpci {c_a}..{c_p}")
        krz = elipsa(tocka(0.1) + np.array([mm(0.4), 0.0]), 3.0, 1.8)
        mam = elipsa(tocka(0.8) + np.array([mm(0.9), 0.0]), 2.0, 1.9) & ~B
        t_l = tocka(0.32)
        lijak = (vrstice > t_l[0] - mm(1.0)) & (vrstice < t_l[0] + mm(5.0)) & (np.abs(stolpci - t_l[1] + spredaj * 0.35 * (vrstice - t_l[0])) < mm(1.5) * np.clip(1 - (vrstice - t_l[0]) / mm(9.0), 0.45, 1))
        recesus = (vrstice > t_l[0] - mm(1.6)) & (vrstice < t_l[0] + mm(1.8)) & (np.abs(stolpci - t_l[1] + spredaj * 0.35 * (vrstice - t_l[0])) < mm(0.7) * np.clip(1 - (vrstice - t_l[0]) / mm(2.0), 0, 1))
        D = gl(D | krz | mam | lijak, 1.0) > 0.5
        ozki_dodatni = recesus & D
    brazda = np.zeros((n, n), bool); pod_brazdo = np.zeros((n, n), bool); zrast = np.zeros((n, n), np.float32)
    if D.sum() > mm(4.0) ** 2 and tretji.any():
        t3 = np.argwhere(gl(tretji, 0.5) > 0.5)
        fm = t3[np.argmax(spredaj * t3[:, 1] - 1.0 * t3[:, 0])].astype(float)  # medprekatna odprtina: spredaj zgoraj
        zk = t3[np.argmax(-spredaj * t3[:, 1] + 0.6 * t3[:, 0])].astype(float)  # vhod v akvedukt: zadaj spodaj
        sred = 0.5 * (fm + zk) + np.array([mm(4.5), 0.0])
        tt = np.linspace(-0.25, 1.25, 400)[:, None]
        kriv = (1 - tt) ** 2 * fm + 2 * (1 - tt) * tt * sred + tt ** 2 * zk
        crta = np.zeros((n, n), bool); crta[np.clip(kriv[:, 0].astype(int), 0, n - 1), np.clip(kriv[:, 1].astype(int), 0, n - 1)] = True
        brazda = (ndimage.distance_transform_edt(~crta) <= mm(0.2)) & D
        ur = np.argsort(kriv[:, 1]); r_br = np.interp(np.arange(n), kriv[ur, 1], kriv[ur, 0])
        pod_brazdo = D & (vrstice > r_br[None, :])
        nad = D & ~pod_brazdo
        if nad.sum() > mm(3.0) ** 2:
            rr_, cc_ = np.nonzero(nad); r_c, c_c = np.median(rr_), np.median(cc_)
            e = np.sqrt(((vrstice - r_c) / mm(2.0)) ** 2 + ((stolpci - c_c) / mm(3.0)) ** 2)
            zrast = ((1 - gladko(0.9, 1.08, e)) * nad).astype(np.float32)
    # temno: šotor 4. prekata in akvedukt (globoka votlina, proti robu svetlejša stena), ozki deli 3. prekata
    glob4 = np.clip(ndimage.distance_transform_edt(V4) / mm(2.2), 0, 1)
    p_temno = np.clip(gl((V4 | AQ), 0.12) * (0.55 + 0.4 * glob4), 0, 1)
    ozki = tretji & ~siroki & ~D
    p_temno = np.maximum(p_temno, 0.6 * gl(ozki, 0.15))
    glob_c = np.clip(ndimage.distance_transform_edt(cisterne) / mm(2.5), 0, 1)
    p_temno = np.maximum(p_temno, gl(cisterne, 0.2) * (0.42 + 0.3 * glob_c))
    I = np.where(cisterne, 72.0, np.where(V4 | AQ, 60.0, I))
    I = ndimage.gaussian_filter(I, 0.7)
    # mali možgani: skorja nekoliko bolj rožnata, drevo bele možganovine (arbor vitae) iz T1 z večjim kontrastom
    mali = gladko(0.4, 0.6, Pk[K["maliSiva"]] + Pk[K["maliBela"]])
    rgb, t_bela = barve_reza(I, np.zeros_like(p_temno), mali)
    rgb = rgb * (1 - 0.10 * mali[..., None] * np.array([0.0, 1.0, 1.0]))
    mesaj = lambda c, barva, w: c * (1 - w[..., None]) + hexrgb(barva)[None, None] * w[..., None]
    rs = np.random.RandomState(7)
    sum_ = ndimage.gaussian_filter(rs.rand(n, n).astype(np.float32), mm(0.35)); sum_ = (sum_ - sum_.mean()) / (sum_.std() + 1e-9)
    # možgansko deblo
    Bm = gl(B, 0.2) * (1 - gl(V4 | AQ, 0.15))
    if B.any():
        baz = gladko(0.40, 0.52, q_ap)  # bazalni (sprednji) del
        vl = gladko(0.35, 0.65, 0.5 + 0.5 * np.sin(2 * np.pi * (vrstice / mm(1.5)) + 0.5 * sum_ + 0.002 * stolpci))
        # most: bazalni del svetel s prečnimi vlakni in sivimi jedri, tegmentum sivo rožnat
        c_most = mesaj(np.broadcast_to(hexrgb("#f3e9da"), rgb.shape).copy(), "#d9bcae", (0.14 * vl * baz + (1 - baz) * 0.8).astype(np.float32))
        # srednji možgani: kraka spredaj svetla, tegmentum siv, tektum (griča) sivo rožnat
        kr = gladko(0.62, 0.78, q_ap)
        c_sred = mesaj(np.broadcast_to(hexrgb("#d6b8ab"), rgb.shape).copy(), "#f0e4d4", kr.astype(np.float32))
        c_sred = mesaj(c_sred, "#cfa99d", gl(tektum, 0.25))
        if tektum.any():  # brazda med zgornjim in spodnjim gričem
            tk = np.argwhere(tektum); os_t = np.linalg.svd(tk - tk.mean(0), full_matrices=False)[2][0]
            u_t = ((np.stack([vrstice, stolpci], -1) - tk.mean(0)) @ os_t) / mm(1.0)
            c_sred = c_sred * (1 - 0.16 * (np.exp(-(u_t / 0.45) ** 2) * gl(tektum, 0.2))[..., None])
        # podaljšana hrbtenjača: piramida spredaj svetla, zadaj sivo rožnata
        c_pod = mesaj(np.broadcast_to(hexrgb("#e2cbbd"), rgb.shape).copy(), "#f2e7d8", gladko(0.5, 0.7, q_ap).astype(np.float32))
        c_deb = c_most * w_most[:, None, None] + c_sred * w_sred[:, None, None] + c_pod * w_podalj[:, None, None]
        c_deb = c_deb * (1 + 0.008 * sum_[..., None])
        c_deb = 0.72 * c_deb + 0.28 * rgb  # nekaj prave slike T1 (jedra, prehodi)
        rgb = rgb * (1 - Bm[..., None]) + c_deb * Bm[..., None]
        rob_b = gl(B & ~ndimage.binary_erosion(B, iterations=mm(0.35)), 0.15)
        rgb = rgb * (1 - 0.10 * rob_b[..., None])
    # pregrada
    Zu = gl(Ps[K["zuljevo"]], 0.4) > 0.5
    pod_zuljevim = zapri(Zu | D, 6.0) & ~Zu & ~D & (t_bela < 0.5) & (ndimage.distance_transform_edt(~Zu) < mm(14))
    pregrada = gl((stranski & iz_sredine) | pod_zuljevim, 0.5) > 0.5
    Sp = gl(pregrada, 0.25)
    c_sp = np.broadcast_to(hexrgb("#dcc7bb"), rgb.shape) * (0.97 + 0.03 * np.sin(stolpci / mm(0.7) + 2 * sum_))[..., None]
    rgb = rgb * (1 - Sp[..., None]) + c_sp * Sp[..., None]
    rgb = rgb * (1 - 0.16 * gl(stranski & ~np.roll(stranski, mm(0.6), axis=0), 0.25)[..., None])  # senca pod žuljevim telesom
    # medmožgani
    Dw = gl(D, 0.25)
    c_d = mesaj(np.broadcast_to(hexrgb("#d3b1a5"), rgb.shape).copy(), "#c39a8f", gl(pod_brazdo, 0.4))
    c_d = c_d * (1 + 0.008 * sum_[..., None])
    c_d = mesaj(c_d, "#e6d0c2", 0.9 * zrast)
    c_d = mesaj(c_d, "#efe2cc", 0.95 * gl(krz, 0.25))  # križišče: bela vlakna
    c_d = mesaj(c_d, "#d8b8aa", 0.85 * gl(mam, 0.25))  # mamilarno telo
    c_d = c_d * (1 - 0.14 * gl((krz | mam) & ~ndimage.binary_erosion(krz | mam, iterations=mm(0.3)), 0.12)[..., None])
    obr = gl((zrast > 0.5) & ~ndimage.binary_erosion(zrast > 0.5, iterations=mm(0.25)), 0.12)
    c_d = c_d * (1 - 0.16 * obr[..., None])
    c_d = c_d * (1 - 0.14 * gl(brazda, 0.45)[..., None] / max(1e-6, float(gl(brazda, 0.45).max())))
    rob_d = 1 - np.clip(ndimage.distance_transform_edt(D) / mm(1.6), 0, 1)
    c_d = c_d * (1 - 0.16 * (rob_d * (D > 0))[..., None])
    rgb = rgb * (1 - Dw[..., None]) + c_d * Dw[..., None]
    # r1: prekati (šotor 4. prekata, akvedukt, ozki deli 3. prekata) in zaprte cisterne so likvor: sivo modri, globlje
    # nekoliko temnejši, s tanko temnejšo steno (ependim) – nikoli črni (ocena 20. nov)
    votline = gl(V4 | AQ | ozki | ozki_dodatni | kanal, 0.08) > 0.5
    lik = votline | cisterne
    glob_l = np.clip(ndimage.distance_transform_edt(lik) / mm(2.5), 0, 1)[..., None]
    c_lik = hexrgb("#aab3bf")[None, None] * (1 - 0.7 * glob_l) + hexrgb("#7d899a")[None, None] * (0.7 * glob_l)
    c_lik = c_lik * np.where(votline, 0.93, 1.0)[..., None]
    rob_l = gl(lik & ~ndimage.binary_erosion(lik, iterations=mm(0.25)), 0.1)
    c_lik = c_lik * (1 - 0.18 * rob_l[..., None]) * (1 + 0.01 * sum_[..., None])
    w_lik = gl(lik, 0.1)
    rgb = rgb * (1 - w_lik[..., None]) + c_lik * w_lik[..., None]
    # rob reza (pia): tanek temnejši pas; drobno zrno tkiva
    rob_p = gl(trdno & ~ndimage.binary_erosion(trdno, iterations=mm(0.3)), 0.12)
    rgb = rgb * (1 - 0.12 * rob_p[..., None]) * (1 + 0.012 * sum_[..., None])

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
    ucna = ucna * (1 - w_lik[..., None]) + hexrgb("#9db7d4")[None, None] * w_lik[..., None]
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

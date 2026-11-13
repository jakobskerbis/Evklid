#!/usr/bin/env python3
"""Naslikana sredinska rezna ploskev malih možganov in možganskega debla iz presekov struktur HRA brain v1.4 (Allen,
CC BY 4.0). Vhod: <surova mapa>/mozgani.vozlisca.json (»rezZanke«: preseki struktur s sredinsko ravnino v koordinatah
ravnine reza, izvozi-organe.py / mozgani_hra.py). Izhod: WebP (RGBA) za tkiva.mali.rezSlika in tkiva.deblo.rezSlika.

  python3 scripts/atlas/mozgani-rez-hra.py <mozgani.vozlisca.json> <izhod.webp> [mozgani.json za vpis lo/mera]

Mali možgani: bela možganovina HRA (deblo arbor vitae z glavnimi vejami) ostane; v skorjo črva se narišejo lističi:
razpoke od površine navznoter (vsaka četrta globoka, vmes plitve), med razpokama bela lamela od sredice proti površini,
ob beli zrnata plast, zunaj molekularna, pia ob robu. Razpoke so v sliki prosojne (izrez). Deblo: bazilarni del mosta
(prečni snopi in siva pontina jedra), tegmentum mosta, srednji možgani s tektumom, piramida in tegmentum podaljšane
hrbtenjače; akvedukt, četrti prekat in osrednji kanal so prave votline v mreži.
"""
import json, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage
from skimage import measure

PX = 1536
vhod, izhod = sys.argv[1], sys.argv[2]
d = json.load(open(vhod))
Z = d.get("rezZanke", d)
vse = np.array([p for zz in Z.values() for z in zz for p in z])
lo = vse.min(0) - 0.003
mera = float((vse.max(0) - vse.min(0)).max() + 0.006)
k = PX / mera  # px na meter
mm = k / 1000.0
rng = np.random.default_rng(7)


def maska(imena):
    im = Image.new("L", (PX, PX), 0)
    for ime in imena:
        for z in Z.get(ime, []):
            m1 = Image.new("L", (PX, PX), 0)
            ImageDraw.Draw(m1).polygon([((p[0] - lo[0]) * k, PX - (p[1] - lo[1]) * k) for p in z], fill=255)
            im = Image.fromarray(np.maximum(np.array(im), np.array(m1)))
    return np.array(im) > 127


def megla(a, r_mm):
    return ndimage.gaussian_filter(a.astype(np.float32), r_mm * mm)


def sum2(merilo_mm, oktave=3):
    """Gladek šum 0–1 z dano velikostjo zrna."""
    s = np.zeros((PX, PX), np.float32); a = 1.0; t = 0.0
    for o in range(oktave):
        n = max(2, int(PX / (merilo_mm * mm) * (2 ** o)))
        g = rng.random((n + 1, n + 1)).astype(np.float32)
        s += a * np.array(Image.fromarray(g).resize((PX, PX), Image.BICUBIC)); t += a; a *= 0.5
    return np.clip(s / t, 0, 1)


def barva(*c):
    return np.array(c, np.float32) / 255.0


# ------------------------------------------------------------------ mali možgani
BELA = maska(["white_matter_of_hindbrain"])
CRV = maska(["cerebellar_vermis", "paravermis_of_cerebellum"]) | BELA
CRV = ndimage.binary_closing(CRV, iterations=int(0.35 * mm)) | CRV
CRV = ndimage.binary_fill_holes(CRV)
BELA = BELA & CRV
SKORJA = CRV & ~BELA
d_zun = ndimage.distance_transform_edt(CRV) / mm           # mm od zunanjega roba
d_bela = ndimage.distance_transform_edt(~BELA) / mm         # mm od bele možganovine
from scipy.spatial import cKDTree
# Lamele: kolonizacija prostora v skorji črva (2D). Korenine na robu bele možganovine HRA, privlaki v skorji vsaj
# 0,75 mm pod površino; vsaka končna vejica je bela lamela enega lista (folium).
KORAK, VPLIV, UBIJ, RAZMIK = 0.30 * mm, 6.0 * mm, 1.0 * mm, 1.5 * mm
rob_b = np.argwhere(BELA & ~ndimage.binary_erosion(BELA))
rob_b = rob_b[rng.permutation(len(rob_b))]
kor = []
for q in rob_b:  # redčenje korenin na ~0,8 mm
    if all((q[0] - r[0]) ** 2 + (q[1] - r[1]) ** 2 > (0.8 * mm) ** 2 for r in kor[-400:]):
        kor.append(q)
# kos skorje brez stika z belo možganovino (tonzila ob črvu): korenina v točki, ki je beli najbližja
ozn, n_k = ndimage.label(SKORJA)
for c_ in range(1, n_k + 1):
    kos_ = ozn == c_
    if kos_.sum() > (2 * mm) ** 2 and not (ndimage.binary_dilation(kos_, iterations=3) & BELA).any():
        kandidati = np.argwhere(kos_ & (d_zun > 1.2))
        if len(kandidati):
            kor.append(kandidati[np.argmin(d_bela[kandidati[:, 0], kandidati[:, 1]])])
P = [np.array(q, float) for q in kor]; ST = [-1] * len(P)
gi, gj = np.meshgrid(np.arange(0, PX, RAZMIK), np.arange(0, PX, RAZMIK), indexing="ij")
priv = np.stack([gi.ravel(), gj.ravel()], 1) + rng.uniform(-0.4, 0.4, (gi.size, 2)) * RAZMIK
pi_ = np.clip(priv.round().astype(int), 0, PX - 1)
priv = priv[SKORJA[pi_[:, 0], pi_[:, 1]] & (d_zun[pi_[:, 0], pi_[:, 1]] > 0.75)]
dovoljeno = SKORJA & (d_zun > 0.6)
for _ in range(400):
    if not len(priv):
        break
    Pa = np.array(P); kd = cKDTree(Pa)
    dd, nn = kd.query(priv)
    ok = dd < VPLIV
    if not ok.any():
        break
    smer = {}
    for a_, i_ in zip(priv[ok], nn[ok]):
        v = a_ - Pa[i_]; smer[i_] = smer.get(i_, 0) + v / (np.linalg.norm(v) + 1e-9)
    novo = 0
    for i_, v in smer.items():
        if ST[i_] >= 0:
            t = Pa[i_] - Pa[ST[i_]]; v = v + 0.5 * t / (np.linalg.norm(t) + 1e-9)
        n_ = np.linalg.norm(v)
        if n_ < 1e-6:
            continue
        q = Pa[i_] + v / n_ * KORAK
        qi = np.clip(q.round().astype(int), 0, PX - 1)
        if not dovoljeno[qi[0], qi[1]] or kd.query(q)[0] < KORAK * 0.5:
            continue
        P.append(q); ST.append(int(i_)); novo += 1
    kd = cKDTree(np.array(P))
    priv = priv[kd.query(priv)[0] > UBIJ]
    if not novo:
        break
P = np.array(P); n_v = len(P)
otroci = [[] for _ in range(n_v)]
for i_, s_ in enumerate(ST):
    if s_ >= 0:
        otroci[s_].append(i_)
listi = np.zeros(n_v, int)
for i_ in range(n_v - 1, -1, -1):
    listi[i_] = 1 if not otroci[i_] else sum(listi[o] for o in otroci[i_])
# končna vejica: od lista navzgor do razcepa; krajše od 0,7 mm odpadejo (drobne celice)
vejica = np.zeros(n_v, int); zivo = np.ones(n_v, bool); st_vej = 0
for i_ in range(n_v):
    if otroci[i_] or ST[i_] < 0:
        continue
    pot = [i_]
    while ST[pot[-1]] >= 0 and len(otroci[ST[pot[-1]]]) == 1:
        pot.append(ST[pot[-1]])
    if len(pot) * KORAK < 0.7 * mm and ST[pot[-1]] >= 0:
        zivo[pot] = False; continue
    st_vej += 1; vejica[pot] = st_vej
im_b = Image.new("L", (PX, PX), 0); im_l = Image.new("I", (PX, PX), 0)
db, dl = ImageDraw.Draw(im_b), ImageDraw.Draw(im_l)
for i_ in np.argsort(-listi):
    s_ = ST[i_]
    if s_ < 0 or not zivo[i_]:
        continue
    w = min(0.62, 0.11 + 0.075 * np.sqrt(listi[i_])) * mm
    xy = [(P[s_][1], P[s_][0]), (P[i_][1], P[i_][0])]
    db.line(xy, fill=255, width=max(1, int(round(w))))
    if vejica[i_]:
        dl.line(xy, fill=int(vejica[i_]), width=1)
LAMELA = (np.array(im_b) > 0) & SKORJA
BELO = BELA | LAMELA
mb = megla(BELO, 0.09)
d_b2 = ndimage.distance_transform_edt(~BELO) / mm
# razpoke: meje med območji najbližjih vejic (Voronoi), do 0,62 mm od bele možganovine; ob površini se razprejo
L = np.array(im_l)
_, (ni, nj) = ndimage.distance_transform_edt(L == 0, return_indices=True)
obm = L[ni, nj]
meja = np.zeros((PX, PX), bool)
for ax in (0, 1):
    r_ = np.diff(obm, axis=ax) != 0
    if ax == 0:
        meja[:-1] |= r_; meja[1:] |= r_
    else:
        meja[:, :-1] |= r_; meja[:, 1:] |= r_
d_meja = ndimage.distance_transform_edt(~meja) / mm
sir = 0.06 + 0.17 * np.clip(1.0 - d_zun / 1.3, 0.0, 1.0) ** 1.5
RAZPOKA = SKORJA & (d_meja < sir) & (d_b2 > 0.5)
st = st_vej
d_raz = ndimage.distance_transform_edt(~(RAZPOKA | ~ndimage.binary_dilation(CRV, iterations=int(0.5 * mm)))) / mm
zrn = np.clip(1.0 - d_b2 / 0.5, 0.0, 1.0) ** 0.8     # zrnata plast ob beli
n1 = sum2(0.6); n2 = sum2(3.0)
c_mol = barva(226, 178, 166); c_zrn = barva(186, 118, 104); c_bela = barva(244, 236, 222); c_pia = barva(168, 96, 88)
rgb = np.zeros((PX, PX, 3), np.float32) + c_mol
rgb = rgb * (0.94 + 0.10 * n2[..., None])
rgb = rgb + (c_zrn - rgb) * (zrn * (0.85 + 0.15 * n1))[..., None]
rgb = rgb + (c_bela - rgb) * np.clip(mb * 1.6, 0, 1)[..., None]
pia = np.clip(1.0 - d_raz / 0.16, 0.0, 1.0) * 0.55
rgb = rgb + (c_pia - rgb) * pia[..., None]
A_mali = megla(CRV, 0.6) > 0.02                 # slika pokrije ploskev čez obris (rob ploskve določi mreža)
alfa = np.where(RAZPOKA, 0.0, 1.0)

# ------------------------------------------------------------------ možgansko deblo
most = maska(["basilar_part_of_pons"]); teg_m = maska(["pontine_tegmentum"]); sred = maska(["midbrain_tegmentum", "red_nucleus", "superior_cerebellar_peduncle_brachium_conjunctivum"])
tekt = maska(["superior_colliculus", "inferior_colliculus", "pretectal_region"]); pir = maska(["pyramidal_part_of_medulla_oblongata"])
teg_h = maska(["tegmentum_of_medulla_oblongata"]); krak = maska(["cerebral_peduncle_crus_cerebri"])
DEBLO = most | teg_m | sred | tekt | pir | teg_h | krak
DEBLO_S = megla(ndimage.binary_closing(DEBLO, iterations=int(1.2 * mm)), 0.8) > 0.05
c_osn = barva(232, 214, 196); c_most = barva(240, 228, 208); c_siva = barva(204, 170, 156); c_teg = barva(214, 186, 170)
c_tekt = barva(206, 176, 162); c_pir = barva(244, 234, 216)
rd = np.zeros((PX, PX, 3), np.float32) + c_osn
for m, c in ((teg_m, c_teg), (teg_h, c_teg), (sred, c_teg), (tekt, c_tekt), (most, c_most), (pir, c_pir), (krak, c_most)):
    rd = rd + (c - rd) * np.clip(megla(m, 0.35), 0, 1)[..., None]
# bazilarni del mosta: prečni snopi (svetli, vodoravno razpotegnjeni) med sivimi pontinimi jedri
g = rng.random((PX // 3, PX // 14)).astype(np.float32)
snopi = np.array(Image.fromarray(g).resize((PX, PX), Image.BICUBIC))
snopi = ndimage.gaussian_filter(snopi, (0.12 * mm, 0.5 * mm))
jedra = np.clip((0.5 - snopi) * 6.0, 0, 1) * megla(most, 0.5)
rd = rd + (c_siva - rd) * (0.55 * jedra)[..., None]
# vzdolžna vlakna v tegmentumu in piramidi: rahle navpične proge
g = rng.random((PX // 40, PX // 3)).astype(np.float32)
proge = ndimage.gaussian_filter(np.array(Image.fromarray(g).resize((PX, PX), Image.BICUBIC)), (1.2 * mm, 0.10 * mm))
vl = (megla(teg_m | teg_h | sred | pir, 0.5)) * (proge - 0.5) * 0.22
rd = rd * (1.0 + vl[..., None])
# siva okoli akvedukta (periakveduktalna sivina) in dno četrtega prekata: temnejši pas ob votlinah
votl = maska(["cerebral_aqueduct", "fourth_ventricle", "central_canal_of_medulla_oblongata"])
ob_v = np.clip(megla(votl, 0.9) * 1.6, 0, 1) * megla(DEBLO, 0.3)
rd = rd + (c_siva - rd) * (0.5 * ob_v)[..., None]
rd = rd * (0.95 + 0.08 * sum2(2.0)[..., None])

# ------------------------------------------------------------------ skupna slika: mali možgani imajo prednost v svojem obrisu
je_mali = ndimage.binary_dilation(CRV, iterations=int(1.2 * mm)) & ~(DEBLO & ~CRV)
slika = np.where(je_mali[..., None], rgb, rd)
a = np.where(je_mali, alfa, 1.0) * ((megla(CRV, 0.8) > 0.02) | DEBLO_S)
a = ndimage.gaussian_filter(a.astype(np.float32), 0.5)  # mehak rob razpok (brez stopnic)
out = np.concatenate([np.clip(slika, 0, 1), a[..., None]], 2)
Image.fromarray((out * 255).astype(np.uint8), "RGBA").save(izhod, quality=88, method=6)
rs = {"lo": [round(float(lo[0]), 5), round(float(lo[1]), 5)], "mera": [round(mera, 5), round(mera, 5)]}
print("rezSlika", json.dumps(rs), "lističev", st)
if len(sys.argv) > 3:
    import os
    j = json.load(open(sys.argv[3]))
    ime = os.path.basename(izhod)
    j["tkiva"]["mali"]["rezSlika"] = {"slika": ime, **rs, "izrez": True, "visina": 0.5}
    j["tkiva"]["deblo"]["rezSlika"] = {"slika": ime, **rs, "visina": 0.2}
    open(sys.argv[3], "w").write(json.dumps(j, indent=1, ensure_ascii=False) + "\n")

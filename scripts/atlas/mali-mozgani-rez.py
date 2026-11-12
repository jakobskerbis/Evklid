#!/usr/bin/env python3
"""Naslikana sredinska rezna ploskev malih možganov (tkivo.rezSlika v mozgani.json): arbor vitae.

Model ima režnjiče črva (vermis) kot gladka telesa brez listov, zato pravi presek mreže ne pokaže ne bele možganovine ne
skorje. Slika nastane iz obrisov preseka režnjičev v ravnini prereza (scripts/atlas/zanke-reza.mjs):
  - bela možganovina: podolgovato jedro (corpus medullare) nad streho četrtega prekata (fastigium spredaj), iz njega
    veja v vsak režnjič črva po imenu (lobulus centralis, culmen | fissura prima | declive, folium, tuber, pyramis,
    uvula, nodulus; do njegovega najbolj oddaljenega konca) in iz veje izmenično na obe strani lističi bele možganovine (laminae albae); listič sega
    le po območju svoje veje (do polovice poti do sosednje), zato se lističi sosednjih režnjičev ne križajo;
  - skorja: zrnata plast (≈ 0,35 mm, temnejša) tik ob beli možganovini in molekularna plast (do ≈ 0,95 mm, svetlejša);
    list (folium) je torej listič bele možganovine s skorjo, širok ≈ 2,3 mm;
  - med listi ostanejo brazde (temne, s pio), med režnjiči razpoke iz modela; zunanji obris je nazobčan po listih.
Mere: skorja malih možganov ≈ 1 mm, listi 2–3 mm, deblo bele možganovine nekaj mm (Standring, Gray's Anatomy, 41. izd.).

Zagon:
  node scripts/atlas/zanke-reza.mjs mozgani /tmp/zanke-mozgani.json mali,deblo
  python3 scripts/atlas/mali-mozgani-rez.py /tmp/zanke-mozgani.json public/3d/modeli/organi-3d/mozgani-mali-rez.webp
Izpiše »lo« in »mera« (metri, koordinati ravnine) za tkiva.mali.rezSlika in tkiva.deblo.rezSlika v mozgani.json.

Možgansko deblo (če so v vhodu zanke tkiva »deblo«) je naslikano na isti sliki: most s tegmentumom in bazalnim delom
(siva jedra mostu, beli vzdolžni snopi), srednji možgani s tektumom, rdečim jedrom in črno substanco, podaljšana
hrbtenjača s piramido in olivnim jedrom; med deblom in malimi možgani temna votlina četrtega prekata z vrhom (fastigium)
v jedru bele možganovine. Akvedukt je špranja med zankama srednjih možganov v modelu (slika je tam prosojna).
"""
import json
import math
import random
import sys

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter

VHOD, IZHOD = sys.argv[1], sys.argv[2]
PX = 1536  # stranica slike
NV = 2  # nadvzorčenje (glajenje robov)
ROB = 0.0015  # prazen rob okoli obrisa (m)
BELA, ZRNATA, MOLEKULARNA, BRAZDA = (243, 233, 219), (170, 108, 96), (212, 164, 148), (104, 46, 46)
D_ZRNATA, D_SKORJA = 0.00033, 0.00095  # debelina zrnate plasti in cele skorje (m)
KORAK = 0.0027  # razmik lističev na isti strani veje (m): list 2,3 mm + brazda
SEKTOR = 15  # režnjiči, katerih konca sta v istem sektorju (stopinje) okoli debla, so en režnjič (daljši ostane)

random.seed(11)
d = json.load(open(VHOD))
# režnjiči črva (vermis) po imenih Z-Anatomy; režnjiči polobel ob sredinski ravnini niso del sredinskega reza črva
CRV = ("Lingula of cerebellum", "Central lobule", "Culmen", "Declive", "Folium of vermis", "Tuber of vermis", "Pyramis of vermis", "Uvula of vermis", "Nodule of vermis")
pari = [(o["ime"], z) for o in d if o["ime"] in CRV for z in o["zanke"]]


def ploscina(z):
    return 0.5 * sum(z[i - 1][0] * z[i][1] - z[i][0] * z[i - 1][1] for i in range(len(z)))


def raz(a, b):
    return math.hypot(a[0] - b[0], a[1] - b[1])


pari = [(ime, z) for ime, z in pari if abs(ploscina(z)) > 4e-6]  # > 4 mm²
imena = [ime for ime, _ in pari]
telesa = [z for _, z in pari]
# možgansko deblo v isti ravnini (srednji možgani, most, podaljšana hrbtenjača): slika pokriva oboje
DEBLO = [(o["ime"], z) for o in d if o["tkivo"] == "deblo" for z in o["zanke"] if abs(ploscina(z)) > 4e-6]
xs = [p[0] for z in telesa for p in z] + [p[0] for _, z in DEBLO for p in z]
ys = [p[1] for z in telesa for p in z] + [p[1] for _, z in DEBLO for p in z]
mera = max(max(xs) - min(xs), max(ys) - min(ys)) + 2 * ROB
lo = ((max(xs) + min(xs)) / 2 - mera / 2, (max(ys) + min(ys)) / 2 - mera / 2)
N = PX * NV
k = N / mera


def px(p):
    return ((p[0] - lo[0]) * k, (lo[1] + mera - p[1]) * k)


# deblo bele možganovine: težišče točk režnjičev, ki so najbližje skupnemu težišču (tam se režnjiči stikajo)
tez = [(sum(p[0] for p in z) / len(z), sum(p[1] for p in z) / len(z)) for z in telesa]
c0 = (sum(t[0] for t in tez) / len(tez), sum(t[1] for t in tez) / len(tez))
for _ in range(6):
    blizu = [min(z, key=lambda p: raz(p, c0)) for z in telesa]
    c0 = (sum(p[0] for p in blizu) / len(blizu), sum(p[1] for p in blizu) / len(blizu))


def sredina(seznam):
    t = [min(telesa[i], key=lambda p: raz(p, c0)) for i, ime in enumerate(imena) if ime in seznam]
    return (sum(p[0] for p in t) / len(t), sum(p[1] for p in t) / len(t))


# Jedro bele možganovine (corpus medullare) ni točka: leži nad streho četrtega prekata (fastigium, sprednji konec A med
# centralnim režnjičem in nodulom) in sega nazaj do stika deklive, folija in tuberja (zadnji konec B). Sprednji režnjiči
# (lobulus centralis, culmen) in zadnji (declive … uvula) izhajajo vsak s svojega mesta na jedru; nodul iz fastigija.
A = sredina(("Central lobule", "Nodule of vermis"))
B = sredina(("Declive", "Folium of vermis", "Tuber of vermis"))


def na_jedru(p):
    ab = (B[0] - A[0], B[1] - A[1])
    s = max(0.0, min(1.0, ((p[0] - A[0]) * ab[0] + (p[1] - A[1]) * ab[1]) / (ab[0] ** 2 + ab[1] ** 2)))
    return (A[0] + ab[0] * s, A[1] + ab[1] * s)


vstopi = [min(z, key=lambda p: raz(p, na_jedru(p))) for z in telesa]
# Veje se delijo kot v pravem črvu: iz jedra izhaja nekaj glavnih vej (sprednji reženj: lobulus centralis + culmen;
# zadnji: declive + folium + tuber; spodnji: pyramis + uvula; nodulus iz fastigija), vsaka se v vozlu razcepi v režnjiče.
SKUPINE = (
    (("Central lobule", "Culmen"), 0.2),
    (("Declive", "Folium of vermis", "Tuber of vermis"), 1.0),
    (("Pyramis of vermis", "Uvula of vermis"), 0.6),
    (("Nodule of vermis", "Lingula of cerebellum"), 0.0),
)
izvor = [na_jedru(v) for v in vstopi]
debla = []  # glavne veje: (točka na jedru, vozel)
for clani, sj in SKUPINE:
    idx = [i for i, ime in enumerate(imena) if ime in clani]
    if not idx:
        continue
    baza = (A[0] + (B[0] - A[0]) * sj, A[1] + (B[1] - A[1]) * sj)
    m = (sum(vstopi[i][0] for i in idx) / len(idx), sum(vstopi[i][1] for i in idx) / len(idx))
    f = 0.0 if sj == 0.0 else 0.5
    vozel = (baza[0] + (m[0] - baza[0]) * f, baza[1] + (m[1] - baza[1]) * f)
    debla.append((baza, vozel))
    for i in idx:
        izvor[i] = vozel

# obris: unija režnjičev modela in deblo (med režnjiči ob deblu ni praznine)
obris = Image.new("L", (N, N), 0)
dro = ImageDraw.Draw(obris)
for z in telesa:  # režnjič malo širši od telesa modela: med režnjiči ostane ozka razpoka, ne široka praznina
    q = [px(p) for p in z]
    dro.polygon(q, fill=255)
    dro.line(q + q[:1], fill=255, width=round(0.0026 * k), joint="curve")
for a, b in debla:
    dro.line([px(a), px(b)], fill=255, width=round(0.0036 * k))
    x, y = px(b)
    dro.ellipse((x - 0.0018 * k, y - 0.0018 * k, x + 0.0018 * k, y + 0.0018 * k), fill=255)
dro.line([px(A), px(B)], fill=255, width=round(0.0044 * k))
for q in (A, B):
    x, y = px(q)
    r = 0.0018 * k
    dro.ellipse((x - r, y - r, x + r, y + r), fill=255)
for i, z in enumerate(telesa):  # vrat veje med jedrom in režnjičem
    dro.line([px(izvor[i]), px(vstopi[i])], fill=255, width=round(0.0034 * k))
    for q in (izvor[i], vstopi[i]):  # zaobljena konca vratu
        x, y = px(q)
        r = 0.0017 * k
        dro.ellipse((x - r, y - r, x + r, y + r), fill=255)
# mreža za preverjanje »znotraj obrisa« in »območje moje veje« (0,1 mm)
G = 768
gk = G / mera
maska = np.asarray(obris.resize((G, G), Image.BILINEAR)) > 127

# osi režnjičev: en režnjič na sektor okoli debla (prekrivajoča se telesa modela se združijo)
osi = []
for i, z in enumerate(telesa):
    o, vstop = izvor[i], vstopi[i]
    konec = max(z, key=lambda p: raz(p, o))
    dol = raz(konec, o)
    t = tez[i]
    u = ((konec[0] - o[0]) / dol, (konec[1] - o[1]) / dol)
    kon = (konec[0] - u[0] * 0.0019, konec[1] - u[1] * 0.0019)  # veja konča pred obrisom (skorja + lističi na koncu)
    # os: iz jedra skozi vstop in težišče režnjiča proti koncu (kvadratna Bézierova krivulja, rahlo ukrivljena)
    m = ((t[0] + vstop[0]) / 2, (t[1] + vstop[1]) / 2)
    n = max(10, int(dol / 0.0003))
    osi.append([((1 - s) ** 2 * o[0] + 2 * s * (1 - s) * m[0] + s * s * kon[0], (1 - s) ** 2 * o[1] + 2 * s * (1 - s) * m[1] + s * s * kon[1]) for s in (j / n for j in range(n + 1))])

# območje veje: vsaka točka mreže pripada najbližji osi
gy, gx = np.mgrid[0:G, 0:G]
PXm = lo[0] + (gx + 0.5) / gk
PYm = lo[1] + mera - (gy + 0.5) / gk
naj = np.full((G, G), 1e9)
obmocje = np.zeros((G, G), np.int16)
for i, os in enumerate(osi):
    dmin = np.full((G, G), 1e9)
    for p in os[::2]:
        dmin = np.minimum(dmin, np.hypot(PXm - p[0], PYm - p[1]))
    obmocje[dmin < naj] = i
    naj = np.minimum(naj, dmin)


def v_obmocju(p, i):
    c, v = int((p[0] - lo[0]) * gk), int((lo[1] + mera - p[1]) * gk)
    return 0 <= c < G and 0 <= v < G and maska[v, c] and obmocje[v, c] == i


def doseg(a, u, i, naj_dol=0.012):
    """Dolžina lističa iz a v smeri u: do 1,25 mm pred mejo obrisa ali območja veje."""
    t = 0.0
    while t < naj_dol and v_obmocju((a[0] + u[0] * (t + 0.00125), a[1] + u[1] * (t + 0.00125)), i):
        t += 0.00015
    return t


crte = []  # (točke, širina v m): bela možganovina
for i, os in enumerate(osi):
    n = len(os) - 1
    dol = sum(raz(os[j], os[j + 1]) for j in range(n))
    w0 = min(0.0017, 0.0008 + dol * 0.045)
    for j in range(n):  # veja se proti koncu tanjša
        crte.append(([os[j], os[j + 1]], w0 * (1 - 0.7 * j / n)))
    pot, nasl, stran = 0.0, 0.0034, 1
    for j in range(n):
        seg = raz(os[j], os[j + 1])
        pot += seg
        if pot < nasl:
            continue
        nasl += KORAK / 2  # na vsaki strani en listič na korak
        tx, ty = (os[j + 1][0] - os[j][0]) / seg, (os[j + 1][1] - os[j][1]) / seg
        kot = math.radians(random.uniform(60, 72)) * stran
        stran = -stran
        u = (tx * math.cos(kot) - ty * math.sin(kot), tx * math.sin(kot) + ty * math.cos(kot))
        dl = doseg(os[j], u, i) * random.uniform(0.9, 1.0)
        if dl < 0.0009:
            continue
        # listič se rahlo upogne proti koncu režnjiča
        a = os[j]
        tocke = [a]
        for s in (0.34, 0.67, 1.0):
            zavoj = 0.18 * s * s * dl
            tocke.append((a[0] + u[0] * dl * s + tx * zavoj, a[1] + u[1] * dl * s + ty * zavoj))
        crte.append((tocke, 0.00042))
        # dolg listič se razcepi: sekundarni lističi izmenično (dovolj narazen, da ostane brazda)
        if dl > 0.0052:
            zn = 1
            for s in np.arange(0.0026, dl - 0.0016, KORAK / 2):
                m = (a[0] + u[0] * s, a[1] + u[1] * s)
                k2 = math.radians(62) * zn
                zn = -zn
                u2 = (u[0] * math.cos(k2) - u[1] * math.sin(k2), u[0] * math.sin(k2) + u[1] * math.cos(k2))
                d2 = min(doseg(m, u2, i, 0.0026), KORAK * 0.42)
                if d2 > 0.0008:
                    crte.append(([m, (m[0] + u2[0] * d2, m[1] + u2[1] * d2)], 0.00036))
    # konec veje: pahljača lističev
    tx, ty = os[-1][0] - os[-5][0], os[-1][1] - os[-5][1]
    tl = math.hypot(tx, ty) or 1
    for kot in (-42, 0, 42):
        kr = math.radians(kot)
        u = (tx / tl * math.cos(kr) - ty / tl * math.sin(kr), tx / tl * math.sin(kr) + ty / tl * math.cos(kr))
        dl = doseg(os[-1], u, i, 0.004)
        if dl > 0.0006:
            crte.append(([os[-1], (os[-1][0] + u[0] * dl, os[-1][1] + u[1] * dl)], 0.0004))


def narisi(dodatek):
    im = Image.new("L", (N, N), 0)
    dr = ImageDraw.Draw(im)
    for tocke, w in crte:
        s = max(1, round((w + 2 * dodatek) * k))
        q = [px(p) for p in tocke]
        dr.line(q, fill=255, width=s, joint="curve")
        for x, y in q:  # zaobljeni konci in stiki
            dr.ellipse((x - s / 2, y - s / 2, x + s / 2, y + s / 2), fill=255)
    for a, b in debla:  # glavne veje
        s = max(1, round((0.0022 + 2 * dodatek) * k))
        q = [px(a), px(b)]
        dr.line(q, fill=255, width=s)
        for x, y in q:
            dr.ellipse((x - s / 2, y - s / 2, x + s / 2, y + s / 2), fill=255)
    q = [px(A), px(B)]  # jedro bele možganovine (corpus medullare)
    s = max(1, round((0.0038 + 2 * dodatek) * k))
    dr.line(q, fill=255, width=s)
    for x, y in q:
        dr.ellipse((x - s / 2, y - s / 2, x + s / 2, y + s / 2), fill=255)
    return im


bela, zrnata, skorja = narisi(0), narisi(D_ZRNATA), narisi(D_SKORJA)
slika = Image.new("RGB", (N, N), BRAZDA)
slika.paste(Image.new("RGB", (N, N), MOLEKULARNA), mask=skorja)
slika.paste(Image.new("RGB", (N, N), ZRNATA), mask=zrnata)
slika.paste(Image.new("RGB", (N, N), BELA), mask=bela)
# rahla senca v brazdah ob listih (globina): zabrisana maska skorje potemni rob molekularne plasti
senca = skorja.filter(ImageFilter.GaussianBlur(0.0003 * k))
slika = ImageChops.multiply(slika, Image.merge("RGB", [senca.point(lambda v: 200 + v * 55 // 255)] * 3))
# alfa: skorja in ozke brazde med listi (do 0,45 mm od skorje) znotraj obrisa; zunanji obris je nazobčan po listih, širše
# praznine med režnjiči ostanejo odprte (senčilnik tam ploskve ne riše)
alfa = ImageChops.multiply(narisi(D_SKORJA + 0.00045), obris)

# ---- četrti prekat in možgansko deblo ----
def maska_zank(zanke, siri=0.0):
    im = Image.new("L", (N, N), 0)
    dd = ImageDraw.Draw(im)
    for z in zanke:
        q = [px(p) for p in z]
        dd.polygon(q, fill=255)
        if siri:
            dd.line(q + q[:1], fill=255, width=round(2 * siri * k), joint="curve")
    return im


def premik(im, dx, dy):  # premik maske za (dx, dy) metrov
    return ImageChops.offset(im, round(dx * k), round(-dy * k))


def crta(dd, c, u, dol, sirina, barva):  # zaobljena črta s središčem c vzdolž u
    a, b = px((c[0] - u[0] * dol / 2, c[1] - u[1] * dol / 2)), px((c[0] + u[0] * dol / 2, c[1] + u[1] * dol / 2))
    w = max(1, round(sirina * k))
    dd.line([a, b], fill=barva, width=w)
    for x, y in (a, b):
        dd.ellipse((x - w / 2, y - w / 2, x + w / 2, y + w / 2), fill=barva)


if DEBLO:
    po = lambda ime: [z for i, z in DEBLO if i.startswith(ime)]
    tezisce = lambda z: (sum(q[0] for q in z) / len(z), sum(q[1] for q in z) / len(z))
    VENT = (-0.94, -0.34)  # ventralna (sprednja) smer debla v ravnini reza
    OS = (0.34, -0.94)  # os debla navzdol
    BELINA, SIVINA = (233, 217, 202), (214, 192, 180)
    m_deblo = maska_zank([z for _, z in DEBLO], 0.00025)
    m_most, m_pod, m_sred = maska_zank(po("Pons")), maska_zank(po("Medulla")), maska_zank(po("Midbrain"))
    # most: tegmentum (hrbtnih 6,5 mm) in bazalni del s sivimi jedri mostu in belimi vzdolžnimi snopi (piramidna proga)
    tegmentum = ImageChops.subtract(m_most, premik(m_most, VENT[0] * 0.0065, VENT[1] * 0.0065))
    bazalni = ImageChops.subtract(m_most, tegmentum)
    deblo = Image.new("RGB", (N, N), BELINA)
    deblo.paste(Image.new("RGB", (N, N), SIVINA), mask=bazalni)
    snopi = Image.new("L", (N, N), 0)
    ds = ImageDraw.Draw(snopi)
    most = max(po("Pons"), key=lambda z: abs(ploscina(z)))
    bx, by = [q[0] for q in most], [q[1] for q in most]
    for _ in range(18):
        c = (random.uniform(min(bx), max(bx)), random.uniform(min(by), max(by)))
        crta(ds, c, OS, random.uniform(0.004, 0.009), random.uniform(0.0009, 0.0016), 255)
    deblo.paste(Image.new("RGB", (N, N), (229, 212, 198)), mask=ImageChops.multiply(snopi, bazalni))
    deblo.paste(Image.new("RGB", (N, N), (219, 199, 187)), mask=tegmentum)
    # srednji možgani: tektum (zadnja zanka) siv, v tegmentumu rdeče jedro in črna substanca
    dd = ImageDraw.Draw(deblo)
    sred = sorted(po("Midbrain"), key=lambda z: tezisce(z)[0])
    if len(sred) > 1:
        dd.polygon([px(q) for q in sred[-1]], fill=(209, 188, 178))
    if sred:
        c = tezisce(sred[0])
        plast = Image.new("RGB", (N, N), BELINA)
        dp = ImageDraw.Draw(plast)
        mp = Image.new("L", (N, N), 0)
        dm = ImageDraw.Draw(mp)
        crta(dp, (c[0] + VENT[0] * 0.0042, c[1] + VENT[1] * 0.0042), OS, 0.011, 0.0014, (132, 104, 98))
        crta(dm, (c[0] + VENT[0] * 0.0042, c[1] + VENT[1] * 0.0042), OS, 0.011, 0.0014, 255)
        crta(dp, (c[0] + VENT[0] * 0.0005, c[1] + 0.0015), OS, 0.0012, 0.0042, (216, 174, 164))
        crta(dm, (c[0] + VENT[0] * 0.0005, c[1] + 0.0015), OS, 0.0012, 0.0042, 255)
        deblo.paste(plast, mask=ImageChops.multiply(mp, maska_zank(sred[:1])))
    # podaljšana hrbtenjača: piramida spredaj (bela), za njo spodnje olivno jedro (siv nagubani trak)
    piramida = ImageChops.subtract(m_pod, premik(m_pod, -VENT[0] * 0.003, -VENT[1] * 0.003))
    deblo.paste(Image.new("RGB", (N, N), (240, 231, 218)), mask=piramida)
    pod = max(po("Medulla"), key=lambda z: abs(ploscina(z)), default=None)
    if pod:
        vrh = max(q[1] for q in pod)
        zg = [q for q in pod if q[1] > vrh - 0.016]
        c = tezisce(zg)
        c = (c[0] + VENT[0] * 0.0015, c[1] - 0.002)
        plast = Image.new("RGB", (N, N), BELINA)
        dp = ImageDraw.Draw(plast)
        mp = Image.new("L", (N, N), 0)
        dm = ImageDraw.Draw(mp)
        crta(dp, c, OS, 0.0085, 0.0034, (198, 170, 160))
        crta(dm, c, OS, 0.0085, 0.0034, 255)
        crta(dp, c, OS, 0.0062, 0.0011, BELINA)
        deblo.paste(plast, mask=ImageChops.multiply(mp, m_pod))
    deblo = deblo.filter(ImageFilter.GaussianBlur(0.0005 * k))
    # četrti prekat: temna šotorasta votlina med hrbtno stranjo mostu in podaljšane hrbtenjače ter malimi možgani, vrh
    # (fastigium) sega v jedro bele možganovine
    glavni = [z for _, z in DEBLO if abs(ploscina(z)) > 1e-4]
    hrbet = lambda y: max((q[0] for z in glavni for q in z if abs(q[1] - y) < 0.0015), default=None)
    veriga = [(hrbet(y) - 0.0004, y) for y in np.arange(A[1] + 0.009, A[1] - 0.0155, -0.001) if hrbet(y) is not None]
    prekat = Image.new("L", (N, N), 0)
    if len(veriga) > 2:
        ImageDraw.Draw(prekat).polygon([px(q) for q in veriga] + [px((A[0] - 0.002, A[1]))], fill=255)
    dno = Image.new("RGB", (N, N), (58, 32, 30))
    dno.paste(slika, mask=alfa)
    dno.paste(deblo, mask=m_deblo)
    slika = dno
    alfa = ImageChops.lighter(ImageChops.lighter(alfa, prekat), m_deblo)
slika.putalpha(alfa)
slika = slika.resize((PX, PX), Image.LANCZOS)
slika.save(IZHOD, quality=88, method=6)
print(json.dumps({"lo": [round(lo[0], 5), round(lo[1], 5)], "mera": [round(mera, 5), round(mera, 5)], "jedro": [[round(v, 5) for v in A], [round(v, 5) for v in B]], "reznjicev": len(osi)}))

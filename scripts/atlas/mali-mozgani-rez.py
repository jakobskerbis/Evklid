#!/usr/bin/env python3
"""Naslikana sredinska rezna ploskev malih možganov in možganskega debla (tkivo.rezSlika v mozgani.json).

Model ima režnjiče črva (vermis) kot gladka telesa brez listov, zato pravi presek mreže ne pokaže ne bele možganovine ne
skorje. Slika nastane iz obrisov preseka v ravnini prereza (scripts/atlas/zanke-reza.mjs) kot pravi sredinski rez črva:
  - obris črva: unija presekov režnjičev, zaprta in zglajena (režnjiči modela so baloni z vrzelmi, pravi črv je strnjen);
  - arbor vitae v treh ravneh: jedro bele možganovine (corpus medullare) nad streho četrtega prekata (fastigium), iz
    njega glavna lamela v vsak režnjič (lobulus centralis, culmen | fissura prima | declive, folium, tuber, pyramis,
    uvula, nodulus), iz nje izmenično stranske lamele (podrežnjiči) in iz teh drobni lističi bele možganovine (folia);
  - vsaka veja ima svoje območje (najbližja veja): meje območij so razpoke. Globina po ravni: med režnjiči segajo skoraj
    do jedra, med podrežnjiči do glavne lamele, med listi so plitve; razpoke so ozke (listi tesno drug ob drugem);
  - skorja: zrnata plast (≈ 0,33 mm, temnejša) tik ob beli možganovini, molekularna plast (svetlejša) do razpoke;
  - zunanji obris je drobno nazobčan tam, kjer razpoke dosežejo površino.
Mere: skorja malih možganov ≈ 1 mm, list 1,5–2 mm (Standring, Gray's Anatomy, 42. izd.).

Možgansko deblo (zanke tkiva »deblo«) je na isti sliki: most z bazalnim delom (prečna vlakna in siva jedra mostu kot
progast vzorec) in tegmentumom, srednji možgani s tektumom, črno substanco in rdečim jedrom, podaljšana hrbtenjača z
vzdolžnimi snopi in piramido; med deblom in malimi možgani četrti prekat (šotorasta votlina z vrhom v fastigiju), zgoraj
in spodaj tanki jadri (velum medullare superius, inferius).

Zagon:
  node scripts/atlas/zanke-reza.mjs mozgani /tmp/zanke-mozgani.json mali,deblo
  python3 scripts/atlas/mali-mozgani-rez.py /tmp/zanke-mozgani.json public/3d/modeli/organi-3d/mozgani-mali-rez.webp
Izpiše »lo« in »mera« (metri, koordinati ravnine) za tkiva.mali.rezSlika in tkiva.deblo.rezSlika v mozgani.json.
"""
import json
import math
import random
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

VHOD, IZHOD = sys.argv[1], sys.argv[2]
PX = 1536
ROB = 0.0015
BELA, ZRNATA, MOLEKULARNA, BRAZDA = (242, 232, 216), (176, 112, 98), (216, 168, 150), (98, 44, 44)
CRV = ("Lingula of cerebellum", "Central lobule", "Culmen", "Declive", "Folium of vermis", "Tuber of vermis", "Pyramis of vermis", "Uvula of vermis", "Nodule of vermis")

rnd = random.Random(11)
d = json.load(open(VHOD))

# Mali možgani iz MRI (en kos »Cerebellum (MRI)«, izvozi-organe.py mali_mri): presek črva se razdeli v režnjiče po kotih
# okoli fastigija (tkiva.mali.listiSredisce v mozgani.json), meje so fisure iz scripts/atlas/mali-mozgani-mri.py (FISURE;
# 0° nazaj, 90° gor). Nato kot prej: obris = unija režnjičev, glavna lamela v vsak režnjič.
SEKTORJI = [("Lingula of cerebellum", 152, 200), ("Central lobule", 122, 152), ("Culmen", 84, 122), ("Declive", 50, 84),
            ("Folium of vermis", 22, 50), ("Tuber of vermis", -8, 22), ("Pyramis of vermis", -48, -8),
            ("Uvula of vermis", -104, -48), ("Nodule of vermis", -160, -104)]


def _odrezi(poli, a, b):
    """Sutherland–Hodgman: del mnogokotnika levo od usmerjene premice a→b."""
    stran = lambda p: (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])
    izh = []
    for i, q in enumerate(poli):
        p = poli[i - 1]; sp, sq = stran(p), stran(q)
        if sq >= 0:
            if sp < 0:
                t = sp / (sp - sq); izh.append((p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])))
            izh.append(q)
        elif sp >= 0:
            t = sp / (sp - sq); izh.append((p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])))
    return izh


def razdeli_crv(d):
    import os
    mali = [o for o in d if o["tkivo"] == "mali" and "(MRI)" in o["ime"]]
    if not mali or any(o["ime"] in CRV for o in d):
        return d
    o = mali[0]
    pot = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "public", "3d", "modeli", "organi-3d", "mozgani.json")
    F3 = json.load(open(pot))["tkiva"]["mali"]["listiSredisce"]
    O, U, V = o["O"], o["U"], o["V"]
    dot = lambda a, b: sum(x * y for x, y in zip(a, b))
    Fc = (dot([F3[i] - O[i] for i in range(3)], U), dot([F3[i] - O[i] for i in range(3)], V))
    nazaj = (dot((0, 0, -1), U), dot((0, 0, -1), V)); gor = (dot((0, 1, 0), U), dot((0, 1, 0), V))
    smer = lambda kot: (math.cos(math.radians(kot)) * nazaj[0] + math.sin(math.radians(kot)) * gor[0],
                        math.cos(math.radians(kot)) * nazaj[1] + math.sin(math.radians(kot)) * gor[1])
    R = 0.3
    izh = [x for x in d if x is not o]
    for ime, k0, k1 in SEKTORJI:
        a = (Fc[0] + R * smer(k0)[0], Fc[1] + R * smer(k0)[1]); b = (Fc[0] + R * smer(k1)[0], Fc[1] + R * smer(k1)[1])
        zanke = []
        for z in o["zanke"]:
            # klin = dve polravnini (Fc→a levo ali desno, odvisno od usmerjenosti nazaj×gor v ravnini)
            lev = nazaj[0] * gor[1] - nazaj[1] * gor[0] > 0
            p = _odrezi(z, Fc, a) if lev else _odrezi(z, a, Fc)
            p = _odrezi(p, b, Fc) if lev else _odrezi(p, Fc, b)
            if len(p) >= 3:
                zanke.append([list(q) for q in p])
        izh.append({"ime": ime, "tkivo": "mali", "zanke": zanke, "O": O, "U": U, "V": V})
    print("črv iz MRI: režnjiči po kotih okoli fastigija", [(x["ime"], len(x["zanke"])) for x in izh if x["ime"] in CRV])
    return izh


d = razdeli_crv(d)


def ploscina(z):
    return 0.5 * sum(z[i - 1][0] * z[i][1] - z[i][0] * z[i - 1][1] for i in range(len(z)))


crv = [(o["ime"], z) for o in d if o["ime"] in CRV for z in o["zanke"] if abs(ploscina(z)) > 4e-6]
DEBLO = [(o["ime"], z) for o in d if o["tkivo"] == "deblo" for z in o["zanke"] if abs(ploscina(z)) > 4e-6]
xs = [p[0] for _, z in crv + DEBLO for p in z]
ys = [p[1] for _, z in crv + DEBLO for p in z]
mera = max(max(xs) - min(xs), max(ys) - min(ys)) + 2 * ROB
lo = ((max(xs) + min(xs)) / 2 - mera / 2, (max(ys) + min(ys)) / 2 - mera / 2)
N = PX
k = N / mera
X = (lo[0] + (np.arange(N) + 0.5) / k)[None, :].repeat(N, 0).astype(np.float32)
Y = (lo[1] + mera - (np.arange(N) + 0.5) / k)[:, None].repeat(N, 1).astype(np.float32)


def px(p):
    return ((p[0] - lo[0]) * k, (lo[1] + mera - p[1]) * k)


def maska(zanke):
    im = Image.new("L", (N, N), 0)
    dr = ImageDraw.Draw(im)
    for z in zanke:
        dr.polygon([px(p) for p in z], fill=255)
    return im


def zamegli(im, r_m):
    return im.filter(ImageFilter.GaussianBlur(r_m * k))


def krci(im, r_m):
    return im.filter(ImageFilter.MinFilter(2 * max(1, int(round(r_m * k))) + 1))


def raz_odsek(x, y, a, b):
    """Razdalja točk (x, y) do odseka a–b."""
    ax, ay = a; bx, by = b
    dx, dy = bx - ax, by - ay
    L2 = dx * dx + dy * dy or 1e-18
    t = np.clip(((x - ax) * dx + (y - ay) * dy) / L2, 0, 1)
    return np.hypot(x - (ax + t * dx), y - (ay + t * dy))


def okno(tocke, rob):
    x0 = max(0, int((min(p[0] for p in tocke) - rob - lo[0]) * k)); x1 = min(N, int((max(p[0] for p in tocke) + rob - lo[0]) * k) + 2)
    y0 = max(0, int((lo[1] + mera - max(p[1] for p in tocke) - rob) * k)); y1 = min(N, int((lo[1] + mera - min(p[1] for p in tocke) + rob) * k) + 2)
    return slice(y0, y1), slice(x0, x1)


class Polje:
    """Najbližji in drugi najbližji generator (lomljenka) za vsako točko slike: razdalji d1, d2 in indeksa i1, i2."""

    def __init__(self):
        self.d1 = np.full((N, N), 9.0, np.float32); self.d2 = np.full((N, N), 9.0, np.float32)
        self.i1 = np.full((N, N), -1, np.int32); self.i2 = np.full((N, N), -1, np.int32)

    def dodaj(self, i, lom, doseg):
        w = okno(lom, doseg)
        x, y = X[w], Y[w]
        dd = np.full(x.shape, 9.0, np.float32)
        for a, b in zip(lom, lom[1:]):
            dd = np.minimum(dd, raz_odsek(x, y, a, b))
        d1, d2, i1, i2 = self.d1[w], self.d2[w], self.i1[w], self.i2[w]
        prvi = dd < d1
        drugi = (~prvi) & (dd < d2)
        d2[prvi] = d1[prvi]; i2[prvi] = i1[prvi]; d1[prvi] = dd[prvi]; i1[prvi] = i
        d2[drugi] = dd[drugi]; i2[drugi] = i


def tocka_v(m, p):
    j = int((p[0] - lo[0]) * k); i = int((lo[1] + mera - p[1]) * k)
    return 0 <= i < N and 0 <= j < N and m[i, j]


# ---------------------------------------------------------------- obris črva
m_deblo_im = maska([z for _, z in DEBLO])
m_deblo = np.array(m_deblo_im) > 127
M_im = maska([z for _, z in crv])
M_im = zamegli(M_im, 0.0016).point(lambda v: 255 if v > 96 else 0)   # zapre vrzeli med baloni režnjičev
M_im = zamegli(M_im, 0.0009).point(lambda v: 255 if v > 132 else 0)  # zgladi in vrne obris na mero
M = (np.array(M_im) > 127) & ~(np.array(zamegli(m_deblo_im, 0.0004)) > 40)
# notranji žep med baloni režnjičev je v resnici bela sredica (corpus medullare): zapolni ga, ostane le plitva zareza fastigija
_zap = np.array(zamegli(Image.fromarray((M * 255).astype(np.uint8)), 0.0045)) > 118
_ii, _jj = np.nonzero(M)
_x_sp = float(np.percentile(X[_ii, _jj], 2))
_y0, _y1 = float(np.percentile(Y[_ii, _jj], 30)), float(np.percentile(Y[_ii, _jj], 70))
_spredaj = float(min(X[_ii, _jj][(Y[_ii, _jj] > _y0) & (Y[_ii, _jj] < _y1)], default=_x_sp))
M = M | (_zap & (X > _spredaj + 0.0035) & ~m_deblo)
M_im = Image.fromarray((M * 255).astype(np.uint8))
E14 = np.array(krci(M_im, 0.0014)) > 127
E09 = np.array(krci(M_im, 0.0009)) > 127
E05 = np.array(krci(M_im, 0.0005)) > 127
E02 = np.array(krci(M_im, 0.00022)) > 127


def sredisce(imena):
    t = [p for ime, z in crv if ime in imena for p in z]
    return (sum(p[0] for p in t) / len(t), sum(p[1] for p in t) / len(t))


ii, jj = np.nonzero(M)
cm = (float(X[ii, jj].mean()), float(Y[ii, jj].mean()))
y_f = (sredisce(("Central lobule",))[1] + sredisce(("Nodule of vermis",))[1]) / 2
vr = np.abs(Y[ii, jj] - y_f) < 0.0015
F = (float(X[ii, jj][vr].min()), y_f)  # fastigium: sprednji rob črva med lobulus centralis in nodulusom
sm = (cm[0] - F[0], cm[1] - F[1]); sl = math.hypot(*sm); sm = (sm[0] / sl, sm[1] / sl)
A = (F[0] + sm[0] * 0.0035, F[1] + sm[1] * 0.0035)
B = (F[0] + sm[0] * 0.0105, F[1] + sm[1] * 0.0105)
Cc = ((A[0] + B[0]) / 2, (A[1] + B[1]) / 2)

# ---------------------------------------------------------------- glavne lamele (ena na režnjič)
glavne = []
for ime in CRV:
    t = [p for i2_, z in crv if i2_ == ime for p in z]
    if not t:
        continue
    vrh = max(t, key=lambda p: math.hypot(p[0] - Cc[0], p[1] - Cc[1]))
    glavne.append((math.atan2(vrh[1] - Cc[1], vrh[0] - Cc[0]), ime, vrh))
glavne.sort()
# dva režnjiča v isti smeri (< 14°): ostane daljši
cisti = []
for g in glavne:
    if cisti and abs(g[0] - cisti[-1][0]) < math.radians(14):
        if math.hypot(g[2][0] - Cc[0], g[2][1] - Cc[1]) > math.hypot(cisti[-1][2][0] - Cc[0], cisti[-1][2][1] - Cc[1]):
            cisti[-1] = g
        continue
    cisti.append(g)
glavne = cisti


def na_jedru(p):
    ax, ay = A; bx, by = B
    t = max(0.0, min(1.0, ((p[0] - ax) * (bx - ax) + (p[1] - ay) * (by - ay)) / ((bx - ax) ** 2 + (by - ay) ** 2)))
    return (ax + t * (bx - ax), ay + t * (by - ay))


def lok(a, b, upogib, n=36):
    """Rahlo upognjena pot a → b (kvadratna Bézierjeva krivulja)."""
    mx, my = (a[0] + b[0]) / 2, (a[1] + b[1]) / 2
    dx, dy = b[0] - a[0], b[1] - a[1]
    c = (mx - dy * upogib, my + dx * upogib)
    return [((1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]) for t in (i / n for i in range(n + 1))]


prim = []
for i, (kot, ime, vrh) in enumerate(glavne):
    a = na_jedru(vrh)
    b = (a[0] + (vrh[0] - a[0]) * 0.9, a[1] + (vrh[1] - a[1]) * 0.9)
    lom = lok(a, b, rnd.uniform(-0.07, 0.07))
    while len(lom) > 4 and not tocka_v(E09, lom[-1]):
        lom.pop()
    prim.append(lom)

P1 = Polje()
for i, lom in enumerate(prim):
    P1.dodaj(i, lom, 0.05)
d_jedro = raz_odsek(X, Y, A, B)


def dolzine(lom):
    s = [0.0]
    for a, b in zip(lom, lom[1:]):
        s.append(s[-1] + math.hypot(b[0] - a[0], b[1] - a[1]))
    return s


def na_poti(lom, s, t):
    i = max(0, min(len(s) - 2, int(np.searchsorted(s, t)) - 1))
    u = (t - s[i]) / max(s[i + 1] - s[i], 1e-12)
    a, b = lom[i], lom[i + 1]
    tl = math.hypot(b[0] - a[0], b[1] - a[1]) or 1e-12
    return (a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u), ((b[0] - a[0]) / tl, (b[1] - a[1]) / tl)


def zasuk(v, kot):
    c, s_ = math.cos(kot), math.sin(kot)
    return (v[0] * c - v[1] * s_, v[0] * s_ + v[1] * c)


def poganjek(p, smer, pogoj, naj, korak=0.00008):
    """Ravna veja iz p v smeri, dokler velja pogoj(točka); vrne konec ali None."""
    L = 0.0; q = p
    while L < naj:
        n = (p[0] + smer[0] * (L + korak), p[1] + smer[1] * (L + korak))
        if not pogoj(n):
            break
        q = n; L += korak
    return q, L


def idx(p):
    return int((lo[1] + mera - p[1]) * k), int((p[0] - lo[0]) * k)


# ---------------------------------------------------------------- stranske lamele (podrežnjiči)
sek = []  # (lomljenka, režnjič)
for li, lom in enumerate(prim):
    s = dolzine(lom)
    stran = 1 if li % 2 else -1
    t = 0.0022
    while t < s[-1] - 0.0012:
        p, tg = na_poti(lom, s, t)
        sm_ = zasuk(tg, stran * math.radians(rnd.uniform(52, 66)))
        def ok(q, li=li):
            i, j = idx(q)
            return 0 <= i < N and 0 <= j < N and E09[i, j] and P1.i1[i, j] == li and (P1.d2[i, j] - P1.d1[i, j]) > 0.0009
        q, L = poganjek(p, sm_, ok, 0.016)
        if L >= 0.0011:
            sek.append(([p, ((p[0] + q[0]) / 2 + sm_[1] * L * 0.04 * stran, (p[1] + q[1]) / 2 - sm_[0] * L * 0.04 * stran), q], li))
        stran = -stran; t += 0.0013
    # konec glavne lamele je sam podrežnjič
    p, tg = na_poti(lom, s, max(s[-1] - 0.0025, s[-1] * 0.6))
    sek.append(([p, lom[-1]], li))

P2 = Polje()
for i, (lom, li) in enumerate(sek):
    P2.dodaj(i, lom, 0.02)
rez_sek = np.array([li for _, li in sek] + [-1], np.int32)

# ---------------------------------------------------------------- lističi (folia)
ter = []  # (lomljenka, podrežnjič)
for si, (lom, li) in enumerate(sek):
    s = dolzine(lom)
    stran = 1 if si % 2 else -1
    t = 0.0006
    while t < s[-1] + 1e-9:
        p, tg = na_poti(lom, s, min(t, s[-1]))
        sm_ = zasuk(tg, stran * math.radians(rnd.uniform(58, 74)))
        def ok(q, si=si):
            i, j = idx(q)
            return 0 <= i < N and 0 <= j < N and E05[i, j] and P2.i1[i, j] == si and (P2.d2[i, j] - P2.d1[i, j]) > 0.00085
        q, L = poganjek(p, sm_, ok, 0.0026)
        if L >= 0.00045:
            ter.append(([p, q], si))
        stran = -stran; t += 0.0008
    ter.append(([lom[-2] if len(lom) > 2 else lom[0], lom[-1]], si))  # vrh podrežnjiča

P3 = Polje()
for i, (lom, si) in enumerate(ter):
    P3.dodaj(i, lom, 0.006)
sek_ter = np.array([si for _, si in ter] + [-1], np.int32)

# ---------------------------------------------------------------- bela možganovina (širine se tanjšajo)
bela_im = Image.new("L", (N, N), 0)
dr = ImageDraw.Draw(bela_im)


def crta(lom, w0, w1):
    n = len(lom)
    for i, (a, b) in enumerate(zip(lom, lom[1:])):
        w = (w0 + (w1 - w0) * i / max(n - 2, 1)) * k
        dr.line([px(a), px(b)], fill=255, width=max(1, int(round(w))))
        r = w / 2
        for q in (a, b):
            c = px(q); dr.ellipse([c[0] - r, c[1] - r, c[0] + r, c[1] + r], fill=255)


def gosto(lom, n=8):
    return [(a[0] + (b[0] - a[0]) * j / n, a[1] + (b[1] - a[1]) * j / n) for a, b in zip(lom, lom[1:]) for j in range(n)] + [lom[-1]]


crta(gosto([A, B], 12), 0.0042, 0.0034)
for lom in prim:
    crta(lom, 0.0013, 0.00042)
for lom, _ in sek:
    crta(gosto(lom), 0.00046, 0.00022)
for lom, _ in ter:
    crta(lom, 0.00021, 0.00016)
bela_m = zamegli(bela_im, 0.00004)
bela = np.array(bela_m).astype(np.float32) / 255
# razdalja do bele možganovine (za zrnato plast): mehko iz zameglitev dveh širin
blizu = np.array(zamegli(bela_im, 0.00022)).astype(np.float32) / 255

# ---------------------------------------------------------------- razpoke
d_bela = np.minimum(P3.d1, np.minimum(P2.d1, P1.d1))
r1 = (P1.i1 != P1.i2) & (P1.i2 >= 0) & ((P1.d2 - P1.d1) < 0.00024) & (d_jedro > 0.0042) & (d_bela > 0.0005)
l1, l2 = rez_sek[P2.i1], rez_sek[P2.i2]
r2 = (P2.i2 >= 0) & (l1 == l2) & ((P2.d2 - P2.d1) < 0.00017) & (P1.d1 > 0.0011) & (d_bela > 0.00045)
s1, s2 = sek_ter[P3.i1], sek_ter[P3.i2]
r3 = (P3.i2 >= 0) & (s1 == s2) & ((P3.d2 - P3.d1) < 0.00010) & (P2.d1 > 0.0007) & (P3.d1 > 0.00042) & ~E14  # zareze med lističi le ob površini
razpoka = (r1 | r2 | r3) & M
raz_im = zamegli(Image.fromarray((razpoka * 255).astype(np.uint8)), 0.00003)
raz_a = np.clip(np.array(raz_im).astype(np.float32) / 150, 0, 1)

# ---------------------------------------------------------------- barve malih možganov
sum_ = np.array(zamegli(Image.fromarray(np.random.default_rng(5).integers(0, 255, (N, N), dtype=np.uint8)), 0.0006)).astype(np.float32) / 255 - 0.5
rgb = np.zeros((N, N, 3), np.float32)
zrn = np.clip((blizu - 0.10) / 0.22, 0, 1)[..., None]
rgb[:] = np.array(MOLEKULARNA, np.float32) * (1 - zrn) + np.array(ZRNATA, np.float32) * zrn
rgb = rgb * (1 - bela[..., None]) + np.array(BELA, np.float32) * bela[..., None]
rgb *= (1 + 0.10 * sum_)[..., None]
rgb = rgb * (1 - raz_a[..., None]) + np.array(BRAZDA, np.float32) * raz_a[..., None]
# pia ob zunanjem robu: tanek temnejši rob
rob_zun = M & ~E02
rgb[rob_zun] = rgb[rob_zun] * 0.55 + np.array(BRAZDA, np.float32) * 0.45
zareza = razpoka & ~E02
alfa = M & ~zareza

# ---------------------------------------------------------------- možgansko deblo
slika = rgb
if DEBLO:
    gl = np.random.default_rng(9)
    fin = np.array(zamegli(Image.fromarray(gl.integers(0, 255, (N, N), dtype=np.uint8)), 0.00012)).astype(np.float32) / 255 - 0.5
    grob = np.array(zamegli(Image.fromarray(gl.integers(0, 255, (N, N), dtype=np.uint8)), 0.0011)).astype(np.float32) / 255 - 0.5
    sred = np.array(zamegli(Image.fromarray(gl.integers(0, 255, (N, N), dtype=np.uint8)), 0.00042)).astype(np.float32) / 255 - 0.5
    osnova = np.array((238, 224, 205), np.float32)
    deblo = np.zeros((N, N, 3), np.float32) + osnova

    def glob(m_im):
        """Približna globina pod robom maske (m): zameglitev roba."""
        g = np.array(zamegli(m_im, 0.0025)).astype(np.float32) / 255
        return np.clip((g - 0.5) * 2, 0, 1)

    kosi = []  # (maska, vrsta) za vrzeli med deli
    for ime, z in DEBLO:
        mi = maska([z]); mm = np.array(mi) > 127
        if not mm.any():
            continue
        yi, xi = np.nonzero(mm)
        pts = np.stack([X[yi, xi], Y[yi, xi]], 1); c = pts.mean(0)
        w, v = np.linalg.eigh(np.cov((pts - c).T))
        os_ = v[:, 1]; pr = v[:, 0]  # vzdolžna in prečna os dela
        if pr[0] > 0:
            pr = -pr  # prečna os kaže naprej (−x: ventralno)
        u = (X - c[0]) * os_[0] + (Y - c[1]) * os_[1]
        t = (X - c[0]) * pr[0] + (Y - c[1]) * pr[1]
        t_lo, t_hi = np.percentile(t[mm], 1), np.percentile(t[mm], 99)
        tv = (t - t_lo) / max(t_hi - t_lo, 1e-9)  # 0 dorzalno … 1 ventralno
        plast = np.zeros((N, N, 3), np.float32) + osnova
        # vzdolžni snopi vlaken: komaj vidne nepravilne proge vzdolž osi (pravilne proge so delovale kot shema) in
        # mehko marmoriranje (svež rez ni enakomeren)
        proge = (np.sin(t * 2 * math.pi / 0.00055 + grob * 14) * 0.5) * np.clip(0.5 + sred * 5, 0, 1) + fin
        plast *= (1 + 0.016 * proge + 0.07 * grob + 0.03 * sred)[..., None]
        if ime.startswith("Pons") and abs(ploscina(z)) > 1e-4:
            baz = np.clip((tv - 0.40) / 0.06, 0, 1)  # bazalni del mostu (ventralno)
            # prečna vlakna mostu v sredinskem rezu: prerezani snopi (svetli otočki) med sivimi jedri mostu
            otocki = sred * 7 + fin * 2 + 0.07 * np.sin(u * 2 * math.pi / 0.0019 + grob * 16)
            siva = np.clip(0.5 - otocki * 1.3, 0, 1) * baz
            plast = plast * (1 - 0.42 * siva[..., None]) + np.array((190, 150, 136), np.float32) * 0.42 * siva[..., None]
            # prečna vlakna bazalnega dela: valovite proge čez most (v sredinskem rezu prerezani snopi tečejo levo-desno)
            pv = (np.sin(u * 2 * math.pi / 0.0011 + grob * 10 + sred * 4) * 0.5 + 0.5) ** 3 * baz * np.clip(0.45 + sred * 4, 0, 1)
            plast *= (1 - 0.035 * pv)[..., None]
            teg = (1 - baz)
            plast = plast * (1 - 0.24 * teg[..., None]) + np.array((206, 178, 162), np.float32) * 0.24 * teg[..., None]
            meja = np.exp(-((tv - 0.40) / 0.012) ** 2)  # meja tegmentum | bazalni del (medialni lemnisk)
            plast *= (1 - 0.10 * meja)[..., None]
        elif ime.startswith("Midbrain"):
            if c[0] < 0.004:  # tegmentum in možganski krak
                gb = glob(mi)
                sn = np.exp(-((tv - 0.70) / 0.05) ** 2) * (np.abs(u) < 0.0065)  # črna substanca: temen pas pred krakom
                plast = plast * (1 - 0.34 * sn[..., None]) + np.array((120, 92, 86), np.float32) * 0.34 * sn[..., None]
                rj = np.exp(-(((u - 0.001) / 0.0026) ** 2 + ((tv - 0.42) / 0.16) ** 2) ** 1.6)  # rdeče jedro
                plast = plast * (1 - 0.5 * rj[..., None]) + np.array((208, 142, 132), np.float32) * 0.5 * rj[..., None]
                # sivina okoli akvedukta (akvedukt je vrzel med tegmentumom in tektumom, glej spodaj)
                pag = np.exp(-((tv - 0.08) / 0.09) ** 2)
                plast = plast * (1 - 0.30 * pag[..., None]) + np.array((200, 160, 148), np.float32) * 0.30 * pag[..., None]

            else:  # tektum: siva plast štirih gričkov
                plast = plast * 0.55 + np.array((206, 176, 160), np.float32) * 0.45
                plast *= (1 + 0.015 * np.sin(tv * 28 + grob * 8))[..., None]
        elif ime.startswith("Medulla"):
            pir = np.clip((tv - 0.74) / 0.08, 0, 1) if abs(ploscina(z)) > 1e-4 else 0  # piramida: bel snop ventralno
            if not isinstance(pir, int):
                plast = plast * (1 - 0.5 * pir[..., None]) + np.array((246, 238, 224), np.float32) * 0.5 * pir[..., None]
            if abs(ploscina(z)) > 1e-4:
                siv = np.exp(-((tv - 0.22) / 0.10) ** 2)  # siva možganovina ob dnu četrtega prekata in osrednjem kanalu
                plast = plast * (1 - 0.2 * siv[..., None]) + np.array((205, 172, 158), np.float32) * 0.2 * siv[..., None]
        elif "colliculus" in ime:
            plast = plast * 0.5 + np.array((204, 172, 156), np.float32) * 0.5
        # rob dela (pia): rahlo temnejši
        gb = glob(mi)
        plast *= (0.9 + 0.1 * np.clip(gb * 3, 0, 1))[..., None]
        deblo[mm] = plast[mm]
        kosi.append((mi, "tektum" if ime.startswith("Midbrain") and c[0] >= 0.004 else "tegmentum" if ime.startswith("Midbrain") else ime))
    # šivi med deli debla (most | podaljšana hrbtenjača | srednji možgani): v pravem rezu ni vrzeli. Ozke vrzeli (< 0,8 mm)
    # med deli zapolni barva sosednjih delov.
    zaprto = np.array(zamegli(m_deblo_im, 0.0004)) > 100
    # širše vrzeli (do ≈ 2,5 mm) med dvema deloma: med tektumom in tegmentumom je akvedukt (temen kanal), drugod tkivo
    blizu = [(np.array(zamegli(mi, 0.0012)) > 30, vr) for mi, vr in kosi]
    siroko = (np.array(zamegli(m_deblo_im, 0.0013)) > 90) & ~m_deblo & ~zaprto & ~M
    st = sum(b.astype(np.int32) for b, _ in blizu) if blizu else 0
    akv = siroko & (st >= 2) & np.any([b for b, vr in blizu if vr == "tektum"] or [np.zeros((N, N), bool)], 0) \
        & np.any([b for b, vr in blizu if vr == "tegmentum"] or [np.zeros((N, N), bool)], 0)
    zaprto = zaprto | (siroko & (st >= 2) & ~akv)
    vrz = zaprto & ~m_deblo
    if vrz.any():
        utez = np.array(zamegli(Image.fromarray((m_deblo * 255).astype(np.uint8)), 0.0006)).astype(np.float32) / 255
        vsota = np.stack([np.array(zamegli(Image.fromarray(np.clip(deblo[..., c] * m_deblo, 0, 255).astype(np.uint8)), 0.0006)).astype(np.float32) for c in range(3)], -1)
        deblo[vrz] = vsota[vrz] / np.maximum(utez[vrz][..., None], 1e-3)
        m_deblo = m_deblo | vrz
    # četrti prekat: šotorasta votlina med hrbtno stranjo debla in malimi možgani, vrh v fastigiju
    glavni = [z for _, z in DEBLO if abs(ploscina(z)) > 1e-4]
    hrbet = lambda y: max((q[0] for z in glavni for q in z if abs(q[1] - y) < 0.0015), default=None)
    veriga = [(hrbet(y) - 0.0004, y) for y in np.arange(F[1] + 0.0095, F[1] - 0.0155, -0.001) if hrbet(y) is not None]
    prekat = np.zeros((N, N), bool)
    if len(veriga) > 2:
        vrh_p = (F[0] + 0.0030, F[1])
        pim = Image.new("L", (N, N), 0)
        ImageDraw.Draw(pim).polygon([px(q) for q in veriga] + [px(vrh_p)], fill=255)
        prekat = (np.array(pim) > 127) & ~m_deblo & ~M
        gp = np.clip(np.array(zamegli(Image.fromarray((prekat * 255).astype(np.uint8)), 0.0016)).astype(np.float32) / 255, 0, 1)
        gp = np.clip((gp - 0.45) / 0.5, 0, 1)
        votlina = np.array((178, 122, 112), np.float32) * (1 - gp[..., None]) + np.array((122, 70, 66), np.float32) * gp[..., None]
        slika = np.where(prekat[..., None], votlina, slika)
        # jadri: tanki beli plošči od vrha prekata navzgor (velum medullare superius) in navzdol (inferius)
        jim = Image.new("L", (N, N), 0); jd = ImageDraw.Draw(jim)
        jd.line([px(vrh_p), px(veriga[0])], fill=255, width=max(2, int(0.00055 * k)))
        jd.line([px(vrh_p), px(veriga[-1])], fill=255, width=max(2, int(0.0004 * k)))
        jm = (np.array(jim) > 127) & ~m_deblo & ~M
        slika = np.where(jm[..., None], np.array((232, 214, 196), np.float32), slika)
        prekat = prekat | jm
    slika = np.where(m_deblo[..., None], deblo, slika)
    if akv.any():
        slika = np.where(akv[..., None], np.array((118, 68, 64), np.float32), slika)
    alfa = alfa | prekat | m_deblo | akv

im = Image.fromarray(np.clip(slika, 0, 255).astype(np.uint8), "RGB").filter(ImageFilter.GaussianBlur(0.5))
im.putalpha(Image.fromarray((alfa * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6)))
im.save(IZHOD, quality=90, method=6)
print(json.dumps({"lo": [round(lo[0], 5), round(lo[1], 5)], "mera": [round(mera, 5), round(mera, 5)], "jedro": [[round(v, 5) for v in A], [round(v, 5) for v in B]],
                  "reznjicev": len(prim), "podreznjicev": len(sek), "listov": len(ter)}))

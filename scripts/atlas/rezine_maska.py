# Maska izhoda za »Pravi prerez« (RAZL_IZHOD 3, docs/3d.md »Next bake«): iz maske telesa (rezine.py, korak 2) v izrezu in
# legi izhoda (po pomiku šivov) naredi masko, s katero se zapišejo slike 1 mm, mali volumen in ploščice:
#   1 šivi     rezine do ±8 mm od stika blokov (meta.sivi) dobijo rob kože iz preliva predznačenih razdalj mask 8 mm pred
#              stikom in za njim (stopnica kože na stegnih v frontalnem pogledu izgine); spremeni se samo pas ±6 mm ob koži
#   2 z        večina treh zaporednih rezin (stopničast rob podlakti v frontalni in sagitalni smeri)
#   3 dlani    roka (iz rezin nad stikom, kjer je ločena od trupa) se v vsaki prečni rezini loči od stegna: dva dela se
#              razraščata hkrati vsak iz svoje rezine zgoraj; kjer se stikata na črti, krajši od 15 mm, ju loči reža 2 mm
#              (stik, daljši od 15 mm: roka res leži na telesu, fotografija ostane cela, loči se le mali volumen in z njim
#              površje telesa)
# Samo numpy (teče v Blenderjevem Pythonu). Vrednosti maske: 0 zunaj, 1 telo, 2 reža med dlanjo in stegnom (zunaj),
# 3 meja roke in telesa ob dolgem stiku (na slikah telo, v malem volumnu prazno).
import numpy as np

PAS_SIVA = 8      # mm pred stikom in za njim
PAS_KOZE = 6      # mm ob koži, kjer se rob sme spremeniti
STIK_NAJVEC = 15  # mm: daljši stik dlani s stegnom se ne reže (roka res leži na stegnu)
ROKA_NAJMANJ = 1500  # mm² ločenega dela, ki šteje za roko ob začetku sledenja (podlaket ≈ 3000 mm², uho < 400)
ZACETEK = 0.12      # delež višine: roke iščemo šele pod glavo (ušesa niso roke)
SLEDENJE = 150      # rezin: krajše sledenje (npr. napačen začetek) se sme začeti znova
KONEC_ROK = 0.62    # delež višine od temena: niže prstov ni (roke ob telesu), sledenje se konča


def _premik(m, dy, dx, polni=False):
    out = np.full_like(m, polni)
    h, w = m.shape
    ys, yd = (slice(dy, h), slice(0, h - dy)) if dy >= 0 else (slice(0, h + dy), slice(-dy, h))
    xs, xd = (slice(dx, w), slice(0, w - dx)) if dx >= 0 else (slice(0, w + dx), slice(-dx, w))
    out[ys, xs] = m[yd, xd]
    return out


def razsiri(m, k=1):
    """Dilatacija s križem (4-sosednost), k-krat."""
    for _ in range(k):
        m = m | _premik(m, 1, 0) | _premik(m, -1, 0) | _premik(m, 0, 1) | _premik(m, 0, -1)
    return m


def skrci(m, k=1):
    for _ in range(k):
        m = m & _premik(m, 1, 0, True) & _premik(m, -1, 0, True) & _premik(m, 0, 1, True) & _premik(m, 0, -1, True)
    return m


def razdalja(m, k):
    """Predznačena razdalja do roba (4-sosednost, v mm), omejena na ±k: + notri, − zunaj."""
    d = np.zeros(m.shape, np.float32)
    a = m.copy()
    for i in range(k):
        a = skrci(a)
        d += a
    b = m.copy()
    for i in range(k):
        b = razsiri(b)
        d -= ~b
    return d + np.where(m, 0.5, -0.5)


def deli(m):
    """Povezani deli (4-sosednost) → (oznake int32, površine) brez scipy: razlitje z vrstičnimi nizi."""
    h, w = m.shape
    lab = np.zeros((h, w), np.int32)
    pov = [0]
    ostane = m.copy()
    while ostane.any():
        i0 = int(np.argmax(ostane))
        p = np.zeros_like(m); p.flat[i0] = True
        while True:
            n = razsiri(p) & m
            if n.sum() == p.sum():
                break
            p = n
        pov.append(int(p.sum()))
        lab[p] = len(pov) - 1
        ostane &= ~p
    return lab, np.array(pov)


def razrasti(a, b, m, korakov=60, meja_a=None):
    """Hkratna rast semen a (roka) in b (telo) po maski m; sporni piksli (oba hkrati) ostanejo b. meja_a: roka ne
    zraste čez to masko (dlan se med rezinama premakne za nekaj mm; brez meje bi se razlila v stegno). → (A, B)."""
    A, B = a & m, b & m & ~a
    for _ in range(korakov):
        na = razsiri(A) & m & ~A & ~B
        if meja_a is not None:
            na &= meja_a
        nb = razsiri(B) & m & ~A & ~B
        if not na.any() and not nb.any():
            break
        A |= na & ~nb
        B |= nb
    ost = m & ~A & ~B
    if ost.any():  # nedosegljivo iz semen (nov del): k telesu
        B |= ost
    return A, B


def stiki_sivov(stiki, Z, rob=10):
    """meta.sivi.stiki → seznam z stikov blokov (zgostitev na 12 mm), brez tistih ob koncih volumna."""
    zs = sorted({int(t[0]) for t in stiki if isinstance(t, (list, tuple)) and t and isinstance(t[0], (int, float))})
    sk = []
    for z in zs:
        if sk and z - sk[-1][-1] <= 12:
            sk[-1].append(z)
        else:
            sk.append([z])
    out = [int(round(sum(g) / len(g))) for g in sk]
    return [z for z in out if rob <= z < Z - rob]


def maska_izhoda(maska, Z, stiki, dnevnik=lambda s: None):
    """maska(q) → bool (H, W) maska telesa rezine q v izrezu in legi izhoda. → uint8 (Z, H, W): 0, 1, 2 (reža)."""
    prva = maska(0)
    H, W = prva.shape
    M = np.zeros((Z, H, W), np.uint8)
    for q in range(Z):
        M[q] = maska(q)
    # 1 šivi
    sivi = stiki_sivov(stiki, Z)
    for s in sivi:
        a, b = max(0, s - PAS_SIVA), min(Z - 1, s + PAS_SIVA)
        da, db = razdalja(M[a] > 0, PAS_KOZE + 2), razdalja(M[b] > 0, PAS_KOZE + 2)
        blizu = np.minimum(np.abs(da), np.abs(db)) < PAS_KOZE
        for q in range(a + 1, b):
            w = (q - a) / (b - a)
            M[q] = np.where(blizu, ((1 - w) * da + w * db) > 0, M[q] > 0)
    dnevnik(f"maska izhoda: {len(sivi)} stikov blokov zglajenih ({sivi[:10]})")
    # 2 večina treh rezin v smeri z (samo na robu; votline in notranjost ostanejo)
    prej = M[0].copy()
    for q in range(1, Z - 1):
        zdaj = M[q].copy()
        v = (prej > 0).astype(np.uint8) + (zdaj > 0) + (M[q + 1] > 0)
        M[q] = v >= 2
        prej = zdaj
    # 3 dlani
    roka = None; koncano = False; zac = 0; rezov = 0; dolgih = 0; z_rok = []
    xs = np.arange(W)[None, :]
    for q in range(Z):
        m = M[q] > 0
        if not m.any():
            continue
        if roka is None:
            if koncano or q < ZACETEK * Z or q > 0.45 * Z:
                continue
            lab, pov = deli(m)
            if len(pov) < 4:
                continue
            red = np.argsort(pov[1:])[::-1] + 1
            trup = red[0]
            tx = np.broadcast_to(xs, m.shape)[lab == trup]
            sred, sir = tx.mean(), tx.max() - tx.min()
            # roki: dva velika dela, eden na vsaki strani trupa (ne glava, uho ali stopalo)
            cx = {i: np.broadcast_to(xs, m.shape)[lab == i].mean() for i in red[1:3] if pov[i] >= ROKA_NAJMANJ}
            if len(cx) < 2 or not (min(cx.values()) < sred - 0.3 * sir and max(cx.values()) > sred + 0.3 * sir):
                continue
            roka = np.isin(lab, list(cx)); telo = lab == trup; zac = q; sred_trupa = sred
            continue
        A, B = razrasti(roka, skrci(telo, 1), m, meja_a=razsiri(roka, 3))   # roka brez erozije: ob dolgem stiku ne izgublja pikslov
        # roka ne sme zrasti v stegno: na vsaki strani največ 2 % (+20 mm²) več kot v prejšnji rezini, sicer le 1 mm okoli prejšnje
        for stran in (xs < sred_trupa, xs >= sred_trupa):
            st = np.broadcast_to(stran, A.shape)
            prej = roka & st
            if (A & st).sum() > 1.02 * int(prej.sum()) + 20:
                odvec = A & st & ~razsiri(prej, 1)
                A &= ~odvec; B |= odvec
        if A.sum() < 20 or q > KONEC_ROK * Z:
            koncano = q - zac >= SLEDENJE
            roka = None
            continue
        stik_a = A & razsiri(B)
        n = int(stik_a.sum())
        if n:
            reza = stik_a | (B & razsiri(A))
            if n <= STIK_NAJVEC:   # kratek stik: reža tudi na fotografiji (2)
                M[q][reza] = 2
                rezov += 1; z_rok.append(q)
            else:                  # roka res leži na telesu: fotografija ostane, ločita se le površje in mali volumen (3)
                M[q][reza] = 3
                dolgih += 1
        roka, telo = A, B
    dnevnik(f"maska izhoda: dlan ločena od stegna v {rezov} rezinah" + (f" (z {z_rok[0]}–{z_rok[-1]})" if z_rok else "")
            + f", dolg stik roke s telesom (samo površje) v {dolgih}")
    return M


def alfa_malega(M, k, mali):
    """Delež reže v celici malega volumna (mali mm) za rezine k·mali … : celica z režo je prazna (dlan v 4 mm ne zraste
    v stegno). → bool (H4, W4) celic, ki jih je treba izprazniti."""
    kos = M[k * mali:(k + 1) * mali] >= 2
    Hc, Wc = M.shape[1:]
    H4, W4 = -(-Hc // mali), -(-Wc // mali)
    b = np.zeros((mali, H4 * mali, W4 * mali), bool)
    b[:kos.shape[0], :Hc, :Wc] = kos
    return b.reshape(mali, H4, mali, W4, mali).any((0, 2, 4))

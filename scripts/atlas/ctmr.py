# CT in MR ob fotografiji v pogledu »Pravi prerez« (docs/3d.md »CT in MR«). Vir: NLM (ctmr_viri.json), isti pogoji kot
# pri fotografijah. Teče na strežniku (numpy, scipy, Pillow); vhod je obdelano telo fotografij (delo/konc.u8 in
# izhod/meta.json iz rezine.py), izhod gre v isto mapo telesa: ctmr.json, ct/…, mr/….
#
#   python3 ctmr.py prenos   <koren> <m|z>                    PNG iz NLM (nadaljuje po prekinitvi) + geometrija iz glav
#   python3 ctmr.py poravnaj <koren> <m|z> <delo> <izhod>       CT/MR → mm okvirja fotografij (delo/ctmr_poravnava.json)
#   python3 ctmr.py izdelaj  <koren> <m|z> <delo> <izhod>       slike za odjemalca + ctmr.json (+ kontrolne točke)
#   python3 ctmr.py vzorec   <delo> <izhod> <cilj> <z od> <z do>  mali CT za vzorec v repozitoriju (≤ 150 KB)
#
# Koordinate: kot fotografije (meta.json): x od desne proti levi strani telesa, y od spredaj nazaj, z od glave proti
# nogam, 1 mm, izrez meta.izrez. CT je pri moškem »zamrznjen« (posnet na zamrznjenem telesu tik pred rezanjem, iste
# številke rezin kot fotografije), zato je dovolj 2D podobnostna preslikava na rezino (premik, zasuk, merilo blizu 1);
# ocenimo jo na vsaki 4. rezini iz ujemanja obrisa telesa (zglajeni maski CT in fotografije, samo znotraj kroga
# rekonstrukcije CT) in zgladimo z drsečo mediano znotraj vsakega niza CT (niz = enaka vidno polje in serija v glavi),
# kot cevovod fotografij gladi stike blokov. MR glave je posnet na svežem telesu: vsaka rezina se poravna sama (premik,
# zasuk, merilo), z se preveri v ±6 mm.
#
# Zapis slik: ena slika na rezino, siva vrednost = HU, stisnjen po odsekih (KODA: −1024…−200 → 0…80, −200…300 → 80…205,
# 300…2000 → 205…255), lossy WebP q92, alfa = telo. Okno (mehka tkiva, pljuča, kosti) uporabi odjemalec s tabelo 256
# vrednosti (public/3d/rezine-ctmr.js): pol manj prostora kot tri predizračunane slike, menjava okna brez omrežja,
# napaka v oknu mehkih tkiv enaka kot pri predizračunani sliki q80 (meritev v docs/3d.md).
import json, os, re, subprocess, shutil, sys, time
from concurrent.futures import ThreadPoolExecutor
import numpy as np
from PIL import Image
from scipy import ndimage as nd, optimize as op

TU = os.path.dirname(os.path.abspath(__file__))
KODA_HU = [-1024, -200, 300, 2000]
KODA_V = [0, 80, 205, 255]
OKNA = {"mehka": [40, 400], "pljuca": [-600, 1500], "kosti": [500, 2000]}  # [središče, širina] v HU
KORAK = 4
KAKOVOST = 92


def viri():
    with open(os.path.join(TU, "ctmr_viri.json"), encoding="utf-8") as f:
        return json.load(f)


def koda(hu):
    return np.round(np.interp(hu, KODA_HU, KODA_V)).astype(np.uint8)


# ---------------------------------------------------------------- prenos
def _beri(url):
    return subprocess.run(["curl", "-sS", "-L", "--fail", "--retry", "5", "-m", "180", url], capture_output=True, check=True).stdout.decode("utf-8", "replace")


def _seznam(url, vzorec):
    html = _beri(url + "index.html")
    return [(m.group(1), int(m.group(2))) for m in re.finditer(r"href='(" + vzorec + r")'>[^<]*</a></td><td class='size'>(\d+)<", html)]


def _vzemi(url, pot, vel):
    if os.path.exists(pot) and os.path.getsize(pot) == vel:
        return
    for _ in range(4):
        subprocess.run(["curl", "-sS", "-L", "--retry", "5", "-m", "300", "-C", "-", "-o", pot, url], capture_output=True)
        if os.path.exists(pot) and os.path.getsize(pot) == vel:
            return
        if os.path.exists(pot) and os.path.getsize(pot) > vel:
            os.remove(pot)
    raise RuntimeError(f"prenos ni uspel: {url}")


GEOM = {"fov": "Display Field of view - X (mm)", "lok": "Image location", "cr": "Center R coord of plane image",
        "ca": "Center A coord of plane image", "serija": "Series Number", "debelina": "Slice Thickness (mm)"}


def _geometrija(besedilo):
    """Samo geometrijska polja iz glave GE (polj o osebi ne beremo in ne shranimo)."""
    out = {}
    for k, ime in GEOM.items():
        m = re.search(re.escape(ime) + r"\.*:\s*([-\d.]+)", besedilo)
        out[k] = float(m.group(1)) if m else None
    return out


def prenos(koren, spol):
    v = viri(); t = v["telesa"][spol]
    for vrsta in ("ct", "mr"):
        if vrsta not in t:
            continue
        d = t[vrsta]; mapa = os.path.join(koren, f"{spol}-{vrsta}"); os.makedirs(mapa, exist_ok=True)
        sez = _seznam(v["osnova"] + d["mapa"], d["vzorec"])
        with ThreadPoolExecutor(6) as ex:
            list(ex.map(lambda s: _vzemi(v["osnova"] + d["mapa"] + s[0], os.path.join(mapa, s[0]), s[1]), sez))
        geo = {}
        def glava(ime):
            m = re.match(d["vzorec"], ime); n = m.group(1)
            sek = v["sekvence"][m.group(2)] if vrsta == "mr" else ""
            g = d["glava"].format(n=n, s=sek)
            try:
                geo[ime] = _geometrija(_beri(v["osnova"] + d["glave"] + g))
            except subprocess.CalledProcessError:
                geo[ime] = None
        with ThreadPoolExecutor(6) as ex:
            list(ex.map(glava, [s[0] for s in sez]))
        json.dump(geo, open(os.path.join(koren, f"{spol}-{vrsta}.json"), "w"), indent=0)
        print(vrsta, len(sez), "datotek", sum(s[1] for s in sez) // 2**20, "MB", flush=True)


# ---------------------------------------------------------------- poravnava
class Telo:
    def __init__(self, delo, izhod):
        self.meta = json.load(open(os.path.join(izhod, "meta.json"), encoding="utf-8"))
        self.W, self.H, self.Z = self.meta["dim"]
        self.konc = np.memmap(os.path.join(delo, "konc.u8"), np.uint8, "r", shape=(self.Z, self.H, self.W, 4))

    def maska(self, z):
        return np.asarray(self.konc[z][..., 3]) > 128

    def svetlost(self, z):
        c = np.asarray(self.konc[z][..., :3], np.float32)
        return 0.3 * c[..., 0] + 0.59 * c[..., 1] + 0.11 * c[..., 2]


def preslikaj(img, par, px, oblika, red=1, cval=0.0, sredisce=None):
    """Slika CT/MR (vrstica v, stolpec u) → mreža okvirja 1 mm (y, x). par = (tx, ty, zasuk, merilo): mm okvirja, kamor
    pade središče slike; px = mm na piksel po glavi."""
    tx, ty, th, s = par
    c, si = np.cos(th), np.sin(th); p = px * s
    cv, cu = sredisce if sredisce else ((img.shape[0] - 1) / 2, (img.shape[1] - 1) / 2)
    mat = np.array([[c / p, si / p], [-si / p, c / p]])
    off = np.array([cv, cu]) - mat @ np.array([ty, tx])
    return nd.affine_transform(img, mat, off, output_shape=oblika, order=red, cval=cval)


def maska_ct(hu):
    m = nd.binary_opening(hu > -500, iterations=2)
    lab, k = nd.label(m)
    if k:
        vel = nd.sum(m, lab, range(1, k + 1))
        m = np.isin(lab, [i + 1 for i, s in enumerate(vel) if s > 200])
    return nd.binary_fill_holes(m)


def maska_mr(a):
    if a.max() <= 0:
        return a > 0
    prag = max(3.0, np.percentile(a, 99) * 0.12)  # šum ozadja MR je pozitiven: prag glede na svetlo tkivo
    m = nd.binary_opening(nd.gaussian_filter(a, 1.0) > prag, iterations=1)
    lab, k = nd.label(m)
    if k:
        vel = nd.sum(m, lab, range(1, k + 1)); m = lab == (int(np.argmax(vel)) + 1)
    return nd.binary_fill_holes(nd.binary_closing(m, iterations=3))


def krog(n, r):
    yy, xx = np.mgrid[:n, :n]
    return (((yy - (n - 1) / 2) ** 2 + (xx - (n - 1) / 2) ** 2) < r * r).astype(np.float32)


def _ujemanje(par, cm, pm, fm, px, oblika):
    if not 0.85 < par[3] < 1.15:  # merilo je iz glave znano do nekaj %: brez tega se maska MR skrči v točko
        return 0.0
    a = preslikaj(cm, par, px, oblika)
    f = preslikaj(fm, par, px, oblika) > 0.5 if fm is not None else np.ones(oblika, bool)
    return -float(np.sum(a * pm * f) / np.sqrt(np.sum(a * a * f) * np.sum(pm * pm * f) + 1e-6))


def poravnaj_rezino(cm, pm, fm, px, oblika, zacetek=None):
    if zacetek is None:
        cy, cx = nd.center_of_mass(cm > 0.5); py, pxx = nd.center_of_mass(pm > 0.5)
        sv, su = (cm.shape[0] - 1) / 2, (cm.shape[1] - 1) / 2
        zacetki = [[pxx - (cx - su) * px, py - (cy - sv) * px, th, 1.0] for th in (-0.05, 0.0, 0.05)]
    else:
        zacetki = [list(zacetek)]
    best = None
    for x0 in zacetki:
        r = op.minimize(_ujemanje, x0, args=(cm, pm, fm, px, oblika), method="Nelder-Mead", options=dict(xatol=0.03, fatol=1e-5, maxiter=400))
        if best is None or r.fun < best.fun:
            best = r
    return [float(x) for x in best.x], -float(best.fun)


def _ct_slika(mapa, ime):
    return np.asarray(Image.open(os.path.join(mapa, ime)), np.float32) - 1024.0


def nizi_ct(geo, imena):
    """Zaporedni nizi rezin z enako geometrijo (vidno polje, središče, serija)."""
    nizi, prej = [], None
    for ime in imena:
        g = geo.get(ime) or {}
        k = (g.get("fov"), g.get("cr"), g.get("ca"), g.get("serija"))
        if k != prej:
            nizi.append([]); prej = k
        nizi[-1].append(ime)
    return nizi


def poravnaj(koren, spol, delo, izhod):
    v = viri(); t = v["telesa"][spol]; T = Telo(delo, izhod); oblika = (T.H, T.W); od = T.meta["od"]
    rez = {"ct": {}, "mr": {}}
    samo_mr = os.environ.get("CTMR_SAMO_MR") == "1"  # CT iz prejšnje poravnave ostane
    if samo_mr:
        rez["ct"] = json.load(open(os.path.join(delo, "ctmr_poravnava.json")))["ct"]
    d = t["ct"]; mapa = os.path.join(koren, f"{spol}-ct"); geo = json.load(open(os.path.join(koren, f"{spol}-ct.json")))
    imena = sorted(geo, key=lambda s: int(re.match(d["vzorec"], s).group(1)))
    imena = [s for s in imena if 0 <= int(re.match(d["vzorec"], s).group(1)) - od < T.Z]
    fm = krog(d["px"], d["px"] / 2 - 6)
    nizi = [] if samo_mr else nizi_ct(geo, imena)
    for ni, niz in enumerate(nizi):
        vzorci, prej = [], None
        izbor = niz[::KORAK] + ([niz[-1]] if (len(niz) - 1) % KORAK else [])
        for ime in izbor:
            n = int(re.match(d["vzorec"], ime).group(1)); z = n - od
            hu = _ct_slika(mapa, ime); px = geo[ime]["fov"] / d["px"]
            cm = nd.gaussian_filter(maska_ct(hu).astype(np.float32), 2)
            pm = nd.gaussian_filter(T.maska(z).astype(np.float32), 2)
            if pm.sum() < 200 or cm.sum() < 200:
                continue
            par, uj = poravnaj_rezino(cm, pm, fm, px, oblika, prej)
            if prej is not None and uj < 0.97:  # začetek iz prejšnje rezine je zgrešil: znova od težišča
                p2, u2 = poravnaj_rezino(cm, pm, fm, px, oblika)
                if u2 > uj:
                    par, uj = p2, u2
            prej = par
            vzorci.append([z, *par, uj])
            print(f"ct niz {ni} z {z} {np.round(par, 3).tolist()} {uj:.4f}", flush=True)
        rez["ct"][str(ni)] = {"rezine": [int(re.match(d["vzorec"], s).group(1)) - od for s in niz], "px": geo[niz[0]]["fov"] / d["px"], "vzorci": vzorci}
    # MR glave: vsaka rezina posebej, z v ±6 mm
    if "mr" in t and os.path.isdir(os.path.join(koren, f"{spol}-mr")):
        d = t["mr"]; mapa = os.path.join(koren, f"{spol}-mr"); geo = json.load(open(os.path.join(koren, f"{spol}-mr.json")))
        po_n = {}
        for ime in geo:
            m = re.match(d["vzorec"], ime)
            po_n.setdefault(int(m.group(1)), {})[v["sekvence"][m.group(2)]] = ime
        fm = None  # MR: ujemanje po celem okvirju (maska MR je cela glava)
        for n in sorted(po_n):
            ime = po_n[n].get("t1") or next(iter(po_n[n].values()))
            a = np.asarray(Image.open(os.path.join(mapa, ime)), np.float32); px = geo[ime]["fov"] / d["px"]
            cm = nd.gaussian_filter(maska_mr(a).astype(np.float32), 2)
            best = None
            for dz in range(-6, 7, 2):
                z = n - od + dz
                if not 0 <= z < T.Z:
                    continue
                pm = nd.gaussian_filter(T.maska(z).astype(np.float32), 2)
                # samo glava: pas ±60 mm okoli težišča maske MR po y ni potreben, maska MR je le glava; fotografija pod
                # vratom ima še ramena, zato ujemanje računamo le v okolici preslikane maske MR
                par, uj = poravnaj_rezino(cm, pm, fm, px, oblika)
                if best is None or uj > best[2]:
                    best = (dz, par, uj)
            rez["mr"][str(n - od)] = {"dz": best[0], "par": best[1], "uj": best[2], "px": px, "datoteke": po_n[n]}
            print(f"mr z {n - od} dz {best[0]} {np.round(best[1], 3).tolist()} {best[2]:.4f}", flush=True)
    json.dump(rez, open(os.path.join(delo, "ctmr_poravnava.json"), "w"), indent=0)


def zgladi(vzorci, rezine, okno=7):
    """Drseča mediana parametrov po vzorcih niza, nato linearno na vsako rezino."""
    a = np.array(vzorci, float)
    if len(a) == 0:
        return {}
    zs = a[:, 0]; par = a[:, 1:5].copy(); g = par.copy()
    for k in range(len(a)):
        lo, hi = max(0, k - okno // 2), min(len(a), k + okno // 2 + 1)
        g[k] = np.median(par[lo:hi], 0)
    return {z: [float(np.interp(z, zs, g[:, j])) for j in range(4)] for z in rezine}


# ---------------------------------------------------------------- izdelava
def _shrani(rgba, pot, q=KAKOVOST):
    os.makedirs(os.path.dirname(pot), exist_ok=True)
    Image.fromarray(rgba, "RGBA").save(pot, quality=q, method=6, exact=True)


def _rgba(kodirano, alfa):
    return np.dstack([kodirano, kodirano, kodirano, alfa])


def list_malega(vol, alfa, mm, cilj, q=85):
    """Mali volumen (mm) kot en list prečnih rezin (kot mali.webp fotografij): RGB = koda HU, A = delež telesa."""
    Z, H, W = vol.shape
    Z2, H2, W2 = -(-Z // mm), -(-H // mm), -(-W // mm)  # navzgor, kot mali.webp fotografij (enake mere rezin)
    pad = ((0, Z2 * mm - Z), (0, H2 * mm - H), (0, W2 * mm - W))
    hu = np.pad(np.asarray(vol, np.float32), pad, constant_values=-1024).reshape(Z2, mm, H2, mm, W2, mm)
    al = np.pad(np.asarray(alfa, np.float32), pad).reshape(Z2, mm, H2, mm, W2, mm) / 255
    sa = al.sum((1, 3, 5)); m = (hu * al).sum((1, 3, 5)) / np.maximum(sa, 1e-3)
    m[sa < 1e-3] = -1024
    k = koda(m); a = np.clip(sa / mm ** 3 * 255 + 0.5, 0, 255).astype(np.uint8)
    stolp = max(1, 2048 // W2); vrst = -(-Z2 // stolp)
    lst = np.zeros((vrst * H2, stolp * W2, 4), np.uint8)
    for z in range(Z2):
        r, c = divmod(z, stolp)
        lst[r * H2:(r + 1) * H2, c * W2:(c + 1) * W2] = _rgba(k[z], a[z])
    _shrani(lst, cilj, q)
    return {"mm": mm, "dim": [W2, H2, Z2], "stolpcev": stolp, "datoteka": os.path.relpath(cilj, os.path.dirname(os.path.dirname(cilj))).replace(os.sep, "/")}


def kontrola_vretenc(T, izhod, hu_vol, z0, z1):
    """Kontrolne točke: vretenca. Mesto vretenca da mreža oznak HRA (samo okolica 64 × 64 mm); v njej poiščemo premik
    (±12 mm), pri katerem se robovi CT (okno mehkih tkiv) najbolj ujemajo z robovi fotografije (svetlost). Premik ≈ 0
    pomeni, da je CT na fotografiji. Vrne [[ime, z, dx, dy, ujemanje]] v mm (dx, dy: kam bi bilo treba premakniti CT)."""
    o = T.meta.get("oznake")
    if not o:
        return []
    W, H, Zo = o["dim"]; mm = o["mm"]
    pari = np.frombuffer(open(os.path.join(izhod, o["datoteka"]), "rb").read(), "<u2").reshape(-1, 2)
    ozn = np.repeat(pari[:, 1], pari[:, 0])[:W * H * Zo].reshape(Zo, H, W)
    out, R, P = [], 12, 32
    def robovi(x):
        g = np.hypot(nd.sobel(x, 0), nd.sobel(x, 1))
        return (g - g.mean()) / (g.std() + 1e-6)
    for k, ime in enumerate(o["kljuci"]):
        if "vretence-" not in ime:
            continue
        zz = np.where((ozn == k + 1).any((1, 2)))[0]
        if len(zz) == 0:
            continue
        zm = int(np.median(zz)); z = zm * mm + mm // 2
        if not z0 <= z < z1 or (ozn[zm] == k + 1).sum() < 4:
            continue
        cy, cx = nd.center_of_mass(ozn[zm] == k + 1); cy, cx = int((cy + 0.5) * mm), int((cx + 0.5) * mm)
        y0, x0 = cy - P - R, cx - P - R
        if y0 < 0 or x0 < 0 or cy + P + R > T.H or cx + P + R > T.W:
            continue
        ct = np.clip((hu_vol[z].astype(np.float32) + 160) / 400, 0, 1)
        fo = T.svetlost(z) / 255
        a = robovi(nd.gaussian_filter(ct, 1.0))[y0:y0 + 2 * (P + R), x0:x0 + 2 * (P + R)]
        b = robovi(nd.gaussian_filter(fo, 1.0))[cy - P:cy + P, cx - P:cx + P]
        best = None
        for dy in range(-R, R + 1):
            for dx in range(-R, R + 1):
                c = float(np.mean(a[R - dy:R - dy + 2 * P, R - dx:R - dx + 2 * P] * b))
                if best is None or c > best[0]:
                    best = (c, dx, dy)
        out.append([ime, z, best[1], best[2], round(best[0], 3)])
    return out


def izdelaj(koren, spol, delo, izhod):
    v = viri(); t = v["telesa"][spol]; T = Telo(delo, izhod); oblika = (T.H, T.W); od = T.meta["od"]
    por = json.load(open(os.path.join(delo, "ctmr_poravnava.json")))
    d = t["ct"]; mapa = os.path.join(koren, f"{spol}-ct")
    imena = {int(re.match(d["vzorec"], s).group(1)) - od: s for s in os.listdir(mapa) if re.match(d["vzorec"], s)}
    vol = np.lib.format.open_memmap(os.path.join(delo, "ct_hu.npy"), "w+", np.int16, (T.Z, T.H, T.W))
    alf = np.lib.format.open_memmap(os.path.join(delo, "ct_alfa.npy"), "w+", np.uint8, (T.Z, T.H, T.W))
    vol[:] = -1024; alf[:] = 0
    fm = krog(d["px"], d["px"] / 2 - 4)
    pokrite = []
    for niz in por["ct"].values():
        pars = zgladi(niz["vzorci"], niz["rezine"])
        for z, par in pars.items():
            if z not in imena:
                continue
            hu = _ct_slika(mapa, imena[z])
            m = maska_ct(hu).astype(np.float32) * fm
            vol[z] = np.round(preslikaj(nd.gaussian_filter(hu, 0.6), par, niz["px"], oblika, 1, -1024.0)).astype(np.int16)
            # alfa = telo na CT in ob telesu na fotografiji (≤ 8 mm): brez mize, oznak in predmetov ob bloku
            alf[z] = ((preslikaj(m, par, niz["px"], oblika, 1) > 0.5) & nd.binary_dilation(T.maska(z), iterations=8)) * 255
            pokrite.append(z)
    z0, z1 = min(pokrite), max(pokrite) + 1
    ct_izh = os.path.join(izhod, "ct")
    with ThreadPoolExecutor(2) as ex:
        list(ex.map(lambda z: _shrani(_rgba(koda(vol[z]), alf[z]), os.path.join(ct_izh, "a", f"{z}.webp")), pokrite))
        list(ex.map(lambda y: _shrani(_rgba(koda(vol[:, y]), alf[:, y]), os.path.join(ct_izh, "k", f"{y}.webp")), range(T.H)))
        list(ex.map(lambda x: _shrani(_rgba(koda(vol[:, :, x]), alf[:, :, x]), os.path.join(ct_izh, "s", f"{x}.webp")), range(T.W)))
    mali = list_malega(vol, alf, T.meta["mali"]["mm"], os.path.join(ct_izh, "mali.webp"))
    # kontrola: obris telesa (Dice CT ↔ fotografija v krogu CT) vsakih 50 mm in vretenca
    dice = []
    for z in range(z0, z1, 50):
        a = alf[z] > 0; b = T.maska(z) & (preslikaj(fm, [0, 0, 0, 1], 1, oblika) >= 0)
        b = b & nd.binary_dilation(a, iterations=40)  # roke zunaj vidnega polja CT ne štejejo
        if a.sum() > 500:
            dice.append([z, round(float(2 * (a & b).sum() / (a.sum() + b.sum())), 3)])
    vr = kontrola_vretenc(T, izhod, vol, z0, z1)
    ctmr = {"navedba": v["navedba"], "pogoji": v["pogoji"], "ustvarjeno": time.strftime("%Y-%m-%d"),
            "ct": {"vrsta": d["vrsta"], "mm": 1, "od": int(z0), "do": int(z1 - 1), "ravnine": ["a", "k", "s"], "mapa": "ct/",
                   "koda": {"hu": KODA_HU, "v": KODA_V}, "okna": OKNA, "mali": mali,
                   "kontrola": {"dice": dice, "vretenca": vr}}}
    # MR glave (samo prečno): ena slika na rezino in sekvenco, normalizirana po sekvenci (1.–99,5. percentil v glavi)
    if por.get("mr"):
        d = t["mr"]; mapa = os.path.join(koren, f"{spol}-mr")
        zz = sorted(int(z) for z in por["mr"])
        # premik po z in parametri zglajeni po rezinah (glava je toga)
        arr = np.array([[z, por["mr"][str(z)]["dz"], *por["mr"][str(z)]["par"]] for z in zz], float)
        g = arr.copy()
        for k in range(len(arr)):
            lo, hi = max(0, k - 2), min(len(arr), k + 3); g[k, 1:] = np.median(arr[lo:hi, 1:], 0)
        dz = int(round(float(np.median(arr[:, 1]))))
        sek = {}
        for s in ("t1", "t2", "pd"):
            slike = {}
            for k, z in enumerate(zz):
                ime = por["mr"][str(z)]["datoteke"].get(s)
                if not ime:
                    continue
                a = np.asarray(Image.open(os.path.join(mapa, ime)), np.float32)
                slike[z] = (a, maska_mr(a))
            if not slike:
                continue
            vse = np.concatenate([a[m] for a, m in slike.values() if m.any()])
            lo, hi = np.percentile(vse, [1, 99.5])
            zapisane = []
            for k, z in enumerate(zz):
                if z not in slike:
                    continue
                a, m = slike[z]; par = list(g[k, 2:6]); px = por["mr"][str(z)]["px"]
                sv = np.clip((preslikaj(a, par, px, oblika, 1) - lo) / (hi - lo), 0, 1)
                al = (preslikaj(m.astype(np.float32), par, px, oblika, 1) > 0.5) * 255
                c = (sv ** 0.9 * 255 + 0.5).astype(np.uint8)
                zc = z + dz
                if 0 <= zc < T.Z:
                    _shrani(np.dstack([c, c, c, al.astype(np.uint8)]), os.path.join(izhod, "mr", s, f"{zc}.webp"), 90)
                    zapisane.append(zc)
            sek[s] = zapisane
        if sek:
            prve = next(iter(sek.values()))
            ctmr["mr"] = {"ravnine": ["a"], "mapa": "mr/", "debelina": d["debelina_mm"], "sekvence": list(sek), "rezine": prve, "dz": dz}
    json.dump(ctmr, open(os.path.join(izhod, "ctmr.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    vel = sum(os.path.getsize(os.path.join(r, f)) for p in ("ct", "mr") for r, _, fs in os.walk(os.path.join(izhod, p)) for f in fs)
    print("ctmr:", len(pokrite), "rezin CT", "MR" if "mr" in ctmr else "brez MR", f"{vel / 2**20:.1f} MB", "dice", dice[:3], "vretenc", len(vr), flush=True)


def kontrola(delo, izhod, _=None):
    """Samo kontrolne točke vretenc znova (po spremembi metode), brez nove izdelave slik."""
    T = Telo(delo, izhod); c = json.load(open(os.path.join(izhod, "ctmr.json"), encoding="utf-8"))
    vol = np.load(os.path.join(delo, "ct_hu.npy"), mmap_mode="r")
    c["ct"]["kontrola"]["vretenca"] = kontrola_vretenc(T, izhod, vol, c["ct"]["od"], c["ct"]["do"] + 1)
    json.dump(c, open(os.path.join(izhod, "ctmr.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    for x in c["ct"]["kontrola"]["vretenca"]:
        print(*x)


# ---------------------------------------------------------------- vzorec za repozitorij
def vzorec(delo, izhod, cilj, za, zb):
    """Mali CT (2 mm) za vzorec v repozitoriju; izrez enak kot rezine_vzorec.py (po alfi fotografij)."""
    meta = json.load(open(os.path.join(izhod, "meta.json"), encoding="utf-8")); Wc, Hc, Z = meta["dim"]
    konc = np.memmap(os.path.join(delo, "konc.u8"), np.uint8, "r", shape=(Z, Hc, Wc, 4))
    kos = np.asarray(konc[za:zb, :, :, 3])
    ys = np.where(kos.any((0, 2)))[0]; xs = np.where(kos.any((0, 1)))[0]
    y0, y1, x0, x1 = (ys[0] // 4) * 4, -(-(ys[-1] + 1) // 4) * 4, (xs[0] // 4) * 4, -(-(xs[-1] + 1) // 4) * 4
    k = 2; Zs = (zb - za) // k * k
    vol = np.load(os.path.join(delo, "ct_hu.npy"), mmap_mode="r")[za:za + Zs, y0:min(y1, Hc), x0:min(x1, Wc)]
    alf = np.load(os.path.join(delo, "ct_alfa.npy"), mmap_mode="r")[za:za + Zs, y0:min(y1, Hc), x0:min(x1, Wc)]
    Hs, Ws = vol.shape[1] // k * k, vol.shape[2] // k * k
    os.makedirs(os.path.join(cilj, "ct"), exist_ok=True)
    mali = list_malega(np.asarray(vol[:, :Hs, :Ws]), np.asarray(alf[:, :Hs, :Ws]), k, os.path.join(cilj, "ct", "mali.webp"), int(os.environ.get("VZOREC_Q", "80")))
    polno = json.load(open(os.path.join(izhod, "ctmr.json"), encoding="utf-8"))
    c = polno["ct"]
    vr = [[i, z - za, *r] for i, z, *r in c["kontrola"]["vretenca"] if za <= z < za + Zs]
    di = [[z - za, d] for z, d in c["kontrola"]["dice"] if za <= z < za + Zs]
    out = {kk: polno[kk] for kk in ("navedba", "pogoji", "ustvarjeno")}
    out["ct"] = {"vrsta": c["vrsta"], "mm": 1, "od": 0, "do": Zs - 1, "ravnine": ["a"], "mapa": "ct/", "koda": c["koda"], "okna": c["okna"],
                 "mali": mali, "kontrola": {"dice": di, "vretenca": vr, "telo": {"vretenca": len(c["kontrola"]["vretenca"]), "dice": c["kontrola"]["dice"], "seznam": c["kontrola"]["vretenca"]}}}
    json.dump(out, open(os.path.join(cilj, "ctmr.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(cilj, mali, os.path.getsize(os.path.join(cilj, "ct", "mali.webp")))


if __name__ == "__main__":
    a = sys.argv[1:]
    if not a:
        sys.exit(__doc__ or "glej glavo datoteke")
    {"kontrola": lambda: kontrola(*a[1:4]), "prenos": lambda: prenos(a[1], a[2]), "poravnaj": lambda: poravnaj(*a[1:5]), "izdelaj": lambda: izdelaj(*a[1:5]),
     "vzorec": lambda: vzorec(a[1], a[2], a[3], int(a[4]), int(a[5]))}[a[0]]()

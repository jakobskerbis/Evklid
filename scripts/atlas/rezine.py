# Barvne kriorezine (vir: rezine_viri.json; Courtesy of the U.S. National Library of Medicine) → podatki za pogled
# »Pravi prerez« (public/3d/rezine.js). Teče v Blenderju (branje PNG, pisanje WebP; numpy je v njegovem Pythonu):
#   blender -b --factory-startup --python rezine.py -- --vhod <png> --delo <mapa> --izhod <mapa> --spol m|z --od N --do N [--podrobno]
# ali na strežniku s Pillow (python3 rezine.py --vhod …). Zažene ga rezine_prenos.py. Ponovni zagon nadaljuje.
# Osi volumna: x = od desne proti levi strani telesa, y = od spredaj nazaj, z = od glave proti nogam; 1 voksel = 1 mm.
# Koraki:
#   1 pregled   vsaka rezina: modri gel (maska po barvi), povprečenje na 1 mm samo po ne-modrih pikslih (brez modrega
#               roba) → delo/vol.u8 (Z, H, W, RGBA; A = delež ne-modrega) in sličice 3 mm za izravnavo barv
#   2 maska     telo = toplo obarvana jedra, razlita po ne-modrem in ne-črnem, če jih obdaja modri gel (listek in
#               sivinsko lestvico obdaja črn okvir); drobni deli (prsti) prek sosednje rezine; izpadle rezine po
#               sosednji, rezine brez podatkov s prelivom sosednjih; izrez na okvir telesa
#   3 barve     razlika med zaporednima rezinama na skupnih celicah (mediana log razmerja) → nihanje osvetlitve okoli
#               drsečega povprečja se odstrani (ojačanje na rezino in kanal)
#   3b šivi     stiki blokov (rezine_sivi.py): pomik rezin za stikom, motne/okrnjene rezine nadomesti preliv sosednjih,
#               skok osvetlitve se izravna krajevno v prekrivnem pasu ±30 mm (polje celic 12 mm, ne cel blok)
#   4 izhod     a/<z>.webp, k/<y>.webp (frontalno), s/<x>.webp (sagitalno) na 1 mm, mali.webp (volumen 4 mm kot
#               list prečnih rezin), predogled.webp, meta.json
#   5 podrobno  (--podrobno) ploščice 512 px v polni ločljivosti 0,33 mm (raven 0) in 0,66 mm (raven 1, 256 px):
#               p/a/<raven>/<z>_<ty>_<tx>.webp; pri rezinah na 0,33 mm (ženska) tudi p/k/… in p/s/… po pasovih 512 rezin
import json, os, sys, time

sys.dont_write_bytecode = True
for _s in (sys.stdout, sys.stderr):  # Windows: izpis v UTF-8 (cp1252 bi se ustavil ob »č«)
    try:
        _s.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass
import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import rezine_sivi as SV  # noqa: E402
import rezine_maska as RM  # noqa: E402

try:
    import bpy
except ImportError:
    bpy = None

TU = os.path.dirname(os.path.abspath(__file__))
T = 512      # ploščica
RAZL = 7     # različica maske in izhoda: ob spremembi se koraki od maske naprej ponovijo (pregled rezin ostane)
RAZL_IZHOD = 3   # različica izhoda (2: šivi med bloki; 3: maska izhoda – ločene dlani, rob kože čez stike, z-glajenje):
#                 ob spremembi se ponovita izhod in podrobno, maska ostane (šivi ostanejo od različice 2 naprej)
MALI = 4     # mm voksla malega volumna
ROB = 6      # mm roba okoli telesa


def beri(pot):
    """PNG → uint8 (H, W, 3), prva vrstica zgoraj."""
    if bpy:
        im = bpy.data.images.load(pot, check_existing=False)
        try:
            w, h = im.size; k = im.channels
            a = np.empty(w * h * k, np.float32); im.pixels.foreach_get(a)
        finally:
            bpy.data.images.remove(im)
        return (a.reshape(h, w, k)[::-1, :, :3] * 255 + 0.5).astype(np.uint8)
    from PIL import Image
    return np.asarray(Image.open(pot).convert("RGB"))


_slike = {}


def pisi(a, pot, q=85):
    """uint8 (H, W, 4) → WebP z alfo (izgubno RGB, alfa brez izgub)."""
    if bpy:
        h, w = a.shape[:2]
        im = _slike.get((w, h))
        if im is None:
            if len(_slike) > 40:
                for s in _slike.values():
                    bpy.data.images.remove(s)
                _slike.clear()
            im = _slike[(w, h)] = bpy.data.images.new(f"r{w}x{h}", w, h, alpha=True)
            im.alpha_mode = "STRAIGHT"; im.file_format = "WEBP"
        im.pixels.foreach_set((a[::-1].astype(np.float32) * (1 / 255)).ravel())
        im.filepath_raw = pot
        im.save(quality=q)
        return
    from PIL import Image
    Image.fromarray(a, "RGBA").save(pot, "WEBP", quality=q, method=4, exact=False)


def robovi(n_mm, px_mm, n_px):
    """Meje pikslov celic po 1 mm (celica i = piksli [e[i], e[i+1]))."""
    e = np.rint(np.arange(n_mm + 1) / px_mm).astype(np.int64)
    assert e[-1] <= n_px
    return e


def je_modro(f):
    """Modri gel po barvi (float32 H, W, 3): modra prevladuje nad rdečo in ni manjša od zelene."""
    r, g, b = f[..., 0], f[..., 1], f[..., 2]
    return ((b > r + 12) & (b > 0.8 * g)) | ((b > r + 5) & (b > g) & (b > 60))   # tudi svetel moder odsev gela v žilah


def skrci_min(m, k):
    """Erozija s kvadratom (2k+1), ločeno po oseh; zunaj slike velja True (rob slike ne erodira)."""
    out = m
    for os_ in (0, 1):
        p = np.pad(out, [(k, k) if i == os_ else (0, 0) for i in (0, 1)], constant_values=True)
        a = out.copy(); n = out.shape[os_]
        for d in range(2 * k + 1):
            a &= p[d:d + n] if os_ == 0 else p[:, d:d + n]
        out = a
    return out


def razsiri(m, k):
    return ~skrci_min(~m, k) if k else m


def _poteg(polno, dovoljeno, os_):
    """Vsak neprekinjen niz dovoljenih pikslov vzdolž osi je poln, če je poln kateri koli njegov piksel."""
    d = dovoljeno if os_ == 1 else dovoljeno.T
    p = polno if os_ == 1 else polno.T
    zac = d.copy(); zac[:, 1:] &= ~d[:, :-1]
    ids = np.cumsum(zac.ravel()).reshape(d.shape)  # id niza (velja le, kjer je d)
    poln = np.zeros(ids.max() + 1, bool)
    poln[ids[p & d]] = True
    out = poln[ids] & d
    return out if os_ == 1 else out.T


def poplavi(seme, dovoljeno):
    """Razlitje semena po dovoljenem (4-sosednost) z izmeničnimi potegi po vrsticah in stolpcih."""
    p = seme & dovoljeno
    if not p.any():
        return p
    while True:
        n = _poteg(_poteg(p, dovoljeno, 1), dovoljeno, 0)
        if n.sum() == p.sum():
            return n
        p = n


def razlij(rgb, a, n=3):
    """Barvo pod prosojnimi piksli nadomesti s povprečjem neprosojnih sosedov (brez temnega roba pri filtriranju)."""
    rgb = rgb.astype(np.float32); ima = a > 0
    for _ in range(n):
        vs = np.zeros_like(rgb); st = np.zeros(a.shape, np.float32)
        for dy, dx in ((0, 1), (0, -1), (1, 0), (-1, 0)):
            vs += np.roll(rgb * ima[..., None], (dy, dx), (0, 1)); st += np.roll(ima, (dy, dx), (0, 1))
        nov = (~ima) & (st > 0)
        rgb[nov] = vs[nov] / st[nov][:, None]; ima = ima | nov
    return rgb


class Napredek:
    def __init__(self, pot):
        self.pot = pot; self.d = {}
        if os.path.exists(pot):
            try:
                with open(pot, encoding="utf-8") as f:
                    self.d = json.load(f)
            except ValueError:
                pass
        self.t = 0

    def __call__(self, sili=False, **kw):
        self.d.update(kw)
        if sili or time.time() - self.t > 15:
            self.t = time.time(); self.d["cas"] = time.strftime("%Y-%m-%d %H:%M:%S")
            with open(self.pot + ".del", "w", encoding="utf-8") as f:
                json.dump(self.d, f, ensure_ascii=False)
            os.replace(self.pot + ".del", self.pot)


def main(arg):
    def z(ime, privzeto=None):
        return arg[arg.index(ime) + 1] if ime in arg else privzeto
    vhod, delo, izhod, spol = z("--vhod"), z("--delo"), z("--izhod"), z("--spol")
    with open(os.path.join(TU, "rezine_viri.json"), encoding="utf-8") as f:
        viri = json.load(f)
    tl = viri["telesa"][spol]
    od, do = int(z("--od", tl["od"])), int(z("--do", tl["do"]))
    podrobno = "--podrobno" in arg
    pod = tl["podrezine"]; px = tl["px_mm"]
    W0, H0 = viri["slika"]
    W1, H1 = int(W0 * px), int(H0 * px)
    ex, ey = robovi(W1, px, W0), robovi(H1, px, H0)
    Z = do - od + 1
    dat = [(zi, s, os.path.join(vhod, f"{tl['predpona']}{od + zi}{s}.png")) for zi in range(Z) for s in pod]
    N = len(dat)
    Wm, Hm = W1 // 3, H1 // 3
    os.makedirs(delo, exist_ok=True); os.makedirs(izhod, exist_ok=True)
    nap = Napredek(os.path.join(delo, "napredek.json"))
    dnevnik = lambda s: print(time.strftime("%H:%M:%S"), s, flush=True)

    def mm(ime, oblika):
        pot = os.path.join(delo, ime)
        nov = not os.path.exists(pot) or os.path.getsize(pot) != int(np.prod(oblika))
        return np.memmap(pot, np.uint8, "w+" if nov else "r+", shape=oblika), nov

    def nalozi(pot):
        """Rezina v anatomski legi (spredaj zgoraj) kot float32; None, če datoteke ni ali je pokvarjena."""
        if not os.path.exists(pot):
            return None
        try:
            a = beri(pot)
        except Exception as e:
            dnevnik(f"OPOZORILO: {os.path.basename(pot)} ni berljiva ({type(e).__name__}); uporabim sosednjo"); return None
        if a.shape[:2] != (H0, W0):
            dnevnik(f"OPOZORILO: {os.path.basename(pot)} ima velikost {a.shape}"); return None
        return a[::-1].astype(np.float32)

    # ---- 1 pregled
    vol, nov1 = mm("vol.u8", (Z, H1, W1, 4))
    mini, nov2 = mm("mini.u8", (N, Hm, Wm, 4))
    z0 = 0 if (nov1 or nov2) else int(nap.d.get("pregled", 0))
    manjka = list(nap.d.get("manjka", [])) if z0 else []
    povrs = (np.diff(ey)[:, None] * np.diff(ex)[None, :]).astype(np.float32)
    for zi in range(z0, Z):
        vs = np.zeros((H1, W1, 4), np.float32); k = 0
        for j, s in enumerate(pod):
            i = zi * len(pod) + j
            f = nalozi(dat[i][2])
            if f is None:
                manjka.append(os.path.basename(dat[i][2])); mini[i] = 0; continue
            nb = ~je_modro(f)
            x4 = np.concatenate([f * nb[..., None], nb[..., None].astype(np.float32)], 2)
            sm = np.add.reduceat(np.add.reduceat(x4[:ey[-1], :ex[-1]], ey[:-1], 0), ex[:-1], 1)
            vs += sm; k += 1
            m3 = sm[:Hm * 3, :Wm * 3].reshape(Hm, 3, Wm, 3, 4).sum((1, 3))
            p3 = povrs[:Hm * 3, :Wm * 3].reshape(Hm, 3, Wm, 3).sum((1, 3))
            mini[i, ..., :3] = np.clip(m3[..., :3] / np.maximum(m3[..., 3:], 1e-3), 0, 255)
            mini[i, ..., 3] = np.clip(m3[..., 3] / p3 * 255, 0, 255)
        if k:
            vol[zi, ..., :3] = np.clip(vs[..., :3] / np.maximum(vs[..., 3:], 1e-3) + 0.5, 0, 255)
            vol[zi, ..., 3] = np.clip(vs[..., 3] / (povrs * k) * 255 + 0.5, 0, 255)
        else:
            vol[zi] = vol[zi - 1] if zi else 0
        if zi % 20 == 19 or zi == Z - 1:
            vol.flush(); mini.flush()
            nap(sili=True, korak="pregled", delez=round((zi + 1) / Z, 3), pregled=zi + 1, manjka=manjka)
            dnevnik(f"pregled {zi + 1}/{Z}")

    if nap.d.get("razl") != RAZL:
        for k_ in ("maska", "izhod1", "podrobno", "sivi"):
            nap.d.pop(k_, None)
        nap(sili=True, razl=RAZL)
    if nap.d.get("razl_izhod") != RAZL_IZHOD:
        for k_ in ("izhod1", "podrobno", "prenos", "maska3") + (("sivi",) if (nap.d.get("razl_izhod") or 0) < 2 else ()):
            nap.d.pop(k_, None)
        nap(sili=True, razl_izhod=RAZL_IZHOD)
    # ---- 2 maska
    mpot = os.path.join(delo, "maska.npz")
    if os.path.exists(mpot) and nap.d.get("maska") == Z:
        g = np.load(mpot); telo = np.unpackbits(g["telo"]).reshape(-1)[:Z * H1 * W1].reshape(Z, H1, W1).astype(bool)
    else:
        nap(sili=True, korak="maska", delez=0)
        telo = np.zeros((Z, H1, W1), bool); kand = np.zeros((Z, H1, W1), bool)

        def razredi(zi):
            v = vol[zi]; r, g_, b = (v[..., c].astype(np.int16) for c in range(3))
            return v[..., 3] > 127, (np.maximum(np.maximum(r, g_), b) < 40) & (r <= b + 6), (r > b + 20) & (r > 50), g_ - r

        def razlij_odprto(seme, dov):
            """Razlitje po dovoljenem, skrčenem za 1 mm (mostički 1–2 mm do oznak ob telesu se pretrgajo), rob nazaj."""
            o = skrci_min(dov, 1)
            return razsiri(poplavi(seme & o, o), 1) & dov

        for zi in range(Z):
            nb, temno, toplo, gr = razredi(zi)
            kand[zi] = nb & ~temno & (gr <= 8)     # zelenkast led na ploskvah blokov ni tkivo
            odprto = skrci_min(kand[zi], 1)
            semena = skrci_min(kand[zi] & toplo, 7) & odprto
            while semena.any():
                # vsak toplo obarvan kos posebej: telo obdaja modri gel, listek in lestvico pa črn okvir
                i0 = int(np.argmax(semena)); eno = np.zeros_like(semena); eno.flat[i0] = True
                c = razsiri(poplavi(eno, odprto), 1) & kand[zi]
                semena &= ~c
                c &= razsiri(c & toplo, 4)          # brez sivih in belih podaljškov (led, lestvica) dlje od tkiva
                obroc = razsiri(c, 3) & ~c
                # listek je rumeno-zelen (zelena ≥ rdeča; maščoba in mišice so rdečkaste) in ga le delno obdaja gel
                if obroc.any() and (~nb)[obroc].mean() >= 0.5 and gr[c].mean() < -6:
                    telo[zi] |= c
            nap(korak="maska", delez=round(zi / Z / 2, 3))
        for smer in (range(1, Z), range(Z - 2, -1, -1)):   # drobni deli (prsti, teme) prek sosednje rezine; sive oznake ob telesu ne
            for zi in smer:
                prej = telo[zi - 1] if smer.start == 1 else telo[zi + 1]
                dod = razsiri(prej, 2) & kand[zi] & ~telo[zi]
                if dod.any():
                    dod &= razredi(zi)[2]
                    if dod.any():
                        c = razlij_odprto(dod, kand[zi] & razsiri(prej, 12))   # največ ~1 cm od telesa v sosednji rezini
                        telo[zi] |= c & razsiri(c & razredi(zi)[2], 4)
        # rezine, kjer se je telo stikalo z zunanjostjo (led ob robu gela) in je maska izpadla: površina pade glede na
        # sosede na obeh straneh → masko vzamemo iz najbližje dobre rezine (telo se med rezinama spremeni za največ ~3 mm)
        pov = telo.reshape(Z, -1).sum(1).astype(np.int64); slabe = []
        dobre = np.ones(Z, bool)
        for smer in (range(1, Z), range(Z - 2, -1, -1)):   # nenaden padec (> 40 % v 1 mm) glede na zadnjo dobro rezino
            zadnja = None
            for zi in smer:
                if not dobre[zi]:
                    continue
                if zadnja is not None and pov[zadnja] > 3000 and pov[zi] < 0.6 * pov[zadnja]:
                    dobre[zi] = False; slabe.append(zi)
                else:
                    zadnja = zi
        for zi in sorted(slabe, key=lambda z: min(abs(z - g) for g in np.where(dobre)[0])):
            g = min(np.where(dobre)[0], key=lambda q: (abs(q - zi), q))
            nb, temno, toplo, _ = razredi(zi)
            # jedro iz dobre rezine, rast največ nekaj mm in samo po toplo obarvanem (črn okvir ob roki ne)
            telo[zi] = (telo[g] & nb & ~temno) | (razsiri(telo[g], min(3 * abs(g - zi), 6)) & nb & toplo)
            dobre[zi] = True
        # rezine brez uporabnih podatkov (prazna slika na stiku blokov, zaledenela ploskev bloka): tudi po popravku je
        # telesa občutno manj kot v sosednjih dobrih → nadomestimo jih s prelivom med najbližjima dobrima rezinama
        pov2 = telo.reshape(Z, -1).sum(1).astype(np.int64); nadomesti = {}
        prave = np.ones(Z, bool)
        for zi in slabe:
            ok = [q for q in range(max(0, zi - 20), min(Z, zi + 21)) if q not in slabe]
            if ok and pov2[zi] < 0.85 * np.median(pov2[ok]):
                prave[zi] = False
        for zi in np.where(~prave)[0]:
            pred = [q for q in range(zi - 1, -1, -1) if prave[q]][:1]; po_ = [q for q in range(zi + 1, Z) if prave[q]][:1]
            if pred and po_:
                nadomesti[int(zi)] = (pred[0], po_[0], (zi - pred[0]) / (po_[0] - pred[0]))
            elif pred or po_:
                nadomesti[int(zi)] = ((pred or po_)[0], (pred or po_)[0], 0.0)
        for zi, (za, zb, w) in nadomesti.items():
            telo[zi] = telo[za] if w < 0.5 else telo[zb]
        # temne votline v telesu (zrak v pljučih, kri) so del slike: vse ne-modro, kar telo povsem obdaja; gel v votlinah ostane luknja
        rob = np.zeros((H1, W1), bool); rob[0] = rob[-1] = True; rob[:, 0] = rob[:, -1] = True
        for zi in range(Z):
            if telo[zi].any():
                telo[zi] |= (vol[zi, ..., 3] > 127) & ~poplavi(rob, ~telo[zi])
            nap(korak="maska", delez=round(0.5 + zi / Z / 2, 3))
        if slabe:
            dnevnik(f"maska: {len(slabe)} rezin popravljenih po sosednji ({slabe[:12]}…)")
        del kand
        np.savez(mpot, telo=np.packbits(telo))
        nap(sili=True, maska=Z, nadomesti={str(k_): v_ for k_, v_ in nadomesti.items()})
        if nadomesti:
            dnevnik(f"maska: {len(nadomesti)} rezin brez podatkov nadomeščenih s prelivom sosednjih ({sorted(nadomesti)[:8]}…)")
        dnevnik(f"maska: telo {telo.mean() * 100:.1f} % volumna")
    nadomesti = {int(k_): v_ for k_, v_ in nap.d.get("nadomesti", {}).items()}
    if not telo.any():
        raise SystemExit("maska je prazna: v rezinah ni najdenega telesa")
    ys = np.where(telo.any((0, 2)))[0]; xs = np.where(telo.any((0, 1)))[0]
    y0, y1 = max(ys[0] - ROB, 0), min(ys[-1] + 1 + ROB, H1)
    x0, x1 = max(xs[0] - ROB, 0), min(xs[-1] + 1 + ROB, W1)
    y0, y1, x0, x1 = int(y0), int(y1), int(x0), int(x1)
    Hc, Wc = y1 - y0, x1 - x0
    dnevnik(f"izrez x {x0}–{x1}, y {y0}–{y1} mm; {Wc} × {Hc} × {Z}")

    # ---- 3 barve
    L = np.zeros((N, 3)); tm = telo[:, :Hm * 3, :Wm * 3].reshape(Z, Hm, 3, Wm, 3).all((2, 4))
    prej = None
    for i in range(N):
        m = mini[i]; velja = (m[..., 3] > 250) & tm[dat[i][0]]
        zdaj = (np.log(m[..., :3].astype(np.float32) + 2), velja) if velja.sum() > 50 and dat[i][0] not in nadomesti else None
        if zdaj and prej:
            sk = zdaj[1] & prej[1]
            L[i] = L[i - 1] + (np.median(zdaj[0][sk] - prej[0][sk], 0) if sk.sum() > 50 else 0)
        elif i:
            L[i] = L[i - 1]
        prej = zdaj or prej
    # nihanje osvetlitve okoli drsečega povprečja (15 mm). Skokov svetlosti med bloki telesa ne odštevamo: poskus
    # (10. 11.) je pokazal, da se pri tem napaka kopiči vzdolž telesa (glava zelenkasta, noge presvetle).
    okno = int(15 * len(pod)) | 1
    Lp = np.pad(L, ((okno // 2, okno // 2), (0, 0)), mode="reflect" if N > okno else "edge")
    gladko = np.stack([np.convolve(Lp[:, c], np.ones(okno) / okno, "valid") for c in range(3)], 1)
    ojac = np.clip(np.exp(gladko - L), 0.75, 1.33).astype(np.float32)  # na datoteko
    ojac_z = ojac.reshape(Z, len(pod), 3).mean(1)
    dnevnik(f"barve: ojačanje {ojac.min():.3f}–{ojac.max():.3f}, std {ojac.std():.4f}")

    # ---- 3b šivi med bloki (pomik, izpad, skok osvetlitve v pasu ob stiku)
    spot = os.path.join(delo, "sivi.npz")
    if nap.d.get("sivi") == [Z, Hc, Wc] and os.path.exists(spot):
        g = np.load(spot); P, G = g["P"], g["G"]
    else:
        nap(sili=True, korak="šivi", delez=0)

        def rez_sv(q):
            v = vol[q, y0:y1, x0:x1]
            a = np.where(telo[q][y0:y1, x0:x1], v[..., 3], 0).astype(np.float32) / 255
            return SV.premakni(v[..., :3].astype(np.float32) * ojac_z[q], *P[q]), SV.premakni(a, *P[q])
        P = np.zeros((Z, 2), np.int64)
        P, st_p = SV.pomiki(rez_sv, Z, Hc, Wc)
        F, pov = SV.polje(rez_sv, Z, Hc, Wc)
        izpad, G, st_s = SV.izravnava(F, pov, nadomesti)
        np.savez(spot, P=P, G=G)
        nap(sili=True, sivi=[Z, Hc, Wc], sivi_izpad={str(k_): v_ for k_, v_ in izpad.items()},
            sivi_stiki=[list(t) for t in st_p] + [list(t) for t in st_s])
        dnevnik(f"šivi: {len(st_p)} pomikov, {sum(1 for t in st_s if t[1] == 'izpad')} izpadov, "
                f"{sum(1 for t in st_s if t[1] == 'skok')} skokov osvetlitve")
    nadomesti.update({int(k_): tuple(v_) for k_, v_ in nap.d.get("sivi_izpad", {}).items()})
    _ojac_polje = {}

    def polje_ojac(q, h, w, px_=1.0):
        """Množilnik barve (h, w, 3) iz polja šivov za rezino q (zadnjih nekaj v predpomnilniku)."""
        k_ = (q, h, w, px_)
        if k_ not in _ojac_polje:
            if len(_ojac_polje) > 8:
                _ojac_polje.clear()
            _ojac_polje[k_] = SV.razsiri(G[q], h, w, SV.CELICA, px_)
        return _ojac_polje[k_]

    # ---- 3c maska izhoda (rezine_maska.py): ločene dlani, rob kože čez stike blokov, večina treh rezin po z
    m3, nov3 = mm("maska3.u8", (Z, Hc, Wc))
    if nov3 or nap.d.get("maska3") != [Z, Hc, Wc]:
        nap(sili=True, korak="maska izhoda", delez=0)
        m3[:] = RM.maska_izhoda(lambda q: SV.premakni(telo[q][y0:y1, x0:x1], *P[q]), Z, nap.d.get("sivi_stiki", []), dnevnik)
        m3.flush()
        nap(sili=True, maska3=[Z, Hc, Wc])

    def koncna_alfa(a, q):
        """Alfa izhoda po maski izhoda: zunaj 0, dodano ob koži (preliv čez stik) polno."""
        mq = (m3[q] == 1) | (m3[q] == 3)   # 3: meja roke ob dolgem stiku je na fotografiji tkivo
        return np.where(mq, np.where(a > 0, a, 255), 0)

    # ---- 4 izhod 1 mm
    konc, _ = mm("konc.u8", (Z, Hc, Wc, 4))
    if nap.d.get("izhod1") != [Z, Hc, Wc] or not os.path.exists(os.path.join(izhod, "s", f"{Wc - 1}.webp")):
        for d in ("a", "k", "s"):
            os.makedirs(os.path.join(izhod, d), exist_ok=True)
        for zi in range(Z):
            def rezina1(q):
                v = vol[q, y0:y1, x0:x1]
                a = np.where(telo[q][y0:y1, x0:x1], v[..., 3], 0).astype(np.float32)
                a[a < 24] = 0
                rgb = SV.premakni(razlij(v[..., :3].astype(np.float32) * ojac_z[q], a), *P[q]) * polje_ojac(q, Hc, Wc)
                return rgb, SV.premakni(a, *P[q])
            if zi in nadomesti:
                za, zb, w = nadomesti[zi]
                (ra, aa), (rb, ab) = rezina1(za), rezina1(zb)
                a = (1 - w) * aa + w * ab
                rgb = ((1 - w) * ra * aa[..., None] + w * rb * ab[..., None]) / np.maximum(a, 1e-3)[..., None]
                rgb = np.where(a[..., None] > 0, rgb, ra)
                a[a < 64] = 0
            else:
                rgb, a = rezina1(zi)
            a = koncna_alfa(a, zi)
            konc[zi, ..., :3] = np.clip(rgb + 0.5, 0, 255); konc[zi, ..., 3] = a
            pisi(np.ascontiguousarray(konc[zi]), os.path.join(izhod, "a", f"{zi}.webp"), 90)
            nap(korak="izhod prečno", delez=round(zi / Z, 3))
        konc.flush()
        for y in range(Hc):
            pisi(np.ascontiguousarray(konc[:, y]), os.path.join(izhod, "k", f"{y}.webp"), 90)
            nap(korak="izhod frontalno", delez=round(y / Hc, 3))
        for x in range(Wc):
            pisi(np.ascontiguousarray(konc[:, :, x]), os.path.join(izhod, "s", f"{x}.webp"), 90)
            nap(korak="izhod sagitalno", delez=round(x / Wc, 3))
        nap(sili=True, izhod1=[Z, Hc, Wc])
        dnevnik("izhod 1 mm zapisan")
    # mali volumen (4 mm), povprečje s predmnoženo alfo
    Z4, H4, W4 = -(-Z // MALI), -(-Hc // MALI), -(-Wc // MALI)
    stolp = max(1, min(Z4, 2048 // W4)); vrst = -(-Z4 // stolp)
    list_ = np.zeros((vrst * H4, stolp * W4, 4), np.uint8)
    for k in range(Z4):
        b = np.zeros((MALI, H4 * MALI, W4 * MALI, 4), np.float32)
        kos = konc[k * MALI:(k + 1) * MALI].astype(np.float32)
        b[:kos.shape[0], :Hc, :Wc] = kos
        al = b[..., 3:].reshape(MALI, H4, MALI, W4, MALI, 1)
        pm = (b[..., :3].reshape(MALI, H4, MALI, W4, MALI, 3) * al).sum((0, 2, 4))
        sa = al.sum((0, 2, 4))
        cel = np.concatenate([pm / np.maximum(sa, 1e-3), sa / (MALI ** 3)], 2)
        cel[..., :3] = razlij(cel[..., :3], cel[..., 3] > 1, 2)
        cel[RM.alfa_malega(m3, k, MALI), 3] = 0   # reža med dlanjo in stegnom ostane prazna tudi v 4 mm (površje telesa)
        rr, cc = divmod(k, stolp)
        list_[rr * H4:(rr + 1) * H4, cc * W4:(cc + 1) * W4] = np.clip(cel + 0.5, 0, 255)
    pisi(list_, os.path.join(izhod, "mali.webp"), 92)
    # predogled: frontalna in sagitalna sredina ter štiri prečne rezine (za hiter pregled na daljavo)
    def na_crno(a):
        return np.concatenate([(a[..., :3].astype(np.float32) * a[..., 3:] / 255).astype(np.uint8), np.full(a.shape[:2] + (1,), 255, np.uint8)], 2)
    yk = int(np.argmax(telo[:, y0:y1].sum((0, 2)))); xk = Wc // 2
    precne = [konc[int(Z * t)] for t in (0.15, 0.4, 0.6, 0.85)]
    vis = max(Z, 2 * Hc); sir = Wc + Hc + 2 * Wc + 30
    pl = np.zeros((vis, sir, 4), np.uint8); pl[..., 3] = 255
    pl[:Z, :Wc] = na_crno(konc[:, yk]); pl[:Z, Wc + 10:Wc + 10 + Hc] = na_crno(konc[:, :, xk])
    for i, p in enumerate(precne):
        if (i // 2 + 1) * Hc <= vis:
            pl[(i // 2) * Hc:(i // 2 + 1) * Hc, Wc + Hc + 20 + (i % 2) * (Wc + 10):Wc + Hc + 20 + (i % 2) * (Wc + 10) + Wc] = na_crno(p)
    pisi(pl, os.path.join(izhod, "predogled.webp"), 80)

    meta = {"spol": spol, "od": od, "do": do, "mm": 1, "dim": [Wc, Hc, Z], "izrez": [int(x0), int(y0)], "okvir": [W1, H1],
            "px_mm": px, "osi": "x: od desne proti levi strani telesa; y: od spredaj nazaj; z: od glave proti nogam",
            "mali": {"mm": MALI, "dim": [W4, H4, Z4], "stolpcev": stolp, "datoteka": "mali.webp"},
            "navedba": viri["navedba"], "pogoji": viri["pogoji"], "manjka": nap.d.get("manjka", []), "nadomescene": sorted(nadomesti),
            "ustvarjeno": time.strftime("%Y-%m-%d"),
            "sivi": {"opis": "stiki blokov: pomik [z, dy, dx, vrh], izpad [z, 'izpad', rezin], skok [z, 'skok', velikost]",
                     "stiki": nap.d.get("sivi_stiki", [])}}
    # oznake in poravnava (rezine_oznake.py) ostanejo do ponovnega izračuna (--matrika-iz-mete, docs/3d.md)
    try:
        with open(os.path.join(izhod, "meta.json"), encoding="utf-8") as f:
            stara = json.load(f)
        for k_ in ("oznake", "poravnava"):
            if k_ in stara:
                meta[k_] = stara[k_]
    except (OSError, ValueError):
        pass

    # ---- 5 podrobno
    if podrobno:
        X0, X1, Y0, Y1 = int(ex[x0]), int(ex[x1]), int(ey[y0]), int(ey[y1])
        Wp, Hp = X1 - X0, Y1 - Y0
        ix = np.clip(np.searchsorted(ex, np.arange(X0, X1), "right") - 1, 0, W1 - 1)
        iy = np.clip(np.searchsorted(ey, np.arange(Y0, Y1), "right") - 1, 0, H1 - 1)
        pxs = ((ex[x0:x1] + ex[x0 + 1:x1 + 1]) // 2 - X0).astype(int)   # stolpec piksla za vsako sagitalno ravnino (1 mm)
        pys = ((ey[y0:y1] + ey[y0 + 1:y1 + 1]) // 2 - Y0).astype(int)
        vzdolzno = len(pod) > 1
        sred = len(pod) // 2
        for d in (("a", "k", "s") if vzdolzno else ("a",)):
            for r in (0, 1):
                os.makedirs(os.path.join(izhod, "p", d, str(r)), exist_ok=True)

        def ploscice(sl, mapa, ime, vrsta=None):
            """sl (h, w, 4) → ploščice <ime>_<vrstica>_<stolpec> ravni 0 (512) in 1 (256, povprečje 2 × 2 s predmnoženo alfo);
            vrsta: pas rezin (sl je ena vrstica ploščic)."""
            h, w = sl.shape[:2]
            for ty in range(-(-h // T)):
                for tx in range(-(-w // T)):
                    p = np.zeros((T, T, 4), np.uint8)
                    kos = sl[ty * T:(ty + 1) * T, tx * T:(tx + 1) * T]; p[:kos.shape[0], :kos.shape[1]] = kos
                    pisi(p, os.path.join(izhod, "p", mapa, "0", f"{ime}_{ty if vrsta is None else vrsta}_{tx}.webp"), 84)
                    f = p.astype(np.float32).reshape(T // 2, 2, T // 2, 2, 4)
                    al = f[..., 3:]; sa = al.sum((1, 3))
                    q = np.concatenate([(f[..., :3] * al).sum((1, 3)) / np.maximum(sa, 1e-3), sa / 4], 2)
                    pisi(np.clip(q + 0.5, 0, 255).astype(np.uint8), os.path.join(izhod, "p", mapa, "1", f"{ime}_{ty if vrsta is None else vrsta}_{tx}.webp"), 86)

        pasov = -(-N // T) if vzdolzno else 0
        if vzdolzno:
            kor, _ = mm("pas-k.u8", (T, Hc, Wp, 4)); sag, _ = mm("pas-s.u8", (T, Wc, Hp, 4))
        i0 = int(nap.d.get("podrobno", 0)) if os.listdir(os.path.join(izhod, "p", "a", "0")) else 0
        i0 = (i0 // T) * T if vzdolzno else i0
        zadnja = None
        for i in range(i0, N):
            zi, s, pot = dat[i]
            zg = zi   # rezina, katere pomik in polje šivov veljata za to datoteko
            if zi in nadomesti:
                zv = nadomesti[zi][0] if nadomesti[zi][2] < 0.5 else nadomesti[zi][1]
                pot = dat[zv * len(pod) + pod.index(s)][2]; zg = zv
            potrebna = vzdolzno or s == pod[sred]
            if potrebna:
                f = nalozi(pot)
                if f is not None:
                    f = SV.premakni(f[Y0:Y1, X0:X1], *np.rint(P[zg] / px).astype(int))
                    tm = SV.premakni(telo[zg], *P[zg]).copy()
                    tm[y0:y1, x0:x1] = (m3[zi] == 1) | (m3[zi] == 3)   # maska izhoda (ločene dlani, rob kože čez stike)
                    m = skrci_min(tm[iy][:, ix] & ~je_modro(f), 1)   # 1 piksel (0,33 mm) noter: brez svetlega ledenega roba
                    a = m.astype(np.float32)
                    a = (a + np.roll(a, 1, 0) + np.roll(a, -1, 0) + np.roll(a, 1, 1) + np.roll(a, -1, 1)) * (255 / 5)
                    a = np.where(razsiri(m, 1), a, 0).astype(np.uint8)
                    rgb = np.clip(razlij(f * ojac[i], m, 2) * polje_ojac(zg, Hp, Wp, px) + 0.5, 0, 255).astype(np.uint8)
                    zadnja = np.concatenate([rgb, a[..., None]], 2)
                if zadnja is None:
                    zadnja = np.zeros((Hp, Wp, 4), np.uint8)
                if s == pod[sred]:
                    ploscice(zadnja, "a", str(zi))
                if vzdolzno:
                    kor[i % T] = zadnja[pys]; sag[i % T] = zadnja[:, pxs].transpose(1, 0, 2)
            if vzdolzno and (i % T == T - 1 or i == N - 1):
                vrstic = i % T + 1; pas = i // T
                for j in range(Hc):
                    ploscice(np.asarray(kor[:vrstic, j]), "k", str(j), pas)
                for j in range(Wc):
                    ploscice(np.asarray(sag[:vrstic, j]), "s", str(j), pas)
                nap(sili=True, podrobno=i + 1)
                dnevnik(f"podrobno: pas {pas + 1}/{pasov}")
            if not vzdolzno and i % 20 == 19:
                nap(sili=True, podrobno=i + 1)
            nap(korak="podrobno", delez=round((i + 1) / N, 3))
        meta["podrobno"] = {"ploscica": T, "ravni": [{"mm": px, "px": T}, {"mm": 2 * px, "px": T // 2}], "dim_px": [Wp, Hp, N],
                            "ravnine": ["a", "k", "s"] if vzdolzno else ["a"], "pasov": pasov, "rezin_na_mm": len(pod)}
    # oznake, ki so bile medtem (med dolgim korakom podrobno) zapisane v meta.json, ostanejo: preberemo ga še enkrat
    try:
        with open(os.path.join(izhod, "meta.json"), encoding="utf-8") as f:
            stara = json.load(f)
        for k_ in ("oznake", "poravnava"):
            if k_ in stara:
                meta[k_] = stara[k_]
    except (OSError, ValueError):
        pass
    with open(os.path.join(izhod, "meta.json"), "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=1)
    # ---- 6 prenos za oznake (rezine_oznake.py teče na strežniku): vol4.npz (4 mm) in konc.u8 v kosih ≤ 300 MB, ker
    # prenos z j-jevega računalnika sprejme datoteke do 400 MB (maska.npz je manjša); docs/3d.md »Oznake po peki«
    if nap.d.get("prenos") != [Z, Hc, Wc]:
        nap(sili=True, korak="prenos za oznake", delez=0)
        k4 = 4; Zk, Hk, Wk = Z // k4, H1 // k4, W1 // k4
        v4 = np.zeros((Zk, Hk, Wk, 3), np.float16); t4 = np.zeros((Zk, Hk, Wk), np.float16)
        for q in range(Zk):
            v4[q] = np.asarray(vol[q * k4:(q + 1) * k4, :Hk * k4, :Wk * k4, :3], np.float32).reshape(k4, Hk, k4, Wk, k4, 3).mean((0, 2, 4))
            t4[q] = telo[q * k4:(q + 1) * k4, :Hk * k4, :Wk * k4].reshape(k4, Hk, k4, Wk, k4).mean((0, 2, 4))
        np.savez(os.path.join(delo, "vol4.npz"), v4=v4, t4=t4)
        pm = os.path.join(delo, "prenos"); os.makedirs(pm, exist_ok=True)
        for f_ in os.listdir(pm):
            os.remove(os.path.join(pm, f_))
        KOS = 300 * 1024 * 1024
        with open(os.path.join(delo, "konc.u8"), "rb") as f:
            n_ = 0
            while True:
                b_ = f.read(KOS)
                if not b_:
                    break
                with open(os.path.join(pm, f"konc.u8.{n_:03d}"), "wb") as g_:
                    g_.write(b_)
                n_ += 1
        nap(sili=True, prenos=[Z, Hc, Wc], prenos_kosov=n_)
        dnevnik(f"prenos za oznake: vol4.npz in {n_} kosov konc.u8 v {pm}")
    nap(sili=True, korak="končano", delez=1)
    dnevnik("končano")


if __name__ == "__main__":
    main(sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else sys.argv[1:])

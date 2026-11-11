# Primerja dve peki istega organa (npr. strežnik CPU : prenosnik GPU, scripts/atlas/rtx/): končne slike peka.py
# (<organ>[-telefon].delo.blend.{baza,normala,orm}-koncna.png) po PSNR na RGB (8 bit). Obe peki morata izhajati iz iste
# delovne datoteke (ista UV), zato najprej primerja seznam vozlišč v .delo.blend.json. Potrebuje numpy in Pillow.
# Zagon: python3 scripts/atlas/primerjaj-peko.py <mapa A> <mapa B> <organ> [--samo -telefon|""] [--meja 35]
# Izhod: vrstica na sliko, nato PRIMERLJIVO ali RAZLIKA; koda 1, če je katera pod mejo (privzeto 35 dB) ali manjka.
import json, math, os, sys

SLIKE = ("baza", "normala", "orm")


def psnr(a, b):
    import numpy as np
    a = np.asarray(a, np.float64); b = np.asarray(b, np.float64)
    if a.shape != b.shape:
        raise ValueError(f"različni velikosti {a.shape} : {b.shape}")
    mse = float(np.mean((a - b) ** 2))
    return math.inf if mse == 0 else 10 * math.log10(255 ** 2 / mse)


def _rgb(pot):
    from PIL import Image
    import numpy as np
    with Image.open(pot) as im:
        return np.asarray(im.convert("RGB"))


def primerjaj(mapa_a, mapa_b, organ, samo=None, meja=35.0):
    vrstice, ok = [], True
    for pripona in ("", "-telefon"):
        if samo is not None and pripona != samo:
            continue
        delo = f"{organ}{pripona}.delo.blend"
        ja, jb = os.path.join(mapa_a, delo + ".json"), os.path.join(mapa_b, delo + ".json")
        if os.path.exists(ja) and os.path.exists(jb):
            v = lambda p: json.load(open(p, encoding="utf-8"))["vozlisca"]
            if v(ja) != v(jb):
                vrstice.append(f"{delo}: različni delovni datoteki (vozlišča) – primerjaj peki iz iste .delo.blend")
                ok = False
                continue
        for k in SLIKE:
            ime = f"{delo}.{k}-koncna.png"
            pa, pb = os.path.join(mapa_a, ime), os.path.join(mapa_b, ime)
            if not (os.path.exists(pa) and os.path.exists(pb)):
                vrstice.append(f"{ime}: manjka ({'B' if os.path.exists(pa) else 'A'})")
                ok = False
                continue
            try:
                db = psnr(_rgb(pa), _rgb(pb))
            except ValueError as e:
                vrstice.append(f"{ime}: {e}"); ok = False; continue
            dobro = db >= meja
            ok = ok and dobro
            vrstice.append(f"{ime}: PSNR {'∞' if db == math.inf else f'{db:.1f}'} dB " + ("OK" if dobro else f"< {meja:g} dB"))
    return ok, vrstice


if __name__ == "__main__":
    a = sys.argv[1:]
    def zastava(ime, priv):
        if ime in a:
            i = a.index(ime); v = a[i + 1]; del a[i:i + 2]; return v
        return priv
    samo = zastava("--samo", None)
    meja = float(zastava("--meja", "35"))
    if len(a) != 3:
        raise SystemExit("Uporaba: python3 scripts/atlas/primerjaj-peko.py <mapa A> <mapa B> <organ> [--samo -telefon] [--meja 35]")
    ok, vrstice = primerjaj(*a, samo=samo, meja=meja)
    print("\n".join(vrstice))
    print("PRIMERLJIVO" if ok else "RAZLIKA")
    sys.exit(0 if ok else 1)

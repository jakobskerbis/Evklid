"""PNG izrise (ikone.py) pomanjša na 512×512 in shrani kot WebP s prozornostjo, vsak ≤ 80 KB.

  python3 scripts/3d-ikone-drevo/v-webp.py <mapa-png> <mapa-webp> [id,id,…]
Kakovost se zniža po korakih, dokler datoteka ni ≤ 80 KB.
"""
import os, sys
import numpy as np
from PIL import Image

MEJA = 80 * 1024


def senca(src_senca, velikost):
    """Senca (črna z alfo) omejena z mehko elipso okoli svojega težišča in rahlo poenotena."""
    s = Image.open(src_senca).convert("RGBA")
    a = np.asarray(s, dtype=np.float32)[..., 3] / 255.0
    h, w = a.shape
    yy, xx = np.mgrid[0:h, 0:w]
    ut = a.sum() or 1.0
    cx, cy = (a * xx).sum() / ut, (a * yy).sum() / ut
    rx, ry = 0.40 * w, 0.17 * h
    d2 = ((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2
    maska = np.clip(1 - d2, 0, 1) ** 2
    rob = np.minimum(np.minimum(xx, w - 1 - xx), np.minimum(yy, h - 1 - yy)) / (0.08 * w)
    maska = maska * np.clip(rob, 0, 1) ** 2  # senca nikoli ne seže do roba
    a = a * maska
    m = a.max()
    if m > 0:
        a = a * min(1.0, 0.42 / m)
    out = np.zeros((h, w, 4), dtype=np.uint8)
    out[..., 3] = np.clip(a * 255 + 0.5, 0, 255).astype(np.uint8)
    return Image.fromarray(out, "RGBA").resize((velikost, velikost), Image.LANCZOS)


def pretvori(src, dst):
    im = Image.open(src).convert("RGBA")
    ss = src[:-4] + "-senca.png"
    if os.path.exists(ss):
        sen = senca(ss, im.width)
        sen.alpha_composite(im)
        im = sen
    im = im.resize((512, 512), Image.LANCZOS)
    for q in (92, 88, 84, 80, 75, 70, 65, 60):
        im.save(dst, "WEBP", quality=q, alpha_quality=90, method=6)
        if os.path.getsize(dst) <= MEJA:
            return q, os.path.getsize(dst)
    raise SystemExit(f"{dst}: tudi pri q=60 večja od 80 KB")


def main():
    vhod, izhod = sys.argv[1], sys.argv[2]
    os.makedirs(izhod, exist_ok=True)
    ids = sys.argv[3].split(",") if len(sys.argv) > 3 else [f[:-4] for f in sorted(os.listdir(vhod)) if f.endswith(".png") and not f.endswith("-senca.png")]
    for i in ids:
        q, n = pretvori(os.path.join(vhod, i + ".png"), os.path.join(izhod, i + ".webp"))
        print(f"{i}.webp  q={q}  {n / 1024:.1f} KB")


main()

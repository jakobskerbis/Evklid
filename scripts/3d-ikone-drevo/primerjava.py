"""Pregledna slika: ikone na temni (#1a1f29) in svetli (#ffffff) podlagi, velike in v ploščici kot v osnutku drevesa.

  python3 scripts/3d-ikone-drevo/primerjava.py <mapa-webp> <izhod.png> id:skupina,id:skupina,…
skupina: bio | kem | fiz | mat
"""
import sys
from PIL import Image, ImageDraw

BARVE = {"bio": (47, 179, 107), "kem": (155, 108, 240), "fiz": (61, 139, 253), "mat": (240, 160, 32)}
PODLAGE = [(0x1a, 0x1f, 0x29), (255, 255, 255)]
V, P, ROB = 300, 150, 30  # velika ikona, ploščica, rob


def ploscica(bg, c, a_pol, a_rob, ikona):
    """Ploščica 118 px iz osnutka (radij 34, polnilo 14 %, obroba 35 %), povečana na P."""
    s = 4
    t = Image.new("RGBA", (P * s, P * s), (0, 0, 0, 0))
    d = ImageDraw.Draw(t)
    r = int(34 / 118 * P * s)
    fill = tuple(int(bg[i] + (c[i] - bg[i]) * a_pol) for i in range(3))
    edge = tuple(int(bg[i] + (c[i] - bg[i]) * a_rob) for i in range(3))
    d.rounded_rectangle((0, 0, P * s - 1, P * s - 1), r, fill=edge)
    w = int(1.5 / 118 * P * s) + 2
    d.rounded_rectangle((w, w, P * s - 1 - w, P * s - 1 - w), r - w, fill=fill)
    t = t.resize((P, P), Image.LANCZOS)
    k = int(P * 0.86)
    ic = ikona.resize((k, k), Image.LANCZOS)
    t.alpha_composite(ic, ((P - k) // 2, (P - k) // 2))
    return t


def main():
    mapa, izhod, seznam = sys.argv[1], sys.argv[2], sys.argv[3].split(",")
    ikone = [(x.split(":")[0], x.split(":")[1]) for x in seznam]
    n = len(ikone)
    sir = n * V + (n + 1) * ROB
    vis_pas = ROB + V + ROB + P + ROB
    im = Image.new("RGB", (sir, 2 * vis_pas))
    for vrsta, bg in enumerate(PODLAGE):
        y0 = vrsta * vis_pas
        im.paste(Image.new("RGB", (sir, vis_pas), bg), (0, y0))
        for k, (ident, sk) in enumerate(ikone):
            ic = Image.open(f"{mapa}/{ident}.webp").convert("RGBA")
            x = ROB + k * (V + ROB)
            big = ic.resize((V, V), Image.LANCZOS)
            im.paste(big, (x, y0 + ROB), big)
            a_pol, a_rob = (0.14, 0.35) if sk != "mat" else (0.16, 0.4)
            t = ploscica(bg, BARVE[sk], a_pol, a_rob, ic)
            im.paste(t, (x + (V - P) // 2, y0 + ROB + V + ROB), t)
    im.save(izhod)


main()

"""Pregledna slika vseh 31 ikon, razporejenih po drevesu (ena vrstica = ena veja in njene podveje).

  python3 pregled-drevo.py <mapa-webp> <izhod.png>   -> <izhod>-temna.png in <izhod>-svetla.png
"""
import sys, os
from PIL import Image, ImageDraw, ImageFont

IME = {
    "biologija": "Biologija", "kemija": "Kemija", "fizika-vesolje": "Fizika in vesolje", "matematika": "Matematika",
    "telo": "Človeško telo", "mikrobi": "Celice in mikrobi", "rastline": "Rastline", "procesi": "Procesi",
    "atlas": "Celo telo (atlas)", "organi": "Organi", "celice-telesa": "Celice telesa",
    "glava": "Glava", "prsni-kos": "Prsni koš", "trebuh": "Trebuh",
    "kri": "Kri", "misice": "Mišice", "zivci": "Živci in čutila", "druge-celice": "Druge celice",
    "tkiva": "Tkiva", "spolne": "Spolne celice",
    "celica-blizu": "Celica od blizu", "bakterije-glive": "Bakterije in glive", "virusi": "Virusi", "enocelicarji": "Enoceličarji",
    "list": "List", "korenina": "Korenina in steblo",
    "atom": "Atom", "molekule-kristali": "Molekule in kristali", "molekule-zivljenja": "Molekule življenja",
    "polja": "Polja", "vesolje": "Vesolje",
}
VRSTE = [
    (None, ["biologija", "kemija", "fizika-vesolje", "matematika"]),
    ("biologija", ["telo", "mikrobi", "rastline", "procesi"]),
    ("telo", ["atlas", "organi", "celice-telesa"]),
    ("organi", ["glava", "prsni-kos", "trebuh"]),
    ("celice-telesa", ["kri", "misice", "zivci", "druge-celice"]),
    ("druge-celice", ["tkiva", "spolne"]),
    ("mikrobi", ["celica-blizu", "bakterije-glive", "virusi", "enocelicarji"]),
    ("rastline", ["list", "korenina"]),
    ("kemija", ["atom", "molekule-kristali", "molekule-zivljenja"]),
    ("fizika-vesolje", ["polja", "vesolje"]),
]
BARVA = {"bio": (47, 179, 107), "kem": (155, 108, 240), "fiz": (61, 139, 253), "mat": (240, 160, 32)}
SK = {i: "bio" for i in IME}
SK.update({"kemija": "kem", "atom": "kem", "molekule-kristali": "kem", "molekule-zivljenja": "kem",
           "fizika-vesolje": "fiz", "polja": "fiz", "vesolje": "fiz", "matematika": "mat"})

mapa, izhod = sys.argv[1], sys.argv[2]
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONTB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
try:
    f = ImageFont.truetype(FONT, 17)
    fb = ImageFont.truetype(FONTB, 19)
except OSError:  # brez pisave DejaVu (ni Linux)
    f = ImageFont.load_default(17)
    fb = ImageFont.load_default(19)
I, P, LEVO, VR = 168, 18, 250, 222
W = LEVO + 4 * (I + P) + P
H = len(VRSTE) * VR + 20


def ikona(i, s):
    return Image.open(os.path.join(mapa, i + ".webp")).convert("RGBA").resize((s, s), Image.LANCZOS)


for bg, tx, mu, suf in (((0x1a, 0x1f, 0x29), (232, 236, 243), (154, 164, 181), "temna"), ((255, 255, 255), (27, 34, 48), (93, 102, 118), "svetla")):
    im = Image.new("RGB", (W, H), bg)
    d = ImageDraw.Draw(im)
    for r, (stars, otroci) in enumerate(VRSTE):
        y = 10 + r * VR
        if r:
            d.line((P, y - 6, W - P, y - 6), fill=tuple(int(c * 0.85 + b * 0.15) for c, b in zip(bg, mu)), width=1)
        if stars:
            ic = ikona(stars, 96)
            im.paste(ic, (P + 60, y + 24), ic)
            c = BARVA[SK[stars]]
            besedilo = IME[stars] + " ›"
        else:
            c = tx
            besedilo = "3D svet ›"
        d.text((P, y + 132), besedilo, fill=c, font=fb)
        for k, i in enumerate(otroci):
            x = LEVO + k * (I + P)
            ic = ikona(i, I)
            im.paste(ic, (x, y), ic)
            ime = IME[i]
            w = d.textlength(ime, font=f)
            d.text((x + (I - w) / 2, y + I + 6), ime, fill=mu, font=f)
    im.save(izhod.replace(".png", f"-{suf}.png"))

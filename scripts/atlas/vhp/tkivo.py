# Prostorska tekstura pravega tkiva za rezne ploskve (vsaka ravnina enako ostra): kocki 48³ vokslov po 0,33 mm iz
# kriorezin Visible Woman (NLM Visible Human Project, Courtesy of the U.S. National Library of Medicine; rezine
# avf1413a–avf1428c, Female-Images/PNG_format/thorax): stena levega prekata in podkožna maščoba (režnjiči). Izhod: PNG s
# ploščicami rezin (vsaka z robom 1 voksel), levo miokard, desno maščoba; pregledovalnik (organ.js) ju vzorči trilinearno.
# Zagon: python3 scripts/atlas/vhp/tkivo.py <mapa s PNG> <izhod.png>
import sys, os, numpy as np
from PIL import Image
mapa, izhod = sys.argv[1], sys.argv[2]
REZINE = [f"avf{n}{s}" for n in range(1413, 1429) for s in "abc"]
OKNA = {"miokard": (1210, 392), "mascoba": (1000, 730)}  # levi zgornji kot okna 48 × 48 px (0,33 mm/px)
K = 48
bloki = {k: np.zeros((K, K, K, 3), np.float32) for k in OKNA}
for z, r in enumerate(REZINE):
    im = np.asarray(Image.open(os.path.join(mapa, r + ".png")).convert("RGB"), np.float32)
    for k, (x, y) in OKNA.items():
        bloki[k][z] = im[y:y + K, x:x + K]
for k, b in bloki.items():
    # izravnava osvetlitve med rezinami (fotografije se razlikujejo za nekaj odstotkov) in brez temnih rež (kri, votlina)
    b *= b.mean() / b.mean(axis=(1, 2, 3), keepdims=True)
    print(k, "povprečna barva", b.reshape(-1, 3).mean(0).round(1), "std", b.reshape(-1, 3).std(0).round(1))
st, vr = 8, 6
T = K + 2
img = np.zeros((vr * T, 2 * st * T, 3), np.uint8)
for i, k in enumerate(OKNA):
    b = np.clip(bloki[k], 0, 255).astype(np.uint8)
    for z in range(K):
        t = np.pad(b[z], ((1, 1), (1, 1), (0, 0)), mode="edge")
        rr, cc = divmod(z, st)
        img[rr * T:(rr + 1) * T, (i * st + cc) * T:(i * st + cc + 1) * T] = t
Image.fromarray(img).save(izhod, optimize=True)
print(izhod, img.shape, os.path.getsize(izhod))

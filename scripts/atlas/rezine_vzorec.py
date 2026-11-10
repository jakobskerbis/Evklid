# Majhen vzorec (≤ 1 MB) za repozitorij in teste iz že obdelanega telesa: izrez po z, mali volumen na 2 mm, oznake.
#   python3 scripts/atlas/rezine_vzorec.py <delo> <izhod (meta.json, oznake.bin)> <cilj> <z od> <z do>
# Vzorec nima ostrih rezin (meta.ostro = false): pogled riše iz malega volumna.
import json, os, sys
import numpy as np
from PIL import Image

delo, izhod, cilj, za, zb = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4]), int(sys.argv[5])
meta = json.load(open(os.path.join(izhod, "meta.json"), encoding="utf-8"))
Wc, Hc, Z = meta["dim"]; k = 2
konc = np.memmap(os.path.join(delo, "konc.u8"), np.uint8, "r", shape=(Z, Hc, Wc, 4))
kos = np.asarray(konc[za:zb], np.float32)
ys = np.where(kos[..., 3].any((0, 2)))[0]; xs = np.where(kos[..., 3].any((0, 1)))[0]
y0, y1, x0, x1 = (ys[0] // 4) * 4, -(-(ys[-1] + 1) // 4) * 4, (xs[0] // 4) * 4, -(-(xs[-1] + 1) // 4) * 4
kos = kos[:(zb - za) // k * k, y0:min(y1, Hc), x0:min(x1, Wc)]
kos = kos[:, :kos.shape[1] // k * k, :kos.shape[2] // k * k]
Zs, Hs, Ws = kos.shape[0], kos.shape[1], kos.shape[2]
al = kos[..., 3:].reshape(Zs // k, k, Hs // k, k, Ws // k, k, 1)
pm = (kos[..., :3].reshape(Zs // k, k, Hs // k, k, Ws // k, k, 3) * al).sum((1, 3, 5)); sa = al.sum((1, 3, 5))
mali = np.concatenate([pm / np.maximum(sa, 1e-3), sa / k ** 3], 3)
Z2, H2, W2 = mali.shape[:3]
stolp = max(1, 2048 // W2); vrst = -(-Z2 // stolp)
lst = np.zeros((vrst * H2, stolp * W2, 4), np.uint8)
for z in range(Z2):
    r, c = divmod(z, stolp); lst[r * H2:(r + 1) * H2, c * W2:(c + 1) * W2] = np.clip(mali[z] + 0.5, 0, 255)
os.makedirs(cilj, exist_ok=True)
Image.fromarray(lst, "RGBA").save(os.path.join(cilj, "mali.webp"), quality=int(os.environ.get("VZOREC_Q", "72")), method=6)
m2 = {kk: meta[kk] for kk in ("spol", "mm", "px_mm", "osi", "navedba", "pogoji", "ustvarjeno")}
m2.update(od=meta["od"] + za, do=meta["od"] + za + Zs - 1, dim=[Ws, Hs, Zs], ostro=False, vzorec=True,
          mali={"mm": k, "dim": [W2, H2, Z2], "stolpcev": stolp, "datoteka": "mali.webp"})
if "oznake" in meta:
    o = meta["oznake"]; W, H, Zo = o["dim"]; mm = o["mm"]
    pari = np.frombuffer(open(os.path.join(izhod, o["datoteka"]), "rb").read(), "<u2").reshape(-1, 2)
    ozn = np.repeat(pari[:, 1], pari[:, 0])[:W * H * Zo].reshape(Zo, H, W)
    oz = ozn[za // mm:(za + Zs) // mm, y0 // mm:(y0 + Hs) // mm, x0 // mm:(x0 + Ws) // mm]
    pl = oz.ravel(); meje = np.flatnonzero(np.diff(pl)) + 1; zac = np.concatenate([[0], meje]); dol = np.diff(np.concatenate([zac, [len(pl)]]))
    out = []
    for s, d in zip(zac, dol):
        while d > 65535:
            out.append((65535, int(pl[s]))); d -= 65535
        out.append((int(d), int(pl[s])))
    open(os.path.join(cilj, "oznake.bin"), "wb").write(np.array(out, "<u2").tobytes())
    m2["oznake"] = dict(o, dim=[oz.shape[2], oz.shape[1], oz.shape[0]], prisotne=sorted({o["kljuci"][i - 1] for i in np.unique(oz) if i}))
    # anatomske ravni (vretenca) v koordinatah vzorca
    m2["oznake"]["ravni"] = [[z0 - za, z1 - za, ime] for z0, z1, ime in o.get("ravni", []) if z1 >= za and z0 < za + Zs]
    m2["poravnava"] = meta.get("poravnava")
json.dump(m2, open(os.path.join(cilj, "meta.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(cilj, m2["dim"], {f: os.path.getsize(os.path.join(cilj, f)) for f in os.listdir(cilj)})

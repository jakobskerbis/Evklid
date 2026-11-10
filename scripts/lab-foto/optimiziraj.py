#!/usr/bin/env python3
# Izrisi (PNG iz lab_izris.py) → optimizirane slike za aplikacijo:
#   python3 scripts/lab-foto/optimiziraj.py <mapa z izrisi/<poskus>/> [public/sim/foto] [--kakovost 80]
# Za vsak sloj nastaneta gostote 1×, 2× in (če je izris vsaj 3×) 3× (px na enoto risbe; izris z večjim merilom se pomanjša z Lanczosom =
# nadvzorčenje) v WebP in AVIF; sloj debeline je sivinski WebP brez izgub (iz njega se računa barva raztopine).
# meta.json: izrezi slojev, sidra, merila, formati, »nujni« sloji (naložijo se pred prvim prikazom) in velikosti.
# Potrebuje Pillow ≥ 11.3 (AVIF). Veliki izvorni PNG ne gredo v repozitorij.
import json, os, sys
from PIL import Image, features

NUJNI = {
    "titracija": ["celota", "menisk-prazna", "blizu"],
    "dokaz": ["dokaz"],
    "krog": ["krog"],
}


def pomanjsaj(im, w, h):
    if im.size == (w, h):
        return im
    if im.mode == "RGBA":   # pomanjšanje s predmnoženo alfo, da robovi senc ne dobijo temnega obroča
        return im.convert("RGBa").resize((w, h), Image.LANCZOS).convert("RGBA")
    return im.resize((w, h), Image.LANCZOS)


def main():
    a = [x for x in sys.argv[1:] if not x.startswith("--")]
    vir = a[0]; cilj = a[1] if len(a) > 1 else os.path.join(os.path.dirname(__file__), "..", "..", "public", "sim", "foto")
    q = int(sys.argv[sys.argv.index("--kakovost") + 1]) if "--kakovost" in sys.argv else 86
    avif = features.check("avif")
    porocilo = {}
    for poskus in sorted(os.listdir(vir)):
        mp = os.path.join(vir, poskus, "meta.json")
        if not os.path.exists(mp):
            continue
        with open(mp, encoding="utf-8") as f:
            meta = json.load(f)
        izhod = os.path.join(cilj, poskus); os.makedirs(izhod, exist_ok=True)
        for f in os.listdir(izhod):
            os.remove(os.path.join(izhod, f))
        gostote = [g for g in (1, 2, 3) if g <= max(2, meta.get("merilo", 2))]
        velikosti = {g: {"webp": 0, "avif": 0} for g in gostote}
        for ime, s in meta["sloji"].items():
            im = Image.open(os.path.join(vir, poskus, ime + ".png"))
            vrsta = s["vrsta"]
            if vrsta == "debelina":
                im = im.convert("L")
            elif vrsta == "prosojno":
                im = im.convert("RGBA")
            else:
                im = im.convert("RGB")
            for g in gostote:
                m = pomanjsaj(im, s["w"] * g, s["h"] * g)
                osn = os.path.join(izhod, f"{ime}@{g}x")
                if vrsta == "debelina":
                    m.save(osn + ".webp", lossless=True, method=6)
                    n = os.path.getsize(osn + ".webp")
                    velikosti[g]["webp"] += n; velikosti[g]["avif"] += n
                    s["brezIzgub"] = True
                    continue
                m.save(osn + ".webp", quality=q, method=6, alpha_quality=92)
                velikosti[g]["webp"] += os.path.getsize(osn + ".webp")
                if avif:
                    m.save(osn + ".avif", quality=max(40, q - 16), speed=3)
                    velikosti[g]["avif"] += os.path.getsize(osn + ".avif")
        meta["formati"] = ["webp"] + (["avif"] if avif else [])
        meta["nujni"] = NUJNI[poskus]
        meta["gostote"] = gostote
        meta["velikostiKB"] = {f"{g}x": {k: round(v / 1024) for k, v in d.items()} for g, d in velikosti.items()}
        meta.pop("merilo", None)
        with open(os.path.join(izhod, "meta.json"), "w", encoding="utf-8") as f:
            json.dump(meta, f, ensure_ascii=False, separators=(",", ":"))
        porocilo[poskus] = meta["velikostiKB"]
    print(json.dumps(porocilo, ensure_ascii=False))


if __name__ == "__main__":
    main()

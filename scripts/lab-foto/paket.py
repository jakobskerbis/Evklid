#!/usr/bin/env python3
# Paket za izris laboratorija na j-jevem računalniku (mapa peka-rtx, okno peci.bat → koda/rtx.py):
#   python3 scripts/lab-foto/paket.py <kopija trenutne koda/ z računalnika> <izhodna mapa>
# Ustvari <izhod>/lab/ (naše štiri skripte + manifest.json) in <izhod>/koda-nova/{rtx.py, manifest.json}: rtx.py je
# trenutno nameščena datoteka z majhnim popravkom (naloga »lab«), vse druge datoteke koda/ ostanejo iste (v koda-nova
# že so), zato naloge organov in rezin delujejo naprej. Različica »lab-<sha8>«; manifest navaja še »zdruzljivo«
# (različica, iz katere je nastala), da naloga drugega agenta s staro različico ne sproži zamenjave kode.
import hashlib, json, os, shutil, sys

TU = os.path.dirname(os.path.abspath(__file__))
LAB = ("lab_modeli.py", "lab_prizori.py", "lab_izris.py", "lab_naloga.py")


def sha(pot):
    with open(pot, "rb") as f:
        return hashlib.sha256(f.read()).hexdigest()


def popravi_rtx(s):
    def zamenjaj(a, b, n=1):
        nonlocal s
        if s.count(a) != n:
            raise SystemExit(f"rtx.py se je spremenil: pričakoval sem {n}× {a!r}, našel {s.count(a)}×")
        s = s.replace(a, b)
    zamenjaj('def manifest_napaka(mapa, razlicica=None):', 'def manifest_napaka(mapa, razlicica=None, obvezne=None):')
    zamenjaj('    manjka = [k for k in OBVEZNE if k not in dat]', '    manjka = [k for k in (OBVEZNE if obvezne is None else obvezne) if k not in dat]')
    zamenjaj('''def razlicica_kode():''', '''def zdruzljive():
    """Različice, ki jih ta koda v celoti vsebuje (manifest »zdruzljivo«): zanje zamenjava kode ni potrebna."""
    try:
        with open(os.path.join(KODA, "manifest.json"), encoding="utf-8") as f:
            z = json.load(f).get("zdruzljivo") or []
        return [x for x in z if isinstance(x, str)]
    except Exception:
        return []


def razlicica_kode():''')
    zamenjaj('''        if organi == ["rezine"]:  # brez''', '''        if organi == ["lab"]:  # fotorealistični laboratorij: lab/ ob koda/ s svojim manifestom (scripts/lab-foto)
            if not BLENDER or not os.path.exists(BLENDER):
                napaka(f"ni Blenderja ({BLENDER})")
            lab = os.path.join(KOREN, "lab")
            razlog = manifest_napaka(lab, obvezne=("lab_modeli.py", "lab_prizori.py", "lab_izris.py", "lab_naloga.py")) if os.path.isdir(lab) else "ni mape lab"
            if razlog:
                napaka(f"koda lab zavrnjena: {razlog}")
            if lab not in sys.path:
                sys.path.insert(0, lab)
            import lab_naloga
            lab_naloga.naloga(KOREN, BLENDER, st, pisi, pisi_stanje, napaka, preveri_napravo)
        elif organi == ["rezine"]:  # brez''')
    zamenjaj('o not in znani and organi != ["rezine"]]', 'o not in znani and organi not in (["rezine"], ["lab"])]', 2)
    zamenjaj('                if koda and koda != razlicica_kode():', '                if koda and koda != razlicica_kode() and koda not in zdruzljive():')
    return s


def main():
    koda, izhod = sys.argv[1], sys.argv[2]
    with open(os.path.join(koda, "manifest.json"), encoding="utf-8") as f:
        man = json.load(f)
    for k, h in man["datoteke"].items():
        if sha(os.path.join(koda, k)) != h:
            raise SystemExit(f"{k}: kopija koda/ se ne ujema s svojim manifestom")
    os.makedirs(os.path.join(izhod, "lab"), exist_ok=True); os.makedirs(os.path.join(izhod, "koda-nova"), exist_ok=True)
    dat = {}
    for f in LAB:
        shutil.copyfile(os.path.join(TU, f), os.path.join(izhod, "lab", f)); dat[f] = sha(os.path.join(izhod, "lab", f))
    h = hashlib.sha256("".join(sorted(dat.values())).encode()).hexdigest()[:8]
    with open(os.path.join(izhod, "lab", "manifest.json"), "w", encoding="utf-8", newline="\n") as f:
        json.dump({"razlicica": "lab-" + h, "datoteke": dat}, f, indent=1)
    with open(os.path.join(koda, "rtx.py"), encoding="utf-8", newline="") as f:
        rtx = f.read()
    crlf = "\r\n" in rtx
    novo = popravi_rtx(rtx.replace("\r\n", "\n"))
    with open(os.path.join(izhod, "koda-nova", "rtx.py"), "w", encoding="utf-8", newline="\r\n" if crlf else "\n") as f:
        f.write(novo)
    d2 = dict(man["datoteke"]); d2["rtx.py"] = sha(os.path.join(izhod, "koda-nova", "rtx.py"))
    razl = "lab-" + hashlib.sha256((d2["rtx.py"] + h).encode()).hexdigest()[:8]
    stare = [man["razlicica"]] + [x for x in man.get("zdruzljivo", []) if x != man["razlicica"]]
    with open(os.path.join(izhod, "koda-nova", "manifest.json"), "w", encoding="utf-8", newline="\n") as f:
        json.dump({"razlicica": razl, "zdruzljivo": stare, "datoteke": d2}, f, indent=1)
    print(json.dumps({"koda": razl, "lab": "lab-" + h, "zdruzljivo": stare}))


if __name__ == "__main__":
    main()

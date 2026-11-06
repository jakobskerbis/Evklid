# Peka 3D organov na j-jevem prenosniku (Windows, Nvidia RTX). Zažene ga peci.bat z Blenderjevim Pythonom:
#   <python.exe> -X utf8 koda/rtx.py --blender <blender.exe> [organ …] [--naprava OPTIX|CUDA] [--nacrt]
# Mapa paketa (scripts/atlas/rtx/paket.sh): peci.bat, NAVODILO.txt, organi.txt, koda/ (ta datoteka, viri.json,
# peci.py, peka.py, izvozi-organe.py in njegovi moduli). Ustvari: vhodi/ (prenosi iz izvora, preverjeni po SHA-256),
# izhod/<organ>/ (surova mapa za organi.mjs), primerjava/<organ>/ (čista telefonska delovna datoteka za primerjavo
# CPU : GPU na strežniku), dnevnik.txt.
# Organi: argumenti, sicer organi.txt (en organ na vrstico, # komentar), sicer izbira v oknu.
# Naprava: --naprava ali PEKA_NAPRAVA, sicer prva, ki deluje: OPTIX, nato CUDA. Brez grafične kartice se ustavi
# (nikoli tiho na CPU). Ponovni zagon nadaljuje (peci.py .napredek.json; priprava se ne ponovi, če obstaja).
# --nacrt: samo izpiše načrt (organi, manjkajoči vhodi), nič ne prenese in ne peče (test/peka-rtx.test.js).
import hashlib, json, os, re, shutil, subprocess, sys, time, zipfile

KODA = os.path.dirname(os.path.abspath(__file__))
KOREN = os.path.dirname(KODA)
# v paketu so skripte peke ob tej datoteki (koda/), v repozitoriju pa v scripts/atlas/
ATLAS = KODA if os.path.exists(os.path.join(KODA, "peci.py")) else KOREN
VHODI = os.path.join(KOREN, "vhodi")
IZHOD = os.path.join(KOREN, "izhod")
PRIMERJAVA = os.path.join(KOREN, "primerjava")
DNEVNIK = os.path.join(KOREN, "dnevnik.txt")
a = sys.argv[1:]


def _zastava(ime, privzeto=None):
    if ime in a:
        i = a.index(ime); v = a[i + 1]; del a[i:i + 2]; return v
    return privzeto


BLENDER = _zastava("--blender")
NAPRAVA = (_zastava("--naprava") or os.environ.get("PEKA_NAPRAVA") or "").strip().upper()
NACRT = "--nacrt" in a
if NACRT:
    a.remove("--nacrt")


def pisi(s):
    print(s, flush=True)
    if NACRT:  # načrt (test) ne piše dnevnika
        return
    with open(DNEVNIK, "a", encoding="utf-8") as f:
        f.write(time.strftime("%Y-%m-%d %H:%M:%S ") + s + "\n")


def napaka(s):
    pisi("NAPAKA: " + s)
    raise SystemExit(1)


def sha256(pot):
    h = hashlib.sha256()
    with open(pot, "rb") as f:
        for kos in iter(lambda: f.read(1 << 20), b""):
            h.update(kos)
    return h.hexdigest()


def prenesi(url, pot):
    """curl (Windows 10/11 ga ima) z nadaljevanjem prenosa, sicer urllib."""
    zacasna = pot + ".prenos"
    curl = shutil.which("curl")
    if curl:
        r = subprocess.call([curl, "-L", "--fail", "--retry", "5", "--retry-delay", "5", "-C", "-", "-o", zacasna, url])
        if r not in (0, 33):  # 33: strežnik ne podpira nadaljevanja
            napaka(f"prenos ni uspel ({url}, curl {r}). Je internet vklopljen? Zaženi znova.")
    else:
        import urllib.request
        urllib.request.urlretrieve(url, zacasna)
    os.replace(zacasna, pot)


def vhodi(viri):
    """Vsak vhod iz izvora (če ga še ni ali se ne ujema), preverjen po SHA-256; Startup.blend razpakiran iz zipa."""
    for v in viri["vhodi"]:
        mapa = os.path.join(VHODI, v["mapa"]); os.makedirs(mapa, exist_ok=True)
        pot = os.path.join(mapa, v["ime"])
        rz = v.get("razpakiraj")
        if rz and os.path.exists(os.path.join(mapa, rz["ime"])) and sha256(os.path.join(mapa, rz["ime"])) == rz["sha256"]:
            continue  # zip ni več potreben
        if not (os.path.exists(pot) and sha256(pot) == v["sha256"]):
            pisi(f"prenašam {v['ime']} ({v['licenca']}) …")
            prenesi(v["url"], pot)
            if sha256(pot) != v["sha256"]:
                os.remove(pot)
                napaka(f"{v['ime']}: SHA-256 se ne ujema (pokvarjen ali spremenjen prenos), datoteka izbrisana. Zaženi znova.")
            pisi(f"{v['ime']}: preverjeno (SHA-256)")
        if rz:
            cilj = os.path.join(mapa, rz["ime"])
            pisi(f"razpakiram {rz['datoteka']} …")
            with zipfile.ZipFile(pot) as z, z.open(rz["datoteka"]) as src, open(cilj + ".prenos", "wb") as dst:
                shutil.copyfileobj(src, dst, 1 << 20)
            os.replace(cilj + ".prenos", cilj)
            if sha256(cilj) != rz["sha256"]:
                napaka(f"{rz['ime']}: SHA-256 se ne ujema po razpakiranju")
            os.remove(pot)
    return os.path.join(VHODI, "Startup.blend")


def organi_v_kodi():
    with open(os.path.join(ATLAS, "izvozi-organe.py"), encoding="utf-8") as f:
        return re.findall(r'^    "(\w+)": dict\(', f.read(), re.M)


def izberi_organe(znani):
    izbrani = list(a)
    pot = os.path.join(KOREN, "organi.txt")
    if not izbrani and os.path.exists(pot):
        with open(pot, encoding="utf-8-sig") as f:
            izbrani = [v.split("#")[0].strip() for v in f if v.split("#")[0].strip()]
    if not izbrani and not NACRT:
        print("\nKateri organ naj spečem?")
        for i, o in enumerate(znani, 1):
            print(f"  {i}  {o}")
        izb = input("Vpiši številko in pritisni Enter: ").strip()
        if izb.isdigit() and 1 <= int(izb) <= len(znani):
            izbrani = [znani[int(izb) - 1]]
    for o in izbrani:
        if o not in znani:
            napaka(f"organa »{o}« ni v izvozi-organe.py (znani: {', '.join(znani)})")
    return izbrani


def blender_ukaz(*arg):
    return [BLENDER, "-b", "--factory-startup", "--python-exit-code", "1"] + list(arg)


def preveri_napravo():
    """Različica Blenderja in grafična kartica: OPTIX ali CUDA, ki ju Cycles res vidi."""
    koda = ("import bpy, json\n"
            "cp = bpy.context.preferences.addons['cycles'].preferences\n"
            "out = {'razlicica': bpy.app.version_string, 'naprave': {}}\n"
            "for t in ('OPTIX', 'CUDA'):\n"
            "    try:\n"
            "        cp.compute_device_type = t; cp.get_devices()\n"
            "        out['naprave'][t] = [d.name for d in cp.devices if d.type == t]\n"
            "    except Exception as e:\n"
            "        out['naprave'][t] = []\n"
            "print('RTX-NAPRAVE ' + json.dumps(out))\n")
    r = subprocess.run(blender_ukaz("--python-expr", koda), capture_output=True, text=True, encoding="utf-8", errors="replace")
    vrstica = next((v for v in r.stdout.splitlines() if v.startswith("RTX-NAPRAVE ")), None)
    if vrstica is None:
        napaka(f"Blender se ni zagnal ({BLENDER}).\n{r.stdout[-1500:]}{r.stderr[-1500:]}")
    info = json.loads(vrstica[len("RTX-NAPRAVE "):])
    return info["razlicica"], info["naprave"]


def main():
    with open(os.path.join(KODA, "viri.json"), encoding="utf-8") as f:
        viri = json.load(f)
    znani = organi_v_kodi()
    organi = izberi_organe(znani)
    if NACRT:
        manjka = [v["ime"] for v in viri["vhodi"] if not os.path.exists(os.path.join(VHODI, v["mapa"], v.get("razpakiraj", v)["ime"]))]
        print(json.dumps({"organi": organi, "znani": znani, "manjka": manjka, "blender": viri["blender"]["razlicica"]}, ensure_ascii=False))
        return
    if not organi:
        napaka("ni izbranega organa (vpiši ga v organi.txt)")
    if not BLENDER or not os.path.exists(BLENDER):
        napaka(f"ni Blenderja ({BLENDER})")
    pisi(f"začetek: organi {', '.join(organi)}")
    if os.name == "nt":  # računalnik med peko ne zaspi (zaslon sme ugasniti)
        import ctypes
        ctypes.windll.kernel32.SetThreadExecutionState(0x80000000 | 0x00000001)
    razl, naprave = preveri_napravo()
    pisi(f"Blender {razl}; OPTIX: {naprave['OPTIX'] or '-'}; CUDA: {naprave['CUDA'] or '-'}")
    if not razl.startswith(viri["blender"]["razlicica"]):
        pisi(f"OPOZORILO: strežnik peče z Blender {viri['blender']['razlicica']}, tu je {razl} (rezultat se lahko malo razlikuje)")
    if NAPRAVA:
        if NAPRAVA not in naprave or not naprave[NAPRAVA]:
            napaka(f"naprava {NAPRAVA} ni na voljo")
        nap = NAPRAVA
    else:
        nap = next((t for t in ("OPTIX", "CUDA") if naprave.get(t)), None)
    if nap is None:
        napaka("Blender ne vidi grafične kartice Nvidia. Posodobi gonilnik: aplikacija »NVIDIA App« → Gonilniki → Prenesi "
               "(ali www.nvidia.com/drivers), ponovno zaženi računalnik in znova dvakrat klikni peci.bat. Prenosnik naj bo na polnilcu.")
    startup = vhodi(viri)
    env = dict(os.environ, PEKA_NAPRAVA=nap, PEKA_BLENDER=BLENDER, PEKA_NITI=str(os.cpu_count() or 4))
    for organ in organi:
        t0 = time.time()
        surova = os.path.join(IZHOD, organ); os.makedirs(surova, exist_ok=True)
        dela = [os.path.join(surova, f"{organ}{p}.delo.blend.json") for p in ("", "-telefon")]
        ukaz = [sys.executable, os.path.join(ATLAS, "peci.py"), surova, organ]
        if not all(os.path.exists(d) for d in dela):
            for f in os.listdir(surova):  # nedokončana priprava: začni na čisto
                if ".delo.blend" in f:
                    os.remove(os.path.join(surova, f))
            ukaz += ["--priprava", startup, "--mri", os.path.join(VHODI, "mri"), "--hra", os.path.join(VHODI, "hra")]
        pisi(f"{organ}: peka na {nap} …")
        r = subprocess.call(ukaz, env=env)
        if r:
            napaka(f"{organ}: peka ni uspela (glej izhod/{organ}/{organ}.blender.log)")
        prim = os.path.join(PRIMERJAVA, organ); os.makedirs(prim, exist_ok=True)
        for k in ("", ".json"):  # telefonska delovna datoteka brez slik in napredka: strežnik jo speče na CPU
            shutil.copy2(os.path.join(surova, f"{organ}-telefon.delo.blend{k}"), prim)
        with open(os.path.join(surova, "GOTOVO.txt"), "w", encoding="utf-8") as f:
            json.dump({"organ": organ, "naprava": nap, "kartica": naprave[nap], "blender": razl,
                       "sekund": round(time.time() - t0), "konec": time.strftime("%Y-%m-%d %H:%M:%S")}, f, ensure_ascii=False, indent=1)
        pisi(f"{organ}: končano v {(time.time() - t0) / 60:.0f} min")
    pisi("vse končano")


if __name__ == "__main__":
    main()

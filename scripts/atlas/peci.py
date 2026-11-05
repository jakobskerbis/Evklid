# Vodi peko PBR tekstur po delih (peka.py) z nadzorom pomnilnika: vsak korak je svoj proces Blenderja (bpy), ki se
# po koncu zapre, zato poraba ne raste; pred zagonom počaka na dovolj prostega pomnilnika, med korakom meri porabo
# (najvišji RSS v dnevnik) in korak ustavi, če preseže mejo. Napredek se shranjuje: po prekinitvi (ponovni zagon
# strežnika) ponovni zagon nadaljuje pri prvem nedokončanem koraku. Skupno za vse modele s »tekstura.pbr«.
# Zagon: python3 scripts/atlas/peci.py <surova mapa> <organ> [--priprava <Startup.blend>] [--samo -telefon|""]
#   --priprava: najprej izvozi-organe.py (izbira mrež, lastna geometrija, maske, UV, <organ>[-telefon].delo.blend)
# Okolje: PEKA_NITI (privzeto 2), PEKA_KOS (ploskev visoke mreže na proces, privzeto 400000), PEKA_MEJA_MB (2600),
# PEKA_PROSTO_MB (koliko mora biti prostega pred korakom, privzeto 3000).
# Nato: node scripts/atlas/organi.mjs <surova mapa> <organ> (WebP, kvantizacija, vpis v public/3d/modeli/organi-3d/).
import json, os, subprocess, sys, time

TU = os.path.dirname(os.path.abspath(__file__))
a = sys.argv[1:]
surova, organ = a[0], a[1]
PRIPRAVA = a[a.index("--priprava") + 1] if "--priprava" in a else None
SAMO = a[a.index("--samo") + 1] if "--samo" in a else None
KOS = int(os.environ.get("PEKA_KOS", "400000"))
MEJA = int(os.environ.get("PEKA_MEJA_MB", "2600"))
PROSTO = int(os.environ.get("PEKA_PROSTO_MB", "3000"))
DNEVNIK = os.path.join(surova, f"{organ}.peka.log")


def pisi(s):
    print(s, flush=True)
    with open(DNEVNIK, "a", encoding="utf-8") as f:
        f.write(time.strftime("%H:%M:%S ") + s + "\n")


def prosto_mb():
    with open("/proc/meminfo") as f:
        for v in f:
            if v.startswith("MemAvailable:"):
                return int(v.split()[1]) // 1024
    return 0


def rss_mb(pid):
    try:
        with open(f"/proc/{pid}/status") as f:
            for v in f:
                if v.startswith("VmRSS:"):
                    return int(v.split()[1]) // 1024
    except OSError:
        pass
    return 0


def zazeni(ime, ukaz):
    while prosto_mb() < PROSTO:
        pisi(f"čakam na pomnilnik ({prosto_mb()} MB prosto, potrebno {PROSTO} MB)")
        time.sleep(30)
    t0 = time.time()
    with open(os.path.join(surova, f"{organ}.blender.log"), "a") as izh:
        p = subprocess.Popen(ukaz, stdout=izh, stderr=subprocess.STDOUT)
        vrh = 0
        while p.poll() is None:
            vrh = max(vrh, rss_mb(p.pid))
            if vrh > MEJA:
                p.kill(); p.wait()
                raise SystemExit(f"{ime}: pomnilnik {vrh} MB > {MEJA} MB, ustavljeno (manjši PEKA_KOS)")
            time.sleep(1)
    pisi(f"{ime}: {time.time() - t0:.0f} s, največ {vrh} MB, izhod {p.returncode}")
    if p.returncode:
        raise SystemExit(f"{ime}: napaka (glej {organ}.blender.log)")


if PRIPRAVA:
    zazeni("priprava", [sys.executable, os.path.join(TU, "izvozi-organe.py"), "--", surova, "--blend", PRIPRAVA, organ])

for pripona in ("", "-telefon"):
    if SAMO is not None and pripona != SAMO:
        continue
    delo = os.path.join(surova, f"{organ}{pripona}.delo.blend")
    with open(delo + ".json", encoding="utf-8") as f:
        meta = json.load(f)
    nap_pot = delo + ".napredek.json"
    narejeno = set(json.load(open(nap_pot)) if os.path.exists(nap_pot) else [])

    def opravi(kljuc, ukaz):
        if kljuc in narejeno:
            return
        zazeni(f"{organ}{pripona} {kljuc}", [sys.executable, os.path.join(TU, "peka.py"), "--", delo] + ukaz)
        narejeno.add(kljuc)
        json.dump(sorted(narejeno), open(nap_pot, "w"))

    # površina: kosi po oceni ploskev visoke mreže (večje vozlišče je kos zase)
    kosi, kos, vsota = [], [], 0
    for v in sorted(meta["vozlisca"], key=lambda v: -v["visoka"]):
        if kos and vsota + v["visoka"] > KOS:
            kosi.append(kos); kos, vsota = [], 0
        kos.append(v["ime"]); vsota += v["visoka"]
    if kos:
        kosi.append(kos)
    for i, k in enumerate(kosi):
        opravi(f"povrsina-{i}", ["povrsina"] + k)
    # senca okolice: dva kosa (vsa vozlišča so ovire v obeh)
    imena = [v["ime"] for v in meta["vozlisca"]]
    pol = len(imena) // 2
    for i, k in enumerate((imena[:pol], imena[pol:])):
        opravi(f"senca-{i}", ["senca"] + k)
    opravi("zakljuci", ["zakljuci", os.path.join(surova, f"{organ}{pripona}.glb")])
pisi("končano")

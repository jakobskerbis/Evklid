# Vodi peko PBR tekstur po delih (peka.py) z nadzorom pomnilnika: vsak korak je svoj proces Blenderja (bpy), ki se
# po koncu zapre, zato poraba ne raste; pred zagonom počaka na dovolj prostega pomnilnika, med korakom meri porabo
# (najvišji RSS v dnevnik) in korak ustavi, če preseže mejo. Napredek se shranjuje: po prekinitvi (ponovni zagon
# strežnika) ponovni zagon nadaljuje pri prvem nedokončanem koraku. Skupno za vse modele s »tekstura.pbr«.
# Zagon: python3 scripts/atlas/peci.py <surova mapa> <organ> [--priprava <Startup.blend>] [--mri <mapa>] [--hra <mapa>]
#        [--samo -telefon|""]
#   --priprava: najprej izvozi-organe.py (izbira mrež, lastna geometrija, maske, UV, <organ>[-telefon].delo.blend);
#   --mri, --hra: vhodi za izvozi-organe.py (možgani: FreeSurfer MRI, oko/ledvica: HuBMAP HRA).
# Okolje: PEKA_NITI (privzeto 2), PEKA_KOS (ploskev visoke mreže na proces, privzeto 400000 na CPU, 1500000 na GPU),
# PEKA_MEJA_MB (2600), PEKA_PROSTO_MB (koliko mora biti prostega pred korakom, privzeto 3000),
# PEKA_NAPRAVA (CPU privzeto | OPTIX | CUDA, peka.naprava), PEKA_BLENDER (pot do blender[.exe]: korake zažene
# »blender -b --python …« namesto sys.executable z modulom bpy; tako na Windows, scripts/atlas/rtx/).
# Nadzor pomnilnika bere /proc (Linux); kjer ga ni (Windows), ga preskoči in to zapiše v dnevnik.
# Nato: node scripts/atlas/organi.mjs <surova mapa> <organ> (WebP, kvantizacija, vpis v public/3d/modeli/organi-3d/).
import json, os, subprocess, sys, time

TU = os.path.dirname(os.path.abspath(__file__))
a = sys.argv[1:]
surova, organ = a[0], a[1]


def _zastava(ime):
    return a[a.index(ime) + 1] if ime in a else None


PRIPRAVA, MRI, HRA, SAMO = _zastava("--priprava"), _zastava("--mri"), _zastava("--hra"), _zastava("--samo")
GPU = os.environ.get("PEKA_NAPRAVA", "CPU").strip().upper() not in ("", "CPU")
KOS = int(os.environ.get("PEKA_KOS", "1500000" if GPU else "400000"))
MEJA = int(os.environ.get("PEKA_MEJA_MB", "2600"))
PROSTO = int(os.environ.get("PEKA_PROSTO_MB", "3000"))
BLENDER = os.environ.get("PEKA_BLENDER")
NADZOR = os.path.exists("/proc/meminfo")
UTF8 = "import sys\nfor s in (sys.stdout, sys.stderr): s.reconfigure(encoding='utf-8', errors='replace')"
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


def ukaz(skripta, argumenti):
    """Ukaz za en korak: Blender (PEKA_BLENDER, brez okna, izhodna koda 1 ob napaki v skripti) ali Python z bpy."""
    if BLENDER:  # izpis v UTF-8 (Windows sicer cp1252: »č« v print bi ustavil korak)
        return [BLENDER, "-b", "--factory-startup", "--python-exit-code", "1", "--python-expr", UTF8, "--python", skripta, "--"] + argumenti
    return [sys.executable, skripta, "--"] + argumenti


def zazeni(ime, ukaz):
    while NADZOR and prosto_mb() < PROSTO:
        pisi(f"čakam na pomnilnik ({prosto_mb()} MB prosto, potrebno {PROSTO} MB)")
        time.sleep(30)
    t0 = time.time()
    with open(os.path.join(surova, f"{organ}.blender.log"), "ab") as izh:
        p = subprocess.Popen(ukaz, stdout=izh, stderr=subprocess.STDOUT)
        vrh = 0
        while p.poll() is None:
            if NADZOR:
                vrh = max(vrh, rss_mb(p.pid))
                if vrh > MEJA:
                    p.kill(); p.wait()
                    raise SystemExit(f"{ime}: pomnilnik {vrh} MB > {MEJA} MB, ustavljeno (manjši PEKA_KOS)")
            time.sleep(1)
    pisi(f"{ime}: {time.time() - t0:.0f} s, " + (f"največ {vrh} MB, " if NADZOR else "") + f"izhod {p.returncode}")
    if p.returncode:
        raise SystemExit(f"{ime}: napaka (glej {organ}.blender.log)")


if not NADZOR:
    pisi("nadzor pomnilnika izklopljen (ni /proc, npr. Windows)")
if GPU:
    pisi(f"naprava {os.environ['PEKA_NAPRAVA'].strip().upper()}, kos {KOS} ploskev")

if PRIPRAVA:
    dodatno = ["--blend", PRIPRAVA] + (["--mri", MRI] if MRI else []) + (["--hra", HRA] if HRA else [])
    zazeni("priprava", ukaz(os.path.join(TU, "izvozi-organe.py"), [surova] + dodatno + [organ]))

for pripona in ("", "-telefon"):
    if SAMO is not None and pripona != SAMO:
        continue
    delo = os.path.join(surova, f"{organ}{pripona}.delo.blend")
    if not os.path.exists(delo + ".json"):
        raise SystemExit(f"ni {delo}.json: organ »{organ}« nima nastavitve tekstura.pbr v izvozi-organe.py "
                         "ali priprava ni stekla (--priprava <Startup.blend>)")
    with open(delo + ".json", encoding="utf-8") as f:
        meta = json.load(f)
    nap_pot = delo + ".napredek.json"
    narejeno = set(json.load(open(nap_pot)) if os.path.exists(nap_pot) else [])

    def opravi(kljuc, argumenti):
        if kljuc in narejeno:
            return
        zazeni(f"{organ}{pripona} {kljuc}", ukaz(os.path.join(TU, "peka.py"), [delo] + argumenti))
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

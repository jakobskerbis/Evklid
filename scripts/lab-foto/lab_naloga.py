# Naloga »lab« za izris na j-jevem računalniku z Nvidia RTX (okno peci.bat → koda/rtx.py jo pokliče, ko je v
# naloga.txt "organi": ["lab"]). Mapa lab/ ob koda/ ima svoj manifest.json (SHA-256 vsake datoteke), ki ga rtx.py
# preveri pred zagonom; koda/ drugih nalog (organi, rezine) ostane nedotaknjena.
# naloga.txt: {"id": "lab1", "organi": ["lab"], "koda": "<različica>",
#              "lab": {"poskusi": ["titracija", "dokaz", "krog"], "vzorci": 512, "merilo": 4}}
#   poskusi: podmnožica treh; vzorci 16–4096; merilo 1–4 (px na enoto risbe; 4 = nadvzorčenje za 2×).
#   Samo ta polja, vsa preverjena; nič iz naloge se ne izvede kot ukaz. Izhod: izhod/lab-<id>/<poskus>/*.png + meta.json.
# Ponovna naloga z istim id nadaljuje (že izrisani sloji se preskočijo). Napredek: stanje.json → lab.
import json, os, re, subprocess, time

TU = os.path.dirname(os.path.abspath(__file__))
POSKUSI = ("titracija", "dokaz", "krog")


def preveri_nalogo(n):
    if not isinstance(n, dict):
        raise ValueError("»lab« mora biti objekt")
    poskusi = n.get("poskusi", list(POSKUSI))
    if not isinstance(poskusi, list) or not poskusi or any(p not in POSKUSI for p in poskusi):
        raise ValueError(f"poskusi morajo biti iz {POSKUSI}")
    vzorci, merilo = n.get("vzorci", 512), n.get("merilo", 4)
    if not (isinstance(vzorci, int) and 16 <= vzorci <= 4096):
        raise ValueError("vzorci morajo biti celo število 16–4096")
    if not (isinstance(merilo, int) and 1 <= merilo <= 4):
        raise ValueError("merilo mora biti 1–4")
    return {"poskusi": list(dict.fromkeys(poskusi)), "vzorci": vzorci, "merilo": merilo}


def naloga(koren, blender, st, pisi, pisi_stanje, napaka, preveri_napravo=None):
    with open(os.path.join(koren, "naloga.txt"), encoding="utf-8-sig") as f:
        surova = json.load(f)
    try:
        n = preveri_nalogo(surova.get("lab"))
    except ValueError as e:
        napaka(f"naloga lab zavrnjena: {e}")
    nid = st.get("naloga") or "rocno"
    if not re.fullmatch(r"[A-Za-z0-9_-]{1,40}", nid):
        napaka("naloga lab zavrnjena: neveljaven id")
    nap = None
    if preveri_napravo:
        razl, naprave = preveri_napravo()
        nap = next((t for t in ("OPTIX", "CUDA") if naprave.get(t)), None)
        st.update(blender=razl, naprava=nap, kartica=naprave.get(nap) if nap else None)
    if nap is None and os.environ.get("RTX_DOVOLI_CPU") == "1":
        nap = "CPU"
    if nap is None:
        napaka("lab: Blender ne vidi grafične kartice Nvidia (OPTIX/CUDA)")
    izhod = os.path.join(koren, "izhod", f"lab-{nid}")
    os.makedirs(izhod, exist_ok=True)
    r = st["lab"] = {"naloga": n, "naprava": nap, "izhod": os.path.relpath(izhod, koren), "koncani": [], "poskus": None, "sloj": None}
    pisi_stanje(st)
    for poskus in n["poskusi"]:
        t0 = time.time()
        mapa = os.path.join(izhod, poskus)
        r.update(poskus=poskus, sloj=None, od=None)
        pisi(f"lab {poskus}: izris na {nap}, {n['vzorci']} vzorcev, merilo {n['merilo']} …")
        ukaz = [blender, "-b", "--factory-startup", "--python-exit-code", "1", "--python", os.path.join(TU, "lab_izris.py"), "--",
                poskus, mapa, "--vzorci", str(n["vzorci"]), "--merilo", str(n["merilo"]), "--naprava", nap]
        with open(os.path.join(izhod, poskus + ".blender.log"), "a", encoding="utf-8", errors="replace") as dn:
            p = subprocess.Popen(ukaz, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, encoding="utf-8", errors="replace",
                                 env=dict(os.environ, PYTHONDONTWRITEBYTECODE="1"))
            for vrstica in p.stdout:
                dn.write(vrstica)
                m = re.match(r"LAB-SLOJ (\d+)/(\d+) (\S+) (\d+)", vrstica)
                if m:
                    r.update(sloj=int(m.group(1)), od=int(m.group(2)), ime=m.group(3), sekund=round(time.time() - t0))
            koda = p.wait()
        if koda or not os.path.exists(os.path.join(mapa, "meta.json")):
            napaka(f"lab {poskus}: izris ni uspel (izhod {koda}; glej izhod/lab-{nid}/{poskus}.blender.log)")
        r["koncani"].append({"poskus": poskus, "sekund": round(time.time() - t0)})
        pisi(f"lab {poskus}: končano v {(time.time() - t0) / 60:.1f} min")
        pisi_stanje(st)
    with open(os.path.join(izhod, "GOTOVO.txt"), "w", encoding="utf-8") as f:
        json.dump({"naloga": n, "naprava": nap, "koncani": r["koncani"], "konec": time.strftime("%Y-%m-%d %H:%M:%S")}, f, ensure_ascii=False, indent=1)
    r.update(poskus=None, sloj=None)

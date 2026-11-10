# Naloga »rezine« za peko na j-jevem računalniku (scripts/atlas/rtx/rtx.py jo pokliče, ko je v naloga.txt
# "organi": ["rezine"]): barvne kriorezine iz uradnega vira NLM (rezine_viri.json) → vhodi/vhp/<spol>/*.png, nato
# Blender (zaradi branja PNG in pisanja WebP; numpy je v njegovem Pythonu) zažene rezine.py.
# naloga.txt: {"id": "rz1", "organi": ["rezine"], "koda": "<različica>",
#              "rezine": {"spol": "z", "od": 1380, "do": 1440, "podrobno": true, "prenos": true, "obdelava": true}}
#   spol m|z; od/do: številke rezin (1 mm; privzeto celo telo); podrobno: ploščice v polni ločljivosti 0,33 mm;
#   prenos/obdelava: false preskoči korak. Samo ta polja, vsa preverjena; nič iz naloge se ne izvede kot ukaz.
#   »rezine« je lahko tudi seznam takih opravil (največ 4), ki se izvedejo po vrsti.
# Prenos se nadaljuje po prekinitvi (curl -C -, datoteka velja šele, ko ima velikost iz seznama strežnika); prostor na
# disku se preveri pred prenosom in pred obdelavo in zapiše v stanje.json (st["rezine"]["disk"]).
# Samostojno (strežnik, preizkus): python3 rezine_prenos.py <koren> <spol> [od do] [--brez-obdelave]
import json, os, re, shutil, subprocess, sys, threading, time
from concurrent.futures import ThreadPoolExecutor

TU = os.path.dirname(os.path.abspath(__file__))
NITI = int(os.environ.get("REZINE_NITI", "6"))
REZERVA_GB = float(os.environ.get("REZINE_REZERVA_GB", "8"))  # toliko mora ostati prosto po vsem


def viri():
    with open(os.path.join(TU, "rezine_viri.json"), encoding="utf-8") as f:
        return json.load(f)


def preveri_nalogo(n):
    """Polje »rezine« iz naloga.txt → očiščen slovar ali ValueError."""
    if not isinstance(n, dict):
        raise ValueError("»rezine« mora biti objekt")
    v = viri()
    spol = n.get("spol")
    if spol not in v["telesa"]:
        raise ValueError("spol mora biti m ali z")
    t = v["telesa"][spol]
    od, do = n.get("od", t["od"]), n.get("do", t["do"])
    if not (isinstance(od, int) and isinstance(do, int) and t["od"] <= od <= do <= t["do"]):
        raise ValueError(f"od/do morata biti celi števili med {t['od']} in {t['do']}")
    out = {"spol": spol, "od": od, "do": do}
    for k, privzeto in (("podrobno", False), ("prenos", True), ("obdelava", True), ("pocisti", False)):
        x = n.get(k, privzeto)
        if not isinstance(x, bool):
            raise ValueError(f"{k} mora biti true ali false")
        out[k] = x
    neznana = set(n) - set(out)
    if neznana:
        raise ValueError(f"neznana polja: {', '.join(sorted(neznana))}")
    return out


def _curl():
    if os.name == "nt":
        pot = os.path.join(os.environ.get("SystemRoot", r"C:\Windows"), "System32", "curl.exe")
        return pot if os.path.exists(pot) else None
    return shutil.which("curl")


def _beri_url(url):
    c = _curl()
    if c:
        return subprocess.run([c, "-sS", "-L", "--fail", "--retry", "5", "--retry-delay", "5", "-m", "180", url],
                              capture_output=True, check=True).stdout.decode("utf-8", "replace")
    import urllib.request
    with urllib.request.urlopen(url, timeout=180) as r:
        return r.read().decode("utf-8", "replace")


def seznam(spol, od, do, predpomnilnik=None):
    """[(ime, url, velikost)] vseh rezin telesa med od in do (vsaka enkrat, iz prvega predela, ki jo ima)."""
    v = viri(); t = v["telesa"][spol]
    vse = {}
    if predpomnilnik and os.path.exists(predpomnilnik):
        with open(predpomnilnik, encoding="utf-8") as f:
            vse = json.load(f)
    else:
        for p in v["predeli"]:
            u = v["osnova"] + t["mapa"] + p + "/"
            for ime, vel in re.findall(r"href='(" + re.escape(t["predpona"]) + r"\d{4}[a-c]?\.png)'>[^<]*</a></td><td class='size'>(\d+)<", _beri_url(u + "index.html")):
                vse.setdefault(ime, [u + ime, int(vel)])
        if not vse:
            raise RuntimeError("seznam rezin na strežniku NLM je prazen (se je oblika strani spremenila?)")
        if predpomnilnik:
            os.makedirs(os.path.dirname(predpomnilnik), exist_ok=True)
            with open(predpomnilnik + ".del", "w", encoding="utf-8") as f:
                json.dump(vse, f)
            os.replace(predpomnilnik + ".del", predpomnilnik)
    out = []
    for n in range(od, do + 1):
        for s in t["podrezine"]:
            ime = f"{t['predpona']}{n}{s}.png"
            if ime in vse:
                out.append((ime, vse[ime][0], vse[ime][1]))
    return out


def prenesi_vse(dat, mapa, napredek=None):
    """Manjkajoče datoteke s curl -C - (nadaljevanje), NITI hkrati. Vrne seznam imen, ki niso uspela."""
    os.makedirs(mapa, exist_ok=True)
    c = _curl()
    manjka = [d for d in dat if not (os.path.exists(os.path.join(mapa, d[0])) and os.path.getsize(os.path.join(mapa, d[0])) == d[2])]
    stanje = {"vseh": len(dat), "manjka": len(manjka), "preneseno": 0, "bajtov": 0, "napake": 0}
    kljuc = threading.Lock(); slabe = []

    def ena(d):
        ime, url, vel = d
        pot = os.path.join(mapa, ime); zac = pot + ".del"
        ok = False
        for _ in range(4):
            try:
                if os.path.exists(zac) and os.path.getsize(zac) > vel:
                    os.remove(zac)
                if c:
                    subprocess.call([c, "-sS", "-L", "--fail", "--retry", "5", "--retry-delay", "5", "--connect-timeout", "30",
                                     "--speed-limit", "2000", "--speed-time", "60", "-C", "-", "-o", zac, url],
                                    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                else:
                    import urllib.request
                    ze = os.path.getsize(zac) if os.path.exists(zac) else 0
                    rq = urllib.request.Request(url, headers={"Range": f"bytes={ze}-"} if ze else {})
                    with urllib.request.urlopen(rq, timeout=120) as r, open(zac, "ab" if ze and r.status == 206 else "wb") as f:
                        shutil.copyfileobj(r, f, 1 << 20)
                if os.path.exists(zac) and os.path.getsize(zac) == vel:
                    os.replace(zac, pot); ok = True; break
            except Exception:
                pass
            time.sleep(5)
        with kljuc:
            if ok:
                stanje["preneseno"] += 1; stanje["bajtov"] += vel
            else:
                stanje["napake"] += 1; slabe.append(ime)
            if napredek:
                napredek(dict(stanje))

    with ThreadPoolExecutor(NITI) as ex:
        list(ex.map(ena, manjka))
    return slabe


def disk(koren):
    d = shutil.disk_usage(koren)
    return {"prosto_gb": round(d.free / 1e9, 1), "skupaj_gb": round(d.total / 1e9, 1), "cas": time.strftime("%Y-%m-%d %H:%M:%S")}


def potreba_gb(spol, dat, mapa, podrobno):
    """Ocena prostora: še neprenesene rezine + delovne datoteke + izhod."""
    prenos = sum(d[2] for d in dat if not os.path.exists(os.path.join(mapa, d[0]))) / 1e9
    mm = len(dat) / len(viri()["telesa"][spol]["podrezine"])
    delo = mm * 1.2e-3 + len(dat) * 0.13e-3          # volumen 1 mm (RGBA cele slike) + sličice za barve
    izhod = mm * 0.12e-3 + (mm * 2.6e-3 + 2.5 if podrobno else 0)  # ploščice; pasovi za sagitalno/frontalno
    return {"prenos": round(prenos, 1), "delo": round(delo, 1), "izhod": round(izhod, 1)}


def naloga(koren, blender, st, pisi, pisi_stanje, napaka, python=None):
    """Kliče jo rtx.py (opravi). »rezine« v naloga.txt je eno opravilo ali seznam (največ 4, po vrsti; npr. ženska,
    nato moški). st["rezine"] se sproti dopolnjuje; utrip rtx.py ga piše v stanje.json."""
    with open(os.path.join(koren, "naloga.txt"), encoding="utf-8-sig") as f:
        surova = json.load(f).get("rezine")
    seznam_ = surova if isinstance(surova, list) else [surova]
    try:
        if not 1 <= len(seznam_) <= 4:
            raise ValueError("seznam opravil ima lahko 1 do 4 vnose")
        opravila = [preveri_nalogo(x) for x in seznam_]
    except ValueError as e:
        napaka(f"naloga rezine zavrnjena: {e}")
    koncana = []
    for n in opravila:
        _eno(koren, blender, st, pisi, pisi_stanje, napaka, python, n, koncana)
        koncana.append({k: st["rezine"].get(k) for k in ("naloga", "izhod", "disk")})


def _eno(koren, blender, st, pisi, pisi_stanje, napaka, python, n, koncana):
    nid = st.get("naloga") or "rocno"
    spol = n["spol"]
    vh = os.path.join(koren, "vhodi", "vhp", spol)
    delo = os.path.join(koren, "rezine-delo", f"{spol}-{n['od']}-{n['do']}")
    cel = (n["od"], n["do"]) == (viri()["telesa"][spol]["od"], viri()["telesa"][spol]["do"])
    izhod = os.path.join(koren, "izhod", "rezine" if cel else f"rezine-{nid}", spol)
    r = st["rezine"] = {"naloga": n, "korak": "seznam", "izhod": os.path.relpath(izhod, koren), "disk": disk(koren), "koncana": koncana}
    pisi_stanje(st)
    dat = seznam(spol, n["od"], n["do"], os.path.join(koren, "vhodi", "vhp", f"seznam-{spol}.json"))
    p = potreba_gb(spol, dat, vh, n["podrobno"])
    r["disk"].update(potrebno_gb=p, rezin=len(dat))
    skupaj = sum(p.values()) if n["obdelava"] else p["prenos"]
    pisi(f"rezine {spol} {n['od']}–{n['do']}: {len(dat)} datotek; disk prosto {r['disk']['prosto_gb']} GB, potrebno {skupaj:.1f} GB {p}")
    if r["disk"]["prosto_gb"] < skupaj + REZERVA_GB:
        napaka(f"rezine: na disku je {r['disk']['prosto_gb']} GB, potrebno {skupaj:.1f} GB + {REZERVA_GB:g} GB rezerve")
    if n["prenos"]:
        r["korak"] = "prenos"; t0 = time.time()
        slabe = prenesi_vse(dat, vh, lambda s: r.update(prenos=dict(s, gb=round(s["bajtov"] / 1e9, 2), min=round((time.time() - t0) / 60))))
        r["disk"].update(disk(koren))
        if slabe:
            napaka(f"rezine: {len(slabe)} datotek ni bilo mogoče prenesti (npr. {slabe[0]}); ista naloga z novim id nadaljuje prenos")
        pisi(f"rezine: prenos končan ({len(dat)} datotek)")
    if n["obdelava"]:
        r["korak"] = "obdelava"
        os.makedirs(delo, exist_ok=True); os.makedirs(izhod, exist_ok=True)
        nap = os.path.join(delo, "napredek.json")
        arg = [os.path.join(TU, "rezine.py"), "--", "--vhod", vh, "--delo", delo, "--izhod", izhod, "--spol", spol,
               "--od", str(n["od"]), "--do", str(n["do"])] + (["--podrobno"] if n["podrobno"] else [])
        ukaz = ([blender, "-b", "--factory-startup", "--python-exit-code", "1", "--python"] + arg) if blender else [python or sys.executable, arg[0]] + arg[2:]
        konec = threading.Event()

        def beri():
            while not konec.wait(20):
                try:
                    with open(nap, encoding="utf-8") as f:
                        r["obdelava"] = json.load(f)
                except (OSError, ValueError):
                    pass
        threading.Thread(target=beri, daemon=True).start()
        with open(os.path.join(delo, "rezine.log"), "a", encoding="utf-8") as log:
            koda = subprocess.call(ukaz, stdout=log, stderr=subprocess.STDOUT, env=dict(os.environ, PYTHONDONTWRITEBYTECODE="1"))
        konec.set()
        try:
            with open(nap, encoding="utf-8") as f:
                r["obdelava"] = json.load(f)
        except (OSError, ValueError):
            pass
        r["disk"].update(disk(koren))
        if koda:
            napaka(f"rezine: obdelava ni uspela (izhod {koda}; glej {os.path.relpath(delo, koren)}/rezine.log); ista naloga z novim id nadaljuje")
        if n["pocisti"]:
            shutil.rmtree(delo, ignore_errors=True)
        pisi(f"rezine: obdelava končana → {r['izhod']}")
    r["korak"] = "končano"


if __name__ == "__main__":
    a = sys.argv[1:]
    brez = "--brez-obdelave" in a
    a = [x for x in a if not x.startswith("--")]
    koren, spol = a[0], a[1]
    t = viri()["telesa"][spol]
    od, do = (int(a[2]), int(a[3])) if len(a) > 3 else (t["od"], t["do"])
    os.makedirs(koren, exist_ok=True)
    with open(os.path.join(koren, "naloga.txt"), "w", encoding="utf-8") as f:
        json.dump({"id": "rocno", "organi": ["rezine"], "rezine": {"spol": spol, "od": od, "do": do, "obdelava": not brez,
                                                                    "podrobno": "--podrobno" in sys.argv}}, f)
    st = {"naloga": "rocno"}

    def _napaka(s):
        print("NAPAKA:", s); raise SystemExit(1)
    naloga(koren, os.environ.get("REZINE_BLENDER"), st, print, lambda s: None, _napaka)
    print(json.dumps(st["rezine"], ensure_ascii=False))

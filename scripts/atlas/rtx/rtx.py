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
# NAČIN ČAKANJA (j je odsoten, okno ostane odprto; Claude lahko v mapo le piše in bere datoteke): po prvem zagonu
# (organi.txt) program ne konča, ampak vsakih RTX_PREMOR s (60) prebere naloga.txt (JSON, piše ga Claude):
#   {"id": "n2", "organi": ["mozgani"], "koda": "v2"}      (»koda« neobvezno)
# Nov id → (če je »koda«) zamenja koda/ s koda-nova/ samo, če koda-nova/manifest.json ({"razlicica": "v2",
# "datoteke": {"rtx.py": "<sha256>", …}}) navaja točno te datoteke (samo imena *.py/*.json brez poti) z ujemajočim se
# SHA-256 (sicer zavrne); pred vsako nalogo preveri koda/ po koda/manifest.json (brez njega ali ob neujemanju zavrne).
# Izvaja samo naše .py iz koda/ z Blenderjevim Pythonom in Blenderjem iz peci.bat; iz naloga.txt vzame le id in imena
# organov (preverjena). Rezultat: izhod/<organ>-<id>/, primerjava/<organ>-<id>/; stanje.json (atomsko): stanje
# (čakam/teče/končano/napaka/zavrnjeno), naloga, organi, časi, kartica, koraki (trajanje iz <organ>.peka.log), napake,
# utrip (čas zadnjega pregleda), zgodovina. Računalnik ne zaspi, dokler je okno odprto (zaslon sme ugasniti).
# --enkrat: brez čakanja (samo prvi zagon). RTX_DOVOLI_CPU=1: SAMO za preizkus na strežniku brez kartice (CPU).
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
ENKRAT = "--enkrat" in a
for _z in ("--nacrt", "--enkrat"):
    if _z in a:
        a.remove(_z)
PREMOR = float(os.environ.get("RTX_PREMOR", "60"))
NALOGA = os.path.join(KOREN, "naloga.txt")
STANJE = os.path.join(KOREN, "stanje.json")
KODA_NOVA = os.path.join(KOREN, "koda-nova")
OBVEZNE = ("rtx.py", "viri.json", "peci.py", "peka.py", "izvozi-organe.py")
IME_DATOTEKE = re.compile(r"^[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)*\.(py|json)$")
ID = re.compile(r"^[A-Za-z0-9_-]{1,40}$")


def pisi(s):
    print(s, flush=True)
    if NACRT:  # načrt (test) ne piše dnevnika
        return
    with open(DNEVNIK, "a", encoding="utf-8") as f:
        f.write(time.strftime("%Y-%m-%d %H:%M:%S ") + s + "\n")


class Napaka(SystemExit):
    def __init__(self, s):
        super().__init__(1); self.sporocilo = s


def napaka(s):
    pisi("NAPAKA: " + s)
    raise Napaka(s)


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


def manifest_napaka(mapa, razlicica=None):
    """None, če mapa točno ustreza svojemu manifest.json (vse datoteke in samo te, SHA-256), sicer razlog."""
    pot = os.path.join(mapa, "manifest.json")
    if not os.path.exists(pot):
        return f"ni {os.path.basename(mapa)}/manifest.json"
    try:
        with open(pot, encoding="utf-8") as f:
            m = json.load(f)
        dat = m["datoteke"]
    except (ValueError, KeyError, TypeError) as e:
        return f"manifest.json ni veljaven ({e})"
    if razlicica is not None and m.get("razlicica") != razlicica:
        return f"manifest.json ima različico {m.get('razlicica')!r}, naloga zahteva {razlicica!r}"
    if not isinstance(dat, dict) or any(not IME_DATOTEKE.match(str(k)) for k in dat):
        return "manifest.json: dovoljena so samo imena *.py in *.json brez poti"
    manjka = [k for k in OBVEZNE if k not in dat]
    if manjka:
        return f"manifest.json: manjka {', '.join(manjka)}"
    v_mapi = sorted(f for f in os.listdir(mapa) if f != "manifest.json" and f != "__pycache__")
    if v_mapi != sorted(dat):
        return f"datoteke v mapi se ne ujemajo z manifestom (odvečne: {sorted(set(v_mapi) - set(dat))}, manjkajo: {sorted(set(dat) - set(v_mapi))})"
    for k, h in dat.items():
        if sha256(os.path.join(mapa, k)) != str(h).lower():
            return f"{k}: SHA-256 se ne ujema z manifestom"
    return None


def zamenjaj_kodo(razlicica):
    """koda-nova/ → koda/ (stara ostane kot koda-stara-<čas>/), samo če koda-nova ustreza manifestu."""
    razlog = manifest_napaka(KODA_NOVA, razlicica) if os.path.isdir(KODA_NOVA) else "ni mape koda-nova"
    if razlog:
        napaka(f"nova koda zavrnjena: {razlog}")
    zacasna = KODA + "-zacasna"
    shutil.rmtree(zacasna, ignore_errors=True)
    shutil.copytree(KODA_NOVA, zacasna)
    razlog = manifest_napaka(zacasna, razlicica)  # kopija še enkrat (prenos med kopiranjem)
    if razlog:
        shutil.rmtree(zacasna, ignore_errors=True)
        napaka(f"nova koda zavrnjena po kopiranju: {razlog}")
    os.rename(KODA, KODA + "-stara-" + time.strftime("%Y%m%d-%H%M%S"))
    os.rename(zacasna, KODA)
    pisi(f"koda zamenjana: različica {razlicica}")


class Peka:
    """Blender, naprava in vhodi (enkrat na proces), nato peka organov."""

    def __init__(self):
        with open(os.path.join(KODA, "viri.json"), encoding="utf-8") as f:
            self.viri = json.load(f)
        self.pripravljeno = False

    def pripravi(self):
        if self.pripravljeno:
            return
        if not BLENDER or not os.path.exists(BLENDER):
            napaka(f"ni Blenderja ({BLENDER})")
        razl, naprave = preveri_napravo()
        pisi(f"Blender {razl}; OPTIX: {naprave['OPTIX'] or '-'}; CUDA: {naprave['CUDA'] or '-'}")
        if not razl.startswith(self.viri["blender"]["razlicica"]):
            pisi(f"OPOZORILO: strežnik peče z Blender {self.viri['blender']['razlicica']}, tu je {razl} (rezultat se lahko malo razlikuje)")
        if NAPRAVA:
            if NAPRAVA not in naprave or not naprave[NAPRAVA]:
                napaka(f"naprava {NAPRAVA} ni na voljo")
            nap = NAPRAVA
        else:
            nap = next((t for t in ("OPTIX", "CUDA") if naprave.get(t)), None)
        if nap is None and os.environ.get("RTX_DOVOLI_CPU") == "1":
            nap, naprave["CPU"] = "CPU", ["CPU (preizkus)"]
        if nap is None:
            napaka("Blender ne vidi grafične kartice Nvidia. Posodobi gonilnik: aplikacija »NVIDIA App« → Gonilniki → Prenesi "
                   "(ali www.nvidia.com/drivers), ponovno zaženi računalnik in znova dvakrat klikni peci.bat. Prenosnik naj bo na polnilcu.")
        self.startup = vhodi(self.viri)
        self.razl, self.nap, self.kartica = razl, nap, naprave[nap]
        self.pripravljeno = True

    def organ(self, organ, ime_mape):
        """Speče organ v izhod/<ime_mape>/; vrne koraki [{korak, s}]. Napaka → Napaka."""
        t0 = time.time()
        surova = os.path.join(IZHOD, ime_mape); os.makedirs(surova, exist_ok=True)
        dela = [os.path.join(surova, f"{organ}{p}.delo.blend.json") for p in ("", "-telefon")]
        ukaz = [sys.executable, os.path.join(ATLAS, "peci.py"), surova, organ]
        if not all(os.path.exists(d) for d in dela):
            for f in os.listdir(surova):  # nedokončana priprava: začni na čisto
                if ".delo.blend" in f:
                    os.remove(os.path.join(surova, f))
            ukaz += ["--priprava", self.startup, "--mri", os.path.join(VHODI, "mri"), "--hra", os.path.join(VHODI, "hra")]
        env = dict(os.environ, PEKA_NAPRAVA=self.nap, PEKA_BLENDER=BLENDER, PEKA_NITI=str(os.cpu_count() or 4))
        pisi(f"{organ}: peka na {self.nap} …")
        r = subprocess.call(ukaz, env=env)
        koraki = koraki_iz_dnevnika(os.path.join(surova, f"{organ}.peka.log"))
        if r:
            napaka(f"{organ}: peka ni uspela (glej izhod/{ime_mape}/{organ}.blender.log)")
        prim = os.path.join(PRIMERJAVA, ime_mape); os.makedirs(prim, exist_ok=True)
        for k in ("", ".json"):  # telefonska delovna datoteka brez slik in napredka: strežnik jo speče na CPU
            shutil.copy2(os.path.join(surova, f"{organ}-telefon.delo.blend{k}"), prim)
        with open(os.path.join(surova, "GOTOVO.txt"), "w", encoding="utf-8") as f:
            json.dump({"organ": organ, "naprava": self.nap, "kartica": self.kartica, "blender": self.razl,
                       "sekund": round(time.time() - t0), "konec": cas()}, f, ensure_ascii=False, indent=1)
        pisi(f"{organ}: končano v {(time.time() - t0) / 60:.0f} min")
        return koraki


def cas():
    return time.strftime("%Y-%m-%d %H:%M:%S")


def koraki_iz_dnevnika(pot):
    """Vrstice peci.py »HH:MM:SS <organ> <korak>: N s, …« → [{korak, s, izhod}]."""
    out = []
    if os.path.exists(pot):
        with open(pot, encoding="utf-8", errors="replace") as f:
            for v in f:
                m = re.match(r"^\S+ (.+?): (\d+) s, .*izhod (-?\d+)", v.strip())
                if m:
                    out.append({"korak": m.group(1), "s": int(m.group(2)), "izhod": int(m.group(3))})
    return out


def beri_stanje():
    try:
        with open(STANJE, encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        return {"zgodovina": []}


def pisi_stanje(st):
    st["utrip"] = cas()
    zac = STANJE + ".zacasna"
    with open(zac, "w", encoding="utf-8") as f:
        json.dump(st, f, ensure_ascii=False, indent=1)
    for _ in range(10):  # Windows: bralec ima lahko datoteko odprto
        try:
            os.replace(zac, STANJE); return
        except PermissionError:
            time.sleep(1)


def opravi(peka, st, nid, organi, preveri_kodo):
    """Ena naloga: organi v izhod/<organ>-<id>/ (prvi zagon: izhod/<organ>/). Nikoli ne vrže izjeme."""
    st.update(stanje="teče", naloga=nid, organi=organi, zacetek=cas(), konec=None, koraki={}, napake=[], caka=False)
    pisi_stanje(st)
    try:
        if preveri_kodo:
            razlog = manifest_napaka(KODA)
            if razlog:
                napaka(f"koda zavrnjena: {razlog}")
        peka.pripravi()
        st.update(kartica=peka.kartica, naprava=peka.nap, blender=peka.razl)
        for organ in organi:
            st["koraki"][organ] = peka.organ(organ, organ if nid == "prvi" else f"{organ}-{nid}")
            pisi_stanje(st)
        st["stanje"] = "končano"
    except Napaka as e:
        st["napake"].append(e.sporocilo)
        st["stanje"] = "zavrnjeno" if "zavrnjena" in e.sporocilo else "napaka"
    except Exception as e:  # nepričakovano: zapiši in čakaj naprej
        st["napake"].append(f"{type(e).__name__}: {e}")
        st["stanje"] = "napaka"
        pisi(f"NAPAKA: {type(e).__name__}: {e}")
    st["konec"] = cas()
    st.setdefault("zgodovina", []).append({k: st.get(k) for k in ("naloga", "organi", "stanje", "zacetek", "konec", "napake")})
    st["zgodovina"] = st["zgodovina"][-30:]
    pisi_stanje(st)
    return st["stanje"]


def beri_nalogo():
    """naloga.txt → (id, organi, koda) ali (None, razlog) ob neveljavni nalogi; (None, None), če je ni."""
    if not os.path.exists(NALOGA):
        return None, None, None
    try:
        with open(NALOGA, encoding="utf-8-sig") as f:
            n = json.load(f)
        nid, organi, koda = n["id"], n["organi"], n.get("koda")
    except (OSError, ValueError, KeyError, TypeError) as e:
        return None, f"naloga.txt ni veljaven JSON z »id« in »organi« ({e})", None
    if not isinstance(nid, str) or not ID.match(nid):
        return None, "naloga.txt: id sme imeti le črke, številke, - in _ (do 40 znakov)", None
    if not isinstance(organi, list) or not organi or not all(isinstance(o, str) and re.match(r"^[a-z_]{1,30}$", o) for o in organi):
        return nid, "naloga.txt: organi morajo biti seznam imen (male črke)", None
    if koda is not None and (not isinstance(koda, str) or not ID.match(koda)):
        return nid, "naloga.txt: koda (različica) sme imeti le črke, številke, - in _", None
    return nid, organi, koda


def cakaj(peka, st):
    """Vsakih PREMOR s pogleda naloga.txt; nov id → naloga. Ne konča (okno ostane odprto)."""
    obdelane = {z.get("naloga") for z in st.get("zgodovina", []) if z.get("stanje") != "teče"}
    zadnja_napaka = None
    print("\n  ČAKAM NA NALOGO (to okno pusti odprto)\n", flush=True)
    while True:
        nid, organi, koda = beri_nalogo()
        if nid is None and isinstance(organi, str):  # neveljavna naloga brez id
            if organi != zadnja_napaka:
                zadnja_napaka = organi
                st.update(stanje="zavrnjeno", napake=[organi]); pisi(f"NAPAKA: {organi}")
        elif nid is not None and nid not in obdelane:
            obdelane.add(nid)
            if isinstance(organi, str):
                st.update(stanje="zavrnjeno", naloga=nid, napake=[organi], konec=cas()); pisi(f"NAPAKA: {organi}")
                st.setdefault("zgodovina", []).append({"naloga": nid, "stanje": "zavrnjeno", "napake": [organi], "konec": st["konec"]})
            else:
                pisi(f"nova naloga {nid}: {', '.join(organi)}" + (f" (koda {koda})" if koda else ""))
                if koda:
                    try:
                        zamenjaj_kodo(koda)
                    except Napaka as e:
                        st.update(stanje="zavrnjeno", naloga=nid, organi=organi, napake=[e.sporocilo], konec=cas())
                        st.setdefault("zgodovina", []).append({"naloga": nid, "stanje": "zavrnjeno", "napake": [e.sporocilo], "konec": st["konec"]})
                        pisi_stanje(st)
                        continue
                    # nova rtx.py (lahko drugačna): zaženemo jo za to nalogo in čakanje; ta proces le počaka nanjo
                    pisi_stanje(dict(st, stanje="teče", naloga=nid, organi=organi, zacetek=cas(), caka=False))
                    r = subprocess.call([sys.executable, "-X", "utf8", os.path.join(KODA, "rtx.py"), "--blender", BLENDER or "",
                                         "--nadaljuj", nid])
                    raise SystemExit(r)
                znani = organi_v_kodi()
                slabi = [o for o in organi if o not in znani]
                if slabi:
                    st.update(stanje="zavrnjeno", naloga=nid, organi=organi, napake=[f"neznani organi: {', '.join(slabi)}"], konec=cas())
                    pisi(f"NAPAKA: neznani organi {slabi}")
                else:
                    opravi(peka, st, nid, organi, preveri_kodo=True)
                print("\n  ČAKAM NA NALOGO (to okno pusti odprto)\n", flush=True)
        st.setdefault("stanje", "čakam")  # stanje zadnje naloge ostane; »caka« pove, da program čaka na novo
        st["caka"] = True
        pisi_stanje(st)
        time.sleep(PREMOR)


def main():
    with open(os.path.join(KODA, "viri.json"), encoding="utf-8") as f:
        viri = json.load(f)
    znani = organi_v_kodi()
    nadaljuj = _zastava("--nadaljuj")
    if NACRT:
        organi = izberi_organe(znani)
        manjka = [v["ime"] for v in viri["vhodi"] if not os.path.exists(os.path.join(VHODI, v["mapa"], v.get("razpakiraj", v)["ime"]))]
        print(json.dumps({"organi": organi, "znani": znani, "manjka": manjka, "blender": viri["blender"]["razlicica"]}, ensure_ascii=False))
        return
    if os.name == "nt":  # računalnik ne zaspi, dokler je okno odprto (zaslon sme ugasniti): ES_CONTINUOUS | ES_SYSTEM_REQUIRED
        import ctypes
        ctypes.windll.kernel32.SetThreadExecutionState(0x80000000 | 0x00000001)
    peka = Peka()
    st = beri_stanje()
    if nadaljuj:  # po zamenjavi kode: naloga, zaradi katere je bila zamenjana
        nid, organi, _ = beri_nalogo()
        if nid == nadaljuj and isinstance(organi, list):
            slabi = [o for o in organi if o not in znani]
            if slabi:
                st.update(stanje="zavrnjeno", naloga=nid, organi=organi, napake=[f"neznani organi: {', '.join(slabi)}"], konec=cas())
                st.setdefault("zgodovina", []).append({"naloga": nid, "stanje": "zavrnjeno", "napake": st["napake"], "konec": st["konec"]})
            else:
                opravi(peka, st, nid, organi, preveri_kodo=True)
    else:
        try:
            organi = izberi_organe(znani)
        except Napaka as e:
            organi = []; st.update(stanje="napaka", napake=[e.sporocilo])
        if organi:
            pisi(f"začetek: organi {', '.join(organi)}")
            opravi(peka, st, "prvi", organi, preveri_kodo=False)  # paket, ki ga je zagnal j sam
        if ENKRAT:
            pisi_stanje(st)
            raise SystemExit(0 if st.get("stanje") == "končano" else 1)
    pisi("vse končano; čakam na naloge")
    cakaj(peka, st)


if __name__ == "__main__":
    main()

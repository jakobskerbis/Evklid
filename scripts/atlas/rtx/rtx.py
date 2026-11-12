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
# NALOGA »rezine« ("organi": ["rezine"], polje "rezine": {spol, od, do, podrobno, …}): barvne kriorezine za »Pravi prerez«;
# prenos in obdelavo opravi rezine_prenos.py (ob tej datoteki), napredek in prostor na disku sta v stanje.json → rezine.
# NALOGA »atlas-v2« ("organi": ["atlas-v2"], polje "atlas-v2": {"kosti": ["Femur.l"], "kakovost": "rtx"}): postopek
# atlas v2 (scripts/atlas/v2/rtx_v2.py: izvoz kosti iz vhodi/Startup.blend, čiščenje, visoka/nizka mreža, peka na
# grafični kartici) v izhod/atlas-v2-<id>/<kost>/.
# --enkrat: brez čakanja (samo prvi zagon). RTX_DOVOLI_CPU=1: SAMO za preizkus na strežniku brez kartice (CPU).
import hashlib, json, os, re, shutil, subprocess, sys, threading, time, zipfile

sys.dont_write_bytecode = True  # brez __pycache__: izvaja se samo preverjena .py (manifest)

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
IME_DATOTEKE = re.compile(r"[A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]+)*\.(?:py|json)")  # vedno fullmatch (brez »\n« na koncu)
ID = re.compile(r"[A-Za-z0-9_-]{1,40}")
ORGAN = re.compile(r"[a-z0-9-]{1,30}")  # kot peci.py
PROSTOR_GB = float(os.environ.get("RTX_PROSTOR_GB", "5"))  # najmanj prostega na disku pred nalogo
UTRIP_S = float(os.environ.get("RTX_UTRIP", "60"))  # osvežitev stanje.json med peko
_ZAPIS = threading.Lock()


def sistemski(ime):
    """Sistemski program po polni poti (Windows: System32, ne mapa paketa), sicer iz PATH; None, če ga ni."""
    if os.name == "nt":
        pot = os.path.join(os.environ.get("SystemRoot", r"C:\Windows"), "System32", ime + ".exe")
        return pot if os.path.exists(pot) else None
    return shutil.which(ime)


def nova_pot(osnova):
    """<osnova>-<čas>, ki še ne obstaja (dve zamenjavi v isti sekundi)."""
    pot = osnova + "-" + time.strftime("%Y%m%d-%H%M%S"); i = 1
    while os.path.exists(pot):
        i += 1; pot = osnova + "-" + time.strftime("%Y%m%d-%H%M%S") + f"-{i}"
    return pot


def ponovi(fn, *arg, krat=10):
    """Windows: protivirusni program ali indeksiranje drži datoteko za kratek čas → nekajkrat poskusi znova."""
    for i in range(krat):
        try:
            return fn(*arg)
        except OSError:
            if i == krat - 1:
                raise
            time.sleep(1)


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
    curl = sistemski("curl")
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
    except Exception as e:
        return f"manifest.json ni veljaven ({type(e).__name__}: {e})"
    if razlicica is not None and m.get("razlicica") != razlicica:
        return f"manifest.json ima različico {m.get('razlicica')!r}, naloga zahteva {razlicica!r}"
    if not isinstance(dat, dict) or any(not IME_DATOTEKE.fullmatch(str(k)) for k in dat):
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


def razlicica_kode():
    try:
        with open(os.path.join(KODA, "manifest.json"), encoding="utf-8") as f:
            return json.load(f).get("razlicica")
    except Exception:
        return None


def zamenjaj_kodo(razlicica):
    """koda-nova/ → koda/ samo, če koda-nova ustreza manifestu; stara ostane kot koda-stara-<čas>/ (vrne njeno pot).
    Če druga preimenovanje ne uspe, vrne staro kodo nazaj (koda/ nikoli ne ostane prazna)."""
    razlog = manifest_napaka(KODA_NOVA, razlicica) if os.path.isdir(KODA_NOVA) else "ni mape koda-nova"
    if razlog:
        napaka(f"nova koda zavrnjena: {razlog}")
    zacasna = KODA + "-zacasna"
    shutil.rmtree(zacasna, ignore_errors=True)
    shutil.copytree(KODA_NOVA, zacasna, ignore=shutil.ignore_patterns("__pycache__"))
    razlog = manifest_napaka(zacasna, razlicica)  # kopija še enkrat (prenos med kopiranjem)
    if razlog:
        shutil.rmtree(zacasna, ignore_errors=True)
        napaka(f"nova koda zavrnjena po kopiranju: {razlog}")
    stara = nova_pot(KODA + "-stara")
    try:
        ponovi(os.rename, KODA, stara)
    except OSError as e:
        shutil.rmtree(zacasna, ignore_errors=True)
        napaka(f"nova koda zavrnjena: koda/ ni mogoče preimenovati ({e})")
    try:
        ponovi(os.rename, zacasna, KODA)
    except OSError as e:
        ponovi(os.rename, stara, KODA)
        napaka(f"nova koda zavrnjena: zamenjava ni uspela, stara koda vrnjena ({e})")
    pisi(f"koda zamenjana: različica {razlicica}")
    return stara


def vrni_kodo(stara, razlog):
    """Nova koda ne deluje: koda/ → koda-slaba-<čas>/, stara nazaj v koda/."""
    slaba = nova_pot(KODA + "-slaba")
    ponovi(os.rename, KODA, slaba)
    ponovi(os.rename, stara, KODA)
    pisi(f"NAPAKA: nova koda ne deluje ({razlog}); vrnjena prejšnja, slaba je v {os.path.basename(slaba)}")


class Peka:
    """Blender, naprava in vhodi (enkrat na proces), nato peka organov."""

    def __init__(self):
        self.pripravljeno = False
        self.trenutni = None  # (organ, peka.log) med peko: utrip bere korake sproti

    def pripravi(self):
        if self.pripravljeno:
            return
        with open(os.path.join(KODA, "viri.json"), encoding="utf-8") as f:
            self.viri = json.load(f)
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
        ukaz = [sys.executable, "-X", "utf8", os.path.join(ATLAS, "peci.py"), surova, organ]
        if not all(os.path.exists(d) for d in dela):
            for f in os.listdir(surova):  # nedokončana priprava: začni na čisto
                if ".delo.blend" in f:
                    os.remove(os.path.join(surova, f))
            ukaz += ["--priprava", self.startup, "--mri", os.path.join(VHODI, "mri"), "--hra", os.path.join(VHODI, "hra")]
        env = dict(os.environ, PEKA_NAPRAVA=self.nap, PEKA_BLENDER=BLENDER, PEKA_NITI=str(os.cpu_count() or 4))
        pisi(f"{organ}: peka na {self.nap} …")
        self.trenutni = (organ, os.path.join(surova, f"{organ}.peka.log"))
        try:
            r = subprocess.call(ukaz, env=env)
        finally:
            self.trenutni = None
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
    """Atomsko (začasna datoteka + replace); kliče jo glavna nit in nit utripa, zato pod ključavnico."""
    with _ZAPIS:
        st["utrip"] = cas()
        besedilo = json.dumps(st, ensure_ascii=False, indent=1)
        zac = STANJE + ".zacasna"
        with open(zac, "w", encoding="utf-8") as f:
            f.write(besedilo)
        for _ in range(10):  # Windows: bralec ima lahko datoteko odprto
            try:
                os.replace(zac, STANJE); return
            except PermissionError:
                time.sleep(1)


def utrip(peka, st, konec):
    """Nit: med dolgo peko vsakih UTRIP_S s osveži utrip in korake trenutnega organa (Claude loči »teče« od »visi«)."""
    while not konec.wait(UTRIP_S):
        try:
            t = peka.trenutni
            if t:
                st["koraki"][t[0]] = koraki_iz_dnevnika(t[1])
            pisi_stanje(st)
        except Exception:
            pass


def opravi(peka, st, nid, organi, preveri_kodo):
    """Ena naloga: organi v izhod/<organ>-<id>/ (prvi zagon: izhod/<organ>/). Nikoli ne vrže izjeme."""
    st.update(stanje="teče", naloga=nid, organi=organi, zacetek=cas(), konec=None, koraki={}, napake=[], caka=False)
    st.pop("uspeli", None)
    pisi_stanje(st)
    konec = threading.Event()
    threading.Thread(target=utrip, args=(peka, st, konec), daemon=True).start()
    try:
        shutil.rmtree(os.path.join(KODA, "__pycache__"), ignore_errors=True)
        prosto = shutil.disk_usage(KOREN).free / 1e9
        if prosto < PROSTOR_GB:
            napaka(f"na disku je le {prosto:.1f} GB prostora (potrebno vsaj {PROSTOR_GB:g} GB); izbriši stare mape v izhod/")
        if preveri_kodo:
            razlog = manifest_napaka(KODA)
            if razlog:
                napaka(f"koda zavrnjena: {razlog}")
        if organi == ["rezine"]:  # brez grafične kartice in vhodov peke; Blender le za branje in pisanje slik
            if not BLENDER or not os.path.exists(BLENDER):
                napaka(f"ni Blenderja ({BLENDER})")
            import rezine_prenos
            rezine_prenos.naloga(KOREN, BLENDER, st, pisi, pisi_stanje, napaka)
        elif organi == ["atlas-v2"]:  # ista kartica in Blender kot organi, svoj postopek (scripts/atlas/v2)
            peka.pripravi()
            st.update(kartica=peka.kartica, naprava=peka.nap, blender=peka.razl)
            with open(NALOGA, encoding="utf-8-sig") as f:
                nastavitve = json.load(f).get("atlas-v2") or {}
            import rtx_v2
            rtx_v2.naloga(KOREN, BLENDER, st, pisi, pisi_stanje, napaka, nastavitve, nid, peka.nap)
        else:
            peka.pripravi()
            st.update(kartica=peka.kartica, naprava=peka.nap, blender=peka.razl)
            # Napaka enega organa ne ustavi ostalih (nočna vrsta več organov, videz 10. 11.): zapiše se in peka gre naprej;
            # naloga je »končano«, če je uspel vsaj en organ, sicer »napaka«. st["uspeli"] = organi z rezultatom.
            st["uspeli"] = []
            for organ in organi:
                try:
                    st["koraki"][organ] = peka.organ(organ, organ if nid == "prvi" else f"{organ}-{nid}")
                    st["uspeli"].append(organ)
                except (Napaka, Exception) as e:
                    sp = getattr(e, "sporocilo", None) or f"{organ}: {type(e).__name__}: {e}"
                    if not isinstance(e, Napaka):
                        pisi(f"NAPAKA: {sp}")
                    st["napake"].append(sp)
                pisi_stanje(st)
            if not st["uspeli"]:
                raise Napaka("noben organ ni uspel: " + "; ".join(st["napake"]))
        st["stanje"] = "končano"
    except Napaka as e:
        st["napake"].append(e.sporocilo)
        st["stanje"] = "zavrnjeno" if "zavrnjena" in e.sporocilo else "napaka"
    except Exception as e:  # nepričakovano: zapiši in čakaj naprej
        st["napake"].append(f"{type(e).__name__}: {e}")
        st["stanje"] = "napaka"
        pisi(f"NAPAKA: {type(e).__name__}: {e}")
    finally:
        konec.set()
    st["konec"] = cas()
    zgodovina(st)
    pisi_stanje(st)
    return st["stanje"]


def zgodovina(st):
    st.setdefault("zgodovina", []).append({k: st.get(k) for k in ("naloga", "organi", "uspeli", "stanje", "zacetek", "konec", "napake") if k != "uspeli" or k in st})
    st["zgodovina"] = st["zgodovina"][-30:]


def zavrni(st, nid, organi, razlog):
    st.update(stanje="zavrnjeno", naloga=nid, organi=organi, napake=[razlog], zacetek=cas(), konec=cas())
    zgodovina(st)
    pisi(f"NAPAKA: {razlog}")


def beri_nalogo():
    """naloga.txt → (id, organi, koda); ob neveljavni nalogi (id ali None, razlog, None); (None, None, None), če je ni."""
    if not os.path.exists(NALOGA):
        return None, None, None
    try:
        with open(NALOGA, encoding="utf-8-sig") as f:
            n = json.load(f)
        nid, organi, koda = n["id"], n["organi"], n.get("koda")
    except Exception as e:  # tudi RecursionError (globoko gnezden JSON) ali napačen tip
        return None, f"naloga.txt ni veljaven JSON z »id« in »organi« ({type(e).__name__})", None
    if not isinstance(nid, str) or not ID.fullmatch(nid):
        return None, "naloga.txt: id sme imeti le črke, številke, - in _ (do 40 znakov)", None
    if not isinstance(organi, list) or not organi or not all(isinstance(o, str) and ORGAN.fullmatch(o) for o in organi):
        return nid, "naloga.txt: organi morajo biti seznam imen (male črke, številke in -)", None
    if koda is not None and (not isinstance(koda, str) or not ID.fullmatch(koda)):
        return nid, "naloga.txt: koda (različica) sme imeti le črke, številke, - in _", None
    return nid, organi, koda


def obdelane_naloge(st):
    return {z.get("naloga") for z in st.get("zgodovina", []) if z.get("stanje") != "teče"}


def cakaj(peka, st):
    """Vsakih PREMOR s pogleda naloga.txt; nov id → naloga. Ne konča nikoli (vsaka izjema se zapiše, nato premor)."""
    obdelane = obdelane_naloge(st)
    zadnja_napaka = None
    print("\n  ČAKAM NA NALOGO (to okno pusti odprto)\n", flush=True)
    while True:
        try:
            nid, organi, koda = beri_nalogo()
            if nid is None and isinstance(organi, str):  # neveljavna naloga brez id
                if organi != zadnja_napaka:  # stanje zadnje naloge ostane; napaka datoteke posebej
                    zadnja_napaka = organi
                    st["naloga_napaka"] = organi; pisi(f"NAPAKA: {organi}")
                continue
            st.pop("naloga_napaka", None); zadnja_napaka = None
            if nid is not None and nid not in obdelane:
                obdelane.add(nid)
                if isinstance(organi, str):
                    zavrni(st, nid, None, organi)
                    continue
                pisi(f"nova naloga {nid}: {', '.join(organi)}" + (f" (koda {koda})" if koda else ""))
                if koda and koda != razlicica_kode():
                    try:
                        stara = zamenjaj_kodo(koda)
                    except Napaka as e:
                        zavrni(st, nid, organi, e.sporocilo)
                        continue
                    # nova rtx.py nadaljuje to nalogo in čakanje; ta proces počaka nanjo. Ker nova nikoli ne konča
                    # sama od sebe, vsak njen konec pomeni napako: vrnemo staro kodo in čakamo naprej tu.
                    pisi_stanje(dict(st, stanje="teče", naloga=nid, organi=organi, zacetek=cas(), caka=False))
                    r = subprocess.call([sys.executable, "-X", "utf8", os.path.join(KODA, "rtx.py"), "--blender", BLENDER or "",
                                         "--nadaljuj", nid])
                    vrni_kodo(stara, f"rtx.py različice {koda} je končala z izhodom {r}")
                    st = beri_stanje()
                    obdelane = obdelane_naloge(st) | {nid}
                    if st.get("naloga") != nid or st.get("stanje") == "teče":  # nova koda naloge ni končala
                        st.update(stanje="napaka", naloga=nid, organi=organi, konec=cas(),
                                  napake=[f"nova koda {koda} je končala z izhodom {r}; vrnjena prejšnja koda"])
                        zgodovina(st)
                    else:
                        st.setdefault("napake", []).append(f"nova koda {koda} je kasneje končala z izhodom {r}; vrnjena prejšnja koda")
                    continue
                znani = organi_v_kodi()
                slabi = [o for o in organi if o not in znani and organi not in (["rezine"], ["atlas-v2"])]
                if slabi:
                    zavrni(st, nid, organi, f"neznani organi: {', '.join(slabi)}")
                else:
                    opravi(peka, st, nid, organi, preveri_kodo=True)
                print("\n  ČAKAM NA NALOGO (to okno pusti odprto)\n", flush=True)
        except (Exception, SystemExit) as e:  # zanka ne sme umreti, dokler j ni doma
            try:
                sporocilo = getattr(e, "sporocilo", None) or f"{type(e).__name__}: {e}"
                st.update(stanje="napaka", napake=[sporocilo]); pisi(f"NAPAKA (čakam naprej): {sporocilo}")
            except Exception:
                pass
        finally:
            try:
                st.setdefault("stanje", "čakam")  # stanje zadnje naloge ostane; »caka« pove, da program čaka na novo
                st["caka"] = True
                pisi_stanje(st)
            except Exception:
                pass
            time.sleep(PREMOR)


_KLJUC = None


def zakleni():
    """Samo eno okno naenkrat (rtx.lock ostane zaklenjen, dokler proces teče; ob zaprtju okna ga sistem sprosti)."""
    global _KLJUC
    _KLJUC = open(os.path.join(KOREN, "rtx.lock"), "a+")
    try:
        if os.name == "nt":
            import msvcrt
            _KLJUC.seek(0); msvcrt.locking(_KLJUC.fileno(), msvcrt.LK_NBLCK, 1)
        else:
            import fcntl
            fcntl.flock(_KLJUC.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
    except OSError:
        print("\n  To okno se zapre: peka že teče v drugem oknu. Zapri staro okno (križec) in znova dvakrat klikni peci.\n", flush=True)
        raise SystemExit(1)


def main():
    nadaljuj = _zastava("--nadaljuj")
    if NACRT:
        with open(os.path.join(KODA, "viri.json"), encoding="utf-8") as f:
            viri = json.load(f)
        znani = organi_v_kodi()
        organi = izberi_organe(znani)
        manjka = [v["ime"] for v in viri["vhodi"] if not os.path.exists(os.path.join(VHODI, v["mapa"], v.get("razpakiraj", v)["ime"]))]
        print(json.dumps({"organi": organi, "znani": znani, "manjka": manjka, "blender": viri["blender"]["razlicica"]}, ensure_ascii=False))
        return
    if os.name == "nt":  # računalnik ne zaspi, dokler je okno odprto (zaslon sme ugasniti): ES_CONTINUOUS | ES_SYSTEM_REQUIRED
        import ctypes
        ctypes.windll.kernel32.SetThreadExecutionState(0x80000000 | 0x00000001)
    if not nadaljuj:
        zakleni()  # pri --nadaljuj ključavnico drži proces, ki je zamenjal kodo
    st = beri_stanje()
    peka = None
    try:
        peka = Peka()
        znani = organi_v_kodi()
        if nadaljuj:  # po zamenjavi kode: naloga, zaradi katere je bila zamenjana
            nid, organi, _ = beri_nalogo()
            if nid == nadaljuj and isinstance(organi, list):
                slabi = [o for o in organi if o not in znani and organi not in (["rezine"], ["atlas-v2"])]
                if slabi:
                    zavrni(st, nid, organi, f"neznani organi: {', '.join(slabi)}")
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
    except (Exception, Napaka) as e:  # tudi ob napaki ob zagonu čakamo naprej (j ni doma)
        sporocilo = getattr(e, "sporocilo", None) or f"{type(e).__name__}: {e}"
        st.update(stanje="napaka", napake=[sporocilo]); pisi(f"NAPAKA: {sporocilo}")
    if peka is None:
        peka = Peka()
    pisi("vse končano; čakam na naloge")
    cakaj(peka, st)


if __name__ == "__main__":
    main()

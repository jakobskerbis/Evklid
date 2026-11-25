# Atlas v2 na j-jevem prenosniku: naloga »atlas-v2« za rtx.py (paket scripts/atlas/rtx, PR #473/#567).
# rtx.py jo pokliče, ko je v naloga.txt "organi": ["atlas-v2"] (glej rtx-v2.patch in rtx-naloga.json ob tej datoteki):
#   {"id": "v2s1", "organi": ["atlas-v2"], "koda": "<različica>", "atlas-v2": {"kosti": ["Femur.l"], "kakovost": "rtx"}}
# Kosti s podrobnostmi: Femur.l, Humerus.l (postopek.py bere podrobnosti_<ime>.py; obe datoteki morata biti v koda/).
# Za vsako kost: izvozi_kost.py (vhodi/Startup.blend, že preverjen po SHA-256; za kosti s podrobnejšim virom v
# VIRI_MREZ ta korak odpade in postopek bere JSON ob tej datoteki) → postopek.py --kakovost rtx --naprava
# <OPTIX|CUDA> v izhod/atlas-v2-<id>/<kost>/ (GLB telefon/računalnik v obeh videzih, teksture, delo.blend,
# porocilo.json). Vsak korak je svoj proces Blenderja; dnevnik v <kost>.log. Napaka ene kosti ne ustavi ostalih.
import json, os, re, subprocess, time

KOSTI = re.compile(r"[A-Z][A-Za-z ]{1,40}\.(l|r)")  # imena Z-Anatomy, npr. »Femur.l«, »Hip bone.r«
TU = os.path.dirname(os.path.abspath(__file__))
VIRI_MREZ = {"Femur.l": "stegnenica-leva-bp3d.json", "Humerus.l": "nadlahtnica-leva-bp3d.json"}  # isto kot kost.VIRI_MREZ (rtx_v2 ne uvaža numpy)


def naloga(koren, blender, st, pisi, pisi_stanje, napaka, nastavitve, nid, naprava):
    kosti = nastavitve.get("kosti") or ["Femur.l"]
    kakovost = nastavitve.get("kakovost", "rtx")
    if kakovost not in ("rtx", "cpu") or not all(isinstance(k, str) and KOSTI.fullmatch(k) for k in kosti):
        napaka("atlas-v2: neveljavne nastavitve (kosti npr. »Femur.l«, kakovost rtx|cpu)")
    blend = os.path.join(koren, "vhodi", "Startup.blend")
    if not os.path.exists(blend):
        napaka("atlas-v2: ni vhodi/Startup.blend (najprej en običajen zagon paketa)")
    izhod = os.path.join(koren, "izhod", f"atlas-v2-{nid}")
    os.makedirs(izhod, exist_ok=True)
    st["atlas-v2"] = {"kosti": kosti, "kakovost": kakovost, "uspeli": [], "napake": []}
    for kost in kosti:
        mapa = os.path.join(izhod, kost.replace(" ", "_"))
        surovo = os.path.join(mapa, "surovo")
        os.makedirs(surovo, exist_ok=True)
        dnevnik = os.path.join(mapa, "postopek.log")
        t0 = time.time()
        koraki = [
            [blender, "-b", "--factory-startup", "--python-exit-code", "1", "--python", os.path.join(TU, "izvozi_kost.py"),
             "--", blend, surovo, kost],
            [blender, "-b", "--factory-startup", "--python-exit-code", "1", "--python", os.path.join(TU, "postopek.py"),
             "--", "--vhod", os.path.join(surovo, kost + ".ply"), "--info", os.path.join(surovo, kost + ".json"),
             "--izhod", mapa, "--kakovost", kakovost, "--naprava", naprava, "--stran", kost[-1]],
        ]
        # podrobnejši vir (npr. BodyParts3D za Femur.l, kost.VIRI_MREZ): JSON ob tej datoteki, izvoz iz Startup.blend odpade
        vir = os.path.join(TU, VIRI_MREZ.get(kost, "-"))
        if os.path.exists(vir):
            koraki = [koraki[1][:8] + ["--vhod", vir, "--info", vir] + koraki[1][12:]]
        try:
            for uk in koraki:
                with open(dnevnik, "a", encoding="utf-8") as f:
                    r = subprocess.run(uk, stdout=f, stderr=subprocess.STDOUT)
                if r.returncode != 0:
                    raise RuntimeError(f"{os.path.basename(uk[6])} izhod {r.returncode} (glej {os.path.relpath(dnevnik, koren)})")
            st["atlas-v2"]["uspeli"].append(kost)
            pisi(f"atlas-v2 {kost}: končano v {(time.time() - t0) / 60:.0f} min")
        except Exception as e:
            st["atlas-v2"]["napake"].append(f"{kost}: {e}")
            pisi(f"NAPAKA: atlas-v2 {kost}: {e}")
        pisi_stanje(st)
    if not st["atlas-v2"]["uspeli"]:
        napaka("atlas-v2: nobena kost ni uspela: " + "; ".join(st["atlas-v2"]["napake"]))
    with open(os.path.join(izhod, "naloga.json"), "w", encoding="utf-8") as f:
        json.dump({"id": nid, **st["atlas-v2"], "naprava": naprava}, f, ensure_ascii=False, indent=1)

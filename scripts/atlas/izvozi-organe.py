# Izvoz posameznih organov iz Z-Anatomy (CC BY-SA 4.0) za »Organi v 3D« (/3d#organ-<ime>, docs/3d.md).
# Zagon (Blender 4.2, brez okna), en ali več organov. Startup.blend NE odpremo (ob odprtju Blender izračuna vseh
# ~9000 objektov in porabi > 11 GB); objekte samo povežemo (link) iz knjižnice, izračunamo pa le izbrane:
#   blender -b --factory-startup --python scripts/atlas/izvozi-organe.py -- <surova mapa> --blend <Startup.blend> mozgani srce oko
# Izhod v <surova mapa>: <organ>.glb (računalnik), <organ>-telefon.glb, <organ>.vozlisca.json (seznam vozlišč s tkivom,
# delom, številom trikotnikov in središčem). Nato: node scripts/atlas/organi.mjs <surova mapa> (stiskanje v
# public/3d/modeli/organi-3d/ in vpis vozlišč v <organ>.json).
#
# Postopek za vsak organ: izbira objektov po imenu in poti skupin (regex), krivulje → mreže, modifikatorji Z-Anatomy
# (SUBSURF …) uporabljeni, po želji še eno glajenje (nizko poligonske vijuge), obrez žil na škatlo okoli organa,
# debelina tankih lupin (SOLIDIFY, da ima prerez steno), normale navzven (zaprte mreže po predznaku prostornine),
# poenostavitev na cilj trikotnikov, zapečena senca okolice (AO z žarki po vsem organu) v COLOR_0, središče v izhodišču.
# Ime vozlišča = ime objekta v Z-Anatomy; dodatki vozlišča (extras): tkivo (material v pregledovalniku) in del.
#
# Zapečene teksture (cfg »tekstura«; PBR »pbr=True« za srce, možgane, pljuča, jetra, ledvico in oko, videz j 10. 11.):
#  1. združena oglišča (Z-Anatomy jih ima pogosto ločena), brez dodatnega glajenja nizke mreže (ostre brazde);
#  2. nizka mreža = poenostavitev na cilj; skupni UV atlas vseh vozlišč (Smart UV Project, kot 89°, pack_islands);
#  3. visoka mreža = izvirnik + SUBSURF (razdeli) + DISPLACE s šumom CLOUDS (relief, reliefMera v deležih velikosti);
#  4. Cycles (CPU, malo vzorcev) peče z visoke na nizko: NORMAL (tangentni prostor, kletka/razdalja žarka ≈ 0,15 %
#     velikosti, da žarek ne zadene sosednje vijuge) in EMIT iz material_peke (Pointiness → gube temnejše in bolj rdeče,
#     lise, tanke žilice). Osnovna barva je MNOŽILNIK: pregledovalnik jo pomnoži z barvo tkiva iz <organ>.json;
#  5. izvoz glTF s TEXCOORD_0, TANGENT (MikkTSpace, enake kot pri peki) in slikami WebP (EXT_texture_webp):
#     računalnik px[0] (2048), telefon ima svojo poenostavitev, svoj atlas in peko px[1] (1024);
#  6. senca okolice (AO z žarki) ostane v COLOR_0 za velike gube; organi.mjs nato dedup + kvantizacija.
# Meje: računalnik ≤ 6 MB, telefon ≤ 2 MB (test/3d-organi-glb.test.js). Peka možganov traja ≈ 3 min.
import bpy, bmesh, json, os, re, sys, math, random, types
from mathutils import Vector, Matrix
from mathutils.bvhtree import BVHTree
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import peka  # skupna peka PBR tekstur (Cycles): baza, normala, ORM; recepti tkiv v cfg »tekstura«
from srce_geometrija import srce_dodatki, srce_razdeli  # lastna geometrija srca (lističa, papilarna mišica, tetive, trabekule)
from srce_zile import srce_zile, krivulje_objekta  # žile srca: zaprte cevi s steno iz središčnic krivulj Z-Anatomy
from oko_misice import ocesne_misice, kite_na_zrklo, ocesne_misice_lastne  # očesne mišice Z-Anatomy, prilegane na zrklo HRA (Tillauxova spirala, kite)
from jetra_geometrija import jetra_deli, jetra_ct, uveljavi_normale  # jetra: ena površina, režnji, vezi, votla vena, drevesa žil in žolčnih vodov
from drevesa import pljucna_drevesa, ledvicne_zile  # pljuča: zaprti režnji, veje iz središčnic, subsegmentne veje (lastno)
from pljuca_geometrija import pljuca_ct  # pljuča: režnji, žile in dihalno drevo iz CT (TotalSegmentator), sapnik z obroči iz HRA
from mozgani_hra import mozgani_hra  # možgani: deblo, mali možgani in sredinske strukture iz HRA brain v1.4 (Allen, CC BY 4.0)
from srce_ct import srce_ct  # stene srca iz CT (Rodero 2021), poravnava ostalih delov nanje, maščoba, trabekule

args = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
out = args[0] if args else "/tmp/organi-raw"
BLEND = args[args.index("--blend") + 1] if "--blend" in args else None
MRI = args[args.index("--mri") + 1] if "--mri" in args else None
HRA = args[args.index("--hra") + 1] if "--hra" in args else None  # mapa z GLB HuBMAP HRA (CC BY 4.0), npr. 3d-vh-m-eye-l.glb
# mapa s povprečnim CT srcem (Rodero 2021, Zenodo 4593739, CC BY 4.0; srce_ct.py ga po potrebi prenese): privzeto <mapa Startup.blend>/ct
CT = args[args.index("--ct") + 1] if "--ct" in args else (os.path.join(os.path.dirname(os.path.abspath(BLEND)), "ct") if BLEND else None)
_ZASTAVE = ("--blend", "--mri", "--hra", "--ct")
izbrani = [a for i, a in enumerate(args[1:], 1) if a not in _ZASTAVE and args[i - 1] not in _ZASTAVE] or ["mozgani", "srce", "oko", "pljuca", "ledvica", "jetra"]
os.makedirs(out, exist_ok=True)

# Deli, ki v Z-Anatomy morda izhajajo iz modelov z licenco NC (enako kot izvozi-z-anatomy.py): nikoli ne izvozimo.
SULC_MOC = 0.45
IZLOCI = re.compile(r"^(Cochlea|Vestibule|Semicircular|Renal pelvis|Intrarenal (arteries|veins))", re.I)
NEVIDNO = re.compile(r"\.(j|g|t|s|i)$|^HOW TO")

# Nastavitve organov. vkljuci/izkljuci: regex na »ime / starš / starš starša …«. tkiva, deli: (regex, ključ), prvi
# zadetek velja; del brez zadetka dobi najbližji del iz »blizina«. gladi: dodatno glajenje (SUBSURF) za objekte, ki
# ustrezajo regexu. debelina: (regex, metri) za SOLIDIFY tankih lupin. skatla: obrez na škatlo okoli objektov »jedro«
# (rob v metrih: [x-, x+, y-, y+, z-, z+] v Blenderjevih oseh, Z gor, -Y spredaj).
ORGANI = {
    "mozgani": dict(
        vkljuci=r"/ Brain\.g( |$)",
        izkljuci=r"^White matter of telencephalon\.(l|r)( /|$)|ventricle|Aqueduct|nucleus|nuclei|Nucleus|Lemniscus|commissure of fornix|Hippocampal commissure|"
                 r"Stria |Striae|Interpeduncular fossa|Corpus striatum|Dorsal striatum|Ventral striatum|Globus pallidus|Lentiform|Caudate|Putamen|"
                 r"Amygdal|Hippocamp|Claustrum|Internal capsule|External capsule|Extreme capsule|Basal forebrain|Septal|Indusium|"
                 r"tract\b(?!.*Optic)|fasciculus|Grey matter of|Tegmentum of pons|Reticular|Substantia nigra|Red nucleus|Medial longitudinal|"
                 r"Central canal|Central grey|Area postrema|Locus|Raphe|Vestibular|Cochlear|Solitary|Trigeminal|Olivary",
        cilj=(210_000, 58_000),  # n3: telesa HRA vzamejo ~50k / 17k, skorja dobi nazaj svoj delež (prej fasete na čelu)
        # Pečene PBR teksture (videz, j 10. 11.): sveži možgani rožnato sivi, pialne žilice, vlažna pia mater. Telefon ima
        # svojo peko 1024 px (rtx.py in peci.py zahtevata delovno datoteko za obe mreži). vz1: 240k / 70k = 6,6 / 2,3 MiB
        # (geometrija z UV ≈ 25 B na trikotnik) → 165k / 44k, da teksture ostanejo v polni ločljivosti pod mejo 6 / 1,9 MB.
        tekstura=dict(pbr=True, px=(2048, 1024), vzorciNormala=16, vzorciBarva=16, vzorciAO=192, aoRazdalja=0.03, kletka=0.004, uvKot=66,
            recepti={
                # vz2 (posnetek vz1: bled, plastičen, brazde brez kontrasta): toplejša rožnata, bolj mat, več žilic
                # brez gub (visoka mreža = nizka, normalna mapa nevtralna; relief nariše pregledovalnik) in kletka 0,001
                # (0,3 mm): ob sredini (tesne plasti gyrus rectus) je premik gub vzdolž nestalnih normal nagubal visoko mrežo
                # in normalna mapa je na orbitalni ploskvi risala sive bleščeče lise
                "skorja": dict(barva=(0.62, 0.35, 0.31), barva2=(0.50, 0.25, 0.23), lise=0.40, liseMera=0.03, hrap=0.46,
                               gube=0.0, zilice=0.14, ziliceBarva=(0.42, 0.06, 0.06), ziliceMera=0.012, razdeli=0, kletka=0.001),
                # skorja in sredina iz MRI sta že goste (pialna površina): brez razdelitve (pomnilnik prenosnika)
                "sredina": dict(barva=(0.58, 0.44, 0.40), barva2=(0.50, 0.36, 0.33), lise=0.25, hrap=0.42, gube=0.0, razdeli=0, kletka=0.001),
                "mali": dict(barva=(0.56, 0.31, 0.28), barva2=(0.45, 0.23, 0.21), lise=0.35, hrap=0.46, gube=0.00003, gubeMera=0.0015,
                             zilice=0.15, ziliceBarva=(0.40, 0.06, 0.06), ziliceMera=0.010, razdeli=0),  # MRI: že gosta
                "deblo": dict(barva=(0.64, 0.52, 0.45), barva2=(0.56, 0.44, 0.39), lise=0.25, hrap=0.42, gube=0.00003, gubeMera=0.002,
                              zilice=0.12, ziliceBarva=(0.45, 0.08, 0.07), razdeli=0),
                "bela": dict(barva=(0.80, 0.75, 0.66), barva2=(0.73, 0.67, 0.58), lise=0.2, hrap=0.46, gube=0.00002, gubeMera=0.002, razdeli=0),
                "medmozgani": dict(barva=(0.62, 0.48, 0.43), barva2=(0.54, 0.40, 0.36), lise=0.25, hrap=0.42, gube=0.00003, gubeMera=0.002, razdeli=0),
            },
        ),
        # Skorja iz MRI (OpenNeuro ds000001 fMRIPrep/FreeSurfer, CC0): Z-Anatomy vijuge (tkivo »skorja«) zamenjamo s
        # pialno površino ene anonimne prostovoljke/prostovoljca (lh/rh.pial), režnji iz parcelacije aparc, globina brazd
        # (sulc) potemni senco okolice. Mapa z datotekami: --mri <mapa> (sub-01-lh.pial, …-lh.sulc, …-lh.aparc.annot).
        skorja_mri=dict(osebek="sub-01", zamenjaj="skorja", gladi=1, sulc=0.45, sredina="sredina", glajenjeMej=5, silvij=0.007, zatilniZareza=0.065),
        # Mali možgani iz segmentacije MRI istega osebka (aseg, oznake 7/8/46/47; scripts/atlas/mali-mozgani-mri.py): prava
        # oblika poloble, črva in tonzil, glavne fisure kot žlebovi; lističe nariše senčilnik (tkiva.mali.listi). Brez <osebek>-mali.npz ostanejo režnjiči Z-Anatomy.
        # glajenje: Taubin (krogi) proti stopnicam vokslov; zgornja pedunkla Z-Anatomy nista več ohranjena (od zadaj je bil
        # med malimi možgani MRI in deblom viden temen plavajoč kos)
        mali_mri=dict(delez=0.5, poravnava=0.0, glajenje=90, deblo=True, gube=25),
        # Deblo, mali možgani in sredinske strukture iz HRA brain v1.4 (Allen Human Brain Reference Atlas, CC BY 4.0;
        # mozgani_hra.py; datoteka v mapi --hra). Brez datoteke ostanejo Z-Anatomy in mali možgani MRI.
        # n4 (ocena n3: deblo HRA je raven valj z ločenim jajcem ponsa, mali možgani HRA gladki s »počesanimi« črtami, medmožgani
        # HRA v rezu prekrivajoče se sive ploskve): iz HRA ostanejo le bele sredinske strukture (skupine); deblo s tektumom
        # in medmožgani so spet Z-Anatomy, mali možgani spet iz MRI (prave fisure kot žlebovi). Vse skupine HRA: brez
        # »skupine«, »zamenjaj« in »maliMri«.
        hra_mozgani=dict(datoteka="3d-allen-m-brain.glb", zapri=dict(mali=0.0005), gosto=8,
                         skupine=r"^(Corpus callosum|Fornix|Anterior commissure|Optic chiasm) ", zamenjaj=r"^bela$", maliMri=True),
        nedotakni=r"\(HRA\)",
        poenostaviSkupaj=r"\(MRI\)\.([lr])$",  # režnji ene poloble so ena površina: brez razpok ob mejah režnjev
        tkiva=[
            (r"Cerebellum\.g", "mali"),
            (r"Brainstem\.g", "deblo"),
            (r"Corpus callosum|Fornix|commissure|Septum pellucidum|Optic (chiasm|tract)", "bela"),
            (r"Diencephalon\.g", "medmozgani"),
            (r"", "skorja"),
        ],
        deli=[
            (r"Frontal lobe\.g", "celni"),
            (r"Parietal lobe\.g", "temenski"),
            (r"Temporal lobe\.g", "senceni"),
            (r"Occipital lobe\.g", "zatilni"),
            (r"Limbic lobe\.g", "limbicni"),
            (r"Insula\.g", "otok"),
            (r"Cerebellum\.g", "mali"),
            (r"Corpus callosum", "zuljevo"),
            (r"Fornix|commissure|Septum pellucidum", "zuljevo"),
            (r"^Thalamus|Pulvinar|geniculate|Habenula|Pineal|Epithalamus|Metathalamus", "talamus"),
            (r"Optic (chiasm|tract)", "krizisce"),
            (r"Hypothalamus|Mamillary|Infundibul|Tuber cinereum|Pituitary|Hypophys", "hipotalamus"),
            (r"Diencephalon\.g", "talamus"),
            (r"Brainstem\.g", "deblo"),
        ],
        blizina=["celni", "temenski", "senceni", "zatilni", "limbicni"],
        ao_po_straneh=True,
    ),
    "srce": dict(
        vkljuci=r"/ Heart\.g( |$)|/ Arteries of heart\.g|/ Cardiac veins\.g|^(Ascending aorta|Aortic arch|Pulmonary trunk|Bifurcation of pulmonary trunk|Superior vena cava|"
                r"Inferior vena cava \(thoracic part\)|(Left|Right) (superior|inferior) pulmonary vein|Brachiocephalic trunk|Left common carotid artery|Left subclavian artery|"
                r"(Left|Right) pulmonary artery|Thoracic aorta)( |$)",
        izkljuci=r"Septal branches of anterior interventricular|\?\?\?|Posterior intercostal|Subcostal|Superior phrenic|Bronchial|Oesophageal|Mediastinal|Pericardial",
        cilj=(185_000, 33_000),  # PBR: drobni relief nosi normalna mapa; meja 6 / 2 MB z WebP (telefon ≥ 5 % rezerve)
        # Prekata: odprti debeli lupini, predznak prostornine izbere notranjo stran (zunanja stena izgine, vidna notranjost);
        # preverjeno s posnetkom 2026-11-04 (stari izvoz iz 08:50 je imel prav to obrnjeno smer).
        obrni=r"^(Left|Right) ventricle$",
        odprtost=True,  # G = odprtost: maščoba v žlebovih samo na zunanji ploskvi (mascaZunaj), ne v prekatih v prerezu
        # Lastna geometrija (srce_geometrija.py): sprednja lističa mitralne in trikuspidalne zaklopke s tetivami,
        # sprednja-stranska papilarna mišica levega prekata, septomarginalna trabekula, mesnate trabekule obeh prekatov.
        dodaj=["srce_dodatki", "srce_zile"],
        razdeli=["srce_razdeli"],  # srce_geometrija.srce_razdeli: ušesi, medprekatni pretin, conus (po normalah)
        # srce_zile (srce_zile.py): velike in venčne žile iz krivulj Z-Anatomy kot prava geometrija (zaprte cevi s steno,
        # veje aortnega loka, štiri pljučne vene, zaprta zadnja stena levega preddvora). Lastne cevi se ne poenostavijo
        # na računalniku, na telefonu blažje kot ostalo (»ohrani«): poenostavljena cev bi bila oglata.
        ohrani=r"\(lastno\)",
        # Stene vseh votlin iz povprečnega CT srca (srce_ct.py, Rodero et al. 2021, CC BY 4.0): pravi obris in debeline
        # (LV ≈ 10 mm, pretin zvezno s steno LV, RV ≈ 4 mm), en zaprt volumen (rez v vsaki ravnini poln). Deli Z-Anatomy
        # (zaklopke, tetive, papilarne mišice, žile) so poravnani nanj; stene CT so že poenostavljene (»nedotakni«).
        pozno=["srce_ct"], ct=dict(cilj=(78_000, 15_000)), hh229_cilj=(150_000, 28_000),  # možnost ORGANI_HH229=1: stena HH229 (trabekule, zaklopke, tetive v istem volumnu)
         # krog 8: telefon 15k (pri 11k raztrgan levi preddvor v prerezu)
        nedotakni=r"\(CT\)|\(lastno, CT",  # n10: zaklopke, papilarne mišice, krni ven imajo svojo telefonsko mrežo
        # Stena prekatov odebeljena navznoter (srce_geometrija.odebeli_steno): vir LV ≈ 9,2 mm, RV ≈ 3,0 mm → ≈ 12 mm
        # in ≈ 3,8 mm (učbeniško LV 10–15 mm, RV 3–5 mm, razmerje ≈ 3×); zunanji obris in žile ostanejo.
        stena={"Left ventricle": 0.0028, "Right ventricle": 0.0008},
        # Pečene PBR teksture (peka.py, Cycles): recept po tkivu. Maščoba sledi venčnim žilam v žlebovih (maska iz
        # razdalje do žil na zunanji ploskvi), miokard ima snope vlaken in drobne gube, notranjost votlin (endokard) je
        # bolj gladka in svetlejša, zaklopke so smetanaste. Peka 2048 px računalnik, 1024 px telefon (svoj atlas).
        tekstura=dict(
            pbr=True, px=(2048, 1024), vzorciNormala=16, vzorciBarva=16, vzorciAO=192, aoRazdalja=0.03, kletka=0.004, uvKot=66,
            # maščoba v žlebovih: stik zunanjih ploskev votlin (venčni in oba medprekatna žleba), ob venčnih žilah širša;
            # ob vejah na prosti steni prekatov le tanka sled (ne ob aorti, pljučnem deblu, pljučnih venah, lističih)
            maska=dict(zile=r"coronary (artery|sinus)|Coronary sinus|interventricular artery|Circumflex|cardiac vein|vein of left ventricle|branch of right coronary",
                       tkiva=["miokard"], votline=r"^(Left|Right) (atrium|ventricle)$", zleb=0.0065, zlebZila=0.005, sled=0.2),
            recepti={
                # miokard temnejši rjavkasto rdeč (žile izstopajo), vlažen a ne plastičen (hrap 0,38); maščoba izbočena
                # rumena blazinica z režnjiči ~2,5 mm (mascaNasip + mascaPremik, kletka za daljše žarke peke)
                "miokard": dict(barva=(0.24, 0.07, 0.05), barva2=(0.17, 0.05, 0.036), lise=0.45, hrap=0.56, gube=0.00016, gubeMera=0.004,
                                greben=0.00042,  # glavničaste mišice srčnih ušes (atribut GREBEN iz srce_ct.levo_uho, krog 7)
                                vlakna=0.00022, vlaknaMera=0.0016, masca=1.0, mascaBarva=(0.90, 0.66, 0.24), mascaBarva2=(0.92, 0.56, 0.17),
                                # n11 (ocena n10: »bež-kaki oblak brez režnjičev in sijaja«): nasičeno rumeno oranžna, izrazitejši režnjiči, vlažna
                                # krog 5 (predaja: »temne gube med ploščami maščobe«): plitvejši režnjiči, svetlejši žleb med njimi
                                mascaNasip=0.0010, mascaPremik=0.0015, mascaMera=0.007, mascaZleb=0.74, mascaHrap=0.36, kletka=0.009,
                                mascaMeja=(0.05, 0.8), mascaSum=0.18,  # krog 10 srca: pernat režnjičast rob maščobe (ne ploska lisa)
                                zilice=0.0, notranja=(0.36, 0.09, 0.07), notranjaHrap=0.40),
                "zaklopka": dict(barva=(0.83, 0.76, 0.64), barva2=(0.74, 0.60, 0.50), lise=0.4, hrap=0.36, gube=0.00006, gubeMera=0.002, razdeli=1),
                # Velike žile (srce_zile): adventicija z rahlimi vzdolžnimi gubami (vzdolz, po atributu OSI), vasa vasorum
                # (drobne rdečkaste žilice vzdolž stene), mat-vlažna hrapavost. NARAVNE barve (j, 6. 11.; učne barve so
                # v pregledovalniku, public/3d/barve.js): aorta in venčne arterije ista nasičena arterijska rdeča,
                # pljučne vene rdeče-vijolične, žile z vensko krvjo (pljučno deblo in arteriji, votli veni, srčne vene)
                # temno vijolično-rdeče kot skozi tanko steno, brez modre (modra samo v učnih barvah).
                # aorta in pljučno deblo: debela elastična stena, na preparatu smetanasto bela do rožnato siva (ne rdeča)
                # krog 8 (ocena: »gladke mat cevi, aorta bež, votli veni lila«): vse velike žile v isti družini tonov kot
                # srce (rožnato rdeče rjava adventicija), arterije svetlejše, vene temnejše (kri skozi tanko steno); lisasta
                # adventicija (lise), izrazitejše vzdolžne gube in vasa vasorum
                "aorta": dict(barva=(0.66, 0.40, 0.34), barva2=(0.55, 0.31, 0.27), lise=0.5, hrap=0.58, gube=0.00006, gubeMera=0.0018, razdeli=1,
                              vzdolz=0.00012, vzdolzRazmik=0.0024, vasa=0.6, vasaBarva=(0.50, 0.12, 0.10)),
                "pljucna": dict(barva=(0.64, 0.38, 0.33), barva2=(0.53, 0.30, 0.27), lise=0.5, hrap=0.58, gube=0.00006, gubeMera=0.0018, razdeli=1,
                                vzdolz=0.00011, vzdolzRazmik=0.0024, vasa=0.55, vasaBarva=(0.48, 0.12, 0.12)),
                "vena": dict(barva=(0.42, 0.20, 0.20), barva2=(0.34, 0.15, 0.16), lise=0.45, hrap=0.46, gube=0.00006, gubeMera=0.0018, razdeli=1,
                             vzdolz=0.00009, vzdolzRazmik=0.0022, vasa=0.4, vasaBarva=(0.26, 0.05, 0.08)),
                # pljučne vene: tanka stena, temno rdeče rjave (kri skozi steno), ne magenta (ocena n8)
                "pljucna-vena": dict(barva=(0.46, 0.23, 0.21), barva2=(0.38, 0.18, 0.17), lise=0.45, hrap=0.46, gube=0.00006, gubeMera=0.0018, razdeli=1,
                                     vzdolz=0.00009, vzdolzRazmik=0.0022, vasa=0.4, vasaBarva=(0.40, 0.05, 0.08)),
                # venčne arterije svetlo rdeče (izstopajo iz miokarda in maščobe), vene temno modrovijolične
                # n10: arterije bledo rožnato bele (debela stena), vene temne modro vijolične (kri skozi tanko steno)
                # n11 (ocena n10: »bele/kremaste nalepke«): bledo rožnato rjave (sveža arterija s krvjo za debelo steno)
                "vencna-arterija": dict(barva=(0.60, 0.33, 0.29), barva2=(0.54, 0.28, 0.25), lise=0.25, hrap=0.42, gube=0.00003, gubeMera=0.0015, razdeli=1,
                                        vzdolz=0.00002, vzdolzRazmik=0.0012),
                # vezivo (arterijska vez, dno ovalne kotanje, pars membranacea): mat sivobelo, brez sijaja
                # krog 8: vezivni trak v tonu adventicije (rožnato rjavkast, vzdolžna vlakna), ne siva kovina
                "vez": dict(barva=(0.68, 0.48, 0.42), barva2=(0.58, 0.40, 0.35), lise=0.35, hrap=0.72, gube=0.00004, gubeMera=0.0012, razdeli=1,
                            vzdolz=0.00008, vzdolzRazmik=0.0008),
                # prevodni sistem (shema): rumen kot v atlasih, rahlo svetleč
                "prevodni": dict(barva=(0.78, 0.62, 0.10), barva2=(0.70, 0.52, 0.08), lise=0.15, hrap=0.4, gube=0.00002, gubeMera=0.0015, razdeli=1),
                "vencna-vena": dict(barva=(0.25, 0.16, 0.26), barva2=(0.20, 0.12, 0.21), lise=0.25, hrap=0.42, gube=0.00003, gubeMera=0.0015, razdeli=1),
            },
        ),
        jedro=r"^(Right atrium|Right ventricle|Left atrium|Left ventricle)$",
        skatla=[0.004, 0.004, 0.02, 0.006, 0.006, 0.030],
        krivulja=(4, 3),
        tkiva=[
            (r"leaflet|valve", "zaklopka"),
            (r"papillary", "miokard"),
            (r"coronary artery|interventricular artery|Circumflex|branch of right coronary|Arteries of heart", "vencna-arterija"),
            (r"aorta|Aortic|Brachiocephalic|carotid|subclavian", "aorta"),
            (r"Pulmonary trunk|pulmonary artery|Bifurcation of pulmonary", "pljucna"),
            (r"pulmonary vein", "pljucna-vena"),
            (r"cardiac vein|Coronary sinus|Cardiac veins|vein of left ventricle", "vencna-vena"),
            (r"vein|vena cava|sinus", "vena"),
            (r"", "miokard"),
        ],
        deli=[
            (r"papillary muscle", "papilarne-misice"),
            (r"Trabeculae carneae of left", "trabekule-levega-prekata"),
            (r"Trabecula|trabecula", "trabekule-desnega-prekata"),
            (r"atrioventricular valve|Right atrioventricular", "av-zaklopki"),
            (r"Aortic valve|Root of aorta|coronary leaflet|Non-coronary", "aortna-zaklopka"),
            (r"Pulmonary valve|pulmonary valve", "pljucna-zaklopka"),
            (r"^Right atrium|Right auricle", "desni-preddvor"),
            (r"Right ventricle", "desni-prekat"),
            (r"^Left atrium|Left auricle", "levi-preddvor"),
            (r"Left ventricle", "levi-prekat"),
            (r"^Aorta|aorta|Aortic arch|Brachiocephalic|carotid|subclavian", "aorta"),
            (r"Pulmonary trunk|Bifurcation of pulmonary", "pljucno-deblo"),
            (r"pulmonary artery", "pljucne-arterije"),
            (r"vena cava", "votli-veni"),
            (r"pulmonary vein", "pljucne-vene"),
            (r"Arteries of heart|coronary artery|interventricular artery|Circumflex", "vencne-arterije"),
            (r"Cardiac veins|cardiac vein|Coronary sinus", "vencne-vene"),
        ],
    ),
    "oko": dict(
        # Zrklo iz HuBMAP Human Reference Atlas (VH male, levo oko, CC BY 4.0): ima vidni disk, rumeno pego, ciliarnik z
        # izrastki in plasti stene, ki jih Z-Anatomy nima (njena mrežnica je v prerezu lisasta). Mišice, kite in vidni živec
        # ostanejo iz Z-Anatomy; zrklo HRA poravnamo na beločnico Z-Anatomy (središče, velikost, os roženice, izstop živca).
        hra=dict(
            datoteka="3d-vh-m-eye-l.glb",
            zamenjaj=r"^(Sclera|Cornea|Iris|Lens|Retina|Vitreous body|Posterior segment of eyeball|Anterior segment of eyeball|Zonular fibres)\.l$",
            # vidni disk in rumena pega sta v HRA debela čepa (v prerezu štrlita iz mrežnice): pego nariše senčilnik mrežnice,
            izpusti=r"conjunctiva|aqueous|pupil|trabecular|schlemm|corneo_scleral|ciliary_muscle|macula|fovea",
            poravnaj_ob=(r"optic_disc", r"^VH_M_retina_L"),  # vidni disk: notranja ploskev v ravnini mrežnice (zapre luknjo v njej)
            os=(r"^Sclera\.l$", r"^Cornea\.l$", r"^Optic nerve"),
            os_hra=("sclera", "cornea", "optic_disc"),
            tkiva=[(r"suspensory", "vlakna"), (r"sclera", "beločnica"), (r"cornea", "roženica"), (r"iris", "šarenica"), (r"lens_L", "leča"),
                   (r"optic_disc", "papila"), (r"retina", "mrežnica"),
                   (r"vitreous", "steklovina"), (r"choroid", "žilnica"), (r"ciliary", "ciliarnik")],
            deli=[(r"sclera", "belocnica"), (r"cornea", "rozenica"), (r"iris", "sarenica"), (r"lens|suspensory", "leca"),
                  (r"retina|optic_disc", "mreznica"), (r"vitreous", "steklovina"), (r"choroid|ciliary", "zilnica")],
        ),
        vkljuci=r"^(Sclera|Cornea|Iris|Lens|Retina|Vitreous body|Posterior segment of eyeball|Anterior segment of eyeball|Zonular fibres|Optic nerve \(II\)|"
                r"(Superior|Inferior|Medial|Lateral) rectus muscle|(Superior|Inferior) oblique muscle|Trochlea of superior oblique muscle|Common tendinous ring)\.l( /|$)",
        izkljuci=r"Anterior chamber",
        cilj=(165_000, 40_000),
        # Pečene PBR teksture (videz): beločnica porcelanasto bela z drobnimi episkleralnimi žilicami, mišice rdeče z vlakni,
        # kite in živec sijoče bele; prozorna in s senčilnikom risana tkiva (roženica, leča, steklovina, šarenica, mrežnica)
        # dobijo nevtralen recept, pregledovalnik jih izključi s »tekstura: false« v oko.json.
        tekstura=dict(pbr=True, px=(2048, 1024), vzorciNormala=16, vzorciBarva=16, vzorciAO=192, aoRazdalja=0.03, kletka=0.004, uvKot=66,
            recepti={
                "*": dict(barva=(0.80, 0.80, 0.80), barva2=(0.78, 0.78, 0.78), lise=0.0, hrap=0.2, gube=0.0, razdeli=0),
                # krog 9 (ocena: »ploska bela plastika, žilice kot razpoke«): toplo umazano bela, rahlo lisasta (modrikasto
                # siva tanjša sprednja stena, rumenkasto zadaj), drobne svetlo rdeče episkleralne žilice
                "beločnica": dict(barva=(0.86, 0.81, 0.74), barva2=(0.80, 0.72, 0.66), lise=0.35, liseMera=0.04, hrap=0.34,
                                  gube=0.00002, gubeMera=0.002, zilice=0.22, ziliceBarva=(0.72, 0.28, 0.24), ziliceMera=0.03, razdeli=1),
                "mišica": dict(barva=(0.40, 0.10, 0.08), barva2=(0.27, 0.06, 0.05), lise=0.3, hrap=0.44, vlakna=0.0, vzdolz=0.00007, vzdolzRazmik=0.00055, gube=0.00002, razdeli=1,
                               kita=(0.88, 0.84, 0.78), kitaHrap=0.30),  # krog 9: kita v tonu beločnice (zlije se z njo)  # kite ob narastiščih (atribut KITA iz oko_misice.py)
                "kita": dict(barva=(0.86, 0.82, 0.75), barva2=(0.78, 0.73, 0.66), lise=0.2, hrap=0.30, vlakna=0.00008, vlaknaMera=0.0015, razdeli=1),
                "živec": dict(barva=(0.80, 0.72, 0.58), barva2=(0.72, 0.64, 0.50), lise=0.25, hrap=0.36, vlakna=0.00006, vlaknaMera=0.0015,
                              zilice=0.15, ziliceBarva=(0.55, 0.12, 0.10), ziliceMera=0.02, razdeli=1),
                "žilnica": dict(barva=(0.10, 0.04, 0.03), barva2=(0.16, 0.05, 0.04), lise=0.4, hrap=0.45, razdeli=1),
                "ciliarnik": dict(barva=(0.09, 0.04, 0.03), barva2=(0.14, 0.05, 0.04), lise=0.35, hrap=0.45, razdeli=1),
                "papila": dict(barva=(0.86, 0.66, 0.48), barva2=(0.80, 0.56, 0.42), lise=0.3, hrap=0.35, razdeli=1),
                "vlakna": dict(barva=(0.86, 0.84, 0.80), barva2=(0.82, 0.80, 0.76), lise=0.1, hrap=0.35, razdeli=0),
            },
        ),
        gladi=r".",
        # mišice na zrklo HRA: narastišča premih mišic 5,5–7,7 mm za limbusom, kite, nič pod beločnico (oko_misice.py)
        # krog m1: mišice so lastna geometrija (ocesne_misice_lastne: čisti trakovi po anatomski poti, svoja telefonska
        # mreža, brez poenostavitve); ocesne_misice ostane za šarenico in škripec, kite_na_zrklo ni več potreben
        dodaj=["ocesne_misice", "ocesne_misice_lastne"], nedotakni=r"(rectus|oblique) muscle",  # telefon: mišice ≈ 10k trikotnikov (pri 1,8 je bil rob narastišč nazobčan)
        # Krivulja vidnega živca se v Z-Anatomy začne pri leči: del znotraj zrkla odstranimo (sicer štrli v prerezu).
        znotraj=[(r"^Optic nerve", r"(?i)^sclera", 0.97)],
        krivulja=(6, 4),
        tkiva=[
            (r"^Sclera", "beločnica"), (r"^Cornea", "roženica"), (r"^Iris", "šarenica"), (r"^Lens", "leča"),
            (r"^Retina", "mrežnica"), (r"^Vitreous", "steklovina"), (r"Posterior segment", "žilnica"),
            (r"Anterior segment", "ciliarnik"), (r"Zonular", "vlakna"),
            (r"Optic nerve", "živec"), (r"Trochlea|tendinous", "kita"), (r"", "mišica"),
        ],
        deli=[
            (r"^Sclera", "belocnica"), (r"^Cornea", "rozenica"), (r"^Iris", "sarenica"), (r"^Lens|Zonular|Anterior segment", "leca"),
            (r"^Retina", "mreznica"), (r"^Vitreous", "steklovina"), (r"Posterior segment", "zilnica"), (r"Optic nerve", "vidni-zivec"),
            (r"", "misice"),
        ],
    ),
    # n4 (ocena n3: pljuča iz enega CT so bila slabša od r5): spet oblika r5 – režnji TotalSegmentator na pljučih Z-Anatomy,
    # bronhiji in žile Z-Anatomy z lastnimi vejami (pljucna_drevesa). Različica iz enega CT ostane v kodi kot možnost:
    # dodaj=["pljuca_ct"], pljuca_ct=dict(rezenj=(60000, 10000, 3300), telListi=2, racPolmer=0.00105), recept "hrustanec".
    "pljuca": dict(
        # Z-Anatomy: pet režnjev, sapnik, bronhiji do segmentnih in pljučne žile do segmentov. HRA (lung-male) ima lepše
        # bronhije s hrustančnimi obroči, a nima sapnika in žil, režnji so grobi segmenti (300–1400 trikotnikov), in
        # poravnava drevesa iz drugega telesa v režnje Z-Anatomy bi se ob hilusu videla (2026-11-04).
        vkljuci=r"/ Lungs\.g( |$)|^Trachea( /|$)|/ Bronchi\.g( |$)|^(Left|Right) pulmonary artery( /|$)|/ (Left|Right) pulmonary artery( |$)|^(Pulmonary trunk|Bifurcation of pulmonary trunk)( /|$)|"
                r"/ Pulmonary veins\.g( |$)",
        # desna spodnja pljučna vena Z-Anatomy je le 8 mm krn ob levem preddvoru (tudi po skrajšanju je visel med pljučema)
        izkljuci=r"\?\?\?|^Right inferior pulmonary vein( /|$)",
        cilj=(165_000, 40_000),
        # Pečene PBR teksture (videz): plevra vlažna in sijoča, pljučno tkivo rožnato sivo z mrežo režnjičev (interlobularni
        # pretini kot drobne temnejše meje) in ponekod sivimi pegami; hrustanec sapnika in bronhijev smetanasto rožnat.
        tekstura=dict(pbr=True, px=(2048, 1024), vzorciNormala=16, vzorciBarva=16, vzorciAO=192, aoRazdalja=0.03, kletka=0.004, uvKot=66,
            recepti={
                # vz2 (posnetek vz1: temne lise in brez vzorca režnjičev): svetlejša rožnata, mehkejše lise, svetlejši pretini
                "pljuca": dict(barva=(0.66, 0.37, 0.37), barva2=(0.54, 0.29, 0.31), lise=0.30, liseMera=0.04, hrap=0.32,
                               gube=0.00003, gubeMera=0.003, zilice=0.22, ziliceBarva=(0.42, 0.25, 0.27), ziliceMera=0.04, razdeli=1),
                "dihalna": dict(barva=(0.74, 0.60, 0.55), barva2=(0.66, 0.50, 0.47), lise=0.3, hrap=0.44, gube=0.00004, gubeMera=0.002, razdeli=1),
                "dihalna-v": dict(barva=(0.74, 0.60, 0.55), barva2=(0.66, 0.50, 0.47), lise=0.2, hrap=0.44, gube=0.0, razdeli=0),
                "pljucna-arterija": dict(barva=(0.44, 0.28, 0.30), barva2=(0.38, 0.23, 0.26), lise=0.3, hrap=0.42, gube=0.00003, gubeMera=0.002, razdeli=1),
                "pljucna-vena": dict(barva=(0.50, 0.26, 0.25), barva2=(0.43, 0.21, 0.21), lise=0.3, hrap=0.42, gube=0.00003, gubeMera=0.002, razdeli=1),
                "pljucna-arterija-v": dict(barva=(0.44, 0.28, 0.30), barva2=(0.38, 0.23, 0.26), lise=0.2, hrap=0.42, gube=0.0, razdeli=0),
                "pljucna-vena-v": dict(barva=(0.50, 0.26, 0.25), barva2=(0.43, 0.21, 0.21), lise=0.2, hrap=0.42, gube=0.0, razdeli=0),
            },
        ),
        jedro=r"lobe of (left|right) lung",
        skatla=[0.0, 0.0, 0.0, 0.0, 0.0, 0.045],
        krivulja=(6, 5),
        debelina=[(r"^(?!\(lastno\)).*(Bronchi\.g|Pulmonary|pulmonary artery)", 0.0011), (r"^Trachea( /|$)", 0.0012)],  # sapnik: stena, zgornji rob zaprt
        # prerezani konci pljučnih arterij in ven ob hilusu: slepa svetlina 2,5 mm (levo pljučno arterijo je pogled v prerezu
        # videl vzdolž osi kot tanek obroč v zraku)
        # krog 3: konci zaprti tik ob robu (0,4 mm; globlja ploščica je bila videti kot votel štrcelj), sredinski konci glavnih
        # pljučnih ven skrajšani za 6 mm (desna spodnja je za hilusom visela v zraku)
        slepiKonci=[(r"^Left pulmonary artery", 0.0004, 0.014),
                    (r"^(Left|Right) (superior|inferior) pulmonary vein", 0.0004, 0.006),
                    (r"^(?!\(lastno\))(?!Left pulmonary artery)(?!(Left|Right) (superior|inferior) pulmonary vein).*(Pulmonary|pulmonary artery)", 0.0004)],
        ravnoOdrezi=[(r"^Trachea( /|$)", 0.004)],
        # drevesa.pljucna_drevesa: režnji zaprti in v polni gostoti (prej jih je skupna poenostavitev stanjšala na ~2000
        # trikotnikov: natrgani robovi ob preponi), veje v pljučih iz središčnic (veje=True: še subsegmentne veje s
        # kolonizacijo prostora; v pljučih so bile videti kot ščetina ob čistem drevesu Z-Anatomy, zato izklopljeno). Te mreže
        # imajo svojo telefonsko različico (»nedotakni«), ostalo (sapnik, glavna bronhija, žile ob hilusu) dobi preostanek.
        dodaj=["pljucna_drevesa"], nedotakni=r"\(lastno\)",
        # Režnji iz CT (TotalSegmentator dataset v1, osebek s0913, CC BY 4.0; scripts/atlas/pljuca-ct.py): prave ploskve
        # režnjev s špranjami, poravnane na pljuča Z-Anatomy (ločeno levo in desno krilo). Brez datoteke ostanejo režnji Z-Anatomy.
        ct_rezenj="totalseg/pljuca-v1.npz",
        # n5: oblika kril (drevesa.oblika_kril): zaobljene rebrne ploskve, stožčast vrh, vbočena baza z ostrim robom, srčna
        # vtisnina in zareza levo; pljučno deblo Z-Anatomy (spredaj pod lokom aorte) z razcepiščem v desno in levo arterijo
        drevesa=dict(veje=False, razmik=0.014, korak=0.004, vpliv=0.05, ubij=0.006, skrci=0.0007, rezenjTelefon=0.38, telefonListi=3,
                     debloDolzina=0.04, oblika=dict(zaobli=0.85, zozi=0.42, zoziOd=0.3, kupola=0.018, rob=0.006, srce=(0.036, 0.010), lingula=0.012, bazaZozi=0.12)),
        # Veje v pljučih (segmentni bronhiji in žile) imajo svoja tkiva: v celoti so skrite (konci bi štrleli skozi
        # površino režnjev), v prerezu vidne.
        tkiva=[
            (r"^(Pulmonary trunk|Bifurcation of pulmonary trunk)", "pljucna-arterija"), (r"lobe of", "pljuca"), (r"^[^/]*segment[^/]*/.*Bronchi\.g", "dihalna-v"), (r"^Trachea|Bronchi\.g", "dihalna"),
            (r"^[^/]*(segment|of (left|right) lung)[^/]*/.*(artery|arteries)", "pljucna-arterija-v"),
            (r"^[^/]*(segment|of (left|right) lung)[^/]*/.*vein", "pljucna-vena-v"),
            (r"artery|arteries", "pljucna-arterija"), (r"vein", "pljucna-vena"), (r"", "dihalna"),
        ],
        deli=[
            (r"^Superior lobe of right", "desni-zgornji"), (r"^Middle lobe", "desni-srednji"), (r"^Inferior lobe of right", "desni-spodnji"),
            (r"^Superior lobe of left", "levi-zgornji"), (r"^Inferior lobe of left", "levi-spodnji"),
            (r"^Trachea", "sapnik"), (r"Bronchi\.g", "bronhiji"),
            (r"artery|arteries|^Pulmonary trunk|^Bifurcation of pulmonary trunk", "pljucne-arterije"), (r"vein", "pljucne-vene"),
        ],
    ),
    "ledvica": dict(
        # Ledvica iz HuBMAP HRA (kidney-male-left, CC BY 4.0): ovojnica, skorja, ledvični stebrički, piramide in papile
        # kot ločena telesa (prerez pokaže skorjo in sredico); Z-Anatomy ima eno samo mrežo, ledvični meh in žile v ledvici
        # pa sta izključena (IZLOCI, morda NC). Sečevod, ledvični žili in nadledvična žleza ostanejo iz Z-Anatomy.
        hra=dict(
            datoteka="3d-vh-m-kidney-l.glb",
            zamenjaj=r"^Kidney\.l$",
            poravnava="pca",
            izpusti=r"^$",
            os=(r"^Kidney\.l$",) * 3,
            os_hra=("kidney_capsule",) * 3,
            razdeli_pod=12000,
            zapri=r"pyramid|papilla|column",
            napihni=[(r"pyramid|papilla", 0.965), (r"column", 0.988)],
            tkiva=[(r"capsule", "ovojnica"), (r"cortex|column", "skorja"), (r"papilla", "papila"), (r"pyramid", "piramida"), (r"hilum", "sinus")],
            deli=[(r"capsule", "ovojnica"), (r"cortex|column", "skorja"), (r"pyramid", "piramide"), (r"papilla", "papile"), (r"hilum", "sinus")],
        ),
        # drevesa.ledvicne_zile: ledvična vena in arterija na novo (lastno) do hilusa in v sinus; svoja telefonska mreža
        dodaj=["ledvicni_meh", "ledvicne_zile"], nedotakni=r"Renal (vein|artery) \(lastno\)",
        sredisce_brez=r"^Ureter",
        meh_merilo=1.5, meh_jedro=0.0046,
        # osi čaš = osi naslikanih piramid (ledvica.json rezPiramide.seznam, GLB x, y), po črki papile HRA
        case=[("a", (-0.0008, -0.0014), (-0.5, 0.87)), ("b", (0.0016, 0.0007), (0.5, 0.87)), ("c", (0.0023, -0.0043), (0.92, 0.38)),
              ("e", (0.0003, -0.0030), (1.0, -0.05)), ("g", (0.0005, 0.0043), (0.92, -0.38)), ("h", (0.0017, -0.0019), (0.45, -0.89)),
              ("i", (-0.0037, -0.0019), (-0.4, -0.92))],
        casa_osi=dict(a=(-0.9903, 0.1392), b=(-0.4384, 0.8988), c=(0.3746, 0.9272), d=(0.9135, 0.4067), e=(0.9945, 0.1045), f=(0.9135, -0.4067), g=(0.6428, -0.766), h=(0.1045, -0.9945), i=(-0.6157, -0.788)),  # meh s čašicami iz metakroglic; ploskev ledvičnega sinusa (HRA hilum) potem izpustimo
        izpusti_po=r"hilum_of_kidney",
        telefonSkrci=[(r"outer_cortex", 0.0005)],
        # Z-Anatomy nadledvična žleza je ob HRA ledvici (merilo 0,77) predebela (4,9 × 4,5 × 2,1 cm): 0,72× z dnom na ledvici.
        napihni=[(r"^Suprarenal", 0.72, "dno")],
        zgladi_mrezo=[(r"^Suprarenal", 10, 0.5)],  # krog m1: brez grud (ocena: »lumpy ochre cap«)
        premakni=[(r"^Suprarenal", (0.0, -0.0075, -0.001))],
        vkljuci=r"^(Kidney\.l|Ureter\.l|Suprarenal gland\.l|Left renal artery|Left renal vein|(Anterior|Posterior) branch of renal artery\.l)( /|$)",
        cilj=(160_000, 40_000),
        # Pečene PBR teksture (videz): ovojnica gladka, sijoča, rdeče rjava; skorja zrnata (glomeruli), piramide temnejše
        # s progami, papile svetlejše; maščoba sinusa in nadledvična žleza rumeni; sečevod bledo rožnat.
        tekstura=dict(pbr=True, px=(2048, 1024), vzorciNormala=16, vzorciBarva=16, vzorciAO=192, aoRazdalja=0.03, kletka=0.004, uvKot=66,
            recepti={
                # krog m1 (ocena: »glossy plastic exterior without capsule detail«): bolj mat, zvezdaste venule pod ovojnico
                # (zilice), rahle vdolbine fetalne lobulacije (gube 0,06 mm na 5 mm) in drobna zrnatost
                "ovojnica": dict(barva=(0.27, 0.07, 0.055), barva2=(0.19, 0.045, 0.04), lise=0.45, liseMera=0.018, hrap=0.52, gube=0.00006, gubeMera=0.005,
                                 zilice=0.4, ziliceBarva=(0.17, 0.03, 0.035), ziliceMera=0.014, razdeli=1),
                "skorja": dict(barva=(0.30, 0.085, 0.07), barva2=(0.23, 0.065, 0.055), lise=0.35, hrap=0.40, gube=0.00004, gubeMera=0.0012, razdeli=1),
                "piramida": dict(barva=(0.25, 0.07, 0.07), barva2=(0.19, 0.05, 0.05), lise=0.4, hrap=0.40, vlakna=0.00008, vlaknaMera=0.002, razdeli=1),
                "papila": dict(barva=(0.50, 0.24, 0.21), barva2=(0.42, 0.19, 0.17), lise=0.3, hrap=0.36, razdeli=1),
                "sinus": dict(barva=(0.86, 0.64, 0.28), barva2=(0.80, 0.55, 0.22), lise=0.3, hrap=0.40, gube=0.00006, gubeMera=0.004, razdeli=1),
                "meh": dict(barva=(0.78, 0.64, 0.58), barva2=(0.70, 0.55, 0.50), lise=0.25, hrap=0.36, gube=0.00003, gubeMera=0.002, razdeli=1),
                "secevod": dict(barva=(0.74, 0.58, 0.52), barva2=(0.66, 0.50, 0.46), lise=0.25, hrap=0.40, gube=0.00003, gubeMera=0.002, razdeli=1),
                "arterija": dict(barva=(0.62, 0.34, 0.30), barva2=(0.55, 0.29, 0.26), lise=0.25, hrap=0.42, gube=0.00003, gubeMera=0.0015, razdeli=1),
                "vena": dict(barva=(0.36, 0.22, 0.26), barva2=(0.30, 0.18, 0.22), lise=0.25, hrap=0.42, gube=0.00003, gubeMera=0.0015, razdeli=1),
                "nadledvicna": dict(barva=(0.70, 0.52, 0.30), barva2=(0.62, 0.43, 0.24), lise=0.35, hrap=0.5, gube=0.00003, gubeMera=0.002,
                                    zilice=0.25, ziliceBarva=(0.45, 0.2, 0.15), ziliceMera=0.01, razdeli=1),
            },
        ),
        jedro=r"kidney_capsule",
        skatla=[0.03, 0.005, 0.01, 0.01, 0.035, 0.03],
        krivulja=(6, 5),
        debelina=[],  # sečevod ima steno že iz ledvicni_meh (votla cev)
        tkiva=[(r"^Ureter", "secevod"), (r"artery", "arterija"), (r"vein", "vena"), (r"Suprarenal", "nadledvicna"), (r"", "skorja")],
        deli=[(r"^Ureter", "secevod"), (r"artery", "ledvicna-arterija"), (r"vein", "ledvicna-vena"), (r"Suprarenal", "nadledvicna")],
    ),
    # n4 (ocena n3: jetra iz CT so bila slabša od r5): spet jetra Z-Anatomy z zraslimi drevesi (jetra_deli). Različica iz
    # HVA-CT ostane v kodi kot možnost: dodaj=["jetra_ct"], nedotakni=r"\((lastno|CT)\)" (potrebuje totalseg/jetra-ct-v1.npz).
    "jetra": dict(
        # Z-Anatomy: jetra po segmentih (I–VIII), žolčnik, žolčevod, portalna vena, jetrna arterija in jetrne vene. HRA
        # (liver-male) ima gostejšo ovojnico, a nima žolčnika, portalne vene in jetrnih ven (samo vtisnine in vezi).
        vkljuci=r"/ Liver( /|$)|^(Liver|Gallbladder|Bile duct|Hepatic portal vein|Hepatic veins|Proper hepatic artery|Common hepatic artery|Inferior vena cava \((abdominal|thoracic) part\))( /|$)|/ Extrahepatic bile ducts\.g( |$)",
        izkljuci=r"Tributaries|Gastroduodenal|^(?!Inferior vena cava).* / Inferior vena cava",
        cilj=(165_000, 40_000),
        # Pečene PBR teksture (videz): jetra temno rdeče rjava z gladko, sijočo Glissonovo ovojnico in komaj vidnim vzorcem
        # režnjičev; žolčnik temno zelen, žolčevod zelenkasto rumen, žile kot pri srcu (naravne barve).
        tekstura=dict(pbr=True, px=(2048, 1024), vzorciNormala=16, vzorciBarva=16, vzorciAO=192, aoRazdalja=0.03, kletka=0.004, uvKot=66,
            recepti={
                # manj nasičena (ocena: prenasičena, enakomerno sijoča), hrapavejša
                "jetra": dict(barva=(0.21, 0.075, 0.055), barva2=(0.155, 0.055, 0.042), lise=0.35, liseMera=0.035, hrap=0.36,
                              gube=0.00002, gubeMera=0.002, zilice=0.12, ziliceBarva=(0.13, 0.035, 0.025), ziliceMera=0.008, razdeli=0),
                "vez": dict(barva=(0.66, 0.50, 0.44), barva2=(0.58, 0.42, 0.38), lise=0.2, hrap=0.42, gube=0.00003, gubeMera=0.002, razdeli=0),
                "guba": dict(barva=(0.62, 0.40, 0.36), barva2=(0.54, 0.33, 0.30), lise=0.2, hrap=0.42, gube=0.00003, gubeMera=0.002, razdeli=0),
                # temno olivno zelen (žolč skozi steno), ne svetlo zelen
                "zolcnik": dict(barva=(0.10, 0.12, 0.035), barva2=(0.065, 0.08, 0.025), lise=0.35, hrap=0.30, gube=0.00004, gubeMera=0.003, razdeli=1),
                "zolcevod": dict(barva=(0.50, 0.50, 0.22), barva2=(0.42, 0.42, 0.18), lise=0.25, hrap=0.40, gube=0.00003, gubeMera=0.0015, razdeli=1),
                "portalna": dict(barva=(0.38, 0.23, 0.27), barva2=(0.32, 0.19, 0.23), lise=0.25, hrap=0.42, gube=0.00003, gubeMera=0.0015, razdeli=1),
                "arterija": dict(barva=(0.62, 0.34, 0.30), barva2=(0.55, 0.29, 0.26), lise=0.25, hrap=0.42, gube=0.00003, gubeMera=0.0015, razdeli=1),
                "vena": dict(barva=(0.36, 0.22, 0.26), barva2=(0.30, 0.18, 0.22), lise=0.25, hrap=0.42, gube=0.00003, gubeMera=0.0015, razdeli=1),
            },
        ),
        jedro=r"segment of liver|^Gallbladder",
        skatla=[0.005, 0.005, 0.005, 0.005, 0.03, 0.005],
        krivulja=(6, 5),
        gladi=r"segment of liver|Gallbladder",
        # jetra_geometrija.jetra_deli: ena gladka površina (Z-Anatomy »Liver«), razrezana v štiri režnje brez vidnih šivov,
        # srpasta in obla vez, spodnja votla vena, portalna vena, jetrne vene, arterija in žolčni vodi kot drevesa (lastno).
        dodaj=["jetra_deli"], nedotakni=r"\(lastno\)",
        jetra=dict(povrsina=(70000, 18000), razmikPortalna=0.013, razmikVene=0.016, telefonListi=1, portaDeblo=0.046, ivcZleb=0.021, repastiZleb=0.003),  # n5: vrata vidna od zadaj, vena v žlebu
        tkiva=[(r"segment of liver", "jetra"), (r"^Gallbladder", "zolcnik"), (r"Bile duct|bile", "zolcevod"),
               (r"portal", "portalna"), (r"artery", "arterija"), (r"vein", "vena"), (r"", "jetra")],
        deli=[(r"\((V|VI|VII|VIII)\)", "desni-rezenj"), (r"\((II|III)\)", "levi-rezenj"), (r"\(IV\)", "kvadratni-rezenj"), (r"\(I\)", "repasti-rezenj"),
              (r"^Gallbladder", "zolcnik"), (r"Bile duct|bile", "zolcevod"), (r"portal", "portalna-vena"), (r"artery", "jetrna-arterija"),
              (r"vein", "jetrne-vene")],
    ),
}

scene = bpy.context.scene
if BLEND:
    with bpy.data.libraries.load(BLEND, link=True) as (vir_, cilj_):
        cilj_.objects = list(vir_.objects)
    print(f"[organi] povezanih objektov: {len(bpy.data.objects)}", flush=True)
VSI = [o for o in bpy.data.objects if o is not None]


def veriga(o):
    t = [o.name]
    p = o.parent
    while p is not None:
        t.append(p.name)
        p = p.parent
    return " / ".join(t)


def tris(me):
    return sum(len(p.vertices) - 2 for p in me.polygons)


def prvi(seznam, niz, privzeto=None):
    for rx, k in seznam:
        if re.search(rx, niz):
            return k
    return privzeto


def obrezi(bm, lo, hi):
    """Odreže vse zunaj škatle [lo, hi] (Blenderjeve osi)."""
    for os_ in range(3):
        for znak, meja in ((-1, lo[os_]), (1, hi[os_])):
            n = Vector((0, 0, 0)); n[os_] = znak
            co = Vector((0, 0, 0)); co[os_] = meja
            geom = bm.verts[:] + bm.edges[:] + bm.faces[:]
            if not geom:
                return
            bmesh.ops.bisect_plane(bm, geom=geom, plane_co=co, plane_no=n, clear_outer=True)


def normale_navzven(me):
    """Normale navzven: dosledne po otokih, zaprte mreže obrnemo po predznaku prostornine."""
    bm = bmesh.new(); bm.from_mesh(me)
    # Osamljena oglišča (brez ploskev) glTF izpusti, a bi pokvarila središče, velikost in dolžino žarkov AO.
    bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context="VERTS")
    if me.get("usmerjeno"):  # cevi srce_zile.v_mrezo: normale so že navzven po središčnici
        odprtih = sum(1 for e in bm.edges if not e.is_manifold)
        bm.to_mesh(me); bm.free()
        return odprtih, False
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    odprtih = sum(1 for e in bm.edges if not e.is_manifold)
    vol = bm.calc_volume(signed=True)
    obrnjeno = False
    # Kot obrni_ce_navznoter v izvozi-z-anatomy.py: tudi skoraj zaprte mreže (odprtine žil, zaklopk) obrnemo po
    # predznaku prostornine, preden zapečemo senco; tanke odprte plošče pusti recalc_face_normals.
    if me.get("navzvenGlas"):  # odprta lupina z zaplato (srce_zile.zapri_luknjo): glas po ploščini od središča
        c = sum((v.co for v in bm.verts), Vector()) / max(len(bm.verts), 1)
        if sum(f.calc_area() * f.normal.dot(f.calc_center_median() - c) for f in bm.faces) < 0:
            bmesh.ops.reverse_faces(bm, faces=bm.faces); obrnjeno = True
    elif vol < 0 and odprtih <= 0.05 * max(len(bm.edges), 1):
        bmesh.ops.reverse_faces(bm, faces=bm.faces); obrnjeno = True
    bm.to_mesh(me); bm.free()
    return odprtih, obrnjeno


def zapeci_odprtost(objekti, velikost, zarkov=10):
    """Odprtost (kanal G v COLOR_0): delež dolgih žarkov (2 × velikost organa), ki pobegnejo iz organa. Zunanja ploskev
    ≈ 1, notranjost votlin (prekati, preddvori, notranjost žil) ≈ 0: pregledovalnik riše maščobo in žilice samo zunaj."""
    verts, polys, off = [], [], 0
    for o in objekti:
        me = o.data
        verts.extend(o.matrix_world @ v.co for v in me.vertices)
        polys.extend([off + i for i in p.vertices] for p in me.polygons)
        off += len(me.vertices)
    bvh = BVHTree.FromPolygons(verts, polys, all_triangles=False, epsilon=0.0)
    rnd = random.Random(11)
    smeri = []
    for i in range(zarkov):
        u, v = (i + 0.5) / zarkov, rnd.random()
        r, f = math.sqrt(u), 2 * math.pi * (v + i * 0.618)
        smeri.append(Vector((r * math.cos(f), r * math.sin(f), math.sqrt(max(0.0, 1 - u)))))
    eps = velikost * 2e-4
    rez = {}
    for o in objekti:
        me = o.data
        mw = o.matrix_world; mn = mw.to_3x3().inverted().transposed()
        od = []
        for v in me.vertices:
            n = (mn @ v.normal).normalized()
            p = mw @ v.co + n * eps
            t = n.orthogonal().normalized(); b = n.cross(t)
            ven = sum(1 for d in smeri if bvh.ray_cast(p, t * d.x + b * d.y + n * d.z, velikost * 2)[0] is None)
            od.append(ven / zarkov)
        sos = [[] for _ in me.vertices]
        for e in me.edges:
            a_, b_ = e.vertices; sos[a_].append(b_); sos[b_].append(a_)
        for _ in range(2):
            od = [0.5 * od[i] + 0.5 * (sum(od[j] for j in s_) / len(s_) if s_ else od[i]) for i, s_ in enumerate(sos)]
        rez[o.name] = od
    return rez


def zapeci_ao(objekti, velikost, zarkov=14, po_straneh=False, odprtost=None):
    """Senca okolice z žarki po vsem organu (vsi objekti skupaj): pregibi, brazde in reže so temnejši.
    po_straneh: leva stran (.l) ne senči desne (.r) in obratno (možgani: notranja ploskev polobel ostane svetla,
    ker jo v prerezu po sredini gledamo brez druge poloble)."""
    if po_straneh:
        for stran, druga in (("l", "r"), ("r", "l"), ("s", None)):
            cilj = [o for o in objekti if (o.name[-2:] == "." + stran if stran != "s" else o.name[-2:] not in (".l", ".r"))]
            ovire = [o for o in objekti if not (druga and o.name[-2:] == "." + druga)]
            if cilj:
                _zapeci_ao(cilj, velikost, zarkov, ovire)
        return
    return _zapeci_ao(objekti, velikost, zarkov, objekti, odprtost)


def _zapeci_ao(objekti, velikost, zarkov, ovire, odprtost=None):
    verts, polys, off = [], [], 0
    for o in ovire:
        me = o.data
        verts.extend(o.matrix_world @ v.co for v in me.vertices)
        polys.extend([off + i for i in p.vertices] for p in me.polygons)
        off += len(me.vertices)
    bvh = BVHTree.FromPolygons(verts, polys, all_triangles=False, epsilon=0.0)
    rnd = random.Random(7)
    smeri = []
    for i in range(zarkov):  # kosinusno utežene smeri na polobli (z = normala)
        u, v = (i + 0.5) / zarkov, rnd.random()
        r, f = math.sqrt(u), 2 * math.pi * (v + i * 0.618)
        smeri.append(Vector((r * math.cos(f), r * math.sin(f), math.sqrt(max(0.0, 1 - u)))))
    dolzina = velikost * 0.14
    eps = velikost * 1e-4
    for o in objekti:
        me = o.data
        mw = o.matrix_world; mn = mw.to_3x3().inverted().transposed()
        ao = []
        for v in me.vertices:
            n = (mn @ v.normal).normalized()
            p = mw @ v.co + n * eps
            t = n.orthogonal().normalized(); b = n.cross(t)
            zad = 0.0
            for d in smeri:
                w = t * d.x + b * d.y + n * d.z
                hit = bvh.ray_cast(p, w, dolzina)
                if hit[0] is not None:
                    zad += 1.0 - (hit[3] / dolzina) ** 2 * 0.6
            ao.append(1.0 - zad / zarkov)
        # rahlo glajenje po robovih
        sos = [[] for _ in me.vertices]
        for e in me.edges:
            a, b2 = e.vertices; sos[a].append(b2); sos[b2].append(a)
        ao = [0.5 * ao[i] + 0.5 * (sum(ao[j] for j in s) / len(s) if s else ao[i]) for i, s in enumerate(sos)]
        sa = me.color_attributes.get("SULC")
        globina = (odprtost or {}).get(o.name) or [0.0] * len(ao); krajevna = [0.0] * len(ao)
        if sa is not None:  # skorja iz MRI: globoke brazde temnejše (globina iz FreeSurfer sulc)
            ao = [x * (1.0 - SULC_MOC * sa.data[i].color[0]) for i, x in enumerate(ao)]
            globina = [sa.data[i].color[1] for i in range(len(ao))]
            krajevna = [sa.data[i].color[2] for i in range(len(ao))]
            me.color_attributes.remove(sa)
        for a in [a for a in me.color_attributes if a.name.startswith("AO")]:  # telefon: kopija računalniške mreže
            me.color_attributes.remove(a)
        # COLOR_0: R = senca okolice, G = globina brazde (skorja iz MRI) ali odprtost (cfg odprtost), B = krajevna globina. Pregledovalnik barve oglišč ne
        # množi z barvo tkiva, ampak bere kanale kot podatke (organ.js: vOrgAO, vOrgD).
        attr = me.color_attributes.new("AO", "FLOAT_COLOR", "POINT")
        for i, a in enumerate(ao):
            g = 0.22 + 0.78 * max(0.0, min(1.0, a)) ** 1.15
            attr.data[i].color = (g, globina[i], krajevna[i], 1.0)
        me.color_attributes.active_color = attr


# ---------- FreeSurfer (pialna površina, sulc, aparc) ----------
def fs_povrsina(pot):
    import numpy as np, struct
    with open(pot, "rb") as f:
        assert f.read(3) == b"\xff\xff\xfe"
        f.readline(); f.readline()
        vn, fn = struct.unpack(">ii", f.read(8))
        v = np.frombuffer(f.read(vn * 12), ">f4").reshape(-1, 3).astype(np.float64)
        t = np.frombuffer(f.read(fn * 12), ">i4").reshape(-1, 3).astype(np.int64)
    return v, t


def fs_krivulja(pot):
    import numpy as np, struct
    with open(pot, "rb") as f:
        assert f.read(3) == b"\xff\xff\xff"
        vn, fn, k = struct.unpack(">iii", f.read(12))
        return np.frombuffer(f.read(vn * 4 * k), ">f4").astype(np.float64)


def fs_oznake(pot):
    import numpy as np, struct
    with open(pot, "rb") as f:
        rd = lambda n=1: struct.unpack(">" + "i" * n, f.read(4 * n))
        vn, = rd()
        d = np.frombuffer(f.read(vn * 8), ">i4").reshape(-1, 2)
        lab = np.zeros(vn, np.int64); lab[d[:, 0]] = d[:, 1]
        assert rd()[0] == 1
        n, = rd(); assert n < 0  # različica 2 barvne tabele
        rd(); dl, = rd(); f.read(dl); ne, = rd()
        imena = {}
        for _ in range(ne):
            idx, nl = rd(2); ime = f.read(nl).rstrip(b"\0").decode()
            r, g, b, t = rd(4); imena[r + g * 256 + b * 65536] = ime
    return [imena.get(int(x), "unknown") for x in lab]


# Desikan-Killiany (aparc) → del organa; »unknown« je medialna stena (rez med polobloma): jo izpustimo.
APARC_DELI = {
    "celni": "superiorfrontal rostralmiddlefrontal caudalmiddlefrontal parsopercularis parstriangularis parsorbitalis "
             "lateralorbitofrontal medialorbitofrontal precentral paracentral frontalpole",
    "temenski": "superiorparietal inferiorparietal supramarginal postcentral precuneus",
    "senceni": "superiortemporal middletemporal inferiortemporal bankssts fusiform transversetemporal temporalpole",
    "zatilni": "lateraloccipital lingual cuneus pericalcarine",
    "limbicni": "rostralanteriorcingulate caudalanteriorcingulate posteriorcingulate isthmuscingulate parahippocampal entorhinal",
    "otok": "insula",
}
APARC_IME = {"celni": "Frontal lobe", "temenski": "Parietal lobe", "senceni": "Temporal lobe", "zatilni": "Occipital lobe",
             "limbicni": "Limbic lobe", "otok": "Insula", "sredina": "Medial wall"}


def slepi_konci(me, glob, skrajsaj=0.0):
    """Odprte konce cevi zapre s slepo svetlino: ploščica »glob« navznoter (proti notranjim sosedom roba), 0,8 × polmer.
    skrajsaj > 0: najbolj sredinski konec (najmanjši |x|) se najprej skrajša za toliko metrov – rez pravokotno na os cevi,
    samo v okolici konca (leva pljučna arterija: prvi del teče naprej proti deblu in je bil v prerezu viden vzdolž osi
    kot obroč; po skrajšanju gleda rez proti sredini). Vrne število zaprtih koncev."""
    bm = bmesh.new(); bm.from_mesh(me)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-6)
    if skrajsaj > 0:
        rob = [e for e in bm.edges if len(e.link_faces) == 1]
        if rob:
            # najbolj sredinski konec: oglišča roba blizu tistega z najmanjšim |x|
            v0 = min({v for e in rob for v in e.verts}, key=lambda v: abs(v.co.x))
            zan = {v for e in rob for v in e.verts if (v.co - v0.co).length < 0.04}
            c = sum((v.co for v in zan), Vector()) / len(zan)
            pol = max((v.co - c).length for v in zan)
            nav = Vector()
            for v in zan:
                for e in v.link_edges:
                    o = e.other_vert(v)
                    if o not in zan:
                        nav += o.co - v.co
            # os cevi: od konca do težišča oglišč v krogli »skrajsaj« (ne smer prvega obroča)
            blizu = [v.co for v in bm.verts if (v.co - c).length < skrajsaj * 1.3]
            os_ = (sum(blizu, Vector()) / len(blizu) - c) if blizu else nav
            os_ = os_.normalized() if os_.length > 1e-9 else nav.normalized()
            q = c + os_ * skrajsaj
            okolica = [f for f in bm.faces if (f.calc_center_median() - c).length < skrajsaj + 2.5 * pol]
            geom = list({x for f in okolica for x in list(f.verts) + list(f.edges)}) + okolica
            bmesh.ops.bisect_plane(bm, geom=geom, plane_co=q, plane_no=-os_, clear_outer=True)
            bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context="VERTS")
    rob = [e for e in bm.edges if len(e.link_faces) == 1]
    if not rob:
        bm.free(); return 0
    # zanke robov (povezane komponente)
    vz = {}
    for e in rob:
        for v in e.verts:
            vz.setdefault(v, []).append(e)
    videno = set(); zanke = []
    for v0 in vz:
        if v0 in videno:
            continue
        sk = [v0]; videno.add(v0); i = 0
        while i < len(sk):
            for e in vz[sk[i]]:
                o = e.other_vert(sk[i])
                if o not in videno:
                    videno.add(o); sk.append(o)
            i += 1
        zanke.append(sk)
    n = 0
    for sk in zanke:
        if len(sk) < 5:
            continue
        c = sum((v.co for v in sk), Vector()) / len(sk)
        nav = Vector()
        rset = set(sk)
        for v in sk:
            for e in v.link_edges:
                o = e.other_vert(v)
                if o not in rset:
                    nav += o.co - v.co
        if nav.length < 1e-9:
            continue
        nav.normalize()
        # zanka po vrsti (sosednji robovi)
        red = [sk[0]]
        while len(red) < len(sk):
            nx = [e.other_vert(red[-1]) for e in vz[red[-1]] if e.other_vert(red[-1]) not in red[-2:]]
            if not nx or nx[0] in red:
                break
            red.append(nx[0])
        if len(red) < len(sk):
            continue
        # čep: ploščica v svetlini (0,8 × polmer, »glob« navznoter), obrnjena proti odprtini; SOLIDIFY (debelina) jo odebeli
        # kot steno. Ne podaljšek roba: zavoj za 180° ob robu bi SOLIDIFY z enakomerno debelino raztegnil v igle.
        nv = [bm.verts.new(c + (v.co - c) * 0.8 + nav * glob) for v in red]
        f = bm.faces.new(nv)
        if f.normal.dot(nav) > 0:
            f.normal_flip()
        n += 1
    bmesh.ops.triangulate(bm, faces=[f for f in bm.faces if len(f.verts) > 3])
    bm.to_mesh(me); bm.free(); me.update()
    return n


def mali_iz_mri(osnovni, mri, mm, lo, hi, tmp):
    """Mali možgani iz segmentacije MRI istega osebka (scripts/atlas/mali-mozgani-mri.py → <osebek>-mali.npz) namesto
    režnjičev Z-Anatomy. Preslikava kot skorja (RAS → Blender, škatla skorje MRI na škatlo skorje Z-Anatomy): mali možgani
    sedijo pod zatilnim režnjem kot pri osebku. mali_mri.poravnava (0–1) doda delež premika, ki deblo MRI postavi na deblo
    Z-Anatomy (sredina x; y in vrh z zgornjih 25 mm); 1,0 je mali možgane spustil 7 mm in pomaknil 9 mm naprej (vrzel pod
    zatilnim režnjem), zato 0 – deblo Z-Anatomy se vseeno prilega (posnetek 2026-11-13). Vrne nove vrstice osnovni (brez
    režnjičev Z-Anatomy) in fastigij (Blender, m)."""
    import numpy as np
    from drevesa import poenostavi
    d = np.load(os.path.join(MRI, f"{mri['osebek']}-mali.npz"))
    T = mri_preslikava(MRI, mri["osebek"], lo, hi)
    D = T(d["deblo_v"])
    Z = np.array([list(v.co) for r in osnovni if r[2] == "deblo" for v in r[1].vertices])
    premik = np.zeros(3)
    if len(Z):
        zg = lambda X: X[X[:, 2] > X[:, 2].max() - 0.025]
        premik = np.array([0.5 * (Z[:, 0].min() + Z[:, 0].max() - D[:, 0].min() - D[:, 0].max()),
                           zg(Z)[:, 1].mean() - zg(D)[:, 1].mean(), Z[:, 2].max() - D[:, 2].max()]) * mm.get("poravnava", 1.0)
    M = T(d["mali_v"]) + premik
    F = T(d["fastigij"][None])[0] + premik
    me = bpy.data.meshes.new("Cerebellum (MRI)"); me.from_pydata(M.tolist(), [], d["mali_f"].tolist())
    if mm.get("glajenje"):  # stopnice vokslov (1 mm) iz segmentacije: Taubin brez krčenja (posnetek: proge na polobli)
        from drevesa import taubin_bm
        bm = bmesh.new(); bm.from_mesh(me); taubin_bm(bm, mm["glajenje"]); bm.to_mesh(me); bm.free()
    me = poenostavi(me, mm.get("delez", 0.5), tmp)
    if mm.get("gube"):
        # n5: po poenostavitvi ostanejo na poloblah ravne ostre gube (rob dveh rezin segmentacije); čeznje gre šiv UV in
        # peka tam zgreši visoko mrežo → bleda črta čez poloblo (ocena n4). Oglišča ob gubah (z dvema obročema) zgladimo.
        bm = bmesh.new(); bm.from_mesh(me); bm.normal_update()
        for _ in range(3):
            ostri = {v for e in bm.edges if len(e.link_faces) == 2 and e.calc_face_angle(0.0) > math.radians(mm["gube"]) for v in e.verts}
            if not ostri:
                break
            for _ in range(2):
                ostri |= {e.other_vert(v) for v in ostri for e in v.link_edges}
            for _ in range(8):
                bmesh.ops.smooth_vert(bm, verts=list(ostri), factor=0.5, use_axis_x=True, use_axis_y=True, use_axis_z=True)
            bm.normal_update()
        print(f"[organi] mali možgani: zglajene gube nad {mm['gube']}°, zadnji krog {len(ostri)} oglišč")
        bm.to_mesh(me); bm.free()
    ostane = re.compile(mm.get("ohrani", r"^$"))
    stari = [r for r in osnovni if r[2] == "mali" and not ostane.search(r[0])]
    print(f"[organi] mali možgani iz MRI ({mri['osebek']}): {tris(me)} trikotnikov namesto {len(stari)} režnjičev Z-Anatomy, "
          f"premik na deblo {[round(float(x) * 1000, 1) for x in premik]} mm, fastigij {[round(float(x), 4) for x in F]}")
    nove = [["Cerebellum (MRI)", me, "mali", "mali", "Cerebellum (MRI)"]]
    if mm.get("deblo"):
        # n5: tudi možgansko deblo iz segmentacije istega osebka (aseg 16): rezna ploskev je rezina MRI tega osebka
        # (mozgani-rez-mri.py), deblo Z-Anatomy bi ob njej štrlelo izza risbe
        from drevesa import taubin_bm
        md = bpy.data.meshes.new("Brainstem (MRI)"); md.from_pydata((D + premik).tolist(), [], d["deblo_f"].tolist())
        bm = bmesh.new(); bm.from_mesh(md); taubin_bm(bm, mm.get("debloGlajenje", 40)); bmesh.ops.recalc_face_normals(bm, faces=bm.faces); bm.to_mesh(md); bm.free()
        for pl in md.polygons:
            pl.use_smooth = True
        stari += [r for r in osnovni if r[2] == "deblo"]
        nove.append(["Brainstem (MRI)", md, "deblo", "deblo", "Brainstem (MRI)"])
        print(f"[organi] možgansko deblo iz MRI: {tris(md)} trikotnikov namesto {sum(1 for r in stari if r[2] == 'deblo')} objektov Z-Anatomy")
    return [r for r in osnovni if r not in stari] + nove, F


def sredinska_ravnina(vl, vr, celica=0.01, okno=0.007):
    """Sredinska ravnina med polobloma (Blender, metri; leva polobla X > 0): X = a0 + b·Y + c·Z. V vsaki celici (Y, Z)
    sredina med medialnim robom leve (0,5. percentil X) in desne (99,5. percentil X), kjer sta si robova blizu (reža med
    −4 in +6 mm: tam se polobli soočata čez veliko fisuro); utežena najmanjša kvadrata."""
    import numpy as np
    vse = np.concatenate([vl, vr])
    lo, hi = vse.min(0), vse.max(0)
    A, B, W = [], [], []
    for y in np.arange(lo[1], hi[1], celica):
        ml_y = np.abs(vl[:, 1] - y) < okno; mr_y = np.abs(vr[:, 1] - y) < okno
        for z in np.arange(lo[2], hi[2], celica):
            ml = ml_y & (np.abs(vl[:, 2] - z) < okno); mr = mr_y & (np.abs(vr[:, 2] - z) < okno)
            if ml.sum() < 20 or mr.sum() < 20:
                continue
            xl, xr = np.percentile(vl[ml, 0], 0.5), np.percentile(vr[mr, 0], 99.5)
            if -0.004 < xl - xr < 0.006:
                A.append((1.0, y, z)); B.append(0.5 * (xl + xr)); W.append(min(ml.sum(), mr.sum()))
    if len(A) < 6:
        return 0.5 * (vl[:, 0].min() + vr[:, 0].max()), 0.0, 0.0
    w = np.sqrt(np.array(W, float))
    a0, b, c = np.linalg.lstsq(np.array(A) * w[:, None], np.array(B) * w, rcond=None)[0]
    print(f"[organi] skorja MRI: sredinska ravnina X = {a0 * 1000:.2f} mm + {b:.4f} Y + {c:.4f} Z ({len(A)} celic)")
    return a0, b, c


def mri_preslikava(mapa, osebek, lo, hi):
    """Preslikava RAS (mm, tkr kot *.pial) → Blender (m) za skorjo in male možgane MRI: os (levo +X, spredaj −Y, gor +Z),
    strig na sredinsko ravnino, škatla skorje MRI na škatlo [lo, hi] skorje Z-Anatomy, sredina MRI na sredino škatle.
    Glava v skenerju je rahlo zasukana (sub-01: sredina med polobloma gre od x ≈ −1 mm zadaj do x ≈ +3 mm spredaj); brez
    striga je ravnina skozi sredino škatle sekala sprednji del leve poloble – orbitalna ploskev in gyrus rectus sta se
    ob omejitvi na svojo stran sredine prepognila v sive raztrgane lise v prerezu."""
    import numpy as np
    pre = lambda v: np.stack([-v[:, 0], -v[:, 1], v[:, 2]], 1) * 0.001
    vl, vr = (pre(fs_povrsina(os.path.join(mapa, f"{osebek}-{h}.pial"))[0]) for h in ("lh", "rh"))
    a0, nb, nc = sredinska_ravnina(vl, vr)
    strig = lambda v: v - np.outer(a0 + nb * v[:, 1] + nc * v[:, 2], (1.0, 0.0, 0.0))
    P = strig(np.concatenate([vl, vr]))
    a, b = P.min(0), P.max(0)
    lo = np.array(lo, float); hi = np.array(hi, float)
    k = (hi - lo) / (b - a)
    zamik = np.array((0.5 * (lo[0] + hi[0]) - ((0.0 - a[0]) * k[0] + lo[0]), 0.0, 0.0))  # X = 0 po strigu → sredina
    return lambda v: (strig(pre(v)) - a) * k + lo + zamik


def skorja_iz_mri(mapa, m, lo, hi):
    """Vrstice osnovni za pialno skorjo obeh polobel, poravnano na škatlo [lo, hi] (Blender, metri)."""
    import numpy as np
    del_za = {ime: d for d, s in APARC_DELI.items() for ime in s.split()}
    T = mri_preslikava(mapa, m["osebek"], lo, hi)
    # n5: afina preslikava RAS (mm, tkr) → Blender (m) kot matrika 3×4 za risbo reza iz MRI (mozgani-rez-mri.py)
    _o = T(np.zeros((1, 3)))[0]
    m["_afina"] = np.column_stack([T(np.eye(3)[i][None] * 100.0)[0] - _o for i in range(3)] + [_o * 100.0]) / 100.0
    hem = {}
    for h, stran in (("lh", "l"), ("rh", "r")):
        v, t = fs_povrsina(os.path.join(mapa, f"{m['osebek']}-{h}.pial"))
        sulc = fs_krivulja(os.path.join(mapa, f"{m['osebek']}-{h}.sulc"))
        lab = fs_oznake(os.path.join(mapa, f"{m['osebek']}-{h}.aparc.annot"))
        hem[stran] = (T(v), t, sulc, lab)
    vrstice = []
    sred = 0.5 * (lo[0] + hi[0])  # sredinska ravnina (Z-Anatomy je simetrična, rez v prerezu je tu)
    for stran, (v, t, sulc, lab) in hem.items():
        # Polobla ostane na svoji strani sredine (vsaj 1,6 mm; ravnina prereza je 0,4 mm od sredine): MRI polobli se ob
        # sredini dotikata, rez bi ju razrezal v drobce. Pas [najmanjši d, m0 + w] se linearno stisne na [m0, m0 + w]
        # (naklon ~1/3): plasti površine, ki so segale čez sredino, ostanejo razmaknjene. Prejšnja mehka meja (softplus)
        # jih je stisnila na isto ravnino; peka normal je tam zadela sosednjo plast in normalna mapa je na orbitalni
        # ploskvi risala sive bleščeče lise. Dlje od sredine se nič ne spremeni.
        zn = 1.0 if stran == "l" else -1.0
        d = (v[:, 0] - sred) * zn
        m0, w = 0.0016, 0.002
        dmin = min(float(d.min()), m0)
        pas = d < m0 + w
        d = np.where(pas, m0 + (d - dmin) * w / (m0 + w - dmin), d)
        dl = np.array([del_za.get(x) for x in lab], dtype=object)
        ime_o = np.array(lab, dtype=object)
        if m.get("zatilniCrta", True) and (dl == "zatilni").any():
            # n4 (ocena n3: zatilni reženj le majhna kapa, temenski skoraj do zatilnega pola): na stranski ploskvi aparc
            # nima meje zatilnega režnja, zato jo določi učbeniška črta od vrha parietookcipitalne brazde (sprednji zgornji
            # rob kuneusa) do preokcipitalne zareze (≈ 4,5 cm pred zatilnim polom na spodnjem robu); stranska območja
            # temenskega in senčnega režnja za to črto postanejo zatilni reženj. Medialna stran ostane po aparc.
            occ = dl == "zatilni"
            s_y = 1.0 if v[occ, 1].mean() > v[dl == "celni", 1].mean() else -1.0
            yp = v[:, 1] * s_y  # večji = bolj zadaj
            kun = np.flatnonzero(ime_o == "cuneus")
            vrh = kun[v[kun, 2] >= np.quantile(v[kun, 2], 0.9)]
            vrh = vrh[yp[vrh] <= np.quantile(yp[vrh], 0.3)]
            A = np.array([yp[vrh].mean(), v[vrh, 2].mean()])
            pol = float(yp[occ].max()); yb = pol - m.get("zatilniZareza", 0.045)
            pas_b = np.abs(yp - yb) < 0.003
            B = np.array([yb, float(np.quantile(v[pas_b, 2], 0.02))])
            stran_f = lambda Y, Z: (Y - A[0]) * (B[1] - A[1]) - (Z - A[1]) * (B[0] - A[0])
            zn_p = np.sign(stran_f(pol, 0.5 * (A[1] + B[1])))
            stranska = np.isin(ime_o, ["superiorparietal", "inferiorparietal", "supramarginal", "middletemporal", "inferiortemporal", "bankssts", "superiortemporal"])
            nov = stranska & (stran_f(yp, v[:, 2]) * zn_p > 0) & (d > 0.012)
            dl[nov] = "zatilni"
            print(f"[organi] skorja MRI {stran}: zatilni reženj po črti POS–zareza: +{int(nov.sum())} oglišč (prej {int(occ.sum())}); A {A.round(4)}, B {B.round(4)}")
        if m.get("silvij", 0) > 0:
            # n5 (ocena n4: »no Sylvian fissure, temporal pole not free«): pialna površina živega človeka (MRI) ima stransko
            # brazdo zaprto – operkuli se dotikajo, zato je bila videti kot navadna brazda. Kot pri fiksiranem preparatu
            # se senčni reženj zasuka navzdol okoli zadnjega konca brazde (pol se spusti za »silvij« m): brazda se odpre,
            # senčni pol je prost. Utež (senčna območja 1, insula delno) se zgladi po površini, da se dno brazde raztegne.
            from scipy import sparse
            w_s = np.isin(ime_o, ["superiortemporal", "middletemporal", "inferiortemporal", "bankssts", "fusiform", "transversetemporal",
                                  "temporalpole", "entorhinal", "parahippocampal"]).astype(float)
            w_s[ime_o == "insula"] = 0.3
            ii = np.concatenate([t[:, 0], t[:, 1], t[:, 2], t[:, 1], t[:, 2], t[:, 0]]); jj = np.concatenate([t[:, 1], t[:, 2], t[:, 0], t[:, 0], t[:, 1], t[:, 2]])
            A_s = sparse.csr_matrix((np.ones(len(ii)), (ii, jj)), shape=(len(v), len(v))); A_s.data[:] = 1.0
            st_s = np.maximum(np.asarray(A_s.sum(1)).ravel(), 1)
            for _ in range(m.get("silvijGlajenje", 25)):
                w_s = 0.5 * w_s + 0.5 * (A_s @ w_s) / st_s
            s_y = 1.0 if v[dl == "zatilni", 1].mean() > v[dl == "celni", 1].mean() else -1.0
            yp = v[:, 1] * s_y
            pol_s = float(yp[ime_o == "temporalpole"].min()) if (ime_o == "temporalpole").any() else float(yp[dl == "senceni"].min())
            a_s = np.clip((pol_s + m.get("silvijDolzina", 0.08) - yp) / m.get("silvijDolzina", 0.08), 0.0, 1.0)
            v[:, 2] -= m["silvij"] * w_s * a_s
            print(f"[organi] skorja MRI {stran}: stranska brazda odprta, senčni pol −{m['silvij'] * 1000:.0f} mm (premaknjenih {int((w_s * a_s > 0.05).sum())} oglišč)")
        # n4 (ocena n3: oranžna lisa ob hipotalamusu v učnih barvah): oznaka »insula« ob sredinski ravnini (< 18 mm) ni otok,
        # temveč subkalozno polje medialne ploskve → limbični reženj
        otok_m = (dl == "otok") & (d < m.get("otokOdSredine", 0.018))
        if otok_m.any():
            dl[otok_m] = "limbicni"
            print(f"[organi] skorja MRI {stran}: {int(otok_m.sum())} oglišč »insula« ob sredini → limbični reženj")
        # Neoznačena oglišča (aparc »unknown«): medialna stena je njihov največji povezani kos. Manjši otoki (npr. na
        # orbitalni ploskvi čelnega režnja) so skorja brez oznake – dobijo oznako sosednjega režnja, sicer bi se v prerezu
        # risali kot medialna stena (mat sivorjave lise sredi skorje).
        brez = np.flatnonzero(dl == None)
        if len(brez):
            jeb = np.zeros(len(v), bool); jeb[brez] = True
            rb = np.concatenate([t[:, [0, 1]], t[:, [1, 2]], t[:, [2, 0]]])
            sos = {}
            for x, y in rb[jeb[rb[:, 0]] & jeb[rb[:, 1]]].tolist():
                sos.setdefault(x, []).append(y); sos.setdefault(y, []).append(x)
            kosi_b = []; videno = set()
            for x in brez.tolist():
                if x in videno:
                    continue
                kos_b = [x]; videno.add(x); i_ = 0
                while i_ < len(kos_b):
                    for y in sos.get(kos_b[i_], ()):
                        if y not in videno:
                            videno.add(y); kos_b.append(y)
                    i_ += 1
                kosi_b.append(kos_b)
            kosi_b.sort(key=len, reverse=True)
            otoki = np.array([x for kb in kosi_b[1:] for x in kb], dtype=np.int64)
            for _ in range(200):
                if not len(otoki):
                    break
                jo = np.zeros(len(v), bool); jo[otoki] = True
                m_ = jo[rb[:, 0]] & (dl[rb[:, 1]] != None) & ~jo[rb[:, 1]]
                if not m_.any():
                    break
                dl[rb[m_, 0]] = dl[rb[m_, 1]]
                otoki = otoki[dl[otoki] == None]
            print(f"[organi] skorja MRI {stran}: neoznačenih {len(brez)}, medialna stena {len(kosi_b[0])}, otokov {len(kosi_b) - 1}")
        # medialna stena 0,5 mm globlje od skorje: ob sredini sta obe stisnjeni na isto ravnino in sta se v prerezu
        # prekrivali (po prenosu oznak: otoki skorje ostanejo na površini)
        d = d + 0.0005 * (dl == None)
        v[:, 0] = sred + zn * d
        # globina brazde 0 (vrh vijuge) … 1 (dno brazde): sg za senco okolice, gl (širši razpon) za barvo v pregledovalniku
        sg = np.clip((sulc + 4.0) / 14.0, 0.0, 1.0)
        gl = np.clip((sulc + 9.0) / 22.0, 0.0, 1.0)
        # krajevna globina: sulc minus zglajen sulc (40 korakov povprečenja sosedov ≈ 1–2 cm), pozitivna v brazdi, negativna
        # na kroni vijuge; FreeSurfer sulc sam je preveč širok (cele ploskve čela imajo isto vrednost). Žilice tečejo po njeni
        # izočrti (rob brazde), barva brazd in kron jo uporablja namesto širokega sulc.
        e = np.concatenate([t[:, [0, 1]], t[:, [1, 2]], t[:, [2, 0]]])
        st = np.bincount(e[:, 0], minlength=len(v)).astype(np.float64)
        lp = sulc.copy()
        for _ in range(m.get("zglajeno", 40)):
            acc = np.bincount(e[:, 0], weights=lp[e[:, 1]], minlength=len(v))
            lp = 0.5 * lp + 0.5 * acc / np.maximum(st, 1)
        kl = np.clip(0.5 + (sulc - lp) / 10.0, 0.0, 1.0)
        # meje režnjev: oznake aparc so po ogliščih nazobčane (posnetek učnih barv: razcefrane stopničaste meje); vsak
        # reženj kot delež sosedov, glajeno »glajenjeMej« korakov, oglišče dobi največjega (medialna stena ostane)
        lob = list(APARC_DELI)
        I = np.stack([(dl == x).astype(np.float64) for x in lob], 1)
        for _ in range(m.get("glajenjeMej", 6)):
            acc = np.stack([np.bincount(e[:, 0], weights=I[e[:, 1], j], minlength=len(v)) for j in range(len(lob))], 1)
            I = 0.5 * I + 0.5 * acc / np.maximum(st, 1)[:, None]
        dl = np.where(dl != None, np.array(lob, dtype=object)[I.argmax(1)], dl)
        # trikotnik dobi reženj večine svojih oglišč (prej prvega oglišča: žagast rob v učnih barvah)
        tl = dl[t]
        tri_del = np.where(tl[:, 1] == tl[:, 2], tl[:, 1], tl[:, 0])
        for d in list(APARC_DELI) + ["sredina"]:
            if d == "sredina":  # medialna stena (rez FreeSurfer med polobloma): zapolni luknjo v prerezu, ni del
                if not m.get("sredina"):
                    continue
                izbor = t[np.any(dl[t] == None, axis=1)]
            else:
                izbor = t[(tri_del == d) & np.all(dl[t] != None, axis=1)]
            if not len(izbor):
                continue
            upor, inv = np.unique(izbor, return_inverse=True)
            me = bpy.data.meshes.new(f"{APARC_IME[d]} (MRI).{stran}")
            me.from_pydata(v[upor].tolist(), [], inv.reshape(-1, 3).tolist())
            bm = bmesh.new(); bm.from_mesh(me)
            for _ in range(m.get("gladi", 0)):
                bmesh.ops.smooth_laplacian_vert(bm, verts=bm.verts, lambda_factor=0.4, lambda_border=0.0,
                                                use_x=True, use_y=True, use_z=True, preserve_volume=True)
            bm.to_mesh(me); bm.free()
            at = me.color_attributes.new("SULC", "FLOAT_COLOR", "POINT")
            col = np.ones((len(upor), 4)); col[:, 0] = sg[upor]; col[:, 1] = gl[upor]; col[:, 2] = kl[upor]
            at.data.foreach_set("color", col.ravel())
            ime = f"{APARC_IME.get(d, 'Medial wall')} (MRI).{stran}"
            tkivo = m["sredina"] if d == "sredina" else m.get("zamenjaj", "skorja")
            vrstice.append([ime, me, tkivo, "" if d == "sredina" else d, f"{ime} / Cerebral cortex (MRI) / Brain.g"])
    return vrstice


def zrklo_hra(pot, h, osnovni, tmp):
    """Vrstice osnovni za organ iz HuBMAP HRA (GLB), poravnan na Z-Anatomy: središče in velikost iz beločnice, os iz
    središča proti roženici, zasuk okoli osi iz smeri izstopa vidnega živca (HRA: vidni disk)."""
    import numpy as np
    def tocke(rx):
        return np.array([tuple(v.co) for ime, me, *_ in osnovni if re.search(rx, ime) for v in me.vertices])
    zs, zc, zn = (tocke(rx) for rx in h["os"])
    zlo, zhi = zs.min(0), zs.max(0); zsr = (zlo + zhi) / 2; zr = (zhi - zlo).mean() / 2
    if h.get("poravnava") != "pca":
        d = np.linalg.norm(zn - zsr, axis=1); zn = zn[(d > 0.85 * zr) & (d < 1.35 * zr)]
    pred = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=pot)
    nov = [o for o in bpy.data.objects if o not in pred]
    mreze = {}
    for o in nov:
        if o.type == "MESH":
            me = o.data.copy(); me.transform(o.matrix_world); mreze[o.name] = me
    for o in nov:
        bpy.data.objects.remove(o)
    def hpts(k):
        return np.array([tuple(v.co) for n, me in mreze.items() if k in n for v in me.vertices])
    hs, hc, hn = (hpts(k) for k in h["os_hra"])
    hlo, hhi = hs.min(0), hs.max(0); hsr = (hlo + hhi) / 2; hr = (hhi - hlo).mean() / 2
    def okvir(sr, c, n):
        a = c.mean(0) - sr; a /= np.linalg.norm(a)
        b = n.mean(0) - sr; b -= a * b.dot(a); b /= np.linalg.norm(b)
        return np.stack([a, b, np.cross(a, b)], 1)
    if h.get("poravnava") == "pca":
        # Glavne osi oblaka oglišč (ledvica): obe telesi imata organ v podobni legi, zato predznak osi izberemo tako,
        # da je zasuk čim bližje identiteti; merilo iz geometrijske sredine razpona po oseh, središče = težišče.
        def osi(P):
            c = P.mean(0); w, U = np.linalg.eigh(np.cov((P - c).T)); o = np.argsort(w)[::-1]
            return c, w[o], U[:, o]
        zsr, zw, Uz = osi(zs); hsr, hw, Uh = osi(hs)
        for i in range(3):
            if Uz[:, i].dot(Uh[:, i]) < 0: Uh[:, i] *= -1
        R = Uz @ Uh.T
        if np.linalg.det(R) < 0:
            Uh[:, 2] *= -1; R = Uz @ Uh.T
        k = float(np.prod(zw / hw) ** (1 / 6)) * h.get("merilo", 1.0)
        zr, hr = float(np.sqrt(zw).mean()), float(np.sqrt(hw).mean())
        print(f"[organi] HRA PCA: zasuk {math.degrees(math.acos(max(-1, min(1, (np.trace(R) - 1) / 2)))):.1f}°")
    else:
        R = okvir(zsr, zc, zn) @ okvir(hsr, hc, hn).T
        k = zr / hr
    M = Matrix.Translation(Vector(zsr)) @ Matrix([list(R[i]) + [0] for i in range(3)] + [[0, 0, 0, 1]]) @ Matrix.Scale(k, 4) @ Matrix.Translation(Vector(-hsr))
    print(f"[organi] HRA {os.path.basename(pot)}: merilo {k:.3f}, polmer Z-Anatomy {zr * 1000:.1f} mm, HRA {hr * 1000:.1f} mm")
    vrstice = []
    for n, me in mreze.items():
        me.transform(M)
    if h.get("poravnaj_ob"):  # oglišča čepa ne segajo dlje proti središču kot notranja ploskev mrežnice v tej smeri
        cep = next(me for n, me in mreze.items() if re.search(h["poravnaj_ob"][0], n))
        ob = next(me for n, me in mreze.items() if re.search(h["poravnaj_ob"][1], n))
        G = Vector(zsr)
        oc = sum((v.co for v in cep.vertices), Vector()) / len(cep.vertices); smer = (oc - G).normalized()
        rr = sorted((v.co - G).length for v in ob.vertices if (v.co - G).normalized().dot(smer) > math.cos(0.3))
        rin = rr[max(0, len(rr) // 20)]  # 5. percentil: notranja ploskev mrežnice ob disku
        for v in cep.vertices:
            d = v.co - G
            if d.length < rin:
                v.co = G + d.normalized() * rin
        print(f"[organi] HRA: {h['poravnaj_ob'][0]} poravnan na notranji polmer {rin * 1000:.2f} mm")
    for rx, f in h.get("napihni", []):  # telesa v ležišču drugega (piramida med stebrički): malo manjša, da je njen pokrov reza (zadnja stena) pred steno ležišča
        for n, me in mreze.items():
            if re.search(rx, n):
                c = sum((v.co for v in me.vertices), Vector()) / len(me.vertices)
                for v in me.vertices:
                    v.co = c + (v.co - c) * f
    for n, me in sorted(mreze.items()):
        if re.search(h["izpusti"], n, re.I):
            continue
        # HRA (izvoz iz Maye) ima vsako oglišče razcepljeno po ploskvah in ostre ploskve: združimo, zgladimo, odstranimo
        # barve/UV iz izvoza (sicer kockasta senca okolice in 4× večji GLB); redke mreže enkrat razdelimo (gladka krogla).
        bm = bmesh.new(); bm.from_mesh(me)
        bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-7)
        if h.get("zapri") and re.search(h["zapri"], n):  # odprtina ob sosednjem telesu (piramida ob papili): zapremo, da je pokrov reza poln
            nove = bmesh.ops.holes_fill(bm, edges=bm.edges, sides=0)["faces"]
            bmesh.ops.triangulate(bm, faces=nove)
            bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
            if bm.calc_volume(signed=True) < 0:
                bmesh.ops.reverse_faces(bm, faces=bm.faces)
        bm.to_mesh(me); bm.free()
        for at in [a.name for a in me.attributes if a.name in ("sharp_face", "sharp_edge") or a.name.startswith("Color") or a.name.startswith("UV")]:
            me.attributes.remove(me.attributes[at])
        for uv in list(me.uv_layers):
            me.uv_layers.remove(uv)
        if tris(me) < h.get("razdeli_pod", 16000) and not re.search(h.get("brez_delitve", "^$"), n):
            t = bpy.data.objects.new("_h", me); tmp.objects.link(t)
            mod = t.modifiers.new("s", "SUBSURF"); mod.levels = mod.render_levels = 1
            me = bpy.data.meshes.new_from_object(t.evaluated_get(bpy.context.evaluated_depsgraph_get()))
            bpy.data.objects.remove(t)
        ime = re.sub(r"^VH_M_", "", n)
        vrstice.append([ime + " (HRA)", me, prvi(h["tkiva"], n, "tkivo"), prvi(h["deli"], n, None), f"{ime} (HRA) / HuBMAP HRA"])
    return vrstice


def _metakroglice(tocke, ime, tmp, locljivost=0.0006):
    """Mreža iz metakroglic [(točka, polmer[, negativna])]: gladka organska oblika (ledvični meh in čašice)."""
    # Blender ne dovoli ločljivosti metakroglic pod ~5 mm: gradimo v 10-kratnem merilu in pomanjšamo.
    M = 10.0
    mb = bpy.data.metaballs.new(ime); mb.resolution = mb.render_resolution = locljivost * M; mb.threshold = 0.6
    for co, r, *neg in tocke:  # (točka, polmer[, True = negativna krogla: vdolbina])
        el = mb.elements.new(); el.co = co * M; el.radius = abs(r) * M; el.stiffness = 2.0
        if neg and neg[0]:
            el.use_negative = True
    o = bpy.data.objects.new(ime, mb); tmp.objects.link(o)
    me = bpy.data.meshes.new_from_object(o.evaluated_get(bpy.context.evaluated_depsgraph_get()))
    bpy.data.objects.remove(o)
    me.transform(Matrix.Scale(1 / M, 4))
    print(f"[organi] metakroglice {ime}: ločljivost {mb.resolution:.4f} (×{M:g})")
    return me


def _crta(a, b, ra, rb, korak):
    n = max(2, int((b - a).length / korak) + 1)
    return [(a.lerp(b, i / (n - 1)), ra + (rb - ra) * i / (n - 1)) for i in range(n)]


def ledvicni_meh(osnovni, cfg, tmp):
    """Ledvični meh z velikima in malima čašicama (lastno delo): HRA nima meha, Z-Anatomy pa je izključen (IZLOCI).
    Male čašice objamejo vsako papilo, se združijo v zgornjo in spodnjo veliko čašico, ti v meh, meh se zoži v sečevod."""
    pap = [sum((v.co for v in me.vertices), Vector()) / len(me.vertices) for ime, me, *_ in osnovni if "papilla" in ime]
    hil = next(me for ime, me, *_ in osnovni if "hilum" in ime)
    hc = sum((v.co for v in hil.vertices), Vector()) / len(hil.vertices)
    ur = next(me for ime, me, *_ in osnovni if ime.startswith("Ureter"))
    pc = sum(pap, Vector()) / len(pap)
    C = pc.lerp(hc, 0.45)
    # Ravnina prereza (pregledovalnik: GLB z = −0,005 m) leži v globini (Blender y) povprečja papil + meh_ravnina; male in
    # velike čašice so na njej (kot naslikane piramide, rezPiramide: vrh piramide = papila, projicirana na ravnino), da rez
    # pokaže vsako čašico, ki objame svojo papilo.
    yr = sum(p.y for p in pap) / len(pap) + cfg.get("meh_ravnina", 0.0004)
    na_ravnino = lambda v: Vector((v.x, yr, v.z))
    # Sečevod: vrh (pieloureteralni stik) tik pod hilusom, medialno od meha. Z-Anatomy ga vodi v njen (izključeni) meh
    # pred ledvico (v prerezu odrezan): os vzamemo samo za smer navzdol, globino damo malo za ravnino reza (rez pokaže
    # lijak meha v svetlino sečevoda, spodaj cel sečevod), z rahlim lokom (sečevod ni raven).
    zr = C.z - cfg.get("secevod_vrh", 0.016)
    bm = bmesh.new(); bm.from_mesh(ur)
    bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:], plane_co=(0, 0, zr), plane_no=(0, 0, 1), clear_outer=True)
    bm.to_mesh(ur); bm.free()
    rt = cfg.get("secevod_polmer", 0.0016)
    kos = {}
    for v in ur.vertices:
        kos.setdefault(int(v.co.z / 0.0015), []).append(v.co)
    kl = sorted(kos)
    sred_k = {i: sum(kos[i], Vector()) / len(kos[i]) for i in kl}
    for _ in range(6):  # zglajena os
        sred_k = {i: sum((sred_k[j] for j in (i - 1, i, i + 1) if j in sred_k), Vector()) / sum(1 for j in (i - 1, i, i + 1) if j in sred_k) for i in kl}
    def os_pri(z):
        return sred_k[min(kl, key=lambda j: abs(j + 0.5 - z / 0.0015))]
    from drevesa import cev, zgladi
    zmin = min(v.co.z for v in ur.vertices) + 0.001
    x_vrh = C.x + (os_pri(zr).x - C.x) * cfg.get("secevod_medialno", 0.55)
    zamik = x_vrh - os_pri(zr).x
    lok = cfg.get("secevod_lok", 0.004) * (1 if os_pri(zmin).x > os_pri(zr).x else -1)
    P, R = [], []
    n_ = max(10, int((zr - zmin) / 0.003))
    for i in range(n_ + 1):
        z = zmin + (zr - zmin) * i / n_
        u = (zr - z) / (zr - zmin)  # 0 vrh, 1 spodaj
        g = min(1.0, u / 0.35); g = g * g * (3 - 2 * g)
        x = os_pri(z).x + zamik * (1 - g) + lok * math.sin(math.pi * u)
        y = yr + 0.0002 + cfg.get("secevod_globina", 0.0024) * g
        w = min(1.0, max(0.0, (zr - z) / 0.012)); w = w * w * (3 - 2 * w)
        # lijak: vrh 1,55-krat širši; krog m1: fiziološka zožitev na pieloureteralnem stiku (≈ 14–20 mm pod mehom), pod
        # njo rahlo vretenasta razširitev
        zoz = 1.0 - cfg.get("secevod_zozitev", 0.26) * math.exp(-(((zr - z) - 0.017) / 0.006) ** 2) + 0.10 * math.exp(-(((zr - z) - 0.040) / 0.014) ** 2)
        P.append(Vector((x, y, z))); R.append(rt * (1.75 - 0.75 * w) * zoz)
    P, R = zgladi(P, R, 6)
    P[-1] = P[-1] + (P[-1] - P[-2]).normalized() * 0.0005
    # krog m2: cev sečevoda se začne pri zadnji krogli meha (vrh2), ne 2 obroča više v svetlini meha (v rezu je bil v
    # izhodu meha viden konec cevi); meh spodaj odpremo v svetlino sečevoda (glej spodaj), da je svetlina v rezu zvezna
    P_cev, R_cev = (P[:-2], R[:-2]) if len(P) > 5 and cfg.get("secevod_stik", True) else (P, R)
    bm = bmesh.new(); cev(bm, P_cev, R_cev, 20, stena=cfg.get("secevod_stena", 0.0006))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(ur); bm.free(); ur.update()
    for q in ur.polygons:
        q.use_smooth = True
    print(f"[organi] sečevod: votla cev {len(P)} obročev, polmer {round(rt * 1000, 2)}–{round(R[-1] * 1000, 2)} mm, dolžina {round((zr - zmin) * 1000)} mm, lok {round(abs(lok) * 1000, 1)} mm")
    vrh = P[-1]
    vrh2 = P[-3] if len(P) > 3 else vrh - Vector((0, 0, 0.005))
    ru = 1.12 * R[-1]  # krog m1: krogle meha ob stiku širše od svetline sečevoda (sicer se meh pri manjšem merilu odtrga)
    zg = [p for p in pap if p.z >= C.z] or pap; sp = [p for p in pap if p.z < C.z] or pap
    M = {id(g): na_ravnino(C.lerp(sum(g, Vector()) / len(g), 0.5)) for g in (zg, sp)}
    k = cfg.get("meh_merilo", 1.0)
    t = []
    # krog m1: papile HRA ležijo v gručah (2,5–5 mm narazen), čaše bi se zlile v kepo. Papili bliže od 3,5 mm dobita
    # skupno čašo (sestavljena papila, na polih ledvice običajna), druge čaše se razmaknejo na ≥ casa_razmik (največ
    # casa_premik od svoje papile; naslikani vrhovi piramid v ledvica.json so v središčih čaš: izpis »čaše«).
    imena_p = [(re.search(r"_([a-z])( |$)", ime) or [None, "?"])[1] for ime, me, *_ in osnovni if "papilla" in ime]
    Q = [na_ravnino(p) for p in pap]; Q0 = [q.copy() for q in Q]; skup = list(range(len(Q)))
    for i in range(len(Q)):
        for j in range(i):
            if (Q0[i] - Q0[j]).length < 0.0035:
                skup[i] = skup[j]
    for s_ in set(skup):
        cl = [i for i in range(len(Q)) if skup[i] == s_]; sr_ = sum((Q0[i] for i in cl), Vector()) / len(cl)
        for i in cl:
            Q[i] = sr_.copy(); Q0[i] = sr_.copy()
    Dm, Pm = cfg.get("casa_razmik", 0.0084), cfg.get("casa_premik", 0.0052)
    for _ in range(80):
        for a_ in set(skup):
            for b_ in set(skup):
                if a_ < b_:
                    d_ = Q[a_] - Q[b_]
                    if d_.length < Dm:
                        pr = d_.normalized() * (Dm - d_.length) * 0.5
                        Q[a_] += pr; Q[b_] -= pr
        for a_ in set(skup):
            d_ = Q[a_] - Q0[a_]
            if d_.length > Pm:
                Q[a_] = Q0[a_] + d_.normalized() * Pm
    for i in range(len(Q)):
        Q[i] = Q[skup[i]]
    osi = cfg.get("casa_osi", {})
    def os_case(i, m):
        cl = [j for j in range(len(Q)) if skup[j] == skup[i]]
        o = sum((Vector((osi[imena_p[j]][0], 0, osi[imena_p[j]][1])) for j in cl if imena_p[j] in osi), Vector())
        return o.normalized() if o.length > 1e-6 else (Q[i] - m).normalized()
    print("[organi] čaše (Blender x, z; os x, z):", [(imena_p[i], round(Q[i].x, 5), round(Q[i].z, 5), round(os_case(i, Q[i] - Vector((1, 0, 0))).x, 3), round(os_case(i, Q[i] - Vector((1, 0, 0))).z, 3)) for i in range(len(Q))])
    # krog m1: jedro meha malo lateralneje in manjše (medialno ob hilusu ostane maščoba sinusa, v katero vstopata žili)
    lat = na_ravnino(pc) - na_ravnino(hc); lat.normalize()
    C2 = na_ravnino(C) + lat * cfg.get("meh_lateralno", 0.0035)
    # krog m1, drugi korak: izrecne čaše (cfg »case«: [(črka papile HRA, zamik v ravnini (x, z) v m, os (x, z))]): sedem
    # čaš in piramid enakomerno okoli sinusa (zgoraj 2, lateralno 3, spodaj 2), vsaka ≤ 6 mm od svoje papile; z gručami
    # papil HRA so se piramide v rezu zlile v liso brez ledvičnih stebrov. Seznam pap/Q/skup zamenjajo te čaše.
    if cfg.get("case"):
        po_crki = {c: na_ravnino(p_) for c, p_ in zip(imena_p, pap)}
        Q = [po_crki[c] + Vector((dx, 0, dz)) for c, (dx, dz), _o in cfg["case"]]
        osi_ = [Vector((o[0], 0, o[1])).normalized() for _c, _d, o in cfg["case"]]
        imena_p = [c for c, _d, _o in cfg["case"]]; skup = list(range(len(Q))); pap = Q
        os_case = lambda i, m: osi_[i]
        zg = [p_ for p_ in pap if p_.z >= C.z] or pap; sp = [p_ for p_ in pap if p_.z < C.z] or pap
        M = {id(g): na_ravnino(C.lerp(sum(g, Vector()) / len(g), 0.5)) for g in (zg, sp)}
        print("[organi] čaše (Blender x, z; os x, z):", [(imena_p[i], round(Q[i].x, 5), round(Q[i].z, 5), round(osi_[i].x, 4), round(osi_[i].z, 4)) for i in range(len(Q))])
    narejene = set()
    for g in (zg, sp):
        m = M[id(g)]
        for p in g:
            i_p = next(i for i, x in enumerate(pap) if x is p)
            if skup[i_p] in narejene:
                continue
            narejene.add(skup[i_p])
            # mala čašica: čaša v obliki črke U okoli vrha papile (vrh naslikane piramide je q, zaobljen 2,2 mm proti mehu):
            # venec majhnih krogel od forniksov ob straneh papile do dna čaše; v sredini ostane papila. Ozek vrat
            # (infundibulum) od dna čaše do velike čašice.
            q = Q[i_p]; u = os_case(i_p, m); v = u.cross(Vector((0, 1, 0))).normalized()
            r_ = cfg.get("casa_polmer", 0.0034)
            if cfg.get("casa_vdolbina", True):
                # krog m1: čaša = krogla za vrhom papile, v katero negativna krogla vtisne papilo (v rezu polmesec, ki
                # objame zaobljen vrh piramide; forniksa ob straneh), nato ozek vrat (infundibulum) do velike čašice
                # skleda (krogelna kapica) drobnih krogel okoli vrha papile: svetlina ≈ 1,2 mm, notranji rob na polmeru
                # naslikanega vrha piramide (2,2 mm), odprta proti piramidi; forniksa segata ≈ 100° od osi
                ra_, rk = cfg.get("casa_lok", 0.0042), cfg.get("casa_r", 0.0013)
                w_ = u.cross(v).normalized()
                for th in range(0, 116, 11):
                    n_az = max(1, round(2 * math.pi * ra_ * math.sin(math.radians(th)) / 0.0008))
                    for k_ in range(n_az):
                        az = 2 * math.pi * k_ / n_az
                        t.append((q + (-u * math.cos(math.radians(th)) + (v * math.cos(az) + w_ * math.sin(az)) * math.sin(math.radians(th))) * ra_, rk))
                t += _crta(q - u * (ra_ + 0.0012), m, cfg.get("vrat_r", 0.0024), 0.0036, 0.0011)
            else:
                for a_, b_ in ((0.0006, 4.0), (-0.0018, 3.8), (-0.0042, 2.4), (-0.0052, 0.0)):
                    t += [(q + u * a_ + v * b_ * 0.001, r_), (q + u * a_ - v * b_ * 0.001, r_)] if b_ else [(q + u * a_, r_)]
                t += _crta(q - u * 0.0052, m, 0.0034, 0.004, 0.0012)
        t += _crta(m, C2, 0.0028 * k, 0.0044 * k, 0.0012)
    sred = C2.lerp(vrh, 0.55)
    t += _crta(C2, sred, cfg.get("meh_jedro", 0.0058) * k, 0.0034 * k, 0.0012) + _crta(sred, vrh, 0.0034 * k, ru, 0.001) + _crta(vrh, vrh2, ru, ru, 0.001)
    me = _metakroglice(t, "meh", tmp)
    if len(P) > 5 and cfg.get("secevod_stik", True):
        # slepi konec meha v svetlini sečevoda odstranimo, rob luknje pa postavimo v sredino stene cevi: obris meha v
        # rezu se konča v steni sečevoda (brez pregrade čez svetlino)
        st_ = cfg.get("secevod_stena", 0.0006)
        os_ = (P[-4] - P[-3]).normalized(); r_not = max(R[-3] - st_, R[-3] * 0.6); r_sr = 0.5 * (r_not + R[-3])
        bm = bmesh.new(); bm.from_mesh(me)
        def valj(co):
            d_ = co - vrh2; s_ = d_.dot(os_); return s_, d_ - os_ * s_
        notri = [v for v in bm.verts if valj(v.co)[0] > 0 and valj(v.co)[1].length < r_not + 0.0001]
        proc = {f for v in notri for f in v.link_faces}
        bmesh.ops.delete(bm, geom=list(proc), context="FACES")
        rob = [v for v in bm.verts if v.is_boundary]
        for v in rob:  # v sredino stene cevi ob najbližjem obroču (lijak sečevoda se navzdol oži: brez ovratnika zunaj cevi)
            i_ = min(range(len(P) - 2), key=lambda i: (P[i] - v.co).length)
            r_ = (v.co - P[i_]) - os_ * (v.co - P[i_]).dot(os_)
            if r_.length > 1e-6:
                v.co = v.co - r_ + r_.normalized() * 0.5 * (max(R[i_] - st_, R[i_] * 0.6) + R[i_])
        print(f"[organi] stik meha in sečevoda: odstranjenih {len(proc)} ploskev meha, rob luknje {len(rob)} oglišč na polmeru {round(r_sr * 1000, 2)} mm")
        bm.to_mesh(me); bm.free(); me.update()
    print("[organi] ravnina meha (Blender y):", round(yr, 6))
    print("[organi] meh škatla (Blender):", [round(min(v.co[i] for v in me.vertices), 5) for i in range(3)], [round(max(v.co[i] for v in me.vertices), 5) for i in range(3)])
    print(f"[organi] ledvični meh: {len(pap)} malih čašic, {tris(me)} trikotnikov")
    return [["Evklid renal pelvis and calyces (lastno)", me, "meh", "meh", "Evklid renal pelvis and calyces (lastno) / Evklid"]]


def material(ime, slike=None):
    """Material tkiva. Brez slik: prazen (barvo določi pregledovalnik po imenu tkiva). S slikami (zapečene teksture):
    Principled z osnovno barvo in normalno mapo, da izvoznik glTF zapiše baseColorTexture in normalTexture."""
    m = bpy.data.materials.get("O:" + ime) or bpy.data.materials.new("O:" + ime)
    if not slike:
        m.use_nodes = False
        return m
    m.use_nodes = True
    nt = m.node_tree; nt.nodes.clear()
    izh = nt.nodes.new("ShaderNodeOutputMaterial"); bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
    nt.links.new(bsdf.outputs[0], izh.inputs[0])
    b = nt.nodes.new("ShaderNodeTexImage"); b.image = slike["baza"]; b.name = "baza"
    n = nt.nodes.new("ShaderNodeTexImage"); n.image = slike["normala"]; n.name = "normala"
    nm = nt.nodes.new("ShaderNodeNormalMap")
    nt.links.new(b.outputs["Color"], bsdf.inputs["Base Color"])
    nt.links.new(n.outputs["Color"], nm.inputs["Color"]); nt.links.new(nm.outputs[0], bsdf.inputs["Normal"])
    return m


def poenostavi_skupaj(vrste, ratio, tmp):
    """[(ime, mreža)] kosov ene površine → {ime: poenostavljena mreža}; meje med kosi ostanejo skupne (brez razpok)."""
    bm = bmesh.new()
    bm.faces.layers.int.new("kos")
    for k, (ime, me) in enumerate(vrste):
        n0 = len(bm.faces)
        bm.from_mesh(me)
        kos = bm.faces.layers.int["kos"]
        bm.faces.ensure_lookup_table()
        for f in bm.faces[n0:]:
            f[kos] = k
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-7)
    bmesh.ops.triangulate(bm, faces=bm.faces)
    cela = bpy.data.meshes.new("_skupaj"); bm.to_mesh(cela); bm.free()
    o = bpy.data.objects.new("_skupaj", cela); tmp.objects.link(o)
    mod = o.modifiers.new("dec", "DECIMATE"); mod.ratio = ratio; mod.use_collapse_triangulate = True
    m2 = bpy.data.meshes.new_from_object(o.evaluated_get(bpy.context.evaluated_depsgraph_get()))
    bpy.data.objects.remove(o)
    izhod = {}
    for k, (ime, me) in enumerate(vrste):
        b2 = bmesh.new(); b2.from_mesh(m2)
        kos = b2.faces.layers.int["kos"]
        bmesh.ops.delete(b2, geom=[f for f in b2.faces if f[kos] != k], context="FACES")
        b2.faces.layers.int.remove(b2.faces.layers.int["kos"])
        nm = bpy.data.meshes.new(ime + " sk"); b2.to_mesh(nm); b2.free()
        izhod[ime] = nm
    return izhod


def _izberi(objekti, aktiven):
    for o in bpy.context.view_layer.objects:
        o.select_set(False)
    for o in objekti:
        o.select_set(True)
    bpy.context.view_layer.objects.active = aktiven


def _zdruzi(objekti, ime):
    _izberi(objekti, objekti[0])
    bpy.ops.object.join()
    o = bpy.context.view_layer.objects.active; o.name = ime
    return o


def material_peke(tc, velikost):
    """Barva za peko (EMIT z visoke mreže): vrhovi svetli, gube temnejše in bolj rdeče (Pointiness = ukrivljenost),
    velike tople lise in tanke žilice (Voronoi, razdalja do roba). Barva je množilnik: pregledovalnik jo pomnoži z
    barvo tkiva iz JSON, zato ena slika velja za vsa tkiva organa."""
    m = bpy.data.materials.new("_peka"); m.use_nodes = True
    nt = m.node_tree; nt.nodes.clear(); L = nt.links.new
    izh = nt.nodes.new("ShaderNodeOutputMaterial"); em = nt.nodes.new("ShaderNodeEmission"); L(em.outputs[0], izh.inputs[0])
    geo = nt.nodes.new("ShaderNodeNewGeometry")
    ramp = nt.nodes.new("ShaderNodeValToRGB"); L(geo.outputs["Pointiness"], ramp.inputs[0])
    e = ramp.color_ramp.elements
    lo, hi = tc.get("ukrivljenost", (0.46, 0.54))
    e[0].position = lo; e[0].color = (*tc.get("guba", (0.42, 0.22, 0.21)), 1)
    e[1].position = hi; e[1].color = (1, 0.98, 0.96, 1)
    koord = nt.nodes.new("ShaderNodeTexCoord")
    sum_ = nt.nodes.new("ShaderNodeTexNoise"); sum_.inputs["Scale"].default_value = 1 / (tc.get("lise", 0.03) * velikost)
    sum_.inputs["Detail"].default_value = 4; L(koord.outputs["Object"], sum_.inputs["Vector"])
    lisa = nt.nodes.new("ShaderNodeMix"); lisa.data_type = "RGBA"; lisa.blend_type = "MULTIPLY"
    rr = nt.nodes.new("ShaderNodeMapRange"); rr.inputs[1].default_value = 0.45; rr.inputs[2].default_value = 0.7
    L(sum_.outputs["Fac"], rr.inputs[0]); L(rr.outputs[0], lisa.inputs[0])
    L(ramp.outputs[0], lisa.inputs[6]); lisa.inputs[7].default_value = (*tc.get("lisaBarva", (1.0, 0.86, 0.84)), 1)
    # žilice: robovi Voronoi celic, popačeni s šumom
    pop = nt.nodes.new("ShaderNodeTexNoise"); pop.inputs["Scale"].default_value = 1 / (0.02 * velikost); L(koord.outputs["Object"], pop.inputs["Vector"])
    mix_k = nt.nodes.new("ShaderNodeMix"); mix_k.data_type = "VECTOR"; mix_k.inputs[0].default_value = 0.25
    L(koord.outputs["Object"], mix_k.inputs[4]); L(pop.outputs["Color"], mix_k.inputs[5])
    vor = nt.nodes.new("ShaderNodeTexVoronoi"); vor.feature = "DISTANCE_TO_EDGE"
    vor.inputs["Scale"].default_value = 1 / (tc.get("zilice", 0.025) * velikost); L(mix_k.outputs[1], vor.inputs["Vector"])
    rz = nt.nodes.new("ShaderNodeMapRange"); rz.inputs[1].default_value = 0.0; rz.inputs[2].default_value = 0.035
    rz.inputs[3].default_value = tc.get("zilicaMoc", 0.45); rz.inputs[4].default_value = 0.0
    L(vor.outputs["Distance"], rz.inputs[0])
    zil = nt.nodes.new("ShaderNodeMix"); zil.data_type = "RGBA"; zil.blend_type = "MIX"
    L(rz.outputs[0], zil.inputs[0]); L(lisa.outputs[2], zil.inputs[6]); zil.inputs[7].default_value = (*tc.get("zilicaBarva", (0.55, 0.16, 0.16)), 1)
    L(zil.outputs[2], em.inputs[0])
    return m


def zapeci_teksture(objekti, visoki, velikost, tc, tmp, organ, px):
    """Peka tekstur z visoke na nizko mrežo (Cycles, CPU): skupni UV atlas vseh vozlišč (Smart UV Project),
    visoka mreža = izvirnik z razdelitvijo in drobnim reliefom (DISPLACE s šumom), nato NORMAL (tangentni prostor)
    in EMIT (barvni množilnik iz material_peke). Vrne {baza, normala} slik velikosti tc['px'][0]."""
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"; sc.cycles.device = "CPU"; sc.cycles.samples = tc.get("vzorci", 8)
    # 1) skupni UV atlas
    _izberi(objekti, objekti[0])
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.uv.smart_project(angle_limit=math.radians(tc.get("uvKot", 89)), island_margin=0.001, area_weight=0.0)
    bpy.ops.uv.pack_islands(margin=0.001, rotate=True)
    bpy.ops.object.mode_set(mode="OBJECT")
    print(f"[organi] {organ}: UV atlas za {len(objekti)} vozlišč")
    # 2) slike in materiali tkiv s slikami
    slike = {
        "baza": bpy.data.images.new(organ + "-baza", px, px, alpha=False),
        "normala": bpy.data.images.new(organ + "-normala", px, px, alpha=False),
    }
    slike["normala"].colorspace_settings.name = "Non-Color"
    for o in objekti:
        o.data.materials.clear(); o.data.materials.append(material(o["tkivo"], slike))
    # 3) nizka (kopija, združena) in visoka mreža
    kop = []
    for o in objekti:
        c = o.copy(); c.data = o.data.copy(); tmp.objects.link(c); kop.append(c)
    vis = []
    tex = bpy.data.textures.new("_relief", "CLOUDS"); tex.noise_scale = tc.get("reliefMera", 0.006) * velikost; tex.noise_depth = 2
    tex2 = bpy.data.textures.new("_relief2", "MARBLE"); tex2.noise_scale = tc.get("reliefMera2", 0.002) * velikost; tex2.turbulence = 6.0; tex2.marble_type = "SHARPER"
    mat_peke = material_peke(tc, velikost)
    for me in visoki:
        t = bpy.data.objects.new("_v", me.copy()); tmp.objects.link(t)
        if tc.get("razdeli", 1):
            m = t.modifiers.new("s", "SUBSURF"); m.levels = m.render_levels = tc.get("razdeli", 1)
        d = t.modifiers.new("d", "DISPLACE"); d.texture = tex; d.texture_coords = "GLOBAL"; d.strength = tc.get("relief", 0.0012) * velikost
        if tc.get("relief2"):  # drobnejša druga plast (snopi mišičnih vlaken, gubice ovojnice)
            d2 = t.modifiers.new("d2", "DISPLACE"); d2.texture = tex2; d2.texture_coords = "GLOBAL"; d2.strength = tc["relief2"] * velikost
        me2 = bpy.data.meshes.new_from_object(t.evaluated_get(bpy.context.evaluated_depsgraph_get()))
        t.modifiers.clear(); t.data = me2; vis.append(t)
        t.data.materials.clear(); t.data.materials.append(mat_peke)
    print(f"[organi] {organ}: visoka mreža {sum(tris(t.data) for t in vis)} trikotnikov")
    kletka = tc.get("kletka", 0.003) * velikost
    if tc.get("po_vozliscih"):
        # Vsako vozlišče peče samo s svoje visoke mreže (sicer se žile, ki ležijo na mišici, odtisnejo v njeno normalno
        # mapo in obratno); otoki atlasa so ločeni, zato slike ne brišemo med pekami (use_clear=False).
        pari = list(zip(vis, kop))
    else:
        pari = [(_zdruzi(vis, "_visoka"), _zdruzi(kop, "_nizka"))]
    for vrsta, ime in (("NORMAL", "normala"), ("EMIT", "baza")):
        for k_, (visoka, nizka) in enumerate(pari):
            _izberi([visoka, nizka], nizka)
            for mat in nizka.data.materials:
                mat.node_tree.nodes.active = mat.node_tree.nodes[ime]
            bpy.ops.object.bake(type=vrsta, normal_space="TANGENT", use_selected_to_active=True, cage_extrusion=kletka,
                                max_ray_distance=kletka * 2, margin=6, margin_type="EXTEND", use_clear=(k_ == 0))
        print(f"[organi] {organ}: pečeno {vrsta} ({len(pari)} peke)")
    for visoka, nizka in pari:
        bpy.data.objects.remove(visoka); bpy.data.objects.remove(nizka)
    for k, sl in slike.items():  # za pregled
        sl.filepath_raw = os.path.join(out, f"{organ}-{k}.png"); sl.file_format = "PNG"; sl.save()
    return slike


def izvozi(organ, cfg):
    vk = re.compile(cfg["vkljuci"]); iz = re.compile(cfg["izkljuci"]) if cfg.get("izkljuci") else None
    src = []
    for o in VSI:
        if o.type not in ("MESH", "CURVE") or NEVIDNO.search(o.name) or IZLOCI.search(o.name):
            continue
        v = veriga(o)
        if vk.search(v) and not (iz and iz.search(v)):
            src.append(o)
    print(f"[organi] {organ}: {len(src)} objektov", flush=True)
    # Pomnilnik: izračunamo samo zbirke z izbranimi objekti (cel Startup.blend v depsgraphu porabi > 10 GB).
    izbrani_ = set(src)
    def obrezi_zbirke(lc):
        ima = any(o in izbrani_ for o in lc.collection.objects)
        for c in lc.children:
            ima = obrezi_zbirke(c) or ima
        lc.exclude = not ima
        return ima
    # Krivulje iz knjižnice so samo za branje: lokalna kopija, da lahko povečamo ločljivost (gladke žile in živci).
    imena = {o: o.name for o in src}
    for i, o in enumerate(src):
        if o.type == "CURVE" and o.data.library:
            lo = o.copy(); lo.data = o.data.copy()
            imena[lo] = o.name; src[i] = lo
    if BLEND:
        # Povezani objekti niso v prizoru: izbrane damo v začasno zbirko, depsgraph izračuna samo njih (in odvisnosti).
        vir = bpy.data.collections.new("vir-" + organ)
        scene.collection.children.link(vir)
        for o in src:
            vir.objects.link(o)
    else:
        for lc in bpy.context.view_layer.layer_collection.children:
            obrezi_zbirke(lc)
    kr = cfg.get("krivulja", (3, 2))
    for o in src:
        if o.type == "CURVE" and not o.data.library:
            o.data.resolution_u = max(o.data.resolution_u, kr[0])
            o.data.bevel_resolution = max(o.data.bevel_resolution, kr[1])
    dg = bpy.context.evaluated_depsgraph_get()
    cfg["_krivulje"] = {imena.get(o, o.name): krivulje_objekta(o.evaluated_get(dg), o.evaluated_get(dg).matrix_world)
                        for o in src if o.type == "CURVE"}  # središčnice žil (srce_zile), pred obrezom na škatlo
    gladi = re.compile(cfg["gladi"]) if cfg.get("gladi") and os.environ.get("ORGANI_GLADI") != "0" else None
    tmp = bpy.data.collections.new("organ-" + organ)
    scene.collection.children.link(tmp)
    osnovni = []  # (ime, mesh, tkivo, del)
    for o in src:
        try:
            me = bpy.data.meshes.new_from_object(o.evaluated_get(dg), preserve_all_data_layers=False, depsgraph=dg)
        except RuntimeError:
            continue
        if not me or len(me.polygons) == 0:
            continue
        me.transform(o.matrix_world)
        v = veriga(o)
        if gladi and gladi.search(v) and tris(me) < 6000:
            t = bpy.data.objects.new("_g", me); tmp.objects.link(t)
            m = t.modifiers.new("s", "SUBSURF"); m.levels = m.render_levels = 1
            me2 = bpy.data.meshes.new_from_object(t.evaluated_get(bpy.context.evaluated_depsgraph_get()))
            bpy.data.objects.remove(t); me = me2
        ime = imena.get(o, o.name)
        v = ime + v[len(o.name):]
        osnovni.append([ime, me, prvi(cfg["tkiva"], v, "tkivo"), prvi(cfg["deli"], v, None), v])
    mri = cfg.get("skorja_mri")
    if mri and MRI:
        zam = [r for r in osnovni if r[2] == mri.get("zamenjaj", "skorja")]
        lo = [min(vv.co[i] for r in zam for vv in r[1].vertices) for i in range(3)]
        hi = [max(vv.co[i] for r in zam for vv in r[1].vertices) for i in range(3)]
        osnovni = [r for r in osnovni if r[2] != mri.get("zamenjaj", "skorja")] + skorja_iz_mri(MRI, mri, lo, hi)
        print(f"[organi] {organ}: skorja iz MRI ({mri['osebek']}), zamenjanih {len(zam)} objektov")
        # središče organa v x na sredini Z-Anatomy (rez je tam): škatla skorje MRI po strigu ni več simetrična
        cfg["_sredinaX"] = 0.5 * (lo[0] + hi[0])
        mm = cfg.get("mali_mri")
        hm = cfg.get("hra_mozgani")
        je_hra = bool(hm and HRA and os.path.isfile(os.path.join(HRA, hm["datoteka"])))
        # n4: mali možgani MRI ostanejo tudi ob HRA, kadar HRA ne da malih možganov (hra_mozgani.skupine brez »Cerebellum«)
        if mm and os.path.isfile(os.path.join(MRI, f"{mri['osebek']}-mali.npz")) and (not je_hra or hm.get("maliMri")):
            osnovni, F = mali_iz_mri(osnovni, mri, mm, lo, hi, tmp)
            cfg["_fastigij"] = [float(x) for x in F]
        if je_hra:
            osnovni, F = mozgani_hra(osnovni, cfg, tmp, os.path.join(HRA, hm["datoteka"]), lo, hi)
            if F is not None and "_fastigij" not in cfg:
                cfg["_fastigij"] = [float(x) for x in F]
    hra = cfg.get("hra")
    if hra and HRA:
        osnovni = [r for r in osnovni if not re.search(hra["zamenjaj"], r[0])] + zrklo_hra(os.path.join(HRA, hra["datoteka"]), hra, osnovni, tmp)
    # Z-Anatomy ima pogosto ločena oglišča po ploskvah; za UV otoke in razdelitev visoke mreže jih združimo.
    if cfg.get("tekstura") and not cfg["tekstura"].get("pbr"):
        for row in osnovni:
            bm = bmesh.new(); bm.from_mesh(row[1])
            bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-6)
            bm.to_mesh(row[1]); bm.free()
    # obrez žil na škatlo okoli jedra
    if cfg.get("skatla"):
        jr = re.compile(cfg["jedro"])
        lo = Vector((1e9,) * 3); hi = Vector((-1e9,) * 3)
        for ime, me, *_ in osnovni:
            if jr.search(ime):
                for vv in me.vertices:
                    lo = Vector(map(min, lo, vv.co)); hi = Vector(map(max, hi, vv.co))
        s = cfg["skatla"]
        lo2 = lo - Vector((s[0], s[2], s[4])); hi2 = hi + Vector((s[1], s[3], s[5]))
        for row in osnovni:
            if jr.search(row[0]):
                continue
            bm = bmesh.new(); bm.from_mesh(row[1]); obrezi(bm, lo2, hi2); bm.to_mesh(row[1]); bm.free()
        osnovni = [r for r in osnovni if len(r[1].polygons) > 0]
    for rx, okvir, f in cfg.get("znotraj", []):
        ok = next((me for ime, me, *_ in osnovni if re.search(okvir, ime)), None)
        if ok is None:
            continue
        lo = Vector((1e9,) * 3); hi = Vector((-1e9,) * 3)
        for vv in ok.vertices:
            lo = Vector(map(min, lo, vv.co)); hi = Vector(map(max, hi, vv.co))
        c = (lo + hi) / 2; r = sum(hi - lo) / 6 * f
        for ime, me, *_ in osnovni:
            if re.search(rx, ime):
                bm = bmesh.new(); bm.from_mesh(me)
                bmesh.ops.delete(bm, geom=[v for v in bm.verts if (v.co - c).length < r], context="VERTS")
                bm.to_mesh(me); bm.free()
    if os.environ.get("ORGANI_ODLOZI_PRED"):  # razvoj funkcij »dodaj«: stanje pred lastno geometrijo
        for row in osnovni: row.append(0)
        odlozi_stanje(os.environ["ORGANI_ODLOZI_PRED"], osnovni, cfg); return
    # lastne strukture (CC BY-SA, naše delo): ledvični meh s čašicami, veje jetrnih žil v jetrih
    cfg["_ct_mapa"] = CT  # mapa s podatki CT (pljučni režnji)
    cfg["_hra_mapa"] = HRA
    for ime_f in cfg.get("dodaj", []):
        osnovni += globals()[ime_f](osnovni, cfg, tmp)
    # zgladi_mrezo [(regex, ponovitev, faktor)]: glajenje oglišč izvorne mreže (grudasta nadledvična žleza Z-Anatomy)
    for rx, krat, fak in cfg.get("zgladi_mrezo", []):
        for ime, me, *_ in osnovni:
            if re.search(rx, ime):
                bm = bmesh.new(); bm.from_mesh(me)
                for _ in range(krat):
                    bmesh.ops.smooth_vert(bm, verts=bm.verts, factor=fak, use_axis_x=True, use_axis_y=True, use_axis_z=True)
                bm.to_mesh(me); bm.free(); me.update()
    if cfg.get("izpusti_po"):
        osnovni = [r for r in osnovni if not re.search(cfg["izpusti_po"], r[0])]
    for row in osnovni:
        # skorja iz MRI: FreeSurfer ima dosledno zunanje normale; odprti kosi režnjev bi jih recalc lahko obrnil
        odprtih, obrnjeno = (0, False) if "(MRI)" in row[0] else normale_navzven(row[1])
        if cfg.get("obrni") and re.search(cfg["obrni"], row[0]):  # ročno: hevristika se pri teh mrežah zmoti
            bm = bmesh.new(); bm.from_mesh(row[1]); bmesh.ops.reverse_faces(bm, faces=bm.faces); bm.to_mesh(row[1]); bm.free()
        row.append(odprtih)
        for p in row[1].polygons:
            p.use_smooth = True
    # razdeli: deli sten kot samostojni deli (srčni ušesi, pretin …) po usmeritvi normal (kosi podedujejo usmeritev)
    for ime_f in cfg.get("razdeli", []):
        for r in globals()[ime_f](osnovni, cfg, tmp):
            r.append(0)  # odprtih (podatek za poročilo)
            osnovni.append(r)
    if os.environ.get("ORGANI_ODLOZI"):  # razvoj: stanje po lastni geometriji; ORGANI_NADALJUJ=<isto> nadaljuje od tu
        odlozi_stanje(os.environ["ORGANI_ODLOZI"], osnovni, cfg)
    izvozi_naprej(organ, cfg, osnovni, tmp)


def odlozi_stanje(pot, osnovni, cfg):
    meta = {"vrstice": [[r[0], r[1].name, r[2], r[3], r[4], r[5]] for r in osnovni],
            "tocke4": [list(q) for q in cfg.get("_tocke4", [])],
            "krivulje": {k: [[[list(p) for p in P], list(R)] for P, R in v] for k, v in cfg.get("_krivulje", {}).items()}}
    bpy.data.libraries.write(pot, {r[1] for r in osnovni}, fake_user=True)
    with open(pot + ".json", "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False)
    print(f"[organi] stanje odloženo: {pot} ({len(osnovni)} vrstic)", flush=True)


def nalozi_stanje(pot, cfg):
    with open(pot + ".json", encoding="utf-8") as f:
        meta = json.load(f)
    with bpy.data.libraries.load(pot, link=False) as (vir_, cilj_):
        cilj_.meshes = list(vir_.meshes)
    po = {m.name: m for m in cilj_.meshes}
    cfg["_tocke4"] = [Vector(q) for q in meta["tocke4"]]
    cfg["_krivulje"] = {k: [([Vector(p) for p in P], R) for P, R in v] for k, v in meta.get("krivulje", {}).items()}
    return [[r[0], po[r[1]], r[2], r[3], r[4], r[5]] for r in meta["vrstice"]]


def izvozi_naprej(organ, cfg, osnovni, tmp):
    cfg["_ct_mapa"] = CT; cfg["_out"] = out
    # pravo srce HH229 (scripts/atlas/srce-hh229.py → <mapa ob Startup.blend>/hh229/hh229-v1.npz); ORGANI_HH229=1: stena iz pravega srca
    # (možnost recepta; privzeto stene povprečnega srca CT – ocena kroga m2: zaklopke, trabekule in baza žil so z njimi čistejše)
    if CT and os.environ.get("ORGANI_HH229") == "1":
        cfg["_hh229"] = os.path.join(os.path.dirname(CT), "hh229", "hh229-v1.npz")
    # pozno: koraki na celotnem stanju (srce_ct: stene iz CT, poravnava ostalih delov nanje, pokrov reza)
    for ime_f in cfg.get("pozno", []):
        osnovni = globals()[ime_f](osnovni, cfg, tmp)
    # napihni: (regex, faktor) okoli težišča mreže. Telesa s skupno mejo (režnji pljuč ob špranji, segmenti jeter) malo
    # pomanjšamo: pokrov reza je zadnja stena telesa in bi se sicer mešal s sprednjo steno soseda (svetle lise v prerezu).
    for rx, f, *dno in cfg.get("napihni", []):  # dno: središče na dnu (nadledvična žleza ostane na ledvici)
        for row in osnovni:
            if re.search(rx, row[0]):
                c = sum((v.co for v in row[1].vertices), Vector()) / max(len(row[1].vertices), 1)
                if dno:
                    c.z = min(v.co.z for v in row[1].vertices)
                for v in row[1].vertices:
                    v.co = c + (v.co - c) * f
    # premakni: (regex, (dx, dy, dz)) premik celega telesa v metrih (Blender). Nadledvična žleza Z-Anatomy leži za ravnino
    # reza ledvice (−17…−2 mm): naprej na zgornji pol, da jo rez preseka kot skorjo in sredico.
    for rx, d in cfg.get("premakni", []):
        for row in osnovni:
            if re.search(rx, row[0]):
                row[1].transform(Matrix.Translation(Vector(d)))
    # skrci: (regex, metri) premik oglišč navznoter po normali. Režnji pljuč po SUBSURF na vbočenih špranjah segajo v
    # soseda (prekrivanje ~mm); faktor okoli težišča tega ne odpravi.
    for rx, d in cfg.get("skrci", []):
        for row in osnovni:
            if re.search(rx, row[0]):
                nor = [v.normal.copy() for v in row[1].vertices]
                for v, nn in zip(row[1].vertices, nor):
                    v.co -= nn * d
    # ravnoOdrezi: (regex, metri) – zgornji konec dela (sapnik) ravno odrezan za toliko pod najvišjo točko: rob obročev
    # Z-Anatomy je bil po obrezu na škatlo nazobčan; debelina nato naredi čist obroč stene
    for rx, odmik in cfg.get("ravnoOdrezi", []):
        for row in osnovni:
            if re.search(rx, row[4]):
                me = row[1]; zv = max(v.co.z for v in me.vertices) - odmik
                bm = bmesh.new(); bm.from_mesh(me)
                bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:], plane_co=(0, 0, zv), plane_no=(0, 0, 1), clear_outer=True)
                bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context="VERTS")
                bm.to_mesh(me); bm.free(); me.update()
                print(f"[organi] {row[0]}: ravno odrezan {odmik * 1000:.1f} mm pod vrhom")
    # slepiKonci: odprt konec cevi (prerezana žila ob hilusu) dobi slepo svetlino globine »glob«: ploščica v svetlini. Gledano vzdolž osi se tako ne vidi skozi cev (obroč v zraku), ampak prerezana žila s temno svetlino.
    for rx, glob, *sk in cfg.get("slepiKonci", []):
        for row in osnovni:
            if re.search(rx, row[4]):
                n_ = slepi_konci(row[1], glob, sk[0] if sk else 0.0)
                if n_:
                    print(f"[organi] {row[0]}: slepih koncev {n_}")
    # debelina: stena cevi (bronhiji, žile iz krivulj) navznoter, da je v prerezu obroč s svetlino in ne poln valj
    for rx, d in cfg.get("debelina", []):
        for row in osnovni:
            if re.search(rx, row[4]):
                t = bpy.data.objects.new("_d", row[1]); tmp.objects.link(t)
                mod = t.modifiers.new("d", "SOLIDIFY"); mod.thickness = d; mod.offset = -1; mod.use_even_offset = True
                row[1] = bpy.data.meshes.new_from_object(t.evaluated_get(bpy.context.evaluated_depsgraph_get()))
                bpy.data.objects.remove(t)
                for p in row[1].polygons:
                    p.use_smooth = True
    # središče in velikost organa
    lo = Vector((1e9,) * 3); hi = Vector((-1e9,) * 3)
    # sredisce_brez: deli, ki ne štejejo v škatlo središča (ledvica: sečevod, da premik sečevoda ne premakne ravnine reza
    # in koordinat naslikanih piramid v ledvica.json)
    for ime_, me, *_ in osnovni:
        if cfg.get("sredisce_brez") and re.search(cfg["sredisce_brez"], ime_):
            continue
        for vv in me.vertices:
            lo = Vector(map(min, lo, vv.co)); hi = Vector(map(max, hi, vv.co))
    ctr = (lo + hi) / 2
    if cfg.get("_sredinaX") is not None:
        ctr.x = cfg["_sredinaX"]
    velikost = (hi - lo).length
    for _, me, *_ in osnovni:
        me.transform(Matrix.Translation(-ctr))
    for me in list(cfg.get("_telefon", {}).values()) + list(cfg.get("_racunalnik", {}).values()):  # lastne poenostavljene mreže: isti premik
        me.transform(Matrix.Translation(-ctr))
    # del brez zadetka: najbližji del iz »blizina« (po središčih)
    def sred(me):
        n = len(me.vertices); s = Vector((0, 0, 0))
        for vv in me.vertices: s += vv.co
        return s / max(n, 1)
    if cfg.get("blizina"):
        cent = {}
        for _, me, _, d, *_ in osnovni:
            if d in cfg["blizina"]:
                cent.setdefault(d, []).append(sred(me))
        cent = {d: sum(v, Vector()) / len(v) for d, v in cent.items()}
        for row in osnovni:
            if row[3] is None and cent:
                c = sred(row[1]); row[3] = min(cent, key=lambda d: (cent[d] - c).length)
    skupaj = sum(tris(me) for _, me, *_ in osnovni)
    print(f"[organi] {organ}: surovo {skupaj} trikotnikov, velikost {velikost:.3f} m")
    porocilo = {}
    tc = None if os.environ.get("ORGANI_TEKSTURE") == "0" else cfg.get("tekstura")  # ORGANI_TEKSTURE=0: hiter preizkus oblike
    if tc and tc.get("pbr"):
        ms = tc.get("maska", {})
        peka.maske(osnovni, velikost, ms.get("zile", "^$"), set(ms.get("tkiva", [])), votline_rx=ms.get("votline"),
                   **{k: ms[k] for k in ("zleb", "zlebZila", "sled") if k in ms})
    slike = None
    # isti popravek najprej na izvirnikih: so visoka mreža peke (shrani_delo), sicer bi peka na položeno kito
    # projicirala staro obliko (normale in senca obrnjene plošče)
    for ime_f in cfg.get("po_poenostavitvi", []):
        globals()[ime_f]([types.SimpleNamespace(name=r[0], data=r[1]) for r in osnovni], cfg)
    for i, (cilj, pripona) in enumerate(zip(cfg["cilj"], ("", "-telefon"))):
        ratio = min(1.0, cilj / max(skupaj, 1))
        oh = re.compile(cfg["ohrani"]) if cfg.get("ohrani") else None
        ned = re.compile(cfg["nedotakni"]) if cfg.get("nedotakni") else None  # že poenostavljeno (stene CT): ratio 1
        # _telefon / _racunalnik: lastne poenostavljene mreže vrstic »nedotakni« (vrstica sama ostane gosta: visoka mreža peke)
        tel = cfg.get("_telefon", {}) if i == 1 else cfg.get("_racunalnik", {})
        nedot = lambda r: ned is not None and ned.search(r[4])
        ex_n = sum(tris(tel.get(r[0], r[1])) for r in osnovni if nedot(r))
        cilj_ = max(cilj - ex_n, cilj * 0.2); skupaj_ = max(skupaj - sum(tris(r[1]) for r in osnovni if nedot(r)), 1)
        ratio = min(1.0, cilj_ / skupaj_)
        r_cev = 1.0
        if oh:  # lastne cevi: blažja poenostavitev (oglata cev), ostalo dobi preostanek cilja
            ex = sum(tris(r[1]) for r in osnovni if oh.search(r[4]) and not nedot(r))
            r_cev = min(1.0, cfg.get("ohraniFaktor", (1.8, 1.8))[i] * ratio)  # ohraniFaktor: (računalnik, telefon), privzeto 1,8
            ratio = min(1.0, max(0.05, (cilj_ - ex * r_cev) / max(skupaj_ - ex, 1)))
        # telefon=False: telefon brez tekstur (pri možganih je 1024-px peka na ~50k trikotnikih videti zmečkano)
        tk = tc if tc and (i == 0 or tc.get("telefon", True)) else None
        slike = None
        objekti = []
        # cfg »poenostaviSkupaj« (regex z eno skupino = ključ skupine): mreže iste skupine so kosi ene površine (režnji skorje
        # iz MRI ene poloble). Poenostavljene vsaka zase dobijo ob mejah razpoke (meja vsakega kosa se premakne po svoje),
        # zato se zvarijo, poenostavijo skupaj in spet razdelijo: meje sosedov ostanejo oglišče na oglišče.
        skupno = {}
        if cfg.get("poenostaviSkupaj") and ratio < 1:
            sk_re = re.compile(cfg["poenostaviSkupaj"]); skupine = {}
            for r in osnovni:
                mm = sk_re.search(r[0])
                if mm and not nedot(r):
                    skupine.setdefault(mm.group(1), []).append(r)
            for kljuc, vrste in skupine.items():
                skupno.update(poenostavi_skupaj([(r[0], r[1]) for r in vrste], ratio, tmp))
                print(f"[organi] {organ}{pripona}: skupina »{kljuc}« poenostavljena skupaj ({len(vrste)} kosov, razmerje {ratio:.3f})")
        for ime, me, tkivo, d, v, odprtih in osnovni:
            m = skupno[ime] if ime in skupno else tel[ime].copy() if ime in tel else me.copy()
            rat = 1.0 if ime in skupno or (ned is not None and ned.search(v)) else r_cev if oh and oh.search(v) else ratio
            no = bpy.data.objects.new(ime, m)
            if no.name != ime:  # lokalni izvirnik z istim imenom (odprt Startup.blend): izvirnik preimenujemo
                bpy.data.objects[ime, None].name = ime + "·src"; no.name = ime
            tmp.objects.link(no)
            n = tris(m)
            if tk and not (rat < 1 and n > 300):  # tangente MikkTSpace (normalna mapa) zahtevajo trikotnike
                bm = bmesh.new(); bm.from_mesh(m); bmesh.ops.triangulate(bm, faces=bm.faces); bm.to_mesh(m); bm.free()
            if rat < 1 and n > 300:
                bm = bmesh.new(); bm.from_mesh(m); bmesh.ops.triangulate(bm, faces=bm.faces); bm.to_mesh(m); bm.free()
                mod = no.modifiers.new("dec", "DECIMATE"); mod.ratio = max(rat, 150 / n); mod.use_collapse_triangulate = True
                m2 = bpy.data.meshes.new_from_object(no.evaluated_get(bpy.context.evaluated_depsgraph_get()))
                no.modifiers.clear(); no.data = m2
            # telefonSkrci: (regex imena, metri): po poenostavitvi za telefon se zunanja oglišča (normala stran od težišča)
            # umaknejo navznoter. Skorja ledvice tik pod ovojnico po poenostavitvi sicer ponekod pogleda skozi (črne pike).
            for rx, dd in (cfg.get("telefonSkrci", []) if i == 1 else []):
                if re.search(rx, ime):
                    tz = sum((v.co for v in no.data.vertices), Vector()) / max(len(no.data.vertices), 1)
                    for v, nn in [(v, v.normal.copy()) for v in no.data.vertices]:
                        if (v.co - tz).dot(nn) > 0: v.co -= nn * dd
            for p in no.data.polygons:
                p.use_smooth = True
            uveljavi_normale(no.data)  # režnji jeter: normale cele površine (atribut »norm_lastna«), brez šiva na meji
            no.data.materials.clear(); no.data.materials.append(material(tkivo, slike))
            no["tkivo"] = tkivo; no["del"] = d or ""
            objekti.append(no)
        for ime_f in cfg.get("po_poenostavitvi", []):  # popravki na končni (poenostavljeni) mreži, pred UV in peko
            globals()[ime_f](objekti, cfg)
        if tk and tk.get("pbr"):  # skupna pot (peka.py): vsaka mreža svoj UV atlas; peka po delih v ločenih procesih
            for o in objekti: o["ime"] = o.name
            peka.uv_atlas(objekti, tc, tc.get("px", (2048, 1024))[i])
        elif tk:  # vsaka mreža (računalnik, telefon) dobi svoj UV atlas in svojo peko
            slike = zapeci_teksture(objekti, [r[1] for r in osnovni], velikost, tc, tmp, organ + pripona, tc.get("px", (2048, 1024))[i])
        odp = zapeci_odprtost(objekti, velikost) if cfg.get("odprtost") else None
        zapeci_ao(objekti, velikost, po_straneh=cfg.get("ao_po_straneh", False), odprtost=odp)
        if tk and tk.get("pbr"):  # GLB izvozi peka.py zakljuci (scripts/atlas/peci.py vodi korake in pazi na pomnilnik)
            peka.shrani_delo(os.path.join(out, f"{organ}{pripona}.delo.blend"), objekti, osnovni, velikost, tc, tc.get("px", (2048, 1024))[i])
        for c in scene.collection.children:
            lc = bpy.context.view_layer.layer_collection.children.get(c.name)
            if lc: lc.exclude = (c != tmp)
        if not (tk and tk.get("pbr")): bpy.ops.export_scene.gltf(
            filepath=os.path.join(out, organ + pripona + ".glb"), export_format="GLB",
            use_active_collection=False, use_visible=True, export_apply=True,
            export_materials="EXPORT", export_normals=True, export_vertex_color="ACTIVE", export_texcoords=bool(tk), export_tangents=bool(tk),
            export_image_format="WEBP" if tk and not tk.get("pbr") else "AUTO", export_image_quality=tk.get("kakovost", 82) if tk else 75,
            export_yup=True, export_extras=True, export_animations=False, export_skins=False,
            export_morph=False, export_lights=False, export_cameras=False)
        for c in scene.collection.children:
            lc = bpy.context.view_layer.layer_collection.children.get(c.name)
            if lc: lc.exclude = False
        rez = sum(tris(o.data) for o in objekti)
        print(f"[organi] {organ}{pripona}: {len(objekti)} vozlišč, {rez} trikotnikov")
        if i == 0:
            porocilo = {
                "organ": organ, "velikost": round(velikost, 4), "trikotniki": rez,
                "vozlisca": [{
                    "ime": o.name, "tkivo": o["tkivo"], "del": o["del"], "trikotniki": tris(o.data),
                    # Blender Z-gor -> glTF Y-gor: (x, z, -y)
                    "c": (lambda s: [round(s.x, 4), round(s.z, 4), round(-s.y, 4)])(sred(o.data)),
                    "odprtih": next(r[5] for r in osnovni if r[0] == o.name),
                } for o in objekti],
            }
        else:
            porocilo["trikotnikiTelefon"] = rez
        for o in objekti:
            src_ = bpy.data.objects.get((o.name + "·src", None))
            bpy.data.objects.remove(o)
            if src_: src_.name = src_.name[:-4]
    if cfg.get("_tocke4"):  # ravnina prereza v koordinatah glTF (središče organa 0): ohrani zadnji del (n·p + d ≥ 0)
        g = [Vector((q.x, q.z, -q.y)) - Vector((ctr.x, ctr.z, -ctr.y)) for q in cfg["_tocke4"]]
        n = (g[1] - g[0]).cross(g[2] - g[0]).normalized()
        if n.z > 0:
            n = -n
        porocilo["ravnina4"] = {"n": [round(x, 4) for x in n], "d": round(-n.dot(sum(g, Vector()) / 3), 4)}
    if cfg.get("skorja_mri", {}).get("_afina") is not None:  # RAS (mm) → glTF (m, središče organa 0): risba reza iz MRI
        Ab = cfg["skorja_mri"]["_afina"]
        porocilo["mriAfina"] = [[round(float(x), 8) for x in (Ab[0] - [0, 0, 0, ctr.x])], [round(float(x), 8) for x in (Ab[2] - [0, 0, 0, ctr.z])],
                                [round(float(x), 8) for x in (-Ab[1] + [0, 0, 0, ctr.y])]]
    if cfg.get("_fastigij"):  # mali možgani iz MRI: središče lističev (tkiva.mali.listiSredisce) v glTF, središče organa 0
        q = cfg["_fastigij"]
        porocilo["fastigij"] = [round(q[0] - ctr.x, 5), round(q[2] - ctr.z, 5), round(-q[1] + ctr.y, 5)]
    if cfg.get("_karina"):  # pljuča: karina sapnika (glTF, središče organa 0) – čelna ravnina prereza gre skoznjo
        q = cfg["_karina"]
        porocilo["karina"] = [round(q[0] - ctr.x, 5), round(q[2] - ctr.z, 5), round(-q[1] + ctr.y, 5)]
        if cfg.get("_karinaN"):  # normala ravnine dihalnega drevesa (glTF; kaže nazaj: sprednji del se odreže)
            nb = cfg["_karinaN"]; porocilo["karinaN"] = [round(nb[0], 4), round(nb[2], 4), round(-nb[1], 4)]
    if cfg.get("_rezZanke"):  # preseki struktur HRA s sredinsko ravnino v koordinatah ravnine reza (x = y Blender, y = z Blender; središče organa 0)
        porocilo["rezZanke"] = {k: [[[round(p[0] - ctr.y, 6), round(p[1] - ctr.z, 6)] for p in z] for z in zz] for k, zz in cfg["_rezZanke"].items()}
    if cfg.get("_volumen"):  # prostorska tekstura reza (srce_ct.volumen): lo v koordinatah glTF s središčem organa 0
        vm = dict(cfg["_volumen"]); c_ = (ctr.x, ctr.z, -ctr.y)
        vm["lo"] = [round(vm["lo"][k] - c_[k], 5) for k in range(3)]
        porocilo["volumen"] = vm
    if cfg.get("_ct"):  # oslonilne točke CT (glTF, središče organa 0): preverjanje debelin in reza
        porocilo["ctTocke"] = {k: [round(float(v[0]) - ctr.x, 5), round(float(v[2]) - ctr.z, 5), round(-float(v[1]) + ctr.y, 5)] for k, v in cfg["_ct"]["L"].items()}
    with open(os.path.join(out, organ + ".vozlisca.json"), "w", encoding="utf-8") as f:
        json.dump(porocilo, f, ensure_ascii=False, indent=1)


for organ in izbrani:
    if os.environ.get("ORGANI_NADALJUJ"):
        tmp_ = bpy.data.collections.new("organ-" + organ); scene.collection.children.link(tmp_)
        izvozi_naprej(organ, ORGANI[organ], nalozi_stanje(os.environ["ORGANI_NADALJUJ"], ORGANI[organ]), tmp_)
    else:
        izvozi(organ, ORGANI[organ])

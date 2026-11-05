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
# Zapečene teksture (cfg »tekstura«, zaenkrat možgani; tako naj gredo vsi novi organi):
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
import bpy, bmesh, json, os, re, sys, math, random
from mathutils import Vector, Matrix
from mathutils.bvhtree import BVHTree
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import peka  # skupna peka PBR tekstur (Cycles): baza, normala, ORM; recepti tkiv v cfg »tekstura«
from srce_geometrija import srce_dodatki  # lastna geometrija srca (lističa, papilarna mišica, tetive, trabekule)

args = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
out = args[0] if args else "/tmp/organi-raw"
BLEND = args[args.index("--blend") + 1] if "--blend" in args else None
MRI = args[args.index("--mri") + 1] if "--mri" in args else None
HRA = args[args.index("--hra") + 1] if "--hra" in args else None  # mapa z GLB HuBMAP HRA (CC BY 4.0), npr. 3d-vh-m-eye-l.glb
_ZASTAVE = ("--blend", "--mri", "--hra")
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
        cilj=(280_000, 85_000),
        # Skorja iz MRI (OpenNeuro ds000001 fMRIPrep/FreeSurfer, CC0): Z-Anatomy vijuge (tkivo »skorja«) zamenjamo s
        # pialno površino ene anonimne prostovoljke/prostovoljca (lh/rh.pial), režnji iz parcelacije aparc, globina brazd
        # (sulc) potemni senco okolice. Mapa z datotekami: --mri <mapa> (sub-01-lh.pial, …-lh.sulc, …-lh.aparc.annot).
        skorja_mri=dict(osebek="sub-01", zamenjaj="skorja", gladi=1, sulc=0.45, sredina="sredina"),
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
        cilj=(170_000, 60_000),  # PBR: drobni relief nosi normalna mapa; meja 6 / 2 MB z WebP
        # Prekata: odprti debeli lupini, predznak prostornine izbere notranjo stran (zunanja stena izgine, vidna notranjost);
        # preverjeno s posnetkom 2026-11-04 (stari izvoz iz 08:50 je imel prav to obrnjeno smer).
        obrni=r"^(Left|Right) ventricle$",
        odprtost=True,  # G = odprtost: maščoba v žlebovih samo na zunanji ploskvi (mascaZunaj), ne v prekatih v prerezu
        # Lastna geometrija (srce_geometrija.py): sprednja lističa mitralne in trikuspidalne zaklopke s tetivami,
        # sprednja-stranska papilarna mišica levega prekata, septomarginalna trabekula, mesnate trabekule obeh prekatov.
        dodaj=["srce_dodatki"],
        # Pečene PBR teksture (peka.py, Cycles): recept po tkivu. Maščoba sledi venčnim žilam v žlebovih (maska iz
        # razdalje do žil na zunanji ploskvi), miokard ima snope vlaken in drobne gube, notranjost votlin (endokard) je
        # bolj gladka in svetlejša, zaklopke so smetanaste. Peka 2048 px računalnik, 1024 px telefon (svoj atlas).
        tekstura=dict(
            pbr=True, px=(2048, 1024), vzorciNormala=16, vzorciBarva=16, vzorciAO=192, aoRazdalja=0.03, kletka=0.004, uvKot=66,
            # maščoba samo ob venčnih žilah (ne ob aorti, pljučnem deblu in pljučnih venah), širina po debelini žile
            maska=dict(zile=r"coronary|interventricular|Circumflex|cardiac vein|vein of left ventricle|Coronary sinus|branch of right coronary", tkiva=["miokard"]),
            recepti={
                "miokard": dict(barva=(0.30, 0.045, 0.035), barva2=(0.20, 0.03, 0.028), lise=0.45, hrap=0.30, gube=0.00016, gubeMera=0.004,
                                vlakna=0.00022, vlaknaMera=0.0016, masca=0.95, mascaBarva=(0.76, 0.52, 0.20), mascaPremik=0.0015,
                                mascaMera=0.006, zilice=0.55, ziliceBarva=(0.22, 0.025, 0.04), notranja=(0.46, 0.14, 0.12), notranjaHrap=0.2),
                "zaklopka": dict(barva=(0.83, 0.76, 0.64), barva2=(0.74, 0.60, 0.50), lise=0.4, hrap=0.33, gube=0.00006, gubeMera=0.002, razdeli=1),
                "arterija": dict(barva=(0.62, 0.07, 0.06), barva2=(0.48, 0.05, 0.05), lise=0.3, hrap=0.27, gube=0.00005, gubeMera=0.002, razdeli=1),
                "vena": dict(barva=(0.10, 0.18, 0.48), barva2=(0.08, 0.12, 0.36), lise=0.3, hrap=0.27, gube=0.00005, gubeMera=0.002, razdeli=1),
                "pljucna": dict(barva=(0.16, 0.26, 0.58), barva2=(0.12, 0.20, 0.48), lise=0.3, hrap=0.27, gube=0.00006, gubeMera=0.003, razdeli=1),
                "pljucna-vena": dict(barva=(0.58, 0.09, 0.09), barva2=(0.45, 0.06, 0.07), lise=0.3, hrap=0.27, gube=0.00006, gubeMera=0.003, razdeli=1),
            },
        ),
        jedro=r"^(Right atrium|Right ventricle|Left atrium|Left ventricle)$",
        skatla=[0.004, 0.004, 0.02, 0.006, 0.006, 0.030],
        krivulja=(4, 3),
        tkiva=[
            (r"leaflet|valve", "zaklopka"),
            (r"papillary", "miokard"),
            (r"aorta|Aortic|Brachiocephalic|carotid|subclavian|coronary artery|interventricular artery|Circumflex|branch of right coronary|Arteries of heart", "arterija"),
            (r"Pulmonary trunk|pulmonary artery|Bifurcation of pulmonary", "pljucna"),
            (r"pulmonary vein", "pljucna-vena"),
            (r"vein|vena cava|sinus|Cardiac veins", "vena"),
            (r"", "miokard"),
        ],
        deli=[
            (r"papillary muscle", "papilarne-misice"),
            (r"Trabecula|trabecula", "trabekule"),
            (r"atrioventricular valve|Right atrioventricular", "av-zaklopki"),
            (r"Aortic valve|Root of aorta|coronary leaflet|Non-coronary", "aortna-zaklopka"),
            (r"Pulmonary valve|pulmonary valve", "pljucna-zaklopka"),
            (r"^Right atrium|Right auricle", "desni-preddvor"),
            (r"Right ventricle", "desni-prekat"),
            (r"^Left atrium|Left auricle", "levi-preddvor"),
            (r"Left ventricle", "levi-prekat"),
            (r"aorta|Aortic arch|Brachiocephalic|carotid|subclavian", "aorta"),
            (r"Pulmonary trunk|pulmonary artery|Bifurcation of pulmonary", "pljucno-deblo"),
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
        cilj=(220_000, 70_000),
        gladi=r".",
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
    "pljuca": dict(
        # Z-Anatomy: pet režnjev, sapnik, bronhiji do segmentnih in pljučne žile do segmentov. HRA (lung-male) ima lepše
        # bronhije s hrustančnimi obroči, a nima sapnika in žil, režnji so grobi segmenti (300–1400 trikotnikov), in
        # poravnava drevesa iz drugega telesa v režnje Z-Anatomy bi se ob hilusu videla (2026-11-04).
        vkljuci=r"/ Lungs\.g( |$)|^Trachea( /|$)|/ Bronchi\.g( |$)|^(Left|Right) pulmonary artery( /|$)|/ (Left|Right) pulmonary artery( |$)|"
                r"/ Pulmonary veins\.g( |$)",
        izkljuci=r"\?\?\?",
        cilj=(240_000, 80_000),
        jedro=r"lobe of (left|right) lung",
        skrci=[(r"lobe of", 0.0018)],
        skatla=[0.0, 0.0, 0.0, 0.0, 0.0, 0.045],
        krivulja=(6, 5),
        debelina=[(r"Bronchi\.g|Pulmonary|pulmonary artery", 0.0011)],
        # Veje v pljučih (segmentni bronhiji in žile) imajo svoja tkiva: v celoti so skrite (konci bi štrleli skozi
        # površino režnjev), v prerezu vidne.
        tkiva=[
            (r"lobe of", "pljuca"), (r"^[^/]*segment[^/]*/.*Bronchi\.g", "dihalna-v"), (r"^Trachea|Bronchi\.g", "dihalna"),
            (r"^[^/]*(segment|of (left|right) lung)[^/]*/.*(artery|arteries)", "pljucna-arterija-v"),
            (r"^[^/]*(segment|of (left|right) lung)[^/]*/.*vein", "pljucna-vena-v"),
            (r"artery|arteries", "pljucna-arterija"), (r"vein", "pljucna-vena"), (r"", "dihalna"),
        ],
        deli=[
            (r"^Superior lobe of right", "desni-zgornji"), (r"^Middle lobe", "desni-srednji"), (r"^Inferior lobe of right", "desni-spodnji"),
            (r"^Superior lobe of left", "levi-zgornji"), (r"^Inferior lobe of left", "levi-spodnji"),
            (r"^Trachea", "sapnik"), (r"Bronchi\.g", "bronhiji"),
            (r"artery|arteries", "pljucne-arterije"), (r"vein", "pljucne-vene"),
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
        dodaj=["ledvicni_meh"],
        meh_merilo=1.8,  # meh s čašicami iz metakroglic; ploskev ledvičnega sinusa (HRA hilum) potem izpustimo
        izpusti_po=r"hilum_of_kidney",
        # Z-Anatomy nadledvična žleza je ob HRA ledvici (merilo 0,77) predebela (4,9 × 4,5 × 2,1 cm): 0,72× z dnom na ledvici.
        napihni=[(r"^Suprarenal", 0.72, "dno")],
        vkljuci=r"^(Kidney\.l|Ureter\.l|Suprarenal gland\.l|Left renal artery|Left renal vein|(Anterior|Posterior) branch of renal artery\.l)( /|$)",
        cilj=(200_000, 75_000),
        jedro=r"kidney_capsule",
        skatla=[0.03, 0.005, 0.01, 0.01, 0.035, 0.03],
        krivulja=(6, 5),
        debelina=[(r"^Ureter|renal (artery|vein)|branch of renal", 0.0009)],
        tkiva=[(r"^Ureter", "secevod"), (r"artery", "arterija"), (r"vein", "vena"), (r"Suprarenal", "nadledvicna"), (r"", "skorja")],
        deli=[(r"^Ureter", "secevod"), (r"artery", "ledvicna-arterija"), (r"vein", "ledvicna-vena"), (r"Suprarenal", "nadledvicna")],
    ),
    "jetra": dict(
        # Z-Anatomy: jetra po segmentih (I–VIII), žolčnik, žolčevod, portalna vena, jetrna arterija in jetrne vene. HRA
        # (liver-male) ima gostejšo ovojnico, a nima žolčnika, portalne vene in jetrnih ven (samo vtisnine in vezi).
        vkljuci=r"/ Liver( /|$)|^(Gallbladder|Bile duct|Hepatic portal vein|Hepatic veins|Proper hepatic artery|Common hepatic artery)( /|$)|/ Extrahepatic bile ducts\.g( |$)",
        izkljuci=r"^Liver( /|$)|Tributaries|Gastroduodenal",
        cilj=(220_000, 75_000),
        jedro=r"segment of liver|^Gallbladder",
        skatla=[0.005, 0.005, 0.005, 0.005, 0.03, 0.005],
        krivulja=(6, 5),
        gladi=r"segment of liver|Gallbladder",
        napihni=[(r"segment of liver", 0.994)],
        dodaj=["jetrne_zile"],
        debelina=[(r"^(Bile duct|Hepatic portal vein|Hepatic veins|Proper hepatic artery|Common hepatic artery)", 0.0009), (r"\(lastno\)", 0.0007)],
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
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    odprtih = sum(1 for e in bm.edges if not e.is_manifold)
    vol = bm.calc_volume(signed=True)
    obrnjeno = False
    # Kot obrni_ce_navznoter v izvozi-z-anatomy.py: tudi skoraj zaprte mreže (odprtine žil, zaklopk) obrnemo po
    # predznaku prostornine, preden zapečemo senco; tanke odprte plošče pusti recalc_face_normals.
    if vol < 0 and odprtih <= 0.05 * max(len(bm.edges), 1):
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


def skorja_iz_mri(mapa, m, lo, hi):
    """Vrstice osnovni za pialno skorjo obeh polobel, poravnano na škatlo [lo, hi] (Blender, metri)."""
    import numpy as np
    del_za = {ime: d for d, s in APARC_DELI.items() for ime in s.split()}
    hem = {}
    for h, stran in (("lh", "l"), ("rh", "r")):
        v, t = fs_povrsina(os.path.join(mapa, f"{m['osebek']}-{h}.pial"))
        sulc = fs_krivulja(os.path.join(mapa, f"{m['osebek']}-{h}.sulc"))
        lab = fs_oznake(os.path.join(mapa, f"{m['osebek']}-{h}.aparc.annot"))
        v = np.stack([-v[:, 0], -v[:, 1], v[:, 2]], 1) * 0.001  # RAS (mm) → Blender: levo +X, spredaj -Y, gor +Z
        hem[stran] = (v, t, sulc, lab)
    vse = np.concatenate([h[0] for h in hem.values()])
    a, b = vse.min(0), vse.max(0)
    lo = np.array(lo); hi = np.array(hi)
    k = (hi - lo) / (b - a)
    vrstice = []
    sred = 0.5 * (lo[0] + hi[0])  # sredinska ravnina (Z-Anatomy je simetrična, rez v prerezu je tu)
    for stran, (v, t, sulc, lab) in hem.items():
        v = (v - a) * k + lo
        # Polobla ostane na svoji strani sredine (vsaj 0,4 mm): MRI polobli se ob sredini dotikata in prekrivata, zato bi ju
        # rez na x = 0 razrezal v drobce (luknje v prerezu). Mehka meja: daleč od sredine se nič ne spremeni.
        zn = 1.0 if stran == "l" else -1.0
        d = (v[:, 0] - sred) * zn
        m0, kk = 0.0004, 0.0005
        d = m0 + kk * np.logaddexp(0.0, (d - m0) / kk)
        v[:, 0] = sred + zn * d
        dl = np.array([del_za.get(x) for x in lab], dtype=object)
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
        tri_del = dl[t[:, 0]]
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
    """Mreža iz metakroglic [(točka, polmer)]: gladka organska oblika (ledvični meh in čašice)."""
    # Blender ne dovoli ločljivosti metakroglic pod ~5 mm: gradimo v 10-kratnem merilu in pomanjšamo.
    M = 10.0
    mb = bpy.data.metaballs.new(ime); mb.resolution = mb.render_resolution = locljivost * M; mb.threshold = 0.6
    for co, r in tocke:
        el = mb.elements.new(); el.co = co * M; el.radius = r * M; el.stiffness = 2.0
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
    # Zgornji del sečevoda Z-Anatomy vodi v njen (izključeni) meh mimo ledvice HRA: odrežemo ga 12 mm pod mehom,
    # meh se nadaljuje do novega vrha sečevoda.
    zr = C.z - 0.012
    bm = bmesh.new(); bm.from_mesh(ur)
    bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:], plane_co=(0, 0, zr), plane_no=(0, 0, 1), clear_outer=True)
    bm.to_mesh(ur); bm.free()
    obroc = [v.co for v in ur.vertices if v.co.z > zr - 0.0005]
    vrh = sum(obroc, Vector()) / len(obroc)
    pod = [v.co for v in ur.vertices if zr - 0.007 < v.co.z < zr - 0.004]
    vrh2 = sum(pod, Vector()) / len(pod) if pod else vrh - Vector((0, 0, 0.005))  # znotraj sečevoda: meh zamaši odrezan konec
    ru = 1.2 * sum((c - vrh).length for c in obroc) / len(obroc)  # polmer krogle, da je površina meha ≈ zunanji polmer sečevoda
    zg = [p for p in pap if p.z >= C.z] or pap; sp = [p for p in pap if p.z < C.z] or pap
    M = {id(g): C.lerp(sum(g, Vector()) / len(g), 0.5) for g in (zg, sp)}
    k = cfg.get("meh_merilo", 1.0)
    t = []
    for g in (zg, sp):
        m = M[id(g)]
        for p in g:
            t += [(p, 0.0034 * k)] + _crta(p, m, 0.0022 * k, 0.0026 * k, 0.0012)[1:]
        t += _crta(m, C, 0.0028 * k, 0.0048 * k, 0.0012)
    t += _crta(C, C.lerp(vrh, 0.5), 0.0058 * k, 0.004 * k, 0.0012) + _crta(C.lerp(vrh, 0.5), vrh, 0.004 * k, ru, 0.001) + _crta(vrh, vrh2, ru, ru, 0.001)
    me = _metakroglice(t, "meh", tmp)
    print(f"[organi] ledvični meh: {len(pap)} malih čašic, {tris(me)} trikotnikov")
    return [["Evklid renal pelvis and calyces (lastno)", me, "meh", "meh", "Evklid renal pelvis and calyces (lastno) / Evklid"]]


def jetrne_zile(osnovni, cfg, tmp):
    """Veje portalne vene in jetrnih ven v jetrih (lastno delo): Z-Anatomy ima le deblo portalne vene in krne jetrne vene.
    Drevo raste iz korena, veje se dvojijo pod kotom, tanjšajo in ostanejo vsaj polmer + 1,5 mm pod površino jeter."""
    rnd = random.Random(7)
    bm = bmesh.new()
    segi = []
    for ime, me, *_ in osnovni:
        if "segment of liver" in ime:
            bm.from_mesh(me)
            b1 = bmesh.new(); b1.from_mesh(me); segi.append(BVHTree.FromBMesh(b1)); b1.free()
    vse = BVHTree.FromBMesh(bm)
    def parnost1(t, p):
        n = 0; q = p.copy(); d = Vector((0.0123, 0.0071, 1)).normalized()
        while True:
            h = t.ray_cast(q, d)
            if h[0] is None: break
            n += 1; q = h[0] + d * 1e-5
        return n % 2 == 1
    def parnost(_t, p):  # v katerem koli segmentu (segmenti se lahko malo prekrivajo: skupna parnost bi zgrešila)
        return any(parnost1(t, p) for t in segi)
    # zunanja površina jeter: ploskve segmentov, za katerimi (3 mm navzven) ni drugega segmenta; meje med segmenti
    # niso ovira za veje
    bm.faces.ensure_lookup_table(); bm.normal_update()
    # (normale tu še niso poravnane navzven: notranja ploskev ima segment na obeh straneh)
    notranje = [f for f in bm.faces if parnost(vse, f.calc_center_median() + f.normal * 0.003) and parnost(vse, f.calc_center_median() - f.normal * 0.003)]
    bmesh.ops.delete(bm, geom=notranje, context="FACES")
    zun = BVHTree.FromBMesh(bm); bm.free()
    def notri(p, r):
        return parnost(vse, p) or (vse.find_nearest(p)[3] < 0.0025 and zun.find_nearest(p)[3] > 0.004)
    def notri(p, r, _n=notri):
        return _n(p, r) and zun.find_nearest(p)[3] > r + 0.001
    tez = [sum((v.co for v in me.vertices), Vector()) / len(me.vertices) for ime, me, *_ in osnovni if "segment of liver" in ime]
    sred = sum(tez, Vector()) / len(tez)
    def koren_v(p, r):
        for i in range(60):
            if notri(p, r): return p
            p = p + (sred - p).normalized() * 0.002
        return p
    def drevo(koren, smer, r0, ime, globina=6):
        bm = bmesh.new()
        def veja(p, d, r, g):
            L = 0.009 + 0.012 * (r / r0) ** 0.7
            for i in range(14):  # krajša ali malo zasukana veja, dokler ne ostane v jetrih
                dd = d if i < 4 else (d + Vector([rnd.uniform(-0.6, 0.6) for _ in range(3)])).normalized()
                q = p + dd * L
                if notri(q, r) and notri(p.lerp(q, 0.5), r): break
                L = max(L * 0.8, 0.004)
            else:
                return
            os_ = (q - p).normalized(); dolz = (q - p).length + r
            geo = bmesh.ops.create_cone(bm, cap_ends=True, segments=10, radius1=r, radius2=r * 0.92, depth=dolz)
            rot = Vector((0, 0, 1)).rotation_difference(os_).to_matrix().to_4x4()
            bmesh.ops.transform(bm, matrix=Matrix.Translation(p.lerp(q, 0.5)) @ rot, verts=geo["verts"])
            if g >= globina or r < 0.0009:
                return
            pr = os_.orthogonal().normalized()
            pr.rotate(Matrix.Rotation(rnd.uniform(0, 6.283), 3, os_))
            for zn in (1, -1):
                kot = rnd.uniform(0.35, 0.65)
                nd = (Matrix.Rotation(zn * kot, 3, pr.cross(os_)) @ os_).normalized()
                veja(q, nd, r * rnd.uniform(0.68, 0.8), g + 1)
        for d in smer:
            veja(koren, d.normalized(), r0, 0)
        me = bpy.data.meshes.new(ime); bm.to_mesh(me); bm.free()
        return me
    po = next(me for ime, me, *_ in osnovni if ime == "Hepatic portal vein")
    vrh = max(po.vertices, key=lambda v: v.co.z).co.copy()
    jv = next(me for ime, me, *_ in osnovni if ime == "Hepatic veins")
    jc = sum((v.co for v in jv.vertices), Vector()) / len(jv.vertices)
    # koren nekoliko v jetra: portalna vena se v jetrnih vratih razcepi v desno in levo vejo
    port = drevo(koren_v(vrh, 0.0042), [Vector((-1, 0.1, 0.35)), Vector((1, -0.2, 0.3))], 0.0042, "portalne-veje")
    ven = drevo(koren_v(jc, 0.0038), [Vector((-1, 0.2, -0.5)), Vector((0.1, -0.3, -1)), Vector((1, -0.1, -0.4))], 0.0038, "jetrne-veje")
    print(f"[organi] jetrne žile: portalne veje {tris(port)}, jetrne vene {tris(ven)} trikotnikov")
    return [["Hepatic portal vein branches (lastno)", port, "portalna", "portalna-vena", "Hepatic portal vein branches (lastno) / Evklid"],
            ["Hepatic vein branches (lastno)", ven, "vena", "jetrne-vene", "Hepatic vein branches (lastno) / Evklid"]]


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
    # lastne strukture (CC BY-SA, naše delo): ledvični meh s čašicami, veje jetrnih žil v jetrih
    for ime_f in cfg.get("dodaj", []):
        osnovni += globals()[ime_f](osnovni, cfg, tmp)
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
    # skrci: (regex, metri) premik oglišč navznoter po normali. Režnji pljuč po SUBSURF na vbočenih špranjah segajo v
    # soseda (prekrivanje ~mm); faktor okoli težišča tega ne odpravi.
    for rx, d in cfg.get("skrci", []):
        for row in osnovni:
            if re.search(rx, row[0]):
                nor = [v.normal.copy() for v in row[1].vertices]
                for v, nn in zip(row[1].vertices, nor):
                    v.co -= nn * d
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
    for _, me, *_ in osnovni:
        for vv in me.vertices:
            lo = Vector(map(min, lo, vv.co)); hi = Vector(map(max, hi, vv.co))
    ctr = (lo + hi) / 2
    velikost = (hi - lo).length
    for _, me, *_ in osnovni:
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
        peka.maske(osnovni, velikost, ms.get("zile", "^$"), set(ms.get("tkiva", [])))
    slike = None
    for i, (cilj, pripona) in enumerate(zip(cfg["cilj"], ("", "-telefon"))):
        ratio = min(1.0, cilj / max(skupaj, 1))
        # telefon=False: telefon brez tekstur (pri možganih je 1024-px peka na ~50k trikotnikih videti zmečkano)
        tk = tc if tc and (i == 0 or tc.get("telefon", True)) else None
        slike = None
        objekti = []
        for ime, me, tkivo, d, v, odprtih in osnovni:
            m = me.copy()
            no = bpy.data.objects.new(ime, m)
            if no.name != ime:  # lokalni izvirnik z istim imenom (odprt Startup.blend): izvirnik preimenujemo
                bpy.data.objects[ime, None].name = ime + "·src"; no.name = ime
            tmp.objects.link(no)
            n = tris(m)
            if tk and not (ratio < 1 and n > 300):  # tangente MikkTSpace (normalna mapa) zahtevajo trikotnike
                bm = bmesh.new(); bm.from_mesh(m); bmesh.ops.triangulate(bm, faces=bm.faces); bm.to_mesh(m); bm.free()
            if ratio < 1 and n > 300:
                bm = bmesh.new(); bm.from_mesh(m); bmesh.ops.triangulate(bm, faces=bm.faces); bm.to_mesh(m); bm.free()
                mod = no.modifiers.new("dec", "DECIMATE"); mod.ratio = max(ratio, 150 / n); mod.use_collapse_triangulate = True
                m2 = bpy.data.meshes.new_from_object(no.evaluated_get(bpy.context.evaluated_depsgraph_get()))
                no.modifiers.clear(); no.data = m2
            for p in no.data.polygons:
                p.use_smooth = True
            no.data.materials.clear(); no.data.materials.append(material(tkivo, slike))
            no["tkivo"] = tkivo; no["del"] = d or ""
            objekti.append(no)
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
    with open(os.path.join(out, organ + ".vozlisca.json"), "w", encoding="utf-8") as f:
        json.dump(porocilo, f, ensure_ascii=False, indent=1)


for organ in izbrani:
    izvozi(organ, ORGANI[organ])

// Pojmi za igre: geo (glej README.md v tej mapi).
// Geologija in okolje, 1. letnik fakultete. Brez uvozov: pomožne funkcije so lokalne.

const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const shuffle = (a) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};
// Naloga: pravilni odgovor in 3 različni napačni (prvi v seznamu imajo prednost); manjkajoče doda fill(i).
function mk(q, a, ws, fill) {
  a = String(a);
  const out = [];
  const seen = new Set([a]);
  const add = (w) => {
    if (w == null || w === "") return;
    const s = String(w);
    if (!seen.has(s) && !/NaN|undefined|Infinity/.test(s)) {
      seen.add(s);
      out.push(s);
    }
  };
  ws.forEach(add);
  for (let i = 0; out.length < 3 && fill && i < 80; i++) add(fill(i));
  // rezerva za številske odgovore: bližnja števila v istem zapisu
  const m = /^(−?)(\d+)([.,]\d+)?$/.exec(a);
  if (m) {
    const v = Number((m[1] ? "-" : "") + m[2] + (m[3] || "").replace(",", "."));
    const sep = (m[3] || "").startsWith(",") ? "," : ".";
    const dec = m[3] ? m[3].length - 1 : 0;
    const step = dec ? 10 ** -dec : 1;
    for (let i = 1; out.length < 3 && i < 40; i++) {
      const x = v + (i % 2 ? 1 : -1) * Math.ceil(i / 2) * step;
      add((x < 0 ? "−" : "") + Math.abs(x).toFixed(dec).replace(".", sep));
    }
  }
  return { q, a, w: shuffle(out.slice(0, 3)) };
}
// Banka vprašanj: [stopnja, [q, a, napačni …] slovensko, [q, a, napačni …] angleško].
// Stopnja 1 → vnosi 1; stopnja 2 → vnosi 1–2; stopnja 3 → vnosi 2–3.
function bank(items, t, ctx) {
  let c = items.filter((x) => (t === 1 ? x[0] === 1 : t === 2 ? x[0] <= 2 : x[0] >= 2));
  if (!c.length) c = items;
  const it = pick(c);
  const [q, a, ...ws] = ctx.lang === "sl" ? it[1] : it[2];
  return mk(q, a, shuffle(ws));
}
// Razvrščanje: »Katera je X?« → en primer iz skupine, napačni iz drugih skupin.
function memberOf(groups, gi, ctx, qsl, qen) {
  const sl = ctx.lang === "sl";
  const g = groups[gi];
  const a = pick(g.items);
  const others = shuffle(groups.filter((_, i) => i !== gi).flatMap((x) => x.items));
  return mk(sl ? qsl : qen, sl ? a[0] : a[1], others.map((x) => (sl ? x[0] : x[1])));
}

// ---------- podatki ----------
const MOHS = [
  [1, "smukec", "smukca", "talc"],
  [2, "sadra", "sadre", "gypsum"],
  [3, "kalcit", "kalcita", "calcite"],
  [4, "fluorit", "fluorita", "fluorite"],
  [5, "apatit", "apatita", "apatite"],
  [6, "ortoklaz", "ortoklaza", "orthoclase"],
  [7, "kremen", "kremena", "quartz"],
  [8, "topaz", "topaza", "topaz"],
  [9, "korund", "korunda", "corundum"],
  [10, "diamant", "diamanta", "diamond"],
];

// [ime sl, ime en, formula, skupina (indeks v GROUPS ali −1)]
const MINERALS = [
  ["kremen", "quartz", "SiO₂", -1],
  ["kalcit", "calcite", "CaCO₃", 0],
  ["dolomit", "dolomite", "CaMg(CO₃)₂", 0],
  ["magnezit", "magnesite", "MgCO₃", 0],
  ["siderit", "siderite", "FeCO₃", 0],
  ["halit", "halite", "NaCl", 1],
  ["fluorit", "fluorite", "CaF₂", 1],
  ["pirit", "pyrite", "FeS₂", 2],
  ["galenit", "galena", "PbS", 2],
  ["sfalerit", "sphalerite", "ZnS", 2],
  ["cinabarit", "cinnabar", "HgS", 2],
  ["sadra", "gypsum", "CaSO₄·2H₂O", 3],
  ["anhidrit", "anhydrite", "CaSO₄", 3],
  ["barit", "baryte", "BaSO₄", 3],
  ["hematit", "hematite", "Fe₂O₃", 4],
  ["magnetit", "magnetite", "Fe₃O₄", 4],
  ["korund", "corundum", "Al₂O₃", 4],
  ["olivin", "olivine", "", 5],
  ["ortoklaz", "orthoclase", "", 5],
  ["muskovit", "muscovite", "", 5],
  ["biotit", "biotite", "", 5],
];
const GROUPS = [
  ["karbonati", "carbonates"],
  ["halogenidi", "halides"],
  ["sulfidi", "sulfides"],
  ["sulfati", "sulfates"],
  ["oksidi", "oxides"],
  ["silikati", "silicates"],
];

const ROCKS = [
  { sl: "magmatska", items: [["granit", "granite"], ["gabro", "gabbro"], ["diorit", "diorite"], ["tonalit", "tonalite"], ["peridotit", "peridotite"], ["bazalt", "basalt"], ["andezit", "andesite"], ["riolit", "rhyolite"], ["dacit", "dacite"], ["obsidian", "obsidian"], ["plovec", "pumice"]] },
  { sl: "sedimentna", items: [["apnenec", "limestone"], ["dolomit", "dolostone"], ["peščenjak", "sandstone"], ["konglomerat", "conglomerate"], ["glinavec", "claystone"], ["laporovec", "marlstone"], ["roženec", "chert"], ["kamena sol", "rock salt"], ["premog", "coal"]] },
  { sl: "metamorfna", items: [["marmor", "marble"], ["kvarcit", "quartzite"], ["zeleni skrilavec", "greenschist"], ["gnajs", "gneiss"], ["filit", "phyllite"], ["amfibolit", "amphibolite"], ["eklogit", "eclogite"], ["serpentinit", "serpentinite"], ["blestnik", "mica schist"]] },
];
const PLUTONIC = { items: [["granit", "granite"], ["gabro", "gabbro"], ["diorit", "diorite"], ["tonalit", "tonalite"]] };
const VOLCANIC = { items: [["bazalt", "basalt"], ["andezit", "andesite"], ["riolit", "rhyolite"], ["dacit", "dacite"], ["obsidian", "obsidian"]] };
const CLASTIC = { items: [["peščenjak", "sandstone"], ["konglomerat", "conglomerate"], ["breča", "breccia"], ["glinavec", "claystone"]] };
const NONCLASTIC = { items: [["kamena sol", "rock salt"], ["premog", "coal"], ["roženec", "chert"], ["sadrovec", "gypsum rock"]] };

// periode fanerozoika: [sl, en, era]
const PER = [
  ["kambrij", "Cambrian", 0],
  ["ordovicij", "Ordovician", 0],
  ["silur", "Silurian", 0],
  ["devon", "Devonian", 0],
  ["karbon", "Carboniferous", 0],
  ["perm", "Permian", 0],
  ["trias", "Triassic", 1],
  ["jura", "Jurassic", 1],
  ["kreda", "Cretaceous", 1],
  ["paleogen", "Paleogene", 2],
  ["neogen", "Neogene", 2],
  ["kvartar", "Quaternary", 2],
];
const ERA = [
  ["paleozoik", "Paleozoic"],
  ["mezozoik", "Mesozoic"],
  ["kenozoik", "Cenozoic"],
  ["proterozoik", "Proterozoic"],
];
const cap = (s) => s[0].toUpperCase() + s.slice(1);

// ---------- banke ----------
const LAYERS = [
  [1, ["Najtanjša plast Zemlje?", "skorja", "plašč", "zunanje jedro", "notranje jedro"], ["Thinnest layer of Earth?", "crust", "mantle", "outer core", "inner core"]],
  [1, ["Tekoča plast Zemlje?", "zunanje jedro", "notranje jedro", "plašč", "skorja"], ["Liquid layer of Earth?", "outer core", "inner core", "mantle", "crust"]],
  [1, ["Plast z največjo prostornino?", "plašč", "skorja", "zunanje jedro", "notranje jedro"], ["Layer with the largest volume?", "mantle", "crust", "outer core", "inner core"]],
  [1, ["Trdno središče Zemlje?", "notranje jedro", "zunanje jedro", "plašč", "astenosfera"], ["Solid centre of Earth?", "inner core", "outer core", "mantle", "asthenosphere"]],
  [1, ["Glavna elementa Zemljinega jedra?", "Fe in Ni", "Si in O", "Mg in Si", "Al in Si"], ["Main elements of Earth's core?", "Fe and Ni", "Si and O", "Mg and Si", "Al and Si"]],
  [1, ["Najpogostejši element v skorji?", "kisik", "silicij", "železo", "aluminij"], ["Most abundant element in the crust?", "oxygen", "silicon", "iron", "aluminium"]],
  [1, ["Zunanja trdna lupina Zemlje?", "litosfera", "astenosfera", "hidrosfera", "atmosfera"], ["Rigid outer shell of Earth?", "lithosphere", "asthenosphere", "hydrosphere", "atmosphere"]],
  [1, ["Najgostejša plast Zemlje?", "notranje jedro", "zunanje jedro", "plašč", "skorja"], ["Densest layer of Earth?", "inner core", "outer core", "mantle", "crust"]],
  [1, ["Temperatura v Zemljinem jedru ≈ ?", "5000–6000 °C", "500–600 °C", "50 000 °C", "100–200 °C"], ["Temperature in Earth's core ≈ ?", "5000–6000 °C", "500–600 °C", "50,000 °C", "100–200 °C"]],
  [2, ["Meja med skorjo in plaščem?", "Moho", "Gutenbergova", "Lehmannova", "Conradova"], ["Crust–mantle boundary?", "Moho", "Gutenberg", "Lehmann", "Conrad"]],
  [2, ["Meja med plaščem in jedrom?", "Gutenbergova", "Moho", "Lehmannova", "Conradova"], ["Mantle–core boundary?", "Gutenberg", "Moho", "Lehmann", "Conrad"]],
  [2, ["Meja med zunanjim in notranjim jedrom?", "Lehmannova", "Moho", "Gutenbergova", "Conradova"], ["Outer–inner core boundary?", "Lehmann", "Moho", "Gutenberg", "Conrad"]],
  [1, ["Plastična plast pod litosfero?", "astenosfera", "skorja", "zunanje jedro", "notranje jedro"], ["Plastic layer below the lithosphere?", "asthenosphere", "crust", "outer core", "inner core"]],
  [2, ["Litosfera = skorja + ?", "vrhnji del plašča", "astenosfera", "zunanje jedro", "spodnji plašč"], ["Lithosphere = crust + ?", "uppermost mantle", "asthenosphere", "outer core", "lower mantle"]],
  [2, ["Polmer Zemlje ≈ ?", "6370 km", "3470 km", "12740 km", "2900 km"], ["Earth's radius ≈ ?", "6370 km", "3470 km", "12740 km", "2900 km"]],
  [2, ["Debelina oceanske skorje ≈ ?", "7 km", "35 km", "350 km", "700 km"], ["Oceanic crust thickness ≈ ?", "7 km", "35 km", "350 km", "700 km"]],
  [2, ["Povprečna debelina celinske skorje ≈ ?", "35 km", "7 km", "350 km", "2900 km"], ["Average continental crust thickness ≈ ?", "35 km", "7 km", "350 km", "2900 km"]],
  [3, ["Globina meje plašč–jedro ≈ ?", "2900 km", "670 km", "5150 km", "35 km"], ["Depth of the mantle–core boundary ≈ ?", "2900 km", "670 km", "5150 km", "35 km"]],
  [3, ["Globina meje notranjega jedra ≈ ?", "5150 km", "2900 km", "670 km", "6370 km"], ["Depth of the inner core boundary ≈ ?", "5150 km", "2900 km", "670 km", "6370 km"]],
  [3, ["S-valovi ne potujejo skozi?", "zunanje jedro", "plašč", "skorjo", "litosfero"], ["S-waves cannot pass through the?", "outer core", "mantle", "crust", "lithosphere"]],
  [3, ["Zemljino magnetno polje nastaja v?", "zunanjem jedru", "notranjem jedru", "plašču", "skorji"], ["Earth's magnetic field arises in the?", "outer core", "inner core", "mantle", "crust"]],
  [3, ["Oceanska skorja je pretežno?", "bazaltna", "granitna", "apnenčasta", "peridotitna"], ["Oceanic crust is mostly?", "basaltic", "granitic", "limestone", "peridotitic"]],
  [3, ["Celinska skorja je pretežno?", "granitna", "bazaltna", "peridotitna", "apnenčasta"], ["Continental crust is mostly?", "granitic", "basaltic", "peridotitic", "limestone"]],
  [3, ["Zgornji plašč je pretežno iz?", "peridotita", "granita", "bazalta", "apnenca"], ["Upper mantle is mostly?", "peridotite", "granite", "basalt", "limestone"]],
];

const SETTINGS = [
  ["divergentna meja", "divergent boundary"],
  ["konvergentna meja", "convergent boundary"],
  ["transformna meja", "transform boundary"],
  ["vroča točka", "hotspot"],
];
// [sl, en, okolje]
const FEATURES = [
  ["Srednjeoceanski hrbet", "Mid-ocean ridge", 0],
  ["Rdeče morje", "Red Sea", 0],
  ["Vzhodnoafriški tektonski jarek", "East African Rift", 0],
  ["Globokomorski jarek", "Deep-sea trench", 1],
  ["Himalaja", "Himalayas", 1],
  ["Andi", "Andes", 1],
  ["Alpe", "Alps", 1],
  ["Japonski otočni lok", "Japanese island arc", 1],
  ["Marianski jarek", "Mariana Trench", 1],
  ["Prelom San Andreas", "San Andreas Fault", 2],
  ["Severnoanatolski prelom", "North Anatolian Fault", 2],
  ["Havajski otoki", "Hawaiian Islands", 3],
  ["Yellowstone", "Yellowstone", 3],
];
const PLATE_FACTS = [
  [2, ["Meja, na kateri poteka subdukcija?", "konvergentna meja", "divergentna meja", "transformna meja", "vroča točka"], ["Boundary where subduction happens?", "convergent boundary", "divergent boundary", "transform boundary", "hotspot"]],
  [2, ["Meja, na kateri nastaja oceanska skorja?", "divergentna meja", "konvergentna meja", "transformna meja", "vroča točka"], ["Boundary where oceanic crust forms?", "divergent boundary", "convergent boundary", "transform boundary", "hotspot"]],
  [2, ["Meja, kjer plošči drsita druga ob drugi?", "transformna meja", "divergentna meja", "konvergentna meja", "vroča točka"], ["Boundary where plates slide past?", "transform boundary", "divergent boundary", "convergent boundary", "hotspot"]],
  [2, ["Meja, kjer skorja ne nastaja ne izginja?", "transformna meja", "divergentna meja", "konvergentna meja", "vroča točka"], ["Boundary where crust is neither made nor lost?", "transform boundary", "divergent boundary", "convergent boundary", "hotspot"]],
  [2, ["Meja z najglobljimi potresi (do 700 km)?", "konvergentna meja", "divergentna meja", "transformna meja", "vroča točka"], ["Boundary with the deepest quakes (700 km)?", "convergent boundary", "divergent boundary", "transform boundary", "hotspot"]],
  [3, ["Ob trku ocean–celina se podriva?", "oceanska plošča", "celinska plošča", "obe enako", "nobena"], ["Ocean–continent collision: what subducts?", "oceanic plate", "continental plate", "both equally", "neither"]],
  [3, ["Oceanska plošča se podriva, ker ima?", "večjo gostoto", "manjšo gostoto", "večjo debelino", "višjo temperaturo"], ["Oceanic plate subducts because it is?", "denser", "less dense", "thicker", "hotter"]],
  [3, ["Hitrost premikanja plošč ≈ ?", "nekaj cm/leto", "nekaj m/leto", "nekaj km/leto", "nekaj mm/stoletje"], ["Plate speed ≈ ?", "a few cm/yr", "a few m/yr", "a few km/yr", "a few mm/century"]],
  [3, ["Superkontinent pred 250 mil. let?", "Pangea", "Rodinija", "Panotija", "Nuna"], ["Supercontinent 250 Myr ago?", "Pangaea", "Rodinia", "Pannotia", "Nuna"]],
  [3, ["Trk dveh celinskih plošč ustvari?", "nagubano gorovje", "globokomorski jarek", "otočni lok", "oceanski hrbet"], ["Continent–continent collision makes?", "fold mountains", "deep-sea trench", "island arc", "ocean ridge"]],
  [3, ["Trk dveh oceanskih plošč ustvari?", "otočni lok", "nagubano gorovje", "oceanski hrbet", "riftna dolina"], ["Ocean–ocean convergence makes?", "island arc", "fold mountains", "ocean ridge", "rift valley"]],
];

const QUAKE_FACTS = [
  [1, ["Najhitrejši potresni valovi?", "P-valovi", "S-valovi", "površinski valovi", "cunami"], ["Fastest seismic waves?", "P-waves", "S-waves", "surface waves", "tsunami"]],
  [1, ["Točka na površju nad žariščem?", "epicenter", "hipocenter", "prelom", "seizmograf"], ["Point on the surface above the focus?", "epicentre", "hypocentre", "fault", "seismograph"]],
  [1, ["Prečni (strižni) prostorninski valovi?", "S-valovi", "P-valovi", "cunami", "plimovanje"], ["Transverse (shear) body waves?", "S-waves", "P-waves", "tsunami", "tides"]],
  [1, ["Naprava, ki zapisuje potrese?", "seizmograf", "barometer", "higrometer", "anemometer"], ["Instrument that records earthquakes?", "seismograph", "barometer", "hygrometer", "anemometer"]],
  [1, ["Učinke potresa opisuje lestvica?", "EMS-98", "Mohsova", "pH", "Beaufortova"], ["Earthquake effects are described by?", "EMS-98 scale", "Mohs scale", "pH scale", "Beaufort scale"]],
];

const STRAT = [
  [1, ["Spodnja plast je starejša: načelo?", "superpozicija", "prvotna vodoravnost", "presečni odnosi", "zaporedje fosilov"], ["Lower layer is older: principle?", "superposition", "horizontality", "cross-cutting", "faunal succession"]],
  [1, ["Plasti se odlagajo vodoravno: načelo?", "prvotna vodoravnost", "superpozicija", "presečni odnosi", "zaporedje fosilov"], ["Layers are laid down flat: principle?", "horizontality", "superposition", "cross-cutting", "faunal succession"]],
  [1, ["Prelom je mlajši od plasti, ki jih seka: načelo?", "presečni odnosi", "superpozicija", "prvotna vodoravnost", "zaporedje fosilov"], ["Fault younger than layers it cuts: principle?", "cross-cutting", "superposition", "horizontality", "faunal succession"]],
  [2, ["Fosili si sledijo v stalnem redu: načelo?", "zaporedje fosilov", "superpozicija", "presečni odnosi", "prvotna vodoravnost"], ["Fossils follow a fixed order: principle?", "faunal succession", "superposition", "cross-cutting", "horizontality"]],
  [1, ["Fosil za določanje starosti plasti?", "vodilni fosil", "živi fosil", "ihnofosil", "koprolit"], ["Fossil used to date a layer?", "index fossil", "living fossil", "trace fossil", "coprolite"]],
  [1, ["Trilobiti so vodilni fosili ere?", "paleozoik", "mezozoik", "kenozoik", "proterozoik"], ["Trilobites are index fossils of the?", "Paleozoic", "Mesozoic", "Cenozoic", "Proterozoic"]],
  [1, ["Amoniti so vodilni fosili ere?", "mezozoik", "paleozoik", "kenozoik", "proterozoik"], ["Ammonites are index fossils of the?", "Mesozoic", "Paleozoic", "Cenozoic", "Proterozoic"]],
  [2, ["Numuliti so vodilni fosili periode?", "paleogen", "kambrij", "jura", "kvartar"], ["Nummulites are index fossils of the?", "Paleogene", "Cambrian", "Jurassic", "Quaternary"]],
  [1, ["Graptoliti so vodilni fosili ere?", "paleozoik", "mezozoik", "kenozoik", "proterozoik"], ["Graptolites are index fossils of the?", "Paleozoic", "Mesozoic", "Cenozoic", "Proterozoic"]],
  [1, ["Ostanek ali sled organizma v kamnini?", "fosil", "mineral", "kristal", "konkrecija"], ["Remains or trace of a life form in rock?", "fossil", "mineral", "crystal", "concretion"]],
  [1, ["Okameneli iztrebki?", "koprolit", "amonit", "trilobit", "numulit"], ["Fossilised dung?", "coprolite", "ammonite", "trilobite", "nummulite"]],
  [2, ["Vrzel v zaporedju plasti?", "diskordanca", "konkordanca", "guba", "prelom"], ["Gap in the rock record?", "unconformity", "conformity", "fold", "fault"]],
  [2, ["Datiranje lesa (do ~50 000 let)?", "¹⁴C", "U–Pb", "K–Ar", "Rb–Sr"], ["Dating wood (up to ~50,000 yr)?", "¹⁴C", "U–Pb", "K–Ar", "Rb–Sr"]],
  [3, ["Datiranje starih cirkonov?", "U–Pb", "¹⁴C", "K–Ar", "Rb–Sr"], ["Dating old zircons?", "U–Pb", "¹⁴C", "K–Ar", "Rb–Sr"]],
  [3, ["Dendrokronologija šteje?", "drevesne branike", "plasti ledu", "varve", "izotope"], ["Dendrochronology counts?", "tree rings", "ice layers", "varves", "isotopes"]],
  [3, ["Letne plasti jezerskih usedlin?", "varve", "branike", "diskordance", "turbiditi"], ["Annual layers of lake sediment?", "varves", "tree rings", "unconformities", "turbidites"]],
  [3, ["Biostratigrafija temelji na?", "fosilih", "izotopih", "magnetizmu", "litologiji"], ["Biostratigraphy is based on?", "fossils", "isotopes", "magnetism", "lithology"]],
  [3, ["Magnetostratigrafija temelji na?", "obratih polja", "fosilih", "izotopih", "litologiji"], ["Magnetostratigraphy is based on?", "field reversals", "fossils", "isotopes", "lithology"]],
];

const TIME_FACTS = [
  [2, ["Starost Zemlje ≈ ?", "4,6 mrd. let", "4,6 mil. let", "13,8 mrd. let", "540 mil. let"], ["Age of the Earth ≈ ?", "4.6 billion yr", "4.6 million yr", "13.8 billion yr", "540 million yr"]],
  [2, ["Konec krede ≈ ?", "pred 66 mil. let", "pred 252 mil. let", "pred 540 mil. let", "pred 2,6 mil. let"], ["End of the Cretaceous ≈ ?", "66 Myr ago", "252 Myr ago", "540 Myr ago", "2.6 Myr ago"]],
  [2, ["Meja perm–trias ≈ ?", "pred 252 mil. let", "pred 66 mil. let", "pred 540 mil. let", "pred 201 mil. let"], ["Permian–Triassic boundary ≈ ?", "252 Myr ago", "66 Myr ago", "540 Myr ago", "201 Myr ago"]],
  [3, ["Začetek kambrija ≈ ?", "pred 540 mil. let", "pred 252 mil. let", "pred 66 mil. let", "pred 4,6 mrd. let"], ["Start of the Cambrian ≈ ?", "540 Myr ago", "252 Myr ago", "66 Myr ago", "4.6 Gyr ago"]],
  [3, ["Začetek kvartarja ≈ ?", "pred 2,6 mil. let", "pred 66 mil. let", "pred 23 mil. let", "pred 11 700 leti"], ["Start of the Quaternary ≈ ?", "2.6 Myr ago", "66 Myr ago", "23 Myr ago", "11,700 yr ago"]],
  [2, ["Največje izumrtje: meja?", "perm–trias", "kreda–paleogen", "trias–jura", "ordovicij–silur"], ["Largest mass extinction: boundary?", "Permian–Triassic", "K–Pg", "Triassic–Jurassic", "Ordovician–Silurian"]],
  [2, ["Izumrtje neptičjih dinozavrov: meja?", "kreda–paleogen", "perm–trias", "trias–jura", "ordovicij–silur"], ["Non-avian dinosaur extinction: boundary?", "K–Pg", "Permian–Triassic", "Triassic–Jurassic", "Ordovician–Silurian"]],
  [3, ["Najstarejši eon?", "hadij", "arhaik", "proterozoik", "fanerozoik"], ["Oldest eon?", "Hadean", "Archean", "Proterozoic", "Phanerozoic"]],
  [3, ["Eon pred fanerozoikom?", "proterozoik", "arhaik", "hadij", "paleozoik"], ["Eon before the Phanerozoic?", "Proterozoic", "Archean", "Hadean", "Paleozoic"]],
  [3, ["Holocen je epoha periode?", "kvartar", "neogen", "paleogen", "kreda"], ["The Holocene is an epoch of the?", "Quaternary", "Neogene", "Paleogene", "Cretaceous"]],
  [3, ["Prvi kopenski vretenčarji so iz?", "devona", "kambrija", "jure", "kvartarja"], ["First land vertebrates appeared in the?", "Devonian", "Cambrian", "Jurassic", "Quaternary"]],
  [2, ["Perioda, imenovana po premogu?", "karbon", "kambrij", "trias", "neogen"], ["Period named after coal?", "Carboniferous", "Cambrian", "Triassic", "Neogene"]],
  [2, ["Era dinozavrov?", "mezozoik", "paleozoik", "kenozoik", "proterozoik"], ["Era of the dinosaurs?", "Mesozoic", "Paleozoic", "Cenozoic", "Proterozoic"]],
  [2, ["Era, v kateri živimo?", "kenozoik", "mezozoik", "paleozoik", "proterozoik"], ["The era we live in?", "Cenozoic", "Mesozoic", "Paleozoic", "Proterozoic"]],
];

const KARST = [
  [1, ["Skledasta kotanja na krasu?", "vrtača", "ponor", "brezno", "estavela"], ["Bowl-shaped karst hollow?", "doline", "swallow hole", "vertical shaft", "estavelle"]],
  [1, ["Reka, ki ponikne v podzemlje?", "ponikalnica", "pritok", "mrtvica", "estavela"], ["River that sinks underground?", "sinking river", "tributary", "oxbow lake", "estavelle"]],
  [1, ["Mesto, kjer reka ponikne?", "ponor", "izvir", "vrtača", "škraplje"], ["Place where a river sinks?", "swallow hole", "spring", "doline", "karren"]],
  [1, ["Kapnik, ki visi s stropa?", "stalaktit", "stalagmit", "steber", "škraplje"], ["Dripstone hanging from the ceiling?", "stalactite", "stalagmite", "column", "karren"]],
  [1, ["Kapnik, ki raste s tal?", "stalagmit", "stalaktit", "škraplje", "ponor"], ["Dripstone growing from the floor?", "stalagmite", "stalactite", "karren", "swallow hole"]],
  [1, ["Zrasla stalaktit in stalagmit?", "steber", "uvala", "ponor", "brezno"], ["Joined stalactite and stalagmite?", "column", "uvala", "swallow hole", "vertical shaft"]],
  [1, ["Kamnina, v kateri nastaja kras?", "apnenec", "granit", "bazalt", "gnajs"], ["Rock in which karst forms?", "limestone", "granite", "basalt", "gneiss"]],
  [1, ["Endemska jamska dvoživka?", "človeška ribica", "navadni pupek", "krastača", "zelena žaba"], ["Endemic cave amphibian?", "olm", "smooth newt", "toad", "green frog"]],
  [1, ["Slovenska pokrajina, ki je dala ime krasu?", "Kras", "Pohorje", "Prekmurje", "Gorenjska"], ["Slovenian region that gave karst its name?", "Kras", "Pohorje", "Prekmurje", "Gorenjska"]],
  [2, ["Navpična kraška jama?", "brezno", "vrtača", "uvala", "ponikalnica"], ["Vertical karst cave?", "vertical shaft", "doline", "uvala", "sinking river"]],
  [2, ["Žlebiči na golem apnencu?", "škraplje", "vrtače", "ponori", "kapniki"], ["Grooves on bare limestone?", "karren", "dolines", "swallow holes", "speleothems"]],
  [2, ["Velika kotanja z ravnim dnom na krasu?", "kraško polje", "vrtača", "škraplje", "brezno"], ["Large flat-floored karst depression?", "polje", "doline", "karren", "vertical shaft"]],
  [2, ["Odprtina: ob visoki vodi izvir, sicer ponor?", "estavela", "vrtača", "brezno", "uvala"], ["Opening: spring at high water, else sink?", "estavelle", "doline", "vertical shaft", "uvala"]],
  [2, ["Jezero, ki občasno izgine?", "presihajoče jezero", "ledeniško jezero", "umetno jezero", "mrtvica"], ["Lake that disappears at times?", "intermittent lake", "glacial lake", "reservoir", "oxbow lake"]],
  [2, ["Več zraslih vrtač?", "uvala", "ponor", "estavela", "brezno"], ["Several merged dolines?", "uvala", "swallow hole", "estavelle", "vertical shaft"]],
  [2, ["Plin, ki zakisa vodo za raztapljanje?", "CO₂", "O₂", "N₂", "CH₄"], ["Gas that makes water acidic for solution?", "CO₂", "O₂", "N₂", "CH₄"]],
  [2, ["Kapniki v apnenčastih jamah so iz?", "kalcita", "kremena", "sadre", "halita"], ["Dripstones in limestone caves are made of?", "calcite", "quartz", "gypsum", "halite"]],
  [3, ["CaCO₃ + H₂O + CO₂ → ?", "Ca(HCO₃)₂", "CaO", "Ca(OH)₂", "CaSO₄"], ["CaCO₃ + H₂O + CO₂ → ?", "Ca(HCO₃)₂", "CaO", "Ca(OH)₂", "CaSO₄"]],
  [3, ["Pri izločanju sige iz vode uhaja?", "CO₂", "O₂", "H₂", "CH₄"], ["When flowstone forms, the water loses?", "CO₂", "O₂", "H₂", "CH₄"]],
  [3, ["Kraški izvir pod morsko gladino?", "vrulja", "estavela", "ponor", "vrtača"], ["Karst spring below sea level?", "submarine spring", "estavelle", "swallow hole", "doline"]],
];

const EROSION = [
  [1, ["Morena nastane z delovanjem?", "ledenika", "vetra", "reke", "morja"], ["A moraine is made by?", "a glacier", "wind", "a river", "the sea"]],
  [1, ["Dolina v obliki črke U nastane z delovanjem?", "ledenika", "reke", "vetra", "morja"], ["A U-shaped valley is made by?", "a glacier", "a river", "wind", "the sea"]],
  [1, ["Dolina v obliki črke V nastane z delovanjem?", "reke", "ledenika", "vetra", "morja"], ["A V-shaped valley is made by?", "a river", "a glacier", "wind", "the sea"]],
  [1, ["Peščene sipine v puščavi nastanejo z delovanjem?", "vetra", "ledenika", "reke", "morja"], ["Desert sand dunes are made by?", "wind", "a glacier", "a river", "the sea"]],
  [1, ["Delta nastane z delovanjem?", "reke", "vetra", "ledenika", "morja"], ["A delta is made by?", "a river", "wind", "a glacier", "the sea"]],
  [1, ["Klif nastane z delovanjem?", "morja", "vetra", "ledenika", "reke"], ["A sea cliff is made by?", "the sea", "wind", "a glacier", "a river"]],
  [1, ["Meander nastane z delovanjem?", "reke", "ledenika", "vetra", "morja"], ["A meander is made by?", "a river", "a glacier", "wind", "the sea"]],
  [1, ["Odnašanje gradiva z vodo, vetrom, ledom?", "erozija", "preperevanje", "sedimentacija", "diageneza"], ["Removal of material by water, wind, ice?", "erosion", "weathering", "deposition", "diagenesis"]],
  [1, ["Razpad kamnine na mestu?", "preperevanje", "erozija", "sedimentacija", "diageneza"], ["Breakdown of rock in place?", "weathering", "erosion", "deposition", "diagenesis"]],
  [2, ["Krnica (kar) nastane z delovanjem?", "ledenika", "reke", "vetra", "morja"], ["A cirque is made by?", "a glacier", "a river", "wind", "the sea"]],
  [2, ["Puhlica (les) nastane z delovanjem?", "vetra", "morja", "reke", "ledenika"], ["Loess is deposited by?", "wind", "the sea", "a river", "a glacier"]],
  [2, ["Vršaj nastane z delovanjem?", "reke", "vetra", "morja", "ledenika"], ["An alluvial fan is made by?", "a river", "wind", "the sea", "a glacier"]],
  [2, ["Abrazijska terasa nastane z delovanjem?", "morja", "vetra", "reke", "ledenika"], ["A wave-cut platform is made by?", "the sea", "wind", "a river", "a glacier"]],
  [3, ["Drumlin nastane z delovanjem?", "ledenika", "vetra", "morja", "reke"], ["A drumlin is made by?", "a glacier", "wind", "the sea", "a river"]],
  [3, ["Jardang nastane z delovanjem?", "vetra", "ledenika", "morja", "reke"], ["A yardang is made by?", "wind", "a glacier", "the sea", "a river"]],
  [2, ["Rja na kamnini (Fe²⁺ → Fe³⁺)?", "oksidacija", "hidroliza", "raztapljanje", "hidratacija"], ["Rust on rock (Fe²⁺ → Fe³⁺)?", "oxidation", "hydrolysis", "dissolution", "hydration"]],
  [2, ["Glinenec preperi v glino: proces?", "hidroliza", "oksidacija", "raztapljanje", "zmrzal"], ["Feldspar weathers to clay: process?", "hydrolysis", "oxidation", "dissolution", "frost wedging"]],
  [3, ["Anhidrit → sadra: proces?", "hidratacija", "hidroliza", "oksidacija", "raztapljanje"], ["Anhydrite → gypsum: process?", "hydration", "hydrolysis", "oxidation", "dissolution"]],
  [3, ["Kje prevladuje kemično preperevanje?", "vlažni tropi", "vroče puščave", "polarna območja", "mrzle puščave"], ["Where does chemical weathering dominate?", "humid tropics", "hot deserts", "polar regions", "cold deserts"]],
];
const WEATHER_MECH = { items: [["zmrzal v razpokah", "frost wedging"], ["rast kristalov soli", "salt crystal growth"], ["luščenje", "exfoliation"], ["rast korenin", "root wedging"]] };
const WEATHER_CHEM = { items: [["oksidacija", "oxidation"], ["hidroliza", "hydrolysis"], ["raztapljanje", "dissolution"], ["hidratacija", "hydration"]] };

const WATER = [
  [1, ["Izhlapevanje vode skozi liste rastlin?", "transpiracija", "evaporacija", "kondenzacija", "infiltracija"], ["Water loss through plant leaves?", "transpiration", "evaporation", "condensation", "infiltration"]],
  [1, ["Pronicanje vode v tla?", "infiltracija", "evaporacija", "kondenzacija", "sublimacija"], ["Water soaking into the ground?", "infiltration", "evaporation", "condensation", "sublimation"]],
  [1, ["Proces, pri katerem nastanejo oblaki?", "kondenzacija", "evaporacija", "infiltracija", "transpiracija"], ["Process that forms clouds?", "condensation", "evaporation", "infiltration", "transpiration"]],
  [1, ["Delež slane vode na Zemlji ≈ ?", "97 %", "70 %", "50 %", "3 %"], ["Share of Earth's water that is salty ≈ ?", "97%", "70%", "50%", "3%"]],
  [1, ["Območje, s katerega voda odteka v reko?", "porečje", "razvodnica", "struga", "delta"], ["Area that drains into a river?", "drainage basin", "drainage divide", "channel", "delta"]],
  [1, ["Ločnica med porečji?", "razvodnica", "struga", "pritok", "ustje"], ["Line between drainage basins?", "drainage divide", "channel", "tributary", "river mouth"]],
  [1, ["Delež sladke vode na Zemlji ≈ ?", "3 %", "30 %", "97 %", "0,03 %"], ["Share of Earth's water that is fresh ≈ ?", "3%", "30%", "97%", "0.03%"]],
  [1, ["Voda, ki odteka po površju?", "površinski odtok", "infiltracija", "evaporacija", "kondenzacija"], ["Water flowing over the land surface?", "surface runoff", "infiltration", "evaporation", "condensation"]],
  [1, ["Večina sladke vode je v?", "ledu in ledenikih", "podzemni vodi", "rekah in jezerih", "ozračju"], ["Most fresh water is in?", "ice and glaciers", "groundwater", "rivers and lakes", "the atmosphere"]],
  [2, ["Zgornja meja nasičene cone?", "gladina podtalnice", "vodonosnik", "nepropustna plast", "izvir"], ["Top of the saturated zone?", "water table", "aquifer", "aquiclude", "spring"]],
  [2, ["Plast, ki dobro prevaja podzemno vodo?", "vodonosnik", "glinena plast", "nepropustna plast", "gladina podtalnice"], ["Layer that transmits groundwater well?", "aquifer", "clay layer", "aquiclude", "water table"]],
  [2, ["Vodonosnik pod nepropustno plastjo?", "zaprti (arteški)", "odprti (prosti)", "viseči", "nenasičeni"], ["Aquifer beneath an impermeable layer?", "confined", "unconfined", "perched", "unsaturated"]],
  [3, ["Vodonosnik nad lokalno nepropustno lečo?", "viseči", "zaprti (arteški)", "odprti (prosti)", "nenasičeni"], ["Aquifer above a local impermeable lens?", "perched", "confined", "unconfined", "unsaturated"]],
  [3, ["Sposobnost kamnine, da prevaja vodo?", "prepustnost", "poroznost", "gostota", "trdota"], ["Ability of rock to transmit water?", "permeability", "porosity", "density", "hardness"]],
  [3, ["Delež praznin v kamnini?", "poroznost", "prepustnost", "gostota", "vlažnost"], ["Share of void space in rock?", "porosity", "permeability", "density", "moisture"]],
  [3, ["Enota za pretok reke?", "m³/s", "m/s", "m³", "m²/s"], ["Unit of river discharge?", "m³/s", "m/s", "m³", "m²/s"]],
  [3, ["Odtok iz podtalnice med sušo?", "bazni odtok", "površinski odtok", "padavine", "evaporacija"], ["Groundwater-fed flow in a drought?", "baseflow", "surface runoff", "precipitation", "evaporation"]],
  [3, ["Čas od viška padavin do viška pretoka?", "čas zakasnitve", "povratna doba", "bazni odtok", "vrh hidrograma"], ["Time from peak rain to peak discharge?", "lag time", "return period", "baseflow", "peak flow"]],
];

const ATMOS = [
  [1, ["Najnižja plast ozračja?", "troposfera", "stratosfera", "mezosfera", "termosfera"], ["Lowest layer of the atmosphere?", "troposphere", "stratosphere", "mesosphere", "thermosphere"]],
  [1, ["Plast ozračja, v kateri je vreme?", "troposfera", "stratosfera", "mezosfera", "termosfera"], ["Atmospheric layer with the weather?", "troposphere", "stratosphere", "mesosphere", "thermosphere"]],
  [1, ["Ozonska plast je v?", "stratosferi", "troposferi", "mezosferi", "termosferi"], ["The ozone layer is in the?", "stratosphere", "troposphere", "mesosphere", "thermosphere"]],
  [1, ["Delež N₂ v suhem zraku ≈ ?", "78 %", "21 %", "1 %", "0,04 %"], ["N₂ in dry air ≈ ?", "78%", "21%", "1%", "0.04%"]],
  [1, ["Delež O₂ v suhem zraku ≈ ?", "21 %", "78 %", "1 %", "0,04 %"], ["O₂ in dry air ≈ ?", "21%", "78%", "1%", "0.04%"]],
  [1, ["Plinasta ovojnica Zemlje?", "atmosfera", "hidrosfera", "litosfera", "biosfera"], ["Earth's gaseous envelope?", "atmosphere", "hydrosphere", "lithosphere", "biosphere"]],
  [1, ["Katerega plina je v zraku največ?", "dušika", "kisika", "ogljikovega dioksida", "argona"], ["Most abundant gas in air?", "nitrogen", "oxygen", "carbon dioxide", "argon"]],
  [1, ["Pred UV sevanjem Sonca nas ščiti?", "ozonska plast", "magnetno polje", "dušik", "argon"], ["What shields us from solar UV?", "the ozone layer", "the magnetic field", "nitrogen", "argon"]],
  [2, ["Meteorji večinoma zgorijo v?", "mezosferi", "troposferi", "stratosferi", "eksosferi"], ["Meteors mostly burn up in the?", "mesosphere", "troposphere", "stratosphere", "exosphere"]],
  [2, ["Polarni sij nastaja predvsem v?", "termosferi", "troposferi", "stratosferi", "mezosferi"], ["Auroras form mainly in the?", "thermosphere", "troposphere", "stratosphere", "mesosphere"]],
  [2, ["Najhladnejša plast ozračja?", "mezosfera", "troposfera", "stratosfera", "termosfera"], ["Coldest layer of the atmosphere?", "mesosphere", "troposphere", "stratosphere", "thermosphere"]],
  [2, ["Mednarodna vesoljska postaja kroži v?", "termosferi", "stratosferi", "mezosferi", "troposferi"], ["The ISS orbits in the?", "thermosphere", "stratosphere", "mesosphere", "troposphere"]],
  [2, ["Delež Ar v suhem zraku ≈ ?", "0,9 %", "9 %", "21 %", "0,04 %"], ["Ar in dry air ≈ ?", "0.9%", "9%", "21%", "0.04%"]],
  [2, ["Delež CO₂ v zraku ≈ ?", "0,04 %", "0,4 %", "4 %", "21 %"], ["CO₂ in air ≈ ?", "0.04%", "0.4%", "4%", "21%"]],
  [2, ["Zračni tlak ob morju ≈ ?", "1013 hPa", "101,3 hPa", "1013 Pa", "760 hPa"], ["Sea-level air pressure ≈ ?", "1013 hPa", "101.3 hPa", "1013 Pa", "760 hPa"]],
  [3, ["Tropopavza nad ekvatorjem ≈ ?", "17 km", "8 km", "50 km", "100 km"], ["Tropopause above the equator ≈ ?", "17 km", "8 km", "50 km", "100 km"]],
  [3, ["Stratopavza ≈ ?", "50 km", "12 km", "85 km", "500 km"], ["Stratopause ≈ ?", "50 km", "12 km", "85 km", "500 km"]],
];

const GHG_FACTS = [
  [1, ["Plin, ki ga rastline vežejo pri fotosintezi?", "CO₂", "O₂", "N₂", "CH₄"], ["Gas plants take up in photosynthesis?", "CO₂", "O₂", "N₂", "CH₄"]],
  [1, ["Segrevanje ozračja zaradi plinov?", "učinek tople grede", "ozonska luknja", "kisli dež", "smog"], ["Warming of the air caused by gases?", "greenhouse effect", "ozone hole", "acid rain", "smog"]],
  [2, ["Plin, ki tanjša ozonsko plast?", "freoni (CFC)", "CO₂", "N₂", "Ar"], ["Gas that thins the ozone layer?", "CFCs", "CO₂", "N₂", "Ar"]],
  [2, ["Kisli dež povzroča predvsem?", "SO₂", "CH₄", "N₂", "Ar"], ["Acid rain is mainly caused by?", "SO₂", "CH₄", "N₂", "Ar"]],
  [1, ["Glavni vir antropogenega CO₂?", "fosilna goriva", "vulkani", "dihanje ljudi", "oceani"], ["Main source of human-made CO₂?", "fossil fuels", "volcanoes", "human breathing", "oceans"]],
  [2, ["Pomemben vir metana?", "prebava goveda", "vetrne elektrarne", "jedrske elektrarne", "fotosinteza"], ["Important source of methane?", "cattle digestion", "wind turbines", "nuclear plants", "photosynthesis"]],
  [2, ["Toplogredni plini vpijajo?", "infrardeče sevanje", "radijske valove", "rentgenske žarke", "gama žarke"], ["Greenhouse gases absorb?", "infrared radiation", "radio waves", "X-rays", "gamma rays"]],
  [3, ["CO₂ pred industrijsko dobo ≈ ?", "280 ppm", "420 ppm", "28 ppm", "2800 ppm"], ["Pre-industrial CO₂ ≈ ?", "280 ppm", "420 ppm", "28 ppm", "2800 ppm"]],
  [3, ["GWP (100 let) za CO₂?", "1", "0", "28", "100"], ["GWP (100 yr) of CO₂?", "1", "0", "28", "100"]],
];
const GHG = { items: [["CO₂", "CO₂"], ["CH₄", "CH₄"], ["N₂O", "N₂O"], ["vodna para", "water vapour"], ["O₃", "O₃"]] };
const NOT_GHG = { items: [["N₂", "N₂"], ["O₂", "O₂"], ["Ar", "Ar"], ["Ne", "Ne"]] };
const RENEW = { items: [["sončna energija", "solar"], ["vetrna energija", "wind"], ["vodna energija", "hydropower"], ["geotermija", "geothermal"], ["biomasa", "biomass"]] };
const NONRENEW = { items: [["premog", "coal"], ["nafta", "oil"], ["zemeljski plin", "natural gas"], ["uran", "uranium"]] };
const FOSSIL = { items: [["premog", "coal"], ["nafta", "oil"], ["zemeljski plin", "natural gas"]] };
const NONFOSSIL = { items: [["uran", "uranium"], ["les", "wood"], ["vodik", "hydrogen"], ["bioplin", "biogas"]] };
const PLANTS = [
  [1, ["Kraj jedrske elektrarne v Sloveniji?", "Krško", "Šoštanj", "Trbovlje", "Velenje"], ["Site of Slovenia's nuclear power plant?", "Krško", "Šoštanj", "Trbovlje", "Velenje"]],
  [1, ["Gorivo termoelektrarne Šoštanj?", "lignit", "uran", "nafta", "les"], ["Fuel of the Šoštanj power plant?", "lignite", "uranium", "oil", "wood"]],
  [1, ["Elektrarne na Dravi so?", "hidroelektrarne", "jedrske", "termoelektrarne", "vetrne"], ["Power plants on the Drava are?", "hydro", "nuclear", "coal-fired", "wind"]],
  [1, ["Gorivo jedrske elektrarne?", "uran", "premog", "zemeljski plin", "nafta"], ["Fuel of a nuclear power plant?", "uranium", "coal", "natural gas", "oil"]],
  [2, ["Energija iz toplote Zemljine notranjosti?", "geotermalna", "sončna", "vetrna", "plimska"], ["Energy from Earth's internal heat?", "geothermal", "solar", "wind", "tidal"]],
  [2, ["Naprava, ki svetlobo pretvori v elektriko?", "sončna celica", "sončni kolektor", "toplotna črpalka", "transformator"], ["Device turning light into electricity?", "solar cell", "solar collector", "heat pump", "transformer"]],
  [2, ["Izvorna energija vetra in vodnih tokov?", "Sonce", "Zemljino jedro", "Luna", "radioaktivnost"], ["Ultimate source of wind and hydro energy?", "the Sun", "Earth's core", "the Moon", "radioactivity"]],
];

// ---------- pojmi ----------
export const AREAS = [
  ["gl_zem", { sl: "Zgradba Zemlje in tektonika", en: "Earth structure and tectonics" }, "#b45309"],
  ["gl_kam", { sl: "Minerali in kamnine", en: "Minerals and rocks" }, "#78716c"],
  ["gl_cas", { sl: "Geološki čas in datiranje", en: "Geologic time and dating" }, "#a16207"],
  ["gl_pov", { sl: "Površje, kras in voda", en: "Landforms, karst and water" }, "#0891b2"],
  ["gl_okl", { sl: "Ozračje, podnebje in okolje", en: "Atmosphere, climate, environment" }, "#16a34a"],
];

export const CONCEPTS = [
  {
    id: "g_layers",
    area: "gl_zem",
    year: 13,
    name: { sl: "Zgradba Zemlje", en: "Earth's layers" },
    gen: (t, ctx) => bank(LAYERS, t, ctx),
  },
  {
    id: "g_plates",
    area: "gl_zem",
    year: 14,
    name: { sl: "Tektonika plošč", en: "Plate tectonics" },
    gen(t, ctx) {
      const sl = ctx.lang === "sl";
      if (t === 3 || (t === 2 && Math.random() < 0.4)) return bank(PLATE_FACTS, t, ctx);
      const f = pick(t === 1 ? FEATURES.filter((x) => x[2] < 3) : FEATURES);
      const a = SETTINGS[f[2]];
      const ws = SETTINGS.filter((s) => s !== a);
      return mk(sl ? `${f[0]}: tektonsko okolje?` : `${f[1]}: tectonic setting?`, sl ? a[0] : a[1], ws.map((s) => (sl ? s[0] : s[1])));
    },
  },
  {
    id: "g_quake",
    area: "gl_zem",
    year: 14,
    name: { sl: "Potresi in magnituda", en: "Earthquakes and magnitude" },
    gen(t, ctx) {
      const sl = ctx.lang === "sl";
      const x = (v) => (sl ? `${v}-krat` : `${v} times`);
      const m0 = R(3, 5); // največ M 9
      if (t === 1) {
        if (Math.random() < 0.4) return bank(QUAKE_FACTS, 1, ctx);
        const d = R(1, 3);
        const A = { 1: ["10", ["100", "≈ 32", "2", "1000"]], 2: ["100", ["1000", "20", "10", "≈ 64"]], 3: ["1000", ["≈ 32000", "30", "100", "10000"]] }[d];
        return mk(sl ? `M ${m0 + d} proti M ${m0}: kolikokrat večja amplituda?` : `M ${m0 + d} vs M ${m0}: amplitude ratio?`, x(A[0]), shuffle(A[1]).map(x));
      }
      if (t === 2) {
        const d = R(1, 2);
        const E = { 1: ["≈ 32", ["10", "100", "2", "1000"]], 2: ["1000", ["100", "≈ 64", "10000", "≈ 32"]] }[d];
        return mk(sl ? `M ${m0 + d} proti M ${m0}: kolikokrat večja energija?` : `M ${m0 + d} vs M ${m0}: energy ratio?`, x(E[0]), shuffle(E[1]).map(x));
      }
      const mode = R(0, 2);
      if (mode === 0) {
        const d = R(3, 4);
        const E = { 3: ["≈ 32000", ["1000", "≈ 96", "10⁶", "≈ 3200"]], 4: ["10⁶", ["10⁴", "≈ 128", "10⁵", "≈ 32000"]] }[d];
        return mk(sl ? `M ${m0 + d} proti M ${m0}: kolikokrat večja energija?` : `M ${m0 + d} vs M ${m0}: energy ratio?`, x(E[0]), shuffle(E[1]).map(x));
      }
      if (mode === 1) {
        const [d, e] = pick([[1, "≈ 32"], [2, "1000"], [4, "10⁶"]]);
        return mk(sl ? `Energija ${e}-krat večja: ΔM = ?` : `Energy ${e} times larger: ΔM = ?`, ctx.num(d), [1.5 * d, d + 1, d - 1, 2 * d].map(ctx.num));
      }
      const [d, A] = pick([[2, "100"], [3, "1000"], [4, "10⁴"]]);
      return mk(sl ? `Amplituda ${A}-krat večja: ΔM = ?` : `Amplitude ${A} times larger: ΔM = ?`, ctx.num(d), [1.5 * d, d + 1, d - 1, 2 * d].map(ctx.num));
    },
  },
  {
    id: "g_mohs",
    area: "gl_kam",
    year: 13,
    name: { sl: "Mohsova lestvica trdote", en: "Mohs hardness scale" },
    gen(t, ctx) {
      const sl = ctx.lang === "sl";
      const nm = (m) => (sl ? m[1] : m[3]);
      const gen = (m) => (sl ? m[2] : m[3]);
      if (t === 1) {
        const m = pick(MOHS);
        if (Math.random() < 0.5) {
          const near = shuffle([1, -1, 2, -2, 3, -3].map((k) => m[0] + k).filter((h) => h >= 1 && h <= 10));
          return mk(sl ? `Trdota ${m[2]} po Mohsu?` : `Mohs hardness of ${m[3]}?`, ctx.num(m[0]), near.map(ctx.num));
        }
        const near = shuffle(MOHS.filter((x) => x !== m && Math.abs(x[0] - m[0]) <= 3));
        return mk(sl ? `Mineral s trdoto ${m[0]} po Mohsu?` : `Mineral with Mohs hardness ${m[0]}?`, nm(m), near.map(nm));
      }
      if (t === 3 && Math.random() < 0.4) {
        return bank(
          [
            [3, ["Mohsova lestvica trdote je?", "relativna", "absolutna", "linearna", "kvantitativna"], ["The Mohs scale is?", "relative", "absolute", "linear", "quantitative"]],
            [3, ["Mineral, ki šumi z razredčeno HCl?", "kalcit", "kremen", "sadra", "ortoklaz"], ["Mineral that fizzes in dilute HCl?", "calcite", "quartz", "gypsum", "orthoclase"]],
            [3, ["Barva raze hematita?", "rdečerjava", "črna", "bela", "zelena"], ["Streak colour of hematite?", "reddish-brown", "black", "white", "green"]],
            [3, ["Barva raze pirita?", "zelenkasto črna", "zlata", "bela", "rdečerjava"], ["Streak colour of pyrite?", "greenish-black", "golden", "white", "reddish-brown"]],
            [3, ["Močno magneten mineral?", "magnetit", "hematit", "pirit", "kremen"], ["Strongly magnetic mineral?", "magnetite", "hematite", "pyrite", "quartz"]],
          ],
          3,
          ctx,
        );
      }
      // trše / mehkejše od … (na stopnji 3 sosednji minerali in isti mineral kot past)
      const harder = Math.random() < 0.5;
      const ref = [];
      if (t === 2) {
        for (const m of MOHS) ref.push([m[0], gen(m)]);
        ref.push([2.5, sl ? `nohta (${ctx.num(2.5)})` : `a fingernail (${ctx.num(2.5)})`]);
        ref.push([3.5, sl ? `bakrenega kovanca (${ctx.num(3.5)})` : `a copper coin (${ctx.num(3.5)})`]);
        ref.push([5.5, sl ? `stekla (${ctx.num(5.5)})` : `glass (${ctx.num(5.5)})`]);
        const ok = ref.filter((r) => (harder ? r[0] >= 4 && r[0] <= 9 : r[0] >= 2 && r[0] <= 7));
        const [h, name] = pick(ok);
        const right = MOHS.filter((m) => (harder ? m[0] > h : m[0] < h));
        const wrong = MOHS.filter((m) => (harder ? m[0] < h : m[0] > h));
        return mk(sl ? `Kaj je ${harder ? "trše" : "mehkejše"} od ${name}?` : `${harder ? "Harder" : "Softer"} than ${name}?`, nm(pick(right)), shuffle(wrong).map(nm));
      }
      const m = pick(MOHS.filter((x) => (harder ? x[0] >= 3 && x[0] <= 9 : x[0] >= 2 && x[0] <= 8)));
      const h = m[0];
      const right = MOHS.filter((x) => (harder ? x[0] > h && x[0] <= h + 2 : x[0] < h && x[0] >= h - 2));
      const wrong = [m, ...MOHS.filter((x) => (harder ? x[0] < h && x[0] >= h - 3 : x[0] > h && x[0] <= h + 3))];
      return mk(sl ? `Kaj je ${harder ? "trše" : "mehkejše"} od ${gen(m)}?` : `${harder ? "Harder" : "Softer"} than ${m[3]}?`, nm(pick(right)), wrong.map(nm));
    },
  },
  {
    id: "g_minerals",
    area: "gl_kam",
    year: 14,
    name: { sl: "Minerali: formule in skupine", en: "Minerals: formulas and groups" },
    gen(t, ctx) {
      const sl = ctx.lang === "sl";
      const nm = (m) => (sl ? m[0] : m[1]);
      const withF = MINERALS.filter((m) => m[2]);
      if (t === 1) {
        const m = pick(withF);
        return mk(sl ? `${cap(m[0])}: kemijska formula?` : `${cap(m[1])}: chemical formula?`, m[2], shuffle(withF.filter((x) => x !== m)).map((x) => x[2]));
      }
      if (t === 2) {
        if (Math.random() < 0.3) {
          return bank(
            [
              [2, ["Ruda živega srebra (Idrija)?", "cinabarit", "galenit", "sfalerit", "pirit"], ["Ore of mercury (Idrija)?", "cinnabar", "galena", "sphalerite", "pyrite"]],
              [2, ["Ruda svinca (Mežica)?", "galenit", "cinabarit", "sfalerit", "korund"], ["Ore of lead (Mežica)?", "galena", "cinnabar", "sphalerite", "corundum"]],
              [2, ["Ruda cinka?", "sfalerit", "galenit", "cinabarit", "halit"], ["Ore of zinc?", "sphalerite", "galena", "cinnabar", "halite"]],
              [2, ["Ruda železa?", "hematit", "galenit", "cinabarit", "halit"], ["Ore of iron?", "hematite", "galena", "cinnabar", "halite"]],
              [2, ["Ruda aluminija?", "boksit", "galenit", "pirit", "kalcit"], ["Ore of aluminium?", "bauxite", "galena", "pyrite", "calcite"]],
            ],
            2,
            ctx,
          );
        }
        const m = pick(withF);
        return mk(sl ? `${m[2]} je?` : `${m[2]} is?`, nm(m), shuffle(withF.filter((x) => x !== m && x[2] !== m[2])).map(nm));
      }
      const m = pick(MINERALS.filter((x) => x[3] >= 0));
      const g = GROUPS[m[3]];
      return mk(sl ? `${cap(m[0])}: skupina mineralov?` : `${cap(m[1])}: mineral class?`, sl ? g[0] : g[1], shuffle(GROUPS.filter((x) => x !== g)).map((x) => (sl ? x[0] : x[1])));
    },
  },
  {
    id: "g_rocks",
    area: "gl_kam",
    year: 13,
    name: { sl: "Vrste kamnin", en: "Rock types" },
    gen(t, ctx) {
      const sl = ctx.lang === "sl";
      if (t === 1) {
        const gi = R(0, 2);
        const q = [["Magmatska kamnina?", "Igneous rock?"], ["Sedimentna kamnina?", "Sedimentary rock?"], ["Metamorfna kamnina?", "Metamorphic rock?"]][gi];
        return memberOf(ROCKS, gi, ctx, q[0], q[1]);
      }
      if (t === 2) {
        const k = R(0, 3);
        if (k === 0) return memberOf([PLUTONIC, VOLCANIC], 0, ctx, "Globočnina?", "Plutonic (intrusive) rock?");
        if (k === 1) return memberOf([PLUTONIC, VOLCANIC], 1, ctx, "Predornina?", "Volcanic (extrusive) rock?");
        if (k === 2) return memberOf([CLASTIC, NONCLASTIC], 0, ctx, "Klastična sedimentna kamnina?", "Clastic sedimentary rock?");
        const gi = R(0, 2);
        const q = [["Magmatska kamnina?", "Igneous rock?"], ["Sedimentna kamnina?", "Sedimentary rock?"], ["Metamorfna kamnina?", "Metamorphic rock?"]][gi];
        return memberOf(ROCKS, gi, ctx, q[0], q[1]);
      }
      return bank(
        [
          [3, ["Marmor nastane iz?", "apnenca", "granita", "peščenjaka", "bazalta"], ["Marble forms from?", "limestone", "granite", "sandstone", "basalt"]],
          [3, ["Kvarcit nastane iz?", "peščenjaka", "apnenca", "bazalta", "granita"], ["Quartzite forms from?", "sandstone", "limestone", "basalt", "granite"]],
          [3, ["Amfibolit nastane predvsem iz?", "bazalta", "granita", "peščenjaka", "riolita"], ["Amphibolite mostly forms from?", "basalt", "granite", "sandstone", "rhyolite"]],
          [3, ["Serpentinit nastane iz?", "peridotita", "granita", "apnenca", "peščenjaka"], ["Serpentinite forms from?", "peridotite", "granite", "limestone", "sandstone"]],
          [3, ["Apnenec se metamorfozira v?", "marmor", "kvarcit", "gnajs", "skrilavec"], ["Limestone metamorphoses to?", "marble", "quartzite", "gneiss", "schist"]],
          [3, ["Kremenov peščenjak se metamorfozira v?", "kvarcit", "marmor", "serpentinit", "amfibolit"], ["Quartz sandstone metamorphoses to?", "quartzite", "marble", "serpentinite", "amphibolite"]],
          [3, ["Globočninski ustreznik bazalta?", "gabro", "granit", "diorit", "peridotit"], ["Plutonic equivalent of basalt?", "gabbro", "granite", "diorite", "peridotite"]],
          [3, ["Predorninski ustreznik granita?", "riolit", "bazalt", "andezit", "dacit"], ["Volcanic equivalent of granite?", "rhyolite", "basalt", "andesite", "dacite"]],
          [3, ["Predorninski ustreznik diorita?", "andezit", "bazalt", "riolit", "dacit"], ["Volcanic equivalent of diorite?", "andesite", "basalt", "rhyolite", "dacite"]],
          [3, ["Globočninski ustreznik riolita?", "granit", "gabro", "diorit", "peridotit"], ["Plutonic equivalent of rhyolite?", "granite", "gabbro", "diorite", "peridotite"]],
          [3, ["Sprijeti zaobljeni prodniki?", "konglomerat", "breča", "peščenjak", "glinavec"], ["Cemented rounded pebbles?", "conglomerate", "breccia", "sandstone", "claystone"]],
          [3, ["Sprijeti oglati drobci?", "breča", "konglomerat", "peščenjak", "glinavec"], ["Cemented angular fragments?", "breccia", "conglomerate", "sandstone", "claystone"]],
          [3, ["Sprijet pesek?", "peščenjak", "konglomerat", "glinavec", "laporovec"], ["Cemented sand?", "sandstone", "conglomerate", "claystone", "marlstone"]],
          [3, ["Kamnina iz CaMg(CO₃)₂?", "dolomit", "apnenec", "laporovec", "kvarcit"], ["Rock made of CaMg(CO₃)₂?", "dolostone", "limestone", "marlstone", "quartzite"]],
          [3, ["Kamnina iz kalcita in gline?", "laporovec", "peščenjak", "kvarcit", "granit"], ["Rock of calcite and clay?", "marlstone", "sandstone", "quartzite", "granite"]],
        ],
        3,
        ctx,
      );
    },
  },
  {
    id: "g_cycle",
    area: "gl_kam",
    year: 13,
    name: { sl: "Kroženje kamnin", en: "The rock cycle" },
    gen(t, ctx) {
      const P = ["magmatska kamnina", "sedimentna kamnina", "metamorfna kamnina", "magma", "sediment"];
      const Pe = ["igneous rock", "sedimentary rock", "metamorphic rock", "magma", "sediment"];
      const prod = (i) => ({ sl: P[i], en: Pe[i], w: [0, 1, 2, 3, 4].filter((k) => k !== i) });
      const it = (lvl, qs, qe, i) => {
        const p = prod(i);
        return [lvl, [qs, p.sl, ...p.w.map((k) => P[k])], [qe, p.en, ...p.w.map((k) => Pe[k])]];
      };
      return bank(
        [
          it(1, "Ohlajena in strjena magma → ?", "Cooled, solidified magma → ?", 0),
          it(1, "Sprijet in strjen sediment → ?", "Compacted, cemented sediment → ?", 1),
          it(1, "Visok tlak in temperatura brez taljenja → ?", "High pressure and heat, no melting → ?", 2),
          it(1, "Stopljena kamnina pod površjem → ?", "Molten rock underground → ?", 3),
          it(1, "Preperela in odnesena kamnina → ?", "Weathered and eroded rock → ?", 4),
          [2, ["Strjevanje magme?", "kristalizacija", "metamorfoza", "diageneza", "preperevanje"], ["Solidification of magma?", "crystallization", "metamorphism", "diagenesis", "weathering"]],
          [2, ["Sediment postane kamnina?", "diageneza", "metamorfoza", "kristalizacija", "erozija"], ["Sediment turns into rock?", "diagenesis", "metamorphism", "crystallization", "erosion"]],
          [1, ["Razpad kamnine na mestu?", "preperevanje", "erozija", "sedimentacija", "diageneza"], ["Breakdown of rock in place?", "weathering", "erosion", "deposition", "diagenesis"]],
          [1, ["Odnašanje razpadlega gradiva?", "erozija", "preperevanje", "sedimentacija", "kristalizacija"], ["Removal of broken material?", "erosion", "weathering", "deposition", "crystallization"]],
          [1, ["Odlaganje gradiva?", "sedimentacija", "erozija", "preperevanje", "metamorfoza"], ["Laying down of material?", "deposition", "erosion", "weathering", "metamorphism"]],
          [2, ["Preobrazba kamnine v trdnem stanju pri visoki T?", "metamorfoza", "kristalizacija", "taljenje", "sedimentacija"], ["Solid-state change of rock at high T?", "metamorphism", "crystallization", "melting", "deposition"]],
          [3, ["Metamorfoza ob vdoru magme?", "kontaktna", "regionalna", "udarna", "pokopna"], ["Metamorphism next to an intrusion?", "contact", "regional", "impact", "burial"]],
          [3, ["Metamorfoza v gorotvornih conah?", "regionalna", "kontaktna", "udarna", "pokopna"], ["Metamorphism in mountain belts?", "regional", "contact", "impact", "burial"]],
          [3, ["Metamorfoza ob udarcu meteorita?", "udarna", "kontaktna", "regionalna", "pokopna"], ["Metamorphism from a meteorite impact?", "impact", "contact", "regional", "burial"]],
          [3, ["Debela zrna v magmatski kamnini pomenijo?", "počasno ohlajanje", "hitro ohlajanje", "metamorfozo", "preperevanje"], ["Coarse grains in igneous rock mean?", "slow cooling", "fast cooling", "metamorphism", "weathering"]],
          [3, ["Steklasta tekstura (obsidian) pomeni?", "zelo hitro ohlajanje", "počasno ohlajanje", "metamorfozo", "diagenezo"], ["Glassy texture (obsidian) means?", "very fast cooling", "slow cooling", "metamorphism", "diagenesis"]],
          [3, ["Foliacija je značilna za?", "metamorfne kamnine", "globočnine", "evaporite", "premog"], ["Foliation is typical of?", "metamorphic rocks", "plutonic rocks", "evaporites", "coal"]],
        ],
        t,
        ctx,
      );
    },
  },
  {
    id: "g_time",
    area: "gl_cas",
    year: 14,
    name: { sl: "Geološka časovna lestvica", en: "Geologic time scale" },
    gen(t, ctx) {
      const sl = ctx.lang === "sl";
      const pn = (p) => (sl ? p[0] : p[1]);
      if (t === 1 || (t === 2 && Math.random() < 0.3)) {
        const p = pick(PER);
        const e = ERA[p[2]];
        return mk(sl ? `V katero ero spada ${p[0]}?` : `Era of the ${p[1]}?`, sl ? e[0] : e[1], ERA.filter((x) => x !== e).map((x) => (sl ? x[0] : x[1])));
      }
      if (t === 2 || Math.random() < 0.4) {
        const next = Math.random() < 0.5;
        const i = next ? R(0, PER.length - 2) : R(1, PER.length - 1);
        const a = PER[next ? i + 1 : i - 1];
        const ws = (next ? [i - 1, i + 2, i - 2, i + 3] : [i + 1, i - 2, i + 2, i - 3]).filter((k) => k >= 0 && k < PER.length).map((k) => pn(PER[k]));
        const p = PER[i];
        const q = sl ? `${cap(p[0])} → ${next ? "naslednja" : "prejšnja"} perioda?` : `${p[1]} → ${next ? "next" : "previous"} period?`;
        return mk(q, pn(a), ws, () => pn(pick(PER)));
      }
      return bank(TIME_FACTS, 3, ctx);
    },
  },
  {
    id: "g_halflife",
    area: "gl_cas",
    year: 14,
    name: { sl: "Radiometrično datiranje", en: "Radiometric dating" },
    gen(t, ctx) {
      const sl = ctx.lang === "sl";
      const pct = (x) => (sl ? `${ctx.num(Math.round(x * 100) / 100)} %` : `${ctx.num(Math.round(x * 100) / 100)}%`);
      if (t === 1) {
        if (Math.random() < 0.5) {
          const n = R(2, 5);
          return mk(sl ? `Po ${n} razpolovnih časih ostane?` : `After ${n} half-lives, what is left?`, `1/${2 ** n}`, shuffle([`1/${2 * n}`, `1/${n}`, `1/${2 ** (n + 1)}`, `1/${2 ** (n - 1)}`, `1/${n * n}`]), (i) => `1/${2 ** (n + 2 + i)}`);
        }
        const n = R(1, 4);
        const v = 100 / 2 ** n;
        const ws = [100 - v, 100 / 2 ** (n + 1), 100 / 2 ** (n - 1), Math.round((1000 / (2 * n + 1))) / 10].map(pct);
        return mk(sl ? `Po ${n} t½ ostane (v %)?` : `After ${n} half-li${n === 1 ? "fe" : "ves"}, % left?`, pct(v), shuffle(ws));
      }
      if (t === 2) {
        const [h, us, ue] = pick([[5730, "let", "yr"], [30, "let", "yr"], [1250, "mil. let", "Myr"], [700, "mil. let", "Myr"], [50, "let", "yr"]]);
        const u = sl ? us : ue;
        const n = R(1, 4);
        const f = 2 ** n;
        const ws = [f * h, (n + 1) * h, (n - 1) * h, h / f, (n + 2) * h].filter((x) => x > 0 && Number.isInteger(x)).map((x) => `${ctx.num(x)} ${u}`);
        return mk(sl ? `t½ = ${ctx.num(h)} ${u}, ostane 1/${f}: starost?` : `t½ = ${ctx.num(h)} ${u}, 1/${f} left: age?`, `${ctx.num(n * h)} ${u}`, ws);
      }
      const k = R(0, 2);
      if (k === 1) {
        const h = pick([700, 1250, 500, 100]), n = R(1, 3), r = 2 ** n - 1;
        const u = sl ? "mil. let" : "Myr";
        return mk(sl ? `t½ = ${h} ${u}, D/P = ${r}: starost?` : `t½ = ${h} ${u}, D/P = ${r}: age?`, `${ctx.num(n * h)} ${u}`, [r * h, (n + 1) * h, (r + 1) * h, h / (r + 1), (n + 2) * h, (n + 3) * h].filter((x) => x !== n * h && Number.isInteger(x)).map((x) => `${ctx.num(x)} ${u}`));
      }
      if (k === 2) {
        const n = R(1, 4), p = 100 / 2 ** n;
        const u = sl ? "let" : "yr";
        return mk(sl ? `Ostane ${ctx.num(p)} % ¹⁴C (t½ = 5730 let): starost?` : `${ctx.num(p)}% of ¹⁴C left (t½ = 5730 yr): age?`, `${ctx.num(n * 5730)} ${u}`, [2 ** n * 5730, (n + 1) * 5730, (n - 1) * 5730, (n + 2) * 5730, (n + 3) * 5730].filter((x) => x > 0).map((x) => `${ctx.num(x)} ${u}`));
      }
      const n = R(1, 4);
      const r = 2 ** n - 1;
      return mk(sl ? `Hčerinski : starševski = ${r} : 1. Koliko t½?` : `Daughter : parent = ${r} : 1. Half-lives?`, ctx.num(n), [r, n + 1, 2 ** n, n - 1].filter((x) => x >= 0).map(ctx.num), (i) => ctx.num(n + 2 + i));
    },
  },
  {
    id: "g_strat",
    area: "gl_cas",
    year: 14,
    name: { sl: "Stratigrafija in fosili", en: "Stratigraphy and fossils" },
    gen: (t, ctx) => bank(STRAT, t, ctx),
  },
  {
    id: "g_karst",
    area: "gl_pov",
    year: 13,
    name: { sl: "Kras", en: "Karst" },
    gen: (t, ctx) => bank(KARST, t, ctx),
  },
  {
    id: "g_erosion",
    area: "gl_pov",
    year: 13,
    name: { sl: "Preperevanje in erozija", en: "Weathering and erosion" },
    gen(t, ctx) {
      if (t >= 2 && Math.random() < 0.35) {
        const chem = Math.random() < 0.5;
        return memberOf([WEATHER_MECH, WEATHER_CHEM], chem ? 1 : 0, ctx, chem ? "Kemično preperevanje?" : "Mehansko preperevanje?", chem ? "Chemical weathering?" : "Mechanical weathering?");
      }
      return bank(EROSION, t, ctx);
    },
  },
  {
    id: "g_flow",
    area: "gl_pov",
    year: 14,
    name: { sl: "Pretok in vodna bilanca", en: "Discharge and water balance" },
    gen(t, ctx) {
      const sl = ctx.lang === "sl";
      const n = ctx.num;
      const nice = (x) => Math.abs(x * 100 - Math.round(x * 100)) < 1e-9;
      const u = (x, unit) => (nice(x) ? `${n(x)} ${unit}` : null);
      if (t === 1) {
        const v = pick([0.5, 1, 1.5, 2, 2.5, 3]);
        const A = R(2, 20) * 2;
        const Q = v * A;
        return mk(`v = ${n(v)} m/s, A = ${n(A)} m²: Q?`, u(Q, "m³/s"), [u(A / v, "m³/s"), u(A + v, "m³/s"), u(Q, "m/s"), u(Q * 2, "m³/s")], (i) => u(Q + (i + 1) * v, "m³/s"));
      }
      if (t === 2) {
        if (Math.random() < 0.5) {
          const w = R(4, 20), d = pick([1, 2, 3, 4]), v = pick([0.5, 1, 1.5, 2]);
          const Q = w * d * v;
          return mk(sl ? `Struga ${w} m × ${d} m, v = ${n(v)} m/s: Q?` : `Channel ${w} m × ${d} m, v = ${n(v)} m/s: Q?`, u(Q, "m³/s"), [u(w * v, "m³/s"), u((w + d) * v, "m³/s"), u(w * d, "m³/s"), u(Q * 2, "m³/s")], (i) => u(Q + (i + 1) * v, "m³/s"));
        }
        const P = R(8, 20) * 100, ET = R(3, 7) * 100;
        return mk(sl ? `P = ${P} mm, ET = ${ET} mm, ΔS = 0: odtok?` : `P = ${P} mm, ET = ${ET} mm, ΔS = 0: runoff?`, `${P - ET} mm`, [`${P + ET} mm`, `${ET} mm`, `${P} mm`, `${ET - P} mm`.replace("-", "−")]);
      }
      const k = R(0, 3);
      if (k === 0) {
        const c = pick([0.2, 0.25, 0.3, 0.4, 0.5, 0.6]);
        const P = pick([800, 1000, 1200, 1500, 2000]);
        const O = c * P;
        return mk(sl ? `P = ${P} mm, odtok ${n(O)} mm: koeficient odtoka?` : `P = ${P} mm, runoff ${n(O)} mm: runoff coefficient?`, n(c), [u(1 / c, ""), n(1 - c), n(c / 10), n(c * 10)].map((x) => (x ? x.trim() : x)));
      }
      if (k === 1) {
        const K = pick([5, 10, 20, 50, 100]), i = pick([0.01, 0.02, 0.05, 0.1]);
        const md = sl ? "m/dan" : "m/day";
        return mk(sl ? `K = ${K} ${md}, i = ${n(i)}: Darcyjeva hitrost q?` : `K = ${K} ${md}, i = ${n(i)}: Darcy flux q?`, u(K * i, md), [u(K / i, md), u(K + i, md), u(K * i * 10, md), u(K * i / 10, md)]);
      }
      if (k === 2) {
        const T = pick([2, 5, 10, 20, 50, 100, 1000]);
        const p = 100 / T;
        const pc = (x) => (sl ? `${n(x)} %` : `${n(x)}%`);
        return mk(sl ? `Povratna doba ${T} ${T === 2 ? "leti" : "let"}: letna verjetnost?` : `Return period ${T} yr: yearly probability?`, pc(p), [pc(p * 10), pc(p / 10), pc(100 - p), pc(T)]);
      }
      const Q = pick([2, 4, 5, 10, 20]), h = pick([1, 2]);
      const V = Q * 3600 * h;
      return mk(sl ? `Q = ${Q} m³/s, ${h} h: prostornina?` : `Q = ${Q} m³/s for ${h} h: volume?`, `${n(V)} m³`, [`${n(Q * 60 * h)} m³`, `${n(Q * h)} m³`, `${n(V * 24)} m³`, `${n(V / 10)} m³`]);
    },
  },
  {
    id: "g_water",
    area: "gl_pov",
    year: 13,
    name: { sl: "Kroženje vode in podzemna voda", en: "Water cycle and groundwater" },
    gen: (t, ctx) => bank(WATER, t, ctx),
  },
  {
    id: "g_atmos",
    area: "gl_okl",
    year: 13,
    name: { sl: "Plasti in sestava ozračja", en: "Atmosphere: layers and makeup" },
    gen(t, ctx) {
      const sl = ctx.lang === "sl";
      if (t === 3 && Math.random() < 0.5) {
        const h = R(1, 4), T0 = R(8, 30);
        const T = T0 - 6.5 * h;
        const c = (x) => `${ctx.num(x)} °C`;
        return mk(sl ? `T ob tleh ${T0} °C, h = ${h} km (${ctx.num(6.5)} °C/km): T?` : `Ground ${T0} °C, h = ${h} km (${ctx.num(6.5)} °C/km): T?`, c(T), [c(T0 + 6.5 * h), c(T0 - 10 * h), c(T0 - 0.65 * h), c(T0 - 6.5)]);
      }
      return bank(ATMOS, t, ctx);
    },
  },
  {
    id: "g_ghg",
    area: "gl_okl",
    year: 14,
    name: { sl: "Toplogredni plini in onesnaženje", en: "Greenhouse gases and pollution" },
    gen(t, ctx) {
      const sl = ctx.lang === "sl";
      const n = ctx.num;
      if (t === 1) {
        const k = R(0, 2);
        if (k === 2) return bank(GHG_FACTS, 1, ctx);
        return k ? memberOf([GHG, NOT_GHG], 0, ctx, "Toplogredni plin?", "Greenhouse gas?") : memberOf([GHG, NOT_GHG], 1, ctx, "Ni toplogredni plin?", "Not a greenhouse gas?");
      }
      if (t === 2) return Math.random() < 0.3 ? memberOf([GHG, NOT_GHG], 0, ctx, "Toplogredni plin?", "Greenhouse gas?") : bank(GHG_FACTS, 2, ctx);
      const k = R(0, 3);
      const pc = (x) => (sl ? `${n(x)} %` : `${n(x)}%`);
      if (k === 0) {
        const p = pick([280, 350, 400, 420, 1000, 2000]);
        return mk(`${p} ppm = ?`, pc(p / 1e4), [pc(p / 1e3), pc(p / 1e2), pc(p / 1e5)]);
      }
      if (k === 1) {
        const p = pick([0.03, 0.04, 0.05, 0.1, 1]);
        return mk(sl ? `${n(p)} % = ?` : `${n(p)}% = ?`, `${n(p * 1e4)} ppm`, [`${n(p * 1e3)} ppm`, `${n(p * 1e5)} ppm`, `${n(p * 1e2)} ppm`]);
      }
      if (k === 2) {
        const m = pick([3, 6, 12, 24, 30, 36, 60]);
        return mk(sl ? `Zgori ${m} t ogljika: koliko t CO₂?` : `${m} t of carbon burns: t of CO₂?`, `${n((m * 44) / 12)} t`, [`${n((m * 32) / 12)} t`, `${n(m)} t`, `${n(m * 44)} t`, `${n(m * 2)} t`]);
      }
      return bank(GHG_FACTS, 3, ctx);
    },
  },
  {
    id: "g_energy",
    area: "gl_okl",
    year: 13,
    name: { sl: "Viri energije", en: "Energy sources" },
    gen(t, ctx) {
      const sl = ctx.lang === "sl";
      const n = ctx.num;
      if (t === 1) {
        const k = R(0, 2);
        if (k === 2) return bank(PLANTS, 1, ctx);
        return k ? memberOf([RENEW, NONRENEW], 0, ctx, "Obnovljiv vir energije?", "Renewable energy source?") : memberOf([RENEW, NONRENEW], 1, ctx, "Neobnovljiv vir energije?", "Non-renewable energy source?");
      }
      if (t === 2) {
        const k = R(0, 2);
        if (k === 0) return memberOf([FOSSIL, NONFOSSIL], 0, ctx, "Fosilno gorivo?", "Fossil fuel?");
        if (k === 1) return bank(PLANTS, 2, ctx);
        return memberOf([FOSSIL, NONFOSSIL], 1, ctx, "Ni fosilno gorivo?", "Not a fossil fuel?");
      }
      const k = R(0, 2);
      if (k === 0) {
        const P = pick([2, 3, 4, 5, 10]), h = R(2, 8);
        return mk(sl ? `Sončna elektrarna ${P} kW, ${h} h: energija?` : `Solar plant ${P} kW for ${h} h: energy?`, `${n(P * h)} kWh`, [`${n(P + h)} kWh`, `${n(P * h * 1000)} kWh`, `${n(P * h * 60)} kWh`, `${n(Math.round((P / h) * 100) / 100)} kWh`]);
      }
      if (k === 1) {
        const E = R(2, 10) * 5;
        return mk(`${E} kWh = ?`, `${n(E * 3.6)} MJ`, [`${n(Math.round((E / 3.6) * 10) / 10)} MJ`, `${n(E * 3600)} MJ`, `${n(E * 36)} MJ`]);
      }
      const L = R(2, 12) * 5;
      return mk(sl ? `${L} L bencina (${n(2.3)} kg CO₂/L): izpust?` : `${L} L petrol (${n(2.3)} kg CO₂/L): emissions?`, `${n(L * 2.3)} kg`, [`${n(Math.round((L / 2.3) * 10) / 10)} kg`, `${n(L + 2.3)} kg`, `${n(L * 23)} kg`]);
    },
  },
];

// Učni načrti za regijske profile (public/regions.js).
//
// Teme regijskih poti so »preslikave« obstoječih tem: vsaka regijska tema navede
// osnovne teme (slovenske poti), iz katerih vzame generatorje nalog, lekcije,
// razlage in simulacije. Napredek se vodi na regijski temi.
//
//   INT: mednarodni angleški načrt po letih šolanja (6–12), sestavljen iz slovenskih
//        poti z angleškimi imeni (EN spodaj).
//   IN:  Indija, CBSE / NCERT, razredi 6–12, po poglavjih učbenikov NCERT
//        (racionalizirani načrt 2023; za 6. razred novi učbenik Ganita Prakash / Curiosity).
//
// OSNUTEK: razporeditev naj pred objavo preveri učitelj iz te države.
// Oblika teme: "Ime | cilji => OSNOVNA-POT/tema, ..." (brez "=>" tema nima vaj).

// ---------------------------------------------------------------- angleška imena
// Sklopi slovenskih poti.
export const EN_UNITS = {
  "Naravna števila": "Whole numbers",
  "Ulomki in decimalna števila": "Fractions and decimals",
  "Enačbe in neenačbe": "Equations and inequalities",
  Geometrija: "Geometry",
  Merjenje: "Measurement",
  "Obdelava podatkov": "Data handling",
  Deljivost: "Divisibility",
  Ulomki: "Fractions",
  "Sorazmerja in odstotki": "Ratio, proportion and percentages",
  Koti: "Angles",
  Trikotnik: "Triangles",
  Štirikotniki: "Quadrilaterals",
  "Racionalna števila": "Rational numbers",
  Potence: "Powers",
  "Kvadriranje in korenjenje": "Squares and square roots",
  "Pitagorov izrek": "Pythagoras' theorem",
  Izrazi: "Algebraic expressions",
  Enačbe: "Equations",
  "Krog in večkotniki": "Circles and polygons",
  "Linearna funkcija": "Linear functions",
  Podobnost: "Similarity",
  "Geometrijska telesa": "Solids",
  "Priprava na NPZ": "Revision",
  "Uvod v fiziko": "Introduction to physics",
  Svetloba: "Light",
  "Pogled v vesolje": "Earth and space",
  Sile: "Forces",
  "Gostota, tlak, vzgon": "Density, pressure and upthrust",
  Gibanje: "Motion",
  "Sila in gibanje": "Force and motion",
  "Delo in energija": "Work and energy",
  Toplota: "Heat",
  Elektrika: "Electricity",
  Magnetizem: "Magnetism",
  "Kemija je svet snovi": "Matter and materials",
  "Zgradba atoma in periodni sistem": "Atoms and the periodic table",
  "Povezovanje delcev": "Chemical bonding",
  "Kemijske reakcije": "Chemical reactions",
  "Elementi v periodnem sistemu": "Elements of the periodic table",
  "Kisline, baze, soli": "Acids, bases and salts",
  "Množina snovi in raztopine": "Amount of substance and solutions",
  Ogljikovodiki: "Hydrocarbons",
  "Kisikove organske spojine": "Organic compounds with oxygen",
  "Dušikove organske spojine": "Organic compounds with nitrogen",
  "Biološko pomembne spojine": "Biomolecules",
  Polimeri: "Polymers",
  "Množice in števila": "Sets and numbers",
  "Linearna funkcija, enačbe in neenačbe": "Linear functions, equations and inequalities",
  "Geometrija v ravnini": "Plane geometry",
  Statistika: "Statistics",
  "Potence in koreni": "Powers and roots",
  "Kompleksna števila": "Complex numbers",
  "Kvadratna funkcija": "Quadratic functions",
  "Eksponentna in logaritemska funkcija": "Exponential and logarithmic functions",
  "Podobnost in kotne funkcije": "Similarity and trigonometry",
  "Kotne funkcije": "Trigonometry",
  Vektorji: "Vectors",
  "Polinomi in racionalne funkcije": "Polynomials and rational functions",
  Stožnice: "Conic sections",
  "Zaporedja in vrste": "Sequences and series",
  Odvod: "Differentiation",
  Integral: "Integration",
  "Kombinatorika in verjetnost": "Combinatorics and probability",
  "Priprava na maturo": "Final exam revision",
  Kinematika: "Kinematics",
  Dinamika: "Dynamics",
  Tekočine: "Fluids",
  "Kroženje in gravitacija": "Circular motion and gravitation",
  "Nihanje in valovanje": "Oscillations and waves",
  Optika: "Optics",
  "Moderna fizika": "Modern physics",
  "Zgradba snovi": "Structure of matter",
  "Kemijsko računanje": "Chemical calculations",
  "Hitrost in ravnotežje": "Rates and equilibrium",
  "Kisline in baze": "Acids and bases",
  "Redoks in elektrokemija": "Redox and electrochemistry",
  "Organska kemija": "Organic chemistry",
  "Fizika in okolje": "Physics and the environment",
  Funkcije: "Functions",
  Astronomija: "Astronomy",
};

// Teme slovenskih poti: "Ime | cilji".
export const EN = {
  // MAT-OS-6
// nove teme (vrzeli po učnih načrtih, 2026-10-30)
  "MAT-OS-6/mnozice-in-diagrami": "Sets and diagrams | sort elements with Euler-Venn and Carroll diagrams, element, set, intersection and union in examples",
  "MAT-OS-9/tocke-premice-in-ravnine-v-prostoru": "Points, lines and planes in space | relative position of points, lines and planes, line perpendicular to a plane, distance from a point to a plane",
  "FIZ-OS-9/fizika-v-sodobnih-napravah": "Physics in modern devices | explain how a modern device works (GPS, laser, solar cell, nuclear power plant)",
  "MAT-SS-1/osnove-logike": "Basic logic | statements and connectives (negation, conjunction, disjunction, implication, equivalence), truth tables, tautologies, equivalent statements",
  "MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini": "The Cartesian plane | distance between two points, midpoint of a segment, area of a triangle from coordinates",
  "MAT-SS-2/funkcije-in-njihove-lastnosti": "Functions and their properties | domain, range, zeros, increasing and decreasing, even and odd, injective, composite and inverse functions",
  "MAT-SS-2/transformacije-grafov": "Transformations of graphs | translation, reflection in the axes and stretching of a graph",
  "MAT-SS-2/potencna-in-korenska-funkcija": "Power and root functions | graphs and properties of power functions with integer exponents, root function as inverse, modelling",
  "MAT-SS-4/matematicna-indukcija": "Mathematical induction | prove a statement for all natural numbers by induction (sums, divisibility, inequalities)",
  "FIZ-SS-1/navor-in-ravnovesje": "Torque and equilibrium | torque, lever arm, equilibrium of a rigid body, centre of mass, levers",
  "FIZ-SS-1/proznost": "Elasticity | Hooke's law, spring constant, springs in series and in parallel",
  "FIZ-SS-2/prevajanje-toplote-in-sevanje": "Heat conduction and radiation | heat flow, thermal conductivity, Stefan's law of radiation",
  "FIZ-SS-3/izmenicni-tok-in-nihajni-krog": "Alternating current and the LC circuit | sinusoidal voltage, effective value, oscillating circuit, natural frequency",
  "FIZ-SS-3/elektromagnetno-valovanje": "Electromagnetic waves | origin, spectrum, speed of light, c = λν",
  "FIZ-SS-4/osoncje-in-gibanje-planetov": "The Solar System and planetary motion | bodies in the Solar System, Kepler's laws, gravity and orbits",
  "FIZ-SS-4/zvezde-in-vesolje": "Stars and the universe | luminosity, Stefan's and Wien's laws, star temperature, fusion in stars, distances in space",
  "KEM-SS-2/lastnosti-elementov-v-periodnem-sistemu": "Properties of elements in the periodic table | metals, non-metals and metalloids, trends, acidic and basic oxides",
  "KEM-SS-2/alkalijske-kovine-in-halogeni": "Alkali metals and halogens | reactions with water and oxygen, halides, displacement of halogens",
  "KEM-SS-2/elementi-v-bioloskih-sistemih": "Elements in living systems | biogenic elements (C, H, O, N, P, S, Ca, Fe) and their compounds in living things",
  "KEM-SS-3/dusikove-organske-spojine": "Organic nitrogen compounds | amines, amides, amino acids, basicity of amines",
  "MAT-OS-6/zapis-in-urejanje-velikih-stevil": "Reading and ordering large numbers | read, write and order numbers to a million and beyond, rounding",
  "MAT-OS-6/racunske-operacije-in-lastnosti": "Operations and their properties | order of operations with brackets, laws of arithmetic",
  "MAT-OS-6/deljivost": "Divisibility | divisibility rules for 2, 3, 5, 9 and 10, even and odd numbers",
  "MAT-OS-6/veckratniki-in-delitelji": "Multiples and factors | find multiples and factors, powers as repeated multiplication",
  "MAT-OS-6/ulomek-kot-del-celote": "Fractions as parts of a whole | fractions on shapes and on the number line",
  "MAT-OS-6/desetiski-ulomki-in-decimalna-stevila": "Decimal fractions and decimals | convert between forms, order decimals",
  "MAT-OS-6/racunanje-z-decimalnimi-stevili": "Operations with decimals | add, subtract, multiply and divide decimals",
  "MAT-OS-6/preproste-enacbe": "Simple equations | solve by reasoning or trial and improvement",
  "MAT-OS-6/preproste-neenacbe": "Simple inequalities | find whole-number solutions",
  "MAT-OS-6/sklepni-racun": "Unitary method | solve problems with related quantities using a table",
  "MAT-OS-6/osnovni-geometrijski-pojmi": "Basic geometric ideas | point, line, ray, segment, parallel and perpendicular lines",
  "MAT-OS-6/kot": "Angles | draw, measure and classify angles",
  "MAT-OS-6/krog-in-kroznica": "Circles | centre, radius, diameter, chord",
  "MAT-OS-6/osnovne-konstrukcije": "Basic constructions | perpendicular bisector, angle bisector, perpendicular",
  "MAT-OS-6/simetrija": "Symmetry | reflection in a line, symmetric shapes",
  "MAT-OS-6/merske-enote": "Units of measurement | convert units of length, mass, time and volume",
  "MAT-OS-6/obseg-in-ploscina-pravokotnika-in-kvadrata": "Perimeter and area of rectangles and squares | calculate and use in word problems",
  "MAT-OS-6/kocka-in-kvader": "Cubes and cuboids | nets, surface area, volume",
  "MAT-OS-6/prikazi-podatkov": "Representing data | tables, bar charts and line graphs, reading charts",
  "MAT-OS-6/kombinatoricne-situacije": "Counting possibilities | tree diagrams, listing outcomes",
  // MAT-OS-7
  "MAT-OS-7/prastevila-in-razcep": "Prime numbers and prime factorisation | factor trees",
  "MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik": "HCF and LCM | highest common factor and lowest common multiple in fractions and word problems",
  "MAT-OS-7/razsirjanje-in-krajsanje-ulomkov": "Equivalent fractions | simplifying fractions",
  "MAT-OS-7/primerjanje-in-urejanje-ulomkov": "Comparing and ordering fractions | same and different denominators",
  "MAT-OS-7/sestevanje-in-odstevanje-ulomkov": "Adding and subtracting fractions | including mixed numbers",
  "MAT-OS-7/mnozenje-in-deljenje-ulomkov": "Multiplying and dividing fractions | reciprocals, mixed calculations",
  "MAT-OS-7/ulomki-v-besedilnih-nalogah": "Fractions in word problems | part of a whole, whole from a part",
  "MAT-OS-7/razmerje": "Ratio | simplifying ratios, sharing in a given ratio",
  "MAT-OS-7/premo-sorazmerje": "Direct proportion | tables, graphs, unitary method",
  "MAT-OS-7/obratno-sorazmerje": "Inverse proportion | recognise and use in problems",
  "MAT-OS-7/odstotni-racun": "Percentages | percentage of an amount, discounts and increases",
  "MAT-OS-7/vrste-kotov-in-pari-kotov": "Types and pairs of angles | adjacent, vertically opposite, angles on parallel lines",
  "MAT-OS-7/racunanje-s-koti": "Calculating with angles | degrees and minutes",
  "MAT-OS-7/vrste-trikotnikov-in-notranji-koti": "Types of triangles and interior angles | angle sum, exterior angles",
  "MAT-OS-7/konstrukcije-trikotnikov": "Constructing triangles | congruence conditions, constructions from given data",
  "MAT-OS-7/znacilne-tocke-trikotnika": "Special lines of a triangle | altitudes, medians, circumcircle and incircle",
  "MAT-OS-7/obseg-in-ploscina-trikotnika": "Perimeter and area of triangles | calculations and word problems",
  "MAT-OS-7/vrste-stirikotnikov": "Types of quadrilaterals | parallelogram, rhombus, trapezium, kite and their properties",
  "MAT-OS-7/konstrukcije-stirikotnikov": "Constructing quadrilaterals | from given data",
  "MAT-OS-7/obseg-in-ploscina-stirikotnikov": "Perimeter and area of quadrilaterals | parallelogram, trapezium, rhombus, kite",
  "MAT-OS-7/aritmeticna-sredina": "Mean | calculating and interpreting the average",
  "MAT-OS-7/tortni-prikaz": "Pie charts | reading and drawing",
  // MAT-OS-8
  "MAT-OS-8/cela-stevila": "Integers | number line, opposites, absolute value",
  "MAT-OS-8/racunanje-s-celimi-stevili": "Operations with integers | add, subtract, multiply, divide",
  "MAT-OS-8/racionalna-stevila": "Rational numbers | ordering and calculating, numerical expressions",
  "MAT-OS-8/potence-z-naravnimi-eksponenti": "Powers with whole-number exponents | notation, laws of indices",
  "MAT-OS-8/zapis-z-desetiskimi-potencami": "Standard form | very large and very small numbers",
  "MAT-OS-8/kvadrat-stevila": "Squares | squaring, estimating",
  "MAT-OS-8/kvadratni-koren": "Square roots | simplifying roots, estimating without a calculator",
  "MAT-OS-8/realna-stevila": "Real numbers | irrational numbers, the number line",
  "MAT-OS-8/pitagorov-izrek": "Pythagoras' theorem | find a missing side of a right-angled triangle",
  "MAT-OS-8/uporaba-pitagorovega-izreka": "Using Pythagoras' theorem | diagonals, heights, word problems",
  "MAT-OS-8/algebrski-izrazi": "Algebraic expressions | writing, evaluating, like terms",
  "MAT-OS-8/mnozenje-izrazov": "Multiplying expressions | expanding brackets, binomials",
  "MAT-OS-8/razstavljanje": "Factorising | taking out a common factor",
  "MAT-OS-8/linearne-enacbe": "Linear equations | solving and checking",
  "MAT-OS-8/besedilne-naloge-z-enacbami": "Word problems with equations | forming an equation from a story",
  "MAT-OS-8/obseg-in-ploscina-kroga": "Circumference and area of a circle | π and formulas",
  "MAT-OS-8/krozni-lok-in-krozni-izsek": "Arcs and sectors | arc length, sector area",
  "MAT-OS-8/veckotniki": "Polygons | interior angles, diagonals, regular polygons",
  // MAT-OS-9
  "MAT-OS-9/koordinatni-sistem-in-odvisnost-kolicin": "Coordinates and graphs | reading and drawing graphs of relationships",
  "MAT-OS-9/linearna-funkcija": "Linear functions | y = mx + c, gradient, intercept",
  "MAT-OS-9/graf-linearne-funkcije": "Graphs of linear functions | plotting, zero, intercepts with the axes",
  "MAT-OS-9/premica-v-ravnini": "Straight lines | parallel lines, line through two points",
  "MAT-OS-9/linearne-enacbe-z-ulomki": "Linear equations with fractions | clearing fractions, checking",
  "MAT-OS-9/linearne-neenacbe": "Linear inequalities | solving and showing solutions on a number line",
  "MAT-OS-9/besedilne-naloge": "Word problems | forming and solving equations",
  "MAT-OS-9/podobni-trikotniki": "Similar triangles | scale factor, similarity conditions",
  "MAT-OS-9/talesov-izrek": "Intercept theorem | dividing a segment, proportional segments",
  "MAT-OS-9/prizma": "Prisms | nets, surface area, volume",
  "MAT-OS-9/valj": "Cylinders | surface area, volume",
  "MAT-OS-9/piramida": "Pyramids | surface area, volume, heights",
  "MAT-OS-9/stozec": "Cones | surface area, volume",
  "MAT-OS-9/krogla": "Spheres | surface area and volume",
  "MAT-OS-9/statisticna-raziskava": "Statistics | collecting and presenting data, mean, median, mode",
  "MAT-OS-9/verjetnost": "Probability | experiments, events, simple probability",
  "MAT-OS-9/mesane-naloge-npz": "Mixed revision | all topics of lower secondary",
  // FIZ-OS-8
  "FIZ-OS-8/fizikalne-kolicine-in-enote": "Physical quantities and units | measuring, SI units, converting",
  "FIZ-OS-8/merske-napake": "Measurement errors | repeated measurements, average",
  "FIZ-OS-8/sirjenje-svetlobe": "How light travels | light sources, straight-line travel, shadows",
  "FIZ-OS-8/odboj-svetlobe": "Reflection of light | law of reflection, plane mirrors",
  "FIZ-OS-8/lom-svetlobe": "Refraction of light | refraction at a boundary, converging and diverging lenses",
  "FIZ-OS-8/nebo-in-osoncje": "The sky and the solar system | motion of the Earth and Moon, phases, eclipses",
  "FIZ-OS-8/sila-in-merjenje-sile": "Forces and measuring force | spring balance, the newton",
  "FIZ-OS-8/teza-in-masa": "Weight and mass | gravitational force, g = 9.81 N/kg",
  "FIZ-OS-8/sestavljanje-sil-in-ravnovesje": "Combining forces and equilibrium | resultant force, balanced forces",
  "FIZ-OS-8/trenje-in-upor": "Friction and drag | what they depend on",
  "FIZ-OS-8/gostota": "Density | ρ = m/V, measuring density",
  "FIZ-OS-8/tlak": "Pressure | p = F/A, pressure in liquids",
  "FIZ-OS-8/vzgon": "Upthrust | floating and sinking",
  "FIZ-OS-8/enakomerno-gibanje": "Uniform motion | speed, distance, time, distance–time and speed–time graphs",
  "FIZ-OS-8/pospeseno-gibanje": "Accelerated motion | acceleration, uniformly accelerated motion",
  // FIZ-OS-9
  "FIZ-OS-9/newtonovi-zakoni": "Newton's laws | inertia, F = m·a, action and reaction",
  "FIZ-OS-9/prosti-pad": "Free fall | acceleration due to gravity, falling objects",
  "FIZ-OS-9/delo": "Work | W = F·s, the joule",
  "FIZ-OS-9/kineticna-in-potencialna-energija": "Kinetic and potential energy | calculations, energy transfers",
  "FIZ-OS-9/moc-in-izkoristek": "Power and efficiency | P = W/t",
  "FIZ-OS-9/temperatura-in-notranja-energija": "Temperature and internal energy | thermometers, temperature scales",
  "FIZ-OS-9/toplota": "Heat | Q = m·c·ΔT, specific heat capacity",
  "FIZ-OS-9/prenos-toplote": "Heat transfer | conduction, convection, radiation",
  "FIZ-OS-9/elektricni-naboj": "Electric charge | charging by friction, forces between charges",
  "FIZ-OS-9/elektricni-tok-in-napetost": "Current and voltage | measuring with ammeter and voltmeter",
  "FIZ-OS-9/elektricni-krog": "Electric circuits | series and parallel circuits",
  "FIZ-OS-9/upor-in-ohmov-zakon": "Resistance and Ohm's law | V = I·R",
  "FIZ-OS-9/elektricno-delo-in-moc": "Electrical energy and power | P = V·I, energy use at home",
  "FIZ-OS-9/magneti-in-magnetno-polje": "Magnets and magnetic fields | Earth's magnetic field, compass",
  "FIZ-OS-9/elektromagnet": "Electromagnets | magnetic field of a coil",
  // KEM-OS-8
  "KEM-OS-8/varno-delo-v-laboratoriju": "Working safely in the laboratory | hazard symbols, rules",
  "KEM-OS-8/snovi-in-njihove-lastnosti": "Substances and their properties | pure substances and mixtures, separating mixtures",
  "KEM-OS-8/zgradba-atoma": "Structure of the atom | protons, neutrons, electrons, atomic and mass number",
  "KEM-OS-8/periodni-sistem": "The periodic table | groups, periods, metals and non-metals",
  "KEM-OS-8/razporeditev-elektronov": "Electron arrangement | shells, outer electrons",
  "KEM-OS-8/ionska-vez": "Ionic bonding | forming ions, ionic compounds",
  "KEM-OS-8/kovalentna-vez": "Covalent bonding | molecules, dot-and-cross diagrams",
  "KEM-OS-8/formule-spojin": "Chemical formulae | writing and naming simple compounds",
  "KEM-OS-8/kemijska-reakcija": "Chemical reactions | reactants, products, conservation of mass",
  "KEM-OS-8/urejanje-kemijskih-enacb": "Balancing chemical equations | coefficients",
  "KEM-OS-8/energija-pri-reakcijah": "Energy in reactions | exothermic and endothermic reactions",
  "KEM-OS-8/kovine": "Metals | properties, alkali and alkaline earth metals",
  "KEM-OS-8/nekovine": "Non-metals | halogens, noble gases",
  "KEM-OS-8/kisline-in-baze": "Acids and bases | properties, indicators",
  "KEM-OS-8/ph-lestvica": "The pH scale | measuring pH and what it means",
  "KEM-OS-8/nevtralizacija-in-soli": "Neutralisation and salts | how salts form",
  // KEM-OS-9
  "KEM-OS-9/mnozina-snovi": "The mole | molar mass, n = m/M",
  "KEM-OS-9/racunanje-z-mnozino-snovi": "Mole calculations | mass, amount and number of particles",
  "KEM-OS-9/raztopine": "Solutions | mass fraction, mass concentration",
  "KEM-OS-9/ogljik-in-organske-spojine": "Carbon and organic compounds | structure, bonds, formulae",
  "KEM-OS-9/alkani-alkeni-alkini": "Alkanes, alkenes and alkynes | naming, properties, isomers",
  "KEM-OS-9/nafta-in-zemeljski-plin": "Crude oil and natural gas | fuels, combustion",
  "KEM-OS-9/alkoholi": "Alcohols | ethanol, properties, effects on health",
  "KEM-OS-9/karboksilne-kisline-in-estri": "Carboxylic acids and esters | ethanoic acid, esters",
  "KEM-OS-9/amini-in-aminokisline": "Amines and amino acids | structure and importance",
  "KEM-OS-9/ogljikovi-hidrati": "Carbohydrates | glucose, starch, cellulose",
  "KEM-OS-9/mascobe": "Fats | structure and importance",
  "KEM-OS-9/beljakovine": "Proteins | structure and importance",
  "KEM-OS-9/polimeri": "Polymers | natural and synthetic, plastics and the environment",
  // MAT-SS-1
  "MAT-SS-1/mnozice": "Sets | set operations, Venn diagrams",
  "MAT-SS-1/naravna-in-cela-stevila": "Natural numbers and integers | divisibility, primes, HCF and LCM",
  "MAT-SS-1/racionalna-stevila": "Rational numbers | fractions, decimals, ordering",
  "MAT-SS-1/realna-stevila-in-intervali": "Real numbers and intervals | absolute value, interval notation",
  "MAT-SS-1/potence-z-naravnimi-in-celimi-eksponenti": "Powers with integer exponents | laws of indices",
  "MAT-SS-1/algebrski-izrazi": "Algebraic expressions | expanding, square and cube of a binomial",
  "MAT-SS-1/razstavljanje-izrazov": "Factorising expressions | common factors, difference of squares, quadratics",
  "MAT-SS-1/ulomljeni-izrazi": "Algebraic fractions | simplifying, adding, multiplying",
  "MAT-SS-1/linearna-funkcija": "Linear functions | graph, gradient, zero",
  "MAT-SS-1/linearne-enacbe": "Linear equations | including fractions and parameters",
  "MAT-SS-1/linearne-neenacbe": "Linear inequalities | solutions as intervals",
  "MAT-SS-1/sistemi-linearnih-enacb": "Simultaneous linear equations | substitution, elimination, graphical method",
  "MAT-SS-1/osnovni-geometrijski-pojmi": "Basic geometry | lines, angles, parallels",
  "MAT-SS-1/trikotnik": "Triangles | congruence, special points",
  "MAT-SS-1/stirikotniki-in-krog": "Quadrilaterals and circles | properties, areas, circle theorems",
  "MAT-SS-1/obdelava-podatkov": "Data handling | averages, measures of spread, charts",
  // MAT-SS-2
  "MAT-SS-2/koreni": "Surds | rules, simplifying, rationalising the denominator",
  "MAT-SS-2/potence-z-racionalnimi-eksponenti": "Rational exponents | link with roots",
  "MAT-SS-2/kompleksna-stevila": "Complex numbers | arithmetic, conjugate, modulus",
  "MAT-SS-2/kvadratna-funkcija": "Quadratic functions | forms, vertex, zeros, graph",
  "MAT-SS-2/kvadratna-enacba": "Quadratic equations | discriminant, sum and product of roots",
  "MAT-SS-2/kvadratna-neenacba": "Quadratic inequalities | solving with a graph",
  "MAT-SS-2/eksponentna-funkcija": "Exponential functions | graph, properties",
  "MAT-SS-2/eksponentne-enacbe": "Exponential equations | equal bases, substitution",
  "MAT-SS-2/logaritem": "Logarithms | laws of logarithms, change of base",
  "MAT-SS-2/logaritemska-funkcija-in-enacbe": "Logarithmic functions and equations | graph, domain",
  "MAT-SS-2/podobnost": "Similarity | similar triangles, Euclid's and altitude theorems",
  "MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku": "Trigonometry in right-angled triangles | sin, cos, tan, applications",
  // MAT-SS-3
  "MAT-SS-3/kotne-funkcije-poljubnega-kota": "Trigonometric functions of any angle | unit circle, radians",
  "MAT-SS-3/grafi-kotnih-funkcij": "Graphs of trigonometric functions | period, amplitude, shifts",
  "MAT-SS-3/adicijski-izreki": "Addition formulas | double angles, transforming expressions",
  "MAT-SS-3/trigonometrijske-enacbe": "Trigonometric equations | general solutions",
  "MAT-SS-3/sinusni-in-kosinusni-izrek": "Sine and cosine rules | solving any triangle",
  "MAT-SS-3/vektorji-v-ravnini-in-prostoru": "Vectors in the plane and in space | addition, scalar multiples",
  "MAT-SS-3/skalarni-produkt": "Dot product | angle between vectors, perpendicularity",
  "MAT-SS-3/polinomi": "Polynomials | division, remainder and factor theorems, zeros",
  "MAT-SS-3/graf-polinoma": "Graphs of polynomials | zeros and multiplicity, end behaviour",
  "MAT-SS-3/racionalne-funkcije": "Rational functions | poles, asymptotes, graphs",
  "MAT-SS-3/kroznica": "The circle | equation, line and circle",
  "MAT-SS-3/elipsa-hiperbola-parabola": "Ellipse, hyperbola, parabola | equations and graphs",
  "MAT-SS-3/povrsina-in-prostornina-teles": "Surface area and volume of solids | prism, pyramid, cylinder, cone, sphere",
  // MAT-SS-4
  "MAT-SS-4/zaporedja": "Sequences | properties, limit of a sequence",
  "MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje": "Arithmetic and geometric progressions | nth term, sum",
  "MAT-SS-4/geometrijska-vrsta": "Geometric series | convergence, sum to infinity",
  "MAT-SS-4/obrestni-racun": "Interest | simple and compound interest",
  "MAT-SS-4/limita-in-zveznost-funkcije": "Limits and continuity | evaluating limits",
  "MAT-SS-4/odvod": "Derivatives | definition, rules of differentiation",
  "MAT-SS-4/uporaba-odvoda": "Applications of derivatives | tangents, increasing functions, maxima and minima",
  "MAT-SS-4/nedoloceni-integral": "Indefinite integrals | standard integrals, substitution",
  "MAT-SS-4/doloceni-integral": "Definite integrals | area, volume of revolution",
  "MAT-SS-4/kombinatorika": "Permutations and combinations | counting principles",
  "MAT-SS-4/verjetnost": "Probability | events, addition and multiplication rules, conditional probability",
  "MAT-SS-4/statistika": "Statistics | normal distribution, data analysis",
  "MAT-SS-4/mesane-maturitetne-naloge": "Mixed exam practice | all years",
  // FIZ-SS-1
  "FIZ-SS-1/fizikalne-kolicine-in-enote": "Physical quantities and units | SI units, prefixes, converting",
  "FIZ-SS-1/merske-napake": "Measurement uncertainty | absolute and relative error, writing results",
  "FIZ-SS-1/premo-enakomerno-gibanje": "Uniform motion in a straight line | s–t and v–t graphs",
  "FIZ-SS-1/enakomerno-pospeseno-gibanje": "Uniformly accelerated motion | equations of motion, graphs",
  "FIZ-SS-1/prosti-pad-in-navpicni-met": "Free fall and vertical throw | motion under gravity",
  "FIZ-SS-1/vektorji-v-kinematiki": "Vectors in kinematics | adding velocities, horizontal projection",
  "FIZ-SS-1/sile": "Forces | types of forces, adding and resolving forces",
  "FIZ-SS-1/newtonovi-zakoni": "Newton's laws | applying them to moving bodies",
  "FIZ-SS-1/trenje": "Friction | static and kinetic friction, inclined plane",
  "FIZ-SS-1/gibalna-kolicina": "Momentum | impulse, collisions",
  "FIZ-SS-1/delo-in-moc": "Work and power | work done by a force, power",
  "FIZ-SS-1/energija": "Energy | kinetic, potential and elastic energy, conservation of energy",
  "FIZ-SS-1/tlak-in-vzgon": "Pressure and upthrust | hydrostatic pressure, Archimedes' principle",
  // FIZ-SS-2
  "FIZ-SS-2/enakomerno-krozenje": "Uniform circular motion | speed, centripetal acceleration",
  "FIZ-SS-2/gravitacijski-zakon": "Law of gravitation | planets and satellites",
  "FIZ-SS-2/temperatura-in-raztezanje": "Temperature and thermal expansion | linear and volume expansion",
  "FIZ-SS-2/plinska-enacba": "Gas laws | ideal gas equation",
  "FIZ-SS-2/notranja-energija-in-toplota": "Internal energy and heat | specific heat capacity, changes of state",
  "FIZ-SS-2/termodinamika": "Thermodynamics | first law, heat engines, efficiency",
  "FIZ-SS-2/elektricni-naboj-in-coulombov-zakon": "Electric charge and Coulomb's law | force between charges",
  "FIZ-SS-2/elektricno-polje": "Electric field | field strength, potential difference, capacitors",
  "FIZ-SS-2/elektricni-tok": "Electric current | current, resistance, Ohm's law",
  "FIZ-SS-2/elektricna-vezja": "Electric circuits | Kirchhoff's laws, series and parallel, power",
  // FIZ-SS-3
  "FIZ-SS-3/magnetno-polje": "Magnetic fields | flux density, field of a current-carrying wire",
  "FIZ-SS-3/magnetna-sila": "Magnetic force | force on a wire and on a moving charge",
  "FIZ-SS-3/indukcija": "Electromagnetic induction | induced emf, Lenz's law, transformers",
  "FIZ-SS-3/nihanje": "Oscillations | mass on a spring, simple pendulum, energy",
  "FIZ-SS-3/valovanje": "Waves | wavelength, frequency, speed, interference",
  "FIZ-SS-3/zvok": "Sound | loudness, Doppler effect",
  "FIZ-SS-3/geometrijska-optika": "Ray optics | reflection, refraction, total internal reflection, lenses",
  "FIZ-SS-3/valovna-optika": "Wave optics | diffraction, interference, polarisation",
  // FIZ-SS-4
  "FIZ-SS-4/fotoefekt-in-foton": "Photoelectric effect and photons | photon energy, work function",
  "FIZ-SS-4/atom": "The atom | energy levels, spectra",
  "FIZ-SS-4/jedro-in-radioaktivnost": "Nuclei and radioactivity | decay, half-life, nuclear energy",
  "FIZ-SS-4/mesane-maturitetne-naloge": "Mixed exam practice | all years",
  // KEM-SS-1
  "KEM-SS-1/zgradba-atoma": "Atomic structure | isotopes, electron configuration",
  "KEM-SS-1/periodni-sistem": "The periodic table | periodic trends, electronegativity",
  "KEM-SS-1/kemijske-vezi": "Chemical bonds | ionic, covalent, metallic, polarity",
  "KEM-SS-1/medmolekulske-sile": "Intermolecular forces | hydrogen bonding, effect on properties",
  "KEM-SS-1/mnozina-snovi": "The mole | molar mass, Avogadro constant",
  "KEM-SS-1/stehiometrija": "Stoichiometry | calculations from equations, limiting reactant",
  "KEM-SS-1/plini": "Gases | molar volume, ideal gas equation",
  "KEM-SS-1/raztopine": "Solutions | mass fraction, molar concentration, dilution",
  "KEM-SS-1/urejanje-enacb": "Balancing equations | types of reactions",
  "KEM-SS-1/energija-pri-reakcijah": "Energetics | enthalpy, exothermic and endothermic reactions",
  // KEM-SS-2
  "KEM-SS-2/hitrost-reakcij": "Rates of reaction | factors, catalysts",
  "KEM-SS-2/kemijsko-ravnotezje": "Chemical equilibrium | equilibrium constant, Le Chatelier's principle",
  "KEM-SS-2/kisline-in-baze": "Acids and bases | Brønsted–Lowry theory, conjugate pairs",
  "KEM-SS-2/ph": "pH | pH of strong acids and bases",
  "KEM-SS-2/sibke-kisline-in-baze": "Weak acids and bases | acid dissociation constant, buffers",
  "KEM-SS-2/titracija": "Titration | neutralisation, calculations",
  "KEM-SS-2/oksidacijska-stevila": "Oxidation numbers | assigning oxidation states",
  "KEM-SS-2/redoks-reakcije": "Redox reactions | balancing with half-equations",
  "KEM-SS-2/galvanski-cleni-in-elektroliza": "Electrochemical cells and electrolysis | standard electrode potentials",
  // KEM-SS-3
  "KEM-SS-3/ogljikovodiki": "Hydrocarbons | alkanes, alkenes, alkynes, arenes, naming",
  "KEM-SS-3/izomerija": "Isomerism | structural and stereoisomerism",
  "KEM-SS-3/halogenoalkani-in-alkoholi": "Haloalkanes and alcohols | properties, reactions",
  "KEM-SS-3/karbonilne-spojine": "Carbonyl compounds | aldehydes and ketones",
  "KEM-SS-3/karboksilne-kisline-in-derivati": "Carboxylic acids and derivatives | esters, amides",
  "KEM-SS-3/organske-reakcije": "Organic reactions | addition, substitution, elimination",
  "KEM-SS-3/ogljikovi-hidrati-lipidi-beljakovine": "Carbohydrates, lipids, proteins | structure and properties",
  "KEM-SS-3/polimeri": "Polymers | addition and condensation polymerisation",
  // KEM-SS-4
  "KEM-SS-4/splosna-in-anorganska-kemija": "General and inorganic chemistry | revision",
  "KEM-SS-4/organska-kemija": "Organic chemistry | revision",
  "KEM-SS-4/kemijsko-racunanje": "Chemical calculations | mixed calculation problems",
};

// ---------------------------------------------------------------- mednarodni načrt (INT)
// Leto šolanja → slovenske poti, iz katerih je sestavljena pot. Štiri letnike gimnazije
// stisnemo v tri leta (10–12); 12. leto dobi 3. in 4. letnik.
export const INT_LEVELS = {
  MAT: { 6: ["MAT-OS-6"], 7: ["MAT-OS-7"], 8: ["MAT-OS-8"], 9: ["MAT-OS-9"], 10: ["MAT-SS-1"], 11: ["MAT-SS-2"], 12: ["MAT-SS-3", "MAT-SS-4"] },
  FIZ: { 8: ["FIZ-OS-8"], 9: ["FIZ-OS-9"], 10: ["FIZ-SS-1"], 11: ["FIZ-SS-2"], 12: ["FIZ-SS-3", "FIZ-SS-4"] },
  KEM: { 8: ["KEM-OS-8"], 9: ["KEM-OS-9"], 10: ["KEM-SS-1"], 11: ["KEM-SS-2"], 12: ["KEM-SS-3", "KEM-SS-4"] },
};

export const SUBJECT_EN = { MAT: "Mathematics", FIZ: "Physics", KEM: "Chemistry" };

// ---------------------------------------------------------------- Indija: CBSE / NCERT
// Za razrede 6–10 je »Science« en predmet; v aplikaciji fizikalna poglavja sodijo pod FIZ,
// kemijska pod KEM (biološka poglavja aplikacija še nima).
export const IN_PATHS = {
  // ------------------------------------------------------------ MATEMATIKA
  "MAT-IN-6": {
    label: "Mathematics, Class 6",
    units: [
      ["Patterns in Mathematics", [
        "Number patterns | sequences of numbers and shapes, triangular and square numbers",
      ]],
      ["Lines and Angles", [
        "Points, lines, rays and line segments | basic geometric ideas => MAT-OS-6/osnovni-geometrijski-pojmi",
        "Angles | naming, measuring with a protractor, types of angles => MAT-OS-6/kot, MAT-OS-7/vrste-kotov-in-pari-kotov",
      ]],
      ["Number Play", [
        "Playing with numbers | large numbers, digit sums, estimation => MAT-OS-6/zapis-in-urejanje-velikih-stevil, MAT-OS-6/racunske-operacije-in-lastnosti",
      ]],
      ["Data Handling and Presentation", [
        "Collecting and presenting data | tally marks, pictographs, bar graphs => MAT-OS-6/prikazi-podatkov",
      ]],
      ["Prime Time", [
        "Factors and multiples | common factors and multiples => MAT-OS-6/veckratniki-in-delitelji",
        "Tests of divisibility | rules for 2, 3, 4, 5, 6, 9, 10 => MAT-OS-6/deljivost",
        "Prime numbers and prime factorisation | co-primes, factor trees => MAT-OS-7/prastevila-in-razcep",
      ]],
      ["Perimeter and Area", [
        "Perimeter and area | rectangles, squares, triangles => MAT-OS-6/obseg-in-ploscina-pravokotnika-in-kvadrata, MAT-OS-7/obseg-in-ploscina-trikotnika",
      ]],
      ["Fractions", [
        "Fractions as parts of a whole | fractions on the number line, mixed fractions => MAT-OS-6/ulomek-kot-del-celote",
        "Equivalent fractions and comparing fractions | simplest form => MAT-OS-7/razsirjanje-in-krajsanje-ulomkov, MAT-OS-7/primerjanje-in-urejanje-ulomkov",
        "Adding and subtracting fractions | like and unlike fractions => MAT-OS-7/sestevanje-in-odstevanje-ulomkov",
      ]],
      ["Playing with Constructions", [
        "Constructions with ruler and compass | circles, perpendiculars, squares and rectangles => MAT-OS-6/osnovne-konstrukcije, MAT-OS-6/krog-in-kroznica",
      ]],
      ["Symmetry", [
        "Line and rotational symmetry | lines of symmetry, symmetric figures => MAT-OS-6/simetrija",
      ]],
      ["The Other Side of Zero", [
        "Integers | negative numbers, the number line => MAT-OS-8/cela-stevila",
        "Adding and subtracting integers => MAT-OS-8/racunanje-s-celimi-stevili",
      ]],
    ],
  },
  "MAT-IN-7": {
    label: "Mathematics, Class 7",
    units: [
      ["Integers", [
        "Multiplication and division of integers | properties => MAT-OS-8/racunanje-s-celimi-stevili",
      ]],
      ["Fractions and Decimals", [
        "Multiplying and dividing fractions => MAT-OS-7/mnozenje-in-deljenje-ulomkov",
        "Fractions in word problems => MAT-OS-7/ulomki-v-besedilnih-nalogah",
        "Decimals | place value, comparing decimals => MAT-OS-6/desetiski-ulomki-in-decimalna-stevila",
        "Multiplying and dividing decimals => MAT-OS-6/racunanje-z-decimalnimi-stevili",
      ]],
      ["Data Handling", [
        "Mean, median and mode | representative values => MAT-OS-7/aritmeticna-sredina, MAT-OS-9/statisticna-raziskava",
        "Bar graphs and double bar graphs => MAT-OS-6/prikazi-podatkov",
        "Chance and probability | outcomes and likelihood => MAT-OS-9/verjetnost",
      ]],
      ["Simple Equations", [
        "Setting up and solving simple equations => MAT-OS-6/preproste-enacbe, MAT-OS-8/linearne-enacbe",
        "Applications of simple equations => MAT-OS-8/besedilne-naloge-z-enacbami",
      ]],
      ["Lines and Angles", [
        "Pairs of angles | complementary, supplementary, adjacent, vertically opposite => MAT-OS-7/vrste-kotov-in-pari-kotov",
        "Parallel lines and a transversal | corresponding, alternate, co-interior angles => MAT-OS-7/vrste-kotov-in-pari-kotov, MAT-OS-7/racunanje-s-koti",
      ]],
      ["The Triangle and its Properties", [
        "Angle sum and exterior angle property => MAT-OS-7/vrste-trikotnikov-in-notranji-koti",
        "Medians and altitudes => MAT-OS-7/znacilne-tocke-trikotnika",
        "Right-angled triangles and Pythagoras' property => MAT-OS-8/pitagorov-izrek",
      ]],
      ["Comparing Quantities", [
        "Ratio and proportion | equivalent ratios, unitary method => MAT-OS-7/razmerje, MAT-OS-7/premo-sorazmerje, MAT-OS-6/sklepni-racun",
        "Percentages, profit and loss => MAT-OS-7/odstotni-racun",
        "Simple interest => MAT-SS-4/obrestni-racun",
      ]],
      ["Rational Numbers", [
        "Rational numbers | on the number line, comparing, operations => MAT-OS-8/racionalna-stevila",
      ]],
      ["Perimeter and Area", [
        "Area of parallelograms and triangles => MAT-OS-7/obseg-in-ploscina-stirikotnikov, MAT-OS-7/obseg-in-ploscina-trikotnika",
        "Circumference and area of a circle => MAT-OS-8/obseg-in-ploscina-kroga",
      ]],
      ["Algebraic Expressions", [
        "Terms, like terms and the value of an expression => MAT-OS-8/algebrski-izrazi",
      ]],
      ["Exponents and Powers", [
        "Exponents and laws of exponents => MAT-OS-8/potence-z-naravnimi-eksponenti",
        "Large numbers in standard form => MAT-OS-8/zapis-z-desetiskimi-potencami",
      ]],
      ["Symmetry and Solid Shapes", [
        "Line and rotational symmetry => MAT-OS-6/simetrija",
        "Visualising solid shapes | faces, edges, vertices, nets => MAT-OS-6/kocka-in-kvader",
      ]],
    ],
  },
  "MAT-IN-8": {
    label: "Mathematics, Class 8",
    units: [
      ["Rational Numbers", [
        "Properties of rational numbers | closure, commutativity, additive and multiplicative inverse => MAT-OS-8/racionalna-stevila",
      ]],
      ["Linear Equations in One Variable", [
        "Solving linear equations | variables on both sides, fractions => MAT-OS-8/linearne-enacbe, MAT-OS-9/linearne-enacbe-z-ulomki",
        "Word problems with linear equations => MAT-OS-8/besedilne-naloge-z-enacbami, MAT-OS-9/besedilne-naloge",
      ]],
      ["Understanding Quadrilaterals", [
        "Polygons and their angle sum => MAT-OS-8/veckotniki",
        "Kinds of quadrilaterals | parallelogram, rhombus, rectangle, square, kite, trapezium => MAT-OS-7/vrste-stirikotnikov",
      ]],
      ["Data Handling", [
        "Grouped data and histograms => MAT-OS-9/statisticna-raziskava",
        "Pie charts => MAT-OS-7/tortni-prikaz",
        "Chance and probability => MAT-OS-9/verjetnost",
      ]],
      ["Squares and Square Roots", [
        "Squares and their patterns => MAT-OS-8/kvadrat-stevila",
        "Square roots | prime factorisation and estimation => MAT-OS-8/kvadratni-koren",
      ]],
      ["Cubes and Cube Roots", [
        "Cubes and cube roots | prime factorisation method => MAT-OS-7/prastevila-in-razcep, MAT-OS-8/potence-z-naravnimi-eksponenti",
      ]],
      ["Comparing Quantities", [
        "Percentages, discounts and sales tax => MAT-OS-7/odstotni-racun",
        "Compound interest => MAT-SS-4/obrestni-racun",
      ]],
      ["Algebraic Expressions and Identities", [
        "Multiplying algebraic expressions => MAT-OS-8/mnozenje-izrazov",
        "Standard identities | (a + b)², (a − b)², a² − b² => MAT-SS-1/algebrski-izrazi",
      ]],
      ["Mensuration", [
        "Area of trapeziums and polygons => MAT-OS-7/obseg-in-ploscina-stirikotnikov",
        "Surface area and volume of cubes, cuboids and cylinders => MAT-OS-6/kocka-in-kvader, MAT-OS-9/prizma, MAT-OS-9/valj",
      ]],
      ["Exponents and Powers", [
        "Negative exponents => MAT-SS-1/potence-z-naravnimi-in-celimi-eksponenti",
        "Small numbers in standard form => MAT-OS-8/zapis-z-desetiskimi-potencami",
      ]],
      ["Direct and Inverse Proportions", [
        "Direct proportion => MAT-OS-7/premo-sorazmerje",
        "Inverse proportion => MAT-OS-7/obratno-sorazmerje",
      ]],
      ["Factorisation", [
        "Factorisation | common factors, regrouping, identities => MAT-OS-8/razstavljanje, MAT-SS-1/razstavljanje-izrazov",
        "Division of algebraic expressions => MAT-SS-1/ulomljeni-izrazi",
      ]],
      ["Introduction to Graphs", [
        "Line graphs and linear graphs | coordinates => MAT-OS-9/koordinatni-sistem-in-odvisnost-kolicin",
      ]],
    ],
  },
  "MAT-IN-9": {
    label: "Mathematics, Class 9",
    units: [
      ["Number Systems", [
        "Rational and irrational numbers | decimal expansions, number line => MAT-OS-8/realna-stevila, MAT-SS-1/realna-stevila-in-intervali",
        "Operations on real numbers | surds, rationalising the denominator => MAT-SS-2/koreni",
        "Laws of exponents for real numbers => MAT-SS-2/potence-z-racionalnimi-eksponenti",
      ]],
      ["Polynomials", [
        "Polynomials and their zeroes => MAT-SS-3/polinomi",
        "Factorisation and algebraic identities => MAT-SS-1/algebrski-izrazi, MAT-SS-1/razstavljanje-izrazov",
      ]],
      ["Coordinate Geometry", [
        "The Cartesian plane | plotting points => MAT-OS-9/koordinatni-sistem-in-odvisnost-kolicin",
      ]],
      ["Linear Equations in Two Variables", [
        "Linear equations in two variables and their graphs => MAT-OS-9/linearna-funkcija, MAT-OS-9/graf-linearne-funkcije",
      ]],
      ["Euclid's Geometry, Lines and Angles", [
        "Euclid's axioms and postulates => MAT-SS-1/osnovni-geometrijski-pojmi",
        "Lines and angles | parallel lines and a transversal => MAT-OS-7/vrste-kotov-in-pari-kotov",
      ]],
      ["Triangles", [
        "Congruence of triangles | SAS, ASA, SSS, RHS => MAT-OS-7/konstrukcije-trikotnikov, MAT-SS-1/trikotnik",
        "Properties of isosceles triangles => MAT-OS-7/vrste-trikotnikov-in-notranji-koti",
      ]],
      ["Quadrilaterals", [
        "Properties of parallelograms and the mid-point theorem => MAT-OS-7/vrste-stirikotnikov, MAT-OS-9/talesov-izrek",
      ]],
      ["Circles", [
        "Chords, arcs and angles | cyclic quadrilaterals => MAT-SS-1/stirikotniki-in-krog",
      ]],
      ["Mensuration", [
        "Heron's formula => MAT-OS-7/obseg-in-ploscina-trikotnika",
        "Surface areas and volumes of cones and spheres => MAT-OS-9/stozec, MAT-OS-9/krogla",
      ]],
      ["Statistics", [
        "Presenting data and measures of central tendency => MAT-OS-9/statisticna-raziskava, MAT-SS-1/obdelava-podatkov",
      ]],
    ],
  },
  "MAT-IN-10": {
    label: "Mathematics, Class 10",
    units: [
      ["Real Numbers", [
        "Fundamental theorem of arithmetic | HCF and LCM => MAT-OS-7/prastevila-in-razcep, MAT-OS-7/najvecji-skupni-delitelj-in-najmanjsi-skupni-veckratnik",
        "Irrational numbers | proofs of irrationality => MAT-OS-8/realna-stevila",
      ]],
      ["Polynomials", [
        "Zeroes of a polynomial | relationship between zeroes and coefficients => MAT-SS-3/polinomi, MAT-SS-2/kvadratna-enacba",
      ]],
      ["Pair of Linear Equations in Two Variables", [
        "Graphical and algebraic methods | substitution, elimination => MAT-SS-1/sistemi-linearnih-enacb",
      ]],
      ["Quadratic Equations", [
        "Solving quadratic equations | factorisation, quadratic formula, nature of roots => MAT-SS-2/kvadratna-enacba",
      ]],
      ["Arithmetic Progressions", [
        "Arithmetic progressions | nth term, sum of first n terms => MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje",
      ]],
      ["Triangles", [
        "Similar triangles | basic proportionality theorem, criteria for similarity => MAT-OS-9/podobni-trikotniki, MAT-OS-9/talesov-izrek, MAT-SS-2/podobnost",
      ]],
      ["Coordinate Geometry", [
        "Distance formula and section formula => MAT-OS-8/uporaba-pitagorovega-izreka, MAT-OS-9/premica-v-ravnini",
      ]],
      ["Trigonometry", [
        "Trigonometric ratios and identities => MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku, MAT-SS-3/kotne-funkcije-poljubnega-kota",
        "Heights and distances => MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku",
      ]],
      ["Circles", [
        "Tangents to a circle => MAT-SS-3/kroznica",
        "Areas related to circles | sectors and segments => MAT-OS-8/krozni-lok-in-krozni-izsek, MAT-OS-8/obseg-in-ploscina-kroga",
      ]],
      ["Surface Areas and Volumes", [
        "Combinations of solids => MAT-SS-3/povrsina-in-prostornina-teles, MAT-OS-9/valj, MAT-OS-9/krogla",
      ]],
      ["Statistics and Probability", [
        "Mean, median and mode of grouped data => MAT-SS-1/obdelava-podatkov",
        "Classical probability => MAT-OS-9/verjetnost",
      ]],
    ],
  },
  "MAT-IN-11": {
    label: "Mathematics, Class 11",
    units: [
      ["Sets and Functions", [
        "Sets | subsets, Venn diagrams, operations on sets => MAT-SS-1/mnozice",
        "Relations and functions | Cartesian product, domain, range, graphs => MAT-OS-9/koordinatni-sistem-in-odvisnost-kolicin, MAT-SS-1/linearna-funkcija",
        "Trigonometric functions | radian measure, functions of any angle => MAT-SS-3/kotne-funkcije-poljubnega-kota, MAT-SS-3/grafi-kotnih-funkcij",
        "Sum and difference formulas => MAT-SS-3/adicijski-izreki",
      ]],
      ["Algebra", [
        "Complex numbers and quadratic equations => MAT-SS-2/kompleksna-stevila",
        "Linear inequalities => MAT-OS-9/linearne-neenacbe, MAT-SS-1/linearne-neenacbe",
        "Permutations and combinations => MAT-SS-4/kombinatorika",
        "Binomial theorem => MAT-SS-4/kombinatorika",
        "Sequences and series | AP and GP => MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje, MAT-SS-4/zaporedja",
      ]],
      ["Coordinate Geometry", [
        "Straight lines | slope, forms of the equation of a line => MAT-OS-9/premica-v-ravnini, MAT-SS-1/linearna-funkcija",
        "Conic sections | circle, parabola, ellipse, hyperbola => MAT-SS-3/kroznica, MAT-SS-3/elipsa-hiperbola-parabola",
        "Introduction to three-dimensional geometry => MAT-SS-3/vektorji-v-ravnini-in-prostoru",
      ]],
      ["Calculus", [
        "Limits => MAT-SS-4/limita-in-zveznost-funkcije",
        "Derivatives => MAT-SS-4/odvod",
      ]],
      ["Statistics and Probability", [
        "Statistics | mean deviation, variance, standard deviation => MAT-SS-1/obdelava-podatkov, MAT-SS-4/statistika",
        "Probability | events, axiomatic probability => MAT-SS-4/verjetnost",
      ]],
    ],
  },
  "MAT-IN-12": {
    label: "Mathematics, Class 12",
    units: [
      ["Relations and Functions", [
        "Types of relations and functions | composition, invertible functions",
        "Inverse trigonometric functions",
      ]],
      ["Algebra", [
        "Matrices | operations, transpose, symmetric matrices",
        "Determinants | area of a triangle, adjoint and inverse, systems of equations",
      ]],
      ["Calculus", [
        "Continuity and differentiability => MAT-SS-4/limita-in-zveznost-funkcije, MAT-SS-4/odvod",
        "Applications of derivatives | rate of change, increasing functions, maxima and minima => MAT-SS-4/uporaba-odvoda",
        "Integrals | methods of integration, definite integrals => MAT-SS-4/nedoloceni-integral, MAT-SS-4/doloceni-integral",
        "Applications of integrals | area under curves => MAT-SS-4/doloceni-integral",
        "Differential equations | order, degree, variable separable",
      ]],
      ["Vectors and Three-Dimensional Geometry", [
        "Vector algebra | dot and cross product => MAT-SS-3/vektorji-v-ravnini-in-prostoru, MAT-SS-3/skalarni-produkt",
        "Three-dimensional geometry | lines in space, angles, shortest distance => MAT-SS-3/vektorji-v-ravnini-in-prostoru",
      ]],
      ["Linear Programming", [
        "Linear programming | graphical method => MAT-SS-1/linearne-neenacbe",
      ]],
      ["Probability", [
        "Conditional probability, Bayes' theorem, random variables => MAT-SS-4/verjetnost",
      ]],
    ],
  },
  // ------------------------------------------------------------ FIZIKA (Science / Physics)
  "FIZ-IN-6": {
    label: "Science – Physics, Class 6",
    units: [
      ["Science, Class 6 (physics chapters)", [
        "Measurement of length and motion | standard units, types of motion => FIZ-OS-8/fizikalne-kolicine-in-enote, FIZ-OS-8/enakomerno-gibanje",
        "Exploring magnets | poles, magnetic and non-magnetic materials, compass => FIZ-OS-9/magneti-in-magnetno-polje",
        "Temperature and its measurement | thermometers, Celsius scale => FIZ-OS-9/temperatura-in-notranja-energija",
        "Beyond Earth | stars, constellations, the solar system => FIZ-OS-8/nebo-in-osoncje",
      ]],
    ],
  },
  "FIZ-IN-7": {
    label: "Science – Physics, Class 7",
    units: [
      ["Science, Class 7 (physics chapters)", [
        "Heat | temperature, conduction, convection, radiation => FIZ-OS-9/prenos-toplote, FIZ-OS-9/temperatura-in-notranja-energija",
        "Motion and time | speed, distance–time graphs => FIZ-OS-8/enakomerno-gibanje",
        "Electric current and its effects | circuits, heating and magnetic effects => FIZ-OS-9/elektricni-krog, FIZ-OS-9/elektromagnet",
        "Light | reflection, mirrors, lenses => FIZ-OS-8/sirjenje-svetlobe, FIZ-OS-8/odboj-svetlobe, FIZ-OS-8/lom-svetlobe",
      ]],
    ],
  },
  "FIZ-IN-8": {
    label: "Science – Physics, Class 8",
    units: [
      ["Science, Class 8 (physics chapters)", [
        "Force and pressure | contact and non-contact forces, pressure in fluids => FIZ-OS-8/sila-in-merjenje-sile, FIZ-OS-8/tlak",
        "Friction | factors, increasing and reducing friction => FIZ-OS-8/trenje-in-upor",
        "Sound | vibration, amplitude, frequency, hearing => FIZ-SS-3/zvok",
        "Chemical effects of electric current | conduction in liquids, electroplating => FIZ-OS-9/elektricni-tok-in-napetost",
        "Some natural phenomena | static charge, lightning, earthquakes => FIZ-OS-9/elektricni-naboj",
        "Light | laws of reflection, the human eye => FIZ-OS-8/odboj-svetlobe",
      ]],
    ],
  },
  "FIZ-IN-9": {
    label: "Science – Physics, Class 9",
    units: [
      ["Motion", [
        "Distance, displacement, speed and velocity => FIZ-OS-8/enakomerno-gibanje, FIZ-SS-1/premo-enakomerno-gibanje",
        "Acceleration and equations of motion | graphs of motion => FIZ-OS-8/pospeseno-gibanje, FIZ-SS-1/enakomerno-pospeseno-gibanje",
      ]],
      ["Force and Laws of Motion", [
        "Newton's laws of motion | inertia, F = ma => FIZ-OS-9/newtonovi-zakoni",
        "Momentum and its conservation => FIZ-SS-1/gibalna-kolicina",
      ]],
      ["Gravitation", [
        "Universal law of gravitation => FIZ-SS-2/gravitacijski-zakon",
        "Free fall, mass and weight => FIZ-OS-9/prosti-pad, FIZ-OS-8/teza-in-masa",
        "Thrust, pressure, buoyancy and density => FIZ-OS-8/tlak, FIZ-OS-8/vzgon, FIZ-OS-8/gostota",
      ]],
      ["Work and Energy", [
        "Work => FIZ-OS-9/delo",
        "Kinetic and potential energy, conservation of energy => FIZ-OS-9/kineticna-in-potencialna-energija",
        "Power => FIZ-OS-9/moc-in-izkoristek",
      ]],
      ["Sound", [
        "Sound waves | propagation, echo, ultrasound => FIZ-SS-3/zvok, FIZ-SS-3/valovanje",
      ]],
    ],
  },
  "FIZ-IN-10": {
    label: "Science – Physics, Class 10",
    units: [
      ["Light – Reflection and Refraction", [
        "Reflection and spherical mirrors | mirror formula, magnification => FIZ-OS-8/odboj-svetlobe, FIZ-SS-3/geometrijska-optika",
        "Refraction and lenses | refractive index, lens formula, power => FIZ-OS-8/lom-svetlobe, FIZ-SS-3/geometrijska-optika",
      ]],
      ["The Human Eye and the Colourful World", [
        "The human eye and defects of vision; dispersion and scattering of light => FIZ-SS-3/geometrijska-optika",
      ]],
      ["Electricity", [
        "Electric current and potential difference => FIZ-OS-9/elektricni-tok-in-napetost",
        "Ohm's law and resistance | resistivity => FIZ-OS-9/upor-in-ohmov-zakon",
        "Resistors in series and parallel => FIZ-OS-9/elektricni-krog, FIZ-SS-2/elektricna-vezja",
        "Heating effect of current and electric power => FIZ-OS-9/elektricno-delo-in-moc",
      ]],
      ["Magnetic Effects of Electric Current", [
        "Magnetic field and field lines | field of a straight wire, loop and solenoid => FIZ-OS-9/magneti-in-magnetno-polje, FIZ-SS-3/magnetno-polje",
        "Force on a current-carrying conductor | Fleming's left-hand rule, electric motor => FIZ-SS-3/magnetna-sila",
        "Electromagnetic induction and domestic circuits => FIZ-SS-3/indukcija, FIZ-OS-9/elektromagnet",
      ]],
    ],
  },
  "FIZ-IN-11": {
    label: "Physics, Class 11",
    units: [
      ["Mechanics", [
        "Units and measurements | SI units, significant figures, dimensions, errors => FIZ-SS-1/fizikalne-kolicine-in-enote, FIZ-SS-1/merske-napake",
        "Motion in a straight line => FIZ-SS-1/premo-enakomerno-gibanje, FIZ-SS-1/enakomerno-pospeseno-gibanje, FIZ-SS-1/prosti-pad-in-navpicni-met",
        "Motion in a plane | vectors, projectile motion, uniform circular motion => FIZ-SS-1/vektorji-v-kinematiki, FIZ-SS-2/enakomerno-krozenje",
        "Laws of motion | friction, momentum => FIZ-SS-1/newtonovi-zakoni, FIZ-SS-1/trenje, FIZ-SS-1/gibalna-kolicina",
        "Work, energy and power | collisions => FIZ-SS-1/delo-in-moc, FIZ-SS-1/energija",
        "System of particles and rotational motion | centre of mass, torque, moment of inertia => FIZ-SS-1/gibalna-kolicina",
        "Gravitation | Kepler's laws, satellites, escape speed => FIZ-SS-2/gravitacijski-zakon",
      ]],
      ["Properties of Matter", [
        "Mechanical properties of solids | stress, strain, Hooke's law",
        "Mechanical properties of fluids | pressure, Bernoulli's principle, viscosity => FIZ-SS-1/tlak-in-vzgon",
        "Thermal properties of matter | expansion, calorimetry, heat transfer => FIZ-SS-2/temperatura-in-raztezanje, FIZ-SS-2/notranja-energija-in-toplota",
      ]],
      ["Thermodynamics and Kinetic Theory", [
        "Thermodynamics | first and second law, heat engines => FIZ-SS-2/termodinamika",
        "Kinetic theory of gases => FIZ-SS-2/plinska-enacba",
      ]],
      ["Oscillations and Waves", [
        "Oscillations | simple harmonic motion, pendulum => FIZ-SS-3/nihanje",
        "Waves | transverse and longitudinal waves, standing waves, beats => FIZ-SS-3/valovanje, FIZ-SS-3/zvok",
      ]],
    ],
  },
  "FIZ-IN-12": {
    label: "Physics, Class 12",
    units: [
      ["Electrostatics", [
        "Electric charges and fields | Coulomb's law, Gauss's law => FIZ-SS-2/elektricni-naboj-in-coulombov-zakon, FIZ-SS-2/elektricno-polje",
        "Electrostatic potential and capacitance => FIZ-SS-2/elektricno-polje",
      ]],
      ["Current Electricity", [
        "Current electricity | Ohm's law, Kirchhoff's rules, Wheatstone bridge => FIZ-SS-2/elektricni-tok, FIZ-SS-2/elektricna-vezja",
      ]],
      ["Magnetism", [
        "Moving charges and magnetism | Biot–Savart law, Ampère's law, force on charges => FIZ-SS-3/magnetno-polje, FIZ-SS-3/magnetna-sila",
        "Magnetism and matter => FIZ-SS-3/magnetno-polje",
      ]],
      ["Electromagnetic Induction and Alternating Current", [
        "Electromagnetic induction | Faraday's and Lenz's laws, self- and mutual inductance => FIZ-SS-3/indukcija",
        "Alternating current | LCR circuits, transformers => FIZ-SS-3/indukcija",
        "Electromagnetic waves | the electromagnetic spectrum => FIZ-SS-3/valovanje",
      ]],
      ["Optics", [
        "Ray optics and optical instruments => FIZ-SS-3/geometrijska-optika",
        "Wave optics | Huygens' principle, interference, diffraction => FIZ-SS-3/valovna-optika",
      ]],
      ["Modern Physics", [
        "Dual nature of radiation and matter | photoelectric effect => FIZ-SS-4/fotoefekt-in-foton",
        "Atoms | Bohr model, hydrogen spectrum => FIZ-SS-4/atom",
        "Nuclei | binding energy, fission and fusion => FIZ-SS-4/jedro-in-radioaktivnost",
        "Semiconductor electronics | p-n junction, diodes",
      ]],
    ],
  },
  // ------------------------------------------------------------ KEMIJA (Science / Chemistry)
  "KEM-IN-6": {
    label: "Science – Chemistry, Class 6",
    units: [
      ["Science, Class 6 (chemistry chapters)", [
        "Materials around us | properties and grouping of materials => KEM-OS-8/snovi-in-njihove-lastnosti",
        "A journey through states of water | evaporation, condensation, the water cycle => KEM-OS-8/snovi-in-njihove-lastnosti",
        "Methods of separation in everyday life | filtration, evaporation, sieving => KEM-OS-8/snovi-in-njihove-lastnosti",
      ]],
    ],
  },
  "KEM-IN-7": {
    label: "Science – Chemistry, Class 7",
    units: [
      ["Science, Class 7 (chemistry chapters)", [
        "Acids, bases and salts | indicators, neutralisation => KEM-OS-8/kisline-in-baze, KEM-OS-8/nevtralizacija-in-soli",
        "Physical and chemical changes | rusting, crystallisation => KEM-OS-8/kemijska-reakcija",
      ]],
    ],
  },
  "KEM-IN-8": {
    label: "Science – Chemistry, Class 8",
    units: [
      ["Science, Class 8 (chemistry chapters)", [
        "Materials: metals and non-metals | properties and uses => KEM-OS-8/kovine, KEM-OS-8/nekovine",
        "Coal and petroleum | fossil fuels => KEM-OS-9/nafta-in-zemeljski-plin",
        "Combustion and flame | fuels, calorific value => KEM-OS-8/energija-pri-reakcijah",
        "Synthetic fibres and plastics => KEM-OS-9/polimeri",
      ]],
    ],
  },
  "KEM-IN-9": {
    label: "Science – Chemistry, Class 9",
    units: [
      ["Matter", [
        "Matter in our surroundings | states of matter, change of state => KEM-OS-8/snovi-in-njihove-lastnosti",
        "Is matter around us pure? | mixtures, solutions, concentration, separation => KEM-OS-8/snovi-in-njihove-lastnosti, KEM-OS-9/raztopine",
      ]],
      ["Atoms and Molecules", [
        "Laws of chemical combination, atoms and molecules, chemical formulae => KEM-OS-8/formule-spojin",
        "Molecular mass and the mole concept => KEM-OS-9/mnozina-snovi, KEM-OS-9/racunanje-z-mnozino-snovi",
      ]],
      ["Structure of the Atom", [
        "Atomic models, electrons, protons and neutrons => KEM-OS-8/zgradba-atoma",
        "Electron distribution and valency; isotopes => KEM-OS-8/razporeditev-elektronov",
      ]],
    ],
  },
  "KEM-IN-10": {
    label: "Science – Chemistry, Class 10",
    units: [
      ["Chemical Reactions and Equations", [
        "Chemical equations and balancing => KEM-OS-8/kemijska-reakcija, KEM-OS-8/urejanje-kemijskih-enacb",
        "Types of chemical reactions | combination, decomposition, displacement, redox => KEM-OS-8/kemijska-reakcija",
      ]],
      ["Acids, Bases and Salts", [
        "Acids and bases | indicators, reactions => KEM-OS-8/kisline-in-baze",
        "The pH scale => KEM-OS-8/ph-lestvica",
        "Salts and their uses => KEM-OS-8/nevtralizacija-in-soli",
      ]],
      ["Metals and Non-metals", [
        "Properties of metals and non-metals, reactivity series => KEM-OS-8/kovine, KEM-OS-8/nekovine",
        "Ionic compounds => KEM-OS-8/ionska-vez",
      ]],
      ["Carbon and its Compounds", [
        "Covalent bonding in carbon compounds => KEM-OS-8/kovalentna-vez, KEM-OS-9/ogljik-in-organske-spojine",
        "Hydrocarbons, homologous series and naming => KEM-OS-9/alkani-alkeni-alkini",
        "Ethanol and ethanoic acid => KEM-OS-9/alkoholi, KEM-OS-9/karboksilne-kisline-in-estri",
      ]],
    ],
  },
  "KEM-IN-11": {
    label: "Chemistry, Class 11",
    units: [
      ["Physical Chemistry", [
        "Some basic concepts of chemistry | mole concept, stoichiometry, concentration => KEM-SS-1/mnozina-snovi, KEM-SS-1/stehiometrija, KEM-SS-1/raztopine",
        "Structure of atom | quantum numbers, electronic configuration => KEM-SS-1/zgradba-atoma",
        "Classification of elements and periodicity in properties => KEM-SS-1/periodni-sistem",
        "Chemical bonding and molecular structure | VSEPR, hybridisation, hydrogen bonding => KEM-SS-1/kemijske-vezi, KEM-SS-1/medmolekulske-sile",
        "Thermodynamics | enthalpy, Hess's law, entropy, Gibbs energy => KEM-SS-1/energija-pri-reakcijah",
        "Equilibrium | chemical and ionic equilibrium, pH, buffers => KEM-SS-2/kemijsko-ravnotezje, KEM-SS-2/ph, KEM-SS-2/sibke-kisline-in-baze",
        "Redox reactions | oxidation numbers, balancing => KEM-SS-2/oksidacijska-stevila, KEM-SS-2/redoks-reakcije",
      ]],
      ["Organic Chemistry", [
        "Organic chemistry – some basic principles and techniques | isomerism, reaction mechanisms => KEM-SS-3/izomerija, KEM-SS-3/organske-reakcije",
        "Hydrocarbons | alkanes, alkenes, alkynes, aromatic hydrocarbons => KEM-SS-3/ogljikovodiki",
      ]],
    ],
  },
  "KEM-IN-12": {
    label: "Chemistry, Class 12",
    units: [
      ["Physical Chemistry", [
        "Solutions | concentration, colligative properties => KEM-SS-1/raztopine",
        "Electrochemistry | electrochemical cells, Nernst equation, electrolysis => KEM-SS-2/galvanski-cleni-in-elektroliza",
        "Chemical kinetics | rate laws, order, activation energy => KEM-SS-2/hitrost-reakcij",
      ]],
      ["Inorganic Chemistry", [
        "The d- and f-block elements",
        "Coordination compounds | nomenclature, bonding, isomerism",
      ]],
      ["Organic Chemistry", [
        "Haloalkanes and haloarenes => KEM-SS-3/halogenoalkani-in-alkoholi",
        "Alcohols, phenols and ethers => KEM-SS-3/halogenoalkani-in-alkoholi",
        "Aldehydes, ketones and carboxylic acids => KEM-SS-3/karbonilne-spojine, KEM-SS-3/karboksilne-kisline-in-derivati",
        "Amines => KEM-OS-9/amini-in-aminokisline",
        "Biomolecules | carbohydrates, proteins, nucleic acids => KEM-SS-3/ogljikovi-hidrati-lipidi-beljakovine",
      ]],
    ],
  },
};

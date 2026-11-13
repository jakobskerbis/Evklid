// Priprave na izpite po državah (podatki). Izpiti po regijah so v exam-data-si.js (NPZ, matura),
// exam-data-southasia.js, exam-data-asia.js, exam-data-africa.js in exam-data-west.js; tu so banka,
// skupni sklopi in Indija. Nov izpit je samo podatek (brez nove kode).
//
// BANK: teme z angleškimi izpitnimi nalogami (practice/generators/exam-*.js). Niso učna pot,
// izpitne teme jih uporabijo kot osnovo.
// EXAMS: izpit → predmeti → sklopi tem ("Ime | cilji => osnovna tema, osnovna tema").
// Osnovne teme so lahko slovenske (naloge v slovenščini, večinoma sam račun) ali iz banke.
// mock: poskusni izpit na čas v formatu izpita (izbirna vprašanja, številski odgovori,
// točke in negativne točke). OSNUTEK: format in teme naj pred objavo preveri učitelj.

import { M, F, K, Bi, group } from "./exam-helpers.js";
import { EXAMS_ASIA } from "./exam-data-asia.js";
import { EXAMS_AFRICA } from "./exam-data-africa.js";
import { EXAMS_SOUTHASIA } from "./exam-data-southasia.js";
import { EXAMS_WEST } from "./exam-data-west.js";
import { EXAMS_SI } from "./exam-data-si.js";

export const BANK = {
  "MAT-EXB": [
    "Quadratic equations | roots, factorising, sum and product of roots",
    "Systems of linear equations | elimination, substitution, word problems",
    "Exponential growth and decay | compound interest, half-life, growth factor",
    "Right-triangle trigonometry | sine, cosine, tangent, angles of elevation",
    "Arithmetic progressions | nth term, sum of n terms",
    "Geometric progressions | nth term, sum, sum to infinity",
    "Statistics: mean, median | mean, median, missing value",
    "Logarithms | evaluating logs, log laws, log equations",
    "Functions | evaluating, composition, inverse",
    "Quadratic inequalities | linear and quadratic inequalities, integer solutions",
    "Trigonometric identities | special angles, Pythagorean identity, double angle",
    "Coordinate geometry | distance, slope, equation of a line",
    "Permutations and combinations | arrangements, selections, at least one",
    "Differentiation | derivatives, tangent lines, maxima and minima",
    "Integration | definite integrals, area between curves",
    "Complex numbers | modulus, multiplication, powers",
    "Vectors | dot product, magnitude, perpendicular vectors",
    "Matrices and determinants | 2×2 and 3×3 determinants, singular matrices",
    "Probability | dice, drawing without replacement, complement",
    "Ratios, rates and percentages | percent, percent change, sharing in a ratio",
    "Circles | area, equation of a circle, sectors",
    "Binomial distribution | exactly k successes, at most one, variance",
    // Indija (CBSE, ICSE/ISC, državne šole, JEE): exam-in-mat.js, angleško in hindijsko.
    "Real numbers | HCF and LCM, prime factorisation, Euclid's division lemma",
    "Polynomials | zeros and coefficients, remainder and factor theorem",
    "Similar triangles | basic proportionality theorem, areas of similar triangles, Pythagoras",
    "Surface areas and volumes | cylinder, cone, sphere, combined solids, recasting",
    "Statistics of grouped data | mean, median and mode of grouped data",
    "Commercial mathematics | GST, recurring deposits, shares and dividends",
    "Linear programming | corner-point method, maximum and minimum",
    "Conditional probability and Bayes theorem | conditional probability, independence, total probability, Bayes' theorem",
    "Inverse trigonometric functions | principal values, identities",
    "Three-dimensional geometry | direction cosines, angle between lines, distance from a plane",
    "Limits and continuity | standard limits, L'Hospital-free evaluation, continuity at a point",
    "Differential equations | order and degree, variables separable, linear first-order equations",
    // Vrzeli drugih državnih izpitov (exam-gap-mat.js), angleško in hindijsko.
    "Sets and logic | set operations, Venn diagrams, counting with sets, truth tables",
    "Indices and surds | laws of indices, rationalising, exponential equations",
    "Measures of dispersion | range, quartiles, variance, standard deviation",
    "Normal distribution | standardising, z-scores, normal probabilities from a table",
    "Conic sections | parabola, ellipse, hyperbola: focus, directrix, eccentricity",
    "Binomial theorem | general term, coefficient of a power, middle term",
    "Correlation and regression | Pearson's r, line of best fit, prediction",
    "Circle theorems | angles in a circle, cyclic quadrilaterals, tangents",
  ],
  "FIZ-EXB": [
    "Kinematics | equations of uniformly accelerated motion",
    "Projectile motion | horizontal launch, range, maximum height",
    "Laws of motion | Newton's second law, friction, Atwood machine",
    "Work, energy and power | kinetic and potential energy, power",
    "Momentum and collisions | impulse, inelastic and elastic collisions",
    "Circular motion and gravitation | centripetal force, gravity with distance, vertical circle",
    "Oscillations | pendulum, spring–mass system, maximum speed in SHM",
    "Waves and sound | wave speed, standing waves, Doppler effect",
    "Thermal physics | heat capacity, gas laws, Carnot efficiency",
    "Electrostatics and capacitors | Coulomb's law, capacitors, stored energy",
    "Current electricity | series and parallel resistors, internal resistance",
    "Magnetism and induction | force on a wire, Faraday's law, charged particle in a field",
    "Optics | refractive index, thin lenses, Snell's law",
    "Modern physics | half-life, photoelectric effect, de Broglie wavelength",
    // Indija: exam-in-fiz.js
    "Spherical mirrors | mirror formula, magnification",
    "Electric power and household circuits | power, energy in kWh, cost, fuse rating",
    "Machines | mechanical advantage, velocity ratio, efficiency, levers and pulleys",
    "Moments and equilibrium | moment of a force, principle of moments, centre of gravity",
    "Calorimetry | specific heat capacity, latent heat, method of mixtures",
    "Alternating current | rms values, reactance, impedance, resonance, power factor",
    "Rotational motion | moment of inertia, torque, angular momentum, rolling",
    "Semiconductors and logic gates | diodes, rectifiers, logic gates, truth tables",
    // Vrzeli drugih državnih izpitov (exam-gap-fiz.js)
    "Units, measurement and errors | significant figures, dimensions, percentage error",
    "Density and pressure | density, pressure in liquids, atmospheric pressure, hydraulics",
    "Fluids and buoyancy | Archimedes' principle, flotation, Bernoulli's equation, viscosity",
    "Elasticity | stress, strain, Young's modulus, Hooke's law",
    "Wave optics | Young's double slit, fringe width, diffraction, polarisation",
  ],
  "KEM-EXB": [
    "Mole concept | moles, Avogadro's number, percentage composition",
    "Stoichiometry | masses from equations, limiting reactant",
    "Solutions and concentration | molarity, dilution, neutralisation",
    "Gaseous state | molar volume, ideal gas equation, Graham's law",
    "Acids, bases and pH | strong acids and bases, weak acids",
    "Thermochemistry | heat released, Hess's law, Gibbs energy",
    "Chemical equilibrium | equilibrium constant, equilibrium concentrations",
    "Chemical kinetics | half-life, rate constant, rate law",
    "Electrochemistry | cell emf, electrolysis, Gibbs energy of a cell",
    "Atomic structure | protons, neutrons, electrons, hydrogen spectrum",
    // Indija: exam-in-kem.js
    "Chemical reactions and equations | balancing, types of reactions, oxidation and reduction",
    "Metals and non-metals | reactivity series, displacement, extraction of metals",
    "Periodic table and periodic properties | trends in radius, ionisation energy, electronegativity, valency",
    "Chemical bonding | VSEPR shapes, hybridisation, bond order, polarity",
    "Organic chemistry: nomenclature and isomerism | IUPAC names, functional groups, isomers, degree of unsaturation",
    "Organic chemistry: reactions | reagents and products, name reactions, tests, reactivity order",
    "Coordination compounds | oxidation state, coordination number, magnetic moment, isomerism",
    "s-, p-, d- and f-block elements | oxidation states, properties, unpaired electrons, important compounds",
    "Colligative properties | Raoult's law, boiling-point elevation, freezing-point depression, osmotic pressure",
    "Identification of ions and gases | precipitate colours, gas tests, products of electrolysis",
    // Vrzeli drugih državnih izpitov (exam-gap-kem.js)
    "Polymers | addition and condensation polymers, monomers, natural and synthetic polymers",
    "Industrial chemistry | Haber process, Contact process, extraction of metals, yields and conditions",
    "Environmental chemistry | air and water pollution, greenhouse effect, ozone depletion, BOD",
  ],
  // Biologija (NEET, CBSE, ICSE/ISC, državne šole): exam-in-bio.js
  "BIO-EXB": [
    "Diversity of living organisms | kingdoms, plant and animal groups, key features",
    "Cell structure and biomolecules | organelles, prokaryotes and eukaryotes, enzymes, biomolecules",
    "Cell cycle and cell division | chromosome number and DNA content, mitosis, meiosis",
    "Plant physiology | photosynthesis, respiration, plant growth regulators",
    "Human physiology | breathing, circulation, excretion, nerves and hormones",
    "Reproduction | gametogenesis, menstrual cycle, reproduction in flowering plants",
    "Genetics and inheritance | Mendelian ratios, incomplete dominance, blood groups, sex-linked traits",
    "Molecular basis of inheritance | Chargaff's rule, DNA length, genetic code, replication, transcription",
    "Evolution | Hardy–Weinberg principle, natural selection, evidence of evolution",
    "Human health and disease | pathogens, immunity, vaccines, common diseases",
    "Biotechnology | restriction enzymes, PCR, recombinant DNA, applications",
    "Ecology and environment | energy flow, ecological pyramids, population growth, biodiversity",
    // Vrzeli drugih državnih izpitov (exam-gap-bio.js)
    "Plant anatomy and morphology | tissues, root, stem and leaf structure, inflorescence, flower",
    "Microbes in human welfare | microbes in food, industry, sewage treatment, biogas, biocontrol",
    "Animal behaviour and tissues | animal tissues, innate and learned behaviour",
    // Biologija na ravni 10. razreda (CBSE, ICSE, državni odbori, SEE, O-level …).
    "Life processes | nutrition, respiration, transport and excretion at Class 10 level",
    "Control and coordination | reflex arc, brain, plant and animal hormones",
    "How organisms reproduce | asexual and sexual reproduction, reproductive health",
    "Heredity and variation | Mendel's monohybrid and dihybrid crosses, sex determination",
    "Our environment | food chains, trophic levels, ten per cent law, ozone, waste",
  ],
};


// Skupni sklopi fizike in kemije (JEE, NEET, gaokao).
const PHYSICS_UNITS = [
  ["Mechanics", [
    `Kinematics | motion in one and two dimensions => ${F("kinematics")}, ${F("projectile-motion")}`,
    `Laws of motion | Newton's laws, friction, connected bodies => ${F("laws-of-motion")}`,
    `Work, energy and power | work–energy theorem, conservation of energy => ${F("work-energy-and-power")}`,
    `Momentum and collisions | impulse, conservation of momentum => ${F("momentum-and-collisions")}`,
    `Circular motion and gravitation | centripetal force, gravitational field => ${F("circular-motion-and-gravitation")}`,
  ]],
  ["Oscillations, waves and heat", [
    `Oscillations | simple harmonic motion => ${F("oscillations")}`,
    `Waves and sound | wave equation, standing waves, Doppler effect => ${F("waves-and-sound")}`,
    `Thermal physics | heat, gas laws, thermodynamics => ${F("thermal-physics")}`,
  ]],
  ["Electricity and magnetism", [
    `Electrostatics and capacitors | Coulomb's law, capacitance => ${F("electrostatics-and-capacitors")}`,
    `Current electricity | Ohm's law, circuits, emf => ${F("current-electricity")}`,
    `Magnetism and induction | magnetic force, electromagnetic induction => ${F("magnetism-and-induction")}`,
  ]],
  ["Optics and modern physics", [
    `Optics | refraction, lenses => ${F("optics")}`,
    `Modern physics | photoelectric effect, matter waves, radioactivity => ${F("modern-physics")}`,
  ]],
];
const CHEMISTRY_UNITS = [
  ["Basic concepts", [
    `Mole concept | moles, molar mass, composition => ${K("mole-concept")}`,
    `Stoichiometry | calculations from equations, limiting reactant => ${K("stoichiometry")}`,
    `Atomic structure | subatomic particles, energy levels => ${K("atomic-structure")}`,
  ]],
  ["Physical chemistry", [
    `Solutions | molarity, dilution, titration => ${K("solutions-and-concentration")}`,
    `Gaseous state | gas laws, ideal gas equation => ${K("gaseous-state")}`,
    `Thermodynamics | enthalpy, Hess's law, Gibbs energy => ${K("thermochemistry")}`,
    `Chemical equilibrium | equilibrium constant => ${K("chemical-equilibrium")}`,
    `Ionic equilibrium and pH | acids, bases, pH => ${K("acids-bases-and-ph")}`,
    `Chemical kinetics | rate law, half-life => ${K("chemical-kinetics")}`,
    `Electrochemistry | cells, electrolysis => ${K("electrochemistry")}`,
  ]],
];
// Skupni sklopi z dodanimi temami enega izpita (vrzeli iz njegovega učnega načrta): { naslov sklopa: [teme] }.
const withTopics = (units, extra) => units.map(([title, topics, ...rest]) => [title, [...topics, ...(extra[title] || [])], ...rest]);
// Skupni sklopi z utežmi (deleži v poskusnem izpitu), ko izpit doda svoj sklop.
const weighted = (units, weights) => units.map(([title, topics], i) => [title, topics, weights[i]]);

// Indija (JEE, NEET, razred 12): skupni sklopi z dvojezičnimi temami iz exam-in-*.js.
const PHYSICS_UNITS_IN = [
  ["Mechanics", [
    `Kinematics | motion in one and two dimensions => ${F("kinematics")}, ${F("projectile-motion")}`,
    `Laws of motion | Newton's laws, friction, connected bodies => ${F("laws-of-motion")}`,
    `Work, energy and power | work–energy theorem, conservation of energy => ${F("work-energy-and-power")}`,
    `Momentum and collisions | impulse, conservation of momentum => ${F("momentum-and-collisions")}`,
    `Rotational motion | moment of inertia, torque, rolling => ${F("rotational-motion")}`,
    `Gravitation and circular motion | centripetal force, gravitational field => ${F("circular-motion-and-gravitation")}`,
  ], 30],
  ["Oscillations, waves and heat", [
    `Oscillations | simple harmonic motion => ${F("oscillations")}`,
    `Waves and sound | wave equation, standing waves, Doppler effect => ${F("waves-and-sound")}`,
    `Thermal physics | calorimetry, gas laws, thermodynamics => ${F("thermal-physics")}, ${F("calorimetry")}`,
  ], 20],
  ["Electricity and magnetism", [
    `Electrostatics and capacitors | Coulomb's law, capacitance => ${F("electrostatics-and-capacitors")}`,
    `Current electricity | Ohm's law, circuits, emf => ${F("current-electricity")}`,
    `Magnetism and induction | magnetic force, electromagnetic induction => ${F("magnetism-and-induction")}`,
    `Alternating current | rms values, impedance, resonance => ${F("alternating-current")}`,
  ], 30],
  ["Optics, modern physics and electronics", [
    `Ray optics | mirrors, refraction, lenses => ${F("spherical-mirrors")}, ${F("optics")}`,
    `Modern physics | photoelectric effect, matter waves, radioactivity => ${F("modern-physics")}`,
    `Semiconductor electronics | diodes, logic gates => ${F("semiconductors-and-logic-gates")}`,
  ], 20],
];
const CHEMISTRY_UNITS_IN = [
  ["Physical chemistry", [
    `Mole concept and stoichiometry | moles, limiting reactant => ${K("mole-concept")}, ${K("stoichiometry")}`,
    `Atomic structure | subatomic particles, hydrogen spectrum => ${K("atomic-structure")}`,
    `Solutions and colligative properties | molarity, Raoult's law, osmotic pressure => ${K("solutions-and-concentration")}, ${K("colligative-properties")}`,
    `States of matter | gas laws, ideal gas equation => ${K("gaseous-state")}`,
    `Thermodynamics | enthalpy, Hess's law, Gibbs energy => ${K("thermochemistry")}`,
    `Equilibrium | equilibrium constant, pH => ${K("chemical-equilibrium")}, ${K("acids-bases-and-ph")}`,
    `Chemical kinetics | rate law, half-life => ${K("chemical-kinetics")}`,
    `Electrochemistry | cells, electrolysis => ${K("electrochemistry")}`,
  ], 35],
  ["Inorganic chemistry", [
    `Classification of elements and periodicity | periodic trends => ${K("periodic-table-and-periodic-properties")}`,
    `Chemical bonding and molecular structure | VSEPR, hybridisation, MO theory => ${K("chemical-bonding")}`,
    `s-, p-, d- and f-block elements | oxidation states, properties => ${K("s-p-d-and-f-block-elements")}`,
    `Coordination compounds | isomerism, magnetic moment => ${K("coordination-compounds")}`,
  ], 30],
  ["Organic chemistry", [
    `Basic principles of organic chemistry | IUPAC names, isomerism => ${K("organic-chemistry-nomenclature-and-isomerism")}`,
    `Organic reactions | hydrocarbons to amines, name reactions, tests => ${K("organic-chemistry-reactions")}`,
  ], 35],
];
// NEET biologija: botanika in zoologija (po 45 vprašanj).
const BIOLOGY_UNITS_NEET = [
  ["Botany", [
    `Plant kingdom and classification | kingdoms, plant groups => ${Bi("diversity-of-living-organisms")}`,
    `Cell: the unit of life and biomolecules | organelles, enzymes => ${Bi("cell-structure-and-biomolecules")}`,
    `Cell cycle and cell division | mitosis, meiosis => ${Bi("cell-cycle-and-cell-division")}`,
    `Plant physiology | photosynthesis, respiration, growth => ${Bi("plant-physiology")}`,
    `Sexual reproduction in flowering plants | pollination, double fertilisation => ${Bi("reproduction")}`,
    `Principles of inheritance and variation | Mendelian ratios, sex-linked traits => ${Bi("genetics-and-inheritance")}`,
    `Molecular basis of inheritance | DNA, replication, genetic code => ${Bi("molecular-basis-of-inheritance")}`,
    `Ecology | populations, ecosystems, biodiversity => ${Bi("ecology-and-environment")}`,
  ], 50],
  ["Zoology", [
    `Animal kingdom | phyla and key features => ${Bi("diversity-of-living-organisms")}`,
    `Human physiology | breathing, circulation, excretion, nerves, hormones => ${Bi("human-physiology")}`,
    `Human reproduction and reproductive health | gametogenesis, menstrual cycle => ${Bi("reproduction")}`,
    `Evolution | Hardy–Weinberg principle, natural selection => ${Bi("evolution")}`,
    `Human health and disease | pathogens, immunity => ${Bi("human-health-and-disease")}`,
    `Biotechnology | principles, processes, applications => ${Bi("biotechnology")}`,
  ], 50],
];

// Poskusni izpit: skupine vprašanj group(n, format, level, points, penalty, options) iz exam-helpers.js;
// scale: [min, max, korak] lestvica izpita; grades: [[najmanj %, ocena], …] od najboljše navzdol.
// Približne ocene po odstotku točk (meje se vsako leto nekoliko spremenijo).
const GRADES_GCSE = [[80, "9"], [70, "8"], [60, "7"], [50, "6"], [40, "5"], [30, "4"], [22, "3"], [14, "2"], [7, "1"], [0, "U"]];
const GRADES_ALEVEL = [[80, "A*"], [70, "A"], [60, "B"], [50, "C"], [40, "D"], [30, "E"], [0, "U"]];
const GRADES_ABITUR = [[95, "15"], [90, "14"], [85, "13"], [80, "12"], [75, "11"], [70, "10"], [65, "09"], [60, "08"], [55, "07"], [50, "06"], [45, "05"], [39, "04"], [33, "03"], [27, "02"], [20, "01"], [0, "00"]].map(([p, n]) => [p, `${n} Notenpunkte`]);
const GRADES_AT = [[87, "1 (Sehr gut)"], [75, "2 (Gut)"], [62, "3 (Befriedigend)"], [50, "4 (Genügend)"], [0, "5 (Nicht genügend)"]];
// Švica: ocena = 5 · točke / največ + 1, zaokroženo na pol ocene.
const GRADES_CH = [6, 5.5, 5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5].map((n) => [Math.max(0, (n - 1) * 20 - 5), String(n)]).concat([[0, "1"]]);
const GRADES_WAEC = [[75, "A1"], [70, "B2"], [65, "B3"], [60, "C4"], [55, "C5"], [50, "C6"], [45, "D7"], [40, "E8"], [0, "F9"]];
const GRADES_KCSE = [[80, "A"], [75, "A−"], [70, "B+"], [65, "B"], [60, "B−"], [55, "C+"], [50, "C"], [45, "C−"], [40, "D+"], [35, "D"], [30, "D−"], [0, "E"]];
const GRADES_NSC = [[80, "level 7"], [70, "level 6"], [60, "level 5"], [50, "level 4"], [40, "level 3"], [30, "level 2"], [0, "level 1"]];

export const EXAMS = {
  SAT: {
    name: "SAT",
    full: "SAT – Math section (digital SAT)",
    country: "United States",
    systems: ["US", "INTL"],
    about:
      "The digital SAT Math section has two adaptive modules of 22 questions (35 minutes each). About three quarters are multiple choice, the rest are student-produced answers. A calculator is allowed. The section is scored from 200 to 800.",
    subjects: {
      MAT: {
        units: [
          ["Algebra", [
            "Linear equations in one variable | solving and interpreting => MAT-OS-8/linearne-enacbe, MAT-SS-1/linearne-enacbe",
            `Linear functions | slope, intercepts, graphs => MAT-OS-9/linearna-funkcija, ${M("coordinate-geometry")}`,
            `Systems of linear equations | two equations, two unknowns => ${M("systems-of-linear-equations")}`,
            `Linear inequalities | solving and word problems => MAT-OS-9/linearne-neenacbe, ${M("quadratic-inequalities")}`,
          ], 35],
          ["Advanced math", [
            "Equivalent expressions | expanding and factorising => MAT-OS-8/mnozenje-izrazov, MAT-OS-8/razstavljanje",
            `Quadratic equations | roots and Vieta's formulas => ${M("quadratic-equations")}`,
            `Nonlinear functions | evaluating, composition, inverse => ${M("functions")}`,
            `Exponential functions | growth and decay => ${M("exponential-growth-and-decay")}`,
            `Radicals and rational exponents | equivalent forms, rationalising => ${M("indices-and-surds")}`,
          ], 35],
          ["Problem-solving and data analysis", [
            `Ratios, rates and percentages | percent change, ratios => ${M("ratios-rates-and-percentages")}, MAT-OS-7/odstotni-racun`,
            "Units and proportional reasoning | direct and inverse proportion, unit conversion => MAT-OS-7/premo-sorazmerje, MAT-OS-6/merske-enote",
            `One-variable data | mean and median => ${M("statistics-mean-median")}`,
            `Probability | simple and conditional probability => ${M("probability")}`,
          ], 15],
          ["Geometry and trigonometry", [
            "Area and volume | prisms, cylinders, cones, spheres => MAT-OS-9/valj, MAT-OS-9/stozec, MAT-OS-9/krogla",
            "Lines, angles and triangles | angle sums, similar triangles => MAT-OS-7/vrste-trikotnikov-in-notranji-koti, MAT-OS-9/podobni-trikotniki",
            `Right triangles and trigonometry | Pythagoras, SOH CAH TOA => ${M("right-triangle-trigonometry")}, MAT-OS-8/pitagorov-izrek`,
            `Circles | area, sectors, equation of a circle => ${M("circles")}`,
            `Circle theorems | inscribed and central angles, tangents => ${M("circle-theorems")}`,
          ], 15],
        ],
        mock: { minutes: 35, groups: [group(5, "choice", 1, 1), group(8, "choice", 2, 1), group(3, "choice", 3, 1), group(3, "numeric", 2, 1), group(3, "numeric", 3, 1)], scale: [200, 800] },
      },
    },
  },
  GAOKAO: {
    name: "Gaokao",
    full: "高考 Gaokao (National College Entrance Exam)",
    country: "China",
    systems: ["CN"],
    about:
      "Gaokao mathematics (new curriculum) is a 120-minute, 150-point paper: 8 single-choice questions (5 points), 3 multiple-choice questions (6 points), 3 fill-in-the-blank questions (5 points) and 5 long problems. Physics and chemistry are 75-minute, 100-point papers. The mock here covers the objective part (choice and fill-in questions).",
    subjects: {
      MAT: {
        units: [
          ["Sets, functions and inequalities", [
            `Inequalities and sets | quadratic inequalities, solution sets => ${M("quadratic-inequalities")}`,
            `Functions | properties, composition, inverse => ${M("functions")}`,
            `Exponential and logarithmic functions | log laws, exponential models => ${M("logarithms")}, ${M("exponential-growth-and-decay")}`,
          ], 25],
          ["Trigonometry", [
            `Trigonometric functions and identities | special angles, double angle => ${M("trigonometric-identities")}`,
            `Solving triangles | right triangles, angles of elevation => ${M("right-triangle-trigonometry")}`,
          ], 15],
          ["Sequences", [
            `Arithmetic sequences | general term, sum => ${M("arithmetic-progressions")}`,
            `Geometric sequences | general term, sum => ${M("geometric-progressions")}`,
          ], 15],
          ["Vectors and complex numbers", [
            `Plane and space vectors | dot product, perpendicularity => ${M("vectors")}`,
            `Complex numbers | operations, modulus => ${M("complex-numbers")}`,
          ], 10],
          ["Analytic and solid geometry", [
            `Lines and circles | slope, distance, equation of a circle => ${M("coordinate-geometry")}, ${M("circles")}`,
            "Solid geometry | surface area and volume => MAT-SS-3/povrsina-in-prostornina-teles, MAT-OS-9/piramida",
            `Conic sections | ellipse, hyperbola, parabola => ${M("conic-sections")}`,
          ], 15],
          ["Probability and statistics", [
            `Counting | permutations and combinations => ${M("permutations-and-combinations")}`,
            `Probability | classical probability => ${M("probability")}`,
            `Statistics | mean, median => ${M("statistics-mean-median")}`,
            `Binomial theorem | general term, coefficients => ${M("binomial-theorem")}`,
            `Variance and standard deviation | sample variance => ${M("measures-of-dispersion")}`,
            `Paired data | correlation coefficient, linear regression => ${M("correlation-and-regression")}`,
            `Normal distribution | 3σ rule, normal probabilities => ${M("normal-distribution")}`,
          ], 10],
          ["Derivatives", [`Derivatives and their applications | tangents, monotonicity, extrema => ${M("differentiation")}`], 10],
        ],
        mock: { minutes: 50, groups: [group(4, "choice", 1, 5), group(4, "choice", 2, 5), group(1, "numeric", 2, 5), group(2, "numeric", 3, 5)] },
      },
      FIZ: {
        units: PHYSICS_UNITS,
        mock: { minutes: 45, groups: [group(4, "choice", 1, 4), group(3, "choice", 2, 4), group(3, "choice", 3, 6), group(2, "numeric", 2, 6)] },
      },
      KEM: {
        units: CHEMISTRY_UNITS,
        mock: { minutes: 40, groups: [group(5, "choice", 1, 3), group(5, "choice", 2, 3), group(2, "numeric", 3, 6)] },
      },
    },
  },
  // ------------------------------------------------------------ Indija
  // Vse teme indijskih izpitov so iz angleške banke (*-EXB) in dvojezične, kjer so iz
  // exam-in-*.js (angleško in hindijsko); slovenskih osnovnih tem tu ni (test v exams.test.js).
  // forLevel: razredi, za katere je izpit privzet (Class 6–10 → izpit 10. razreda …).
  JEEM: {
    name: "JEE Main",
    full: "JEE Main (Joint Entrance Examination – Main)",
    country: "India",
    systems: ["IN-CBSE", "IN-ICSE", "IN-STATE"],
    forLevel: [11, 12],
    about:
      "JEE Main (NTA) has 75 questions in 3 hours: 25 per subject (Mathematics, Physics, Chemistry). In each subject 20 are multiple choice (+4 correct, −1 wrong) and 5 have a numerical answer (+4). Maximum 300 marks. The paper is also offered in Hindi. Check the current NTA information bulletin for the marking of numerical answers.",
    subjects: {
      MAT: {
        units: [
          ["Algebra", [
            `Sets, relations and functions | composition, inverse => ${M("functions")}`,
            `Complex numbers and quadratic equations | modulus, roots => ${M("complex-numbers")}, ${M("quadratic-equations")}`,
            `Matrices and determinants | determinants, singular matrices => ${M("matrices-and-determinants")}`,
            `Permutations and combinations | counting => ${M("permutations-and-combinations")}`,
            `Binomial theorem and probability distributions | binomial probabilities => ${M("binomial-distribution")}`,
            `Sequences and series | AP, GP => ${M("arithmetic-progressions")}, ${M("geometric-progressions")}`,
          ], 30],
          ["Calculus", [
            `Limits, continuity and differentiability | standard limits, continuity => ${M("limits-and-continuity")}, ${M("differentiation")}`,
            `Integral calculus | definite integrals, areas => ${M("integration")}`,
            `Differential equations | variables separable, linear equations => ${M("differential-equations")}`,
          ], 30],
          ["Coordinate geometry and vectors", [
            `Straight lines and circles | slope, distance, circles => ${M("coordinate-geometry")}, ${M("circles")}`,
            `Vector algebra | dot product, magnitude => ${M("vectors")}`,
            `Three-dimensional geometry | direction cosines, planes => ${M("three-dimensional-geometry")}`,
          ], 25],
          ["Trigonometry, statistics and probability", [
            `Trigonometry | identities, inverse functions => ${M("trigonometric-identities")}, ${M("inverse-trigonometric-functions")}`,
            `Statistics and probability | mean, conditional probability, Bayes' theorem => ${M("statistics-mean-median")}, ${M("probability")}, ${M("conditional-probability-and-bayes-theorem")}`,
          ], 15],
        ],
        mock: { minutes: 60, groups: [group(8, "choice", 1, 4, -1), group(8, "choice", 2, 4, -1), group(4, "choice", 3, 4, -1), group(3, "numeric", 2, 4), group(2, "numeric", 3, 4)] },
      },
      FIZ: {
        units: PHYSICS_UNITS_IN,
        mock: { minutes: 60, groups: [group(8, "choice", 1, 4, -1), group(8, "choice", 2, 4, -1), group(4, "choice", 3, 4, -1), group(3, "numeric", 2, 4), group(2, "numeric", 3, 4)] },
      },
      KEM: {
        units: CHEMISTRY_UNITS_IN,
        mock: { minutes: 60, groups: [group(8, "choice", 1, 4, -1), group(8, "choice", 2, 4, -1), group(4, "choice", 3, 4, -1), group(3, "numeric", 2, 4), group(2, "numeric", 3, 4)] },
      },
    },
  },
  JEEA: {
    name: "JEE Advanced",
    full: "JEE Advanced",
    country: "India",
    systems: ["IN-CBSE", "IN-ICSE", "IN-STATE"],
    forLevel: [12, 12],
    about:
      "JEE Advanced has two 3-hour papers with Mathematics, Physics and Chemistry. Question types change every year: single-correct and multiple-correct MCQs (often with negative marking), numerical answers and matching. Questions are harder and combine several ideas. The mock uses the hardest level.",
    subjects: {
      MAT: {
        units: [
          ["Algebra", [
            `Quadratics, complex numbers and polynomials | roots and coefficients => ${M("quadratic-equations")}, ${M("complex-numbers")}, ${M("polynomials")}`,
            `Sequences, series and counting | progressions, combinatorics => ${M("geometric-progressions")}, ${M("permutations-and-combinations")}`,
            `Matrices and determinants | determinants => ${M("matrices-and-determinants")}`,
          ]],
          ["Calculus", [
            `Limits and continuity | limits, continuity of piecewise functions => ${M("limits-and-continuity")}`,
            `Differential calculus | extrema, tangents => ${M("differentiation")}`,
            `Integral calculus | definite integrals, areas => ${M("integration")}`,
            `Differential equations | first-order equations => ${M("differential-equations")}`,
          ]],
          ["Geometry and vectors", [
            `Coordinate geometry | lines, circles => ${M("coordinate-geometry")}, ${M("circles")}`,
            `Vectors and 3D geometry | dot product, planes => ${M("vectors")}, ${M("three-dimensional-geometry")}`,
          ]],
          ["Probability and trigonometry", [
            `Probability | conditional probability, Bayes' theorem => ${M("probability")}, ${M("conditional-probability-and-bayes-theorem")}`,
            `Trigonometry | identities, inverse functions => ${M("trigonometric-identities")}, ${M("inverse-trigonometric-functions")}`,
          ]],
        ],
        mock: { minutes: 60, groups: [group(4, "choice", 2, 3, -1), group(8, "choice", 3, 3, -1), group(6, "numeric", 3, 4)] },
      },
      FIZ: {
        units: PHYSICS_UNITS_IN,
        mock: { minutes: 60, groups: [group(4, "choice", 2, 3, -1), group(8, "choice", 3, 3, -1), group(6, "numeric", 3, 4)] },
      },
      KEM: {
        units: CHEMISTRY_UNITS_IN,
        mock: { minutes: 60, groups: [group(4, "choice", 2, 3, -1), group(8, "choice", 3, 3, -1), group(6, "numeric", 3, 4)] },
      },
    },
  },
  NEET: {
    name: "NEET",
    full: "NEET-UG (medical entrance)",
    country: "India",
    systems: ["IN-CBSE", "IN-ICSE", "IN-STATE"],
    forLevel: [11, 12],
    about:
      "NEET-UG (NTA) has 180 compulsory multiple-choice questions in 3 hours: 45 Physics, 45 Chemistry and 90 Biology (Botany and Zoology). Correct +4, wrong −1, unanswered 0. Maximum 720 marks. The paper is offered in English, Hindi and other Indian languages. The mock covers one subject at the real pace of one minute per question.",
    subjects: {
      FIZ: {
        units: PHYSICS_UNITS_IN,
        mock: { minutes: 30, groups: [group(10, "choice", 1, 4, -1), group(14, "choice", 2, 4, -1), group(6, "choice", 3, 4, -1)] },
      },
      KEM: {
        units: CHEMISTRY_UNITS_IN,
        mock: { minutes: 30, groups: [group(12, "choice", 1, 4, -1), group(12, "choice", 2, 4, -1), group(6, "choice", 3, 4, -1)] },
      },
      BIO: {
        units: BIOLOGY_UNITS_NEET,
        mock: { minutes: 30, groups: [group(10, "choice", 1, 4, -1), group(14, "choice", 2, 4, -1), group(6, "choice", 3, 4, -1)] },
      },
    },
  },
  CBSE10: {
    name: "CBSE Class 10",
    full: "CBSE Class 10 board exams",
    country: "India",
    systems: ["IN-CBSE"],
    board: true,
    forLevel: [6, 10],
    about:
      "CBSE Class 10 papers are 3 hours and 80 marks (plus 20 internal assessment): section A has 1-mark MCQs and assertion–reason questions, then 2-, 3-, 4- and 5-mark questions and case studies. Science is one paper with physics, chemistry and biology. Write every step for the longer answers. The mock covers the MCQ section and short numerical questions.",
    subjects: {
      MAT: {
        units: [
          ["Number systems and algebra", [
            `Real numbers | HCF, LCM, prime factorisation => ${M("real-numbers")}`,
            `Polynomials | zeros and coefficients => ${M("polynomials")}`,
            `Pair of linear equations in two variables | elimination, substitution => ${M("systems-of-linear-equations")}`,
            `Quadratic equations | factorising, discriminant => ${M("quadratic-equations")}`,
            `Arithmetic progressions | nth term, sum => ${M("arithmetic-progressions")}`,
          ]],
          ["Geometry and coordinate geometry", [
            `Triangles | similarity, basic proportionality theorem => ${M("similar-triangles")}`,
            `Coordinate geometry | distance formula, section formula => ${M("coordinate-geometry")}`,
          ]],
          ["Trigonometry", [
            `Introduction to trigonometry | ratios, identities => ${M("right-triangle-trigonometry")}, ${M("trigonometric-identities")}`,
            `Some applications of trigonometry | heights and distances => ${M("right-triangle-trigonometry")}`,
          ]],
          ["Mensuration, statistics and probability", [
            `Areas related to circles | sectors and segments => ${M("circles")}`,
            `Surface areas and volumes | combined solids => ${M("surface-areas-and-volumes")}`,
            `Statistics | mean, median and mode of grouped data => ${M("statistics-of-grouped-data")}`,
            `Probability | classical probability => ${M("probability")}`,
          ]],
        ],
        mock: { minutes: 60, groups: [group(10, "choice", 1, 1), group(6, "choice", 2, 1), group(4, "numeric", 2, 2), group(4, "numeric", 3, 3)] },
      },
      FIZ: {
        units: [
          ["Physics (Science paper)", [
            `Light – reflection and refraction | mirror and lens formula, refractive index => ${F("spherical-mirrors")}, ${F("optics")}`,
            `Electricity | Ohm's law, resistors, power, energy => ${F("current-electricity")}, ${F("electric-power-and-household-circuits")}`,
            `Magnetic effects of electric current | force on a conductor, domestic circuits => ${F("magnetism-and-induction")}, ${F("electric-power-and-household-circuits")}`,
          ]],
        ],
        mock: { minutes: 30, groups: [group(8, "choice", 1, 1), group(4, "numeric", 2, 2), group(2, "numeric", 3, 3)] },
      },
      KEM: {
        units: [
          ["Chemistry (Science paper)", [
            `Chemical reactions and equations | balancing, types of reactions => ${K("chemical-reactions-and-equations")}`,
            `Acids, bases and salts | pH scale, neutralisation => ${K("acids-bases-and-ph")}`,
            `Metals and non-metals | reactivity series, extraction => ${K("metals-and-non-metals")}`,
            `Carbon and its compounds | functional groups, homologous series => ${K("organic-chemistry-nomenclature-and-isomerism")}`,
          ]],
        ],
        mock: { minutes: 30, groups: [group(10, "choice", 1, 1), group(4, "choice", 2, 1)] },
      },
      BIO: {
        units: [
          ["Biology (Science paper)", [
            `Life processes | nutrition, respiration, transport, excretion => ${Bi("life-processes")}`,
            `Control and coordination | nervous system, hormones, plant hormones => ${Bi("control-and-coordination")}`,
            `How do organisms reproduce? | sexual and asexual reproduction => ${Bi("how-organisms-reproduce")}`,
            `Heredity | Mendel's experiments, sex determination => ${Bi("heredity-and-variation")}`,
            `Our environment | food chains, ten per cent law => ${Bi("our-environment")}`,
          ]],
        ],
        mock: { minutes: 30, groups: [group(10, "choice", 1, 1), group(4, "choice", 2, 1)] },
      },
    },
  },
  CBSE12: {
    name: "CBSE Class 12",
    full: "CBSE Class 12 board exams",
    country: "India",
    systems: ["IN-CBSE"],
    board: true,
    forLevel: [11, 12],
    about:
      "CBSE Class 12 papers are 3 hours: Mathematics 80 marks, Physics, Chemistry and Biology 70 marks (plus practicals). Section A has 1-mark MCQs and assertion–reason questions, followed by short and long answers and case studies. The mock covers the MCQ section and short numerical questions.",
    subjects: {
      MAT: {
        units: [
          ["Relations, functions and algebra", [
            `Relations and functions | composition, inverse => ${M("functions")}`,
            `Inverse trigonometric functions | principal values => ${M("inverse-trigonometric-functions")}`,
            `Matrices and determinants | determinants, inverse => ${M("matrices-and-determinants")}`,
          ]],
          ["Calculus", [
            `Continuity and differentiability | continuity, derivatives => ${M("limits-and-continuity")}, ${M("differentiation")}`,
            `Applications of derivatives | tangents, maxima and minima => ${M("differentiation")}`,
            `Integrals | definite integrals => ${M("integration")}`,
            `Applications of integrals | area under and between curves => ${M("integration")}`,
            `Differential equations | variables separable, linear equations => ${M("differential-equations")}`,
          ]],
          ["Vectors, 3D geometry, linear programming and probability", [
            `Vectors | dot product, magnitude => ${M("vectors")}`,
            `Three-dimensional geometry | direction cosines, angle between lines => ${M("three-dimensional-geometry")}`,
            `Linear programming | corner-point method => ${M("linear-programming")}`,
            `Probability | conditional probability, Bayes' theorem => ${M("conditional-probability-and-bayes-theorem")}, ${M("probability")}`,
          ]],
        ],
        mock: { minutes: 60, groups: [group(10, "choice", 2, 1), group(6, "choice", 3, 1), group(4, "numeric", 2, 2), group(4, "numeric", 3, 3)] },
      },
      FIZ: {
        units: [
          ["Electricity and magnetism", [
            `Electric charges, fields and capacitance | Coulomb's law, capacitors => ${F("electrostatics-and-capacitors")}`,
            `Current electricity | circuits, emf => ${F("current-electricity")}`,
            `Moving charges, magnetism and EMI | magnetic force, induction => ${F("magnetism-and-induction")}`,
            `Alternating current | rms values, reactance, resonance => ${F("alternating-current")}`,
          ]],
          ["Optics, modern physics and electronics", [
            `Ray and wave optics | mirrors, refraction, lenses => ${F("spherical-mirrors")}, ${F("optics")}`,
            `Dual nature, atoms and nuclei | photoelectric effect, half-life => ${F("modern-physics")}`,
            `Semiconductor electronics | diodes, logic gates => ${F("semiconductors-and-logic-gates")}`,
          ]],
        ],
        mock: { minutes: 45, groups: [group(8, "choice", 1, 1), group(8, "choice", 2, 1), group(4, "numeric", 2, 2), group(3, "numeric", 3, 3)] },
      },
      KEM: {
        units: [
          ["Physical chemistry", [
            `Solutions | concentration, colligative properties => ${K("solutions-and-concentration")}, ${K("colligative-properties")}`,
            `Electrochemistry | cells, electrolysis => ${K("electrochemistry")}`,
            `Chemical kinetics | rate law, half-life => ${K("chemical-kinetics")}`,
          ], 35],
          ["Inorganic chemistry", [
            `The d- and f-block elements | oxidation states, magnetic moments => ${K("s-p-d-and-f-block-elements")}`,
            `Coordination compounds | oxidation state, isomerism, magnetism => ${K("coordination-compounds")}`,
          ], 25],
          ["Organic chemistry", [
            `Naming and isomerism of organic compounds | IUPAC names, isomers => ${K("organic-chemistry-nomenclature-and-isomerism")}`,
            `Haloalkanes to amines | reactions, tests, reactivity => ${K("organic-chemistry-reactions")}`,
          ], 40],
        ],
        mock: { minutes: 30, groups: [group(8, "choice", 1, 1), group(4, "choice", 2, 1), group(3, "numeric", 3, 2)] },
      },
      BIO: {
        units: [
          ["Reproduction and genetics", [
            `Sexual reproduction in flowering plants and humans | gametogenesis, menstrual cycle => ${Bi("reproduction")}`,
            `Principles of inheritance and variation | Mendelian ratios, sex-linked traits => ${Bi("genetics-and-inheritance")}`,
            `Molecular basis of inheritance | DNA, replication, genetic code => ${Bi("molecular-basis-of-inheritance")}`,
            `Evolution | Hardy–Weinberg principle, natural selection => ${Bi("evolution")}`,
          ], 45],
          ["Biology and human welfare, biotechnology, ecology", [
            `Human health and disease | pathogens, immunity => ${Bi("human-health-and-disease")}`,
            `Biotechnology | restriction enzymes, PCR, applications => ${Bi("biotechnology")}`,
            `Organisms, populations and ecosystems | population growth, energy flow => ${Bi("ecology-and-environment")}`,
          ], 55],
        ],
        mock: { minutes: 30, groups: [group(10, "choice", 1, 1), group(6, "choice", 2, 1), group(2, "numeric", 3, 2)] },
      },
    },
  },
  ICSE10: {
    name: "ICSE Class 10",
    full: "ICSE Class 10 examination (CISCE)",
    country: "India",
    systems: ["IN-ICSE"],
    board: true,
    forLevel: [6, 10],
    about:
      "ICSE papers are 80 marks (plus 20 internal assessment). Mathematics: Section A (40 marks) is compulsory and starts with 15 one-mark MCQs; in Section B you answer any four of seven longer questions. Physics, Chemistry and Biology (Science Papers 1–3): Section A (40 marks, compulsory, starting with MCQs), Section B any four of six questions. The mock covers the MCQs and short numerical questions of Section A.",
    subjects: {
      MAT: {
        units: [
          ["Commercial mathematics", [
            `GST, banking, shares and dividends | GST, recurring deposits, dividends => ${M("commercial-mathematics")}`,
          ], 10],
          ["Algebra", [
            `Linear inequations | solving, integer solutions => ${M("quadratic-inequalities")}`,
            `Quadratic equations | roots, word problems => ${M("quadratic-equations")}`,
            `Factorisation | remainder and factor theorem => ${M("polynomials")}`,
            `Matrices | operations => ${M("matrices-and-determinants")}`,
            `Arithmetic and geometric progressions | nth term, sum => ${M("arithmetic-progressions")}, ${M("geometric-progressions")}`,
            `Coordinate geometry | section and mid-point formula, equation of a line => ${M("coordinate-geometry")}`,
          ], 35],
          ["Geometry, mensuration and trigonometry", [
            `Similarity | similar triangles, area ratios => ${M("similar-triangles")}`,
            `Mensuration | cylinder, cone, sphere => ${M("surface-areas-and-volumes")}`,
            `Trigonometry | identities, heights and distances => ${M("trigonometric-identities")}, ${M("right-triangle-trigonometry")}`,
          ], 35],
          ["Statistics and probability", [
            `Statistics | mean, median, mode, quartiles => ${M("statistics-of-grouped-data")}, ${M("statistics-mean-median")}`,
            `Probability | classical probability => ${M("probability")}`,
          ], 20],
        ],
        mock: { minutes: 45, groups: [group(10, "choice", 1, 1), group(5, "choice", 2, 1), group(4, "numeric", 2, 3), group(2, "numeric", 3, 4)] },
      },
      FIZ: {
        units: [
          ["Force, work, power and energy", [
            `Force and moments | moment of a force, centre of gravity => ${F("moments-and-equilibrium")}`,
            `Work, energy and power | work, kinetic and potential energy, power => ${F("work-energy-and-power")}`,
            `Machines | mechanical advantage, velocity ratio, efficiency => ${F("machines")}`,
          ], 30],
          ["Light and sound", [
            `Refraction and lenses | refractive index, lens formula => ${F("optics")}`,
            `Sound | echoes, wave speed, resonance => ${F("waves-and-sound")}`,
          ], 20],
          ["Electricity and magnetism", [
            `Current electricity | Ohm's law, resistors in series and parallel => ${F("current-electricity")}`,
            `Electrical power and household circuits | kWh, fuses => ${F("electric-power-and-household-circuits")}`,
            `Electromagnetism | magnetic effect of current, induction => ${F("magnetism-and-induction")}`,
          ], 25],
          ["Heat and modern physics", [
            `Calorimetry | specific heat capacity, latent heat => ${F("calorimetry")}`,
            `Radioactivity | radiations, half-life => ${F("modern-physics")}`,
          ], 25],
        ],
        mock: { minutes: 30, groups: [group(10, "choice", 1, 1), group(5, "choice", 2, 1), group(3, "numeric", 2, 2), group(2, "numeric", 3, 3)] },
      },
      KEM: {
        units: [
          ["Periodic table and bonding", [
            `Periodic properties | trends across periods and groups => ${K("periodic-table-and-periodic-properties")}`,
            `Chemical bonding | ionic, covalent and coordinate bonds => ${K("chemical-bonding")}`,
          ], 20],
          ["Acids, analysis and electrolysis", [
            `Acids, bases and salts | pH, salts => ${K("acids-bases-and-ph")}`,
            `Analytical chemistry | precipitates with NaOH and NH4OH => ${K("identification-of-ions-and-gases")}`,
            `Electrolysis and study of gases | electrode products, gas tests => ${K("identification-of-ions-and-gases")}`,
          ], 30],
          ["Mole concept and metallurgy", [
            `Mole concept and stoichiometry | moles, gas volumes, empirical formula => ${K("mole-concept")}, ${K("stoichiometry")}`,
            `Metallurgy | reactivity series, extraction => ${K("metals-and-non-metals")}`,
          ], 30],
          ["Organic chemistry", [
            `Organic chemistry | homologous series, IUPAC names, isomers => ${K("organic-chemistry-nomenclature-and-isomerism")}`,
          ], 20],
        ],
        mock: { minutes: 30, groups: [group(10, "choice", 1, 1), group(5, "choice", 2, 1), group(3, "numeric", 2, 2), group(2, "numeric", 3, 3)] },
      },
      BIO: {
        units: [
          ["Cells and genetics", [
            `Cell cycle and cell division | mitosis, meiosis => ${Bi("cell-cycle-and-cell-division")}`,
            `Genetics | Mendel's laws, sex-linked inheritance => ${Bi("heredity-and-variation")}`,
          ], 25],
          ["Plant physiology", [
            `Absorption, transpiration and photosynthesis | osmosis, transpiration, photosynthesis => ${Bi("life-processes")}`,
          ], 20],
          ["Human anatomy and physiology", [
            `Circulatory, excretory, nervous and endocrine systems | heart, kidney, neurons, hormones => ${Bi("life-processes")}, ${Bi("control-and-coordination")}`,
            `Reproductive system | gametes, menstrual cycle => ${Bi("how-organisms-reproduce")}`,
          ], 40],
          ["Population and pollution", [
            `Population and pollution | population growth, air and water pollution => ${Bi("our-environment")}`,
          ], 15],
        ],
        mock: { minutes: 30, groups: [group(10, "choice", 1, 1), group(5, "choice", 2, 1), group(3, "choice", 3, 2)] },
      },
    },
  },
  ISC12: {
    name: "ISC Class 12",
    full: "ISC Class 12 examination (CISCE)",
    country: "India",
    systems: ["IN-ICSE"],
    board: true,
    forLevel: [11, 12],
    about:
      "ISC papers are 3 hours. Mathematics (80 marks): Section A (65 marks) is compulsory; then you answer either Section B (vectors, 3D geometry, applications of integrals) or Section C (commerce and economics applications, regression, linear programming). Physics, Chemistry and Biology are 70 marks plus practicals and start with compulsory short and objective questions. The mock covers the objective and short numerical questions.",
    subjects: {
      MAT: {
        units: [
          ["Section A: algebra and calculus", [
            `Relations, functions and inverse trigonometric functions | principal values => ${M("functions")}, ${M("inverse-trigonometric-functions")}`,
            `Matrices and determinants | determinants, inverse => ${M("matrices-and-determinants")}`,
            `Continuity and differentiability | limits, derivatives => ${M("limits-and-continuity")}, ${M("differentiation")}`,
            `Integrals and differential equations | definite integrals, first-order equations => ${M("integration")}, ${M("differential-equations")}`,
            `Probability | conditional probability, Bayes' theorem => ${M("conditional-probability-and-bayes-theorem")}`,
          ], 80],
          ["Section B or C", [
            `Vectors and three-dimensional geometry | dot product, planes => ${M("vectors")}, ${M("three-dimensional-geometry")}`,
            `Linear programming | corner-point method => ${M("linear-programming")}`,
          ], 20],
        ],
        mock: { minutes: 60, groups: [group(10, "choice", 2, 1), group(5, "choice", 3, 1), group(4, "numeric", 2, 2), group(4, "numeric", 3, 4)] },
      },
      FIZ: {
        units: [
          ["Electricity and magnetism", [
            `Electrostatics | Coulomb's law, capacitors => ${F("electrostatics-and-capacitors")}`,
            `Current electricity | circuits, emf => ${F("current-electricity")}`,
            `Magnetism and EMI | magnetic force, induction => ${F("magnetism-and-induction")}`,
            `Alternating current | rms values, impedance, resonance => ${F("alternating-current")}`,
          ], 50],
          ["Optics, modern physics and electronics", [
            `Ray and wave optics | mirrors, refraction, lenses => ${F("spherical-mirrors")}, ${F("optics")}`,
            `Dual nature, atoms and nuclei | photoelectric effect, half-life => ${F("modern-physics")}`,
            `Semiconductor devices | diodes, logic gates => ${F("semiconductors-and-logic-gates")}`,
          ], 50],
        ],
        mock: { minutes: 45, groups: [group(8, "choice", 1, 1), group(6, "choice", 2, 1), group(4, "numeric", 2, 2), group(3, "numeric", 3, 3)] },
      },
      KEM: {
        units: [
          ["Physical chemistry", [
            `Solutions | colligative properties => ${K("colligative-properties")}, ${K("solutions-and-concentration")}`,
            `Electrochemistry | cells, electrolysis => ${K("electrochemistry")}`,
            `Chemical kinetics | rate law, half-life => ${K("chemical-kinetics")}`,
          ], 35],
          ["Inorganic chemistry", [
            `d- and f-block elements | oxidation states, magnetic moments => ${K("s-p-d-and-f-block-elements")}`,
            `Coordination compounds | isomerism, magnetism => ${K("coordination-compounds")}`,
          ], 25],
          ["Organic chemistry", [
            `Naming and isomerism | IUPAC names, isomers => ${K("organic-chemistry-nomenclature-and-isomerism")}`,
            `Organic reactions | haloalkanes, alcohols, carbonyls, amines => ${K("organic-chemistry-reactions")}`,
          ], 40],
        ],
        mock: { minutes: 30, groups: [group(8, "choice", 1, 1), group(4, "choice", 2, 1), group(3, "numeric", 3, 2)] },
      },
      BIO: {
        units: [
          ["Reproduction, genetics and evolution", [
            `Reproduction | flowering plants, human reproduction => ${Bi("reproduction")}`,
            `Genetics and molecular biology | inheritance, DNA => ${Bi("genetics-and-inheritance")}, ${Bi("molecular-basis-of-inheritance")}`,
            `Evolution | Hardy–Weinberg principle => ${Bi("evolution")}`,
          ], 50],
          ["Human welfare, biotechnology and ecology", [
            `Biology and human welfare | health and disease => ${Bi("human-health-and-disease")}`,
            `Biotechnology | tools and applications => ${Bi("biotechnology")}`,
            `Ecology | populations, ecosystems => ${Bi("ecology-and-environment")}`,
          ], 50],
        ],
        mock: { minutes: 30, groups: [group(10, "choice", 1, 1), group(6, "choice", 2, 1), group(2, "numeric", 3, 2)] },
      },
    },
  },
  STATE10: {
    name: "State board Class 10",
    full: "State board Class 10 exams (SSC / SSLC / Matric)",
    country: "India",
    systems: ["IN-STATE"],
    board: true,
    forLevel: [6, 10],
    about:
      "Each state board sets its own Class 10 papers. Many boards use NCERT textbooks for mathematics and science; others (for example Maharashtra, Tamil Nadu or Kerala) have their own books that cover largely the same topics. Most papers start with objective questions (MCQs, fill in the blanks) followed by short and long answers. Check your board's latest blueprint; the mock covers objective and short numerical questions on the common topics.",
    subjects: {
      MAT: {
        units: [
          ["Algebra", [
            `Real numbers | HCF, LCM => ${M("real-numbers")}`,
            `Polynomials | zeros and coefficients => ${M("polynomials")}`,
            `Linear equations in two variables | elimination, substitution => ${M("systems-of-linear-equations")}`,
            `Quadratic equations | roots, discriminant => ${M("quadratic-equations")}`,
            `Arithmetic progressions | nth term, sum => ${M("arithmetic-progressions")}`,
          ]],
          ["Geometry and trigonometry", [
            `Similar triangles | basic proportionality theorem, Pythagoras => ${M("similar-triangles")}`,
            `Coordinate geometry | distance and section formula => ${M("coordinate-geometry")}`,
            `Trigonometry | ratios, identities, heights and distances => ${M("right-triangle-trigonometry")}, ${M("trigonometric-identities")}`,
          ]],
          ["Mensuration, statistics and probability", [
            `Mensuration | areas of circles, surface areas and volumes => ${M("circles")}, ${M("surface-areas-and-volumes")}`,
            `Statistics | mean, median and mode of grouped data => ${M("statistics-of-grouped-data")}`,
            `Probability | classical probability => ${M("probability")}`,
          ]],
        ],
        mock: { minutes: 45, groups: [group(10, "choice", 1, 1), group(5, "choice", 2, 1), group(4, "numeric", 2, 2), group(3, "numeric", 3, 3)] },
      },
      FIZ: {
        units: [
          ["Physics", [
            `Light | mirrors, refraction, lenses => ${F("spherical-mirrors")}, ${F("optics")}`,
            `Electricity | Ohm's law, power, energy => ${F("current-electricity")}, ${F("electric-power-and-household-circuits")}`,
            `Magnetic effects of current | force, induction => ${F("magnetism-and-induction")}`,
            `Heat | specific heat, latent heat => ${F("calorimetry")}`,
          ]],
        ],
        mock: { minutes: 30, groups: [group(8, "choice", 1, 1), group(4, "numeric", 2, 2), group(2, "numeric", 3, 3)] },
      },
      KEM: {
        units: [
          ["Chemistry", [
            `Chemical reactions and equations | balancing, types => ${K("chemical-reactions-and-equations")}`,
            `Acids, bases and salts | pH, neutralisation => ${K("acids-bases-and-ph")}`,
            `Metals and non-metals | reactivity series, extraction => ${K("metals-and-non-metals")}`,
            `Periodic classification | periodic trends => ${K("periodic-table-and-periodic-properties")}`,
            `Carbon and its compounds | functional groups, naming => ${K("organic-chemistry-nomenclature-and-isomerism")}`,
          ]],
        ],
        mock: { minutes: 30, groups: [group(10, "choice", 1, 1), group(4, "choice", 2, 1)] },
      },
      BIO: {
        units: [
          ["Biology", [
            `Life processes | nutrition, respiration, transport, excretion => ${Bi("life-processes")}`,
            `Reproduction | sexual and asexual reproduction => ${Bi("how-organisms-reproduce")}`,
            `Heredity | Mendel's experiments => ${Bi("heredity-and-variation")}`,
            `Our environment | food chains, energy flow => ${Bi("our-environment")}`,
          ]],
        ],
        mock: { minutes: 30, groups: [group(10, "choice", 1, 1), group(4, "choice", 2, 1)] },
      },
    },
  },
  STATE12: {
    name: "State board Class 12",
    full: "State board Class 12 exams (HSC / PUC / Intermediate)",
    country: "India",
    systems: ["IN-STATE"],
    board: true,
    forLevel: [11, 12],
    about:
      "Each state board sets its own Class 12 (HSC, PUC or Intermediate) papers; many follow the NCERT syllabus, which is also the base of JEE Main, NEET and most state entrance tests (CETs). Papers usually start with objective questions followed by short and long answers. Check your board's latest blueprint; the mock covers objective and short numerical questions on the common topics.",
    subjects: {
      MAT: {
        units: [
          ["Algebra and functions", [
            `Relations, functions and inverse trigonometric functions | principal values => ${M("functions")}, ${M("inverse-trigonometric-functions")}`,
            `Matrices and determinants | determinants, inverse => ${M("matrices-and-determinants")}`,
          ]],
          ["Calculus", [
            `Continuity and differentiability | limits, derivatives => ${M("limits-and-continuity")}, ${M("differentiation")}`,
            `Integrals | definite integrals, areas => ${M("integration")}`,
            `Differential equations | first-order equations => ${M("differential-equations")}`,
          ]],
          ["Vectors, 3D geometry, linear programming and probability", [
            `Vectors and three-dimensional geometry | dot product, lines, planes => ${M("vectors")}, ${M("three-dimensional-geometry")}`,
            `Linear programming | corner-point method => ${M("linear-programming")}`,
            `Probability | conditional probability, Bayes' theorem => ${M("conditional-probability-and-bayes-theorem")}`,
          ]],
        ],
        mock: { minutes: 60, groups: [group(10, "choice", 2, 1), group(6, "choice", 3, 1), group(4, "numeric", 2, 2), group(4, "numeric", 3, 3)] },
      },
      FIZ: {
        units: [
          ["Electricity and magnetism", [
            `Electrostatics | Coulomb's law, capacitors => ${F("electrostatics-and-capacitors")}`,
            `Current electricity | circuits, emf => ${F("current-electricity")}`,
            `Magnetism and EMI | magnetic force, induction => ${F("magnetism-and-induction")}`,
            `Alternating current | rms values, impedance => ${F("alternating-current")}`,
          ]],
          ["Optics, modern physics and electronics", [
            `Optics | mirrors, refraction, lenses => ${F("spherical-mirrors")}, ${F("optics")}`,
            `Dual nature, atoms and nuclei | photoelectric effect, half-life => ${F("modern-physics")}`,
            `Semiconductor electronics | diodes, logic gates => ${F("semiconductors-and-logic-gates")}`,
          ]],
        ],
        mock: { minutes: 45, groups: [group(8, "choice", 1, 1), group(8, "choice", 2, 1), group(4, "numeric", 2, 2), group(3, "numeric", 3, 3)] },
      },
      KEM: {
        units: [
          ["Physical chemistry", [
            `Solutions | colligative properties => ${K("solutions-and-concentration")}, ${K("colligative-properties")}`,
            `Electrochemistry | cells, electrolysis => ${K("electrochemistry")}`,
            `Chemical kinetics | rate law, half-life => ${K("chemical-kinetics")}`,
          ], 35],
          ["Inorganic chemistry", [
            `d- and f-block elements | oxidation states, magnetic moments => ${K("s-p-d-and-f-block-elements")}`,
            `Coordination compounds | isomerism, magnetism => ${K("coordination-compounds")}`,
          ], 25],
          ["Organic chemistry", [
            `Naming and isomerism | IUPAC names, isomers => ${K("organic-chemistry-nomenclature-and-isomerism")}`,
            `Organic reactions | reagents, tests, reactivity => ${K("organic-chemistry-reactions")}`,
          ], 40],
        ],
        mock: { minutes: 30, groups: [group(8, "choice", 1, 1), group(4, "choice", 2, 1), group(3, "numeric", 3, 2)] },
      },
      BIO: {
        units: [
          ["Reproduction, genetics and evolution", [
            `Reproduction | flowering plants, human reproduction => ${Bi("reproduction")}`,
            `Genetics | Mendelian ratios, sex-linked traits => ${Bi("genetics-and-inheritance")}`,
            `Molecular basis of inheritance | DNA, replication => ${Bi("molecular-basis-of-inheritance")}`,
            `Evolution | Hardy–Weinberg principle => ${Bi("evolution")}`,
          ], 50],
          ["Human welfare, biotechnology and ecology", [
            `Human health and disease | pathogens, immunity => ${Bi("human-health-and-disease")}`,
            `Biotechnology | tools and applications => ${Bi("biotechnology")}`,
            `Ecology | populations, ecosystems => ${Bi("ecology-and-environment")}`,
          ], 50],
        ],
        mock: { minutes: 30, groups: [group(10, "choice", 1, 1), group(6, "choice", 2, 1), group(2, "numeric", 3, 2)] },
      },
    },
  },
  GCSE: {
    name: "GCSE",
    full: "GCSE (England, Wales, Northern Ireland)",
    country: "United Kingdom",
    systems: ["GB"],
    about:
      "GCSE exams are taken at the end of Year 11. Maths (Higher tier) has three 1 h 30 min papers of 80 marks, one without a calculator. Separate Physics and Chemistry each have two 1 h 45 min papers of 100 marks with multiple-choice, structured, calculation and extended-response questions. Grades go from 9 (highest) to 1. The mock covers short calculation questions; the grade is an estimate.",
    subjects: {
      MAT: {
        units: [
          ["Number", [
            `Percentages and compound interest | percent change, repeated percentage change => ${M("ratios-rates-and-percentages")}, ${M("exponential-growth-and-decay")}`,
            `Indices and surds | fractional and negative indices, rationalising denominators => ${M("indices-and-surds")}`,
          ], 15],
          ["Algebra", [
            `Quadratic equations | factorising, formula => ${M("quadratic-equations")}`,
            `Simultaneous equations | elimination, substitution => ${M("systems-of-linear-equations")}`,
            `Inequalities | linear and quadratic inequalities => ${M("quadratic-inequalities")}`,
            `Functions | composite and inverse functions => ${M("functions")}`,
            `Sequences | arithmetic and geometric sequences => ${M("arithmetic-progressions")}, ${M("geometric-progressions")}`,
            `Straight-line graphs | gradient, equation of a line => ${M("coordinate-geometry")}`,
          ], 30],
          ["Ratio, proportion and rates of change", [
            `Ratio and proportion | sharing in a ratio, direct proportion => ${M("ratios-rates-and-percentages")}`,
            `Growth and decay | multipliers, depreciation => ${M("exponential-growth-and-decay")}`,
          ], 20],
          ["Geometry and measures", [
            `Pythagoras and trigonometry | SOH CAH TOA => ${M("right-triangle-trigonometry")}`,
            `Circles | area, sectors, equation of a circle => ${M("circles")}`,
            `Circle theorems | angles in a circle, cyclic quadrilaterals, tangents => ${M("circle-theorems")}`,
          ], 20],
          ["Probability and statistics", [
            `Probability | tree diagrams, without replacement => ${M("probability")}`,
            `Averages | mean, median => ${M("statistics-mean-median")}`,
          ], 15],
        ],
        mock: { minutes: 40, groups: [group(6, "numeric", 1, 2), group(7, "numeric", 2, 3), group(5, "numeric", 3, 4)], grades: GRADES_GCSE },
      },
      FIZ: {
        units: [
          ["Energy and particles", [
            `Energy | kinetic and potential energy, power => ${F("work-energy-and-power")}`,
            `Particle model of matter | specific heat capacity, gas pressure => ${F("thermal-physics")}`,
            `Density and pressure in fluids | density, pressure at depth => ${F("density-and-pressure")}`,
          ]],
          ["Electricity and magnetism", [
            `Electricity | series and parallel circuits, power => ${F("current-electricity")}`,
            `Magnetism and electromagnetism | force on a wire, induction => ${F("magnetism-and-induction")}`,
          ]],
          ["Forces and motion", [
            `Motion | equations of motion => ${F("kinematics")}`,
            `Forces | Newton's laws => ${F("laws-of-motion")}`,
            `Momentum | conservation of momentum => ${F("momentum-and-collisions")}`,
          ]],
          ["Waves and atomic structure", [
            `Waves | wave speed, frequency => ${F("waves-and-sound")}`,
            `Light and lenses | refraction, lenses => ${F("optics")}`,
            `Atomic structure | radioactive decay, half-life => ${F("modern-physics")}`,
          ]],
        ],
        mock: { minutes: 35, groups: [group(6, "choice", 1, 1), group(6, "numeric", 2, 3), group(4, "numeric", 3, 4)], grades: GRADES_GCSE },
      },
      KEM: {
        units: [
          ["Atomic structure and quantities", [
            `Atomic structure | protons, neutrons, electrons => ${K("atomic-structure")}`,
            `Quantitative chemistry | moles, reacting masses, concentration => ${K("mole-concept")}, ${K("stoichiometry")}, ${K("solutions-and-concentration")}`,
          ]],
          ["Chemical and energy changes", [
            `Acids and alkalis | pH, neutralisation => ${K("acids-bases-and-ph")}`,
            `Electrolysis | products and masses => ${K("electrochemistry")}`,
            `Energy changes | exothermic and endothermic reactions, bond energies => ${K("thermochemistry")}`,
          ]],
          ["Rates and equilibrium", [
            `Rate of reaction | rate, half-life => ${K("chemical-kinetics")}`,
            `Reversible reactions and equilibrium | equilibrium position => ${K("chemical-equilibrium")}`,
          ]],
          ["Organic chemistry, resources and the atmosphere", [
            `Polymers | addition and condensation polymers => ${K("polymers")}`,
            `Using resources | Haber process, extraction of metals, yield => ${K("industrial-chemistry")}`,
            `Chemistry of the atmosphere | greenhouse gases, pollutants => ${K("environmental-chemistry")}`,
          ]],
        ],
        mock: { minutes: 35, groups: [group(6, "choice", 1, 1), group(6, "numeric", 2, 3), group(4, "numeric", 3, 4)], grades: GRADES_GCSE },
      },
    },
  },
  ALEVEL: {
    name: "A-level",
    full: "A-level / Cambridge International AS & A Level",
    country: "United Kingdom",
    systems: ["GB", "PK", "INTL"],
    about:
      "A-levels are taken at the end of Year 13. Mathematics has three 2-hour papers of 100 marks covering pure mathematics, statistics and mechanics. Physics and Chemistry have three papers of about 2 hours with multiple-choice, structured and practical-skills questions. Grades go from A* to E. Cambridge International AS & A Level examines very similar content. The mock covers calculation questions; the grade is an estimate.",
    subjects: {
      MAT: {
        units: [
          ["Pure mathematics", [
            `Quadratics and functions | discriminant, composite and inverse functions => ${M("quadratic-equations")}, ${M("functions")}`,
            `Exponentials and logarithms | log laws, exponential models => ${M("logarithms")}, ${M("exponential-growth-and-decay")}`,
            `Trigonometry | identities, double angle => ${M("trigonometric-identities")}`,
            `Sequences and series | arithmetic and geometric series => ${M("arithmetic-progressions")}, ${M("geometric-progressions")}`,
            `Coordinate geometry | lines and circles => ${M("coordinate-geometry")}, ${M("circles")}`,
            `Differentiation | tangents, stationary points => ${M("differentiation")}`,
            `Integration | definite integrals, areas => ${M("integration")}`,
            `Vectors | magnitude, scalar product => ${M("vectors")}`,
            `Binomial expansion | (a + b)^n, general term => ${M("binomial-theorem")}`,
          ], 67],
          ["Statistics", [
            `Probability | conditional probability, complement => ${M("probability")}`,
            `Binomial distribution | B(n, p), cumulative probabilities => ${M("binomial-distribution")}`,
            `Data | mean, median => ${M("statistics-mean-median")}`,
            `Measures of spread | variance, standard deviation => ${M("measures-of-dispersion")}`,
            `Correlation and regression | PMCC, regression line => ${M("correlation-and-regression")}`,
            `Normal distribution | standardising, normal probabilities => ${M("normal-distribution")}`,
          ], 17],
          ["Mechanics", [
            `Kinematics | constant acceleration => ${F("kinematics")}, ${F("projectile-motion")}`,
            `Forces and Newton's laws | connected particles, friction => ${F("laws-of-motion")}`,
          ], 16],
        ],
        mock: { minutes: 50, groups: [group(5, "numeric", 2, 4), group(10, "numeric", 3, 6)], grades: GRADES_ALEVEL },
      },
      FIZ: {
        units: withTopics(PHYSICS_UNITS, {
          Mechanics: [
            `Measurements and their errors | SI units, uncertainties => ${F("units-measurement-and-errors")}`,
            `Materials | stress, strain, Young's modulus => ${F("elasticity")}`,
          ],
          "Oscillations, waves and heat": [`Superposition and interference | double slit, diffraction => ${F("wave-optics")}`],
        }),
        mock: { minutes: 45, groups: [group(10, "choice", 2, 1), group(5, "numeric", 2, 4), group(5, "numeric", 3, 6)], grades: GRADES_ALEVEL },
      },
      KEM: {
        units: [
          ...weighted(CHEMISTRY_UNITS, [25, 40]),
          ["Organic chemistry", [
            `Organic nomenclature and isomerism | functional groups, structural and stereoisomers => ${K("organic-chemistry-nomenclature-and-isomerism")}`,
            `Organic reactions | mechanisms, reagents => ${K("organic-chemistry-reactions")}`,
            `Polymers | addition and condensation polymers => ${K("polymers")}`,
          ], 35],
        ],
        mock: { minutes: 45, groups: [group(10, "choice", 2, 1), group(5, "numeric", 2, 4), group(5, "numeric", 3, 6)], grades: GRADES_ALEVEL },
      },
    },
  },
  ABITUR: {
    name: "Abitur",
    full: "Abitur (Deutschland)",
    country: "Germany",
    systems: ["DE"],
    about:
      "The Abitur is set by each federal state, increasingly with tasks from the common pool of the IQB. Mathematics has a part without aids (no calculator or formula sheet) and a longer part with tasks in analysis, analytic geometry or linear algebra, and stochastics. Results are given in points from 15 (best) to 0; 5 points is a pass. The mock covers short calculation tasks; the points are an estimate.",
    subjects: {
      MAT: {
        units: [
          ["Analysis", [
            `Functions | composition, inverse functions => ${M("functions")}`,
            `Exponential and logarithmic functions | growth and decay, logarithms => ${M("exponential-growth-and-decay")}, ${M("logarithms")}`,
            `Differential calculus | tangents, extrema => ${M("differentiation")}`,
            `Integral calculus | definite integrals, areas => ${M("integration")}`,
          ], 50],
          ["Analytic geometry and linear algebra", [
            `Vectors | scalar product, orthogonality => ${M("vectors")}`,
            `Matrices | determinants => ${M("matrices-and-determinants")}`,
          ], 25],
          ["Stochastics", [
            `Probability | multi-stage experiments => ${M("probability")}`,
            `Binomial distribution | Bernoulli chains, variance => ${M("binomial-distribution")}`,
            `Combinatorics | permutations and combinations => ${M("permutations-and-combinations")}`,
          ], 25],
        ],
        mock: { minutes: 45, groups: [group(5, "numeric", 1, 2), group(5, "numeric", 2, 4), group(4, "numeric", 3, 6)], grades: GRADES_ABITUR },
      },
      FIZ: {
        units: [
          ["Mechanics", [
            `Motion and forces | kinematics, Newton's laws => ${F("kinematics")}, ${F("laws-of-motion")}`,
            `Energy and momentum | conservation laws => ${F("work-energy-and-power")}, ${F("momentum-and-collisions")}`,
            `Circular motion and gravitation | centripetal force, gravitational field => ${F("circular-motion-and-gravitation")}`,
          ]],
          ["Fields", [
            `Electric field and capacitors | Coulomb's law, capacitance => ${F("electrostatics-and-capacitors")}`,
            `Magnetic field and induction | Lorentz force, Faraday's law => ${F("magnetism-and-induction")}`,
          ]],
          ["Oscillations and waves", [
            `Oscillations | spring–mass system, pendulum => ${F("oscillations")}`,
            `Waves | standing waves, Doppler effect => ${F("waves-and-sound")}`,
            `Optics | refraction, lenses => ${F("optics")}`,
          ]],
          ["Quantum and atomic physics", [`Quantum objects and nuclei | photoelectric effect, de Broglie wavelength, half-life => ${F("modern-physics")}`]],
        ],
        mock: { minutes: 45, groups: [group(5, "numeric", 1, 2), group(5, "numeric", 2, 4), group(4, "numeric", 3, 6)], grades: GRADES_ABITUR },
      },
      KEM: {
        units: [
          ["Basics", [`Quantities in chemistry | amount of substance, reacting masses => ${K("mole-concept")}, ${K("stoichiometry")}`]],
          ["Equilibrium, acids and bases", [
            `Chemical equilibrium | law of mass action => ${K("chemical-equilibrium")}`,
            `Acids and bases | pH, weak acids => ${K("acids-bases-and-ph")}`,
            `Titrations | concentration, neutralisation => ${K("solutions-and-concentration")}`,
          ]],
          ["Energy, kinetics and electrochemistry", [
            `Energetics | enthalpy, Hess's law, Gibbs energy => ${K("thermochemistry")}`,
            `Reaction kinetics | rate law, half-life => ${K("chemical-kinetics")}`,
            `Electrochemistry | galvanic cells, electrolysis => ${K("electrochemistry")}`,
          ]],
        ],
        mock: { minutes: 45, groups: [group(5, "numeric", 1, 2), group(5, "numeric", 2, 4), group(4, "numeric", 3, 6)], grades: GRADES_ABITUR },
      },
    },
  },
  MATURAAT: {
    name: "Matura (AT)",
    full: "Standardisierte Reifeprüfung (SRDP) – Mathematik",
    country: "Austria",
    systems: ["AT"],
    about:
      "The standardised Matura in mathematics (SRDP) lasts 270 minutes. Part 1 has short tasks on basic competences (multiple choice, matching, gap-fill and short answers); part 2 has longer tasks with several sub-questions. Grades go from 1 (Sehr gut) to 5 (Nicht genügend). Physics and chemistry are not part of the standardised written exam. The mock covers part-1-style tasks and short calculations; the grade is an estimate.",
    subjects: {
      MAT: {
        units: [
          ["Algebra and geometry", [
            `Equations and systems | linear and quadratic equations => ${M("systems-of-linear-equations")}, ${M("quadratic-equations")}`,
            `Vectors | scalar product, orthogonality => ${M("vectors")}`,
            `Trigonometry | right triangles, unit circle => ${M("right-triangle-trigonometry")}, ${M("trigonometric-identities")}`,
          ], 25],
          ["Functional dependencies", [
            `Functions | linear, quadratic, inverse => ${M("functions")}`,
            `Exponential functions | growth and decay, logarithms => ${M("exponential-growth-and-decay")}, ${M("logarithms")}`,
          ], 25],
          ["Analysis", [
            `Sequences | arithmetic and geometric sequences => ${M("arithmetic-progressions")}, ${M("geometric-progressions")}`,
            `Derivatives | rate of change, extrema => ${M("differentiation")}`,
            `Integrals | definite integrals, areas => ${M("integration")}`,
          ], 25],
          ["Probability and statistics", [
            `Statistics | mean, median => ${M("statistics-mean-median")}`,
            `Measures of spread | range, quartiles, standard deviation => ${M("measures-of-dispersion")}`,
            `Probability | multi-stage experiments => ${M("probability")}`,
            `Binomial distribution | P(X = k), variance => ${M("binomial-distribution")}`,
          ], 25],
        ],
        mock: { minutes: 60, groups: [group(8, "choice", 1, 1), group(6, "choice", 2, 1), group(4, "numeric", 2, 2), group(4, "numeric", 3, 3)], grades: GRADES_AT },
      },
    },
  },
  MATURACH: {
    name: "Matura (CH)",
    full: "Gymnasiale Maturität / Maturité gymnasiale (Schweiz)",
    country: "Switzerland",
    systems: ["CH"],
    about:
      "In Switzerland each Gymnasium sets its own written Matura exams (usually 3 to 4 hours) in mathematics and, depending on the profile, in physics or chemistry, plus oral exams. Grades go from 6 (best) to 1; 4 is a pass. A common rule is grade = 5 × points ÷ maximum + 1, rounded to a half grade, and the mock uses it.",
    subjects: {
      MAT: {
        units: [
          ["Algebra and functions", [
            `Equations and inequalities | quadratic equations and inequalities => ${M("quadratic-equations")}, ${M("quadratic-inequalities")}`,
            `Functions, exponentials and logarithms | inverse functions, log laws => ${M("functions")}, ${M("logarithms")}`,
            `Sequences and series | arithmetic and geometric series => ${M("arithmetic-progressions")}, ${M("geometric-progressions")}`,
          ]],
          ["Calculus", [
            `Differential calculus | tangents, extrema => ${M("differentiation")}`,
            `Integral calculus | definite integrals, areas => ${M("integration")}`,
          ]],
          ["Geometry", [
            `Vector geometry | scalar product => ${M("vectors")}`,
            `Trigonometry | identities, triangles => ${M("trigonometric-identities")}, ${M("right-triangle-trigonometry")}`,
          ]],
          ["Stochastics", [
            `Combinatorics and probability | counting, probability => ${M("permutations-and-combinations")}, ${M("probability")}`,
            `Binomial distribution | P(X = k), variance => ${M("binomial-distribution")}`,
          ]],
        ],
        mock: { minutes: 50, groups: [group(5, "numeric", 1, 2), group(6, "numeric", 2, 4), group(4, "numeric", 3, 6)], grades: GRADES_CH },
      },
      FIZ: {
        units: PHYSICS_UNITS,
        mock: { minutes: 45, groups: [group(5, "numeric", 1, 2), group(5, "numeric", 2, 4), group(4, "numeric", 3, 6)], grades: GRADES_CH },
      },
      KEM: {
        units: CHEMISTRY_UNITS,
        mock: { minutes: 45, groups: [group(5, "numeric", 1, 2), group(5, "numeric", 2, 4), group(4, "numeric", 3, 6)], grades: GRADES_CH },
      },
    },
  },
  BAC: {
    name: "Baccalauréat",
    full: "Baccalauréat général – épreuves de spécialité",
    country: "France",
    systems: ["FR", "FR-AF"],
    about:
      "Since the 2021 reform, mathematics and physique-chimie are spécialité exams in Terminale: mathematics lasts 4 hours, physique-chimie 3 h 30, and both are marked out of 20. The mathematics paper often includes a multiple-choice exercise. Many French-speaking African countries have a similar baccalauréat. The mock gives an approximate mark out of 20.",
    subjects: {
      MAT: {
        units: [
          ["Suites", [`Arithmetic and geometric sequences | general term, sums, limits => ${M("arithmetic-progressions")}, ${M("geometric-progressions")}`]],
          ["Fonctions", [
            `Functions | composition, inverse => ${M("functions")}`,
            `Exponential and logarithm | log laws, exponential models => ${M("logarithms")}, ${M("exponential-growth-and-decay")}`,
            `Derivatives and convexity | tangents, variations => ${M("differentiation")}`,
            `Integrals | definite integrals, areas => ${M("integration")}`,
          ]],
          ["Géométrie dans l'espace", [`Vectors and orthogonality | scalar product => ${M("vectors")}`]],
          ["Probabilités", [
            `Combinatorics | permutations and combinations => ${M("permutations-and-combinations")}`,
            `Probability | conditional probability => ${M("probability")}`,
            `Binomial distribution | Bernoulli schemes => ${M("binomial-distribution")}`,
          ]],
        ],
        mock: { minutes: 50, groups: [group(5, "choice", 2, 1), group(5, "numeric", 2, 2), group(4, "numeric", 3, 3)], scale: [0, 20, 0.5] },
      },
      FIZ: {
        units: [
          ["Mouvement et interactions", [
            `Motion and Newton's laws | kinematics, projectiles => ${F("kinematics")}, ${F("projectile-motion")}, ${F("laws-of-motion")}`,
            `Satellites and planets | circular motion, gravitation => ${F("circular-motion-and-gravitation")}`,
          ]],
          ["Énergie", [
            `Energy | work, kinetic and potential energy => ${F("work-energy-and-power")}`,
            `Thermodynamics | heat, gas laws => ${F("thermal-physics")}`,
            `Capacitors and circuits | capacitance, circuits => ${F("electrostatics-and-capacitors")}, ${F("current-electricity")}`,
          ]],
          ["Ondes et signaux", [
            `Waves | wave speed, Doppler effect => ${F("waves-and-sound")}`,
            `Optics | lenses, refraction => ${F("optics")}`,
            `Light and matter | photoelectric effect, radioactivity => ${F("modern-physics")}`,
          ]],
        ],
        mock: { minutes: 45, groups: [group(4, "choice", 2, 1), group(5, "numeric", 2, 2), group(4, "numeric", 3, 3)], scale: [0, 20, 0.5] },
      },
      KEM: {
        units: [
          ["Constitution et transformations de la matière", [
            `Quantities of matter | moles, concentration => ${K("mole-concept")}, ${K("solutions-and-concentration")}`,
            `Acids and bases | pH, weak acids => ${K("acids-bases-and-ph")}`,
            `Kinetics | rate, half-life => ${K("chemical-kinetics")}`,
            `Equilibrium | equilibrium constant => ${K("chemical-equilibrium")}`,
            `Electrochemistry | cells, electrolysis => ${K("electrochemistry")}`,
          ]],
        ],
        mock: { minutes: 40, groups: [group(4, "choice", 2, 1), group(4, "numeric", 2, 2), group(4, "numeric", 3, 3)], scale: [0, 20, 0.5] },
      },
    },
  },
  ENEM: {
    name: "ENEM",
    full: "ENEM (Exame Nacional do Ensino Médio)",
    country: "Brazil",
    systems: ["BR"],
    about:
      "ENEM has 180 multiple-choice questions with five options (A–E) over two days, including 45 in Matemática e suas Tecnologias and 45 in Ciências da Natureza (physics, chemistry and biology). Scores use item response theory (TRI), so typical results range from about 300 to 900. The mock uses five options and about three minutes per question; the score is an estimate.",
    subjects: {
      MAT: {
        units: [
          ["Números e proporções", [
            `Percentages and ratios | percent change, proportion => ${M("ratios-rates-and-percentages")}`,
            `Exponential growth | compound interest => ${M("exponential-growth-and-decay")}`,
          ], 30],
          ["Álgebra e funções", [
            `Functions | evaluating, inverse => ${M("functions")}`,
            `Equations | quadratic equations, systems => ${M("quadratic-equations")}, ${M("systems-of-linear-equations")}`,
            `Sequences | arithmetic and geometric progressions => ${M("arithmetic-progressions")}, ${M("geometric-progressions")}`,
          ], 25],
          ["Geometria", [
            `Plane geometry | circles, sectors => ${M("circles")}`,
            `Trigonometry | right triangles => ${M("right-triangle-trigonometry")}`,
          ], 20],
          ["Estatística e probabilidade", [
            `Statistics | mean, median => ${M("statistics-mean-median")}`,
            `Dispersion | variance, standard deviation => ${M("measures-of-dispersion")}`,
            `Counting and probability | combinations, probability => ${M("permutations-and-combinations")}, ${M("probability")}`,
          ], 25],
        ],
        mock: { minutes: 45, groups: [group(5, "choice", 1, 1, 0, 5), group(7, "choice", 2, 1, 0, 5), group(3, "choice", 3, 1, 0, 5)], scale: [300, 900] },
      },
      FIZ: {
        units: withTopics(PHYSICS_UNITS, {
          Mechanics: [
            `Hydrostatics | density, pressure, Pascal's principle => ${F("density-and-pressure")}`,
            `Buoyancy | Archimedes' principle, flotation => ${F("fluids-and-buoyancy")}`,
          ],
        }),
        mock: { minutes: 45, groups: [group(5, "choice", 1, 1, 0, 5), group(7, "choice", 2, 1, 0, 5), group(3, "choice", 3, 1, 0, 5)], scale: [300, 900] },
      },
      KEM: {
        units: [
          ...weighted(CHEMISTRY_UNITS, [30, 45]),
          ["Environment and materials", [
            `Environmental chemistry | acid rain, greenhouse effect, water treatment => ${K("environmental-chemistry")}`,
            `Polymers | plastics, natural and synthetic polymers => ${K("polymers")}`,
          ], 25],
        ],
        mock: { minutes: 45, groups: [group(5, "choice", 1, 1, 0, 5), group(7, "choice", 2, 1, 0, 5), group(3, "choice", 3, 1, 0, 5)], scale: [300, 900] },
      },
    },
  },
  WASSCE: {
    name: "WAEC WASSCE",
    full: "WAEC – West African Senior School Certificate Examination",
    country: "West Africa",
    systems: ["NG", "GH"],
    about:
      "The WASSCE is taken at the end of senior secondary school in Nigeria, Ghana, Sierra Leone, Liberia and The Gambia. Each subject has an objective paper of 50 multiple-choice questions and a theory paper; the sciences also have a practical. Grades go from A1 (best) to F9; C6 or better is a credit. The mock covers the objective paper at about its real pace; the grade is an estimate.",
    subjects: {
      MAT: {
        units: [
          ["Number and numeration", [
            `Indices and logarithms | laws of indices, log equations => ${M("logarithms")}`,
            `Percentages, ratio and interest | percent change, compound interest => ${M("ratios-rates-and-percentages")}, ${M("exponential-growth-and-decay")}`,
            `Sequences and series | AP and GP => ${M("arithmetic-progressions")}, ${M("geometric-progressions")}`,
            `Surds | simplifying and rationalising surds => ${M("indices-and-surds")}`,
            `Sets and logical reasoning | Venn diagrams, simple statements => ${M("sets-and-logic")}`,
          ], 25],
          ["Algebraic processes", [
            `Quadratic equations | factorisation, formula => ${M("quadratic-equations")}`,
            `Simultaneous equations | elimination, substitution => ${M("systems-of-linear-equations")}`,
            `Inequalities | linear and quadratic => ${M("quadratic-inequalities")}`,
          ], 30],
          ["Mensuration, geometry and trigonometry", [
            `Circles and mensuration | arcs, sectors, areas => ${M("circles")}`,
            `Trigonometry | ratios, elevation and depression => ${M("right-triangle-trigonometry")}`,
            `Coordinate geometry | gradient, distance => ${M("coordinate-geometry")}`,
            `Circle theorems | angles in a circle, cyclic quadrilaterals, tangents => ${M("circle-theorems")}`,
          ], 25],
          ["Statistics and probability", [
            `Statistics | mean, median => ${M("statistics-mean-median")}`,
            `Measures of dispersion | range, variance, standard deviation => ${M("measures-of-dispersion")}`,
            `Probability | simple and combined events => ${M("probability")}`,
          ], 20],
        ],
        mock: { minutes: 40, groups: [group(10, "choice", 1, 1), group(10, "choice", 2, 1), group(5, "choice", 3, 1)], grades: GRADES_WAEC },
      },
      FIZ: {
        units: withTopics(PHYSICS_UNITS, {
          Mechanics: [
            `Fluids at rest | density, relative density, pressure in fluids => ${F("density-and-pressure")}`,
            `Archimedes' principle and flotation | upthrust, law of flotation => ${F("fluids-and-buoyancy")}`,
            `Elastic properties of solids | Hooke's law, Young's modulus => ${F("elasticity")}`,
          ],
        }),
        mock: { minutes: 40, groups: [group(10, "choice", 1, 1), group(10, "choice", 2, 1), group(5, "choice", 3, 1)], grades: GRADES_WAEC },
      },
      KEM: {
        units: [
          ...weighted(CHEMISTRY_UNITS, [30, 50]),
          ["Industry, environment and macromolecules", [
            `Chemical industry | Haber and Contact processes, extraction of metals => ${K("industrial-chemistry")}`,
            `Environmental pollution | air and water pollution => ${K("environmental-chemistry")}`,
            `Polymers | plastics, rubber, addition and condensation => ${K("polymers")}`,
          ], 20],
        ],
        mock: { minutes: 40, groups: [group(10, "choice", 1, 1), group(10, "choice", 2, 1), group(5, "choice", 3, 1)], grades: GRADES_WAEC },
      },
    },
  },
  JAMB: {
    name: "JAMB UTME",
    full: "JAMB UTME (Unified Tertiary Matriculation Examination)",
    country: "Nigeria",
    systems: ["NG"],
    about:
      "The UTME is a computer-based test for admission to Nigerian universities: Use of English (60 questions) and three subjects of 40 questions each, 2 hours in total. Each subject is scored out of 100 (400 in total) and there is no negative marking. The mock covers one subject at the real pace of about 40 seconds per question; the score is an estimate.",
    subjects: {
      MAT: {
        units: [
          ["Number and algebra", [
            `Indices and logarithms | laws, equations => ${M("logarithms")}`,
            `Equations and inequalities | quadratics, simultaneous equations => ${M("quadratic-equations")}, ${M("systems-of-linear-equations")}, ${M("quadratic-inequalities")}`,
            `Sequences and series | AP and GP => ${M("arithmetic-progressions")}, ${M("geometric-progressions")}`,
            `Matrices and determinants | 2×2 and 3×3 determinants => ${M("matrices-and-determinants")}`,
            `Surds | simplifying and rationalising => ${M("indices-and-surds")}`,
            `Sets | set operations, Venn diagrams => ${M("sets-and-logic")}`,
          ]],
          ["Geometry and trigonometry", [
            `Coordinate geometry | gradient, distance, circles => ${M("coordinate-geometry")}, ${M("circles")}`,
            `Trigonometry | ratios, identities => ${M("right-triangle-trigonometry")}, ${M("trigonometric-identities")}`,
            `Circle geometry | angles in a circle, cyclic quadrilaterals => ${M("circle-theorems")}`,
          ]],
          ["Calculus", [`Differentiation and integration | derivatives, definite integrals => ${M("differentiation")}, ${M("integration")}`]],
          ["Statistics", [
            `Statistics and probability | mean, median, counting, probability => ${M("statistics-mean-median")}, ${M("permutations-and-combinations")}, ${M("probability")}`,
            `Measures of dispersion | range, mean deviation, variance, standard deviation => ${M("measures-of-dispersion")}`,
          ]],
        ],
        mock: { minutes: 15, groups: [group(8, "choice", 1, 5), group(8, "choice", 2, 5), group(4, "choice", 3, 5)], scale: [0, 100, 1] },
      },
      FIZ: {
        units: withTopics(PHYSICS_UNITS, {
          Mechanics: [
            `Measurements and units | dimensions, significant figures, errors => ${F("units-measurement-and-errors")}`,
            `Density and pressure | relative density, atmospheric pressure => ${F("density-and-pressure")}`,
            `Liquids at rest | Archimedes' principle, flotation => ${F("fluids-and-buoyancy")}`,
            `Elasticity | Hooke's law, Young's modulus => ${F("elasticity")}`,
          ],
        }),
        mock: { minutes: 15, groups: [group(8, "choice", 1, 5), group(8, "choice", 2, 5), group(4, "choice", 3, 5)], scale: [0, 100, 1] },
      },
      KEM: {
        units: [
          ...weighted(CHEMISTRY_UNITS, [30, 50]),
          ["Industry, environment and macromolecules", [
            `Chemical industry | Haber and Contact processes, extraction of metals => ${K("industrial-chemistry")}`,
            `Environmental pollution | air and water pollution => ${K("environmental-chemistry")}`,
            `Polymers | natural and synthetic polymers => ${K("polymers")}`,
          ], 20],
        ],
        mock: { minutes: 15, groups: [group(8, "choice", 1, 5), group(8, "choice", 2, 5), group(4, "choice", 3, 5)], scale: [0, 100, 1] },
      },
    },
  },
  KCSE: {
    name: "KCSE",
    full: "KCSE (Kenya Certificate of Secondary Education)",
    country: "Kenya",
    systems: ["KE"],
    about:
      "The KCSE is the final exam of Kenya's 8-4-4 system, which the CBC is replacing. Mathematics has two 2 h 30 min papers of 100 marks: section I has 16 short questions and section II longer questions. Physics and Chemistry have two theory papers and a practical. Grades go from A (best) to E. The mock covers short section-I questions; the grade is an estimate.",
    subjects: {
      MAT: {
        units: [
          ["Numbers and algebra", [
            `Indices and logarithms | laws, equations => ${M("logarithms")}`,
            `Equations | quadratic and simultaneous equations => ${M("quadratic-equations")}, ${M("systems-of-linear-equations")}`,
            `Commercial arithmetic | percentages, compound interest => ${M("ratios-rates-and-percentages")}, ${M("exponential-growth-and-decay")}`,
            `Sequences and series | AP and GP => ${M("arithmetic-progressions")}, ${M("geometric-progressions")}`,
            `Matrices | determinants => ${M("matrices-and-determinants")}`,
            `Surds | simplifying, rationalising the denominator => ${M("indices-and-surds")}`,
            `Binomial expansion | Pascal's triangle, approximations => ${M("binomial-theorem")}`,
          ]],
          ["Geometry and trigonometry", [
            `Trigonometry | ratios, identities => ${M("right-triangle-trigonometry")}, ${M("trigonometric-identities")}`,
            `Circles and coordinate geometry | arcs, sectors, equation of a circle => ${M("circles")}, ${M("coordinate-geometry")}`,
            `Vectors | magnitude, scalar product => ${M("vectors")}`,
            `Angle properties of a circle | angles in a circle, cyclic quadrilaterals, tangents => ${M("circle-theorems")}`,
          ]],
          ["Statistics, probability and calculus", [
            `Statistics and probability | mean, median, probability => ${M("statistics-mean-median")}, ${M("probability")}`,
            `Statistics II | quartiles, variance, standard deviation => ${M("measures-of-dispersion")}`,
            `Differentiation and area | derivatives, area under a curve => ${M("differentiation")}, ${M("integration")}`,
          ]],
        ],
        mock: { minutes: 50, groups: [group(8, "numeric", 1, 2), group(6, "numeric", 2, 3), group(3, "numeric", 3, 5)], grades: GRADES_KCSE },
      },
      FIZ: {
        units: withTopics(PHYSICS_UNITS, {
          Mechanics: [
            `Measurement | SI units, significant figures => ${F("units-measurement-and-errors")}`,
            `Pressure | pressure in fluids, atmospheric pressure, hydraulics => ${F("density-and-pressure")}`,
            `Floating and sinking and fluid flow | Archimedes' principle, Bernoulli's effect => ${F("fluids-and-buoyancy")}`,
          ],
        }),
        mock: { minutes: 45, groups: [group(6, "numeric", 1, 2), group(6, "numeric", 2, 3), group(3, "numeric", 3, 5)], grades: GRADES_KCSE },
      },
      KEM: {
        units: [
          ...weighted(CHEMISTRY_UNITS, [30, 55]),
          ["Industrial and organic chemistry", [
            `Nitrogen, sulphur and metals in industry | Haber and Contact processes, extraction of metals => ${K("industrial-chemistry")}`,
            `Organic chemistry II | polymers and fibres => ${K("polymers")}`,
          ], 15],
        ],
        mock: { minutes: 45, groups: [group(6, "numeric", 1, 2), group(6, "numeric", 2, 3), group(3, "numeric", 3, 5)], grades: GRADES_KCSE },
      },
    },
  },
  NSC: {
    name: "NSC (matric)",
    full: "National Senior Certificate (South Africa)",
    country: "South Africa",
    systems: ["ZA"],
    about:
      "The National Senior Certificate (matric) is written at the end of Grade 12. Mathematics has two 3-hour papers of 150 marks. Physical Sciences has paper 1 (physics) and paper 2 (chemistry), each 3 hours and 150 marks, starting with 10 multiple-choice questions. Results are given as achievement levels from 7 (80–100%) to 1. Organic chemistry is covered only through polymers; the level is an estimate.",
    subjects: {
      MAT: {
        units: [
          ["Paper 1: algebra, functions and calculus", [
            `Equations and inequalities | quadratics, simultaneous equations => ${M("quadratic-equations")}, ${M("systems-of-linear-equations")}, ${M("quadratic-inequalities")}`,
            `Patterns, sequences and series | arithmetic and geometric series => ${M("arithmetic-progressions")}, ${M("geometric-progressions")}`,
            `Functions and logarithms | inverse functions, logs => ${M("functions")}, ${M("logarithms")}`,
            `Finance, growth and decay | compound interest, depreciation => ${M("exponential-growth-and-decay")}`,
            `Differential calculus | tangents, cubic graphs, optimisation => ${M("differentiation")}`,
            `Probability | counting principle, probability => ${M("permutations-and-combinations")}, ${M("probability")}`,
          ], 50],
          ["Paper 2: statistics, geometry and trigonometry", [
            `Statistics | mean, median => ${M("statistics-mean-median")}`,
            `Statistics: spread | variance, standard deviation => ${M("measures-of-dispersion")}`,
            `Regression and correlation | least-squares line, correlation coefficient => ${M("correlation-and-regression")}`,
            `Analytical geometry | lines and circles => ${M("coordinate-geometry")}, ${M("circles")}`,
            `Euclidean geometry | circle theorems, cyclic quadrilaterals, tangents => ${M("circle-theorems")}`,
            `Trigonometry | identities, special angles => ${M("trigonometric-identities")}, ${M("right-triangle-trigonometry")}`,
          ], 50],
        ],
        mock: { minutes: 50, groups: [group(6, "numeric", 1, 3), group(6, "numeric", 2, 4), group(4, "numeric", 3, 6)], grades: GRADES_NSC },
      },
      FIZ: {
        units: [
          ["Mechanics", [
            `Newton's laws | forces, friction => ${F("laws-of-motion")}`,
            `Momentum and impulse | conservation of momentum => ${F("momentum-and-collisions")}`,
            `Vertical projectile motion | equations of motion => ${F("kinematics")}, ${F("projectile-motion")}`,
            `Work, energy and power | work–energy theorem => ${F("work-energy-and-power")}`,
          ]],
          ["Waves, electricity and matter", [
            `Doppler effect | sound waves => ${F("waves-and-sound")}`,
            `Electrostatics | Coulomb's law, electric field => ${F("electrostatics-and-capacitors")}`,
            `Electric circuits | internal resistance, power => ${F("current-electricity")}`,
            `Electrodynamics | generators, induction => ${F("magnetism-and-induction")}`,
            `Photoelectric effect | photons, work function => ${F("modern-physics")}`,
          ]],
        ],
        mock: { minutes: 45, groups: [group(5, "choice", 1, 2), group(4, "numeric", 2, 4), group(4, "numeric", 3, 6)], grades: GRADES_NSC },
      },
      KEM: {
        units: [
          ["Chemical change", [
            `Stoichiometry | moles, limiting reactant => ${K("mole-concept")}, ${K("stoichiometry")}`,
            `Rates of reaction | rate, half-life => ${K("chemical-kinetics")}`,
            `Chemical equilibrium | Kc, Le Chatelier => ${K("chemical-equilibrium")}`,
            `Acids and bases | pH, titrations => ${K("acids-bases-and-ph")}, ${K("solutions-and-concentration")}`,
            `Electrochemical reactions | galvanic and electrolytic cells => ${K("electrochemistry")}`,
            `Plastics and polymers | addition and condensation polymerisation => ${K("polymers")}`,
            `Chemical industry | fertilisers, Haber and Contact processes => ${K("industrial-chemistry")}`,
          ]],
        ],
        mock: { minutes: 45, groups: [group(5, "choice", 1, 2), group(4, "numeric", 2, 4), group(4, "numeric", 3, 6)], grades: GRADES_NSC },
      },
    },
  },
};

// Izpiti drugih regij so v svojih datotekah (enaka oblika podatkov).
Object.assign(EXAMS, EXAMS_SI, EXAMS_SOUTHASIA, EXAMS_ASIA, EXAMS_AFRICA, EXAMS_WEST);

export const EXAM_IDS = Object.keys(EXAMS);
export const SUBJECT_NAMES_EN = { MAT: "Mathematics", FIZ: "Physics", KEM: "Chemistry", BIO: "Biology" };

// Državni izpiti (podatki, enaka oblika kot EXAMS v exam-data.js).
// Afrika: Tanzanija, Uganda, Ruanda, Etiopija, Zambija, Zimbabve, Nigerija (NECO, BECE), Gana (BECE).
// Teme so samo iz angleške banke (*-EXB). Kar v banki nima ustrezne teme, je izpuščeno
// (vrzeli so zapisane pri vsakem izpitu v komentarju »Vrzeli«).
// Kjer uradnega opisa formata nismo našli (Ruanda, Etiopija, Zimbabve, nov UCE, BECE), je
// format v »about« opisan splošno in brez izmišljenih številk.
// Biologija na ravni O-level in nižje srednje šole (BECE, Ruanda S3) uporablja teme 10. razreda (life-processes,
// control-and-coordination, how-organisms-reproduce, heredity-and-variation, our-environment); teme razreda 11/12
// (human-physiology, plant-physiology, reproduction …) ostanejo le pri A-levelu, ESSLCE, NECO in kjer O-level gre dlje.
import { M, F, K, Bi, group } from "./exam-helpers.js";

// NECTA (uradna lestvica, bango viwango): CSEE A 75–100 … F 0–29; ACSEE A 80–100 … S 35–39, F 0–34.
const GRADES_CSEE = [[75, "A"], [65, "B"], [45, "C"], [30, "D"], [0, "F"]];
const GRADES_ACSEE = [[80, "A"], [70, "B"], [60, "C"], [50, "D"], [40, "E"], [35, "S"], [0, "F"]];
// NESA (od 2022): A 70–100, B 65–69, C 60–64, D 50–59, E 40–49, S 20–39, F 0–19.
const GRADES_NESA = [[70, "A"], [65, "B"], [60, "C"], [50, "D"], [40, "E"], [20, "S"], [0, "F"]];
// ECZ School Certificate (Performance Review Report 2022, tabela 6).
const GRADES_ECZ = [[75, "1 (distinction)"], [70, "2 (distinction)"], [65, "3 (merit)"], [60, "4 (merit)"], [55, "5 (credit)"], [50, "6 (credit)"], [45, "7 (pass)"], [40, "8 (pass)"], [0, "9 (fail)"]];
// NECO: ista lestvica A1–F9 kot WAEC; odstotne meje so iz sekundarnih virov (približno).
const GRADES_NECO = [[75, "A1"], [70, "B2"], [65, "B3"], [60, "C4"], [55, "C5"], [50, "C6"], [45, "D7"], [40, "E8"], [0, "F9"]];

export const EXAMS_AFRICA = {
  // ------------------------------------------------------------ Tanzanija
  // Vir: https://necta.go.tz/publications/Approved%20Exam%20Formats/CSEE_FORMATS_2022.pdf (uradni formati 041, 031, 032, 033),
  //      https://necta.go.tz/publications/Performance%20Analysis%20Books/Candidates'%20Item%20Response%20Analysis%20(CIRA)%20Reports%20/CSEE/2023/031_%20PHYSICS.pdf
  //      (izbirna vprašanja imajo 5 možnosti A–E), https://necta.go.tz/files/bango viwango Division.pdf (ocene).
  // 041 Basic Mathematics: 3 h, 10 kratkih nalog po 6 t. + 4 strukturirane po 10 t. = 100 t., vse obvezne.
  // 031/032/033 Paper 1: 3 h, A: 10 MCQ (5 možnosti) + 6 povezovalnih (16 t.), B: 6 kratkih po 9 t., C: 2 od 3 po 15 t.
  // Vrzeli: Earth as a sphere, Accounts, transformacije, kongruenca, približki (MAT); elementary astronomy,
  // geophysics, sustainable energy sources (FIZ); bonding/nomenclature na ravni O-level, kakovostna kinetika in
  // ravnotežje (KEM: banka ima le napredno kinetiko/ravnotežje); safety in our environment / first aid (BIO).
  CSEE: {
    name: "NECTA CSEE",
    full: "NECTA CSEE – Certificate of Secondary Education Examination (Form 4)",
    country: "Tanzania",
    systems: ["TZ"],
    board: true,
    forLevel: [8, 11],
    about:
      "The CSEE is written at the end of Form 4 in English. Basic Mathematics is one 3-hour paper of 100 marks: ten 6-mark short-answer questions and four 10-mark structured questions, all compulsory. Physics, Chemistry and Biology Paper 1 (3 hours, 100 marks) starts with 10 multiple-choice items (five options A–E) and 6 matching items, then six 9-mark short-answer questions and two of three 15-mark questions; Paper 2 is a practical. Grades: A 75–100, B 65–74, C 45–64, D 30–44, F below 30. The mock covers objective items and short calculations; the grade is an estimate, check the latest NECTA format.",
    subjects: {
      MAT: {
        units: [
          ["Numbers and algebra", [
            `Exponents, radicals and logarithms | laws of exponents, rationalising, log laws => ${M("indices-and-surds")}, ${M("logarithms")}`,
            `Algebra and quadratic equations | simultaneous equations, factorising, quadratic formula => ${M("systems-of-linear-equations")}, ${M("quadratic-equations")}`,
            `Sets and probability | Venn diagrams, simple probability => ${M("sets-and-logic")}, ${M("probability")}`,
            `Sequences and series | arithmetic and geometric progressions => ${M("arithmetic-progressions")}, ${M("geometric-progressions")}`,
            `Ratios, profit and loss | percentages, rates and variations => ${M("ratios-rates-and-percentages")}`,
            `Functions and relations | domain, range, inverse => ${M("functions")}`,
            `Linear programming | inequalities, maximum and minimum => ${M("linear-programming")}`,
          ], 45],
          ["Geometry and measurement", [
            `Coordinate geometry and vectors | gradient, equation of a line, vector magnitude => ${M("coordinate-geometry")}, ${M("vectors")}`,
            `Similarity and Pythagoras theorem | similar triangles, ratio of areas => ${M("similar-triangles")}`,
            `Trigonometry | ratios, angles of elevation and depression => ${M("right-triangle-trigonometry")}, ${M("trigonometric-identities")}`,
            `Circles | arcs, sectors, circle theorems => ${M("circles")}, ${M("circle-theorems")}`,
            `Three dimensional figures | surface area and volume => ${M("surface-areas-and-volumes")}`,
            `Matrices | determinant, inverse of a 2×2 matrix => ${M("matrices-and-determinants")}`,
          ], 40],
          ["Statistics", [
            `Statistics | mean, median and mode of grouped data => ${M("statistics-of-grouped-data")}, ${M("statistics-mean-median")}`,
          ], 15],
        ],
        mock: { minutes: 50, groups: [group(6, "numeric", 1, 6), group(4, "numeric", 2, 6), group(2, "numeric", 3, 10)], grades: GRADES_CSEE },
      },
      FIZ: {
        units: [
          ["Measurement and properties of matter", [
            `Measurement | units, significant figures, errors => ${F("units-measurement-and-errors")}`,
            `Pressure and density | pressure in liquids, atmospheric pressure => ${F("density-and-pressure")}`,
            `Archimedes' principle and the law of flotation | upthrust, relative density => ${F("fluids-and-buoyancy")}`,
          ]],
          ["Mechanics", [
            `Forces in equilibrium | moments, centre of gravity => ${F("moments-and-equilibrium")}`,
            `Simple machines | mechanical advantage, velocity ratio, efficiency => ${F("machines")}`,
            `Motion in a straight line | equations of motion => ${F("kinematics")}`,
            `Newton's laws of motion and friction | F = ma, momentum => ${F("laws-of-motion")}, ${F("momentum-and-collisions")}`,
            `Work, energy and power | kinetic and potential energy => ${F("work-energy-and-power")}`,
          ]],
          ["Heat", [
            `Measurement of thermal energy | specific heat capacity, latent heat => ${F("calorimetry")}`,
            `Thermal expansion and gas laws | expansion, Boyle's and Charles' laws => ${F("thermal-physics")}`,
          ]],
          ["Light and waves", [
            `Light and optical instruments | reflection, refraction, lenses => ${F("optics")}, ${F("spherical-mirrors")}`,
            `Waves | wave speed, sound => ${F("waves-and-sound")}`,
          ]],
          ["Electricity, magnetism and modern physics", [
            `Static electricity | charges, Coulomb's law => ${F("electrostatics-and-capacitors")}`,
            `Current electricity | Ohm's law, series and parallel, electrical energy => ${F("current-electricity")}, ${F("electric-power-and-household-circuits")}`,
            `Magnetism and electromagnetism | force on a conductor, induction => ${F("magnetism-and-induction")}`,
            `Radioactivity and thermionic emission | half-life, X-rays => ${F("modern-physics")}`,
            `Electronics | diodes, rectification, logic gates => ${F("semiconductors-and-logic-gates")}`,
          ]],
        ],
        mock: { minutes: 45, groups: [group(10, "choice", 1, 1, 0, 5), group(6, "numeric", 2, 3), group(2, "numeric", 3, 5)], grades: GRADES_CSEE },
      },
      KEM: {
        units: [
          ["Matter and the atom", [
            `Atomic structure | protons, neutrons, electron arrangement => ${K("atomic-structure")}`,
            `Periodic classification | groups, periods, valency => ${K("periodic-table-and-periodic-properties")}`,
            `Chemical equations | balancing, types of reactions, redox => ${K("chemical-reactions-and-equations")}`,
          ]],
          ["Quantitative chemistry", [
            `The mole concept and related calculations | moles, empirical formula, reacting masses => ${K("mole-concept")}, ${K("stoichiometry")}`,
            `Volumetric analysis | molarity, titration => ${K("solutions-and-concentration")}`,
            `Acids, bases and salts | pH, neutralisation => ${K("acids-bases-and-ph")}`,
            `Fuels and energy | heat of combustion, energetics => ${K("thermochemistry")}`,
          ]],
          ["Electrolysis and metals", [
            `Ionic theory and electrolysis | products of electrolysis, Faraday's laws => ${K("electrochemistry")}`,
            `Extraction of metals and compounds of metals | reactivity series, displacement => ${K("metals-and-non-metals")}`,
          ]],
          ["Non-metals, organic and environmental chemistry", [
            `Gases and non-metals | oxygen, hydrogen, tests for gases and ions => ${K("identification-of-ions-and-gases")}`,
            `Organic chemistry | hydrocarbons, alcohols, homologous series => ${K("organic-chemistry-nomenclature-and-isomerism")}`,
            `Pollution and soil chemistry | air and water pollution => ${K("environmental-chemistry")}`,
          ]],
        ],
        mock: { minutes: 45, groups: [group(10, "choice", 1, 1, 0, 5), group(6, "numeric", 2, 3), group(2, "numeric", 3, 5)], grades: GRADES_CSEE },
      },
      BIO: {
        units: [
          ["Cells and classification", [
            `Cell structure and organisation | organelles, plant and animal cells => ${Bi("cell-structure-and-biomolecules")}`,
            `Classification of living things | kingdoms, key features => ${Bi("diversity-of-living-organisms")}`,
          ]],
          ["Life processes", [
            `Nutrition, transport and gaseous exchange | digestion, circulation, respiration => ${Bi("life-processes")}`,
            `Excretion, co-ordination and regulation | kidney, nervous system, hormones => ${Bi("control-and-coordination")}, ${Bi("life-processes")}`,
          ]],
          ["Health", [
            `Health and immunity | pathogens, vaccines => ${Bi("human-health-and-disease")}`,
            `HIV, AIDS and STIs | transmission, prevention => ${Bi("human-health-and-disease")}`,
          ]],
          ["Continuity of life and ecology", [
            `Reproduction and growth | reproduction in plants and animals, cell division => ${Bi("how-organisms-reproduce")}, ${Bi("cell-cycle-and-cell-division")}`,
            `Genetics | monohybrid crosses, sex determination => ${Bi("heredity-and-variation")}, ${Bi("genetics-and-inheritance")}`,
            `Evolution | natural selection, evidence => ${Bi("evolution")}`,
            `Balance of nature | food chains, energy flow, conservation => ${Bi("our-environment")}, ${Bi("ecology-and-environment")}`,
          ]],
        ],
        mock: { minutes: 30, groups: [group(10, "choice", 1, 1, 0, 5), group(8, "choice", 2, 1, 0, 5), group(4, "choice", 3, 1, 0, 5)], grades: GRADES_CSEE },
      },
    },
  },
  // Vir: https://necta.go.tz/publications/Approved%20Exam%20Formats/ACSEE_FORMATS_2019.pdf (uradni formati 142, 131, 132, 133),
  //      https://www.necta.go.tz/publications/Performance%20Analysis%20Books/Candidates'%20Item%20Response%20Analysis%20(CIRA)%20Reports%20/ACSEE/2025/131_PHYSICS.pdf
  //      (format 2025 enak kot 2019), https://necta.go.tz/files/bango viwango Division.pdf (ocene).
  // 142 Advanced Mathematics: P1 3 h, 10 strukturiranih po 10 t.; P2 3 h, A: 4 po 15 t., B: 2 od 4 po 20 t.
  // 131/132/133 P1: 3 h, A: 7 kratkih po 10 t., B: 2 od 3 po 15 t.; P2: 3 h, 5 od 6 po 20 t.; P3 praktični.
  // Brez izbirnih vprašanj. Vrzeli: calculating devices, hyperbolic functions, numerical methods (MAT);
  // environmental physics (FIZ); two-component liquid systems, amines, carbonyl compounds podrobno (KEM);
  // comparative studies of natural groups (BIO, le delno prek raznolikosti).
  ACSEE: {
    name: "NECTA ACSEE",
    full: "NECTA ACSEE – Advanced Certificate of Secondary Education Examination (Form 6)",
    country: "Tanzania",
    systems: ["TZ"],
    board: true,
    forLevel: [12, 12],
    about:
      "The ACSEE is written at the end of Form 6 in English, with no multiple-choice questions. Advanced Mathematics has two 3-hour papers of 100 marks: Paper 1 has ten 10-mark structured questions; Paper 2 has four 15-mark questions and two of four 20-mark questions. Physics, Chemistry and Biology have Paper 1 (seven 10-mark short-answer questions and two of three 15-mark questions), Paper 2 (five of six 20-mark questions) and a practical Paper 3. Grades: A 80–100, B 70–79, C 60–69, D 50–59, E 40–49, S 35–39 (subsidiary), F below 35. The mock covers multi-step calculations (Biology: objective questions on the same content); the grade is an estimate, check the latest NECTA format.",
    subjects: {
      MAT: {
        units: [
          ["Advanced Mathematics 1", [
            `Functions | composite and inverse functions, graphs => ${M("functions")}`,
            `Linear programming | feasible region, optimal solution => ${M("linear-programming")}`,
            `Statistics | measures of dispersion, grouped data => ${M("measures-of-dispersion")}, ${M("statistics-of-grouped-data")}`,
            `Sets | set operations, Venn diagrams => ${M("sets-and-logic")}`,
            `Logic | propositions, truth tables => ${M("sets-and-logic")}`,
            `Coordinate geometry I | lines, circles => ${M("coordinate-geometry")}, ${M("circles")}`,
            `Differentiation | rules, tangents, maxima and minima => ${M("differentiation")}`,
            `Integration | definite integrals, areas => ${M("integration")}`,
          ], 50],
          ["Advanced Mathematics 2", [
            `Probability | conditional probability, binomial distribution => ${M("conditional-probability-and-bayes-theorem")}, ${M("binomial-distribution")}`,
            `Vectors | scalar product, lines in space => ${M("vectors")}, ${M("three-dimensional-geometry")}`,
            `Complex numbers | modulus, argument, powers => ${M("complex-numbers")}`,
            `Trigonometry | identities, compound angles => ${M("trigonometric-identities")}`,
            `Algebra | series, binomial theorem, polynomials => ${M("binomial-theorem")}, ${M("geometric-progressions")}, ${M("polynomials")}`,
            `Differential equations | separable and first-order linear equations => ${M("differential-equations")}`,
            `Coordinate geometry II | conic sections => ${M("conic-sections")}`,
          ], 50],
        ],
        mock: { minutes: 50, groups: [group(4, "numeric", 1, 5), group(5, "numeric", 2, 8), group(3, "numeric", 3, 12)], grades: GRADES_ACSEE },
      },
      FIZ: {
        units: [
          ["Physics 1: measurement, mechanics, heat and electricity", [
            `Measurement | dimensions, errors => ${F("units-measurement-and-errors")}`,
            `Mechanics | projectiles, circular motion, gravitation => ${F("projectile-motion")}, ${F("circular-motion-and-gravitation")}`,
            `Simple harmonic motion | pendulum, spring–mass system => ${F("oscillations")}`,
            `Rotation of rigid bodies | moment of inertia, angular momentum => ${F("rotational-motion")}`,
            `Heat | gas laws, first law of thermodynamics, thermal conduction => ${F("thermal-physics")}`,
            `Current electricity | networks, internal resistance, alternating current => ${F("current-electricity")}, ${F("alternating-current")}`,
            `Electronics | diodes, transistors, logic gates => ${F("semiconductors-and-logic-gates")}`,
          ]],
          ["Physics 2: fields, waves, matter and atomic physics", [
            `Fluid dynamics | Bernoulli's equation, viscosity => ${F("fluids-and-buoyancy")}`,
            `Properties of matter | elasticity, Young's modulus => ${F("elasticity")}`,
            `Vibrations and waves | standing waves, Doppler effect, interference => ${F("waves-and-sound")}, ${F("wave-optics")}`,
            `Electrostatics | Coulomb's law, capacitors => ${F("electrostatics-and-capacitors")}`,
            `Electromagnetism | force on a charge, electromagnetic induction => ${F("magnetism-and-induction")}`,
            `Atomic physics | photoelectric effect, radioactivity => ${F("modern-physics")}`,
          ]],
        ],
        mock: { minutes: 45, groups: [group(4, "numeric", 1, 4), group(5, "numeric", 2, 6), group(3, "numeric", 3, 10)], grades: GRADES_ACSEE },
      },
      KEM: {
        units: [
          ["Chemistry 1: physical and inorganic chemistry", [
            `The atom | electronic configuration, spectra => ${K("atomic-structure")}`,
            `Chemical bonding | shapes of molecules, polarity => ${K("chemical-bonding")}`,
            `Gases | ideal gas equation, Graham's law => ${K("gaseous-state")}`,
            `Relative molecular masses in solution | colligative properties => ${K("colligative-properties")}`,
            `Energetics | enthalpy changes, Hess's law => ${K("thermochemistry")}`,
            `Chemical equilibrium | Kc, Kp, Le Chatelier's principle => ${K("chemical-equilibrium")}`,
            `Hydrocarbons and halogen derivatives | naming, isomerism => ${K("organic-chemistry-nomenclature-and-isomerism")}`,
            `Environmental and soil chemistry | pollution => ${K("environmental-chemistry")}`,
          ]],
          ["Chemistry 2: kinetics, electrochemistry and organic reactions", [
            `Chemical kinetics | rate laws, half-life => ${K("chemical-kinetics")}`,
            `Electrochemistry | cell emf, electrolysis => ${K("electrochemistry")}`,
            `Acids, bases and salts | pH, buffers, titrations => ${K("acids-bases-and-ph")}, ${K("solutions-and-concentration")}`,
            `Periodic classification and transition elements | trends, oxidation states => ${K("periodic-table-and-periodic-properties")}, ${K("s-p-d-and-f-block-elements")}`,
            `Extraction of metals | ores, reduction, industrial processes => ${K("industrial-chemistry")}`,
            `Organic compounds and polymers | alcohols, carboxylic acids, polymers => ${K("organic-chemistry-reactions")}, ${K("polymers")}`,
          ]],
        ],
        mock: { minutes: 45, groups: [group(4, "numeric", 1, 4), group(5, "numeric", 2, 6), group(3, "numeric", 3, 10)], grades: GRADES_ACSEE },
      },
      BIO: {
        units: [
          ["Biology 1", [
            `Cytology | cell structure, biomolecules, enzymes => ${Bi("cell-structure-and-biomolecules")}`,
            `Principles of classification | kingdoms and groups => ${Bi("diversity-of-living-organisms")}`,
            `Gaseous exchange, nutrition and transport | respiration, photosynthesis, circulation => ${Bi("plant-physiology")}, ${Bi("human-physiology")}`,
            `Reproduction | gametogenesis, reproduction in plants => ${Bi("reproduction")}`,
            `Coordination | nervous and hormonal coordination => ${Bi("human-physiology")}`,
          ]],
          ["Biology 2", [
            `Genetics | Mendelian inheritance, linkage, DNA => ${Bi("genetics-and-inheritance")}, ${Bi("molecular-basis-of-inheritance")}`,
            `Regulation (homeostasis) | osmoregulation, temperature control => ${Bi("human-physiology")}`,
            `Ecology | energy flow, populations => ${Bi("ecology-and-environment")}`,
            `Growth and development | cell division, growth regulators => ${Bi("cell-cycle-and-cell-division")}, ${Bi("plant-physiology")}`,
            `Evolution | natural selection, Hardy–Weinberg => ${Bi("evolution")}`,
          ]],
        ],
        mock: { minutes: 35, groups: [group(8, "choice", 1, 2), group(8, "choice", 2, 2), group(4, "choice", 3, 3)], grades: GRADES_ACSEE },
      },
    },
  },

  // ------------------------------------------------------------ Uganda
  // Vir: https://www.monitor.co.ug/uganda/news/national/uneb-explains-new-grading-system-under-revised-curriculum-4921732
  //      (prvi UCE po novem kurikulu 2024; ocene A–E brez številskih mej), https://plusnews.ug/we-will-not-put-numerical-values-on-new-uce-grading-system-uneb,
  //      https://www.monitor.co.ug/uganda/news/national/98-of-uce-candidates-pass-under-new-curriculum-uneb-4921928 (80 % izpit, 20 % CA).
  // Natančne zgradbe vprašalnic (število nalog, čas) UNEB ne objavi v dostopni obliki: format opisan splošno.
  // Vrzeli: posebnosti lower-secondary (npr. business mathematics, transformacije) brez banke.
  UCE: {
    name: "UNEB UCE",
    full: "UNEB UCE – Uganda Certificate of Education (S4, competence-based curriculum)",
    country: "Uganda",
    systems: ["UG"],
    board: true,
    forLevel: [8, 11],
    about:
      "Since 2024 the UCE at the end of S4 follows the competence-based lower secondary curriculum. Papers are in English and every item is scenario-based: a real-life situation that you solve in several written steps. The end-of-cycle exam counts 80% and school-based continuous assessment 20%. Results are achievement levels A (exceptional), B (outstanding), C (satisfactory), D (basic) and E (elementary); UNEB publishes no percentage boundaries, so the mock gives no grade. The mock covers multi-step calculations (Biology: objective questions on the same content) from the syllabus; check UNEB's sample papers for the item layout.",
    subjects: {
      MAT: {
        units: [
          ["Numbers and algebra", [
            `Numbers and indices | HCF, LCM, laws of indices, surds => ${M("real-numbers")}, ${M("indices-and-surds")}`,
            `Ratios, rates and percentages | proportion, simple and compound interest => ${M("ratios-rates-and-percentages")}, ${M("exponential-growth-and-decay")}`,
            `Equations and inequalities | linear, simultaneous and quadratic equations => ${M("systems-of-linear-equations")}, ${M("quadratic-equations")}, ${M("quadratic-inequalities")}`,
            `Sets and logic | Venn diagrams, set notation => ${M("sets-and-logic")}`,
            `Sequences | arithmetic and geometric sequences => ${M("arithmetic-progressions")}, ${M("geometric-progressions")}`,
          ]],
          ["Geometry and measures", [
            `Coordinate geometry and vectors | gradient, equation of a line, column vectors => ${M("coordinate-geometry")}, ${M("vectors")}`,
            `Trigonometry and Pythagoras | sine, cosine, tangent, similar shapes => ${M("right-triangle-trigonometry")}, ${M("similar-triangles")}`,
            `Circles, areas and volumes | sectors, prisms, cylinders, cones => ${M("circles")}, ${M("surface-areas-and-volumes")}`,
            `Matrices | operations, determinant => ${M("matrices-and-determinants")}`,
          ]],
          ["Data and probability", [
            `Data handling | mean, median, grouped data => ${M("statistics-mean-median")}, ${M("statistics-of-grouped-data")}`,
            `Probability | experimental and theoretical probability => ${M("probability")}`,
          ]],
        ],
        mock: { minutes: 50, groups: [group(4, "numeric", 1, 2), group(5, "numeric", 2, 3), group(3, "numeric", 3, 5)] },
      },
      FIZ: {
        units: [
          ["Mechanics and properties of matter", [
            `Measurement | SI units, accuracy => ${F("units-measurement-and-errors")}`,
            `Motion | speed, velocity, acceleration => ${F("kinematics")}`,
            `Forces and Newton's laws | friction, momentum => ${F("laws-of-motion")}, ${F("momentum-and-collisions")}`,
            `Turning effect of forces and machines | moments, levers, pulleys => ${F("moments-and-equilibrium")}, ${F("machines")}`,
            `Work, energy and power | energy conversions => ${F("work-energy-and-power")}`,
            `Pressure and density | pressure in fluids, flotation => ${F("density-and-pressure")}, ${F("fluids-and-buoyancy")}`,
          ]],
          ["Heat, light and waves", [
            `Heat | specific heat capacity, latent heat, gas laws => ${F("calorimetry")}, ${F("thermal-physics")}`,
            `Light | reflection, refraction, lenses => ${F("optics")}, ${F("spherical-mirrors")}`,
            `Waves and sound | wave equation => ${F("waves-and-sound")}`,
          ]],
          ["Electricity and modern physics", [
            `Electricity | circuits, Ohm's law, electrical energy => ${F("current-electricity")}, ${F("electric-power-and-household-circuits")}`,
            `Magnetism and electromagnetism | motor effect, induction => ${F("magnetism-and-induction")}`,
            `Nuclear physics | radioactivity, half-life => ${F("modern-physics")}`,
          ]],
        ],
        mock: { minutes: 45, groups: [group(4, "numeric", 1, 2), group(5, "numeric", 2, 3), group(3, "numeric", 3, 5)] },
      },
      KEM: {
        units: [
          ["Matter and its structure", [
            `Atomic structure | particles, electron configuration => ${K("atomic-structure")}`,
            `Periodic table | groups, periods, trends => ${K("periodic-table-and-periodic-properties")}`,
            `Chemical reactions | word and symbol equations, balancing => ${K("chemical-reactions-and-equations")}`,
          ]],
          ["Quantitative chemistry and reactions", [
            `The mole and stoichiometry | moles, reacting masses => ${K("mole-concept")}, ${K("stoichiometry")}`,
            `Acids, bases and salts | pH, neutralisation, titration => ${K("acids-bases-and-ph")}, ${K("solutions-and-concentration")}`,
            `Energy changes in reactions | exothermic and endothermic reactions => ${K("thermochemistry")}`,
            `Electrolysis | products at electrodes => ${K("electrochemistry")}`,
          ]],
          ["Metals, non-metals and carbon", [
            `Metals | reactivity series, extraction => ${K("metals-and-non-metals")}`,
            `Gases and tests for ions | oxygen, hydrogen, carbon dioxide => ${K("identification-of-ions-and-gases")}`,
            `Carbon and its compounds | hydrocarbons, alcohols => ${K("organic-chemistry-nomenclature-and-isomerism")}`,
            `Chemistry and the environment | pollution, water treatment => ${K("environmental-chemistry")}`,
          ]],
        ],
        mock: { minutes: 45, groups: [group(4, "numeric", 1, 2), group(5, "numeric", 2, 3), group(3, "numeric", 3, 5)] },
      },
      BIO: {
        units: [
          ["Cells and diversity", [
            `Cells | structure, specialised cells => ${Bi("cell-structure-and-biomolecules")}`,
            `Classification | kingdoms, vertebrates and invertebrates => ${Bi("diversity-of-living-organisms")}`,
          ]],
          ["Life processes", [
            `Nutrition, transport and gaseous exchange in humans | digestion, circulation, breathing => ${Bi("life-processes")}`,
            `Plants | photosynthesis, transpiration => ${Bi("life-processes")}`,
            `Health and disease | pathogens, immunity, vaccines => ${Bi("human-health-and-disease")}`,
          ]],
          ["Continuity and environment", [
            `Reproduction | in plants and humans => ${Bi("how-organisms-reproduce")}`,
            `Genetics | inheritance, variation => ${Bi("heredity-and-variation")}, ${Bi("genetics-and-inheritance")}`,
            `Ecology | food chains, ecosystems, conservation => ${Bi("our-environment")}, ${Bi("ecology-and-environment")}`,
          ]],
        ],
        mock: { minutes: 30, groups: [group(8, "choice", 1, 1), group(8, "choice", 2, 1), group(4, "choice", 3, 1)] },
      },
    },
  },
  // Vir: https://ncdc.go.ug/wp-content/uploads/2026/07/Principle-Mathematics-Assessment-Guidelines-01.04.Web_File.pdf,
  //      https://ncdc.go.ug/wp-content/uploads/2026/07/Physics-Assessment-Guidelines_Final-edit-15.04.2026_Web-file.pdf,
  //      https://ncdc.go.ug/wp-content/uploads/2026/07/Chemistry-Assessment-Guidelines-01.04.Web_File.pdf,
  //      https://ncdc.go.ug/wp-content/uploads/2026/07/Biology-Assessment-Guidelines_Final-edit-13.05.2026_Web-file.pdf,
  //      https://sanyufm.com/no-separate-uace-examination-for-repeat-candidates-uneb-confirms/ (29. 5. 2026: UACE 2026 po
  //      spremenjenem formatu, scenariji, brez CA). Ocene A–E, O, F (sprememba ocenjevanja napovedana za 2028).
  // Mat P1 2 h: 5 nalog, po ena iz A (geometrija), B (algebra), C (analiza); P2 2 h: 2 od 2 (podatki in verjetnost)
  // + 1 od 2 (mehanika). Fizika P1 2 h 40 min: 4 od 7 nalog po 20 t. Kemija P1 2 h 45 min. Biologija P1 3 h.
  // Vrzeli: partial fractions, error analysis, trapezium rule, iterative methods, flow charts (MAT).
  UACE: {
    name: "UNEB UACE",
    full: "UNEB UACE – Uganda Advanced Certificate of Education (S6)",
    country: "Uganda",
    systems: ["UG"],
    board: true,
    forLevel: [12, 12],
    about:
      "The UACE at the end of S6 is written in English. From 2026 it follows the abridged A-level curriculum with fewer papers and scenario-based items, each a long multi-step task. Principal Mathematics has two 2-hour papers (Paper 1: one item each on geometry, algebra and calculus; Paper 2: data analysis and probability, and mechanics). Physics Paper 1 (2 h 40 min) has seven 20-mark items of which you answer four; Chemistry Paper 1 (2 h 45 min) and Biology Paper 1 (3 h) follow the same idea, plus a practical paper. Principal subjects are graded A–E, O (subsidiary pass) and F. The mock covers multi-step calculations (Biology: objective questions on the same content) and gives no grade; check UNEB's latest sample papers.",
    subjects: {
      MAT: {
        units: [
          ["Paper 1: algebra", [
            `Equations and inequalities | quadratic and rational inequalities => ${M("quadratic-inequalities")}, ${M("quadratic-equations")}`,
            `Permutations and combinations | arrangements, selections => ${M("permutations-and-combinations")}`,
            `Series and the binomial theorem | AP, GP, binomial expansion => ${M("arithmetic-progressions")}, ${M("geometric-progressions")}, ${M("binomial-theorem")}`,
            `Complex numbers | modulus, argument, De Moivre => ${M("complex-numbers")}`,
          ], 20],
          ["Paper 1: geometry", [
            `Coordinate geometry | lines, circles, conics => ${M("coordinate-geometry")}, ${M("circles")}, ${M("conic-sections")}`,
            `Trigonometry | identities, equations => ${M("trigonometric-identities")}`,
            `Vectors | lines and planes => ${M("vectors")}, ${M("three-dimensional-geometry")}`,
          ], 17],
          ["Paper 1: calculus", [
            `Differentiation | rates of change, optimisation => ${M("differentiation")}`,
            `Integration | areas, volumes => ${M("integration")}`,
            `Differential equations | separable equations, growth and decay => ${M("differential-equations")}`,
          ], 30],
          ["Paper 2: data analysis and probability", [
            `Descriptive statistics | mean, standard deviation => ${M("measures-of-dispersion")}`,
            `Correlation and scatter diagrams | rank and product-moment correlation => ${M("correlation-and-regression")}`,
            `Probability theory | conditional probability, Bayes => ${M("conditional-probability-and-bayes-theorem")}`,
            `Probability distributions | binomial and normal distributions => ${M("binomial-distribution")}, ${M("normal-distribution")}`,
          ], 22],
          ["Paper 2: mechanics", [
            `Dynamics | kinematics, Newton's laws, projectiles => ${F("kinematics")}, ${F("laws-of-motion")}, ${F("projectile-motion")}`,
          ], 11],
        ],
        mock: { minutes: 50, groups: [group(4, "numeric", 1, 4), group(5, "numeric", 2, 6), group(3, "numeric", 3, 10)] },
      },
      FIZ: {
        units: [
          ["Force and motion", [
            `Kinematics and projectiles | equations of motion => ${F("kinematics")}, ${F("projectile-motion")}`,
            `Dynamics and momentum | Newton's laws, collisions => ${F("laws-of-motion")}, ${F("momentum-and-collisions")}`,
            `Circular motion and gravitation | centripetal force, orbits => ${F("circular-motion-and-gravitation")}`,
            `Simple harmonic motion | pendulum, spring => ${F("oscillations")}`,
            `Fluids and elasticity | Bernoulli, viscosity, Young's modulus => ${F("fluids-and-buoyancy")}, ${F("elasticity")}`,
          ]],
          ["Energy", [
            `Work, energy and power | efficiency => ${F("work-energy-and-power")}`,
            `Heat and thermodynamics | gas laws, specific heat, latent heat => ${F("thermal-physics")}, ${F("calorimetry")}`,
            `Waves and optics | sound, interference, lenses => ${F("waves-and-sound")}, ${F("wave-optics")}, ${F("optics")}`,
          ]],
          ["Charges and fields", [
            `Electrostatics and capacitors | field, potential, capacitance => ${F("electrostatics-and-capacitors")}`,
            `Current electricity | potential divider, internal resistance => ${F("current-electricity")}`,
            `Electromagnetism and AC | induction, rms values => ${F("magnetism-and-induction")}, ${F("alternating-current")}`,
          ]],
          ["Particles", [
            `Modern physics | photoelectric effect, X-rays, radioactivity => ${F("modern-physics")}`,
            `Electronics | semiconductors, logic gates => ${F("semiconductors-and-logic-gates")}`,
          ]],
        ],
        mock: { minutes: 45, groups: [group(4, "numeric", 1, 4), group(5, "numeric", 2, 6), group(3, "numeric", 3, 10)] },
      },
      KEM: {
        units: [
          ["Atomic structure, bonding and periodicity", [
            `Atomic structure | electron configuration, spectra => ${K("atomic-structure")}`,
            `Chemical bonding | shapes of molecules, polarity => ${K("chemical-bonding")}`,
            `Periodicity | trends, s-, p- and d-block elements => ${K("periodic-table-and-periodic-properties")}, ${K("s-p-d-and-f-block-elements")}`,
          ]],
          ["Organic molecules", [
            `Organic nomenclature and isomerism | functional groups => ${K("organic-chemistry-nomenclature-and-isomerism")}`,
            `Organic reactions | mechanisms, reagents, tests => ${K("organic-chemistry-reactions")}`,
            `Polymers | addition and condensation polymers => ${K("polymers")}`,
          ]],
          ["Stoichiometry, thermochemistry and kinetics", [
            `Stoichiometry | moles, gases, concentration => ${K("mole-concept")}, ${K("stoichiometry")}, ${K("gaseous-state")}`,
            `Thermochemistry | Hess's law, lattice energy => ${K("thermochemistry")}`,
            `Reaction kinetics | rate equations, half-life => ${K("chemical-kinetics")}`,
          ]],
          ["Equilibria and electrochemistry", [
            `Chemical equilibrium | Kc, Kp => ${K("chemical-equilibrium")}`,
            `Acid–base equilibria | pH, buffers => ${K("acids-bases-and-ph")}`,
            `Electrochemical systems | cell emf, electrolysis => ${K("electrochemistry")}`,
            `Solutions | colligative properties => ${K("colligative-properties")}`,
          ]],
        ],
        mock: { minutes: 45, groups: [group(4, "numeric", 1, 4), group(5, "numeric", 2, 6), group(3, "numeric", 3, 10)] },
      },
      BIO: {
        units: [
          ["Cellular organisation, respiration and molecular analysis", [
            `Cells and biomolecules | organelles, enzymes => ${Bi("cell-structure-and-biomolecules")}`,
            `Cell division | mitosis, meiosis => ${Bi("cell-cycle-and-cell-division")}`,
            `Molecular biology | DNA, protein synthesis, biotechnology => ${Bi("molecular-basis-of-inheritance")}, ${Bi("biotechnology")}`,
          ]],
          ["Plant physiology and adaptation", [
            `Plant physiology | photosynthesis, transport, growth regulators => ${Bi("plant-physiology")}`,
            `Plant structure | tissues, root, stem and leaf => ${Bi("plant-anatomy-and-morphology")}`,
          ]],
          ["Organismal systems and homeostasis", [
            `Human systems | circulation, excretion, nervous and hormonal control => ${Bi("human-physiology")}`,
            `Health and immunity | pathogens, immune response => ${Bi("human-health-and-disease")}`,
          ]],
          ["Genetic, evolutionary and ecological dynamics", [
            `Genetics | Mendelian ratios, linkage => ${Bi("genetics-and-inheritance")}`,
            `Evolution | natural selection, Hardy–Weinberg => ${Bi("evolution")}`,
            `Ecology | energy flow, populations => ${Bi("ecology-and-environment")}`,
          ]],
        ],
        mock: { minutes: 35, groups: [group(8, "choice", 1, 2), group(8, "choice", 2, 2), group(4, "choice", 3, 3)] },
      },
    },
  },

  // ------------------------------------------------------------ Ruanda
  // Vir: https://www.ktpress.rw/2022/08/rwanda-national-examination-body-introduces-new-grading-system/ (lestvica A–F),
  //      https://open-exam-prep.com/practice/rw-nesa-ordinary-level (S3, 3-urni pisni izpiti, NESA),
  //      https://www.mineduc.gov.rw/news-detail/the-ministry-of-education-announces-2024-2025-primary-leaving-and-olevel-national-examination-results
  // Uradnega opisa zgradbe vprašalnic (oddelki, točke, trajanje) nismo našli: format opisan splošno.
  RWOL: {
    name: "Rwanda O-level national exam",
    full: "Rwanda Ordinary Level National Examination (S3, NESA)",
    country: "Rwanda",
    systems: ["RW"],
    board: true,
    forLevel: [7, 9],
    about:
      "The O-level national examination is set by NESA at the end of S3 and written in English; Mathematics, Physics, Chemistry and Biology and Health Sciences are all compulsory. Each subject is a written paper with short and structured questions. Each subject is graded A (70–100%), B (65–69), C (60–64), D (50–59), E (40–49), S (20–39) or F. The mock covers short calculations and objective questions; the grade is an estimate, check NESA's latest papers for the section layout.",
    subjects: {
      MAT: {
        units: [
          ["Numbers and algebra", [
            `Numbers and indices | HCF, LCM, indices, surds => ${M("real-numbers")}, ${M("indices-and-surds")}`,
            `Ratios and percentages | proportion, interest => ${M("ratios-rates-and-percentages")}`,
            `Equations and inequalities | simultaneous and quadratic equations => ${M("systems-of-linear-equations")}, ${M("quadratic-equations")}`,
            `Sets | Venn diagrams => ${M("sets-and-logic")}`,
            `Sequences | arithmetic and geometric sequences => ${M("arithmetic-progressions")}, ${M("geometric-progressions")}`,
          ]],
          ["Geometry", [
            `Coordinate geometry and vectors | gradient, distance, vectors => ${M("coordinate-geometry")}, ${M("vectors")}`,
            `Pythagoras, similarity and trigonometry | similar triangles, trigonometric ratios => ${M("similar-triangles")}, ${M("right-triangle-trigonometry")}`,
            `Areas and volumes | circles, solids => ${M("circles")}, ${M("surface-areas-and-volumes")}`,
          ]],
          ["Statistics and probability", [
            `Statistics | mean, median, grouped data => ${M("statistics-mean-median")}, ${M("statistics-of-grouped-data")}`,
            `Probability | simple probability => ${M("probability")}`,
          ]],
        ],
        mock: { minutes: 45, groups: [group(5, "numeric", 1, 2), group(5, "numeric", 2, 3), group(3, "numeric", 3, 5)], grades: GRADES_NESA },
      },
      FIZ: {
        units: [
          ["Mechanics and matter", [
            `Measurement | units, errors => ${F("units-measurement-and-errors")}`,
            `Motion and forces | equations of motion, Newton's laws => ${F("kinematics")}, ${F("laws-of-motion")}`,
            `Work, energy, power and machines | efficiency, levers => ${F("work-energy-and-power")}, ${F("machines")}`,
            `Pressure and density | pressure in fluids => ${F("density-and-pressure")}`,
          ]],
          ["Heat, light and waves", [
            `Heat | specific heat capacity, latent heat => ${F("calorimetry")}`,
            `Light | reflection, refraction, lenses => ${F("optics")}, ${F("spherical-mirrors")}`,
            `Waves and sound | wave speed => ${F("waves-and-sound")}`,
          ]],
          ["Electricity and magnetism", [
            `Electric circuits | Ohm's law, series and parallel => ${F("current-electricity")}`,
            `Electrical energy | power, cost of electricity => ${F("electric-power-and-household-circuits")}`,
            `Magnetism | magnetic effect of a current => ${F("magnetism-and-induction")}`,
          ]],
        ],
        mock: { minutes: 40, groups: [group(5, "choice", 1, 1), group(5, "numeric", 2, 2), group(3, "numeric", 3, 4)], grades: GRADES_NESA },
      },
      KEM: {
        units: [
          ["Matter and atoms", [
            `Atomic structure | particles, electron configuration => ${K("atomic-structure")}`,
            `Periodic table | groups and periods => ${K("periodic-table-and-periodic-properties")}`,
            `Chemical reactions | balancing equations => ${K("chemical-reactions-and-equations")}`,
          ]],
          ["Quantitative chemistry", [
            `The mole | moles, molar mass => ${K("mole-concept")}`,
            `Acids, bases and salts | pH, neutralisation => ${K("acids-bases-and-ph")}`,
            `Metals and non-metals | reactivity series => ${K("metals-and-non-metals")}`,
          ]],
        ],
        mock: { minutes: 35, groups: [group(6, "choice", 1, 1), group(4, "numeric", 2, 2), group(2, "numeric", 3, 4)], grades: GRADES_NESA },
      },
      BIO: {
        units: [
          ["Cells and classification", [
            `Cell structure | plant and animal cells => ${Bi("cell-structure-and-biomolecules")}`,
            `Classification of living things | kingdoms => ${Bi("diversity-of-living-organisms")}`,
          ]],
          ["Human biology and health", [
            `Human body systems | digestion, circulation, breathing => ${Bi("life-processes")}`,
            `Health and diseases | pathogens, prevention => ${Bi("human-health-and-disease")}`,
            `Reproduction | human and plant reproduction => ${Bi("how-organisms-reproduce")}`,
          ]],
          ["Plants and environment", [
            `Plant nutrition | photosynthesis, transport => ${Bi("life-processes")}`,
            `Ecology | food chains, conservation => ${Bi("our-environment")}`,
          ]],
        ],
        mock: { minutes: 30, groups: [group(8, "choice", 1, 1), group(8, "choice", 2, 1), group(4, "choice", 3, 1)], grades: GRADES_NESA },
      },
    },
  },
  // Vir: kot RWOL (lestvica A–F za predmete A-levela enaka kot za osrednje predmete);
  //      https://allafrica.com/stories/202509020241.html (A-level 2024/25, NESA).
  // Format opisan splošno. Vrzeli: nobene posebne (izbor je zožen na teme iz banke).
  RWAL: {
    name: "Rwanda A-level national exam",
    full: "Rwanda Advanced Level National Examination (S6, NESA)",
    country: "Rwanda",
    systems: ["RW"],
    board: true,
    forLevel: [10, 12],
    about:
      "The A-level national examination is set by NESA at the end of S6 and written in English; students sit the subjects of their combination (for example MPC, MCB or PCB). Papers are written with short and structured questions; sciences also have a practical. Each subject is graded A (70–100%), B (65–69), C (60–64), D (50–59), E (40–49), S (20–39) or F. The mock covers multi-step calculations (Biology: objective questions on the same content); the grade is an estimate, check NESA's latest papers for the section layout.",
    subjects: {
      MAT: {
        units: [
          ["Algebra", [
            `Logarithms and exponential functions | equations, growth and decay => ${M("logarithms")}, ${M("exponential-growth-and-decay")}`,
            `Sequences and series | AP, GP, binomial theorem => ${M("arithmetic-progressions")}, ${M("geometric-progressions")}, ${M("binomial-theorem")}`,
            `Complex numbers | modulus, argument => ${M("complex-numbers")}`,
            `Matrices and determinants | inverse, systems of equations => ${M("matrices-and-determinants")}`,
          ]],
          ["Analysis", [
            `Functions and limits | domain, continuity => ${M("functions")}, ${M("limits-and-continuity")}`,
            `Differentiation | rates of change, optimisation => ${M("differentiation")}`,
            `Integration | areas, volumes => ${M("integration")}`,
            `Differential equations | first-order equations => ${M("differential-equations")}`,
          ]],
          ["Geometry, statistics and probability", [
            `Trigonometry | identities, equations => ${M("trigonometric-identities")}`,
            `Vectors and analytic geometry | lines, planes, conics => ${M("vectors")}, ${M("three-dimensional-geometry")}, ${M("conic-sections")}`,
            `Statistics | dispersion, correlation and regression => ${M("measures-of-dispersion")}, ${M("correlation-and-regression")}`,
            `Probability | counting, conditional probability, binomial distribution => ${M("permutations-and-combinations")}, ${M("conditional-probability-and-bayes-theorem")}, ${M("binomial-distribution")}`,
          ]],
        ],
        mock: { minutes: 50, groups: [group(4, "numeric", 1, 3), group(5, "numeric", 2, 5), group(3, "numeric", 3, 8)], grades: GRADES_NESA },
      },
      FIZ: {
        units: [
          ["Mechanics", [
            `Kinematics and projectiles | motion in two dimensions => ${F("kinematics")}, ${F("projectile-motion")}`,
            `Dynamics and momentum | Newton's laws, collisions => ${F("laws-of-motion")}, ${F("momentum-and-collisions")}`,
            `Circular motion and gravitation | orbits => ${F("circular-motion-and-gravitation")}`,
            `Oscillations | simple harmonic motion => ${F("oscillations")}`,
          ]],
          ["Heat and waves", [
            `Thermodynamics | gas laws, first law => ${F("thermal-physics")}`,
            `Waves, sound and light | interference, lenses => ${F("waves-and-sound")}, ${F("wave-optics")}, ${F("optics")}`,
          ]],
          ["Electricity, magnetism and modern physics", [
            `Electrostatics and capacitors | field, potential => ${F("electrostatics-and-capacitors")}`,
            `Electric circuits | Kirchhoff's laws, internal resistance => ${F("current-electricity")}`,
            `Electromagnetic induction and AC | Faraday's law, rms => ${F("magnetism-and-induction")}, ${F("alternating-current")}`,
            `Atomic and nuclear physics | photoelectric effect, radioactivity => ${F("modern-physics")}`,
          ]],
        ],
        mock: { minutes: 45, groups: [group(4, "numeric", 1, 3), group(5, "numeric", 2, 5), group(3, "numeric", 3, 8)], grades: GRADES_NESA },
      },
      KEM: {
        units: [
          ["Physical chemistry", [
            `Atomic structure and bonding | electron configuration, shapes => ${K("atomic-structure")}, ${K("chemical-bonding")}`,
            `Stoichiometry and gases | moles, ideal gas equation => ${K("stoichiometry")}, ${K("gaseous-state")}`,
            `Energetics and kinetics | Hess's law, rate laws => ${K("thermochemistry")}, ${K("chemical-kinetics")}`,
            `Equilibria | Kc, pH, buffers => ${K("chemical-equilibrium")}, ${K("acids-bases-and-ph")}`,
            `Electrochemistry | cells, electrolysis => ${K("electrochemistry")}`,
          ]],
          ["Inorganic and organic chemistry", [
            `Periodic trends and transition metals | properties, complexes => ${K("periodic-table-and-periodic-properties")}, ${K("coordination-compounds")}`,
            `Organic chemistry | nomenclature, isomerism, reactions => ${K("organic-chemistry-nomenclature-and-isomerism")}, ${K("organic-chemistry-reactions")}`,
          ]],
        ],
        mock: { minutes: 45, groups: [group(4, "numeric", 1, 3), group(5, "numeric", 2, 5), group(3, "numeric", 3, 8)], grades: GRADES_NESA },
      },
      BIO: {
        units: [
          ["Cells and molecules", [
            `Cell biology | organelles, biomolecules, enzymes => ${Bi("cell-structure-and-biomolecules")}`,
            `Cell division | mitosis and meiosis => ${Bi("cell-cycle-and-cell-division")}`,
            `Molecular genetics and biotechnology | DNA, protein synthesis => ${Bi("molecular-basis-of-inheritance")}, ${Bi("biotechnology")}`,
          ]],
          ["Organisms", [
            `Human physiology | transport, excretion, coordination => ${Bi("human-physiology")}`,
            `Plant physiology | photosynthesis, transport => ${Bi("plant-physiology")}`,
            `Reproduction | gametogenesis, reproduction in plants => ${Bi("reproduction")}`,
          ]],
          ["Genetics, evolution and ecology", [
            `Genetics | Mendelian inheritance => ${Bi("genetics-and-inheritance")}`,
            `Evolution | natural selection => ${Bi("evolution")}`,
            `Ecology | ecosystems, populations => ${Bi("ecology-and-environment")}`,
          ]],
        ],
        mock: { minutes: 35, groups: [group(8, "choice", 1, 2), group(8, "choice", 2, 2), group(4, "choice", 3, 3)], grades: GRADES_NESA },
      },
    },
  },

  // ------------------------------------------------------------ Etiopija
  // Vir: https://en.wikipedia.org/wiki/Ethiopian_General_Secondary_Education_Certificate_Examination,
  //      https://shega.co/news/only-84-of-ethiopian-students-pass-university-entrance-exams (50 % za vpis, 2024/25),
  //      https://shega.co/news/addis-ababa-to-administer-grade-12-national-exams-online (na univerzah, papir in spletno).
  // Število vprašanj po predmetih se med viri razlikuje (npr. 65 pri matematiki v vzorčnem izpitu): ni navedeno.
  // Vrzeli: dokazovanje (mathematical reasoning je le prek logike v sets-and-logic).
  ESSLCE: {
    name: "Ethiopian Grade 12 national exam",
    full: "Ethiopian Secondary School Leaving Certificate Examination (Grade 12, natural science stream)",
    country: "Ethiopia",
    systems: ["ET"],
    board: true,
    forLevel: [9, 12],
    about:
      "The Grade 12 national exam (ESSLCE, often called the university entrance exam) is set by EAES in English and taken at universities, on paper or online. Every subject is a multiple-choice paper of a few hours; natural-science students sit Mathematics, Physics, Chemistry and Biology besides the common subjects. Each subject is scored out of 100, and an average of at least 50% gives direct entry to a public university. The mock covers multiple-choice questions at an exam-like pace; the score is an estimate, check the latest EAES announcement for question counts.",
    subjects: {
      MAT: {
        units: [
          ["Algebra and functions", [
            `Relations and functions | composition, inverse => ${M("functions")}`,
            `Polynomial, rational and exponential functions | factor theorem, logs => ${M("polynomials")}, ${M("logarithms")}, ${M("exponential-growth-and-decay")}`,
            `Equations and inequalities | quadratic equations and inequalities => ${M("quadratic-equations")}, ${M("quadratic-inequalities")}`,
            `Matrices and determinants | inverse, systems => ${M("matrices-and-determinants")}`,
            `Sequences and series | AP, GP => ${M("arithmetic-progressions")}, ${M("geometric-progressions")}`,
            `Mathematical reasoning | propositions, truth tables => ${M("sets-and-logic")}`,
          ], 35],
          ["Geometry and trigonometry", [
            `Trigonometric functions | identities, equations => ${M("trigonometric-identities")}, ${M("right-triangle-trigonometry")}`,
            `Coordinate geometry and conics | lines, circles, conics => ${M("coordinate-geometry")}, ${M("circles")}, ${M("conic-sections")}`,
            `Vectors | dot product => ${M("vectors")}`,
            `Complex numbers | modulus, polar form => ${M("complex-numbers")}`,
          ], 25],
          ["Calculus", [
            `Limits and continuity | limits of sequences and functions => ${M("limits-and-continuity")}`,
            `Derivatives and applications | rates of change, extrema => ${M("differentiation")}`,
            `Integration | definite integrals, areas => ${M("integration")}`,
          ], 25],
          ["Statistics and probability", [
            `Statistics | measures of location and dispersion => ${M("statistics-of-grouped-data")}, ${M("measures-of-dispersion")}`,
            `Probability | counting, probability of events => ${M("permutations-and-combinations")}, ${M("probability")}`,
          ], 15],
        ],
        mock: { minutes: 50, groups: [group(8, "choice", 1, 1), group(10, "choice", 2, 1), group(5, "choice", 3, 1)], scale: [0, 100, 1] },
      },
      FIZ: {
        units: [
          ["Mechanics", [
            `Vectors and kinematics | motion in one and two dimensions => ${F("kinematics")}, ${F("projectile-motion")}`,
            `Dynamics | Newton's laws, friction => ${F("laws-of-motion")}`,
            `Work, energy and power | conservation of energy => ${F("work-energy-and-power")}`,
            `Momentum and rotational motion | collisions, torque => ${F("momentum-and-collisions")}, ${F("rotational-motion")}`,
            `Equilibrium and gravitation | moments, circular motion => ${F("moments-and-equilibrium")}, ${F("circular-motion-and-gravitation")}`,
            `Fluid mechanics | pressure, buoyancy, Bernoulli => ${F("density-and-pressure")}, ${F("fluids-and-buoyancy")}`,
          ], 40],
          ["Heat, oscillations and waves", [
            `Heat and thermodynamics | gas laws, specific heat => ${F("thermal-physics")}, ${F("calorimetry")}`,
            `Oscillations and waves | simple harmonic motion, sound => ${F("oscillations")}, ${F("waves-and-sound")}`,
            `Optics | reflection, refraction, lenses => ${F("optics")}`,
          ], 25],
          ["Electricity, magnetism and modern physics", [
            `Electrostatics | Coulomb's law, capacitors => ${F("electrostatics-and-capacitors")}`,
            `Current electricity | circuits => ${F("current-electricity")}`,
            `Magnetism and electromagnetic induction | Faraday's law => ${F("magnetism-and-induction")}`,
            `Modern physics and electronics | photoelectric effect, nuclei, semiconductors => ${F("modern-physics")}, ${F("semiconductors-and-logic-gates")}`,
          ], 35],
        ],
        mock: { minutes: 45, groups: [group(8, "choice", 1, 1), group(8, "choice", 2, 1), group(4, "choice", 3, 1)], scale: [0, 100, 1] },
      },
      KEM: {
        units: [
          ["Structure of matter", [
            `Atomic structure and the periodic table | electron configuration, trends => ${K("atomic-structure")}, ${K("periodic-table-and-periodic-properties")}`,
            `Chemical bonding | ionic, covalent, molecular shapes => ${K("chemical-bonding")}`,
            `Physical states of matter | gas laws => ${K("gaseous-state")}`,
          ]],
          ["Physical chemistry", [
            `Solutions and stoichiometry | concentration, reacting amounts => ${K("solutions-and-concentration")}, ${K("stoichiometry")}`,
            `Chemical kinetics and equilibrium | rate, Kc, Le Chatelier => ${K("chemical-kinetics")}, ${K("chemical-equilibrium")}`,
            `Acid–base equilibria | pH, buffers => ${K("acids-bases-and-ph")}`,
            `Thermodynamics | enthalpy, entropy, Gibbs energy => ${K("thermochemistry")}`,
            `Electrochemistry | cells, electrolysis => ${K("electrochemistry")}`,
          ]],
          ["Organic and applied chemistry", [
            `Organic compounds | hydrocarbons, functional groups => ${K("organic-chemistry-nomenclature-and-isomerism")}, ${K("organic-chemistry-reactions")}`,
            `Polymers and industrial chemistry | polymers, industrial processes => ${K("polymers")}, ${K("industrial-chemistry")}`,
            `Environmental chemistry | pollution => ${K("environmental-chemistry")}`,
          ]],
        ],
        mock: { minutes: 45, groups: [group(8, "choice", 1, 1), group(8, "choice", 2, 1), group(4, "choice", 3, 1)], scale: [0, 100, 1] },
      },
      BIO: {
        units: [
          ["Cells, biochemistry and microorganisms", [
            `Cell biology and biochemistry | organelles, enzymes => ${Bi("cell-structure-and-biomolecules")}`,
            `Energy transformation | photosynthesis, cellular respiration => ${Bi("plant-physiology")}`,
            `Microorganisms and biotechnology | microbes, applications => ${Bi("microbes-in-human-welfare")}, ${Bi("biotechnology")}`,
          ]],
          ["Organisms", [
            `Classification | diversity of organisms => ${Bi("diversity-of-living-organisms")}`,
            `Human body systems | digestion, circulation, nervous system => ${Bi("human-physiology")}`,
            `Health and immunity | diseases, immune system => ${Bi("human-health-and-disease")}`,
          ]],
          ["Genetics, evolution and ecology", [
            `Genetics | Mendelian inheritance, DNA => ${Bi("genetics-and-inheritance")}, ${Bi("molecular-basis-of-inheritance")}`,
            `Evolution | theories, evidence => ${Bi("evolution")}`,
            `Ecology | ecosystems, populations => ${Bi("ecology-and-environment")}`,
          ]],
        ],
        mock: { minutes: 40, groups: [group(10, "choice", 1, 1), group(10, "choice", 2, 1), group(5, "choice", 3, 1)], scale: [0, 100, 1] },
      },
    },
  },

  // ------------------------------------------------------------ Zambija
  // Vir: https://www.exams-council.org.zm/wp-content/uploads/2023/06/2022-SCHOOL-CERTIFICATE-SC-EXAMINATION-PERFORMANCE-REPORT.pdf
  //      (ocene 1–9 s %, Physics/Chemistry P1 = 40 obveznih MCQ za 40 t., P2 = A: 8 strukturiranih (50 t.) + B: 3 od 4, P3 šolski),
  //      https://open-exam-prep.com/practice/zm-ecz-sc-gce-mathematics-4024 (4024/1 2 h brez računala, 4024/2 2 h 30 min),
  //      https://www.exams-council.org.zm/wp-content/uploads/2026/06/2024-ECZ-Annual-Report_Online.pdf (zadnji izpiti po kurikulu 2013 v 2028).
  // Grade 9: kurikul se menja (CBC 2023), uradnega opisa ni: izpuščen.
  // Vrzeli: earth geometry, transformations, travel graphs, pseudocode/algorithms (MAT); astronomija (FIZ).
  ECZ12: {
    name: "ECZ Grade 12",
    full: "ECZ School Certificate Examination (Grade 12)",
    country: "Zambia",
    systems: ["ZM"],
    board: true,
    forLevel: [10, 12],
    about:
      "The Grade 12 School Certificate is set by the Examinations Council of Zambia in English (2013 curriculum until 2028). Mathematics has Paper 1 (2 hours, no calculator) and Paper 2 (2 h 30 min, calculator), both with short-answer and structured questions. Physics and Chemistry Paper 1 has 40 compulsory multiple-choice questions (40 marks); Paper 2 has eight compulsory structured questions (50 marks) and three of four longer questions; Biology also has an objective paper and a theory paper. Grades go from 1 (75–100%, distinction) to 9 (below 40%, fail). The mock covers the objective paper and short calculations; the grade is an estimate.",
    subjects: {
      MAT: {
        units: [
          ["Number and algebra", [
            `Sets | Venn diagrams, set notation => ${M("sets-and-logic")}`,
            `Indices, standard form and logarithms | laws of indices, logs => ${M("indices-and-surds")}, ${M("logarithms")}`,
            `Social and commercial arithmetic | percentages, interest => ${M("ratios-rates-and-percentages")}, ${M("exponential-growth-and-decay")}`,
            `Equations and inequalities | quadratic, simultaneous, linear programming => ${M("quadratic-equations")}, ${M("systems-of-linear-equations")}, ${M("linear-programming")}`,
            `Sequences | arithmetic and geometric progressions => ${M("arithmetic-progressions")}, ${M("geometric-progressions")}`,
            `Functions and matrices | composite and inverse functions, 2×2 matrices => ${M("functions")}, ${M("matrices-and-determinants")}`,
          ], 40],
          ["Geometry and trigonometry", [
            `Similarity and mensuration | similar figures, areas, volumes => ${M("similar-triangles")}, ${M("surface-areas-and-volumes")}`,
            `Circles | sectors, circle theorems => ${M("circles")}, ${M("circle-theorems")}`,
            `Trigonometry | ratios, sine and cosine rules => ${M("right-triangle-trigonometry")}, ${M("trigonometric-identities")}`,
            `Coordinate geometry and vectors | midpoint, gradient, vectors => ${M("coordinate-geometry")}, ${M("vectors")}`,
          ], 35],
          ["Statistics, probability and calculus", [
            `Statistics | mean, grouped data, quartiles => ${M("statistics-of-grouped-data")}, ${M("measures-of-dispersion")}`,
            `Probability | combined events => ${M("probability")}`,
            `Calculus | derivatives, normals, definite integrals => ${M("differentiation")}, ${M("integration")}`,
          ], 25],
        ],
        mock: { minutes: 50, groups: [group(6, "numeric", 1, 2), group(6, "numeric", 2, 3), group(3, "numeric", 3, 5)], grades: GRADES_ECZ },
      },
      FIZ: {
        units: [
          ["Mechanics and matter", [
            `Measurements | units, accuracy => ${F("units-measurement-and-errors")}`,
            `Linear motion and forces | equations of motion, Newton's laws => ${F("kinematics")}, ${F("laws-of-motion")}`,
            `Moments and machines | principle of moments, efficiency => ${F("moments-and-equilibrium")}, ${F("machines")}`,
            `Work, energy and power | energy conversions => ${F("work-energy-and-power")}`,
            `Pressure | pressure in liquids, hydraulics => ${F("density-and-pressure")}`,
          ]],
          ["Thermal physics, waves and optics", [
            `Thermal physics | specific heat, latent heat, gas laws => ${F("calorimetry")}, ${F("thermal-physics")}`,
            `Sound waves | wave equation, echoes => ${F("waves-and-sound")}`,
            `Optics | reflection, refraction, lenses => ${F("optics")}, ${F("spherical-mirrors")}`,
          ]],
          ["Electricity, magnetism and atomic physics", [
            `Current electricity | circuits, Ohm's law => ${F("current-electricity")}`,
            `Electrical energy | power, cost, fuses => ${F("electric-power-and-household-circuits")}`,
            `Electromagnetism | motor and generator effects => ${F("magnetism-and-induction")}`,
            `Electronics | diodes, logic gates => ${F("semiconductors-and-logic-gates")}`,
            `Atomic physics | radioactivity, half-life => ${F("modern-physics")}`,
          ]],
        ],
        mock: { minutes: 30, groups: [group(8, "choice", 1, 1), group(8, "choice", 2, 1), group(4, "choice", 3, 1)], grades: GRADES_ECZ },
      },
      KEM: {
        units: [
          ["Matter and structure", [
            `Atomic structure | particles, isotopes => ${K("atomic-structure")}`,
            `Periodic table | groups, trends => ${K("periodic-table-and-periodic-properties")}`,
            `Chemical reactions | equations, redox => ${K("chemical-reactions-and-equations")}`,
          ]],
          ["Quantitative and physical chemistry", [
            `The mole concept | moles, reacting masses, gas volumes => ${K("mole-concept")}, ${K("stoichiometry")}`,
            `Acids, bases and salts | pH, titrations => ${K("acids-bases-and-ph")}, ${K("solutions-and-concentration")}`,
            `Energetics and rates | exothermic reactions, rates => ${K("thermochemistry")}`,
            `Electrolysis | products, electroplating => ${K("electrochemistry")}`,
          ]],
          ["Inorganic and organic chemistry", [
            `Metals | reactivity, extraction => ${K("metals-and-non-metals")}`,
            `Qualitative analysis | tests for ions and gases => ${K("identification-of-ions-and-gases")}`,
            `Organic chemistry | alkanes, alkenes, alcohols, acids => ${K("organic-chemistry-nomenclature-and-isomerism")}, ${K("organic-chemistry-reactions")}`,
          ]],
        ],
        mock: { minutes: 30, groups: [group(8, "choice", 1, 1), group(8, "choice", 2, 1), group(4, "choice", 3, 1)], grades: GRADES_ECZ },
      },
      BIO: {
        units: [
          ["Cells and organisms", [
            `Cell structure and organisation | organelles, specialised cells => ${Bi("cell-structure-and-biomolecules")}`,
            `Classification | kingdoms and groups => ${Bi("diversity-of-living-organisms")}`,
          ]],
          ["Life processes", [
            `Nutrition and transport in plants | photosynthesis, transpiration => ${Bi("life-processes")}`,
            `Human physiology | digestion, respiration, circulation, excretion => ${Bi("life-processes")}, ${Bi("control-and-coordination")}`,
            `Diseases and immunity | pathogens, HIV and AIDS => ${Bi("human-health-and-disease")}`,
          ]],
          ["Continuity and ecology", [
            `Reproduction | plants and humans => ${Bi("how-organisms-reproduce")}`,
            `Genetics and evolution | inheritance, variation => ${Bi("heredity-and-variation")}, ${Bi("genetics-and-inheritance")}, ${Bi("evolution")}`,
            `Ecology | ecosystems, conservation => ${Bi("our-environment")}, ${Bi("ecology-and-environment")}`,
          ]],
        ],
        mock: { minutes: 30, groups: [group(8, "choice", 1, 1), group(8, "choice", 2, 1), group(4, "choice", 3, 1)], grades: GRADES_ECZ },
      },
    },
  },

  // ------------------------------------------------------------ Zimbabve
  // Vir: https://sytbay.co.zw/article/50-essential-zimsec-subject-codes-the-ultimate-2026-guide/ (kode 4004/4075, 4023–4025, 6030–6042),
  //      https://sytbay.co.zw/downloads/zimsec-o-level-mathematics-specimen-papers-4004-1-2026-hbc-syllabus-b-pdf/ (4004/1: 30 kratkih, 2 h 30 min, 100 t.),
  //      https://www5.zimsec.co.zw/syllabi/ (uradni učni načrti, povezave ob preverjanju niso delovale).
  // Prehod na Heritage-Based Curriculum 2024–2030: zgradba vprašalnic naravoslovja ni uradno potrjena, opisana splošno.
  // Ocen ZIMSEC ne objavlja v odstotkih: mock brez ocene.
  ZIMO: {
    name: "ZIMSEC O-level",
    full: "ZIMSEC Ordinary Level (Form 4)",
    country: "Zimbabwe",
    systems: ["ZW"],
    board: true,
    forLevel: [8, 11],
    about:
      "ZIMSEC O-level is written at the end of Form 4 in English, now under the Heritage-Based Curriculum (2024–2030). Mathematics (4004) has two written papers: Paper 1 (about 30 short questions, 2½ hours, 100 marks) is taken without a calculator and Paper 2 has structured questions. Physics, Chemistry, Biology and Combined Science have written theory papers and a practical component. Grades go from A to E, with U ungraded; C or better is a pass. The mock covers short calculations and objective questions and gives no grade; check the current ZIMSEC syllabus for each paper.",
    subjects: {
      MAT: {
        units: [
          ["Number and algebra", [
            `Indices, surds and logarithms | laws of indices, logs => ${M("indices-and-surds")}, ${M("logarithms")}`,
            `Ratios, percentages and consumer arithmetic | interest, percentage change => ${M("ratios-rates-and-percentages")}, ${M("exponential-growth-and-decay")}`,
            `Equations and inequalities | quadratic and simultaneous equations => ${M("quadratic-equations")}, ${M("systems-of-linear-equations")}, ${M("quadratic-inequalities")}`,
            `Sets | Venn diagrams => ${M("sets-and-logic")}`,
            `Functions and matrices | function notation, 2×2 matrices => ${M("functions")}, ${M("matrices-and-determinants")}`,
          ]],
          ["Geometry and measures", [
            `Similarity and mensuration | similar figures, solids => ${M("similar-triangles")}, ${M("surface-areas-and-volumes")}`,
            `Circles | sectors, circle theorems => ${M("circles")}, ${M("circle-theorems")}`,
            `Trigonometry | ratios, sine and cosine rules => ${M("right-triangle-trigonometry")}, ${M("trigonometric-identities")}`,
            `Coordinate geometry and vectors | gradient, vectors => ${M("coordinate-geometry")}, ${M("vectors")}`,
          ]],
          ["Statistics and probability", [
            `Statistics | mean, grouped data => ${M("statistics-mean-median")}, ${M("statistics-of-grouped-data")}`,
            `Probability | combined events => ${M("probability")}`,
          ]],
        ],
        mock: { minutes: 50, groups: [group(8, "numeric", 1, 2), group(6, "numeric", 2, 3), group(3, "numeric", 3, 5)] },
      },
      FIZ: {
        units: [
          ["Mechanics", [
            `Measurement | units, accuracy => ${F("units-measurement-and-errors")}`,
            `Motion and forces | equations of motion, Newton's laws => ${F("kinematics")}, ${F("laws-of-motion")}`,
            `Moments and machines | principle of moments, efficiency => ${F("moments-and-equilibrium")}, ${F("machines")}`,
            `Work, energy, power and pressure | energy, pressure in liquids => ${F("work-energy-and-power")}, ${F("density-and-pressure")}`,
          ]],
          ["Thermal physics, waves and optics", [
            `Thermal physics | specific heat, latent heat => ${F("calorimetry")}`,
            `Waves and sound | wave equation => ${F("waves-and-sound")}`,
            `Light | reflection, refraction, lenses => ${F("optics")}`,
          ]],
          ["Electricity and atomic physics", [
            `Electricity | circuits, power, cost => ${F("current-electricity")}, ${F("electric-power-and-household-circuits")}`,
            `Magnetism and electromagnetism | induction => ${F("magnetism-and-induction")}`,
            `Atomic physics | radioactivity => ${F("modern-physics")}`,
          ]],
        ],
        mock: { minutes: 40, groups: [group(8, "choice", 1, 1), group(4, "numeric", 2, 2), group(3, "numeric", 3, 4)] },
      },
      KEM: {
        units: [
          ["Matter and structure", [
            `Atomic structure and the periodic table | electron arrangement, groups => ${K("atomic-structure")}, ${K("periodic-table-and-periodic-properties")}`,
            `Chemical equations | balancing, redox => ${K("chemical-reactions-and-equations")}`,
          ]],
          ["Quantitative and physical chemistry", [
            `The mole concept | moles, reacting masses => ${K("mole-concept")}, ${K("stoichiometry")}`,
            `Acids, bases and salts | pH, titrations => ${K("acids-bases-and-ph")}, ${K("solutions-and-concentration")}`,
            `Electrolysis and energy changes | electrolysis, exothermic reactions => ${K("electrochemistry")}, ${K("thermochemistry")}`,
          ]],
          ["Inorganic and organic chemistry", [
            `Metals and qualitative analysis | reactivity, tests for ions => ${K("metals-and-non-metals")}, ${K("identification-of-ions-and-gases")}`,
            `Organic chemistry | hydrocarbons, alcohols => ${K("organic-chemistry-nomenclature-and-isomerism")}`,
          ]],
        ],
        mock: { minutes: 40, groups: [group(8, "choice", 1, 1), group(4, "numeric", 2, 2), group(3, "numeric", 3, 4)] },
      },
      BIO: {
        units: [
          ["Cells and organisms", [
            `Cells | structure, specialised cells => ${Bi("cell-structure-and-biomolecules")}`,
            `Classification | kingdoms => ${Bi("diversity-of-living-organisms")}`,
          ]],
          ["Life processes", [
            `Plant nutrition and transport | photosynthesis => ${Bi("life-processes")}`,
            `Human systems | digestion, circulation, excretion => ${Bi("life-processes")}, ${Bi("control-and-coordination")}`,
            `Health and disease | pathogens, immunity => ${Bi("human-health-and-disease")}`,
          ]],
          ["Continuity and ecology", [
            `Reproduction | plants and humans => ${Bi("how-organisms-reproduce")}`,
            `Genetics | inheritance => ${Bi("heredity-and-variation")}, ${Bi("genetics-and-inheritance")}`,
            `Ecology | ecosystems => ${Bi("our-environment")}, ${Bi("ecology-and-environment")}`,
          ]],
        ],
        mock: { minutes: 30, groups: [group(8, "choice", 1, 1), group(8, "choice", 2, 1), group(4, "choice", 3, 1)] },
      },
    },
  },
  // Vir: kot ZIMO (kode 6042 Pure Mathematics, 6032 Physics, 6031 Chemistry, 6030 Biology).
  // Format opisan splošno. Ocene A–E, O (subsidiary pass), F; mock brez ocene.
  ZIMA: {
    name: "ZIMSEC A-level",
    full: "ZIMSEC Advanced Level (Form 6)",
    country: "Zimbabwe",
    systems: ["ZW"],
    board: true,
    forLevel: [12, 12],
    about:
      "ZIMSEC A-level is written at the end of Form 6 (Upper Six) in English. Pure Mathematics (6042) has two 3-hour written papers; Physics (6032), Chemistry (6031) and Biology (6030) have written theory papers and a practical. Grades go from A to E, then O (subsidiary pass) and F. The mock covers multi-step calculations (Biology: objective questions on the same content) and gives no grade; check the current ZIMSEC syllabus for each paper.",
    subjects: {
      MAT: {
        units: [
          ["Algebra", [
            `Functions, logarithms and exponentials | inverse functions, exponential models => ${M("functions")}, ${M("logarithms")}, ${M("exponential-growth-and-decay")}`,
            `Polynomials and inequalities | remainder theorem, inequalities => ${M("polynomials")}, ${M("quadratic-inequalities")}`,
            `Series and the binomial theorem | AP, GP, binomial expansion => ${M("arithmetic-progressions")}, ${M("geometric-progressions")}, ${M("binomial-theorem")}`,
            `Complex numbers and matrices | Argand diagram, determinants => ${M("complex-numbers")}, ${M("matrices-and-determinants")}`,
          ]],
          ["Geometry and calculus", [
            `Trigonometry | identities, equations => ${M("trigonometric-identities")}`,
            `Vectors | lines and planes => ${M("vectors")}, ${M("three-dimensional-geometry")}`,
            `Differentiation | applications => ${M("differentiation")}`,
            `Integration and differential equations | areas, separable equations => ${M("integration")}, ${M("differential-equations")}`,
          ]],
          ["Statistics", [
            `Probability and distributions | binomial and normal distributions => ${M("binomial-distribution")}, ${M("normal-distribution")}`,
            `Data | dispersion, correlation => ${M("measures-of-dispersion")}, ${M("correlation-and-regression")}`,
          ]],
        ],
        mock: { minutes: 50, groups: [group(4, "numeric", 1, 3), group(5, "numeric", 2, 5), group(3, "numeric", 3, 8)] },
      },
      FIZ: {
        units: [
          ["Mechanics", [
            `Kinematics and dynamics | projectiles, Newton's laws, momentum => ${F("kinematics")}, ${F("projectile-motion")}, ${F("laws-of-motion")}, ${F("momentum-and-collisions")}`,
            `Circular motion, gravitation and oscillations | orbits, SHM => ${F("circular-motion-and-gravitation")}, ${F("oscillations")}`,
            `Matter | elasticity, fluids => ${F("elasticity")}, ${F("fluids-and-buoyancy")}`,
          ]],
          ["Thermal physics and waves", [
            `Thermal physics | gas laws, thermodynamics => ${F("thermal-physics")}`,
            `Waves | superposition, interference => ${F("waves-and-sound")}, ${F("wave-optics")}`,
          ]],
          ["Electricity and modern physics", [
            `Electric fields and capacitors | field, potential => ${F("electrostatics-and-capacitors")}`,
            `Circuits | Kirchhoff's laws, internal resistance => ${F("current-electricity")}`,
            `Magnetic fields and induction | flux, Faraday's law, AC => ${F("magnetism-and-induction")}, ${F("alternating-current")}`,
            `Quantum and nuclear physics | photons, radioactivity => ${F("modern-physics")}`,
          ]],
        ],
        mock: { minutes: 45, groups: [group(4, "numeric", 1, 3), group(5, "numeric", 2, 5), group(3, "numeric", 3, 8)] },
      },
      KEM: {
        units: [
          ["Physical chemistry", [
            `Atoms, moles and stoichiometry | electron configuration, reacting amounts => ${K("atomic-structure")}, ${K("mole-concept")}, ${K("stoichiometry")}`,
            `Bonding and states of matter | shapes, gas laws => ${K("chemical-bonding")}, ${K("gaseous-state")}`,
            `Energetics and kinetics | Hess's law, rate equations => ${K("thermochemistry")}, ${K("chemical-kinetics")}`,
            `Equilibria and electrochemistry | Kc, pH, cells => ${K("chemical-equilibrium")}, ${K("acids-bases-and-ph")}, ${K("electrochemistry")}`,
          ]],
          ["Inorganic and organic chemistry", [
            `Periodicity and transition elements | trends, complexes => ${K("periodic-table-and-periodic-properties")}, ${K("coordination-compounds")}`,
            `Organic chemistry | nomenclature, reactions, polymers => ${K("organic-chemistry-nomenclature-and-isomerism")}, ${K("organic-chemistry-reactions")}, ${K("polymers")}`,
          ]],
        ],
        mock: { minutes: 45, groups: [group(4, "numeric", 1, 3), group(5, "numeric", 2, 5), group(3, "numeric", 3, 8)] },
      },
      BIO: {
        units: [
          ["Cells and molecules", [
            `Cell structure and biological molecules | organelles, enzymes => ${Bi("cell-structure-and-biomolecules")}`,
            `Cell division and nucleic acids | mitosis, meiosis, DNA => ${Bi("cell-cycle-and-cell-division")}, ${Bi("molecular-basis-of-inheritance")}`,
          ]],
          ["Physiology", [
            `Plant physiology | photosynthesis, transport => ${Bi("plant-physiology")}`,
            `Human physiology | transport, homeostasis, coordination => ${Bi("human-physiology")}`,
            `Immunity and disease | pathogens, immune response => ${Bi("human-health-and-disease")}`,
          ]],
          ["Genetics, evolution and ecology", [
            `Inheritance | Mendelian genetics => ${Bi("genetics-and-inheritance")}`,
            `Evolution | selection, Hardy–Weinberg => ${Bi("evolution")}`,
            `Ecology | energy flow, populations => ${Bi("ecology-and-environment")}`,
          ]],
        ],
        mock: { minutes: 35, groups: [group(8, "choice", 1, 2), group(8, "choice", 2, 2), group(4, "choice", 3, 3)] },
      },
    },
  },

  // ------------------------------------------------------------ Nigerija in Gana
  // Vir: https://syllabus.ng/neco/mathematics/ (učni načrt; navaja P1 50 MCQ v 1½ h, uradni urniki NECO pa imajo za objektivni
//      del matematike 1 h 45 min, zato je število vprašanj v »about« splošno),
  //      https://nuffic.nl/en/education-systems/nigeria/grades-and-study-results (lestvica A1–F9 velja za WAEC in NECO),
  //      https://nannews.ng/neco-releases-2025-internal-ssce-results-lauds-tinubus-support/
  // Ni forLevel: privzeti izpit za SS ostane WASSCE. Vrzeli: transformations, number bases, constructions (MAT).
  NECO: {
    name: "NECO SSCE",
    full: "NECO SSCE – Senior School Certificate Examination (Nigeria)",
    country: "Nigeria",
    systems: ["NG"],
    board: true,
    about:
      "The NECO SSCE is Nigeria's own school-leaving exam at the end of SS 3, taken in June–July (internal) and November–December (external), in English. Each subject has an objective paper of multiple-choice questions (Mathematics: about 50–60 questions, timetabled at 1 h 45 min) and an essay paper; the sciences also have a practical. Grades go from A1 (best) to F9 as for WAEC; C6 or better is a credit. The mock covers the objective paper at about its real pace; the grade is an estimate.",
    subjects: {
      MAT: {
        units: [
          ["Number and numeration", [
            `Indices and logarithms | laws of indices, log equations => ${M("indices-and-surds")}, ${M("logarithms")}`,
            `Percentages, ratio and interest | percent change, compound interest => ${M("ratios-rates-and-percentages")}, ${M("exponential-growth-and-decay")}`,
            `Sets and sequences | Venn diagrams, logical reasoning, AP and GP => ${M("sets-and-logic")}, ${M("arithmetic-progressions")}, ${M("geometric-progressions")}`,
          ], 25],
          ["Algebraic processes", [
            `Quadratic and simultaneous equations | factorisation, formula, elimination => ${M("quadratic-equations")}, ${M("systems-of-linear-equations")}`,
            `Inequalities and variation | linear and quadratic inequalities => ${M("quadratic-inequalities")}`,
            `Matrices and determinants | 2×2 matrices => ${M("matrices-and-determinants")}`,
          ], 30],
          ["Mensuration, geometry and trigonometry", [
            `Mensuration and circles | arcs, sectors, solids, circle theorems => ${M("circles")}, ${M("surface-areas-and-volumes")}, ${M("circle-theorems")}`,
            `Trigonometry | ratios, elevation and depression, sine and cosine rules => ${M("right-triangle-trigonometry")}, ${M("trigonometric-identities")}`,
            `Coordinate geometry | gradient, distance, midpoint => ${M("coordinate-geometry")}`,
            `Vectors in a plane | components, magnitude, addition => ${M("vectors")}`,
          ], 25],
          ["Statistics and probability", [
            `Statistics | mean, median, grouped data => ${M("statistics-mean-median")}, ${M("statistics-of-grouped-data")}`,
            `Measures of dispersion | range, variance, standard deviation => ${M("measures-of-dispersion")}`,
            `Probability | simple and combined events => ${M("probability")}`,
          ], 20],
        ],
        mock: { minutes: 40, groups: [group(10, "choice", 1, 1), group(10, "choice", 2, 1), group(5, "choice", 3, 1)], grades: GRADES_NECO },
      },
      FIZ: {
        units: [
          ["Mechanics and matter", [
            `Motion | equations of motion, projectiles => ${F("kinematics")}, ${F("projectile-motion")}`,
            `Forces and momentum | Newton's laws, collisions => ${F("laws-of-motion")}, ${F("momentum-and-collisions")}`,
            `Work, energy, power and machines | efficiency, mechanical advantage => ${F("work-energy-and-power")}, ${F("machines")}`,
            `Equilibrium and pressure | moments, density, flotation => ${F("moments-and-equilibrium")}, ${F("density-and-pressure")}, ${F("fluids-and-buoyancy")}`,
            `Elastic properties of solids | Hooke's law, Young's modulus => ${F("elasticity")}`,
          ]],
          ["Heat, waves and optics", [
            `Heat | specific heat, latent heat, gas laws => ${F("calorimetry")}, ${F("thermal-physics")}`,
            `Waves and sound | wave equation, resonance => ${F("waves-and-sound")}`,
            `Light | reflection, refraction, lenses, mirrors => ${F("optics")}, ${F("spherical-mirrors")}`,
          ]],
          ["Electricity and modern physics", [
            `Electrostatics and current electricity | capacitors, circuits => ${F("electrostatics-and-capacitors")}, ${F("current-electricity")}`,
            `Magnetism and electromagnetic induction | AC => ${F("magnetism-and-induction")}, ${F("alternating-current")}`,
            `Atomic and nuclear physics | photoelectric effect, radioactivity => ${F("modern-physics")}`,
          ]],
        ],
        mock: { minutes: 40, groups: [group(10, "choice", 1, 1), group(10, "choice", 2, 1), group(5, "choice", 3, 1)], grades: GRADES_NECO },
      },
      KEM: {
        units: [
          ["Structure of matter", [
            `Atomic structure and periodicity | electron configuration, trends => ${K("atomic-structure")}, ${K("periodic-table-and-periodic-properties")}`,
            `Chemical bonding | ionic and covalent bonds => ${K("chemical-bonding")}`,
            `Gas laws | ideal gas equation => ${K("gaseous-state")}`,
          ]],
          ["Physical chemistry", [
            `Stoichiometry and the mole | reacting masses => ${K("mole-concept")}, ${K("stoichiometry")}`,
            `Acids, bases, salts and volumetric analysis | pH, titrations => ${K("acids-bases-and-ph")}, ${K("solutions-and-concentration")}`,
            `Energy, rates and equilibrium | enthalpy, Le Chatelier => ${K("thermochemistry")}, ${K("chemical-equilibrium")}`,
            `Redox and electrolysis | oxidation numbers, electrolysis => ${K("chemical-reactions-and-equations")}, ${K("electrochemistry")}`,
          ]],
          ["Inorganic and organic chemistry", [
            `Metals and non-metals | extraction, industrial processes => ${K("metals-and-non-metals")}, ${K("industrial-chemistry")}`,
            `Organic chemistry | hydrocarbons, functional groups => ${K("organic-chemistry-nomenclature-and-isomerism")}, ${K("organic-chemistry-reactions")}`,
            `Polymers | plastics, rubber, addition and condensation => ${K("polymers")}`,
            `Chemistry and the environment | air and water pollution => ${K("environmental-chemistry")}`,
          ]],
        ],
        mock: { minutes: 40, groups: [group(10, "choice", 1, 1), group(10, "choice", 2, 1), group(5, "choice", 3, 1)], grades: GRADES_NECO },
      },
      BIO: {
        units: [
          ["Cells and diversity", [
            `Cell biology | structure, biomolecules => ${Bi("cell-structure-and-biomolecules")}`,
            `Classification of living things | kingdoms => ${Bi("diversity-of-living-organisms")}`,
          ]],
          ["Life processes", [
            `Nutrition and transport | photosynthesis, digestion, circulation => ${Bi("life-processes")}, ${Bi("plant-physiology")}, ${Bi("human-physiology")}`,
            `Reproduction and growth | reproduction in plants and animals => ${Bi("how-organisms-reproduce")}, ${Bi("reproduction")}`,
            `Health | diseases, immunity => ${Bi("human-health-and-disease")}`,
          ]],
          ["Genetics, evolution and ecology", [
            `Genetics | Mendelian inheritance, sex-linked traits => ${Bi("heredity-and-variation")}, ${Bi("genetics-and-inheritance")}`,
            `Evolution | theories, adaptation => ${Bi("evolution")}`,
            `Ecology | ecosystems, food chains => ${Bi("our-environment")}, ${Bi("ecology-and-environment")}`,
          ]],
        ],
        mock: { minutes: 40, groups: [group(10, "choice", 1, 1), group(10, "choice", 2, 1), group(5, "choice", 3, 1)], grades: GRADES_NECO },
      },
    },
  },
  // Vir: https://www.channelstv.com/2025/07/09/neco-releases-2025-bece-results-sets-date-for-re-sit-examination
  //      (NECO BECE za Federal Unity Colleges), https://en.wikipedia.org/wiki/Basic_Education_Certificate_Examination,
  //      https://syllabus.ng/bece/basic-science-and-technology/
  // Meje ocen se med viri razlikujejo (A–F): mock brez ocene. Državni BECE (ministrstva zveznih držav) ima svoje papirje.
  // Vrzeli: number bases, approximation, constructions (MAT); basic technology, computer studies, PHE (BST).
  BECENG: {
    name: "BECE (Nigeria)",
    full: "BECE – Basic Education Certificate Examination (JSS 3, Nigeria)",
    country: "Nigeria",
    systems: ["NG"],
    board: true,
    forLevel: [7, 9],
    about:
      "The BECE is written at the end of JSS 3: NECO sets it for Federal Unity Colleges and each state ministry sets its own. Mathematics and Basic Science and Technology have objective (multiple-choice) papers and theory papers, in English. Results are given as letter grades from distinction to fail; English and Mathematics are needed to pass. The science paper is integrated; here it is split into physics, chemistry and biology topics. The mock covers objective questions and gives no grade.",
    subjects: {
      MAT: {
        units: [
          ["Number and numeration", [
            `Whole numbers and fractions | HCF, LCM, prime factors => ${M("real-numbers")}`,
            `Indices and standard form | laws of indices => ${M("indices-and-surds")}`,
            `Percentages, ratio and simple interest | profit and loss => ${M("ratios-rates-and-percentages")}`,
          ]],
          ["Algebra", [
            `Linear and simultaneous equations | substitution, elimination => ${M("systems-of-linear-equations")}`,
            `Sets | Venn diagrams => ${M("sets-and-logic")}`,
          ]],
          ["Geometry, mensuration and statistics", [
            `Pythagoras and similar triangles | similarity => ${M("similar-triangles")}`,
            `Trigonometric ratios | sine, cosine, tangent => ${M("right-triangle-trigonometry")}`,
            `Areas and volumes | circles, cylinders, cones => ${M("circles")}, ${M("surface-areas-and-volumes")}`,
            `Statistics and probability | mean, median, simple probability => ${M("statistics-mean-median")}, ${M("probability")}`,
          ]],
        ],
        mock: { minutes: 40, groups: [group(12, "choice", 1, 1), group(10, "choice", 2, 1), group(3, "choice", 3, 1)] },
      },
      FIZ: {
        units: [
          ["Energy and forces (Basic Science)", [
            `Forms of energy and work | energy, work, power => ${F("work-energy-and-power")}`,
            `Simple machines | levers, pulleys => ${F("machines")}`,
            `Heat and temperature | heat transfer => ${F("calorimetry")}`,
          ]],
          ["Electricity and light (Basic Science)", [
            `Electricity | simple circuits, electrical energy => ${F("current-electricity")}, ${F("electric-power-and-household-circuits")}`,
            `Light | reflection, refraction => ${F("optics")}`,
          ]],
        ],
        mock: { minutes: 20, groups: [group(8, "choice", 1, 1), group(6, "choice", 2, 1)] },
      },
      KEM: {
        units: [
          ["Matter and change (Basic Science)", [
            `Atoms and elements | atomic structure, symbols => ${K("atomic-structure")}`,
            `Chemical changes | equations, types of reactions => ${K("chemical-reactions-and-equations")}`,
            `Acids, bases and salts | indicators, neutralisation => ${K("acids-bases-and-ph")}`,
          ]],
        ],
        mock: { minutes: 20, groups: [group(8, "choice", 1, 1), group(6, "choice", 2, 1)] },
      },
      BIO: {
        units: [
          ["Living things (Basic Science)", [
            `Living things | classification => ${Bi("diversity-of-living-organisms")}`,
            `Human body systems | digestion, circulation, breathing => ${Bi("life-processes")}`,
            `Reproduction and health | reproduction, diseases => ${Bi("how-organisms-reproduce")}, ${Bi("human-health-and-disease")}`,
            `Environment | ecosystems, pollution => ${Bi("our-environment")}`,
          ]],
        ],
        mock: { minutes: 20, groups: [group(8, "choice", 1, 1), group(6, "choice", 2, 1)] },
      },
    },
  },
  // Vir: https://www.graphic.com.gh/news/general-news/ghana-news-2025-bece-begins-tomorrow-over-600-000-candidates-set-to-write.html
  //      (prvi BECE po Common Core Programme), https://www.adomonline.com/waec-releases-timetable-for-2025-bece/ (P1 in P2 v eni seji),
  //      https://www.scribd.com/document/755200173/2024-BECE-MATHEMATICS-SAMPLE-QUESTIONS-FROM-WAEC-1 (Mat P1: 40 objektivnih, 1 h, 40 t.).
  // Ocene 1–9 (relativne): mock brez ocene. Vrzeli: number bases, geometric constructions, mapping (MAT).
  BECEGH: {
    name: "BECE (Ghana)",
    full: "WAEC BECE – Basic Education Certificate Examination (JHS 3, Ghana)",
    country: "Ghana",
    systems: ["GH"],
    board: true,
    forLevel: [7, 9],
    about:
      "The BECE is written by WAEC at the end of JHS 3, in English, under the new Common Core Programme. Mathematics has Paper 1 with 40 multiple-choice questions (1 hour, 40 marks) and an essay Paper 2, taken in one sitting; Science also has an objective paper and an essay paper. Each subject is graded 1 (highest) to 9, and the grades decide the senior high school placement. Science is one paper; here it is split into physics, chemistry and biology topics. The mock covers the objective paper and gives no grade.",
    subjects: {
      MAT: {
        units: [
          ["Number", [
            `Numbers and numeration | HCF, LCM, standard form => ${M("real-numbers")}, ${M("indices-and-surds")}`,
            `Ratio, proportion and percentages | rates, simple interest => ${M("ratios-rates-and-percentages")}`,
            `Sets | Venn diagrams => ${M("sets-and-logic")}`,
          ]],
          ["Algebra", [
            `Linear equations and inequalities | simultaneous equations => ${M("systems-of-linear-equations")}`,
            `Linear relations | gradient, equation of a line => ${M("coordinate-geometry")}`,
          ]],
          ["Geometry, measurement and data", [
            `Shapes and measurement | Pythagoras, similar figures => ${M("similar-triangles")}`,
            `Areas and volumes | circles, prisms, cylinders => ${M("circles")}, ${M("surface-areas-and-volumes")}`,
            `Vectors | column vectors, magnitude => ${M("vectors")}`,
            `Handling data and probability | mean, median, probability => ${M("statistics-mean-median")}, ${M("probability")}`,
          ]],
        ],
        mock: { minutes: 40, groups: [group(12, "choice", 1, 1), group(10, "choice", 2, 1), group(3, "choice", 3, 1)] },
      },
      FIZ: {
        units: [
          ["Forces and energy (Science)", [
            `Forces and motion | speed, Newton's laws => ${F("kinematics")}, ${F("laws-of-motion")}`,
            `Energy and machines | work, power, simple machines => ${F("work-energy-and-power")}, ${F("machines")}`,
            `Electricity | circuits, electrical energy => ${F("current-electricity")}, ${F("electric-power-and-household-circuits")}`,
            `Light and heat | reflection, heat transfer => ${F("optics")}, ${F("calorimetry")}`,
          ]],
        ],
        mock: { minutes: 20, groups: [group(8, "choice", 1, 1), group(6, "choice", 2, 1)] },
      },
      KEM: {
        units: [
          ["Matter (Science)", [
            `Particles and the atom | atomic structure => ${K("atomic-structure")}`,
            `Elements, compounds and reactions | equations, types of reactions => ${K("chemical-reactions-and-equations")}`,
            `Acids, bases and salts | indicators, neutralisation => ${K("acids-bases-and-ph")}`,
          ]],
        ],
        mock: { minutes: 20, groups: [group(8, "choice", 1, 1), group(6, "choice", 2, 1)] },
      },
      BIO: {
        units: [
          ["Living systems (Science)", [
            `Diversity of living things | classification => ${Bi("diversity-of-living-organisms")}`,
            `Cells and human body systems | cells, digestion, circulation => ${Bi("cell-structure-and-biomolecules")}, ${Bi("life-processes")}`,
            `Reproduction and health | reproduction, diseases => ${Bi("how-organisms-reproduce")}, ${Bi("human-health-and-disease")}`,
            `Ecosystems | food chains, conservation => ${Bi("our-environment")}`,
          ]],
        ],
        mock: { minutes: 20, groups: [group(8, "choice", 1, 1), group(6, "choice", 2, 1)] },
      },
    },
  },
};

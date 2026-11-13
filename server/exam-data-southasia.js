// Državni izpiti (podatki, enaka oblika kot EXAMS v exam-data.js).
// Južna Azija in Egipt: Pakistan, Bangladeš, Nepal, Šrilanka, Egipt.
// Teme so samo iz angleške banke (*-EXB). Kar v banki nima ustrezne teme, je izpuščeno
// (vrzeli so zapisane pri vsakem izpitu v komentarju »Vrzeli«). Indijske teme (GST ipd.)
// niso uporabljene.
import { M, F, K, Bi, group } from "./exam-helpers.js";

// Bangladeš (SSC/HSC): ocene po odstotku, GPA v oklepaju.
const GRADES_BD = [[80, "A+ (5.00)"], [70, "A (4.00)"], [60, "A− (3.50)"], [50, "B (3.00)"], [40, "C (2.00)"], [33, "D (1.00)"], [0, "F"]];
// Nepal (NEB, SEE in razred 12): A+ 90 … D 35, pod 35 % NG.
const GRADES_NEB = [[90, "A+"], [80, "A"], [70, "B+"], [60, "B"], [50, "C+"], [40, "C"], [35, "D"], [0, "NG"]];
// Šrilanka: O/L A 75, B 65, C 50, S 35, sicer W; A/L enako, sicer F.
const GRADES_LK_OL = [[75, "A"], [65, "B"], [50, "C"], [35, "S"], [0, "W"]];
const GRADES_LK_AL = [[75, "A"], [65, "B"], [50, "C"], [35, "S"], [0, "F"]];
// Prag za vpis (MDCAT: 55 % medicina, 50 % stomatologija; Bangladeš MBBS: 40 točk od 100).
const GRADES_MDCAT = [[55, "pass mark for MBBS reached (55 %)"], [50, "pass mark for BDS only (50 %)"], [0, "below the pass mark"]];
const GRADES_MBBSBD = [[40, "pass mark reached (40 of 100)"], [0, "below the pass mark (40 of 100)"]];

// ------------------------------------------------------------ Pakistan: skupni sklopi FSc
// FSc (razreda 11–12) je osnova za HSSC, MDCAT (PMDC kurikulum 2025 sledi FSc) in ECAT.
const PK_FSC_MAT = [
  ["Algebra (Part I)", [
    `Number systems and complex numbers | operations, modulus, conjugate => ${M("complex-numbers")}`,
    `Sets, functions and groups | set operations, Venn diagrams, logic and truth tables => ${M("sets-and-logic")}`,
    `Matrices and determinants | inverse, solving systems => ${M("matrices-and-determinants")}`,
    `Quadratic equations | nature of roots, sum and product of roots => ${M("quadratic-equations")}`,
    `Sequences and series | arithmetic and geometric sequences and series => ${M("arithmetic-progressions")}, ${M("geometric-progressions")}`,
    `Permutation, combination and probability | arrangements, selections, probability => ${M("permutations-and-combinations")}, ${M("probability")}`,
    `Mathematical induction and binomial theorem | general term, binomial coefficients, middle term => ${M("binomial-theorem")}`,
  ], 30],
  ["Trigonometry (Part I)", [
    `Trigonometric identities | compound angles, double and half angles => ${M("trigonometric-identities")}`,
    `Inverse trigonometric functions | principal values => ${M("inverse-trigonometric-functions")}`,
  ], 20],
  ["Calculus (Part II)", [
    `Functions and limits | composition, inverse, limits, continuity => ${M("functions")}, ${M("limits-and-continuity")}`,
    `Differentiation | rules, tangents, maxima and minima => ${M("differentiation")}`,
    `Integration | definite integrals, area under a curve => ${M("integration")}`,
    `Differential equations | variables separable => ${M("differential-equations")}`,
  ], 30],
  ["Geometry, vectors and linear programming (Part II)", [
    `Introduction to analytic geometry | straight lines, distance, slope => ${M("coordinate-geometry")}`,
    `Linear inequalities and linear programming | feasible region, corner points => ${M("linear-programming")}`,
    `Conic sections: circle | equation of a circle, tangents => ${M("circles")}`,
    `Conic sections: parabola, ellipse and hyperbola | focus, directrix, eccentricity => ${M("conic-sections")}`,
    `Vectors | scalar and vector product => ${M("vectors")}`,
  ], 20],
];
const PK_FSC_FIZ = [
  ["Mechanics (Part I)", [
    `Measurements | SI units, significant figures, uncertainties, dimensions => ${F("units-measurement-and-errors")}`,
    `Vectors and equilibrium | torque, conditions of equilibrium => ${F("moments-and-equilibrium")}`,
    `Motion and force | equations of motion, Newton's laws, momentum => ${F("kinematics")}, ${F("laws-of-motion")}, ${F("momentum-and-collisions")}`,
    `Projectile motion | range, maximum height => ${F("projectile-motion")}`,
    `Work and energy | work–energy principle, power => ${F("work-energy-and-power")}`,
    `Rotational and circular motion | centripetal force, moment of inertia, orbits => ${F("circular-motion-and-gravitation")}, ${F("rotational-motion")}`,
    `Fluid dynamics | viscosity, Stokes' law, equation of continuity, Bernoulli's equation => ${F("fluids-and-buoyancy")}`,
  ], 30],
  ["Oscillations, waves, optics and heat (Part I)", [
    `Oscillations | simple harmonic motion, pendulum => ${F("oscillations")}`,
    `Waves | speed of sound, stationary waves, Doppler effect => ${F("waves-and-sound")}`,
    `Physical optics | Young's double slit, diffraction grating, polarisation => ${F("wave-optics")}`,
    `Thermodynamics | gas laws, first law, Carnot engine => ${F("thermal-physics")}`,
  ], 20],
  ["Electricity and magnetism (Part II)", [
    `Electrostatics | Coulomb's law, electric field, capacitors => ${F("electrostatics-and-capacitors")}`,
    `Current electricity | resistance, Kirchhoff's rules, emf => ${F("current-electricity")}`,
    `Electromagnetism and electromagnetic induction | force on a conductor, Faraday's law => ${F("magnetism-and-induction")}`,
    `Alternating current | rms values, reactance, impedance => ${F("alternating-current")}`,
  ], 30],
  ["Solids, electronics and modern physics (Part II)", [
    `Physics of solids | stress, strain, Young's modulus => ${F("elasticity")}`,
    `Electronics | p–n junction, rectification, logic gates => ${F("semiconductors-and-logic-gates")}`,
    `Dawn of modern physics, atomic spectra and nuclear physics | photoelectric effect, half-life => ${F("modern-physics")}`,
  ], 20],
];
const PK_FSC_KEM = [
  ["Physical chemistry (Part I)", [
    `Basic concepts | mole, Avogadro's number, limiting reactant => ${K("mole-concept")}, ${K("stoichiometry")}`,
    `Gases | gas laws, ideal gas equation, Graham's law => ${K("gaseous-state")}`,
    `Atomic structure | electronic configuration, hydrogen spectrum => ${K("atomic-structure")}`,
    `Chemical bonding | VSEPR, hybridisation => ${K("chemical-bonding")}`,
    `Thermochemistry | enthalpy changes, Hess's law => ${K("thermochemistry")}`,
    `Chemical equilibrium | Kc, Le Chatelier's principle, pH => ${K("chemical-equilibrium")}, ${K("acids-bases-and-ph")}`,
    `Solutions | concentration units, colligative properties => ${K("solutions-and-concentration")}, ${K("colligative-properties")}`,
    `Electrochemistry | oxidation numbers, electrolysis, cells => ${K("electrochemistry")}`,
    `Reaction kinetics | rate, order, half-life => ${K("chemical-kinetics")}`,
  ], 45],
  ["Inorganic chemistry (Part II)", [
    `Periodic classification of elements | periodic trends => ${K("periodic-table-and-periodic-properties")}`,
    `s- and p-block elements | groups I, II, III, IV, V, VI, VII => ${K("s-p-d-and-f-block-elements")}`,
    `Transition elements | complex compounds => ${K("s-p-d-and-f-block-elements")}, ${K("coordination-compounds")}`,
  ], 15],
  ["Organic chemistry (Part II)", [
    `Fundamental principles of organic chemistry | functional groups, isomerism => ${K("organic-chemistry-nomenclature-and-isomerism")}`,
    `Hydrocarbons, alkyl halides, alcohols, aldehydes, ketones and carboxylic acids | reactions => ${K("organic-chemistry-reactions")}`,
    `Macromolecules | addition and condensation polymers, monomers => ${K("polymers")}`,
  ], 30],
  ["Applied chemistry (Part II)", [
    `Common chemical industries | fertilisers (ammonia, urea), reaction conditions and yield => ${K("industrial-chemistry")}`,
    `Environmental chemistry | air and water pollution, ozone depletion, acid rain => ${K("environmental-chemistry")}`,
  ], 10],
];
const PK_FSC_BIO = [
  ["Cell biology and diversity (Part I)", [
    `Biological molecules and enzymes | carbohydrates, proteins, enzyme action => ${Bi("cell-structure-and-biomolecules")}`,
    `Cell structure and function | organelles, prokaryotes and eukaryotes => ${Bi("cell-structure-and-biomolecules")}`,
    `Variety of life and kingdoms | viruses, bacteria, fungi, plants, animals => ${Bi("diversity-of-living-organisms")}`,
  ], 25],
  ["Physiology (Parts I and II)", [
    `Bioenergetics | photosynthesis, respiration => ${Bi("plant-physiology")}`,
    `Nutrition, gaseous exchange and transport | digestion, breathing, circulation => ${Bi("human-physiology")}, ${Bi("plant-physiology")}`,
    `Homeostasis, support, coordination and control | excretion, nervous and hormonal control => ${Bi("human-physiology")}`,
    `Immunity | immune system, vaccination => ${Bi("human-health-and-disease")}`,
    `Reproduction | human and plant reproduction => ${Bi("reproduction")}`,
  ], 35],
  ["Genetics, evolution and ecology (Part II)", [
    `Cell cycle | mitosis and meiosis => ${Bi("cell-cycle-and-cell-division")}`,
    `Variation and genetics | Mendelian inheritance, blood groups, sex-linkage => ${Bi("genetics-and-inheritance")}`,
    `Chromosomes and DNA | replication, protein synthesis => ${Bi("molecular-basis-of-inheritance")}`,
    `Biotechnology | recombinant DNA, PCR => ${Bi("biotechnology")}`,
    `Evolution | natural selection, Hardy–Weinberg => ${Bi("evolution")}`,
    `Ecosystem and environment | energy flow, pyramids => ${Bi("ecology-and-environment")}`,
  ], 40],
];

// MDCAT: PMDC enotni kurikulum 2025 (velja tudi za 2026) je ožji od FSc in ima svoje enote
// (biologija skoraj samo človek; brez merjenja, fizikalne optike, trdnin, raztopin, okoljske kemije).
const PK_MDCAT_BIO = [
  ["Cells, molecules and microbes", [
    `Acellular life | viruses, HIV and AIDS => ${Bi("human-health-and-disease")}`,
    `Biological molecules | water, carbohydrates, proteins, lipids, nucleic acids => ${Bi("cell-structure-and-biomolecules")}`,
    `Enzymes | mode of action, factors affecting rate, inhibitors => ${Bi("cell-structure-and-biomolecules")}`,
    `Cell structure and function | prokaryotic and eukaryotic cells, organelles, chromosomes => ${Bi("cell-structure-and-biomolecules")}`,
  ], 25],
  ["Human physiology", [
    `Coordination and control | receptors, neurons, reflex arc, brain => ${Bi("human-physiology")}`,
    `Circulation | heart, cardiac cycle, blood vessels, lymphatic system => ${Bi("human-physiology")}`,
    `Respiration | respiratory system, gas exchange in the lungs => ${Bi("human-physiology")}`,
    `Digestion | digestive system and associated glands => ${Bi("life-processes")}`,
    `Homeostasis | kidney, osmoregulation, thermoregulation, excretion => ${Bi("human-physiology")}`,
    `Immunity | specific defence mechanisms => ${Bi("human-health-and-disease")}`,
  ], 45],
  ["Reproduction, inheritance, evolution and biotechnology", [
    `Reproduction | human reproductive system, menstrual cycle, sexually transmitted diseases => ${Bi("reproduction")}`,
    `Inheritance | Mendel's laws, linkage and crossing over, sex-linked inheritance, haemophilia => ${Bi("genetics-and-inheritance")}`,
    `Evolution | Lamarckism, Darwinism => ${Bi("evolution")}`,
    `Biotechnology and health care | vaccines, DNA probes, monoclonal antibodies => ${Bi("biotechnology")}`,
  ], 30],
];
const PK_MDCAT_KEM = [
  ["Physical chemistry", [
    `Fundamental concepts | mole, limiting and excess reactants => ${K("mole-concept")}, ${K("stoichiometry")}`,
    `Atomic structure | orbitals, electronic configuration => ${K("atomic-structure")}`,
    `Gases | gas laws, ideal gas equation => ${K("gaseous-state")}`,
    `Chemical bonding | VSEPR, hybridisation, polarity, bond energy => ${K("chemical-bonding")}`,
    `Thermochemistry and energetics | first law, enthalpy, Hess's law => ${K("thermochemistry")}`,
    `Chemical equilibrium | Le Chatelier's principle, solubility product, buffers, Haber process => ${K("chemical-equilibrium")}, ${K("acids-bases-and-ph")}`,
    `Reaction kinetics | rate equation, order, activation energy => ${K("chemical-kinetics")}`,
    `Electrochemistry | oxidation numbers, electrode potentials => ${K("electrochemistry")}`,
  ], 45],
  ["Inorganic chemistry", [
    `s- and p-block elements | periodic trends, reactions of groups I, II and IV => ${K("periodic-table-and-periodic-properties")}, ${K("s-p-d-and-f-block-elements")}`,
    `Transition elements | electronic structure of d-block elements and ions => ${K("s-p-d-and-f-block-elements")}`,
  ], 15],
  ["Organic chemistry", [
    `Fundamental principles of organic chemistry | classification, functional groups, isomerism => ${K("organic-chemistry-nomenclature-and-isomerism")}`,
    `Hydrocarbons, alkyl halides, alcohols, phenols, aldehydes, ketones and carboxylic acids | reactions and mechanisms => ${K("organic-chemistry-reactions")}`,
    `Macromolecules and industrial chemistry | proteins, addition and condensation polymers, adhesives, dyes => ${K("polymers")}`,
  ], 40],
];
const PK_MDCAT_FIZ = [
  ["Mechanics", [
    `Vectors and equilibrium | rectangular components, scalar and vector products, torque => ${M("vectors")}, ${F("moments-and-equilibrium")}`,
    `Force and motion | equations of motion, Newton's laws, momentum, collisions => ${F("kinematics")}, ${F("laws-of-motion")}, ${F("momentum-and-collisions")}`,
    `Projectile motion | time of flight, range, maximum height => ${F("projectile-motion")}`,
    `Work and energy | work, power, potential energy => ${F("work-energy-and-power")}`,
    `Rotational and circular motion | angular velocity, centripetal force => ${F("circular-motion-and-gravitation")}, ${F("rotational-motion")}`,
    `Fluid dynamics | fluid drag, viscosity, equation of continuity, Bernoulli's equation => ${F("fluids-and-buoyancy")}`,
  ], 35],
  ["Waves and thermodynamics", [
    `Waves | progressive and stationary waves, SHM, interference of sound, Doppler effect => ${F("waves-and-sound")}, ${F("oscillations")}`,
    `Thermodynamics | first law, heat engines => ${F("thermal-physics")}`,
  ], 15],
  ["Electricity and magnetism", [
    `Electrostatics | Coulomb's law, electric field and potential, capacitors => ${F("electrostatics-and-capacitors")}`,
    `Current electricity | resistance, temperature coefficient, Kirchhoff's rules => ${F("current-electricity")}`,
    `Electromagnetism and electromagnetic induction | force on a conductor, Faraday's law => ${F("magnetism-and-induction")}`,
    `Alternating current | resistors, capacitors and inductors in AC circuits => ${F("alternating-current")}`,
  ], 30],
  ["Electronics and modern physics", [
    `Electronics | p–n junction, rectification => ${F("semiconductors-and-logic-gates")}`,
    `Dawn of modern physics, atomic spectra and nuclear physics | photons, line spectra, half-life => ${F("modern-physics")}`,
  ], 20],
];

// ------------------------------------------------------------ Bangladeš: HSC sklopi (tudi za MBBS)
const BD_HSC_FIZ = [
  ["Physics 1st paper", [
    `Physical world and measurement | units, dimensions, errors => ${F("units-measurement-and-errors")}`,
    `Vectors | addition, scalar and vector products => ${M("vectors")}`,
    `Dynamics and Newtonian mechanics | equations of motion, Newton's laws, momentum => ${F("kinematics")}, ${F("laws-of-motion")}, ${F("momentum-and-collisions")}`,
    `Projectiles and circular motion | range, centripetal force => ${F("projectile-motion")}, ${F("circular-motion-and-gravitation")}`,
    `Rotational motion | moment of inertia, angular momentum => ${F("rotational-motion")}`,
    `Work, energy and power | conservation of energy => ${F("work-energy-and-power")}`,
    `Gravitation and gravity | law of gravitation, escape velocity => ${F("circular-motion-and-gravitation")}`,
    `Structural properties of matter | elasticity, Young's modulus, viscosity, Stokes' law => ${F("elasticity")}, ${F("fluids-and-buoyancy")}`,
    `Periodic motion | simple harmonic motion, pendulum => ${F("oscillations")}`,
    `Waves | wave speed, stationary waves, beats => ${F("waves-and-sound")}`,
    `Ideal gas and kinetic theory of gases | gas laws, rms speed => ${F("thermal-physics")}`,
  ], 50],
  ["Physics 2nd paper", [
    `Thermodynamics | first law, Carnot engine, entropy => ${F("thermal-physics")}`,
    `Static electricity | Coulomb's law, capacitors => ${F("electrostatics-and-capacitors")}`,
    `Current electricity | Kirchhoff's laws, Wheatstone bridge => ${F("current-electricity")}`,
    `Magnetic effects of current and electromagnetic induction | force on a conductor, Faraday's law => ${F("magnetism-and-induction")}`,
    `Alternating current | rms values, reactance => ${F("alternating-current")}`,
    `Geometrical optics | mirrors, lenses, refraction => ${F("optics")}, ${F("spherical-mirrors")}`,
    `Physical optics | interference, Young's double slit, diffraction, polarisation => ${F("wave-optics")}`,
    `Modern physics, atomic and nuclear physics | photoelectric effect, half-life => ${F("modern-physics")}`,
    `Semiconductors and electronics | diodes, logic gates => ${F("semiconductors-and-logic-gates")}`,
  ], 50],
];
const BD_HSC_KEM = [
  ["Chemistry 1st paper", [
    `Qualitative chemistry | atomic structure, quantum numbers, spectra => ${K("atomic-structure")}`,
    `Identification of ions | flame test, precipitates => ${K("identification-of-ions-and-gases")}`,
    `Periodic properties of elements | periodic trends => ${K("periodic-table-and-periodic-properties")}`,
    `Chemical bonding | hybridisation, molecular shapes => ${K("chemical-bonding")}`,
    `Chemical change: rate of reaction | rate law, half-life => ${K("chemical-kinetics")}`,
    `Chemical change: equilibrium | Kc, Kp, Le Chatelier => ${K("chemical-equilibrium")}`,
    `Chemical change: acids, bases and pH | pH, buffers => ${K("acids-bases-and-ph")}`,
    `Chemical change: thermochemistry | enthalpy, Hess's law => ${K("thermochemistry")}`,
  ], 50],
  ["Chemistry 2nd paper", [
    `Environmental chemistry: gases | gas laws, ideal gas equation => ${K("gaseous-state")}`,
    `Environmental chemistry: pollution | air and water pollution, acid rain, ozone layer => ${K("environmental-chemistry")}`,
    `Organic chemistry: nomenclature and isomerism | IUPAC names, isomers => ${K("organic-chemistry-nomenclature-and-isomerism")}`,
    `Organic chemistry: reactions | reaction mechanisms, functional group tests => ${K("organic-chemistry-reactions")}`,
    `Quantitative chemistry | mole, stoichiometry, titration => ${K("mole-concept")}, ${K("stoichiometry")}, ${K("solutions-and-concentration")}`,
    `Electrochemistry | electrolysis, cell emf => ${K("electrochemistry")}`,
  ], 50],
];
const BD_HSC_BIO = [
  ["Biology 1st paper (botany)", [
    `Cell and its structure; cell chemistry | organelles, biomolecules, enzymes => ${Bi("cell-structure-and-biomolecules")}`,
    `Cell division | mitosis and meiosis => ${Bi("cell-cycle-and-cell-division")}`,
    `Plant tissue and tissue systems | meristems, permanent tissues, root and stem anatomy => ${Bi("plant-anatomy-and-morphology")}`,
    `Microorganisms, algae, fungi and plant groups | viruses, bacteria, bryophytes, pteridophytes, gymnosperms, angiosperms => ${Bi("diversity-of-living-organisms")}`,
    `Plant physiology | photosynthesis, respiration, transpiration => ${Bi("plant-physiology")}`,
    `Plant reproduction | pollination, double fertilisation => ${Bi("reproduction")}`,
    `Biotechnology | tissue culture, recombinant DNA => ${Bi("biotechnology")}`,
    `Organisms and environment | ecosystems, biodiversity => ${Bi("ecology-and-environment")}`,
  ], 50],
  ["Biology 2nd paper (zoology)", [
    `Animal diversity and classification | phyla and their features => ${Bi("diversity-of-living-organisms")}`,
    `Human physiology | digestion, circulation, respiration, excretion, locomotion, coordination => ${Bi("human-physiology")}`,
    `Continuity of human life | gametogenesis, menstrual cycle => ${Bi("reproduction")}`,
    `Defence of the body | immunity, vaccines => ${Bi("human-health-and-disease")}`,
    `Genetics | Mendelian ratios, blood groups, sex-linked traits => ${Bi("genetics-and-inheritance")}`,
    `Evolution | theories and evidence of evolution => ${Bi("evolution")}`,
    `Animal behaviour | innate and learned behaviour => ${Bi("animal-behaviour-and-tissues")}`,
  ], 50],
];

export const EXAMS_SOUTHASIA = {
  // ------------------------------------------------------------ Pakistan
  // Vir: https://www.fbise.edu.pk/notifications/Notification_of_50_percent_Pattern_2026.pdf (FBISE, 7. 8. 2026: 50 % MCQ
  //      v matematiki, fiziki, kemiji, biologiji od SSC-I 2026/27 naprej), https://fbise.edu.pk/syllabusHSSC-I.php
  //      (sekcija A 20 % MCQ, B 50 % kratki, C 30 % dolgi odgovori),
  //      https://pakobserver.net/bise-lahore-class-10-mathematics-model-paper-for-exams-2026-revealed/ (15 objektivnih),
  //      https://pakobserver.net/class-10-physics-latest-model-paper-scheme-for-exams-2026/ (12 MCQ po 1 točko),
  //      https://www.mathcity.org/_export/xhtml/math-9th-pctb/sol (PCTB Mathematics 9: Real numbers, Set and functions, Logic …).
  // 29 odborov ima vsak svoj format; opisan je skupni vzorec Pandžaba in FBISE (to piše tudi v about).
  // Vrzeli: matrike (stari program 9. r.), parcialni ulomki, variacija, grafi funkcij, konstrukcije; magnetizem
  // (9. r., kvalitativno); biokemija. Biologija je na ravni 10. razreda.
  SSCPK: {
    name: "SSC (Matric)",
    full: "Secondary School Certificate (Matric) – Pakistan board exams",
    country: "Pakistan",
    systems: ["PK"],
    board: true,
    forLevel: [6, 10],
    about:
      "Matric (SSC) exams are set at the end of Class 9 (SSC-I) and Class 10 (SSC-II) by about 29 boards, so marks and timings differ; this follows the common pattern of the Punjab boards and the Federal Board (FBISE). Each paper opens with a timed objective part of one-mark, four-option MCQs (Punjab Class 10: 15 in Mathematics, 12 in Physics; FBISE: 20 % of the marks, rising to 50 % from the 2026–27 SSC-I exams) and continues with short and long questions that need full working; Physics, Chemistry and Biology also have a practical. Papers are in English or Urdu. The mock covers the MCQ part and short numerical questions; check your board's latest model paper.",
    subjects: {
      MAT: {
        units: [
          ["Algebra", [
            `Real numbers and surds | laws of indices, surds, rationalising the denominator => ${M("indices-and-surds")}`,
            `Logarithms | laws of logarithms, calculations => ${M("logarithms")}`,
            `Factorisation and algebraic manipulation | remainder and factor theorem => ${M("polynomials")}`,
            `Linear equations and inequalities | simultaneous equations, inequalities => ${M("systems-of-linear-equations")}, ${M("quadratic-inequalities")}`,
            `Quadratic equations | factorisation, quadratic formula => ${M("quadratic-equations")}`,
            `Theory of quadratic equations | nature of roots, sum and product of roots => ${M("quadratic-equations")}`,
            `Sets and functions | set operations, Venn diagrams, domain, range => ${M("sets-and-logic")}, ${M("functions")}`,
            `Logic | statements, truth tables => ${M("sets-and-logic")}`,
            `Ratio and proportion | proportion, sharing in a ratio => ${M("ratios-rates-and-percentages")}`,
          ], 45],
          ["Geometry and trigonometry", [
            `Trigonometry | trigonometric ratios, identities, heights and distances => ${M("right-triangle-trigonometry")}, ${M("trigonometric-identities")}`,
            `Radian measure and sectors | arc length, area of a sector => ${M("circles")}`,
            `Coordinate geometry | distance and midpoint formulae, slope => ${M("coordinate-geometry")}`,
            `Similar figures | similar triangles, Pythagoras' theorem => ${M("similar-triangles")}`,
            `Chords, tangents and angles of a circle | angles in a segment, cyclic quadrilaterals, tangent properties => ${M("circle-theorems")}`,
          ], 35],
          ["Statistics and probability", [
            `Basic statistics | mean, median, mode, grouped data => ${M("statistics-mean-median")}, ${M("statistics-of-grouped-data")}`,
            `Probability | simple events, complement => ${M("probability")}`,
          ], 20],
        ],
        mock: { minutes: 45, groups: [group(8, "choice", 1, 1), group(7, "choice", 2, 1), group(5, "numeric", 2, 2), group(2, "numeric", 3, 4)] },
      },
      FIZ: {
        units: [
          ["Class 9 physics", [
            `Physical quantities and measurement | SI units, significant figures, errors => ${F("units-measurement-and-errors")}`,
            `Kinematics | equations of motion, motion graphs => ${F("kinematics")}`,
            `Dynamics | Newton's laws, momentum, friction => ${F("laws-of-motion")}, ${F("momentum-and-collisions")}`,
            `Turning effect of forces | moments, equilibrium, centre of mass => ${F("moments-and-equilibrium")}`,
            `Gravitation | law of gravitation, g at altitude => ${F("circular-motion-and-gravitation")}`,
            `Work, energy and power | efficiency => ${F("work-energy-and-power")}`,
            `Mechanical properties of matter | Hooke's law, density, pressure in liquids, atmospheric pressure, Pascal's law => ${F("elasticity")}, ${F("density-and-pressure")}`,
            `Thermal properties of matter | specific heat, latent heat => ${F("calorimetry")}`,
          ], 50],
          ["Class 10 physics", [
            `Simple harmonic motion and waves | pendulum, mass–spring, wave equation => ${F("oscillations")}, ${F("waves-and-sound")}`,
            `Geometrical optics | reflection, refraction, lenses and mirrors => ${F("optics")}, ${F("spherical-mirrors")}`,
            `Electrostatics | Coulomb's law, capacitors => ${F("electrostatics-and-capacitors")}`,
            `Current electricity | Ohm's law, resistors, electrical power => ${F("current-electricity")}, ${F("electric-power-and-household-circuits")}`,
            `Electromagnetism | force on a conductor, induction, transformers => ${F("magnetism-and-induction")}`,
            `Basic electronics | logic gates => ${F("semiconductors-and-logic-gates")}`,
            `Atomic and nuclear physics | radioactivity, half-life => ${F("modern-physics")}`,
          ], 50],
        ],
        mock: { minutes: 35, groups: [group(6, "choice", 1, 1), group(6, "choice", 2, 1), group(4, "numeric", 2, 2), group(2, "numeric", 3, 5)] },
      },
      KEM: {
        units: [
          ["Class 9 chemistry", [
            `Fundamentals of chemistry | mole, Avogadro's number, molar mass => ${K("mole-concept")}`,
            `Structure of atoms | electronic configuration, isotopes => ${K("atomic-structure")}`,
            `Periodic table and periodicity | trends in properties => ${K("periodic-table-and-periodic-properties")}`,
            `Structure of molecules | ionic and covalent bonds => ${K("chemical-bonding")}`,
            `Physical states of matter | gas laws => ${K("gaseous-state")}`,
            `Solutions | concentration, molarity => ${K("solutions-and-concentration")}`,
            `Electrochemistry | oxidation and reduction, electrolysis => ${K("electrochemistry")}, ${K("chemical-reactions-and-equations")}`,
            `Chemical reactivity | metals and non-metals => ${K("metals-and-non-metals")}`,
          ], 55],
          ["Class 10 chemistry", [
            `Chemical equilibrium | reversible reactions, Kc => ${K("chemical-equilibrium")}`,
            `Acids, bases and salts | pH, neutralisation => ${K("acids-bases-and-ph")}`,
            `Organic chemistry and hydrocarbons | functional groups, alkanes, alkenes, alkynes => ${K("organic-chemistry-nomenclature-and-isomerism")}, ${K("organic-chemistry-reactions")}`,
            `Environmental chemistry | atmosphere, air and water pollution, ozone, acid rain => ${K("environmental-chemistry")}`,
            `Chemical industries | basic metallurgy, ammonia and urea, petroleum => ${K("industrial-chemistry")}`,
          ], 45],
        ],
        mock: { minutes: 30, groups: [group(8, "choice", 1, 1), group(4, "choice", 2, 1), group(4, "numeric", 2, 2)] },
      },
      BIO: {
        units: [
          ["Class 9 biology", [
            `Biodiversity | classification, five kingdoms => ${Bi("diversity-of-living-organisms")}`,
            `Cells, tissues and enzymes | organelles, enzyme action => ${Bi("cell-structure-and-biomolecules")}`,
            `Cell cycle | mitosis and meiosis => ${Bi("cell-cycle-and-cell-division")}`,
            `Bioenergetics | photosynthesis, respiration => ${Bi("life-processes")}`,
            `Nutrition and transport | digestion, blood circulation, transport in plants => ${Bi("life-processes")}`,
          ], 45],
          ["Class 10 biology", [
            `Gaseous exchange and homeostasis | breathing, kidneys, excretion => ${Bi("life-processes")}`,
            `Coordination and control | nervous system, reflex arc, hormones => ${Bi("control-and-coordination")}`,
            `Reproduction | asexual and sexual reproduction => ${Bi("how-organisms-reproduce")}`,
            `Inheritance | Mendel's laws, genes, variation => ${Bi("heredity-and-variation")}`,
            `Man and his environment | ecosystems, food chains, pollution => ${Bi("our-environment")}`,
            `Biotechnology | genetic engineering, fermentation => ${Bi("biotechnology")}`,
            `Pharmacology | medicinal drugs, antibiotics, vaccines => ${Bi("human-health-and-disease")}`,
          ], 55],
        ],
        mock: { minutes: 30, groups: [group(8, "choice", 1, 1), group(8, "choice", 2, 1)] },
      },
    },
  },
  // Vir: kot SSCPK (FBISE obvestilo 2026, FBISE HSSC sekcije A/B/C),
  //      https://www.eduvision.edu.pk/edu_news/how-to-score-90-in-2nd-year-math-paper-news-4046 (matematika: objektivni 20, subjektivni 80),
  //      https://www.eduvision.edu.pk/edu_news/how-to-prepare-for-2nd-year-physics-board-paper-news-4050 (fizika 85, 17 MCQ).
  // Vrzeli: parcialni ulomki, grupe, grafi kotnih funkcij, reševanje poševnih trikotnikov; optični
  // instrumenti; eksperimentalne tehnike, tekočine in trdnine (kemija).
  HSSCPK: {
    name: "HSSC (Intermediate / FSc)",
    full: "Higher Secondary School Certificate (Intermediate, FSc) – Pakistan board exams",
    country: "Pakistan",
    systems: ["PK"],
    board: true,
    forLevel: [11, 12],
    about:
      "Intermediate (HSSC) exams are set at the end of Class 11 (Part I) and Class 12 (Part II); FSc Pre-Engineering takes Mathematics, Physics and Chemistry and FSc Pre-Medical takes Biology, Physics and Chemistry. In the Punjab boards Mathematics is 100 marks (20 one-mark MCQs, then short and long questions) and the science papers are about 85 marks plus a practical (Physics opens with 17 MCQs); FBISE papers have Section A (MCQs), B (short answers) and C (long answers), with MCQs rising to 50 % from the 2026–27 HSSC-I exams. Boards differ in detail; papers are in English. The mock covers the MCQ part and short numerical questions; check your board's latest scheme.",
    subjects: {
      MAT: {
        units: PK_FSC_MAT,
        mock: { minutes: 50, groups: [group(10, "choice", 2, 1), group(10, "choice", 3, 1), group(4, "numeric", 2, 2), group(2, "numeric", 3, 5)] },
      },
      FIZ: {
        units: PK_FSC_FIZ,
        mock: { minutes: 45, groups: [group(9, "choice", 2, 1), group(8, "choice", 3, 1), group(4, "numeric", 2, 2), group(2, "numeric", 3, 5)] },
      },
      KEM: {
        units: PK_FSC_KEM,
        mock: { minutes: 40, groups: [group(9, "choice", 2, 1), group(8, "choice", 3, 1), group(4, "numeric", 2, 2)] },
      },
      BIO: {
        units: PK_FSC_BIO,
        mock: { minutes: 35, groups: [group(9, "choice", 2, 1), group(8, "choice", 3, 1)] },
      },
    },
  },
  // Vir: https://www.uhs.edu.pk/downloads/MDCAT-2025InformationGuide.pdf (180 MCQ, 3 h, 4 možnosti, 1 točka,
  //      brez negativnih točk, 81/45/36/9/9, prag 55 % / 50 %), https://cas.kmu.edu.pk/sitedocuments/Uniform-Curriculum-MDCAT-2025-Final-26-05-2025.pdf,
  //      PMDC javno obvestilo MDCAT 2026 (180 MCQ, papir, angleščina, brez negativnih točk; program enak 2025).
  // Teme po enotah PMDC kurikula (PK_MDCAT_*), ne po celotnem FSc.
  // Angleščina in logično sklepanje nista predmeta te aplikacije.
  // Vrzeli: bioenergetika (celično dihanje), opora in gibanje (okostje, mišice), tekočine in trdnine (kemija).
  MDCAT: {
    name: "MDCAT",
    full: "MDCAT (Medical and Dental College Admission Test, PMDC)",
    country: "Pakistan",
    systems: ["PK"],
    about:
      "MDCAT is the national entrance test for medical (MBBS) and dental (BDS) colleges, set by PMDC on its uniform FSc-based curriculum. It is a 3-hour paper-based test in English with 180 four-option MCQs worth one mark each and no negative marking: 81 Biology, 45 Chemistry, 36 Physics, 9 English and 9 Logical Reasoning. The pass mark is 55 % for medical and 50 % for dental colleges. The mock is a section at the real pace of one minute per question; check the latest PMDC notice.",
    subjects: {
      BIO: {
        units: PK_MDCAT_BIO,
        mock: { minutes: 40, groups: [group(10, "choice", 1, 1), group(20, "choice", 2, 1), group(10, "choice", 3, 1)], grades: GRADES_MDCAT },
      },
      KEM: {
        units: PK_MDCAT_KEM,
        mock: { minutes: 30, groups: [group(8, "choice", 1, 1), group(16, "choice", 2, 1), group(6, "choice", 3, 1)], grades: GRADES_MDCAT },
      },
      FIZ: {
        units: PK_MDCAT_FIZ,
        mock: { minutes: 30, groups: [group(8, "choice", 1, 1), group(16, "choice", 2, 1), group(6, "choice", 3, 1)], grades: GRADES_MDCAT },
      },
    },
  },
  // Vir: https://nfciet.edu.pk/news/combine-entry-test-of-uet-lahore (ECAT 2026: 100 min, brez negativnih točk,
  //      kombinacije predmetov), https://www.thenews.pk/print/1422011-24-288-appear-in-ecat-2026-phase-ii
  //      (računalniški test, 100 min, brez negativnih točk). Število vprašanj po predmetih (30/30/30/10, 4 točke)
  //      samo iz neuradnih vodnikov (ilmkidunya, parhlai) – opisano kot »običajno«. Starejši vodniki z −1 so zastareli.
  // Teme: celoten FSc (PK_FSC_*); vrzeli kot pri HSSCPK.
  ECAT: {
    name: "ECAT",
    full: "ECAT (Engineering College Admission Test, UET Lahore)",
    country: "Pakistan",
    systems: ["PK"],
    about:
      "ECAT is UET Lahore's computer-based entrance test for engineering, taken after Intermediate (FSc). In 2026 it lasted 100 minutes with no negative marking; it is usually 100 four-option MCQs worth 4 marks each (400 marks), about 30 each in Mathematics, Physics and Chemistry (or Computer Science) and 10 in English. Questions follow the FSc syllabus and the test is in English. The mock is a 30-question subject section at the real pace; check the official UET ECAT page for the current split.",
    subjects: {
      MAT: {
        units: PK_FSC_MAT,
        mock: { minutes: 30, groups: [group(8, "choice", 1, 4), group(14, "choice", 2, 4), group(8, "choice", 3, 4)] },
      },
      FIZ: {
        units: PK_FSC_FIZ,
        mock: { minutes: 30, groups: [group(8, "choice", 1, 4), group(14, "choice", 2, 4), group(8, "choice", 3, 4)] },
      },
      KEM: {
        units: PK_FSC_KEM,
        mock: { minutes: 30, groups: [group(8, "choice", 1, 4), group(14, "choice", 2, 4), group(8, "choice", 3, 4)] },
      },
    },
  },

  // ------------------------------------------------------------ Bangladeš
  // Vir: https://thefinancialexpress.com.bd/home/nctb-publishes-revised-short-syllabus-for-2026-ssc-exams (NCTB: s praktičnim
  //      delom 75 teorija + 25 praktično, brez njega 70 ustvarjalna + 30 MCQ), https://www.jugantor.com/campus/1118057
  //      (fizika: 50 ustvarjalna, 5 od 8 vprašanj; 25 MCQ; 25 praktično), https://www.prothomalo.com/education/study/a2okvmy1zr
  //      (25 MCQ v 25 min, ustvarjalni del 2 h 35 min), https://en.prothomalo.com/youth/education/e4ln52af2b.
  // Vrzeli: realna števila, geometrijski izreki o trikotnikih in konstrukcije, prostorska geometrija,
  // kemija v vsakdanjem življenju, industrijska proizvodnja (ni preverjena), gibanje in opora.
  // Biologija je na ravni 10. razreda.
  SSCBD: {
    name: "SSC (Bangladesh)",
    full: "Secondary School Certificate – Bangladesh (science group)",
    country: "Bangladesh",
    systems: ["BD"],
    board: true,
    forLevel: [6, 10],
    about:
      "SSC is taken at the end of Class 10 in Bangla or the English version. Higher Mathematics, Physics, Chemistry and Biology carry 50 marks of creative questions (answer 5 of 8, 10 marks each, 2 h 35 min), 25 four-option MCQs in 25 minutes and a 25-mark practical; General Mathematics has 70 creative and 30 MCQ marks. Each part must be passed separately (33 %) and results are letter grades from A+ (80 %) to F. The mock covers the MCQ part and calculation parts of creative questions; the grade is an estimate.",
    subjects: {
      MAT: {
        units: [
          ["General Mathematics", [
            `Algebraic expressions | factorisation, remainder theorem => ${M("polynomials")}`,
            `Indices and logarithms | laws of indices, laws of logarithms => ${M("indices-and-surds")}, ${M("logarithms")}`,
            `Equations in one variable | quadratic equations => ${M("quadratic-equations")}`,
            `Simple simultaneous equations | elimination, substitution, word problems => ${M("systems-of-linear-equations")}`,
            `Algebraic ratio and proportion | ratio, proportion => ${M("ratios-rates-and-percentages")}`,
            `Finite series | arithmetic and geometric series => ${M("arithmetic-progressions")}, ${M("geometric-progressions")}`,
            `Trigonometric ratios | special angles, identities => ${M("trigonometric-identities")}`,
            `Distance and height | angles of elevation and depression => ${M("right-triangle-trigonometry")}`,
            `Circle | chords, angles in a circle, cyclic quadrilaterals, tangents => ${M("circle-theorems")}`,
            `Mensuration | surface area and volume of solids => ${M("surface-areas-and-volumes")}`,
            `Statistics | mean, median, mode of grouped data => ${M("statistics-of-grouped-data")}`,
          ], 55],
          ["Higher Mathematics", [
            `Sets and functions | domain, range, inverse function => ${M("functions")}`,
            `Equations and inequalities | quadratic inequalities => ${M("quadratic-inequalities")}`,
            `Infinite series | sum to infinity => ${M("geometric-progressions")}`,
            `Exponential and logarithmic functions | log equations => ${M("logarithms")}`,
            `Coordinate geometry | distance, slope, equation of a line => ${M("coordinate-geometry")}`,
            `Planar vectors | magnitude, addition => ${M("vectors")}`,
            `Binomial expansion | expansion of (a + b)^n, general term, coefficients => ${M("binomial-theorem")}`,
            `Probability | classical probability => ${M("probability")}`,
          ], 45],
        ],
        mock: { minutes: 40, groups: [group(15, "choice", 1, 1), group(10, "choice", 2, 1), group(2, "numeric", 2, 3), group(2, "numeric", 3, 4)], grades: GRADES_BD },
      },
      FIZ: {
        units: [
          ["Mechanics", [
            `Physical quantities and their measurement | units, dimensions, errors => ${F("units-measurement-and-errors")}`,
            `Motion | equations of motion => ${F("kinematics")}`,
            `Force | Newton's laws, momentum, friction => ${F("laws-of-motion")}, ${F("momentum-and-collisions")}`,
            `Work, power and energy | kinetic and potential energy, efficiency => ${F("work-energy-and-power")}`,
            `State of matter and pressure | density, pressure, Pascal's law, buoyancy, Archimedes' principle, Hooke's law => ${F("density-and-pressure")}, ${F("fluids-and-buoyancy")}, ${F("elasticity")}`,
          ], 30],
          ["Heat, waves and light", [
            `Effect of heat on matter | specific heat, latent heat, expansion => ${F("calorimetry")}`,
            `Waves and sound | wave speed, echo => ${F("waves-and-sound")}`,
            `Reflection of light | mirrors, mirror formula => ${F("spherical-mirrors")}`,
            `Refraction of light | refractive index, lenses => ${F("optics")}`,
          ], 30],
          ["Electricity and modern physics", [
            `Static electricity | Coulomb's law, electric field => ${F("electrostatics-and-capacitors")}`,
            `Current electricity | Ohm's law, resistors, electric power => ${F("current-electricity")}, ${F("electric-power-and-household-circuits")}`,
            `Magnetic effect of current | electromagnetic induction, transformers => ${F("magnetism-and-induction")}`,
            `Modern physics and electronics | radioactivity, half-life, logic gates => ${F("modern-physics")}, ${F("semiconductors-and-logic-gates")}`,
          ], 40],
        ],
        mock: { minutes: 40, groups: [group(15, "choice", 1, 1), group(10, "choice", 2, 1), group(2, "numeric", 2, 3), group(2, "numeric", 3, 4)], grades: GRADES_BD },
      },
      KEM: {
        units: [
          ["Structure of matter and bonding", [
            `Structure of matter | atomic structure, isotopes, electron configuration => ${K("atomic-structure")}`,
            `Periodic table | groups, periods, trends => ${K("periodic-table-and-periodic-properties")}`,
            `Chemical bonds | ionic, covalent and metallic bonds => ${K("chemical-bonding")}`,
          ], 30],
          ["Mole concept and reactions", [
            `Concept of mole and chemical counting | mole, percentage composition, molarity => ${K("mole-concept")}, ${K("stoichiometry")}, ${K("solutions-and-concentration")}`,
            `Chemical reactions | balancing, types, redox => ${K("chemical-reactions-and-equations")}`,
            `Chemistry and energy | heat of reaction, electrolysis, cells => ${K("thermochemistry")}, ${K("electrochemistry")}`,
            `Acid–base balance | pH, neutralisation => ${K("acids-bases-and-ph")}`,
          ], 45],
          ["Mineral resources", [
            `Mineral resources: metals and non-metals | reactivity, extraction => ${K("metals-and-non-metals")}`,
            `Mineral resources: fossils | hydrocarbons, functional groups => ${K("organic-chemistry-nomenclature-and-isomerism")}`,
            `Polymers from fossil fuels | polymerisation, polythene, PVC => ${K("polymers")}`,
          ], 25],
        ],
        mock: { minutes: 35, groups: [group(15, "choice", 1, 1), group(10, "choice", 2, 1), group(3, "numeric", 2, 3)], grades: GRADES_BD },
      },
      BIO: {
        units: [
          ["Cells and life processes", [
            `Lessons on life | classification of living organisms => ${Bi("diversity-of-living-organisms")}`,
            `Cell and tissue of organisms | organelles, tissues => ${Bi("cell-structure-and-biomolecules")}`,
            `Cell division | mitosis and meiosis => ${Bi("cell-cycle-and-cell-division")}`,
            `Bioenergetics | photosynthesis, respiration => ${Bi("life-processes")}`,
            `Food, nutrition, transport, gas exchange and excretion | human body systems, transport in plants => ${Bi("life-processes")}`,
            `Coordination | nervous system, reflex arc, hormones, plant hormones => ${Bi("control-and-coordination")}`,
          ], 55],
          ["Reproduction, heredity and environment", [
            `Reproduction in organisms | plants and humans => ${Bi("how-organisms-reproduce")}`,
            `Heredity in organisms and evolution | Mendel, sex determination, variation => ${Bi("heredity-and-variation")}`,
            `Environment of life | ecosystems, food chains => ${Bi("our-environment")}`,
            `Biotechnology | genetic engineering, tissue culture => ${Bi("biotechnology")}`,
          ], 45],
        ],
        mock: { minutes: 30, groups: [group(15, "choice", 1, 1), group(10, "choice", 2, 1)], grades: GRADES_BD },
      },
    },
  },
  // Vir: kot SSCBD (jugantor, prothomalo: vsak predmet ima 1. in 2. del, vsak 50 + 25 + 25),
  //      https://www.prothomalo.com/education/examination/evznk5yfv2 (kemija 2. del: 5 od 8 ustvarjalnih).
  // Vrzeli: astronomija; delovna in ekonomska kemija (vsebina ni preverjena, banka ima Haber/Contact),
  // polimeri (niso preverjeni v programu).
  HSCBD: {
    name: "HSC (Bangladesh)",
    full: "Higher Secondary Certificate – Bangladesh (science group)",
    country: "Bangladesh",
    systems: ["BD"],
    board: true,
    forLevel: [11, 12],
    about:
      "HSC is taken at the end of Class 12 in Bangla or the English version. Higher Mathematics, Physics, Chemistry and Biology each have a 1st and 2nd paper of 100 marks: 50 marks of creative questions (answer 5 of 8, 2 h 35 min), 25 four-option MCQs in 25 minutes and a 25-mark practical. Each part must be passed separately (33 %) and results are letter grades from A+ (80 %) to F. The mock covers the MCQ part and calculation parts of creative questions; the grade is an estimate.",
    subjects: {
      MAT: {
        units: [
          ["Higher Mathematics 1st paper", [
            `Matrices and determinants | determinants, inverse, Cramer's rule => ${M("matrices-and-determinants")}`,
            `Vectors | scalar and vector product => ${M("vectors")}`,
            `Straight lines | slope, equation of a line, distance => ${M("coordinate-geometry")}`,
            `Circles | equation of a circle, tangents => ${M("circles")}`,
            `Permutations and combinations | arrangements, selections => ${M("permutations-and-combinations")}`,
            `Trigonometric ratios and compound angles | identities => ${M("trigonometric-identities")}`,
            `Functions and graphs | domain, range, inverse => ${M("functions")}`,
            `Differentiation | limits, derivatives, maxima and minima => ${M("limits-and-continuity")}, ${M("differentiation")}`,
            `Integration | definite integrals, area => ${M("integration")}`,
          ], 55],
          ["Higher Mathematics 2nd paper", [
            `Real numbers and inequalities | solving inequalities => ${M("quadratic-inequalities")}`,
            `Linear programming | graphical method => ${M("linear-programming")}`,
            `Complex numbers | modulus, argument, cube roots of unity => ${M("complex-numbers")}`,
            `Polynomials and polynomial equations | roots and coefficients => ${M("polynomials")}, ${M("quadratic-equations")}`,
            `Inverse trigonometric functions and trigonometric equations | principal values => ${M("inverse-trigonometric-functions")}`,
            `Statics | resultant forces, moments, equilibrium => ${F("moments-and-equilibrium")}`,
            `Motion of particles in a plane | equations of motion, projectiles => ${F("kinematics")}, ${F("projectile-motion")}`,
            `Conics | parabola, ellipse, hyperbola => ${M("conic-sections")}`,
            `Binomial expansion | general term, coefficients, middle term => ${M("binomial-theorem")}`,
            `Measures of dispersion and probability | variance, standard deviation, conditional probability => ${M("measures-of-dispersion")}, ${M("probability")}, ${M("conditional-probability-and-bayes-theorem")}`,
          ], 45],
        ],
        mock: { minutes: 45, groups: [group(10, "choice", 2, 1), group(15, "choice", 3, 1), group(2, "numeric", 2, 3), group(2, "numeric", 3, 4)], grades: GRADES_BD },
      },
      FIZ: {
        units: BD_HSC_FIZ,
        mock: { minutes: 45, groups: [group(10, "choice", 2, 1), group(15, "choice", 3, 1), group(2, "numeric", 2, 3), group(2, "numeric", 3, 4)], grades: GRADES_BD },
      },
      KEM: {
        units: BD_HSC_KEM,
        mock: { minutes: 40, groups: [group(10, "choice", 2, 1), group(15, "choice", 3, 1), group(3, "numeric", 2, 3)], grades: GRADES_BD },
      },
      BIO: {
        units: BD_HSC_BIO,
        mock: { minutes: 30, groups: [group(10, "choice", 2, 1), group(15, "choice", 3, 1)], grades: GRADES_BD },
      },
    },
  },
  // Vir: https://en.prothomalo.com/youth/education/lpcpzm0agn (smernice 2025–26: 100 MCQ po 1 točko, −0,25,
  //      1 h 15 min, prag 40; biologija 30, kemija 25, fizika 15, angleščina 15, splošno znanje 15),
  //      https://en.prothomalo.com/youth/education/9qjzw4e8il (test 12. 12. 2025).
  MBBSBD: {
    name: "MBBS admission test (Bangladesh)",
    full: "MBBS/BDS admission test – Bangladesh (DGME)",
    country: "Bangladesh",
    systems: ["BD"],
    about:
      "The national MBBS/BDS admission test (DGME) follows the HSC syllabus. In the 2025–26 session it had 100 one-mark MCQs in 1 hour 15 minutes with 0.25 marks deducted per wrong answer: Biology 30, Chemistry 25, Physics 15, English 15 and General Knowledge (with aptitude and humanistic qualities) 15. At least 40 marks are needed to qualify; merit adds SSC and HSC GPA. The mock is a 40-question section at the real pace (45 seconds per question); check the latest DGME circular.",
    subjects: {
      BIO: {
        units: BD_HSC_BIO,
        mock: { minutes: 30, groups: [group(10, "choice", 1, 1, -0.25), group(20, "choice", 2, 1, -0.25), group(10, "choice", 3, 1, -0.25)], grades: GRADES_MBBSBD },
      },
      KEM: {
        units: BD_HSC_KEM,
        mock: { minutes: 30, groups: [group(10, "choice", 1, 1, -0.25), group(20, "choice", 2, 1, -0.25), group(10, "choice", 3, 1, -0.25)], grades: GRADES_MBBSBD },
      },
      FIZ: {
        units: BD_HSC_FIZ,
        mock: { minutes: 30, groups: [group(10, "choice", 1, 1, -0.25), group(20, "choice", 2, 1, -0.25), group(10, "choice", 3, 1, -0.25)], grades: GRADES_MBBSBD },
      },
    },
  },

  // ------------------------------------------------------------ Nepal
  // Vir: SEE 2082 (2026) vprašalnici (slike v https://nebgpacalculator.com/see-2082-compulsory-math-question-paper/ in
  //      https://nebgpacalculator.com/see-2082-science-question-paper/): matematika 3 h, 75 točk, 16 strukturiranih vprašanj
  //      z deli po 1–3 točke, brez MCQ; naravoslovje 3 h, 75 točk, oddelek A 10 MCQ × 1, B 9 zelo kratkih × 1, nato
  //      kratka in dolga vprašanja; +25 notranje/praktično. Ocene NEB (A+ … NG).
  // IOE/CEE (sprejemni izpiti) niso dodani: format ni zanesljivo dokumentiran na uradnih straneh.
  // Vrzeli: algebrski ulomki, ploščine trikotnikov in paralelogramov, konstrukcije; energija, čebela,
  // plini, materiali v vsakdanjem življenju, informacijska tehnologija. Biologija je na ravni 10. razreda.
  SEE: {
    name: "SEE",
    full: "Secondary Education Examination (Nepal, Grade 10)",
    country: "Nepal",
    systems: ["NP"],
    board: true,
    forLevel: [6, 10],
    about:
      "SEE is taken at the end of Grade 10 in Nepali or English medium; each province sets its paper to the common CDC specification grid. Compulsory Mathematics is a 3-hour, 75-mark paper of about 16 context-based structured questions with 1- to 3-mark parts and no multiple choice. Science and Technology is a 3-hour, 75-mark paper that opens with 10 one-mark MCQs and 9 very short questions, followed by short and long answers. Each subject adds 25 marks of internal or practical assessment, and results are letter grades A+ to NG. The mock covers short calculations and MCQs; check the latest CDC specification grid.",
    subjects: {
      MAT: {
        units: [
          ["Arithmetic", [
            `Compound interest | yearly, half-yearly and quarterly compounding => ${M("exponential-growth-and-decay")}`,
            `Population growth and depreciation | growth and depreciation rates => ${M("exponential-growth-and-decay")}`,
            `Currency and exchange rate | buying and selling rates, devaluation => ${M("ratios-rates-and-percentages")}`,
          ], 20],
          ["Mensuration", [
            `Area and volume of solids | prisms, pyramids, cylinders, cones, spheres, combined solids => ${M("surface-areas-and-volumes")}`,
          ], 15],
          ["Sets", [
            `Sets | Venn diagrams with two and three sets, cardinality problems => ${M("sets-and-logic")}`,
          ], 10],
          ["Algebra", [
            `Sequences and series | arithmetic and geometric sequences => ${M("arithmetic-progressions")}, ${M("geometric-progressions")}`,
            `Quadratic equations | forming and solving => ${M("quadratic-equations")}`,
            `Indices | laws of indices, exponential equations => ${M("indices-and-surds")}`,
          ], 20],
          ["Geometry", [
            `Circle | angles at the centre and circumference, cyclic quadrilaterals => ${M("circle-theorems")}`,
          ], 10],
          ["Trigonometry, statistics and probability", [
            `Height and distance | angles of elevation and depression => ${M("right-triangle-trigonometry")}`,
            `Statistics | mean, median, mode, quartiles of grouped data => ${M("statistics-of-grouped-data")}`,
            `Probability | tree diagrams, independent events => ${M("probability")}`,
          ], 25],
        ],
        mock: { minutes: 45, groups: [group(6, "numeric", 1, 1), group(6, "numeric", 2, 2), group(4, "numeric", 3, 3)], grades: GRADES_NEB },
      },
      FIZ: {
        units: [
          ["Physics (Science and Technology)", [
            `Force and gravitation | Newton's law of gravitation, weight on other planets => ${F("circular-motion-and-gravitation")}`,
            `Heat | specific heat capacity, temperature => ${F("calorimetry")}`,
            `Pressure | pressure in liquids, Pascal's law, hydraulic machines, atmospheric pressure => ${F("density-and-pressure")}`,
            `Light | refraction, lenses, dispersion => ${F("optics")}`,
            `Current electricity and magnetism | Ohm's law, electromagnetic induction, motors and generators => ${F("current-electricity")}, ${F("magnetism-and-induction")}`,
          ]],
        ],
        mock: { minutes: 30, groups: [group(5, "choice", 1, 1), group(4, "numeric", 2, 2), group(2, "numeric", 3, 4)], grades: GRADES_NEB },
      },
      KEM: {
        units: [
          ["Chemistry (Science and Technology)", [
            `Classification of elements | modern periodic table, electronic configuration, valency => ${K("periodic-table-and-periodic-properties")}`,
            `Chemical reaction | types of reactions, exothermic and endothermic reactions => ${K("chemical-reactions-and-equations")}`,
            `Metals | ores, extraction, reactivity => ${K("metals-and-non-metals")}`,
            `Hydrocarbons and their compounds | alkanes, alkenes, alkynes, alcohols => ${K("organic-chemistry-nomenclature-and-isomerism")}`,
          ]],
        ],
        mock: { minutes: 25, groups: [group(6, "choice", 1, 1), group(4, "choice", 2, 1), group(2, "numeric", 2, 2)], grades: GRADES_NEB },
      },
      BIO: {
        units: [
          ["Biology (Science and Technology)", [
            `Classification of living beings | groups and key features => ${Bi("diversity-of-living-organisms")}`,
            `Heredity | Mendel's experiments, monohybrid crosses, sex determination => ${Bi("heredity-and-variation")}`,
            `Physiological structure and life processes | blood circulation, transport in plants => ${Bi("life-processes")}`,
            `Nervous and endocrine systems | reflex action, brain, hormones => ${Bi("control-and-coordination")}`,
            `Nature and environment | ecosystems, food chains, climate change => ${Bi("our-environment")}`,
          ]],
        ],
        mock: { minutes: 25, groups: [group(6, "choice", 1, 1), group(6, "choice", 2, 1)], grades: GRADES_NEB },
      },
    },
  },
  // Vir: NEB razred XII 2082 (2025), fizika (1021'H') in matematika (0081) – slike v
  //      https://blog.educatenepal.com/2025/05/neb-grade-12-physics-general-stream.html in
  //      https://blog.educatenepal.com/2025/05/neb-grade-12-complulsory-mathematics.html: 3 h, 75 točk; skupina A 11 MCQ × 1
  //      (razdeljene po 30 min), B 8 × 5 = 40, C 3 × 8 = 24; +25 praktično/notranje.
  //      Uporabna kemija (Contact, Ostwald, Solvay; polimeri): https://mysecondteacher.com.np/chemistry (sekundarni vir).
  // Vrzeli: lastnosti in reševanje trikotnika, indukcija; seizmologija in novejši trendi; uporabna kemija
  // brez ravnotežja (Solvay, sečnina, zdravila, pesticidi).
  NEB12: {
    name: "NEB Grade 12",
    full: "NEB Grade 12 examination (Nepal, science stream)",
    country: "Nepal",
    systems: ["NP"],
    board: true,
    forLevel: [11, 12],
    about:
      "The NEB Grade 12 exam is taken at the end of Grade 12 (Grade 11 has its own NEB exam) and the science stream papers are in English. Theory papers are 3 hours and 75 marks: Group A has 11 one-mark, four-option MCQs (handed out after 30 minutes), Group B eight 5-mark short questions and Group C three 8-mark long questions, as in Physics and Mathematics; each subject adds 25 marks of practical or internal assessment. Results are letter grades A+ to NG. The mock covers Group A and calculation parts of Group B; check the latest NEB specification grid.",
    subjects: {
      MAT: {
        units: [
          ["Algebra", [
            `Permutation and combination | arrangements, selections => ${M("permutations-and-combinations")}`,
            `Matrices and determinants | Cramer's rule, matrix method => ${M("matrices-and-determinants")}`,
            `Complex numbers | polar form, De Moivre's theorem => ${M("complex-numbers")}`,
            `Binomial theorem | general term, middle term, binomial coefficients => ${M("binomial-theorem")}`,
          ], 20],
          ["Trigonometry, analytic geometry and vectors", [
            `Inverse circular functions | principal values, identities => ${M("inverse-trigonometric-functions")}`,
            `Circle and tangents | equation of a circle, condition of tangency => ${M("circles")}`,
            `Conic sections | parabola, ellipse, hyperbola => ${M("conic-sections")}`,
            `Vectors | scalar and vector products, projection => ${M("vectors")}`,
          ], 25],
          ["Statistics and probability", [
            `Correlation and regression | correlation coefficient, regression lines => ${M("correlation-and-regression")}`,
            `Probability | conditional probability, independent events, Bayes' theorem => ${M("probability")}, ${M("conditional-probability-and-bayes-theorem")}`,
          ], 15],
          ["Calculus", [
            `Limits and continuity | limits, L'Hospital's rule => ${M("limits-and-continuity")}`,
            `Derivatives and their applications | maxima and minima, tangents => ${M("differentiation")}`,
            `Antiderivatives and definite integrals | area => ${M("integration")}`,
            `Differential equations | first-order linear equations => ${M("differential-equations")}`,
          ], 30],
          ["Computational methods and mechanics", [
            `Linear programming | maximising and minimising => ${M("linear-programming")}`,
            `Statics | resultant and equilibrium of forces => ${F("moments-and-equilibrium")}`,
          ], 10],
        ],
        mock: { minutes: 45, groups: [group(5, "choice", 2, 1), group(6, "choice", 3, 1), group(4, "numeric", 2, 3), group(2, "numeric", 3, 5)], grades: GRADES_NEB },
      },
      FIZ: {
        units: [
          ["Mechanics, fluids and heat", [
            `Rotational dynamics | moment of inertia, torque, angular momentum => ${F("rotational-motion")}`,
            `Periodic motion | simple harmonic motion, energy in SHM => ${F("oscillations")}`,
            `Fluid dynamics | viscosity, Stokes' law, Bernoulli's equation => ${F("fluids-and-buoyancy")}`,
            `Thermodynamics | first law, adiabatic processes, Carnot engine => ${F("thermal-physics")}`,
          ], 25],
          ["Waves and physical optics", [
            `Mechanical waves and acoustic phenomena | waves in pipes and strings, Doppler effect => ${F("waves-and-sound")}`,
            `Interference, diffraction and polarisation | Young's double slit, diffraction grating, Brewster's law => ${F("wave-optics")}`,
          ], 20],
          ["Electricity and magnetism", [
            `Electrical circuits | Kirchhoff's laws, Wheatstone bridge => ${F("current-electricity")}`,
            `Magnetic field and electromagnetic induction | force on a conductor, Faraday's law => ${F("magnetism-and-induction")}`,
            `Alternating currents | rms values, reactance, resonance => ${F("alternating-current")}`,
          ], 30],
          ["Modern physics", [
            `Electrons, photons and nuclear physics | photoelectric effect, radioactivity => ${F("modern-physics")}`,
            `Semiconductor devices | p–n junction, logic gates => ${F("semiconductors-and-logic-gates")}`,
          ], 25],
        ],
        mock: { minutes: 45, groups: [group(5, "choice", 2, 1), group(6, "choice", 3, 1), group(4, "numeric", 2, 3), group(2, "numeric", 3, 5)], grades: GRADES_NEB },
      },
      KEM: {
        units: [
          ["Physical chemistry", [
            `Volumetric analysis | normality, molarity, titration => ${K("solutions-and-concentration")}, ${K("stoichiometry")}`,
            `Ionic equilibrium | pH, buffers, solubility product => ${K("acids-bases-and-ph")}`,
            `Chemical kinetics | rate law, order, half-life => ${K("chemical-kinetics")}`,
            `Thermodynamics | enthalpy, entropy, Gibbs energy => ${K("thermochemistry")}`,
            `Electrochemistry | electrode potential, cell emf => ${K("electrochemistry")}`,
          ], 35],
          ["Inorganic chemistry", [
            `Transition metals | oxidation states, complex compounds => ${K("s-p-d-and-f-block-elements")}, ${K("coordination-compounds")}`,
            `Studies of heavy metals | extraction of copper, zinc, mercury and iron => ${K("metals-and-non-metals")}`,
          ], 20],
          ["Organic chemistry", [
            `Haloalkanes, haloarenes, alcohols, phenols and ethers | nomenclature and isomerism => ${K("organic-chemistry-nomenclature-and-isomerism")}`,
            `Aldehydes, ketones, carboxylic acids, nitro compounds and amines | preparation and reactions => ${K("organic-chemistry-reactions")}`,
          ], 35],
          ["Applied chemistry", [
            `Modern chemical manufactures | Contact process, conditions and yield => ${K("industrial-chemistry")}`,
            `Polymers, dyes and drugs | natural and synthetic polymers => ${K("polymers")}`,
          ], 10],
        ],
        mock: { minutes: 40, groups: [group(5, "choice", 2, 1), group(6, "choice", 3, 1), group(4, "numeric", 2, 3)], grades: GRADES_NEB },
      },
      BIO: {
        units: [
          ["Botany", [
            `Anatomy of flowering plants | plant tissues, root, stem and leaf structure => ${Bi("plant-anatomy-and-morphology")}`,
            `Plant physiology | water relations, photosynthesis, respiration, growth => ${Bi("plant-physiology")}`,
            `Genetics | Mendelism, linkage, sex-linked traits => ${Bi("genetics-and-inheritance")}`,
            `Molecular biology | nucleic acids, replication, gene expression => ${Bi("molecular-basis-of-inheritance")}`,
            `Applied botany and biotechnology | tissue culture, genetic engineering => ${Bi("biotechnology")}`,
          ], 50],
          ["Zoology", [
            `Human biology | digestion, breathing, circulation, excretion, nervous and endocrine systems => ${Bi("human-physiology")}`,
            `Developmental and reproductive biology | gametogenesis, fertilisation => ${Bi("reproduction")}`,
            `Human diseases and immunity | pathogens, immunity => ${Bi("human-health-and-disease")}`,
          ], 50],
        ],
        mock: { minutes: 30, groups: [group(8, "choice", 2, 1), group(12, "choice", 3, 1)], grades: GRADES_NEB },
      },
    },
  },

  // ------------------------------------------------------------ Šrilanka
  // Vir: https://doenets.lk/images/resources/NEWS/OL%20timetable%20English%20-%202025%202026_1767340604386.pdf (Matematika I
  //      08:30–10:30, II 13:00–16:10; Naravoslovje I 1 h, II 08:30–11:40),
  //      https://e-thaksalawa.moe.gov.lk/lcms/pluginfile.php/13107/mod_resource/content/1/Maths_Rehearsal%20pp%20II_%202020.pdf
  //      (Matematika II: 3 h, del A in B, po 5 vprašanj), https://wenr.wes.org/?p=2203 (ocene A 75, B 65, C 50, S 35).
  // 25 kratkih vprašanj v delu A in 40 MCQ pri Naravoslovju I sta iz sekundarnih virov (opisano kot »about«).
  // Vrzeli: matrike (samo seštevanje/množenje), grafi funkcij, konstrukcije in geometrijska mesta točk;
  // hitrost reakcije (banka: red reakcije – nad programom). Biologija je na ravni O/L (10. razred).
  GCEOL: {
    name: "G.C.E. O/L",
    full: "G.C.E. Ordinary Level (Sri Lanka)",
    country: "Sri Lanka",
    systems: ["LK"],
    board: true,
    forLevel: [6, 10],
    about:
      "The G.C.E. O/L is taken at the end of Grade 11 in Sinhala, Tamil or English medium. Mathematics has Paper I (2 hours: Part A about 25 short questions, Part B structured questions) and Paper II (3 hours: five questions from each of Parts A and B). Science has Paper I (1 hour, about 40 multiple-choice questions) and Paper II (3 hours, structured and essay questions covering physics, chemistry and biology). Grades are A (75 %), B, C, S (35 %) and W. The mock covers short Paper I questions; the grade is an estimate.",
    subjects: {
      MAT: {
        units: [
          ["Number and finance", [
            `Percentages, rates and taxes | profit and loss, rates, taxes => ${M("ratios-rates-and-percentages")}`,
            `Compound interest | interest, depreciation => ${M("exponential-growth-and-decay")}`,
            `Logarithms | log laws, calculations with logarithms => ${M("logarithms")}`,
          ], 20],
          ["Algebra", [
            `Simultaneous equations | elimination, substitution => ${M("systems-of-linear-equations")}`,
            `Quadratic equations | factorising, formula => ${M("quadratic-equations")}`,
            `Inequalities | linear inequalities, integer solutions => ${M("quadratic-inequalities")}`,
            `Progressions | arithmetic and geometric progressions => ${M("arithmetic-progressions")}, ${M("geometric-progressions")}`,
            `Sets | Venn diagrams with up to three sets, set operations => ${M("sets-and-logic")}`,
          ], 30],
          ["Geometry, measurement and trigonometry", [
            `Similar triangles and Pythagoras' theorem | proportional sides, areas => ${M("similar-triangles")}`,
            `Circle measurements | arc length, sector area => ${M("circles")}`,
            `Circle theorems | angles in a circle, cyclic quadrilaterals, tangents => ${M("circle-theorems")}`,
            `Surface area and volume | cylinder, cone, sphere, prism => ${M("surface-areas-and-volumes")}`,
            `Trigonometry | ratios, angles of elevation and depression => ${M("right-triangle-trigonometry")}`,
          ], 35],
          ["Statistics and probability", [
            `Statistics | mean of grouped data, quartiles => ${M("statistics-of-grouped-data")}`,
            `Probability | tree diagrams, independent events => ${M("probability")}`,
          ], 15],
        ],
        mock: { minutes: 45, groups: [group(10, "numeric", 1, 2), group(10, "numeric", 2, 2), group(2, "numeric", 3, 5)], grades: GRADES_LK_OL },
      },
      FIZ: {
        units: [
          ["Physics (Science)", [
            `Motion and Newton's laws | equations of motion, F = ma => ${F("kinematics")}, ${F("laws-of-motion")}`,
            `Work, energy and power | efficiency => ${F("work-energy-and-power")}`,
            `Moments and equilibrium | principle of moments => ${F("moments-and-equilibrium")}`,
            `Pressure | pressure in liquids, atmospheric pressure, hydraulic systems => ${F("density-and-pressure")}`,
            `Heat | specific heat capacity, latent heat => ${F("calorimetry")}`,
            `Waves and sound | wave speed, frequency => ${F("waves-and-sound")}`,
            `Light | refraction, lenses => ${F("optics")}`,
            `Current electricity and domestic electricity | Ohm's law, power, energy cost => ${F("current-electricity")}, ${F("electric-power-and-household-circuits")}`,
            `Electromagnetism | motors, generators, induction => ${F("magnetism-and-induction")}`,
            `Electronics | diodes, transistors, logic gates => ${F("semiconductors-and-logic-gates")}`,
          ]],
        ],
        mock: { minutes: 30, groups: [group(10, "choice", 1, 1), group(5, "choice", 2, 1), group(3, "numeric", 2, 2)], grades: GRADES_LK_OL },
      },
      KEM: {
        units: [
          ["Chemistry (Science)", [
            `Structure of matter | atomic structure, electronic configuration => ${K("atomic-structure")}`,
            `Periodic table | groups, periods, trends => ${K("periodic-table-and-periodic-properties")}`,
            `Chemical bonding | ionic and covalent bonds => ${K("chemical-bonding")}`,
            `Mole concept | relative mass, moles => ${K("mole-concept")}`,
            `Chemical reactions | equations, types of reactions => ${K("chemical-reactions-and-equations")}`,
            `Solutions | concentration => ${K("solutions-and-concentration")}`,
            `Acids, bases and salts | pH, neutralisation => ${K("acids-bases-and-ph")}`,
            `Electrochemistry | electrolysis, simple cells => ${K("electrochemistry")}`,
            `Metals and their extraction | reactivity series => ${K("metals-and-non-metals")}`,
            `Hydrocarbons and their derivatives | alkanes, alkenes, alcohols => ${K("organic-chemistry-nomenclature-and-isomerism")}`,
          ]],
        ],
        mock: { minutes: 25, groups: [group(10, "choice", 1, 1), group(5, "choice", 2, 1), group(2, "numeric", 2, 2)], grades: GRADES_LK_OL },
      },
      BIO: {
        units: [
          ["Biology (Science)", [
            `Cell and biomolecules | cell structure, carbohydrates, proteins => ${Bi("cell-structure-and-biomolecules")}`,
            `Classification of organisms | plant and animal groups => ${Bi("diversity-of-living-organisms")}`,
            `Photosynthesis and plant processes | photosynthesis, transport in plants => ${Bi("life-processes")}`,
            `Human body systems | digestion, circulation, breathing, excretion => ${Bi("life-processes")}`,
            `Coordination | nervous system, reflexes, hormones, plant responses => ${Bi("control-and-coordination")}`,
            `Reproduction | plants and humans => ${Bi("how-organisms-reproduce")}`,
            `Heredity | Mendel's experiments => ${Bi("heredity-and-variation")}`,
            `Ecology | food chains, energy flow => ${Bi("our-environment")}`,
            `Health and disease | pathogens, immunity => ${Bi("human-health-and-disease")}`,
          ]],
        ],
        mock: { minutes: 20, groups: [group(10, "choice", 1, 1), group(5, "choice", 2, 1)], grades: GRADES_LK_OL },
      },
    },
  },
  // Vir: https://www.doenets.lk/images/resources/NEWS/AL%20Time%20Table%202025_1755235159873.pdf (Kombinirana matematika I/II
  //      08:30–11:40; Fizika/Kemija/Biologija I 2 h, II 3 h 10 min), https://open-exam-prep.com/practice/lk-gce-al-combined-maths
  //      (del A 10 obveznih, del B 5 od 7), https://sozai.app/transcript/s-f-level-student-three-months-b-grade-physics-anuradha-perera/
  //      (fizika: 50 % MCQ). 50 MCQ s 5 možnostmi = splošno znan format, ni preverjen na uradnem dokumentu.
  //      https://learner.net/u/srilanka-advanced-mathematics-study (enote kombinirane matematike: binomski razvoj,
  //      matrike, krožnica – stožnic ni, le parametrične krivulje pri odvajanju; statistika z varianco).
  // Vrzeli: indukcija, parcialni ulomki, sinusni/kosinusni izrek, sistemi palic in okvirji, težišče;
  // uporabna biologija (razen mikrobov).
  GCEAL: {
    name: "G.C.E. A/L",
    full: "G.C.E. Advanced Level (Sri Lanka)",
    country: "Sri Lanka",
    systems: ["LK"],
    board: true,
    forLevel: [11, 12],
    about:
      "The G.C.E. A/L is taken at the end of Grade 13 in Sinhala, Tamil or English medium; university entry uses z-scores. Combined Mathematics has two 3-hour papers (I: pure mathematics, II: applied mathematics), each with Part A of ten compulsory short questions and Part B where five of seven longer questions are answered. Physics, Chemistry and Biology have Paper I (2 hours, 50 five-option MCQs) and Paper II (3 hours, structured and essay questions). Grades are A (75 %), B, C, S (35 %) and F. The mock covers Combined Mathematics Part A or a Paper I MCQ section; the grade is an estimate.",
    subjects: {
      MAT: {
        units: [
          ["Combined Mathematics I (pure)", [
            `Functions and polynomials | composition, remainder theorem => ${M("functions")}, ${M("polynomials")}`,
            `Quadratic functions and equations | roots, discriminant => ${M("quadratic-equations")}`,
            `Inequalities | rational and quadratic inequalities => ${M("quadratic-inequalities")}`,
            `Permutations and combinations | arrangements, selections => ${M("permutations-and-combinations")}`,
            `Sequences and series | arithmetic and geometric series => ${M("arithmetic-progressions")}, ${M("geometric-progressions")}`,
            `Complex numbers | Argand diagram, modulus, argument => ${M("complex-numbers")}`,
            `Trigonometry | identities, trigonometric equations, inverse functions => ${M("trigonometric-identities")}, ${M("inverse-trigonometric-functions")}`,
            `Limits and differentiation | limits, derivatives, applications => ${M("limits-and-continuity")}, ${M("differentiation")}`,
            `Integration | by parts, partial fractions, area => ${M("integration")}`,
            `Straight lines and circles | equations of lines and circles => ${M("coordinate-geometry")}, ${M("circles")}`,
            `Binomial expansion | positive integral index, general term, coefficients => ${M("binomial-theorem")}`,
            `Matrices | operations, inverse of a 2×2 matrix, simultaneous equations => ${M("matrices-and-determinants")}`,
          ], 50],
          ["Combined Mathematics II (applied)", [
            `Vectors | scalar product, vector geometry => ${M("vectors")}`,
            `Coplanar forces and friction | resultant, moments, equilibrium => ${F("moments-and-equilibrium")}`,
            `Kinematics and projectiles | velocity–time graphs, relative motion, projectiles => ${F("kinematics")}, ${F("projectile-motion")}`,
            `Newton's laws of motion | connected particles => ${F("laws-of-motion")}`,
            `Work, energy, power, impulse and momentum | collisions => ${F("work-energy-and-power")}, ${F("momentum-and-collisions")}`,
            `Circular motion and simple harmonic motion | vertical circle, SHM => ${F("circular-motion-and-gravitation")}, ${F("oscillations")}`,
            `Probability | conditional probability, independence => ${M("probability")}, ${M("conditional-probability-and-bayes-theorem")}`,
            `Statistics | mean, median, variance, standard deviation => ${M("statistics-mean-median")}, ${M("measures-of-dispersion")}`,
          ], 50],
        ],
        mock: { minutes: 60, groups: [group(6, "numeric", 2, 25), group(4, "numeric", 3, 25)], grades: GRADES_LK_AL },
      },
      FIZ: {
        units: [
          ["Measurement, mechanics, oscillations and waves", [
            `Measurement | units, dimensions, errors => ${F("units-measurement-and-errors")}`,
            `Mechanics | kinematics, Newton's laws, momentum => ${F("kinematics")}, ${F("laws-of-motion")}, ${F("momentum-and-collisions")}`,
            `Work, energy and rotational motion | moment of inertia, torque => ${F("work-energy-and-power")}, ${F("rotational-motion")}`,
            `Oscillations and waves | SHM, stationary waves, Doppler effect => ${F("oscillations")}, ${F("waves-and-sound")}`,
            `Geometrical optics | refraction, lenses, mirrors => ${F("optics")}, ${F("spherical-mirrors")}`,
          ], 40],
          ["Thermal physics and fields", [
            `Thermal physics | gas laws, first law, calorimetry => ${F("thermal-physics")}, ${F("calorimetry")}`,
            `Gravitational field | orbits, escape velocity => ${F("circular-motion-and-gravitation")}`,
            `Electrostatic field | Coulomb's law, capacitors => ${F("electrostatics-and-capacitors")}`,
            `Magnetic field | force on a conductor, induction => ${F("magnetism-and-induction")}`,
          ], 30],
          ["Current electricity, electronics, matter and radiation", [
            `Mechanical properties of matter | elasticity, viscosity, hydrostatics, Bernoulli's principle => ${F("elasticity")}, ${F("fluids-and-buoyancy")}`,
            `Current electricity | Kirchhoff's laws, potentiometer => ${F("current-electricity")}`,
            `Electronics | diodes, transistors, logic gates => ${F("semiconductors-and-logic-gates")}`,
            `Matter and radiation | photoelectric effect, radioactivity => ${F("modern-physics")}`,
          ], 30],
        ],
        mock: { minutes: 60, groups: [group(10, "choice", 2, 1, 0, 5), group(15, "choice", 3, 1, 0, 5)], grades: GRADES_LK_AL },
      },
      KEM: {
        units: [
          ["Physical chemistry", [
            `Atomic structure | electronic configuration, spectra => ${K("atomic-structure")}`,
            `Structure and bonding | VSEPR shapes, hybridisation => ${K("chemical-bonding")}`,
            `Chemical calculations | mole, stoichiometry, concentration => ${K("mole-concept")}, ${K("stoichiometry")}, ${K("solutions-and-concentration")}`,
            `Gaseous state of matter | ideal gas equation, partial pressures => ${K("gaseous-state")}`,
            `Energetics | enthalpy, Hess's law, Gibbs energy => ${K("thermochemistry")}`,
            `Chemical kinetics | rate law, half-life => ${K("chemical-kinetics")}`,
            `Equilibrium | Kc, Kp, acids and bases, buffers => ${K("chemical-equilibrium")}, ${K("acids-bases-and-ph")}`,
            `Electrochemistry | electrode potentials, electrolysis => ${K("electrochemistry")}`,
          ], 45],
          ["Inorganic chemistry", [
            `Periodic table | periodic trends => ${K("periodic-table-and-periodic-properties")}`,
            `Chemistry of s-, p- and d-block elements | compounds and properties => ${K("s-p-d-and-f-block-elements")}`,
            `Identification of ions | cations and anions, gas tests => ${K("identification-of-ions-and-gases")}`,
          ], 20],
          ["Organic chemistry", [
            `Organic compounds: nomenclature and isomerism | IUPAC names, isomers => ${K("organic-chemistry-nomenclature-and-isomerism")}`,
            `Organic reactions | reagents, mechanisms, conversions => ${K("organic-chemistry-reactions")}`,
          ], 25],
          ["Industrial chemistry and environmental pollution", [
            `Industrial chemistry | Contact process, conditions and yield => ${K("industrial-chemistry")}`,
            `Polymers | addition and condensation polymers => ${K("polymers")}`,
            `Environmental pollution | greenhouse effect, ozone depletion, acid rain, water quality => ${K("environmental-chemistry")}`,
          ], 10],
        ],
        mock: { minutes: 60, groups: [group(10, "choice", 2, 1, 0, 5), group(15, "choice", 3, 1, 0, 5)], grades: GRADES_LK_AL },
      },
      BIO: {
        units: [
          ["Cells, biomolecules and diversity", [
            `Chemical and cellular basis of life | biomolecules, enzymes, organelles => ${Bi("cell-structure-and-biomolecules")}`,
            `Cell division | mitosis and meiosis => ${Bi("cell-cycle-and-cell-division")}`,
            `Evolution and diversity of organisms | classification, evolution => ${Bi("diversity-of-living-organisms")}, ${Bi("evolution")}`,
          ], 25],
          ["Plant and animal form and function", [
            `Plant form and function | photosynthesis, transport, growth regulators => ${Bi("plant-physiology")}`,
            `Plant tissues and structure | meristems, root, stem and leaf anatomy => ${Bi("plant-anatomy-and-morphology")}`,
            `Animal form and function | digestion, circulation, breathing, excretion, coordination => ${Bi("human-physiology")}`,
            `Reproduction | human and plant reproduction => ${Bi("reproduction")}`,
            `Immunity and disease | immune response, pathogens => ${Bi("human-health-and-disease")}`,
          ], 40],
          ["Genetics, molecular biology and environment", [
            `Genetics | Mendelian ratios, linkage, sex-linked traits => ${Bi("genetics-and-inheritance")}`,
            `Molecular biology and recombinant DNA technology | replication, gene expression, PCR => ${Bi("molecular-basis-of-inheritance")}, ${Bi("biotechnology")}`,
            `Environmental biology | ecosystems, biodiversity => ${Bi("ecology-and-environment")}`,
            `Microbiology | microbes in food, industry, agriculture and sewage treatment => ${Bi("microbes-in-human-welfare")}`,
          ], 35],
        ],
        mock: { minutes: 60, groups: [group(10, "choice", 2, 1, 0, 5), group(15, "choice", 3, 1, 0, 5)], grades: GRADES_LK_AL },
      },
    },
  },

  // ------------------------------------------------------------ Egipt
  // Vir: https://www.elwatannews.com/news/details/8300206 (2026: točke po predmetih – fizika, kemija, biologija po 60,
  //      matematika 60 = čista + uporabna; bubble sheet + list za esejska vprašanja),
  //      https://filgamaa.com/مواصفات-امتحانات-الثانوية-العامة-2026-عد/ (fizika/kemija/biologija 46 vprašanj = 44 MCQ + 2 eseja;
  //      fizika 32 × 1 + 12 × 2 + 2 × 2 = 60; čista matematika 20 = 10 × 1 + 8 × 2 + 2 × 2 = 30),
  //      https://cairoscene.com/buzz/thanawiyya-amma-exam-restructured-to-include-more-mcqs-and-no-optional-questions.
  // Trajanje pisnih izpitov iz naravoslovja v virih ni enotno (zato ga about ne navaja); čista matematika 2 h.
  // Vrzeli: lasersko sevanje kot posebna tema (pokrito samo z modern-physics).
  THANAWEYA: {
    name: "Thanaweya Amma",
    full: "Thanaweya Amma (General Secondary Certificate, Egypt – 3rd secondary year)",
    country: "Egypt",
    systems: ["EG"],
    board: true,
    forLevel: [10, 12],
    about:
      "Thanaweya Amma is taken at the end of the 3rd secondary year in Arabic (language schools take the science and mathematics papers in English or French); the science branch takes physics, chemistry and biology, the mathematics branch pure and applied mathematics with physics and chemistry. Physics, chemistry and biology are 60 marks each: 46 questions, 44 four-option MCQs on a bubble sheet (1 or 2 marks) and 2 short written questions. Mathematics is two 30-mark papers (pure and applied), each with 18 MCQs and 2 written questions. The mathematics mock is one 30-mark paper drawn from pure and applied topics, the science mocks are about half a paper, and each gives a score on the paper's scale (essay questions become short answers); check the latest Ministry specification.",
    subjects: {
      MAT: {
        units: [
          ["Pure mathematics: calculus", [
            `Differentiation | derivatives of trigonometric functions, chain rule, implicit differentiation => ${M("differentiation")}`,
            `Behaviour of the function and curve sketching | increasing and decreasing, maxima and minima => ${M("differentiation")}`,
            `Integration | indefinite and definite integrals, area => ${M("integration")}`,
          ], 25],
          ["Pure mathematics: algebra and solid geometry", [
            `Permutations and combinations | counting, nCr => ${M("permutations-and-combinations")}`,
            `Binomial theorem | general term, middle term, ratio of consecutive terms => ${M("binomial-theorem")}`,
            `Complex numbers | trigonometric form, De Moivre's theorem, cube roots of unity => ${M("complex-numbers")}`,
            `Determinants and matrices | determinants, inverse matrix => ${M("matrices-and-determinants")}`,
            `Vectors in space | dot and cross product => ${M("vectors")}`,
            `Straight lines and planes in space | equations, angles, distances => ${M("three-dimensional-geometry")}`,
          ], 25],
          ["Applied mathematics: statics", [
            `Friction and equilibrium of a rigid body | moments, couples, equilibrium => ${F("moments-and-equilibrium")}`,
          ], 25],
          ["Applied mathematics: dynamics", [
            `Rectilinear motion | velocity and acceleration as derivatives => ${F("kinematics")}`,
            `Newton's laws of motion | connected bodies, pulleys => ${F("laws-of-motion")}`,
            `Impulse and collisions | momentum, impulse => ${F("momentum-and-collisions")}`,
            `Work, energy and power | work–energy principle => ${F("work-energy-and-power")}`,
          ], 25],
        ],
        mock: { minutes: 60, groups: [group(10, "choice", 2, 1), group(8, "choice", 3, 2), group(2, "numeric", 3, 2)], scale: [0, 30, 0.5] },
      },
      FIZ: {
        units: [
          ["Electricity and electromagnetism", [
            `Electric current and Ohm's law | resistivity, Kirchhoff's laws => ${F("current-electricity")}`,
            `Magnetic effects of electric current | force on a wire, measuring instruments => ${F("magnetism-and-induction")}`,
            `Electromagnetic induction | Faraday's law, transformers, dynamo => ${F("magnetism-and-induction")}`,
            `Alternating current circuits | reactance, impedance, resonance => ${F("alternating-current")}`,
          ], 60],
          ["Modern physics", [
            `Wave–particle duality, atomic spectra and lasers | photoelectric effect, energy levels => ${F("modern-physics")}`,
            `Modern electronics | semiconductors, diodes, logic gates => ${F("semiconductors-and-logic-gates")}`,
          ], 40],
        ],
        mock: { minutes: 45, groups: [group(16, "choice", 2, 1), group(6, "choice", 3, 2), group(1, "numeric", 3, 2)], scale: [0, 60, 0.5] },
      },
      KEM: {
        units: [
          ["Inorganic and analytical chemistry", [
            `Transition elements | electronic configuration, oxidation states, iron => ${K("s-p-d-and-f-block-elements")}`,
            `Chemical analysis: qualitative | tests for anions and cations => ${K("identification-of-ions-and-gases")}`,
            `Chemical analysis: quantitative | titration, gravimetric analysis => ${K("solutions-and-concentration")}, ${K("stoichiometry")}`,
          ], 30],
          ["Physical chemistry", [
            `Chemical equilibrium | Kc, Kp, Le Chatelier's principle => ${K("chemical-equilibrium")}`,
            `Ionic equilibrium | pH, ionisation constants, solubility product => ${K("acids-bases-and-ph")}`,
            `Electrochemistry | galvanic cells, electrolysis, Faraday's laws => ${K("electrochemistry")}`,
          ], 35],
          ["Organic chemistry", [
            `Organic compounds | hydrocarbons, alcohols, phenols, acids, esters, nomenclature => ${K("organic-chemistry-nomenclature-and-isomerism")}`,
            `Organic reactions | preparation and reactions of organic compounds => ${K("organic-chemistry-reactions")}`,
          ], 35],
        ],
        mock: { minutes: 45, groups: [group(16, "choice", 2, 1), group(6, "choice", 3, 2), group(1, "numeric", 3, 2)], scale: [0, 60, 0.5] },
      },
      BIO: {
        units: [
          ["Biology", [
            `Support and movement | skeleton, muscles, support in plants => ${Bi("human-physiology")}`,
            `Coordination in living organisms | nervous and hormonal coordination => ${Bi("human-physiology")}, ${Bi("plant-physiology")}`,
            `Reproduction in living organisms | human and plant reproduction => ${Bi("reproduction")}`,
            `Immunity | immune system, vaccines => ${Bi("human-health-and-disease")}`,
            `Nucleic acids and protein synthesis | DNA, replication, genetic code => ${Bi("molecular-basis-of-inheritance")}`,
          ]],
        ],
        mock: { minutes: 45, groups: [group(16, "choice", 2, 1), group(7, "choice", 3, 2)], scale: [0, 60, 0.5] },
      },
    },
  },
};

// Državni in mednarodni izpiti (podatki, enaka oblika kot EXAMS v exam-data.js).
// Zahod / mednarodno: ACT, AP, IB Diploma. Teme so samo iz angleške banke (*-EXB).
// SQA Higher (Škotska) je izpuščen: SQA v letu 2026-27 menja zgradbo izpitov iz naravoslovja
// (Physics: en sam izpit namesto Paper 1 + 2, Chemistry v postopku), zato format ni jasen.
import { M, F, K, Bi, group } from "./exam-helpers.js";

// AP 1–5: meje se po predmetih in letih razlikujejo (College Board ne objavi odstotkov); groba ocena.
const GRADES_AP = [[65, "5"], [50, "4"], [38, "3"], [25, "2"], [0, "1"]];
// IB 1–7: meje se po predmetih in sejah razlikujejo (IB jih objavi po vsaki seji); groba ocena.
const GRADES_IB = [[75, "7"], [62, "6"], [50, "5"], [38, "4"], [25, "3"], [12, "2"], [0, "1"]];

export const EXAMS_WEST = {
  // ------------------------------------------------------------ ACT (ZDA)
  // Vir: https://www.act.org/content/act/en/products-and-services/the-act/test-changes/enhancements.html
  //      (Math 45 vprašanj v 50 min, Science 40 v 40 min, Science in Writing neobvezna, ne štejeta v composite),
  //      https://www.azed.gov/sites/default/files/2025/10/ACT_Enhancements.pdf, https://magoosh.com/act/enhanced-act/
  //      (pri matematiki 4 možnosti namesto 5; lestvica 1–36 na del).
  // Science je branje podatkov iz odlomkov (biologija, kemija, fizika, vede o Zemlji): banka nima odlomkov,
  // zato naravoslovje vadi vsebino po predmetih. Vrzeli: vede o Zemlji in vesolju, eksperimentalni odlomki.
  ACT: {
    name: "ACT",
    full: "ACT – Math and Science sections (enhanced ACT)",
    country: "United States",
    systems: ["US", "INTL"],
    about:
      "The enhanced ACT (since 2025) has English, Reading and Math as the core test and Science as an optional section that no longer counts towards the composite. Math has 45 multiple-choice questions (four options) in 50 minutes, calculator allowed; Science has 40 questions in 40 minutes based on data, experiments and conflicting viewpoints from biology, chemistry, physics and earth science. Each section is scored from 1 to 36; there is no penalty for wrong answers. The mock covers a shorter set at the real pace (Science: questions from one science, not full passages); the score is an estimate.",
    subjects: {
      MAT: {
        units: [
          ["Number and quantity", [
            `Real and complex numbers | factors, exponents, radicals, complex numbers => ${M("real-numbers")}, ${M("indices-and-surds")}, ${M("complex-numbers")}`,
            `Vectors and matrices | magnitude, matrix operations, determinants => ${M("vectors")}, ${M("matrices-and-determinants")}`,
          ], 11],
          ["Algebra", [
            `Linear equations and systems | solving, systems of two equations => ${M("systems-of-linear-equations")}`,
            `Quadratics and inequalities | roots, factoring, inequalities => ${M("quadratic-equations")}, ${M("quadratic-inequalities")}`,
            `Exponential models | growth and decay => ${M("exponential-growth-and-decay")}`,
          ], 18],
          ["Functions", [
            `Functions | notation, composition, inverse => ${M("functions")}`,
            `Logarithms and sequences | log laws, arithmetic and geometric sequences => ${M("logarithms")}, ${M("arithmetic-progressions")}, ${M("geometric-progressions")}`,
            `Trigonometric functions | identities, special angles => ${M("trigonometric-identities")}`,
          ], 18],
          ["Geometry", [
            `Coordinate geometry | slope, distance, equation of a line and circle => ${M("coordinate-geometry")}, ${M("circles")}`,
            `Triangles and trigonometry | similar triangles, right-triangle trigonometry => ${M("similar-triangles")}, ${M("right-triangle-trigonometry")}`,
            `Area and volume | prisms, cylinders, cones, spheres => ${M("surface-areas-and-volumes")}`,
          ], 18],
          ["Statistics and probability", [
            `Data | mean, median, spread => ${M("statistics-mean-median")}, ${M("measures-of-dispersion")}`,
            `Probability and counting | arrangements, conditional probability => ${M("probability")}, ${M("permutations-and-combinations")}`,
          ], 14],
          ["Integrating essential skills", [
            `Rates, ratios and percentages | percent change, unit rates => ${M("ratios-rates-and-percentages")}`,
          ], 21],
        ],
        mock: { minutes: 28, groups: [group(8, "choice", 1, 1), group(11, "choice", 2, 1), group(6, "choice", 3, 1)], scale: [1, 36, 1] },
      },
      FIZ: {
        units: [
          ["Physics in Science passages", [
            `Motion and forces | speed, acceleration, Newton's laws => ${F("kinematics")}, ${F("laws-of-motion")}`,
            `Energy and momentum | work, energy, collisions => ${F("work-energy-and-power")}, ${F("momentum-and-collisions")}`,
            `Waves and light | wave speed, refraction => ${F("waves-and-sound")}, ${F("optics")}`,
            `Electric circuits | Ohm's law, resistors => ${F("current-electricity")}`,
            `Heat and pressure | gas laws, density => ${F("thermal-physics")}, ${F("density-and-pressure")}`,
          ]],
        ],
        mock: { minutes: 14, groups: [group(5, "choice", 1, 1), group(6, "choice", 2, 1), group(3, "choice", 3, 1)], scale: [1, 36, 1] },
      },
      KEM: {
        units: [
          ["Chemistry in Science passages", [
            `Atoms and the periodic table | atomic structure, trends => ${K("atomic-structure")}, ${K("periodic-table-and-periodic-properties")}`,
            `Reactions and the mole | balancing, moles => ${K("chemical-reactions-and-equations")}, ${K("mole-concept")}`,
            `Solutions, acids and bases | concentration, pH => ${K("solutions-and-concentration")}, ${K("acids-bases-and-ph")}`,
            `Gases and reaction rates | gas laws, rate => ${K("gaseous-state")}, ${K("chemical-kinetics")}`,
          ]],
        ],
        mock: { minutes: 14, groups: [group(5, "choice", 1, 1), group(6, "choice", 2, 1), group(3, "choice", 3, 1)], scale: [1, 36, 1] },
      },
      BIO: {
        units: [
          ["Biology in Science passages", [
            `Cells and enzymes | organelles, enzyme activity => ${Bi("cell-structure-and-biomolecules")}`,
            `Genetics | inheritance, Punnett squares => ${Bi("genetics-and-inheritance")}`,
            `Physiology | photosynthesis, human body systems => ${Bi("plant-physiology")}, ${Bi("human-physiology")}`,
            `Ecology and evolution | populations, natural selection => ${Bi("ecology-and-environment")}, ${Bi("evolution")}`,
          ]],
        ],
        mock: { minutes: 14, groups: [group(5, "choice", 1, 1), group(6, "choice", 2, 1), group(3, "choice", 3, 1)], scale: [1, 36, 1] },
      },
    },
  },

  // ------------------------------------------------------------ AP (ZDA)
  // Vir: https://apcentral.collegeboard.org/courses/ap-calculus-ab/exam (maj 2027: Section I 42 MCQ v 1 h 40 min:
  //      Part A 29 v 62 min brez računala, Part B 13 v 38 min z grafičnim računalom; Section II 6 FRQ, 90 min),
  //      https://apcentral.collegeboard.org/courses/ap-physics-1/exam (maj 2027: 42 MCQ v 85 min, 4 FRQ v 95 min),
  //      https://apcentral.collegeboard.org/courses/ap-chemistry/exam (60 MCQ v 90 min, 7 FRQ v 105 min),
  //      https://apcentral.collegeboard.org/courses/ap-biology/exam (60 MCQ v 90 min, 6 FRQ v 90 min).
  // Vsi hibridno digitalni (Bluebook, FRQ na papir); MCQ 4 možnosti, brez negativnih točk.
  // Uteži sklopov po deležih enot v CED (Calculus AB: enote 2–5 ≈ 50 %, 6 in 8 ≈ 31 %).
  // Calculus BC ima isto obliko in dodatne teme; tu je AB. Vrzeli: slope fields, implicit differentiation
  // posebej (MAT); intermolecular forces, photoelectron spectroscopy (KEM); cell communication (BIO).
  AP: {
    name: "AP exams",
    full: "AP (Advanced Placement) – Calculus AB, Physics 1, Chemistry, Biology",
    country: "United States",
    systems: ["US", "INTL"],
    about:
      "AP exams are written in May and taken in Bluebook (multiple choice on screen, free-response answers by hand). From May 2027 Calculus AB has 42 multiple-choice questions in 1 h 40 min (29 without a calculator, 13 with) and 6 free-response questions; Physics 1 has 42 questions in 85 minutes and 4 free-response questions; Chemistry and Biology each have 60 multiple-choice questions in 90 minutes and 7 or 6 free-response questions. All multiple-choice questions have four options and no penalty. Scores go from 1 to 5. The mock covers part of the multiple-choice section at the real pace; the score is a rough estimate.",
    subjects: {
      MAT: {
        units: [
          ["Limits and continuity", [
            `Limits and continuity | limits, asymptotes, continuity at a point => ${M("limits-and-continuity")}`,
          ], 11],
          ["Differentiation", [
            `Differentiation: definition and rules | product, quotient and chain rules => ${M("differentiation")}`,
            `Contextual applications of differentiation | related rates, motion, linearisation => ${M("differentiation")}`,
            `Analytical applications of differentiation | extrema, concavity, optimisation => ${M("differentiation")}`,
          ], 49],
          ["Integration", [
            `Integration and accumulation of change | Riemann sums, Fundamental Theorem => ${M("integration")}`,
            `Applications of integration | area between curves, volumes => ${M("integration")}`,
          ], 31],
          ["Differential equations", [
            `Differential equations | separation of variables, exponential models => ${M("differential-equations")}, ${M("exponential-growth-and-decay")}`,
          ], 9],
        ],
        mock: { minutes: 32, groups: [group(5, "choice", 1, 1), group(7, "choice", 2, 1), group(3, "choice", 3, 1)], grades: GRADES_AP },
      },
      FIZ: {
        units: [
          ["Kinematics", [`Kinematics | motion graphs, projectiles => ${F("kinematics")}, ${F("projectile-motion")}`], 12],
          ["Force and translational dynamics", [
            `Force and translational dynamics | Newton's laws, friction => ${F("laws-of-motion")}`,
            `Circular motion and gravitation | centripetal force, orbits => ${F("circular-motion-and-gravitation")}`,
          ], 20],
          ["Work, energy and power", [`Work, energy and power | conservation of energy => ${F("work-energy-and-power")}`], 20],
          ["Linear momentum", [`Linear momentum | impulse, collisions => ${F("momentum-and-collisions")}`], 12],
          ["Torque and rotational motion", [
            `Torque and rotational dynamics | torque, rotational inertia => ${F("rotational-motion")}, ${F("moments-and-equilibrium")}`,
            `Energy and momentum of rotating systems | angular momentum, rolling => ${F("rotational-motion")}`,
          ], 19],
          ["Oscillations", [`Oscillations | springs, pendulums => ${F("oscillations")}`], 6],
          ["Fluids", [`Fluids | pressure, buoyancy, Bernoulli => ${F("density-and-pressure")}, ${F("fluids-and-buoyancy")}`], 12],
        ],
        mock: { minutes: 40, groups: [group(6, "choice", 1, 1), group(10, "choice", 2, 1), group(4, "choice", 3, 1)], grades: GRADES_AP },
      },
      KEM: {
        units: [
          ["Atomic structure and properties", [`Atomic structure and properties | moles, electron configuration, periodic trends => ${K("mole-concept")}, ${K("atomic-structure")}, ${K("periodic-table-and-periodic-properties")}`], 8],
          ["Compound structure and properties", [`Molecular and ionic compound structure | Lewis structures, VSEPR => ${K("chemical-bonding")}`], 8],
          ["Properties of substances and mixtures", [`Properties of substances and mixtures | gases, solutions => ${K("gaseous-state")}, ${K("solutions-and-concentration")}`], 20],
          ["Chemical reactions", [`Chemical reactions | stoichiometry, titration, redox => ${K("stoichiometry")}, ${K("chemical-reactions-and-equations")}`], 8],
          ["Kinetics", [`Kinetics | rate laws, half-life => ${K("chemical-kinetics")}`], 8],
          ["Thermochemistry", [`Thermochemistry | calorimetry, Hess's law => ${K("thermochemistry")}`], 8],
          ["Equilibrium", [`Equilibrium | K, Q, Le Chatelier, solubility => ${K("chemical-equilibrium")}`], 8],
          ["Acids and bases", [`Acids and bases | pH, buffers, titrations => ${K("acids-bases-and-ph")}`], 13],
          ["Applications of thermodynamics", [`Applications of thermodynamics | Gibbs energy, electrochemistry => ${K("electrochemistry")}`], 8],
        ],
        mock: { minutes: 30, groups: [group(6, "choice", 1, 1), group(10, "choice", 2, 1), group(4, "choice", 3, 1)], grades: GRADES_AP },
      },
      BIO: {
        units: [
          ["Chemistry of life", [`Chemistry of life | water, macromolecules => ${Bi("cell-structure-and-biomolecules")}`], 9],
          ["Cell structure and function", [`Cell structure and function | organelles, membranes, transport => ${Bi("cell-structure-and-biomolecules")}`], 11],
          ["Cellular energetics", [`Cellular energetics | enzymes, photosynthesis, cellular respiration => ${Bi("plant-physiology")}`], 14],
          ["Cell cycle", [`Cell communication and cell cycle | mitosis, regulation => ${Bi("cell-cycle-and-cell-division")}`], 12],
          ["Heredity", [`Heredity | meiosis, Mendelian genetics, chi-square => ${Bi("genetics-and-inheritance")}`], 10],
          ["Gene expression and regulation", [`Gene expression and regulation | replication, transcription, biotechnology => ${Bi("molecular-basis-of-inheritance")}, ${Bi("biotechnology")}`], 14],
          ["Natural selection", [`Natural selection | evolution, Hardy–Weinberg, phylogeny => ${Bi("evolution")}`], 17],
          ["Ecology", [`Ecology | energy flow, populations, communities => ${Bi("ecology-and-environment")}`], 13],
        ],
        mock: { minutes: 30, groups: [group(6, "choice", 1, 1), group(10, "choice", 2, 1), group(4, "choice", 3, 1)], grades: GRADES_AP },
      },
    },
  },

  // ------------------------------------------------------------ IB Diploma
  // Vir: https://ibchem.com/IB25/assess.php (naravoslovje od 2025: Paper 1 = 1A MCQ + 1B podatki, SL 1 h 30 min / 55 t.,
  //      HL 2 h / 75 t.; Paper 2 SL 1 h 30 min, HL 2 h 30 min; IA 20 %),
  //      https://www.savemyexams.com/learning-hub/exam-guides/how-many-ib-physics-papers/ (fizika 1A: SL 25, HL 40 MCQ),
  //      https://www.savemyexams.com/learning-hub/exam-guides/how-many-ib-biology-papers/ (biologija 1A: SL 30, HL 40),
  //      https://www.revisiondojo.com/blog/ib-exam-structure-explained (Math AA: P1 brez računala, P2 z računalom, HL P3).
  // Math AA nima izbirnih vprašanj. Oznake tem pri biologiji in kemiji so iz vodnikov 2025 (A1–D4, S1–R3).
// Vrzeli: proof, kinematika z analizo (MAT); relativity, greenhouse effect (FIZ);
  // entropy (KEM, delno v thermochemistry); neurobiology, homeostasis podrobno (BIO delno v human-physiology).
  IB: {
    name: "IB Diploma",
    full: "IB Diploma Programme – Mathematics AA, Physics, Chemistry, Biology",
    country: "International",
    systems: ["INTL"],
    board: true,
    forLevel: [11, 12],
    about:
      "The IB Diploma is assessed at the end of the two-year programme in English, French or Spanish; each subject is graded 1 to 7. Mathematics: analysis and approaches has Paper 1 (no calculator) and Paper 2 (calculator), 1 h 30 min each at SL and 2 h each at HL, plus HL Paper 3, all with short and long written questions. Since 2025 Physics, Chemistry and Biology have Paper 1 (SL 1 h 30 min, HL 2 h) with Paper 1A multiple choice (25–30 questions at SL, 40 at HL, four options, no penalty) and Paper 1B data-based questions, then Paper 2 and an internal assessment (20%). The mock covers short Paper 1 questions or Paper 1A at about the real pace; the grade is a rough estimate.",
    subjects: {
      MAT: {
        units: [
          ["Number and algebra", [
            `Sequences and series | arithmetic and geometric series, financial applications => ${M("arithmetic-progressions")}, ${M("geometric-progressions")}`,
            `Exponents and logarithms | laws, equations => ${M("logarithms")}, ${M("exponential-growth-and-decay")}`,
            `Binomial theorem and counting | expansions, permutations and combinations => ${M("binomial-theorem")}, ${M("permutations-and-combinations")}`,
            `Complex numbers (HL) | Cartesian, polar and Euler forms => ${M("complex-numbers")}`,
          ], 16],
          ["Functions", [
            `Functions | composition, inverse, transformations => ${M("functions")}`,
            `Quadratics and polynomials | discriminant, factor theorem, inequalities => ${M("quadratic-equations")}, ${M("polynomials")}, ${M("quadratic-inequalities")}`,
          ], 18],
          ["Geometry and trigonometry", [
            `Trigonometry | identities, equations, sine and cosine rules => ${M("trigonometric-identities")}, ${M("right-triangle-trigonometry")}`,
            `Vectors (HL) | lines and planes in space => ${M("vectors")}, ${M("three-dimensional-geometry")}`,
          ], 21],
          ["Statistics and probability", [
            `Statistics | dispersion, correlation and regression => ${M("measures-of-dispersion")}, ${M("correlation-and-regression")}`,
            `Probability | conditional probability, Bayes' theorem => ${M("conditional-probability-and-bayes-theorem")}`,
            `Probability distributions | binomial and normal distributions => ${M("binomial-distribution")}, ${M("normal-distribution")}`,
          ], 22],
          ["Calculus", [
            `Limits and differentiation | chain rule, optimisation => ${M("limits-and-continuity")}, ${M("differentiation")}`,
            `Integration | definite integrals, areas => ${M("integration")}`,
            `Differential equations (HL) | separable equations => ${M("differential-equations")}`,
          ], 23],
        ],
        mock: { minutes: 45, groups: [group(4, "numeric", 1, 5), group(4, "numeric", 2, 6), group(2, "numeric", 3, 8)], grades: GRADES_IB },
      },
      FIZ: {
        units: [
          ["A. Space, time and motion", [
            `A.1–A.2 Kinematics, forces and momentum | projectiles, Newton's laws, impulse => ${F("kinematics")}, ${F("projectile-motion")}, ${F("laws-of-motion")}, ${F("momentum-and-collisions")}`,
            `A.2 Buoyancy and viscous drag | Archimedes' principle, Stokes' law => ${F("fluids-and-buoyancy")}`,
            `A.3 Work, energy and power | efficiency => ${F("work-energy-and-power")}`,
            `A.4 Rigid body mechanics (HL) | torque, angular momentum => ${F("rotational-motion")}`,
          ], 27],
          ["B. The particulate nature of matter", [
            `B.1–B.3 Thermal energy and gas laws | specific heat, ideal gases => ${F("calorimetry")}, ${F("thermal-physics")}`,
            `B.5 Current and circuits | resistance, internal resistance => ${F("current-electricity")}`,
          ], 22],
          ["C. Wave behaviour", [
            `C.1 Simple harmonic motion | period, energy in SHM => ${F("oscillations")}`,
            `C.2–C.5 Waves | standing waves, Doppler effect, interference => ${F("waves-and-sound")}, ${F("wave-optics")}`,
          ], 17],
          ["D. Fields", [
            `D.1 Gravitational fields | orbits, Kepler's laws => ${F("circular-motion-and-gravitation")}`,
            `D.2 Electric and magnetic fields | Coulomb's law, potential => ${F("electrostatics-and-capacitors")}`,
            `D.3–D.4 Motion in fields and induction | force on charges, Faraday's law => ${F("magnetism-and-induction")}`,
          ], 22],
          ["E. Nuclear and quantum physics", [
            `E.1–E.5 Atoms, quantum and nuclear physics | photoelectric effect, decay, fission => ${F("modern-physics")}`,
          ], 12],
        ],
        mock: { minutes: 35, groups: [group(6, "choice", 1, 1), group(10, "choice", 2, 1), group(4, "choice", 3, 1)], grades: GRADES_IB },
      },
      KEM: {
        units: [
          ["Structure 1. Models of the particulate nature of matter", [
            `S1.2–S1.3 The nuclear atom and electron configurations | isotopes, spectra => ${K("atomic-structure")}`,
            `S1.4–S1.5 The mole and ideal gases | amount, molar volume => ${K("mole-concept")}, ${K("gaseous-state")}`,
          ], 18],
          ["Structure 2. Models of bonding and structure", [
            `S2.1–S2.4 Ionic, covalent and metallic bonding | VSEPR, polarity, hybridisation => ${K("chemical-bonding")}`,
            `S2.4 From models to materials: polymers | addition and condensation polymers => ${K("polymers")}`,
          ], 15],
          ["Structure 3. Classification of matter", [
            `S3.1 The periodic table | trends, transition elements => ${K("periodic-table-and-periodic-properties")}, ${K("s-p-d-and-f-block-elements")}`,
            `S3.2 Functional groups | nomenclature, isomers => ${K("organic-chemistry-nomenclature-and-isomerism")}`,
          ], 17],
          ["Reactivity 1. What drives chemical reactions?", [
            `R1.1–R1.4 Enthalpy, entropy and spontaneity | Hess's law, Gibbs energy => ${K("thermochemistry")}`,
          ], 12],
          ["Reactivity 2. How much, how fast and how far?", [
            `R2.1 Amount of chemical change | stoichiometry, concentration => ${K("stoichiometry")}, ${K("solutions-and-concentration")}`,
            `R2.2 Rates of reaction | rate equations => ${K("chemical-kinetics")}`,
            `R2.3 Equilibrium | K, Le Chatelier => ${K("chemical-equilibrium")}`,
          ], 20],
          ["Reactivity 3. What are the mechanisms of chemical change?", [
            `R3.1 Proton transfer | pH, buffers => ${K("acids-bases-and-ph")}`,
            `R3.2 Electron transfer | redox, cells, electrolysis => ${K("electrochemistry")}`,
            `R3.3–R3.4 Electron sharing and electron-pair sharing | substitution, addition => ${K("organic-chemistry-reactions")}`,
          ], 18],
        ],
        mock: { minutes: 35, groups: [group(6, "choice", 1, 1), group(10, "choice", 2, 1), group(4, "choice", 3, 1)], grades: GRADES_IB },
      },
      BIO: {
        units: [
          ["A. Unity and diversity", [
            `A1 Water and nucleic acids | DNA and RNA structure => ${Bi("molecular-basis-of-inheritance")}`,
            `A2–A3 Cells and diversity of organisms | cell structure, classification => ${Bi("cell-structure-and-biomolecules")}, ${Bi("diversity-of-living-organisms")}`,
            `A4 Evolution, speciation and biodiversity | evidence, speciation, conservation => ${Bi("evolution")}`,
          ], 25],
          ["B. Form and function", [
            `B1–B2 Molecules, membranes and organelles | carbohydrates, proteins, membranes => ${Bi("cell-structure-and-biomolecules")}`,
            `B3 Gas exchange and transport | lungs, circulation, xylem and phloem => ${Bi("human-physiology")}, ${Bi("plant-physiology")}`,
          ], 25],
          ["C. Interaction and interdependence", [
            `C1 Enzymes, cell respiration and photosynthesis | metabolism, energy => ${Bi("plant-physiology")}`,
            `C2–C3 Signalling, body systems and defence | hormones, nerves, immunity => ${Bi("human-physiology")}, ${Bi("human-health-and-disease")}`,
            `C4 Populations, communities and energy transfer | energy flow => ${Bi("ecology-and-environment")}`,
          ], 25],
          ["D. Continuity and change", [
            `D1 DNA replication, protein synthesis and mutation | transcription, translation => ${Bi("molecular-basis-of-inheritance")}`,
            `D2.1 and D3.1 Cell division and reproduction | mitosis, meiosis, gametogenesis => ${Bi("cell-cycle-and-cell-division")}, ${Bi("reproduction")}`,
            `D3.2 Inheritance | Mendelian genetics, sex linkage => ${Bi("genetics-and-inheritance")}`,
          ], 25],
        ],
        mock: { minutes: 35, groups: [group(6, "choice", 1, 1), group(10, "choice", 2, 1), group(4, "choice", 3, 1)], grades: GRADES_IB },
      },
    },
  },
};

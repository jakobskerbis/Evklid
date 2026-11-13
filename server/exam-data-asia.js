// Državni izpiti (podatki, enaka oblika kot EXAMS v exam-data.js).
// Azija: Vietnam, Indonezija, Malezija, Kitajska (zhongkao), Južna Koreja, Japonska.
// Teme so samo iz angleške banke (*-EXB). Kar v banki nima ustrezne teme, je izpuščeno
// (vrzeli so zapisane pri vsakem izpitu v komentarju »Vrzeli«).
import { M, F, K, Bi, group } from "./exam-helpers.js";

// SPM: LP meje ocen vsako leto določi sam; to je pogosta šolska lestvica (ocena je približna).
const GRADES_SPM = [[90, "A+"], [80, "A"], [70, "A−"], [65, "B+"], [60, "B"], [55, "C+"], [50, "C"], [45, "D"], [40, "E"], [0, "G"]];

export const EXAMS_ASIA = {
  // ------------------------------------------------------------ Vietnam
  // Vir: https://lsvn.vn/cau-truc-de-thi-tot-nghiep-thpt-ap-dung-tu-nam-2025-1721520534.html (Bộ GD&ĐT, QĐ 764/QĐ-BGDĐT),
  //      https://thuvienphapluat.vn/hoi-dap-phap-luat/de-vat-li-thi-tot-nghiep-thpt-2026-bao-nhieu-cau-138084641.html
  // Toán 90 min: 12 MCQ (0,25) + 4 Đúng/Sai (1 t., 0,1/0,25/0,5/1) + 6 kratkih (0,5) = 10 t.
  // Lí/Hóa/Sinh 50 min: 18 MCQ (0,25) + 4 Đúng/Sai + 6 kratkih (0,25) = 10 t. 2026 enako kot 2025
  // (Bộ GD&ĐT: struktura ostane, izpit 11. 6. 2026; https://thuvienphapluat.vn/hoi-dap-phap-luat/de-toan-thi-tot-nghiep-thpt-2026-bao-nhieu-cau-138084541.html).
  // Vrzeli: sintetična prostorska geometrija (razdalje, koti v prostoru, 11. r.), izmenični tok in
  // elektromagnetno valovanje (banka: reaktanca, nad programom); sprejemni izpit za 10. razred (Lớp 10)
  // nima skupnega formata (vsaka provinca svoj), zato ga ni.
  THPT: {
    name: "THPT graduation exam",
    full: "Kỳ thi tốt nghiệp THPT (Vietnam national high school graduation exam)",
    country: "Vietnam",
    systems: ["VN"],
    board: true,
    forLevel: [10, 12],
    about:
      "Since 2025 every paper (in Vietnamese) has three parts: Part I four-option multiple choice (0.25 points each), Part II true/false questions with four statements each (1 point; 0.1, 0.25 or 0.5 for one, two or three correct statements) and Part III short numeric answers. Mathematics is 90 minutes: 12 + 4 + 6 questions, short answers 0.5 points. Physics, chemistry and biology are 50 minutes: 18 + 4 + 6 questions, short answers 0.25 points, mainly Grade 12 content. Each paper is marked out of 10. The mock covers Parts I and III (true/false items are not simulated) and gives an estimate on the 10-point scale; check the latest Ministry (Bộ GD&ĐT) specification.",
    subjects: {
      MAT: {
        units: [
          ["Grade 12: calculus", [
            `Applications of derivatives | monotonicity, extrema, maximum and minimum values => ${M("differentiation")}`,
            `Antiderivatives and integrals | definite integrals, area => ${M("integration")}`,
          ], 30],
          ["Grade 12: coordinates in space", [
            `Vectors and coordinates in space | vector operations, dot product => ${M("vectors")}`,
            `Lines, planes and spheres in Oxyz | angles, distances => ${M("three-dimensional-geometry")}`,
          ], 20],
          ["Probability and statistics", [
            `Conditional probability | total probability formula, Bayes' formula => ${M("conditional-probability-and-bayes-theorem")}`,
            `Probability and counting | classical probability, combinations => ${M("probability")}, ${M("permutations-and-combinations")}`,
            `Grouped data | mean, median, mode of grouped data => ${M("statistics-of-grouped-data")}`,
            `Measures of dispersion for grouped data | range, interquartile range, variance, standard deviation => ${M("measures-of-dispersion")}`,
          ], 20],
          ["Grades 10–11: algebra and functions", [
            `Exponential and logarithmic functions | log laws, exponential equations => ${M("logarithms")}, ${M("exponential-growth-and-decay")}`,
            `Trigonometric functions and equations | identities, special angles => ${M("trigonometric-identities")}`,
            `Arithmetic and geometric sequences | general term, sum => ${M("arithmetic-progressions")}, ${M("geometric-progressions")}`,
            `Limits and continuity | limits of functions => ${M("limits-and-continuity")}`,
            `Quadratic functions and inequalities | sign of a quadratic => ${M("quadratic-inequalities")}, ${M("quadratic-equations")}`,
          ], 30],
        ],
        mock: { minutes: 50, groups: [group(6, "choice", 1, 1), group(6, "choice", 2, 1), group(3, "numeric", 2, 2), group(3, "numeric", 3, 2)], scale: [0, 10, 0.05] },
      },
      FIZ: {
        units: [
          ["Thermal physics", [
            `Internal energy and heat | specific heat capacity, latent heat => ${F("calorimetry")}`,
            `Ideal gases | gas laws, kinetic model, temperature => ${F("thermal-physics")}`,
          ]],
          ["Magnetism", [
            `Magnetic field and induction | force on a current-carrying wire, magnetic flux, Faraday's law => ${F("magnetism-and-induction")}`,
          ]],
          ["Nuclear physics", [
            `Nucleus and radioactivity | mass defect, binding energy, half-life => ${F("modern-physics")}`,
          ]],
        ],
        mock: { minutes: 35, groups: [group(8, "choice", 1, 1), group(6, "choice", 2, 1), group(2, "numeric", 2, 1), group(2, "numeric", 3, 1)], scale: [0, 10, 0.05] },
      },
      KEM: {
        units: [
          ["Organic chemistry", [
            `Esters, lipids and carbohydrates | hydrolysis, saponification, glucose and starch => ${K("organic-chemistry-reactions")}`,
            `Nitrogen compounds | amines, amino acids, peptides, proteins => ${K("organic-chemistry-nomenclature-and-isomerism")}`,
            `Polymers | polymerisation, plastics, fibres, rubbers => ${K("polymers")}`,
          ]],
          ["Electrochemistry and metals", [
            `Electrochemistry | electrode potentials, galvanic cells, electrolysis => ${K("electrochemistry")}`,
            `Metals | properties, extraction, corrosion => ${K("metals-and-non-metals")}`,
            `Main-group and transition metals | alkali and alkaline-earth metals, complexes => ${K("s-p-d-and-f-block-elements")}, ${K("coordination-compounds")}`,
          ]],
          ["Chemical calculations", [
            `Moles and reaction calculations | masses from equations, yield => ${K("mole-concept")}, ${K("stoichiometry")}`,
          ]],
        ],
        mock: { minutes: 35, groups: [group(8, "choice", 1, 1), group(6, "choice", 2, 1), group(2, "numeric", 2, 1), group(2, "numeric", 3, 1)], scale: [0, 10, 0.05] },
      },
      BIO: {
        units: [
          ["Genetics", [
            `Molecular genetics | DNA replication, transcription, translation, gene regulation => ${Bi("molecular-basis-of-inheritance")}`,
            `Chromosomes and cell division | chromosome number, mitosis, meiosis => ${Bi("cell-cycle-and-cell-division")}`,
            `Patterns of inheritance | Mendel's laws, linkage, sex-linked traits => ${Bi("genetics-and-inheritance")}`,
            `Applied genetics | recombinant DNA, gene technology => ${Bi("biotechnology")}`,
          ], 50],
          ["Evolution", [
            `Population genetics and evolution | Hardy–Weinberg, natural selection => ${Bi("evolution")}`,
          ], 20],
          ["Ecology", [
            `Populations, communities and ecosystems | energy flow, pyramids, population growth => ${Bi("ecology-and-environment")}`,
          ], 30],
        ],
        mock: { minutes: 35, groups: [group(8, "choice", 1, 1), group(6, "choice", 2, 1), group(2, "numeric", 2, 1), group(2, "numeric", 3, 1)], scale: [0, 10, 0.05] },
      },
    },
  },

  // ------------------------------------------------------------ Indonezija
  // Vir: https://www.cnnindonesia.com/edukasi/20250415164319-561-1219084/perhatikan-ini-jumlah-soal-dan-lama-waktu-pengerjaan-utbk-2025 (po SNPMB),
  //      https://tirto.id/jumlah-soal-utbk-snbt-2025-durasi-waktu-apakah-ada-perubahan-g9cV,
  //      https://www.detik.com/edu/seleksi-masuk-pt/d-7845045/waktu-pengerjaan-utbk-2025-dan-jumlah-soal-masing-masing-berapa-menit-per-tesnya
  // Pengetahuan Kuantitatif 20 vprašanj / 20 min (TPS), Penalaran Matematika 20 / 42,5 min (literasi);
  // 5 možnosti (A–E), PG kompleks (tabela), isian singkat; IRT točkovanje.
  // Vrzeli: ostali deli TPS in literasi (besedilni, jezikovni) niso matematika in jih ni.
  UTBK: {
    name: "UTBK-SNBT",
    full: "UTBK-SNBT (Indonesian state university entrance test)",
    country: "Indonesia",
    systems: ["ID"],
    forLevel: [12, 12],
    about:
      "UTBK-SNBT is the computer-based entrance test for state universities, in Indonesian. Since 2023 it tests scholastic potential and literacy rather than school subjects; the maths parts are Pengetahuan Kuantitatif (20 questions, 20 minutes) and Penalaran Matematika (20 questions, 42.5 minutes, maths in real-life contexts). Questions are five-option multiple choice, complex multiple choice (true/false tables) and short fill-in answers, scored with item response theory so harder questions weigh more. The mock covers both maths subtests with multiple-choice and short-answer questions, without IRT weighting; check the latest SNPMB information.",
    subjects: {
      MAT: {
        units: [
          ["Pengetahuan Kuantitatif (quantitative knowledge)", [
            `Algebra | linear and quadratic equations, inequalities => ${M("systems-of-linear-equations")}, ${M("quadratic-equations")}, ${M("quadratic-inequalities")}`,
            `Functions and number patterns | function values, sequences => ${M("functions")}, ${M("arithmetic-progressions")}, ${M("geometric-progressions")}`,
            `Geometry | lines, triangles, circles => ${M("coordinate-geometry")}, ${M("similar-triangles")}, ${M("circles")}`,
          ], 45],
          ["Penalaran Matematika (mathematical reasoning)", [
            `Numbers in context | percentages, rates, growth => ${M("ratios-rates-and-percentages")}, ${M("exponential-growth-and-decay")}`,
            `Measurement and geometry in context | area, volume, heights and distances => ${M("surface-areas-and-volumes")}, ${M("right-triangle-trigonometry")}`,
            `Data and uncertainty | averages, probability, counting => ${M("statistics-mean-median")}, ${M("probability")}, ${M("permutations-and-combinations")}`,
            `Algebra in context | modelling with equations => ${M("systems-of-linear-equations")}, ${M("functions")}`,
          ], 55],
        ],
        mock: { minutes: 40, groups: [group(8, "choice", 1, 1, 0, 5), group(6, "choice", 2, 1, 0, 5), group(3, "numeric", 2, 1), group(3, "numeric", 3, 1)] },
      },
    },
  },
  // Vir: https://jogja.antaranews.com/berita/831367/kemendikdasmen-serap-aspirasi-kurangi-soal-matematika-tka-sma (Pusmendik, 26. 5. 2026),
  //      https://mamikos.com/info/perbedaan-tka-sma-pljr/?halaman=2, https://www.detik.com/kalimantan/berita/d-8181494/jadwal-dan-daftar-materi-tka-2025-lengkap-untuk-sma-dan-sederajat,
  //      https://www.detik.com/edu/detikpedia/d-8083189/3-jenis-soal-tka-jenjang-sma-dan-sederajat-2025-panduan-belajar-nih,
  //      https://www.kompas.tv/info-publik/621729/cara-menghitung-skor-tka-untuk-sd-smp-sma-dan-smk
  // 2026: Matematika 25 vprašanj / 75 min (2025: 30 vprašanj); izbirni predmet 25 / 60 min; skala 0–100.
  //      https://www.detik.com/edu/sekolah/d-8112635/kisi-kisi-tka-sma-2025-lengkap-materi-contoh-soal-dan-link-simulasi
  //      (elementi: fizika tudi Fluida; kemija tudi konteksti onesnaženje, učinek tople grede, ozon, izdelava osnovnih kemikalij).
  // Vrzeli: Matematika Tingkat Lanjut (uradnega obsega nisem mogel preveriti, ni dodana), dedovanje in
  // evolucija (niso na seznamu snovi), analizna kemija (titracija je pokrita le s koncentracijo).
  TKA: {
    name: "TKA (SMA)",
    full: "Tes Kemampuan Akademik (TKA) for SMA/MA/SMK",
    country: "Indonesia",
    systems: ["ID"],
    board: true,
    forLevel: [10, 12],
    about:
      "TKA is the national computer-based academic test taken in Grade 12 (first held in November 2025), in Indonesian. Everyone sits Matematika (25 questions in 75 minutes from 2026; 30 questions in 2025), Bahasa Indonesia and English, plus two electives such as Fisika, Kimia or Biologi (25 questions in 60 minutes each). Questions are single-answer multiple choice, multiple-answer (MCMA) and true/false category items; results are reported from 0 to 100. The mock covers single-answer multiple-choice questions; check the latest Pusmendik specification.",
    subjects: {
      MAT: {
        units: [
          ["Bilangan (numbers)", [
            `Exponents and logarithms | log laws, exponential growth => ${M("logarithms")}, ${M("exponential-growth-and-decay")}`,
            `Sequences and series | arithmetic and geometric => ${M("arithmetic-progressions")}, ${M("geometric-progressions")}`,
          ]],
          ["Aljabar (algebra)", [
            `Systems of linear equations | two and three variables => ${M("systems-of-linear-equations")}`,
            `Quadratic equations and functions | roots, discriminant => ${M("quadratic-equations")}`,
            `Functions | composition and inverse => ${M("functions")}`,
          ]],
          ["Geometri dan pengukuran, trigonometri", [
            `Circles | equation of a circle, arcs and sectors => ${M("circles")}`,
            `Trigonometry | ratios, angles of elevation => ${M("right-triangle-trigonometry")}`,
          ]],
          ["Data dan peluang (data and probability)", [
            `Statistics | mean, median, grouped data => ${M("statistics-mean-median")}, ${M("statistics-of-grouped-data")}`,
            `Probability | counting, probability of events => ${M("permutations-and-combinations")}, ${M("probability")}`,
          ]],
        ],
        mock: { minutes: 45, groups: [group(5, "choice", 1, 1, 0, 5), group(7, "choice", 2, 1, 0, 5), group(3, "choice", 3, 1, 0, 5)], scale: [0, 100, 0.01] },
      },
      FIZ: {
        units: [
          ["Kinematics and dynamics", [
            `Kinematics | straight-line and projectile motion => ${F("kinematics")}, ${F("projectile-motion")}`,
            `Dynamics | Newton's laws, circular motion => ${F("laws-of-motion")}, ${F("circular-motion-and-gravitation")}`,
            `Work, energy and momentum | energy conservation, collisions => ${F("work-energy-and-power")}, ${F("momentum-and-collisions")}`,
            `Fluida (static and dynamic fluids) | hydrostatic pressure, Archimedes' principle, continuity, Bernoulli's principle => ${F("density-and-pressure")}, ${F("fluids-and-buoyancy")}`,
          ]],
          ["Waves, heat and thermodynamics", [
            `Waves | wave speed, sound => ${F("waves-and-sound")}`,
            `Heat and thermodynamics | heat transfer, gas laws, heat engines => ${F("calorimetry")}, ${F("thermal-physics")}`,
          ]],
          ["Electricity", [
            `Static electricity | Coulomb's law, capacitors => ${F("electrostatics-and-capacitors")}`,
            `Direct current | circuits, Ohm's law => ${F("current-electricity")}`,
          ]],
        ],
        mock: { minutes: 35, groups: [group(5, "choice", 1, 1, 0, 5), group(5, "choice", 2, 1, 0, 5), group(2, "choice", 3, 1, 0, 5)], scale: [0, 100, 0.01] },
      },
      KEM: {
        units: [
          ["Basic chemistry", [
            `Atomic structure and periodic table | electron configuration, periodic trends => ${K("atomic-structure")}, ${K("periodic-table-and-periodic-properties")}`,
            `Chemical bonding | ionic, covalent, molecular shape => ${K("chemical-bonding")}`,
            `Stoichiometry | mole, masses from equations => ${K("mole-concept")}, ${K("stoichiometry")}`,
          ], 30],
          ["Physical chemistry", [
            `Thermochemistry | enthalpy, Hess's law => ${K("thermochemistry")}`,
            `Reaction rate and equilibrium | rate, equilibrium constant => ${K("chemical-kinetics")}, ${K("chemical-equilibrium")}`,
            `Acids, bases and solutions | pH, concentration => ${K("acids-bases-and-ph")}, ${K("solutions-and-concentration")}`,
            `Redox and electrochemistry | cells, electrolysis => ${K("electrochemistry")}`,
          ], 40],
          ["Organic chemistry", [
            `Carbon compounds | naming, functional groups, reactions => ${K("organic-chemistry-nomenclature-and-isomerism")}, ${K("organic-chemistry-reactions")}`,
          ], 20],
          ["Chemistry in context", [
            `Environment | air and water pollution, greenhouse effect, acid rain, ozone depletion => ${K("environmental-chemistry")}`,
            `Chemical industry | making basic chemicals, reaction conditions and yield => ${K("industrial-chemistry")}`,
          ], 10],
        ],
        mock: { minutes: 35, groups: [group(5, "choice", 1, 1, 0, 5), group(5, "choice", 2, 1, 0, 5), group(2, "choice", 3, 1, 0, 5)], scale: [0, 100, 0.01] },
      },
      BIO: {
        units: [
          ["Biodiversity and environment", [
            `Biodiversity | classification of living things => ${Bi("diversity-of-living-organisms")}`,
            `Ecology and environment | ecosystems, energy flow => ${Bi("ecology-and-environment")}`,
          ]],
          ["Cells and metabolism", [
            `Cells and biomolecules | organelles, enzymes => ${Bi("cell-structure-and-biomolecules")}`,
            `Plant metabolism | photosynthesis, respiration, transport => ${Bi("plant-physiology")}`,
          ]],
          ["Life processes and health", [
            `Human organ systems | digestion, circulation, breathing, excretion, coordination => ${Bi("human-physiology")}`,
            `Health and disease | immunity, pathogens => ${Bi("human-health-and-disease")}`,
          ]],
        ],
        mock: { minutes: 35, groups: [group(5, "choice", 1, 1, 0, 5), group(5, "choice", 2, 1, 0, 5), group(2, "choice", 3, 1, 0, 5)], scale: [0, 100, 0.01] },
      },
    },
  },

  // ------------------------------------------------------------ Malezija
  // Vir: Lembaga Peperiksaan, »Format Pentaksiran SPM mulai 2021« Matematik (1449) in Matematik Tambahan (3472)
  //      (knjižici prek https://www.komunitasbelajar.id/2020/12/buku-format-pentaksiran-spm-mulai-2021.html),
  //      https://app.pandai.org/spm/read/ph-spmprep-k1-s1, https://app.pandai.org/spm/read/bg-spmprep-k1-s1
  // 1449/1: 40 MCQ, 40 t., 1 h 30 min; 1449/2: A 10 (40 t.), B 5 (45 t.), C 1 od 2 (15 t.), 2 h 30 min; težavnost 5:3:2.
  // 4531/4541/4551 kertas 1: 40 MCQ, 1 h 15 min; kertas 2 strukturirana vprašanja (2 h 30 min), kertas 3 praktični.
  // Vrzeli: številski sistemi (number bases), grafi (omrežja), linearne neenačbe v dveh spremenljivkah
  // (banka: linearno programiranje – nad programom), variacija, potence in standardna oblika (snov 3. razreda);
  // pri kemiji hitrost reakcije (banka: red reakcije, razpolovni čas – nad SPM) in industrijska kemija
  // (KSSM: zlitine, steklo, keramika, kompoziti; banka: Haber/Contact – se ne ujema).
  SPM: {
    name: "SPM",
    full: "SPM (Sijil Pelajaran Malaysia)",
    country: "Malaysia",
    systems: ["MY"],
    board: true,
    forLevel: [6, 11],
    about:
      "The SPM is taken at the end of Form 5; maths and science papers are printed in Malay and English. Mathematics (1449) has Paper 1 with 40 four-option multiple-choice questions (1 h 30 min, 40 marks) and Paper 2 with structured questions in sections A, B and C (2 h 30 min, 100 marks). Physics, Chemistry and Biology each have Paper 1 with 40 multiple-choice questions (1 h 15 min), a structured and essay Paper 2 and a practical Paper 3. Grades run from A+ to G. The mock covers Paper 1-style questions; the grade is an estimate, because grade boundaries are set each year.",
    subjects: {
      MAT: {
        units: [
          ["Algebra", [
            `Quadratic functions and equations | roots, factorising => ${M("quadratic-equations")}`,
            `Linear equations | simultaneous linear equations => ${M("systems-of-linear-equations")}`,
            `Matrices | operations, inverse matrix, solving equations => ${M("matrices-and-determinants")}`,
            `Operations on sets and logical reasoning | Venn diagrams, statements, implications, arguments => ${M("sets-and-logic")}`,
          ]],
          ["Geometry and trigonometry", [
            `Straight lines | gradient, intercepts, equation of a line => ${M("coordinate-geometry")}`,
            `Circles | angles, arcs and sectors => ${M("circles")}`,
            `Pythagoras' theorem and similarity | similar figures, enlargement => ${M("similar-triangles")}`,
            `Trigonometry | trigonometric ratios, graphs of sine, cosine and tangent => ${M("right-triangle-trigonometry")}, ${M("trigonometric-identities")}`,
            `Solid geometry | surface area and volume => ${M("surface-areas-and-volumes")}`,
          ]],
          ["Statistics, probability and consumer mathematics", [
            `Measures of central tendency | mean, median, mode => ${M("statistics-mean-median")}, ${M("statistics-of-grouped-data")}`,
            `Measures of dispersion | range, interquartile range, variance, standard deviation, ungrouped and grouped data => ${M("measures-of-dispersion")}`,
            `Probability of combined events | dependent and independent events => ${M("probability")}`,
            `Consumer mathematics | savings, investment, credit, taxation => ${M("ratios-rates-and-percentages")}, ${M("exponential-growth-and-decay")}`,
          ]],
        ],
        mock: { minutes: 45, groups: [group(10, "choice", 1, 1), group(6, "choice", 2, 1), group(4, "choice", 3, 1)], grades: GRADES_SPM },
      },
      FIZ: {
        units: [
          ["Force and motion", [
            `Linear motion | motion graphs, equations of motion, free fall => ${F("kinematics")}`,
            `Force, momentum and impulse | Newton's laws, conservation of momentum => ${F("laws-of-motion")}, ${F("momentum-and-collisions")}`,
            `Gravitation | Newton's law of gravitation, satellites => ${F("circular-motion-and-gravitation")}`,
            `Elasticity | Hooke's law, spring constant, elastic potential energy => ${F("elasticity")}`,
            `Pressure | liquid and atmospheric pressure, Pascal's, Archimedes' and Bernoulli's principles => ${F("density-and-pressure")}, ${F("fluids-and-buoyancy")}`,
          ]],
          ["Heat, waves and light", [
            `Heat | specific heat capacity, latent heat, gas laws => ${F("calorimetry")}, ${F("thermal-physics")}`,
            `Waves | wave speed, interference, sound => ${F("waves-and-sound")}`,
            `Light and optics | refraction, total internal reflection, lenses, mirrors => ${F("optics")}, ${F("spherical-mirrors")}`,
          ]],
          ["Electricity and electromagnetism", [
            `Electricity | resistance, e.m.f. and internal resistance, electrical power => ${F("current-electricity")}, ${F("electric-power-and-household-circuits")}`,
            `Electromagnetism | force on a conductor, induction, transformers => ${F("magnetism-and-induction")}`,
            `Electronics | semiconductor diodes, rectification, transistors => ${F("semiconductors-and-logic-gates")}`,
          ]],
          ["Nuclear and quantum physics", [
            `Nuclear and quantum physics | radioactive decay, half-life, photoelectric effect => ${F("modern-physics")}`,
          ]],
        ],
        mock: { minutes: 40, groups: [group(10, "choice", 1, 1), group(6, "choice", 2, 1), group(4, "choice", 3, 1)], grades: GRADES_SPM },
      },
      KEM: {
        units: [
          ["Matter, moles and bonding", [
            `Atomic structure | subatomic particles, isotopes, electron arrangement => ${K("atomic-structure")}`,
            `Mole concept, formulae and equations | molar mass, empirical formula => ${K("mole-concept")}, ${K("stoichiometry")}`,
            `Periodic table | groups and periods, trends => ${K("periodic-table-and-periodic-properties")}`,
            `Chemical bonds | ionic and covalent bonds => ${K("chemical-bonding")}`,
          ]],
          ["Acids and salts", [
            `Acids, bases and salts | pH, concentration, neutralisation => ${K("acids-bases-and-ph")}, ${K("solutions-and-concentration")}`,
            `Qualitative analysis of salts | tests for ions and gases => ${K("identification-of-ions-and-gases")}`,
          ]],
          ["Redox, carbon compounds and thermochemistry", [
            `Redox equilibrium | oxidation numbers, electrochemical cells, electrolysis => ${K("chemical-reactions-and-equations")}, ${K("electrochemistry")}`,
            `Carbon compounds | homologous series, reactions => ${K("organic-chemistry-nomenclature-and-isomerism")}, ${K("organic-chemistry-reactions")}`,
            `Polymers | natural and synthetic polymers, natural rubber => ${K("polymers")}`,
            `Thermochemistry | heat of reaction, energy profiles => ${K("thermochemistry")}`,
          ]],
        ],
        mock: { minutes: 40, groups: [group(10, "choice", 1, 1), group(6, "choice", 2, 1), group(4, "choice", 3, 1)], grades: GRADES_SPM },
      },
      BIO: {
        units: [
          ["Cells", [
            `Cell biology and organisation | organelles, chemical composition, enzymes => ${Bi("cell-structure-and-biomolecules")}`,
            `Cell division | mitosis, meiosis => ${Bi("cell-cycle-and-cell-division")}`,
          ]],
          ["Human and animal physiology", [
            `Physiology of humans and animals | respiration, nutrition, transport, coordination, homeostasis => ${Bi("human-physiology")}`,
            `Immunity | body defence, vaccines => ${Bi("human-health-and-disease")}`,
            `Reproduction | gametogenesis, menstrual cycle, flowering plants => ${Bi("reproduction")}`,
          ]],
          ["Plant physiology", [
            `Plants | photosynthesis, transport, plant responses => ${Bi("plant-physiology")}`,
          ]],
          ["Ecosystems, inheritance and technology", [
            `Biodiversity and ecosystems | classification, energy flow => ${Bi("diversity-of-living-organisms")}, ${Bi("ecology-and-environment")}`,
            `Inheritance | monohybrid and dihybrid crosses, sex-linked inheritance => ${Bi("genetics-and-inheritance")}`,
            `Genetic technology | genetic engineering, biotechnology => ${Bi("biotechnology")}`,
          ]],
        ],
        mock: { minutes: 40, groups: [group(10, "choice", 1, 1), group(6, "choice", 2, 1), group(4, "choice", 3, 1)], grades: GRADES_SPM },
      },
    },
  },
  // Vir: Lembaga Peperiksaan, »Format Pentaksiran Matematik Tambahan SPM mulai 2021« (3472).
  // 3472/1: 2 h, 80 t. (A 12 vprašanj, 64 t.; B 2 od 3, 16 t.); 3472/2: 2 h 30 min, 100 t.
  // (A 7, 50 t.; B 3 od 4, 30 t.; C 2 od 4, 20 t.); vse odprta vprašanja; težavnost 5:3:2.
  // Vrzeli: linearni zakon, reševanje trikotnikov (sinusni/kosinusni izrek), indeksi (index numbers),
  // kinematika premega gibanja (z odvodi; banka: enakomerno pospešeno gibanje – se ne ujema).
  SPMAM: {
    name: "SPM Additional Mathematics",
    full: "SPM Additional Mathematics (Matematik Tambahan 3472)",
    country: "Malaysia",
    systems: ["MY"],
    board: true,
    forLevel: [10, 11],
    about:
      "SPM Additional Mathematics has two written papers in Malay and English: Paper 1 (2 hours, 80 marks; section A has 12 compulsory questions, section B two of three questions) and Paper 2 (2 h 30 min, 100 marks; sections A, B and C). All questions are open-response with working, at a 5:3:2 ratio of easy, medium and hard. The mock covers short Paper 1-style questions; the grade (A+ to G) is an estimate.",
    subjects: {
      MAT: {
        units: [
          ["Algebra", [
            `Functions | composite and inverse functions => ${M("functions")}`,
            `Quadratic functions | roots, discriminant, quadratic inequalities => ${M("quadratic-equations")}, ${M("quadratic-inequalities")}`,
            `Systems of equations | linear and non-linear simultaneous equations => ${M("systems-of-linear-equations")}`,
            `Indices, surds and logarithms | laws of indices, surds, laws of logarithms, equations => ${M("indices-and-surds")}, ${M("logarithms")}`,
            `Progressions | arithmetic and geometric progressions => ${M("arithmetic-progressions")}, ${M("geometric-progressions")}`,
          ], 30],
          ["Geometry and trigonometry", [
            `Coordinate geometry | divisor of a line segment, equation of a line, loci => ${M("coordinate-geometry")}`,
            `Vectors | addition, resolution, vectors in the Cartesian plane => ${M("vectors")}`,
            `Circular measure | radians, arc length, area of sector => ${M("circles")}`,
            `Trigonometric functions | identities, double-angle formulae => ${M("trigonometric-identities")}`,
          ], 25],
          ["Calculus", [
            `Differentiation | gradients, tangents, maxima and minima => ${M("differentiation")}`,
            `Integration | definite integrals, areas => ${M("integration")}`,
          ], 25],
          ["Statistics and linear programming", [
            `Permutations and combinations | arrangements, selections => ${M("permutations-and-combinations")}`,
            `Probability distribution | binomial distribution => ${M("binomial-distribution")}`,
            `Normal distribution | standard normal, z-scores, probabilities => ${M("normal-distribution")}`,
            `Linear programming | regions, optimal values => ${M("linear-programming")}`,
          ], 20],
        ],
        mock: { minutes: 50, groups: [group(5, "numeric", 1, 2), group(4, "numeric", 2, 3), group(3, "numeric", 3, 4)], grades: GRADES_SPM },
      },
    },
  },

  // ------------------------------------------------------------ Kitajska (中考)
  // Vir: https://m.voc.com.cn/rmt/article/15405205.html, https://m.voc.com.cn/rmt/article/15413135.html (Hunan 2026),
  //      https://www.gz.gov.cn/zwfw/zxfw/jyfw7/content/mpost_10582314.html (Guangzhou)
  // Format določa vsaka provinca/mesto; tu je tipičen pokrajinski izpit (npr. Hunan 2026: matematika
  // 120 t./120 min: 10 izbirnih × 3, 6 dopolnjevanj × 3, 8 nalog = 72 t.; fizika in kemija 100 t./60 min).
  // Vrzeli: razstavljanje, hitrost, optika in zvok, elektromagnetizem (kvalitativno), delo in energija
  // (banka: Ek, delo pod kotom – nad programom), funkcije (obratna sorazmernost, kvadratna funkcija),
  // računanje po enačbah brez mola, masni delež raztopine; biologija ni dodana (v večini provinc je
  // ločen izpit 生物 že v 8. razredu, format se zelo razlikuje).
  ZHONGKAO: {
    name: "Zhongkao",
    full: "中考 Zhongkao (senior high school entrance exam)",
    country: "China",
    systems: ["CN"],
    board: true,
    forLevel: [6, 9],
    about:
      "The zhongkao after Grade 9 is set by each province or city, so formats differ; this follows a typical provincial paper, in Chinese. Mathematics is usually 120 minutes and 120 points, e.g. 10 single-choice questions (3 points), 6 fill-in-the-blank questions (3 points) and 8 worked problems. Physics and chemistry are often 60-minute papers (100 points each in Hunan) with choice, fill-in, experiment and calculation questions; some provinces combine them in one science paper. The mock covers choice and fill-in questions; check your province's current specification.",
    subjects: {
      MAT: {
        units: [
          ["Numbers and equations", [
            `Real numbers and quadratic radicals | square roots, simplifying radicals, rationalising denominators => ${M("indices-and-surds")}`,
            `Systems of linear equations | elimination, word problems => ${M("systems-of-linear-equations")}`,
            `Quadratic equations in one variable | factorising, formula, discriminant => ${M("quadratic-equations")}`,
            `Inequalities | linear inequalities and their systems => ${M("quadratic-inequalities")}`,
          ], 30],
          ["Functions", [
            `Linear functions | slope, equation of a line, intersections => ${M("coordinate-geometry")}`,
          ], 20],
          ["Geometry", [
            `Similar triangles and Pythagoras | similarity, proportional segments => ${M("similar-triangles")}`,
            `Circles | arc length, sector area => ${M("circles")}`,
            `Properties of circles | inscribed angles, cyclic quadrilaterals, tangents => ${M("circle-theorems")}`,
            `Solving right triangles | trigonometric ratios, angles of elevation => ${M("right-triangle-trigonometry")}`,
          ], 30],
          ["Statistics and probability", [
            `Statistics | mean, median, mode => ${M("statistics-mean-median")}`,
            `Variance | range, variance as a measure of spread => ${M("measures-of-dispersion")}`,
            `Probability | lists and tree diagrams => ${M("probability")}`,
          ], 20],
        ],
        mock: { minutes: 45, groups: [group(5, "choice", 1, 3), group(5, "choice", 2, 3), group(3, "numeric", 2, 3), group(3, "numeric", 3, 3)] },
      },
      FIZ: {
        units: [
          ["Mechanics", [
            `Density | mass, volume, density => ${F("density-and-pressure")}`,
            `Pressure | pressure of solids and liquids, atmospheric pressure, connected vessels => ${F("density-and-pressure")}`,
            `Buoyancy | Archimedes' principle, floating and sinking => ${F("fluids-and-buoyancy")}`,
            `Simple machines | levers, pulleys, mechanical efficiency => ${F("machines")}`,
            `Levers and balance | moments, principle of the lever => ${F("moments-and-equilibrium")}`,
          ]],
          ["Heat", [
            `Heat | specific heat capacity, heat from fuels, efficiency => ${F("calorimetry")}`,
          ]],
          ["Electricity", [
            `Circuits and Ohm's law | series and parallel circuits => ${F("current-electricity")}`,
            `Electric power | power, electrical energy, household circuits => ${F("electric-power-and-household-circuits")}`,
          ]],
        ],
        mock: { minutes: 35, groups: [group(6, "choice", 1, 3), group(4, "choice", 2, 3), group(3, "numeric", 2, 4), group(2, "numeric", 3, 5)] },
      },
      KEM: {
        units: [
          ["Matter and its composition", [
            `Atoms and elements | atomic structure, the periodic table => ${K("atomic-structure")}, ${K("periodic-table-and-periodic-properties")}`,
            `Chemical equations | balancing, types of reactions => ${K("chemical-reactions-and-equations")}`,
          ]],
          ["Substances and their properties", [
            `Metals | activity series, displacement => ${K("metals-and-non-metals")}`,
            `Acids, bases and salts | pH, neutralisation => ${K("acids-bases-and-ph")}`,
            `Identifying substances | tests for gases and ions => ${K("identification-of-ions-and-gases")}`,
          ]],
        ],
        mock: { minutes: 30, groups: [group(8, "choice", 1, 3), group(5, "choice", 2, 3), group(2, "numeric", 2, 5)] },
      },
    },
  },

  // ------------------------------------------------------------ Južna Koreja (수능)
  // Vir: https://mobile.newsis.com/view/NISX20260331_0003570832 (KICE, načrt za 2027학년도),
  //      https://www.fnnews.com/news/202603311100309651, https://www.etoday.co.kr/news/view/2390974
  // Matematika: 30 vprašanj, 100 min, 100 t. (2, 3, 4 t.), 30 % kratkih odgovorov (cela števila), ostalo 5 možnosti;
  // znanstveni predmeti: 20 vprašanj, 30 min, 50 t. (2 in 3 t.). Od 2028 nov format (통합과학 25 vprašanj, 40 min).
  // Vrzeli: statistično ocenjevanje (intervali zaupanja), izbirni predmet »Calculus« (odvodi/integrali
  // transcendentnih funkcij, vrste), prostorske koordinate (banka: ravnine – niso v programu), posebna
  // relativnost, ravnotežje pri kemiji I (kvalitativno).
  CSAT: {
    name: "CSAT (수능)",
    full: "대학수학능력시험 CSAT (Suneung, College Scholastic Ability Test)",
    country: "South Korea",
    systems: ["KR"],
    forLevel: [10, 12],
    about:
      "The CSAT (Suneung), in Korean, is held each November. Mathematics is a 100-minute, 100-point paper of 30 questions: common subjects Mathematics I and II plus one elective (Probability and Statistics, Calculus or Geometry); 70% are five-option multiple choice and 30% short answers (a whole number), worth 2, 3 or 4 points. Each science inquiry subject (Physics I, Chemistry I, Life Science I and the II subjects) has 20 five-option questions in 30 minutes, worth 50 points. Results are standard scores, percentiles and nine grades. The mock follows these formats; the format changes from the 2028 CSAT, so check the latest KICE plan.",
    subjects: {
      MAT: {
        units: [
          ["Mathematics I", [
            `Exponential and logarithmic functions | log laws, graphs, equations => ${M("logarithms")}, ${M("exponential-growth-and-decay")}`,
            `Trigonometric functions | graphs, sine and cosine rules => ${M("trigonometric-identities")}`,
            `Sequences | arithmetic and geometric sequences, sums => ${M("arithmetic-progressions")}, ${M("geometric-progressions")}`,
          ], 35],
          ["Mathematics II", [
            `Limits and continuity of functions | limits, continuity => ${M("limits-and-continuity")}`,
            `Differentiation of polynomial functions | tangents, extrema => ${M("differentiation")}`,
            `Integration of polynomial functions | definite integrals, area => ${M("integration")}`,
          ], 35],
          ["Elective: Probability and Statistics", [
            `Permutations and combinations | arrangements, selections => ${M("permutations-and-combinations")}`,
            `Probability | conditional probability, independence => ${M("probability")}, ${M("conditional-probability-and-bayes-theorem")}`,
            `Random variables | binomial distribution => ${M("binomial-distribution")}`,
            `Normal distribution | standardisation, standard normal table => ${M("normal-distribution")}`,
          ], 15],
          ["Elective: Geometry", [
            `Conic sections | parabola, ellipse, hyperbola, foci, tangent lines => ${M("conic-sections")}`,
            `Plane vectors | dot product, magnitude => ${M("vectors")}`,
          ], 15],
        ],
        mock: { minutes: 50, groups: [group(3, "choice", 1, 2, 0, 5), group(5, "choice", 2, 3, 0, 5), group(2, "choice", 3, 4, 0, 5), group(2, "numeric", 2, 3), group(3, "numeric", 3, 4)] },
      },
      FIZ: {
        units: [
          ["Mechanics and energy", [
            `Motion and Newton's laws | kinematics, forces => ${F("kinematics")}, ${F("laws-of-motion")}`,
            `Momentum and impulse | collisions => ${F("momentum-and-collisions")}`,
            `Work and energy | conservation of mechanical energy => ${F("work-energy-and-power")}`,
            `Thermodynamics | first law, heat engines => ${F("thermal-physics")}`,
          ]],
          ["Matter and electromagnetism", [
            `Electric force | Coulomb's law => ${F("electrostatics-and-capacitors")}`,
            `Semiconductors | energy bands, diodes => ${F("semiconductors-and-logic-gates")}`,
            `Magnetic fields and induction | fields of currents, electromagnetic induction => ${F("magnetism-and-induction")}`,
          ]],
          ["Waves and information", [
            `Waves | wave properties, interference => ${F("waves-and-sound")}`,
            `Refraction and total internal reflection | optical fibres => ${F("optics")}`,
            `Light and matter | photoelectric effect, mass–energy, wave–particle duality => ${F("modern-physics")}`,
          ]],
        ],
        mock: { minutes: 30, groups: [group(6, "choice", 1, 2, 0, 5), group(4, "choice", 2, 2, 0, 5), group(6, "choice", 2, 3, 0, 5), group(4, "choice", 3, 3, 0, 5)] },
      },
      KEM: {
        units: [
          ["Chemistry and quantity", [
            `Mole and reaction quantities | moles, masses from equations => ${K("mole-concept")}, ${K("stoichiometry")}`,
            `Solution concentration | molarity => ${K("solutions-and-concentration")}`,
          ]],
          ["Atoms and the periodic table", [
            `Atomic structure | electron configuration => ${K("atomic-structure")}`,
            `Periodic properties | radius, ionisation energy, electronegativity => ${K("periodic-table-and-periodic-properties")}`,
          ]],
          ["Bonding and reactions", [
            `Chemical bonding and molecular shape | Lewis structures, polarity => ${K("chemical-bonding")}`,
            `Acids, bases and neutralisation | pH, neutralisation => ${K("acids-bases-and-ph")}`,
            `Redox reactions | oxidation numbers => ${K("chemical-reactions-and-equations")}`,
          ]],
        ],
        mock: { minutes: 30, groups: [group(6, "choice", 1, 2, 0, 5), group(4, "choice", 2, 2, 0, 5), group(6, "choice", 2, 3, 0, 5), group(4, "choice", 3, 3, 0, 5)] },
      },
      BIO: {
        units: [
          ["Cells and energy", [
            `Cells and biomolecules | cell structure, metabolism => ${Bi("cell-structure-and-biomolecules")}`,
            `Energy in the body | digestion, respiration, circulation, excretion => ${Bi("human-physiology")}`,
          ]],
          ["Homeostasis and immunity", [
            `Immunity and disease | pathogens, immune response => ${Bi("human-health-and-disease")}`,
          ]],
          ["Genetics", [
            `Cell division | chromosomes, mitosis, meiosis => ${Bi("cell-cycle-and-cell-division")}`,
            `Inheritance | pedigrees, sex-linked traits, genetic disorders => ${Bi("genetics-and-inheritance")}`,
          ]],
          ["Ecology", [
            `Ecosystems | populations, communities, energy flow => ${Bi("ecology-and-environment")}`,
          ]],
        ],
        mock: { minutes: 30, groups: [group(6, "choice", 1, 2, 0, 5), group(4, "choice", 2, 2, 0, 5), group(6, "choice", 2, 3, 0, 5), group(4, "choice", 3, 3, 0, 5)] },
      },
    },
  },

  // ------------------------------------------------------------ Japonska (共通テスト)
  // Vir: 大学入試センター, 令和8年度 実施要項 in 出題方法等 (https://www.dnc.ac.jp/kyotsu/),
  //      https://www.shinko-keirin.co.jp/keirinkan/kou/kou_wp/wp-content/uploads/2026/04/2026大学入試分析_数学.pdf
  // 数学① (I·A) 70 min/100 t., vsa vprašanja obvezna (数と式・図形と計量, 二次関数・データ, 図形の性質, 場合の数と確率);
  // 数学② (II·B·C) 70 min/100 t.: 1.–3. obvezna, 3 izmed 4.–7. (数列, 統計的な推測, ベクトル, 複素数平面と平面上の曲線);
  // 物理/化学/生物 60 min/100 t.; odgovori na listu z oznakami (izbira ali vpis števk).
  // Vrzeli: statistično ocenjevanje in preizkus domnev (intervali), razvoj in odzivi rastlin (podrobno).
  JCT: {
    name: "Common Test (共通テスト)",
    full: "大学入学共通テスト (Common Test for University Admissions, Japan)",
    country: "Japan",
    systems: ["JP"],
    forLevel: [10, 12],
    about:
      "The Common Test is held each January in Japanese, with all answers marked on a mark sheet: either a choice or a number entered digit by digit. 数学I·A and 数学II·B·C are 70-minute, 100-point papers; in I·A every question is compulsory, in II·B·C questions 1–3 are compulsory and three of questions 4–7 (sequences, statistical inference, vectors, complex plane and plane curves) are chosen. 物理, 化学 and 生物 are 60-minute, 100-point papers. The mock uses digit-entry answers in maths and mostly choice questions in science; check the latest 大学入試センター guidance. International students may take the EJU instead.",
    subjects: {
      MAT: {
        units: [
          ["数学I", [
            `Numbers, expressions and inequalities | linear inequalities, absolute values => ${M("quadratic-inequalities")}`,
            `Figures and measurement | trigonometric ratios, sine and cosine rules => ${M("right-triangle-trigonometry")}`,
            `Quadratic functions | vertex, maximum and minimum, roots => ${M("quadratic-equations")}, ${M("functions")}`,
            `Data analysis | mean, median, variance, standard deviation, correlation coefficient => ${M("statistics-mean-median")}, ${M("measures-of-dispersion")}, ${M("correlation-and-regression")}`,
          ], 25],
          ["数学A", [
            `Properties of figures | similar triangles, inscribed angles, power of a point, tangents => ${M("similar-triangles")}, ${M("circle-theorems")}`,
            `Combinatorics and probability | counting, conditional probability => ${M("permutations-and-combinations")}, ${M("probability")}, ${M("conditional-probability-and-bayes-theorem")}`,
          ], 20],
          ["数学II", [
            `Complex numbers and equations | remainder theorem, complex roots => ${M("polynomials")}, ${M("complex-numbers")}`,
            `Figures and equations | lines and circles => ${M("coordinate-geometry")}`,
            `Exponential and logarithmic functions | log laws, equations => ${M("logarithms")}`,
            `Trigonometric functions | addition formulas, double angle => ${M("trigonometric-identities")}`,
            `Differential and integral calculus | tangents, extrema, areas => ${M("differentiation")}, ${M("integration")}`,
          ], 30],
          ["数学B・C (choose three)", [
            `Sequences | arithmetic and geometric sequences, sums => ${M("arithmetic-progressions")}, ${M("geometric-progressions")}`,
            `Statistical inference | binomial and normal distributions => ${M("binomial-distribution")}, ${M("normal-distribution")}`,
            `Vectors | plane and space vectors => ${M("vectors")}`,
            `Plane curves and the complex plane | parabola, ellipse, hyperbola, polar form, De Moivre's theorem => ${M("conic-sections")}, ${M("complex-numbers")}`,
          ], 25],
        ],
        mock: { minutes: 50, groups: [group(5, "numeric", 1, 3), group(6, "numeric", 2, 4), group(4, "numeric", 3, 5)] },
      },
      FIZ: {
        units: [
          ["Mechanics", [
            `Projectile motion | launch at an angle => ${F("projectile-motion")}`,
            `Rigid bodies | moments, equilibrium => ${F("moments-and-equilibrium")}`,
            `Momentum | conservation, coefficient of restitution => ${F("momentum-and-collisions")}`,
            `Circular motion and gravitation | centripetal force, universal gravitation => ${F("circular-motion-and-gravitation")}`,
            `Simple harmonic motion | spring, pendulum => ${F("oscillations")}`,
          ]],
          ["Heat and waves", [
            `Gases and thermodynamics | kinetic theory, first law => ${F("thermal-physics")}`,
            `Waves and sound | standing waves, Doppler effect => ${F("waves-and-sound")}`,
            `Light | refraction, lenses => ${F("optics")}`,
            `Interference and diffraction of light | Young's experiment, diffraction grating, thin films => ${F("wave-optics")}`,
          ]],
          ["Electricity and magnetism", [
            `Electric fields and capacitors | Coulomb's law, capacitors => ${F("electrostatics-and-capacitors")}`,
            `Direct-current circuits | Kirchhoff's laws => ${F("current-electricity")}`,
            `Electromagnetic induction | Lorentz force, Faraday's law => ${F("magnetism-and-induction")}`,
            `Alternating current | reactance, resonance => ${F("alternating-current")}`,
          ]],
          ["Atoms", [
            `Atoms and nuclei | photoelectric effect, de Broglie wavelength, half-life => ${F("modern-physics")}`,
          ]],
        ],
        mock: { minutes: 30, groups: [group(5, "choice", 1, 3), group(5, "choice", 2, 4), group(3, "numeric", 2, 4), group(2, "numeric", 3, 5)] },
      },
      KEM: {
        units: [
          ["Theoretical chemistry", [
            `States of matter and gases | ideal gas law, partial pressure => ${K("gaseous-state")}`,
            `Solutions | concentration, colligative properties => ${K("solutions-and-concentration")}, ${K("colligative-properties")}`,
            `Chemical reactions and energy | enthalpy, Hess's law => ${K("thermochemistry")}`,
            `Electrochemistry | batteries, electrolysis => ${K("electrochemistry")}`,
            `Reaction rate and equilibrium | rate law, equilibrium constant, pH => ${K("chemical-kinetics")}, ${K("chemical-equilibrium")}, ${K("acids-bases-and-ph")}`,
          ]],
          ["Inorganic chemistry", [
            `Elements and compounds | typical and transition elements => ${K("s-p-d-and-f-block-elements")}`,
            `Ion and gas tests | precipitates, separation of ions => ${K("identification-of-ions-and-gases")}`,
          ]],
          ["Organic chemistry", [
            `Organic compounds | structure, isomers, functional groups => ${K("organic-chemistry-nomenclature-and-isomerism")}`,
            `Organic reactions | aliphatic and aromatic compounds => ${K("organic-chemistry-reactions")}`,
            `Polymer compounds | synthetic and natural polymers, monomers => ${K("polymers")}`,
          ]],
        ],
        mock: { minutes: 30, groups: [group(5, "choice", 1, 3), group(5, "choice", 2, 4), group(3, "numeric", 2, 4), group(2, "numeric", 3, 5)] },
      },
      BIO: {
        units: [
          ["Cells, metabolism and genes", [
            `Cells and molecules | proteins, enzymes, membranes => ${Bi("cell-structure-and-biomolecules")}`,
            `Metabolism | respiration, photosynthesis => ${Bi("plant-physiology")}`,
            `Gene expression | replication, transcription, translation => ${Bi("molecular-basis-of-inheritance")}`,
            `Biotechnology | gene cloning, PCR => ${Bi("biotechnology")}`,
          ]],
          ["Development and responses", [
            `Reproduction and development | gametogenesis, fertilisation => ${Bi("reproduction")}`,
            `Animal responses | neurons, sense organs, muscles => ${Bi("human-physiology")}`,
            `Animal behaviour | innate and learned behaviour => ${Bi("animal-behaviour-and-tissues")}`,
          ]],
          ["Ecology and evolution", [
            `Ecology | populations, ecosystems => ${Bi("ecology-and-environment")}`,
            `Evolution | genetic recombination, Hardy–Weinberg principle => ${Bi("evolution")}, ${Bi("genetics-and-inheritance")}`,
            `Phylogeny and classification | domains, kingdoms => ${Bi("diversity-of-living-organisms")}`,
          ]],
        ],
        mock: { minutes: 30, groups: [group(6, "choice", 1, 3), group(6, "choice", 2, 4), group(3, "choice", 3, 5)] },
      },
    },
  },
};

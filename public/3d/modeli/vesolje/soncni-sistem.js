// Sončni sistem: Sonce, osem planetov, Luna in pritlikavi planet Pluton na Keplerjevih tirnicah (pogodba v docs/3d.md).
//
// Data (verified 2026-11 against these sources):
// - Orbits: JPL »Approximate Positions of the Planets« (E. M. Standish), table 1 (1800–2050), J2000 ecliptic elements
//   a [au], e, i [°], L [°], ϖ [°], Ω [°]; Earth = Earth–Moon barycentre. Mean motion from the sidereal period.
//   Checked: oppositions Mars 16. 1. 2025, Jupiter 10. 1. 2026, Saturn 21. 9. 2025, Uranus 21. 11. 2025 within 0,5°,
//   Earth perihelion 3. 1. 2026 = 147,10 mio km, aphelion 6. 7. 2026 = 152,10 mio km.
// - Sidereal orbital periods, equatorial radii, rotation periods, obliquities: NASA GSFC Planetary Fact Sheets
//   (Williams): P [d] 87,969 / 224,701 / 365,256 / 686,980 / 4332,589 / 10759,22 / 30685,4 / 60189 / 90560;
//   R [km] Sonce 695700, 2440,5 / 6051,8 / 6378,1 / 3396,2 / 71492 / 60268 / 25559 / 24764 / 1188, Luna 1738,1;
//   rotation [h] 1407,6 / −5832,5 / 23,9345 / 24,6229 / 9,925 / 10,656 / −17,24 / 16,11 / −153,29, Luna 655,72,
//   Sonce 25,38 d; obliquity [°] 0,034 / 177,36 / 23,44 / 25,19 / 3,13 / 26,73 / 97,77 / 28,32 / ~120.
// - Pole directions and prime meridians: IAU WGCCRE report 2015 (Archinal et al. 2018), α0, δ0, W = W0 + Ẇ·d.
//   Checked: the angle between each pole and its orbit normal reproduces the fact-sheet obliquities (Venus 177,4°,
//   Uranus 97,8°, Sun 7,25° to the ecliptic). Mars uses the 2009 pole (317,681°, 52,887°), Neptune its 2026 value.
// - Moon: mean elements after P. Schlyter »How to compute planetary positions« (a = 384400 km, e = 0,0549,
//   i = 5,145°, regressing node 18,6 let); checked: new moon 9. 11. 2026, full moon 24. 11. 2026.
// - Saturn's rings (NASA Saturn fact sheet, km from centre): D 66900, C 74658–92000, B 92000–117580,
//   Cassini 117580–122170, A 122170–136775 (Encke gap 133589), F 140180.
//   Gaps: Maxwell 87491, Huygens 117680, Encke 133589, Keeler 136505.
// Textures are drawn in code (canvas); the Earth's coastlines come from Natural Earth 1:50m (public domain).

export const info = {
  id: "soncni-sistem",
  naslov: "Sončni sistem",
  podrocje: "vesolje",
  predmet: "FIZ",
  opis: "Sonce, osem planetov, Luna in pritlikavi planet Pluton krožijo po pravih eliptičnih tirnicah, začenši z današnjim datumom. Primerjaj velikosti in razdalje v treh merilih.",
  merilo: { m: 1.495978707e13, oznaka: "100 a. e. ≈ 15 milijard km" },
};

const D = Math.PI / 180;
const AU_KM = 149597870.7;
const EPS = 23.43928 * D;
const J2000 = Date.UTC(2000, 0, 1, 12);

// id, ime, a, e, i, L, ϖ, Ω, P [d], R [km], α0, δ0, W0, Ẇ [°/d], rotation [h], colour
const PLANETI = [
  ["merkur", "Merkur", 0.38709927, 0.20563593, 7.00497902, 252.2503235, 77.45779628, 48.33076593, 87.969, 2440.5, 281.0103, 61.4155, 329.5988, 6.1385108, 1407.6, "#a9a49c"],
  ["venera", "Venera", 0.72333566, 0.00677672, 3.39467605, 181.9790995, 131.60246718, 76.67984255, 224.701, 6051.8, 272.76, 67.16, 160.2, -1.4813688, -5832.5, "#e8cf9a"],
  ["zemlja", "Zemlja", 1.00000261, 0.01671123, -0.00001531, 100.46457166, 102.93768193, 0, 365.256, 6378.1, 0, 90, 190.147, 360.9856235, 23.9345, "#4f8fe0"],
  ["mars", "Mars", 1.52371034, 0.0933941, 1.84969142, -4.55343205, -23.94362959, 49.55953891, 686.98, 3396.2, 317.681, 52.887, 176.049863, 350.891982443, 24.6229, "#d2643a"],
  ["jupiter", "Jupiter", 5.202887, 0.04838624, 1.30439695, 34.39644051, 14.72847983, 100.47390909, 4332.589, 71492, 268.057, 64.495, 284.95, 870.536, 9.925, "#d9b48a"],
  ["saturn", "Saturn", 9.53667594, 0.05386179, 2.48599187, 49.95424423, 92.59887831, 113.66242448, 10759.22, 60268, 40.589, 83.537, 38.9, 810.7939024, 10.656, "#e6cf98"],
  ["uran", "Uran", 19.18916464, 0.04725744, 0.77263783, 313.23810451, 170.9542763, 74.01692503, 30685.4, 25559, 257.311, -15.175, 203.81, -501.1600928, -17.24, "#9fe0e6"],
  ["neptun", "Neptun", 30.06992276, 0.00859048, 1.77004347, -55.12002969, 44.96476227, 131.78422574, 60189, 24764, 299.5, 42.96, 253.18, 536.3128492, 16.11, "#4a74e8"],
  ["pluton", "Pluton", 39.48211675, 0.2488273, 17.14001206, 238.92903833, 224.06891629, 110.30393684, 90560, 1188.3, 132.993, -6.163, 302.695, 56.3625225, -153.29, "#d6b9a0"],
];
const SONCE_R = 695700, LUNA_R = 1738.1, LUNA_A = 384400;

const OPISI = {
  sonce: ["Sonce", "#ffc35a", "Sonce je naša zvezda: vroča krogla plina, ki s svetlobo in toploto oskrbuje vse planete. Vanj bi lahko spravili več kot milijon Zemelj."],
  merkur: "Merkur je najmanjši planet in Soncu najbližji; nima pravega ozračja, zato je poln kraterjev. Leto na njem traja le 88 dni, od enega sončnega vzhoda do drugega pa mine kar 176 dni.",
  venera: "Venera je skoraj tako velika kot Zemlja, a jo ovijajo gosti oblaki iz žveplove kisline. Pod njimi je okoli 465 °C, zato je najbolj vroč planet, vrti pa se v nasprotno smer kot Zemlja.",
  zemlja: "Zemlja je edini znani planet s tekočo vodo na površju in z življenjem. Njena os je nagnjena za 23,4°, zato imamo letne čase.",
  luna: ["Luna", "#c9c6bf", "Luna je Zemljin naravni satelit in jo obkroži v 27,3 dneva. Zemlji vedno kaže isto stran, ker se okoli svoje osi zavrti v enakem času. V prikazih Pregledno in Resnične velikosti je njena tirnica precej manjša, kot je v resnici."],
  mars: "Mars je rdeči planet; rdeč je zaradi železovih oksidov (rje) v prahu na površju. Na njem je Olympus Mons, največji ognjenik v Osončju, približno 2,5-krat višji od Mount Everesta.",
  jupiter: "Jupiter je največji planet, plinski velikan iz vodika in helija s pisanimi pasovi oblakov. Velika rdeča pega je vrtinčast vihar, večji od Zemlje, ki ga opazujemo že več kot 150 let.",
  saturn: "Saturn je plinski velikan z najlepšimi obroči. Njegova povprečna gostota je manjša od gostote vode, zato bi v dovolj veliki kadi plaval.",
  obroci: ["Saturnovi obroči", "#d8c49a", "Obroči so iz neštetih koščkov ledu in kamnin; premer glavnih obročev je okoli 270 000 km, debeli pa so večinoma manj kot kilometer. Temna vrzel med obročema A in B je Cassinijeva ločnica."],
  uran: "Uran je ledeni velikan, ki je zaradi metana v ozračju modrozelen. Njegova os je nagnjena za skoraj 98°, zato na poti okoli Sonca tako rekoč leži na boku.",
  neptun: "Neptun je najbolj oddaljen planet, temno modri ledeni velikan. Na njem pihajo najmočnejši vetrovi v Osončju, do 2100 km/h; temno pego je leta 1989 posnela sonda Voyager 2.",
  pluton: "Pluton je pritlikavi planet v Kuiperjevem pasu; od leta 2006 ga ne štejemo več med planete. Na njegovem površju je svetlo ledeno območje v obliki srca.",
  asteroidi: ["Asteroidni pas", "#a39a8c", "Med Marsom in Jupitrom kroži več milijonov skalnatih teles, asteroidov. Vsi skupaj imajo le okoli 3 % mase Lune; prikazanih je samo nekaj tisoč točk."],
  kuiper: ["Kuiperjev pas", "#8fa3c8", "Za Neptunom kroži pas ledenih teles, med katerimi so tudi pritlikavi planeti, kot je Pluton. Iz njega prihaja del kometov."],
};

// Scales. Pregledno and Resnične velikosti compress the distance logarithmically (direction kept).
const NACINI = ["pregledno", "velikosti", "razdalje"];
const RAZDALJA = {
  pregledno: (r) => 0.1 + 0.1724 * Math.log(r / 0.3),
  velikosti: (r) => 0.27 + 0.1391 * Math.log(r / 0.3),
  razdalje: (r) => r / 50,
};
const VELIKOST = {
  pregledno: (R) => (R === SONCE_R ? 0.065 : 0.012 * Math.pow(R / 6378.1, 0.38)),
  velikosti: (R) => R / 3e6,
  razdalje: (R) => R / (50 * AU_KM),
};
const LUNA_RAZ = { pregledno: 0.03, velikosti: 0.0075, razdalje: LUNA_A / (50 * AU_KM) };
const MERILA = {
  pregledno: null,
  velikosti: { m: 6e9, oznaka: "6 milijonov km (le velikosti teles)" },
  razdalje: info.merilo,
};
const V_MERILU = {
  pregledno: "nič: razdalje so stisnjene, telesa močno povečana",
  velikosti: "velikosti teles; razdalje so stisnjene",
  razdalje: "razdalje; telesa so premajhna, zato jih kažejo pike",
};
const HITROSTI = [
  [1, "1 dan", "10 dni"],
  [7, "1 teden", "10 tednov"],
  [30.436875, "1 mesec", "10 mesecev"],
  [365.25, "1 leto", "10 let"],
  [3652.5, "10 let", "100 let"],
];

// ---------------------------------------------------------------- coastlines
// Natural Earth 1:50m (1 : 50 million) land and lakes, v4.1.0 (public domain, naturalearthdata.com), simplified (Douglas–Peucker 0,18°),
// islands ≥ 0,2 deg²; the Caspian Sea and lakes ≥ 0,7 deg² are water rings ("!"). Same string in all four builders.
// Each ring: zigzag varint deltas (base 64 "A–Za–z0–9+/", digits A…f end a number, g…/ continue it) of
// x = (lon + 180)·5 and y = (90 − lat)·5, i.e. a 0,2° grid.
const KOPNO = "wwDmhBDEEAACLCDB glD8fGYGBIICOGGAMEIYMBEIKEICCADGEABCKKIOSAMEOFcFKLMDOFIBSVEJGFCCAAEJFADDEBBEDDBLKLDJAJFFFAHHHCAABJCEFFHDKHACBEAAHGFBJFKHEFGCEDADDCABFDHDABFdLVEPENARIFKlBATKLAPHAFEACDAPFJBNPdGEDJEGEAHRGZCGGFULGCSHSDONBJIHGMAFCADFCBMCDBCDBDCBECBBGABDEFAEEBADGCEDECIIBGGFKECDDDMTCCEFCCOABFFBABeKKDBECCGDEEFIDCAGFKcSIACGIEGBIPCJBLCHEBDDGNEBCK +vDyhBEGFCFBCD yrDuiBcWTL mgD8bIHCEFEGGHBBCGKHFBNGJ 8tCwrBOAHCECACNAAJCB isC8CHASDKC sqCiDFADBWA qwB+FAEHCRAEF mqDgfKGJA +8CwZSTEJAI w+CwYIAAELICLBB 4+CqZHHEBCHCBEC m/CyYECCIBAAEBBAFDBAD s/CmYGQFBHL g+C+XICDKHL gpDmeFCFHAF ioD0dHLNHABWQ yjD2eJCEHIBCC 6gDgdIECGJDJBBCDBBCCF 8/CidEEBEJDAB 0+C6eRELDABIBSEEFCE 49CifIIDANFCB m9C4eIBAGVCADEBIECBDD 28C6eACHAGFEC q8C2eECFEHF s5C0cEIECBEFBBFFBCD q/B6JICNECBDB g/ByDEACEMABCSCVGDBCBPCGFND 2rC8CLERBGB inC8CMCjBA +nC6CQEdCCCXBYBCB +nCwGLEHBIF krCoGACFANDGB quCqFFAEDMC m1CoDPDcA 27C8EFELDEB qkDgFFABBIA 2/BgRUCACGBBENALBAD y/B+PIEEGRH gjCgRDEACJEFDGD m+BiKBACEHEAF m8B2KHKHJGBCEEFEC y7B4KCCBEHD o5B2PCCDCFB ySmzBECHELAHAEDHB 4QgzBMEFCMAIEhBDAD yjBk1BPDSAEE mmBkwBEACCJCCBDACBEB wkBowBECJCDBID mhBmyBJERAQDEC 6gB+xBGCBCLB 0Z0yBBCGDCEGDGAHEOBAEDC/BF ghB+yBBCCCBCNDIBFBEA gjBmxBHEDBOJBEECFC M4FOEZCAF 8lBksBGECBCEREAB 0sBgtBICGGBATH mhB2pBFBENEACEDEEE ulBmsBKANIDBIBDAEBDB ghBwrBBIBBADBEFAIJCA uhBkqBDACDEC +kB6MLBNFQA klB4NEABCCAGFEEHEHBADKHAI 2CoIKAQCHELDHABD qEoJEACEFCLD mF+KEETAGD kgBsWKEPCFF yjBsWGADELAAD wIiKGCHCEANGCBDBBCDDGBGCBD 0I8JEABCLC qP6KBCBBDCCFEB wOwKOKDAGCAELFCBFBEBFA yOqKEEDBCEBAFF iOmKEGAGHJDCEF mO+JEAEGFDEGDEFN 6N+JCCGADCEEFBDCFF iQyLAIBFDBCB 6OmLECDEKFDKHBEAFF iPwLCCDCGACGNJ qkB0NSAFEDAADFCHDED 4nDudECAEDCAEPIHALFABOCCFCGIBGFAF ggD4eRIJKHACFOJ ylD8oBOESDCOBBBCAKHDDIHACBHDBHECHJAH u2C6CMCFCCCBCjBCTDMBEBFAIBYB 42CiDECDCKBOCDEFCICDCrBBTDUF s4CsDDEODOECE9BEYN gkDuEICGFoBGNGLBCFFCDACCKEjBAFETFCBADQD 2kDiFMCAElBB kmDyEoBCJEPATDCD suDinBMCEMAEIEBHIMKEIDGAFQJABKNOHDGFADNHIFEJDHEAFABFCCADDBAEFHCBBCBDDHCA suDgpBMBDCEADCCEJMFCACEEJACAJEDQRIZFGBBBABEABBOLIASLMTIBBA 0/CmZEEBECECKDEAEFHBGCGBEBDBCJFCJFDBEHDFICJIBEFEEAEGFEAADGAAH k+CqWGEEBAIEELSEMECEDGGCBECBCCEECBEADFAHJAIHHDEHBEHDBBEDDBNGACX +hDscIAAQIKEAKLQHSKuBOOKAGUKAEHCMMEIGAAEICBCACKCDCCCBAZFRTNDDCFDEGDAACNAMGHGNBLJCBHCBBBCAFBDEAFBCBFJCBLFTFFDCAHBDDCDDIDCBHHDMDGCCDPADFJBCFOD o/C6bDGFAfBDEBIGIGAEFQBCCTKIMAGGEAEFCBCDAAHHDCHDBDECaHABBCNBDFBAFGHCJCDACAHEJECEFSGMAKJCC 65CgeKCCGSCEFSGEGOCCKNFPCXFJARDCDNBCAGH s2CwaMAIMOIIKCCABCAOOGCACDCIDCEBIKECICCBGIBGIBaLBAEdbLXLLFNHFHLPLBH 48CiaEDEGAGEBACEAIEACJCEGLCEGHAKMBEMKDCFBDIAKFEBBFIEGFMNGBJFCHDBEJCBHNCBRHHADBHAFGFQGBBGLODKNODADEBKN utCqE/BIRIJCACHCACDACCJCXADDYFFBIDDBGCuBLgBBgBFOC ypCmFKCJGBGMIMELCZBDACBGBHDNCFDCBKDEBDBIBBB 8kDkLGOBKQiBHFHAFOKOBEBFFBFIBDEPDHEXDFBDCLIACDDD mlDqOKCGDBICCEARGHINFHCFBAEIELEBLGDADKCELBJEB skDmPCAAGGOFKDCAKDKCEDGFCCFBABEDADGAFFGLACBDAABBECCDCHIDFCFFBXEBGLBADULeAIRGBFEEEMDKHEHCHBDCFEFEEEAADDACD oiDuRCACEFGFDHIDBADDAKFCAID ohD0REAAECACEFOHECHBGDBENDDCEFCBDECDDMH i+CiVBGHJCFINGBEC 86C8VCEJMDCHDBHGD oxCiZIEKWBIHEHBBFANCNEC 4nCggBEGEaBEDFBCCIDIAMVgCDEPELFHZEJINDZELSDCCADGDACEFACGDBBCHCCGFAHED yGi1BbAXFKDIAcG oiBg1BLACDuBH kqB40BQCGGACHCCC9BGtBAKFMASFDDGFMFWBWCICAE ylBo1BAEHCZDJCZF0BCEBDBKBIAAEEA siB4xBQSCIJIjBABBCBaANABAKBPDFEHBCCDCNDMDICABMAHBCBeCADNBQBVDAFDBSD 0iBysBGAEEBCMIUGNE1BDMBECDDCFCEBAEEMALFIDJBCBBBEAGD 2e8UUEGESGGEKCAEKCGEJCZCGFABJBFHXFFABBCAABJALGHCEBEF 4+BiDOCCDGAEABCMBYCECPGZCdDIBXAEBHBOACADBGCBB w9BkDKCBEIBECBCUAIEVEXSbJeBdADBiBDFBEANCADHABECANCRHKADAABHAFFeAJCOCABIBQIFHEB o7BsPCEBMFADCDTKB m7B4OCGDIDBBHIDAB k9BmQFICEAEbLEDKC 4nBoGIEPEFBEBLBGBDBEB wQqMSCWUPBDBEDFCFDFAEBPFBBGBFCDD 4hB+VKBKECEGADAKCCEBEFBRCDGFFRCFDABQCEBDDADFD 4oBmcMADMREBHCH o3B6JHGBEWBCEHIHCICLCMAKEEIMGCGHBIEBEQCAGLIKCLEfAFGFBNEOLKAIFHETDABMFBDDCEDOBBBCFHDGDTCBBGFBBCBBBDECDHIGNDCFBEAAHGBBBEBAD g2B+KKBEEACEAJGEKDIbIJBGBHAEDDAQDLAKFJBEDDAADOAEDFAGFGAACCDEC CyGsBOACGABIGCEAACCBDBCDFAKBECACGBDAMAUKHEHBCCPAGCDCECHCGEFBBEBDDCPDFFXAFFEDJCBCEEFGAnB szBuHKBFCGCBCEAACIABCCEJGnBKPBJDNCBBODFAEBXBWBHBIBZBMBFAEDKCFBGAHBEAOEACBAEGEDEACFIEABGBGEADGCMBBBEB 0sDy0BNCBB usDq0BYCZCFBEBAB 63C0wBHAGBEC qPuzBLBMA 8SqzBDBEABBKA 0Jo0BPBKB u3BoyBGAHEHD q9BgyBFBKA 0gCkyBHBGB 0tB+0BZBKB 6xBmzBCGHBHAOF ojB+0BNAIBIA 8mB8vBECNA 8kB+xBFFIC 4bgzBDACBBDIAAE gpCiDNAKBGC iqCgDAELB 0gBsrBCHCG uiBqtBOABCGELDACBAFB ipCmYIAHCDB ssD4gBAECBAGDBAF upDueBAHH +gBqrBDABFEB uhB6sBIEFEADDCFD qjBstBJADB +hBgtBECBCJD mhBgqBBCCGBCFHGD 67CseJBMB wqD4eGMFF 6qDsfGEHBBD gjDugBAEDA ihD2fGBECFGDDBD ojDqnBGAHCHBIB 6+CmZGRAI m/CiZDCDBGD ++CqYCEFDBCAF yiDqcKEDC khDkcEEFDCEFB siD+dAEDCBFED qiDkeFECF 4+CydBGCCFCCJCB y+C4dDCCFEB q/C2cEAJA qhD0eBAADED 8/CweJECD i6CidFCAFGA 22C2bGEBEHH o3C2cDBBFEA qqC0CICLCTB spC4CcEdAFA yqC6CECDANB 47ByDKEJBFF wwCyFHBKBGC kxCsFJAGB ktDsGNBQA srD6JBAEDIBAE gpDsMFEBBIF 2mD+NRKMJIB sjD+KCADEFBED o1CwYBBER 0HmWBABHCDKG 4DuLJGIHEA mEoLEADCCCNCKBBD 2pC6iBDBABCA q2B8JHGCBBB q2BkKGEDCHDEB +fsUBGDDCF mlB+YJCGBBFGA sOsKCCDGCDDD +OyKBCBBCB ioBycCHEAAE 4bkcEIDCBBCBDF md+FSACFNDGBMCNHEBKCLDUDSAOIJEGADEMBDBEAICEEBDCBKCHDQBQEHGIBKAJCECBEMFDEEBGEADCAOAEENEUBBCJEGBBEIFOAIEPEMBBCCAIDIGTCaEXCMAACPAaEBAAEIBBEEBGEEDACMCHCQCHEQBKEJAGCBAHAGEFACCBCHBBCCAAEBCHBCBDCHFKFNECBDAJDDACCFAGEBANBGCCEICBAIGABMCCCDAGCFCMEBGFFGIFAAEZLAELDeQDExBLFDGBJBJFCBHCFDDAEEVCLBAFGBABQCEEDDWBHHWJJLFAABDAFBABREADKBHBCBHACBHABDLDDCGEbBGEvBBFBABNCJDFDWAZDBFEBBBGHOFcAPKEKME yiBmCeATEwBBGCBCUCpCKmBBvBKLBGERAOCHCdAKACCBAhBAYEBCnBAqBCTCMCHETAAEDCfBECFCYACCMCBCXEDAABPDEEPADBACJALBBCHBACJAADBEJACDaDLDABCAOAQEMAKDVEHFOBHACDHEFCCDPCIFyBBZAIAbHADaAiBGZH+BDTBUDpBIpBALBgBDtBGNDqBBtBCDBIADBUBbCGBRAkBDeAPBSB2BGdFIBFAOABBWCJDYCOCEAPDuBCHBGA 4a2FOEAGOGHABAGCHEYCHCIEBEECKJMECGFAACKIIBKLIBDAEBFBBFgBCDCOCFEIANEOKBETGLFFAKEEEdDIENIXFPAOCKEUCLKJCHBCCDAAEFAbFAEOCBAGAKCAEPCECFABCCCFBCCFCCCFEHKBOICBGCFKAIODEWByBQECBEODQECCBGCEAIGGBCMECEDCGAIEBFEBCECBBDGDHNCDHFUFKHCDBNRHIJEACDDAAFBACBFAGHDBBDIDcEIBMCBEGAACGABCECOEGBBKJAIACGCABGFASAAGFCGAEDACCBCEMHEEADGBBBCBEADDEABBEDECDCGAACECBCGCFCIAEEHCKAFEIBECAEDCKEAEJBKEDCEAACKCCEDEIDECDEGDEEIAGCdKCCBCYHDBKACEDCCCIDGECIFAGCBAECNIPCNK/BAJIHCNKNBMCBELKfMECHEMDEFaJYPaFOCDCECBCHEPAMEIBFGGCCISGIBKGZGACFBLKHBEHBAQHCEIDNAEDBBBEJEBBDEHBCEJEDBBEBDDGJCFKCCDCGGEABBCELCBDBENCJEADBGCCAGJIFDGFDCBEGKJMEHBDDACBDBGHHECIBBCGHDCDDEMGBCHFIGAEDDGGJDMEEMDHCEDADCBBACIAAECBDEHBEEDCGCJAFIABACHCLMFAAEBBCCHKCOGOCEBFACBDAEIQBKBGHACAHHBJBCFFEDDACJNNNGBFFBJACBJECABDBCVCCCIADEIEBCJFAEFAJFDCPBABAEJCCBDBCEJIDCCBFBCEHCBIDAGOFiBGSMUIAIGUDICEBBBGFEPUFOACGHOCADOBFDEECDQDIGAgBBICEGEACIFeSYCAABIEOHEAOGKKBFOHBHGFEDECACCFICSLEEHEEKFIGIEBCFDLQDDDCDEIMCCIUBKGOFDAYBLCCGCBCEEBCECBIEDIDACCMBOIEEBKCDEAIGAGCDMEADOAECBEEDKEIGAECBCGADEEESIGCENMHOFCGAMFEKKBBIEFIFABCDIBUIAEEDEEBEECDIGHAEIDUGOBQKMMSCGSAKFMTUHQFABICWDUDEBOLQAIHEBGJABBACNAACHGNENMFAECDGCKBOJILSJKADIDGJFDAIHGFSPOTEJFFAFFEHBFDSOMBGGEAGHKFEdGLBEGDOLENDAOGCGBCEDCDBFAGEHGDONCFIAEIGKCAEDCECPKFKBCDDDCGCFCDGEGDAEAGIHBPGBKBALDEBCCGFNGDBCDMBLADEDBEDHCBDOBAECBADFDGEJCFDCAADHBBDEAABIGCFDEBBCAFDGBBDEABBADDEAHEBDABDMCDFDEDBEBBBCBBDFAABFACEDBIFADIACDAGDCGDAICHBDIADBIFFDELAHECADDAEFLEDFITDREBKVIXDTEJBFKZCbBDGRDdLLjBRHHDHCDNVLZLRLHEDFJCDMJCFAFBGABBEHFCBBJIDBBEFAFMDBDEBAFIDILFBEFDHEBBHJNCDECPHJIEGHEBFBCFFHBBEDFBBCEDABHNJEEBCFDBBAHRTCAADLCbHdVECJDCCRGpBPLHNDTPBDEBDBEFFLTRCADBBDCAJDCDFCCJLHBDFBDDLPBLHDLDESSSAGKMCABBCAKYCCCBIKFGDHPLDNHHDCNJGAECBDCDPNRhBLHTFAFLLADFHABEEDFIAHBBEDBABHHAHFFEJFNEHCZIAHACDDBEBDAFNUCCEFEGFAIDAEAEHDDADFDEBDAABDCDBABECBBADDEFBBDCDBCJCDBEBFCADDCHDEDIBJEBBAFEBGEDDCDLKBDEDBCCFDCHHEBIGFDABDAFGHFIDHBIJBBBGAHAGFEDDCBBFLEABGDLHFBBDEADBEAHBCFDEDBHJBCGKHBBDCADBACHBKGFCfNCDEECBDBJCJBABbCHDEBFCFACBJBCABBEBPEADHEECDCGADEJBBEVGABIDHAEJKBOCJDEBTEJIDAECPIICACHGVIBERGAEbGDBDEFAACHCCDQHOCDBCDSDCDKDBAADEBDBIHNGDBGBHABGNFREGFDACDFFEDFEACNCNHGBKCEBFAEBPAEBHAFDEABBEABDGBEACDBCADEBMCKFMAAFDBGDJAJEDBACdBHFIARDkBJIADEECaBJBFDCBIGOAPDABRBFDZHEACDaDSLQBEEEDFAEBQAQFICDEIBKCSAACECcBuBGOBwCQHFQDGADEuBJdKHECAOFIAACIFOBDCEAMDFBCBYMEABBGDBAEBEGBCIAGDKAwBIWCKELCBCCCaCaDUIDCMGFFGCHJWHXEFAEDWDSKKBKEiBAGABBMECBJBDDIBOCDEIBDGKGJAGEBDGACBDFCBUFDDHCGDBBIAZDFFIBFABFGBEACADBGD gf0LLBIB ohB+GLBOAAC +fqICCDAFB 0euIJIFADBGF sf0IECDGFBCF yXgEFAHFIC ua6DWCbCBD sZkDBCLB mcgELBBBKAEC gb2EAEJATDSFIC +VyDEClBAYD oTwEJASF sXqFRFOBKCAC gZgFcCDCECLESECCDACGJCHBCEJANHTFEBKCKBDBIARBKADD 2d4HEBaIEEBCKAGCHEXHTKDFNCKFBDGLGA 0gB4GGCBINCFDABED sfkFYCMGlBADDFBAD 2ZoECCBEEEDACCDCVABBCAFBQBjBAGBMALDEBUEDBGALDUCBBCA +XqDIGIBSCECBCIEJCJDlBBBBQBHAEBDAFCABHACD yb4CMGOAEEGADBKADEKCBCQAGEZGDDBECAHAAELDEEdBIBNADBEAJBeDnBCDDMBNCJFaAVBIAFBCBUCPBYDJB 6aiEKCDEWBICHAWAVCWEDCGCEBaCUDSAaEACHCKAZGPFCCBCHAnBCBDJCLBHCHFCFHFVCHBEBLBEADBKA mayDMCDCECTCFBGBJBDD 4V2DICLCGADERAHBAB kU+DHCGCDACCLGHBCDJCCCDCFBBCCCDCDADDPCFBoBLYB uWsEMEEDKACCFGbClBGRDiBDbCABEBFAFCCCNARBYDTAWBPBEBOAJAIBYCQGUAHDEBJBQDEABCEE kb+EcERKTAGEDELADPKAFBCB 6ZsGWINEbFABKBBBGCBD uUuFSDQCFECAOBDDGAMEGIECEBHNCBQCKEKMBGkBIAEXCECBCKBECJEXBNDHETElBCDHdBFF4BDVBlBAFDcDZABAEBLBIDBDSDWDEE 6S+EWAWGjBKLEDGXGJFRDURHFeB yfyKBEADBEDACDDCGFBEED yZiFLAQD ufqGFCHA wf0GBBIDEA md+GDDCBEC qYsELCEBNBQB 4XmEKCNABB wY8DHBMA mcmEHBGA 2U6DLBGAIC 2X2EFBIBEC +mBgMFCCEJOGFGCFEKABGIFCCIAFGECDCMBHGCABCCCIFDGEBCCDKFAAFFEEFDDBENGBBMFHCFBEBJCXABDKFHAEAEDEABDEABDKLKF 49BsGEAAELC o+BoGEAHEHAMF m9B2GGBDERCMDADGD g9ByGCCBCHB oqBwCZFYC 4yBmDPAMBGA uyBsEDFCA 0yByEGENAAD 8uBgCqBE9BCkCBIEcCPChCEuBAKCcBCETIkBHWCMDUAcEdECCDAVCICDCdAHCCCGAAEECVGCAHIKBOCLCCCUCACpBEcEEIBCZAMCCEIDIGTCHACBBBDGUCBERCfFICLELBGCJAiBBWEBIRBFFTCSBCEFCgBGDEGACIHCADBEHALHXDMCACZCECACJCYAJCCCSDiBEPCACZKtBGNDCEJENMFCFBCCVGBBIFJAECDCDAECTCGENCIGNCKAAEHIHBGCDCJAICBECEDACCFKJAICAEHAECDADBCBDCHBGDFCFBCFJENAEBFAHFBBGBHAABHBGFFCJHBDOBPAMDGCBDHDCEDAHGFLQDPEFBADBAWHXGCDKBLBBDMDUCFACBNANCGFQCEDVCEDSAEBDACDIAHAGHRAXFSBWELFIATBCBKBPACBDFDAGGFCACPBIHHCEBDAGBCBHBEDJBEBDDJAKDXHEBDAtBHlBCCCPAJDMBdDwBBADdCLBEBZDMD6BFKHGAZADBCBYFQCBBCBQAEBBDIBmBGZFuBDKCAGGBAFiBENDKA0BGEFLDqBAvBABBCAwBBKBWECBHBKA umB+vBCCFAPGCEHBACDBJGHACCFCECDEECMBDEPBAGFFFABECCHADECCHAAIIAFCEABCMCADKAHESODCIADGGBEEJEIACCLCOAAEDCMEBCFCLBMGJCICHAKABCLAEEFCHDAEHAICJAICjCMlCAOIeCTGjCDqBGDEXAjBHGEFACCcKGDoBCCCFEdAgBAOIsBBIEqBEgBClBEMEsBBVEIEIABESAmBJ0BDsBACCFCQAOBYJYDQCSD6BD8BB/BDFDjBATDADWJyBJwBF6BDDBOHSAKDPACBFBCBIDOCCBBBcDEFNDQCIDBBKCGEIAAHSAEAFG0BBEGaH4BFKAGBaGMFDBEAIEaBSEIDCABEEEQBIFMGKDIEQC+BJEDDHIBICDCIAIGYCKEON+BLCDICBCCCIBCEIHHBWCBHgBFQCSECCBCHBCCFEEAOBQEoDEEGDEAEFCAEHAJEUCbcKCGDABEBMBQHGHQJWAGDQDMHsBFKDsCFqCAOBGDMBkCMMDEFUBaKPEACcDiBAJEiCJSGICIBGFIBcBKEKBoCIMBIEFGUBIEACCCoBACESAIACDQGqBGQMICBFGAICqBCaICBEEHECERBOEBCXCHBOEXEBDDACGBAGGTBHEBENCMAGEDEECDGGAIGGCDEOBQGXATCJBEELADCCCFCEAFCICTEUACEFAGCDEgBIXCkBAmBGJCGC2DKA4BvwDAA3BsHIJBIB1CDOAHBGBlBB/BJ0EIgCLRDIBdDEB0CBXFWDCBvCJBBCAUDnBBDBGHgBCyBGQDFBcCEABBCADBEABBJBbBMBeCJDcDcCDBQDeAMF4BCyCAgBDgBAGDKABEEAHGaBBFGAKELGwBCiBDOCICWAPFCBJBFDJBoBBpBDDDCAIAACqBASE2BAWHGCBEaAkBGIACFICBDCAQGUBBEuCFQDIHFDBJLLOAEBDDGFDBGDJACDEBACGABFIAADGBGAABIBBDCBICBBQDIFiBH kwDgGBDODAG 89ByJGADCTGICDAAOFILAFEAENACDFDEABBCBPRAFCAFBBFDIFBNKNCLFADIAFAGFLEADKBDAEDEBACEDHCJIADEBDBEBDABDUAGBBBBCRADAEBDDSAPBABOBDACBQBLAIBKCDDEBBACBKAECODBACBBALEDBUJDACBOBFBIFBBMAHAADIBDBGBMAJAGDGCBDFAMDEEBFOAJBQFABGABAKDAEIFBGGBBDOCFDMBIEABMHMCHGQHCCBEKDBBIACCFCEAAEGFWEHCNAIEUCEDKCHCCCKABEEDWC0BOEGBEJGPCpBFZFSIBAMEBGGKYGGBNHCDeGGBFHYJUGCJFBEJHDYCIGJAFEOGMBCFKAABgBHECEADBODGAFACGHCQAGDSASDECDEIAADMBHFIBgBCsBMGFFAJFHAELDAABBAQFMNWAMEBGHGKEDICMKGDCBEPICEHADACBPAKEUCSHKHDFCDGAMBIGAGSCNBADEADHPBVABFIHNHUHADBBICCEFCEEDCGCgBCZFDDWAHBKBKAWGQAHGBGACEDEADGECIFFFEDbHAFDBCD+BBJEICFBQDPFMANBQDDBmCHLAEAYBECDCIAWDMCBCCDJDcCFBADeHUERCgBCJEwBBOEAEGBGCBELBOEHE5BOTI4BHJBEBOADACCIAIBEEBCCABGECDBGFBBEAsBAGCFAACOCcCKDBDMBuBGFEGAHCICAENDMGCBCCFCKEMEGBKJKGYBUEEBDACBSCFFIBJBSBBB2BERCYAFCABDAACHACEUHYCEEJCQAFEQAECBAICgBBeAMEBIMCEGFEIDADQDkBEKDGGMEKAEDHDCF4BEoBIAoBNERDDAGAACJBNEODECBCMBCEGAEGBCKECEDEVDCCrBMVKBELFTCJGCFNGLBRUECCBGCDGGKFCBBEDDCFEBGEGVGBECGPCAGBGNILpBENIFAFOBmBXSFBAEDBAEHMBJDJCDKFAVKCDFAGHhBCbSACICCClBEBBKBZFHCCCBCVBFCDBdCxBeXMACGCKAAIEAADEABAECFEODDECACHMCQKBCDAECAECCHOAIDQvBuBVMHBAFFCTOAKVKBGKGKQCKDIFABEFBDGBDFEDBEBDDGFDHBBIBDHHBDCDBCAFBKDDBCHHABDPEPIGFFBKJDDFAHIJEDGLABIOEAGCCGAKFSEBGPCBEDAACJMKGGQKILDFCIAKKPIKBIGDEEAACFACCAIHCHODBCEFCECAGDAACBADGHCCCFGDAFGRCDGBBDHBCCIfIBEEEBEDADHEDDBFCDFNKFACCHIDKIKACYYGcBABMRKBBACDACCDAEABEDDEGHDEGJIDACNHFFAAFDCADFHHDJACHJAAMHSAMGAGUKESQCGAQGICIBBFCVNDLFXNRDAETBABDELBAANDHACDJARDAFHAGDCBBCEJGABBCBABDBCCFFGEPFPAEFFGABFFAACBFBCDFFPDDDCDJDCECAIDGADBAABDGBDAEDBAEBABFAGDAAFBBCCBELGAIFGJACCLORMBEJCBGHABIEQDBECHUCKDCDGEEJADIDEJJBJd/BDZBACBDFCHBHGDFCAFCAFABECCBEJEFANNMDCDHCHBDFEBFCABFALRREFBZCHBbBDBFNFAPGHBNHHBPXDCFFBGHACEDCCAIQOMBEIOCLCBECAKBGIEUBWVAOCGGEQEKMNUBBDEAMJCDIJCDIJANGDCAGbKHGFALGLAFGJCFABFBRDBCLFJFFHRPLBPFLHDDJTbFAEPHSJHHNCKKMQiBGEBCAIMKEICYMIKYCEABEEKEWWAEHEGAKMIAYHcDGDECBOEADABKbyBTUVQXaLIJUDOIKBOEQIGBYESJQVMLMNKDAIaABCCBSDEVKBECCCBBIDQJKNUVQLIHABCdAZILDADDEABADFJGBBHNbNPDJDVBRZrBAVIXKLCLHTEFLVIDHADLTTCADBFJGCHJCACBCHEECBFDCABFEHCJDHABFAAFDADDAELBAEBDAEHCFFCFDBCAJHJAEBXEhBOLDCABBBCRAXIFBpBbADDADFEBDACBFHADHBBFHDABEBFBGBJCHFEBDAAHOAJABFJHKJGRAJFHEHFHBCAJMTIJGNIFGLODOJGHBLGLGFQHKRIBGIQBCCICgBPaBOCMDQCQFGCCEGBCCHGIKLKEESKKBUGGKUEMIKFCNOHOECEQCEEQCWGUHIAECDCICOBEDQdBREDHCFBLGHCPHFABGHAFFNCGDJAEBFDCDJBCDCCGADDCADDCDFCAFGDWABBCAIBFBABUAWHQACCICEEUCSAMDEFDHvBXCBIAEFEAFFIAGDABhBGHECBDCCEEEMABEJANGFBCDJDKFRBCBDBKAFABFAGJAFIFAAKFAABDODCHKIIIEACPALKGFPDNCGGFBCEFBCCBADFDCAEIIDBAEDCOGAGDDFCEEFBEMDDDEDFBCBBADDDGFMECBHBLADDEBHDJHCPJFPFICHFJBHFCAHJHEBJNEEEDCCGMGKOQEBCYOAEFDHBDGGEAEFCFIDAGJFJFBBDDAFFHARLFFDJNDZOVFHEBECIXMLMGIHEBIHCFGVALIHFCDFBVCCNCAFAABEDDCBAITBJCDFJQF4BEGBETEGFHAFHDBDEAZFBBEDFBQBGCMADJGAACQABDMBEJYDHBICBFIJIBQAADEAICCDMCLFEDDHDBAJKBABDCFAEDIAMFDMICNKBEGEBCMABEGAQDQIHFGCkBHICDBEEGASLFGGABPIJIBKIIBCLHADHWDWCCDWAPFABTCABjBICBBBFCCDLBCJDJEDABIBWNIBADHDVAJECCDEEEHGVGBEFACCFCCCBGBAAIICKI !ioCuNLEFINCFMGCAGCBBIEEQSKGHABIDEAOcKWBBVFBADEABDDAACBFCFIEGAEDJLHCBIDFCJNDDJFBCBMAFDEDSADBEJBD !yhCgJKFSGEGDAAEJAACDAFH !oe+OACGAMFOADACBOBDEZKLCCBFB !ojCygBDBACDHDLEFDVGGAKEEDKCO !kjCkcACHEAKHEEADAGCDEDBBGADFDDGATCFOFACGACG !y6C4KBODGBBDCEAACZKFGLEHBODOHQLKPGB !kaoMFEAFEDDCCFDEBFFAHHABEAHBCFKABBCDCADEEABACEQY !mWwIBCJBJCOAJANKNCBETCRFQCABEDKANJaIKBSH !ygBoOFCECBEHEbBIDUACBHB !uTsHCAFECCPADCECPGBBIBCDLCDENBMFDBOARBBCLBDCBB0BHIANGQAKB !08B2JBCNECBBDIAADIA !0jC+IFGJBIBLFCBFFGGAFGGBBGBLFOEBG !4d6NHKADFGDGEKBIDEHADNGPFCABKLACEAACMF !8dyNFAABXCDBFABDRGFACDNCOHOFCBEBBCCACDCABEEBCDQCEIMABEECBEEA !8dyNkBGMMFACEJBBFDAEGFEAIFEDJHEDBGFCFPHCBGA !kW0JPGDBSHiBE !qkC+JDCJHICABFBCBIAFCMG !uYgKCCFEECBCLIAFCCEBDFEBGF !+hBqHEDSGNCFCAD !wkBmLFEHDFECEFACDJHAEBHMKGADFEEGABAAFGI !63CiFBDLBIBDBEBDBKGWAKBDBEBMEhBCCENBIG !q4BiaACHDGCCFDDCAFAEBFDBDHAIBBDMOCJ !+wCwNCCBCFCdDLGAKHFCFOFgBE !8hC6eDBCBDJJLAZIYBEIIGOAE !kZgMDDACBACJBAACDDBCBDOC !whC2ICENEECHCABHBABEAABECIBPHEAADDADFGGKABEGCFADDCGOABDECABECDCEA !2gCwIAEDBBCCADBFGAGGAACBCDBBCBHIFDBEDFBKEFCECCDECBBEB !snCmLADIFBBeBdGACDGECIBHGICJCEB !urBgfCCDEHACGFDAKAFDIDACFCCADEADDEAEDIACF !04CsLCCDBAEBDDBEABDCJBHJAACEGBCCFFCCBBBFBGAABMAEUBBAC !g7CyIABLDEBHAGBIGCDACIAACCBDBEACEBCHBEBFCAGEABACCBCLBFEGDICCDDB !sjDmlBJABJKC";
function obrisi() {
  const out = [];
  for (const s of KOPNO.split(" ")) {
    const voda = s[0] === "!", t = [];
    let x = 0, y = 0, v = 0, k = 0, ena = true;
    for (let i = voda ? 1 : 0; i < s.length; i++) {
      const c = s.charCodeAt(i), d = c > 96 ? c - 71 : c > 64 ? c - 65 : c > 47 ? c + 4 : c === 43 ? 62 : 63;
      v |= (d & 31) << k; k += 5;
      if (d < 32) {
        const z = v & 1 ? -((v + 1) >> 1) : v >> 1;
        v = 0; k = 0;
        if (ena) x += z; else { y += z; t.push([x / 5 - 180, 90 - y / 5]); }
        ena = !ena;
      }
    }
    out.push([voda, t]);
  }
  return out;
}

// ---------------------------------------------------------------- noise and texture helpers (pure JS, cached)
const PERM = new Uint8Array(512), RV = new Float32Array(256);
{
  let s = 20261104;
  const r = () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
  const p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const t = p[i]; p[i] = p[j]; p[j] = t; }
  for (let i = 0; i < 512; i++) PERM[i] = p[i & 255];
  for (let i = 0; i < 256; i++) RV[i] = r();
}
function vn(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  let fx = x - xi, fy = y - yi, fz = z - zi;
  fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy); fz = fz * fz * (3 - 2 * fz);
  const X = xi & 255, Y = yi & 255, Z = zi & 255, X1 = (X + 1) & 255, Y1 = (Y + 1) & 255, Z1 = (Z + 1) & 255;
  const a = PERM[X], b = PERM[X1];
  const aa = PERM[a + Y], ab = PERM[a + Y1], ba = PERM[b + Y], bb = PERM[b + Y1];
  const x00 = RV[PERM[aa + Z]] + fx * (RV[PERM[ba + Z]] - RV[PERM[aa + Z]]);
  const x10 = RV[PERM[ab + Z]] + fx * (RV[PERM[bb + Z]] - RV[PERM[ab + Z]]);
  const x01 = RV[PERM[aa + Z1]] + fx * (RV[PERM[ba + Z1]] - RV[PERM[aa + Z1]]);
  const x11 = RV[PERM[ab + Z1]] + fx * (RV[PERM[bb + Z1]] - RV[PERM[ab + Z1]]);
  const y0 = x00 + fy * (x10 - x00), y1 = x01 + fy * (x11 - x01);
  return y0 + fz * (y1 - y0);
}
function fbm(x, y, z, o) {
  let s = 0, a = 0.5, n = 0;
  for (let i = 0; i < o; i++) { s += a * vn(x, y, z); n += a; x = x * 2.03 + 17.1; y = y * 2.03 + 3.7; z = z * 2.03 + 9.3; a *= 0.5; }
  return s / n;
}
const sm = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const mix = (a, b, t) => a + (b - a) * t;
function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
// Per-texture grid: unit vectors and lat/lon for every pixel of an equirectangular w×h map (u = 0.5 at lon 0).
const MREZE = new Map();
function mreza(w, h) {
  if (MREZE.has(w)) return MREZE.get(w);
  const lat = new Float32Array(h), lon = new Float32Array(w), cl = new Float32Array(h), sl = new Float32Array(h), co = new Float32Array(w), so = new Float32Array(w);
  for (let j = 0; j < h; j++) { lat[j] = 90 - ((j + 0.5) / h) * 180; cl[j] = Math.cos(lat[j] * D); sl[j] = Math.sin(lat[j] * D); }
  for (let i = 0; i < w; i++) { lon[i] = ((i + 0.5) / w) * 360 - 180; co[i] = Math.cos(lon[i] * D); so[i] = Math.sin(lon[i] * D); }
  const g = { w, h, lat, lon, cl, sl, co, so };
  MREZE.set(w, g);
  return g;
}
// Generated pixel arrays survive rebuilds (Ponastavi, other quality), textures do not. Generators yield once per
// row so that full-resolution maps can be made in small time slices after the first frame.
const SLIKE = new Map();
function* slika(kljuc, mk) {
  if (SLIKE.has(kljuc)) return SLIKE.get(kljuc);
  const v = yield* mk();
  SLIKE.set(kljuc, v);
  return v;
}
function izvedi(it) { for (;;) { const r = it.next(); if (r.done) return r.value; } }
function put(px, i, r, g, b, a = 255) { px[i] = r; px[i + 1] = g; px[i + 2] = b; px[i + 3] = a; }
function lerpStops(stops, x, out) {
  if (x <= stops[0][0]) { out[0] = stops[0][1]; out[1] = stops[0][2]; out[2] = stops[0][3]; return out; }
  for (let k = 1; k < stops.length; k++) {
    if (x <= stops[k][0]) {
      const a = stops[k - 1], b = stops[k], t = (x - a[0]) / (b[0] - a[0] || 1);
      out[0] = mix(a[1], b[1], t); out[1] = mix(a[2], b[2], t); out[2] = mix(a[3], b[3], t); return out;
    }
  }
  const z = stops[stops.length - 1]; out[0] = z[1]; out[1] = z[2]; out[2] = z[3]; return out;
}
// angular distance [rad] between pixel (j,i) and a direction given by lat/lon in degrees
function smer(lat, lon) { return [Math.cos(lat * D) * Math.cos(lon * D), Math.sin(lat * D), Math.cos(lat * D) * Math.sin(lon * D)]; }
// Calls fn(index, x) for each pixel within kot·k of a centre (x = distance / kot), wrapping in longitude.
function okolica(g, lat, lon, kot, k, fn) {
  const c = smer(lat, lon), ext = (kot * k) / D;
  const j0 = Math.max(0, Math.floor(((90 - (lat + ext)) / 180) * g.h)), j1 = Math.min(g.h - 1, Math.ceil(((90 - (lat - ext)) / 180) * g.h));
  for (let j = j0; j <= j1; j++) {
    const cosl = Math.max(g.cl[j], 0.02), dl = Math.min(180, ext / cosl);
    const i0 = Math.floor(((lon - dl + 180) / 360) * g.w), i1 = Math.ceil(((lon + dl + 180) / 360) * g.w);
    const full = dl >= 180;
    for (let ii = full ? 0 : i0; ii <= (full ? g.w - 1 : i1); ii++) {
      const i = ((ii % g.w) + g.w) % g.w;
      const d = Math.acos(Math.min(1, Math.max(-1, g.cl[j] * g.co[i] * c[0] + g.sl[j] * c[1] + g.cl[j] * g.so[i] * c[2])));
      const x = d / kot;
      if (x <= k) fn(j * g.w + i, x);
    }
  }
}
function* kraterji(g, visina, svetlost, n, seed, rMin, rMax, globina) {
  const r = rng(seed);
  for (let c = 0; c < n; c++) {
    if (c % 20 === 0) yield;
    const lat = Math.asin(2 * r() - 1) / D, lon = r() * 360 - 180;
    const kot = rMin * Math.pow(rMax / rMin, Math.pow(r(), 2.4)) * D;
    const dep = globina * Math.pow(kot / (rMax * D), 0.55), svez = r() < 0.12;
    okolica(g, lat, lon, kot, 1.6, (idx, x) => {
      let hgt = 0.32 * dep * Math.exp(-(((x - 1) / 0.17) ** 2));
      if (x < 1) hgt += -dep * (1 - x * x) * (kot > 4 * D ? 0.75 : 1) + (kot > 5 * D ? 0.5 * dep * Math.exp(-((x / 0.14) ** 2)) : 0);
      visina[idx] += hgt;
      if (svetlost) svetlost[idx] += x < 1.5 ? (svez ? 0.16 * Math.exp(-x * x * 0.8) : -0.04 * (x < 1 ? 1 - x : 0)) : 0;
    });
  }
}
function sivine(visina, w, h) {
  let mn = Infinity, mx = -Infinity;
  for (const v of visina) { if (v < mn) mn = v; if (v > mx) mx = v; }
  const px = new Uint8ClampedArray(w * h * 4), k = 255 / (mx - mn || 1);
  for (let i = 0; i < w * h; i++) { const v = (visina[i] - mn) * k; put(px, i * 4, v, v, v); }
  return px;
}
// Scanline fill of the coastline polygons into a 0/1 mask.
function* maskaKopna(w, h) {
  const m = new Float32Array(w * h);
  for (const [voda, t] of obrisi()) {
    yield;
    const xs = t.map((p) => ((p[0] + 180) / 360) * w), ys = t.map((p) => ((90 - p[1]) / 180) * h);
    const yMin = Math.max(0, Math.floor(Math.min(...ys))), yMax = Math.min(h - 1, Math.ceil(Math.max(...ys)));
    const presek = [];
    for (let j = yMin; j <= yMax; j++) {
      if (((j - yMin) & 127) === 127) yield; // long rings (Eurasia) in several time slices
      const yc = j + 0.5;
      presek.length = 0;
      for (let k = 0, l = t.length - 1; k < t.length; l = k++) {
        const y0 = ys[l], y1 = ys[k];
        if ((y0 <= yc && y1 > yc) || (y1 <= yc && y0 > yc)) presek.push(xs[l] + ((yc - y0) * (xs[k] - xs[l])) / (y1 - y0));
      }
      presek.sort((a, b) => a - b);
      for (let k = 0; k + 1 < presek.length; k += 2) {
        const a = Math.max(0, Math.round(presek[k])), b = Math.min(w, Math.round(presek[k + 1]));
        for (let i = a; i < b; i++) m[j * w + i] = voda ? 0 : 1;
      }
    }
  }
  return m;
}
function zamegli(src, w, h, r) {
  const a = new Float32Array(w * h), b = new Float32Array(w * h), n = 2 * r + 1;
  for (let pass = 0; pass < 2; pass++) {
    const from = pass ? b : src;
    for (let j = 0; j < h; j++) {
      let s = 0;
      for (let k = -r; k <= r; k++) s += from[j * w + ((k + w) % w)];
      for (let i = 0; i < w; i++) { a[j * w + i] = s / n; s += from[j * w + ((i + r + 1) % w)] - from[j * w + ((i - r + w) % w)]; }
    }
    for (let i = 0; i < w; i++) {
      let s = 0;
      for (let k = -r; k <= r; k++) s += a[Math.min(h - 1, Math.max(0, k)) * w + i];
      for (let j = 0; j < h; j++) { b[j * w + i] = s / n; s += a[Math.min(h - 1, j + r + 1) * w + i] - a[Math.max(0, j - r) * w + i]; }
    }
  }
  return b;
}

// ---------------------------------------------------------------- textures
// Corona: soft glow with thin streamers, drawn once on a canvas; the Sun's limb is at 0,3 of the sprite's radius.
function platnoKorone() {
  const N = 512, C = N / 2, cv = document.createElement("canvas"), r = rng(11);
  cv.width = cv.height = N;
  const c2 = cv.getContext("2d");
  const gr = c2.createRadialGradient(C, C, C * 0.28, C, C, C);
  [[0, "rgba(255,226,180,0.55)"], [0.12, "rgba(255,206,150,0.22)"], [0.4, "rgba(255,180,120,0.06)"], [1, "rgba(255,170,110,0)"]].forEach(([o, c]) => gr.addColorStop(o, c));
  c2.fillStyle = gr; c2.fillRect(0, 0, N, N);
  c2.globalCompositeOperation = "lighter";
  for (let k = 0; k < 120; k++) {
    const a = (r() < 0.55 ? (r() < 0.5 ? 0 : Math.PI) + (r() - 0.5) * 1.3 : r() * 2 * Math.PI), d = C * (0.42 + 0.56 * r() ** 1.6), w = 0.01 + 0.026 * r();
    const g2 = c2.createRadialGradient(C, C, C * 0.27, C, C, d);
    g2.addColorStop(0, `rgba(255,232,196,${(0.06 + 0.1 * r()).toFixed(3)})`); g2.addColorStop(1, "rgba(255,200,140,0)");
    c2.fillStyle = g2; c2.beginPath();
    c2.moveTo(C + Math.cos(a - w) * C * 0.27, C + Math.sin(a - w) * C * 0.27);
    c2.quadraticCurveTo(C + Math.cos(a) * d * 0.7, C + Math.sin(a) * d * 0.7, C + Math.cos(a + w * 0.15) * d, C + Math.sin(a + w * 0.15) * d);
    c2.lineTo(C + Math.cos(a + w) * C * 0.27, C + Math.sin(a + w) * C * 0.27);
    c2.closePath(); c2.fill();
  }
  return cv;
}
function texSonce(w, h) {
  return slika("sonce" + w, function* () {
    const g = mreza(w, h), px = new Uint8ClampedArray(w * h * 4), r = rng(7);
    const pege = [];
    for (const [la, lo] of [[14, -40], [22, 35], [-12, 95], [-24, -130], [9, 160]]) {
      pege.push([la, lo, 1.7 + r()], [la - 1.5 + r() * 3, lo + 5 + r() * 3, 1.1 + r() * 0.5]);
      for (let k = 0; k < 4; k++) pege.push([la + (r() - 0.5) * 5, lo + (r() - 0.3) * 10, 0.35 + r() * 0.4]);
    }
    const spot = new Float32Array(w * h).fill(1), fac = new Float32Array(w * h);
    for (const [la, lo, rr] of pege) {
      okolica(g, la, lo, rr * D, 1, (idx, x) => { spot[idx] = Math.min(spot[idx], x < 0.45 ? 0.22 : mix(0.58, 1, sm(0.7, 1, x))); });
      okolica(g, la, lo, rr * 4 * D, 1, (idx, x) => { fac[idx] = Math.max(fac[idx], (1 - x) * 0.9); });
    }
    const f = w / 512;
    for (let j = 0; j < h; j++, yield) for (let i = 0; i < w; i++) {
      const x = g.cl[j] * g.co[i], y = g.sl[j], z = g.cl[j] * g.so[i], idx = j * w + i;
      const n1 = vn(x * 34 * f, y * 34 * f, z * 34 * f), n2 = vn(x * 70 * f + 5, y * 70 * f, z * 70 * f);
      const lane = 1 - sm(0, 0.16, Math.abs(n1 - 0.5)), lane2 = 1 - sm(0, 0.12, Math.abs(n2 - 0.5));
      const gran = 1 - 0.5 * lane - 0.25 * lane2 + 0.35 * (fbm(x * 5, y * 5, z * 5, 3) - 0.5);
      const fn = fac[idx] * fbm(x * 40, y * 40, z * 40, 2);
      put(px, idx * 4, Math.max(0, Math.min(1, gran)) * 255, spot[idx] * 255, Math.min(1, fn) * 255);
    }
    return px;
  });
}
function texMerkur(w, h) {
  return slika("merkur" + w, function* () {
    const g = mreza(w, h), N = w * h, vis = new Float32Array(N), sv = new Float32Array(N);
    yield* kraterji(g, vis, sv, Math.round(700 * (w / 512)), 11, 0.5, 9, 1);
    okolica(g, 30.5, -170.2, 20 * D, 1.3, (idx, x) => { vis[idx] += x < 1 ? -0.4 * (1 - x * x) : 0.25 * Math.exp(-(((x - 1) / 0.12) ** 2)); });
    const px = new Uint8ClampedArray(N * 4);
    for (let j = 0; j < h; j++, yield) for (let i = 0; i < w; i++) {
      const idx = j * w + i, x = g.cl[j] * g.co[i], y = g.sl[j], z = g.cl[j] * g.so[i];
      const n = fbm(x * 3, y * 3, z * 3, 5), d = fbm(x * 12 + 3, y * 12, z * 12, 3);
      const v = 0.8 + 0.35 * (n - 0.5) + 0.12 * (d - 0.5) + sv[idx];
      put(px, idx * 4, 150 * v, 141 * v, 130 * v);
    }
    return { barva: px, bump: sivine(vis, w, h) };
  });
}
function texVenera(w, h) {
  return slika("venera" + w, function* () {
    const g = mreza(w, h), px = new Uint8ClampedArray(w * h * 4);
    for (let j = 0; j < h; j++, yield) for (let i = 0; i < w; i++) {
      const x = g.cl[j] * g.co[i], y = g.sl[j], z = g.cl[j] * g.so[i], lat = g.lat[j];
      const q = fbm(x * 2, y * 2, z * 2, 4);
      const b = fbm(x * 1.5 + q * 1.8, y * 9 + q * 2.5, z * 1.5, 5);
      const yv = Math.exp(-(((lat - 25 * Math.sin(g.lon[i] * D * 0.5 + 1)) / 18) ** 2)) * 0.5;
      const t = Math.min(1, Math.max(0, 0.55 + (b - 0.5) * 1.6 - yv * 0.35 + Math.abs(lat) / 200));
      put(px, (j * w + i) * 4, mix(196, 246, t), mix(160, 226, t), mix(108, 182, t));
    }
    return px;
  });
}
const ZEMLJA_PAS = [[0, 30, 74, 32], [8, 36, 80, 34], [13, 86, 108, 50], [20, 116, 116, 66], [28, 112, 114, 64], [38, 78, 106, 52], [48, 58, 92, 46], [57, 42, 72, 42], [64, 70, 82, 62], [70, 132, 128, 112], [76, 214, 220, 228]];
const PUSCAVE = [
  [-17, 33, 15, 31, 1, 216, 182, 124], [35, 59, 13, 31, 1, 206, 166, 110], [48, 74, 24, 37, 0.85, 192, 160, 116], [52, 70, 37, 46, 0.6, 180, 162, 118],
  [75, 112, 37, 46, 0.75, 196, 172, 128], [116, 142, -31, -19, 0.9, 196, 124, 72], [12, 24, -28, -18, 0.6, 190, 160, 110], [-72, -68, -28, -15, 0.85, 200, 172, 130],
  [-71, -64, -50, -38, 0.5, 170, 150, 110], [-117, -103, 26, 37, 0.65, 190, 150, 104], [40, 51, 2, 12, 0.55, 180, 150, 104],
];
// West edge of the Greenland ice sheet: a line through Davis Strait, Baffin Bay and Nares Strait ([lat, lon]).
const GRENLANDIJA = [[59.5, -50], [64, -56], [70, -59], [74, -64], [76.5, -71], [78, -74], [80, -68.5], [82, -61], [84, -55]];
function grenlandija(lat) {
  for (let k = 1; k < GRENLANDIJA.length; k++) { const [a, x] = GRENLANDIJA[k - 1], [b, y] = GRENLANDIJA[k]; if (lat <= b) return mix(x, y, Math.max(0, (lat - a) / (b - a))); }
  return -55;
}
const GORE = [[72, 102, 28, 39, 0.75], [-125, -105, 36, 58, 0.35], [-77, -66, -40, 5, 0.45], [6, 15, 44.5, 47.5, 0.35]];
function texZemlja(w, h) {
  return slika("zemlja" + w, function* () {
    const g = mreza(w, h), N = w * h, m0 = yield* maskaKopna(w, h);
    const m1 = zamegli(m0, w, h, Math.max(1, Math.round(w / 512))), shelf = zamegli(m0, w, h, Math.round(w / 90)), odprto = zamegli(m0, w, h, Math.round(w / 28));
    const px = new Uint8ClampedArray(N * 4), rough = new Uint8ClampedArray(N * 4), c = [0, 0, 0];
    for (let j = 0; j < h; j++, yield) for (let i = 0; i < w; i++) {
      const idx = j * w + i, x = g.cl[j] * g.co[i], y = g.sl[j], z = g.cl[j] * g.so[i], lat = g.lat[j], lon = g.lon[i], a = Math.abs(lat);
      const n1 = fbm(x * 4, y * 4, z * 4, 4);
      const mm = m1[idx];
      const kop = mm < 0.12 ? 0 : mm > 0.88 ? 1 : sm(0.4, 0.6, mm + (fbm(x * 14 + 9, y * 14, z * 14, 3) - 0.5) * 0.5);
      const n2 = kop > 0 || a > 60 ? fbm(x * 22 + 4, y * 22, z * 22, 3) : 0.5;
      // ocean: darkest in the open ocean, deeper blue offshore, lighter over the continental shelf
      const sh = shelf[idx] * shelf[idx] * 0.8, glob = mix(0.7, 1, Math.min(1, odprto[idx] * 3.5));
      let r = mix(mix(6, 14, n1) * glob, 30, sh), gg = mix(mix(26, 50, n1) * glob, 96, sh), b = mix(mix(66, 104, n1) * glob, 138, sh);
      if (kop > 0) {
        lerpStops(ZEMLJA_PAS, a + (n1 - 0.5) * 10, c);
        let lr = c[0], lg = c[1], lb = c[2];
        const e = (n1 - 0.5) * 8;
        for (const [x0, x1, y0, y1, st, r2, g2, b2] of PUSCAVE) {
          if (lon < x0 - 8 || lon > x1 + 8 || lat < y0 - 8 || lat > y1 + 8) continue;
          const wgt = st * sm(-3, 4, lon - x0 + e) * sm(-3, 4, x1 - lon + e) * sm(-3, 4, lat - y0 + e) * sm(-3, 4, y1 - lat + e);
          if (wgt > 0) { const v = 0.9 + 0.2 * n2; lr = mix(lr, r2 * v, wgt); lg = mix(lg, g2 * v, wgt); lb = mix(lb, b2 * v, wgt); }
        }
        for (const [x0, x1, y0, y1, st] of GORE) {
          if (lon < x0 || lon > x1 || lat < y0 || lat > y1) continue;
          const wgt = st * sm(0, 3, lon - x0) * sm(0, 3, x1 - lon) * sm(0, 3, lat - y0) * sm(0, 3, y1 - lat) * sm(0.45, 0.65, n2);
          if (wgt > 0) { lr = mix(lr, 122, wgt); lg = mix(lg, 108, wgt); lb = mix(lb, 94, wgt); if (n2 > 0.66) { const sn = sm(0.66, 0.75, n2) * wgt; lr = mix(lr, 236, sn); lg = mix(lg, 238, sn); lb = mix(lb, 242, sn); } }
        }
        const det = 0.86 + 0.26 * n2; lr *= det; lg *= det; lb *= det;
        if (lat < -62 || (lat > 59.5 && lon < -10 && lon > grenlandija(lat) && !(lon > -26 && lat < 66.6))) { const v = 0.94 + 0.08 * n2; lr = 232 * v; lg = 238 * v; lb = 246 * v; }
        r = mix(r, lr, kop); gg = mix(gg, lg, kop); b = mix(b, lb, kop);
      }
      // sea ice
      const ice = a > 60 ? (1 - kop) * Math.max(sm(76, 84, lat + (n2 - 0.5) * 8), sm(66, 72, -lat + (n2 - 0.5) * 6)) : 0;
      r = mix(r, 222, ice); gg = mix(gg, 230, ice); b = mix(b, 240, ice);
      put(px, idx * 4, r, gg, b);
      const ro = mix(120, 235, Math.max(kop, ice));
      put(rough, idx * 4, ro, ro, ro);
    }
    return { barva: px, hrap: rough };
  });
}
function texOblaki(w, h) {
  return slika("oblaki" + w, function* () {
    const g = mreza(w, h), px = new Uint8ClampedArray(w * h * 4);
    for (let j = 0; j < h; j++, yield) for (let i = 0; i < w; i++) {
      const x = g.cl[j] * g.co[i], y = g.sl[j], z = g.cl[j] * g.so[i], a = Math.abs(g.lat[j]);
      const q1 = fbm(x * 2 + 1, y * 2, z * 2, 3), q2 = fbm(x * 2, y * 2 + 5, z * 2, 3);
      const c = fbm(x * 5 + q1 * 2.4, y * 8 + q2 * 2.4, z * 5 + q1 * 1.5, 7);
      const pas = 0.06 * Math.exp(-((g.lat[j] / 7) ** 2)) - 0.07 * Math.exp(-(((a - 24) / 7) ** 2)) + 0.05 * Math.exp(-(((a - 55) / 11) ** 2));
      const fine = fbm(x * 40, y * 40, z * 40, 3);
      const al = Math.pow(Math.min(1, Math.max(0, (c + pas + (fine - 0.5) * 0.12 - 0.52) * 4.2)), 1.4) * 0.95;
      put(px, (j * w + i) * 4, 255, 255, 255, al * 255);
    }
    return px;
  });
}
const MARS_TEMNO = [[10, 70, 12, 11, 0.9], [-15, 110, 10, 24, 0.6], [-24, 145, 10, 28, 0.65], [-30, -155, 8, 24, 0.55], [-25, -40, 12, 26, 0.7], [-3, 0, 5, 14, 0.8], [-8, 25, 5, 22, 0.75], [45, -30, 12, 22, 0.6], [45, 110, 10, 26, 0.35], [-60, 20, 8, 60, 0.4], [-58, 150, 7, 50, 0.35]];
const MARS_SVETLO = [[-42, 70, 9, 12, 0.6], [-50, -43, 5, 7, 0.4], [18.6, -134, 6, 6, 0.25], [25, 147, 6, 8, 0.2], [5, -105, 18, 22, 0.25]];
function texMars(w, h) {
  return slika("mars" + w, function* () {
    const g = mreza(w, h), N = w * h, vis = new Float32Array(N), px = new Uint8ClampedArray(N * 4);
    yield* kraterji(g, vis, null, Math.round(260 * (w / 512)), 23, 0.6, 7, 0.6);
    okolica(g, -42, 70, 14 * D, 1.3, (idx, x) => { vis[idx] += x < 1 ? -0.9 * (1 - x * x) : 0.2 * Math.exp(-(((x - 1) / 0.15) ** 2)); });
    okolica(g, 18.6, -134, 9 * D, 1, (idx, x) => { vis[idx] += 1.6 * Math.pow(1 - x, 1.4) - (x < 0.1 ? 0.5 : 0); });
    for (const [la, lo] of [[-8.4, -120.1], [1.5, -112.9], [11.9, -104.5]]) okolica(g, la, lo, 4 * D, 1, (idx, x) => { vis[idx] += 0.9 * (1 - x); });
    for (let k = 0; k <= 30; k++) okolica(g, -7 - k * 0.12, -92 + k * 1.4, 1.3 * D, 1, (idx, x) => { vis[idx] -= 0.5 * (1 - x * x); });
    for (let j = 0; j < h; j++, yield) for (let i = 0; i < w; i++) {
      const idx = j * w + i, x = g.cl[j] * g.co[i], y = g.sl[j], z = g.cl[j] * g.so[i], lat = g.lat[j], lon = g.lon[i];
      const n = fbm(x * 3, y * 3, z * 3, 5), d = fbm(x * 14, y * 14, z * 14, 3);
      let t = 0;
      for (const [la, lo, rl, ro, s] of MARS_TEMNO) {
        let dl = Math.abs(lon - lo); if (dl > 180) dl = 360 - dl;
        t = Math.max(t, s * Math.exp(-(((lat - la) / rl) ** 2) - ((dl / ro) ** 2)));
      }
      t = sm(0.12, 0.6, t + (n - 0.5) * 0.55);
      let s = 0;
      for (const [la, lo, rl, ro, k] of MARS_SVETLO) { let dl = Math.abs(lon - lo); if (dl > 180) dl = 360 - dl; s = Math.max(s, k * Math.exp(-(((lat - la) / rl) ** 2) - ((dl / ro) ** 2))); }
      let vm = 0; if (lat < -4 && lat > -14 && lon > -95 && lon < -45) vm = 0.5 * sm(0.4, 0.9, 1 - Math.abs(lat + 7 + (lon + 92) * 0.09) / 2.5);
      const v = 0.9 + 0.2 * (d - 0.5);
      let r = mix(200, 92, t) * v, gg = mix(106, 54, t) * v, b = mix(62, 42, t) * v;
      r = mix(r, 222, s); gg = mix(gg, 150, s); b = mix(b, 104, s);
      r = mix(r, 90, vm); gg = mix(gg, 50, vm); b = mix(b, 40, vm);
      const cap = Math.max(sm(78, 83, lat + (d - 0.5) * 6), sm(81, 86, -lat + (d - 0.5) * 6 + 2 * Math.cos((lon + 40) * D)));
      r = mix(r, 240, cap); gg = mix(gg, 238, cap); b = mix(b, 236, cap);
      put(px, idx * 4, r, gg, b);
    }
    return { barva: px, bump: sivine(vis, w, h) };
  });
}
// Maria (selenographic lat, lon, N–S and E–W half-widths in degrees, darkness): sizes from the IAU/USGS mare diameters;
// overlapping blobs add up, so Imbrium–Procellarum and Serenitatis–Tranquillitatis–Fecunditatis join as on the real Moon.
const MORJA = [
  [33, -16, 15, 17, 1], [38, -24, 8, 8, 0.6], [24, -56, 15, 11, 1], [8, -55, 12, 9, 1], [-4, -44, 9, 9, 0.9], [36, -48, 9, 9, 0.8],
  [16, -40, 9, 9, 0.8], [28, 17.5, 10, 10, 1], [8.5, 31, 9, 12, 1.05], [3, 24, 5, 6, 0.8], [17, 59, 7, 8.5, 1.1],
  [-7.8, 51.3, 11, 7, 0.9], [-1, 45, 5, 5, 0.6], [-15.2, 35.5, 5, 5, 1], [-21, -17, 10, 10, 0.9], [-24.4, -38.6, 6, 6, 1],
  [56, 2, 4.5, 28, 0.85], [53, -35, 5, 12, 0.6], [13.3, 3.6, 4, 4, 0.9], [7.5, -30.9, 6, 7, 0.8], [-10, -23, 4.5, 5, 0.8],
  [2.4, 1.7, 3, 4, 0.7], [1.3, 87, 4.5, 4, 0.9], [13, 86, 4, 4, 0.8], [-39, 93, 6, 7, 0.6], [27, 148, 4, 4, 0.9],
  [-19, -93, 3.5, 3.5, 0.9], [-34, 163, 3, 3, 0.7], [4, 66.5, 4, 3, 0.75], [44, 27, 4, 7, 0.6],
];
function texLuna(w, h) {
  return slika("luna" + w, function* () {
    const g = mreza(w, h), N = w * h, vis = new Float32Array(N), sv = new Float32Array(N), px = new Uint8ClampedArray(N * 4);
    yield* kraterji(g, vis, sv, Math.round(900 * (w / 512)), 5, 0.4, 9, 1);
    for (let i = 0; i < N; i++) sv[i] *= 0.5; // ejecta halos of ordinary craters stay faint
    // young rayed craters: Tycho, Copernicus, Kepler, Aristarchus (bright halo, thin rays fading outwards)
    const zarki = [[-43.3, -11.2, 1.5, 28, 1], [9.6, -20.1, 1.6, 16, 0.8], [8.1, -38, 0.9, 10, 0.6], [23.7, -47.4, 0.7, 7, 0.6]];
    for (const [la, lo, rr, ext, moc] of zarki) {
      okolica(g, la, lo, rr * D, 1.6, (idx, x) => { vis[idx] += x < 1 ? -1.2 * (1 - x * x) : 0.35 * Math.exp(-(((x - 1) / 0.2) ** 2)); });
      const c = smer(la, lo), seme = la * 13 + lo;
      okolica(g, la, lo, ext * D, 1, (idx, x) => {
        const j = Math.floor(idx / g.w), i = idx % g.w;
        const bx = g.cl[j] * g.co[i] - c[0], by = g.sl[j] - c[1], bz = g.cl[j] * g.so[i] - c[2];
        const kot = Math.atan2(by, bx * Math.sin(lo * D) - bz * Math.cos(lo * D));
        const ray = sm(0.6, 0.85, vn(Math.cos(kot) * 14 + seme, Math.sin(kot) * 14, x * 3));
        sv[idx] += moc * (ray * 0.17 * (1 - x) * sm(0.04, 0.12, x) + 0.2 * Math.exp(-x * x * 140));
      });
    }
    for (let j = 0; j < h; j++, yield) for (let i = 0; i < w; i++) {
      const idx = j * w + i, x = g.cl[j] * g.co[i], y = g.sl[j], z = g.cl[j] * g.so[i], lat = g.lat[j], lon = g.lon[i];
      const n = fbm(x * 4, y * 4, z * 4, 5), d = fbm(x * 16, y * 16, z * 16, 3), n9 = fbm(x * 9 + 2, y * 9, z * 9, 4);
      let m = 0;
      for (const [la, lo, rl, ro, k] of MORJA) {
        let dl = Math.abs(lon - lo); if (dl > 180) dl = 360 - dl;
        const a = (lat - la) / rl, b = (dl * Math.cos(((lat + la) / 2) * D)) / ro;
        if (a * a + b * b < 9) m += k * Math.exp(-a * a - b * b);
      }
      const mm = m + (n - 0.5) * 0.4 + (n9 - 0.5) * 0.35;
      const mare = sm(0.38, 0.5, mm), notr = sm(0.5, 1.1, mm); // edge of the mare; deeper inside it is darker
      let spa = Math.abs(lon + 169); if (spa > 180) spa = 360 - spa;
      const sp = 0.2 * Math.exp(-(((lat + 53) / 22) ** 2) - ((spa / 30) ** 2)); // South Pole–Aitken basin
      const hl = 0.78 + 0.12 * (d - 0.5) + 0.1 * (n - 0.5) - sp;
      const ma = 0.44 - 0.07 * notr + 0.07 * (d - 0.5) + 0.06 * (n9 - 0.5) + 0.05 * (fbm(x * 30, y * 30, z * 30, 2) - 0.5);
      const v = mix(hl, ma, mare) + sv[idx] * (1 - 0.4 * mare);
      // highlands slightly warm, maria slightly cool (titanium-rich basalts look bluish)
      put(px, idx * 4, mix(232, 214, mare) * v, mix(228, 216, mare) * v, mix(220, 224, mare) * v);
      vis[idx] -= mare * 0.18;
    }
    return { barva: px, bump: sivine(vis, w, h) };
  });
}
// Gas giants: colour bands by latitude, turbulence by noise on a cylinder (stretched along longitude).
function* plinasti(w, h, pasovi, opt) {
  const g = mreza(w, h), px = new Uint8ClampedArray(w * h * 4), c = [0, 0, 0];
  for (let j = 0; j < h; j++, yield) for (let i = 0; i < w; i++) {
    const lat = g.lat[j], lon = g.lon[i], lr = lat * D, co = g.co[i], so = g.so[i];
    let su = 0, sv = 0; // swirl offset (deg) around the big storm
    let pega = 0, rob = 0;
    if (opt.pega) {
      const [pla, plo, ax, ay] = opt.pega;
      let dx = lon - plo; if (dx > 180) dx -= 360; if (dx < -180) dx += 360;
      const ex = dx / ax, ey = (lat - pla) / ay, rho = Math.hypot(ex, ey);
      if (rho < 2.6) {
        const kot = 2.2 * Math.pow(1 - rho / 2.6, 2), ck = Math.cos(kot), sk = Math.sin(kot);
        su = (ex * ck - ey * sk) * ax - dx; sv = (ex * sk + ey * ck) * ay - (lat - pla);
      }
      pega = 1 - sm(0.82, 1.0, rho); rob = Math.exp(-(((rho - 1.12) / 0.16) ** 2));
    }
    const la2 = lat + sv, lo2 = (lon + su) * D;
    const tur = fbm(Math.cos(lo2) * opt.k, Math.sin(lo2) * opt.k, la2 * D * opt.k * 6, 4);
    const str = fbm(Math.cos(lo2) * 3 + 9, Math.sin(lo2) * 3, la2 * D * 60, 3);
    const tur2 = fbm(Math.cos(lo2) * opt.k * 4 + 3, Math.sin(lo2) * opt.k * 4, la2 * D * opt.k * 16, 2);
    const latW = la2 + (tur - 0.5) * opt.mesaj + (tur2 - 0.5) * opt.mesaj * 0.6;
    lerpStops(pasovi, latW, c);
    let v = 1 + (str - 0.5) * opt.proge + (tur - 0.5) * opt.kontrast + (tur2 - 0.5) * opt.kontrast;
    let r = c[0] * v, gg = c[1] * v, b = c[2] * v;
    if (opt.pega) {
      const pc = opt.pegaBarva, jedro = 0.8 + 0.25 * fbm(Math.cos(lo2) * 30, Math.sin(lo2) * 30, la2 * D * 30, 3);
      r = mix(r, opt.robBarva[0], rob * 0.7); gg = mix(gg, opt.robBarva[1], rob * 0.7); b = mix(b, opt.robBarva[2], rob * 0.7);
      r = mix(r, pc[0] * jedro, pega); gg = mix(gg, pc[1] * jedro, pega); b = mix(b, pc[2] * jedro, pega);
    }
    if (opt.ovali) for (const [ola, olo, orr, oc] of opt.ovali) {
      let dx = lon - olo; if (dx > 180) dx -= 360; if (dx < -180) dx += 360;
      const q = 1 - sm(0.6, 1, Math.hypot(dx / (orr * 1.5), (lat - ola) / orr));
      r = mix(r, oc[0], q); gg = mix(gg, oc[1], q); b = mix(b, oc[2], q);
    }
    if (opt.festoni && lat > 1 && lat < 9) {
      const f = sm(0.58, 0.85, vn(Math.cos(lo2) * 7, Math.sin(lo2) * 7, la2 * 0.45 + (tur - 0.5) * 2)) * sm(1, 4, lat) * (1 - sm(6.5, 9, lat));
      r = mix(r, 150, f * 0.3); gg = mix(gg, 138, f * 0.3); b = mix(b, 140, f * 0.3);
    }
    put(px, (j * w + i) * 4, r, gg, b);
  }
  return px;
}
const JUPITER_PASOVI = [[-90, 128, 118, 108], [-60, 160, 146, 128], [-48, 196, 180, 158], [-41, 176, 150, 122], [-37, 226, 214, 194], [-33, 170, 128, 96], [-29, 168, 126, 94], [-26, 236, 224, 202], [-20, 226, 206, 176], [-18, 172, 116, 80], [-11, 158, 102, 70], [-7.5, 196, 150, 110], [-4.5, 238, 222, 192], [0, 226, 198, 156], [4.5, 238, 222, 192], [7.5, 196, 156, 116], [10, 162, 106, 72], [16, 150, 98, 68], [18, 232, 220, 198], [23, 234, 222, 200], [26, 160, 116, 86], [30, 166, 124, 94], [33, 226, 212, 190], [40, 172, 142, 112], [47, 198, 182, 160], [60, 160, 146, 128], [90, 128, 118, 108]];
const SATURN_PASOVI = [[-90, 150, 146, 128], [-60, 184, 168, 132], [-45, 212, 192, 148], [-35, 196, 172, 124], [-25, 222, 200, 152], [-18, 206, 178, 128], [-10, 230, 208, 160], [0, 238, 220, 172], [10, 230, 208, 160], [18, 204, 176, 126], [25, 220, 198, 150], [35, 194, 170, 122], [45, 206, 186, 142], [60, 170, 160, 132], [75, 140, 146, 140], [90, 120, 130, 132]];
const URAN_PASOVI = [[-90, 196, 236, 240], [-50, 176, 226, 232], [-20, 160, 214, 224], [0, 152, 208, 220], [20, 158, 212, 222], [50, 166, 218, 228], [90, 180, 226, 234]];
const NEPTUN_PASOVI = [[-90, 74, 104, 196], [-60, 66, 98, 206], [-45, 84, 122, 222], [-30, 54, 86, 196], [-20, 50, 82, 190], [-10, 62, 98, 210], [0, 66, 104, 214], [20, 60, 96, 208], [40, 72, 110, 216], [60, 64, 96, 200], [90, 70, 100, 190]];
const texJupiter = (w, h) => slika("jupiter" + w, () => plinasti(w, h, JUPITER_PASOVI, { k: 3.5, mesaj: 3.2, proge: 0.22, kontrast: 0.12, pega: [-22.5, 40, 7, 4.6], pegaBarva: [206, 108, 72], robBarva: [240, 222, 196], festoni: true, ovali: [[-33, -60, 1.6, [244, 238, 226]], [-33, -20, 1.4, [240, 234, 222]], [-33, 100, 1.5, [244, 238, 226]], [40, 160, 1.2, [236, 228, 214]]] }));
const texSaturn = (w, h) => slika("saturn" + w, () => plinasti(w, h, SATURN_PASOVI, { k: 2.5, mesaj: 1.6, proge: 0.12, kontrast: 0.05 }));
const texUran = (w, h) => slika("uran" + w, () => plinasti(w, h, URAN_PASOVI, { k: 2, mesaj: 1.5, proge: 0.035, kontrast: 0.03 }));
const texNeptun = (w, h) => slika("neptun" + w, () => plinasti(w, h, NEPTUN_PASOVI, { k: 3, mesaj: 3, proge: 0.12, kontrast: 0.08, pega: [-22, 60, 11, 6], pegaBarva: [28, 42, 112], robBarva: [70, 108, 210], ovali: [[-27, 80, 1.6, [230, 238, 255]], [-42, -40, 1.2, [210, 224, 255]], [28, 150, 1.0, [220, 232, 255]]] }));
function texPluton(w, h) {
  return slika("pluton" + w, function* () {
    const g = mreza(w, h), N = w * h, vis = new Float32Array(N), px = new Uint8ClampedArray(N * 4);
    yield* kraterji(g, vis, null, Math.round(120 * (w / 256)), 31, 0.8, 6, 0.6);
    for (let j = 0; j < h; j++, yield) for (let i = 0; i < w; i++) {
      const idx = j * w + i, x = g.cl[j] * g.co[i], y = g.sl[j], z = g.cl[j] * g.so[i], lat = g.lat[j], lon = g.lon[i];
      const n = fbm(x * 4, y * 4, z * 4, 5);
      const dist = (la, lo, rl, ro) => { let dl = Math.abs(lon - lo); if (dl > 180) dl = 360 - dl; return Math.hypot((lat - la) / rl, dl / ro); };
      const srce = Math.max(1 - sm(0.75, 1, dist(22, 175, 20, 17)), 1 - sm(0.75, 1, dist(4, -158, 22, 22)), 1 - sm(0.6, 1, dist(-12, 180, 10, 12)));
      const cth = sm(0.4, 0.7, Math.exp(-(((lat + 5) / 16) ** 2) - (((lon - 100) / 50) ** 2)) + (n - 0.5) * 0.5);
      const v = 0.9 + 0.25 * (n - 0.5);
      let r = 196 * v, gg = 160 * v, b = 128 * v;
      r = mix(r, 92, cth); gg = mix(gg, 54, cth); b = mix(b, 40, cth);
      r = mix(r, 246, srce); gg = mix(gg, 240, srce); b = mix(b, 230, srce);
      if (lat > 60) { const p = sm(60, 75, lat) * 0.5; r = mix(r, 176, p); gg = mix(gg, 156, p); b = mix(b, 140, p); }
      put(px, idx * 4, r, gg, b);
      if (srce > 0.5) vis[idx] = vis[idx] * 0.2 - 0.3;
    }
    return { barva: px, bump: sivine(vis, w, h) };
  });
}
// Saturn's rings as a radial profile, u = (r − 66900 km) / (140400 − 66900 km)
// Ring profile along the radius (km from Saturn's centre): opacity and colour of the D, C, B, A and F rings with the
// Maxwell gap (87 491 km), Cassini division with the Huygens gap (117 680 km), Encke (133 589 km) and Keeler gap
// (136 505 km), each about as wide as the real gap (≈ 270, 350, 325, 42 km); fine ringlets are value noise at three scales (≈ 2000, 500 and 120 km).
const OBROC_IN = 66900, OBROC_OUT = 140400;
function texObroci(w) {
  return izvedi(slika("obroci" + w, function* () {
    const px = new Uint8ClampedArray(w * 2 * 4), r = rng(3), sl = Array.from({ length: 1400 }, () => r());
    const sum = (km, l, o) => { const x = km / l + o, i = Math.floor(x), t = x - i, s = t * t * (3 - 2 * t); return mix(sl[i % 1400], sl[(i + 1) % 1400], s); };
    const vrzel = (km, c, s) => 1 - Math.exp(-(((km - c) / s) ** 2) * 4);
    for (let i = 0; i < w; i++) {
      const km = OBROC_IN + ((i + 0.5) / w) * (OBROC_OUT - OBROC_IN);
      const f = 0.5 * sum(km, 2000, 0) + 0.3 * sum(km, 500, 300) + 0.2 * sum(km, 120, 700);
      let a = 0, c = [200, 190, 170];
      if (km < 74658) { a = 0.03 + 0.03 * f; c = [140, 132, 124]; }
      else if (km < 92000) {
        const t = (km - 74658) / 17342;
        a = (0.1 + 0.16 * t + 0.14 * f) * vrzel(km, 87491, 320) + (Math.abs(km - 90200) < 300 ? 0.12 : 0);
        c = [mix(132, 160, t), mix(122, 146, t), mix(110, 126, t)];
      } else if (km < 117580) {
        const t = (km - 92000) / 25580, jedro = sm(0.08, 0.3, t) * (1 - sm(0.9, 1, t) * 0.3);
        a = Math.min(0.98, 0.62 + 0.3 * jedro + 0.16 * (f - 0.5) * (0.5 + jedro));
        const b = Math.sin(Math.min(1, t * 1.15) * Math.PI) * (0.7 + 0.6 * f);
        c = [mix(204, 240, b), mix(186, 222, b), mix(150, 182, b)];
      } else if (km < 122170) {
        a = (0.05 + 0.06 * f + (Math.abs(km - 120400) < 350 ? 0.1 : 0) + (Math.abs(km - 121700) < 300 ? 0.08 : 0)) * vrzel(km, 117680, 300);
        c = [118, 110, 102];
      } else if (km < 136775) {
        const t = (km - 122170) / 14605;
        a = (0.5 + 0.14 * f + 0.1 * sm(0.75, 0.95, t)) * vrzel(km, 133589, 390) * vrzel(km, 136505, 50) * (1 - sm(0.985, 1, t) * 0.6);
        c = [mix(206, 196, t) + 14 * (f - 0.5), mix(192, 184, t) + 12 * (f - 0.5), mix(166, 160, t) + 10 * (f - 0.5)];
      } else if (Math.abs(km - 140180) < 220) { a = 0.55 * Math.exp(-(((km - 140180) / 110) ** 2)); c = [214, 204, 190]; }
      for (const row of [0, 1]) put(px, (row * w + i) * 4, c[0], c[1], c[2], a * 255);
    }
    return px;
  }));
}

// ---------------------------------------------------------------- Kepler
function kepler(M, e) {
  let E = M + e * Math.sin(M);
  for (let k = 0; k < 7; k++) E -= (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
  return E;
}
// ecliptic (x, y, z) → three.js (x, z, −y): Y is the ecliptic north
function polVektor(ra, dec, out) {
  const x = Math.cos(dec * D) * Math.cos(ra * D), y = Math.cos(dec * D) * Math.sin(ra * D), z = Math.sin(dec * D);
  return out.set(x, -y * Math.sin(EPS) + z * Math.cos(EPS), -(y * Math.cos(EPS) + z * Math.sin(EPS)));
}
function vozelVektor(ra, out) {
  const x = -Math.sin(ra * D), y = Math.cos(ra * D);
  return out.set(x, -y * Math.sin(EPS), -(y * Math.cos(EPS)));
}

// ---------------------------------------------------------------- formatting
const stevilo = (x, d) => x.toFixed(d).replace(".", ",");
function sklon(n, f) { const k = n % 100; return k === 1 ? f[0] : k === 2 ? f[1] : k === 3 || k === 4 ? f[2] : f[3]; }
function trajanje(dni) {
  if (dni < 365.25) { const n = Math.floor(dni); return n + " " + sklon(n, ["dan", "dneva", "dnevi", "dni"]); }
  const l = dni / 365.25;
  if (l < 100) { const r = Math.round(l * 10) / 10; return Number.isInteger(r) ? r + " " + sklon(r, ["leto", "leti", "leta", "let"]) : stevilo(r, 1) + " leta"; }
  const n = Math.floor(l); return n + " " + sklon(n, ["leto", "leti", "leta", "let"]);
}

// ---------------------------------------------------------------- builder
export function zgradi(THREE, ctx) {
  const visoka = ctx.kakovost !== "nizka", gib = ctx.gibanje !== false, z0 = ctx.zacetek || {};
  const group = new THREE.Group();
  group.name = "soncni-sistem";
  const odpadki = [];
  const hrani = (x) => (odpadki.push(x), x);
  const T = (n) => (visoka ? n : n / 2);

  // Planets: lit only by the Sun's point light and a faint ambient fill (the kit's studio lights are off, luci: false).
  const snovSonca = (o) => hrani(new THREE.MeshStandardMaterial({ roughness: 0.92, metalness: 0, ...o }));
  function tekstura(px, w, h, barvna = true) {
    const cv = document.createElement("canvas");
    cv.width = w; cv.height = h;
    const c2 = cv.getContext("2d");
    const img = c2.createImageData(w, h);
    img.data.set(px);
    c2.putImageData(img, 0, 0);
    const t = hrani(new THREE.CanvasTexture(cv));
    if (barvna) t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = THREE.RepeatWrapping;
    t.anisotropy = 4;
    return t;
  }
  const geoVisoka = hrani(new THREE.SphereGeometry(1, T(96), T(64)));
  const geoSrednja = hrani(new THREE.SphereGeometry(1, T(64), T(40)));
  const geoNizka = hrani(new THREE.SphereGeometry(1, T(40), T(24)));

  const W1 = visoka ? 1024 : 512, W2 = visoka ? 512 : 256, W3 = visoka ? 256 : 128;
  const nacin0 = NACINI.includes(z0.merilo) ? z0.merilo : "pregledno";
  let nacin = nacin0;

  // ---- Sun
  const sun = new THREE.PointLight(0xfff2dc, 3.4, 0, 0);
  group.add(sun, new THREE.AmbientLight(0xb4c2de, 0.22));
  // Textures start at a quarter of their size (fast first frame) and are replaced by full-size ones in time slices.
  const naloge = [];
  function postopna(gen, izbor, w, barvna, nastavi, prednost = false) {
    const w0 = Math.max(64, w / 4);
    let t = tekstura(izbor(izvedi(gen(w0, w0 / 2))), w0, w0 / 2, barvna);
    if (w0 < w) naloge[prednost ? "unshift" : "push"](function* () {
      const v = yield* gen(w, w / 2);
      const n = tekstura(izbor(v), w, w / 2, barvna);
      nastavi(n); t.dispose(); t = n;
    });
    return t;
  }
  const sam = (v) => v, barvaOd = (v) => v.barva, bumpOd = (v) => v.bump;
  const sTex = postopna(texSonce, sam, W2, false, (t) => { sMat.uniforms.map.value = t; });
  const sMat = hrani(new THREE.ShaderMaterial({
    uniforms: { map: { value: sTex }, uTime: { value: 0 } },
    vertexShader: "varying vec2 vUv; varying vec3 vN; varying vec3 vV; void main(){ vUv = uv; vN = normalMatrix * normal; vec4 mv = modelViewMatrix * vec4(position, 1.0); vV = mv.xyz; gl_Position = projectionMatrix * mv; }",
    fragmentShader: `uniform sampler2D map; uniform float uTime; varying vec2 vUv; varying vec3 vN; varying vec3 vV;
      void main(){
        float mu = clamp(dot(normalize(vN), normalize(-vV)), 0.0, 1.0);
        vec4 a = texture2D(map, vUv);
        float b = texture2D(map, vUv + vec2(0.0123 + uTime * 0.0009, 0.0071)).r;
        float g = mix(a.r, b, 0.5 + 0.5 * sin(uTime * 0.7));
        float limb = 1.0 - 0.6 * (1.0 - pow(mu, 0.85));
        vec3 hot = vec3(1.0, 0.79, 0.4), warm = vec3(1.0, 0.52, 0.13), deep = vec3(0.75, 0.2, 0.03);
        vec3 col = mix(warm, hot, smoothstep(0.05, 0.9, mu));
        col = mix(deep, col, smoothstep(0.0, 0.3, mu));
        float I = limb * (0.8 + 0.3 * g) * a.g + a.b * (1.0 - mu) * 0.45;
        gl_FragColor = vec4(min(col * I * 1.08, vec3(1.0)), 1.0);
        #include <colorspace_fragment>
      }`,
    toneMapped: false,
  }));
  const sonce = {
    id: "sonce", R: SONCE_R, pivot: new THREE.Group(), axis: new THREE.Group(),
    mesh: new THREE.Mesh(geoVisoka, sMat), W0: 84.176, Wd: 14.1844, rot: 609.12, barva: "#ffc35a", au: new THREE.Vector3(),
  };
  polVektor(286.13, 63.87, (sonce.pol = new THREE.Vector3()));
  sonce.axis.add(sonce.mesh); sonce.pivot.add(sonce.axis); group.add(sonce.pivot);
  // glow: two additive sprites
  const sijTex = (() => {
    const cv = document.createElement("canvas"); cv.width = cv.height = 256;
    const c2 = cv.getContext("2d"), gr = c2.createRadialGradient(128, 128, 0, 128, 128, 128);
    [[0, "rgba(255,236,190,1)"], [0.18, "rgba(255,214,140,0.85)"], [0.32, "rgba(255,170,80,0.32)"], [0.55, "rgba(255,130,50,0.1)"], [1, "rgba(255,110,40,0)"]].forEach(([o, c]) => gr.addColorStop(o, c));
    c2.fillStyle = gr; c2.fillRect(0, 0, 256, 256);
    const t = hrani(new THREE.CanvasTexture(cv)); t.colorSpace = THREE.SRGBColorSpace; return t;
  })();
  const sij = [0.9, 0.35].map((op) => {
    const s = new THREE.Sprite(hrani(new THREE.SpriteMaterial({ map: sijTex, color: 0xffffff, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false })));
    s.renderOrder = 2; sonce.pivot.add(s); return s;
  });
  // corona streamers turn slowly with the Sun's own time (still when motion is reduced)
  const korTex = hrani(new THREE.CanvasTexture(platnoKorone())); korTex.colorSpace = THREE.SRGBColorSpace;
  const korona = new THREE.Sprite(hrani(new THREE.SpriteMaterial({ map: korTex, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false })));
  korona.renderOrder = 2; sonce.pivot.add(korona);
  korona.onBeforeRender = () => { korona.material.rotation = sMat.uniforms.uTime.value * 0.006; };

  // ---- planets
  const kamniti = { merkur: [texMerkur, W2], mars: [texMars, W2], luna: [texLuna, W2], pluton: [texPluton, W3] };
  function material(id) {
    let m;
    if (id === "zemlja") {
      m = snovSonca({ roughness: 1,
        map: postopna(texZemlja, barvaOd, W1, true, (t) => { m.map = t; }, true),
        roughnessMap: postopna(texZemlja, (v) => v.hrap, W1, false, (t) => { m.roughnessMap = t; }, true) });
      return m;
    }
    if (kamniti[id]) {
      const [gen, w] = kamniti[id];
      m = snovSonca({ bumpScale: 1,
        map: postopna(gen, barvaOd, w, true, (t) => { m.map = t; }),
        bumpMap: postopna(gen, bumpOd, w, false, (t) => { m.bumpMap = t; }) });
      return m;
    }
    const [gen, w] = { venera: [texVenera, W2], jupiter: [texJupiter, W1], saturn: [texSaturn, W2], uran: [texUran, W3], neptun: [texNeptun, W2] }[id];
    m = snovSonca({ roughness: 0.85, map: postopna(gen, sam, w, true, (t) => { m.map = t; }) });
    return m;
  }
  const telesa = [sonce];
  for (const p of PLANETI) {
    const [id, ime, a, e, inc, L, wbar, Om, P, R, ra, dec, W0, Wd, rot, barva] = p;
    const om = (wbar - Om) * D, O = Om * D, I = inc * D;
    const co = Math.cos(om), so = Math.sin(om), cO = Math.cos(O), sO = Math.sin(O), ci = Math.cos(I), si = Math.sin(I);
    const Pe = [co * cO - so * sO * ci, co * sO + so * cO * ci, so * si], Qe = [-so * cO - co * sO * ci, -so * sO + co * cO * ci, co * si];
    const b = {
      id, ime, a, e, L, wbar, P, R, W0, Wd, rot, barva,
      Pv: new THREE.Vector3(Pe[0], Pe[2], -Pe[1]), Qv: new THREE.Vector3(Qe[0], Qe[2], -Qe[1]),
      pivot: new THREE.Group(), axis: new THREE.Group(),
      mesh: new THREE.Mesh(id === "zemlja" || id === "jupiter" || id === "saturn" ? geoVisoka : id === "pluton" ? geoNizka : geoSrednja, material(id)),
      au: new THREE.Vector3(), pol: new THREE.Vector3(),
    };
    polVektor(ra, dec, b.pol);
    b.axis.add(b.mesh); b.pivot.add(b.axis); group.add(b.pivot);
    telesa.push(b);
  }
  const T_ = Object.fromEntries(telesa.map((b) => [b.id, b]));
  // axis frames: local Y = north pole, local X = node of the equator (W = 0 meridian)
  {
    const X = new THREE.Vector3(), Z = new THREE.Vector3(), m = new THREE.Matrix4();
    const ra = { sonce: 286.13 }; for (const p of PLANETI) ra[p[0]] = p[10];
    for (const b of telesa) {
      vozelVektor(ra[b.id], X); X.addScaledVector(b.pol, -X.dot(b.pol)).normalize();
      Z.crossVectors(X, b.pol);
      m.makeBasis(X, b.pol, Z); b.axis.quaternion.setFromRotationMatrix(m);
    }
  }
  // Earth extras: clouds + atmosphere rim
  const zem = T_.zemlja;
  const oblakiMat = snovSonca({ map: postopna(texOblaki, sam, W2, true, (t) => { oblakiMat.map = t; }), transparent: true, depthWrite: false, roughness: 1 });
  const oblaki = new THREE.Mesh(geoSrednja, oblakiMat);
  oblaki.scale.setScalar(1.012); zem.axis.add(oblaki);
  const atmU = { uSun: { value: new THREE.Vector3() } };
  const atm = new THREE.Mesh(geoNizka, hrani(new THREE.ShaderMaterial({
    uniforms: atmU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: "varying vec3 vN; varying vec3 vP; void main(){ vN = normalize(mat3(modelMatrix) * normal); vec4 w = modelMatrix * vec4(position, 1.0); vP = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",
    fragmentShader: `uniform vec3 uSun; varying vec3 vN; varying vec3 vP;
      void main(){ vec3 n = normalize(vN), v = normalize(cameraPosition - vP), l = normalize(uSun - vP);
        float f = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 2.6); float day = smoothstep(-0.25, 0.45, dot(n, l));
        gl_FragColor = vec4(vec3(0.3, 0.55, 1.0) * f * day * 0.9, 1.0);
        #include <colorspace_fragment>
      }`,
  })));
  atm.scale.setScalar(1.03); atm.renderOrder = 3; zem.axis.add(atm);
  atm.onBeforeRender = () => { atmU.uSun.value.setFromMatrixPosition(group.matrixWorld); };
  // Saturn's rings (radii in Saturn radii; ring plane = Saturn's equator)
  const sat = T_.saturn;
  const ringGeo = hrani(new THREE.RingGeometry(OBROC_IN / 60268, OBROC_OUT / 60268, T(160), 1));
  {
    const pos = ringGeo.attributes.position, uv = ringGeo.attributes.uv;
    for (let i = 0; i < pos.count; i++) { const r = Math.hypot(pos.getX(i), pos.getY(i)); uv.setXY(i, (r - OBROC_IN / 60268) / ((OBROC_OUT - OBROC_IN) / 60268), 0.5); }
    ringGeo.rotateX(-Math.PI / 2);
  }
  // Rings scatter like a cloud of ice grains: still bright at grazing sunlight, dimmer from the unlit side,
  // and Saturn casts its shadow on them.
  const ringU = { map: { value: tekstura(texObroci(2 * W1), 2 * W1, 2) }, uSun: { value: new THREE.Vector3() }, uSat: { value: new THREE.Vector3() }, uR: { value: 0 } };
  const obroci = new THREE.Mesh(ringGeo, hrani(new THREE.ShaderMaterial({
    uniforms: ringU, transparent: true, side: THREE.DoubleSide, depthWrite: false,
    vertexShader: "varying vec2 vUv; varying vec3 vP; varying vec3 vN; void main(){ vUv = uv; vec4 w = modelMatrix * vec4(position, 1.0); vP = w.xyz; vN = normalize(mat3(modelMatrix) * vec3(0.0, 1.0, 0.0)); gl_Position = projectionMatrix * viewMatrix * w; }",
    fragmentShader: `uniform sampler2D map; uniform vec3 uSun; uniform vec3 uSat; uniform float uR; varying vec2 vUv; varying vec3 vP; varying vec3 vN;
      void main(){
        vec4 t = texture2D(map, vUv);
        if (t.a < 0.01) discard;
        vec3 l = normalize(uSun - vP), v = normalize(cameraPosition - vP);
        float nl = dot(vN, l), nv = dot(vN, v);
        float same = step(0.0, nl * nv);
        float k = mix(0.12 + 0.4 * (1.0 - t.a), 1.0, same) * (0.35 + 0.65 * pow(abs(nl), 0.35));
        vec3 cp = vP - uSat; float along = dot(cp, l);
        float sh = along < 0.0 ? smoothstep(uR * 0.97, uR * 1.03, length(cp - along * l)) : 1.0;
        k *= mix(0.05, 1.0, sh);
        gl_FragColor = vec4(t.rgb * k * 1.1, t.a * mix(0.8, 1.0, same));
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  })));
  obroci.renderOrder = 1;
  obroci.onBeforeRender = () => {
    ringU.uSun.value.setFromMatrixPosition(group.matrixWorld);
    ringU.uSat.value.setFromMatrixPosition(sat.axis.matrixWorld);
    ringU.uR.value = vel(sat) * group.matrixWorld.getMaxScaleOnAxis();
  };
  sat.axis.add(obroci);
  // Moon
  const luna = {
    id: "luna", R: LUNA_R, barva: "#c9c6bf", pivot: new THREE.Group(), axis: new THREE.Group(),
    mesh: new THREE.Mesh(geoSrednja, material("luna")), au: new THREE.Vector3(),
  };
  luna.axis.add(luna.mesh); luna.pivot.add(luna.axis); group.add(luna.pivot);
  telesa.push(luna); T_.luna = luna;
  const lunaTir = new THREE.Line(hrani(new THREE.BufferGeometry()), hrani(new THREE.LineBasicMaterial({ color: 0x9aa6bf, transparent: true, opacity: 0.45, depthWrite: false })));
  {
    const n = T(96), arr = new Float32Array((n + 1) * 3), e = 0.0549;
    for (let k = 0; k <= n; k++) { const E = (k / n) * 2 * Math.PI; arr[k * 3] = Math.cos(E) - e; arr[k * 3 + 2] = -Math.sqrt(1 - e * e) * Math.sin(E); }
    lunaTir.geometry.setAttribute("position", new THREE.BufferAttribute(arr, 3));
  }
  zem.pivot.add(lunaTir);

  // ---- orbits: one LineSegments for the eight planets, a dashed one for Pluto
  const SEG = T(256);
  const planeti = telesa.filter((b) => b.Pv && b.id !== "pluton");
  const tirGeo = hrani(new THREE.BufferGeometry());
  tirGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(planeti.length * SEG * 6), 3));
  tirGeo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(planeti.length * SEG * 6), 3));
  const tirnice = new THREE.LineSegments(tirGeo, hrani(new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.6, depthWrite: false })));
  group.add(tirnice);
  const plGeo = hrani(new THREE.BufferGeometry());
  plGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(SEG * 6), 3));
  const plTir = new THREE.LineSegments(plGeo, hrani(new THREE.LineDashedMaterial({ color: 0xc8b39e, dashSize: 0.012, gapSize: 0.01, transparent: true, opacity: 0.55, depthWrite: false })));
  group.add(plTir);
  // axes of rotation (one LineSegments)
  const osGeo = hrani(new THREE.BufferGeometry());
  osGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(10 * 6), 3));
  const osi = new THREE.LineSegments(osGeo, hrani(new THREE.LineBasicMaterial({ color: 0xc8d4ee, transparent: true, opacity: 0.5, depthWrite: false })));
  osi.frustumCulled = false;
  group.add(osi);

  // ---- belts and dots (one shader for all points; size in CSS px)
  const tockeU = { uPR: { value: 1 } };
  const tockeMat = hrani(new THREE.ShaderMaterial({
    uniforms: tockeU, transparent: true, depthWrite: false,
    vertexShader: "attribute float velikost; attribute vec3 barva; uniform float uPR; varying vec3 vC; void main(){ vC = barva; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mv; gl_PointSize = velikost * uPR; }",
    fragmentShader: "varying vec3 vC; void main(){ float d = length(gl_PointCoord - 0.5) * 2.0; if (d > 1.0) discard; float a = 1.0 - smoothstep(0.65, 1.0, d); gl_FragColor = vec4(mix(vC, vec3(1.0), (1.0 - smoothstep(0.0, 0.5, d)) * 0.3), a);\n#include <colorspace_fragment>\n}",
  }));
  function pas(n, seed, aMin, aMax, eMax, iMax, vel, barva, vrzeli) {
    const r = rng(seed), au = new Float32Array(n * 3), c = new THREE.Color(barva), col = new Float32Array(n * 3), sz = new Float32Array(n);
    for (let k = 0; k < n; k++) {
      let a;
      do { a = aMin + (aMax - aMin) * Math.pow(r(), 0.8); } while (vrzeli.some((v) => Math.abs(a - v) < 0.035) && r() < 0.92);
      const e = r() * eMax, I = (r() * r() * iMax) * D, O = r() * 2 * Math.PI, w = r() * 2 * Math.PI, E = kepler(r() * 2 * Math.PI, e);
      const xp = a * (Math.cos(E) - e), yp = a * Math.sqrt(1 - e * e) * Math.sin(E);
      const cw = Math.cos(w), sw = Math.sin(w), cO = Math.cos(O), sO = Math.sin(O), ci = Math.cos(I), si = Math.sin(I);
      const x = (cw * cO - sw * sO * ci) * xp + (-sw * cO - cw * sO * ci) * yp, y = (cw * sO + sw * cO * ci) * xp + (-sw * sO + cw * cO * ci) * yp, z = sw * si * xp + cw * si * yp;
      au[k * 3] = x; au[k * 3 + 1] = z; au[k * 3 + 2] = -y;
      const v = 0.3 + 0.5 * r(); col[k * 3] = c.r * v; col[k * 3 + 1] = c.g * v; col[k * 3 + 2] = c.b * v; sz[k] = vel * (0.7 + 0.8 * r());
    }
    const geo = hrani(new THREE.BufferGeometry());
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    geo.setAttribute("barva", new THREE.BufferAttribute(col, 3));
    geo.setAttribute("velikost", new THREE.BufferAttribute(sz, 1));
    const pts = new THREE.Points(geo, tockeMat);
    pts.userData.au = au; pts.frustumCulled = false;
    group.add(pts);
    return pts;
  }
  const asteroidi = pas(visoka ? 2200 : 1100, 41, 2.1, 3.3, 0.16, 16, 1.25, "#c2b6a2", [2.5, 2.82, 2.95]);
  const kuiper = pas(visoka ? 1500 : 700, 43, 39.3, 48, 0.12, 14, 1.2, "#9fb4dc", []);
  // dots for »Resnične razdalje« (Sun + planets); this object also places and declutters the labels each frame
  const pike = telesa.filter((b) => b.id !== "luna");
  const pikeGeo = hrani(new THREE.BufferGeometry());
  pikeGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pike.length * 3), 3));
  pikeGeo.setAttribute("barva", new THREE.BufferAttribute(new Float32Array(pike.flatMap((b) => new THREE.Color(b.barva).toArray())), 3));
  pikeGeo.setAttribute("velikost", new THREE.BufferAttribute(new Float32Array(pike.map((b) => (b.id === "sonce" ? 13 : 8))), 1));
  const pikeObj = new THREE.Points(pikeGeo, tockeMat);
  pikeObj.frustumCulled = false; pikeObj.renderOrder = -100;
  group.add(pikeObj);

  // ---- labels
  const ime = (b) => (b.ime || OPISI[b.id][0]);
  const PRIORITETA = ["sonce", "jupiter", "saturn", "zemlja", "uran", "neptun", "mars", "venera", "merkur", "pluton", "luna", "asteroidi", "kuiper"];
  const LABEL_H = 0.021;
  const napisi = {};
  for (const id of PRIORITETA) {
    const b = T_[id];
    const tekst = b ? ime(b) : OPISI[id][0], barva = b ? b.barva : OPISI[id][1];
    const cv = document.createElement("canvas"), c2 = cv.getContext("2d");
    const font = '600 30px "Instrument Sans", system-ui, sans-serif';
    c2.font = font;
    const tw = Math.ceil(c2.measureText(tekst).width), H = 48, Wc = tw + 30 + 26;
    cv.width = Wc; cv.height = H;
    c2.font = font;
    c2.fillStyle = "rgba(11,15,22,0.72)";
    c2.beginPath(); c2.moveTo(H / 2, 2); c2.lineTo(Wc - H / 2, 2); c2.arc(Wc - H / 2, H / 2, H / 2 - 2, -Math.PI / 2, Math.PI / 2); c2.lineTo(H / 2, H - 2); c2.arc(H / 2, H / 2, H / 2 - 2, Math.PI / 2, (3 * Math.PI) / 2); c2.fill();
    c2.strokeStyle = "rgba(154,166,191,0.35)"; c2.lineWidth = 2; c2.stroke();
    c2.fillStyle = barva; c2.beginPath(); c2.arc(22, H / 2, 7, 0, 2 * Math.PI); c2.fill();
    c2.fillStyle = "#e8edf7"; c2.textBaseline = "middle"; c2.fillText(tekst, 36, H / 2 + 1);
    const t = hrani(new THREE.CanvasTexture(cv)); t.colorSpace = THREE.SRGBColorSpace;
    const s = new THREE.Sprite(hrani(new THREE.SpriteMaterial({ map: t, transparent: true, depthTest: false, depthWrite: false, sizeAttenuation: false })));
    s.center.set(0.5, id === "sonce" ? 1 : 0); s.scale.set((LABEL_H * Wc) / H, LABEL_H, 1); s.renderOrder = 20;
    s.userData = { id, op: 1, vkljucen: true };
    group.add(s); napisi[id] = s;
  }
  const BELT_SMER = { asteroidi: new THREE.Vector3(-0.42, 0, 0.91).normalize(), kuiper: new THREE.Vector3(-0.8, 0, -0.6).normalize() };
  const pasBaza = { asteroidi: new THREE.Vector3(), kuiper: new THREE.Vector3() };
  const beltR = (id) => RAZDALJA[nacin](id === "asteroidi" ? 2.75 : 44);

  // ---- state and update
  const d0 = (Date.now() - J2000) / 864e5;
  let dni = d0, hitrost = Number.isFinite(Number(z0.hitrost)) ? Math.min(4, Math.max(0, Math.round(Number(z0.hitrost)))) : 2;
  let kazTir = z0.tirnice === undefined ? true : !!z0.tirnice, kazIme = z0.imena === undefined ? true : !!z0.imena;
  let izbran = null, cas = 0;
  const v1 = new THREE.Vector3(), v2 = new THREE.Vector3(), q1 = new THREE.Quaternion(), q2 = new THREE.Quaternion(), q3 = new THREE.Quaternion();
  const YOS = new THREE.Vector3(0, 1, 0), XOS = new THREE.Vector3(1, 0, 0);
  const mapiraj = (au, out) => { const r = au.length(); return out.copy(au).multiplyScalar(RAZDALJA[nacin](r) / r); };
  const vel = (b) => VELIKOST[nacin](b.R);

  function poloziPlanet(b, d) {
    const M = ((b.L + (360 * d) / b.P - b.wbar) * D) % (2 * Math.PI), E = kepler(M, b.e);
    const xp = b.a * (Math.cos(E) - b.e), yp = b.a * Math.sqrt(1 - b.e * b.e) * Math.sin(E);
    b.au.copy(b.Pv).multiplyScalar(xp).addScaledVector(b.Qv, yp);
    mapiraj(b.au, b.pivot.position);
  }
  // Moon: geocentric mean elements (Schlyter), d counted from 2000 Jan 0.0
  const lunaPol = { N: 0, w: 0 };
  function poloziLuno(d) {
    const ds = d + 1.5, N = (125.1228 - 0.0529538083 * ds) * D, w = (318.0634 + 0.1643573223 * ds) * D, e = 0.0549, i = 5.1454 * D;
    const E = kepler(((115.3654 + 13.0649929509 * ds) * D) % (2 * Math.PI), e);
    const xv = Math.cos(E) - e, yv = Math.sqrt(1 - e * e) * Math.sin(E), v = Math.atan2(yv, xv), r = Math.hypot(xv, yv);
    const x = r * (Math.cos(N) * Math.cos(v + w) - Math.sin(N) * Math.sin(v + w) * Math.cos(i));
    const y = r * (Math.sin(N) * Math.cos(v + w) + Math.cos(N) * Math.sin(v + w) * Math.cos(i));
    const z = r * Math.sin(v + w) * Math.sin(i);
    const k = LUNA_RAZ[nacin];
    luna.au.set(x, z, -y).multiplyScalar(LUNA_A / AU_KM).add(zem.au);
    luna.pivot.position.set(x, z, -y).multiplyScalar(k).add(zem.pivot.position);
    lunaPol.N = N; lunaPol.w = w;
    // orbit line orientation: R = Ry(Ω) · Rx(i) · Ry(ω)
    q1.setFromAxisAngle(YOS, N); q2.setFromAxisAngle(XOS, i); q3.setFromAxisAngle(YOS, w);
    lunaTir.quaternion.copy(q1).multiply(q2).multiply(q3);
    lunaTir.scale.setScalar(k);
    // tidal locking: the near side (u = 0.5, local +X) faces the Earth
    v1.copy(zem.pivot.position).sub(luna.pivot.position);
    luna.mesh.rotation.y = Math.atan2(-v1.z, v1.x);
  }
  // spin: exact IAU angle when the rate on screen is small; above that the rate is compressed (no strobing)
  function vrtenje(b, d, dt, prisili) {
    const omega = (2 * Math.PI * HITROSTI[hitrost][0]) / ((b.rot || 24) / 24);
    if (b.id === "luna") return;
    if (prisili || !gib || Math.abs(omega) <= 7) { b.mesh.rotation.y = (((b.W0 + b.Wd * d) % 360) * D); return; }
    const a = Math.abs(omega), vis = 7 + 7 * Math.tanh((a - 7) / 7);
    b.mesh.rotation.y = (b.mesh.rotation.y + Math.sign(b.Wd) * vis * dt) % (2 * Math.PI);
  }
  const deli = [];
  const delTocka = {};
  function polozaji(dt = 0, prisili = false) {
    for (const b of telesa) if (b.Pv) poloziPlanet(b, dni);
    poloziLuno(dni);
    for (const b of telesa) vrtenje(b, dni, dt, prisili);
    oblaki.rotation.y = (dni * 0.015) % (2 * Math.PI);
    sMat.uniforms.uTime.value = cas;
    // belts rotate rigidly with their typical period (4,5 let and ~290 let)
    asteroidi.rotation.y = ((2 * Math.PI * dni) / (365.25 * 4.56)) % (2 * Math.PI);
    kuiper.rotation.y = ((2 * Math.PI * dni) / (365.25 * 292)) % (2 * Math.PI);
    // dots, axes, hotspots
    const pp = pikeGeo.attributes.position;
    pike.forEach((b, k) => pp.setXYZ(k, b.pivot.position.x, b.pivot.position.y, b.pivot.position.z));
    pp.needsUpdate = true;
    const op = osGeo.attributes.position;
    pike.forEach((b, k) => {
      const L = vel(b) * (b.id === "saturn" ? 2.5 : 1.6);
      v1.copy(b.pivot.position).addScaledVector(b.pol, L); op.setXYZ(k * 2, v1.x, v1.y, v1.z);
      v1.copy(b.pivot.position).addScaledVector(b.pol, -L); op.setXYZ(k * 2 + 1, v1.x, v1.y, v1.z);
    });
    op.needsUpdate = true;
    for (const b of telesa) { const t = delTocka[b.id]; if (t) { t[0] = b.pivot.position.x; t[1] = b.pivot.position.y; t[2] = b.pivot.position.z; } }
    const to = delTocka.obroci; v1.set(1.85, 0, 0).applyQuaternion(sat.axis.quaternion).multiplyScalar(vel(sat)).add(sat.pivot.position);
    if (nacin === "razdalje") v1.copy(sat.pivot.position);
    to[0] = v1.x; to[1] = v1.y; to[2] = v1.z;
    for (const id of ["asteroidi", "kuiper"]) {
      const t = delTocka[id]; v1.copy(BELT_SMER[id]).multiplyScalar(beltR(id));
      t[0] = v1.x; t[1] = v1.y; t[2] = v1.z;
      pasBaza[id].copy(v1); napisi[id].position.copy(v1);
    }
    for (const id of PRIORITETA) if (T_[id]) napisi[id].position.copy(T_[id].pivot.position);
  }
  function barvajTirnice() {
    const c = tirGeo.attributes.color, col = new THREE.Color(), siva = new THREE.Color("#5b6a8c");
    planeti.forEach((b, k) => {
      col.set(b.barva).lerp(siva, 0.45).multiplyScalar(0.75);
      if (izbran === b.id) col.set(b.barva).multiplyScalar(1.4);
      else if (izbran) col.multiplyScalar(0.55);
      for (let s = 0; s < SEG * 2; s++) c.setXYZ(k * SEG * 2 + s, col.r, col.g, col.b);
    });
    c.needsUpdate = true;
    plTir.material.opacity = izbran === "pluton" ? 0.95 : izbran ? 0.3 : 0.55;
  }
  function tirnicaTocka(b, E, out) {
    const xp = b.a * (Math.cos(E) - b.e), yp = b.a * Math.sqrt(1 - b.e * b.e) * Math.sin(E);
    v2.copy(b.Pv).multiplyScalar(xp).addScaledVector(b.Qv, yp);
    return mapiraj(v2, out);
  }
  function zgradiTirnice() {
    const p = tirGeo.attributes.position;
    planeti.forEach((b, k) => {
      for (let s = 0; s < SEG; s++) {
        tirnicaTocka(b, (s / SEG) * 2 * Math.PI, v1); p.setXYZ(k * SEG * 2 + s * 2, v1.x, v1.y, v1.z);
        tirnicaTocka(b, ((s + 1) / SEG) * 2 * Math.PI, v1); p.setXYZ(k * SEG * 2 + s * 2 + 1, v1.x, v1.y, v1.z);
      }
    });
    p.needsUpdate = true; tirGeo.computeBoundingSphere();
    const pl = T_.pluton, q = plGeo.attributes.position;
    for (let s = 0; s < SEG; s++) {
      tirnicaTocka(pl, (s / SEG) * 2 * Math.PI, v1); q.setXYZ(s * 2, v1.x, v1.y, v1.z);
      tirnicaTocka(pl, ((s + 1) / SEG) * 2 * Math.PI, v1); q.setXYZ(s * 2 + 1, v1.x, v1.y, v1.z);
    }
    q.needsUpdate = true; plGeo.computeBoundingSphere(); plTir.computeLineDistances();
    plTir.material.dashSize = nacin === "razdalje" ? 0.008 : 0.012; plTir.material.gapSize = nacin === "razdalje" ? 0.007 : 0.01;
    for (const pts of [asteroidi, kuiper]) {
      const au = pts.userData.au, pa = pts.geometry.attributes.position;
      for (let k = 0; k < pa.count; k++) { v2.fromArray(au, k * 3); mapiraj(v2, v1); pa.setXYZ(k, v1.x, v1.y, v1.z); }
      pa.needsUpdate = true; pts.geometry.computeBoundingSphere();
    }
  }
  function nastaviNacin(n) {
    nacin = NACINI.includes(n) ? n : "pregledno";
    const razd = nacin === "razdalje";
    for (const b of telesa) { b.axis.scale.setScalar(vel(b)); b.axis.visible = !razd; }
    for (const id of ["merkur", "mars", "luna", "pluton"]) T_[id].mesh.material.bumpScale = vel(T_[id]) * (id === "luna" ? 0.05 : 0.04);
    const Rs = vel(sonce);
    if (razd) { sij[0].scale.setScalar(0.07); sij[1].scale.setScalar(0.16); }
    else if (nacin === "velikosti") { sij[0].scale.setScalar(Rs * 3.2); sij[1].scale.setScalar(Rs * 6); }
    else { sij[0].scale.setScalar(Rs * 4.2); sij[1].scale.setScalar(Rs * 11); }
    sij[1].material.opacity = nacin === "velikosti" ? 0.2 : 0.35;
    korona.visible = !razd; korona.scale.setScalar(Rs * (nacin === "velikosti" ? 4.4 : 6.6)); korona.material.opacity = nacin === "velikosti" ? 0.3 : 0.5;
    pikeGeo.setDrawRange(0, razd ? pike.length : 0);
    lunaTir.visible = kazTir && !razd;
    osi.visible = kazTir && !razd;
    napisi.luna.userData.vkljucen = !razd;
    zgradiTirnice();
    polozaji(0, true);
  }
  function nastaviTirnice(on) { kazTir = on; tirnice.visible = plTir.visible = on; lunaTir.visible = osi.visible = on && nacin !== "razdalje"; }
  function nastaviImena(on) { kazIme = on; for (const s of Object.values(napisi)) s.visible = on; }

  // per-frame label placement (needs the camera): offset above each body by its radius, hide overlapping labels
  const sz = new THREE.Vector2(), inv = new THREE.Matrix4(), camL = new THREE.Vector3(), upL = new THREE.Vector3(), pr = new THREE.Vector3();
  const zasedeno = [];
  pikeObj.onBeforeRender = (renderer, scene, camera) => {
    tockeU.uPR.value = renderer.getPixelRatio();
    if (!kazIme || !camera.isPerspectiveCamera) return;
    renderer.getSize(sz);
    const H = sz.y, Wp = sz.x, tanF = Math.tan((camera.fov * D) / 2), kL = Wp < 520 ? 1.15 : 1; // labels 15 % larger on phones
    inv.copy(group.matrixWorld).invert();
    camL.setFromMatrixPosition(camera.matrixWorld).applyMatrix4(inv);
    upL.set(0, 1, 0).applyQuaternion(camera.quaternion).transformDirection(inv);
    zasedeno.length = 0;
    for (const id of PRIORITETA) {
      const s = napisi[id], b = T_[id], u = s.userData;
      if (u.kL !== kL) { if (u.kL === undefined) { u.sx = s.scale.x; u.sy = s.scale.y; } s.scale.set(u.sx * kL, u.sy * kL, 1); u.kL = kL; }
      const base = b ? b.pivot.position : pasBaza[id];
      s.position.copy(base);
      const dist = camL.distanceTo(base), naPx = (2 * dist * tanF) / H;
      const r = !b ? 2 * naPx : nacin === "razdalje" ? (id === "sonce" ? 8 : 5) * naPx : vel(b) * (id === "saturn" ? 1.2 : 1);
      const spodaj = id === "sonce";
      s.position.addScaledVector(upL, (spodaj ? -1 : 1) * (r + 3 * naPx));
      s.updateMatrixWorld();
      pr.setFromMatrixPosition(s.matrixWorld).project(camera);
      const hpx = (s.scale.y / (2 * tanF)) * H, wpx = (s.scale.x / (2 * tanF)) * H;
      const x = ((pr.x + 1) / 2) * Wp, y = ((1 - pr.y) / 2) * H;
      let cilj = s.userData.vkljucen && pr.z < 1 && pr.z > -1 ? 1 : 0;
      const top = spodaj ? y : y - hpx;
      if (cilj) for (const [a0, a1, b0, b1] of zasedeno) if (x - wpx / 2 < a1 && x + wpx / 2 > a0 && top < b1 && top + hpx > b0) { cilj = 0; break; }
      if (cilj) zasedeno.push([x - wpx / 2 - 3, x + wpx / 2 + 3, top - 2, top + hpx + 2]);
      s.userData.op = gib ? s.userData.op + (cilj - s.userData.op) * 0.2 : cilj;
      s.material.opacity = s.userData.op;
    }
  };

  // ---- parts
  const del = (id, ime, opis, barva, meshes) => {
    delTocka[id] = [0, 0, 0];
    deli.push({ id, ime, opis, barva, meshes, tocka: delTocka[id] });
  };
  del("sonce", "Sonce", OPISI.sonce[2], "#ffc35a", [sonce.mesh]);
  for (const b of telesa.filter((x) => x.Pv)) {
    if (b.id === "jupiter") del("asteroidi", OPISI.asteroidi[0], OPISI.asteroidi[2], OPISI.asteroidi[1], [asteroidi]);
    del(b.id, b.ime, OPISI[b.id], b.barva, b.id === "zemlja" ? [b.mesh, oblaki] : [b.mesh]);
    if (b.id === "zemlja") del("luna", "Luna", OPISI.luna[2], OPISI.luna[1], [luna.mesh]);
    if (b.id === "saturn") del("obroci", OPISI.obroci[0], OPISI.obroci[2], OPISI.obroci[1], [obroci]);
  }
  del("kuiper", OPISI.kuiper[0], OPISI.kuiper[2], OPISI.kuiper[1], [kuiper]);

  barvajTirnice();
  nastaviNacin(nacin);
  nastaviTirnice(kazTir);
  nastaviImena(kazIme);

  const nadzor = [
    { tip: "izbira", id: "merilo", oznaka: "Merilo", moznosti: [["pregledno", "Pregledno"], ["velikosti", "Resnične velikosti"], ["razdalje", "Resnične razdalje"]], vrednost: nacin0, ob: (v) => nastaviNacin(v) },
    { tip: "izpis", id: "v-merilu", oznaka: "Kaj je v merilu", vrednost: () => V_MERILU[nacin] },
    { tip: "drsnik", id: "hitrost", oznaka: "Hitrost časa", min: 0, max: 4, korak: 1, vrednost: hitrost, ob: (v) => { hitrost = Math.min(4, Math.max(0, Math.round(Number(v) || 0))); polozaji(0, true); } },
    { tip: "izpis", id: "sekunda", oznaka: "V 1 sekundi mine", vrednost: () => `${HITROSTI[hitrost][1]} (skok: ${HITROSTI[hitrost][2]})` + (gib ? "" : ", čas teče le s skoki") },
    { tip: "gumb", id: "naprej", oznaka: "Skoči naprej", ob: () => { dni += 10 * HITROSTI[hitrost][0]; polozaji(0, true); } },
    { tip: "izpis", id: "datum", oznaka: "Datum", vrednost: () => {
      const dt = new Date(J2000 + dni * 864e5);
      const datum = Number.isFinite(dt.getTime()) ? `${dt.getUTCDate()}. ${dt.getUTCMonth() + 1}. ${dt.getUTCFullYear()}` : "daleč v prihodnosti";
      return `${datum} (+${trajanje(dni - d0)})`;
    } },
    { tip: "izpis", id: "razdalja", oznaka: "Razdalja Zemlja–Sonce", vrednost: () => `${stevilo((zem.au.length() * AU_KM) / 1e6, 1)} milijona km` },
    { tip: "stikalo", id: "tirnice", oznaka: "Tirnice in osi", vrednost: kazTir, ob: (v) => nastaviTirnice(!!v) },
    { tip: "stikalo", id: "imena", oznaka: "Imena", vrednost: kazIme, ob: (v) => nastaviImena(!!v) },
  ];

  // full-size textures: Earth first, then by size; about 8 ms of work per slice
  let casovnik = null, tekoca = null;
  function delaj() {
    casovnik = null;
    const t0 = performance.now();
    while (performance.now() - t0 < 8) {
      if (!tekoca) { const f = naloge.shift(); if (!f) return; tekoca = f(); }
      if (tekoca.next().done) tekoca = null;
    }
    casovnik = setTimeout(delaj, 24);
    casovnik?.unref?.();
  }
  if (naloge.length) { casovnik = setTimeout(delaj, 80); casovnik?.unref?.(); }

  return {
    group,
    deli,
    nadzor,
    merilo: () => MERILA[nacin],
    luci: false,
    izberi(id) {
      izbran = T_[id] && T_[id].Pv ? id : id === "obroci" ? "saturn" : null;
      barvajTirnice();
    },
    korak(t, dt) {
      if (!gib) return;
      const k = Math.min(Math.max(dt, 0), 0.1);
      dni += k * HITROSTI[hitrost][0];
      cas += k;
      polozaji(k, false);
    },
    dispose() {
      clearTimeout(casovnik); naloge.length = 0; tekoca = null;
      for (const o of odpadki) o.dispose();
      group.clear();
    },
  };
}

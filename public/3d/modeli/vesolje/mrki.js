// Sončni in Lunin mrk: senca in polsenca Lune in Zemlje, izračunani iz pravih polmerov in razdalj (pogodba v docs/3d.md).
//
// Data (verified 2026-11 with node against these sources):
// - Radii: Sun 695 700 km (IAU 2015 nominal), Earth 6371 km (mean), Moon 1737,4 km; Moon's distance 384 400 km mean,
//   perigee 356 500 km, apogee 406 700 km (NASA GSFC Moon Fact Sheet, extreme values); 1 a. e. = 149 597 870,7 km.
// - Cones: umbra half-angle sin α = (R☉ − R)/d, penumbra sin α = (R☉ + R)/d. Moon's umbra 373 600 km long, so it
//   reaches the Earth only when the Moon is nearer than about 380 000 km (total), otherwise annular (»kolobarjasti«).
//   Earth's umbra at the Moon: radius 4600 km = 2,6 Moon radii; penumbra 8200 km. The Earth's shadow is enlarged by
//   2 % for the atmosphere (Chauvenet/Danjon rule, as in the Five Millennium Canon, Espenak & Meeus).
// - Moon's orbit: inclination 5,145° to the ecliptic; the line of nodes turns once in 18,6 years, so the Sun returns to
//   the same node every 346,62 days (eclipse year). Eclipse limits from the geocentric angles (mean distances):
//   solar eclipse somewhere on Earth if the Moon is closer than ρ☉ + ρ☾ + π☾ − π☉ = 1,47° to the Sun; lunar eclipse in
//   the umbra if it is closer than 1,02 (π☾ + π☉ − ρ☉) + ρ☾ = 0,96° to the antisolar point.
// - Red colour in the umbra: sunlight refracted and reddened by the Earth's atmosphere (Rayleigh scattering removes blue).
// Textures (Earth, clouds, Moon, Sun) are drawn in code, the same as in soncni-sistem.js.

export const info = {
  id: "mrki",
  naslov: "Sončni in Lunin mrk",
  podrocje: "vesolje",
  predmet: "FIZ",
  opis: "Ko so Sonce, Luna in Zemlja v premici, pade senca enega telesa na drugo. Poglej, kdaj je sončni mrk popolni ali kolobarjasti, zakaj je Luna med mrkom rdeča in zakaj mrka ni vsak mesec.",
  merilo: { m: 4.25e7, oznaka: "≈ 42 000 km (le velikosti Zemlje in Lune)" },
};

const D = Math.PI / 180;
const R_S = 695700, R_E = 6371, R_M = 1737.4, AU = 149597870.7, D_M = 384400, PERIGEJ = 356500, APOGEJ = 406700;
const NAGIB_LUNE = 5.145, SINODSKI = 29.530589, MRKOVNO_LETO = 346.62;
const RHO_S = Math.asin(R_S / AU);

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

// ---------------------------------------------------------------- scene helpers (same in letni-casi, lunine-mene, mrki)
const stevilo = (x, d) => (Math.abs(x) < 0.5 * 10 ** -d ? 0 : x).toFixed(d).replace(".", ",").replace("-", "−");
const MESECI = ["januarja", "februarja", "marca", "aprila", "maja", "junija", "julija", "avgusta", "septembra", "oktobra", "novembra", "decembra"];
function zaobljen(c2, x, y, w, h, r) {
  c2.beginPath(); c2.moveTo(x + r, y); c2.arcTo(x + w, y, x + w, y + h, r); c2.arcTo(x + w, y + h, x, y + h, r);
  c2.arcTo(x, y + h, x, y, r); c2.arcTo(x, y, x + w, y, r); c2.closePath();
}
function orodja(THREE, ctx) {
  const visoka = ctx.kakovost !== "nizka";
  const odpadki = [];
  const hrani = (x) => (odpadki.push(x), x);
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
  // Textures start at a quarter of their size and are replaced by full-size ones in ~8 ms time slices.
  const naloge = [];
  let casovnik = null, tekoca = null;
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
  function zazeni() { if (naloge.length) { casovnik = setTimeout(delaj, 80); casovnik?.unref?.(); } }
  // Pill label (canvas sprite, constant size on screen). Lines after the first are smaller.
  function napis(tekst, barva, { visina = 0.021, sredina = [0.5, 0], pika = true } = {}) {
    const vrstice = tekst.split("\n");
    const cv = document.createElement("canvas"), c2 = cv.getContext("2d");
    const f1 = '600 30px "Instrument Sans", system-ui, sans-serif', f2 = '500 25px "Instrument Sans", system-ui, sans-serif';
    let tw = 0;
    vrstice.forEach((v, i) => { c2.font = i ? f2 : f1; tw = Math.max(tw, Math.ceil(c2.measureText(v).width)); });
    const H = 48 + (vrstice.length - 1) * 30, zamik = pika && barva ? 36 : 22, Wc = tw + zamik + 22, r = Math.min(24, H / 2);
    cv.width = Wc; cv.height = H;
    c2.fillStyle = "rgba(11,15,22,0.78)";
    zaobljen(c2, 2, 2, Wc - 4, H - 4, r - 2); c2.fill();
    c2.strokeStyle = "rgba(154,166,191,0.35)"; c2.lineWidth = 2; c2.stroke();
    if (pika && barva) { c2.fillStyle = barva; c2.beginPath(); c2.arc(22, 24, 7, 0, 2 * Math.PI); c2.fill(); }
    c2.textBaseline = "middle";
    vrstice.forEach((v, i) => { c2.font = i ? f2 : f1; c2.fillStyle = i ? "#b8c3d9" : "#e8edf7"; c2.fillText(v, zamik, 25 + i * 30); });
    const t = hrani(new THREE.CanvasTexture(cv)); t.colorSpace = THREE.SRGBColorSpace;
    const s = new THREE.Sprite(hrani(new THREE.SpriteMaterial({ map: t, transparent: true, depthTest: false, depthWrite: false, sizeAttenuation: false, toneMapped: false })));
    const h = (visina * H) / 48;
    s.center.set(sredina[0], sredina[1]); s.scale.set((h * Wc) / H, h, 1); s.renderOrder = 20;
    return s;
  }
  // Inset panel drawn on a canvas (2× for sharpness), kept at the top left of the screen below the title.
  const sz = new THREE.Vector2(), hv = new THREE.Vector3(), hc = new THREE.Vector3(), hInv = new THREE.Matrix4();
  function vlozek(group, w, h, sirina = 250) {
    const cv = document.createElement("canvas"); cv.width = w * 2; cv.height = h * 2;
    const c2 = cv.getContext("2d");
    const t = hrani(new THREE.CanvasTexture(cv)); t.colorSpace = THREE.SRGBColorSpace;
    const s = new THREE.Sprite(hrani(new THREE.SpriteMaterial({ map: t, transparent: true, depthTest: false, depthWrite: false, sizeAttenuation: false, toneMapped: false })));
    s.center.set(0, 1); s.renderOrder = 30; s.scale.set(0.001, 0.001, 1); s.frustumCulled = false;
    s.onBeforeRender = (renderer, scene, camera) => {
      renderer.getSize(sz);
      const W = sz.x, Hs = sz.y, wpx = Math.min(sirina, W * 0.62), hpx = (wpx * h) / w;
      if (!camera.isPerspectiveCamera || W < 1) return;
      hv.set((12 / W) * 2 - 1, 1 - (46 / Hs) * 2, 0.5).unproject(camera);
      hc.setFromMatrixPosition(camera.matrixWorld);
      hv.sub(hc).normalize().multiplyScalar(camera.near * 20 + 0.2).add(hc);
      hInv.copy(group.matrixWorld).invert();
      s.position.copy(hv).applyMatrix4(hInv);
      const P5 = camera.projectionMatrix.elements[5], gs = group.matrixWorld.getMaxScaleOnAxis() || 1;
      const sy = (2 * (hpx / Hs)) / P5 / gs;
      s.scale.set((sy * w) / h, sy, 1);
      s.updateMatrixWorld();
    };
    group.add(s);
    return { s, c2, t, w, h };
  }
  // Per frame (call from any object's onBeforeRender): labels with userData.tocka sit above their point when the point
  // is farther from the camera than userData.sredisce (world), below it otherwise; every label stays on the screen.
  // Labels earlier in »seznam« win: a later label that would cover one of them is hidden (material.visible).
  const uP = new THREE.Vector3(), uC = new THREE.Vector3(), uS = new THREE.Vector3(), zas = [];
  function uredi(renderer, camera, group, seznam) {
    if (!camera.isPerspectiveCamera) return;
    renderer.getSize(sz);
    const W = sz.x, H = sz.y, P5 = camera.projectionMatrix.elements[5], gs = group.matrixWorld.getMaxScaleOnAxis() || 1;
    uC.setFromMatrixPosition(camera.matrixWorld);
    let nz = 0;
    const kL = W < 520 ? 1.15 : 1; // labels 15 % larger on phones
    for (const s of seznam) {
      const u = s.userData;
      if (u.kL !== kL) { if (u.kL === undefined) { u.sx = s.scale.x; u.sy = s.scale.y; } s.scale.set(u.sx * kL, u.sy * kL, 1); s.updateMatrixWorld(); u.kL = kL; }
      if (u.tocka) {
        uP.copy(u.tocka).applyMatrix4(s.parent.matrixWorld);
        const nad = uC.distanceTo(uP) > uC.distanceTo(uS.setFromMatrixPosition(u.sredisce.matrixWorld));
        s.position.copy(u.tocka); s.position.y += nad ? u.dvig : -u.dvig;
        s.center.y = nad ? 0 : 1;
        s.updateMatrixWorld();
      }
      if (u.cx0 === undefined) u.cx0 = s.center.x;
      uP.setFromMatrixPosition(s.matrixWorld).project(camera);
      const x = ((uP.x + 1) / 2) * W, wpx = ((s.scale.x * gs * P5) / 2) * H;
      s.center.x = Math.min(Math.max(u.cx0, 1 - (W - 6 - x) / wpx), (x - 6) / wpx);
      const hpx = ((s.scale.y * gs * P5) / 2) * H, x0 = x - s.center.x * wpx, y0 = ((1 - uP.y) / 2) * H - (1 - s.center.y) * hpx;
      const kaze = s.visible && s.material.opacity > 0.05 && uP.z < 1;
      let prost = kaze;
      for (let i = 0; prost && i < nz; i += 4) if (x0 < zas[i + 1] && x0 + wpx > zas[i] && y0 < zas[i + 3] && y0 + hpx > zas[i + 2]) prost = false;
      s.material.visible = prost || !kaze;
      if (prost) { zas[nz++] = x0 - 3; zas[nz++] = x0 + wpx + 3; zas[nz++] = y0 - 2; zas[nz++] = y0 + hpx + 2; }
    }
  }
  function ploscica(c2, w, h) {
    c2.setTransform(2, 0, 0, 2, 0, 0);
    c2.clearRect(0, 0, w, h);
    c2.fillStyle = "rgba(18,24,38,0.92)"; c2.strokeStyle = "#2a3654"; c2.lineWidth = 1;
    zaobljen(c2, 0.5, 0.5, w - 1, h - 1, 12); c2.fill(); c2.stroke();
  }
  const font = (t, px) => `${t} ${px}px "Instrument Sans", system-ui, sans-serif`;
  // The Sun: animated granulation with limb darkening, plus two additive glow sprites.
  function sonce(r, w) {
    const sTex = postopna(texSonce, (v) => v, w, false, (t) => { sMat.uniforms.map.value = t; });
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
    const g = new THREE.Group();
    const mesh = new THREE.Mesh(hrani(new THREE.SphereGeometry(r, visoka ? 64 : 32, visoka ? 40 : 20)), sMat);
    g.add(mesh);
    const cv = document.createElement("canvas"); cv.width = cv.height = 256;
    const c2 = cv.getContext("2d"), gr = c2.createRadialGradient(128, 128, 0, 128, 128, 128);
    [[0, "rgba(255,236,190,1)"], [0.18, "rgba(255,214,140,0.85)"], [0.32, "rgba(255,170,80,0.32)"], [0.55, "rgba(255,130,50,0.1)"], [1, "rgba(255,110,40,0)"]].forEach(([o, c]) => gr.addColorStop(o, c));
    c2.fillStyle = gr; c2.fillRect(0, 0, 256, 256);
    const st = hrani(new THREE.CanvasTexture(cv)); st.colorSpace = THREE.SRGBColorSpace;
    const sij = [[0.9, 4.2], [0.3, 9]].map(([op, k]) => {
      const s = new THREE.Sprite(hrani(new THREE.SpriteMaterial({ map: st, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false })));
      s.scale.setScalar(r * k); s.renderOrder = 2; g.add(s); return s;
    });
    // corona streamers turn slowly with the Sun's own time (still when motion is reduced)
    const kt = hrani(new THREE.CanvasTexture(platnoKorone())); kt.colorSpace = THREE.SRGBColorSpace;
    const korona = new THREE.Sprite(hrani(new THREE.SpriteMaterial({ map: kt, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false })));
    korona.scale.setScalar(r * 6.6); korona.renderOrder = 2; g.add(korona);
    korona.onBeforeRender = () => { korona.material.rotation = sMat.uniforms.uTime.value * 0.006; };
    return { g, mesh, sMat, sij, korona };
  }
  // Earth: land/ocean map with roughness (glinting oceans), clouds and a thin blue atmosphere rim.
  function zemlja(W, geoV, geoS, snov, sonceSvet) {
    let m;
    m = snov({ roughness: 1,
      map: postopna(texZemlja, (v) => v.barva, W, true, (t) => { m.map = t; }, true),
      roughnessMap: postopna(texZemlja, (v) => v.hrap, W, false, (t) => { m.roughnessMap = t; }, true) });
    const mesh = new THREE.Mesh(geoV, m);
    let om;
    om = snov({ map: postopna(texOblaki, (v) => v, W / 2, true, (t) => { om.map = t; }), transparent: true, depthWrite: false, roughness: 1 });
    const oblaki = new THREE.Mesh(geoS, om);
    oblaki.scale.setScalar(1.012);
    const atmU = { uSun: { value: new THREE.Vector3() } };
    const atm = new THREE.Mesh(geoS, hrani(new THREE.ShaderMaterial({
      uniforms: atmU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: "varying vec3 vN; varying vec3 vP; void main(){ vN = normalize(mat3(modelMatrix) * normal); vec4 w = modelMatrix * vec4(position, 1.0); vP = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",
      fragmentShader: `uniform vec3 uSun; varying vec3 vN; varying vec3 vP;
        void main(){ vec3 n = normalize(vN), v = normalize(cameraPosition - vP), l = normalize(uSun - vP);
          float f = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 2.6); float day = smoothstep(-0.25, 0.45, dot(n, l));
          gl_FragColor = vec4(vec3(0.3, 0.55, 1.0) * f * day * 0.9, 1.0);
          #include <colorspace_fragment>
        }`,
    })));
    atm.scale.setScalar(1.03); atm.renderOrder = 3;
    atm.onBeforeRender = () => { sonceSvet(atmU.uSun.value); };
    return { mesh, oblaki, atm };
  }
  // Parallel sunlight arrows (one merged mesh) pointing along +x, centred at the origin of their group.
  function puscice(dolzina, zamiki, debelina) {
    const deli = [];
    for (const [y, z] of zamiki) {
      const c = new THREE.CylinderGeometry(debelina, debelina, dolzina - debelina * 5, 8, 1, true);
      c.rotateZ(-Math.PI / 2); c.translate(-debelina * 2.5, y, z); deli.push(c);
      const k = new THREE.ConeGeometry(debelina * 2.6, debelina * 6, 12);
      k.rotateZ(-Math.PI / 2); k.translate(dolzina / 2 - debelina * 3, y, z); deli.push(k);
    }
    const g = hrani(zdruzi(deli));
    deli.forEach((d) => d.dispose());
    return new THREE.Mesh(g, hrani(new THREE.MeshBasicMaterial({ color: 0xffd27a, transparent: true, opacity: 0.85, toneMapped: false })));
  }
  function zdruzi(geos) {
    let n = 0, ni = 0;
    for (const g of geos) { n += g.attributes.position.count; ni += g.index ? g.index.count : g.attributes.position.count; }
    const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), idx = new Uint32Array(ni);
    let o = 0, oi = 0;
    for (const g of geos) {
      const p = g.attributes.position, nn = g.attributes.normal, c = p.count;
      pos.set(p.array, o * 3); if (nn) nor.set(nn.array, o * 3);
      if (g.index) for (let i = 0; i < g.index.count; i++) idx[oi++] = g.index.array[i] + o;
      else for (let i = 0; i < c; i++) idx[oi++] = o + i;
      o += c;
    }
    const out = new THREE.BufferGeometry();
    out.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    out.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
    out.setIndex(new THREE.BufferAttribute(idx, 1));
    return out;
  }
  function pocisti() {
    clearTimeout(casovnik); naloge.length = 0; tekoca = null;
    for (const o of odpadki) o.dispose();
    odpadki.length = 0;
  }
  return { visoka, hrani, tekstura, postopna, zazeni, napis, vlozek, uredi, ploscica, font, sonce, zemlja, puscice, zdruzi, pocisti };
}

// ---------------------------------------------------------------- eclipse geometry
// Fraction of the Sun's disc (angular radius a) covered by a disc of angular radius b at centre distance s.
function zakritje(a, b, s) {
  if (s >= a + b) return 0;
  if (s <= Math.abs(a - b)) return b >= a ? 1 : (b * b) / (a * a);
  const c1 = Math.min(1, Math.max(-1, (s * s + a * a - b * b) / (2 * s * a))), c2 = Math.min(1, Math.max(-1, (s * s + b * b - a * a) / (2 * s * b)));
  const A = a * a * Math.acos(c1) + b * b * Math.acos(c2) - 0.5 * Math.sqrt(Math.max(0, (-s + a + b) * (s + a - b) * (s - a + b) * (s + a + b)));
  return Math.min(1, Math.max(0, A / (Math.PI * a * a)));
}
const MRK_GLSL = `
uniform vec3 uOcc; uniform float uOccR; uniform vec3 uSunDir; uniform float uRhoS; uniform vec3 uRdeca; uniform float uRob;
varying vec3 vMrkP;
// (S, B): distance between the centres of the Sun and the occluder as seen from p, and the occluder's radius, both in
// units of the Sun's angular radius (no tiny numbers on the GPU); S < 0 when the occluder is not towards the Sun.
vec2 mrkSB(vec3 p) {
  vec3 o = uOcc - p; float d = length(o), vz = dot(o, uSunDir);
  if (vz <= 0.0 || d <= uOccR) return vec2(-1.0, 0.0);
  return vec2(atan(length(cross(o, uSunDir)), vz), asin(uOccR / d)) / uRhoS;
}
float mrkLeca(float S, float B) {
  if (S < 0.0 || S >= 1.0 + B) return 0.0;
  if (S <= abs(1.0 - B)) return B >= 1.0 ? 1.0 : B * B;
  float c1 = clamp((S * S + 1.0 - B * B) / (2.0 * S), -1.0, 1.0), c2 = clamp((S * S + B * B - 1.0) / (2.0 * S * B), -1.0, 1.0);
  float A = acos(c1) + B * B * acos(c2) - 0.5 * sqrt(max(0.0, (-S + 1.0 + B) * (S + 1.0 - B) * (S - 1.0 + B) * (S + 1.0 + B)));
  return clamp(A / 3.14159265, 0.0, 1.0);
}
`;
const stevilka = (x) => Math.round(x).toLocaleString("sl-SI").replace(/\./g, " ").replace(/ /g, " ");
const tisoc = (x) => String(Math.round(x)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

// ---------------------------------------------------------------- builder
export function zgradi(THREE, ctx) {
  const o = orodja(THREE, ctx);
  const { visoka, hrani } = o;
  const gib = ctx.gibanje !== false, z0 = ctx.zacetek || {};
  const seg = (n) => (visoka ? n : Math.round(n / 2));
  const group = new THREE.Group();
  group.name = "mrki";
  // the Sun is towards −x of »svet«; turned so that the sunlit sides face the default camera a little
  const svet = new THREE.Group();
  svet.rotation.y = 70 * D;
  group.add(svet);
  const luc = new THREE.DirectionalLight(0xfff4e2, 3.2);
  luc.position.set(-1, 0, 0);
  svet.add(luc, luc.target, new THREE.AmbientLight(0x9fb0d0, 0.08));

  // materials whose sunlight is reduced by the shadow of another body (per fragment, from true angles)
  function snovMrk(op, U, kljuc) {
    const m = hrani(new THREE.MeshStandardMaterial({ roughness: 0.92, metalness: 0, ...op }));
    m.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, U);
      sh.vertexShader = "varying vec3 vMrkP;\n" + sh.vertexShader.replace("#include <project_vertex>", "#include <project_vertex>\n vMrkP = (modelMatrix * vec4(transformed, 1.0)).xyz;");
      sh.fragmentShader = sh.fragmentShader
        .replace("void main() {", MRK_GLSL + `void main() {
 vec2 mrkS = mrkSB(vMrkP); float mrkF = mrkLeca(mrkS.x, mrkS.y); vec3 mrkL = vec3(1.0 - mrkF) + uRdeca * smoothstep(0.95, 1.0, mrkF);
 float mrkW = fwidth(mrkS.x) * 1.4 + 1e-4, mrkV = mrkS.x < 0.0 ? 0.0 : uRob;
 float mrkR1 = mrkV * (1.0 - smoothstep(0.0, mrkW, abs(mrkS.x - 1.0 - mrkS.y)));
 float mrkR2 = mrkV * (1.0 - smoothstep(0.0, mrkW, abs(mrkS.x - abs(1.0 - mrkS.y))));`)
        .replace("#include <tonemapping_fragment>", "gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.62, 0.7, 0.86), mrkR1 * 0.85); gl_FragColor.rgb = mix(gl_FragColor.rgb, mrkS.y >= 1.0 ? vec3(1.0, 0.62, 0.42) : vec3(1.0, 0.82, 0.5), mrkR2);\n#include <tonemapping_fragment>")
        .replace("#include <lights_fragment_begin>", THREE.ShaderChunk.lights_fragment_begin.replace("getDirectionalLightInfo( directionalLight, directLight );", "getDirectionalLightInfo( directionalLight, directLight ); directLight.color *= mrkL;"));
    };
    m.customProgramCacheKey = () => "mrki-" + kljuc;
    return m;
  }
  const uni = (rdeca, rob) => ({ uOcc: { value: new THREE.Vector3(0, 0, 100) }, uOccR: { value: 0 }, uSunDir: { value: new THREE.Vector3(-1, 0, 0) }, uRhoS: { value: RHO_S }, uRdeca: { value: new THREE.Color(...rdeca) }, uRob: { value: rob } });
  const UZ = uni([0, 0, 0], 1), UL = uni([0.62, 0.2, 0.08], 0);
  // occluders are set in »svet« coordinates and passed to the shaders in world coordinates every frame
  const occZ = new THREE.Vector3(0, 0, 100), occL = new THREE.Vector3(0, 0, 100);
  let occZr = 0, occLr = 0;
  function vSvet(U, occ, r) {
    U.uOcc.value.copy(occ).applyMatrix4(svet.matrixWorld);
    U.uOccR.value = r * svet.matrixWorld.getMaxScaleOnAxis();
    U.uSunDir.value.set(-1, 0, 0).transformDirection(svet.matrixWorld);
  }

  // ---- bodies
  const geoV = hrani(new THREE.SphereGeometry(1, seg(96), seg(64)));
  const geoS = hrani(new THREE.SphereGeometry(1, seg(64), seg(40)));
  const sonceSvet = (out) => out.set(-100, 0, 0).applyMatrix4(svet.matrixWorld);
  const Z = o.zemlja(visoka ? 1024 : 512, geoV, geoS, (op) => snovMrk(op, UZ, op.transparent ? "oblaki" : "zemlja"), sonceSvet);
  const zem = new THREE.Group();
  zem.add(Z.mesh, Z.oblaki, Z.atm);
  Z.mesh.rotation.y = Z.oblaki.rotation.y = 165 * D; // Europe and Africa face the Sun
  svet.add(zem);
  Z.mesh.onBeforeRender = () => vSvet(UZ, occZ, occZr);
  let lm;
  lm = snovMrk({ roughness: 0.95, bumpScale: 1,
    map: o.postopna(texLuna, (v) => v.barva, visoka ? 512 : 256, true, (t) => { lm.map = t; obrazLune(); zadnjiV = null; risiVlozek(); }),
    bumpMap: o.postopna(texLuna, (v) => v.bump, visoka ? 512 : 256, false, (t) => { lm.bumpMap = t; }) }, UL, "luna");
  const luna = new THREE.Mesh(geoS, lm);
  luna.onBeforeRender = () => vSvet(UL, occL, occLr);
  svet.add(luna);
  // bodies are drawn after the translucent shadow cones, so that a cone in front does not dim them twice
  for (const m of [Z.mesh, luna]) { m.material.transparent = true; m.renderOrder = 10; }
  Z.oblaki.renderOrder = 11; Z.atm.renderOrder = 12;
  const S = o.sonce(0.1, visoka ? 256 : 128);
  S.g.position.set(-0.84, 0, 0);
  svet.add(S.g);

  // ---- shadow cones (along +x), outlines, sunlight
  function kegelj(n) {
    const g = hrani(new THREE.BufferGeometry());
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array((n + 1) * 2 * 3), 3));
    const idx = [];
    for (let k = 0; k < n; k++) { const a = k * 2, b = a + 1, c = a + 2, d = a + 3; idx.push(a, c, b, b, c, d); }
    g.setIndex(idx);
    g.userData.n = n;
    return g;
  }
  const NK = seg(64);
  function oblikuj(mesh, x0, r0, x1, r1, cy, cz) {
    const g = mesh.geometry, p = g.attributes.position, n = g.userData.n;
    for (let k = 0; k <= n; k++) {
      const a = (k / n) * 2 * Math.PI, c = Math.cos(a), s = Math.sin(a);
      p.setXYZ(k * 2, x0, cy + c * r0, cz + s * r0); p.setXYZ(k * 2 + 1, x1, cy + c * r1, cz + s * r1);
    }
    p.needsUpdate = true; g.computeBoundingSphere();
    mesh.userData.k = [x0, r0, x1, r1, cy, cz];
  }
  const stozec = (barva, op, red) => {
    const m = new THREE.Mesh(kegelj(NK), hrani(new THREE.MeshBasicMaterial({ color: barva, transparent: true, opacity: op, side: THREE.DoubleSide, depthWrite: false, toneMapped: false })));
    m.renderOrder = red; svet.add(m); return m;
  };
  const polsenca = stozec(0x9fb4dc, 0.13, 4), senca = stozec(0x030508, 0.8, 5), podaljsek = stozec(0xffcf7a, 0.12, 4);
  const polsencaM = stozec(0x9fb4dc, 0.1, 4), sencaM = stozec(0x030508, 0.7, 5); // the Moon's own shadow in »zakaj«
  const stozci = [polsenca, senca, podaljsek, polsencaM, sencaM];
  const BARVE_ROB = [[0.62, 0.7, 0.86], [1, 0.62, 0.42], [1, 0.82, 0.5], [0.62, 0.7, 0.86], [1, 0.62, 0.42]];
  const robGeo = hrani(new THREE.BufferGeometry());
  robGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(stozci.length * 4 * 3), 3));
  robGeo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(BARVE_ROB.flatMap((c) => [...c, ...c, ...c, ...c])), 3));
  const robovi = new THREE.LineSegments(robGeo, hrani(new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.85, depthWrite: false, toneMapped: false })));
  robovi.frustumCulled = false; robovi.renderOrder = 6;
  svet.add(robovi);
  const camL = new THREE.Vector3(), inv = new THREE.Matrix4(), v1 = new THREE.Vector3(), v2 = new THREE.Vector3(), v3 = new THREE.Vector3();
  robovi.onBeforeRender = (renderer, sc, camera) => {
    inv.copy(svet.matrixWorld).invert();
    camL.setFromMatrixPosition(camera.matrixWorld).applyMatrix4(inv);
    const p = robGeo.attributes.position;
    stozci.forEach((m, i) => {
      const k = m.userData.k;
      if (!m.visible || !k) { for (let j = 0; j < 4; j++) p.setXYZ(i * 4 + j, 0, 0, 0); return; }
      const [x0, r0, x1, r1, cy, cz] = k;
      const vy = camL.y - cy, vz = camL.z - cz, L = Math.hypot(vy, vz) || 1, ny = -vz / L, nz = vy / L;
      p.setXYZ(i * 4, x0, cy + ny * r0, cz + nz * r0); p.setXYZ(i * 4 + 1, x1, cy + ny * r1, cz + nz * r1);
      p.setXYZ(i * 4 + 2, x0, cy - ny * r0, cz - nz * r0); p.setXYZ(i * 4 + 3, x1, cy - ny * r1, cz - nz * r1);
    });
    p.needsUpdate = true;
    o.uredi(renderer, camera, group, vsiNapisi);
  };
  const zarki = o.puscice(0.18, [[0, 0], [0.12, 0.16], [0.12, -0.16], [-0.12, 0.16], [-0.12, -0.16]], 0.006);
  zarki.position.set(-0.87, 0, 0);
  svet.add(zarki);
  // light refracted by the atmosphere into the Earth's umbra (lunar eclipse)
  const lomGeo = hrani(new THREE.BufferGeometry());
  lomGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(16 * 3), 3));
  const lom = new THREE.LineSegments(lomGeo, hrani(new THREE.LineBasicMaterial({ color: 0xff7a4d, transparent: true, opacity: 0.9, toneMapped: false })));
  svet.add(lom);

  // ---- »zakaj«: ecliptic plane, tilted orbit, nodes
  const gC = new THREE.Group();
  svet.add(gC);
  const ekliptika = new THREE.Mesh(hrani(new THREE.CircleGeometry(0.93, seg(96))), hrani(new THREE.MeshBasicMaterial({ color: 0x6e9bff, transparent: true, opacity: 0.07, side: THREE.DoubleSide, depthWrite: false })));
  ekliptika.rotation.x = -Math.PI / 2; ekliptika.renderOrder = 1;
  const eklRobArr = new Float32Array(seg(128) * 3);
  for (let k = 0; k < seg(128); k++) { const a = (k / seg(128)) * 2 * Math.PI; eklRobArr[k * 3] = Math.cos(a) * 0.93; eklRobArr[k * 3 + 2] = Math.sin(a) * 0.93; }
  const eklRobGeo = hrani(new THREE.BufferGeometry()); eklRobGeo.setAttribute("position", new THREE.BufferAttribute(eklRobArr, 3));
  const eklRob = new THREE.LineLoop(eklRobGeo, hrani(new THREE.LineBasicMaterial({ color: 0x6e9bff, transparent: true, opacity: 0.35, depthWrite: false })));
  const NT = seg(192);
  const tirGeo = hrani(new THREE.BufferGeometry());
  tirGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(NT * 2 * 3), 3));
  tirGeo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(NT * 2 * 3), 3));
  const tirnica = new THREE.LineSegments(tirGeo, hrani(new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.95, depthWrite: false, toneMapped: false })));
  const NS = 24;
  const stebGeo = hrani(new THREE.BufferGeometry());
  stebGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(NS * 2 * 3), 3));
  const stebri = new THREE.LineSegments(stebGeo, hrani(new THREE.LineBasicMaterial({ color: 0x8394b8, transparent: true, opacity: 0.4, depthWrite: false })));
  const vozGeo = hrani(new THREE.BufferGeometry());
  vozGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
  const vozelna = new THREE.Line(vozGeo, hrani(new THREE.LineDashedMaterial({ color: 0xffd166, dashSize: 0.03, gapSize: 0.02, transparent: true, opacity: 0.9, toneMapped: false })));
  const vozla = new THREE.InstancedMesh(hrani(new THREE.SphereGeometry(0.014, 12, 8)), hrani(new THREE.MeshBasicMaterial({ color: 0xffd166, toneMapped: false })), 2);
  gC.add(ekliptika, eklRob, tirnica, stebri, vozelna, vozla);
  [tirnica, stebri, vozelna].forEach((x) => (x.frustumCulled = false));

  // ---- labels
  const L = {
    sonce: o.napis("Sonce", "#ffc35a", { sredina: [0.5, 1] }),
    zemlja: o.napis("Zemlja", "#4f8fe0", { sredina: [0.5, 1] }),
    luna: o.napis("Luna", "#c9c6bf", { sredina: [0.5, 1] }),
    senca: o.napis("senca", "#ff9e6b", { visina: 0.019 }),
    polsenca: o.napis("polsenca", "#9fb4dc", { visina: 0.019 }),
    podaljsek: o.napis("podaljšek sence", "#ffcf7a", { visina: 0.019, sredina: [0.5, 1] }),
    lom: o.napis("lom v ozračju", "#ff7a4d", { visina: 0.019, sredina: [0.5, 1] }),
    svetloba: o.napis("Sončna svetloba", "#ffd27a"),
    dvizni: o.napis("dvižni vozel", "#ffd166", { visina: 0.019 }),
    spustni: o.napis("spustni vozel", "#ffd166", { visina: 0.019 }),
    ekliptika: o.napis("ravnina ekliptike", "#6e9bff", { visina: 0.019, sredina: [0.5, 1] }),
  };
  const vsiNapisi = Object.values(L);
  for (const s of vsiNapisi) svet.add(s);

  // ---- state
  const VRSTE = ["soncni", "lunin", "zakaj"];
  let vrsta = VRSTE.includes(z0.vrsta) ? z0.vrsta : "soncni";
  const num = (v, a, b, d) => { const x = Number(v); return Number.isFinite(x) ? Math.min(b, Math.max(a, x)) : d; };
  let lega = num(z0.lega, -1, 1, 0), razdalja = num(z0.razdalja, PERIGEJ, APOGEJ, 365000);
  let dan = num(z0.dan, 0, 29.5, 0), vozel = num(z0.vozel, 0, 359, 35), povecaj = z0.povecaj === undefined ? true : !!z0.povecaj;
  let tece = z0.predvajaj === undefined ? false : !!z0.predvajaj;
  const RA = {}, RB = {}, RC = {}; // results of the last update of each view, for the readouts
  const tockeG = {};
  const T = (id, x, y, z) => { v1.set(x, y, z).applyMatrix4(svet.matrix); tockeG[id] = tockeG[id] || [0, 0, 0]; const t = tockeG[id]; t[0] = v1.x; t[1] = v1.y; t[2] = v1.z; };
  svet.updateMatrix();
  const zakaj = () => vrsta === "zakaj";

  // true-angle classification for »zakaj«
  const PI_M = Math.asin(R_E / D_M), PI_S = Math.asin(R_E / AU), RHO_M = Math.asin(R_M / D_M);
  const F_U = 1.02 * (PI_M + PI_S - RHO_S), F_P = 1.02 * (PI_M + PI_S + RHO_S);
  const smer = (lam, out) => out.set(-Math.cos(lam), 0, Math.sin(lam));
  const t1 = new THREE.Vector3(), t2 = new THREE.Vector3();
  function lunaNaTirnici(E, Om, inc, out) {
    const u = Math.atan2(Math.sin(E - Om), Math.cos(E - Om) * Math.cos(inc));
    smer(Om, t1); smer(Om + Math.PI / 2, t2);
    return out.copy(t1).multiplyScalar(Math.cos(u)).addScaledVector(t2, Math.sin(u) * Math.cos(inc)).add(t2.set(0, Math.sin(u) * Math.sin(inc), 0));
  }

  function postaviSoncni() {
    const s = 0.3 / R_E, xE = 0.5, rE = 0.3, rM = R_M * s;
    const xM = xE - (0.72 * razdalja) / D_M, zM = lega * 0.55;
    zem.position.set(xE, 0, 0); zem.scale.setScalar(rE);
    luna.position.set(xM, 0, zM); luna.scale.setScalar(rM); luna.rotation.y = 0;
    const q0 = Math.abs(zM) / s, xs = q0 < R_E ? xE - Math.sqrt(rE * rE - zM * zM) : xE, ps = q0 < R_E ? Math.sqrt(R_E * R_E - q0 * q0) : 0;
    const dSM = AU - razdalja, kx = (xs - xM) / (razdalja - ps);
    const Lu = (dSM * R_M) / (R_S - R_M), tanP = (R_S + R_M) / dSM, xT = xM + Lu * kx;
    oblikuj(senca, xM, rM, Math.min(xT, xE), xT > xE ? rM * ((xT - xE) / (xT - xM)) : 0, 0, zM);
    const xKonec = xE;
    oblikuj(polsenca, xM, rM, xKonec, rM + ((xKonec - xM) / kx) * tanP * s, 0, zM);
    podaljsek.visible = q0 < R_E && xT < xs - 0.001;
    if (podaljsek.visible) oblikuj(podaljsek, xT, 0, xE, ((xE - xT) / (xT - xM)) * rM, 0, zM);
    // occluder for the Earth's shader: the Moon at its true distance (the drawing compresses only x)
    occZ.set(xE - razdalja * s, 0, zM); occZr = rM; UZ.uRhoS.value = UL.uRhoS.value = RHO_S;
    occL.set(100, 0, 0); occLr = 0;
    // the point on the Earth nearest to the shadow axis, and the sky seen from there
    const q = Math.abs(zM) / s, osrednji = q < R_E;
    const px = osrednji ? Math.sqrt(R_E * R_E - q * q) : 0, pz = osrednji ? q : R_E; // km from the Earth's centre (towards the Moon, sideways)
    const dx = razdalja - px, dz = q - pz, dist = Math.hypot(dx, dz);
    const rhoM = Math.asin(R_M / dist), rhoS = Math.asin(R_S / (AU - px)), sig = Math.atan2(Math.abs(dz), dx);
    const f = zakritje(rhoS, rhoM, sig);
    const pas = R_M - (dist * (R_S - R_M)) / (AU - razdalja); // umbra radius at the surface (km), < 0: antumbra
    RA.f = f; RA.rhoM = rhoM; RA.rhoS = rhoS; RA.sig = sig; RA.sgn = Math.sign(zM) || 1; RA.pas = pas; RA.Lu = Lu;
    RA.vrsta = f <= 0 ? "ni" : sig <= Math.abs(rhoM - rhoS) ? (rhoM >= rhoS ? "popolni" : "kolobarjasti") : "delni";
    // labels
    L.sonce.position.set(-0.84, -0.12, 0);
    L.zemlja.position.set(xE, -rE - 0.03, 0);
    L.luna.position.set(xM, -rM - 0.03, zM);
    L.senca.position.set((xM + Math.min(xT, xE - rE)) / 2, rM * 0.5 + 0.035, zM);
    const xp = xM + (xE - rE - xM) * 0.72;
    L.polsenca.position.set(xp, rM + ((xp - xM) / kx) * tanP * s + 0.02, zM);
    L.podaljsek.position.set((xT + xE - rE) / 2, -0.04, zM);
    T("sonce", -0.84, 0.05, 0); T("zemlja", xE - rE * 0.7, rE * 0.45, 0); T("luna", xM, 0, zM);
    T("senca", (xM + Math.min(xT, xE - rE)) / 2, 0, zM); T("polsenca", xp, rM * 1.6, zM); T("podaljsek", (xT + xE - rE) / 2, 0, zM);
  }
  function postaviLunin() {
    const s = 0.22 / R_E, xE = -0.3, rE = 0.22, rM = R_M * s, k = 0.82 / D_M;
    const xM = xE + D_M * k, zM = lega * 0.42, xK = 0.84;
    zem.position.set(xE, 0, 0); zem.scale.setScalar(rE);
    luna.position.set(xM, 0, zM); luna.scale.setScalar(rM); luna.rotation.y = Math.PI;
    const tanU = (R_S - R_E) / AU, tanP = (R_S + R_E) / AU, km = (xK - xE) / k;
    oblikuj(senca, xE, rE, xK, (R_E - km * tanU) * s, 0, 0);
    oblikuj(polsenca, xE, rE, xK, (R_E + km * tanP) * s, 0, 0);
    occL.set(xM - D_M * s, 0, 0); occLr = rE * 1.02; UL.uRhoS.value = UZ.uRhoS.value = RHO_S;
    occZ.set(100, 0, 0); occZr = 0;
    // classification at the Moon's distance
    const u = R_E * 1.02 - D_M * tanU, p = R_E * 1.02 + D_M * tanP, q = Math.abs(zM) / s;
    RB.u = u; RB.p = p; RB.q = q; RB.zM = zM / s;
    RB.vrsta = q + R_M <= u ? "popolni" : q - R_M < u ? "delni" : q - R_M < p ? "polsencni" : "ni";
    // two rays bent by the atmosphere into the umbra
    const lp = lomGeo.attributes.position, xa = xE, cilj = xM;
    [1, -1].forEach((sg, i) => {
      const y0 = sg * (rE + 0.006);
      lp.setXYZ(i * 8, xa - 0.42, y0, 0); lp.setXYZ(i * 8 + 1, xa - 0.02, y0, 0);
      lp.setXYZ(i * 8 + 2, xa - 0.02, y0, 0); lp.setXYZ(i * 8 + 3, xa + 0.03, y0 * 0.995, 0);
      lp.setXYZ(i * 8 + 4, xa + 0.03, y0 * 0.995, 0); lp.setXYZ(i * 8 + 5, cilj - 0.03, sg * 0.012, 0);
      lp.setXYZ(i * 8 + 6, cilj - 0.03, sg * 0.012, 0); lp.setXYZ(i * 8 + 7, cilj - 0.03, sg * 0.012, 0);
    });
    lp.needsUpdate = true; lomGeo.computeBoundingSphere();
    L.sonce.position.set(-0.84, -0.12, 0);
    L.zemlja.position.set(xE, -rE - 0.03, 0);
    L.luna.position.set(xM, -rM - 0.03, zM);
    L.senca.position.set(xM - 0.2, (R_E - ((xM - 0.2 - xE) / k) * tanU) * s * 0.5, 0);
    L.polsenca.position.set(xM - 0.16, (R_E + ((xM - 0.16 - xE) / k) * tanP) * s + 0.02, 0);
    L.lom.position.set(xE + 0.33, -0.165, 0);
    T("sonce", -0.84, 0.05, 0); T("zemlja", xE - rE * 0.7, rE * 0.45, 0); T("luna", xM, 0, zM);
    T("senca", xM - 0.2, 0, 0); T("polsenca", xM - 0.16, (R_E + ((xM - 0.16 - xE) / k) * tanP) * s * 0.85, 0); T("lom", xE + 0.12, rE * 0.96, 0);
  }
  function postaviZakaj() {
    const kk = povecaj ? 5 : 1, rT = 0.72, inc = kk * NAGIB_LUNE * D, Om = vozel * D, E = ((dan / SINODSKI) * 360 % 360) * D;
    const rE = rT * Math.tan(kk * PI_M), rM = rT * Math.tan(kk * RHO_M);
    zem.position.set(0, 0, 0); zem.scale.setScalar(rE);
    lunaNaTirnici(E, Om, inc, luna.position).multiplyScalar(rT); luna.scale.setScalar(rM);
    luna.rotation.y = Math.atan2(luna.position.z, -luna.position.x);
    // orbit, coloured above / below the ecliptic, with stems
    const tp = tirGeo.attributes.position, tc = tirGeo.attributes.color;
    for (let k = 0; k < NT; k++) for (const j of [0, 1]) {
      lunaNaTirnici(((k + j) / NT) * 2 * Math.PI, Om, inc, v1).multiplyScalar(rT);
      tp.setXYZ(k * 2 + j, v1.x, v1.y, v1.z);
      const nad = Math.sin(((k + 0.5) / NT) * 2 * Math.PI - Om) >= 0;
      if (nad) tc.setXYZ(k * 2 + j, 0.95, 0.97, 1); else tc.setXYZ(k * 2 + j, 0.5, 0.58, 0.76);
    }
    tp.needsUpdate = tc.needsUpdate = true;
    const sp = stebGeo.attributes.position;
    for (let k = 0; k < NS; k++) {
      lunaNaTirnici((k / NS) * 2 * Math.PI, Om, inc, v1).multiplyScalar(rT);
      sp.setXYZ(k * 2, v1.x, v1.y, v1.z); sp.setXYZ(k * 2 + 1, v1.x, 0, v1.z);
    }
    sp.needsUpdate = true;
    smer(Om, v1).multiplyScalar(rT);
    const vp = vozGeo.attributes.position;
    vp.setXYZ(0, v1.x, 0, v1.z); vp.setXYZ(1, -v1.x, 0, -v1.z); vp.needsUpdate = true; vozelna.computeLineDistances();
    m4.makeTranslation(v1.x, 0, v1.z); vozla.setMatrixAt(0, m4); m4.makeTranslation(-v1.x, 0, -v1.z); vozla.setMatrixAt(1, m4); vozla.instanceMatrix.needsUpdate = true;
    L.dvizni.position.set(v1.x, 0.025, v1.z); L.spustni.position.set(-v1.x, 0.025, -v1.z);
    T("dvizni", v1.x, 0, v1.z); T("spustni", -v1.x, 0, -v1.z);
    // shadows: the Earth's towards +x, the Moon's from the Moon towards +x
    const xK = 0.95;
    oblikuj(senca, 0, rE, xK, Math.max(0.0005, rE - xK * Math.tan(kk * Math.asin((R_S - R_E) / AU))), 0, 0);
    oblikuj(polsenca, 0, rE, xK, rE + xK * Math.tan(kk * Math.asin((R_S + R_E) / AU)), 0, 0);
    const M = luna.position, lMax = Math.max(0.05, -M.x + Math.sqrt(Math.max(0, 0.97 * 0.97 - M.y * M.y - M.z * M.z)));
    const tu = Math.tan(kk * Math.asin((R_S - R_M) / AU)), tpM = Math.tan(kk * Math.asin((R_S + R_M) / AU)), Lu = rM / tu;
    const Lp = Math.min(lMax, rT * 1.1);
    oblikuj(sencaM, M.x, rM, M.x + Math.min(Lu, Lp), Lu > Lp ? rM * (1 - Lp / Lu) : 0, M.y, M.z);
    oblikuj(polsencaM, M.x, rM, M.x + Lp, rM + Lp * tpM, M.y, M.z);
    occZ.copy(M); occZr = rM; UZ.uRhoS.value = kk * RHO_S;
    occL.set(0, 0, 0); occLr = rE * 1.02; UL.uRhoS.value = kk * RHO_S;
    // true geometry for the readouts
    lunaNaTirnici(E, Om, NAGIB_LUNE * D, v2);
    const sep = Math.acos(Math.min(1, Math.max(-1, -v2.x))), beta = Math.asin(v2.y);
    let odVozla = (((E - Om) / D) % 180 + 180) % 180; if (odVozla > 90) odVozla = 180 - odVozla;
    RC.sep = sep; RC.beta = beta; RC.E = E / D; RC.odVozla = odVozla;
    const anti = Math.PI - sep;
    RC.vrsta = sep < RHO_S + RHO_M + PI_M - PI_S ? "soncni" : anti < F_U - RHO_M ? "popolni-lunin" : anti < F_U + RHO_M ? "delni-lunin" : anti < F_P + RHO_M ? "polsencni" : "ni";
    L.zemlja.position.set(0, -rE - 0.02, 0);
    L.luna.position.set(M.x, M.y - rM - 0.02, M.z);
    L.svetloba.position.set(-0.87, 0.16, 0);
    L.senca.position.set(0.86, rE * 0.4 + 0.02, 0);
    L.ekliptika.position.set(0.2, -0.02, 0.8);
    T("zemlja", 0, rE * 0.5, 0); T("luna", M.x, M.y, M.z); T("senca", 0.6, 0, 0);
    lunaNaTirnici(Om + Math.PI / 2, Om, inc, v2).multiplyScalar(rT); T("tirnica", v2.x, v2.y, v2.z);
    T("ekliptika", 0.2, 0, 0.75); T("svetloba", -0.87, 0, 0);
  }
  const m4 = new THREE.Matrix4();

  // ---- inset: the sky from the Earth (solar) or the Moon as seen from the Earth (lunar)
  const V = o.vlozek(group, 200, 208, 220);
  const obraz = document.createElement("canvas");
  const RV = 50;
  obraz.width = obraz.height = RV * 4;
  function obrazLune() {
    const w = visoka ? 512 : 256;
    const tw = SLIKE.has("luna" + w) ? w : Math.max(64, w / 4), vir = SLIKE.get("luna" + tw);
    if (!vir) return;
    const th = tw / 2, px = vir.barva, N = RV * 4, c2 = obraz.getContext("2d"), img = c2.createImageData(N, N), d = img.data;
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      const x = ((i + 0.5) / N) * 2 - 1, y = 1 - ((j + 0.5) / N) * 2, r2 = x * x + y * y, k = (j * N + i) * 4;
      if (r2 > 1) { d[k + 3] = 0; continue; }
      const z = Math.sqrt(1 - r2), lat = Math.asin(y), lon = Math.atan2(x, z);
      const fu = (lon / (2 * Math.PI) + 0.5) * tw - 0.5, fv = Math.min(th - 1, Math.max(0, (0.5 - lat / Math.PI) * th - 0.5));
      const u0 = Math.floor(fu), v0 = Math.floor(fv), au = fu - u0, av = fv - v0, v1 = Math.min(th - 1, v0 + 1);
      const s00 = (v0 * tw + ((u0 + tw) % tw)) * 4, s10 = (v0 * tw + ((u0 + 1) % tw)) * 4, s01 = (v1 * tw + ((u0 + tw) % tw)) * 4, s11 = (v1 * tw + ((u0 + 1) % tw)) * 4;
      const tex = (c) => (px[s00 + c] * (1 - au) + px[s10 + c] * au) * (1 - av) + (px[s01 + c] * (1 - au) + px[s11 + c] * au) * av;
      const l = 0.85 + 0.15 * z;
      d[k] = tex(0) * l; d[k + 1] = tex(1) * l; d[k + 2] = tex(2) * l; d[k + 3] = 255 * Math.min(1, (1 - Math.sqrt(r2)) * N * 0.5);
    }
    c2.putImageData(img, 0, 0);
  }
  obrazLune();
  const NL = 40, svetCv = document.createElement("canvas");
  svetCv.width = svetCv.height = NL;
  const IME = {
    popolni: "popolni sončni mrk", kolobarjasti: "kolobarjasti sončni mrk", delni: "delni sončni mrk", ni: "ni mrka",
  };
  const IME_L = { popolni: "popolni Lunin mrk", delni: "delni Lunin mrk", polsencni: "polsenčni Lunin mrk", ni: "ni mrka" };
  let zadnjiV = null;
  function risiVlozek() {
    V.s.visible = !zakaj();
    if (zakaj()) return;
    const kljuc = vrsta + Math.round(lega * 400) + "|" + razdalja;
    if (kljuc === zadnjiV) return;
    zadnjiV = kljuc;
    const c = V.c2, w = V.w, h = V.h, cx = w / 2, cy = 102;
    o.ploscica(c, w, h);
    c.textAlign = "center"; c.textBaseline = "alphabetic";
    if (vrsta === "soncni") {
      c.fillStyle = "#e8edf7"; c.font = o.font(600, 13); c.fillText("Pogled proti Soncu", cx, 21);
      c.fillStyle = "#9aa6bf"; let fs = 10.5; c.font = o.font(500, fs);
      while (fs > 8.5 && c.measureText("z mesta na Zemlji, najbližjega osi sence").width > w - 20) c.font = o.font(500, (fs -= 0.5));
      c.fillText("z mesta na Zemlji, najbližjega osi sence", cx, 36);
      const K = 30 / RA.rhoS, rS = 30, rL = K * RA.rhoM, off = Math.min(K * RA.sig, 120) * RA.sgn;
      c.save(); c.beginPath(); c.arc(cx, cy, 58, 0, 2 * Math.PI); c.clip();
      const nebo = 1 - RA.f;
      c.fillStyle = `rgb(${Math.round(8 + 40 * nebo)},${Math.round(12 + 70 * nebo)},${Math.round(22 + 110 * nebo)})`; c.fillRect(cx - 60, cy - 60, 120, 120);
      if (RA.vrsta === "popolni") {
        const g = c.createRadialGradient(cx, cy, rS * 0.9, cx, cy, rS * 2.6);
        g.addColorStop(0, "rgba(235,240,255,0.85)"); g.addColorStop(0.3, "rgba(200,215,255,0.35)"); g.addColorStop(1, "rgba(180,200,255,0)");
        c.fillStyle = g; c.fillRect(cx - 60, cy - 60, 120, 120);
      }
      const gs = c.createRadialGradient(cx, cy, 0, cx, cy, rS);
      gs.addColorStop(0, "#fff8e0"); gs.addColorStop(0.7, "#ffe08a"); gs.addColorStop(1, "#ffb347");
      c.fillStyle = gs; c.beginPath(); c.arc(cx, cy, rS, 0, 2 * Math.PI); c.fill();
      c.fillStyle = "#11141b"; c.beginPath(); c.arc(cx - off, cy, rL, 0, 2 * Math.PI); c.fill();
      c.restore();
      c.strokeStyle = "rgba(200,212,238,0.25)"; c.beginPath(); c.arc(cx, cy, 58, 0, 2 * Math.PI); c.stroke();
      c.fillStyle = "#e8edf7"; c.font = o.font(600, 14); c.fillText(IME[RA.vrsta], cx, cy + 80);
      c.fillStyle = "#9aa6bf"; c.font = o.font(500, 11.5);
      c.fillText(RA.vrsta === "ni" ? "Luna zgreši Sonce" : `prekritega je ${Math.round(RA.f * 100)} % Sonca`, cx, cy + 95);
    } else {
      c.fillStyle = "#e8edf7"; c.font = o.font(600, 13); c.fillText("Luna, kot jo vidimo z Zemlje", cx, 21);
      // light on the Moon's face: low-resolution map multiplied over the Moon's picture
      const sc = svetCv.getContext("2d"), img = sc.createImageData(NL, NL), d = img.data;
      const b = Math.asin((R_E * 1.02) / D_M), zc = RB.zM;
      for (let j = 0; j < NL; j++) for (let i = 0; i < NL; i++) {
        const x = ((i + 0.5) / NL) * 2 - 1, y = 1 - ((j + 0.5) / NL) * 2, k = (j * NL + i) * 4;
        const sig = Math.hypot(zc + x * R_M, y * R_M) / D_M, f = zakritje(RHO_S, b, sig);
        const rd = 1.4 * Math.min(1, Math.max(0, (f - 0.95) / 0.05)) ** 2 * (3 - 2 * Math.min(1, Math.max(0, (f - 0.95) / 0.05)));
        d[k] = 255 * Math.min(1, 1 - f + 0.62 * rd); d[k + 1] = 255 * (1 - f + 0.2 * rd); d[k + 2] = 255 * (1 - f + 0.08 * rd); d[k + 3] = 255;
      }
      sc.putImageData(img, 0, 0);
      c.save(); c.beginPath(); c.arc(cx, cy, RV, 0, 2 * Math.PI); c.clip();
      c.drawImage(obraz, cx - RV, cy - RV, RV * 2, RV * 2);
      c.globalCompositeOperation = "multiply"; c.imageSmoothingEnabled = true;
      c.drawImage(svetCv, cx - RV, cy - RV, RV * 2, RV * 2);
      c.restore();
      // outline of the Earth's umbra and penumbra at the Moon's distance
      const K = RV / R_M, sx = cx - zc * K;
      c.save(); c.beginPath(); c.rect(6, 30, w - 12, 140); c.clip();
      c.setLineDash([4, 4]); c.lineWidth = 1.2;
      c.strokeStyle = "rgba(255,140,90,0.8)"; c.beginPath(); c.arc(sx, cy, RB.u * K, 0, 2 * Math.PI); c.stroke();
      c.strokeStyle = "rgba(160,180,220,0.6)"; c.beginPath(); c.arc(sx, cy, RB.p * K, 0, 2 * Math.PI); c.stroke();
      c.restore(); c.setLineDash([]);
      c.fillStyle = "#e8edf7"; c.font = o.font(600, 14); c.fillText(IME_L[RB.vrsta], cx, cy + 80);
      c.fillStyle = "#9aa6bf"; c.font = o.font(500, 11.5); c.fillText(RB.vrsta === "ni" ? "Luna je zunaj Zemljine sence" : `v Zemljini senci je ${Math.round(zakritje(R_M, RB.u, RB.q) * 100)} % Lune`, cx, cy + 95);
    }
    V.t.needsUpdate = true;
  }

  const del = (id, ime, opis, barva, meshes) => ({ id, ime, opis, barva, meshes, tocka: (tockeG[id] = tockeG[id] || [0, 0, 0]) });
  let deli = [];
  function sestaviDele() {
    const zemOpis = "Zemljina os je v modelu pokončna. Zemlja in Luna sta v pravem razmerju velikosti, razdalje pa so skrajšane in Sonce ni v merilu.";
    if (vrsta === "soncni") deli = [
      del("sonce", "Sonce", "Sonce je 400-krat večje od Lune, a tudi okoli 400-krat dlje, zato sta na nebu skoraj enako veliki. V modelu je Sonce narisano zelo blizu in premajhno.", "#ffc35a", [S.mesh]),
      del("luna", "Luna", "Ob mlaju je Luna med Soncem in Zemljo; proti nam je obrnjena njena neosvetljena stran. Mrk nastane le, če je takrat tudi zelo blizu ravnine Zemljine tirnice.", "#c9c6bf", [luna]),
      del("senca", "Senca", "V senci Lune je Sonce popolnoma zakrito. Senca je dolga okoli 374 000 km, zato Zemljo doseže le, kadar je Luna dovolj blizu; na Zemlji je široka največ okoli 270 km.", "#ff9e6b", [senca]),
      del("polsenca", "Polsenca", "V polsenci Luna zakriva le del Sonca: tam vidijo delni sončni mrk. Polsenca je na Zemlji široka okoli 7000 km.", "#9fb4dc", [polsenca]),
      del("podaljsek", "Podaljšek sence", "Če je Luna predaleč, se njena senca konča pred Zemljo. Kjer pade podaljšek sence (antumbra), je Luna na nebu manjša od Sonca in okoli nje ostane svetel kolobar: kolobarjasti mrk.", "#ffcf7a", [podaljsek]),
      del("zemlja", "Zemlja", "Na mestu, kamor pade Lunina senca, je za nekaj minut tema kot ponoči in vidimo Sončevo korono. " + zemOpis, "#4f8fe0", [Z.mesh, Z.oblaki]),
    ];
    else if (vrsta === "lunin") deli = [
      del("sonce", "Sonce", "Sonce osvetljuje Zemljo, ta pa meče za seboj dolgo senco, več kot 1,3 milijona km. V modelu je Sonce narisano zelo blizu in premajhno.", "#ffc35a", [S.mesh]),
      del("zemlja", "Zemlja", "Lunin mrk vidijo naenkrat vsi, ki imajo tedaj Luno nad obzorjem, torej vsa nočna polovica Zemlje. " + zemOpis, "#4f8fe0", [Z.mesh, Z.oblaki]),
      del("senca", "Zemljina senca", "Pri Luni je Zemljina senca široka okoli 9400 km, skoraj trikrat toliko kot Luna, zato lahko popolni Lunin mrk traja več kot uro in pol.", "#ff9e6b", [senca]),
      del("polsenca", "Zemljina polsenca", "V polsenci Zemlja zakriva le del Sonca, zato Luna le malo potemni; polsenčni mrk je s prostim očesom težko opaziti.", "#9fb4dc", [polsenca]),
      del("luna", "Luna", "Ob ščipu je Luna za Zemljo. Ko zaide v Zemljino senco, ne izgine, ampak postane temno rdeča: Zemljino ozračje lomi sončno svetlobo v senco, modro svetlobo pa sproti razprši, zato pride do Lune predvsem rdeča. Barva je v modelu svetlejša kot v resnici.", "#c9c6bf", [luna]),
      del("lom", "Lom svetlobe v ozračju", "Sončni žarki, ki gredo tik ob Zemlji skozi ozračje, se upognejo v senco. Ozračje modro svetlobo razprši (zato je nebo modro), rdeča pa gre naprej, kot pri sončnem zahodu.", "#ff7a4d", [lom]),
    ];
    else deli = [
      del("ekliptika", "Ravnina ekliptike", "To je ravnina, v kateri Zemlja kroži okoli Sonca; Sonce je vedno v njej. Senci Zemlje in Lune ležita na premici skozi Sonce, zato zadeneta drugo telo le, kadar sta obe telesi v tej ravnini.", "#6e9bff", [ekliptika]),
      del("tirnica", "Lunina tirnica", "Lunina tirnica je proti ekliptiki nagnjena za 5,1°. Svetlejši del je nad ravnino ekliptike, temnejši pod njo; navpične črte kažejo, kako visoko je Luna. Ob večini mlajev in ščipov je Luna nad ali pod senco.", "#d6e0f5", [tirnica]),
      del("dvizni", "Dvižni vozel", "Na tem mestu Luna prečka ravnino ekliptike navzgor. Mrk je mogoč le, če je ob mlaju ali ščipu Luna blizu enega od vozlov.", "#ffd166", [vozla]),
      del("spustni", "Spustni vozel", "Tu Luna prečka ekliptiko navzdol. Vozelna črta se počasi suka, zato Sonce pride v smer vozlov vsakih 173 dni: takrat je obdobje mrkov.", "#ffd166", [vozelna]),
      del("zemlja", "Zemlja", "Zemlja je v središču. Njena senca je usmerjena stran od Sonca; Luna jo zadene samo ob ščipu blizu vozla. Pri vklopljeni povečavi so vsi koti in velikosti petkrat večji, razmerja med njimi pa prava.", "#4f8fe0", [Z.mesh, Z.oblaki]),
      del("luna", "Luna", "Luna kroži okoli Zemlje; senca za njo kaže, kam pade. Ob mlaju zadene Zemljo le, če je Luna tedaj blizu vozla, sicer gre nad ali pod Zemljo.", "#c9c6bf", [luna]),
      del("senca", "Zemljina senca", "Zemljina senca je pri Luni široka le okoli 1,4°, Luna pa je lahko kar 5,1° nad ali pod ekliptiko. Zato ob večini ščipov Luna zgreši senco.", "#ff9e6b", [senca]),
    ];
  }

  function osvezi() {
    const A = vrsta === "soncni", B = vrsta === "lunin", C = zakaj();
    gC.visible = C;
    S.g.visible = !C; zarki.visible = C; lom.visible = B;
    polsencaM.visible = sencaM.visible = C;
    podaljsek.visible = false;
    if (A) postaviSoncni(); else if (B) postaviLunin(); else postaviZakaj();
    L.sonce.visible = L.polsenca.visible = !C; L.svetloba.visible = C; L.lom.visible = B; L.podaljsek.visible = A && podaljsek.visible;
    L.dvizni.visible = L.spustni.visible = L.ekliptika.visible = C;
    risiVlozek();
  }
  function nastaviVrsto(v) { vrsta = VRSTE.includes(v) ? v : "soncni"; sestaviDele(); osvezi(); izhod.deli = deli; }

  const ali = (f) => () => vrsta === f;
  const kot = (r) => stevilo(r / D, 2) + "°";
  const ZAKAJ_S = {
    popolni: "Luna je dovolj blizu, da njena senca doseže Zemljo. Tam je Luna na nebu večja od Sonca in ga povsem prekrije.",
    kolobarjasti: "Luna je predaleč: njena senca se konča pred Zemljo. Luna je na nebu manjša od Sonca, zato okoli nje ostane svetel kolobar.",
    delni: "Na Zemljo pade le polsenca, zato Luna zakrije samo del Sonca.",
    ni: "Luna ni na premici Sonce–Zemlja, zato gresta senca in polsenca mimo Zemlje.",
  };
  const ZAKAJ_L = {
    popolni: "Vsa Luna je v Zemljini senci. Rdeča je, ker Zemljino ozračje lomi sončno svetlobo v senco in prepusti predvsem rdečo.",
    delni: "Le del Lune je v Zemljini senci; ta del je temen in rdečkast.",
    polsencni: "Luna je le v polsenci: nanjo pade del sončne svetlobe, zato le malo potemni.",
    ni: "Luna je mimo Zemljine sence in polsence.",
  };
  const nadzor = [
    { tip: "izbira", id: "vrsta", oznaka: "Prikaz", moznosti: [["soncni", "Sončni mrk"], ["lunin", "Lunin mrk"], ["zakaj", "Zakaj ni mrka vsak mesec"]], vrednost: vrsta, ob: (v) => nastaviVrsto(v) },
    { tip: "drsnik", id: "lega", oznaka: "Lega Lune (prečno na premico Sonce–Zemlja)", min: -1, max: 1, korak: 0.01, get vrednost() { return Math.round(lega * 100) / 100; }, vidno: () => !zakaj(), ob: (v) => { lega = num(v, -1, 1, 0); osvezi(); } },
    { tip: "drsnik", id: "razdalja", oznaka: "Razdalja Luna–Zemlja (od perigeja do apogeja)", min: PERIGEJ, max: APOGEJ, korak: 100, vrednost: razdalja, vidno: ali("soncni"), ob: (v) => { razdalja = num(v, PERIGEJ, APOGEJ, 365000); osvezi(); } },
    { tip: "drsnik", id: "dan", oznaka: "Lega Lune na tirnici (dan od mlaja)", min: 0, max: 29.5, korak: 0.1, get vrednost() { return Math.round(dan * 10) / 10; }, vidno: zakaj, ob: (v) => { dan = num(v, 0, 29.5, 0); osvezi(); } },
    { tip: "drsnik", id: "vozel", oznaka: "Smer vozelne črte glede na Sonce", min: 0, max: 359, korak: 1, get vrednost() { return Math.round(vozel) % 360; }, vidno: zakaj, ob: (v) => { vozel = num(v, 0, 359, 35); osvezi(); } },
    { tip: "stikalo", id: "povecaj", oznaka: "Povečaj kote in telesa 5-krat", vrednost: povecaj, vidno: zakaj, ob: (v) => { povecaj = !!v; osvezi(); } },
    { tip: "stikalo", id: "predvajaj", oznaka: "Predvajaj", vrednost: tece, vidno: () => gib, ob: (v) => { tece = !!v; } },
    { tip: "izpis", id: "vrsta-mrka", oznaka: "Mrk", vrednost: () => {
      if (vrsta === "soncni") return IME[RA.vrsta];
      if (vrsta === "lunin") return IME_L[RB.vrsta];
      return { soncni: "ob mlaju: sončni mrk", "popolni-lunin": "ob ščipu: popolni Lunin mrk", "delni-lunin": "ob ščipu: delni Lunin mrk", polsencni: "ob ščipu: polsenčni Lunin mrk", ni: "ni mrka" }[RC.vrsta];
    } },
    { tip: "izpis", id: "zakaj-s", oznaka: "Zakaj", vidno: ali("soncni"), vrednost: () => ZAKAJ_S[RA.vrsta] },
    { tip: "izpis", id: "zakaj-l", oznaka: "Zakaj", vidno: ali("lunin"), vrednost: () => ZAKAJ_L[RB.vrsta] },
    { tip: "izpis", id: "velikosti", oznaka: "Velikost na nebu", vidno: ali("soncni"), vrednost: () => `Luna ${kot(2 * RA.rhoM)}, Sonce ${kot(2 * RA.rhoS)}` },
    { tip: "izpis", id: "dolzina", oznaka: "Dolžina Lunine sence", vidno: ali("soncni"), vrednost: () => {
      const pas = 2 * Math.abs(RA.pas);
      return `${tisoc(Math.round(RA.Lu / 100) * 100)} km; Luna je ${tisoc(razdalja)} km daleč` + (RA.vrsta === "popolni" ? ` (pas popolnosti ≈ ${tisoc(Math.round(pas / 10) * 10)} km)` : "");
    } },
    { tip: "izpis", id: "senca-l", oznaka: "Zemljina senca pri Luni", vidno: ali("lunin"), vrednost: () => `polmer ${tisoc(Math.round(RB.u / 100) * 100)} km = ${stevilo(RB.u / R_M, 1)} Luninega polmera; polsenca ${tisoc(Math.round(RB.p / 100) * 100)} km` },
    { tip: "izpis", id: "beta", oznaka: "Luna glede na ekliptiko", vidno: zakaj, vrednost: () => `${Math.abs(RC.beta / D) < 0.05 ? "v ravnini ekliptike" : `${stevilo(Math.abs(RC.beta / D), 1)}° ${RC.beta > 0 ? "nad" : "pod"} ekliptiko`}, ${stevilo(RC.odVozla, 0)}° od vozla` },
    { tip: "izpis", id: "zakaj-c", oznaka: "Zakaj", vidno: zakaj, vrednost: () => {
      const E = RC.E, mlaj = E < 15 || E > 345, scip = Math.abs(E - 180) < 15;
      if (RC.vrsta === "soncni") return "Mlaj je blizu vozla: Luna je skoraj v ravnini ekliptike, zato njena senca zadene Zemljo.";
      if (RC.vrsta !== "ni") return "Ščip je blizu vozla: Luna je skoraj v ravnini ekliptike, zato zaide v Zemljino senco.";
      if (mlaj) return "Mlaj je predaleč od vozla: Lunina senca gre " + (RC.beta > 0 ? "nad" : "pod") + " Zemljo.";
      if (scip) return "Ščip je predaleč od vozla: Luna gre " + (RC.beta > 0 ? "nad" : "pod") + " Zemljino senco.";
      return "Mrk je mogoč le ob mlaju (sončni) ali ščipu (Lunin), in samo, če je Luna tedaj blizu vozla.";
    } },
    { tip: "izpis", id: "merilo", oznaka: "Merilo", vrednost: () => zakaj()
      ? (povecaj ? "koti in velikosti 5-krat povečani; Luna kroži 12 Zemljinih polmerov daleč (v resnici 60)" : "pravi koti; Luna kroži 60 Zemljinih polmerov daleč, telesa so zato drobna")
      : "Zemlja in Luna v pravem razmerju; razdalje skrajšane, Sonce ni v merilu; senci izračunani iz pravih polmerov in razdalj" },
  ];

  postaviSoncni(); postaviLunin(); postaviZakaj();
  sestaviDele();
  osvezi();
  o.zazeni();
  const izhod = {
    group,
    deli,
    nadzor,
    merilo: () => null,
    luci: false,
    korak(t, dt) {
      if (!gib) return;
      const k = Math.min(Math.max(dt, 0), 0.1);
      S.sMat.uniforms.uTime.value += k;
      if (!tece) return;
      if (zakaj()) { dan = (dan + 2 * k) % SINODSKI; vozel = (((vozel - ((2 * k * 360) / MRKOVNO_LETO)) % 360) + 360) % 360; }
      else lega = lega + k * 0.25 > 1 ? -1 : lega + k * 0.25;
      osvezi();
    },
    dispose() { o.pocisti(); group.clear(); },
  };
  // the kit re-reads »deli« after every ob(); keep the returned object in sync
  return izhod;
}

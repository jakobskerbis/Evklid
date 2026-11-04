// Letni časi: Zemlja kroži okoli Sonca z nagnjeno osjo, ki vedno kaže proti Severnici (pogodba v docs/3d.md).
//
// Data (verified 2026-11 with node against these sources):
// - Sun's apparent ecliptic longitude λ, distance r and declination δ: low-precision formulae of the Astronomical
//   Almanac (section C, »Sun«), used also by NOAA: L = 280,460° + 0,9856474° d, g = 357,528° + 0,9856003° d,
//   λ = L + 1,915° sin g + 0,020° sin 2g, r = 1,00014 − 0,01671 cos g − 0,00014 cos 2g a. e., sin δ = sin ε sin λ.
//   Checked for 2026 against USNO »Earth's Seasons«: enakonočje 20. 3. 14:46 UT, sončev obrat 21. 6. 8:24 UT,
//   enakonočje 23. 9. 0:05 UT, sončev obrat 21. 12. 20:50 UT (formula within 1 h); perihelion 3. 1. 2026, 147,10 mio km.
// - Axial tilt ε = 23,44° (IAU 2006: 23,4393° at J2000). Ljubljana 46,05° N, 14,51° E.
// - Noon altitude h = 90° − φ + δ; day length from cos ω = −tan φ · tan δ (geometric centre of the Sun, no
//   refraction): 21. 6. 15 h 34 min, 21. 12. 8 h 26 min.
// Textures (Earth, clouds, Sun) are drawn in code, the same as in soncni-sistem.js.

export const info = {
  id: "letni-casi",
  naslov: "Letni časi",
  podrocje: "vesolje",
  predmet: "NAR",
  opis: "Zemlja kroži okoli Sonca z nagnjeno osjo, ki ves čas kaže proti Severnici. Izberi dan v letu in poglej, kako visoko je opoldne Sonce v Ljubljani in kako dolg je dan.",
  merilo: { m: 2.992e11, oznaka: "premer Zemljine tirnice ≈ 300 milijonov km" },
  poskusi: "premakni »Dan v letu« na 21. junij in na 21. december ter primerjaj višino Sonca in dolžino dneva v Ljubljani.",
};

const D = Math.PI / 180;
const J2000 = Date.UTC(2000, 0, 1, 12);
const LETO = 2026;
const NAGIB = 23.44;
const LJ_FI = 46.05, LJ_LAMBDA = 14.51;
const R_SONCE = 0.12, R_ZEMLJA = 0.15, K_TIR = 0.7; // model units; K_TIR per astronomical unit
const AU_MIO = 149.5978707;

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

// ---------------------------------------------------------------- the Sun's position during the year
function sonceNaDan(dan, out) {
  const d = (Date.UTC(LETO, 0, 1, 12) + (dan - 1) * 864e5 - J2000) / 864e5;
  const L = 280.46 + 0.9856474 * d, g = (357.528 + 0.9856003 * d) * D;
  const lam = (((L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) % 360) + 360) % 360;
  out.lam = lam;
  out.r = 1.00014 - 0.01671 * Math.cos(g) - 0.00014 * Math.cos(2 * g);
  out.dek = Math.asin(Math.sin(NAGIB * D) * Math.sin(lam * D)) / D;
  return out;
}
// Days (fractional, 1 = 1. 1. noon) when λ = 0°, 90°, 180°, 270°.
const TOCKE = (() => {
  const s = {}, t = [];
  for (const k of [0, 90, 180, 270]) {
    let a = 1, b = 366;
    const f = (x) => ((((sonceNaDan(x, s).lam - k) % 360) + 540) % 360) - 180;
    let x0 = 1;
    for (let x = 1; x <= 366; x += 1) if (f(x) < 0 && f(x + 1) >= 0) { x0 = x; break; }
    a = x0; b = x0 + 1;
    for (let i = 0; i < 30; i++) { const m = (a + b) / 2; if (f(m) < 0) a = m; else b = m; }
    t.push(a);
  }
  return t;
})();
const IMENA_TOCK = ["pomladno enakonočje", "poletni sončev obrat", "jesensko enakonočje", "zimski sončev obrat"];
const CASI = ["pomlad", "poletje", "jesen", "zima"];
function datum(dan) {
  const t = new Date(Date.UTC(LETO, 0, 1) + (Math.floor(dan + 0.5) - 1) * 864e5);
  return [t.getUTCDate(), t.getUTCMonth()];
}
const kratko = (dan) => { const [d, m] = datum(dan); return `${d}. ${m + 1}.`; };
const dolgo = (dan) => { const [d, m] = datum(dan); return `${d}. ${MESECI[m]}`; };
const ura = (h) => { let m = Math.round(h * 60); m = ((m % 1440) + 1440) % 1440; return `${Math.floor(m / 60)}.${String(m % 60).padStart(2, "0")}`; };
const predznak = (x, d) => (x >= 0.5 * 10 ** -d ? "+" : "") + stevilo(x, d);

// ---------------------------------------------------------------- builder
export function zgradi(THREE, ctx) {
  const o = orodja(THREE, ctx);
  const { visoka, hrani } = o;
  const gib = ctx.gibanje !== false, z0 = ctx.zacetek || {};
  const seg = (n) => (visoka ? n : Math.round(n / 2));
  const group = new THREE.Group();
  group.name = "letni-casi";
  // The scene is turned so that the June Earth is seen from the side at the default camera.
  const svet = new THREE.Group();
  svet.rotation.y = -55 * D;
  group.add(svet);

  const snov = (op) => hrani(new THREE.MeshStandardMaterial({ roughness: 0.92, metalness: 0, ...op }));
  const luc = new THREE.PointLight(0xfff2dc, 3.3, 0, 0);
  const okolje = new THREE.AmbientLight(0x9fb0d0, 0.12);
  svet.add(luc, okolje);

  // ---- Sun
  const S = o.sonce(R_SONCE, visoka ? 256 : 128);
  svet.add(S.g);

  // ---- orbit (true shape from the solar formulae; the 3 % change of distance is visible)
  const sn = { lam: 0, r: 1, dek: 0 };
  const polozaj = (dan, out) => { sonceNaDan(dan, sn); return out.set(-Math.cos(sn.lam * D), 0, Math.sin(sn.lam * D)).multiplyScalar(sn.r * K_TIR); };
  const tmp = new THREE.Vector3();
  const tirN = seg(180);
  const tirArr = new Float32Array(tirN * 3);
  for (let k = 0; k < tirN; k++) { polozaj(1 + (k / tirN) * 365.2422, tmp); tirArr.set([tmp.x, tmp.y, tmp.z], k * 3); }
  const tirGeo = hrani(new THREE.BufferGeometry());
  tirGeo.setAttribute("position", new THREE.BufferAttribute(tirArr, 3));
  const tirnica = new THREE.LineLoop(tirGeo, hrani(new THREE.LineBasicMaterial({ color: 0x8394b8, transparent: true, opacity: 0.55, depthWrite: false })));
  svet.add(tirnica);
  // points of the year: small dots + two-line labels
  const tockeMesh = new THREE.InstancedMesh(hrani(new THREE.SphereGeometry(0.012, 12, 8)), hrani(new THREE.MeshBasicMaterial({ color: 0xc8d4ee })), 4);
  const tockeNapisi = [];
  const m4 = new THREE.Matrix4();
  TOCKE.forEach((dan, k) => {
    polozaj(dan, tmp);
    m4.makeTranslation(tmp.x, tmp.y, tmp.z); tockeMesh.setMatrixAt(k, m4);
    const s = o.napis(`${kratko(dan)}\n${IMENA_TOCK[k]}`, null, { visina: 0.019, sredina: [0.5, 1], pika: false });
    s.position.set(tmp.x, -0.03, tmp.z); Object.assign(s.userData, { dan, tocka: tmp.clone(), dvig: 0.03, sredisce: S.g });
    svet.add(s); tockeNapisi.push(s);
  });
  svet.add(tockeMesh);
  // ---- Earth: pivot (orbit position) → os (tilted axis frame, scaled to Earth radius) → vrt (spin)
  const piv = new THREE.Group(), os = new THREE.Group(), vrt = new THREE.Group();
  const POL = new THREE.Vector3(0, Math.cos(NAGIB * D), -Math.sin(NAGIB * D)); // towards λ = 90° (June Sun)
  os.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3(1, 0, 0), POL, new THREE.Vector3(0, Math.sin(NAGIB * D), Math.cos(NAGIB * D))));
  os.scale.setScalar(R_ZEMLJA);
  piv.add(os); os.add(vrt); svet.add(piv);
  const geoV = hrani(new THREE.SphereGeometry(1, seg(96), seg(64)));
  const geoS = hrani(new THREE.SphereGeometry(1, seg(64), seg(40)));
  const sonceSvet = (out) => out.setFromMatrixPosition(svet.matrixWorld);
  const Z = o.zemlja(visoka ? 1024 : 512, geoV, geoS, snov, sonceSvet);
  vrt.add(Z.mesh, Z.oblaki); os.add(Z.atm);
  Z.oblaki.rotation.y = 0.4;
  // latitude circles above the clouds
  function krog(lats) {
    return o.zdruzi(lats.map((la) => {
      const g = new THREE.TorusGeometry(1.017 * Math.cos(la * D), 0.011, 6, seg(128));
      g.rotateX(Math.PI / 2); g.translate(0, 1.017 * Math.sin(la * D), 0);
      return g;
    }));
  }
  const lin = (lats, barva) => new THREE.Mesh(hrani(krog(lats)), hrani(new THREE.MeshBasicMaterial({ color: barva, toneMapped: false })));
  const ekvator = lin([0], 0xffd166), povratnika = lin([NAGIB, -NAGIB], 0xff9466), tecajnika = lin([90 - NAGIB, NAGIB - 90], 0x7cc6ff);
  os.add(ekvator, povratnika, tecajnika);
  // axis with an arrow towards Polaris
  const osDeli = [new THREE.CylinderGeometry(0.016, 0.016, 3.1, 8, 1, true), new THREE.ConeGeometry(0.06, 0.2, 12)];
  osDeli[1].translate(0, 1.65, 0);
  const osMesh = new THREE.Mesh(hrani(o.zdruzi(osDeli)), hrani(new THREE.MeshBasicMaterial({ color: 0xe3e9f6, toneMapped: false })));
  osDeli.forEach((g) => g.dispose());
  os.add(osMesh);
  // Ljubljana
  const LJ = new THREE.Vector3(Math.cos(LJ_FI * D) * Math.cos(LJ_LAMBDA * D), Math.sin(LJ_FI * D), -Math.cos(LJ_FI * D) * Math.sin(LJ_LAMBDA * D));
  const ljMesh = new THREE.Mesh(hrani(new THREE.SphereGeometry(0.05, 12, 8)), hrani(new THREE.MeshBasicMaterial({ color: 0xff5c7a, toneMapped: false })));
  ljMesh.position.copy(LJ).multiplyScalar(1.01);
  vrt.add(ljMesh);
  // sunray at Ljubljana (svet coordinates)
  const zarekGeo = hrani(new THREE.BufferGeometry());
  zarekGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
  const zarek = new THREE.Line(zarekGeo, hrani(new THREE.LineBasicMaterial({ color: 0xffd27a, toneMapped: false })));
  zarek.frustumCulled = false;
  svet.add(zarek);

  // ---- labels
  const napisi = {
    sonce: o.napis("Sonce", "#ffc35a", { sredina: [0.5, 1] }),
    zemlja: o.napis("Zemlja", "#4f8fe0", { sredina: [0.5, 1] }),
    severnica: o.napis("proti Severnici", "#e3e9f6", { visina: 0.019 }),
    lj: o.napis("Ljubljana", "#ff5c7a", { visina: 0.018, sredina: [0, 0.5] }),
  };
  napisi.sonce.position.set(0, -R_SONCE - 0.02, 0);
  Object.assign(napisi.zemlja.userData, { tocka: piv.position, dvig: R_ZEMLJA * 1.22, sredisce: S.g });
  for (const s of Object.values(napisi)) svet.add(s);

  // ---- inset: the noon Sun in Ljubljana
  const V = o.vlozek(group, 230, 158, 250);
  function risiVlozek(h, dan) {
    const c = V.c2, w = V.w, H = V.h;
    o.ploscica(c, w, H);
    c.textBaseline = "alphabetic";
    c.fillStyle = "#e8edf7"; c.font = o.font(600, 13); c.textAlign = "left"; c.fillText("Opoldne v Ljubljani", 12, 21);
    c.fillStyle = "#9aa6bf"; c.font = o.font(500, 11.5); c.textAlign = "right"; c.fillText(dolgo(dan), w - 12, 21);
    const tla = 126, x0 = 62, palica = 44, tg = Math.tan(h * D), xe = x0 + palica / tg;
    // sky clip
    c.save(); c.beginPath(); c.rect(8, 28, w - 16, tla - 28); c.clip();
    c.strokeStyle = "rgba(255,210,122,0.85)"; c.fillStyle = "rgba(255,210,122,0.85)"; c.lineWidth = 1.6;
    const ux = Math.cos(h * D), uy = Math.sin(h * D);
    for (const zam of [-34, 0, 34]) {
      const ex = xe + zam / uy, ey = tla; // where the ray reaches the ground
      const sx = ex - ux * 400, sy = ey - uy * 400;
      c.beginPath(); c.moveTo(sx, sy); c.lineTo(ex - ux * 4, ey - uy * 4); c.stroke();
      c.beginPath(); c.moveTo(ex, ey); c.lineTo(ex - ux * 9 - uy * 4, ey - uy * 9 + ux * 4); c.lineTo(ex - ux * 9 + uy * 4, ey - uy * 9 - ux * 4); c.fill();
    }
    c.restore();
    // ground, shadow, stick
    c.fillStyle = "rgba(96,128,78,0.35)"; c.fillRect(10, tla, w - 20, 16);
    c.strokeStyle = "#9cc27a"; c.lineWidth = 2; c.beginPath(); c.moveTo(10, tla); c.lineTo(w - 10, tla); c.stroke();
    c.strokeStyle = "#0b0f16"; c.lineWidth = 5; c.beginPath(); c.moveTo(x0, tla + 1); c.lineTo(xe, tla + 1); c.stroke();
    c.strokeStyle = "#e3e9f6"; c.lineWidth = 3; c.beginPath(); c.moveTo(x0, tla); c.lineTo(x0, tla - palica); c.stroke();
    // angle arc at the end of the shadow
    c.strokeStyle = "#6E9BFF"; c.lineWidth = 2; c.beginPath(); c.arc(xe, tla, 22, Math.PI, Math.PI + h * D); c.stroke();
    c.fillStyle = "#6E9BFF"; c.font = o.font(700, 12); c.textAlign = "center";
    c.fillText("h", xe - 30 * Math.cos((h * D) / 2), tla - 30 * Math.sin((h * D) / 2) + 4);
    c.fillStyle = "#9aa6bf"; c.font = o.font(600, 10.5);
    c.fillText("J", 18, tla + 12); c.fillText("S", w - 18, tla + 12);
    c.textAlign = "right"; c.fillStyle = "#e8edf7"; c.font = o.font(700, 17); c.fillText(`h = ${stevilo(h, 1)}°`, w - 12, 50);
    c.fillStyle = "#9aa6bf"; c.font = o.font(500, 10.5); c.fillText(`senca palice: ${stevilo(1 / tg, 2)} × višina`, w - 12, 66);
    V.t.needsUpdate = true;
  }

  // ---- state
  const zacDan = Number(z0.dan), zacUra = Number(z0.ura);
  let dan = Number.isFinite(zacDan) ? Math.min(365, Math.max(1, Math.round(zacDan))) : 172;
  let ure = Number.isFinite(zacUra) ? Math.min(24, Math.max(0, zacUra)) : 12;
  let vrti = z0.vrti === undefined ? gib : !!z0.vrti;
  const stanje = { lam: 0, r: 1, dek: 0 };
  const sSmer = new THREE.Vector3(), v1 = new THREE.Vector3(), v2 = new THREE.Vector3(), v3 = new THREE.Vector3(), qi = new THREE.Quaternion();
  const delTocka = {};
  const t3 = (id, v) => { const t = delTocka[id]; t[0] = v.x; t[1] = v.y; t[2] = v.z; };
  const vSvet = (obj, lokalno, out) => { out.copy(lokalno); obj.localToWorld(out); return svet.worldToLocal(out); };
  ["sonce", "zemlja", "os", "ekvator", "povratnika", "tecajnika", "ljubljana", "tirnica"].forEach((id) => (delTocka[id] = [0, 0, 0]));

  function postavi() {
    sonceNaDan(dan + (ure - 12 - LJ_LAMBDA / 15) / 24, stanje);
    polozaj(dan + (ure - 12 - LJ_LAMBDA / 15) / 24, piv.position);
    sSmer.copy(piv.position).negate().normalize(); // towards the Sun
    // spin: Ljubljana's meridian faces the Sun at local solar noon
    qi.copy(os.quaternion).invert();
    v1.copy(sSmer).applyQuaternion(qi);
    const alfa = Math.atan2(-v1.z, v1.x), lamS = (LJ_LAMBDA - (ure - 12) * 15) * D;
    vrt.rotation.y = alfa - lamS;
    group.updateMatrixWorld(true);
    // labels and hotspots
    vSvet(os, v2.set(0, 1.95, 0), napisi.severnica.position);
    vSvet(vrt, v2.copy(LJ).multiplyScalar(1.08), napisi.lj.position);
    const ljS = vSvet(vrt, v2.copy(LJ).multiplyScalar(1.01), v3);
    const p = zarekGeo.attributes.position;
    p.setXYZ(0, ljS.x, ljS.y, ljS.z); v1.copy(ljS).addScaledVector(sSmer, 0.26); p.setXYZ(1, v1.x, v1.y, v1.z); p.needsUpdate = true;
    v2.copy(ljS).sub(piv.position).normalize();
    zarek.visible = v2.dot(sSmer) > 0.02;
    t3("ljubljana", ljS);
    t3("zemlja", v1.copy(piv.position).add(v2.set(R_ZEMLJA * 0.5, -R_ZEMLJA * 0.5, R_ZEMLJA * 0.3)));
    t3("os", vSvet(os, v2.set(0, 1.4, 0), v1));
    t3("ekvator", vSvet(os, v2.set(1.017, 0, 0), v1));
    t3("povratnika", vSvet(os, v2.set(1.017 * Math.cos(NAGIB * D), 1.017 * Math.sin(NAGIB * D), 0), v1));
    t3("tecajnika", vSvet(os, v2.set(1.017 * Math.cos((90 - NAGIB) * D), 1.017 * Math.sin((90 - NAGIB) * D), 0), v1));
    for (const s of tockeNapisi) {
      const raz = Math.abs(((((dan - s.userData.dan) % 365.24) + 547.86) % 365.24) - 182.62);
      s.material.opacity = raz < 22 ? 0 : raz < 32 ? (raz - 22) / 10 : 1;
    }
  }
  // world-space positions of the hotspots that do not move
  { const t = delTocka.sonce; t[1] = R_SONCE * 0.6; }
  { polozaj(TOCKE[0] + 45, tmp); const t = delTocka.tirnica; t[0] = tmp.x; t[1] = tmp.y; t[2] = tmp.z; }
  // hotspots are given in group coordinates: convert after every update
  const tockeG = {};
  for (const id in delTocka) tockeG[id] = [0, 0, 0];
  function tockeVSkupino() {
    svet.updateMatrix();
    for (const id in delTocka) { v1.fromArray(delTocka[id]).applyMatrix4(svet.matrix); const t = tockeG[id]; t[0] = v1.x; t[1] = v1.y; t[2] = v1.z; }
  }
  let zadnjiH = null, zadnjiDan = null;
  function osvezi() {
    postavi();
    tockeVSkupino();
    sonceNaDan(dan, stanje);
    const h = 90 - LJ_FI + stanje.dek;
    const hk = Math.round(h * 10) / 10;
    if (hk !== zadnjiH || dan !== zadnjiDan) { risiVlozek(h, dan); zadnjiH = hk; zadnjiDan = dan; }
  }
  // per-frame: hide labels that sit on the far side of the Earth
  const camL = new THREE.Vector3(), inv = new THREE.Matrix4();
  const vsiNapisi = [...Object.values(napisi), ...tockeNapisi];
  tirnica.onBeforeRender = (renderer, sc, camera) => o.uredi(renderer, camera, group, vsiNapisi);
  napisi.lj.onBeforeRender = (r, sc, camera) => {
    inv.copy(svet.matrixWorld).invert();
    camL.setFromMatrixPosition(camera.matrixWorld).applyMatrix4(inv);
    v2.copy(napisi.lj.position).sub(piv.position).normalize();
    camL.sub(napisi.lj.position).normalize();
    napisi.lj.material.opacity = Math.min(1, Math.max(0, (v2.dot(camL) - 0.05) * 6));
  };

  const del = (id, ime, opis, barva, meshes) => ({ id, ime, opis, barva, meshes, tocka: tockeG[id] });
  const deli = [
    del("sonce", "Sonce", "Sonce osvetljuje polovico Zemlje. Velikosti in razdalje v modelu niso v merilu: v resnici ima Sonce 109-krat večji premer kot Zemlja in je od nje oddaljeno okoli 150 milijonov km.", "#ffc35a", [S.mesh]),
    del("zemlja", "Zemlja", "Zemlja se v enem dnevu zavrti okoli svoje osi, v enem letu pa obkroži Sonce. Na strani, obrnjeni proti Soncu, je dan, na drugi strani noč.", "#4f8fe0", [Z.mesh, Z.oblaki]),
    del("os", "Zemljina os", "Os je nagnjena za 23,44° in ves čas kaže v isto smer, proti Severnici. Zato je severna polobla junija nagnjena proti Soncu (poletje), decembra pa stran od njega (zima).", "#e3e9f6", [osMesh]),
    del("ekvator", "Ekvator", "Ekvator razdeli Zemljo na severno in južno poloblo. Ob enakonočjih je Sonce opoldne nad ekvatorjem navpično nad glavo, dan in noč pa trajata povsod po 12 ur.", "#ffd166", [ekvator]),
    del("povratnika", "Povratnika", "Severni in južni povratnik ležita na 23,44° severne in južne geografske širine. Samo med njima je Sonce opoldne lahko navpično nad glavo; nad povratnikom se to zgodi ob sončevem obratu.", "#ff9466", [povratnika]),
    del("tecajnika", "Tečajnika", "Severni in južni tečajnik ležita na 66,56° geografske širine. Za njima Sonce vsaj en dan na leto ne zaide (polarni dan) in vsaj en dan ne vzide (polarna noč).", "#7cc6ff", [tecajnika]),
    del("ljubljana", "Ljubljana", "Ljubljana leži na 46,05° severne geografske širine. Rumena črta je sončni žarek. Nižje ko je Sonce, bolj poševno padajo žarki: ista svetloba se razporedi po večji površini tal, zato jih manj segreje.", "#ff5c7a", [ljMesh]),
    del("tirnica", "Zemljina tirnica", "Tirnica je skoraj krog. Zemlja je Soncu najbližje v začetku januarja (147 milijonov km), najdlje pa v začetku julija (152 milijonov km). Letnih časov torej ne povzroča razdalja do Sonca, ampak nagib Zemljine osi.", "#8394b8", [tirnica]),
  ];

  osvezi();
  o.zazeni();

  const nadzor = [
    { tip: "drsnik", id: "dan", oznaka: "Dan v letu", min: 1, max: 365, korak: 1, vrednost: dan, ob: (v) => { dan = Math.min(365, Math.max(1, Math.round(Number(v) || 1))); osvezi(); } },
    { tip: "izpis", id: "datum", oznaka: "Datum", vrednost: () => `${dolgo(dan)} ${LETO} (${dan}. dan v letu)` },
    { tip: "stikalo", id: "vrti", oznaka: "Zemlja se vrti", vrednost: vrti, vidno: () => gib, ob: (v) => { vrti = !!v; osvezi(); } },
    { tip: "drsnik", id: "ura", oznaka: "Sončni čas v Ljubljani", min: 0, max: 24, korak: 0.25, get vrednost() { return Math.round(ure * 4) / 4; }, vidno: () => !vrti || !gib, ob: (v) => { ure = Math.min(24, Math.max(0, Number(v) || 0)); osvezi(); } },
    { tip: "izpis", id: "cas", oznaka: "Ura v Ljubljani (sončni čas)", vrednost: () => ura(ure) + (Math.abs(ure - 12) < 0.13 ? " – poldne" : "") },
    { tip: "izpis", id: "letni-cas", oznaka: "Letni čas na severni polobli", vrednost: () => {
      let k = 3;
      for (let i = 0; i < 4; i++) if (dan + 0.5 >= TOCKE[i]) k = i;
      const od = TOCKE[k], doo = TOCKE[(k + 1) % 4];
      return `${CASI[k]} (od ${kratko(od)} do ${kratko(doo)})`;
    } },
    { tip: "izpis", id: "deklinacija", oznaka: "Deklinacija Sonca", vrednost: () => `δ = ${predznak(sonceNaDan(dan, stanje).dek, 1)}°` },
    { tip: "izpis", id: "visina", oznaka: "Opoldanska višina Sonca v Ljubljani", vrednost: () => {
      const dek = sonceNaDan(dan, stanje).dek;
      return `h = 90° − 46,05° ${dek < 0 ? "−" : "+"} ${stevilo(Math.abs(dek), 1)}° = ${stevilo(90 - LJ_FI + dek, 1)}°`;
    } },
    { tip: "izpis", id: "dolzina", oznaka: "Dolžina dneva v Ljubljani", vrednost: () => {
      const dek = sonceNaDan(dan, stanje).dek;
      const w = Math.acos(-Math.tan(LJ_FI * D) * Math.tan(dek * D)) / D, min = Math.round((2 * w * 60) / 15);
      return `${Math.floor(min / 60)} h ${min % 60} min (iz cos ω = −tan φ · tan δ, brez loma svetlobe v ozračju)`;
    } },
    { tip: "izpis", id: "razdalja", oznaka: "Razdalja Zemlja–Sonce", vrednost: () => `${stevilo(sonceNaDan(dan, stanje).r * AU_MIO, 1)} milijona km (najbližje 3. januarja, najdlje 6. julija)` },
    { tip: "izpis", id: "tocke", oznaka: `Točke leta ${LETO}`, vrednost: () => TOCKE.map((t, k) => `${kratko(t)} ${IMENA_TOCK[k]}`).join(" · ") },
    { tip: "izpis", id: "merilo", oznaka: "Merilo", vrednost: () => "ni v merilu: Zemlja in Sonce sta močno povečana, razdalja med njima pa zelo skrajšana" },
  ];

  return {
    group,
    deli,
    nadzor,
    merilo: () => null,
    luci: false,
    korak(t, dt) {
      if (!gib) return;
      const k = Math.min(Math.max(dt, 0), 0.1);
      S.sMat.uniforms.uTime.value += k;
      if (!vrti) return;
      ure = (ure + k * 3) % 24;
      osvezi();
    },
    dispose() { o.pocisti(); group.clear(); },
  };
}

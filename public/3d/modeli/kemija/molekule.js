// Molekule v 3D: oblike molekul po teoriji VSEPR (odboj elektronskih parov), vezi, prosti elektronski pari in vezni koti.
// Pogodba: docs/3d.md. Brez uvozov; THREE pride od kompleta.
//
// Viri koordinat (vse v pm; poskusne geometrije na 0,01 pm, da se koti ohranijo na 0,01°, PubChem na 0,1 pm):
// - majhne molekule: poskusne dolžine vezi in koti iz NIST CCCBDB (Computational Chemistry Comparison and Benchmark
//   DataBase, »experimental geometries«) in CRC Handbook of Chemistry and Physics (»Structure of free molecules in
//   the gas phase«); iz njih so koordinate izračunane (gen. skript ni del aplikacije).
// - ioni (CO₃²⁻, NO₃⁻, SO₄²⁻, NH₄⁺) in sečnina: značilne dolžine vezi v kristalih; H₃O⁺: spektroskopija v plinu (Tang in Oka 1999).
// - večje organske molekule: PubChem 3D konformer (MMFF94, javna last), CID v polju `vir`, zasukane na glavne osi
//   (le prava rotacija, kiralnost glukoze ostane).
// - molske mase: standardne atomske mase IUPAC (skrajšana tabela 2021); van der Waalsovi polmeri: Bondi 1964,
//   za B in Be Mantina in sod. 2009.
// Poenostavitve: atomi so toge kroglice na ravnovesnih legah (brez nihanja); resonančne vezi (O₃, CO₃²⁻, NO₃⁻,
// SO₄²⁻) so prikazane kot polna + črtkana palčka; benzen kot obroč; SO₂, SO₃ in SO₄²⁻ z razširjenim oktetom žvepla,
// kot v srednješolskih učbenikih.

export const info = {
  id: "molekule",
  naslov: "Molekule v 3D",
  podrocje: "kemija",
  predmet: "KEM",
  opis: "44 molekul in ionov z izmerjenimi dolžinami vezi in koti (pri večjih organskih molekulah izračunanimi): vse oblike po teoriji VSEPR, prosti elektronski pari, vezni koti in polarnost. Atomi so prikazani kot mirujoče kroglice.",
  merilo: { m: 0.25e-9, oznaka: "0,25 nm" },
  poskusi: "Primerjaj vezne kote metana, amonijaka in vode: kako prosti elektronski pari stisnejo kot?",
};

// Podatki: a = [element, x, y, z] v pm; b = [i, j, red vezi po Lewisu, 1 = delokalizirana]; c = osrednji atom;
// q = naboj; fc = formalni naboji atomov; arom = aromatski obroč; pol = polarnost (null za ione).
export const MOLEKULE = [
  {id:"vodik",ime:"vodik",f:"H₂",vsepr:"AX1E0",c:0,pol:false,vir:"CCCBDB",
    a:[["H",-37.05,0,0],["H",37.05,0,0]],
    b:[[0,1,1]]},
  {id:"kisik",ime:"kisik",f:"O₂",vsepr:"AX1E2",c:0,pol:false,vir:"CCCBDB",
    a:[["O",-60.4,0,0],["O",60.4,0,0]],
    b:[[0,1,2]]},
  {id:"dusik",ime:"dušik",f:"N₂",vsepr:"AX1E1",c:0,pol:false,vir:"CCCBDB",
    a:[["N",-54.9,0,0],["N",54.9,0,0]],
    b:[[0,1,3]]},
  {id:"klor",ime:"klor",f:"Cl₂",vsepr:"AX1E3",c:0,pol:false,vir:"CCCBDB",
    a:[["Cl",-99.4,0,0],["Cl",99.4,0,0]],
    b:[[0,1,1]]},
  {id:"vodikov-klorid",ime:"vodikov klorid",f:"HCl",vsepr:"AX1E3",c:0,pol:true,vir:"CCCBDB",
    a:[["Cl",-63.75,0,0],["H",63.75,0,0]],
    b:[[0,1,1]]},
  {id:"ogljikov-dioksid",ime:"ogljikov dioksid",f:"CO₂",vsepr:"AX2E0",c:0,pol:false,vir:"CCCBDB",
    a:[["C",0,0,0],["O",-116.2,0,0],["O",116.2,0,0]],
    b:[[0,1,2],[0,2,2]]},
  {id:"berilijev-klorid",ime:"berilijev klorid (v plinu)",f:"BeCl₂",vsepr:"AX2E0",c:0,pol:false,vir:"CCCBDB",
    a:[["Be",0,0,0],["Cl",-179.1,0,0],["Cl",179.1,0,0]],
    b:[[0,1,1],[0,2,1]]},
  {id:"vodikov-cianid",ime:"vodikov cianid",f:"HCN",vsepr:"AX2E0",c:0,pol:true,vir:"CCCBDB",
    a:[["C",0,0,0],["H",-106.5,0,0],["N",115.3,0,0]],
    b:[[0,1,1],[0,2,3]]},
  {id:"ksenonov-difluorid",ime:"ksenonov difluorid",f:"XeF₂",vsepr:"AX2E3",c:0,pol:false,vir:"CRC",
    a:[["Xe",0,0,0],["F",-197.7,0,0],["F",197.7,0,0]],
    b:[[0,1,1],[0,2,1]]},
  {id:"borov-trifluorid",ime:"borov trifluorid",f:"BF₃",vsepr:"AX3E0",c:0,pol:false,vir:"CCCBDB",
    a:[["B",0,0,0],["F",0,130.7,0],["F",-113.19,-65.35,0],["F",113.19,-65.35,0]],
    b:[[0,1,1],[0,2,1],[0,3,1]]},
  {id:"zveplov-trioksid",ime:"žveplov trioksid",f:"SO₃",vsepr:"AX3E0",c:0,pol:false,vir:"CCCBDB",
    a:[["S",0,0,0],["O",0,141.8,0],["O",-122.8,-70.9,0],["O",122.8,-70.9,0]],
    b:[[0,1,2],[0,2,2],[0,3,2]]},
  {id:"karbonatni-ion",ime:"karbonatni ion",f:"CO₃²⁻",q:-2,vsepr:"AX3E0",c:0,pol:null,fc:{2:-1,3:-1},vir:"kristal (kalcit)",
    a:[["C",0,0,0],["O",0,128,0],["O",-110.85,-64,0],["O",110.85,-64,0]],
    b:[[0,1,2,1],[0,2,1,1],[0,3,1,1]]},
  {id:"nitratni-ion",ime:"nitratni ion",f:"NO₃⁻",q:-1,vsepr:"AX3E0",c:0,pol:null,fc:{0:1,2:-1,3:-1},vir:"kristal (NaNO₃)",
    a:[["N",0,0,0],["O",0,125,0],["O",-108.25,-62.5,0],["O",108.25,-62.5,0]],
    b:[[0,1,2,1],[0,2,1,1],[0,3,1,1]]},
  {id:"metanal",ime:"metanal (formaldehid)",f:"HCHO",vsepr:"AX3E0",c:0,pol:true,vir:"CCCBDB",
    a:[["C",0,0,0],["O",0,120.5,0],["H",-94.32,-58.71,0],["H",94.32,-58.71,0]],
    b:[[0,1,2],[0,2,1],[0,3,1]]},
  {id:"voda",ime:"voda",f:"H₂O",vsepr:"AX2E2",c:0,pol:true,vir:"CCCBDB",
    a:[["O",0,0,0],["H",-75.75,-58.65,0],["H",75.75,-58.65,0]],
    b:[[0,1,1],[0,2,1]]},
  {id:"vodikov-sulfid",ime:"vodikov sulfid",f:"H₂S",vsepr:"AX2E2",c:0,pol:true,vir:"CCCBDB",
    a:[["S",0,0,0],["H",-96.18,-92.72,0],["H",96.18,-92.72,0]],
    b:[[0,1,1],[0,2,1]]},
  {id:"zveplov-dioksid",ime:"žveplov dioksid",f:"SO₂",vsepr:"AX2E1",c:0,pol:true,vir:"CCCBDB",
    a:[["S",0,0,0],["O",-123.49,-72.31,0],["O",123.49,-72.31,0]],
    b:[[0,1,2],[0,2,2]]},
  {id:"ozon",ime:"ozon",f:"O₃",vsepr:"AX2E1",c:0,pol:true,fc:{0:1,2:-1},vir:"CRC",
    a:[["O",0,0,0],["O",-108.85,-66.97,0],["O",108.85,-66.97,0]],
    b:[[0,1,2,1],[0,2,1,1]]},
  {id:"metan",ime:"metan",f:"CH₄",vsepr:"AX4E0",c:0,pol:false,vir:"CCCBDB",
    a:[["C",0,0,0],["H",0,108.7,0],["H",0,-36.23,102.48],["H",-88.75,-36.23,-51.24],["H",88.75,-36.23,-51.24]],
    b:[[0,1,1],[0,2,1],[0,3,1],[0,4,1]]},
  {id:"tetraklorometan",ime:"tetraklorometan",f:"CCl₄",vsepr:"AX4E0",c:0,pol:false,vir:"CCCBDB",
    a:[["C",0,0,0],["Cl",0,176.7,0],["Cl",0,-58.9,166.59],["Cl",-144.27,-58.9,-83.3],["Cl",144.27,-58.9,-83.3]],
    b:[[0,1,1],[0,2,1],[0,3,1],[0,4,1]]},
  {id:"amonijev-ion",ime:"amonijev ion",f:"NH₄⁺",q:1,vsepr:"AX4E0",c:0,pol:null,fc:{0:1},vir:"kristal (NH₄Cl, nevtronska difrakcija)",
    a:[["N",0,0,0],["H",0,103,0],["H",0,-34.33,97.11],["H",-84.1,-34.33,-48.55],["H",84.1,-34.33,-48.55]],
    b:[[0,1,1],[0,2,1],[0,3,1],[0,4,1]]},
  {id:"sulfatni-ion",ime:"sulfatni ion",f:"SO₄²⁻",q:-2,vsepr:"AX4E0",c:0,pol:null,fc:{3:-1,4:-1},vir:"kristal (sulfati)",
    a:[["S",0,0,0],["O",0,147.3,0],["O",0,-49.1,138.88],["O",-120.27,-49.1,-69.44],["O",120.27,-49.1,-69.44]],
    b:[[0,1,2,1],[0,2,2,1],[0,3,1,1],[0,4,1,1]]},
  {id:"amonijak",ime:"amonijak",f:"NH₃",vsepr:"AX3E1",c:0,pol:true,vir:"CCCBDB",
    a:[["N",0,0,0],["H",0,-38.1,93.75],["H",-81.19,-38.1,-46.88],["H",81.19,-38.1,-46.88]],
    b:[[0,1,1],[0,2,1],[0,3,1]]},
  {id:"oksonijev-ion",ime:"oksonijev ion",f:"H₃O⁺",q:1,vsepr:"AX3E1",c:0,pol:null,fc:{0:1},vir:"spektroskopija v plinu (Tang in Oka 1999)",
    a:[["O",0,0,0],["H",0,-29.47,93.04],["H",-80.58,-29.47,-46.52],["H",80.58,-29.47,-46.52]],
    b:[[0,1,1],[0,2,1],[0,3,1]]},
  {id:"fosforjev-triklorid",ime:"fosforjev triklorid",f:"PCl₃",vsepr:"AX3E1",c:0,pol:true,vir:"CRC",
    a:[["P",0,0,0],["Cl",0,-95.04,180.85],["Cl",-156.62,-95.04,-90.42],["Cl",156.62,-95.04,-90.42]],
    b:[[0,1,1],[0,2,1],[0,3,1]]},
  {id:"fosforjev-pentaklorid",ime:"fosforjev pentaklorid",f:"PCl₅",vsepr:"AX5E0",c:0,pol:false,vir:"CRC (elektronska difrakcija v plinu)",
    a:[["P",0,0,0],["Cl",0,212.7,0],["Cl",0,-212.7,0],["Cl",0,0,202.3],["Cl",-175.2,0,-101.15],["Cl",175.2,0,-101.15]],
    b:[[0,1,1],[0,2,1],[0,3,1],[0,4,1],[0,5,1]]},
  {id:"zveplov-tetrafluorid",ime:"žveplov tetrafluorid",f:"SF₄",vsepr:"AX4E1",c:0,pol:true,vir:"CRC (mikrovalovna spektroskopija)",
    a:[["S",0,0,0],["F",-9.91,164.3,0],["F",-9.91,-164.3,0],["F",-97.65,0,119.73],["F",-97.65,0,-119.73]],
    b:[[0,1,1],[0,2,1],[0,3,1],[0,4,1]]},
  {id:"klorov-trifluorid",ime:"klorov trifluorid",f:"ClF₃",vsepr:"AX3E2",c:0,pol:true,vir:"CRC (mikrovalovna spektroskopija)",
    a:[["Cl",0,0,0],["F",-159.8,0,0],["F",-7.41,169.64,0],["F",-7.41,-169.64,0]],
    b:[[0,1,1],[0,2,1],[0,3,1]]},
  {id:"zveplov-heksafluorid",ime:"žveplov heksafluorid",f:"SF₆",vsepr:"AX6E0",c:0,pol:false,vir:"CCCBDB",
    a:[["S",0,0,0],["F",156.1,0,0],["F",-156.1,0,0],["F",0,156.1,0],["F",0,-156.1,0],["F",0,0,156.1],["F",0,0,-156.1]],
    b:[[0,1,1],[0,2,1],[0,3,1],[0,4,1],[0,5,1],[0,6,1]]},
  {id:"bromov-pentafluorid",ime:"bromov pentafluorid",f:"BrF₅",vsepr:"AX5E1",c:0,pol:true,vir:"CRC (mikrovalovna spektroskopija)",
    a:[["Br",0,0,0],["F",0,168.9,0],["F",124.92,16.08,124.92],["F",-124.92,16.08,124.92],["F",-124.92,16.08,-124.92],["F",124.92,16.08,-124.92]],
    b:[[0,1,1],[0,2,1],[0,3,1],[0,4,1],[0,5,1]]},
  {id:"ksenonov-tetrafluorid",ime:"ksenonov tetrafluorid",f:"XeF₄",vsepr:"AX4E2",c:0,pol:false,vir:"CRC (kristal)",
    a:[["Xe",0,0,0],["F",138.1,0,138.1],["F",-138.1,0,138.1],["F",-138.1,0,-138.1],["F",138.1,0,-138.1]],
    b:[[0,1,1],[0,2,1],[0,3,1],[0,4,1]]},
  {id:"etan",ime:"etan",f:"C₂H₆",vsepr:"AX4E0",c:0,pol:false,vir:"CCCBDB",
    a:[["C",-76.75,0,0],["C",76.75,0,0],["H",-116.31,0,102],["H",-116.31,-88.33,-51],["H",-116.31,88.33,-51],["H",116.31,88.33,51],["H",116.31,-88.33,51],["H",116.31,0,-102]],
    b:[[0,1,1],[0,2,1],[0,3,1],[0,4,1],[1,5,1],[1,6,1],[1,7,1]]},
  {id:"eten",ime:"eten (etilen)",f:"C₂H₄",vsepr:"AX3E0",c:0,pol:false,vir:"CCCBDB",
    a:[["C",-66.95,0,0],["C",66.95,0,0],["H",-123.42,92.88,0],["H",-123.42,-92.88,0],["H",123.42,92.88,0],["H",123.42,-92.88,0]],
    b:[[0,1,2],[0,2,1],[0,3,1],[1,4,1],[1,5,1]]},
  {id:"etin",ime:"etin (acetilen)",f:"C₂H₂",vsepr:"AX2E0",c:0,pol:false,vir:"CCCBDB",
    a:[["C",-60.15,0,0],["C",60.15,0,0],["H",-166.45,0,0],["H",166.45,0,0]],
    b:[[0,1,3],[0,2,1],[1,3,1]]},
  {id:"benzen",ime:"benzen",f:"C₆H₆",vsepr:"AX3E0",c:0,pol:false,arom:[0,1,2,3,4,5],vir:"CCCBDB",
    a:[["C",0,139.7,0],["C",-120.98,69.85,0],["C",-120.98,-69.85,0],["C",0,-139.7,0],["C",120.98,-69.85,0],["C",120.98,69.85,0],["H",0,248.1,0],["H",-214.86,124.05,0],["H",-214.86,-124.05,0],["H",0,-248.1,0],["H",214.86,-124.05,0],["H",214.86,124.05,0]],
    b:[[0,1,2],[0,6,1],[1,2,1],[1,7,1],[2,3,2],[2,8,1],[3,4,1],[3,9,1],[4,5,2],[4,10,1],[5,0,1],[5,11,1]]},
  {id:"vodikov-peroksid",ime:"vodikov peroksid",f:"H₂O₂",vsepr:"AX2E2",c:0,pol:true,vir:"CRC (plin)",
    a:[["O",-73.75,0,0],["O",73.75,0,0],["H",-81.7,-78.25,-53.28],["H",81.7,78.25,-53.28]],
    b:[[0,1,1],[0,2,1],[1,3,1]]},
  {id:"secnina",ime:"sečnina",f:"CO(NH₂)₂",vsepr:"AX3E0",c:0,pol:true,vir:"kristal (nevtronska difrakcija)",
    opomba:"izmerjena molekula je ravninska tudi okoli N: prosti par dušika se deli z vezjo C=O (resonanca)",
    a:[["C",0,0,0],["O",0,126,0],["N",114.47,-70.42,0],["H",111.67,-170.78,0],["H",202.79,-22.67,0],["N",-114.47,-70.42,0],["H",-202.79,-22.67,0],["H",-111.67,-170.78,0]],
    b:[[0,1,2],[0,2,1],[2,3,1],[2,4,1],[0,5,1],[5,6,1],[5,7,1]]},
  {id:"metanol",ime:"metanol",f:"CH₃OH",vsepr:"AX2E2",c:0,pol:true,vir:"PubChem CID 887",
    a:[["O",92.3,57.6,0.1],["C",-37.1,0.2,0],["H",-49.9,-61.2,89.5],["H",-49.9,-61,-89.6],["H",-111.5,80.2,0.1],["H",156.1,-15.8,0]],
    b:[[0,1,1],[0,5,1],[1,2,1],[1,3,1],[1,4,1]]},
  {id:"etanol",ime:"etanol",f:"C₂H₅OH",vsepr:"AX4E0",c:1,pol:true,vir:"PubChem CID 702",
    a:[["O",-144.4,40.4,-46.8],["C",-47,-51.4,0.7],["C",88.7,15.7,-0.5],["H",-74.6,-83.3,101.6],["H",-47.4,-138.9,-64.9],["H",166.4,-53.1,33.9],["H",114,49.9,-101.4],["H",88.9,104.1,64.1],["H",-144.7,116.7,13.5]],
    b:[[0,1,1],[0,8,1],[1,2,1],[1,3,1],[1,4,1],[2,5,1],[2,6,1],[2,7,1]]},
  {id:"etanojska-kislina",ime:"etanojska kislina (ocetna kislina)",f:"CH₃COOH",vsepr:"AX3E0",c:3,pol:true,vir:"PubChem CID 176",
    a:[["O",-131.5,70.9,0],["O",-83.3,-151.9,0],["C",95.3,10.7,0],["C",-47.1,-35.1,0.1],["H",115.4,69,-90.2],["H",115.2,70.1,89.5],["H",161.4,-76.5,0.6],["H",-225.5,42.9,0]],
    b:[[0,3,1],[0,7,1],[1,3,2],[2,3,1],[2,4,1],[2,5,1],[2,6,1]]},
  {id:"propanon",ime:"propanon (aceton)",f:"CH₃COCH₃",vsepr:"AX3E0",c:1,pol:true,vir:"PubChem CID 180",
    a:[["O",0,-185.1,0],["C",0,-62.1,0.1],["C",128.1,16.8,0],["C",-128.1,16.8,0],["H",132.8,78.9,-89.8],["H",132.6,79.4,89.5],["H",213.5,-51.5,0.3],["H",-213.5,-51.5,0.3],["H",-132.8,78.9,-89.8],["H",-132.6,79.4,89.5]],
    b:[[0,1,2],[1,2,1],[1,3,1],[2,4,1],[2,5,1],[2,6,1],[3,7,1],[3,8,1],[3,9,1]]},
  {id:"cikloheksan",ime:"cikloheksan (stolasta oblika)",f:"C₆H₁₂",vsepr:"AX4E0",c:0,pol:false,vir:"PubChem CID 8078",
    a:[["C",13.5,-145.2,-22.6],["C",132.5,-60.9,22.6],["C",-119,-84.3,22.6],["C",119,84.3,-22.6],["C",-132.5,60.9,-22.6],["C",-13.5,145.2,22.6],["H",14.3,-153.7,-131.9],["H",23,-246.8,17.4],["H",140.2,-64.4,131.9],["H",225.2,-103.5,-17.4],["H",-202.2,-143.3,-17.4],["H",-125.9,-89.2,131.9],["H",202.2,143.3,17.4],["H",125.9,89.2,-131.9],["H",-140.2,64.4,-132],["H",-225.2,103.5,17.4],["H",-14.3,153.7,131.9],["H",-23,246.8,-17.4]],
    b:[[0,1,1],[0,2,1],[0,6,1],[0,7,1],[1,3,1],[1,8,1],[1,9,1],[2,4,1],[2,10,1],[2,11,1],[3,5,1],[3,12,1],[3,13,1],[4,5,1],[4,14,1],[4,15,1],[5,16,1],[5,17,1]]},
  {id:"glukoza",ime:"glukoza (β-D-glukopiranoza)",f:"C₆H₁₂O₆",vsepr:"AX2E2",c:0,pol:true,vir:"PubChem CID 64689",
    a:[["O",-52.9,131.1,18.4],["O",-91.7,-231.6,-15.3],["O",180.4,-201.7,77.6],["O",299.2,45.9,-29.1],["O",133.9,270.9,17.2],["O",-321.5,122.9,-39.3],["C",-36.6,-110.2,35.3],["C",111.9,-103.4,-0.2],["C",-112.3,8.5,-24.8],["C",169.8,34.8,29.9],["C",81.4,145.7,-27.1],["C",-258.4,10.3,18.9],["H",-48,-112,144.3],["H",128.5,-130.1,-105.4],["H",-109.8,5.4,-134.6],["H",183.1,46.7,138.2],["H",83.3,147.6,-136.7],["H",-267.6,19.4,127.7],["H",-311.5,-79.6,-13.6],["H",-82.7,-230.6,-112.1],["H",140.5,-288,57.1],["H",289.5,35,-125.3],["H",164.9,260.7,108.7],["H",-273.5,202.1,-9.8]],
    b:[[0,8,1],[0,10,1],[1,6,1],[1,19,1],[2,7,1],[2,20,1],[3,9,1],[3,21,1],[4,10,1],[4,22,1],[5,11,1],[5,23,1],[6,7,1],[6,8,1],[6,12,1],[7,9,1],[7,13,1],[8,11,1],[8,14,1],[9,10,1],[9,15,1],[10,16,1],[11,17,1],[11,18,1]]},
  {id:"glicin",ime:"glicin (aminoetanojska kislina)",f:"H₂NCH₂COOH",vsepr:"AX3E1",c:2,pol:true,vir:"PubChem CID 750",
    a:[["O",-196.4,33.8,-0.4],["O",-63.8,-150.6,1.8],["N",163.5,-9.6,-1.1],["C",39.9,67,0.4],["C",-76,-28.8,2],["H",34,129.4,-89.2],["H",36.1,129.9,89.7],["H",165.7,-70.6,-82.7],["H",167.8,-70.3,80.7],["H",-270.9,-30.1,-1.1]],
    b:[[0,4,1],[0,9,1],[1,4,2],[2,3,1],[2,7,1],[2,8,1],[3,4,1],[3,5,1],[3,6,1]]},
];

// ---------- elementi ----------
// v: valenčni elektroni, M: g/mol (IUPAC), vdw: van der Waalsov polmer v pm, barva: Jmol CPK (prilagojeno temnemu ozadju)
export const ELEMENTI = {
  H: { v: 1, M: 1.008, vdw: 120, barva: "#ffffff", ime: "vodik", rod: "vodika" },
  Be: { v: 2, M: 9.0122, vdw: 153, barva: "#c2ff00", ime: "berilij", rod: "berilija" },
  B: { v: 3, M: 10.81, vdw: 192, barva: "#ffb5b5", ime: "bor", rod: "bora" },
  C: { v: 4, M: 12.011, vdw: 170, barva: "#a0a7b4", ime: "ogljik", rod: "ogljika" },
  N: { v: 5, M: 14.007, vdw: 155, barva: "#3050f8", ime: "dušik", rod: "dušika" },
  O: { v: 6, M: 15.999, vdw: 152, barva: "#e8453c", ime: "kisik", rod: "kisika" },
  F: { v: 7, M: 18.998, vdw: 147, barva: "#90e050", ime: "fluor", rod: "fluora" },
  P: { v: 5, M: 30.974, vdw: 180, barva: "#ff8000", ime: "fosfor", rod: "fosforja" },
  S: { v: 6, M: 32.06, vdw: 180, barva: "#e8d24a", ime: "žveplo", rod: "žvepla" },
  Cl: { v: 7, M: 35.45, vdw: 175, barva: "#4fd06a", ime: "klor", rod: "klora" },
  Br: { v: 7, M: 79.904, vdw: 185, barva: "#a62929", ime: "brom", rod: "broma" },
  Xe: { v: 8, M: 131.29, vdw: 216, barva: "#429eb0", ime: "ksenon", rod: "ksenona" },
};

const VLOGA = {
  H: "Vodikov atom ima en sam elektron, zato tvori le eno vez in je vedno na robu molekule.",
  C: "Ogljikov atom ima štiri valenčne elektrone in vedno tvori štiri vezi (enojne, dvojne ali trojne).",
  N: "Dušikov atom ima pet valenčnih elektronov: z drugimi atomi deli tri elektronske pare (na primer tri enojne vezi ali eno trojno) in ima en prosti elektronski par.",
  O: "Kisikov atom ima šest valenčnih elektronov: tvori dve vezi (ali eno dvojno) in ima dva prosta elektronska para.",
  F: "Fluorov atom ima sedem valenčnih elektronov, zato tvori eno vez in ima tri proste elektronske pare.",
  Cl: "Klorov atom ima sedem valenčnih elektronov, zato tvori eno vez in ima tri proste elektronske pare.",
  Br: "Bromov atom ima sedem valenčnih elektronov in je večji od klorovega.",
  S: "Žveplov atom ima šest valenčnih elektronov in lahko kot element 3. periode tvori več kot štiri vezi.",
  P: "Fosforjev atom ima pet valenčnih elektronov in lahko tvori tri ali pet vezi.",
  B: "Borov atom ima le tri valenčne elektrone, zato ima okoli sebe samo šest elektronov.",
  Be: "Berilijev atom ima dva valenčna elektrona in tvori le dve vezi.",
  Xe: "Ksenon je žlahtni plin, a z zelo elektronegativnim fluorom vseeno tvori vezi.",
};

// oblike po VSEPR (X vezanih atomov, E prostih elektronskih parov na osrednjem atomu) in idealni koti
export const OBLIKE = {
  AX1E0: { ime: "linearna (dvoatomna)", ideal: [] }, AX1E1: { ime: "linearna (dvoatomna)", ideal: [] },
  AX1E2: { ime: "linearna (dvoatomna)", ideal: [] }, AX1E3: { ime: "linearna (dvoatomna)", ideal: [] },
  AX2E0: { ime: "linearna", ideal: [180] },
  AX3E0: { ime: "trikotna ravninska", ideal: [120] },
  AX2E1: { ime: "kotna", ideal: [120] },
  AX4E0: { ime: "tetraedrična", ideal: [109.5] },
  AX3E1: { ime: "trikotna piramidalna", ideal: [109.5] },
  AX2E2: { ime: "kotna", ideal: [109.5] },
  AX5E0: { ime: "trikotna bipiramidalna", ideal: [90, 120, 180] },
  AX4E1: { ime: "gugalnica", ideal: [90, 120, 180] },
  AX3E2: { ime: "oblika črke T", ideal: [90, 180] },
  AX2E3: { ime: "linearna", ideal: [180] },
  AX6E0: { ime: "oktaedrična", ideal: [90, 180] },
  AX5E1: { ime: "kvadratna piramidalna", ideal: [90, 180] },
  AX4E2: { ime: "kvadratna ravninska", ideal: [90, 180] },
};

// ---------- izračuni (izvoženi za test) ----------
const vec = (a, b) => [b[1] - a[1], b[2] - a[2], b[3] - a[3]];
const dolz = (v) => Math.hypot(v[0], v[1], v[2]);
const pika = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

export function sosedi(mol, i) {
  const s = [];
  for (const b of mol.b) { if (b[0] === i) s.push(b[1]); else if (b[1] === i) s.push(b[0]); }
  return s;
}

/** Kot i–c–j v stopinjah. */
export function kot(mol, i, c, j) {
  const u = vec(mol.a[c], mol.a[i]), w = vec(mol.a[c], mol.a[j]);
  return (Math.acos(Math.max(-1, Math.min(1, pika(u, w) / (dolz(u) * dolz(w))))) * 180) / Math.PI;
}

/** Lewisova struktura: formalni naboji, prosti elektronski pari in elektroni okoli vsakega atoma. */
export function lewis(mol) {
  const n = mol.a.length, red = new Array(n).fill(0);
  for (const [i, j, r] of mol.b) { red[i] += r; red[j] += r; }
  const fc = mol.a.map((_, i) => (mol.fc && mol.fc[i]) || 0);
  const pari = mol.a.map((x, i) => (ELEMENTI[x[0]].v - fc[i] - red[i]) / 2);
  const okoli = pari.map((p, i) => 2 * p + 2 * red[i]);
  const valencni = mol.a.reduce((s, x) => s + ELEMENTI[x[0]].v, 0) - (mol.q || 0);
  return { fc, pari, red, okoli, valencni };
}

export function molskaMasa(mol) {
  return mol.a.reduce((s, x) => s + ELEMENTI[x[0]].M, 0);
}

/** Vezni koti pri osrednjem atomu, združeni po vrsti (npr. H–C–H) in velikosti (±3°). */
export function skupineKotov(mol) {
  const c = mol.c, s = sosedi(mol, c);
  if (s.length < 2) return [];
  const el = (i) => mol.a[i][0], vrste = new Map();
  const znak = (k) => { const b = mol.b.find((x) => (x[0] === c && x[1] === k) || (x[1] === c && x[0] === k)); return b[3] || (mol.arom && mol.arom.includes(c) && mol.arom.includes(k)) ? "–" : ["", "–", "=", "≡"][b[2]]; };
  for (let x = 0; x < s.length; x++) for (let y = x + 1; y < s.length; y++) {
    let [i, j] = [s[x], s[y]];
    if (el(i) > el(j)) [i, j] = [j, i];
    const vrsta = `${el(i)}${znak(i)}${el(c)}${znak(j)}${el(j)}`;
    if (!vrste.has(vrsta)) vrste.set(vrsta, []);
    vrste.get(vrsta).push({ i, j, kot: kot(mol, i, c, j) });
  }
  const skupine = [];
  for (const [vrsta, seznam] of vrste) {
    seznam.sort((p, q) => p.kot - q.kot);
    let tren = null;
    for (const p of seznam) {
      if (tren && p.kot - tren.pari[tren.pari.length - 1].kot < 3) tren.pari.push(p);
      else { tren = { vrsta, pari: [p], tezki: [p.i, p.j].filter((k) => el(k) !== "H").length }; skupine.push(tren); }
    }
  }
  for (const g of skupine) g.kot = g.pari.reduce((t, p) => t + p.kot, 0) / g.pari.length;
  skupine.sort((p, q) => q.tezki - p.tezki || q.pari.length - p.pari.length || p.kot - q.kot);
  const vecVrst = vrste.size > 1;
  const izbrane = skupine.slice(0, 3);
  izbrane.sort((p, q) => (vecVrst ? 0 : p.kot - q.kot));
  for (const g of izbrane) g.oznaka = vecVrst ? g.vrsta : "";
  return izbrane;
}

// ---------- oblikovanje besedil ----------
/** Molekule z več notranjimi atomi: oblika okoli vsakega, npr. »C: AX₄ tetraedrična (109,5°) · O: AX₂E₂ kotna«; sicer "". */
export function srediscaVSEPR(mol) {
  const L = lewis(mol), po = new Map();
  mol.a.forEach((x, i) => {
    const X = sosedi(mol, i).length;
    if (X < 2) return;
    if (!po.has(x[0])) po.set(x[0], new Set());
    po.get(x[0]).add(`AX${X}E${L.pari[i]}`);
  });
  if (mol.a.filter((_, i) => sosedi(mol, i).length >= 2).length < 2) return "";
  const red = (e) => ["C", "N", "O", "S", "P"].indexOf(e) + 1 || 9;
  return [...po].sort((a, b) => red(a[0]) - red(b[0])).map(([el, vs]) => `${el}: ` + [...vs].map((v) => {
    const o = OBLIKE[v], ideal = v.endsWith("E0") && o.ideal.length === 1 ? ` (${stopinje(o.ideal[0])})` : "";
    return `${oznakaVSEPR(v)} ${o.ime}${ideal}`;
  }).join(", ")).join(" · ");
}
const SUB = "₀₁₂₃₄₅₆₇₈₉";
const podpis = (n) => String(n).split("").map((d) => SUB[d]).join("");
export function oznakaVSEPR(v) {
  const [, x, e] = v.match(/AX(\d)E(\d)/);
  return "AX" + (x === "1" ? "" : podpis(x)) + (e === "0" ? "" : "E" + (e === "1" ? "" : podpis(e)));
}
const st = (x, d = 1) => (Math.round(x * 10 ** d) / 10 ** d).toFixed(d).replace(".", ",");
const stopinje = (x) => (Math.abs(x - Math.round(x)) < 0.05 ? String(Math.round(x)) : st(x)) + "°";
function sklon(n, oblike) { const m = n % 100; return m === 1 ? oblike[0] : m === 2 ? oblike[1] : m === 3 || m === 4 ? oblike[2] : oblike[3]; }
const BESEDA = ["nič", "en", "dva", "tri", "štiri", "pet", "šest"];
const atomov = (n) => `${BESEDA[n] || n} ${sklon(n, ["atom", "atoma", "atome", "atomov"])}`;
const parov = (n) => (n === 0 ? "nima prostih elektronskih parov" : `ima ${BESEDA[n] || n} ${sklon(n, ["prosti elektronski par", "prosta elektronska para", "proste elektronske pare", "prostih elektronskih parov"])}`);
const NABOJ = { 1: "1+", 2: "2+", "-1": "1−", "-2": "2−" };

// ---------- gradnja ----------
const NAPREJ = [0.47, 0.34, 0.81]; // pribl. smer privzete kamere (azimut 30°, višina 20°)
const POLMER_VEZI = { kroglice: [9, 6, 5], palcke: [13, 7, 5.5] }; // pm, enojna/dvojna/trojna
const RAZMIK = { kroglice: [0, 9.5, 12], palcke: [0, 8, 10] };
const ZAOKROZI_MERILO = [200, 250, 300, 350, 400, 450, 500, 600, 700, 800, 900, 1000, 1200, 1400, 1600, 2000];

function polmerAtoma(el, prikaz) {
  if (prikaz === "kalota") return ELEMENTI[el].vdw;
  if (prikaz === "palcke") return 15;
  return (el === "H" ? 0.2 : 0.23) * ELEMENTI[el].vdw;
}

function fib(n) {
  const t = [];
  for (let k = 0; k < n; k++) {
    const y = 1 - (2 * (k + 0.5)) / n, r = Math.sqrt(1 - y * y), f = k * 2.399963229728653;
    t.push([r * Math.cos(f), y, r * Math.sin(f)]);
  }
  return t;
}
const enota = (v) => { const d = dolz(v) || 1; return [v[0] / d, v[1] / d, v[2] / d]; };
const krat = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
function pravokotno(v, os) { const d = pika(v, os); return [v[0] - d * os[0], v[1] - d * os[1], v[2] - d * os[2]]; }

/** Priprava molekule: središče, pravokotnice vezi, smeri prostih parov, koti. */
function pripravi(mol) {
  const n = mol.a.length;
  let lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
  for (const x of mol.a) for (let k = 0; k < 3; k++) { lo[k] = Math.min(lo[k], x[k + 1]); hi[k] = Math.max(hi[k], x[k + 1]); }
  const sr = [0, 1, 2].map((k) => (lo[k] + hi[k]) / 2);
  const p = mol.a.map((x) => [x[1] - sr[0], x[2] - sr[1], x[3] - sr[2]]);
  const sos = mol.a.map((_, i) => sosedi(mol, i));
  const L = lewis(mol);
  const deloc = mol.b.some((b) => b[3]);
  const arom = new Set(mol.arom || []);
  // pravokotnica za vzporedne palčke večkratnih vezi (v ravnini sosednjih atomov)
  const nadomestne = new Map();
  const kolm = mol.b.map(([i, j, r]) => {
    const os = enota([p[j][0] - p[i][0], p[j][1] - p[i][1], p[j][2] - p[i][2]]);
    for (const [a, k] of [...sos[i].filter((k) => k !== j).map((k) => [i, k]), ...sos[j].filter((k) => k !== i).map((k) => [j, k])]) {
      const w = pravokotno([p[k][0] - p[a][0], p[k][1] - p[a][1], p[k][2] - p[a][2]], os);
      if (dolz(w) > 5) return enota(w);
    }
    let st = 0;
    if (r > 1) { st = (nadomestne.get(i) || 0) + (nadomestne.get(j) || 0); nadomestne.set(i, (nadomestne.get(i) || 0) + 1); nadomestne.set(j, (nadomestne.get(j) || 0) + 1); }
    let w = pravokotno(st % 2 ? [0, 0, 1] : [0, 1, 0], os);
    if (dolz(w) < 0.1) w = pravokotno([0, 0, 1], os);
    return enota(w);
  });
  const vezMed = (i, j) => mol.b.findIndex((b) => (b[0] === i && b[1] === j) || (b[0] === j && b[1] === i));
  // smeri prostih elektronskih parov
  const halogeni = mol.a.filter((x) => ["F", "Cl", "Br"].includes(x[0])).length;
  const pari = [];
  for (let i = 0; i < n; i++) {
    const l = L.pari[i];
    if (!(l > 0)) continue;
    const el = mol.a[i][0];
    const prikazi = i === mol.c || (!deloc && (["O", "N", "S"].includes(el) || (["F", "Cl", "Br"].includes(el) && halogeni <= 2)));
    if (!prikazi) continue;
    const vezi = sos[i].map((k) => enota([p[k][0] - p[i][0], p[k][1] - p[i][1], p[k][2] - p[i][2]]));
    let smeri;
    if (vezi.length === 1) {
      const b = vezi[0], k = sos[i][0];
      let q = null;
      const bi = vezMed(i, k);
      if (mol.b[bi][2] > 1) q = kolm[bi];
      else for (const m of sos[k]) if (m !== i) { const w = pravokotno([p[m][0] - p[k][0], p[m][1] - p[k][1], p[m][2] - p[k][2]], b); if (dolz(w) > 5) { q = enota(w); break; } }
      if (!q) q = kolm[bi];
      const r = krat(b, q);
      if (l === 1) smeri = [[-b[0], -b[1], -b[2]]];
      else if (l === 2) smeri = [1, -1].map((s) => [0, 1, 2].map((k) => -0.5 * b[k] + s * 0.8660254 * q[k]));
      else {
        const ct = Math.cos((109.47 * Math.PI) / 180), sn = Math.sin((109.47 * Math.PI) / 180);
        smeri = [60, 180, 300].map((f) => { const c = Math.cos((f * Math.PI) / 180), s = Math.sin((f * Math.PI) / 180); return [0, 1, 2].map((k) => ct * b[k] + sn * (c * q[k] + s * r[k])); });
      }
    } else smeri = odboj(vezi, l);
    for (const d of smeri) pari.push({ i, d: enota(d) });
  }
  return { p, sos, L, deloc, arom, kolm, pari, koti: skupineKotov(mol) };
}

/** Smeri prostih parov z odbojem na krogli: vezi so pritrjene, pari se odbijajo močneje (VSEPR). */
function odboj(vezi, l) {
  const kand = fib(96), izb = [];
  const kotMed = (a, b) => Math.acos(Math.max(-1, Math.min(1, pika(a, b))));
  for (let k = 0; k < l; k++) {
    let naj = null, najV = -1;
    for (const c of kand) {
      const v = Math.min(...vezi.map((b) => kotMed(b, c)), ...izb.map((b) => kotMed(b, c)));
      if (v > najV + 1e-9) { najV = v; naj = c; }
    }
    izb.push(naj.slice());
  }
  for (let it = 0; it < 400; it++) {
    for (let a = 0; a < izb.length; a++) {
      const x = izb[a], F = [0, 0, 0];
      const potisni = (o, w) => { const d = [x[0] - o[0], x[1] - o[1], x[2] - o[2]], r = Math.max(dolz(d), 1e-3), f = w / (r * r * r); F[0] += d[0] * f; F[1] += d[1] * f; F[2] += d[2] * f; };
      for (const b of vezi) potisni(b, 1);
      for (let o = 0; o < izb.length; o++) if (o !== a) potisni(izb[o], 1.4);
      const t = pravokotno(F, x);
      izb[a] = enota([x[0] + 0.02 * t[0], x[1] + 0.02 * t[1], x[2] + 0.02 * t[2]]);
    }
  }
  return izb;
}

function zlepi(THREE, geos) {
  let n = 0, m = 0;
  for (const g of geos) { n += g.attributes.position.count; m += g.index.count; }
  const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), idx = new Uint32Array(m);
  let o = 0, oi = 0;
  for (const g of geos) {
    pos.set(g.attributes.position.array, o * 3); nor.set(g.attributes.normal.array, o * 3);
    for (let k = 0; k < g.index.count; k++) idx[oi + k] = g.index.array[k] + o;
    o += g.attributes.position.count; oi += g.index.count; g.dispose();
  }
  const r = new THREE.BufferGeometry();
  r.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  r.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
  r.setIndex(new THREE.BufferAttribute(idx, 1));
  return r;
}

// Oznaka kota je točka (Points) s kvadratno teksturo, ne Sprite: senčenje okolice (GTAO) točke izpusti,
// Sprite pa bi v njem dobil temen pravokotnik.
function napis(THREE, besedilo) {
  if (typeof document === "undefined") return null;
  const cv = document.createElement("canvas"), w = 256, h = 256, y0 = 80;
  cv.width = w; cv.height = h;
  const g = cv.getContext("2d");
  if (!g) return null;
  g.font = "600 50px 'Instrument Sans', system-ui, sans-serif";
  const tw = Math.min(w - 8, g.measureText(besedilo).width + 36);
  const x0 = (w - tw) / 2, r = 26;
  g.fillStyle = "rgba(11,15,22,0.82)"; g.strokeStyle = "rgba(110,155,255,0.9)"; g.lineWidth = 3;
  g.beginPath();
  g.moveTo(x0 + r, y0 + 14); g.lineTo(x0 + tw - r, y0 + 14); g.arcTo(x0 + tw, y0 + 14, x0 + tw, y0 + 48, r); g.arcTo(x0 + tw, y0 + 82, x0 + tw - r, y0 + 82, r);
  g.lineTo(x0 + r, y0 + 82); g.arcTo(x0, y0 + 82, x0, y0 + 48, r); g.arcTo(x0, y0 + 14, x0 + r, y0 + 14, r); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = "#e8ecf3"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(besedilo, w / 2, y0 + 50);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  // three meri velikost točke v polovici višine zaslona: faktor 2,7 pri vidnem kotu 40° da širino ≈ 0,3 enote
  const mat = new THREE.PointsMaterial({ map: tex, size: 0.3 * 2.7, sizeAttenuation: true, depthTest: false, depthWrite: false, transparent: true });
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(3), 3));
  const s = new THREE.Points(geo, mat);
  s.renderOrder = 20; s.raycast = () => {}; // napis ni tarča tapa (prag točk v Raycasterju je 1 enota)
  return s;
}

export function zgradi(THREE, ctx = {}) {
  const visoka = ctx.kakovost !== "nizka";
  const z = ctx.zacetek || {};
  const naId = (id) => MOLEKULE.find((m) => m.id === id);
  const stanje = {
    molekula: naId(z.molekula) ? z.molekula : "voda",
    prikaz: ["kroglice", "kalota", "palcke"].includes(z.prikaz) ? z.prikaz : "kroglice",
    pari: z.pari !== undefined ? !!z.pari : true,
    koti: z.koti !== undefined ? !!z.koti : true,
    vodik: !!z.vodik,
  };
  const group = new THREE.Group();
  group.name = "molekule";
  const vsebina = new THREE.Group();
  group.add(vsebina);

  // skupne geometrije in materiali
  const gSfera = new THREE.SphereGeometry(1, visoka ? 40 : 18, visoka ? 28 : 12);
  // reženj prostega para: kapljica, ozka ob atomu in zaobljena navzven (vrtenina okoli osi y, y od −1 do 1)
  const nPar = visoka ? 22 : 12;
  const gPar = new THREE.LatheGeometry(Array.from({ length: nPar + 1 }, (_, k) => {
    const t = k / nPar, sir = Math.sin(Math.PI * t) * (0.5 + 0.6 * Math.sin((Math.PI * t) / 2));
    return new THREE.Vector2(k === 0 || k === nPar ? 0 : sir, -Math.cos(Math.PI * t));
  }), visoka ? 28 : 14);
  const gPika = new THREE.SphereGeometry(1, visoka ? 12 : 8, visoka ? 8 : 6);
  const seg = visoka ? 20 : 10;
  const gValj = new THREE.CylinderGeometry(1, 1, 1, seg, 1, true);
  const gCrtka = zlepi(THREE, [0, 1, 2].map((k) => { const g = new THREE.CylinderGeometry(1, 1, 0.2, seg, 1, false); g.translate(0, -0.4 + k * 0.333, 0); return g; }));
  const skupne = [gSfera, gPar, gPika, gValj, gCrtka];
  const matAtom = {}, matVez = {};
  // skupni videz atomov (enako v modelih atom, kristali, periodni sistem): sijoč lak in mehak rob (sheen)
  const fizMat = (barva, o = {}) => new THREE.MeshPhysicalMaterial({ color: barva, roughness: 0.32, metalness: 0, clearcoat: 0.7, clearcoatRoughness: 0.14, sheen: 0.35, sheenRoughness: 0.45, sheenColor: "#dfe7ff", ...o });
  const atomMat = (el) => (matAtom[el] ||= fizMat(ELEMENTI[el].barva));
  const vezMat = (el) => (matVez[el] ||= fizMat(ELEMENTI[el].barva, { roughness: 0.36, clearcoat: 0.45, sheen: 0.2 }));
  // prosti pari: steklasti režnji z mehkim robom, elektroni v njih rahlo žarijo
  const matPar = fizMat("#a77dff", { transparent: true, opacity: 0.58, roughness: 0.38, clearcoat: 0.55, clearcoatRoughness: 0.1, emissive: "#7a3dff", emissiveIntensity: 1.2, sheen: 0.8, sheenRoughness: 0.35, sheenColor: "#b48cff", depthWrite: false });
  const matPika = fizMat("#f6f1ff", { roughness: 0.3, emissive: "#a487ff", emissiveIntensity: 0.75, sheen: 0 });
  const matObroc = fizMat("#d9defa", { roughness: 0.3, clearcoat: 0.6, emissive: "#5b4bd6", emissiveIntensity: 0.22 });
  // polnilo kota: od vrha proti loku vse manj prosojno (barve oglišč z alfo)
  const matKot = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, side: THREE.DoubleSide, depthWrite: false });
  const matRob = fizMat("#9cbcff", { roughness: 0.35, clearcoat: 0.3, emissive: "#3a64d0", emissiveIntensity: 0.6, sheen: 0 });
  const skupniMat = [matPar, matPika, matObroc, matKot, matRob];

  let zacasno = []; // geometrije, materiali, teksture te gradnje
  const priprava = new Map();
  const M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), S = new THREE.Vector3(), P = new THREE.Vector3(), Y = new THREE.Vector3(0, 1, 0);

  function instance(geo, mat, seznam) {
    const im = new THREE.InstancedMesh(geo, mat, seznam.length);
    seznam.forEach((t, k) => im.setMatrixAt(k, t));
    im.instanceMatrix.needsUpdate = true;
    vsebina.add(im);
    return im;
  }
  const matrika = (pos, smer, sx, sy, sz) => {
    P.set(pos[0], pos[1], pos[2]);
    if (smer) Q.setFromUnitVectors(Y, new THREE.Vector3(smer[0], smer[1], smer[2]).normalize()); else Q.identity();
    S.set(sx, sy, sz);
    return new THREE.Matrix4().compose(P, Q, S);
  };

  const m = { group, deli: [], nadzor: [], merilo: info.merilo };

  function zgradiVsebino() {
    for (const o of [...vsebina.children]) { vsebina.remove(o); if (o.isInstancedMesh) o.dispose(); }
    for (const x of zacasno) x.dispose();
    zacasno = [];
    const mol = naId(stanje.molekula);
    if (!priprava.has(mol.id)) priprava.set(mol.id, pripravi(mol));
    const pr = priprava.get(mol.id);
    const prikaz = stanje.prikaz;
    const skrijH = stanje.vodik && mol.a.filter((x) => x[0] !== "H").length >= 2; // en sam atom brez vodikov nima smisla
    const vidi = (i) => !(skrijH && mol.a[i][0] === "H");
    const rA = (i) => polmerAtoma(mol.a[i][0], prikaz);

    // merilo: celotna molekula (vključno s skritimi H) naj leži v krogli s polmerom ≤ 0,92
    let R = 0, lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
    pr.p.forEach((q, i) => { R = Math.max(R, dolz(q) + rA(i)); for (let k = 0; k < 3; k++) { lo[k] = Math.min(lo[k], q[k] - rA(i)); hi[k] = Math.max(hi[k], q[k] + rA(i)); } });
    // prosti pari (konica režnja) naj bodo v isti krogli, tudi ko so izklopljeni, da se merilo ob stikalu ne spremeni
    if (prikaz !== "kalota") for (const { i, d } of pr.pari) {
      const q = [0, 1, 2].map((k) => pr.p[i][k] + d[k] * (rA(i) * 0.45 + 72));
      R = Math.max(R, dolz(q) + 4); for (let k = 0; k < 3; k++) { lo[k] = Math.min(lo[k], q[k] - 4); hi[k] = Math.max(hi[k], q[k] + 4); }
    }
    const Rskatla = Math.hypot(hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]) / 2;
    const potrebno = 2 * Math.max(R / 0.92, Rskatla / 1.45);
    const D = ZAOKROZI_MERILO.find((d) => d >= potrebno) || Math.ceil(potrebno / 500) * 500;
    const s = 2 / D; // enot scene na pm
    m.merilo = { m: D * 1e-12, oznaka: `${String(D / 1000).replace(".", ",")} nm` };
    // ko so vodikovi atomi skriti, je središče v sredini vidnih atomov
    const vl = [Infinity, Infinity, Infinity], vh = [-Infinity, -Infinity, -Infinity];
    pr.p.forEach((q, i) => { if (vidi(i)) for (let k = 0; k < 3; k++) { vl[k] = Math.min(vl[k], q[k]); vh[k] = Math.max(vh[k], q[k]); } });
    const sm = skrijH ? [0, 1, 2].map((k) => (vl[k] + vh[k]) / 2) : [0, 0, 0];
    const pos = (i) => [(pr.p[i][0] - sm[0]) * s, (pr.p[i][1] - sm[1]) * s, (pr.p[i][2] - sm[2]) * s];

    // atomi
    const poEl = new Map();
    mol.a.forEach((x, i) => { if (!vidi(i)) return; if (!poEl.has(x[0])) poEl.set(x[0], []); poEl.get(x[0]).push(i); });
    const atomMesh = new Map();
    for (const [el, idx] of poEl) {
      const r = polmerAtoma(el, prikaz) * s;
      const im = instance(gSfera, atomMat(el), idx.map((i) => matrika(pos(i), null, r, r, r)));
      im.name = "atomi-" + el;
      atomMesh.set(el, im);
    }

    // vezi: vsaka vez razdeljena na dve polovici v barvah atomov
    const vezMeshes = [];
    let vezTocka = null, vezRed = 0, vezVid = -Infinity;
    const redi = new Set();
    if (prikaz !== "kalota") {
      const polni = new Map(), crtkani = new Map();
      const dodajPol = (mapa, el, a, b, r) => {
        const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], l = dolz(d);
        if (l < 1e-6) return;
        if (!mapa.has(el)) mapa.set(el, []);
        mapa.get(el).push(matrika([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2], d, r, l, r));
      };
      const [rb1, rb2, rb3] = POLMER_VEZI[prikaz], [, d2, d3] = RAZMIK[prikaz];
      mol.b.forEach(([i, j, red, dl], k) => {
        if (!vidi(i) || !vidi(j)) return;
        const pi = pos(i), pj = pos(j), os = enota([pj[0] - pi[0], pj[1] - pi[1], pj[2] - pi[2]]), L = dolz([pj[0] - pi[0], pj[1] - pi[1], pj[2] - pi[2]]);
        const ri = rA(i) * s, rj = rA(j) * s;
        const t = (ri + Math.max(0, L - ri - rj) / 2) / L;
        const w = pr.kolm[k];
        const prikazRed = pr.arom.has(i) && pr.arom.has(j) ? 1 : red;
        let palcke;
        if (dl) palcke = [[-d2, rb2, false], [d2, rb2, true]];
        else if (prikazRed === 1) palcke = [[0, rb1, false]];
        else if (prikazRed === 2) palcke = [[-d2, rb2, false], [d2, rb2, false]];
        else palcke = [[-d3, rb3, false], [0, rb3, false], [d3, rb3, false]];
        redi.add(dl ? "r" : pr.arom.has(i) && pr.arom.has(j) ? "a" : String(red));
        for (const [o, r, crt] of palcke) {
          const off = [w[0] * o * s, w[1] * o * s, w[2] * o * s];
          const a = [pi[0] + off[0], pi[1] + off[1], pi[2] + off[2]], b = [pj[0] + off[0], pj[1] + off[1], pj[2] + off[2]];
          const sred = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
          dodajPol(crt ? crtkani : polni, mol.a[i][0], a, sred, r * s);
          dodajPol(crt ? crtkani : polni, mol.a[j][0], sred, b, r * s);
        }
        const mid = [(pi[0] + pj[0]) / 2, (pi[1] + pj[1]) / 2, (pi[2] + pj[2]) / 2];
        const vid = pika(mid, NAPREJ) + (red > 1 && !pr.arom.has(i) ? 10 : 0) - (mol.a[i][0] === "H" || mol.a[j][0] === "H" ? 0.5 : 0);
        if (vid > vezVid) { vezVid = vid; vezTocka = mid; vezRed = red; }
      });
      for (const [el, sez] of polni) vezMeshes.push(instance(gValj, vezMat(el), sez));
      for (const [el, sez] of crtkani) vezMeshes.push(instance(gCrtka, vezMat(el), sez));
      if (pr.arom.size) {
        const ob = [...pr.arom], c = [0, 0, 0];
        for (const i of ob) for (let k = 0; k < 3; k++) c[k] += pos(i)[k] / ob.length;
        const rr = dolz([pos(ob[0])[0] - c[0], pos(ob[0])[1] - c[1], pos(ob[0])[2] - c[2]]);
        const nrm = enota(krat([pos(ob[0])[0] - c[0], pos(ob[0])[1] - c[1], pos(ob[0])[2] - c[2]], [pos(ob[1])[0] - c[0], pos(ob[1])[1] - c[1], pos(ob[1])[2] - c[2]]));
        const g = new THREE.TorusGeometry(rr * 0.6, rb2 * s * 0.9, visoka ? 12 : 8, visoka ? 72 : 36);
        zacasno.push(g);
        const t = new THREE.Mesh(g, matObroc);
        t.position.set(c[0], c[1], c[2]);
        t.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(...nrm));
        vsebina.add(t); vezMeshes.push(t);
      }
    }

    // prosti elektronski pari
    const parMeshes = [];
    let parTocka = null;
    if (stanje.pari && prikaz !== "kalota" && pr.pari.length) {
      const lobi = [], pike = [];
      let naj = -Infinity;
      for (const { i, d } of pr.pari) {
        const ra = rA(i), dol = 72, sir = 23;
        const c = pos(i), sred = [0, 1, 2].map((k) => c[k] + d[k] * (ra * 0.45 + dol / 2) * s);
        lobi.push(matrika(sred, d, sir * s, (dol / 2) * s, sir * s));
        const pr1 = enota(krat(d, Math.abs(d[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0]));
        for (const z of [-1, 1]) pike.push(matrika([0, 1, 2].map((k) => c[k] + d[k] * (ra * 0.45 + dol * 0.62) * s + pr1[k] * z * 7 * s), null, 4.5 * s, 4.5 * s, 4.5 * s));
        const vrh = [0, 1, 2].map((k) => c[k] + d[k] * (ra * 0.45 + dol * 0.8) * s);
        const v = pika(vrh, NAPREJ) + (i === mol.c ? 10 : 0);
        if (v > naj) { naj = v; parTocka = vrh; }
      }
      const lm = instance(gPar, matPar, lobi); lm.renderOrder = 2;
      parMeshes.push(lm, instance(gPika, matPika, pike));
    }

    // vezni koti
    const kotMeshes = [];
    let kotTocka = null;
    if (stanje.koti && prikaz !== "kalota") {
      const c = pos(mol.c), rc = rA(mol.c) * s;
      for (const g of pr.koti) {
        // predstavnik skupine: par, katerega ravnina je najbolj obrnjena proti gledalcu
        let naj = null, najV = -1;
        for (const q of g.pari) {
          if (!vidi(q.i) || !vidi(q.j)) continue;
          const u = enota(pr.p[q.i].map((x, k) => x - pr.p[mol.c][k])), w = enota(pr.p[q.j].map((x, k) => x - pr.p[mol.c][k]));
          const nn = krat(u, w), v = dolz(nn) > 0.05 ? Math.abs(pika(enota(nn), NAPREJ)) : 0.5;
          if (v > najV + 1e-6) { najV = v; naj = { q, u, w }; }
        }
        if (!naj) continue;
        const { q, u } = naj;
        let w = pravokotno(naj.w, u);
        if (dolz(w) < 1e-3) { w = krat(NAPREJ, u); if (dolz(w) < 1e-3) w = krat([0, 1, 0], u); }
        w = enota(w);
        const n = krat(u, w), th = (q.kot * Math.PI) / 180;
        const Lmin = Math.min(dolz(pr.p[q.i].map((x, k) => x - pr.p[mol.c][k])), dolz(pr.p[q.j].map((x, k) => x - pr.p[mol.c][k]))) * s;
        const rSos = Math.max(rA(q.i), rA(q.j)) * s;
        const rad = Math.max(rc + 0.03, Math.min(Lmin * 0.68, Lmin - rSos - 0.02));
        const segm = Math.max(12, Math.round((visoka ? 48 : 24) * th / Math.PI));
        const gf = new THREE.CircleGeometry(rad, segm, 0, th), gr = new THREE.TorusGeometry(rad, 0.0075, visoka ? 10 : 6, segm, th);
        const bk = new Float32Array(gf.attributes.position.count * 4), KC = [0.24, 0.4, 1];
        for (let v = 0; v < bk.length / 4; v++) { bk.set(KC, v * 4); bk[v * 4 + 3] = v === 0 ? 0.04 : 0.38; }
        gf.setAttribute("color", new THREE.BufferAttribute(bk, 4));
        // pri iztegnjenem kotu (180°) le lok, brez polnila
        zacasno.push(gf, gr);
        const baza = new THREE.Matrix4().makeBasis(new THREE.Vector3(...u), new THREE.Vector3(...w), new THREE.Vector3(...n)).setPosition(c[0], c[1], c[2]);
        const f = new THREE.Mesh(gf, matKot), r = new THREE.Mesh(gr, matRob);
        for (const o of q.kot < 170 ? [f, r] : [r]) { o.matrixAutoUpdate = false; o.matrix.copy(baza); vsebina.add(o); kotMeshes.push(o); }
        f.renderOrder = 3;
        const sim = [0, 1, 2].map((k) => u[k] * Math.cos(th / 2) + w[k] * Math.sin(th / 2));
        const tocka = sim.map((x, k) => c[k] + x * rad);
        if (!kotTocka) kotTocka = tocka;
        const sp = napis(THREE, stopinje(g.kot));
        if (sp) {
          sp.position.set(...sim.map((x, k) => c[k] + x * (rad + 0.13)));
          vsebina.add(sp); zacasno.push(sp.material.map, sp.material, sp.geometry);
        }
      }
    }

    // deli
    const deli = [];
    const ven = (q, r) => { const d = dolz(q); return d < 1e-6 ? NAPREJ.map((x, k) => q[k] + x * r) : q.map((x) => x + (x / d) * r); }; // atom v središču: točka na strani proti kameri
    for (const [el, idx] of poEl) {
      const osrednji = el === mol.a[mol.c][0] && idx.length === 1 && mol.a.length > 2;
      let i = idx[0], v = -Infinity;
      for (const k of idx) { const t = pika(pos(k), NAPREJ) + (k === mol.c ? 10 : 0); if (t > v) { v = t; i = k; } }
      const E = ELEMENTI[el];
      const X = pr.sos[mol.c].length, l = pr.L.pari[mol.c];
      let opis = VLOGA[el];
      if (osrednji) opis = `Osrednji atom ${E.rod} veže ${atomov(X)} in ${parov(l)}; vsi elektronski pari okoli njega se odbijajo in tako določijo obliko.`;
      else if (pr.deloc && el === "O" && mol.a[mol.c][0] === "O") opis = "Osrednji kisikov atom veže dva atoma in ima en prosti elektronski par; zunanja kisikova atoma sta enakovredna: elektroni dvojne vezi in naboj so razporejeni po obeh vezeh.";
      else if (pr.deloc && el === "O") opis = "Kisikovi atomi so enakovredni: elektroni dvojne vezi in naboj so razporejeni po vseh vezeh.";
      deli.push({
        id: "atomi-" + el, ime: (osrednji ? "Osrednji atom " : idx.length > 1 ? "Atomi " : "Atom ") + E.rod, opis, barva: E.barva,
        meshes: [atomMesh.get(el)], tocka: ven(pos(i), polmerAtoma(el, prikaz) * s * 0.9),
      });
    }
    if (vezMeshes.length) {
      const deli2 = [];
      if (redi.has("1")) deli2.push("enojno vez tvori en skupni elektronski par");
      if (redi.has("2")) deli2.push("dvojno vez tvorita dva skupna para (dve vzporedni palčki)");
      if (redi.has("3")) deli2.push("trojno vez tvorijo trije skupni pari (tri palčke)");
      let opis = deli2.length ? deli2.join(", ") : "";
      opis = opis ? opis[0].toUpperCase() + opis.slice(1) + "." : "";
      if (redi.has("r")) opis += (opis ? " " : "") + "Črtkana palčka pomeni, da je en elektronski par razporejen po več vezeh (resonanca), zato so vse vezi enako dolge.";
      if (redi.has("a")) opis += (opis ? " " : "") + "Obroč v benzenu pomeni šest elektronov, enakomerno razporejenih po vseh šestih vezeh med ogljikovimi atomi.";
      deli.push({ id: "vezi", ime: "Vezi", opis, barva: "#c9d1de", meshes: vezMeshes, tocka: vezTocka || [0, 0, 0] });
    }
    if (parMeshes.length) {
      deli.push({ id: "pari", ime: "Prosti elektronski pari", opis: "Pari elektronov, ki niso v vezi: zavzamejo več prostora kot vezi in zato stisnejo vezne kote.", barva: "#b08cff", meshes: parMeshes, tocka: parTocka });
    }
    if (kotMeshes.length) {
      deli.push({ id: "kot", ime: "Vezni kot", opis: "Kot med dvema vezema pri osrednjem atomu; določa ga odboj vseh elektronskih parov okoli atoma.", barva: "#6e9bff", meshes: kotMeshes, tocka: kotTocka });
    }
    m.deli = deli;
  }

  // izpisi
  const trenutna = () => naId(stanje.molekula);
  const izpisFormula = () => { const mol = trenutna(); return `${mol.f}, M = ${st(molskaMasa(mol), 2)} g/mol`; };
  const izpisOblika = () => {
    const mol = trenutna();
    const s = srediscaVSEPR(mol) || `${oznakaVSEPR(mol.vsepr)} – ${OBLIKE[mol.vsepr].ime}`;
    return mol.opomba ? `${s} · ${mol.opomba}` : s;
  };
  const izpisKot = () => {
    const mol = trenutna(), g = skupineKotov(mol), ideal = OBLIKE[mol.vsepr].ideal;
    if (!g.length) return "le ena vez – ni veznega kota";
    const izm = g.map((x) => stopinje(x.kot) + (x.oznaka ? ` (${x.oznaka})` : "")).join(", ");
    return `idealno ${ideal.map(stopinje).join(", ")} · ${/^PubChem/.test(mol.vir) ? "izračunano" : "izmerjeno"} ${izm}`;
  };
  const izpisPolarnost = () => {
    const mol = trenutna();
    if (mol.q) return `ion z nabojem ${NABOJ[mol.q]}`;
    if (mol.pol && mol.a.length === 2) return "polarna (različna atoma)";
    if (mol.pol) return "polarna (dipoli vezi se ne izničijo)";
    if (mol.a.length === 2) return "nepolarna (enaka atoma)";
    return "nepolarna (simetrična, dipoli vezi se izničijo)";
  };

  m.nadzor = [
    { tip: "izbira", id: "molekula", oznaka: "Molekula", moznosti: MOLEKULE.map((x) => [x.id, `${x.ime[0].toUpperCase()}${x.ime.slice(1)} – ${x.f}`]), vrednost: stanje.molekula, ob: (v) => { if (naId(v)) { stanje.molekula = v; zgradiVsebino(); } } },
    { tip: "izbira", id: "prikaz", oznaka: "Prikaz", moznosti: [["kroglice", "Kroglice in palčke"], ["kalota", "Kalotni model"], ["palcke", "Palčke"]], vrednost: stanje.prikaz, ob: (v) => { stanje.prikaz = v; zgradiVsebino(); } },
    { tip: "stikalo", id: "pari", oznaka: "Prosti elektronski pari", vrednost: stanje.pari, ob: (v) => { stanje.pari = !!v; zgradiVsebino(); } },
    { tip: "stikalo", id: "koti", oznaka: "Vezni koti", vrednost: stanje.koti, ob: (v) => { stanje.koti = !!v; zgradiVsebino(); } },
    { tip: "stikalo", id: "vodik", oznaka: "Skrij vodikove atome", vrednost: stanje.vodik, ob: (v) => { stanje.vodik = !!v; zgradiVsebino(); },
      // smiselno le, ko ima molekula vodikove atome in vsaj dva druga atoma
      vidno: () => { const a = trenutna().a; return a.some((x) => x[0] === "H") && a.filter((x) => x[0] !== "H").length >= 2; } },
    { tip: "izpis", id: "formula", oznaka: "Formula in molska masa", vrednost: izpisFormula },
    { tip: "izpis", id: "oblika", oznaka: "Oblika (VSEPR)", vrednost: izpisOblika },
    { tip: "izpis", id: "kot", oznaka: "Vezni kot", vrednost: izpisKot },
    { tip: "izpis", id: "polarnost", oznaka: "Polarnost", vrednost: izpisPolarnost },
  ];

  m.dispose = () => {
    for (const o of [...vsebina.children]) if (o.isInstancedMesh) o.dispose();
    for (const x of zacasno) x.dispose();
    for (const g of skupne) g.dispose();
    for (const x of [...Object.values(matAtom), ...Object.values(matVez), ...skupniMat]) x.dispose();
  };

  zgradiVsebino();
  return m;
}

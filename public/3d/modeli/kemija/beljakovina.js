// Beljakovine iz Proteinske podatkovne banke (PDB): hemoglobin, inzulin in zeleni fluorescentni protein (GFP).
// Pogodba: docs/3d.md.
//
// Viri (podatki PDB so v javni lasti, licenca CC0 1.0; https://www.rcsb.org, wwPDB):
// - 2HHB: G. Fermi, M. F. Perutz, B. Shaanan, R. Fourme (1984), »The crystal structure of human deoxyhaemoglobin
//   at 1.74 Å resolution«, J. Mol. Biol. 175, 159–174.
// - 4INS: E. N. Baker, T. L. Blundell, J. F. Cutfield, S. M. Cutfield, E. J. Dodson, G. G. Dodson, D. M. C. Hodgkin
//   in sod. (1988), »The structure of 2Zn pig insulin crystals at 1.5 Å resolution«, Phil. Trans. R. Soc. Lond. B 319, 369–456.
// - 1EMA: M. Ormö, A. B. Cubitt, K. Kallio, L. A. Gross, R. Y. Tsien, S. J. Remington (1996), »Crystal structure of the
//   Aequorea victoria green fluorescent protein«, Science 273, 1392–1395.
// Poenostavljeno: za vsako aminokislino le atom Cα (zaokrožen na 0,1 Å), sekundarna struktura iz zapisov HELIX/SHEET,
// atomi hema, kromoforja in cisteinov disulfidnih mostov. Koordinate so premaknjene v težišče in zasukane na glavne osi
// (pravi zasuk, zrcaljenja ni). Enota: 0,1 Å.

export const info = {
  id: "beljakovina",
  naslov: "Beljakovina",
  podrocje: "kemija",
  predmet: "BIO",
  opis: "Hemoglobin, inzulin in zeleni fluorescentni protein iz pravih kristalnih struktur (PDB). Poenostavljeno: prikazana je le glavna veriga skozi atome Cα (osrednji ogljikov atom vsake aminokisline), stranske verige aminokislin niso prikazane.",
  merilo: { m: 7e-9, oznaka: "7 nm" },
  poskusi: "Preklopi barve po zgradbi in poišči α-vijačnice in β-ploskve; primerjaj hemoglobin z GFP.",
};

// ---------------------------------------------------------------- podatki PDB
const PDB = {
  hemoglobin: {
    pdb: "2HHB",
    verige: [
      { id: "A", z: 1, n: 141,
        sq: "VLSPADKTNVKAAWGKVGAHAGEYGAEALERMFLSFPTTKTYFPHFDLSHGSAQVKGHGKKVADALTNAVAHVDDMPNALSALSDLHAHKLRVDPVNFKLLSHCLLVTLAAHLPAEFTPAVHASLDKFLASVSTVLTSKYR",
        ss: "--HHHHHHHHHHHHHHHH-HHHHHHHHHHHHHHHHHHHHHHH---------HHHHHHHHHHHHHHHHHHHH--------HHHHHHHHH-----HHHHHHHHHHHHHHHHHHH-----HHHHHHHHHHHHHHHHHHHHH---",
        ca: "-82,-13,-183,-113,8,-184,-141,-10,-203,-164,11,-225,-191,7,-199,-166,22,-174,-161,51,-197,-198,57,-201,-202,56,-163,-174,81,-156,-187,105,-184,-221,103,-169,-212,109,-134,-187,137,-141,-212,152,-164,-234,156,-134,-205,171,-115,-204,198,-141,-197,231,-127,-191,221,-92,-159,204,-102,-137,229,-85,-157,231,-53,-157,193,-52,-119,193,-58,-113,215,-28,-136,195,-6,-117,163,-14,-84,180,-6,-97,192,28,-110,156,34,-76,143,27,-57,167,49,-80,159,79,-83,122,74,-47,115,63,-25,142,80,7,128,65,-4,143,31,1,177,45,39,172,43,36,181,6,18,214,13,40,231,40,38,264,19,0,265,18,-25,280,42,-44,249,48,-72,265,68,-107,258,58,-117,278,27,-83,292,20,-78,306,-15,-48,284,-20,-68,252,-14,-98,264,-35,-74,273,-62,-56,240,-61,-90,221,-60,-100,238,-93,-67,228,-109,-71,192,-98,-107,191,-110,-98,206,-144,-71,180,-149,-97,153,-141,-121,169,-165,-94,168,-192,-88,131,-185,-126,122,-187,-126,141,-221,-97,120,-233,-103,88,-215,-91,68,-245,-58,87,-246,-50,96,-210,-12,91,-213,-10,118,-240,-35,140,-224,-18,142,-189,18,141,-202,26,175,-188,12,166,-154,30,133,-152,63,150,-160,56,176,-132,48,150,-106,77,127,-116,104,154,-119,95,182,-96,68,175,-70,78,138,-65,49,128,-43,52,93,-31,27,71,-50,10,59,-19,-7,93,-16,-26,91,-49,-47,63,-33,-55,86,-4,-67,115,-26,-86,90,-48,-105,77,-17,-114,112,-7,-126,122,-41,-148,91,-42,-162,101,-8,-168,136,-20,-187,124,-51,-207,100,-30,-218,128,-7,-229,150,-36,-244,126,-61,-269,105,-41,-288,94,-73,-258,86,-96,-235,68,-72,-246,33,-78,-224,2,-72,-215,0,-108,-206,37,-110,-186,35,-78,-167,7,-93,-161,26,-125,-150,57,-108,-126,39,-85,-111,22,-115,-109,55,-133,-91,72,-104,-67,43,-103,-58,48,-140,-53,85,-136,-30,77,-106,-11,52,-127,-5,76,-155,6,104,-131,31,80,-115,43,66,-149,75,85,-153,87,84,-117,116,59,-125" },
      { id: "B", z: 1, n: 146,
        sq: "VHLTPEEKSAVTALWGKVNVDEVGGEALGRLLVVYPWTQRFFESFGDLSTPDAVMGNPKVKAHGKKVLGAFSDGLAHLDNLKGTFATLSELHCDKLHVDPENFRLLGNVLVCVLAHHFGKEFTPPVQAAYQKVVAGVANALAHKYH",
        ss: "---HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH--------HHHHHHHHHHHHHHHHHHHHHHHHHHH--------HHHHHHHHH-----HHHHHHHHHHHHHHHHHHH-----HHHHHHHHHHHHHHHHHHHHH---",
        ca: "-79,38,197,-77,74,206,-106,96,198,-112,130,213,-146,132,231,-158,154,203,-148,127,178,-164,99,198,-197,119,201,-197,126,164,-193,88,156,-220,78,181,-244,105,169,-244,95,132,-244,58,140,-277,63,159,-292,71,125,-279,40,108,-301,10,97,-275,-16,105,-291,-43,83,-294,-21,53,-260,-5,55,-245,-39,62,-260,-54,29,-249,-23,10,-213,-22,22,-207,-60,17,-222,-60,-17,-203,-29,-29,-172,-46,-15,-178,-75,-37,-187,-53,-67,-159,-27,-66,-132,-53,-55,-143,-85,-72,-115,-106,-59,-131,-104,-24,-157,-128,-40,-132,-156,-33,-147,-164,2,-183,-164,-10,-189,-189,-38,-213,-209,-15,-235,-178,-19,-248,-184,-55,-251,-158,-82,-225,-131,-80,-221,-125,-117,-234,-90,-120,-238,-59,-98,-275,-64,-96,-271,-101,-87,-247,-93,-59,-267,-64,-45,-298,-85,-45,-284,-118,-32,-299,-126,2,-268,-145,14,-247,-114,8,-273,-93,27,-273,-117,56,-235,-118,58,-235,-80,57,-258,-78,85,-238,-101,106,-205,-83,99,-220,-48,106,-238,-59,138,-204,-70,151,-190,-37,140,-218,-18,157,-212,-37,190,-175,-27,187,-185,10,186,-194,6,222,-158,-5,231,-138,20,212,-114,21,243,-105,-16,237,-112,-29,202,-83,-53,204,-98,-71,233,-133,-69,218,-122,-84,185,-95,-109,197,-115,-141,192,-129,-129,159,-93,-121,148,-82,-157,156,-111,-171,138,-106,-151,107,-69,-161,106,-69,-198,116,-102,-210,102,-115,-185,76,-81,-175,60,-92,-140,53,-62,-117,42,-66,-87,66,-63,-63,36,-100,-72,31,-108,-55,64,-92,-22,51,-111,-24,18,-143,-29,37,-137,0,59,-131,23,29,-163,11,12,-182,16,45,-170,52,46,-182,57,10,-215,42,20,-220,65,49,-211,94,27,-237,84,2,-263,78,29,-257,110,49,-247,134,21,-237,167,36,-240,156,72,-210,134,65,-186,163,69,-148,162,66,-143,161,104,-169,133,108,-152,114,79,-119,118,97,-133,103,129,-148,74,111,-115,68,93,-98,64,126,-125,39,137,-124,19,106,-86,17,107,-88,7,144,-113,-21,137,-91,-34,109,-61,-33,131,-79,-51,159,-91,-78,136,-56,-83,122,-39,-84,156,-39,-121,163,-28,-131,127,4,-154,127" },
      { id: "C", z: 1, n: 141,
        sq: "VLSPADKTNVKAAWGKVGAHAGEYGAEALERMFLSFPTTKTYFPHFDLSHGSAQVKGHGKKVADALTNAVAHVDDMPNALSALSDLHAHKLRVDPVNFKLLSHCLLVTLAAHLPAEFTPAVHASLDKFLASVSTVLTSKYR",
        ss: "--HHHHHHHHHHHHHHHH-HHHHHHHHHHHHHHHHHHHHHHH---------HHHHHHHHHHHHHHHHHHHH--------HHHHHHHHH-----HHHHHHHHHHHHHHHHHHH-----HHHHHHHHHHHHHHHHHHHHH---",
        ca: "87,12,-183,118,-7,-188,146,11,-205,170,-9,-227,195,-6,-199,169,-20,-175,164,-50,-199,200,-56,-202,203,-55,-163,175,-79,-159,188,-104,-185,222,-103,-170,211,-108,-134,185,-135,-142,211,-151,-165,235,-156,-135,205,-171,-117,203,-197,-143,197,-231,-130,192,-221,-93,160,-202,-103,138,-228,-86,158,-229,-54,157,-191,-52,119,-191,-58,113,-214,-29,136,-193,-6,117,-161,-16,84,-178,-6,98,-190,27,111,-155,33,76,-141,25,57,-165,48,80,-157,78,83,-120,73,46,-113,62,25,-140,78,-7,-125,63,4,-141,30,0,-176,44,-38,-171,43,-36,-180,5,-19,-214,12,-41,-231,39,-37,-264,19,1,-264,20,27,-276,45,47,-244,50,73,-259,72,110,-254,64,120,-277,35,84,-285,24,83,-301,-11,51,-282,-17,68,-249,-13,98,-260,-33,75,-271,-61,56,-239,-61,89,-219,-60,99,-237,-92,67,-227,-109,71,-190,-98,106,-190,-110,99,-205,-143,71,-180,-150,97,-151,-142,122,-169,-166,95,-168,-192,88,-131,-184,125,-122,-189,126,-141,-223,96,-121,-234,102,-89,-217,90,-68,-248,57,-87,-248,50,-97,-212,11,-92,-213,7,-120,-238,34,-143,-223,17,-141,-189,-19,-140,-201,-30,-173,-187,-14,-165,-153,-31,-131,-152,-64,-150,-159,-56,-174,-132,-48,-150,-105,-77,-126,-114,-105,-152,-117,-95,-181,-96,-68,-175,-70,-79,-138,-64,-48,-128,-44,-51,-93,-31,-28,-70,-52,-9,-58,-20,7,-92,-17,26,-89,-50,47,-62,-35,56,-84,-6,68,-114,-27,87,-89,-50,106,-76,-20,114,-112,-9,126,-121,-43,149,-90,-43,162,-101,-8,169,-136,-21,188,-123,-52,208,-99,-29,217,-128,-7,230,-149,-36,244,-125,-60,269,-105,-39,286,-92,-71,258,-87,-96,234,-69,-72,247,-34,-79,226,-3,-71,217,0,-107,208,-36,-111,187,-34,-79,167,-5,-94,161,-24,-127,151,-56,-109,126,-37,-87,111,-21,-118,109,-54,-135,91,-71,-106,67,-42,-105,59,-46,-142,54,-83,-137,31,-75,-108,11,-50,-129,6,-76,-157,-5,-103,-132,-31,-80,-117,-43,-64,-150,-75,-84,-153,-87,-82,-117,-115,-58,-125" },
      { id: "D", z: 1, n: 146,
        sq: "VHLTPEEKSAVTALWGKVNVDEVGGEALGRLLVVYPWTQRFFESFGDLSTPDAVMGNPKVKAHGKKVLGAFSDGLAHLDNLKGTFATLSELHCDKLHVDPENFRLLGNVLVCVLAHHFGKEFTPPVQAAYQKVVAGVANALAHKYH",
        ss: "---HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH--------HHHHHHHHHHHHHHHHHHHHHHHHHHH--------HHHHHHHHH-----HHHHHHHHHHHHHHHHHHH-----HHHHHHHHHHHHHHHHHHHHH---",
        ca: "79,-40,195,76,-76,205,104,-100,196,108,-135,208,141,-139,226,154,-158,196,145,-130,173,161,-105,197,192,-124,198,192,-128,160,189,-90,156,216,-82,182,242,-106,169,241,-95,133,241,-59,143,274,-63,162,291,-71,128,276,-40,110,299,-12,101,273,15,106,290,41,85,294,18,55,259,2,57,243,36,64,259,52,32,249,22,12,213,21,24,207,58,19,224,57,-15,203,28,-27,171,45,-15,179,75,-36,188,53,-66,160,28,-66,132,53,-55,145,86,-70,115,107,-59,131,105,-24,158,128,-38,132,155,-31,147,160,3,183,163,-6,188,189,-33,214,207,-12,235,175,-15,252,178,-48,251,156,-78,225,128,-76,220,123,-113,236,88,-118,239,58,-96,277,63,-94,273,99,-84,248,91,-57,269,62,-42,301,82,-42,285,115,-29,301,123,4,270,142,18,249,110,11,276,89,30,276,114,59,239,115,63,236,78,58,258,74,88,238,99,109,206,81,102,218,45,109,236,58,140,202,69,154,187,37,141,214,19,161,206,37,192,169,24,189,181,-12,188,191,-6,223,155,4,233,135,-21,213,109,-21,241,101,15,237,107,27,202,80,54,205,96,71,235,132,68,220,122,84,187,95,110,198,119,140,194,131,130,159,94,121,150,84,156,157,114,170,138,108,150,107,71,162,107,73,199,118,107,209,104,116,185,77,81,177,62,91,141,53,63,118,43,66,88,67,61,65,37,99,72,32,107,55,65,91,22,51,111,24,19,144,29,38,135,-1,61,131,-23,31,162,-11,14,182,-16,46,170,-53,46,182,-56,10,216,-42,20,219,-65,50,211,-95,27,236,-83,1,263,-78,27,258,-109,48,247,-134,22,235,-168,34,239,-157,70,208,-135,66,184,-164,68,147,-162,64,142,-161,102,167,-133,106,150,-114,79,117,-119,96,131,-104,128,146,-74,110,113,-68,92,96,-65,125,122,-40,137,123,-17,107,84,-16,107,87,-8,144,112,20,138,91,34,109,61,34,131,79,50,159,91,78,137,56,85,123,39,85,157,41,123,162,28,134,129,-2,157,128" },
    ],
    het: [
      { ch: "A", el: "CCCCCCCCCCCCOOCCCCCCCCCCCCCCCCCCCCCCOONNNNF",
        xyz: "1,203,-83,-32,174,-104,-25,141,-68,5,172,-45,-8,198,-92,-14,205,-104,-23,197,-109,-24,185,-101,-33,201,-121,-11,219,-108,1,220,-117,3,234,-124,3,244,-117,6,234,-136,-33,162,-96,-42,151,-99,-40,142,-89,-30,147,-80,-51,150,-111,-45,128,-89,-58,124,-89,-16,147,-59,-13,141,-46,-5,150,-40,-3,161,-49,-17,127,-41,1,149,-26,-6,144,-15,7,183,-54,15,195,-51,14,203,-61,5,197,-71,24,197,-39,19,217,-62,9,228,-57,15,242,-57,7,251,-58,28,244,-55,-14,186,-91,-26,160,-84,-9,159,-61,2,184,-67,-9,171,-78" },
      { ch: "B", el: "CCCCCCCCCCCCOOCCCCCCCCCCCCCCCCCCCCCCOONNNNF",
        xyz: "-177,-146,96,-172,-102,116,-149,-86,77,-153,-130,56,-178,-135,105,-186,-135,117,-185,-123,122,-176,-115,114,-192,-118,135,-193,-147,123,-184,-155,132,-190,-168,137,-194,-176,129,-189,-170,149,-165,-94,107,-162,-80,110,-155,-76,99,-155,-87,90,-166,-73,123,-152,-61,95,-159,-50,100,-149,-97,68,-144,-95,54,-146,-107,48,-151,-116,59,-140,-82,48,-141,-112,35,-143,-104,23,-160,-138,66,-163,-152,63,-170,-157,74,-171,-146,83,-162,-159,49,-177,-170,74,-192,-168,72,-200,-182,74,-212,-181,71,-194,-192,77,-171,-123,103,-160,-98,95,-153,-110,70,-164,-134,78,-159,-117,88" },
      { ch: "C", el: "CCCCCCCCCCCCOOCCCCCCCCCCCCCCCCCCCCCCOONNNNF",
        xyz: "-1,-203,-84,32,-174,-105,25,-141,-70,-5,-171,-47,9,-198,-93,14,-205,-104,23,-197,-110,23,-185,-102,31,-200,-122,10,-219,-108,-1,-219,-119,-5,-233,-122,-9,-241,-114,-5,-235,-134,33,-162,-98,42,-151,-100,40,-142,-90,29,-148,-82,51,-150,-112,46,-129,-89,59,-127,-92,16,-147,-60,14,-141,-47,5,-149,-41,2,-160,-50,19,-128,-43,1,-149,-26,7,-142,-16,-7,-183,-55,-14,-194,-51,-14,-203,-62,-5,-197,-72,-23,-195,-39,-19,-217,-61,-9,-227,-55,-14,-242,-56,-7,-251,-60,-26,-244,-52,15,-185,-92,25,-159,-87,8,-159,-62,-2,-184,-68,9,-170,-78" },
      { ch: "D", el: "CCCCCCCCCCCCOOCCCCCCCCCCCCCCCCCCCCCCOONNNNF",
        xyz: "179,144,95,173,102,117,150,85,79,152,128,57,180,134,105,188,135,116,187,123,123,178,115,115,195,117,134,196,147,121,187,158,128,193,170,135,204,174,131,188,176,145,166,93,109,161,80,112,155,75,101,155,86,91,167,72,124,149,61,99,156,51,98,149,95,69,143,93,56,144,105,50,150,114,59,139,80,49,139,110,36,142,102,25,160,136,65,165,150,62,172,154,73,172,144,83,160,157,50,179,168,74,193,167,69,199,182,67,200,186,56,200,189,77,174,122,104,161,97,96,153,107,71,165,133,78,160,116,89" },
    ],
    ssb: [],
    cys: {},
  },
  inzulin: {
    pdb: "4INS",
    verige: [
      { id: "A", z: 1, n: 21,
        sq: "GIVEQCCTSICSLYQLENYCN",
        ss: "HHHHHHHHHH-HHHHHH----",
        ca: "56,57,63,38,30,42,46,44,8,83,46,15,85,14,34,68,-7,7,93,7,-19,125,9,2,119,-23,21,90,-47,18,53,-46,31,25,-70,35,-11,-68,24,-21,-68,60,-2,-35,65,-19,-20,35,-53,-27,50,-45,0,75,-50,25,47,-85,15,37,-114,37,47" },
      { id: "B", z: 1, n: 30,
        sq: "FVNQHLCGSHLVEALYLVCGERGFFYTPKA",
        ss: "--------HHHHHHHHHHHH---EEE----",
        ca: "-2,-138,12,35,-129,5,55,-98,13,57,-74,-16,81,-47,-29,59,-19,-43,70,13,-58,52,42,-76,19,34,-92,23,-3,-83,15,6,-47,-16,23,-57,-27,-7,-76,-22,-29,-45,-42,-5,-24,-70,-6,-49,-71,-44,-48,-69,-45,-10,-94,-18,-2,-117,-20,-32,-150,-1,-25,-140,9,10,-117,33,-8,-83,44,6,-59,73,13,-26,74,-4,-3,95,18,33,97,8,60,116,27,66,152,15" },
    ],
    het: [
    ],
    ssb: [["A", 6, "A", 11], ["A", 7, "B", 7], ["A", 20, "B", 19]],
    cys: {"A6": "54,-5,0,41,-9,12", "A7": "92,21,-25,101,23,-40", "A11": "47,-32,29,41,-29,12", "A20": "-91,1,37,-81,-11,28", "B7": "84,13,-63,97,8,-51", "B19": "-89,-4,0,-75,-3,11"},
  },
  gfp: {
    pdb: "1EMA",
    // SEQRES ima 236 ostankov, ker so Thr65–Tyr66–Gly67 združeni v kromofor CRO; beljakovina ima 238 aminokislin.
    // Vidni so ostanki 2–229 (65–67: atomi CA1, CA2, CA3 kromoforja).
    verige: [
      { id: "A", z: 2, n: 238,
        sq: "SKGEELFTGVVPILVELDGDVNGHKFSVSGEGEGDATYGKLTLKFICTTGKLPVPWPTLVTTFTYGVQCFSRYPDHMKRHDFFKSAMPEGYVQERTIFFKDDGNYKTRAEVKFEGDTLVNRIELKGIDFKEDGNILGHKLEYNYNSHNVYIMADKQKNGIKVNFKIRHNIEDGSVQLADHYQQNTPIGDGPVLLPDNHYLSTQSALSKDPNEKRDHMVLLEFVTAAGI",
        ss: "--HHHHH---EEEEEEEEEEE--EEEEEEEEEEEE----EEEEEEEE--------HHHH--------HHH-----------HHHH-----EEEEEEEEE----EEEEEEEEEEE--EEEEEEEEEEE-------------------EEEEE-------EEEEEEEEEEE-----EEEEEEEEEEEE-----------EEEEEEEEE------------EEEEEEEE--",
        ca: "-228,20,11,-212,43,36,-179,54,22,-189,54,-15,-200,90,-13,-167,100,3,-147,91,-27,-167,109,-53,-140,135,-59,-103,142,-53,-94,134,-16,-62,147,0,-40,119,15,-16,120,44,9,91,50,29,87,82,53,58,87,75,48,117,99,20,110,127,-1,123,146,-25,101,173,-46,118,178,-18,144,179,10,117,151,34,127,134,58,104,104,79,97,86,88,65,60,114,56,39,115,25,12,138,10,-8,138,-22,-42,130,-35,-63,102,-48,-93,100,-72,-111,68,-70,-131,77,-101,-100,69,-121,-84,46,-95,-56,72,-95,-31,81,-67,-4,108,-68,20,110,-38,54,123,-27,72,107,2,101,122,22,124,105,46,122,128,76,149,111,97,174,115,68,185,86,45,161,58,40,179,26,52,160,3,27,152,8,-8,121,30,-17,105,3,-38,103,-20,-9,78,4,9,53,10,-20,28,-15,-9,29,-3,26,24,33,18,-3,26,-8,-9,-10,-15,-17,11,13,-48,30,6,-69,5,-13,-101,25,-9,-88,45,-39,-92,16,-63,-116,20,-91,-145,-4,-87,-166,-8,-118,-203,-2,-115,-211,-37,-116,-187,-46,-89,-196,-18,-63,-211,-44,-40,-176,-59,-35,-158,-28,-24,-150,-35,13,-125,-7,14,-149,22,9,-176,5,29,-155,7,60,-153,45,58,-152,70,74,-144,50,106,-117,31,86,-99,-1,89,-69,-19,102,-46,-33,77,-20,-58,88,7,-76,69,36,-98,68,59,-95,39,84,-122,32,114,-113,11,126,-144,-6,159,-156,8,160,-125,30,142,-108,60,105,-100,65,84,-69,72,56,-68,97,32,-39,94,2,-25,111,-17,5,100,-49,24,105,-66,40,75,-93,63,80,-105,99,77,-94,128,99,-117,155,88,-116,155,51,-81,140,47,-76,103,43,-49,91,67,-27,61,65,-7,56,98,18,27,98,42,10,121,67,-11,104,91,-37,119,118,-55,97,138,-84,109,163,-110,98,176,-90,69,210,-99,55,234,-71,58,246,-80,23,213,-90,7,193,-72,-19,175,-50,6,202,-37,30,227,-39,2,205,-15,-19,206,-37,-51,169,-30,-63,163,-9,-93,142,22,-90,111,11,-107,80,-9,-102,60,-37,-120,22,-45,-124,6,-70,-102,-26,-87,-94,-39,-86,-58,-62,-113,-47,-90,-106,-24,-113,-128,-4,-138,-125,23,-132,-134,59,-166,-140,75,-151,-148,109,-133,-115,114,-158,-95,93,-129,-86,71,-110,-97,41,-79,-116,35,-55,-106,7,-26,-123,-9,-1,-115,-37,35,-114,-47,56,-85,-57,84,-87,-81,113,-63,-76,138,-60,-103,175,-63,-92,202,-42,-109,218,-74,-123,187,-83,-143,174,-107,-117,143,-106,-95,135,-102,-58,103,-118,-47,81,-104,-19,53,-125,-7,25,-105,9,0,-118,34,-26,-94,45,-57,-89,68,-81,-60,70,-107,-55,96,-131,-27,102,-126,-2,130,-162,8,134,-191,-16,144,-212,-5,114,-219,-27,84,-193,-35,57,-194,-51,24,-179,-86,23,-168,-94,-13,-167,-124,-35,-133,-134,-47,-119,-109,-70,-87,-90,-77,-71,-57,-82,-48,-49,-111,-21,-24,-103,4,-3,-121,29,22,-107,55,47,-119,84,60,-97,100,93,-102,122,119,-85,117,157,-78,148,173,-94,146,202,-70,143,181,-39,174,175,-18,159,153,8,157,115,3,123,110,-13,101,92,-39,75,105,-62,47,80,-70,19,77,-96,-3,47,-95,-35,33,-110,-56,6,-96,-88,-11,-109,-108,-40,-97,-117,-69,-119,-124,-106,-121,-162,-104,-119" },
    ],
    het: [
      { ch: "A", el: "NCCCOCNNCOCCCOCCCCCCCO",
        xyz: "10,26,0,-3,26,-8,-1,32,-22,3,47,-21,9,25,-29,-7,11,-9,-4,2,-20,-14,5,0,-15,-9,-2,-22,-17,3,-9,-10,-15,-17,11,13,-30,17,15,-35,16,26,-9,-21,-23,-2,-24,-36,4,-14,-43,-3,-37,-41,10,-16,-56,3,-40,-54,10,-30,-61,16,-33,-74" },
    ],
    ssb: [],
    cys: {},
  },
};

const BELJAKOVINE = {
  hemoglobin: {
    ime: "Hemoglobin", vir: "PDB 2HHB, človeški hemoglobin brez kisika",
    naloga: "V rdečih krvničkah prenaša kisik iz pljuč do tkiv.",
    verige: { A: "α1", B: "β1", C: "α2", D: "β2" },
    barve: { A: "#ef7a86", B: "#6e9bff", C: "#f3a65e", D: "#55c8b4" },
    opisVerige: (v, n) => `Ena od štirih polipeptidnih verig hemoglobina (${n} aminokislin); vsaka veriga ${v.startsWith("α") ? "α" : "β"} v žepu drži svojo skupino hem.`,
  },
  inzulin: {
    ime: "Inzulin", vir: "PDB 4INS, prašičji inzulin (od človeškega se razlikuje v eni aminokislini)",
    naloga: "Hormon trebušne slinavke: celicam sporoči, naj iz krvi sprejmejo glukozo.",
    verige: { A: "A", B: "B" },
    barve: { A: "#f3a65e", B: "#6e9bff" },
    opisVerige: (v, n) => v === "A"
      ? `Krajša veriga inzulina (${n} aminokislin); z verigo B jo povezujeta dva disulfidna mostova.`
      : `Daljša veriga inzulina (${n} aminokislin); njen konec se pri shranjevanju poveže s sosednjimi molekulami.`,
  },
  gfp: {
    ime: "Zeleni fluorescentni protein (GFP)", vir: "PDB 1EMA, GFP meduze Aequorea victoria (različica S65T)",
    naloga: "Pod modro svetlobo sveti zeleno; biologi ga uporabljajo za označevanje celic in beljakovin.",
    verige: { A: "A" },
    barve: { A: "#5fcf86" },
    opisVerige: (v, n) => `Ena veriga z ${n} aminokislinami, zvita v sod iz enajstih β-trakov, ki obdaja kromofor.`,
  },
};

const SS_BARVE = { H: "#e8628c", E: "#f2c14e", L: "#a9b4c6" };
const BELA = { r: 1, g: 1, b: 1 };
const SS_IME = { H: "α-vijačnica", E: "β-ploskev", L: "Zanka" };
// Vezi hema po vrstnem redu atomov v zapisu PDB (CHA CHB CHC CHD C1A … O2D NA NB NC ND FE); stare koordinate
// propionatov so ponekod popačene, zato vezi ne iščemo le po razdalji.
const HEM_ATOMI = "CCCCCCCCCCCCOOCCCCCCCCCCCCCCCCCCCCCCOONNNNF";
const HEM_VEZI = [
  [38, 4], [4, 5], [5, 6], [6, 7], [7, 38], [6, 8], [5, 9], [9, 10], [10, 11], [11, 12], [11, 13],
  [39, 14], [14, 15], [15, 16], [16, 17], [17, 39], [15, 18], [16, 19], [19, 20],
  [40, 21], [21, 22], [22, 23], [23, 24], [24, 40], [22, 25], [23, 26], [26, 27],
  [41, 28], [28, 29], [29, 30], [30, 31], [31, 41], [29, 32], [30, 33], [33, 34], [34, 35], [35, 36], [35, 37],
  [31, 0], [0, 4], [7, 1], [1, 14], [17, 2], [2, 21], [24, 3], [3, 28], [42, 38], [42, 39], [42, 40], [42, 41],
];
const ELEMENTI = { C: ["#a0a7b4", 0.42], N: ["#3050f8", 0.4], O: ["#e8453c", 0.4], S: ["#e8d24a", 0.6], F: ["#e06633", 0.62] };
// Prerez traku (Å): polširina in poldebelina.
const PREREZ = { H: [1.2, 0.28], E: [1.05, 0.32], L: [0.42, 0.42], glava: [1.75, 0.32] };

const dekodiraj = (s) => s.split(",").map((x) => Number(x) / 10);
const nm = (x) => String(x).replace(".", ",");
function sklon(n, ed, dv, mn3, mn) {
  const r = n % 100;
  return r === 1 ? ed : r === 2 ? dv : r === 3 || r === 4 ? mn3 : mn;
}

/** Podatki ene beljakovine: verige z atomi Cα (Å), sekundarna struktura in hetero atomi. */
export function beljakovina(kljuc) {
  const p = PDB[kljuc], b = BELJAKOVINE[kljuc];
  const verige = p.verige.map((v) => {
    const c = dekodiraj(v.ca), ca = [];
    for (let i = 0; i < c.length; i += 3) ca.push([c[i], c[i + 1], c[i + 2]]);
    // počisti sekundarno strukturo: prekratke vijačnice ali ploskve štej kot zanko
    const ss = [...v.ss].map((x) => (x === "H" ? "H" : x === "E" ? "E" : "L"));
    for (let i = 0; i < ss.length;) {
      let j = i;
      while (j < ss.length && ss[j] === ss[i]) j++;
      if ((ss[i] === "H" && j - i < 4) || (ss[i] === "E" && j - i < 2)) for (let k = i; k < j; k++) ss[k] = "L";
      i = j;
    }
    return { id: v.id, ime: b.verige[v.id], z: v.z, n: v.n, sq: v.sq, ss, ca };
  });
  const het = p.het.map((h) => {
    const c = dekodiraj(h.xyz), at = [];
    for (let i = 0; i < c.length; i += 3) at.push({ el: h.el[i / 3], p: [c[i], c[i + 1], c[i + 2]] });
    return { veriga: h.ch, at };
  });
  const cys = {};
  for (const [k, v] of Object.entries(p.cys || {})) { const c = dekodiraj(v); cys[k] = [c.slice(0, 3), c.slice(3, 6)]; }
  const steviloAK = verige.reduce((t, v) => t + v.n, 0);
  return { kljuc, pdb: p.pdb, ...b, verige, het, ssb: p.ssb, cys, steviloAK };
}

// ---------------------------------------------------------------- geometrija traku
function catmull(P, t) {
  // centripetalni Catmull-Rom skozi točke P pri parametru t (indeks ostanka, 0 … n−1)
  const n = P.length, i = Math.min(n - 2, Math.max(0, Math.floor(t))), u = t - i;
  const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(n - 1, i + 2)];
  const d = (a, b) => Math.max(1e-4, Math.sqrt(Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2])));
  let dt0 = d(p0, p1), dt1 = d(p1, p2), dt2 = d(p2, p3);
  if (p0 === p1) dt0 = dt1;
  if (p2 === p3) dt2 = dt1;
  const out = [0, 0, 0];
  for (let k = 0; k < 3; k++) {
    let t1 = (p1[k] - p0[k]) / dt0 - (p2[k] - p0[k]) / (dt0 + dt1) + (p2[k] - p1[k]) / dt1;
    let t2 = (p2[k] - p1[k]) / dt1 - (p3[k] - p1[k]) / (dt1 + dt2) + (p3[k] - p2[k]) / dt2;
    t1 *= dt1; t2 *= dt1;
    const c0 = p1[k], c1 = t1, c2 = -3 * p1[k] + 3 * p2[k] - 2 * t1 - t2, c3 = 2 * p1[k] - 2 * p2[k] + t1 + t2;
    out[k] = c0 + c1 * u + c2 * u * u + c3 * u * u * u;
  }
  return out;
}

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

/** Kontrolne točke in vodilne normale traku za eno verigo. */
function vodila(v) {
  const n = v.ca.length, P = v.ca, ss = v.ss;
  const Q = P.map((p, i) => {
    if (ss[i] !== "E" || i === 0 || i === n - 1) return p;
    return mul(add(add(P[i - 1], P[i + 1]), mul(p, 2)), 0.25);
  });
  // drugo glajenje ploskev, da so puščice ravne
  const Q2 = Q.map((p, i) => (ss[i] === "E" && i > 0 && i < n - 1 && ss[i - 1] === "E" && ss[i + 1] === "E" ? mul(add(add(Q[i - 1], Q[i + 1]), mul(p, 2)), 0.25) : p));
  const D = P.map((p, i) => (i === 0 || i === n - 1 ? null : norm(sub(p, mul(add(P[i - 1], P[i + 1]), 0.5)))));
  D[0] = D[1]; D[n - 1] = D[n - 2];
  for (let i = 1; i < n; i++) if (ss[i] !== "H" && dot(D[i], D[i - 1]) < 0) D[i] = mul(D[i], -1);
  const Ds = D.map((d, i) => (ss[i] === "E" && i > 0 && i < n - 1 ? norm(add(add(D[i - 1], D[i + 1]), mul(d, 2))) : d));
  return { Q: Q2, D: Ds };
}

/** Prerez pri parametru t (indeks ostanka): [polširina, poldebelina]. */
function prerez(ss, t, glavaZacetek) {
  const n = ss.length, i = Math.round(t);
  // glava puščice: zadnji ostanek ploskve
  if (ss[i] === "E" && (i === n - 1 || ss[i + 1] !== "E") && t >= i - 0.5) {
    if (glavaZacetek) return PREREZ.E;
    const u = Math.min(1, Math.max(0, t - (i - 0.5)));
    return [PREREZ.glava[0] + (PREREZ.L[0] * 0.8 - PREREZ.glava[0]) * u, PREREZ.glava[1] + (PREREZ.L[1] - PREREZ.glava[1]) * u];
  }
  const a = Math.min(n - 1, Math.max(0, Math.floor(t))), b = Math.min(n - 1, a + 1), u = t - a;
  const pa = PREREZ[ss[a]], pb = PREREZ[ss[b]];
  // po glavi puščice naprej že zanka
  const pa2 = ss[a] === "E" && ss[b] !== "E" ? [PREREZ.L[0] * 0.8, PREREZ.L[1]] : pa;
  const s = u * u * (3 - 2 * u);
  return [pa2[0] + (pb[0] - pa2[0]) * s, pa2[1] + (pb[1] - pa2[1]) * s];
}

/** Trak ene verige, razdeljen po vrsti sekundarne strukture: { H: {P,N,I}, E: …, L: … }. */
function trakVerige(v, vz, obr) {
  const n = v.ca.length, ss = v.ss, { Q, D } = vodila(v);
  const out = { H: { P: [], N: [], I: [] }, E: { P: [], N: [], I: [] }, L: { P: [], N: [], I: [] } };
  // zaporedni odseki iste vrste
  const odseki = [];
  for (let i = 0; i < n;) { let j = i; while (j + 1 < n && ss[j + 1] === ss[i]) j++; odseki.push([i, j]); i = j + 1; }
  let prejN = null;
  for (const [a, b] of odseki) {
    const tip = ss[a], g = out[tip];
    const t0 = Math.max(0, a - 0.5), t1 = Math.min(n - 1, b + 0.5);
    const korakov = Math.max(1, Math.round((t1 - t0) * vz));
    const tocke = [];
    for (let k = 0; k <= korakov; k++) tocke.push(t0 + (t1 - t0) * k / korakov);
    // glava puščice: podvojen obroč na začetku glave
    const obroci = [];
    for (const t of tocke) {
      const i = Math.round(t);
      const glava = tip === "E" && (i === n - 1 || ss[i + 1] !== "E") && Math.abs(t - (i - 0.5)) < 1e-6;
      if (glava) obroci.push([t, true]);
      obroci.push([t, false]);
    }
    const zacetek = g.P.length / 3;
    for (const [t, gz] of obroci) {
      const c = catmull(Q, t);
      const e = 0.02;
      const T = norm(sub(catmull(Q, Math.min(n - 1, t + e)), catmull(Q, Math.max(0, t - e))));
      const ia = Math.min(n - 1, Math.floor(t)), ib = Math.min(n - 1, ia + 1), u = t - ia;
      let N = add(mul(D[ia], 1 - u), mul(D[ib], u));
      N = sub(N, mul(T, dot(N, T)));
      if (Math.hypot(...N) < 1e-3) N = prejN || norm(cross(T, [0, 0, 1]));
      N = norm(N);
      if (prejN && dot(N, prejN) < 0 && tip !== "H") N = mul(N, -1);
      prejN = N;
      const W = norm(cross(T, N));
      const [pa, pb] = prerez(ss, t, gz);
      for (let k = 0; k < obr; k++) {
        const f = (k / obr) * Math.PI * 2, cs = Math.cos(f), sn = Math.sin(f);
        g.P.push(...add(c, add(mul(W, pa * cs), mul(N, pb * sn))));
        g.N.push(...norm(add(mul(W, pb * cs), mul(N, pa * sn))));
      }
    }
    const st = obroci.length;
    for (let r = 0; r < st - 1; r++) for (let k = 0; k < obr; k++) {
      const a0 = zacetek + r * obr + k, a1 = zacetek + r * obr + ((k + 1) % obr), b0 = a0 + obr, b1 = a1 + obr;
      g.I.push(a0, a1, b0, a1, b1, b0);
    }
    // pokrovčka na koncih verige
    for (const [kje, t] of [[0, t0], [st - 1, t1]]) {
      if (!((kje === 0 && a === 0) || (kje === st - 1 && b === n - 1))) continue;
      const c = catmull(Q, t), T = norm(sub(catmull(Q, Math.min(n - 1, t + 0.02)), catmull(Q, Math.max(0, t - 0.02))));
      const sm = kje === 0 ? mul(T, -1) : T, sred = g.P.length / 3;
      g.P.push(...c); g.N.push(...sm);
      const o = zacetek + kje * obr, rob = g.P.length / 3;
      for (let k = 0; k < obr; k++) { g.P.push(g.P[(o + k) * 3], g.P[(o + k) * 3 + 1], g.P[(o + k) * 3 + 2]); g.N.push(...sm); }
      for (let k = 0; k < obr; k++) {
        const x = rob + k, y = rob + ((k + 1) % obr);
        if (kje === 0) g.I.push(sred, y, x); else g.I.push(sred, x, y);
      }
    }
  }
  return out;
}

// ---------------------------------------------------------------- model
// Velikost točke (PointsMaterial, sizeAttenuation) je v enotah višine zaslona/razdalje; za premer w v sceni pri vidnem kotu ~40° je size ≈ w / tan(20°).
const TOCKA_V_SVET = 2.75;

export function zgradi(THREE, ctx = {}) {
  const visoka = ctx.kakovost !== "nizka";
  const zac = ctx.zacetek || {};
  const stanje = {
    beljakovina: BELJAKOVINE[zac.beljakovina] ? zac.beljakovina : "hemoglobin",
    prikaz: zac.prikaz === "veriga" ? "veriga" : "trak",
    barve: zac.barve === "struktura" ? "struktura" : "verige",
  };
  const group = new THREE.Group();
  group.name = "beljakovina";
  const drzalo = new THREE.Group();
  group.add(drzalo);
  const obj = { group, deli: [], nadzor: [], merilo: info.merilo, dispose };
  let model = null;

  const fiz = (barva, o = {}) => new THREE.MeshPhysicalMaterial({ color: barva, roughness: 0.36, metalness: 0, clearcoat: 0.45, clearcoatRoughness: 0.35, ...o });
  // trak: lakiran, z rahlim sheenom (mehak rob na zavojih vijačnic) in šibkim lastnim sijem v barvi verige
  const trakMat = (o = {}) => fiz("#ffffff", { roughness: 0.36, clearcoat: 0.55, clearcoatRoughness: 0.18, sheen: 0.5, sheenRoughness: 0.35, sheenColor: new THREE.Color("#ffffff"), emissiveIntensity: 0.14, ...o });
  /** Mehak sij (sprite s krožnim prelivom); brez platna (Node) vrne null. */
  function sijMat(barva, moc, velikost) {
    if (typeof document === "undefined") return null;
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const x = c.getContext && c.getContext("2d");
    if (!x) return null;
    const col = new THREE.Color(barva), rgb = [col.r, col.g, col.b].map((v) => Math.round(v * 255)).join(",");
    const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, `rgba(${rgb},${moc})`); g.addColorStop(0.4, `rgba(${rgb},${moc * 0.4})`); g.addColorStop(1, `rgba(${rgb},0)`);
    x.fillStyle = g; x.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    // točka (Points) namesto sprite: GTAO točk ne upošteva (sprite bi dal temen kvadrat); velikost (Å) se pretvori ob merilu
    const m = new THREE.PointsMaterial({ map: t, size: 1, sizeAttenuation: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    m.userData.velikostA = velikost;
    return m;
  }
  const tocka = (p) => new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(p, 3));

  function pocisti() {
    if (!model) return;
    drzalo.remove(model.koren);
    const g = new Set(), m = new Set();
    model.koren.traverse((o) => { if (o.geometry) g.add(o.geometry); if (o.material) m.add(o.material); });
    for (const x of g) x.dispose();
    for (const x of m) { if (x.map) x.map.dispose(); x.dispose(); }
    model = null;
  }

  function sestavi() {
    pocisti();
    const B = beljakovina(stanje.beljakovina);
    const koren = new THREE.Group();
    const M = { B, koren, trak: {}, veriga: {}, tipi: new Set(), siji: [] };

    // --- trak (risanka)
    const trakSk = new THREE.Group(); koren.add(trakSk);
    const majhna = B.verige.reduce((t, v) => t + v.ca.length, 0) < 300;
    const vz = visoka ? (majhna ? 12 : 8) : (majhna ? 6 : 4), obr = visoka ? (majhna ? 14 : 10) : (majhna ? 8 : 6);
    for (const v of B.verige) {
      const t = trakVerige(v, vz, obr);
      for (const tip of ["H", "E", "L"]) {
        if (!t[tip].I.length) continue;
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.Float32BufferAttribute(t[tip].P, 3));
        g.setAttribute("normal", new THREE.Float32BufferAttribute(t[tip].N, 3));
        g.setIndex(t[tip].I);
        const m = new THREE.Mesh(g, trakMat({ side: THREE.DoubleSide }));
        m.name = `trak-${v.id}-${tip}`;
        m.userData = { veriga: v.id, tip };
        trakSk.add(m);
        (M.trak[v.id] ||= {})[tip] = m;
        M.tipi.add(tip);
      }
    }

    // --- veriga Cα (kroglice in palčke)
    const verSk = new THREE.Group(); koren.add(verSk);
    const kroglaGeo = new THREE.SphereGeometry(0.85, visoka ? 10 : 7, visoka ? 8 : 5);
    const palcaGeo = new THREE.CylinderGeometry(0.32, 0.32, 1, visoka ? 8 : 6, 1, true);
    palcaGeo.translate(0, 0.5, 0);
    const mx = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), v3 = new THREE.Vector3(), yOs = new THREE.Vector3(0, 1, 0);
    const palcka = (a, b) => {
      const d = new THREE.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]), l = d.length();
      q.setFromUnitVectors(yOs, d.normalize());
      return mx.compose(v3.set(...a), q, sc.set(1, l, 1)).clone();
    };
    for (const v of B.verige) {
      for (const tip of ["H", "E", "L"]) {
        const idx = v.ss.map((s, i) => (s === tip ? i : -1)).filter((i) => i >= 0);
        if (!idx.length) continue;
        const mat = trakMat();
        const k = new THREE.InstancedMesh(kroglaGeo, mat, idx.length);
        idx.forEach((i, j) => k.setMatrixAt(j, mx.compose(v3.set(...v.ca[i]), q.identity(), sc.set(1, 1, 1))));
        const pal = idx.filter((i) => i + 1 < v.ca.length && Math.hypot(...sub(v.ca[i + 1], v.ca[i])) < 4.3);
        const p = new THREE.InstancedMesh(palcaGeo, mat, Math.max(1, pal.length));
        pal.forEach((i, j) => p.setMatrixAt(j, palcka(v.ca[i], v.ca[i + 1])));
        if (!pal.length) p.count = 0;
        k.name = `ca-${v.id}-${tip}`; p.name = `ca-palcke-${v.id}-${tip}`;
        k.userData = p.userData = { veriga: v.id, tip };
        verSk.add(k, p);
        (M.veriga[v.id] ||= {})[tip] = [k, p];
      }
    }

    // --- hetero skupine: hem, kromofor (kroglice in palčke)
    const atomGeo = new THREE.SphereGeometry(1, visoka ? 12 : 8, visoka ? 9 : 6);
    const vezGeo = new THREE.CylinderGeometry(0.17, 0.17, 1, visoka ? 7 : 5, 1, true);
    vezGeo.translate(0, 0.5, 0);
    function kroglicePalcke(atomi, ime, znaneVezi = null) {
      const sk = new THREE.Group(); sk.name = ime;
      const poEl = {};
      for (const a of atomi) (poEl[a.el] ||= []).push(a);
      const meshes = [];
      for (const [e, sez] of Object.entries(poEl)) {
        // hetero skupina je poudarjena: nekoliko večje, sijoče kroglice; železo rahlo žari
        const im = new THREE.InstancedMesh(atomGeo, fiz(ELEMENTI[e][0], { roughness: 0.25, clearcoat: 0.9, clearcoatRoughness: 0.1, emissive: ELEMENTI[e][0], emissiveIntensity: e === "F" ? 0.55 : 0.12, ...(e === "F" ? { metalness: 0.35 } : {}) }), sez.length);
        sez.forEach((a, i) => im.setMatrixAt(i, mx.compose(v3.set(...a.p), q.identity(), sc.setScalar(ELEMENTI[e][1] * (e === "F" ? 1.35 : 1.15)))));
        im.name = `${ime}-${e}`;
        sk.add(im); meshes.push(im);
      }
      const vezi = znaneVezi ? znaneVezi.map(([i, j]) => [atomi[i].p, atomi[j].p]) : [];
      if (!znaneVezi) for (let i = 0; i < atomi.length; i++) for (let j = i + 1; j < atomi.length; j++) {
        const a = atomi[i], b = atomi[j], d = Math.hypot(...sub(a.p, b.p));
        const meja = a.el === "F" || b.el === "F" ? 2.4 : a.el === "S" && b.el === "S" ? 2.3 : a.el === "S" || b.el === "S" ? 2.0 : 1.75;
        if (d < meja && d > 0.5) vezi.push([a.p, b.p]);
      }
      if (vezi.length) {
        const im = new THREE.InstancedMesh(vezGeo, fiz("#d3dae6", { roughness: 0.28, clearcoat: 0.7 }), vezi.length);
        vezi.forEach(([a, b], i) => im.setMatrixAt(i, palcka(a, b).multiply(new THREE.Matrix4().makeScale(1.25, 1, 1.25))));
        im.name = `${ime}-vezi`;
        sk.add(im); meshes.push(im);
      }
      koren.add(sk);
      return meshes;
    }
    const hem = B.het.filter((h) => h.at.length > 30);
    if (B.kljuc === "hemoglobin" && hem.length) {
      const vsi = hem.flatMap((h) => h.at);
      const znane = hem.every((h) => h.at.map((a) => a.el).join("") === HEM_ATOMI) ? hem.flatMap((h, k) => HEM_VEZI.map(([a, b]) => [a + 43 * k, b + 43 * k])) : null;
      M.hem = kroglicePalcke(vsi, "hem", znane);
      M.hemFe = hem.map((h) => h.at.find((a) => a.el === "F").p);
      // topel sij okoli vsakega hema (le v brskalniku), da se štirje hemi vidijo med trakovi
      const sm = sijMat("#ff8a45", 0.7, 13);
      if (sm) { const s = new THREE.Points(tocka(M.hemFe.flat()), sm); s.name = "hem-sij"; s.renderOrder = 2; s.raycast = () => {}; koren.add(s); M.siji.push(sm); }
    }
    if (B.kljuc === "gfp" && B.het.length) {
      const at = B.het[0].at;
      M.kromofor = kroglicePalcke(at, "kromofor");
      const c = at.reduce((s, a) => add(s, a.p), [0, 0, 0]).map((x) => x / at.length);
      // zelen sij: tri prosojne krogle drugo v drugi (mehak prehod)
      for (const [r, op] of [[3.2, 0.2], [4.6, 0.13], [6.2, 0.08]]) {
        const sij = new THREE.Mesh(new THREE.SphereGeometry(r, visoka ? 24 : 14, visoka ? 16 : 10),
          new THREE.MeshBasicMaterial({ color: "#58f08a", transparent: true, opacity: op, depthWrite: false, blending: THREE.AdditiveBlending }));
        sij.position.set(...c); sij.name = "kromofor-sij"; sij.renderOrder = 2;
        koren.add(sij);
        M.kromofor.push(sij);
      }
      M.kromoforSredina = c;
      const sm = sijMat("#62ff9a", 0.85, 16); // jedro sija (le v brskalniku)
      if (sm) { const sp = new THREE.Points(tocka(c), sm); sp.name = "kromofor-jedro"; sp.renderOrder = 3; sp.raycast = () => {}; koren.add(sp); M.siji.push(sm); }
    }
    // disulfidni mostovi: Cα–Cβ–Sγ–Sγ–Cβ–Cα
    if (B.ssb.length) {
      const atomi = [], vezi = [];
      const ca = (ch, r) => { const v = B.verige.find((x) => x.id === ch); return v.ca[r - v.z]; };
      for (const [c1, r1, c2, r2] of B.ssb) {
        const a = B.cys[c1 + r1], b = B.cys[c2 + r2];
        if (!a || !b) continue;
        atomi.push({ el: "S", p: a[1] }, { el: "S", p: b[1] }, { el: "C", p: a[0] }, { el: "C", p: b[0] });
        vezi.push([ca(c1, r1), a[0]], [a[0], a[1]], [a[1], b[1]], [b[1], b[0]], [b[0], ca(c2, r2)]);
      }
      const sk = new THREE.Group(); sk.name = "disulfid";
      const poEl = { S: atomi.filter((a) => a.el === "S"), C: atomi.filter((a) => a.el === "C") };
      M.disulfid = [];
      for (const [e, sez] of Object.entries(poEl)) {
        const im = new THREE.InstancedMesh(atomGeo, fiz(ELEMENTI[e][0], { roughness: 0.3, clearcoat: 0.55 }), sez.length);
        sez.forEach((a, i) => im.setMatrixAt(i, mx.compose(v3.set(...a.p), q.identity(), sc.setScalar(e === "S" ? 0.75 : 0.5))));
        im.name = "disulfid-" + e; sk.add(im); M.disulfid.push(im);
      }
      const im = new THREE.InstancedMesh(vezGeo, fiz(ELEMENTI.S[0], { roughness: 0.35 }), vezi.length);
      vezi.forEach(([a, b], i) => im.setMatrixAt(i, palcka(a, b).multiply(new THREE.Matrix4().makeScale(1.6, 1, 1.6))));
      im.name = "disulfid-vezi"; sk.add(im); M.disulfid.push(im);
      koren.add(sk);
      const [c1, r1, c2, r2] = B.ssb.find((s) => s[0] !== s[2]) || B.ssb[0];
      M.disulfidTocka = mul(add(B.cys[c1 + r1][1], B.cys[c2 + r2][1]), 0.5);
    }
    M.trakSk = trakSk; M.verSk = verSk;
    model = M;
    drzalo.add(koren);

    // merilo: premer enotske krogle (nm)
    let rmax = 0;
    for (const v of B.verige) for (const p of v.ca) rmax = Math.max(rmax, Math.hypot(...p));
    for (const h of B.het) for (const a of h.at) rmax = Math.max(rmax, Math.hypot(...a.p));
    rmax += 1.5;
    const D = [2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 9, 10].find((d) => d * 5 >= rmax) || 10;
    drzalo.scale.setScalar(1 / (D * 5));
    for (const m of M.siji) m.size = (m.userData.velikostA / (D * 5)) * TOCKA_V_SVET;
    obj.merilo = { m: D * 1e-9, oznaka: `${nm(D)} nm` };
    group.userData.beljakovina = { kljuc: B.kljuc, aNaEnoto: D * 5, podatki: B };
    posodobi();
  }

  function posodobi() {
    const M = model, B = M.B;
    M.trakSk.visible = stanje.prikaz === "trak";
    M.verSk.visible = stanje.prikaz === "veriga";
    for (const v of B.verige) for (const tip of ["H", "E", "L"]) {
      const barva = stanje.barve === "verige" ? B.barve[v.id] : SS_BARVE[tip];
      const t = M.trak[v.id]?.[tip];
      if (t) { t.material.color.set(barva); t.material.emissive.set(barva); t.material.sheenColor.set(barva).lerp(BELA, 0.35); }
      const c = M.veriga[v.id]?.[tip];
      if (c) c[0].material.color.set(barva);
    }
    obj.deli = deli();
  }

  function deli() {
    const M = model, B = M.B, trak = stanje.prikaz === "trak";
    const s = 1 / drzalo.scale.x;
    const t = (p) => p.map((x) => +(x / s).toFixed(3));
    const mesheVerige = (id) => (trak ? Object.values(M.trak[id] || {}) : Object.values(M.veriga[id] || {}).flat());
    const mesheTipa = (tip) => B.verige.flatMap((v) => (trak ? (M.trak[v.id]?.[tip] ? [M.trak[v.id][tip]] : []) : M.veriga[v.id]?.[tip] || []));
    const d = [];
    const pogled = norm([0.35, 0.55, 0.75]);
    for (const v of B.verige) {
      // točka: ostanek verige, ki je najbolj na zunanji strani (proti privzetemu pogledu in stran od središča)
      const c = v.ca.reduce((a, p) => add(a, p), [0, 0, 0]).map((x) => x / v.ca.length);
      const smer = B.verige.length > 1 ? norm(add(norm(c), mul(pogled, 0.6))) : pogled;
      let best = v.ca[0], bd = -1e9;
      for (const p of v.ca) { const x = dot(p, smer); if (x > bd) { bd = x; best = p; } }
      d.push({ id: "veriga-" + v.id, ime: B.verige.length > 1 ? `Veriga ${v.ime}` : "Veriga", barva: B.barve[v.id], opis: B.opisVerige(v.ime, v.n),
        meshes: mesheVerige(v.id), tocka: t(best) });
    }
    // najdaljši odsek dane vrste
    const najdaljsi = (tip) => {
      let best = null;
      for (const v of B.verige) for (let i = 0; i < v.ss.length;) {
        let j = i; while (j < v.ss.length && v.ss[j] === v.ss[i]) j++;
        if (v.ss[i] === tip && (!best || j - i > best[2] - best[1])) best = [v, i, j];
        i = j;
      }
      return best;
    };
    const nVerig = d.length; // pri barvah po zgradbi naj dotik traku najprej izbere vijačnico/ploskev/zanko (deli si delijo meshe)
    const opisSS = {
      H: "Del verige, zvit v desnosučno vijačnico, ki jo držijo vodikove vezi med aminokislinami.",
      E: "Raztegnjeni deli verige (β-traki) ležijo drug ob drugem in tvorijo nagubano ploskev; puščica kaže proti koncu verige.",
      L: "Del verige brez stalne oblike, ki povezuje vijačnice in ploskve.",
    };
    for (const tip of ["H", "E", "L"]) {
      const m = mesheTipa(tip);
      if (!m.length) continue;
      const nd = najdaljsi(tip);
      const p = nd ? nd[0].ca[Math.floor((nd[1] + nd[2] - 1) / 2)] : [0, 0, 0];
      d.push({ id: { H: "vijacnica", E: "ploskev", L: "zanka" }[tip], ime: SS_IME[tip], barva: SS_BARVE[tip],
        opis: opisSS[tip], meshes: m, tocka: t(p) });
    }
    if (stanje.barve === "struktura") d.push(...d.splice(0, nVerig));
    if (M.hem) d.push({ id: "hem", ime: "Hem", barva: ELEMENTI.F[0], opis: "Obroč z železovim ionom (oranžna kroglica), na katerega se veže molekula kisika; hemoglobin ima štiri heme.",
      meshes: M.hem, tocka: t(M.hemFe[0]) });
    if (M.disulfid) d.push({ id: "disulfidni-most", ime: "Disulfidni most", barva: ELEMENTI.S[0], opis: "Kovalentna vez med žveplovima atomoma dveh cisteinov (rumeno); trije taki mostovi držijo inzulin skupaj.",
      meshes: M.disulfid, tocka: t(M.disulfidTocka) });
    if (M.kromofor) d.push({ id: "kromofor", ime: "Kromofor", barva: "#58f08a", opis: "Aminokisline 65–67 se same sklenejo v obroč, ki ob modri svetlobi sveti zeleno; sod iz β-trakov ga varuje.",
      meshes: M.kromofor, tocka: t(M.kromoforSredina) });
    return d;
  }

  obj.nadzor = [
    { tip: "izbira", id: "beljakovina", oznaka: "Beljakovina", moznosti: [["hemoglobin", "Hemoglobin"], ["inzulin", "Inzulin"], ["gfp", "GFP"]], vrednost: stanje.beljakovina,
      ob: (v) => { stanje.beljakovina = BELJAKOVINE[v] ? v : "hemoglobin"; sestavi(); } },
    { tip: "izbira", id: "prikaz", oznaka: "Prikaz", moznosti: [["trak", "Trak"], ["veriga", "Veriga Cα"]], vrednost: stanje.prikaz,
      ob: (v) => { stanje.prikaz = v === "veriga" ? "veriga" : "trak"; posodobi(); } },
    { tip: "izbira", id: "barve", oznaka: "Barve", moznosti: [["verige", "Po verigah"], ["struktura", "Po zgradbi"]], vrednost: stanje.barve,
      ob: (v) => { stanje.barve = v === "struktura" ? "struktura" : "verige"; posodobi(); } },
    { tip: "izpis", id: "podatki", oznaka: "Beljakovina", vrednost: () => {
      const B = model.B, n = B.steviloAK, k = B.verige.length;
      return `${B.ime} · ${n} ${sklon(n, "aminokislina", "aminokislini", "aminokisline", "aminokislin")} · ${k} ${sklon(k, "veriga", "verigi", "verige", "verig")}`;
    } },
    { tip: "izpis", id: "naloga", oznaka: "Naloga", vrednost: () => model.B.naloga },
    { tip: "izpis", id: "vir", oznaka: "Vir", vrednost: () => `${model.B.vir}; le atomi Cα` },
  ];

  function dispose() { pocisti(); }

  sestavi();
  return obj;
}

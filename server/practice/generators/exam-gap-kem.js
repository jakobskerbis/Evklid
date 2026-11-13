// Naloge za teme drugih državnih izpitov, ki jih banka še ni imela (angleško in hindijsko).
// Teme: polimeri, industrijska kemija, okoljska kemija. Vsebina je skupna učnim načrtom Indije (NCERT),
// Pakistana, Bangladeša, Nepala, Šrilanke, Egipta, vzhodne in zahodne Afrike, Južne Afrike, Malezije,
// Indonezije in Vietnama. Molske mase so izračunane iz relativnih atomskih mas v kodi.
// Vse naključne izbire so narejene pred izbiro besedil (L), zato isto seme da v obeh jezikih isto nalogo.
import { en, numM as numM0, task as baseTask, choiceWhy, bi, roundToL } from "./exam-util.js";

const tidy = (x) => (typeof x === "number" ? +x.toPrecision(12) : x);
const numM = (v, d, list) => numM0(tidy(v), d, list.map(([x, w]) => [tidy(x), w]));

const T = (slug) => `KEM-EXB/${slug}`;
const q = (sym, x, u = "") => `${sym} = ${typeof x === "number" ? en(x) : x}${u ? `\\ \\mathrm{${u}}` : ""}`;
const near = (x, d) => Math.abs(x * 10 ** d - Math.round(x * 10 ** d)) < 1e-7;
const RT = (x, d, lang) => (near(x, d) ? "" : roundToL(d, lang));
const ev = (x, d) => (near(x, d) ? `= ${en(x)}` : `\\approx ${en(x, d)}`);
const fx = (x, d) => (near(x, d) ? en(x) : en(x, d));
const ch = (r, L, ok, wrong) => choiceWhy(r, L(...ok), r.shuffle(wrong).map(([o, w]) => [L(...o), L(...w)]));
const DEV = /[\u0900-\u097F]/;
const task = (o) => {
  const lines = String(o.solution || "").split("\n");
  const last = lines[lines.length - 1];
  if (last.startsWith("$")) lines[lines.length - 1] = (DEV.test(o.text) ? "उत्तर: " : "Answer: ") + last;
  return baseTask({ ...o, solution: lines.join("\n") });
};
const concept = (r, L, it) => baseTask({ text: L(...it.q), answer: ch(r, L, it.ok, it.wrong), hint: L(...it.hint), solution: L(...it.sol) });

// Velika začetnica (angleška besedila in možnosti).
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const capN = (n) => [cap(n[0]), n[1]];
// Relativne atomske mase, kot jih uporabljajo izpiti.
const AR = { H: 1, C: 12, N: 14, O: 16, F: 19, S: 32, Cl: 35.5, Fe: 56, Al: 27, Ca: 40 };
const molar = (f) => tidy(Object.entries(f).reduce((s, [e, n]) => s + AR[e] * n, 0));
// {C: 2, H: 3, Cl: 1} → "C_2H_3Cl" (LaTeX) in izračun "2(12) + 3(1) + 35.5".
const ftex = (f) => Object.entries(f).map(([e, n]) => (n === 1 ? e : `${e}_{${n}}`)).join("");
const fsum = (f) => Object.entries(f).map(([e, n]) => (n === 1 ? `${AR[e]}` : `${n} \\cdot ${AR[e]}`)).join(" + ");
const arGiven = (f) => Object.keys(f).map((e) => q(`A_r(\\mathrm{${e}})`, AR[e]));
const arList = (f) => Object.keys(f).map((e) => `${e} = ${AR[e]}`).join(", ");

// ---------- 1. Polymers ----------
const POLY = [
  { k: "PE", n: ["polythene", "पॉलिथीन"], m: ["ethene, CH₂=CH₂", "एथीन, CH₂=CH₂"], add: true, f: { C: 2, H: 4 } },
  { k: "PP", n: ["polypropene", "पॉलिप्रोपीन"], m: ["propene, CH₃–CH=CH₂", "प्रोपीन, CH₃–CH=CH₂"], add: true, f: { C: 3, H: 6 } },
  { k: "PVC", n: ["PVC (polyvinyl chloride)", "PVC (पॉलिवाइनिल क्लोराइड)"], m: ["vinyl chloride (chloroethene), CH₂=CHCl", "वाइनिल क्लोराइड (क्लोरोएथीन), CH₂=CHCl"], add: true, f: { C: 2, H: 3, Cl: 1 }, el: "Cl" },
  { k: "PTFE", n: ["Teflon (PTFE)", "टेफ्लॉन (PTFE)"], m: ["tetrafluoroethene, CF₂=CF₂", "टेट्राफ्लुओरोएथीन, CF₂=CF₂"], add: true, f: { C: 2, F: 4 }, el: "F" },
  { k: "PS", n: ["polystyrene", "पॉलिस्टाइरीन"], m: ["styrene (phenylethene), C₆H₅–CH=CH₂", "स्टाइरीन (फेनिलएथीन), C₆H₅–CH=CH₂"], add: true, f: { C: 8, H: 8 } },
  { k: "PAN", n: ["polyacrylonitrile (PAN, Orlon)", "पॉलिऐक्रिलोनाइट्राइल (PAN, ऑरलॉन)"], m: ["acrylonitrile, CH₂=CH–CN", "ऐक्रिलोनाइट्राइल, CH₂=CH–CN"], add: true, f: { C: 3, H: 3, N: 1 }, el: "N" },
  { k: "NR", n: ["natural rubber", "प्राकृतिक रबर"], m: ["isoprene (2-methyl-1,3-butadiene)", "आइसोप्रीन (2-मेथिल-1,3-ब्यूटाडाईन)"], add: true, f: { C: 5, H: 8 } },
  { k: "NEO", n: ["neoprene", "नियोप्रीन"], m: ["chloroprene (2-chloro-1,3-butadiene)", "क्लोरोप्रीन (2-क्लोरो-1,3-ब्यूटाडाईन)"], add: true, f: { C: 4, H: 5, Cl: 1 }, el: "Cl" },
  { k: "BS", n: ["Buna-S", "ब्यूना-S"], m: ["1,3-butadiene and styrene", "1,3-ब्यूटाडाईन और स्टाइरीन"], add: true, two: true },
  { k: "N66", n: ["nylon-6,6", "नायलॉन-6,6"], m: ["hexamethylenediamine and adipic acid", "हेक्सामेथिलीनडाइऐमीन और ऐडिपिक अम्ल"], add: false, two: true, f: { C: 12, H: 22, N: 2, O: 2 }, mons: [116, 146], el: "N" },
  { k: "PET", n: ["Terylene (Dacron)", "टेरिलीन (डेक्रॉन)"], m: ["ethylene glycol and terephthalic acid", "एथिलीन ग्लाइकॉल और टेरेफ्थैलिक अम्ल"], add: false, two: true, f: { C: 10, H: 8, O: 4 }, mons: [62, 166] },
  { k: "BAK", n: ["Bakelite", "बैकेलाइट"], m: ["phenol and formaldehyde (methanal)", "फ़ीनॉल और फ़ॉर्मैल्डिहाइड (मेथेनैल)"], add: false, two: true },
];
const EL_NAME = { Cl: ["chlorine", "क्लोरीन"], F: ["fluorine", "फ्लुओरीन"], N: ["nitrogen", "नाइट्रोजन"] };
// Preverjanje molskih mas ponavljajočih se enot ob nalaganju.
if (molar(POLY.find((p) => p.k === "N66").f) !== 226 || molar(POLY.find((p) => p.k === "PET").f) !== 192) throw new Error("POLY: molska masa");

const POLY_C1 = [
  {
    q: ["Which polymer is used for the non-stick coating of frying pans?", "फ्राइंग पैन की नॉन-स्टिक परत के लिए किस बहुलक का उपयोग होता है?"],
    ok: ["Teflon (polytetrafluoroethene)", "टेफ्लॉन (पॉलिटेट्राफ्लुओरोएथीन)"],
    wrong: [
      [["Bakelite", "बैकेलाइट"], ["Bakelite is used for handles and electrical switches, not as a non-stick coating.", "बैकेलाइट हैंडल और बिजली के स्विच बनाने में प्रयुक्त होता है, नॉन-स्टिक परत में नहीं।"]],
      [["PVC", "PVC"], ["PVC is used for pipes, raincoats and cable insulation; it is not used as a non-stick coating.", "PVC पाइप, बरसाती और तारों के विद्युतरोधन में प्रयुक्त होता है; नॉन-स्टिक परत में नहीं।"]],
      [["Nylon-6,6", "नायलॉन-6,6"], ["Nylon-6,6 is used for fibres, ropes and fabrics.", "नायलॉन-6,6 रेशों, रस्सियों और कपड़ों में प्रयुक्त होता है।"]],
    ],
    hint: ["The polymer must resist heat and chemicals and have a very slippery surface.", "बहुलक ऊष्मा और रसायनों से अप्रभावित हो तथा उसकी सतह बहुत चिकनी हो।"],
    sol: ["Teflon, –(CF₂–CF₂)ₙ–, is chemically inert, stands high temperatures and has a very low-friction surface.", "टेफ्लॉन, –(CF₂–CF₂)ₙ–, रासायनिक रूप से अक्रिय है, उच्च ताप सह लेता है और उसकी सतह पर घर्षण बहुत कम होता है।"],
  },
  {
    q: ["Which of the following is a natural polymer?", "निम्नलिखित में से कौन-सा प्राकृतिक बहुलक है?"],
    ok: ["Cellulose", "सेलुलोस"],
    wrong: [
      [["PVC", "PVC"], ["PVC is made in factories by polymerising vinyl chloride.", "PVC कारखानों में वाइनिल क्लोराइड के बहुलकन से बनाया जाता है।"]],
      [["Nylon-6,6", "नायलॉन-6,6"], ["Nylon-6,6 is a synthetic polyamide.", "नायलॉन-6,6 एक संश्लिष्ट पॉलिऐमाइड है।"]],
      [["Polythene", "पॉलिथीन"], ["Polythene is a synthetic polymer made from ethene.", "पॉलिथीन एथीन से बना संश्लिष्ट बहुलक है।"]],
    ],
    hint: ["Look for a polymer made by living things.", "ऐसा बहुलक खोजिए जो सजीव बनाते हैं।"],
    sol: ["Cellulose is made by plants from glucose units. Starch, proteins and natural rubber are other natural polymers.", "सेलुलोस को पौधे ग्लूकोस इकाइयों से बनाते हैं। स्टार्च, प्रोटीन और प्राकृतिक रबर भी प्राकृतिक बहुलक हैं।"],
  },
  {
    q: ["Why is a polymer like polythene called a macromolecule?", "पॉलिथीन जैसे बहुलक को वृहदणु क्यों कहा जाता है?"],
    ok: ["It is a very large molecule made of many repeating units joined together", "यह अनेक पुनरावर्ती इकाइयों के जुड़ने से बना बहुत बड़ा अणु है"],
    wrong: [
      [["It is a mixture of many small molecules", "यह अनेक छोटे अणुओं का मिश्रण है"], ["The units are joined by covalent bonds into one long chain, not mixed.", "इकाइयाँ सहसंयोजक बंधों से एक लंबी शृंखला में जुड़ी होती हैं, मिश्रित नहीं।"]],
      [["It is made of large atoms", "यह बड़े परमाणुओं से बना है"], ["Polythene contains only small atoms, C and H; the molecule is large because the chain is long.", "पॉलिथीन में केवल छोटे परमाणु C और H हैं; अणु बड़ा है क्योंकि शृंखला लंबी है।"]],
      [["It forms large crystals of ions", "यह आयनों के बड़े क्रिस्टल बनाता है"], ["Polythene is covalent, not ionic.", "पॉलिथीन सहसंयोजक है, आयनिक नहीं।"]],
    ],
    hint: ["Poly = many.", "पॉलि = अनेक।"],
    sol: ["Thousands of ethene units join by covalent bonds into one long chain, giving a very large molar mass.", "हजारों एथीन इकाइयाँ सहसंयोजक बंधों से एक लंबी शृंखला में जुड़ती हैं, इसलिए मोलर द्रव्यमान बहुत अधिक होता है।"],
  },
];

const POLY_C2 = [
  {
    q: ["Why can Bakelite not be softened and remoulded by heating?", "बैकेलाइट को गर्म करके नरम और पुनः ढाला क्यों नहीं जा सकता?"],
    ok: ["It has a three-dimensional cross-linked network (it is thermosetting)", "इसमें त्रिविमीय तिर्यक-बंधित जाल है (यह तापदृढ़ है)"],
    wrong: [
      [["It is made of linear chains held by weak forces", "यह दुर्बल बलों से जुड़ी रैखिक शृंखलाओं से बना है"], ["That describes thermoplastics, which do soften on heating.", "यह तापसुघट्य बहुलकों का वर्णन है, जो गर्म करने पर नरम होते हैं।"]],
      [["It is an addition polymer", "यह योगज बहुलक है"], ["Bakelite is a condensation polymer, and the type of reaction is not the reason.", "बैकेलाइट संघनन बहुलक है, और अभिक्रिया का प्रकार इसका कारण नहीं है।"]],
      [["Its molar mass is very low", "इसका मोलर द्रव्यमान बहुत कम है"], ["The cross-linked network has an extremely large molar mass.", "तिर्यक-बंधित जाल का मोलर द्रव्यमान अत्यधिक होता है।"]],
    ],
    hint: ["Think about the bonds between the chains.", "शृंखलाओं के बीच के बंधों पर विचार कीजिए।"],
    sol: ["On heating, Bakelite forms extensive covalent cross-links. These cannot be broken by reheating, so it cannot be remoulded.", "गर्म करने पर बैकेलाइट में व्यापक सहसंयोजक तिर्यक-बंध बनते हैं। दोबारा गर्म करने पर ये नहीं टूटते, इसलिए इसे पुनः ढाला नहीं जा सकता।"],
  },
  {
    q: ["Which of the following is a thermoplastic polymer?", "निम्नलिखित में से कौन-सा तापसुघट्य बहुलक है?"],
    ok: ["Polythene", "पॉलिथीन"],
    wrong: [
      [["Bakelite", "बैकेलाइट"], ["Bakelite is thermosetting: it sets permanently on heating.", "बैकेलाइट तापदृढ़ है: गर्म करने पर यह स्थायी रूप से कठोर हो जाता है।"]],
      [["Melamine–formaldehyde resin", "मेलामीन-फ़ॉर्मैल्डिहाइड रेज़िन"], ["Melamine–formaldehyde is thermosetting (used for unbreakable crockery).", "मेलामीन-फ़ॉर्मैल्डिहाइड तापदृढ़ है (न टूटने वाले बर्तनों में प्रयुक्त)।"]],
      [["Urea–formaldehyde resin", "यूरिया-फ़ॉर्मैल्डिहाइड रेज़िन"], ["Urea–formaldehyde is a thermosetting resin.", "यूरिया-फ़ॉर्मैल्डिहाइड एक तापदृढ़ रेज़िन है।"]],
    ],
    hint: ["A thermoplastic softens on heating and hardens again on cooling.", "तापसुघट्य बहुलक गर्म करने पर नरम होता है और ठंडा होने पर फिर कठोर हो जाता है।"],
    sol: ["Polythene has linear (or slightly branched) chains without cross-links, so it can be softened and remoulded many times.", "पॉलिथीन में तिर्यक-बंध रहित रैखिक (या थोड़ी शाखित) शृंखलाएँ हैं, इसलिए इसे बार-बार नरम करके ढाला जा सकता है।"],
  },
  {
    q: ["Nylon-6,6 is made from hexamethylenediamine and adipic acid. Which small molecule is eliminated?", "नायलॉन-6,6 हेक्सामेथिलीनडाइऐमीन और ऐडिपिक अम्ल से बनता है। कौन-सा छोटा अणु निकलता है?"],
    ok: ["Water (H₂O)", "जल (H₂O)"],
    wrong: [
      [["Ammonia (NH₃)", "अमोनिया (NH₃)"], ["The –NH₂ group keeps its N in the amide link; it loses only H.", "–NH₂ समूह का N ऐमाइड बंध में रहता है; केवल H निकलता है।"]],
      [["Carbon dioxide (CO₂)", "कार्बन डाइऑक्साइड (CO₂)"], ["The –COOH group loses –OH, not CO₂, when it forms the amide.", "ऐमाइड बनाते समय –COOH समूह से –OH निकलता है, CO₂ नहीं।"]],
      [["No molecule: it is an addition polymer", "कोई अणु नहीं: यह योगज बहुलक है"], ["Two different monomers with –NH₂ and –COOH groups join by condensation.", "–NH₂ और –COOH समूहों वाले दो भिन्न एकलक संघनन द्वारा जुड़ते हैं।"]],
    ],
    hint: ["Combine –OH from the acid with –H from the amine.", "अम्ल का –OH और ऐमीन का –H मिलाइए।"],
    sol: ["–COOH + H₂N– → –CO–NH– + H₂O: each amide link releases one water molecule.", "–COOH + H₂N– → –CO–NH– + H₂O: हर ऐमाइड बंध बनने पर एक जल अणु निकलता है।"],
  },
  {
    q: ["Which linkage joins the units in Terylene (Dacron)?", "टेरिलीन (डेक्रॉन) में इकाइयाँ किस बंध से जुड़ी हैं?"],
    ok: ["Ester linkage (–CO–O–)", "एस्टर बंध (–CO–O–)"],
    wrong: [
      [["Amide linkage (–CO–NH–)", "ऐमाइड बंध (–CO–NH–)"], ["Amide links are found in nylons; Terylene has no nitrogen.", "ऐमाइड बंध नायलॉन में होते हैं; टेरिलीन में नाइट्रोजन नहीं है।"]],
      [["Glycosidic linkage", "ग्लाइकोसाइडी बंध"], ["Glycosidic links join sugar units in starch and cellulose.", "ग्लाइकोसाइडी बंध स्टार्च और सेलुलोस में शर्करा इकाइयों को जोड़ते हैं।"]],
      [["C–C links only, as in polythene", "केवल C–C बंध, पॉलिथीन की तरह"], ["Terylene is a condensation polymer of a diol and a diacid.", "टेरिलीन एक डाइऑल और एक डाइअम्ल का संघनन बहुलक है।"]],
    ],
    hint: ["Its monomers are an alcohol (ethylene glycol) and a carboxylic acid.", "इसके एकलक एक ऐल्कोहॉल (एथिलीन ग्लाइकॉल) और एक कार्बोक्सिलिक अम्ल हैं।"],
    sol: ["–COOH + HO– → –CO–O– + H₂O: an acid and an alcohol form an ester, so Terylene is a polyester.", "–COOH + HO– → –CO–O– + H₂O: अम्ल और ऐल्कोहॉल से एस्टर बनता है, इसलिए टेरिलीन पॉलिएस्टर है।"],
  },
];

const POLY_C3 = [
  {
    q: ["What happens when natural rubber is vulcanised?", "प्राकृतिक रबर का वल्कनीकरण करने पर क्या होता है?"],
    ok: ["Sulphur forms cross-links between the chains, so the rubber becomes harder, stronger and less sticky", "सल्फर शृंखलाओं के बीच तिर्यक-बंध बनाता है, इसलिए रबर अधिक कठोर, मजबूत और कम चिपचिपा हो जाता है"],
    wrong: [
      [["Hydrogen is added to all the C=C double bonds", "सभी C=C द्विबंधों पर हाइड्रोजन जुड़ जाता है"], ["Vulcanisation uses sulphur, which links neighbouring chains through the reactive sites near the double bonds.", "वल्कनीकरण में सल्फर प्रयुक्त होता है, जो द्विबंधों के पास के सक्रिय स्थानों से पड़ोसी शृंखलाओं को जोड़ता है।"]],
      [["The chains break down into isoprene units", "शृंखलाएँ टूटकर आइसोप्रीन इकाइयाँ बन जाती हैं"], ["That would be depolymerisation; vulcanisation joins chains instead.", "यह विबहुलकन होगा; वल्कनीकरण तो शृंखलाओं को जोड़ता है।"]],
      [["The rubber turns into a condensation polymer", "रबर संघनन बहुलक में बदल जाता है"], ["The chains stay as polyisoprene; only S bridges are added between them.", "शृंखलाएँ पॉलिआइसोप्रीन ही रहती हैं; उनके बीच केवल S सेतु जुड़ते हैं।"]],
    ],
    hint: ["Raw rubber is soft and sticky because its chains slide past each other.", "कच्चा रबर नरम और चिपचिपा होता है क्योंकि उसकी शृंखलाएँ एक-दूसरे पर फिसलती हैं।"],
    sol: ["Heating with sulphur makes –S–S– bridges between polyisoprene chains. The chains can no longer slide freely, so the rubber is tougher and more elastic over a wider temperature range.", "सल्फर के साथ गर्म करने पर पॉलिआइसोप्रीन शृंखलाओं के बीच –S–S– सेतु बनते हैं। शृंखलाएँ अब मुक्त रूप से नहीं फिसलतीं, इसलिए रबर अधिक मजबूत और व्यापक ताप-परास में प्रत्यास्थ रहता है।"],
  },
  {
    q: ["Natural rubber is best described as:", "प्राकृतिक रबर का सबसे सही वर्णन है:"],
    ok: ["cis-1,4-polyisoprene", "cis-1,4-पॉलिआइसोप्रीन"],
    wrong: [
      [["trans-1,4-polyisoprene", "trans-1,4-पॉलिआइसोप्रीन"], ["The trans form is gutta-percha, which is hard, not elastic.", "trans रूप गटापार्चा है, जो कठोर है, प्रत्यास्थ नहीं।"]],
      [["poly(1,3-butadiene) with styrene", "स्टाइरीन सहित पॉलि(1,3-ब्यूटाडाईन)"], ["That is Buna-S, a synthetic rubber.", "यह ब्यूना-S है, एक संश्लिष्ट रबर।"]],
      [["polychloroprene", "पॉलिक्लोरोप्रीन"], ["Polychloroprene is neoprene, a synthetic rubber.", "पॉलिक्लोरोप्रीन नियोप्रीन है, एक संश्लिष्ट रबर।"]],
    ],
    hint: ["Its monomer is 2-methyl-1,3-butadiene; think about the shape around each C=C.", "इसका एकलक 2-मेथिल-1,3-ब्यूटाडाईन है; हर C=C के चारों ओर की आकृति पर विचार कीजिए।"],
    sol: ["Natural rubber is a linear polymer of isoprene with cis double bonds. The cis arrangement gives coiled chains, which makes it elastic.", "प्राकृतिक रबर आइसोप्रीन का cis द्विबंधों वाला रैखिक बहुलक है। cis व्यवस्था से शृंखलाएँ कुंडलित रहती हैं, जिससे यह प्रत्यास्थ होता है।"],
  },
];

const exgPolymers = {
  id: "exg-kem-polymers",
  topics: [T("polymers")],
  langs: ["en", "hi"],
  gen(level, r, _t, lang) {
    const L = bi(lang);
    const ADD = POLY.filter((p) => p.add && p.f);
    if (level === 1) {
      const v = r.int(0, 3);
      if (v === 0) {
        const p = r.pick(POLY);
        const others = POLY.filter((x) => x !== p);
        return baseTask({
          text: L(`Which ${p.two ? "are the monomers" : "is the monomer"} of ${p.n[0]}?`, `${p.n[1]} ${p.two ? "के एकलक कौन-से हैं" : "का एकलक कौन-सा है"}?`),
          answer: ch(r, L, p.m, others.map((o) => [o.m, o.two ? [`These are the monomers of ${o.n[0]}.`, `ये ${o.n[1]} के एकलक हैं।`] : [`This is the monomer of ${o.n[0]}.`, `यह ${o.n[1]} का एकलक है।`]])),
          hint: L("Imagine cutting the polymer chain back into the small molecules it was built from.", "कल्पना कीजिए कि बहुलक शृंखला को उन छोटे अणुओं में तोड़ा जाए जिनसे वह बनी है।"),
          solution: L(`${cap(p.n[0])} is ${p.add ? "an addition" : "a condensation"} polymer of ${p.m[0]}.`, `${p.n[1]}, ${p.m[1]} का ${p.add ? "योगज" : "संघनन"} बहुलक है।`),
        });
      }
      if (v === 1) {
        const askCond = r.int(0, 1) === 0;
        const cond = POLY.filter((x) => !x.add);
        const add = POLY.filter((x) => x.add);
        const ok = askCond ? r.pick(cond) : r.pick(add);
        const pool = askCond ? add : cond;
        const whyAdd = (o) => [`${cap(o.n[0])} is an addition polymer: its monomer units join without losing any small molecule.`, `${o.n[1]} योगज बहुलक है: इसकी एकलक इकाइयाँ कोई छोटा अणु खोए बिना जुड़ती हैं।`];
        const whyCond = (o) => [`${cap(o.n[0])} is a condensation polymer: a small molecule (water) is lost each time two units join.`, `${o.n[1]} संघनन बहुलक है: हर बार दो इकाइयों के जुड़ने पर एक छोटा अणु (जल) निकलता है।`];
        return baseTask({
          text: askCond ? L("Which of the following is a condensation polymer?", "निम्नलिखित में से कौन-सा संघनन बहुलक है?") : L("Which of the following is an addition polymer?", "निम्नलिखित में से कौन-सा योगज बहुलक है?"),
          answer: ch(r, L, capN(ok.n), pool.map((o) => [capN(o.n), askCond ? whyAdd(o) : whyCond(o)])),
          hint: L("Addition polymers come from monomers with a C=C double bond; condensation polymers lose a small molecule such as water.", "योगज बहुलक C=C द्विबंध वाले एकलकों से बनते हैं; संघनन बहुलकों में जल जैसा छोटा अणु निकलता है।"),
          solution: L(`${cap(ok.n[0])} is made from ${ok.m[0]}${ok.add ? " by addition across the C=C double bond; nothing is eliminated." : "; water is eliminated as the units link up."}`, `${ok.n[1]}, ${ok.m[1]} से ${ok.add ? "C=C द्विबंध पर योग द्वारा बनता है; कुछ भी नहीं निकलता।" : "बनता है; इकाइयों के जुड़ने पर जल निकलता है।"}`),
        });
      }
      if (v === 2) {
        const p = r.pick(ADD);
        const Mr = molar(p.f);
        const n = r.int(4, 40) * 50;
        const M = tidy(n * Mr);
        return task({
          text: L(`A sample of ${p.n[0]} has a molar mass of ${en(M)} g/mol. The molar mass of its repeating unit is ${en(Mr)} g/mol. Find the degree of polymerisation (number of repeating units per chain).`, `${p.n[1]} के एक नमूने का मोलर द्रव्यमान ${en(M)} g/mol है। इसकी पुनरावर्ती इकाई का मोलर द्रव्यमान ${en(Mr)} g/mol है। बहुलकीकरण की कोटि (प्रति शृंखला पुनरावर्ती इकाइयों की संख्या) ज्ञात कीजिए।`),
          answer: numM(n, 0, [[M * Mr, L("Divide the polymer's molar mass by that of one repeating unit.", "बहुलक के मोलर द्रव्यमान को एक पुनरावर्ती इकाई के मोलर द्रव्यमान से भाग दीजिए।")]]),
          data: { given: [q("M", M, "g/mol"), q("M_0", Mr, "g/mol")], find: ["n"] },
          hint: L("Each chain is made of $n$ identical repeating units.", "हर शृंखला $n$ समान पुनरावर्ती इकाइयों से बनी है।"),
          formula: "n = \\dfrac{M}{M_0}",
          solution: `$n = \\dfrac{${en(M)}}{${en(Mr)}}$\n$n = ${n}$`,
        });
      }
      return concept(r, L, r.pick(POLY_C1));
    }
    if (level === 2) {
      const v = r.int(0, 3);
      if (v === 0 || v === 2) {
        const p = r.pick(POLY.filter((x) => x.f));
        const Mr = molar(p.f);
        const n = r.int(4, 40) * 50;
        const M = tidy(n * Mr);
        const cond = !p.add;
        const repTxt = L(`its repeating unit has the formula $\\mathrm{${ftex(p.f)}}$`, `इसकी पुनरावर्ती इकाई का सूत्र $\\mathrm{${ftex(p.f)}}$ है`);
        const arTxt = arList(p.f);
        if (v === 0) {
          return task({
            text: L(`A chain of ${p.n[0]} has a molar mass of ${en(M)} g/mol, and ${repTxt}. Find its degree of polymerisation. (Atomic masses: ${arTxt}.)`, `${p.n[1]} की एक शृंखला का मोलर द्रव्यमान ${en(M)} g/mol है, और ${repTxt}। इसकी बहुलकीकरण की कोटि ज्ञात कीजिए। (परमाणु द्रव्यमान: ${arTxt}।)`),
            answer: numM(n, 0, cond
              ? [[M / (p.mons[0] + p.mons[1]), L("Two water molecules are lost per repeating unit; use the mass of the repeating unit, not the sum of the monomers.", "हर पुनरावर्ती इकाई पर दो जल अणु निकलते हैं; एकलकों का योग नहीं, पुनरावर्ती इकाई का द्रव्यमान लीजिए।")]]
              : [[M / (Mr - 2), L("In addition polymerisation no atoms are lost: the repeating unit has the same formula as the monomer.", "योगज बहुलकन में कोई परमाणु नहीं निकलता: पुनरावर्ती इकाई का सूत्र एकलक जैसा ही है।")], [M * Mr, L("Divide by the mass of the repeating unit.", "पुनरावर्ती इकाई के द्रव्यमान से भाग दीजिए।")]]),
            data: { given: [q("M", M, "g/mol"), ...arGiven(p.f)], find: ["n"] },
            hint: L("Work out the molar mass of the repeating unit from the atomic masses first.", "पहले परमाणु द्रव्यमानों से पुनरावर्ती इकाई का मोलर द्रव्यमान निकालिए।"),
            formula: "n = \\dfrac{M}{M_0}",
            solution: `$M_0 = ${fsum(p.f)} = ${en(Mr)}\\ \\text{g/mol}$\n$n = \\dfrac{${en(M)}}{${en(Mr)}}$\n$n = ${n}$`,
          });
        }
        return task({
          text: L(`A chain of ${p.n[0]} contains ${n} repeating units, and ${repTxt}. Find the molar mass of the chain in g/mol. (Atomic masses: ${arTxt}.)`, `${p.n[1]} की एक शृंखला में ${n} पुनरावर्ती इकाइयाँ हैं, और ${repTxt}। शृंखला का मोलर द्रव्यमान g/mol में ज्ञात कीजिए। (परमाणु द्रव्यमान: ${arTxt}।)`),
          answer: numM(M, 1, cond ? [[n * (p.mons[0] + p.mons[1]), L("Water is lost when the units join; use the repeating unit's mass, not the sum of the monomers.", "इकाइयों के जुड़ने पर जल निकलता है; एकलकों का योग नहीं, पुनरावर्ती इकाई का द्रव्यमान लीजिए।")]] : [[n / Mr, L("Multiply the number of units by the mass of one unit.", "इकाइयों की संख्या को एक इकाई के द्रव्यमान से गुणा कीजिए।")]]),
          data: { given: [q("n", n), ...arGiven(p.f)], find: ["M"] },
          hint: L("Molar mass of the chain = number of units × molar mass of one unit (end groups can be ignored).", "शृंखला का मोलर द्रव्यमान = इकाइयों की संख्या × एक इकाई का मोलर द्रव्यमान (अंत्य समूह नगण्य)।"),
          formula: "M = n M_0",
          solution: `$M_0 = ${fsum(p.f)} = ${en(Mr)}\\ \\text{g/mol}$\n$M = ${n} \\cdot ${en(Mr)}$\n$M = ${en(M)}\\ \\text{g/mol}$`,
        });
      }
      if (v === 1) {
        const p = r.pick(POLY.filter((x) => x.el));
        const Mr = molar(p.f);
        const cnt = p.f[p.el];
        const mEl = AR[p.el] * cnt;
        const pct = (100 * mEl) / Mr;
        const list = [[(100 * mEl) / (Mr - mEl), L("Divide by the mass of the whole repeating unit, not by the rest of it.", "पूरी पुनरावर्ती इकाई के द्रव्यमान से भाग दीजिए, बाकी भाग से नहीं।")]];
        if (cnt > 1) list.push([(100 * AR[p.el]) / Mr, L(`There are ${cnt} atoms of this element in each repeating unit.`, `हर पुनरावर्ती इकाई में इस तत्व के ${cnt} परमाणु हैं।`)]);
        return task({
          text: L(`The repeating unit of ${p.n[0]} is $\\mathrm{${ftex(p.f)}}$. Find the percentage by mass of ${EL_NAME[p.el][0]} in the polymer. (Atomic masses: ${arList(p.f)}.)${RT(pct, 2, lang)}`, `${p.n[1]} की पुनरावर्ती इकाई $\\mathrm{${ftex(p.f)}}$ है। बहुलक में ${EL_NAME[p.el][1]} का द्रव्यमान प्रतिशत ज्ञात कीजिए। (परमाणु द्रव्यमान: ${arList(p.f)}।)${RT(pct, 2, lang)}`),
          answer: numM(pct, 2, list),
          data: { given: arGiven(p.f), find: [`w_{\\mathrm{${p.el}}}`] },
          hint: L("The percentage composition of the polymer is the same as that of one repeating unit.", "बहुलक का प्रतिशत संघटन एक पुनरावर्ती इकाई के संघटन जैसा ही होता है।"),
          formula: "w = \\dfrac{\\text{mass of element in unit}}{M_0} \\times 100\\,\\%",
          solution: `$M_0 = ${fsum(p.f)} = ${en(Mr)}\\ \\text{g/mol}$\n$w_{\\mathrm{${p.el}}} = \\dfrac{${en(mEl)}}{${en(Mr)}} \\times 100$\n$w_{\\mathrm{${p.el}}} ${ev(pct, 2)}\\,\\%$`,
        });
      }
      return concept(r, L, r.pick(POLY_C2));
    }
    // level 3
    const v = r.int(0, 3);
    if (v === 0) {
      const m = r.pick([50, 73, 100, 146, 200, 292]);
      const y = r.pick([80, 85, 90, 95, 100]);
      const theo = (m / 146) * 226;
      const act = (theo * y) / 100;
      return task({
        text: L(`Nylon-6,6 is made from adipic acid (M = 146 g/mol) and excess hexamethylenediamine. The repeating unit $\\mathrm{C_{12}H_{22}N_2O_2}$ has M = 226 g/mol. What mass of nylon-6,6, in kg, is obtained from ${m} kg of adipic acid if the yield is ${y}%?${RT(act, 2, lang)}`, `नायलॉन-6,6 ऐडिपिक अम्ल (M = 146 g/mol) और आधिक्य में हेक्सामेथिलीनडाइऐमीन से बनता है। पुनरावर्ती इकाई $\\mathrm{C_{12}H_{22}N_2O_2}$ का M = 226 g/mol है। यदि लब्धि ${y}% हो, तो ${m} kg ऐडिपिक अम्ल से कितने kg नायलॉन-6,6 प्राप्त होगा?${RT(act, 2, lang)}`),
        answer: numM(act, 2, [[(m / 146) * 262 * (y / 100), L("Two water molecules (36 g/mol) leave per repeating unit: use 226, not 146 + 116.", "हर पुनरावर्ती इकाई पर दो जल अणु (36 g/mol) निकलते हैं: 146 + 116 नहीं, 226 लीजिए।")], ...(y < 100 ? [[theo, L(`Only ${y}% of the theoretical mass is obtained.`, `सैद्धांतिक द्रव्यमान का केवल ${y}% प्राप्त होता है।`)]] : []), [m * (y / 100), L("Convert through moles: 1 mol adipic acid gives 1 mol of repeating units.", "मोल के माध्यम से बदलिए: 1 mol ऐडिपिक अम्ल से 1 mol पुनरावर्ती इकाई बनती है।")]]),
        data: { given: [q("m", m, "kg"), q("M_{acid}", 146, "g/mol"), q("M_0", 226, "g/mol"), q("\\eta", `${y}\\%`)], find: ["m_{nylon}"] },
        hint: L("One adipic acid molecule ends up in each repeating unit.", "हर पुनरावर्ती इकाई में एक ऐडिपिक अम्ल अणु आता है।"),
        formula: ["n = \\dfrac{m}{M_{acid}}", "m_{nylon} = n M_0 \\cdot \\dfrac{\\eta}{100}"],
        solution: `$n = \\dfrac{${m}}{146} ${ev(m / 146, 4)}\\ \\text{kmol}$\n$m_{theo} = ${fx(m / 146, 4)} \\cdot 226 ${ev(theo, 2)}\\ \\text{kg}$\n$m = ${fx(theo, 2)} \\cdot ${en(y / 100)} ${ev(act, 2)}\\ \\text{kg}$`,
      });
    }
    if (v === 1) {
      const p = r.pick(POLY.filter((x) => x.mons));
      const Mr = molar(p.f);
      const m = r.pick([10, 20, 45.2, 50, 96, 100]);
      const w = (m / Mr) * 36;
      return task({
        text: L(`${cap(p.n[0])} is a condensation polymer (repeating unit $\\mathrm{${ftex(p.f)}}$, M = ${Mr} g/mol). Forming each repeating unit in a long chain releases 2 molecules of water. What mass of water, in kg, is released when ${en(m)} kg of the polymer is made?${RT(w, 2, lang)}`, `${p.n[1]} एक संघनन बहुलक है (पुनरावर्ती इकाई $\\mathrm{${ftex(p.f)}}$, M = ${Mr} g/mol)। लंबी शृंखला में हर पुनरावर्ती इकाई बनने पर 2 जल अणु निकलते हैं। ${en(m)} kg बहुलक बनाने पर कितने kg जल निकलेगा?${RT(w, 2, lang)}`),
        answer: numM(w, 2, [[(m / Mr) * 18, L("Two water molecules are released per repeating unit.", "हर पुनरावर्ती इकाई पर दो जल अणु निकलते हैं।")], [(m / (Mr + 36)) * 36, L("The polymer mass already excludes the water; divide by the mass of the repeating unit.", "बहुलक के द्रव्यमान में जल शामिल नहीं है; पुनरावर्ती इकाई के द्रव्यमान से भाग दीजिए।")]]),
        data: { given: [q("m", m, "kg"), q("M_0", Mr, "g/mol")], find: ["m_{\\mathrm{H_2O}}"] },
        hint: L("Find the amount (kmol) of repeating units first.", "पहले पुनरावर्ती इकाइयों की मात्रा (kmol) ज्ञात कीजिए।"),
        formula: "m_{\\mathrm{H_2O}} = 2 \\cdot 18 \\cdot \\dfrac{m}{M_0}",
        solution: `$n = \\dfrac{${en(m)}}{${Mr}} ${ev(m / Mr, 4)}\\ \\text{kmol}$\n$n_{\\mathrm{H_2O}} = 2n ${ev((2 * m) / Mr, 4)}\\ \\text{kmol}$\n$m_{\\mathrm{H_2O}} = ${fx((2 * m) / Mr, 4)} \\cdot 18 ${ev(w, 2)}\\ \\text{kg}$`,
      });
    }
    if (v === 2) {
      const p = r.pick(ADD.filter((x) => ["PE", "PP", "PVC", "PS", "PTFE"].includes(x.k)));
      const Mr = molar(p.f);
      const m = r.pick([1, 2, 5, 10, 14, 28]);
      const M = r.int(2, 9) * 10000;
      const N = ((m / Mr) * 6.022e23) / 1e22;
      return task({
        text: L(`A ${m} g sample of ${p.n[0]} has an average molar mass of ${M} g/mol. The repeating unit is $\\mathrm{${ftex(p.f)}}$ (${arList(p.f)}). How many repeating units does the sample contain? Give the answer in units of $10^{22}$. ($N_A = 6.022 \\times 10^{23}$ mol⁻¹)${RT(N, 2, lang)}`, `${p.n[1]} के ${m} g नमूने का औसत मोलर द्रव्यमान ${M} g/mol है। पुनरावर्ती इकाई $\\mathrm{${ftex(p.f)}}$ है (${arList(p.f)})। नमूने में कितनी पुनरावर्ती इकाइयाँ हैं? उत्तर $10^{22}$ की इकाई में दीजिए। ($N_A = 6.022 \\times 10^{23}$ mol⁻¹)${RT(N, 2, lang)}`),
        answer: numM(N, 2, [[((m / M) * 6.022e23) / 1e22, L("That is the number of chains. Each chain holds many repeating units.", "यह शृंखलाओं की संख्या है। हर शृंखला में अनेक पुनरावर्ती इकाइयाँ होती हैं।")], [N / 10, L("Express the answer in units of $10^{22}$.", "उत्तर $10^{22}$ की इकाई में लिखिए।")]]),
        data: { given: [q("m", m, "g"), q("M", M, "g/mol"), "N_A = 6.022 \\times 10^{23}\\ \\mathrm{mol^{-1}}"], find: ["N"] },
        hint: L("The number of units depends only on the total mass and the mass of one unit, not on how long the chains are.", "इकाइयों की संख्या केवल कुल द्रव्यमान और एक इकाई के द्रव्यमान पर निर्भर है, शृंखलाओं की लंबाई पर नहीं।"),
        formula: "N = \\dfrac{m}{M_0} N_A",
        solution: `$M_0 = ${fsum(p.f)} = ${en(Mr)}\\ \\text{g/mol}$\n$N = \\dfrac{${m}}{${en(Mr)}} \\cdot 6.022 \\times 10^{23} ${ev(N * 1e22 / 1e23, 3)} \\times 10^{23}$\n$N ${ev(N, 2)} \\times 10^{22}$`,
      });
    }
    return concept(r, L, r.pick(POLY_C3));
  },
};

// ---------- 2. Industrial chemistry ----------
const PROC = {
  haber: { eq: "\\mathrm{N_2 + 3H_2 \\rightleftharpoons 2NH_3}", dH: -92, n: ["the Haber process", "हेबर प्रक्रम"], prod: ["ammonia", "अमोनिया"], prodF: "NH₃", gas: [4, 2] },
  contact: { eq: "\\mathrm{2SO_2 + O_2 \\rightleftharpoons 2SO_3}", dH: -197, n: ["the Contact process", "संपर्क प्रक्रम"], prod: ["sulphur trioxide", "सल्फर ट्राइऑक्साइड"], prodF: "SO₃", gas: [3, 2] },
};
const CATS = [
  { p: ["the Haber process (manufacture of ammonia)", "हेबर प्रक्रम (अमोनिया का निर्माण)"], c: ["Iron (with promoters)", "आयरन (वर्धकों सहित)"] },
  { p: ["the Contact process (manufacture of sulphuric acid)", "संपर्क प्रक्रम (सल्फ्यूरिक अम्ल का निर्माण)"], c: ["Vanadium(V) oxide, V₂O₅", "वैनेडियम(V) ऑक्साइड, V₂O₅"] },
  { p: ["the Ostwald process (manufacture of nitric acid)", "ओस्टवाल्ड प्रक्रम (नाइट्रिक अम्ल का निर्माण)"], c: ["Platinum (platinum–rhodium gauze)", "प्लैटिनम (प्लैटिनम-रोडियम जाली)"] },
  { p: ["the hydrogenation of vegetable oils", "वनस्पति तेलों का हाइड्रोजनीकरण"], c: ["Nickel", "निकेल"] },
];
// Pridobivanje kovin glede na reaktivnost (NCERT 10, 3. pogl.).
const METHODS = {
  E: ["Electrolysis of its molten compound", "इसके गलित यौगिक का विद्युत-अपघटन"],
  C: ["Reduction of its oxide with carbon (coke) or carbon monoxide", "इसके ऑक्साइड का कार्बन (कोक) या कार्बन मोनोऑक्साइड से अपचयन"],
  H: ["Heating its sulphide ore in air alone", "इसके सल्फाइड अयस्क को केवल वायु में गर्म करना"],
  N: ["It occurs free (native); it only needs to be separated", "यह मुक्त (प्राकृत) अवस्था में मिलता है; केवल अलग करना होता है"],
};
const METHOD_WHY = {
  E: ["Electrolysis is needed only for very reactive metals at the top of the reactivity series, such as Na and Al.", "विद्युत-अपघटन केवल सक्रियता श्रेणी के शीर्ष पर स्थित अति सक्रिय धातुओं, जैसे Na और Al, के लिए आवश्यक है।"],
  C: ["Reduction with carbon suits metals of middle reactivity, such as Zn and Fe.", "कार्बन से अपचयन मध्यम सक्रियता वाली धातुओं, जैसे Zn और Fe, के लिए उपयुक्त है।"],
  H: ["Heating in air alone works only for metals low in the series, such as Hg and Cu.", "केवल वायु में गर्म करना श्रेणी में नीचे की धातुओं, जैसे Hg और Cu, के लिए काम करता है।"],
  N: ["Only very unreactive metals such as gold and platinum occur free.", "केवल अति निष्क्रिय धातुएँ, जैसे सोना और प्लैटिनम, मुक्त अवस्था में मिलती हैं।"],
};
const METALS = [
  ["sodium", "सोडियम", "E"], ["aluminium", "ऐलुमिनियम", "E"], ["potassium", "पोटैशियम", "E"],
  ["iron", "आयरन (लोहा)", "C"], ["zinc", "ज़िंक", "C"], ["mercury", "मर्करी (पारा)", "H"], ["copper (from Cu₂S)", "कॉपर (Cu₂S से)", "H"], ["gold", "सोना", "N"],
];
const IND_C2 = [
  {
    q: ["In the Contact process, why is SO₃ not absorbed directly in water?", "संपर्क प्रक्रम में SO₃ को सीधे जल में अवशोषित क्यों नहीं किया जाता?"],
    ok: ["The reaction is very exothermic and forms a dense mist of acid that is hard to condense; SO₃ is absorbed in concentrated H₂SO₄ to form oleum instead", "अभिक्रिया अत्यधिक ऊष्माक्षेपी है और अम्ल का घना कुहासा बनता है जिसे संघनित करना कठिन है; इसलिए SO₃ को सांद्र H₂SO₄ में अवशोषित कर ओलियम बनाया जाता है"],
    wrong: [
      [["SO₃ does not react with water", "SO₃ जल से अभिक्रिया नहीं करता"], ["SO₃ reacts vigorously with water; that is exactly the problem.", "SO₃ जल से तीव्र अभिक्रिया करता है; यही समस्या है।"]],
      [["Water would oxidise SO₃ back to SO₂", "जल SO₃ को फिर से SO₂ में ऑक्सीकृत कर देगा"], ["Going from SO₃ to SO₂ is a reduction, and water does not do it.", "SO₃ से SO₂ बनना अपचयन है, और जल ऐसा नहीं करता।"]],
      [["Water would poison the V₂O₅ catalyst", "जल V₂O₅ उत्प्रेरक को विषाक्त कर देगा"], ["Absorption is done after the converter, away from the catalyst.", "अवशोषण परिवर्तक के बाद, उत्प्रेरक से दूर किया जाता है।"]],
    ],
    hint: ["Think about the heat given out when SO₃ meets water.", "सोचिए कि SO₃ के जल से मिलने पर कितनी ऊष्मा निकलती है।"],
    sol: ["SO₃ + H₂SO₄ → H₂S₂O₇ (oleum); then H₂S₂O₇ + H₂O → 2H₂SO₄. This avoids the acid mist formed with water.", "SO₃ + H₂SO₄ → H₂S₂O₇ (ओलियम); फिर H₂S₂O₇ + H₂O → 2H₂SO₄। इससे जल के साथ बनने वाला अम्ल-कुहासा नहीं बनता।"],
  },
  {
    q: ["In the extraction of aluminium, why is alumina (Al₂O₃) dissolved in molten cryolite?", "ऐलुमिनियम के निष्कर्षण में ऐलुमिना (Al₂O₃) को गलित क्रायोलाइट में क्यों घोला जाता है?"],
    ok: ["To lower the melting point and increase the electrical conductivity of the electrolyte", "विद्युत-अपघट्य का गलनांक कम करने और उसकी विद्युत चालकता बढ़ाने के लिए"],
    wrong: [
      [["Cryolite reduces Al₂O₃ to aluminium", "क्रायोलाइट Al₂O₃ को ऐलुमिनियम में अपचयित करता है"], ["Aluminium is produced by electrolysis at the cathode, not by cryolite.", "ऐलुमिनियम कैथोड पर विद्युत-अपघटन से बनता है, क्रायोलाइट से नहीं।"]],
      [["Cryolite removes silica as slag", "क्रायोलाइट सिलिका को धातुमल के रूप में हटाता है"], ["Slag formation with a flux happens in the blast furnace for iron.", "गालक से धातुमल बनना लोहे की वात्या भट्टी में होता है।"]],
      [["Cryolite supplies the oxygen released at the anode", "क्रायोलाइट ऐनोड पर निकलने वाली ऑक्सीजन देता है"], ["The oxygen comes from the oxide ions of alumina.", "ऑक्सीजन ऐलुमिना के ऑक्साइड आयनों से आती है।"]],
    ],
    hint: ["Pure alumina melts above 2000 °C.", "शुद्ध ऐलुमिना 2000 °C से ऊपर पिघलता है।"],
    sol: ["Alumina in molten cryolite melts at a much lower temperature and conducts better, which saves a great deal of energy.", "गलित क्रायोलाइट में ऐलुमिना बहुत कम ताप पर पिघलता है और बेहतर चालन करता है, जिससे बहुत ऊर्जा बचती है।"],
  },
  {
    q: ["What is the role of limestone (CaCO₃) in the blast furnace for iron?", "लोहे की वात्या भट्टी में चूना-पत्थर (CaCO₃) की क्या भूमिका है?"],
    ok: ["It acts as a flux: the CaO formed removes silica (sand) as slag, CaSiO₃", "यह गालक का कार्य करता है: बना हुआ CaO सिलिका (रेत) को धातुमल CaSiO₃ के रूप में हटाता है"],
    wrong: [
      [["It reduces iron(III) oxide to iron", "यह आयरन(III) ऑक्साइड को लोहे में अपचयित करता है"], ["The reducing agent is carbon monoxide formed from coke.", "अपचायक कोक से बनी कार्बन मोनोऑक्साइड है।"]],
      [["It is the fuel that heats the furnace", "यह भट्टी को गर्म करने वाला ईंधन है"], ["Coke is the fuel; limestone decomposes and absorbs heat.", "ईंधन कोक है; चूना-पत्थर अपघटित होकर ऊष्मा अवशोषित करता है।"]],
      [["It acts as a catalyst", "यह उत्प्रेरक का कार्य करता है"], ["Limestone is used up to form slag, so it is not a catalyst.", "चूना-पत्थर धातुमल बनाने में खप जाता है, इसलिए यह उत्प्रेरक नहीं है।"]],
    ],
    hint: ["The ore contains sandy impurities.", "अयस्क में रेतीली अशुद्धियाँ होती हैं।"],
    sol: ["CaCO₃ → CaO + CO₂; CaO + SiO₂ → CaSiO₃ (slag), which floats on the molten iron and is removed.", "CaCO₃ → CaO + CO₂; CaO + SiO₂ → CaSiO₃ (धातुमल), जो पिघले लोहे पर तैरता है और हटा दिया जाता है।"],
  },
  {
    q: ["In the electrolysis of brine (chlor-alkali process), which products are formed?", "लवण-जल के विद्युत-अपघटन (क्लोर-क्षार प्रक्रम) में कौन-से उत्पाद बनते हैं?"],
    ok: ["Chlorine at the anode, hydrogen at the cathode and sodium hydroxide in solution", "ऐनोड पर क्लोरीन, कैथोड पर हाइड्रोजन और विलयन में सोडियम हाइड्रॉक्साइड"],
    wrong: [
      [["Sodium metal at the cathode and chlorine at the anode", "कैथोड पर सोडियम धातु और ऐनोड पर क्लोरीन"], ["Sodium metal forms only from molten NaCl; in water, H₂ is released at the cathode.", "सोडियम धातु केवल गलित NaCl से बनती है; जल में कैथोड पर H₂ निकलती है।"]],
      [["Oxygen at the anode and hydrogen at the cathode", "ऐनोड पर ऑक्सीजन और कैथोड पर हाइड्रोजन"], ["In concentrated brine, chloride ions are discharged at the anode, giving Cl₂.", "सांद्र लवण-जल में ऐनोड पर क्लोराइड आयन विसर्जित होकर Cl₂ देते हैं।"]],
      [["Chlorine at the cathode and hydrogen at the anode", "कैथोड पर क्लोरीन और ऐनोड पर हाइड्रोजन"], ["Negative Cl⁻ ions go to the positive anode; H₂ forms at the cathode.", "ऋणात्मक Cl⁻ आयन धनात्मक ऐनोड पर जाते हैं; H₂ कैथोड पर बनती है।"]],
    ],
    hint: ["Brine is concentrated aqueous NaCl.", "लवण-जल सांद्र जलीय NaCl है।"],
    sol: ["2NaCl(aq) + 2H₂O → 2NaOH(aq) + Cl₂ (anode) + H₂ (cathode).", "2NaCl(aq) + 2H₂O → 2NaOH(aq) + Cl₂ (ऐनोड) + H₂ (कैथोड)।"],
  },
  {
    q: ["In the Haber process, why is a temperature of about 450 °C used even though the reaction is exothermic?", "हेबर प्रक्रम में अभिक्रिया ऊष्माक्षेपी होने पर भी लगभग 450 °C ताप क्यों प्रयुक्त होता है?"],
    ok: ["It is a compromise: lower temperature gives a better yield but the rate would be too slow", "यह समझौता है: कम ताप पर लब्धि अधिक होती है पर अभिक्रिया की दर बहुत धीमी हो जाती है"],
    wrong: [
      [["A higher temperature gives a higher equilibrium yield", "अधिक ताप पर साम्य लब्धि अधिक होती है"], ["For an exothermic reaction, raising the temperature lowers the yield.", "ऊष्माक्षेपी अभिक्रिया में ताप बढ़ाने से लब्धि घटती है।"]],
      [["The iron catalyst works only above 1000 °C", "आयरन उत्प्रेरक केवल 1000 °C से ऊपर काम करता है"], ["The catalyst is effective at about 450 °C; much higher temperatures would cut the yield.", "उत्प्रेरक लगभग 450 °C पर प्रभावी है; बहुत अधिक ताप से लब्धि घट जाएगी।"]],
      [["Temperature has no effect on this equilibrium", "ताप का इस साम्य पर कोई प्रभाव नहीं पड़ता"], ["Temperature changes the equilibrium constant of every reaction with ΔH ≠ 0.", "ΔH ≠ 0 वाली हर अभिक्रिया का साम्य स्थिरांक ताप से बदलता है।"]],
    ],
    hint: ["Consider both the position of equilibrium and the speed of reaching it.", "साम्य की स्थिति और उस तक पहुँचने की गति, दोनों पर विचार कीजिए।"],
    sol: ["Low temperature favours NH₃ (ΔH < 0) but makes the reaction very slow; about 450 °C with an iron catalyst gives an acceptable yield quickly.", "कम ताप NH₃ के पक्ष में है (ΔH < 0) पर अभिक्रिया बहुत धीमी हो जाती है; आयरन उत्प्रेरक के साथ लगभग 450 °C पर स्वीकार्य लब्धि जल्दी मिलती है।"],
  },
];
// Le Chatelier: [pogoj, pravilna, napačne] za proces s ΔH < 0 in manj molekulami plina na desni.
const LECH = [
  {
    c: ["the pressure is increased", "दाब बढ़ाया जाता है"],
    ok: ["The yield increases: the equilibrium shifts to the side with fewer gas molecules", "लब्धि बढ़ती है: साम्य कम गैस अणुओं वाली ओर खिसकता है"],
    wrong: [
      [["The yield decreases: high pressure favours the side with more gas molecules", "लब्धि घटती है: उच्च दाब अधिक गैस अणुओं वाली ओर के पक्ष में है"], ["Raising the pressure favours the side with fewer gas molecules.", "दाब बढ़ाने से कम गैस अणुओं वाली ओर का पक्ष होता है।"]],
      [["No change: pressure affects only the rate", "कोई परिवर्तन नहीं: दाब केवल दर को प्रभावित करता है"], ["When the number of gas molecules differs, pressure also shifts the equilibrium position.", "जब गैस अणुओं की संख्या भिन्न हो, तो दाब साम्य की स्थिति भी खिसकाता है।"]],
      [["The yield increases because K becomes larger", "लब्धि बढ़ती है क्योंकि K बड़ा हो जाता है"], ["K depends only on temperature; pressure shifts the position, not K.", "K केवल ताप पर निर्भर है; दाब स्थिति खिसकाता है, K नहीं।"]],
    ],
    sol: (g) => [`Left: ${g[0]} gas molecules, right: ${g[1]}. Higher pressure favours fewer molecules, so more product forms.`, `बाईं ओर ${g[0]} गैस अणु, दाईं ओर ${g[1]}। उच्च दाब कम अणुओं के पक्ष में है, इसलिए अधिक उत्पाद बनता है।`],
  },
  {
    c: ["the temperature is increased", "ताप बढ़ाया जाता है"],
    ok: ["The yield decreases: the forward reaction is exothermic", "लब्धि घटती है: अग्र अभिक्रिया ऊष्माक्षेपी है"],
    wrong: [
      [["The yield increases: a higher temperature always gives more product", "लब्धि बढ़ती है: अधिक ताप पर सदैव अधिक उत्पाद बनता है"], ["Heat favours the endothermic direction, here the backward reaction.", "ऊष्मा ऊष्माशोषी दिशा के पक्ष में है, जो यहाँ पश्च अभिक्रिया है।"]],
      [["No change: temperature affects only the rate", "कोई परिवर्तन नहीं: ताप केवल दर को प्रभावित करता है"], ["Temperature changes the equilibrium constant itself.", "ताप स्वयं साम्य स्थिरांक को बदलता है।"]],
      [["The yield increases: the forward reaction is endothermic", "लब्धि बढ़ती है: अग्र अभिक्रिया ऊष्माशोषी है"], ["ΔH is negative, so the forward reaction is exothermic.", "ΔH ऋणात्मक है, अतः अग्र अभिक्रिया ऊष्माक्षेपी है।"]],
    ],
    sol: () => ["ΔH < 0. Raising the temperature favours the endothermic backward reaction, so K and the yield decrease.", "ΔH < 0। ताप बढ़ाने से ऊष्माशोषी पश्च अभिक्रिया का पक्ष होता है, इसलिए K और लब्धि घटते हैं।"],
  },
  {
    c: ["a catalyst is added", "उत्प्रेरक मिलाया जाता है"],
    ok: ["No change in yield, but equilibrium is reached faster", "लब्धि में कोई परिवर्तन नहीं, पर साम्य जल्दी स्थापित होता है"],
    wrong: [
      [["The yield increases because the forward reaction is speeded up", "लब्धि बढ़ती है क्योंकि अग्र अभिक्रिया तेज हो जाती है"], ["A catalyst speeds up the forward and backward reactions equally.", "उत्प्रेरक अग्र और पश्च दोनों अभिक्रियाओं को समान रूप से तेज करता है।"]],
      [["The yield decreases because the backward reaction is speeded up", "लब्धि घटती है क्योंकि पश्च अभिक्रिया तेज हो जाती है"], ["Both directions speed up by the same factor, so the position stays the same.", "दोनों दिशाएँ समान गुणक से तेज होती हैं, इसलिए स्थिति वही रहती है।"]],
      [["The yield increases because K becomes larger", "लब्धि बढ़ती है क्योंकि K बड़ा हो जाता है"], ["A catalyst does not change K.", "उत्प्रेरक K को नहीं बदलता।"]],
    ],
    sol: () => ["A catalyst lowers the activation energy of both directions equally: equilibrium is reached sooner, at the same position.", "उत्प्रेरक दोनों दिशाओं की सक्रियण ऊर्जा समान रूप से घटाता है: साम्य जल्दी, उसी स्थिति पर स्थापित होता है।"],
  },
  {
    c: ["the product is removed as it forms", "बनते ही उत्पाद को हटा दिया जाता है"],
    ok: ["The yield increases: the equilibrium shifts forward to replace the product", "लब्धि बढ़ती है: उत्पाद की पूर्ति के लिए साम्य आगे खिसकता है"],
    wrong: [
      [["No change: K stays constant", "कोई परिवर्तन नहीं: K स्थिर रहता है"], ["K is constant, but removing product makes Q < K, so more product forms.", "K स्थिर है, पर उत्पाद हटाने से Q < K हो जाता है, इसलिए अधिक उत्पाद बनता है।"]],
      [["The yield decreases: less product is present", "लब्धि घटती है: उत्पाद कम है"], ["The system responds by making more product.", "तंत्र अधिक उत्पाद बनाकर प्रतिक्रिया करता है।"]],
      [["The reaction stops because the product is gone", "उत्पाद हट जाने से अभिक्रिया रुक जाती है"], ["The forward reaction continues as long as reactants are present.", "जब तक अभिकारक हैं, अग्र अभिक्रिया चलती रहती है।"]],
    ],
    sol: () => ["Removing product lowers Q below K, so the forward reaction continues and more reactant is converted.", "उत्पाद हटाने से Q, K से कम हो जाता है, इसलिए अग्र अभिक्रिया चलती रहती है और अधिक अभिकारक बदलता है।"],
  },
];
const KTRAP = {
  ok: ["Lowering the temperature", "ताप घटाना"],
  wrong: [
    [["Raising the pressure", "दाब बढ़ाना"], ["Pressure shifts the position of equilibrium but does not change K.", "दाब साम्य की स्थिति खिसकाता है पर K को नहीं बदलता।"]],
    [["Adding a catalyst", "उत्प्रेरक मिलाना"], ["A catalyst changes neither K nor the yield.", "उत्प्रेरक न K बदलता है, न लब्धि।"]],
    [["Removing the product as it forms", "बनते ही उत्पाद हटाना"], ["This changes Q, not K.", "इससे Q बदलता है, K नहीं।"]],
  ],
};
// Gnojila: % N.
const FERT = [
  { n: ["urea", "यूरिया"], f: "CO(NH_2)_2", M: 60, N: 2 },
  { n: ["ammonium nitrate", "अमोनियम नाइट्रेट"], f: "NH_4NO_3", M: 80, N: 2 },
  { n: ["ammonium sulphate", "अमोनियम सल्फेट"], f: "(NH_4)_2SO_4", M: 132, N: 2 },
  { n: ["ammonium chloride", "अमोनियम क्लोराइड"], f: "NH_4Cl", M: 53.5, N: 1 },
];
if (molar({ C: 1, O: 1, N: 2, H: 4 }) !== 60 || molar({ N: 2, H: 8, S: 1, O: 4 }) !== 132 || molar({ N: 1, H: 4, Cl: 1 }) !== 53.5) throw new Error("FERT: molska masa");

const exgIndustrial = {
  id: "exg-kem-industrial",
  topics: [T("industrial-chemistry")],
  langs: ["en", "hi"],
  gen(level, r, _t, lang) {
    const L = bi(lang);
    if (level === 1) {
      const v = r.int(0, 3);
      if (v === 0) {
        const k = r.int(0, CATS.length - 1);
        const c = CATS[k];
        return baseTask({
          text: L(`Which catalyst is used in ${c.p[0]}?`, `${c.p[1]} में कौन-सा उत्प्रेरक प्रयुक्त होता है?`),
          answer: ch(r, L, c.c, CATS.filter((x) => x !== c).map((x) => [x.c, [`This catalyst is used in ${x.p[0]}.`, `यह उत्प्रेरक ${x.p[1]} में प्रयुक्त होता है।`]])),
          hint: L("Each important industrial process has its own catalyst.", "हर महत्वपूर्ण औद्योगिक प्रक्रम का अपना उत्प्रेरक होता है।"),
          solution: L(`${c.p[0]}: ${c.c[0]}.`, `${c.p[1]}: ${c.c[1]}।`),
        });
      }
      if (v === 1) {
        const VN = r.pick([10, 20, 25, 50, 100, 150]);
        const askH = r.int(0, 1) === 0;
        const ans = askH ? 3 * VN : 2 * VN;
        return task({
          text: askH
            ? L(`In the Haber process, $\\mathrm{N_2 + 3H_2 \\rightleftharpoons 2NH_3}$. What volume of hydrogen, in L, reacts completely with ${VN} L of nitrogen at the same temperature and pressure?`, `हेबर प्रक्रम की अभिक्रिया $\\mathrm{N_2 + 3H_2 \\rightleftharpoons 2NH_3}$ है। समान ताप और दाब पर ${VN} L नाइट्रोजन से पूर्णतः अभिक्रिया करने वाली हाइड्रोजन का आयतन L में ज्ञात कीजिए।`)
            : L(`In the Haber process, $\\mathrm{N_2 + 3H_2 \\rightleftharpoons 2NH_3}$. What volume of ammonia, in L, would form if ${VN} L of nitrogen reacted completely (same temperature and pressure)?`, `हेबर प्रक्रम की अभिक्रिया $\\mathrm{N_2 + 3H_2 \\rightleftharpoons 2NH_3}$ है। यदि ${VN} L नाइट्रोजन पूर्णतः अभिक्रिया करे, तो (समान ताप और दाब पर) कितने L अमोनिया बनेगी?`),
          answer: numM(ans, 0, askH ? [[VN / 3, L("Three volumes of H₂ are needed for each volume of N₂.", "N₂ के हर आयतन के लिए H₂ के तीन आयतन चाहिए।")], [2 * VN, L("2 is the coefficient of NH₃; H₂ has coefficient 3.", "2, NH₃ का गुणांक है; H₂ का गुणांक 3 है।")]] : [[3 * VN, L("3 is the coefficient of H₂; NH₃ has coefficient 2.", "3, H₂ का गुणांक है; NH₃ का गुणांक 2 है।")], [VN / 2, L("Each volume of N₂ gives two volumes of NH₃.", "N₂ का हर आयतन NH₃ के दो आयतन देता है।")]]),
          data: { given: [q("V(\\mathrm{N_2})", VN, "L")], find: [askH ? "V(\\mathrm{H_2})" : "V(\\mathrm{NH_3})"] },
          hint: L("For gases at the same temperature and pressure, volumes react in the ratio of the coefficients (Avogadro's law).", "समान ताप और दाब पर गैसों के आयतन गुणांकों के अनुपात में अभिक्रिया करते हैं (आवोगाद्रो नियम)।"),
          formula: "V(\\mathrm{N_2}) : V(\\mathrm{H_2}) : V(\\mathrm{NH_3}) = 1 : 3 : 2",
          solution: askH ? `$V(\\mathrm{H_2}) = 3 \\cdot ${VN}$\n$V(\\mathrm{H_2}) = ${ans}\\ \\text{L}$` : `$V(\\mathrm{NH_3}) = 2 \\cdot ${VN}$\n$V(\\mathrm{NH_3}) = ${ans}\\ \\text{L}$`,
        });
      }
      if (v === 2) {
        const m = r.pick([14, 28, 56, 70, 140, 280]);
        const ans = (m / 28) * 34;
        return task({
          text: L(`In the Haber process, $\\mathrm{N_2 + 3H_2 \\rightleftharpoons 2NH_3}$. What mass of ammonia, in kg, could be made from ${m} kg of nitrogen if all of it reacted? ($M(\\mathrm{N_2}) = 28$ g/mol, $M(\\mathrm{NH_3}) = 17$ g/mol)`, `हेबर प्रक्रम की अभिक्रिया $\\mathrm{N_2 + 3H_2 \\rightleftharpoons 2NH_3}$ है। यदि ${m} kg नाइट्रोजन पूरी अभिक्रिया करे, तो कितने kg अमोनिया बन सकती है? ($M(\\mathrm{N_2}) = 28$ g/mol, $M(\\mathrm{NH_3}) = 17$ g/mol)`),
          answer: numM(ans, 1, [[(m / 28) * 17, L("1 mol of N₂ gives 2 mol of NH₃.", "1 mol N₂ से 2 mol NH₃ बनती है।")], [(m * 17) / 28 / 2, L("Use the mole ratio N₂ : NH₃ = 1 : 2.", "मोल अनुपात N₂ : NH₃ = 1 : 2 लीजिए।")]]),
          data: { given: [q("m(\\mathrm{N_2})", m, "kg"), q("M(\\mathrm{N_2})", 28, "g/mol"), q("M(\\mathrm{NH_3})", 17, "g/mol")], find: ["m(\\mathrm{NH_3})"] },
          hint: L("Convert to moles (kmol), use the equation, convert back to mass.", "मोल (kmol) में बदलिए, समीकरण लगाइए, फिर द्रव्यमान में बदलिए।"),
          formula: "n(\\mathrm{NH_3}) = 2\\,n(\\mathrm{N_2})",
          solution: `$n(\\mathrm{N_2}) = \\dfrac{${m}}{28} = ${en(m / 28)}\\ \\text{kmol}$\n$n(\\mathrm{NH_3}) = 2 \\cdot ${en(m / 28)} = ${en(m / 14)}\\ \\text{kmol}$\n$m(\\mathrm{NH_3}) = ${en(m / 14)} \\cdot 17 = ${en(ans)}\\ \\text{kg}$`,
        });
      }
      const [me, mh, mk] = r.pick(METALS);
      return baseTask({
        text: L(`Which method is used to obtain ${me} from its ore?`, `${mh} को उसके अयस्क से प्राप्त करने के लिए कौन-सी विधि प्रयुक्त होती है?`),
        answer: ch(r, L, METHODS[mk], Object.keys(METHODS).filter((x) => x !== mk).map((x) => [METHODS[x], METHOD_WHY[x]])),
        hint: L("The method depends on the metal's position in the reactivity series.", "विधि सक्रियता श्रेणी में धातु की स्थिति पर निर्भर करती है।"),
        solution: L(`${me[0].toUpperCase() + me.slice(1)}: ${METHODS[mk][0].toLowerCase()}. ${METHOD_WHY[mk][0]}`, `${mh}: ${METHODS[mk][1]}। ${METHOD_WHY[mk][1]}`),
      });
    }
    if (level === 2) {
      const v = r.int(0, 4);
      if (v === 0) {
        const P = r.int(0, 1) === 0 ? PROC.haber : PROC.contact;
        const it = r.pick(LECH);
        return baseTask({
          text: L(`For ${P.n[0]}, $${P.eq}$, $\\Delta H = ${P.dH}$ kJ/mol. What happens to the equilibrium yield of ${P.prod[0]} when ${it.c[0]}?`, `${P.n[1]} के लिए $${P.eq}$, $\\Delta H = ${P.dH}$ kJ/mol। जब ${it.c[1]}, तो ${P.prod[1]} की साम्य लब्धि पर क्या प्रभाव पड़ता है?`),
          answer: ch(r, L, it.ok, it.wrong),
          hint: L("Le Chatelier: the equilibrium shifts to oppose the change.", "ले शातेलिए सिद्धांत: साम्य परिवर्तन का विरोध करने वाली दिशा में खिसकता है।"),
          solution: L(...it.sol(P.gas)),
        });
      }
      if (v === 1) {
        const haber = r.int(0, 1) === 0;
        const m = r.pick(haber ? [28, 56, 140, 280] : [64, 128, 320, 640]);
        const y0 = haber ? r.pick([12, 15, 18, 20, 25, 30]) : r.pick([90, 94, 96, 97, 98]);
        const theo = haber ? (m / 28) * 34 : (m / 64) * 80;
        const act = Math.round(theo * y0) / 100;
        const y = (100 * act) / theo;
        return task({
          text: haber
            ? L(`In one pass through a Haber converter, ${m} kg of nitrogen could at most give ${en(theo)} kg of ammonia, but only ${en(act)} kg is obtained. Find the percentage yield.${RT(y, 1, lang)}`, `हेबर परिवर्तक से एक बार गुजरने पर ${m} kg नाइट्रोजन से अधिकतम ${en(theo)} kg अमोनिया बन सकती है, पर केवल ${en(act)} kg प्राप्त होती है। प्रतिशत लब्धि ज्ञात कीजिए।${RT(y, 1, lang)}`)
            : L(`In a Contact plant, ${m} kg of SO₂ is oxidised and ${en(act)} kg of SO₃ is obtained. Find the percentage yield. ($M(\\mathrm{SO_2}) = 64$ g/mol, $M(\\mathrm{SO_3}) = 80$ g/mol)${RT(y, 1, lang)}`, `एक संपर्क संयंत्र में ${m} kg SO₂ का ऑक्सीकरण होता है और ${en(act)} kg SO₃ प्राप्त होती है। प्रतिशत लब्धि ज्ञात कीजिए। ($M(\\mathrm{SO_2}) = 64$ g/mol, $M(\\mathrm{SO_3}) = 80$ g/mol)${RT(y, 1, lang)}`),
          answer: numM(y, 1, haber ? [[(100 * theo) / act, L("Yield = actual ÷ theoretical × 100; the ratio is inverted.", "लब्धि = वास्तविक ÷ सैद्धांतिक × 100; अनुपात उल्टा है।")], [(100 * act) / m, L("Compare with the theoretical mass of ammonia, not the mass of nitrogen.", "नाइट्रोजन के द्रव्यमान से नहीं, अमोनिया के सैद्धांतिक द्रव्यमान से तुलना कीजिए।")]] : [[(100 * act) / m, L("First find the theoretical mass of SO₃ from the mass of SO₂.", "पहले SO₂ के द्रव्यमान से SO₃ का सैद्धांतिक द्रव्यमान ज्ञात कीजिए।")], [(100 * theo) / act, L("Yield = actual ÷ theoretical × 100.", "लब्धि = वास्तविक ÷ सैद्धांतिक × 100।")]]),
          data: haber
            ? { given: [q("m_{theo}", theo, "kg"), q("m_{act}", act, "kg")], find: ["\\eta"] }
            : { given: [q("m(\\mathrm{SO_2})", m, "kg"), q("m(\\mathrm{SO_3})", act, "kg"), q("M(\\mathrm{SO_2})", 64, "g/mol"), q("M(\\mathrm{SO_3})", 80, "g/mol")], find: ["\\eta"] },
          hint: L("Percentage yield compares the actual mass with the theoretical mass.", "प्रतिशत लब्धि वास्तविक द्रव्यमान की सैद्धांतिक द्रव्यमान से तुलना करती है।"),
          formula: "\\eta = \\dfrac{m_{act}}{m_{theo}} \\times 100\\,\\%",
          solution: haber
            ? `$\\eta = \\dfrac{${en(act)}}{${en(theo)}} \\times 100$\n$\\eta ${ev(y, 1)}\\,\\%$`
            : `$n(\\mathrm{SO_3}) = n(\\mathrm{SO_2}) = \\dfrac{${m}}{64} = ${en(m / 64)}\\ \\text{kmol}$\n$m_{theo} = ${en(m / 64)} \\cdot 80 = ${en(theo)}\\ \\text{kg}$\n$\\eta = \\dfrac{${en(act)}}{${en(theo)}} \\times 100 ${ev(y, 1)}\\,\\%$`,
        });
      }
      if (v === 2) {
        const c = r.int(0, 2);
        const CASES = [
          { e: ["sulphur", "सल्फर"], pe: ["sulphuric acid", "सल्फ्यूरिक अम्ल"], Mi: 32, Mo: 98, k: 1, fi: "S", fo: "H_2SO_4", ms: [8, 16, 32, 48, 64] },
          { e: ["iron(III) oxide", "आयरन(III) ऑक्साइड"], pe: ["iron", "लोहा"], Mi: 160, Mo: 56, k: 2, fi: "Fe_2O_3", fo: "Fe", ms: [16, 40, 80, 100, 200] },
          { e: ["aluminium oxide", "ऐलुमिनियम ऑक्साइड"], pe: ["aluminium", "ऐलुमिनियम"], Mi: 102, Mo: 27, k: 2, fi: "Al_2O_3", fo: "Al", ms: [51, 102, 204, 255, 510] },
        ];
        const K = CASES[c];
        const m = r.pick(K.ms);
        const ans = (m / K.Mi) * K.k * K.Mo;
        return task({
          text: L(`What is the maximum mass of ${K.pe[0]}, in tonnes, that can be obtained from ${m} t of ${K.e[0]} ($\\mathrm{${K.fi}}$, M = ${K.Mi} g/mol)? M($\\mathrm{${K.fo}}$) = ${K.Mo} g/mol.${RT(ans, 2, lang)}`, `${m} t ${K.e[1]} ($\\mathrm{${K.fi}}$, M = ${K.Mi} g/mol) से अधिकतम कितने टन ${K.pe[1]} प्राप्त हो सकता है? M($\\mathrm{${K.fo}}$) = ${K.Mo} g/mol।${RT(ans, 2, lang)}`),
          answer: numM(ans, 2, K.k === 2 ? [[(m / K.Mi) * K.Mo, L("Each formula unit of the oxide contains 2 metal atoms.", "ऑक्साइड की हर सूत्र इकाई में धातु के 2 परमाणु हैं।")], [(m * K.Mi) / K.Mo, L("The ratio of molar masses is inverted.", "मोलर द्रव्यमानों का अनुपात उल्टा है।")]] : [[(m * K.Mi) / K.Mo, L("The ratio of molar masses is inverted: multiply by 98/32.", "मोलर द्रव्यमानों का अनुपात उल्टा है: 98/32 से गुणा कीजिए।")], [m, L("The mass changes: 1 mol S (32 g) gives 1 mol H₂SO₄ (98 g).", "द्रव्यमान बदलता है: 1 mol S (32 g) से 1 mol H₂SO₄ (98 g) बनता है।")]]),
          data: { given: [q("m", m, "t"), q(`M(\\mathrm{${K.fi}})`, K.Mi, "g/mol"), q(`M(\\mathrm{${K.fo}})`, K.Mo, "g/mol")], find: [`m(\\mathrm{${K.fo}})`] },
          hint: K.k === 2 ? L("One formula unit of the oxide gives two metal atoms.", "ऑक्साइड की एक सूत्र इकाई से धातु के दो परमाणु मिलते हैं।") : L("All the sulphur ends up in H₂SO₄: S → SO₂ → SO₃ → H₂SO₄.", "सारा सल्फर H₂SO₄ में पहुँचता है: S → SO₂ → SO₃ → H₂SO₄।"),
          formula: `n(\\mathrm{${K.fo}}) = ${K.k === 2 ? "2\\," : ""}n(\\mathrm{${K.fi}})`,
          solution: `$n = \\dfrac{${m}}{${K.Mi}} ${ev(m / K.Mi, 4)}\\ \\text{Mmol}$\n$m(\\mathrm{${K.fo}}) = ${K.k === 2 ? "2 \\cdot " : ""}${fx(m / K.Mi, 4)} \\cdot ${K.Mo} ${ev(ans, 2)}\\ \\text{t}$`,
        });
      }
      if (v === 3) {
        const F = r.pick(FERT);
        const pct = (100 * 14 * F.N) / F.M;
        return task({
          text: L(`Ammonia from the Haber process is used to make fertilisers. Find the percentage by mass of nitrogen in ${F.n[0]}, $\\mathrm{${F.f}}$ (M = ${en(F.M)} g/mol, N = 14).${RT(pct, 2, lang)}`, `हेबर प्रक्रम की अमोनिया से उर्वरक बनाए जाते हैं। ${F.n[1]}, $\\mathrm{${F.f}}$ (M = ${en(F.M)} g/mol, N = 14) में नाइट्रोजन का द्रव्यमान प्रतिशत ज्ञात कीजिए।${RT(pct, 2, lang)}`),
          answer: numM(pct, 2, F.N > 1 ? [[(100 * 14) / F.M, L(`There are ${F.N} N atoms in each formula unit.`, `हर सूत्र इकाई में ${F.N} N परमाणु हैं।`)]] : [[(100 * 28) / F.M, L("There is only one N atom in each formula unit.", "हर सूत्र इकाई में केवल एक N परमाणु है।")]]),
          data: { given: [q("M", F.M, "g/mol"), q("A_r(\\mathrm{N})", 14)], find: ["w(\\mathrm{N})"] },
          hint: L("Count the nitrogen atoms in the formula.", "सूत्र में नाइट्रोजन परमाणु गिनिए।"),
          formula: "w(\\mathrm{N}) = \\dfrac{n_{\\mathrm{N}} \\cdot 14}{M} \\times 100\\,\\%",
          solution: `$w(\\mathrm{N}) = \\dfrac{${F.N} \\cdot 14}{${en(F.M)}} \\times 100$\n$w(\\mathrm{N}) ${ev(pct, 2)}\\,\\%$`,
        });
      }
      return concept(r, L, r.pick(IND_C2));
    }
    // level 3
    const v = r.int(0, 3);
    if (v === 0) {
      const mN = r.pick([28, 56, 84, 140]);
      const mH = r.pick([3, 6, 9, 12, 15, 24, 30]);
      const y = r.pick([15, 20, 25, 30]);
      const nN = mN / 28;
      const nH = mH / 2;
      const nNH3 = 2 * Math.min(nN, nH / 3);
      const theo = nNH3 * 17;
      const act = (theo * y) / 100;
      const limH = nH / 3 < nN;
      const other = 2 * (limH ? nN : nH / 3) * 17 * (y / 100);
      return task({
        text: L(`A Haber reactor is fed with ${mN} kg of N₂ and ${mH} kg of H₂. Only ${y}% of the limiting reactant is converted into ammonia. What mass of ammonia, in kg, is obtained? ($\\mathrm{N_2 + 3H_2 \\rightleftharpoons 2NH_3}$; N = 14, H = 1)${RT(act, 2, lang)}`, `एक हेबर अभिक्रियक में ${mN} kg N₂ और ${mH} kg H₂ डाली जाती हैं। सीमांत अभिकारक का केवल ${y}% अमोनिया में बदलता है। कितने kg अमोनिया प्राप्त होती है? ($\\mathrm{N_2 + 3H_2 \\rightleftharpoons 2NH_3}$; N = 14, H = 1)${RT(act, 2, lang)}`),
        answer: numM(act, 2, [[other, L("Find the limiting reactant first: compare n(H₂)/3 with n(N₂).", "पहले सीमांत अभिकारक ज्ञात कीजिए: n(H₂)/3 की n(N₂) से तुलना कीजिए।")], [theo, L(`Only ${y}% is converted; multiply by the yield.`, `केवल ${y}% बदलता है; लब्धि से गुणा कीजिए।`)]]),
        data: { given: [q("m(\\mathrm{N_2})", mN, "kg"), q("m(\\mathrm{H_2})", mH, "kg"), q("\\eta", `${y}\\%`)], find: ["m(\\mathrm{NH_3})"] },
        hint: L("Convert both masses to kmol and divide by their coefficients to find the limiting reactant.", "दोनों द्रव्यमानों को kmol में बदलिए और गुणांकों से भाग देकर सीमांत अभिकारक ज्ञात कीजिए।"),
        formula: ["n(\\mathrm{NH_3}) = 2\\min\\!\\left(n(\\mathrm{N_2}),\\ \\tfrac{1}{3}n(\\mathrm{H_2})\\right)", "m = n M \\cdot \\dfrac{\\eta}{100}"],
        solution: [
          `$n(\\mathrm{N_2}) = \\dfrac{${mN}}{28} = ${en(nN)}\\ \\text{kmol},\\quad n(\\mathrm{H_2}) = \\dfrac{${mH}}{2} = ${en(nH)}\\ \\text{kmol}$`,
          L(`$\\tfrac{1}{3}n(\\mathrm{H_2}) ${ev(nH / 3, 3)}$ ${limH ? "<" : nH / 3 === nN ? "=" : ">"} $n(\\mathrm{N_2})$, so ${limH ? "H₂" : nH / 3 === nN ? "neither (exact ratio); use either" : "N₂"} is limiting.`, `$\\tfrac{1}{3}n(\\mathrm{H_2}) ${ev(nH / 3, 3)}$ ${limH ? "<" : nH / 3 === nN ? "=" : ">"} $n(\\mathrm{N_2})$, इसलिए ${limH ? "H₂" : nH / 3 === nN ? "दोनों ठीक अनुपात में हैं; कोई भी लीजिए" : "N₂"} सीमांत है।`),
          `$m_{theo} = ${fx(nNH3, 4)} \\cdot 17 ${ev(theo, 2)}\\ \\text{kg}$`,
          `$m = ${fx(theo, 2)} \\cdot ${en(y / 100)} ${ev(act, 2)}\\ \\text{kg}$`,
        ].join("\n"),
      });
    }
    if (v === 1) {
      const m = r.pick([16, 32, 48, 80, 100, 160]);
      const y = r.pick([90, 95, 96, 98]);
      const ans = (m / 32) * 98 * (y / 100);
      const fromPyr = r.int(0, 2) === 0;
      if (fromPyr) {
        const mp = r.pick([60, 120, 240, 300]);
        const a2 = (mp / 120) * 2 * 98 * (y / 100);
        return task({
          text: L(`Sulphuric acid is made from iron pyrite, FeS₂ (M = 120 g/mol); all its sulphur is turned into H₂SO₄ (M = 98 g/mol) by the Contact process with an overall yield of ${y}%. What mass of H₂SO₄, in tonnes, is obtained from ${mp} t of FeS₂?${RT(a2, 2, lang)}`, `सल्फ्यूरिक अम्ल आयरन पाइराइट, FeS₂ (M = 120 g/mol) से बनाया जाता है; संपर्क प्रक्रम द्वारा इसका सारा सल्फर ${y}% समग्र लब्धि के साथ H₂SO₄ (M = 98 g/mol) में बदलता है। ${mp} t FeS₂ से कितने टन H₂SO₄ प्राप्त होगा?${RT(a2, 2, lang)}`),
          answer: numM(a2, 2, [[(mp / 120) * 98 * (y / 100), L("Each FeS₂ contains 2 S atoms, so it gives 2 H₂SO₄.", "हर FeS₂ में 2 S परमाणु हैं, इसलिए उससे 2 H₂SO₄ बनते हैं।")], [(mp / 120) * 2 * 98, L(`The overall yield is ${y}%; multiply by it.`, `समग्र लब्धि ${y}% है; उससे गुणा कीजिए।`)]]),
          data: { given: [q("m(\\mathrm{FeS_2})", mp, "t"), q("M(\\mathrm{FeS_2})", 120, "g/mol"), q("M(\\mathrm{H_2SO_4})", 98, "g/mol"), q("\\eta", `${y}\\%`)], find: ["m(\\mathrm{H_2SO_4})"] },
          hint: L("Track the sulphur atoms: FeS₂ → 2S → 2H₂SO₄.", "सल्फर परमाणुओं का हिसाब रखिए: FeS₂ → 2S → 2H₂SO₄।"),
          formula: "n(\\mathrm{H_2SO_4}) = 2\\,n(\\mathrm{FeS_2})",
          solution: `$n(\\mathrm{FeS_2}) = \\dfrac{${mp}}{120} = ${en(mp / 120)}\\ \\text{Mmol}$\n$n(\\mathrm{H_2SO_4}) = 2 \\cdot ${en(mp / 120)} = ${en(mp / 60)}\\ \\text{Mmol}$\n$m = ${en(mp / 60)} \\cdot 98 \\cdot ${en(y / 100)} ${ev(a2, 2)}\\ \\text{t}$`,
        });
      }
      return task({
        text: L(`A Contact plant burns ${m} t of sulphur per day. The overall conversion of S into H₂SO₄ (S → SO₂ → SO₃ → H₂SO₄) is ${y}%. What mass of H₂SO₄, in tonnes, is produced per day? (S = 32, H₂SO₄ = 98 g/mol)${RT(ans, 2, lang)}`, `एक संपर्क संयंत्र प्रतिदिन ${m} t सल्फर जलाता है। S का H₂SO₄ में समग्र रूपांतरण (S → SO₂ → SO₃ → H₂SO₄) ${y}% है। प्रतिदिन कितने टन H₂SO₄ बनता है? (S = 32, H₂SO₄ = 98 g/mol)${RT(ans, 2, lang)}`),
        answer: numM(ans, 2, [[(m / 32) * 98, L(`Only ${y}% is converted; multiply by the yield.`, `केवल ${y}% बदलता है; लब्धि से गुणा कीजिए।`)], [((m * 32) / 98) * (y / 100), L("The ratio of molar masses is inverted: multiply by 98/32.", "मोलर द्रव्यमानों का अनुपात उल्टा है: 98/32 से गुणा कीजिए।")]]),
        data: { given: [q("m(\\mathrm{S})", m, "t"), q("\\eta", `${y}\\%`), q("M(\\mathrm{S})", 32, "g/mol"), q("M(\\mathrm{H_2SO_4})", 98, "g/mol")], find: ["m(\\mathrm{H_2SO_4})"] },
        hint: L("1 mol of S ends up as 1 mol of H₂SO₄.", "1 mol S अंत में 1 mol H₂SO₄ बनता है।"),
        formula: "m(\\mathrm{H_2SO_4}) = \\dfrac{m(\\mathrm{S})}{32} \\cdot 98 \\cdot \\dfrac{\\eta}{100}",
        solution: `$n(\\mathrm{S}) = \\dfrac{${m}}{32} = ${en(m / 32)}\\ \\text{Mmol}$\n$m_{theo} = ${en(m / 32)} \\cdot 98 = ${en((m / 32) * 98)}\\ \\text{t}$\n$m = ${en((m / 32) * 98)} \\cdot ${en(y / 100)} ${ev(ans, 2)}\\ \\text{t}$`,
      });
    }
    if (v === 2) {
      const P = r.int(0, 1) === 0 ? PROC.haber : PROC.contact;
      return baseTask({
        text: L(`For ${P.n[0]}, $${P.eq}$, $\\Delta H = ${P.dH}$ kJ/mol. Which change makes the equilibrium constant K larger?`, `${P.n[1]} के लिए $${P.eq}$, $\\Delta H = ${P.dH}$ kJ/mol। किस परिवर्तन से साम्य स्थिरांक K बढ़ता है?`),
        answer: ch(r, L, KTRAP.ok, KTRAP.wrong),
        hint: L("K changes only with temperature. Which direction is exothermic?", "K केवल ताप से बदलता है। कौन-सी दिशा ऊष्माक्षेपी है?"),
        solution: L("The forward reaction is exothermic (ΔH < 0). Lowering the temperature favours it, so K increases. Pressure, catalysts and removing product do not change K.", "अग्र अभिक्रिया ऊष्माक्षेपी है (ΔH < 0)। ताप घटाने से उसका पक्ष होता है, इसलिए K बढ़ता है। दाब, उत्प्रेरक और उत्पाद हटाने से K नहीं बदलता।"),
      });
    }
    const fe = r.int(0, 1) === 0;
    const ore = r.pick([10, 20, 50, 100]);
    const pc = r.pick(fe ? [60, 70, 75, 80] : [50, 55, 60, 65]);
    const ans = fe ? ((ore * pc) / 100 / 160) * 112 : ((ore * pc) / 100 / 102) * 54;
    return task({
      text: fe
        ? L(`A haematite ore contains ${pc}% Fe₂O₃ by mass. What mass of iron, in tonnes, can at most be obtained from ${ore} t of this ore? (Fe = 56, O = 16)${RT(ans, 2, lang)}`, `एक हेमेटाइट अयस्क में द्रव्यमान के अनुसार ${pc}% Fe₂O₃ है। इस अयस्क के ${ore} t से अधिकतम कितने टन लोहा प्राप्त हो सकता है? (Fe = 56, O = 16)${RT(ans, 2, lang)}`)
        : L(`A bauxite sample contains ${pc}% Al₂O₃ by mass. What mass of aluminium, in tonnes, can at most be obtained from ${ore} t of it by electrolysis? (Al = 27, O = 16)${RT(ans, 2, lang)}`, `एक बॉक्साइट नमूने में द्रव्यमान के अनुसार ${pc}% Al₂O₃ है। विद्युत-अपघटन द्वारा इसके ${ore} t से अधिकतम कितने टन ऐलुमिनियम प्राप्त हो सकता है? (Al = 27, O = 16)${RT(ans, 2, lang)}`),
      answer: numM(ans, 2, fe
        ? [[(ore / 160) * 112, L(`Only ${pc}% of the ore is Fe₂O₃.`, `अयस्क का केवल ${pc}% Fe₂O₃ है।`)], [((ore * pc) / 100 / 160) * 56, L("Each Fe₂O₃ contains 2 Fe atoms.", "हर Fe₂O₃ में 2 Fe परमाणु हैं।")]]
        : [[(ore / 102) * 54, L(`Only ${pc}% of the sample is Al₂O₃.`, `नमूने का केवल ${pc}% Al₂O₃ है।`)], [((ore * pc) / 100 / 102) * 27, L("Each Al₂O₃ contains 2 Al atoms.", "हर Al₂O₃ में 2 Al परमाणु हैं।")]]),
      data: { given: [q("m_{ore}", ore, "t"), q("w", `${pc}\\%`)], find: [fe ? "m(\\mathrm{Fe})" : "m(\\mathrm{Al})"] },
      hint: L("First find the mass of the pure oxide, then the fraction of it that is metal.", "पहले शुद्ध ऑक्साइड का द्रव्यमान, फिर उसमें धातु का भाग ज्ञात कीजिए।"),
      formula: fe ? "m(\\mathrm{Fe}) = m(\\mathrm{Fe_2O_3}) \\cdot \\dfrac{2 \\cdot 56}{160}" : "m(\\mathrm{Al}) = m(\\mathrm{Al_2O_3}) \\cdot \\dfrac{2 \\cdot 27}{102}",
      solution: fe
        ? `$M(\\mathrm{Fe_2O_3}) = 2 \\cdot 56 + 3 \\cdot 16 = 160\\ \\text{g/mol}$\n$m(\\mathrm{Fe_2O_3}) = ${ore} \\cdot ${en(pc / 100)} = ${en((ore * pc) / 100)}\\ \\text{t}$\n$m(\\mathrm{Fe}) = ${en((ore * pc) / 100)} \\cdot \\dfrac{112}{160} ${ev(ans, 2)}\\ \\text{t}$`
        : `$M(\\mathrm{Al_2O_3}) = 2 \\cdot 27 + 3 \\cdot 16 = 102\\ \\text{g/mol}$\n$m(\\mathrm{Al_2O_3}) = ${ore} \\cdot ${en(pc / 100)} = ${en((ore * pc) / 100)}\\ \\text{t}$\n$m(\\mathrm{Al}) = ${en((ore * pc) / 100)} \\cdot \\dfrac{54}{102} ${ev(ans, 2)}\\ \\text{t}$`,
    });
  },
};

// ---------- 3. Environmental chemistry ----------
const GHG = [["Carbon dioxide (CO₂)", "कार्बन डाइऑक्साइड (CO₂)"], ["Methane (CH₄)", "मेथेन (CH₄)"], ["Nitrous oxide (N₂O)", "नाइट्रस ऑक्साइड (N₂O)"], ["Chlorofluorocarbons (CFCs)", "क्लोरोफ्लुओरोकार्बन (CFC)"], ["Water vapour", "जल वाष्प"]];
const NOT_GHG = [["Nitrogen (N₂)", "नाइट्रोजन (N₂)"], ["Oxygen (O₂)", "ऑक्सीजन (O₂)"], ["Argon (Ar)", "आर्गन (Ar)"]];
const ENV_C1 = [
  {
    q: ["Which substances are mainly responsible for the depletion of the ozone layer?", "ओज़ोन परत के क्षय के लिए मुख्य रूप से कौन-से पदार्थ उत्तरदायी हैं?"],
    ok: ["Chlorofluorocarbons (CFCs)", "क्लोरोफ्लुओरोकार्बन (CFC)"],
    wrong: [
      [["Carbon dioxide", "कार्बन डाइऑक्साइड"], ["CO₂ is a greenhouse gas; it does not destroy ozone.", "CO₂ ग्रीनहाउस गैस है; यह ओज़ोन को नष्ट नहीं करती।"]],
      [["Sulphur dioxide", "सल्फर डाइऑक्साइड"], ["SO₂ mainly causes acid rain.", "SO₂ मुख्यतः अम्ल वर्षा का कारण है।"]],
      [["Carbon monoxide", "कार्बन मोनोऑक्साइड"], ["CO is poisonous to people but is not the main cause of ozone depletion.", "CO मनुष्यों के लिए विषैली है, पर ओज़ोन क्षय का मुख्य कारण नहीं है।"]],
    ],
    hint: ["These compounds were used in refrigerators and aerosol sprays.", "ये यौगिक रेफ्रिजरेटर और एरोसोल स्प्रे में प्रयुक्त होते थे।"],
    sol: ["In the stratosphere UV light splits CFCs and releases chlorine atoms, which destroy ozone: Cl + O₃ → ClO + O₂.", "समतापमंडल में पराबैंगनी प्रकाश CFC को तोड़कर क्लोरीन परमाणु मुक्त करता है, जो ओज़ोन नष्ट करते हैं: Cl + O₃ → ClO + O₂।"],
  },
  {
    q: ["Where is the ozone layer, and why is it important?", "ओज़ोन परत कहाँ है, और यह क्यों महत्वपूर्ण है?"],
    ok: ["In the stratosphere; it absorbs most of the Sun's harmful ultraviolet radiation", "समतापमंडल में; यह सूर्य के अधिकांश हानिकारक पराबैंगनी विकिरण को अवशोषित करती है"],
    wrong: [
      [["In the troposphere; it absorbs infrared radiation and warms the Earth", "क्षोभमंडल में; यह अवरक्त विकिरण अवशोषित करके पृथ्वी को गर्म करती है"], ["The protective ozone layer is in the stratosphere and its key role is absorbing UV.", "सुरक्षात्मक ओज़ोन परत समतापमंडल में है और इसकी मुख्य भूमिका UV अवशोषित करना है।"]],
      [["In the stratosphere; it absorbs visible light", "समतापमंडल में; यह दृश्य प्रकाश अवशोषित करती है"], ["Visible light passes through; ozone absorbs ultraviolet.", "दृश्य प्रकाश पार हो जाता है; ओज़ोन पराबैंगनी अवशोषित करती है।"]],
      [["Near the ground; it supplies oxygen for breathing", "पृथ्वी के पास; यह साँस के लिए ऑक्सीजन देती है"], ["Ozone near the ground is a pollutant; we breathe O₂, not O₃.", "पृथ्वी के पास ओज़ोन प्रदूषक है; हम O₂ साँस लेते हैं, O₃ नहीं।"]],
    ],
    hint: ["Think of sunburn and skin cancer.", "धूप से झुलसने और त्वचा कैंसर के बारे में सोचिए।"],
    sol: ["The ozone layer lies in the stratosphere (about 15–50 km up) and shields living things from harmful UV radiation.", "ओज़ोन परत समतापमंडल (लगभग 15–50 km ऊँचाई) में है और सजीवों को हानिकारक UV विकिरण से बचाती है।"],
  },
  {
    q: ["Which gases are mainly responsible for acid rain?", "अम्ल वर्षा के लिए मुख्य रूप से कौन-सी गैसें उत्तरदायी हैं?"],
    ok: ["Oxides of sulphur and nitrogen (SO₂, NO₂)", "सल्फर और नाइट्रोजन के ऑक्साइड (SO₂, NO₂)"],
    wrong: [
      [["Carbon dioxide and methane", "कार्बन डाइऑक्साइड और मेथेन"], ["CO₂ only makes normal rain slightly acidic (pH about 5.6); methane is not acidic.", "CO₂ सामान्य वर्षा को केवल थोड़ा अम्लीय (pH लगभग 5.6) बनाती है; मेथेन अम्लीय नहीं है।"]],
      [["Carbon monoxide and ozone", "कार्बन मोनोऑक्साइड और ओज़ोन"], ["CO and O₃ do not form strong acids with water.", "CO और O₃ जल के साथ प्रबल अम्ल नहीं बनाते।"]],
      [["CFCs and nitrogen", "CFC और नाइट्रोजन"], ["CFCs deplete ozone; N₂ is unreactive.", "CFC ओज़ोन का क्षय करते हैं; N₂ अक्रिय है।"]],
    ],
    hint: ["Which oxides form strong acids such as H₂SO₄ and HNO₃?", "कौन-से ऑक्साइड H₂SO₄ और HNO₃ जैसे प्रबल अम्ल बनाते हैं?"],
    sol: ["SO₂ (from burning coal) and NO₂ (from vehicles) are oxidised in air and dissolve in rain to give H₂SO₄ and HNO₃, so the rain pH falls below 5.6.", "SO₂ (कोयला जलने से) और NO₂ (वाहनों से) वायु में ऑक्सीकृत होकर वर्षा जल में घुलते हैं और H₂SO₄ व HNO₃ बनाते हैं, इसलिए वर्षा का pH 5.6 से नीचे चला जाता है।"],
  },
  {
    q: ["What does the BOD (biochemical oxygen demand) of a water sample measure?", "जल के नमूने की BOD (जैव रासायनिक ऑक्सीजन माँग) क्या मापती है?"],
    ok: ["The oxygen needed by bacteria to break down the organic matter in a given volume of water", "किसी दिए गए आयतन के जल में कार्बनिक पदार्थों को विघटित करने के लिए जीवाणुओं को आवश्यक ऑक्सीजन"],
    wrong: [
      [["The oxygen already dissolved in the water", "जल में पहले से घुली ऑक्सीजन"], ["That is dissolved oxygen (DO), not BOD.", "यह घुलित ऑक्सीजन (DO) है, BOD नहीं।"]],
      [["The oxygen needed by fish to survive", "मछलियों के जीवित रहने के लिए आवश्यक ऑक्सीजन"], ["BOD is the oxygen used by microorganisms decomposing organic waste.", "BOD कार्बनिक अपशिष्ट विघटित करने वाले सूक्ष्मजीवों द्वारा प्रयुक्त ऑक्सीजन है।"]],
      [["The amount of oxygen released by water plants", "जलीय पौधों द्वारा मुक्त ऑक्सीजन की मात्रा"], ["BOD measures oxygen consumed, not produced.", "BOD उपभोग की गई ऑक्सीजन मापती है, उत्पन्न नहीं।"]],
    ],
    hint: ["More organic waste means more work for bacteria.", "अधिक कार्बनिक अपशिष्ट का अर्थ है जीवाणुओं के लिए अधिक काम।"],
    sol: ["BOD is the oxygen consumed by microorganisms to decompose organic matter. A high BOD means the water is heavily polluted with organic waste.", "BOD वह ऑक्सीजन है जिसे सूक्ष्मजीव कार्बनिक पदार्थ विघटित करने में खपाते हैं। अधिक BOD का अर्थ है जल कार्बनिक अपशिष्ट से अत्यधिक प्रदूषित है।"],
  },
];
const ENV_C2 = [
  {
    q: ["Why is carbon monoxide so poisonous?", "कार्बन मोनोऑक्साइड इतनी विषैली क्यों है?"],
    ok: ["It binds to haemoglobin much more strongly than oxygen, forming carboxyhaemoglobin, so less oxygen reaches the body", "यह ऑक्सीजन की तुलना में हीमोग्लोबिन से कहीं अधिक प्रबलता से जुड़कर कार्बोक्सीहीमोग्लोबिन बनाती है, इसलिए शरीर तक कम ऑक्सीजन पहुँचती है"],
    wrong: [
      [["It makes the blood acidic like CO₂", "यह CO₂ की तरह रक्त को अम्लीय बनाती है"], ["CO is a neutral oxide; its danger is binding to haemoglobin.", "CO उदासीन ऑक्साइड है; इसका खतरा हीमोग्लोबिन से जुड़ना है।"]],
      [["It destroys the ozone in the lungs", "यह फेफड़ों में ओज़ोन नष्ट करती है"], ["There is no ozone layer in the lungs; CO blocks oxygen transport.", "फेफड़ों में ओज़ोन परत नहीं होती; CO ऑक्सीजन के परिवहन को रोकती है।"]],
      [["It reacts with water in the body to form an acid", "यह शरीर के जल से अभिक्रिया करके अम्ल बनाती है"], ["CO does not form an acid with water.", "CO जल के साथ अम्ल नहीं बनाती।"]],
    ],
    hint: ["Think about how oxygen is carried in the blood.", "सोचिए कि रक्त में ऑक्सीजन का परिवहन कैसे होता है।"],
    sol: ["CO forms a stable complex with haemoglobin (carboxyhaemoglobin), so the blood carries less oxygen; this can cause headache, unconsciousness and death.", "CO हीमोग्लोबिन के साथ स्थायी संकुल (कार्बोक्सीहीमोग्लोबिन) बनाती है, इसलिए रक्त कम ऑक्सीजन ले जाता है; इससे सिरदर्द, बेहोशी और मृत्यु तक हो सकती है।"],
  },
  {
    q: ["Fertiliser and detergent run-off rich in phosphates and nitrates enters a lake. What happens?", "फॉस्फेट और नाइट्रेट से भरपूर उर्वरक और अपमार्जक का बहाव एक झील में पहुँचता है। क्या होता है?"],
    ok: ["Algae grow rapidly; when they die and decay, dissolved oxygen falls and fish die (eutrophication)", "शैवाल तेजी से बढ़ते हैं; उनके मरने और सड़ने पर घुलित ऑक्सीजन घटती है और मछलियाँ मरती हैं (सुपोषण)"],
    wrong: [
      [["The extra nutrients raise the dissolved oxygen and fish thrive", "अतिरिक्त पोषक तत्व घुलित ऑक्सीजन बढ़ाते हैं और मछलियाँ पनपती हैं"], ["Decay of the extra algae uses up oxygen, so DO falls.", "अतिरिक्त शैवाल के सड़ने में ऑक्सीजन खपती है, इसलिए DO घटती है।"]],
      [["The lake water becomes strongly acidic", "झील का जल प्रबल अम्लीय हो जाता है"], ["The main effect is oxygen depletion through algal growth, not acidity.", "मुख्य प्रभाव शैवाल वृद्धि के कारण ऑक्सीजन की कमी है, अम्लता नहीं।"]],
      [["Nothing changes, because phosphates are insoluble", "कुछ नहीं बदलता, क्योंकि फॉस्फेट अविलेय हैं"], ["The phosphates and nitrates in run-off are dissolved nutrients.", "बहाव में फॉस्फेट और नाइट्रेट घुले हुए पोषक तत्व होते हैं।"]],
    ],
    hint: ["Nutrients feed plants and algae.", "पोषक तत्व पौधों और शैवालों का भोजन हैं।"],
    sol: ["Nutrients cause an algal bloom. Bacteria decomposing dead algae use up dissolved oxygen (BOD rises), so aquatic animals die. This is eutrophication.", "पोषक तत्वों से शैवाल प्रस्फुटन होता है। मृत शैवाल विघटित करने वाले जीवाणु घुलित ऑक्सीजन खपा देते हैं (BOD बढ़ती है), इसलिए जलीय जीव मरते हैं। यह सुपोषण है।"],
  },
  {
    q: ["What does a catalytic converter in a car exhaust do?", "कार के निकास में लगा उत्प्रेरकीय परिवर्तक क्या करता है?"],
    ok: ["It converts CO, nitrogen oxides and unburnt hydrocarbons into CO₂, N₂ and H₂O", "यह CO, नाइट्रोजन ऑक्साइडों और न जले हाइड्रोकार्बनों को CO₂, N₂ और H₂O में बदलता है"],
    wrong: [
      [["It removes CO₂ from the exhaust", "यह निकास से CO₂ हटाता है"], ["It actually produces CO₂ by oxidising CO and hydrocarbons.", "यह तो CO और हाइड्रोकार्बनों के ऑक्सीकरण से CO₂ बनाता है।"]],
      [["It converts SO₂ into sulphuric acid", "यह SO₂ को सल्फ्यूरिक अम्ल में बदलता है"], ["Sulphuric acid is made in the Contact process, not in a car.", "सल्फ्यूरिक अम्ल संपर्क प्रक्रम में बनता है, कार में नहीं।"]],
      [["It makes the fuel burn without oxygen", "यह ईंधन को बिना ऑक्सीजन के जलाता है"], ["Combustion always needs oxygen; the converter treats the exhaust gases.", "दहन के लिए सदैव ऑक्सीजन चाहिए; परिवर्तक निकास गैसों का उपचार करता है।"]],
    ],
    hint: ["It uses metals such as platinum, palladium and rhodium.", "इसमें प्लैटिनम, पैलेडियम और रोडियम जैसी धातुएँ होती हैं।"],
    sol: ["On the hot metal catalyst: CO → CO₂, NO/NO₂ → N₂, hydrocarbons → CO₂ + H₂O, so harmful gases are reduced.", "गर्म धातु उत्प्रेरक पर: CO → CO₂, NO/NO₂ → N₂, हाइड्रोकार्बन → CO₂ + H₂O; इससे हानिकारक गैसें कम होती हैं।"],
  },
  {
    q: ["How does photochemical smog differ from classical smog?", "प्रकाश-रासायनिक धूम-कोहरा पारंपरिक धूम-कोहरे से कैसे भिन्न है?"],
    ok: ["Photochemical smog forms in warm, sunny weather from NO₂ and hydrocarbons and is oxidising (contains O₃ and PAN)", "प्रकाश-रासायनिक धूम-कोहरा गर्म, धूप वाले मौसम में NO₂ और हाइड्रोकार्बनों से बनता है और ऑक्सीकारक होता है (इसमें O₃ और PAN होते हैं)"],
    wrong: [
      [["Photochemical smog forms in cold, foggy weather from smoke and SO₂", "प्रकाश-रासायनिक धूम-कोहरा ठंडे, कोहरे वाले मौसम में धुएँ और SO₂ से बनता है"], ["That describes classical smog, which is reducing.", "यह पारंपरिक धूम-कोहरे का वर्णन है, जो अपचायक होता है।"]],
      [["Photochemical smog is reducing because it contains SO₂", "प्रकाश-रासायनिक धूम-कोहरा अपचायक है क्योंकि इसमें SO₂ है"], ["It contains strong oxidants such as ozone and PAN.", "इसमें ओज़ोन और PAN जैसे प्रबल ऑक्सीकारक होते हैं।"]],
      [["There is no difference; both are fog mixed with smoke", "कोई अंतर नहीं; दोनों धुएँ से मिला कोहरा हैं"], ["Only classical smog is smoke + fog; photochemical smog needs sunlight acting on vehicle exhaust.", "केवल पारंपरिक धूम-कोहरा धुआँ + कोहरा है; प्रकाश-रासायनिक धूम-कोहरे के लिए वाहनों के धुएँ पर धूप की क्रिया चाहिए।"]],
    ],
    hint: ["'Photo' means light.", "'प्रकाश-रासायनिक' में प्रकाश की भूमिका है।"],
    sol: ["Classical smog: smoke + fog + SO₂, cool humid weather, reducing. Photochemical smog: sunlight on NO₂ and hydrocarbons, forms O₃ and PAN, oxidising.", "पारंपरिक: धुआँ + कोहरा + SO₂, ठंडा नम मौसम, अपचायक। प्रकाश-रासायनिक: NO₂ और हाइड्रोकार्बनों पर धूप, O₃ और PAN बनते हैं, ऑक्सीकारक।"],
  },
];
const ENV_C3 = [
  {
    q: ["Why can a single chlorine atom from a CFC destroy thousands of ozone molecules?", "CFC से निकला एक क्लोरीन परमाणु हजारों ओज़ोन अणुओं को कैसे नष्ट कर सकता है?"],
    ok: ["Cl is regenerated in the cycle (Cl + O₃ → ClO + O₂, ClO + O → Cl + O₂), so it acts as a catalyst", "चक्र में Cl पुनः बन जाता है (Cl + O₃ → ClO + O₂, ClO + O → Cl + O₂), इसलिए यह उत्प्रेरक की तरह कार्य करता है"],
    wrong: [
      [["Each Cl atom combines with thousands of O₃ molecules at once", "हर Cl परमाणु एक साथ हजारों O₃ अणुओं से जुड़ जाता है"], ["Each step destroys one O₃; the Cl is freed again and repeats the cycle.", "हर चरण एक O₃ नष्ट करता है; Cl फिर मुक्त होकर चक्र दोहराता है।"]],
      [["CFC molecules split into thousands of Cl atoms", "CFC अणु टूटकर हजारों Cl परमाणु बनाते हैं"], ["A CFC molecule has only a few Cl atoms.", "एक CFC अणु में केवल कुछ Cl परमाणु होते हैं।"]],
      [["Chlorine raises the temperature of the stratosphere, which melts the ozone", "क्लोरीन समतापमंडल का ताप बढ़ाती है, जिससे ओज़ोन पिघल जाती है"], ["Ozone is a gas; it is destroyed chemically, not melted.", "ओज़ोन गैस है; यह रासायनिक रूप से नष्ट होती है, पिघलती नहीं।"]],
    ],
    hint: ["Look at what happens to Cl at the end of the two steps.", "देखिए कि दोनों चरणों के अंत में Cl का क्या होता है।"],
    sol: ["Cl + O₃ → ClO + O₂ and ClO + O → Cl + O₂. Net: O₃ + O → 2O₂, with Cl released unchanged. It is a catalytic chain reaction.", "Cl + O₃ → ClO + O₂ और ClO + O → Cl + O₂। कुल: O₃ + O → 2O₂, और Cl अपरिवर्तित मुक्त होता है। यह उत्प्रेरकीय शृंखला अभिक्रिया है।"],
  },
  {
    q: ["Why is the marble of old monuments such as the Taj Mahal damaged by acid rain?", "ताजमहल जैसे पुराने स्मारकों का संगमरमर अम्ल वर्षा से क्षतिग्रस्त क्यों होता है?"],
    ok: ["Marble is CaCO₃, which reacts with acids: CaCO₃ + H₂SO₄ → CaSO₄ + H₂O + CO₂", "संगमरमर CaCO₃ है, जो अम्लों से अभिक्रिया करता है: CaCO₃ + H₂SO₄ → CaSO₄ + H₂O + CO₂"],
    wrong: [
      [["Acid rain dissolves the silica (SiO₂) in marble", "अम्ल वर्षा संगमरमर के सिलिका (SiO₂) को घोल देती है"], ["Marble is calcium carbonate, not silica; silica resists dilute acids.", "संगमरमर कैल्सियम कार्बोनेट है, सिलिका नहीं; सिलिका तनु अम्लों से अप्रभावित रहती है।"]],
      [["CO₂ in the rain oxidises the marble", "वर्षा की CO₂ संगमरमर का ऑक्सीकरण करती है"], ["The damage is an acid–carbonate reaction, not oxidation by CO₂.", "क्षति अम्ल-कार्बोनेट अभिक्रिया है, CO₂ द्वारा ऑक्सीकरण नहीं।"]],
      [["Ozone in the rain reacts with the marble", "वर्षा में ओज़ोन संगमरमर से अभिक्रिया करती है"], ["The main culprits are sulphuric and nitric acids in acid rain.", "मुख्य दोषी अम्ल वर्षा के सल्फ्यूरिक और नाइट्रिक अम्ल हैं।"]],
    ],
    hint: ["What is marble made of?", "संगमरमर किससे बना है?"],
    sol: ["Marble (CaCO₃) reacts with H₂SO₄ and HNO₃ in acid rain; the products wash away, so the surface is eaten away (\"marble cancer\").", "संगमरमर (CaCO₃) अम्ल वर्षा के H₂SO₄ और HNO₃ से अभिक्रिया करता है; उत्पाद बह जाते हैं, इसलिए सतह क्षीण होती है (\"मार्बल कैंसर\")।"],
  },
];
const FUELS = [
  { n: ["carbon (coal)", "कार्बन (कोयला)"], f: "C", M: 12, c: 1 },
  { n: ["methane (natural gas)", "मेथेन (प्राकृतिक गैस)"], f: "CH_4", M: 16, c: 1 },
  { n: ["propane (LPG)", "प्रोपेन (LPG)"], f: "C_3H_8", M: 44, c: 3 },
  { n: ["butane (LPG)", "ब्यूटेन (LPG)"], f: "C_4H_{10}", M: 58, c: 4 },
  { n: ["octane (petrol)", "ऑक्टेन (पेट्रोल)"], f: "C_8H_{18}", M: 114, c: 8 },
];
if (molar({ C: 4, H: 10 }) !== 58 || molar({ C: 8, H: 18 }) !== 114 || molar({ C: 3, H: 8 }) !== 44) throw new Error("FUELS: molska masa");

const exgEnvironmental = {
  id: "exg-kem-environmental",
  topics: [T("environmental-chemistry")],
  langs: ["en", "hi"],
  gen(level, r, _t, lang) {
    const L = bi(lang);
    if (level === 1) {
      const v = r.int(0, 3);
      if (v === 0) {
        const askNot = r.int(0, 1) === 0;
        if (askNot) {
          const ok = r.pick(NOT_GHG);
          return baseTask({
            text: L("Which of the following is NOT a greenhouse gas?", "निम्नलिखित में से कौन-सी ग्रीनहाउस गैस नहीं है?"),
            answer: ch(r, L, ok, GHG.map((g) => [g, ["It absorbs infrared radiation from the Earth, so it is a greenhouse gas.", "यह पृथ्वी से निकले अवरक्त विकिरण को अवशोषित करती है, इसलिए यह ग्रीनहाउस गैस है।"]])),
            hint: L("Greenhouse gases absorb the infrared (heat) radiation given out by the Earth.", "ग्रीनहाउस गैसें पृथ्वी से निकले अवरक्त (ऊष्मा) विकिरण को अवशोषित करती हैं।"),
            solution: L(`${ok[0]} does not absorb infrared radiation. CO₂, CH₄, N₂O, CFCs and water vapour do.`, `${ok[1]} अवरक्त विकिरण अवशोषित नहीं करती। CO₂, CH₄, N₂O, CFC और जल वाष्प करती हैं।`),
          });
        }
        const ok = r.pick(GHG.slice(0, 3));
        return baseTask({
          text: L("Which of the following is a greenhouse gas?", "निम्नलिखित में से कौन-सी ग्रीनहाउस गैस है?"),
          answer: ch(r, L, ok, NOT_GHG.map((g) => [g, ["N₂, O₂ and Ar, the main gases of dry air, do not absorb infrared radiation.", "शुष्क वायु की मुख्य गैसें N₂, O₂ और Ar अवरक्त विकिरण अवशोषित नहीं करतीं।"]])),
          hint: L("Greenhouse gases absorb the infrared (heat) radiation given out by the Earth.", "ग्रीनहाउस गैसें पृथ्वी से निकले अवरक्त (ऊष्मा) विकिरण को अवशोषित करती हैं।"),
          solution: L(`${ok[0]} absorbs infrared radiation and traps heat. N₂, O₂ and Ar do not.`, `${ok[1]} अवरक्त विकिरण अवशोषित करके ऊष्मा रोकती है। N₂, O₂ और Ar ऐसा नहीं करतीं।`),
        });
      }
      if (v === 1 || v === 2) return concept(r, L, ENV_C1[(v - 1) * 2 + r.int(0, 1)]);
      const [pe, ph] = r.pick([["fluoride", "फ्लुओराइड"], ["nitrate", "नाइट्रेट"], ["lead", "लेड"], ["arsenic", "आर्सेनिक"]]);
      const V = r.pick([2, 4, 5, 10, 20]);
      const c = r.pick([0.5, 1, 1.5, 2, 4]);
      const mg = c * V;
      return task({
        text: L(`A ${V} L sample of drinking water contains ${en(mg)} mg of ${pe}. Taking 1 L of water as 1 kg, find the concentration of ${pe} in ppm (parts per million by mass).`, `पीने के जल के ${V} L नमूने में ${en(mg)} mg ${ph} है। 1 L जल को 1 kg मानकर ${ph} की सांद्रता ppm (द्रव्यमान के अनुसार भाग प्रति दस लाख) में ज्ञात कीजिए।`),
        answer: numM(c, 2, [[mg, L("Divide by the mass of the water (in kg) as well.", "जल के द्रव्यमान (kg में) से भी भाग दीजिए।")], [V / mg, L("ppm = mass of solute ÷ mass of solution × 10⁶; the ratio is inverted.", "ppm = विलेय का द्रव्यमान ÷ विलयन का द्रव्यमान × 10⁶; अनुपात उल्टा है।")]]),
        data: { given: [q("V", V, "L"), q("m", mg, "mg")], find: ["c"] },
        hint: L("1 ppm = 1 mg of substance in 1 kg of water.", "1 ppm = 1 kg जल में 1 mg पदार्थ।"),
        formula: "c = \\dfrac{m_{solute}}{m_{solution}} \\times 10^{6}",
        solution: `$m_{water} = ${V}\\ \\text{kg} = ${V} \\times 10^{6}\\ \\text{mg}$\n$c = \\dfrac{${en(mg)}}{${V} \\times 10^{6}} \\times 10^{6}$\n$c = ${en(c)}\\ \\text{ppm}$`,
      });
    }
    if (level === 2) {
      const v = r.int(0, 3);
      if (v === 0) {
        const F = r.pick(FUELS);
        const m = r.pick([1, 2, 5, 10, 20]);
        const co2 = (m / F.M) * F.c * 44;
        return task({
          text: L(`What mass of CO₂, in kg, is produced when ${m} kg of ${F.n[0]}, $\\mathrm{${F.f}}$ (M = ${F.M} g/mol), burns completely? (M(CO₂) = 44 g/mol)${RT(co2, 2, lang)}`, `${m} kg ${F.n[1]}, $\\mathrm{${F.f}}$ (M = ${F.M} g/mol) के पूर्ण दहन से कितने kg CO₂ बनती है? (M(CO₂) = 44 g/mol)${RT(co2, 2, lang)}`),
          answer: numM(co2, 2, F.c > 1 ? [[(m / F.M) * 44, L(`Each molecule has ${F.c} C atoms, so it gives ${F.c} CO₂.`, `हर अणु में ${F.c} C परमाणु हैं, इसलिए उससे ${F.c} CO₂ बनती हैं।`)], [m, L("The mass of CO₂ is not equal to the mass of fuel; convert through moles.", "CO₂ का द्रव्यमान ईंधन के द्रव्यमान के बराबर नहीं होता; मोल के माध्यम से बदलिए।")]] : [[(m * F.M) / 44, L("The ratio of molar masses is inverted: multiply by 44/M.", "मोलर द्रव्यमानों का अनुपात उल्टा है: 44/M से गुणा कीजिए।")], [m, L("The mass of CO₂ is not equal to the mass of fuel; convert through moles.", "CO₂ का द्रव्यमान ईंधन के द्रव्यमान के बराबर नहीं होता; मोल के माध्यम से बदलिए।")]]),
          data: { given: [q("m", m, "kg"), q("M", F.M, "g/mol"), q("M(\\mathrm{CO_2})", 44, "g/mol")], find: ["m(\\mathrm{CO_2})"] },
          hint: L("Every carbon atom of the fuel ends up in one CO₂ molecule.", "ईंधन का हर कार्बन परमाणु एक CO₂ अणु में पहुँचता है।"),
          formula: `n(\\mathrm{CO_2}) = ${F.c > 1 ? F.c + "\\," : ""}n(\\mathrm{${F.f}})`,
          solution: `$n = \\dfrac{${m}}{${F.M}} ${ev(m / F.M, 4)}\\ \\text{kmol}$\n${F.c > 1 ? `$n(\\mathrm{CO_2}) = ${F.c} \\cdot ${fx(m / F.M, 4)} ${ev((m / F.M) * F.c, 4)}\\ \\text{kmol}$` : `$n(\\mathrm{CO_2}) = n(\\mathrm{C})$`}\n$m(\\mathrm{CO_2}) = ${fx((m / F.M) * F.c, 4)} \\cdot 44 ${ev(co2, 2)}\\ \\text{kg}$`,
        });
      }
      if (v === 1) {
        const D1 = r.pick([7.8, 8.0, 8.2, 8.6, 9.0]);
        const D2 = r.pick([1.2, 2.4, 3.0, 4.6, 6.4]);
        const V = r.pick([0.3, 0.5, 2, 5]);
        const bod = tidy(D1 - D2);
        const askMass = r.int(0, 1) === 1;
        const mass = bod * V;
        return task({
          text: askMass
            ? L(`A water sample has ${en(D1)} mg/L of dissolved oxygen. After 5 days in the dark at 20 °C it has ${en(D2)} mg/L. What mass of oxygen, in mg, did the bacteria use in ${en(V)} L of this water?${RT(mass, 2, lang)}`, `जल के एक नमूने में ${en(D1)} mg/L घुलित ऑक्सीजन है। 20 °C पर अँधेरे में 5 दिन बाद इसमें ${en(D2)} mg/L रह जाती है। इस जल के ${en(V)} L में जीवाणुओं ने कितने mg ऑक्सीजन का उपयोग किया?${RT(mass, 2, lang)}`)
            : L(`A water sample has ${en(D1)} mg/L of dissolved oxygen. After 5 days in the dark at 20 °C it has ${en(D2)} mg/L. Find the BOD of the water in mg/L (ppm).`, `जल के एक नमूने में ${en(D1)} mg/L घुलित ऑक्सीजन है। 20 °C पर अँधेरे में 5 दिन बाद इसमें ${en(D2)} mg/L रह जाती है। जल की BOD mg/L (ppm) में ज्ञात कीजिए।`),
          answer: askMass
            ? numM(mass, 2, [[bod, L(`That is per litre; multiply by ${en(V)} L.`, `यह प्रति लीटर है; ${en(V)} L से गुणा कीजिए।`)], [D1 * V, L("Use the oxygen used up (the drop), not the starting amount.", "प्रारंभिक मात्रा नहीं, उपयोग हुई ऑक्सीजन (कमी) लीजिए।")]])
            : numM(bod, 2, [[D2, L("BOD is the oxygen used up, i.e. the decrease, not what remains.", "BOD उपयोग हुई ऑक्सीजन, अर्थात कमी है, बची हुई नहीं।")], [D1 + D2, L("Subtract the final dissolved oxygen from the initial.", "प्रारंभिक घुलित ऑक्सीजन में से अंतिम घटाइए।")]]),
          data: { given: askMass ? [q("DO_1", D1, "mg/L"), q("DO_5", D2, "mg/L"), q("V", V, "L")] : [q("DO_1", D1, "mg/L"), q("DO_5", D2, "mg/L")], find: [askMass ? "m(\\mathrm{O_2})" : "BOD"] },
          hint: L("BOD is the dissolved oxygen consumed by microorganisms over the test period.", "BOD परीक्षण अवधि में सूक्ष्मजीवों द्वारा खपाई गई घुलित ऑक्सीजन है।"),
          formula: askMass ? ["BOD = DO_1 - DO_5", "m = BOD \\cdot V"] : "BOD = DO_1 - DO_5",
          solution: askMass
            ? `$BOD = ${en(D1)} - ${en(D2)} = ${en(bod)}\\ \\text{mg/L}$\n$m = ${en(bod)} \\cdot ${en(V)} ${ev(mass, 2)}\\ \\text{mg}$`
            : `$BOD = ${en(D1)} - ${en(D2)}$\n$BOD = ${en(bod)}\\ \\text{mg/L}$`,
        });
      }
      if (v === 2) {
        const pH = r.pick([3.6, 4.1, 4.6, 4.8, 5.1]);
        const ratio = 10 ** (5.6 - pH);
        return task({
          text: L(`Normal rain water has pH 5.6. A sample of acid rain has pH ${en(pH)}. How many times greater is the hydrogen-ion concentration in the acid rain?${RT(ratio, 1, lang)}`, `सामान्य वर्षा जल का pH 5.6 है। अम्ल वर्षा के एक नमूने का pH ${en(pH)} है। अम्ल वर्षा में हाइड्रोजन आयन सांद्रता कितने गुना अधिक है?${RT(ratio, 1, lang)}`),
          answer: numM(ratio, 1, [[tidy(5.6 - pH), L("pH is logarithmic: a difference of 1 means a factor of 10.", "pH लघुगणकीय है: 1 का अंतर 10 गुना के बराबर है।")], [5.6 / pH, L("Compare $[\\mathrm{H^+}] = 10^{-\\mathrm{pH}}$, not the pH values themselves.", "pH मानों की नहीं, $[\\mathrm{H^+}] = 10^{-\\mathrm{pH}}$ की तुलना कीजिए।")]]),
          data: { given: [q("\\mathrm{pH}_1", 5.6), q("\\mathrm{pH}_2", pH)], find: ["\\frac{[\\mathrm{H^+}]_2}{[\\mathrm{H^+}]_1}"] },
          hint: L("$[\\mathrm{H^+}] = 10^{-\\mathrm{pH}}$.", "$[\\mathrm{H^+}] = 10^{-\\mathrm{pH}}$।"),
          formula: "\\dfrac{[\\mathrm{H^+}]_2}{[\\mathrm{H^+}]_1} = 10^{\\,\\mathrm{pH}_1 - \\mathrm{pH}_2}",
          solution: `$\\dfrac{[\\mathrm{H^+}]_2}{[\\mathrm{H^+}]_1} = \\dfrac{10^{-${en(pH)}}}{10^{-5.6}} = 10^{${en(tidy(5.6 - pH))}}$\n$\\dfrac{[\\mathrm{H^+}]_2}{[\\mathrm{H^+}]_1} ${ev(ratio, 1)}$`,
        });
      }
      return concept(r, L, r.pick(ENV_C2));
    }
    // level 3
    const v = r.int(0, 3);
    if (v === 0) {
      const coal = r.pick([100, 200, 500, 1000]);
      const s = r.pick([0.5, 0.8, 1, 1.5, 2, 3]);
      const askCa = r.int(0, 1) === 1;
      const mS = (coal * s) / 100;
      const so2 = mS * 2;
      const caco3 = (so2 / 64) * 100;
      const ans = askCa ? caco3 : so2;
      return task({
        text: askCa
          ? L(`A power station burns ${coal} t of coal containing ${en(s)}% sulphur by mass. All the sulphur forms SO₂, which is removed by limestone: $\\mathrm{2CaCO_3 + 2SO_2 + O_2 \\rightarrow 2CaSO_4 + 2CO_2}$. What mass of CaCO₃, in tonnes, is needed? (S = 32, O = 16, CaCO₃ = 100 g/mol)${RT(ans, 2, lang)}`, `एक बिजलीघर ${en(s)}% (द्रव्यमान के अनुसार) सल्फर वाला ${coal} t कोयला जलाता है। सारा सल्फर SO₂ बनाता है, जिसे चूना-पत्थर से हटाया जाता है: $\\mathrm{2CaCO_3 + 2SO_2 + O_2 \\rightarrow 2CaSO_4 + 2CO_2}$। कितने टन CaCO₃ चाहिए? (S = 32, O = 16, CaCO₃ = 100 g/mol)${RT(ans, 2, lang)}`)
          : L(`A power station burns ${coal} t of coal containing ${en(s)}% sulphur by mass. If all the sulphur burns to SO₂, what mass of SO₂, in tonnes, is formed? (S = 32, O = 16)${RT(ans, 2, lang)}`, `एक बिजलीघर ${en(s)}% (द्रव्यमान के अनुसार) सल्फर वाला ${coal} t कोयला जलाता है। यदि सारा सल्फर जलकर SO₂ बने, तो कितने टन SO₂ बनेगी? (S = 32, O = 16)${RT(ans, 2, lang)}`),
        answer: askCa
          ? numM(ans, 2, [[(mS / 32) * 100 / 2, L("The equation has a 1 : 1 ratio of CaCO₃ to SO₂ (2 : 2).", "समीकरण में CaCO₃ और SO₂ का अनुपात 1 : 1 (2 : 2) है।")], [so2, L("Convert the SO₂ to moles and then to the mass of CaCO₃.", "SO₂ को मोल में और फिर CaCO₃ के द्रव्यमान में बदलिए।")]])
          : numM(ans, 2, [[mS, L("SO₂ is heavier than S: 32 g of S gives 64 g of SO₂.", "SO₂, S से भारी है: 32 g S से 64 g SO₂ बनती है।")], [coal * 2 * s, L("Use the percentage as a fraction (divide by 100).", "प्रतिशत को भिन्न के रूप में लीजिए (100 से भाग दीजिए)।")]]),
        data: { given: [q("m_{coal}", coal, "t"), q("w(\\mathrm{S})", `${en(s)}\\%`)], find: [askCa ? "m(\\mathrm{CaCO_3})" : "m(\\mathrm{SO_2})"] },
        hint: L("Find the mass of sulphur first. S + O₂ → SO₂.", "पहले सल्फर का द्रव्यमान ज्ञात कीजिए। S + O₂ → SO₂।"),
        formula: askCa ? ["m(\\mathrm{SO_2}) = m(\\mathrm{S}) \\cdot \\dfrac{64}{32}", "n(\\mathrm{CaCO_3}) = n(\\mathrm{SO_2})"] : "m(\\mathrm{SO_2}) = m(\\mathrm{S}) \\cdot \\dfrac{64}{32}",
        solution: [
          `$m(\\mathrm{S}) = ${coal} \\cdot ${en(s / 100)} = ${en(mS)}\\ \\text{t}$`,
          `$m(\\mathrm{SO_2}) = ${en(mS)} \\cdot \\dfrac{64}{32} = ${en(so2)}\\ \\text{t}$`,
          ...(askCa ? [`$n(\\mathrm{CaCO_3}) = n(\\mathrm{SO_2}) = \\dfrac{${en(so2)}}{64} ${ev(so2 / 64, 5)}\\ \\text{Mmol}$`, `$m(\\mathrm{CaCO_3}) = ${fx(so2 / 64, 5)} \\cdot 100 ${ev(caco3, 2)}\\ \\text{t}$`] : []),
        ].join("\n"),
      });
    }
    if (v === 1) {
      const Vr = r.pick([30, 40, 50, 60, 75]);
      const ppm = r.pick([10, 20, 35, 50, 100]);
      const VL = (Vr * 1000 * ppm) / 1e6;
      const mass = (VL / 24) * 28;
      return task({
        text: L(`The air in a closed garage of volume ${Vr} m³ contains ${ppm} ppm of carbon monoxide by volume. Find the mass of CO in the garage in g. (Molar volume of a gas at room conditions: 24 L/mol; M(CO) = 28 g/mol)${RT(mass, 2, lang)}`, `${Vr} m³ आयतन वाले एक बंद गैराज की वायु में आयतन के अनुसार ${ppm} ppm कार्बन मोनोऑक्साइड है। गैराज में CO का द्रव्यमान g में ज्ञात कीजिए। (कमरे की परिस्थितियों में गैस का मोलर आयतन: 24 L/mol; M(CO) = 28 g/mol)${RT(mass, 2, lang)}`),
        answer: numM(mass, 2, [[VL, L("This is the volume of CO in litres; convert it to moles and then to mass.", "यह CO का आयतन (लीटर में) है; इसे मोल में और फिर द्रव्यमान में बदलिए।")], [mass / 1000, L("1 m³ = 1000 L; convert the garage volume to litres.", "1 m³ = 1000 L; गैराज का आयतन लीटर में बदलिए।")]]),
        data: { given: [q("V", Vr, "m^3"), q("c", ppm, "ppm"), q("V_m", 24, "L/mol"), q("M", 28, "g/mol")], find: ["m(\\mathrm{CO})"] },
        hint: L("ppm by volume: litres of CO in 10⁶ L of air.", "आयतन के अनुसार ppm: 10⁶ L वायु में CO के लीटर।"),
        formula: ["V(\\mathrm{CO}) = V \\cdot c \\cdot 10^{-6}", "m = \\dfrac{V(\\mathrm{CO})}{V_m} M"],
        solution: `$V = ${Vr}\\ \\text{m}^3 = ${Vr * 1000}\\ \\text{L}$\n$V(\\mathrm{CO}) = ${Vr * 1000} \\cdot ${ppm} \\times 10^{-6} = ${en(VL)}\\ \\text{L}$\n$m = \\dfrac{${en(VL)}}{24} \\cdot 28 ${ev(mass, 2)}\\ \\text{g}$`,
      });
    }
    if (v === 2) return concept(r, L, r.pick(ENV_C3));
    const cons = r.pick([5, 6, 8, 10, 12]);
    const dist = r.pick([10, 25, 50, 100]);
    const rho = 0.74;
    const kg = (cons / 100) * dist * rho;
    const co2 = (kg / 114) * 8 * 44;
    return task({
      text: L(`A car uses ${cons} L of petrol per 100 km. Treat petrol as octane, C₈H₁₈ (M = 114 g/mol), with density 0.74 kg/L. What mass of CO₂, in kg, does the car release on a ${dist} km trip? (M(CO₂) = 44 g/mol)${RT(co2, 2, lang)}`, `एक कार 100 km में ${cons} L पेट्रोल खर्च करती है। पेट्रोल को ऑक्टेन, C₈H₁₈ (M = 114 g/mol), घनत्व 0.74 kg/L मानिए। ${dist} km की यात्रा में कार कितने kg CO₂ छोड़ती है? (M(CO₂) = 44 g/mol)${RT(co2, 2, lang)}`),
      answer: numM(co2, 2, [[(kg / 114) * 44, L("Each C₈H₁₈ gives 8 CO₂.", "हर C₈H₁₈ से 8 CO₂ बनते हैं।")], [((cons / 100) * dist / 114) * 8 * 44, L("Convert litres of petrol to kg with the density first.", "पहले घनत्व से पेट्रोल के लीटर को kg में बदलिए।")]]),
      data: { given: [q("V_{100}", cons, "L"), q("s", dist, "km"), q("\\rho", rho, "kg/L"), q("M", 114, "g/mol"), q("M(\\mathrm{CO_2})", 44, "g/mol")], find: ["m(\\mathrm{CO_2})"] },
      hint: L("Volume of petrol → mass → kmol of octane → kmol of CO₂ → mass.", "पेट्रोल का आयतन → द्रव्यमान → ऑक्टेन के kmol → CO₂ के kmol → द्रव्यमान।"),
      formula: ["\\mathrm{2C_8H_{18} + 25O_2 \\rightarrow 16CO_2 + 18H_2O}", "n(\\mathrm{CO_2}) = 8\\,n(\\mathrm{C_8H_{18}})"],
      solution: `$V = \\dfrac{${cons}}{100} \\cdot ${dist} = ${en((cons / 100) * dist)}\\ \\text{L}$\n$m = ${en((cons / 100) * dist)} \\cdot 0.74 = ${en(kg)}\\ \\text{kg}$\n$n(\\mathrm{CO_2}) = 8 \\cdot \\dfrac{${en(kg)}}{114} ${ev((kg / 114) * 8, 5)}\\ \\text{kmol}$\n$m(\\mathrm{CO_2}) = ${fx((kg / 114) * 8, 5)} \\cdot 44 ${ev(co2, 2)}\\ \\text{kg}$`,
    });
  },
};

export const EXAM_GAP_KEM = [exgPolymers, exgIndustrial, exgEnvironmental];

// Klikljive formule: vsak znan simbol in enota v formuli (KaTeX) je pikčasto podčrtan.
// Klik (ali Enter) odpre kartico: ime, kako ga izračunaš, enota in iz česa je sestavljena.
// Primer: M → »molska masa«, M = m/n, enota g/mol (gram na mol), g ÷ mol.
//
// Delovanje: annotateTex() pred izrisom ovije znane simbole in enote v \htmlData{fx=…}{…},
// KaTeX iz tega naredi <span data-fx="…">. Simboli so odvisni od predmeta (a je pri MAT koeficient,
// pri FIZ pospešek) in ponekod od formule (ctx), enote pa so povsod enake.
// Vsebina razlag je v slovenščini in angleščini; drugi jeziki dobijo angleško.
// Ta datoteka je brez DOM (slovar in označevanje TeX), kartica je v formula-info.js.


// ---------- slovar simbolov ----------
// n: ime (sl), en: ime (en), r: zveza v TeX, u: enota (ključ v UNITS), note/noteEn: dodatna opomba,
// ctx: regularni izraz, ki mora ustrezati celotni formuli (za dvoumne črke).
// Množenje v formuli: »k x«, »k\,x«, »k \cdot x«, »k \times x« (pregled PR 463: F = k \cdot x ni bil klikljiv).
const MUL = "\\s*(?:\\\\cdot|\\\\times|\\\\[,;: ])?\\s*";
const FIZ = {
  F: { n: "sila", en: "force", r: "F = m\\,a", u: "N" },
  F_g: { n: "teža (sila teže)", en: "weight (gravitational force)", r: "F_g = m\\,g", u: "N" },
  F_tr: { n: "sila trenja", en: "friction force", r: "F_{tr} = k_{tr}\\,F_n", u: "N" },
  F_n: { n: "pravokotna (normalna) sila podlage", en: "normal force", u: "N" },
  F_rez: { n: "rezultanta sil", en: "net force", r: "F_{rez} = m\\,a", u: "N" },
  F_r: { n: "rezultanta sil", en: "net force", r: "F_r = m\\,a", u: "N" },
  F_vzg: { n: "sila vzgona", en: "buoyant force", r: "F_{vzg} = \\rho_{tek}\\,g\\,V", u: "N" },
  F_c: { n: "centripetalna sila", en: "centripetal force", r: "F_c = \\frac{m v^2}{r}", u: "N" },
  m: { n: "masa", en: "mass", r: "m = \\rho\\,V", u: "kg" },
  a: { n: "pospešek", en: "acceleration", r: "a = \\frac{\\Delta v}{\\Delta t}", u: "m/s^2" },
  a_c: { n: "centripetalni pospešek", en: "centripetal acceleration", r: "a_c = \\frac{v^2}{r}", u: "m/s^2" },
  v: { n: "hitrost", en: "velocity (speed)", r: "v = \\frac{s}{t}", u: "m/s" },
  v_0: { n: "začetna hitrost", en: "initial velocity", u: "m/s" },
  s: { n: "pot (premik)", en: "distance (displacement)", r: "s = v\\,t", u: "m" },
  t: { n: "čas", en: "time", r: "t = \\frac{s}{v}", u: "s" },
  t_0: { n: "nihajni (obhodni) čas", en: "period", r: "t_0 = \\frac{1}{\\nu}", u: "s" },
  g: { n: "težni pospešek", en: "gravitational acceleration", r: "g \\approx 9{,}81\\,\\mathrm{m/s^2}", u: "m/s^2" },
  G: [
    { ctx: "\\\\frac\\{\\s*m_?1", n: "gravitacijska konstanta", en: "gravitational constant", r: "G \\approx 6{,}67\\cdot 10^{-11}\\,\\mathrm{N\\,m^2/kg^2}" },
    { n: "gibalna količina", en: "momentum", r: "G = m\\,v", u: "kg m/s" },
  ],
  p: [
    { ctx: `p\\s*=\\s*m${MUL}v`, n: "gibalna količina", en: "momentum", r: "p = m\\,v", u: "kg m/s" },
    { n: "tlak", en: "pressure", r: "p = \\frac{F}{S}", u: "Pa" },
  ],
  S: { n: "ploščina (prečni presek)", en: "area (cross-section)", u: "m^2" },
  // A je pri nihanju amplituda, v geometriji ploščina.
  A: { n: "delo", en: "work", r: "A = F\\,s", u: "J", ne: "nihanj|nihal|valovan|amplitud" },
  W: { n: "energija", en: "energy", u: "J" },
  W_k: { n: "kinetična energija", en: "kinetic energy", r: "W_k = \\frac{m v^2}{2}", u: "J" },
  W_p: { n: "potencialna energija", en: "potential energy", r: "W_p = m\\,g\\,h", u: "J" },
  W_pr: { n: "prožnostna energija", en: "elastic energy", r: "W_{pr} = \\frac{k x^2}{2}", u: "J" },
  E: { n: "energija", en: "energy", u: "J", note: "Pri električnem polju E pomeni jakost polja (enota N/C).", noteEn: "For electric fields E is the field strength (unit N/C)." },
  E_k: { n: "kinetična energija", en: "kinetic energy", r: "E_k = \\frac{m v^2}{2}", u: "J" },
  E_p: { n: "potencialna energija", en: "potential energy", r: "E_p = m\\,g\\,h", u: "J" },
  P: { n: "moč", en: "power", r: "P = \\frac{A}{t}", u: "W" },
  ρ: { n: "gostota", en: "density", r: "\\rho = \\frac{m}{V}", u: "kg/m^3" },
  V: { n: "prostornina", en: "volume", r: "V = \\frac{m}{\\rho}", u: "m^3" },
  h: [
    { ctx: `h${MUL}\\\\nu|h${MUL}f\\b|\\\\frac\\{h`, n: "Planckova konstanta", en: "Planck constant", r: "h \\approx 6{,}63\\cdot 10^{-34}\\,\\mathrm{J\\,s}" },
    { n: "višina", en: "height", u: "m" },
  ],
  U: { n: "električna napetost", en: "voltage", r: "U = R\\,I", u: "V" },
  I: { n: "električni tok", en: "electric current", r: "I = \\frac{e}{t}", u: "A" },
  R: { n: "električni upor", en: "electrical resistance", r: "R = \\frac{U}{I}", u: "Ω" },
  // e^{…} je Eulerjevo število (praznjenje kondenzatorja, razpad), ne naboj.
  e: { brez: "e\\s*\\^", n: "električni naboj", en: "electric charge", r: "e = I\\,t", u: "C" },
  e_0: { n: "osnovni naboj", en: "elementary charge", r: "e_0 \\approx 1{,}6\\cdot 10^{-19}\\,\\mathrm{C}", u: "C" },
  q: { n: "električni naboj", en: "electric charge", u: "C" },
  Q: { n: "toplota", en: "heat", r: "Q = m\\,c\\,\\Delta T", u: "J", note: "Pri elektriki Q pomeni naboj (enota C).", noteEn: "In electricity Q means charge (unit C)." },
  T: { n: "temperatura (absolutna) ali nihajni čas", en: "(absolute) temperature or period", note: "Temperatura se meri v K, nihajni čas v s.", noteEn: "Temperature is measured in K, a period in s." },
  ν: { n: "frekvenca", en: "frequency", r: "\\nu = \\frac{1}{t_0}", u: "Hz" },
  f: { n: "frekvenca", en: "frequency", r: "f = \\frac{1}{T}", u: "Hz", note: "Pri lečah f pomeni goriščno razdaljo (m).", noteEn: "For lenses f is the focal length (m)." },
  λ: { n: "valovna dolžina", en: "wavelength", r: "\\lambda = \\frac{c}{\\nu}", u: "m" },
  c: [
    { ctx: "\\\\Delta\\s*T|Q\\s*=", n: "specifična toplota", en: "specific heat capacity", r: "c = \\frac{Q}{m\\,\\Delta T}", u: "J/(kg K)" },
    { n: "hitrost svetlobe (valovanja)", en: "speed of light (of a wave)", r: "c \\approx 3\\cdot 10^{8}\\,\\mathrm{m/s}", u: "m/s" },
  ],
  // k je tudi Boltzmannova konstanta, valovno število, koeficient trenja; x tudi lega (koordinata).
  k: { ctx: `F\\s*=\\s*-?\\s*k${MUL}(?:\\\\Delta\\s*)?x|\\\\frac\\{\\s*k${MUL}x`, teme: "vzmet|prožn|nihal|nihanj|raztez", n: "prožnostni koeficient (konstanta vzmeti)", en: "spring constant", r: "F = k\\,x", u: "N/m" },
  k_tr: { n: "koeficient trenja", en: "coefficient of friction", r: "k_{tr} = \\frac{F_{tr}}{F_n}" },
  x: { ctx: `F\\s*=\\s*-?\\s*k${MUL}x|\\\\frac\\{\\s*k${MUL}x`, teme: "vzmet|prožn|raztez", n: "raztezek (odmik)", en: "extension (displacement)", u: "m" },
  η: { n: "izkoristek", en: "efficiency", r: "\\eta = \\frac{P_{izh}}{P_{vh}}" },
  ω: { n: "kotna hitrost", en: "angular velocity", r: "\\omega = \\frac{2\\pi}{t_0}", u: "1/s" },
  r: { n: "polmer (razdalja)", en: "radius (distance)", u: "m" },
  // M je tudi masa Zemlje, Sonca (gravitacija) ali molska masa.
  M: { ctx: `M\\s*=\\s*r${MUL}F|M\\s*=\\s*F${MUL}r`, teme: "navor|vzvod|ročic|ravnovesj|vrtenj|vrtiln", n: "navor", en: "torque", r: "M = r\\,F", u: "N m" },
  B: { n: "gostota magnetnega polja", en: "magnetic flux density", u: "T" },
  Φ: { n: "magnetni pretok", en: "magnetic flux", r: "\\Phi = B\\,S", u: "Wb" },
  C: { n: "kapaciteta", en: "capacitance", r: "C = \\frac{e}{U}", u: "F" },
  // n je tudi množina snovi (p V = n R T), število nihajev ali vrtljajev, red uklona.
  n: { ctx: "n\\s*=\\s*\\\\frac\\{\\s*c|\\\\sin", teme: "\\blom|lomn|lomi|\\bleč|optik|snell|prizm", ne: "plin|množin|uklon|mrežic", n: "lomni količnik", en: "refractive index", r: "n = \\frac{c_0}{c}" },
  N: { n: "število (navojev, delcev, nihajev)", en: "number (of turns, particles, oscillations)" },
};

const KEM = {
  n: { n: "množina snovi", en: "amount of substance", r: "n = \\frac{m}{M}", u: "mol" },
  m: { n: "masa", en: "mass", r: "m = n\\,M", u: "g" },
  M: { n: "molska masa", en: "molar mass", r: "M = \\frac{m}{n}", u: "g/mol", note: "Vsota atomskih mas iz periodnega sistema.", noteEn: "Sum of the atomic masses from the periodic table." },
  M_r: { n: "relativna molekulska masa", en: "relative molecular mass", r: "M_r = \\sum A_r", note: "Nima enote; številsko je enaka molski masi v g/mol.", noteEn: "It has no unit; numerically equal to the molar mass in g/mol." },
  A_r: { n: "relativna atomska masa", en: "relative atomic mass", note: "Nima enote; prebereš jo v periodnem sistemu.", noteEn: "It has no unit; read it from the periodic table." },
  c: { n: "množinska koncentracija", en: "molar concentration", r: "c = \\frac{n}{V}", u: "mol/L" },
  γ: { n: "masna koncentracija", en: "mass concentration", r: "\\gamma = \\frac{m}{V}", u: "g/L" },
  V: { n: "prostornina", en: "volume", r: "V = \\frac{n}{c}", u: "L" },
  V_m: { n: "molska prostornina plina", en: "molar volume of a gas", r: "V_m = \\frac{V}{n}", u: "L/mol", note: "Pri normalnih pogojih je približno 22,4 L/mol.", noteEn: "About 22.4 L/mol at standard conditions." },
  N: { n: "število delcev", en: "number of particles", r: "N = n\\,N_A" },
  N_A: { n: "Avogadrova konstanta", en: "Avogadro constant", r: "N_A \\approx 6{,}022\\cdot 10^{23}\\,\\mathrm{mol^{-1}}", u: "1/mol" },
  w: { n: "masni delež", en: "mass fraction", r: "w = \\frac{m_{\\text{topljenca}}}{m_{\\text{raztopine}}}", note: "Nima enote; pogosto ga zapišemo v odstotkih.", noteEn: "It has no unit; often written as a percentage." },
  φ: { n: "prostorninski delež", en: "volume fraction", r: "\\varphi = \\frac{V_i}{V}" },
  ρ: { n: "gostota", en: "density", r: "\\rho = \\frac{m}{V}", u: "g/mL" },
  p: { n: "tlak", en: "pressure", r: "p\\,V = n\\,R\\,T", u: "kPa" },
  T: { n: "temperatura (absolutna)", en: "(absolute) temperature", r: "T = t + 273{,}15", u: "K" },
  R: { n: "splošna plinska konstanta", en: "gas constant", r: "R \\approx 8{,}314\\,\\mathrm{J/(mol\\,K)}", u: "J/(mol K)" },
  K_c: { n: "konstanta ravnotežja (s koncentracijami)", en: "equilibrium constant (concentrations)" },
  K_p: { n: "konstanta ravnotežja (s tlaki)", en: "equilibrium constant (pressures)" },
  K_a: { n: "konstanta kisline", en: "acid dissociation constant", r: "K_a = \\frac{[\\mathrm{H_3O^+}][\\mathrm{A^-}]}{[\\mathrm{HA}]}" },
  K_b: { n: "konstanta baze", en: "base dissociation constant" },
  K_w: { n: "ionski produkt vode", en: "ionic product of water", r: "K_w = [\\mathrm{H_3O^+}][\\mathrm{OH^-}] = 10^{-14}" },
  K_sp: { n: "topnostni produkt", en: "solubility product" },
  H: { n: "entalpija", en: "enthalpy", u: "kJ/mol" },
  S: { n: "entropija", en: "entropy", u: "J/(mol K)" },
  G: { n: "prosta entalpija (Gibbsova energija)", en: "Gibbs free energy", r: "\\Delta G = \\Delta H - T\\,\\Delta S", u: "kJ/mol" },
  Q: { n: "toplota", en: "heat", r: "Q = m\\,c\\,\\Delta T", u: "J" },
  t: { n: "čas", en: "time", u: "s" },
};

// Pomen črke je odvisen od konteksta (j, 6. 11.: x₁ v Lagrangevem izreku je točka, ne ničla). Polja vnosa:
//   ctx  – formula (TeX) sama pove pomen (npr. a x² v kvadratni enačbi); zanesljivo.
//   pov  – kot ctx, a za formule v isti povedi (»Premica $y = kx + n$ ima začetno vrednost $n$«).
//   teme – tema (in sklop, druga stran kartice) ali poved okoli formule pove pomen; male črke, korenski zapis.
//          Celo besedilo razdelka tu ne šteje: ena beseda v drugem zgledu ne sme dati pomena vsem črkam.
//   ne   – v tej temi, povedi ali besedilu bloka ima črka drug pomen: teme tu ne velja (ctx pa še vedno).
//   brez – formula, v kateri črka nima tega pomena (dx v integralu ni premer).
//   oba  – potrebna sta ctx in teme hkrati.
//   zan  – formula sama zanesljivo pove pomen (S = 1,5 m², V = 2,0 L), tudi brez teme in pri oba.
//   samo – po temi (brez ctx) velja le, če se formula ujema s tem vzorcem (a = 1, b = −5; ne x = 2a).
// Vnos s ctx ali teme velja samo, ko se kontekst ujema; sicer črka ni klikljiva (raje nič kot napačno).
// Pravila in seznam dvoumnih črk: docs/pomen-crk.md.
const QUAD = "a\\s*x\\^|ax\\^|b\\^2\\s*-\\s*4\\s*a\\s*c";
// Formula rešitev ali Vietovi formuli: v njej so x₁, x₂, a, b, c in D zanesljivo iz kvadratne enačbe.
// −b ± √… in ± √D sta formula rešitev; (√a ± √b)² ni (pregled 463, N4). Vietovi formuli (c/a, −b/a) le skupaj z
// x₁ ali x₂: c/a = a/c_a v Evklidovem izreku ni kvadratna enačba (N3).
const VIETA = "^(?=[\\s\\S]*x_\\{?[12])[\\s\\S]*(?:\\\\frac\\{\\s*-\\s*b\\s*\\}\\{\\s*a\\s*\\}|-\\s*\\\\frac\\{\\s*b\\s*\\}\\{\\s*a\\s*\\}|\\\\frac\\{\\s*c\\s*\\}\\{\\s*a\\s*\\})";
const QUADF = `${QUAD}|-\\s*b\\s*\\\\pm\\s*\\\\sqrt|\\\\pm\\s*\\\\sqrt\\s*\\{?\\s*D|${VIETA}`;
// »kvadratni koren«, »kvadratni centimeter« niso kvadratna enačba: samo enačba, funkcija, neenačba, polinom.
const KVAD = "kvadratn\\w*\\s+(?:enačb|funkcij|neenačb|polinom|trinom)|diskriminant|viet";
// a, b, c niso koeficienti kvadratne enačbe pri elipsi/hiperboli (polosi, y = c/x) ali v zaporedju.
// a, b, c: »Vietovo pravilo« pri razstavljanju (x² + (a+b)x + ab) ni kvadratna enačba (pregled 463, N5).
const KVAD_K = "kvadratn\\w*\\s+(?:enačb|funkcij|neenačb|polinom|trinom)|diskriminant";
// p, q pri paraboli kot stožnici (y² = 2px) nista teme T(p, q) (pregled 463, N6).
const STOZNICE = "gorišč|vodnic|stožnic|elips|hiperbol|parabol\\w*\\s+y\\^";
const KVAD_NE = "elips|hiperbol|zaporedj|\\bvrst[aeio]?\\b";
// Po temi sami so a, b, c koeficienti le v formuli brez drugih črk (»a = 1«, »a \\neq 0«), ne v »x = 2a«.
const KOEF = "^(?:\\\\[a-zA-Z]+|[^a-zA-Z]|[abcD])*$";
const CIRCLE = "\\\\pi";
// Številka z enoto ploščine ali prostornine: S = 1,5 m², V = 2,00 L (pomen je jasen tudi zunaj geometrije).
const NUM_UNIT = "\\s*=\\s*[\\d\\s{},.]+(?:\\\\[,;!: ])?\\s*(?:\\\\(?:mathrm|text|rm)\\s*\\{\\s*)?";
// \b: »okrog« ni krog, »atmosfera« ni sfera (ASCII \b tu deluje, ker je pred korenom latinska črka ali nič).
const KROG = "\\bkrog|krožnic|krožn|valj|stož|\\bsfer|\\bkrogl";
const GEOM = `geometr|trikotnik|štirikotnik|pravokotnik|paralelogram|trapez|romb|deltoid|mnogokotnik|\\blik|ploščin|obseg|prostornin|površin|prizm|piramid|kock|kvader|\\bteles|\\btelo\\b|${KROG}`;
// »linearna enačba« ni premica (k je tam poljuben množitelj): le premica, linearna funkcija, smerni koeficient.
// Lekcija o linearnih enačbah ali sistemih (sklop »Linearna funkcija, enačbe in neenačbe«): k je tam množitelj.
const LIN_ENACBE = "linearn\\w*\\s+enačb|sistem\\w*\\s+linearn";
const PREMICA = "premic|linearn\\w*\\s+funkcij|smern|naklon";
const ZAPOREDJE = "zaporedj|aritmetičn|geometrijsk|\\bvrst[aeio]?\\b";
// α, β, γ niso koti pri »ravnina α«, stopnji tveganja, stopnji značilnosti ali parametru (»v ravnini« pa ni izjema).
const ANGLE_NE = "ravnin\\w*\\s+\\$?\\s*\\\\?(?:alpha|beta|gamma|α|β|γ)|tveganj|značilnost|parameter";
const KOTI = "\\\\angle|\\\\sin|\\\\cos|\\\\tan|\\\\cot|\\^\\s*\\{?\\s*\\\\circ|°";
const MAT = {
  π: { n: "število pi", en: "pi", r: "\\pi \\approx 3{,}14159", note: "Razmerje med obsegom in premerom kroga.", noteEn: "Ratio of a circle's circumference to its diameter." },
  e: { ctx: "e\\^|\\\\ln|\\\\exp|\\\\lim", n: "Eulerjevo število", en: "Euler's number", r: "e \\approx 2{,}71828", note: "Osnova naravnega logaritma.", noteEn: "Base of the natural logarithm." },
  // Eulerjeva oblika (e^{iφ}, cos φ ± i sin φ) sama pove, da je i imaginarna enota; sicer formula in tema.
  i: [
    { ctx: "e\\^\\{\\s*-?\\s*i|(?:\\\\pm|[+-])\\s*i\\s*\\\\sin|\\\\pm\\s*i(?![\\w\\\\])|\\(\\s*x\\s*[-+]\\s*i\\s*\\)|i\\^\\{?2\\}?\\s*=\\s*-\\s*1", n: "imaginarna enota", en: "imaginary unit", r: "i^2 = -1" },
    { ctx: "i\\^2|\\d\\s*i\\b|[+-]\\s*i\\b", teme: `kompleksn|imaginarn|${KVAD}`, oba: true, n: "imaginarna enota", en: "imaginary unit", r: "i^2 = -1" },
  ],
  a: { ctx: QUADF, teme: KVAD_K, ne: KVAD_NE, samo: KOEF, brez: "D\\s*=\\s*a\\^", n: "vodilni koeficient (pri x²)", en: "leading coefficient (of x²)", r: "a x^2 + b x + c = 0", note: "a ≠ 0, sicer enačba ni kvadratna.", noteEn: "a ≠ 0, otherwise the equation is not quadratic." },
  // f(x) = a x² + b: b je tam prosti člen, ne linearni koeficient (brez).
  b: { ctx: QUADF, teme: KVAD_K, ne: KVAD_NE, samo: KOEF, brez: "x\\^\\{?2\\}?\\s*[+-]\\s*b\\s*(?![a-zA-Z\\\\(])|b\\s*xy|D\\s*=\\s*a\\^", n: "linearni koeficient (pri x)", en: "linear coefficient (of x)", r: "x_1 + x_2 = -\\frac{b}{a}" },
  c: { ctx: QUADF, teme: KVAD_K, ne: KVAD_NE, samo: KOEF, n: "prosti člen", en: "constant term", r: "x_1 \\cdot x_2 = \\frac{c}{a}" },
  D: { brez: "D\\s*\\(", ctx: "b\\^2\\s*-\\s*4\\s*a\\s*c|b\\^\\{2\\}\\s*-\\s*4|\\\\sqrt\\s*\\{?\\s*D", teme: KVAD, n: "diskriminanta", en: "discriminant", r: "D = b^2 - 4ac", note: "D > 0: dve realni rešitvi · D = 0: ena · D < 0: nobene realne.", noteEn: "D > 0: two real solutions · D = 0: one · D < 0: none." },
  // x₁, x₂ sta tudi točki na intervalu (Lagrange, Rolle), člena zaporedja ali abscisi dveh točk premice.
  x_1: { ctx: QUADF, teme: KVAD, ne: "lagrang|rolle|cauchy|integral|odvod|zaporedj|povprečn", n: "prva rešitev (ničla)", en: "first solution (zero)", r: "x_{1,2} = \\frac{-b \\pm \\sqrt{D}}{2a}" },
  x_2: { ctx: QUADF, teme: KVAD, ne: "lagrang|rolle|cauchy|integral|odvod|zaporedj|povprečn", n: "druga rešitev (ničla)", en: "second solution (zero)", r: "x_{1,2} = \\frac{-b \\pm \\sqrt{D}}{2a}" },
  "x_1,2": { ctx: QUADF, teme: KVAD, ne: "lagrang|rolle|cauchy|integral|odvod|zaporedj|povprečn", n: "rešitvi kvadratne enačbe", en: "solutions of the quadratic equation", r: "x_{1,2} = \\frac{-b \\pm \\sqrt{D}}{2a}" },
  // k je tudi indeks (k-ti člen), celo število (x = π/2 + kπ), konstanta vzmeti; n tudi naravno število.
  k: { ctx: "y\\s*=\\s*k\\s*x|k\\s*=\\s*\\\\frac\\{\\s*y", teme: PREMICA, brez: "\\^\\s*\\{[^}]*k|\\^\\s*-?\\s*k|\\\\ln\\s*k|k\\s*t\\b", ne: `reakcij|hitrostn|arrhenius|razpad|števec\\s+(?:je\\s+)?višj|zaporedj|kombinator|binom|vsot|indukcij|period|trigonometr|${LIN_ENACBE}`, n: "smerni koeficient premice", en: "slope of the line", r: "k = \\frac{y_2 - y_1}{x_2 - x_1}" },
  // n je začetna vrednost le, če je y = k x + n v isti formuli ali povedi (pov), ne vsak n v temi o premici
  // (»za vsak naravni n«, razmerje m : n pri Talesovem izreku).
  n: { ctx: "y\\s*=\\s*k\\s*x\\s*[+-]\\s*n", pov: "y\\s*=\\s*k\\s*x\\s*[+-]\\s*n\\b", ne: "zaporedj|kombinator|binom|vsot|indukcij|mnogokotnik|potenc|koren", n: "začetna vrednost (presečišče z osjo y)", en: "y-intercept", r: "y = k x + n" },
  p: { ctx: "\\(\\s*x\\s*-\\s*p\\s*\\)", teme: "temensk|\\btemena\\b|\\bteme\\s+(?:parabol|t\\b|t\\()", ne: STOZNICE, n: "abscisa temena T(p, q)", en: "x-coordinate of the vertex T(p, q)", r: "p = -\\frac{b}{2a}" },
  q: { ctx: "\\(\\s*x\\s*-\\s*p\\s*\\)", teme: "temensk|\\btemena\\b|\\bteme\\s+(?:parabol|t\\b|t\\()", ne: STOZNICE, n: "ordinata temena T(p, q)", en: "y-coordinate of the vertex T(p, q)", r: "q = -\\frac{D}{4a}" },
  r: { ctx: CIRCLE, teme: KROG, brez: "\\\\int|\\\\sum|\\\\lim|\\\\sin|\\\\cos|\\\\tan", n: "polmer", en: "radius", r: "d = 2r" },
  d: { ctx: `${CIRCLE}|d\\s*=\\s*2\\s*r`, teme: KROG, ne: "razdalj|oddaljen|sekant|tangent|mimobežn|diagonal|štirikotnik|trapez|romb|deltoid|paralelogram", brez: "\\\\(?:o|i{0,2})int|\\\\frac\\{\\s*d|(?<![A-Za-z\\\\])d\\s*(?:[A-Za-z]|\\\\(?:varphi|vartheta|theta|phi|rho|tau|omega|lambda))(?![a-z])|\\\\mathrm\\s*\\{?\\s*d(?![a-zA-Z])", n: "premer", en: "diameter", r: "d = 2r" },
  o: { ctx: "o\\s*=", teme: GEOM, oba: true, n: "obseg", en: "perimeter (circumference)", r: "o = 2\\pi r" },
  S: { zan: `(?<![\\w\\\\])S${NUM_UNIT}(?:[kdcm]?m\\^\\{?2)`, ctx: "S\\s*=", teme: `${GEOM}|integral`, oba: true, ne: "zaporedj|vsot|statist|verjetn|množic", n: "ploščina", en: "area" },
  // »Mečemo kocko«: P je verjetnost, ne površina (docs/pomen-crk.md).
  P: { ctx: "P\\s*=", teme: "površin|prizm|piramid|kock|kvader|valj|stož|krogl|\\bteles|\\btelo\\b", oba: true, ne: "verjetn|dogod|meč", n: "površina telesa", en: "surface area" },
  V: { zan: `(?<![\\w\\\\])V${NUM_UNIT}(?:[kdcm]?m\\^\\{?3|[mdc]?L\\b)`, ctx: "V\\s*=", teme: "prostornin|prizm|piramid|kock|kvader|valj|stož|krogl|\\bteles|\\btelo\\b|vrteni", oba: true, ne: "verjetn|dogod|meč", n: "prostornina", en: "volume" },
  v: { ctx: "S\\s*=|V\\s*=|v_[a-c]", teme: GEOM, oba: true, ne: "hitrost|vektor", n: "višina", en: "height" },
  a_n: { teme: ZAPOREDJE, ne: "polinom", n: "splošni (n-ti) člen zaporedja", en: "general (n-th) term of the sequence" },
  a_1: { ctx: "a_n|a_\\{n", teme: ZAPOREDJE, oba: true, ne: "polinom", n: "prvi člen zaporedja", en: "first term of the sequence" },
  s_n: { teme: ZAPOREDJE, n: "vsota prvih n členov", en: "sum of the first n terms" },
  // α, β, γ so tudi ravnine, parametri, stopnje tveganja: kot samo ob kotih ali v geometriji.
  α: { ctx: KOTI, teme: `^kot|${GEOM}|\\bkot[ai]\\b|kotn|kotov|konstrukc|simetral|podobn|skladn|trigonometr|vektor`, ne: ANGLE_NE, n: "kot", en: "angle" },
  β: { ctx: KOTI, teme: `^kot|${GEOM}|\\bkot[ai]\\b|kotn|kotov|konstrukc|simetral|podobn|skladn|trigonometr|vektor`, ne: ANGLE_NE, n: "kot", en: "angle" },
  γ: { ctx: KOTI, teme: `^kot|${GEOM}|\\bkot[ai]\\b|kotn|kotov|konstrukc|simetral|podobn|skladn|trigonometr|vektor`, ne: ANGLE_NE, n: "kot", en: "angle" },
};

const SYMBOLS = { FIZ, KEM, MAT };
// Predmeti brez lastnega slovarja: kateri slovarji veljajo (po vrsti).
const SUBJECT_TABLES = { FIZ: ["FIZ"], KEM: ["KEM"], MAT: ["MAT"], NAR: ["FIZ", "KEM"], BIO: ["KEM"] };

// ---------- enote ----------
// n: ime (sl), en: ime (en), c: sestava v TeX, d/de: kaj pomeni.
const UNITS = {
  m: { n: "meter", en: "metre", d: "osnovna enota SI za dolžino", de: "SI base unit of length" },
  s: { n: "sekunda", en: "second", d: "osnovna enota SI za čas", de: "SI base unit of time" },
  kg: { n: "kilogram", en: "kilogram", d: "osnovna enota SI za maso", de: "SI base unit of mass" },
  g: { n: "gram", en: "gram", c: "1\\,\\mathrm{g} = 0{,}001\\,\\mathrm{kg}" },
  t: { n: "tona", en: "tonne", c: "1\\,\\mathrm{t} = 1000\\,\\mathrm{kg}" },
  A: { n: "amper", en: "ampere", d: "osnovna enota SI za električni tok", de: "SI base unit of electric current" },
  K: { n: "kelvin", en: "kelvin", c: "T = t + 273{,}15", d: "osnovna enota SI za temperaturo", de: "SI base unit of temperature" },
  "°C": { n: "stopinja Celzija", en: "degree Celsius", c: "t = T - 273{,}15" },
  mol: { n: "mol", en: "mole", c: "1\\,\\mathrm{mol} \\approx 6{,}022\\cdot 10^{23}", d: "osnovna enota SI za množino snovi (toliko delcev je v enem molu)", de: "SI base unit of amount of substance (this many particles are in one mole)" },
  min: { n: "minuta", en: "minute", c: "1\\,\\mathrm{min} = 60\\,\\mathrm{s}" },
  h: { n: "ura", en: "hour", c: "1\\,\\mathrm{h} = 3600\\,\\mathrm{s}" },
  N: { n: "newton", en: "newton", c: "1\\,\\mathrm{N} = 1\\,\\mathrm{kg\\cdot m/s^2}", d: "sila, ki telesu z maso 1 kg da pospešek 1 m/s²", de: "force that gives 1 kg an acceleration of 1 m/s²" },
  J: { n: "joule", en: "joule", c: "1\\,\\mathrm{J} = 1\\,\\mathrm{N\\cdot m} = 1\\,\\mathrm{kg\\cdot m^2/s^2}", d: "delo sile 1 N na poti 1 m", de: "work done by 1 N over 1 m" },
  W: { n: "watt", en: "watt", c: "1\\,\\mathrm{W} = 1\\,\\mathrm{J/s}", d: "1 joule dela v eni sekundi", de: "1 joule of work per second" },
  Pa: { n: "pascal", en: "pascal", c: "1\\,\\mathrm{Pa} = 1\\,\\mathrm{N/m^2}", d: "sila 1 N na ploskev 1 m²", de: "a force of 1 N on 1 m²" },
  bar: { n: "bar", en: "bar", c: "1\\,\\mathrm{bar} = 100\\,000\\,\\mathrm{Pa}" },
  V: { n: "volt", en: "volt", c: "1\\,\\mathrm{V} = 1\\,\\mathrm{J/C} = 1\\,\\mathrm{W/A}", d: "napetost, pri kateri naboj 1 C dobi 1 J energije", de: "voltage that gives 1 C of charge 1 J of energy" },
  Ω: { n: "ohm", en: "ohm", c: "1\\,\\Omega = 1\\,\\mathrm{V/A}" },
  C: { n: "coulomb", en: "coulomb", c: "1\\,\\mathrm{C} = 1\\,\\mathrm{A\\cdot s}", d: "naboj, ki ga tok 1 A prenese v 1 s", de: "charge carried by 1 A in 1 s" },
  F: { n: "farad", en: "farad", c: "1\\,\\mathrm{F} = 1\\,\\mathrm{C/V}" },
  T: { n: "tesla", en: "tesla", c: "1\\,\\mathrm{T} = 1\\,\\mathrm{N/(A\\cdot m)}" },
  Wb: { n: "weber", en: "weber", c: "1\\,\\mathrm{Wb} = 1\\,\\mathrm{T\\cdot m^2}" },
  Hz: { n: "hertz", en: "hertz", c: "1\\,\\mathrm{Hz} = 1\\,\\mathrm{s^{-1}}", d: "en nihaj ali obrat v sekundi", de: "one cycle per second" },
  eV: { n: "elektronvolt", en: "electronvolt", c: "1\\,\\mathrm{eV} \\approx 1{,}6\\cdot 10^{-19}\\,\\mathrm{J}" },
  kWh: { n: "kilovatna ura", en: "kilowatt-hour", c: "1\\,\\mathrm{kWh} = 3{,}6\\cdot 10^{6}\\,\\mathrm{J}" },
  L: { n: "liter", en: "litre", c: "1\\,\\mathrm{L} = 1\\,\\mathrm{dm^3} = 1000\\,\\mathrm{mL}" },
  l: { n: "liter", en: "litre", c: "1\\,\\mathrm{l} = 1\\,\\mathrm{dm^3} = 1000\\,\\mathrm{ml}" },
  "m/s": { n: "meter na sekundo", en: "metre per second", c: "\\mathrm{m} \\div \\mathrm{s}", d: "pot v metrih, prevožena v eni sekundi", de: "metres travelled in one second" },
  "km/h": { n: "kilometer na uro", en: "kilometre per hour", c: "1\\,\\mathrm{km/h} = \\tfrac{1}{3{,}6}\\,\\mathrm{m/s}" },
  "m/s^2": { n: "meter na sekundo na kvadrat", en: "metre per second squared", c: "\\mathrm{m/s} \\div \\mathrm{s}", d: "za koliko m/s se hitrost spremeni v eni sekundi", de: "change of speed in m/s every second" },
  "g/mol": { n: "gram na mol", en: "gram per mole", c: "\\mathrm{g} \\div \\mathrm{mol}", d: "masa enega mola snovi", de: "mass of one mole of a substance" },
  "kg/mol": { n: "kilogram na mol", en: "kilogram per mole", c: "\\mathrm{kg} \\div \\mathrm{mol}" },
  "mol/L": { n: "mol na liter", en: "mole per litre", c: "\\mathrm{mol} \\div \\mathrm{L}", d: "množina snovi v enem litru raztopine", de: "amount of substance in one litre of solution" },
  "mol/l": { n: "mol na liter", en: "mole per litre", c: "\\mathrm{mol} \\div \\mathrm{l}", d: "množina snovi v enem litru raztopine", de: "amount of substance in one litre of solution" },
  "g/L": { n: "gram na liter", en: "gram per litre", c: "\\mathrm{g} \\div \\mathrm{L}", d: "masa snovi v enem litru raztopine", de: "mass of substance in one litre of solution" },
  "L/mol": { n: "liter na mol", en: "litre per mole", c: "\\mathrm{L} \\div \\mathrm{mol}" },
  "kJ/mol": { n: "kilojoule na mol", en: "kilojoule per mole", c: "\\mathrm{kJ} \\div \\mathrm{mol}", d: "energija za en mol snovi ali reakcije", de: "energy per mole of substance or reaction" },
  "kg/m^3": { n: "kilogram na kubični meter", en: "kilogram per cubic metre", c: "\\mathrm{kg} \\div \\mathrm{m^3}", d: "masa enega kubičnega metra snovi", de: "mass of one cubic metre of substance" },
  "g/cm^3": { n: "gram na kubični centimeter", en: "gram per cubic centimetre", c: "1\\,\\mathrm{g/cm^3} = 1000\\,\\mathrm{kg/m^3}" },
  "g/mL": { n: "gram na mililiter", en: "gram per millilitre", c: "1\\,\\mathrm{g/mL} = 1\\,\\mathrm{g/cm^3}" },
  "N/m": { n: "newton na meter", en: "newton per metre", c: "\\mathrm{N} \\div \\mathrm{m}" },
  "N/C": { n: "newton na coulomb", en: "newton per coulomb", c: "1\\,\\mathrm{N/C} = 1\\,\\mathrm{V/m}" },
  "J/(kg K)": { n: "joule na kilogram in kelvin", en: "joule per kilogram kelvin", c: "\\mathrm{J} \\div (\\mathrm{kg}\\cdot\\mathrm{K})" },
  "J/(mol K)": { n: "joule na mol in kelvin", en: "joule per mole kelvin", c: "\\mathrm{J} \\div (\\mathrm{mol}\\cdot\\mathrm{K})" },
  "kg m/s": { n: "kilogram meter na sekundo", en: "kilogram metre per second", c: "\\mathrm{kg} \\cdot \\mathrm{m/s}", d: "enota gibalne količine (enako kot N·s)", de: "unit of momentum (same as N·s)" },
  "N m": { n: "newton meter", en: "newton metre", c: "\\mathrm{N} \\cdot \\mathrm{m}" },
  "1/s": { n: "na sekundo", en: "per second", c: "\\mathrm{s^{-1}}" },
  "1/mol": { n: "na mol", en: "per mole", c: "\\mathrm{mol^{-1}}" },
  "m^2": { n: "kvadratni meter", en: "square metre", c: "\\mathrm{m} \\cdot \\mathrm{m}" },
  "m^3": { n: "kubični meter", en: "cubic metre", c: "1\\,\\mathrm{m^3} = 1000\\,\\mathrm{L}" },
  "dm^3": { n: "kubični decimeter", en: "cubic decimetre", c: "1\\,\\mathrm{dm^3} = 1\\,\\mathrm{L}" },
  "cm^3": { n: "kubični centimeter", en: "cubic centimetre", c: "1\\,\\mathrm{cm^3} = 1\\,\\mathrm{mL}" },
  "cm^2": { n: "kvadratni centimeter", en: "square centimetre", c: "1\\,\\mathrm{cm^2} = 100\\,\\mathrm{mm^2}" },
  "%": { n: "odstotek", en: "percent", c: "1\\,\\% = 0{,}01" },
};
// Predpone SI: km, mA, kPa, μs … (sestava se izračuna sama).
const PREFIX = {
  k: ["kilo", "10^{3}"], M: ["mega", "10^{6}"], G: ["giga", "10^{9}"], h: ["hekto", "10^{2}"], d: ["deci", "10^{-1}"],
  c: ["centi", "10^{-2}"], m: ["mili", "10^{-3}"], μ: ["mikro", "10^{-6}"], n: ["nano", "10^{-9}"], p: ["piko", "10^{-12}"],
};
const PREFIX_BASES = ["m", "g", "s", "A", "V", "W", "J", "N", "Pa", "L", "l", "Hz", "eV", "C", "Ω", "F", "mol"];

const GREEK = {
  varepsilon: "ε", epsilon: "ε", hbar: "ħ", Pi: "Π", Sigma: "Σ", kappa: "κ", chi: "χ", psi: "ψ", xi: "ξ", zeta: "ζ", Gamma: "Γ", Lambda: "Λ", Theta: "Θ", Psi: "Ψ",
  alpha: "α", beta: "β", gamma: "γ", delta: "δ", eta: "η", lambda: "λ", mu: "μ", nu: "ν", omega: "ω", pi: "π", rho: "ρ",
  varphi: "φ", phi: "φ", Phi: "Φ", sigma: "σ", tau: "τ", theta: "θ", vartheta: "θ", varrho: "ρ", Omega: "Ω", Delta: "Δ",
};
// Ukazi, katerih argument je besedilo ali ime (ne simboli).
const RAW_ARG = new Set(["text", "mathrm", "textrm", "textbf", "textit", "mathbf", "operatorname", "begin", "end", "color", "textcolor", "label", "tag", "hspace", "vspace", "mbox", "htmlData", "htmlClass", "htmlId", "htmlStyle", "href", "url", "mathsf", "mathtt", "boldsymbol", "bm", "mathbb", "mathcal", "mathfrak", "ce", "pu", "overset", "underset", "stackrel"]);
const UNIT_CMDS = new Set(["text", "mathrm", "textrm", "mbox"]);

const normUnit = (s) =>
  s.replace(/\\[,;: ]|~/g, " ").replace(/\\cdot|·/g, " ").replace(/\\Omega/g, "Ω").replace(/\\mu\s*/g, "μ").replace(/\^\{(-?\d)\}/g, "^$1")
    .replace(/\\%/g, "%").replace(/\\circ\s*/g, "°").replace(/\^°|\^\{°\}/g, "°").replace(/[{}]/g, "").replace(/\s+/g, " ").trim();
const normSub = (s) => s.replace(/\\(mathrm|text|textrm)\s*/g, "").replace(/[{}\s]/g, "");

// ---------- iskanje ----------
let subjectFn = () => "MAT";
let override = null;
// Tema (ime teme, lekcije, sklopa, kartice): po njej se izbere pomen dvoumne črke (teme pri vnosu).
let topicFn = () => "";
let topicOverride = null;
export function setFormulaSubject(fn, topic = null) {
  subjectFn = typeof fn === "function" ? fn : () => fn;
  if (topic !== null) topicFn = typeof topic === "function" ? topic : () => topic;
}
// Začasno drug predmet (lekcija v učbeniku iz druge poti), med sinhronim izrisom.
// glossary: oznake lekcije iz bloka :::simboli (parseSymbolsBlock); imajo prednost pred slovarjem.
// topic: ime teme ali lekcije (»nedoločeni integral«); undefined = tema ostane, kot je.
export function withFormulaSubject(subject, fn, glossary = null, topic = undefined) {
  const prev = override;
  const prevTopic = topicOverride;
  override = glossary?.length ? registerGlossary(subject, glossary) : subject || null;
  if (topic !== undefined) topicOverride = String(topic ?? "");
  try {
    return fn();
  } finally {
    override = prev;
    topicOverride = prevTopic;
  }
}

// Predmet skupaj z oznakami lekcije za setFormulaSubject (tema odprta v poti: naloge, namigi, klepet).
export function subjectWithGlossary(subject, glossary) {
  return glossary?.length ? registerGlossary(subject, glossary) : subject;
}

// Pomen dvoumne črke: najprej formula (ctx, npr. G v F = G m₁m₂/r²), nato poved okoli nje (rich.js), če
// imenuje natanko enega od pomenov (»Planckova konstanta h = 6,63·10⁻³⁴ J s«), sicer privzeti pomen.
// Besede imena primerjamo po korenu (skloni: »gibalno količino«).
let sentence = "";
let scope = ""; // tema + besedilo bloka + poved (male črke): samo za izključitve (ne)
let tscope = ""; // tema + poved (male črke): za pomen po temi (teme)
let sentTex = ""; // TeX vseh formul v isti povedi (pov)
let blockLocal = null; // "@id" z oznakami, ki jih določi besedilo bloka (definitionsIn)
const escRe = (w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const stem = (w) => escRe(w.slice(0, Math.max(4, w.length - 1)));
const nameWords = (n) => String(n || "").replace(/\s*\(.*?\)/g, "").replace(/\$[^$]*\$/g, " ").toLowerCase().split(/[\s,]+/).filter((w) => w.length > 2);
const hasWord = (w, s) => new RegExp(`(^|[^\\p{L}])${stem(w)}`, "u").test(s);
function namedIn(e, s) {
  return [e.n, e.en].some((n) => {
    const words = nameWords(n);
    return words.length > 0 && words.every((w) => hasWord(w, s));
  });
}
// Ime iz besedila (»kjer je $k$ konstanta vzmeti«) in ime v slovarju poimenujeta isto: vse besede enega so v
// drugem, v obe smeri (»konstanta vzmeti« je v »prožnostni koeficient (konstanta vzmeti)«).
function sameName(e, name) {
  const s = String(name || "").toLowerCase();
  if (namedIn(e, s)) return true;
  const own = nameWords(s);
  return own.length > 0 && [e.n, e.en].some((n) => own.every((w) => hasWord(w, String(n || "").toLowerCase())));
}
// Ali vnos velja v tej formuli in kontekstu (scope: tema, besedilo bloka, poved). Glej opis polj pri MAT.
const reCache = new Map();
const re = (src, flags = "") => {
  const k = `${flags}/${src}`;
  if (!reCache.has(k)) reCache.set(k, new RegExp(src, flags));
  return reCache.get(k);
};
// ctx v formuli ali pov v drugi formuli iste povedi.
const byFormula = (e, tex) => (!!e.ctx && re(e.ctx).test(tex)) || (!!e.pov && !!sentTex && re(e.pov).test(sentTex));
function validIn(e, tex) {
  if (e.brez && re(e.brez).test(tex)) return false;
  if (e.zan && re(e.zan).test(tex)) return true;
  const byCtx = byFormula(e, tex);
  // Tema (in poved) da pomen; besedilo celega bloka ga lahko le izključi (ne).
  const byTopic = !!e.teme && !!tscope && re(e.teme, "iu").test(tscope) && !(e.ne && re(e.ne, "iu").test(scope)) && (!e.samo || byCtx || re(e.samo).test(tex));
  if (e.oba) return (!e.ctx || byCtx) && (!e.teme || byTopic);
  if (e.ctx || e.teme || e.pov) return byCtx || byTopic;
  return !(e.ne && scope && re(e.ne, "iu").test(scope)); // privzeti pomen: le, če ga besedilo ne izključi
}
const strong = (e) => !!(e.ctx || e.teme || e.pov || e.zan);
function pickIndex(list, tex) {
  const k = list.findIndex((e) => validIn(e, tex));
  if (k >= 0 && strong(list[k])) return k;
  if (sentence && list.length > 1) {
    const s = sentence.toLowerCase();
    const named = list.map((e, i) => (namedIn(e, s) ? i : -1)).filter((i) => i >= 0);
    if (named.length === 1) return named[0];
  }
  return k;
}
function pick(entry, tex) {
  if (!entry) return null;
  const list = Array.isArray(entry) ? entry : [entry];
  return list[pickIndex(list, tex)] || null;
}
// Kateri pomen dvoumne črke velja v tej formuli (in povedi): »FIZ.1« (tabela.indeks) ali "" za edini pomen.
function variantOf(key, subject, tex) {
  if (!subject || subject[0] === "@") return "";
  for (const tb of SUBJECT_TABLES[subject] || ["MAT"]) {
    const v = SYMBOLS[tb][key];
    if (!v) continue;
    const k = pickIndex(Array.isArray(v) ? v : [v], tex);
    if (k >= 0) return Array.isArray(v) && v.length > 1 ? `${tb}.${k}` : "";
  }
  return "";
}
// Pomen iz kode kartice (variantOf); null, če ga ni.
export function symbolVariant(key, vi) {
  const m = /^([A-Z]+)\.(\d+)$/.exec(vi || "");
  const v = m && SYMBOLS[m[1]]?.[key];
  return (Array.isArray(v) && v[Number(m[2])]) || null;
}

export function lookupSymbol(key, subject, tex = "") {
  if (subject === "@*") return { n: key }; // vse oznake (preverjevalnik lekcij)
  if (subject?.[0] === "@") return LOCAL[subject.slice(1)]?.table[key] || null;
  const tables = SUBJECT_TABLES[subject] || ["MAT"];
  for (const tb of tables) {
    const e = pick(SYMBOLS[tb][key], tex);
    if (e) return e;
  }
  return null;
}

export function lookupUnit(key) {
  if (!key) return null; // \mathrm{} ali nezaprt \mathrm{
  if (UNITS[key]) return { key, ...UNITS[key] };
  const p = [...key][0];
  const rest = key.slice(p.length);
  if (PREFIX[p] && PREFIX_BASES.includes(rest) && UNITS[rest]) {
    const [pn, pow] = PREFIX[p];
    const base = UNITS[rest];
    return { key, n: pn + base.n, en: pn + base.en, c: `1\\,\\mathrm{${key.replace("μ", "\\mu ")}} = ${pow}\\,\\mathrm{${rest}}` };
  }
  return null;
}

// Simbol v formuli: [ključ, predmet ali @lekcija] ali null. Ključ "F_rez", "x_1,2", "ΔH" …
// v_1, m_2, v_{povp} … brez lastnega vnosa = pomen osnovnega simbola.
// Vrstni red: oznaka lekcije s celim indeksom, slovar s celim indeksom, oznaka lekcije brez indeksa, slovar.
// Pomen iz slovarja je zanesljivejši od oznake iz besedila (pregled PR 463: »Naj bo $v = s/t$« je v izgubil
// »hitrost« in enoto, »kjer je $r$ en sam faktor« polmer): ime je enako (v obe smeri), formula ga potrdi (ctx),
// ali pa je to edini pomen črke v predmetu in besedilo da le zvezo (»Naj bo $v = s/t$«).
function dictSure(d, own, tex) {
  if (byFormula(d, tex)) return true;
  if (own.n) return sameName(d, own.n);
  return !strong(d) || (!!d.ctx && re(d.ctx).test(own.r || ""));
}
function symbolKey(base, sub, subject, tex) {
  const local = subject?.[0] === "@" ? subject : null;
  const dict = local ? LOCAL[local.slice(1)]?.subject : subject;
  const full = sub ? `${base}_${sub}` : null;
  // 1) Oznake lekcije (:::simboli) imajo prednost pred vsem.
  if (full && local && lookupSymbol(full, local)) return [full, local];
  // 2) Oznaka, določena v istem odstavku (»Za $H = G - F$ …«, »kjer je $v$ hitrost«): pred pomenom slovarja, ki
  //    velja le po temi; zanesljiv pomen slovarja (dictSure) ostane, ker ima enoto in zvezo.
  const k = blockLocal && (full && lookupSymbol(full, blockLocal) ? full : !sub && lookupSymbol(base, blockLocal) ? base : null);
  if (k && !(local && lookupSymbol(k, local))) {
    const d = lookupSymbol(k, dict, tex);
    if (!(d && dictSure(d, lookupSymbol(k, blockLocal), tex))) return [k, blockLocal];
  }
  if (full && lookupSymbol(full, dict, tex)) return [full, dict, variantOf(full, dict, tex)];
  // x₁, a_n, s_n imajo v slovarju svoj pomen (ničla, člen zaporedja): če tu ne velja, ne vemo, kaj so, zato ne
  // podedujejo oznake lekcije za x ali a (a_n v polinomu ni »osnova logaritma«).
  const ownFull = full && (SUBJECT_TABLES[dict] || ["MAT"]).some((tb) => SYMBOLS[tb][full]);
  if (local && !ownFull && lookupSymbol(base, local)) return [base, local];
  if (ownFull) return null;
  const d = lookupSymbol(base, dict, tex);
  if (!d) return null;
  // a₂₀, D_f, k_tr: črka z indeksom podeduje pomen osnovne črke le, če ga potrdi formula (ali je pomen edini),
  // ne samo tema (a₂₀ v zaporedju ni »vodilni koeficient«, D_f ni »diskriminanta«).
  if (sub && strong(d) && !byFormula(d, tex)) return null;
  return [base, dict, variantOf(base, dict, tex)];
}

// ---------- oznake lekcije (:::simboli) ----------
// Vsaka lekcija lahko našteje svoje oznake; tako je T v T = I/I_0 »prepustnost«, ne temperatura.
//   :::simboli
//   T | prepustnost (transmitanca) | T = \frac{I}{I_0} | – | število med 0 in 1
//   I, I_0 | jakost prepuščene in vpadne svetlobe | | | v poljubnih enotah detektorja
//   \varepsilon | molarni absorpcijski koeficient | | L\,mol^{-1}\,cm^{-1}
//   :::
// Polja: oznake (TeX, več z vejico) | ime | zveza v TeX (neobvezno) | enota (TeX ali ključ iz UNITS;
// »–« = nima enote; prazno = ne izpiši) | opomba (neobvezno).
const DECOR = { ddot: "ddot", bar: "bar", overline: "bar", hat: "hat", vec: "vec", tilde: "tilde", dot: "dot" };
const LOCAL = []; // id -> { subject, table: { ključ: vnos } }
const localIds = new Map();
export const SYMBOLS_BLOCK_RE = /^[ \t]*:::[ \t]*simboli[ \t]*\n([\s\S]*?)\n[ \t]*:::[ \t]*$/gm;

// Ključ oznake iz TeX: "I_0", "I_{0}" → "I_0"; "\\varepsilon" → "ε"; "\\Delta H" → "ΔH"; "\\mathrm{pH}" → "pH".
export function symbolKeyOf(tex) {
  let s = String(tex).trim();
  const dec = /^\\(ddot|bar|overline|hat|vec|tilde|dot)\s*(\{[^{}]*\}|\\[a-zA-Z]+|[A-Za-z])\s*(?:_\s*(\{.*\}|\\?[A-Za-z0-9]+|[+-]))?$/.exec(s); // \bar{x}, \vec F_1
  if (dec) {
    const inner = symbolKeyOf(dec[2].replace(/^\{|\}$/g, ""));
    return inner && !inner.includes("_") ? `${DECOR[dec[1]]}(${inner})${dec[3] ? `_${normSub(dec[3])}` : ""}` : null;
  }
  const dm = /^\\Delta\s*(\\(?:mathrm|text)\s*\{.*)$/.exec(s); // \Delta\mathrm{EN}
  if (dm) { const k = symbolKeyOf(dm[1]); return k ? `Δ${k}` : null; }
  const raw = /^\\(?:mathrm|text|textrm)\s*\{([^{}]+)\}([A-Za-z]?)\s*(?:_\s*(\{.*\}|\\(?:mathrm|text)\s*\{[^{}]*\}|\\?[A-Za-z0-9]+|[+-]))?$/.exec(s);
  if (raw) return raw[1].replace(/\s+/g, "") + raw[2] + (raw[3] ? `_${normSub(raw[3])}` : "");
  let delta = "";
  const d = /^\\Delta\s*(?!_)/.exec(s);
  if (d && s.length > d[0].length) { delta = "Δ"; s = s.slice(d[0].length); }
  const m = /^(\\([a-zA-Z]+)|[A-Za-z])\s*('*)\s*(?:_\s*(\{.*\}|\\(?:mathrm|text)\s*\{[^{}]*\}|\\?[A-Za-z0-9]+|[+-]))?\s*('*)$/.exec(s);
  if (!m) return null;
  const base = m[2] ? GREEK[m[2]] : m[1];
  if (!base) return null;
  const sub = m[4] ? normSub(m[4]) : "";
  return `${delta}${base}${m[3]}${m[5]}${sub ? `_${sub}` : ""}`;
}

// »I, I_0, x_{1,2}« → ["I", "I_0", "x_{1,2}"] (vejice v {…} ne ločijo).
function splitTop(s) {
  const out = [];
  let depth = 0;
  let cur = "";
  for (const ch of s) {
    if (ch === "{") depth++;
    else if (ch === "}") depth--;
    if (ch === "," && depth === 0) { out.push(cur.trim()); cur = ""; } else cur += ch;
  }
  out.push(cur.trim());
  return out.filter(Boolean);
}

// Besedilo bloka → [{ keys, tex, n, r, u, note }] in napake (za preverjevalnik).
export function parseSymbolsBlock(body) {
  const list = [];
  const errors = [];
  for (const raw of String(body).split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    const f = line.split("|").map((x) => x.trim());
    const texs = splitTop((f[0] || "").replace(/^\$|\$$/g, ""));
    const keys = texs.map(symbolKeyOf);
    if (!texs.length || keys.some((k) => !k)) { errors.push(`oznake ne razberem: »${f[0]}«`); continue; }
    if (!f[1]) { errors.push(`oznaka »${f[0]}« nima imena`); continue; }
    const strip = (x) => (x || "").replace(/^\$|\$$/g, "").trim();
    list.push({ keys, tex: texs, n: f[1], r: strip(f[2]), u: strip(f[3]), note: f.slice(4).join(" | ").trim() });
  }
  return { list, errors };
}

const glossaryIds = new WeakMap(); // isti seznam (ista lekcija) brez ponovnega JSON.stringify
function registerGlossary(subject, glossary) {
  const seen = glossaryIds.get(glossary);
  if (seen && seen[0] === subject) return seen[1];
  const sig = `${subject}|${JSON.stringify(glossary)}`;
  if (localIds.has(sig)) { glossaryIds.set(glossary, [subject, `@${localIds.get(sig)}`]); return `@${localIds.get(sig)}`; }
  const table = {};
  for (const g of glossary) g.keys.forEach((k, i) => { table[k] = { ...g, tex: g.tex?.[i] || null, texs: g.tex, local: true }; });
  const id = LOCAL.push({ subject: subject || "MAT", table }) - 1;
  localIds.set(sig, id);
  glossaryIds.set(glossary, [subject, `@${id}`]);
  return `@${id}`;
}

// Vse oznake v izrazu (za »sestavne dele« na kartici): [[ključ, predmet], …] brez ponovitev.
export function symbolsIn(tex, subject) {
  const out = [];
  const seen = new Set();
  const re = /\\htmlData\{fx=([^}]*)\}/g;
  for (const m of annotateTex(tex, subject).matchAll(re)) {
    const code = decodeURIComponent(m[1].replace(/\./g, "%"));
    const [kind, subj, key] = code.split(":");
    if (kind === "u" || seen.has(subj + key)) continue;
    seen.add(subj + key);
    out.push([key, subj, kind === "d"]);
  }
  return out;
}

// Obratno: izvirni LaTeX brez oznak \htmlData{fx=…}{…} (npr. označena formula iz lekcije za inštruktorja;
// KaTeX v <annotation> hrani označen zapis).
export function plainTex(tex) {
  let s = String(tex ?? "");
  for (let i = s.indexOf("\\htmlData{"); i >= 0; i = s.indexOf("\\htmlData{", i)) {
    const close = (from) => {
      let depth = 0;
      for (let j = from; j < s.length; j++) {
        if (s[j] === "\\") j++;
        else if (s[j] === "{") depth++;
        else if (s[j] === "}" && --depth === 0) return j;
      }
      return -1;
    };
    const a = close(i + 9); // konec {fx=…}
    const b = a >= 0 && s[a + 1] === "{" ? close(a + 1) : -1; // konec {telo}
    if (b < 0) {
      i += 10; // pokvarjena oznaka ostane, naslednje se vseeno odstranijo
      continue;
    }
    const body = s.slice(a + 2, b);
    // \varphi pred črko ostane ločen ukaz (\varphi x, ne \varphix).
    const gap = /\\[a-zA-Z]+$/.test(body) && /[a-zA-Z]/.test(s[b + 1] || "") ? " " : "";
    s = s.slice(0, i) + body + gap + s.slice(b + 1);
  }
  return s;
}

// Pred izrisom: ovije znane simbole in enote v \htmlData{fx=…}{…}.
// o.sentence: besedilo povedi okoli formule (rich.js) za izbiro pomena dvoumne črke; o.sentenceTex: TeX formul
// v isti povedi (pov). o.para in o.sentenceMd: odstavek in poved s formulo (z $…$), iz njiju so oznake, ki jih
// besedilo samo določi (»Za $X = …$« le v povedi).
// o.block: celotno besedilo (kartica, naloga, razdelek lekcije, sporočilo): samo za izključitve (ne).
// Pomen po temi (teme) velja le iz teme in povedi, ne iz celega bloka (pregled PR 463, točka 4).
export function annotateTex(tex, subject = override || subjectFn(), o = null) {
  if (!tex || tex.length > 4000 || /\\htmlData/.test(tex)) return tex;
  const prev = [sentence, scope, tscope, sentTex, blockLocal];
  sentence = o?.sentence || "";
  sentTex = o?.sentenceTex || "";
  const topic = topicOverride ?? (topicFn() || "");
  scope = [topic, o?.block || "", sentence].join("\n").toLowerCase().trim();
  tscope = [topic, sentence].join("\n").toLowerCase().trim();
  const defsFrom = o?.para ?? o?.block;
  blockLocal = defsFrom && subject !== "@*" ? definedIn(defsFrom, subject, o?.para != null ? o?.sentenceMd || "" : null) : null;
  try {
    return annotateInner(tex, subject);
  } finally {
    [sentence, scope, tscope, sentTex, blockLocal] = prev;
  }
}

// ---------- oznake, določene v besedilu ----------
// »Za $H = G - F$ je …«, »Naj bo $x_0 = …$«, »kjer je $D = b^2 - 4ac$« → oznaka z zvezo iz besedila;
// »kjer je $v$ hitrost, $t$ čas in $s$ pot« → oznake z imeni. Samo številska vrednost (»za $x = 2$«) ni definicija.
const DEF_LEAD = /(?:^|[^\p{L}])(?:za|naj\s+bo(?:do|sta)?|označimo(?:\s+z)?|definiramo|vpeljemo|uvedemo|vzemimo|kjer\s+(?:je|sta|so)|pri\s+čemer\s+(?:je|sta|so))\s*$/iu;
// Pred »za« je začetek besedila, vrstice ali alineje, ločilo ali oklepaj (za oznakami **, _ in presledki).
function zaStartsClause(src, at) {
  const from = Math.max(0, at - 60);
  const head = (from === 0 ? "\n" : "") + src.slice(from, at);
  return /(?:\n[ \t]*(?:[-*+][ \t]+|\d+[.)][ \t]*)?|[.:;,!?()…»«"])[\s*_]*za\s*$/iu.test(head);
}
const NAMED_LEAD =/(?:^|[^\p{L}])(?:kjer|pri\s+čemer)\s+(?:je|sta|so|pomeni|pomenita|pomenijo|označuje|označujeta)\s+(?=\$)/giu;
// Na najvišji ravni (zunaj {…}) razdeli pri znaku.
function splitAt(s, ch) {
  const out = [];
  let depth = 0;
  let cur = "";
  for (const c of s) {
    if (c === "{") depth++;
    else if (c === "}") depth--;
    if (c === ch && depth === 0) { out.push(cur); cur = ""; } else cur += c;
  }
  out.push(cur);
  return out;
}
// Desna stran »Za $X = …$« je izraz s spremenljivko, ne le vrednost: brez ukazov (\\dfrac, \\circ, \\,) in brez
// enot v \\mathrm{…}/\\text{…} (tudi gnezdenih: \\mathrm{\\frac{m}{s^2}}) mora ostati črka ali grška črka (ne π).
function stripRaw(s) {
  let out = "";
  for (let i = 0; i < s.length; ) {
    const m = /^\\(?:mathrm|text|textrm|mbox|operatorname)\s*\{/.exec(s.slice(i));
    if (!m) { out += s[i++]; continue; }
    let depth = 0;
    let j = i + m[0].length - 1;
    for (; j < s.length; j++) {
      if (s[j] === "\\") j++;
      else if (s[j] === "{") depth++;
      else if (s[j] === "}" && --depth === 0) break;
    }
    out += " ";
    i = j + 1;
  }
  return out;
}
export function hasVariable(rhs) {
  const bare = stripRaw(String(rhs || "")).replace(/\\([a-zA-Z]+)/g, (_, c) => (GREEK[c] && c !== "pi" ? "α" : " ")).replace(/\\./g, " ");
  return /[A-Za-zα]/.test(bare);
}
// »kjer je $r$ en sam faktor«, »kjer je $f$ zvezna«: ime mora biti samostalniška besedna zveza, ne števnik,
// zaimek, prislov ali sam pridevnik (pregled PR 463).
const NOT_NOUN = /^(?:en|ena|eno|eden|sam|sama|samo|ta|to|te|ti|tisti|tista|tisto|nek|neka|neko|isti|ista|isto|enak|enaka|enako|enaki|vsak|vsaka|vsako|kateri|katera|katero|ki|kar|tudi|še|le|že|zgoraj|spodaj|levo|desno|tukaj|tu|tam|potem|nato|zdaj|prvi|prva|prvo|drugi|druga|drugo|tretji|tretja|tretje|večji|večja|večje|manjši|manjša|manjše|pozitiven|negativen|konstanten|različen|različna|različno|poljuben|poljubna|poljubno|zvezen|odvedljiv|definiran|dana|dano|znan|znana|znano|lahko|enkrat|dvakrat|pol|tak|taka|tako|več|manj|vedno|zato|torej|in|ali|da|od|do|na|v|z|s|pri|po|za|nad|pod|med|se|si|je|so|sta|bo|bi|ni|pa|naj|ga|jo|ju|jih|mu|jim)$/u;
function nounPhrase(name) {
  const w = name.toLowerCase().split(/\s+/);
  if (NOT_NOUN.test(w[0])) return false;
  // En sam pridevnik ali deležnik (zvezna, realni, kemijska, odvedljiva, definirana) ni ime.
  if (w.length === 1 && /(?:[bcčdfghjklmprsštvzž]n|sk|šk|čk|ov|ev|ljiv)[aoi]$|.{3,}(?:an|en)[aoi]$/u.test(w[0])) return false;
  return true;
}
// za: false izpusti »Za $X = …$« (velja le v svoji povedi: »Za $x = 2a$ je $f(x) = 4a^2$«), »Naj bo«, »Označimo«,
// »kjer je« … veljajo v odstavku.
export function definitionsIn(text, { za = true } = {}) {
  const src = String(text || "");
  const defs = [];
  const seen = new Set();
  const add = (texKey, entry) => {
    const key = symbolKeyOf(texKey);
    if (!key || seen.has(key)) return;
    seen.add(key);
    defs.push({ keys: [key], tex: [texKey.trim()], n: "", r: "", u: "", note: "", def: true, ...entry });
  };
  // 1) »Za $X = …$«: X je oznaka, zveza je iz besedila.
  let last = 0;
  for (const m of src.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g)) {
    const before = src.slice(Math.max(last, m.index - 40), m.index);
    last = m.index + m[0].length;
    const lead = DEF_LEAD.exec(before);
    const isZa = !!lead && /za\s*$/iu.test(lead[0]);
    if (!lead || (!za && isZa)) continue;
    // »Za $X = …$« le na začetku povedi ali stavka: »v stolpcu za $y = 2x$«, »dvigne za $h = …$« ni definicija (N10).
    if (isZa && !zaStartsClause(src, m.index)) continue;
    const f = (m[1] ?? m[2]).trim();
    const parts = splitAt(f, "=");
    if (parts.length < 2) continue;
    const lhs = parts[0].trim();
    const rhs = parts[1].replace(/[,;.]\s*$/, "").trim();
    // Desna stran mora biti izraz (črka ali ukaz), ne le število; leva ena oznaka (H, x_0, \varphi).
    if (!rhs || !hasVariable(rhs)) continue;
    add(lhs, { r: `${lhs} = ${rhs}` });
  }
  // 2) »kjer je $v$ hitrost, $t$ čas in $s$ pot«.
  for (const m of src.matchAll(NAMED_LEAD)) {
    let rest = src.slice(m.index + m[0].length);
    for (let n = 0; n < 10; n++) {
      const g = /^\$([^$\n]+)\$\s+(?:je\s+|pa\s+)?(\p{L}[\p{L}\s-]{0,60}?)(?=\s*(?:[,;.:)]|$|\n|\s+in\s+\$|\s+ter\s+\$|\s*\())/u.exec(rest);
      if (!g) break;
      const name = g[2].trim();
      if (name.split(/\s+/).length <= 6 && !/=/.test(g[1]) && nounPhrase(name)) add(g[1], { n: name });
      rest = rest.slice(g[0].length).replace(/^\s*(?:\([^)]*\))?\s*[,;]?\s*(?:in|ter)?\s*/u, "");
      if (rest[0] !== "$") break;
    }
  }
  return defs;
}
const defsCache = new Map();
// Oznake iz besedila: iz povedi s formulo (tudi »Za $X = …$«) in iz odstavka (brez »Za«); poved ima prednost.
function definedIn(block, subject, sent = null) {
  const ck = `${subject}\u0000${block}\u0000${sent ?? "\u0001"}`;
  if (defsCache.has(ck)) return defsCache.get(ck);
  const defs = [];
  const seen = new Set();
  for (const d of sent === null ? definitionsIn(block) : [...definitionsIn(sent), ...definitionsIn(block, { za: false })]) {
    if (!seen.has(d.keys[0])) { seen.add(d.keys[0]); defs.push(d); }
  }
  const base = subject?.[0] === "@" ? LOCAL[subject.slice(1)]?.subject || "MAT" : subject;
  const id = defs.length ? registerGlossary(base, defs) : null;
  if (defsCache.size > 300) defsCache.clear();
  defsCache.set(ck, id);
  return id;
}
function annotateInner(tex, subject) {
  let out = "";
  let i = 0;
  const n = tex.length;
  const readGroup = (j) => { // {…} z gnezdenjem; vrne konec (izključno)
    if (tex[j] !== "{") return j;
    let depth = 0;
    for (let q = j; q < n; q++) {
      if (tex[q] === "\\") { q++; continue; }
      if (tex[q] === "{") depth++;
      else if (tex[q] === "}" && --depth === 0) return q + 1;
    }
    return n;
  };
  const readSub = (j) => { // _x ali _{…} ali _\mathrm{…}
    let q = j;
    while (tex[q] === " ") q++;
    if (tex[q] !== "_") return null;
    q++;
    while (tex[q] === " ") q++;
    if (tex[q] === "{") { const e = readGroup(q); return { end: e, raw: tex.slice(q + 1, e - 1) }; }
    const m = /^\\(?:mathrm|text)\s*\{[^{}]*\}|^\\[a-zA-Z]+|^[A-Za-z0-9+-]/.exec(tex.slice(q));
    return m ? { end: q + m[0].length, raw: m[0] } : null;
  };
  // Enota šele za številom ali presledkom za številom (9,81\,m/s²), sicer je besedilo ali kemijska formula.
  const afterNumber = () => /(\d\}?|\\[,;: ]|~|\[)\s*$/.test(out);
  // Za golim _ ali ^ ali ukazom brez oklepajev mora biti oznaka v {…} (glej symbol spodaj).
  const guard = (marked) => (/(?:[_^]|\\[a-zA-Z]+|\\[dt]?frac\s*\w)\s*$/.test(out) ? `{${marked}}` : marked);
  const wrap = (data, body) => `\\htmlData{fx=${encodeURIComponent(data).replace(/\./g, "%2E").replace(/%/g, ".")}}{${body}}`;
  // Simbol od i (vključno s predpono, npr. \Delta) do j (konec osnovnega znaka); indeks vedno prepišemo nespremenjen.
  const symbol = (base, from, j, delta) => {
    // Črtica (K'_f, E_0'): samo kot oznaka lekcije s črtico v ključu.
    if (subject?.[0] === "@" && (tex[j] === "'" || /^_[^']*'/.test(readSub(j) ? tex.slice(j, readSub(j).end + 1) : ""))) {
      let q = j;
      while (tex[q] === "'") q++;
      const s1 = readSub(q);
      let e = s1 ? s1.end : q;
      while (tex[e] === "'") e++;
      const primes = "'".repeat(q - j + (e - (s1 ? s1.end : q)));
      const keyP = `${base}${primes}${s1 ? `_${normSub(s1.raw)}` : ""}`;
      const hitP = primes && (lookupSymbol(keyP, subject) ? keyP : lookupSymbol(`${base}${primes}`, subject) && !s1 ? `${base}${primes}` : null);
      if (hitP) {
        const bare = /(?:[_^]|\\[a-zA-Z]+|\\[dt]?frac\s*\w)\s*$/.test(out);
        const marked = wrap(`${delta ? "d" : "s"}:${subject}:${hitP}`, tex.slice(from, e));
        out += bare ? `{${marked}}` : marked;
        return e;
      }
    }
    const sub = readSub(j);
    const hit = symbolKey(base, sub ? normSub(sub.raw) : "", subject, tex);
    let end = sub ? sub.end : j;
    if (!hit) { out += tex.slice(from, end); return end; }
    const [key, subj, vi] = hit;
    const withSub = key.includes("_") || (sub && /^\d$/.test(normSub(sub.raw)));
    let bodyEnd = withSub ? end : j;
    // v_0^2: potenca gre v isto oznako, sicer jo KaTeX postavi za indeks namesto nadenj.
    if (withSub) {
      let q = end;
      while (tex[q] === " ") q++;
      if (tex[q] === "^") {
        q++;
        while (tex[q] === " ") q++;
        const e2 = tex[q] === "{" ? readGroup(q) : q + (/^\\[a-zA-Z]+|^[A-Za-z0-9]/.exec(tex.slice(q))?.[0].length || 0);
        if (e2 > q) end = bodyEnd = e2;
      }
    }
    // Za golim _ ali ^ (\log_a, \int_a^b, e^x) ali ukazom brez oklepajev (\vec F, \bar v) mora biti
    // oznaka v zavitih oklepajih, sicer jo KaTeX vzame za argument brez njenih argumentov (rdeč surov LaTeX).
    const bare = /(?:[_^]|\\[a-zA-Z]+|\\[dt]?frac\s*\w)\s*$/.test(out);
    const marked = wrap(`${delta ? "d" : "s"}:${subj}:${key}${vi ? `:${vi}` : ""}`, tex.slice(from, bodyEnd).trimEnd());
    out += (bare ? `{${marked}}` : marked) + tex.slice(from, bodyEnd).match(/\s*$/)[0];
    out += tex.slice(bodyEnd, end);
    return end;
  };

  while (i < n) {
    const ch = tex[i];
    if (ch === "\\") {
      const m = /^\\([a-zA-Z]+)\s*/.exec(tex.slice(i));
      if (!m) { // \\[2mm]: razmik ostane nespremenjen (sicer m → masa in KaTeX ne zna izrisati)
        const sp = tex[i + 1] === "\\" && /^\\\\\s*\[[^\]]*\]/.exec(tex.slice(i));
        const len = sp ? sp[0].length : 2;
        out += tex.slice(i, i + len);
        i += len;
        continue;
      }
      const name = m[1];
      const j = i + m[0].length;
      if (RAW_ARG.has(name)) {
        let end = tex[j] === "{" ? readGroup(j) : j;
        // \begin{array}{c|c}: opis stolpcev ni formula.
        if (name === "begin" && /^\{\s*(?:array|darray|subarray|tabular)\s*\}\s*\{/.test(tex.slice(j))) end = readGroup(tex.indexOf("{", end));
        const whole = tex.slice(i, end);
        if (UNIT_CMDS.has(name) && tex[j] === "{") {
          const u = lookupUnit(normUnit(tex.slice(j + 1, end - 1)));
          if (u && afterNumber()) { out += wrap(`u:${u.key}`, whole); i = end; continue; }
          // Veččrkovna oznaka lekcije (\mathrm{pH}, \mathrm{Re}) ni enota, če ne stoji za številom.
          const own = subject?.[0] === "@" && subject !== "@*" && !/\d\}?\s*(\\[,;: ]|~)?\s*$/.test(out) && normSub(tex.slice(j + 1, end - 1));
          if (own && /^[A-Za-z]/.test(tex[end] || "")) { // \mathrm{p}K_a
            const sub2 = readSub(end + 1);
            const k2 = `${own}${tex[end]}`;
            const full2 = sub2 && `${k2}_${normSub(sub2.raw)}`;
            const hit2 = full2 && lookupSymbol(full2, subject) ? [full2, sub2.end] : lookupSymbol(k2, subject) ? [k2, end + 1] : null;
            if (hit2) { out += guard(wrap(`s:${subject}:${hit2[0]}`, tex.slice(i, hit2[1]))); i = hit2[1]; continue; }
          }
          if (own) {
            const sub = readSub(end);
            const full = sub && `${own}_${normSub(sub.raw)}`;
            if (full && lookupSymbol(full, subject)) { out += guard(wrap(`s:${subject}:${full}`, tex.slice(i, sub.end))); i = sub.end; continue; }
            // Pokončna enočrkovna enota (\frac{\text{kg}}{\text{m}^3}, km/\mathrm{h}, $\mathrm{A}$) in diferencial \mathrm{d}x nista oznaki lekcije (m ni masa).
            const notOwn = own.length === 1 && (lookupUnit(own) || (own === "d" && /^\s*(?:\^\s*\{?\d\}?\s*)?[A-Za-z\\]/.test(tex.slice(end))));
            if (!notOwn && lookupSymbol(own, subject)) { out += guard(wrap(`s:${subject}:${own}`, whole)); i = end; continue; }
          }
        }
        // Indeks za besedilom (\mathrm{SE}_r, \text{H}_2) ostane del besedila.
        const tail = UNIT_CMDS.has(name) && tex[j] === "{" ? readSub(end) : null;
        out += tail ? tex.slice(i, tail.end) : whole;
        i = tail ? tail.end : end;
        continue;
      }
      // \bar{x}, \vec F: lastna oznaka lekcije (aritmetična sredina), sicer pomen črke pod znakom.
      const dArg = DECOR[name] && subject?.[0] === "@" && /^\{\s*(\\[a-zA-Z]+|[A-Za-z])\s*\}|^(\\[a-zA-Z]+)|^[A-Za-z]/.exec(tex.slice(j));
      if (dArg) {
        const g1 = dArg[1] || dArg[2];
        const ch = g1 ? (GREEK[g1.slice(1)] || g1) : dArg[0];
        const key = `${DECOR[name]}(${ch})`;
        const after = j + dArg[0].length;
        const sub = readSub(after);
        const full = sub && `${key}_${normSub(sub.raw)}`;
        const hit = full && lookupSymbol(full, subject) ? [full, sub.end] : lookupSymbol(key, subject) ? [key, after] : null;
        if (hit) {
          const bare = /(?:[_^]|\\[a-zA-Z]+|\\[dt]?frac\s*\w)\s*$/.test(out);
          const marked = wrap(`s:${subject}:${hit[0]}`, tex.slice(i, hit[1]));
          out += bare ? `{${marked}}` : marked;
          i = hit[1];
          continue;
        }
      }
      const g = GREEK[name];
      // ΔH, ΔG … kot lastna oznaka lekcije; sicer Δx = »sprememba« osnovne količine.
      if (g === "Δ" && /^[A-Za-z]/.test(tex.slice(j)) && subject?.[0] === "@" && (subject === "@*" ? lookupSymbol(`Δ${tex[j]}`, subject) : Object.keys(LOCAL[subject.slice(1)]?.table || {}).some((k) => k.startsWith(`Δ${tex[j]}`)))) { i = symbol(`Δ${tex[j]}`, i, j + 1, false); continue; }
      const dg = g === "Δ" && subject?.[0] === "@" && /^\\([a-zA-Z]+)\s*/.exec(tex.slice(j));
      if (dg && GREEK[dg[1]] && lookupSymbol(`Δ${GREEK[dg[1]]}`, subject)) { i = symbol(`Δ${GREEK[dg[1]]}`, i, j + dg[0].length, false); continue; }
      // Gola Δ (razlika poti Δ = mλ) kot oznaka lekcije.
      if (g === "Δ" && subject?.[0] === "@" && subject !== "@*" && !/^[A-Za-z_\\{]/.test(tex.slice(j)) && lookupSymbol("Δ", subject)) { i = symbol("Δ", i, j, false); continue; }
      if (g === "Δ" && /^\s*_/.test(tex.slice(j)) && subject?.[0] === "@") { i = symbol("Δ", i, j, false); continue; }
      const dRaw = g === "Δ" && subject?.[0] === "@" && subject !== "@*" && /^\\(?:mathrm|text)\s*\{([^{}]+)\}/.exec(tex.slice(j));
      if (dRaw && lookupSymbol(`Δ${normSub(dRaw[1])}`, subject)) {
        out += guard(wrap(`s:${subject}:Δ${normSub(dRaw[1])}`, tex.slice(i, j + dRaw[0].length)));
        i = j + dRaw[0].length;
        continue;
      }
      if (g === "Δ" && /^[A-Za-z]/.test(tex.slice(j)) && symbolKey(tex[j], "", subject, tex)) { i = symbol(tex[j], i, j + 1, true); continue; }
      if (g === "Ω" && afterNumber()) { out += wrap("u:Ω", tex.slice(i, j).trimEnd()) + " "; i = j; continue; }
      // 5\,\mu\mathrm{m}: predpona enote, ne oznaka.
      if (g === "μ" && afterNumber()) {
        const um = /^\\(?:mathrm|text)\s*\{([^{}]+)\}|^[A-Za-z]+/.exec(tex.slice(j));
        const u = um && lookupUnit(`μ${um[1] || um[0]}`);
        if (u) { out += wrap(`u:${u.key}`, tex.slice(i, j + um[0].length)); i = j + um[0].length; continue; }
        out += tex.slice(i, j);
        i = j;
        continue;
      }
      if (g && g !== "Δ") { i = symbol(g, i, j, false); continue; }
      out += tex.slice(i, j);
      i = j;
      continue;
    }
    if (/[A-Za-z]/.test(ch)) { i = symbol(ch, i, i + 1, false); continue; }
    out += ch;
    i++;
  }
  return out;
}


export { SYMBOLS, UNITS, GREEK, SUBJECT_TABLES };

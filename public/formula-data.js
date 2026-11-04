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
    { ctx: "p\\s*=\\s*m\\s*\\\\?,?\\s*v", n: "gibalna količina", en: "momentum", r: "p = m\\,v", u: "kg m/s" },
    { n: "tlak", en: "pressure", r: "p = \\frac{F}{S}", u: "Pa" },
  ],
  S: { n: "ploščina (prečni presek)", en: "area (cross-section)", u: "m^2" },
  A: { n: "delo", en: "work", r: "A = F\\,s", u: "J" },
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
    { ctx: "h\\s*\\\\nu|h\\s*\\\\?,?\\s*f\\b|\\\\frac\\{h", n: "Planckova konstanta", en: "Planck constant", r: "h \\approx 6{,}63\\cdot 10^{-34}\\,\\mathrm{J\\,s}" },
    { n: "višina", en: "height", u: "m" },
  ],
  U: { n: "električna napetost", en: "voltage", r: "U = R\\,I", u: "V" },
  I: { n: "električni tok", en: "electric current", r: "I = \\frac{e}{t}", u: "A" },
  R: { n: "električni upor", en: "electrical resistance", r: "R = \\frac{U}{I}", u: "Ω" },
  e: { n: "električni naboj", en: "electric charge", r: "e = I\\,t", u: "C" },
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
  k: { n: "prožnostni koeficient (konstanta vzmeti)", en: "spring constant", r: "F = k\\,x", u: "N/m" },
  k_tr: { n: "koeficient trenja", en: "coefficient of friction", r: "k_{tr} = \\frac{F_{tr}}{F_n}" },
  x: { n: "raztezek (odmik)", en: "extension (displacement)", u: "m" },
  η: { n: "izkoristek", en: "efficiency", r: "\\eta = \\frac{P_{izh}}{P_{vh}}" },
  ω: { n: "kotna hitrost", en: "angular velocity", r: "\\omega = \\frac{2\\pi}{t_0}", u: "1/s" },
  r: { n: "polmer (razdalja)", en: "radius (distance)", u: "m" },
  M: { n: "navor", en: "torque", r: "M = r\\,F", u: "N m" },
  B: { n: "gostota magnetnega polja", en: "magnetic flux density", u: "T" },
  Φ: { n: "magnetni pretok", en: "magnetic flux", r: "\\Phi = B\\,S", u: "Wb" },
  C: { n: "kapaciteta", en: "capacitance", r: "C = \\frac{e}{U}", u: "F" },
  n: { n: "lomni količnik", en: "refractive index", r: "n = \\frac{c_0}{c}" },
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

const QUAD = "a\\s*x\\^|ax\\^|b\\^2\\s*-\\s*4\\s*a\\s*c";
const CIRCLE = "\\\\pi";
const MAT = {
  π: { n: "število pi", en: "pi", r: "\\pi \\approx 3{,}14159", note: "Razmerje med obsegom in premerom kroga.", noteEn: "Ratio of a circle's circumference to its diameter." },
  e: { ctx: "e\\^|\\\\ln|\\\\exp|\\\\lim", n: "Eulerjevo število", en: "Euler's number", r: "e \\approx 2{,}71828", note: "Osnova naravnega logaritma.", noteEn: "Base of the natural logarithm." },
  i: { ctx: "i\\^2|[0-9a-z]\\s*i\\b|\\+\\s*i|-\\s*i", n: "imaginarna enota", en: "imaginary unit", r: "i^2 = -1" },
  a: { ctx: QUAD, n: "vodilni koeficient (pri x²)", en: "leading coefficient (of x²)", r: "a x^2 + b x + c = 0", note: "a ≠ 0, sicer enačba ni kvadratna.", noteEn: "a ≠ 0, otherwise the equation is not quadratic." },
  b: { ctx: QUAD, n: "linearni koeficient (pri x)", en: "linear coefficient (of x)", r: "x_1 + x_2 = -\\frac{b}{a}" },
  c: { ctx: QUAD, n: "prosti člen", en: "constant term", r: "x_1 \\cdot x_2 = \\frac{c}{a}" },
  D: { ctx: "b\\^2\\s*-\\s*4\\s*a\\s*c|b\\^\\{2\\}\\s*-\\s*4", n: "diskriminanta", en: "discriminant", r: "D = b^2 - 4ac", note: "D > 0: dve realni rešitvi · D = 0: ena · D < 0: nobene realne.", noteEn: "D > 0: two real solutions · D = 0: one · D < 0: none." },
  x_1: { ctx: QUAD + "|x_\\{?1", n: "prva rešitev (ničla)", en: "first solution (zero)", r: "x_{1,2} = \\frac{-b \\pm \\sqrt{D}}{2a}" },
  x_2: { ctx: QUAD + "|x_\\{?2", n: "druga rešitev (ničla)", en: "second solution (zero)", r: "x_{1,2} = \\frac{-b \\pm \\sqrt{D}}{2a}" },
  "x_1,2": { n: "rešitvi kvadratne enačbe", en: "solutions of the quadratic equation", r: "x_{1,2} = \\frac{-b \\pm \\sqrt{D}}{2a}" },
  k: { ctx: "y\\s*=\\s*k\\s*x|k\\s*=\\s*\\\\frac\\{y", n: "smerni koeficient premice", en: "slope of the line", r: "k = \\frac{y_2 - y_1}{x_2 - x_1}" },
  n: { ctx: "y\\s*=\\s*k\\s*x\\s*[+-]\\s*n", n: "začetna vrednost (presečišče z osjo y)", en: "y-intercept", r: "y = k x + n" },
  p: { ctx: "\\(x\\s*-\\s*p\\)", n: "abscisa temena T(p, q)", en: "x-coordinate of the vertex T(p, q)", r: "p = -\\frac{b}{2a}" },
  q: { ctx: "\\(x\\s*-\\s*p\\)", n: "ordinata temena T(p, q)", en: "y-coordinate of the vertex T(p, q)", r: "q = -\\frac{D}{4a}" },
  r: { ctx: CIRCLE, n: "polmer", en: "radius", r: "d = 2r" },
  d: { ctx: CIRCLE + "|d\\s*=\\s*2\\s*r", n: "premer", en: "diameter", r: "d = 2r" },
  o: { ctx: "o\\s*=", n: "obseg", en: "perimeter (circumference)", r: "o = 2\\pi r" },
  S: { ctx: "S\\s*=", n: "ploščina", en: "area" },
  P: { ctx: "P\\s*=", n: "površina telesa", en: "surface area" },
  V: { ctx: "V\\s*=", n: "prostornina", en: "volume" },
  v: { ctx: "S\\s*=|V\\s*=|v_[a-c]", n: "višina", en: "height" },
  a_n: { n: "splošni (n-ti) člen zaporedja", en: "general (n-th) term of the sequence" },
  a_1: { ctx: "a_n|a_\\{n", n: "prvi člen zaporedja", en: "first term of the sequence" },
  s_n: { n: "vsota prvih n členov", en: "sum of the first n terms" },
  α: { n: "kot", en: "angle" },
  β: { n: "kot", en: "angle" },
  γ: { n: "kot", en: "angle" },
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
export function setFormulaSubject(fn) {
  subjectFn = typeof fn === "function" ? fn : () => fn;
}
// Začasno drug predmet (lekcija v učbeniku iz druge poti), med sinhronim izrisom.
// glossary: oznake lekcije iz bloka :::simboli (parseSymbolsBlock); imajo prednost pred slovarjem.
export function withFormulaSubject(subject, fn, glossary = null) {
  const prev = override;
  override = glossary?.length ? registerGlossary(subject, glossary) : subject || null;
  try {
    return fn();
  } finally {
    override = prev;
  }
}

// Predmet skupaj z oznakami lekcije za setFormulaSubject (tema odprta v poti: naloge, namigi, klepet).
export function subjectWithGlossary(subject, glossary) {
  return glossary?.length ? registerGlossary(subject, glossary) : subject;
}

function pick(entry, tex) {
  if (!entry) return null;
  const list = Array.isArray(entry) ? entry : [entry];
  for (const e of list) if (!e.ctx || new RegExp(e.ctx).test(tex)) return e;
  return null;
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
function symbolKey(base, sub, subject, tex) {
  const local = subject?.[0] === "@" ? subject : null;
  const dict = local ? LOCAL[local.slice(1)]?.subject : subject;
  const full = sub ? `${base}_${sub}` : null;
  if (full && local && lookupSymbol(full, local)) return [full, local];
  if (full && lookupSymbol(full, dict, tex)) return [full, dict];
  if (local && lookupSymbol(base, local)) return [base, local];
  return lookupSymbol(base, dict, tex) ? [base, dict] : null;
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
    if (a < 0 || s[a + 1] !== "{") break;
    const b = close(a + 1); // konec {telo}
    if (b < 0) break;
    s = s.slice(0, i) + s.slice(a + 2, b) + s.slice(b + 1);
  }
  return s;
}

// Pred izrisom: ovije znane simbole in enote v \htmlData{fx=…}{…}.
export function annotateTex(tex, subject = override || subjectFn()) {
  if (!tex || tex.length > 4000 || /\\htmlData/.test(tex)) return tex;
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
    const [key, subj] = hit;
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
    const marked = wrap(`${delta ? "d" : "s"}:${subj}:${key}`, tex.slice(from, bodyEnd).trimEnd());
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

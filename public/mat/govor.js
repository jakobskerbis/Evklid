// Izgovor formul za bralnike zaslona (K-11, j 26. 11. 2026: »Da, v ločenem PR«).
// Gumb ali povezava, ki je samo formula (izbira odgovora »[0, π] − {π/2}«), v Chromu nima imena: MathML, ki ga KaTeX
// doda za bralnike zaslona, ne šteje v ime gumba, zato bralnik prebere le »gumb«. texGovor(tex, jezik) iz zapisa LaTeX
// naredi besedilo za izgovor (»oglati oklepaj 0, pi oglati zaklepaj minus zaviti oklepaj pi skozi 2 zaviti zaklepaj«),
// imenujFormule(koren) ga zapiše v aria-label takih gumbov, initIzgovor() to dela sproti ob vsaki spremembi strani.
// Besede so za žive jezike vmesnika (public/i18n/languages.js LIVE_UI_LANGUAGES); drugi jeziki uporabijo prvega
// v verigi uiChain, ki ga poznamo (npr. sr → hr), sicer angleščino. Izgovor ni prevod naloge: črke, števila in
// besedilo v \text{} ostanejo, kot so zapisani.
// Brez DOM v texGovor (test/govor-formul.test.js ga preveri v Node).

const SLOVARJI = {
  sl: {
    cela: "cela", periodicno: "periodično", decimalka: ",", daljica: "daljica", zDesne: "z desne", zLeve: "z leve", fakulteta: "fakulteta", nad: "nad", velika: (g) => `velika ${g}`,
    osnova: "z osnovo", plus: "plus", minus: "minus", krat: "krat", deljeno: "deljeno z", je: "je enako", ni: "ni enako", priblizno: "je približno",
    manj: "je manjše od", vec: "je večje od", manjEnako: "je manjše ali enako", vecEnako: "je večje ali enako", plusMinus: "plus minus",
    skozi: "skozi", ulomek: "ulomek", stevec: "števec", imenovalec: "imenovalec", konecUlomka: "konec ulomka",
    na: "na", kvadrat: "na kvadrat", kub: "na kub", potenca: "na potenco", konecPotence: "konec potence", indeks: "indeks",
    koren: "kvadratni koren iz", nKoren: (n) => `${{ 2: "kvadratni", 3: "tretji", 4: "četrti", 5: "peti", 6: "šesti" }[n] ?? (/^\d+$/.test(n) ? `${n}.` : `${n}-ti`)} koren iz`, konecKorena: "konec korena",
    oklepaj: "oklepaj", zaklepaj: "zaklepaj", oglati: "oglati oklepaj", oglatiZ: "oglati zaklepaj", zaviti: "zaviti oklepaj", zavitiZ: "zaviti zaklepaj",
    abs: "absolutna vrednost", konecAbs: "konec absolutne vrednosti",
    neskoncno: "neskončno", element: "je element", niElement: "ni element", unija: "unija", presek: "presek", razlika: "brez",
    prazna: "prazna množica", podmnozica: "je podmnožica", zaKatere: "za katere velja", proti: "gre proti", sledi: "sledi",
    ekvivalentno: "natanko tedaj, ko", tri: "in tako naprej", stopinj: "stopinj", odstotkov: "odstotkov", vektor: "vektor",
    kot: "kot", trikotnik: "trikotnik", pravokotno: "je pravokotno na", vzporedno: "je vzporedno z",
    vsota: "vsota", integral: "integral", produkt: "produkt", od: "od", do: "do",
    fun: { arcsin: "arkus sinus", arccos: "arkus kosinus", arctan: "arkus tangens", sin: "sinus", cos: "kosinus", tan: "tangens", tg: "tangens", cot: "kotangens", ctg: "kotangens", log: "logaritem", ln: "naravni logaritem", lim: "limita", exp: "eksponentna funkcija" },
    grske: { alpha: "alfa", gamma: "gama", mu: "mi", nu: "ni", phi: "fi", chi: "hi", xi: "ksi", rho: "ro", kappa: "kapa", iota: "jota", upsilon: "ipsilon" },
  },
  en: {
    cela: "point", periodicno: "repeating", decimalka: ".", daljica: "segment", zDesne: "from the right", zLeve: "from the left", fakulteta: "factorial", nad: "choose", velika: (g) => `capital ${g}`,
    osnova: "base", plus: "plus", minus: "minus", krat: "times", deljeno: "divided by", je: "equals", ni: "is not equal to", priblizno: "is approximately",
    manj: "is less than", vec: "is greater than", manjEnako: "is less than or equal to", vecEnako: "is greater than or equal to", plusMinus: "plus or minus",
    skozi: "over", ulomek: "fraction", stevec: "numerator", imenovalec: "denominator", konecUlomka: "end fraction",
    na: "to the power of", kvadrat: "squared", kub: "cubed", potenca: "to the power of", konecPotence: "end exponent", indeks: "sub",
    koren: "square root of", nKoren: (n) => ({ 2: "square root of", 3: "cube root of" })[n] ?? `${n}${/^\d*1$/.test(n) && n !== "11" ? "st" : /^\d*2$/.test(n) && n !== "12" ? "nd" : /^\d*3$/.test(n) && n !== "13" ? "rd" : /^\d+$/.test(n) ? "th" : "-th"} root of`, konecKorena: "end root",
    oklepaj: "open paren", zaklepaj: "close paren", oglati: "open bracket", oglatiZ: "close bracket", zaviti: "open brace", zavitiZ: "close brace",
    abs: "absolute value of", konecAbs: "end absolute value",
    neskoncno: "infinity", element: "is in", niElement: "is not in", unija: "union", presek: "intersection", razlika: "minus",
    prazna: "empty set", podmnozica: "is a subset of", zaKatere: "such that", proti: "approaches", sledi: "implies",
    ekvivalentno: "if and only if", tri: "and so on", stopinj: "degrees", odstotkov: "percent", vektor: "vector",
    kot: "angle", trikotnik: "triangle", pravokotno: "is perpendicular to", vzporedno: "is parallel to",
    vsota: "sum", integral: "integral", produkt: "product", od: "from", do: "to",
    fun: { arcsin: "arc sine", arccos: "arc cosine", arctan: "arc tangent", sin: "sine", cos: "cosine", tan: "tangent", tg: "tangent", cot: "cotangent", ctg: "cotangent", log: "log", ln: "natural log", lim: "limit", exp: "exp" },
    grske: {},
  },
  de: {
    cela: "Komma", periodicno: "periodisch", decimalka: ",", daljica: "Strecke", zDesne: "von rechts", zLeve: "von links", fakulteta: "Fakultät", nad: "über", velika: (g) => `großes ${g}`,
    osnova: "zur Basis", plus: "plus", minus: "minus", krat: "mal", deljeno: "geteilt durch", je: "gleich", ni: "ungleich", priblizno: "ist ungefähr gleich",
    manj: "kleiner als", vec: "größer als", manjEnako: "kleiner oder gleich", vecEnako: "größer oder gleich", plusMinus: "plus minus",
    skozi: "durch", ulomek: "Bruch", stevec: "Zähler", imenovalec: "Nenner", konecUlomka: "Ende des Bruchs",
    na: "hoch", kvadrat: "Quadrat", kub: "hoch drei", potenca: "hoch", konecPotence: "Ende des Exponenten", indeks: "Index",
    koren: "Wurzel aus", nKoren: (n) => `${{ 2: "Quadratwurzel", 3: "dritte Wurzel", 4: "vierte Wurzel", 5: "fünfte Wurzel" }[n] ?? `${n}-te Wurzel`} aus`, konecKorena: "Ende der Wurzel",
    oklepaj: "Klammer auf", zaklepaj: "Klammer zu", oglati: "eckige Klammer auf", oglatiZ: "eckige Klammer zu", zaviti: "geschweifte Klammer auf", zavitiZ: "geschweifte Klammer zu",
    abs: "Betrag von", konecAbs: "Ende des Betrags",
    neskoncno: "unendlich", element: "ist Element von", niElement: "ist nicht Element von", unija: "vereinigt mit", presek: "geschnitten mit", razlika: "ohne",
    prazna: "leere Menge", podmnozica: "ist Teilmenge von", zaKatere: "für die gilt", proti: "gegen", sledi: "daraus folgt",
    ekvivalentno: "genau dann, wenn", tri: "und so weiter", stopinj: "Grad", odstotkov: "Prozent", vektor: "Vektor",
    kot: "Winkel", trikotnik: "Dreieck", pravokotno: "steht senkrecht auf", vzporedno: "ist parallel zu",
    vsota: "Summe", integral: "Integral", produkt: "Produkt", od: "von", do: "bis",
    fun: { arcsin: "Arkussinus", arccos: "Arkuskosinus", arctan: "Arkustangens", sin: "Sinus", cos: "Kosinus", tan: "Tangens", tg: "Tangens", cot: "Kotangens", ctg: "Kotangens", log: "Logarithmus", ln: "natürlicher Logarithmus", lim: "Limes", exp: "Exponentialfunktion" },
    grske: {},
  },
  hr: {
    cela: "cijela", periodicno: "periodično", decimalka: ",", daljica: "dužina", zDesne: "s desna", zLeve: "s lijeva", fakulteta: "faktorijel", nad: "povrh", velika: (g) => `veliko ${g}`,
    osnova: "po bazi", plus: "plus", minus: "minus", krat: "puta", deljeno: "podijeljeno s", je: "jednako", ni: "nije jednako", priblizno: "približno",
    manj: "manje od", vec: "veće od", manjEnako: "manje ili jednako", vecEnako: "veće ili jednako", plusMinus: "plus minus",
    skozi: "kroz", ulomek: "razlomak", stevec: "brojnik", imenovalec: "nazivnik", konecUlomka: "kraj razlomka",
    na: "na", kvadrat: "na kvadrat", kub: "na kub", potenca: "na potenciju", konecPotence: "kraj potencije", indeks: "indeks",
    koren: "drugi korijen iz", nKoren: (n) => `${{ 2: "drugi", 3: "treći", 4: "četvrti", 5: "peti" }[n] ?? (/^\d+$/.test(n) ? `${n}.` : `${n}-ti`)} korijen iz`, konecKorena: "kraj korijena",
    oklepaj: "otvorena zagrada", zaklepaj: "zatvorena zagrada", oglati: "otvorena uglata zagrada", oglatiZ: "zatvorena uglata zagrada", zaviti: "otvorena vitičasta zagrada", zavitiZ: "zatvorena vitičasta zagrada",
    abs: "apsolutna vrijednost", konecAbs: "kraj apsolutne vrijednosti",
    neskoncno: "beskonačno", element: "je element", niElement: "nije element", unija: "unija", presek: "presjek", razlika: "bez",
    prazna: "prazan skup", podmnozica: "je podskup", zaKatere: "takvih da", proti: "teži prema", sledi: "slijedi",
    ekvivalentno: "ako i samo ako", tri: "i tako dalje", stopinj: "stupnjeva", odstotkov: "posto", vektor: "vektor",
    kot: "kut", trikotnik: "trokut", pravokotno: "okomito je na", vzporedno: "paralelno je s",
    vsota: "suma", integral: "integral", produkt: "produkt", od: "od", do: "do",
    fun: { arcsin: "arkus sinus", arccos: "arkus kosinus", arctan: "arkus tangens", sin: "sinus", cos: "kosinus", tan: "tangens", tg: "tangens", cot: "kotangens", ctg: "kotangens", log: "logaritam", ln: "prirodni logaritam", lim: "limes", exp: "eksponencijalna funkcija" },
    grske: { alpha: "alfa", gamma: "gama", mu: "mi", nu: "ni", phi: "fi", chi: "hi", xi: "ksi", rho: "ro", kappa: "kapa", iota: "jota", upsilon: "ipsilon" },
  },
  it: {
    cela: "virgola", periodicno: "periodico", decimalka: ",", daljica: "segmento", zDesne: "da destra", zLeve: "da sinistra", fakulteta: "fattoriale", nad: "su", velika: (g) => `${g} maiuscola`,
    osnova: "in base", plus: "più", minus: "meno", krat: "per", deljeno: "diviso", je: "uguale a", ni: "diverso da", priblizno: "circa uguale a",
    manj: "minore di", vec: "maggiore di", manjEnako: "minore o uguale a", vecEnako: "maggiore o uguale a", plusMinus: "più o meno",
    skozi: "fratto", ulomek: "frazione", stevec: "numeratore", imenovalec: "denominatore", konecUlomka: "fine frazione",
    na: "elevato a", kvadrat: "al quadrato", kub: "al cubo", potenca: "elevato a", konecPotence: "fine esponente", indeks: "pedice",
    koren: "radice quadrata di", nKoren: (n) => `${{ 2: "radice quadrata", 3: "radice cubica", 4: "radice quarta", 5: "radice quinta" }[n] ?? `radice ${n}-esima`} di`, konecKorena: "fine radice",
    oklepaj: "aperta parentesi", zaklepaj: "chiusa parentesi", oglati: "aperta parentesi quadra", oglatiZ: "chiusa parentesi quadra", zaviti: "aperta parentesi graffa", zavitiZ: "chiusa parentesi graffa",
    abs: "valore assoluto di", konecAbs: "fine valore assoluto",
    neskoncno: "infinito", element: "appartiene a", niElement: "non appartiene a", unija: "unione", presek: "intersezione", razlika: "meno",
    prazna: "insieme vuoto", podmnozica: "è sottoinsieme di", zaKatere: "tali che", proti: "tende a", sledi: "implica",
    ekvivalentno: "se e solo se", tri: "e così via", stopinj: "gradi", odstotkov: "percento", vektor: "vettore",
    kot: "angolo", trikotnik: "triangolo", pravokotno: "è perpendicolare a", vzporedno: "è parallelo a",
    vsota: "somma", integral: "integrale", produkt: "produttoria", od: "da", do: "a",
    fun: { arcsin: "arcoseno", arccos: "arcocoseno", arctan: "arcotangente", sin: "seno", cos: "coseno", tan: "tangente", tg: "tangente", cot: "cotangente", ctg: "cotangente", log: "logaritmo", ln: "logaritmo naturale", lim: "limite", exp: "esponenziale" },
    grske: { alpha: "alfa", mu: "mu", nu: "nu", phi: "fi", chi: "chi", xi: "csi" },
  },
  hu: {
    cela: "egész", periodicno: "szakaszos", decimalka: ",", daljica: "szakasz", zDesne: "jobbról", zLeve: "balról", fakulteta: "faktoriális", nad: "alatt a", velika: (g) => `nagy ${g}`,
    osnova: "alap", plus: "plusz", minus: "mínusz", krat: "szorozva", deljeno: "osztva", je: "egyenlő", ni: "nem egyenlő", priblizno: "körülbelül egyenlő",
    manj: "kisebb, mint", vec: "nagyobb, mint", manjEnako: "kisebb vagy egyenlő, mint", vecEnako: "nagyobb vagy egyenlő, mint", plusMinus: "plusz-mínusz",
    skozi: "per", ulomek: "tört", stevec: "számláló", imenovalec: "nevező", konecUlomka: "tört vége",
    na: "a következő hatványon:", kvadrat: "négyzet", kub: "köb", potenca: "a következő hatványon:", konecPotence: "kitevő vége", indeks: "index",
    koren: "négyzetgyök", nKoren: (n) => ({ 2: "négyzetgyök", 3: "köbgyök" })[n] ?? `${n}. gyök`, konecKorena: "gyök vége",
    oklepaj: "nyitó zárójel", zaklepaj: "záró zárójel", oglati: "nyitó szögletes zárójel", oglatiZ: "záró szögletes zárójel", zaviti: "nyitó kapcsos zárójel", zavitiZ: "záró kapcsos zárójel",
    abs: "abszolút érték", konecAbs: "abszolút érték vége",
    neskoncno: "végtelen", element: "eleme", niElement: "nem eleme", unija: "unió", presek: "metszet", razlika: "különbség",
    prazna: "üres halmaz", podmnozica: "részhalmaza", zaKatere: "amelyekre", proti: "tart", sledi: "ebből következik",
    ekvivalentno: "akkor és csak akkor", tri: "és így tovább", stopinj: "fok", odstotkov: "százalék", vektor: "vektor",
    kot: "szög", trikotnik: "háromszög", pravokotno: "merőleges", vzporedno: "párhuzamos",
    vsota: "összeg", integral: "integrál", produkt: "szorzat", od: "alsó határ", do: "felső határ",
    fun: { arcsin: "arkusz szinusz", arccos: "arkusz koszinusz", arctan: "arkusz tangens", sin: "szinusz", cos: "koszinusz", tan: "tangens", tg: "tangens", cot: "kotangens", ctg: "kotangens", log: "logaritmus", ln: "természetes logaritmus", lim: "határérték", exp: "exponenciális" },
    grske: { alpha: "alfa", beta: "béta", eta: "éta", zeta: "dzéta", theta: "théta", epsilon: "epszilon", iota: "ióta", sigma: "szigma", psi: "pszí", xi: "kszí", chi: "khí", mu: "mű", nu: "nű", rho: "ró", pi: "pí", phi: "fí", omega: "ómega" },
  },
};
export const JEZIKI_GOVORA = Object.keys(SLOVARJI);

const GRSKE = ["alpha", "beta", "gamma", "delta", "epsilon", "varepsilon", "zeta", "eta", "theta", "vartheta", "iota", "kappa", "lambda", "mu", "nu", "xi", "pi", "rho", "sigma", "tau", "upsilon", "phi", "varphi", "chi", "psi", "omega", "Gamma", "Delta", "Theta", "Lambda", "Xi", "Pi", "Sigma", "Phi", "Psi", "Omega"];
const GRSKA_IME = (ime) => ime.replace(/^var/, "").toLowerCase();
// Ukazi brez izgovora (presledki, velikost, slog).
const TIHO = new Set(["left", "right", "big", "Big", "bigg", "Bigg", "bigl", "bigr", "Bigl", "Bigr", "displaystyle", "textstyle", "scriptstyle", "limits", "nolimits", ",", ";", ":", "!", " ", "quad", "qquad", "enspace", "thinspace", "medspace", "thickspace", "negthinspace", "cr", "\\"]);
// Ukazi z enim argumentom, ki ga samo preberemo (slog, pisava, okrasje).
const PREBERI = new Set(["mathrm", "mathbf", "mathit", "mathsf", "mathtt", "mathcal", "mathbb", "mathfrak", "boldsymbol", "bm", "operatorname", "hat", "bar", "tilde", "dot", "ddot", "overline", "underline", "widehat", "widetilde", "overrightarrow", "mathring", "color", "textcolor", "boxed", "pmb"]);
const BESEDILO = new Set(["text", "textrm", "textbf", "textit", "mbox", "textsf", "texttt", "textup"]);
const FUN = ["sin", "cos", "tan", "tg", "cot", "ctg", "log", "ln", "lim", "exp", "arcsin", "arccos", "arctan", "sinh", "cosh", "tanh", "max", "min", "gcd", "det", "deg", "dim", "ker", "sup", "inf", "lg"];

// Razčleni TeX v žetone: ukaz (\ime ali \znak), posebni znaki ^ _ & ~ { }, število, posamezen znak, presledek.
// Decimalna vejica: {,} vedno (tako jo zapiše aplikacija, mat/izris.js), gola vejica med števkami le zunaj oklepajev,
// indeksov in seznamov (»3,5«); v [-1,1], (0,10), \{1,2,3\}, x_{1,2} in 1,2,3 loči števili (pregled 3, #K-11).
// Periodično decimalno število 0{,}1\overline{6}: žeton s per.
function zetoni(tex) {
  const out = [];
  const s = String(tex ?? "");
  let oklepaji = 0; // ( [ \{ \langle
  const skupine = []; // za vsako odprto {: ali je indeks (za _)
  for (let i = 0; i < s.length; ) {
    const c = s[i];
    const r = s.slice(i);
    if (c === "\\") {
      const m = /^\\([a-zA-Z]+|.)/.exec(r);
      if (!m) break;
      out.push({ k: "ukaz", v: m[1] });
      if (["{", "lbrace", "langle", "lvert"].includes(m[1])) oklepaji++;
      if (["}", "rbrace", "rangle", "rvert"].includes(m[1])) oklepaji = Math.max(0, oklepaji - 1);
      i += m[0].length;
      if (/^[a-zA-Z]/.test(m[1])) while (s[i] === " ") i++; // presledek za \ukaz le konča ime ukaza
    } else if (/\d/.test(c)) {
      const vSeznamu = oklepaji > 0 || skupine.includes(true) || (s[i - 1] === "," && /\d/.test(s[i - 2] ?? ""));
      let v = /^\d+/.exec(r)[0];
      let j = i + v.length;
      for (;;) {
        const o = s.slice(j);
        let m;
        if ((m = /^\{,\}(\d+)/.exec(o)) || (m = /^\.(\d+)/.exec(o))) v += "," + m[1];
        else if (!vSeznamu && !v.includes(",") && (m = /^,(\d+)(?![\d,]*,\d)/.exec(o))) v += "," + m[1];
        else if ((m = /^\\,(\d{3})(?!\d)/.exec(o))) v += m[1]; // 1\,000 (presledek med tisočicami)
        else break;
        j += m[0].length;
      }
      const per = /^(\{,\}|[.,])?\\overline\s*\{(\d+)\}/.exec(s.slice(j));
      if (per && (per[1] || v.includes(","))) {
        out.push({ k: "st", v: v.includes(",") ? v : v + ",", per: per[2] });
        j += per[0].length;
      } else out.push({ k: "st", v });
      i = j;
    } else if (/\s/.test(c)) {
      if (out.at(-1)?.k !== "sp") out.push({ k: "sp", v: " " }); // šteje le v \text{…}
      i++;
    } else {
      if (c === "(" || c === "[") oklepaji++;
      if (c === ")" || c === "]") oklepaji = Math.max(0, oklepaji - 1);
      if (c === "{") skupine.push(out.at(-1)?.v === "_" && out.at(-1)?.k === "zn");
      if (c === "}") skupine.pop();
      out.push({ k: "zn", v: c });
      i++;
    }
  }
  return out;
}

function govor(tex, S) {
  const z = zetoni(tex);
  let i = 0;
  let absOdprt = 0;
  // Presledki štejejo samo v besedilu (\text{…}); drugje jih preskočimo.
  const pogled = () => {
    while (z[i]?.k === "sp") i++;
    return z[i];
  };
  const vzemi = () => (pogled(), z[i++]);
  const stevilo = (t) => {
    if (!t.per) return t.v.replace(/,/g, S.decimalka);
    const [cela, dec] = t.v.split(",");
    return `${cela} ${S.cela} ${dec ? `${dec}, ` : ""}${t.per} ${S.periodicno}`;
  };
  // Zapis, ki ga loči le pavza (»kvadratni koren iz x, plus 1« ≠ »kvadratni koren iz x plus 1«): za njim vejica,
  // razen pred relacijo, zaklepajem ali ločilom (te pomen že ločijo).
  // Ena skupina {…} ali en sam žeton kot argument.
  function argument() {
    const t = pogled();
    if (!t) return { s: "", preprost: true, surovo: "" };
    if (t.k === "zn" && t.v === "{") {
      i++;
      const zac = i;
      const d = zaporedje("}");
      if (pogled()?.v === "}") i++;
      return { ...d, zetonov: i - zac - 1 };
    }
    // Brez zavitih oklepajev je argument en znak: \frac12 = 1/2, x^23 = x² · 3 (kot izris KaTeX).
    if (t.k === "st" && !t.per && /^\d\d/.test(t.v)) z.splice(i, 1, { k: "st", v: t.v[0] }, { k: "st", v: t.v.slice(1) });
    return atom();
  }
  // Besedilo skupine brez izgovora (\text{…}, \operatorname{…}).
  function surovaSkupina() {
    if (pogled()?.v !== "{") return vzemi()?.v ?? "";
    i++;
    let globina = 1;
    let out = "";
    while (i < z.length) {
      const t = z[i++];
      if (t.v === "{" && t.k === "zn") globina++;
      if (t.v === "}" && t.k === "zn" && --globina === 0) break;
      out += t.k === "ukaz" ? (t.v === " " || t.v === "," ? " " : t.v.length === 1 ? t.v : "") : t.v;
    }
    return out.trim();
  }
  function izbirni() {
    if (pogled()?.v !== "[") return null;
    i++;
    const d = zaporedje("]");
    if (pogled()?.v === "]") i++;
    return d;
  }
  function atom() {
    const t = vzemi();
    if (!t) return { s: "", preprost: true };
    if (t.k === "st") return { s: stevilo(t), preprost: !t.per };
    if (t.k === "zn") {
      const c = t.v;
      if (c === "{") {
        const d = zaporedje("}");
        if (pogled()?.v === "}") i++;
        return d;
      }
      if (/[a-zA-Z]/.test(c)) return { s: c, preprost: true };
      const ZN = { "+": S.plus, "-": S.minus, "−": S.minus, "*": S.krat, "·": S.krat, "×": S.krat, "/": S.deljeno, ":": S.deljeno, "=": S.je, "<": S.manj, ">": S.vec, "(": S.oklepaj, ")": S.zaklepaj, "[": S.oglati, "]": S.oglatiZ, "'": "'", ",": ",", ";": ";", "!": S.fakulteta, "%": S.odstotkov, "°": S.stopinj, "∞": S.neskoncno, "π": S.grske.pi ?? "pi", "≤": S.manjEnako, "≥": S.vecEnako, "≠": S.ni, "≈": S.priblizno };
      if (c === "|") return abs();
      if (c === "&" || c === "~") return { s: "", preprost: true };
      return { s: ZN[c] ?? c, preprost: !(c in ZN) || c === "'", locilo: "=<>)],;≤≥≠≈".includes(c) };
    }
    const u = t.v;
    if (u === "\\") return { s: ",", preprost: true, locilo: true }; // nova vrstica (cases, aligned)
    if (u === "begin" || u === "end") {
      const okolje = surovaSkupina(); // {cases}
      if (u === "begin" && /^(?:array|tabular)$/.test(okolje) && pogled()?.v === "{") surovaSkupina(); // {cc}
      return { s: u === "end" ? "," : "", preprost: true, locilo: true };
    }
    if (TIHO.has(u)) {
      // \left| … \right| je absolutna vrednost
      if ((u === "left" || u === "right") && pogled()?.v === "|") {
        i++;
        return u === "left" ? odpriAbs() : zapriAbs();
      }
      if ((u === "left" || u === "right") && (pogled()?.v === "." || pogled()?.v === "\\")) i++;
      return { s: "", preprost: true };
    }
    if (u === "frac" || u === "dfrac" || u === "tfrac" || u === "cfrac") {
      const a = argument();
      const b = argument();
      if (a.preprost && b.preprost) return { s: `${a.s} ${S.skozi} ${b.s}`, preprost: false, pavza: true };
      return { s: `${S.ulomek}, ${S.stevec} ${a.s}, ${S.imenovalec} ${b.s}, ${S.konecUlomka}`, preprost: false };
    }
    if (u === "sqrt") {
      const n = izbirni();
      const a = argument();
      const zac = n ? S.nKoren(n.s) : S.koren;
      return a.preprost ? { s: `${zac} ${a.s}`, preprost: false, pavza: true } : { s: `${zac} ${a.s}, ${S.konecKorena}`, preprost: false };
    }
    if (u === "binom" || u === "dbinom" || u === "tbinom") {
      const a = argument();
      const b = argument();
      if (a.preprost && b.preprost) return { s: `${a.s} ${S.nad} ${b.s}`, preprost: false, pavza: true };
      return { s: `${S.oklepaj} ${a.s} ${S.nad} ${b.s} ${S.zaklepaj}`, preprost: false };
    }
    if (u === "overline") {
      // \overline{AB}: daljica; \overline{z}, \overline{x}: samo črka
      const a = argument();
      return /^[A-Z](?: [A-Z])+$/.test(a.s) ? { s: `${S.daljica} ${a.s}`, preprost: false, pavza: true } : a;
    }
    if (u === "mathrm" || u === "textup") {
      // \mathrm{cm}, \mathrm{d}: enota ali oznaka kot beseda (ne »c m«)
      let j = i;
      while (z[j]?.k === "sp") j++;
      if (z[j]?.v === "{") {
        let k = j + 1;
        while (z[k]?.k === "zn" && /^[a-zA-Z]$/.test(z[k].v)) k++;
        if (z[k]?.v === "}" && k > j + 1) return { s: surovaSkupina(), preprost: true };
      }
    }
    if (u === "htmlData" || u === "htmlClass" || u === "htmlId" || u === "htmlStyle") {
      surovaSkupina(); // {fx=…}
      return argument();
    }
    if (BESEDILO.has(u)) return { s: surovaSkupina(), preprost: true };
    if (u === "operatorname") {
      const ime = surovaSkupina();
      return { s: S.fun[ime] ?? ime, preprost: true };
    }
    if (u === "vec" || u === "overrightarrow") {
      const a = argument();
      return { s: `${S.vektor} ${a.s}`, preprost: true };
    }
    if (PREBERI.has(u)) {
      if (u === "color" || u === "textcolor") surovaSkupina();
      if (u === "color") return { s: "", preprost: true };
      return argument();
    }
    if (GRSKE.includes(u)) {
      const ime = GRSKA_IME(u);
      const g = S.grske[ime] ?? ime;
      return { s: /^[A-Z]/.test(u) ? S.velika(g) : g, preprost: true };
    }
    if (FUN.includes(u)) return { s: S.fun[u] ?? u, preprost: true, fun: u };
    const SIM = {
      cdot: S.krat, times: S.krat, div: S.deljeno, pm: S.plusMinus, mp: S.plusMinus, le: S.manjEnako, leq: S.manjEnako, leqslant: S.manjEnako,
      ge: S.vecEnako, geq: S.vecEnako, geqslant: S.vecEnako, ne: S.ni, neq: S.ni, approx: S.priblizno, doteq: S.priblizno, infty: S.neskoncno,
      in: S.element, notin: S.niElement, cup: S.unija, cap: S.presek, setminus: S.razlika, emptyset: S.prazna, varnothing: S.prazna,
      subset: S.podmnozica, subseteq: S.podmnozica, mid: S.zaKatere, to: S.proti, rightarrow: S.proti, Rightarrow: S.sledi, implies: S.sledi,
      Leftrightarrow: S.ekvivalentno, iff: S.ekvivalentno, dots: S.tri, ldots: S.tri, cdots: S.tri, degree: S.stopinj, "%": S.odstotkov,
      angle: S.kot, measuredangle: S.kot, triangle: S.trikotnik, perp: S.pravokotno, parallel: S.vzporedno, sum: S.vsota, int: S.integral,
      prod: S.produkt, "{": S.zaviti, "}": S.zavitiZ, lbrace: S.zaviti, rbrace: S.zavitiZ, lvert: null, rvert: null, vert: null, "|": null,
      langle: S.oklepaj, rangle: S.zaklepaj, lfloor: S.oglati, rfloor: S.oglatiZ, lceil: S.oglati, rceil: S.oglatiZ, prime: "'",
      "#": "#", "&": "&", "$": "$", "_": "_",
    };
    if (u in SIM) {
      if (SIM[u] === null) return abs();
      const locilo = ["le", "leq", "leqslant", "ge", "geq", "geqslant", "ne", "neq", "approx", "doteq", "in", "notin", "subset", "subseteq", "mid", "to", "rightarrow", "Rightarrow", "implies", "Leftrightarrow", "iff", "}", "rbrace", "rangle", "rfloor", "rceil"].includes(u);
      return { s: SIM[u], preprost: u === "prime" || u === "infty" || u === "emptyset" || u === "varnothing", velik: ["sum", "int", "prod"].includes(u), locilo };
    }
    if (u === "colon") return { s: ",", preprost: true, locilo: true };
    if (u === "circ") return { s: S.stopinj, preprost: true, stopinje: true };
    // Neznan ukaz: preberemo njegovo ime (bolje kot nič), argumente kot zaporedje.
    return { s: u, preprost: true };
  }
  function odpriAbs() {
    absOdprt++;
    return { s: S.abs, preprost: false };
  }
  function zapriAbs() {
    absOdprt = Math.max(0, absOdprt - 1);
    return { s: `, ${S.konecAbs},`, preprost: false };
  }
  // Navpičnica brez \left/\right: prva odpre, druga zapre absolutno vrednost.
  // Navpičnica brez para (\{x \mid …\} zapisano kot \{x | x>0\}) je »za katere velja«.
  const abs = () => {
    if (absOdprt) return zapriAbs();
    let par = false;
    for (let j = i; j < z.length && !par; j++) par = (z[j].k === "zn" && z[j].v === "|") || (z[j].k === "ukaz" && ["|", "vert", "rvert"].includes(z[j].v));
    return par ? odpriAbs() : { s: S.zaKatere, preprost: false, locilo: true };
  };
  // Potenca in indeks za atomom.
  function zDodatki(a) {
    let s = a.s;
    let pre = a.preprost;
    let spodaj = null;
    let zgoraj = null;
    for (let n = 0; n < 2; n++) {
      const t = pogled();
      if (t?.k !== "zn" || (t.v !== "^" && t.v !== "_")) break;
      i++;
      if (t.v === "_") spodaj = argument();
      else zgoraj = argument();
    }
    if (!spodaj && !zgoraj) return a;
    if (a.velik) {
      // vsota, integral, produkt: od … do …, nato pavza pred členom
      if (spodaj) s += ` ${S.od} ${spodaj.s}`;
      if (zgoraj) s += ` ${S.do} ${zgoraj.s}`;
      return { s, preprost: false, pavza: true };
    }
    let pavza = false;
    if (spodaj) {
      if (a.fun === "lim") s += `, ${spodaj.s},`;
      else if (a.fun === "log") s += ` ${S.osnova} ${spodaj.s},`;
      else if (spodaj.preprost) s += ` ${spodaj.s}`;
      else s += ` ${S.indeks} ${spodaj.s}`;
      pre = false;
    }
    if (zgoraj) {
      const e = zgoraj.s.trim();
      if (/^(?:\\circ|°)$/.test(e) || e === S.stopinj) s += ` ${S.stopinj}`;
      else if (e === S.plus) s += ` ${S.zDesne}`; // 0^+
      else if (e === S.minus) s += ` ${S.zLeve}`;
      else if (e === "2") s += ` ${S.kvadrat}`;
      else if (e === "3") s += ` ${S.kub}`;
      else if (zgoraj.preprost) (s += ` ${S.na} ${e}`), (pavza = true);
      else s += ` ${S.potenca} ${e}, ${S.konecPotence}`;
      pre = false;
    }
    return { s, preprost: pre && !spodaj && !zgoraj, pavza };
  }
  function zaporedje(konec) {
    const deli = [];
    let n = 0;
    let predznak = false; // »−3«, »−x«: predznak pred enim delom je še vedno preprost
    let prvi = true;
    let pavza = false;
    while (i < z.length) {
      const t = pogled();
      if (!t) break;
      if (konec && t.k === "zn" && t.v === konec) break;
      const a = zDodatki(atom());
      if (prvi && (a.s === S.minus || a.s === S.plus)) {
        prvi = false;
        predznak = true;
        deli.push(a.s);
        continue;
      }
      prvi = false;
      if (a.s) {
        if (pavza && !a.locilo && !a.s.startsWith(",")) deli[deli.length - 1] += ",";
        pavza = !!a.pavza;
        deli.push(a.s);
        n++;
      } else if (!a.preprost) n++;
    }
    // Ena črka, število ali ukaz (pi) je preprost; več delov (»2x«, »a+b«) ni.
    const s = deli.join(" ").replace(/\s+,/g, ",").replace(/,\s*,/g, ",").replace(/\s{2,}/g, " ").trim();
    const brez = predznak ? deli.slice(1) : deli;
    return { s, preprost: n <= 1 && brez.length <= 1 && !/\s/.test(brez.join(" ")) };
  }
  return zaporedje(null).s.replace(/,\s*$/, "").trim();
}

// Slovar za jezik: živi jeziki imajo svojega, drugi vzamejo prvi znani jezik iz verige (veriga: npr. uiChain).
export function slovarGovora(jezik = "sl", veriga = []) {
  for (const j of [jezik, ...veriga]) if (SLOVARJI[j]) return SLOVARJI[j];
  return SLOVARJI.en;
}

export function texGovor(tex, jezik = "sl", veriga = []) {
  try {
    return govor(tex, slovarGovora(jezik, veriga));
  } catch {
    return "";
  }
}

// ---------- DOM ----------
// Gumbi, povezave in podobni elementi, katerih ime se izračuna iz vsebine.
const IMENOVANI = "button, a[href], [role=button], [role=link], [role=option], [role=radio], [role=checkbox], [role=tab], [role=menuitem]";
const TEX = 'annotation[encoding="application/x-tex"]';

// Besedilo elementa za ime: besedilo kot je, formule KaTeX kot izgovor, skrito za bralnik (aria-hidden) izpade.
function besedilo(el, jezik, veriga) {
  let out = "";
  for (const n of el.childNodes) {
    if (n.nodeType === 3) out += n.nodeValue;
    else if (n.nodeType === 1) {
      if (n.classList.contains("katex")) {
        const tex = n.querySelector(TEX)?.textContent;
        out += ` ${tex ? texGovor(tex, jezik, veriga) : ""} `;
      } else if (n.getAttribute("aria-hidden") === "true" || n.hidden) continue;
      else if (n.hasAttribute("aria-label")) out += ` ${n.getAttribute("aria-label")} `;
      else if (n.nodeName === "SVG" || n.nodeName === "svg") continue;
      else out += besedilo(n, jezik, veriga);
    }
  }
  return out;
}

// Elementu, ki vsebuje formulo, damo aria-label z izgovorom. aria-label, ki ga je element že imel, ostane.
// Vrne število poimenovanih elementov.
export function imenujFormule(koren, jezik = "sl", veriga = []) {
  if (!koren?.querySelectorAll) return 0;
  const kandidati = new Set();
  const dodaj = (el) => {
    if (!el || el.closest(".katex")) return; // klikljiva črka v formuli (formula-info.js) ima svoje ime
    // Naše ime je tisto, ki je še enako zapisanemu v data-govor; ime, ki ga je aplikacija medtem zamenjala, ostane.
    if (el.hasAttribute("aria-labelledby") || (el.hasAttribute("aria-label") && el.getAttribute("aria-label") !== el.dataset.govor)) return;
    kandidati.add(el);
  };
  if (koren.matches?.(IMENOVANI)) dodaj(koren);
  const gor = koren.parentElement?.closest?.(IMENOVANI);
  if (gor) dodaj(gor);
  for (const k of koren.querySelectorAll(".katex")) dodaj(k.parentElement?.closest(IMENOVANI));
  let n = 0;
  for (const el of kandidati) {
    if (!el.querySelector(".katex")) {
      // formule ni več (vsebina zamenjana): naše ime odstranimo
      if (el.dataset.govor != null) el.removeAttribute("aria-label"), delete el.dataset.govor;
      continue;
    }
    const ime = besedilo(el, jezik, veriga).replace(/\s+/g, " ").replace(/\s+([,.;:!?])/g, "$1").trim();
    if (!ime) continue;
    if (el.getAttribute("aria-label") !== ime) el.setAttribute("aria-label", ime);
    el.dataset.govor = ime;
    n++;
  }
  return n;
}

// Sproti: ob vsaki dodani vsebini (izbire naloge, odgovor, izris formule po nalaganju KaTeX) v naslednjem okvirju.
let opazovalec = null;
export function initIzgovor(jezikFn = () => "sl", verigaFn = () => []) {
  if (opazovalec || typeof MutationObserver === "undefined") return;
  let deli = new Set();
  let caka = false;
  const obdelaj = () => {
    caka = false;
    const vsi = deli;
    deli = new Set();
    const j = jezikFn();
    const v = verigaFn(j);
    for (const el of vsi) if (el.isConnected) imenujFormule(el, j, v);
  };
  opazovalec = new MutationObserver((ms) => {
    for (const m of ms) {
      for (const n of m.addedNodes) {
        const el = n.nodeType === 1 ? n : n.parentElement;
        if (el && (el.classList?.contains("katex") || el.querySelector?.(".katex") || el.closest?.(IMENOVANI))) deli.add(el);
      }
      // Odstranjena vsebina (remove, replaceChildren): ime gumba, ki smo ga poimenovali, se osveži ali izgine.
      if (m.removedNodes.length) {
        const gumb = m.target.closest?.("[data-govor]");
        if (gumb) deli.add(gumb);
      }
    }
    if (deli.size && !caka) {
      caka = true;
      requestAnimationFrame(obdelaj);
    }
  });
  opazovalec.observe(document.body, { childList: true, subtree: true });
  deli.add(document.body);
  caka = true;
  requestAnimationFrame(obdelaj);
}

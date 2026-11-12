// Široke formule in tabele v lekciji (j 2026-10-31: na telefonu so se skrivali stolpci in konci formul).
// Kar je preširoko za kartico, najprej malo pomanjšamo (do 80 %). Kar je še vedno preširoko, se pomika
// vstran in je označeno kot drsna vrstica (public/drsniki.js). Formula sredi besedila se nikoli ne prelomi
// v dve vrstici sredi izraza. Če formula ne gre v vrstico, jo zložimo pri enačajih: leva stran zgoraj,
// spodaj vsak »= …« v svoji vrstici, enačaji poravnani (j 2026-11-01). Šele kar je še vedno preširoko, se
// zmanjša ali pomika. Preverja scripts/preveri-videz-lekcij.cjs.
// Od 4. 11. 2026 (j: »To naj velja za vse enačbe«) velja isto za vsako enačbo v aplikaciji: initSirina()
// opazuje vso stran in prilagodi vsako novo formulo (simulacije ob vsakem premiku drsnika, laboratorij,
// klepet, naloge, kartice, skeniranje). Preverja še scripts/preveri-formule.cjs.
// Od 8. 11. 2026 (j) se formula sredi besedila nikjer v aplikaciji ne prelomi sredi izraza (ui.css), ne le v
// učbeniku: naloge, kvizi, igre, kartice, skeniranje, laboratorij in klepet. Ne gre v vrstico → cela v naslednjo;
// širša od vrstice → zložena pri enačajih, nato pomanjšana (80 %) ali drsna. Mesto formule zunaj učbenika je
// najbližji blokovni starš (mestoFormule), ne polj za vnos in SVG; prostor je širina vsebine bloka brez notranjega
// roba (prostor), pri blokih, ki se skrčijo na vsebino (klepet), največja širina. Klepet vsak del odgovora znova
// izriše, zato si zapomnimo formule, ki pri dani širini ustrezajo (ustrezne), in izmerimo le nove.
// Odločitev j (9. 11. 2026): visoka formula (ulomek …) sredi besedila gre povsod v svojo vrstico kot v učbeniku
// (prilagodiFormulo; izjema ostaneta .tb-opt in .tb-q); ui.css za vsak tak blok enako velja (.tb-zlozena je blok),
// v gumbu odgovora (.choice) ostane znotraj gumba.

export const MIN = 0.8;
const BOX = ".katex-display, .md-table-wrap";
// Okvirji, v katerih stoji formula sama (ne med besedilom): simulacije, okvir s formulo pri nalogi, zbirka
// formul. Formula v njih se ne prelomi sama (textbook.css), ampak jo zložimo kot prikazano formulo.
export const OKVIRI = ".demo-eq, .graf-eq, .formula-body, .fm-f";
// Odstavki učbenika, v katerih formula sredi besedila ostane v eni vrstici (textbook.css).
const VRSTE = "p, li, h2, h3, dd, blockquote";
let sirine = new WeakMap(); // zadnja širina, pri kateri smo element že prilagodili
let prilagojene = new WeakMap(); // formula sredi besedila → širina, pri kateri je že prilagojena (isti element ob drugi spremembi bloka)
const opazovani = new Set();
let ro = null;

// Relacije, pri katerih zložimo predolgo formulo (le na vrhnji ravni, ne v ulomku ali oklepaju {…}).
const REL = new Set(["\\approx", "\\le", "\\leq", "\\ge", "\\geq", "\\neq", "\\ne", "\\equiv", "\\doteq", "\\sim", "\\simeq", "\\to", "\\rightarrow", "\\Rightarrow", "\\Leftrightarrow", "\\iff", "\\implies", "\\longrightarrow", "\\leftrightarrow", "\\rightleftharpoons", "\\propto", "\\lt", "\\gt"]);
const LOCI = new Set(["\\quad", "\\qquad"]);
// Sklep (⇒, ⇔) začne novo izjavo, ki se v novi vrstici začne s puščico: »2h = 15« / »⇒ h = 7,5«.
const SKLEP = new Set(["\\Rightarrow", "\\implies", "\\iff", "\\Leftrightarrow", "\\Longrightarrow", "\\Longleftrightarrow"]);
// Člen vsote, pri katerem lahko predolg del enačbe nadaljujemo v novi vrstici (pred znakom, kot v zvezku).
const PLUS = new Set(["+", "-", "\\pm", "\\mp"]);
// Za temi znaki je minus predznak, ne odštevanje (»= -3«, »(-2)«, »\\cdot -1«).
const PRED = /(?:[-+=<>(\[{,^_]|\\(?:pm|mp|cdot|times|div|le|ge|leq|geq|neq|approx|to|left[(\[.|]|[a-zA-Z]+rightarrow|quad|qquad|,|;|:|!| ))$/;

// Dolžina zapisa, kot jo vidi bralec (ukaz šteje za en znak, oklepaji {…}, razmiki in oznake klikljivih simbolov
// \htmlData nič); le za razrez.
const dolzina = (t) => t.replace(/\\htmlData\{[^{}]*\}/g, "").replace(/\\[,;:! ]/g, "").replace(/\\(?:mathrm|text|operatorname|mathbf|mathit)\b/g, "").replace(/\\[a-zA-Z]+/g, "x").replace(/[{}\s]/g, "").length;

// Naslednji žeton TeX-a na mestu i: ukaz, \\left( in \\begin{…} skupaj z ločilom ali imenom okolja, ali en znak.
function zeton(t, i) {
  let tok = t[i] === "\\" ? /^\\(?:[a-zA-Z]+|[\s\S])/.exec(t.slice(i))[0] : t[i];
  if (tok === "\\left" || tok === "\\right") tok += /^\s*(?:\\[a-zA-Z]+|\\.|.)/.exec(t.slice(i + tok.length))?.[0] || "";
  else if (tok === "\\begin" || tok === "\\end") tok += /^\s*\{[a-zA-Z*]*\}/.exec(t.slice(i + tok.length))?.[0] || "";
  return tok;
}
// Kako žeton spremeni globino oklepajev: +1, −1 ali 0. Okolje (matrika, determinanta) je kot oklepaj.
function globina(tok) {
  if (/^\\(?:left|begin)(?![a-zA-Z])/.test(tok) || "{([".includes(tok) || tok === "\\{" || tok === "\\lbrace") return 1;
  if (/^\\(?:right|end)(?![a-zA-Z])/.test(tok) || "})]".includes(tok) || tok === "\\}" || tok === "\\rbrace") return -1;
  return 0;
}

// Množenje: drugi, šele če vsota ni kje razrezati (dolg zmnožek števil in enot v fizikalnem računu).
const KRAT = new Set(["\\cdot", "\\times"]);
// Še za tem: dolg oklepaj (n-terica, množica, vsota v oklepaju) se nadaljuje v njem (glej razrezi).
const NOTER = "noter";
// Binarni operatorji med izjavami (logika, množice): tam se predolg člen nadaljuje kot pred ·.
const KRAT_ALI = new Set([...KRAT, "\\wedge", "\\vee", "\\land", "\\lor", "\\cup", "\\cap", "\\setminus"]);
// Del enačbe razreže pred vrhnjimi + in − na enako dolge kose, vsak največ približno `dolg` znakov; kos, ki je
// še vedno predolg, še pred vrhnjim · ali ×, nato v vrhnjem oklepaju (NOTER). Vrne seznam kosov.
function razrezi(t, dolg, znaki = PLUS) {
  let reze = []; // mesta, kjer se lahko začne nov kos
  const odprti = []; // oklepaji, v katerih smo
  // NOTER: v vrhnjem navadnem oklepaju (ne \left(, ne {…} ulomka ali korena) najprej za vejicami (»(2 \cdot 3 - 0,\ 0 -
  // 3,\ …)«, »\{(0, x), (0, y), …\}«), sicer pred + in −, sicer pred · (»10\,\mathrm{A}/(8{,}5 \cdot 10^{28} \cdot …)«).
  const noter = [[], [], []];
  // Zadnja možnost (j 12. 11. 2026: »nič naj se ne pomika«): naštevanje brez oklepaja (»12, 13, 14, …«) za vrhnjimi
  // vejicami s presledkom (decimalna vejica je v {,} ali brez presledka), kemijska veriga (»CH_3{-}CH(CH_3){-}…«)
  // pred vrhnjo vezjo {-}, {=} ali {\equiv}: vez gre na začetek naslednje vrstice.
  const vrh = [], vezi = [];
  let depth = 0;
  for (let i = 0; i < t.length; ) {
    const tok = zeton(t, i);
    const g = globina(tok);
    if (znaki === NOTER && depth === 0 && i > 0) {
      if (tok === "{" && /^\{(?:-|=|\\equiv)\}/.test(t.slice(i))) vezi.push(i);
      else if (tok === ",") {
        const m = /^(?:\s|\\[ ;:]|\\q?quad(?![a-zA-Z]))+/.exec(t.slice(i + 1));
        if (m && i + 1 + m[0].length < t.length) vrh.push(i + 1 + m[0].length);
      }
    }
    if (g > 0) odprti.push(tok);
    else if (g < 0) odprti.pop();
    const pred = () => !PRED.test(t.slice(0, i).trimEnd()) && !/^\s*10\s*\^/.test(t.slice(i + tok.length));
    if (g) depth = Math.max(0, depth + g);
    else if (znaki === NOTER) {
      if (depth !== 1 || /^(?:\{|\\left|\\begin)/.test(odprti[0] || "")) ;
      else if (tok === ",") {
        const j = i + 1 + /^(?:\s|\\[ ,;:!]|\\q?quad(?![a-zA-Z]))*/.exec(t.slice(i + 1))[0].length;
        if (j < t.length) noter[0].push(j);
      } else if (PLUS.has(tok) && pred()) noter[1].push(i);
      else if (KRAT_ALI.has(tok) && pred()) noter[2].push(i);
    }
    // Ne sredi števila v desetiškem zapisu (»2{,}998 \cdot 10^{8}«).
    else if (depth === 0 && znaki.has(tok) && !PRED.test(t.slice(0, i).trimEnd()) && t.slice(0, i).trim() && !(znaki === KRAT_ALI && /^\s*10\s*\^/.test(t.slice(i + tok.length)))) reze.push(i);
    i += tok.length;
  }
  if (znaki === NOTER) reze = noter.find((x) => x.length) || (vrh.length ? vrh : vezi);
  const vse = dolzina(t);
  const kosov = Math.min(reze.length + 1, Math.ceil(vse / dolg));
  // Za vsak kos rez, ki je najbližje j-temu delu dolžine (»a + b + c + d« v dva kosa: »a + b«, »+ c + d«).
  const meje = [0];
  let r = 0;
  for (let j = 1; j < kosov; j++) {
    const cilj = (vse * j) / kosov;
    let best = -1;
    for (let q = r; q < reze.length - (kosov - 1 - j); q++)
      if (best < 0 || Math.abs(dolzina(t.slice(0, reze[q])) - cilj) < Math.abs(dolzina(t.slice(0, reze[best])) - cilj)) best = q;
    meje.push(reze[best]);
    r = best + 1;
  }
  meje.push(t.length);
  const kosi = [];
  for (let j = 0; j + 1 < meje.length; j++) {
    // Razmik na koncu vrstice (»,\ « za vejico n-terice) ni potreben; trim() sam bi pustil osamljen »\«.
    const k = t.slice(meje[j], meje[j + 1]).replace(/(?:\s|\\[ ,;:!])+$/, "").trim();
    if (!k) continue;
    // En sam predolg člen (zmnožek števil in enot) še pred · ali ×, nato za vejicami n-terice; člen vsote razreže
    // naslednja stopnja.
    const clen = !reze.some((x) => x > meje[j] && x < meje[j + 1]);
    const naprej = znaki === PLUS ? KRAT_ALI : znaki === KRAT_ALI ? NOTER : null;
    kosi.push(...(naprej && clen && dolzina(k) > Math.max(dolg, 14) ? razrezi(k, dolg, naprej) : [k]));
  }
  return kosi;
}

// Ali ima formula že svoje vrstice ali poravnavo zunaj okolij (\\\\ ali & na vrhnji ravni, npr. cela je »aligned«).
function imaVrstice(t) {
  let env = 0;
  for (let i = 0; i < t.length; ) {
    const tok = zeton(t, i);
    if (/^\\begin(?![a-zA-Z])/.test(tok)) env++;
    else if (/^\\end(?![a-zA-Z])/.test(tok)) env--;
    else if (env <= 0 && (tok === "\\\\" || tok === "&")) return true;
    i += tok.length;
  }
  return false;
}

// TeX formule → TeX z vrsticami v »aligned«, ali null, če formule ni kje zložiti.
// stopnja 1: le izjave, ločene s \quad, gredo vsaka v svojo vrstico.
// stopnja 2: še leva stran v svoji vrstici in pod njo vsak »= …« (zamaknjen, enačaji drug pod drugim).
// stopnja 3, 4 …: še predolg del (dolga vsota) se nadaljuje v novi vrstici pred + ali −, v kosih, dolgih
// približno 1/2, 1/3 … najdaljšega dela.
// meja (neobvezno): koliko znakov (dolzina) približno gre v vrstico. Z njo stopnja 2 zloži le izjave, ki so
// daljše od meje (krajše ostanejo v eni vrstici), od stopnje 3 pa so kosi dolgi do meje (3), 3/4 (4), 1/2 (5).
export function zlozTex(tex, stopnja = 2, meja = 0) {
  if (imaVrstice(tex) || /^\s*\\begin\{[a-z]*(?:aligned|align|gather|cases|split|array)\*?\}/.test(tex)) return null; // že ima vrstice ali poravnavo
  // Kemijska enačba v enem \mathrm{…}: zložimo vsebino, vsak del spet v \mathrm.
  let ovoj = (x) => x;
  const mr = /^\s*\\mathrm\{([\s\S]*)\}\s*$/.exec(tex);
  if (mr && uravnotezen(mr[1])) {
    tex = mr[1];
    ovoj = (x) => `\\mathrm{${x}}`;
  }
  const izjave = [[{ rel: "", t: "" }]]; // izjave → deli (prvi del je leva stran, ostali se začnejo z relacijo)
  let depth = 0;
  for (let i = 0; i < tex.length; ) {
    const tok = zeton(tex, i);
    const iz = izjave[izjave.length - 1];
    const zadnji = iz[iz.length - 1];
    // \left( in \right) štejeta kot en oklepaj skupaj z ločilom; navadni ( [ tudi (»(a \ge 0)« ostane celo),
    // matrika ali determinanta (\begin{…} … \end{…}) pa kot celota.
    depth = Math.max(0, depth + globina(tok));
    // Ne za _ ali ^ (v_\to) in ne za \not (\not\equiv): tam relacija spada k prejšnjemu.
    const prej = zadnji.t.trimEnd();
    const lahko = depth === 0 && prej && !/(?:[_^]|\\not)$/.test(prej);
    // »… \\text{ ali } x = …«: nova izjava, ki se začne z veznikom (»ali x = π − …« v novi vrstici).
    const vez = depth === 0 && tok === "\\text" && /^\{\s*(ali|in|oziroma)\s*\}(?:\s|\\ |\\quad(?![a-zA-Z]))*/.exec(tex.slice(i + tok.length));
    if (vez) {
      if (iz.some((d) => d.t.trim())) izjave.push([{ rel: "", t: `\\text{${vez[1]}}\\ ` }]);
      else zadnji.t += `\\text{${vez[1]}}\\ `; // za \\quad je izjava že nova
      i += tok.length + vez[0].length;
      continue;
    }
    if (lahko && SKLEP.has(tok)) {
      izjave.push([{ rel: "", t: `${tok} ` }]);
      i += tok.length;
      continue;
    }
    if (lahko && (tok === "=" || tok === "<" || tok === ">" || REL.has(tok))) iz.push({ rel: tok, t: "" });
    else if (depth === 0 && LOCI.has(tok) && iz.some((d) => d.t.trim())) {
      izjave.push([{ rel: "", t: "" }]);
      i += tok.length;
      continue;
    } else zadnji.t += tok;
    i += tok.length;
  }
  // Razmik na koncu vrstice (»2k\\pi \\ « pred »ali«) ni več potreben.
  for (const d of izjave.flat()) d.t = d.t.replace(/(?:\s|\\[ ,;:!]|\\q?quad(?![a-zA-Z]))+$/, "");
  const del = (d) => `${d.rel ? `${d.rel} ` : ""}${ovoj(d.t.trim())}`;
  // Od stopnje 3 naprej: kosi, dolgi največ 1/(stopnja − 1) najdaljšega dela (ali do meje, zamik odštet).
  const najdaljsi = Math.max(...izjave.flat().map((d) => dolzina(d.t)));
  const dolg = stopnja < 3 ? Infinity : Math.max(6, meja > 0 ? Math.floor(meja * [1, 0.75, 0.5][Math.min(stopnja, 5) - 3]) - 2 : Math.ceil(najdaljsi / (stopnja - 1)));
  // Izjava, ki gre po meji v vrstico, ostane cela.
  const kratka = (iz) => meja > 0 && iz.reduce((n, d) => n + dolzina(d.t) + (d.rel ? 1 : 0), 0) <= meja;
  // Del v eno ali več vrstic: prva z relacijo (zamik `zamik`), nadaljevanja pred + ali − še malo bolj zamaknjena.
  const vrsticeDela = (d, zamik) => {
    const kosi = dolg < Infinity ? razrezi(d.t.trim(), dolg) : [d.t.trim()];
    // V kemijski enačbi (\\mathrm) ostane znak na začetku nadaljevanja zunaj ovoja, sicer bi bil predznak (»+NaCl«).
    const nad = (t) => {
      const z = mr && /^(?:[-+]|\\(?:pm|mp|cdot|times)(?![a-zA-Z]))\s*/.exec(t);
      return z ? `${z[0].trim()} ${ovoj(t.slice(z[0].length))}` : ovoj(t);
    };
    return kosi.map((t, j) => (j ? `&${zamik}\\quad {}${nad(t)}` : `&${zamik}${d.rel ? "{}" : ""}${del({ rel: d.rel, t })}`));
  };
  const vrstice = [];
  for (const iz of izjave) {
    const deli = iz.filter((d) => d.t.trim());
    if (deli.length < 2) {
      if (deli.length) vrstice.push(...vrsticeDela(deli[0], ""));
      continue;
    }
    // Leva stran v svoji vrstici, nato vsak »= …« v svoji (j 2026-11-01), enačaji drug pod drugim.
    if (stopnja < 2 || kratka(deli)) vrstice.push(`&${deli.map(del).join(" ")}`);
    else vrstice.push(...vrsticeDela(deli[0], ""), ...deli.slice(1).flatMap((d) => vrsticeDela(d, "\\quad ")));
  }
  if (vrstice.length < 2) return null;
  return `\\begin{aligned}${vrstice.join(" \\\\ ")}\\end{aligned}`;
}

function uravnotezen(x) {
  let d = 0;
  for (const c of x.replace(/\\[{}]/g, "")) if ((d += c === "{" ? 1 : c === "}" ? -1 : 0) < 0) return false;
  return d === 0;
}

const izvirnik = new WeakMap(); // zložena formula → njen izvirni HTML
const izvirniTex = new WeakMap(); // zložena formula → njen izvirni TeX
const nasi = new WeakSet(); // formule, ki smo jih izrisali sami (opazovalec strani jih ne prilagaja znova)
function zamenjaj(k, html) {
  const t = document.createElement("span");
  t.innerHTML = html;
  const n = t.firstElementChild;
  nasi.add(n);
  k.replaceWith(n);
  return n;
}
// Bralnik zaslona bere MathML, kopiranje in »Vprašaj o izboru« (textbook.js) njegov TeX: oba ostaneta izvirna
// formula, ne zložena (»\begin{aligned}…«) ali pomanjšana.
function ohraniMathml(k, n) {
  const m = k.querySelector(":scope > .katex-mathml");
  if (m) n.querySelector(":scope > .katex-mathml")?.replaceWith(m);
}
const locilo = new WeakMap(); // zložena formula → ločilo, ki smo ga vzeli iz besedila za njo
function obnovi(k) {
  const h = izvirnik.get(k);
  if (!h) return k;
  const p = locilo.get(k);
  if (p) k.after(p); // ločilo nazaj v besedilo
  return zamenjaj(k, h);
}
// Ulomek sredi besedila v velikosti besedila (\dfrac → \frac), kot v tiskanem učbeniku: vrstica ostane enako
// visoka in stavek cel (j 2026-11-01).
export function besedilniTex(tex) {
  const t = tex.replace(/\\dfrac(?![a-zA-Z])/g, "\\frac").replace(/\\dbinom(?![a-zA-Z])/g, "\\binom").replace(/\\displaystyle(?![a-zA-Z])/g, "\\textstyle");
  return t === tex ? null : t;
}

// Izris zložene formule; zadnjih nekaj hranimo, ker drsnik, povlečen sem in tja, izriše iste vrednosti znova.
const izrisi_ = new Map();
function izrisi(al) {
  let html = izrisi_.get(al);
  if (html) return html;
  try {
    html = globalThis.katex.renderToString(al, { throwOnError: true, strict: "ignore", trust: (c) => c.command === "\\htmlData" });
  } catch {
    return null;
  }
  if (izrisi_.size > 200) izrisi_.delete(izrisi_.keys().next().value);
  izrisi_.set(al, html);
  return html;
}

// stopnja "t": ista formula v velikosti besedila (ostane v vrstici); 0: cela formula v svoji vrstici;
// 1 in 2: zložena (zlozTex).
function zlozi(k, stopnja, meja = 0) {
  const tex = (izvirnik.has(k) ? izvirniTex.get(k) : null) ?? k.querySelector("annotation")?.textContent;
  let al = tex && globalThis.katex && (stopnja === "t" ? besedilniTex(tex) : stopnja === 0 ? tex : zlozTex(tex, stopnja, meja));
  if (!al) return null;
  if (stopnja === "t") {
    let html;
    try {
      html = globalThis.katex.renderToString(al, { throwOnError: true, strict: "ignore", trust: (c) => c.command === "\\htmlData" });
    } catch {
      return null;
    }
    const orig = izvirnik.get(k) ?? k.outerHTML;
    const n = zamenjaj(k, html);
    ohraniMathml(k, n);
    izvirnik.set(n, orig);
    izvirniTex.set(n, tex);
    return n;
  }
  // Formula sredi besedila je zložena v svoji vrstici: pika ali vejica za njo gre na konec zadnje vrstice,
  // da ne ostane sama v novi vrstici.
  const inline = !k.parentElement?.closest(".katex-display");
  // V okviru simulacije ostanejo ulomki v velikosti besedila kot v nezloženi formuli (»aligned« bi jih povečal).
  if (inline && stopnja && k.closest(OKVIRI)) al = al.replace(/&/g, "&\\textstyle ");
  let p = locilo.get(k) || "";
  const nx = k.nextSibling;
  const vzemi = inline && !p && nx?.nodeType === 3 && /^[.,;:!?]/.test(nx.data);
  if (vzemi) p = nx.data[0];
  if (p) al = stopnja === 0 ? `${al}\\text{${p}}` : al.replace(/\\end\{aligned\}$/, `\\text{${p}}\\end{aligned}`);
  let html = izrisi(al);
  if (!html) return null;
  if (vzemi) nx.data = nx.data.slice(1); // šele ko se je izrisala, sicer bi se ločilo izgubilo
  const orig = izvirnik.get(k) ?? k.outerHTML;
  const n = zamenjaj(k, html);
  ohraniMathml(k, n);
  n.classList.add("tb-zlozena");
  izvirnik.set(n, orig);
  izvirniTex.set(n, tex);
  if (p) locilo.set(n, p);
  return n;
}

// Formula, ki ne gre v širino w: malo pomanjšaj (do 90 %), sicer zloži pri enačajih; kar je še preširoko,
// pomanjšaj do MIN. Vrne (morda novo) formulo.
// Formula sredi besedila, višja od `visoka` (ulomek, pisan z \dfrac), bi razmaknila vrstico besedila: najprej
// jo izrišemo v velikosti besedila (\frac), le če je še vedno previsoka, dobi svojo vrstico (j 2026-11-01).
function prilagodiFormulo(k, w, meri, visoka = Infinity) {
  k = obnovi(k);
  k.style.fontSize = "";
  if (visoka < Infinity && k.getBoundingClientRect().height > visoka) k = zlozi(k, "t") || k;
  // Še vedno previsoka (npr. ulomek v ulomku): v svojo vrstico, razen v gumbu ali vprašanju z eno vrstico.
  if (visoka < Infinity && k.getBoundingClientRect().height > visoka && !k.closest(".tb-opt, .tb-q")) k = zlozi(k, 0) || k;
  const kljuc = visoka === Infinity && kljucFormule(k, w);
  const need = meri(k);
  if (need <= w + 1) {
    if (kljuc) zapomni(kljuc, { st: 0, fs: "" });
    return k;
  }
  // Najprej le izjave v svoje vrstice, nato še enačaji, nato dolge vsote pred + in −; vsakič vzamemo prvo,
  // ki gre v vrstico (ali jo je treba le malo pomanjšati). Koliko znakov gre v vrstico, ocenimo iz nezložene
  // formule, da ostane izjava, ki gre v vrstico, cela.
  const tex = (izvirnik.has(k) ? izvirniTex.get(k) : null) ?? k.querySelector("annotation")?.textContent;
  const meja = tex ? Math.floor((w * dolzina(tex)) / need) : 0;
  let prej = null;
  let st0 = 0;
  for (const st of [1, 2, 3, 4, 5]) {
    if (meri(k) <= w + 1 || w / meri(k) >= 0.9) break;
    const al = tex && zlozTex(tex, st, meja);
    if (!al || al === prej) continue; // ta stopnja ne spremeni ničesar
    prej = al;
    const z = zlozi(k, st, meja);
    if (z) (k = z), (st0 = st);
  }
  pomanjsaj(k, w, () => meri(k));
  if (kljuc) zapomni(kljuc, { st: st0, meja, fs: k.style.fontSize });
  return k;
}

// Zadnja rešitev za formulo: ob premiku drsnika simulacija izriše isto formulo z drugimi števkami. Ključ je širina
// in TeX s števkami, zamenjanimi z 0 (števke so v KaTeX enako široke, zato je taka formula enako široka).
const resitve = new Map();
function kljucFormule(k, w) {
  const tex = izvirnik.has(k) ? null : k.querySelector("annotation")?.textContent;
  return tex ? `${Math.round(w)}|${tex.replace(/\d/g, "0")}` : null;
}
function zapomni(kljuc, r) {
  if (resitve.size > 500) resitve.clear();
  resitve.set(kljuc, r);
}

// Pomanjšaj `cilj`, dokler `meri()` ne pade pod `w` ali do MIN.
export function pomanjsaj(cilj, w, meri) {
  cilj.style.fontSize = "";
  let need = meri();
  if (need <= w + 1) return;
  const base = parseFloat(getComputedStyle(cilj).fontSize);
  let s = 1;
  for (let i = 0; i < 3 && need > w + 1 && s > MIN; i++) {
    s = Math.max(MIN, s * (w / need) * 0.99);
    cilj.style.fontSize = `${(base * s).toFixed(2)}px`;
    need = meri();
  }
}

// Formule v okviru el: širina, ki jo imajo na voljo, in kako se meri vsaka (null: v okviru ni formul).
// rob: vodoravni notranji rob okvirja (če ga že poznamo; sicer ga preberemo).
function formuleOkvira(el, w, rob) {
  if (el.matches(".katex-display")) {
    const k = el.querySelector(":scope > .katex");
    return k && { w, ks: [k], meri: () => el.scrollWidth };
  }
  // Okvir s formulo (simulacija, namig …): vsaka formula v njem mora iti v širino vsebine okvirja.
  if (rob == null) {
    const cs = getComputedStyle(el);
    rob = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
  }
  const sir = w - rob;
  const ks = [...el.querySelectorAll(".katex")].filter((k) => !k.parentElement?.closest(".katex, .katex-display, table") && k.closest(OKVIRI) === el);
  // Ena sama formula: šteje vsebina okvirja (tudi KaTeX-ov rob 2 px za stolpcem »aligned«); več formul: vsaka zase.
  const meri = ks.length === 1 ? () => el.scrollWidth - (w - sir) : (x) => Math.max(x.getBoundingClientRect().width, x.scrollWidth);
  return ks.length ? { w: sir, rob, ks, meri } : null;
}

function okvir(el) {
  const w = el.clientWidth;
  if (!w || sirine.get(el) === w) return;
  sirine.set(el, w);
  if (el.matches(".md-table-wrap")) {
    const t = el.querySelector(":scope > table");
    if (t) pomanjsaj(t, w, () => el.scrollWidth);
    return;
  }
  const f = formuleOkvira(el, w);
  if (el.parentElement) sirinaMesta.set(el.parentElement, { w, rob: f?.rob, cls: el.classList[0] });
  if (f) for (const k of f.ks) prilagodiFormulo(k, f.w, f.meri);
}

// Hitra pot za okvirje, katerih formule smo že videli (drsnik v simulaciji izriše isto formulo z drugimi števili):
// širino vzamemo od prejšnjega okvirja na istem mestu in zadnjo rešitev za formulo uporabimo brez merjenja, tako da
// se stran zaradi nas ne postavi niti enkrat več. Če se je širina medtem spremenila, okvir po celem postopku prilagodi
// ResizeObserver (prvo obvestilo za nov element). Vrne okvirje, ki jih je treba prilagoditi po celem postopku.
const sirinaMesta = new WeakMap(); // starš okvirja → zadnja izmerjena širina in notranji rob okvirja v njem
function hitro(mesta) {
  const ostali = [];
  for (const el of mesta) {
    const { w, rob, cls } = sirinaMesta.get(el.parentElement) || {};
    const f = w && cls === el.classList[0] && el.matches(`.katex-display, ${OKVIRI}`) && formuleOkvira(el, w, rob);
    const r = f && f.ks.map((k) => resitve.get(kljucFormule(k, f.w)));
    if (!r || r.some((x) => !x)) {
      ostali.push(el);
      continue;
    }
    f.ks.forEach((k, i) => {
      const z = (r[i].st && zlozi(k, r[i].st, r[i].meja)) || k;
      z.style.fontSize = r[i].fs;
    });
    sirine.set(el, w);
  }
  return ostali;
}

// Širina, ki jo ima formula sredi besedila na voljo v bloku el: vsebina brez notranjega roba (padding). Blok, ki se
// skrči na vsebino (klepetov mehurček: width: fit-content in max-width, okno z oblačkom), bi se zaradi formule, ki
// se ne prelomi, kar razširil do največje širine, zato merimo proti tej meji, ne proti trenutni širini.
// Enako velja za element v vrstici flex (čip z oznako in vrednostjo, j 12. 11. 2026): širok je toliko kot njegova
// vsebina, zato bi bila vsaka formula v njem »preširoka« za ločilo in zložena v stolpec. Prostor takega elementa je
// prostor njegovega starša (ta je lahko spet tak, npr. čip v vrstici čipov); v vrstici, ki se ne prelomi, brez
// sosedov, v vrstici, ki se prelomi, pa vsa vrstica (sosed gre v naslednjo vrstico).
function prostor(el) {
  const cs = getComputedStyle(el);
  const px = (v) => parseFloat(v) || 0;
  const rob = px(cs.paddingLeft) + px(cs.paddingRight);
  const cw = el.clientWidth - rob;
  const p = el.parentElement;
  const ps = p && getComputedStyle(p);
  const vFlex = !!ps && /flex$/.test(ps.display) && !ps.flexDirection.startsWith("column");
  if (!vFlex && !el.matches(".msg, .bubble, .fx-pop") && !/^inline/.test(cs.display) && !/^(?:fixed|absolute)$/.test(cs.position)) return cw;
  let pw = p && p !== document.body ? prostor(p) : innerWidth;
  if (vFlex && ps.flexWrap === "nowrap") {
    const gap = px(ps.columnGap);
    for (const s of p.children) if (s !== el && getComputedStyle(s).position !== "absolute") pw -= s.offsetWidth + gap;
  }
  let lim = Math.min(pw - px(cs.marginLeft) - px(cs.marginRight), innerWidth - 16); // okvir (z robom in obrobo)
  const mx = cs.maxWidth;
  let najvec = mx.endsWith("%") ? (pw * parseFloat(mx)) / 100 : mx.endsWith("px") ? parseFloat(mx) : Infinity;
  if (cs.boxSizing === "content-box") najvec += rob + (el.offsetWidth - el.clientWidth);
  lim = Math.min(lim, najvec) - rob - (el.offsetWidth - el.clientWidth);
  return Math.max(cw, lim);
}

// Formule, ki so se pri dani širini že izkazale za ustrezne (celotne, brez pomanjšanja in drsenja): ključ je širina,
// višina vrstice, velikost pisave in TeX. Klepet ob vsakem prispelem delu odgovora znova izriše ves mehurček, zato
// bi sicer vsakič znova merili vse formule; tako se izmeri le nova.
let ustrezne = new Set();

// Odstavek ali alineja z dolgo formulo med besedilom.
function vrstica(el) {
  const cw = prostor(el);
  if (!(cw > 0) || sirine.get(el) === cw) return;
  sirine.set(el, cw);
  const w = cw - 8; // prostor za ločilo za formulo (vejica, pika), ki ostane v isti vrstici
  const vis = visina(el);
  const pisava = getComputedStyle(el).fontSize;
  for (let k of el.querySelectorAll(":scope .katex")) {
    if (k.parentElement?.closest(".katex-display, table, .katex")) continue;
    if (prilagojene.get(k) === w && k.isConnected) continue;
    if (!el.closest(".textbook") && blok(k) !== el) continue; // formula v gnezdenem odstavku ima svoje mesto
    const tex = !izvirnik.has(k) && k.querySelector("annotation")?.textContent;
    const kljuc = tex && `${Math.round(w)}|${Math.round(vis)}|${pisava}|${tex}`;
    if (kljuc && ustrezne.has(kljuc)) {
      prilagojene.set(k, w);
      continue;
    }
    const k0 = k;
    k.classList.remove("tb-dolga");
    k.style.maxWidth = "";
    // Formula se ne prelomi sredi izraza (ui.css), zato šteje njena cela širina.
    // Zložena formula je blok z max-width 100 %, zato štejemo tudi njeno vsebino (scrollWidth).
    const sirina = (x) => Math.max(x.getBoundingClientRect().width, x.scrollWidth);
    k = prilagodiFormulo(k, w, sirina, vis * VISOKA);
    // Drsna formula pusti prostor za ločilo za njo (»…, 45$.«), sicer ločilo štrli čez rob vrstice.
    if (sirina(k) > w + 1) k.classList.add("tb-dolga"), (k.style.maxWidth = `${Math.floor(w)}px`);
    else if (kljuc && k === k0 && !k.style.fontSize) {
      if (ustrezne.size > 1000) ustrezne = new Set();
      ustrezne.add(kljuc);
    }
    prilagojene.set(k, w);
  }
}

// Formula, višja od toliko vrstic besedila, gre v svojo vrstico.
export const VISOKA = 1.2; // z robom -0,15em v textbook.css taka formula še ne razmakne vrstice
function visina(el) {
  const lh = parseFloat(getComputedStyle(el).lineHeight);
  return Number.isFinite(lh) ? lh : parseFloat(getComputedStyle(el).fontSize) * 1.6;
}

// Formula v delu strani, ki ga brskalnik še ne izriše (content-visibility: auto, npr. daljni razdelki lista formul,
// graph.css): merjenje bi brskalnik prisililo, da ta del postavi takoj (list formul se je zato odpiral pol sekunde).
// Prilagodimo jo, ko se del približa zaslonu (dogodek spodaj), še preden je viden. Velja tudi za skrite (display: none).
export const neizrisano = (el) => !!el.checkVisibility && !el.checkVisibility({ contentVisibilityAuto: true });

function prilagodi(el) {
  if (!el.isConnected) {
    ro.unobserve(el);
    opazovani.delete(el);
    return;
  }
  if (neizrisano(el)) return;
  if (el.matches(BOX) || el.matches(OKVIRI)) okvir(el);
  else vrstica(el);
}

function opazuj(el) {
  if (opazovani.has(el)) return;
  ro.observe(el);
  opazovani.add(el);
}

// Najbližji blokovni starš formule sredi besedila (naloga, klepetov mehurček, odgovor kviza …): vrstica, v kateri
// se meri. Vmesni vrstični elementi (span, b, a) se preskočijo, saj nimajo svoje širine.
function blok(k) {
  let e = k.parentElement;
  while (e && e !== document.body && getComputedStyle(e).display === "inline") e = e.parentElement;
  return e && e !== document.body ? e : null;
}

// Kje se prilagodi formula k: njena prikazana formula, okvir s formulo ali vrstica z besedilom (v učbeniku
// odstavek, drugje najbližji blokovni starš; ne v poljih za vnos, SVG in tabelah).
function mestoFormule(k) {
  if (k.parentElement?.closest(".katex")) return null;
  const d = k.closest(".katex-display");
  if (d) return d.parentElement?.closest(".katex-display, table") ? null : d;
  const o = k.closest(OKVIRI);
  if (o) return o.parentElement?.closest(".katex-display") ? null : o;
  if (k.closest("table, svg, math-field, textarea, input, [contenteditable]")) return null;
  if (k.closest(".textbook")) return k.parentElement?.closest(VRSTE) || null;
  return blok(k);
}

let mo = null;
// Vse nove formule na strani (j 2026-11-04: »To naj velja za vse enačbe«). Simulacija ob vsakem premiku
// drsnika na novo izriše svoje formule; prilagodimo jih takoj, še pred izrisom slike, da se nič ne zablisne.
function noveFormule(zapisi) {
  const mesta = new Set();
  for (const z of zapisi)
    for (const n of z.addedNodes) {
      if (n.nodeType !== 1 || !n.isConnected) continue;
      const ks = n.classList.contains("katex") ? [n] : n.getElementsByClassName("katex");
      for (const k of ks) {
        if (nasi.has(k)) continue;
        const m = mestoFormule(k);
        if (m) mesta.add(m);
      }
    }
  if (!mesta.size) return;
  if (opazovani.size > 400) opazovani.forEach((el) => el.isConnected || (ro.unobserve(el), opazovani.delete(el)));
  mesta.forEach((el) => {
    opazuj(el);
    sirine.delete(el); // nova vsebina: prilagodi tudi pri isti širini
  });
  hitro(mesta).forEach(prilagodi);
}

// Nove formule prilagodi takoj, ne šele v mikroopravilu opazovalca: klepet za izrisom pomakne pogovor na dno in
// mora meriti že zloženo višino (sicer zložena formula odrine konec odgovora pod rob in pogovor ne sledi več).
export function prilagodiZdaj() {
  if (mo) noveFormule(mo.takeRecords());
}

// Enkrat ob zagonu aplikacije (app.js, kalkulator.js): odslej se prilagodi vsaka formula na strani.
export function initSirina() {
  if (mo || typeof MutationObserver === "undefined" || typeof ResizeObserver === "undefined") return;
  zazeni();
  mo = new MutationObserver(noveFormule);
  mo.observe(document.body, { childList: true, subtree: true });
  noveFormule([{ addedNodes: [document.body] }]);
}

function zazeni() {
  if (ro) return;
  // V naslednji sliki, da sprememba pisave ne sproži opozorila »ResizeObserver loop«.
  ro = new ResizeObserver((vnosi) => requestAnimationFrame(() => vnosi.forEach((v) => prilagodi(v.target))));
  // Ko se naložijo pisave KaTeX, so formule drugače široke: prilagodi znova.
  const znova = () => {
    sirine = new WeakMap();
    prilagojene = new WeakMap();
    ustrezne = new Set();
    resitve.clear(); // rešitve, izmerjene z nadomestno pisavo, ne veljajo več
    opazovani.forEach(prilagodi);
  };
  // Del strani s content-visibility: auto se bo izrisal: prilagodi formule v njem (ne skače: še je pod robom zaslona).
  document.addEventListener("contentvisibilityautostatechange", (e) => !e.skipped && opazovani.forEach((el) => e.target.contains(el) && prilagodi(el)), true);
  document.fonts?.ready?.then(znova);
  document.fonts?.addEventListener?.("loadingdone", znova);
}

// vrstice: false = le formule v svoji vrstici in tabele (naša pola, public/our-paper.js), formule sredi besedila
// ostanejo, kot so (prelomijo se same).
export function prilagodiSirino(root, { vrstice = true } = {}) {
  if (!root || typeof ResizeObserver === "undefined") return;
  zazeni();
  opazovani.forEach((el) => el.isConnected || (ro.unobserve(el), opazovani.delete(el)));
  root.querySelectorAll(BOX).forEach((el) => {
    if (el.parentElement?.closest(".katex-display, .md-table-wrap")) return;
    opazuj(el);
  });
  if (!vrstice) return;
  const vrste = new Set();
  root.querySelectorAll(".katex").forEach((k) => {
    if (k.closest(".katex-display, table")) return;
    const o = k.closest(OKVIRI);
    if (o) return vrste.add(o);
    const p = k.parentElement?.closest(VRSTE);
    if (p) vrste.add(p);
  });
  vrste.forEach(opazuj);
}

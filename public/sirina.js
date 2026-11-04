// Široke formule in tabele v lekciji (j 2026-10-31: na telefonu so se skrivali stolpci in konci formul).
// Kar je preširoko za kartico, najprej malo pomanjšamo (do 80 %). Kar je še vedno preširoko, se pomika
// vstran in je označeno kot drsna vrstica (public/drsniki.js). Formula sredi besedila se nikoli ne prelomi
// v dve vrstici sredi izraza. Če formula ne gre v vrstico, jo zložimo pri enačajih: leva stran zgoraj,
// spodaj vsak »= …« v svoji vrstici, enačaji poravnani (j 2026-11-01). Šele kar je še vedno preširoko, se
// zmanjša ali pomika. Preverja scripts/preveri-videz-lekcij.cjs.

export const MIN = 0.8;
const BOX = ".katex-display, .md-table-wrap";
let sirine = new WeakMap(); // zadnja širina, pri kateri smo element že prilagodili
const opazovani = new Set();
let ro = null;

// Relacije, pri katerih zložimo predolgo formulo (le na vrhnji ravni, ne v ulomku ali oklepaju {…}).
const REL = new Set(["\\approx", "\\le", "\\leq", "\\ge", "\\geq", "\\neq", "\\ne", "\\equiv", "\\doteq", "\\sim", "\\simeq", "\\to", "\\rightarrow", "\\Rightarrow", "\\Leftrightarrow", "\\iff", "\\implies", "\\longrightarrow", "\\rightleftharpoons", "\\propto", "\\lt", "\\gt"]);
const LOCI = new Set(["\\quad", "\\qquad"]);
// Sklep (⇒, ⇔) začne novo izjavo, ki se v novi vrstici začne s puščico: »2h = 15« / »⇒ h = 7,5«.
const SKLEP = new Set(["\\Rightarrow", "\\implies", "\\iff", "\\Leftrightarrow", "\\Longrightarrow", "\\Longleftrightarrow"]);

// TeX formule → TeX z vrsticami v »aligned«, ali null, če formule ni kje zložiti.
// stopnja 1: le izjave, ločene s \quad, gredo vsaka v svojo vrstico.
// stopnja 2: še leva stran v svoji vrstici in pod njo vsak »= …« (zamaknjen, enačaji drug pod drugim).
export function zlozTex(tex, stopnja = 2) {
  if (/\\begin\{|\\\\|&/.test(tex)) return null; // že ima vrstice ali poravnavo
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
    const c = tex[i];
    let tok = c === "\\" ? /^\\(?:[a-zA-Z]+|[\s\S])/.exec(tex.slice(i))[0] : c;
    const iz = izjave[izjave.length - 1];
    const zadnji = iz[iz.length - 1];
    // \left( in \right) štejeta kot en oklepaj skupaj z ločilom; navadni ( [ tudi (»(a \ge 0)« ostane celo)
    if (tok === "\\left" || tok === "\\right") {
      depth += tok === "\\left" ? 1 : -1;
      tok += /^\s*(?:\\[a-zA-Z]+|\\.|.)/.exec(tex.slice(i + tok.length))?.[0] || "";
    } else if ("{([".includes(tok) || tok === "\\{" || tok === "\\lbrace") depth++;
    else if ("})]".includes(tok) || tok === "\\}" || tok === "\\rbrace") depth = Math.max(0, depth - 1);
    // Ne za _ ali ^ (v_\to) in ne za \not (\not\equiv): tam relacija spada k prejšnjemu.
    const prej = zadnji.t.trimEnd();
    const lahko = depth === 0 && prej && !/(?:[_^]|\\not)$/.test(prej);
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
  const del = (d) => `${d.rel ? `${d.rel} ` : ""}${ovoj(d.t.trim())}`;
  const vrstice = [];
  for (const iz of izjave) {
    const deli = iz.filter((d) => d.t.trim());
    if (deli.length < 2) {
      if (deli.length) vrstice.push(`&${del(deli[0])}`);
      continue;
    }
    // Leva stran v svoji vrstici, nato vsak »= …« v svoji (j 2026-11-01), enačaji drug pod drugim.
    if (stopnja < 2) vrstice.push(`&${deli.map(del).join(" ")}`);
    else vrstice.push(`&${del(deli[0])}`, ...deli.slice(1).map((d) => `&\\quad {}${del(d)}`));
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
function zamenjaj(k, html) {
  const t = document.createElement("span");
  t.innerHTML = html;
  const n = t.firstElementChild;
  k.replaceWith(n);
  return n;
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

// stopnja "t": ista formula v velikosti besedila (ostane v vrstici); 0: cela formula v svoji vrstici;
// 1 in 2: zložena (zlozTex).
function zlozi(k, stopnja) {
  const tex = (izvirnik.has(k) ? izvirniTex.get(k) : null) ?? k.querySelector("annotation")?.textContent;
  let al = tex && globalThis.katex && (stopnja === "t" ? besedilniTex(tex) : stopnja === 0 ? tex : zlozTex(tex, stopnja));
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
    izvirnik.set(n, orig);
    izvirniTex.set(n, tex);
    return n;
  }
  // Formula sredi besedila je zložena v svoji vrstici: pika ali vejica za njo gre na konec zadnje vrstice,
  // da ne ostane sama v novi vrstici.
  const inline = !k.parentElement?.closest(".katex-display");
  let p = locilo.get(k) || "";
  const nx = k.nextSibling;
  const vzemi = inline && !p && nx?.nodeType === 3 && /^[.,;:!?]/.test(nx.data);
  if (vzemi) p = nx.data[0];
  if (p) al = stopnja === 0 ? `${al}\\text{${p}}` : al.replace(/\\end\{aligned\}$/, `\\text{${p}}\\end{aligned}`);
  let html;
  try {
    html = globalThis.katex.renderToString(al, { throwOnError: true, strict: "ignore", trust: (c) => c.command === "\\htmlData" });
  } catch {
    return null;
  }
  if (vzemi) nx.data = nx.data.slice(1); // šele ko se je izrisala, sicer bi se ločilo izgubilo
  const orig = izvirnik.get(k) ?? k.outerHTML;
  const n = zamenjaj(k, html);
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
  if (k.getBoundingClientRect().height > visoka) k = zlozi(k, "t") || k;
  // Še vedno previsoka (npr. ulomek v ulomku): v svojo vrstico, razen v gumbu ali vprašanju z eno vrstico.
  if (k.getBoundingClientRect().height > visoka && !k.closest(".tb-opt, .tb-q")) k = zlozi(k, 0) || k;
  const need = meri(k);
  if (need <= w + 1) return k;
  // Najprej le izjave v svoje vrstice, nato še enačaji; vsakič vzamemo prvo, ki gre v vrstico.
  for (const st of [1, 2]) {
    if (meri(k) <= w + 1 || w / meri(k) >= 0.9) break;
    k = zlozi(k, st) || k;
  }
  pomanjsaj(k, w, () => meri(k));
  return k;
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

function okvir(el) {
  const w = el.clientWidth;
  if (!w || sirine.get(el) === w) return;
  sirine.set(el, w);
  if (el.matches(".katex-display")) {
    const k = el.querySelector(":scope > .katex");
    if (k) prilagodiFormulo(k, w, () => el.scrollWidth);
  } else {
    const t = el.querySelector(":scope > table");
    if (t) pomanjsaj(t, w, () => el.scrollWidth);
  }
}

// Odstavek ali alineja z dolgo formulo med besedilom.
function vrstica(el) {
  const cw = el.clientWidth;
  if (!cw || sirine.get(el) === cw) return;
  sirine.set(el, cw);
  const w = cw - 8; // prostor za ločilo za formulo (vejica, pika), ki ostane v isti vrstici
  for (let k of el.querySelectorAll(":scope .katex")) {
    if (k.parentElement?.closest(".katex-display, table, .katex")) continue;
    k.classList.remove("tb-dolga");
    // Formula se ne prelomi sredi izraza (textbook.css), zato šteje njena cela širina.
    // Zložena formula je blok z max-width 100 %, zato štejemo tudi njeno vsebino (scrollWidth).
    const sirina = (x) => Math.max(x.getBoundingClientRect().width, x.scrollWidth);
    k = prilagodiFormulo(k, w, sirina, visina(el) * VISOKA);
    if (sirina(k) > w + 1) k.classList.add("tb-dolga");
  }
}

// Formula, višja od toliko vrstic besedila, gre v svojo vrstico.
export const VISOKA = 1.2; // z robom -0,15em v textbook.css taka formula še ne razmakne vrstice
function visina(el) {
  const lh = parseFloat(getComputedStyle(el).lineHeight);
  return Number.isFinite(lh) ? lh : parseFloat(getComputedStyle(el).fontSize) * 1.6;
}

function prilagodi(el) {
  if (!el.isConnected) {
    ro.unobserve(el);
    opazovani.delete(el);
    return;
  }
  if (el.matches(BOX)) okvir(el);
  else vrstica(el);
}

// vrstice: false = le formule v svoji vrstici in tabele (naša pola, public/our-paper.js), formule sredi besedila
// ostanejo, kot so (prelomijo se same).
export function prilagodiSirino(root, { vrstice = true } = {}) {
  if (!root || typeof ResizeObserver === "undefined") return;
  if (!ro) {
    // V naslednji sliki, da sprememba pisave ne sproži opozorila »ResizeObserver loop«.
    ro = new ResizeObserver((vnosi) => requestAnimationFrame(() => vnosi.forEach((v) => prilagodi(v.target))));
    // Ko se naložijo pisave KaTeX, so formule drugače široke: prilagodi znova.
    const znova = () => {
      sirine = new WeakMap();
      opazovani.forEach(prilagodi);
    };
    document.fonts?.ready?.then(znova);
    document.fonts?.addEventListener?.("loadingdone", znova);
  }
  opazovani.forEach((el) => el.isConnected || (ro.unobserve(el), opazovani.delete(el)));
  root.querySelectorAll(BOX).forEach((el) => {
    if (el.parentElement?.closest(".katex-display, .md-table-wrap")) return;
    ro.observe(el);
    opazovani.add(el);
  });
  if (!vrstice) return;
  const vrste = new Set();
  root.querySelectorAll(".katex").forEach((k) => {
    if (k.closest(".katex-display, table")) return;
    const p = k.parentElement?.closest("p, li, h2, h3, dd, blockquote");
    if (p) vrste.add(p);
  });
  vrste.forEach((p) => (ro.observe(p), opazovani.add(p)));
}

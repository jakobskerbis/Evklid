// Računske simulacije pri biologiji (OŠ 9. razred, gimnazija): križanje (Punnettov kvadrat),
// Hardy-Weinbergovo ravnovesje z zdrsom in izborom, energijska piramida, rast populacije,
// delovanje encimov, osmoza in pot od DNA do beljakovine.
import { s, h, svgBox, slider, select, segmented, toggle, button, buttons, readout, layout, label, axes, fmt, gcd } from "./kit.js";

const pct = (x) => `${fmt(100 * x, x * 100 % 1 ? 1 : 0)} %`;
// Razmerje celih števil, okrajšano (npr. 2 : 2 → 1 : 1).
function ratio(list) {
  const g = list.reduce((a, b) => gcd(a, b), 0) || 1;
  return list.map((x) => x / g).join(" : ");
}

// ------------------------------------------------------------ križanje
const SUP = { A: "ᴬ", B: "ᴮ" };
const MODES = {
  mono: {
    title: "Ena lastnost, popolna dominanca (A > a)",
    genotypes: ["AA", "Aa", "aa"],
    split: (g) => [g.slice(0, 1), g.slice(1)].map((x) => [x]),
    pheno: (g) => (g.includes("A") ? "dominantni fenotip (npr. črna dlaka)" : "recesivni fenotip (bela dlaka)"),
    a: "Aa",
    b: "Aa",
  },
  vmesno: {
    title: "Nepopolna dominanca (rdeča RR, rožnata Rr, bela rr)",
    genotypes: ["RR", "Rr", "rr"],
    split: (g) => [g.slice(0, 1), g.slice(1)].map((x) => [x]),
    pheno: (g) => (g === "RR" ? "rdeči cvet" : g === "rr" ? "beli cvet" : "rožnati cvet"),
    a: "Rr",
    b: "Rr",
  },
  di: {
    title: "Dve lastnosti na različnih kromosomih (A > a, B > b)",
    genotypes: ["AABB", "AABb", "AaBB", "AaBb", "Aabb", "aaBb", "aabb"],
    // gamete: po en alel vsakega gena
    split: (g) => {
      const out = [];
      for (const x of [g[0], g[1]]) for (const y of [g[2], g[3]]) out.push([x, y]);
      return out;
    },
    pheno: (g) => `${g.includes("A") ? "A_" : "aa"} ${g.includes("B") ? "B_" : "bb"}`,
    a: "AaBb",
    b: "AaBb",
  },
  krvne: {
    title: "Krvne skupine ABO (Iᴬ = Iᴮ > i)",
    genotypes: ["AA", "Ai", "BB", "Bi", "AB", "ii"],
    split: (g) => [[g[0]], [g[1]]],
    pheno: (g) => {
      const A = g.includes("A"), B = g.includes("B");
      return A && B ? "skupina AB" : A ? "skupina A" : B ? "skupina B" : "skupina 0";
    },
    show: (a) => (a === "i" ? "i" : `I${SUP[a]}`),
    a: "Ai",
    b: "Bi",
  },
  x: {
    title: "Barvna slepota, gen na kromosomu X (Xᴮ zdrav > Xᵇ)",
    genotypes: ["XBXB", "XBXb", "XbXb", "XBY", "XbY"],
    mother: ["XBXB", "XBXb", "XbXb"],
    father: ["XBY", "XbY"],
    split: (g) => (g.endsWith("Y") ? [[g.slice(0, 2)], ["Y"]] : [[g.slice(0, 2)], [g.slice(2)]]),
    pheno: (g) => {
      const son = g.includes("Y");
      const sick = son ? g.includes("Xb") : g === "XbXb";
      if (son) return sick ? "sin, barvno slep" : "sin, zdrav";
      return sick ? "hči, barvno slepa" : g.includes("Xb") ? "hči, zdrava prenašalka" : "hči, zdrava";
    },
    show: (a) => (a === "Y" ? "Y" : a === "XB" ? "Xᴮ" : "Xᵇ"),
    a: "XBXb",
    b: "XBY",
  },
};

// Uredi alele v genotipu: velika črka pred malo, Iᴬ/Iᴮ pred i, X pred Y.
function canon(mode, alleles) {
  if (mode === "di") {
    const [a1, b1, a2, b2] = alleles;
    const pair = (x, y) => [x, y].sort((p, q) => (p === p.toUpperCase() ? -1 : 0) - (q === q.toUpperCase() ? -1 : 0)).join("");
    return pair(a1, a2) + pair(b1, b2);
  }
  const rank = (a) => (a === "Y" ? 3 : a === "i" || a === "Xb" || a === a.toLowerCase() ? 2 : 1);
  return [...alleles].sort((p, q) => rank(p) - rank(q) || p.localeCompare(q)).join("");
}

// Vsi potomci križanja: [{ genotip, delež }] in fenotipi. Uporabljajo jo tudi naloge.
export function cross(mode, g1, g2) {
  const M = MODES[mode];
  const ga = M.split(g1), gb = M.split(g2);
  const cells = [];
  for (const x of ga) for (const y of gb) cells.push(canon(mode, mode === "di" ? [x[0], x[1], y[0], y[1]] : [...x, ...y]));
  const geno = new Map(), pheno = new Map();
  for (const c of cells) {
    geno.set(c, (geno.get(c) || 0) + 1);
    const p = M.pheno(c);
    pheno.set(p, (pheno.get(p) || 0) + 1);
  }
  return { ga, gb, cells, n: cells.length, geno: [...geno], pheno: [...pheno] };
}

const showAllele = (mode, a) => (MODES[mode].show ? MODES[mode].show(a) : a);
const showGeno = (mode, g) => {
  if (mode === "krvne") return g.split("").map((a) => showAllele(mode, a)).join("");
  if (mode === "x") return g.replace(/XB/g, "Xᴮ").replace(/Xb/g, "Xᵇ");
  return g;
};

export function krizanje(el, { mode = "mono" } = {}) {
  const out = readout();
  const svg = svgBox(340, 300);
  let m = MODES[mode] ? mode : "mono";
  let A = MODES[m].a, B = MODES[m].b;
  const opts = (list) => list.map((g) => [g, showGeno(m, g)]);
  const selA = select({ label: m === "x" ? "Mati" : "Starš 1", options: opts(MODES[m].mother || MODES[m].genotypes), value: A, onChange: (v) => ((A = v), draw()) });
  const selB = select({ label: m === "x" ? "Oče" : "Starš 2", options: opts(MODES[m].father || MODES[m].genotypes), value: B, onChange: (v) => ((B = v), draw()) });
  const draw = () => {
    svg.replaceChildren();
    const r = cross(m, A, B);
    // pri dihibridnem križanju se gamete lahko ponovijo (npr. AABB da samo AB): pokažemo vse 4 × 4
    const nA = r.ga.length, nB = r.gb.length;
    const size = Math.min(56, 250 / Math.max(nA, nB));
    const x0 = 70, y0 = 40;
    svg.setAttribute("viewBox", `0 0 340 ${Math.round(y0 + size * nA + 8)}`); // višina po velikosti kvadrata
    const gam = (g) => g.map((a) => showAllele(m, a)).join("");
    label(svg, 170, 14, `${showGeno(m, A)} × ${showGeno(m, B)}`, "lbl");
    r.gb.forEach((g, j) => label(svg, x0 + size * (j + 0.5), y0 - 10, gam(g), "lbl small"));
    r.ga.forEach((g, i) => label(svg, x0 - 22, y0 + size * (i + 0.5), gam(g), "lbl small"));
    const phenos = r.pheno.map(([p]) => p);
    const cls = ["fill-a", "fill-b", "fill-c", "fill-soft", "fill-muted", "fill-danger-soft"];
    r.cells.forEach((c, k) => {
      const i = Math.floor(k / nB), j = k % nB;
      s("rect", { x: x0 + j * size, y: y0 + i * size, width: size - 2, height: size - 2, rx: 6, class: cls[phenos.indexOf(MODES[m].pheno(c)) % cls.length], opacity: 0.55 }, svg);
      label(svg, x0 + j * size + size / 2 - 1, y0 + i * size + size / 2 - 1, showGeno(m, c), size < 50 ? "lbl small" : "lbl");
    });
    const genoTxt = r.geno.map(([g, k]) => `${showGeno(m, g)} ${k}/${r.n}`).join(", ");
    const phenoTxt = r.pheno.map(([p, k]) => `${p}: ${pct(k / r.n)}`).join("<br>");
    out.innerHTML = `<p><b>Genotipi:</b> ${genoTxt} (razmerje ${ratio(r.geno.map(([, k]) => k))})</p>
      <p><b>Fenotipi</b> (razmerje ${ratio(r.pheno.map(([, k]) => k))}):<br>${phenoTxt}</p>
      <p class="muted">Vsako polje je ena enako verjetna kombinacija gamet. Deleži so verjetnosti za vsakega potomca, ne natančno število v leglu.</p>`;
  };
  draw();
  layout(el, {
    stage: svg,
    controls: [h("p", { class: "muted" }, MODES[m].title), selA, selB],
    out,
    tryText:
      m === "x"
        ? "Ali lahko zdrav oče in zdrava mati dobita barvno slepega sina? Kakšen mora biti genotip matere?"
        : m === "krvne"
          ? "Poišči starša, ki lahko dobita otroke vseh štirih krvnih skupin."
          : m === "di"
            ? "Križaj AaBb × aabb. Zakaj ga imenujemo testno križanje?"
            : "Kaj dobiš pri križanju Aa × aa? Kako bi s takim križanjem ugotovil genotip črne živali?",
  });
}

// ------------------------------------------------------------ Hardy-Weinberg
export function hw(el) {
  const out = readout();
  const svg = svgBox(340, 300);
  let p = 0.6, N = 50, sel = false, hist = [0.6];
  const draw = () => {
    svg.replaceChildren();
    const q = 1 - p;
    const bars = [["AA", p * p], ["Aa", 2 * p * q], ["aa", q * q]];
    bars.forEach(([g, v], i) => {
      const x = 30 + i * 100, hgt = 120 * v;
      s("rect", { x, y: 140 - hgt, width: 70, height: hgt, rx: 4, class: ["fill-a", "fill-c", "fill-b"][i] }, svg);
      label(svg, x + 35, 152, g, "lbl");
      label(svg, x + 35, 130 - hgt, pct(v), "lbl small");
    });
    const A = axes(svg, { W: 340, H: 300, x: [0, Math.max(20, hist.length - 1)], y: [0, 1], pad: 28, padT: 170, xLabel: "generacija", yLabel: "p", yStep: 0.5, grid: false });
    s("path", { d: hist.map((v, i) => `${i ? "L" : "M"}${A.X(i)},${A.Y(v)}`).join(""), class: "graph-line stroke-a" }, svg);
    out.innerHTML = `<p>Pogostost alelov: p(A) = ${fmt(p, 2)}, q(a) = ${fmt(q, 2)}, p + q = 1</p>
      <p>Pričakovani genotipi: p² = ${fmt(p * p, 3)}, 2pq = ${fmt(2 * p * q, 3)}, q² = ${fmt(q * q, 3)} (vsota 1)</p>
      <p class="muted">${hist.length > 1 ? `Po ${hist.length - 1} ${hist.length === 2 ? "generaciji" : "generacijah"}: ${sel ? "izbor proti aa zmanjšuje q." : N >= 500 ? "velika populacija: p se skoraj ne spreminja (ravnovesje)." : "majhna populacija: p naključno niha (genski zdrs)."}` : "Pritisni »Naslednja generacija«: potomci dobijo alele naključno iz genskega sklada staršev."}</p>`;
  };
  // ena generacija: naključno vzorčenje 2N alelov, po želji osebki aa preživijo le s 50 %
  const gen = () => {
    let a = 0, total = 0;
    for (let i = 0; i < N; i++) {
      const x = Math.random() < p, y = Math.random() < p;
      if (sel && !x && !y && Math.random() < 0.5) continue;
      a += x + y;
      total += 2;
    }
    p = total ? a / total : p;
    hist.push(p);
    if (hist.length > 60) hist.shift();
    pS.set(p, true);
    draw();
  };
  const pS = slider({ label: "p (alel A)", min: 0, max: 1, step: 0.01, value: p, onInput: (v) => ((p = v), (hist = [v]), draw()) });
  const nS = segmented({ options: [["20", "N = 20"], ["50", "N = 50"], ["1000", "N = 1000"]], value: "50", onChange: (v) => ((N = Number(v)), (hist = [p]), draw()) });
  const selT = toggle("izbor proti aa (preživi polovica)", sel, (v) => ((sel = v), (hist = [p]), draw()));
  draw();
  layout(el, {
    stage: svg,
    controls: [pS, nS, selT, buttons(button("Naslednja generacija ▸", gen, "primary small"), button("10 generacij", () => Array.from({ length: 10 }, gen), "secondary small"))],
    out,
    tryText: "Pri kateri velikosti populacije se alel najhitreje izgubi ali utrdi? Zakaj recesivni alel z izborom izginja zelo počasi, ko je redek?",
  });
}

// ------------------------------------------------------------ energijska piramida
export function piramida(el) {
  const out = readout();
  const svg = svgBox(340, 240);
  let E0 = 10000, eff = 10;
  const names = ["proizvajalci (rastline)", "rastlinojedci", "mesojedci", "končni plenilci"];
  const draw = () => {
    svg.replaceChildren();
    const vals = names.map((_, i) => E0 * (eff / 100) ** i);
    vals.forEach((v, i) => {
      const w = 300 - i * 64, y = 190 - i * 50; // oblika piramide; vrednosti so napisane
      s("rect", { x: 170 - w / 2, y, width: w, height: 42, rx: 4, class: ["fill-a", "fill-c", "fill-b", "fill-danger-soft"][i] }, svg);
      label(svg, 170, y + 14, names[i], "lbl small");
      label(svg, 170, y + 30, `${fmt(v, v < 10 ? 1 : 0)} kJ`, "lbl small");
    });
    out.innerHTML = `<p>Na vsako višjo raven preide le okoli ${eff} % energije. Ostalo se porabi za dihanje in gibanje ter izgubi kot toplota, del ostane v neužitnih delih in iztrebkih.</p>
      <p>Končni plenilci dobijo ${fmt(100 * (eff / 100) ** 3, 2)} % energije proizvajalcev.</p>`;
  };
  draw();
  layout(el, {
    stage: svg,
    controls: [
      slider({ label: "energija proizvajalcev", min: 1000, max: 50000, step: 1000, value: E0, unit: "kJ", onInput: (v) => ((E0 = v), draw()) }),
      slider({ label: "prenos na višjo raven", min: 5, max: 20, step: 1, value: eff, unit: "%", onInput: (v) => ((eff = v), draw()) }),
    ],
    out,
    tryText: { razmisli: "Zakaj so prehranjevalne verige redko daljše od štirih ali petih členov? Zakaj je za ljudi učinkoviteje jesti rastline kot meso?" },
  });
}

// ------------------------------------------------------------ rast populacije
export function populacija(el) {
  const out = readout();
  const svg = svgBox(340, 240);
  let r = 0.4, K = 500, lim = true, N0 = 10;
  const T = 30;
  const draw = () => {
    svg.replaceChildren();
    const N = [N0];
    for (let t = 1; t <= T; t++) {
      const n = N[t - 1];
      N.push(Math.max(0, n + r * n * (lim ? 1 - n / K : 1)));
    }
    const top = Math.max(K * 1.2, Math.min(5000, Math.max(...N)));
    const A = axes(svg, { W: 340, H: 240, x: [0, T], y: [0, top], pad: 40, xLabel: "čas (leta)", yLabel: "N" });
    if (lim) s("line", { x1: A.X(0), y1: A.Y(K), x2: A.X(T), y2: A.Y(K), class: "guide", "data-name": "Nosilna zmogljivost" }, svg), label(svg, A.X(T) - 4, A.Y(K) - 8, "K", "lbl small", "end");
    s("path", { d: N.map((v, i) => `${i ? "L" : "M"}${A.X(i)},${A.Y(Math.min(v, top))}`).join(""), class: "graph-line stroke-a", "data-name": "Velikost populacije" }, svg);
    out.innerHTML = `<p>Prirast na osebek r = rodnost − smrtnost = ${fmt(r, 2)} na leto.</p>
      <p>Po ${T} letih: N ≈ ${fmt(N[T], 0)} osebkov.</p>
      <p class="muted">${lim ? "Z omejenimi viri rast upočasni tekmovanje znotraj vrste: krivulja je v obliki črke S in se ustali pri nosilni zmogljivosti K." : "Brez omejitev je rast eksponentna (krivulja J): vsako leto se populacija poveča za isti delež."}</p>`;
  };
  draw();
  layout(el, {
    stage: svg,
    controls: [
      slider({ label: "r (rodnost − smrtnost)", min: -0.2, max: 1, step: 0.05, value: r, onInput: (v) => ((r = v), draw()) }),
      slider({ label: "nosilna zmogljivost K", min: 100, max: 2000, step: 50, value: K, onInput: (v) => ((K = v), draw()) }),
      toggle("omejeni viri (hrana, prostor)", lim, (v) => ((lim = v), draw())),
    ],
    out,
    tryText: "Kaj se zgodi, če je r negativen? Kdaj bi se populacija srn na novem otoku najhitreje večala?",
  });
}

// ------------------------------------------------------------ encimi
const ENZ = {
  amilaza: { name: "slinska amilaza", T: 37, pH: 7 },
  pepsin: { name: "pepsin (želodec)", T: 37, pH: 2 },
  tripsin: { name: "tripsin (tanko črevo)", T: 37, pH: 8 },
  termo: { name: "encim termofilne bakterije", T: 75, pH: 7 },
};
// relativna aktivnost 0–1: zvonasta po pH, po temperaturi počasna rast in hiter padec (denaturacija)
export function enzymeActivity(e, T, pH) {
  const d = ENZ[e] || ENZ.amilaza;
  const fT = T <= d.T ? Math.exp(-(((d.T - T) / 22) ** 2)) : Math.max(0, 1 - ((T - d.T) / 12) ** 2);
  const fP = Math.exp(-(((pH - d.pH) / 1.6) ** 2));
  return fT * fP;
}
export function encim(el, { mode = "temp" } = {}) {
  const out = readout();
  const svg = svgBox(340, 240);
  let e = mode === "ph" ? "pepsin" : "amilaza", T = 37, pH = mode === "ph" ? 2 : 7, S = 2;
  const draw = () => {
    svg.replaceChildren();
    const d = ENZ[e];
    if (mode === "substrat") {
      const A = axes(svg, { W: 340, H: 240, x: [0, 10], y: [0, 1.1], pad: 34, xLabel: "[substrat]", yLabel: "hitrost" });
      const v = (x) => x / (1.5 + x);
      s("path", { d: Array.from({ length: 101 }, (_, i) => `${i ? "L" : "M"}${A.X(i / 10)},${A.Y(v(i / 10))}`).join(""), class: "graph-line stroke-a", "data-name": "Hitrost reakcije" }, svg);
      s("circle", { cx: A.X(S), cy: A.Y(v(S)), r: 7, class: "pt fill-accent", "data-name": "Izbrana točka" }, svg);
      out.innerHTML = `<p>Hitrost reakcije: ${pct(v(S))} največje.</p><p class="muted">${v(S) > 0.8 ? "Skoraj vsa aktivna mesta so zasedena (nasičenje): več substrata reakcije skoraj ne pospeši, več encima pa bi jo." : "Prostih aktivnih mest je še veliko: več substrata pomeni več trkov in hitrejšo reakcijo."}</p>`;
      return;
    }
    const byT = mode === "temp";
    const A = axes(svg, { W: 340, H: 240, x: byT ? [0, 100] : [0, 14], y: [0, 1.1], pad: 34, xLabel: byT ? "T (°C)" : "pH", yLabel: "aktivnost" });
    const f = (x) => (byT ? enzymeActivity(e, x, d.pH) : enzymeActivity(e, d.T, x));
    const xs = Array.from({ length: 141 }, (_, i) => (byT ? (i * 100) / 140 : (i * 14) / 140));
    s("path", { d: xs.map((x, i) => `${i ? "L" : "M"}${A.X(x)},${A.Y(f(x))}`).join(""), class: "graph-line stroke-a", "data-name": "Aktivnost encima" }, svg);
    const x = byT ? T : pH, a = f(x);
    s("circle", { cx: A.X(x), cy: A.Y(a), r: 7, class: "pt fill-accent", "data-name": "Izbrana točka" }, svg);
    const why = byT
      ? T > d.T + 3
        ? "Nad optimalno temperaturo se encim denaturira: aktivno mesto spremeni obliko, substrat se ne prilega več (ključ in ključavnica). Sprememba je navadno trajna."
        : T < d.T - 10
          ? "Pri nizki temperaturi se molekule gibljejo počasi in redkeje trčijo; encim ni pokvarjen in po segretju spet deluje."
          : "Blizu optimalne temperature je encim najbolj dejaven."
      : Math.abs(pH - d.pH) > 1.5
        ? "Pri neprimernem pH se spremenijo naboji v aktivnem mestu, zato se oblika ne ujema več s substratom."
        : "Blizu optimalnega pH je aktivno mesto prave oblike.";
    out.innerHTML = `<p>${d.name}: aktivnost ${pct(a)} največje (optimum ${byT ? `${d.T} °C` : `pH ${d.pH}`}).</p><p class="muted">${why}</p>`;
  };
  const ctl = [];
  if (mode !== "substrat") ctl.push(select({ label: "encim", options: Object.entries(ENZ).map(([k, v]) => [k, v.name]), value: e, onChange: (v) => ((e = v), draw()) }));
  if (mode === "temp") ctl.push(slider({ label: "temperatura", min: 0, max: 100, step: 1, value: T, unit: "°C", onInput: (v) => ((T = v), draw()) }));
  if (mode === "ph") ctl.push(slider({ label: "pH", min: 0, max: 14, step: 0.5, value: pH, onInput: (v) => ((pH = v), draw()) }));
  if (mode === "substrat") ctl.push(slider({ label: "koncentracija substrata", min: 0, max: 10, step: 0.25, value: S, onInput: (v) => ((S = v), draw()) }));
  draw();
  layout(el, {
    stage: svg,
    controls: ctl,
    out,
    tryText: mode === "ph" ? { razmisli: "Zakaj pepsin v tankem črevesu preneha delovati?" } : mode === "substrat" ? { razmisli: "Kako bi pospešil reakcijo, ko so vsa aktivna mesta zasedena?" } : { razmisli: "Zakaj kuhan krompir ne razgradi vodikovega peroksida, surov pa ga?" },
  });
}

// ------------------------------------------------------------ osmoza
export function osmoza(el, { cell = "zival" } = {}) {
  const out = readout();
  const svg = svgBox(340, 220);
  let c = 0.9, kind = cell === "rastlina" ? "rastlina" : "zival";
  const iso = 0.9; // % NaCl, izotonična za človeške celice
  const draw = () => {
    svg.replaceChildren();
    s("rect", { x: 20, y: 20, width: 300, height: 180, rx: 14, class: "fill-soft", opacity: 0.25 + Math.min(0.6, c / 4) }, svg);
    const d = c - iso;
    if (kind === "zival") {
      const burst = c < 0.3;
      const rad = burst ? 0 : Math.max(36, Math.min(78, 60 - d * 14));
      if (burst) {
        for (let i = 0; i < 8; i++) {
          const a = (i * Math.PI) / 4;
          s("path", { d: `M${170 + 40 * Math.cos(a)},${110 + 40 * Math.sin(a)} q 10 -8 22 0`, class: "graph-line stroke-b" }, svg);
        }
        label(svg, 170, 110, "celica je počila", "lbl");
      } else {
        const wob = d > 0.5 ? 6 : 0; // nagubana (skrčena) membrana
        const pts = Array.from({ length: 49 }, (_, i) => {
          const a = (i * Math.PI) / 24, rr = rad + wob * Math.sin(8 * a);
          return `${i ? "L" : "M"}${170 + rr * Math.cos(a)},${110 + rr * Math.sin(a)}`;
        }).join("");
        s("path", { d: pts + "Z", class: "fill-danger-soft", stroke: "currentColor" }, svg);
      }
    } else {
      s("rect", { x: 100, y: 50, width: 140, height: 120, rx: 8, fill: "none", stroke: "currentColor", "stroke-width": 4 }, svg);
      const shrink = Math.max(0, Math.min(1, (c - iso - 0.15) / 3)); // plazmoliza v hipertonični raztopini
      const w = 132 - 70 * shrink, hh = 112 - 60 * shrink;
      s("rect", { x: 170 - w / 2, y: 110 - hh / 2, width: w, height: hh, rx: 10 + 20 * shrink, class: "fill-a", opacity: 0.6 }, svg);
      label(svg, 170, 190, shrink > 0.05 ? "plazmoliza" : c < iso - 0.15 ? "napeta celica (turgor)" : "ohlapna celica", "lbl small");
    }
    const dir = Math.abs(d) < 0.15 ? "eq" : d < 0 ? "in" : "out";
    if (dir !== "eq") {
      const inn = dir === "in";
      [[40, 110], [300, 110]].forEach(([x, y]) => s("text", { x, y, class: "lbl big", "text-anchor": "middle", "dominant-baseline": "middle" }, svg, inn ? (x < 170 ? "→" : "←") : x < 170 ? "←" : "→"));
    }
    const name = dir === "eq" ? "izotonična" : dir === "in" ? "hipotonična" : "hipertonična";
    const txt =
      dir === "eq"
        ? "Koncentracija je enaka kot v celici: voda prehaja v obe smeri enako, celica se ne spremeni."
        : dir === "in"
          ? kind === "zival"
            ? "Zunaj je manj raztopljenih snovi: voda z osmozo vstopa v celico. Živalska celica nima stene, zato nabrekne in lahko poči."
            : "Voda vstopa v celico, a celična stena ji ne pusti počiti: celica je napeta (turgor), rastlina je čvrsta."
          : kind === "zival"
            ? "Zunaj je več raztopljenih snovi: voda izstopa iz celice, celica se skrči in naguba."
            : "Voda izstopa iz vakuole, citoplazma s membrano se odmakne od stene (plazmoliza): rastlina oveni.";
    out.innerHTML = `<p>Raztopina ${fmt(c, 1)} % NaCl je za celico <b>${name}</b>.</p><p class="muted">${txt}</p>`;
  };
  draw();
  layout(el, {
    stage: svg,
    controls: [
      segmented({ options: [["zival", "živalska celica (krvnička)"], ["rastlina", "rastlinska celica"]], value: kind, onChange: (v) => ((kind = v), draw()) }),
      slider({ label: "koncentracija NaCl zunaj", min: 0, max: 5, step: 0.1, value: c, unit: "%", onInput: (v) => ((c = v), draw()) }),
    ],
    out,
    tryText: { razmisli: "Zakaj bolnikom v žilo dajemo 0,9-odstotno fiziološko raztopino, ne čiste vode? Zakaj solata v slanem prelivu oveni?" },
  });
}

// ------------------------------------------------------------ od DNA do beljakovine
const BASES = "UCAG";
const AA = "FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG";
const AA3 = { F: "Phe", L: "Leu", S: "Ser", Y: "Tyr", C: "Cys", W: "Trp", P: "Pro", H: "His", Q: "Gln", R: "Arg", I: "Ile", M: "Met", T: "Thr", N: "Asn", K: "Lys", V: "Val", A: "Ala", D: "Asp", E: "Glu", G: "Gly", "*": "STOP" };
export function codon(c) {
  const i = 16 * BASES.indexOf(c[0]) + 4 * BASES.indexOf(c[1]) + BASES.indexOf(c[2]);
  return AA3[AA[i]];
}
const PAIR_DNA = { A: "T", T: "A", C: "G", G: "C" };
const PAIR_RNA = { A: "U", T: "A", C: "G", G: "C" };
export const transcribe = (template) => [...template].map((b) => PAIR_RNA[b]).join("");
export function translate(mrna) {
  const out = [];
  for (let i = 0; i + 3 <= mrna.length; i += 3) {
    const a = codon(mrna.slice(i, i + 3));
    out.push(a);
    if (a === "STOP") break;
  }
  return out;
}

export function dna(el, { seq = "TACGGTCTAAAGATT" } = {}) {
  const out = readout();
  let s0 = seq;
  const input = h("input", { type: "text", value: s0, maxlength: 30, "aria-label": "matrična veriga DNA", spellcheck: "false", autocomplete: "off", class: "demo-text" });
  input.addEventListener("input", () => {
    const v = input.value.toUpperCase().replace(/[^ACGT]/g, "");
    if (v !== input.value) input.value = v;
    s0 = v;
    draw();
  });
  const triplets = (x) => x.match(/.{1,3}/g)?.join(" ") || "";
  const draw = () => {
    const comp = [...s0].map((b) => PAIR_DNA[b]).join("");
    const m = transcribe(s0);
    const prot = translate(m);
    out.innerHTML = `<table class="table"><tbody>
      <tr><th>DNA (matrica)</th><td><code>${triplets(s0)}</code></td></tr>
      <tr><th>komplementarna DNA</th><td><code>${triplets(comp)}</code></td></tr>
      <tr><th>mRNA (prepis)</th><td><code>${triplets(m)}</code></td></tr>
      <tr><th>beljakovina (prevod)</th><td>${prot.join(" – ") || "—"}</td></tr></tbody></table>
      <p class="muted">Pari baz: A–T in C–G v DNA, v RNA je namesto T uracil (U). Vsak kodon (trojček baz mRNA) določa eno aminokislino; AUG je začetni (Met), UAA, UAG in UGA so stop.</p>`;
  };
  const rnd = () => "ACGT"[Math.floor(Math.random() * 4)];
  const set = (v) => ((s0 = v), (input.value = v), draw());
  draw();
  layout(el, {
    stage: h("div", { class: "demo-dna" }, input),
    controls: [
      buttons(
        button("Naključni gen", () => set("TAC" + Array.from({ length: 9 }, rnd).join("") + "ATT"), "secondary small"),
        button("Zamenjaj eno bazo", () => {
          if (!s0.length) return;
          const i = 3 + Math.floor(Math.random() * Math.max(1, s0.length - 3));
          const b = s0[i] || "A";
          set(s0.slice(0, i) + "ACGT".replace(b, "")[Math.floor(Math.random() * 3)] + s0.slice(i + 1));
        }, "secondary small"),
        button("Vrini bazo", () => {
          const i = 3 + Math.floor(Math.random() * Math.max(1, s0.length - 3));
          set((s0.slice(0, i) + rnd() + s0.slice(i)).slice(0, 30));
        }, "secondary small"),
      ),
    ],
    out,
    tryText: "Zamenjaj eno bazo: ali se je beljakovina vedno spremenila? Vrini bazo: zakaj se spremenijo vse naslednje aminokisline?",
  });
}

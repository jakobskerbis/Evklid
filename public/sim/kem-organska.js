// Simulacije pri kemiji: organske spojine in poimenovanje, izomerija, destilacija nafte, polimeri, organske reakcije.
import { s, svgBox, slider, select, segmented, toggle, button, buttons, readout, layout, texBlock, fmt, clamp, label, animate, playButton, rnd } from "./kit.js";
import { sub, drawMolecule } from "./kem-skupno.js";

const ROOT = ["met", "et", "prop", "but", "pent", "heks", "hept", "okt", "non", "dek"];
const ALKIL = ["metil", "etil", "propil", "butil"];
const CAP = (t) => t[0].toUpperCase() + t.slice(1);

// ------------------------------------------------------------ organska: poimenovanje in strukturne formule
const SKUPINE = {
  alkan: ["alkani", 1, false, "C<sub>n</sub>H<sub>2n+2</sub>", "Nasičeni ogljikovodiki: med atomi C so samo enojne vezi. Končnica <b>-an</b>."],
  alken: ["alkeni", 2, true, "C<sub>n</sub>H<sub>2n</sub>", "Nenasičeni ogljikovodiki z eno dvojno vezjo C=C. Končnica <b>-en</b>, številka pove položaj dvojne vezi."],
  alkin: ["alkini", 2, true, "C<sub>n</sub>H<sub>2n−2</sub>", "Nenasičeni ogljikovodiki s trojno vezjo C≡C. Končnica <b>-in</b>."],
  alkohol: ["alkoholi", 1, true, "C<sub>n</sub>H<sub>2n+1</sub>OH", "Funkcionalna skupina je hidroksilna skupina <b>–OH</b>. Končnica <b>-ol</b>."],
  halogenoalkan: ["halogenoalkani", 1, true, "C<sub>n</sub>H<sub>2n+1</sub>X", "Atom vodika je zamenjan s halogenim elementom (tu klor). Predpona <b>kloro-</b>."],
  aldehid: ["aldehidi", 1, false, "C<sub>n</sub>H<sub>2n</sub>O", "Karbonilna skupina <b>–CHO</b> je na koncu verige. Končnica <b>-al</b>."],
  keton: ["ketoni", 3, true, "C<sub>n</sub>H<sub>2n</sub>O", "Karbonilna skupina <b>C=O</b> je znotraj verige. Končnica <b>-on</b>."],
  kislina: ["karboksilne kisline", 1, false, "C<sub>n</sub>H<sub>2n+1</sub>COOH", "Karboksilna skupina <b>–COOH</b>. Ime: <b>-ojska kislina</b>. V vodi so šibke kisline."],
  ester: ["estri", 1, false, "RCOOR'", "Nastanejo iz karboksilne kisline in alkohola. Ime: <b>alkil alkanoat</b>. Mnogi dišijo po sadju."],
  amin: ["amini", 1, true, "C<sub>n</sub>H<sub>2n+1</sub>NH<sub>2</sub>", "Amino skupina <b>–NH₂</b>. Končnica <b>-amin</b>. Amini so šibke baze."],
  aminokislina: ["aminokisline", 2, false, "H₂N–CHR–COOH", "Imajo amino in karboksilno skupino. So gradniki beljakovin."],
  amid: ["amidi", 1, false, "RCONH₂", "Karbonilni C je vezan na –NH₂. Končnica <b>-amid</b>. Peptidna vez v beljakovinah je amidna."],
};
const TRIVIAL = { "metanojska kislina": "mravljična kislina", "etanojska kislina": "ocetna kislina", "butanojska kislina": "maslena kislina", propanon: "aceton", etanal: "acetaldehid", metanal: "formaldehid", eten: "etilen", etin: "acetilen" };

function nameOf(g, n, p, m) {
  const r = ROOT[n - 1];
  switch (g) {
    case "alkan": return r + "an";
    case "alken": return n <= 3 ? r + "en" : `${r}-${p}-en`;
    case "alkin": return n <= 3 ? r + "in" : `${r}-${p}-in`;
    case "alkohol": return n <= 2 ? r + "anol" : `${r}an-${p}-ol`;
    case "halogenoalkan": return n <= 2 ? `kloro${r}an` : `${p}-kloro${r}an`;
    case "aldehid": return r + "anal";
    case "keton": return n <= 4 ? r + "anon" : `${r}an-${p}-on`;
    case "kislina": return r + "anojska kislina";
    case "ester": return `${ALKIL[m - 1]} ${r}anoat`;
    case "amin": return n <= 2 ? r + "anamin" : `${r}an-${p}-amin`;
    case "aminokislina": return n === 2 ? "glicin (2-aminoetanojska kislina)" : n === 3 ? "alanin (2-aminopropanojska kislina)" : `2-amino${r}anojska kislina`;
    case "amid": return r + "anamid";
  }
}

// Zgradi strukturno formulo: verige C v vrsti, substituenti gor/dol/levo/desno.
function build(g, n, p, m, allH) {
  const nodes = [], bonds = [];
  const C = [];
  for (let i = 0; i < n; i++) C.push(nodes.push({ x: i, y: 0, t: "C" }) - 1);
  const order = Array(Math.max(0, n - 1)).fill(1);
  if (g === "alken") order[p - 1] = 2;
  if (g === "alkin") order[p - 1] = 3;
  for (let i = 0; i < n - 1; i++) bonds.push([C[i], C[i + 1], order[i]]);
  const used = C.map(() => ({}));
  const val = C.map((_, i) => (i > 0 ? order[i - 1] : 0) + (i < n - 1 ? order[i] : 0));
  const subst = (i, slot, t, o = 1, cls = "fg") => {
    const [dx, dy] = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[slot];
    const k = nodes.push({ x: i + dx, y: dy, t, cls }) - 1;
    bonds.push([C[i], k, o]);
    used[i][slot] = true;
    val[i] += o;
    return k;
  };
  const fg = [];
  if (g === "alkohol") fg.push(subst(p - 1, "up", "OH"));
  if (g === "halogenoalkan") fg.push(subst(p - 1, "up", "Cl"));
  if (g === "amin") fg.push(subst(p - 1, "up", "NH₂"));
  if (g === "keton") fg.push(subst(p - 1, "up", "O", 2));
  if (["aldehid", "kislina", "amid", "ester", "aminokislina"].includes(g)) {
    fg.push(subst(0, "up", "O", 2));
    if (g === "kislina" || g === "aminokislina") fg.push(subst(0, "left", "OH"));
    if (g === "amid") fg.push(subst(0, "left", "NH₂"));
    if (g === "ester") {
      const o = subst(0, "left", "O");
      fg.push(o);
      let prev = o;
      for (let j = 0; j < m; j++) {
        const k = nodes.push({ x: -2 - j, y: 0, t: j === m - 1 ? "CH₃" : "CH₂", cls: "fg2" }) - 1;
        bonds.push([prev, k, 1]);
        prev = k;
      }
    }
    if (g === "aminokislina" && n >= 2) fg.push(subst(1, "up", "NH₂"));
  }
  // vodiki
  C.forEach((ci, i) => {
    let h = 4 - val[i];
    const slots = n === 1 ? ["left", "right", "up", "down"] : i === 0 ? ["up", "down", "left"] : i === n - 1 ? ["up", "down", "right"] : ["up", "down"];
    if (!allH) {
      nodes[ci].t = h <= 0 ? "C" : h === 1 ? "CH" : `CH${"₂₃₄"[h - 2]}`;
      return;
    }
    for (const sl of slots) {
      if (h <= 0) break;
      if (used[i][sl]) continue;
      const [dx, dy] = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[sl];
      const k = nodes.push({ x: i + dx * (dx ? 0.8 : 1), y: dy * 0.8, t: "H", cls: "h" }) - 1;
      bonds.push([ci, k, 1]);
      used[i][sl] = true;
      h--;
    }
  });
  if (!allH) {
    // v skrajšani obliki pišemo vodike skupaj s C, zato krajša veriga nima navpičnih H
  }
  return { nodes, bonds, fg };
}

function formulaOf(g, n, m) {
  let c = n, hh = 2 * n + 2, o = 0, nn = 0, cl = 0;
  if (g === "alken") hh -= 2;
  if (g === "alkin") hh -= 4;
  if (g === "alkohol") o = 1;
  if (g === "halogenoalkan") (hh -= 1), (cl = 1);
  if (g === "aldehid" || g === "keton") (hh -= 2), (o = 1);
  if (g === "kislina") (hh -= 2), (o = 2);
  if (g === "ester") (c += m), (hh = 2 * n + 2 * m), (o = 2);
  if (g === "amin") (hh += 1), (nn = 1);
  if (g === "aminokislina") (hh = 2 * n + 1), (o = 2), (nn = 1);
  if (g === "amid") (hh = 2 * n + 1), (o = 1), (nn = 1);
  const part = (e, k) => (k ? e + (k > 1 ? sub(String(k)) : "") : "");
  return part("C", c) + part("H", hh) + part("Cl", cl) + part("N", nn) + part("O", o);
}

const IZOMERI = {
  C4H10: ["verižna izomerija", [
    ["butan", -1, [[0, 0, "CH₃"], [1, 0, "CH₂"], [2, 0, "CH₂"], [3, 0, "CH₃"]], [[0, 1], [1, 2], [2, 3]]],
    ["2-metilpropan", -12, [[0, 0, "CH₃"], [1, 0, "CH"], [2, 0, "CH₃"], [1, -1, "CH₃"]], [[0, 1], [1, 2], [1, 3]]],
  ]],
  C5H12: ["verižna izomerija", [
    ["pentan", 36, [[0, 0, "CH₃"], [1, 0, "CH₂"], [2, 0, "CH₂"], [3, 0, "CH₂"], [4, 0, "CH₃"]], [[0, 1], [1, 2], [2, 3], [3, 4]]],
    ["2-metilbutan", 28, [[0, 0, "CH₃"], [1, 0, "CH"], [2, 0, "CH₂"], [3, 0, "CH₃"], [1, -1, "CH₃"]], [[0, 1], [1, 2], [2, 3], [1, 4]]],
    ["2,2-dimetilpropan", 10, [[0, 0, "CH₃"], [1, 0, "C"], [2, 0, "CH₃"], [1, -1, "CH₃"], [1, 1, "CH₃"]], [[0, 1], [1, 2], [1, 3], [1, 4]]],
  ]],
  C4H8: ["položajna in geometrijska (cis/trans) izomerija", [
    ["but-1-en", -6, [[0, 0, "CH₂"], [1, 0, "CH"], [2, 0, "CH₂"], [3, 0, "CH₃"]], [[0, 1, 2], [1, 2], [2, 3]]],
    ["cis-but-2-en", 4, [[0.5, 0, "C"], [1.5, 0, "C"], [-0.2, -0.8, "CH₃"], [2.2, -0.8, "CH₃"], [-0.2, 0.8, "H"], [2.2, 0.8, "H"]], [[0, 1, 2], [0, 2], [1, 3], [0, 4], [1, 5]]],
    ["trans-but-2-en", 1, [[0.5, 0, "C"], [1.5, 0, "C"], [-0.2, -0.8, "CH₃"], [2.2, 0.8, "CH₃"], [-0.2, 0.8, "H"], [2.2, -0.8, "H"]], [[0, 1, 2], [0, 2], [1, 3], [0, 4], [1, 5]]],
    ["2-metilpropen", -7, [[0, 0, "CH₂"], [1, 0, "C"], [2, 0, "CH₃"], [1, -1, "CH₃"]], [[0, 1, 2], [1, 2], [1, 3]]],
  ]],
  C2H6O: ["funkcionalna izomerija", [
    ["etanol", 78, [[0, 0, "CH₃"], [1, 0, "CH₂"], [2, 0, "OH"]], [[0, 1], [1, 2]]],
    ["dimetil eter", -24, [[0, 0, "CH₃"], [1, 0, "O"], [2, 0, "CH₃"]], [[0, 1], [1, 2]]],
  ]],
  C3H6O: ["funkcionalna izomerija", [
    ["propanal", 49, [[0, 0, "CH₃"], [1, 0, "CH₂"], [2, 0, "CH"], [2.6, -0.8, "O"]], [[0, 1], [1, 2], [2, 3, 2]]],
    ["propanon (aceton)", 56, [[0, 0, "CH₃"], [1, 0, "C"], [2, 0, "CH₃"], [1, -1, "O"]], [[0, 1], [1, 2], [1, 3, 2]]],
  ]],
  C3H8O: ["položajna in funkcionalna izomerija", [
    ["propan-1-ol", 97, [[0, 0, "CH₃"], [1, 0, "CH₂"], [2, 0, "CH₂"], [3, 0, "OH"]], [[0, 1], [1, 2], [2, 3]]],
    ["propan-2-ol", 82, [[0, 0, "CH₃"], [1, 0, "CH"], [2, 0, "CH₃"], [1, -1, "OH"]], [[0, 1], [1, 2], [1, 3]]],
    ["etil metil eter", 7, [[0, 0, "CH₃"], [1, 0, "O"], [2, 0, "CH₂"], [3, 0, "CH₃"]], [[0, 1], [1, 2], [2, 3]]],
  ]],
};

export function organska(el, { groups = ["alkan", "alken", "alkin", "alkohol", "kislina"], mode } = {}) {
  if (mode === "izomeri") return izomeri(el);
  const out = readout();
  const svg = svgBox(340, 200);
  let g = groups[0], n = Math.max(SKUPINE[g][1], g === "alkan" ? 3 : 2), p = 1, m = 1, allH = true;
  const pMax = () => (g === "keton" ? Math.ceil(n / 2) : g === "alken" || g === "alkin" ? Math.floor(n / 2) : Math.ceil(n / 2));
  const pMin = () => (g === "keton" ? 2 : 1);
  const draw = () => {
    p = clamp(p, pMin(), Math.max(pMin(), pMax()));
    const { nodes, bonds, fg } = build(g, n, p, m, allH && n <= 6);
    const xs = nodes.map((q) => q.x), ys = nodes.map((q) => q.y);
    const x0 = Math.min(...xs), x1 = Math.max(...xs);
    const sc = 46, W = Math.max(340, (x1 - x0 + 1.6) * sc), H = 200;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.replaceChildren();
    drawMolecule(svg, nodes, bonds, { ox: W / 2 - ((x0 + x1) / 2) * sc, oy: 105 - ((Math.min(...ys) + Math.max(...ys)) / 2) * sc * 0.4, sc, hl: fg });
  };
  const info = () => {
    const nm = nameOf(g, n, p, m);
    const [ime, , , gen, txt] = SKUPINE[g];
    out.innerHTML = `<p style="font-size:1.15em"><b>${nm}</b>${TRIVIAL[nm] ? ` (${TRIVIAL[nm]})` : ""} — ${formulaOf(g, n, m)}</p>
      <p>${CAP(ime)}: ${txt} Splošna formula: ${gen}.</p>
      <p class="muted">Ime dobi spojina po najdaljši verigi C (${ROOT.slice(0, 4).join("-, ")}-…). Številke damo tako, da ima funkcionalna skupina ali večkratna vez čim manjšo številko.</p>`;
  };
  const upd = () => (draw(), info(), syncP());
  const slN = slider({ label: "število atomov C", min: 1, max: 10, value: n, onInput: (v) => ((n = Math.max(v, SKUPINE[g][1])), v < SKUPINE[g][1] && slN.set(n, true), upd()) });
  const slP = slider({ label: "položaj", min: 1, max: 5, value: p, onInput: (v) => ((p = v), upd()) });
  const slM = slider({ label: "atomov C v alkilu", min: 1, max: 4, value: m, onInput: (v) => ((m = v), upd()) });
  const syncP = () => {
    slP.hidden = !SKUPINE[g][2] || pMax() <= pMin();
    slP.input.min = pMin();
    slP.input.max = Math.max(pMin(), pMax());
    slP.sync?.();
    slP.set(p, true);
    slM.hidden = g !== "ester";
  };
  const kids = [];
  if (groups.length > 1) kids.push(select({ label: "skupina", options: groups.map((x) => [x, SKUPINE[x][0]]), value: g, onChange: (v) => ((g = v), (n = Math.max(n, SKUPINE[g][1])), slN.set(n, true), (p = pMin()), upd()) }));
  kids.push(slN, slP, slM, segmented({ options: [["vsi", "vsi atomi"], ["skrajsano", "skrajšano"]], value: "vsi", onChange: (v) => ((allH = v === "vsi"), draw()) }));
  if (n < SKUPINE[g][1]) n = SKUPINE[g][1];
  slN.set(n, true);
  upd();
  layout(el, {
    stage: svg,
    controls: kids,
    out,
    tryText: groups.includes("alken") ? "Nariši but-1-en in but-2-en. V čem se razlikujeta? Koliko atomov H ima alkin s 4 atomi C?" : groups.includes("ester") ? "Sestavi etil etanoat. Iz katere kisline in katerega alkohola nastane?" : "Povečuj število atomov C. Za koliko se vsakič spremeni formula (homologna vrsta)?",
  });
}

function izomeri(el) {
  const out = readout();
  const svg = svgBox(340, 260);
  let f = "C4H10";
  const draw = () => {
    svg.replaceChildren();
    const [, list] = IZOMERI[f];
    const cols = 2, cw = 170, rows = Math.ceil(list.length / cols), ch = 125;
    svg.setAttribute("viewBox", `0 0 340 ${rows * ch + 10}`);
    list.forEach(([nm, bp, nodes, bonds], i) => {
      const cx = (i % cols) * cw + cw / 2, cy = Math.floor(i / cols) * ch + 55;
      s("rect", { x: (i % cols) * cw + 4, y: Math.floor(i / cols) * ch + 4, width: cw - 8, height: ch - 8, rx: 10, class: "box" }, svg);
      const xs = nodes.map((q) => q[0]), ys = nodes.map((q) => q[1]);
      const sc = Math.min(36, 130 / (Math.max(...xs) - Math.min(...xs) + 1));
      drawMolecule(svg, nodes.map(([x, y, t]) => ({ x, y, t })), bonds.map(([a, b, o = 1]) => [a, b, o]), { ox: cx - ((Math.min(...xs) + Math.max(...xs)) / 2) * sc, oy: cy - ((Math.min(...ys) + Math.max(...ys)) / 2) * sc, sc });
      label(svg, cx, Math.floor(i / cols) * ch + 98, nm, "lbl small");
      label(svg, cx, Math.floor(i / cols) * ch + 112, `vrelišče ${bp} °C`, "tick small");
    });
  };
  const info = () => {
    const [kind, list] = IZOMERI[f];
    out.innerHTML = `<p><b>${sub(f)}</b> ima ${list.length} izomer${list.length === 2 ? "a" : list.length < 5 ? "e" : "ov"} (${kind}). Izomeri imajo <b>enako molekulsko formulo</b>, a različno zgradbo, zato imajo različne lastnosti.</p>
      <p class="muted">${f === "C4H10" || f === "C5H12" ? "Bolj razvejane molekule imajo manjšo površino, zato šibkejše disperzijske sile in nižje vrelišče." : f === "C4H8" ? "Pri cis-izomeru sta skupini CH₃ na isti strani dvojne vezi, pri trans na nasprotnih. Okoli dvojne vezi se molekula ne more vrteti." : "Alkoholi tvorijo vodikove vezi, zato imajo višje vrelišče od etrov z enako formulo."}</p>`;
  };
  draw();
  info();
  layout(el, {
    stage: svg,
    controls: [select({ label: "formula", options: Object.keys(IZOMERI).map((k) => [k, sub(k)]), value: f, onChange: (v) => ((f = v), draw(), info()) })],
    out,
    tryText: "Kateri izomer C₅H₁₂ ima najnižje vrelišče in zakaj? Poišči par cis/trans izomerov.",
  });
}

// ------------------------------------------------------------ destilacija: frakcionirna destilacija nafte
const FRAKCIJE = [
  ["rafinerijski plin", "C₁–C₄", "pod 40 °C", "utekočinjen naftni plin (jeklenke), surovina za plastiko", 40],
  ["bencin", "C₅–C₁₀", "40–175 °C", "gorivo za avtomobile", 175],
  ["petrolej (kerozin)", "C₁₀–C₁₆", "175–250 °C", "gorivo za letala", 250],
  ["dizelsko gorivo", "C₁₄–C₂₀", "250–350 °C", "gorivo za tovornjake, kurilno olje", 350],
  ["mazalna olja in vosek", "C₂₀–C₃₅", "350–400 °C", "maziva, parafin, sveče", 400],
  ["bitumen (ostanek)", "nad C₃₅", "nad 400 °C", "asfalt za ceste, strešna kritina", 9999],
];
const BP = [[1, -162], [2, -89], [3, -42], [4, -1], [5, 36], [6, 69], [7, 98], [8, 126], [10, 174], [12, 216], [14, 254], [16, 287], [18, 316], [20, 343], [25, 402], [30, 450], [40, 520]];
const bpOf = (n) => {
  for (let i = 1; i < BP.length; i++) if (n <= BP[i][0]) return BP[i - 1][1] + ((BP[i][1] - BP[i - 1][1]) * (n - BP[i - 1][0])) / (BP[i][0] - BP[i - 1][0]);
  return 520;
};
export function destilacija(el) {
  const out = readout();
  const svg = svgBox(340, 300);
  let Tf = 400, mols = [], sel = 1, acc = 0, got = Array(6).fill(0);
  const trayY = [52, 92, 132, 172, 212]; // od zgoraj: plin (vrh), bencin, petrolej, dizel, olja
  const colX = 110, colW = 70, bottom = 250;
  const tAt = (y) => 30 + ((y - 40) / (bottom - 40)) * (Tf - 30); // temperatura v koloni
  const fracOf = (bp) => FRAKCIJE.findIndex((f) => bp < f[4]);
  const spawn = () => {
    const n = Math.round(clamp(Math.exp(rnd(0, Math.log(45))), 1, 45));
    mols.push({ n, bp: bpOf(n), x: colX + rnd(10, colW - 10), y: bottom - 6, st: "up" });
  };
  const draw = () => {
    svg.replaceChildren();
    // kolona s temperaturnim gradientom
    const id = svg.uid + "g";
    const lg = s("linearGradient", { id, x1: 0, y1: 0, x2: 0, y2: 1 }, s("defs", {}, svg));
    s("stop", { offset: 0, "stop-color": "#93c5fd", "stop-opacity": 0.35 }, lg);
    s("stop", { offset: 1, "stop-color": "#f97316", "stop-opacity": 0.45 }, lg);
    s("rect", { x: colX, y: 30, width: colW, height: bottom - 30, rx: 8, style: `fill:url(#${id})`, stroke: "currentColor", "stroke-width": 1.5, class: "stroke-text" }, svg);
    trayY.forEach((y, i) => {
      s("line", { x1: colX, y1: y + 12, x2: colX + colW, y2: y + 12, class: "thin-line" }, svg);
      s("path", { d: `M${colX + colW} ${y + 6} H${colX + colW + 22}`, class: "wire" }, svg);
      const g = s("g", { class: "pt-cell" + (sel === i ? " sel" : ""), role: "button" }, svg);
      s("rect", { x: colX + colW + 24, y: y - 4, width: 128, height: 20, rx: 5, class: sel === i ? "pt-bg k-sel" : "pt-bg" }, g);
      s("text", { x: colX + colW + 30, y: y + 10, class: "pt-legend" }, g, `${FRAKCIJE[i][0]} (${got[i]})`);
      g.addEventListener("click", () => ((sel = i), draw(), info()));
      label(svg, colX - 6, y + 12, `${Math.round(tAt(y + 12))} °C`, "tick small", "end");
    });
    const g = s("g", { class: "pt-cell" + (sel === 5 ? " sel" : ""), role: "button" }, svg);
    s("rect", { x: colX + colW + 24, y: bottom - 14, width: 128, height: 20, rx: 5, class: sel === 5 ? "pt-bg k-sel" : "pt-bg" }, g);
    s("text", { x: colX + colW + 30, y: bottom, class: "pt-legend" }, g, `${FRAKCIJE[5][0]} (${got[5]})`);
    g.addEventListener("click", () => ((sel = 5), draw(), info()));
    // peč
    s("rect", { x: colX - 10, y: bottom + 6, width: colW + 20, height: 26, rx: 6, class: "fill-danger", opacity: 0.25 + 0.5 * clamp((Tf - 300) / 150, 0, 1) }, svg);
    label(svg, colX + colW / 2, bottom + 19, `peč ${Tf} °C`, "tick small b");
    label(svg, 40, bottom + 19, "surova nafta →", "tick small");
    mols.forEach((m) => {
      const r = 2 + Math.min(5, m.n / 8);
      s("circle", { cx: m.x, cy: m.y, r, class: m.st === "res" ? "fill-muted" : m.n <= 4 ? "fill-b" : m.n <= 10 ? "fill-a" : m.n <= 20 ? "fill-c" : "fill-danger", opacity: 0.85 }, svg);
    });
  };
  const step = (dt) => {
    acc += dt;
    if (acc > 0.12) (acc = 0), mols.length < 70 && spawn();
    mols.forEach((m) => {
      if (m.st === "up") {
        if (m.bp > Tf) {
          m.st = "res";
          got[5]++;
          return;
        }
        m.y -= dt * 45;
        m.x = clamp(m.x + rnd(-1, 1), colX + 6, colX + colW - 6);
        // kondenzira na prvem pladnju nad sabo, kjer je temperatura nižja od vrelišča
        const idx = trayY.findIndex((y, i) => Math.abs(m.y - (y + 12)) < 2 && tAt(y + 12) < m.bp && i > 0);
        if (idx > 0) (m.st = "out"), (m.tray = idx), got[idx]++;
        if (m.y < 40) (m.st = "out"), (m.tray = 0), got[0]++;
      } else if (m.st === "out") {
        m.x += dt * 80;
        m.y += ((trayY[m.tray] + 6 - m.y) * dt * 6);
        if (m.x > colX + colW + 20) m.dead = true;
      } else if (m.st === "res") {
        m.y = Math.min(bottom - 4, m.y + dt * 10);
        m.life = (m.life || 0) + dt;
        if (m.life > 3) m.dead = true;
      }
    });
    mols = mols.filter((m) => !m.dead);
  };
  const info = () => {
    const [ime, c, t, use] = FRAKCIJE[sel];
    out.innerHTML = `<p><b>${CAP(ime)}</b>: ${c}, vrelišče ${t}. Uporaba: ${use}.</p>
      <p>Nafta je zmes ogljikovodikov z različno dolgimi verigami. V koloni je spodaj vroče, zgoraj hladneje. Pare se dvigajo in vsaka snov <b>kondenzira</b> na višini, kjer je temperatura nižja od njenega vrelišča. Daljše molekule imajo višje vrelišče.</p>
      <p class="muted">V oklepaju je število ujetih molekul posamezne frakcije. Klikni frakcijo za opis.</p>`;
  };
  const anim = animate(el, (dt) => {
    step(dt);
    draw();
  });
  draw();
  info();
  layout(el, {
    stage: svg,
    controls: [
      slider({ label: "temperatura peči", min: 200, max: 450, step: 10, value: Tf, unit: "°C", onInput: (v) => (Tf = v) }),
      buttons(playButton(anim), button("Znova", () => ((mols = []), (got = Array(6).fill(0)), draw()))),
    ],
    out,
    tryText: "Znižaj temperaturo peči na 250 °C. Katere frakcije ne dobiš več? Kje se ujame molekula s 8 atomi C?",
  });
}

// ------------------------------------------------------------ polimer: nastanek polimerov
const POLI = {
  polieten: ["polieten (PE)", "adicijska", "n\\,\\mathrm{CH_2{=}CH_2} \\to \\mathrm{(\\!-CH_2{-}CH_2-\\!)_n}", "Dvojna vez se odpre in monomeri se povežejo v dolgo verigo. Iz polietena so vrečke in folije."],
  pvc: ["polivinil klorid (PVC)", "adicijska", "n\\,\\mathrm{CH_2{=}CHCl} \\to \\mathrm{(\\!-CH_2{-}CHCl-\\!)_n}", "Iz PVC so cevi, okenski okvirji in talne obloge."],
  skrob: ["škrob", "kondenzacijska", "n\\,\\mathrm{C_6H_{12}O_6} \\to \\mathrm{(C_6H_{10}O_5)_n} + n\\,\\mathrm{H_2O}", "Molekule α-glukoze se povežejo z glikozidnimi vezmi, pri vsaki povezavi se odcepi molekula vode. Škrob je zaloga energije v rastlinah."],
  celuloza: ["celuloza", "kondenzacijska", "n\\,\\mathrm{C_6H_{12}O_6} \\to \\mathrm{(C_6H_{10}O_5)_n} + n\\,\\mathrm{H_2O}", "Gradnik je β-glukoza: vsaka druga enota je obrnjena, zato nastanejo ravna vlakna. Celuloza gradi celične stene rastlin."],
  beljakovina: ["beljakovina (peptid)", "kondenzacijska", "\\text{aminokisline} \\to \\text{peptid} + (n-1)\\,\\mathrm{H_2O}", "Aminokisline se povežejo s peptidnimi vezmi –CO–NH–. Zaporedje aminokislin določa obliko in vlogo beljakovine."],
  mascoba: ["maščoba (triglicerid)", "kondenzacijska (estrenje)", "\\text{glicerol} + 3\\,\\text{maščobne kisline} \\to \\text{maščoba} + 3\\,\\mathrm{H_2O}", "Tri skupine –OH glicerola tvorijo estrske vezi s tremi maščobnimi kislinami."],
  poliester: ["poliester (PET)", "kondenzacijska", "\\text{diol} + \\text{dikarboksilna kislina} \\to \\text{poliester} + \\mathrm{H_2O}", "Pri vsaki estrski vezi se odcepi molekula vode. Iz PET so plastenke in vlakna za oblačila."],
};
const AK = [["Gly", "#2f9e8f"], ["Ala", "#e8833a"], ["Ser", "#7b61d1"], ["Cys", "#e2b93b"], ["Lys", "#3b6fe0"], ["Phe", "#e5484d"], ["Val", "#14b8a6"], ["Glu", "#a855f7"]];

export function polimer(el, { sets = ["polieten", "pvc", "skrob", "beljakovina"] } = {}) {
  const out = readout();
  const svg = svgBox(340, 220);
  let k = sets[0], n = 5, t = 0;
  const draw = () => {
    svg.replaceChildren();
    const cond = POLI[k][1] !== "adicijska";
    const ease = t * t * (3 - 2 * t);
    if (k === "mascoba") {
      const gx = 70;
      ["OH", "OH", "OH"].forEach((_, i) => {
        const y = 60 + i * 50;
        s("rect", { x: gx - 22, y: y - 14, width: 44, height: 28, rx: 6, class: "ion-tile cat" }, svg);
        label(svg, gx, y, i === 1 ? "CH" : "CH₂", "lbl small");
        const fx = 230 - ease * 52;
        label(svg, gx + 40, y, ease > 0.6 ? "–O–" : "–OH", "lbl small", "start");
        label(svg, fx - 6, y, ease > 0.6 ? "CO" : "HOOC", "lbl small", "end");
        let d = `M${fx} ${y}`;
        for (let j = 1; j <= 8; j++) d += ` L${fx + j * 12} ${y + (j % 2 ? -7 : 0)}`;
        s("path", { d, class: "graph-line stroke-a" }, svg);
        if (ease > 0.3) atomWater(svg, 150 + ease * 20, y - 25 - ease * 10, ease);
      });
      label(svg, gx, 205, "glicerol", "tick small b");
      label(svg, 250, 205, "maščobne kisline", "tick small b");
      return;
    }
    const W = 300 / n, y = 110;
    for (let i = 0; i < n; i++) {
      const gap = (1 - ease) * 10;
      const cx = 20 + W * i + W / 2 + (i - (n - 1) / 2) * gap;
      if (k === "skrob" || k === "celuloza") {
        const flip = k === "celuloza" && i % 2 ? -1 : 1, r = Math.min(20, W / 2 - 6);
        const pts = Array.from({ length: 6 }, (_, j) => [cx + r * Math.cos((j * Math.PI) / 3), y + flip * r * Math.sin((j * Math.PI) / 3) * 0.7]);
        s("path", { d: "M" + pts.map((p) => p.join(" ")).join(" L") + " Z", class: "ion-tile cat" }, svg);
        label(svg, pts[1][0], pts[1][1] + flip * 2, "O", "tick small b");
        if (i < n - 1 && ease > 0.2) label(svg, cx + W / 2, y + 2, "–O–", "tick small b");
      } else if (k === "beljakovina") {
        const [nm, col] = AK[i % AK.length];
        s("circle", { cx, cy: y, r: Math.min(16, W / 2 - 4), style: `fill:${col}`, opacity: 0.85 }, svg);
        label(svg, cx, y, nm, "tick small b inv");
        if (i < n - 1 && ease > 0.2) label(svg, cx + W / 2, y - 22, "CO–NH", "tick small");
      } else if (k === "poliester") {
        const diol = i % 2 === 0;
        s("rect", { x: cx - W / 2 + 4, y: y - 14, width: W - 8, height: 28, rx: 6, class: diol ? "ion-tile cat" : "ion-tile an" }, svg);
        label(svg, cx, y, diol ? "diol" : "kislina", "tick small b");
      } else {
        // polieten, pvc
        const cl = k === "pvc";
        label(svg, cx - W / 4, y, "CH₂", "lbl small");
        label(svg, cx + W / 4, y, cl ? "CH" : "CH₂", "lbl small");
        const d = 1 - ease;
        if (d > 0.05) {
          s("line", { x1: cx - W / 4 + 12, y1: y - 3, x2: cx + W / 4 - 12, y2: y - 3, class: "bond", opacity: d }, svg);
          s("line", { x1: cx - W / 4 + 12, y1: y + 3, x2: cx + W / 4 - 12, y2: y + 3, class: "bond", opacity: d }, svg);
        }
        s("line", { x1: cx - W / 4 + 12, y1: y, x2: cx + W / 4 - 12, y2: y, class: "bond", opacity: ease }, svg);
        if (cl) {
          s("line", { x1: cx + W / 4, y1: y + 8, x2: cx + W / 4, y2: y + 24, class: "bond" }, svg);
          label(svg, cx + W / 4, y + 32, "Cl", "lbl small");
        }
        if (i < n - 1) s("line", { x1: cx + W / 4 + 12, y1: y, x2: cx + W - W / 4 - 12 + gap, y2: y, class: "bond", opacity: ease }, svg);
      }
      if (cond && i < n - 1 && ease > 0.3) atomWater(svg, cx + W / 2, y - 40 - ease * 30, ease);
    }
    if (ease > 0.95) {
      label(svg, 12, y, "…", "lbl big");
      label(svg, 328, y, "…", "lbl big");
    }
    label(svg, 170, 200, ease > 0.95 ? `polimer iz ${n} monomerov${cond ? `, odcepilo se je ${k === "poliester" || k === "beljakovina" || k === "skrob" || k === "celuloza" ? n - 1 : n} molekul vode` : ""}` : `${n} monomerov`, "tick small b");
  };
  const info = () => {
    const [ime, typ, eq, txt] = POLI[k];
    out.innerHTML = texBlock(eq) + `<p><b>${CAP(ime)}</b> nastane z <b>${typ}</b> polimerizacijo. ${txt}</p>
      <p class="muted">${typ === "adicijska" ? "Pri adicijski polimerizaciji se monomeri le seštejejo, stranskih produktov ni." : "Pri kondenzacijski polimerizaciji se ob vsaki novi vezi odcepi majhna molekula, največkrat voda."}</p>`;
  };
  const anim = animate(el, (dt) => {
    t = Math.min(1, t + dt * 0.7);
    draw();
    if (t >= 1) return false;
  }, { autoplay: false });
  const reset = () => ((t = 0), anim.pause(), draw(), info());
  const slN = slider({ label: "število monomerov", min: 2, max: 8, value: n, onInput: (v) => ((n = v), reset()) });
  const kids = [];
  if (sets.length > 1) kids.push(select({ label: "polimer", options: sets.map((x) => [x, POLI[x][0]]), value: k, onChange: (v) => ((k = v), (slN.hidden = v === "mascoba"), reset()) }));
  slN.hidden = k === "mascoba";
  kids.push(slN, buttons(button("Poveži", () => ((t = 0), anim.play()), "primary small"), button("Znova", reset)));
  reset();
  layout(el, { stage: svg, controls: kids, out, tryText: "Primerjaj nastanek polietena in škroba. Pri katerem nastaja voda? Kako se razlikujeta škrob in celuloza?" });
}
function atomWater(svg, x, y, op) {
  const g = s("g", { opacity: clamp(op, 0, 1) }, svg);
  s("circle", { cx: x, cy: y, r: 6, style: "fill:#e5484d" }, g);
  s("circle", { cx: x - 6, cy: y + 5, r: 3.5, style: "fill:#e7ecf3;stroke:#94a3b8;stroke-width:0.6" }, g);
  s("circle", { cx: x + 6, cy: y + 5, r: 3.5, style: "fill:#e7ecf3;stroke:#94a3b8;stroke-width:0.6" }, g);
}

// ------------------------------------------------------------ organske-reakcije: vrste organskih reakcij
// Molekula: [nodes [x, y, t], bonds [a, b, red], označeni atomi]
const M = {
  eten: [[[0, 0, "CH₂"], [1, 0, "CH₂"]], [[0, 1, 2]], []],
  Br2: [[[0, 0, "Br"], [1, 0, "Br"]], [[0, 1]], [0, 1]],
  dibrom: [[[0, 0, "CH₂"], [1, 0, "CH₂"], [0, -1, "Br"], [1, -1, "Br"]], [[0, 1], [0, 2], [1, 3]], [2, 3]],
  metan: [[[0, 0, "CH₄"]], [], []],
  Cl2: [[[0, 0, "Cl"], [1, 0, "Cl"]], [[0, 1]], [0]],
  klorometan: [[[0, 0, "CH₃"], [1, 0, "Cl"]], [[0, 1]], [1]],
  HCl: [[[0, 0, "H"], [1, 0, "Cl"]], [[0, 1]], [0]],
  etanol: [[[0, 0, "CH₃"], [1, 0, "CH₂"], [2, 0, "OH"]], [[0, 1], [1, 2]], [2]],
  voda: [[[0, 0, "H₂O"]], [], [0]],
  etanal: [[[0, 0, "CH₃"], [1, 0, "CH"], [1.6, -0.8, "O"]], [[0, 1], [1, 2, 2]], [2]],
  ocetna: [[[0, 0, "CH₃"], [1, 0, "C"], [1, -1, "O"], [2, 0, "OH"]], [[0, 1], [1, 2, 2], [1, 3]], [3]],
  ester: [[[0, 0, "CH₃"], [1, 0, "C"], [1, -1, "O"], [2, 0, "O"], [3, 0, "CH₂"], [4, 0, "CH₃"]], [[0, 1], [1, 2, 2], [1, 3], [3, 4], [4, 5]], [3]],
  O2: [[[0, 0, "O"], [1, 0, "O"]], [[0, 1, 2]], []],
  CO2: [[[0, 0, "O"], [1, 0, "C"], [2, 0, "O"]], [[0, 1, 2], [1, 2, 2]], []],
};
const ORX = [
  ["adicija", "Adicija broma na alken", [["eten"], ["Br2"]], [["dibrom"]], "sobna temperatura", "Dvojna vez se odpre, na vsak atom C se veže en atom broma. Rjava bromovica se razbarva: to je dokaz za dvojno ali trojno vez.", "1,2-dibromoetan"],
  ["adicija", "Adicija vode (hidratacija)", [["eten"], ["voda"]], [["etanol"]], "H₃PO₄, 300 °C, tlak", "Iz etena in vode nastane etanol. Tako industrijsko pridobivajo etanol.", "etanol"],
  ["substitucija", "Substitucija s klorom", [["metan"], ["Cl2"]], [["klorometan"], ["HCl"]], "svetloba (UV)", "Atom klora zamenja atom vodika. Pri alkanih poteka le ob svetlobi (radikalska substitucija). Nastajajo lahko tudi CH₂Cl₂, CHCl₃ in CCl₄.", "klorometan"],
  ["eliminacija", "Eliminacija vode (dehidracija)", [["etanol"]], [["eten"], ["voda"]], "konc. H₂SO₄, 170 °C", "Iz molekule se odcepi voda in nastane dvojna vez. Eliminacija je obratna reakcija adicije.", "eten"],
  ["oksidacija", "Oksidacija etanola do etanala", [["etanol"]], [["etanal"], ["voda"]], "K₂Cr₂O₇ / H⁺ (blaga oksidacija)", "Primarni alkohol se oksidira v aldehid. Oranžni dikromat se reducira v zelene ione Cr³⁺ (alkotest).", "etanal"],
  ["oksidacija", "Oksidacija etanala do ocetne kisline", [["etanal"]], [["ocetna"]], "K₂Cr₂O₇ / H⁺", "Aldehid se oksidira naprej v karboksilno kislino. Tako vino na zraku postane kis.", "etanojska (ocetna) kislina"],
  ["kondenzacija", "Estrenje", [["ocetna"], ["etanol"]], [["ester"], ["voda"]], "konc. H₂SO₄, segrevanje", "Karboksilna kislina in alkohol tvorita ester, odcepi se voda. Reakcija je ravnotežna; obratna reakcija je hidroliza estra.", "etil etanoat"],
  ["gorenje", "Popolno gorenje etanola", [["etanol"], ["O2"]], [["CO2"], ["voda"]], "vžig", "Organske snovi gorijo do ogljikovega dioksida in vode, pri tem se sprošča toplota.", "CO₂ in H₂O"],
];
const COEF = { "Popolno gorenje etanola": [[1, 3], [2, 3]] };

export function organskeReakcije(el) {
  const out = readout();
  const svg = svgBox(340, 230);
  let k = 0, t = 0;
  const row = (list, y, op, coef) => {
    const sc = 30;
    const widths = list.map(([key]) => {
      const xs = M[key][0].map((n) => n[0]);
      return (Math.max(...xs) - Math.min(...xs)) * sc + 40;
    });
    const total = widths.reduce((a, b) => a + b, 0) + (list.length - 1) * 26 + (coef ? 14 * list.length : 0);
    let x = 170 - total / 2;
    const g = s("g", { opacity: op }, svg);
    list.forEach(([key], i) => {
      if (i) label(g, x + 8, y, "+", "lbl big"), (x += 26);
      if (coef && coef[i] > 1) label(g, x + 4, y, String(coef[i]), "lbl big"), (x += 14);
      const [nodes, bonds, hl] = M[key];
      const xs = nodes.map((n) => n[0]), ys = nodes.map((n) => n[1]);
      drawMolecule(g, nodes.map(([a, b, tt]) => ({ x: a, y: b, t: tt })), bonds.map(([a, b, o = 1]) => [a, b, o]), { ox: x + 20 - Math.min(...xs) * sc, oy: y - ((Math.min(...ys) + Math.max(...ys)) / 2) * sc, sc, hl });
      x += widths[i];
    });
  };
  const draw = () => {
    svg.replaceChildren();
    const [typ, , re, pr, cond] = ORX[k];
    const coef = COEF[ORX[k][1]];
    label(svg, 170, 14, typ.toUpperCase(), "tick b");
    row(re, 55, 1, coef?.[0]);
    s("line", { x1: 170, y1: 88, x2: 170, y2: 140, class: "thin-line" }, svg);
    s("path", { d: "M164 134 L170 146 L176 134 Z", class: "fill-text" }, svg);
    label(svg, 180, 114, cond, "tick small", "start");
    row(pr, 185, clamp(t, 0.12, 1), coef?.[1]);
  };
  const info = () => {
    const [typ, name, , , , txt, prod] = ORX[k];
    out.innerHTML = `<p><b>${name}</b> (${typ}). ${t >= 1 ? `Nastane <b>${prod}</b>.` : "Pritisni <b>Izvedi reakcijo</b>."}</p><p>${txt}</p><p class="muted">Oranžno so označeni atomi in skupine, ki se pri reakciji spremenijo.</p>`;
  };
  const anim = animate(el, (dt) => {
    t = Math.min(1, t + dt * 0.8);
    draw();
    if (t >= 1) return info(), false;
  }, { autoplay: false });
  const reset = () => ((t = 0), anim.pause(), draw(), info());
  reset();
  layout(el, {
    stage: svg,
    controls: [
      select({ label: "reakcija", options: ORX.map((r, i) => [i, r[1]]), value: k, onChange: (v) => ((k = +v), reset()) }),
      buttons(button("Izvedi reakcijo", () => ((t = 0.12), anim.play()), "primary small"), button("Znova", reset)),
    ],
    out,
    tryText: { razmisli: "V čem se razlikujeta adicija in substitucija? Katera reakcija je obratna adiciji vode?" },
  });
}

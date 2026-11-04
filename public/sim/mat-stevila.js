// Simulacije: števila, deljivost, ulomki, decimalna števila, odstotki, potence.
import { h, s, svgBox, slider, select, segmented, toggle, button, buttons, controls, readout, stage, layout, tex, texBlock, fmt, tfmt, gcd, lcm, clamp, primeFactors, frac, arrow, label, animate, rint } from "./kit.js";

// Številska premica: vrne { X, g } in nariše oznake.
function numberLine(svg, { x0, x1, from, to, step, major = step, y = 60, labels = true, fmtL }) {
  const X = (v) => x0 + ((v - from) / (to - from)) * (x1 - x0);
  const g = s("g", {}, svg);
  s("line", { x1: x0 - 8, y1: y, x2: x1 + 10, y2: y, class: "axis" }, g);
  s("path", { d: `M${x1 + 14},${y} l-9,-5 v10 z`, class: "fill-text" }, g);
  const n = Math.round((to - from) / step);
  for (let i = 0; i <= n; i++) {
    const v = from + i * step;
    const isMajor = Math.abs(v / major - Math.round(v / major)) < 1e-6;
    s("line", { x1: X(v), y1: y - (isMajor ? 8 : 4), x2: X(v), y2: y + (isMajor ? 8 : 4), class: "axis" }, g);
    if (labels && isMajor) s("text", { x: X(v), y: y + 24, class: "tick", "text-anchor": "middle" }, g, fmtL ? fmtL(v) : fmt(v, 3));
  }
  return { X, g };
}

// ------------------------------------------------------------ mestne vrednosti
const PLACES = [
  ["M", "milijoni", 1e6], ["sT", "stotisočice", 1e5], ["dT", "desettisočice", 1e4], ["T", "tisočice", 1e3],
  ["S", "stotice", 100], ["D", "desetice", 10], ["E", "enice", 1],
];
const spaced = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
export function mestna(el) {
  const digits = [3, 4, 0, 5, 1, 2, 7];
  const out = readout();
  const table = h("div", { class: "pv-table" });
  const svg = svgBox(340, 90);
  let roundTo = 3;
  const value = () => digits.reduce((a, d, i) => a + d * PLACES[i][2], 0);
  const cols = PLACES.map(([k, name], i) => {
    const d = h("div", { class: "pv-digit" });
    const col = h("div", { class: "pv-col", title: name },
      h("div", { class: "pv-head" }, k),
      button("▲", () => ((digits[i] = (digits[i] + 1) % 10), draw()), "pv-btn"),
      d,
      button("▼", () => ((digits[i] = (digits[i] + 9) % 10), draw()), "pv-btn"),
    );
    col.d = d;
    table.append(col);
    return col;
  });
  const sel = select({
    label: "zaokroži na",
    options: PLACES.slice(0, 6).map(([, name], i) => [i, name.replace(/e$/, "")]).map(([i]) => [i, ["milijone", "stotisočice", "desettisočice", "tisočice", "stotice", "desetice"][i]]),
    value: roundTo,
    onChange: (v) => ((roundTo = Number(v)), draw()),
  });
  const draw = () => {
    const n = value();
    cols.forEach((c, i) => {
      c.d.textContent = digits[i];
      c.classList.toggle("on", i === roundTo);
    });
    const unit = PLACES[roundTo][2];
    const lo = Math.floor(n / unit) * unit, hi = lo + unit, rounded = Math.round(n / unit) * unit;
    svg.replaceChildren();
    const { X } = numberLine(svg, { x0: 30, x1: 300, from: lo, to: hi, step: unit / 10, major: unit / 2, y: 40, labels: false });
    s("text", { x: X(lo), y: 70, class: "tick", "text-anchor": "start" }, svg, spaced(lo));
    s("text", { x: X(hi), y: 70, class: "tick", "text-anchor": "end" }, svg, spaced(hi));
    s("line", { x1: X(lo + unit / 2), y1: 26, x2: X(lo + unit / 2), y2: 54, class: "guide" }, svg);
    s("circle", { cx: X(n), cy: 40, r: 7, class: "pt fill-a" }, svg);
    arrow(svg, X(n), 22, X(rounded) + (rounded > n ? -2 : 2), 22, "b", 2);
    const expanded = digits.map((d, i) => (d ? `${d}\\cdot ${spaced(PLACES[i][2]).replace(/ /g, "\\,")}` : null)).filter(Boolean).join(" + ") || "0";
    out.innerHTML = `<p class="pv-number">${spaced(n)}</p>
      ${texBlock(expanded)}
      <p>Zaokroženo na ${sel.sel.selectedOptions[0].textContent}: <b>${spaced(rounded)}</b>. Odločimo se po števki desno od te mestne vrednosti (${digits[roundTo + 1]}): ${digits[roundTo + 1] >= 5 ? "5 ali več, zato zaokrožimo <b>navzgor</b>" : "manj kot 5, zato zaokrožimo <b>navzdol</b>"}.</p>
      <p class="muted">Vsaka mestna vrednost je 10-krat večja od tiste desno od nje. Velika števila beremo v skupinah po tri števke.</p>`;
  };
  layout(el, { stage: [table], controls: [sel], extra: stage(svg), out, tryText: "Nastavi 4 999 999. Kaj se zgodi, ko pri enicah pritisneš ▲? Kako zaokrožiš 2 450 000 na milijone?" });
  draw();
}

// ------------------------------------------------------------ stotični kvadrat
const RULES = {
  2: "zadnja števka je soda (0, 2, 4, 6, 8)",
  3: "vsota števk je deljiva s 3",
  4: "število iz zadnjih dveh števk je deljivo s 4",
  5: "zadnja števka je 0 ali 5",
  6: "deljivo je z 2 in s 3",
  9: "vsota števk je deljiva z 9",
  10: "zadnja števka je 0",
};
export function stotica(el, { mode = "deljivost" } = {}) {
  const grid = h("div", { class: "hundred" });
  const out = readout();
  const cells = [];
  for (let i = 1; i <= 100; i++) {
    const c = h("button", { type: "button", class: "hcell", onclick: () => pick(i) }, String(i));
    cells.push(c);
    grid.append(c);
  }
  let d = 3, a = 4, b = 6, picked = null, sieve = null;
  const digitSum = (n) => String(n).split("").reduce((x, y) => x + Number(y), 0);
  const pick = (n) => ((picked = n), draw());
  const ctl = h("div", { class: "demo-controls" });
  const seg = segmented({
    options: [["deljivost", "Deljivost"], ["veckratniki", "Večkratniki"], ["sito", "Eratostenovo sito"]],
    value: mode,
    onChange: (v) => ((mode = v), build()),
  });
  const build = () => {
    ctl.replaceChildren();
    if (mode === "deljivost") ctl.append(slider({ label: "deljivo z", min: 2, max: 10, value: d, onInput: (v) => ((d = v), draw()) }));
    if (mode === "veckratniki")
      ctl.append(
        slider({ label: "a", min: 2, max: 12, value: a, onInput: (v) => ((a = v), draw()) }),
        slider({ label: "b", min: 2, max: 12, value: b, onInput: (v) => ((b = v), draw()) }),
      );
    if (mode === "sito") {
      sieve = { crossed: new Set([1]), primes: [], p: 1 };
      ctl.append(buttons(button("Naslednji korak", stepSieve, "primary small"), button("Do konca", () => { while (stepSieve()); }), button("Znova", () => build())));
    }
    draw();
  };
  const stepSieve = () => {
    let p = sieve.p + 1;
    while (p <= 100 && sieve.crossed.has(p)) p++;
    if (p > 100) return false;
    sieve.p = p;
    sieve.primes.push(p);
    for (let m = p * p; m <= 100; m += p) sieve.crossed.add(m);
    if (p * p > 100) for (let q = p + 1; q <= 100; q++) if (!sieve.crossed.has(q)) sieve.primes.push(q), sieve.crossed.add(-q);
    draw();
    return p * p <= 100;
  };
  const draw = () => {
    cells.forEach((c, i) => {
      const n = i + 1;
      let cls = "hcell";
      if (mode === "deljivost" && n % d === 0) cls += " on-a";
      if (mode === "veckratniki") {
        if (n % a === 0 && n % b === 0) cls += " on-c";
        else if (n % a === 0) cls += " on-a";
        else if (n % b === 0) cls += " on-b";
      }
      if (mode === "sito") {
        if (sieve.primes.includes(n)) cls += " on-b";
        else if (sieve.crossed.has(n)) cls += " off";
        if (n === sieve.p) cls += " ring";
      }
      if (n === picked) cls += " ring";
      c.className = cls;
    });
    let html = "";
    if (mode === "deljivost") {
      const count = Math.floor(100 / d);
      html = `<p>Obarvani so večkratniki števila <b>${d}</b> (${count} števil do 100).${RULES[d] ? ` Pravilo: število je deljivo z ${d}, če ${RULES[d]}.` : " Za 7 in 8 ni preprostega pravila: deli ali preveri z razcepom."}</p>`;
      if (picked) html += `<p>Število <b>${picked}</b>: vsota števk ${digitSum(picked)}, zadnja števka ${picked % 10}. ${picked} : ${d} = ${fmt(picked / d, 3)} → ${picked % d ? `<b>ni</b> deljivo (ostanek ${picked % d})` : "<b>je</b> deljivo"}.</p>`;
      else html += `<p class="muted">Klikni število, da preveriš pravilo.</p>`;
    }
    if (mode === "veckratniki") {
      const v = lcm(a, b);
      html = `<p><span class="dot dot-a"></span> večkratniki ${a}, <span class="dot dot-b"></span> večkratniki ${b}, <span class="dot dot-c"></span> skupni večkratniki.</p>
        <p>Najmanjši skupni večkratnik: v(${a}, ${b}) = <b>${v}</b>${v > 100 ? " (večji od 100)" : ""}. Vsi skupni večkratniki so večkratniki števila ${v}.</p>
        <p>Delitelji ${a}: ${divisors(a).join(", ")}. Delitelji ${b}: ${divisors(b).join(", ")}. Največji skupni delitelj D(${a}, ${b}) = <b>${gcd(a, b)}</b>.</p>`;
    }
    if (mode === "sito") {
      html = sieve.p > 1
        ? `<p>Praštevilo <b>${sieve.p}</b> obkrožimo, nato prečrtamo vse njegove večkratnike (začnemo pri ${sieve.p}² = ${sieve.p * sieve.p}, manjše so že prečrtani).</p><p>Praštevila do zdaj: ${sieve.primes.join(", ")}.</p>`
        : `<p>Število 1 ni praštevilo. Začni z 2: obkroži ga in prečrtaj vse njegove večkratnike.</p>`;
      if (sieve.p * sieve.p > 100) html += `<p class="fb ok">Ko je p² > 100, so vsa neprečrtana števila praštevila. Do 100 jih je ${sieve.primes.length}.</p>`;
    }
    out.innerHTML = html;
  };
  layout(el, { stage: [h("div", { class: "demo-seg-wrap" }, seg), grid], controls: ctl, out, tryText: "Pri deljivosti s 3 klikni 72, 75 in 77. Kdaj je vsota števk deljiva s 3? Pri večkratnikih poišči a in b, kjer je v(a, b) = a · b." });
  build();
}
export function divisors(n) {
  const out = [];
  for (let i = 1; i <= n; i++) if (n % i === 0) out.push(i);
  return out;
}

// ------------------------------------------------------------ delitelji kot pravokotniki
export function delitelji(el) {
  const svg = svgBox(340, 240);
  const out = readout();
  let n = 12;
  const draw = () => {
    svg.replaceChildren();
    const pairs = divisors(n).filter((d) => d * d <= n).map((d) => [d, n / d]);
    const cell = Math.min(14, 300 / Math.max(...pairs.map((p) => p[1])), 200 / pairs.reduce((s2, p) => s2 + p[0] + 1.5, 0));
    let y = 10;
    pairs.forEach(([r, c], k) => {
      for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) s("rect", { x: 40 + j * cell, y: y + i * cell, width: cell - 1, height: cell - 1, rx: 2, class: `tile fill-${"abc"[k % 3]}` }, svg);
      s("text", { x: 34, y: y + (r * cell) / 2 + 4, class: "tick", "text-anchor": "end" }, svg, `${r} × ${c}`);
      y += r * cell + cell * 1.5;
    });
    svg.setAttribute("viewBox", `0 0 340 ${Math.max(60, y)}`);
    const ds = divisors(n);
    out.innerHTML = `<p>Število <b>${n}</b> lahko zložimo v ${pairs.length} ${pairs.length === 1 ? "pravokotnik" : pairs.length === 2 ? "pravokotnika" : pairs.length < 5 ? "pravokotnike" : "pravokotnikov"}. Stranice pravokotnikov so delitelji: <b>${ds.join(", ")}</b> (${ds.length} deliteljev).</p>
      <p>${n === 1 ? "Število 1 ima samo en delitelj, zato ni ne praštevilo ne sestavljeno število." : ds.length === 2 ? `<b>${n} je praštevilo</b>: zložimo ga lahko samo v eno vrsto (1 × ${n}).` : `<b>${n} je sestavljeno število</b>. Večkratniki ${n} so ${[1, 2, 3, 4, 5].map((k) => k * n).join(", ")}, …`}</p>
      ${Number.isInteger(Math.sqrt(n)) ? `<p class="muted">${n} je popoln kvadrat: en pravokotnik je kvadrat ${Math.sqrt(n)} × ${Math.sqrt(n)}, zato ima liho število deliteljev.</p>` : ""}`;
  };
  layout(el, { stage: [svg], controls: [slider({ label: "število", min: 1, max: 48, value: n, onInput: (v) => ((n = v), draw()) })], out, tryText: "Poišči vsa števila do 30, ki jih lahko zložiš samo v eno vrsto. Katero število do 48 ima največ deliteljev?" });
  draw();
}

// ------------------------------------------------------------ razcep na prafaktorje
export function razcep(el) {
  const svg = svgBox(340, 260);
  const out = readout();
  let n = 360, seed = 0;
  // Razcepi n na dva faktorja (prvi par po izbiri), dokler ne ostanejo praštevila.
  const split = (m, depth) => {
    if (primeFactors(m).length <= 1) return { v: m };
    const pairs = divisors(m).filter((d) => d > 1 && d * d <= m);
    const d = pairs[(seed + depth) % pairs.length];
    return { v: m, l: split(d, depth + 1), r: split(m / d, depth + 1) };
  };
  const draw = () => {
    svg.replaceChildren();
    const tree = split(n, 0);
    const depthOf = (t) => (t.l ? 1 + Math.max(depthOf(t.l), depthOf(t.r)) : 0);
    const D = depthOf(tree);
    const leaves = (t) => (t.l ? leaves(t.l) + leaves(t.r) : 1);
    const W = 340, rowH = Math.min(52, 220 / Math.max(1, D));
    const place = (t, x0, x1, d) => {
      const x = (x0 + x1) / 2, y = 24 + d * rowH;
      if (t.l) {
        const ll = leaves(t.l), lr = leaves(t.r), mid = x0 + ((x1 - x0) * ll) / (ll + lr);
        const [xl] = place(t.l, x0, mid, d + 1), [xr] = place(t.r, mid, x1, d + 1);
        s("line", { x1: x, y1: y + 10, x2: xl, y2: y + rowH - 12, class: "guide solid" }, svg);
        s("line", { x1: x, y1: y + 10, x2: xr, y2: y + rowH - 12, class: "guide solid" }, svg);
      }
      const prime = !t.l;
      s("circle", { cx: x, cy: y, r: 14, class: prime ? "node prime" : "node" }, svg);
      label(svg, x, y + 1, String(t.v), "node-lbl");
      return [x];
    };
    place(tree, 10, W - 10, 0);
    svg.setAttribute("viewBox", `0 0 340 ${40 + D * rowH}`);
    const pf = primeFactors(n);
    const pow = Object.entries(pf.reduce((m, p) => ((m[p] = (m[p] || 0) + 1), m), {})).map(([p, k]) => (k > 1 ? `${p}^{${k}}` : p)).join("\\cdot ");
    out.innerHTML = texBlock(`${n} = ${pf.length > 1 ? pf.join("\\cdot ") + " = " + pow : "\\text{praštevilo}"}`) +
      `<p>Obarvani krogi so praštevila: tam se razcep konča. ${pf.length > 1 ? "Pritisni »Razcepi drugače«: drevo je drugačno, prafaktorji pa vedno isti." : `${n} ima samo delitelja 1 in ${n}.`}</p>`;
  };
  layout(el, {
    stage: [svg],
    controls: [slider({ label: "število", min: 2, max: 500, value: n, onInput: (v) => ((n = v), (seed = 0), draw()) }), buttons(button("Razcepi drugače", () => (seed++, draw())))],
    out,
    tryText: "Razcepi 360 na več načinov. Ali dobiš vedno iste prafaktorje? Katera števila imajo v razcepu samo dvojke?",
  });
  draw();
}

// ------------------------------------------------------------ D in v z Vennovim diagramom
export function dvvenn(el) {
  const svg = svgBox(340, 200);
  const out = readout();
  let a = 24, b = 36;
  const draw = () => {
    svg.replaceChildren();
    const fa = primeFactors(a), fb = primeFactors(b);
    const common = [], onlyA = [...fa], onlyB = [];
    for (const p of fb) {
      const i = onlyA.indexOf(p);
      if (i >= 0) common.push(p), onlyA.splice(i, 1);
      else onlyB.push(p);
    }
    s("circle", { cx: 130, cy: 100, r: 85, class: "venn fill-a" }, svg);
    s("circle", { cx: 210, cy: 100, r: 85, class: "venn fill-b" }, svg);
    label(svg, 90, 14, `${a}`, "venn-title");
    label(svg, 250, 14, `${b}`, "venn-title");
    const put = (list, cx) => list.forEach((p, i) => label(svg, cx + ((i % 2) - 0.5) * (list.length > 1 ? 26 : 0), 70 + Math.floor(i / 2) * 28, String(p), "venn-num"));
    put(onlyA, 88);
    put(common, 170);
    put(onlyB, 252);
    const prod = (l) => l.reduce((x, y) => x * y, 1);
    const D = prod(common), v = prod([...onlyA, ...common, ...onlyB]);
    out.innerHTML = texBlock(`${a} = ${fa.join("\\cdot ") || 1},\\quad ${b} = ${fb.join("\\cdot ") || 1}`) +
      `<p><b>D(${a}, ${b}) = ${common.length ? common.join(" · ") + " = " : ""}${D}</b>: zmnožimo prafaktorje v preseku (skupne).</p>
       <p><b>v(${a}, ${b}) = ${[...onlyA, ...common, ...onlyB].join(" · ")} = ${v}</b>: zmnožimo vse prafaktorje v obeh krogih.</p>
       <p class="muted">Preveri: D · v = ${D} · ${v} = ${D * v} = ${a} · ${b}. ${D === 1 ? "Števili sta tuji: nimata skupnih prafaktorjev." : ""}</p>`;
  };
  layout(el, {
    stage: [svg],
    controls: [slider({ label: "a", min: 2, max: 120, value: a, onInput: (v) => ((a = v), draw()) }), slider({ label: "b", min: 2, max: 120, value: b, onInput: (v) => ((b = v), draw()) })],
    out,
    tryText: "Nastavi a = 8 in b = 15. Kaj je v preseku? Kdaj je v(a, b) enak večjemu od števil?",
  });
  draw();
}

// ------------------------------------------------------------ Evklidov algoritem s kvadrati
export function evklid(el) {
  const svg = svgBox(340, 240);
  const out = readout();
  let a = 42, b = 30;
  const draw = () => {
    svg.replaceChildren();
    const sc = 210 / 80; // stalno merilo: večji števili → večji pravokotnik
    let x = 20, y = 15, w = a, hh = b, steps = [], k = 0;
    s("rect", { x, y, width: a * sc, height: b * sc, class: "box" }, svg);
    while (w > 0 && hh > 0 && k < 40) {
      const side = Math.min(w, hh), q = Math.floor(Math.max(w, hh) / side), r = Math.max(w, hh) % side;
      steps.push(`${Math.max(w, hh)} = ${q} \\cdot ${side} + ${r}`);
      for (let i = 0; i < q; i++) {
        const sx = w >= hh ? x + i * side * sc : x, sy = w >= hh ? y : y + i * side * sc;
        s("rect", { x: sx, y: sy, width: side * sc, height: side * sc, class: `tile fill-${"abc"[k % 3]}`, rx: 1 }, svg);
      }
      if (w >= hh) (x += q * side * sc), (w = r);
      else (y += q * side * sc), (hh = r);
      k++;
    }
    const g = gcd(a, b);
    out.innerHTML = `<p>Iz pravokotnika ${a} × ${b} odrežemo čim večje kvadrate. Kar ostane, spet razrežemo. Stranica zadnjega kvadrata je <b>D(${a}, ${b}) = ${g}</b>.</p>` +
      texBlock(steps.join("\\\\ ").replace(/\\\\ $/, "")) +
      `<p class="muted">Vsak kvadrat se natanko prilega, zato ${g} deli vse stranice: tudi ${a} in ${b}.</p>`;
  };
  layout(el, {
    stage: [svg],
    controls: [slider({ label: "a", min: 1, max: 80, value: a, onInput: (v) => ((a = v), draw()) }), slider({ label: "b", min: 1, max: 80, value: b, onInput: (v) => ((b = v), draw()) })],
    out,
    tryText: "Nastavi 55 in 34 (zaporedni Fibonaccijevi števili). Koliko korakov potrebuješ? Kaj se zgodi pri 40 in 20?",
  });
  draw();
}

// ------------------------------------------------------------ skoki na številski premici
const LINE_SETS = {
  naravna: { from: 0, to: 20, step: 1, major: 2, a: 7, b: 5, ops: ["+", "−"], bMin: 0, bMax: 12, aMin: 0, aMax: 20 },
  cela: { from: -10, to: 10, step: 1, major: 2, a: -3, b: 5, ops: ["+", "−", "·"], bMin: -8, bMax: 8, aMin: -10, aMax: 10, extras: true },
  decimalna: { from: 0, to: 3, step: 0.1, major: 0.5, a: 0.7, b: 1.5, ops: ["+", "−"], bMin: 0, bMax: 2, aMin: 0, aMax: 3, d: 1 },
  racionalna: { from: -3, to: 3, step: 0.25, major: 1, a: -1.25, b: 2.5, ops: ["+", "−"], bMin: -3, bMax: 3, aMin: -3, aMax: 3, d: 2, extras: true },
};
export function skoki(el, { set = "cela" } = {}) {
  const S = LINE_SETS[set] || LINE_SETS.cela;
  const svg = svgBox(340, 150);
  const out = readout();
  let a = S.a, b = S.b, op = "+", showOpp = false;
  const draw = () => {
    svg.replaceChildren();
    const nl = numberLine(svg, { x0: 20, x1: 310, from: S.from, to: S.to, step: S.step, major: S.major, y: 105 });
    const X = nl.X;
    const d = S.d ?? 0;
    let res, jumps = [];
    if (op === "·") {
      res = a * b;
      const n = Math.abs(b), dir = Math.sign(b) || 1;
      for (let i = 0; i < n; i++) jumps.push([i * a * dir, (i + 1) * a * dir]);
    } else {
      const delta = op === "+" ? b : -b;
      res = a + delta;
      jumps.push([a, a + delta]);
    }
    const inRange = (v) => v >= S.from - 1e-9 && v <= S.to + 1e-9;
    if (!inRange(res)) {
      out.innerHTML = `<p class="fb bad">Rezultat ${fmt(res, d)} je izven premice. Izberi manjša števila.</p>`;
      return;
    }
    if (op !== "·") s("circle", { cx: X(a), cy: 105, r: 7, class: "pt fill-a" }, svg);
    jumps.forEach(([u, v], i) => {
      const x1 = X(u), x2 = X(v), mid = (x1 + x2) / 2, hgt = Math.min(60, 14 + Math.abs(x2 - x1) * 0.4);
      const p = s("path", { d: `M${x1},100 Q${mid},${100 - hgt * 2} ${x2},100`, class: `jump stroke-${op === "·" ? "c" : (op === "+" ? b : -b) >= 0 ? "b" : "danger"}` }, svg);
      p.style.animationDelay = `${i * 0.15}s`;
      s("path", { d: `M${x2},100 l${x2 > x1 ? -7 : 7},-6 v7 z`, class: `fill-${op === "·" ? "c" : (op === "+" ? b : -b) >= 0 ? "b" : "danger"}` }, svg);
    });
    s("circle", { cx: X(res), cy: 105, r: 7, class: "pt fill-c" }, svg);
    if (showOpp && S.extras) {
      s("circle", { cx: X(-a), cy: 105, r: 6, class: "pt fill-muted" }, svg);
      s("line", { x1: X(0), y1: 132, x2: X(a), y2: 132, class: "nl-range" }, svg);
      label(svg, (X(0) + X(a)) / 2, 142, `|${fmt(a, d)}| = ${fmt(Math.abs(a), d)}`, "tick");
    }
    const sb = b < 0 ? `(${fmt(b, d)})` : fmt(b, d);
    let expl;
    if (op === "·") expl = `${fmt(a, d)} · ${sb}: naredimo ${Math.abs(b)} ${Math.abs(b) === 1 ? "skok" : "skokov"} dolžine ${fmt(a, d)} ${b < 0 ? "in jih zrcalimo čez 0 (množenje z negativnim številom obrne smer)" : "od 0"}. ${a * b > 0 ? "Enaka predznaka: rezultat je pozitiven." : a * b < 0 ? "Različna predznaka: rezultat je negativen." : ""}`;
    else {
      const delta = op === "+" ? b : -b;
      expl = `Začnemo pri ${fmt(a, d)} in se premaknemo za ${fmt(Math.abs(delta), d)} ${delta >= 0 ? "v desno" : "v levo"}.`;
      if (S.extras && b < 0) expl += op === "+" ? ` Prištevanje negativnega števila je isto kot odštevanje: ${fmt(a, d)} + ${sb} = ${fmt(a, d)} − ${fmt(-b, d)}.` : ` Odštevanje negativnega števila je isto kot prištevanje: ${fmt(a, d)} − ${sb} = ${fmt(a, d)} + ${fmt(-b, d)}.`;
    }
    out.innerHTML = `<div class="demo-eq">${fmt(a, d)} ${op} ${sb} = <b>${fmt(res, d)}</b></div><p>${expl}</p>` +
      (showOpp && S.extras ? `<p>Nasprotno število od ${fmt(a, d)} je ${fmt(-a, d)} (siva pika): enako daleč od 0, na drugi strani. Absolutna vrednost je razdalja do 0.</p>` : "");
  };
  const ctl = [
    slider({ label: "prvo število", min: S.aMin, max: S.aMax, step: S.step, value: a, onInput: (v) => ((a = v), draw()) }),
    segmented({ options: S.ops, value: op, onChange: (v) => ((op = v), draw()) }),
    slider({ label: "drugo število", min: S.bMin, max: S.bMax, step: S.step, value: b, onInput: (v) => ((b = v), draw()) }),
  ];
  if (S.extras) ctl.push(toggle("pokaži nasprotno število in absolutno vrednost", false, (v) => ((showOpp = v), draw())));
  layout(el, {
    stage: [svg],
    controls: ctl,
    out,
    tryText: set === "cela" ? "Primerjaj 3 − 5 in 3 + (−5). Nato izračunaj (−2) · 3 in (−2) · (−3): kam kaže zadnji skok?" : set === "decimalna" ? "Seštej 0,7 in 0,5. Koliko desetink je to skupaj? Zakaj je 0,7 + 0,5 = 1,2 in ne 0,12?" : "Kateri skok te pripelje točno na 0? Kako se imenuje tako število?",
  });
  draw();
}

// ------------------------------------------------------------ desetiški ulomki (mreža 10 × 10)
export function decimalke(el) {
  const svg = svgBox(340, 300);
  const out = readout();
  let v = 0.37;
  const draw = () => {
    svg.replaceChildren();
    const c = 20, x0 = 70, y0 = 8;
    const hundredths = Math.round(v * 100);
    for (let j = 0; j < 10; j++)
      for (let i = 0; i < 10; i++) {
        const k = j * 10 + i;
        s("rect", { x: x0 + j * c, y: y0 + i * c, width: c - 1, height: c - 1, rx: 2, class: k < hundredths ? (j < Math.floor(hundredths / 10) ? "tile fill-a" : "tile fill-b") : "tile empty" }, svg);
      }
    const nl = numberLine(svg, { x0: 20, x1: 315, from: 0, to: 1, step: 0.01, major: 0.1, y: 240, fmtL: (x) => fmt(x, 1) });
    s("line", { x1: nl.X(0), y1: 240, x2: nl.X(v), y2: 240, class: "nl-range" }, svg);
    s("circle", { cx: nl.X(v), cy: 240, r: 7, class: "pt fill-c" }, svg);
    const t = Math.floor(hundredths / 10), u = hundredths % 10;
    out.innerHTML = texBlock(`${fmt(v, 2).replace(",", "{,}")} = \\frac{${t}}{10} + \\frac{${u}}{100} = \\frac{${hundredths}}{100}`) +
      `<p><span class="dot dot-a"></span> ${t} ${t === 1 ? "desetinka" : t === 2 ? "desetinki" : t < 5 ? "desetinke" : "desetink"} (cel stolpec je 0,1) in <span class="dot dot-b"></span> ${u} ${u === 1 ? "stotinka" : u === 2 ? "stotinki" : u < 5 && u ? "stotinke" : "stotink"} (en kvadratek je 0,01).</p>
       <p class="muted">${fmt(v, 2)} = ${fmt(v, 1) === fmt(v, 2) ? fmt(v, 1) + "0 (ničla na koncu ne spremeni vrednosti)" : hundredths + " % celote"}.</p>`;
  };
  layout(el, { stage: [svg], controls: [slider({ label: "decimalno število", min: 0, max: 1, step: 0.01, value: v, onInput: (x) => ((v = x), draw()) })], out, tryText: "Katero število je večje: 0,5 ali 0,45? Nastavi obe in primerjaj pobarvano ploskev." });
  draw();
}

// ------------------------------------------------------------ periodična decimalna števila
export function periode(el) {
  const out = readout();
  let a = 5, b = 7;
  const draw = () => {
    const whole = Math.floor(a / b);
    let r = a % b;
    const seen = new Map(), digits = [], rows = [];
    while (r && !seen.has(r) && digits.length < 40) {
      seen.set(r, digits.length);
      const q = Math.floor((r * 10) / b);
      rows.push(`<tr><td>${r * 10} : ${b}</td><td>= ${q}</td><td>ostanek ${(r * 10) % b}</td></tr>`);
      digits.push(q);
      r = (r * 10) % b;
    }
    const start = r ? seen.get(r) : digits.length;
    const pre = digits.slice(0, start).join(""), per = digits.slice(start).join("");
    const t = `\\frac{${a}}{${b}} = ${whole}${digits.length ? "{,}" + pre + (per ? `\\overline{${per}}` : "") : ""}`;
    const pf = primeFactors(b / gcd(a, b));
    out.innerHTML = texBlock(t) +
      `<p>${r ? `Ostanek ${r} se ponovi, zato se od tu naprej ponavljajo iste števke: perioda ima ${per.length} ${per.length === 1 ? "števko" : per.length === 2 ? "števki" : per.length < 5 ? "števke" : "števk"}.` : "Deljenje se konča (ostanek 0): decimalno število je končno."}</p>
       <p class="muted">${pf.every((p) => p === 2 || p === 5) ? `Okrajšani imenovalec ima samo prafaktorja 2 in 5, zato je zapis končen.` : `Okrajšani imenovalec ima prafaktor, različen od 2 in 5 (${pf.filter((p) => p !== 2 && p !== 5).join(", ")}), zato je zapis periodičen.`} Možnih ostankov je le ${b - 1}, zato se mora nekdaj ponoviti.</p>
       <table class="demo-table"><tr><th>deljenje</th><th>števka</th><th></th></tr>${rows.slice(0, 12).join("")}</table>`;
  };
  layout(el, {
    controls: [slider({ label: "števec", min: 1, max: 40, value: a, onInput: (v) => ((a = v), draw()) }), slider({ label: "imenovalec", min: 2, max: 40, value: b, onInput: (v) => ((b = v), draw()) })],
    out,
    tryText: "Preizkusi imenovalce 8, 20, 3, 11 in 13. Kateri dajo končna decimalna števila?",
  });
  draw();
}

// ------------------------------------------------------------ primerjanje ulomkov
function fracBar(svg, y, num, den, cls, { x0 = 30, w = 280, hgt = 28, sub = 1 } = {}) {
  const parts = den * sub;
  for (let i = 0; i < parts; i++)
    s("rect", { x: x0 + (i * w) / parts, y, width: w / parts, height: hgt, class: i < num * sub ? `bar ${cls}` : "bar empty" }, svg);
  s("rect", { x: x0, y, width: w, height: hgt, class: "bar-frame" }, svg);
}
export function ulomkiPrimerjava(el) {
  const svg = svgBox(340, 190);
  const out = readout();
  let a = 2, b = 3, c = 3, d = 5, common = false;
  const draw = () => {
    svg.replaceChildren();
    const L = lcm(b, d);
    fracBar(svg, 12, a, b, "fill-a", { sub: common ? L / b : 1 });
    fracBar(svg, 52, c, d, "fill-b", { sub: common ? L / d : 1 });
    label(svg, 16, 26, frac(a, b).replace(/\\frac\{(\d+)\}\{(\d+)\}/, "$1/$2"), "tick");
    label(svg, 16, 66, `${c}/${d}`, "tick");
    const nl = numberLine(svg, { x0: 30, x1: 310, from: 0, to: 1, step: 1 / L, major: 1, y: 130, labels: true });
    s("circle", { cx: nl.X(a / b), cy: 130, r: 7, class: "pt fill-a" }, svg);
    s("circle", { cx: nl.X(c / d), cy: 130, r: 7, class: "pt fill-b", opacity: 0.9 }, svg);
    const cmp = a * d === b * c ? "=" : a / b > c / d ? ">" : "<";
    out.innerHTML = texBlock(`\\frac{${a}}{${b}} ${cmp} \\frac{${c}}{${d}}`) +
      (common
        ? `<p>Skupni imenovalec je v(${b}, ${d}) = ${L}: ${tex(`\\frac{${a}}{${b}} = \\frac{${(a * L) / b}}{${L}}`)} in ${tex(`\\frac{${c}}{${d}} = \\frac{${(c * L) / d}}{${L}}`)}. Zdaj primerjamo samo števca: ${(a * L) / b} ${cmp} ${(c * L) / d}.</p>`
        : `<p>Ko imata ulomka različna imenovalca, so deli različno veliki, zato števcev ne smemo kar primerjati. Vklopi skupni imenovalec.</p>`);
  };
  layout(el, {
    stage: [svg],
    controls: [
      slider({ label: "prvi števec", min: 0, max: 12, value: a, onInput: (v) => ((a = Math.min(v, b)), draw()) }),
      slider({ label: "prvi imenovalec", min: 1, max: 12, value: b, onInput: (v) => ((b = v), (a = Math.min(a, b)), draw()) }),
      slider({ label: "drugi števec", min: 0, max: 12, value: c, onInput: (v) => ((c = Math.min(v, d)), draw()) }),
      slider({ label: "drugi imenovalec", min: 1, max: 12, value: d, onInput: (v) => ((d = v), (c = Math.min(c, d)), draw()) }),
      toggle("razdeli na skupni imenovalec", common, (v) => ((common = v), draw())),
    ],
    out,
    tryText: "Kateri je večji: 3/4 ali 5/7? Najprej ugani, potem preveri. Kaj velja za ulomka z enakim števcem?",
  });
  draw();
}

// ------------------------------------------------------------ seštevanje in odštevanje ulomkov
export function ulomkiRacun(el) {
  const svg = svgBox(340, 170);
  const out = readout();
  let a = 1, b = 2, c = 1, d = 3, op = "+";
  const draw = () => {
    svg.replaceChildren();
    const L = lcm(b, d), A = (a * L) / b, C = (c * L) / d, R = op === "+" ? A + C : A - C;
    const w = 140;
    fracBar(svg, 14, a, b, "fill-a", { w, x0: 20, sub: L / b });
    fracBar(svg, 14, c, d, "fill-b", { w, x0: 180, sub: L / d });
    label(svg, 170, 28, op, "lbl big");
    // rezultat: dve enoti dolžine
    const units = Math.max(1, Math.ceil(Math.abs(R) / L));
    for (let u = 0; u < units; u++) fracBar(svg, 80, clamp(R - u * L, 0, L), L, "fill-c", { w: 300 / units - 6, x0: 20 + u * (300 / units) });
    if (op === "+") for (let i = A; i < Math.min(R, L * units); i++) {
      const u = Math.floor(i / L), k = i % L, ww = 300 / units - 6;
      s("rect", { x: 20 + u * (300 / units) + (k * ww) / L, y: 80, width: ww / L, height: 28, class: "bar fill-b" }, svg);
    }
    label(svg, 170, 130, R < 0 ? "rezultat je negativen" : "", "tick");
    const g = gcd(Math.abs(R), L) || 1;
    out.innerHTML = texBlock(`\\frac{${a}}{${b}} ${op} \\frac{${c}}{${d}} = \\frac{${A}}{${L}} ${op} \\frac{${C}}{${L}} = \\frac{${R}}{${L}}${g > 1 && R ? ` = \\frac{${R / g}}{${L / g}}` : ""}`) +
      `<p>Seštevamo lahko samo enako velike dele. Oba ulomka razdelimo na ${L}-ine (najmanjši skupni večkratnik imenovalcev ${b} in ${d}), nato ${op === "+" ? "seštejemo" : "odštejemo"} števca. Imenovalec ostane ${L}.</p>
       <p class="muted">Pogosta napaka: ${a}/${b} ${op} ${c}/${d} ni ${a + (op === "+" ? c : -c)}/${b + d}. Preveri: to je ${fmt((a + (op === "+" ? c : -c)) / (b + d), 3)}, pravilni rezultat pa ${fmt(R / L, 3)}.</p>`;
  };
  layout(el, {
    stage: [svg],
    controls: [
      slider({ label: "prvi števec", min: 0, max: 9, value: a, onInput: (v) => ((a = v), draw()) }),
      slider({ label: "prvi imenovalec", min: 1, max: 10, value: b, onInput: (v) => ((b = v), draw()) }),
      segmented({ options: ["+", "−"], value: "+", onChange: (v) => ((op = v === "−" ? "-" : "+"), draw()) }),
      slider({ label: "drugi števec", min: 0, max: 9, value: c, onInput: (v) => ((c = v), draw()) }),
      slider({ label: "drugi imenovalec", min: 1, max: 10, value: d, onInput: (v) => ((d = v), draw()) }),
    ],
    out,
    tryText: "Izračunaj 1/2 + 1/3. Na koliko delov moraš razdeliti celoto, da lahko oba ulomka narišeš z enakimi deli?",
  });
  draw();
}

// ------------------------------------------------------------ množenje in deljenje ulomkov
export function ulomkiMnozenje(el) {
  const svg = svgBox(340, 260);
  const out = readout();
  let a = 2, b = 3, c = 3, d = 4, mode = "mnozenje";
  const draw = () => {
    svg.replaceChildren();
    if (mode === "mnozenje") {
      const S = 200, x0 = 70, y0 = 20;
      for (let i = 0; i < b; i++) for (let j = 0; j < d; j++) {
        const inA = i < a, inC = j < c;
        s("rect", { x: x0 + (i * S) / b, y: y0 + (j * S) / d, width: S / b, height: S / d, class: `bar ${inA && inC ? "fill-c" : inA ? "fill-a" : inC ? "fill-b" : "empty"}` }, svg);
      }
      s("rect", { x: x0, y: y0, width: S, height: S, class: "bar-frame" }, svg);
      label(svg, x0 + (S * a) / b / 2, 12, `${a}/${b}`, "tick");
      label(svg, x0 - 22, y0 + (S * c) / d / 2, `${c}/${d}`, "tick");
      const g = gcd(a * c, b * d) || 1;
      out.innerHTML = texBlock(`\\frac{${a}}{${b}}\\cdot\\frac{${c}}{${d}} = \\frac{${a}\\cdot ${c}}{${b}\\cdot ${d}} = \\frac{${a * c}}{${b * d}}${g > 1 ? ` = \\frac{${(a * c) / g}}{${(b * d) / g}}` : ""}`) +
        `<p>Kvadrat je cela enota. <span class="dot dot-a"></span> stolpci so ${a}/${b}, <span class="dot dot-b"></span> vrstice ${c}/${d}. Njun presek <span class="dot dot-c"></span> je ${c}/${d} od ${a}/${b}: ${a * c} od ${b * d} enakih delov.</p>
         <p class="muted">Zato množimo števec s števcem in imenovalec z imenovalcem. Produkt dveh pravih ulomkov je manjši od obeh.</p>`;
    } else {
      const total = a / b, part = c / d, q = total / part, w = 300;
      const units = Math.max(1, Math.ceil(total));
      fracBar(svg, 20, a, b, "fill-a", { w: (w * Math.max(total, 1)) / units, x0: 20 });
      const n = Math.floor(q + 1e-9);
      for (let i = 0; i < Math.min(n + 1, 40); i++) {
        const x = 20 + (i * part * w) / units, ww = Math.min(part, total - i * part) * (w / units);
        if (ww <= 0.5) break;
        s("rect", { x, y: 70, width: ww, height: 28, class: `bar ${i < n ? "fill-b" : "fill-c"}`, rx: 3 }, svg);
        label(svg, x + ww / 2, 84, i < n ? String(i + 1) : "del", "lbl small");
      }
      svg.setAttribute("viewBox", "0 0 340 120");
      out.innerHTML = texBlock(`\\frac{${a}}{${b}} : \\frac{${c}}{${d}} = \\frac{${a}}{${b}}\\cdot\\frac{${d}}{${c}} = \\frac{${a * d}}{${b * c}}${Number.isInteger(q) ? ` = ${q}` : ` \\approx ${tfmt(q)}`}`) +
        `<p>Deljenje vpraša: <b>kolikokrat</b> gre ${c}/${d} v ${a}/${b}? Na traku vidiš ${n} celih kosov${Number.isInteger(q) ? "" : " in še del kosa"}.</p>
         <p class="muted">Deliti z ulomkom pomeni množiti z njegovo obratno vrednostjo (${d}/${c}).</p>`;
      return;
    }
    svg.setAttribute("viewBox", "0 0 340 240");
  };
  layout(el, {
    stage: [h("div", { class: "demo-seg-wrap" }, segmented({ options: [["mnozenje", "Množenje"], ["deljenje", "Deljenje"]], value: mode, onChange: (v) => ((mode = v), draw()) })), svg],
    controls: [
      slider({ label: "prvi števec", min: 1, max: 9, value: a, onInput: (v) => ((a = v), draw()) }),
      slider({ label: "prvi imenovalec", min: 1, max: 9, value: b, onInput: (v) => ((b = v), (a = Math.min(a, mode === "mnozenje" ? b : 9)), draw()) }),
      slider({ label: "drugi števec", min: 1, max: 9, value: c, onInput: (v) => ((c = v), draw()) }),
      slider({ label: "drugi imenovalec", min: 1, max: 9, value: d, onInput: (v) => ((d = v), draw()) }),
    ],
    out,
    tryText: "Izračunaj polovico od treh četrtin (1/2 · 3/4). Nato preveri, kolikokrat gre 1/4 v 3/2.",
  });
  draw();
}

// ------------------------------------------------------------ trakovni prikaz (besedilne naloge)
export function trak(el, { mode = "ulomek" } = {}) {
  const svg = svgBox(340, 150);
  const out = readout();
  let q = 5, p = 3, part = 24, x = 12, dd = 7, k = 2;
  const ctl = h("div", { class: "demo-controls" });
  const build = () => {
    ctl.replaceChildren();
    if (mode === "ulomek")
      ctl.append(
        slider({ label: "imenovalec", min: 2, max: 10, value: q, onInput: (v) => ((q = v), (p = Math.min(p, q)), draw()) }),
        slider({ label: "števec", min: 1, max: 10, value: p, onInput: (v) => ((p = Math.min(v, q)), draw()) }),
        slider({ label: "znani del", min: 1, max: 100, value: part, onInput: (v) => ((part = v), draw()) }),
      );
    else
      ctl.append(
        slider({ label: "x (skrito)", min: 1, max: 30, value: x, onInput: (v) => ((x = v), draw()) }),
        slider({ label: "kolikokrat", min: 1, max: 4, value: k, onInput: (v) => ((k = v), draw()) }),
        slider({ label: "za koliko več", min: 0, max: 20, value: dd, onInput: (v) => ((dd = v), draw()) }),
      );
    draw();
  };
  const draw = () => {
    svg.replaceChildren();
    if (mode === "ulomek") {
      const w = 280 / q, unit = part / p, whole = unit * q;
      for (let i = 0; i < q; i++) {
        s("rect", { x: 30 + i * w, y: 40, width: w, height: 36, class: `bar ${i < p ? "fill-a" : "empty"}` }, svg);
        label(svg, 30 + i * w + w / 2, 58, fmt(unit, 2), "lbl small");
      }
      s("path", { d: `M30,32 v-8 h${p * w} v8`, class: "brace" }, svg);
      label(svg, 30 + (p * w) / 2, 14, `${p}/${q} = ${fmt(part)}`, "lbl");
      s("path", { d: `M30,84 v8 h280 v-8`, class: "brace" }, svg);
      label(svg, 170, 104, `celota = ?`, "lbl");
      out.innerHTML = `<p><b>Naloga:</b> ${p}/${q} neke količine je ${fmt(part)}. Kolikšna je cela količina?</p>
        <p>Trak razdelimo na ${q} enakih delov. ${p} ${p === 1 ? "del je" : p < 5 ? "deli so" : "delov je"} ${fmt(part)}, zato je en del ${fmt(part)} : ${p} = <b>${fmt(unit, 2)}</b>. Celota ima ${q} delov: ${q} · ${fmt(unit, 2)} = <b>${fmt(whole, 2)}</b>.</p>
        ${texBlock(`\\frac{${p}}{${q}}\\cdot x = ${part} \\;\\Rightarrow\\; x = ${part} : \\frac{${p}}{${q}} = ${tfmt(whole)}`)}`;
    } else {
      const big = k * x + dd, S = x + big, sc = 280 / Math.max(S, 1);
      s("rect", { x: 30, y: 20, width: x * sc, height: 30, class: "bar fill-a" }, svg);
      label(svg, 30 + (x * sc) / 2, 35, "x", "lbl");
      for (let i = 0; i < k; i++) {
        s("rect", { x: 30 + i * x * sc, y: 70, width: x * sc, height: 30, class: "bar fill-a" }, svg);
        label(svg, 30 + i * x * sc + (x * sc) / 2, 85, "x", "lbl");
      }
      if (dd) {
        s("rect", { x: 30 + k * x * sc, y: 70, width: dd * sc, height: 30, class: "bar fill-b" }, svg);
        label(svg, 30 + k * x * sc + (dd * sc) / 2, 85, String(dd), "lbl small");
      }
      s("path", { d: `M${30 + Math.max(x, big) * sc + 8},20 h6 v80 h-6`, class: "brace" }, svg);
      label(svg, 30 + Math.max(x, big) * sc + 22, 60, `${S}`, "lbl", "start");
      out.innerHTML = `<p><b>Naloga:</b> Drugo število je ${k > 1 ? `${k}-krat tolikšno kot prvo` : "enako prvemu"}${dd ? ` in še ${dd} več` : ""}. Vsota števil je ${S}. Kateri sta števili?</p>
        ${texBlock(`x + (${k > 1 ? k : ""}x${dd ? " + " + dd : ""}) = ${S}\\\\ ${k + 1}x${dd ? " + " + dd : ""} = ${S}\\\\ ${k + 1}x = ${S - dd}\\\\ x = ${x}`)}
        <p>Na traku vidiš ${k + 1} enakih delov x${dd ? ` in še ${dd}` : ""}. Odšteješ ${dd}, deliš s ${k + 1}. Števili sta <b>${x}</b> in <b>${big}</b>.</p>`;
    }
  };
  layout(el, {
    stage: [h("div", { class: "demo-seg-wrap" }, segmented({ options: [["ulomek", "Del celote"], ["vsota", "Vsota dveh števil"]], value: mode, onChange: (v) => ((mode = v), build()) })), svg],
    controls: ctl,
    out,
    tryText: "Nariši si trak tudi na papir, ko rešuješ besedilno nalogo. Kaj vse lahko razbereš s traku, preden računaš?",
  });
  build();
}

// ------------------------------------------------------------ razmerje (mešanje soka)
export function razmerje(el) {
  const svg = svgBox(340, 200);
  const out = readout();
  let a = 2, b = 3, total = 500;
  const draw = () => {
    svg.replaceChildren();
    const n = a + b;
    for (let i = 0; i < n; i++) {
      const x = 20 + (i % 10) * 30, y = 20 + Math.floor(i / 10) * 44;
      s("path", { d: `M${x},${y} h22 l-3,34 h-16 z`, class: `cup ${i < a ? "fill-a" : "fill-b"}` }, svg);
    }
    // vrč z mešanico
    const mix = a / n;
    s("path", { d: "M235,110 h70 v70 q0,8 -8,8 h-54 q-8,0 -8,-8 z", class: "beaker" }, svg);
    const hl = (total / 2000) * 74; // višina mešanice v vrču je sorazmerna s prostornino
    s("rect", { x: 236, y: 187 - hl, width: 68, height: hl, rx: 6, fill: `color-mix(in srgb, var(--demo-a) ${Math.round(mix * 100)}%, var(--demo-b))` }, svg);
    label(svg, 270, 102, `${total} mL`, "tick small");
    const g = gcd(a, b);
    const pa = (total * a) / n, pb = (total * b) / n;
    for (let k = 1; k <= 4; k++) s("text", { x: 20, y: 120 + k * 18, class: "tick" }, svg, `${a * k} : ${b * k}`);
    s("text", { x: 20, y: 118, class: "tick b" }, svg, "enaka razmerja:");
    out.innerHTML = texBlock(`${a} : ${b}${g > 1 ? ` = ${a / g} : ${b / g}` : ""}`) +
      `<p>Na ${a} ${a === 1 ? "kozarec" : "kozarce"} <span class="dot dot-a"></span> soka pride ${b} ${b === 1 ? "kozarec" : "kozarcev"} <span class="dot dot-b"></span> vode. Sok je ${a}/${n} mešanice (${fmt((100 * a) / n, 1)} %).</p>
       <p>Če pripravimo <b>${total} mL</b> mešanice, razdelimo na ${n} enakih delov po ${fmt(total / n, 1)} mL: soka je ${fmt(pa, 1)} mL, vode ${fmt(pb, 1)} mL.</p>
       <p class="muted">Ko obe števili pomnožimo z istim številom, se okus (barva) ne spremeni: razmerje ostane enako.</p>`;
  };
  layout(el, {
    stage: [svg],
    controls: [
      slider({ label: "sok", min: 1, max: 10, value: a, onInput: (v) => ((a = v), draw()) }),
      slider({ label: "voda", min: 1, max: 10, value: b, onInput: (v) => ((b = v), draw()) }),
      slider({ label: "skupaj (mL)", min: 100, max: 2000, step: 50, value: total, onInput: (v) => ((total = v), draw()) }),
    ],
    out,
    tryText: "Ali imata mešanici 2 : 3 in 4 : 6 enako barvo? Kaj pa 2 : 3 in 3 : 4? Katera je bolj sladka?",
  });
  draw();
}

// ------------------------------------------------------------ premo in obratno sorazmerje, sklepni račun
export function sorazmerje(el, { mode = "premo" } = {}) {
  const svg = svgBox(340, 240);
  const out = readout();
  let k = 2.5, x = 4, c = 24;
  const draw = () => {
    svg.replaceChildren();
    const premo = mode === "premo";
    const W = 340, H = 240;
    const A = premo ? { x: [0, 10], y: [0, 30] } : { x: [0, 12], y: [0, 30] };
    const L = 34, B = H - 28, R = W - 12, T = 12;
    const X = (v) => L + (v / A.x[1]) * (R - L), Y = (v) => B - (v / A.y[1]) * (B - T);
    for (let v = 0; v <= A.x[1]; v += 2) { s("line", { x1: X(v), y1: T, x2: X(v), y2: B, class: "grid" }, svg); s("text", { x: X(v), y: B + 15, class: "tick", "text-anchor": "middle" }, svg, String(v)); }
    for (let v = 0; v <= A.y[1]; v += 5) { s("line", { x1: L, y1: Y(v), x2: R, y2: Y(v), class: "grid" }, svg); s("text", { x: L - 5, y: Y(v) + 4, class: "tick", "text-anchor": "end" }, svg, String(v)); }
    s("line", { x1: L, y1: B, x2: R, y2: B, class: "axis" }, svg);
    s("line", { x1: L, y1: B, x2: L, y2: T, class: "axis" }, svg);
    const f = premo ? (t) => k * t : (t) => c / t;
    let d = "";
    for (let i = 1; i <= 200; i++) {
      const t = (A.x[1] * i) / 200, y = f(t);
      if (y <= A.y[1] * 1.05) d += `${d ? "L" : "M"}${X(t).toFixed(1)},${Y(Math.min(y, A.y[1] * 1.05)).toFixed(1)}`;
    }
    if (premo) d = `M${X(0)},${Y(0)}` + d.replace(/^M/, "L");
    s("path", { d, class: "graph-line" }, svg);
    const y = f(x);
    if (!premo) s("rect", { x: X(0), y: Y(y), width: X(x) - X(0), height: Y(0) - Y(y), class: "area-fill" }, svg);
    s("line", { x1: X(x), y1: B, x2: X(x), y2: Y(y), class: "guide" }, svg);
    s("line", { x1: L, y1: Y(y), x2: X(x), y2: Y(y), class: "guide" }, svg);
    s("circle", { cx: X(x), cy: Y(y), r: 7, class: "pt fill-a" }, svg);
    const rows = [1, 2, 3, 4, 6, 8].map((t) => `<td>${t}</td>`).join("");
    const vals = [1, 2, 3, 4, 6, 8].map((t) => `<td>${fmt(f(t), 2)}</td>`).join("");
    out.innerHTML = premo
      ? `<p><b>Premo sorazmerje:</b> 1 kg jabolk stane ${fmt(k)} €. Za ${fmt(x, 1)} kg plačaš ${fmt(k)} · ${fmt(x, 1)} = <b>${fmt(y)} €</b>.</p>
         <table class="demo-table"><tr><th>kg</th>${rows}</tr><tr><th>€</th>${vals}</tr></table>
         <p>Sklepni račun: najprej <b>sklep na enoto</b> (koliko stane 1 kg), nato pomnožimo. Če se ena količina poveča 2-krat, se tudi druga poveča 2-krat. Količnik y : x = ${fmt(k)} je stalen; graf je premica skozi izhodišče.</p>`
      : `<p><b>Obratno sorazmerje:</b> delo, za katero 1 delavec potrebuje ${c} dni. ${fmt(x, 1)} delavcev ga opravi v ${c} : ${fmt(x, 1)} = <b>${fmt(y)} dneva</b>.</p>
         <table class="demo-table"><tr><th>delavci</th>${rows}</tr><tr><th>dnevi</th>${vals}</tr></table>
         <p>Produkt x · y = ${c} je stalen: pobarvani pravokotnik ima vedno enako ploščino. Če se število delavcev poveča 2-krat, se čas zmanjša 2-krat. Graf je krivulja (hiperbola), ki se osi le približuje.</p>`;
  };
  const ctl = h("div", { class: "demo-controls" });
  const build = () => {
    ctl.replaceChildren(
      mode === "premo"
        ? slider({ label: "cena za 1 kg (€)", min: 0.5, max: 3, step: 0.5, value: k, onInput: (v) => ((k = v), draw()) })
        : slider({ label: "dni za 1 delavca", min: 6, max: 30, step: 1, value: c, onInput: (v) => ((c = v), draw()) }),
      slider({ label: mode === "premo" ? "kg" : "delavci", min: 1, max: 10, step: 1, value: x, onInput: (v) => ((x = v), draw()) }),
    );
    draw();
  };
  layout(el, {
    stage: [h("div", { class: "demo-seg-wrap" }, segmented({ options: [["premo", "Premo sorazmerje"], ["obratno", "Obratno sorazmerje"]], value: mode, onChange: (v) => ((mode = v), build()) })), svg],
    controls: ctl,
    out,
    tryText: "Ali sta količini »starost in višina otroka« premo sorazmerni? Kaj pa »hitrost in čas vožnje do Kopra«? Preveri s tabelo.",
  });
  build();
}

// ------------------------------------------------------------ odstotki
export function odstotki(el) {
  const svg = svgBox(340, 280);
  const out = readout();
  let p = 35, G = 80, change = 0;
  const draw = () => {
    svg.replaceChildren();
    const c = 15, x0 = 95;
    for (let j = 0; j < 10; j++) for (let i = 0; i < 10; i++) {
      const k = j * 10 + i;
      s("rect", { x: x0 + i * c, y: 6 + j * c, width: c - 1, height: c - 1, rx: 2, class: k < p ? "tile fill-a" : "tile empty" }, svg);
    }
    // dvojna premica: odstotki zgoraj, vrednosti spodaj
    const X = (v) => 20 + v * 3;
    s("line", { x1: X(0), y1: 200, x2: X(100), y2: 200, class: "axis" }, svg);
    for (let v = 0; v <= 100; v += 10) {
      s("line", { x1: X(v), y1: 194, x2: X(v), y2: 206, class: "axis" }, svg);
      if (v % 20 === 0) {
        s("text", { x: X(v), y: 188, class: "tick", "text-anchor": "middle" }, svg, `${v} %`);
        s("text", { x: X(v), y: 222, class: "tick", "text-anchor": "middle" }, svg, fmt((G * v) / 100, 1));
      }
    }
    s("line", { x1: X(0), y1: 200, x2: X(p), y2: 200, class: "nl-range" }, svg);
    s("circle", { cx: X(p), cy: 200, r: 7, class: "pt fill-a" }, svg);
    const part = (G * p) / 100;
    const newV = G * (1 + change / 100);
    if (change) {
      s("rect", { x: 20, y: 240, width: 300 * Math.min(1, G / Math.max(G, newV)), height: 14, class: "bar fill-b" }, svg);
      s("rect", { x: 20, y: 258, width: 300 * Math.min(1, newV / Math.max(G, newV)), height: 14, class: "bar fill-c" }, svg);
    }
    out.innerHTML = texBlock(`${p}\\,\\%\\text{ od } ${G} = \\frac{${p}}{100}\\cdot ${G} = ${tfmt(part)}`) +
      `<p>Odstotek pomeni »od sto«: ${p} % = ${p}/100 = ${fmt(p / 100, 2)}. Osnova je <b>${G}</b>, delež <b>${fmt(part)}</b>.</p>
       <p>Obratno: če je ${fmt(part)} enako ${p} %, je 1 % enako ${fmt(part / p, 3)}, 100 % pa ${fmt(G)}.</p>` +
      (change ? `<p><span class="dot dot-b"></span> ${G} ${change > 0 ? "povečamo" : "zmanjšamo"} za ${Math.abs(change)} %: ${G} · ${fmt(1 + change / 100, 2)} = <b>${fmt(newV)}</b> <span class="dot dot-c"></span>.</p>` : "");
  };
  layout(el, {
    stage: [svg],
    controls: [
      slider({ label: "odstotek", min: 0, max: 100, value: p, unit: "%", onInput: (v) => ((p = v), draw()) }),
      slider({ label: "osnova", min: 10, max: 500, step: 10, value: G, onInput: (v) => ((G = v), draw()) }),
      slider({ label: "sprememba", min: -50, max: 50, step: 5, value: change, unit: "%", onInput: (v) => ((change = v), draw()) }),
    ],
    out,
    tryText: "Cena 80 € se poveča za 20 %, nato zmanjša za 20 %. Ali je spet 80 €? Preveri z drsnikom.",
  });
  draw();
}

// ------------------------------------------------------------ potence
export function potence(el, { mode = "naravni" } = {}) {
  const svg = svgBox(340, 220);
  const out = readout();
  let a = 2, n = 3;
  const draw = () => {
    svg.replaceChildren();
    const minE = mode === "cela" ? -3 : 0, maxE = mode === "cela" ? 4 : 6;
    const vals = [];
    for (let e = minE; e <= maxE; e++) vals.push([e, a ** e]);
    const maxV = Math.max(...vals.map((v) => Math.abs(v[1])));
    const bw = 300 / vals.length;
    vals.forEach(([e, v], i) => {
      const hh = Math.max(1.5, (Math.abs(v) / maxV) * 160);
      const x = 22 + i * bw;
      s("rect", { x: x + 3, y: 180 - (v >= 0 ? hh : 0), width: bw - 6, height: hh, rx: 3, class: `bar ${e === n ? "fill-a" : e < 0 ? "fill-c" : "fill-b"}` }, svg);
      label(svg, x + bw / 2, 196, `${a}^${e}`.replace("^", "^"), "tick");
      s("text", { x: x + bw / 2, y: 196, class: "tick", "text-anchor": "middle" }, svg);
      if (i) label(svg, x, 210, Math.abs(a) > 1 ? `·${a}` : "", "tick small");
    });
    svg.querySelectorAll("text").forEach((t) => (t.textContent = t.textContent.replace(/\^(-?\d+)/, (m, e) => superscript(e))));
    s("line", { x1: 20, y1: 180, x2: 320, y2: 180, class: "axis" }, svg);
    const val = a ** n;
    const expand = n > 0 ? Array(n).fill(a < 0 ? `(${a})` : a).join("\\cdot ") : n === 0 ? "1" : `\\frac{1}{${Array(-n).fill(a < 0 ? `(${a})` : a).join("\\cdot ")}}`;
    out.innerHTML = texBlock(`${a < 0 ? `(${a})` : a}^{${n}} = ${expand} = ${Number.isInteger(val) ? val : `\\frac{1}{${Math.round(1 / val)}}`}`) +
      `<p>Osnova <b>${a}</b>, eksponent <b>${n}</b>: ${n > 0 ? `osnovo ${n}-krat pomnožimo samo s seboj` : n === 0 ? "vsaka potenca z eksponentom 0 (osnova ni 0) je 1" : `negativni eksponent pomeni obratno vrednost`}.</p>
       <p class="muted">Ko gremo po stolpcih v desno, vsakič množimo z ${a}; v levo delimo z ${a}. Zato je ${a}⁰ = 1 in ${a}⁻¹ = 1/${a}.${a < 0 ? " Pri negativni osnovi je potenca s sodim eksponentom pozitivna, z lihim pa negativna." : ""}</p>`;
  };
  const superscript = (e) => String(e).replace(/-/g, "⁻").replace(/\d/g, (d) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]);
  layout(el, {
    stage: [svg],
    controls: [
      slider({ label: "osnova", min: mode === "cela" ? 2 : -3, max: 5, value: a, onInput: (v) => ((a = v || 1), draw()) }),
      slider({ label: "eksponent", min: mode === "cela" ? -3 : 0, max: mode === "cela" ? 4 : 6, value: n, onInput: (v) => ((n = v), draw()) }),
    ],
    out,
    tryText: mode === "cela" ? "Zakaj je 2⁻³ = 1/8? Pojdi od 2³ v levo in vsakič deli z 2." : "Primerjaj 2⁵ in 5². Kaj je večje? Kaj se zgodi s potencami negativne osnove (−2)?",
  });
  draw();
}

// ------------------------------------------------------------ zapis z desetiškimi potencami
const SCALE = [
  [-10, "premer atoma vodika (približno 0,1 nm)"], [-9, "debelina molekule DNK (2 nm)"], [-7, "virus gripe"], [-6, "bakterija"], [-5, "rdeča krvnička (7 µm)"], [-4, "debelina lasu (0,08 mm)"],
  [-3, "mravlja (milimetri)"], [-2, "širina prsta"], [-1, "dlan"], [0, "človek (1,7 m)"], [1, "hiša"], [2, "nogometno igrišče (105 m)"], [3, "Triglav (2864 m)"], [4, "Mount Everest (8849 m)"], [5, "Slovenija (približno 250 km)"],
  [6, "premer Lune (3474 km)"], [7, "premer Zemlje (12 742 km)"], [8, "razdalja Zemlja–Luna (384 400 km)"], [9, "premer Sonca (1,39 milijona km)"], [11, "razdalja Zemlja–Sonce (150 milijonov km)"], [16, "svetlobno leto (9,46 · 10¹⁵ m)"], [21, "premer naše Galaksije"],
];
export function znanstveni(el) {
  const svg = svgBox(340, 110);
  const out = readout();
  let m = 3.8, e = 8;
  const draw = () => {
    svg.replaceChildren();
    const X = (v) => 20 + ((v + 10) / 31) * 300;
    s("line", { x1: X(-10), y1: 50, x2: X(21), y2: 50, class: "axis" }, svg);
    for (let v = -10; v <= 21; v++) s("line", { x1: X(v), y1: v % 5 ? 46 : 42, x2: X(v), y2: v % 5 ? 54 : 58, class: "axis" }, svg);
    for (let v = -10; v <= 20; v += 5) label(svg, X(v), 72, `10${String(v).replace(/-/g, "⁻").replace(/\d/g, (d) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[d])}`, "tick");
    const pos = e + Math.log10(m);
    s("circle", { cx: X(pos), cy: 50, r: 7, class: "pt fill-a" }, svg);
    label(svg, X(-10), 96, "manjše", "tick", "start");
    label(svg, X(21), 96, "večje (m)", "tick", "end");
    const near = SCALE.reduce((a, b) => (Math.abs(b[0] - pos) < Math.abs(a[0] - pos) ? b : a));
    const value = m * 10 ** e;
    let long;
    if (e >= 0) long = Number(value.toPrecision(3)).toLocaleString("sl-SI", { maximumFractionDigits: 0 }).replace(/\./g, " ");
    else long = value.toFixed(-e + 1).replace(".", ",");
    out.innerHTML = texBlock(`${tfmt(m, 1)}\\cdot 10^{${e}}\\ \\mathrm{m}`) +
      `<p>Daljši zapis: <b>${long} m</b>. Eksponent ${e} pove, za koliko mest premaknemo decimalno vejico ${e >= 0 ? "v desno" : "v levo"}.</p>
       <p>Podobna velikost: <b>${near[1]}</b>.</p>
       <p class="muted">Pravilen zapis: prvo število (mantisa) je med 1 in 10. Na premici je vsaka oznaka 10-krat večja od prejšnje.</p>`;
  };
  layout(el, {
    stage: [svg],
    controls: [slider({ label: "mantisa", min: 1, max: 9.9, step: 0.1, value: m, onInput: (v) => ((m = v), draw()) }), slider({ label: "eksponent", min: -10, max: 21, value: e, onInput: (v) => ((e = v), draw()) })],
    out,
    tryText: "Kolikokrat je Zemlja večja od človeka? Odštej eksponenta. Zapiši debelino lasu v obliki a · 10ⁿ.",
  });
  draw();
}

// ------------------------------------------------------------ kvadratni koren
export function koren(el) {
  const svg = svgBox(340, 250);
  const out = readout();
  let A = 20, steps = 0;
  const draw = () => {
    svg.replaceChildren();
    const r = Math.sqrt(A), lo = Math.floor(r), hi = lo + 1, sc = 150 / 15;
    s("rect", { x: 20, y: 200 - hi * sc, width: hi * sc, height: hi * sc, class: "sq sq-b" }, svg);
    s("rect", { x: 20, y: 200 - r * sc, width: r * sc, height: r * sc, class: "sq sq-a" }, svg);
    s("rect", { x: 20, y: 200 - lo * sc, width: lo * sc, height: lo * sc, class: "sq sq-c" }, svg);
    // pod majhnim kvadratom napis ne sme čez levi rob (≈ 6 px na znak)
    const stTxt = `stranica √${A} ${Number.isInteger(r) ? "=" : "≈"} ${fmt(r, 3)}`;
    label(svg, Math.max(20 + (r * sc) / 2, 4 + stTxt.length * 3), 214, stTxt, "tick");
    // približevanje na premici
    let a = lo, b = hi;
    const rows = [];
    // pri popolnem kvadratu ni kaj približevati (sicer »4² = 16 < 16«)
    for (let i = 0; i < (Number.isInteger(r) ? 0 : steps); i++) {
      const step = 10 ** -(i + 1);
      let x = a;
      while ((x + step) ** 2 <= A + 1e-12) x += step;
      a = Number(x.toFixed(i + 1));
      b = Number((x + step).toFixed(i + 1));
      rows.push(`${fmt(a, i + 1)}² = ${fmt(a * a, 2 * i + 2)} < ${A} < ${fmt(b * b, 2 * i + 2)} = ${fmt(b, i + 1)}²`);
    }
    const X = (v) => 185 + ((v - lo) / 1) * 140;
    s("line", { x1: 180, y1: 120, x2: 330, y2: 120, class: "axis" }, svg);
    for (let k = 0; k <= 10; k++) s("line", { x1: X(lo + k / 10), y1: k % 5 ? 116 : 112, x2: X(lo + k / 10), y2: k % 5 ? 124 : 128, class: "axis" }, svg);
    label(svg, X(lo), 140, String(lo), "tick");
    label(svg, X(hi), 140, String(hi), "tick");
    s("line", { x1: X(a), y1: 106, x2: X(b), y2: 106, class: "nl-range" }, svg);
    s("circle", { cx: X(r), cy: 120, r: 6, class: "pt fill-a" }, svg);
    out.innerHTML = `<p>Kvadrat s ploščino <b>${A}</b> ima stranico ${tex(`\\sqrt{${A}}`)}. ${Number.isInteger(r) ? `${A} je popoln kvadrat: ${tex(`\\sqrt{${A}} = ${r}`)}, ker je ${r}² = ${A}.` : `Leži med kvadratoma ${lo}² = ${lo * lo} in ${hi}² = ${hi * hi}, zato je ${lo} < √${A} < ${hi}.`}</p>
      ${rows.length ? `<p>${rows.join("<br>")}</p>` : ""}
      <p class="muted">${Number.isInteger(r) ? "" : "Z vsakim korakom dobimo eno decimalko več. Decimalke se nikoli ne končajo in ne ponavljajo: √" + A + " je iracionalno število."}</p>`;
  };
  layout(el, {
    stage: [svg],
    controls: [slider({ label: "ploščina", min: 1, max: 200, value: A, onInput: (v) => ((A = v), (steps = 0), draw()) }), buttons(button("Približaj (+1 decimalka)", () => ((steps = Math.min(4, steps + 1)), draw()), "primary small"))],
    out,
    tryText: "Brez računala oceni √50: med katerima celima številoma je? Nato pritiskaj »Približaj«.",
  });
  draw();
}

// ------------------------------------------------------------ realna števila (razvrščanje)
const NUMS = [
  ["7", 7, "N"], ["0", 0, "Z"], ["−3", -3, "Z"], ["2/3", 2 / 3, "Q", "0,666… (periodično)"], ["0,25", 0.25, "Q", "končno decimalno število"], ["−1,5", -1.5, "Q", "končno decimalno število"],
  ["√9", 3, "N", "√9 = 3"], ["√2", Math.SQRT2, "R", "1,41421356… (ne konča se in se ne ponavlja)"], ["π", Math.PI, "R", "3,14159265…"], ["−√5", -Math.sqrt(5), "R", "−2,236…"], ["0,1010010001…", 0.101001, "R", "vzorec se spreminja, ni periode"],
];
export function realna(el) {
  const svg = svgBox(340, 250);
  const out = readout();
  let pick = 3;
  const draw = () => {
    svg.replaceChildren();
    const [name, v, set, note] = NUMS[pick];
    const sets = [["R", "R  realna", 10, 10, 320, 150], ["Q", "Q  racionalna", 22, 34, 200, 122], ["Z", "Z  cela", 34, 58, 130, 94], ["N", "N  naravna", 46, 82, 70, 66]];
    const order = ["N", "Z", "Q", "R"];
    sets.forEach(([k, t, x, y, w, hh]) => {
      const inside = order.indexOf(set) <= order.indexOf(k);
      s("rect", { x, y, width: w, height: hh, rx: 14, class: `set ${inside ? "on" : ""}` }, svg);
      s("text", { x: x + 8, y: y + 16, class: "tick b" }, svg, t);
    });
    s("text", { x: 240, y: 60, class: "tick" }, svg, "iracionalna");
    const spot = { N: [80, 120], Z: [150, 120], Q: [196, 100], R: [280, 100] }[set];
    s("circle", { cx: spot[0], cy: spot[1], r: 16, class: "pt fill-a" }, svg);
    label(svg, spot[0], spot[1] + 1, name.length > 4 ? "•" : name, "node-lbl");
    const X = (x) => 20 + ((x + 4) / 8) * 300;
    s("line", { x1: 20, y1: 210, x2: 320, y2: 210, class: "axis" }, svg);
    for (let i = -4; i <= 4; i++) { s("line", { x1: X(i), y1: 204, x2: X(i), y2: 216, class: "axis" }, svg); label(svg, X(i), 232, fmt(i), "tick"); }
    s("circle", { cx: X(v), cy: 210, r: 7, class: "pt fill-a" }, svg);
    const names = { N: "naravno", Z: "celo, ni pa naravno", Q: "racionalno, ni pa celo", R: "iracionalno (realno, ni pa racionalno)" };
    out.innerHTML = `<p><b>${name}</b> je ${names[set]} število${note ? ` (${note})` : ""}.</p>
      <p class="muted">Vsako naravno število je tudi celo, vsako celo je racionalno, vsako racionalno je realno. Racionalna števila lahko zapišemo kot ulomek; njihov decimalni zapis je končen ali periodičen. Iracionalnih ne moremo zapisati kot ulomek. Vsa realna števila skupaj zapolnijo številsko premico.</p>`;
  };
  const chips = h("div", { class: "demo-chips" }, NUMS.map(([n], i) => button(n, () => ((pick = i), draw()), "chip-btn")));
  layout(el, { stage: [svg], extra: chips, out, tryText: "Kam spada √9? Kam √8? Ali je 0,333… racionalno število?" });
  draw();
}

// ------------------------------------------------------------ množice (Vennov diagram)
const PROPS = {
  sodo: ["soda števila", (n) => n % 2 === 0],
  liho: ["liha števila", (n) => n % 2 === 1],
  tri: ["deljiva s 3", (n) => n % 3 === 0],
  pet: ["deljiva s 5", (n) => n % 5 === 0],
  pra: ["praštevila", (n) => primeFactors(n).length === 1],
  manj: ["manjša od 8", (n) => n < 8],
  kv: ["popolni kvadrati", (n) => Number.isInteger(Math.sqrt(n))],
};
export function venn(el) {
  const svg = svgBox(340, 230);
  const out = readout();
  let pa = "sodo", pb = "tri", op = "∩";
  const draw = () => {
    svg.replaceChildren();
    const U = Array.from({ length: 20 }, (_, i) => i + 1);
    const inA = PROPS[pa][1], inB = PROPS[pb][1];
    const res = U.filter((n) => (op === "∪" ? inA(n) || inB(n) : op === "∩" ? inA(n) && inB(n) : op === "A∖B" ? inA(n) && !inB(n) : op === "B∖A" ? inB(n) && !inA(n) : !inA(n)));
    s("rect", { x: 4, y: 4, width: 332, height: 222, rx: 12, class: `set ${op === "A'" ? "" : ""}` }, svg);
    s("text", { x: 14, y: 22, class: "tick b" }, svg, "U = {1, 2, …, 20}");
    s("circle", { cx: 130, cy: 120, r: 82, class: "venn fill-a" }, svg);
    s("circle", { cx: 212, cy: 120, r: 82, class: "venn fill-b" }, svg);
    label(svg, 80, 30, "A", "venn-title");
    label(svg, 262, 30, "B", "venn-title");
    const zones = { a: [], ab: [], b: [], o: [] };
    U.forEach((n) => zones[inA(n) && inB(n) ? "ab" : inA(n) ? "a" : inB(n) ? "b" : "o"].push(n));
    const place = (list, cx, cy, cols, dx = 24) => list.forEach((n, i) => {
      const x = cx + ((i % cols) - (cols - 1) / 2) * dx, y = cy + Math.floor(i / cols) * 20 - Math.floor((list.length - 1) / cols) * 10;
      const t = label(svg, x, y, String(n), res.includes(n) ? "venn-num on" : "venn-num");
      if (res.includes(n)) s("circle", { cx: x, cy: y, r: 10, class: "venn-hit" }, svg).after(t);
    });
    place(zones.a, 88, 120, 3);
    place(zones.ab, 171, 120, 2, 22);
    place(zones.b, 254, 120, 3);
    zones.o.forEach((n, i) => {
      const x = 20 + (i % 15) * 21, y = 212;
      const t = label(svg, x, y, String(n), res.includes(n) ? "venn-num on" : "venn-num");
      if (res.includes(n)) s("circle", { cx: x, cy: y, r: 10, class: "venn-hit" }, svg).after(t);
    });
    const opName = { "∪": "unija (v A ali v B)", "∩": "presek (v A in v B hkrati)", "A∖B": "razlika (v A, ne pa v B)", "B∖A": "razlika (v B, ne pa v A)", "A'": "komplement (v U, ne pa v A)" }[op];
    out.innerHTML = `<p>A = ${PROPS[pa][0]}, B = ${PROPS[pb][0]}.</p>
      <p><b>${op === "A'" ? "A'" : op.length > 1 ? op : `A ${op} B`}</b>, ${opName}: {${res.join(", ") || " "}}, moč množice je ${res.length}.</p>
      <p class="muted">Preveri: |A ∪ B| = |A| + |B| − |A ∩ B| = ${zones.a.length + zones.ab.length} + ${zones.b.length + zones.ab.length} − ${zones.ab.length} = ${zones.a.length + zones.b.length + zones.ab.length}.</p>`;
  };
  const opts = Object.entries(PROPS).map(([k, v]) => [k, v[0]]);
  layout(el, {
    stage: [svg],
    controls: [
      select({ label: "A", options: opts, value: pa, onChange: (v) => ((pa = v), draw()) }),
      select({ label: "B", options: opts, value: pb, onChange: (v) => ((pb = v), draw()) }),
      segmented({ options: ["∪", "∩", "A∖B", "B∖A", "A'"], value: op, onChange: (v) => ((op = v), draw()) }),
    ],
    out,
    tryText: "Izberi A = soda, B = liha. Kaj je A ∩ B? Kaj je A ∪ B? Kdaj je A ∖ B = A?",
  });
  draw();
}

// ------------------------------------------------------------ pretvarjanje enot (stopnice)
const UNIT_SETS = {
  dolzina: { name: "dolžina", units: ["km", "hm", "dam", "m", "dm", "cm", "mm"], f: 10, v: 2.5, from: "m", to: "cm" },
  ploscina: { name: "ploščina", units: ["km²", "ha", "a", "m²", "dm²", "cm²", "mm²"], f: 100, v: 3.2, from: "m²", to: "dm²" },
  prostornina: { name: "prostornina", units: ["m³", "dm³ = L", "cm³ = mL", "mm³"], f: 1000, v: 1.5, from: "dm³ = L", to: "cm³ = mL" },
  masa: { name: "masa", units: ["t", "100 kg", "10 kg", "kg", "dag", "g"], f: 10, v: 0.75, from: "kg", to: "dag", extra: "1 kg = 100 dag = 1000 g; 1 g = 1000 mg" },
  cas: { name: "čas", units: ["dan", "h", "min", "s"], factors: [24, 60, 60], v: 1.5, from: "h", to: "min" },
  predpone: { name: "predpone (fizika)", units: ["G (giga)", "M (mega)", "k (kilo)", "osnovna enota", "m (mili)", "µ (mikro)", "n (nano)"], f: 1000, v: 4.2, from: "k (kilo)", to: "osnovna enota" },
};
export function enote(el, { set = "dolzina", sets } = {}) {
  const svg = svgBox(340, 200);
  const out = readout();
  const avail = sets || Object.keys(UNIT_SETS);
  let S, v, from, to;
  const ctl = h("div", { class: "demo-controls" });
  const init = (k) => {
    S = UNIT_SETS[k];
    v = S.v;
    from = S.units.indexOf(S.from);
    to = S.units.indexOf(S.to);
    ctl.replaceChildren(
      ...(avail.length > 1 ? [select({ label: "količina", options: avail.map((x) => [x, UNIT_SETS[x].name]), value: k, onChange: init })] : []),
      slider({ label: "vrednost", min: 0.05, max: 10, step: 0.05, value: v, onInput: (x) => ((v = x), draw()) }),
      select({ label: "iz enote", options: S.units.map((u, i) => [i, u]), value: from, onChange: (x) => ((from = Number(x)), draw()) }),
      select({ label: "v enoto", options: S.units.map((u, i) => [i, u]), value: to, onChange: (x) => ((to = Number(x)), draw()) }),
    );
    draw();
  };
  const factor = (i) => (S.factors ? S.factors[i] : S.f);
  const draw = () => {
    svg.replaceChildren();
    const n = S.units.length, sw = 300 / n, sh = 140 / n;
    S.units.forEach((u, i) => {
      const x = 20 + i * sw, y = 20 + i * sh;
      const on = i >= Math.min(from, to) && i <= Math.max(from, to);
      s("rect", { x, y, width: sw - 3, height: 24, rx: 6, class: `step ${i === from ? "fill-a" : i === to ? "fill-b" : on ? "fill-soft" : "empty"}` }, svg);
      label(svg, x + sw / 2 - 1, y + 12, u.split(" ")[0], "lbl small");
      if (i < n - 1) label(svg, x + sw - 2, y + 34, `·${factor(i)}`, "tick small");
    });
    let mult = 1;
    const lo = Math.min(from, to), hi = Math.max(from, to);
    for (let i = lo; i < hi; i++) mult *= factor(i);
    const res = to > from ? v * mult : v / mult;
    const str = (x) => (Math.abs(x) >= 1e-4 && Math.abs(x) < 1e9 ? fmt(x, 6) : x.toExponential(2).replace(".", ","));
    out.innerHTML = `<div class="demo-eq">${str(v)} ${S.units[from]} = <b>${str(res)} ${S.units[to]}</b></div>
      <p>${from === to ? "Enoti sta enaki." : to > from ? `Gremo po stopnicah navzdol (v manjšo enoto) za ${hi - lo} ${hi - lo === 1 ? "stopnico" : hi - lo === 2 ? "stopnici" : hi - lo < 5 ? "stopnice" : "stopnic"}: <b>množimo</b> z ${mult}. Manjših enot je več.` : `Gremo po stopnicah navzgor (v večjo enoto): <b>delimo</b> z ${mult}. Večjih enot je manj.`}</p>
      <p class="muted">${S.factors ? "Pri času faktorji niso 10: 1 dan = 24 h, 1 h = 60 min, 1 min = 60 s." : `Vsaka stopnica pomeni faktor ${S.f}${S.f === 100 ? " (ploščinske enote: 10 · 10)" : S.f === 1000 && S.name === "prostornina" ? " (prostorninske enote: 10 · 10 · 10)" : ""}.`} ${S.extra || ""}</p>`;
  };
  layout(el, { stage: [svg], controls: ctl, out, tryText: "Koliko cm² je 1 m²? Zakaj ni 100? Nariši si kvadrat 1 m × 1 m in ga razdeli na kvadratke po 1 dm." });
  init(set);
}

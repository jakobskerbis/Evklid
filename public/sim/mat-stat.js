// Simulacije: prikazi podatkov, srednje vrednosti, statistika, verjetnost, kombinatorika.
import { h, s, svgBox, slider, select, segmented, toggle, button, buttons, readout, layout, tex, texBlock, fmt, tfmt, clamp, label, arrow, draggable, svgPoint, rint, rad } from "./kit.js";

const COLORS = ["a", "b", "c", "accent", "muted"];

// ------------------------------------------------------------ prikazi podatkov
export function diagram(el, { type = "stolpcni" } = {}) {
  const svg = svgBox(340, 260);
  const out = readout();
  const cats = [["jabolko", 7], ["banana", 4], ["hruška", 2], ["grozdje", 5], ["jagoda", 6]];
  const editor = h("div", { class: "data-editor" });
  const draw = () => {
    svg.replaceChildren();
    const total = cats.reduce((a, c) => a + c[1], 0) || 1;
    const max = Math.max(1, ...cats.map((c) => c[1]));
    if (type === "tortni") {
      const C = [130, 130], R = 105;
      let a0 = -90;
      cats.forEach(([name, v], i) => {
        const ang = (360 * v) / total;
        if (v) {
          const p = (a) => `${C[0] + R * Math.cos(rad(a))},${C[1] + R * Math.sin(rad(a))}`;
          const d = ang >= 359.99 ? `M${C[0]},${C[1] - R} A${R},${R} 0 1 1 ${C[0] - 0.01},${C[1] - R} Z` : `M${C[0]},${C[1]} L${p(a0)} A${R},${R} 0 ${ang > 180 ? 1 : 0} 1 ${p(a0 + ang)} Z`;
          s("path", { d, class: `pie-slice fill-${COLORS[i]}` }, svg);
          const m = a0 + ang / 2;
          if (ang > 18) label(svg, C[0] + R * 0.62 * Math.cos(rad(m)), C[1] + R * 0.62 * Math.sin(rad(m)), `${Math.round(ang)}°`, "lbl small");
        }
        a0 += ang;
        s("rect", { x: 250, y: 40 + i * 24, width: 14, height: 14, rx: 3, class: `fill-${COLORS[i]}` }, svg);
        s("text", { x: 270, y: 52 + i * 24, class: "tick b" }, svg, name);
      });
    } else {
      const L = 34, B = 220, W = 300, H = 190;
      const step = max > 10 ? 2 : 1;
      for (let v = 0; v <= max; v += step) {
        const y = B - (v / max) * H;
        s("line", { x1: L, y1: y, x2: L + W - 10, y2: y, class: "grid" }, svg);
        s("text", { x: L - 6, y: y + 4, class: "tick", "text-anchor": "end" }, svg, String(v));
      }
      const bw = (W - 20) / cats.length;
      const pts = [];
      cats.forEach(([name, v], i) => {
        const x = L + 10 + i * bw, hh = (v / max) * H;
        if (type === "stolpcni") s("rect", { x: x + 6, y: B - hh, width: bw - 12, height: hh, rx: 4, class: `bar fill-${COLORS[i]}` }, svg);
        if (type === "figurni") for (let k = 0; k < v; k++) s("circle", { cx: x + bw / 2, cy: B - (k + 0.5) * (H / max), r: Math.min(bw / 3, H / max / 2.4), class: `fill-${COLORS[i]}` }, svg);
        pts.push([x + bw / 2, B - hh]);
        label(svg, x + bw / 2, B + 14, name, "tick");
        if (type !== "figurni") label(svg, x + bw / 2, B - hh - 9, String(v), "lbl small");
      });
      if (type === "crtni") {
        s("polyline", { points: pts.map((p) => p.join(",")).join(" "), class: "graph-line" }, svg);
        pts.forEach((p) => s("circle", { cx: p[0], cy: p[1], r: 5, class: "pt fill-accent" }, svg));
      }
      s("line", { x1: L, y1: B, x2: L + W - 10, y2: B, class: "axis" }, svg);
      s("line", { x1: L, y1: B, x2: L, y2: B - H - 8, class: "axis" }, svg);
    }
    const top = cats.reduce((a, c) => (c[1] > a[1] ? c : a));
    out.innerHTML = `<p>Skupaj ${total} glasov. Največ: <b>${top[0]}</b> (${top[1]}, to je ${fmt((100 * top[1]) / total, 1)} %).</p>` +
      (type === "tortni"
        ? `<p>V tortnem prikazu je cel krog 360° = vsi podatki. Kot izseka: ${tex(`\\frac{\\text{število}}{\\text{vsota}}\\cdot 360^\\circ`)}, npr. ${top[0]}: ${top[1]}/${total} · 360° = ${fmt((360 * top[1]) / total, 1)}°.</p>`
        : type === "crtni"
          ? `<p class="muted">Črtni prikaz je primeren, ko se podatki spreminjajo s časom. Pri kategorijah (sadje) je bolj smiseln stolpčni prikaz.</p>`
          : `<p class="muted">Višina stolpca je sorazmerna s številom. Os mora začeti pri 0, sicer so razlike videti večje, kot so.</p>`);
    editor.replaceChildren(...cats.map((c, i) => h("div", { class: "data-row" }, h("span", { class: `dot dot-${COLORS[i]}`, style: COLORS[i].length > 1 ? `background:var(--${COLORS[i]})` : "" }), h("span", {}, c[0]), button("−", () => ((c[1] = Math.max(0, c[1] - 1)), draw())), h("b", {}, String(c[1])), button("+", () => ((c[1] = Math.min(20, c[1] + 1)), draw())))));
  };
  layout(el, {
    stage: [h("div", { class: "demo-seg-wrap" }, segmented({ options: [["stolpcni", "Stolpčni"], ["figurni", "Figurni"], ["crtni", "Črtni"], ["tortni", "Tortni"]], value: type, onChange: (v) => ((type = v), draw()) })), svg],
    extra: editor,
    out,
    tryText: "Isti podatki v štirih prikazih. Iz katerega najhitreje vidiš, kaj je najbolj priljubljeno? Iz katerega delež celote?",
  });
  draw();
}

// ------------------------------------------------------------ srednje vrednosti (pike na premici)
export function sredina(el, { mode = "sredina" } = {}) {
  const svg = svgBox(340, 200);
  const out = readout();
  let data = [2, 3, 3, 5, 6, 8, 9];
  const X = (v) => 20 + (v / 10) * 300;
  const draw = () => {
    svg.replaceChildren();
    s("line", { x1: 15, y1: 150, x2: 325, y2: 150, class: "axis" }, svg);
    for (let i = 0; i <= 10; i++) {
      s("line", { x1: X(i), y1: 146, x2: X(i), y2: 154, class: "axis" }, svg);
      label(svg, X(i), 168, String(i), "tick");
    }
    const sorted = [...data].sort((a, b) => a - b);
    const n = data.length, mean = data.reduce((a, b) => a + b, 0) / n;
    const med = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
    const freq = {};
    data.forEach((v) => (freq[v] = (freq[v] || 0) + 1));
    const maxF = Math.max(...Object.values(freq));
    const modes = Object.keys(freq).filter((k) => freq[k] === maxF).map(Number);
    // tehtnica: prečka in podpora v sredini
    s("path", { d: `M${X(mean)},152 l-10,18 h20 z`, class: "fill-c" }, svg);
    const stack = {};
    data.forEach((v, i) => {
      const k = (stack[v] = (stack[v] || 0) + 1);
      const c = s("circle", { cx: X(v), cy: 150 - 12 * k + 2, r: 9, class: "pt fill-a data-dot" }, svg);
      c.style.cursor = "grab";
      draggable(svg, c, (x) => {
        data[i] = clamp(Math.round(((x - 20) / 300) * 10), 0, 10);
        draw();
      });
    });
    if (mode !== "sredina") {
      s("line", { x1: X(med), y1: 30, x2: X(med), y2: 150, class: "guide solid stroke-b" }, svg);
      label(svg, X(med), 22, "mediana", "tick b");
    }
    label(svg, X(mean), 188, `x̄ = ${fmt(mean, 2)}`, "lbl small");
    const dev = data.map((v) => v - mean);
    out.innerHTML = `<p><b>Aritmetična sredina</b> ${tex(`\\bar x = \\frac{${data.join(" + ")}}{${n}} = ${tfmt(mean)}`)}. Na tej točki je »tehtnica« v ravnovesju: vsota odmikov levo je enaka vsoti odmikov desno (${fmt(dev.filter((d) => d < 0).reduce((a, b) => a + b, 0), 2)} in ${fmt(dev.filter((d) => d > 0).reduce((a, b) => a + b, 0), 2)}).</p>` +
      (mode !== "sredina"
        ? `<p><b>Mediana</b> (srednji podatek po velikosti): ${fmt(med, 1)}. <b>Modus</b> (najpogostejši): ${modes.join(", ")}${maxF === 1 ? " (vsi so enako pogosti)" : ""}. <b>Variacijski razmik</b>: ${sorted[n - 1]} − ${sorted[0]} = ${sorted[n - 1] - sorted[0]}.</p>
           <p class="muted">Povleci eno piko na 10 (izstopajoči podatek): sredina se premakne, mediana skoraj ne.</p>`
        : `<p class="muted">Povleci pike. Ko eno premakneš desno, se sredina premakne za 1/${n} te razdalje.</p>`);
  };
  layout(el, {
    stage: [svg],
    controls: [buttons(button("Dodaj podatek", () => { if (data.length < 14) data.push(rint(0, 10)); draw(); }), button("Odstrani podatek", () => { if (data.length > 2) data.pop(); draw(); }), button("Naključni podatki", () => { data = Array.from({ length: rint(5, 11) }, () => rint(1, 9)); draw(); }))],
    out,
    tryText: "Ali lahko postaviš pike tako, da je sredina 5, a nobena pika ni na 5?",
  });
  draw();
}

// ------------------------------------------------------------ statistika: histogram, škatla z brki
function randn() {
  let u = 0, v = 0;
  while (!u) u = Math.random();
  while (!v) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
const quant = (sorted, p) => {
  const i = (sorted.length - 1) * p, lo = Math.floor(i), hi = Math.ceil(i);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (i - lo);
};
export function statistika(el) {
  const svg = svgBox(340, 280);
  const out = readout();
  let n = 40, mu = 170, sd = 8, classes = 8, data = [];
  const gen = () => (data = Array.from({ length: n }, () => Math.round(mu + sd * randn())));
  const draw = () => {
    svg.replaceChildren();
    const sorted = [...data].sort((a, b) => a - b);
    const mean = data.reduce((a, b) => a + b, 0) / n, sdv = Math.sqrt(data.reduce((a, b) => a + (b - mean) ** 2, 0) / n);
    // os sledi podatkom (in pasu x̄ ± σ), da noben podatek ni stisnjen v robni razred in brki ne segajo čez os
    const lo = Math.floor(Math.min(sorted[0], mean - sdv, 140) / 10) * 10, hi = Math.ceil(Math.max(sorted[n - 1], mean + sdv, 200) / 10) * 10;
    const L = 30, R = 330, Bh = 180, Hh = 150, tickStep = hi - lo > 80 ? 20 : 10;
    const X = (v) => L + ((v - lo) / (hi - lo)) * (R - L);
    const w = (hi - lo) / classes;
    const counts = Array(classes).fill(0);
    data.forEach((v) => counts[clamp(Math.floor((v - lo) / w), 0, classes - 1)]++);
    const maxC = Math.max(1, ...counts);
    counts.forEach((c, i) => s("rect", { x: X(lo + i * w) + 1, y: Bh - (c / maxC) * Hh, width: X(lo + w) - X(lo) - 2, height: (c / maxC) * Hh, class: "bar fill-b" }, svg));
    s("line", { x1: L, y1: Bh, x2: R, y2: Bh, class: "axis" }, svg);
    for (let v = Math.ceil(lo / tickStep) * tickStep; v <= hi; v += tickStep) label(svg, X(v), Bh + 13, String(v), "tick");
    s("line", { x1: X(mean), y1: 20, x2: X(mean), y2: Bh, class: "guide solid stroke-c" }, svg);
    s("rect", { x: X(mean - sdv), y: 14, width: X(mean + sdv) - X(mean - sdv), height: 6, rx: 3, class: "fill-c", opacity: 0.5 }, svg);
    // škatla z brki
    const q1 = quant(sorted, 0.25), q2 = quant(sorted, 0.5), q3 = quant(sorted, 0.75);
    const y = 230;
    s("line", { x1: X(sorted[0]), y1: y, x2: X(q1), y2: y, class: "axis" }, svg);
    s("line", { x1: X(q3), y1: y, x2: X(sorted[n - 1]), y2: y, class: "axis" }, svg);
    s("rect", { x: X(q1), y: y - 14, width: X(q3) - X(q1), height: 28, class: "shape fill-a" }, svg);
    s("line", { x1: X(q2), y1: y - 14, x2: X(q2), y2: y + 14, class: "axis" }, svg);
    [sorted[0], sorted[n - 1]].forEach((v) => s("line", { x1: X(v), y1: y - 8, x2: X(v), y2: y + 8, class: "axis" }, svg));
    // pri ozki škatli (majhen σ) oznake razmaknemo, da se ne prekrivajo
    label(svg, Math.min(X(q1), X(q2) - 20), y + 26, "Q₁", "tick");
    label(svg, X(q2), y + 26, "Me", "tick");
    label(svg, Math.max(X(q3), X(q2) + 20), y + 26, "Q₃", "tick");
    out.innerHTML = `<p>Višine ${n} dijakov (cm). <span class="dot dot-c"></span> Aritmetična sredina ${tex(`\\bar x = ${tfmt(mean, 1)}`)}, standardni odklon ${tex(`\\sigma = ${tfmt(sdv, 1)}`)} (pas zgoraj: ${tex("\\bar x \\pm \\sigma")}).</p>
      <p>Škatla z brki: min ${sorted[0]}, Q₁ = ${fmt(q1, 1)}, mediana ${fmt(q2, 1)}, Q₃ = ${fmt(q3, 1)}, max ${sorted[n - 1]}. Medkvartilni razmik ${fmt(q3 - q1, 1)}: v škatli je srednja polovica podatkov.</p>
      <p class="muted">Večji σ pomeni bolj razpršene podatke (širši histogram in daljša škatla). Število razredov spremeni videz histograma, ne pa podatkov.</p>`;
  };
  gen();
  layout(el, {
    stage: [svg],
    controls: [
      slider({ label: "število podatkov", min: 10, max: 300, step: 10, value: n, onInput: (v) => ((n = v), gen(), draw()) }),
      slider({ label: "povprečje", min: 155, max: 185, value: mu, unit: "cm", onInput: (v) => ((mu = v), gen(), draw()) }),
      slider({ label: "razpršenost", min: 2, max: 14, value: sd, unit: "cm", onInput: (v) => ((sd = v), gen(), draw()) }),
      slider({ label: "razredi", min: 3, max: 20, value: classes, onInput: (v) => ((classes = v), draw()) }),
      buttons(button("Novi podatki", () => (gen(), draw()))),
    ],
    out,
    tryText: "Povečaj število podatkov na 300. Kakšne oblike je histogram? Kje leži mediana v primerjavi s sredino?",
  });
  draw();
}

// ------------------------------------------------------------ verjetnost s poskusi
const EXPERIMENTS = {
  kovanec: { name: "met kovanca", outcomes: ["cifra", "grb"], p: () => [0.5, 0.5] },
  kocka: { name: "met kocke", outcomes: ["1", "2", "3", "4", "5", "6"], p: () => Array(6).fill(1 / 6) },
  dve: { name: "vsota dveh kock", outcomes: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], p: () => [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1].map((k) => k / 36) },
  vreca: { name: "kroglice iz vrečke", outcomes: ["rdeča", "modra", "zelena"], p: (c) => { const t = c[0] + c[1] + c[2] || 1; return c.map((k) => k / t); } },
};
export function verjetnost(el, { exp = "kocka" } = {}) {
  const svg = svgBox(340, 230);
  const out = readout();
  let key = exp, counts = [], total = 0, balls = [3, 2, 1], last = null;
  const reset = () => ((counts = Array(EXPERIMENTS[key].outcomes.length).fill(0)), (total = 0), (last = null));
  const once = () => {
    const P = EXPERIMENTS[key].p(balls);
    let r = Math.random(), i = 0;
    while (i < P.length - 1 && r > P[i]) (r -= P[i]), i++;
    counts[i]++;
    total++;
    last = i;
  };
  const run = (k) => {
    for (let i = 0; i < k; i++) once();
    draw();
  };
  const ballCtl = h("div", { class: "demo-controls" });
  const build = () => {
    reset();
    ballCtl.replaceChildren(...(key === "vreca" ? ["rdeče", "modre", "zelene"].map((n, i) => slider({ label: n, min: 0, max: 8, value: balls[i], onInput: (v) => ((balls[i] = v), reset(), draw()) })) : []));
    draw();
  };
  const draw = () => {
    svg.replaceChildren();
    const E = EXPERIMENTS[key], P = E.p(balls), k = E.outcomes.length;
    const L = 36, B = 190, H = 160, bw = (300 - 10) / k;
    const maxP = Math.max(...P, ...counts.map((c) => (total ? c / total : 0)), 0.05) * 1.15;
    for (let v = 0; v <= maxP; v += maxP > 0.5 ? 0.2 : 0.05) {
      s("line", { x1: L, y1: B - (v / maxP) * H, x2: L + 295, y2: B - (v / maxP) * H, class: "grid" }, svg);
      s("text", { x: L - 4, y: B - (v / maxP) * H + 4, class: "tick", "text-anchor": "end" }, svg, fmt(v, 2));
    }
    E.outcomes.forEach((o, i) => {
      const x = L + 5 + i * bw, f = total ? counts[i] / total : 0;
      s("rect", { x: x + 3, y: B - (f / maxP) * H, width: bw - 6, height: (f / maxP) * H, rx: 3, class: `bar ${i === last ? "fill-a" : "fill-b"}` }, svg);
      s("line", { x1: x + 1, y1: B - (P[i] / maxP) * H, x2: x + bw - 1, y2: B - (P[i] / maxP) * H, class: "theory" }, svg);
      label(svg, x + bw / 2, B + 13, o, "tick");
    });
    s("line", { x1: L, y1: B, x2: L + 295, y2: B, class: "axis" }, svg);
    const best = P.indexOf(Math.max(...P));
    const fmax = total ? Math.max(...counts.map((c, i) => Math.abs(c / total - P[i]))) : 0;
    out.innerHTML = `<p>Poskusov: <b>${total}</b>${last != null ? `, zadnji izid: <b>${E.outcomes[last]}</b>` : ""}. Stolpci so <b>relativne frekvence</b> (kolikokrat se je zgodilo / vsi poskusi), črte so <b>verjetnosti</b>.</p>
      <p>Na primer ${E.outcomes[best]}: verjetnost ${tex(`P = ${tfmt(P[best], 3)}`)}${total ? `, relativna frekvenca ${tfmt(counts[best] / total, 3).replace("{,}", ",")}` : ""}.</p>
      <p class="muted">${total < 50 ? "Pri malo poskusih so odstopanja velika. Naredi 1000 poskusov." : `Največje odstopanje od verjetnosti: ${fmt(fmax, 3)}. Več ko je poskusov, bližje so stolpci črtam (zakon velikih števil).`}${key === "dve" ? " Vsota 7 je najverjetnejša, ker jo da največ parov (6 od 36)." : ""}</p>`;
  };
  layout(el, {
    stage: [svg],
    controls: [
      select({ label: "poskus", options: Object.entries(EXPERIMENTS).map(([k, e]) => [k, e.name]), value: key, onChange: (v) => ((key = v), build()) }),
      ballCtl,
      buttons(button("1 poskus", () => run(1), "primary small"), button("10", () => run(10)), button("100", () => run(100)), button("1000", () => run(1000)), button("Znova", () => (reset(), draw()))),
    ],
    out,
    tryText: "Ugani, koliko šestic boš dobil v 60 metih. Potem preveri. Zakaj pri 10 poskusih ne dobiš vedno točno 1/6?",
  });
  build();
}

// ------------------------------------------------------------ kombinatorika
const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
const choose = (n, k) => (k < 0 || k > n ? 0 : Math.round(fact(n) / (fact(k) * fact(n - k))));
export function kombinatorika(el, { mode = "drevo" } = {}) {
  const svg = svgBox(340, 300);
  const out = readout();
  let a = 3, b = 2, c = 2, n = 4, k = 2, order = true, rep = false, kSl = null;
  const ctl = h("div", { class: "demo-controls" });
  const build = () => {
    ctl.replaceChildren(
      ...(mode === "drevo"
        ? [slider({ label: "majice", min: 1, max: 4, value: a, onInput: (v) => ((a = v), draw()) }), slider({ label: "hlače", min: 1, max: 3, value: b, onInput: (v) => ((b = v), draw()) }), slider({ label: "čevlji", min: 1, max: 3, value: c, onInput: (v) => ((c = v), draw()) })]
        : [slider({ label: "n (vseh)", min: 1, max: 6, value: n, onInput: (v) => ((n = v), (k = Math.min(k, n)), kSl.set(k, true), draw()) }), (kSl = slider({ label: "k (izberemo)", min: 1, max: 6, value: k, onInput: (v) => ((k = v), draw()) })), toggle("vrstni red je pomemben", order, (v) => ((order = v), draw())), toggle("ponavljanje je dovoljeno", rep, (v) => ((rep = v), draw()))]),
    );
    draw();
  };
  const draw = () => {
    svg.replaceChildren();
    if (mode === "drevo") {
      const total = a * b * c, rowH = Math.min(22, 280 / total);
      const X = [20, 120, 220, 300];
      const names = [["rdeča", "modra", "bela", "črna"], ["kavbojke", "trenirka", "kratke"], ["superge", "škornji", "sandali"]];
      let leaf = 0;
      const root = [X[0], 150];
      s("circle", { cx: root[0], cy: root[1], r: 5, class: "pt fill-text" }, svg);
      for (let i = 0; i < a; i++) {
        const yi = 10 + (i + 0.5) * ((b * c) * rowH);
        s("line", { x1: root[0], y1: root[1], x2: X[1], y2: yi, class: "edge" }, svg);
        label(svg, X[1] - 30, yi - 6, names[0][i], "tick");
        for (let j = 0; j < b; j++) {
          const yj = 10 + i * b * c * rowH + (j + 0.5) * c * rowH;
          s("line", { x1: X[1], y1: yi, x2: X[2], y2: yj, class: "edge" }, svg);
          for (let q = 0; q < c; q++) {
            const yq = 10 + (leaf + 0.5) * rowH;
            s("line", { x1: X[2], y1: yj, x2: X[3], y2: yq, class: "edge" }, svg);
            s("circle", { cx: X[3], cy: yq, r: 3.5, class: "pt fill-a" }, svg);
            leaf++;
          }
          if (rowH > 12) label(svg, X[2] - 28, yj - 5, names[1][j], "tick small");
        }
        s("circle", { cx: X[1], cy: yi, r: 5, class: "pt fill-b" }, svg);
      }
      svg.setAttribute("viewBox", `0 0 340 ${Math.max(120, 20 + total * rowH)}`);
      out.innerHTML = texBlock(`${a}\\cdot ${b}\\cdot ${c} = ${total}`) + `<p>Vsaka pot od korena do lista je ena obleka. Na vsaki stopnji se vsaka veja razcepi enako, zato število izidov dobimo z <b>množenjem</b> (pravilo produkta).</p>`;
    } else {
      const letters = "ABCDEF".slice(0, n).split("");
      let count, formula, name;
      if (order && rep) (count = n ** k), (formula = `n^k = ${n}^{${k}}`), (name = "variacije s ponavljanjem");
      else if (order && !rep) (count = k > n ? 0 : fact(n) / fact(n - k)), (formula = k === n ? `P_{${n}} = ${n}!` : `V^{${k}}_{${n}} = \\frac{${n}!}{(${n}-${k})!}`), (name = k === n ? "permutacije" : "variacije brez ponavljanja");
      else if (!order && !rep) (count = choose(n, k)), (formula = `C^{${k}}_{${n}} = \\binom{${n}}{${k}}`), (name = "kombinacije brez ponavljanja");
      else (count = choose(n + k - 1, k)), (formula = `\\binom{n+k-1}{k} = \\binom{${n + k - 1}}{${k}}`), (name = "kombinacije s ponavljanjem");
      const list = [];
      const rec = (prefix, start) => {
        if (list.length > 60) return;
        if (prefix.length === k) return list.push(prefix.join(""));
        letters.forEach((l, i) => {
          if (!rep && prefix.includes(l)) return;
          if (!order && i < start) return;
          rec([...prefix, l], order ? 0 : rep ? i : i + 1);
        });
      };
      rec([], 0);
      const cols = 8;
      list.slice(0, 48).forEach((w, i) => {
        const x = 12 + (i % cols) * 40, y = 20 + Math.floor(i / cols) * 34;
        s("rect", { x, y, width: 36, height: 26, rx: 6, class: "shape fill-soft" }, svg);
        label(svg, x + 18, y + 14, w, "lbl small");
      });
      svg.setAttribute("viewBox", `0 0 340 ${Math.max(60, 30 + Math.ceil(Math.min(48, list.length) / cols) * 34)}`);
      out.innerHTML = texBlock(`${formula} = ${count}`) +
        `<p>Izbiramo ${k} od ${n} črk (${letters.join(", ")}): to so <b>${name}</b>. ${count > 48 ? `Prikazanih je prvih 48 od ${count}.` : ""}</p>
         <p class="muted">${order ? "AB in BA sta različna izida." : "AB in BA sta isti izid, zato je možnosti manj."} ${rep ? "Ista črka se lahko ponovi (AA)." : ""}</p>`;
    }
  };
  layout(el, {
    stage: [h("div", { class: "demo-seg-wrap" }, segmented({ options: [["drevo", "Drevo možnosti"], ["izbor", "Izbiranje"]], value: mode, onChange: (v) => ((mode = v), build()) })), svg],
    controls: ctl,
    out,
    tryText: mode === "drevo" ? "Koliko različnih oblek dobiš s 4 majicami, 3 hlačami in 3 pari čevljev? Kaj se zgodi, ko dodaš en par čevljev?" : "Koliko je različnih dvojic predstavnikov razreda (vrstni red ni pomemben)? Koliko, če izbiraš predsednika in namestnika?",
  });
  build();
}

// Interaktivne demonstracije za učbenik (brez knjižnic, SVG + drsniki).
// Vsaka demonstracija je funkcija (el) => void, ki nariše vse v el.
// Barve jemljemo iz CSS spremenljivk, da delujejo v svetli in temni temi.

import { decVejica, tryIt } from "./sim/kit.js"; // tryIt: »Preizkusi: …« (sim/napis-poskusa.js)

const NS = "http://www.w3.org/2000/svg";

// Število s slovensko decimalno vejico.
export function fmt(x, d = 2) {
  if (!Number.isFinite(x)) return "–";
  const r = Number(x.toFixed(d));
  return String(r).replace(".", ",").replace("-", "−");
}

function h(tag, attrs = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") el.className = v;
    else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v);
  }
  for (const k of kids.flat()) if (k != null) el.append(k);
  return el;
}

function s(tag, attrs = {}, parent) {
  const el = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  if (parent) parent.append(el);
  return el;
}

function svgBox(w, hgt, cls = "") {
  return s("svg", { viewBox: `0 0 ${w} ${hgt}`, class: `demo-svg ${cls}`, role: "img" });
}

// Drsnik z oznako in prikazano vrednostjo.
function slider({ label, min, max, step = 1, value, unit = "", digits = 2, onInput }) {
  const out = h("output");
  const input = h("input", { type: "range", min, max, step, value, "aria-label": label });
  const show = () => (out.textContent = `${fmt(Number(input.value), digits)}${unit ? (unit === "°" ? "" : " ") + unit : ""}`);
  input.addEventListener("input", () => {
    show();
    onInput(Number(input.value));
  });
  show();
  const wrap = h("label", { class: "demo-slider" }, h("span", { class: "demo-slider-label" }, label), input, out);
  wrap.set = (v) => {
    input.value = v;
    show();
    onInput(Number(input.value));
  };
  wrap.get = () => Number(input.value);
  return wrap;
}

function controls(...kids) {
  return h("div", { class: "demo-controls" }, ...kids);
}

// Izmerjene vrednosti kot kartice (napis zgoraj, vrednost spodaj), na telefonu dve v vrsti.
function values(list) {
  return `<div class="demo-values">${list.map(([label, v]) => `<div class="demo-val"><span>${label}</span><b>${v}</b></div>`).join("")}</div>`;
}
function readout() {
  return h("div", { class: "demo-readout", "aria-live": "polite" });
}

// Animacija, ki se ustavi, ko demonstracija ni več na strani.
function animate(el, step) {
  let last = performance.now();
  const tick = (now) => {
    if (!el.isConnected) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    step(dt);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const tex = (t) => (window.katex ? katex.renderToString(decVejica(t), { throwOnError: false }) : t);

// ------------------------------------------------------------ y = kx + n
function linearna(el) {
  const W = 340, R = 6, U = W / (2 * R + 1); // enota v pikslih
  const X = (x) => W / 2 + x * U;
  const Y = (y) => W / 2 - y * U;
  const svg = svgBox(W, W);
  const defs = s("defs", {}, svg);
  const mk = s("marker", { id: "lin-arr", viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse" }, defs);
  s("path", { d: "M0,0 L10,5 L0,10 z", class: "fill-text" }, mk);
  for (let i = -R; i <= R; i++) {
    s("line", { x1: X(i), y1: 0, x2: X(i), y2: W, class: "grid" }, svg);
    s("line", { x1: 0, y1: Y(i), x2: W, y2: Y(i), class: "grid" }, svg);
    if (i && i % 2 === 0) {
      s("text", { x: X(i), y: Y(0) + 14, class: "tick", "text-anchor": "middle" }, svg).textContent = fmt(i);
      s("text", { x: X(0) - 6, y: Y(i) + 4, class: "tick", "text-anchor": "end" }, svg).textContent = fmt(i);
    }
  }
  s("line", { x1: 4, y1: Y(0), x2: W - 4, y2: Y(0), class: "axis", "marker-end": "url(#lin-arr)" }, svg);
  s("line", { x1: X(0), y1: W - 4, x2: X(0), y2: 4, class: "axis", "marker-end": "url(#lin-arr)" }, svg);
  s("text", { x: W - 10, y: Y(0) - 8, class: "axis-label" }, svg).textContent = "x";
  s("text", { x: X(0) + 8, y: 14, class: "axis-label" }, svg).textContent = "y";
  const tri = s("path", { class: "slope-tri", "data-name": "k in n" }, svg);
  const triK = s("text", { class: "slope-label" }, svg);
  const tri1 = s("text", { class: "slope-label" }, svg);
  const line = s("line", { class: "graph-line", "data-name": "Premica" }, svg);
  const pn = s("circle", { r: 6, class: "pt pt-n" }, svg);
  const p0 = s("circle", { r: 6, class: "pt pt-zero", "data-name": "Ničla" }, svg);

  const out = readout();
  let k = 1, n = 1;
  const draw = () => {
    const x1 = -R - 1, x2 = R + 1;
    line.setAttribute("x1", X(x1)); line.setAttribute("y1", Y(k * x1 + n));
    line.setAttribute("x2", X(x2)); line.setAttribute("y2", Y(k * x2 + n));
    pn.setAttribute("cx", X(0)); pn.setAttribute("cy", Y(n));
    tri.setAttribute("d", `M${X(0)},${Y(n)} H${X(1)} V${Y(n + k)}`);
    tri1.setAttribute("x", X(0.5)); tri1.setAttribute("y", Y(n) + (k >= 0 ? 14 : -6)); tri1.textContent = "1";
    triK.setAttribute("x", X(1) + 5); triK.setAttribute("y", Y(n + k / 2) + 4); triK.textContent = `k = ${fmt(k)}`;
    const zero = k !== 0 ? -n / k : null;
    p0.style.display = zero !== null && Math.abs(zero) <= R ? "" : "none";
    if (zero !== null) { p0.setAttribute("cx", X(zero)); p0.setAttribute("cy", Y(0)); }
    const eq = `y = ${k === 0 ? "" : k === 1 ? "x" : k === -1 ? "-x" : fmt(k).replace("−", "-") + "x"}${
      n === 0 ? (k === 0 ? "0" : "") : (k === 0 ? fmt(n).replace("−", "-") : n > 0 ? " + " + fmt(n) : " - " + fmt(-n))
    }`;
    out.innerHTML = `<div class="demo-eq">${tex(eq.replace(/,/g, "{,}"))}</div>
      <ul>
        <li><b>Smerni koeficient</b> k = ${fmt(k)}: ${k > 0 ? "funkcija <b>narašča</b>" : k < 0 ? "funkcija <b>pada</b>" : "funkcija je <b>konstantna</b> (vodoravna premica)"}. Ko se x poveča za 1, se y ${k ? `${k > 0 ? "poveča" : "zmanjša"} za ${fmt(Math.abs(k))}` : "ne spremeni"}.</li>
        <li><b>Začetna vrednost</b> n = ${fmt(n)}: graf seka os y v točki <span class="dot dot-n"></span> (0, ${fmt(n)}).</li>
        <li><b>Ničla</b>: ${zero === null ? (n === 0 ? "vsako število (graf leži na osi x)" : "ni je (graf je vzporeden z osjo x)") : `<span class="dot dot-zero"></span> x = ${fmt(zero)}`}.</li>
      </ul>`;
  };
  el.append(
    h("div", { class: "demo-stage" }, svg),
    controls(
      slider({ label: "k", min: -4, max: 4, step: 0.5, value: k, digits: 1, onInput: (v) => ((k = v), draw()) }),
      slider({ label: "n", min: -5, max: 5, step: 1, value: n, digits: 0, onInput: (v) => ((n = v), draw()) }),
    ),
    out,
    tryIt("kaj se zgodi z grafom, če k spremeniš v negativno število? Kateri k da premico, ki gre skozi (0, 0) in (2, 4)?"),
  );
  draw();
}

// ------------------------------------------------------------ Pitagora
function pitagora(el) {
  const W = 340;
  const svg = svgBox(W, W);
  const g = s("g", {}, svg);
  const out = readout();
  let a = 3, b = 4, grid = true;
  const draw = () => {
    g.replaceChildren();
    // C v izhodišču, kateta a po osi x, kateta b po osi y; kvadrati navzven.
    const minX = -b, maxX = a + b, minY = -a, maxY = a + b;
    const sc = (W - 30) / Math.max(maxX - minX, maxY - minY);
    const ox = (W - (maxX - minX) * sc) / 2 - minX * sc;
    const oy = (W + (maxY - minY) * sc) / 2 + minY * sc;
    const P = ([x, y]) => `${ox + x * sc},${oy - y * sc}`;
    const poly = (pts, cls) => s("polygon", { points: pts.map(P).join(" "), class: cls }, g);
    const C = [0, 0], B = [a, 0], A = [0, b];
    poly([C, B, [a, -a], [0, -a]], "sq sq-a");
    poly([C, A, [-b, b], [-b, 0]], "sq sq-b");
    poly([B, A, [b, b + a], [a + b, a]], "sq sq-c");
    if (grid) {
      const ln = (p, q) => s("line", { x1: P(p).split(",")[0], y1: P(p).split(",")[1], x2: P(q).split(",")[0], y2: P(q).split(",")[1], class: "unit-grid" }, g);
      for (let i = 1; i < a; i++) { ln([i, 0], [i, -a]); ln([0, -i], [a, -i]); }
      for (let i = 1; i < b; i++) { ln([-i, 0], [-i, b]); ln([0, i], [-b, i]); }
      const c = Math.hypot(a, b), u = [-a / c, b / c], nrm = [b / c, a / c];
      for (let i = 1; i < c; i++) {
        ln([B[0] + u[0] * i, B[1] + u[1] * i], [B[0] + u[0] * i + nrm[0] * c, B[1] + u[1] * i + nrm[1] * c]);
        ln([B[0] + nrm[0] * i, B[1] + nrm[1] * i], [A[0] + nrm[0] * i, A[1] + nrm[1] * i]);
      }
    }
    poly([C, B, A], "tri");
    const r = 0.45;
    s("path", { d: `M${P([r, 0])} L${P([r, r])} L${P([0, r])}`, class: "right-angle" }, g);
    const lbl = (p, t, cls) => {
      const [x, y] = P(p).split(",");
      s("text", { x, y, class: `sq-label ${cls}`, "text-anchor": "middle", "dominant-baseline": "middle" }, g).textContent = t;
    };
    lbl([a / 2, -a / 2], `a² = ${fmt(a * a)}`, "la");
    lbl([-b / 2, b / 2], `b² = ${fmt(b * b)}`, "lb");
    lbl([(a + b) / 2, (a + b) / 2], `c² = ${fmt(a * a + b * b)}`, "lc");
    const c = Math.hypot(a, b);
    out.innerHTML = `<div class="demo-eq">${tex(`a^2 + b^2 = c^2`)}</div>
      <p><span class="dot dot-a"></span> ${fmt(a * a)} + <span class="dot dot-b"></span> ${fmt(b * b)} = <span class="dot dot-c"></span> ${fmt(a * a + b * b)}, zato je c = √${fmt(a * a + b * b)} ${Number.isInteger(c) ? "= " + c : "≈ " + fmt(c)}.</p>
      <p class="muted">${Number.isInteger(c) ? "Celoštevilske stranice: to je pitagorejska trojica." : "Hipotenuza ni celo število. Poišči a in b, pri katerih je (namig: 6 in 8, 5 in 12)."}</p>`;
  };
  const chk = h("input", { type: "checkbox", checked: "" });
  chk.addEventListener("change", () => ((grid = chk.checked), draw()));
  el.append(
    h("div", { class: "demo-stage" }, svg),
    controls(
      slider({ label: "kateta a", min: 1, max: 8, step: 1, value: a, digits: 0, onInput: (v) => ((a = v), draw()) }),
      slider({ label: "kateta b", min: 1, max: 8, step: 1, value: b, digits: 0, onInput: (v) => ((b = v), draw()) }),
      h("label", { class: "demo-check" }, chk, " pokaži enotske kvadratke"),
    ),
    out,
    tryIt("napovej, kolikšna je hipotenuza pri katetah 6 in 8, nato preveri. Ali obstaja trikotnik s katetama 1 in 1, kjer je hipotenuza celo število? Zakaj ne?"),
  );
  draw();
}

// ------------------------------------------------------------ ulomki
function gcd(x, y) {
  return y ? gcd(y, x % y) : Math.abs(x);
}
function ulomki(el) {
  const svg = svgBox(340, 200);
  const out = readout();
  let num = 3, den = 4;
  const draw = () => {
    svg.replaceChildren();
    const wholes = Math.max(1, Math.ceil(num / den));
    const r = Math.min(46, 300 / wholes / 2 - 6);
    for (let w = 0; w < wholes; w++) {
      const cx = 170 - ((wholes - 1) * (2 * r + 12)) / 2 + w * (2 * r + 12), cy = 62;
      for (let i = 0; i < den; i++) {
        const filled = w * den + i < num;
        if (den === 1) {
          s("circle", { cx, cy, r, class: filled ? "pie on" : "pie" }, svg);
          continue;
        }
        const a0 = -Math.PI / 2 + (i * 2 * Math.PI) / den, a1 = a0 + (2 * Math.PI) / den;
        const p = (a) => `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
        s("path", { d: `M${cx},${cy} L${p(a0)} A${r},${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${p(a1)} Z`, class: filled ? "pie on" : "pie" }, svg);
      }
    }
    // številska premica
    const max = wholes, x0 = 30, x1 = 310, y = 160, X = (v) => x0 + ((x1 - x0) * v) / max;
    s("line", { x1: x0, y1: y, x2: x1, y2: y, class: "axis" }, svg);
    for (let i = 0; i <= max * den; i++) {
      const major = i % den === 0;
      s("line", { x1: X(i / den), y1: y - (major ? 9 : 5), x2: X(i / den), y2: y + (major ? 9 : 5), class: "axis" }, svg);
      if (major) s("text", { x: X(i / den), y: y + 26, class: "tick", "text-anchor": "middle" }, svg).textContent = i / den;
    }
    s("line", { x1: X(0), y1: y, x2: X(num / den), y2: y, class: "nl-range" }, svg);
    s("circle", { cx: X(num / den), cy: y, r: 7, class: "pt pt-n" }, svg);
    const g = gcd(num, den) || 1;
    const simple = g > 1 && num ? ` = \\frac{${num / g}}{${den / g}}` : "";
    const mixed = num > den && num % den ? ` = ${Math.floor(num / den)}\\tfrac{${num % den}}{${den}}` : "";
    out.innerHTML = `<div class="demo-eq">${tex(`\\frac{${num}}{${den}}${simple}${mixed} = ${fmt(num / den, 3).replace(",", "{,}")}`)}</div>
      <p>Celoto smo razdelili na <b>${den}</b> ${den === 1 ? "del" : den === 2 ? "enaka dela" : den < 5 ? "enake dele" : "enakih delov"} (imenovalec) in vzeli <b>${num}</b> (števec). To je ${fmt((100 * num) / den, 1)} % celote.</p>
      <p class="muted">${num === den ? "Števec je enak imenovalcu: to je cela enota." : num > den ? "Števec je večji od imenovalca: ulomek je večji od 1 (nepravi ulomek)." : "Števec je manjši od imenovalca: ulomek je manjši od 1 (pravi ulomek)."}</p>`;
  };
  const numS = slider({ label: "števec", min: 0, max: 12, step: 1, value: num, digits: 0, onInput: (v) => ((num = v), draw()) });
  const denS = slider({ label: "imenovalec", min: 1, max: 12, step: 1, value: den, digits: 0, onInput: (v) => ((den = v), draw()) });
  const double = h("button", { type: "button", class: "secondary small", onclick: () => { if (den <= 6 && num <= 6) { denS.set(den * 2); numS.set(num * 2); } } }, "Razširi z 2");
  const reduce = h("button", { type: "button", class: "secondary small", onclick: () => { const g = gcd(num, den); if (g > 1) { numS.set(num / g); denS.set(den / g); } } }, "Okrajšaj");
  el.append(
    h("div", { class: "demo-stage" }, svg),
    controls(numS, denS, h("div", { class: "demo-buttons" }, double, reduce)),
    out,
    tryIt("nastavi 3/4, nato klikni »Razširi z 2«. Ali se je pobarvani del kroga spremenil? Kaj pa točka na premici?"),
  );
  draw();
}

// ------------------------------------------------------------ Ohmov zakon
function ohm(el) {
  const svg = svgBox(340, 220);
  const out = readout();
  let U = 6, R = 20;
  // vezje: pravokotnik žice
  const path = [[40, 40], [300, 40], [300, 180], [40, 180]];
  s("polyline", { points: [...path, path[0]].map((p) => p.join(",")).join(" "), class: "wire" }, svg);
  // baterija (levo)
  s("rect", { x: 22, y: 92, width: 36, height: 36, class: "bg-cut" }, svg);
  s("line", { x1: 26, y1: 104, x2: 54, y2: 104, class: "batt-long" }, svg);
  s("line", { x1: 33, y1: 116, x2: 47, y2: 116, class: "batt-short" }, svg);
  const uLbl = s("text", { x: 64, y: 114, class: "circ-label" }, svg);
  // upornik (zgoraj); sij kaže, koliko se segreva
  const glow = s("rect", { x: 134, y: 24, width: 72, height: 32, rx: 10, class: "heat" }, svg);
  const res = s("rect", { x: 140, y: 30, width: 60, height: 20, rx: 3, class: "resistor" }, svg);
  const rLbl = s("text", { x: 170, y: 22, class: "circ-label", "text-anchor": "middle" }, svg);
  // ampermeter (desno)
  s("circle", { cx: 300, cy: 110, r: 18, class: "meter" }, svg);
  s("text", { x: 300, y: 115, class: "meter-label", "text-anchor": "middle" }, svg).textContent = "A";
  const iLbl = s("text", { x: 250, y: 114, class: "circ-label", "text-anchor": "end" }, svg);
  // elektroni
  const dots = Array.from({ length: 18 }, () => s("circle", { r: 3.2, class: "electron" }, svg));
  const total = 2 * (260 + 140);
  const at = (d) => {
    d = ((d % total) + total) % total;
    if (d < 260) return [40 + d, 40];
    if ((d -= 260) < 140) return [300, 40 + d];
    if ((d -= 140) < 260) return [300 - d, 180];
    d -= 260;
    return [40, 180 - d];
  };
  let phase = 0;
  // Elektroni tečejo od - proti +, torej v nasprotni smeri kot dogovorjeni tok.
  animate(el, (dt) => {
    phase -= dt * 100 * (U / R); // hitrost elektronov je sorazmerna s tokom
    dots.forEach((c, i) => {
      const [x, y] = at(phase + (i * total) / dots.length);
      c.setAttribute("cx", x);
      c.setAttribute("cy", y);
    });
  });
  // graf I(U)
  const gsvg = svgBox(200, 150, "small");
  const draw = () => {
    const I = U / R;
    uLbl.textContent = `${fmt(U, 1)} V`;
    rLbl.textContent = `${fmt(R, 0)} Ω`;
    iLbl.textContent = `${fmt(I, 3)} A`;
    res.style.strokeWidth = 1 + R / 25;
    const pad = 2 + 3 * Math.sqrt(U * I); // sij raste z močjo
    glow.setAttribute("x", 140 - pad); glow.setAttribute("y", 30 - pad); glow.setAttribute("width", 60 + 2 * pad); glow.setAttribute("height", 20 + 2 * pad);
    glow.style.opacity = U * I > 0.01 ? 0.8 : 0;
    gsvg.replaceChildren();
    const X = (u) => 30 + (u / 12) * 160, Y = (i) => 130 - (i / 2.4) * 115;
    s("line", { x1: 30, y1: 130, x2: 195, y2: 130, class: "axis" }, gsvg);
    s("line", { x1: 30, y1: 130, x2: 30, y2: 8, class: "axis" }, gsvg);
    s("text", { x: 195, y: 122, class: "tick", "text-anchor": "end" }, gsvg).textContent = "U [V]";
    s("text", { x: 34, y: 14, class: "tick" }, gsvg).textContent = "I [A]";
    for (const u of [4, 8, 12]) s("text", { x: X(u), y: 143, class: "tick", "text-anchor": "middle" }, gsvg).textContent = u;
    const uEnd = Math.min(12, 2.4 * R);
    s("line", { x1: X(0), y1: Y(0), x2: X(uEnd), y2: Y(uEnd / R), class: "graph-line" }, gsvg);
    s("circle", { cx: X(U), cy: Y(I), r: 5, class: "pt pt-n" }, gsvg);
    out.innerHTML = `<div class="demo-eq">${tex(`I = \\frac{U}{R} = \\frac{${fmt(U, 1).replace(",", "{,}")}\\,\\mathrm{V}}{${fmt(R, 0)}\\,\\Omega} = ${fmt(I, 3).replace(",", "{,}")}\\,\\mathrm{A}`)}</div>
      <p>Moč na uporniku: P = U · I = ${fmt(U * I, 2)} W. ${U * I > 2 ? "Upornik se močno segreva." : U * I > 0.3 ? "Upornik se segreva." : "Upornik se komaj segreje."}</p>
      <p class="muted">Pri stalnem uporu je tok premo sorazmeren z napetostjo: graf I(U) je premica skozi izhodišče. Večji upor pomeni bolj položno premico. Pikice so elektroni; tečejo od − proti +, dogovorjena smer toka pa je obratna.</p>`;
  };
  el.append(
    h("div", { class: "demo-stage two" }, svg, gsvg),
    controls(
      slider({ label: "napetost U", min: 0, max: 12, step: 0.5, value: U, unit: "V", digits: 1, onInput: (v) => ((U = v), draw()) }),
      slider({ label: "upor R", min: 5, max: 100, step: 5, value: R, unit: "Ω", digits: 0, onInput: (v) => ((R = v), draw()) }),
    ),
    out,
    tryIt("pri 6 V nastavi upor 20 Ω in si zapomni tok. Napovej, kolikšen bo tok pri 40 Ω, nato preveri. Kako se ob tem nagne premica na grafu?"),
  );
  draw();
}

// ------------------------------------------------------------ prosti pad
const PLANETS = { Zemlja: 9.81, Luna: 1.62, Mars: 3.71, Jupiter: 24.8 };
function planetSelect(value, onChange) {
  const sel = h("select", { "aria-label": "Kraj" }, Object.entries(PLANETS).map(([k, g]) => h("option", { value: k }, `${k} (g = ${fmt(g)} m/s²)`)));
  sel.value = value;
  sel.addEventListener("change", () => onChange(sel.value));
  return h("label", { class: "demo-slider" }, h("span", { class: "demo-slider-label" }, "kraj"), sel);
}

function prostiPad(el) {
  const svg = svgBox(340, 300);
  const out = readout();
  let H = 20, planet = "Zemlja", t = 0, running = false, marks = [];
  const top = 20, bottom = 270;
  const Y = (y) => bottom - (y / H) * (bottom - top);
  const draw = () => {
    const g = PLANETS[planet];
    const tEnd = Math.sqrt((2 * H) / g);
    const tt = Math.min(t, tEnd);
    const y = H - (g * tt * tt) / 2, v = g * tt;
    svg.replaceChildren();
    s("line", { x1: 20, y1: bottom + 8, x2: 320, y2: bottom + 8, class: "ground" }, svg);
    s("line", { x1: 60, y1: top, x2: 60, y2: bottom, class: "axis" }, svg);
    for (let i = 0; i <= 4; i++) {
      const hy = (H * i) / 4;
      s("line", { x1: 55, y1: Y(hy), x2: 65, y2: Y(hy), class: "axis" }, svg);
      s("text", { x: 50, y: Y(hy) + 4, class: "tick", "text-anchor": "end" }, svg).textContent = `${fmt(hy, 1)} m`;
    }
    // stroboskopski posnetek: položaj vsakih 0,2 s (pri Zemlji)
    for (const m of marks) s("circle", { cx: 150, cy: Y(m), r: 9, class: "ghost" }, svg);
    s("circle", { cx: 150, cy: Y(y), r: 10, class: "ball" }, svg);
    // puščica hitrosti
    if (v > 0.01) {
      const len = Math.min(110, v * 3);
      s("line", { x1: 172, y1: Y(y), x2: 172, y2: Y(y) + len, class: "vel" }, svg);
      s("text", { x: 180, y: Y(y) + len / 2, class: "circ-label" }, svg).textContent = `v = ${fmt(v, 1)} m/s`;
    }
    out.innerHTML = `${values([["čas t", `${fmt(tt, 2)} s`], ["pot s = ½·g·t²", `${fmt(H - y, 2)} m`], ["hitrost v = g·t", `${fmt(v, 1)} m/s`], ["višina", `${fmt(y, 2)} m`]])}
      <p>${tex(`t = \\sqrt{\\frac{2h}{g}} = ${fmt(tEnd, 2).replace(",", "{,}")}\\,\\mathrm{s}`)}, hitrost ob padcu ${fmt(g * tEnd, 1)} m/s (${fmt(g * tEnd * 3.6, 0)} km/h).</p>
      <p class="muted">Sence kažejo položaj krogle na vsakih ${fmt(stroke(), 2)} s. Razmiki se večajo, ker krogla vsako sekundo pridobi enako hitrosti. Zračni upor zanemarimo, zato vsa telesa padajo enako hitro, ne glede na maso.</p>`;
  };
  const stroke = () => Math.sqrt((2 * H) / PLANETS[planet]) / 8;
  const drop = h("button", { type: "button", class: "primary", onclick: () => { t = 0; marks = []; running = true; } }, "Spusti kroglo");
  let nextMark = 0;
  animate(el, (dt) => {
    if (!running) return;
    const g = PLANETS[planet], tEnd = Math.sqrt((2 * H) / g);
    t += dt;
    if (t >= nextMark * stroke() && nextMark <= 8) {
      marks.push(H - (g * (nextMark * stroke()) ** 2) / 2);
      nextMark++;
    }
    if (t >= tEnd) running = false;
    draw();
    if (!running) nextMark = 0;
  });
  const reset = () => { t = 0; marks = []; running = false; nextMark = 0; draw(); };
  el.append(
    h("div", { class: "demo-stage" }, svg),
    controls(
      slider({ label: "višina h", min: 1, max: 100, step: 1, value: H, unit: "m", digits: 0, onInput: (v) => ((H = v), reset()) }),
      planetSelect(planet, (p) => ((planet = p), reset())),
      h("div", { class: "demo-buttons" }, drop),
    ),
    out,
    tryIt("kolikokrat dlje pada krogla, če višino povečaš 4-krat? Primerjaj padec z 20 m na Zemlji in na Luni."),
  );
  draw();
}

// ------------------------------------------------------------ nihalo
function nihalo(el) {
  const svg = svgBox(340, 280);
  const out = readout();
  let L = 1, amp = 15, m = 1, planet = "Zemlja", th = (15 * Math.PI) / 180, w = 0, t = 0, lastCross = null, measured = null, prevSign = 1;
  const px = (L) => L * 120; // dolžina nihala v merilu: 120 px na meter
  const draw = () => {
    svg.replaceChildren();
    const ox = 170, oy = 24, len = px(L);
    s("line", { x1: 110, y1: oy, x2: 230, y2: oy, class: "ground" }, svg);
    s("line", { x1: ox, y1: oy, x2: ox, y2: oy + len + 20, class: "guide" }, svg);
    const A = (amp * Math.PI) / 180;
    for (const sgn of [-1, 1]) s("line", { x1: ox, y1: oy, x2: ox + sgn * len * Math.sin(A), y2: oy + len * Math.cos(A), class: "guide" }, svg);
    const bx = ox + len * Math.sin(th), by = oy + len * Math.cos(th);
    s("line", { x1: ox, y1: oy, x2: bx, y2: by, class: "string" }, svg);
    s("circle", { cx: bx, cy: by, r: 8 * Math.cbrt(m), class: "ball" }, svg);
    const g = PLANETS[planet];
    const T = 2 * Math.PI * Math.sqrt(L / g);
    out.innerHTML = `<div class="demo-eq">${tex(`T = 2\\pi\\sqrt{\\frac{l}{g}} = ${fmt(T, 2).replace(",", "{,}")}\\,\\mathrm{s}`)}</div>
      <p>Izmerjen nihajni čas: <b>${measured ? fmt(measured, 2) + " s" : "merim …"}</b> · frekvenca ${fmt(1 / T, 2)} Hz</p>
      <p class="muted">Spremeni maso: nihajni čas ostane enak. Pri večjih odmikih (nad ~20°) je izmerjeni čas nekoliko daljši od formule, ker formula velja za majhne odmike.</p>`;
  };
  const restart = () => {
    th = (amp * Math.PI) / 180; w = 0; t = 0; lastCross = null; measured = null; prevSign = 1;
    draw();
  };
  animate(el, (dt) => {
    const g = PLANETS[planet];
    // več majhnih korakov za stabilnost
    for (let i = 0; i < 8; i++) {
      const h8 = dt / 8;
      w += (-g / L) * Math.sin(th) * h8;
      th += w * h8;
      t += h8;
      const sign = Math.sign(th) || prevSign;
      if (prevSign < 0 && sign > 0) {
        if (lastCross !== null) measured = t - lastCross;
        lastCross = t;
      }
      prevSign = sign;
    }
    draw();
  });
  el.append(
    h("div", { class: "demo-stage" }, svg),
    controls(
      slider({ label: "dolžina l", min: 0.2, max: 2, step: 0.1, value: L, unit: "m", digits: 1, onInput: (v) => ((L = v), restart()) }),
      slider({ label: "odmik", min: 5, max: 60, step: 5, value: amp, unit: "°", digits: 0, onInput: (v) => ((amp = v), restart()) }),
      slider({ label: "masa", min: 0.1, max: 5, step: 0.1, value: m, unit: "kg", digits: 1, onInput: (v) => ((m = v), draw()) }),
      planetSelect(planet, (p) => ((planet = p), restart())),
    ),
    out,
    tryIt("kolikšna mora biti dolžina, da je nihajni čas na Zemlji 2 s? Kaj se zgodi s časom, če dolžino povečaš 4-krat?"),
  );
  restart();
}

// ------------------------------------------------------------ plini
function plini(el) {
  const svg = svgBox(340, 220);
  const out = readout();
  let T = 300, V = 25, n = 1;
  const RG = 8.314;
  const parts = [];
  const sync = () => {
    const want = Math.round(n * 30);
    while (parts.length < want) {
      const a = Math.random() * 2 * Math.PI;
      parts.push({ x: Math.random(), y: Math.random(), vx: Math.cos(a), vy: Math.sin(a) });
    }
    parts.length = want;
  };
  let hits = 0, hitRate = 0, acc = 0;
  const draw = () => {
    const boxW = (V / 50) * 280, boxH = 150, x0 = 20, y0 = 40; // širina posode ∝ prostornina
    svg.replaceChildren();
    s("rect", { x: x0, y: y0, width: boxW, height: boxH, class: "box" }, svg);
    s("rect", { x: x0 + boxW, y: y0 - 6, width: 10, height: boxH + 12, class: "piston" }, svg);
    for (const p of parts) s("circle", { cx: x0 + 5 + p.x * (boxW - 10), cy: y0 + 5 + p.y * (boxH - 10), r: 4, class: "particle", style: `fill: hsl(${Math.max(0, 240 - (T - 100) * 0.45)} 75% 55%)` }, svg);
    const p = (n * RG * T) / V; // kPa, ker je V v dm³
    s("text", { x: x0, y: 26, class: "circ-label" }, svg).textContent = `p = ${fmt(p, 0)} kPa`;
    out.innerHTML = `<div class="demo-eq">${tex(`pV = nRT \\Rightarrow p = \\frac{nRT}{V} = \\frac{${fmt(n, 1).replace(",", "{,}")}\\cdot 8{,}31 \\cdot ${fmt(T, 0)}}{${fmt(V, 0)}\\,\\mathrm{dm^3}} = ${fmt(p, 0)}\\,\\mathrm{kPa}`)}</div>
      <p>Udarcev ob steno na sekundo (v simulaciji): <b>${fmt(hitRate, 0)}</b>. Tlak nastane zaradi trkov delcev ob stene: več delcev, hitrejši delci ali manjša posoda pomenijo več trkov.</p>
      <ul class="muted">
        <li>Stalna T in n, manjša V: večji tlak (Boylov zakon, pV = konst.).</li>
        <li>Stalna V in n, višja T: delci so hitrejši, tlak raste (p/T = konst.).</li>
        <li>Barva delcev kaže temperaturo: modri so počasni, rdeči hitri.</li>
      </ul>`;
  };
  animate(el, (dt) => {
    const speed = 0.35 * Math.sqrt(T / 300) * (25 / ((V / 50) * 280)) * 9;
    for (const p of parts) {
      p.x += p.vx * speed * dt;
      p.y += p.vy * speed * dt * (((V / 50) * 280) / 150);
      if (p.x < 0 || p.x > 1) { p.vx *= -1; p.x = Math.min(1, Math.max(0, p.x)); hits++; }
      if (p.y < 0 || p.y > 1) { p.vy *= -1; p.y = Math.min(1, Math.max(0, p.y)); hits++; }
    }
    acc += dt;
    if (acc >= 1) { hitRate = hits / acc; hits = 0; acc = 0; }
    draw();
  });
  el.append(
    h("div", { class: "demo-stage" }, svg),
    controls(
      slider({ label: "temperatura T", min: 100, max: 600, step: 10, value: T, unit: "K", digits: 0, onInput: (v) => (T = v) }),
      slider({ label: "prostornina V", min: 5, max: 50, step: 1, value: V, unit: "dm³", digits: 0, onInput: (v) => (V = v) }),
      slider({ label: "množina n", min: 0.2, max: 3, step: 0.1, value: n, unit: "mol", digits: 1, onInput: (v) => ((n = v), sync()) }),
    ),
    out,
    tryIt("napovej, kaj se zgodi s tlakom, če prostornino zmanjšaš na polovico pri isti temperaturi. Preveri. Kaj pa, če hkrati podvojiš temperaturo?"),
  );
  sync();
  draw();
}

// ------------------------------------------------------------ urejanje enačb
const REACTIONS = [
  { left: ["H2", "O2"], right: ["H2O"] },
  { left: ["N2", "H2"], right: ["NH3"] },
  { left: ["CH4", "O2"], right: ["CO2", "H2O"] },
  { left: ["Mg", "O2"], right: ["MgO"] },
  { left: ["Na", "Cl2"], right: ["NaCl"] },
  { left: ["Fe", "O2"], right: ["Fe2O3"] },
  { left: ["Al", "HCl"], right: ["AlCl3", "H2"] },
  { left: ["C3H8", "O2"], right: ["CO2", "H2O"] },
];
const ATOM_COLORS = { H: "#e8e8e8", O: "#e04b4b", N: "#4f6fe0", C: "#444", Cl: "#3cb371", Na: "#9b6ad6", Mg: "#2aa198", Fe: "#c87533", Al: "#a8b4c4" };
function atoms(formula) {
  const out = {};
  for (const [, el, k] of formula.matchAll(/([A-Z][a-z]?)(\d*)/g)) out[el] = (out[el] || 0) + (Number(k) || 1);
  return out;
}
const sub = (f) => f.replace(/(\d+)/g, "<sub>$1</sub>");
const subU = (f) => f.replace(/\d/g, (d) => "₀₁₂₃₄₅₆₇₈₉"[d]);

function enacbe(el) {
  let ri = 0, coef = [];
  const box = h("div", { class: "eq-box" });
  const mols = h("div", { class: "eq-mols" });
  const out = readout();
  const sel = h("select", { "aria-label": "Reakcija" }, REACTIONS.map((r, i) => h("option", { value: i }, subU([r.left.join(" + "), r.right.join(" + ")].join(" → ")))));
  sel.addEventListener("change", () => { ri = Number(sel.value); coef = []; draw(); });
  const species = () => [...REACTIONS[ri].left, ...REACTIONS[ri].right];
  const draw = () => {
    const r = REACTIONS[ri], all = species();
    if (!coef.length) coef = all.map(() => 1);
    box.replaceChildren();
    mols.replaceChildren();
    all.forEach((f, i) => {
      if (i === r.left.length) box.append(h("span", { class: "eq-arrow" }, "→"));
      else if (i) box.append(h("span", { class: "eq-plus" }, "+"));
      const c = h("span", { class: "eq-coef" }, String(coef[i]));
      const term = h("span", { class: "eq-term" },
        h("button", { type: "button", class: "ghost small", "aria-label": `več ${f}`, onclick: () => { if (coef[i] < 12) coef[i]++; draw(); } }, "+"),
        h("span", { class: "eq-formula" }, c, h("span", {}, "")),
        h("button", { type: "button", class: "ghost small", "aria-label": `manj ${f}`, onclick: () => { if (coef[i] > 1) coef[i]--; draw(); } }, "−"),
      );
      term.querySelector(".eq-formula span:last-child").innerHTML = sub(f);
      box.append(term);
      // molekule kot kroglice
      const group = h("div", { class: "eq-group" + (i < r.left.length ? "" : " right") });
      for (let k = 0; k < Math.min(coef[i], 12); k++) {
        const mol = h("span", { class: "mol", title: f });
        for (const [a, cnt] of Object.entries(atoms(f))) for (let j = 0; j < cnt; j++) mol.append(h("i", { style: `background:${ATOM_COLORS[a] || "#999"}`, title: a }));
        group.append(mol);
      }
      if (i === r.left.length) mols.append(h("span", { class: "eq-arrow" }, "→"));
      mols.append(group);
    });
    const count = (list, off) => {
      const tot = {};
      list.forEach((f, i) => { for (const [a, k] of Object.entries(atoms(f))) tot[a] = (tot[a] || 0) + k * coef[off + i]; });
      return tot;
    };
    const L = count(r.left, 0), R = count(r.right, r.left.length);
    const els = [...new Set([...Object.keys(L), ...Object.keys(R)])];
    const balanced = els.every((a) => L[a] === R[a]);
    const g = coef.reduce((x, y) => gcd(x, y));
    out.innerHTML = `<table class="demo-table atoms"><tr><th>atom</th><th>levo</th><th>desno</th><th></th></tr>${els
      .map((a) => `<tr class="${L[a] === R[a] ? "ok" : "bad"}"><td><i class="atom" style="background:${ATOM_COLORS[a] || "#999"}"></i> ${a}</td><td>${L[a] || 0}</td><td>${R[a] || 0}</td><td>${L[a] === R[a] ? "✓" : "✗"}</td></tr>`)
      .join("")}</table>
      <p class="${balanced ? "fb ok" : "muted"}">${
        balanced
          ? g > 1
            ? `Enačba je urejena, a koeficiente lahko še delimo z ${g}. Uporabi najmanjše cele koeficiente.`
            : "Enačba je urejena: na obeh straneh je enako število atomov vsakega elementa."
          : "Spreminjaj samo koeficiente (številke pred formulami), nikoli indeksov v formulah. Začni z elementom, ki se pojavi v najmanj snoveh."
      }</p>`;
  };
  el.append(
    controls(h("label", { class: "demo-slider" }, h("span", { class: "demo-slider-label" }, "reakcija"), sel)),
    box,
    h("div", { class: "demo-stage" }, mols),
    out,
    tryIt("preden urediš enačbo, preštej atome vsakega elementa na levi in desni. Zakaj ne smeš spremeniti indeksa (npr. H₂O v H₂O₂), ampak le koeficient?"),
  );
  draw();
}

// ------------------------------------------------------------ pH
const SUBSTANCES = [
  ["želodčna kislina", 1.5], ["limonin sok", 2.4], ["kokakola", 2.5], ["kis", 2.9], ["pomarančni sok", 3.5], ["kava", 5], ["mleko", 6.6],
  ["destilirana voda", 7], ["kri", 7.4], ["morska voda", 8.1], ["raztopina sode bikarbone", 8.3], ["milnica", 10], ["amonijak (čistilo)", 11.6], ["belilo", 12.5], ["raztopina NaOH", 14],
];
// Barve univerzalnega indikatorja (približno).
const PH_COLORS = ["#d7191c", "#e8402a", "#f46d43", "#f99c4d", "#fdc160", "#fee08b", "#e6f08f", "#a6d96a", "#66bd63", "#36a65a", "#1a9850", "#2b8cbe", "#3a5fb5", "#5a3fa0", "#6a2c91"];
function phColor(pH) {
  const i = Math.max(0, Math.min(14, pH)), a = Math.floor(i), b = Math.min(14, a + 1), t = i - a;
  const hx = (c) => [1, 3, 5].map((k) => parseInt(c.slice(k, k + 2), 16));
  const [c1, c2] = [hx(PH_COLORS[a]), hx(PH_COLORS[b])];
  return `rgb(${c1.map((v, k) => Math.round(v + (c2[k] - v) * t)).join(",")})`;
}
function ph(el) {
  const svg = svgBox(340, 200);
  const out = readout();
  let pH = 7;
  const X = (v) => 20 + (v / 14) * 300;
  const draw = () => {
    svg.replaceChildren();
    const defs = s("defs", {}, svg);
    const lg = s("linearGradient", { id: "ph-grad" }, defs);
    PH_COLORS.forEach((c, i) => s("stop", { offset: `${(i / 14) * 100}%`, "stop-color": c }, lg));
    s("rect", { x: 20, y: 120, width: 300, height: 22, rx: 6, fill: "url(#ph-grad)" }, svg);
    for (let i = 0; i <= 14; i += 1) s("text", { x: X(i), y: 158, class: "tick", "text-anchor": "middle" }, svg).textContent = i;
    s("text", { x: 20, y: 178, class: "tick" }, svg).textContent = "kislo";
    s("text", { x: X(7), y: 178, class: "tick", "text-anchor": "middle" }, svg).textContent = "nevtralno";
    s("text", { x: 320, y: 178, class: "tick", "text-anchor": "end" }, svg).textContent = "bazično";
    s("path", { d: `M${X(pH)},116 l-7,-11 h14 z`, class: "fill-text" }, svg);
    // čaša z indikatorjem
    s("path", { d: "M130,12 v80 q0,8 8,8 h64 q8,0 8,-8 v-80", class: "beaker" }, svg);
    s("path", { d: "M131,40 v52 q0,7 7,7 h64 q7,0 7,-7 v-52 z", fill: phColor(pH), opacity: 0.85 }, svg);
    const H3O = Math.pow(10, -pH), OH = Math.pow(10, pH - 14);
    const kind = pH < 6.95 ? "kisla" : pH > 7.05 ? "bazična" : "nevtralna";
    const near = SUBSTANCES.reduce((a, b) => (Math.abs(b[1] - pH) < Math.abs(a[1] - pH) ? b : a));
    const sci = (x) => { const e = Math.floor(Math.log10(x) + 1e-9); const m = x / 10 ** e; return `${fmt(m, 1)}\\cdot 10^{${e}}`.replace(",", "{,}"); };
    out.innerHTML = `<p>pH = <b>${fmt(pH, 1)}</b>: raztopina je <b>${kind}</b>. Podobno kot ${near[0]} (pH ≈ ${fmt(near[1], 1)}).</p>
      <p>${tex(`[\\mathrm{H_3O^+}] = 10^{-\\mathrm{pH}} = ${sci(H3O)}\\ \\mathrm{mol/L}`)} &nbsp; ${tex(`[\\mathrm{OH^-}] = ${sci(OH)}\\ \\mathrm{mol/L}`)}</p>
      <p class="muted">Ko se pH zmanjša za 1, je oksonijevih ionov 10-krat več. Raztopina s pH 3 je torej 10 · 10 = 100-krat bolj kisla od raztopine s pH 5.</p>`;
  };
  const sl = slider({ label: "pH", min: 0, max: 14, step: 0.1, value: pH, digits: 1, onInput: (v) => ((pH = v), draw()) });
  const chips = h("div", { class: "demo-chips" }, SUBSTANCES.map(([name, v]) => h("button", { type: "button", class: "chip-btn", onclick: () => sl.set(v) }, h("i", { style: `background:${phColor(v)}` }), name)));
  el.append(h("div", { class: "demo-stage" }, svg), controls(sl), chips, out, tryIt("razvrsti kis, mleko in milnico od najbolj kisle do najbolj bazične, nato preveri. Kolikokrat več ionov H⁺ ima raztopina s pH 3 kot raztopina s pH 5?"));
  draw();
}

export const DEMOS = { linearna, pitagora, ulomki, ohm, "prosti-pad": prostiPad, nihalo, plini, enacbe, ph };

export function mountDemo(id, el) {
  const fn = DEMOS[id];
  if (!fn) return false;
  el.replaceChildren();
  el.classList.add("demo", `demo-${id}`);
  fn(el);
  return true;
}

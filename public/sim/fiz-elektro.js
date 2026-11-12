// Simulacije pri fiziki: naboji in električno polje, električni krog, poraba energije, magnetno polje,
// magnetna sila na naboj, elektromagnetna indukcija.
import { h, s, svgBox, slider, select, segmented, toggle, button, buttons, readout, layout, texBlock, fmt, tfmt, clamp, label, arrow, animate, playButton, draggable, handle } from "./kit.js";
import { timeGraph } from "./fiz-skupno.js";

const T = (x, d = 2) => tfmt(x, d);

// Silnice polja točkastih izvorov (naboji ali magnetni poli) v pikslih.
function fieldAt(src, x, y) {
  let ex = 0, ey = 0;
  for (const q of src) {
    const dx = x - q.x, dy = y - q.y, r2 = dx * dx + dy * dy + 1, r = Math.sqrt(r2);
    ex += (q.q * dx) / (r2 * r);
    ey += (q.q * dy) / (r2 * r);
  }
  return [ex, ey];
}
function traceLines(svg, src, { W, H, perUnit = 8, cls = "graph-line stroke-muted thin-line", arrows = true } = {}) {
  const pos = src.filter((q) => q.q > 0), starts = pos.length ? pos : src.filter((q) => q.q < 0);
  const dir = pos.length ? 1 : -1;
  starts.forEach((q0) => {
    const n = Math.round(Math.abs(q0.q) * perUnit);
    for (let k = 0; k < n; k++) {
      const a = (2 * Math.PI * (k + 0.5)) / n;
      let x = q0.x + 12 * Math.cos(a), y = q0.y + 12 * Math.sin(a), d = `M${x.toFixed(1)},${y.toFixed(1)}`, mid = null;
      for (let i = 0; i < 700; i++) {
        const [ex, ey] = fieldAt(src, x, y), L = Math.hypot(ex, ey) || 1;
        const hx = x + (dir * 2 * ex) / L, hy = y + (dir * 2 * ey) / L;
        const [fx, fy] = fieldAt(src, hx, hy), L2 = Math.hypot(fx, fy) || 1;
        x += (dir * 4 * fx) / L2;
        y += (dir * 4 * fy) / L2;
        d += `L${x.toFixed(1)},${y.toFixed(1)}`;
        if (i === 30) mid = [x, y, (dir * fx) / L2, (dir * fy) / L2];
        if (x < -20 || x > W + 20 || y < -20 || y > H + 20) break;
        if (src.some((q) => q !== q0 && Math.sign(q.q) !== Math.sign(q0.q) && Math.hypot(x - q.x, y - q.y) < 10)) break;
      }
      s("path", { d, class: cls, fill: "none" }, svg);
      if (arrows && mid) {
        const [mx, my, ux, uy] = dir > 0 ? mid : [mid[0], mid[1], -mid[2], -mid[3]];
        s("path", { d: `M${mx + ux * 5},${my + uy * 5} L${mx - ux * 4 - uy * 4},${my - uy * 4 + ux * 4} L${mx - ux * 4 + uy * 4},${my - uy * 4 - ux * 4} Z`, class: "fill-muted" }, svg);
      }
    }
  });
}
const chargeDot = (svg, x, y, q, r = 13) => {
  s("circle", { cx: x, cy: y, r, class: q > 0 ? "fill-danger" : "fill-accent" }, svg);
  label(svg, x, y + 1, q > 0 ? "+" : "−", "lbl inv big");
};

// ------------------------------------------------------------ naboji
export function naboji(el, { mode = "coulomb" } = {}) {
  if (mode === "drgnjenje") return drgnjenje(el);
  if (mode === "polje") return polje(el);
  const svg = svgBox(340, 200), svg2 = svgBox(340, 170);
  const out = readout();
  let q1 = 3, q2 = -2, r = 0.5;
  const draw = () => {
    svg.replaceChildren();
    svg2.replaceChildren();
    const k = 9e9, F = (k * q1 * 1e-6 * q2 * 1e-6) / (r * r);
    const xA = 170 - r * 140, xB = 170 + r * 140, y = 100;
    s("line", { x1: xA, y1: 160, x2: xB, y2: 160, class: "axis thin" }, svg);
    label(svg, 170, 176, `r = ${fmt(r, 2)} m`, "lbl small");
    // dolžina puščice je sorazmerna s silo: 40 px na N; zelo majhno ali preveliko silo narišemo črtkano
    const Lf = Math.abs(F) * 40, odd = Lf < 8 || Lf > 120, L = clamp(Lf, 8, F > 0 ? 120 : Math.max(8, (xB - xA) / 2 - 16)) * Math.sign(F);
    if (q1 && q2) {
      arrow(svg, xA, y, xA - L, y, "c", 3.5, odd || Math.abs(L) < Lf - 0.5 ? { "stroke-dasharray": "4 3" } : {});
      arrow(svg, xB, y, xB + L, y, "c", 3.5, odd || Math.abs(L) < Lf - 0.5 ? { "stroke-dasharray": "4 3" } : {});
      label(svg, 170, 24, `F = ${fmt(Math.abs(F), 2)} N`, "lbl small");
    }
    [[xA, q1], [xB, q2]].forEach(([x, q]) => {
      if (q) chargeDot(svg, x, y, q, 10 + Math.abs(q) * 2.5);
      else s("circle", { cx: x, cy: y, r: 10, class: "node" }, svg);
      label(svg, x, y - 30, `${q > 0 ? "+" : q < 0 ? "−" : ""}${Math.abs(q)} μC`, "lbl small");
    });
    // F(r)
    const X = (rr) => 40 + (rr / 1) * 280, Y = (f) => 140 - (f / 6) * 120;
    s("line", { x1: 40, y1: 140, x2: 330, y2: 140, class: "axis" }, svg2);
    s("line", { x1: 40, y1: 140, x2: 40, y2: 12, class: "axis" }, svg2);
    label(svg2, 330, 156, "r [m]", "axis-label", "end");
    label(svg2, 46, 18, "|F| [N]", "axis-label", "start");
    [0.2, 0.4, 0.6, 0.8, 1].forEach((rr) => label(svg2, X(rr), 152, fmt(rr, 1), "tick small"));
    [2, 4, 6].forEach((f) => label(svg2, 36, Y(f), String(f), "tick small", "end"));
    let d = "";
    for (let i = 0; i <= 100; i++) {
      const rr = 0.1 + (0.9 * i) / 100, f = Math.abs((k * q1 * q2 * 1e-12) / (rr * rr));
      if (f <= 6) d += `${d ? "L" : "M"}${X(rr).toFixed(1)},${Y(f).toFixed(1)}`;
    }
    s("path", { d, class: "graph-line stroke-c", fill: "none" }, svg2);
    if (Math.abs(F) <= 6) s("circle", { cx: X(r), cy: Y(Math.abs(F)), r: 5, class: "pt fill-accent" }, svg2);
    out.innerHTML = texBlock(`F = k\\frac{|e_1 e_2|}{r^2} = 9\\cdot 10^9\\cdot\\frac{${Math.abs(q1)}\\cdot 10^{-6}\\cdot ${Math.abs(q2)}\\cdot 10^{-6}}{${T(r, 2)}^2} = ${T(Math.abs(F), 2)}\\ \\text{N}`) +
      `<p>${!q1 || !q2 ? "Eden od teles ni nabit: električne sile ni." : F > 0 ? "Istoimenska naboja se <b>odbijata</b>." : "Raznoimenska naboja se <b>privlačita</b>."} Sili na oba naboja sta enako veliki in nasprotno usmerjeni (3. Newtonov zakon).</p>
       <p class="muted">Sila pada s kvadratom razdalje: pri dvakrat večji razdalji je štirikrat manjša.</p>`;
  };
  layout(el, {
    stage: [svg, svg2],
    controls: [
      slider({ label: "naboj e₁", min: -5, max: 5, value: q1, unit: "μC", onInput: (v) => ((q1 = v), draw()) }),
      slider({ label: "naboj e₂", min: -5, max: 5, value: q2, unit: "μC", onInput: (v) => ((q2 = v), draw()) }),
      slider({ label: "razdalja r", min: 0.2, max: 1, step: 0.05, value: r, unit: "m", onInput: (v) => ((r = v), draw()) }),
    ],
    out,
    tryText: "Podvoji oba naboja in hkrati podvoji razdaljo. Kako se spremeni sila?",
  });
  draw();
}

function drgnjenje(el) {
  const svg = svgBox(340, 230);
  const out = readout();
  let moved = 0, bx = 200;
  const draw = () => {
    svg.replaceChildren();
    // pulover
    s("rect", { x: 10, y: 40, width: 80, height: 160, rx: 10, class: "fill-c", opacity: 0.35 }, svg);
    label(svg, 50, 30, "volnen pulover", "tick");
    for (let i = 0; i < 24; i++) {
      const x = 24 + (i % 4) * 18, y = 56 + Math.floor(i / 4) * 24;
      s("text", { x, y, class: "lbl small", "text-anchor": "middle", fill: "var(--danger)" }, svg, "+");
      if (i >= moved) s("text", { x: x + 8, y: y + 8, class: "lbl small", "text-anchor": "middle" }, svg, "−");
    }
    // stena
    s("rect", { x: 316, y: 20, width: 24, height: 200, class: "wall" }, svg);
    const near = 316 - (bx + 34);
    for (let i = 0; i < 8; i++) {
      const y = 40 + i * 22, shift = moved && near < 60 ? 5 : 0;
      s("text", { x: 324 + shift, y, class: "lbl small", "text-anchor": "middle" }, svg, "+");
      s("text", { x: 332 - shift, y: y + 8, class: "lbl small", "text-anchor": "middle" }, svg, "−");
    }
    // balon
    s("ellipse", { cx: bx, cy: 110, rx: 34, ry: 42, class: "fill-b", opacity: 0.55 }, svg);
    s("path", { d: `M${bx},152 q-6,20 4,40 q8,16 -2,30`, class: "string", fill: "none" }, svg);
    for (let i = 0; i < moved; i++) {
      const a = (i / Math.max(moved, 1)) * Math.PI * 2;
      s("text", { x: bx + Math.cos(a) * 20, y: 114 + Math.sin(a) * 26, class: "lbl small", "text-anchor": "middle" }, svg, "−");
    }
    const hb = handle(svg, "b");
    hb.move(bx, 110);
    draggable(svg, hb, (x) => ((bx = clamp(x, 130, 280)), draw()));
    const dS = bx - 34 - 90, dW = 316 - (bx + 34);
    const Fs = moved ? (moved * moved * 0.6) / Math.max(10, dS) : 0, Fw = moved ? (moved * moved * 0.15) / Math.max(10, dW) : 0;
    if (Fs > 0.2) arrow(svg, bx - 36, 60, bx - 36 - Math.min(80, Fs * 10), 60, "c", 3);
    if (Fw > 0.2) arrow(svg, bx + 36, 60, bx + 36 + Math.min(80, Fw * 10), 60, "c", 3);
    out.innerHTML = moved
      ? `<p>Pri drgnjenju je pulover oddal <b>${moved} elektronov</b> balonu. Balon je zdaj negativno nabit, pulover pa pozitivno (enako število presežnih +). Naboj se ni ustvaril, samo <b>prerazporedil</b> se je.</p>
         <p>Balon privlači pulover (raznoimenska naboja). Privlači tudi nenabito steno: v njej se naboji le malo premaknejo (influenca), + se približajo balonu.</p>
         <p class="muted">Povleci balon bliže steni ali puloverju. Bliže kot je, večja je sila.</p>`
      : `<p>Balon in pulover sta <b>nevtralna</b>: imata enako pozitivnih in negativnih nabojev. Klikni »Podrgni«, da balon podrgneš ob pulover.</p>`;
  };
  layout(el, {
    stage: [svg],
    controls: [buttons(button("Podrgni balon ob pulover", () => ((moved = Math.min(24, moved + 4)), draw()), "primary small"), button("Razelektri", () => ((moved = 0), draw())))],
    out,
    tryText: { razmisli: "Zakaj se nabit balon prime stene, čeprav stena ni nabita?" },
  });
  draw();
}

function polje(el) {
  const svg = svgBox(340, 300);
  const out = readout();
  let cfg = "dipol", src, test = { x: 170, y: 60 };
  const setCfg = () => {
    src = { plus: [{ x: 170, y: 160, q: 1 }], minus: [{ x: 170, y: 160, q: -1 }], dipol: [{ x: 110, y: 160, q: 1 }, { x: 230, y: 160, q: -1 }], enaka: [{ x: 110, y: 160, q: 1 }, { x: 230, y: 160, q: 1 }], plosci: null }[cfg];
  };
  const draw = () => {
    svg.replaceChildren();
    let E;
    if (cfg === "plosci") {
      s("rect", { x: 60, y: 40, width: 12, height: 220, class: "fill-danger", opacity: 0.8 }, svg);
      s("rect", { x: 268, y: 40, width: 12, height: 220, class: "fill-accent", opacity: 0.8 }, svg);
      for (let y = 55; y <= 245; y += 19) arrow(svg, 76, y, 262, y, "muted", 1.2);
      for (let y = 50; y < 260; y += 26) {
        label(svg, 66, y, "+", "lbl inv");
        label(svg, 274, y, "−", "lbl inv");
      }
      E = test.x > 72 && test.x < 268 && test.y > 40 && test.y < 260 ? [1, 0] : [0, 0];
    } else {
      traceLines(svg, src, { W: 340, H: 300, perUnit: 12 });
      src.forEach((q, i) => {
        chargeDot(svg, q.x, q.y, q.q);
        const hq = handle(svg, q.q > 0 ? "danger" : "accent", 1);
        hq.move(q.x, q.y);
        draggable(svg, hq, (x, y) => ((src[i].x = clamp(x, 20, 320)), (src[i].y = clamp(y, 20, 280)), draw()));
      });
      const [ex, ey] = fieldAt(src, test.x, test.y);
      E = [ex * 4000, ey * 4000];
    }
    const L = Math.hypot(...E), cut = L * 40 > 70, sc = Math.min(70, L * 40) / (L || 1);
    s("circle", { cx: test.x, cy: test.y, r: 6, class: "fill-a" }, svg);
    if (L > 1e-6) arrow(svg, test.x, test.y, test.x + E[0] * sc, test.y + E[1] * sc, "a", 3, cut ? { "stroke-dasharray": "6 4" } : {});
    if (cut) label(svg, test.x, test.y + 20, "(puščica skrajšana)", "tick small");
    const ht = handle(svg, "a", 1);
    ht.move(test.x, test.y);
    draggable(svg, ht, (x, y) => ((test = { x: clamp(x, 10, 330), y: clamp(y, 10, 290) }), draw()));
    out.innerHTML = `<p>Silnice kažejo smer sile na <b>pozitiven</b> preizkusni naboj (oranžna pika): izhajajo iz pozitivnih in se končajo v negativnih nabojih. Kjer so silnice gostejše, je polje močnejše.</p>
      ${texBlock(cfg === "plosci" ? "E = \\frac{U}{d}\\ \\text{(homogeno polje)}" : "E = \\frac{F}{e} = k\\frac{e_0}{r^2}")}
      <p class="muted">${cfg === "plosci" ? "Med nabitima ploščama je polje homogeno: povsod enako veliko in enako usmerjeno (kondenzator)." : "Povleci naboje ali preizkusni naboj. Puščica kaže silo na preizkusni naboj."}</p>`;
  };
  layout(el, {
    stage: [svg],
    controls: [segmented({ options: [["plus", "+"], ["minus", "−"], ["dipol", "+ in −"], ["enaka", "+ in +"], ["plosci", "plošči"]], value: cfg, onChange: (v) => ((cfg = v), setCfg(), draw()) })],
    out,
    tryText: "Pri dveh enakih nabojih poišči točko, kjer na preizkusni naboj ne deluje sila.",
  });
  setCfg();
  draw();
}

// ------------------------------------------------------------ električni krog: žarnice in uporniki
export function krogEl(el, { mode = "zarnice" } = {}) {
  const svg = svgBox(340, 250);
  const out = readout();
  const bulbs = mode === "zarnice";
  let vez = "zaporedno", U = bulbs ? 4.5 : 12, n = 2, R = [10, 20, 30], on = true, out1 = false, flow = 0;
  const ctl = h("div", { class: "demo-controls" });
  const calc = () => {
    const Rs = (bulbs ? [10, 10, 10] : R).slice(0, n);
    const act = Rs.map((r, i) => !(bulbs && out1 && i === 0));
    let I = 0, items;
    if (!on) items = Rs.map((r) => ({ R: r, U: 0, I: 0 }));
    else if (vez === "zaporedno") {
      const ok = act.every(Boolean), Rt = Rs.reduce((p, q) => p + q, 0);
      I = ok ? U / Rt : 0;
      items = Rs.map((r) => ({ R: r, U: I * r, I }));
    } else {
      items = Rs.map((r, i) => ({ R: r, U: act[i] ? U : 0, I: act[i] ? U / r : 0 }));
      I = items.reduce((p, q) => p + q.I, 0);
    }
    const Rt = vez === "zaporedno" ? Rs.reduce((p, q) => p + q, 0) : 1 / Rs.reduce((p, q) => p + 1 / q, 0);
    return { I, items, Rt };
  };
  const draw = () => {
    svg.replaceChildren();
    const c = calc(), L = 40, Rr = 300, Tp = 50, B = 210;
    const wire = (d) => {
      s("path", { d, class: "wire" }, svg);
      if (on && c.I > 0) s("path", { d, class: "graph-line stroke-accent thin-line", "stroke-dasharray": "3 13", "stroke-dashoffset": -flow, fill: "none", opacity: 0.8 }, svg);
    };
    // baterija levo
    wire(`M${L},${(Tp + B) / 2 - 14} V${Tp} H${Rr} V${B} H${L} V${(Tp + B) / 2 + 14}`);
    s("line", { x1: L - 14, y1: (Tp + B) / 2 - 6, x2: L + 14, y2: (Tp + B) / 2 - 6, class: "batt-long" }, svg);
    s("line", { x1: L - 8, y1: (Tp + B) / 2 + 6, x2: L + 8, y2: (Tp + B) / 2 + 6, class: "batt-short" }, svg);
    label(svg, L + 18, (Tp + B) / 2, `${fmt(U, 1)} V`, "lbl small", "start");
    // stikalo in ampermeter spodaj
    s("rect", { x: 92, y: B - 14, width: 40, height: 28, class: "fill-soft", stroke: "none" }, svg);
    s("circle", { cx: 96, cy: B, r: 3, class: "fill-text" }, svg);
    s("line", { x1: 96, y1: B, x2: 128, y2: on ? B : B - 16, class: "wire", "stroke-width": 3 }, svg);
    s("circle", { cx: 160, cy: B, r: 15, class: "meter" }, svg);
    label(svg, 160, B, "A", "meter-label");
    label(svg, 160, B + 28, `${fmt(c.I, 2)} A`, "lbl small");
    const elem = (x, y, it, i, vertical) => {
      const P = it.U * it.I;
      if (bulbs) {
        // ploščina sija je sorazmerna z močjo žarnice
        if (P > 0.005) s("circle", { cx: x, cy: y, r: 13 + 8 * Math.sqrt(P), class: "fill-a", opacity: 0.55 }, svg);
        s("circle", { cx: x, cy: y, r: 13, class: "meter" }, svg);
        if (!(out1 && i === 0)) s("path", { d: `M${x - 8},${y - 8} L${x + 8},${y + 8} M${x - 8},${y + 8} L${x + 8},${y - 8}`, class: "string" }, svg);
        else label(svg, x, y, "odvita", "tick small");
      } else {
        const rl = 10 + 0.8 * it.R; // dolžina upornika je sorazmerna z uporom
        s("rect", vertical ? { x: x - 9, y: y - rl / 2, width: 18, height: rl, class: "resistor", "stroke-width": 2 } : { x: x - rl / 2, y: y - 9, width: rl, height: 18, class: "resistor", "stroke-width": 2 }, svg);
        label(svg, vertical ? x + 14 : x, vertical ? y : y - 18, `R${"₁₂₃"[i]} = ${it.R} Ω`, "tick small", vertical ? "start" : "middle");
      }
      label(svg, vertical ? x + 14 : x, vertical ? y + (bulbs ? 0 : 16) : y + 26, `${fmt(it.U, 2)} V`, "lbl small", vertical ? "start" : "middle");
    };
    if (vez === "zaporedno") c.items.forEach((it, i) => {
      const x = 110 + ((i + 0.5) * 190) / n;
      s("rect", { x: x - 24, y: Tp - 8, width: 48, height: 16, class: "fill-soft", stroke: "none", opacity: 0 }, svg);
      elem(x, Tp, it, i, false);
    });
    else c.items.forEach((it, i) => {
      const x = 130 + ((i + 0.5) * 170) / n;
      wire(`M${x},${Tp} V${B}`);
      elem(x, (Tp + B) / 2 - 10, it, i, true);
    });
    // puščice toka v istem merilu: dolžina je sorazmerna s tokom
    const kI = 40, curArrow = (x, y, I, max = 120) => {
      if (!on || I <= 0) return;
      const len = kI * I, cut = len > max;
      arrow(svg, x, y, x, y + Math.min(len, max), "accent", 2.5, cut ? { "stroke-dasharray": "5 3" } : {});
    };
    curArrow(Rr + 12, Tp + 6, c.I);
    label(svg, 336, Tp - 8, `I = ${fmt(c.I, 2)} A`, "tick small", "end");
    if (vez === "vzporedno") c.items.forEach((it, i) => curArrow(130 + ((i + 0.5) * 170) / n - 9, (Tp + B) / 2 + 30, it.I, 46));
    label(svg, 4, 12, `puščice toka: 1 A = ${kI} px (črtkana = skrajšana)`, "tick small", "start");
    const rows = c.items.map((it, i) => `${bulbs ? "žarnica" : "R"}${i + 1}: U = ${fmt(it.U, 2)} V, I = ${fmt(it.I, 2)} A, P = ${fmt(it.U * it.I, 2)} W`).join("<br>");
    out.innerHTML = (bulbs ? "" : texBlock(vez === "zaporedno" ? `R = R_1 + R_2${n > 2 ? " + R_3" : ""} = ${T(c.Rt, 1)}\\ \\Omega` : `\\frac{1}{R} = \\frac{1}{R_1} + \\frac{1}{R_2}${n > 2 ? " + \\frac{1}{R_3}" : ""} \\Rightarrow R = ${T(c.Rt, 2)}\\ \\Omega`)) +
      `<p>${rows}</p><p>${!on ? "Stikalo je odprto: krog ni sklenjen, tok ne teče." : vez === "zaporedno" ? `<b>Zaporedna vezava:</b> skozi vse ${bulbs ? "žarnice" : "upornike"} teče enak tok, napetost vira se razdeli (vsota = ${fmt(U, 1)} V).${bulbs && out1 ? " Ker je ena žarnica odvita, je krog prekinjen: ne sveti nobena." : ""}` : `<b>Vzporedna vezava:</b> na vseh je enaka napetost ${fmt(U, 1)} V, skupni tok je vsota tokov v vejah.${bulbs && out1 ? " Odvita žarnica ne vpliva na druge." : ""}`}</p>
       <p class="muted">${bulbs ? "Svetlost je odvisna od moči P = U · I. Doma so naprave vezane vzporedno." : "Ohmov zakon za vsak upornik: U = R · I."}</p>`;
  };
  const anim = animate(el, (dt) => {
    flow += dt * Math.min(300, calc().I * (bulbs ? 120 : 25)); // hitrost pik je sorazmerna s tokom
    draw();
  }, { autoplay: false });
  const build = () => {
    const kids = [
      segmented({ options: [["zaporedno", "zaporedno"], ["vzporedno", "vzporedno"]], value: vez, onChange: (v) => ((vez = v), draw()) }),
      slider({ label: "napetost vira", min: 1.5, max: bulbs ? 9 : 24, step: 1.5, value: U, unit: "V", onInput: (v) => ((U = v), draw()) }),
      slider({ label: bulbs ? "število žarnic" : "število upornikov", min: 1, max: 3, value: n, onInput: (v) => ((n = v), draw()) }),
    ];
    if (!bulbs) R.forEach((r, i) => kids.push(slider({ label: `R${"₁₂₃"[i]}`, min: 5, max: 50, step: 5, value: r, unit: "Ω", onInput: (v) => ((R[i] = v), draw()) })));
    kids.push(toggle("stikalo sklenjeno", on, (v) => ((on = v), draw())));
    if (bulbs) kids.push(toggle("odvij prvo žarnico", out1, (v) => ((out1 = v), draw())));
    kids.push(buttons(playButton(anim, { play: "Pokaži tok", pause: "Ustavi" })));
    ctl.replaceChildren(...kids);
    draw();
  };
  layout(el, { stage: [svg], controls: ctl, out, tryText: bulbs ? "Primerjaj svetlost dveh žarnic v zaporedni in vzporedni vezavi. Kaj se zgodi, ko eno odviješ?" : "Kakšen je skupni upor dveh enakih upornikov po 20 Ω, vezanih vzporedno?" });
  build();
}

// ------------------------------------------------------------ poraba električne energije
const APP = [["hladilnik", 120, 24], ["pralni stroj", 2000, 1], ["sušilnik za lase", 1800, 0.25], ["televizor", 100, 3], ["računalnik", 150, 4], ["5 LED žarnic", 50, 5], ["štedilnik", 2500, 1], ["polnilnik telefona", 10, 3]];
export function poraba(el) {
  const svg = svgBox(340, 220);
  const out = readout();
  const hrs = APP.map((a) => a[2]);
  let price = 0.2;
  const list = h("div", { class: "data-editor" });
  const draw = () => {
    svg.replaceChildren();
    const E = APP.map((a, i) => (a[1] * hrs[i]) / 1000);
    const tot = E.reduce((p, q) => p + q, 0), maxE = Math.max(...E, 1);
    APP.forEach((a, i) => {
      const y = 12 + i * 25, w = (E[i] / maxE) * 170;
      label(svg, 118, y + 9, a[0], "tick", "end");
      s("rect", { x: 124, y, width: Math.max(1, w), height: 18, rx: 3, class: `bar fill-${["a", "b", "c"][i % 3]}` }, svg);
      label(svg, 128 + w, y + 9, `${fmt(E[i], 2)} kWh`, "tick small", "start");
    });
    list.replaceChildren(...APP.map((a, i) => h("div", { class: "data-row" }, h("span", { class: `dot dot-${["a", "b", "c"][i % 3]}` }), h("span", {}, `${a[0]} (${a[1]} W)`), button("−", () => ((hrs[i] = Math.max(0, hrs[i] - (hrs[i] > 1 ? 1 : 0.25))), draw())), h("b", {}, `${fmt(hrs[i], 2)} h`), button("+", () => ((hrs[i] = Math.min(24, hrs[i] + (hrs[i] >= 1 ? 1 : 0.25))), draw())))));
    const month = tot * 30;
    out.innerHTML = texBlock(`E = P\\cdot t\\quad\\Rightarrow\\quad E_{dan} = ${T(tot, 2)}\\ \\text{kWh}`) +
      `<p>V 30 dneh: <b>${fmt(month, 0)} kWh</b>, kar stane ${fmt(month * price, 2)} € (pri ${fmt(price, 2)} €/kWh).</p>
       <p class="muted">1 kWh je energija, ki jo naprava z močjo 1 kW porabi v 1 uri (3,6 MJ). Največ porabijo naprave z veliko močjo (grelniki) ali tiste, ki delajo ves dan (hladilnik).</p>`;
  };
  layout(el, {
    stage: [svg],
    controls: [h("p", { class: "muted" }, "Ure delovanja na dan:"), list, slider({ label: "cena", min: 0.1, max: 0.4, step: 0.01, value: price, unit: "€/kWh", onInput: (v) => ((price = v), draw()) })],
    out,
    tryText: "Koliko stane mesečno sušenje las 15 minut na dan? Koliko polnjenje telefona?",
  });
  draw();
}

// ------------------------------------------------------------ magnetno polje
export function magnet(el, { mode = "magnet" } = {}) {
  if (mode === "zica") return zica(el);
  const coil = mode === "tuljava";
  const svg = svgBox(340, 280);
  const out = readout();
  let I = 3, N = 200, comp = { x: 270, y: 70 }, grid = false;
  const draw = () => {
    svg.replaceChildren();
    const cx = 170, cy = 140, half = 60;
    const str = coil ? (I * N) / 600 : 1;
    const src = Math.abs(str) < 1e-6 ? [] : [{ x: cx + half * Math.sign(str), y: cy, q: Math.abs(str) }, { x: cx - half * Math.sign(str), y: cy, q: -Math.abs(str) }];
    if (src.length) traceLines(svg, src, { W: 340, H: 280, perUnit: coil ? 10 : 12, arrows: true });
    if (coil) {
      const loops = Math.round(N / 25); // ena narisana zanka = 25 ovojev
      for (let i = 0; i < loops; i++) {
        const x = cx - half + 6 + (i * 108) / Math.max(1, loops - 1);
        s("ellipse", { cx: x, cy, rx: 5, ry: 30, class: "graph-line stroke-a", "stroke-width": 2.5, fill: "none" }, svg);
      }
      s("line", { x1: cx - half + 6, y1: cy + 30, x2: cx - half - 10, y2: cy + 70, class: "wire" }, svg);
      s("line", { x1: cx + half - 2, y1: cy + 30, x2: cx + half + 10, y2: cy + 70, class: "wire" }, svg);
      label(svg, cx, cy + 108, `${N} ovojev (ena narisana zanka = 25 ovojev)`, "tick small");
      label(svg, cx, cy + 90, I ? `tok ${fmt(Math.abs(I), 1)} A ${I > 0 ? "→" : "←"}` : "ni toka", "lbl small");
      if (src.length) {
        label(svg, cx + half * Math.sign(str) + 18 * Math.sign(str), cy - 40, "N", "lbl big");
        label(svg, cx - half * Math.sign(str) - 18 * Math.sign(str), cy - 40, "S", "lbl big");
      }
      const clips = Math.floor(Math.abs(I * N) / 300);
      for (let i = 0; i < Math.min(clips, 8); i++) s("rect", { x: cx + half + 14 + (i % 4) * 12, y: cy + 4 + Math.floor(i / 4) * 12, width: 9, height: 4, rx: 2, class: "fill-muted" }, svg);
    } else {
      s("rect", { x: cx - half - 10, y: cy - 16, width: half + 10, height: 32, class: "fill-accent" }, svg);
      s("rect", { x: cx, y: cy - 16, width: half + 10, height: 32, class: "fill-danger" }, svg);
      label(svg, cx - half / 2, cy, "S", "lbl inv big");
      label(svg, cx + half / 2, cy, "N", "lbl inv big");
    }
    // kompasi
    const needle = (x, y, r = 14) => {
      if (!src.length) return s("circle", { cx: x, cy: y, r, class: "meter" }, svg);
      const [bx, by] = fieldAt(src, x, y), L = Math.hypot(bx, by) || 1, ux = bx / L, uy = by / L;
      s("circle", { cx: x, cy: y, r, class: "meter" }, svg);
      s("path", { d: `M${x + ux * r * 0.85},${y + uy * r * 0.85} L${x - uy * 3.5},${y + ux * 3.5} L${x + uy * 3.5},${y - ux * 3.5} Z`, class: "fill-danger" }, svg);
      s("path", { d: `M${x - ux * r * 0.85},${y - uy * r * 0.85} L${x - uy * 3.5},${y + ux * 3.5} L${x + uy * 3.5},${y - ux * 3.5} Z`, class: "fill-accent" }, svg);
    };
    if (grid) for (let gx = 30; gx < 340; gx += 46) for (let gy = 26; gy < 280; gy += 46) if (Math.abs(gy - cy) > 30 || Math.abs(gx - cx) > half + 14) needle(gx, gy, 9);
    needle(comp.x, comp.y, 16);
    const hc = handle(svg, "text", 1);
    hc.move(comp.x, comp.y);
    draggable(svg, hc, (x, y) => ((comp = { x: clamp(x, 16, 324), y: clamp(y, 16, 264) }), draw()));
    out.innerHTML = coil
      ? texBlock(`B = \\mu_0\\frac{N I}{l} = 4\\pi\\cdot 10^{-7}\\cdot\\frac{${N}\\cdot ${T(Math.abs(I), 1)}}{0{,}1\\ \\text{m}} = ${T((4e-7 * Math.PI * N * Math.abs(I)) / 0.1 * 1000, 2)}\\ \\text{mT}`) +
        `<p>Tuljava s tokom je <b>elektromagnet</b>: zunaj ima polje kot paličasti magnet, v notranjosti je polje skoraj homogeno. Ko obrneš tok, se zamenjata pola N in S. Brez toka polja ni.</p><p class="muted">Več ovojev in večji tok pomenita močnejši magnet (pritegne več sponk). Železno jedro polje še močno poveča.</p>`
      : `<p>Magnetne silnice izhajajo iz severnega pola (N) in vstopajo v južni pol (S). Severni (rdeči) konec kompasove igle kaže v smeri polja.</p><p class="muted">Povleci kompas okoli magneta. Tudi Zemlja je velik magnet: kompas kaže proti geografskemu severu, kjer je južni magnetni pol.</p>`;
  };
  const ctl = [toggle("pokaži mrežo kompasov", grid, (v) => ((grid = v), draw()))];
  if (coil) ctl.unshift(slider({ label: "tok I", min: -5, max: 5, step: 0.5, value: I, unit: "A", onInput: (v) => ((I = v), draw()) }), slider({ label: "število ovojev", min: 50, max: 500, step: 50, value: N, onInput: (v) => ((N = v), draw()) }));
  layout(el, { stage: [svg], controls: ctl, out, tryText: coil ? "Obrni smer toka. Kaj se zgodi s kompasom?" : "Kam kaže kompas tik ob sredini magneta?" });
  draw();
}

function zica(el) {
  const svg = svgBox(340, 300);
  const out = readout();
  let I = 10, probe = { x: 250, y: 150 };
  const draw = () => {
    svg.replaceChildren();
    const cx = 170, cy = 150;
    [30, 60, 95, 135].forEach((r) => {
      s("circle", { cx, cy, r, class: "graph-line stroke-muted thin-line", fill: "none", opacity: Math.abs(I) ? 0.7 : 0.15 }, svg);
      if (I) {
        const a = -Math.PI / 4, x = cx + r * Math.cos(a), y = cy + r * Math.sin(a), dir = I > 0 ? 1 : -1;
        const ux = -Math.sin(a) * -dir, uy = Math.cos(a) * -dir;
        s("path", { d: `M${x + ux * 6},${y + uy * 6} L${x - ux * 4 - uy * 4},${y - uy * 4 + ux * 4} L${x - ux * 4 + uy * 4},${y - uy * 4 - ux * 4} Z`, class: "fill-muted" }, svg);
      }
    });
    s("circle", { cx, cy, r: 13, class: "node" }, svg);
    if (I > 0) s("circle", { cx, cy, r: 4, class: "fill-text" }, svg);
    else if (I < 0) s("path", { d: `M${cx - 7},${cy - 7} L${cx + 7},${cy + 7} M${cx - 7},${cy + 7} L${cx + 7},${cy - 7}`, class: "string", "stroke-width": 2.5 }, svg);
    label(svg, cx, cy + 26, I > 0 ? "tok iz zaslona" : I < 0 ? "tok v zaslon" : "", "tick");
    const dx = probe.x - cx, dy = probe.y - cy, r = Math.hypot(dx, dy) || 1, rm = (r / 100) * 0.05;
    const B = (2e-7 * Math.abs(I)) / rm;
    if (I) {
      const dir = I > 0 ? 1 : -1, ux = (-dy / r) * dir, uy = (dx / r) * dir;
      const L = Math.min(90, B * 1e6), cut = B * 1e6 > 90; // 1 px na μT
      arrow(svg, probe.x, probe.y, probe.x - ux * L, probe.y - uy * L, "c", 3, cut ? { "stroke-dasharray": "6 4" } : {});
    }
    s("line", { x1: cx, y1: cy, x2: probe.x, y2: probe.y, class: "guide" }, svg);
    const hp = handle(svg, "c");
    hp.move(probe.x, probe.y);
    draggable(svg, hp, (x, y) => ((probe = { x: clamp(x, 10, 330), y: clamp(y, 10, 290) }), draw()));
    out.innerHTML = texBlock(`B = \\frac{\\mu_0 I}{2\\pi r} = \\frac{4\\pi\\cdot 10^{-7}\\cdot ${Math.abs(I)}}{2\\pi\\cdot ${T(rm * 100, 1)}\\cdot 10^{-2}} = ${T(B * 1e6, 1)}\\ \\mu\\text{T}`) +
      `<p>Okoli ravne žice s tokom so magnetne silnice <b>koncentrični krogi</b>. Smer določimo s <b>pravilom desne roke</b>: palec v smeri toka, prsti kažejo smer silnic. Polje pada z oddaljenostjo.</p>
       <p class="muted">Povleci vijolično točko. Za primerjavo: Zemljino polje je okoli 50 μT.</p>`;
  };
  layout(el, { stage: [svg], controls: [slider({ label: "tok I", min: -20, max: 20, step: 1, value: I, unit: "A", onInput: (v) => ((I = v), draw()) })], out, tryText: "Kolikokrat se zmanjša polje, ko se od žice oddaljiš za dvakrat večjo razdaljo?" });
  draw();
}

// ------------------------------------------------------------ magnetna sila na naboj
const PART = [["proton", "proton", 1, 1], ["devteron", "devteron", 1, 2], ["alfa", "delec alfa", 2, 4], ["anti", "antiproton", -1, 1]];
export function lorentz(el) {
  const svg = svgBox(340, 300);
  const out = readout();
  let part = "proton", v = 2, B = 0.2, into = true, st, trail;
  const reset = () => ((st = { x: 20, y: 150, vx: 1, vy: 0, t: 0 }), (trail = []));
  const params = () => {
    const [, , q, m] = PART.find((p) => p[0] === part);
    const r = (m * 1.67e-27 * v * 1e6) / (Math.abs(q) * 1.6e-19 * B);
    return { q, m, r, F: Math.abs(q) * 1.6e-19 * v * 1e6 * B };
  };
  const draw = () => {
    svg.replaceChildren();
    s("rect", { x: 80, y: 0, width: 260, height: 300, class: "fill-soft" }, svg);
    for (let x = 100; x < 340; x += 30) for (let y = 20; y < 300; y += 30) {
      if (into) s("path", { d: `M${x - 4},${y - 4} L${x + 4},${y + 4} M${x - 4},${y + 4} L${x + 4},${y - 4}`, class: "axis thin" }, svg);
      else s("circle", { cx: x, cy: y, r: 2.5, class: "fill-muted" }, svg);
    }
    label(svg, 210, 290, into ? "B kaže v zaslon (×)" : "B kaže iz zaslona (·)", "lbl small");
    {
      const pr0 = params(), R0 = pr0.r * 1000, up = (pr0.q > 0) === into; // 1 px = 1 mm
      s("path", { d: `M80,150 A${R0},${R0} 0 0 ${up ? 0 : 1} 80,${150 + (up ? -2 : 2) * R0}`, class: "graph-line stroke-c thin-line", "stroke-dasharray": "6 5", fill: "none", opacity: 0.7 }, svg);
      label(svg, 210, 274, `črtkano: pot v polju, r = ${fmt(R0 / 10, 1)} cm (1 cm = 10 px)`, "tick small");
    }
    if (trail.length > 1) s("path", { d: trail.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(""), class: "graph-line stroke-c thin-line", fill: "none" }, svg);
    const pr = params();
    s("circle", { cx: st.x, cy: st.y, r: 8, class: pr.q > 0 ? "fill-danger" : "fill-accent" }, svg);
    label(svg, st.x, st.y + 1, pr.q > 0 ? "+" : "−", "lbl inv");
    arrow(svg, st.x, st.y, st.x + st.vx * 15 * v, st.y + st.vy * 15 * v, "b", 2.5); // 15 px na 10⁶ m/s
    if (st.x > 80) {
      const sg = (pr.q > 0 ? 1 : -1) * (into ? 1 : -1), fl = pr.F * 1e14 * 1.5; // 1,5 px na 10⁻¹⁴ N
      arrow(svg, st.x, st.y, st.x + st.vy * sg * fl, st.y - st.vx * sg * fl, "c", 2.5);
    }
    out.innerHTML = texBlock(`F = e v B = ${T(pr.F * 1e14, 2)}\\cdot 10^{-14}\\ \\text{N},\\quad r = \\frac{m v}{e B} = ${T(pr.r * 100, 1)}\\ \\text{cm}`) +
      `<p>Magnetna sila (vijolična puščica) je vedno <b>pravokotna na hitrost</b> (turkizna puščica), zato spreminja le smer gibanja, ne velikosti hitrosti: delec kroži. ${pr.q < 0 ? "Negativni delec kroži v nasprotno smer." : ""}</p>
       <p class="muted">Večja masa ali hitrost → večji polmer; močnejše polje ali večji naboj → manjši polmer. Tako deluje masni spektrometer.</p>`;
  };
  const anim = animate(el, (dt) => {
    const pr = params(), w = 1 / Math.max(pr.r * 1000, 1e-6), sp = 50 * v; // hitrejši delec se tudi na sliki giblje hitreje
    for (let i = 0; i < 10; i++) {
      const h2 = (dt / 10) * sp;
      if (st.x > 80) {
        const sg = (pr.q > 0 ? 1 : -1) * (into ? 1 : -1), a = -sg * w * h2;
        const c = Math.cos(a), sn = Math.sin(a);
        [st.vx, st.vy] = [st.vx * c - st.vy * sn, st.vx * sn + st.vy * c];
      }
      st.x += st.vx * h2;
      st.y += st.vy * h2;
    }
    trail.push([st.x, st.y]);
    if (trail.length > 2000) trail.shift();
    draw();
    if (st.x < -10 || st.x > 350 || st.y < -10 || st.y > 310) return false;
  }, { autoplay: false });
  const restart = () => (anim.pause(), reset(), draw());
  const prevPlay = anim.play;
  anim.play = () => ((st.x < -10 || st.x > 350 || st.y < -10 || st.y > 310) && reset(), prevPlay());
  layout(el, {
    stage: [svg],
    controls: [
      select({ label: "delec", options: PART.map((p) => [p[0], p[1]]), value: part, onChange: (x) => ((part = x), restart()) }),
      slider({ label: "hitrost", min: 1, max: 4, step: 0.5, value: v, unit: "·10⁶ m/s", onInput: (x) => ((v = x), restart()) }),
      slider({ label: "gostota polja B", min: 0.1, max: 0.5, step: 0.05, value: B, unit: "T", onInput: (x) => ((B = x), restart()) }),
      toggle("polje kaže v zaslon", into, (x) => ((into = x), restart())),
      buttons(playButton(anim, { play: "Izstreli", pause: "Ustavi" }), button("Znova", restart)),
    ],
    out,
    tryText: "Izstreli proton in devteron z enako hitrostjo. Kolikšno je razmerje polmerov?",
  });
  reset();
  draw();
}

// ------------------------------------------------------------ elektromagnetna indukcija
export function indukcija(el) {
  const svg = svgBox(340, 200), svg2 = svgBox(340, 160);
  const out = readout();
  let N = 100, speed = 1, flip = false, xm = -1, t = 0, hist = [];
  const coilX = 210;
  const flux = (x) => 1 / (1 + ((x * 100 + 170 - coilX) / 45) ** 2);
  const emfAt = (x, vx) => {
    const dx = 0.001;
    return -N * ((flux(x + dx) - flux(x - dx)) / (2 * dx)) * vx * 0.02 * (flip ? -1 : 1);
  };
  let vx = 0;
  const draw = () => {
    svg.replaceChildren();
    svg2.replaceChildren();
    const mx = 170 + xm * 100;
    const loops = N / 20; // ena narisana zanka = 20 ovojev
    for (let i = 0; i < loops; i++) s("ellipse", { cx: coilX - 30 + (i * 60) / Math.max(1, loops - 1), cy: 90, rx: 5, ry: 34, class: "graph-line stroke-a", "stroke-width": 2.5, fill: "none" }, svg);
    s("path", { d: `M${coilX - 30},124 V170 H${coilX - 10} M${coilX + 30},124 V170 H${coilX + 10}`, class: "wire" }, svg);
    const e = emfAt(xm, vx);
    s("circle", { cx: coilX, cy: 172, r: 16, class: "meter" }, svg);
    const ang = clamp(e / 4, -1, 1) * 1.1;
    s("line", { x1: coilX, y1: 176, x2: coilX + Math.sin(ang) * 14, y2: 176 - Math.cos(ang) * 14, class: "graph-line stroke-danger", "stroke-width": 2 }, svg);
    s("rect", { x: mx - 50, y: 78, width: 50, height: 24, class: flip ? "fill-danger" : "fill-accent" }, svg);
    s("rect", { x: mx, y: 78, width: 50, height: 24, class: flip ? "fill-accent" : "fill-danger" }, svg);
    label(svg, mx - 25, 90, flip ? "N" : "S", "lbl inv");
    label(svg, mx + 25, 90, flip ? "S" : "N", "lbl inv");
    label(svg, coilX, 46, `${N} ovojev (zanka = 20)`, "tick small");
    label(svg, 10, 20, `inducirana napetost: ${fmt(e, 2)} V`, "lbl small", "start");
    const tw = 6, t0 = Math.max(0, t - tw);
    const X = (tt) => 40 + ((tt - t0) / tw) * 290, Y = (u) => 80 - u * 15;
    s("line", { x1: 40, y1: 80, x2: 334, y2: 80, class: "axis" }, svg2);
    s("line", { x1: 40, y1: 150, x2: 40, y2: 8, class: "axis" }, svg2);
    label(svg2, 46, 14, "U [V]", "axis-label", "start");
    label(svg2, 334, 94, "t", "axis-label", "end");
    [-4, -2, 2, 4].forEach((u) => label(svg2, 36, Y(u), String(u), "tick small", "end"));
    const d = hist.filter((p) => p[0] >= t0).map((p, i) => `${i ? "L" : "M"}${X(p[0]).toFixed(1)},${Y(clamp(p[1], -4.6, 4.6)).toFixed(1)}`).join("");
    if (d) s("path", { d, class: "graph-line stroke-c", fill: "none" }, svg2);
    out.innerHTML = texBlock(`U_i = -N\\frac{\\Delta\\Phi}{\\Delta t}`) +
      `<p>Napetost se inducira le, ko se magnetni pretok skozi tuljavo <b>spreminja</b>: ko magnet približujemo ali oddaljujemo. Ko miruje (tudi v tuljavi), napetosti ni.</p>
       <p class="muted">Hitrejše gibanje in več ovojev → večja napetost. Pri približevanju in oddaljevanju ima napetost nasprotna predznaka (Lenzovo pravilo: inducirani tok nasprotuje spremembi). Tako delujejo generatorji.</p>`;
  };
  const anim = animate(el, (dt) => {
    t += dt;
    const nx = -0.2 + 0.95 * Math.sin(t * speed * 1.4);
    vx = (nx - xm) / Math.max(dt, 1e-4);
    xm = nx;
    hist.push([t, emfAt(xm, vx)]);
    if (hist.length > 1500) hist.shift();
    draw();
  }, { autoplay: false });
  layout(el, {
    stage: [svg, svg2],
    controls: [
      slider({ label: "magnet (roka)", min: -1.2, max: 0.9, step: 0.01, value: xm, onInput: (x) => { anim.pause(); const dt = 0.05; vx = (x - xm) / dt; xm = x; t += dt; hist.push([t, emfAt(xm, vx)]); draw(); vx = 0; }, format: () => "" }),
      slider({ label: "hitrost", min: 0.5, max: 3, step: 0.5, value: speed, onInput: (x) => (speed = x) }),
      slider({ label: "število ovojev", min: 20, max: 200, step: 20, value: N, onInput: (x) => ((N = x), draw()) }),
      toggle("obrni magnet", flip, (x) => ((flip = x), draw())),
      buttons(playButton(anim, { play: "Premikaj magnet", pause: "Ustavi" })),
    ],
    out,
    tryText: "Kaj kaže voltmeter, ko je magnet v tuljavi in miruje? Kaj, ko ga hitro izvlečeš?",
  });
  draw();
}

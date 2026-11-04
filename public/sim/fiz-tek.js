// Simulacije za fizikalna tekmovanja: vzvod, škripci, kotaljenje, stoječe valovanje, Kirchhoffova pravila, dimenzijska analiza.
import { s, svgBox, slider, select, segmented, toggle, button, buttons, readout, layout, texBlock, fmt, clamp, label, arrow, animate, playButton, handle, draggable } from "./kit.js";
import { G, springPath } from "./fiz-skupno.js";

// ------------------------------------------------------------ vzvod: vzvod, škripci, kotaljenje
export function vzvod(el, { mode = "vzvod" } = {}) {
  if (mode === "skripec") return skripec(el);
  if (mode === "kotaljenje") return kotaljenje(el);
  const out = readout();
  const svg = svgBox(340, 220);
  let m1 = 4, m2 = 2, x1 = -2, x2 = 4;
  const scale = 26;
  const draw = () => {
    svg.replaceChildren();
    const M = m2 * x2 + m1 * x1; // navor (pozitivno: desna stran navzdol)
    const ang = clamp(M * 1.5, -14, 14) * (Math.PI / 180);
    const cx = 170, cy = 120;
    const P = (x) => [cx + x * scale * Math.cos(ang), cy + x * scale * Math.sin(ang)];
    s("path", { d: `M${cx} ${cy} l-16 40 h32 Z`, class: "fill-muted" }, svg);
    const [lx, ly] = P(-6), [rx, ry] = P(6);
    s("line", { x1: lx, y1: ly, x2: rx, y2: ry, class: "beam" }, svg);
    for (let i = -6; i <= 6; i++) {
      const [x, y] = P(i);
      s("circle", { cx: x, cy: y, r: 1.8, class: "fill-text" }, svg);
      if (i) label(svg, x, y + 14, String(Math.abs(i)), "tick small");
    }
    [[x1, m1, "a", (v) => (x1 = v)], [x2, m2, "b", (v) => (x2 = v)]].forEach(([x, m, col, set]) => {
      const [px, py] = P(x), sz = 12 * Math.cbrt(m); // prostornina uteži ∝ masa
      s("line", { x1: px, y1: py, x2: px, y2: py + 22, class: "string" }, svg);
      s("rect", { x: px - sz / 2, y: py + 22, width: sz, height: sz, rx: 3, class: `fill-${col}` }, svg);
      label(svg, px, py + 22 + sz / 2, `${m}`, "tick small b inv");
      arrow(svg, px, py + 26 + sz, px, py + 30 + sz + m * 6, "danger", 2);
      const hd = handle(svg, col);
      hd.move(px, py);
      draggable(svg, hd, (mx) => (set(clamp(Math.round((mx - cx) / scale), -6, 6) || (x < 0 ? -1 : 1)), draw(), info()));
    });
  };
  const info = () => {
    const net = m1 * x1 + m2 * x2;
    out.innerHTML = texBlock(`M_1 = m_1 g\\, r_1 = ${m1}\\cdot 9{,}81 \\cdot ${fmt(Math.abs(x1) * 0.1, 1)} = ${fmt(m1 * G * Math.abs(x1) * 0.1, 2)}\\ \\text{Nm} \\qquad M_2 = ${fmt(m2 * G * Math.abs(x2) * 0.1, 2)}\\ \\text{Nm}`) +
      `<p>${net === 0 ? '<b class="ok-text">Ravnovesje:</b> navora v nasprotnih smereh sta enaka.' : `Vzvod se zavrti tako, da se ${net > 0 ? "desna" : "leva"} stran spusti.`} Pogoj ravnovesja: vsota navorov je 0, F₁r₁ = F₂r₂.</p>
      <p class="muted">Ročica je razdalja od osi do prijemališča sile, razdelek je 10 cm. Uteži premikaš tako, da vlečeš točko na drogu.</p>`;
  };
  const upd = () => (draw(), info());
  upd();
  layout(el, {
    stage: svg,
    controls: [
      slider({ label: "masa 1 (oranžna)", min: 1, max: 8, value: m1, unit: "kg", onInput: (v) => ((m1 = v), upd()) }),
      slider({ label: "masa 2 (turkizna)", min: 1, max: 8, value: m2, unit: "kg", onInput: (v) => ((m2 = v), upd()) }),
    ],
    out,
    tryText: "Uravnovesi 4 kg na razdalji 2 z 2 kg. Kam moraš postaviti lažjo utež? Kaj pa, če sta obe na isti strani osi?",
  });
}

function skripec(el) {
  const out = readout();
  const svg = svgBox(340, 280);
  let sys = 1, m = 20, h = 0;
  const draw = () => {
    svg.replaceChildren();
    const n = [1, 2, 4][sys];
    s("rect", { x: 20, y: 6, width: 300, height: 10, class: "wall" }, svg);
    // breme se dvigne za 40 px, prosti konec vrvi pa za n-krat več (s = n·h)
    const lift = h * 40, yLoad = 200 - lift, bs = 26 * Math.cbrt(m / 20), fs = 0.12; // 0,12 px na N
    const F = (m * G) / n;
    let xr, yr0;
    if (n === 1) {
      s("circle", { cx: 170, cy: 50, r: 22, class: "pulley" }, svg);
      s("line", { x1: 170, y1: 16, x2: 170, y2: 50, class: "string" }, svg);
      s("line", { x1: 148, y1: 50, x2: 148, y2: yLoad, class: "string" }, svg);
      s("rect", { x: 148 - bs / 2, y: yLoad, width: bs, height: bs, rx: 4, class: "fill-a" }, svg);
      xr = 192;
      yr0 = 120;
    } else {
      const k = n / 2;
      for (let i = 0; i < k; i++) {
        s("circle", { cx: 150 + i * 30, cy: 46, r: 14, class: "pulley" }, svg);
        s("circle", { cx: 150 + i * 30, cy: yLoad - 30, r: 14, class: "pulley" }, svg);
      }
      for (let j = 0; j < n; j++) s("line", { x1: 136 + j * 15, y1: 46, x2: 136 + j * 15, y2: yLoad - 30, class: "string" }, svg);
      const cxl = 150 + (k - 1) * 15;
      s("line", { x1: cxl, y1: yLoad - 16, x2: cxl, y2: yLoad, class: "string" }, svg);
      s("rect", { x: cxl - bs / 2, y: yLoad, width: bs, height: bs, rx: 4, class: "fill-a" }, svg);
      xr = 136 + n * 15 + 8;
      yr0 = 90;
    }
    const yr = yr0 + n * lift;
    s("line", { x1: xr, y1: n === 1 ? 50 : 46, x2: xr, y2: yr, class: "string" }, svg);
    arrow(svg, xr, yr, xr, yr + F * fs, "danger", 3);
    label(svg, xr + 8, yr + (F * fs) / 2, "F", "lbl small", "start");
    const lx = n === 1 ? 148 : 150 + (n / 2 - 1) * 15;
    arrow(svg, lx, yLoad + bs, lx, yLoad + bs + m * G * fs, "text", 2);
    label(svg, 60, 120, `F = ${fmt(F, 0)} N`, "lbl fill-danger");
    label(svg, 60, 140, `teža = ${fmt(m * G, 0)} N`, "lbl small");
    label(svg, 60, 160, `vrv: ${fmt(n * h * 0.5, 2)} m, breme: ${fmt(h * 0.5, 2)} m`, "tick small");
    label(svg, 334, 272, "puščici sil v istem merilu", "tick small", "end");
  };
  const info = () => {
    const n = [1, 2, 4][sys];
    out.innerHTML = texBlock(`F = \\frac{mg}{n} = \\frac{${m}\\cdot 9{,}81}{${n}} = ${fmt((m * G) / n, 1)}\\ \\text{N} \\qquad s_{\\text{vrv}} = n \\cdot h`) +
      `<p>${n === 1 ? "<b>Stalni škripec</b> le spremeni smer sile, sila ostane enaka teži." : `Breme nosi <b>${n} krakov vrvi</b>, zato potrebujemo ${n}-krat manjšo silo. Za dvig bremena za 1 m pa moramo izvleči ${n} m vrvi.`}</p>
       <p class="muted">Delo je enako: F · s = (mg/n) · (n h) = mgh. Škripci prihranijo silo, ne pa dela (brez trenja in mase škripcev).</p>`;
  };
  const anim = animate(el, (dt) => {
    h = Math.min(1, h + dt * 0.4);
    draw();
    if (h >= 1) return false;
  }, { autoplay: false });
  const upd = () => (draw(), info());
  upd();
  layout(el, {
    stage: svg,
    controls: [
      segmented({ options: [["0", "stalni škripec"], ["1", "gibljivi škripec"], ["2", "škripčevje"]], value: String(sys), onChange: (v) => ((sys = +v), (h = 0), upd()) }),
      slider({ label: "masa bremena", min: 5, max: 100, step: 5, value: m, unit: "kg", onInput: (v) => ((m = v), upd()) }),
      buttons(playButton(anim, { play: "Dvigni", pause: "Ustavi" }), button("Spusti", () => ((h = 0), anim.pause(), draw()))),
    ],
    out,
    tryText: "S koliko silo dvigneš 80 kg s škripčevjem s štirimi kraki? Koliko vrvi izvlečeš za dvig 2 m?",
  });
}

function kotaljenje(el) {
  const out = readout();
  const svg = svgBox(340, 230);
  let deg = 20, t = 0;
  const bodies = [["drsenje brez trenja", 0, "accent"], ["krogla", 0.4, "a"], ["valj", 0.5, "b"], ["obroč", 1, "c"]];
  const L = 3;
  const draw = () => {
    svg.replaceChildren();
    const a = (deg * Math.PI) / 180;
    // klanec (ikona)
    s("path", { d: `M10 60 L90 60 L10 ${60 - 80 * Math.tan(a) * 0.6} Z`, class: "ground", opacity: 0.5 }, svg);
    label(svg, 70, 52, `${deg}°`, "tick small b");
    bodies.forEach(([name, k, col], i) => {
      const acc = (G * Math.sin(a)) / (1 + k), d = Math.min(L, 0.5 * acc * t * t), u = d / L, y = 95 + i * 34;
      s("line", { x1: 30, y1: y + 13, x2: 320, y2: y + 13, class: "thin-line" }, svg);
      s("line", { x1: 320, y1: y - 8, x2: 320, y2: y + 16, class: "stroke-danger", "stroke-width": 2 }, svg);
      const x = 42 + u * 266;
      if (k === 0) s("rect", { x: x - 11, y: y - 9, width: 22, height: 22, rx: 3, class: `fill-${col}` }, svg);
      else if (k === 1) s("circle", { cx: x, cy: y, r: 11, fill: "none", class: `stroke-${col}`, "stroke-width": 4 }, svg);
      else {
        s("circle", { cx: x, cy: y, r: 12, class: `fill-${col}`, opacity: k === 0.5 ? 0.7 : 1 }, svg);
        const r = d / 0.12; // zasuk
        s("line", { x1: x, y1: y, x2: x + 11 * Math.cos(r), y2: y + 11 * Math.sin(r), class: "stroke-text", "stroke-width": 1.5 }, svg);
      }
      const tt = Math.sqrt((2 * L) / acc);
      label(svg, 30, y - 16, `${name}: ${fmt(tt, 2)} s`, `tick small fill-${col}`, "start");
    });
  };
  const info = () => {
    out.innerHTML = texBlock(`a = \\frac{g \\sin\\alpha}{1 + \\frac{J}{mr^2}}`) +
      `<p>Pri kotaljenju se del potencialne energije pretvori v <b>energijo vrtenja</b>, zato se telo giblje počasneje kot pri drsenju brez trenja. Vztrajnostni moment J/(mr²): krogla 2/5, valj 1/2, obroč 1. Masa in polmer na hitrost ne vplivata.</p>
       <p class="muted">Časi so za 3 m dolg klanec. Proge kažejo, koliko poti je vsako telo že opravilo.</p>`;
  };
  const anim = animate(el, (dt) => {
    t += dt;
    draw();
    if (t > 4) return false;
  }, { autoplay: false });
  draw();
  info();
  layout(el, {
    stage: svg,
    controls: [
      slider({ label: "naklon", min: 5, max: 45, value: deg, unit: "°", onInput: (v) => ((deg = v), (t = 0), draw()) }),
      buttons(playButton(anim, { play: "Spusti", pause: "Ustavi" }), button("Znova", () => ((t = 0), anim.pause(), draw()))),
    ],
    out,
    tryText: "Katero telo pride prvo na dno: krogla, valj ali obroč? Ali je vrstni red odvisen od naklona?",
  });
}

// ------------------------------------------------------------ stojece: stoječe valovanje na struni
export function stojece(el) {
  const out = readout();
  const svg = svgBox(340, 180);
  let n = 2, Lm = 0.65, v = 240, t = 0;
  const draw = () => {
    svg.replaceChildren();
    const x0 = 20, x1 = 20 + Lm * 250, y0 = 90, A = 45; // dolžina strune v merilu (250 px na meter)
    s("rect", { x: x0 - 8, y: 40, width: 8, height: 100, class: "wall" }, svg);
    s("rect", { x: x1, y: 40, width: 8, height: 100, class: "wall" }, svg);
    const env = (u, sg) => `M${x0} ${y0} ` + Array.from({ length: 101 }, (_, i) => `L${x0 + ((x1 - x0) * i) / 100} ${y0 + sg * A * Math.sin((n * Math.PI * i) / 100)}`).join(" ");
    s("path", { d: env(0, 1), class: "guide", fill: "none" }, svg);
    s("path", { d: env(0, -1), class: "guide", fill: "none" }, svg);
    const c = Math.cos(t * 2 * Math.PI * ((n * v) / (2 * Lm) / 400)); // nihanje upočasnjeno 400-krat
    s("path", { d: `M${x0} ${y0} ` + Array.from({ length: 151 }, (_, i) => `L${x0 + ((x1 - x0) * i) / 150} ${y0 + c * A * Math.sin((n * Math.PI * i) / 150)}`).join(" "), class: "graph-line", fill: "none" }, svg);
    for (let k = 0; k <= n; k++) {
      s("circle", { cx: x0 + ((x1 - x0) * k) / n, cy: y0, r: 4.5, class: "fill-danger" }, svg);
      if (k < n) s("circle", { cx: x0 + ((x1 - x0) * (k + 0.5)) / n, cy: y0 - A - 8, r: 3, class: "fill-b" }, svg);
    }
    label(svg, 170, 165, `λ = 2L/n = ${fmt((2 * Lm) / n, 3)} m`, "tick small b");
  };
  const info = () => {
    const f = (n * v) / (2 * Lm);
    out.innerHTML = texBlock(`f_n = \\frac{n\\,c}{2L} = \\frac{${n}\\cdot ${v}}{2\\cdot ${fmt(Lm, 2)}} = ${fmt(f, 0)}\\ \\text{Hz}`) +
      `<p>Na struni, vpeti na obeh koncih, nastane stoječe valovanje le, če gre na dolžino strune celo število polovic valovne dolžine: L = n·λ/2. Rdeče točke so <b>vozli</b> (ne nihajo), turkizne <b>hrbti</b>. ${n === 1 ? "To je osnovni ton." : `To je ${n}. lastno nihanje (${n - 1}. višji harmonik).`}</p>
       <p class="muted">Hitrost valovanja na struni je c = √(F/μ): bolj napeta struna da višji ton. Dolžina strune je v merilu, nihanje pa je upočasnjeno 400-krat (višja frekvenca → hitrejše nihanje).</p>`;
  };
  animate(el, (dt) => {
    t += dt;
    draw();
  });
  const upd = () => (draw(), info());
  upd();
  layout(el, {
    stage: svg,
    controls: [
      slider({ label: "harmonik n", min: 1, max: 7, value: n, onInput: (x) => ((n = x), upd()) }),
      slider({ label: "dolžina strune", min: 0.3, max: 1.2, step: 0.05, value: Lm, unit: "m", onInput: (x) => ((Lm = x), upd()) }),
      slider({ label: "hitrost valovanja", min: 100, max: 500, step: 10, value: v, unit: "m/s", onInput: (x) => ((v = x), upd()) }),
    ],
    out,
    tryText: "Kitarska struna je dolga 0,65 m. Koliko vozlov ima 3. lastno nihanje? Kako se frekvenca spremeni, če struno skrajšaš na polovico?",
  });
}

// ------------------------------------------------------------ kirchhoff: vezje z dvema zankama
export function kirchhoff(el) {
  const out = readout();
  const svg = svgBox(340, 240);
  let E1 = 12, E2 = 6, R1 = 4, R2 = 2, R3 = 6, ph = 0;
  const solve = () => {
    const V = (E1 / R1 + E2 / R2) / (1 / R1 + 1 / R2 + 1 / R3);
    return { V, I1: (E1 - V) / R1, I2: (E2 - V) / R2, I3: V / R3 };
  };
  const draw = () => {
    svg.replaceChildren();
    const { I1, I2, I3 } = solve();
    const xs = [40, 170, 300], yT = 40, yB = 200;
    s("path", { d: `M${xs[0]} ${yT} H${xs[2]} M${xs[0]} ${yB} H${xs[2]}`, class: "wire" }, svg);
    xs.forEach((x) => s("line", { x1: x, y1: yT, x2: x, y2: yB, class: "wire" }, svg));
    // baterije na levi in desni veji, upori nad njimi
    [[xs[0], E1, "E₁"], [xs[2], E2, "E₂"]].forEach(([x, E, n]) => {
      s("rect", { x: x - 16, y: 140, width: 32, height: 22, class: "bg-cut" }, svg);
      s("line", { x1: x - 14, y1: 146, x2: x + 14, y2: 146, class: "batt-long" }, svg);
      s("line", { x1: x - 8, y1: 156, x2: x + 8, y2: 156, class: "batt-short" }, svg);
      label(svg, x + (x < 170 ? 18 : -18), 170, `${n} = ${E} V`, "tick small b", x < 170 ? "start" : "end");
    });
    [[xs[0], R1, "R₁"], [xs[1], R3, "R₃"], [xs[2], R2, "R₂"]].forEach(([x, R, n]) => {
      s("rect", { x: x - 8, y: 72, width: 16, height: 40, class: "resistor" }, svg);
      label(svg, x + (x === 300 ? -12 : 12), 92, `${n} = ${R} Ω`, "tick small", x === 300 ? "end" : "start");
    });
    // tokovi
    [[xs[0], I1, "I₁"], [xs[1], I3, "I₃", true], [xs[2], I2, "I₂"]].forEach(([x, I, n, mid]) => {
      const up = mid ? I < 0 : I > 0; // v stranskih vejah pozitiven tok teče navzgor (iz baterije)
      const y1 = up ? 130 : 56, y2 = up ? 56 : 130;
      const ax = x + (x > 170 ? 14 : -14);
      arrow(svg, ax, y1, ax, y2, "danger", 2);
      label(svg, x, 220, `${n} = ${fmt(Math.abs(I), 2)} A`, "tick small b fill-danger");
      const sp = Math.abs(I);
      for (let k = 0; k < 4; k++) {
        let u = (ph * sp * 0.6 + k / 4) % 1;
        if (!up) u = 1 - u;
        s("circle", { cx: x, cy: yB - u * (yB - yT), r: 3, class: "electron", opacity: 0.8 }, svg);
      }
    });
    s("circle", { cx: xs[1], cy: yT, r: 4, class: "fill-text" }, svg);
    s("circle", { cx: xs[1], cy: yB, r: 4, class: "fill-text" }, svg);
  };
  const info = () => {
    const { V, I1, I2, I3 } = solve();
    out.innerHTML = texBlock(`I_1 + I_2 = I_3: \\quad ${fmt(I1, 2)} ${I2 < 0 ? "+ (" + fmt(I2, 2) + ")" : "+ " + fmt(I2, 2)} = ${fmt(I3, 2)}\\ \\text{A}`) +
      texBlock(`E_1 - I_1R_1 - I_3R_3 = ${E1} - ${fmt(I1 * R1, 2)} - ${fmt(I3 * R3, 2)} = 0`) +
      `<p><b>1. Kirchhoffovo pravilo</b> (vozlišče): vsota tokov v vozlišče je enaka vsoti tokov iz njega. <b>2. pravilo</b> (zanka): vsota napetosti okoli zaključene zanke je 0. Napetost na srednjem uporu je ${fmt(V, 2)} V.</p>
       <p class="muted">${I2 < 0 ? "Tok I₂ je negativen: skozi baterijo E₂ teče v nasprotni smeri (baterija se polni)." : "Rdeče puščice kažejo dejanske smeri tokov."}</p>`;
  };
  animate(el, (dt) => {
    ph += dt;
    draw();
  });
  const upd = () => (draw(), info());
  upd();
  layout(el, {
    stage: svg,
    controls: [
      slider({ label: "E₁", min: 0, max: 24, value: E1, unit: "V", onInput: (v) => ((E1 = v), upd()) }),
      slider({ label: "E₂", min: 0, max: 24, value: E2, unit: "V", onInput: (v) => ((E2 = v), upd()) }),
      slider({ label: "R₁", min: 1, max: 20, value: R1, unit: "Ω", onInput: (v) => ((R1 = v), upd()) }),
      slider({ label: "R₂", min: 1, max: 20, value: R2, unit: "Ω", onInput: (v) => ((R2 = v), upd()) }),
      slider({ label: "R₃", min: 1, max: 20, value: R3, unit: "Ω", onInput: (v) => ((R3 = v), upd()) }),
    ],
    out,
    tryText: "Kdaj skozi baterijo E₂ ne teče tok? Poišči E₂, pri katerem je I₂ = 0.",
  });
}

// ------------------------------------------------------------ dimenzije: dimenzijska analiza
const DIM = {
  nihalo: ["nihajni čas nihala T", [0, 0, 1], [["dolžina l", [1, 0, 0]], ["pospešek g", [1, 0, -2]], ["masa m", [0, 1, 0]]], "T = 2π √(l/g): masa ne vpliva."],
  struna: ["hitrost valovanja na struni c", [1, 0, -1], [["sila F", [1, 1, -2]], ["dolžinska gostota μ", [-1, 1, 0]], ["dolžina L", [1, 0, 0]]], "c = √(F/μ)."],
  padanje: ["čas padanja t", [0, 0, 1], [["višina h", [1, 0, 0]], ["pospešek g", [1, 0, -2]], ["masa m", [0, 1, 0]]], "t = √(2h/g)."],
  vzmet: ["nihajni čas na vzmeti T", [0, 0, 1], [["masa m", [0, 1, 0]], ["koeficient vzmeti k", [0, 1, -2]], ["amplituda A", [1, 0, 0]]], "T = 2π √(m/k): amplituda ne vpliva."],
  kapljica: ["frekvenca nihanja kapljice f", [0, 0, -1], [["površinska napetost σ", [0, 1, -2]], ["gostota ρ", [-3, 1, 0]], ["polmer r", [1, 0, 0]]], "f ∝ √(σ/(ρ r³))."],
};
export function dimenzije(el) {
  const out = readout();
  let k = "nihalo", e = [0, 0, 0];
  const unit = (v) => ["m", "kg", "s"].map((u, i) => (v[i] ? `${u}${v[i] === 1 ? "" : "^{" + fmt(v[i], 1).replace(",", "{,}") + "}"}` : "")).filter(Boolean).join("\\,") || "1";
  const info = () => {
    const [name, target, vars, note] = DIM[k];
    const res = [0, 1, 2].map((d) => vars.reduce((t, [, u], i) => t + e[i] * u[d], 0));
    const ok = res.every((x, i) => Math.abs(x - target[i]) < 1e-9);
    out.innerHTML = texBlock(`[${name.split(" ").pop()}] = ${vars.map(([n, u], i) => `[${n.split(" ").pop()}]^{${fmt(e[i], 1).replace(",", "{,}")}}`).join("\\,")} = ${unit(res)} \\quad ${ok ? "=" : "\\neq"} \\quad ${unit(target)}`) +
      `<p>${ok ? `<b class="ok-text">Enote se ujemajo!</b> ${name} ∝ ${vars.map(([n], i) => (e[i] ? `${n.split(" ").pop()}${e[i] === 1 ? "" : `^${fmt(e[i], 1)}`}` : "")).filter(Boolean).join(" · ")}. ${note}` : `Izberi eksponente tako, da bodo enote na desni enake enotam količine ${name} (${unit(target).replace(/\\,/g, " ")}).`}</p>
       <p class="muted">Enote: ${vars.map(([n, u]) => `${n}: ${unit(u).replace(/\\,/g, " ").replace(/\^\{([^}]*)\}/g, "^$1")}`).join("; ")}. Dimenzijska analiza ne da brezdimenzijske konstante (npr. 2π).</p>`;
  };
  const sls = [0, 1, 2].map((i) => slider({ label: DIM[k][2][i][0], min: -2, max: 2, step: 0.5, value: 0, onInput: (v) => ((e[i] = v), info()) }));
  const relabel = () => sls.forEach((sl, i) => ((sl.querySelector(".demo-slider-label").textContent = `eksponent: ${DIM[k][2][i][0]}`), sl.set(0, true), (e[i] = 0)));
  relabel();
  info();
  layout(el, {
    controls: [select({ label: "količina", options: Object.entries(DIM).map(([key, v]) => [key, v[0]]), value: k, onChange: (v) => ((k = v), relabel(), info()) }), ...sls],
    out,
    tryText: "Ugotovi, kako je nihajni čas nihala odvisen od dolžine in g. Zakaj mora biti eksponent mase 0?",
  });
}

// Simulacije pri fiziki: delci in temperatura, agregatna stanja, toplota, prenos toplote, raztezanje, p–V diagram.
import { s, svgBox, slider, select, segmented, toggle, button, buttons, readout, layout, texBlock, fmt, tfmt, clamp, label, arrow, animate, playButton } from "./kit.js";
import { timeGraph } from "./fiz-skupno.js";

const T = (x, d = 2) => tfmt(x, d);

// ------------------------------------------------------------ delci: temperatura in agregatna stanja
export function delci(el, { mode = "temperatura" } = {}) {
  const svg = svgBox(340, 240);
  const out = readout();
  const snovi = mode === "snovi";
  let Tc = snovi ? 20 : 20, state = "trdno";
  const N = snovi ? 36 : 40;
  const box = { x: snovi ? 40 : 20, y: 20, w: snovi ? 260 : 200, h: 200 };
  const P = Array.from({ length: N }, (_, i) => ({ x: 0, y: 0, vx: 0, vy: 0, hx: 0, hy: 0, i }));
  const speed = () => 14 * Math.sqrt((Tc + 273) / 293);
  const place = () => {
    const cols = 6, gap = 20;
    P.forEach((p, i) => {
      p.hx = box.x + box.w / 2 + ((i % cols) - (cols - 1) / 2) * gap;
      p.hy = box.y + box.h - 14 - Math.floor(i / cols) * gap;
      p.x = snovi && state !== "plin" ? p.hx : box.x + 10 + Math.random() * (box.w - 20);
      p.y = snovi && state !== "plin" ? p.hy : box.y + 10 + Math.random() * (box.h - 20);
      const a = Math.random() * 2 * Math.PI, v = speed() * (0.5 + Math.random());
      p.vx = v * Math.cos(a);
      p.vy = v * Math.sin(a);
    });
  };
  const dots = [];
  const draw = () => {
    svg.replaceChildren();
    s("rect", { x: box.x, y: box.y, width: box.w, height: box.h, rx: 6, class: "box" }, svg);
    dots.length = 0;
    P.forEach((p, i) => dots.push(s("circle", { cx: p.x, cy: p.y, r: 7, class: `particle fill-${i === 0 ? "c" : snovi ? "b" : "a"}` }, svg)));
    if (!snovi) {
      // termometer in porazdelitev hitrosti
      const tx = 270, ty0 = 30, ty1 = 200, hT = clamp((Tc + 50) / 250, 0, 1) * (ty1 - ty0);
      s("rect", { x: tx - 7, y: ty0, width: 14, height: ty1 - ty0, rx: 7, class: "box" }, svg);
      s("rect", { x: tx - 4, y: ty1 - hT, width: 8, height: hT, rx: 4, class: "fill-danger" }, svg);
      s("circle", { cx: tx, cy: ty1 + 10, r: 11, class: "fill-danger" }, svg);
      [-50, 0, 50, 100, 150, 200].forEach((c) => {
        const y = ty1 - ((c + 50) / 250) * (ty1 - ty0);
        s("line", { x1: tx + 8, y1: y, x2: tx + 14, y2: y, class: "axis thin" }, svg);
        label(svg, tx + 17, y, `${c} °C`, "tick small", "start");
      });
    }
  };
  const move = (dt) => {
    const v0 = speed();
    P.forEach((p, i) => {
      if (snovi && state === "trdno") {
        const amp = 0.6 + v0 / 12;
        p.x = p.hx + Math.sin(performance.now() / 90 + i * 1.7) * amp;
        p.y = p.hy + Math.cos(performance.now() / 77 + i * 2.3) * amp;
      } else {
        const sp = Math.hypot(p.vx, p.vy) || 1, target = v0 * (0.5 + ((i * 37) % 10) / 10) * (snovi && state === "tekoce" ? 0.6 : 1);
        p.vx *= 1 + (target / sp - 1) * 0.1;
        p.vy *= 1 + (target / sp - 1) * 0.1;
        if (snovi && state === "tekoce") p.vy += 60 * dt;
        p.x += p.vx * dt * 4;
        p.y += p.vy * dt * 4;
        const top = snovi && state === "tekoce" ? box.y + box.h - 14 * 6 - 6 : box.y + 8;
        if (p.x < box.x + 8) (p.x = box.x + 8), (p.vx = Math.abs(p.vx));
        if (p.x > box.x + box.w - 8) (p.x = box.x + box.w - 8), (p.vx = -Math.abs(p.vx));
        if (p.y < top) (p.y = top), (p.vy = Math.abs(p.vy));
        if (p.y > box.y + box.h - 8) (p.y = box.y + box.h - 8), (p.vy = -Math.abs(p.vy));
      }
      dots[i]?.setAttribute("cx", p.x.toFixed(1));
      dots[i]?.setAttribute("cy", p.y.toFixed(1));
    });
  };
  const info = () => {
    out.innerHTML = snovi
      ? {
          trdno: "<p><b>Trdna snov:</b> delci so tesno skupaj in urejeni, le nihajo okoli svojih leg. Snov ima stalno obliko in prostornino.</p>",
          tekoce: "<p><b>Kapljevina:</b> delci so blizu skupaj, a se lahko premikajo drug mimo drugega. Snov ima stalno prostornino, obliko pa prevzame po posodi.</p>",
          plin: "<p><b>Plin:</b> delci so daleč narazen in se hitro gibljejo v vse smeri. Plin zapolni ves prostor in ga lahko stisnemo.</p>",
        }[state] + `<p class="muted">Z višanjem temperature se delci gibljejo hitreje. Ko jih dovolj segrejemo, se snov stali (trdno → kapljevina) ali izpari (kapljevina → plin).</p>`
      : texBlock(`T = t + 273 = ${Tc} + 273 = ${Tc + 273}\\ \\text{K}`) +
        `<p>Delci se gibljejo neurejeno. Višja temperatura pomeni <b>hitrejše gibanje delcev</b> (večjo povprečno kinetično energijo), zato ima telo več notranje energije.</p>
         <p class="muted">Vijolični delec sledi enemu delcu. Pri absolutni ničli (−273 °C = 0 K) bi se gibanje delcev ustavilo.</p>`;
  };
  const anim = animate(el, (dt) => move(dt), { autoplay: true });
  const ctl = [];
  if (snovi) ctl.push(segmented({ options: [["trdno", "trdno"], ["tekoce", "kapljevina"], ["plin", "plin"]], value: state, onChange: (v) => ((state = v), place(), draw(), info()) }));
  ctl.push(slider({ label: "temperatura", min: snovi ? -20 : -200, max: snovi ? 120 : 200, step: 10, value: Tc, unit: "°C", onInput: (v) => ((Tc = v), info(), snovi || draw()) }));
  ctl.push(buttons(playButton(anim, { play: "Predvajaj", pause: "Ustavi" })));
  layout(el, { stage: [svg], controls: ctl, out, tryText: snovi ? "Primerjaj, kako daleč narazen so delci v trdni snovi, kapljevini in plinu." : "Ohladi na −200 °C in segrej na 200 °C. Kolikokrat se poveča povprečna hitrost delcev?" });
  place();
  draw();
  info();
}

// ------------------------------------------------------------ toplota: segrevanje in mešanje
const SUB = [["voda", "voda", 4200], ["olje", "olje", 2000], ["aluminij", "aluminij", 900], ["zelezo", "železo", 450]];
const RHO = { voda: 1000, olje: 920, aluminij: 2700, zelezo: 7870 };
export function mesanje(el, { mode = "segrevanje" } = {}) {
  if (mode === "mesanje") return mesanjeVode(el);
  const svg = svgBox(340, 200), svg2 = svgBox(340, 190);
  const out = readout();
  let sub = "voda", m = 1, P = 1000, t = 0;
  const tMax = 600, T0 = 20;
  const temp = (tt) => {
    const c = SUB.find((q) => q[0] === sub)[2], Q = P * tt, Tlin = T0 + Q / (m * c);
    if (sub !== "voda" || Tlin <= 100) return Tlin;
    const Qb = m * c * 80, Qv = 2.26e6 * m;
    return Q - Qb < Qv ? 100 : 100 + (Q - Qb - Qv) / (m * 2000);
  };
  const draw = () => {
    svg.replaceChildren();
    const Tn = temp(t);
    s("rect", { x: 90, y: 160, width: 120, height: 14, rx: 4, class: "fill-danger", opacity: 0.4 + 0.6 * Math.min(1, P / 3000) }, svg);
    label(svg, 150, 188, `grelnik ${P} W`, "tick");
    s("path", { d: "M100,60 V156 H200 V60", class: "beaker" }, svg);
    const hv = (m / RHO[sub]) * 1000 * 40; // višina je sorazmerna s prostornino (40 px na liter)
    s("rect", { x: 101, y: 156 - hv, width: 98, height: hv, class: sub === "voda" ? "fill-b" : "fill-a", opacity: 0.4 }, svg);
    if (sub === "voda" && Tn >= 99.9) for (let i = 0; i < 6; i++) s("circle", { cx: 112 + i * 16, cy: 120 + ((t * 7 + i * 13) % 30), r: 3, class: "stroke-b", fill: "none", "stroke-width": 1.5 }, svg);
    s("rect", { x: 250, y: 30, width: 12, height: 130, rx: 6, class: "box" }, svg);
    const ht = clamp(Tn / 150, 0, 1) * 120;
    s("rect", { x: 253, y: 156 - ht, width: 6, height: ht, rx: 3, class: "fill-danger" }, svg);
    label(svg, 270, 156 - ht, `${fmt(Tn, 1)} °C`, "lbl small", "start");
    svg2.replaceChildren();
    timeGraph(svg2, { tMax, y0: 0, y1: 150, yLabel: "T [°C]", f: temp, t, cls: "stroke-danger", yStep: 25 });
    const c = SUB.find((q) => q[0] === sub)[2];
    const Q = P * t;
    out.innerHTML = texBlock(`Q = P\\,t = ${P}\\ \\text{W}\\cdot ${T(t, 0)}\\ \\text{s} = ${T(Q / 1000, 1)}\\ \\text{kJ}`) +
      (Tn < 100 || sub !== "voda" ? texBlock(`\\Delta T = \\frac{Q}{m c} = \\frac{${T(Q, 0)}}{${T(m, 1)}\\cdot ${c}} = ${T(Tn - T0, 1)}\\ \\text{K}`) : "") +
      `<p>Specifična toplota ${SUB.find((q) => q[0] === sub)[1]} je c = ${c} J/(kg K): toliko toplote potrebuje 1 kg, da se segreje za 1 K. ${sub === "voda" ? "Voda ima zelo veliko c, zato se počasi segreva in počasi ohlaja." : ""}</p>
       <p class="muted">${sub === "voda" ? "Pri 100 °C voda vre: dovedena toplota se porablja za izparevanje, temperatura se ne spreminja (vodoravni del grafa)." : "Graf je premica: temperatura narašča enakomerno, dokler je moč grelnika stalna."}</p>`;
  };
  const anim = animate(el, (dt) => {
    t = Math.min(tMax, t + dt * 60);
    draw();
    if (t >= tMax) return false;
  }, { autoplay: false });
  const restart = () => (anim.pause(), (t = 0), draw());
  const prevPlay = anim.play;
  anim.play = () => ((t >= tMax && (t = 0)), prevPlay());
  layout(el, {
    stage: [svg, svg2],
    controls: [
      select({ label: "snov", options: SUB.map((q) => [q[0], `${q[1]} (c = ${q[2]} J/kg K)`]), value: sub, onChange: (v) => ((sub = v), restart()) }),
      slider({ label: "masa", min: 0.5, max: 2, step: 0.1, value: m, unit: "kg", onInput: (v) => ((m = v), restart()) }),
      slider({ label: "moč grelnika", min: 500, max: 3000, step: 100, value: P, unit: "W", onInput: (v) => ((P = v), restart()) }),
      buttons(playButton(anim, { play: "Segrevaj (60× hitreje)", pause: "Ustavi" }), button("Na začetek", restart)),
    ],
    out,
    tryText: "Koliko časa potrebuje grelnik z 2000 W, da 1 kg vode segreje od 20 °C do vrelišča?",
  });
  draw();
}

function mesanjeVode(el) {
  const svg = svgBox(340, 200);
  const out = readout();
  let m1 = 2, T1 = 80, m2 = 1, T2 = 20, sub2 = "voda";
  const draw = () => {
    svg.replaceChildren();
    const c1 = 4200, c2 = SUB.find((q) => q[0] === sub2)[2];
    const Tk = (m1 * c1 * T1 + m2 * c2 * T2) / (m1 * c1 + m2 * c2);
    const col = (TT) => `hsl(${clamp(220 - TT * 2.2, 0, 220)} 75% 55%)`;
    const beaker = (x, V, TT, name, w = 70) => {
      s("path", { d: `M${x},60 V170 H${x + w} V60`, class: "beaker" }, svg);
      const hh = V * 16; // 16 px na liter: višina je sorazmerna s prostornino
      s("rect", { x: x + 1, y: 169 - hh, width: w - 2, height: hh, fill: col(TT), opacity: 0.55 }, svg);
      label(svg, x + w / 2, 186, name, "tick");
      label(svg, x + w / 2, 50, `${fmt(TT, 1)} °C`, "lbl small");
    };
    const V1 = m1, V2 = (m2 / RHO[sub2]) * 1000;
    beaker(20, V1, T1, `voda ${m1} kg`);
    beaker(110, V2, T2, `${SUB.find((q) => q[0] === sub2)[1]} ${m2} kg`);
    arrow(svg, 196, 115, 226, 115, "text", 2);
    beaker(240, V1 + V2, Tk, "po mešanju", 80);
    const Qod = m1 * c1 * (T1 - Tk), Qpr = m2 * c2 * (Tk - T2);
    out.innerHTML = texBlock(`m_1 c_1 (T_1 - T_k) = m_2 c_2 (T_k - T_2)`) + texBlock(`T_k = \\frac{m_1 c_1 T_1 + m_2 c_2 T_2}{m_1 c_1 + m_2 c_2} = ${T(Tk, 1)}\\ ^\\circ\\text{C}`) +
      `<p>Toplejša voda odda ${fmt(Qod / 1000, 1)} kJ toplote, hladnejša ${sub2 === "voda" ? "voda" : "snov"} prejme ${fmt(Qpr / 1000, 1)} kJ. <b>Oddana toplota = prejeta toplota</b> (toplotna bilanca, če ni izgub).</p>
       <p class="muted">Končna temperatura je vedno med obema začetnima. ${sub2 === "voda" ? "Pri enakih snoveh je to tehtano povprečje po masah." : "Snov z manjšo specifično toploto spremeni temperaturo bolj."}</p>`;
  };
  layout(el, {
    stage: [svg],
    controls: [
      slider({ label: "m₁ (topla voda)", min: 0.5, max: 3, step: 0.5, value: m1, unit: "kg", onInput: (v) => ((m1 = v), draw()) }),
      slider({ label: "T₁", min: 30, max: 100, step: 5, value: T1, unit: "°C", onInput: (v) => ((T1 = v), draw()) }),
      select({ label: "druga snov", options: SUB.map((q) => [q[0], q[1]]), value: sub2, onChange: (v) => ((sub2 = v), draw()) }),
      slider({ label: "m₂", min: 0.5, max: 3, step: 0.5, value: m2, unit: "kg", onInput: (v) => ((m2 = v), draw()) }),
      slider({ label: "T₂", min: 0, max: 30, step: 5, value: T2, unit: "°C", onInput: (v) => ((T2 = v), draw()) }),
    ],
    out,
    tryText: "Zmešaj 1 kg vode s 80 °C in 1 kg vode z 20 °C. Kaj pa, če hladne vode vzameš 3 kg?",
  });
  draw();
}

// ------------------------------------------------------------ prenos toplote
const COND = [["baker", "baker", 1.0], ["aluminij", "aluminij", 0.6], ["zelezo", "železo", 0.2], ["steklo", "steklo", 0.03], ["les", "les", 0.005]];
export function prenos(el) {
  const svg = svgBox(340, 230);
  const out = readout();
  let kind = "prevajanje", mat = "baker", u = new Array(30).fill(20), t = 0, parts = [], cans = [20, 20];
  const reset = () => {
    u = new Array(30).fill(20);
    t = 0;
    cans = [20, 20];
    parts = Array.from({ length: 22 }, (_, i) => ({ a: (i / 22) * Math.PI * 2, r: 0.5 + (i % 3) * 0.2 }));
  };
  const col = (TT) => `hsl(${clamp(220 - (TT - 20) * 2.6, 0, 220)} 80% 52%)`;
  const draw = () => {
    svg.replaceChildren();
    let html;
    if (kind === "prevajanje") {
      const x0 = 50, w = 240 / u.length;
      u.forEach((TT, i) => s("rect", { x: x0 + i * w, y: 90, width: w + 0.5, height: 26, fill: col(TT) }, svg));
      s("rect", { x: x0, y: 90, width: 240, height: 26, class: "bar-frame" }, svg);
      for (let k = 0; k < 3; k++) s("path", { d: `M${30 + k * 8},150 q-6,-12 0,-22 q6,-12 0,-24`, class: "graph-line stroke-danger thin-line", fill: "none" }, svg);
      s("ellipse", { cx: 42, cy: 150, rx: 20, ry: 6, class: "fill-danger", opacity: 0.6 }, svg);
      [0.25, 0.5, 0.75, 1].forEach((f) => {
        const i = Math.min(u.length - 1, Math.round(f * (u.length - 1)));
        label(svg, x0 + (i + 0.5) * w, 134, `${fmt(u[i], 0)}°`, "tick small");
      });
      label(svg, 170, 60, `palica iz: ${COND.find((q) => q[0] === mat)[1]}`, "lbl small");
      label(svg, 170, 206, "čas na sliki teče 10-krat hitreje", "tick small");
      html = `<p><b>Prevajanje:</b> delci na vročem koncu nihajo močneje in z trki predajajo energijo sosednjim delcem. Snov se pri tem ne premika.</p>
        <p class="muted">Kovine (zlasti baker in aluminij) so dobri toplotni prevodniki, les, steklo in zrak so dobri izolatorji. Po ${fmt(t, 0)} s je drugi konec ${fmt(u[u.length - 1], 0)} °C.</p>`;
    } else if (kind === "konvekcija") {
      s("path", { d: "M90,40 V190 H250 V40", class: "beaker" }, svg);
      s("rect", { x: 91, y: 60, width: 158, height: 129, class: "fill-b", opacity: 0.18 }, svg);
      s("rect", { x: 110, y: 196, width: 120, height: 10, rx: 4, class: "fill-danger" }, svg);
      parts.forEach((p) => {
        const x = 170 + Math.cos(p.a) * 60 * p.r, y = 125 - Math.sin(p.a) * 52 * p.r;
        const hot = Math.sin(p.a) < 0 ? 1 : 0;
        s("circle", { cx: x, cy: y, r: 4.5, fill: col(hot ? 80 : 25) }, svg);
      });
      arrow(svg, 120, 170, 120, 90, "danger", 2.5);
      arrow(svg, 220, 90, 220, 170, "b", 2.5);
      html = `<p><b>Konvekcija:</b> segreta tekočina na dnu se razširi, ima manjšo gostoto in se dvigne; hladnejša, gostejša se spusti. Nastane kroženje, ki prenaša toploto <b>s tokom snovi</b>.</p><p class="muted">Tako se segreva voda v loncu in zrak v sobi (radiator), konvekcija poganja tudi vetrove.</p>`;
    } else {
      s("circle", { cx: 40, cy: 50, r: 24, class: "fill-a" }, svg);
      for (let k = 0; k < 6; k++) arrow(svg, 66, 40 + k * 8, 140 + k * 25, 120, "a", 1.5, { opacity: 0.6 });
      [["črna", 150], ["bela", 250]].forEach(([nm, x], i) => {
        s("rect", { x: x - 25, y: 120, width: 50, height: 70, rx: 4, class: i ? "box" : "fill-text" }, svg);
        label(svg, x, 206, `${nm} pločevinka`, "tick");
        label(svg, x, 108, `${fmt(cans[i], 1)} °C`, "lbl small");
      });
      html = `<p><b>Sevanje:</b> toplota se prenaša z elektromagnetnim valovanjem (infrardeča svetloba), tudi skozi prazen prostor. Tako nas greje Sonce.</p><p class="muted">Temne, hrapave površine sevanje bolje vpijajo (in oddajajo), svetle in sijoče ga odbijajo. Zato se črna pločevinka segreje hitreje.</p>`;
    }
    out.innerHTML = html;
  };
  const anim = animate(el, (dt) => {
    t += dt * 10;
    if (kind === "prevajanje") {
      const k = COND.find((q) => q[0] === mat)[2];
      for (let it = 0; it < 20; it++) {
        const nu = u.slice();
        nu[0] = 250;
        for (let i = 1; i < u.length; i++) nu[i] = u[i] + k * 0.24 * (u[i - 1] - 2 * u[i] + (u[i + 1] ?? u[i])) - 0.0004 * (u[i] - 20);
        u = nu;
      }
    } else if (kind === "konvekcija") parts.forEach((p) => (p.a += dt * 0.9));
    else {
      cans[0] += dt * 0.95 * 0.8 * (1 - (cans[0] - 20) / 40);
      cans[1] += dt * 0.2 * 0.8 * (1 - (cans[1] - 20) / 40);
    }
    draw();
  }, { autoplay: false });
  const matSel = select({ label: "snov palice", options: COND.map((q) => [q[0], q[1]]), value: mat, onChange: (v) => ((mat = v), reset(), draw()) });
  layout(el, {
    stage: [svg],
    controls: [
      segmented({ options: [["prevajanje", "prevajanje"], ["konvekcija", "konvekcija"], ["sevanje", "sevanje"]], value: kind, onChange: (v) => ((kind = v), (matSel.style.display = v === "prevajanje" ? "" : "none"), reset(), draw()) }),
      matSel,
      buttons(playButton(anim, { play: "Grej", pause: "Ustavi" }), button("Na začetek", () => (anim.pause(), reset(), draw()))),
    ],
    out,
    tryText: "Primerjaj baker in steklo: po kolikem času se drugi konec palice segreje na 50 °C?",
  });
  reset();
  draw();
}

// ------------------------------------------------------------ temperaturno raztezanje
const ALPHA = [["aluminij", "aluminij", 23e-6], ["baker", "baker", 17e-6], ["zelezo", "železo", 12e-6], ["steklo", "steklo", 9e-6], ["invar", "invar", 1.2e-6]];
export function raztezanje(el) {
  const svg = svgBox(340, 230);
  const out = readout();
  let mat = "aluminij", L0 = 1, dT = 80, bimetal = false;
  const draw = () => {
    svg.replaceChildren();
    const a = ALPHA.find((q) => q[0] === mat)[2], dL = a * L0 * dT;
    if (!bimetal) {
      // palica v merilu (25 px na meter), raztezek povečan 500-krat
      const x0 = 20, px = L0 * 25, ex = 500, xmax = 332;
      s("rect", { x: x0, y: 50, width: px, height: 16, class: "fill-muted", opacity: 0.4 }, svg);
      label(svg, x0, 40, `pri 20 °C: ${fmt(L0, 1)} m`, "tick", "start");
      const wFull = px + dL * ex * 25, w = Math.min(wFull, xmax - x0), cut = wFull > w;
      s("rect", { x: x0, y: 110, width: Math.max(1, w), height: 16, fill: `hsl(${clamp(200 - dT, 0, 200)} 80% 55%)`, ...(cut ? { "stroke-dasharray": "4 3", stroke: "var(--text)" } : {}) }, svg);
      label(svg, x0, 100, `pri ${20 + dT} °C${cut ? " (palica sega čez rob slike)" : ""}`, "tick", "start");
      s("line", { x1: x0 + px, y1: 40, x2: x0 + px, y2: 150, class: "guide" }, svg);
      if (Math.abs(dL) > 0) {
        arrow(svg, x0 + px, 145, x0 + w, 145, "a", 2);
        label(svg, Math.min(x0 + px, 320), 165, `ΔL = ${fmt(dL * 1000, 2)} mm`, "lbl small", dL > 0 ? "end" : "start");
      }
      label(svg, 170, 210, "(dolžina v merilu 25 px/m, raztezek povečan 500-krat)", "tick");
    } else {
      // bimetalni trak: zgoraj aluminij, spodaj železo
      const k = (23e-6 - 12e-6) * dT * 900;
      const len = 220, R = k ? len / k : Infinity, x0 = 60, y0 = 120;
      const pts = [];
      for (let i = 0; i <= 40; i++) {
        const sArc = (len * i) / 40, th = Number.isFinite(R) ? sArc / R : 0;
        pts.push(Number.isFinite(R) && Math.abs(R) < 1e6 ? [x0 + R * Math.sin(th), y0 + R * (1 - Math.cos(th))] : [x0 + sArc, y0]);
      }
      const path = (off) => pts.map((p, i) => {
        const q = pts[Math.min(i + 1, 40)], r = pts[Math.max(i - 1, 0)], dx = q[0] - r[0], dy = q[1] - r[1], L = Math.hypot(dx, dy) || 1;
        return `${i ? "L" : "M"}${(p[0] - (dy / L) * off).toFixed(1)},${(p[1] + (dx / L) * off).toFixed(1)}`;
      }).join("");
      s("path", { d: path(-4), class: "graph-line stroke-c", "stroke-width": 7, fill: "none" }, svg);
      s("path", { d: path(4), class: "graph-line stroke-muted", "stroke-width": 7, fill: "none" }, svg);
      s("rect", { x: x0 - 20, y: y0 - 20, width: 20, height: 40, class: "wall" }, svg);
      label(svg, 60, 30, "zgoraj aluminij (vijolično), spodaj železo", "tick", "start");
      html2 = `<p><b>Bimetal</b> sta zvarjena trakova iz kovin z različnim α. Ko ga segrejemo, se aluminij raztegne bolj, zato se trak <b>ukrivi proti železu</b>. Uporaba: termostati, varovalke v likalnikih.</p>`;
    }
    out.innerHTML = texBlock(`\\Delta L = \\alpha L_0 \\Delta T = ${T(a * 1e6, 1)}\\cdot 10^{-6}\\ \\text{K}^{-1}\\cdot ${T(L0, 1)}\\ \\text{m}\\cdot ${dT}\\ \\text{K} = ${T(dL * 1000, 2)}\\ \\text{mm}`) +
      (bimetal ? html2 : `<p>Pri segrevanju se delci gibljejo močneje in so v povprečju bolj narazen, zato se telo raztegne. Raztezek je sorazmeren z dolžino in spremembo temperature.</p><p class="muted">Zato imajo mostovi in tirnice dilatacijske reže. Invar se skoraj ne razteza (ure, merila).</p>`);
  };
  let html2 = "";
  layout(el, {
    stage: [svg],
    controls: [
      select({ label: "snov", options: ALPHA.map((q) => [q[0], `${q[1]} (α = ${fmt(q[2] * 1e6, 1)}·10⁻⁶ /K)`]), value: mat, onChange: (v) => ((mat = v), draw()) }),
      slider({ label: "dolžina L₀", min: 0.5, max: 10, step: 0.5, value: L0, unit: "m", onInput: (v) => ((L0 = v), draw()) }),
      slider({ label: "segrevanje ΔT", min: -40, max: 200, step: 10, value: dT, unit: "K", onInput: (v) => ((dT = v), draw()) }),
      toggle("bimetalni trak", bimetal, (v) => ((bimetal = v), draw())),
    ],
    out,
    tryText: "Koliko se poleti (ΔT = 40 K) podaljša 1 km dolga jeklena tirnica?",
  });
  draw();
}

// ------------------------------------------------------------ p–V diagram
const PROC = [["izoterma", "izotermna (T = konst.)"], ["izobara", "izobarna (p = konst.)"], ["izohora", "izohorna (V = konst.)"], ["adiabata", "adiabatna (Q = 0)"]];
export function pv(el) {
  const svg = svgBox(340, 260);
  const out = readout();
  let proc = "izoterma", x = 0.5;
  const n = 0.04, R = 8.314, V0 = 1, T0 = 300, p0 = (n * R * T0) / (V0 / 1000) / 1000; // p v kPa, V v L
  const state = (u) => {
    // u ∈ [0, 1] parameter procesa
    if (proc === "izoterma") { const V = V0 + u * 2; return { V, p: (p0 * V0) / V, T: T0 }; }
    if (proc === "izobara") { const V = V0 + u * 2; return { V, p: p0, T: (T0 * V) / V0 }; }
    if (proc === "izohora") { const p = p0 * (1 + u * 2); return { V: V0, p, T: (T0 * p) / p0 }; }
    const V = V0 + u * 2, g = 5 / 3;
    return { V, p: p0 * Math.pow(V0 / V, g), T: T0 * Math.pow(V0 / V, g - 1) };
  };
  const draw = () => {
    svg.replaceChildren();
    // valj z batom
    const st = state(x), cx = 20, cw = 70, top = 40, bottom = 230;
    const pistY = bottom - (st.V / 3.2) * (bottom - top);
    s("path", { d: `M${cx},${top} V${bottom} H${cx + cw} V${top}`, class: "beaker" }, svg);
    s("rect", { x: cx + 1, y: pistY, width: cw - 2, height: bottom - pistY, fill: `hsl(${clamp(240 - (st.T - 200) * 0.4, 0, 240)} 75% 60%)`, opacity: 0.5 }, svg);
    s("rect", { x: cx + 1, y: pistY - 10, width: cw - 2, height: 10, class: "piston" }, svg);
    s("line", { x1: cx + cw / 2, y1: pistY - 10, x2: cx + cw / 2, y2: top - 20, class: "string", "stroke-width": 4 }, svg);
    label(svg, cx + cw / 2, bottom + 14, `T = ${fmt(st.T, 0)} K`, "tick");
    // diagram
    const X = (V) => 130 + (V / 3.5) * 200, Y = (p) => 228 - (p / 320) * 200;
    s("line", { x1: 130, y1: 228, x2: 334, y2: 228, class: "axis" }, svg);
    s("line", { x1: 130, y1: 228, x2: 130, y2: 20, class: "axis" }, svg);
    label(svg, 334, 244, "V [L]", "axis-label", "end");
    label(svg, 136, 26, "p [kPa]", "axis-label", "start");
    for (let V = 1; V <= 3; V++) label(svg, X(V), 240, String(V), "tick small");
    for (let p = 100; p <= 300; p += 100) label(svg, 126, Y(p), String(p), "tick small", "end");
    // izoterme v ozadju
    [200, 300, 450, 600].forEach((TT) => {
      let d = "";
      for (let i = 0; i <= 40; i++) {
        const V = 0.6 + (2.9 * i) / 40, p = (n * R * TT) / (V / 1000) / 1000;
        if (p < 320) d += `${d ? "L" : "M"}${X(V).toFixed(1)},${Y(p).toFixed(1)}`;
      }
      s("path", { d, class: "graph-line stroke-muted thin-line", opacity: 0.3, fill: "none" }, svg);
    });
    let d = "", area = `M${X(V0)},${Y(0)}`;
    for (let i = 0; i <= 60; i++) {
      const q = state((x * i) / 60);
      d += `${i ? "L" : "M"}${X(q.V).toFixed(1)},${Y(q.p).toFixed(1)}`;
      area += ` L${X(q.V).toFixed(1)},${Y(q.p).toFixed(1)}`;
    }
    if (proc !== "izohora") s("path", { d: area + ` L${X(st.V)},${Y(0)} Z`, class: "area-fill fill-b" }, svg);
    s("path", { d, class: "graph-line stroke-c", fill: "none" }, svg);
    s("circle", { cx: X(st.V), cy: Y(st.p), r: 5, class: "pt fill-accent" }, svg);
    s("circle", { cx: X(V0), cy: Y(p0), r: 4, class: "pt fill-text" }, svg);
    const Wg = { izoterma: n * R * T0 * Math.log(st.V / V0), izobara: p0 * (st.V - V0), izohora: 0, adiabata: (1.5) * n * R * (T0 - st.T) }[proc];
    const dU = 1.5 * n * R * (st.T - T0), Q = dU + Wg;
    out.innerHTML = texBlock(`pV = nRT:\\quad ${T(st.p, 0)}\\ \\text{kPa}\\cdot ${T(st.V, 2)}\\ \\text{L} = ${T(st.p * st.V, 0)}\\ \\text{J}`) +
      texBlock(`\\Delta W_n = Q - A_{plin}:\\quad ${T(dU, 0)}\\ \\text{J} = ${T(Q, 0)}\\ \\text{J} - ${T(Wg, 0)}\\ \\text{J}`) +
      `<p>${{ izoterma: "Izotermna sprememba: temperatura je stalna, notranja energija se ne spremeni; vsa dovedena toplota gre za delo plina.", izobara: "Izobarna sprememba: tlak je stalen; plin se pri segrevanju razteza in opravlja delo p·ΔV.", izohora: "Izohorna sprememba: prostornina je stalna, plin ne opravi dela; vsa toplota poveča notranjo energijo.", adiabata: "Adiabatna sprememba: ni izmenjave toplote; plin opravi delo na račun notranje energije, zato se ohladi." }[proc]}</p>
       <p class="muted">Delo plina je ploščina pod krivuljo v p–V diagramu (senčeno). Sive krivulje so izoterme. Enoatomni idealni plin, n = 0,04 mol.</p>`;
  };
  layout(el, {
    stage: [svg],
    controls: [
      select({ label: "sprememba", options: PROC, value: proc, onChange: (v) => ((proc = v), draw()) }),
      slider({ label: "potek", min: 0, max: 1, step: 0.02, value: x, onInput: (v) => ((x = v), draw()), format: (v) => `${fmt(v * 100, 0)} %` }),
    ],
    out,
    tryText: "Pri kateri spremembi do iste končne prostornine plin opravi največ dela?",
  });
  draw();
}

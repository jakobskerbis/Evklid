// Simulacije pri fiziki: senca, odboj in lom svetlobe, Luna in letni časi, valovanje in zvok, leče,
// interferenca, fotoefekt, spekter vodika, radioaktivni razpad.
import { h, s, svgBox, slider, select, segmented, toggle, button, buttons, readout, layout, texBlock, fmt, tfmt, clamp, label, arrow, animate, playButton, draggable, handle } from "./kit.js";

const T = (x, d = 2) => tfmt(x, d);
const rad = (d) => (d * Math.PI) / 180, deg = (r) => (r * 180) / Math.PI;

// Barva svetlobe za valovno dolžino v nm.
function wlColor(nm) {
  let r = 0, g = 0, b = 0;
  if (nm < 380) return "rgb(130,0,200)";
  if (nm < 440) (r = (440 - nm) / 60), (b = 1);
  else if (nm < 490) (g = (nm - 440) / 50), (b = 1);
  else if (nm < 510) (g = 1), (b = (510 - nm) / 20);
  else if (nm < 580) (r = (nm - 510) / 70), (g = 1);
  else if (nm < 645) (r = 1), (g = (645 - nm) / 65);
  else if (nm <= 780) r = 1;
  else return "rgb(120,0,0)";
  return `rgb(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)})`;
}

// ------------------------------------------------------------ senca in polsenca
export function senca(el) {
  const svg = svgBox(340, 260);
  const out = readout();
  let two = false, obs = { x: 170, y: 130 }, size = 40;
  const draw = () => {
    svg.replaceChildren();
    const screenX = 320, L = two ? [[30, 100], [30, 160]] : [[30, 130]];
    s("rect", { x: screenX, y: 10, width: 12, height: 240, class: "wall" }, svg);
    const top = obs.y - size / 2, bot = obs.y + size / 2;
    const hitY = (Lp, py) => Lp[1] + ((py - Lp[1]) * (screenX - Lp[0])) / (obs.x - Lp[0]);
    // osvetljenost zaslona po točkah
    for (let y = 10; y < 250; y += 3) {
      let lit = 0;
      L.forEach((Lp) => {
        const yAtObs = Lp[1] + ((y - Lp[1]) * (obs.x - Lp[0])) / (screenX - Lp[0]);
        if (yAtObs < top || yAtObs > bot) lit++;
      });
      s("rect", { x: screenX - 8, y, width: 8, height: 3, fill: lit === L.length ? "#ffd84d" : lit ? "#9a8f6a" : "#2b2b33" }, svg);
    }
    L.forEach((Lp, i) => {
      s("line", { x1: Lp[0], y1: Lp[1], x2: screenX, y2: hitY(Lp, top), class: `graph-line thin-line stroke-${i ? "b" : "a"}`, opacity: 0.8 }, svg);
      s("line", { x1: Lp[0], y1: Lp[1], x2: screenX, y2: hitY(Lp, bot), class: `graph-line thin-line stroke-${i ? "b" : "a"}`, opacity: 0.8 }, svg);
      s("circle", { cx: Lp[0], cy: Lp[1], r: 9, fill: "#ffd84d", stroke: "var(--text)" }, svg);
    });
    s("rect", { x: obs.x - 5, y: top, width: 10, height: size, class: "fill-text" }, svg);
    const hnd = handle(svg, "c");
    hnd.move(obs.x, obs.y);
    draggable(svg, hnd, (x, y) => ((obs = { x: clamp(x, 70, 290), y: clamp(y, 40, 220) }), draw()));
    out.innerHTML = two
      ? `<p>Pri dveh izvorih (ali razsežnem izviru) nastanejo <b>senca</b> (temno: tja ne pride svetloba iz nobenega izvora) in <b>polsenca</b> (sivo: tja sveti le en izvor). Z barvnima žarkoma sta označena robova senc obeh izvorov.</p><p class="muted">Tako nastaneta polna in delna senca pri Luninem in Sončevem mrku.</p>`
      : `<p>Svetloba se širi <b>premočrtno</b>, zato za neprozornim telesom nastane senca. Robova sence določata žarka, ki gresta mimo robov ovire.</p><p class="muted">Povleci oviro bliže izviru: senca na zaslonu se poveča. Točkast izvor da ostro senco brez polsence.</p>`;
  };
  layout(el, {
    stage: [svg],
    controls: [slider({ label: "velikost ovire", min: 10, max: 80, step: 5, value: size, unit: "px", onInput: (v) => ((size = v), draw()), format: (v) => `${v / 10} cm` }), toggle("dva izvora svetlobe", two, (v) => ((two = v), draw()))],
    out,
    tryText: "Kam moraš postaviti oviro, da bo na zaslonu samo polsenca in nič sence?",
  });
  draw();
}

// ------------------------------------------------------------ odboj in lom
const MED = [["zrak", "zrak", 1.0], ["voda", "voda", 1.33], ["steklo", "steklo", 1.5], ["diamant", "diamant", 2.42]];
export function zarki(el, { mode = "lom" } = {}) {
  const svg = svgBox(340, 280);
  const out = readout();
  let a = 40, n1 = "zrak", n2 = "voda", rough = false;
  const odboj = mode === "odboj";
  const draw = () => {
    svg.replaceChildren();
    const cx = 170, cy = 140, R = 130;
    const na = MED.find((m) => m[0] === n1)[2], nb = MED.find((m) => m[0] === n2)[2];
    if (odboj) {
      s("rect", { x: 20, y: cy, width: 300, height: 10, class: "fill-muted" }, svg);
      if (rough) for (let x = 24; x < 320; x += 8) s("path", { d: `M${x},${cy} l4,-4 l4,4`, class: "axis thin", fill: "none" }, svg);
    } else {
      s("rect", { x: 0, y: cy, width: 340, height: 140, class: "fill-b", opacity: 0.08 + 0.1 * (nb - 1) }, svg);
      s("rect", { x: 0, y: 0, width: 340, height: cy, class: "fill-b", opacity: 0.08 * (na - 1) * 1.5 }, svg);
      label(svg, 10, 16, `${MED.find((m) => m[0] === n1)[1]} (n = ${fmt(na, 2)})`, "tick b", "start");
      label(svg, 10, 268, `${MED.find((m) => m[0] === n2)[1]} (n = ${fmt(nb, 2)})`, "tick b", "start");
    }
    s("line", { x1: cx, y1: 10, x2: cx, y2: odboj ? cy : 270, class: "guide" }, svg);
    label(svg, cx + 4, 20, "vpadna pravokotnica", "tick", "start");
    const A = [cx - R * Math.sin(rad(a)), cy - R * Math.cos(rad(a))];
    s("line", { x1: A[0], y1: A[1], x2: cx, y2: cy, class: "ray a" }, svg);
    arrow(svg, A[0], A[1], (A[0] + cx) / 2, (A[1] + cy) / 2, "a", 2);
    const arcL = (r, a0, a1, cls) => s("path", { d: `M${cx + r * Math.sin(rad(a0))},${cy - r * Math.cos(rad(a0)) * (a0 > 90 ? -1 : 1)} A${r},${r} 0 0 ${a1 > a0 ? 1 : 0} ${cx + r * Math.sin(rad(a1))},${cy - r * Math.cos(rad(a1))}`, class: cls, fill: "none" }, svg);
    void arcL;
    const ang = (r, from, to, below, col) => {
      // lok med navpičnico in žarkom
      const sgy = below ? 1 : -1;
      const p0 = [cx, cy + sgy * r], p1 = [cx + r * Math.sin(rad(to)) * (from < 0 ? -1 : 1), cy + sgy * r * Math.cos(rad(to))];
      s("path", { d: `M${p0[0]},${p0[1]} A${r},${r} 0 0 ${(from < 0) !== below ? 1 : 0} ${p1[0]},${p1[1]}`, class: `graph-line stroke-${col} thin-line`, fill: "none" }, svg);
    };
    ang(40, -1, a, false, "a");
    let html;
    if (odboj) {
      if (!rough) {
        const B = [cx + R * Math.sin(rad(a)), cy - R * Math.cos(rad(a))];
        s("line", { x1: cx, y1: cy, x2: B[0], y2: B[1], class: "ray b" }, svg);
        arrow(svg, cx, cy, (cx + B[0]) / 2, (cy + B[1]) / 2, "b", 2);
        ang(40, 1, a, false, "b");
        label(svg, cx - 50 * Math.sin(rad(a / 2)), cy - 54 * Math.cos(rad(a / 2)), "α", "lbl");
        label(svg, cx + 50 * Math.sin(rad(a / 2)), cy - 54 * Math.cos(rad(a / 2)), "β", "lbl");
        html = `<p><b>Odbojni zakon:</b> odbojni kot je enak vpadnemu, β = α = ${a}°. Vpadni žarek, odbiti žarek in vpadna pravokotnica ležijo v isti ravnini.</p><p class="muted">Ravno zrcalo odbija vzporedne žarke vzporedno, zato v njem vidimo sliko.</p>`;
      } else {
        for (let k = -3; k <= 3; k++) {
          const b = clamp(a + k * 22 + (k * 7) % 11, -80, 80);
          s("line", { x1: cx + k * 6, y1: cy, x2: cx + k * 6 + R * 0.8 * Math.sin(rad(b)), y2: cy - R * 0.8 * Math.cos(rad(b)), class: "ray b", "stroke-width": 2.5 }, svg);
        }
        html = `<p><b>Razpršeni odboj:</b> hrapava površina ima drobne ploskvice v različnih smereh. Za vsako velja odbojni zakon, zato se žarki odbijejo na vse strani. Tako vidimo predmete, ki sami ne svetijo.</p>`;
      }
    } else {
      const sb = (na / nb) * Math.sin(rad(a));
      const refl = Math.min(1, ((na - nb) / (na + nb)) ** 2 + (sb >= 1 ? 1 : 0) + (a > 60 ? 0.15 : 0));
      const B = [cx + R * Math.sin(rad(a)), cy - R * Math.cos(rad(a))];
      s("line", { x1: cx, y1: cy, x2: B[0], y2: B[1], class: "ray b", opacity: sb >= 1 ? 1 : 0.25 + refl }, svg);
      let crit = na > nb ? deg(Math.asin(nb / na)) : null;
      if (sb < 1) {
        const b = Math.asin(sb), C = [cx + R * Math.sin(b), cy + R * Math.cos(b)];
        s("line", { x1: cx, y1: cy, x2: C[0], y2: C[1], class: "ray c" }, svg);
        arrow(svg, cx, cy, (cx + C[0]) / 2, (cy + C[1]) / 2, "c", 2);
        ang(40, 1, deg(b), true, "c");
        html = texBlock(`n_1 \\sin\\alpha = n_2\\sin\\beta \\Rightarrow ${T(na, 2)}\\sin ${a}^\\circ = ${T(nb, 2)}\\sin\\beta \\Rightarrow \\beta = ${T(deg(b), 1)}^\\circ`) +
          `<p>${nb > na ? "Svetloba prehaja v optično gostejšo snov in se lomi <b>proti</b> vpadni pravokotnici (β < α)." : nb < na ? "Svetloba prehaja v optično redkejšo snov in se lomi <b>stran od</b> vpadne pravokotnice (β > α)." : "Snovi sta enaki: svetloba se ne lomi."} Del svetlobe se vedno tudi odbije (bledi žarek).</p>`;
      } else html = `<p><b>Popolni odboj!</b> Vpadni kot ${a}° je večji od mejnega kota α_m = ${fmt(crit, 1)}°, zato svetloba sploh ne preide v drugo snov in se vsa odbije.</p>`;
      html += `<p class="muted">${crit ? `Mejni kot za prehod ${MED.find((m) => m[0] === n1)[1]} → ${MED.find((m) => m[0] === n2)[1]}: sin α_m = n₂/n₁, α_m = ${fmt(crit, 1)}°. Na tem temeljijo optična vlakna.` : "Za popolni odboj mora svetloba prehajati iz gostejše v redkejšo snov (zamenjaj snovi)."}</p>`;
    }
    out.innerHTML = html;
  };
  const ctl = [slider({ label: "vpadni kot α", min: 0, max: 85, value: a, unit: "°", onInput: (v) => ((a = v), draw()) })];
  if (odboj) ctl.push(toggle("hrapava površina", rough, (v) => ((rough = v), draw())));
  else {
    ctl.push(select({ label: "zgoraj", options: MED.map((m) => [m[0], m[1]]), value: n1, onChange: (v) => ((n1 = v), draw()) }));
    ctl.push(select({ label: "spodaj", options: MED.map((m) => [m[0], m[1]]), value: n2, onChange: (v) => ((n2 = v), draw()) }));
  }
  layout(el, { stage: [svg], controls: ctl, out, tryText: odboj ? "Pri katerem vpadnem kotu se žarek odbije nazaj vase?" : "Nastavi zgoraj steklo in spodaj zrak. Poišči kot, pri katerem lomljeni žarek izgine." });
  draw();
}

// ------------------------------------------------------------ Luna in letni časi
export function osoncje(el) {
  const svg = svgBox(340, 280);
  const out = readout();
  let kind = "mene", ang = 90;
  const monthOf = (v) => ["marec", "april", "maj", "junij", "julij", "avgust", "september", "oktober", "november", "december", "januar", "februar"][Math.floor((v / 360) * 12) % 12];
  const ctl = slider({ label: "dan", min: 0, max: 360, step: 5, value: ang, unit: "°", onInput: (v) => ((ang = v), draw()), format: (v) => (kind === "mene" ? `${fmt((v / 360) * 29.5, 1)}. dan` : monthOf(v)) });
  const draw = () => {
    svg.replaceChildren();
    if (kind === "mene") {
      const ex = 130, ey = 140, R = 90;
      for (let y = 30; y < 260; y += 26) arrow(svg, 336, y, 300, y, "a", 1.5, { opacity: 0.5 });
      label(svg, 320, 16, "Sonce →", "tick", "end");
      s("circle", { cx: ex, cy: ey, r: 22, class: "fill-b" }, svg);
      s("path", { d: `M${ex},${ey - 22} A22,22 0 0 0 ${ex},${ey + 22} Z`, fill: "#000", opacity: 0.35 }, svg);
      s("circle", { cx: ex, cy: ey, r: R, class: "guide", fill: "none" }, svg);
      const mx = ex + R * Math.cos(rad(ang + 180)) * -1, my = ey - R * Math.sin(rad(ang + 180)) * -1;
      const Mx = ex + R * Math.cos(rad(ang)), My = ey - R * Math.sin(rad(ang));
      void mx;
      void my;
      s("circle", { cx: Mx, cy: My, r: 11, fill: "#e8e2cf", stroke: "var(--text)" }, svg);
      s("path", { d: `M${Mx},${My - 11} A11,11 0 0 0 ${Mx},${My + 11} Z`, fill: "#000", opacity: 0.6 }, svg);
      // pogled z Zemlje
      const px = 290, py = 220, r = 30, ph = ((ang % 360) + 360) % 360;
      // osvetljeni delež: ob 0° (Luna med Zemljo in Soncem? ne) — Sonce je desno: pri ang = 0 je Luna desno = mlaj
      const k = Math.cos(rad(ph));
      s("circle", { cx: px, cy: py, r, fill: "#2b2b33" }, svg);
      const lit = ph <= 180 ? 1 : -1; // pred ali po polni luni: osvetljena desna/leva stran
      const rx = Math.abs(k) * r;
      const big = k < 0;
      const side = lit > 0 ? 1 : 0;
      s("path", { d: `M${px},${py - r} A${r},${r} 0 0 ${side} ${px},${py + r} A${rx},${r} 0 0 ${big ? side : 1 - side} ${px},${py - r} Z`, fill: "#f3ecd2" }, svg);
      label(svg, px, py - r - 12, "z Zemlje vidimo:", "tick");
      const names = ["mlaj", "prvi krajec", "ščip (polna luna)", "zadnji krajec"];
      const nm = ph < 22.5 || ph >= 337.5 ? names[0] : ph < 67.5 ? "rastoči srp" : ph < 112.5 ? names[1] : ph < 157.5 ? "rastoča luna" : ph < 202.5 ? names[2] : ph < 247.5 ? "pojemajoča luna" : ph < 292.5 ? names[3] : "pojemajoči srp";
      out.innerHTML = `<p>Luna je ${fmt((ph / 360) * 29.5, 1)} dni po mlaju: <b>${nm}</b>.</p><p>Sonce vedno osvetljuje polovico Lune. Ko Luna kroži okoli Zemlje (približno 29,5 dneva), vidimo z Zemlje različen del osvetljene polovice: to so <b>Lunine mene</b>.</p><p class="muted">Lunin mrk je lahko le ob ščipu, Sončev le ob mlaju (ko so Sonce, Zemlja in Luna v ravni črti).</p>`;
    } else {
      const sx = 170, sy = 130;
      s("ellipse", { cx: sx, cy: sy, rx: 130, ry: 70, class: "guide", fill: "none" }, svg);
      s("circle", { cx: sx, cy: sy, r: 18, class: "fill-a" }, svg);
      const ex = sx + 130 * Math.cos(rad(ang + 180)), ey = sy + 70 * Math.sin(rad(ang + 180));
      s("circle", { cx: ex, cy: ey, r: 13, class: "fill-b" }, svg);
      const tilt = 23.4;
      s("line", { x1: ex - 22 * Math.sin(rad(tilt)), y1: ey + 22 * Math.cos(rad(tilt)), x2: ex + 22 * Math.sin(rad(tilt)), y2: ey - 22 * Math.cos(rad(tilt)), class: "string", "stroke-width": 2 }, svg);
      const dec = 23.4 * Math.sin(rad(ang));
      const alt = 90 - 46 + dec, day = 12 + (2 / 15) * deg(Math.asin(clamp(Math.tan(rad(46)) * Math.tan(rad(dec)), -1, 1)));
      const season = dec > 10 ? "poletje" : dec < -10 ? "zima" : ang < 180 ? "pomlad" : "jesen";
      // opoldansko Sonce v Ljubljani
      const gx = 60, gy = 260;
      s("line", { x1: 10, y1: gy, x2: 330, y2: gy, class: "ground" }, svg);
      s("path", { d: `M${gx + 40},${gy} A40,40 0 0 0 ${gx + 40 * Math.cos(rad(alt))},${gy - 40 * Math.sin(rad(alt))}`, class: "graph-line stroke-c thin-line", fill: "none" }, svg);
      s("line", { x1: gx, y1: gy, x2: gx + 120 * Math.cos(rad(alt)), y2: gy - 120 * Math.sin(rad(alt)), class: "ray a" }, svg);
      label(svg, gx + 58, gy - 12, `${fmt(alt, 0)}°`, "lbl small", "start");
      label(svg, 330, gy - 10, "opoldansko Sonce v Sloveniji", "tick", "end");
      out.innerHTML = `<p>${monthOf(ang)}: <b>${season}</b> na severni polobli. Opoldne je Sonce ${fmt(alt, 0)}° nad obzorjem, dan traja okoli ${fmt(day, 1)} h.</p><p>Letni časi nastanejo, ker je <b>Zemljina os nagnjena</b> za 23,4°. Poleti so sončni žarki bolj strmi (ogrejejo več na enoto površine) in dan je daljši. Razdalja do Sonca pri tem skoraj nič ne vpliva.</p>`;
    }
  };
  layout(el, {
    stage: [svg],
    controls: [segmented({ options: [["mene", "Lunine mene"], ["casi", "letni časi"]], value: kind, onChange: (v) => ((kind = v), ctl.set(kind === "mene" ? 90 : 90)) }), ctl],
    out,
    tryText: "Kje je Luna, ko je ščip? Ali lahko ščip vidimo opoldne?",
  });
  draw();
}

// ------------------------------------------------------------ valovanje in zvok
export function val(el, { mode = "precno" } = {}) {
  if (mode === "zvok") return zvok(el);
  const svg = svgBox(340, 200);
  const out = readout();
  let kind = "precno", A = 25, lam = 120, f = 1, t = 0;
  const draw = () => {
    svg.replaceChildren();
    const c = (lam / 100) * f, k = (2 * Math.PI) / lam, w = 2 * Math.PI * f, y0 = 100;
    s("line", { x1: 10, y1: y0, x2: 330, y2: y0, class: "guide" }, svg);
    for (let i = 0; i <= 40; i++) {
      const x0 = 15 + i * 7.8, ph = k * x0 - w * t;
      const x = kind === "precno" ? x0 : x0 + (A / 3) * Math.sin(ph);
      const y = kind === "precno" ? y0 - A * Math.sin(ph) : y0;
      if (kind === "precno") s("line", { x1: x, y1: y0, x2: x, y2: y, class: "axis thin", opacity: 0.3 }, svg);
      s("circle", { cx: x, cy: y, r: i === 20 ? 6 : 4.5, class: i === 20 ? "fill-danger" : "fill-b" }, svg);
    }
    if (kind === "precno") {
      const xs = 15 + 7.8 * 4;
      s("line", { x1: xs, y1: 170, x2: xs + lam, y2: 170, class: "graph-line stroke-c thin-line" }, svg);
      label(svg, xs + lam / 2, 184, "λ", "lbl");
      s("line", { x1: 320, y1: y0, x2: 320, y2: y0 - A, class: "graph-line stroke-a thin-line" }, svg);
      label(svg, 326, y0 - A / 2, "A", "lbl small", "start");
    }
    out.innerHTML = texBlock(`c = \\lambda\\nu = ${T(lam / 100, 2)}\\ \\text{m}\\cdot ${T(f, 1)}\\ \\text{Hz} = ${T(c, 2)}\\ \\tfrac{\\text{m}}{\\text{s}}`) +
      `<p>${kind === "precno" ? "<b>Prečno valovanje:</b> delci nihajo pravokotno na smer širjenja (vrv, valovi na vodi, svetloba)." : "<b>Vzdolžno valovanje:</b> delci nihajo v smeri širjenja; nastajajo zgoščine in razredčine (zvok, vzmet)."} Rdeči delec ostaja na svojem mestu in le niha: valovanje prenaša energijo, ne snovi.</p>
       <p class="muted">Nihajni čas t₀ = 1/ν = ${fmt(1 / f, 2)} s. V tem času se valovanje premakne za eno valovno dolžino. Slika je v merilu (1 m = 100 px) in teče v resničnem času${kind === "precno" ? "" : "; odmik delcev pri vzdolžnem valovanju je zaradi preglednosti zmanjšan na tretjino"}.</p>`;
  };
  const anim = animate(el, (dt) => ((t += dt), draw()), { autoplay: true });
  layout(el, {
    stage: [svg],
    controls: [
      segmented({ options: [["precno", "prečno"], ["vzdolzno", "vzdolžno"]], value: kind, onChange: (v) => ((kind = v), draw()) }),
      slider({ label: "amplituda", min: 5, max: 40, step: 5, value: A, unit: "cm", onInput: (v) => ((A = v), draw()) }),
      slider({ label: "valovna dolžina", min: 40, max: 240, step: 10, value: lam, onInput: (v) => ((lam = v), draw()), format: (v) => `${fmt(v / 100, 1)} m` }),
      slider({ label: "frekvenca", min: 0.2, max: 2, step: 0.1, value: f, unit: "Hz", onInput: (v) => ((f = v), draw()) }),
      buttons(playButton(anim, { play: "Predvajaj", pause: "Ustavi" })),
    ],
    out,
    tryText: "Podvoji frekvenco. Kaj se zgodi s hitrostjo valovanja v tej simulaciji? Kaj bi se zgodilo z valovno dolžino na pravi vrvi?",
  });
  draw();
}

function zvok(el) {
  const svg = svgBox(340, 220);
  const out = readout();
  let f = 440, vol = 0.5, t = 0, ctx = null, osc = null, gain = null;
  const c = 340;
  const draw = () => {
    svg.replaceChildren();
    s("rect", { x: 10, y: 60, width: 22, height: 50, rx: 3, class: "fill-text" }, svg);
    s("path", { d: "M32,70 L52,50 V120 L32,100 Z", class: "fill-muted" }, svg);
    const lam = c / f, px = 280 / (lam * 2 + 0.5), lamPx = Math.max(10, lam * 100 * 0.6);
    void px;
    for (let i = 0; i < 260; i += 4) {
      const ph = (2 * Math.PI * (i - t * 120)) / lamPx;
      const dens = 0.5 + 0.5 * vol * Math.sin(ph);
      s("rect", { x: 60 + i, y: 40 + (1 - dens) * 0, width: 3, height: 90, class: "fill-b", opacity: 0.15 + 0.65 * dens }, svg);
    }
    // tlak v odvisnosti od položaja
    let d = "";
    for (let i = 0; i <= 260; i += 2) {
      const ph = (2 * Math.PI * (i - t * 120)) / lamPx;
      d += `${i ? "L" : "M"}${60 + i},${180 - vol * 30 * Math.sin(ph)}`;
    }
    s("line", { x1: 60, y1: 180, x2: 324, y2: 180, class: "axis thin" }, svg);
    s("path", { d, class: "graph-line stroke-c", fill: "none" }, svg);
    label(svg, 60, 150, "tlak", "tick", "start");
    s("line", { x1: 60, y1: 210, x2: 60 + lamPx, y2: 210, class: "graph-line stroke-a thin-line" }, svg);
    label(svg, 60 + lamPx / 2 + 6, 202, "λ", "lbl small");
    out.innerHTML = texBlock(`\\lambda = \\frac{c}{\\nu} = \\frac{340\\ \\text{m/s}}{${f}\\ \\text{Hz}} = ${T(c / f, 2)}\\ \\text{m}`) +
      `<p>Zvok je <b>vzdolžno valovanje</b> zraka: zgoščine in razredčine. Višja frekvenca pomeni višji ton, večja amplituda glasnejši zvok. ${f < 20 ? "Pod 20 Hz je infrazvok, ki ga ne slišimo." : f > 20000 ? "Nad 20 kHz je ultrazvok." : "Človek sliši od približno 20 Hz do 20 000 Hz."}</p>
       <p class="muted">Ton 440 Hz je komorni a. Slika je v merilu 1 m = 60 px, gibanje pa je upočasnjeno 340-krat: zgoščine se pri vseh frekvencah premikajo enako hitro, ker je hitrost zvoka v zraku stalna.</p>`;
  };
  // hitrost zvoka je pri vseh frekvencah enaka: na sliki 60 px/s (upočasnjeno 340-krat)
  const anim = animate(el, (dt) => ((t += dt * 0.5), draw()), { autoplay: true });
  const sound = button("🔊 Predvajaj ton", () => {
    try {
      if (osc) {
        osc.stop();
        osc = null;
        sound.textContent = "🔊 Predvajaj ton";
        return;
      }
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      osc = ctx.createOscillator();
      gain = ctx.createGain();
      osc.frequency.value = f;
      gain.gain.value = vol * 0.15;
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      setTimeout(() => {
        if (osc) osc.stop(), (osc = null), (sound.textContent = "🔊 Predvajaj ton");
      }, 1500);
      sound.textContent = "■ Ustavi ton";
    } catch {
      sound.disabled = true;
    }
  });
  layout(el, {
    stage: [svg],
    controls: [
      slider({ label: "frekvenca", min: 100, max: 2000, step: 10, value: f, unit: "Hz", onInput: (v) => ((f = v), osc && (osc.frequency.value = v), draw()) }),
      slider({ label: "glasnost", min: 0.1, max: 1, step: 0.1, value: vol, onInput: (v) => ((vol = v), gain && (gain.gain.value = v * 0.15), draw()), format: (v) => `${fmt(v * 100, 0)} %` }),
      buttons(sound, playButton(anim, { play: "Premikaj", pause: "Ustavi" })),
    ],
    out,
    tryText: "Za koliko moraš povečati frekvenco, da se ton zviša za oktavo?",
  });
  draw();
}

// ------------------------------------------------------------ leče
export function lece(el) {
  const svg = svgBox(340, 240);
  const out = readout();
  let f = 50, a = 120, hgt = 40, kind = "zbiralna";
  const draw = () => {
    svg.replaceChildren();
    const ox = 170, oy = 120, F = kind === "zbiralna" ? f : -f;
    s("line", { x1: 0, y1: oy, x2: 340, y2: oy, class: "axis thin" }, svg);
    s("line", { x1: ox, y1: 20, x2: ox, y2: 220, class: "graph-line stroke-b" }, svg);
    if (kind === "zbiralna") {
      arrow(svg, ox, 120, ox, 18, "b", 2);
      arrow(svg, ox, 120, ox, 222, "b", 2);
    } else {
      s("path", { d: `M${ox - 8},14 L${ox},26 L${ox + 8},14 M${ox - 8},226 L${ox},214 L${ox + 8},226`, class: "graph-line stroke-b thin-line", fill: "none" }, svg);
    }
    [[ox - f, "F"], [ox + f, "F"], [ox - 2 * f, "2F"], [ox + 2 * f, "2F"]].forEach(([x, nm]) => {
      if (x < 0 || x > 340) return;
      s("circle", { cx: x, cy: oy, r: 3, class: "fill-text" }, svg);
      label(svg, x, oy + 14, nm, "tick");
    });
    const Ox = ox - a;
    arrow(svg, Ox, oy, Ox, oy - hgt, "a", 3);
    const b = 1 / (1 / F - 1 / a);
    const m = -b / a, Ix = ox + b, Ih = m * hgt;
    const ray = (pts, dashed) => s("path", { d: pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(""), class: "graph-line stroke-c thin-line", "stroke-dasharray": dashed ? "5 4" : null, fill: "none" }, svg);
    const ext = (P, Q, x) => [x, P[1] + ((Q[1] - P[1]) * (x - P[0])) / (Q[0] - P[0])];
    const tip = [Ox, oy - hgt];
    // 1. vzporedni žarek → skozi gorišče
    const L1 = [ox, oy - hgt], F2 = [ox + F, oy];
    ray([tip, L1, ext(L1, F2, 340)]);
    // 2. skozi središče
    ray([tip, ext(tip, [ox, oy], 340)]);
    // 3. skozi gorišče pred lečo → vzporedno
    if (Math.abs(a - F) > 2) {
      const F1 = [ox - F, oy], L3 = ext(tip, F1, ox);
      if (Math.abs(L3[1] - oy) < 130) ray([tip, L3, [340, L3[1]]]);
    }
    const virtual = b < 0;
    if (Number.isFinite(b) && Math.abs(b) < 2000) {
      if (virtual) {
        ray([L1, ext(L1, F2, Ix - 10)], true);
        ray([[ox, oy], ext(tip, [ox, oy], Ix - 10)], true);
      }
      if (Ix > -20 && Ix < 360) arrow(svg, Ix, oy, Ix, oy - Ih, "c", 3, virtual ? { "stroke-dasharray": "5 3" } : {});
    }
    const dg = Math.abs(a - F) < 1e-9;
    out.innerHTML = (dg ? `<p>Predmet je v gorišču: žarki za lečo so vzporedni, slike ni (nastane v neskončnosti).</p>` :
      texBlock(`\\frac{1}{f} = \\frac{1}{a} + \\frac{1}{b} \\Rightarrow b = ${T(b / 10, 1)}\\ \\text{cm},\\quad \\frac{S}{P} = \\frac{|b|}{a} = ${T(Math.abs(m), 2)}`) +
      `<p>Slika je <b>${virtual ? "navidezna, pokončna" : "realna, obrnjena"}</b> in ${Math.abs(m) > 1.02 ? "povečana" : Math.abs(m) < 0.98 ? "pomanjšana" : "enako velika"}. ${virtual ? "Žarki se za lečo razhajajo; njihova podaljška (črtkano) se sekata na isti strani kot predmet." : "Žarki se za lečo zberejo v točki slike (zaslon jo pokaže)."}</p>`) +
      `<p class="muted">Gorišče f = ${f / 10} cm. ${kind === "zbiralna" ? "Zbiralna leča: lupa (a < f), fotoaparat (a > 2f), projektor (f < a < 2f)." : "Razpršilna leča da vedno navidezno, pokončno, pomanjšano sliko (očala za kratkovidne)."}</p>`;
  };
  layout(el, {
    stage: [svg],
    controls: [
      segmented({ options: [["zbiralna", "zbiralna leča"], ["razprsilna", "razpršilna leča"]], value: kind, onChange: (v) => ((kind = v), draw()) }),
      slider({ label: "razdalja predmeta a", min: 20, max: 165, step: 5, value: a, onInput: (v) => ((a = v), draw()), format: (v) => `${fmt(v / 10, 1)} cm` }),
      slider({ label: "goriščna razdalja f", min: 30, max: 80, step: 5, value: f, onInput: (v) => ((f = v), draw()), format: (v) => `${fmt(v / 10, 1)} cm` }),
      slider({ label: "velikost predmeta", min: 20, max: 60, step: 5, value: hgt, onInput: (v) => ((hgt = v), draw()), format: (v) => `${fmt(v / 10, 1)} cm` }),
    ],
    out,
    tryText: "Kam moraš postaviti predmet, da je slika enako velika? Kdaj leča deluje kot lupa?",
  });
  draw();
}

// ------------------------------------------------------------ interferenca na dveh režah
export function interferenca(el) {
  const svg = svgBox(340, 260);
  const out = readout();
  let lam = 550, d = 0.2, Lm = 1.5, t = 0;
  const draw = () => {
    svg.replaceChildren();
    const col = wlColor(lam), sx = 70, cy = 130, dpx = d * 200; // razmik rež je sorazmeren z d
    s("rect", { x: 0, y: 0, width: 340, height: 260, fill: "#0e1220", rx: 10 }, svg);
    for (let x = 6; x < sx; x += lam / 40) s("line", { x1: x, y1: 20, x2: x, y2: 240, stroke: col, "stroke-width": 1.5, opacity: 0.5 }, svg);
    s("rect", { x: sx - 3, y: 10, width: 6, height: 240, fill: "#888" }, svg);
    [cy - dpx / 2, cy + dpx / 2].forEach((y) => s("rect", { x: sx - 3, y: y - 3, width: 6, height: 6, fill: "#0e1220" }, svg));
    const wpx = lam / 40, ph = (t * 30) % wpx;
    for (let r = ph; r < 230; r += wpx) [cy - dpx / 2, cy + dpx / 2].forEach((y) => s("path", { d: `M${sx + r * Math.cos(-1.2)},${y + r * Math.sin(-1.2)} A${r},${r} 0 0 1 ${sx + r * Math.cos(1.2)},${y + r * Math.sin(1.2)}`, stroke: col, fill: "none", opacity: 0.35, "stroke-width": 1 }, svg));
    // zaslon in vzorec
    const scr = 300;
    for (let y = 10; y < 250; y += 2) {
      const ym = ((y - cy) / 120) * 0.05; // m na zaslonu (±5 cm)
      const ph2 = (Math.PI * d * 1e-3 * ym) / (Lm * lam * 1e-9);
      const I = Math.cos(ph2) ** 2;
      s("rect", { x: scr, y, width: 30, height: 2, fill: col, opacity: I }, svg);
    }
    const dy = (lam * 1e-9 * Lm) / (d * 1e-3);
    out.innerHTML = texBlock(`\\Delta y = \\frac{\\lambda L}{d} = \\frac{${lam}\\cdot 10^{-9}\\cdot ${T(Lm, 1)}}{${T(d, 2)}\\cdot 10^{-3}} = ${T(dy * 1000, 2)}\\ \\text{mm}`) +
      `<p>Valovanje iz obeh rež se prekriva. Kjer se srečata hrib in hrib, je svetlo (<b>ojačitev</b>, razlika poti je celo število λ); kjer hrib in dolina, je temno (<b>oslabitev</b>). Nastanejo svetle in temne proge.</p>
       <p class="muted">Rdeča svetloba (daljša λ) da bolj razmaknjene proge kot modra. Bolj kot sta reži skupaj, bolj so proge narazen. Zaslon na sliki kaže ±5 cm.</p>`;
  };
  const anim = animate(el, (dt) => ((t += dt), draw()), { autoplay: false });
  layout(el, {
    stage: [svg],
    controls: [
      slider({ label: "valovna dolžina λ", min: 400, max: 700, step: 10, value: lam, unit: "nm", onInput: (v) => ((lam = v), draw()) }),
      slider({ label: "razmik rež d", min: 0.05, max: 0.5, step: 0.05, value: d, unit: "mm", onInput: (v) => ((d = v), draw()) }),
      slider({ label: "do zaslona L", min: 0.5, max: 3, step: 0.1, value: Lm, unit: "m", onInput: (v) => ((Lm = v), draw()) }),
      buttons(playButton(anim, { play: "Valovanje", pause: "Ustavi" })),
    ],
    out,
    tryText: "Kako bi iz razmika prog izmeril valovno dolžino laserja?",
  });
  draw();
}

// ------------------------------------------------------------ fotoefekt
const METAL = [["natrij", "natrij", 2.28], ["kalij", "kalij", 2.3], ["cink", "cink", 4.3], ["baker", "baker", 4.7]];
export function fotoefekt(el) {
  const svg = svgBox(340, 200), svg2 = svgBox(340, 170);
  const out = readout();
  let lam = 400, I = 50, met = "natrij", el_ = [];
  const E = () => 1240 / lam, W = () => METAL.find((m) => m[0] === met)[2];
  const draw = () => {
    svg.replaceChildren();
    svg2.replaceChildren();
    s("rect", { x: 40, y: 50, width: 18, height: 120, class: "fill-muted" }, svg);
    label(svg, 49, 182, METAL.find((m) => m[0] === met)[1], "tick");
    const col = wlColor(lam);
    for (let k = 0; k < Math.round(I / 10); k++) s("path", { d: `M${180 + k * 12},10 q-10,${20} -20,${30} t-20,30 t-20,30 t-18,32`, stroke: col, fill: "none", "stroke-width": 2, opacity: 0.8 }, svg);
    s("circle", { cx: 200, cy: 18, r: 14, fill: col, stroke: "var(--text)" }, svg);
    el_.forEach((p) => s("circle", { cx: p.x, cy: p.y, r: 3.5, class: "electron" }, svg));
    const Ek = E() - W();
    const A = { X: (x) => 40 + (x / 1.6) * 290, Y: (y) => 140 - (y / 4) * 120 };
    s("line", { x1: 40, y1: 140, x2: 334, y2: 140, class: "axis" }, svg2);
    s("line", { x1: 40, y1: 160, x2: 40, y2: 10, class: "axis" }, svg2);
    label(svg2, 334, 156, "ν [10¹⁵ Hz]", "axis-label", "end");
    label(svg2, 46, 16, "W_k [eV]", "axis-label", "start");
    [0.4, 0.8, 1.2, 1.6].forEach((x) => label(svg2, A.X(x), 152, fmt(x, 1), "tick small"));
    [1, 2, 3, 4].forEach((y) => label(svg2, 36, A.Y(y), String(y), "tick small", "end"));
    const nu0 = W() / 4.136; // 10^15 Hz
    s("line", { x1: A.X(nu0), y1: A.Y(0), x2: A.X(1.6), y2: A.Y(4.136 * 1.6 - W()), class: "graph-line stroke-c" }, svg2);
    const nu = 299792458 / (lam * 1e-9) / 1e15;
    s("circle", { cx: A.X(nu), cy: A.Y(Math.max(0, Ek)), r: 5, class: "pt fill-accent" }, svg2);
    label(svg2, A.X(nu0), A.Y(0) - 10, "ν_m", "tick b");
    out.innerHTML = texBlock(`W_k = h\\nu - A_i = ${T(E(), 2)}\\ \\text{eV} - ${T(W(), 2)}\\ \\text{eV} = ${Ek > 0 ? T(Ek, 2) : "0"}\\ \\text{eV}`) +
      `<p>${Ek > 0 ? `Foton ima dovolj energije, da izbije elektron. Največja kinetična energija izbitega elektrona je ${fmt(Ek, 2)} eV. Večja jakost svetlobe izbije <b>več</b> elektronov, ne pa hitrejših.` : `Foton s ${fmt(E(), 2)} eV ima premalo energije (izstopno delo je ${fmt(W(), 2)} eV): <b>elektronov ni</b>, ne glede na jakost svetlobe!`}</p>
       <p class="muted">Energija fotona E = hν = hc/λ ≈ 1240 eV·nm / λ. To je dokaz, da ima svetloba delčno naravo (Einstein, 1905).</p>`;
  };
  const anim = animate(el, (dt) => {
    const Ek = E() - W();
    if (Ek > 0 && Math.random() < I / 60) el_.push({ x: 60, y: 60 + Math.random() * 100, v: 120 * Math.sqrt(Ek) }); // hitrost ∝ √W_k
    el_.forEach((p) => (p.x += p.v * dt));
    el_ = el_.filter((p) => p.x < 340);
    draw();
  }, { autoplay: true });
  layout(el, {
    stage: [svg, svg2],
    controls: [
      slider({ label: "valovna dolžina", min: 200, max: 700, step: 10, value: lam, unit: "nm", onInput: (v) => ((lam = v), draw()) }),
      slider({ label: "jakost svetlobe", min: 0, max: 100, step: 10, value: I, unit: "%", onInput: (v) => ((I = v), draw()) }),
      select({ label: "kovina", options: METAL.map((m) => [m[0], `${m[1]} (A_i = ${fmt(m[2], 2)} eV)`]), value: met, onChange: (v) => ((met = v), draw()) }),
      buttons(playButton(anim, { play: "Predvajaj", pause: "Ustavi" })),
    ],
    out,
    tryText: "Posveti na cink z zelo močno rdečo svetlobo. Zakaj ne izbije nobenega elektrona?",
  });
  draw();
}

// ------------------------------------------------------------ Bohrov model in spekter vodika
export function spektri(el) {
  const svg = svgBox(340, 280);
  const out = readout();
  let ni = 3, nf = 2, lines = [];
  const En = (n) => -13.6 / (n * n);
  const draw = () => {
    svg.replaceChildren();
    const Y = (E) => 30 + ((E + 13.6) / 13.6) * -1 * -200 * 1, base = 230;
    void Y;
    const yE = (E) => base - ((E + 13.6) / 13.6) * 200;
    for (let n = 1; n <= 6; n++) {
      s("line", { x1: 30, y1: yE(En(n)), x2: 200, y2: yE(En(n)), class: "graph-line stroke-muted thin-line" }, svg);
      label(svg, 26, yE(En(n)), `n=${n}`, "tick small", "end");
      if (n <= 4) label(svg, 204, yE(En(n)), `${fmt(En(n), 2)} eV`, "tick small", "start");
    }
    const dE = En(ni) - En(nf), lam = 1240 / Math.abs(dE), col = wlColor(lam);
    arrow(svg, 110, yE(En(ni)), 110, yE(En(nf)), ni > nf ? "c" : "a", 3);
    if (ni > nf) s("path", { d: `M120,${(yE(En(ni)) + yE(En(nf))) / 2} q10,-8 20,0 t20,0 t20,0`, stroke: lam >= 380 && lam <= 780 ? col : "var(--muted)", fill: "none", "stroke-width": 2.5 }, svg);
    // spekter
    s("rect", { x: 20, y: 250, width: 300, height: 22, fill: "#0e1220" }, svg);
    const X = (l) => 20 + ((l - 380) / 400) * 300;
    lines.forEach((l) => l >= 380 && l <= 780 && s("rect", { x: X(l) - 1.5, y: 250, width: 3, height: 22, fill: wlColor(l) }, svg));
    label(svg, 20, 244, "380 nm", "tick small", "start");
    label(svg, 320, 244, "780 nm", "tick small", "end");
    out.innerHTML = texBlock(`E_n = -\\frac{13{,}6\\ \\text{eV}}{n^2},\\quad \\Delta E = |E_{${ni}} - E_{${nf}}| = ${T(Math.abs(dE), 2)}\\ \\text{eV},\\quad \\lambda = \\frac{hc}{\\Delta E} = ${T(lam, 0)}\\ \\text{nm}`) +
      `<p>${ni > nf ? `Elektron preskoči z višje na nižjo lupino in <b>izseva foton</b> z energijo ${fmt(Math.abs(dE), 2)} eV.` : ni < nf ? `Elektron foton s točno to energijo <b>absorbira</b> in preskoči višje.` : "Izberi različni lupini."} ${lam >= 380 && lam <= 780 ? "Ta svetloba je vidna." : lam < 380 ? "To je ultravijolična svetloba (Lymanova serija pri n = 1)." : "To je infrardeča svetloba."}</p>
       <p class="muted">Ker so energije v atomu le določene (kvantizirane), ima vsak element svoj črtasti spekter. Vidne črte vodika (Balmerjeva serija) končajo pri n = 2. Izsevane črte se dodajajo v spekter spodaj.</p>`;
  };
  const emit = () => {
    if (ni > nf) {
      const l = 1240 / (En(ni) - En(nf));
      if (!lines.some((q) => Math.abs(q - l) < 0.5)) lines.push(l);
    }
    draw();
  };
  layout(el, {
    stage: [svg],
    controls: [
      slider({ label: "začetna lupina", min: 1, max: 6, value: ni, onInput: (v) => ((ni = v), draw()) }),
      slider({ label: "končna lupina", min: 1, max: 6, value: nf, onInput: (v) => ((nf = v), draw()) }),
      buttons(button("Izsevaj foton", emit, "primary small"), button("Počisti spekter", () => ((lines = []), draw()))),
    ],
    out,
    tryText: "Poišči vse štiri vidne črte vodika. Pri katerem prehodu nastane rdeča črta?",
  });
  emit();
}

// ------------------------------------------------------------ radioaktivni razpad
const ISO = [["i131", "jod-131", 8, "dni"], ["c14", "ogljik-14", 5730, "let"], ["rn222", "radon-222", 3.8, "dni"], ["co60", "kobalt-60", 5.27, "let"]];
export function razpad(el) {
  const svg = svgBox(340, 160), svg2 = svgBox(340, 170);
  const out = readout();
  let iso = "i131", alive, t, hist;
  const N0 = 400;
  const reset = () => {
    alive = new Array(N0).fill(true);
    t = 0;
    hist = [[0, N0]];
  };
  const th = () => ISO.find((q) => q[0] === iso)[2];
  const draw = () => {
    svg.replaceChildren();
    svg2.replaceChildren();
    alive.forEach((a, i) => s("rect", { x: 10 + (i % 40) * 8, y: 10 + Math.floor(i / 40) * 14, width: 6, height: 10, rx: 2, class: a ? "fill-a" : "fill-muted", opacity: a ? 1 : 0.35 }, svg));
    const n = alive.filter(Boolean).length, tMax = 5 * th();
    const X = (tt) => 40 + (tt / tMax) * 290, Y = (v) => 150 - (v / N0) * 135;
    s("line", { x1: 40, y1: 150, x2: 334, y2: 150, class: "axis" }, svg2);
    s("line", { x1: 40, y1: 150, x2: 40, y2: 8, class: "axis" }, svg2);
    label(svg2, 334, 164, `t [${ISO.find((q) => q[0] === iso)[3]}]`, "axis-label", "end");
    label(svg2, 46, 14, "N", "axis-label", "start");
    for (let k = 1; k <= 5; k++) {
      s("line", { x1: X(k * th()), y1: 150, x2: X(k * th()), y2: Y(N0 / 2 ** k), class: "guide" }, svg2);
      label(svg2, X(k * th()), 160, `${k}·t½`, "tick small");
    }
    let d = "";
    for (let i = 0; i <= 100; i++) d += `${i ? "L" : "M"}${X((tMax * i) / 100).toFixed(1)},${Y(N0 * 0.5 ** ((tMax * i) / 100 / th())).toFixed(1)}`;
    s("path", { d, class: "graph-line stroke-muted thin-line", fill: "none" }, svg2);
    s("path", { d: hist.map((p, i) => `${i ? "L" : "M"}${X(Math.min(p[0], tMax)).toFixed(1)},${Y(p[1]).toFixed(1)}`).join(""), class: "graph-line stroke-a", fill: "none" }, svg2);
    out.innerHTML = texBlock(`N = N_0\\cdot 2^{-t/t_{1/2}}`) +
      `<p>${ISO.find((q) => q[0] === iso)[1]}: razpolovni čas ${fmt(th(), 2)} ${ISO.find((q) => q[0] === iso)[3]}. Po času ${fmt(t, 1)} ${ISO.find((q) => q[0] === iso)[3]} je ostalo <b>${n}</b> od ${N0} jeder (pričakovano ${fmt(N0 * 0.5 ** (t / th()), 0)}).</p>
       <p class="muted">Za posamezno jedro ne vemo, kdaj bo razpadlo: razpad je naključen. Za veliko jeder pa po vsakem razpolovnem času ostane približno polovica. Ogljik-14 uporabljamo za določanje starosti najdb.</p>`;
  };
  const anim = animate(el, (dt) => {
    const step = th() * dt * 0.6, p = 1 - 0.5 ** (step / th());
    alive = alive.map((a) => a && Math.random() > p);
    t += step;
    hist.push([t, alive.filter(Boolean).length]);
    draw();
    if (t >= 5 * th()) return false;
  }, { autoplay: false });
  const prevPlay = anim.play;
  anim.play = () => ((t >= 5 * th() && reset()), prevPlay());
  layout(el, {
    stage: [svg, svg2],
    controls: [
      select({ label: "izotop", options: ISO.map((q) => [q[0], `${q[1]} (t½ = ${fmt(q[2], 2)} ${q[3]})`]), value: iso, onChange: (v) => ((iso = v), anim.pause(), reset(), draw()) }),
      buttons(playButton(anim, { play: "Začni razpadanje", pause: "Ustavi" }), button("Znova", () => (anim.pause(), reset(), draw()))),
    ],
    out,
    tryText: "Koliko jeder pričakuješ po treh razpolovnih časih? Ponovi poskus: ali dobiš vedno enako?",
  });
  reset();
  draw();
}

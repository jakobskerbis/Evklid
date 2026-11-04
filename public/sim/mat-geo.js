// Simulacije: ravninska geometrija (točke, premice, koti, liki, konstrukcije, simetrija).
import { h, s, svgBox, slider, select, segmented, toggle, button, buttons, readout, stage, layout, tex, texBlock, fmt, tfmt, clamp, label, axes, draggable, handle, deg, rad, arrow, animate, rint } from "./kit.js";

export const dist = (P, Q) => Math.hypot(P[0] - Q[0], P[1] - Q[1]);
// Kot pri vrhu V med VA in VB v stopinjah (0–180).
export function angleAt(V, A, B) {
  const a1 = Math.atan2(A[1] - V[1], A[0] - V[0]), a2 = Math.atan2(B[1] - V[1], B[0] - V[0]);
  let d = Math.abs(a1 - a2);
  if (d > Math.PI) d = 2 * Math.PI - d;
  return deg(d);
}
// Lok kota pri V (v pikslih), od smeri VA do VB po krajši poti.
export function arcPath(V, A, B, r = 22) {
  const a1 = Math.atan2(A[1] - V[1], A[0] - V[0]);
  let a2 = Math.atan2(B[1] - V[1], B[0] - V[0]);
  let d = a2 - a1;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  const p = (a) => `${V[0] + r * Math.cos(a)},${V[1] + r * Math.sin(a)}`;
  if (Math.abs(Math.abs(d) - Math.PI / 2) < 0.01) {
    const u = [Math.cos(a1), Math.sin(a1)], v = [Math.cos(a1 + d), Math.sin(a1 + d)], q = r * 0.6;
    return `M${V[0] + u[0] * q},${V[1] + u[1] * q} L${V[0] + (u[0] + v[0]) * q},${V[1] + (u[1] + v[1]) * q} L${V[0] + v[0] * q},${V[1] + v[1] * q}`;
  }
  return `M${V[0]},${V[1]} L${p(a1)} A${r},${r} 0 0 ${d > 0 ? 1 : 0} ${p(a1 + d)} Z`;
}
const mid = (P, Q) => [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2];
const polyStr = (pts) => pts.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ");

// Več vlečnih točk na SVG. pts: { A: [x,y], … }; onChange se pokliče ob premiku.
function dragPoints(svg, layer, pts, onChange, { snap = 0, bounds = [10, 10, 330, 330], colors = {} } = {}) {
  const hs = {};
  for (const k of Object.keys(pts)) {
    const g = handle(layer, colors[k] || "a");
    label(g, 0, -16, k, "pt-lbl");
    draggable(svg, g, (x, y) => {
      if (snap) (x = Math.round(x / snap) * snap), (y = Math.round(y / snap) * snap);
      pts[k] = [clamp(x, bounds[0], bounds[2]), clamp(y, bounds[1], bounds[3])];
      onChange();
    });
    hs[k] = g;
  }
  const place = () => Object.entries(hs).forEach(([k, g]) => g.move(...pts[k]));
  return place;
}
function lineThrough(P, Q, ext = 600) {
  const d = dist(P, Q) || 1, u = [(Q[0] - P[0]) / d, (Q[1] - P[1]) / d];
  return [[P[0] - u[0] * ext, P[1] - u[1] * ext], [Q[0] + u[0] * ext, Q[1] + u[1] * ext]];
}
function intersect(P1, P2, P3, P4) {
  const d = (P1[0] - P2[0]) * (P3[1] - P4[1]) - (P1[1] - P2[1]) * (P3[0] - P4[0]);
  if (Math.abs(d) < 1e-9) return null;
  const t = ((P1[0] - P3[0]) * (P3[1] - P4[1]) - (P1[1] - P3[1]) * (P3[0] - P4[0])) / d;
  const u = -((P1[0] - P2[0]) * (P1[1] - P3[1]) - (P1[1] - P2[1]) * (P1[0] - P3[0])) / d;
  return { p: [P1[0] + t * (P2[0] - P1[0]), P1[1] + t * (P2[1] - P1[1])], t, u };
}
const CM = 30; // 1 cm = 30 px na risbah

// ------------------------------------------------------------ točke, premice, poltraki, daljice
export function premice(el) {
  const svg = svgBox(340, 300);
  const out = readout();
  const pts = { A: [60, 230], B: [270, 170], C: [90, 60], D: [240, 270] };
  let t1 = "premica", t2 = "daljica";
  const lay = s("g", {}, svg), top = s("g", {}, svg);
  const draw = () => {
    lay.replaceChildren();
    const seg = (P, Q, type, cls) => {
      const [E1, E2] = lineThrough(P, Q);
      const [a, b] = type === "premica" ? [E1, E2] : type === "poltrak" ? [P, E2] : [P, Q];
      s("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], class: `graph-line stroke-${cls}` }, lay);
    };
    seg(pts.A, pts.B, t1, "a");
    seg(pts.C, pts.D, t2, "b");
    const I = intersect(pts.A, pts.B, pts.C, pts.D);
    const ok = (t, type) => type === "premica" || (type === "poltrak" ? t >= 0 : t >= 0 && t <= 1);
    const ang = I ? angleAt([0, 0], [pts.B[0] - pts.A[0], pts.B[1] - pts.A[1]], [pts.D[0] - pts.C[0], pts.D[1] - pts.C[1]]) : 0;
    const acute = Math.min(ang, 180 - ang);
    let rel;
    if (!I || acute < 1.5) rel = "Nosilki sta <b>vzporedni</b> (∥): nimata skupne točke.";
    else {
      const hit = ok(I.t, t1) && ok(I.u, t2);
      if (hit) s("circle", { cx: I.p[0], cy: I.p[1], r: 6, class: "pt fill-c" }, lay);
      rel = `${hit ? "Sekata se v točki <span class='dot dot-c'></span> S." : "Nosilki se sekata, a presečišče ne leži na obeh likih."} Kot med nosilkama je ${fmt(acute, 0)}°${Math.abs(acute - 90) < 1.5 ? ": <b>pravokotni</b> sta (⊥)." : "."}`;
    }
    const names = { premica: "premica (neomejena v obe smeri)", poltrak: "poltrak (ima začetek, nima konca)", daljica: "daljica (ima dve krajišči)" };
    out.innerHTML = `<p><span class="dot dot-a"></span> AB je ${names[t1]}${t1 === "daljica" ? `, dolžina |AB| = ${fmt(dist(pts.A, pts.B) / CM, 1)} cm` : ""}.</p>
      <p><span class="dot dot-b"></span> CD je ${names[t2]}${t2 === "daljica" ? `, dolžina |CD| = ${fmt(dist(pts.C, pts.D) / CM, 1)} cm` : ""}.</p><p>${rel}</p>`;
    place();
  };
  const place = dragPoints(svg, top, pts, draw, { colors: { A: "a", B: "a", C: "b", D: "b" } });
  const types = [["premica", "premica"], ["poltrak", "poltrak"], ["daljica", "daljica"]];
  layout(el, {
    stage: [svg],
    controls: [select({ label: "AB", options: types, value: t1, onChange: (v) => ((t1 = v), draw()) }), select({ label: "CD", options: types, value: t2, onChange: (v) => ((t2 = v), draw()) })],
    out,
    tryText: "Povleci točke tako, da sta premici vzporedni. Nato naredi pravokotni. Ali se lahko dve daljici ne sekata, njuni nosilki pa se?",
  });
  draw();
}

// ------------------------------------------------------------ kot in kotomer
export function kot(el, { mode = "meri" } = {}) {
  const svg = svgBox(340, 230);
  const out = readout();
  const V = [170, 190];
  let ang = 50, a2 = 35, m1 = 20, m2 = 45;
  const draw = () => {
    svg.replaceChildren();
    const R = 140;
    // kotomer
    s("path", { d: `M${V[0] - R},${V[1]} A${R},${R} 0 0 1 ${V[0] + R},${V[1]} Z`, class: "protractor" }, svg);
    for (let d = 0; d <= 180; d += 5) {
      const a = rad(d), r1 = d % 10 ? R - 6 : R - 12;
      s("line", { x1: V[0] + R * Math.cos(a), y1: V[1] - R * Math.sin(a), x2: V[0] + r1 * Math.cos(a), y2: V[1] - r1 * Math.sin(a), class: "axis thin" }, svg);
      if (d % 30 === 0) label(svg, V[0] + (R - 24) * Math.cos(a), V[1] - (R - 24) * Math.sin(a), String(d), "tick");
    }
    const tip = (d, r = R + 6) => [V[0] + r * Math.cos(rad(d)), V[1] - r * Math.sin(rad(d))];
    if (mode === "meri") {
      const big = ang > 180;
      if (big) s("path", { d: `M${V[0]},${V[1]} L${V[0] + 40},${V[1]} A40,40 0 1 0 ${tip(ang, 40).join(",")} Z`, class: "angle-fill fill-a" }, svg);
      else s("path", { d: `M${V[0]},${V[1]} L${V[0] + 40},${V[1]} A40,40 0 0 0 ${tip(ang, 40).join(",")} Z`, class: "angle-fill fill-a" }, svg);
      s("line", { x1: V[0], y1: V[1], x2: V[0] + R + 10, y2: V[1], class: "ray-line" }, svg);
      const T = tip(ang);
      s("line", { x1: V[0], y1: V[1], x2: T[0], y2: T[1], class: "ray-line" }, svg);
      const hnd = handle(svg, "a");
      hnd.move(...T);
      draggable(svg, hnd, (x, y) => {
        let d = deg(Math.atan2(V[1] - y, x - V[0]));
        if (d < 0) d += 360;
        ang = Math.round(d);
        sl.set(ang, true);
        draw();
      });
      const kind = ang === 0 ? "ničelni" : ang < 90 ? "ostri" : ang === 90 ? "pravi" : ang < 180 ? "topi" : ang === 180 ? "iztegnjeni" : ang < 360 ? "udrti" : "polni";
      out.innerHTML = `<div class="demo-eq">α = <b>${ang}°</b>: ${kind} kot</div>
        <p>${ang < 90 ? "Manjši od pravega kota (90°)." : ang === 90 ? "Kraka sta pravokotna." : ang < 180 ? "Med 90° in 180°." : ang === 180 ? "Kraka ležita na isti premici, na nasprotnih straneh vrha." : "Večji od 180°: kotomer meri le do 180°, zato izmerimo 360° − α in odštejemo."}</p>
        <p class="muted">Kotomer položimo tako, da je središče na vrhu kota in ničla na enem kraku. ${ang > 180 ? `Tu: 360° − ${ang}° = ${360 - ang}°.` : ""}</p>`;
    } else {
      const b = a2, aa = ang + m1 / 60, bb = b + m2 / 60;
      s("path", { d: `M${V[0]},${V[1]} L${tip(0, 50).join(",")} A50,50 0 0 0 ${tip(aa, 50).join(",")} Z`, class: "angle-fill fill-a" }, svg);
      s("path", { d: `M${V[0]},${V[1]} L${tip(aa, 50).join(",")} A50,50 0 0 0 ${tip(aa + bb, 50).join(",")} Z`, class: "angle-fill fill-b" }, svg);
      [0, aa, aa + bb].forEach((d) => { const T = tip(d); s("line", { x1: V[0], y1: V[1], x2: T[0], y2: T[1], class: "ray-line" }, svg); });
      const A = ang * 60 + m1, B = b * 60 + m2, S = A + B;
      const dm = (x) => `${Math.floor(x / 60)}° ${x % 60}'`;
      out.innerHTML = `<div class="demo-eq"><span class="dot dot-a"></span> ${dm(A)} + <span class="dot dot-b"></span> ${dm(B)} = <b>${dm(S)}</b></div>
        <p>Seštejemo stopinje in minute posebej: ${ang + b}° ${m1 + m2}'. ${m1 + m2 >= 60 ? `Ker je ${m1 + m2}' ≥ 60', pretvorimo 60' = 1°.` : ""}</p>
        <p class="muted">1° = 60' (kotnih minut), 1' = 60''. ${S >= 90 * 60 && S <= 90 * 60 ? "Kota sta komplementarna (skupaj 90°)." : S === 180 * 60 ? "Kota sta suplementarna (skupaj 180°)." : `Do 90° manjka ${S < 5400 ? dm(5400 - S) : "nič"}, do 180° ${S < 10800 ? dm(10800 - S) : "nič"}.`}</p>`;
    }
  };
  const sl = slider({ label: "α", min: 0, max: 360, value: ang, unit: "°", onInput: (v) => ((ang = v), draw()) });
  const ctl = mode === "meri"
    ? [sl]
    : [
        slider({ label: "α (stopinje)", min: 0, max: 90, value: ang = 50, unit: "°", onInput: (v) => ((ang = v), draw()) }),
        slider({ label: "α (minute)", min: 0, max: 59, value: m1, unit: "'", onInput: (v) => ((m1 = v), draw()) }),
        slider({ label: "β (stopinje)", min: 0, max: 90, value: a2, unit: "°", onInput: (v) => ((a2 = v), draw()) }),
        slider({ label: "β (minute)", min: 0, max: 59, value: m2, unit: "'", onInput: (v) => ((m2 = v), draw()) }),
      ];
  layout(el, { stage: [svg], controls: ctl, out, tryText: mode === "meri" ? "Povleci krak in naredi topi kot. Nato udrti kot. Pri katerem kotu sta kraka na isti premici?" : "Seštej 35° 40' in 54° 20'. Ali sta kota komplementarna?" });
  draw();
}

// ------------------------------------------------------------ pari kotov (sovršni, sokoti, ob vzporednicah)
export function pariKotov(el) {
  const svg = svgBox(340, 280);
  const out = readout();
  let phi = 60, gap = 110, mode = "dve";
  const draw = () => {
    svg.replaceChildren();
    const c = [170, 140];
    const u = [Math.cos(rad(phi)), -Math.sin(rad(phi))];
    const lines = mode === "dve" ? [c[1]] : [c[1] - gap / 2, c[1] + gap / 2];
    lines.forEach((y) => s("line", { x1: 10, y1: y, x2: 330, y2: y, class: "graph-line stroke-a" }, svg));
    s("line", { x1: c[0] - u[0] * 300, y1: c[1] - u[1] * 300, x2: c[0] + u[0] * 300, y2: c[1] + u[1] * 300, class: "graph-line stroke-b" }, svg);
    const angs = [[0, phi, "α"], [phi, 180, "β"], [180, 180 + phi, "γ"], [180 + phi, 360, "δ"]];
    const cols = ["a", "b", "a", "b"];
    const pts = lines.map((y) => [c[0] + ((c[1] - y) / -u[1]) * -u[0] * -1, y]);
    // presečišče prečnice s premico y: c + t u, c[1] + t u[1] = y → t = (y - c[1]) / u[1]
    const inter = lines.map((y) => { const t = (y - c[1]) / u[1]; return [c[0] + t * u[0], y]; });
    inter.forEach((P, li) => angs.forEach(([a0, a1, n], i) => {
      const r = 26, p = (a) => `${P[0] + r * Math.cos(rad(a))},${P[1] - r * Math.sin(rad(a))}`;
      s("path", { d: `M${P[0]},${P[1]} L${p(a0)} A${r},${r} 0 0 0 ${p(a1)} Z`, class: `angle-fill fill-${cols[i]}` }, svg);
      const m = (a0 + a1) / 2;
      label(svg, P[0] + 40 * Math.cos(rad(m)), P[1] - 40 * Math.sin(rad(m)), n + (li ? "₁" : ""), "lbl small");
    }));
    void pts;
    out.innerHTML = `<p>α = γ = <b>${phi}°</b>, β = δ = <b>${180 - phi}°</b>.</p>
      <ul><li><b>Sovršna kota</b> (α in γ, β in δ) sta enaka.</li><li><b>Sokota</b> (α in β) skupaj merita 180°.</li>
      ${mode === "vzporedni" ? `<li><b>Kota z vzporednima krakoma</b>: istoležna kota α in α₁ sta enaka, izmenična kota γ in α₁ prav tako. Zato je ${phi}° povsod, kjer je ista barva.</li>` : ""}</ul>
      <p class="muted">${phi === 90 ? "Pri 90° so vsi štirje koti pravi: premici sta pravokotni." : "Spremeni kot prečnice: koti iste barve ostanejo enaki."}</p>`;
  };
  layout(el, {
    stage: [h("div", { class: "demo-seg-wrap" }, segmented({ options: [["dve", "Dve premici"], ["vzporedni", "Vzporednici in prečnica"]], value: mode, onChange: (v) => ((mode = v), draw()) })), svg],
    controls: [slider({ label: "kot α", min: 15, max: 165, value: phi, unit: "°", onInput: (v) => ((phi = v), draw()) })],
    out,
    tryText: "Kateri koti so vedno enaki, ko vrtiš prečnico? Katera dva skupaj vedno dasta 180°?",
  });
  draw();
}

// ------------------------------------------------------------ krog in krožnica
export function krog(el) {
  const svg = svgBox(340, 300);
  const out = readout();
  const S = [170, 150];
  let r = 90, mode = "tocka";
  const pts = { T: [270, 90], P: [40, 250], Q: [300, 60] };
  const lay = s("g", {}, svg), top = s("g", {}, svg);
  const draw = () => {
    lay.replaceChildren();
    s("circle", { cx: S[0], cy: S[1], r, class: "circle-fill" }, lay);
    s("circle", { cx: S[0], cy: S[1], r: 3, class: "fill-text" }, lay);
    label(lay, S[0] - 10, S[1] + 12, "S", "pt-lbl");
    s("line", { x1: S[0], y1: S[1], x2: S[0] + r, y2: S[1], class: "guide solid" }, lay);
    label(lay, S[0] + r / 2, S[1] - 9, "r", "lbl small");
    let html = "";
    if (mode === "tocka") {
      top.querySelectorAll(".handle").forEach((g, i) => (g.style.display = i === 0 ? "" : "none"));
      const d = dist(S, pts.T);
      s("line", { x1: S[0], y1: S[1], x2: pts.T[0], y2: pts.T[1], class: "guide" }, lay);
      const where = Math.abs(d - r) < 4 ? "na krožnici" : d < r ? "v krogu (znotraj krožnice)" : "zunaj kroga";
      html = `<p>Polmer r = ${fmt(r / CM, 1)} cm, premer d = 2r = ${fmt((2 * r) / CM, 1)} cm.</p><p>Razdalja |ST| = ${fmt(d / CM, 1)} cm, zato točka T leži <b>${where}</b>.</p>
        <p class="muted">Krožnica so vse točke, ki so od središča oddaljene natanko r. Krog je krožnica skupaj z vsemi točkami znotraj nje.</p>`;
    } else {
      top.querySelectorAll(".handle").forEach((g, i) => (g.style.display = i === 0 ? "none" : ""));
      const [E1, E2] = lineThrough(pts.P, pts.Q);
      s("line", { x1: E1[0], y1: E1[1], x2: E2[0], y2: E2[1], class: "graph-line stroke-b" }, lay);
      // razdalja središča do premice
      const dx = pts.Q[0] - pts.P[0], dy = pts.Q[1] - pts.P[1], L = Math.hypot(dx, dy) || 1;
      const dd = Math.abs(dy * S[0] - dx * S[1] + pts.Q[0] * pts.P[1] - pts.Q[1] * pts.P[0]) / L;
      const t = ((S[0] - pts.P[0]) * dx + (S[1] - pts.P[1]) * dy) / (L * L), F = [pts.P[0] + t * dx, pts.P[1] + t * dy];
      s("line", { x1: S[0], y1: S[1], x2: F[0], y2: F[1], class: "guide" }, lay);
      let kind;
      if (Math.abs(dd - r) < 3) { kind = "<b>tangenta</b> (dotikalnica): ima s krožnico eno skupno točko; pravokotna je na polmer v dotikališču"; s("circle", { cx: F[0], cy: F[1], r: 6, class: "pt fill-c" }, lay); }
      else if (dd < r) {
        kind = "<b>sekanta</b>: seka krožnico v dveh točkah; daljica med njima je <b>tetiva</b>";
        const hh = Math.sqrt(r * r - dd * dd), u = [dx / L, dy / L];
        const X1 = [F[0] - u[0] * hh, F[1] - u[1] * hh], X2 = [F[0] + u[0] * hh, F[1] + u[1] * hh];
        s("line", { x1: X1[0], y1: X1[1], x2: X2[0], y2: X2[1], class: "graph-line stroke-c" }, lay);
        [X1, X2].forEach((X) => s("circle", { cx: X[0], cy: X[1], r: 5, class: "pt fill-c" }, lay));
        if (dd < 3) kind += ". Gre skozi središče, zato je tetiva <b>premer</b> (najdaljša tetiva)";
      } else kind = "<b>mimobežnica</b>: nima skupnih točk s krožnico";
      html = `<p>Razdalja središča od premice je ${fmt(dd / CM, 1)} cm, polmer ${fmt(r / CM, 1)} cm. Premica je ${kind}.</p>`;
    }
    out.innerHTML = html;
    place();
  };
  const place = dragPoints(svg, top, pts, draw, { colors: { T: "a", P: "b", Q: "b" } });
  layout(el, {
    stage: [h("div", { class: "demo-seg-wrap" }, segmented({ options: [["tocka", "Točka in krog"], ["premica", "Premica in krožnica"]], value: mode, onChange: (v) => ((mode = v), draw()) })), svg],
    controls: [slider({ label: "polmer r", min: 30, max: 130, value: r, format: (v) => `${fmt(v / CM, 1)} cm`, onInput: (v) => ((r = v), draw()) })],
    out,
    tryText: "Povleci premico tako, da postane tangenta. Kakšen kot oklepa s polmerom do dotikališča?",
  });
  draw();
}

// ------------------------------------------------------------ konstrukcije s šestilom in ravnilom (po korakih)
function circleInter(C1, r1, C2, r2) {
  const d = dist(C1, C2);
  if (d > r1 + r2 || d < Math.abs(r1 - r2) || d === 0) return [];
  const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d), hh = Math.sqrt(Math.max(0, r1 * r1 - a * a));
  const P = [C1[0] + (a * (C2[0] - C1[0])) / d, C1[1] + (a * (C2[1] - C1[1])) / d];
  return [[P[0] + (hh * (C2[1] - C1[1])) / d, P[1] - (hh * (C2[0] - C1[0])) / d], [P[0] - (hh * (C2[1] - C1[1])) / d, P[1] + (hh * (C2[0] - C1[0])) / d]];
}
function rotate(P, C, a) {
  const c = Math.cos(a), sn = Math.sin(a), x = P[0] - C[0], y = P[1] - C[1];
  return [C[0] + x * c - y * sn, C[1] + x * sn + y * c];
}
// Vsak recept: given(p) → začetni elementi; steps: [[besedilo, (p, g) => elementi]].
// Elementi: ["pt", P, ime] ["seg", P, Q] ["line", P, Q] ["arc", C, r] ["poly", [..]]
const CONSTR = {
  "simetrala-daljice": {
    title: "Simetrala daljice",
    params: [],
    given: () => ({ A: [80, 200], B: [260, 200] }),
    steps: [
      ["Dana je daljica AB.", (g) => [["seg", g.A, g.B], ["pt", g.A, "A"], ["pt", g.B, "B"]]],
      ["S šestilom zariši lok s središčem v A in polmerom, večjim od polovice |AB|.", (g) => [["arc", g.A, dist(g.A, g.B) * 0.7]]],
      ["Z istim polmerom zariši lok s središčem v B.", (g) => [["arc", g.B, dist(g.A, g.B) * 0.7]]],
      ["Loka se sekata v točkah C in D.", (g) => circleInter(g.A, dist(g.A, g.B) * 0.7, g.B, dist(g.A, g.B) * 0.7).map((P, i) => ["pt", P, "CD"[i]])],
      ["Premica CD je simetrala daljice AB: pravokotna je na AB in gre skozi njeno razpolovišče. Vsaka njena točka je enako oddaljena od A in B.", (g) => { const [C, D] = circleInter(g.A, dist(g.A, g.B) * 0.7, g.B, dist(g.A, g.B) * 0.7); return [["line", C, D, "c"], ["pt", mid(g.A, g.B), "R"], ["right", mid(g.A, g.B), g.B, C]]; }],
    ],
  },
  "simetrala-kota": {
    title: "Simetrala kota",
    params: [["kot", 30, 150, 70]],
    given: (p) => ({ V: [70, 230], A: [300, 230], B: rotate([300, 230], [70, 230], -rad(p[0])) }),
    steps: [
      ["Dan je kot z vrhom V.", (g) => [["seg", g.V, g.A], ["seg", g.V, g.B], ["pt", g.V, "V"]]],
      ["Iz vrha V zariši lok, ki seka oba kraka v točkah P in Q.", (g) => { const r = 110, P = [g.V[0] + r, g.V[1]], Q = [g.V[0] + ((g.B[0] - g.V[0]) / dist(g.V, g.B)) * r, g.V[1] + ((g.B[1] - g.V[1]) / dist(g.V, g.B)) * r]; return [["arc", g.V, r], ["pt", P, "P"], ["pt", Q, "Q"]]; }],
      ["Iz P in Q zariši enako velika loka, ki se sekata v točki T.", (g) => { const r = 110, P = [g.V[0] + r, g.V[1]], Q = [g.V[0] + ((g.B[0] - g.V[0]) / dist(g.V, g.B)) * r, g.V[1] + ((g.B[1] - g.V[1]) / dist(g.V, g.B)) * r]; const T = circleInter(P, 90, Q, 90).sort((a, b) => dist(b, g.V) - dist(a, g.V))[0]; return [["arc", P, 90], ["arc", Q, 90], T && ["pt", T, "T"]]; }],
      ["Poltrak VT je simetrala kota: razdeli ga na dva enaka dela.", (g) => { const r = 110, P = [g.V[0] + r, g.V[1]], Q = [g.V[0] + ((g.B[0] - g.V[0]) / dist(g.V, g.B)) * r, g.V[1] + ((g.B[1] - g.V[1]) / dist(g.V, g.B)) * r]; const T = circleInter(P, 90, Q, 90).sort((a, b) => dist(b, g.V) - dist(a, g.V))[0]; return T ? [["ray", g.V, T, "c"]] : []; }],
    ],
  },
  pravokotnica: {
    title: "Pravokotnica skozi točko",
    params: [],
    given: () => ({ A: [30, 220], B: [310, 220], T: [180, 90] }),
    steps: [
      ["Dana je premica p in točka T, ki ne leži na njej.", (g) => [["line", g.A, g.B], ["pt", g.T, "T"]]],
      ["Iz T zariši lok, ki seka premico p v točkah P in Q.", (g) => { const r = 170, dy = g.A[1] - g.T[1], dx = Math.sqrt(r * r - dy * dy); return [["arc", g.T, r], ["pt", [g.T[0] - dx, g.A[1]], "P"], ["pt", [g.T[0] + dx, g.A[1]], "Q"]]; }],
      ["Iz P in Q zariši enako velika loka pod premico. Sekata se v točki R.", (g) => { const r = 170, dy = g.A[1] - g.T[1], dx = Math.sqrt(r * r - dy * dy), P = [g.T[0] - dx, g.A[1]], Q = [g.T[0] + dx, g.A[1]]; const R2 = circleInter(P, 150, Q, 150).sort((a, b) => b[1] - a[1])[0]; return [["arc", P, 150], ["arc", Q, 150], ["pt", R2, "R"]]; }],
      ["Premica TR je pravokotna na p.", (g) => [["line", g.T, [g.T[0], 300], "c"], ["right", [g.T[0], g.A[1]], g.B, g.T]]],
    ],
  },
  "trikotnik-sss": {
    title: "Trikotnik iz treh stranic (SSS)",
    params: [["a (cm)", 3, 9, 6], ["b (cm)", 3, 9, 5], ["c (cm)", 3, 9, 7]],
    given: (p) => ({ A: [40, 240], B: [40 + p[2] * CM, 240], a: p[0] * CM, b: p[1] * CM }),
    steps: [
      ["Nariši stranico c = AB.", (g) => [["seg", g.A, g.B], ["pt", g.A, "A"], ["pt", g.B, "B"]]],
      ["Iz A zariši lok s polmerom b.", (g) => [["arc", g.A, g.b]]],
      ["Iz B zariši lok s polmerom a.", (g) => [["arc", g.B, g.a]]],
      ["Presečišče lokov je oglišče C. Poveži ga z A in B.", (g) => { const C = circleInter(g.A, g.b, g.B, g.a).sort((x, y) => x[1] - y[1])[0]; return C ? [["seg", g.A, C, "c"], ["seg", g.B, C, "c"], ["pt", C, "C"]] : [["note", "Loka se ne sekata: trikotnik ne obstaja (velja trikotniška neenakost a + b > c)."]]; }],
    ],
  },
  "trikotnik-sks": {
    title: "Trikotnik iz dveh stranic in vmesnega kota (SKS)",
    params: [["c (cm)", 3, 9, 7], ["b (cm)", 2, 8, 5], ["kot α", 20, 150, 60]],
    given: (p) => ({ A: [40, 250], B: [40 + p[0] * CM, 250], b: p[1] * CM, al: rad(p[2]) }),
    steps: [
      ["Nariši stranico c = AB.", (g) => [["seg", g.A, g.B], ["pt", g.A, "A"], ["pt", g.B, "B"]]],
      ["V točki A nanesi kot α (s kotomerom ali konstrukcijo).", (g) => [["ray", g.A, rotate(g.B, g.A, -g.al), "muted"], ["angle", g.A, g.B, rotate(g.B, g.A, -g.al)]]],
      ["Na krak nanesi stranico b: dobiš oglišče C.", (g) => { const C = [g.A[0] + g.b * Math.cos(g.al), g.A[1] - g.b * Math.sin(g.al)]; return [["arc", g.A, g.b], ["pt", C, "C"]]; }],
      ["Poveži C z B.", (g) => { const C = [g.A[0] + g.b * Math.cos(g.al), g.A[1] - g.b * Math.sin(g.al)]; return [["seg", g.A, C, "c"], ["seg", g.B, C, "c"]]; }],
    ],
  },
  "trikotnik-ksk": {
    title: "Trikotnik iz stranice in priležnih kotov (KSK)",
    params: [["c (cm)", 3, 9, 7], ["kot α", 20, 120, 50], ["kot β", 20, 120, 60]],
    given: (p) => ({ A: [40, 250], B: [40 + p[0] * CM, 250], al: rad(p[1]), be: rad(p[2]) }),
    steps: [
      ["Nariši stranico c = AB.", (g) => [["seg", g.A, g.B], ["pt", g.A, "A"], ["pt", g.B, "B"]]],
      ["V A nanesi kot α.", (g) => [["ray", g.A, rotate(g.B, g.A, -g.al), "muted"], ["angle", g.A, g.B, rotate(g.B, g.A, -g.al)]]],
      ["V B nanesi kot β.", (g) => [["ray", g.B, rotate(g.A, g.B, g.be), "muted"], ["angle", g.B, g.A, rotate(g.A, g.B, g.be)]]],
      ["Kraka se sekata v oglišču C.", (g) => { if (g.al + g.be >= Math.PI) return [["note", "α + β ≥ 180°: kraka se ne sekata, trikotnik ne obstaja."]]; const I = intersect(g.A, rotate(g.B, g.A, -g.al), g.B, rotate(g.A, g.B, g.be)); return I ? [["seg", g.A, I.p, "c"], ["seg", g.B, I.p, "c"], ["pt", I.p, "C"]] : []; }],
    ],
  },
  paralelogram: {
    title: "Paralelogram iz stranic in kota",
    params: [["a (cm)", 3, 8, 6], ["b (cm)", 2, 6, 4], ["kot α", 30, 150, 60]],
    given: (p) => ({ A: [30, 250], B: [30 + p[0] * CM, 250], b: p[1] * CM, al: rad(p[2]) }),
    steps: [
      ["Nariši stranico a = AB.", (g) => [["seg", g.A, g.B], ["pt", g.A, "A"], ["pt", g.B, "B"]]],
      ["V A nanesi kot α in na krak stranico b: dobiš D.", (g) => { const D = [g.A[0] + g.b * Math.cos(g.al), g.A[1] - g.b * Math.sin(g.al)]; return [["angle", g.A, g.B, D], ["seg", g.A, D, "c"], ["pt", D, "D"]]; }],
      ["Iz D zariši lok s polmerom a, iz B lok s polmerom b.", (g) => { const D = [g.A[0] + g.b * Math.cos(g.al), g.A[1] - g.b * Math.sin(g.al)]; return [["arc", D, dist(g.A, g.B)], ["arc", g.B, g.b]]; }],
      ["Presečišče je C. Nasprotni stranici sta enako dolgi in vzporedni.", (g) => { const D = [g.A[0] + g.b * Math.cos(g.al), g.A[1] - g.b * Math.sin(g.al)], C = [D[0] + dist(g.A, g.B), D[1]]; return [["seg", D, C, "c"], ["seg", g.B, C, "c"], ["pt", C, "C"]]; }],
    ],
  },
  trapez: {
    title: "Trapez iz osnovnic, kraka in kota",
    params: [["a (cm)", 5, 9, 8], ["c (cm)", 2, 6, 4], ["d (cm)", 2, 6, 4], ["kot α", 40, 120, 70]],
    given: (p) => ({ A: [25, 250], B: [25 + p[0] * CM, 250], c: p[1] * CM, d: p[2] * CM, al: rad(p[3]) }),
    steps: [
      ["Nariši daljšo osnovnico a = AB.", (g) => [["seg", g.A, g.B], ["pt", g.A, "A"], ["pt", g.B, "B"]]],
      ["V A nanesi kot α in krak d: dobiš D.", (g) => { const D = [g.A[0] + g.d * Math.cos(g.al), g.A[1] - g.d * Math.sin(g.al)]; return [["angle", g.A, g.B, D], ["seg", g.A, D, "c"], ["pt", D, "D"]]; }],
      ["Skozi D nariši vzporednico z AB.", (g) => { const D = [g.A[0] + g.d * Math.cos(g.al), g.A[1] - g.d * Math.sin(g.al)]; return [["line", D, [D[0] + 10, D[1]], "muted"]]; }],
      ["Na vzporednico nanesi c: dobiš C in ga poveži z B.", (g) => { const D = [g.A[0] + g.d * Math.cos(g.al), g.A[1] - g.d * Math.sin(g.al)], C = [D[0] + g.c, D[1]]; return [["seg", D, C, "c"], ["seg", g.B, C, "c"], ["pt", C, "C"]]; }],
    ],
  },
};
export function konstrukcija(el, { recipes = ["simetrala-daljice", "simetrala-kota", "pravokotnica"] } = {}) {
  const svg = svgBox(340, 300);
  const out = readout();
  let key = recipes[0], step = 0, params = [];
  const ctl = h("div", { class: "demo-controls" });
  const build = () => {
    const C = CONSTR[key];
    params = C.params.map((p) => p[3]);
    step = 0;
    ctl.replaceChildren(
      ...(recipes.length > 1 ? [select({ label: "konstrukcija", options: recipes.map((r) => [r, CONSTR[r].title]), value: key, onChange: (v) => ((key = v), build()) })] : []),
      ...C.params.map((p, i) => slider({ label: p[0], min: p[1], max: p[2], value: p[3], unit: /kot/.test(p[0]) ? "°" : "", onInput: (v) => ((params[i] = v), draw()) })),
      buttons(button("← Nazaj", () => ((step = Math.max(0, step - 1)), draw())), button("Naprej →", () => ((step = Math.min(CONSTR[key].steps.length - 1, step + 1)), draw()), "primary small"), button("Vse naenkrat", () => ((step = CONSTR[key].steps.length - 1), draw()))),
    );
    draw();
  };
  const draw = () => {
    svg.replaceChildren();
    const C = CONSTR[key], g = C.given(params);
    const notes = [];
    for (let i = 0; i <= step; i++) {
      const items = C.steps[i][1](g).filter(Boolean);
      const cur = i === step;
      for (const it of items) {
        const [t] = it;
        const cls = cur ? "cur" : "";
        if (t === "pt") { s("circle", { cx: it[1][0], cy: it[1][1], r: 4.5, class: "pt fill-text" }, svg); label(svg, it[1][0] + 10, it[1][1] - 10, it[2], "pt-lbl"); }
        else if (t === "seg") s("line", { x1: it[1][0], y1: it[1][1], x2: it[2][0], y2: it[2][1], class: `cons-line stroke-${it[3] || "text"} ${cls}` }, svg);
        else if (t === "line" || t === "ray") { const [E1, E2] = lineThrough(it[1], it[2]); const a = t === "ray" ? it[1] : E1; s("line", { x1: a[0], y1: a[1], x2: E2[0], y2: E2[1], class: `cons-line stroke-${it[3] || "text"} ${cls}` }, svg); }
        else if (t === "arc") s("circle", { cx: it[1][0], cy: it[1][1], r: it[2], class: `cons-arc ${cls}` }, svg);
        else if (t === "angle") s("path", { d: arcPath(it[1], it[2], it[3], 26), class: "angle-fill fill-a" }, svg);
        else if (t === "right") s("path", { d: arcPath(it[1], it[2], it[3], 16), class: "right-angle" }, svg);
        else if (t === "note" && cur) notes.push(it[1]);
      }
    }
    out.innerHTML = `<p><b>Korak ${step + 1} od ${C.steps.length}:</b> ${C.steps[step][0]}</p>${notes.map((n) => `<p class="fb bad">${n}</p>`).join("")}
      <ol class="cons-steps">${C.steps.map((st, i) => `<li class="${i === step ? "on" : i < step ? "done" : ""}">${st[0]}</li>`).join("")}</ol>`;
  };
  layout(el, { stage: [svg], controls: ctl, out, tryText: "Nariši konstrukcijo še sam v zvezek, korak za korakom. Pri trikotnikih poišči podatke, pri katerih trikotnik ne obstaja." });
  build();
}

// ------------------------------------------------------------ simetrija (zrcaljenje čez os, središčna simetrija)
export function simetrija(el) {
  const svg = svgBox(340, 300);
  const out = readout();
  const pts = { A: [60, 80], B: [130, 60], C: [110, 160] };
  let mode = "os";
  const O = [170, 150];
  const lay = s("g", {}, svg), top = s("g", {}, svg);
  const draw = () => {
    lay.replaceChildren();
    const refl = (P) => (mode === "os" ? [2 * O[0] - P[0], P[1]] : mode === "posevna" ? [P[1] - O[1] + O[0], P[0] - O[0] + O[1]] : [2 * O[0] - P[0], 2 * O[1] - P[1]]);
    if (mode === "os") s("line", { x1: O[0], y1: 5, x2: O[0], y2: 295, class: "axis-sym" }, lay);
    if (mode === "posevna") s("line", { x1: O[0] - 150, y1: O[1] - 150, x2: O[0] + 150, y2: O[1] + 150, class: "axis-sym" }, lay);
    if (mode === "sredisce") { s("circle", { cx: O[0], cy: O[1], r: 5, class: "pt fill-text" }, lay); label(lay, O[0] + 10, O[1] - 10, "O", "pt-lbl"); }
    const P = ["A", "B", "C"].map((k) => pts[k]), Q = P.map(refl);
    s("polygon", { points: polyStr(P), class: "shape fill-a" }, lay);
    s("polygon", { points: polyStr(Q), class: "shape fill-b" }, lay);
    P.forEach((p, i) => {
      s("line", { x1: p[0], y1: p[1], x2: Q[i][0], y2: Q[i][1], class: "guide" }, lay);
      label(lay, Q[i][0] + 10, Q[i][1] - 10, "ABC"[i] + "'", "pt-lbl");
    });
    const d = (p) => (mode === "os" ? Math.abs(p[0] - O[0]) : mode === "posevna" ? Math.abs(p[0] - O[0] - (p[1] - O[1])) / Math.SQRT2 : dist(p, O));
    out.innerHTML = `<p>${mode === "sredisce" ? "Pri <b>središčni simetriji</b> je O razpolovišče daljic AA', BB' in CC'. Lik se zasuka za 180°." : "Pri <b>zrcaljenju čez os</b> je os simetrale daljic AA', BB' in CC': zveznice so pravokotne na os, točka in slika sta enako oddaljeni od osi."}</p>
      <p>Razdalji od ${mode === "sredisce" ? "O" : "osi"}: A ${fmt(d(pts.A) / CM, 1)} cm, A' ${fmt(d(Q[0]) / CM, 1)} cm.</p>
      <p class="muted">Slika je skladna z likom (enake stranice in koti). ${mode === "sredisce" ? "Orientacija ostane enaka." : "Orientacija se obrne: A → B → C gre v nasprotno smer kot A' → B' → C'."}</p>`;
    place();
  };
  const place = dragPoints(svg, top, pts, draw, {});
  layout(el, {
    stage: [h("div", { class: "demo-seg-wrap" }, segmented({ options: [["os", "Navpična os"], ["posevna", "Poševna os"], ["sredisce", "Središčna"]], value: mode, onChange: (v) => ((mode = v), draw()) })), svg],
    out,
    tryText: "Povleci točko A na os. Kje je zdaj A'? Ali lahko trikotnik postaviš tako, da se slika prekrije z njim?",
  });
  draw();
}

// ------------------------------------------------------------ obseg in ploščina pravokotnika
export function pravokotnik(el) {
  const svg = svgBox(340, 260);
  const out = readout();
  let a = 6, b = 4, t = 0;
  const C = 24;
  const ant = s("circle", { r: 7, class: "pt fill-c" });
  const draw = () => {
    svg.replaceChildren();
    const ox = (340 - a * C) / 2, oy = 20;
    for (let i = 0; i < a; i++) for (let j = 0; j < b; j++) s("rect", { x: ox + i * C + 1, y: oy + j * C + 1, width: C - 2, height: C - 2, rx: 3, class: "tile fill-a" }, svg);
    s("rect", { x: ox, y: oy, width: a * C, height: b * C, class: "perim" }, svg);
    label(svg, ox + (a * C) / 2, oy + b * C + 16, `a = ${a} cm`, "lbl");
    label(svg, ox - 28, oy + (b * C) / 2, `b = ${b} cm`, "lbl");
    svg.append(ant);
    out.innerHTML = `<p><b>Ploščina</b>: v pravokotnik gre ${b} vrst po ${a} kvadratkov s stranico 1 cm: ${tex(`p = a\\cdot b = ${a}\\cdot ${b} = ${a * b}\\,\\mathrm{cm}^2`)}.</p>
      <p><b>Obseg</b>: pikica obhodi rob, prehodi ${tex(`o = 2a + 2b = 2\\cdot ${a} + 2\\cdot ${b} = ${2 * a + 2 * b}\\,\\mathrm{cm}`)}.</p>
      <p class="muted">${a === b ? "Pravokotnik z enakima stranicama je kvadrat: p = a², o = 4a." : "Poišči drug pravokotnik z enako ploščino: ali ima tudi enak obseg?"}</p>`;
  };
  animate(el, (dt) => {
    t = (t + dt * 4) % (2 * a + 2 * b);
    const ox = (340 - a * C) / 2, oy = 20;
    let d = t, x, y;
    if (d < a) (x = ox + d * C), (y = oy);
    else if ((d -= a) < b) (x = ox + a * C), (y = oy + d * C);
    else if ((d -= b) < a) (x = ox + (a - d) * C), (y = oy + b * C);
    else (d -= a), (x = ox), (y = oy + (b - d) * C);
    ant.setAttribute("cx", x);
    ant.setAttribute("cy", y);
  });
  layout(el, {
    stage: [svg],
    controls: [slider({ label: "a", min: 1, max: 12, value: a, unit: "cm", onInput: (v) => ((a = v), draw()) }), slider({ label: "b", min: 1, max: 9, value: b, unit: "cm", onInput: (v) => ((b = v), draw()) })],
    out,
    tryText: "Pravokotnika 6 × 4 in 8 × 3 imata enako ploščino. Imata enak obseg? Kateri pravokotnik s ploščino 36 cm² ima najmanjši obseg?",
  });
  draw();
}

// ------------------------------------------------------------ trikotnik (vrste, koti, značilne točke, izreki)
export function trikotnik(el, { mode = "vrste" } = {}) {
  const svg = svgBox(340, 300);
  const out = readout();
  const pts = { A: [50, 250], B: [290, 250], C: [140, 70] };
  const show = { O: false, S: false, T: false, H: false };
  const lay = s("g", {}, svg), top = s("g", {}, svg);
  const draw = () => {
    lay.replaceChildren();
    const { A, B, C } = pts;
    const a = dist(B, C), b = dist(A, C), c = dist(A, B);
    const al = angleAt(A, B, C), be = angleAt(B, A, C), ga = 180 - al - be;
    s("polygon", { points: polyStr([A, B, C]), class: "shape fill-soft" }, lay);
    [[A, B, C, "a"], [B, C, A, "b"], [C, A, B, "c"]].forEach(([V, P, Q, col]) => s("path", { d: arcPath(V, P, Q, 24), class: `angle-fill fill-${col}` }, lay));
    label(lay, ...mid(B, C).map((v, i) => v + (i ? -8 : 10)), "a", "lbl small");
    label(lay, ...mid(A, C).map((v, i) => v + (i ? -8 : -10)), "b", "lbl small");
    label(lay, mid(A, B)[0], mid(A, B)[1] + 14, "c", "lbl small");
    const r1 = Math.round(al), r2 = Math.round(be), r3 = 180 - r1 - r2;
    const cm = (x) => fmt(x / CM, 1);
    let html = "";
    if (mode === "vrste" || mode === "koti") {
      const eq = (x, y) => Math.abs(x - y) < 6;
      const bySides = eq(a, b) && eq(b, c) ? "enakostranični" : eq(a, b) || eq(b, c) || eq(a, c) ? "enakokraki" : "raznostranični";
      const byAngles = Math.max(r1, r2, r3) > 90 ? "topokotni" : Math.max(r1, r2, r3) === 90 ? "pravokotni" : "ostrokotni";
      html = `<p>Po stranicah: <b>${bySides}</b> (a = ${cm(a)}, b = ${cm(b)}, c = ${cm(c)} cm). Po kotih: <b>${byAngles}</b>.</p>
        <p><span class="dot dot-a"></span> α = ${r1}°, <span class="dot dot-b"></span> β = ${r2}°, <span class="dot dot-c"></span> γ = ${r3}°, vsota = <b>180°</b>.</p>
        <p class="muted">${mode === "koti" ? "Spodaj so trije koti postavljeni drug ob drugega: vedno sestavijo iztegnjeni kot (180°)." : "Nasproti najdaljše stranice leži največji kot."} Trikotniška neenakost: ${cm(a)} + ${cm(b)} > ${cm(c)}.</p>`;
      if (mode === "koti") {
        const P = [170, 292];
        let a0 = 180;
        [[r1, "a"], [r2, "b"], [r3, "c"]].forEach(([v, col]) => {
          const p = (x) => `${P[0] + 36 * Math.cos(rad(x))},${P[1] - 36 * Math.sin(rad(x))}`;
          s("path", { d: `M${P[0]},${P[1]} L${p(a0)} A36,36 0 0 1 ${p(a0 - v)} Z`, class: `angle-fill fill-${col}`, style: "opacity:.8" }, lay);
          a0 -= v;
        });
        s("line", { x1: P[0] - 50, y1: P[1], x2: P[0] + 50, y2: P[1], class: "axis" }, lay);
      }
    } else if (mode === "tocke") {
      const bary = (wa, wb, wc) => [(wa * A[0] + wb * B[0] + wc * C[0]) / (wa + wb + wc), (wa * A[1] + wb * B[1] + wc * C[1]) / (wa + wb + wc)];
      const sa = Math.sin(rad(2 * al)), sb = Math.sin(rad(2 * be)), sc = Math.sin(rad(2 * ga));
      const O = bary(sa, sb, sc), S = bary(a, b, c), T = bary(1, 1, 1);
      const H = [A[0] + B[0] + C[0] - 2 * O[0], A[1] + B[1] + C[1] - 2 * O[1]];
      const foot = (P, Q, R) => { const d = [R[0] - Q[0], R[1] - Q[1]], t = ((P[0] - Q[0]) * d[0] + (P[1] - Q[1]) * d[1]) / (d[0] ** 2 + d[1] ** 2); return [Q[0] + t * d[0], Q[1] + t * d[1]]; };
      if (show.O) { [[A, B], [B, C], [C, A]].forEach(([P, Q]) => { const M = mid(P, Q); s("line", { x1: M[0], y1: M[1], x2: O[0], y2: O[1], class: "cons-line stroke-a" }, lay); }); s("circle", { cx: O[0], cy: O[1], r: dist(O, A), class: "cons-arc stroke-a" }, lay); s("circle", { cx: O[0], cy: O[1], r: 5, class: "pt fill-a" }, lay); label(lay, O[0] + 9, O[1] - 9, "O", "pt-lbl"); }
      if (show.S) { [A, B, C].forEach((V) => s("line", { x1: V[0], y1: V[1], x2: S[0], y2: S[1], class: "cons-line stroke-b" }, lay)); const rr = (2 * (0.5 * Math.abs((B[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (B[1] - A[1])))) / (a + b + c); s("circle", { cx: S[0], cy: S[1], r: rr, class: "cons-arc stroke-b" }, lay); s("circle", { cx: S[0], cy: S[1], r: 5, class: "pt fill-b" }, lay); label(lay, S[0] + 9, S[1] - 9, "S", "pt-lbl"); }
      if (show.T) { [[A, B, C], [B, C, A], [C, A, B]].forEach(([V, P, Q]) => { const M = mid(P, Q); s("line", { x1: V[0], y1: V[1], x2: M[0], y2: M[1], class: "cons-line stroke-c" }, lay); }); s("circle", { cx: T[0], cy: T[1], r: 5, class: "pt fill-c" }, lay); label(lay, T[0] + 9, T[1] - 9, "T", "pt-lbl"); }
      if (show.H) { [[A, B, C], [B, C, A], [C, A, B]].forEach(([V, P, Q]) => { const F = foot(V, P, Q); s("line", { x1: V[0], y1: V[1], x2: F[0], y2: F[1], class: "cons-line stroke-danger" }, lay); }); s("circle", { cx: H[0], cy: H[1], r: 5, class: "pt fill-danger" }, lay); label(lay, H[0] + 9, H[1] - 9, "V", "pt-lbl"); }
      html = `<ul><li><span class="dot dot-a"></span> <b>O</b>: presečišče simetral stranic, središče trikotniku očrtane krožnice (enako oddaljeno od oglišč).</li>
        <li><span class="dot dot-b"></span> <b>S</b>: presečišče simetral kotov, središče včrtane krožnice (enako oddaljeno od stranic).</li>
        <li><span class="dot dot-c"></span> <b>T</b>: težišče, presečišče težiščnic; težiščnico deli v razmerju 2 : 1.</li>
        <li><span class="dot" style="background:var(--danger)"></span> <b>V</b>: višinska točka, presečišče nosilk višin.</li></ul>
        <p class="muted">${Math.max(r1, r2, r3) > 90 ? "Trikotnik je topokoten: O in V ležita zunaj trikotnika." : Math.max(r1, r2, r3) === 90 ? "Pri pravokotnem trikotniku je O na sredini hipotenuze, V v pravem kotu." : "Pri ostrokotnem trikotniku so vse štiri točke znotraj."} O, T in V vedno ležijo na isti premici (Eulerjeva premica).</p>`;
    } else {
      // Vse izpisane rezultate računamo iz izpisanih (zaokroženih) podatkov, da jih učenec lahko ponovi:
      // stranici a, b in kota α, β na 2 decimalki, γ = 180° − α − β, c iz kosinusnega izreka.
      const A2 = (x) => tfmt(x, 2), K1 = (x) => tfmt(x, 2), r2d = (x) => Number(x.toFixed(2));
      const al1 = r2d(al), be1 = r2d(be), ga1 = r2d(180 - al1 - be1);
      const sa = r2d(a / CM), sb = r2d(b / CM);
      const c2 = sa * sa + sb * sb - 2 * sa * sb * Math.cos(rad(ga1)), sc = r2d(Math.sqrt(Math.max(c2, 0)));
      const q = [sa / Math.sin(rad(al1)), sb / Math.sin(rad(be1)), sc / Math.sin(rad(ga1))];
      const razlika = new Set(q.map((x) => x.toFixed(2))).size > 1;
      html = texBlock(`\\begin{aligned}\\frac{a}{\\sin\\alpha} &= \\frac{${A2(sa)}}{\\sin ${K1(al1)}^\\circ} = ${A2(q[0])}\\\\ \\frac{b}{\\sin\\beta} &= \\frac{${A2(sb)}}{\\sin ${K1(be1)}^\\circ} = ${A2(q[1])}\\\\ \\frac{c}{\\sin\\gamma} &= \\frac{${A2(sc)}}{\\sin ${K1(ga1)}^\\circ} = ${A2(q[2])}\\end{aligned}`) +
        `<p><b>Sinusni izrek</b>: razmerje stranice in sinusa nasprotnega kota je za vse tri enako (= 2R, premer očrtane krožnice).${razlika ? " Razlike v zadnji decimalki so posledica zaokroževanja." : ""}</p>` +
        texBlock(`\\begin{aligned}c^2 &= a^2 + b^2 - 2ab\\cos\\gamma\\\\ &= ${A2(sa)}^2 + ${A2(sb)}^2\\\\ &\\quad - 2\\cdot ${A2(sa)}\\cdot ${A2(sb)}\\cdot\\cos ${K1(ga1)}^\\circ\\\\ &\\approx ${A2(c2)}\\\\ c &\\approx ${A2(sc)}\\end{aligned}`) +
        `<p><b>Kosinusni izrek</b> posploši Pitagorov izrek: pri γ = 90° je cos γ = 0. ${ga1 > 90 ? "Kot γ je top, cos γ < 0, zato je c² večji od a² + b²." : ga1 < 90 ? "Kot γ je oster, zato je c² manjši od a² + b²." : ""}</p>`;
    }
    out.innerHTML = html;
    place();
  };
  // Pri izrekih lahko trikotnik izberemo tudi brez vlečenja (predvajalnik videa ne more vleči): podani a, b (cm) in γ.
  const TRI = { ostrokotni: [6, 7, 60], topokotni: [4, 5, 120], pravokotni: [6, 8, 90] };
  let triSel = null;
  const setTri = (key) => {
    if (!TRI[key]) return;
    const [ta, tb, tg] = TRI[key];
    const tc = Math.sqrt(ta * ta + tb * tb - 2 * ta * tb * Math.cos(rad(tg)));
    const tal = Math.acos((tb * tb + tc * tc - ta * ta) / (2 * tb * tc)), x0 = 170 - (tc * CM) / 2;
    const hc = tb * CM * Math.sin(tal), y0 = 150 + hc / 2; // trikotnik navpično na sredini slike
    pts.A = [x0, y0];
    pts.B = [x0 + tc * CM, y0];
    pts.C = [x0 + tb * CM * Math.cos(tal), y0 - hc];
    draw();
  };
  const place = dragPoints(svg, top, pts, () => (triSel && (triSel.sel.value = "lastni"), draw()), { bounds: [10, 10, 330, 280] });
  if (mode === "tocke") show.T = true;
  if (mode === "izreki") triSel = select({ label: "trikotnik", options: [["lastni", "lastni (povleci)"], ["ostrokotni", "ostrokotni (6 cm, 7 cm, 60°)"], ["topokotni", "topokotni (4 cm, 5 cm, 120°)"], ["pravokotni", "pravokotni (6 cm, 8 cm, 90°)"]], value: "lastni", onChange: setTri });
  const ctl = mode === "tocke" ? [buttons(...["O", "S", "T", "H"].map((k) => toggle({ O: "simetrale stranic", S: "simetrale kotov", T: "težiščnice", H: "višine" }[k], show[k], (v) => ((show[k] = v), draw()))))] : triSel ? [triSel] : [];
  layout(el, {
    stage: [svg],
    controls: ctl,
    out,
    tryText: mode === "tocke" ? "Vklopi vse štiri. Povleci C tako, da je trikotnik topokoten. Katere točke pridejo ven?" : mode === "izreki" ? "Naredi kot γ pravi. V kaj se spremeni kosinusni izrek?" : "Povleci oglišča in naredi enakokraki pravokotni trikotnik. Koliko merita ostra kota?",
  });
  draw();
}

// ------------------------------------------------------------ ploščine likov (preoblikovanje)
export function ploscine(el, { shapes = ["paralelogram", "trikotnik", "trapez", "romb"] } = {}) {
  const svg = svgBox(340, 240);
  const out = readout();
  let shape = shapes[0], t = 0, a = 7, v = 4, c = 3, sh = 2;
  const U = 28;
  const ctl = h("div", { class: "demo-controls" });
  const draw = () => {
    svg.replaceChildren();
    const ox = 30, oy = 200;
    const P = (x, y) => [ox + x * U, oy - y * U];
    const poly = (pts, cls) => s("polygon", { points: polyStr(pts.map((p) => P(...p))), class: cls }, svg);
    let html = "";
    for (let i = 0; i <= 10; i++) s("line", { x1: ox + i * U, y1: oy - 6 * U, x2: ox + i * U, y2: oy, class: "grid" }, svg);
    for (let j = 0; j <= 6; j++) s("line", { x1: ox, y1: oy - j * U, x2: ox + 10 * U, y2: oy - j * U, class: "grid" }, svg);
    if (shape === "paralelogram") {
      // odrežemo trikotnik na levi in ga premaknemo na desno
      poly([[sh, v], [0, 0], [a - sh, 0], [a - sh + sh, v]].map(([x, y]) => [x, y]).slice(0, 0), "");
      poly([[sh, 0], [a, 0], [a + sh, v], [sh, v]], "shape fill-a");
      poly([[0 + t * a, 0], [sh + t * a, 0], [sh + t * a, v]], "shape fill-b");
      if (t < 1) poly([[sh, 0], [sh, v], [0 + sh, v]], "");
      s("line", { x1: P(sh, 0)[0], y1: P(sh, 0)[1], x2: P(sh, v)[0], y2: P(sh, v)[1], class: "guide" }, svg);
      html = `<p>Paralelogram razrežemo vzdolž višine in odrezani trikotnik premaknemo na drugo stran (drsnik). Dobimo pravokotnik z enako osnovnico in višino.</p>${texBlock(`p = a\\cdot v_a = ${a}\\cdot ${v} = ${a * v}`)}`;
    } else if (shape === "trikotnik") {
      poly([[0, 0], [a, 0], [sh, v]], "shape fill-a");
      // druga kopija, zasukana za 180° okoli razpolovišča stranice BC
      const rotT = (x, y) => [a + sh - x, v - y];
      const k = t;
      const copy = [[0, 0], [a, 0], [sh, v]].map(([x, y]) => { const [rx, ry] = rotT(x, y); return [x + (rx - x) * k, y + (ry - y) * k]; });
      poly(copy, "shape fill-b ghosty");
      html = `<p>Dva enaka trikotnika sestavita paralelogram z osnovnico a in višino v (drsnik). Trikotnik je torej <b>polovica</b> paralelograma.</p>${texBlock(`p = \\frac{a\\cdot v_a}{2} = \\frac{${a}\\cdot ${v}}{2} = ${fmt((a * v) / 2)}`)}<p class="muted">Povleci vrh vodoravno (drsnik »zamik vrha«): ploščina se ne spremeni, ker osnovnica in višina ostaneta enaki.</p>`;
    } else if (shape === "trapez") {
      const pts = [[0, 0], [a, 0], [sh + c, v], [sh, v]];
      poly(pts, "shape fill-a");
      const rotT = (x, y) => [a + c - x, v - y];
      const copy = pts.map(([x, y]) => { const [rx, ry] = rotT(x, y); return [x + (rx - x + (a + c - a)) * 0 + (rx - x) * t + 0, y + (ry - y) * t]; }).map(([x, y]) => [x + t * 0, y]);
      poly(copy.map(([x, y], i) => [x + (t ? 0 : 0), y]), "shape fill-b ghosty");
      html = `<p>Dva enaka trapeza (drugi zasukan za 180°) sestavita paralelogram z osnovnico a + c in višino v.</p>${texBlock(`p = \\frac{(a + c)\\cdot v}{2} = \\frac{(${a} + ${c})\\cdot ${v}}{2} = ${fmt(((a + c) * v) / 2)}`)}<p class="muted">Ko je c = 0, je trapez trikotnik; ko je c = a, je paralelogram.</p>`;
    } else {
      const e = a, f = v;
      const C0 = [e / 2, f / 2];
      s("rect", { x: P(0, f)[0], y: P(0, f)[1], width: e * U, height: f * U, class: "shape dashed" }, svg);
      poly([[e / 2, 0], [e, f / 2], [e / 2, f], [0, f / 2]], "shape fill-a");
      s("line", { x1: P(0, f / 2)[0], y1: P(0, f / 2)[1], x2: P(e, f / 2)[0], y2: P(e, f / 2)[1], class: "guide solid" }, svg);
      s("line", { x1: P(e / 2, 0)[0], y1: P(e / 2, 0)[1], x2: P(e / 2, f)[0], y2: P(e / 2, f)[1], class: "guide solid" }, svg);
      void C0;
      html = `<p>Romb (in deltoid) leži v pravokotniku s stranicama e in f (diagonali). Pobarvani del je natanko <b>polovica</b> pravokotnika: vsak od štirih kotnih trikotnikov ima par v rombu.</p>${texBlock(`p = \\frac{e\\cdot f}{2} = \\frac{${e}\\cdot ${f}}{2} = ${fmt((e * f) / 2)}`)}`;
    }
    out.innerHTML = html + `<p class="muted">En kvadratek mreže je 1 cm². Preštej in preveri formulo.</p>`;
  };
  const build = () => {
    ctl.replaceChildren(
      ...(shapes.length > 1 ? [select({ label: "lik", options: shapes.map((x) => [x, { paralelogram: "paralelogram", trikotnik: "trikotnik", trapez: "trapez", romb: "romb in deltoid" }[x]]), value: shape, onChange: (x) => ((shape = x), (t = 0), build()) })] : []),
      slider({ label: shape === "romb" ? "e" : "a", min: 2, max: shape === "trapez" ? 6 : 8, value: a, onInput: (x) => ((a = x), draw()) }),
      slider({ label: shape === "romb" ? "f" : "v", min: 1, max: 6, value: v, onInput: (x) => ((v = x), draw()) }),
      ...(shape === "trapez" ? [slider({ label: "c", min: 0, max: 4, value: c, onInput: (x) => ((c = x), draw()) })] : []),
      ...(shape !== "romb" ? [slider({ label: "zamik vrha", min: 0, max: 3, step: 0.5, value: sh, onInput: (x) => ((sh = x), draw()) }), slider({ label: "preoblikuj", min: 0, max: 1, step: 0.05, value: t, onInput: (x) => ((t = x), draw()), format: (x) => `${Math.round(x * 100)} %` })] : []),
    );
    draw();
  };
  layout(el, { stage: [svg], controls: ctl, out, tryText: "Spremeni zamik vrha. Ali se ploščina spremeni? Zakaj ne?" });
  build();
}

// ------------------------------------------------------------ štirikotniki
const QUADS = {
  kvadrat: [[90, 230], [230, 230], [230, 90], [90, 90]],
  pravokotnik: [[60, 220], [280, 220], [280, 110], [60, 110]],
  romb: [[70, 210], [200, 210], [270, 100], [140, 100]],
  paralelogram: [[50, 220], [230, 220], [290, 100], [110, 100]],
  trapez: [[40, 230], [300, 230], [230, 100], [110, 100]],
  deltoid: [[170, 260], [260, 130], [170, 50], [80, 130]],
};
export function stirikotnik(el) {
  const svg = svgBox(340, 290);
  const out = readout();
  const pts = {};
  const setQ = (k) => QUADS[k].forEach((p, i) => (pts["ABCD"[i]] = [...p]));
  setQ("paralelogram");
  let diag = true;
  const lay = s("g", {}, svg), top = s("g", {}, svg);
  const draw = () => {
    lay.replaceChildren();
    const P = ["A", "B", "C", "D"].map((k) => pts[k]);
    s("polygon", { points: polyStr(P), class: "shape fill-soft" }, lay);
    const side = (i) => dist(P[i], P[(i + 1) % 4]);
    const dir = (i) => Math.atan2(P[(i + 1) % 4][1] - P[i][1], P[(i + 1) % 4][0] - P[i][0]);
    const par = (i, j) => { let d = Math.abs(dir(i) - dir(j)) % Math.PI; return Math.min(d, Math.PI - d) < 0.04; };
    const angs = P.map((V, i) => angleAt(V, P[(i + 3) % 4], P[(i + 1) % 4]));
    const eqs = (x, y) => Math.abs(x - y) < 5;
    const p1 = par(0, 2), p2 = par(1, 3);
    const allEq = [1, 2, 3].every((i) => eqs(side(i), side(0)));
    const right = angs.every((x) => Math.abs(x - 90) < 3);
    const kite = (eqs(side(0), side(1)) && eqs(side(2), side(3))) || (eqs(side(1), side(2)) && eqs(side(3), side(0)));
    const type = p1 && p2 ? (right ? (allEq ? "kvadrat" : "pravokotnik") : allEq ? "romb" : "paralelogram") : p1 || p2 ? "trapez" : kite ? "deltoid" : "splošni štirikotnik";
    P.forEach((V, i) => s("path", { d: arcPath(V, P[(i + 3) % 4], P[(i + 1) % 4], 20), class: `angle-fill fill-${"abca"[i]}` }, lay));
    // oznake vzporednosti
    [[0, 2, p1], [1, 3, p2]].forEach(([i, j, on], k) => on && [i, j].forEach((q) => { const M = mid(P[q], P[(q + 1) % 4]); label(lay, M[0], M[1], k ? "»" : "›", "par-mark"); }));
    if (diag) {
      s("line", { x1: P[0][0], y1: P[0][1], x2: P[2][0], y2: P[2][1], class: "guide solid" }, lay);
      s("line", { x1: P[1][0], y1: P[1][1], x2: P[3][0], y2: P[3][1], class: "guide solid" }, lay);
    }
    const e = dist(P[0], P[2]), f = dist(P[1], P[3]);
    const I = intersect(P[0], P[2], P[1], P[3]);
    const perp = I && Math.abs(angleAt(I.p, P[0], P[1]) - 90) < 3;
    const bis = I && Math.abs(I.t - 0.5) < 0.03 && Math.abs(I.u - 0.5) < 0.03;
    out.innerHTML = `<div class="demo-eq">To je <b>${type}</b>.</div>
      <p>Stranice: ${[0, 1, 2, 3].map((i) => fmt(side(i) / CM, 1)).join(", ")} cm. Koti: ${angs.map((x) => Math.round(x) + "°").join(", ")} (vsota 360°).</p>
      <p>${p1 && p2 ? "Dva para vzporednih stranic." : p1 || p2 ? "En par vzporednih stranic (osnovnici)." : "Ni vzporednih stranic."}${diag ? ` Diagonali: e = ${fmt(e / CM, 1)} cm, f = ${fmt(f / CM, 1)} cm${eqs(e, f) ? " (enako dolgi)" : ""}${perp ? ", pravokotni" : ""}${bis ? ", se razpolavljata" : ""}.` : ""}</p>`;
    place();
  };
  const place = dragPoints(svg, top, pts, draw, { bounds: [10, 20, 330, 280] });
  const chips = h("div", { class: "demo-chips" }, Object.keys(QUADS).map((k) => button(k, () => (setQ(k), draw()), "chip-btn")));
  layout(el, { stage: [svg], extra: chips, controls: [toggle("pokaži diagonali", diag, (v) => ((diag = v), draw()))], out, tryText: "Izberi romb in poglej diagonali. Kaj velja zanju? Ali je vsak kvadrat tudi romb? Ali je vsak romb kvadrat?" });
  draw();
}

// ------------------------------------------------------------ obseg in ploščina kroga
export function krogPloscina(el) {
  const svg = svgBox(340, 260);
  const out = readout();
  let n = 12, t = 0, r = 60;
  const draw = () => {
    svg.replaceChildren();
    const C = [90, 80];
    const wedge = (k, cx, cy, rotA) => {
      const a0 = rotA - Math.PI / n, a1 = rotA + Math.PI / n;
      const p = (a) => `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
      return `M${cx},${cy} L${p(a0)} A${r},${r} 0 0 1 ${p(a1)} Z`;
    };
    const w = (Math.PI * r) / (n / 2); // širina enega izseka ob loku
    for (let k = 0; k < n; k++) {
      const ang0 = (2 * Math.PI * k) / n;
      // cilj: izseki izmenično navzgor in navzdol v vrsti
      const up = k % 2 === 0;
      const tx = 30 + (k / 2) * w + (up ? 0 : w / 2), ty = up ? 230 : 230 - r * Math.cos(Math.PI / n);
      const ta = up ? -Math.PI / 2 : Math.PI / 2;
      const cx = C[0] + (tx - C[0]) * t, cy = C[1] + (ty - C[1]) * t;
      const a = ang0 + (ta - ang0) * t;
      s("path", { d: wedge(k, cx, cy, a), class: `shape ${k % 2 ? "fill-b" : "fill-a"}` }, svg);
    }
    if (t > 0.95) {
      label(svg, 30 + (n / 4) * w, 250, "≈ πr (polovica obsega)", "tick");
      label(svg, 30 + (n / 2) * w + 30, 200, "r", "lbl");
    }
    const R = r / CM;
    out.innerHTML = `<p>Krog razrežemo na ${n} izsekov in jih zložimo izmenično. Bolj ko so izseki ozki, bolj je lik podoben <b>pravokotniku</b> s stranicama πr (pol obsega) in r.</p>
      ${texBlock(`p = \\pi r\\cdot r = \\pi r^2 = \\pi\\cdot ${tfmt(R, 1)}^2 \\approx ${tfmt(Math.PI * R * R)}\\,\\mathrm{cm}^2`)}
      ${texBlock(`o = 2\\pi r \\approx ${tfmt(2 * Math.PI * R)}\\,\\mathrm{cm}`)}
      <p class="muted">π ≈ 3,14 je razmerje med obsegom in premerom: vsak krog je približno 3,14-krat »daljši« okoli kot čez.</p>`;
  };
  layout(el, {
    stage: [svg],
    controls: [
      slider({ label: "število izsekov", min: 4, max: 40, step: 2, value: n, onInput: (v) => ((n = v), draw()) }),
      slider({ label: "zloži", min: 0, max: 1, step: 0.02, value: t, onInput: (v) => ((t = v), draw()), format: (v) => `${Math.round(v * 100)} %` }),
      slider({ label: "polmer", min: 30, max: 75, value: r, format: (v) => `${fmt(v / CM, 1)} cm`, onInput: (v) => ((r = v), draw()) }),
    ],
    out,
    tryText: "Zloži krog s 4 izseki in nato s 40. Kdaj je lik bolj podoben pravokotniku?",
  });
  draw();
}

// ------------------------------------------------------------ krožni lok in izsek
export function izsek(el) {
  const svg = svgBox(340, 260);
  const out = readout();
  let al = 120, r = 4;
  const draw = () => {
    svg.replaceChildren();
    const C = [170, 130], R = r * 12; // polmer v merilu: 12 px na cm
    s("circle", { cx: C[0], cy: C[1], r: R, class: "circle-fill" }, svg);
    const p = (a) => [C[0] + R * Math.cos(-rad(a)), C[1] + R * Math.sin(-rad(a))];
    s("path", { d: `M${C[0]},${C[1]} L${p(0).join(",")} A${R},${R} 0 ${al > 180 ? 1 : 0} 0 ${p(al).join(",")} Z`, class: "shape fill-a" }, svg);
    s("path", { d: `M${p(0).join(",")} A${R},${R} 0 ${al > 180 ? 1 : 0} 0 ${p(al).join(",")}`, class: "arc-thick" }, svg);
    const ra = Math.min(26, R * 0.45);
    s("path", { d: `M${C[0]},${C[1]} L${C[0] + ra},${C[1]} A${ra},${ra} 0 ${al > 180 ? 1 : 0} 0 ${C[0] + ra * Math.cos(-rad(al))},${C[1] + ra * Math.sin(-rad(al))}`, class: "right-angle" }, svg);
    label(svg, C[0] + (R + 16) * Math.cos(-rad(al / 2)), C[1] + (R + 16) * Math.sin(-rad(al / 2)), `${al}°`, "lbl small");
    const l = (2 * Math.PI * r * al) / 360, A = (Math.PI * r * r * al) / 360;
    out.innerHTML = `<p>Izsek je <b>${al}/360</b> celega kroga${360 % al === 0 ? ` (1/${360 / al})` : ""}. Zato je tudi lok tolikšen del obsega in izsek tolikšen del ploščine.</p>
      ${texBlock(`l = 2\\pi r\\cdot\\frac{\\alpha}{360^\\circ} = 2\\pi\\cdot ${r}\\cdot\\frac{${al}}{360} \\approx ${tfmt(l)}\\,\\mathrm{cm}`)}
      ${texBlock(`p_i = \\pi r^2\\cdot\\frac{\\alpha}{360^\\circ} \\approx ${tfmt(A)}\\,\\mathrm{cm}^2`)}`;
  };
  layout(el, {
    stage: [svg],
    controls: [slider({ label: "središčni kot", min: 5, max: 360, step: 5, value: al, unit: "°", onInput: (v) => ((al = v), draw()) }), slider({ label: "polmer", min: 1, max: 10, value: r, unit: "cm", onInput: (v) => ((r = v), draw()) })],
    out,
    tryText: "Koliko je ploščina izseka s kotom 90°, če je ploščina kroga 50 cm²? Preveri.",
  });
  draw();
}

// ------------------------------------------------------------ mnogokotniki
export function veckotnik(el) {
  const svg = svgBox(340, 300);
  const out = readout();
  let n = 6, tri = true, diags = false;
  const draw = () => {
    svg.replaceChildren();
    const C = [170, 150], R = 120;
    const P = Array.from({ length: n }, (_, i) => [C[0] + R * Math.cos(-Math.PI / 2 + (2 * Math.PI * i) / n), C[1] + R * Math.sin(-Math.PI / 2 + (2 * Math.PI * i) / n)]);
    if (tri) for (let i = 1; i < n - 1; i++) s("polygon", { points: polyStr([P[0], P[i], P[i + 1]]), class: `shape fill-${"abc"[i % 3]}` }, svg);
    else s("polygon", { points: polyStr(P), class: "shape fill-soft" }, svg);
    if (diags) for (let i = 0; i < n; i++) for (let j = i + 2; j < n; j++) if (!(i === 0 && j === n - 1)) s("line", { x1: P[i][0], y1: P[i][1], x2: P[j][0], y2: P[j][1], class: "guide solid thin" }, svg);
    s("polygon", { points: polyStr(P), class: "perim" }, svg);
    const sum = (n - 2) * 180;
    out.innerHTML = `<p>Iz enega oglišča lahko n-kotnik razrežemo na <b>n − 2 = ${n - 2}</b> trikotnikov. Vsak ima vsoto kotov 180°, zato je vsota notranjih kotov:</p>
      ${texBlock(`(n - 2)\\cdot 180^\\circ = ${n - 2}\\cdot 180^\\circ = ${sum}^\\circ`)}
      <p>V pravilnem ${n}-kotniku je vsak notranji kot ${fmt(sum / n, 2)}°, zunanji kot ${fmt(360 / n, 2)}°. Število diagonal: ${tex(`\\frac{n(n-3)}{2} = ${(n * (n - 3)) / 2}`)}.</p>`;
  };
  layout(el, {
    stage: [svg],
    controls: [
      slider({ label: "število oglišč", min: 3, max: 12, value: n, onInput: (v) => ((n = v), draw()) }),
      toggle("razreži na trikotnike", tri, (v) => ((tri = v), draw())),
      toggle("pokaži vse diagonale", diags, (v) => ((diags = v), draw())),
    ],
    out,
    tryText: "Iz katerih pravilnih mnogokotnikov lahko tlakuješ ravnino brez lukenj? Notranji kot mora deliti 360°.",
  });
  draw();
}

// ------------------------------------------------------------ koordinatni sistem
const DEPENDENCIES = [
  ["Cena jabolk", "masa (kg)", "cena (€)", [[0, 0], [1, 2], [2, 4], [3, 6], [4, 8], [5, 10]]],
  ["Temperatura čez dan", "ura", "°C", [[0, 3], [1, 2], [2, 3], [3, 5], [4, 8], [5, 9], [6, 7]]],
  ["Voda v posodi se izliva", "minute", "litri", [[0, 10], [1, 8], [2, 6], [3, 4], [4, 2], [5, 0]]],
];
export function koordinate(el) {
  const svg = svgBox(340, 340);
  const out = readout();
  let mode = "tocka", P = [3, 2], target = [rint(-6, 6), rint(-6, 6)], dep = 0, score = 0;
  const draw = () => {
    svg.replaceChildren();
    if (mode === "odvisnost") {
      const [name, xl, yl, data] = DEPENDENCIES[dep];
      const A = axes(svg, { W: 340, H: 340, x: [0, 7], y: [0, 11], xStep: 1, yStep: 1, xLabel: xl, yLabel: yl });
      s("polyline", { points: data.map(([x, y]) => `${A.X(x)},${A.Y(y)}`).join(" "), class: "graph-line thin-line" }, svg);
      data.forEach(([x, y]) => s("circle", { cx: A.X(x), cy: A.Y(y), r: 6, class: "pt fill-a" }, svg));
      out.innerHTML = `<p><b>${name}</b>: vsak par (${xl}, ${yl}) je točka v koordinatnem sistemu.</p>
        <table class="demo-table"><tr><th>${xl}</th>${data.map((d) => `<td>${d[0]}</td>`).join("")}</tr><tr><th>${yl}</th>${data.map((d) => `<td>${d[1]}</td>`).join("")}</tr></table>
        <p class="muted">${dep === 0 ? "Točke ležijo na premici skozi izhodišče: količini sta premo sorazmerni." : dep === 1 ? "Točke ne ležijo na premici: temperatura se spreminja različno hitro." : "Količina enakomerno pada: točke ležijo na padajoči premici."}</p>`;
      return;
    }
    const A = axes(svg, { W: 340, H: 340, x: [-7, 7], y: [-7, 7], xStep: 1, yStep: 1 });
    const hnd = handle(svg, "a");
    hnd.move(A.X(P[0]), A.Y(P[1]));
    draggable(svg, hnd, (x, y) => {
      const [u, v] = A.inv(x, y);
      P = [clamp(Math.round(u), -7, 7), clamp(Math.round(v), -7, 7)];
      draw();
    });
    s("line", { x1: A.X(P[0]), y1: A.Y(0), x2: A.X(P[0]), y2: A.Y(P[1]), class: "guide" }, svg.firstChild ? svg : svg);
    s("line", { x1: A.X(0), y1: A.Y(P[1]), x2: A.X(P[0]), y2: A.Y(P[1]), class: "guide" }, svg);
    svg.append(hnd);
    const q = P[0] === 0 || P[1] === 0 ? "na koordinatni osi" : P[0] > 0 ? (P[1] > 0 ? "v 1. kvadrantu" : "v 4. kvadrantu") : P[1] > 0 ? "v 2. kvadrantu" : "v 3. kvadrantu";
    if (mode === "igra") {
      const hit = P[0] === target[0] && P[1] === target[1];
      out.innerHTML = `<p>Postavi točko na <b>T(${fmt(target[0])}, ${fmt(target[1])})</b>. ${hit ? '<span class="fb ok">Zadel si!</span>' : `Tvoja točka je na (${fmt(P[0])}, ${fmt(P[1])}).`}</p><p>Zadetki: ${score}</p>`;
      if (hit) setTimeout(() => { score++; target = [rint(-6, 6), rint(-6, 6)]; draw(); }, 900);
    } else
      out.innerHTML = `<div class="demo-eq">P(${fmt(P[0])}, ${fmt(P[1])})</div><p>Najprej preberemo <b>x</b> (abscisa, vodoravno), nato <b>y</b> (ordinata, navpično). Točka je ${q}.</p>`;
  };
  layout(el, {
    stage: [h("div", { class: "demo-seg-wrap" }, segmented({ options: [["tocka", "Točka"], ["igra", "Zadeni točko"], ["odvisnost", "Odvisnost količin"]], value: mode, onChange: (v) => ((mode = v), draw()) })), svg],
    controls: [select({ label: "primer odvisnosti", options: DEPENDENCIES.map((d, i) => [i, d[0]]), value: 0, onChange: (v) => ((dep = Number(v)), (mode = "odvisnost"), draw()) })],
    out,
    tryText: "Kje ležijo vse točke z y = 0? Kje vse z x = y?",
  });
  draw();
}

// ------------------------------------------------------------ premica skozi dve točki
export function dveTocki(el) {
  const svg = svgBox(340, 340);
  const out = readout();
  let A0 = [-3, -1], B0 = [3, 2], extra = "nic";
  const draw = () => {
    svg.replaceChildren();
    const Ax = axes(svg, { W: 340, H: 340, x: [-7, 7], y: [-7, 7], xStep: 1, yStep: 1 });
    const [x1, y1] = A0, [x2, y2] = B0;
    let html;
    if (x1 === x2) {
      s("line", { x1: Ax.X(x1), y1: 0, x2: Ax.X(x1), y2: 340, class: "graph-line" }, svg);
      html = `<p>Navpična premica ${tex(`x = ${x1}`)}: smerni koeficient ne obstaja.</p>`;
    } else {
      const k = (y2 - y1) / (x2 - x1), n = y1 - k * x1;
      s("line", { x1: Ax.X(-8), y1: Ax.Y(-8 * k + n), x2: Ax.X(8), y2: Ax.Y(8 * k + n), class: "graph-line" }, svg);
      s("path", { d: `M${Ax.X(x1)},${Ax.Y(y1)} H${Ax.X(x2)} V${Ax.Y(y2)}`, class: "slope-tri" }, svg);
      label(svg, (Ax.X(x1) + Ax.X(x2)) / 2, Ax.Y(y1) + (y2 > y1 ? 12 : -12), `Δx = ${x2 - x1}`, "slope-label");
      label(svg, Ax.X(x2) + 26, (Ax.Y(y1) + Ax.Y(y2)) / 2, `Δy = ${y2 - y1}`, "slope-label");
      if (extra !== "nic") {
        const C = [0, 3];
        const k2 = extra === "vzp" ? k : k === 0 ? null : -1 / k;
        if (k2 === null) s("line", { x1: Ax.X(0), y1: 0, x2: Ax.X(0), y2: 340, class: "graph-line stroke-b" }, svg);
        else s("line", { x1: Ax.X(-8), y1: Ax.Y(-8 * k2 + 3), x2: Ax.X(8), y2: Ax.Y(8 * k2 + 3), class: "graph-line stroke-b" }, svg);
        s("circle", { cx: Ax.X(C[0]), cy: Ax.Y(C[1]), r: 5, class: "pt fill-b" }, svg);
        label(svg, Ax.X(0) + 12, Ax.Y(3) - 10, "C", "pt-lbl");
      }
      const kk = Number.isInteger(k) ? `${k}` : `\\frac{${y2 - y1}}{${x2 - x1}}`;
      html = texBlock(`k = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{${y2} - (${y1})}{${x2} - (${x1})} = ${kk}${Number.isInteger(k) ? "" : ` \\approx ${tfmt(k)}`}`) +
        `<p>Enačba: ${tex(`y = ${tfmt(k)}x ${n < 0 ? "-" : "+"} ${tfmt(Math.abs(n))}`)}. Iz točke A gremo za Δx v desno in Δy gor.</p>` +
        (extra === "vzp" ? `<p><span class="dot dot-b"></span> Vzporednica skozi C ima <b>enak</b> k = ${fmt(k)}.</p>` : extra === "pra" ? `<p><span class="dot dot-b"></span> Pravokotnica skozi C ima k₂ = −1/k${k ? ` = ${fmt(-1 / k)}` : " (navpična)"}: k · k₂ = −1.</p>` : "");
    }
    [["A", A0, "a"], ["B", B0, "c"]].forEach(([nm, P, col]) => {
      const hnd = handle(svg, col);
      label(hnd, 0, -16, nm, "pt-lbl");
      hnd.move(Ax.X(P[0]), Ax.Y(P[1]));
      draggable(svg, hnd, (x, y) => {
        const [u, v] = Ax.inv(x, y);
        P[0] = clamp(Math.round(u), -7, 7);
        P[1] = clamp(Math.round(v), -7, 7);
        if (A0[0] === B0[0] && A0[1] === B0[1]) P[0] += P[0] < 7 ? 1 : -1;
        draw();
      });
    });
    out.innerHTML = html;
  };
  layout(el, {
    stage: [svg],
    controls: [segmented({ options: [["nic", "Samo premica"], ["vzp", "Vzporednica"], ["pra", "Pravokotnica"]], value: extra, onChange: (v) => ((extra = v), draw()) })],
    out,
    tryText: "Povleci točki tako, da je k = 2. Nato tako, da je k = −1/2. Kakšen kot oklepata ti dve premici?",
  });
  draw();
}

// ------------------------------------------------------------ podobni trikotniki (središčni razteg)
export function podobnost(el) {
  const svg = svgBox(340, 300);
  const out = readout();
  const pts = { A: [120, 200], B: [180, 210], C: [150, 150] };
  const O = [60, 250];
  let k = 2;
  const lay = s("g", {}, svg), top = s("g", {}, svg);
  const draw = () => {
    lay.replaceChildren();
    const P = ["A", "B", "C"].map((x) => pts[x]);
    const Q = P.map((p) => [O[0] + k * (p[0] - O[0]), O[1] + k * (p[1] - O[1])]);
    P.forEach((p, i) => s("line", { x1: O[0], y1: O[1], x2: Q[i][0], y2: Q[i][1], class: "guide" }, lay));
    s("polygon", { points: polyStr(Q), class: "shape fill-b" }, lay);
    s("polygon", { points: polyStr(P), class: "shape fill-a" }, lay);
    Q.forEach((q, i) => label(lay, q[0] + 10, q[1] - 10, "ABC"[i] + "'", "pt-lbl"));
    s("circle", { cx: O[0], cy: O[1], r: 4, class: "pt fill-text" }, lay);
    label(lay, O[0] - 10, O[1] + 12, "O", "pt-lbl");
    const a = dist(P[1], P[2]), a2 = dist(Q[1], Q[2]);
    const ar = (T) => Math.abs((T[1][0] - T[0][0]) * (T[2][1] - T[0][1]) - (T[2][0] - T[0][0]) * (T[1][1] - T[0][1])) / 2;
    out.innerHTML = `<p>Raztezni faktor <b>k = ${fmt(k, 2)}</b>: vsaka stranica slike je ${fmt(Math.abs(k), 2)}-krat ${Math.abs(k) >= 1 ? "daljša" : "krajša"}. Koti ostanejo enaki, zato sta trikotnika <b>podobna</b>.</p>
      <p>|B'C'| : |BC| = ${fmt(a2 / CM, 2)} : ${fmt(a / CM, 2)} = ${fmt(a2 / a, 2)}.</p>
      <p>Ploščini: ${fmt(ar(Q) / CM / CM, 2)} : ${fmt(ar(P) / CM / CM, 2)} = <b>${fmt(ar(Q) / ar(P), 2)} = k²</b>.</p>
      <p class="muted">${k < 0 ? "Negativni k: slika je na drugi strani O, zasukana za 180°." : ""} Pri k = 1 je slika skladna z likom.</p>`;
    place();
  };
  const place = dragPoints(svg, top, pts, draw);
  layout(el, { stage: [svg], controls: [slider({ label: "k", min: -1.5, max: 2.5, step: 0.1, value: k, onInput: (v) => ((k = v), draw()) })], out, tryText: "Kolikokrat se poveča ploščina, če stranice podvojiš? Kaj pa, če jih potrojiš?" });
  draw();
}

// ------------------------------------------------------------ Talesov izrek o sorazmerjih
export function tales(el) {
  const svg = svgBox(340, 280);
  const out = readout();
  let ang = 35, t1 = 0.4, t2 = 0.85, tilt = 75;
  const draw = () => {
    svg.replaceChildren();
    const S = [25, 250], L = 300;
    const r1 = [Math.cos(0), 0], r2 = [Math.cos(rad(ang)), -Math.sin(rad(ang))];
    s("line", { x1: S[0], y1: S[1], x2: S[0] + L, y2: S[1], class: "ray-line" }, svg);
    s("line", { x1: S[0], y1: S[1], x2: S[0] + L * r2[0], y2: S[1] + L * r2[1], class: "ray-line" }, svg);
    // vzporednici s smerjo d (nagib)
    const d = [Math.cos(rad(tilt)), -Math.sin(rad(tilt))];
    const pt = (t) => {
      const A = [S[0] + L * t, S[1]];
      // presek A + s d z drugim krakom S + u r2
      const den = d[0] * r2[1] - d[1] * r2[0];
      const u = ((A[0] - S[0]) * d[1] - (A[1] - S[1]) * d[0]) / -den;
      return [A, [S[0] + u * r2[0], S[1] + u * r2[1]]];
    };
    const [A, B] = pt(t1), [C, D] = pt(t2);
    [[A, B, "a"], [C, D, "b"]].forEach(([P, Q, col]) => s("line", { x1: P[0], y1: P[1], x2: Q[0], y2: Q[1], class: `graph-line stroke-${col}` }, svg));
    [["S", S], ["A", A], ["C", C], ["B", B], ["D", D]].forEach(([n, P]) => { s("circle", { cx: P[0], cy: P[1], r: 4, class: "pt fill-text" }, svg); label(svg, P[0] + (n === "A" || n === "C" ? 0 : -10), P[1] + (n === "A" || n === "C" || n === "S" ? 14 : -10), n, "pt-lbl"); });
    const sa = dist(S, A) / CM, sc = dist(S, C) / CM, sb = dist(S, B) / CM, sd = dist(S, D) / CM, ab = dist(A, B) / CM, cd = dist(C, D) / CM;
    const F = (x) => fmt(x, 2);
    out.innerHTML = `<p>|SA| = ${F(sa)}, |SC| = ${F(sc)}, |SB| = ${F(sb)}, |SD| = ${F(sd)}, |AB| = ${F(ab)}, |CD| = ${F(cd)} (cm).</p>
      ${texBlock(`\\frac{SA}{SC} = ${tfmt(sa / sc, 3)},\\quad \\frac{SB}{SD} = ${tfmt(sb / sd, 3)},\\quad \\frac{AB}{CD} = ${tfmt(ab / cd, 3)}`)}
      <p>Ker sta AB in CD vzporedni, so vsa tri razmerja enaka: <b>vzporednici odrežeta na krakih sorazmerne odseke</b>. Spremeni kot, nagib ali položaj vzporednic: enakost ostane.</p>
      <p class="muted">Tudi SA : AC = SB : BD = ${tfmt(sa / (sc - sa), 3).replace("{,}", ",")}.</p>`;
  };
  layout(el, {
    stage: [svg],
    controls: [
      slider({ label: "kot pri S", min: 15, max: 70, value: ang, unit: "°", onInput: (v) => ((ang = v), draw()) }),
      slider({ label: "nagib vzporednic", min: 40, max: 140, value: tilt, unit: "°", onInput: (v) => ((tilt = v), draw()) }),
      slider({ label: "prva vzporednica", min: 0.15, max: 0.8, step: 0.01, value: t1, onInput: (v) => ((t1 = Math.min(v, t2 - 0.05)), draw()), format: (v) => fmt(v, 2) }),
      slider({ label: "druga vzporednica", min: 0.3, max: 0.95, step: 0.01, value: t2, onInput: (v) => ((t2 = Math.max(v, t1 + 0.05)), draw()), format: (v) => fmt(v, 2) }),
    ],
    out,
    tryText: "Kako bi s Talesovim izrekom izmeril višino drevesa s pomočjo njegove sence in palice?",
  });
  draw();
}

// ------------------------------------------------------------ Pitagorov izrek v uporabi
export function pitagoraUporaba(el) {
  const svg = svgBox(340, 280);
  const out = readout();
  let mode = "lestev", L = 5, d = 1.5, a = 6, b = 4, c = 3;
  const ctl = h("div", { class: "demo-controls" });
  const build = () => {
    ctl.replaceChildren(
      ...(mode === "lestev"
        ? [slider({ label: "dolžina lestve", min: 2, max: 8, step: 0.1, value: L, unit: "m", onInput: (v) => ((L = v), (d = Math.min(d, L - 0.1)), draw()) }), slider({ label: "razdalja od stene", min: 0.2, max: 7.5, step: 0.1, value: d, unit: "m", onInput: (v) => ((d = Math.min(v, L - 0.1)), draw()) })]
        : [slider({ label: "a", min: 1, max: 8, value: a, unit: "cm", onInput: (v) => ((a = v), draw()) }), slider({ label: "b", min: 1, max: 6, value: b, unit: "cm", onInput: (v) => ((b = v), draw()) }), ...(mode === "kvader" ? [slider({ label: "c", min: 1, max: 6, value: c, unit: "cm", onInput: (v) => ((c = v), draw()) })] : [])]),
    );
    draw();
  };
  const draw = () => {
    svg.replaceChildren();
    if (mode === "lestev") {
      const sc = 30, base = [40, 260];
      const hh = Math.sqrt(L * L - d * d);
      s("line", { x1: base[0], y1: base[1], x2: 330, y2: base[1], class: "ground" }, svg);
      s("rect", { x: base[0] - 16, y: 10, width: 16, height: 250, class: "wall" }, svg);
      const top = [base[0], base[1] - hh * sc], foot = [base[0] + d * sc, base[1]];
      s("line", { x1: top[0], y1: top[1], x2: foot[0], y2: foot[1], class: "ladder" }, svg);
      s("path", { d: arcPath(base, [base[0] + 10, base[1]], [base[0], base[1] - 10], 14), class: "right-angle" }, svg);
      label(svg, base[0] + (d * sc) / 2, base[1] + 12, `${fmt(d, 1)} m`, "lbl small");
      label(svg, base[0] + 22, base[1] - (hh * sc) / 2, `h = ${fmt(hh, 2)} m`, "lbl small", "start");
      const ang = deg(Math.atan2(hh, d));
      out.innerHTML = texBlock(`h = \\sqrt{L^2 - d^2} = \\sqrt{${tfmt(L, 1)}^2 - ${tfmt(d, 1)}^2} = ${tfmt(hh)}\\,\\mathrm{m}`) +
        `<p>Lestev, stena in tla tvorijo pravokotni trikotnik; lestev je hipotenuza. Kot ob tleh je ${fmt(ang, 0)}°${ang < 65 ? " (prenizko, lestev bi lahko zdrsnila)" : ang > 80 ? " (prestrmo, lestev bi se lahko prevrnila)" : " (varno: priporočeno okoli 75°)"}.</p>`;
    } else if (mode === "pravokotnik") {
      const sc = 30, ox = 30, oy = 240;
      s("rect", { x: ox, y: oy - b * sc, width: a * sc, height: b * sc, class: "shape fill-soft" }, svg);
      s("line", { x1: ox, y1: oy, x2: ox + a * sc, y2: oy - b * sc, class: "graph-line stroke-a" }, svg);
      const dd = Math.hypot(a, b);
      out.innerHTML = texBlock(`d = \\sqrt{a^2 + b^2} = \\sqrt{${a}^2 + ${b}^2} = ${tfmt(dd)}\\,\\mathrm{cm}`) + `<p>Diagonala razdeli pravokotnik na dva pravokotna trikotnika; diagonala je hipotenuza.</p>`;
    } else {
      // kvader v poševni projekciji
      const sc = 26, ox = 50, oy = 250, k = 0.5, dx = c * sc * k * Math.cos(rad(40)), dy = c * sc * k * Math.sin(rad(40)) * 2;
      const P = (x, y, z) => [ox + x * sc + z * (dx / c), oy - y * sc - z * (dy / c)];
      const E = [[0, 0, 0], [a, 0, 0], [a, b, 0], [0, b, 0], [0, 0, c], [a, 0, c], [a, b, c], [0, b, c]].map((p) => P(...p));
      [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]].forEach(([i, j]) => s("line", { x1: E[i][0], y1: E[i][1], x2: E[j][0], y2: E[j][1], class: i === 0 && j === 4 || i === 3 && j === 0 || i === 7 && j === 4 ? "edge hidden" : "edge" }, svg));
      s("line", { x1: E[0][0], y1: E[0][1], x2: E[5][0], y2: E[5][1], class: "graph-line stroke-b" }, svg);
      s("line", { x1: E[0][0], y1: E[0][1], x2: E[6][0], y2: E[6][1], class: "graph-line stroke-a" }, svg);
      const ds = Math.hypot(a, c), D = Math.hypot(a, b, c);
      out.innerHTML = texBlock(`d_\\text{osn} = \\sqrt{a^2 + c^2} = ${tfmt(ds)},\\quad D = \\sqrt{d_\\text{osn}^2 + b^2} = \\sqrt{a^2 + b^2 + c^2} = ${tfmt(D)}\\,\\mathrm{cm}`) +
        `<p>Telesno diagonalo <span class="dot dot-a"></span> izračunamo v dveh korakih: najprej <span class="dot dot-b"></span> diagonalo osnovne ploskve, nato še enkrat Pitagorov izrek z višino.</p>`;
    }
  };
  layout(el, {
    stage: [h("div", { class: "demo-seg-wrap" }, segmented({ options: [["lestev", "Lestev"], ["pravokotnik", "Diagonala pravokotnika"], ["kvader", "Diagonala kvadra"]], value: mode, onChange: (v) => ((mode = v), build()) })), svg],
    controls: ctl,
    out,
    tryText: "Lestev je dolga 5 m. Kako daleč od stene jo postaviš, da seže 4 m visoko?",
  });
  build();
}

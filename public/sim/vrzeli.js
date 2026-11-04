// Simulacije za teme, dodane po primerjavi z učnimi načrti (2026-10-30): pravilnostne tabele, lega
// premic in ravnin v kocki, koordinatni sistem, vezava vzmeti, izmenični tok in nihajni krog,
// elektromagnetni spekter in zvezde (HR-diagram). Merila: docs/kakovost.md §3.
import { h, s, svgBox, slider, select, segmented, readout, layout, tex, texBlock, fmt, tfmt, clamp, label, axes, fnPath, arrow, animate, playButton, draggable, handle, buttons, button } from "./kit.js";
import { G, springPath, force } from "./fiz-skupno.js";

const T = (x, d = 2) => tfmt(x, d);
// Napis z indeksom v SVG: subLbl(svg, x, y, "U", "ef", " = 230 V") → U_ef = 230 V.
function subLbl(p, x, y, a, b, rest, cls, anchor = "middle") {
  const t = label(p, x, y, a, cls, anchor);
  s("tspan", { "baseline-shift": "sub", "font-size": "75%" }, t, b);
  if (rest) s("tspan", {}, t, rest);
  return t;
}
// Potenca števila 10 z eksponentom v zgornjem indeksu: pot10(-3) → "10⁻³".
const pot10 = (e) => "10" + String(e).replace("-", "⁻").replace(/\d/g, (c) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[c]);
// Število v znanstvenem zapisu za TeX: sci(3e8) → "3{,}00 \cdot 10^{8}".
function sci(x, d = 2) {
  if (x === 0) return "0";
  let e = Math.floor(Math.log10(Math.abs(x)));
  let m = Math.round((x / 10 ** e) * 10 ** d) / 10 ** d;
  if (Math.abs(m) >= 10) (m /= 10), e++;
  return e === 0 ? T(m, d) : `${T(m, d)} \\cdot 10^{${e}}`;
}

// ------------------------------------------------------------ pravilnostne tabele
const IZJAVE = [
  ["neA", "¬A", "\\neg A", (a) => !a],
  ["in", "A ∧ B", "A \\wedge B", (a, b) => a && b],
  ["ali", "A ∨ B", "A \\vee B", (a, b) => a || b],
  ["imp", "A ⇒ B", "A \\Rightarrow B", (a, b) => !a || b],
  ["ekv", "A ⇔ B", "A \\Leftrightarrow B", (a, b) => a === b],
  ["obrat", "B ⇒ A", "B \\Rightarrow A", (a, b) => !b || a],
  ["kontra", "¬B ⇒ ¬A", "\\neg B \\Rightarrow \\neg A", (a, b) => b || !a],
  ["neAaliB", "¬A ∨ B", "\\neg A \\vee B", (a, b) => !a || b],
  ["negIn", "¬(A ∧ B)", "\\neg (A \\wedge B)", (a, b) => !(a && b)],
  ["dm1", "¬A ∨ ¬B", "\\neg A \\vee \\neg B", (a, b) => !a || !b],
  ["negAli", "¬(A ∨ B)", "\\neg (A \\vee B)", (a, b) => !(a || b)],
  ["dm2", "¬A ∧ ¬B", "\\neg A \\wedge \\neg B", (a, b) => !a && !b],
  ["izkl", "A ∨ ¬A", "A \\vee \\neg A", () => true],
  ["prot", "A ∧ ¬A", "A \\wedge \\neg A", () => false],
  ["mp", "((A ⇒ B) ∧ A) ⇒ B", "((A \\Rightarrow B) \\wedge A) \\Rightarrow B", (a, b) => !((!a || b) && a) || b],
];
const PN = (v) => (v ? "P" : "N");

export function logika(el) {
  const out = readout();
  const box = h("div", { class: "logika-tab" });
  let a = true, b = false, i1 = "imp", i2 = "kontra";
  const ROWS = [[true, true], [true, false], [false, true], [false, false]];
  const get = (k) => IZJAVE.find((x) => x[0] === k);
  const segA = segmented({ options: [["P", "A pravilna"], ["N", "A nepravilna"]], value: "P", onChange: (v) => ((a = v === "P"), draw()) });
  const segB = segmented({ options: [["P", "B pravilna"], ["N", "B nepravilna"]], value: "N", onChange: (v) => ((b = v === "P"), draw()) });
  segA.setAttribute("aria-label", "Vrednost izjave A");
  segB.setAttribute("aria-label", "Vrednost izjave B");
  const draw = () => {
    const [, n1, t1, f1] = get(i1), [, n2, t2, f2] = get(i2);
    const cell = (v) => `<td style="text-align:center"><b style="color:var(${v ? "--ok" : "--danger"})">${PN(v)}</b></td>`;
    const rows = ROWS.map(([x, y]) => {
      const on = x === a && y === b;
      return `<tr data-a="${x}" data-b="${y}" tabindex="0" role="button" aria-label="Vrstica A = ${PN(x)}, B = ${PN(y)}" style="cursor:pointer${on ? ";background:var(--surface-2);outline:2px solid var(--accent)" : ""}">${cell(x)}${cell(y)}${cell(f1(x, y))}${cell(f2(x, y))}</tr>`;
    }).join("");
    box.innerHTML = `<table class="demo-table"><tr><th style="text-align:center">A</th><th style="text-align:center">B</th><th style="text-align:center">${tex(t1)}</th><th style="text-align:center">${tex(t2)}</th></tr>${rows}</table>`;
    const col1 = ROWS.map(([x, y]) => f1(x, y)), col2 = ROWS.map(([x, y]) => f2(x, y));
    const kind = (col) => (col.every(Boolean) ? "<b>tavtologija</b> (pravilna v vseh vrsticah)" : col.every((v) => !v) ? "<b>protislovje</b> (nepravilna v vseh vrsticah)" : "ni ne tavtologija ne protislovje");
    const diff = ROWS.filter((_, k) => col1[k] !== col2[k]);
    out.innerHTML = `<p>V izbrani vrstici (A = ${PN(a)}, B = ${PN(b)}) je ${tex(t1)} <b>${PN(f1(a, b))}</b>, ${tex(t2)} pa <b>${PN(f2(a, b))}</b>.</p>
      <p>${n1}: ${kind(col1)}. ${n2}: ${kind(col2)}.</p>
      <p>${diff.length ? `Izjavi <b>nista enakovredni</b>: razlikujeta se v ${diff.length === 1 ? "vrstici" : "vrsticah"} ${diff.map(([x, y]) => `A = ${PN(x)}, B = ${PN(y)}`).join("; ")}.` : `Izjavi sta <b>enakovredni</b>: stolpca se ujemata v vseh štirih vrsticah, ${tex(`${t1} \\equiv ${t2}`)}.`}</p>
      <p class="muted">P = pravilna, N = nepravilna. Implikacija A ⇒ B je nepravilna le, ko je A pravilna in B nepravilna. Klikni vrstico ali izberi vrednosti A in B.</p>`;
  };
  const pickRow = (tr) => {
    a = tr.dataset.a === "true";
    b = tr.dataset.b === "true";
    segA.set(PN(a), true);
    segB.set(PN(b), true);
    draw();
  };
  box.addEventListener("click", (e) => { const tr = e.target.closest("tr[data-a]"); if (tr) pickRow(tr); });
  box.addEventListener("keydown", (e) => {
    const tr = e.target.closest("tr[data-a]");
    if (tr && (e.key === "Enter" || e.key === " ")) e.preventDefault(), pickRow(tr), box.querySelector(`tr[data-a="${a}"][data-b="${b}"]`)?.focus();
  });
  const opts = IZJAVE.map(([k, n]) => [k, n]);
  layout(el, {
    stage: [box],
    controls: [
      select({ label: "izjava 1", options: opts, value: i1, onChange: (v) => ((i1 = v), draw()) }),
      select({ label: "izjava 2", options: opts, value: i2, onChange: (v) => ((i2 = v), draw()) }),
      segA,
      segB,
    ],
    out,
    tryText: "Primerjaj A ⇒ B z obratom B ⇒ A in s kontrapozicijo ¬B ⇒ ¬A. Katera je enakovredna implikaciji? Poišči še izjavo, ki je tavtologija.",
  });
  draw();
}

// ------------------------------------------------------------ točke, premice in ravnine v kocki
const V3 = { A: [0, 0, 0], B: [1, 0, 0], C: [1, 1, 0], D: [0, 1, 0], E: [0, 0, 1], F: [1, 0, 1], G: [1, 1, 1], H: [0, 1, 1] };
const EDGES = ["AB", "BC", "CD", "DA", "EF", "FG", "GH", "HE", "AE", "BF", "CG", "DH"];
const PREMICE = [...EDGES, "AC", "BD", "EG", "FH", "AF", "BE", "BG", "CF", "AH", "DE", "AG", "BH", "CE", "DF"];
const RAVNINE = [["ABCD", "spodnja ploskev"], ["EFGH", "zgornja ploskev"], ["ABFE", "sprednja ploskev"], ["DCGH", "zadnja ploskev"], ["ADHE", "leva ploskev"], ["BCGF", "desna ploskev"], ["ACGE", "diagonalni presek"], ["BDHF", "diagonalni presek"], ["ABGH", "poševni presek"]];
const sub = (p, q) => p.map((v, i) => v - q[i]);
const add = (p, q) => p.map((v, i) => v + q[i]);
const mul = (p, k) => p.map((v) => v * k);
const dot = (p, q) => p.reduce((t, v, i) => t + v * q[i], 0);
const cross = (p, q) => [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]];
const len = (p) => Math.hypot(...p);
const near0 = (x) => Math.abs(x) < 1e-9;
const vName = (p) => Object.keys(V3).find((k) => len(sub(V3[k], p)) < 1e-9);
// Točne razdalje v kocki z robom a: koeficient pred a.
const EXACT = [[1, "a"], [Math.SQRT2, "a\\sqrt{2}"], [Math.sqrt(3), "a\\sqrt{3}"], [Math.SQRT2 / 2, "\\frac{a\\sqrt{2}}{2}"], [Math.sqrt(3) / 3, "\\frac{a\\sqrt{3}}{3}"], [0.5, "\\frac{a}{2}"], [Math.sqrt(5) / 5, "\\frac{a\\sqrt{5}}{5}"], [2 * Math.sqrt(5) / 5, "\\frac{2a\\sqrt{5}}{5}"], [Math.sqrt(6) / 3, "\\frac{a\\sqrt{6}}{3}"], [Math.sqrt(6) / 6, "\\frac{a\\sqrt{6}}{6}"]];
const exact = (k) => EXACT.find(([v]) => Math.abs(v - k) < 1e-9)?.[1];

export function prostor(el) {
  const svg = svgBox(340, 300);
  const out = readout();
  const ctl = h("div", { class: "demo-controls" });
  let mode = "premici", p1 = "AE", p2 = "BC", rav = "ABCD", tocka = "G", th = 30, a = 4;
  const PHI = (22 * Math.PI) / 180, S = 120, cx = 170, cy = 165;
  const proj = (p) => {
    const t = (th * Math.PI) / 180, x = p[0] - 0.5, y = p[1] - 0.5, z = p[2] - 0.5;
    const xr = x * Math.cos(t) - y * Math.sin(t), yr = x * Math.sin(t) + y * Math.cos(t);
    return [cx + S * xr, cy - S * (z * Math.cos(PHI) + yr * Math.sin(PHI)), yr * Math.cos(PHI) - z * Math.sin(PHI)];
  };
  const line = (n) => [V3[n[0]], V3[n[1]]];
  const plane = (n) => {
    const [P, Q, R] = [V3[n[0]], V3[n[1]], V3[n[2]]];
    return { P, n: cross(sub(Q, P), sub(R, P)) };
  };
  const seg = (p, q, cls, extra = {}) => {
    const [x1, y1] = proj(p), [x2, y2] = proj(q);
    return s("line", { x1, y1, x2, y2, class: cls, ...extra }, svg);
  };
  const ptMark = (p, cls, name) => {
    const [x, y] = proj(p);
    s("circle", { cx: x, cy: y, r: 6, class: `pt fill-${cls}`, "data-name": name }, svg);
  };
  const drawLine = (n, cls) => {
    const [P, Q] = line(n), d = sub(Q, P);
    seg(add(P, mul(d, -0.45)), add(Q, mul(d, 0.45)), `graph-line stroke-${cls} thin-line`, { "stroke-dasharray": "6 5", "data-name": `Premica ${n}` });
    seg(P, Q, `graph-line stroke-${cls}`, { "stroke-width": 4, "data-name": `Premica ${n}` });
  };
  const drawPlane = (n) => {
    const pts = n.split("").map((k) => proj(V3[k]));
    s("polygon", { points: pts.map(([x, y]) => `${x},${y}`).join(" "), class: "fill-b", opacity: 0.28, "data-name": `Ravnina ${n}` }, svg);
  };
  const draw = () => {
    svg.replaceChildren();
    const depth = Object.fromEntries(Object.entries(V3).map(([k, p]) => [k, proj(p)[2]]));
    const far = Object.keys(depth).reduce((m, k) => (depth[k] > depth[m] ? k : m), "A");
    if (mode !== "premici") drawPlane(rav);
    EDGES.forEach((e) => seg(V3[e[0]], V3[e[1]], "axis thin", e.includes(far) ? { "stroke-dasharray": "4 4", opacity: 0.6 } : {}));
    Object.entries(V3).forEach(([k, p]) => {
      const [x, y] = proj(p), [ox, oy] = proj([0.5, 0.5, 0.5]);
      const dx = x - ox, dy = y - oy, L = Math.hypot(dx, dy) || 1;
      label(svg, x + (dx / L) * 14, y + (dy / L) * 14, k, "pt-lbl");
    });
    let html;
    if (mode === "premici") {
      drawLine(p1, "a");
      drawLine(p2, "c");
      const [P1, Q1] = line(p1), [P2, Q2] = line(p2), d1 = sub(Q1, P1), d2 = sub(Q2, P2), w = sub(P2, P1);
      const c = cross(d1, d2);
      const ang = (Math.acos(clamp(Math.abs(dot(d1, d2)) / (len(d1) * len(d2)), 0, 1)) * 180) / Math.PI;
      let rel;
      if (near0(len(c))) rel = near0(len(cross(d1, w))) ? "<b>sovpadata</b> (sta ista premica)" : "sta <b>vzporedni</b>: ležita v isti ravnini in nimata skupne točke";
      else if (near0(dot(w, c))) {
        const t = dot(cross(w, d2), c) / dot(c, c), X = add(P1, mul(d1, t));
        ptMark(X, "danger", "Presečišče");
        rel = `se <b>sekata</b> v točki ${vName(X) || "na sliki (rdeča točka)"}${near0(dot(d1, d2)) ? ", in sicer <b>pravokotno</b>" : ""}`;
      } else rel = `sta <b>mimobežni</b>: ne ležita v isti ravnini, zato se ne sekata in nista vzporedni${near0(dot(d1, d2)) ? " (sta pa pravokotni mimobežnici)" : ""}`;
      html = `<p>Premici <span class="dot dot-a"></span>${p1} in <span class="dot dot-c"></span>${p2} ${rel}.</p><p>Kot med njima: <b>${fmt(ang, 1)}°</b>${near0(len(c)) ? "" : near0(dot(w, c)) ? "" : " (merimo ga med vzporednicama skozi isto točko)"}.</p>`;
    } else if (mode === "premica-ravnina") {
      drawLine(p1, "a");
      const [P1, Q1] = line(p1), d = sub(Q1, P1), { P, n } = plane(rav);
      let rel;
      if (near0(dot(d, n))) rel = near0(dot(sub(P1, P), n)) ? "<b>leži v ravnini</b>: vse njene točke so v ravnini" : "je <b>vzporedna z ravnino</b>: z njo nima skupne točke";
      else {
        const t = dot(sub(P, P1), n) / dot(d, n), X = add(P1, mul(d, t));
        ptMark(X, "danger", "Prebodišče");
        rel = `<b>prebada</b> ravnino v točki ${vName(X) || "na sliki (rdeča točka)"}${near0(len(cross(d, n))) ? ". Premica je <b>pravokotna na ravnino</b>: pravokotna je na vsako premico v ravnini" : ", ni pa pravokotna nanjo"}`;
      }
      html = `<p>Premica <span class="dot dot-a"></span>${p1} ${rel}.</p><p class="muted">Ravnina ${rav} (${RAVNINE.find((r) => r[0] === rav)[1]}) je obarvana. Premica je pravokotna na ravnino, če je pravokotna na dve nevzporedni premici v tej ravnini.</p>`;
    } else {
      const { P, n } = plane(rav), Q = V3[tocka];
      const k = Math.abs(dot(sub(Q, P), n)) / len(n), foot = sub(Q, mul(n, dot(sub(Q, P), n) / dot(n, n)));
      ptMark(Q, "a", "Točka");
      if (k > 1e-9) {
        seg(Q, foot, "graph-line stroke-danger", { "stroke-dasharray": "5 4", "data-name": "Pravokotnica" });
        ptMark(foot, "danger", "Pravokotna projekcija");
      }
      const ex = exact(k);
      html = k < 1e-9
        ? `<p>Točka ${tocka} <b>leži v ravnini</b> ${rav}, zato je njena razdalja do ravnine 0.</p>`
        : texBlock(`d(${tocka}, ${rav}) = ${ex || `${T(k, 3)}\\,a`} ${ex ? "\\approx" : "="} ${T(k * a, 2)}\\ \\text{cm}`) +
          `<p>Razdalja točke od ravnine je dolžina daljice od točke do njene <b>pravokotne projekcije</b> na ravnino (rdeča črtkana daljica je pravokotna na ravnino). Rob kocke a = ${fmt(a)} cm.</p>`;
    }
    out.innerHTML = html;
  };
  const opt = (list) => list.map((x) => (Array.isArray(x) ? [x[0], `${x[0]} (${x[1]})`] : [x, x]));
  const build = () => {
    const c = [];
    if (mode !== "razdalja") c.push(select({ label: "premica", options: opt(PREMICE), value: p1, onChange: (v) => ((p1 = v), draw()) }));
    if (mode === "premici") c.push(select({ label: "druga premica", options: opt(PREMICE), value: p2, onChange: (v) => ((p2 = v), draw()) }));
    if (mode === "razdalja") c.push(select({ label: "točka", options: Object.keys(V3), value: tocka, onChange: (v) => ((tocka = v), draw()) }));
    if (mode !== "premici") c.push(select({ label: "ravnina", options: opt(RAVNINE), value: rav, onChange: (v) => ((rav = v), draw()) }));
    if (mode === "razdalja") c.push(slider({ label: "rob a", min: 1, max: 10, value: a, unit: "cm", onInput: (v) => ((a = v), draw()) }));
    c.push(slider({ label: "zasuk kocke", min: 15, max: 75, value: th, unit: "°", onInput: (v) => ((th = v), draw()) }));
    ctl.replaceChildren(segmented({ options: [["premici", "Dve premici"], ["premica-ravnina", "Premica in ravnina"], ["razdalja", "Razdalja do ravnine"]], value: mode, onChange: (v) => ((mode = v), build(), draw()) }), ...c);
  };
  build();
  layout(el, { stage: [svg], controls: ctl, out, tryText: "Poišči premico, ki je mimobežna z AB, in premico, ki je pravokotna na ravnino ABCD. Kolikšna je razdalja točke B od ravnine ACGE?" });
  draw();
}

// ------------------------------------------------------------ pravokotni koordinatni sistem
export function koordTrikotnik(el) {
  const svg = svgBox(340, 340);
  const out = readout();
  let mode = "razdalja";
  const P = { A: [-4, -2], B: [3, 2], C: [-1, 4] };
  const draw = () => {
    svg.replaceChildren();
    const Ax = axes(svg, { W: 340, H: 340, x: [-6, 6], y: [-6, 6], xStep: 1, yStep: 1 });
    const [x1, y1] = P.A, [x2, y2] = P.B, [x3, y3] = P.C;
    const XY = (p) => [Ax.X(p[0]), Ax.Y(p[1])];
    let html;
    if (mode === "ploscina") {
      s("polygon", { points: [P.A, P.B, P.C].map((p) => XY(p).join(",")).join(" "), class: "fill-b", opacity: 0.3, "data-name": "Trikotnik" }, svg);
      const D = (x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1);
      html = texBlock(`S = \\tfrac{1}{2}\\left|(x_B - x_A)(y_C - y_A) - (x_C - x_A)(y_B - y_A)\\right|`) +
        texBlock(`S = \\tfrac{1}{2}\\left|${x2 - x1} \\cdot ${y3 - y1 < 0 ? `(${y3 - y1})` : y3 - y1} - ${x3 - x1 < 0 ? `(${x3 - x1})` : x3 - x1} \\cdot ${y2 - y1 < 0 ? `(${y2 - y1})` : y2 - y1}\\right| = \\tfrac{1}{2} \\cdot ${Math.abs(D)} = ${T(Math.abs(D) / 2, 1)}`) +
        `<p>${D === 0 ? "<b>Ploščina je 0</b>: točke A, B in C ležijo na isti premici (so kolinearne)." : `Izraz v absolutni vrednosti je ${D > 0 ? "pozitiven: oglišča si sledijo v nasprotni smeri urinega kazalca" : "negativen: oglišča si sledijo v smeri urinega kazalca"}. Absolutna vrednost poskrbi, da je ploščina pozitivna.`}</p>`;
    } else {
      s("line", { x1: Ax.X(x1), y1: Ax.Y(y1), x2: Ax.X(x2), y2: Ax.Y(y2), class: "graph-line", "data-name": "Daljica AB" }, svg);
      if (mode === "razdalja") {
        s("path", { d: `M${Ax.X(x1)},${Ax.Y(y1)} H${Ax.X(x2)} V${Ax.Y(y2)}`, class: "slope-tri", "data-name": "Pravokotni trikotnik" }, svg);
        if (x2 !== x1) label(svg, (Ax.X(x1) + Ax.X(x2)) / 2, Ax.Y(y1) + (y2 > y1 ? 12 : -12), `|Δx| = ${Math.abs(x2 - x1)}`, "slope-label");
        if (y2 !== y1) label(svg, Ax.X(x2) + (x2 >= x1 ? 30 : -30), (Ax.Y(y1) + Ax.Y(y2)) / 2, `|Δy| = ${Math.abs(y2 - y1)}`, "slope-label");
        const d2 = (x2 - x1) ** 2 + (y2 - y1) ** 2, r = Math.sqrt(d2);
        html = texBlock(`d(A, B) = \\sqrt{(x_B - x_A)^2 + (y_B - y_A)^2} = \\sqrt{${(x2 - x1) ** 2} + ${(y2 - y1) ** 2}} = \\sqrt{${d2}}${Number.isInteger(r) ? ` = ${r}` : ` \\approx ${T(r, 2)}`}`) +
          `<p>Razdalja je hipotenuza pravokotnega trikotnika s katetama |Δx| in |Δy| (Pitagorov izrek). Vrstni red točk ni pomemben, ker kvadriramo.</p>`;
      } else {
        const S = [(x1 + x2) / 2, (y1 + y2) / 2];
        s("circle", { cx: Ax.X(S[0]), cy: Ax.Y(S[1]), r: 6, class: "pt fill-danger", "data-name": "Razpolovišče" }, svg);
        label(svg, Ax.X(S[0]) + 12, Ax.Y(S[1]) + 14, "S", "pt-lbl");
        html = texBlock(`S\\left(\\frac{x_A + x_B}{2}, \\frac{y_A + y_B}{2}\\right) = S\\left(\\frac{${x1} + ${x2 < 0 ? `(${x2})` : x2}}{2}, \\frac{${y1} + ${y2 < 0 ? `(${y2})` : y2}}{2}\\right) = S(${T(S[0], 1)}, ${T(S[1], 1)})`) +
          `<p>Koordinati razpolovišča sta aritmetični sredini koordinat krajišč. Daljici AS in SB sta enako dolgi.</p>`;
      }
    }
    ["A", "B", ...(mode === "ploscina" ? ["C"] : [])].forEach((nm, i) => {
      const hd = handle(svg, ["a", "c", "b"][i]);
      const [px, py] = P[nm];
      label(hd, px >= 4 ? -8 : px <= -4 ? 8 : 0, py >= 5 ? 20 : -16, `${nm}(${px}, ${py})`, "pt-lbl", px >= 4 ? "end" : px <= -4 ? "start" : "middle");
      hd.move(...XY(P[nm]));
      draggable(svg, hd, (x, y) => {
        const [u, v] = Ax.inv(x, y);
        P[nm] = [clamp(Math.round(u), -6, 6), clamp(Math.round(v), -6, 6)];
        draw();
      }, { label: `Točka ${nm}: premikaj jo s puščicami` });
    });
    out.innerHTML = html;
  };
  layout(el, {
    stage: [svg],
    controls: [segmented({ options: [["razdalja", "Razdalja"], ["razpolovisce", "Razpolovišče"], ["ploscina", "Ploščina trikotnika"]], value: mode, onChange: (v) => ((mode = v), draw()) })],
    out,
    tryText: "Postavi A(−3, −2) in B(3, 6). Kolikšna je razdalja? Pri ploščini premakni C tako, da je ploščina 0. Kaj velja za točke?",
  });
  draw();
}

// ------------------------------------------------------------ zaporedna in vzporedna vezava vzmeti
export function vezavaVzmeti(el) {
  const svg = svgBox(340, 300);
  const out = readout();
  let mode = "zaporedno", k1 = 40, k2 = 60, m = 300;
  const sc = 3, L0 = 36, top = 18; // 3 px na cm (stalno merilo)
  const draw = () => {
    svg.replaceChildren();
    const F = (m / 1000) * G;
    s("rect", { x: 20, y: 6, width: 200, height: 10, class: "wall" }, svg);
    let x, keff, html;
    if (mode === "zaporedno") {
      const x1 = (F / k1) * 100, x2 = (F / k2) * 100;
      x = x1 + x2;
      keff = (k1 * k2) / (k1 + k2);
      const yj = top + L0 + x1 * sc, ye = yj + L0 + x2 * sc;
      s("path", { d: springPath(110, top, 110, yj, 8, 9), class: "string", fill: "none", "data-name": "Vzmet 1" }, svg);
      s("circle", { cx: 110, cy: yj, r: 4, class: "fill-text" }, svg);
      s("path", { d: springPath(110, yj, 110, ye, 8, 9), class: "string stroke-b", fill: "none", "data-name": "Vzmet 2" }, svg);
      label(svg, 128, (top + yj) / 2, `k₁`, "lbl small", "start");
      label(svg, 128, (yj + ye) / 2, `k₂`, "lbl small", "start");
      s("rect", { x: 94, y: ye, width: 32, height: 22, rx: 4, class: "fill-a" }, svg);
      label(svg, 110, ye + 11, `${m} g`, "tick small b inv");
      if (m) force(svg, 110, ye + 24, 0, Math.min(40, F * 6), "danger", "F");
      html = texBlock(`x = x_1 + x_2 = \\frac{F}{k_1} + \\frac{F}{k_2} = ${T(x1, 1)}\\ \\text{cm} + ${T(x2, 1)}\\ \\text{cm} = ${T(x, 1)}\\ \\text{cm}`) +
        texBlock(`\\frac{1}{k} = \\frac{1}{k_1} + \\frac{1}{k_2} \\Rightarrow k = \\frac{k_1 k_2}{k_1 + k_2} = ${T(keff, 1)}\\ \\text{N/m}`) +
        `<p>Pri <b>zaporedni</b> vezavi obe vzmeti napenja ista sila F, raztezka se seštejeta. Skupna vzmet je <b>mehkejša</b> od vsake posamezne.</p>`;
    } else {
      keff = k1 + k2;
      x = (F / keff) * 100;
      const ye = top + L0 * 1.6 + x * sc;
      s("path", { d: springPath(80, top, 80, ye, 10, 9), class: "string", fill: "none", "data-name": "Vzmet 1" }, svg);
      s("path", { d: springPath(140, top, 140, ye, 10, 9), class: "string stroke-b", fill: "none", "data-name": "Vzmet 2" }, svg);
      label(svg, 60, (top + ye) / 2, "k₁", "lbl small", "end");
      label(svg, 160, (top + ye) / 2, "k₂", "lbl small", "start");
      s("rect", { x: 66, y: ye, width: 88, height: 6, rx: 2, class: "beam" }, svg);
      s("rect", { x: 94, y: ye + 6, width: 32, height: 22, rx: 4, class: "fill-a" }, svg);
      label(svg, 110, ye + 17, `${m} g`, "tick small b inv");
      if (m) force(svg, 110, ye + 30, 0, Math.min(40, F * 6), "danger", "F");
      html = texBlock(`k = k_1 + k_2 = ${k1}\\ \\text{N/m} + ${k2}\\ \\text{N/m} = ${keff}\\ \\text{N/m}`) +
        texBlock(`x = \\frac{F}{k} = \\frac{${T(F, 2)}\\ \\text{N}}{${keff}\\ \\text{N/m}} = ${T(x, 1)}\\ \\text{cm}`) +
        `<p>Pri <b>vzporedni</b> vezavi se obe vzmeti raztegneta enako (prečka ostane vodoravna), sili vzmeti F₁ = k₁x in F₂ = k₂x skupaj držita utež. Skupna vzmet je <b>trša</b>.</p>`;
    }
    // ravnilo (cm)
    const r0 = mode === "zaporedno" ? top + 2 * L0 : top + L0 * 1.6;
    s("rect", { x: 238, y: r0 - 6, width: 26, height: 60 * sc + 12, class: "box" }, svg);
    for (let c = 0; c <= 60; c += 5) {
      s("line", { x1: 238, y1: r0 + c * sc, x2: 238 + (c % 10 ? 5 : 10), y2: r0 + c * sc, class: "axis thin" }, svg);
      if (c % 10 === 0) label(svg, 256, r0 + c * sc, String(c), "tick small");
    }
    label(svg, 251, r0 - 12, "cm", "tick small");
    s("line", { x1: 140, y1: r0, x2: 238, y2: r0, class: "guide" }, svg);
    const yEnd = r0 + x * sc;
    s("line", { x1: 126, y1: yEnd, x2: 238, y2: yEnd, class: "guide stroke-a" }, svg);
    if (x > 2) arrow(svg, 226, r0, 226, yEnd, "a", 2);
    out.innerHTML = texBlock(`F = m g = ${T(m / 1000, 2)}\\ \\text{kg} \\cdot 9{,}81\\ \\tfrac{\\text{N}}{\\text{kg}} = ${T(F, 2)}\\ \\text{N}`) + html +
      `<p class="muted">Raztezek celotne vezave: x = ${fmt(x, 1)} cm, skupni koeficient k = ${fmt(keff, 1)} N/m. Ravnilo kaže raztezek v centimetrih (merilo slike je stalno).</p>`;
  };
  layout(el, {
    stage: [svg],
    controls: [
      segmented({ options: [["zaporedno", "Zaporedno"], ["vzporedno", "Vzporedno"]], value: mode, onChange: (v) => ((mode = v), draw()) }),
      slider({ label: "k₁", min: 20, max: 100, step: 5, value: k1, unit: "N/m", onInput: (v) => ((k1 = v), draw()) }),
      slider({ label: "k₂", min: 20, max: 100, step: 5, value: k2, unit: "N/m", onInput: (v) => ((k2 = v), draw()) }),
      slider({ label: "masa uteži", min: 0, max: 500, step: 50, value: m, unit: "g", onInput: (v) => ((m = v), draw()) }),
    ],
    out,
    tryText: "Nastavi k₁ = k₂ = 40 N/m. Kolikšen je skupni koeficient pri zaporedni in kolikšen pri vzporedni vezavi? Napovej, preden preklopiš.",
  });
  draw();
}

// ------------------------------------------------------------ izmenični tok in nihajni krog
export function izmenicni(el, { mode = "sinus" } = {}) {
  if (mode === "lc") return nihajniKrog(el);
  const svg = svgBox(340, 220), svg2 = svgBox(340, 170);
  const out = readout();
  let U0 = 325, f = 50, R = 100;
  const draw = () => {
    svg.replaceChildren();
    svg2.replaceChildren();
    const Uef = U0 / Math.SQRT2, I0 = U0 / R, P0 = (U0 * U0) / R;
    const A = axes(svg, { W: 340, H: 220, x: [0, 40], y: [-400, 400], pad: 40, xLabel: "t [ms]", yLabel: "U [V]", xStep: 5, yStep: 100 });
    const u = (t) => U0 * Math.sin(2 * Math.PI * f * t / 1000);
    [Uef, -Uef].forEach((v, i) => s("line", { x1: A.L, y1: A.Y(v), x2: A.R, y2: A.Y(v), class: "guide stroke-c", "stroke-dasharray": "6 4", "data-name": i ? null : "Efektivna napetost" }, svg));
    subLbl(svg, A.R - 4, A.Y(Uef) - 8, "U", "ef", ` = ${fmt(Uef, 0)} V`, "tick small b", "end");
    s("path", { d: fnPath(u, A, { n: 600 }), class: "graph-line", "data-name": "Napetost U(t)" }, svg);
    const B = axes(svg2, { W: 340, H: 170, x: [0, 40], y: [0, 3200], pad: 40, xLabel: "t [ms]", yLabel: "P [W]", xStep: 5, yStep: 800 });
    s("path", { d: fnPath((t) => u(t) ** 2 / R, B, { n: 600 }), class: "graph-line stroke-a", "data-name": "Moč P(t)" }, svg2);
    s("line", { x1: B.L, y1: B.Y(P0 / 2), x2: B.R, y2: B.Y(P0 / 2), class: "guide stroke-c", "stroke-dasharray": "6 4", "data-name": "Povprečna moč" }, svg2);
    label(svg2, B.R - 4, B.T + 8, `povprečna moč (črtkano): ${fmt(P0 / 2, 0)} W`, "tick small b", "end");
    out.innerHTML = texBlock(`U(t) = U_0 \\sin(2\\pi \\nu t)`) +
      texBlock(`\\nu = ${f}\\ \\text{Hz},\\quad t_0 = \\frac{1}{\\nu} = ${T(1000 / f, 1)}\\ \\text{ms}`) +
      texBlock(`U_\\text{ef} = \\frac{U_0}{\\sqrt{2}} = \\frac{${U0}\\ \\text{V}}{\\sqrt{2}} \\approx ${T(Uef, 0)}\\ \\text{V}`) +
      texBlock(`I_\\text{ef} = \\frac{U_\\text{ef}}{R} \\approx ${T(Uef / R, 2)}\\ \\text{A}`) +
      `<p>Moč na uporniku P = U²/R niha med 0 in ${fmt(P0, 0)} W, njeno povprečje je polovica največje: <span style="text-decoration:overline">P</span> = U<sub>ef</sub>·I<sub>ef</sub> = ${fmt(P0 / 2, 0)} W. Efektivna napetost je tista enosmerna napetost, ki bi na istem uporniku dala enako povprečno moč.</p>
       <p class="muted">Največji tok I₀ = U₀/R = ${fmt(I0, 2)} A. Omrežje v Sloveniji: 230 V (efektivno), 50 Hz.</p>`;
  };
  layout(el, {
    stage: [svg, svg2],
    controls: [
      slider({ label: "temenska napetost U₀", min: 10, max: 400, step: 5, value: U0, unit: "V", onInput: (v) => ((U0 = v), draw()) }),
      slider({ label: "frekvenca ν", min: 10, max: 100, step: 5, value: f, unit: "Hz", onInput: (v) => ((f = v), draw()) }),
      slider({ label: "upor R", min: 50, max: 500, step: 10, value: R, unit: "Ω", onInput: (v) => ((R = v), draw()) }),
    ],
    out,
    tryText: "Kolikšna je temenska napetost omrežja, če je efektivna 230 V? Nastavi jo in preveri. Zakaj je povprečna moč polovica največje?",
  });
  draw();
}

function nihajniKrog(el) {
  const svg = svgBox(340, 170), svg2 = svgBox(340, 170);
  const out = readout();
  let L = 50, C = 40, t = 0; // L v mH, C v µF, t v ms (resnični čas)
  const SLOW = 200; // animacija je 200-krat upočasnjena
  const per = () => 2 * Math.PI * Math.sqrt((L / 1000) * (C / 1e6)) * 1000; // ms
  const draw = () => {
    svg.replaceChildren();
    svg2.replaceChildren();
    const T0 = per(), ph = (2 * Math.PI * t) / T0, q = Math.cos(ph), i = -Math.sin(ph);
    // kondenzator (levo) in tuljava (desno)
    s("path", { d: "M40,62 V30 H220 V50 M220,140 H40 V106", class: "wire", "stroke-width": 3 }, svg);
    s("rect", { x: 26, y: 62, width: 28, height: 6, class: "fill-text" }, svg);
    s("rect", { x: 26, y: 100, width: 28, height: 6, class: "fill-text" }, svg);
    const n = Math.round(Math.abs(q) * 5);
    for (let k = 0; k < n; k++) {
      label(svg, 30 + k * 5, 54, q > 0 ? "+" : "−", "tick small b");
      label(svg, 30 + k * 5, 116, q > 0 ? "−" : "+", "tick small b");
    }
    label(svg, 14, 84, "C", "lbl");
    s("path", { d: "M220,50 " + Array.from({ length: 6 }, (_, k) => `a8,8 0 1,1 0,${12}`).join(" ") + " L220,140", class: "string", fill: "none", transform: "translate(0,0)" }, svg);
    label(svg, 244, 84, "L", "lbl");
    if (Math.abs(i) > 0.08) arrow(svg, 130 - 40 * i, 30, 130 + 40 * i, 30, "a", 3);
    label(svg, 130, 18, "tok I", "tick small");
    // energijski stolpca
    const We = q * q, Wm = i * i;
    [["W_e", We, "c", 270], ["W_m", Wm, "a", 305]].forEach(([nm, v, col, x]) => {
      s("rect", { x, y: 30, width: 22, height: 110, class: "box" }, svg);
      s("rect", { x, y: 140 - 110 * v, width: 22, height: 110 * v, class: `fill-${col}`, "data-name": nm === "W_e" ? "Električna energija" : "Magnetna energija" }, svg);
      subLbl(svg, x + 11, 154, "W", nm === "W_e" ? "el" : "mag", "", "tick small");
    });
    const A = axes(svg2, { W: 340, H: 170, x: [0, 40], y: [-1.2, 1.2], pad: 34, xLabel: "t [ms]", yLabel: "", xStep: 5, yStep: 0.5, yFmt: () => "" });
    s("path", { d: fnPath((u) => Math.cos((2 * Math.PI * u) / T0), A, { n: 800 }), class: "graph-line stroke-c", "data-name": "Naboj q(t)" }, svg2);
    s("path", { d: fnPath((u) => -Math.sin((2 * Math.PI * u) / T0), A, { n: 800 }), class: "graph-line stroke-a thin-line", "data-name": "Tok I(t)" }, svg2);
    const tt = t % 40;
    s("line", { x1: A.X(tt), y1: A.T, x2: A.X(tt), y2: A.B, class: "guide", "data-name": "Trenutek t" }, svg2);
    label(svg2, A.L + 6, A.T + 8, "q(t)", "tick small b fill-c", "start");
    label(svg2, A.L + 46, A.T + 8, "I(t)", "tick small b fill-a", "start");
    const f0 = 1000 / T0;
    out.innerHTML = texBlock(`\\begin{aligned} t_0 &= 2\\pi\\sqrt{LC} \\\\ &= 2\\pi\\sqrt{${T(L / 1000, 3)}\\ \\text{H} \\cdot ${sci(C / 1e6, 1)}\\ \\text{F}} \\\\ &\\approx ${T(T0, 2)}\\ \\text{ms} \\end{aligned}`) +
      texBlock(`\\nu_0 = \\frac{1}{t_0} \\approx ${T(f0, 0)}\\ \\text{Hz}`) +
      `<p>Nabit kondenzator se prazni skozi tuljavo. Električna energija kondenzatorja (W<sub>el</sub>) se pretaka v magnetno energijo tuljave (W<sub>mag</sub>) in nazaj; vsota je stalna (brez upora ni izgub). Ko je naboj največji, je tok nič, in obratno.</p>
       <p class="muted">Animacija je ${SLOW}-krat upočasnjena. Večja L ali C pomeni daljši nihajni čas in nižjo lastno frekvenco.</p>`;
  };
  const anim = animate(el, (dt) => {
    t += (dt * 1000) / SLOW;
    draw();
  }, { autoplay: false });
  layout(el, {
    stage: [svg, svg2],
    controls: [
      slider({ label: "induktivnost L", min: 10, max: 100, step: 5, value: L, unit: "mH", onInput: (v) => ((L = v), draw()) }),
      slider({ label: "kapaciteta C", min: 10, max: 100, step: 5, value: C, unit: "µF", onInput: (v) => ((C = v), draw()) }),
      buttons(playButton(anim, { play: "Predvajaj", pause: "Ustavi" })),
    ],
    out,
    tryText: "Kolikokrat moraš povečati C, da se lastna frekvenca razpolovi? Napovej in preveri z drsnikom.",
  });
  draw();
}

// ------------------------------------------------------------ elektromagnetni spekter
const C_LUC = 3e8, H_PL = 6.63e-34, EV = 1.6e-19;
const PASOVI = [
  [-14, -11, "sevanje gama", "pri radioaktivnem razpadu in jedrskih reakcijah (prehodi v jedru)", "obsevanje tumorjev, sterilizacija hrane in pripomočkov"],
  [-11, -8, "rentgenska svetloba", "ko hitri elektroni zavirajo v kovini ali pri prehodih notranjih elektronov v atomih", "rentgensko slikanje, preiskava kristalov"],
  [-8, Math.log10(3.8e-7), "ultravijolična svetloba", "pri prehodih elektronov v atomih; seva jo Sonce", "razkuževanje vode, nastanek vitamina D, porjavitev kože"],
  [Math.log10(3.8e-7), Math.log10(7.5e-7), "vidna svetloba", "pri prehodih zunanjih elektronov v atomih in v vročih telesih (Sonce, žarilna nitka)", "vid, fotosinteza, laserji"],
  [Math.log10(7.5e-7), -3, "infrardeča svetloba", "v vseh telesih pri sobni temperaturi (toplotno sevanje), pri nihanju molekul", "termovizija, daljinski upravljalnik, optična vlakna"],
  [-3, Math.log10(0.3), "mikrovalovi", "v magnetronu in antenah, ko elektroni hitro nihajo", "mikrovalovna pečica, Wi-Fi, mobilna telefonija, radar"],
  [Math.log10(0.3), 4, "radijski valovi", "v antenah, po katerih teče izmenični tok (nihajni krog)", "radio, televizija, radijska postaja"],
];
const vidnaBarva = (nm) => `hsl(${clamp(270 - ((nm - 380) / (750 - 380)) * 270, 0, 270)} 90% 50%)`;

// Valovna dolžina za napis drsnika: 5,0·10⁻⁷ m.
function lamTxt(x) {
  let e = Math.floor(Math.log10(x) + 1e-9), m = x / 10 ** e;
  if (+m.toFixed(1) >= 10) (m /= 10), e++;
  return e === 0 ? `${fmt(m, 1)} m` : `${fmt(m, 1)}·${pot10(e)} m`;
}

export function emSpekter(el) {
  const svg = svgBox(340, 130);
  const out = readout();
  let lg = -6.3;
  const X0 = 20, X1 = 320, lo = -12, hi = 3;
  const X = (v) => X0 + ((v - lo) / (hi - lo)) * (X1 - X0);
  let sl;
  const draw = () => {
    svg.replaceChildren();
    // valovanje, ki se proti desni podaljšuje
    let d = "", ph = 0;
    for (let k = 0; k <= 300; k++) {
      ph += 0.5 * Math.exp((-k * Math.log(12)) / 300); // valovna dolžina proti desni enakomerno narašča
      const x = X0 + k, y = 30 - 12 * Math.sin(ph);
      d += `${k ? "L" : "M"}${x},${y.toFixed(1)} `;
    }
    s("path", { d, class: "graph-line stroke-muted thin-line", opacity: 0.6, "data-name": "Valovanje" }, svg);
    PASOVI.forEach(([a, b, name], i) => {
      const xa = X(Math.max(a, lo)), xb = X(Math.min(b, hi));
      if (name === "vidna svetloba") {
        for (let k = 0; k < 8; k++) s("rect", { x: xa + ((xb - xa) * k) / 8, y: 56, width: (xb - xa) / 8 + 0.5, height: 34, fill: vidnaBarva(380 + (370 * k) / 7) }, svg);
      } else s("rect", { x: xa, y: 56, width: xb - xa, height: 34, class: i % 2 ? "fill-soft" : "box" }, svg);
    });
    [["γ", -12.5], ["X", -9.5], ["UV", -7.4], ["IR", -4.8], ["MV", -2.2], ["radio", 1.3]].forEach(([t, v]) => label(svg, X(Math.max(v, lo + 0.4)), 73, t, "tick small b"));
    for (let v = lo; v <= hi; v += 3) {
      s("line", { x1: X(v), y1: 90, x2: X(v), y2: 96, class: "axis thin" }, svg);
      label(svg, X(v), 106, v === 0 ? "1 m" : pot10(v), "tick small");
    }
    label(svg, X1, 122, "λ [m]", "axis-label", "end");
    label(svg, X0, 122, "← večja frekvenca in energija fotona", "tick small", "start");
    const hd = handle(svg, "danger");
    s("line", { x1: 0, y1: -18, x2: 0, y2: 18, class: "graph-line stroke-danger" }, hd);
    hd.move(X(lg), 73);
    draggable(svg, hd, (mx) => {
      lg = clamp(Math.round(((mx - X0) / (X1 - X0)) * (hi - lo) * 10) / 10 + lo, lo, hi);
      sl.set(lg, true);
      draw();
    }, { label: "Oznaka valovne dolžine: premikaj jo s puščicami" });
    const lam = 10 ** lg, nu = C_LUC / lam, E = H_PL * nu;
    const pas = PASOVI.find(([a, b]) => lg >= a && lg < b) || PASOVI.at(-1);
    out.innerHTML = texBlock(`\\lambda = ${sci(lam)}\\ \\text{m}`) +
      texBlock(`\\begin{aligned} \\nu &= \\frac{c}{\\lambda} = \\frac{3{,}00 \\cdot 10^{8}\\ \\text{m/s}}{${sci(lam)}\\ \\text{m}} \\\\ &= ${sci(nu)}\\ \\text{Hz} \\end{aligned}`) +
      texBlock(`\\begin{aligned} E_f &= h\\nu = ${sci(E)}\\ \\text{J} \\\\ &= ${sci(E / EV)}\\ \\text{eV} \\end{aligned}`) +
      `<p>To je <b>${pas[2]}</b>${pas[2] === "vidna svetloba" ? ` (barva pri ${fmt(lam * 1e9, 0)} nm: <span style="display:inline-block;width:1.2em;height:0.8em;border-radius:3px;background:${vidnaBarva(lam * 1e9)}"></span>)` : ""}. Nastane ${pas[3]}. Uporaba: ${pas[4]}.</p>
       <p class="muted">Vsa elektromagnetna valovanja nastanejo pri pospešenem gibanju nabojev in se v vakuumu širijo s hitrostjo svetlobe c = 3,00·10⁸ m/s. Razlikujejo se le po valovni dolžini (in frekvenci).</p>`;
  };
  sl = slider({ label: "valovna dolžina λ (logaritemska skala)", min: lo, max: hi, step: 0.1, value: lg, format: (v) => lamTxt(10 ** v), onInput: (v) => ((lg = v), draw()) });
  layout(el, { stage: [svg], controls: [sl], out, tryText: "Mikrovalovna pečica deluje pri 2,45 GHz. Poišči valovno dolžino, pri kateri je frekvenca toliko. V katerem delu spektra je valovanje z valovno dolžino 1 m?" });
  draw();
}

// ------------------------------------------------------------ zvezde (HR-diagram)
const SIGMA = 5.67e-8, T_SONCE = 5800, L_SONCE = 3.8e26, R_SONCE = 6.96e8;
const ZVEZDE = [["Sonce", 5800, 1], ["Sirij A", 9900, 25], ["Betelgeza", 3600, 1.1e5], ["Proksima Kentavra", 3000, 0.0017], ["Rigel", 12000, 1.2e5], ["Sirij B", 25000, 0.056]];
// približna barva telesa pri temperaturi T (črno telo)
function barvaT(T0) {
  const t = T0 / 100;
  const r = t <= 66 ? 255 : 329.7 * (t - 60) ** -0.1332;
  const g = t <= 66 ? 99.47 * Math.log(t) - 161.1 : 288.1 * (t - 60) ** -0.0755;
  const b = t >= 66 ? 255 : t <= 19 ? 0 : 138.5 * Math.log(t - 10) - 305.0;
  return `rgb(${[r, g, b].map((v) => Math.round(clamp(v, 0, 255))).join(",")})`;
}
const razred = (T0) => (T0 >= 30000 ? "O (modra)" : T0 >= 10000 ? "B (modrobela)" : T0 >= 7500 ? "A (bela)" : T0 >= 6000 ? "F (rumenobela)" : T0 >= 5200 ? "G (rumena)" : T0 >= 3700 ? "K (oranžna)" : "M (rdeča)");

export function zvezde(el) {
  const svg = svgBox(340, 312);
  const out = readout();
  let Tz = 5800, lgR = 0;
  let slT, slR;
  // HR-diagram: x = log T (obrnjeno), y = log L
  const HX0 = 120, HX1 = 330, HY0 = 280, HY1 = 20;
  const hx = (T0) => HX0 + ((Math.log10(40000) - Math.log10(T0)) / (Math.log10(40000) - Math.log10(2500))) * (HX1 - HX0);
  const hy = (L) => HY0 - ((Math.log10(L) + 4) / 10) * (HY0 - HY1);
  const draw = () => {
    svg.replaceChildren();
    const R = 10 ** lgR, L = R * R * (Tz / T_SONCE) ** 4;
    // zvezda (levo): polmer na logaritemski skali
    const rr = 6 + ((lgR + 2) / 5) * 44;
    s("circle", { cx: 58, cy: 110, r: rr, fill: barvaT(Tz), stroke: "var(--border)", "data-name": "Zvezda" }, svg);
    s("circle", { cx: 58, cy: 220, r: 6 + (2 / 5) * 44, fill: barvaT(5800), stroke: "var(--border)", "data-name": "Sonce za primerjavo" }, svg);
    label(svg, 58, 280, "Sonce", "tick small");
    label(svg, 58, 14, "zvezda", "tick small");
    // osi HR
    s("line", { x1: HX0, y1: HY0, x2: HX1, y2: HY0, class: "axis" }, svg);
    s("line", { x1: HX0, y1: HY0, x2: HX0, y2: HY1, class: "axis" }, svg);
    [40000, 20000, 10000, 5000, 2500].forEach((v) => label(svg, hx(v), HY0 + 11, fmt(v / 1000, 1) + "k", "tick small"));
    label(svg, HX1, HY0 + 23, "T [K] ←", "axis-label", "end");
    [-4, -2, 0, 2, 4, 6].forEach((e) => label(svg, HX0 - 4, hy(10 ** e), e === 0 ? "1" : pot10(e), "tick small", "end"));
    label(svg, HX0 + 4, HY1 - 6, "L/L☉", "axis-label", "start");
    // glavna veja (približno L ∝ T^7 skozi Sonce)
    s("path", { d: `M${hx(35000)},${hy(1e5)} Q${hx(9000)},${hy(30)} ${hx(5800)},${hy(1)} T${hx(2800)},${hy(1e-3)}`, class: "graph-line stroke-muted", "stroke-width": 14, opacity: 0.18, fill: "none", "data-name": "Glavna veja" }, svg);
    ZVEZDE.forEach(([n, t0, l0]) => {
      s("circle", { cx: hx(t0), cy: hy(l0), r: 3.5, fill: barvaT(t0), stroke: "var(--text)", "stroke-width": 0.6, "data-name": "Znane zvezde" }, svg);
      const desno = hx(t0) > 250; // napis ob desnem robu na levo od točke, da ga ne odreže
      label(svg, hx(t0) + (desno ? -6 : 6), hy(l0) - 7, n, "tick small", desno ? "end" : "start");
    });
    const hd = handle(svg, "danger");
    hd.move(hx(Tz), hy(clamp(L, 1e-4, 1e6)));
    draggable(svg, hd, (mx, my) => {
      const lT = Math.log10(40000) - ((mx - HX0) / (HX1 - HX0)) * (Math.log10(40000) - Math.log10(2500));
      Tz = clamp(Math.round(10 ** lT / 100) * 100, 2500, 40000);
      const lL = ((HY0 - my) / (HY0 - HY1)) * 10 - 4;
      lgR = clamp(Math.round(((lL - 4 * Math.log10(Tz / T_SONCE)) / 2) * 20) / 20, -2, 3);
      slT.set(Tz, true);
      slR.set(lgR, true);
      draw();
    }, { label: "Zvezda na HR-diagramu: premikaj jo s puščicami" });
    const j = SIGMA * Tz ** 4, lmax = 2.9e-3 / Tz;
    const tip = lgR <= -1.3 ? (Tz >= 5000 ? "bela pritlikavka" : "zelo majhna hladna zvezda") : lgR >= 2.3 ? "nadorjakinja" : lgR >= 1.2 ? "orjakinja" : Math.abs(Math.log10(L) - 4.4 * lgR) < 1.2 ? "zvezda glavne veje" : "zvezda zunaj glavne veje";
    out.innerHTML = texBlock(`\\frac{L}{L_\\odot} = \\left(\\frac{R}{R_\\odot}\\right)^2 \\left(\\frac{T}{T_\\odot}\\right)^4 = ${T(R, R < 1 ? 2 : 1)}^2 \\cdot \\left(\\frac{${Tz}}{5800}\\right)^4 \\approx ${sci(L, 2)}`) +
      texBlock(`j = \\sigma T^4 = ${sci(j, 2)}\\ \\tfrac{\\text{W}}{\\text{m}^2}`) +
      texBlock(`\\lambda_\\text{max} = \\frac{2{,}9 \\cdot 10^{-3}\\ \\text{K m}}{T} \\approx ${T(lmax * 1e9, 0)}\\ \\text{nm}`) +
      `<p>Spektralni razred <b>${razred(Tz)}</b>; vrsta: ${tip}. Svetilnost L = ${tex(sci(L * L_SONCE, 2))} W. Vsak kvadratni meter površine seva j = σT⁴ (Stefanov zakon), zato je pri isti temperaturi svetlejša večja zvezda.</p>
       <p class="muted">Zvezde glavne veje v sredici zlivajo vodik v helij (fuzija). Svetloba od Sonca potuje 8,3 minute, od Proksime Kentavra 4,2 leta.</p>`;
  };
  slT = slider({ label: "temperatura površja T", min: 2500, max: 40000, step: 100, value: Tz, unit: "K", onInput: (v) => ((Tz = v), draw()) });
  slR = slider({ label: "polmer R (log₁₀ R/R☉)", min: -2, max: 3, step: 0.05, value: lgR, format: (v) => `${fmt(10 ** v, v < 0 ? 2 : v < 1 ? 1 : 0)} R☉`, onInput: (v) => ((lgR = v), draw()) });
  layout(el, { stage: [svg], controls: [slT, slR], out, tryText: "Betelgeza je hladnejša od Sonca, a 100 000-krat svetlejša. Kolikšen mora biti njen polmer? Poišči ga z drsnikoma in preveri s Stefanovim zakonom." });
  draw();
}

// ------------------------------------------------------------ matematična indukcija (domine)
// Baza podre prvo domino, indukcijski korak (iz P(k) sledi P(k + 1)) vsako naslednjo. »Lažna formula«
// ima veljaven korak, a napačno bazo: ne pade nobena domina.
const IND = {
  naravna: {
    name: "1 + 2 + … + n = n(n + 1)/2",
    P: "1 + 2 + \\dots + n = \\frac{n(n + 1)}{2}",
    term: (n) => n, R: (n) => (n * (n + 1)) / 2,
    termTex: "(k + 1)",
    step: ["\\frac{k(k + 1)}{2} + (k + 1)", "\\frac{k(k + 1) + 2(k + 1)}{2}", "\\frac{(k + 1)(k + 2)}{2}"],
    pic: "stopnice",
  },
  liha: {
    name: "1 + 3 + … + (2n − 1) = n²",
    P: "1 + 3 + \\dots + (2n - 1) = n^2",
    term: (n) => 2 * n - 1, R: (n) => n * n,
    termTex: "(2k + 1)",
    step: ["k^2 + (2k + 1)", "(k + 1)^2"],
    pic: "kvadrat",
  },
  kvadrati: {
    name: "1² + 2² + … + n² = n(n + 1)(2n + 1)/6",
    P: "1^2 + 2^2 + \\dots + n^2 = \\frac{n(n + 1)(2n + 1)}{6}",
    term: (n) => n * n, R: (n) => (n * (n + 1) * (2 * n + 1)) / 6,
    termTex: "(k + 1)^2",
    step: ["\\frac{k(k + 1)(2k + 1)}{6} + (k + 1)^2", "\\frac{(k + 1)(2k^2 + 7k + 6)}{6}", "\\frac{(k + 1)(k + 2)(2k + 3)}{6}"],
    pic: "kvadrati",
  },
  lazna: {
    name: "lažna: vsota = (n² + n + 2)/2",
    P: "1 + 2 + \\dots + n = \\frac{n^2 + n + 2}{2}",
    term: (n) => n, R: (n) => (n * n + n + 2) / 2,
    termTex: "(k + 1)",
    step: ["\\frac{k^2 + k + 2}{2} + (k + 1)", "\\frac{k^2 + 3k + 4}{2}", "\\frac{(k + 1)^2 + (k + 1) + 2}{2}"],
    pic: "stopnice",
  },
};

export function domine(el) {
  const svg = svgBox(340, 250);
  const out = readout();
  const N = 10;
  let key = "naravna", k = 0, baza = null, msg = "";
  const F = () => IND[key];
  const S = (n) => Array.from({ length: n }, (_, i) => F().term(i + 1)).reduce((t, v) => t + v, 0);
  // vsota s členi: do 5 členov vse, sicer 1 + 2 + 3 + … + zadnji
  const terms = (n) => (n <= 5 ? Array.from({ length: n }, (_, i) => F().term(i + 1)) : [1, 2, 3].map(F().term).concat("…", F().term(n))).join(" + ");
  const draw = () => {
    svg.replaceChildren();
    // domine: padla je tista, za katero je trditev dokazana
    for (let i = 1; i <= N; i++) {
      const x = 4 + i * 30, fell = i <= k;
      const r = s("rect", { x: x - 5, y: 18, width: 10, height: 50, rx: 2, class: fell ? "fill-ok" : "box", "data-name": fell ? "Dokazano" : null }, svg);
      if (fell) r.setAttribute("transform", `rotate(${i === N ? 80 : 58} ${x + 5} 68)`);
      label(svg, x, 82, String(i), `tick small${i === k + 1 && baza !== false ? " b" : ""}`);
    }
    label(svg, 12, 82, "n", "tick small");
    // slika vsote za n = k (pred bazo za n = 4): zadnji, pravkar dodani člen je obarvan drugače
    const n = k || 4, pic = F().pic, top = 120, H = 120;
    const cell = (x, y, c, cls) => s("rect", { x, y, width: c - 1, height: c - 1, class: cls }, svg);
    if (pic === "stopnice") {
      const c = Math.min(22, H / n, 300 / (n + 1)), x0 = 170 - ((n + 1) * c) / 2, y0 = top + H - n * c;
      for (let col = 0; col <= n; col++)
        for (let row = 0; row < n; row++) {
          const filled = row < col; // stolpec col ima col kvadratkov vsote
          cell(x0 + col * c, y0 + (n - 1 - row) * c, c, filled ? (col === n && k ? "fill-c" : "fill-a") : "fill-soft");
        }
      label(svg, 170, top - 8, n === 1 ? "2 · 1 = 1 · 2" : `2 · (${terms(n)}) = ${n} · ${n + 1}`, "tick", "middle");
    } else if (pic === "kvadrat") {
      const c = Math.min(22, H / n), x0 = 170 - (n * c) / 2, y0 = top + H - n * c;
      for (let r = 0; r < n; r++)
        for (let q = 0; q < n; q++) {
          const g = Math.max(r, q); // kotnik št. g ima 2g + 1 kvadratkov
          cell(x0 + q * c, y0 + (n - 1 - r) * c, c, g === n - 1 && k ? "fill-c" : g % 2 ? "fill-b" : "fill-a");
        }
      label(svg, 170, top - 8, `${terms(n)} = ${n}²`, "tick", "middle");
    } else {
      const tot = (n * (n + 1)) / 2, c = Math.min(22, H / n, 320 / (tot + n)), gap = c;
      let x = 170 - (tot * c + (n - 1) * gap) / 2;
      for (let q = 1; q <= n; q++) {
        s("rect", { x, y: top + H - q * c, width: q * c, height: q * c, class: q === n && k ? "fill-c" : "fill-a", opacity: 0.85 }, svg);
        x += q * c + gap;
      }
      label(svg, 170, top - 8, `${n === 1 ? "1²" : n === 2 ? "1² + 2²" : `1² + … + ${n}²`} = ${S(n)}`, "tick", "middle");
    }
    const f = F(), R1 = f.R(1), T1 = f.term(1);
    let html = `<p>Trditev ${tex("P(n)")}: ${tex(f.P)}</p>`;
    html += baza === null
      ? `<p>1. <b>Baza</b> še ni preverjena: nobena domina še ni padla.</p>`
      : baza
        ? `<p>1. <b>Baza</b> ${tex(`n = 1`)}: leva stran ${tex(String(T1))}, desna ${tex(T(R1, 2))}. <b class="ok-text">Velja</b>, prva domina pade.</p>`
        : `<p>1. <b>Baza</b> ${tex(`n = 1`)}: leva stran ${tex(String(T1))}, desna ${tex(T(R1, 2))}. <b class="bad-text">Ne velja</b>, prva domina ne pade.</p>`;
    html += `<p>2. <b>Indukcijski korak</b>: predpostavimo, da velja ${tex("P(k)")}. Prištejemo naslednji člen ${tex(f.termTex)}:</p>` +
      texBlock(`\\begin{aligned} S(k + 1) &= S(k) + ${f.termTex} \\\\ ${f.step.map((x) => `&= ${x}`).join(" \\\\ ")} \\end{aligned}`) +
      `<p>To je ravno ${tex("P(k + 1)")}: korak velja za vsak k. Če pade domina k, pade tudi domina k + 1.</p>`;
    if (k >= 2) {
      const a = k - 1;
      html += `<p>Zadnji korak s števili (${tex(`k = ${a}`)}): ${tex(`S(${k}) = S(${a}) + ${f.term(k)} = ${T(f.R(a), 2)} + ${f.term(k)} = ${T(S(k), 2)}`)}, desna stran za n = ${k} pa je tudi ${T(f.R(k), 2)}.</p>`;
    }
    if (key === "lazna") {
      const vals = [1, 2, 3, 4].map((m) => `${S(m)} ≠ ${T(f.R(m), 2)}`).join(", ");
      html += `<p class="muted">Leva in desna stran za n = 1, 2, 3, 4: ${vals}. Desna stran je vedno za 1 prevelika. Korak sam ni dovolj, potrebna je tudi baza.</p>`;
    }
    if (msg) html += `<p><b>${msg}</b></p>`;
    out.innerHTML = html;
  };
  const doBase = () => {
    baza = F().R(1) === F().term(1);
    k = baza ? 1 : 0;
    msg = baza ? "Prva domina je padla. Zdaj poskusi s korakom." : "Baza ne velja: prva domina stoji, zato tudi korak ne podre nobene.";
    draw();
  };
  const doStep = () => {
    if (baza === null) msg = "Najprej preveri bazo: brez prve domine korak ne podre nobene.";
    else if (!baza) msg = "Korak velja, a domine stojijo: veriga se nikjer ne začne.";
    else if (k >= N) msg = `Padlo je vseh ${N} domin na sliki. Ker korak velja za vsak k, trditev velja za vsa naravna števila.`;
    else (k++, (msg = `Iz P(${k - 1}) sledi P(${k}): padla je domina ${k}.`));
    draw();
  };
  layout(el, {
    stage: [svg],
    controls: [
      select({ label: "trditev", options: Object.entries(IND).map(([v, x]) => [v, x.name]), value: key, onChange: (v) => ((key = v), (k = 0), (baza = null), (msg = ""), draw()) }),
      buttons(button("1. Preveri bazo (n = 1)", doBase, "secondary"), button("2. Indukcijski korak k → k + 1", doStep, "primary")),
    ],
    out,
    tryText: "Preveri bazo in naredi nekaj korakov. Nato izberi lažno formulo: korak še vedno velja. Zakaj ne pade nobena domina in kaj to pove o bazi?",
  });
  draw();
}

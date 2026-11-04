// Simulacije: enačbe (tehtnica), neenačbe in intervali, algebrske ploščice, ploščinski model, sistemi.
import { h, s, svgBox, slider, select, segmented, toggle, button, buttons, readout, stage, layout, tex, texBlock, fmt, tfmt, gcd, clamp, label, axes, rint } from "./kit.js";

// Racionalna števila kot [števec, imenovalec].
const R = (n, d = 1) => {
  if (d < 0) (n = -n), (d = -d);
  const g = gcd(n, d) || 1;
  return [n / g, d / g];
};
const add = (a, b) => R(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
const mul = (a, b) => R(a[0] * b[0], a[1] * b[1]);
const neg = (a) => [-a[0], a[1]];
const val = (a) => a[0] / a[1];
const rt = (a) => (a[1] === 1 ? `${a[0]}` : `${a[0] < 0 ? "-" : ""}\\frac{${Math.abs(a[0])}}{${a[1]}}`);
function sideTex(ax, c) {
  const parts = [];
  if (ax[0]) parts.push(ax[0] === 1 && ax[1] === 1 ? "x" : ax[0] === -1 && ax[1] === 1 ? "-x" : ax[1] === 1 ? `${ax[0]}x` : `${rt(ax)}x`);
  if (c[0] || !parts.length) parts.push(parts.length && c[0] > 0 ? `+ ${rt(c)}` : parts.length ? `- ${rt(neg(c))}` : rt(c));
  return parts.join(" ");
}

// ------------------------------------------------------------ tehtnica
const EQ_PRESETS = {
  osnovne: [[[2, 1], [3, 1], [0, 1], [11, 1]], [[3, 1], [2, 1], [1, 1], [10, 1]], [[1, 1], [7, 1], [0, 1], [12, 1]], [[4, 1], [1, 1], [2, 1], [9, 1]]],
  ulomki: [[[1, 2], [1, 1], [0, 1], [4, 1]], [[1, 3], [2, 1], [0, 1], [5, 1]], [[3, 4], [0, 1], [1, 2], [2, 1]], [[2, 3], [1, 1], [0, 1], [5, 1]]],
};
export function tehtnica(el, { preset = "osnovne" } = {}) {
  const svg = svgBox(340, 220);
  const out = readout();
  const hist = h("ol", { class: "eq-steps" });
  let L, Rr, sol, guess = 1, k = 0;
  const load = (i) => {
    const [a, b, c, d] = EQ_PRESETS[preset][i % EQ_PRESETS[preset].length];
    L = { ax: R(...a), c: R(...b) };
    Rr = { ax: R(...c), c: R(...d) };
    sol = val(add(Rr.c, neg(L.c))) / val(add(L.ax, neg(Rr.ax)));
    hist.replaceChildren(h("li", { html: tex(`${sideTex(L.ax, L.c)} = ${sideTex(Rr.ax, Rr.c)}`) }));
    draw();
  };
  const apply = (fn, desc) => {
    L = fn(L);
    Rr = fn(Rr);
    hist.append(h("li", { html: `${tex(`${sideTex(L.ax, L.c)} = ${sideTex(Rr.ax, Rr.c)}`)} <span class="muted">(${desc})</span>` }));
    draw();
  };
  const drawSide = (side, cx, y) => {
    const items = [];
    const ax = val(side.ax), c = val(side.c);
    if (Number.isInteger(ax) && Math.abs(ax) <= 6) for (let i = 0; i < Math.abs(ax); i++) items.push(["x", ax < 0]);
    else if (ax) items.push([`${fmt(ax, 2)}x`.replace(/^1x/, "x"), ax < 0, true]);
    if (Number.isInteger(c) && Math.abs(c) <= 12) for (let i = 0; i < Math.abs(c); i++) items.push(["1", c < 0]);
    else if (c) items.push([fmt(c, 2), c < 0, true]);
    const perRow = 6;
    items.forEach(([t, negItem, wide], i) => {
      const col = i % perRow, row = Math.floor(i / perRow);
      const w = wide ? 44 : t === "x" ? 22 : 16;
      const x = cx - 66 + col * 23, yy = y - 20 - row * 22;
      if (t === "x" || /x$/.test(t)) s("rect", { x, y: yy, width: w, height: 20, rx: 4, class: `weight x ${negItem ? "neg" : ""}` }, svg);
      else s("rect", { x: x + 2, y: yy + 4, width: wide ? 40 : 16, height: 16, rx: 8, class: `weight one ${negItem ? "neg" : ""}` }, svg);
      label(svg, x + (wide ? 22 : t === "x" ? 11 : 10), yy + 11, t, "lbl small inv");
    });
  };
  const draw = () => {
    svg.replaceChildren();
    // nagib glede na preizkusno vrednost x
    const lv = val(L.ax) * guess + val(L.c), rv = val(Rr.ax) * guess + val(Rr.c);
    const tilt = clamp((rv - lv) * 2, -14, 14);
    s("path", { d: "M170,200 l-24,16 h48 z", class: "fill-muted" }, svg);
    s("line", { x1: 170, y1: 120, x2: 170, y2: 200, class: "beam-post" }, svg);
    const g = s("g", { transform: `rotate(${tilt} 170 120)` }, svg);
    s("line", { x1: 40, y1: 120, x2: 300, y2: 120, class: "beam" }, g);
    const pans = [[75, 160 - Math.sin((tilt * Math.PI) / 180) * 130], [265, 160 + Math.sin((tilt * Math.PI) / 180) * 130]];
    pans.forEach(([x, y]) => {
      s("line", { x1: x, y1: y, x2: x, y2: 120 + (x < 170 ? -1 : 1) * Math.sin((tilt * Math.PI) / 180) * 95, class: "string" }, svg);
      s("path", { d: `M${x - 72},${y} h144 l-12,10 h-120 z`, class: "pan" }, svg);
    });
    drawSide(L, pans[0][0], pans[0][1]);
    drawSide(Rr, pans[1][0], pans[1][1]);
    const solved = (val(L.ax) === 1 && !val(L.c) && !val(Rr.ax)) || (val(Rr.ax) === 1 && !val(Rr.c) && !val(L.ax));
    out.innerHTML = `<p>Tehtnica je v ravnovesju samo, če sta obe strani enako težki. Z obema stranema moraš vedno narediti <b>isto</b>.</p>
      <p>Preizkus: pri x = ${fmt(guess, 2)} je levo ${fmt(lv, 2)}, desno ${fmt(rv, 2)}: ${Math.abs(lv - rv) < 1e-9 ? '<b class="ok-text">ravnovesje, to je rešitev</b>' : "tehtnica se nagne"}.</p>
      ${solved ? `<p class="fb ok">Rešeno: x = ${fmt(sol, 3)}. Preveri z drsnikom.</p>` : ""}`;
    ops.forEach((b) => (b.disabled = !b.ok()));
  };
  const cInt = () => (val(L.c) && val(L.c) === val(Rr.c) ? val(L.c) : Math.min(Math.abs(val(L.c)) || Infinity, Math.abs(val(Rr.c)) || Infinity));
  const mk = (txt, fn, ok) => {
    const b = button(txt, fn);
    b.ok = ok;
    return b;
  };
  const ops = [
    mk("odvzemi 1 na obeh straneh", () => apply((S) => ({ ...S, c: add(S.c, [-1, 1]) }), "−1"), () => val(L.c) >= 1 && val(Rr.c) >= 1 || val(L.c) > 0 || val(Rr.c) > 0),
    mk("odvzemi x na obeh straneh", () => apply((S) => ({ ...S, ax: add(S.ax, [-1, 1]) }), "−x"), () => val(L.ax) >= 1 && val(Rr.ax) >= 1),
    mk("odvzemi vse enice z leve", () => { const c = L.c; apply((S) => ({ ...S, c: add(S.c, neg(c)) }), `${val(c) > 0 ? "−" : "+"}${fmt(Math.abs(val(c)), 2)}`); }, () => val(L.c) !== 0),
    mk("deli obe strani s številom pred x", () => { const a = val(L.ax) ? L.ax : Rr.ax; apply((S) => ({ ax: mul(S.ax, R(a[1], a[0])), c: mul(S.c, R(a[1], a[0])) }), `: ${fmt(val(a), 2)}`); }, () => (val(L.ax) && !val(Rr.ax) && val(L.ax) !== 1) || (!val(L.ax) && val(Rr.ax) && val(Rr.ax) !== 1)),
    mk("pomnoži obe strani z imenovalcem", () => { const d = Math.max(L.ax[1], L.c[1], Rr.ax[1], Rr.c[1]); apply((S) => ({ ax: mul(S.ax, [d, 1]), c: mul(S.c, [d, 1]) }), `· ${d}`); }, () => Math.max(L.ax[1], L.c[1], Rr.ax[1], Rr.c[1]) > 1),
  ];
  layout(el, {
    stage: [svg],
    controls: [
      buttons(...ops),
      slider({ label: "preizkusi x =", min: -5, max: 12, step: 0.5, value: guess, onInput: (v) => ((guess = v), draw()) }),
      buttons(button("Nova enačba", () => load(++k), "primary small")),
    ],
    extra: h("div", { class: "eq-hist" }, h("b", {}, "Koraki:"), hist),
    out,
    tryText: "Najprej z drsnikom poišči x, pri katerem je tehtnica v ravnovesju. Nato enačbo reši s koraki. Zakaj ne smeš odvzeti enice samo na eni strani?",
  });
  load(0);
}

// ------------------------------------------------------------ neenačbe in intervali
export function neenacba(el, { mode = "neenacba" } = {}) {
  const svg = svgBox(340, 130);
  const out = readout();
  let a = 2, b = 1, c = 7, rel = "<", test = 0, lo = -2, hi = 3, loC = true, hiC = false, lo2 = 1, hi2 = 5, op = "∩";
  const X = (v) => 20 + ((v + 8) / 16) * 300;
  const base = () => {
    svg.replaceChildren();
    s("line", { x1: 10, y1: 70, x2: 330, y2: 70, class: "axis" }, svg);
    for (let i = -8; i <= 8; i++) {
      s("line", { x1: X(i), y1: 64, x2: X(i), y2: 76, class: "axis" }, svg);
      if (i % 2 === 0) label(svg, X(i), 94, fmt(i), "tick");
    }
  };
  const ray = (p, dir, closed, cls, y = 70) => {
    const end = dir > 0 ? 330 : 10;
    s("line", { x1: X(p), y1: y, x2: end, y2: y, class: `ray ${cls}` }, svg);
    s("circle", { cx: X(p), cy: y, r: 7, class: closed ? `pt fill-${cls}` : `pt open stroke-${cls}` }, svg);
  };
  const seg = (p, q, pc, qc, cls, y) => {
    if (q < p) return;
    s("line", { x1: X(p), y1: y, x2: X(q), y2: y, class: `ray ${cls}` }, svg);
    s("circle", { cx: X(p), cy: y, r: 6, class: pc ? `pt fill-${cls}` : `pt open stroke-${cls}` }, svg);
    s("circle", { cx: X(q), cy: y, r: 6, class: qc ? `pt fill-${cls}` : `pt open stroke-${cls}` }, svg);
  };
  const draw = () => {
    base();
    if (mode === "neenacba") {
      // a x + b  rel  c
      const T = (r) => r.replace("≤", "\\le ").replace("≥", "\\ge ");
      const holds = (L) => ({ "<": L < c, ">": L > c, "≤": L <= c, "≥": L >= c })[rel];
      const lhs = a * test + b;
      const ok = holds(lhs);
      s("path", { d: `M${X(test)},40 l-6,-10 h12 z`, class: ok ? "fill-ok" : "fill-danger" }, svg);
      // Brez koeficienta 1 (x, −x), prosti člen 0 izpustimo; negativni x v preizkusu v oklepaju.
      const ax = a === 1 ? "x" : a === -1 ? "-x" : `${a}x`;
      const bt = b ? ` ${b > 0 ? "+" : "-"} ${Math.abs(b)}` : "";
      const bTxt = b ? ` ${b > 0 ? "+" : "−"} ${Math.abs(b)}` : "";
      const xt = test < 0 ? `(${fmt(test, 1)})` : fmt(test, 1);
      const check = `<p>Preizkus x = ${fmt(test, 1)}: ${fmt(a)} · ${xt}${bTxt} = ${fmt(lhs, 2)} ${ok ? "" : "ni "}${rel} ${fmt(c)} → ${ok ? '<b class="ok-text">je rešitev</b>' : "ni rešitev"}.</p>`;
      if (a === 0) {
        // 0 · x + b rel c: x izgine, neenačba velja za vsak x ali za nobenega.
        const all = holds(b);
        if (all) s("line", { x1: 10, y1: 70, x2: 330, y2: 70, class: "ray a" }, svg);
        out.innerHTML = texBlock(`0 \\cdot x${bt} ${T(rel)} ${c}\\\\ ${b} ${T(rel)} ${c}`) +
          `<p>Pri a = 0 se x izgubi: ostane neenakost ${fmt(b)} ${rel} ${fmt(c)}, ki je ${all ? "<b>pravilna</b>" : "<b>nepravilna</b>"} ne glede na x.</p>
         <p>Rešitev: ${all ? `${tex("x \\in \\mathbb{R}")} (vsako realno število).` : `neenačba nima rešitve, ${tex("\\emptyset")}.`}</p>${check}`;
        return;
      }
      const k = (c - b) / a;
      const flip = a < 0;
      const finalRel = flip ? { "<": ">", ">": "<", "≤": "≥", "≥": "≤" }[rel] : rel;
      const dir = finalRel === "<" || finalRel === "≤" ? -1 : 1;
      if (Math.abs(k) <= 8) ray(k, dir, finalRel === "≤" || finalRel === "≥", "a");
      // Meja (c − b)/a točno: tretjine kot ulomek (7/3, ne zaokroženo 2,33), polovice in četrtine decimalno.
      const g = gcd(c - b, a);
      const kT = Number.isInteger(k * 4) ? tfmt(k) : `${k < 0 ? "-" : ""}\\frac{${Math.abs(c - b) / g}}{${Math.abs(a) / g}}`;
      const interval = dir < 0 ? `(-\\infty, ${kT}${finalRel === "≤" ? "]" : ")"}` : `${finalRel === "≥" ? "[" : "("}${kT}, \\infty)`;
      const lines = [`${ax}${bt} ${T(rel)} ${c}`, `${ax} ${T(rel)} ${c - b}`, `x ${T(finalRel)} ${kT}`].filter((l, i, L) => l !== L[i - 1]);
      out.innerHTML = texBlock(lines.join("\\\\ ")) +
        `<p>${flip ? `<b>Pozor:</b> delili smo z negativnim številom (${fmt(a)}), zato se je znak neenakosti obrnil.` : a === 1 ? "Koeficient pri x je 1, zato deliti ni treba." : `Delili smo s pozitivnim številom (${a}), znak ostane enak.`}</p>
         <p>Rešitev: ${tex(`x \\in ${interval}`)}. ${finalRel === "<" || finalRel === ">" ? "Prazen krožec: meja ne spada zraven." : "Poln krožec: meja spada zraven."}</p>
         ${check}`;
    } else {
      seg(lo, hi, loC, hiC, "a", 46);
      seg(lo2, hi2, true, true, "b", 58);
      const A = [lo, hi, loC, hiC], B = [lo2, hi2, true, true];
      const T = ([p, q, pc, qc]) => `${pc ? "[" : "("}${tfmt(p)}, ${tfmt(q)}${qc ? "]" : ")"}`;
      let res;
      if (op === "∩") {
        const p = Math.max(lo, lo2), q = Math.min(hi, hi2);
        const pc = p === lo && p === lo2 ? loC && true : p === lo ? loC : true;
        const qc = q === hi && q === hi2 ? hiC && true : q === hi ? hiC : true;
        if (p < q || (p === q && pc && qc)) { seg(p, q, pc, qc, "c", 70); res = T([p, q, pc, qc]); }
        else res = "\\emptyset";
      } else {
        if (Math.max(lo, lo2) <= Math.min(hi, hi2)) {
          const p = Math.min(lo, lo2), q = Math.max(hi, hi2);
          const pc = p === lo2 ? true : loC, qc = q === hi2 ? true : hiC;
          seg(p, q, pc, qc, "c", 70);
          res = T([p, q, pc, qc]);
        } else {
          seg(lo, hi, loC, hiC, "c", 70);
          seg(lo2, hi2, true, true, "c", 70);
          res = `${T(A)} \\cup ${T(B)}`;
        }
      }
      out.innerHTML = texBlock(`A = ${T(A)},\\quad B = ${T(B)}\\\\ A ${op === "∩" ? "\\cap" : "\\cup"} B = ${res}`) +
        `<p>Oglati oklepaj [ ] pomeni, da krajišče <b>spada</b> v interval (poln krožec), okrogli ( ) pa, da ne (prazen krožec).</p>
         <p class="muted">${op === "∩" ? "Presek: števila, ki so v obeh intervalih hkrati." : "Unija: števila, ki so v vsaj enem intervalu."}</p>`;
    }
  };
  const ctl = mode === "neenacba"
    ? [
        slider({ label: "a", min: -4, max: 4, value: a, onInput: (v) => ((a = v), draw()) }),
        slider({ label: "b", min: -6, max: 6, value: b, onInput: (v) => ((b = v), draw()) }),
        segmented({ options: ["<", "≤", ">", "≥"], value: rel, onChange: (v) => ((rel = v), draw()) }),
        slider({ label: "c", min: -8, max: 8, value: c, onInput: (v) => ((c = v), draw()) }),
        slider({ label: "preizkusi x", min: -8, max: 8, step: 0.5, value: test, onInput: (v) => ((test = v), draw()) }),
      ]
    : [
        slider({ label: "A od", min: -8, max: 8, value: lo, onInput: (v) => ((lo = v), (hi = Math.max(hi, lo)), draw()) }),
        slider({ label: "A do", min: -8, max: 8, value: hi, onInput: (v) => ((hi = Math.max(v, lo)), draw()) }),
        toggle("A vsebuje levo krajišče", loC, (v) => ((loC = v), draw())),
        toggle("A vsebuje desno krajišče", hiC, (v) => ((hiC = v), draw())),
        slider({ label: "B od", min: -8, max: 8, value: lo2, onInput: (v) => ((lo2 = v), (hi2 = Math.max(hi2, lo2)), draw()) }),
        slider({ label: "B do", min: -8, max: 8, value: hi2, onInput: (v) => ((hi2 = Math.max(v, lo2)), draw()) }),
        segmented({ options: ["∩", "∪"], value: op, onChange: (v) => ((op = v), draw()) }),
      ];
  layout(el, {
    stage: [svg],
    controls: ctl,
    out,
    tryText: mode === "neenacba" ? "Nastavi a = −2. Kaj se zgodi z rešitvijo? Preveri s preizkusnim x, da se je znak res moral obrniti." : "Kdaj je presek prazna množica? Kdaj je unija en sam interval?",
  });
  draw();
}

// ------------------------------------------------------------ algebrske ploščice
export function ploscice(el, { mode = "izrazi" } = {}) {
  const svg = svgBox(340, 240);
  const out = readout();
  const cnt = { x2: 1, x: 3, one: -2 };
  let p = 2, q = 3, xs = 2.5;
  const ctl = h("div", { class: "demo-controls" });
  const build = () => {
    ctl.replaceChildren();
    if (mode === "izrazi") {
      const row = (k, t) => buttons(button(`+ ${t}`, () => ((cnt[k] = clamp(cnt[k] + 1, -6, 6)), draw())), button(`− ${t}`, () => ((cnt[k] = clamp(cnt[k] - 1, -6, 6)), draw())));
      ctl.append(row("x2", "x²"), row("x", "x"), row("one", "1"), slider({ label: "x =", min: -3, max: 4, step: 0.5, value: xs, onInput: (v) => ((xs = v), draw()) }));
    } else
      ctl.append(
        slider({ label: "p", min: 1, max: 5, value: p, onInput: (v) => ((p = v), draw()) }),
        slider({ label: "q", min: 1, max: 5, value: q, onInput: (v) => ((q = v), draw()) }),
      );
    draw();
  };
  const draw = () => {
    svg.replaceChildren();
    if (mode === "izrazi") {
      // 1 = 18 px; dolžina palice x je res x enic (pri x < 0 je palica "obrnjena", rdeča).
      const U = 18, X = Math.max(2, Math.abs(xs) * U), sx = xs < 0 ? -1 : 1;
      // vrsta ploščic; vrne y za naslednjo vrsto
      const put = (n, w, hgt, t, y, sg = 1) => {
        let x0 = 10;
        for (let i = 0; i < Math.abs(n); i++) {
          if (x0 + w > 330) (x0 = 10), (y += hgt + 6);
          s("rect", { x: x0, y, width: w, height: hgt, rx: Math.min(3, w / 2), class: `algtile ${n * sg < 0 ? "neg" : "pos"}` }, svg);
          if (w >= 10 && hgt >= 10) label(svg, x0 + w / 2, y + hgt / 2, (n < 0 ? "−" : "") + t, "lbl small");
          x0 += w + 5;
        }
        return n ? y + hgt + 10 : y;
      };
      let y = put(cnt.x2, X, X, "x²", 10);
      y = put(cnt.x, U, X, "x", y, sx);
      y = put(cnt.one, U, U, "1", y);
      const Hh = Math.max(240, y + 20);
      svg.setAttribute("viewBox", `0 0 340 ${Hh}`);
      label(svg, 330, Hh - 8, `merilo: 1 = ${U} px, x = ${fmt(xs, 1)}`, "tick small", "end");
      const terms = [];
      if (cnt.x2) terms.push(`${cnt.x2 === 1 ? "" : cnt.x2 === -1 ? "-" : cnt.x2}x^2`);
      if (cnt.x) terms.push(`${cnt.x === 1 ? "" : cnt.x === -1 ? "-" : cnt.x}x`);
      if (cnt.one) terms.push(`${cnt.one}`);
      const expr = terms.join(" + ").replace(/\+ -/g, "- ") || "0";
      const v = cnt.x2 * xs * xs + cnt.x * xs + cnt.one;
      out.innerHTML = texBlock(expr) +
        `<p>Združujemo samo <b>podobne člene</b>: kvadrate s kvadrati, palice s palicami, enice z enicami. Ploščica in nasprotna ploščica (rdeča) se izničita.</p>
         <p>Vrednost izraza pri x = ${fmt(xs, 1)}: ${tex(expr.replace(/x/g, `(${tfmt(xs, 1)})`).replace(/\)\^2/g, ")^2") + ` = ${tfmt(v, 2)}`)}</p>`;
    } else {
      svg.setAttribute("viewBox", "0 0 340 240");
      const U = 20, X = 70;
      const W = X + p * U, H = X + q * U;
      const ox = (340 - W) / 2, oy = 20;
      s("rect", { x: ox, y: oy, width: X, height: X, class: "algtile pos" }, svg);
      label(svg, ox + X / 2, oy + X / 2, "x²", "lbl");
      for (let i = 0; i < p; i++) { s("rect", { x: ox + X + i * U, y: oy, width: U, height: X, class: "algtile x" }, svg); label(svg, ox + X + i * U + U / 2, oy + X / 2, "x", "lbl small"); }
      for (let j = 0; j < q; j++) { s("rect", { x: ox, y: oy + X + j * U, width: X, height: U, class: "algtile x" }, svg); label(svg, ox + X / 2, oy + X + j * U + U / 2, "x", "lbl small"); }
      for (let i = 0; i < p; i++) for (let j = 0; j < q; j++) s("rect", { x: ox + X + i * U, y: oy + X + j * U, width: U, height: U, class: "algtile one" }, svg);
      label(svg, ox + W / 2, oy + H + 14, `x + ${p}`, "lbl");
      label(svg, ox - 24, oy + H / 2, `x + ${q}`, "lbl");
      out.innerHTML = texBlock(`x^2 + ${p + q}x + ${p * q} = (x + ${p})(x + ${q})`) +
        `<p>Ploščice x², ${p + q}× x in ${p * q}× 1 zložimo v pravokotnik. Njegovi stranici sta faktorja: (x + ${p}) in (x + ${q}).</p>
         <p class="muted">Pravilo: iščemo števili, katerih <b>vsota</b> je ${p + q} (koeficient pri x) in <b>produkt</b> ${p * q} (prosti člen).${p === q ? ` Ker sta enaki, je to popolni kvadrat (x + ${p})².` : ""}</p>`;
    }
  };
  layout(el, {
    stage: [h("div", { class: "demo-seg-wrap" }, segmented({ options: [["izrazi", "Podobni členi"], ["razstavi", "Razstavljanje"]], value: mode, onChange: (v) => ((mode = v), build()) })), svg],
    controls: ctl,
    out,
    tryText: mode === "izrazi" ? "Sestavi 2x² − x + 3. Nato dodaj +x: kaj se zgodi z −x?" : "Ali lahko pravokotnik zložiš tudi iz x² + 5x + 5? Zakaj ne?",
  });
  build();
}

// ------------------------------------------------------------ ploščinski model (distributivnost, (a+b)(c+d))
export function povrsinski(el, { mode = "stevila" } = {}) {
  const svg = svgBox(340, 250);
  const out = readout();
  let a = 23, b = 14, p = 3, q = 2, xv = 4, n = 13;
  const ctl = h("div", { class: "demo-controls" });
  const build = () => {
    ctl.replaceChildren();
    if (mode === "stevila") ctl.append(slider({ label: "prvo število", min: 11, max: 49, value: a, onInput: (v) => ((a = v), draw()) }), slider({ label: "drugo število", min: 2, max: 29, value: b, onInput: (v) => ((b = v), draw()) }));
    else if (mode === "izrazi") ctl.append(slider({ label: "a", min: -4, max: 5, value: p, onInput: (v) => ((p = v), draw()) }), slider({ label: "b", min: -4, max: 5, value: q, onInput: (v) => ((q = v), draw()) }), slider({ label: "velikost x", min: 2, max: 8, value: xv, onInput: (v) => ((xv = v), draw()) }));
    else ctl.append(slider({ label: "število", min: 11, max: 39, value: n, onInput: (v) => ((n = v), draw()) }));
    draw();
  };
  const rect2 = (cols, rows, names) => {
    // cols, rows: [[dolžina, napis], …]; merilo je stalno (za največji vnos), da je večji zmnožek res večji pravokotnik
    const [Wm, Hm] = { stevila: [49, 29], kvadrat: [39, 39], izrazi: [13, 13] }[mode];
    const sc = Math.min(260 / Wm, 190 / Hm);
    const ox = 50, oy = 30;
    let x = ox;
    cols.forEach(([cw, ct], i) => {
      let y = oy;
      rows.forEach(([rh, rtx], j) => {
        const negc = cw * rh < 0;
        s("rect", { x, y, width: Math.abs(cw) * sc, height: Math.abs(rh) * sc, class: `bar ${negc ? "fill-danger-soft" : ["fill-a", "fill-b", "fill-c", "fill-soft"][(i + 2 * j) % 4]}` }, svg);
        label(svg, x + (Math.abs(cw) * sc) / 2, y + (Math.abs(rh) * sc) / 2, names(i, j), "lbl small");
        y += Math.abs(rh) * sc;
      });
      label(svg, x + (Math.abs(cw) * sc) / 2, oy - 12, ct, "lbl");
      x += Math.abs(cw) * sc;
    });
    let y = oy;
    rows.forEach(([rh, rtx]) => {
      label(svg, ox - 18, y + (Math.abs(rh) * sc) / 2, rtx, "lbl");
      y += Math.abs(rh) * sc;
    });
  };
  const draw = () => {
    svg.replaceChildren();
    if (mode === "stevila") {
      const t = Math.floor(a / 10) * 10, u = a % 10, t2 = Math.floor(b / 10) * 10, u2 = b % 10;
      const cols = [[t, String(t)], ...(u ? [[u, String(u)]] : [])], rows = [...(t2 ? [[t2, String(t2)]] : []), ...(u2 ? [[u2, String(u2)]] : [])];
      rect2(cols, rows, (i, j) => String(cols[i][0] * rows[j][0]));
      const prods = rows.flatMap((r) => cols.map((c) => c[0] * r[0]));
      out.innerHTML = texBlock(`${a}\\cdot ${b} = (${cols.map((c) => c[0]).join(" + ")})\\cdot(${rows.map((r) => r[0]).join(" + ")}) = ${prods.join(" + ")} = ${a * b}`) +
        `<p><b>Distributivnost:</b> pravokotnik ${a} × ${b} razrežemo na manjše pravokotnike, ki jih znamo izračunati na pamet, in ploščine seštejemo.</p>
         <p class="muted">Komutativnost: ${a} · ${b} = ${b} · ${a} (pravokotnik obrnemo). Tako računamo tudi pisno množenje.</p>`;
    } else if (mode === "izrazi") {
      const cols = [[xv, "x"], [p, `${p}`]], rows = [[xv, "x"], [q, `${q}`]];
      rect2(cols, rows, (i, j) => [["x²", `${q}x`], [`${p}x`, `${p * q}`]][i][j]);
      out.innerHTML = texBlock(`(x ${p < 0 ? "-" : "+"} ${Math.abs(p)})(x ${q < 0 ? "-" : "+"} ${Math.abs(q)}) = x^2 ${q < 0 ? "-" : "+"} ${Math.abs(q)}x ${p < 0 ? "-" : "+"} ${Math.abs(p)}x ${p * q < 0 ? "-" : "+"} ${Math.abs(p * q)} = x^2 ${p + q < 0 ? "-" : "+"} ${Math.abs(p + q)}x ${p * q < 0 ? "-" : "+"} ${Math.abs(p * q)}`) +
        `<p>Vsak člen prvega oklepaja pomnožimo z vsakim členom drugega: dobimo 4 pravokotnike. Rdeči deli imajo negativno ploščino.</p>
         <p class="muted">Pri x = ${xv}: (${xv} ${p < 0 ? "−" : "+"} ${Math.abs(p)}) · (${xv} ${q < 0 ? "−" : "+"} ${Math.abs(q)}) = ${(xv + p) * (xv + q)} in ${xv}² + ${p + q} · ${xv} + ${p * q} = ${xv * xv + (p + q) * xv + p * q}.</p>`;
    } else {
      const t = Math.floor(n / 10) * 10, u = n % 10;
      const cols = [[t, String(t)], [u, String(u)]];
      rect2(cols, cols, (i, j) => String(cols[i][0] * cols[j][0]));
      out.innerHTML = texBlock(`${n}^2 = (${t} + ${u})^2 = ${t}^2 + 2\\cdot ${t}\\cdot ${u} + ${u}^2 = ${t * t} + ${2 * t * u} + ${u * u} = ${n * n}`) +
        `<p>Kvadrat s stranico ${n} razdelimo na kvadrat ${t} × ${t}, kvadrat ${u} × ${u} in <b>dva</b> enaka pravokotnika ${t} × ${u}.</p>
         <p class="muted">Pogosta napaka: (${t} + ${u})² ni ${t}² + ${u}² = ${t * t + u * u}. Manjkata pravokotnika.</p>`;
    }
  };
  layout(el, {
    stage: [h("div", { class: "demo-seg-wrap" }, segmented({ options: [["stevila", "Števila"], ["kvadrat", "Kvadrat"], ["izrazi", "Izrazi"]], value: mode, onChange: (v) => ((mode = v), build()) })), svg],
    controls: ctl,
    out,
    tryText: "Izračunaj 19 · 21 tako, da ga zapišeš kot (20 − 1)(20 + 1). Kaj opaziš?",
  });
  build();
}

// ------------------------------------------------------------ sistem dveh linearnih enačb
export function sistem(el) {
  const svg = svgBox(340, 340);
  const out = readout();
  let k1 = 1, n1 = 1, k2 = -0.5, n2 = 4;
  const draw = () => {
    svg.replaceChildren();
    const A = axes(svg, { W: 340, H: 340, x: [-8, 8], y: [-8, 8], xStep: 2, yStep: 2 });
    const line = (k, n, cls) => s("line", { x1: A.X(-8), y1: A.Y(-8 * k + n), x2: A.X(8), y2: A.Y(8 * k + n), class: `graph-line stroke-${cls}` }, svg);
    line(k1, n1, "a");
    line(k2, n2, "b");
    let msg;
    // kx + n brez koeficienta 1 (x, −x), brez 0x in brez + 0.
    const L = (k, n) => (k ? `${k === 1 ? "" : k === -1 ? "-" : tfmt(k, 1)}x${n ? ` ${n < 0 ? "-" : "+"} ${tfmt(Math.abs(n), 1)}` : ""}` : tfmt(n, 1));
    const E = (k, n) => `y = ${L(k, n)}`;
    if (k1 === k2) msg = n1 === n2 ? "<p>Premici sovpadata (enak k in enak n): sistem ima <b>neskončno rešitev</b>.</p>" : "<p>Premici sta vzporedni (enak k, različen n): sistem <b>nima rešitve</b>.</p>";
    else {
      const x = (n2 - n1) / (k1 - k2), y = k1 * x + n1;
      if (Math.abs(x) <= 8 && Math.abs(y) <= 8) s("circle", { cx: A.X(x), cy: A.Y(y), r: 7, class: "pt fill-c" }, svg);
      // Koordinate točno: k in n so večkratniki 0,5, zato x = P/Q in y = (2k₁P + 2n₁Q)/(2Q); tretjine ipd. kot ulomek, ne zaokroženo.
      const fr = (p, q) => { const g = gcd(p, q) || 1; [p, q] = [(q < 0 ? -p : p) / g, Math.abs(q) / g]; return q === 1 ? `${p}` : `${p < 0 ? "-" : ""}\\frac{${Math.abs(p)}}{${q}}`; };
      const P = 2 * (n2 - n1), Q = 2 * (k1 - k2);
      const dec = (v) => Math.abs(v * 100 - Math.round(v * 100)) < 1e-9;
      const exact = dec(x) && dec(y);
      const xT = exact ? tfmt(x) : fr(P, Q), yT = exact ? tfmt(y) : fr(2 * k1 * P + 2 * n1 * Q, 2 * Q);
      msg = `<p>Premici se sekata v točki <b>${exact ? `(${fmt(x, 2)}${Number.isInteger(x) && Number.isInteger(y) ? ", " : "; "}${fmt(y, 2)})` : tex(`\\left(${xT}, ${yT}\\right)`)}</b>: to je edina rešitev sistema, ker leži na obeh premicah.</p>
        ${texBlock(`${L(k1, n1)} = ${L(k2, n2)} \\Rightarrow x = ${xT}`)}`;
    }
    out.innerHTML = `<p><span class="dot dot-a"></span> ${tex(E(k1, n1))} &nbsp; <span class="dot dot-b"></span> ${tex(E(k2, n2))}</p>${msg}
      <p class="muted">Grafično reševanje: narišemo obe premici in odčitamo presečišče. Računsko: metoda zamenjave ali nasprotnih koeficientov.</p>`;
  };
  layout(el, {
    stage: [svg],
    controls: [
      slider({ label: "k₁", min: -3, max: 3, step: 0.5, value: k1, onInput: (v) => ((k1 = v), draw()) }),
      slider({ label: "n₁", min: -6, max: 6, step: 0.5, value: n1, onInput: (v) => ((n1 = v), draw()) }),
      slider({ label: "k₂", min: -3, max: 3, step: 0.5, value: k2, onInput: (v) => ((k2 = v), draw()) }),
      slider({ label: "n₂", min: -6, max: 6, step: 0.5, value: n2, onInput: (v) => ((n2 = v), draw()) }),
    ],
    out,
    tryText: "Nastavi premici tako, da sistem nima rešitve. Kaj morata imeti enako?",
  });
  draw();
}

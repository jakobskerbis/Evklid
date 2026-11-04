// Interaktivna skica v kartici formul (j, 1. 11. 2026, /mnt/project-files/evklid/skice/naloga-skice-j-2026-11-01.md).
// Zgradba: temen okvir s skico (SVG) → čipi s sprotnimi vrednostmi → kontrole → siva vrstica z navodilom.
// Barve (enake v skici, čipu in drsniku): glavna (bela, krivulja in liki), ploskev (modro-vijolična,
// ploščine in glavne vrednosti), izbor (rumena, izbrani element in višine), druga (zelena, druga krivulja,
// polmeri, odkloni), napaka (rdeča). Vlečne točke, drsniki in segmentni gumbi so iz public/sim/kit.js.
import { s, h, svgBox, slider, segmented, draggable, fmt } from "../sim/kit.js";

export const BARVE = ["glavna", "ploskev", "izbor", "druga", "napaka"];

// Oznake čipov se ob vlečenju ne spreminjajo: KaTeX vsako izriše enkrat.
const texCache = new Map();
const tex = (t) => {
  if (texCache.has(t)) return texCache.get(t);
  try {
    if (!globalThis.katex) return t;
    const html = globalThis.katex.renderToString(t, { throwOnError: false, strict: "ignore" });
    texCache.set(t, html);
    return html;
  } catch {
    return t;
  }
};

/**
 * Nova skica. w, h: velikost risbe v enotah SVG; navodilo: siva vrstica na koncu.
 * Vrne { el, svg, plast(ime), cipi(seznam), drsnik(opts), stevec(opts), gumbi(opts), tocka(opts) }.
 */
export function skica({ w = 320, h: hgt = 220, navodilo = "", oznaka = "Interaktivna skica" } = {}) {
  const svg = svgBox(w, hgt, "sk-svg");
  svg.setAttribute("aria-label", oznaka);
  // Čipi niso aria-live: ob vlečenju bi se bralnik zaslona oglašal ob vsakem premiku.
  const cipiEl = h("div", { class: "sk-chips" });
  const kontrole = h("div", { class: "sk-ctl" });
  const el = h("div", { class: "sk" }, h("div", { class: "sk-frame" }, svg), cipiEl, kontrole, navodilo ? h("p", { class: "sk-hint" }, navodilo) : null);
  const plasti = {};
  return {
    el,
    svg,
    // Plast se ob vsakem izrisu izprazni (risba nad njo ostane: mreža, osi).
    plast(ime) {
      const g = plasti[ime] || (plasti[ime] = s("g", { class: `sk-l-${ime}` }, svg));
      g.replaceChildren();
      return g;
    },
    // [{ barva, oznaka (TeX), vrednost (besedilo z decimalno vejico) }]
    cipi(seznam) {
      cipiEl.replaceChildren(
        ...seznam.map((c) =>
          h("span", { class: `sk-chip sk-${c.barva || "glavna"}` }, h("i", { class: "sk-dot", "aria-hidden": "true" }), h("span", { class: "sk-tex", html: tex(c.oznaka) }), c.vrednost ? h("b", { class: "sk-val" }, c.vrednost) : null),
        ),
      );
    },
    drsnik({ barva = "ploskev", ...opts }) {
      const sl = slider(opts);
      sl.classList.add("sk-slider", `sk-${barva}`);
      const fill = () => {
        const i = sl.input;
        sl.style.setProperty("--sk-p", `${((Number(i.value) - Number(i.min)) / (Number(i.max) - Number(i.min))) * 100}%`);
      };
      sl.input.addEventListener("input", fill);
      const set = sl.set;
      sl.set = (v, silent) => (set(v, silent), fill());
      fill();
      kontrole.append(sl);
      return sl;
    },
    // Gumba − / + za celo število (npr. moč množice). set(v, tiho), get(), meje(min, max).
    stevec({ label, min = 0, max = 10, value = 0, barva = "ploskev", onInput }) {
      let v = value, lo = min, hi = max;
      const out = h("output", { "aria-live": "polite" });
      const btn = (znak, d, opis) => h("button", { type: "button", class: "sk-step-btn", "aria-label": `${label}: ${opis}`, onclick: () => set(v + d) }, znak);
      const minus = btn("−", -1, "manj"), plus = btn("+", 1, "več");
      const el = h("div", { class: `sk-stepper sk-${barva}`, role: "group", "aria-label": label }, h("span", { class: "sk-step-label" }, label), minus, out, plus);
      function set(n, tiho) {
        v = Math.min(hi, Math.max(lo, Math.round(n)));
        out.textContent = fmt(v, 0);
        minus.disabled = v <= lo;
        plus.disabled = v >= hi;
        if (!tiho) onInput?.(v);
      }
      el.set = set;
      el.get = () => v;
      el.meje = (a, b) => ((lo = a), (hi = b), set(v, true));
      set(v, true);
      kontrole.append(el);
      return el;
    },
    gumbi({ label, ...opts }) {
      const g = segmented(opts);
      if (label) g.setAttribute("aria-label", label);
      g.classList.add("sk-seg");
      kontrole.append(g);
      return g;
    },
    // Vlečna točka: moder krog s prosojnim obročem. onMove(x, y) v enotah SVG; korak: pripenjanje na mrežo.
    tocka({ x, y, onMove, label = "Vlečna točka", korak = 0, merilo = 1, izhodisce = [0, 0] }) {
      const g = s("g", { class: "sk-pt" }, svg);
      s("circle", { r: 23, class: "sk-hit" }, g);
      s("circle", { r: 11, class: "sk-ring" }, g);
      s("circle", { r: 6, class: "sk-core" }, g);
      g.move = (px, py) => g.setAttribute("transform", `translate(${px},${py})`);
      g.move(x, y);
      const snap = (v, o) => (korak ? o + Math.round((v - o) / (korak * merilo)) * korak * merilo : v);
      draggable(svg, g, (px, py) => onMove(snap(px, izhodisce[0]), snap(py, izhodisce[1])), { label });
      return g;
    },
  };
}

// Število za čip: decimalna vejica, znak minus (−).
export const st = (x, d = 2) => fmt(x, d);

// Svg pomočniki za skice.
export const crta = (g, x1, y1, x2, y2, barva = "glavna", extra = {}) => s("line", { x1, y1, x2, y2, class: `sk-s-${barva}`, ...extra }, g);
export const napis = (g, x, y, besedilo, barva = "glavna", extra = {}) => s("text", { x, y, class: `sk-t sk-t-${barva}`, ...extra }, g, besedilo);
// Pokončno število ob osi (številska premica, mreža).
export const stevilka = (g, x, y, besedilo, extra = {}) => s("text", { x, y, class: "sk-n", "text-anchor": "middle", ...extra }, g, besedilo);
// Enolična imena za <mask>/<clipPath> (na strani je lahko več skic).
let idN = 0;
export const novId = (ime) => `sk-${ime}-${++idN}`;

// Večkratnik π kot besedilo: piZapis(Math.PI / 4) = »π/4«, piZapis(-Math.PI) = »−π«; ni večkratnik → null.
export function piZapis(v, imenovalec = 12) {
  const k = Math.round((v / Math.PI) * imenovalec);
  if (Math.abs(k * Math.PI / imenovalec - v) > 1e-9) return null;
  if (k === 0) return "0";
  const g = (a, b) => (b ? g(b, a % b) : a);
  const d = g(Math.abs(k), imenovalec), st_ = Math.abs(k) / d, im = imenovalec / d;
  return `${k < 0 ? "−" : ""}${st_ === 1 ? "" : st_}π${im === 1 ? "" : `/${im}`}`;
}

// Koordinatni sistem v skici: mreža, osi in oznake (xOznake/yOznake: [[vrednost, besedilo]]).
// Vrne preslikavo { X, Y, inv, x0, x1, y0, y1, L, R, T, B, izrez } (izrez: url za clip-path risbe).
export function osi(svg, { W, H, x: [x0, x1], y: [y0, y1], rob = 12, xOznake = [], yOznake = [], mreza = true }) {
  const L = rob, R = W - rob, T = rob, B = H - rob;
  const X = (x) => L + ((x - x0) / (x1 - x0)) * (R - L);
  const Y = (y) => B - ((y - y0) / (y1 - y0)) * (B - T);
  const inv = (px, py) => [x0 + ((px - L) / (R - L)) * (x1 - x0), y0 + ((B - py) / (B - T)) * (y1 - y0)];
  const g = s("g", {}, svg);
  const id = novId("izrez");
  s("rect", { x: L, y: T, width: R - L, height: B - T }, s("clipPath", { id }, s("defs", {}, g)));
  if (mreza) {
    for (const [v] of xOznake) s("line", { x1: X(v), y1: T, x2: X(v), y2: B, class: "sk-grid" }, g);
    for (const [v] of yOznake) s("line", { x1: L, y1: Y(v), x2: R, y2: Y(v), class: "sk-grid" }, g);
  }
  const ax = Y(Math.min(y1, Math.max(y0, 0))), ay = X(Math.min(x1, Math.max(x0, 0)));
  s("line", { x1: L - 4, y1: ax, x2: R + 4, y2: ax, class: "sk-s-glavna sk-thin" }, g);
  s("line", { x1: ay, y1: B + 4, x2: ay, y2: T - 4, class: "sk-s-glavna sk-thin" }, g);
  for (const [v, t] of xOznake) if (t) stevilka(g, X(v), Math.min(B + 2, ax + 14), t);
  for (const [v, t] of yOznake) if (t) stevilka(g, ay - 5, Y(v) + 4, t, { "text-anchor": "end" });
  return { X, Y, inv, x0, x1, y0, y1, L, R, T, B, izrez: `url(#${id})` };
}

// Točka ali par števil: pri decimalni vejici loči podpičje, npr. »(4; 3,5)«, sicer »(4, 3)«.
export const par = (x, y, d = 2) => {
  const t = [x, y].map((v) => st(v, d));
  return `(${t.join(t.some((v) => v.includes(",")) ? "; " : ", ")})`;
};
// Število z »≈«, kadar je zaokroženo na d decimalk, sicer brez.
export const vr = (v, d = 2) => (Math.abs(v - Number(v.toFixed(d))) < 1e-9 ? st(v, d) : `≈ ${st(v, d)}`);

// Lok kota v oglišču V med krakoma proti P in Q (enote SVG, krajši lok). Vrne (razdalja) → točka na simetrali kota za oznako.
export function lokKota(g, V, P, Q, r, barva = "glavna", extra = {}) {
  const a1 = Math.atan2(P[1] - V[1], P[0] - V[0]);
  let d = Math.atan2(Q[1] - V[1], Q[0] - V[0]) - a1;
  while (d <= -Math.PI) d += 2 * Math.PI;
  while (d > Math.PI) d -= 2 * Math.PI;
  const z = [V[0] + r * Math.cos(a1), V[1] + r * Math.sin(a1)], k = [V[0] + r * Math.cos(a1 + d), V[1] + r * Math.sin(a1 + d)];
  s("path", { d: `M${z} A${r},${r} 0 0 ${d > 0 ? 1 : 0} ${k}`, class: `sk-s-${barva} sk-thin`, ...extra }, g);
  const m = a1 + d / 2;
  return (rr) => [V[0] + rr * Math.cos(m), V[1] + rr * Math.sin(m)];
}

// Oznaka pravega kota v oglišču V (kraka proti P in Q), kvadratek s stranico k.
export function praviKot(g, V, P, Q, k = 9, barva = "glavna") {
  const e = (T) => {
    const l = Math.hypot(T[0] - V[0], T[1] - V[1]) || 1;
    return [(T[0] - V[0]) / l, (T[1] - V[1]) / l];
  };
  const u = e(P), w = e(Q);
  const p1 = [V[0] + k * u[0], V[1] + k * u[1]], p2 = [p1[0] + k * w[0], p1[1] + k * w[1]], p3 = [V[0] + k * w[0], V[1] + k * w[1]];
  s("path", { d: `M${p1} L${p2} L${p3}`, class: `sk-s-${barva} sk-thin` }, g);
}

// Seznam vrednosti za čip, npr. »7,5; ≈ 6,4; 5«: »≈« pred vsako zaokroženo vrednostjo.
export const seznam = (vs, d = 2, enota = "") => vs.map((v) => vr(v, d) + enota).join("; ");

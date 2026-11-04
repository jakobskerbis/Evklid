// Interaktivna skica v kartici formul (j, 1. 11. 2026, /mnt/project-files/evklid/skice/naloga-skice-j-2026-11-01.md).
// Zgradba: temen okvir s skico (SVG) → čipi s sprotnimi vrednostmi → kontrole → siva vrstica z navodilom.
// Barve (enake v skici, čipu in drsniku): glavna (bela, krivulja in liki), ploskev (modro-vijolična,
// ploščine in glavne vrednosti), izbor (rumena, izbrani element in višine), druga (zelena, druga krivulja,
// polmeri, odkloni), napaka (rdeča). Vlečne točke, drsniki in segmentni gumbi so iz public/sim/kit.js.
import { s, h, svgBox, slider, segmented, draggable, fmt } from "../sim/kit.js";

export const BARVE = ["glavna", "ploskev", "izbor", "druga", "napaka"];

const tex = (t) => {
  try {
    return globalThis.katex ? globalThis.katex.renderToString(t, { throwOnError: false, strict: "ignore" }) : t;
  } catch {
    return t;
  }
};

/**
 * Nova skica. w, h: velikost risbe v enotah SVG; navodilo: siva vrstica na koncu.
 * Vrne { el, svg, plast(ime), cipi(seznam), drsnik(opts), gumbi(opts), tocka(opts) }.
 */
export function skica({ w = 320, h: hgt = 220, navodilo = "", oznaka = "Interaktivna skica" } = {}) {
  const svg = svgBox(w, hgt, "sk-svg");
  svg.setAttribute("aria-label", oznaka);
  const cipiEl = h("div", { class: "sk-chips", "aria-live": "polite" });
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
          h("span", { class: `sk-chip sk-${c.barva || "glavna"}` }, h("i", { class: "sk-dot", "aria-hidden": "true" }), h("span", { class: "sk-tex", html: tex(c.oznaka) }), h("b", { class: "sk-val" }, c.vrednost)),
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
    gumbi(opts) {
      const g = segmented(opts);
      g.classList.add("sk-seg");
      kontrole.append(g);
      return g;
    },
    // Vlečna točka: moder krog s prosojnim obročem. onMove(x, y) v enotah SVG; korak: pripenjanje na mrežo.
    tocka({ x, y, onMove, label = "Vlečna točka", korak = 0, merilo = 1, izhodisce = [0, 0] }) {
      const g = s("g", { class: "sk-pt" }, svg);
      s("circle", { r: 18, class: "sk-hit" }, g);
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

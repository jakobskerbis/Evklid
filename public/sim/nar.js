// Razvrščanje s takojšnjo razlago pri naravoslovju (OŠ 6. in 7. razred) in biologiji.
// Učenec vidi kartico (organ, organizem, pojav …) in izbere skupino; po izbiri dobi razlago,
// napačne kartice pridejo na vrsto še enkrat na koncu kroga.
import { h, s, svgBox, button, buttons, readout, layout, label } from "./kit.js";
import { SETS as NAR } from "./nar-data.js";
import { SETS as BIO } from "./bio-data.js";

const SETS = { ...NAR, ...BIO };

function sortSim(el, set) {
  const out = readout();
  const def = SETS[set] || SETS.celica;
  const svg = svgBox(340, 130);
  const shuffle = (a) => a.map((x) => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map((p) => p[1]);
  let queue = shuffle(def.items.map((_, i) => i)), again = new Set(), right = 0, total = 0, answered = false, cur = null;
  const catName = (k) => def.cats.find((c) => c[0] === k)[1];
  const draw = () => {
    svg.replaceChildren();
    s("rect", { x: 10, y: 10, width: 320, height: 110, rx: 14, class: "box" }, svg);
    const words = def.items[cur][0].split(" ");
    const lines = [];
    words.forEach((w) => (lines.length && (lines.at(-1) + " " + w).length < 28 ? (lines[lines.length - 1] += " " + w) : lines.push(w)));
    lines.forEach((ln, i) => label(svg, 170, 68 + (i - (lines.length - 1) / 2) * 22, ln, "lbl big"));
  };
  const score = () => `<p class="muted">Pravilnih odgovorov: ${right} od ${total}.</p>`;
  const next = () => {
    if (!queue.length) {
      // Krog je končan: napačne kartice še enkrat, nato nov krog.
      queue = again.size ? shuffle([...again]) : shuffle(def.items.map((_, i) => i));
      again = new Set();
    }
    cur = queue.shift();
    answered = false;
    draw();
    out.innerHTML = `<p>${def.q}</p>${score()}`;
  };
  const pick = (k) => {
    if (answered) return;
    answered = true;
    total++;
    const [, ans, why] = def.items[cur];
    const ok = ans === k;
    if (ok) right++, place(k, def.items[cur][0]);
    else again.add(cur);
    out.innerHTML = `<p>${ok ? '<b class="ok-text">Pravilno!</b>' : `<b class="bad-text">Ne čisto.</b> Pravilno je: <b>${catName(ans)}</b>.`} ${why}</p>${score()}`;
  };
  // Carrollov diagram (def.grid): polja so gumbi v tabeli 2 × 2, pravilno uvrščene kartice ostanejo v svojem polju.
  const cellBtn = {}, placed = {};
  const place = (k, t) => {
    if (!cellBtn[k]) return;
    (placed[k] ||= new Set()).add(t);
    cellBtn[k].textContent = [...placed[k]].join(", ");
  };
  const grid = def.grid && h("table", { class: "demo-table sort-grid", style: "width:100%;table-layout:fixed" },
    h("tr", {}, h("th", {}), ...def.grid.cols.map((c) => h("th", { scope: "col" }, c))),
    ...def.grid.rows.map((r, i) => h("tr", {}, h("th", { scope: "row" }, r), ...def.grid.cells[i].map((k) => {
      const b = button("?", () => pick(k), "secondary");
      b.setAttribute("aria-label", catName(k));
      b.style.cssText = "width:100%;min-height:48px;white-space:normal";
      return h("td", {}, (cellBtn[k] = b));
    }))));
  next();
  layout(el, {
    stage: svg,
    controls: [grid || buttons(...def.cats.map(([k, t]) => button(t, () => pick(k), "secondary"))), buttons(button("Naslednja ▸", next, "primary small"))],
    out,
    tryText: def.razmisli ? { razmisli: def.razmisli } : def.try, // napis-poskusa.js
  });
}

export function uvrsti(el, { set = "celica" } = {}) {
  sortSim(el, set);
}

export const NAR_SETS = Object.keys(SETS);

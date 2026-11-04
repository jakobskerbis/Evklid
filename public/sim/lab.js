// Gradniki virtualnega laboratorija: zaslon merilnika, tabela meritev, graf, vprašanje o sklepu, dnevnik dogodkov.
// Modeli so v lab-model.js; tu je samo prikaz. Besedila so slovenska kot v ostalih simulacijah učbenika.
import { h, s, fmt, svgBox, axes, tex } from "./kit.js";
import SL from "../i18n/sl.js";

// Prevodi: public/i18n.js naložimo šele v brskalniku (preizkusi v Node uvozijo ta modul brez njega); do tedaj slovensko.
let t = (k, v = {}) => String(SL[k] ?? k).replace(/\{(\w+)\}/g, (_, n) => v[n] ?? "");
if (typeof document !== "undefined") import("../i18n.js").then((m) => (t = m.t)).catch(() => {});

// Ura, ki teče v realnem času in se ustavi, ko simulacije ni več na strani.
// Ne uporablja requestAnimationFrame, ker meritve tečejo tudi pri »manj gibanja« (ni animacije, le odčitki).
// »Ponastavi« (sim/index.js) zgradi simulacijo znova v istem elementu, zato se stara ura ustavi, ko se začne nova.
export function ticker(el, fn, ms = 100) {
  let last = performance.now();
  const gen = (el._labTick = (el._labTick || 0) + 1);
  const id = setInterval(() => {
    if (el._labTick !== gen || (el.dataset.mounted && !el.isConnected)) return clearInterval(id);
    if (el.isConnected) el.dataset.mounted = "1";
    const now = performance.now();
    fn(Math.min(0.25, (now - last) / 1000));
    last = now;
  }, ms);
  return () => clearInterval(id);
}

// Zaslon digitalnega merilnika (LCD). set(text, unit, note).
// Ni aria-live: zadnja števka niha večkrat na sekundo, bralnik zaslona bi jo bral brez konca.
// Zapisana meritev (tabela) in dogodki (dnevnik) so napovedani.
export function lcd(name, { cls = "" } = {}) {
  const val = h("span", { class: "lab-lcd-val" }, "–");
  const unit = h("span", { class: "lab-lcd-unit" });
  const note = h("span", { class: "lab-lcd-note" });
  const el = h("div", { class: `lab-lcd ${cls}`, role: "group", "aria-label": name }, h("span", { class: "lab-lcd-name" }, name), h("span", { class: "lab-lcd-screen" }, val, unit), note);
  el.set = (text, u = "", n = "") => {
    const t = String(text).replace(".", ",").replace("-", "−");
    if (val.textContent !== t) val.textContent = t;
    if (unit.textContent !== u) unit.textContent = u;
    if (note.textContent !== n) note.textContent = n;
    el.classList.toggle("off", text === "" || text == null);
  };
  return el;
}

// Tabela meritev. cols: [{ key, label }]. add(row) doda vrstico (vrednosti so že nizi za prikaz).
export function dataTable(cols, { empty = "Še ni meritev. Odčitaj merilnik in pritisni »Zapiši meritev«." } = {}) {
  const tbody = h("tbody");
  const table = h("table", { class: "demo-table lab-table" }, h("thead", {}, h("tr", {}, h("th", { scope: "col" }, "#"), ...cols.map((c) => h("th", { scope: "col", html: c.label })))), tbody);
  const none = h("p", { class: "muted lab-empty" }, empty);
  const el = h("div", { class: "lab-table-wrap" }, table, none);
  const rows = [];
  const draw = () => {
    tbody.replaceChildren(...rows.map((r, i) => h("tr", {}, h("td", {}, String(i + 1)), ...cols.map((c) => h("td", {}, r[c.key] ?? "")))));
    none.hidden = rows.length > 0;
    table.hidden = rows.length === 0;
  };
  // quiet: samodejni zapis (vsakih 30 s) premakne le okvir tabele, ne cele strani, da stran ne skače med delom.
  el.add = (r, { quiet = false } = {}) => (rows.push(r), draw(), quiet ? (el.scrollTop = el.scrollHeight) : el.querySelector("tbody tr:last-child")?.scrollIntoView?.({ block: "nearest" }));
  el.clear = () => ((rows.length = 0), draw());
  el.rows = rows;
  draw();
  return el;
}

// Graf meritev s stalnimi osmi. draw(series): [{ pts: [[x, y]], shape: "o" | "^", cls: "a", label, line?: f(x) }]
// origin: false postavi časovno os na spodnji rob (pri negativnih vrednostih, npr. Δm), da se oznake ne prekrivajo.
export function dataGraph({ W = 340, H = 220, x, y, xLabel, yLabel, xStep, yStep, title, origin = true }) {
  const svg = svgBox(W, H, "lab-graph");
  svg.setAttribute("aria-label", title || "Graf meritev");
  const wrap = h("figure", { class: "lab-graph-wrap" }, svg);
  // Legenda je hkrati vklop in izklop: vsaka vrsta meritev, njena premica in mreža (public/sim/prikaz.js za ostale grafe).
  const legend = h("figcaption", { class: "lab-legend", role: "group" });
  wrap.append(legend);
  let A = null, last = [];
  const off = new Set();
  wrap.setAxes = (ax) => Object.assign(opts, ax);
  const opts = { x, y };
  const chip = (key, sym, text) =>
    h("button", { type: "button", class: "lab-leg layer-chip", "data-layer": key, "aria-pressed": String(!off.has(key)), onclick: () => {
      off.has(key) ? off.delete(key) : off.add(key);
      wrap.draw(last);
      // draw legendo nariše znova: fokus ostane na istem gumbu (tipkovnica)
      [...legend.children].find((c) => c.dataset.layer === key)?.focus();
    } }, sym, text);
  wrap.draw = (series = []) => {
    last = series;
    svg.replaceChildren();
    A = axes(svg, { W, H, x: opts.x, y: opts.y, pad: 38, padT: 14, padR: 14, origin, xLabel, yLabel, xStep: opts.xStep ?? xStep, yStep: opts.yStep ?? yStep, grid: !off.has("grid") });
    const inside = ([px, py]) => px >= A.x0 && px <= A.x1 && py >= A.y0 && py <= A.y1;
    legend.replaceChildren();
    legend.setAttribute("aria-label", t("sim.layers"));
    series.forEach((S, i) => {
      const id = S.id ?? S.label ?? i;
      if (S.line && !off.has(`fit:${id}`)) {
        const n = 40, pts = [];
        for (let i = 0; i <= n; i++) {
          const xx = A.x0 + ((A.x1 - A.x0) * i) / n, yy = S.line(xx);
          if (yy >= A.y0 && yy <= A.y1) pts.push(`${A.X(xx).toFixed(1)},${A.Y(yy).toFixed(1)}`);
        }
        if (pts.length > 1) s("polyline", { points: pts.join(" "), class: `lab-fit stroke-${S.cls}` }, svg);
      }
      if (!off.has(`pt:${id}`))
        for (const p of S.pts) {
          if (!inside(p)) continue;
          const cx = A.X(p[0]), cy = A.Y(p[1]);
          if (S.shape === "^") s("path", { d: `M${cx},${cy - 6} L${cx + 5.5},${cy + 4} L${cx - 5.5},${cy + 4} Z`, class: `lab-pt fill-${S.cls}` }, svg);
          else s("circle", { cx, cy, r: 4.5, class: `lab-pt fill-${S.cls}` }, svg);
        }
      const clipped = S.pts.filter((p) => !inside(p)).length;
      if (!S.label) return;
      // Samo premica brez točk (npr. izračunana vrednost): en gumb z imenom, brez praznega gumba za točke.
      if (S.line && !S.pts.length) return legend.append(chip(`fit:${id}`, h("i", { class: `lab-sym line bg-${S.cls}`, "aria-hidden": "true" }), S.label));
      legend.append(chip(`pt:${id}`, h("i", { class: `lab-sym ${S.shape === "^" ? "tri" : "dot"} bg-${S.cls}`, "aria-hidden": "true" }), S.label + (clipped ? ` (${clipped} izven grafa)` : "")));
      if (S.line) legend.append(chip(`fit:${id}`, h("i", { class: `lab-sym line bg-${S.cls}`, "aria-hidden": "true" }), t("sim.layer.fit", { name: S.label })));
    });
    if (legend.children.length) legend.append(chip("grid", h("i", { class: "layer-sw sw-grid", "aria-hidden": "true" }), t("sim.layer.grid")));
  };
  wrap.draw();
  return wrap;
}

// Vprašanje o sklepu: ena pravilna možnost, pri vsaki razlaga.
// q = { text, options: [{ t, ok, why }] }
export function conclusion(q) {
  const why = h("p", { class: "lab-why", "aria-live": "polite", hidden: true });
  const opts = q.options.map((o, i) =>
    h("button", { type: "button", class: "lab-opt", "data-i": i, onclick: (ev) => pick(ev.currentTarget, o) }, h("span", { html: o.t })),
  );
  const pick = (b, o) => {
    b.classList.add(o.ok ? "ok" : "bad");
    b.setAttribute("aria-pressed", "true");
    why.hidden = false;
    why.className = `lab-why ${o.ok ? "ok" : "bad"}`;
    why.innerHTML = `<b>${o.ok ? "Pravilno." : "Ne čisto."}</b> ${o.why}`;
  };
  return h("section", { class: "lab-q" }, h("h4", {}, "Sklep"), h("p", { class: "lab-q-text", html: q.text }), h("div", { class: "lab-opts" }, ...opts), why);
}

// Dnevnik dogodkov (kaj se je zgodilo v laboratoriju), najnovejši zgoraj.
export function eventLog() {
  const ul = h("ul", { class: "lab-log", "aria-live": "polite" });
  ul.push = (text, kind = "info") => {
    ul.prepend(h("li", { class: `lab-ev ${kind}`, html: text }));
    while (ul.children.length > 5) ul.lastChild.remove();
  };
  return ul;
}

// Zložljiv seznam poenostavitev in virov.
export function notes(items, sources) {
  return h(
    "details",
    { class: "lab-notes" },
    h("summary", {}, "Kaj je poenostavljeno in od kod so podatki?"),
    h("ul", {}, ...items.map((t) => h("li", {}, t))),
    sources ? h("p", { class: "muted", html: sources }) : null,
  );
}

export const num = (x, d) => fmt(x, d);
// Število z vedno enakim številom decimalk (kot ga pokaže merilnik): 6,00 in ne 6.
export const fixed = (x, d) => {
  const t = (Math.abs(x) < 0.5 * 10 ** -d ? 0 : x).toFixed(d);
  return t.replace(".", ",").replace("-", "−");
};
export { tex };

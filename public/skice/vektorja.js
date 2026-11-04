// Pravila za računanje z vektorji: konca vektorjev a⃗ in b⃗ iz O se vlečeta po mreži (korak 0,5);
// paralelogram, vsota a⃗ + b⃗ (rumena), razlika a⃗ − b⃗ (zelena, od konca b⃗ do konca a⃗) in kot φ.
import { skica, st, crta, napis, osi, novId } from "./skica.js";
import { s } from "../sim/kit.js";

export const MEJA = 4;

export function vektorja([a1, a2], [b1, b2]) {
  const la = Math.hypot(a1, a2), lb = Math.hypot(b1, b2);
  const skalarni = a1 * b1 + a2 * b2;
  const fi = la && lb ? (Math.acos(Math.max(-1, Math.min(1, skalarni / (la * lb)))) * 180) / Math.PI : null;
  return { la, lb, skalarni, fi, vsota: [a1 + b1, a2 + b2], razlika: [a1 - b1, a2 - b2] };
}

const tocno = (v) => Math.abs(v - Number(v.toFixed(2))) < 1e-9;
const koren = (v2, v) => `√${st(v2, 2)} ${tocno(v) ? "=" : "≈"} ${st(v, 2)}`;
const okl = (v) => (v < 0 ? `(${st(v, 1)})` : st(v, 1));

export default function narisi(host) {
  const W = 300, H = 260;
  const S = skica({ w: W, h: H, navodilo: "Povleci konca vektorjev a in b.", oznaka: "Vektorja, njuna vsota in razlika" });
  const oz4 = [-4, -2, 2, 4].map((k) => [k, st(k, 0)]);
  const Ax = osi(S.svg, { W, H, x: [-5, 5.35], y: [-4.5, 4.5], rob: 6, xOznake: oz4, yOznake: oz4 });
  const mid = novId("v");
  s("defs", {}, S.svg).innerHTML = ["ploskev", "glavna", "izbor", "druga"]
    .map((b) => `<marker id="${mid}-${b}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="sk-fill sk-fill-${b}"/></marker>`)
    .join("");
  let a = [3, 1], b = [1, 2.5];
  const P = (v) => [Ax.X(v[0]), Ax.Y(v[1])];
  const pusica = (g, od, do_, barva, w = 2.5) => crta(g, ...P(od), ...P(do_), barva, { "stroke-width": w, "marker-end": `url(#${mid}-${barva})` });
  let ta, tb;

  function izris() {
    const q = vektorja(a, b);
    const g = S.plast("v");
    s("polygon", { points: [[0, 0], a, q.vsota, b].map((v) => P(v).join(",")).join(" "), class: "sk-f-ploskev", opacity: 0.6 }, g);
    crta(g, ...P(a), ...P(q.vsota), "glavna", { class: "sk-s-glavna sk-thin sk-dash sk-faint" });
    crta(g, ...P(b), ...P(q.vsota), "glavna", { class: "sk-s-glavna sk-thin sk-dash sk-faint" });
    if (q.fi !== null) {
      const r = 18, ua = Math.atan2(a[1], a[0]), ub = Math.atan2(b[1], b[0]);
      let d = ub - ua;
      while (d > Math.PI) d -= 2 * Math.PI;
      while (d < -Math.PI) d += 2 * Math.PI;
      const O = P([0, 0]), e1 = [O[0] + r * Math.cos(ua), O[1] - r * Math.sin(ua)], e2 = [O[0] + r * Math.cos(ub), O[1] - r * Math.sin(ub)];
      s("path", { d: `M${e1} A${r},${r} 0 0 ${d > 0 ? 0 : 1} ${e2}`, class: "sk-s-glavna sk-thin" }, g);
      const um = ua + d / 2;
      napis(g, O[0] + 30 * Math.cos(um), O[1] - 30 * Math.sin(um) + 4, "φ", "glavna", { "text-anchor": "middle", style: "font-size: 12px" });
    }
    if (Math.hypot(...q.vsota) > 0.3) pusica(g, [0, 0], q.vsota, "izbor");
    if (Math.hypot(...q.razlika) > 0.3) pusica(g, b, a, "druga");
    if (q.la > 0.3) pusica(g, [0, 0], a, "ploskev", 3);
    if (q.lb > 0.3) pusica(g, [0, 0], b, "glavna", 3);
    const oz = (v, t, barva) => {
      const [x, y] = P(v), d = Math.hypot(v[0], v[1]) || 1;
      napis(g, Math.min(W - 10, Math.max(10, x + (v[0] / d) * 16)), Math.min(H - 6, Math.max(14, y - (v[1] / d) * 16 + 4)), t, barva, { "text-anchor": "middle" });
    };
    // Brez znaka U+20D7: pisava ga v SVG ne izriše; barva pove, kateri vektor je.
    oz(a, "a", "ploskev");
    oz(b, "b", "glavna");
    for (const [t, v] of [[ta, a], [tb, b]])
      if (t) {
        t.move(...P(v));
        if (S.svg.lastChild !== t) S.svg.append(t);
      }
    S.cipi([
      { barva: "ploskev", oznaka: "|\\vec{a}|", vrednost: koren(q.la ** 2, q.la) },
      { barva: "glavna", oznaka: "|\\vec{b}|", vrednost: koren(q.lb ** 2, q.lb) },
      { barva: "glavna", oznaka: "\\vec{a} \\cdot \\vec{b}", vrednost: `${okl(a[0])}·${okl(b[0])} + ${okl(a[1])}·${okl(b[1])} = ${st(q.skalarni, 2)}` },
      { barva: "glavna", oznaka: "\\varphi", vrednost: q.fi === null ? "ni določen" : `${tocno(q.fi) ? "" : "≈ "}${st(q.fi, 1)}°` },
      { barva: "izbor", oznaka: "\\vec{a} + \\vec{b}", vrednost: `(${st(q.vsota[0], 1)}, ${st(q.vsota[1], 1)})` },
      { barva: "druga", oznaka: "\\vec{a} - \\vec{b}", vrednost: `(${st(q.razlika[0], 1)}, ${st(q.razlika[1], 1)})` },
    ]);
  }
  izris();
  const vlek = (kateri) => (x, y) => {
    const [vx, vy] = Ax.inv(x, y);
    const v = [Math.max(-MEJA, Math.min(MEJA, Math.round(vx * 2) / 2)), Math.max(-MEJA, Math.min(MEJA, Math.round(vy * 2) / 2))];
    if (kateri === "a") a = v;
    else b = v;
    izris();
  };
  ta = S.tocka({ x: P(a)[0], y: P(a)[1], label: "Konec vektorja a: premikaj ga po mreži", onMove: vlek("a") });
  tb = S.tocka({ x: P(b)[0], y: P(b)[1], label: "Konec vektorja b: premikaj ga po mreži", onMove: vlek("b") });
  izris();
  host.append(S.el);
}

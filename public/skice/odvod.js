// Definicija odvoda (SŠ kartica Odvodi, faks kartica Definicija): f(x) = x²/2, točka x₀ se vleče po grafu,
// drsnik Δx (na faksu h, brez 0). Sekanta (rumena) skozi x₀ in x₀ + Δx, tangenta (zelena) v x₀, trikotnik Δx, Δf.
// Ko gre Δx proti 0, se Δf/Δx približa f′(x₀).
import { st, crta, napis, vr } from "./skica.js";
import { s, fnPath } from "../sim/kit.js";
import { f, odvod, brezNic, okvir, omejiX0 } from "./analiza.js";

// crka: »Δx« na listu za SŠ (kartica ima Δx, h je tam širina trapeza), »h« na listu za faks (kot v definiciji).
export default function narisi(host, crka = "Δx") {
  const T = crka === "h" ? "h" : "\\Delta x";
  const { S, A } = okvir(`Povleci točko po grafu in spreminjaj ${crka}.`, "Definicija odvoda: sekanta in tangenta");
  let x0 = 1, h = 1.2, tocka;
  const sh = S.drsnik({ label: crka, min: -2, max: 2, step: 0.1, value: h, digits: 1, barva: "ploskev", onInput: (v) => ((h = brezNic(v, h, 0.1)), h !== v && sh.set(h, true), izris()) });

  function izris() {
    x0 = omejiX0(x0, h); // drsnik lahko potisne x₀ + h iz okvirja
    const q = odvod(x0, h);
    const g = S.plast("graf");
    const zg = s("g", { "clip-path": A.izrez }, g);
    const premica = (k, barva, w) => crta(zg, A.X(-3.5), A.Y(q.y0 + k * (-3.5 - x0)), A.X(3.5), A.Y(q.y0 + k * (3.5 - x0)), barva, { "stroke-width": w });
    s("path", { d: fnPath(f, A, { n: 200 }), class: "sk-s-glavna", "stroke-width": 2.5 }, zg);
    premica(q.k, "druga", 2);
    premica(q.kvocient, "izbor", 2);
    const P = [A.X(x0), A.Y(q.y0)], D = [A.X(x0 + h), A.Y(q.y0)], Q = [A.X(x0 + h), A.Y(q.y0 + q.df)];
    crta(zg, ...P, ...D, "ploskev", { "stroke-width": 2.5 });
    crta(zg, ...D, ...Q, "ploskev", { "stroke-width": 2.5 });
    s("circle", { cx: Q[0], cy: Q[1], r: 5, class: "sk-fill sk-fill-izbor" }, zg);
    napis(g, (P[0] + D[0]) / 2, D[1] + (q.df >= 0 ? 15 : -7), crka, "ploskev", { "text-anchor": "middle" });
    if (Math.abs(Q[1] - D[1]) > 14) napis(g, D[0] + (h > 0 ? 5 : -5), (D[1] + Q[1]) / 2 + 4, "Δf", "ploskev", { "text-anchor": h > 0 ? "start" : "end", style: "font-size: 12px" });
    napis(g, A.X(0) + 6, A.T + 12, "f(x) = x²/2", "glavna", { style: "font-size: 12px" });
    tocka?.move(...P);
    S.cipi([
      { barva: "ploskev", oznaka: crka === "h" ? "h = \\Delta x" : "\\Delta x", vrednost: st(h, 1) },
      { barva: "ploskev", oznaka: `\\Delta f = f(x_0 + ${T}) - f(x_0)`, vrednost: vr(q.df, 3) },
      { barva: "izbor", oznaka: "\\frac{\\Delta f}{\\Delta x}", vrednost: vr(q.kvocient, 3) },
      { barva: "druga", oznaka: "f'(x_0) = x_0", vrednost: st(q.k, 1) },
    ]);
  }
  izris();
  tocka = S.tocka({
    x: A.X(x0),
    y: A.Y(f(x0)),
    label: "Točka x₀: premikaj jo po grafu",
    onMove: (x) => ((x0 = omejiX0(A.inv(x, 0)[0], h)), izris()),
  });
  izris();
  host.append(S.el);
}

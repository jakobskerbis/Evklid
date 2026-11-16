// Limita funkcije (SŠ): f(x) = x²/2, točka (a, b) se vleče po grafu, drsnik ε.
// Rumen pas b ± ε, zelen pas a ± δ: za vsak x v zelenem pasu (x ≠ a) je f(x) v rumenem pasu.
import { st, crta, napis, vr } from "./skica.js";
import { s, fnPath } from "../sim/kit.js";
import { f, limita, okvir } from "./analiza.js";

export const A_MEJA = 2.4;

export default function narisi(host) {
  const { S, A } = okvir("Povleci točko po grafu in spreminjaj ε.", "Limita funkcije: pasova ε in δ");
  let a = 1.5, eps = 0.8, tocka;
  S.drsnik({ label: "ε", min: 0.1, max: 1.5, step: 0.1, value: eps, digits: 1, barva: "izbor", onInput: (v) => ((eps = v), izris()) });

  function izris() {
    const q = limita(a, eps);
    const g = S.plast("graf");
    const zg = s("g", { "clip-path": A.izrez }, g);
    s("rect", { x: A.L, y: A.Y(q.b + eps), width: A.R - A.L, height: A.Y(q.b - eps) - A.Y(q.b + eps), class: "sk-f-izbor" }, zg);
    s("rect", { x: A.X(a - q.delta), y: A.T, width: A.X(a + q.delta) - A.X(a - q.delta), height: A.B - A.T, class: "sk-f-druga" }, zg);
    for (const y of [q.b - eps, q.b + eps]) crta(zg, A.L, A.Y(y), A.R, A.Y(y), "izbor", { class: "sk-s-izbor sk-thin sk-dash" });
    for (const x of [a - q.delta, a + q.delta]) crta(zg, A.X(x), A.T, A.X(x), A.B, "druga", { class: "sk-s-druga sk-thin sk-dash" });
    s("path", { d: fnPath(f, A, { n: 200 }), class: "sk-s-glavna", "stroke-width": 2.5 }, zg);
    // Del grafa nad zelenim pasom: ves je v rumenem pasu.
    s("path", { d: fnPath(f, A, { from: a - q.delta, to: a + q.delta, n: 60 }), class: "sk-s-izbor", "stroke-width": 4 }, zg);
    const P = [A.X(a), A.Y(q.b)];
    crta(zg, P[0], P[1], P[0], A.Y(0), "glavna", { class: "sk-s-glavna sk-thin sk-dash" });
    crta(zg, P[0], P[1], A.X(0), P[1], "glavna", { class: "sk-s-glavna sk-thin sk-dash" });
    napis(g, P[0] + 5, A.Y(0) - 6, "a", "druga"); // nad osjo: pod njo so števila
    napis(g, A.X(0) + (a > 0 ? -6 : 6), P[1] - 5, "b", "izbor", { "text-anchor": a > 0 ? "end" : "start" });
    napis(g, A.X(0) + 6, A.T + 12, "f(x) = x²/2", "glavna", { style: "font-size: 12px" });
    tocka?.move(...P);
    S.cipi([
      { barva: "druga", oznaka: "a", vrednost: st(a, 1) },
      { barva: "izbor", oznaka: "b = \\lim\\limits_{x \\to a} f(x)", vrednost: vr(q.b, 3) },
      { barva: "izbor", oznaka: "\\varepsilon", vrednost: st(eps, 2) },
      { barva: "druga", oznaka: "\\delta", vrednost: vr(q.delta, 3) },
    ]);
  }
  izris();
  tocka = S.tocka({
    x: A.X(a),
    y: A.Y(f(a)),
    label: "Točka (a, b): premikaj jo po grafu",
    onMove: (x) => ((a = Math.max(-A_MEJA, Math.min(A_MEJA, Math.round(A.inv(x, 0)[0] * 10) / 10)) || 0), izris()), // || 0: brez »−0«
  });
  izris();
  host.append(S.el);
}

// Trapezna metoda (SŠ): n trapezov (1–12) pod f(x) = 0,3x³ − 1,75x² + 2,7x + 0,5 na [0, 4]; rdeče je napaka
// med tetivami in krivuljo. Čipi: h, približek, točna vrednost 82/15 in napaka.
import { crta, vr } from "./skica.js";
import { s, fnPath } from "../sim/kit.js";
import { f, trapez, TOCNO, A_INT, B_INT } from "./integral.js";
import { okvirInt } from "./riemann.js";

export const N_MIN = 1, N_MAX = 12;

export default function narisi(host) {
  const { S, A } = okvirInt("Spreminjaj število trapezov n.", "Trapezna metoda: približek integrala");
  let n = 3;
  S.drsnik({ zvezno: false, label: "n", min: N_MIN, max: N_MAX, step: 1, value: n, digits: 0, barva: "ploskev", onInput: (v) => ((n = v), izris()) });

  function izris() {
    const q = trapez(n);
    const g = S.plast("graf");
    for (let i = 0; i < n; i++) {
      const x0 = A_INT + i * q.h, x1 = x0 + q.h;
      s("polygon", { points: `${A.X(x0)},${A.Y(0)} ${A.X(x0)},${A.Y(q.y[i])} ${A.X(x1)},${A.Y(q.y[i + 1])} ${A.X(x1)},${A.Y(0)}`, class: "sk-f-ploskev" }, g);
      // Napaka: med krivuljo od x₀ do x₁ in tetivo nazaj.
      s("path", { d: `${fnPath(f, A, { from: x0, to: x1, n: 30 })}L${A.X(x0)},${A.Y(q.y[i])}Z`, class: "sk-f-napaka" }, g);
      crta(g, A.X(x0), A.Y(q.y[i]), A.X(x1), A.Y(q.y[i + 1]), "ploskev", { "stroke-width": 2 });
      crta(g, A.X(x1), A.Y(0), A.X(x1), A.Y(q.y[i + 1]), "ploskev", { class: "sk-s-ploskev sk-thin" });
    }
    crta(g, A.X(A_INT), A.Y(0), A.X(A_INT), A.Y(q.y[0]), "ploskev", { class: "sk-s-ploskev sk-thin" });
    s("path", { d: fnPath(f, A, { from: A_INT, to: B_INT, n: 200 }), class: "sk-s-glavna", "stroke-width": 2.5 }, g);
    S.cipi([
      { barva: "ploskev", oznaka: "h = \\frac{b - a}{n}", vrednost: vr(q.h, 3) },
      { barva: "ploskev", oznaka: "\\text{približek}", vrednost: vr(q.T, 4) },
      { barva: "glavna", oznaka: "\\int_0^4 f(x)\\,dx", vrednost: `82/15 ${vr(TOCNO, 4)}` },
      { barva: "napaka", oznaka: "\\text{napaka}", vrednost: vr(q.T - TOCNO, 4) },
    ]);
  }
  izris();
  host.append(S.el);
}

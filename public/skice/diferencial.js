// Diferencial (SŠ): f(x) = x²/2, točka x se vleče po grafu, drsnik dx (= Δx, brez 0). Tangenta v x;
// pri x + dx: df do tangente (zeleno), Δf do grafa (rumeno, ob strani), razlika Δf − df (rdeče).
import { st, crta, napis, vr } from "./skica.js";
import { s, fnPath } from "../sim/kit.js";
import { f, diferencial, brezNic, okvir } from "./analiza.js";

export const X_MEJA = 2.5;

export default function narisi(host) {
  const { S, A } = okvir("Povleci točko po grafu in spreminjaj dx.", "Diferencial: Δf in df");
  let x0 = 1, dx = 1.4, tocka;
  const sd = S.drsnik({ label: "dx", min: -2, max: 2, step: 0.1, value: dx, digits: 1, barva: "ploskev", onInput: (v) => ((dx = brezNic(v, dx, 0.1)), dx !== v && sd.set(dx, true), izris()) });

  function izris() {
    const q = diferencial(x0, dx);
    const g = S.plast("graf");
    const zg = s("g", { "clip-path": A.izrez }, g);
    s("path", { d: fnPath(f, A, { n: 200 }), class: "sk-s-glavna", "stroke-width": 2.5 }, zg);
    crta(zg, A.X(-3.5), A.Y(q.y0 + x0 * (-3.5 - x0)), A.X(3.5), A.Y(q.y0 + x0 * (3.5 - x0)), "druga", { "stroke-width": 1.5, class: "sk-s-druga sk-faint" });
    const x1 = x0 + dx, P = [A.X(x0), A.Y(q.y0)], D = [A.X(x1), A.Y(q.y0)], Td = [A.X(x1), A.Y(q.y0 + q.df)], F = [A.X(x1), A.Y(q.y0 + q.Df)];
    crta(zg, ...P, ...D, "ploskev", { "stroke-width": 2.5 }); // dx
    crta(zg, ...D, ...Td, "druga", { "stroke-width": 3.5 }); // df
    crta(zg, ...Td, ...F, "napaka", { "stroke-width": 3.5 }); // Δf − df
    const ob = dx > 0 ? 9 : -9; // Δf ob strani, da se ne prekriva z df
    crta(zg, D[0] + ob, D[1], F[0] + ob, F[1], "izbor", { "stroke-width": 2.5 });
    crta(zg, D[0], D[1], D[0] + ob, D[1], "izbor", { class: "sk-s-izbor sk-thin" });
    crta(zg, F[0], F[1], F[0] + ob, F[1], "izbor", { class: "sk-s-izbor sk-thin" });
    const st_ = dx > 0 ? "start" : "end";
    napis(g, (P[0] + D[0]) / 2, D[1] + (q.Df >= 0 ? 15 : -7), "dx", "ploskev", { "text-anchor": "middle", style: "font-size: 12px" });
    if (Math.abs(F[1] - D[1]) > 14) napis(g, D[0] + ob * 1.6, (D[1] + F[1]) / 2 + 4, "Δf", "izbor", { "text-anchor": st_, style: "font-size: 12px" });
    if (Math.abs(Td[1] - D[1]) > 14) napis(g, D[0] - ob * 0.6, (D[1] + Td[1]) / 2 + 4, "df", "druga", { "text-anchor": dx > 0 ? "end" : "start", style: "font-size: 12px" });
    napis(g, A.L + 4, A.T + 12, "f(x) = x²/2", "glavna", { style: "font-size: 12px" });
    tocka?.move(...P);
    S.cipi([
      { barva: "ploskev", oznaka: "dx = \\Delta x", vrednost: st(dx, 1) },
      { barva: "izbor", oznaka: "\\Delta f", vrednost: vr(q.Df, 3) },
      { barva: "druga", oznaka: "df = f'(x)\\,dx", vrednost: vr(q.df, 3) },
      { barva: "napaka", oznaka: "\\Delta f - df", vrednost: vr(q.razlika, 3) },
    ]);
  }
  izris();
  tocka = S.tocka({
    x: A.X(x0),
    y: A.Y(f(x0)),
    label: "Točka x: premikaj jo po grafu",
    onMove: (x) => ((x0 = Math.max(-X_MEJA, Math.min(X_MEJA, Math.round(A.inv(x, 0)[0] * 10) / 10)) || 0), izris()),
  });
  izris();
  host.append(S.el);
}

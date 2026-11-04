// Množice, operacije: Vennov diagram v univerzalni množici U; gumb obarva del, ki pripada operaciji.
import { skica, napis, novId } from "./skica.js";
import { s } from "../sim/kit.js";

// je(vA, vB): ali element, ki je (ali ni) v A in v B, pripada rezultatu.
export const OPERACIJE = {
  "A∪B": { tex: "A \\cup B = \\{x;\\ x \\in A \\lor x \\in B\\}", opis: "x je v A ali v B", je: (vA, vB) => vA || vB },
  "A∩B": { tex: "A \\cap B = \\{x;\\ x \\in A \\land x \\in B\\}", opis: "x je v A in v B", je: (vA, vB) => vA && vB },
  "A−B": { tex: "A - B = \\{x;\\ x \\in A \\land x \\notin B\\}", opis: "x je v A, ni pa v B", je: (vA, vB) => vA && !vB },
  "A′": { tex: "A' = \\{x \\in U;\\ x \\notin A\\}", opis: "x je v U, ni pa v A", je: (vA) => !vA },
};

export default function narisi(host) {
  const W = 320, H = 200;
  const A = [126, 104], B = [194, 104], R = 62;
  const S = skica({ w: W, h: H, navodilo: "Izberi operacijo.", oznaka: "Vennov diagram dveh množic" });
  const defs = s("defs", {}, S.svg);
  const idB = novId("b"), idBrezA = novId("brez-a"), idBrezB = novId("brez-b");
  s("circle", { cx: B[0], cy: B[1], r: R }, s("clipPath", { id: idB }, defs));
  const maska = (id, C) => {
    const m = s("mask", { id, maskUnits: "userSpaceOnUse", x: 0, y: 0, width: W, height: H }, defs);
    s("rect", { x: 0, y: 0, width: W, height: H, fill: "#fff" }, m);
    s("circle", { cx: C[0], cy: C[1], r: R, style: "fill: #000" }, m); // slog, ker .sk-svg circle nastavi fill: none
  };
  maska(idBrezA, A);
  maska(idBrezB, B);

  const obarvaj = s("g", { opacity: 0.45 }, S.svg);
  const U = { x: 12, y: 12, width: W - 24, height: H - 24, rx: 10 };
  s("rect", { ...U, class: "sk-s-glavna sk-thin", fill: "none" }, S.svg);
  s("circle", { cx: A[0], cy: A[1], r: R, class: "sk-s-glavna" }, S.svg);
  s("circle", { cx: B[0], cy: B[1], r: R, class: "sk-s-glavna" }, S.svg);
  napis(S.svg, 26, 34, "U");
  napis(S.svg, A[0] - R + 6, A[1] - R + 12, "A", "glavna", { "text-anchor": "end" });
  napis(S.svg, B[0] + R - 6, B[1] - R + 12, "B");

  let op = "A∪B";
  S.gumbi({ label: "Operacija z množicama", options: Object.keys(OPERACIJE), value: op, onChange: (v) => ((op = v), izris()) });

  function izris() {
    obarvaj.replaceChildren();
    const krog = (C, extra = {}) => s("circle", { cx: C[0], cy: C[1], r: R, class: "sk-fill sk-fill-ploskev", ...extra }, obarvaj);
    if (op === "A∪B") (krog(A), krog(B));
    else if (op === "A∩B") krog(A, { "clip-path": `url(#${idB})` });
    else if (op === "A−B") krog(A, { mask: `url(#${idBrezB})` });
    else s("rect", { ...U, class: "sk-fill sk-fill-ploskev", mask: `url(#${idBrezA})` }, obarvaj);
    const o = OPERACIJE[op];
    S.cipi([{ barva: "ploskev", oznaka: o.tex }]);
    S.svg.setAttribute("aria-label", `Vennov diagram: ${op}, ${o.opis}`);
  }

  izris();
  host.append(S.el);
}

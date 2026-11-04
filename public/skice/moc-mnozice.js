// Moč množice: pike v A, v B in v preseku; m(A ∪ B) = m(A) + m(B) − m(A ∩ B).
import { skica, napis } from "./skica.js";
import { s } from "../sim/kit.js";

export const NAJVEC = 10;

// Presek ne more imeti več elementov kot manjša od množic.
export function moc(mA, mB, mAB) {
  const k = Math.max(0, Math.min(mAB, mA, mB));
  return { mA, mB, mAB: k, samoA: mA - k, samoB: mB - k, unija: mA + mB - k };
}

// Pike v mreži s tremi stolpci okoli središča (cx, cy).
export function mreza(n, cx, cy, d = 16) {
  const vrstic = Math.ceil(n / 3);
  return Array.from({ length: n }, (_, i) => {
    const r = Math.floor(i / 3), c = i % 3, vVrsti = Math.min(3, n - r * 3);
    return [cx + (c - (vVrsti - 1) / 2) * d, cy + (r - (vrstic - 1) / 2) * d];
  });
}

export default function narisi(host) {
  const W = 320, H = 200;
  const A = [120, 100], B = [200, 100], R = 72;
  const S = skica({ w: W, h: H, navodilo: "Spreminjaj število elementov z gumboma − in +.", oznaka: "Elementi dveh množic in njunega preseka" });
  s("circle", { cx: A[0], cy: A[1], r: R, class: "sk-s-ploskev" }, S.svg);
  s("circle", { cx: B[0], cy: B[1], r: R, class: "sk-s-druga" }, S.svg);
  napis(S.svg, A[0] - R + 4, A[1] - R + 14, "A", "ploskev", { "text-anchor": "end" });
  napis(S.svg, B[0] + R - 4, B[1] - R + 14, "B", "druga");

  let q = moc(8, 6, 3);
  const stA = S.stevec({ label: "m(A)", min: 0, max: NAJVEC, value: q.mA, barva: "ploskev", onInput: (v) => nastavi(v, q.mB, q.mAB) });
  const stB = S.stevec({ label: "m(B)", min: 0, max: NAJVEC, value: q.mB, barva: "druga", onInput: (v) => nastavi(q.mA, v, q.mAB) });
  const stAB = S.stevec({ label: "m(A∩B)", min: 0, max: Math.min(q.mA, q.mB), value: q.mAB, barva: "izbor", onInput: (v) => nastavi(q.mA, q.mB, v) });

  function nastavi(mA, mB, mAB) {
    q = moc(mA, mB, mAB);
    stAB.meje(0, Math.min(q.mA, q.mB));
    stAB.set(q.mAB, true);
    izris();
  }

  function izris() {
    const g = S.plast("pike");
    const pike = (tocke, barva) => tocke.forEach(([x, y]) => s("circle", { cx: x, cy: y, r: 5, class: `sk-fill sk-fill-${barva}` }, g));
    pike(mreza(q.samoA, A[0] - 32, A[1]), "ploskev");
    pike(mreza(q.mAB, (A[0] + B[0]) / 2, A[1]), "izbor");
    pike(mreza(q.samoB, B[0] + 32, B[1]), "druga");
    S.cipi([{ barva: "glavna", oznaka: "m(A \\cup B)", vrednost: `${q.mA} + ${q.mB} − ${q.mAB} = ${q.unija}` }]);
  }

  izris();
  host.append(S.el);
}

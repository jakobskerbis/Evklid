// Pascalov trikotnik (SŠ kartici Kombinacije in Binomski izrek): vrstice 0–8, števca n in r.
// Poudarjeno: C(n, r) rumeno, simetrični C(n, n − r) zeleno, Pascalovo pravilo C(n − 1, r − 1) + C(n − 1, r)
// modro s povezovalnima črtama. Pri binomskem izreku še člen razvoja (a + b)ⁿ.
import { skica, st, crta } from "./skica.js";
import { s } from "../sim/kit.js";
import { C } from "./integral.js";

export const N_MAX = 8;
const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const nad = (k) => (k === 1 ? "" : String(k).split("").map((c) => SUP[c]).join(""));

// Člen binomskega razvoja kot besedilo, npr. »10a³b²«, »a⁵«, »5ab⁴«.
export function clen(n, k) {
  const c = C(n, k);
  const a = n - k ? `a${nad(n - k)}` : "", b = k ? `b${nad(k)}` : "";
  return `${c === 1 && (a || b) ? "" : st(c, 0)}${a}${b}`;
}

export default function narisi(host, { binom = false } = {}) {
  const W = 300, H = 232, dy = 23, dx = 33, Y0 = 20;
  // Pri binomskem izreku je spodnja številka k (kot na kartici), pri kombinacijah r.
  const c = binom ? "k" : "r";
  const S = skica({ w: W, h: H, navodilo: `Spreminjaj n in ${c}.`, oznaka: binom ? "Pascalov trikotnik in binomski izrek" : "Pascalov trikotnik: kombinacije" });
  const poz = (n, r) => [W / 2 + (r - n / 2) * dx, Y0 + n * dy];
  let n = 5, r = 2;
  const sN = S.stevec({ label: "n", min: 0, max: N_MAX, value: n, barva: "glavna", onInput: (v) => ((n = v), sR.meje(0, n), (r = sR.get()), izris()) });
  const sR = S.stevec({ label: c, min: 0, max: n, value: r, barva: "izbor", onInput: (v) => ((r = v), izris()) });

  function izris() {
    const g = S.plast("trikotnik");
    const stars = n > 0 && r > 0 && r < n;
    if (stars) for (const rr of [r - 1, r]) crta(g, ...poz(n - 1, rr), ...poz(n, r), "ploskev", { "stroke-width": 2.5 });
    for (let i = 0; i <= N_MAX; i++)
      for (let j = 0; j <= i; j++) {
        const [x, y] = poz(i, j);
        const jeIzb = i === n && j === r, jeSim = i === n && j === n - r && !jeIzb, jeStars = stars && i === n - 1 && (j === r - 1 || j === r);
        if (jeIzb || jeSim || jeStars) s("circle", { cx: x, cy: y, r: 12, class: `sk-fill sk-fill-${jeIzb ? "izbor" : jeSim ? "druga" : "ploskev"}` }, g);
        s("text", { x, y: y + 4, class: "sk-n", "text-anchor": "middle", style: `font-size: 12px; ${jeIzb || jeSim || jeStars ? "fill: #10131f; font-weight: 700" : i === n ? "" : "opacity: 0.55"}` }, g, st(C(i, j), 0));
      }
    const f = (k) => `${k}!`;
    const cipi = [
      { barva: "izbor", oznaka: `\\binom{n}{${c}} = \\frac{n!}{${c}!\\,(n - ${c})!}`, vrednost: `${f(n)} : (${f(r)} · ${f(n - r)}) = ${st(C(n, r), 0)}` },
      { barva: "druga", oznaka: `\\binom{n}{n - ${c}}`, vrednost: st(C(n, n - r), 0) },
      stars
        ? { barva: "ploskev", oznaka: `\\binom{n - 1}{${c} - 1} + \\binom{n - 1}{${c}} = \\binom{n}{${c}}`, vrednost: `${st(C(n - 1, r - 1), 0)} + ${st(C(n - 1, r), 0)} = ${st(C(n, r), 0)}` }
        : { barva: "ploskev", oznaka: "\\binom{n}{0} = \\binom{n}{n} = 1", vrednost: "robni člen" },
    ];
    if (binom) cipi.push({ barva: "izbor", oznaka: "\\binom{n}{k} a^{n - k} b^k", vrednost: clen(n, r) });
    S.cipi(cipi);
    if (sN.get() !== n) sN.set(n, true);
  }
  izris();
  host.append(S.el);
}

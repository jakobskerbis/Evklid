// Pomoč za teste maturitetnih generatorjev (test/matura-zaokrozevanje.test.js, test/matura-neodvisno.test.js):
// naloga iz generatorja z danim semenom in preračun čisto številskih korakov rešitve (»a · b ≈ c«).
// Branje TeX-a je iz server/lesson-math.js (normalizeTex, evaluate), primerjava pa je strožja kot pri
// lekcijah: izpisani rezultat se mora od izračuna iz izpisanih števil razlikovati za največ pol enote
// zadnjega izpisanega mesta, sicer dijak, ki sledi rešitvi, pride do druge zadnje števke kot odgovor.
import { normalizeTex, evaluate } from "../server/lesson-math.js";
import { makeRng } from "../server/practice/rng.js";
import { plainCommas } from "../server/practice/index.js";
import { roundHalfUp } from "../server/practice/check.js";
import { MATURA_MAT_SS1 } from "../server/practice/generators/matura-mat-ss1.js";
import { MATURA_MAT_SS1_GEO } from "../server/practice/generators/matura-mat-ss1-geo.js";
import { MATURA_MAT_SS2 } from "../server/practice/generators/matura-mat-ss2.js";
import { MATURA_MAT_SS3 } from "../server/practice/generators/matura-mat-ss3.js";
import { MATURA_MAT_SS4 } from "../server/practice/generators/matura-mat-ss4.js";

export const MATURA_MAT = [...MATURA_MAT_SS1, ...MATURA_MAT_SS1_GEO, ...MATURA_MAT_SS2, ...MATURA_MAT_SS3, ...MATURA_MAT_SS4];
export { roundHalfUp };

// Naloga, kot jo vidi dijak (isti plainCommas kot generateTask), ali null.
export function naloga(g, level, seed) {
  const t = g.gen(level, makeRng(seed), g.topics[0], "sl");
  return t && t.text && t.answer ? plainCommas({ ...t, generator: g.id, level, seed }) : null;
}
export const besedilo = (t) => [t.text, t.hint, ...(Array.isArray(t.solution) ? t.solution : [t.solution])].join("\n");
const resitev = (t) => (Array.isArray(t.solution) ? t.solution.join("\n") : String(t.solution || ""));

// Formule $…$ in $$…$$ v besedilu.
export function formule(s) {
  const out = [];
  const re = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
  let m;
  while ((m = re.exec(s))) out.push(m[1] ?? m[2]);
  return out;
}

const SEP = /(=|\\approx|\\doteq)/;
// Neenačbe, intervali, množice, puščice in »±« niso verige računov. Dela s funkcijo ali spremenljivko
// (\sin\alpha, \binom{5}{2}, 5!) normalizeTex ne prebere, zato ostanejo zunaj primerjave, ostali deli verige pa ne.
const SKIP = /\\(pm|mp|le|ge|leq|geq|neq|ne|lt|gt|in|to|rightarrow|Rightarrow|implies|iff|infty|equiv|sim|cup|cap|setminus|lim)\b|[<>≤≥≠→;\[\]]|\\\{/;

function del(tex) {
  const n = normalizeTex(tex, "div");
  if (!n) return null;
  const value = evaluate(n.expr);
  return Number.isFinite(value) ? { ...n, value, tex: tex.trim() } : null;
}

// Čisto številski koraki rešitve: { tex, op, a, b, diff, tol } za vsak par sosednjih delov, kjer je desni
// del golo število (izpisan rezultat). Levi del je izraz iz izpisanih števil ali prejšnje golo število.
// Veriga se nadaljuje v naslednji formuli z isto levo stranjo: »$D_3 ≈ 7000 - 1234,56$« in »$D_3 ≈ 5765,44$«.
export function koraki(t) {
  const out = [];
  let nadaljuj = null; // { lhs, izraz }: formula se je končala z neizračunanim izrazom
  for (const tex of formule(resitev(t))) {
    if (!SEP.test(tex) || SKIP.test(tex)) {
      nadaljuj = null;
      continue;
    }
    const parts = tex.split(SEP);
    const lhs = parts[0].trim();
    let prev = null;
    for (let k = 0; k < parts.length; k += 2) {
      let cur = del(parts[k]);
      // Le z »≈« (»$x = \frac{1}{3}$«, »$x = 4$« sta dve rešitvi, ne en račun).
      if (k === 0 && !cur && nadaljuj && nadaljuj.lhs === lhs && parts[1] === "\\approx") cur = nadaljuj.izraz;
      const op = parts[k - 1];
      // Golo število = golo število je izjava (»0 = -2 ni res«) ali pretvorba (»20 cm = 0,2 m«), ne račun;
      // pretvorbe med različnimi enotami (»3/5 h = 36 min«) tudi preskočimo.
      const izjava = prev?.bare && op === "=";
      const pretvorba = prev?.units.length && cur?.units.length && prev.units.join() !== cur.units.join();
      if (prev && cur && cur.bare && !izjava && !pretvorba) {
        // Pri »≈« celo število s končnimi ničlami pomeni zaokrožitev na desetice, stotice … (22758 ≈ 23000).
        const ulp = op !== "=" && cur.trailingZeros && cur.ulp === 1 ? 10 ** cur.trailingZeros : cur.ulp;
        const tol = 0.5 * ulp + 1e-9 * Math.max(1, Math.abs(prev.value));
        out.push({ tex, op, a: prev, b: cur, diff: Math.abs(prev.value - cur.value), tol });
      }
      prev = cur;
    }
    nadaljuj = prev && !prev.bare && !del(lhs) ? { lhs, izraz: prev } : null;
  }
  return out;
}

// Koraki, kjer izpisani rezultat ni zaokrožen izračun iz izpisanih števil.
export const neskladni = (t) => koraki(t).filter((s) => s.diff > s.tol);

// Izpisani rezultati, ki se od ocenjenega odgovora (zaokroženega na njegove decimalke) razlikujejo le za 1–2 enoti
// zadnjega mesta: dijak, ki prepiše tak rezultat, dobi »Zaokrožil si v napačno smer«.
// Gola števila, ki jih rešitev izpiše kot rezultat (desno od »=« ali »≈«, tudi za spremenljivko: »G_0 ≈ 7980,22«).
export function rezultati(t) {
  const out = [];
  for (const tex of formule(resitev(t))) {
    if (!SEP.test(tex) || SKIP.test(tex)) continue;
    const parts = tex.split(SEP);
    for (let k = 2; k < parts.length; k += 2) {
      const d = del(parts[k]);
      if (d?.bare) out.push(d);
    }
  }
  return out;
}

export function skorajOdgovor(t) {
  const a = t.answer;
  if (a?.type !== "number" || a.decimals == null) return [];
  const u = 10 ** -a.decimals;
  const prav = roundHalfUp(a.value, a.decimals);
  return rezultati(t).filter((b) => {
    if (Math.abs(b.ulp / u - 1) > 1e-9) return false; // zapisan z drugim številom decimalk kot odgovor
    if (Math.abs(b.value - prav) > 0.2 * Math.abs(prav)) return false; // druga količina
    const d = Math.abs(roundHalfUp(b.value, a.decimals) - prav);
    return d > u / 2 && d < 2.5 * u;
  });
}

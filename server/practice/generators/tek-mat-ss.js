// Tekmovalne naloge iz matematike za SŠ (Vegovo priznanje, matematična olimpijada).
// Odgovori so izračunani v kodi; kjer gre, s pregledom vseh možnosti.
import {
  tx, res, num, fracAns, fracTex, binom, modpow, divisors, factorize, factorTex, gcd, phi, par,
} from "./tek-util.js";

const T = (slug) => `MAT-TEK-SS/${slug}`;
const sq = (x) => Number.isInteger(Math.sqrt(x));
// Heronovi trikotniki (cele stranice in ploščina).
const HERON = [[3, 4, 5], [5, 5, 6], [5, 5, 8], [5, 12, 13], [6, 8, 10], [9, 10, 17], [10, 13, 13], [13, 14, 15], [10, 10, 12], [8, 15, 17], [9, 12, 15], [11, 13, 20], [13, 20, 21], [12, 17, 25], [7, 15, 20], [10, 17, 21], [15, 15, 18], [17, 25, 28]];
const heronArea = ([a, b, c]) => {
  const s = (a + b + c) / 2;
  return Math.sqrt(s * (s - a) * (s - b) * (s - c));
};

function euclidSteps(a, b) {
  const st = [];
  while (b) {
    st.push(`$${a} = ${Math.floor(a / b)} \\cdot ${b} + ${a % b}$`);
    [a, b] = [b, a % b];
  }
  return { g: a, steps: st };
}

export const TEK_MAT_SS = [
  {
    id: "tek-evklid",
    topics: [T("deljivost-d-in-v-evklidov-algoritem")],
    gen(level, r) {
      if (level === 1) {
        const d = r.pick([7, 11, 13, 17, 19, 23, 29, 31, 37]) * r.int(1, 6);
        let x, y;
        do (x = r.int(20, 400)), (y = r.int(20, 400));
        while (gcd(x, y) !== 1 || x === y);
        const a = d * Math.max(x, y), b = d * Math.min(x, y);
        const { g, steps } = euclidSteps(a, b);
        return {
          text: `Z Evklidovim algoritmom izračunaj največji skupni delitelj $D(${a}, ${b})$.`,
          answer: num(g),
          hint: "Večje število deli z manjšim in zapiši ostanek. Nato deli prejšnji delitelj z ostankom. Zadnji neničelni ostanek je $D$.",
          data: { given: [`a = ${a}`, `b = ${b}`], find: ["D(a, b)"] },
          formula: "D(a, b) = D(b, a \\bmod b)",
          solution: `${steps.join("\n")}\nZadnji neničelni ostanek je $${g}$, torej $D(${a}, ${b}) = ${g}$.`,
        };
      }
      if (level === 2) {
        const m = r.pick([17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61]);
        const a = r.int(3, m - 2);
        let x = 1;
        while ((a * x) % m !== 1) x++;
        return {
          text: `Poišči najmanjše naravno število $x$, za katero je število $${a}x - 1$ deljivo s ${m}.`,
          answer: num(x),
          hint: `Iščemo $x$ z $${a}x \\equiv 1 \\pmod{${m}}$. Z razširjenim Evklidovim algoritmom zapiši $1 = ${a}u + ${m}v$.`,
          data: { given: [`a = ${a}`, `m = ${m}`], find: ["x"] },
          formula: "a x + m y = 1 \\text{ (Bézoutova enakost)}",
          solution: `Ker sta ${a} in ${m} tuji si števili, obstajata celi $u, v$ z $${a}u + ${m}v = 1$ (razširjeni Evklidov algoritem). Ostanek $u$ pri deljenju z ${m} je iskani $x$.\nDobimo $x = ${x}$: $${a} \\cdot ${x} - 1 = ${a * x - 1} = ${(a * x - 1) / m} \\cdot ${m}$.`,
        };
      }
      for (let t = 0; t < 100; t++) {
        const a = r.int(1, 6), b = r.int(1, 15), c = r.int(1, 6), d = r.int(1, 15);
        const det = Math.abs(a * d - b * c);
        if (det < 4 || det > 60 || gcd(a, b) !== 1 || gcd(c, d) !== 1) continue;
        let best = 0, at = 0;
        for (let n = 1; n <= 3 * det + 5; n++) {
          const gg = gcd(a * n + b, c * n + d);
          if (gg > best) (best = gg), (at = n);
        }
        if (best < 3) continue;
        const e1 = `${a === 1 ? "" : a}n + ${b}`, e2 = `${c === 1 ? "" : c}n + ${d}`;
        return {
          text: `Naj bo $n$ naravno število. Kolikšna je največja možna vrednost $D(${e1}, ${e2})$?`,
          answer: num(best),
          hint: `Vsak skupni delitelj deli tudi vsako celoštevilsko kombinacijo obeh izrazov. Izloči $n$: pomnoži prvega s ${c}, drugega z ${a} in odštej.`,
          data: false,
          formula: "d \\mid x, \\; d \\mid y \\Rightarrow d \\mid (px - qy)",
          solution: `Naj $d$ deli oba izraza. Tedaj deli $${c}(${e1}) - ${a}(${e2}) = ${c * b - a * d}$, torej $d \\mid ${det}$.\nNajvečja dosežena vrednost je $${best}$ (npr. pri $n = ${at}$: $${a * at + b}$ in $${c * at + d}$ imata $D = ${best}$).`,
        };
      }
      return null;
    },
  },
  {
    id: "tek-kongruence",
    topics: [T("kongruence")],
    gen(level, r) {
      if (level === 1) {
        const m = r.int(7, 25), a = r.int(2, 30), n = r.int(100, 9999);
        const ans = modpow(a, n, m);
        return {
          text: `Kolikšen je ostanek pri deljenju števila $${a}^{${n}}$ z ${m}?`,
          answer: num(ans),
          hint: `Najprej zmanjšaj osnovo po modulu ${m}, nato poišči, kdaj potence dajo ostanek 1 (ali se začnejo ponavljati).`,
          data: { given: [`a = ${a}`, `n = ${n}`, `m = ${m}`], find: [`a^n \\bmod m`] },
          formula: "a \\equiv b \\pmod m \\Rightarrow a^n \\equiv b^n \\pmod m",
          solution: `$${a} \\equiv ${a % m} \\pmod{${m}}$. Ostanki potenc se ponavljajo; z izračunom po modulu ${m} (npr. s kvadriranjem: $a^{2k} = (a^k)^2$) dobimo $${a}^{${n}} \\equiv ${ans} \\pmod{${m}}$.`,
        };
      }
      if (level === 2) {
        const N = r.int(20, 200), k = r.int(2, 5), m = r.pick([3, 4, 5, 6, 7, 8, 9, 10, 11]);
        let s = 0;
        for (let i = 1; i <= N; i++) s = (s + modpow(i, k, m)) % m;
        return {
          text: `Kolikšen je ostanek pri deljenju vsote $1^{${k}} + 2^{${k}} + 3^{${k}} + \\ldots + ${N}^{${k}}$ s ${m}?`,
          answer: num(s),
          hint: `Ostanki $i^{${k}}$ pri deljenju s ${m} se ponavljajo s periodo ${m}. Seštej en cel krog in pomnoži s številom krogov.`,
          data: { given: [`N = ${N}`, `k = ${k}`, `m = ${m}`], find: ["\\text{ostanek}"] },
          formula: "(i + m)^k \\equiv i^k \\pmod m",
          solution: `V enem krogu (od 1 do ${m}) je vsota ostankov $${Array.from({ length: m }, (_, i) => modpow(i + 1, k, m)).join(" + ")}$. Krogov je $${Math.floor(N / m)}$, ostane še ${N % m} členov.\nSkupaj je ostanek $${s}$.`,
        };
      }
      if (r.next() < 0.5) {
        const m = r.pick([7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 19, 20]);
        const set = [...new Set(Array.from({ length: m }, (_, i) => (i * i) % m))].sort((a, b) => a - b);
        return {
          text: `Koliko različnih ostankov lahko da kvadrat celega števila pri deljenju s ${m}?`,
          answer: num(set.length),
          hint: `Dovolj je pogledati $n = 0, 1, \\ldots, ${m - 1}$, saj ima $(n + ${m})^2$ enak ostanek kot $n^2$. Pomaga tudi $(${m} - n)^2 \\equiv n^2$.`,
          data: { given: [`m = ${m}`], find: ["\\text{število kvadratnih ostankov}"] },
          formula: "(m - n)^2 \\equiv n^2 \\pmod m",
          solution: `Kvadrati $0^2, 1^2, \\ldots, ${Math.floor(m / 2)}^2$ dajo ostanke ${set.join(", ")}.\nRazličnih ostankov je $${set.length}$.`,
        };
      }
      const m = r.pick([7, 13, 19, 21, 31, 37]), N = r.int(100, 1000);
      let c = 0;
      for (let n = 1; n <= N; n++) if ((n * n + n + 1) % m === 0) c++;
      const res0 = Array.from({ length: m }, (_, i) => i).filter((i) => (i * i + i + 1) % m === 0);
      return {
        text: `Za koliko naravnih števil $n \\le ${N}$ je število $n^2 + n + 1$ deljivo s ${m}?`,
        answer: num(c),
        hint: `Poišči ostanke $n$ pri deljenju s ${m}, za katere je $n^2 + n + 1 \\equiv 0 \\pmod{${m}}$. Nato preštej, koliko števil do ${N} ima te ostanke.`,
        data: { given: [`N = ${N}`, `m = ${m}`], find: ["\\text{število } n"] },
        formula: "n \\equiv n' \\pmod m \\Rightarrow n^2 + n + 1 \\equiv n'^2 + n' + 1",
        solution: `Pogoj izpolnjujejo ostanki $n \\equiv ${res0.join(", ")} \\pmod{${m}}$${res0.length ? "" : " (nobeden)"}.\nŠtevil do ${N} s temi ostanki je $${c}$.`,
      };
    },
  },
  {
    id: "tek-fermat-euler",
    topics: [T("mali-fermatov-in-eulerjev-izrek")],
    gen(level, r) {
      if (level === 1) {
        let n;
        do n = r.int(30, 600);
        while (Object.keys(factorize(n)).length < 2);
        const f = factorize(n);
        return {
          text: `Koliko naravnih števil, manjših ali enakih ${n}, je tujih proti ${n} (Eulerjeva funkcija $\\varphi(${n})$)?`,
          answer: num(phi(n)),
          hint: "Razcepi število. Za vsak prafaktor $p$ pomnoži z $\\left(1 - \\tfrac{1}{p}\\right)$.",
          data: { given: [`n = ${n}`], find: ["\\varphi(n)"] },
          formula: "\\varphi(n) = n \\prod_{p \\mid n} \\left(1 - \\tfrac{1}{p}\\right)",
          solution: `$${n} = ${factorTex(f)}$\n$\\varphi(${n}) = ${n} ${Object.keys(f).map((p) => `\\cdot \\left(1 - \\tfrac{1}{${p}}\\right)`).join(" ")} = ${phi(n)}$.`,
        };
      }
      if (level === 2) {
        const a = r.pick([3, 7, 9, 11, 13, 17, 19, 21, 23, 27, 29, 31, 33, 37]);
        const N = r.int(100, 99999);
        const ans = modpow(a, N, 100);
        return {
          text: `Kateri sta zadnji dve števki števila $${a}^{${N}}$? Zapiši ju kot dvomestno število (npr. 07 zapiši kot 7).`,
          answer: num(ans),
          hint: "Iščemo ostanek pri deljenju s 100. Ker je $\\varphi(100) = 40$, je $a^{40} \\equiv 1 \\pmod{100}$ za vsak $a$, tuj proti 10.",
          data: { given: [`a = ${a}`, `N = ${N}`], find: ["a^N \\bmod 100"] },
          formula: "a^{\\varphi(n)} \\equiv 1 \\pmod n, \\quad \\varphi(100) = 40",
          solution: `Po Eulerjevem izreku je $${a}^{40} \\equiv 1 \\pmod{100}$. $${N} = 40 \\cdot ${Math.floor(N / 40)} + ${N % 40}$, zato $${a}^{${N}} \\equiv ${a}^{${N % 40}} \\equiv ${ans} \\pmod{100}$.\nZadnji dve števki: ${String(ans).padStart(2, "0")}.`,
        };
      }
      const p = r.pick([11, 13, 17, 19, 23, 29, 31, 37, 41, 43]);
      const a = r.int(2, p - 2);
      let k = 1;
      while (modpow(a, k, p) !== 1) k++;
      return {
        text: `Kateri je najmanjši naravni eksponent $k$, za katerega je $${a}^k - 1$ deljivo s ${p}?`,
        answer: num(k),
        hint: `Po malem Fermatovem izreku je $${a}^{${p - 1}} \\equiv 1 \\pmod{${p}}$, najmanjši tak $k$ pa deli ${p - 1}. Preizkusi le delitelje števila ${p - 1}.`,
        data: { given: [`a = ${a}`, `p = ${p}`], find: ["k"] },
        formula: "a^{p-1} \\equiv 1 \\pmod p, \\quad k \\mid p - 1",
        solution: `Red števila ${a} po modulu ${p} deli $${p - 1}$; delitelji so ${divisors(p - 1).join(", ")}.\nPreizkus: najmanjši delitelj $k$ z $${a}^k \\equiv 1 \\pmod{${p}}$ je $k = ${k}$.`,
      };
    },
  },
  {
    id: "tek-diofant-ss",
    topics: [T("diofantske-enacbe")],
    gen(level, r) {
      if (level === 1) {
        let a, b, c, sols;
        do {
          a = r.int(2, 13);
          b = r.int(2, 13);
          c = r.int(60, 400);
          sols = [];
          for (let x = 1; a * x < c; x++) if ((c - a * x) % b === 0) sols.push(x);
        } while (gcd(a, b) !== 1 || sols.length < 2);
        return {
          text: `Koliko parov naravnih števil $(x, y)$ reši enačbo $${a}x + ${b}y = ${c}$?`,
          answer: num(sols.length),
          hint: `Poišči eno rešitev, nato vse dobiš kot $x = x_0 + ${b}t$, $y = y_0 - ${a}t$. Pazi, da sta $x, y \\ge 1$.`,
          data: { given: [`a = ${a}`, `b = ${b}`, `c = ${c}`], find: ["\\text{število rešitev}"] },
          formula: "x = x_0 + b t, \\; y = y_0 - a t",
          solution: `Ena rešitev: $x_0 = ${sols[0]}$, $y_0 = ${(c - a * sols[0]) / b}$. Vse rešitve: $x = ${sols[0]} + ${b}t$, $y = ${(c - a * sols[0]) / b} - ${a}t$, $t \\ge 0$, dokler je $y \\ge 1$.\nTakih je $${sols.length}$.`,
        };
      }
      if (level === 2) {
        const n = r.pick([4, 6, 8, 10, 12, 15, 18, 20, 24, 30, 36]);
        const cnt = divisors(n * n).length;
        return {
          text: `Koliko urejenih parov naravnih števil $(x, y)$ reši enačbo $\\dfrac{1}{x} + \\dfrac{1}{y} = \\dfrac{1}{${n}}$?`,
          answer: num(cnt),
          hint: `Odpravi ulomke in dopolni do produkta: $xy - ${n}x - ${n}y = 0$ prepiši kot $(x - ${n})(y - ${n}) = ${n * n}$.`,
          data: { given: [`n = ${n}`], find: ["\\text{število parov}"] },
          formula: "(x - n)(y - n) = n^2",
          solution: `$\\dfrac{1}{x} + \\dfrac{1}{y} = \\dfrac{1}{${n}} \\iff (x - ${n})(y - ${n}) = ${n * n}$. Oba faktorja morata biti pozitivna (sicer bi bil $x$ ali $y$ manjši od ${n} in vsota prevelika ali negativna).\nVsak delitelj $d$ števila $${n * n} = ${factorTex(factorize(n * n))}$ da par $(${n} + d, ${n} + \\tfrac{${n * n}}{d})$. Deliteljev je $${cnt}$.`,
        };
      }
      if (r.next() < 0.5) {
        let N;
        do N = r.int(30, 600);
        while (N % 4 === 2);
        let c = 0;
        const list = [];
        for (let y = 1; y * y < N; y++) {
          const x = Math.sqrt(N + y * y);
          if (Number.isInteger(x)) c++, list.push(`(${x}, ${y})`);
        }
        if (!c) return null;
        return {
          text: `Koliko parov naravnih števil $(x, y)$ reši enačbo $x^2 - y^2 = ${N}$?`,
          answer: num(c),
          hint: "Razstavi: $(x - y)(x + y) = N$. Oba faktorja imata enako parnost.",
          data: { given: [`N = ${N}`], find: ["\\text{število rešitev}"] },
          formula: "x^2 - y^2 = (x - y)(x + y)",
          solution: `$(x - y)(x + y) = ${N}$, pri čemer je $0 < x - y < x + y$ in sta faktorja iste parnosti.\nRešitve: ${list.join(", ")}. Skupaj $${c}$.`,
        };
      }
      const a = r.int(2, 6), b = r.int(2, 6);
      const sols = [];
      for (let x = 1; x <= a * b + b + 1; x++) {
        if (x === b) continue;
        const y = (a * x) / (x - b);
        if (Number.isInteger(y) && y > 0) sols.push(`(${x}, ${y})`);
      }
      return {
        text: `Koliko parov naravnih števil $(x, y)$ reši enačbo $xy = ${a}x + ${b}y$?`,
        answer: num(sols.length),
        hint: `Prenesi vse na eno stran in dopolni do produkta: $(x - ${b})(y - ${a}) = ${a * b}$.`,
        data: { given: [`a = ${a}`, `b = ${b}`], find: ["\\text{število rešitev}"] },
        formula: "xy - ax - by + ab = (x - b)(y - a)",
        solution: `$xy - ${a}x - ${b}y = 0 \\iff (x - ${b})(y - ${a}) = ${a * b}$. Faktorja morata biti pozitivna delitelja števila ${a * b} (negativna bi dala $x$ ali $y \\le 0$).\nRešitve: ${sols.join(", ")}. Skupaj $${sols.length}$.`,
      };
    },
  },
  {
    id: "tek-legendre",
    topics: [T("prastevila-in-eksponent-prastevila")],
    gen(level, r) {
      const legendre = (n, p) => {
        let e = 0;
        for (let q = p; q <= n; q *= p) e += Math.floor(n / q);
        return e;
      };
      const terms = (n, p) => {
        const out = [];
        for (let q = p, i = 1; q <= n; q *= p, i++) out.push(`\\left\\lfloor \\tfrac{${n}}{${p}${i > 1 ? `^{${i}}` : ""}} \\right\\rfloor`);
        return out;
      };
      if (level <= 2) {
        const n = r.int(30, level === 1 ? 300 : 2000);
        const p = level === 1 ? 5 : r.pick([2, 3, 7, 11]);
        const e = legendre(n, p);
        const vals = [];
        for (let q = p; q <= n; q *= p) vals.push(Math.floor(n / q));
        return {
          text: level === 1 ? `S koliko ničlami se konča število $${n}!$?` : `Kateri je največji $k$, da $${p}^k$ deli $${n}!$?`,
          answer: num(e),
          hint: level === 1 ? "Ničle nastanejo iz faktorjev $10 = 2 \\cdot 5$. Petic je manj kot dvojk, zato preštej faktorje 5 v vseh številih do $n$." : "Legendrova formula: seštej, koliko števil do $n$ je deljivih s $p$, s $p^2$, s $p^3$ …",
          data: { given: [`n = ${n}`, ...(level === 1 ? [] : [`p = ${p}`])], find: [level === 1 ? "\\text{število ničel}" : "k"] },
          formula: "v_p(n!) = \\left\\lfloor \\tfrac{n}{p} \\right\\rfloor + \\left\\lfloor \\tfrac{n}{p^2} \\right\\rfloor + \\ldots",
          solution: `$v_{${p}}(${n}!) = ${terms(n, p).join(" + ")} = ${vals.join(" + ")} = ${e}$.${level === 1 ? `\nDvojk je več, zato je ničel $${e}$.` : ""}`,
        };
      }
      const a = r.pick([3, 5, 7]), n = r.int(4, 120);
      const v = (x) => {
        let k = 0;
        while (x % 2n === 0n) (x /= 2n), k++;
        return k;
      };
      const ans = v(BigInt(a) ** BigInt(n) - 1n);
      return {
        text: `Kateri je največji $k$, da $2^k$ deli število $${a}^{${n}} - 1$?`,
        answer: num(ans),
        hint: "Za lih $a$ in sod $n$ velja $v_2(a^n - 1) = v_2(a - 1) + v_2(a + 1) + v_2(n) - 1$ (lema o dvigovanju eksponenta). Za lih $n$ je $v_2(a^n - 1) = v_2(a - 1)$.",
        data: { given: [`a = ${a}`, `n = ${n}`], find: ["k"] },
        formula: n % 2 ? "v_2(a^n - 1) = v_2(a - 1) \\quad (n \\text{ lih})" : "v_2(a^n - 1) = v_2(a-1) + v_2(a+1) + v_2(n) - 1",
        solution:
          n % 2
            ? `$n$ je lih, zato $${a}^{${n}} - 1 = (${a} - 1)(${a}^{${n - 1}} + \\ldots + 1)$, drugi faktor je vsota ${n} lihih števil, torej lih. $v_2 = v_2(${a - 1}) = ${ans}$.`
            : `$v_2(${a - 1}) = ${v(BigInt(a - 1))}$, $v_2(${a + 1}) = ${v(BigInt(a + 1))}$, $v_2(${n}) = ${v(BigInt(n))}$.\n$k = ${v(BigInt(a - 1))} + ${v(BigInt(a + 1))} + ${v(BigInt(n))} - 1 = ${ans}$.`,
      };
    },
  },
  {
    id: "tek-am-gm",
    topics: [T("neenakosti-med-sredinami")],
    gen(level, r) {
      if (level === 1) {
        let a, b;
        do (a = r.int(1, 12)), (b = r.int(1, 50));
        while (!sq(a * b));
        const m = 2 * Math.sqrt(a * b);
        return {
          text: `Kolikšna je najmanjša vrednost izraza $${a === 1 ? "" : a}x + \\dfrac{${b}}{x}$ za pozitivna realna števila $x$?`,
          answer: num(m),
          hint: "Uporabi neenakost med aritmetično in geometrijsko sredino za dva člena: $u + v \\ge 2\\sqrt{uv}$.",
          data: false,
          formula: "u + v \\ge 2\\sqrt{uv}",
          solution: `$${a}x + \\dfrac{${b}}{x} \\ge 2\\sqrt{${a}x \\cdot \\dfrac{${b}}{x}} = 2\\sqrt{${a * b}} = ${m}$.\nEnakost velja pri $${a}x = \\dfrac{${b}}{x}$, torej $x = ${sq(b / a) ? Math.sqrt(b / a) : `\\sqrt{${fracTex(b, a)}}`}$. Najmanjša vrednost je $${m}$.`,
        };
      }
      if (level === 2) {
        const p = r.int(1, 6), q = r.int(1, 6), S = r.int(6, 40);
        // max xy pri px + qy = S: S^2/(4pq)
        return {
          text: `Pozitivni realni števili $x$ in $y$ zadoščata pogoju $${p === 1 ? "" : p}x + ${q === 1 ? "" : q}y = ${S}$. Kolikšna je največja možna vrednost produkta $xy$?`,
          answer: fracAns(S * S, 4 * p * q),
          hint: "Uporabi AM-GM za člena $px$ in $qy$: $px \\cdot qy \\le \\left(\\tfrac{px + qy}{2}\\right)^2$.",
          data: { given: [`${p === 1 ? "" : p}x + ${q === 1 ? "" : q}y = ${S}`], find: ["\\max xy"] },
          formula: "uv \\le \\left(\\dfrac{u + v}{2}\\right)^2",
          solution: `$${p === 1 ? "" : p}x \\cdot ${q === 1 ? "" : q}y \\le \\left(\\dfrac{${S}}{2}\\right)^2 = ${fracTex(S * S, 4)}$, zato $xy \\le ${fracTex(S * S, 4 * p * q)}$.\nEnakost pri $${p === 1 ? "" : p}x = ${q === 1 ? "" : q}y = ${fracTex(S, 2)}$. Odgovor: $${fracTex(S * S, 4 * p * q)}$.`,
        };
      }
      const m = r.pick([12, 24, 30, 36, 60]);
      const ds = divisors(m).filter((d) => d <= 12);
      const [p, q, s] = [r.pick(ds), r.pick(ds), r.pick(ds)];
      const x = m / p, y = m / q, z = m / s;
      const K = x * y * z;
      const co = (c) => (c === 1 ? "" : c);
      return {
        text: `Pozitivna realna števila $x$, $y$, $z$ zadoščajo pogoju $xyz = ${K}$. Kolikšna je najmanjša vrednost izraza $${co(p)}x + ${co(q)}y + ${co(s)}z$?`,
        answer: num(3 * m),
        hint: "AM-GM za tri člene: $u + v + w \\ge 3\\sqrt[3]{uvw}$, kjer so $u = px$, $v = qy$, $w = rz$.",
        data: { given: [`xyz = ${K}`], find: ["\\min"] },
        formula: "u + v + w \\ge 3\\sqrt[3]{uvw}",
        solution: `$${co(p)}x + ${co(q)}y + ${co(s)}z \\ge 3\\sqrt[3]{${p * q * s} \\cdot xyz} = 3\\sqrt[3]{${p * q * s * K}} = 3 \\cdot ${m} = ${3 * m}$.\nEnakost pri $${co(p)}x = ${co(q)}y = ${co(s)}z = ${m}$, tj. $x = ${x}, y = ${y}, z = ${z}$.`,
      };
    },
  },
  {
    id: "tek-cauchy-urejanje",
    topics: [T("cauchy-schwarzeva-neenakost-in-urejanje")],
    gen(level, r) {
      if (level === 1) {
        const A = r.shuffle([...new Set(Array.from({ length: 6 }, () => r.int(1, 12)))]).slice(0, 4).sort((a, b) => a - b);
        const B = r.shuffle([...new Set(Array.from({ length: 6 }, () => r.int(1, 12)))]).slice(0, A.length).sort((a, b) => a - b);
        const n = Math.min(A.length, B.length);
        const a = A.slice(0, n), b = B.slice(0, n);
        const max = r.next() < 0.6;
        const bb = max ? b : [...b].reverse();
        const val = a.reduce((s, x, i) => s + x * bb[i], 0);
        return {
          text: `Števila ${a.join(", ")} razporedimo v pare s števili ${b.join(", ")} (vsako uporabimo natanko enkrat) in seštejemo produkte parov. Kolikšna je ${max ? "največja" : "najmanjša"} možna vsota?`,
          answer: num(val),
          hint: `Neenakost urejanja: vsota produktov je največja, ko sta zaporedji urejeni enako, in najmanjša, ko sta urejeni nasprotno.`,
          data: false,
          formula: "a_1 \\le \\ldots \\le a_n, \\; b_1 \\le \\ldots \\le b_n \\Rightarrow \\sum a_i b_{n+1-i} \\le \\sum a_i b_{\\sigma(i)} \\le \\sum a_i b_i",
          solution: `${max ? "Največjo" : "Najmanjšo"} vsoto dobimo, ko najmanjše število prvega niza združimo z ${max ? "najmanjšim" : "največjim"} drugega in tako naprej:\n$${a.map((x, i) => `${x} \\cdot ${bb[i]}`).join(" + ")} = ${val}$.`,
        };
      }
      if (level === 2) {
        const a = r.int(1, 5), b = r.int(1, 5), c = r.int(1, 5), d = r.int(2, 20);
        const s = a * a + b * b + c * c;
        const co = (k) => (k === 1 ? "" : k);
        return {
          text: `Realna števila $x$, $y$, $z$ zadoščajo pogoju $${co(a)}x + ${co(b)}y + ${co(c)}z = ${d}$. Kolikšna je najmanjša možna vrednost izraza $x^2 + y^2 + z^2$?`,
          answer: fracAns(d * d, s),
          hint: "Cauchy-Schwarzeva neenakost: $(ax + by + cz)^2 \\le (a^2 + b^2 + c^2)(x^2 + y^2 + z^2)$.",
          data: { given: [`d = ${d}`], find: ["\\min (x^2 + y^2 + z^2)"] },
          formula: "(ax + by + cz)^2 \\le (a^2 + b^2 + c^2)(x^2 + y^2 + z^2)",
          solution: `$${d}^2 \\le (${a}^2 + ${b}^2 + ${c}^2)(x^2 + y^2 + z^2) = ${s}(x^2 + y^2 + z^2)$, torej $x^2 + y^2 + z^2 \\ge ${fracTex(d * d, s)}$.\nEnakost velja, ko je $(x, y, z)$ sorazmeren z $(${a}, ${b}, ${c})$. Odgovor: $${fracTex(d * d, s)}$.`,
        };
      }
      const a = r.int(1, 6), b = r.int(1, 6), S = r.int(2, 15);
      return {
        text: `Pozitivni realni števili $x$ in $y$ zadoščata pogoju $x + y = ${S}$. Kolikšna je najmanjša vrednost izraza $\\dfrac{${a * a}}{x} + \\dfrac{${b * b}}{y}$?`,
        answer: fracAns((a + b) ** 2, S),
        hint: "Uporabi Cauchy-Schwarzevo neenakost v obliki $\\dfrac{u^2}{x} + \\dfrac{v^2}{y} \\ge \\dfrac{(u + v)^2}{x + y}$.",
        data: { given: [`x + y = ${S}`], find: ["\\min"] },
        formula: "\\dfrac{u^2}{x} + \\dfrac{v^2}{y} \\ge \\dfrac{(u+v)^2}{x+y}",
        solution: `$\\dfrac{${a}^2}{x} + \\dfrac{${b}^2}{y} \\ge \\dfrac{(${a} + ${b})^2}{x + y} = \\dfrac{${(a + b) ** 2}}{${S}}$.\nEnakost pri $\\tfrac{${a}}{x} = \\tfrac{${b}}{y}$, tj. $x = ${fracTex(a * S, a + b)}$. Odgovor: $${fracTex((a + b) ** 2, S)}$.`,
      };
    },
  },
  {
    id: "tek-vieta",
    topics: [T("polinomi-in-vietove-formule")],
    gen(level, r) {
      const p = r.int(-9, 9) || 3, q = r.nonZero(-12, 12);
      const eq = `x^2 ${p > 0 ? "-" : "+"} ${Math.abs(p)}x ${q > 0 ? "+" : "-"} ${Math.abs(q)} = 0`;
      const given = [`x_1 + x_2 = ${p}`, `x_1 x_2 = ${q}`];
      if (level === 1) {
        return {
          text: `Naj bosta $x_1$ in $x_2$ rešitvi enačbe $${eq}$ (lahko tudi kompleksni). Izračunaj $x_1^2 + x_2^2$.`,
          answer: num(p * p - 2 * q),
          hint: "Ne rešuj enačbe. Uporabi Vietovi formuli in $x_1^2 + x_2^2 = (x_1 + x_2)^2 - 2x_1x_2$.",
          data: false,
          formula: ["x_1 + x_2 = -\\tfrac{b}{a}, \\; x_1 x_2 = \\tfrac{c}{a}", "x_1^2 + x_2^2 = (x_1 + x_2)^2 - 2x_1x_2"],
          solution: `Po Vietu: $x_1 + x_2 = ${p}$, $x_1 x_2 = ${q}$.\n$x_1^2 + x_2^2 = ${par(p)}^2 - 2 \\cdot ${par(q)} = ${p * p - 2 * q}$.`,
        };
      }
      if (level === 2) {
        const v = r.pick(["cube", "recip"]);
        if (v === "cube") {
          return {
            text: `Naj bosta $x_1$ in $x_2$ rešitvi enačbe $${eq}$. Izračunaj $x_1^3 + x_2^3$.`,
            answer: num(p ** 3 - 3 * p * q),
            hint: "$x_1^3 + x_2^3 = (x_1 + x_2)^3 - 3x_1x_2(x_1 + x_2)$.",
            data: false,
            formula: "x_1^3 + x_2^3 = (x_1 + x_2)^3 - 3x_1x_2(x_1 + x_2)",
            solution: `$x_1 + x_2 = ${p}$, $x_1x_2 = ${q}$.\n$x_1^3 + x_2^3 = ${par(p)}^3 - 3 \\cdot ${par(q)} \\cdot ${par(p)} = ${p ** 3 - 3 * p * q}$.`,
          };
        }
        return {
          text: `Naj bosta $x_1$ in $x_2$ rešitvi enačbe $${eq}$. Izračunaj $\\dfrac{1}{x_1^2} + \\dfrac{1}{x_2^2}$. Rezultat zapiši kot okrajšan ulomek.`,
          answer: fracAns(p * p - 2 * q, q * q),
          hint: "$\\dfrac{1}{x_1^2} + \\dfrac{1}{x_2^2} = \\dfrac{x_1^2 + x_2^2}{(x_1x_2)^2}$.",
          data: false,
          formula: "\\dfrac{1}{x_1^2} + \\dfrac{1}{x_2^2} = \\dfrac{(x_1 + x_2)^2 - 2x_1x_2}{(x_1x_2)^2}",
          solution: `$x_1^2 + x_2^2 = ${par(p)}^2 - 2 \\cdot ${par(q)} = ${p * p - 2 * q}$, $(x_1x_2)^2 = ${q * q}$.\nRezultat: $${fracTex(p * p - 2 * q, q * q)}$.`,
        };
      }
      const a = r.int(-6, 6), b = r.int(-9, 9), c = r.nonZero(-9, 9);
      const sg = (k, s) => (k === 0 ? "" : `${k > 0 ? "+" : "-"} ${Math.abs(k) === 1 && s ? "" : Math.abs(k)}${s}`);
      const poly = `x^3 ${sg(a, "x^2")} ${sg(b, "x")} ${sg(c, "")}`.replace(/\s+/g, " ");
      if (r.next() < 0.5) {
        return {
          text: `Naj bodo $x_1$, $x_2$, $x_3$ ničle polinoma $p(x) = ${poly}$. Izračunaj $x_1^2 + x_2^2 + x_3^2$.`,
          answer: num(a * a - 2 * b),
          hint: "Vietove formule za kubični polinom: $x_1 + x_2 + x_3 = -a$, $x_1x_2 + x_2x_3 + x_3x_1 = b$. Nato $\\sum x_i^2 = (\\sum x_i)^2 - 2\\sum x_ix_j$.",
          data: false,
          formula: "x_1^2 + x_2^2 + x_3^2 = (x_1 + x_2 + x_3)^2 - 2(x_1x_2 + x_2x_3 + x_3x_1)",
          solution: `$x_1 + x_2 + x_3 = ${-a}$, $x_1x_2 + x_2x_3 + x_3x_1 = ${b}$.\n$x_1^2 + x_2^2 + x_3^2 = ${par(-a)}^2 - 2 \\cdot ${par(b)} = ${a * a - 2 * b}$.`,
        };
      }
      return {
        text: `Naj bodo $x_1$, $x_2$, $x_3$ ničle polinoma $p(x) = ${poly}$. Izračunaj $\\dfrac{1}{x_1} + \\dfrac{1}{x_2} + \\dfrac{1}{x_3}$ (kot okrajšan ulomek ali celo število).`,
        answer: fracAns(-b, c),
        hint: "Seštej ulomke: $\\dfrac{x_2x_3 + x_1x_3 + x_1x_2}{x_1x_2x_3}$, nato uporabi Vietove formule.",
        data: false,
        formula: "\\sum \\dfrac{1}{x_i} = \\dfrac{x_1x_2 + x_2x_3 + x_3x_1}{x_1x_2x_3}",
        solution: `$x_1x_2 + x_2x_3 + x_3x_1 = ${b}$, $x_1x_2x_3 = ${-c}$.\nVsota: $\\dfrac{${b}}{${-c}} = ${fracTex(-b, c)}$.`,
      };
    },
  },
  {
    id: "tek-funkcijske",
    topics: [T("funkcijske-enacbe")],
    gen(level, r) {
      if (level === 1) {
        const a = r.int(1, 9), b = r.int(1, 9), i = r.int(1, 5), j = r.int(1, 4);
        const N = 2 ** i * 3 ** j;
        return {
          text: `Funkcija $f$, definirana na pozitivnih realnih številih, zadošča $f(xy) = f(x) + f(y)$ za vse $x, y > 0$. Velja $f(2) = ${a}$ in $f(3) = ${b}$. Izračunaj $f(${N})$.`,
          answer: num(i * a + j * b),
          hint: `Razcepi ${N} na prafaktorje in uporabi enačbo večkrat: $f(x^k) = k f(x)$.`,
          data: { given: [`f(2) = ${a}`, `f(3) = ${b}`], find: [`f(${N})`] },
          formula: "f(xy) = f(x) + f(y) \\Rightarrow f(2^i 3^j) = i f(2) + j f(3)",
          solution: `$${N} = 2^{${i}} \\cdot 3^{${j}}$, zato $f(${N}) = ${i} f(2) + ${j} f(3) = ${i} \\cdot ${a} + ${j} \\cdot ${b} = ${i * a + j * b}$.`,
        };
      }
      if (level === 2) {
        const kk = r.pick([2, 3, 4]), m = r.int(1, 6), n = r.int(-5, 5), t = r.int(-4, 6);
        // f(x) + k f(1-x) = m x + n  ->  f(x) = [m x + n - k(m(1-x) + n)] / (1 - k^2)
        const numr = m * t + n - kk * (m * (1 - t) + n), den = 1 - kk * kk;
        return {
          text: `Funkcija $f$ zadošča enačbi $f(x) + ${kk} f(1 - x) = ${m === 1 ? "" : m}x ${n < 0 ? "-" : "+"} ${Math.abs(n)}$ za vsa realna števila $x$. Izračunaj $f(${t})$.`,
          answer: fracAns(numr, den),
          hint: "V enačbo vstavi $1 - x$ namesto $x$. Dobiš drugo enačbo z istima neznankama $f(x)$ in $f(1 - x)$; reši sistem.",
          data: false,
          formula: "x \\mapsto 1 - x",
          solution: `Pri $x = ${t}$: $f(${t}) + ${kk} f(${1 - t}) = ${m * t + n}$.\nPri $x = ${1 - t}$: $f(${1 - t}) + ${kk} f(${t}) = ${m * (1 - t) + n}$.\nDrugo pomnožimo s ${kk} in odštejemo od prve: $(1 - ${kk * kk}) f(${t}) = ${m * t + n} - ${kk} \\cdot ${par(m * (1 - t) + n)} = ${numr}$.\n$f(${t}) = ${fracTex(numr, den)}$.`,
        };
      }
      const kk = r.pick([2, 3]), m = r.int(1, 6), t = r.pick([2, 3, 4, 5, -2, -3]);
      // f(x) + k f(1/x) = m x  ->  f(t) = m(t - k/t)/(1 - k^2) = m(t^2 - k)/(t(1 - k^2))
      const numr = m * (t * t - kk), den = t * (1 - kk * kk);
      return {
        text: `Funkcija $f$ zadošča enačbi $f(x) + ${kk} f\\left(\\tfrac{1}{x}\\right) = ${m === 1 ? "" : m}x$ za vse $x \\ne 0$. Izračunaj $f(${t})$.`,
        answer: fracAns(numr, den),
        hint: "Vstavi $\\tfrac{1}{x}$ namesto $x$ in reši sistem dveh enačb za $f(x)$ in $f(1/x)$.",
        data: false,
        formula: "x \\mapsto \\tfrac{1}{x}",
        solution: `Pri $x = ${t}$: $f(${t}) + ${kk} f(${fracTex(1, t)}) = ${m * t}$.\nPri $x = ${fracTex(1, t)}$: $f(${fracTex(1, t)}) + ${kk} f(${t}) = ${fracTex(m, t)}$.\nIz druge izrazimo $f(${fracTex(1, t)})$ in vstavimo v prvo: $(1 - ${kk * kk}) f(${t}) = ${m * t} - ${t < 0 ? `\\left(${fracTex(kk * m, t)}\\right)` : fracTex(kk * m, t)}$.\n$f(${t}) = ${fracTex(numr, den)}$.`,
      };
    },
  },
  {
    id: "tek-rekurzije",
    topics: [T("zaporedja-rekurzije-in-indukcija")],
    gen(level, r) {
      if (level === 1) {
        const a1 = r.int(1, 5), c = r.int(1, 5), k = r.int(6, 12), m = r.pick([2, 3]);
        const seq = [a1];
        for (let i = 1; i < k; i++) seq.push(m * seq[i - 1] + c);
        return {
          text: `Zaporedje je dano z $a_1 = ${a1}$ in $a_{n+1} = ${m}a_n + ${c}$. Izračunaj $a_{${k}}$.`,
          answer: num(seq[k - 1]),
          hint: `Prištej konstanto, da dobiš geometrijsko zaporedje: $a_n + ${fracTex(c, m - 1)}$ se vsakič pomnoži z ${m}.`,
          data: { given: [`a_1 = ${a1}`, `k = ${k}`], find: [`a_{${k}}`] },
          formula: `a_n + \\tfrac{c}{m-1} = \\left(a_1 + \\tfrac{c}{m-1}\\right) m^{n-1}`,
          solution: `$a_n + ${fracTex(c, m - 1)} = \\left(${a1} + ${fracTex(c, m - 1)}\\right) \\cdot ${m}^{n-1}$.\nZa $n = ${k}$: $a_{${k}} = ${seq[k - 1]}$ (preveri: ${seq.slice(0, 5).join(", ")}, …).`,
        };
      }
      if (level === 2) {
        const v = r.pick(["domine", "stopnice"]);
        const n = r.int(6, 14);
        if (v === "domine") {
          const f = [1, 1];
          for (let i = 2; i <= n; i++) f.push(f[i - 1] + f[i - 2]);
          return {
            text: `Na koliko načinov lahko pravokotnik velikosti $2 \\times ${n}$ v celoti prekrijemo z dominami velikosti $1 \\times 2$ (brez prekrivanja)?`,
            answer: num(f[n]),
            hint: "Poglej levi rob: ali je tam pokončna domina ali par ležečih? Tako dobiš rekurzijo $t_n = t_{n-1} + t_{n-2}$.",
            data: { given: [`n = ${n}`], find: ["t_n"] },
            formula: "t_n = t_{n-1} + t_{n-2}, \\; t_1 = 1, \\; t_2 = 2",
            solution: `$t_1 = 1$, $t_2 = 2$, nato $t_n = t_{n-1} + t_{n-2}$: ${f.slice(1, n + 1).join(", ")}.\nZa $n = ${n}$ je načinov $${f[n]}$.`,
          };
        }
        const s = [1, 1, 2];
        for (let i = 3; i <= n; i++) s.push(s[i - 1] + s[i - 2] + s[i - 3]);
        return {
          text: `Po stopnicah z ${n} stopnicami gremo navzgor tako, da v enem koraku stopimo na naslednjo, ali preskočimo eno ali dve stopnici (koraki dolžine 1, 2 ali 3). Na koliko načinov pridemo na vrh?`,
          answer: num(s[n]),
          hint: "Zadnji korak je dolžine 1, 2 ali 3. Zato $s_n = s_{n-1} + s_{n-2} + s_{n-3}$.",
          data: { given: [`n = ${n}`], find: ["s_n"] },
          formula: "s_n = s_{n-1} + s_{n-2} + s_{n-3}",
          solution: `$s_0 = 1, s_1 = 1, s_2 = 2$, nato $s_n = s_{n-1} + s_{n-2} + s_{n-3}$: ${s.join(", ")}.\nOdgovor: $${s[n]}$.`,
        };
      }
      if (r.next() < 0.5) {
        const n = r.int(6, 16);
        const f = [1, 2];
        for (let i = 2; i <= n; i++) f.push(f[i - 1] + f[i - 2]);
        return {
          text: `Koliko je zaporedij dolžine ${n} iz ničel in enic, v katerih nikjer ni dveh enic zapored?`,
          answer: num(f[n]),
          hint: "Če zaporedje konča z 0, je pred njo poljubno dobro zaporedje dolžine $n-1$; če konča z 1, je pred njo 0.",
          data: { given: [`n = ${n}`], find: ["a_n"] },
          formula: "a_n = a_{n-1} + a_{n-2}, \\; a_1 = 2, \\; a_2 = 3",
          solution: `$a_1 = 2$, $a_2 = 3$, $a_n = a_{n-1} + a_{n-2}$: ${f.slice(1).join(", ")}.\nOdgovor: $${f[n]}$.`,
        };
      }
      const p = r.int(1, 4), q = r.int(1, 4), a0 = r.int(0, 3), a1 = r.int(1, 4), n = r.int(6, 10);
      const s = [a0, a1];
      for (let i = 2; i <= n; i++) s.push(p * s[i - 1] + q * s[i - 2]);
      return {
        text: `Zaporedje je dano z $a_0 = ${a0}$, $a_1 = ${a1}$ in $a_{n+2} = ${p === 1 ? "" : p}a_{n+1} + ${q === 1 ? "" : q}a_n$. Izračunaj $a_{${n}}$.`,
        answer: num(s[n]),
        hint: "Računaj člen za členom (ali poišči karakteristično enačbo $t^2 = pt + q$).",
        data: { given: [`a_0 = ${a0}`, `a_1 = ${a1}`], find: [`a_{${n}}`] },
        formula: "a_{n+2} = p a_{n+1} + q a_n",
        solution: `Členi: ${s.map((x, i) => `$a_{${i}} = ${x}$`).join(", ")}.\nOdgovor: $${s[n]}$.`,
      };
    },
  },
  {
    id: "tek-bijekcije",
    topics: [T("stetje-z-bijekcijami")],
    gen(level, r) {
      if (level === 1) {
        const k = r.int(3, 5), n = r.int(6, 20), pos = r.next() < 0.5;
        const ans = pos ? binom(n - 1, k - 1) : binom(n + k - 1, k - 1);
        const vars = Array.from({ length: k }, (_, i) => `x_${i + 1}`).join(" + ");
        return {
          text: `Koliko rešitev ima enačba $${vars} = ${n}$ v ${pos ? "naravnih" : "nenegativnih celih"} številih?`,
          answer: num(ans),
          hint: `Metoda zvezdic in paličic: ${n} zvezdic razdelimo s ${k - 1} paličicami.${pos ? " Vsak $x_i \\ge 1$: paličice postavljaš v vrzeli med zvezdicami." : ""}`,
          data: { given: [`n = ${n}`, `k = ${k}`], find: ["\\text{število rešitev}"] },
          formula: pos ? "\\binom{n-1}{k-1}" : "\\binom{n+k-1}{k-1}",
          solution: pos
            ? `Med ${n} zvezdicami je ${n - 1} vrzeli, izberemo ${k - 1} za paličice: $\\binom{${n - 1}}{${k - 1}} = ${ans}$.`
            : `Razporejamo ${n} zvezdic in ${k - 1} ${k - 1 === 2 ? "paličici" : "paličice"} v vrsto: $\\binom{${n + k - 1}}{${k - 1}} = ${ans}$.`,
        };
      }
      if (level === 2) {
        const [a, b, c] = r.pick([[2, 3, 5], [2, 3, 7], [3, 5, 7], [2, 5, 7], [3, 4, 5]]);
        const N = r.int(100, 1000);
        let cnt = 0;
        for (let i = 1; i <= N; i++) if (i % a && i % b && i % c) cnt++;
        const f = (d) => Math.floor(N / d);
        return {
          text: `Koliko števil od 1 do ${N} ni deljivih z nobenim od števil ${a}, ${b} in ${c}?`,
          answer: num(cnt),
          hint: "Načelo vključitev in izključitev za tri množice.",
          data: { given: [`N = ${N}`], find: ["\\text{število}"] },
          formula: "|A \\cup B \\cup C| = |A| + |B| + |C| - |A \\cap B| - |A \\cap C| - |B \\cap C| + |A \\cap B \\cap C|",
          solution: `Deljivih z vsaj enim: $${f(a)} + ${f(b)} + ${f(c)} - ${f(a * b)} - ${f(a * c)} - ${f(b * c)} + ${f(a * b * c)} = ${N - cnt}$.\nNi deljivih: $${N} - ${N - cnt} = ${cnt}$.`,
        };
      }
      if (r.next() < 0.5) {
        const n = r.int(4, 8);
        const D = [1, 0];
        for (let i = 2; i <= n; i++) D.push((i - 1) * (D[i - 1] + D[i - 2]));
        return {
          text: `${n} prijateljev napiše vsak svoje ime na listek, listke premešajo in vsak izvleče enega. Na koliko načinov se lahko zgodi, da nihče ne izvleče svojega imena?`,
          answer: num(D[n]),
          hint: "To so razporeditve brez negibnih točk (premestitve). Velja $D_n = (n-1)(D_{n-1} + D_{n-2})$.",
          data: { given: [`n = ${n}`], find: ["D_n"] },
          formula: "D_n = (n-1)(D_{n-1} + D_{n-2}), \\; D_1 = 0, \\; D_2 = 1",
          solution: `$D_1 = 0, D_2 = 1$ in naprej: ${D.slice(1).map((x, i) => `$D_{${i + 1}} = ${x}$`).join(", ")}.\nOdgovor: $${D[n]}$.`,
        };
      }
      const n = r.int(6, 15), m = r.int(3, 6);
      let c = 0;
      for (let x = 0; x <= m; x++) for (let y = 0; y <= m; y++) if (n - x - y >= 0 && n - x - y <= m) c++;
      if (!c) return null;
      return {
        text: `Koliko rešitev ima enačba $x + y + z = ${n}$, če so $x, y, z$ cela števila z $0 \\le x, y, z \\le ${m}$?`,
        answer: num(c),
        hint: `Preštej vse nenegativne rešitve in z vključitvami in izključitvami odštej tiste, kjer je kakšna spremenljivka večja od ${m}.`,
        data: { given: [`n = ${n}`, `m = ${m}`], find: ["\\text{število rešitev}"] },
        formula: "\\binom{n+2}{2} - 3\\binom{n - m + 1}{2} + 3\\binom{n - 2m}{2} - \\ldots",
        solution: `Brez zgornje meje: $\\binom{${n + 2}}{2} = ${binom(n + 2, 2)}$. Odštejemo rešitve z $x \\ge ${m + 1}$ (in enako za $y$, $z$): $3\\binom{${n - m + 1}}{2} = ${3 * binom(n - m + 1, 2)}$, prištejemo tiste, kjer sta dve prekoračeni: $3\\binom{${n - 2 * m}}{2} = ${3 * binom(n - 2 * m, 2)}$.\nSkupaj $${c}$.`,
      };
    },
  },
  {
    id: "tek-dirichlet-ss",
    topics: [T("dirichletovo-nacelo")],
    gen(level, r) {
      const n = r.int(10, 60);
      if (level === 1) {
        return {
          text: `Iz množice $\\{1, 2, \\ldots, ${2 * n}\\}$ izberemo nekaj števil. Najmanj koliko jih moramo izbrati, da bo med izbranimi zagotovo par, v katerem eno število deli drugo?`,
          answer: num(n + 1),
          hint: "Vsako število zapiši kot $2^k \\cdot m$, kjer je $m$ liho. Koliko je možnih lihih delov $m$?",
          data: { given: [`2n = ${2 * n}`], find: ["\\text{najmanjše število}"] },
          formula: "x = 2^k m, \\; m \\text{ lih}",
          solution: `Lihih delov $m$ je ${n} ($1, 3, \\ldots, ${2 * n - 1}$). Med $${n + 1}$ števili imata dve enak lih del, zato manjše deli večje.\nŠtevila $${n + 1}, ${n + 2}, \\ldots, ${2 * n}$ (${n} števil) nimajo takega para. Odgovor: $${n + 1}$.`,
        };
      }
      if (level === 2) {
        return {
          text: `Iz množice $\\{1, 2, \\ldots, ${2 * n}\\}$ izberemo nekaj števil. Najmanj koliko jih moramo izbrati, da bosta med izbranimi zagotovo dve tuji si števili?`,
          answer: num(n + 1),
          hint: "Sosednji števili sta vedno tuji. Razdeli množico v pare zaporednih števil.",
          data: { given: [`2n = ${2 * n}`], find: ["\\text{najmanjše število}"] },
          formula: "D(k, k+1) = 1",
          solution: `Pari $\\{1, 2\\}, \\{3, 4\\}, \\ldots, \\{${2 * n - 1}, ${2 * n}\\}$: ${n} parov. Med $${n + 1}$ izbranimi sta dve iz istega para, torej zaporedni in tuji.\nVsa soda števila (${n} jih je) nimajo tujega para. Odgovor: $${n + 1}$.`,
        };
      }
      const k = r.int(3, 9), box = r.pick([7, 12]);
      const what = box === 7 ? "na isti dan v tednu" : "v istem mesecu";
      const ans = box * (k - 1) + 1;
      return {
        text: `Najmanj koliko ljudi mora biti v sobi, da jih ima zagotovo vsaj ${k} rojstni dan ${what} (ne glede na leto rojstva)?`,
        answer: num(ans),
        hint: `Posplošeno Dirichletovo načelo: če je v ${box} predalih največ $k - 1$ predmetov v vsakem, je predmetov največ $${box}(k - 1)$.`,
        data: { given: [`k = ${k}`], find: ["\\text{najmanjše število ljudi}"] },
        formula: "n > p(k - 1) \\Rightarrow \\text{v nekem predalu je vsaj } k",
        solution: `$${box} \\cdot ${k - 1} = ${box * (k - 1)}$ ljudi lahko razporedimo po ${k - 1} na vsak ${box === 7 ? "dan" : "mesec"}, ne da bi jih bilo ${k} skupaj.\nZ enim več je to zagotovo: $${ans}$.`,
      };
    },
  },
  {
    id: "tek-invariante-ss",
    topics: [T("invariante-in-monovariante")],
    gen(level, r) {
      if (level === 1) {
        const n = r.int(5, 40);
        const S = (n * (n + 1)) / 2;
        return {
          text: `Na tabli so napisana števila $1, \\tfrac{1}{2}, \\tfrac{1}{3}, \\ldots, \\tfrac{1}{${n}}$. V vsakem koraku zbrišemo dve števili $a$ in $b$ ter napišemo $\\dfrac{ab}{a + b}$. Katero število ostane na koncu? (Zapiši kot ulomek.)`,
          answer: fracAns(1, S),
          hint: "Poglej obratne vrednosti: $\\dfrac{a + b}{ab} = \\dfrac{1}{a} + \\dfrac{1}{b}$. Kaj se ohranja?",
          data: false,
          formula: "\\dfrac{1}{\\frac{ab}{a+b}} = \\dfrac{1}{a} + \\dfrac{1}{b}",
          solution: `Vsota obratnih vrednosti se ohranja. Na začetku je $1 + 2 + \\ldots + ${n} = ${S}$.\nZadnje število $z$ ima $\\tfrac{1}{z} = ${S}$, torej $z = ${fracTex(1, S)}$.`,
        };
      }
      if (level === 2) {
        const n = r.int(5, 60);
        return {
          text: `Na tabli so števila $1, \\tfrac{1}{2}, \\tfrac{1}{3}, \\ldots, \\tfrac{1}{${n}}$. V vsakem koraku zbrišemo $a$ in $b$ ter napišemo $a + b + ab$. Katero število ostane na koncu?`,
          answer: num(n),
          hint: "$a + b + ab + 1 = (1 + a)(1 + b)$. Kateri zmnožek se torej ohranja?",
          data: false,
          formula: "a + b + ab + 1 = (1 + a)(1 + b)",
          solution: `Ohranja se zmnožek $\\prod (1 + x)$. Na začetku: $\\left(1 + 1\\right)\\left(1 + \\tfrac{1}{2}\\right)\\cdots\\left(1 + \\tfrac{1}{${n}}\\right) = \\tfrac{2}{1} \\cdot \\tfrac{3}{2} \\cdots \\tfrac{${n + 1}}{${n}} = ${n + 1}$.\nZadnje število $z$: $1 + z = ${n + 1}$, torej $z = ${n}$.`,
        };
      }
      for (let tries = 0; tries < 200; tries++) {
        const c = [r.int(1, 15), r.int(1, 15), r.int(1, 15)];
        const tot = c[0] + c[1] + c[2];
        const key = (s) => s.join(",");
        const dist = new Map([[key(c), 0]]);
        const q = [c];
        let best = null;
        while (q.length) {
          const s = q.shift();
          const d = dist.get(key(s));
          if (s.includes(tot)) {
            best = d;
            break;
          }
          for (const [i, j, k] of [[0, 1, 2], [0, 2, 1], [1, 2, 0]]) {
            if (!s[i] || !s[j]) continue;
            const t = [...s];
            t[i]--, t[j]--, (t[k] += 2);
            if (!dist.has(key(t))) dist.set(key(t), d + 1), q.push(t);
          }
        }
        if (best === null || best < 3) continue;
        return {
          text: `Na otoku živijo kameleoni treh barv: rdečih je ${c[0]}, zelenih ${c[1]} in modrih ${c[2]}. Ko se srečata dva kameleona različnih barv, oba spremenita barvo v tretjo. Najmanj koliko srečanj je potrebnih, da so vsi kameleoni iste barve?`,
          answer: num(best),
          hint: "Najprej z invarianto (razlike po modulu 3) ugotovi, katere barve so lahko na koncu vsi. Nato pomisli, kako hitro izenačiš drugi dve barvi in ju nato »porabiš«.",
          data: false,
          formula: "\\text{razlike števil dveh barv se spremenijo za } 0 \\text{ ali } \\pm 3",
          solution: `Razlike števil dveh barv se po modulu 3 ne spremenijo, zato so lahko na koncu vsi le v barvi, pri kateri je razlika drugih dveh deljiva s 3.\nVsako srečanje zmanjša vsoto drugih dveh barv za največ 2; pregled vseh možnih zaporedij srečanj pokaže, da je najmanjše število srečanj $${best}$.`,
        };
      }
      return null;
    },
  },
  {
    id: "tek-ekstremalni",
    topics: [T("ekstremalni-princip")],
    gen(level, r) {
      if (level === 1) {
        const n = r.int(4, 12);
        const piece = r.pick(["kraljev", "trdnjav", "lovcev"]);
        const ans = piece === "kraljev" ? Math.ceil(n / 2) ** 2 : piece === "trdnjav" ? n : 2 * n - 2;
        const why = {
          kraljev: `Šahovnico razdelimo na $${Math.ceil(n / 2)}^2$ kvadratov $2 \\times 2$ (ob robu po potrebi manjših); v vsakem je lahko le en kralj. Kralji na poljih z obema lihima koordinatama to dosežejo.`,
          trdnjav: "V vsaki vrstici je lahko le ena trdnjava; trdnjave na diagonali se ne napadajo.",
          lovcev: `Diagonal v eni smeri je $${2 * n - 1}$, a skrajni dve (kotni polji) ležita na isti diagonali v drugi smeri, zato največ $${2 * n - 2}$; to se doseže z lovci v prvem in zadnjem stolpcu brez enega kota.`,
        }[piece];
        return {
          text: `Največ koliko ${piece} lahko postavimo na šahovnico ${n} × ${n}, da se nobena dva ne napadata?`,
          answer: num(ans),
          hint: "Poišči oviro (razdelitev šahovnice na dele, v katerih je lahko le ena figura) in nato postavitev, ki to oviro doseže.",
          data: { given: [`n = ${n}`], find: ["\\text{največje število}"] },
          formula: false,
          solution: `${why}\nOdgovor: $${ans}$.`,
        };
      }
      if (level === 2) {
        const N = r.int(20, 100), k = r.int(3, 10);
        const cnt = Array(k).fill(0);
        for (let i = 1; i <= N; i++) cnt[i % k]++;
        let best = cnt[0] ? 1 : 0;
        for (let a = 1; a < k - a; a++) best += Math.max(cnt[a], cnt[k - a]);
        if (k % 2 === 0 && cnt[k / 2]) best += 1;
        return {
          text: `Največ koliko števil lahko izberemo iz množice $\\{1, 2, \\ldots, ${N}\\}$, da vsota nobenih dveh izbranih ni deljiva s ${k}?`,
          answer: num(best),
          hint: `Razvrsti števila po ostanku pri deljenju s ${k}. Ostanka $a$ in $${k} - a$ ne smeta biti oba izbrana; iz ostanka 0${k % 2 === 0 ? ` in ${k / 2}` : ""} lahko vzameš največ eno število.`,
          data: { given: [`N = ${N}`, `k = ${k}`], find: ["\\text{največje število}"] },
          formula: false,
          solution: `Število števil z ostankom $0, 1, \\ldots, ${k - 1}$: ${cnt.join(", ")}.\nIz vsakega para ostankov $\\{a, ${k} - a\\}$ vzamemo večji razred, iz ostanka 0${k % 2 === 0 ? ` in ${k / 2}` : ""} po eno število.\nNajveč: $${best}$.`,
        };
      }
      const N = r.int(20, 80), d = r.int(2, 6);
      let best = 0;
      const lens = [];
      for (let s = 1; s <= d; s++) {
        const L = Math.floor((N - s) / d) + 1;
        lens.push(L);
        best += Math.ceil(L / 2);
      }
      return {
        text: `Največ koliko števil lahko izberemo iz množice $\\{1, 2, \\ldots, ${N}\\}$, da se nobeni dve izbrani števili ne razlikujeta za natanko ${d}?`,
        answer: num(best),
        hint: `Razdeli števila v verige $s, s + ${d}, s + ${2 * d}, \\ldots$ glede na ostanek pri deljenju z ${d}. V verigi ne smeš izbrati dveh sosednjih.`,
        data: { given: [`N = ${N}`, `d = ${d}`], find: ["\\text{največje število}"] },
        formula: "\\text{iz verige dolžine } L \\text{ največ } \\lceil L/2 \\rceil",
        solution: `Verige imajo dolžine ${lens.join(", ")}. Iz verige dolžine $L$ lahko izberemo največ $\\lceil L/2 \\rceil$ (vsako drugo).\nSkupaj: $${lens.map((L) => Math.ceil(L / 2)).join(" + ")} = ${best}$.`,
      };
    },
  },
  {
    id: "tek-grafi",
    topics: [T("grafi-in-barvanja")],
    gen(level, r) {
      if (level === 1) {
        const n = r.int(6, 20);
        if (r.next() < 0.5) {
          let d;
          do d = r.int(2, n - 2);
          while ((n * d) % 2);
          return {
            text: `Na turnirju je ${n} ekip in vsaka igra natanko ${d} tekem (vsaka tekma je med dvema ekipama). Koliko tekem je odigranih?`,
            answer: num((n * d) / 2),
            hint: "Seštej število tekem vseh ekip. Kolikokrat si štel vsako tekmo?",
            data: { given: [`n = ${n}`, `d = ${d}`], find: ["\\text{število tekem}"] },
            formula: "\\sum \\deg(v) = 2 |E|",
            solution: `Vsota stopenj je $${n} \\cdot ${d} = ${n * d}$, vsaka tekma je šteta dvakrat. Tekem je $${(n * d) / 2}$.`,
          };
        }
        return {
          text: `Na zabavi je ${n / 2 === Math.floor(n / 2) ? n : n + 1} ljudi: ${n / 2 === Math.floor(n / 2) ? n / 2 : (n + 1) / 2} parov. Vsak se rokuje z vsemi, razen s seboj in svojim partnerjem. Koliko je rokovanj?`,
          answer: num(((n % 2 ? n + 1 : n) * ((n % 2 ? n + 1 : n) - 2)) / 2),
          hint: "Vsak se rokuje z $n - 2$ ljudmi. Vsako rokovanje vključuje dva človeka.",
          data: { given: [`n = ${n % 2 ? n + 1 : n}`], find: ["\\text{število rokovanj}"] },
          formula: "\\dfrac{n(n-2)}{2}",
          solution: `$\\dfrac{${n % 2 ? n + 1 : n} \\cdot ${(n % 2 ? n + 1 : n) - 2}}{2} = ${((n % 2 ? n + 1 : n) * ((n % 2 ? n + 1 : n) - 2)) / 2}$.`,
        };
      }
      if (level === 2) {
        const len = r.int(5, 7);
        const seq = Array.from({ length: len }, () => r.int(1, len - 1));
        if (seq.reduce((a, b) => a + b, 0) % 2 && r.next() < 0.7) seq[0] = seq[0] === len - 1 ? seq[0] - 1 : seq[0] + 1;
        seq.sort((a, b) => b - a);
        // Havel–Hakimi
        const hh = (s) => {
          s = [...s].sort((a, b) => b - a);
          while (s.length && s[0] > 0) {
            const d = s.shift();
            if (d > s.length) return false;
            for (let i = 0; i < d; i++) if (--s[i] < 0) return false;
            s.sort((a, b) => b - a);
          }
          return true;
        };
        const ok = hh(seq);
        const sum = seq.reduce((a, b) => a + b, 0);
        const correct = ok ? "Da, tak graf obstaja." : "Ne, tak graf ne obstaja.";
        return {
          text: `Ali obstaja enostaven graf (brez zank in večkratnih povezav) s ${len} točkami, katerih stopnje so ${seq.join(", ")}?`,
          answer: { type: "choice", options: ["Da, tak graf obstaja.", "Ne, tak graf ne obstaja."], index: ok ? 0 : 1 },
          hint: "Najprej preveri, ali je vsota stopenj soda. Nato uporabi Havel-Hakimijev postopek: točko z največjo stopnjo $d$ poveži z naslednjimi $d$ točkami in jo odstrani.",
          data: false,
          formula: "\\sum \\deg(v) = 2|E|",
          solution: `Vsota stopenj je ${sum}${sum % 2 ? ", kar je liho, zato graf ne obstaja." : ", kar je sodo."}${
            sum % 2 ? "" : ` Havel-Hakimijev postopek (ponavljamo: odstrani največjo stopnjo $d$ in naslednjim $d$ stopnjam odštej 1) ${ok ? "pride do samih ničel, zato graf obstaja." : "da negativno stopnjo ali premalo točk, zato graf ne obstaja."}`
          }\nOdgovor: ${correct}`,
        };
      }
      const n = r.int(5, 30);
      const ans = Math.floor((n * n) / 4);
      return {
        text: `Največ koliko povezav ima lahko enostaven graf s ${n} točkami, ki ne vsebuje nobenega trikotnika?`,
        answer: num(ans),
        hint: "Mantelov izrek: največ povezav ima polni dvodelni graf z delom čim bolj enakih velikosti.",
        data: { given: [`n = ${n}`], find: ["|E|_{\\max}"] },
        formula: "|E| \\le \\left\\lfloor \\dfrac{n^2}{4} \\right\\rfloor",
        solution: `Polni dvodelni graf $K_{${Math.floor(n / 2)}, ${Math.ceil(n / 2)}}$ nima trikotnikov in ima $${Math.floor(n / 2)} \\cdot ${Math.ceil(n / 2)} = ${ans}$ povezav; več po Mantelovem izreku ni mogoče.`,
      };
    },
  },
  {
    id: "tek-koti-krog",
    topics: [T("koti-v-kroznici-in-tetivni-stirikotniki")],
    gen(level, r) {
      if (level === 1) {
        const c = 2 * r.int(20, 85);
        const major = r.next() < 0.6;
        const ans = major ? c / 2 : 180 - c / 2;
        return {
          text: `Središčni kot nad tetivo $AB$ krožnice meri $\\angle AOB = ${c}^\\circ$. Točka $C$ leži na ${major ? "večjem" : "manjšem"} loku $AB$. Koliko meri kot $\\angle ACB$?`,
          answer: num(ans, "°", null, { unitAlternatives: ["stopinj"] }),
          hint: "Obodni kot je polovica središčnega kota nad istim lokom. Točka na drugem loku »vidi« drugi lok.",
          data: { given: [`\\angle AOB = ${c}^\\circ`], find: ["\\angle ACB"] },
          formula: ["\\text{obodni kot} = \\tfrac{1}{2}\\, \\text{središčni kot}", "\\alpha + \\alpha' = 180^\\circ"],
          solution: major
            ? `$\\angle ACB = \\tfrac{1}{2} \\cdot ${c}^\\circ = ${c / 2}^\\circ$.`
            : `Na večjem loku bi bil obodni kot $${c / 2}^\\circ$; točka na manjšem loku tvori s to točko tetivni štirikotnik, zato $\\angle ACB = 180^\\circ - ${c / 2}^\\circ = ${ans}^\\circ$.`,
        };
      }
      if (level === 2) {
        let x, y, z;
        do (x = r.int(15, 70)), (y = r.int(15, 70)), (z = r.int(15, 70));
        while (x + y + z >= 170 || y + z >= 160);
        return {
          text: `Štirikotnik $ABCD$ je tetiven. Velja $\\angle BAC = ${x}^\\circ$, $\\angle CAD = ${y}^\\circ$ in $\\angle ABD = ${z}^\\circ$. Koliko meri kot $\\angle ADC$?`,
          answer: num(180 - y - z, "°", null, { unitAlternatives: ["stopinj"] }),
          hint: "Obodni koti nad isto tetivo so enaki: $\\angle DBC = \\angle DAC$. Nasprotna kota tetivnega štirikotnika dasta $180^\\circ$.",
          data: { given: [`\\angle BAC = ${x}^\\circ`, `\\angle CAD = ${y}^\\circ`, `\\angle ABD = ${z}^\\circ`], find: ["\\angle ADC"] },
          formula: ["\\angle DBC = \\angle DAC", "\\angle ABC + \\angle ADC = 180^\\circ"],
          solution: `$\\angle DBC = \\angle DAC = ${y}^\\circ$ (oba nad tetivo $DC$), zato $\\angle ABC = ${z}^\\circ + ${y}^\\circ = ${y + z}^\\circ$.\n$\\angle ADC = 180^\\circ - ${y + z}^\\circ = ${180 - y - z}^\\circ$.`,
        };
      }
      const x = r.int(20, 140);
      const ans = (180 - x) / 2;
      return {
        text: `Iz točke $P$ zunaj krožnice narišemo tangenti, ki se krožnice dotikata v točkah $A$ in $B$. Kot med tangentama meri $\\angle APB = ${x}^\\circ$. Točka $C$ leži na večjem loku $AB$. Koliko meri $\\angle ACB$?`,
        answer: num(ans, "°", 1, { unitAlternatives: ["stopinj"] }),
        hint: "Polmera $OA$ in $OB$ sta pravokotna na tangenti. Koliko meri $\\angle AOB$ v štirikotniku $PAOB$?",
        data: { given: [`\\angle APB = ${x}^\\circ`], find: ["\\angle ACB"] },
        formula: ["\\angle AOB = 180^\\circ - \\angle APB", "\\angle ACB = \\tfrac{1}{2} \\angle AOB"],
        solution: `V štirikotniku $PAOB$ sta kota pri $A$ in $B$ prava, zato $\\angle AOB = 180^\\circ - ${x}^\\circ = ${180 - x}^\\circ$.\n$\\angle ACB = \\tfrac{1}{2} \\cdot ${180 - x}^\\circ = ${tx(ans)}^\\circ$.`,
      };
    },
  },
  {
    id: "tek-potenca",
    topics: [T("potenca-tocke-in-radikalna-os")],
    gen(level, r) {
      if (level === 1) {
        const a = r.int(2, 12), b = r.int(2, 12), c = r.pick(divisors(a * b).filter((d) => d > 1 && d < a * b));
        const d = (a * b) / c;
        return {
          text: `Tetivi $AB$ in $CD$ krožnice se sekata v točki $P$. Velja $PA = ${a}$ cm, $PB = ${b}$ cm in $PC = ${c}$ cm. Kolikšna je dolžina $PD$?`,
          answer: num(d, "cm", 2),
          hint: "Za tetivi, ki se sekata v $P$, velja $PA \\cdot PB = PC \\cdot PD$.",
          data: { given: [`PA = ${a}\\ \\mathrm{cm}`, `PB = ${b}\\ \\mathrm{cm}`, `PC = ${c}\\ \\mathrm{cm}`], find: ["PD"] },
          formula: "PA \\cdot PB = PC \\cdot PD",
          solution: `$PD = \\dfrac{PA \\cdot PB}{PC} = \\dfrac{${a} \\cdot ${b}}{${c}} ${res(d, 2, "cm")}$.`,
        };
      }
      if (level === 2) {
        const pa = r.int(2, 10), ab = r.int(2, 15);
        const t = Math.sqrt(pa * (pa + ab));
        return {
          text: `Iz točke $P$ zunaj krožnice narišemo tangento, ki se krožnice dotakne v $T$, in sekanto, ki krožnico seka v $A$ in $B$ ($A$ je bližje $P$). Velja $PA = ${pa}$ cm in $AB = ${ab}$ cm. Kolikšna je dolžina $PT$? Zaokroži na dve decimalki.`,
          answer: num(t, "cm", 2),
          hint: "Potenca točke: $PT^2 = PA \\cdot PB$.",
          data: { given: [`PA = ${pa}\\ \\mathrm{cm}`, `AB = ${ab}\\ \\mathrm{cm}`], find: ["PT"] },
          formula: "PT^2 = PA \\cdot PB",
          solution: `$PB = ${pa} + ${ab} = ${pa + ab}$ cm.\n$PT = \\sqrt{${pa} \\cdot ${pa + ab}} = \\sqrt{${pa * (pa + ab)}} ${res(t, 2, "cm")}$.`,
        };
      }
      let rr, d, k;
      do (rr = r.int(5, 15)), (d = r.int(1, rr - 1)), (k = r.int(2, 5));
      while (false);
      const x = Math.sqrt((rr * rr - d * d) / k);
      const chord = (k + 1) * x;
      return {
        text: `Točka $P$ leži v krogu s polmerom ${rr} cm, ${d} cm od središča. Skozi $P$ narišemo tetivo $AB$, ki jo $P$ deli v razmerju $PA : PB = 1 : ${k}$. Kolikšna je dolžina tetive $AB$? Zaokroži na dve decimalki.`,
        answer: num(chord, "cm", 2),
        hint: "Potenca točke $P$ je $r^2 - d^2$ in je enaka $PA \\cdot PB$ za vsako tetivo skozi $P$.",
        data: { given: [`r = ${rr}\\ \\mathrm{cm}`, `d = ${d}\\ \\mathrm{cm}`, `PA : PB = 1 : ${k}`], find: ["AB"] },
        formula: "PA \\cdot PB = r^2 - d^2",
        solution: `$PA = x$, $PB = ${k}x$, $x \\cdot ${k}x = ${rr}^2 - ${d}^2 = ${rr * rr - d * d}$, torej $x = \\sqrt{${fracTex(rr * rr - d * d, k)}} \\approx ${tx(x, 3)}$ cm.\n$AB = ${k + 1}x ${res(chord, 2, "cm")}$.`,
      };
    },
  },
  {
    id: "tek-ceva-menelaj",
    topics: [T("podobnost-menelaj-in-ceva")],
    gen(level, r) {
      if (level === 1) {
        const [a, b, c] = r.shuffle(r.pick(HERON));
        const bd = (a * c) / (b + c);
        return {
          text: `V trikotniku $ABC$ je $BC = ${a}$ cm, $CA = ${b}$ cm in $AB = ${c}$ cm. Simetrala kota pri $A$ seka stranico $BC$ v točki $D$. Kolikšna je dolžina $BD$? Zaokroži na dve decimalki.`,
          answer: num(bd, "cm", 2),
          hint: "Izrek o simetrali kota: $BD : DC = AB : AC$.",
          data: { given: [`a = ${a}\\ \\mathrm{cm}`, `b = ${b}\\ \\mathrm{cm}`, `c = ${c}\\ \\mathrm{cm}`], find: ["BD"] },
          formula: "\\dfrac{BD}{DC} = \\dfrac{AB}{AC} \\Rightarrow BD = \\dfrac{a c}{b + c}",
          solution: `$BD = \\dfrac{${a} \\cdot ${c}}{${b} + ${c}} = ${fracTex(a * c, b + c)} ${res(bd, 2, "cm")}$.`,
        };
      }
      if (level === 2) {
        const a = r.int(1, 5), b = r.int(1, 5), c = r.int(1, 5), d = r.int(1, 5);
        return {
          text: `Na stranicah trikotnika $ABC$ ležijo točke $F$ na $AB$, $D$ na $BC$ in $E$ na $CA$, da se daljice $AD$, $BE$ in $CF$ sekajo v eni točki. Velja $AF : FB = ${a} : ${b}$ in $BD : DC = ${c} : ${d}$. Koliko je $\\dfrac{CE}{EA}$? (Zapiši kot ulomek.)`,
          answer: fracAns(b * d, a * c),
          hint: "Cevov izrek: $\\dfrac{AF}{FB} \\cdot \\dfrac{BD}{DC} \\cdot \\dfrac{CE}{EA} = 1$.",
          data: { given: [`AF : FB = ${a} : ${b}`, `BD : DC = ${c} : ${d}`], find: ["\\tfrac{CE}{EA}"] },
          formula: "\\dfrac{AF}{FB} \\cdot \\dfrac{BD}{DC} \\cdot \\dfrac{CE}{EA} = 1",
          solution: `$\\dfrac{${a}}{${b}} \\cdot \\dfrac{${c}}{${d}} \\cdot \\dfrac{CE}{EA} = 1$, torej $\\dfrac{CE}{EA} = \\dfrac{${b} \\cdot ${d}}{${a} \\cdot ${c}} = ${fracTex(b * d, a * c)}$.`,
        };
      }
      const m = r.int(1, 5), n = r.int(1, 5), p = r.int(1, 5), q = r.int(1, 5);
      // D na BC z BD:DC = m:n, E na AC z AE:EC = p:q; AD in BE se sekata v P. AP:PD = p(m+n) : (q m)
      const A = [0, 0], B = [1, 0], C = [0.3, 0.9];
      const D = [B[0] + (m / (m + n)) * (C[0] - B[0]), B[1] + (m / (m + n)) * (C[1] - B[1])];
      const E = [(p / (p + q)) * C[0], (p / (p + q)) * C[1]];
      // A + s(D - A) = B + t(E - B)
      const det = D[0] * -(E[1] - B[1]) - D[1] * -(E[0] - B[0]);
      const s = ((B[0]) * -(E[1] - B[1]) - B[1] * -(E[0] - B[0])) / det;
      const ratio = s / (1 - s);
      if (Math.abs(ratio - (p * (m + n)) / (q * m)) > 1e-9) return null;
      return {
        text: `V trikotniku $ABC$ leži točka $D$ na stranici $BC$, da je $BD : DC = ${m} : ${n}$, točka $E$ pa na stranici $CA$, da je $AE : EC = ${p} : ${q}$. Daljici $AD$ in $BE$ se sekata v točki $P$. Koliko je $\\dfrac{AP}{PD}$? (Zapiši kot ulomek.)`,
        answer: fracAns(p * (m + n), q * m),
        hint: "Uporabi Menelajev izrek za trikotnik $ADC$ in premico $BE$, ali pa metodo mas (težišča): v oglišča postavi mase, da sta $D$ in $E$ težišči.",
        data: { given: [`BD : DC = ${m} : ${n}`, `AE : EC = ${p} : ${q}`], find: ["\\tfrac{AP}{PD}"] },
        formula: "\\dfrac{AP}{PD} \\cdot \\dfrac{DB}{BC} \\cdot \\dfrac{CE}{EA} = 1 \\text{ (Menelaj za } \\triangle ADC\\text{)}",
        solution: `Menelaj za trikotnik $ADC$ in premico $B, P, E$: $\\dfrac{AP}{PD} \\cdot \\dfrac{DB}{BC} \\cdot \\dfrac{CE}{EA} = 1$.\n$\\dfrac{DB}{BC} = \\dfrac{${m}}{${m + n}}$, $\\dfrac{CE}{EA} = \\dfrac{${q}}{${p}}$, zato $\\dfrac{AP}{PD} = \\dfrac{${m + n} \\cdot ${p}}{${m} \\cdot ${q}} = ${fracTex(p * (m + n), q * m)}$.`,
      };
    },
  },
  {
    id: "tek-znacilne-tocke",
    topics: [T("znacilne-tocke-trikotnika")],
    gen(level, r) {
      const tri = r.pick(HERON);
      const [a, b, c] = tri;
      const P = heronArea(tri), s = (a + b + c) / 2;
      const R = (a * b * c) / (4 * P), rin = P / s;
      const given = [`a = ${a}\\ \\mathrm{cm}`, `b = ${b}\\ \\mathrm{cm}`, `c = ${c}\\ \\mathrm{cm}`];
      const intro = `Trikotnik ima stranice $a = ${a}$ cm, $b = ${b}$ cm in $c = ${c}$ cm.`;
      const heron = `$s = ${tx(s)}$, $p = \\sqrt{s(s-a)(s-b)(s-c)} = \\sqrt{${tx(s)} \\cdot ${tx(s - a)} \\cdot ${tx(s - b)} \\cdot ${tx(s - c)}} = ${tx(P)}$ cm²`;
      if (level === 1) {
        const inr = r.next() < 0.5;
        const val = inr ? rin : R;
        return {
          text: `${intro} Kolikšen je polmer ${inr ? "včrtane" : "očrtane"} krožnice? Zaokroži na dve decimalki.`,
          answer: num(val, "cm", 2),
          hint: "Najprej s Heronovo formulo izračunaj ploščino.",
          data: { given, find: [inr ? "r" : "R"] },
          formula: ["p = \\sqrt{s(s-a)(s-b)(s-c)}", inr ? "r = \\dfrac{p}{s}" : "R = \\dfrac{abc}{4p}"],
          solution: `${heron}.\n${inr ? `$r = \\dfrac{p}{s} = \\dfrac{${tx(P)}}{${tx(s)}} ${res(val, 2, "cm")}$` : `$R = \\dfrac{abc}{4p} = \\dfrac{${a * b * c}}{${tx(4 * P)}} ${res(val, 2, "cm")}$`}.`,
        };
      }
      if (level === 2) {
        const ma = 0.5 * Math.sqrt(2 * b * b + 2 * c * c - a * a);
        const ag = r.next() < 0.5;
        const val = ag ? (2 / 3) * ma : ma;
        return {
          text: `${intro} Težiščnica $t_a$ iz oglišča $A$ gre do razpolovišča stranice $a$, $T$ je težišče. Kolikšna je dolžina ${ag ? "$AT$" : "težiščnice $t_a$"}? Zaokroži na dve decimalki.`,
          answer: num(val, "cm", 2),
          hint: `Formula za težiščnico: $t_a = \\tfrac{1}{2}\\sqrt{2b^2 + 2c^2 - a^2}$.${ag ? " Težišče deli težiščnico v razmerju $2 : 1$." : ""}`,
          data: { given, find: [ag ? "AT" : "t_a"] },
          formula: ["t_a = \\tfrac{1}{2}\\sqrt{2b^2 + 2c^2 - a^2}", ...(ag ? ["AT = \\tfrac{2}{3} t_a"] : [])],
          solution: `$t_a = \\tfrac{1}{2}\\sqrt{2 \\cdot ${b}^2 + 2 \\cdot ${c}^2 - ${a}^2} = \\tfrac{1}{2}\\sqrt{${2 * b * b + 2 * c * c - a * a}} \\approx ${tx(ma, 3)}$ cm.${ag ? `\n$AT = \\tfrac{2}{3} t_a ${res(val, 2, "cm")}$.` : ""}`,
        };
      }
      const oi2 = R * R - 2 * R * rin;
      const oi = Math.sqrt(Math.max(oi2, 0));
      if (oi < 0.05) return null;
      return {
        text: `${intro} Kolikšna je razdalja med središčem očrtane in središčem včrtane krožnice? Zaokroži na dve decimalki.`,
        answer: num(oi, "cm", 2),
        hint: "Eulerjeva formula: $OI^2 = R^2 - 2Rr$. Najprej izračunaj $R$ in $r$.",
        data: { given, find: ["OI"] },
        formula: ["R = \\dfrac{abc}{4p}", "r = \\dfrac{p}{s}", "OI^2 = R^2 - 2Rr"],
        solution: `${heron}. $R = \\dfrac{abc}{4p} \\approx ${tx(R, 4)}$ cm, $r = \\dfrac{p}{s} \\approx ${tx(rin, 4)}$ cm.\n$OI = \\sqrt{R^2 - 2Rr} = \\sqrt{${tx(oi2, 4)}} ${res(oi, 2, "cm")}$.`,
      };
    },
  },
  {
    id: "tek-geo-ekstremi",
    topics: [T("geometrijske-neenakosti-in-ekstremi")],
    gen(level, r) {
      if (level === 1) {
        const a = r.int(3, 30), b = r.int(3, 30);
        const ans = 2 * Math.min(a, b) - 1;
        return {
          text: `Trikotnik ima stranici dolžin ${a} cm in ${b} cm. Koliko različnih celoštevilskih dolžin (v cm) lahko ima tretja stranica?`,
          answer: num(ans),
          hint: "Trikotniška neenakost: $|a - b| < c < a + b$.",
          data: { given: [`a = ${a}\\ \\mathrm{cm}`, `b = ${b}\\ \\mathrm{cm}`], find: ["\\text{število možnih } c"] },
          formula: "|a - b| < c < a + b",
          solution: `$${Math.abs(a - b)} < c < ${a + b}$, celoštevilske vrednosti od ${Math.abs(a - b) + 1} do ${a + b - 1}: teh je $${ans}$.`,
        };
      }
      if (level === 2) {
        const h1 = r.int(1, 12), h2 = r.int(1, 12), d = r.int(3, 20);
        const L = Math.hypot(d, h1 + h2);
        return {
          text: `Hiši $A$ in $B$ stojita na isti strani ravne reke: $A$ je ${h1} km od reke, $B$ pa ${h2} km. Pravokotni projekciji hiš na breg sta ${d} km narazen. Iz $A$ gremo do reke po vodo in nato do $B$. Kolikšna je najkrajša pot? Zaokroži na dve decimalki.`,
          answer: num(L, "km", 2),
          hint: "Prezrcali $B$ čez breg v $B'$. Vsaka pot $A \\to$ reka $\\to B$ je enako dolga kot pot $A \\to$ reka $\\to B'$; najkrajša je daljica $AB'$.",
          data: { given: [`h_A = ${h1}\\ \\mathrm{km}`, `h_B = ${h2}\\ \\mathrm{km}`, `d = ${d}\\ \\mathrm{km}`], find: ["s_{\\min}"] },
          formula: "s_{\\min} = |AB'| = \\sqrt{d^2 + (h_A + h_B)^2}",
          solution: `$|AB'| = \\sqrt{${d}^2 + (${h1} + ${h2})^2} = \\sqrt{${d * d + (h1 + h2) ** 2}} ${res(L, 2, "km")}$.`,
        };
      }
      for (let t = 0; t < 30; t++) {
        const tri = r.pick(HERON);
        const [a, b, c] = tri;
        const cos = (x, y, z) => (y * y + z * z - x * x) / (2 * y * z);
        if ([cos(a, b, c), cos(b, a, c), cos(c, a, b)].some((v) => v <= -0.5)) continue;
        const P = heronArea(tri);
        const F2 = (a * a + b * b + c * c) / 2 + 2 * Math.sqrt(3) * P;
        const F = Math.sqrt(F2);
        return {
          text: `Trikotnik ima stranice ${a} cm, ${b} cm in ${c} cm (vsi koti so manjši od $120^\\circ$). Kolikšna je najmanjša možna vsota razdalj točke $X$ do vseh treh oglišč? Zaokroži na dve decimalki.`,
          answer: num(F, "cm", 2),
          hint: "Najmanjšo vsoto da Fermatova točka (iz nje se vse stranice vidijo pod $120^\\circ$). Njeno vsoto razdalj lahko izračunaš s formulo $F^2 = \\tfrac{a^2 + b^2 + c^2}{2} + 2\\sqrt{3}\\,p$.",
          data: { given: [`a = ${a}\\ \\mathrm{cm}`, `b = ${b}\\ \\mathrm{cm}`, `c = ${c}\\ \\mathrm{cm}`], find: ["F"] },
          formula: ["p = \\sqrt{s(s-a)(s-b)(s-c)}", "F^2 = \\dfrac{a^2 + b^2 + c^2}{2} + 2\\sqrt{3}\\, p"],
          solution: `Ploščina (Heron): $p = ${tx(P)}$ cm². Z vrtenjem trikotnika za $60^\\circ$ okoli oglišča se vsota razdalj spremeni v lomljeno črto, ki je najkrajša kot daljica; to da formulo\n$F^2 = \\dfrac{${a}^2 + ${b}^2 + ${c}^2}{2} + 2\\sqrt{3} \\cdot ${tx(P)} \\approx ${tx(F2, 3)}$, torej $F ${res(F, 2, "cm")}$.`,
        };
      }
      return null;
    },
  },
];


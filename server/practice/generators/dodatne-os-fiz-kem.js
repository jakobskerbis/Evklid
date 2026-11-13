// Generatorji za teme, ki prej niso imele nalog (os-fiz-kem). Merila: docs/kakovost.md §2.
// Fizika OŠ 8–9 (merjenje, svetloba, Osončje, sile, toplota, elektrika, magnetizem) in kemija OŠ 8–9.
import { NAMES, g } from "../rng.js";
import { roundHalfUp } from "../check.js";
import { tx } from "./mat.js";

const G = 9.81;
const G_TEX = "9{,}81";
// Količina z enoto za TeX (brez $): qty("2{,}5", "kg") → "2{,}5\ \mathrm{kg}"; "°C" in "°" imata svoj zapis.
const qty = (val, unit) =>
  unit === "°" ? `${val}^\\circ` : unit.startsWith("°") ? `${val}\\ {}^\\circ\\mathrm{${unit.slice(1)}}` : `${val}\\ ${unit.startsWith("\\") ? unit : `\\mathrm{${unit}}`}`;
const dat = (sym, val, unit) => `${sym} = ${qty(val, unit)}`;
const needsRounding = (x, d) => d != null && Math.abs(x - roundHalfUp(x, d)) > 1e-9;
const res = (x, d, unit) => `${needsRounding(x, d) ? "\\approx" : "="} ${unit ? qty(tx(x, d), unit) : tx(x, d)}`;
const T = (s) => `\\text{${s}}`;
const ROUND = ["na celo število", "na eno decimalko", "na dve decimalki", "na tri decimalke"];
// Celo število s tankim presledkom med tisočicami (za TeX): 384000 → "384\,000".
const grp = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "\\,");
// Kemijska formula za TeX: ch("H2SO4") → "\mathrm{H_{2}SO_{4}}" (indeksi so števke za simbolom ali oklepajem).
const ch = (f) => `\\mathrm{${f.replace(/(\d+)/g, "_{$1}")}}`;
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));

// Razlage napak in izbirne možnosti se izpišejo kot navadno besedilo (brez KaTeX), zato TeX pretvorimo v Unicode.
const SUP = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻", "+": "⁺" };
const SUB = { "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄", "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉" };
const sup = (x) => [...x].map((c) => SUP[c] ?? c).join("");
const sub = (x) => [...x].map((c) => SUB[c] ?? c).join("");
function plain(s) {
  if (s == null) return s;
  return String(s)
    .replace(/\$/g, "")
    .replace(/\\[ ,]/g, " ")
    .replace(/\\dfrac\{([^{}]*)\}\{([^{}]*)\}/g, "$1/$2")
    .replace(/\{,\}/g, ",")
    .replace(/\\bar\{(\w)\}/g, "povprečje $1")
    .replace(/\{\}\^\\circ|\^\\circ/g, "°")
    .replace(/\\cdot/g, "·")
    .replace(/\\pi/g, "π")
    .replace(/\\rho/g, "ρ")
    .replace(/\\Delta /g, "Δ")
    .replace(/\\rightarrow/g, "→")
    .replace(/([A-Za-z)\]])_\{?(\d+)\}?/g, (_, a, d) => a + sub(d))
    .replace(/\^\{([-+0-9]+)\}|\^([-+0-9])/g, (_, a, b) => sup(a ?? b))
    .replace(/_\{([^{}]*)\}/g, "_$1")
    .replace(/\\(?:mathrm|text)\{([^{}]*)\}/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

// Elementi do kalcija: simbol, ime, rodilnik (za »atom natrija«).
const EL20 = [
  ["H", "vodik", "vodika"], ["He", "helij", "helija"], ["Li", "litij", "litija"], ["Be", "berilij", "berilija"], ["B", "bor", "bora"],
  ["C", "ogljik", "ogljika"], ["N", "dušik", "dušika"], ["O", "kisik", "kisika"], ["F", "fluor", "fluora"], ["Ne", "neon", "neona"],
  ["Na", "natrij", "natrija"], ["Mg", "magnezij", "magnezija"], ["Al", "aluminij", "aluminija"], ["Si", "silicij", "silicija"], ["P", "fosfor", "fosforja"],
  ["S", "žveplo", "žvepla"], ["Cl", "klor", "klora"], ["Ar", "argon", "argona"], ["K", "kalij", "kalija"], ["Ca", "kalcij", "kalcija"],
];
// Zunanji (valenčni) elektroni nekovin za Lewisove formule.
const VAL = { H: 1, C: 4, N: 5, O: 6, S: 6, F: 7, Cl: 7, P: 5 };
// Razporeditev elektronov po lupinah (šolski model 2, 8, 8, 2 do Z = 20).
const shells = (Z) => [Math.min(Z, 2), Math.min(Math.max(Z - 2, 0), 8), Math.min(Math.max(Z - 10, 0), 8), Math.max(Z - 18, 0)].filter((x) => x > 0);
// »ima 1 zunanji elektron / 2 zunanja elektrona / 3 zunanje elektrone / 5 zunanjih elektronov«
const zunanji = (k) => `${k} ${k === 1 ? "zunanji elektron" : k === 2 ? "zunanja elektrona" : k <= 4 ? "zunanje elektrone" : "zunanjih elektronov"}`;
// Sestava formule z oklepaji: parseFormula("Ca(OH)2") → { Ca: 1, O: 2, H: 2 }.
function parseFormula(f) {
  const stack = [{}];
  const re = /([A-Z][a-z]?|\(|\))(\d*)/g;
  let m;
  while ((m = re.exec(f))) {
    const [, tok, d] = m;
    const k = d ? Number(d) : 1;
    if (tok === "(") stack.push({});
    else if (tok === ")") {
      const grp0 = stack.pop();
      const top = stack.at(-1);
      for (const [e, c] of Object.entries(grp0)) top[e] = (top[e] || 0) + c * k;
    } else {
      const top = stack.at(-1);
      top[tok] = (top[tok] || 0) + k;
    }
  }
  return stack[0];
}

// Številski odgovor; tipične napake, ki bi se po zaokrožitvi ujemale s pravilnim rezultatom, izpustimo.
function num(value, unit, decimals, mistakes = [], extra = {}) {
  const d = decimals ?? null;
  const same = (a) =>
    d == null ? Math.abs(a - value) <= 1e-9 * Math.max(1, Math.abs(value)) : Math.abs(roundHalfUp(a, d) - roundHalfUp(value, d)) < 1e-9;
  const seen = new Set();
  const ms = [];
  for (const [mv, why] of mistakes) {
    if (!Number.isFinite(mv) || same(mv)) continue;
    const key = roundHalfUp(mv, 6);
    if (seen.has(key)) continue;
    seen.add(key);
    ms.push({ value: mv, why: plain(why) });
  }
  const a = { type: "number", value, decimals: d };
  if (unit) a.unit = unit;
  if (ms.length) a.mistakes = ms.slice(0, 3);
  return Object.assign(a, extra);
}

// Izbirni odgovor: pravilna možnost + [besedilo, zakaj je napačno]; po mešanju poravnamo answer.why.
function mc(r, correct, wrongs) {
  const all = r.shuffle([[correct, null], ...wrongs]);
  return { type: "choice", options: all.map((o) => o[0]), index: all.findIndex((o) => o[1] === null), why: all.map((o) => (o[1] == null ? null : plain(o[1]))) };
}
// Konceptualna naloga iz zapisa { q, ok, wrong, hint, given, find, formula, sol, tex }.
function concept(r, c) {
  const t = {
    text: c.q,
    answer: mc(r, c.ok, c.wrong),
    hint: c.hint,
    data: { given: c.given || [], find: c.find },
    solution: Array.isArray(c.sol) ? c.sol.join("\n") : c.sol,
  };
  if (c.formula) t.formula = c.formula;
  if (c.tex) t.options_tex = true;
  else t.answer.options = t.answer.options.map(plain);
  return t;
}

// Vsak podatek ima obliko "oznaka = vrednost" (test generatorjev). Opisne oznake
// "\text{ključ: vrednost}" pretvorimo v enačbo, čisto opisno oznako pa v temo.
function eqG(x) {
  if (x.includes("=")) return x;
  let m = x.match(/^\\text\{([^{}]*?):\s*\}\s*(.+)$/);
  if (m) return `\\text{${m[1]}} = ${m[2]}`;
  m = x.match(/^\\text\{([^{}:]*?):\s*([^{}]+)\}$/);
  if (m) return `\\text{${m[1]}} = \\text{${m[2]}}`;
  if (x.includes("\\rightarrow")) return `\\text{prehod} = ${x}`;
  if (/^\\text\{[^{}]*\}$/.test(x)) return `\\text{tema} = ${x}`;
  return x;
}
// Vrstica »tema = …« ni podatek iz besedila: konceptualna vprašanja podatkov nimajo (data: false),
// zato lestev namigov začne pri formuli oz. namigu.
function fixData(t) {
  if (t && t.data && Array.isArray(t.data.given)) {
    t.data.given = t.data.given.map(eqG).filter((g) => !/^\\text\{tema\}\s*=/.test(g));
    if (!t.data.given.length) t.data = false;
  }
  return t;
}

// Meritve okoli osnovne vrednosti z d decimalkami (vsaj dve različni).
function measurements(r, C, n) {
  const step = 10 ** -C.d;
  const base = r.dec(C.lo, C.hi, C.d);
  for (;;) {
    const v = Array.from({ length: n }, () => roundHalfUp(base + r.int(-C.k, C.k) * step, C.d));
    if (new Set(v).size >= 3 || (n < 4 && new Set(v).size >= 2)) return v;
  }
}

export const DODATNE_OS_FIZ_KEM = [
  // ---------------------------------------------------------------- FIZIKA 8
  {
    id: "dod-os-merske-napake",
    topics: ["FIZ-OS-8/merske-napake"],
    gen(level, r) {
      const name = r.pick(NAMES);
      const C = r.pick([
        { what: "čas desetih nihajev nihala", s: "t", u: "s", lo: 12, hi: 20, d: 1, k: 3 },
        { what: "dolžino šolske klopi", s: "l", u: "cm", lo: 110, hi: 150, d: 1, k: 4 },
        { what: "čas, v katerem žoga pade z omare na tla", s: "t", u: "s", lo: 0.55, hi: 0.75, d: 2, k: 4 },
        { what: "maso jabolka na kuhinjski tehtnici", s: "m", u: "g", lo: 140, hi: 210, d: 0, k: 3 },
        { what: "čas teka sošolca na 60 m s štoparico", s: "t", u: "s", lo: 8.5, hi: 11.5, d: 2, k: 12 },
        { what: "višino sošolke z merilnim trakom", s: "h", u: "cm", lo: 150, hi: 175, d: 1, k: 5 },
        { what: "premer kovanca s kljunastim merilom", s: "d", u: "mm", lo: 21, hi: 27, d: 2, k: 3 },
      ]);
      const { s, u, d } = C;
      const ad = Math.min(d + 1, 3); // povprečje zaokrožimo na eno mesto več kot meritve
      const izmeril = g(name, "izmeril", "izmerila");
      const list = (v) => v.map((x) => `$${qty(tx(x, d), u)}$`).join(", ");
      const given = (v) => [...v.map((x, i) => dat(`${s}_{${i + 1}}`, tx(x, d), u)), `n = ${v.length}`];
      const meanF = `\\bar{${s}} = \\dfrac{${s}_1 + ${s}_2 + \\dots + ${s}_n}{n}`;
      const sumOf = (v) => roundHalfUp(v.reduce((a, b) => a + b, 0), d);
      const meanStep = (v, m) =>
        `$\\bar{${s}} = \\dfrac{${v.map((x) => tx(x, d)).join(" + ")}}{${v.length}} = \\dfrac{${qty(tx(sumOf(v), d), u)}}{${v.length}} ${res(m, ad, u)}$`;

      if (level === 1) {
        const n = r.int(3, 5);
        const v = measurements(r, C, n);
        const sum = sumOf(v);
        const mean = sum / n;
        const text = r.pick([
          `${name} je ${n}-krat ${izmeril} ${C.what}. Meritve: ${list(v)}. Kolikšna je povprečna vrednost? Zaokroži ${ROUND[ad]}.`,
          `Učenci so pri vaji ${n}-krat izmerili ${C.what} in zapisali: ${list(v)}. Izračunaj povprečje meritev in ga zaokroži ${ROUND[ad]}.`,
          `Ker posamezna meritev ni natančna, je ${name} ${C.what} ${izmeril} ${n}-krat: ${list(v)}. Koliko je povprečje? Zaokroži ${ROUND[ad]}.`,
        ]);
        return {
          text,
          answer: num(mean, u, ad, [
            [sum, "Si vsoto pozabil deliti s številom meritev?"],
            [sum / (n - 1), `Vsoto deli s številom vseh meritev ($n = ${n}$).`],
            [(Math.max(...v) + Math.min(...v)) / 2, "To je sredina med največjo in najmanjšo meritvijo, ne povprečje vseh meritev."],
          ]),
          hint: "Seštej vse meritve in vsoto deli s številom meritev.",
          data: { given: given(v), find: [`\\bar{${s}}`] },
          formula: meanF,
          solution: `Seštejemo vse meritve in delimo z $n = ${n}$:\n${meanStep(v, mean)}`,
        };
      }

      if (level === 2 && r.next() < 0.5) {
        // Groba napaka: eno meritev izločimo.
        const v = measurements(r, C, 4);
        const sign = r.pick([-1, 1]);
        const out = roundHalfUp(v[0] + sign * r.int(8, 12) * C.k * 10 ** -d, d);
        const all = r.shuffle([...v, out]);
        const mean = sumOf(v) / 4;
        const meanAll = sumOf(all) / 5;
        return {
          text: `${name} je 5-krat ${izmeril} ${C.what}: ${list(all)}. Ena meritev je očitno napačna (groba napaka, npr. zaradi napačnega odčitavanja). Izloči jo in izračunaj povprečje ostalih meritev. Zaokroži ${ROUND[ad]}.`,
          answer: num(mean, u, ad, [
            [meanAll, "Si v povprečje vključil tudi meritev z grobo napako?"],
            [sumOf(v) / 5, "Po izločitvi ostanejo 4 meritve, zato deli s 4."],
          ]),
          hint: "Poišči meritev, ki močno odstopa od ostalih. Povprečje izračunaj samo iz preostalih štirih meritev.",
          data: { given: [...all.map((x, i) => dat(`${s}_{${i + 1}}`, tx(x, d), u))], find: [`\\bar{${s}}`] },
          formula: meanF,
          solution: `Meritev $${qty(tx(out, d), u)}$ močno odstopa od ostalih, zato jo izločimo.\n${meanStep(v, mean)}`,
        };
      }

      const n = level === 2 ? r.int(4, 5) : 5;
      const v = measurements(r, C, n);
      const mean = sumOf(v) / n;
      const mr = roundHalfUp(mean, ad);
      const devs = v.map((x) => roundHalfUp(Math.abs(x - mr), ad));
      const dmax = Math.max(...devs);
      const range = roundHalfUp(Math.max(...v) - Math.min(...v), d);
      const devLine = `Odmiki od povprečja: ${devs.map((x) => `$${tx(x, ad)}$`).join(", ")} (v $\\mathrm{${u}}$)`;
      const dF = `\\Delta ${s} = \\max\\, |${s}_i - \\bar{${s}}|`;

      if (level === 2) {
        return {
          text: `${name} je ${n}-krat ${izmeril} ${C.what}: ${list(v)}. Izračunaj povprečje (zaokroži ga ${ROUND[ad]}), nato oceni absolutno napako kot največji odmik meritve od povprečja. Kolikšna je absolutna napaka?`,
          answer: num(dmax, u, ad, [
            [range, "To je razlika med največjo in najmanjšo meritvijo. Napaka je največji odmik od povprečja."],
            [Math.min(...devs), "Vzeti moraš največji odmik od povprečja, ne najmanjšega."],
          ]),
          hint: "Najprej izračunaj povprečje. Nato za vsako meritev izračunaj, za koliko se razlikuje od povprečja, in izberi največji odmik.",
          data: { given: given(v), find: [`\\Delta ${s}`] },
          formula: [meanF, dF],
          solution: `${meanStep(v, mean)}\n${devLine}\nNajvečji odmik: $\\Delta ${s} = ${qty(tx(dmax, ad), u)}$\nIzid: $${s} = (${tx(mr, ad)} \\pm ${tx(dmax, ad)})\\ \\mathrm{${u}}$`,
        };
      }

      if (r.next() < 0.5) {
        // Relativna napaka v odstotkih.
        const rel = (dmax / mr) * 100;
        return {
          text: `${name} je ${n}-krat ${izmeril} ${C.what}: ${list(v)}. Povprečje zaokroži ${ROUND[ad]}, absolutno napako oceni kot največji odmik od povprečja. Kolikšna je relativna napaka meritve v odstotkih? Zaokroži na eno decimalko.`,
          answer: num(rel, "%", 1, [
            [dmax, "To je absolutna napaka. Relativna napaka je absolutna napaka, deljena s povprečjem (v %)."],
            [(range / mr) * 100, "Za absolutno napako vzemi največji odmik od povprečja, ne razpona meritev."],
          ]),
          hint: "Najprej povprečje, nato absolutna napaka (največji odmik), na koncu relativna napaka $\\delta = \\dfrac{\\Delta x}{\\bar{x}} \\cdot 100\\ \\%$.",
          data: { given: given(v), find: [`\\delta_{${s}}`] },
          formula: [meanF, dF, `\\delta_{${s}} = \\dfrac{\\Delta ${s}}{\\bar{${s}}} \\cdot 100\\ \\%`],
          solution: `${meanStep(v, mean)}\n${devLine}, zato $\\Delta ${s} = ${qty(tx(dmax, ad), u)}$\n$\\delta_{${s}} = \\dfrac{${tx(dmax, ad)}}{${tx(mr, ad)}} \\cdot 100\\ \\% ${res(rel, 1, "\\%")}$`,
        };
      }
      // Obratno: manjkajoča meritev iz znanega povprečja.
      const nn = r.int(4, 5);
      let w = measurements(r, C, nn);
      while (Math.abs(w[nn - 1] - sumOf(w) / nn) < 10 ** -d) w = measurements(r, C, nn);
      const sum = sumOf(w);
      const avg = sum / nn;
      const known = w.slice(0, nn - 1);
      const last = w[nn - 1];
      const sk = sumOf(known);
      return {
        text: `${name} je ${nn}-krat ${izmeril} ${C.what}. Povprečje vseh meritev je $${qty(tx(avg), u)}$. Prve meritve so bile ${list(known)}, zadnje pa ${g(name, "ni zapisal", "ni zapisala")}. Kolikšna je bila zadnja meritev?`,
        answer: num(last, u, d, [
          [avg, "Zadnja meritev ni nujno enaka povprečju. Iz povprečja najprej izračunaj vsoto vseh meritev."],
          [roundHalfUp((nn - 1) * avg - sk, d), `Vsota vseh meritev je $${nn} \\cdot \\bar{${s}}$, ker je meritev ${nn}.`],
        ]),
        hint: "Iz povprečja izračunaj vsoto vseh meritev: vsota $= n \\cdot \\bar{x}$. Od nje odštej znane meritve.",
        data: { given: [dat(`\\bar{${s}}`, tx(avg), u), `n = ${nn}`, ...known.map((x, i) => dat(`${s}_{${i + 1}}`, tx(x, d), u))], find: [`${s}_{${nn}}`] },
        formula: [meanF, `${s}_1 + \\dots + ${s}_n = n \\cdot \\bar{${s}}`],
        solution: `Vsota vseh meritev: $${nn} \\cdot ${qty(tx(avg), u)} = ${qty(tx(sum, d), u)}$\nVsota znanih meritev: $${known.map((x) => tx(x, d)).join(" + ")} = ${qty(tx(sk, d), u)}$\n$${s}_{${nn}} = ${tx(sum, d)} - ${tx(sk, d)} = ${qty(tx(last, d), u)}$`,
      };
    },
  },
  {
    id: "dod-os-sirjenje-svetlobe",
    topics: ["FIZ-OS-8/sirjenje-svetlobe"],
    gen(level, r) {
      const name = r.pick(NAMES);
      const cTex = "300\\,000\\ \\mathrm{km/s}";
      if (level === 1) {
        if (r.next() < 0.5) {
          const P = r.pick([
            { what: "z Lune do Zemlje", s: r.pick([363000, 384000, 405000]) },
            { what: "od navigacijskega satelita do sprejemnika v telefonu", s: r.int(19, 24) * 1000 + r.int(1, 9) * 100 },
            { what: "od televizijskega satelita do satelitske antene", s: r.int(355, 365) * 100 },
            { what: "od Sonca do Zemlje", s: 150000000 },
            { what: "od Sonca do Venere", s: 108000000 },
          ]);
          const t = P.s / 300000;
          return {
            text: `Pot svetlobe ${P.what} je dolga približno $${grp(P.s)}\\ \\mathrm{km}$. Koliko sekund potrebuje svetloba za to pot? Svetloba potuje s hitrostjo $${cTex}$. Zaokroži na tri decimalke.`,
            answer: num(t, "s", 3, [[(2 * P.s) / 300000, "Si računal pot tja in nazaj? Svetloba gre tu samo v eno smer."]]),
            hint: "Svetloba potuje premočrtno s stalno hitrostjo: čas je pot, deljena s hitrostjo.",
            data: { given: [dat("s", grp(P.s), "km"), dat("c", "300\\,000", "km/s")], find: ["t"] },
            formula: "t = \\dfrac{s}{c}",
            solution: `Pot in hitrost sta v kilometrih, zato ju lahko delimo neposredno.\n$t = \\dfrac{s}{c} = \\dfrac{${qty(grp(P.s), "km")}}{${cTex}} ${res(t, 3, "s")}$`,
          };
        }
        const lights = ["Sonce", "plamen sveče", "žareča nitka v žarnici", "kresnica", "zaslon prižganega telefona", "zvezda Severnica"];
        const lit = [
          ["Luna", "Luna ne sveti sama, le odbija Sončevo svetlobo."],
          ["planet Venera", "Venera je planet; vidimo jo, ker odbija Sončevo svetlobo."],
          ["ravno zrcalo", "Zrcalo svetlobo le odbija, samo ne sveti."],
          ["odsevnik na kolesu", "Odsevnik zasveti le, ko nanj posveti luč; svetlobo odbija."],
          ["bel list papirja", "Papir je osvetljeno telo: vidimo ga, ker odbija svetlobo."],
          ["kapljica rose na travi", "Kapljica svetlobo odbija in lomi, sama ne sveti."],
        ];
        const findLight = r.next() < 0.5;
        const intro = r.pick([`${name} ${g(name, "je naštel", "je naštela")} nekaj teles, ki jih vidi zvečer.`, "Pri pouku smo razvrščali telesa na svetila in osvetljena telesa.", `${name} ${g(name, "se je vprašal", "se je vprašala")}, katera telesa svetijo sama.`]);
        if (findLight) {
          const ok = r.pick(lights);
          return concept(r, {
            q: `${intro} Katero od naštetih teles je svetilo (samo oddaja svetlobo)?`,
            ok,
            wrong: r.shuffle(lit).slice(0, 3),
            hint: "Svetilo svetlobo oddaja samo. Osvetljeno telo vidimo le, ker odbija svetlobo nekega svetila.",
            given: [T("tema") + " = " + T("svetila in osvetljena telesa")],
            find: [T("svetilo")],
            sol: ["Svetilo samo oddaja svetlobo, osvetljena telesa jo le odbijajo.", `Svetilo je ${ok}.`],
          });
        }
        const [ok] = r.pick(lit);
        return concept(r, {
          q: `${intro} Katero od naštetih teles NI svetilo, ampak ga vidimo le, ker je osvetljeno?`,
          ok,
          wrong: r.shuffle(lights).slice(0, 3).map((x) => [x, `${x[0].toUpperCase()}${x.slice(1)} samo oddaja svetlobo, zato je svetilo.`]),
          hint: "Osvetljeno telo samo ne oddaja svetlobe; vidimo ga, ker odbija svetlobo svetila.",
          given: [T("tema") + " = " + T("svetila in osvetljena telesa")],
          find: [T("osvetljeno telo")],
          sol: ["Svetila svetlobo oddajajo sama, osvetljena telesa jo le odbijajo.", `Osvetljeno telo je ${ok}.`],
        });
      }
      if (level === 2) {
        if (r.next() < 0.4) {
          const [P, PG, s] = r.pick([["Merkur", "Merkurja", 58], ["Venera", "Venere", 108], ["Mars", "Marsa", 228], ["Jupiter", "Jupitra", 778], ["Saturn", "Saturna", 1427], ["Uran", "Urana", 2871], ["Neptun", "Neptuna", 4498], ["Zemlja", "Zemlje", 150]]);
          const ts = (s * 1e6) / 3e5;
          const tm = ts / 60;
          return {
            text: `${P} je od Sonca oddaljen${P === "Venera" || P === "Zemlja" ? "a" : ""} približno $${grp(s)} \\cdot 10^6\\ \\mathrm{km}$ (${grp(s).replace("\\,", " ")} milijonov kilometrov). Koliko minut potuje svetloba od Sonca do ${PG}? Hitrost svetlobe je $${cTex}$. Zaokroži na eno decimalko.`,
            answer: num(tm, "min", 1, [
              [ts, "To je čas v sekundah. Pretvori ga v minute (1 min = 60 s)."],
              [ts / 3600, "To je čas v urah. Vprašanje sprašuje po minutah."],
            ]),
            hint: "Razdaljo zapiši v kilometrih ($1$ milijon $= 10^6$), izračunaj čas v sekundah in ga pretvori v minute.",
            data: { given: [dat("s", `${grp(s)} \\cdot 10^6`, "km"), dat("c", "300\\,000", "km/s")], find: ["t"] },
            formula: ["t = \\dfrac{s}{c}", "1\\ \\mathrm{min} = 60\\ \\mathrm{s}"],
            solution: `$t = \\dfrac{s}{c} = \\dfrac{${grp(s)} \\cdot 10^6\\ \\mathrm{km}}{${cTex}} ${res(ts, 1, "s")}$\n$t = \\dfrac{${tx(roundHalfUp(ts, 1))}\\ \\mathrm{s}}{60} ${res(tm, 1, "min")}$`,
          };
        }
        const [obj, objG, sx] = r.pick([["drevo", "drevesa", "o"], ["zvonik", "zvonika", ""], ["drog za zastavo", "droga za zastavo", ""], ["stolpnica", "stolpnice", "a"], ["smreka", "smreke", "a"], ["svetilka na parkirišču", "svetilke", "a"]]);
        const person = r.next() < 0.5;
        const h = person ? r.int(150, 185) / 100 : r.pick([1, 1.2, 1.5, 2]);
        const sh = r.dec(0.8, 2.6, 1);
        const H0 = r.int(6, 35);
        const S = roundHalfUp((H0 * sh) / h, 1);
        const H = (h * S) / sh;
        const who = person ? `${name} je ${g(name, "visok", "visoka")} $${qty(tx(h), "m")}$ in meče senco, dolgo $${qty(tx(sh), "m")}$.` : `Navpična palica, visoka $${qty(tx(h), "m")}$, meče senco, dolgo $${qty(tx(sh), "m")}$.`;
        const reverse = r.next() < 0.4;
        const formula = ["\\dfrac{H}{S} = \\dfrac{h}{s}"];
        const g0 = [dat("h", tx(h), "m"), dat("s", tx(sh), "m")];
        if (reverse) {
          const Sx = (H0 * sh) / h;
          return {
            text: `${who} Kako dolga je ob istem času senca, ki jo meče ${obj}, visok${sx} $${qty(H0, "m")}$? Zaokroži na eno decimalko.`,
            answer: num(Sx, "m", 1, [[(H0 * h) / sh, "Razmerje si obrnil: daljša senca pripada višjemu telesu v enakem razmerju kot $s : h$."], [H0, "Dolžina sence ni enaka višini telesa."]]),
            hint: "Sončni žarki so vzporedni, zato je razmerje med dolžino sence in višino za obe telesi enako.",
            data: { given: [...g0, dat("H", H0, "m")], find: ["S"] },
            formula: [...formula, "S = H \\cdot \\dfrac{s}{h}"],
            solution: `Sončni žarki so vzporedni, zato velja $\\dfrac{S}{H} = \\dfrac{s}{h}$.\n$S = H \\cdot \\dfrac{s}{h} = ${qty(H0, "m")} \\cdot \\dfrac{${tx(sh)}}{${tx(h)}} ${res(Sx, 1, "m")}$`,
          };
        }
        return {
          text: `${who} Ob istem času je senca ${objG} dolga $${qty(tx(S), "m")}$. Kako visok${sx} je ${obj}? Zaokroži na eno decimalko.`,
          answer: num(H, "m", 1, [[(h * sh) / S, "Razmerje si obrnil. Višje telo ima daljšo senco."], [S, "Višina ni enaka dolžini sence."]]),
          hint: "Sončni žarki so vzporedni, zato je razmerje med višino in dolžino sence za obe telesi enako.",
          data: { given: [...g0, dat("S", tx(S), "m")], find: ["H"] },
          formula: [...formula, "H = h \\cdot \\dfrac{S}{s}"],
          solution: `Sončni žarki so vzporedni, zato velja $\\dfrac{H}{S} = \\dfrac{h}{s}$.\n$H = h \\cdot \\dfrac{S}{s} = ${qty(tx(h), "m")} \\cdot \\dfrac{${tx(S)}}{${tx(sh)}} ${res(H, 1, "m")}$`,
        };
      }
      // Raven 3: senca na zaslonu pri točkastem svetilu (podobna trikotnika).
      const h = r.int(4, 20); // cm
      const hT = `$${qty(h, "cm")}$`;
      const ctx = r.pick([
        `Lutka v gledališču senc je visoka ${hT}.`,
        `${name} drži pred svetilko kartonsko zvezdo, visoko ${hT}.`,
        `Na mizi pred žepno svetilko stoji figurica, visoka ${hT}.`,
        `Igralec senčnega gledališča drži pred svetilko kartonsko hišico, visoko ${hT}.`,
      ]);
      const a = r.int(2, 8) * 10; // cm, svetilo–predmet
      const dCm = r.int(4, 25) * 10; // predmet–zaslon
      const b = a + dCm; // svetilo–zaslon
      const formula = ["\\dfrac{H}{h} = \\dfrac{b}{a}", "b = a + d"];
      if (r.next() < 0.5) {
        const H = (h * b) / a;
        const dTex = dCm >= 100 ? qty(tx(dCm / 100), "m") : qty(dCm, "cm");
        return {
          text: `${ctx} Majhno (točkasto) svetilo je od predmeta oddaljeno $${qty(a, "cm")}$, zaslon pa je $${dTex}$ za predmetom. Kako visoka je senca na zaslonu? Rezultat zapiši v cm in zaokroži na eno decimalko.`,
          answer: num(H, "cm", 1, [
            [(h * dCm) / a, "Za razdaljo do zaslona vzemi razdaljo od svetila do zaslona, ne od predmeta do zaslona."],
            [(h * a) / b, "Razmerje si obrnil: senca je večja od predmeta."],
          ]),
          hint: "Žarki gredo premočrtno iz svetila čez rob predmeta do zaslona. Nastaneta podobna trikotnika z vrhom v svetilu.",
          data: { given: [dat("h", h, "cm"), dat("a", a, "cm"), dat("d", dCm >= 100 ? tx(dCm / 100) : dCm, dCm >= 100 ? "m" : "cm")], find: ["H"] },
          formula,
          solution: `Razdalja od svetila do zaslona: $b = a + d = ${a}\\ \\mathrm{cm} + ${dCm}\\ \\mathrm{cm} = ${qty(b, "cm")}$\nPodobna trikotnika: $\\dfrac{H}{h} = \\dfrac{b}{a}$\n$H = h \\cdot \\dfrac{b}{a} = ${qty(h, "cm")} \\cdot \\dfrac{${b}}{${a}} ${res(H, 1, "cm")}$`,
        };
      }
      // Obratno: kako daleč od svetila postaviti predmet.
      const Hs = r.int(3, 8) * h;
      const aOut = (h * b) / Hs;
      return {
        text: `Zaslon je $${qty(b, "cm")}$ od majhnega (točkastega) svetila. ${name} želi, da bi bila senca predmeta, ki je visok $${qty(h, "cm")}$, na zaslonu visoka $${qty(Hs, "cm")}$. Kako daleč od svetila mora postaviti predmet? Zaokroži na eno decimalko.`,
        answer: num(aOut, "cm", 1, [[(Hs * b) / h / 10, "Preveri razmerje: predmet mora biti bliže svetilu, kot je zaslon."], [b - aOut, "To je razdalja od predmeta do zaslona. Vprašanje sprašuje po razdalji od svetila."]]),
        hint: "Senca je tolikokrat večja od predmeta, kolikokrat je zaslon dlje od svetila kot predmet.",
        data: { given: [dat("b", b, "cm"), dat("h", h, "cm"), dat("H", Hs, "cm")], find: ["a"] },
        formula: ["\\dfrac{H}{h} = \\dfrac{b}{a}", "a = b \\cdot \\dfrac{h}{H}"],
        solution: `Senca je $\\dfrac{H}{h} = \\dfrac{${Hs}}{${h}} = ${tx(Hs / h)}$-krat večja od predmeta.\nZato je predmet toliko bliže svetilu: $a = \\dfrac{b \\cdot h}{H} = \\dfrac{${b} \\cdot ${h}}{${Hs}}\\ \\mathrm{cm} ${res(aOut, 1, "cm")}$`,
      };
    },
  },
  {
    id: "dod-os-odboj-svetlobe",
    topics: ["FIZ-OS-8/odboj-svetlobe"],
    gen(level, r) {
      const name = r.pick(NAMES);
      const lawF = "\\alpha' = \\alpha";
      if (level === 1) {
        const k = r.int(0, 2);
        if (k === 0) {
          const beta = r.int(1, 17) * 5;
          const alpha = 90 - beta;
          return {
            text: r.pick([
              `Žarek laserskega kazalnika pade na ravno zrcalo tako, da z gladino zrcala oklepa kot $${beta}^\\circ$. Kolikšen je odbojni kot?`,
              `${name} posveti z baterijsko svetilko na ravno zrcalo. Žarek oklepa z zrcalom kot $${beta}^\\circ$. Kolikšen je odbojni kot?`,
            ]),
            answer: num(alpha, "°", 0, [[beta, "Vpadni in odbojni kot merimo od vpadnice (pravokotnice na zrcalo), ne od zrcala."], [2 * alpha, "To je kot med vpadnim in odbitim žarkom. Odbojni kot je kot med odbitim žarkom in vpadnico."]]),
            hint: "Kote pri odboju merimo od vpadnice, ki je pravokotna na zrcalo. Najprej izračunaj vpadni kot.",
            data: { given: [dat("\\beta", beta, "°")], find: ["\\alpha'"] },
            formula: ["\\alpha = 90^\\circ - \\beta", lawF],
            solution: `Vpadni kot merimo od vpadnice: $\\alpha = 90^\\circ - ${beta}^\\circ = ${alpha}^\\circ$\nPo odbojnem zakonu je odbojni kot enak vpadnemu: $\\alpha' = ${alpha}^\\circ$`,
          };
        }
        if (k === 1) {
          const dd = r.dec(0.5, 4, 1);
          const what = r.pick(["pred ogledalom v kopalnici", "pred zrcalom v garderobi", "pred izložbenim oknom, ki deluje kot zrcalo", "pred zrcalno steno v plesni dvorani"]);
          return {
            text: `${name} stoji $${qty(tx(dd), "m")}$ ${what}. Kako daleč od ${g(name, "njega", "nje")} je ${g(name, "njegova", "njena")} slika v zrcalu?`,
            answer: num(roundHalfUp(2 * dd, 1), "m", null, [[dd, "Tako daleč je slika za zrcalom. Vprašanje sprašuje po razdalji od osebe do slike."]]),
            hint: "Slika v ravnem zrcalu je za zrcalom tako daleč, kot je predmet pred njim.",
            data: { given: [dat("a", tx(dd), "m")], find: ["d"] },
            formula: ["b = a", "d = a + b = 2a"],
            solution: `Slika je za zrcalom enako daleč kot oseba pred njim: $b = a = ${qty(tx(dd), "m")}$\n$d = a + b = 2 \\cdot ${qty(tx(dd), "m")} = ${qty(tx(roundHalfUp(2 * dd, 1)), "m")}$`,
          };
        }
        const P = r.pick([
          {
            q: "Kakšna je slika predmeta v ravnem zrcalu?",
            ok: "navidezna, enako velika in enako oddaljena od zrcala kot predmet",
            wrong: [["realna, ker jo lahko ujamemo na zaslon", "Slike v ravnem zrcalu ne moremo ujeti na zaslon, zato je navidezna."], ["navidezna in pomanjšana", "Slika v ravnem zrcalu je enako velika kot predmet."], ["realna in obrnjena na glavo", "Slika v ravnem zrcalu je pokončna in navidezna; zamenjata se le levo in desno."]],
          },
          {
            q: `${name} dvigne desno roko pred zrcalom. Katero roko dvigne slika v zrcalu?`,
            ok: "levo (zrcalo zamenja levo in desno)",
            wrong: [["desno, ker zrcalo ničesar ne spremeni", "Slika je zrcalno obrnjena: desna roka v sliki je tvoja leva."], ["nobene, slika je obrnjena na glavo", "Slika v ravnem zrcalu je pokončna."], ["obe, ker se svetloba razprši", "Pri odboju na ravnem zrcalu se žarki ne razpršijo."]],
          },
          {
            q: "Zakaj vidimo sebe v zrcalu, v beli steni pa ne, čeprav obe odbijata svetlobo?",
            ok: "zrcalo je gladko in odbija vzporedne žarke vzporedno, stena jih razprši na vse strani",
            wrong: [["stena svetlobo vpije", "Bela stena odbije večino svetlobe, a jo zaradi hrapavosti razprši."], ["zrcalo samo oddaja svetlobo", "Zrcalo ni svetilo, svetlobo le odbija."], ["svetloba skozi steno ne more", "Za sliko v zrcalu svetloba ne gre skozi zrcalo, ampak se odbije."]],
          },
          {
            q: "Žarek pade na ravno zrcalo pravokotno (vpadni kot $0^\\circ$). Kam se odbije?",
            ok: "nazaj po isti poti",
            wrong: [["vzdolž zrcala", "Vpadni kot je $0^\\circ$, zato je tudi odbojni kot $0^\\circ$."], ["pod kotom $90^\\circ$ glede na vpadnico", "Odbojni kot je enak vpadnemu, tu $0^\\circ$."], ["nikamor, zrcalo ga vpije", "Zrcalo žarek odbije."]],
          },
        ]);
        return concept(r, {
          ...P,
          hint: "Spomni se odbojnega zakona in lastnosti slike v ravnem zrcalu.",
          given: [T("zrcalo") + " = " + T("ravno")],
          find: [T("pravilna trditev")],
          formula: lawF,
          sol: ["Pri odboju na ravnem zrcalu je odbojni kot enak vpadnemu; slika je navidezna, enako velika, pokončna in zrcalno obrnjena.", `Pravilno: ${P.ok}.`],
        });
      }
      if (level === 2) {
        const k = r.int(0, 2);
        if (k === 0) {
          const gam = r.int(4, 32) * 5;
          const a = gam / 2;
          return {
            text: r.pick([
              `Vpadni in odbiti žarek pri ravnem zrcalu oklepata kot $${gam}^\\circ$. Kolikšen je vpadni kot?`,
              `${name} meri kote pri odboju na zrcalu. Med vpadnim in odbitim žarkom izmeri $${gam}^\\circ$. Kolikšen je odbojni kot?`,
            ]),
            answer: num(a, "°", null, [[gam, "To je kot med žarkoma. Vpadnica ga razpolovi."], [90 - a, "To je kot med žarkom in zrcalom. Kote merimo od vpadnice."]]),
            hint: "Vpadnica leži točno med vpadnim in odbitim žarkom, ker sta vpadni in odbojni kot enaka.",
            data: { given: [dat("\\gamma", gam, "°")], find: ["\\alpha"] },
            formula: [lawF, "\\gamma = \\alpha + \\alpha' = 2\\alpha"],
            solution: `Ker je $\\alpha' = \\alpha$, je kot med žarkoma $\\gamma = 2\\alpha$.\n$\\alpha = \\dfrac{\\gamma}{2} = \\dfrac{${gam}^\\circ}{2} = ${tx(a)}^\\circ$`,
          };
        }
        if (k === 1) {
          const d0 = r.dec(2, 6, 1);
          const x = r.dec(0.5, d0 - 0.5, 1);
          const dist = 2 * (d0 - x);
          return {
            text: `${name} stoji $${qty(tx(d0), "m")}$ pred velikim zrcalom in nato stopi $${qty(tx(x), "m")}$ proti njemu. Kako daleč je zdaj od svoje slike v zrcalu?`,
            answer: num(roundHalfUp(dist, 1), "m", null, [[roundHalfUp(d0 - x, 1), "Tako daleč je od zrcala. Slika je še enkrat toliko za zrcalom."], [roundHalfUp(2 * d0 - x, 1), "Ko se približaš zrcalu, se ti približa tudi slika."]]),
            hint: "Najprej izračunaj, kako daleč je zdaj od zrcala. Slika je za zrcalom enako daleč.",
            data: { given: [dat("a_0", tx(d0), "m"), dat("x", tx(x), "m")], find: ["d"] },
            formula: ["a = a_0 - x", "d = 2a"],
            solution: `Nova razdalja do zrcala: $a = ${tx(d0)}\\ \\mathrm{m} - ${tx(x)}\\ \\mathrm{m} = ${qty(tx(roundHalfUp(d0 - x, 1)), "m")}$\nSlika je enako daleč za zrcalom: $d = 2a = ${qty(tx(roundHalfUp(dist, 1)), "m")}$`,
          };
        }
        const beta = r.int(2, 16) * 5;
        const gam = 180 - 2 * beta;
        return {
          text: `Sončni žarek pade na mirno vodno gladino, ki deluje kot zrcalo, in z njo oklepa kot $${beta}^\\circ$. Kolikšen kot oklepata vpadni in odbiti žarek?`,
          answer: num(gam, "°", null, [[2 * beta, "Kote pri odboju merimo od vpadnice. Najprej izračunaj vpadni kot."], [90 - beta, "To je vpadni kot. Vprašanje sprašuje po kotu med obema žarkoma."]]),
          hint: "Najprej izračunaj vpadni kot (od vpadnice), nato upoštevaj, da je odbojni kot enak.",
          data: { given: [dat("\\beta", beta, "°")], find: ["\\gamma"] },
          formula: ["\\alpha = 90^\\circ - \\beta", lawF, "\\gamma = 2\\alpha"],
          solution: `$\\alpha = 90^\\circ - ${beta}^\\circ = ${90 - beta}^\\circ$\n$\\gamma = \\alpha + \\alpha' = 2 \\cdot ${90 - beta}^\\circ = ${gam}^\\circ$`,
        };
      }
      const k = r.int(0, 2);
      if (k === 0) {
        const a = r.int(2, 16) * 5;
        return {
          text: `Dve ravni zrcali sta postavljeni pod pravim kotom ($90^\\circ$, kot v kotu sobe). Žarek pade na prvo zrcalo pod vpadnim kotom $${a}^\\circ$, se odbije in pade na drugo zrcalo. Kolikšen je vpadni kot na drugem zrcalu?`,
          answer: num(90 - a, "°", null, [[a, "Vpadnici obeh zrcal sta pravokotni druga na drugo, zato kot ni enak."], [180 - 2 * a, "To je kot med vpadnim in odbitim žarkom na prvem zrcalu."]]),
          hint: "Nariši skico. Odbiti žarek oklepa s prvim zrcalom kot $90^\\circ - \\alpha$. Trikotnik med žarkom in zrcaloma ima pravi kot v kotu.",
          data: { given: [dat("\\alpha_1", a, "°"), T("kot med zrcaloma") + " = 90^\\circ"], find: ["\\alpha_2"] },
          formula: [lawF, "\\alpha_2 = 90^\\circ - \\alpha_1"],
          solution: `Odbiti žarek oklepa s prvim zrcalom kot $90^\\circ - ${a}^\\circ = ${90 - a}^\\circ$.\nV trikotniku iz žarka in obeh zrcal je kot ob drugem zrcalu $180^\\circ - 90^\\circ - ${90 - a}^\\circ = ${a}^\\circ$ (kot med žarkom in drugim zrcalom).\nVpadni kot na drugem zrcalu: $\\alpha_2 = 90^\\circ - ${a}^\\circ = ${90 - a}^\\circ$`,
        };
      }
      if (k === 1) {
        const h = r.int(150, 190);
        const eye = h - r.int(9, 12);
        const askBottom = r.next() < 0.5;
        const val = askBottom ? eye / 2 : h / 2;
        return {
          text: askBottom
            ? `${name} je ${g(name, "visok", "visoka")} $${qty(h, "cm")}$, oči ima $${qty(eye, "cm")}$ nad tlemi. Najmanj kako visoko nad tlemi je lahko spodnji rob navpičnega zrcala, da ${name} v njem še vidi svoje čevlje? Zaokroži na eno decimalko.`
            : `${name} je ${g(name, "visok", "visoka")} $${qty(h, "cm")}$. Najmanj kako visoko mora biti navpično zrcalo na steni, da se ${name} v njem vidi od glave do pet? Zaokroži na eno decimalko.`,
          answer: num(val, "cm", 1, [[askBottom ? eye : h, "Zrcalo ne potrebuje biti tako veliko: žarek od čevljev do oči se odbije na polovici višine oči."], [askBottom ? h / 2 : eye / 2, askBottom ? "Za spodnji rob je pomembna višina oči, ne celotna višina telesa." : "To je višina spodnjega roba. Vprašanje sprašuje po višini zrcala."]]),
          hint: "Nariši žarek od čevljev (oz. temena) do zrcala in v oči. Po odbojnem zakonu se odbije v točki na polovici navpične razdalje.",
          data: { given: askBottom ? [dat("h", h, "cm"), dat("h_o", eye, "cm")] : [dat("h", h, "cm")], find: [askBottom ? "y" : "l"] },
          formula: askBottom ? ["y = \\dfrac{h_o}{2}"] : ["l = \\dfrac{h}{2}"],
          solution: askBottom
            ? `Žarek od čevljev se odbije v oči; vpadni kot je enak odbojnemu, zato se odbije na polovici višine oči.\n$y = \\dfrac{h_o}{2} = \\dfrac{${eye}\\ \\mathrm{cm}}{2} ${res(val, 1, "cm")}$`
            : `Žarka od temena in od čevljev se odbijeta na polovici razdalje do oči, zato zrcalo pokrije polovico telesa.\n$l = \\dfrac{h}{2} = \\dfrac{${h}\\ \\mathrm{cm}}{2} ${res(val, 1, "cm")}$`,
        };
      }
      const a0 = r.int(2, 10) * 5;
      const phi = r.int(1, 4) * 5;
      const gam = 2 * (a0 + phi);
      return {
        text: `Laserski žarek pade na ravno zrcalo pod vpadnim kotom $${a0}^\\circ$. ${name} zasuka zrcalo za $${phi}^\\circ$ tako, da se vpadni kot poveča. Kolikšen kot zdaj oklepata vpadni in odbiti žarek?`,
        answer: num(gam, "°", null, [[2 * a0 + phi, "Ko se vpadni kot poveča, se za enako poveča tudi odbojni kot."], [a0 + phi, "To je novi vpadni kot. Kot med žarkoma je vsota vpadnega in odbojnega kota."]]),
        hint: "Najprej izračunaj novi vpadni kot. Po odbojnem zakonu je odbojni kot enak.",
        data: { given: [dat("\\alpha_0", a0, "°"), dat("\\varphi", phi, "°")], find: ["\\gamma"] },
        formula: ["\\alpha = \\alpha_0 + \\varphi", lawF, "\\gamma = 2\\alpha"],
        solution: `Novi vpadni kot: $\\alpha = ${a0}^\\circ + ${phi}^\\circ = ${a0 + phi}^\\circ$\nOdbojni kot je enak: $\\alpha' = ${a0 + phi}^\\circ$\n$\\gamma = 2 \\cdot ${a0 + phi}^\\circ = ${gam}^\\circ$ (žarek se je zasukal za $2\\varphi = ${2 * phi}^\\circ$)`,
      };
    },
  },
  {
    id: "dod-os-lom-svetlobe",
    topics: ["FIZ-OS-8/lom-svetlobe"],
    gen(level, r) {
      const name = r.pick(NAMES);
      const MED = { zrak: [1, "zraka", "zrak", "i"], voda: [1.33, "vode", "vodo", "a"], steklo: [1.5, "stekla", "steklo", "e"], olje: [1.47, "olja", "olje", "e"] };
      if (level === 1) {
        if (r.next() < 0.6) {
          const [A, B] = r.pick([["zrak", "voda"], ["zrak", "steklo"], ["voda", "zrak"], ["steklo", "zrak"], ["zrak", "olje"], ["steklo", "voda"], ["voda", "steklo"]]);
          const perp = r.next() < 0.15;
          const a = perp ? 0 : r.int(2, 14) * 5;
          const toward = MED[B][0] > MED[A][0];
          const opts = {
            in: "lomni kot je manjši od vpadnega (žarek se lomi proti vpadnici)",
            out: "lomni kot je večji od vpadnega (žarek se lomi od vpadnice)",
            no: "žarek se ne lomi (lomni kot je enak vpadnemu)",
          };
          const ok = perp ? opts.no : toward ? opts.in : opts.out;
          const why = {
            in: perp ? "Pri pravokotnem vpadu se žarek ne lomi." : `Iz ${MED[A][1]} v ${MED[B][2]} prehaja žarek v optično redkejšo snov, zato se lomi od vpadnice.`,
            out: perp ? "Pri pravokotnem vpadu se žarek ne lomi." : `Iz ${MED[A][1]} v ${MED[B][2]} prehaja žarek v optično gostejšo snov, zato se lomi proti vpadnici.`,
            no: "Žarek, ki pade poševno na mejo dveh različnih snovi, se lomi.",
          };
          const key = perp ? "no" : toward ? "in" : "out";
          return concept(r, {
            q: perp
              ? `Žarek pade iz ${MED[A][1]} v ${MED[B][2]} pravokotno na mejo (vpadni kot $0^\\circ$). Kaj se zgodi z njim?`
              : `${name} usmeri ozek snop svetlobe iz ${MED[A][1]} v ${MED[B][2]} pod vpadnim kotom $${a}^\\circ$. Kaj velja za lomljeni žarek?`,
            ok,
            wrong: Object.keys(opts).filter((x) => x !== key).map((x) => [opts[x], why[x]]),
            hint: "Pri prehodu v optično gostejšo snov (npr. iz zraka v vodo ali steklo) se žarek lomi proti vpadnici, pri prehodu v redkejšo od nje. Pravokotni žarek se ne lomi.",
            given: [perp ? "\\alpha = 0^\\circ" : dat("\\alpha", a, "°"), `${T(A)} \\rightarrow ${T(B)}`],
            find: [T("smer lomljenega žarka")],
            sol: [
              perp ? "Žarek pade pravokotno na mejo, zato ne spremeni smeri." : `${B[0].toUpperCase()}${B.slice(1)} je optično ${toward ? "gostejš" : "redkejš"}${MED[B][3]} od ${MED[A][1]}, zato se žarek lomi ${toward ? "proti vpadnici" : "od vpadnice"}.`,
              `Pravilno: ${ok}.`,
            ],
          });
        }
        const beta = r.int(1, 17) * 5;
        return {
          text: `Žarek pade na gladino vode v akvariju tako, da z gladino oklepa kot $${beta}^\\circ$. Kolikšen je vpadni kot?`,
          answer: num(90 - beta, "°", null, [[beta, "Vpadni kot merimo od vpadnice (pravokotnice na mejo), ne od gladine."]]),
          hint: "Vpadnica je pravokotna na mejo snovi. Vpadni kot je kot med žarkom in vpadnico.",
          data: { given: [dat("\\beta", beta, "°")], find: ["\\alpha"] },
          formula: "\\alpha = 90^\\circ - \\beta",
          solution: `Vpadnica je pravokotna na gladino, zato je kot med žarkom in vpadnico komplement danega kota.\n$\\alpha = 90^\\circ - ${beta}^\\circ = ${90 - beta}^\\circ$`,
        };
      }
      if (level === 2) {
        if (r.next() < 0.55) {
          const B = r.pick(["voda", "steklo", "olje"]);
          const a = r.int(4, 15) * 5;
          const b = Math.round((Math.asin(Math.sin((a * Math.PI) / 180) / MED[B][0]) * 180) / Math.PI);
          const askRefl = r.next() < 0.6;
          const val = askRefl ? 180 - a - b : 90 - b;
          return {
            text: askRefl
              ? `Žarek pade iz zraka na ${MED[B][2]} pod vpadnim kotom $${a}^\\circ$. Del svetlobe se odbije, del se lomi; lomni kot je $${b}^\\circ$. Kolikšen kot oklepata odbiti in lomljeni žarek?`
              : `Žarek pade iz zraka na ${MED[B][2]} pod vpadnim kotom $${a}^\\circ$ in se lomi pod lomnim kotom $${b}^\\circ$. Kolikšen kot oklepa lomljeni žarek z mejo snovi?`,
            answer: num(val, "°", null, askRefl ? [[a - b, "To je kot, za katerega se žarek pri lomu odkloni."], [a + b, "Odbiti in lomljeni žarek sta na nasprotnih straneh meje; upoštevaj ravni kot $180^\\circ$."], [180 - 2 * a, "To je kot med vpadnim in odbitim žarkom."]] : [[b, "To je lomni kot (od vpadnice). Vprašanje sprašuje po kotu z mejo."], [90 - a, "Uporabi lomni kot, ne vpadnega."]]),
            hint: askRefl ? "Odbojni kot je enak vpadnemu. Odbiti žarek oklepa z mejo kot $90^\\circ - \\alpha$, lomljeni pa $90^\\circ - \\beta$." : "Vpadnica je pravokotna na mejo. Lomni kot merimo od vpadnice.",
            data: { given: [dat("\\alpha", a, "°"), dat("\\beta", b, "°")], find: [askRefl ? "\\gamma" : "\\delta"] },
            formula: askRefl ? ["\\alpha' = \\alpha", "\\gamma = (90^\\circ - \\alpha') + (90^\\circ - \\beta)"] : ["\\delta = 90^\\circ - \\beta"],
            solution: askRefl
              ? `Odbiti žarek oklepa z mejo kot $90^\\circ - ${a}^\\circ = ${90 - a}^\\circ$.\nLomljeni žarek oklepa z mejo kot $90^\\circ - ${b}^\\circ = ${90 - b}^\\circ$.\n$\\gamma = ${90 - a}^\\circ + ${90 - b}^\\circ = ${val}^\\circ$`
              : `Lomni kot $\\beta = ${b}^\\circ$ merimo od vpadnice, ki je pravokotna na mejo.\n$\\delta = 90^\\circ - ${b}^\\circ = ${val}^\\circ$`,
          };
        }
        const P = r.pick([
          ["Leča je na sredini debelejša kot na robu.", "zbiralna"],
          ["Vzporedni žarki se po prehodu skozi lečo razpršijo, kot da bi prihajali iz ene točke.", "razpršilna"],
          [`${name} s povečevalnim steklom (lupo) bere drobni tisk.`, "zbiralna"],
          [`${name} s steklom zbere sončne žarke v svetlo točko na papirju.`, "zbiralna"],
          ["Leča je na sredini tanjša kot na robu.", "razpršilna"],
          ["Kratkovidna oseba nosi očala, s katerimi ostro vidi oddaljene predmete.", "razpršilna"],
          ["Leča v projektorju naredi na platnu povečano sliko.", "zbiralna"],
          ["Skozi lečo so vsi predmeti videti pomanjšani in pokončni.", "razpršilna"],
        ]);
        const W = {
          zbiralna: "Zbiralna leča je na sredini debelejša in vzporedne žarke zbere v gorišču.",
          razpršilna: "Razpršilna leča je na sredini tanjša in vzporedne žarke razprši.",
          plosca: "Ravna steklena ploščica žarkov ne zbere in ne razprši, le malo jih premakne.",
        };
        const ok = P[1] === "zbiralna" ? "zbiralna leča" : "razpršilna leča";
        return concept(r, {
          q: `${P[0]} Kakšna leča je to?`,
          ok,
          wrong: [
            [P[1] === "zbiralna" ? "razpršilna leča" : "zbiralna leča", P[1] === "zbiralna" ? W.zbiralna : W.razpršilna],
            ["ravna steklena ploščica", W.plosca],
          ],
          hint: "Zbiralna leča je na sredini debelejša in vzporedne žarke zbere v gorišču. Razpršilna je na sredini tanjša in jih razprši.",
          given: [`${T("tema")} = ${T("zbiralna in razpršilna leča")}`],
          find: [T("vrsta leče")],
          sol: [P[1] === "zbiralna" ? W.zbiralna : W.razpršilna, `Pravilno: ${ok}.`],
        });
      }
      // Raven 3: slika pri zbiralni leči in lomnost.
      const k = r.int(0, 2);
      if (k === 0) {
        const f = r.int(3, 25) * 2;
        const askTotal = r.next() < 0.5;
        const val = askTotal ? 4 * f : 2 * f;
        return {
          text: askTotal
            ? `${name} postavi svečo $${qty(2 * f, "cm")}$ pred zbiralno lečo z goriščno razdaljo $${qty(f, "cm")}$. Na zaslonu za lečo nastane ostra slika. Kako daleč od sveče je zaslon?`
            : `Predmet je $${qty(2 * f, "cm")}$ pred zbiralno lečo z goriščno razdaljo $${qty(f, "cm")}$. Kako daleč za lečo nastane ostra slika?`,
          answer: num(val, "cm", null, askTotal ? [[2 * f, "To je razdalja od leče do slike. Zaslon je od sveče še za razdaljo do leče dlje."], [f, "Slika ne nastane v gorišču, ker žarki iz sveče niso vzporedni."]] : [[f, "Slika nastane v gorišču le, kadar je predmet zelo daleč (vzporedni žarki)."], [4 * f, "To je razdalja od predmeta do slike."]]),
          hint: "Predmet je v dvojni goriščni razdalji. Nariši karakteristična žarka: vzporedni gre po lomu skozi gorišče, žarek skozi gorišče gre po lomu vzporedno.",
          data: { given: [dat("a", 2 * f, "cm"), dat("f", f, "cm")], find: [askTotal ? "d" : "b"] },
          formula: askTotal ? ["a = 2f \\Rightarrow b = 2f", "d = a + b"] : ["a = 2f \\Rightarrow b = 2f"],
          solution: `$a = ${2 * f}\\ \\mathrm{cm} = 2f$: predmet je v dvojni goriščni razdalji, zato je slika obrnjena, enako velika in tudi v dvojni goriščni razdalji.\n$b = 2f = ${qty(2 * f, "cm")}$${askTotal ? `\n$d = a + b = ${2 * f}\\ \\mathrm{cm} + ${2 * f}\\ \\mathrm{cm} = ${qty(4 * f, "cm")}$` : ""}`,
        };
      }
      if (k === 1) {
        const rev = r.next() < 0.5;
        if (rev) {
          const j = r.pick([1, 1.25, 2, 2.5, 4, 5, 8, 10, 12.5, 20]);
          const fcm = 100 / j;
          return {
            text: `Lomnost leče je $j = \\dfrac{1}{f}$, kjer je $f$ goriščna razdalja v metrih (enota dioptrija, $1\\ \\mathrm{D} = 1\\ \\mathrm{m^{-1}}$). ${name} ima lupo z lomnostjo $${qty(tx(j), "D")}$. Kolikšna je goriščna razdalja v centimetrih?`,
            answer: num(fcm, "cm", null, [[fcm / 100, "To je goriščna razdalja v metrih. Pretvori v centimetre."], [j * 100, "Goriščna razdalja je obratna vrednost lomnosti."]]),
            hint: "Iz $j = \\dfrac{1}{f}$ izrazi $f$, rezultat dobiš v metrih. Nato ga pretvori v centimetre.",
            data: { given: [dat("j", tx(j), "D")], find: ["f"] },
            formula: ["j = \\dfrac{1}{f}", "f = \\dfrac{1}{j}"],
            solution: `$f = \\dfrac{1}{j} = \\dfrac{1}{${tx(j)}\\ \\mathrm{m^{-1}}} = ${qty(tx(fcm / 100), "m")}$\n$f = ${qty(tx(fcm), "cm")}$`,
          };
        }
        const fcm = r.pick([5, 8, 10, 12.5, 20, 25, 40, 50]);
        const j = 100 / fcm;
        return {
          text: `Lomnost leče je $j = \\dfrac{1}{f}$, kjer je $f$ goriščna razdalja v metrih (enota dioptrija, D). Zbiralna leča zbere sončne žarke $${qty(tx(fcm), "cm")}$ za seboj. Kolikšna je njena lomnost?`,
          answer: num(j, "D", null, [[1 / fcm, "Goriščno razdaljo najprej pretvori v metre."], [fcm / 100, "Lomnost je obratna vrednost goriščne razdalje."]], { unitAlternatives: ["dioptrij", "dioptrije", "m-1", "1/m"] }),
          hint: "Sončni žarki so skoraj vzporedni, zato se zberejo v gorišču. Goriščno razdaljo pretvori v metre.",
          data: { given: [dat("f", tx(fcm), "cm")], find: ["j"] },
          formula: ["j = \\dfrac{1}{f}"],
          solution: `Vzporedni žarki se zberejo v gorišču: $f = ${qty(tx(fcm), "cm")} = ${qty(tx(fcm / 100), "m")}$\n$j = \\dfrac{1}{f} = \\dfrac{1}{${tx(fcm / 100)}\\ \\mathrm{m}} = ${qty(tx(j), "D")}$`,
        };
      }
      const f = r.int(4, 15) * 2;
      const zone = r.int(0, 3);
      const a = zone === 0 ? r.int(2 * f + 2, 4 * f) : zone === 1 ? 2 * f : zone === 2 ? r.int(f + 1, 2 * f - 1) : r.int(Math.ceil(f / 3), f - 1);
      const O = {
        far: "obrnjena in pomanjšana (realna)",
        same: "obrnjena in enako velika (realna)",
        big: "obrnjena in povečana (realna)",
        virt: "pokončna in povečana (navidezna)",
      };
      const key = ["far", "same", "big", "virt"][zone];
      const W = {
        far: "Pomanjšana obrnjena slika nastane le, če je predmet dlje od dvojne goriščne razdalje.",
        same: "Enako velika slika nastane le, če je predmet točno v dvojni goriščni razdalji.",
        big: "Povečana obrnjena slika nastane, če je predmet med goriščem in dvojno goriščno razdaljo.",
        virt: "Pokončna navidezna slika (lupa) nastane le, če je predmet bliže leči od gorišča.",
      };
      const where = ["dlje od dvojne goriščne razdalje", "točno v dvojni goriščni razdalji", "med goriščem in dvojno goriščno razdaljo", "med lečo in goriščem"][zone];
      return concept(r, {
        q: `Predmet je $${qty(a, "cm")}$ pred zbiralno lečo z goriščno razdaljo $${qty(f, "cm")}$. Kakšna je slika?`,
        ok: O[key],
        wrong: Object.keys(O).filter((x) => x !== key).map((x) => [O[x], W[x]]),
        hint: "Primerjaj razdaljo predmeta z $f$ in $2f$. Nato nariši karakteristična žarka.",
        given: [dat("a", a, "cm"), dat("f", f, "cm")],
        find: [T("lastnosti slike")],
        formula: ["2f = " + qty(2 * f, "cm")],
        sol: [`$2f = ${qty(2 * f, "cm")}$, zato je predmet ${where}.`, `Slika je ${O[key]}.`],
      });
    },
  },
  {
    id: "dod-os-nebo-in-osoncje",
    topics: ["FIZ-OS-8/nebo-in-osoncje"],
    gen(level, r) {
      const name = r.pick(NAMES);
      const PH = ["mlaj", "prvi krajec", "ščip", "zadnji krajec"];
      const PHG = ["mlaja", "prvega krajca", "ščipa", "zadnjega krajca"];
      if (level === 1) {
        if (r.next() < 0.45) {
          const t = r.int(2, 20);
          const ctx = r.pick([`${name} opazuje zvezdno nebo $${t}$ ur.`, `Fotograf snema nebo s kamero, ki stoji pri miru $${t}$ ur.`, `Od sončnega vzhoda do večera mine $${t}$ ur.`]);
          return {
            text: `${ctx} Za koliko stopinj se v tem času Zemlja zavrti okoli svoje osi? Zemlja se enkrat zavrti v $24$ urah.`,
            answer: num(15 * t, "°", null, [[15, "To je zasuk v eni uri. Pomnoži s številom ur."], [30 * t, "Celoten zasuk $360^\\circ$ traja 24 ur, ne 12 ur."]]),
            hint: "V 24 urah se Zemlja zavrti za $360^\\circ$. Koliko je to v eni uri?",
            data: { given: [dat("t", t, "h"), dat("t_0", 24, "h")], find: ["\\varphi"] },
            formula: ["\\omega = \\dfrac{360^\\circ}{24\\ \\mathrm{h}} = 15^\\circ/\\mathrm{h}", "\\varphi = \\omega \\cdot t"],
            solution: `V eni uri: $\\dfrac{360^\\circ}{24} = 15^\\circ$\n$\\varphi = 15^\\circ \\cdot ${t} = ${15 * t}^\\circ$`,
          };
        }
        const P = r.pick([
          { q: "Luna je med Soncem in Zemljo. Katero Lunino meno vidimo z Zemlje?", ok: "mlaj", wrong: [["ščip", "Ob ščipu je Zemlja med Soncem in Luno."], ["prvi krajec", "Ob krajcu so Sonce, Zemlja in Luna pod pravim kotom."], ["zadnji krajec", "Ob krajcu so Sonce, Zemlja in Luna pod pravim kotom."]] },
          { q: "Zemlja je med Soncem in Luno. Katero Lunino meno vidimo?", ok: "ščip", wrong: [["mlaj", "Ob mlaju je Luna med Soncem in Zemljo."], ["prvi krajec", "Ob krajcu so telesa pod pravim kotom."], ["zadnji krajec", "Ob krajcu so telesa pod pravim kotom."]] },
          { q: "Ob kateri Lunini meni lahko nastane Sončev mrk?", ok: "ob mlaju", wrong: [["ob ščipu", "Ob ščipu je Luna za Zemljo, zato lahko nastane Lunin mrk."], ["ob prvem krajcu", "Luna mora biti točno med Soncem in Zemljo."], ["ob kateri koli meni", "Luna mora biti na premici Sonce–Zemlja, med njima."]] },
          { q: "Ob kateri Lunini meni lahko nastane Lunin mrk?", ok: "ob ščipu", wrong: [["ob mlaju", "Ob mlaju lahko nastane Sončev mrk."], ["ob zadnjem krajcu", "Luna mora biti v Zemljini senci, za Zemljo."], ["ob kateri koli meni", "Luna mora biti na premici Sonce–Zemlja, za Zemljo."]] },
          { q: "Zakaj se izmenjujeta dan in noč?", ok: "Zemlja se vrti okoli svoje osi", wrong: [["Zemlja kroži okoli Sonca", "Kroženje okoli Sonca traja eno leto in povzroča letne čase."], ["Luna ponoči zakrije Sonce", "Luna Sonca ne zakriva vsako noč; to bi bil Sončev mrk."], ["Sonce ponoči ugasne", "Sonce sveti neprestano; mi smo takrat na neosvetljeni strani Zemlje."]] },
          { q: "Kaj vidimo, ko je Luna v Zemljini senci?", ok: "Lunin mrk", wrong: [["Sončev mrk", "Pri Sončevem mrku pade Lunina senca na Zemljo."], ["mlaj", "Ob mlaju je osvetljena stran Lune obrnjena stran od nas, a Luna ni v senci."], ["zadnji krajec", "Krajec je mena, ne mrk."]] },
          { q: "Koliko časa približno traja, da Luna obkroži Zemljo?", ok: "približno en mesec", wrong: [["en dan", "En dan traja vrtenje Zemlje okoli osi."], ["eno leto", "Eno leto traja kroženje Zemlje okoli Sonca."], ["en teden", "V enem tednu se mena spremeni le za četrtino."]] },
        ]);
        return concept(r, {
          ...P,
          hint: "Nariši Sonce, Zemljo in Luno na premici ali pod pravim kotom. Polovica Lune, obrnjena k Soncu, je vedno osvetljena.",
          given: [T("lega Sonca, Zemlje in Lune")],
          find: [T("pravilni odgovor")],
          sol: ["Luna ne sveti sama: vidimo tisti del osvetljene polovice, ki je obrnjen proti Zemlji. Mrk nastane, ko so Sonce, Zemlja in Luna na premici.", `Pravilno: ${P.ok}.`],
        });
      }
      if (level === 2) {
        const k = r.int(0, 2);
        if (k === 0) {
          const i = r.int(0, 3);
          const q = r.int(1, 4);
          const j = (i + q) % 4;
          const t = (q * 29.5) / 4;
          return {
            text: `Od mlaja do naslednjega mlaja mine $29{,}5$ dneva. Danes je ${PH[i]}. Čez koliko dni bo ${q === 4 ? "spet" : "prvič"} ${PH[j]}? Mene si sledijo: mlaj, prvi krajec, ščip, zadnji krajec. Zaokroži na eno decimalko.`,
            answer: num(t, "dni", 1, [[((4 - q) * 29.5) / 4, "Mene si sledijo v vrstnem redu mlaj → prvi krajec → ščip → zadnji krajec. Si štel v napačno smer?"], [q * 29.5 / 2, "Med zaporednima menama mine četrtina Luninega meseca, ne polovica."]], { unitAlternatives: ["dan", "dneva", "dnevi", "d"] }),
            hint: "Med dvema zaporednima menama mine četrtina Luninega meseca. Preštej, koliko četrtin je do iskane mene.",
            data: { given: [dat("T", "29{,}5", "dni"), T(`danes: ${PH[i]}`)], find: ["t"] },
            formula: ["t = k \\cdot \\dfrac{T}{4}"],
            solution: `Med zaporednima menama: $\\dfrac{29{,}5}{4} = 7{,}375$ dneva\nOd ${PHG[i]} do ${PHG[j]} ${q === 4 ? "(spet ista mena) " : ""}so $k = ${q}$ ${q === 1 ? "četrtina" : q === 2 ? "četrtini" : "četrtine"}.\n$t = ${q} \\cdot 7{,}375 ${res(t, 1, "dni")}$`,
          };
        }
        if (k === 1) {
          const n = r.int(10, 120);
          const ang = (n * 360) / 365.25;
          return {
            text: `Zemlja obkroži Sonce v $365{,}25$ dneva. Za kolikšen kot se premakne po svoji tirnici okoli Sonca v $${n}$ dneh? Zaokroži na eno decimalko.`,
            answer: num(ang, "°", 1, [[n * 15, "To je vrtenje okoli osi ($15^\\circ$ na uro). Vprašanje je o kroženju okoli Sonca."], [n, "Približno $1^\\circ$ na dan je dobra ocena, a izračunaj natančno."]]),
            hint: "V $365{,}25$ dneva opiše Zemlja $360^\\circ$. Izračunaj kot za en dan in ga pomnoži s številom dni.",
            data: { given: [dat("T", "365{,}25", "dni"), dat("t", n, "dni")], find: ["\\varphi"] },
            formula: ["\\varphi = \\dfrac{t}{T} \\cdot 360^\\circ"],
            solution: `$\\varphi = \\dfrac{${n}}{365{,}25} \\cdot 360^\\circ ${res(ang, 1, "°")}$`,
          };
        }
        const P = r.pick([
          { q: "Zakaj na Zemlji nastajajo letni časi?", ok: "ker je Zemljina os nagnjena glede na tirnico okoli Sonca", wrong: [["ker je Zemlja poleti bliže Soncu", "Razdalja se med letom malo spreminja; Zemlja je Soncu najbliže januarja."], ["ker se Zemlja vrti okoli svoje osi", "Vrtenje okoli osi povzroča dan in noč."], ["ker Luna zakriva Sonce", "To bi bil Sončev mrk, ki traja le nekaj minut."]] },
          { q: "Zakaj z Zemlje vidimo vedno isto stran Lune?", ok: "ker se Luna zavrti okoli svoje osi v enakem času, kot obkroži Zemljo", wrong: [["ker se Luna ne vrti okoli svoje osi", "Če se ne bi vrtela, bi med kroženjem videli vse njene strani."], ["ker je druga stran vedno v temi", "Tudi oddaljena stran Lune je osvetljena, npr. ob mlaju."], ["ker Zemlja zakriva drugo stran", "Zemlja ne more zakriti dela Lune, ki ga gledamo."]] },
          { q: "Zakaj Sončev mrk ni ob vsakem mlaju?", ok: "ker je Lunina tirnica nagnjena glede na Zemljino tirnico okoli Sonca", wrong: [["ker je Luna premajhna, da bi zakrila Sonce", "Ob mrku Luna Sonce lahko popolnoma zakrije."], ["ker ob mlaju Luna ni med Zemljo in Soncem", "Ob mlaju je Luna med Zemljo in Soncem, a navadno malo nad ali pod premico."], ["ker je takrat noč", "Ob mlaju je Luna na dnevnem nebu, blizu Sonca."]] },
          { q: "Kako se spremenijo Lunine mene po ščipu?", ok: "osvetljeni del se manjša do zadnjega krajca in nato do mlaja", wrong: [["osvetljeni del se veča do prvega krajca", "Prvi krajec je med mlajem in ščipom."], ["Luna ostane polna en teden", "Ščip traja le en dan; mena se spreminja vsak dan."], ["takoj nastopi mlaj", "Med ščipom in mlajem je še zadnji krajec (približno 7 dni)."]] },
          { q: "Zakaj Sonce vzhaja na vzhodu?", ok: "ker se Zemlja vrti od zahoda proti vzhodu", wrong: [["ker Sonce kroži okoli Zemlje", "Zemlja kroži okoli Sonca; navidezno gibanje Sonca povzroča vrtenje Zemlje."], ["ker se Zemlja vrti od vzhoda proti zahodu", "Potem bi Sonce vzhajalo na zahodu."], ["ker Luna potiska Sonce", "Luna ne vpliva na gibanje Sonca po nebu."]] },
        ]);
        return concept(r, {
          ...P,
          hint: "Loči: vrtenje Zemlje okoli osi (dan), kroženje okoli Sonca z nagnjeno osjo (leto, letni časi), kroženje Lune okoli Zemlje (mene, mrki).",
          given: [T("gibanje Zemlje in Lune")],
          find: [T("razlaga")],
          sol: ["Vrtenje Zemlje povzroča dan in noč, kroženje okoli Sonca z nagnjeno osjo letne čase, kroženje Lune pa mene in mrke.", `Pravilno: ${P.ok}.`],
        });
      }
      if (r.next() < 0.55) {
        const B = r.pick([
          { who: "Zemlja", around: "Sonca", rT: "150 \\cdot 10^6", rr: 150e6, tT: qty("365{,}25", "dni"), ts: 365.25 * 86400, conv: `365{,}25 \\cdot 24 \\cdot 3600\\ \\mathrm{s}` },
          { who: "Luna", around: "Zemlje", rT: "384\\,000", rr: 384000, tT: qty("27{,}3", "dni"), ts: 27.3 * 86400, conv: `27{,}3 \\cdot 24 \\cdot 3600\\ \\mathrm{s}` },
          { who: "Mars", around: "Sonca", rT: "228 \\cdot 10^6", rr: 228e6, tT: qty("687", "dni"), ts: 687 * 86400, conv: `687 \\cdot 24 \\cdot 3600\\ \\mathrm{s}` },
          { who: "Venera", around: "Sonca", rT: "108 \\cdot 10^6", rr: 108e6, tT: qty("225", "dni"), ts: 225 * 86400, conv: `225 \\cdot 24 \\cdot 3600\\ \\mathrm{s}` },
          { who: "Mednarodna vesoljska postaja", around: "Zemljinega središča", rT: "6\\,780", rr: 6780, tT: qty("92{,}7", "min"), ts: 92.7 * 60, conv: `92{,}7 \\cdot 60\\ \\mathrm{s}` },
          { who: "Merkur", around: "Sonca", rT: "58 \\cdot 10^6", rr: 58e6, tT: qty("88", "dni"), ts: 88 * 86400, conv: `88 \\cdot 24 \\cdot 3600\\ \\mathrm{s}` },
        ]);
        const v = (2 * 3.14 * B.rr) / B.ts;
        const ss = roundHalfUp(B.ts, 0);
        return {
          text: `${B.who} kroži okoli ${B.around} po približno krožni tirnici s polmerom $${B.rT}\\ \\mathrm{km}$. En obhod traja $${B.tT}$. S kolikšno hitrostjo se giblje? Rezultat zapiši v km/s, uporabi $\\pi = 3{,}14$ in zaokroži na dve decimalki.`,
          answer: num(v, "km/s", 2, [[B.rr / B.ts, "Pot enega obhoda je obseg kroga $2\\pi r$, ne polmer."], [(3.14 * B.rr) / B.ts, "Obseg kroga je $2\\pi r$ (ali $\\pi d$)."], [v * 3600, "To je hitrost v km/h. Čas pretvori v sekunde."]]),
          hint: "Pot enega obhoda je obseg kroga $o = 2\\pi r$. Čas obhoda pretvori v sekunde.",
          data: { given: [dat("r", B.rT, "km"), `t_0 = ${B.tT}`, "\\pi = 3{,}14"], find: ["v"] },
          formula: ["o = 2\\pi r", "v = \\dfrac{o}{t_0}"],
          solution: `$o = 2\\pi r = 2 \\cdot 3{,}14 \\cdot ${B.rT}\\ \\mathrm{km} = ${qty(grp(roundHalfUp(2 * 3.14 * B.rr, 0)), "km")}$\n$t_0 = ${B.conv} = ${qty(grp(ss), "s")}$\n$v = \\dfrac{o}{t_0} ${res(v, 2, "km/s")}$`,
        };
      }
      const C = [["Ljubljani", 14.5, "Ljubljana"], ["Kopru", 13.7, "Koper"], ["Murski Soboti", 16.2, "Murska Sobota"], ["Londonu", 0, "London"], ["Rimu", 12.5, "Rim"], ["Dunaju", 16.4, "Dunaj"], ["Berlinu", 13.4, "Berlin"], ["Parizu", 2.4, "Pariz"], ["Atenah", 23.7, "Atene"], ["Varšavi", 21.0, "Varšava"]];
      const [a, b] = r.shuffle(C).slice(0, 2);
      const [E, W] = a[1] > b[1] ? [a, b] : [b, a];
      const dl = roundHalfUp(E[1] - W[1], 1);
      const dt = 4 * dl;
      return {
        text: `Zemlja se zavrti za $360^\\circ$ v 24 urah. Pravo (sončno) poldne je v kraju, ki je bolj vzhodno, prej. ${E[2]} ${E[2] === "Atene" ? "ležijo" : "leži"} na $${tx(E[1])}^\\circ$, ${W[2]} pa na $${tx(W[1])}^\\circ$ vzhodne geografske dolžine. Za koliko minut prej je pravo poldne v ${E[0]} kot v ${W[0]}?`,
        answer: num(dt, "min", null, [[dl * 15, "Zemlja se v eni minuti zavrti za $0{,}25^\\circ$, ne za $15^\\circ$."], [dl / 15, "To je razlika v urah. Pretvori v minute."], [dl, "Za $1^\\circ$ potrebuje Zemlja 4 minute."]]),
        hint: "Najprej izračunaj, v koliko minutah se Zemlja zavrti za $1^\\circ$. Nato pomnoži z razliko geografskih dolžin.",
        data: { given: [dat("\\lambda_1", tx(E[1]), "°"), dat("\\lambda_2", tx(W[1]), "°"), "\\omega = \\dfrac{360^\\circ}{24\\ \\mathrm{h}}"], find: ["\\Delta t"] },
        formula: ["\\dfrac{24 \\cdot 60\\ \\mathrm{min}}{360^\\circ} = 4\\ \\mathrm{min}/^\\circ", "\\Delta t = 4\\ \\mathrm{min} \\cdot \\Delta\\lambda"],
        solution: `Za $1^\\circ$: $\\dfrac{1440\\ \\mathrm{min}}{360} = 4\\ \\mathrm{min}$\n$\\Delta\\lambda = ${tx(E[1])}^\\circ - ${tx(W[1])}^\\circ = ${tx(dl)}^\\circ$\n$\\Delta t = 4\\ \\mathrm{min} \\cdot ${tx(dl)} = ${qty(tx(dt), "min")}$`,
      };
    },
  },
  {
    id: "dod-os-sestavljanje-sil",
    topics: ["FIZ-OS-8/sestavljanje-sil-in-ravnovesje"],
    gen(level, r) {
      const [n1, n2] = r.shuffle(NAMES).slice(0, 2);
      if (level === 1) {
        const F1 = r.int(4, 40) * 5;
        const F2 = r.int(2, 30) * 5;
        const same = r.next() < 0.5;
        const R = same ? F1 + F2 : Math.abs(F1 - F2);
        const text = same
          ? r.pick([
              `${n1} in ${n2} potiskata omaro v isto smer. ${n1} deluje s silo $${qty(F1, "N")}$, ${n2} s silo $${qty(F2, "N")}$. Kolikšna je rezultanta sil?`,
              `Čoln poganja motor s silo $${qty(F1, "N")}$, veter pa ga potiska v isto smer s silo $${qty(F2, "N")}$. Kolikšna je rezultanta teh dveh sil?`,
              `Sani vlečeta dva psa v isto smer, prvi s silo $${qty(F1, "N")}$, drugi s silo $${qty(F2, "N")}$. Kolikšna je rezultanta?`,
            ])
          : r.pick([
              `${n1} vleče vrv v levo s silo $${qty(F1, "N")}$, ${n2} pa v desno s silo $${qty(F2, "N")}$. Kolikšna je velikost rezultante?`,
              `Čoln poganja motor naprej s silo $${qty(F1, "N")}$, veter ga potiska nazaj s silo $${qty(F2, "N")}$. Kolikšna je velikost rezultante?`,
              `${n1} potiska voziček naprej s silo $${qty(F1, "N")}$, ${n2} pa ga zadržuje s silo $${qty(F2, "N")}$ v nasprotni smeri. Kolikšna je velikost rezultante?`,
            ]);
        return {
          text,
          answer: num(R, "N", null, [[same ? Math.abs(F1 - F2) : F1 + F2, same ? "Sili kažeta v isto smer, zato ju seštejemo." : "Sili kažeta v nasprotni smeri, zato ju odštejemo."]]),
          hint: same ? "Sili na isti premici v isto smer seštejemo." : "Sili v nasprotnih smereh odštejemo: večja minus manjša.",
          data: { given: [dat("F_1", F1, "N"), dat("F_2", F2, "N")], find: ["F_R"] },
          formula: same ? "F_R = F_1 + F_2" : "F_R = |F_1 - F_2|",
          solution: same
            ? `Sili kažeta v isto smer, zato ju seštejemo.\n$F_R = ${F1}\\ \\mathrm{N} + ${F2}\\ \\mathrm{N} = ${qty(R, "N")}$`
            : `Sili kažeta v nasprotni smeri, zato večji odštejemo manjšo.\n$F_R = |${F1}\\ \\mathrm{N} - ${F2}\\ \\mathrm{N}| = ${qty(R, "N")}$${F1 === F2 ? " (sili sta v ravnovesju)" : ""}`,
        };
      }
      if (level === 2) {
        if (r.next() < 0.5) {
          const L = Array.from({ length: 3 }, () => r.int(20, 80) * 5);
          const D = Array.from({ length: 3 }, () => r.int(20, 80) * 5);
          const sl = L.reduce((a, b) => a + b, 0);
          const sd = D.reduce((a, b) => a + b, 0);
          const R = sd - sl;
          return {
            text: `Pri vlečenju vrvi vlečejo trije učenci v levo s silami $${L.map((x) => qty(x, "N")).join("$, $")}$, trije v desno pa s silami $${D.map((x) => qty(x, "N")).join("$, $")}$. Kolikšna je rezultanta? Zapiši jo pozitivno, če kaže v desno, in negativno, če kaže v levo.`,
            answer: num(R, "N", null, [[sl + sd, "Sile v nasprotnih smereh se ne seštevajo: vsoto ene ekipe odštej od vsote druge."], [sd - L[0] - D[0], "Upoštevati moraš vse tri sile na vsaki strani."]]),
            hint: "Najprej seštej sile vsake ekipe posebej. Nato odštej: desno minus levo.",
            data: { given: [`F_\\mathrm{L} = ${L.join(" + ")}\\ \\mathrm{N}`, `F_\\mathrm{D} = ${D.join(" + ")}\\ \\mathrm{N}`], find: ["F_R"] },
            formula: ["F_R = F_\\mathrm{D} - F_\\mathrm{L}"],
            solution: `Levo: $F_\\mathrm{L} = ${L.join(" + ")} = ${qty(sl, "N")}$\nDesno: $F_\\mathrm{D} = ${D.join(" + ")} = ${qty(sd, "N")}$\n$F_R = ${sd} - ${sl} = ${qty(R, "N")}$ ${R > 0 ? "(v desno)" : R < 0 ? "(v levo)" : "(ravnovesje)"}`,
          };
        }
        const [thing, verb, holder, pron] = r.pick([["svetilka", "visi na vrvici", "vrvica", "jo"], ["slika", "visi na žici", "žica", "jo"], ["utež", "visi na vzmetni tehtnici", "vzmetna tehtnica", "jo"], ["lonec z rožo", "visi na verigi", "veriga", "ga"], ["ptičja hišica", "visi na vrvi", "vrv", "jo"]]);
        const mg = r.int(15, 250) * 10; // g
        const F = (mg / 1000) * G;
        return {
          text: `${thing[0].toUpperCase()}${thing.slice(1)} z maso $${qty(mg, "g")}$ miruje in ${verb}. S kolikšno silo ${pron} drži ${holder}? Uporabi $g = ${G_TEX}\\ \\mathrm{N/kg}$ in zaokroži na dve decimalki.`,
          answer: num(F, "N", 2, [[mg * G, "Maso najprej pretvori v kilograme."], [mg / 1000, "To je masa v kg. Sila je teža: pomnoži z $g$."]]),
          hint: "Telo miruje, zato sta sila nosilca in teža v ravnovesju: enako veliki in nasprotno usmerjeni.",
          data: { given: [dat("m", mg, "g"), dat("g", G_TEX, "N/kg")], find: ["F"] },
          formula: ["F = F_g", "F_g = m \\cdot g"],
          solution: `Ravnovesje dveh sil: sila nosilca je enaka teži.\n$m = ${qty(mg, "g")} = ${qty(tx(mg / 1000), "kg")}$\n$F = m \\cdot g = ${tx(mg / 1000)}\\ \\mathrm{kg} \\cdot ${G_TEX}\\ \\mathrm{N/kg} ${res(F, 2, "N")}$`,
        };
      }
      const k = r.int(0, 2);
      if (k === 0) {
        const triple = r.pick([[3, 4], [6, 8], [5, 12], [8, 15], [9, 12], [12, 16], [7, 24], [20, 21]]);
        const m = r.pick([5, 10, 20]);
        const useT = r.next() < 0.5;
        const F1 = useT ? triple[0] * m : r.int(10, 90) * 5;
        const F2 = useT ? triple[1] * m : r.int(10, 90) * 5;
        const R = Math.hypot(F1, F2);
        const eq = r.next() < 0.5;
        return {
          text: eq
            ? `${n1} vleče zaboj proti severu s silo $${qty(F1, "N")}$, ${n2} pa proti vzhodu s silo $${qty(F2, "N")}$. S kolikšno silo mora vleči tretji, da zaboj ostane v ravnovesju? Zaokroži na celo število.`
            : `Na čoln delujeta dve pravokotni sili: tok reke s silo $${qty(F1, "N")}$ in veslač s silo $${qty(F2, "N")}$. Kolikšna je rezultanta? Zaokroži na celo število.`,
          answer: num(R, "N", 0, [[F1 + F2, "Sili nista na isti premici, zato ju ne smeš sešteti. Uporabi Pitagorov izrek."], [Math.abs(F1 - F2), "Sili sta pravokotni, ne nasprotni. Uporabi Pitagorov izrek."]]),
          hint: "Pravokotni sili sta kateti pravokotnega trikotnika, rezultanta je hipotenuza (paralelogram sil je pravokotnik).",
          data: { given: [dat("F_1", F1, "N"), dat("F_2", F2, "N"), `${T("kot med silama")} = ${T("pravi kot")}`], find: [eq ? "F_3" : "F_R"] },
          formula: eq ? ["F_R = \\sqrt{F_1^2 + F_2^2}", "F_3 = F_R"] : ["F_R = \\sqrt{F_1^2 + F_2^2}"],
          solution: `$F_R = \\sqrt{F_1^2 + F_2^2} = \\sqrt{${F1}^2 + ${F2}^2}\\ \\mathrm{N} = \\sqrt{${F1 * F1 + F2 * F2}}\\ \\mathrm{N} ${res(R, 0, "N")}$${eq ? `\nZa ravnovesje mora biti tretja sila enako velika kot rezultanta in nasprotno usmerjena: $F_3 ${res(R, 0, "N")}$` : ""}`,
        };
      }
      if (k === 1) {
        const triple = r.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25]]);
        const m = r.pick([5, 10, 20]);
        const [a, b, c] = triple.map((x) => x * m);
        return {
          text: `Na telo delujeta dve pravokotni sili. Rezultanta meri $${qty(c, "N")}$, ena od sil pa $${qty(a, "N")}$. Kolikšna je druga sila?`,
          answer: num(b, "N", null, [[c - a, "Sili sta pravokotni, zato ju ne seštevamo kot števili. Uporabi Pitagorov izrek."], [Math.hypot(a, c), "Rezultanta je hipotenuza; drugo silo dobiš z odštevanjem kvadratov."]]),
          hint: "Pri pravokotnih silah velja $F_R^2 = F_1^2 + F_2^2$. Izrazi $F_2$.",
          data: { given: [dat("F_R", c, "N"), dat("F_1", a, "N"), `${T("kot med silama")} = ${T("pravi kot")}`], find: ["F_2"] },
          formula: ["F_R^2 = F_1^2 + F_2^2", "F_2 = \\sqrt{F_R^2 - F_1^2}"],
          solution: `$F_2 = \\sqrt{F_R^2 - F_1^2} = \\sqrt{${c}^2 - ${a}^2}\\ \\mathrm{N} = \\sqrt{${c * c - a * a}}\\ \\mathrm{N} = ${qty(b, "N")}$`,
        };
      }
      const F1 = r.int(20, 80) * 5;
      const R = r.int(2, F1 / 5 - 2) * 5;
      const F2 = F1 - R;
      return {
        text: `${n1} vleče sani naprej s silo $${qty(F1, "N")}$, ${n2} pa jih zadržuje v nasprotni smeri. Rezultanta je $${qty(R, "N")}$ in kaže naprej. S kolikšno silo zadržuje sani ${n2}? Kolikšno silo bi ${g(n2, "moral", "morala")} uporabiti, da bi bile sile v ravnovesju? Vpiši prvo silo.`,
        answer: num(F2, "N", null, [[F1 + R, "Rezultanta kaže v smeri večje sile, zato je druga sila manjša od prve."], [F1, "Tako velika bi bila sila v ravnovesju. Vprašanje sprašuje po sedanji sili."]]),
        hint: "Pri nasprotnih silah je rezultanta razlika: $F_R = F_1 - F_2$. Izrazi $F_2$.",
        data: { given: [dat("F_1", F1, "N"), dat("F_R", R, "N")], find: ["F_2"] },
        formula: ["F_R = F_1 - F_2", "F_2 = F_1 - F_R"],
        solution: `$F_2 = F_1 - F_R = ${F1}\\ \\mathrm{N} - ${R}\\ \\mathrm{N} = ${qty(F2, "N")}$\nZa ravnovesje bi morala biti $F_2 = F_1 = ${qty(F1, "N")}$.`,
      };
    },
  },
  {
    id: "dod-os-trenje-in-upor",
    topics: ["FIZ-OS-8/trenje-in-upor"],
    gen(level, r) {
      const name = r.pick(NAMES);
      const S = r.pick([
        { what: "lesen zaboj na lesenih tleh", k: 0.4 },
        { what: "jeklene drsalke na ledu", k: 0.02 },
        { what: "gumijast podplat na suhem betonu", k: 0.8 },
        { what: "kartonsko škatlo na linoleju", k: 0.3 },
        { what: "jeklen blok na jekleni plošči", k: 0.15 },
        { what: "sani na snegu", k: 0.05 },
        { what: "gumijasto pnevmatiko na mokrem asfaltu", k: 0.5 },
      ]);
      const kT = tx(S.k);
      const fF = "F_{tr} = k_{tr} \\cdot F_p";
      if (level === 1) {
        if (r.next() < 0.55) {
          const Fp = r.int(4, 60) * 10;
          const F = S.k * Fp;
          return {
            text: `Koeficient trenja za ${S.what} je $${kT}$. Telo pritiska na podlago s silo $${qty(Fp, "N")}$. Kolikšna je sila trenja? Zaokroži na eno decimalko.`,
            answer: num(F, "N", 1, [[Fp / S.k, "Sila trenja je zmnožek koeficienta in sile podlage, ne količnik."], [Fp, "Sila trenja je le del sile, s katero telo pritiska na podlago."]]),
            hint: "Sila trenja je sorazmerna s silo, s katero telo pritiska na podlago.",
            data: { given: [`k_{tr} = ${kT}`, dat("F_p", Fp, "N")], find: ["F_{tr}"] },
            formula: fF,
            solution: `Sila trenja je sorazmerna s silo podlage.\n$F_{tr} = k_{tr} \\cdot F_p = ${kT} \\cdot ${qty(Fp, "N")} ${res(F, 1, "N")}$`,
          };
        }
        const P = r.pick([
          { q: `${name} vleče lesen kvader, ki leži na veliki ploskvi. Nato ga obrne na manjšo ploskev in vleče po isti podlagi. Kaj se zgodi s silo trenja?`, ok: "ostane približno enaka", wrong: [["zmanjša se, ker je stična ploskev manjša", "Sila trenja ni odvisna od velikosti stične ploskve, le od sile podlage in vrste površin."], ["poveča se, ker kvader bolj pritiska na manjšo ploskev", "Celotna sila na podlago (teža) je enaka; pritisk na manjšo ploskev je večji, sila trenja pa ne."], ["izgine", "Trenje ostane, ker se površini še vedno dotikata."]] },
          { q: `${name} na kvader, ki ga vleče po mizi, položi še utež. Kaj se zgodi s silo trenja?`, ok: "poveča se", wrong: [["zmanjša se", "Večja teža pomeni večjo silo na podlago in s tem večje trenje."], ["ostane enaka", "Sila trenja je sorazmerna s silo, s katero telo pritiska na podlago."], ["odvisno je od hitrosti vlečenja", "Pri drsnem trenju hitrost skoraj ne vpliva na silo trenja."]] },
          { q: "S čim najlaže zmanjšamo trenje med deloma stroja?", ok: "z mazanjem z oljem", wrong: [["s hrapavejšo površino", "Hrapavost trenje poveča."], ["z večjo silo med deloma", "Večja sila podlage trenje poveča."], ["z večjo stično ploskvijo", "Velikost ploskve na trenje skoraj ne vpliva."]] },
          { q: "Zakaj pozimi na poledenelo cesto posujemo pesek?", ok: "da povečamo trenje med podplati ali gumami in podlago", wrong: [["da led hitreje stali", "To naredi sol; pesek poveča hrapavost podlage."], ["da zmanjšamo trenje", "Pesek naredi podlago bolj hrapavo in trenje poveča."], ["da zmanjšamo težo avtomobila", "Teža se ne spremeni."]] },
          { q: "Od česa NI odvisna sila drsnega trenja?", ok: "od velikosti stične ploskve", wrong: [["od sile, s katero telo pritiska na podlago", "Večja sila podlage pomeni večje trenje."], ["od vrste in hrapavosti površin", "Prav to opisuje koeficient trenja."], ["od tega, ali sta površini namazani", "Mazivo trenje zelo zmanjša."]] },
        ]);
        return concept(r, {
          ...P,
          hint: "Sila trenja je odvisna od sile, s katero telo pritiska na podlago, in od vrste površin, ne pa od velikosti stične ploskve.",
          given: [T("vlečenje telesa po podlagi")],
          find: [T("vpliv na trenje")],
          formula: fF,
          sol: ["$F_{tr} = k_{tr} \\cdot F_p$: trenje je odvisno od sile podlage $F_p$ in od vrste površin ($k_{tr}$).", `Pravilno: ${P.ok}.`],
        });
      }
      if (level === 2) {
        if (r.next() < 0.6) {
          const m = r.int(2, 80);
          const Fp = m * G;
          const F = S.k * Fp;
          const steady = r.next() < 0.5;
          return {
            text: steady
              ? `${name} enakomerno vleče po vodoravni podlagi telo z maso $${qty(m, "kg")}$ (${S.what}, $k_{tr} = ${kT}$). S kolikšno silo vleče? Uporabi $g = ${G_TEX}\\ \\mathrm{N/kg}$ in zaokroži na eno decimalko.`
              : `Kolikšna je sila trenja, ko po vodoravni podlagi drsi telo z maso $${qty(m, "kg")}$? Gre za ${S.what}, $k_{tr} = ${kT}$. Uporabi $g = ${G_TEX}\\ \\mathrm{N/kg}$ in zaokroži na eno decimalko.`,
            answer: num(F, "N", 1, [[S.k * m, "Sila podlage je teža telesa ($m \\cdot g$), ne masa."], [Fp, "To je sila podlage. Pomnoži jo še s koeficientom trenja."]]),
            hint: steady ? "Pri enakomernem gibanju sta vlečna sila in sila trenja v ravnovesju. Na vodoravni podlagi je sila podlage enaka teži." : "Na vodoravni podlagi je sila, s katero telo pritiska na podlago, enaka teži.",
            data: { given: [dat("m", m, "kg"), `k_{tr} = ${kT}`, dat("g", G_TEX, "N/kg")], find: [steady ? "F" : "F_{tr}"] },
            formula: steady ? ["F_p = m \\cdot g", fF, "F = F_{tr}"] : ["F_p = m \\cdot g", fF],
            solution: `$F_p = m \\cdot g = ${m}\\ \\mathrm{kg} \\cdot ${G_TEX}\\ \\mathrm{N/kg} ${res(Fp, 2, "N")}$\n$F_{tr} = ${kT} \\cdot ${tx(roundHalfUp(Fp, 2))}\\ \\mathrm{N} ${res(F, 1, "N")}$${steady ? "\nPri enakomernem vlečenju je vlečna sila enaka sili trenja." : ""}`,
          };
        }
        const P = r.pick([
          { q: "Zakaj padalec z odprtim padalom pada počasneje kot z zaprtim?", ok: "ker ima odprto padalo veliko čelno ploskev, zato je zračni upor večji", wrong: [["ker se padalcu zmanjša teža", "Teža ostane enaka; spremeni se zračni upor."], ["ker padalo ustvari vzgon kot balon", "Vzgon v zraku je zanemarljiv; padalo deluje z uporom."], ["ker je zrak više gostejši", "Zrak je više redkejši; upor poveča velika ploskev padala."]] },
          { q: "Kako se spremeni zračni upor, ko kolesar pospeši z 10 km/h na 30 km/h?", ok: "močno se poveča", wrong: [["ostane enak", "Zračni upor narašča s hitrostjo."], ["zmanjša se", "Pri večji hitrosti se zrak bolj upira."], ["izgine, ko kolesar vozi enakomerno", "Upor deluje vedno, ko se telo giblje skozi zrak."]] },
          { q: "Zakaj imajo hitri vlaki in dirkalniki aerodinamično obliko?", ok: "da zmanjšajo zračni upor", wrong: [["da povečajo trenje s tirnicami", "Oblika vpliva na upor zraka, ne na trenje s podlago."], ["da so lažji", "Oblika ne spremeni mase vozila."], ["da povečajo zračni upor za lažje zaviranje", "Z obliko želimo upor zmanjšati, da porabijo manj energije."]] },
          { q: "Kolesar se pri spustu skloni k krmilu. Zakaj?", ok: "zmanjša čelno ploskev in s tem zračni upor", wrong: [["poveča trenje med gumami in cesto", "Sklonjena drža vpliva predvsem na zračni upor."], ["poveča svojo težo", "Teža se ne spremeni."], ["zmanjša svojo maso", "Masa se ne spremeni."]] },
          { q: "Od česa je odvisen upor, ki ga voda nudi plavalcu?", ok: "od hitrosti, oblike in velikosti čelne ploskve plavalca", wrong: [["samo od mase plavalca", "Masa ne določa upora; pomembna sta oblika in hitrost."], ["samo od globine bazena", "Globina na upor ne vpliva."], ["od nič, v vodi upora ni", "Voda se gibanju upira še bolj kot zrak."]] },
        ]);
        return concept(r, {
          ...P,
          hint: "Upor sredstva (zrak, voda) narašča s hitrostjo in z velikostjo čelne ploskve, odvisen je tudi od oblike telesa.",
          given: [T("gibanje skozi zrak ali vodo")],
          find: [T("vpliv na upor")],
          sol: ["Upor tekočine ali plina je večji pri večji hitrosti, večji čelni ploskvi in manj aerodinamični obliki.", `Pravilno: ${P.ok}.`],
        });
      }
      const kk = r.int(0, 2);
      if (kk === 0) {
        const m = r.int(2, 40);
        const kTrue = r.pick([0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.6]);
        const F = roundHalfUp(kTrue * m * G, 1);
        const kOut = F / (m * G);
        return {
          text: `${name} z dinamometrom enakomerno vleče po mizi škatlo z maso $${qty(m, "kg")}$. Dinamometer kaže $${qty(tx(F), "N")}$. Kolikšen je koeficient trenja? Uporabi $g = ${G_TEX}\\ \\mathrm{N/kg}$ in zaokroži na dve decimalki.`,
          answer: num(kOut, null, 2, [[F / m, "Deliti moraš s silo podlage (težo), ne z maso."], [(m * G) / F, "Koeficient je sila trenja, deljena s silo podlage, ne obratno."]]),
          hint: "Pri enakomernem vlečenju je sila trenja enaka vlečni sili. Sila podlage je teža škatle.",
          data: { given: [dat("m", m, "kg"), dat("F", tx(F), "N"), dat("g", G_TEX, "N/kg")], find: ["k_{tr}"] },
          formula: ["F_{tr} = F", "F_p = m \\cdot g", "k_{tr} = \\dfrac{F_{tr}}{F_p}"],
          solution: `Enakomerno gibanje: $F_{tr} = F = ${qty(tx(F), "N")}$\n$F_p = m \\cdot g = ${m} \\cdot ${G_TEX}\\ \\mathrm{N} ${res(m * G, 2, "N")}$\n$k_{tr} = \\dfrac{${tx(F)}}{${tx(roundHalfUp(m * G, 2))}} ${res(kOut, 2)}$`,
        };
      }
      if (kk === 1) {
        const m1 = r.int(2, 20);
        const m2 = r.int(1, 15);
        const F = S.k * (m1 + m2) * G;
        return {
          text: `Za ${S.what} je $k_{tr} = ${kT}$. Telo z maso $${qty(m1, "kg")}$ vlečemo enakomerno, nato nanj naložimo še $${qty(m2, "kg")}$ tovora. S kolikšno silo moramo zdaj vleči? Uporabi $g = ${G_TEX}\\ \\mathrm{N/kg}$ in zaokroži na eno decimalko.`,
          answer: num(F, "N", 1, [[S.k * m1 * G, "Upoštevaj tudi maso tovora: na podlago pritiskata telo in tovor."], [S.k * (m1 + m2), "Sila podlage je teža ($m \\cdot g$), ne masa."]]),
          hint: "Tovor poveča silo, s katero telo pritiska na podlago. Najprej izračunaj skupno maso.",
          data: { given: [`k_{tr} = ${kT}`, dat("m_1", m1, "kg"), dat("m_2", m2, "kg"), dat("g", G_TEX, "N/kg")], find: ["F"] },
          formula: ["F_p = (m_1 + m_2) \\cdot g", fF, "F = F_{tr}"],
          solution: `$m = ${m1}\\ \\mathrm{kg} + ${m2}\\ \\mathrm{kg} = ${qty(m1 + m2, "kg")}$\n$F_p = ${m1 + m2} \\cdot ${G_TEX}\\ \\mathrm{N} ${res((m1 + m2) * G, 2, "N")}$\n$F = F_{tr} = ${kT} \\cdot ${tx(roundHalfUp((m1 + m2) * G, 2))}\\ \\mathrm{N} ${res(F, 1, "N")}$`,
        };
      }
      const F = r.int(5, 60) * 10;
      const m = F / (S.k * G);
      return {
        text: `${name} lahko vleče s silo največ $${qty(F, "N")}$. Kolikšno največjo maso lahko enakomerno vleče po vodoravni podlagi? Gre za ${S.what}, $k_{tr} = ${kT}$. Uporabi $g = ${G_TEX}\\ \\mathrm{N/kg}$ in zaokroži na celo število kilogramov.`,
        answer: num(m, "kg", 0, [[F / S.k, "To je največja sila podlage (v N). Deli jo še z $g$, da dobiš maso."], [(F * S.k) / G, "Sila trenja je $k_{tr} \\cdot F_p$, zato $F_p = F / k_{tr}$, ne $F \\cdot k_{tr}$."]]),
        hint: "Pri enakomernem vlečenju je sila trenja enaka vlečni sili. Iz $F_{tr} = k_{tr} \\cdot m \\cdot g$ izrazi maso.",
        data: { given: [dat("F", F, "N"), `k_{tr} = ${kT}`, dat("g", G_TEX, "N/kg")], find: ["m"] },
        formula: ["F = k_{tr} \\cdot m \\cdot g", "m = \\dfrac{F}{k_{tr} \\cdot g}"],
        solution: `$F_p = \\dfrac{F}{k_{tr}} = \\dfrac{${F}\\ \\mathrm{N}}{${kT}} ${res(F / S.k, 1, "N")}$\n$m = \\dfrac{F_p}{g} = \\dfrac{${tx(roundHalfUp(F / S.k, 1))}\\ \\mathrm{N}}{${G_TEX}\\ \\mathrm{N/kg}} ${res(m, 0, "kg")}$`,
      };
    },
  },
  {
    id: "dod-os-vzgon",
    topics: ["FIZ-OS-8/vzgon"],
    gen(level, r) {
      const name = r.pick(NAMES);
      const fV = "F_{vzg} = \\rho_{tek} \\cdot g \\cdot V";
      if (level === 1) {
        if (r.next() < 0.5) {
          const F1 = r.dec(1.5, 12, 1);
          const F2 = roundHalfUp(F1 - r.dec(0.3, F1 * 0.6, 1), 1);
          const Fv = roundHalfUp(F1 - F2, 1);
          const obj = r.pick(["kamen", "kovinsko utež", "ključ", "steklen kozarec, napolnjen s peskom", "kos železa"]);
          return {
            text: `${name} obesi ${obj} na dinamometer. V zraku kaže dinamometer $${qty(tx(F1), "N")}$, ko pa telo potopi v vodo, kaže $${qty(tx(F2), "N")}$. Kolikšna je sila vzgona?`,
            answer: num(Fv, "N", null, [[roundHalfUp(F1 + F2, 1), "Vzgon kaže navzgor in zmanjša, kar kaže dinamometer. Odštej."], [F2, "To je navidezna teža v vodi, ne vzgon."]]),
            hint: "Vzgon kaže navzgor, zato dinamometer v vodi kaže manj. Za koliko manj?",
            data: { given: [dat("F_g", tx(F1), "N"), dat("F'", tx(F2), "N")], find: ["F_{vzg}"] },
            formula: "F_{vzg} = F_g - F'",
            solution: `V vodi dinamometer kaže manj, ker vzgon telo dviguje.\n$F_{vzg} = F_g - F' = ${tx(F1)}\\ \\mathrm{N} - ${tx(F2)}\\ \\mathrm{N} = ${qty(tx(Fv), "N")}$`,
          };
        }
        const B = r.pick([
          ["kocka ledu", 920, "vodo", 1000], ["železen žebelj", 7870, "vodo", 1000], ["kos smrekovega lesa", 450, "vodo", 1000], ["aluminijasta žlička", 2700, "vodo", 1000],
          ["železna kroglica", 7870, "živo srebro", 13600], ["kos voska", 900, "vodo", 1000], ["kos plute", 240, "olje", 920], ["kamen", 2600, "slano morsko vodo", 1030],
          ["svinčena utež", 11300, "živo srebro", 13600], ["jajce", 1030, "slano vodo z gostoto $1030\\ \\mathrm{kg/m^3}$", 1030], ["kos parafina", 900, "alkohol", 790], ["kos jabolka", 850, "vodo", 1000],
        ]);
        const [obj, rt, liq, rl] = B;
        const key = rt < rl ? "plava" : rt > rl ? "potone" : "lebdi";
        const O = { plava: "plava na površini", potone: "potone", lebdi: "lebdi (ostane v tekočini, kjer ga pustimo)" };
        const W = {
          plava: "Telo plava le, če ima manjšo gostoto od tekočine.",
          potone: "Telo potone le, če ima večjo gostoto od tekočine.",
          lebdi: "Telo lebdi le, če ima enako gostoto kot tekočina.",
        };
        const liqTex = liq.includes("$") ? liq : `${liq} ($\\rho = ${rl}\\ \\mathrm{kg/m^3}$)`;
        return concept(r, {
          q: `${obj[0].toUpperCase()}${obj.slice(1)} ima gostoto $${rt}\\ \\mathrm{kg/m^3}$. Kaj se zgodi, ko to telo položimo v ${liqTex}?`,
          ok: O[key],
          wrong: Object.keys(O).filter((x) => x !== key).map((x) => [O[x], W[x] + (x === "potone" && obj.includes("železn") ? " Tudi kovina lahko plava, če je tekočina gostejša." : "")]),
          hint: "Primerjaj gostoto telesa z gostoto tekočine.",
          given: [dat("\\rho_t", rt, "kg/m^3"), dat("\\rho_{tek}", rl, "kg/m^3")],
          find: [T("plava, lebdi ali potone")],
          formula: ["\\rho_t < \\rho_{tek}: \\text{plava}", "\\rho_t = \\rho_{tek}: \\text{lebdi}", "\\rho_t > \\rho_{tek}: \\text{potone}"],
          sol: [`$\\rho_t = ${rt}\\ \\mathrm{kg/m^3}$ ${rt < rl ? "<" : rt > rl ? ">" : "="} $\\rho_{tek} = ${rl}\\ \\mathrm{kg/m^3}$`, `Telo ${O[key]}.`],
        });
      }
      const L = r.pick([["vodo", 1000], ["morsko vodo", 1030], ["olje", 920], ["alkohol", 790]]);
      if (level === 2) {
        if (r.next() < 0.65) {
          const inCm = r.next() < 0.5;
          const V = inCm ? r.int(5, 90) * 10 : r.dec(0.2, 8, 1);
          const Vm = inCm ? V / 1e6 : V / 1000;
          const F = L[1] * G * Vm;
          const obj = r.pick(["kamen", "kovinski valj", "steklena krogla", "kos železa", "plastenka, napolnjena s peskom"]);
          return {
            text: `V ${L[0]} z gostoto $${L[1]}\\ \\mathrm{kg/m^3}$ v celoti potopimo telo s prostornino $${qty(tx(V), inCm ? "cm^3" : "dm^3")}$ (${obj}). Kolikšna je sila vzgona? Uporabi $g = ${G_TEX}\\ \\mathrm{N/kg}$ in zaokroži na dve decimalki.`,
            answer: num(F, "N", 2, [[L[1] * Vm, "To je masa izpodrinjene tekočine. Pomnoži še z $g$."], [L[1] * G * V, "Prostornino najprej pretvori v $\\mathrm{m^3}$."]]),
            hint: `Prostornino pretvori v $\\mathrm{m^3}$ (${inCm ? "$1\\ \\mathrm{cm^3} = 10^{-6}\\ \\mathrm{m^3}$" : "$1\\ \\mathrm{dm^3} = 0{,}001\\ \\mathrm{m^3}$"}). Vzgon je enak teži izpodrinjene tekočine.`,
            data: { given: [dat("V", tx(V), inCm ? "cm^3" : "dm^3"), dat("\\rho_{tek}", L[1], "kg/m^3"), dat("g", G_TEX, "N/kg")], find: ["F_{vzg}"] },
            formula: [fV, inCm ? "1\\ \\mathrm{cm^3} = 10^{-6}\\ \\mathrm{m^3}" : "1\\ \\mathrm{dm^3} = 0{,}001\\ \\mathrm{m^3}"],
            solution: `$V = ${qty(tx(V), inCm ? "cm^3" : "dm^3")} = ${qty(tx(Vm), "m^3")}$\n$F_{vzg} = \\rho_{tek} \\cdot g \\cdot V = ${L[1]} \\cdot ${G_TEX} \\cdot ${tx(Vm)}\\ \\mathrm{N} ${res(F, 2, "N")}$`,
          };
        }
        const m = r.int(2, 90) * 10; // g
        const F = (m / 1000) * G;
        const obj = r.pick(["Igračka ladjica", "Plastična raca", "Kos lesa", "Prazna plastenka z zamaškom", "Žoga za vaterpolo"]);
        return {
          text: `${obj} z maso $${qty(m, "g")}$ plava na vodi. Kolikšna je sila vzgona nanjo? Uporabi $g = ${G_TEX}\\ \\mathrm{N/kg}$ in zaokroži na dve decimalki.`,
          answer: num(F, "N", 2, [[m * G, "Maso pretvori v kilograme."], [m / 1000, "To je masa v kg. Vzgon je sila: pomnoži z $g$."]]),
          hint: "Telo, ki plava, je v ravnovesju: vzgon je enako velik kot teža telesa.",
          data: { given: [dat("m", m, "g"), dat("g", G_TEX, "N/kg")], find: ["F_{vzg}"] },
          formula: ["F_{vzg} = F_g", "F_g = m \\cdot g"],
          solution: `Telo plava, zato sta vzgon in teža v ravnovesju: $F_{vzg} = F_g$.\n$F_{vzg} = m \\cdot g = ${tx(m / 1000)}\\ \\mathrm{kg} \\cdot ${G_TEX}\\ \\mathrm{N/kg} ${res(F, 2, "N")}$`,
        };
      }
      const kk = r.int(0, 2);
      if (kk === 0) {
        const M = r.pick([["aluminij", 2700], ["železo", 7870], ["baker", 8960], ["steklo", 2500], ["granit", 2700], ["svinec", 11300], ["cink", 7140]]);
        const V = r.int(50, 400); // cm³
        const F1 = roundHalfUp((M[1] * G * V) / 1e6, 2);
        const Fv = roundHalfUp((1000 * G * V) / 1e6, 2);
        const F2 = roundHalfUp(F1 - Fv, 2);
        const rho = (1000 * F1) / (F1 - F2);
        return {
          text: `${name} obesi neznano kovino ali kamen na dinamometer. V zraku kaže $${qty(tx(F1), "N")}$, v vodi pa $${qty(tx(F2), "N")}$. Kolikšna je gostota telesa? Gostota vode je $1000\\ \\mathrm{kg/m^3}$. Zaokroži na celo število.`,
          answer: num(rho, "kg/m³", 0, [[(1000 * F1) / F2, "Deliti moraš z vzgonom ($F_g - F'$), ne z navidezno težo v vodi."], [(1000 * F2) / (F1 - F2), "V števcu je teža v zraku, ne v vodi."]], { unitAlternatives: ["kg/m3"] }),
          hint: "Iz razlike odčitkov dobiš vzgon. Iz vzgona izračunaj prostornino telesa, iz teže pa maso.",
          data: { given: [dat("F_g", tx(F1), "N"), dat("F'", tx(F2), "N"), dat("\\rho_v", 1000, "kg/m^3")], find: ["\\rho_t"] },
          formula: ["F_{vzg} = F_g - F'", "V = \\dfrac{F_{vzg}}{\\rho_v \\cdot g}", "\\rho_t = \\dfrac{m}{V} = \\rho_v \\cdot \\dfrac{F_g}{F_{vzg}}"],
          solution: `$F_{vzg} = ${tx(F1)}\\ \\mathrm{N} - ${tx(F2)}\\ \\mathrm{N} = ${qty(tx(roundHalfUp(F1 - F2, 2)), "N")}$\nTelo izpodrine toliko vode, kolikor je samo veliko; razmerje gostot je enako razmerju teže in vzgona.\n$\\rho_t = \\rho_v \\cdot \\dfrac{F_g}{F_{vzg}} = 1000\\ \\mathrm{kg/m^3} \\cdot \\dfrac{${tx(F1)}}{${tx(roundHalfUp(F1 - F2, 2))}} ${res(rho, 0, "kg/m^3")}$ (verjetno ${M[0]})`,
        };
      }
      if (kk === 1) {
        const B = r.pick([["Ledena gora", 917, "morski vodi", 1030], ["Kocka ledu", 920, "vodi", 1000], ["Smrekov hlod", 450, "vodi", 1000], ["Hrastov hlod", 700, "vodi", 1000], ["Kos voska", 900, "vodi", 1000], ["Kos plute", 240, "vodi", 1000], ["Kocka ledu", 920, "olju z gostoto 950 kg/m³", 950]]);
        const [obj, rt, liq, rl] = B;
        const under = (100 * rt) / rl;
        const askAbove = r.next() < 0.5;
        const val = askAbove ? 100 - under : under;
        return {
          text: `${obj} z gostoto $${rt}\\ \\mathrm{kg/m^3}$ plava v ${liq.replace(" z gostoto 950 kg/m³", "")} z gostoto $${rl}\\ \\mathrm{kg/m^3}$. Kolikšen del prostornine je ${askAbove ? "nad gladino" : "pod gladino"}? Odgovor zapiši v odstotkih in zaokroži na eno decimalko.`,
          answer: num(val, "%", 1, [[askAbove ? under : 100 - under, askAbove ? "To je del pod gladino. Vprašanje sprašuje po delu nad gladino." : "To je del nad gladino."], [(100 * rl) / rt, "Razmerje gostot si obrnil: delež pod gladino je $\\rho_t / \\rho_{tek}$."]]),
          hint: "Pri plavanju je vzgon enak teži: $\\rho_{tek} \\cdot g \\cdot V_{pod} = \\rho_t \\cdot g \\cdot V$. Iz tega dobiš delež prostornine pod gladino.",
          data: { given: [dat("\\rho_t", rt, "kg/m^3"), dat("\\rho_{tek}", rl, "kg/m^3")], find: [askAbove ? "\\dfrac{V_{nad}}{V}" : "\\dfrac{V_{pod}}{V}"] },
          formula: ["\\rho_{tek} \\cdot g \\cdot V_{pod} = \\rho_t \\cdot g \\cdot V", "\\dfrac{V_{pod}}{V} = \\dfrac{\\rho_t}{\\rho_{tek}}"],
          solution: `$\\dfrac{V_{pod}}{V} = \\dfrac{${rt}}{${rl}} \\cdot 100\\ \\% ${res(under, 1, "\\%")}$${askAbove ? `\n$\\dfrac{V_{nad}}{V} = 100\\ \\% - ${tx(roundHalfUp(under, 1))}\\ \\% ${res(100 - under, 1, "\\%")}$` : ""}`,
        };
      }
      const V = r.dec(0.2, 1.5, 2);
      const rw = r.pick([450, 500, 600, 700]);
      const load = (1000 - rw) * V;
      return {
        text: `Splav iz lesa z gostoto $${rw}\\ \\mathrm{kg/m^3}$ ima prostornino $${qty(tx(V), "m^3")}$. Največ kolikšen tovor lahko naložimo nanj, da se splav še ne potopi pod gladino vode? Gostota vode je $1000\\ \\mathrm{kg/m^3}$. Zaokroži na celo število kilogramov.`,
        answer: num(load, "kg", 0, [[1000 * V, "Tako maso vode izpodrine potopljen splav; odštej še maso samega splava."], [rw * V, "To je masa splava."]]),
        hint: "Ko je splav ravno ves pod gladino, je vzgon enak teži vode s prostornino splava. Ta vzgon mora nositi splav in tovor.",
        data: { given: [dat("\\rho_l", rw, "kg/m^3"), dat("V", tx(V), "m^3"), dat("\\rho_v", 1000, "kg/m^3")], find: ["m_{tovor}"] },
        formula: ["m_v = \\rho_v \\cdot V", "m_s = \\rho_l \\cdot V", "m_{tovor} = m_v - m_s"],
        solution: `Masa izpodrinjene vode: $m_v = 1000 \\cdot ${tx(V)}\\ \\mathrm{kg} = ${qty(tx(1000 * V), "kg")}$\nMasa splava: $m_s = ${rw} \\cdot ${tx(V)}\\ \\mathrm{kg} ${res(rw * V, 1, "kg")}$\n$m_{tovor} = ${tx(roundHalfUp(1000 * V, 1))} - ${tx(roundHalfUp(rw * V, 1))} ${res(load, 0, "kg")}$`,
      };
    },
  },
  // ---------------------------------------------------------------- FIZIKA 9
  {
    id: "dod-os-temperatura",
    topics: ["FIZ-OS-9/temperatura-in-notranja-energija"],
    gen(level, r) {
      const name = r.pick(NAMES);
      const fK = "T = t + 273";
      if (level === 1) {
        if (r.next() < 0.6) {
          const toK = r.next() < 0.5;
          if (toK) {
            const [what, t] = r.pick([["Telesna temperatura zdravega človeka", 37], ["Voda pri normalnem tlaku vre pri", 100], ["Tekoči dušik vre pri", -196], ["Temperatura v zamrzovalniku je", -18], ["Sobna temperatura je", r.int(18, 25)], ["Najnižja izmerjena temperatura na Zemlji je", -89], ["Temperatura v hladilniku je", r.int(3, 7)], ["Temperatura površja Venere je", 465], [`${name} je izmeril${g(name, "", "a")} temperaturo zraka`, r.int(-15, 38)]]);
            return {
              text: `${what} $${qty(t, "°C")}$. Koliko je to v kelvinih?`,
              answer: num(t + 273, "K", null, [[t - 273, "Pri pretvorbi iz °C v K prištejemo 273."], [t, "Temperatura v K in v °C ni enaka; lestvici imata različno ničlo."]]),
              hint: "Kelvinova lestvica se začne pri absolutni ničli, $-273\\ ^\\circ\\mathrm{C}$. Kelvinov je za 273 več kot stopinj Celzija.",
              data: { given: [dat("t", t, "°C")], find: ["T"] },
              formula: fK,
              solution: `Temperaturi v °C prištejemo 273.\n$T = ${t} + 273 = ${qty(t + 273, "K")}$`,
            };
          }
          const [what, Tk] = r.pick([["Tekoči helij vre pri", 4], ["Voda zmrzne pri", 273], ["Površje Sonca ima približno", 5800], ["Tekoči dušik vre pri", 77], ["V laboratoriju je izmerjena temperatura", r.int(280, 310)], ["Temperatura v vesolju daleč od zvezd je približno", 3], ["Volfram se tali pri", 3695]]);
          return {
            text: `${what} $${qty(Tk, "K")}$. Koliko je to v stopinjah Celzija?`,
            answer: num(Tk - 273, "°C", null, [[Tk + 273, "Pri pretvorbi iz K v °C odštejemo 273."], [Tk, "Temperatura v K in v °C ni enaka."]]),
            hint: "Iz $T = t + 273$ izrazi $t$.",
            data: { given: [dat("T", Tk, "K")], find: ["t"] },
            formula: [fK, "t = T - 273"],
            solution: `Od temperature v K odštejemo 273.\n$t = ${Tk} - 273 = ${qty(Tk - 273, "°C")}$`,
          };
        }
        const P = r.pick([
          { q: "Kaj se zgodi z gibanjem delcev v snovi, ko jo segrejemo?", ok: "delci se gibljejo hitreje", wrong: [["delci se povečajo", "Delci ostanejo enako veliki; spremeni se njihovo gibanje."], ["delci se ustavijo", "Delci se ustavijo le pri absolutni ničli."], ["delcev je več", "Število delcev se pri segrevanju ne spremeni."]] },
          { q: "Ali ima kocka ledu pri $-10\\ ^\\circ\\mathrm{C}$ notranjo energijo?", ok: "da, ker se njeni delci še vedno gibljejo (nihajo)", wrong: [["ne, ker je hladna", "Notranjo energijo ima vsako telo nad absolutno ničlo."], ["ne, ker je trdna", "Tudi delci trdnine nihajo in imajo energijo."], ["samo, če se tali", "Notranjo energijo ima tudi led, ki se ne tali."]] },
          { q: "Kaj je absolutna ničla?", ok: "najnižja možna temperatura, 0 K oziroma $-273\\ ^\\circ\\mathrm{C}$", wrong: [["temperatura, pri kateri zmrzne voda", "Voda zmrzne pri $0\\ ^\\circ\\mathrm{C}$ = 273 K."], ["$0\\ ^\\circ\\mathrm{C}$", "$0\\ ^\\circ\\mathrm{C}$ je 273 K, kar je precej nad absolutno ničlo."], ["najnižja temperatura na Antarktiki", "Na Antarktiki je okoli $-90\\ ^\\circ\\mathrm{C}$, daleč nad absolutno ničlo."]] },
          { q: "Zakaj je v termometru tanka cevka (kapilara)?", ok: "da se že pri majhni spremembi prostornine tekočine stolpec opazno premakne", wrong: [["da tekočina ne izhlapi", "Za to je cevka zaprta; tankost je zaradi občutljivosti."], ["da je termometer lažji", "Tankost cevke ni zaradi mase."], ["da tekočina hitreje zavre", "Tekočina v termometru ne sme vreti."]] },
          { q: "Kaj se zgodi z notranjo energijo vode, ko jo grejemo na štedilniku?", ok: "poveča se", wrong: [["zmanjša se", "Toplota prehaja v vodo, zato se notranja energija poveča."], ["ostane enaka", "Dovedena toplota poveča notranjo energijo."], ["spremeni se le, ko voda zavre", "Notranja energija se veča ves čas segrevanja."]] },
        ]);
        return concept(r, {
          ...P,
          hint: "Temperatura je povezana s hitrostjo gibanja delcev. Notranja energija je energija gibanja in lege vseh delcev.",
          given: [T("delčna zgradba snovi")],
          find: [T("pravilna trditev")],
          sol: ["Višja temperatura pomeni hitrejše gibanje delcev in večjo notranjo energijo; delci mirujejo le pri absolutni ničli (0 K).", `Pravilno: ${P.ok}.`],
        });
      }
      if (level === 2) {
        if (r.next() < 0.6) {
          const mixed = r.next() < 0.5;
          const t1 = r.int(-20, 40);
          const t2 = t1 + r.nonZero(-50, 70);
          const ctx = r.pick(["Voda v loncu", "Zrak v sobi", "Čaj v skodelici", "Kovinska palica", "Pesek na plaži"]);
          if (mixed) {
            const T1 = t1 + 273;
            return {
              text: `${ctx} ima na začetku temperaturo $${qty(T1, "K")}$, čez nekaj časa pa $${qty(t2, "°C")}$. Za koliko kelvinov se je temperatura spremenila? Zapiši pozitivno, če se je zvišala, in negativno, če se je znižala.`,
              answer: num(t2 - t1, "K", null, [[t2 - T1, "Obe temperaturi najprej zapiši v isti enoti."], [t2 + 273 - T1 + 273, "Razliko računaj iz temperatur v isti enoti."]]),
              hint: "Obe temperaturi zapiši v kelvinih (ali obe v °C). Razlika v K je enaka razliki v °C.",
              data: { given: [dat("T_1", T1, "K"), dat("t_2", t2, "°C")], find: ["\\Delta T"] },
              formula: [fK, "\\Delta T = T_2 - T_1"],
              solution: `$T_2 = ${t2} + 273 = ${qty(t2 + 273, "K")}$\n$\\Delta T = ${t2 + 273}\\ \\mathrm{K} - ${T1}\\ \\mathrm{K} = ${qty(t2 - t1, "K")}$`,
            };
          }
          return {
            text: `${ctx} se ${t2 > t1 ? "segreje" : "ohladi"} s $${qty(t1, "°C")}$ na $${qty(t2, "°C")}$. Za koliko kelvinov se je spremenila temperatura? Zapiši pozitivno, če se je zvišala, in negativno, če se je znižala.`,
            answer: num(t2 - t1, "K", null, [[t2 - t1 + 273, "Razlika temperatur je v K in °C enaka; 273 se pri odštevanju izniči."], [t2 + 273, "To je končna temperatura v K, ne sprememba."]]),
            hint: "Stopinja Celzija in kelvin sta enako velika, zato je sprememba temperature v obeh enotah enaka.",
            data: { given: [dat("t_1", t1, "°C"), dat("t_2", t2, "°C")], find: ["\\Delta T"] },
            formula: ["\\Delta T = \\Delta t = t_2 - t_1"],
            solution: `$\\Delta t = ${qty(t2, "°C")} - ${t1 < 0 ? `(${qty(t1, "°C")})` : qty(t1, "°C")} = ${qty(t2 - t1, "°C")}$\nKelvin in stopinja Celzija sta enako velika: $\\Delta T = ${qty(t2 - t1, "K")}$`,
          };
        }
        const [task, ok, W] = r.pick([
          [`S katerim termometrom lahko izmeriš temperaturo olja v ponvi, okoli $180\\ ^\\circ\\mathrm{C}$?`, "z živosrebrnim (od $-39$ do $357\\ ^\\circ\\mathrm{C}$)", { alc: "Alkohol vre že pri $78\\ ^\\circ\\mathrm{C}$.", med: "Zdravniški termometer meri le od $35$ do $42\\ ^\\circ\\mathrm{C}$." }],
          [`S katerim termometrom lahko izmeriš temperaturo zraka na Antarktiki, okoli $-60\\ ^\\circ\\mathrm{C}$?`, "z alkoholnim (od $-115$ do $78\\ ^\\circ\\mathrm{C}$)", { hg: "Živo srebro zmrzne pri $-39\\ ^\\circ\\mathrm{C}$.", med: "Zdravniški termometer meri le od $35$ do $42\\ ^\\circ\\mathrm{C}$." }],
          [`${name} ima vročino. S katerim termometrom najnatančneje izmeri telesno temperaturo?`, "z zdravniškim (od $35$ do $42\\ ^\\circ\\mathrm{C}$, na $0{,}1\\ ^\\circ\\mathrm{C}$ natančno)", { hg: "Laboratorijski živosrebrni termometer z velikim območjem je manj natančen in ne obdrži izmerjene vrednosti.", alc: "Sobni alkoholni termometer je za merjenje vročine premalo natančen." }],
        ]);
        const all = {
          hg: "z živosrebrnim (od $-39$ do $357\\ ^\\circ\\mathrm{C}$)",
          alc: "z alkoholnim (od $-115$ do $78\\ ^\\circ\\mathrm{C}$)",
          med: "z zdravniškim (od $35$ do $42\\ ^\\circ\\mathrm{C}$, na $0{,}1\\ ^\\circ\\mathrm{C}$ natančno)",
        };
        return concept(r, {
          q: task,
          ok,
          wrong: Object.entries(W).map(([k2, why]) => [all[k2], why]),
          hint: "Termometer lahko uporabimo le v območju, kjer je tekočina v njem tekoča in ki ga ima skala.",
          given: [T("merilna območja termometrov")],
          find: [T("primeren termometer")],
          sol: ["Tekočina v termometru ne sme zmrzniti ne zavreti, merjena temperatura pa mora biti na skali.", `Pravilno: ${ok}.`],
        });
      }
      if (r.next() < 0.55) {
        const l0 = r.dec(1.5, 4, 1);
        const l100 = roundHalfUp(l0 + r.dec(10, 20, 1), 1);
        const tTrue = r.int(5, 90);
        const l = roundHalfUp(l0 + ((l100 - l0) * tTrue) / 100, 1);
        const t = (100 * (l - l0)) / (l100 - l0);
        return {
          text: `${name} izdela termometer brez skale. V ledeni vodi ($0\\ ^\\circ\\mathrm{C}$) je stolpec tekočine dolg $${qty(tx(l0), "cm")}$, v vreli vodi ($100\\ ^\\circ\\mathrm{C}$) pa $${qty(tx(l100), "cm")}$. V toplem čaju je stolpec dolg $${qty(tx(l), "cm")}$. Kolikšna je temperatura čaja? Zaokroži na eno decimalko.`,
          answer: num(t, "°C", 1, [[(100 * l) / l100, "Stolpec pri $0\\ ^\\circ\\mathrm{C}$ ni dolg 0 cm: od vseh dolžin najprej odštej dolžino pri $0\\ ^\\circ\\mathrm{C}$."], [l - l0, "To je podaljšek stolpca v cm. Pretvori ga v stopinje."]]),
          hint: "Razdalja med oznakama 0 in 100 °C ustreza 100 stopinjam. Koliko cm pomeni 1 °C?",
          data: { given: [dat("l_0", tx(l0), "cm"), dat("l_{100}", tx(l100), "cm"), dat("l", tx(l), "cm")], find: ["t"] },
          formula: ["t = \\dfrac{l - l_0}{l_{100} - l_0} \\cdot 100\\ ^\\circ\\mathrm{C}"],
          solution: `Razdalja med 0 in 100 °C: $${tx(l100)} - ${tx(l0)} = ${qty(tx(roundHalfUp(l100 - l0, 1)), "cm")}$\nPodaljšek v čaju: $${tx(l)} - ${tx(l0)} = ${qty(tx(roundHalfUp(l - l0, 1)), "cm")}$\n$t = \\dfrac{${tx(roundHalfUp(l - l0, 1))}}{${tx(roundHalfUp(l100 - l0, 1))}} \\cdot 100\\ ^\\circ\\mathrm{C} ${res(t, 1, "°C")}$`,
        };
      }
      const fromF = r.next() < 0.5;
      if (fromF) {
        const [what, F] = r.pick([["Telesna temperatura po ameriškem termometru je", 98.6], ["V vremenski napovedi za New York piše", r.int(20, 100)], ["Pečico v ameriškem receptu nastavimo na", r.pick([350, 375, 400, 425])], ["Voda v bazenu v Teksasu ima", r.int(70, 90)]]);
        const t = (F - 32) / 1.8;
        return {
          text: `V ZDA uporabljajo Fahrenheitovo lestvico: $t_F = 1{,}8 \\cdot t + 32$, kjer je $t$ v °C. ${what} $${tx(F)}\\ ^\\circ\\mathrm{F}$. Koliko je to v °C? Zaokroži na eno decimalko.`,
          answer: num(t, "°C", 1, [[F / 1.8 - 32, "Najprej odštej 32, šele nato deli z 1,8."], [(F - 32) * 1.8, "Iz $t_F = 1{,}8\\,t + 32$ moraš z 1,8 deliti, ne množiti."]]),
          hint: "Iz enačbe $t_F = 1{,}8 \\cdot t + 32$ izrazi $t$: najprej odštej 32, nato deli z 1,8.",
          data: { given: [`t_F = ${tx(F)}\\ ^\\circ\\mathrm{F}`], find: ["t"] },
          formula: ["t_F = 1{,}8 \\cdot t + 32", "t = \\dfrac{t_F - 32}{1{,}8}"],
          solution: `$t_F - 32 = ${tx(F)} - 32 = ${tx(roundHalfUp(F - 32, 1))}$\n$t = \\dfrac{${tx(roundHalfUp(F - 32, 1))}}{1{,}8} ${res(t, 1, "°C")}$`,
        };
      }
      const Tk = r.int(250, 330);
      const t = Tk - 273;
      const F = 1.8 * t + 32;
      return {
        text: `V ZDA uporabljajo Fahrenheitovo lestvico: $t_F = 1{,}8 \\cdot t + 32$, kjer je $t$ v °C. Senzor izmeri $${qty(Tk, "K")}$. Koliko je to v °F? Zaokroži na eno decimalko.`,
        answer: num(F, "°F", 1, [[1.8 * Tk + 32, "Kelvine najprej pretvori v stopinje Celzija."], [1.8 * (Tk + 273) + 32, "Iz K v °C 273 odštejemo, ne prištejemo."]], { unitAlternatives: ["f", "°f"] }),
        hint: "Najprej pretvori kelvine v stopinje Celzija, nato uporabi enačbo za Fahrenheitovo lestvico.",
        data: { given: [dat("T", Tk, "K")], find: ["t_F"] },
        formula: ["t = T - 273", "t_F = 1{,}8 \\cdot t + 32"],
        solution: `$t = ${Tk} - 273 = ${qty(t, "°C")}$\n$t_F = 1{,}8 \\cdot ${t < 0 ? `(${t})` : t} + 32 ${res(F, 1, "°F")}$`,
      };
    },
  },
  {
    id: "dod-os-prenos-toplote",
    topics: ["FIZ-OS-9/prenos-toplote"],
    gen(level, r) {
      const name = r.pick(NAMES);
      const fP = "P = \\dfrac{Q}{t}";
      if (level === 1) {
        if (r.next() < 0.6) {
          const S = r.pick([
            [`kovinska žlica v vročem čaju se segreje po vsem ročaju`, "p"],
            [`topel zrak nad radiatorjem se dviga in kroži po sobi`, "k"],
            [`Sonce ogreva Zemljo skozi prazen vesoljski prostor`, "s"],
            [`ob tabornem ognju te greje v obraz, čeprav je zrak okoli hladen`, "s"],
            [`voda v loncu na štedilniku se med segrevanjem meša, topla se dviga`, "k"],
            [`${name} se ogreje roke ob skodelici vročega kakava, ki jo drži`, "p"],
            [`dno ponve se segreje od vroče plošče štedilnika`, "p"],
            [`podnevi piha vetrič z morja na kopno, ker se kopno bolj segreje`, "k"],
            [`infrardeča kamera v temi zazna toplo telo`, "s"],
            [`v hladilniku hladen zrak pada od zamrzovalnika navzdol`, "k"],
            [`grelna lučka nad kletko ogreva piščance`, "s"],
            [`ročaj kovinske ponve se segreje, čeprav ni na plošči`, "p"],
          ]);
          const O = { p: "prevajanje", k: "konvekcija (prenos s tokom snovi)", s: "sevanje" };
          const W = {
            p: "Pri prevajanju se toplota prenaša skozi snov od delca do delca, brez toka snovi.",
            k: "Pri konvekciji se premika topla tekočina ali plin.",
            s: "Sevanje ne potrebuje snovi, toplota se prenaša z elektromagnetnim valovanjem (npr. infrardečim).",
          };
          return concept(r, {
            q: `Na kakšen način se prenaša toplota: ${S[0]}?`,
            ok: O[S[1]],
            wrong: Object.keys(O).filter((x) => x !== S[1]).map((x) => [O[x], W[x]]),
            hint: "Prevajanje: skozi snov, ki se ne premika. Konvekcija: topla tekočina ali plin se pretaka. Sevanje: brez snovi, tudi skozi vakuum.",
            given: [`${T("tema")} = ${T("prevajanje, konvekcija in sevanje")}`],
            find: [T("način prenosa toplote")],
            sol: [W[S[1]], `Pravilno: ${O[S[1]]}.`],
          });
        }
        const P = r.int(2, 30) * 10;
        const t = r.int(5, 60);
        const Q = P * t;
        const ctx = r.pick([`Skozi okno vsako sekundo uide $${P}\\ \\mathrm{J}$ toplote`, `Grelna plošča odda vsako sekundo $${P}\\ \\mathrm{J}$ toplote`, `Skozi steno hladilnika vsako sekundo pride $${P}\\ \\mathrm{J}$ toplote`]);
        return {
          text: `${ctx} (toplotni tok je $P = ${qty(P, "W")}$). Koliko toplote se prenese v $${qty(t, "s")}$?`,
          answer: num(Q, "J", null, [[P / t, "Toplotni tok pomeni toploto v eni sekundi, zato ga s časom pomnožiš."]]),
          hint: "Toplotni tok pove, koliko toplote se prenese v eni sekundi.",
          data: { given: [dat("P", P, "W"), dat("t", t, "s")], find: ["Q"] },
          formula: [fP, "Q = P \\cdot t"],
          solution: `$1\\ \\mathrm{W} = 1\\ \\mathrm{J/s}$, zato v $${t}$ sekundah:\n$Q = P \\cdot t = ${P}\\ \\mathrm{W} \\cdot ${t}\\ \\mathrm{s} = ${qty(Q, "J")}$`,
        };
      }
      if (level === 2) {
        if (r.next() < 0.55) {
          const P = r.int(4, 80) * 5;
          const tMin = r.int(5, 90);
          const Q = (P * tMin * 60) / 1000;
          const ctx = r.pick(["skozi okno spalnice uhaja toplota s tokom", "radiator oddaja toploto s tokom", "skozi vrata kleti uhaja toplota s tokom", "skozi stene šotora uhaja toplota s tokom"]);
          return {
            text: `Ponoči ${ctx} $${qty(P, "W")}$. Koliko kilojoulov toplote se prenese v $${qty(tMin, "min")}$? Zaokroži na eno decimalko.`,
            answer: num(Q, "kJ", 1, [[(P * tMin) / 1000, "Čas najprej pretvori v sekunde (1 min = 60 s)."], [P * tMin * 60, "To je toplota v J. Pretvori v kJ."]]),
            hint: "Toplotni tok je toplota v eni sekundi. Minute pretvori v sekunde, rezultat v J pa nato v kJ.",
            data: { given: [dat("P", P, "W"), dat("t", tMin, "min")], find: ["Q"] },
            formula: ["Q = P \\cdot t", "1\\ \\mathrm{kJ} = 1000\\ \\mathrm{J}"],
            solution: `$t = ${tMin}\\ \\mathrm{min} = ${qty(tMin * 60, "s")}$\n$Q = P \\cdot t = ${P}\\ \\mathrm{W} \\cdot ${tMin * 60}\\ \\mathrm{s} = ${qty(P * tMin * 60, "J")}$\n$Q ${res(Q, 1, "kJ")}$`,
          };
        }
        const P = r.pick([
          { q: "Zakaj se kovinska ograja na mrazu zdi hladnejša od lesene, čeprav imata enako temperaturo?", ok: "ker kovina hitreje odvaja toploto iz roke (bolje prevaja)", wrong: [["ker je kovina res hladnejša", "Obe imata temperaturo okolice; razlika je v prevajanju."], ["ker les oddaja svojo toploto", "Les ni topel; je slab prevodnik, zato roka izgublja malo toplote."], ["ker kovina seva mraz", "Mraz se ne seva; toplota teče iz tople roke v kovino."]] },
          { q: "Zakaj okna z dvema steklenima ploščama dobro izolirajo?", ok: "ker zrak med ploščama slabo prevaja toploto", wrong: [["ker dve stekli odbijeta ves mraz", "Mraz ni snov, ki bi se odbijala; zrak med stekli zmanjša prevajanje."], ["ker je steklo dober prevodnik", "Dober prevodnik bi toploto hitro prepuščal."], ["ker zrak med ploščama kroži in nosi toploto ven", "Ozka plast zraka ne more dobro krožiti, zato je konvekcija majhna."]] },
          { q: "Zakaj ima termovka med stenama vakuum?", ok: "ker v vakuumu ni prevajanja in konvekcije", wrong: [["ker vakuum zmanjša sevanje", "Sevanje gre tudi skozi vakuum; zato so stene posrebrene."], ["ker vakuum poveča tlak", "V vakuumu skoraj ni tlaka."], ["da je termovka lažja", "Vakuum je namenjen izolaciji."]] },
          { q: "Zakaj so stene termovke posrebrene?", ok: "da odbijajo toplotno sevanje", wrong: [["da prevajajo toploto", "Srebrna plast je tanka; njen namen je odboj sevanja."], ["da preprečijo konvekcijo", "Konvekcijo prepreči vakuum."], ["samo zaradi lepšega videza", "Svetla gladka površina odbija sevanje in zmanjša izgube."]] },
          { q: "Zakaj radiator navadno namestimo pod okno?", ok: "ker se topel zrak dviga ob hladnem oknu in tako kroži po vsej sobi", wrong: [["ker toplota seva samo navzgor", "Sevanje gre na vse strani; pomembna je konvekcija."], ["ker steklo dobro prevaja toploto", "Steklo je slab prevodnik; radiator ogreje zrak, ki se dviga."], ["ker je tam največ prostora", "Lega izkorišča kroženje zraka (konvekcijo)."]] },
          { q: "Zakaj poleti raje nosimo svetla oblačila?", ok: "ker svetle površine manj vpijajo Sončevo sevanje", wrong: [["ker svetla oblačila bolje prevajajo toploto", "Barva ne vpliva na prevajanje, vpliva na vpijanje sevanja."], ["ker so svetle barve lažje", "Barva ne spremeni mase blaga."], ["ker temna oblačila oddajajo mraz", "Temna oblačila več sevanja vpijejo, zato se bolj segrejejo."]] },
        ]);
        return concept(r, {
          ...P,
          hint: "Pomisli, kateri od treh načinov (prevajanje, konvekcija, sevanje) je tu pomemben in kako ga zmanjšamo ali povečamo.",
          given: [T("izolacija in prenos toplote")],
          find: [T("razlaga")],
          sol: ["Toploto prenašajo prevajanje (skozi snov), konvekcija (s tokom tekočine ali plina) in sevanje (tudi skozi vakuum).", `Pravilno: ${P.ok}.`],
        });
      }
      const k = r.int(0, 2);
      if (k === 0) {
        const P = r.int(8, 60) * 10;
        const h = r.int(6, 24);
        const price = r.pick([0.12, 0.15, 0.18, 0.2, 0.22]);
        const E = (P * h) / 1000;
        const cost = E * price;
        return {
          text: `Skozi okna stanovanja uhaja toplota s tokom $${qty(P, "W")}$. Koliko evrov stane ogrevanje, ki nadomesti to izgubo v $${h}$ urah, če $1\\ \\mathrm{kWh}$ energije stane $${tx(price)}$ €? Zaokroži na dve decimalki.`,
          answer: num(cost, "€", 2, [[P * h * price, "Moč najprej pretvori v kW (ali energijo v kWh)."], [E, "To je energija v kWh. Pomnoži še s ceno."]], { unitAlternatives: ["eur", "evrov", "evra", "evre"] }),
          hint: "Energija v kWh je moč v kW krat čas v urah. Nato pomnoži s ceno za 1 kWh.",
          data: { given: [dat("P", P, "W"), dat("t", h, "h"), `c = ${tx(price)}\\ \\text{€/kWh}`], find: ["\\text{cena}"] },
          formula: ["Q = P \\cdot t", "\\text{cena} = Q \\cdot c"],
          solution: `$P = ${P}\\ \\mathrm{W} = ${qty(tx(P / 1000), "kW")}$\n$Q = P \\cdot t = ${tx(P / 1000)}\\ \\mathrm{kW} \\cdot ${h}\\ \\mathrm{h} = ${qty(tx(E), "kWh")}$\n$\\text{cena} = ${tx(E)} \\cdot ${tx(price)}\\ \\text{€} ${res(cost, 2, "\\text{€}")}$`,
        };
      }
      if (k === 1) {
        const P1 = r.int(10, 40) * 10;
        const P2 = r.int(2, Math.floor(P1 / 20)) * 10;
        const days = r.pick([7, 30, 90, 120]);
        const E = ((P1 - P2) * 24 * days) / 1000;
        return {
          text: `Skozi neizolirano steno uhaja toplota s tokom $${qty(P1, "W")}$, po namestitvi toplotne izolacije pa s tokom $${qty(P2, "W")}$. Koliko kWh energije prihranimo v $${days}$ dneh neprekinjenega ogrevanja? Zaokroži na eno decimalko.`,
          answer: num(E, "kWh", 1, [[(P1 * 24 * days) / 1000, "Prihranek je razlika med izgubami pred izolacijo in po njej."], [((P1 - P2) * days) / 1000, "En dan ima 24 ur; čas zapiši v urah."]]),
          hint: "Prihranek toplotnega toka je razlika obeh tokov. Čas zapiši v urah, moč v kW.",
          data: { given: [dat("P_1", P1, "W"), dat("P_2", P2, "W"), dat("t", days, "dni")], find: ["\\Delta Q"] },
          formula: ["\\Delta P = P_1 - P_2", "\\Delta Q = \\Delta P \\cdot t"],
          solution: `$\\Delta P = ${P1} - ${P2} = ${qty(P1 - P2, "W")} = ${qty(tx((P1 - P2) / 1000), "kW")}$\n$t = ${days} \\cdot 24\\ \\mathrm{h} = ${qty(days * 24, "h")}$\n$\\Delta Q = ${tx((P1 - P2) / 1000)}\\ \\mathrm{kW} \\cdot ${days * 24}\\ \\mathrm{h} ${res(E, 1, "kWh")}$`,
        };
      }
      const P = r.int(5, 40) * 10;
      const Qk = r.int(20, 400) * 10;
      const tMin = (Qk * 1000) / P / 60;
      return {
        text: `Skozi steno hladilne torbe pride toplota s tokom $${qty(P, "W")}$. Led v torbi se popolnoma stali, ko sprejme $${qty(Qk, "kJ")}$ toplote. Po koliko minutah se led stali? Zaokroži na eno decimalko.`,
        answer: num(tMin, "min", 1, [[(Qk * 1000) / P, "To je čas v sekundah. Pretvori v minute."], [Qk / P / 60, "Toploto najprej pretvori v J (1 kJ = 1000 J)."]]),
        hint: "Iz $Q = P \\cdot t$ izrazi čas. Pazi na enote: kJ v J, sekunde v minute.",
        data: { given: [dat("P", P, "W"), dat("Q", Qk, "kJ")], find: ["t"] },
        formula: [fP, "t = \\dfrac{Q}{P}"],
        solution: `$Q = ${Qk}\\ \\mathrm{kJ} = ${qty(grp(Qk * 1000), "J")}$\n$t = \\dfrac{Q}{P} = \\dfrac{${grp(Qk * 1000)}\\ \\mathrm{J}}{${P}\\ \\mathrm{W}} ${res((Qk * 1000) / P, 1, "s")}$\n$t ${res(tMin, 1, "min")}$`,
      };
    },
  },
  {
    id: "dod-os-elektricni-naboj",
    topics: ["FIZ-OS-9/elektricni-naboj"],
    gen(level, r) {
      const name = r.pick(NAMES);
      if (level === 1) {
        if (r.next() < 0.45) {
          const p = r.int(10, 200);
          const n = p + r.nonZero(-12, 12);
          const q = p - n;
          const obj = r.pick(["Prašni delec", "Kapljica olja", "Majhen košček papirja", "Kroglica iz stiropora", "Las"]);
          return {
            text: `${obj} ima ${p} protonov in ${n} elektronov. Kolikšen je njegov naboj, izražen v osnovnih nabojih $e_0$? Zapiši pozitivno ali negativno število.`,
            answer: num(q, null, null, [[p + n, "Protoni in elektroni imajo nasprotna naboja, zato se njuna naboja odštevata."], [-q, "Preveri predznak: več elektronov pomeni negativen naboj."]]),
            hint: "Vsak proton prispeva $+e_0$, vsak elektron $-e_0$. Preštej, katerih je več.",
            data: { given: [`N_p = ${p}`, `N_e = ${n}`], find: ["e"] },
            formula: "e = (N_p - N_e) \\cdot e_0",
            solution: `$e = (${p} - ${n}) \\cdot e_0 = ${q > 0 ? "+" : ""}${q}\\, e_0$\nTelo ima ${q > 0 ? "več protonov, zato je nabito pozitivno" : "več elektronov, zato je nabito negativno"}.`,
          };
        }
        const P = r.pick([
          { q: "Pozitivno nabit balon približamo negativno nabiti palici. Kaj se zgodi?", ok: "balon in palica se privlačita", wrong: [["balon in palica se odbijata", "Odbijata se telesi z istovrstnima nabojema."], ["nič, sila med njima ne deluje", "Med nabitima telesoma vedno deluje električna sila."], ["balon izgubi ves naboj, ne da bi se dotaknila", "Brez dotika naboj ne preide."]] },
          { q: "Dva enako nabita (negativna) balona obesimo drug ob drugem. Kaj se zgodi?", ok: "odmakneta se drug od drugega", wrong: [["privlačita se", "Istovrstna naboja se odbijata."], ["ostaneta mirna", "Med nabitima balonoma deluje sila."], ["eden postane pozitiven", "Brez dotika se naboj ne spremeni."]] },
          { q: `${name} drgne stekleno palico s svilo in palica se naelektri pozitivno. Kaj se je zgodilo?`, ok: "elektroni so prešli s palice na svilo", wrong: [["protoni so prešli s svile na palico", "Protoni so v jedrih in se pri drgnjenju ne premikajo."], ["na palici so nastali novi pozitivni naboji", "Naboj se ohranja; ne nastaja in ne izginja."], ["svila je ostala nenabita", "Svila je prejela elektrone, zato je nabita negativno."]] },
          { q: "Naelektreno plastično ravnilo privlači drobne nenabite koščke papirja. Zakaj?", ok: "ker se v papirju naboji prerazporedijo in bližnja stran ima nasprotni naboj", wrong: [["ker je papir nabit z nasprotnim nabojem", "Papir je bil nenabit; naboji se v njem le prerazporedijo."], ["zaradi teže papirja", "Teža papir vleče navzdol, ne k ravnilu."], ["ker ravnilo deluje kot magnet", "To je električna, ne magnetna sila."]] },
          { q: "Kateri delci se pri elektrenju z drgnjenjem prenašajo z enega telesa na drugo?", ok: "elektroni", wrong: [["protoni", "Protoni so trdno vezani v atomskih jedrih."], ["nevtroni", "Nevtroni niso nabiti in ostanejo v jedrih."], ["cela jedra atomov", "Pri drgnjenju preidejo le zunanji elektroni."]] },
        ]);
        return concept(r, {
          ...P,
          hint: "Istovrstna naboja se odbijata, raznovrstna privlačita. Pri elektrenju se premikajo le elektroni.",
          given: [T("nabita telesa")],
          find: [T("kaj se zgodi")],
          sol: ["Raznovrstna naboja se privlačita, istovrstna odbijata. Pri drgnjenju elektroni preidejo z enega telesa na drugo; naboj se ohranja.", `Pravilno: ${P.ok}.`],
        });
      }
      if (level === 2) {
        if (r.next() < 0.5) {
          const q1 = r.nonZero(-30, 30) * 2;
          const q2 = r.int(-30, 30) * 2;
          const qe = (q1 + q2) / 2;
          return {
            text: `Dve enaki kovinski kroglici imata naboja $${q1}\\ \\mathrm{nC}$ in $${q2}\\ \\mathrm{nC}$. ${name} ju z izolirano pinceto staknjenje in nato razmakne. Kolikšen naboj ima po dotiku vsaka kroglica?`.replace("staknjenje", "stakne"),
            answer: num(qe, "nC", null, [[q1 + q2, "Skupni naboj se razdeli na obe enaki kroglici."], [(Math.abs(q1) + Math.abs(q2)) / 2, "Upoštevaj predznak: pozitivni in negativni naboji se izničijo."]]),
            hint: "Skupni naboj se ohrani. Ker sta kroglici enaki, se razdeli na pol.",
            data: { given: [dat("e_1", q1, "nC"), dat("e_2", q2, "nC")], find: ["e'"] },
            formula: ["e' = \\dfrac{e_1 + e_2}{2}"],
            solution: `Skupni naboj: $e_1 + e_2 = ${q1} + ${q2 < 0 ? `(${q2})` : q2} = ${qty(q1 + q2, "nC")}$\nRazdeli se na dve enaki kroglici: $e' = \\dfrac{${q1 + q2}}{2} = ${qty(tx(qe), "nC")}$`,
          };
        }
        const q0 = r.int(-20, 20) * 50;
        const nTr = r.int(1, 30) * 50;
        const gain = r.next() < 0.5;
        const q = gain ? q0 - nTr : q0 + nTr;
        const obj = r.pick(["Balon", "Plastično ravnilo", "Glavnik", "Kroglica elektroskopa"]);
        return {
          text: `${obj} ima naboj $${q0 > 0 ? "+" : ""}${q0}\\, e_0$. Nato ${gain ? "prejme" : "odda"} ${nTr} elektronov. Kolikšen je njegov naboj zdaj (v $e_0$)? Zapiši pozitivno ali negativno število.`,
          answer: num(q, null, null, [[gain ? q0 + nTr : q0 - nTr, "Elektron ima negativen naboj: če ga telo prejme, se naboj zmanjša."], [gain ? -nTr : nTr, "Upoštevaj tudi začetni naboj."]]),
          hint: "Vsak elektron ima naboj $-e_0$. Prejeti elektroni naboj zmanjšajo, oddani povečajo.",
          data: { given: [`e_z = ${q0}\\, e_0`, `N_e = ${nTr}`], find: ["e"] },
          formula: [gain ? "e = e_z - N_e \\cdot e_0" : "e = e_z + N_e \\cdot e_0"],
          solution: `${gain ? "Prejeti elektroni prinesejo negativen naboj" : "Oddani elektroni odnesejo negativen naboj, zato se naboj poveča"}.\n$e = ${q0}\\, e_0 ${gain ? "-" : "+"} ${nTr}\\, e_0 = ${q}\\, e_0$`,
        };
      }
      if (r.next() < 0.5) {
        const rev = r.next() < 0.5;
        if (rev) {
          const Nb = r.int(2, 90) * 5; // v milijardah
          const qn = Nb * 1e9 * 1.6e-19 * 1e9;
          return {
            text: `Pri drgnjenju glavnika ob lase je na glavnik prešlo $${Nb}$ milijard elektronov. Kolikšen je naboj glavnika v nC? Osnovni naboj je $e_0 = 1{,}6 \\cdot 10^{-19}\\ \\mathrm{As}$. Vpiši velikost naboja (brez predznaka) in zaokroži na dve decimalki.`,
            answer: num(qn, "nC", 2, [[Nb * 1.6, "Milijarda je $10^9$; preveri potence."]], { unitAlternatives: ["nas"] }),
            hint: "Naboj je število elektronov krat osnovni naboj. Milijarda je $10^9$, $1\\ \\mathrm{nC} = 10^{-9}\\ \\mathrm{As}$.",
            data: { given: [`N = ${Nb} \\cdot 10^9`, "e_0 = 1{,}6 \\cdot 10^{-19}\\ \\mathrm{As}"], find: ["e"] },
            formula: ["e = N \\cdot e_0", "1\\ \\mathrm{nC} = 10^{-9}\\ \\mathrm{As}"],
            solution: `$e = N \\cdot e_0 = ${Nb} \\cdot 10^9 \\cdot 1{,}6 \\cdot 10^{-19}\\ \\mathrm{As} = ${tx(roundHalfUp(Nb * 1.6, 2))} \\cdot 10^{-10}\\ \\mathrm{As}$\n$e ${res(qn, 2, "nC")}$ (glavnik je nabit negativno)`,
          };
        }
        const qn = r.dec(0.5, 20, 1);
        const N = (qn * 1e-9) / 1.6e-19 / 1e9;
        return {
          text: `Balon je nabit z nabojem $-${tx(qn)}\\ \\mathrm{nC}$. Koliko milijard elektronov ima balon več kot protonov? Osnovni naboj je $e_0 = 1{,}6 \\cdot 10^{-19}\\ \\mathrm{As}$, $1\\ \\mathrm{nC} = 10^{-9}\\ \\mathrm{As}$. Zaokroži na eno decimalko.`,
          answer: num(N, null, 1, [[qn / 1.6, "Preveri potence: $10^{-9} / 10^{-19} = 10^{10}$."]]),
          hint: "Število elektronov je naboj, deljen z osnovnim nabojem. Rezultat izrazi v milijardah ($10^9$).",
          data: { given: [`e = -${tx(qn)}\\ \\mathrm{nC}`, "e_0 = 1{,}6 \\cdot 10^{-19}\\ \\mathrm{As}"], find: ["N"] },
          formula: ["N = \\dfrac{|e|}{e_0}"],
          solution: `$|e| = ${tx(qn)} \\cdot 10^{-9}\\ \\mathrm{As}$\n$N = \\dfrac{${tx(qn)} \\cdot 10^{-9}}{1{,}6 \\cdot 10^{-19}} = ${tx(roundHalfUp(qn / 1.6, 4))} \\cdot 10^{10}$\n$N ${res(N, 1)}$ milijard elektronov`,
        };
      }
      const q = r.nonZero(-20, 20) * 8;
      const order = r.pick(["AB-BC", "AB-AC"]);
      const ask = order === "AB-BC" ? r.pick(["A", "B", "C"]) : r.pick(["A", "B", "C"]);
      const qa = order === "AB-BC" ? { A: q / 2, B: q / 4, C: q / 4 } : { A: q / 4, B: q / 2, C: q / 4 };
      return {
        text: `Tri enake kovinske kroglice A, B in C so na izolirnih stojalih. A ima naboj $${q}\\ \\mathrm{nC}$, B in C sta nenabiti ($e = 0$). ${name} najprej stakne A in B, nato ${order === "AB-BC" ? "B in C" : "A in C"}. Kolikšen naboj ima na koncu kroglica ${ask}?`,
        answer: num(qa[ask], "nC", null, [[q / 3, "Kroglice se niso dotaknile vse hkrati; naboj se deli dvakrat na pol."], [q / 2, "Preveri, kaj se zgodi pri drugem dotiku."], [q, "Pri dotiku z enako nenabito kroglico se naboj razdeli na pol."]]),
        hint: "Pri dotiku dveh enakih kroglic se njun skupni naboj razdeli na pol. Sledi naboju korak za korakom.",
        data: { given: [dat("e_A", q, "nC"), "e_B = e_C = 0"], find: [`e_${ask}`] },
        formula: ["e' = \\dfrac{e_1 + e_2}{2}"],
        solution: `Po dotiku A in B: $e_A = e_B = \\dfrac{${q}}{2} = ${qty(tx(q / 2), "nC")}$\n${order === "AB-BC" ? `Po dotiku B in C: $e_B = e_C = \\dfrac{${tx(q / 2)}}{2} = ${qty(tx(q / 4), "nC")}$, A ostane $${qty(tx(q / 2), "nC")}$` : `Po dotiku A in C: $e_A = e_C = \\dfrac{${tx(q / 2)}}{2} = ${qty(tx(q / 4), "nC")}$, B ostane $${qty(tx(q / 2), "nC")}$`}\n$e_${ask} = ${qty(tx(qa[ask]), "nC")}$`,
      };
    },
  },
  {
    id: "dod-os-elektricni-tok-napetost",
    topics: ["FIZ-OS-9/elektricni-tok-in-napetost"],
    gen(level, r) {
      const name = r.pick(NAMES);
      const fI = "I = \\dfrac{e}{t}";
      if (level === 1) {
        if (r.next() < 0.55) {
          const t = r.int(2, 60);
          const I0 = r.pick([0.1, 0.2, 0.25, 0.3, 0.5, 0.8, 1.2, 1.5, 2, 2.5, 4]);
          const e = roundHalfUp(I0 * t, 1);
          const I = e / t;
          const dev = r.pick(["žarnico", "grelnik", "motorček igrače", "LED trak", "polnilnik"]);
          return {
            text: `Skozi ${dev} v $${qty(t, "s")}$ steče naboj $${qty(tx(e), "As")}$. Kolikšen je električni tok? Zaokroži na dve decimalki.`,
            answer: num(I, "A", 2, [[t / e, "Tok je naboj, deljen s časom, ne obratno."], [e * t, "Tok je naboj na enoto časa: deli s časom."]]),
            hint: "Električni tok pove, koliko naboja steče v eni sekundi.",
            data: { given: [dat("e", tx(e), "As"), dat("t", t, "s")], find: ["I"] },
            formula: fI,
            solution: `Tok je naboj, ki steče v eni sekundi.\n$I = \\dfrac{e}{t} = \\dfrac{${qty(tx(e), "As")}}{${qty(t, "s")}} ${res(I, 2, "A")}$`,
          };
        }
        const P = r.pick([
          { q: "Kako vežemo ampermeter, ko merimo tok skozi žarnico?", ok: "zaporedno z žarnico", wrong: [["vzporedno z žarnico", "Vzporedno vežemo voltmeter; ampermeter mora meriti tok, ki teče skozi žarnico."], ["kamor koli, vezava ni pomembna", "Ampermeter meri tok, ki teče skozenj, zato mora biti v isti veji kot žarnica."], ["neposredno na pola baterije brez žarnice", "To je kratek stik; ampermeter bi se lahko pokvaril."]] },
          { q: "Kako vežemo voltmeter, ko merimo napetost na žarnici?", ok: "vzporedno z žarnico", wrong: [["zaporedno z žarnico", "Voltmeter ima zelo velik upor; zaporedno bi skoraj prekinil tok."], ["med dve žarnici v isto vejo", "Voltmeter priključimo na oba konca porabnika."], ["samo na en priključek žarnice", "Napetost je razlika med dvema točkama, zato potrebujemo oba priključka."]] },
          { q: "Katero količino meri voltmeter?", ok: "električno napetost", wrong: [["električni tok", "Tok meri ampermeter."], ["električni naboj", "Naboja voltmeter ne meri."], ["električni upor", "Upor merimo z ohmmetrom ali ga izračunamo."]] },
          { q: "V kateri enoti merimo električni tok?", ok: "v amperih (A)", wrong: [["v voltih (V)", "V voltih merimo napetost."], ["v amperskih sekundah (As)", "As je enota za naboj."], ["v ohmih", "V ohmih merimo upor."]] },
          { q: "Ampermeter v preprostem krogu z baterijo in žarnico prestavimo z mesta pred žarnico na mesto za njo. Kaj pokaže?", ok: "enak tok kot prej", wrong: [["manjši tok, ker žarnica porabi tok", "Žarnica porabi energijo, ne toka; tok je v zaporedni vezavi povsod enak."], ["večji tok", "V nerazvejanem krogu je tok povsod enak."], ["nič, ker je tok že porabljen", "Tok teče skozi ves sklenjen krog."]] },
        ]);
        return concept(r, {
          ...P,
          hint: "Ampermeter meri tok, ki teče skozenj, zato je v isti veji. Voltmeter meri napetost med dvema točkama, zato ga priključimo vzporedno.",
          given: [T("električni krog")],
          find: [T("pravilni odgovor")],
          sol: ["Ampermeter vežemo zaporedno (meri tok v A), voltmeter vzporedno (meri napetost v V). V nerazvejanem krogu je tok povsod enak.", `Pravilno: ${P.ok}.`],
        });
      }
      if (level === 2) {
        const k = r.int(0, 2);
        if (k === 0) {
          const ImA = r.int(2, 80) * 10;
          const tMin = r.int(2, 45);
          const e = (ImA / 1000) * tMin * 60;
          return {
            text: `${name} ${g(name, "je ugotovil", "je ugotovila")}, da skozi svetilko teče tok $${qty(ImA, "mA")}$. Kolikšen naboj steče skozi svetilko v $${qty(tMin, "min")}$? Zaokroži na eno decimalko.`,
            answer: num(e, "As", 1, [[ImA * tMin * 60, "Tok pretvori v ampere (1 mA = 0,001 A)."], [(ImA / 1000) * tMin, "Čas pretvori v sekunde."]], { unitAlternatives: ["c"] }),
            hint: "Iz $I = \\dfrac{e}{t}$ izrazi naboj. Tok pretvori v A, čas v s.",
            data: { given: [dat("I", ImA, "mA"), dat("t", tMin, "min")], find: ["e"] },
            formula: [fI, "e = I \\cdot t"],
            solution: `$I = ${qty(ImA, "mA")} = ${qty(tx(ImA / 1000), "A")}$, $t = ${qty(tMin, "min")} = ${qty(tMin * 60, "s")}$\n$e = I \\cdot t = ${tx(ImA / 1000)}\\ \\mathrm{A} \\cdot ${tMin * 60}\\ \\mathrm{s} ${res(e, 1, "As")}$`,
          };
        }
        if (k === 1) {
          const n = r.int(2, 8);
          const U1 = r.pick([1.2, 1.5]);
          const rev = r.next() < 0.5;
          const U = roundHalfUp(n * U1, 1);
          if (rev) {
            return {
              text: `Za igračo potrebuješ napetost $${qty(tx(U), "V")}$. Koliko baterij z napetostjo $${qty(tx(U1), "V")}$ moraš zaporedno vstaviti vanjo?`,
              answer: num(n, null, null, [[roundHalfUp(U * U1, 2), "Pri zaporedni vezavi se napetosti seštevajo; deli skupno napetost z napetostjo ene baterije."]]),
              hint: "Pri zaporedni vezavi baterij se njihove napetosti seštejejo.",
              data: { given: [dat("U", tx(U), "V"), dat("U_1", tx(U1), "V")], find: ["n"] },
              formula: ["U = n \\cdot U_1", "n = \\dfrac{U}{U_1}"],
              solution: `Napetosti zaporedno vezanih baterij se seštejejo: $U = n \\cdot U_1$.\n$n = \\dfrac{${tx(U)}\\ \\mathrm{V}}{${tx(U1)}\\ \\mathrm{V}} = ${n}$`,
            };
          }
          return {
            text: `${name} v svetilko zaporedno vstavi ${n} baterij z napetostjo po $${qty(tx(U1), "V")}$. Kolikšno napetost pokaže voltmeter, priključen na oba konca baterij?`,
            answer: num(U, "V", null, [[U1, "Pri zaporedni vezavi se napetosti baterij seštejejo."], [roundHalfUp(U1 / n, 3), "Napetost se ne razdeli; zaporedno vezane baterije dajo večjo napetost."]]),
            hint: "Pri zaporedni vezavi baterij se njihove napetosti seštejejo.",
            data: { given: [`n = ${n}`, dat("U_1", tx(U1), "V")], find: ["U"] },
            formula: "U = n \\cdot U_1",
            solution: `Napetosti zaporedno vezanih baterij se seštejejo.\n$U = ${n} \\cdot ${qty(tx(U1), "V")} = ${qty(tx(U), "V")}$`,
          };
        }
        const U = r.pick([4.5, 6, 9, 12, 24]);
        const U1 = roundHalfUp(r.dec(0.2, 0.8, 2) * U, 1);
        const U2 = roundHalfUp(U - U1, 1);
        return {
          text: `Na baterijo z napetostjo $${qty(tx(U), "V")}$ sta zaporedno vezani dve žarnici. Voltmeter na prvi žarnici kaže $${qty(tx(U1), "V")}$. Koliko pokaže voltmeter na drugi žarnici?`,
          answer: num(U2, "V", null, [[U, "Napetost baterije se pri zaporedni vezavi razdeli med žarnici."], [U1, "Žarnici nista nujno enaki, zato napetosti nista enaki."], [roundHalfUp(U / 2, 2), "Napetost se ne deli nujno na pol; uporabi izmerjeno napetost na prvi žarnici."]]),
          hint: "Pri zaporedni vezavi je vsota napetosti na porabnikih enaka napetosti vira.",
          data: { given: [dat("U", tx(U), "V"), dat("U_1", tx(U1), "V")], find: ["U_2"] },
          formula: ["U = U_1 + U_2", "U_2 = U - U_1"],
          solution: `Vsota napetosti na žarnicah je enaka napetosti baterije.\n$U_2 = ${tx(U)}\\ \\mathrm{V} - ${tx(U1)}\\ \\mathrm{V} = ${qty(tx(U2), "V")}$`,
        };
      }
      const k = r.int(0, 2);
      if (k === 0) {
        const C = r.pick([1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000]);
        const I = r.int(5, 60) * 10;
        const h = C / I;
        const dev = r.pick(["Baterija telefona", "Baterija prenosnega zvočnika", "Baterija brezžičnih slušalk", "Prenosna baterija (powerbank)", "Baterija električne zobne ščetke"]);
        return {
          text: `${dev} ima zapisano kapaciteto $${qty(C, "mAh")}$ (toliko naboja shrani). Naprava porablja povprečno tok $${qty(I, "mA")}$. Koliko ur zdrži polna baterija? Koliko naboja je to v As? Vpiši čas v urah, zaokrožen na eno decimalko.`,
          answer: num(h, "h", 1, [[(C * 3.6) / I, "Rezultat v urah dobiš neposredno iz mAh in mA; ne pretvarjaj v sekunde."], [I / C, "Čas je naboj, deljen s tokom, ne obratno."]], { unitAlternatives: ["ur", "ure", "uri", "ura"] }),
          hint: "Kapaciteta v mAh je tok krat čas. Iz $e = I \\cdot t$ izrazi čas; mAh deljeno z mA da ure.",
          data: { given: [dat("e", C, "mAh"), dat("I", I, "mA")], find: ["t"] },
          formula: ["e = I \\cdot t", "t = \\dfrac{e}{I}", "1\\ \\mathrm{mAh} = 3{,}6\\ \\mathrm{As}"],
          solution: `$t = \\dfrac{e}{I} = \\dfrac{${C}\\ \\mathrm{mAh}}{${I}\\ \\mathrm{mA}} ${res(h, 1, "h")}$\nShranjeni naboj: $e = ${C} \\cdot 3{,}6\\ \\mathrm{As} = ${qty(grp(roundHalfUp(C * 3.6, 0)), "As")}$`,
        };
      }
      if (k === 1) {
        const range = r.pick([0.1, 0.3, 1, 3, 10]);
        const div = r.pick([10, 30, 50, 100]);
        const kk = r.int(3, div - 1);
        const I = (kk * range) / div;
        const unit = range < 1 ? "mA" : "A";
        const val = unit === "mA" ? I * 1000 : I;
        const rT = unit === "mA" ? `${grp(range * 1000)}\\ \\mathrm{mA}` : `${tx(range)}\\ \\mathrm{A}`;
        return {
          text: `Ampermeter ima izbrano merilno območje $${rT}$, njegova skala pa ima $${div}$ razdelkov. Kazalec se ustavi pri ${kk}. razdelku. Kolikšen tok teče? Rezultat zapiši v ${unit} in zaokroži na dve decimalki.`,
          answer: num(val, unit, 2, [[kk, "To je število razdelkov. Izračunaj, koliko toka pomeni en razdelek."], [unit === "mA" ? (kk * range * 1000) / 100 : (kk * range) / 100, "Skala nima 100 razdelkov; uporabi dano število razdelkov."]]),
          hint: "Najprej izračunaj, koliko toka pomeni en razdelek: merilno območje deljeno s številom razdelkov.",
          data: { given: [`I_{max} = ${rT}`, `N = ${div}`, `n = ${kk}`], find: ["I"] },
          formula: ["I = n \\cdot \\dfrac{I_{max}}{N}"],
          solution: `En razdelek: $\\dfrac{${rT}}{${div}} = ${qty(tx(unit === "mA" ? (range * 1000) / div : range / div), unit)}$\n$I = ${kk} \\cdot ${tx(unit === "mA" ? (range * 1000) / div : range / div)}\\ \\mathrm{${unit}} ${res(val, 2, unit)}$`,
        };
      }
      const P = r.pick([
        { q: `${name} je po pomoti vezal${g(name, "", "a")} ampermeter vzporedno k žarnici. Kaj se zgodi?`, ok: "skozi ampermeter steče zelo velik tok (kratek stik), ki ga lahko pokvari", wrong: [["ampermeter pokaže tok skozi žarnico", "Ampermeter ima zelo majhen upor; vzporedno skoraj ves tok steče skozenj."], ["nič, ampermeter pokaže 0 A", "Skozi ampermeter steče velik tok, ker ima majhen upor."], ["žarnica sveti močneje", "Žarnica je premoščena z ampermetrom, zato skoraj ugasne."]] },
        { q: `${name} je po pomoti vezal${g(name, "", "a")} voltmeter zaporedno z žarnico. Kaj se zgodi?`, ok: "žarnica skoraj ne sveti, ker ima voltmeter zelo velik upor", wrong: [["voltmeter se pokvari zaradi velikega toka", "Voltmeter ima velik upor, zato je tok majhen."], ["voltmeter pokaže napetost na žarnici", "Zaporedno pokaže skoraj napetost vira."], ["žarnica sveti enako kot prej", "Velik upor voltmetra tok zelo zmanjša."]] },
        { q: "Kaj naredimo, če ne vemo, kako velik tok bomo merili z ampermetrom z več merilnimi območji?", ok: "začnemo z največjim merilnim območjem in ga po potrebi zmanjšamo", wrong: [["začnemo z najmanjšim območjem", "Če je tok večji od območja, se lahko instrument pokvari."], ["izberemo kar koli, ni pomembno", "Prevelik tok lahko instrument pokvari, premajhno območje pa da netočen odčitek."], ["ampermeter vežemo vzporedno, da je varneje", "Vzporedna vezava ampermetra je kratek stik."]] },
      ]);
      return concept(r, {
        ...P,
        hint: "Ampermeter ima zelo majhen upor, voltmeter zelo velikega. Pomisli, kaj to pomeni za tok v krogu.",
        given: [T("ampermeter: majhen upor"), T("voltmeter: velik upor")],
        find: [T("posledica")],
        sol: ["Ampermeter (majhen upor) vežemo zaporedno, voltmeter (velik upor) vzporedno; pri neznanem toku začnemo z največjim merilnim območjem.", `Pravilno: ${P.ok}.`],
      });
    },
  },
  {
    id: "dod-os-magneti",
    topics: ["FIZ-OS-9/magneti-in-magnetno-polje"],
    gen(level, r) {
      const name = r.pick(NAMES);
      const DIR = [["sever", 0], ["severovzhod", 45], ["vzhod", 90], ["jugovzhod", 135], ["jug", 180], ["jugozahod", 225], ["zahod", 270], ["severozahod", 315]];
      const fA = "\\text{azimut: kot od severa v smeri urinega kazalca}";
      if (level === 1) {
        if (r.next() < 0.4) {
          const [d, a] = r.pick(DIR.slice(1));
          return {
            text: `Azimut je kot med smerjo proti severu in smerjo gibanja, merjen v smeri urinega kazalca (sever $0^\\circ$, vzhod $90^\\circ$). ${name} s kompasom hodi proti ${d.replace(/r$/, "ru").replace(/k$/, "ku").replace(/g$/, "gu").replace(/d$/, "du")}. Kolikšen je azimut te smeri?`,
            answer: num(a, "°", null, [[(360 - a) % 360, "Azimut merimo v smeri urinega kazalca (od severa proti vzhodu)."], [(a + 180) % 360, "To je nasprotna smer."]]),
            hint: "Polni krog ima $360^\\circ$. Sever je $0^\\circ$, vzhod $90^\\circ$, jug $180^\\circ$, zahod $270^\\circ$; vmesne smeri so na polovici.",
            data: { given: [T(`smer: ${d}`)], find: ["A"] },
            formula: ["S = 0^\\circ,\\ V = 90^\\circ,\\ J = 180^\\circ,\\ Z = 270^\\circ"],
            solution: `Od severa v smeri urinega kazalca do smeri ${d} je ${a / 45} ${a / 45 === 1 ? "osmina" : a / 45 === 2 ? "osmini" : a / 45 <= 4 ? "osmine" : "osmin"} kroga.\n$A = ${a / 45} \\cdot 45^\\circ = ${a}^\\circ$`,
          };
        }
        const P = r.pick([
          { q: "Severni pol enega magneta približamo severnemu polu drugega. Kaj se zgodi?", ok: "magneta se odbijata", wrong: [["magneta se privlačita", "Privlačita se raznoimenska pola (S in J)."], ["nič, ker sta pola enaka", "Med poloma deluje sila: enaka pola se odbijata."], ["magneta se razmagnetita", "Ob približanju se magneta ne razmagnetita."]] },
          { q: "Katero od naštetih teles privlači magnet?", ok: "železen žebelj", wrong: [["bakren kovanec", "Baker ni feromagnetna snov, magnet ga ne privlači."], ["aluminijasta pločevinka", "Aluminija magnet ne privlači opazno."], ["plastična žlica", "Plastika ni magnetna."]] },
          { q: "Paličast magnet prelomimo na pol. Kaj dobimo?", ok: "dva manjša magneta, vsak s severnim in južnim polom", wrong: [["en samostojen severni in en samostojen južni pol", "Polov ne moremo ločiti; vsak kos ima oba pola."], ["dva kosa, ki nista več magnetna", "Vsak kos ostane magnet."], ["en magnet in en kos navadnega železa", "Oba kosa sta magneta."]] },
          { q: "Kje je magnetno polje paličastega magneta najmočnejše?", ok: "ob polih, na koncih magneta", wrong: [["na sredini magneta", "Na sredini magnet železnih opilkov skoraj ne privlači."], ["povsod enako", "Silnice so najgostejše ob polih."], ["daleč od magneta", "Polje z razdaljo slabi."]] },
          { q: "Kam se obrne severni pol magnetne igle kompasa?", ok: "proti geografskemu severu", wrong: [["proti geografskemu jugu", "Proti jugu kaže južni pol igle."], ["proti vzhodu, kjer vzhaja Sonce", "Kompas se ravna po Zemljinem magnetnem polju, ne po Soncu."], ["vedno proti najbližjemu železnemu predmetu", "Železo lahko zmoti kompas, a brez njega igla kaže proti severu."]] },
        ]);
        return concept(r, {
          ...P,
          hint: "Enaka pola se odbijata, različna privlačita. Magnet privlači železo, nikelj in kobalt.",
          given: [T("magneti in magnetne snovi")],
          find: [T("pravilni odgovor")],
          sol: ["Istoimenska pola se odbijata, raznoimenska privlačita; vsak magnet ima oba pola; magnet privlači feromagnetne snovi (železo, nikelj, kobalt).", `Pravilno: ${P.ok}.`],
        });
      }
      if (level === 2) {
        if (r.next() < 0.5) {
          const a = r.int(1, 71) * 5;
          const back = (a + 180) % 360;
          const goal = r.pick(["do koče", "do razglednega stolpa", "do jezera", "do gozdne jase", "do izvira"]);
          return {
            text: `${name} gre od parkirišča ${goal} po azimutu $${a}^\\circ$. Po katerem azimutu se mora vrniti po isti poti nazaj? (Azimut merimo od severa v smeri urinega kazalca, od $0^\\circ$ do $360^\\circ$.)`,
            answer: num(back, "°", null, [[Math.abs(180 - a), "Nasprotna smer je obrnjena za $180^\\circ$: prištej (ali odštej) $180^\\circ$."], [(360 - a) % 360, "To je smer, zrcaljena čez os sever–jug, ne nasprotna smer."]]),
            hint: "Nasprotna smer je zasukana za pol kroga, $180^\\circ$. Rezultat mora biti med $0^\\circ$ in $360^\\circ$.",
            data: { given: [dat("A", a, "°")], find: ["A'"] },
            formula: [fA, a < 180 ? "A' = A + 180^\\circ" : "A' = A - 180^\\circ"],
            solution: `Nasprotna smer je zasukana za $180^\\circ$.\n$A' = ${a}^\\circ ${a < 180 ? "+" : "-"} 180^\\circ = ${back}^\\circ$`,
          };
        }
        const P = r.pick([
          { q: "Severni pol igle kompasa kaže proti geografskemu severu. Kakšen magnetni pol je torej blizu geografskega severnega pola?", ok: "južni magnetni pol", wrong: [["severni magnetni pol", "Severni pol igle privlači raznoimenski, torej južni pol."], ["tam ni magnetnega pola", "Zemlja deluje kot velik magnet; blizu geografskih polov sta magnetna pola."], ["oba pola hkrati", "Vsak pol magneta je na svojem koncu."]] },
          { q: "Zakaj kompas v bližini železne omare kaže napačno smer?", ok: "ker železo spremeni magnetno polje v okolici", wrong: [["ker omara oddaja elektriko", "Omara ni vir toka; vpliva kot feromagnetna snov."], ["ker se kompas pokvari", "Ko ga odmaknemo, spet kaže pravilno."], ["ker železo zakrije pogled na nebo", "Kompas ne potrebuje pogleda na nebo."]] },
          { q: "Kako bi izdelal preprost kompas?", ok: "namagneteno šivanko položiš na plutovinast ploščat zamašek, ki plava na vodi", wrong: [["bakreno žico položiš na vodo", "Baker ni magneten in se ne obrne proti severu."], ["navadno, nenamagneteno šivanko obesiš na nit", "Šivanko je treba najprej namagnetiti."], ["magnet prilepiš na mizo", "Igla se mora prosto vrteti."]] },
          { q: "Kaj nas na Zemlji ščiti pred nabitimi delci s Sonca (Sončevim vetrom)?", ok: "Zemljino magnetno polje", wrong: [["Lunina gravitacija", "Luna nas pred Sončevim vetrom ne ščiti."], ["oblaki", "Oblaki ne odklanjajo nabitih delcev iz vesolja."], ["Zemljino vrtenje samo po sebi", "Ščiti nas magnetno polje, ki odklanja nabite delce."]] },
          { q: "Kaj je polarni sij?", ok: "svetlikanje ozračja, ko nabiti delci s Sonca ob polih zadenejo pline v ozračju", wrong: [["odboj Sončeve svetlobe od ledu", "Polarni sij nastane visoko v ozračju, ne na tleh."], ["svetloba iz notranjosti Zemlje", "Vir so nabiti delci s Sonca."], ["mavrica ob polih", "Mavrica nastane z lomom v kapljicah, polarni sij pa v ozračju zaradi delcev."]] },
        ]);
        return concept(r, {
          ...P,
          hint: "Zemlja se obnaša kot velik magnet; igla kompasa se obrne v smeri silnic Zemljinega magnetnega polja.",
          given: [T("Zemljino magnetno polje")],
          find: [T("razlaga")],
          sol: ["Zemlja je velik magnet: njen južni magnetni pol je blizu geografskega severa, zato severni pol igle kaže proti severu.", `Pravilno: ${P.ok}.`],
        });
      }
      const dlt = r.pick([3, 4, 5]);
      const toGeo = r.next() < 0.5;
      const a = r.int(4, 68) * 5;
      const val = toGeo ? (a + dlt) % 360 : (a - dlt + 360) % 360;
      return {
        text: `Igla kompasa ne kaže točno proti geografskemu severu, ampak proti magnetnemu polu. V Sloveniji je ta odklon (deklinacija) približno $${dlt}^\\circ$ proti vzhodu. ${toGeo ? `Kompas kaže smer z magnetnim azimutom $${a}^\\circ$. Kolikšen je azimut te smeri glede na geografski sever (kot na zemljevidu)?` : `Na zemljevidu ${name} izmeri azimut $${a}^\\circ$. Kolikšen azimut mora nastaviti na kompasu?`}`,
        answer: num(val, "°", null, [[toGeo ? a - dlt : a + dlt, "Magnetni sever je od geografskega zasukan proti vzhodu. Premisli, ali odklon prišteješ ali odšteješ."], [a, "Upoštevati moraš odklon (deklinacijo)."]]),
        hint: "Nariši oba severa: magnetni sever je za deklinacijo zasukan proti vzhodu. Kot od geografskega severa je zato večji od kota od magnetnega severa.",
        data: { given: [dat("\\delta", dlt, "°"), dat(toGeo ? "A_m" : "A_g", a, "°")], find: [toGeo ? "A_g" : "A_m"] },
        formula: ["A_g = A_m + \\delta", "A_m = A_g - \\delta"],
        solution: `Magnetni sever leži $${dlt}^\\circ$ vzhodno od geografskega, zato je $A_g = A_m + \\delta$.\n${toGeo ? `$A_g = ${a}^\\circ + ${dlt}^\\circ = ${val}^\\circ$` : `$A_m = A_g - \\delta = ${a}^\\circ - ${dlt}^\\circ = ${val}^\\circ$`}`,
      };
    },
  },
  {
    id: "dod-os-elektromagnet",
    topics: ["FIZ-OS-9/elektromagnet"],
    gen(level, r) {
      const name = r.pick(NAMES);
      const fB = "B \\propto \\dfrac{N \\cdot I}{l}";
      if (level === 1) {
        if (r.next() < 0.4) {
          const I1 = r.pick([0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1]);
          const kf = r.pick([2, 3, 4, 1.5, 2.5]);
          const I2 = roundHalfUp(I1 * kf, 2);
          return {
            text: `${name} poveča tok skozi tuljavo elektromagneta s $${qty(tx(I1), "A")}$ na $${qty(tx(I2), "A")}$. Magnetno polje v tuljavi je sorazmerno s tokom. Kolikokrat se poveča magnetno polje?`,
            answer: num(I2 / I1, null, null, [[roundHalfUp(I2 - I1, 2), "To je razlika tokov. Kolikokrat je količnik."], [I1 / I2, "Količnik si obrnil: polje se poveča."]]),
            hint: "Če je polje sorazmerno s tokom, se poveča tolikokrat, kolikokrat se poveča tok.",
            data: { given: [dat("I_1", tx(I1), "A"), dat("I_2", tx(I2), "A")], find: ["\\dfrac{B_2}{B_1}"] },
            formula: "\\dfrac{B_2}{B_1} = \\dfrac{I_2}{I_1}",
            solution: `Polje je sorazmerno s tokom.\n$\\dfrac{B_2}{B_1} = \\dfrac{${tx(I2)}\\ \\mathrm{A}}{${tx(I1)}\\ \\mathrm{A}} = ${tx(I2 / I1)}$`,
          };
        }
        const P = r.pick([
          { q: "Kako lahko elektromagnet okrepimo?", ok: "povečamo tok skozi tuljavo", wrong: [["obrnemo smer toka", "S tem zamenjamo pola, polje pa ostane enako močno."], ["železno jedro zamenjamo z bakrenim", "Baker ni feromagneten; brez železa je polje šibkejše."], ["uporabimo debelejšo izolacijo žice", "Izolacija ne vpliva na magnetno polje."]] },
          { q: "Kako zamenjamo severni in južni pol elektromagneta?", ok: "obrnemo smer toka skozi tuljavo", wrong: [["povečamo tok", "Večji tok polje okrepi, polov pa ne zamenja."], ["odstranimo železno jedro", "Brez jedra je polje šibkejše, a pola ostaneta."], ["dodamo več ovojev", "Več ovojev polje okrepi, smer ostane."]] },
          { q: "Kaj se zgodi, ko tok skozi elektromagnet z jedrom iz mehkega železa izklopimo?", ok: "magnetno polje skoraj izgine in elektromagnet spusti železne predmete", wrong: [["ostane enako močan magnet", "Mehko železo se ob izklopu skoraj razmagneti; prav to je prednost elektromagneta."], ["pola se zamenjata", "Pola se zamenjata le, če obrnemo smer toka."], ["polje postane močnejše", "Brez toka v tuljavi ni polja."]] },
          { q: "Zakaj v tuljavo elektromagneta vstavimo železno jedro?", ok: "ker se železo namagneti in polje zelo okrepi", wrong: [["da tuljava ne pregori", "Jedro ne varuje žice; okrepi polje."], ["da je tuljava težja in stabilnejša", "Namen jedra je okrepitev polja."], ["ker železo prevaja tok bolje kot baker", "Tok teče po bakreni žici, ne skozi jedro."]] },
          { q: "V kateri napravi je elektromagnet?", ok: "v električnem zvoncu", wrong: [["v žepnem kompasu", "Kompas ima trajno namagneteno iglo."], ["v magnetku za hladilnik", "To je trajni magnet."], ["v navadni žarnici z žarilno nitko", "Žarnica sveti zaradi segrete nitke, elektromagneta nima."]] },
        ]);
        return concept(r, {
          ...P,
          hint: "Magnetno polje tuljave je močnejše pri večjem toku, več ovojih in z železnim jedrom; smer polja določa smer toka.",
          given: [T("tuljava s tokom")],
          find: [T("pravilni odgovor")],
          sol: ["Polje tuljave okrepimo z večjim tokom, več ovoji in železnim jedrom; ko obrnemo tok, se pola zamenjata; brez toka polja ni.", `Pravilno: ${P.ok}.`],
        });
      }
      if (level === 2) {
        const N1 = r.int(2, 12) * 50;
        const I1 = r.pick([0.2, 0.4, 0.5, 0.6, 0.8, 1, 1.2, 1.5]);
        if (r.next() < 0.5) {
          const N2 = r.int(2, 12) * 50;
          const I2 = roundHalfUp((N1 * I1) / N2, 3);
          if (Math.abs(I2 * N2 - N1 * I1) > 1e-6 || N2 === N1) return this.gen(level, r);
          return {
            text: `Tuljava z ${N1} ovoji ustvari pri toku $${qty(tx(I1), "A")}$ dovolj močno magnetno polje za ključavnico. ${name} jo zamenja s tuljavo enake dolžine z ${N2} ovoji. Kolikšen tok potrebuje za enako močno polje? Polje je sorazmerno s številom ovojev in s tokom.`,
            answer: num(I2, "A", null, [[roundHalfUp((N2 * I1) / N1, 3), "Več ovojev pomeni, da je za enako polje potreben manjši tok (obratno sorazmerje)."], [I1, "Število ovojev se je spremenilo, zato se mora spremeniti tudi tok."]]),
            hint: "Za enako polje mora ostati zmnožek $N \\cdot I$ enak.",
            data: { given: [`N_1 = ${N1}`, dat("I_1", tx(I1), "A"), `N_2 = ${N2}`], find: ["I_2"] },
            formula: ["N_1 \\cdot I_1 = N_2 \\cdot I_2", "I_2 = \\dfrac{N_1 \\cdot I_1}{N_2}"],
            solution: `Za enako polje: $N_1 \\cdot I_1 = N_2 \\cdot I_2 = ${N1} \\cdot ${tx(I1)}\\ \\mathrm{A} = ${tx(N1 * I1)}\\ \\mathrm{A}$\n$I_2 = \\dfrac{${tx(N1 * I1)}\\ \\mathrm{A}}{${N2}} = ${qty(tx(I2), "A")}$`,
          };
        }
        const N2 = r.int(2, 12) * 50;
        const I2 = r.pick([0.2, 0.4, 0.5, 0.6, 0.8, 1, 1.2, 1.5]);
        const ratio = (N2 * I2) / (N1 * I1);
        if (Math.abs(ratio - 1) < 1e-9) return this.gen(level, r);
        return {
          text: `Prva tuljava ima ${N1} ovojev in tok $${qty(tx(I1), "A")}$, druga enako dolga tuljava ima ${N2} ovojev in tok $${qty(tx(I2), "A")}$. Polje je sorazmerno s številom ovojev in s tokom. Kolikokrat je polje v drugi tuljavi močnejše od polja v prvi? Zaokroži na dve decimalki.`,
          answer: num(ratio, null, 2, [[1 / ratio, "Razmerje si obrnil: drugo polje deli s prvim."], [N2 / N1, "Upoštevati moraš tudi tok."], [I2 / I1, "Upoštevati moraš tudi število ovojev."]]),
          hint: "Polje je sorazmerno z zmnožkom $N \\cdot I$. Primerjaj zmnožka obeh tuljav.",
          data: { given: [`N_1 = ${N1}`, dat("I_1", tx(I1), "A"), `N_2 = ${N2}`, dat("I_2", tx(I2), "A")], find: ["\\dfrac{B_2}{B_1}"] },
          formula: ["\\dfrac{B_2}{B_1} = \\dfrac{N_2 \\cdot I_2}{N_1 \\cdot I_1}"],
          solution: `$N_1 \\cdot I_1 = ${N1} \\cdot ${tx(I1)}\\ \\mathrm{A} = ${tx(N1 * I1)}\\ \\mathrm{A}$, $N_2 \\cdot I_2 = ${N2} \\cdot ${tx(I2)}\\ \\mathrm{A} = ${tx(N2 * I2)}\\ \\mathrm{A}$\n$\\dfrac{B_2}{B_1} = \\dfrac{${tx(N2 * I2)}}{${tx(N1 * I1)}} ${res(ratio, 2)}$`,
        };
      }
      if (r.next() < 0.55) {
        const fN = r.pick([[2, "podvojimo"], [3, "potrojimo"], [0.5, "razpolovimo"]]);
        const fI = r.pick([[2, "dvakrat povečamo"], [3, "trikrat povečamo"], [0.5, "zmanjšamo na polovico"], [0.25, "zmanjšamo na četrtino"]]);
        const fL = r.pick([[2, "raztegnemo na dvakratno dolžino"], [0.5, "stisnemo na polovično dolžino"], [1, "pustimo enako dolgo"]]);
        const ratio = (fN[0] * fI[0]) / fL[0];
        if (ratio < 0.1 || ratio === 1) return this.gen(level, r);
        return {
          text: `Magnetno polje v dolgi tuljavi je sorazmerno s tokom in s številom ovojev na enoto dolžine. Število ovojev ${fN[1]} ($\\times ${tx(fN[0])}$), tok ${fI[1]} ($\\times ${tx(fI[0])}$), tuljavo pa ${fL[1]} ($\\times ${tx(fL[0])}$). Kolikokrat se spremeni magnetno polje? (Manj kot 1 pomeni, da polje oslabi.) Zaokroži na dve decimalki.`,
          answer: num(ratio, null, 2, [[fN[0] * fI[0], "Upoštevaj tudi dolžino: polje je odvisno od števila ovojev na enoto dolžine."], [fN[0] * fI[0] * fL[0], "Daljša tuljava ima ovoje bolj narazen, zato je polje šibkejše: z dolžino delimo."]]),
          hint: "Zapiši $B \\propto \\dfrac{N \\cdot I}{l}$ in vstavi faktorje, s katerimi se spremenijo $N$, $I$ in $l$.",
          data: { given: [`\\dfrac{N_2}{N_1} = ${tx(fN[0])}`, `\\dfrac{I_2}{I_1} = ${tx(fI[0])}`, `\\dfrac{l_2}{l_1} = ${tx(fL[0])}`], find: ["\\dfrac{B_2}{B_1}"] },
          formula: [fB, "\\dfrac{B_2}{B_1} = \\dfrac{N_2}{N_1} \\cdot \\dfrac{I_2}{I_1} \\cdot \\dfrac{l_1}{l_2}"],
          solution: `$\\dfrac{B_2}{B_1} = \\dfrac{N_2}{N_1} \\cdot \\dfrac{I_2}{I_1} \\cdot \\dfrac{l_1}{l_2} = ${tx(fN[0])} \\cdot ${tx(fI[0])} \\cdot \\dfrac{1}{${tx(fL[0])}}$\n$\\dfrac{B_2}{B_1} ${res(ratio, 2)}$`,
        };
      }
      const P = r.pick([
        { q: "Na odpadu dvigujejo staro železo z velikim elektromagnetom na žerjavu. Zakaj ne uporabijo trajnega magneta?", ok: "ker elektromagnet lahko izklopijo in železo spustijo, kjer želijo", wrong: [["ker trajni magnet železa ne privlači", "Trajni magnet železo privlači, a ga ne moremo izklopiti."], ["ker je elektromagnet vedno šibkejši", "Elektromagnet je lahko zelo močan."], ["ker elektromagnet ne potrebuje elektrike", "Elektromagnet deluje le, ko teče tok."]] },
        { q: "Skozi tuljavo teče enosmerni tok. Kako se obnaša magnetno polje tuljave?", ok: "kot polje paličastega magneta: en konec je severni, drugi južni pol", wrong: [["polja ni, ker tok teče v krogu", "Tok v ovojih ustvari magnetno polje."], ["oba konca sta severna pola", "Tuljava ima, kot vsak magnet, severni in južni pol."], ["polje je samo zunaj tuljave", "Najmočnejše in skoraj enakomerno je polje v notranjosti tuljave."]] },
        { q: "Kaj se zgodi, če skozi tuljavo elektromagneta teče izmenični tok, ki stalno spreminja smer?", ok: "pola se izmenično zamenjujeta", wrong: [["polje ostane stalno", "Ko tok spremeni smer, se obrne tudi polje."], ["polja sploh ni", "Polje je, a spreminja smer."], ["jedro se trajno namagneti", "Mehko železo sledi spremembam toka."]] },
      ]);
      return concept(r, {
        ...P,
        hint: "Tuljava s tokom je magnet: smer polja določa smer toka, moč pa tok, število ovojev in jedro.",
        given: [T("tuljava z železnim jedrom")],
        find: [T("razlaga")],
        formula: fB,
        sol: ["Elektromagnet deluje le, ko teče tok; ima severni in južni pol, ki se zamenjata, ko se obrne smer toka.", `Pravilno: ${P.ok}.`],
      });
    },
  },
  // ---------------------------------------------------------------- KEMIJA 8
  {
    id: "dod-os-varno-delo",
    topics: ["KEM-OS-8/varno-delo-v-laboratoriju"],
    gen(level, r) {
      const name = r.pick(NAMES);
      const PIC = [
        { d: "plamen", m: "vnetljiva snov", p: "se zelo hitro vžge (npr. etanol, bencin)" },
        { d: "plamen nad krogom", m: "oksidativna snov (pospešuje gorenje)", p: "pospešuje gorenje drugih snovi (npr. kalijev nitrat)" },
        { d: "eksplodirajoča bomba", m: "eksplozivna snov", p: "lahko eksplodira ob udarcu ali segrevanju" },
        { d: "lobanja s prekrižanima kostema", m: "akutno strupena snov", p: "je že v majhni količini smrtno strupena" },
        { d: "tekočini, ki kapljata na roko in na kovinsko ploščico in ju razjedata", m: "jedka snov", p: "razjeda kožo in kovine (npr. koncentrirana kislina)" },
        { d: "klicaj", m: "dražilna ali zdravju škodljiva snov", p: "draži kožo, oči ali dihala" },
        { d: "obris človeka z zvezdo na prsih", m: "resna nevarnost za zdravje (npr. rakotvorna snov)", p: "lahko povzroča raka ali trajne okvare organov" },
        { d: "odmrlo drevo in mrtva riba", m: "snov, nevarna za okolje", p: "je strupena za vodne organizme" },
        { d: "plinska jeklenka", m: "plin pod tlakom", p: "je plin, shranjen pod visokim tlakom" },
      ];
      if (level === 1) {
        const [ok, ...rest] = r.shuffle(PIC);
        const wrong = rest.slice(0, 3);
        if (r.next() < 0.5) {
          return concept(r, {
            q: `${r.pick([`${name} na steklenici v laboratoriju opazi`, "Na embalaži kemikalije je", "Na omari s kemikalijami je nalepljen"])} rdeče obrobljen piktogram: ${ok.d}. Kaj pomeni?`,
            ok: ok.m,
            wrong: wrong.map((w) => [w.m, `To pomeni piktogram »${w.d}«.`]),
            hint: "Spomni se devetih piktogramov za nevarne snovi. Slika pove, kaj snov lahko naredi.",
            given: [T(`piktogram: ${ok.d}`)],
            find: [T("pomen piktograma")],
            sol: [`Piktogram »${ok.d}« označuje: ${ok.m}.`, `Taka snov ${ok.p}.`],
          });
        }
        return concept(r, {
          q: `Snov ${ok.p}. Kateri piktogram mora biti na njeni embalaži?`,
          ok: ok.d,
          wrong: wrong.map((w) => [w.d, `Ta piktogram pomeni: ${w.m}.`]),
          hint: "Pomisli, kaj prikazuje slika na piktogramu in kakšno nevarnost označuje.",
          given: [`${T("tema")} = ${T("nevarne lastnosti snovi")}`],
          find: [T("piktogram")],
          sol: [`Snov, ki ${ok.p}, je ${ok.m}.`, `Označena je s piktogramom »${ok.d}«.`],
        });
      }
      if (level === 2) {
        if (r.next() < 0.45) {
          const V = r.pick([9, 12, 15, 18, 21, 24, 30]);
          const two = r.next() < 0.5;
          const x = two ? r.int(1, V / 3 - 1) : 0;
          return {
            text: two
              ? `Pri segrevanju sme biti epruveta napolnjena največ do tretjine. ${name} ima epruveto s prostornino $${qty(V, "mL")}$, v kateri je že $${qty(x, "mL")}$ raztopine. Največ koliko mL raztopine sme še doliti, preden jo segreva?`
              : `Pri segrevanju sme biti epruveta napolnjena največ do tretjine. Največ koliko mL tekočine sme biti v epruveti s prostornino $${qty(V, "mL")}$, ko jo segrevamo nad gorilnikom?`,
            answer: num(two ? V / 3 - x : V / 3, "mL", null, two ? [[V / 3, "Upoštevaj raztopino, ki je že v epruveti."], [V - x, "Epruveta sme biti pri segrevanju polna le do tretjine."]] : [[V / 2, "Pravilo pravi do tretjine, ne do polovice."], [(2 * V) / 3, "Do tretjine pomeni tretjino prostornine, ne dve tretjini."]]),
            hint: "Tretjina prostornine je prostornina, deljena s 3. Več tekočine bi pri vretju lahko brizgnilo iz epruvete.",
            data: { given: two ? [dat("V", V, "mL"), dat("V_0", x, "mL")] : [dat("V", V, "mL")], find: [two ? "V_{dod}" : "V_{max}"] },
            formula: two ? ["V_{max} = \\dfrac{V}{3}", "V_{dod} = V_{max} - V_0"] : ["V_{max} = \\dfrac{V}{3}"],
            solution: `$V_{max} = \\dfrac{V}{3} = \\dfrac{${V}\\ \\mathrm{mL}}{3} = ${qty(V / 3, "mL")}$${two ? `\n$V_{dod} = ${V / 3}\\ \\mathrm{mL} - ${x}\\ \\mathrm{mL} = ${qty(V / 3 - x, "mL")}$` : "\nZ manjšo količino tekočina ob vretju ne brizgne iz epruvete."}`,
          };
        }
        const P = r.pick([
          { q: `${name} kane na roko nekaj razredčene kisline. Kaj mora storiti?`, ok: "takoj izpirati mesto z obilo tekoče vode in obvestiti učitelja", wrong: [["kislino nevtralizirati z raztopino natrijevega hidroksida", "Baza je prav tako jedka in pri nevtralizaciji se sprošča toplota."], ["kislino obrisati s papirnato brisačo in nadaljevati delo", "Brisanje kisline ne odstrani in jo lahko razmaže."], ["počakati, da se kislina posuši", "Kislina med čakanjem še bolj poškoduje kožo."]] },
          { q: "Kako pravilno redčimo koncentrirano žveplovo(VI) kislino?", ok: "kislino počasi in med mešanjem vlivamo v vodo", wrong: [["vodo hitro vlijemo v kislino", "Voda na kislini zavre in jedka zmes brizga."], ["kislino in vodo hkrati vlijemo v čašo", "Varno je le vlivanje kisline v večjo količino vode."], ["kislino segrejemo in nato dolijemo vodo", "Segrevanje koncentrirane kisline je še nevarnejše."]] },
          { q: "Kako pravilno ugotovimo vonj snovi v laboratoriju?", ok: "z roko pahljamo pare od posode proti nosu", wrong: [["posodo približamo nosu in globoko vdihnemo", "Tako lahko vdihnemo veliko strupenih ali dražilnih par."], ["snov okusimo, če ne diši", "V laboratoriju snovi nikoli ne okušamo."], ["snov segrejemo, da močneje diši", "Segrevanje sprosti še več par."]] },
          { q: "Kako držimo epruveto, ko v njej segrevamo tekočino?", ok: "poševno, z odprtino stran od sebe in sošolcev", wrong: [["navpično, z odprtino proti sebi, da vidimo vsebino", "Vrela tekočina lahko brizgne v obraz."], ["z golo roko, da jo bolje čutimo", "Epruveto držimo s prijemalko, ker se segreje."], ["zaprto z zamaškom, da nič ne uide", "Zaprta epruveta lahko zaradi tlaka poči."]] },
          { q: "Kam damo ostanke kemikalij po poskusu?", ok: "v posebno posodo za odpadke, kot določi učitelj", wrong: [["vedno v odtok in speremo z vodo", "Mnoge kemikalije onesnažijo vodo ali reagirajo v odtoku."], ["nazaj v originalno steklenico", "Tako onesnažimo čisto kemikalijo v steklenici."], ["v smetnjak med papir", "Nekatere kemikalije so vnetljive ali strupene."]] },
          { q: `${name} razbije stekleno čašo. Kaj naredi?`, ok: "pove učitelju in črepinje pobere z metlico in smetišnico", wrong: [["črepinje pobere z golimi rokami", "Lahko se ureže; ostanki kemikalij pridejo v rano."], ["črepinje pusti na mizi do konca ure", "Nekdo se lahko ureže."], ["črepinje vrže v odtok", "Steklo zamaši odtok in je nevarno."]] },
          { q: "Kaj velja za hrano in pijačo v kemijski učilnici?", ok: "v laboratoriju ne jemo in ne pijemo", wrong: [["pijemo lahko, če pijača ni na delovni mizi", "Kemikalije lahko pridejo na roke in v usta."], ["jemo lahko, če si prej umijemo roke", "Hrana se lahko onesnaži s kemikalijami iz zraka in miz."], ["pijemo lahko iz laboratorijskih čaš", "Čaše so lahko onesnažene s kemikalijami."]] },
        ]);
        return concept(r, {
          ...P,
          hint: "Pomisli, kaj te najbolje zaščiti pred jedkimi, strupenimi ali vročimi snovmi.",
          given: [T("pravila varnega dela")],
          find: [T("pravilno ravnanje")],
          sol: ["Pri delu v laboratoriju najprej poskrbimo za varnost sebe in drugih ter vedno obvestimo učitelja o nezgodi.", `Pravilno: ${P.ok}.`],
        });
      }
      if (r.next() < 0.6) {
        const k = r.int(2, 9);
        const rev = r.next() < 0.4;
        if (rev) {
          const x = r.int(2, 20) * 5;
          const W = k * x;
          return {
            text: `Za poskus potrebuješ kislino, razredčeno v razmerju $1 : ${k}$ (en del kisline na ${k} ${k === 2 ? "dela" : k <= 4 ? "dele" : "delov"} vode). Imaš $${qty(x, "mL")}$ koncentrirane kisline. Koliko mL vode potrebuješ? Kaj vliješ v kaj?`,
            answer: num(W, "mL", null, [[x / k, "Na en del kisline pride več delov vode, zato je vode več kot kisline."], [(k + 1) * x, "To je skupna prostornina razredčene kisline."]]),
            hint: "En del je prostornina kisline. Vode je $k$-krat toliko.",
            data: { given: [`\\text{razmerje} = 1 : ${k}`, dat("V_k", x, "mL")], find: ["V_v"] },
            formula: ["V_v = k \\cdot V_k"],
            solution: `$V_v = ${k} \\cdot ${qty(x, "mL")} = ${qty(W, "mL")}$\nKislino počasi vlivamo v vodo, nikoli vode v kislino.`,
          };
        }
        const Vt = (k + 1) * r.int(2, 25) * 5;
        const Va = Vt / (k + 1);
        return {
          text: `${name} mora pripraviti $${qty(Vt, "mL")}$ kisline, razredčene v razmerju $1 : ${k}$ (en del kisline na ${k} ${k === 2 ? "dela" : k <= 4 ? "dele" : "delov"} vode). Koliko mL koncentrirane kisline potrebuje?`,
          answer: num(Va, "mL", null, [[Vt / k, `Vseh delov je ${k} + 1 = ${k + 1}, ne ${k}.`], [(k * Vt) / (k + 1), "To je prostornina vode. Vprašanje sprašuje po kislini."]]),
          hint: "Razredčena kislina ima skupaj $1 + k$ enakih delov. En del je kislina.",
          data: { given: [dat("V", Vt, "mL"), `\\text{razmerje} = 1 : ${k}`], find: ["V_k"] },
          formula: ["V_k = \\dfrac{V}{1 + k}"],
          solution: `Vseh delov je $1 + ${k} = ${k + 1}$.\n$V_k = \\dfrac{${Vt}\\ \\mathrm{mL}}{${k + 1}} = ${qty(Va, "mL")}$, vode je $${qty(Vt - Va, "mL")}$.\nKislino vlivamo v vodo.`,
        };
      }
      const P = r.pick([
        { q: "V posodi se vname olje. Kaj narediš?", ok: "posodo pokriješ s pokrovom ali gasilno odejo", wrong: [["oljem prilijemo vodo", "Voda pod vročim oljem v hipu zavre in razprši goreče olje."], ["v posodo pihamo", "S pihanjem dovajamo kisik in razpihamo ogenj."], ["posodo hitro odnesemo ven", "Med nošenjem se goreče olje lahko razlije."]] },
        { q: "V oko ti brizgne raztopina baze. Kaj narediš?", ok: "oko vsaj 15 minut izpiraš s čisto vodo (očesna prha) in obvestiš učitelja", wrong: [["oko izpereš z razredčeno kislino, da nevtraliziraš bazo", "Kislina oko še dodatno poškoduje."], ["močno pomežikaš in nadaljuješ delo", "Baza ostane v očesu in ga razjeda."], ["oko pokriješ z roko in počakaš", "Takojšnje izpiranje je najpomembnejše."]] },
        { q: "Iz razbitega termometra se razlije živo srebro. Kaj je prav?", ok: "obvestimo učitelja in prostor zračimo; kapljic ne sesamo s sesalnikom", wrong: [["kapljice posesamo s sesalnikom", "Sesalnik živo srebro razprši v strupene pare."], ["kapljice pometemo v odtok", "Živo srebro onesnaži vodo."], ["kapljice poberemo z golimi prsti", "Živo srebro je strupeno."]] },
        { q: "Zakaj v laboratoriju nosimo zaščitna očala, tudi ko le opazujemo poskus?", ok: "ker lahko kemikalija brizgne tudi do opazovalca", wrong: [["ker bolje vidimo spremembe barve", "Očala ne izboljšajo vida; ščitijo oči."], ["ker nas zaščitijo pred vonjem", "Pred parami očala ne ščitijo."], ["samo zato, ker tako zahteva šolski red", "Pravilo ima razlog: varuje oči pred brizgi."]] },
      ]);
      return concept(r, {
        ...P,
        hint: "Pomisli, kaj se zgodi s snovjo in kaj prepreči večjo škodo.",
        given: [T("nezgoda v laboratoriju")],
        find: [T("pravilno ravnanje")],
        sol: ["Ob nezgodi takoj ukrepamo tako, da ne povzročimo večje škode, in obvestimo učitelja.", `Pravilno: ${P.ok}.`],
      });
    },
  },
  {
    id: "dod-os-snovi-lastnosti",
    topics: ["KEM-OS-8/snovi-in-njihove-lastnosti"],
    gen(level, r) {
      const name = r.pick(NAMES);
      if (level === 1) {
        if (r.next() < 0.6) {
          const S = r.pick([
            ["destilirana voda", "c"], ["sladkor (saharoza)", "c"], ["kisik v jeklenki", "c"], ["kuhinjska sol (natrijev klorid)", "c"], ["čisto zlato", "c"], ["ogljikov dioksid", "c"], ["baker v žici", "c"],
            ["morska voda", "h"], ["zrak", "h"], ["sladkana voda", "h"], ["medenina (zlitina bakra in cinka)", "h"], ["kis", "h"], ["bron (zlitina bakra in kositra)", "h"],
            ["granit", "e"], ["pesek, premešan z vodo", "e"], ["olje in voda v kozarcu", "e"], ["juha z rezanci", "e"], ["müsli", "e"], ["zemlja z vrta", "e"], ["sadna solata", "e"],
          ]);
          const O = { c: "čista snov", h: "homogena zmes", e: "heterogena zmes" };
          const W = {
            c: "Čista snov je sestavljena iz ene same snovi in ima stalne lastnosti (npr. tališče).",
            h: "Homogena zmes je iz več snovi, ki jih niti z mikroskopom ne ločimo med seboj (raztopine, zlitine, zrak).",
            e: "V heterogeni zmesi sestavine vidimo ali jih ločimo že na pogled.",
          };
          return concept(r, {
            q: `${r.pick(["Razvrsti snov", `${name} razvršča snovi v kuhinji`, "Pri pouku razvrščamo snovi"])}: ${S[0]}. Kam spada?`,
            ok: O[S[1]],
            wrong: Object.keys(O).filter((x) => x !== S[1]).map((x) => [O[x], W[x]]),
            hint: "Ali je snov iz ene same snovi? Če ni, ali sestavine vidiš ločeno?",
            given: [`${T("snov")} = ${T(S[0])}`],
            find: [T("vrsta snovi")],
            sol: [W[S[1]], `${S[0][0].toUpperCase()}${S[0].slice(1)}: ${O[S[1]]}.`],
          });
        }
        const m = r.int(30, 200);
        const ms = r.int(5, m - 10);
        return {
          text: `${name} ima $${qty(m, "g")}$ zmesi peska in soli. Zmes raztopi v vodi, jo prefiltrira in filtrat izpari. Ostane $${qty(ms, "g")}$ soli. Koliko gramov peska je bilo v zmesi?`,
          answer: num(m - ms, "g", null, [[m + ms, "Masa zmesi je vsota mas sestavin; pesek dobiš z odštevanjem."], [ms, "To je masa soli."]]),
          hint: "Masa zmesi je vsota mas njenih sestavin.",
          data: { given: [dat("m_z", m, "g"), dat("m_{sol}", ms, "g")], find: ["m_{pesek}"] },
          formula: ["m_z = m_{sol} + m_{pesek}"],
          solution: `Sol se raztopi in gre skozi filter, pesek ostane na filtru.\n$m_{pesek} = m_z - m_{sol} = ${m}\\ \\mathrm{g} - ${ms}\\ \\mathrm{g} = ${qty(m - ms, "g")}$`,
        };
      }
      if (level === 2) {
        if (r.next() < 0.55) {
          const M = {
            f: "filtracija", i: "izparevanje (kristalizacija)", m: "ločevanje z magnetom", l: "ločevanje z lijem ločnikom", d: "destilacija", k: "kromatografija", s: "sejanje",
          };
          const W = {
            f: "S filtracijo ločimo netopno trdno snov od tekočine.",
            i: "Z izparevanjem iz raztopine dobimo raztopljeno trdno snov, topilo pa izgubimo.",
            m: "Z magnetom ločimo le snovi, ki jih magnet privlači (npr. železo).",
            l: "Z lijem ločnikom ločimo tekočini, ki se ne mešata.",
            d: "Z destilacijo ločimo tekočine z različnim vreliščem ali dobimo čisto topilo.",
            k: "S kromatografijo ločimo barvila ali druge raztopljene snovi v majhnih količinah.",
            s: "S sejanjem ločimo trdne delce različnih velikosti.",
          };
          const S = r.pick([
            ["pesek iz rečne vode", "f"], ["kuhinjsko sol iz slane vode", "i"], ["železne opilke iz zmesi z žveplom", "m"], ["olje iz zmesi z vodo", "l"], ["pitno vodo iz morske vode", "d"],
            ["barvila v črnem flomastru", "k"], ["kamenčke iz peska", "s"], ["čaj od čajnih lističev", "f"], ["alkohol iz zmesi z vodo", "d"], ["modro galico iz njene raztopine", "i"], ["bencin od vode po nesreči", "l"], ["žeblje iz žagovine", "m"],
          ]);
          const others = r.shuffle(Object.keys(M).filter((x) => x !== S[1])).slice(0, 3);
          return concept(r, {
            q: `S katerim postopkom najlaže ločimo ${S[0]}?`,
            ok: M[S[1]],
            wrong: others.map((x) => [M[x], W[x]]),
            hint: "Poišči lastnost, v kateri se sestavini razlikujeta: velikost delcev, topnost, vrelišče, magnetnost, mešanje s tekočino.",
            given: [`${T("ločujemo")} = ${T(S[0])}`],
            find: [T("postopek ločevanja")],
            sol: [W[S[1]], `Pravilno: ${M[S[1]]}.`],
          });
        }
        const m = r.int(40, 250);
        const mp = r.int(5, m - 5);
        const ms = m - mp;
        const w = (100 * ms) / m;
        return {
          text: `Zmes peska in soli ima maso $${qty(m, "g")}$. Po raztapljanju v vodi in filtraciji ostane na filtru $${qty(mp, "g")}$ suhega peska. Kolikšen je masni delež soli v zmesi? Odgovor zapiši v odstotkih in zaokroži na eno decimalko.`,
          answer: num(w, "%", 1, [[(100 * mp) / m, "To je delež peska. Najprej izračunaj maso soli."], [(100 * ms) / mp, "Maso soli deli z maso vse zmesi, ne z maso peska."]]),
          hint: "Najprej izračunaj maso soli. Delež je masa soli, deljena z maso zmesi.",
          data: { given: [dat("m_z", m, "g"), dat("m_{pesek}", mp, "g")], find: ["w_{sol}"] },
          formula: ["m_{sol} = m_z - m_{pesek}", "w_{sol} = \\dfrac{m_{sol}}{m_z} \\cdot 100\\ \\%"],
          solution: `$m_{sol} = ${m}\\ \\mathrm{g} - ${mp}\\ \\mathrm{g} = ${qty(ms, "g")}$\n$w_{sol} = \\dfrac{${ms}}{${m}} \\cdot 100\\ \\% ${res(w, 1, "\\%")}$`,
        };
      }
      if (r.next() < 0.5) {
        const D = [["aluminij", 2.7], ["cink", 7.14], ["železo", 7.87], ["baker", 8.96], ["svinec", 11.34], ["steklo", 2.5], ["srebro", 10.5], ["magnezij", 1.74]];
        const set = r.shuffle(D).slice(0, 4).sort((a, b) => a[1] - b[1]);
        const okE = r.pick(set);
        const V = r.int(4, 40);
        const m = roundHalfUp(okE[1] * V, 1);
        const rho = m / V;
        return concept(r, {
          q: `${name} najde kovinsko kocko. Na tehtnici izmeri maso $${qty(tx(m), "g")}$, z izpodrivanjem vode v menzuri pa prostornino $${qty(V, "cm^3")}$. Iz katere snovi je kocka? Gostote (v $\\mathrm{g/cm^3}$): ${set.map(([n, d]) => `${n} $${tx(d)}$`).join(", ")}.`,
          ok: okE[0],
          wrong: set.filter((x) => x !== okE).map(([n, d]) => [n, `Gostota snovi ${n} je ${tx(d).replace("{,}", ",")} g/cm³, tvoja izračunana gostota pa je ${tx(roundHalfUp(rho, 2), 2).replace("{,}", ",")} g/cm³.`]),
          hint: "Gostota je značilna lastnost čiste snovi. Izračunaj jo iz mase in prostornine in primerjaj s tabelo.",
          given: [dat("m", tx(m), "g"), dat("V", V, "cm^3")],
          find: ["\\rho", T("snov")],
          formula: "\\rho = \\dfrac{m}{V}",
          sol: [`$\\rho = \\dfrac{m}{V} = \\dfrac{${tx(m)}\\ \\mathrm{g}}{${V}\\ \\mathrm{cm^3}} ${res(rho, 2, "g/cm^3")}$`, `To se ujema z gostoto snovi ${okE[0]} (${tx(okE[1])} $\\mathrm{g/cm^3}$).`],
        });
      }
      const m = r.int(60, 300);
      const mFe = r.int(5, Math.floor(m / 3));
      const ms = r.int(5, Math.floor(m / 3));
      const mp = m - mFe - ms;
      const w = (100 * mp) / m;
      return {
        text: `Zmes železnih opilkov, soli in peska ima maso $${qty(m, "g")}$. ${name} z magnetom loči $${qty(mFe, "g")}$ opilkov, nato ostanek raztopi v vodi, prefiltrira in filtrat izpari, da dobi $${qty(ms, "g")}$ soli. Kolikšen je masni delež peska v zmesi? Zapiši v odstotkih, zaokroži na eno decimalko.`,
        answer: num(w, "%", 1, [[(100 * (m - mFe)) / m, "Odšteti moraš tudi maso soli."], [(100 * mp) / (m - mFe), "Delež računaj glede na maso celotne zmesi."]]),
        hint: "Pesek ostane na filtru. Njegovo maso dobiš, če od mase zmesi odšteješ maso opilkov in soli.",
        data: { given: [dat("m_z", m, "g"), dat("m_{Fe}", mFe, "g"), dat("m_{sol}", ms, "g")], find: ["w_{pesek}"] },
        formula: ["m_{pesek} = m_z - m_{Fe} - m_{sol}", "w = \\dfrac{m_{pesek}}{m_z} \\cdot 100\\ \\%"],
        solution: `$m_{pesek} = ${m} - ${mFe} - ${ms} = ${qty(mp, "g")}$\n$w_{pesek} = \\dfrac{${mp}}{${m}} \\cdot 100\\ \\% ${res(w, 1, "\\%")}$`,
      };
    },
  },
  {
    id: "dod-os-razporeditev-elektronov",
    topics: ["KEM-OS-8/razporeditev-elektronov"],
    gen(level, r) {
      const shellStr = (s) => s.join(", ");
      const askZ = (z) => EL20[z - 1];
      if (level === 1) {
        if (r.next() < 0.6) {
          const Z = r.int(3, 20);
          const [sym, , gen] = askZ(Z);
          const s = shells(Z);
          const k = r.int(0, 2);
          const q = ["Koliko lupin z elektroni ima", "Koliko elektronov je v zunanji lupini", "Koliko elektronov je v drugi lupini"][k];
          const val = [s.length, s[s.length - 1], s[1]][k];
          const mist = k === 0 ? [[Z, "To je število vseh elektronov, ne lupin."], [s[s.length - 1], "To je število zunanjih elektronov."]] : k === 1 ? [[Z, "To so vsi elektroni. V zunanji lupini je le del."], [s.length, "To je število lupin."], [8, "Polna druga in tretja lupina imata 8 elektronov, zunanja pa ni vedno polna."]] : [[Math.min(Z - 2, 18), "V drugi lupini je lahko največ 8 elektronov."], [Z, "To so vsi elektroni atoma."]];
          return {
            text: `${q} atom ${gen} ($\\mathrm{${sym}}$, $Z = ${Z}$)?`.replace(/lupini atom /, "lupini atoma "),
            answer: num(val, null, null, mist),
            hint: "Število elektronov je enako vrstnemu številu $Z$. Lupine polniš po vrsti: prva sprejme 2 elektrona, druga 8, tretja (do kalcija) 8.",
            data: { given: [`Z = ${Z}`], find: [T(["število lupin", "zunanji elektroni", "elektroni v 2. lupini"][k])] },
            formula: ["N(e^-) = Z", "\\text{lupine: } 2,\\ 8,\\ 8,\\ \\dots"],
            solution: `Atom ima $${Z}$ elektronov, razporejenih po lupinah: ${shellStr(s)}.\n${["Število lupin", "V zunanji lupini je", "V drugi lupini je"][k]}: $${val}$.`,
          };
        }
        const Z = r.int(9, 20);
        const [sym, nm] = askZ(Z);
        const s = shells(Z);
        const cand = [];
        cand.push([[8, Z - 8].filter((x) => x > 0), "V prvi lupini sta lahko največ 2 elektrona."]);
        if (Z > 10 && Z - 2 <= 18) cand.push([[2, Z - 2], "V drugi lupini je lahko največ 8 elektronov."]);
        cand.push([shells(Z + 1), `Vsota elektronov mora biti enaka $Z = ${Z}$.`]);
        cand.push([shells(Z - 1), `Vsota elektronov mora biti enaka $Z = ${Z}$.`]);
        if (Z >= 19) cand.push([[2, 8, Z - 10], "Pri kaliju in kalciju gre 19. elektron že v četrto lupino."]);
        const okS = shellStr(s);
        const wrong = [];
        for (const [c, why] of r.shuffle(cand)) if (shellStr(c) !== okS && !wrong.some((w) => w[0] === shellStr(c))) wrong.push([shellStr(c), why]);
        return concept(r, {
          q: `Katera razporeditev elektronov po lupinah je pravilna za atom elementa ${nm} ($\\mathrm{${sym}}$, $Z = ${Z}$)?`,
          ok: okS,
          wrong: wrong.slice(0, 3),
          hint: "Prva lupina sprejme 2 elektrona, druga 8, tretja (pri elementih do kalcija) 8. Vsota je enaka $Z$.",
          given: [`Z = ${Z}`],
          find: [T("razporeditev po lupinah")],
          formula: "\\text{lupine: } 2,\\ 8,\\ 8,\\ 2",
          sol: [`Elektronov je $${Z}$; polnimo po vrsti: ${okS}.`, `Pravilno: ${okS}.`],
        });
      }
      if (level === 2) {
        const Z = r.int(3, 20);
        const [sym, nm] = askZ(Z);
        const s = shells(Z);
        if (r.next() < 0.55) {
          return {
            text: `Atom ima elektrone razporejene po lupinah takole: ${shellStr(s)}. Kolikšno je vrstno število elementa? Kateri element je to?`,
            answer: num(Z, null, null, [[s[s.length - 1], "To je število zunanjih elektronov. Vrstno število je enako številu vseh elektronov."], [s.length, "To je število lupin (perioda)."]]),
            hint: "V nevtralnem atomu je elektronov toliko kot protonov, to pa je vrstno število.",
            data: { given: [T(`lupine: ${shellStr(s)}`)], find: ["Z"] },
            formula: ["Z = N(e^-) = \\text{vsota elektronov v lupinah}"],
            solution: `$Z = ${s.join(" + ")} = ${Z}$\nTo je ${nm} ($\\mathrm{${sym}}$): ${s.length}. perioda, ${s[s.length - 1]} zunanj${s[s.length - 1] === 1 ? "i elektron" : s[s.length - 1] === 2 ? "a elektrona" : s[s.length - 1] <= 4 ? "i elektroni" : "ih elektronov"}.`,
          };
        }
        const opts = [Z, Z + 1, Z - 1, Z + 8, Z - 8].filter((z) => z >= 1 && z <= 20);
        const [o1, ...os] = [Z, ...r.shuffle(opts.slice(1))];
        return concept(r, {
          q: `Kateri element ima elektrone razporejene po lupinah ${shellStr(s)}?`,
          ok: `${askZ(o1)[1]} (${askZ(o1)[0]})`,
          wrong: os.slice(0, 3).map((z) => [`${askZ(z)[1]} (${askZ(z)[0]})`, `Ta element ima razporeditev ${shellStr(shells(z))}.`]),
          hint: "Seštej elektrone vseh lupin, da dobiš vrstno število.",
          given: [T(`lupine: ${shellStr(s)}`)],
          find: [T("element")],
          formula: "Z = \\text{vsota elektronov v lupinah}",
          sol: [`$Z = ${s.join(" + ")} = ${Z}$`, `To je ${nm} ($\\mathrm{${sym}}$).`],
        });
      }
      const kk = r.int(0, 2);
      if (kk <= 1) {
        const Z = kk === 0 ? r.int(3, 20) : r.int(11, 20);
        const s = shells(Z);
        const p = s.length;
        const v = s[p - 1];
        const [sym, nm] = askZ(Z);
        const text = kk === 0
          ? `Element je v ${p}. periodi in ima ${v} ${v === 1 ? "zunanji elektron" : v === 2 ? "zunanja elektrona" : v <= 4 ? "zunanje elektrone" : "zunanjih elektronov"}. Kolikšno je njegovo vrstno število?`
          : `Atom ima v tretji lupini ${s[2]} ${s[2] === 1 ? "elektron" : s[2] === 2 ? "elektrona" : s[2] <= 4 ? "elektrone" : "elektronov"}${p === 4 ? `, v četrti pa ${s[3]}` : " in nobenega v četrti"}. Kolikšno je vrstno število?`;
        return {
          text,
          answer: num(Z, null, null, [[Z - 2, "Ne pozabi prve lupine z 2 elektronoma."], [kk === 0 ? p * v : s[2], kk === 0 ? "Vrstno število je vsota elektronov v vseh lupinah." : "Upoštevaj tudi notranji lupini (2 in 8 elektronov)."], [Z - 8, "Notranja druga lupina je polna (8 elektronov)."]]),
          hint: "Vse notranje lupine so polne: prva ima 2, druga 8 elektronov (tretja 8, če je element v 4. periodi). Prištej zunanje elektrone.",
          data: { given: kk === 0 ? [`\\text{perioda} = ${p}`, `N(\\text{zunanjih } e^-) = ${v}`] : [T(`3. lupina: ${s[2]}`)], find: ["Z"] },
          formula: ["Z = 2 + 8 + \\dots + N(\\text{zunanjih } e^-)"],
          solution: `${p}. perioda pomeni ${p} ${p === 2 ? "lupini" : "lupine"}; notranje so polne: ${s.slice(0, -1).join(", ")}.\nRazporeditev: ${shellStr(s)}\n$Z = ${s.join(" + ")} = ${Z}$ (${nm}, $\\mathrm{${sym}}$)`,
        };
      }
      const G = [["Li", "Na", "K"], ["Be", "Mg", "Ca"], ["C", "Si"], ["N", "P"], ["O", "S"], ["F", "Cl"], ["Ne", "Ar"]];
      const grp0 = r.pick(G);
      const [a, b] = r.shuffle(grp0).slice(0, 2);
      const Za = EL20.findIndex((e) => e[0] === a) + 1;
      const Zb = EL20.findIndex((e) => e[0] === b) + 1;
      const v = shells(Za).at(-1);
      const others = r.shuffle(Array.from({ length: 18 }, (_, i) => i + 3).filter((z) => shells(z).at(-1) !== v)).slice(0, 3);
      return concept(r, {
        q: `Kateri element ima enako število zunanjih elektronov kot ${EL20[Za - 1][1]} ($\\mathrm{${a}}$, $Z = ${Za}$) in ima zato podobne kemijske lastnosti?`,
        ok: `${EL20[Zb - 1][1]} (${b}, Z = ${Zb})`,
        wrong: others.map((z) => [`${EL20[z - 1][1]} (${EL20[z - 1][0]}, Z = ${z})`, `Ta element ima ${zunanji(shells(z).at(-1))}, ${EL20[Za - 1][1]} pa ${v}.`]),
        hint: "Napiši razporeditev elektronov za vse elemente in primerjaj zunanje lupine.",
        given: [`Z(\\mathrm{${a}}) = ${Za}`],
        find: [T("element z enakim številom zunanjih elektronov")],
        sol: [`${EL20[Za - 1][1]}: ${shellStr(shells(Za))}, ${EL20[Zb - 1][1]}: ${shellStr(shells(Zb))}.`, `Oba imata ${v} zunanjih elektronov; pravilno: ${EL20[Zb - 1][1]}.`],
      });
    },
  },
  {
    id: "dod-os-ionska-vez",
    topics: ["KEM-OS-8/ionska-vez"],
    gen(level, r) {
      const ION = { Li: 1, Na: 1, K: 1, Mg: 2, Ca: 2, Al: 3, F: -1, Cl: -1, O: -2, S: -2, N: -3 };
      const Zof = (s) => EL20.findIndex((e) => e[0] === s) + 1;
      const ionTex = (s, q) => `\\mathrm{${s}^{${Math.abs(q) === 1 ? "" : Math.abs(q)}${q > 0 ? "+" : "-"}}}`;
      const ionU = (s, q) => `${s}${Math.abs(q) === 1 ? "" : sup(String(Math.abs(q)))}${q > 0 ? "⁺" : "⁻"}`;
      const METALS = ["Li", "Na", "K", "Mg", "Ca", "Al"];
      const NONM = ["F", "Cl", "O", "S", "N"];
      if (level === 1) {
        if (r.next() < 0.6) {
          const s = r.pick(Object.keys(ION));
          const q = ION[s];
          const Z = Zof(s);
          const v = shells(Z).at(-1);
          return {
            text: `Kolikšen je naboj iona, ki ga tvori atom ${EL20[Z - 1][2]} ($\\mathrm{${s}}$, $Z = ${Z}$, ${v} ${v === 1 ? "zunanji elektron" : v === 2 ? "zunanja elektrona" : v <= 4 ? "zunanji elektroni" : "zunanjih elektronov"})? Zapiši s predznakom, npr. $+1$ ali $-2$.`,
            answer: num(q, null, null, q > 0 ? [[-q, "Kovina elektrone odda, zato postane pozitivna."], [8 - v, "Kovina ne sprejme elektronov do osmih; lažje odda zunanje elektrone."]] : [[v, "To je število zunanjih elektronov. Nekovina sprejme elektrone do osmih."], [-v, "Nekovina sprejme toliko elektronov, da jih ima v zunanji lupini 8."], [-q, "Nekovina elektrone sprejme, zato postane negativna."]]),
            hint: "Atom odda ali sprejme toliko elektronov, da dobi polno zunanjo lupino (8 elektronov). Oddani elektroni dajo pozitiven, sprejeti negativen naboj.",
            data: { given: [`Z = ${Z}`, `N(\\text{zunanjih } e^-) = ${v}`], find: [T("naboj iona")] },
            formula: q > 0 ? ["\\text{naboj} = +N(\\text{oddanih } e^-)"] : ["\\text{naboj} = -(8 - N(\\text{zunanjih } e^-))"],
            solution: q > 0
              ? `Atom ima ${v} zunanj${v === 1 ? "i elektron" : v === 2 ? "a elektrona" : "e elektrone"}, ki jih odda; prejšnja lupina postane polna.\nNastane ion $${ionTex(s, q)}$ z nabojem $+${q}$.`
              : `Atom ima ${v} zunanjih elektronov in sprejme še $8 - ${v} = ${-q}$.\nNastane ion $${ionTex(s, q)}$ z nabojem $${q}$.`,
          };
        }
        const m = r.pick(METALS);
        const n = r.pick(NONM);
        const nm = (s) => EL20[Zof(s) - 1][1];
        const [n1, n2] = r.shuffle(NONM.filter((x) => x !== n)).slice(0, 2);
        const [m1, m2] = r.shuffle(METALS.filter((x) => x !== m)).slice(0, 2);
        const noble = r.pick(["He", "Ne", "Ar"]);
        const wrongPool = [
          [`${nm(n1)} in ${nm(n2)}`, "Dve nekovini se povežeta s kovalentno vezjo (skupni elektronski pari)."],
          [`${nm(m1)} in ${nm(m2)}`, "Kovini tvorita zlitino s kovinsko vezjo, ne ionske spojine."],
          [`${nm(noble)} in ${nm(n1)}`, "Žlahtni plin ima polno zunanjo lupino in praviloma ne tvori spojin."],
        ];
        return concept(r, {
          q: r.pick(["Kateri par elementov se poveže z ionsko vezjo?", "Pri katerem paru elementov nastane ionska spojina?", "Atomi katerega para elementov si izmenjajo elektrone in tvorijo ione?"]),
          ok: `${nm(m)} in ${nm(n)}`,
          wrong: wrongPool,
          hint: "Ionska vez nastane med kovino, ki elektrone odda, in nekovino, ki jih sprejme.",
          given: [T("kovine in nekovine")],
          find: [T("par z ionsko vezjo")],
          sol: [`${nm(m)} je kovina in odda elektrone, ${nm(n)} je nekovina in jih sprejme; nastaneta iona $${ionTex(m, ION[m])}$ in $${ionTex(n, ION[n])}$.`, `Pravilno: ${nm(m)} in ${nm(n)}.`],
        });
      }
      const m = r.pick(METALS);
      const n = r.pick(NONM);
      const a = ION[m];
      const b = -ION[n];
      const gg = gcd(a, b);
      const x = b / gg;
      const y = a / gg;
      const nmM = EL20[Zof(m) - 1][1];
      const nmN = EL20[Zof(n) - 1][1];
      if (level === 2) {
        if (r.next() < 0.5) {
          const s = r.pick(Object.keys(ION));
          const q = ION[s];
          const Z = Zof(s);
          return {
            text: `Koliko elektronov ima ion $${ionTex(s, q)}$? Vrstno število elementa ${EL20[Z - 1][1]} je $${Z}$.`,
            answer: num(Z - q, null, null, [[Z, "To je število elektronov v nevtralnem atomu."], [Z + q, q > 0 ? "Pozitiven ion je elektrone oddal, zato jih ima manj kot atom." : "Negativen ion je elektrone sprejel, zato jih ima več kot atom."]]),
            hint: "Pozitiven naboj pomeni, da je atom elektrone oddal; negativen, da jih je sprejel. Število protonov se ne spremeni.",
            data: { given: [`Z = ${Z}`, `\\text{naboj} = ${Math.abs(q) === 1 ? "" : Math.abs(q)}${q > 0 ? "+" : "-"}`], find: ["N(e^-)"] },
            formula: ["N(e^-) = Z - \\text{naboj}"],
            solution: `Atom ima $${Z}$ elektronov. ${q > 0 ? `Oddal je ${q}` : `Sprejel je ${-q}`}.\n$N(e^-) = ${Z} ${q > 0 ? "-" : "+"} ${Math.abs(q)} = ${Z - q}$`,
          };
        }
        return {
          text: `${nmM[0].toUpperCase()}${nmM.slice(1)} tvori ion $${ionTex(m, a)}$, ${nmN} pa ion $${ionTex(n, -b)}$. Koliko kationov in koliko anionov je v formulski enoti njune ionske spojine? Vpiši obe števili, ločeni z vejico (najprej kationi).`,
          answer: { type: "coefficients", values: [x, y] },
          inputHint: "npr. 1, 2",
          hint: "Spojina je nevtralna: skupni pozitivni naboj mora biti enak skupnemu negativnemu. Poišči najmanjši skupni večkratnik nabojev.",
          data: { given: [`\\text{kation: } ${ionTex(m, a)}`, `\\text{anion: } ${ionTex(n, -b)}`], find: ["x,\\ y"] },
          formula: [`x \\cdot (+${a}) + y \\cdot (-${b}) = 0`],
          solution: `Najmanjši skupni večkratnik nabojev ${a} in ${b} je ${(a * b) / gg}.\nKationi: $x = \\dfrac{${(a * b) / gg}}{${a}} = ${x}$, anioni: $y = \\dfrac{${(a * b) / gg}}{${b}} = ${y}$\nFormula: $${ch(`${m}${x > 1 ? x : ""}${n}${y > 1 ? y : ""}`)}$`,
        };
      }
      if (r.next() < 0.6) {
        const askE = r.next() < 0.5;
        const f = ch(`${m}${x > 1 ? x : ""}${n}${y > 1 ? y : ""}`);
        return {
          text: askE
            ? `Pri nastanku ionske spojine $${f}$ iz atomov elementov ${nmM} in ${nmN} preidejo elektroni od kovine k nekovini. Koliko elektronov preide pri nastanku ene formulske enote?`
            : `Iz koliko ionov je sestavljena ena formulska enota spojine $${f}$ (${nmM} in ${nmN})?`,
          answer: askE ? num(x * a, null, null, [[a, `To odda en atom kovine; v formulski enoti ${x === 1 ? "je" : "so"} ${x} ${x === 1 ? "atom" : "atomi"}.`], [x + y, "To je število ionov. Šteti moraš elektrone, ki preidejo."]]) : num(x + y, null, null, [[x * a, "To je število prenesenih elektronov."], [2, "Šteti moraš vse ione, ne le vrste ionov."]]),
          hint: "Najprej ugotovi naboja ionov, nato iz formule preberi, koliko je katerih ionov.",
          data: { given: [`\\text{spojina: } ${f}`], find: [askE ? "N(e^-)" : "N(\\text{ionov})"] },
          formula: askE ? ["N(e^-) = x \\cdot \\text{naboj kationa}"] : ["N(\\text{ionov}) = x + y"],
          solution: `Iona: $${ionTex(m, a)}$ in $${ionTex(n, -b)}$; v formulski enoti je ${x} kation${x === 1 ? "" : x === 2 ? "a" : "i"} in ${y} anion${y === 1 ? "" : y === 2 ? "a" : "i"}.\n${askE ? `Vsak atom kovine odda ${a} elektron${a === 1 ? "" : a === 2 ? "a" : "e"}: $N(e^-) = ${x} \\cdot ${a} = ${x * a}$` : `$N = ${x} + ${y} = ${x + y}$`}`,
        };
      }
      const P = r.pick([
        { q: "Kdaj trdna kuhinjska sol (natrijev klorid) prevaja električni tok?", ok: "ko je raztopljena v vodi ali staljena", wrong: [["vedno, ker je iz ionov", "V trdni soli so ioni trdno vezani v kristalu in se ne morejo premikati."], ["nikoli", "V raztopini ali talini se ioni prosto gibljejo in prevajajo tok."], ["samo kot suh kristal", "V trdnem kristalu se ioni ne premikajo."]] },
        { q: "Zakaj imajo ionske spojine visoko tališče?", ok: "ker so ioni v kristalu povezani z močnimi privlačnimi silami", wrong: [["ker so iz kovin", "Ionske spojine so iz kovine in nekovine; tališče je visoko zaradi ionske vezi."], ["ker so molekule zelo velike", "Ionske spojine niso iz molekul, ampak iz ionov."], ["ker vsebujejo vodo", "Visoko tališče je posledica privlačnih sil med ioni."]] },
        { q: `Kako je zgrajen kristal ionske spojine ${EL20[Zof(m) - 1][2]} in ${EL20[Zof(n) - 1][2]}?`, ok: "iz pozitivnih in negativnih ionov, ki se izmenjujejo v kristalni mreži", wrong: [["iz molekul z dvema atomoma", "Ionske spojine ne tvorijo molekul."], ["iz nevtralnih atomov kovine in nekovine", "Atomi so si izmenjali elektrone in postali ioni."], ["iz samih pozitivnih ionov in prostih elektronov", "To je zgradba kovine."]] },
      ]);
      return concept(r, {
        ...P,
        hint: "Ionska spojina je zgrajena iz ionov, ki se močno privlačijo v kristalni mreži.",
        given: [T("ionska spojina")],
        find: [T("lastnost ali zgradba")],
        sol: ["Ionske spojine so kristali iz pozitivnih in negativnih ionov, ki se močno privlačijo; tok prevajajo le, ko se ioni lahko gibljejo.", `Pravilno: ${P.ok}.`],
      });
    },
  },
  {
    id: "dod-os-kovalentna-vez",
    topics: ["KEM-OS-8/kovalentna-vez"],
    gen(level, r) {
      // formula, ime (rodilnik), vezni pari, nevezni pari, valenčni elektroni, H-atomov
      const MOL = [
        ["H2", "vodika", 1, 0, 2, 2], ["Cl2", "klora", 1, 6, 14, 0], ["F2", "fluora", 1, 6, 14, 0], ["O2", "kisika", 2, 4, 12, 0], ["N2", "dušika", 3, 2, 10, 0],
        ["HCl", "vodikovega klorida", 1, 3, 8, 1], ["HF", "vodikovega fluorida", 1, 3, 8, 1], ["H2O", "vode", 2, 2, 8, 2], ["H2S", "vodikovega sulfida", 2, 2, 8, 2],
        ["NH3", "amonijaka", 3, 1, 8, 3], ["CH4", "metana", 4, 0, 8, 4], ["CO2", "ogljikovega dioksida", 4, 4, 16, 0], ["CCl4", "tetraklorometana", 4, 12, 32, 0], ["HCN", "vodikovega cianida", 4, 1, 10, 1],
      ];
      const atoms = (f) => Object.values(parseFormula(f)).reduce((a, b) => a + b, 0);
      if (level === 1) {
        if (r.next() < 0.55) {
          const [s, n, gr] = r.pick([["H", 1, 1], ["O", 2, 16], ["N", 3, 15], ["C", 4, 14], ["Cl", 1, 17], ["S", 2, 16], ["F", 1, 17], ["P", 3, 15]]);
          const v = s === "H" ? 1 : gr - 10;
          const Z = EL20.findIndex((e) => e[0] === s) + 1;
          return {
            text: `Koliko kovalentnih vezi (skupnih elektronskih parov) praviloma tvori atom ${EL20[Z - 1][2]} ($\\mathrm{${s}}$, ${gr}. skupina) v molekulah?`,
            answer: num(n, null, null, [[v, "To je število zunanjih elektronov. Atom tvori toliko vezi, kolikor elektronov mu manjka do polne lupine."]]),
            hint: s === "H" ? "Vodik ima en elektron, do polne prve lupine mu manjka še eden." : "Atom tvori toliko skupnih parov, kolikor elektronov mu manjka do osmih v zunanji lupini.",
            data: { given: [`\\text{skupina} = ${gr}`, `N(\\text{zunanjih } e^-) = ${v}`], find: [T("število vezi")] },
            formula: s === "H" ? ["N(\\text{vezi}) = 2 - 1"] : ["N(\\text{vezi}) = 8 - N(\\text{zunanjih } e^-)"],
            solution: s === "H" ? "Vodiku do polne prve lupine (2 elektrona) manjka en elektron.\nTvori 1 vez." : `Atom ima ${v} zunanjih elektronov; do osmih mu jih manjka $8 - ${v} = ${n}$.\nTvori ${n} ${n === 1 ? "vez" : n === 2 ? "vezi" : "vezi"}.`,
          };
        }
        const cov = r.pick(["H2O", "CO2", "CH4", "NH3", "HCl", "O2", "Cl2", "N2"]);
        const ion = r.shuffle(["NaCl", "MgO", "KBr", "CaCl2", "Na2O", "LiF"]).slice(0, 2);
        const metal = r.pick(["Fe", "Cu", "Al"]);
        return concept(r, {
          q: r.pick(["V kateri snovi so atomi povezani s kovalentnimi vezmi?", "Katera snov je zgrajena iz molekul s kovalentnimi vezmi?", "Kje so atomi povezani s skupnimi elektronskimi pari?"]),
          ok: plain(`$${ch(cov)}$`),
          wrong: [...ion.map((f) => [plain(`$${ch(f)}$`), "To je spojina kovine in nekovine, zato ima ionsko vez."]), [metal, "To je kovina; atomi so povezani s kovinsko vezjo."]],
          hint: "Kovalentna vez nastane med atomi nekovin, ki si delijo elektronske pare.",
          given: [`${T("tema")} = ${T("kovalentna, ionska in kovinska vez")}`],
          find: [T("snov s kovalentno vezjo")],
          sol: ["Kovalentno vez tvorijo nekovine (skupni elektronski pari); kovina z nekovino tvori ionsko vez.", `Pravilno: $${ch(cov)}$.`],
        });
      }
      const M = r.pick(MOL);
      const [f, gen, vp, np, ve] = M;
      if (level === 2) {
        const askLone = r.next() < 0.5 && np > 0;
        const val = askLone ? np : vp;
        const nAt = atoms(f);
        return {
          text: askLone
            ? `Nariši Lewisovo formulo molekule ${gen} ($${ch(f)}$). Koliko neveznih (prostih) elektronskih parov ima molekula?`
            : `Nariši Lewisovo formulo molekule ${gen} ($${ch(f)}$). Koliko veznih (skupnih) elektronskih parov je v molekuli?`,
          answer: num(val, null, null, askLone ? [[2 * np, "To je število neveznih elektronov. Vprašanje sprašuje po parih."], [vp, "To so vezni pari."]] : [[nAt - 1, "Dvojna vez sta dva skupna para, trojna pa trije."], [2 * vp, "To je število veznih elektronov, ne parov."]]),
          hint: "Za vsak atom zapiši zunanje elektrone kot pike. Atomi si delijo pare tako, da ima vsak 8 elektronov (vodik 2).",
          data: { given: [`\\text{molekula: } ${ch(f)}`], find: [askLone ? T("nevezni pari") : T("vezni pari")] },
          formula: ["N(\\text{zunanjih } e^-) = 2 \\cdot (N_{vezni} + N_{nevezni})"],
          solution: `Vseh zunanjih elektronov je ${ve}, torej je elektronskih parov $${ve / 2}$.\nV Lewisovi formuli: veznih parov ${vp}, neveznih ${np}.\n${askLone ? `Neveznih parov: $${np}$` : `Veznih parov: $${vp}$`}`,
        };
      }
      if (r.next() < 0.55) {
        return {
          text: `Koliko zunanjih (valenčnih) elektronov skupaj nariše ${r.pick(NAMES)} v Lewisovi formuli molekule ${gen} ($${ch(f)}$)? Število zunanjih elektronov posameznega atoma preberi iz skupine v periodnem sistemu.`,
          answer: num(ve, null, null, [[ve / 2, "To je število elektronskih parov, ne elektronov."], [Object.entries(parseFormula(f)).reduce((s2, [e, k]) => s2 + k * (EL20.findIndex((x) => x[0] === e) + 1), 0), "To so vsi elektroni (vsota vrstnih števil), ne le zunanji."], [ve - M[5], "Upoštevaj tudi elektrone vodikovih atomov."]]),
          hint: "Za vsak atom v molekuli seštej njegove zunanje elektrone (H: 1, C: 4, N: 5, O in S: 6, F in Cl: 7).",
          data: { given: [`\\text{molekula: } ${ch(f)}`], find: [T("število zunanjih elektronov")] },
          formula: ["N = \\sum N(\\text{zunanjih } e^-)\\ \\text{vseh atomov}"],
          solution: `$N = ${Object.entries(parseFormula(f)).map(([e, k]) => `${k} \\cdot ${VAL[e]}`).join(" + ")} = ${ve}$\nElektronskih parov je $${ve / 2}$ (veznih ${vp}, neveznih ${np}).`,
        };
      }
      const B = r.pick([
        ["N2", "dušika", "trojna vez"], ["O2", "kisika", "dvojna vez"], ["Cl2", "klora", "enojna vez"], ["H2", "vodika", "enojna vez"], ["F2", "fluora", "enojna vez"],
        ["C2H4", "etena med atomoma ogljika", "dvojna vez"], ["C2H2", "etina med atomoma ogljika", "trojna vez"], ["C2H6", "etana med atomoma ogljika", "enojna vez"], ["CO2", "ogljikovega dioksida med ogljikom in kisikom", "dvojna vez"],
      ]);
      const O = { "enojna vez": "en skupni par", "dvojna vez": "dva skupna para", "trojna vez": "trije skupni pari" };
      return concept(r, {
        q: `Kakšna vez je v molekuli ${B[1]} ($${ch(B[0])}$)?`,
        ok: `${B[2]} (${O[B[2]]})`,
        wrong: Object.keys(O).filter((x) => x !== B[2]).map((x) => [`${x} (${O[x]})`, `Preštej, koliko elektronov manjka vsakemu atomu do osmih: toliko parov si delita.`]).concat([["ionska vez", "Med atomoma nekovin ne nastane ionska vez."]]),
        hint: "Ugotovi, koliko elektronov manjka atomu do osmih (vodiku do dveh). Toliko skupnih parov mora imeti.",
        given: [`\\text{molekula: } ${ch(B[0])}`],
        find: [T("vrsta vezi")],
        sol: [`V Lewisovi formuli ima vsak atom 8 elektronov (vodik 2), če je med atomoma ${O[B[2]]}.`, `Pravilno: ${B[2]}.`],
      });
    },
  },
  {
    id: "dod-os-formule-spojin",
    topics: ["KEM-OS-8/formule-spojin"],
    gen(level, r) {
      const name = r.pick(NAMES);
      const countAll = (f) => Object.values(parseFormula(f)).reduce((a, b) => a + b, 0);
      if (level === 1) {
        if (r.next() < 0.55) {
          const f = r.pick(["H2O", "CO2", "NH3", "CH4", "H2SO4", "HNO3", "CaCO3", "NaHCO3", "C6H12O6", "Na2CO3", "KMnO4", "H3PO4", "Al2O3", "Fe2O3", "C2H6O", "H2O2"]);
          const comp = parseFormula(f);
          const els = Object.keys(comp);
          const askEl = r.next() < 0.5;
          const e = r.pick(els);
          const naive = f.replace(/[A-Z][a-z]?(\d*)/g, (_, d) => (d ? "+" + d : "")).split("+").filter(Boolean).reduce((a, b) => a + Number(b), 0);
          return {
            text: askEl
              ? `Koliko atomov elementa $\\mathrm{${e}}$ je v eni ${/^(H2O|CO2|NH3|CH4|C6H12O6|C2H6O|H2O2|H2SO4|HNO3|H3PO4)$/.test(f) ? "molekuli" : "formulski enoti"} $${ch(f)}$?`
              : `Iz koliko atomov je sestavljena ena ${/^(H2O|CO2|NH3|CH4|C6H12O6|C2H6O|H2O2|H2SO4|HNO3|H3PO4)$/.test(f) ? "molekula" : "formulska enota"} $${ch(f)}$?`,
            answer: askEl ? num(comp[e], null, null, [[1, "Indeks za simbolom pove, koliko je atomov."], [countAll(f), "To so vsi atomi; šteti moraš le atome tega elementa."]]) : num(countAll(f), null, null, [[els.length, "To je število različnih elementov, ne atomov."], [naive, "Kjer ni indeksa, je en atom; tudi tega moraš šteti."]]),
            hint: "Indeks za simbolom pove, koliko atomov tega elementa je v formuli. Simbol brez indeksa pomeni en atom.",
            data: { given: [`\\text{formula: } ${ch(f)}`], find: [askEl ? `N(\\mathrm{${e}})` : "N(\\text{atomov})"] },
            formula: ["N = \\sum \\text{indeksov (brez indeksa} = 1)"],
            solution: `V formuli $${ch(f)}$: ${els.map((x) => `${x}: ${comp[x]}`).join(", ")}.\n${askEl ? `$N(\\mathrm{${e}}) = ${comp[e]}$` : `$N = ${els.map((x) => comp[x]).join(" + ")} = ${countAll(f)}$`}`,
          };
        }
        const N = r.pick([
          ["NaCl", "natrijev klorid", [["natrijev klorat", "Klorat vsebuje še kisik; NaCl je klorid."], ["klorov natrid", "Najprej imenujemo kovino, nato nekovino s končnico -id."], ["natrijev diklorid", "V NaCl je en klorov atom; pri ionskih spojinah ne uporabljamo predpon."]]],
          ["MgO", "magnezijev oksid", [["magnezijev hidroksid", "Hidroksid vsebuje skupino OH."], ["manganov oksid", "Mg je magnezij, Mn je mangan."], ["kisikov magnezid", "Najprej kovina, nato nekovina s končnico -id."]]],
          ["CO", "ogljikov oksid", [["ogljikov dioksid", "Ogljikov dioksid ima dva kisikova atoma (CO₂)."], ["kobaltov oksid", "Co (kobalt) se piše z malo črko o; CO je ogljik in kisik."], ["ogljikova kislina", "Kislina vsebuje vodik."]]],
          ["CO2", "ogljikov dioksid", [["ogljikov oksid", "V CO₂ sta dva kisikova atoma: di-oksid."], ["ogljikov trioksid", "Indeks 2 pomeni predpono di-."], ["dikisikov ogljik", "Najprej imenujemo ogljik, nato kisik (oksid)."]]],
          ["Al2O3", "aluminijev oksid", [["aluminijev trioksid", "Pri ionskih spojinah kovin s stalnim nabojem predpon ne pišemo."], ["dialuminijev oksid", "Pri ionskih spojinah predpon ne uporabljamo."], ["aluminijev hidroksid", "Hidroksid vsebuje skupino OH."]]],
          ["FeCl3", "železov(III) klorid", [["železov(II) klorid", "Trije kloridni ioni (Cl⁻) pomenijo železov ion Fe³⁺."], ["železov triklorat", "Klorat vsebuje kisik; tu je klorid."], ["fluorov klorid", "Fe je simbol za železo."]]],
          ["CaS", "kalcijev sulfid", [["kalcijev sulfat", "Sulfat vsebuje še kisik (SO₄²⁻)."], ["kalijev sulfid", "Ca je kalcij, K je kalij."], ["ogljikov sulfid", "Ca je kalcij, ne ogljik."]]],
          ["K2O", "kalijev oksid", [["kalcijev oksid", "K je kalij, Ca je kalcij."], ["dikalijev dioksid", "V K₂O je en kisikov atom; pri ionskih spojinah predpon ne pišemo."], ["kalijev peroksid", "Peroksid bi imel dva kisikova atoma (K₂O₂)."]]],
          ["SO2", "žveplov dioksid", [["žveplov oksid", "Indeks 2 pri kisiku pomeni di-oksid."], ["natrijev oksid", "S je žveplo, Na je natrij."], ["žveplova kislina", "Kislina vsebuje vodik."]]],
          ["CuO", "bakrov(II) oksid", [["bakrov(I) oksid", "Bakrov(I) oksid je Cu₂O; v CuO ima baker naboj 2+."], ["kobaltov oksid", "Cu je baker."], ["bakrov dioksid", "V CuO je en kisikov atom."]]],
        ]);
        return concept(r, {
          q: r.pick([`Kako se imenuje spojina s formulo $${ch(N[0])}$?`, `${name} na nalepki prebere formulo $${ch(N[0])}$. Kako se imenuje spojina?`, `Poimenuj spojino $${ch(N[0])}$.`]),
          ok: N[1],
          wrong: N[2],
          hint: "Najprej imenujemo kovino (pridevnik, npr. natrijev), nato nekovino s končnico -id. Pri kovalentnih spojinah nekovin število atomov povemo s predponami (di-, tri-).",
          given: [`\\text{formula: } ${ch(N[0])}`],
          find: [T("ime spojine")],
          sol: [`$${ch(N[0])}$ je ${N[1]}.`, "Ime: najprej prvi element v pridevniški obliki, nato drugi element s končnico -id."],
        });
      }
      if (level === 2) {
        if (r.next() < 0.5) {
          const P = r.pick([["Na", 1, "O", -2], ["Mg", 2, "Cl", -1], ["Al", 3, "Cl", -1], ["K", 1, "S", -2], ["Al", 3, "O", -2], ["Mg", 2, "N", -3], ["Ca", 2, "F", -1], ["Li", 1, "N", -3], ["Al", 3, "S", -2], ["Ca", 2, "O", -2], ["Na", 1, "N", -3], ["Ba", 2, "Cl", -1]]);
          const [m, a, n, qb] = P;
          const b = -qb;
          const gg = gcd(a, b);
          const x = b / gg;
          const y = a / gg;
          const it = (s, q) => `\\mathrm{${s}^{${Math.abs(q) === 1 ? "" : Math.abs(q)}${q > 0 ? "+" : "-"}}}`;
          return {
            text: `Kovina tvori ion $${it(m, a)}$, nekovina pa ion $${it(n, qb)}$. Napiši formulo spojine v obliki $\\mathrm{${m}}_x\\mathrm{${n}}_y$: vpiši najmanjša indeksa $x$ in $y$, ločena z vejico.`,
            answer: { type: "coefficients", values: [x, y] },
            inputHint: "npr. 1, 2",
            hint: "Spojina je električno nevtralna. Indeksa izberi tako, da je skupni pozitivni naboj enak skupnemu negativnemu (križno pravilo).",
            data: { given: [`\\text{kation: } ${it(m, a)}`, `\\text{anion: } ${it(n, qb)}`], find: ["x,\\ y"] },
            formula: [`x \\cdot (+${a}) + y \\cdot (-${b}) = 0`],
            solution: `Najmanjši skupni večkratnik nabojev ${a} in ${b} je ${(a * b) / gg}.\n$x = ${(a * b) / gg} : ${a} = ${x}$, $y = ${(a * b) / gg} : ${b} = ${y}$\nFormula: $${ch(`${m}${x > 1 ? x : ""}${n}${y > 1 ? y : ""}`)}$`,
          };
        }
        const f = r.pick(["Ca(OH)2", "Mg(NO3)2", "Al2(SO4)3", "(NH4)2SO4", "Ca3(PO4)2", "Fe(OH)3", "Al(OH)3", "Cu(NO3)2", "Ba(OH)2", "(NH4)3PO4"]);
        const comp = parseFormula(f);
        const els = Object.keys(comp);
        const askEl = r.next() < 0.5;
        const e = r.pick(Object.keys(parseFormula(f.match(/\(([^)]+)\)/)[1])));
        const noBr = parseFormula(f.replace(/\)(\d+)/g, ")"));
        return {
          text: askEl ? `Koliko atomov elementa $\\mathrm{${e}}$ je v eni formulski enoti $${ch(f)}$?` : `Iz koliko atomov je sestavljena ena formulska enota $${ch(f)}$?`,
          answer: askEl ? num(comp[e], null, null, [[noBr[e], "Indeks za oklepajem pomnoži vse atome v oklepaju."]]) : num(countAll(f), null, null, [[Object.values(noBr).reduce((a2, b2) => a2 + b2, 0), "Indeks za oklepajem pomnoži vse atome v oklepaju."], [els.length, "To je število različnih elementov."]]),
          hint: "Indeks za oklepajem pomnoži vsak atom v oklepaju. Nato seštej.",
          data: { given: [`\\text{formula: } ${ch(f)}`], find: [askEl ? `N(\\mathrm{${e}})` : "N(\\text{atomov})"] },
          formula: ["(\\mathrm{XY})_n:\\ n \\cdot \\mathrm{X},\\ n \\cdot \\mathrm{Y}"],
          solution: `V $${ch(f)}$: ${els.map((x) => `${x}: ${comp[x]}`).join(", ")}.\n${askEl ? `$N(\\mathrm{${e}}) = ${comp[e]}$` : `$N = ${els.map((x) => comp[x]).join(" + ")} = ${countAll(f)}$`}`,
        };
      }
      if (r.next() < 0.5) {
        const k = r.int(2, 6);
        const f = r.pick(["H2SO4", "H2O", "CO2", "HNO3", "NaOH", "CaCO3", "Ca(OH)2", "Al2O3", "NH3", "H3PO4"]);
        const comp = parseFormula(f);
        const e = r.pick(Object.keys(comp));
        const askAll = r.next() < 0.4;
        const val = askAll ? k * countAll(f) : k * comp[e];
        return {
          text: askAll ? `Koliko atomov je skupaj v $${k}\\,${ch(f)}$?` : `Koliko atomov elementa $\\mathrm{${e}}$ je v $${k}\\,${ch(f)}$?`,
          answer: num(val, null, null, askAll ? [[countAll(f), "Koeficient pred formulo pove, koliko je molekul (formulskih enot); pomnoži z njim."], [k + countAll(f), "Koeficient množi, ne prišteva."]] : [[comp[e], "Koeficient pred formulo pomnoži vse atome v formuli."], [k * countAll(f), "To so vsi atomi; šteti moraš le atome tega elementa."], [k + comp[e], "Koeficient množi, ne prišteva."]]),
          hint: "Koeficient pred formulo pove število molekul (formulskih enot), indeks pa število atomov v eni.",
          data: { given: [`${T("zapis")} = ${k}\\,${ch(f)}`], find: [askAll ? "N(\\text{atomov})" : `N(\\mathrm{${e}})`] },
          formula: ["N = \\text{koeficient} \\cdot \\text{indeks}"],
          solution: `V eni ${/OH|CO3|O3/.test(f) ? "formulski enoti" : "molekuli"} $${ch(f)}$ je ${askAll ? `${countAll(f)} atomov` : `${comp[e]} atom${comp[e] === 1 ? "" : comp[e] === 2 ? "a" : comp[e] <= 4 ? "i" : "ov"} ${e}`}.\n$N = ${k} \\cdot ${askAll ? countAll(f) : comp[e]} = ${val}$`,
        };
      }
      const P = r.pick([
        ["železov(III) oksid", "Fe", "O", 3, 2], ["bakrov(II) klorid", "Cu", "Cl", 2, 1], ["bakrov(I) oksid", "Cu", "O", 1, 2], ["železov(II) klorid", "Fe", "Cl", 2, 1], ["manganov(IV) oksid", "Mn", "O", 4, 2],
        ["kromov(III) oksid", "Cr", "O", 3, 2], ["železov(III) klorid", "Fe", "Cl", 3, 1], ["aluminijev sulfid", "Al", "S", 3, 2], ["magnezijev nitrid", "Mg", "N", 2, 3], ["kalijev oksid", "K", "O", 1, 2], ["kalcijev fluorid", "Ca", "F", 2, 1], ["svinčev(II) oksid", "Pb", "O", 2, 2],
      ]);
      const [nm, m, n, a, b] = P;
      const gg = gcd(a, b);
      const x = b / gg;
      const y = a / gg;
      const roman = /\(/.test(nm);
      return {
        text: `Napiši formulo spojine ${nm} v obliki $\\mathrm{${m}}_x\\mathrm{${n}}_y$. Vpiši najmanjša indeksa $x$ in $y$, ločena z vejico.${roman ? " Rimska številka pove naboj kovinskega iona." : ""}`,
        answer: { type: "coefficients", values: [x, y] },
        inputHint: "npr. 2, 3",
        hint: roman ? "Rimska številka je naboj kovinskega iona. Naboj nekovinskega iona dobiš iz skupine (do osmih elektronov)." : "Naboj kovinskega iona je enak številu zunanjih elektronov, nekovina pa sprejme elektrone do osmih.",
        data: { given: [`${T("spojina")} = ${T(nm)}`], find: ["x,\\ y"] },
        formula: [`x \\cdot (+${a}) + y \\cdot (-${b}) = 0`],
        solution: `Iona: $\\mathrm{${m}^{${a === 1 ? "" : a}+}}$ in $\\mathrm{${n}^{${b === 1 ? "" : b}-}}$.\nSkupni naboj mora biti 0: $x \\cdot ${a} = y \\cdot ${b}$, zato $x = ${x}$, $y = ${y}$.\nFormula: $${ch(`${m}${x > 1 ? x : ""}${n}${y > 1 ? y : ""}`)}$`,
      };
    },
  },
  {
    id: "dod-os-energija-pri-reakcijah",
    topics: ["KEM-OS-8/energija-pri-reakcijah"],
    gen(level, r) {
      const name = r.pick(NAMES);
      const FUEL = [["lesa", 16], ["premoga", 30], ["metana", 55], ["butana", 49.5], ["etanola", 30], ["vodika", 142], ["bencina", 46], ["parafina (sveče)", 42]];
      if (level === 1) {
        if (r.next() < 0.55) {
          const S = r.pick([
            ["gorenje lesa v kaminu", "x"], ["fotosinteza v listih rastlin", "n"], ["žganje apnenca: kalcijev karbonat pri segrevanju razpade", "n"], ["nevtralizacija klorovodikove kisline z natrijevim hidroksidom, raztopina se segreje", "x"],
            ["elektroliza vode z električnim tokom", "n"], ["gašenje apna: kalcijev oksid z vodo, zmes se močno segreje", "x"], ["celično dihanje", "x"], ["rjavenje železa v grelnem obkladku", "x"],
            ["reakcija sode bikarbone s citronsko kislino, pri kateri se raztopina ohladi", "n"], ["razkroj modre galice pri segrevanju v epruveti", "n"], ["gorenje magnezijevega traku", "x"], ["eksplozija zmesi vodika in kisika", "x"],
          ]);
          const O = { x: "eksotermna (energija se sprošča)", n: "endotermna (energija se porablja)", z: "pri reakciji se energija ne spremeni" };
          const W = {
            x: "Pri eksotermni reakciji se energija sprošča v okolico (segrevanje, svetloba).",
            n: "Pri endotermni reakciji je treba energijo stalno dovajati ali pa se okolica ohladi.",
            z: "Pri vsaki kemijski reakciji se energija sprošča ali porablja.",
          };
          return concept(r, {
            q: `Kakšna reakcija je ${S[0]}?`,
            ok: O[S[1]],
            wrong: Object.keys(O).filter((x) => x !== S[1]).map((x) => [O[x], W[x]]),
            hint: "Ali se okolica segreje (energija se sprošča) ali je treba energijo dovajati (oz. se okolica ohladi)?",
            given: [`${T("tema")} = ${T("eksotermne in endotermne reakcije")}`],
            find: [T("vrsta reakcije")],
            sol: [W[S[1]], `Pravilno: ${O[S[1]]}.`],
          });
        }
        const [fn, e] = r.pick(FUEL);
        const m = r.int(2, 40) * 5;
        return {
          text: `Pri gorenju $1\\ \\mathrm{g}$ ${fn} se sprosti približno $${qty(tx(e), "kJ")}$ energije. Koliko energije se sprosti, ko zgori $${qty(m, "g")}$ te snovi?`,
          answer: num(roundHalfUp(m * e, 1), "kJ", null, [[e, "To je energija za 1 g; pomnoži z maso."], [m / e, "Energija je sorazmerna z maso: pomnoži, ne deli."]]),
          hint: "Sproščena energija je sorazmerna z maso snovi, ki zgori.",
          data: { given: [`E_1 = ${tx(e)}\\ \\mathrm{kJ/g}`, dat("m", m, "g")], find: ["E"] },
          formula: ["E = m \\cdot E_1"],
          solution: `Vsak gram sprosti $${qty(tx(e), "kJ")}$.\n$E = ${m}\\ \\mathrm{g} \\cdot ${tx(e)}\\ \\mathrm{kJ/g} = ${qty(tx(roundHalfUp(m * e, 1)), "kJ")}$`,
        };
      }
      if (level === 2) {
        if (r.next() < 0.5) {
          const [fn, e] = r.pick(FUEL);
          const m1 = r.int(2, 10);
          const Q1 = roundHalfUp(m1 * e, 1);
          const m2 = r.int(11, 80);
          const Q2 = (Q1 * m2) / m1;
          return {
            text: `${name} pri poskusu ugotovi, da se pri gorenju $${qty(m1, "g")}$ ${fn} sprosti $${qty(tx(Q1), "kJ")}$ energije. Koliko energije se sprosti pri gorenju $${qty(m2, "g")}$ te snovi? Zaokroži na celo število.`,
            answer: num(Q2, "kJ", 0, [[(Q1 * m1) / m2, "Večja masa da več energije; razmerje si obrnil."], [Q1 * m2, "Najprej izračunaj energijo za 1 g."]]),
            hint: "Najprej izračunaj, koliko energije sprosti 1 g, nato pomnoži z novo maso.",
            data: { given: [dat("m_1", m1, "g"), dat("E_1", tx(Q1), "kJ"), dat("m_2", m2, "g")], find: ["E_2"] },
            formula: ["\\dfrac{E_2}{m_2} = \\dfrac{E_1}{m_1}", "E_2 = E_1 \\cdot \\dfrac{m_2}{m_1}"],
            solution: `Na 1 g: $\\dfrac{${tx(Q1)}\\ \\mathrm{kJ}}{${m1}\\ \\mathrm{g}} ${res(Q1 / m1, 2, "kJ/g")}$\n$E_2 = ${tx(Q1)}\\ \\mathrm{kJ} \\cdot \\dfrac{${m2}}{${m1}} ${res(Q2, 0, "kJ")}$`,
          };
        }
        const Er = r.int(10, 90) * 10;
        const Ep = Er + r.nonZero(-40, 40) * 5;
        const d = Ep - Er;
        const exo = d < 0;
        if (r.next() < 0.5) {
          return {
            text: `Energija reaktantov je $${qty(Er, "kJ")}$, energija produktov pa $${qty(Ep, "kJ")}$. Koliko energije se pri reakciji ${exo ? "sprosti" : "porabi"}?`,
            answer: num(Math.abs(d), "kJ", null, [[Er + Ep, "Energijo reakcije dobiš kot razliko energij, ne vsoto."], [exo ? Er : Ep, "Odštej energijo produktov in reaktantov."]]),
            hint: "Primerjaj energijo reaktantov in produktov. Razlika se sprosti ali porabi.",
            data: { given: [dat("E_r", Er, "kJ"), dat("E_p", Ep, "kJ")], find: ["|\\Delta E|"] },
            formula: ["\\Delta E = E_p - E_r"],
            solution: `$\\Delta E = ${Ep}\\ \\mathrm{kJ} - ${Er}\\ \\mathrm{kJ} = ${qty(d, "kJ")}$\nProdukti imajo ${exo ? "manj" : "več"} energije, zato se $${qty(Math.abs(d), "kJ")}$ ${exo ? "sprosti (eksotermna reakcija)" : "porabi (endotermna reakcija)"}.`,
          };
        }
        const O = { x: "eksotermna", n: "endotermna", z: "ne sprošča in ne porablja energije" };
        const k = exo ? "x" : "n";
        return concept(r, {
          q: `Energija reaktantov je $${qty(Er, "kJ")}$, energija produktov $${qty(Ep, "kJ")}$. Kakšna je reakcija?`,
          ok: O[k],
          wrong: [[O[exo ? "n" : "x"], exo ? "Produkti imajo manj energije kot reaktanti, razlika se sprosti." : "Produkti imajo več energije kot reaktanti, razliko je treba dovesti."], [O.z, "Energiji reaktantov in produktov se razlikujeta."]],
          hint: "Če imajo produkti manj energije kot reaktanti, se razlika sprosti v okolico.",
          given: [dat("E_r", Er, "kJ"), dat("E_p", Ep, "kJ")],
          find: [T("vrsta reakcije")],
          formula: "\\Delta E = E_p - E_r",
          sol: [`$\\Delta E = ${Ep} - ${Er} = ${d}\\ \\mathrm{kJ}$`, `${exo ? "Energija se sprosti" : "Energija se porabi"}: reakcija je ${O[k]}.`],
        });
      }
      const kk = r.int(0, 2);
      if (kk === 0) {
        const [fn, e] = r.pick(FUEL);
        const QM = r.dec(0.2, 5, 1);
        const m = (QM * 1000) / e;
        return {
          text: `Za segrevanje vode v loncu potrebuješ $${qty(tx(QM), "MJ")}$ energije. Koliko gramov ${fn} moraš zažgati, če 1 g sprosti $${qty(tx(e), "kJ")}$? Predpostavi, da gre vsa energija v vodo, in zaokroži na celo število.`,
          answer: num(m, "g", 0, [[QM / e, "Energijo najprej pretvori v kJ (1 MJ = 1000 kJ)."], [QM * 1000 * e, "Maso dobiš z deljenjem energije z energijo na gram."]]),
          hint: "Energijo pretvori v kJ. Nato izračunaj, koliko gramov da toliko energije.",
          data: { given: [dat("E", tx(QM), "MJ"), `E_1 = ${tx(e)}\\ \\mathrm{kJ/g}`], find: ["m"] },
          formula: ["E = m \\cdot E_1", "m = \\dfrac{E}{E_1}"],
          solution: `$E = ${tx(QM)}\\ \\mathrm{MJ} = ${qty(tx(QM * 1000), "kJ")}$\n$m = \\dfrac{${tx(QM * 1000)}\\ \\mathrm{kJ}}{${tx(e)}\\ \\mathrm{kJ/g}} ${res(m, 0, "g")}$`,
        };
      }
      if (kk === 1) {
        const mk = r.dec(0.5, 20, 1);
        const E = mk * 1.78;
        return {
          text: `Pri žganju apnenca kalcijev karbonat razpade na kalcijev oksid in ogljikov dioksid. Za razkroj $1\\ \\mathrm{g}$ kalcijevega karbonata je treba dovesti $1{,}78\\ \\mathrm{kJ}$ energije. Koliko MJ energije potrebujemo za razkroj $${qty(tx(mk), "kg")}$ apnenca? Zaokroži na dve decimalki.`,
          answer: num(E, "MJ", 2, [[mk * 1.78 * 1000, "To je energija v kJ. Pretvori v MJ."], [mk / 1.78, "Pomnoži maso z energijo na gram."]]),
          hint: "Maso pretvori v grame, izračunaj energijo v kJ in jo pretvori v MJ.",
          data: { given: [dat("m", tx(mk), "kg"), "E_1 = 1{,}78\\ \\mathrm{kJ/g}"], find: ["E"] },
          formula: ["E = m \\cdot E_1", "1\\ \\mathrm{MJ} = 1000\\ \\mathrm{kJ}"],
          solution: `$m = ${tx(mk)}\\ \\mathrm{kg} = ${qty(tx(mk * 1000), "g")}$\n$E = ${tx(mk * 1000)}\\ \\mathrm{g} \\cdot 1{,}78\\ \\mathrm{kJ/g} = ${qty(tx(roundHalfUp(mk * 1780, 1)), "kJ")}$\n$E ${res(E, 2, "MJ")}$ (reakcija je endotermna)`,
        };
      }
      const [f1, e1] = r.pick(FUEL);
      const [f2, e2] = r.pick(FUEL.filter((x) => x[1] !== e1));
      const m1 = r.int(2, 40) * 5;
      const m2 = (m1 * e1) / e2;
      return {
        text: `Pri gorenju 1 g ${f1} se sprosti $${qty(tx(e1), "kJ")}$, pri gorenju 1 g ${f2} pa $${qty(tx(e2), "kJ")}$. Koliko gramov ${f2} da enako energijo kot $${qty(m1, "g")}$ ${f1}? Zaokroži na eno decimalko.`,
        answer: num(m2, "g", 1, [[(m1 * e2) / e1, "Snov, ki sprosti več energije na gram, potrebuješ manj."], [m1 * e1, "To je energija v kJ; izračunaj še maso druge snovi."]]),
        hint: "Najprej izračunaj energijo, ki jo da prva snov. Nato ugotovi, koliko gramov druge snovi da enako energijo.",
        data: { given: [`E_1 = ${tx(e1)}\\ \\mathrm{kJ/g}`, `E_2 = ${tx(e2)}\\ \\mathrm{kJ/g}`, dat("m_1", m1, "g")], find: ["m_2"] },
        formula: ["E = m_1 \\cdot E_1 = m_2 \\cdot E_2"],
        solution: `$E = ${m1}\\ \\mathrm{g} \\cdot ${tx(e1)}\\ \\mathrm{kJ/g} = ${qty(tx(roundHalfUp(m1 * e1, 1)), "kJ")}$\n$m_2 = \\dfrac{${tx(roundHalfUp(m1 * e1, 1))}\\ \\mathrm{kJ}}{${tx(e2)}\\ \\mathrm{kJ/g}} ${res(m2, 1, "g")}$`,
      };
    },
  },
  {
    id: "dod-os-nevtralizacija",
    topics: ["KEM-OS-8/nevtralizacija-in-soli"],
    gen(level, r) {
      const ACID = [
        { f: "HCl", n: 1, an: "Cl", name: "klorovodikova kislina", gen: "klorovodikove kisline", salt: "klorid", bad: ["klorat", "Klorat (ClO₃⁻) vsebuje kisik; iz HCl nastane klorid."] },
        { f: "HNO3", n: 1, an: "NO3", name: "dušikova(V) kislina", gen: "dušikove(V) kisline", salt: "nitrat", bad: ["nitrid", "Nitrid (N³⁻) ne vsebuje kisika; iz HNO₃ nastane nitrat."] },
        { f: "H2SO4", n: 2, an: "SO4", name: "žveplova(VI) kislina", gen: "žveplove(VI) kisline", salt: "sulfat", bad: ["sulfid", "Sulfid nastane iz H₂S; iz žveplove(VI) kisline nastane sulfat."] },
        { f: "H3PO4", n: 3, an: "PO4", name: "fosforjeva(V) kislina", gen: "fosforjeve(V) kisline", salt: "fosfat", bad: ["fosfid", "Fosfid (P³⁻) ne vsebuje kisika; iz H₃PO₄ nastane fosfat."] },
      ];
      const BASE = [
        { M: "Na", m: 1, adj: "natrijev", f: "NaOH", gen: "natrijevega hidroksida" },
        { M: "K", m: 1, adj: "kalijev", f: "KOH", gen: "kalijevega hidroksida" },
        { M: "Ca", m: 2, adj: "kalcijev", f: "Ca(OH)2", gen: "kalcijevega hidroksida" },
        { M: "Mg", m: 2, adj: "magnezijev", f: "Mg(OH)2", gen: "magnezijevega hidroksida" },
      ];
      const saltF = (A, B) => {
        const gg = gcd(A.n, B.m);
        const x = A.n / gg;
        const y = B.m / gg;
        const poly = A.an.length > 2;
        return { x, y, f: `${B.M}${x > 1 ? x : ""}${y > 1 ? (poly ? `(${A.an})${y}` : `${A.an}${y}`) : A.an}`, coef: [y, x, 1, x * B.m] };
      };
      const eqText = (A, B, S) =>
        `$$\\square_{1}\\,${ch(A.f)} + \\square_{2}\\,${ch(B.f)} \\rightarrow \\square_{3}\\,${ch(S.f)} + \\square_{4}\\,\\mathrm{H_2O}$$`;
      const eqSol = (A, B, S) => {
        const c = S.coef.map((k) => (k === 1 ? "" : `${k}\\,`));
        return `$$${c[0]}${ch(A.f)} + ${c[1]}${ch(B.f)} \\rightarrow ${c[2]}${ch(S.f)} + ${c[3]}\\mathrm{H_2O}$$`;
      };
      const coefTask = (A, B) => {
        const S = saltF(A, B);
        return {
          text: `Uredi enačbo nevtralizacije ${A.gen} z raztopino ${B.gen}. Vpiši koeficiente v kvadratkih po vrsti, ločene z vejico:\n\n${eqText(A, B, S)}`,
          answer: { type: "coefficients", values: S.coef },
          inputHint: "npr. 1, 2, 1, 2",
          hint: "Vsak ion $\\mathrm{H^+}$ iz kisline se z enim ionom $\\mathrm{OH^-}$ iz baze poveže v molekulo vode. Najprej uredi kovino in kislinski ostanek v soli.",
          data: { given: [`${T("kislina")} = ${ch(A.f)}`, `${T("baza")} = ${ch(B.f)}`], find: [T("koeficienti")] },
          formula: ["\\mathrm{H^+} + \\mathrm{OH^-} \\rightarrow \\mathrm{H_2O}", "N(\\mathrm{H^+}) = N(\\mathrm{OH^-}) = N(\\mathrm{H_2O})"],
          solution: `Sol: $${ch(S.f)}$ (${B.adj} ${A.salt}); vsebuje ${S.x} ${B.M} in ${S.y} ${A.an}.\nKisline potrebujemo ${S.coef[0]}, baze ${S.coef[1]}: tako je ionov $\\mathrm{H^+}$ in $\\mathrm{OH^-}$ enako, po ${S.coef[3]}.\nIz njih nastane ${S.coef[3]} $\\mathrm{H_2O}$.\n${eqSol(A, B, S)}`,
        };
      };
      if (level === 1) {
        const A = r.pick(ACID);
        const B = r.pick(BASE);
        if (r.next() < 0.6) {
          const otherB = r.pick(BASE.filter((b) => b.M !== B.M));
          const okName = `${B.adj} ${A.salt}`;
          return concept(r, {
            q: `Katera sol nastane pri nevtralizaciji ${A.gen} ($${ch(A.f)}$) z raztopino ${B.gen} ($${ch(B.f)}$)?`,
            ok: okName,
            wrong: [[`${B.adj} ${A.bad[0]}`, A.bad[1]], [`${otherB.adj} ${A.salt}`, "Kovina v soli pride iz baze, ki je reagirala."], [`${B.adj} hidroksid`, "To je baza, ki je reagirala, ne nastala sol."]],
            hint: "Sol je sestavljena iz kovine iz baze in kislinskega ostanka iz kisline. Ime: kovina v pridevniški obliki + ime kislinskega ostanka.",
            given: [`${T("kislina")} = ${ch(A.f)}`, `${T("baza")} = ${ch(B.f)}`],
            find: [T("ime soli")],
            sol: [`Kislina ${A.name} da kislinski ostanek ${A.salt}, baza da kovino ${B.M}.`, `Nastane ${okName} in voda.`],
          });
        }
        return {
          text: `Koliko molekul vode nastane, ko ena molekula ${A.gen} ($${ch(A.f)}$) popolnoma zreagira z raztopino natrijevega hidroksida?`,
          answer: num(A.n, null, null, [[1, A.n === 1 ? "Preveri število vodikovih atomov." : "Vsak ion H⁺ iz kisline da z ionom OH⁻ eno molekulo vode."], [A.n * 2, "En ion H⁺ in en ion OH⁻ dasta eno molekulo vode."]]),
          hint: "Pri nevtralizaciji se vsak ion $\\mathrm{H^+}$ kisline poveže z ionom $\\mathrm{OH^-}$ baze v molekulo vode.",
          data: { given: [`\\text{kislina: } ${ch(A.f)}`], find: ["N(\\mathrm{H_2O})"] },
          formula: ["\\mathrm{H^+} + \\mathrm{OH^-} \\rightarrow \\mathrm{H_2O}"],
          solution: `Molekula $${ch(A.f)}$ odda ${A.n} ${A.n === 1 ? "ion" : A.n === 2 ? "iona" : "ione"} $\\mathrm{H^+}$.\nVsak se poveže z enim $\\mathrm{OH^-}$ v molekulo vode: $N(\\mathrm{H_2O}) = ${A.n}$.`,
        };
      }
      if (level === 2) {
        if (r.next() < 0.55) {
          const pool = [];
          for (const A of ACID) for (const B of BASE) if ((A.n === 1 || B.m === 1) && A.n <= 2) pool.push([A, B]);
          const [A, B] = r.pick(pool);
          return coefTask(A, B);
        }
        const MM = { HCl: 36.5, HNO3: 63, H2SO4: 98, NaOH: 40, KOH: 56, H2O: 18, NaCl: 58.5, KCl: 74.5, NaNO3: 85, KNO3: 101, Na2SO4: 142, K2SO4: 174 };
        const A = r.pick(ACID.slice(0, 3));
        const B = r.pick(BASE.slice(0, 2));
        const S = saltF(A, B);
        const kf = r.pick([0.1, 0.2, 0.25, 0.5, 1, 2]);
        const ma = roundHalfUp(S.coef[0] * MM[A.f] * kf, 2);
        const mb = roundHalfUp(S.coef[1] * MM[B.f] * kf, 2);
        const mw = roundHalfUp(S.coef[3] * 18 * kf, 2);
        const ms = roundHalfUp(ma + mb - mw, 2);
        return {
          text: `Pri nevtralizaciji popolnoma zreagira $${qty(tx(ma), "g")}$ ${A.gen} z $${qty(tx(mb), "g")}$ ${B.gen}. Nastane $${qty(tx(mw), "g")}$ vode in sol ${B.adj} ${A.salt}. Kolikšna je masa nastale soli?`,
          answer: num(ms, "g", null, [[roundHalfUp(ma + mb, 2), "Del mase reaktantov preide v vodo, zato maso vode odštej."], [roundHalfUp(ma + mb + mw, 2), "Voda je produkt, ne reaktant: njeno maso odštej."]]),
          hint: "Zakon o ohranitvi mase: skupna masa reaktantov je enaka skupni masi produktov.",
          data: { given: [dat(`m(${ch(A.f)})`, tx(ma), "g"), dat(`m(${ch(B.f)})`, tx(mb), "g"), dat("m(\\mathrm{H_2O})", tx(mw), "g")], find: [`m(${ch(S.f)})`] },
          formula: ["m_{kisline} + m_{baze} = m_{soli} + m_{vode}"],
          solution: `Masa reaktantov: $${tx(ma)} + ${tx(mb)} = ${qty(tx(roundHalfUp(ma + mb, 2)), "g")}$\n$m_{soli} = ${tx(roundHalfUp(ma + mb, 2))}\\ \\mathrm{g} - ${tx(mw)}\\ \\mathrm{g} = ${qty(tx(ms), "g")}$`,
        };
      }
      if (r.next() < 0.55) {
        const pool = [];
        for (const A of ACID) for (const B of BASE) if (A.n >= 2 || B.m >= 2) pool.push([A, B]);
        const [A, B] = r.pick(pool);
        return coefTask(A, B);
      }
      const A = r.pick(ACID.slice(1));
      const B = r.pick(BASE);
      const S = saltF(A, B);
      const U = (f) => plain(`$${ch(f)}$`);
      const alt = [];
      const poly = A.an.length > 2;
      const noBr = `${B.M}${S.x > 1 ? S.x : ""}${A.an}${S.y > 1 ? S.y : ""}`;
      if (poly && S.y > 1) alt.push([U(noBr), "Brez oklepaja bi indeks veljal le za zadnji atom; kislinski ostanek mora biti v oklepaju."]);
      alt.push([U(`${B.M}${poly ? `(${A.an})` : A.an}`.replace(/\((\w+)\)$/, "$1")), `Naboj soli mora biti 0: ${B.M} ima naboj ${B.m}+, ${A.salt} ${A.n}−.`]);
      alt.push([U(`${B.M}${S.y > 1 ? S.y : ""}${S.x > 1 ? (poly ? `(${A.an})${S.x}` : `${A.an}${S.x}`) : A.an}`), "Indeksa si zamenjal: število kovinskih ionov določa naboj kislinskega ostanka."]);
      alt.push([U(`${B.M}(OH)${A.an}`), "Pri popolni nevtralizaciji ioni OH⁻ preidejo v vodo, v soli jih ni."]);
      const okU = U(S.f);
      const wrong = [];
      for (const w of alt) if (w[0] !== okU && !wrong.some((x) => x[0] === w[0])) wrong.push(w);
      return concept(r, {
        q: `Kakšna je formula soli ${B.adj} ${A.salt}, ki nastane iz ${A.gen} in ${B.gen}? Kovinski ion ($\\mathrm{${B.M}^{${B.m === 1 ? "" : B.m}+}}$) ima naboj ${B.m}+, kislinski ostanek ($\\mathrm{${A.an.replace(/(\d)/g, "_$1")}^{${A.n === 1 ? "" : A.n}-}}$) pa ${A.n}−.`,
        ok: okU,
        wrong: wrong.slice(0, 3),
        hint: "Sol je nevtralna: indeksa izberi tako, da je pozitivnih nabojev toliko kot negativnih. Večatomni ion daj v oklepaj, če je indeks večji od 1.",
        given: [`${T("kation")} = \\mathrm{${B.M}^{${B.m === 1 ? "" : B.m}+}}`, `${T("anion")} = \\mathrm{${A.an.replace(/(\d)/g, "_$1")}^{${A.n === 1 ? "" : A.n}-}}`],
        find: [T("formula soli")],
        formula: [`x \\cdot (+${B.m}) + y \\cdot (-${A.n}) = 0`],
        sol: [`$x \\cdot ${B.m} = y \\cdot ${A.n}$ da $x = ${S.x}$, $y = ${S.y}$.`, `Formula: $${ch(S.f)}$`],
      });
    },
  },
  // ---------------------------------------------------------------- KEMIJA 9
  {
    id: "dod-os-ogljik-organske",
    topics: ["KEM-OS-9/ogljik-in-organske-spojine"],
    gen(level, r) {
      const name = r.pick(NAMES);
      // racionalna formula, ime (rodilnik), H v funkcionalni skupini (OH, COOH, NH2)
      const MOLS = [
        ["CH3-CH2-OH", "etanola", 1], ["CH3-CH2-CH3", "propana", 0], ["CH3-COOH", "ocetne kisline", 1], ["CH3-CH2-CH2-CH3", "butana", 0], ["CH3-OH", "metanola", 1],
        ["CH2=CH2", "etena", 0], ["CH3-CH(CH3)-CH3", "metilpropana", 0], ["CH3-CO-CH3", "propanona (acetona)", 0], ["CH3-CH2-NH2", "etilamina", 2], ["CH3-CH2-CH2-OH", "propan-1-ola", 1],
        ["HCOOH", "metanojske kisline", 1], ["CH≡CH", "etina", 0], ["CH3-CH=CH2", "propena", 0], ["CH3-CH2-COOH", "propanojske kisline", 1],
      ];
      const rtex = (s) => `\\mathrm{${s.replace(/(\d+)/g, "_{$1}").replace(/-/g, "{-}").replace(/=/g, "{=}").replace(/≡/g, "{\\equiv}")}}`;
      const comp = (s) => parseFormula(s.replace(/[-=≡]/g, ""));
      if (level === 1) {
        if (r.next() < 0.55) {
          const [s, gen, fh] = r.pick(MOLS);
          const c = comp(s);
          const k = r.int(0, 2);
          const tot = Object.values(c).reduce((a, b) => a + b, 0);
          const q = ["vodikovih atomov", "ogljikovih atomov", "vseh atomov"][k];
          const val = [c.H, c.C, tot][k];
          const molF = `C${c.C > 1 ? c.C : ""}H${c.H}${c.N ? "N" : ""}${c.O ? `O${c.O > 1 ? c.O : ""}` : ""}`;
          return {
            text: `Racionalna formula molekule ${gen} je $${rtex(s)}$. Koliko ${q} ima molekula?`,
            answer: num(val, null, null, k === 0 ? [[c.H - fh, "Preštej tudi vodikove atome v funkcionalni skupini (OH, COOH, NH₂)."], [tot, "To so vsi atomi, ne le vodikovi."]] : k === 1 ? [[c.H, "To so vodikovi atomi."]] : [[c.C + c.H, "Upoštevaj tudi atome kisika ali dušika."], [Object.keys(c).length, "To je število različnih elementov."]]),
            hint: "Pojdi po formuli od leve proti desni in seštevaj atome. Indeks velja za atom tik pred njim, oklepaj pomeni stransko verigo.",
            data: { given: [`\\text{formula} = ${rtex(s)}`], find: [T(q)] },
            formula: ["\\text{molekulska formula: } " + ch(molF)],
            solution: `Seštejemo atome: ${Object.entries(c).map(([e, n]) => `${e}: ${n}`).join(", ")}.\nMolekulska formula je $${ch(molF)}$, zato je ${q}: $${val}$.`,
          };
        }
        const ORG = ["etanol", "metan", "glukoza", "ocetna kislina", "saharoza (sladkor)", "propan"];
        const INORG = [["ogljikov dioksid", "Ogljikov dioksid vsebuje ogljik, a ga uvrščamo med anorganske spojine."], ["kalcijev karbonat (apnenec)", "Karbonati vsebujejo ogljik, a so anorganske spojine."], ["ogljikov oksid", "Ogljikov oksid je anorganska spojina."], ["natrijev klorid", "Natrijev klorid sploh ne vsebuje ogljika."], ["voda", "Voda ne vsebuje ogljika."]];
        const ok = r.pick(ORG);
        return concept(r, {
          q: r.pick(["Katera od naštetih snovi je organska spojina?", `${name} razvršča snovi. Katera od naštetih je organska spojina?`, "Katero snov proučuje organska kemija?"]),
          ok,
          wrong: r.shuffle(INORG).slice(0, 3),
          hint: "Organske spojine so spojine ogljika (navadno z vodikom). Ogljikovi oksidi, karbonati in ogljikova kislina so izjeme in spadajo med anorganske.",
          given: [`${T("tema")} = ${T("organske in anorganske spojine")}`],
          find: [T("organska spojina")],
          sol: ["Organske spojine so ogljikove spojine z vodikom (ogljikovodiki in njihovi derivati); CO, CO₂ in karbonati so anorganski.", `Pravilno: ${ok}.`],
        });
      }
      if (level === 2) {
        const n = r.int(2, 6);
        const kind = r.pick(["s", "s", "d", "t", "o", "c"]);
        if (kind === "c" && n < 3) return this.gen(level, r);
        let sk;
        let H;
        let desc;
        if (kind === "s") [sk, H, desc] = [Array(n).fill("C").join("{-}"), 2 * n + 2, "same enojne vezi"];
        else if (kind === "d") {
          const p = r.int(1, n - 1);
          sk = Array.from({ length: n }, () => "C").map((c, i) => (i === 0 ? c : (i === p ? "{=}" : "{-}") + c)).join("");
          [H, desc] = [2 * n, "ena dvojna vez"];
        } else if (kind === "t") {
          const p = r.int(1, n - 1);
          sk = Array.from({ length: n }, () => "C").map((c, i) => (i === 0 ? c : (i === p ? "{\\equiv}" : "{-}") + c)).join("");
          [H, desc] = [2 * n - 2, "ena trojna vez"];
        } else if (kind === "o") [sk, H, desc] = [Array(n).fill("C").join("{-}") + "{-}O", 2 * n + 2, "na koncu je kisikov atom (alkohol)"];
        else [sk, H, desc] = [`\\text{obroč iz ${n} atomov C}`, 2 * n, "obroč z enojnimi vezmi"];
        return {
          text: `Ogljikov skelet molekule je $${kind === "c" ? sk : `\\mathrm{${sk}}`}$ (${desc}). Koliko vodikovih atomov moraš dodati, da ima vsak ogljikov atom 4 vezi${kind === "o" ? " in kisikov 2" : ""}?`,
          answer: num(H, null, null, [[4 * n, "Ogljik, ki je vezan na druge atome C, ima prostih manj kot 4 vezi."], [2 * n + 2, "Dvojna ali trojna vez porabi dodatne vezi ogljikovih atomov, obroč pa eno vez več."], [kind === "o" ? 2 * n + 1 : 2 * n + 4, kind === "o" ? "Tudi kisik potrebuje vodik (skupina OH)." : "Preštej proste vezi pri vsakem ogljikovem atomu posebej."]]),
          hint: "Za vsak atom C štej, koliko vezi že ima do sosednjih atomov (dvojna šteje 2, trojna 3). Do 4 ga dopolni z vodikom.",
          data: { given: [`\\text{skelet} = ${kind === "c" ? sk : `\\mathrm{${sk}}`}`], find: ["N(\\mathrm{H})"] },
          formula: ["N(\\mathrm{H}\\ \\text{na C}) = 4 - N(\\text{vezi do sosedov})"],
          solution: `Vsak C ima 4 vezi${kind === "o" ? ", O ima 2 vezi" : ""}; vezi do sosedov ne potrebujejo vodika.\n${kind === "s" ? `Robna C imata po 3 H, notranji po 2 H: $2 \\cdot 3 + ${n - 2} \\cdot 2 = ${H}$` : kind === "d" ? `Dvojna vez porabi 2 dodatni vezi glede na alkan z enakim številom C: $2 \\cdot ${n} + 2 - 2 = ${H}$` : kind === "t" ? `Trojna vez porabi 4 dodatne vezi glede na alkan: $2 \\cdot ${n} + 2 - 4 = ${H}$` : kind === "o" ? `Ogljiki dobijo $2 \\cdot ${n} + 1 = ${2 * n + 1}$ H, kisik še 1 H (skupina OH): skupaj $${H}$` : `V obroču ima vsak C dva soseda in 2 H: $${n} \\cdot 2 = ${H}$`}\n$N(\\mathrm{H}) = ${H}$`,
        };
      }
      if (r.next() < 0.6) {
        const M = r.pick([
          ["metana", "CH4", 0], ["etana", "C2H6", 0], ["propana", "C3H8", 0], ["butana", "C4H10", 0], ["etena", "C2H4", 1], ["propena", "C3H6", 1], ["etina", "C2H2", 2], ["propina", "C3H4", 2], ["metanola", "CH3OH", 0], ["etanola", "C2H5OH", 0],
        ]);
        const c = parseFormula(M[1]);
        const nAt = Object.values(c).reduce((a, b) => a + b, 0);
        const pairs = nAt - 1 + M[2];
        return {
          text: `Koliko skupnih (veznih) elektronskih parov je v molekuli ${M[0]} ($${ch(M[1])}$)? Dvojna vez šteje kot dva para, trojna kot trije.`,
          answer: num(pairs, null, null, [[nAt - 1, "Upoštevaj, da ima dvojna vez dva skupna para, trojna tri."], [nAt, "Med n atomi v verigi je n − 1 povezav, ne n."], [2 * pairs, "To je število elektronov v vezeh, ne parov."]]),
          hint: "Nariši strukturno formulo. Atomi so povezani v drevo brez obročev, zato je povezav za ena manj kot atomov; dvojna vez doda en par, trojna dva.",
          data: { given: [`\\text{molekula: } ${ch(M[1])}`], find: [T("število veznih parov")] },
          formula: ["N = (N_{atomov} - 1) + N_{dodatnih\\ parov}"],
          solution: `Atomov je $${nAt}$, povezav med njimi $${nAt - 1}$.\n${M[2] === 0 ? "Vse vezi so enojne." : M[2] === 1 ? "Dvojna vez doda en par." : "Trojna vez doda dva para."}\n$N = ${nAt - 1} + ${M[2]} = ${pairs}$`,
        };
      }
      const P = r.pick([
        { q: "Zakaj obstaja zelo veliko organskih spojin?", ok: "ker se ogljikovi atomi povezujejo med seboj v verige, razvejane verige in obroče", wrong: [["ker ima ogljik največ elektronov", "Ogljik ima le 6 elektronov; pomembna je sposobnost povezovanja v verige."], ["ker ogljik tvori samo ionske vezi", "Ogljik v organskih spojinah tvori kovalentne vezi."], ["ker je ogljika v naravi največ", "Ogljika ni največ; njegova posebnost je povezovanje v verige."]] },
        { q: "Koliko kovalentnih vezi tvori atom ogljika v organskih spojinah?", ok: "štiri", wrong: [["dve", "Ogljik ima 4 zunanje elektrone in tvori 4 vezi."], ["šest", "Ogljik ima 6 elektronov, a le 4 zunanje."], ["eno", "Eno vez tvori vodik."]] },
        { q: "Kaj nastane pri popolnem gorenju vsake organske spojine iz ogljika in vodika?", ok: "ogljikov dioksid in voda", wrong: [["ogljik in vodik", "Pri gorenju se elementa povežeta s kisikom."], ["ogljikov oksid in vodik", "To so produkti nepopolnega gorenja oziroma razkroja."], ["samo voda", "Ogljik se pri gorenju spremeni v CO₂."]] },
      ]);
      return concept(r, {
        ...P,
        hint: "Ogljik ima 4 zunanje elektrone, zato tvori 4 kovalentne vezi, tudi z drugimi ogljikovimi atomi.",
        given: [`${T("ogljik")} = ${T("štirje zunanji elektroni")}`],
        find: [T("razlaga")],
        sol: ["Ogljik tvori 4 kovalentne vezi in se povezuje v dolge verige in obroče; zato je organskih spojin zelo veliko.", `Pravilno: ${P.ok}.`],
      });
    },
  },
  {
    id: "dod-os-alkani-alkeni-alkini",
    topics: ["KEM-OS-9/alkani-alkeni-alkini"],
    gen(level, r) {
      const PRE = ["met", "et", "prop", "but", "pent", "heks", "hept", "okt"];
      const SER = { an: ["alkan", 2, "an"], en: ["alken", 0, "en"], in: ["alkin", -2, "in"] };
      const Hn = (s, n) => 2 * n + SER[s][1];
      const nm = (s, n) => PRE[n - 1] + SER[s][2];
      const genOf = (s, n) => nm(s, n) + "a";
      const fF = { an: "\\mathrm{C}_n\\mathrm{H}_{2n+2}", en: "\\mathrm{C}_n\\mathrm{H}_{2n}", in: "\\mathrm{C}_n\\mathrm{H}_{2n-2}" };
      const pickS = () => r.pick(["an", "en", "in"]);
      if (level === 1) {
        const s = pickS();
        const n = s === "an" ? r.int(1, 8) : r.int(2, 8);
        if (r.next() < 0.5) {
          const others = ["an", "en", "in"].filter((x) => x !== s);
          return {
            text: `Koliko vodikovih atomov ima molekula ${genOf(s, n)}?`,
            answer: num(Hn(s, n), null, null, [...others.map((o) => [Hn(o, n), `To je formula za ${SER[o][0]}. Končnica -${SER[s][2]} pomeni ${SER[s][0]}.`]), [4 * n, "Ogljik, ki je vezan na sosednje C, ima manj kot 4 vodike."]]),
            hint: `Predpona pove število C (${PRE.slice(0, 4).map((p, i) => `${p}- = ${i + 1}`).join(", ")} …), končnica pa vrsto: -an, -en, -in.`,
            data: { given: [`${T("spojina")} = ${T(nm(s, n))}`], find: ["N(\\mathrm{H})"] },
            formula: [fF[s]],
            solution: `${nm(s, n)[0].toUpperCase()}${nm(s, n).slice(1)} je ${SER[s][0]} z $n = ${n}$ ogljikovimi atomi.\n$N(\\mathrm{H}) = 2 \\cdot ${n} ${SER[s][1] > 0 ? "+ 2" : SER[s][1] < 0 ? "- 2" : ""} = ${Hn(s, n)}$, formula $${ch(`C${n > 1 ? n : ""}H${Hn(s, n)}`)}$`,
          };
        }
        const O = { an: "alkan (same enojne vezi)", en: "alken (ena dvojna vez)", in: "alkin (ena trojna vez)" };
        const W = { an: "Alkani imajo formulo CₙH₂ₙ₊₂.", en: "Alkeni imajo formulo CₙH₂ₙ.", in: "Alkini imajo formulo CₙH₂ₙ₋₂." };
        const f = `C${n > 1 ? n : ""}H${Hn(s, n)}`;
        return concept(r, {
          q: `V katero skupino ogljikovodikov spada spojina $${ch(f)}$?`,
          ok: O[s],
          wrong: Object.keys(O).filter((x) => x !== s).map((x) => [O[x], W[x]]),
          hint: "Primerjaj število vodikov z $2n + 2$, kjer je $n$ število ogljikovih atomov.",
          given: [`\\text{formula: } ${ch(f)}`],
          find: [T("skupina")],
          formula: [fF.an, fF.en, fF.in],
          sol: [`$2n + 2 = ${2 * n + 2}$; spojina ima ${Hn(s, n)} H${s === "an" ? "" : s === "en" ? ", 2 manj" : ", 4 manj"}.`, `Pravilno: ${O[s]}.`],
        });
      }
      if (level === 2) {
        const s = pickS();
        const n = r.int(2, 8);
        if (r.next() < 0.5) {
          return {
            text: `Molekula ${SER[s][0] === "alkan" ? "alkana" : SER[s][0] === "alken" ? "alkena" : "alkina"} ima ${Hn(s, n)} vodikovih atomov. Koliko ogljikovih atomov ima? Kako se imenuje (nerazvejana veriga)?`,
            answer: num(n, null, null, [[Hn(s, n) / 2, `Za ${SER[s][0]} velja posebna formula; ne deli le z 2.`], [s === "an" ? n + 1 : n - 1, "Uporabi formulo prave skupine ogljikovodikov."]]),
            hint: `Zapiši formulo skupine (${SER[s][0]}: $${fF[s]}$) in iz števila H izračunaj $n$.`,
            data: { given: [`${T("vrsta")} = ${T(SER[s][0])}`, `N(\\mathrm{H}) = ${Hn(s, n)}`], find: ["n(\\mathrm{C})"] },
            formula: [fF[s]],
            solution: `$2n ${SER[s][1] > 0 ? "+ 2" : SER[s][1] < 0 ? "- 2" : ""} = ${Hn(s, n)}$\n$n = ${n}$: to je ${nm(s, n)}, $${ch(`C${n}H${Hn(s, n)}`)}$`,
          };
        }
        const f = `C${n}H${Hn(s, n)}`;
        const others = ["an", "en", "in"].filter((x) => x !== s);
        const otherN = n > 2 ? n - 1 : n + 1;
        return concept(r, {
          q: `Kako se imenuje ogljikovodik z nerazvejano verigo in formulo $${ch(f)}$?`,
          ok: nm(s, n),
          wrong: [...others.map((o) => [nm(o, n), `${nm(o, n)} ima formulo C${sub(String(n))}H${sub(String(Hn(o, n)))}.`]), [nm(s, otherN), `Predpona pove število C: ${PRE[otherN - 1]}- pomeni ${otherN}.`]].filter((w) => w[0] !== "meten" && w[0] !== "metin"),
          hint: "Predpona pove število ogljikovih atomov, končnica (-an, -en, -in) pa vrsto vezi.",
          given: [`\\text{formula: } ${ch(f)}`],
          find: [T("ime")],
          formula: [fF[s]],
          sol: [`$n = ${n}$ (predpona ${PRE[n - 1]}-), $N(\\mathrm{H}) = ${Hn(s, n)}$ ustreza formuli $${fF[s]}$ (${SER[s][0]}).`, `Ime: ${nm(s, n)}.`],
        });
      }
      const kk = r.int(0, 2);
      if (kk === 0) {
        const s = pickS();
        const n = s === "an" ? r.int(1, 8) : r.int(2, 8);
        const M = 12 * n + Hn(s, n);
        return {
          text: `Molska masa ${SER[s][0] === "alkan" ? "alkana" : SER[s][0] === "alken" ? "alkena" : "alkina"} je $${qty(M, "g/mol")}$. Koliko ogljikovih atomov ima molekula? Uporabi $M(\\mathrm{C}) = 12\\ \\mathrm{g/mol}$ in $M(\\mathrm{H}) = 1\\ \\mathrm{g/mol}$.`,
          answer: num(n, null, null, [[Math.round(M / 12), "Upoštevaj tudi maso vodikovih atomov."], [Math.round(M / 14), "Pri tej skupini se masa ne deli natanko s 14; upoštevaj formulo skupine."]]),
          hint: `Zapiši molsko maso z $n$: ${SER[s][0]} $${fF[s]}$ ima $M = 12n + 1 \\cdot (${s === "an" ? "2n + 2" : s === "en" ? "2n" : "2n - 2"})$.`,
          data: { given: [dat("M", M, "g/mol"), `${T("vrsta")} = ${T(SER[s][0])}`], find: ["n"] },
          formula: [fF[s], `M = 12n + ${s === "an" ? "2n + 2 = 14n + 2" : s === "en" ? "2n = 14n" : "2n - 2 = 14n - 2"}`],
          solution: `$${s === "an" ? "14n + 2" : s === "en" ? "14n" : "14n - 2"} = ${M}$\n$n = ${n}$: ${nm(s, n)}, $${ch(`C${n > 1 ? n : ""}H${Hn(s, n)}`)}$`,
        };
      }
      if (kk === 1) {
        const [n, iso] = r.pick([[4, 2], [5, 3], [6, 5]]);
        return {
          text: `Koliko verižnih izomer (različnih strukturnih formul z enako molekulsko formulo) ima alkan $${ch(`C${n}H${2 * n + 2}`)}$? Nariši vse ogljikove skelete.`,
          answer: num(iso, null, null, [[1, "Poleg nerazvejane verige obstajajo tudi razvejane."], [n - 2, "Preveri, ali si narisal tudi verige z dvema stranskima skupinama."], [iso + 1, "Nekatere skice so ista molekula, le drugače obrnjena; najdaljša veriga mora biti drugačna."]]),
          hint: "Začni z nerazvejano verigo, nato najdaljšo verigo skrajšaj za 1 in stransko skupino premikaj po verigi. Pazi, da iste molekule ne narišeš dvakrat.",
          data: { given: [`\\text{formula: } ${ch(`C${n}H${2 * n + 2}`)}`], find: [T("število izomer")] },
          formula: ["\\text{izomere: enaka molekulska formula, različna zgradba}"],
          solution: n === 4
            ? "Butan (nerazvejan) in metilpropan.\nIzomer: 2"
            : n === 5
              ? "Pentan, 2-metilbutan in 2,2-dimetilpropan.\nIzomer: 3"
              : "Heksan, 2-metilpentan, 3-metilpentan, 2,2-dimetilbutan in 2,3-dimetilbutan.\nIzomer: 5",
        };
      }
      const P = r.pick([
        (() => {
          const ns = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8]).slice(0, 4).sort((a, b) => a - b);
          return { q: `Kateri alkan ima najvišje vrelišče: ${ns.map((x) => nm("an", x)).join(", ")}?`, ok: nm("an", ns[3]), wrong: ns.slice(0, 3).map((x) => [nm("an", x), "Daljša veriga pomeni močnejše privlačne sile med molekulami in višje vrelišče."]) };
        })(),
        { q: "V bromovico (oranžno raztopino broma) uvajamo eten. Kaj opazimo?", ok: "bromovica se razbarva", wrong: [["bromovica ostane oranžna", "Eten ima dvojno vez, na katero se veže brom (adicija)."], ["bromovica se obarva modro", "Modro barvo da jod s škrobom."], ["nastane bela oborina", "Brom se veže na dvojno vez in razbarva raztopino."]] },
        { q: "S katerim poskusom ločiš heksan od heksena?", ok: "z bromovico: heksen jo razbarva, heksan ne", wrong: [["z vžigom: gori le heksan", "Gorita oba ogljikovodika."], ["z vodo: heksen se v vodi raztopi", "Oba sta v vodi netopna."], ["z indikatorjem: heksen je kisel", "Ogljikovodiki niso kisline."]] },
        { q: "Kakšne so lastnosti alkanov?", ok: "so nepolarni, v vodi netopni in gorljivi", wrong: [["dobro se raztapljajo v vodi", "Alkani so nepolarni in se v vodi ne raztapljajo."], ["so ionske spojine z visokim tališčem", "Alkani imajo kovalentne vezi."], ["razbarvajo bromovico", "Alkani imajo le enojne vezi in bromovice ne razbarvajo."]] },
      ]);
      return concept(r, {
        ...P,
        hint: "Pomisli na vrsto vezi (enojne, dvojna, trojna) in na dolžino verige.",
        given: [T("ogljikovodiki")],
        find: [T("pravilni odgovor")],
        sol: ["Daljša veriga pomeni višje vrelišče; dvojna in trojna vez omogočata adicijo broma (razbarvanje bromovice).", `Pravilno: ${P.ok}.`],
      });
    },
  },
  {
    id: "dod-os-nafta-zemeljski-plin",
    topics: ["KEM-OS-9/nafta-in-zemeljski-plin"],
    gen(level, r) {
      const name = r.pick(NAMES);
      const FUELS = [["metana", 1, 4], ["etana", 2, 6], ["propana", 3, 8], ["butana", 4, 10], ["pentana", 5, 12], ["etena", 2, 4], ["etina", 2, 2], ["propena", 3, 6], ["heksana", 6, 14], ["oktana", 8, 18]];
      const combust = (n, h, full) => {
        const O = full ? 2 * n + h / 2 : n + h / 2;
        let k = 1;
        while (((O * k) / 2) % 1 || ((h * k) / 2) % 1) k++;
        const c = [k, (O * k) / 2, n * k, (h * k) / 2];
        const gg = c.reduce((a, b) => gcd(a, b));
        return c.map((x) => x / gg);
      };
      const coefTask = (F, full) => {
        const [gen, n, h] = F;
        const f = `C${n > 1 ? n : ""}H${h}`;
        const c = combust(n, h, full);
        const P = full ? "\\mathrm{CO_2}" : "\\mathrm{CO}";
        const t = (k) => (k === 1 ? "" : `${k}\\,`);
        return {
          text: `Uredi enačbo ${full ? "popolnega" : "nepopolnega"} gorenja ${gen}${full ? "" : ", pri katerem nastaja ogljikov oksid"}. Vpiši koeficiente po vrsti, ločene z vejico:\n\n$$\\square_{1}\\,${ch(f)} + \\square_{2}\\,\\mathrm{O_2} \\rightarrow \\square_{3}\\,${P} + \\square_{4}\\,\\mathrm{H_2O}$$`,
          answer: { type: "coefficients", values: c },
          inputHint: "npr. 1, 2, 1, 2",
          hint: "Najprej uredi ogljik, nato vodik, kisik na koncu. Če pri kisiku dobiš polovico, vse koeficiente pomnoži z 2.",
          data: { given: [`\\text{gorivo: } ${ch(f)}`], find: [T("koeficienti")] },
          formula: [`${ch(f)} + \\mathrm{O_2} \\rightarrow ${P} + \\mathrm{H_2O}`],
          solution: `Ogljik: ${n} atom${n === 1 ? "" : n === 2 ? "a" : n <= 4 ? "i" : "ov"} C da ${n} $${P}$; vodik: ${h} H da ${h / 2} $\\mathrm{H_2O}$.\nKisik na desni: $${full ? `2 \\cdot ${n}` : n} + ${h / 2} = ${full ? 2 * n + h / 2 : n + h / 2}$ atomov${c[0] > 1 ? `; da je število molekul $\\mathrm{O_2}$ celo, vse pomnožimo z ${c[0]}` : ""}.\n$$${t(c[0])}${ch(f)} + ${t(c[1])}\\mathrm{O_2} \\rightarrow ${t(c[2])}${P} + ${t(c[3])}\\mathrm{H_2O}$$`,
        };
      };
      if (level === 1) {
        if (r.next() < 0.45) {
          const [gen, n, h] = r.pick(FUELS);
          const askW = r.next() < 0.5;
          return {
            text: `Koliko molekul ${askW ? "vode" : "ogljikovega dioksida"} nastane pri popolnem gorenju ene molekule ${gen} ($${ch(`C${n > 1 ? n : ""}H${h}`)}$)?`,
            answer: num(askW ? h / 2 : n, null, null, askW ? [[h, "Vsaka molekula vode ima 2 vodikova atoma."], [n, "To je število molekul CO₂."]] : [[h / 2, "To je število molekul vode."], [2 * n, "Vsaka molekula CO₂ ima en ogljikov atom."]]),
            hint: askW ? "Vsi vodikovi atomi preidejo v vodo; vsaka molekula vode ima 2 vodikova atoma." : "Vsi ogljikovi atomi preidejo v $\\mathrm{CO_2}$; vsaka molekula $\\mathrm{CO_2}$ ima en ogljikov atom.",
            data: { given: [`\\text{gorivo: } ${ch(`C${n > 1 ? n : ""}H${h}`)}`], find: [askW ? "N(\\mathrm{H_2O})" : "N(\\mathrm{CO_2})"] },
            formula: [askW ? "N(\\mathrm{H_2O}) = \\dfrac{N(\\mathrm{H})}{2}" : "N(\\mathrm{CO_2}) = N(\\mathrm{C})"],
            solution: askW ? `Molekula ima ${h} vodikovih atomov.\n$N(\\mathrm{H_2O}) = \\dfrac{${h}}{2} = ${h / 2}$` : `Molekula ima ${n} ogljikov${n === 1 ? " atom" : "e atome"}.\n$N(\\mathrm{CO_2}) = ${n}$`,
          };
        }
        const P = r.pick([
          { q: "Kaj je glavna sestavina zemeljskega plina?", ok: "metan", wrong: [["propan", "Propan je glavna sestavina utekočinjenega naftnega plina v jeklenkah."], ["ogljikov dioksid", "CO₂ ni gorljiv; nastane pri gorenju."], ["vodik", "Zemeljski plin je večinoma metan, CH₄."]] },
          { q: "Kaj nastane pri popolnem gorenju ogljikovodikov?", ok: "ogljikov dioksid in voda", wrong: [["ogljikov oksid in voda", "Ogljikov oksid nastaja pri nepopolnem gorenju (premalo kisika)."], ["saje in vodik", "Saje nastajajo pri nepopolnem gorenju; vodik zgori v vodo."], ["samo ogljikov dioksid", "Vodik iz goriva se spremeni v vodo."]] },
          { q: "Kaj nastaja pri gorenju ob premajhnem dovodu zraka (nepopolno gorenje)?", ok: "strupeni ogljikov oksid in saje", wrong: [["več ogljikovega dioksida", "Pri pomanjkanju kisika ogljik ne zgori popolnoma do CO₂."], ["kisik", "Kisik se pri gorenju porablja."], ["samo vodna para", "Ogljik iz goriva pri tem tvori CO in saje."]] },
          { q: "S katerim postopkom v rafineriji ločijo nafto na frakcije?", ok: "s frakcionirano destilacijo", wrong: [["s filtracijo", "Filtracija loči trdne delce od tekočine."], ["z magnetom", "Sestavine nafte niso magnetne."], ["s kristalizacijo", "Frakcije ločimo po vreliščih, z destilacijo."]] },
          { q: "Katera frakcija nafte ima najnižje vrelišče?", ok: "plini (npr. propan, butan)", wrong: [["bitumen (asfalt)", "Bitumen ima najdaljše molekule in najvišje vrelišče."], ["dizelsko gorivo", "Dizel ima srednje dolge molekule."], ["mazalno olje", "Mazalno olje ima dolge molekule in visoko vrelišče."]] },
          { q: "Zakaj je ogljikov oksid nevaren?", ok: "ker se veže na hemoglobin in prepreči prenos kisika v krvi", wrong: [["ker močno smrdi", "Ogljikov oksid je brez vonja, zato je še posebej nevaren."], ["ker je kisel in razjeda pljuča", "Nevaren je zaradi vezave na hemoglobin."], ["ker povzroča kisli dež", "Kisli dež povzročata predvsem SO₂ in dušikovi oksidi."]] },
          { q: "Kateri plin, ki nastaja pri gorenju fosilnih goriv, najbolj prispeva k učinku tople grede?", ok: "ogljikov dioksid", wrong: [["kisik", "Kisik se pri gorenju porablja."], ["dušik", "Dušik iz zraka pri tem ne nastaja kot toplogredni plin."], ["vodna para iz goriva", "Glavni problem fosilnih goriv je CO₂, ki se kopiči v ozračju."]] },
        ]);
        return concept(r, {
          ...P,
          hint: "Pomisli na sestavo goriv (ogljik in vodik) in na to, kaj nastane, ko se povežeta s kisikom.",
          given: [T("fosilna goriva")],
          find: [T("pravilni odgovor")],
          sol: ["Nafta in zemeljski plin sta zmesi ogljikovodikov; pri popolnem gorenju nastaneta CO₂ in voda, pri nepopolnem tudi CO in saje.", `Pravilno: ${P.ok}.`],
        });
      }
      if (level === 2) {
        if (r.next() < 0.6) return coefTask(r.pick(FUELS.slice(0, 8)), true);
        const [gen, n, h] = r.pick(FUELS.slice(0, 8));
        const per = n + h / 4; // molekul O2 na eno molekulo goriva
        const k = r.pick([1, 2, 3, 4, 5, 10].filter((x) => Number.isInteger(x * per)));
        const O2 = k * per;
        const f = `C${n > 1 ? n : ""}H${h}`;
        return {
          text: `Koliko molekul kisika ($\\mathrm{O_2}$) je potrebnih za popolno gorenje ${k === 1 ? "ene molekule" : `$${k}$ molekul`} ${gen} ($${ch(f)}$)?`,
          answer: num(O2, null, null, [[k * (2 * n + h / 2), "To je število kisikovih atomov. Molekula O₂ ima 2 atoma."], [k * (n + 1), "Kisik se porabi za ogljik (CO₂) in za vodik (H₂O)."], [k * 2 * n, "Upoštevaj tudi kisik, ki se porabi za nastanek vode."]]),
          hint: "Ogljik zgori v $\\mathrm{CO_2}$, vodik v $\\mathrm{H_2O}$. Preštej kisikove atome v produktih in jih razdeli na molekule $\\mathrm{O_2}$.",
          data: { given: [`\\text{gorivo: } ${ch(f)}`, ...(k > 1 ? [`N = ${k}`] : [])], find: ["N(\\mathrm{O_2})"] },
          formula: [`${ch(f)} + \\mathrm{O_2} \\rightarrow \\mathrm{CO_2} + \\mathrm{H_2O}`, "N(\\mathrm{O}) = 2 \\cdot N(\\mathrm{CO_2}) + N(\\mathrm{H_2O})"],
          solution: `Iz ene molekule: ${n} $\\mathrm{CO_2}$ in ${h / 2} $\\mathrm{H_2O}$, kar je $2 \\cdot ${n} + ${h / 2} = ${2 * n + h / 2}$ atomov O.\nTo je $${tx(per)}$ molekul $\\mathrm{O_2}$ na eno molekulo goriva.\n$N(\\mathrm{O_2}) = ${k} \\cdot ${tx(per)} = ${O2}$`,
        };
      }
      if (r.next() < 0.5) {
        const fuel = r.pick([["bencinski", 2.3, "bencina"], ["dizelski", 2.65, "dizelskega goriva"]]);
        const c = r.dec(4.5, 9.5, 1);
        const d = r.int(4, 160) * 5;
        const V = (c * d) / 100;
        const m = V * fuel[1];
        return {
          text: `${name} se z družino pelje $${qty(d, "km")}$ daleč z avtom, ki ima ${fuel[0]} motor in porabi $${tx(c)}$ litra goriva na $100\\ \\mathrm{km}$. Pri gorenju $1\\ \\mathrm{L}$ ${fuel[2]} nastane $${qty(tx(fuel[1]), "kg")}$ ogljikovega dioksida. Koliko kg $\\mathrm{CO_2}$ izpusti avto? Zaokroži na eno decimalko.`,
          answer: num(m, "kg", 1, [[c * d * fuel[1], "Poraba je na 100 km: razdaljo najprej deli s 100."], [V, "To je porabljeno gorivo v litrih; pomnoži še s CO₂ na liter."]]),
          hint: "Najprej izračunaj, koliko litrov goriva avto porabi na tej poti. Nato pomnoži z maso $\\mathrm{CO_2}$ na liter.",
          data: { given: [dat("s", d, "km"), `p = ${tx(c)}\\ \\mathrm{L}/100\\ \\mathrm{km}`, `m_1 = ${tx(fuel[1])}\\ \\mathrm{kg/L}`], find: ["m(\\mathrm{CO_2})"] },
          formula: ["V = p \\cdot \\dfrac{s}{100\\ \\mathrm{km}}", "m = V \\cdot m_1"],
          solution: `$V = ${tx(c)}\\ \\mathrm{L} \\cdot \\dfrac{${d}}{100} ${res(V, 2, "L")}$\n$m = ${tx(roundHalfUp(V, 2))}\\ \\mathrm{L} \\cdot ${tx(fuel[1])}\\ \\mathrm{kg/L} ${res(m, 1, "kg")}$`,
        };
      }
      return coefTask(r.pick(FUELS.slice(0, 5)), false);
    },
  },
  {
    id: "dod-os-alkoholi",
    topics: ["KEM-OS-9/alkoholi"],
    gen(level, r) {
      const name = r.pick(NAMES);
      const DR = [["pivo", [330, 500], 5], ["vino", [100, 200], 12], ["žganje", [20, 30, 40], 40], ["radler", [330, 500], 2], ["penina", [100, 150], 11], ["liker", [30, 40], 25], ["jabolčnik", [330, 500], 6]];
      if (level === 1) {
        if (r.next() < 0.55) {
          const [d, vols, p] = r.pick(DR);
          const V = r.pick(vols);
          const Ve = (V * p) / 100;
          return {
            text: `Na steklenici piše »${p} vol. %« alkohola (etanola). Koliko mL etanola je v $${qty(V, "mL")}$ ${d === "pivo" ? "piva" : d === "vino" ? "vina" : d === "žganje" ? "žganja" : d === "radler" ? "radlerja" : d === "penina" ? "penine" : d === "liker" ? "likerja" : "jabolčnika"}?`,
            answer: num(Ve, "mL", 1, [[V - Ve, "To je prostornina ostalih snovi (večinoma vode)."], [V * p, "Odstotek pomeni stotinke: deli s 100."]]),
            hint: "Volumski odstotek pove, koliko mL etanola je v 100 mL pijače.",
            data: { given: [dat("V", V, "mL"), `\\varphi = ${p}\\ \\%`], find: ["V_e"] },
            formula: ["V_e = \\varphi \\cdot V"],
            solution: `${p} vol. % pomeni ${p} mL etanola v 100 mL pijače.\n$V_e = \\dfrac{${p}}{100} \\cdot ${V}\\ \\mathrm{mL} ${res(Ve, 1, "mL")}$`,
          };
        }
        const n = r.int(1, 4);
        const NAME = ["metanol", "etanol", "propanol", "butanol"][n - 1];
        const f = `${n === 1 ? "CH3" : `C${n}H${2 * n + 1}`}OH`;
        const alk = ["metan", "etan", "propan", "butan"][n - 1];
        const acid = ["metanojska kislina", "etanojska kislina", "propanojska kislina", "butanojska kislina"][n - 1];
        const other = ["etanol", "propanol", "butanol", "propanol"][n - 1];
        return concept(r, {
          q: `Kako se imenuje spojina s formulo $${ch(f)}$?`,
          ok: NAME,
          wrong: [[alk, "Alkan nima hidroksilne skupine OH."], [acid, "Karboksilna kislina ima skupino COOH."], [other, `Predpona pove število ogljikovih atomov; tu jih je ${n}.`]],
          hint: "Skupina $\\mathrm{OH}$ na ogljikovodikovi verigi pomeni alkohol (končnica -ol). Preštej ogljikove atome.",
          given: [`\\text{formula: } ${ch(f)}`],
          find: [T("ime")],
          sol: [`Molekula ima ${n} ${n === 1 ? "ogljikov atom" : n === 2 ? "ogljikova atoma" : "ogljikove atome"} in skupino OH.`, `To je ${NAME}.`],
        });
      }
      if (level === 2) {
        if (r.next() < 0.5) {
          const [d, vols, p] = r.pick(DR);
          const V = r.pick(vols);
          const unitL = V >= 100 ? "dL" : "cL";
          const Vshow = unitL === "dL" ? V / 100 : V / 10;
          const Ve = (V * p) / 100;
          const m = Ve * 0.79;
          return {
            text: `Kozarec vsebuje $${qty(tx(Vshow), unitL)}$ pijače (${d}) z ${p} vol. % etanola. Kolikšna je masa etanola v kozarcu? Gostota etanola je $0{,}79\\ \\mathrm{g/mL}$. Zaokroži na eno decimalko.`,
            answer: num(m, "g", 1, [[Ve, "To je prostornina etanola v mL; z gostoto jo pretvori v maso."], [(Vshow * p) / 100 * 0.79, `Prostornino pijače najprej pretvori v mL (1 ${unitL} = ${unitL === "dL" ? 100 : 10} mL).`]]),
            hint: `Pretvori prostornino v mL (1 ${unitL} = ${unitL === "dL" ? 100 : 10} mL), izračunaj prostornino etanola in jo pomnoži z gostoto.`,
            data: { given: [dat("V", tx(Vshow), unitL), `\\varphi = ${p}\\ \\%`, "\\rho = 0{,}79\\ \\mathrm{g/mL}"], find: ["m_e"] },
            formula: ["V_e = \\varphi \\cdot V", "m_e = \\rho \\cdot V_e"],
            solution: `$V = ${qty(tx(Vshow), unitL)} = ${qty(V, "mL")}$\n$V_e = \\dfrac{${p}}{100} \\cdot ${V}\\ \\mathrm{mL} = ${qty(tx(Ve), "mL")}$\n$m_e = 0{,}79\\ \\mathrm{g/mL} \\cdot ${tx(Ve)}\\ \\mathrm{mL} ${res(m, 1, "g")}$`,
          };
        }
        const E = r.pick([
          ["popolnega gorenja etanola", ["C2H5OH", "O2"], ["CO2", "H2O"], [1, 3, 2, 3]],
          ["popolnega gorenja metanola", ["CH3OH", "O2"], ["CO2", "H2O"], [2, 3, 2, 4]],
          ["popolnega gorenja propanola", ["C3H7OH", "O2"], ["CO2", "H2O"], [2, 9, 6, 8]],
          ["popolnega gorenja butanola", ["C4H9OH", "O2"], ["CO2", "H2O"], [1, 6, 4, 5]],
          ["alkoholnega vrenja glukoze", ["C6H12O6"], ["C2H5OH", "CO2"], [1, 2, 2]],
        ]);
        const t = (k) => (k === 1 ? "" : `${k}\\,`);
        return {
          text: `Uredi enačbo ${E[0]}. Vpiši koeficiente po vrsti, ločene z vejico:\n\n$$${E[1].map((f, i) => `\\square_{${i + 1}}\\,${ch(f)}`).join(" + ")} \\rightarrow ${E[2].map((f, i) => `\\square_{${E[1].length + i + 1}}\\,${ch(f)}`).join(" + ")}$$`,
          answer: { type: "coefficients", values: E[3] },
          inputHint: `npr. ${E[3].map(() => "1").join(", ")}`,
          hint: "Najprej uredi ogljik, nato vodik, kisik na koncu. Ne pozabi kisikovega atoma v skupini OH.",
          data: { given: [`${T("reaktanti")} = ${E[1].map((f) => ch(f)).join(" + ")}`, `${T("produkti")} = ${E[2].map((f) => ch(f)).join(" + ")}`], find: [T("koeficienti")] },
          formula: ["\\text{število atomov vsakega elementa: levo} = \\text{desno}"],
          solution: `Preverimo atome: C, H in O so na obeh straneh enaki.\n$$${E[1].map((f, i) => `${t(E[3][i])}${ch(f)}`).join(" + ")} \\rightarrow ${E[2].map((f, i) => `${t(E[3][E[1].length + i])}${ch(f)}`).join(" + ")}$$`,
        };
      }
      if (r.next() < 0.55) {
        const [d, vols, p] = r.pick(DR.filter((x) => x[2] >= 5));
        const V = r.pick(vols);
        const kg = r.int(45, 95);
        const m = (V * p * 0.79) / 100;
        const rate = 0.1 * kg;
        const h = m / rate;
        return {
          text: `${r.pick(["Odrasel moški", "Odrasla ženska", "Odrasla oseba"])} z maso $${qty(kg, "kg")}$ popije $${qty(V, "mL")}$ pijače (${d}) z ${p} vol. % etanola. Jetra razgradijo približno $0{,}1\\ \\mathrm{g}$ etanola na kilogram telesne mase v eni uri. Koliko ur traja, da se ves etanol razgradi? Gostota etanola je $0{,}79\\ \\mathrm{g/mL}$. Zaokroži na eno decimalko.`,
          answer: num(h, "h", 1, [[(V * p) / 100 / rate, "Prostornino etanola z gostoto najprej pretvori v maso."], [m / 0.1, "Hitrost razgradnje je odvisna od telesne mase: 0,1 g na kg v uri."]], { unitAlternatives: ["ur", "ure", "uri", "ura"] }),
          hint: "Izračunaj prostornino in maso etanola, nato koliko gramov razgradijo jetra v eni uri pri tej telesni masi.",
          data: { given: [dat("V", V, "mL"), `\\varphi = ${p}\\ \\%`, "\\rho = 0{,}79\\ \\mathrm{g/mL}", dat("m_t", kg, "kg"), "k = 0{,}1\\ \\mathrm{g/(kg \\cdot h)}"], find: ["t"] },
          formula: ["m_e = \\rho \\cdot \\varphi \\cdot V", "t = \\dfrac{m_e}{k \\cdot m_t}"],
          solution: `$V_e = \\dfrac{${p}}{100} \\cdot ${V}\\ \\mathrm{mL} = ${qty(tx((V * p) / 100), "mL")}$, $m_e = 0{,}79 \\cdot ${tx((V * p) / 100)}\\ \\mathrm{g} ${res(m, 2, "g")}$\nV eni uri: $0{,}1 \\cdot ${kg} = ${qty(tx(rate), "g")}$\n$t = \\dfrac{${tx(roundHalfUp(m, 2))}}{${tx(rate)}}\\ \\mathrm{h} ${res(h, 1, "h")}$`,
        };
      }
      const P = r.pick([
        { q: "Kako etanol vpliva na voznika?", ok: "upočasni odzivni čas in zmanjša zbranost", wrong: [["izboljša reflekse", "Etanol deluje pomirjevalno na živčevje in reflekse upočasni."], ["nima vpliva, če se voznik dobro počuti", "Že majhne količine etanola podaljšajo reakcijski čas."], ["vpliva le na jetra, ne na možgane", "Etanol preide v kri in deluje na možgane."]] },
        { q: "Ali kava ali hladen tuš pospešita razgradnjo alkohola v telesu?", ok: "ne, razgradnjo določajo jetra s približno stalno hitrostjo", wrong: [["da, kava ga hitro razgradi", "Kava morda prebudi, alkohola v krvi pa ne zmanjša."], ["da, hladen tuš ga izloči skozi kožo", "Skozi kožo se izloči le zanemarljiv del."], ["da, če popijemo veliko vode", "Voda ne pospeši dela jeter."]] },
        { q: "Zakaj se po pitju alkohola zdi, da nas greje, telo pa v resnici izgublja toploto?", ok: "ker se razširijo žile v koži in telo odda več toplote", wrong: [["ker etanol pri gorenju v telesu močno segreje kri", "Občutek toplote je posledica razširjenih žil v koži."], ["ker etanol poveča telesno temperaturo za nekaj stopinj", "Telesna temperatura se zaradi izgub celo zniža."], ["ker etanol izolira kožo", "Etanol ne izolira; telo izgublja toploto."]] },
        { q: "Katera lastnost etanola je pravilna?", ok: "z vodo se meša v vsakem razmerju in je gorljiv", wrong: [["v vodi je netopen kot olje", "Skupina OH omogoča mešanje z vodo."], ["ni gorljiv, zato ga uporabljamo za gašenje", "Etanol je lahko vnetljiv."], ["je trdna snov pri sobni temperaturi", "Etanol je tekočina (vrelišče 78 °C)."]] },
        { q: "Zakaj je metanol posebej nevaren?", ok: "ker je strupen; že majhna količina lahko povzroči slepoto ali smrt", wrong: [["ker je radioaktiven", "Metanol ni radioaktiven; je strupen."], ["ker ni gorljiv", "Metanol je gorljiv."], ["ni nevaren, je enak etanolu", "Metanol se razgradi v strupene snovi."]] },
      ]);
      return concept(r, {
        ...P,
        hint: "Etanol se hitro vsrka v kri, deluje na živčevje, razgrajujejo pa ga jetra.",
        given: [`${T("snov")} = ${T("etanol")}`],
        find: [T("pravilna trditev")],
        sol: ["Etanol je gorljiva tekočina, ki se meša z vodo; v telesu deluje na živčevje, razgrajujejo ga jetra počasi in s stalno hitrostjo.", `Pravilno: ${P.ok}.`],
      });
    },
  },
  {
    id: "dod-os-karboksilne-kisline-estri",
    topics: ["KEM-OS-9/karboksilne-kisline-in-estri"],
    gen(level, r) {
      const name = r.pick(NAMES);
      const ACI = [[1, "metanojska (mravljinčna) kislina", "HCOOH", "metanoat", "metanojske kisline"], [2, "etanojska (ocetna) kislina", "CH3COOH", "etanoat", "etanojske kisline"], [3, "propanojska kislina", "C2H5COOH", "propanoat", "propanojske kisline"], [4, "butanojska (maslena) kislina", "C3H7COOH", "butanoat", "butanojske kisline"]];
      const ALC = [[1, "metanol", "CH3OH", "metil", "metanola"], [2, "etanol", "C2H5OH", "etil", "etanola"], [3, "propanol", "C3H7OH", "propil", "propanola"], [4, "butanol", "C4H9OH", "butil", "butanola"]];
      if (level === 1) {
        if (r.next() < 0.5) {
          const w = r.pick([4, 5, 6, 9]);
          const m = r.pick([250, 500, 750, 1000]);
          const ma = (m * w) / 100;
          return {
            text: `${name} kupi steklenico kisa z maso $${qty(m, "g")}$. Na nalepki piše, da je masni delež ocetne kisline ${w} %. Koliko gramov ocetne kisline je v steklenici?`,
            answer: num(ma, "g", null, [[m * w, "Odstotek pomeni stotinke: deli s 100."], [m - ma, "To je masa vode in drugih snovi."]]),
            hint: "Masni delež pove, koliko gramov kisline je v 100 g kisa.",
            data: { given: [dat("m", m, "g"), `w = ${w}\\ \\%`], find: ["m_k"] },
            formula: ["m_k = w \\cdot m"],
            solution: `${w} % pomeni ${w} g kisline v 100 g kisa.\n$m_k = \\dfrac{${w}}{100} \\cdot ${m}\\ \\mathrm{g} = ${qty(tx(ma), "g")}$`,
          };
        }
        const [n, nmA, f] = r.pick(ACI);
        const alc = ALC[n - 1][1];
        const other = ACI[n % 4][1];
        return concept(r, {
          q: `Kako se imenuje karboksilna kislina s formulo $${ch(f)}$?`,
          ok: nmA,
          wrong: [[alc, "Alkohol ima skupino OH, kislina pa COOH."], [other, `Preštej vse ogljikove atome, tudi tistega v skupini COOH: tu jih je ${n}.`], [["metan", "etan", "propan", "butan"][n - 1], "Alkan nima funkcionalne skupine; kislina ima skupino COOH."]],
          hint: "Skupina $\\mathrm{COOH}$ pomeni karboksilno kislino. Preštej vse ogljikove atome, tudi tistega v skupini COOH.",
          given: [`\\text{formula: } ${ch(f)}`],
          find: [T("ime")],
          sol: [`Molekula ima ${n} ${n === 1 ? "ogljikov atom" : n === 2 ? "ogljikova atoma" : "ogljikove atome"} in skupino COOH.`, `To je ${nmA}.`],
        });
      }
      const [a, nmA, fA, anoat, genA] = r.pick(ACI);
      const [b, nmB, fB, alkyl, genB] = r.pick(ALC);
      const ester = `${alkyl} ${anoat}`;
      if (level === 2) {
        if (r.next() < 0.5) {
          const wrong = [[`${ALC[a - 1][3]} ${ACI[b - 1][3]}`, "Prvi del imena pride iz alkohola (alkil), drugi iz kisline (-oat)."], [`${alkyl} ${["metan", "etan", "propan", "butan"][a - 1]}ol`, "Ester ima končnico -oat, ki pride iz kisline."], [`${nmB} ${anoat}`, "Ime alkohola se v estru spremeni v alkil (npr. etanol → etil)."]].filter((w) => w[0] !== ester);
          return concept(r, {
            q: `Kako se imenuje ester, ki nastane pri reakciji ${genA} ${b === 1 ? "z metanolom" : b === 2 ? "z etanolom" : b === 3 ? "s propanolom" : "z butanolom"}?`,
            ok: ester,
            wrong,
            hint: "Ime estra: najprej alkil iz alkohola (metil, etil, propil …), nato ime kisline s končnico -oat.",
            given: [`${T("kislina")} = ${T(nmA)}`, `${T("alkohol")} = ${T(nmB)}`],
            find: [T("ime estra")],
            sol: [`Iz alkohola ${nmB} dobimo ${alkyl}, iz kisline ${anoat}.`, `Ester: ${ester} (nastane še voda).`],
          });
        }
        const askC = r.next() < 0.4;
        const C = a + b;
        const H = 2 * (a + b);
        return {
          text: `Ocetna in druge karboksilne kisline z alkoholi tvorijo estre in vodo. Koliko ${askC ? "ogljikovih" : "vodikovih"} atomov ima molekula estra, ki nastane iz ${genA} ($${ch(fA)}$) in ${genB} ($${ch(fB)}$)?`,
          answer: askC ? num(C, null, null, [[C - 1, "Ogljikovi atomi kisline in alkohola ostanejo v estru vsi."]]) : num(H, null, null, [[H + 2, "Pri nastanku estra se izloči molekula vode, ki odnese 2 vodikova atoma."], [H + 1, "Voda ima 2 vodikova atoma: enega iz kisline (COOH) in enega iz alkohola (OH)."]]),
          hint: "Ester = kislina + alkohol − voda. Seštej atome obeh reaktantov in odštej molekulo vode.",
          data: { given: [`${T("kislina")} = ${ch(fA)}`, `${T("alkohol")} = ${ch(fB)}`], find: [askC ? "N(\\mathrm{C})" : "N(\\mathrm{H})"] },
          formula: ["\\text{kislina} + \\text{alkohol} \\rightarrow \\text{ester} + \\mathrm{H_2O}"],
          solution: `Kislina: C ${a}, H ${2 * a}; alkohol: C ${b}, H ${2 * b + 2}.\n${askC ? `Voda ne vsebuje ogljika: $N(\\mathrm{C}) = ${a} + ${b} = ${C}$` : `Voda odnese 2 H: $N(\\mathrm{H}) = ${2 * a} + ${2 * b + 2} - 2 = ${H}$`}\nEster ${ester}: $${ch(`C${C}H${H}O2`)}$`,
        };
      }
      if (r.next() < 0.5) {
        const askAlc = r.next() < 0.5;
        const okT = askAlc ? nmB : nmA;
        const pool = askAlc ? ALC.map((x) => x[1]) : ACI.map((x) => x[1]);
        const wrongs = r.shuffle(pool.filter((x) => x !== okT)).slice(0, 3).map((x) => [x, askAlc ? "Prvi del imena estra (alkil) pove, kateri alkohol je reagiral." : "Drugi del imena estra (-oat) pove, katera kislina je reagirala."]);
        return concept(r, {
          q: `Ester ${ester} ima vonj po sadju. ${askAlc ? "Kateri alkohol" : "Katera kislina"} je bil${askAlc ? "" : "a"} potreben${askAlc ? "" : "a"} za njegovo pripravo?`,
          ok: okT,
          wrong: wrongs,
          hint: "V imenu estra je prvi del iz alkohola (alkil), drugi pa iz kisline (-oat).",
          given: [`${T("ester")} = ${T(ester)}`],
          find: [T(askAlc ? "alkohol" : "kislina")],
          sol: [`${alkyl} pride iz alkohola ${nmB}, ${anoat} iz kisline (${nmA}).`, `Pravilno: ${okT}.`],
        });
      }
      const w1 = r.pick([20, 25, 60, 80]);
      const w2 = r.pick([4, 5, 6, 8]);
      const m = r.pick([200, 250, 400, 500, 1000]);
      const m1 = (m * w2) / w1;
      const askW = r.next() < 0.4;
      return {
        text: `Kisova esenca vsebuje ${w1} % ocetne kisline. ${name} želi pripraviti $${qty(m, "g")}$ kisa s ${w2} % ocetne kisline. Koliko ${askW ? "gramov vode mora dodati esenci" : "gramov esence potrebuje"}? Zaokroži na eno decimalko.`,
        answer: num(askW ? m - m1 : m1, "g", 1, askW ? [[m1, "To je masa esence. Vode je preostanek do celotne mase."], [m, "Del mase kisa je esenca."]] : [[(m * w1) / w2, "Razmerje deležev si obrnil: esence je manj kot kisa."], [(m * w2) / 100, "To je masa čiste kisline; esenca pa ni čista kislina."]]),
        hint: "Masa kisline se pri redčenju ne spremeni: izračunaj, koliko kisline potrebuješ, in nato koliko esence jo vsebuje.",
        data: { given: [`w_1 = ${w1}\\ \\%`, `w_2 = ${w2}\\ \\%`, dat("m_2", m, "g")], find: [askW ? "m_v" : "m_1"] },
        formula: ["m_1 \\cdot w_1 = m_2 \\cdot w_2", "m_v = m_2 - m_1"],
        solution: `Kisline potrebujemo: $${m}\\ \\mathrm{g} \\cdot \\dfrac{${w2}}{100} = ${qty(tx((m * w2) / 100), "g")}$\n$m_1 = \\dfrac{${tx((m * w2) / 100)}\\ \\mathrm{g}}{${tx(w1 / 100)}} ${res(m1, 1, "g")}$${askW ? `\n$m_v = ${m} - ${tx(roundHalfUp(m1, 1))} ${res(m - m1, 1, "g")}$` : ""}`,
      };
    },
  },
  {
    id: "dod-os-amini-aminokisline",
    topics: ["KEM-OS-9/amini-in-aminokisline"],
    gen(level, r) {
      const AA = [["glicin", "NH2-CH2-COOH", "C2H5NO2"], ["alanin", "CH3-CH(NH2)-COOH", "C3H7NO2"], ["serin", "HO-CH2-CH(NH2)-COOH", "C3H7NO3"], ["valin", "(CH3)2CH-CH(NH2)-COOH", "C5H11NO2"], ["cistein", "HS-CH2-CH(NH2)-COOH", "C3H7NO2S"]];
      const rtex = (s) => `\\mathrm{${s.replace(/(\d+)/g, "_{$1}").replace(/-/g, "{-}")}}`;
      const tot = (f) => Object.values(parseFormula(f)).reduce((a, b) => a + b, 0);
      if (level === 1) {
        if (r.next() < 0.5) {
          const [nm, rf, f] = r.pick(AA);
          const c = parseFormula(f);
          const askH = r.next() < 0.5;
          return {
            text: `Aminokislina ${nm} ima racionalno formulo $${rtex(rf)}$. Koliko ${askH ? "vodikovih atomov" : "vseh atomov"} ima njena molekula?`,
            answer: askH ? num(c.H, null, null, [[c.H - 3, "Preštej tudi vodike v skupinah NH₂ in COOH."], [tot(f), "To so vsi atomi, ne le vodikovi."]]) : num(tot(f), null, null, [[Object.keys(c).length, "To je število različnih elementov."], [tot(f) - 3, "Preštej tudi vodike v skupinah NH₂ in COOH."]]),
            hint: "Pojdi po formuli od leve proti desni. Ne pozabi atomov v amino skupini $\\mathrm{NH_2}$ in karboksilni skupini $\\mathrm{COOH}$.",
            data: { given: [`\\text{formula} = ${rtex(rf)}`], find: [askH ? "N(\\mathrm{H})" : "N(\\text{atomov})"] },
            formula: ["\\text{molekulska formula: } " + ch(f)],
            solution: `${Object.entries(c).map(([e, n]) => `${e}: ${n}`).join(", ")}; molekulska formula $${ch(f)}$.\n${askH ? `$N(\\mathrm{H}) = ${c.H}$` : `$N = ${Object.values(c).join(" + ")} = ${tot(f)}$`}`,
          };
        }
        const P = r.pick([
          { q: "Kateri dve funkcionalni skupini ima vsaka aminokislina?", ok: "amino skupino (NH₂) in karboksilno skupino (COOH)", wrong: [["hidroksilno (OH) in karboksilno skupino (COOH)", "To bi bila hidroksi kislina; aminokislina ima dušik v skupini NH₂."], ["amino skupino (NH₂) in hidroksilno skupino (OH)", "Kisline imajo skupino COOH."], ["samo amino skupino (NH₂)", "To je amin; aminokislina ima še skupino COOH."]] },
          { q: "Iz katere spojine si lahko mislimo izpeljane amine?", ok: "iz amonijaka (NH₃), v katerem vodike zamenjajo ogljikovodikove skupine", wrong: [["iz vode", "Iz vode izpeljemo alkohole (skupina OH)."], ["iz metana", "Metan je ogljikovodik brez dušika."], ["iz dušikove kisline", "Amini so bazični, izpeljani iz amonijaka."]] },
          { q: "Kateri element vsebujejo amini, alkoholi in ogljikovodiki pa ne?", ok: "dušik", wrong: [["kisik", "Kisik je v alkoholih (skupina OH)."], ["ogljik", "Ogljik je v vseh organskih spojinah."], ["žveplo", "Značilen element aminov je dušik."]] },
          { q: "Kako reagira vodna raztopina metilamina z indikatorjem?", ok: "pokaže bazično raztopino, podobno kot amonijak", wrong: [["pokaže kislo raztopino", "Amini so izpeljani iz amonijaka in so bazični."], ["pokaže nevtralno raztopino", "Dušik v aminih sprejme proton, zato je raztopina bazična."], ["indikator se razbarva in nič ne pokaže", "Indikator pokaže bazično območje."]] },
        ]);
        return concept(r, {
          ...P,
          hint: "Amini so izpeljani iz amonijaka ($\\mathrm{NH_3}$). Aminokisline imajo poleg amino skupine še karboksilno skupino.",
          given: [T("amini in aminokisline")],
          find: [T("pravilni odgovor")],
          sol: ["Amini vsebujejo amino skupino NH₂ (izpeljani iz NH₃, bazični); aminokisline imajo amino in karboksilno skupino.", `Pravilno: ${P.ok}.`],
        });
      }
      if (level === 2) {
        if (r.next() < 0.55) {
          const n = r.int(1, 5);
          const nm = ["metilamin", "etilamin", "propilamin", "butilamin", "pentilamin"][n - 1];
          const H = 2 * n + 3;
          return {
            text: `Amin ${nm} ima formulo $${ch(`${n === 1 ? "CH3" : `C${n}H${2 * n + 1}`}NH2`)}$. Koliko vodikovih atomov ima molekula?`,
            answer: num(H, null, null, [[2 * n + 1, "Prištej še oba vodika iz amino skupine NH₂."], [2 * n + 2, "Amino skupina NH₂ ima 2 vodikova atoma."]]),
            hint: "Seštej vodike v alkilni skupini in v amino skupini $\\mathrm{NH_2}$.",
            data: { given: [`\\text{formula: } ${ch(`${n === 1 ? "CH3" : `C${n}H${2 * n + 1}`}NH2`)}`], find: ["N(\\mathrm{H})"] },
            formula: ["\\mathrm{C}_n\\mathrm{H}_{2n+1}\\mathrm{NH_2}"],
            solution: `Alkilna skupina: $2 \\cdot ${n} + 1 = ${2 * n + 1}$ H, amino skupina: 2 H.\n$N(\\mathrm{H}) = ${2 * n + 1} + 2 = ${H}$`,
          };
        }
        const P = r.pick([
          { q: "Kaj so esencialne aminokisline?", ok: "aminokisline, ki jih telo ne more izdelati samo, zato jih moramo dobiti s hrano", wrong: [["aminokisline, ki jih telo ne potrebuje", "Prav nasprotno: nujno jih potrebujemo."], ["aminokisline, ki jih telo izdela iz sladkorja", "Te so neesencialne."], ["aminokisline, ki so le v rastlinah", "Esencialne aminokisline so v mesu, jajcih, stročnicah …"]] },
          { q: "Zakaj so aminokisline pomembne za organizem?", ok: "ker so gradniki beljakovin", wrong: [["ker so glavni vir energije", "Glavni vir energije so ogljikovi hidrati in maščobe."], ["ker iz njih nastajajo maščobe", "Iz aminokislin nastajajo beljakovine."], ["ker so gradniki škroba", "Škrob je zgrajen iz glukoze."]] },
          { q: "Koliko različnih aminokislin gradi beljakovine v človeškem telesu?", ok: "približno 20", wrong: [["2", "Različnih aminokislin je veliko več."], ["približno 200", "Beljakovine gradi okoli 20 aminokislin."], ["več tisoč", "Beljakovin je veliko, aminokislin, ki jih gradijo, pa okoli 20."]] },
        ]);
        return concept(r, {
          ...P,
          hint: "Aminokisline so gradniki beljakovin. Nekatere moramo dobiti s hrano.",
          given: [T("aminokisline")],
          find: [T("pravilni odgovor")],
          sol: ["Beljakovine gradi okoli 20 aminokislin; esencialne mora telo dobiti s hrano.", `Pravilno: ${P.ok}.`],
        });
      }
      const [A, B] = [r.pick(AA), r.pick(AA)];
      const ca = parseFormula(A[2]);
      const cb = parseFormula(B[2]);
      const sum = {};
      for (const c of [ca, cb]) for (const [e, n] of Object.entries(c)) sum[e] = (sum[e] || 0) + n;
      sum.H -= 2;
      sum.O -= 1;
      const ask = r.pick(["H", "O", "all"]);
      const total = Object.values(sum).reduce((x, y) => x + y, 0);
      const val = ask === "all" ? total : sum[ask];
      const order = ["C", "H", "N", "O", "S"].filter((e) => sum[e]);
      const fD = order.map((e) => `${e}${sum[e] > 1 ? sum[e] : ""}`).join("");
      return {
        text: `Iz molekul ${A[0]}a ($${ch(A[2])}$) in ${B[0]}a ($${ch(B[2])}$) nastane dipeptid; pri tem se izloči molekula vode. Koliko ${ask === "H" ? "vodikovih" : ask === "O" ? "kisikovih" : "vseh"} atomov ima dipeptid?`,
        answer: num(val, null, null, [[ask === "all" ? total + 3 : ask === "H" ? sum.H + 2 : sum.O + 1, "Ne pozabi odšteti molekule vode, ki se izloči."], [ask === "all" ? total + 2 : ask === "H" ? sum.H + 1 : sum.O + 2, "Voda ima 2 vodikova in 1 kisikov atom."]]),
        hint: "Seštej atome obeh aminokislin in odštej molekulo vode ($\\mathrm{H_2O}$): 2 H in 1 O.",
        data: { given: [`${T(A[0])} = ${ch(A[2])}`, `${T(B[0])} = ${ch(B[2])}`], find: [ask === "all" ? "N(\\text{atomov})" : `N(\\mathrm{${ask}})`] },
        formula: ["\\text{dipeptid} = \\text{AK}_1 + \\text{AK}_2 - \\mathrm{H_2O}"],
        solution: `Skupaj: ${order.map((e) => `${e} ${(ca[e] || 0) + (cb[e] || 0)}`).join(", ")}.\nOdštejemo $\\mathrm{H_2O}$: dipeptid je $${ch(fD)}$.\n${ask === "all" ? `$N = ${order.map((e) => sum[e]).join(" + ")} = ${total}$` : `$N(\\mathrm{${ask}}) = ${val}$`}`,
      };
    },
  },
  {
    id: "dod-os-ogljikovi-hidrati",
    topics: ["KEM-OS-9/ogljikovi-hidrati"],
    gen(level, r) {
      const name = r.pick(NAMES);
      const DRK = [["kokakole", 10.6], ["ledenega čaja", 7.5], ["jabolčnega soka", 10], ["energijske pijače", 11], ["limonade", 9], ["čokoladnega mleka", 8.5], ["pomarančnega soka", 8.8]];
      if (level === 1) {
        if (r.next() < 0.5) {
          const [d, c] = r.pick(DRK);
          const V = r.pick([200, 250, 330, 500, 750]);
          const m = (c * V) / 100;
          return {
            text: `Na embalaži ${d} piše: sladkorji $${qty(tx(c), "g")}$ na $100\\ \\mathrm{mL}$. Koliko gramov sladkorja je v $${qty(V, "mL")}$ pijače? Zaokroži na eno decimalko.`,
            answer: num(m, "g", 1, [[c * V, "Podatek velja za 100 mL: deli s 100."], [c, "To je sladkor v 100 mL, ne v vsej pijači."]]),
            hint: "Najprej ugotovi, kolikokrat je v pijači po 100 mL.",
            data: { given: [`${T("sladkor")} = ${tx(c)}\\ \\mathrm{g}/100\\ \\mathrm{mL}`, dat("V", V, "mL")], find: ["m"] },
            formula: ["m = \\dfrac{V}{100\\ \\mathrm{mL}} \\cdot m_{100}"],
            solution: `$\\dfrac{${V}}{100} = ${tx(V / 100)}$\n$m = ${tx(V / 100)} \\cdot ${qty(tx(c), "g")} ${res(m, 1, "g")}$`,
          };
        }
        const P = r.pick([
          { q: `${name} kane jodovico na rezino krompirja in na kos kruha. Oboje se obarva modro vijolično. Katero snov dokazuje?`, ok: "škrob", wrong: [["glukozo", "Glukozo dokažemo drugače (npr. s Fehlingovim reagentom)."], ["beljakovine", "Beljakovine dokažemo npr. z biuretsko reakcijo."], ["maščobe", "Maščoba pusti mastni madež na papirju."]] },
          { q: "Iz katerih enot je zgrajen škrob?", ok: "iz glukoznih enot", wrong: [["iz aminokislin", "Iz aminokislin so zgrajene beljakovine."], ["iz fruktoznih enot", "Škrob in celuloza sta zgrajena iz glukoze."], ["iz glicerola in maščobnih kislin", "To so gradniki maščob."]] },
          { q: "Kateri ogljikov hidrat je monosaharid?", ok: "glukoza", wrong: [["saharoza", "Saharoza je disaharid (glukoza + fruktoza)."], ["škrob", "Škrob je polisaharid."], ["celuloza", "Celuloza je polisaharid."]] },
          { q: "Zakaj ljudje ne moremo prebaviti celuloze?", ok: "ker nimamo encimov, ki bi razgradili vezi med glukoznimi enotami v celulozi", wrong: [["ker celuloza ni zgrajena iz glukoze", "Celuloza je zgrajena iz glukoze, a so enote povezane drugače kot v škrobu."], ["ker je celuloza strupena", "Celuloza ni strupena; kot vlaknina je koristna."], ["ker je celuloza beljakovina", "Celuloza je polisaharid."]] },
          { q: "Kje v naravi nastaja glukoza?", ok: "v zelenih rastlinah pri fotosintezi", wrong: [["v živalih pri dihanju", "Pri celičnem dihanju se glukoza porablja."], ["v tleh iz kamnin", "Glukoza nastaja v rastlinah iz CO₂ in vode."], ["v ozračju iz kisika", "Za fotosintezo so potrebni CO₂, voda in svetloba."]] },
        ]);
        return concept(r, {
          ...P,
          hint: "Ogljikovi hidrati: monosaharidi (glukoza, fruktoza), disaharidi (saharoza) in polisaharidi (škrob, celuloza).",
          given: [T("ogljikovi hidrati")],
          find: [T("pravilni odgovor")],
          sol: ["Glukoza nastaja pri fotosintezi; iz glukoznih enot sta zgrajena škrob (dokaz z jodovico) in celuloza.", `Pravilno: ${P.ok}.`],
        });
      }
      if (level === 2) {
        if (r.next() < 0.5) {
          const [d, c] = r.pick(DRK);
          const V = r.pick([250, 330, 500, 1000]);
          const m = (c * V) / 100;
          const cubes = m / 4;
          return {
            text: `V $100\\ \\mathrm{mL}$ ${d} je $${qty(tx(c), "g")}$ sladkorja. ${name} popije $${qty(V, "mL")}$. Koliko kock sladkorja po $4\\ \\mathrm{g}$ je to? Zaokroži na eno decimalko.`,
            answer: num(cubes, null, 1, [[m, "To je masa sladkorja v gramih. Deli jo z maso ene kocke."], [(c * V) / 4, "Podatek velja za 100 mL: najprej deli s 100."]]),
            hint: "Najprej izračunaj maso sladkorja v vsej pijači, nato jo deli z maso ene kocke.",
            data: { given: [`${T("sladkor")} = ${tx(c)}\\ \\mathrm{g}/100\\ \\mathrm{mL}`, dat("V", V, "mL"), dat("m_k", 4, "g")], find: ["N"] },
            formula: ["m = \\dfrac{V}{100\\ \\mathrm{mL}} \\cdot m_{100}", "N = \\dfrac{m}{m_k}"],
            solution: `$m = \\dfrac{${V}}{100} \\cdot ${tx(c)}\\ \\mathrm{g} ${res(m, 2, "g")}$\n$N = \\dfrac{${tx(roundHalfUp(m, 2))}}{4} ${res(cubes, 1)}$ kock`,
          };
        }
        const E = r.pick([
          ["fotosinteze", ["CO2", "H2O"], ["C6H12O6", "O2"], [6, 6, 1, 6]],
          ["celičnega dihanja", ["C6H12O6", "O2"], ["CO2", "H2O"], [1, 6, 6, 6]],
          ["alkoholnega vrenja glukoze", ["C6H12O6"], ["C2H5OH", "CO2"], [1, 2, 2]],
          ["nastanka maltoze iz dveh molekul glukoze", ["C6H12O6"], ["C12H22O11", "H2O"], [2, 1, 1]],
        ]);
        const t = (k) => (k === 1 ? "" : `${k}\\,`);
        return {
          text: `Uredi enačbo ${E[0]}. Vpiši koeficiente po vrsti, ločene z vejico:\n\n$$${E[1].map((f, i) => `\\square_{${i + 1}}\\,${ch(f)}`).join(" + ")} \\rightarrow ${E[2].map((f, i) => `\\square_{${E[1].length + i + 1}}\\,${ch(f)}`).join(" + ")}$$`,
          answer: { type: "coefficients", values: E[3] },
          inputHint: `npr. ${E[3].map(() => "1").join(", ")}`,
          hint: "Začni z ogljikom, nato vodik, kisik na koncu. Glukoza ima 6 C, 12 H in 6 O.",
          data: { given: [`${T("reaktanti")} = ${E[1].map((f) => ch(f)).join(" + ")}`, `${T("produkti")} = ${E[2].map((f) => ch(f)).join(" + ")}`], find: [T("koeficienti")] },
          formula: ["\\text{število atomov vsakega elementa: levo} = \\text{desno}"],
          solution: `Število atomov C, H in O mora biti na obeh straneh enako.\n$$${E[1].map((f, i) => `${t(E[3][i])}${ch(f)}`).join(" + ")} \\rightarrow ${E[2].map((f, i) => `${t(E[3][E[1].length + i])}${ch(f)}`).join(" + ")}$$`,
        };
      }
      const kk = r.int(0, 2);
      if (kk === 0) {
        const n = r.pick([2, 10, 20, 50, 100, 500, 1000]);
        return {
          text: `${n === 2 ? "$2$ molekuli" : `$${n}$ molekul`} glukoze se poveže${n === 2 ? "ta" : ""} v ${n === 2 ? "disaharid (maltozo)" : "verigo škroba"}. Pri vsaki novi vezi med dvema glukoznima enotama se izloči ena molekula vode. Koliko molekul vode se izloči?`,
          answer: num(n - 1, null, null, [[n, "Med n enotami v verigi je n − 1 vezi."], [2 * n, "Vsaka vez izloči le eno molekulo vode."]]),
          hint: "Nariši verigo nekaj enot in preštej vezi med njimi.",
          data: { given: [`n = ${n}`], find: ["N(\\mathrm{H_2O})"] },
          formula: ["N(\\text{vezi}) = n - 1"],
          solution: `V verigi z $${n}$ enotami je $${n} - 1 = ${n - 1}$ vezi.\nVsaka vez izloči eno molekulo vode: $N(\\mathrm{H_2O}) = ${n - 1}$`,
        };
      }
      if (kk === 1) {
        const askO = r.next() < 0.5;
        return {
          text: `Disaharid saharoza nastane iz glukoze in fruktoze (obe imata formulo $${ch("C6H12O6")}$), pri tem se izloči molekula vode. Koliko ${askO ? "kisikovih" : "vodikovih"} atomov ima molekula saharoze?`,
          answer: num(askO ? 11 : 22, null, null, askO ? [[12, "Voda odnese en kisikov atom."], [6, "Saharoza je iz dveh enot, ne ene."]] : [[24, "Voda odnese dva vodikova atoma."], [12, "Saharoza je iz dveh enot, ne ene."]]),
          hint: "Seštej atome obeh monosaharidov in odštej molekulo vode.",
          data: { given: [`${T("glukoza")} = ${T("fruktoza")} = ${ch("C6H12O6")}`], find: [askO ? "N(\\mathrm{O})" : "N(\\mathrm{H})"] },
          formula: [`${ch("C6H12O6")} + ${ch("C6H12O6")} \\rightarrow \\text{saharoza} + \\mathrm{H_2O}`],
          solution: `Skupaj: C 12, H 24, O 12.\nOdštejemo $\\mathrm{H_2O}$: saharoza je $${ch("C12H22O11")}$, $N(\\mathrm{${askO ? "O" : "H"}}) = ${askO ? 11 : 22}$`,
        };
      }
      const drinks = r.shuffle(DRK).slice(0, 2);
      const V1 = r.pick([250, 330, 500]);
      const V2 = r.pick([200, 250, 330]);
      const m = (drinks[0][1] * V1 + drinks[1][1] * V2) / 100;
      const pct = (m / 50) * 100;
      return {
        text: `Priporočeno je, da na dan zaužijemo največ $50\\ \\mathrm{g}$ dodanega sladkorja. ${name} popije $${qty(V1, "mL")}$ ${drinks[0][0]} ($${tx(drinks[0][1])}\\ \\mathrm{g}/100\\ \\mathrm{mL}$) in $${qty(V2, "mL")}$ ${drinks[1][0]} ($${tx(drinks[1][1])}\\ \\mathrm{g}/100\\ \\mathrm{mL}$). Koliko odstotkov dnevne meje je to? Zaokroži na celo število.`,
        answer: num(pct, "%", 0, [[m, "To je masa sladkorja v gramih. Primerjaj jo s 50 g v odstotkih."], [((drinks[0][1] + drinks[1][1]) / 50) * 100, "Upoštevaj prostornini pijač, ne le podatka za 100 mL."]]),
        hint: "Za vsako pijačo izračunaj maso sladkorja, ju seštej in primerjaj s 50 g.",
        data: { given: [dat("V_1", V1, "mL"), dat("V_2", V2, "mL"), dat("m_{max}", 50, "g")], find: ["\\text{delež}"] },
        formula: ["m = \\dfrac{V_1}{100} \\cdot c_1 + \\dfrac{V_2}{100} \\cdot c_2", "\\text{delež} = \\dfrac{m}{50\\ \\mathrm{g}} \\cdot 100\\ \\%"],
        solution: `$m_1 = ${tx(V1 / 100)} \\cdot ${tx(drinks[0][1])}\\ \\mathrm{g} ${res((V1 * drinks[0][1]) / 100, 2, "g")}$, $m_2 = ${tx(V2 / 100)} \\cdot ${tx(drinks[1][1])}\\ \\mathrm{g} ${res((V2 * drinks[1][1]) / 100, 2, "g")}$\n$m ${res(m, 2, "g")}$\n$\\dfrac{${tx(roundHalfUp(m, 2))}}{50} \\cdot 100\\ \\% ${res(pct, 0, "\\%")}$`,
      };
    },
  },
  {
    id: "dod-os-mascobe",
    topics: ["KEM-OS-9/mascobe"],
    gen(level, r) {
      const name = r.pick(NAMES);
      const FOOD = [["čips", 34], ["maslo", 82], ["mlečna čokolada", 30], ["arašidi", 49], ["sir", 28], ["salama", 40], ["piškoti", 20], ["majoneza", 75]];
      const eT = "1\\ \\mathrm{g}\\ \\text{maščob} = 37\\ \\mathrm{kJ}";
      if (level === 1) {
        if (r.next() < 0.5) {
          const f = r.int(2, 40);
          return {
            text: `${name} na embalaži prebere, da ena porcija vsebuje $${qty(f, "g")}$ maščob. En gram maščob da telesu približno $37\\ \\mathrm{kJ}$ energije, en gram ogljikovih hidratov pa $17\\ \\mathrm{kJ}$. Koliko energije dajo maščobe v porciji?`,
            answer: num(37 * f, "kJ", null, [[17 * f, "Za maščobe uporabi 37 kJ na gram (17 kJ velja za ogljikove hidrate)."], [f / 37, "Pomnoži maso z energijo na gram."]]),
            hint: "Energija je sorazmerna z maso maščob.",
            data: { given: [dat("m", f, "g"), "E_1 = 37\\ \\mathrm{kJ/g}"], find: ["E"] },
            formula: ["E = m \\cdot E_1"],
            solution: `Maščobe dajo $37\\ \\mathrm{kJ}$ na gram.\n$E = ${f}\\ \\mathrm{g} \\cdot 37\\ \\mathrm{kJ/g} = ${qty(37 * f, "kJ")}$`,
          };
        }
        const P = r.pick([
          { q: "Iz česa je zgrajena molekula maščobe?", ok: "iz glicerola in treh maščobnih kislin", wrong: [["iz glukoze in maščobnih kislin", "Glukoza je ogljikov hidrat; maščobe vsebujejo glicerol."], ["iz aminokislin", "Iz aminokislin so beljakovine."], ["iz enega alkohola in ene kisline", "Maščoba je ester glicerola s tremi maščobnimi kislinami."]] },
          { q: "Zakaj je olje pri sobni temperaturi tekoče, maslo pa trdno?", ok: "ker ima olje več nenasičenih maščobnih kislin (z dvojnimi vezmi)", wrong: [["ker olje vsebuje vodo", "Olje ne vsebuje vode."], ["ker ima olje daljše maščobne kisline", "Daljše verige bi pomenile višje tališče."], ["ker je olje ogljikov hidrat", "Olje je maščoba."]] },
          { q: "Ali se maščobe raztapljajo v vodi?", ok: "ne, raztapljajo se v nepolarnih topilih (npr. bencinu)", wrong: [["da, zelo dobro", "Maščobe so nepolarne in v vodi netopne."], ["da, a le v hladni vodi", "Maščobe se v vodi ne raztapljajo pri nobeni temperaturi."], ["samo, če dodamo sol", "Sol ne raztopi maščob; pomaga milo."]] },
          { q: "Kaj nastane, ko maščobo kuhamo z raztopino natrijevega hidroksida (umiljenje)?", ok: "milo in glicerol", wrong: [["sladkor in voda", "Pri umiljenju nastanejo soli maščobnih kislin (milo)."], ["olje in kis", "Maščoba se pri tem razgradi na glicerol in milo."], ["beljakovine", "Beljakovine so iz aminokislin."]] },
          { q: "Zakaj so maščobe pomembne v prehrani?", ok: "so zaloga energije in topilo za vitamine A, D, E in K", wrong: [["so glavni gradnik mišic", "Mišice gradijo beljakovine."], ["so vir dušika", "Maščobe ne vsebujejo dušika."], ["nimajo nobene vloge", "Maščobe so pomemben vir energije."]] },
        ]);
        return concept(r, {
          ...P,
          hint: "Maščobe so estri glicerola in maščobnih kislin; so nepolarne in vir energije.",
          given: [T("maščobe")],
          find: [T("pravilni odgovor")],
          sol: ["Maščobe so estri glicerola s tremi maščobnimi kislinami; v vodi niso topne, z bazo dajo milo.", `Pravilno: ${P.ok}.`],
        });
      }
      if (level === 2) {
        if (r.next() < 0.5) {
          const f = r.int(2, 30);
          const c = r.int(5, 70);
          const p = r.int(2, 30);
          const E = 37 * f + 17 * (c + p);
          return {
            text: `Na nalepki piše za eno porcijo: maščobe $${qty(f, "g")}$, ogljikovi hidrati $${qty(c, "g")}$, beljakovine $${qty(p, "g")}$. En gram maščob da $37\\ \\mathrm{kJ}$, en gram ogljikovih hidratov ali beljakovin pa $17\\ \\mathrm{kJ}$. Kolikšna je energijska vrednost porcije?`,
            answer: num(E, "kJ", null, [[37 * (f + c + p), "Za ogljikove hidrate in beljakovine velja 17 kJ na gram, ne 37."], [17 * (f + c + p), "Maščobe dajo 37 kJ na gram."], [37 * f + 17 * c, "Upoštevaj tudi beljakovine."]]),
            hint: "Energijo maščob, ogljikovih hidratov in beljakovin izračunaj posebej in jih seštej.",
            data: { given: [dat("m_m", f, "g"), dat("m_{oh}", c, "g"), dat("m_b", p, "g")], find: ["E"] },
            formula: ["E = 37\\ \\mathrm{kJ/g} \\cdot m_m + 17\\ \\mathrm{kJ/g} \\cdot (m_{oh} + m_b)"],
            solution: `Maščobe: $${f} \\cdot 37 = ${qty(37 * f, "kJ")}$\nOgljikovi hidrati in beljakovine: $(${c} + ${p}) \\cdot 17 = ${qty(17 * (c + p), "kJ")}$\n$E = ${37 * f} + ${17 * (c + p)} = ${qty(E, "kJ")}$`,
          };
        }
        const [fd, w] = r.pick(FOOD);
        const m = r.int(2, 20) * 10;
        const mf = (m * w) / 100;
        const E = mf * 37;
        return {
          text: `${fd[0].toUpperCase()}${fd.slice(1)} vsebuje ${w} % maščob. ${name} poje $${qty(m, "g")}$. Koliko kJ energije dobi samo iz maščob, če 1 g maščob da $37\\ \\mathrm{kJ}$? Zaokroži na celo število.`,
          answer: num(E, "kJ", 0, [[m * 37, "Le del živila so maščobe: najprej izračunaj maso maščob."], [mf, "To je masa maščob v gramih; pomnoži še z 37 kJ/g."]]),
          hint: "Najprej izračunaj maso maščob v pojedeni količini, nato energijo.",
          data: { given: [dat("m", m, "g"), `w = ${w}\\ \\%`, "E_1 = 37\\ \\mathrm{kJ/g}"], find: ["E"] },
          formula: ["m_m = w \\cdot m", "E = m_m \\cdot E_1"],
          solution: `$m_m = \\dfrac{${w}}{100} \\cdot ${m}\\ \\mathrm{g} = ${qty(tx(mf), "g")}$\n$E = ${tx(mf)} \\cdot 37\\ \\mathrm{kJ} ${res(E, 0, "kJ")}$`,
        };
      }
      if (r.next() < 0.5) {
        const FA = [["palmitinska", 16, 0], ["stearinska", 18, 0], ["oleinska", 18, 1], ["linolna", 18, 2], ["linolenska", 18, 3], ["maslena", 4, 0], ["miristinska", 14, 0]];
        const [nmF, nC, db] = r.pick(FA);
        const H = 2 * nC - 2 * db;
        const show = r.next() < 0.5;
        return {
          text: `${nmF[0].toUpperCase()}${nmF.slice(1)} kislina ima ${nC} ogljikovih atomov (skupaj s tistim v skupini COOH) in ${db === 0 ? "same enojne vezi (nasičena)" : `${db} dvojn${db === 1 ? "o vez" : db === 2 ? "i vezi" : "e vezi"} med ogljikovimi atomi (nenasičena)`}. Koliko vodikovih atomov ima molekula?${show ? " Nasičena maščobna kislina ima formulo $\\mathrm{C}_{n-1}\\mathrm{H}_{2n-1}\\mathrm{COOH}$." : ""}`,
          answer: num(H, null, null, [[2 * nC, "Vsaka dvojna vez zmanjša število vodikov za 2."], [2 * nC - db, "Ena dvojna vez pomeni 2 vodika manj, ne enega."], [2 * nC - 1, "Ne pozabi vodika v skupini COOH."]]),
          hint: "Nasičena kislina z $n$ ogljiki ima $2n$ vodikov (vključno s tistim v COOH). Vsaka dvojna vez odvzame 2 vodika.",
          data: { given: [`n(\\mathrm{C}) = ${nC}`, db === 0 ? `${T("vezi C–C")} = ${T("same enojne")}` : `N(\\text{dvojnih vezi}) = ${db}`], find: ["N(\\mathrm{H})"] },
          formula: ["N(\\mathrm{H}) = 2n - 2 \\cdot N(\\text{dvojnih vezi})"],
          solution: `Nasičena kislina s ${nC} C: $${ch(`C${nC - 1}H${2 * nC - 1}COOH`)}$, to je $${2 * nC}$ H.\n$N(\\mathrm{H}) = ${2 * nC} - 2 \\cdot ${db} = ${H}$`,
        };
      }
      const f = r.int(3, 30);
      const c = r.int(10, 70);
      const p = r.int(2, 25);
      const E = 37 * f + 17 * (c + p);
      const pct = (37 * f * 100) / E;
      return {
        text: `Porcija živila vsebuje $${qty(f, "g")}$ maščob, $${qty(c, "g")}$ ogljikovih hidratov in $${qty(p, "g")}$ beljakovin (maščobe: $37\\ \\mathrm{kJ/g}$; ogljikovi hidrati in beljakovine: $17\\ \\mathrm{kJ/g}$). Koliko odstotkov energije porcije prispevajo maščobe? Zaokroži na celo število.`,
        answer: num(pct, "%", 0, [[(f * 100) / (f + c + p), "To je masni delež maščob, ne delež energije."], [(37 * f * 100) / (37 * (f + c + p)), "Za ogljikove hidrate in beljakovine velja 17 kJ/g."]]),
        hint: "Izračunaj energijo maščob in celotno energijo porcije. Delež je njuno razmerje.",
        data: { given: [dat("m_m", f, "g"), dat("m_{oh}", c, "g"), dat("m_b", p, "g")], find: ["\\text{delež energije maščob}"] },
        formula: ["E = 37 \\cdot m_m + 17 \\cdot (m_{oh} + m_b)", "\\text{delež} = \\dfrac{37 \\cdot m_m}{E} \\cdot 100\\ \\%"],
        solution: `Maščobe: $37 \\cdot ${f} = ${qty(37 * f, "kJ")}$; skupaj: $${37 * f} + 17 \\cdot ${c + p} = ${qty(E, "kJ")}$\n$\\dfrac{${37 * f}}{${E}} \\cdot 100\\ \\% ${res(pct, 0, "\\%")}$`,
      };
    },
  },
  {
    id: "dod-os-beljakovine",
    topics: ["KEM-OS-9/beljakovine"],
    gen(level, r) {
      const name = r.pick(NAMES);
      const FOOD = [["piščančjih prsi", 23], ["jajc", 13], ["kuhanega fižola", 9], ["trdega sira", 25], ["navadnega jogurta", 4], ["tune", 26], ["kuhane leče", 9], ["tofuja", 12], ["mleka", 3.4], ["arašidov", 26]];
      if (level === 1) {
        if (r.next() < 0.5) {
          const [fd, p] = r.pick(FOOD);
          const m = r.int(1, 30) * 10;
          const mp = (m * p) / 100;
          return {
            text: `V $100\\ \\mathrm{g}$ ${fd} je približno $${qty(tx(p), "g")}$ beljakovin. Koliko gramov beljakovin je v $${qty(m, "g")}$ ${fd}? Zaokroži na eno decimalko.`,
            answer: num(mp, "g", 1, [[m * p, "Podatek velja za 100 g: deli s 100."], [p, "To je količina v 100 g."]]),
            hint: "Najprej ugotovi, kolikokrat je v obroku po 100 g.",
            data: { given: [`${T("beljakovine")} = ${tx(p)}\\ \\mathrm{g}/100\\ \\mathrm{g}`, dat("m", m, "g")], find: ["m_b"] },
            formula: ["m_b = \\dfrac{m}{100\\ \\mathrm{g}} \\cdot m_{100}"],
            solution: `$\\dfrac{${m}}{100} = ${tx(m / 100)}$\n$m_b = ${tx(m / 100)} \\cdot ${tx(p)}\\ \\mathrm{g} ${res(mp, 1, "g")}$`,
          };
        }
        const P = r.pick([
          { q: "Katera vez povezuje aminokisline v beljakovini?", ok: "peptidna vez", wrong: [["ionska vez", "Aminokisline se povežejo s kovalentno peptidno vezjo."], ["vodikova vez", "Vodikove vezi le oblikujejo prostorsko zgradbo verige."], ["kovinska vez", "Kovinska vez je med atomi kovin."]] },
          { q: "Kateri element je v vseh beljakovinah, v ogljikovih hidratih in maščobah pa ga ni?", ok: "dušik", wrong: [["ogljik", "Ogljik je v vseh treh skupinah."], ["kisik", "Kisik je tudi v ogljikovih hidratih in maščobah."], ["vodik", "Vodik je v vseh treh skupinah."]] },
          { q: "Kaj se zgodi z beljakovinami v jajcu, ko ga kuhamo?", ok: "denaturirajo: spremeni se njihova prostorska zgradba", wrong: [["razpadejo na posamezne atome", "Pri kuhanju se ne pretrgajo vse vezi; spremeni se oblika verig."], ["spremenijo se v maščobe", "Beljakovine ostanejo beljakovine, le drugače zvite."], ["se raztopijo v vodi", "Beljak se strdi in postane netopen."]] },
          { q: "Zakaj potrebujemo beljakovine v hrani?", ok: "za gradnjo in obnovo celic in tkiv ter za encime", wrong: [["predvsem kot glavni vir energije", "Glavni vir energije so ogljikovi hidrati in maščobe."], ["ker iz njih nastaja škrob", "Škrob nastaja v rastlinah iz glukoze."], ["ker vsebujejo veliko maščob", "Beljakovine niso maščobe."]] },
          { q: "Kaj lahko povzroči denaturacijo beljakovin?", ok: "segrevanje, kisline, alkohol in soli težkih kovin", wrong: [["samo hlajenje", "Hlajenje beljakovin navadno ne denaturira."], ["samo voda", "Voda beljakovin ne denaturira."], ["svetloba žarnice", "Navadna svetloba beljakovin ne denaturira."]] },
        ]);
        return concept(r, {
          ...P,
          hint: "Beljakovine so dolge verige aminokislin, povezanih s peptidnimi vezmi; njihova prostorska oblika je občutljiva.",
          given: [T("beljakovine")],
          find: [T("pravilni odgovor")],
          sol: ["Beljakovine so iz aminokislin (s peptidnimi vezmi), vsebujejo dušik; segrevanje, kisline ali alkohol jih denaturirajo.", `Pravilno: ${P.ok}.`],
        });
      }
      if (level === 2) {
        if (r.next() < 0.5) {
          const n = r.int(3, 300);
          const askW = r.next() < 0.5;
          return {
            text: `Peptidna veriga je sestavljena iz ${n} aminokislin. Koliko ${askW ? "molekul vode se je izločilo pri njenem nastanku" : "peptidnih vezi je v verigi"}?`,
            answer: num(n - 1, null, null, [[n, "Med n členi verige je n − 1 vezi."], [n + 1, "Vezi je ena manj, kot je členov."]]),
            hint: "Vsaka peptidna vez poveže dve sosednji aminokislini in pri tem se izloči ena molekula vode.",
            data: { given: [`n = ${n}`], find: [askW ? "N(\\mathrm{H_2O})" : "N(\\text{vezi})"] },
            formula: ["N(\\text{vezi}) = N(\\mathrm{H_2O}) = n - 1"],
            solution: `V verigi z $${n}$ aminokislinami je $${n} - 1 = ${n - 1}$ peptidnih vezi.\n${askW ? `Pri vsaki se izloči ena molekula vode: $N(\\mathrm{H_2O}) = ${n - 1}$` : `$N(\\text{vezi}) = ${n - 1}$`}`,
          };
        }
        const kg = r.int(30, 80);
        const need = 0.8 * kg;
        const [fd, p] = r.pick(FOOD);
        const askFood = r.next() < 0.5;
        const mFood = (need * 100) / p;
        return {
          text: askFood
            ? `Človek potrebuje na dan približno $0{,}8\\ \\mathrm{g}$ beljakovin na kilogram telesne mase. ${name} tehta $${qty(kg, "kg")}$. Koliko gramov ${fd} (${tx(p).replace("{,}", ",")} g beljakovin na 100 g) bi ${g(name, "moral", "morala")} pojesti, da bi dobil${g(name, "", "a")} vse beljakovine samo iz tega živila? Zaokroži na celo število.`
            : `Človek potrebuje na dan približno $0{,}8\\ \\mathrm{g}$ beljakovin na kilogram telesne mase. Koliko gramov beljakovin potrebuje na dan ${name}, ki tehta $${qty(kg, "kg")}$? Zaokroži na eno decimalko.`,
          answer: askFood ? num(mFood, "g", 0, [[need, "To je potrebna masa beljakovin, ne živila."], [(need * p) / 100, "Živilo vsebuje le del beljakovin: deli z deležem, ne množi."]]) : num(need, "g", 1, [[kg / 0.8, "Pomnoži maso z 0,8 g/kg, ne deli."], [0.8, "To je potreba na kilogram; pomnoži s telesno maso."]]),
          hint: askFood ? "Najprej izračunaj dnevno potrebo, nato koliko živila vsebuje toliko beljakovin." : "Potreba je sorazmerna s telesno maso.",
          data: { given: askFood ? ["p = 0{,}8\\ \\mathrm{g/kg}", dat("m", kg, "kg"), `${T("beljakovine v živilu")} = ${tx(p)}\\ \\mathrm{g}/100\\ \\mathrm{g}`] : ["p = 0{,}8\\ \\mathrm{g/kg}", dat("m", kg, "kg")], find: [askFood ? "m_{\\check{z}}" : "m_b"] },
          formula: askFood ? ["m_b = p \\cdot m", "m_{\\check{z}} = \\dfrac{m_b}{" + tx(p) + "} \\cdot 100\\ \\mathrm{g}"] : ["m_b = p \\cdot m"],
          solution: `$m_b = 0{,}8 \\cdot ${kg}\\ \\mathrm{g} = ${qty(tx(need), "g")}$${askFood ? `\n$m_{\\check{z}} = \\dfrac{${tx(need)}}{${tx(p)}} \\cdot 100\\ \\mathrm{g} ${res(mFood, 0, "g")}$` : ""}`,
        };
      }
      if (r.next() < 0.5) {
        const k = r.pick([2, 3, 4, 20]);
        const n = k === 20 ? r.pick([2, 3]) : r.pick([2, 3, 4]);
        const N = k ** n;
        return {
          text: `Koliko različnih ${n === 2 ? "dipeptidov" : n === 3 ? "tripeptidov" : "tetrapeptidov"} (verig iz $${n}$ aminokislin) lahko nastane iz ${k === 20 ? "vseh 20" : k} različnih aminokislin, če se vsaka lahko ponovi in je vrstni red pomemben?`,
          answer: num(N, null, null, [[k * n, "Na vsako mesto lahko postavimo katero koli aminokislino: možnosti se množijo, ne seštevajo."], [n ** k, "Število možnosti za eno mesto je število aminokislin; potenciramo s številom mest."], [k ** n / 2, "Vrstni red je pomemben (npr. Gly-Ala ni enako Ala-Gly)."]]),
          hint: "Za vsako mesto v verigi je toliko možnosti, kolikor je aminokislin. Možnosti za vsa mesta zmnoži.",
          data: { given: [`k = ${k}`, `n = ${n}`], find: ["N"] },
          formula: ["N = k^n"],
          solution: `Vsako od ${n} mest ima ${k} možnosti.\n$N = ${k}^${n} = ${N}$`,
        };
      }
      const P = r.pick([["Hemoglobin", 574, 4], ["Inzulin", 51, 2], ["Imunoglobulin G", 1320, 4], ["Hemoglobin ploda", 574, 4], ["Kolagen", 3150, 3]]);
      const [nm, A, cN] = P;
      return {
        text: `${nm} je sestavljen iz ${cN} ločenih polipeptidnih verig, ki imajo skupaj ${A} aminokislin. Koliko peptidnih vezi je v vseh verigah skupaj?`,
        answer: num(A - cN, null, null, [[A - 1, `Verige so ločene: vsaka ima eno vez manj kot aminokislin, zato odštej ${cN}.`], [A, "Vezi je manj kot aminokislin."]]),
        hint: "V vsaki verigi je vezi za ena manj kot aminokislin. Koliko je to za vse verige skupaj?",
        data: { given: [`N(\\text{AK}) = ${A}`, `N(\\text{verig}) = ${cN}`], find: ["N(\\text{vezi})"] },
        formula: ["N(\\text{vezi}) = N(\\text{AK}) - N(\\text{verig})"],
        solution: `Vsaka veriga ima eno vez manj kot aminokislin, zato skupaj ${cN} vezi manj.\n$N(\\text{vezi}) = ${A} - ${cN} = ${A - cN}$`,
      };
    },
  },
  {
    id: "dod-os-polimeri",
    topics: ["KEM-OS-9/polimeri"],
    gen(level, r) {
      const name = r.pick(NAMES);
      const MON = [["eten", "polietena (PE)", "C2H4", 28], ["propen", "polipropena (PP)", "C3H6", 42], ["vinilklorid", "polivinilklorida (PVC)", "C2H3Cl", 62.5], ["stiren", "polistirena (PS)", "C8H8", 104]];
      if (level === 1) {
        if (r.next() < 0.5) {
          const [mn, pn, f] = r.pick(MON.slice(0, 2).concat([MON[3]]));
          const c = parseFormula(f);
          const n = r.int(2, 50) * 100;
          const askH = r.next() < 0.5;
          const val = (askH ? c.H : c.C) * n;
          return {
            text: `Veriga ${pn} je nastala iz ${grp(n).replace(/\\,/g, " ")} molekul monomera ${mn}a ($${ch(f)}$). Koliko ${askH ? "vodikovih" : "ogljikovih"} atomov ima veriga (konce verige zanemari)?`,
            answer: num(val, null, null, [[n, `Vsak monomer prispeva ${askH ? c.H : c.C} atome, ne enega.`], [askH ? c.C * n : c.H * n, askH ? "To so ogljikovi atomi." : "To so vodikovi atomi."]]),
            hint: "Pri adicijski polimerizaciji se ne izgubi noben atom: vsak monomer prispeva vse svoje atome.",
            data: { given: [`n = ${grp(n)}`, `\\text{monomer: } ${ch(f)}`], find: [askH ? "N(\\mathrm{H})" : "N(\\mathrm{C})"] },
            formula: ["N = n \\cdot N_{monomer}"],
            solution: `En monomer $${ch(f)}$ ima ${askH ? c.H : c.C} ${askH ? "vodikove" : "ogljikove"} atome.\n$N = ${grp(n)} \\cdot ${askH ? c.H : c.C} = ${grp(val)}$`,
          };
        }
        const NAT = ["škrob", "celuloza", "naravni kavčuk", "svila", "volna", "beljakovine", "DNK"];
        const SYN = [["polieten (PE)", "Polieten izdelujejo v tovarnah iz etena."], ["PVC", "PVC je sintetični polimer iz vinilklorida."], ["najlon", "Najlon je sintetično vlakno."], ["poliester", "Poliester je sintetično vlakno."], ["polistiren (stiropor)", "Polistiren je sintetični polimer."]];
        const askNat = r.next() < 0.5;
        if (askNat) {
          const ok = r.pick(NAT);
          return concept(r, {
            q: r.pick(["Kateri polimer je naraven?", `${name} razvršča polimere. Kateri od naštetih je naraven?`, "Kateri polimer nastaja v živih bitjih?"]),
            ok,
            wrong: r.shuffle(SYN).slice(0, 3),
            hint: "Naravni polimeri nastajajo v rastlinah in živalih, sintetične izdelujejo v tovarnah iz nafte.",
            given: [T("polimeri")],
            find: [T("naravni polimer")],
            sol: ["Naravni polimeri so npr. škrob, celuloza, beljakovine, kavčuk; sintetični pa PE, PVC, najlon, poliester.", `Pravilno: ${ok}.`],
          });
        }
        const [ok] = r.pick(SYN);
        return concept(r, {
          q: r.pick(["Kateri polimer je sintetičen?", `${name} razvršča polimere. Kateri od naštetih je sintetičen?`, "Kateri polimer izdelujejo iz nafte?"]),
          ok,
          wrong: r.shuffle(NAT).slice(0, 3).map((x) => [x, `${x[0].toUpperCase()}${x.slice(1)} nastaja v živih bitjih, je naraven polimer.`]),
          hint: "Sintetični polimeri so umetne snovi, ki jih izdelujejo v tovarnah, navadno iz nafte.",
          given: [T("polimeri")],
          find: [T("sintetični polimer")],
          sol: ["Sintetični polimeri (plastika, umetna vlakna) nastajajo v tovarnah iz monomerov, pridobljenih iz nafte.", `Pravilno: ${ok}.`],
        });
      }
      if (level === 2) {
        if (r.next() < 0.55) {
          const [mn, pn, f, M0] = r.pick(MON.filter((m) => m[0] !== "vinilklorid"));
          const n = r.int(5, 400) * 100;
          const M = n * M0;
          return {
            text: `Molska masa verige ${pn} je $${qty(grp(M), "g/mol")}$. Molska masa monomera ${mn}a ($${ch(f)}$) je $${qty(M0, "g/mol")}$. Iz koliko molekul monomera je nastala veriga?`,
            answer: num(n, null, null, [[M / 12, "Deli z molsko maso monomera, ne ogljika."], [M * M0, "Število monomerov je količnik mas, ne zmnožek."]]),
            hint: "Pri adicijski polimerizaciji je masa verige vsota mas vseh monomerov.",
            data: { given: [dat("M", grp(M), "g/mol"), dat("M_0", M0, "g/mol")], find: ["n"] },
            formula: ["n = \\dfrac{M}{M_0}"],
            solution: `Vsak monomer prispeva $${M0}\\ \\mathrm{g/mol}$.\n$n = \\dfrac{${grp(M)}}{${M0}} = ${grp(n)}$`,
          };
        }
        const P = r.pick([
          { q: "Zakaj je odvržena plastika velik problem za okolje?", ok: "ker v naravi razpada zelo počasi, tudi več sto let", wrong: [["ker hitro razpade v strupene pline", "Večina plastike razpada zelo počasi."], ["ker je težja od vode in vedno potone", "Mnoga plastika plava in se kopiči v morjih."], ["ker jo bakterije hitro pojedo", "Večina plastike je biološko nerazgradljiva."]] },
          { q: "Kaj je mikroplastika?", ok: "drobni delci plastike, ki pridejo v vodo, prst in hrano", wrong: [["zelo lahka plastika za embalažo", "Mikroplastika so delci, manjši od 5 mm."], ["plastika iz mikroorganizmov", "Mikroplastika nastaja z razpadom večje plastike."], ["plastika, ki se raztopi v vodi", "Mikroplastika se v vodi ne raztopi."]] },
          { q: "Zakaj plastike, kot je PVC, ne smemo kuriti doma?", ok: "ker pri gorenju nastajajo strupeni plini", wrong: [["ker sploh ne gori", "Plastika gori, pri tem pa sprošča strupene snovi."], ["ker da premalo toplote", "Problem so strupeni produkti gorenja."], ["ker se spremeni v nafto", "Pri gorenju nafta ne nastane."]] },
          { q: "Kaj je najboljši način ravnanja s plastično embalažo?", ok: "zmanjšati porabo, embalažo ponovno uporabiti in jo ločeno zbirati za recikliranje", wrong: [["zakopati jo na vrtu", "V zemlji razpada sto let in onesnažuje prst."], ["sežgati jo v peči", "Pri gorenju nastajajo strupeni plini."], ["odvreči jo v mešane odpadke", "Tako je ni mogoče reciklirati."]] },
          { q: "Kaj pomeni, da je plastika termoplastična?", ok: "pri segrevanju se zmehča in jo lahko preoblikujemo, zato jo laže recikliramo", wrong: [["pri segrevanju takoj zagori", "Termoplasti se zmehčajo, ne vžgejo takoj."], ["je odporna na vsako temperaturo", "Termoplasti se pri segrevanju zmehčajo."], ["prevaja toploto bolje kot kovine", "Plastika je slab prevodnik toplote."]] },
        ]);
        return concept(r, {
          ...P,
          hint: "Pomisli, kako dolgo plastika razpada in kaj nastane, ko jo zažgemo.",
          given: [T("plastika in okolje")],
          find: [T("pravilni odgovor")],
          sol: ["Plastika razpada zelo počasi, razpade v mikroplastiko, pri gorenju sprošča strupene pline; najboljše je zmanjšati porabo in reciklirati.", `Pravilno: ${P.ok}.`],
        });
      }
      if (r.next() < 0.5) {
        const n = r.int(2, 20) * 100;
        const M = n * 62.5;
        return {
          text: `PVC nastane s polimerizacijo vinilklorida ($${ch("C2H3Cl")}$). Veriga PVC ima molsko maso $${qty(grp(M), "g/mol")}$. Iz koliko molekul vinilklorida je nastala? Uporabi $M(\\mathrm{C}) = 12$, $M(\\mathrm{H}) = 1$ in $M(\\mathrm{Cl}) = 35{,}5\\ \\mathrm{g/mol}$.`,
          answer: num(n, null, null, [[M / 28, "Molska masa vinilklorida ni enaka etenu: vsebuje klor."], [M / 63.5, "Preveri število vodikovih atomov v monomeru (3)."], [M / 12, "Deli z molsko maso celega monomera."]]),
          hint: "Najprej izračunaj molsko maso monomera $\\mathrm{C_2H_3Cl}$. Nato deli molsko maso verige z njo.",
          data: { given: [dat("M", grp(M), "g/mol"), "M(\\mathrm{C}) = 12\\ \\mathrm{g/mol}", "M(\\mathrm{H}) = 1\\ \\mathrm{g/mol}", "M(\\mathrm{Cl}) = 35{,}5\\ \\mathrm{g/mol}"], find: ["n"] },
          formula: ["M_0 = 2 \\cdot M(\\mathrm{C}) + 3 \\cdot M(\\mathrm{H}) + M(\\mathrm{Cl})", "n = \\dfrac{M}{M_0}"],
          solution: `$M_0 = 2 \\cdot 12 + 3 \\cdot 1 + 35{,}5 = 62{,}5\\ \\mathrm{g/mol}$\n$n = \\dfrac{${grp(M)}}{62{,}5} = ${grp(n)}$`,
        };
      }
      const per = r.int(3, 15);
      const mb = r.pick([20, 25, 30, 35, 40]);
      const rec = r.pick([30, 40, 50, 60, 70]);
      const total = (per * 52 * mb) / 1000;
      const notRec = (total * (100 - rec)) / 100;
      return {
        text: `Družina ${r.pick(["Novak", "Kovač", "Horvat", "Krajnc", "Zupan"])} vsak teden porabi ${per} ${per <= 4 ? "plastenke" : "plastenk"} po $${qty(mb, "g")}$. Ločeno zbere in reciklira ${rec} % plastenk. Koliko kilogramov plastenk na leto (52 tednov) ne reciklira? Zaokroži na eno decimalko.`,
        answer: num(notRec, "kg", 1, [[(total * rec) / 100, "To je masa recikliranih plastenk."], [total, "To je vsa plastika; odštej reciklirani del."], [notRec * 1000, "Rezultat zapiši v kilogramih."]]),
        hint: "Izračunaj maso vseh plastenk v letu, nato delež, ki ni recikliran.",
        data: { given: [`N = ${per}\\ \\text{na teden}`, dat("m_1", mb, "g"), `${T("reciklirano")} = ${rec}\\ \\%`], find: ["m"] },
        formula: ["m_{leto} = N \\cdot 52 \\cdot m_1", "m = m_{leto} \\cdot (100\\ \\% - p)"],
        solution: `$m_{leto} = ${per} \\cdot 52 \\cdot ${mb}\\ \\mathrm{g} = ${qty(grp(per * 52 * mb), "g")} = ${qty(tx(total), "kg")}$\nNi reciklirano: $100\\ \\% - ${rec}\\ \\% = ${100 - rec}\\ \\%$\n$m = ${tx(total)}\\ \\mathrm{kg} \\cdot ${tx((100 - rec) / 100)} ${res(notRec, 1, "kg")}$`,
      };
    },
  },
];

for (const gnr of DODATNE_OS_FIZ_KEM) {
  const base = gnr.gen;
  gnr.gen = function (level, r) {
    return fixData(base.call(this, level, r));
  };
}
